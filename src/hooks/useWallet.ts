import { useState, useEffect } from "react";
import { providers } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { useDispatch } from "react-redux";
import { setWallet } from "@/store/slice/wallet.slice";

interface WalletHookReturnType {
  wallet_address: string | null;
  chain_id: number;
  balance: string | null;
  networkName: string | null;
}

export const WalletHook = (): WalletHookReturnType => {
  const [wallet_address, setWalletAddress] = useState<string | null>(null);
  const [chain_id, setChainID] = useState<number>(-1);
  const [balance, setBalance] = useState<string | null>(null);
  const [networkName, setNetworkName] = useState<string | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const load = async () => {
      try {
        const address = await getAddress();
        const { networkName } = await getNetworkInfo();
        const chain = await getChainInfo();
        const walletBalance = await getBalance(address);
        setWalletAddress(address?.toLowerCase() ?? null);
        setChainID(chain);
        setNetworkName(networkName);
        setBalance(walletBalance);
        dispatch(
          setWallet({
            chain_id: chain,
            wallet_address: address?.toLowerCase() ?? null,
            balance: walletBalance,
            network_name: networkName,
          }),
        );
      } catch (error) {
        console.error("Error loading wallet:", error);
      }
    };

    onAccountsChanged((_address: string[]) => {
      if (!_address[0]) return;
      setWalletAddress(_address[0].toLowerCase());
    });
    onChainChanged((_chain: string) => {
      if (!_chain) return;
      setChainID(parseInt(_chain));
    });
    load();
  }, []);

  return {
    wallet_address,
    chain_id,
    balance,
    networkName,
  };
};

const isMetaMaskInstalled = (): boolean => {
  if (typeof window === "undefined") return false;
  const { ethereum } = window;
  return Boolean(ethereum && ethereum.isMetaMask);
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

export const getBalance = async (address: string): Promise<string | null> => {
  const provider = getProvider();
  if (!provider) return null;
  try {
    const balance = await provider.getBalance(address);
    const etherBalance = formatEther(balance);
    return etherBalance;
  } catch (e) {
    console.error("Error fetching balance:", e);
    return null;
  }
};

export const disconnectMetamask = async (): Promise<boolean> => {
  if (!isMetaMaskInstalled()) return false;
  try {
    await window.ethereum.request({
      method: "wallet_requestPermissions",
      params: [
        {
          eth_accounts: {},
        },
      ],
    });
    return true;
  } catch (e) {
    console.error("Error disconnecting MetaMask:", e);
    return false;
  }
};

export const connectMetamask = async (): Promise<boolean> => {
  if (!isMetaMaskInstalled()) return false;
  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const switchToMainnet = async (): Promise<boolean> => {
  if (!isMetaMaskInstalled()) return false;
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [
        {
          chainId: `0x${parseInt(process.env.NEXT_PUBLIC_APP_CHAIN).toString(16)}`,
        },
      ],
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

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
