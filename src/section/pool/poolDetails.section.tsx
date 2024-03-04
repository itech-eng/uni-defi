import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MoveHorizontal } from "lucide-react";
const PoolDetailsSection = () => {
  const router = useRouter();
  return (
    <div className="max-w-[800px] w-[90%] h-auto  text-white mt-36 overflow-x-hidden">
      <div className="flex w-full justify-start items-start">
        <span
          onClick={() => router.back()}
          className="flex text-[14px] font-medium items-center text-gray-400 cursor-pointer"
        >
          <ArrowLeft size={16} className="" />
          Back to Pool
        </span>
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
              <h3 className="text-2xl font-medium text-white">DKFT20 / ETH</h3>
              <span className="text-sm bg-slate-900 px-2 rounded-full py-1 sm:text-xs text-gray-400">
                0.30%
              </span>
              <span className="flex items-center text-green-500 text-xs gap-2">
                In Range
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 rounded-lg py-2 text-sm text-gray-400 border border-slate-800">
              Increase Liquidity
            </div>
            <div className="bg-primary px-3 rounded-lg py-2 text-sm text-white font-bold">
              Remove Liquidity
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2  gap-5">
        <div className="border border-slate-800 rounded-lg p-5"></div>
        <div className="flex gap-2 flex-col h-full  ">
          <div className=" border rounded-lg  border-slate-800">
            <h1 className="p-2 text-white text-md font-medium">Liquidity</h1>
            <div className="text-white text-2xl font-bold p-2">-</div>
            <div className="border mb-2 bg-slate-900 text-gray-400 border-slate-800 rounded-lg  mx-2 ">
              <div className="flex justify-between items-center px-2">
                <div className="flex items-center gap-2  p-2 rounded-lg">
                  <img
                    src="/coins/dkft20.png"
                    className="h-7 w-7 rounded-full"
                    alt=""
                  />
                  <h1>DKFT20</h1>
                </div>
                <div className="flex items-center gap-2  p-2 rounded-lg">
                  <h1>0.020</h1>
                  <h1>0.00</h1>
                </div>
              </div>
              <div className="flex justify-between items-center px-2">
                <div className="flex items-center gap-2  p-2 rounded-lg">
                  <img
                    src="/coins/dkft20.png"
                    className="h-7 w-7 rounded-full"
                    alt=""
                  />
                  <h1>DKFT20</h1>
                </div>
                <div className="flex items-center gap-2  p-2 rounded-lg">
                  <h1>0.020</h1>
                  <h1>0.00</h1>
                </div>
              </div>
            </div>
          </div>
          <div className=" border rounded-lg  border-slate-800">
            <h1 className="p-2 text-white text-md font-medium">
              Unclaimed fees
            </h1>
            <div className="text-white text-2xl font-bold p-2">-</div>
            <div className="border mb-2 bg-slate-900 text-gray-400 border-slate-800 rounded-lg  mx-2 ">
              <div className="flex justify-between items-center px-2">
                <div className="flex items-center gap-2  p-2 rounded-lg">
                  <img
                    src="/coins/dkft20.png"
                    className="h-7 w-7 rounded-full"
                    alt=""
                  />
                  <h1>DKFT20</h1>
                </div>
                <div className="flex items-center gap-2  p-2 rounded-lg">
                  <h1>0.020</h1>
                  <h1>0.00</h1>
                </div>
              </div>
              <div className="flex justify-between items-center px-2">
                <div className="flex items-center gap-2  p-2 rounded-lg">
                  <img
                    src="/coins/dkft20.png"
                    className="h-7 w-7 rounded-full"
                    alt=""
                  />
                  <h1>DKFT20</h1>
                </div>
                <div className="flex items-center gap-2  p-2 rounded-lg">
                  <h1>0.020</h1>
                  <h1>0.00</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border border-slate-800 rounded-lg  mt-4">
        <div className="my-5">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center ">
              <div className="flex items-center gap-2 ml-5">
                <span className="">Price range</span>
                <span className="flex items-center text-green-500 text-xs gap-2">
                  In Range
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                </span>
              </div>
            </div>
            <div className="border rounded-lg flex justify-between items-center gap-2 text-gray-400  border-slate-800 mr-3 text-xs">
              <div className="bg-slate-900 px-3 rounded-lg py-1   text-white font-normal">
                Dkft
              </div>
              <div className="px-3 rounded-lg py-1   text-white font-normal">
                Eth
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center rounded-lg mb-5 mx-3">
          <div className=" w-[380px] flex flex-col py-4 items-center justify-center border border-slate-800 bg-slate-900 rounded-md">
            <h1 className="text-gray-400 text-md font-medium">Max Price</h1>
            <h1 className="text-white text-xl font-bold">55</h1>
            <p className="text-gray-400 text-md font-medium">DKFT20 per ETH</p>
          </div>
          <div className=" w-[40px] flex items-center justify-center rounded-md h-full">
            <MoveHorizontal className="h-6 w-6 text-gray-400" />
          </div>
          <div className=" w-[380px] flex flex-col py-4 items-center justify-center border border-slate-800 bg-slate-900 rounded-md">
            <h1 className="text-gray-400 text-md font-medium">Max Price</h1>
            <h1 className="text-white text-xl font-bold">55</h1>
            <p className="text-gray-400 text-md font-medium">DKFT20 per ETH</p>
          </div>
        </div>
        <div className="flex flex-col  justify-center items-center gap-2 mt-5 mb-5 border border-slate-800 rounded-lg bg-slate-900 mx-3 py-3">
          <h1 className="text-gray-400 text-md font-medium">Current price</h1>
          <h1 className="text-white text-xl font-bold">2.00004</h1>
          <p className="text-gray-400 text-md font-medium">DKFT20 per ETH</p>
        </div>
      </div>
    </div>
  );
};

export default PoolDetailsSection;
