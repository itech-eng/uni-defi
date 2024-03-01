import { useEffect, useState } from "react";
import { CoinData } from "@/src/utils/types";
import { useDispatch, useSelector } from "react-redux";
import { setWallet, walletSliceType } from "@/store/slice/wallet.slice";
import { toast } from "@/src/components/ui/use-toast";
import { IRootState } from "@/store";
import { useRouter } from "next/navigation";
export const useAddLiquidity = () => {
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

  return {
    preview,
    setPreview,
    fromCoin,
    setFromCoin,
    toCoin,
    setToCoin,
    fromDepositAmount,
    setFromDepositAmount,
    toDepositAmount,
    setToDepositAmount,
    lowPrice,
    setLowPrice,
    highPrice,
    setHighPrice,
    selectedFee,
    setSelectedFee,
    selectedCoin,
    setSelectedCoin,
    assistanceMessage,
    setAssistanceMessage,
    walletAddress,
    chain_id,
    block_number,
    router,
    handleConnectWallet,
    handleSwapCoin,
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
  };
};
