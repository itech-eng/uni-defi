import { ethers } from "ethers";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  PositionInfo,
  getConvertedAmountForLiqDeposit,
  getPositionInfo,
} from "../utils/uniswap/liquidity";
import { CoinData } from "../utils/types";
import { getCoinData } from "../utils/network/coin-data";
import { useToast } from "../components/ui/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "@/store";
import { setWallet, walletSliceType } from "@/store/slice/wallet.slice";
import { getProvider } from "../utils/wallet";
import { getCoinBalance } from "../utils/eth/eth";
import { beautifyNumber, noExponents, sleep } from "../utils/corefunctions";

const useIncreaseLiquidity = () => {
  const { toast } = useToast();
  const {
    wallet_address: walletAddress,
    chain_id,
    block_number,
  } = useSelector((state: IRootState) => state.wallet);
  const dispatch = useDispatch();

  const [selectedCoin, setSelectedCoin] = useState<string>();
  const { tokenId } = useParams<{ tokenId: string }>();
  const [fromCoin, setFromCoin] = useState<CoinData>(null);
  const [toCoin, setToCoin] = useState<CoinData>(null);
  const [positionDetails, setPositionDetails] = useState<any>(null);
  const router = useRouter();
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>(null);
  const [firstCoin, setFirstCoin] = useState<CoinData>();
  const [secondCoin, setSecondCoin] = useState<CoinData>();
  const [price, setPrice] = useState<string>();
  const [assistMessage, setAssistMessage] = useState<string>("");
  const [formReady, setFormReady] = useState<boolean>(false);
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);

  const [fromDepositAmount, setFromDepositAmount] = useState("");
  const [toDepositAmount, setToDepositAmount] = useState("");
  const [fromDepositShow, setFromDepositShow] = useState(false);
  const [toDepositShow, setToDepositShow] = useState(false);
  const [fromBalance, setFromBalance] = useState<string | number | null>(null);
  const [toBalance, setToBalance] = useState<string | number | null>(null);
  const [fromAmountError, setFromAmountError] = useState<string>("");
  const [toAmountError, setToAmountError] = useState<string>("");

  /*core functions  */
  const getPositionDetails = async (
    tokenId: string,
    load = true,
  ): Promise<PositionInfo> => {
    try {
      load && setLoading(true);
      const position = await getPositionInfo(tokenId, provider);

      setPositionDetails(position);
      setFromCoin(await getCoinData(position.token0, provider));
      setToCoin(await getCoinData(position.token1, provider));
      setFirstCoin(await getCoinData(position.token0, provider));
      setSecondCoin(await getCoinData(position.token1, provider));
      setSelectedCoin(position.token1.symbol);

      console.log(position, "position");

      load && setLoading(false);
      return positionDetails;
    } catch (error) {
      setLoading(false);
      router.back();
      toast({
        title: "Error",
        description: "Position not found",
      });
      console.error(error);
      return null;
    }
  };

  const clearData = (action: "clear_all" = "clear_all") => {};

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

  const processAndSetPriceAtoB = (price: number) => {
    if (fromCoin.token_info.address > toCoin.token_info.address) {
      price = 1 / price;
    }
    setPrice(noExponents(beautifyNumber(price)));
  };

  const resetAmounts = (fromAmount = "", toAmount = "") => {
    setFromDepositAmount(fromAmount);
    setFromAmountError("");
    setToDepositAmount(toAmount);
    setToAmountError("");
  };

  /*  */

  /* useEffects */
  useEffect(() => {
    setProvider(getProvider());
    tokenId && chain_id && getPositionDetails(tokenId);
  }, [tokenId, chain_id]);

  useEffect(() => {
    // chain_id && router.push("/pool");
  }, [chain_id]);

  useEffect(() => {
    tokenId && chain_id && getPositionDetails(tokenId, false);
  }, [block_number]);
  /*  */

  /* handlers */
  const handleClearAll = () => {
    try {
      clearData();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
      });
    }
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

  const handleSwitchCoins = async () => {
    try {
      // const fee = selectedFee;
      // const pl = pool;
      // const prc = price;
      // const lPrc = lowPrice;
      // const hPrc = highPrice;
      // const tickL = tickLower;
      // const tickU = tickUpper;
      // setFromCoin(toCoin);
      // setToCoin(fromCoin);
      // resetAmounts();
      // await sleep(5);
      // setSelectedFee(fee);
      // setPool(pl);
      // handlePriceSet(noExponents(beautifyNumber(1 / Number(prc))));
      // setLowPrice(lPrc);
      // setHighPrice(hPrc);
      // // hPrc && handleLowPriceChange(String(1 / Number(hPrc)));
      // // lPrc && handleHighPriceChange(String(1 / Number(lPrc)));
      // setTickLower(tickL);
      // setTickUpper(tickU);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
      });
    }
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
            if (toCoin) {
              // const res = getConvertedAmountForLiqDeposit(
              //   fromCoin,
              //   toCoin,
              //   Number(price),
              //   Number(lowPrice),
              //   Number(highPrice),
              //   parsedAmount,
              // );
              // setToDepositAmount(
              //   res.amountB ? noExponents(beautifyNumber(res.amountB)) : "",
              // );
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

            if (fromCoin) {
              // const res = getConvertedAmountForLiqDeposit(
              //   fromCoin,
              //   toCoin,
              //   Number(price),
              //   Number(lowPrice),
              //   Number(highPrice),
              //   null,
              //   parsedAmount,
              // );
              // setFromDepositAmount(
              //   res.amountA ? noExponents(beautifyNumber(res.amountA)) : "",
              // );
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

  const handleAddLiquidity = async () => {
    try {
      setPreview(false);
      setLoading(true);
      setAssistMessage("Wait for transaction completion ...");
      // await createAndAddLiquidity(
      //   fromCoin,
      //   toCoin,
      //   selectedFee,
      //   Number(price),
      //   Number(fromDepositAmount),
      //   Number(toDepositAmount),
      //   tickLower,
      //   tickUpper,
      // );
      // console.log({
      //   fromCoin,
      //   toCoin,
      //   selectedFee,
      //   price,
      //   tickLower,
      //   tickUpper,
      //   fromDepositAmount,
      //   toDepositAmount,
      // });
      toast({
        title: "Success",
        description: "Congratulations!! New Position Created",
      });
      clearData();
    } catch (error) {
      // console.error(error.message);
      setLoading(false);
      toast({
        title: "Error",
        description: error.message,
      });
    }
  };
  /*  */

  return {
    fromCoin,
    toCoin,
    positionDetails,
    loading,
    handleSwitchCoins,
    firstCoin,
    secondCoin,
    selectedCoin,
    setSelectedCoin,
  };
};

export default useIncreaseLiquidity;
