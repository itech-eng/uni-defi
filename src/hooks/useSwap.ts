import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setWallet, walletSliceType } from "@/store/slice/wallet.slice";
import { getAllBalance } from "@/src/utils/uniswap/erc";
import { IRootState } from "@/store";

const useSwapSection = () => {
  const [payInfo, setPayInfo] = useState<any>(null);
  const [receiveInfo, setReceiveInfo] = useState<any>(null);
  const [payBalance, setPayBalance] = useState<string | null>(null);
  const [receiveBalance, setReceiveBalance] = useState<string | null>(null);
  const walletAddress = useSelector(
    (state: IRootState) => state.wallet.wallet_address,
  );
  const dispatch = useDispatch();
  const [loadingPayBalance, setLoadingPayBalance] = useState<boolean>(false);
  const [loadingReceiveBalance, setLoadingReceiveBalance] =
    useState<boolean>(false);

  const switchTokens = () => {
    const tempPayInfo = payInfo;
    setPayInfo(receiveInfo);
    setReceiveInfo(tempPayInfo);

    const tempPayBalance = payBalance;
    setPayBalance(receiveBalance);
    setReceiveBalance(tempPayBalance);
  };

  const handleConnectWallet = () => {
    dispatch(setWallet<walletSliceType>({ open_wallet_sidebar: true }));
  };

  const handleSwap = () => {
    alert("Need to Implement");
  };

  const fetchAndSetBalance = async (
    info,
    setBalanceSetter,
    setLoadingSetter,
  ) => {
    setLoadingSetter(true);
    const balance = await getAllBalance(info);
    setBalanceSetter(balance);
    setLoadingSetter(false);
  };

  useEffect(() => {
    if (payInfo) {
      fetchAndSetBalance(payInfo, setPayBalance, setLoadingPayBalance);
    }
  }, [payInfo]);

  useEffect(() => {
    if (receiveInfo) {
      fetchAndSetBalance(
        receiveInfo,
        setReceiveBalance,
        setLoadingReceiveBalance,
      );
    }
  }, [receiveInfo]);

  return {
    payInfo,
    setPayInfo,
    receiveInfo,
    setReceiveInfo,
    payBalance,
    receiveBalance,
    switchTokens,
    handleConnectWallet,
    walletAddress,
    handleSwap,
    loadingPayBalance,
    loadingReceiveBalance,
  };
};

export default useSwapSection;