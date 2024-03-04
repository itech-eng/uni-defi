"use client";
import { PoolFeeText } from "@/src/utils/coreconstants";
import { COIN_BAISC_DATA } from "@/src/utils/network/coin-data";
import { getPositions } from "@/src/utils/uniswap/liquidity";
import { IRootState } from "@/store";
import { Plus, Rows3 } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const PoolListSection = () => {
  const [positions, setPositions] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const { wallet_address: walletAddress, chain_id } = useSelector(
    (state: IRootState) => state.wallet,
  );
  const handlePositionList = async () => {
    try {
      setLoading(true);
      const positions = await getPositions();
      setPositions(positions);
      console.log(positions, "positions");
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  useEffect(() => {
    handlePositionList();
  }, [walletAddress, chain_id]);
  return (
    <div className="w-4/5 md:max-w-[860px] mx-80  text-white mt-36 ">
      <div className="flex justify-between items-center mb-6">
        <div className="text-4xl font-bold">Positions</div>
        <Link href={"/pool/add"}>
          <button className="bg-primary text-white font-bold text-xs md:text-md py-2 px-4 rounded-md flex flex-row items-center">
            <Plus className="h-5 w-5 mr-2" />{" "}
            <span className="hidden md:flex">New Position</span>
          </button>
        </Link>
      </div>
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="border w-full border-slate-800 rounded-lg py-4  flex flex-col">
          <div className="mb-4 border-b border-slate-800 pb-4 px-4">
            <h2 className="text-xs ">Your positions ({positions.length})</h2>
          </div>
          {positions.map((position) => (
            <Link href={`/pool/${position.tokenId}`}>
              <div className="flex py-5 flex-row items-center justify-between px-4 hover:bg-slate-900 cursor-pointer">
                <div className="">
                  <div className="flex items-center mb-2">
                    <div className="relative">
                      <img
                        src={COIN_BAISC_DATA[position.token0.symbol].icon}
                        className="h-7 w-7 ml-[20] rounded-full"
                        alt=""
                      />
                      <img
                        src={COIN_BAISC_DATA[position.token1.symbol].icon}
                        className="h-7 w-7 top-0 absolute left-2  rounded-full"
                        alt=""
                      />
                    </div>
                    <div className="flex items-center gap-2 ml-5">
                      <h3 className="text-[16px] sm:text-[14px] font-medium text-white">
                        {position.token0.symbol} / {position.token1.symbol}
                      </h3>
                      <span className="text-sm sm:text-xs text-gray-400">
                        {PoolFeeText[position.fee]}%
                      </span>
                    </div>
                  </div>

                  <div className="text-[14px] sm:text-[12px]">
                    <span className=" mr-2 text-gray-500">
                      Min:{" "}
                      <span className="text-white">
                        {position.minPrice} {position.token0.symbol} per{" "}
                        {position.token1.symbol}
                      </span>
                    </span>
                    ... {"  "}
                    <span className=" text-gray-500 ">
                      Max:{" "}
                      <span className="text-white">
                        {position.maxPrice} {position.token0.symbol} per{" "}
                        {position.token1.symbol}
                      </span>
                    </span>
                  </div>
                </div>
                <div>
                  <span className="font-medium text-[14px] sm:text-[12px] text-gray-400 mr-2">
                    {position.inRange && !closed ? (
                      <span className="text-green-500">In Range</span>
                    ) : (
                      <span className="text-red-500">
                        {closed ? "Closed" : "Out of Range"}
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </Link>
          ))}
          {positions.length === 0 && (
            <div className="text-center mt-4 text-gray-500">
              <Rows3 className="h-20 w-20 mx-auto" />
              <span className="">No positions to show</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PoolListSection;
