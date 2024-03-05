import { ethers } from "ethers";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getPositionInfo } from "../utils/uniswap/liquidity";

 const usePoolDetails = () => {
  const [selectedCoin, setSelectedCoin] = useState<string>();
  const { tokenId } = useParams<{ tokenId: string }>();
  const [token0, setToken0] = useState<any>(null);
  const [token1, setToken1] = useState<any>(null);
  console.log(tokenId, "params");
  const [positionDetails, setPositionDetails] = useState<any>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>(null);
  const [firstCoin, setFirstCoin] = useState<any>();
  const [secondCoin, setSecondCoin] = useState<any>();
  const getPositionDetails = async (tokenId: any) => {
    setLoading(true);
    const positions = await getPositionInfo(tokenId, provider, null, true);
    setPositionDetails(positions);
    setToken0(positions.token0);
    setToken1(positions.token1);
    setFirstCoin(positions.token0);
    setSecondCoin(positions.token1);
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
    firstCoin,
    secondCoin,
    selectedCoin,
    setSelectedCoin,
  };
};
export default usePoolDetails;