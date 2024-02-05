import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/ui/sheet";
import React from "react";

const WalletConnectSection = () => {
  return (
    <Sheet>
      <SheetTrigger className="text-white ">
        <div className="t bg-[#7e22ce4a] rounded-2xl px-6 text-purple-300 text-sm py-2 hover:text-gray-200">
          Connect
        </div>
      </SheetTrigger>
      <SheetContent className="bg-slate-950 border border-gray-800 rounded-xl  ">
        <SheetHeader>
          <SheetTitle className="text-white">Connect Wallet</SheetTitle>
        </SheetHeader>
        <div className="p-4 bg-slate-900 border border-gray-800 rounded-xl mt-2">
          <div className="flex items-center   text-white gap-6">
            <img
              src="https://app.uniswap.org/static/media/metamask-icon.c8b2298e68e585a7f4d9c7b7e6320715.svg"
              alt=""
              className="w-12 h-12 rounded-lg"
            />
            Meta Mask
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default WalletConnectSection;
