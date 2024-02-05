import { ChainId, Currency, Token } from "@uniswap/sdk-core";
import { COIN_SLUG, EVM_NATIVE_DECIMAL, COIN_DATA } from "../coin-data";
import { NetworkCoinData } from "../types";

export const sepolia_eth_coin_data: NetworkCoinData = {
    [COIN_SLUG.ETH]: {
      basic: COIN_DATA[COIN_SLUG.ETH],
      net_info: new Token(
        ChainId.GOERLI, '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
        EVM_NATIVE_DECIMAL, COIN_DATA[COIN_SLUG.ETH].code, 
        COIN_DATA[COIN_SLUG.ETH].name
      ),
    },
    [COIN_SLUG.WETH]: {
      basic: COIN_DATA[COIN_SLUG.WETH],
      net_info: new Token(
        ChainId.GOERLI, '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
        EVM_NATIVE_DECIMAL, COIN_DATA[COIN_SLUG.WETH].code, 
        COIN_DATA[COIN_SLUG.WETH].name
      ),
    },
    [COIN_SLUG.DKFT20]: {
      basic: COIN_DATA[COIN_SLUG.DKFT20],
      net_info: new Token(
        ChainId.GOERLI, '0x0228A456B4719Dd584230202b9FF47c986Ad7893',
        6, COIN_DATA[COIN_SLUG.DKFT20].code, 
        COIN_DATA[COIN_SLUG.DKFT20].name
      ),
    },
}