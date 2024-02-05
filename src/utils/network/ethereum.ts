import { ChainId, Currency, Token } from "@uniswap/sdk-core";
import { COIN_SLUG, EVM_NATIVE_DECIMAL, COIN_DATA } from "../coin-data";
import { NetworkCoinData } from "../types";

export const eth_coin_data: NetworkCoinData = {
    [COIN_SLUG.ETH]: {
      basic: COIN_DATA[COIN_SLUG.ETH],
      net_info: new Token(
        ChainId.MAINNET, '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        EVM_NATIVE_DECIMAL, COIN_DATA[COIN_SLUG.ETH].code, 
        COIN_DATA[COIN_SLUG.ETH].name
      ),
    },
    [COIN_SLUG.WETH]: {
      basic: COIN_DATA[COIN_SLUG.WETH],
      net_info: new Token(
        ChainId.MAINNET, '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        EVM_NATIVE_DECIMAL, COIN_DATA[COIN_SLUG.WETH].code, 
        COIN_DATA[COIN_SLUG.WETH].name
      ),
    },
    [COIN_SLUG.USDC]: {
      basic: COIN_DATA[COIN_SLUG.USDC],
      net_info: new Token(
        ChainId.MAINNET, '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        6, COIN_DATA[COIN_SLUG.USDC].code, 
        COIN_DATA[COIN_SLUG.USDC].name
      ),
    },
}