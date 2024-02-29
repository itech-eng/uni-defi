import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";

import { X } from "lucide-react";
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
  handleSwapCoin,
  selectedCoin,
  setSelectedCoin,
  lowPrice,
  highPrice,
}: {
  openStatus: boolean;
  setOpenStatus: any;
  fromCoin: CoinData;
  toCoin: CoinData;
  fromAmount: string;
  toAmount: string;
  confirmSwap: () => void;
  handleSwapCoin: (fromCoin: CoinData, toCoin: CoinData) => void;
  selectedCoin: string;
  setSelectedCoin: any;
  lowPrice: string;
  highPrice: string;
}) => {
  return (
    <Dialog open={openStatus}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="sm:max-w-md border border-slate-900 bg-slate-950 h-auto flex flex-col justify-start">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-white">Add Liquidity</DialogTitle>
          <X
            className="text-white cursor-pointer"
            size={20}
            onClick={() => setOpenStatus(false)}
          />
        </DialogHeader>
        <div className="flex items-center justify-between space-x-2 p-4">
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
              <h1 className="text-white text-xl font-medium">
                {fromCoin?.basic?.code}/{toCoin?.basic?.code}
              </h1>
            </div>
          </div>
          <div>
            <h1 className="text-green-500 text-sm font-medium">In Range</h1>
          </div>
        </div>

        <div className="grid w-full gap-4 bg-slate-900 rounded-2xl p-4">
          <div className="flex items-center justify-between space-x-2 py-2 rounded-2xl">
            <div className="flex p-0 text-white">
              <img
                src={fromCoin?.basic.icon}
                className="h-7 w-7 rounded-full mr-2"
                alt=""
              />
              <h1 className="text-xl font-medium">{fromCoin?.basic?.code}</h1>
            </div>

            <div className="text-white">
              <h1 className="text-xl font-medium">{fromAmount}</h1>
            </div>
          </div>
          <div className="flex items-center justify-between space-x-2 py-2 rounded-2xl">
            <div className="flex p-0 text-white">
              <img
                src={toCoin?.basic.icon}
                className="h-7 w-7 rounded-full mr-2"
                alt=""
              />
              <h1 className="text-xl font-medium">{toCoin?.basic?.code}</h1>
            </div>

            <div className="text-white">
              <h1 className="text-xl font-medium">{toAmount}</h1>
            </div>
          </div>
          <div className="flex  border-t border-slate-800 items-center justify-between space-x-2 py-2 ">
            <h1 className="text-white text-xl font-medium">Free Tier</h1>
            <h1 className="text-gray-400 text-xl font-medium">0.00 DKFT20</h1>
          </div>
        </div>
        <div className="border border-gray-800 my-4"></div>
        <div className="flex items-center justify-between text-white mb-6">
          <h1>Set Price Range</h1>
          <div className="flex items-center gap-2">
            <div className="text-xs text-slate-400" />

            {fromCoin?.token_info.symbol && (
              <div
                className={`text-xs cursor-pointer text-slate-400 px-2 py-1 rounded-md border border-slate-800 ${
                  selectedCoin === fromCoin?.token_info.symbol
                    ? "border border-white text-white"
                    : ""
                }`}
                onClick={() => {
                  handleSwapCoin(fromCoin, toCoin);
                  setSelectedCoin(fromCoin?.token_info.symbol);
                }}
              >
                {fromCoin?.token_info.symbol}
              </div>
            )}
            {toCoin?.token_info.symbol && (
              <div
                className={`text-xs cursor-pointer text-slate-400 px-2 py-1 rounded-md border border-slate-800 ${
                  selectedCoin === toCoin?.token_info.symbol
                    ? "border border-white text-white"
                    : ""
                }`}
                onClick={() => {
                  handleSwapCoin(toCoin, fromCoin);
                  setSelectedCoin(toCoin?.token_info.symbol);
                }}
              >
                {toCoin?.token_info.symbol}
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 text-white gap-4  rounded-2xl ">
          <div className="bg-slate-900 flex flex-col items-center justify-center rounded-2xl p-4">
            <h1 className="text-xs font-medium">Min Price</h1>
            <h1 className="text-xl font-medium"> {lowPrice ? lowPrice : 0}</h1>
            <h1 className="text-xs font-medium">
              {fromCoin?.token_info?.symbol} per {toCoin?.token_info?.symbol}
            </h1>
          </div>
          <div className="bg-slate-900 flex flex-col items-center justify-center rounded-2xl p-4">
            <h1 className="text-xs font-medium">Max Price</h1>
            <h1 className="text-xl font-medium">{highPrice ? highPrice : 0}</h1>
            <h1 className="text-xs font-medium">
              {fromCoin?.token_info?.symbol} per {toCoin?.token_info?.symbol}
            </h1>
          </div>
        </div>
        <Button
          onClick={confirmSwap}
          type="submit"
          className="bg-[#7e22ce4a] text-primary py-7 text-xl font-semibold 
            rounded-2xl w-full hover:text-white hover:bg-primary hover:border-primary"
        >
          Add
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewLiquidity;
