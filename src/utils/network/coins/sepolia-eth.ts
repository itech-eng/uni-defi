import { ChainId, Currency, Token } from "@uniswap/sdk-core";
import { COIN_SLUG, EVM_NATIVE_DECIMAL, COIN_BAISC_DATA } from "../coin-data";
import { NetworkCoinData } from "../../types";

export const sepolia_eth_coin_data: NetworkCoinData = {
  [COIN_SLUG.ETH]: {
    is_native: true,
    basic: COIN_BAISC_DATA[COIN_SLUG.ETH],
    token_info: new Token(
      ChainId.SEPOLIA,
      "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
      EVM_NATIVE_DECIMAL,
      COIN_BAISC_DATA[COIN_SLUG.ETH].code,
      COIN_BAISC_DATA[COIN_SLUG.ETH].name,
    ),
  },
  [COIN_SLUG.WETH]: {
    is_native_wrap: true,
    basic: COIN_BAISC_DATA[COIN_SLUG.WETH],
    token_info: new Token(
      ChainId.SEPOLIA,
      "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
      EVM_NATIVE_DECIMAL,
      COIN_BAISC_DATA[COIN_SLUG.WETH].code,
      COIN_BAISC_DATA[COIN_SLUG.WETH].name,
    ),
  },
  [COIN_SLUG.DKFT20]: {
    basic: COIN_BAISC_DATA[COIN_SLUG.DKFT20],
    token_info: new Token(
      ChainId.SEPOLIA,
      "0x0228A456B4719Dd584230202b9FF47c986Ad7893",
      EVM_NATIVE_DECIMAL,
      COIN_BAISC_DATA[COIN_SLUG.DKFT20].code,
      COIN_BAISC_DATA[COIN_SLUG.DKFT20].name,
    ),
  },
  [COIN_SLUG.BTC]: {
    basic: COIN_BAISC_DATA[COIN_SLUG.BTC],
    token_info: new Token(
      ChainId.SEPOLIA,
      "0x4B27946689E70b2d4024FCA65D79BF31447e94C8",
      EVM_NATIVE_DECIMAL,
      COIN_BAISC_DATA[COIN_SLUG.BTC].code,
      COIN_BAISC_DATA[COIN_SLUG.BTC].name,
    ),
  },
  [COIN_SLUG.USDT]: {
    basic: COIN_BAISC_DATA[COIN_SLUG.USDT],
    token_info: new Token(
      ChainId.SEPOLIA,
      "0x2a3fDe07C546fE91341Eaeb9C10490469052FAb8",
      EVM_NATIVE_DECIMAL,
      COIN_BAISC_DATA[COIN_SLUG.USDT].code,
      COIN_BAISC_DATA[COIN_SLUG.USDT].name,
    ),
  },
};
