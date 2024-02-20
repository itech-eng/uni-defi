import { ChainId, Currency, Token } from "@uniswap/sdk-core";
import { COIN_SLUG, EVM_NATIVE_DECIMAL, COIN_BAISC_DATA } from "../coin-data";
import { NetworkCoinData } from "../../types";

export const goerli_eth_coin_data: NetworkCoinData = {
  [COIN_SLUG.ETH]: {
    is_native: true,
    basic: COIN_BAISC_DATA[COIN_SLUG.ETH],
    token_info: new Token(
      ChainId.GOERLI,
      "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
      EVM_NATIVE_DECIMAL,
      COIN_BAISC_DATA[COIN_SLUG.ETH].code,
      COIN_BAISC_DATA[COIN_SLUG.ETH].name,
    ),
  },
  [COIN_SLUG.WETH]: {
    is_native_wrap: true,
    basic: COIN_BAISC_DATA[COIN_SLUG.WETH],
    token_info: new Token(
      ChainId.GOERLI,
      "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
      EVM_NATIVE_DECIMAL,
      COIN_BAISC_DATA[COIN_SLUG.WETH].code,
      COIN_BAISC_DATA[COIN_SLUG.WETH].name,
    ),
  },
  [COIN_SLUG.DKFT20]: {
    basic: COIN_BAISC_DATA[COIN_SLUG.DKFT20],
    token_info: new Token(
      ChainId.GOERLI,
      "0x2b669B8dF849a250CB3D228C80CcF21D02F4C5dF",
      EVM_NATIVE_DECIMAL,
      COIN_BAISC_DATA[COIN_SLUG.DKFT20].code,
      COIN_BAISC_DATA[COIN_SLUG.DKFT20].name,
    ),
  },
};
