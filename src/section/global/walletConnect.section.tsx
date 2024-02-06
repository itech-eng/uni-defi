import { Sheet, SheetContent, SheetTrigger } from "@/src/components/ui/sheet";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Check, Copy, Power } from "lucide-react";

const WalletConnectSection = () => {
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
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      console.error("MetaMask is not installed");
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setWalletAddress(null);
    setWalletBalance(null);
    localStorage.removeItem("ethereumProvider");
  };

  useEffect(() => {
    const ethereumProvider = localStorage.getItem("ethereumProvider");
    if (ethereumProvider) {
      setProvider(
        new ethers.providers.Web3Provider(JSON.parse(ethereumProvider)),
      );
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

  const copyToClipboard = () => {
    const input = document.createElement("input");
    input.value = walletAddress;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
    setShowTooltip(true);
    setTimeout(() => {
      setShowTooltip(false);
    }, 2000); // Hide the tooltip after 2 seconds
  };

  return (
    <Sheet>
      <SheetTrigger className="text-white ">
        <div className="t bg-[#7e22ce4a] rounded-2xl px-6 text-purple-300 text-sm py-2 hover:text-gray-200">
          {provider ? String(walletAddress).substring(0, 6) + "..." : "Connect"}
        </div>
      </SheetTrigger>
      <SheetContent className="bg-slate-950 border border-gray-800 rounded-xl">
        {!provider && (
          <div className="p-4 bg-slate-900 border border-gray-800 rounded-xl mt-2">
            <div
              className="flex items-center justify-between text-white w-full cursor-pointer"
              onClick={connectToMetaMask}
            >
              <div className="flex items-center gap-6">
                <img
                  src="https://app.uniswap.org/static/media/metamask-icon.c8b2298e68e585a7f4d9c7b7e6320715.svg"
                  alt=""
                  className="w-12 h-12 rounded-lg"
                />
                <div>
                  <span className="text-lg font-bold">Connect To MetaMask</span>
                </div>
              </div>
            </div>
          </div>
        )}
        {provider && (
          <div className="rounded-xl mt-2">
            <div className="flex items-center  text-white">
              <div className="flex items-start w-full justify-between gap-2">
                <div className="flex items-center gap-2">
                  <img
                    src="/wallet-image.jpg"
                    alt=""
                    className="w-12 h-12 rounded-full "
                  />
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={copyToClipboard}
                  >
                    <div className="overflow-hidden whitespace-nowrap w-[150px] truncate">
                      <span className="text-sm font-bold ">
                        {walletAddress}
                      </span>
                    </div>
                    <button className="text-purple-300  hover:text-gray-200 mr-4">
                      {showTooltip ? (
                        <div className=" bg-transparent text-white text-xs flex items-center gap-2 px-2 py-1 rounded-md ">
                          <Check size={16} className="text-green-500" />
                        </div>
                      ) : (
                        <Copy size={15} />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  onClick={disconnectWallet}
                  className="text-slate-400 hover:text-gray-200"
                >
                  <Power />
                </button>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-white text-3xl font-bold">
                {walletBalance} ETH
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default WalletConnectSection;
