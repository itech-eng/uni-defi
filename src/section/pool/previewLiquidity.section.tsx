import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";

import { X } from "lucide-react";
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";
import { CoinData } from "@/src/utils/types";

const PreviewLiquidity = ({
  openStatus,
  setOpenStatus,
  fromCoin,
  toCoin,
  fromAmount,
  toAmount,
  confirmSwap,
}: {
  openStatus: boolean;
  setOpenStatus: any;
  fromCoin: CoinData;
  toCoin: CoinData;
  fromAmount: string;
  toAmount: string;
  confirmSwap: () => void;
}) => {
  return (
    <Dialog open={openStatus}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="sm:max-w-md border border-slate-900 bg-slate-950 h-auto flex flex-col justify-start">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-white">Add Liquidity</DialogTitle>
          <X
            className="text-white"
            size={20}
            onClick={() => setOpenStatus(false)}
          />
        </DialogHeader>
        <div className="flex  items-center justify-between space-x-2  rounded-2xl p-4">
          <div className="flex items-center gap-2 ">
            <div className="relative">
              <img
                src={fromCoin?.basic.icon}
                className="h-7 w-7 ml-[20] rounded-full"
                alt=""
              />
              <img
                src={fromCoin?.basic.icon}
                className="h-7 w-7 top-0 absolute left-2  rounded-full"
                alt=""
              />
            </div>
            <div>
              <h1 className="text-white text-xl font-medium ">
                {fromCoin?.basic?.code}/{toCoin?.basic?.code}
              </h1>
            </div>
          </div>
          <div>
            <h1 className="text-green-500 text-sm font-medium  ">
              In Range
            </h1>
          </div>
        </div>

        <div className="grid w-full items-center gap-4 bg-slate-900 rounded-2xl p-4">
          <div className="flex flex-col space-y-1.5  py-2 rounded-2xl ">
            <div className="flex items-center justify-between space-x-2">
              <div className="bg-transparent flex p-0 border-none text-white placeholder:text-gray-400 text-xl placeholder:text-xl py-2 font-medium focus:outline-none focus:border-none">
                <img
                  src={fromCoin?.basic.icon}
                  className="h-7 w-7 rounded-full mr-2"
                  alt=""
                />
                <h1> {fromCoin?.basic?.code}</h1>
              </div>

              <div className="flex flex-col items-end space-y-1.5 text-white placeholder:text-gray-400 text-xl placeholder:text-xl py-2 font-medium focus:outline-none focus:border-none">
                {" "}
                {fromAmount}
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-1.5  py-2 rounded-2xl">
            <div className="flex items-center justify-between space-x-2">
              <div className="bg-transparent flex p-0 border-none text-white placeholder:text-gray-400 text-xl placeholder:text-xl py-2 font-medium focus:outline-none focus:border-none">
                <img
                  src={toCoin?.basic.icon}
                  className="h-7 w-7 rounded-full mr-2"
                  alt=""
                />{" "}
                <h1>{toCoin?.basic?.code}</h1>
              </div>

              <div className="flex flex-col items-end space-y-1.5 text-white placeholder:text-gray-400 text-xl placeholder:text-xl py-2 font-medium focus:outline-none focus:border-none">
                {toAmount}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between space-y-1.5  py-2 rounded-2xl">
            <h1 className="text-white text-xl font-medium">Free Tier </h1>
            <h1 className="text-gray-400 text-xl font-medium">0.00 DKFT20</h1>
          </div>
        </div>
        <span className="w-full border border-gray-800"></span>

        <Button
          onClick={confirmSwap}
          className="bg-[#7e22ce4a] text-primary py-7 text-xl font-semibold 
            rounded-2xl w-full hover:text-white hover:bg-primary hover:border-primary  "
        >
          Add
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewLiquidity;
