import { Sheet, SheetContent, SheetTrigger } from "@/src/components/ui/sheet";
import React from "react";
import { Check, Copy, Power } from "lucide-react";
import useWallet from "@/src/hooks/useWallet";

const WalletConnectSection = () => {
  const {
    provider,
    walletAddress,
    walletBalance,
    connectToMetaMask,
    disconnectWallet,
    copyToClipboard,
    showTooltip,
  } = useWallet();

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
