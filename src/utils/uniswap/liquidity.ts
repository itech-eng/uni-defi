import { BigNumber, ethers } from "ethers";
import { getAddress, getProvider } from "../wallet";
import NonfungiblePositionManagerABI from "@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json";
import { NetworkData } from "../types";
import {
  beautifyNumber,
  calculatePercentRatio,
  convertCoinAmountToDecimal,
  formatNumber,
  getNetworkData,
  getTokenByAddress,
  sortObjectArray,
} from "../corefunctions";
import { FeeAmount, Pool, Position, TICK_SPACINGS } from "@uniswap/v3-sdk";
import { getPriceFromTick } from "./maths";
import { getPrice, parseTokenURItoJson } from "./helpers";
import { Token } from "@uniswap/sdk-core";
import {
  INFINITY_TEXT,
  LIQUIDITY_PRICE_RANGE,
  ORDER_DIRECTION,
} from "../coreconstants";
import { getPoolInfo } from "./pool";

export interface PositionInfo {
  tokenId: number | string;
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
  owner: string;
  other_details?: PositionOtherDetails;
}

export interface PositionOtherDetails {
  token0Amount: number;
  token1Amount: number;
  token0AmountPercent: number;
  token1AmountPercent: number;
  token0UnclaimedFee: number;
  token1UnclaimedFee: number;
  tokenURI: string;
  imgSrc: string;
}

export async function getPositions(
  provider?: ethers.providers.Web3Provider,
  network_data?: NetworkData,
): Promise<PositionInfo[]> {
  provider = provider ?? getProvider();
  const address = await getAddress(provider);

  if (!provider || !address) {
    throw new Error("No provider or address available");
  }

  // console.log('provider: ', provider._network.chainId);
  network_data = network_data ?? (await getNetworkData(provider));

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

  let positions: PositionInfo[] = [];
  for (let i = 0; i < tokenIds.length; i++) {
    try {
      const pos = await getPositionInfo(tokenIds[i], provider, network_data);
      positions.push(pos);
    } catch (e) {
      console.log(`tokenId (${tokenIds[i]}) Err: ${e.message}`);
    }
  }

  positions = sortObjectArray("closed", ORDER_DIRECTION.ASC, positions);

  return positions;
}

export async function getPositionInfo(
  token_id: number | string,
  provider?: ethers.providers.Web3Provider,
  network_data?: NetworkData,
  include_other_details = false,
): Promise<PositionInfo> {
  provider = provider ?? getProvider();

  if (!provider) {
    throw new Error("No provider available");
  }

  network_data = network_data ?? (await getNetworkData(provider));

  const positionContract = new ethers.Contract(
    network_data.contract.nonfungible_position_manager.address,
    NonfungiblePositionManagerABI.abi,
    provider,
  );

  const data = await positionContract.positions(token_id);

  // console.log('position 1: ', data);

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
    tokenId: token_id,
    owner: await positionContract.ownerOf(token_id),
    minPrice: "",
    maxPrice: "",
    currentPrice: 0,
    inRange: false,
    closed: data.liquidity == 0,
    token0: null,
    token1: null,
  };

  // console.log('position 2: ', position);

  position = await getPosULCPrice(network_data, position);

  if (include_other_details) {
    position = await getPositionAmounts(network_data, position);
    position.other_details.tokenURI = await positionContract.tokenURI(token_id);
    position.other_details.imgSrc = parseTokenURItoJson(
      position.other_details.tokenURI,
    ).image;
  }
  return position;
}

// upper, lower and current price ULC
async function getPosULCPrice(
  network_data: NetworkData,
  position: PositionInfo,
): Promise<PositionInfo> {
  const token0 = getTokenByAddress(network_data, position.token0Address);
  const token1 = getTokenByAddress(network_data, position.token1Address);
  if (!token0 || !token1) {
    throw new Error(
      "This Position's Tokens are not not available in our system",
    );
  }

  position.token0 = token0;
  position.token1 = token1;

  position.maxPrice = getPriceFromTick(Number(position.tickUpper));
  position.minPrice = getPriceFromTick(Number(position.tickLower));

  position.currentPrice = await getPrice({
    network_data: network_data,
    fromToken: token0,
    toToken: token1,
    fee: position.fee,
  });

  if (
    position.currentPrice >= Number(position.minPrice) &&
    position.currentPrice <= Number(position.maxPrice)
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

async function getPositionAmounts(
  network_data: NetworkData,
  position: PositionInfo,
  provider?: ethers.providers.Web3Provider,
): Promise<PositionInfo> {
  provider = provider ?? getProvider();
  const MAX_UINT128 = BigNumber.from(2).pow(128).sub(1);

  const positionContract = new ethers.Contract(
    network_data.contract.nonfungible_position_manager.address,
    NonfungiblePositionManagerABI.abi,
    provider,
  );
  // console.log('positionContract: ', positionContract.getFunction('collect'), '\n');

  const poolInfo = await getPoolInfo(
    network_data,
    position.token0,
    position.token1,
    position.fee,
  );
  // console.log('poolInfo: ', poolInfo, '\n');

  // construct pool instance
  const pool = new Pool(
    position.token0,
    position.token1,
    Number(poolInfo.fee),
    poolInfo.sqrtPriceX96.toString(),
    poolInfo.liquidity.toString(),
    Number(poolInfo.tick),
  );

  const positionInfo = await positionContract.positions(position.tokenId);
  // console.log('positionInfo: ', positionInfo, '\n');

  const pos_data = new Position({
    pool: pool,
    liquidity: positionInfo.liquidity.toString(),
    tickLower: Number(positionInfo.tickLower),
    tickUpper: Number(positionInfo.tickUpper),
  });

  // console.log("pos_data: ", pos_data);

  // liquidity token amount
  // console.log("amount0:", pos_data.amount0.toSignificant(6));
  // console.log("amount1:", pos_data.amount1.toSignificant(6));

  /* GET ACCRUED UNCLAIMDED FEES */
  // callStatic simulates a call without state changes
  const results = await positionContract.callStatic.collect(
    {
      tokenId: position.tokenId,
      recipient: position.owner,
      amount0Max: MAX_UINT128,
      amount1Max: MAX_UINT128,
    },
    { from: position.owner },
  );
  // console.log("Fee0: ", parseFloat(results.amount0) / 100);
  // console.log("Fee1: ", parseFloat(results.amount1) / 100);

  const fee_token0 = convertCoinAmountToDecimal(
    results.amount0,
    position.token0.decimals,
  );
  const fee_token1 = convertCoinAmountToDecimal(
    results.amount1,
    position.token1.decimals,
  );

  // console.log("fee_token0: ", fee_token0.toString());
  // console.log("fee_token1: ", fee_token1.toString());

  const token0Amount = Number(pos_data.amount0.toSignificant(6));
  const token1Amount = Number(pos_data.amount1.toSignificant(6));
  const percentRatio = calculatePercentRatio(
    token0Amount,
    (1 / position.currentPrice) * token1Amount,
  );
  position.other_details = <PositionOtherDetails>{
    token0Amount: token0Amount,
    token1Amount: token1Amount,
    token0AmountPercent: percentRatio.value1_percent,
    token1AmountPercent: percentRatio.value2_percent,
    token0UnclaimedFee: Number(fee_token0),
    token1UnclaimedFee: Number(fee_token1),
  };

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
