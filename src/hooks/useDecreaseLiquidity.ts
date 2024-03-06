import { ethers } from "ethers";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getPositionInfo } from "../utils/uniswap/liquidity";

const useDecreaseLiquidity = () => {
  const [selectedCoin, setSelectedCoin] = useState<string>();
  const { tokenId } = useParams<{ tokenId: string }>();
  const [token0, setToken0] = useState<any>(null);
  const [token1, setToken1] = useState<any>(null);
  const [positionDetails, setPositionDetails] = useState<any>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>(null);

  const getPositionDetails = async (tokenId: any) => {
    setLoading(true);
    const positions = await getPositionInfo(tokenId, provider, null, true);
    setPositionDetails(positions);
    setToken0(positions.token0);
    setToken1(positions.token1);

    setSelectedCoin(positions.token1.symbol);
    console.log(positions, "positions");
    setLoading(false);
  };
  useEffect(() => {
    tokenId && getPositionDetails(tokenId);
  }, [tokenId]);
  const handleSwapCoin = () => {
    const temp = token0;
    setToken0(token1);
    setToken1(temp);
  };
  return {
    token0,
    token1,
    positionDetails,
    loading,
    handleSwapCoin,
    selectedCoin,
    setSelectedCoin,
  };
};
export default useDecreaseLiquidity;
