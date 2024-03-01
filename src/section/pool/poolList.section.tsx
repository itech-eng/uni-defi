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
  const { wallet_address: walletAddress } = useSelector(
    (state: IRootState) => state.wallet,
  );
  const handlePositionList = async () => {
    try {
      const positions = await getPositions();
      setPositions(positions);
      setLoading(false);
      console.log(positions, "positions");
    } catch (error) {
      setLoading(false);
    }
  };
  useEffect(() => {
    handlePositionList();
  }, [walletAddress]);
  return (
    <div className="container text-white mt-36 px-72">
      <div className="flex justify-between items-center mb-6">
        <div className="text-4xl font-bold">Positions</div>
        <Link href={"/pool/add"}>
          <button className="bg-primary text-white font-bold py-2 px-4 rounded-full flex flex-row items-center">
            <Plus className="h-5 w-5 mr-2" /> New Position
          </button>
        </Link>
      </div>
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="border border-slate-800 rounded-lg py-4  flex flex-col">
          <div className="mb-4 border-b border-slate-800 pb-4 px-4">
            <h2 className="text-xs ">Your positions ({positions.length})</h2>
          </div>
          {positions.map((position) => (
            <div className="flex flex-row items-center justify-between px-4">
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
                    <h3 className="text-[16px] font-medium text-white">
                      {position.token0.symbol} / {position.token1.symbol}
                    </h3>
                    <span className="text-sm text-gray-400">
                      {PoolFeeText[position.fee]}%
                    </span>
                  </div>
                </div>

                <div className="text-[14px]">
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
                <span className="font-bold mr-2 text-green-300">
                  {position.inRange ? "In Range" : "Out of Range"}
                </span>
              </div>
            </div>
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
