import { useState, useEffect } from "react";
import { ethers } from "ethers";

const useWallet = () => {
  const [provider, setProvider] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false); 

  const connectToMetaMask = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const newProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(newProvider);
        localStorage.setItem("ethereumProvider", JSON.stringify(newProvider));
        const signer = newProvider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);
        localStorage.setItem("walletAddress", address); // Store wallet address
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      console.error("MetaMask is not installed");
    }
  };

  useEffect(() => {
    const ethereumProvider = localStorage.getItem("ethereumProvider");
    const savedAddress = localStorage.getItem("walletAddress"); // Retrieve saved wallet address
    if (ethereumProvider && savedAddress) {
      setProvider(
        new ethers.providers.Web3Provider(JSON.parse(ethereumProvider)),
      );
      setWalletAddress(savedAddress);
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
    localStorage.removeItem("ethereumProvider");
    localStorage.removeItem("walletAddress"); 
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
