import { ethers } from "ethers";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PositionInfo, getPositionInfo } from "../utils/uniswap/liquidity";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "@/store";
import { setWallet, walletSliceType } from "@/store/slice/wallet.slice";
import { useToast } from "../components/ui/use-toast";
import { getCoinData } from "../utils/network/coin-data";
import { CoinData } from "../utils/types";
import { getProvider } from "../utils/wallet";

const useRemoveLiquidity = () => {
  const { toast } = useToast();
  const {
    wallet_address: walletAddress,
    chain_id,
    block_number,
  } = useSelector((state: IRootState) => state.wallet);
  const dispatch = useDispatch();

  const [percent, setPercent] = useState(0);
  const { tokenId } = useParams<{ tokenId: string }>();
  const [fromCoin, setFromCoin] = useState<CoinData>(null);
  const [toCoin, setToCoin] = useState<CoinData>(null);
  const [selectedCoin, setSelectedCoin] = useState<string>("");
  const [positionDetails, setPositionDetails] = useState<PositionInfo>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>(null);

  const getPositionDetails = async (
    tokenId: string,
    load = true,
  ): Promise<PositionInfo> => {
    try {
      load && setLoading(true);
      const position = await getPositionInfo(tokenId, provider, null, true);
      // console.log("position: ", position);
      if (walletAddress.toLowerCase() != position.owner.toLowerCase()) {
        throw new Error("Not Authorized!!");
      }

      setPositionDetails(position);
      setFromCoin(await getCoinData(position.token0, provider));
      setToCoin(await getCoinData(position.token1, provider));
      setSelectedCoin(position.token1.symbol);

      load && setLoading(false);
      return positionDetails;
    } catch (error) {
      setLoading(false);
      router.push("/pool");
      toast({
        title: "Error",
        description: "Position not found",
      });
      console.error(error);
      return null;
    }
  };

  const clearData = (action: "clear_all" = "clear_all") => {};
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
    tokenId &&
      chain_id &&
      getPositionDetails(tokenId, positionDetails ? false : true);
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

  const handleSwapCoin = () => {
    const temp = fromCoin;
    setFromCoin(toCoin);
    setToCoin(temp);
  };

  return {
    fromCoin,
    toCoin,
    positionDetails,
    loading,
    handleSwapCoin,
    selectedCoin,
    setSelectedCoin,
    percent,
    setPercent,
  };
};

export default useRemoveLiquidity;
