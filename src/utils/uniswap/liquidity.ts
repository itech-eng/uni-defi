import { BigNumber, ethers } from "ethers";
import { getAddress, getProvider } from "../wallet";
import NonfungiblePositionManagerABI from "@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json";
import { NetworkData } from "../types";
import { formatNumber, getTokenByAddress } from "../corefunctions";
import { FeeAmount, TICK_SPACINGS } from "@uniswap/v3-sdk";
import { getPriceFromTick } from "./maths";
import { getPrice } from "./helpers";
import { Token } from "@uniswap/sdk-core";
import { INFINITY_TEXT, LIQUIDITY_PRICE_RANGE } from "../coreconstants";
import { CHAIN_SLUG_MAPPING, NETWORK_DATA } from "../network/network-data";

export interface PositionInfo {
  tokenId: number;
  tickLower: number;
  tickUpper: number;
  token0Address: string;
  token1Address: string;
  token0: Token;
  token1: Token;
  fee: number;
  liquidity: BigNumber | number | string;
  feeGrowthInside0LastX128: BigNumber | number | string;
  feeGrowthInside1LastX128: BigNumber | number | string;
  tokensOwed0: BigNumber | number | string;
  tokensOwed1: BigNumber | number | string;
  minPrice: number | string;
  maxPrice: number | string;
  currentPrice: number;
  inRange: boolean;
  closed: boolean;
}

export async function getPositions(
  provider?: ethers.providers.Web3Provider,
): Promise<PositionInfo[]> {
  provider = provider ?? getProvider();
  const address = await getAddress(provider);

  if (!provider || !address) {
    throw new Error("No provider available");
  }

  // console.log('provider: ', provider._network.chainId);
  const network = CHAIN_SLUG_MAPPING[provider._network.chainId];
  const network_data = NETWORK_DATA[network];

  const positionContract = new ethers.Contract(
    network_data.contract.nonfungible_position_manager.address,
    NonfungiblePositionManagerABI.abi,
    provider,
  );

  const balance: number = await positionContract.balanceOf(address);

  const tokenIds = [];
  for (let i = 0; i < balance; i++) {
    const tokenOfOwnerByIndex: number =
      await positionContract.tokenOfOwnerByIndex(address, i);
    tokenIds.push(Number(tokenOfOwnerByIndex));
  }

  const positions: PositionInfo[] = [];
  for (let i = 0; i < tokenIds.length; i++) {
    const pos = await getPositionInfo(network_data, tokenIds[i]);
    positions.push(pos);
  }

  return positions;
}

export async function getPositionInfo(
  network_data: NetworkData,
  tokenId: number,
): Promise<PositionInfo> {
  const provider = getProvider();

  if (!provider) {
    throw new Error("No provider available");
  }

  const positionContract = new ethers.Contract(
    network_data.contract.nonfungible_position_manager.address,
    NonfungiblePositionManagerABI.abi,
    provider,
  );

  const data = await positionContract.positions(tokenId);
  let position: PositionInfo = {
    token0Address: data.token0,
    token1Address: data.token1,
    tickLower: data.tickLower,
    tickUpper: data.tickUpper,
    tokensOwed0: data.tokensOwed0,
    tokensOwed1: data.tokensOwed1,
    fee: data.fee,
    feeGrowthInside0LastX128: data.feeGrowthInside0LastX128,
    feeGrowthInside1LastX128: data.feeGrowthInside1LastX128,
    liquidity: data.liquidity,
    tokenId: tokenId,
    minPrice: "",
    maxPrice: "",
    currentPrice: 0,
    inRange: false,
    closed: data.liquidity == 0,
    token0: null,
    token1: null,
  };
  position = await getPosULCPrice(network_data, position);
  return position;
}

// upper, lower and current price ULC
async function getPosULCPrice(
  network_data: NetworkData,
  position: PositionInfo,
): Promise<PositionInfo> {
  const token0 = getTokenByAddress(network_data, position.token0Address);
  const token1 = getTokenByAddress(network_data, position.token1Address);
  position.token0 = token0;
  position.token1 = token1;

  position.maxPrice = formatNumber(
    1 / getPriceFromTick(Number(position.tickLower)),
    2,
  );
  position.minPrice = formatNumber(
    1 / getPriceFromTick(Number(position.tickUpper)),
    2,
  );
  position.currentPrice =
    1 /
    (await getPrice({
      network_data: network_data,
      fromToken: token0,
      toToken: token1,
      fee: position.fee,
    }));
  position.currentPrice = Math.round(position.currentPrice);

  if (
    position.minPrice <= position.currentPrice &&
    position.currentPrice >= position.maxPrice
  ) {
    position.inRange = true;
  }

  if (position.tickLower == LIQUIDITY_PRICE_RANGE[position.fee].min_tick) {
    position.minPrice = 0;
  }

  if (position.tickUpper == LIQUIDITY_PRICE_RANGE[position.fee].max_tick) {
    position.maxPrice = INFINITY_TEXT;
  }

  return position;
}

export function getRoundedTickPrice(price: number, fee: FeeAmount): number {
  const uniswap_price_factor = 1.0001;
  const tick_spacing = TICK_SPACINGS[fee]; // assuming fee 1%, so tick space is 200 fixed by uniswap
  const tick = Math.log(10) / Math.log(uniswap_price_factor);
  // console.log('tick: ', tick);
  const multiplier_of_tick_space = Math.floor(tick / tick_spacing);
  // console.log('multiplier_of_tick_space: ', multiplier_of_tick_space);
  const rounded_next_tick = multiplier_of_tick_space * tick_spacing;
  // console.log('rounded_next_tick: ', rounded_next_tick);
  price = formatNumber(uniswap_price_factor ** rounded_next_tick, 7);
  console.log("final price input: ", price);
  return price;
}
