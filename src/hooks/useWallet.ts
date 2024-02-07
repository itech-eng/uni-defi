import { useState, useEffect } from "react";
import { providers } from "ethers";
import { formatEther } from "ethers/lib/utils";
export const WalletHook = () => {
  const [wallet, setWallet] = useState(null);
  const [chain, setChain] = useState(-1);
  const [balance, setBalance] = useState(null);
  const [networkName, setNetworkName] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const address = await getAddress();
        const { networkName } = await getNetworkInfo();
        const chain = await getChainInfo();
        setWallet(address?.toLowerCase());
        setChain(Number(chain));
        setNetworkName(networkName);

        const walletBalance = await getBalance(address);
        setBalance(walletBalance);
      } catch (error) {
        console.error("Error loading wallet:", error);
      }
    };

    onAccountsChanged((_address) => {
      if (!_address[0]) return;
      setWallet(_address[0].toLowerCase());
    });
    onChainChanged((_chain) => {
      if (!_chain) return;
      setChain(parseInt(_chain));
    });
    load();
  }, []);

  return {
    wallet,
    chain,
    balance,
    networkName,
  };
};
export const isMetaMaskInstalled = () => {
  if (typeof window === "undefined") return;
  const { ethereum } = window;
  return Boolean(ethereum && ethereum.isMetaMask);
};

export const getProvider = () => {
  if (!isMetaMaskInstalled()) return null;
  return new providers.Web3Provider(window.ethereum);
};

export const getChainInfo = async () => {
  const provider = getProvider();
  if (!provider) return -1;
  return `${(await provider.getNetwork()).chainId}`;
};

export const onAccountsChanged = (callback) => {
  if (!isMetaMaskInstalled()) return;
  window.ethereum.on("accountsChanged", callback);
};

export const onChainChanged = (callback) => {
  if (!isMetaMaskInstalled()) return;
  window.ethereum.on("chainChanged", callback);
};

export const getAddress = async () => {
  const provider = getProvider();
  if (!provider) return null;
  try {
    const accounts = await provider.listAccounts();
    return accounts.length > 0 ? accounts[0] : null;
  } catch (e) {
    return null;
  }
};

export const getNetworkInfo = async () => {
  const provider = getProvider();
  if (!provider) return null;

  try {
    const network = await provider.getNetwork();
    const networkName = network.name;

    return { networkName };
  } catch (error) {
    return null;
  }
};

export const getBalance = async (address) => {
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

export const disconnectMetamask = async () => {
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

export const connectMetamask = async () => {
  if (!isMetaMaskInstalled()) return false;
  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const switchToMainnet = async () => {
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

export const watchTransaction = (txHash, callback) => {
  const provider = getProvider();
  if (!provider) return;
  provider.once(txHash, (transaction) => {
    callback(transaction, transaction.status === 1);
  });
};
