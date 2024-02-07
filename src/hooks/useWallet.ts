import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { getFromLocalStorage, setToLocalStorage } from "../lib/helpers";

const useWallet = () => {
  const [provider, setProvider] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const connectToMetaMask = async () => {
    if (window.ethereum && typeof window !== undefined) {
      try {
        console.log("connecting to metamask");
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const newProvider = new ethers.providers.Web3Provider(window.ethereum);
        console.log(newProvider, "newProvider");
        const providerData = {
          network: newProvider.network,
        };

        setProvider(newProvider);
        await setToLocalStorage(
          "ethereumProvider",
          JSON.stringify(providerData),
        );

        const signer = newProvider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);
        await setToLocalStorage("walletAddress", address); // Store wallet address
        console.log("connected to metamask 2");
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      console.error("MetaMask is not installed");
    }
  };

  useEffect(() => {
    const ethereumProvider = getFromLocalStorage("ethereumProvider");
    const savedAddress = getFromLocalStorage("walletAddress"); // Retrieve saved wallet address
    if (ethereumProvider && savedAddress) {
      const savedProvider = new ethers.providers.Web3Provider(
        JSON.parse(ethereumProvider),
      );
      const signer = savedProvider.getSigner();
      signer
        .getAddress()
        .then((address) => {
          if (address === savedAddress) {
            setProvider(savedProvider);
            setWalletAddress(savedAddress);
          } else {
            disconnectWallet();
          }
        })
        .catch((error) => {
          console.error("Error getting address:", error);
          disconnectWallet();
        });
    }
  }, []);

  useEffect(() => {
    if (provider) {
      const getAddressAndBalance = async () => {
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);
        const balance = await provider.getBalance(address);
        setWalletBalance(ethers.utils.formatEther(balance));
      };

      getAddressAndBalance();
    }
  }, [provider]);

  const disconnectWallet = () => {
    setProvider(null);
    setWalletAddress(null);
    setWalletBalance(null);
    window.localStorage.removeItem("ethereumProvider");
    window.localStorage.removeItem("walletAddress");
  };

  const copyToClipboard = () => {
    if (walletAddress) {
      const input = document.createElement("input");
      input.value = walletAddress;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setShowTooltip(true);
      setTimeout(() => {
        setShowTooltip(false);
      }, 2000);
    }
  };

  return {
    provider,
    walletAddress,
    walletBalance,
    connectToMetaMask,
    disconnectWallet,
    copyToClipboard,
    showTooltip,
  };
};

export default useWallet;
