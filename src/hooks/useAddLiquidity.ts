import { useEffect, useState } from "react";
import { CoinData } from "@/src/utils/types";
import { useDispatch, useSelector } from "react-redux";
import { setWallet, walletSliceType } from "@/store/slice/wallet.slice";
import { useToast } from "@/src/components/ui/use-toast";
import { IRootState } from "@/store";
import { useRouter } from "next/navigation";
import { getCoinBalance } from "../utils/eth/eth";
import { PoolInfo, getPoolInfo } from "../utils/uniswap/pool";
import { getProvider } from "../utils/wallet";
import { getNetworkData, noExponents, sleep } from "../utils/corefunctions";
import { getPriceFromSqrtPx96, getTickFromPrice } from "../utils/uniswap/maths";
import { getConvertedAmountForLiqDeposit } from "../utils/uniswap/liquidity";
import { getTickNPrice } from "../utils/uniswap/helpers";
import { INFINITY_TEXT, LIQUIDITY_PRICE_RANGE } from "../utils/coreconstants";

export const useAddLiquidity = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { toast } = useToast();

  const [fromCoin, setFromCoin] = useState<CoinData>(null);
  const [toCoin, setToCoin] = useState<CoinData>(null);

  const [firstCoin, setFirstCoin] = useState<CoinData>(null);
  const [secondCoin, setSecondCoin] = useState<CoinData>(null);
  const [selectedCoin, setSelectedCoin] = useState<string>(null);

  const [lowPrice, setLowPrice] = useState("");
  const [highPrice, setHighPrice] = useState("");
  const [tickLower, setTickLower] = useState<number>(null);
  const [tickUpper, setTickUpper] = useState<number>(null);

  const [selectedFee, setSelectedFee] = useState<number>(null);
  const [pool, setPool] = useState<PoolInfo>(null);
  const [price, setPrice] = useState<string>();

  const [fromDepositAmount, setFromDepositAmount] = useState("");
  const [toDepositAmount, setToDepositAmount] = useState("");
  const [fromDepositShow, setFromDepositShow] = useState(true);
  const [toDepositShow, setToDepositShow] = useState(true);
  const [fromBalance, setFromBalance] = useState<string | number | null>(null);
  const [toBalance, setToBalance] = useState<string | number | null>(null);
  const [fromAmountError, setFromAmountError] = useState<string>("");
  const [toAmountError, setToAmountError] = useState<string>("");

  const [assistMessage, setAssistMessage] = useState<string>("Test Assist...");
  const [formReady, setFormReady] = useState<boolean>(false);
  const [preview, setPreview] = useState(false);

  const {
    wallet_address: walletAddress,
    chain_id,
    block_number,
  } = useSelector((state: IRootState) => state.wallet);

  /* useEffects */
  useEffect(() => {
    clearData();
  }, [chain_id]);

  useEffect(() => {
    fetchAndSetBalance(fromCoin, setFromBalance);
    fetchAndSetBalance(toCoin, setToBalance);
  }, [block_number]);

  useEffect(() => {
    // assistantMessage();
    if (
      fromCoin &&
      toCoin &&
      selectedFee &&
      Number(price) &&
      tickLower &&
      tickUpper &&
      fromDepositAmount &&
      toDepositAmount &&
      !fromAmountError &&
      !toAmountError
    ) {
      setFormReady(true);
    }
  }, [
    selectedCoin,
    assistMessage,
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
  ]);

  useEffect(() => {
    assistantMessage();
    if (Number(fromDepositAmount) > Number(fromBalance)) {
      setFromAmountError("Insufficient balance");
    } else {
      setFromAmountError("");
    }

    if (Number(toDepositAmount) > Number(toBalance)) {
      setToAmountError("Insufficient balance");
    } else {
      setToAmountError("");
    }
  }, [fromDepositAmount, toDepositAmount, walletAddress]);

  useEffect(() => {
    if (fromCoin) {
      if (
        fromCoin.basic.code == toCoin?.basic.code ||
        (fromCoin.is_native && toCoin?.is_native_wrap) ||
        (fromCoin.is_native_wrap && toCoin?.is_native)
      ) {
        setFromCoin(null);
        setFromBalance(null);
        return;
      }
      fetchAndSetBalance(fromCoin, setFromBalance);
      resetAmounts();
    }
  }, [fromCoin]);

  useEffect(() => {
    if (toCoin) {
      if (
        fromCoin.basic.code == toCoin?.basic.code ||
        (fromCoin.is_native && toCoin?.is_native_wrap) ||
        (fromCoin.is_native_wrap && toCoin?.is_native)
      ) {
        setToCoin(null);
        setToBalance(null);
        return;
      }
      fetchAndSetBalance(toCoin, setToBalance);
      resetAmounts();
    }
  }, [toCoin]);
  /*  */

  /* core functons  */
  const assistantMessage = () => {
    if (!walletAddress) {
      return setAssistMessage("Please connect your wallet.");
    }
    if (!fromCoin && !toCoin) {
      setAssistMessage("Please select both 'Pay' and 'Receive' coins.");
    } else if (!fromCoin) {
      setAssistMessage("Please select the 'Pay' coin.");
    } else if (!toCoin) {
      setAssistMessage("Please select the 'Receive' coin.");
    } else if (!fromDepositAmount && !toDepositAmount) {
      setAssistMessage("Please enter 'Pay' or 'Receive' amount.");
    } else {
      setTimeout(() => setAssistMessage(""), 2000);
    }
  };

  const clearData = (
    action: "clear_all" | "fee_change" | "switch_coin" = "clear_all",
  ) => {
    if (action == "clear_all") {
      setFromCoin(null);
      setToCoin(null);

      setFirstCoin(null);
      setSecondCoin(null);
      setSelectedCoin(null);

      setSelectedFee(null);
    }

    setPool(null);
    setPrice("");

    setLowPrice("");
    setHighPrice("");
    setTickLower(null);
    setTickUpper(null);

    setFromDepositShow(true);
    setToDepositShow(true);
    setFromBalance("");
    setToBalance("");
    setFromDepositAmount("");
    setToDepositAmount("");
    setFromAmountError("");
    setToAmountError("");

    setAssistMessage("");
    setFormReady(false);
    setPreview(false);
  };

  const fetchAndSetBalance = async (
    coin: CoinData,
    setBalanceSetter: (balance: string | number) => void,
    setLoadingSetter?: any,
  ) => {
    try {
      if (!coin) {
        setBalanceSetter(null);
        return;
      }
      setLoadingSetter && setLoadingSetter(true);
      const balance = await getCoinBalance(coin);
      setBalanceSetter(balance);
      setLoadingSetter && setLoadingSetter(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
      });
    }
  };

  const resetAmounts = (fromAmount = "", toAmount = "") => {
    setFromDepositAmount(fromAmount);
    setFromAmountError("");
    setToDepositAmount(toAmount);
    setToAmountError("");
  };

  const processPriceRangeCondition = async (tickH: number, tickL: number) => {
    await sleep(100);
    if (tickH && tickL && Number(price)) {
      if (tickL < tickH) {
        throw new Error("Price Low cannot be greater than Price High!!");
      }
      const currentTick = getTickFromPrice(Number(price));
      if (tickH == tickL) {
        //no deposit amount needed for coinA, coinB
        setFromDepositShow(false);
        setToDepositShow(false);
      } else if (currentTick < tickL) {
        //no deposit amount needed for coinB
        setToDepositShow(false);
      } else if (currentTick > tickH) {
        //no deposit amount needed for coinA
        setFromDepositShow(false);
      }
    }
  };
  /*  */

  /* Handlers */
  const handleClearAll = () => {
    clearData();
  };

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

  const handleSwitchCoins = () => {
    const temp = fromCoin;
    setFromCoin(toCoin);
    setToCoin(temp);
    const tempAmount = fromDepositAmount;
    setFromDepositAmount(toDepositAmount);
    setToDepositAmount(tempAmount);
  };

  const handleFeeSelection = async (fee: number) => {
    try {
      setSelectedFee(fee);
      const provider = getProvider();
      const network_data = await getNetworkData(provider);
      try {
        const pool = await getPoolInfo(
          network_data,
          fromCoin.token_info,
          toCoin.token_info,
          fee,
        );
        setPool(pool);
        if (pool) {
          const price = getPriceFromSqrtPx96(Number(pool.sqrtPriceX96));
          setPrice(String(noExponents(price)));
        }
      } catch (e) {
        setPool(null);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleFullRange = () => {
    if (selectedFee) {
      const res = LIQUIDITY_PRICE_RANGE[selectedFee];
      setLowPrice(String(res.min_price));
      setTickLower(res.min_tick);
      setHighPrice(String(res.max_price));
      setTickUpper(res.max_tick);
    }
  };

  const handleLowPriceChange = (value: string) => {
    try {
      if (Number(value) == 0) {
        setHighPrice(String(LIQUIDITY_PRICE_RANGE[selectedFee].min_price));
        setTickLower(LIQUIDITY_PRICE_RANGE[selectedFee].min_tick);
        return;
      }

      const res = getTickNPrice("rounded", selectedFee, Number(value));
      setLowPrice(String(res.price));
      setTickLower(res.tick);
      processPriceRangeCondition(tickUpper, res.tick);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleHighPriceChange = (value: string) => {
    try {
      if (value == INFINITY_TEXT) {
        setHighPrice(String(LIQUIDITY_PRICE_RANGE[selectedFee].max_price));
        setTickUpper(LIQUIDITY_PRICE_RANGE[selectedFee].max_tick);
        return;
      }
      const res = getTickNPrice("rounded", selectedFee, Number(value));
      setHighPrice(String(res.price));
      setTickUpper(res.tick);
      processPriceRangeCondition(res.tick, tickLower);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleHighPriceIncrease = () => {};
  const handleHighPriceDecrease = () => {};
  const handleLowPriceIncrease = () => {};
  const handleLowPriceDecrease = () => {};

  const handlePriceSet = (e: any) => {
    const price = e.target.value;
    setPrice(noExponents(price));
  };

  const handleFromDepositAmountChange = async (amount: string) => {
    try {
      if (!fromCoin) {
        setFromAmountError("Please select a coin");
        return;
      }
      if (amount === "" || amount === null) {
        resetAmounts();
      } else {
        const parsedAmount = parseFloat(amount);
        if (!isNaN(parsedAmount)) {
          if (parsedAmount > Number(fromBalance)) {
            setFromDepositAmount(amount);
            setFromAmountError("Insufficient balance");
          } else {
            setFromDepositAmount(amount);
            setFromAmountError("");
            if (toCoin && parsedAmount) {
              const res = getConvertedAmountForLiqDeposit(
                fromCoin,
                toCoin,
                Number(price),
                Number(lowPrice),
                Number(highPrice),
                parsedAmount,
              );
              resetAmounts(String(res.amountA), String(res.amountB));
            }
          }
        } else {
          setFromDepositAmount("");
          setFromAmountError("Please enter a valid number");
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleToDepositAmountChange = async (amount: string) => {
    try {
      if (!toCoin) {
        setToAmountError("Please select a coin");
        return;
      }
      if (amount === "" || amount === null) {
        resetAmounts();
      } else {
        const parsedAmount = parseFloat(amount);
        if (!isNaN(parsedAmount)) {
          if (parsedAmount > Number(toBalance)) {
            setToAmountError("Amount cannot exceed balance");
            setToDepositAmount("");
          } else {
            setToAmountError("");
            setToDepositAmount(amount);

            if (fromCoin && parsedAmount) {
              setAssistMessage("Fetching converted amount...");
              const res = getConvertedAmountForLiqDeposit(
                fromCoin,
                toCoin,
                Number(price),
                Number(lowPrice),
                Number(highPrice),
                null,
                parsedAmount,
              );
              resetAmounts(String(res.amountA), String(res.amountB));
            }
          }
        } else {
          setToDepositAmount("");
          setToAmountError("Please enter a valid number");
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleAddLiquidity = (e: any) => {
    e.preventDefault();
    console.log("Selected Fee:", selectedFee);
    console.log("From Coin:", fromCoin);
    console.log("To Coin:", toCoin);
    console.log("Low Price:", lowPrice);
    console.log("High Price:", highPrice);
  };
  /*  */

  const isCoinSelected = fromCoin && toCoin;
  const isPoolFeeSelected = selectedFee !== null;
  const isAllSelected = isCoinSelected && isPoolFeeSelected;

  return {
    formReady,
    preview,
    pool,
    price,
    handlePriceSet,
    setPreview,
    fromCoin,
    setFromCoin,
    toCoin,
    setToCoin,
    fromDepositAmount,
    setFromDepositAmount,
    toDepositAmount,
    setToDepositAmount,
    fromBalance,
    setFromBalance,
    fromAmountError,
    setFromAmountError,
    toBalance,
    setToBalance,
    toAmountError,
    setToAmountError,
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
    handleClearAll,
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
    firstCoin,
    setFirstCoin,
    secondCoin,
    setSecondCoin,
  };
};
