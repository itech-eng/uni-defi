import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, MoveHorizontal } from "lucide-react";
import { getPositionInfo } from "@/src/utils/uniswap/liquidity";
import { ethers } from "ethers";
import { COIN_BAISC_DATA } from "@/src/utils/network/coin-data";
import { PoolFeeText } from "@/src/utils/coreconstants";
const PoolDetailsSection = () => {
  const { tokenId } = useParams<{ tokenId: string }>();
  console.log(tokenId, "params");
  const [positionDetails, setPositionDetails] = useState<any>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>(null);
  const getPositionDetails = async (tokenId: any) => {
    setLoading(true);
    const positions = await getPositionInfo(tokenId, provider, null, true);
    setPositionDetails(positions);
    setLoading(false);
  };
  useEffect(() => {
    tokenId && getPositionDetails(tokenId);
  }, [tokenId]);
  return (
    <div className="max-w-[800px] min-h-[500px]  w-[90%] h-auto  text-white mt-36 overflow-x-hidden">
      <div className="flex w-full justify-start items-start">
        <span
          onClick={() => router.back()}
          className="flex text-[14px] font-medium items-center text-gray-400 cursor-pointer"
        >
          <ArrowLeft size={16} className="" />
          Back to Pool
        </span>
      </div>
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div>
          <div className="my-5">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center ">
                <div className="relative">
                  <img
                    src={`${COIN_BAISC_DATA[positionDetails?.token0?.symbol]?.icon}`}
                    className="h-7 w-7 ml-[20] rounded-full"
                    alt=""
                  />
                  <img
                    src={`${COIN_BAISC_DATA[positionDetails?.token1?.symbol]?.icon}`}
                    className="h-7 w-7 top-0 absolute left-2  rounded-full"
                    alt=""
                  />
                </div>
                <div className="flex items-center gap-2 ml-5">
                  <h3 className="text-2xl font-medium text-white">
                    DKFT20 / ETH
                  </h3>
                  <span className="text-sm bg-slate-900 px-2 rounded-full py-1 sm:text-xs text-gray-400">
                    {PoolFeeText[positionDetails?.fee]}
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
            <div className="border border-slate-800 flex items-center justify-center rounded-lg p-5">
              <img
                src={positionDetails?.other_details?.imgSrc}
                className="h-[320px] "
                alt=""
              />
            </div>
            <div className="flex gap-2 flex-col h-full  ">
              <div className="border rounded-lg border-slate-800">
                <h1 className="p-2 text-white text-md font-medium">
                  Liquidity
                </h1>
                <div className="text-white text-2xl font-bold p-2">
                  {positionDetails &&
                  typeof positionDetails.liquidity === "number"
                    ? positionDetails.liquidity.toFixed(2)
                    : "-"}
                </div>
                <div className="border mb-2 bg-slate-900 text-gray-400 border-slate-800 rounded-lg mx-2">
                  {positionDetails && (
                    <div>
                      {positionDetails.token0 && (
                        <div className="flex justify-between items-center px-2">
                          <div className="flex items-center gap-2 p-2 rounded-lg">
                            <img
                              src={`${COIN_BAISC_DATA[positionDetails?.token0?.symbol]?.icon}`}
                              className="h-7 w-7 rounded-full"
                              alt=""
                            />
                            <h1>{positionDetails?.token0?.symbol}</h1>
                          </div>
                          <div className="flex items-center gap-2 p-2 rounded-lg">
                            <h1>
                              {positionDetails.other_details.token0Amount.toFixed(
                                3,
                              )}
                            </h1>
                            <h1>
                              {positionDetails.other_details.token0UnclaimedFee.toFixed(
                                2,
                              )}
                            </h1>
                          </div>
                        </div>
                      )}
                      {positionDetails.token1 && (
                        <div className="flex justify-between items-center px-2">
                          <div className="flex items-center gap-2 p-2 rounded-lg">
                            <img
                              src={`${COIN_BAISC_DATA[positionDetails.token0.symbol]?.icon}`}
                              className="h-7 w-7 rounded-full"
                              alt=""
                            />
                            <h1>{positionDetails.token1.symbol}</h1>
                          </div>
                          <div className="flex items-center gap-2 p-2 rounded-lg">
                            <h1>
                              {positionDetails.other_details.token1Amount.toFixed(
                                3,
                              )}
                            </h1>
                            <h1>
                              {positionDetails.other_details.token1UnclaimedFee.toFixed(
                                2,
                              )}
                            </h1>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className=" border rounded-lg  border-slate-800">
                <h1 className="p-2 text-white text-md font-medium">
                  Unclaimed fees
                </h1>
                <div className="text-white text-2xl font-bold p-2">-</div>
                <div className="border mb-2 bg-slate-900 text-gray-400 border-slate-800 rounded-lg mx-2">
                  <div className="flex justify-between items-center px-2">
                    <div className="flex items-center gap-2 p-2 rounded-lg">
                      <img
                        src={`${COIN_BAISC_DATA[positionDetails?.token0?.symbol]?.icon}`}
                        className="h-7 w-7 rounded-full"
                        alt=""
                      />
                      <h1>{positionDetails?.token0?.symbol}</h1>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg">
                      <h1>
                        {positionDetails?.other_details?.token0Amount?.toFixed(
                          3,
                        )}
                      </h1>
                      <h1>
                        {positionDetails?.other_details?.token0UnclaimedFee?.toFixed(
                          2,
                        )}
                      </h1>
                    </div>
                  </div>
                  <div className="flex justify-between items-center px-2">
                    <div className="flex items-center gap-2 p-2 rounded-lg">
                      <img
                        src={`${COIN_BAISC_DATA[positionDetails?.token0?.symbol]?.icon}`}
                        className="h-7 w-7 rounded-full"
                        alt=""
                      />
                      <h1>{positionDetails?.token0?.symbol}</h1>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg">
                      <h1>
                        {positionDetails?.other_details?.token0Amount?.toFixed(
                          3,
                        )}
                      </h1>
                      <h1>
                        {positionDetails?.other_details?.token0UnclaimedFee?.toFixed(
                          2,
                        )}
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border border-slate-800 rounded-lg  mt-4">
            <div className="my-5">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="flex items-center gap-2 ml-5">
                    <span className="">Price range</span>
                    <span className="flex items-center text-green-500 text-xs gap-2">
                      {positionDetails?.inRange ? "In Range" : "Out of Range"}
                      <div
                        className={`h-2 w-2 ${positionDetails?.inRange ? "bg-green-500" : "bg-red-500"} rounded-full`}
                      ></div>
                    </span>
                  </div>
                </div>
                <div className="border rounded-lg flex justify-between items-center gap-2 text-gray-400 border-slate-800 mr-3 text-xs">
                  <div className="bg-slate-900 px-3 rounded-lg py-1 text-white font-normal">
                    {positionDetails?.token0?.symbol}
                  </div>
                  <div className="px-3 rounded-lg py-1 text-white font-normal">
                    {positionDetails?.token1?.symbol}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center rounded-lg mb-5 mx-3">
              <div className="w-[380px] flex flex-col py-4 items-center justify-center border border-slate-800 bg-slate-900 rounded-md">
                <h1 className="text-gray-400 text-md font-medium">Max Price</h1>
                <h1 className="text-white text-xl font-bold">
                  {positionDetails?.maxPrice}
                </h1>
                <p className="text-gray-400 text-md font-medium">
                  {positionDetails?.token0.symbol} per{" "}
                  {positionDetails?.token1.symbol}
                </p>
              </div>
              <div className="w-[40px] flex items-center justify-center rounded-md h-full">
                <MoveHorizontal className="h-6 w-6 text-gray-400" />
              </div>
              <div className="w-[380px] flex flex-col py-4 items-center justify-center border border-slate-800 bg-slate-900 rounded-md">
                <h1 className="text-gray-400 text-md font-medium">Max Price</h1>
                <h1 className="text-white text-xl font-bold">
                  {positionDetails?.maxPrice}
                </h1>
                <p className="text-gray-400 text-md font-medium">
                  {positionDetails?.token0.symbol} per{" "}
                  {positionDetails?.token1.symbol}
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-center items-center gap-2 mt-5 mb-5 border border-slate-800 rounded-lg bg-slate-900 mx-3 py-3">
              <h1 className="text-gray-400 text-md font-medium">
                Current price
              </h1>
              <h1 className="text-white text-xl font-bold">
                {positionDetails?.currentPrice}
              </h1>
              <p className="text-gray-400 text-md font-medium">
                {positionDetails?.token0.symbol} per{" "}
                {positionDetails?.token1.symbol}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PoolDetailsSection;
