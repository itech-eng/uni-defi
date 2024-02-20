import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setWallet, walletSliceType } from "@/store/slice/wallet.slice";
import { IRootState } from "@/store";
import { getCoinBalance } from "../utils/eth/eth";
import { CoinData } from "../utils/types";

const useSwapSection = () => {
  const [fromCoin, setFromCoin] = useState<any>(null);
  const [toCoin, setToCoin] = useState<any>(null);
  const [fromBalance, setFromBalance] = useState<string | number | null>(null);
  const [toBalance, setToBalance] = useState<string | number | null>(null);
  const walletAddress = useSelector(
    (state: IRootState) => state.wallet.wallet_address,
  );
  const dispatch = useDispatch();
  const [loadingPayBalance, setLoadingPayBalance] = useState<boolean>(false);
  const [loadingReceiveBalance, setLoadingReceiveBalance] =
    useState<boolean>(false);

  const switchCoins = () => {
    const tempPayInfo = fromCoin;
    setFromCoin(toCoin);
    setToCoin(tempPayInfo);

    const tempPayBalance = fromBalance;
    setFromBalance(toBalance);
    setToBalance(tempPayBalance);
  };

  const handleConnectWallet = () => {
    dispatch(setWallet<walletSliceType>({ open_wallet_sidebar: true }));
  };

  const handleSwap = () => {
    alert("Need to Implement");
  };

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
  };
};

export default useSwapSection;
