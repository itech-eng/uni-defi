import useIncreaseLiquidity from "@/src/hooks/useIncreaseLiquidity";
import { IRootState } from "@/store";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";

const IncreaseLiquidity = () => {
  const router = useRouter();
  const {
    wallet_address: walletAddress,
    chain_id,
    block_number,
  } = useSelector((state: IRootState) => state.wallet);

  const {
    firstCoin,
    secondCoin,
    handleSwitchCoins,
    loading,
    positionDetails,
    selectedCoin,
    setSelectedCoin,
    fromCoin,
    toCoin,
  } = useIncreaseLiquidity();

  return chain_id ? (
    <div className="flex flex-col container mt-36 rounded-xl max-w-2xl border border-slate-800 py-6  ">
      <div className="flex items-center justify-between mb-6">
        <ArrowLeft
          className="text-white text-2xl cursor-pointer"
          onClick={() => router.back()}
        />
        <h1 className="text-xl text-white  font-bold ">Increase Liquidity</h1>
        <div className=""></div>
      </div>
      <div className="border-b border-slate-800"></div>
      {loading ? (
        <div className="flex mt-6 justify-center items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div>
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
                  <h3 className="text-2xl font-medium text-white">
                    DKFT20 / ETH
                  </h3>
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
          <div className="border mb-2 bg-slate-900 text-gray-400 border-slate-800 rounded-xl mx-2">
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
          <div className=" rounded-3xl  mt-4">
            <div className="my-5">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="flex items-center gap-2 ml-5">
                    <span className="flex items-center text-white text-xs gap-2">
                      Selected range
                    </span>
                  </div>
                </div>
                <div className="border rounded-3xl flex justify-between items-center gap-2 text-gray-400 border-slate-800 mr-3 text-xs">
                  <div
                    className={`px-3 rounded-3xl py-1 text-white font-normal cursor-pointer ${selectedCoin === firstCoin?.basic.code ? "bg-slate-900" : ""}`}
                    onClick={() => {
                      if (selectedCoin === firstCoin?.basic.code) {
                        return;
                      }
                      setSelectedCoin(firstCoin.basic.code);
                      handleSwitchCoins();
                    }}
                  >
                    {firstCoin?.basic.code}
                  </div>
                  <div
                    className={`px-3 rounded-3xl py-1 text-white font-normal cursor-pointer ${selectedCoin === secondCoin?.basic.code ? "bg-slate-900" : ""}`}
                    onClick={() => {
                      if (selectedCoin === secondCoin?.basic.code) {
                        return;
                      }
                      setSelectedCoin(secondCoin?.basic.code);
                      handleSwitchCoins();
                    }}
                  >
                    {secondCoin?.basic.code}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center rounded-3xl mb-5 mx-3">
              <div className="w-[380px] flex flex-col py-4 items-center justify-center border border-slate-800 bg-slate-900 rounded-md">
                <h1 className="text-gray-400 text-md font-medium">Min Price</h1>
                <h1 className="text-white text-xl font-bold">0</h1>
                <p className="text-gray-400 text-md font-medium">
                  DKFT20 per ETH
                </p>
              </div>
              <div className="w-[40px] flex items-center justify-center rounded-md h-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-move-horizontal h-6 w-6 text-gray-400"
                >
                  <polyline points="18 8 22 12 18 16" />
                  <polyline points="6 8 2 12 6 16" />
                  <line x1={2} x2={22} y1={12} y2={12} />
                </svg>
              </div>
              <div className="w-[380px] flex flex-col py-4 items-center justify-center border border-slate-800 bg-slate-900 rounded-md">
                <h1 className="text-gray-400 text-md font-medium">Max Price</h1>
                <h1 className="text-white text-xl font-bold">∞</h1>
                <p className="text-gray-400 text-md font-medium">
                  DKFT20 per ETH
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center gap-2 mt-5 mb-5 border border-slate-800 rounded-3xl bg-slate-900 mx-3 py-3">
              <h1 className="text-gray-400 text-md font-medium">
                Current price
              </h1>
              <h1 className="text-white text-xl font-bold">
                0.4999909192071878
              </h1>
              <p className="text-gray-400 text-md font-medium">
                DKFT20 per ETH
              </p>
            </div>
          </div>
          <div className="  mt-4">
            <div className="grid w-full items-center gap-4 mb-4">
              <div className="flex flex-col bg-slate-900 space-y-1.5 px-3 py-5 rounded-2xl">
                <div className="flex items-center justify-between space-x-2 ">
                  <div className="flex flex-col items-start space-y-1.5">
                    <input
                      pattern="^[0-9]*[.,]?[0-9]*$"
                      className="flex h-10 w-full rounded-md border-input ring-offset-background file:border-0 
                  file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 
                  focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 
                  bg-transparent p-0 border border-none text-white placeholder:text-gray-400 text-xl 
                  placeholder:text-xl py-7 font-medium focus:outline-none focus:border-none"
                      id="youPay"
                      type="text"
                      placeholder={"0"}
                    />
                  </div>
                  <div className="flex flex-col items-end gap-2 space-y-1.5 text-white">
                    <div className="flex items-center space-x-2 bg-slate-800 rounded-full px-2 py-1">
                      <img src="/coins/eth.svg" className="w-7 h-7" alt="" />
                      <h1>ETH</h1>
                    </div>
                    <div>
                      <span>Balance: 0.0897</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid w-full items-center gap-4 mb-4">
              <div className="flex flex-col bg-slate-900 space-y-1.5 px-3 py-5 rounded-2xl">
                <div className="flex items-center justify-between space-x-2 ">
                  <div className="flex flex-col items-start space-y-1.5">
                    <input
                      pattern="^[0-9]*[.,]?[0-9]*$"
                      className="flex h-10 w-full rounded-md border-input ring-offset-background file:border-0 
                  file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 
                  focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 
                  bg-transparent p-0 border border-none text-white placeholder:text-gray-400 text-xl 
                  placeholder:text-xl py-7 font-medium focus:outline-none focus:border-none"
                      id="youPay"
                      placeholder={"0"}
                      type="text"
                    />
                  </div>
                  <div className="flex flex-col items-end gap-2 space-y-1.5 text-white">
                    <div className="flex items-center space-x-2 bg-slate-800 rounded-full px-2 py-1">
                      <img src="/coins/dkft20.png" className="w-7 h-7" alt="" />
                      <h1>DKFT20</h1>
                    </div>
                    <div>
                      <span>Balance: 10000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="items-center p-2 pt-0 flex justify-between">
            <button className="inline-flex items-center justify-center whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 bg-[#7e22ce4a] text-primary py-7 text-xl font-semibold rounded-2xl w-full hover:text-white hover:bg-primary hover:border-primary">
              Increase
            </button>
          </div>
        </div>
      )}
    </div>
  ) : (
    <div className="max-w-[800px] min-h-[500px] w-[90%] h-auto text-white mt-36 overflow-x-hidden">
      <div className="flex w-full justify-start items-start">
        <span
          onClick={() => router.back()}
          className="flex text-[14px] font-medium items-center text-gray-400 cursor-pointer"
        >
          <ArrowLeft size={16} className="cursor-pointer" />
          Back to Pool
        </span>
      </div>
    </div>
  );
};

export default IncreaseLiquidity;
