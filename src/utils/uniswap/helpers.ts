import { Token } from "@uniswap/sdk-core";
import { getPriceFromSqrtPx96, getSqrtPx96FromPrice } from "./maths";
import { empty, formatNumber } from "../corefunctions";
import { getPoolInfo } from "./pool";
import { NetworkData } from "../types";

export async function getPrice(params: {
  fromToken: Token;
  toToken: Token;
  fee?: number;
  network_data?: NetworkData;
  sqrtPx96?: number;
}): Promise<number> {
  if (empty(params.sqrtPx96) && empty(params.network_data)) {
    throw new Error("sqrtPx96 or network_data must required");
  }

  if (empty(params.sqrtPx96)) {
    const { sqrtPriceX96 } = await getPoolInfo(
      params.network_data,
      params.fromToken,
      params.toToken,
      params.fee,
    );
    params.sqrtPx96 = Number(sqrtPriceX96);
  }

  let price = getPriceFromSqrtPx96(params.sqrtPx96);
  if (params.fromToken.address > params.toToken.address) {
    price = 1 / price;
  }
  price = formatNumber(price, 5);
  return price;
}

export function getSqrtPx96(params: {
  fromToken: Token;
  toToken: Token;
  price: number;
}): number {
  if (params.fromToken.address > params.toToken.address) {
    params.price = 1 / params.price;
  }
  const sqrtPx96 = getSqrtPx96FromPrice(params.price);
  return sqrtPx96;
}
