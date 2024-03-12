import { Slider } from "@/src/components/ui/slider";
import useRemoveLiquidity from "@/src/hooks/useRemoveLiquidity";
import { IRootState } from "@/store";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useSelector } from "react-redux";

const RemoveLiquidity = () => {
  const router = useRouter();
  const {
    wallet_address: walletAddress,
    chain_id,
    block_number,
  } = useSelector((state: IRootState) => state.wallet);

  const {
    // firstCoin,
    // secondCoin,
    handleSwapCoin,
    loading,
    positionDetails,
    selectedCoin,
    setSelectedCoin,
    fromCoin,
    toCoin,
    percent,
    setPercent,
  } = useRemoveLiquidity();
  return chain_id ? (
    <div className="flex flex-col container mt-20 rounded-xl max-w-md border border-slate-800 py-6">
      <div className="flex items-center justify-between mb-6">
        <ArrowLeft
          className="text-white text-2xl cursor-pointer"
          onClick={() => router.push("/pool")}
        />
        <h1 className="text-sm text-white  font-bold ">Remove Liquidity</h1>
        <div className=""></div>
      </div>

      <div className="my-5">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center ">
            <div className="relative">
              <img
                src="/coins/dkft20.png"
                className="h-7 w-7 ml-[20] rounded-full"
                alt=""
              />
              <img
                src="/coins/eth.svg"
                className="h-7 w-7 top-0 absolute left-2  rounded-full"
                alt=""
              />
            </div>
            <div className="flex items-center gap-2 ml-5">
              <h3 className="text-xl font-medium text-white">DKFT20 / ETH</h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center text-green-500 text-xs gap-2">
              In Range
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            </span>
          </div>
        </div>
      </div>
      <div className="border mb-2 p-4 bg-slate-900 text-gray-400 border-slate-800 rounded-xl ">
        <p>Amount</p>
        <div className="w-full flex gap-3 justify-between items-center">
          <div className="w-1/4">
            <h1 className="text-4xl font-bold text-white">{percent}%</h1>
          </div>
          <div className="w-3/4 grid grid-cols-4 gap-2">
            <div
              className="bg-primary/30 flex justify-center items-center rounded-xl text-primary text-xs py-2 "
              onClick={() => setPercent(25)}
            >
              25%
            </div>
            <div
              className="bg-primary/30 flex justify-center items-center rounded-xl text-primary text-xs py-2 "
              onClick={() => setPercent(50)}
            >
              50%
            </div>
            <div
              className="bg-primary/30 flex justify-center items-center rounded-xl text-primary text-xs py-2 "
              onClick={() => setPercent(75)}
            >
              75%
            </div>
            <div
              className="bg-primary/30 flex justify-center items-center rounded-xl text-primary text-xs py-2 "
              onClick={() => setPercent(100)}
            >
              100%
            </div>
          </div>
        </div>
        <div className="my-5">
          <Slider
            value={[percent]}
            min={0}
            max={100}
            step={1}
            onValueChange={(amount) => {
              setPercent(amount[0]);
              console.log(amount[0], "amountamountamount");
            }}
          />
        </div>
      </div>
      <div className="border mb-2 mt-6 bg-slate-900 text-gray-400 border-slate-800 rounded-xl  ">
        <div>
          <div className="flex justify-between items-center px-2">
            <div className="flex items-center gap-2 p-2 rounded-3xl">
              <h1>DKFT20</h1>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-3xl">
              <h1>0.020</h1>
              <img
                src="/coins/dkft20.png"
                className="h-7 w-7 rounded-full"
                alt=""
              />
            </div>
          </div>
          <div className="flex justify-between items-center px-2">
            <div className="flex items-center gap-2 p-2 rounded-3xl">
              <h1>ETH</h1>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-3xl">
              <h1>0.010</h1>
              <img
                src="/coins/dkft20.png"
                className="h-7 w-7 rounded-full"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
      <div className="items-center  pt-0 flex justify-between">
        <button className="inline-flex items-center justify-center whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 bg-[#7e22ce4a] text-primary py-7 text-xl font-semibold rounded-2xl w-full hover:text-white hover:bg-primary hover:border-primary">
          Decrease
        </button>
      </div>
    </div>
  ) : (
    <div className="max-w-[800px] min-h-[500px] w-[90%] h-auto text-white mt-36 overflow-x-hidden">
      <div className="flex w-full justify-start items-start">
        <span
          onClick={() => router.push("/pool")}
          className="flex text-[14px] font-medium items-center text-gray-400 cursor-pointer"
        >
          <ArrowLeft size={16} className="cursor-pointer" />
          Back to Pool
        </span>
      </div>
    </div>
  );
};

export default RemoveLiquidity;
