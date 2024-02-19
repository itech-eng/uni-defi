import IUniswapV3PoolABI from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import IUniswapV3FactoryABI from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Factory.sol/IUniswapV3Factory.json";
import { ethers } from "ethers";
import { NetworkData } from "../types";
import { Token } from "@uniswap/sdk-core";
import { POOL_FEES } from "../corearrays";
import { getProvider } from "../wallet";
import { ETH_NULL_ADDRESS } from "../coreconstants";

export interface PoolInfo {
  token0: string;
  token1: string;
  fee: number;
  tickSpacing: number;
  sqrtPriceX96: ethers.BigNumber | number;
  liquidity: ethers.BigNumber | number;
  tick: number;
}

export async function getPoolInfo(
  network_data: NetworkData,
  fromToken: Token,
  toToken: Token,
  poolFee?: number,
): Promise<PoolInfo> {
  const provider = getProvider();
  if (!provider) {
    throw new Error("No provider");
  }

  let poolAddress = "";

  if (poolFee) {
    poolAddress = await getPoolAddress(
      network_data,
      fromToken,
      toToken,
      poolFee,
      provider,
    );
  } else {
    for (let i = 0; i < POOL_FEES.length; i++) {
      poolAddress = await getPoolAddress(
        network_data,
        fromToken,
        toToken,
        POOL_FEES[i],
        provider,
      );
      poolFee = POOL_FEES[i];
      if (poolAddress && poolAddress != ETH_NULL_ADDRESS) break;
    }
  }

  if (!poolAddress || poolAddress == ETH_NULL_ADDRESS) {
    throw new Error("No pool available");
  }

  const poolContract = new ethers.Contract(
    poolAddress,
    IUniswapV3PoolABI.abi,
    provider,
  );

  const [token0, token1, fee, tickSpacing, liquidity, slot0] =
    await Promise.all([
      poolContract.token0(),
      poolContract.token1(),
      poolContract.fee(),
      poolContract.tickSpacing(),
      poolContract.liquidity(),
      poolContract.slot0(),
    ]);

  return {
    token0,
    token1,
    fee,
    tickSpacing,
    liquidity,
    sqrtPriceX96: slot0[0],
    tick: slot0[1],
  };
}

export async function getPoolAddress(
  network_data: NetworkData,
  fromToken: Token,
  toToken: Token,
  poolFee: number,
  provider?: ethers.providers.Web3Provider,
) {
  provider = provider ?? getProvider();
  const factoryContract = new ethers.Contract(
    network_data.contract.v3_factory.address,
    IUniswapV3FactoryABI.abi,
    provider,
  );

  const poolAddress = await factoryContract.getPool(
    fromToken.address,
    toToken.address,
    poolFee,
  );
  return poolAddress;
}
