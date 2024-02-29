import React, { useState } from "react";
import SelectCoinSection from "../swap/selectCoin.section";
import { CoinData } from "@/src/utils/types";
import { useDispatch, useSelector } from "react-redux";
import { setWallet, walletSliceType } from "@/store/slice/wallet.slice";
import { toast } from "@/src/components/ui/use-toast";
import { IRootState } from "@/store";
import { POOL_FEES } from "@/src/utils/corearrays";
import { ArrowLeft, ArrowRight } from "lucide-react";

const AddLiquiditySection = () => {
  const [fromCoin, setFromCoin] = useState<CoinData>(null);
  const {
    wallet_address: walletAddress,
    chain_id,
    block_number,
  } = useSelector((state: IRootState) => state.wallet);
  const [lowPrice, setLowPrice] = useState(0);
  const [highPrice, setHighPrice] = useState(0);
  const [toCoin, setToCoin] = useState<CoinData>(null);
  const [selectedFee, setSelectedFee] = useState(null);
  const dispatch = useDispatch();

  const handleConnectWallet = () => {
    try {
      dispatch(setWallet<walletSliceType>({ open_wallet_sidebar: true }));
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleAddLiquidity = (e) => {
    e.preventDefault();
    console.log("Selected Fee:", selectedFee);
  };

  const handleLowPriceChange = (value) => {
    setLowPrice(value);
  };

  const handleHighPriceChange = (value) => {
    setHighPrice(value);
  };

  const handleFeeSelection = (fee) => {
    setSelectedFee(fee);
  };

  const isCoinSelected = fromCoin && toCoin;
  const isPoolFeeSelected = selectedFee !== null;
  const isAllSelected = isCoinSelected && isPoolFeeSelected;
  return (
    <div className="flex flex-col container mt-36 rounded-xl max-w-2xl border border-slate-800 py-6  ">
      <div className="flex items-center justify-between mb-6">
        <ArrowLeft className="text-white text-2xl " />
        <h1 className="text-2xl text-white  font-bold ">Add Liquidity</h1>
        <div className="text-xs text-slate-400">Clear All</div>
      </div>
      <form onSubmit={handleAddLiquidity} className="w-full">
        <div>
          <p className="text-white text-sm mb-2">Select a pair</p>
          <div className="grid grid-cols-2 items-center justify-between w-full gap-4">
            <SelectCoinSection
              coin={fromCoin}
              setCoin={setFromCoin}
              handleConnectWallet={handleConnectWallet}
              walletAddress={walletAddress}
            />
            <SelectCoinSection
              coin={toCoin}
              setCoin={setToCoin}
              handleConnectWallet={handleConnectWallet}
              walletAddress={walletAddress}
            />
          </div>
        </div>
        <div
          className={`grid grid-cols-3 gap-4 mt-4 ${!isCoinSelected && "pointer-events-none opacity-50"}`}
        >
          {POOL_FEES.map((fees) => (
            <div
              key={fees}
              className={`text-white flex flex-col gap-2 border border-slate-800 p-4 rounded-md relative ${selectedFee === fees ? "border-purple-500" : ""}`}
              onClick={() => {
                handleFeeSelection(fees);
              }}
            >
              {selectedFee === fees && (
                <span className="absolute top-0 right-0 h-6 w-6 flex items-center justify-center bg-primary rounded-full text-white">
                  &#10003;
                </span>
              )}
              <h1 className="text-base font-medium">{fees}</h1>
              <p className="text-xs text-slate-400">Best for stable pairs</p>
              <div className="text-sm ">0% Select</div>
            </div>
          ))}
        </div>
        <div
          className={`my-5 ${!isAllSelected && "pointer-events-none opacity-50"}`}
        >
          <div className={`my-5`}>
            <div className="flex items-center justify-between text-white mb-6">
              <h1>Set Price Range</h1>
              <div className="flex items-center gap-2">
                <div className="text-xs text-slate-400" />
                <div className="text-xs text-slate-400 px-2 py-1 rounded-md border border-slate-800">
                  Full Range
                </div>
                <div className="text-xs text-slate-400 px-2 py-1 rounded-md border border-slate-800">
                  Uni
                </div>
                <div className="text-xs text-slate-400 px-2 py-1 rounded-md border border-slate-800">
                  Eth
                </div>
              </div>
            </div>
            <div className="grid w-full items-center gap-4 mb-4">
              <div className="flex flex-col bg-slate-900 space-y-1.5 px-3 py-5 rounded-2xl">
                <label className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-400">
                  Low Price
                </label>
                <div className="flex items-center justify-between space-x-2 ">
                  <div className="flex flex-col items-end space-y-1.5">
                    <input
                      type="text"
                      pattern="^[0-9]*[.,]?[0-9]*$"
                      className="flex h-10 w-full rounded-md border-input ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-transparent p-0 border border-none text-white placeholder:text-gray-400 text-xl placeholder:text-xl py-7 font-medium focus:outline-none focus:border-none"
                      id="youPay"
                      placeholder="0"
                      value={lowPrice}
                      onChange={(e) => handleLowPriceChange(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col items-start space-y-1.5 text-white">
                    <button
                      onClick={() => setLowPrice(lowPrice + 1)}
                      className="h-7 w-7 bg-slate-800 rounded-full text-white"
                    >
                      +
                    </button>
                    <button
                      onClick={() => setLowPrice(lowPrice - 1)}
                      className="h-7 w-7 bg-slate-800 rounded-full text-white"
                    >
                      -
                    </button>
                  </div>
                </div>
                <label className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-400">
                  Uni per ETH
                </label>
              </div>
            </div>
            <div className="grid w-full items-center  gap-4">
              <div className="flex flex-col bg-slate-900  space-y-1.5 px-3 py-5 rounded-2xl">
                <label className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-400">
                  High Price
                </label>
                <div className="flex items-center justify-between space-x-2 ">
                  <div className="flex flex-col items-end space-y-1.5">
                    <input
                      type="text"
                      pattern="^[0-9]*[.,]?[0-9]*$"
                      className="flex h-10 w-full rounded-md border-input ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-transparent p-0 border border-none text-white placeholder:text-gray-400 text-xl placeholder:text-xl py-7 font-medium focus:outline-none focus:border-none"
                      id="youPay"
                      placeholder="0"
                      value={highPrice}
                      onChange={(e) => handleHighPriceChange(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col items-start space-y-1.5 text-white">
                    <button
                      className="h-7 w-7 bg-slate-800 rounded-full text-white"
                      onClick={() => setLowPrice(lowPrice + 1)}
                    >
                      +
                    </button>
                    <button
                      className="h-7 w-7 bg-slate-800 rounded-full text-white"
                      onClick={() => setLowPrice(lowPrice - 1)}
                    >
                      -
                    </button>
                  </div>
                </div>
                <label className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-400">
                  Uni per ETH
                </label>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between text-white mb-6">
            <div>
              <h1 className="text-sm font-medium">Current Price</h1>
              <p className="text-xl text-slate-400">0.00000000</p>
              <h1 className="text-sm font-medium">Eth per dkf</h1>
            </div>
          </div>
          <div className="my-2">
            <div className="flex items-center justify-between text-white mb-6">
              <h1 className="text-xs font-medium">Deposit Amount</h1>
            </div>
          </div>
          <div>
            <div className="grid w-full items-center gap-4 mb-4">
              <div className="flex flex-col bg-slate-900 space-y-1.5 px-3 py-5 rounded-2xl">
                <div className="flex items-center justify-between space-x-2 ">
                  <div className="flex flex-col items-start space-y-1.5">
                    <input
                      type="text"
                      pattern="^[0-9]*[.,]?[0-9]*$"
                      className="flex h-10 w-full rounded-md border-input ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-transparent p-0 border border-none text-white placeholder:text-gray-400 text-xl placeholder:text-xl py-7 font-medium focus:outline-none focus:border-none"
                      id="youPay"
                      placeholder="0"
                      value={lowPrice}
                      onChange={(e) => handleLowPriceChange(e.target.value)}
                    />
                    <label className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-400">
                      -
                    </label>
                  </div>
                  <div className="flex flex-col items-end gap-2 space-y-1.5 text-white">
                    <div className="flex items-center space-x-2 bg-slate-800 rounded-full px-2 py-1">
                      <img src="/coins/btc.png" className="w-7 h-7" alt="" />
                      <h1>BTC</h1>
                    </div>
                    <div>
                      <span>Balance : 0</span>
                      <span className="text-primary bg-primary bg-opacity-30 ml-2 text-sm px-2 py-1 rounded-md">
                        Max
                      </span>
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
                      type="text"
                      pattern="^[0-9]*[.,]?[0-9]*$"
                      className="flex h-10 w-full rounded-md border-input ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-transparent p-0 border border-none text-white placeholder:text-gray-400 text-xl placeholder:text-xl py-7 font-medium focus:outline-none focus:border-none"
                      id="youPay"
                      placeholder="0"
                      value={lowPrice}
                      onChange={(e) => handleLowPriceChange(e.target.value)}
                    />
                    <label className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-400">
                      -
                    </label>
                  </div>
                  <div className="flex flex-col items-end gap-2 space-y-1.5 text-white">
                    <div className="flex items-center space-x-2 bg-slate-800 rounded-full px-2 py-1">
                      <img src="/coins/btc.png" className="w-7 h-7" alt="" />
                      <h1>BTC</h1>
                    </div>
                    <div>
                      <span>Balance : 0</span>
                      <span className="text-primary bg-primary bg-opacity-30 ml-2 text-sm px-2 py-1 rounded-md">
                        Max
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button className="inline-flex items-center justify-center whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 bg-[#7e22ce4a] text-primary py-7 text-xl font-semibold rounded-2xl w-full hover:text-white hover:bg-primary hover:border-primary">
          Swap
        </button>
      </form>
    </div>
  );
};

export default AddLiquiditySection;
