import React, { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/src/components/ui/sheet";
import { Check, Copy, Power } from "lucide-react";
import {
  WalletHook,
  connectMetamask,
  disconnectMetamask,
} from "@/src/hooks/useWallet";

const WalletConnectSection = () => {
  const { chain, wallet, balance, networkName } = WalletHook();
  const [showCheckIcon, setShowCheckIcon] = useState(false);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log("Copied to clipboard:", text);
      setShowCheckIcon(true);
      setTimeout(() => {
        setShowCheckIcon(false);
      }, 3000); // Hide check icon after three seconds
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

  return (
    <Sheet>
      <SheetTrigger className="text-white ">
        <div className="t bg-[#7e22ce4a] rounded-2xl px-6 text-purple-300 text-sm py-2 hover:text-gray-200">
          {wallet ? String(wallet).substring(0, 6) + "..." : "Connect"}
        </div>
      </SheetTrigger>
      <SheetContent className="bg-slate-950 border border-gray-800 rounded-xl">
        {!wallet && (
          <div className="p-4 bg-slate-900 border border-gray-800 rounded-xl mt-2">
            <div
              className="flex items-center justify-between text-white w-full cursor-pointer"
              onClick={() => {
                connectMetamask();
              }}
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
        {wallet && (
          <div className="rounded-xl mt-2">
            <div className="flex items-center  text-white">
              <div className="flex items-start w-full justify-between gap-2">
                <div className="flex items-center gap-2">
                  <img
                    src="/wallet-image.jpg"
                    alt=""
                    className="w-12 h-12 rounded-full "
                  />
                  <div className="flex items-center cursor-pointer">
                    <div
                      className="overflow-hidden whitespace-nowrap w-[150px] truncate"
                      onClick={() => copyToClipboard(wallet)}
                    >
                      <span className="text-sm font-bold">{wallet}</span>
                    </div>

                    {showCheckIcon ? (
                      <Check
                        className="text-green-500"
                        size={15}
                        onClick={() => copyToClipboard(wallet)}
                      />
                    ) : (
                      <button className="text-purple-300 hover:text-gray-200 mr-4">
                        <Copy size={15} />
                      </button>
                    )}
                  </div>
                </div>
                {wallet && (
                  <button
                    className="text-slate-400 hover:text-gray-200"
                    onClick={() => {
                      disconnectMetamask();
                    }}
                  >
                    <Power />
                  </button>
                )}
              </div>
            </div>
            <div className="mt-4">
              <div className="text-white text-3xl font-bold ">
                {balance} <span className="uppercase">{networkName}</span>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default WalletConnectSection;
