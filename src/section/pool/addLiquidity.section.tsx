import React, { useEffect, useState } from "react";
import SelectCoinSection from "../swap/selectCoin.section";
import { CoinData } from "@/src/utils/types";
import { useDispatch, useSelector } from "react-redux";
import { setWallet, walletSliceType } from "@/store/slice/wallet.slice";
import { toast } from "@/src/components/ui/use-toast";
import { IRootState } from "@/store";
import { POOL_FEES } from "@/src/utils/corearrays";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PoolFeeText } from "@/src/utils/coreconstants";
import { Button } from "@/src/components/ui/button";
import PreviewLiquidity from "./previewLiquidity.section";
import { useRouter } from "next/navigation";

const AddLiquiditySection = () => {
  const [preview, setPreview] = useState(false);
  const [fromCoin, setFromCoin] = useState<CoinData>(null);
  const [toCoin, setToCoin] = useState<CoinData>(null);
  const [fromDepositAmount, setFromDepositAmount] = useState<number>(0);

  const [toDepositAmount, setToDepositAmount] = useState<number>(0);
  const [lowPrice, setLowPrice] = useState("");
  const [highPrice, setHighPrice] = useState("");
  const [selectedFee, setSelectedFee] = useState(null);
  const [selectedCoin, setSelectedCoin] = useState<string>();
  const [assistanceMessage, setAssistanceMessage] = useState<string>(
    "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eligendi,perferendis fuga deserunt officiis eum eveniet consectetur ab quos expedita provident quaerat veritatis neque excepturi sed natus.Officia sunt nostrum suscipit.",
  );
  const dispatch = useDispatch();

  const {
    wallet_address: walletAddress,
    chain_id,
    block_number,
  } = useSelector((state: IRootState) => state.wallet);

  const handleAssistantionMessageCheckings = () => {
    // setAssistanceMessage(e.target.value);
  };
  useEffect(() => {
    handleAssistantionMessageCheckings();
  }, [
    selectedCoin,
    assistanceMessage,
    lowPrice,
    highPrice,
    selectedFee,
    fromDepositAmount,
    toDepositAmount,
    fromCoin,
    toCoin,
    walletAddress,
    chain_id,
    block_number,
    selectedFee,
    selectedCoin,
  ]);
  const router = useRouter();
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
  const handleSwapCoin = (from, to) => {
    setFromCoin(from);
    setToCoin(to);
  };

  const handleAddLiquidity = (e) => {
    e.preventDefault();
    console.log("Selected Fee:", selectedFee);
    console.log("From Coin:", fromCoin);
    console.log("To Coin:", toCoin);
    console.log("Low Price:", lowPrice);
    console.log("High Price:", highPrice);
  };
  const handleFullRange = () => {};
  const handleLowPriceChange = (value) => {
    setLowPrice(value);
  };

  const handleHighPriceChange = (value) => {
    setHighPrice(value);
  };

  const handleFeeSelection = (fee) => {
    setSelectedFee(fee);
  };

  const handleFromDepositAmountChange = (value) => {
    setFromDepositAmount(Number(value));
  };

  const handleToDepositAmountChange = (value) => {
    setToDepositAmount(Number(value));
  };
  const handleHighPriceIncrease = () => {};
  const handleHighPriceDecrease = () => {};
  const handleLowPriceIncrease = () => {};
  const handleLowPriceDecrease = () => {};

  const isCoinSelected = fromCoin && toCoin;
  const isPoolFeeSelected = selectedFee !== null;
  const isAllSelected = isCoinSelected && isPoolFeeSelected;
  return (
    <div className="flex flex-col container mt-36 rounded-xl max-w-2xl border border-slate-800 py-6  ">
      <div className="flex items-center justify-between mb-6">
        <ArrowLeft
          className="text-white text-2xl "
          onClick={() => router.back()}
        />
        <h1 className="text-xl text-white  font-bold ">Add Liquidity</h1>
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
              <h1 className="text-base font-medium">{PoolFeeText[fees]}</h1>
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
                <div
                  className="text-xs text-slate-400 px-2 py-1 rounded-md border border-slate-800"
                  onClick={handleFullRange}
                >
                  Full Range
                </div>
                {/* select coin  */}
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
                      onClick={() => handleLowPriceIncrease()}
                      className="h-7 w-7 bg-slate-800 rounded-full text-white"
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleLowPriceDecrease()}
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
                      onClick={() => handleHighPriceIncrease()}
                    >
                      +
                    </button>
                    <button
                      className="h-7 w-7 bg-slate-800 rounded-full text-white"
                      onClick={() => handleHighPriceDecrease()}
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
          <div className="w-full bg-primary/25 text-gray-500 text-xs mb-4 rounded-2xl p-3">
            {assistanceMessage}
          </div>
          <div className="flex items-center justify-between text-white mb-6">
            <div>
              <h1 className="text-sm font-medium">Current Price</h1>
              <p className="text-xl text-slate-400">0.00000000</p>
              <h1 className="text-sm font-medium">Eth per dkf</h1>
            </div>
          </div>
          <div className="flex items-center justify-between w-full text-white mb-6">
            <div className="flex items-center justify-between w-full space-x-2 bg-slate-900 px-3 py-5 rounded-2xl">
              <input type="text" className="bg-slate-950 text-white w-full " />
            </div>
          </div>
          <div className="my-2">
            <div className="flex items-center justify-between text-white mb-6">
              <h1 className="text-xs font-medium">Deposit Amount</h1>
            </div>
          </div>
          <div>
            {fromCoin && (
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
                        value={fromDepositAmount}
                        onChange={(e) =>
                          handleFromDepositAmountChange(e.target.value)
                        }
                      />
                      <label className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-400">
                        -
                      </label>
                    </div>
                    <div className="flex flex-col items-end gap-2 space-y-1.5 text-white">
                      <div className="flex items-center space-x-2 bg-slate-800 rounded-full px-2 py-1">
                        <img
                          src={fromCoin?.basic?.icon}
                          className="w-7 h-7"
                          alt=""
                        />
                        <h1>{fromCoin?.token_info?.symbol}</h1>
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
            )}
            {toCoin && (
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
                        value={toDepositAmount}
                        onChange={(e) =>
                          handleToDepositAmountChange(e.target.value)
                        }
                      />
                      <label className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-400">
                        -
                      </label>
                    </div>
                    <div className="flex flex-col items-end gap-2 space-y-1.5 text-white">
                      <div className="flex items-center space-x-2 bg-slate-800 rounded-full px-2 py-1">
                        <img
                          src={toCoin?.basic?.icon}
                          className="w-7 h-7"
                          alt=""
                        />
                        <h1>{toCoin?.token_info?.symbol}</h1>
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
            )}
          </div>
        </div>
        <PreviewLiquidity
          openStatus={preview}
          setOpenStatus={setPreview}
          fromCoin={fromCoin}
          toCoin={toCoin}
          fromAmount="0"
          toAmount="0"
          confirmSwap={() => {
            setPreview(false);
          }}
          handleSwapCoin={handleSwapCoin}
          selectedCoin={selectedCoin}
          setSelectedCoin={setSelectedCoin}
          lowPrice={lowPrice}
          highPrice={highPrice}
        />
        {!walletAddress ? (
          <Button
            onClick={handleConnectWallet}
            className="bg-[#7e22ce4a] text-primary py-7 text-xl font-semibold 
            rounded-2xl w-full hover:text-white hover:bg-primary hover:border-primary"
          >
            Connect Wallet
          </Button>
        ) : (
          <Button
            className="bg-[#7e22ce4a] text-primary py-7 text-xl font-semibold rounded-2xl w-full hover:text-white hover:bg-primary hover:border-primary"
            onClick={() => setPreview(true)}
          >
            Preview
          </Button>
        )}
      </form>
    </div>
  );
};

export default AddLiquiditySection;
