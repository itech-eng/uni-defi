import React from "react";
import SelectCoinSection from "../global/selectCoin.section";
import { POOL_FEES } from "@/src/utils/corearrays";
import { ArrowLeft } from "lucide-react";
import {
  INFINITY_TEXT,
  LIQUIDITY_PRICE_RANGE,
  PoolFeeText,
} from "@/src/utils/coreconstants";
import { Button } from "@/src/components/ui/button";
import PreviewLiquidity from "./previewLiquidity.section";
import { useAddLiquidity } from "@/src/hooks/useAddLiquidity";
import LoadingModal from "@/src/components/loader/loader.section";
import { beautifyNumber, noExponents } from "@/src/utils/corefunctions";

const AddLiquiditySection = () => {
  const {
    pool,
    price,
    handlePriceSet,
    formReady,
    preview,
    setPreview,
    fromCoin,
    setFromCoin,
    toCoin,
    setToCoin,
    fromDepositAmount,
    toDepositAmount,
    fromBalance,
    fromAmountError,
    toBalance,
    toAmountError,
    fromDepositShow,
    toDepositShow,
    lowPrice,
    setLowPrice,
    highPrice,
    setHighPrice,
    selectedFee,
    setSelectedFee,
    selectedCoin,
    setSelectedCoin,
    assistMessage,
    setAssistMessage,
    walletAddress,
    chain_id,
    block_number,
    router,
    handleConnectWallet,
    handleSwitchCoins,
    handleAddLiquidity,
    handleFullRange,
    handleLowPriceChange,
    handleHighPriceChange,
    handleFeeSelection,
    handleFromDepositAmountChange,
    handleToDepositAmountChange,
    handleHighPriceIncrease,
    handleHighPriceDecrease,
    handleLowPriceIncrease,
    handleLowPriceDecrease,
    isCoinSelected,
    isPoolFeeSelected,
    isAllSelected,
    handleClearAll,
    firstCoin,
    setFirstCoin,
    secondCoin,
    setSecondCoin,
  } = useAddLiquidity();

  const renederRangePrice = (price: string): string => {
    if (!selectedFee) return price;
    if (price == String(LIQUIDITY_PRICE_RANGE[selectedFee].min_price)) {
      return "0";
    } else if (price == String(LIQUIDITY_PRICE_RANGE[selectedFee].max_price)) {
      return INFINITY_TEXT;
    }
    return price;
  };

  const renederDepositAmount = (amount: string): string => {
    return amount;
    // return amount ? noExponents(beautifyNumber(amount)) : amount;
  };

  return (
    <div className="flex flex-col container mt-36 rounded-xl max-w-2xl border border-slate-800 py-6  ">
      <div className="flex items-center justify-between mb-6">
        <ArrowLeft
          className="text-white text-2xl cursor-pointer"
          onClick={() => router.back()}
        />
        <h1 className="text-xl text-white  font-bold ">Add Liquidity</h1>
        <div
          className="text-xs text-slate-400 cursor-pointer"
          onClick={handleClearAll}
        >
          Clear All
        </div>
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
              setSecondarayCoin={setFirstCoin}
            />
            <SelectCoinSection
              coin={toCoin}
              setCoin={setToCoin}
              handleConnectWallet={handleConnectWallet}
              walletAddress={walletAddress}
              setSecondarayCoin={setSecondCoin}
            />
          </div>
        </div>
        <div
          className={`grid cursor-pointer grid-cols-3 gap-4 mt-4 ${!isCoinSelected && "pointer-events-none opacity-50"}`}
        >
          {POOL_FEES.map((fee, idx) => (
            <div
              key={idx}
              className={`text-white flex flex-col gap-2 border border-slate-800 p-4 
              rounded-md relative ${selectedFee === fee ? "border-purple-500" : ""}`}
              onClick={() => {
                handleFeeSelection(fee);
              }}
            >
              {selectedFee === fee && (
                <span className="absolute top-0 right-0 h-6 w-6 flex items-center justify-center bg-primary rounded-full text-white">
                  &#10003;
                </span>
              )}
              <h1 className="text-base font-medium">{PoolFeeText[fee]}%</h1>
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
                  className="text-xs text-slate-400 px-2 py-1 rounded-md border border-slate-800 cursor-pointer"
                  onClick={handleFullRange}
                >
                  Full Range
                </div>
                {/* select coin  */}
                {firstCoin && (
                  <div
                    className={`text-xs cursor-pointer text-slate-400 px-2 py-1 rounded-md border border-slate-800 ${
                      selectedCoin === firstCoin.token_info.symbol
                        ? "border border-white text-white"
                        : ""
                    }`}
                    onClick={() => {
                      handleSwitchCoins();
                      setSelectedCoin(firstCoin.token_info.symbol);
                    }}
                  >
                    {firstCoin.token_info.symbol}
                  </div>
                )}
                {secondCoin && (
                  <div
                    className={`text-xs cursor-pointer text-slate-400 px-2 py-1 rounded-md border border-slate-800 ${
                      selectedCoin === secondCoin.token_info.symbol
                        ? "border border-white text-white"
                        : ""
                    }`}
                    onClick={() => {
                      handleSwitchCoins();
                      setSelectedCoin(secondCoin.token_info.symbol);
                    }}
                  >
                    {secondCoin.token_info.symbol}
                  </div>
                )}
              </div>
            </div>
            <LoadingModal openStatus={false} setOpenStatus={() => {}} />
            <div className="grid w-full items-center gap-4 mb-4">
              <div className="flex flex-col bg-slate-900 space-y-1.5 px-3 py-5 rounded-2xl">
                <label className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-400">
                  Low Price
                </label>
                <div className="flex items-center justify-between space-x-2 ">
                  <div className="flex flex-col items-end space-y-1.5">
                    <input
                      type="text"
                      // pattern="^[0-9]*[.,]?[0-9]*$"
                      className="flex h-10 w-full rounded-md border-input ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-transparent p-0 border border-none text-white placeholder:text-gray-400 text-xl placeholder:text-xl py-7 font-medium focus:outline-none focus:border-none"
                      id="youPay"
                      placeholder="0"
                      value={renederRangePrice(lowPrice)}
                      onChange={(e) =>
                        handleLowPriceChange(e.target.value, "change")
                      }
                      onBlur={(e) =>
                        handleLowPriceChange(e.target.value, "blur")
                      }
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
                  {toCoin?.basic.code} per {fromCoin?.basic.code}
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
                      // pattern="^[0-9]*[.,]?[0-9]*$"
                      className="flex h-10 w-full rounded-md border-input ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-transparent p-0 border border-none text-white placeholder:text-gray-400 text-xl placeholder:text-xl py-7 font-medium focus:outline-none focus:border-none"
                      id="youPay"
                      placeholder="0"
                      value={renederRangePrice(highPrice)}
                      onChange={(e) =>
                        handleHighPriceChange(e.target.value, "change")
                      }
                      onBlur={(e) =>
                        handleHighPriceChange(e.target.value, "blur")
                      }
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
                  {toCoin?.basic.code} per {fromCoin?.basic.code}
                </label>
              </div>
            </div>
          </div>
          {pool
            ? selectedFee && (
                <div className="flex items-center justify-between text-white mb-6">
                  <div>
                    <h1 className="text-sm font-medium">Current Price</h1>
                    <p className="text-xl text-slate-400">
                      {beautifyNumber(price, 3)}
                    </p>
                    <h1 className="text-sm font-medium">
                      {toCoin?.basic.code} per {fromCoin?.basic.code}
                    </h1>
                  </div>
                </div>
              )
            : selectedFee && (
                <div>
                  <div className="w-full bg-primary/50 text-white text-xs mb-4 rounded-2xl p-3">
                    This pool must be initialized before you can add liquidity.
                    To initialize, select a starting price for the pool. Then,
                    enter your liquidity price range and deposit amount. Gas
                    fees will be higher than usual due to the initialization
                    transaction.
                    {/* {assistMessage} */}
                  </div>
                  <div className="flex items-center justify-between w-full text-white mb-6">
                    <div className="flex items-center justify-between w-full space-x-2 bg-slate-900 px-3 py-5 rounded-2xl">
                      <input
                        type="text"
                        placeholder="0"
                        className="bg-slate-950 text-white w-full "
                        onChange={handlePriceSet}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between w-full text-gray-400 mb-6">
                    <div>Starting {fromCoin?.basic.code} Price:</div>
                    {price ? (
                      <div>
                        {price} {toCoin?.basic.code} per {fromCoin?.basic.code}
                      </div>
                    ) : (
                      <div>-</div>
                    )}
                  </div>
                </div>
              )}
          {(fromDepositShow || toDepositShow) && (
            <div className="my-2">
              <div className="flex items-center justify-between text-white mb-6">
                <h1 className="text-xs font-medium">Deposit Amount</h1>
              </div>
            </div>
          )}
          <div>
            {fromCoin && fromDepositShow && (
              <div className="grid w-full items-center gap-4 mb-4">
                <div className="flex flex-col bg-slate-900 space-y-1.5 px-3 py-5 rounded-2xl">
                  <div className="flex items-center justify-between space-x-2 ">
                    <div className="flex flex-col items-start space-y-1.5">
                      <input
                        type="text"
                        pattern="^[0-9]*[.,]?[0-9]*$"
                        className={`flex h-10 w-full rounded-md border-input ring-offset-background file:border-0 
                        file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 
                        focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 
                        bg-transparent p-0 border ${
                          fromAmountError ? "border-red-500" : "border-none"
                        } text-white placeholder:text-gray-400 text-xl 
                        placeholder:text-xl py-7 font-medium focus:outline-none focus:border-none`}
                        id="youPay"
                        placeholder="0"
                        value={renederDepositAmount(fromDepositAmount)}
                        onChange={(e) =>
                          handleFromDepositAmountChange(e.target.value)
                        }
                      />
                      {fromAmountError && (
                        <p className="text-red-500 text-[10px] mt-1 mr-3">
                          {fromAmountError}
                        </p>
                      )}
                      {/* <label className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-400">
                        -
                      </label> */}
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
                        <span>Balance: {beautifyNumber(fromBalance)}</span>
                        {/* <span className="text-primary bg-primary bg-opacity-30 ml-2 text-sm px-2 py-1 rounded-md">
                          Max
                        </span> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {toCoin && toDepositShow && (
              <div className="grid w-full items-center gap-4 mb-4">
                <div className="flex flex-col bg-slate-900 space-y-1.5 px-3 py-5 rounded-2xl">
                  <div className="flex items-center justify-between space-x-2 ">
                    <div className="flex flex-col items-start space-y-1.5">
                      <input
                        type="text"
                        pattern="^[0-9]*[.,]?[0-9]*$"
                        className={`flex h-10 w-full rounded-md border-input ring-offset-background file:border-0 
                        file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 
                        focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 
                        bg-transparent p-0 border ${
                          toAmountError ? "border-red-500" : "border-none"
                        } text-white placeholder:text-gray-400 text-xl 
                        placeholder:text-xl py-7 font-medium focus:outline-none focus:border-none`}
                        id="youPay"
                        placeholder="0"
                        value={renederDepositAmount(toDepositAmount)}
                        onChange={(e) =>
                          handleToDepositAmountChange(e.target.value)
                        }
                      />
                      {toAmountError && (
                        <p className="text-red-500 text-[10px] mt-1 mr-3">
                          {toAmountError}
                        </p>
                      )}
                      {/* <label className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-400">
                        -
                      </label> */}
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
                        <span>Balance: {beautifyNumber(toBalance)}</span>
                        {/* <span className="text-primary bg-primary bg-opacity-30 ml-2 text-sm px-2 py-1 rounded-md">
                          Max
                        </span> */}
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
          handleSwitchCoins={handleSwitchCoins}
          selectedCoin={selectedCoin}
          setSelectedCoin={setSelectedCoin}
          lowPrice={lowPrice}
          highPrice={highPrice}
          firstCoin={firstCoin}
          secondCoin={secondCoin}
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
            disabled={!formReady}
            className="bg-[#7e22ce4a] text-primary py-7 text-xl font-semibold rounded-2xl 
            w-full hover:text-white hover:bg-primary hover:border-primary"
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
