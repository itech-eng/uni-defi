import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setWallet, walletSliceType } from "@/store/slice/wallet.slice";
import { IRootState } from "@/store";
import { getCoinBalance } from "../utils/eth/eth";
import { CoinData } from "../utils/types";

const useSwapSection = () => {
  const [fromCoin, setFromCoin] = useState<any>(null);
  const [toCoin, setToCoin] = useState<any>(null);
  const [fromAmount, setFromAmount] = useState<number>();
  const [toAmount, setToAmount] = useState<number>();
  const [fromBalance, setFromBalance] = useState<string | number | null>(null);
  const [toBalance, setToBalance] = useState<string | number | null>(null);
  const [fromAmountError, setFromAmountError] = useState<string>("");
  const [toAmountError, setToAmountError] = useState<string>("");
  const [assistMessage, setAssistMessage] = useState<string>("");
  const walletAddress = useSelector(
    (state: IRootState) => state.wallet.wallet_address,
  );
  const [showConfirmSwap, setShowConfirmSwap] = useState(false);
  const dispatch = useDispatch();
  const [loadingPayBalance, setLoadingPayBalance] = useState<boolean>(false);
  const [loadingReceiveBalance, setLoadingReceiveBalance] =
    useState<boolean>(false);
  useEffect(() => {
    if (fromCoin) {
      setFromAmountError("");
    } else if (toCoin) {
      setToAmountError("");
    }
  }, [fromCoin, toCoin]);

  const switchCoins = () => {
    const tempToInfo = fromCoin;
    setFromCoin(toCoin);
    setToCoin(tempToInfo);

    const tempToBalance = fromBalance;
    setFromBalance(toBalance);
    setToBalance(tempToBalance);

    const tempToAmount = fromAmount;
    setFromAmount(toAmount);
    setToAmount(tempToAmount);
    setFromAmountError("");
    setToAmountError("");
  };
  const handleChangeFromAmount = (amount: number | string) => {
    if (!fromCoin) {
      setFromAmountError("Please select a coin");
      return;
    }
    if (amount === "" || amount === null) {
      setFromAmount(0);
      setFromAmountError("");
    } else {
      const parsedAmount = parseFloat(amount as string);
      if (parsedAmount > Number(fromBalance)) {
        setFromAmountError("Amount cannot exceed balance");
      } else {
        setFromAmountError("");
        setFromAmount(parsedAmount);
      }
    }
  };

  const handleChangeToAmount = (amount: number | string) => {
    if (!toCoin) {
      setToAmountError("Please select a coin");
      return;
    }
    if (amount === "" || amount === null) {
      setToAmount(0);
      setToAmountError("");
    } else {
      const parsedAmount = parseFloat(amount as string);
      console.log(parsedAmount, toBalance);
      if (parsedAmount > Number(toBalance)) {
        setToAmountError("Amount cannot exceed balance");
      } else {
        setToAmountError("");
        setToAmount(parsedAmount);
      }
    }
  };

  const handleConnectWallet = () => {
    dispatch(setWallet<walletSliceType>({ open_wallet_sidebar: true }));
  };

  const handleSwap = () => {
    if (fromAmountError || toAmountError) {
      return;
    }
    if (fromAmount === undefined || toAmount === undefined) {
      return;
    }
    if (fromAmount === 0 || toAmount === 0) {
      return;
    }
    if (!fromCoin || !toCoin) {
      return;
    }
    if (!walletAddress) {
      return;
    }
    setShowConfirmSwap(true);
  };

  const assistantMessage = () => {
    if (!walletAddress) {
      return setAssistMessage("Please connect your wallet.");
    }
    if (!fromCoin && !toCoin) {
      setAssistMessage("Please select both 'From' and 'To' coins.");
    } else if (!fromCoin) {
      setAssistMessage("Please select the 'From' coin.");
    } else if (!toCoin) {
      setAssistMessage("Please select the 'To' coin.");
    } else if (!fromAmount && !toAmount) {
      setAssistMessage("Please enter both 'From' and 'To' amounts.");
    } else if (!fromAmount) {
      setAssistMessage("Please enter the 'From' amount.");
    } else if (!toAmount) {
      setAssistMessage("Please enter the 'To' amount.");
    } else {
      setAssistMessage("");
    }
  };

  useEffect(() => {
    assistantMessage();
  }, [fromCoin, toCoin, fromAmount, toAmount, walletAddress]);

  const fetchAndSetBalance = async (
    coin: CoinData,
    setBalanceSetter: (balance: string | number) => void,
    setLoadingSetter: any,
  ) => {
    setLoadingSetter(true);
    const balance = await getCoinBalance(coin);
    setBalanceSetter(balance);
    setLoadingSetter(false);
  };

  useEffect(() => {
    if (fromCoin) {
      fetchAndSetBalance(fromCoin, setFromBalance, setLoadingPayBalance);
    }
  }, [fromCoin]);

  useEffect(() => {
    if (toCoin) {
      fetchAndSetBalance(toCoin, setToBalance, setLoadingReceiveBalance);
    }
  }, [toCoin]);
  useEffect(() => {
    if (!walletAddress) {
      setFromCoin(null);
      setToCoin(null);
      setFromAmount(undefined);
      setToAmount(undefined);
      setFromBalance(null);
      setToBalance(null);
      setFromAmountError("");
      setToAmountError("");
      setShowConfirmSwap(false);
      setLoadingPayBalance(false);
      setLoadingReceiveBalance(false);
    }
  }, [walletAddress]);
  return {
    fromCoin,
    setFromCoin,
    toCoin,
    setToCoin,
    fromBalance,
    toBalance,
    switchCoins,
    handleConnectWallet,
    walletAddress,
    handleSwap,
    loadingPayBalance,
    loadingReceiveBalance,
    showConfirmSwap,
    setShowConfirmSwap,
    fromAmount,
    setFromAmount,
    toAmount,
    setToAmount,
    handleChangeFromAmount,
    handleChangeToAmount,
    fromAmountError,
    toAmountError,
    assistMessage,
  };
};

export default useSwapSection;
