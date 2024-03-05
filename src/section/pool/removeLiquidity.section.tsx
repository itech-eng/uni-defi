import { Slider } from "@/src/components/ui/slider";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const RemoveLiquidity = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col container mt-20 rounded-xl max-w-md border border-slate-800 py-6">
      <div className="flex items-center justify-between mb-6">
        <ArrowLeft
          className="text-white text-2xl cursor-pointer"
          onClick={() => router.back()}
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
        <div className="w-full flex justify-between items-center">
          <div className="w-1/4">
            <h1 className="text-4xl font-bold text-white">50%</h1>
          </div>
          <div className="w-3/4 grid grid-cols-4 gap-2">
            <div className="bg-primary/30 flex justify-center items-center rounded-xl text-primary py-1 ">
              25
            </div>
            <div className="bg-primary/30 flex justify-center items-center rounded-xl text-primary py-1 ">
              50
            </div>
            <div className="bg-primary/30 flex justify-center items-center rounded-xl text-primary py-1 ">
              75
            </div>
            <div className="bg-primary/30 flex justify-center items-center rounded-xl text-primary py-1 ">
              100
            </div>
          </div>
        </div>
        <div className="my-5">
          <Slider defaultValue={[33]} max={100} step={1} />
        </div>
      </div>
      <div className="border mb-2 bg-slate-900 text-gray-400 border-slate-800 rounded-xl  ">
        <div>
          <div className="flex justify-between items-center px-2">
            <div className="flex items-center gap-2 p-2 rounded-3xl">
              <img
                src="/coins/dkft20.png"
                className="h-7 w-7 rounded-full"
                alt=""
              />
              <h1>DKFT20</h1>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-3xl">
              <h1>0.020</h1>
            </div>
          </div>
          <div className="flex justify-between items-center px-2">
            <div className="flex items-center gap-2 p-2 rounded-3xl">
              <img
                src="/coins/dkft20.png"
                className="h-7 w-7 rounded-full"
                alt=""
              />
              <h1>ETH</h1>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-3xl">
              <h1>0.010</h1>
            </div>
          </div>
          <div className="border-b border-slate-800  mx-4"></div>
          <div className="flex justify-between items-center px-2">
            <div className="flex items-center gap-2 p-2 rounded-3xl">
              <h1>Free Tier</h1>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-3xl">
              <h1>0.010%</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveLiquidity;
