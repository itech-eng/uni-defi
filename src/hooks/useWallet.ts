import { useState, useEffect } from "react";
import { providers } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { useDispatch } from "react-redux";
import {
  setToInitialWallet,
  setWallet,
  walletInitialState,
  walletSliceType,
} from "@/store/slice/wallet.slice";
import { CHIAN_SLUG_MAPPING, NETWORK_DATA } from "../utils/network-data";
import { useToast } from "../components/ui/use-toast";
import { getFromLocalStorage, setToLocalStorage } from "../lib/helpers";
import { LOCAL_STORAGE_KEY } from "../utils/coreconstants";

interface WalletHookReturnType {
  connect: () => Promise<boolean>;
  disconnect: () => Promise<boolean>;
  switchToNetwork: (chain_id: number) => Promise<boolean>;
  balance: string | null;
}

interface ConnectInfo {
  chainId: string;
}

interface ProviderRpcError extends Error {
  message: string;
  code: number;
  data?: unknown;
}

interface ProviderMessage {
  type: string;
  data: unknown;
}

export const isNetworkSupported = (chainId: number): boolean => {
  const networkSlug = CHIAN_SLUG_MAPPING[chainId];
  return !!NETWORK_DATA[networkSlug];
};

export const useWallet = (): WalletHookReturnType => {
  const [balance, setBalance] = useState<string | null>(null);

  const dispatch = useDispatch();
  const { toast } = useToast();

  const loadWalletData = async () => {
    try {
      let address = "";
      let chain = null;

      if (!isDisconnected()) {
        address = await getAddress();
        // const { networkName } = await getNetworkInfo();
        chain = await getChainInfo();

        if (!isNetworkSupported(chain)) {
          disconnect();
          console.log("Network not supported");
          toast({
            title: `Network not supported`,
            description: "Please switch to a supported network.",
          });
          return;
        }

        const walletBalance = await getBalance(address);
        setBalance(walletBalance);
      }

      if (isDisconnected()) {
        dispatch(setToInitialWallet());
      } else {
        dispatch(
          setWallet<walletSliceType>({
            chain_id: chain,
            wallet_address: address?.toLowerCase() ?? "",
          }),
        );
      }
    } catch (error) {
      console.error("Error loading wallet:", error);
    }
  };

  useEffect(() => {
    const handleConnect = async (connectInfo: ConnectInfo) => {
      console.log("onConnect: ", connectInfo);
    };

    const handleDisconnect = async (error: ProviderRpcError) => {
      console.log("onDisconnect: ", error);
      disconnect();
    };

    const handleMessage = async (message: ProviderMessage) => {
      console.log("onMessage: ", message);
    };

    const handleAccountsChanged = async (accounts: string[]) => {
      console.log("Wallet address changed: ", accounts);
      if (!accounts[0]) {
        disconnect();
        return;
      }
      loadWalletData();
    };

    const handleChainChanged = async (chainId: string) => {
      if (!chainId) return;
      console.log("Wallet chain changed: ", chainId);
      // window.ethereum.off("accountsChanged", handleAccountsChanged);

      if (!isDisconnected() && !isNetworkSupported(Number(chainId))) {
        console.log("Network not supported");
        disconnect();
        toast({
          title: `Network not supported`,
          description: "Please switch to a supported network.",
        });
        return;
      }
      await loadWalletData();
      onAccountsChanged(handleAccountsChanged);
    };

    onConnect(handleConnect);
    onDisconnect(handleDisconnect);
    onMessage(handleMessage);
    onAccountsChanged(handleAccountsChanged);
    onChainChanged(handleChainChanged);
    loadWalletData();

    // Clean up subscriptions when component unmounts
    return () => {
      // window.ethereum.off("accountsChanged", handleAccountsChanged);
      // window.ethereum.off("chainChanged", handleChainChanged);
    };
  }, []);

  const connect = async (
    wallet: "metamask" | "coinbase" = "metamask",
  ): Promise<boolean> => {
    try {
      if (wallet == "metamask" && !isMetaMaskInstalled()) {
        toast({
          title: `Metamask not installed`,
          description: "Please install metamask wallet browser extension.",
        });
        throw new Error("Metamask not installed");
      }

      setToLocalStorage(LOCAL_STORAGE_KEY.IS_DISCONNECTED, "0");
      window.ethereum.request({ method: "eth_requestAccounts" });
      loadWalletData();

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const disconnect = async (): Promise<boolean> => {
    try {
      setToLocalStorage(LOCAL_STORAGE_KEY.IS_DISCONNECTED, "1");
      loadWalletData();
      return true;
    } catch (e) {
      console.error("Error disconnecting Wallet:", e);
      return false;
    }
  };

  const switchToNetwork = async (chain_id: number): Promise<boolean> => {
    if (!isMetaMaskInstalled()) return false;
    try {
      setToLocalStorage(LOCAL_STORAGE_KEY.IS_DISCONNECTED, "0");
      chain_id &&
        (await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [
            {
              chainId: `0x${chain_id.toString(16)}`,
            },
          ],
        }));
      loadWalletData();
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  return {
    connect,
    disconnect,
    switchToNetwork,
    balance,
  };
};

export function ellipseAddress(
  address: string = "",
  width: number = 7,
): string {
  return `${address.slice(0, width)}...${address.slice(-width)}`;
}

const isMetaMaskInstalled = (): boolean => {
  if (typeof window === "undefined") return false;
  const { ethereum } = window;
  const is_installed = Boolean(ethereum && ethereum.isMetaMask);
  // if (!is_installed) {
  //   const msg = 'Metamask is not installed';
  //   console.error(msg);
  // }
  return is_installed;
};

const getProvider = (): providers.Web3Provider | null => {
  if (!isMetaMaskInstalled()) return null;
  return new providers.Web3Provider(window.ethereum);
};

const getChainInfo = async (): Promise<number> => {
  const provider = getProvider();
  if (!provider) return -1;
  return (await provider.getNetwork()).chainId;
};

const onConnect = (callback: (connectInfo: ConnectInfo) => void): void => {
  if (!isMetaMaskInstalled()) return;
  window.ethereum.on("connect", callback);
};

const onDisconnect = (callback: (error: ProviderRpcError) => void): void => {
  if (!isMetaMaskInstalled()) return;
  window.ethereum.on("disconnect", callback);
};

const onMessage = (callback: (message: ProviderMessage) => void): void => {
  if (!isMetaMaskInstalled()) return;
  window.ethereum.on("disconnect", callback);
};

const onAccountsChanged = (callback: (address: string[]) => void): void => {
  if (!isMetaMaskInstalled()) return;
  window.ethereum.on("accountsChanged", callback);
};

const onChainChanged = (callback: (chainId: string) => void): void => {
  if (!isMetaMaskInstalled()) return;
  window.ethereum.on("chainChanged", callback);
};

const getAddress = async (): Promise<string | null> => {
  const provider = getProvider();
  if (!provider) return null;
  try {
    const accounts = await provider.listAccounts();
    return accounts?.[0] ?? null;
  } catch (e) {
    return null;
  }
};

const getNetworkInfo = async (): Promise<{ networkName: string | null }> => {
  const provider = getProvider();
  if (!provider) return { networkName: null };

  try {
    const network = await provider.getNetwork();
    const networkName = network.name;
    return { networkName };
  } catch (error) {
    return { networkName: null };
  }
};

export const getBalance = async (
  address: string,
  to_fixed = 5,
): Promise<string | null> => {
  const provider = getProvider();
  if (!address || !provider) return null;
  try {
    const balance = await provider.getBalance(address);
    let nativeBalance = formatEther(balance);
    nativeBalance = Math.abs(
      Number(Number(nativeBalance).toFixed(to_fixed)),
    ).toString();
    return nativeBalance;
  } catch (e) {
    console.error("Error fetching balance:", e);
    return null;
  }
};

export const isDisconnected = (): boolean => {
  return !!Number(getFromLocalStorage(LOCAL_STORAGE_KEY.IS_DISCONNECTED));
};

// export const disconnectMetamask = async (): Promise<boolean> => {
//   if (!isMetaMaskInstalled()) return false;
//   try {
//     await window.ethereum.request({
//       method: "wallet_requestPermissions",
//       params: [
//         {
//           eth_accounts: {},
//         },
//       ],
//     });
//     return true;
//   } catch (e) {
//     console.error("Error disconnecting MetaMask:", e);
//     return false;
//   }
// };

// export const connectMetamask = async (): Promise<boolean> => {
//   if (!isMetaMaskInstalled()) return false;
//   try {
//     setToLocalStorage(LOCAL_STORAGE_KEY.IS_DISCONNECTED, '0');
//     await window.ethereum.request({ method: "eth_requestAccounts" });
//     return true;
//   } catch (e) {
//     console.error(e);
//     return false;
//   }
// };

export const watchTransaction = (
  txHash: string,
  callback: (transaction: any, status: boolean) => void,
): void => {
  const provider = getProvider();
  if (!provider) return;
  provider.once(txHash, (transaction) => {
    callback(transaction, transaction.status === 1);
  });
};
