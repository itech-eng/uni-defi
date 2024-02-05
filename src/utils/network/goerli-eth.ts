import { ChainId, Currency, Token } from "@uniswap/sdk-core";
import { COIN_SLUG, EVM_NATIVE_DECIMAL, COIN_DATA } from "../coin-data";
import { NetworkCoinData } from "../types";

export const goerli_eth_coin_data: NetworkCoinData = {
    [COIN_SLUG.ETH]: {
      basic: COIN_DATA[COIN_SLUG.ETH],
      net_info: new Token(
        ChainId.GOERLI, '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
        EVM_NATIVE_DECIMAL, COIN_DATA[COIN_SLUG.ETH].code, 
        COIN_DATA[COIN_SLUG.ETH].name
      ),
    },
    [COIN_SLUG.WETH]: {
      basic: COIN_DATA[COIN_SLUG.WETH],
      net_info: new Token(
        ChainId.GOERLI, '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
        EVM_NATIVE_DECIMAL, COIN_DATA[COIN_SLUG.WETH].code, 
        COIN_DATA[COIN_SLUG.WETH].name
      ),
    },
    [COIN_SLUG.DKFT20]: {
      basic: COIN_DATA[COIN_SLUG.DKFT20],
      net_info: new Token(
        ChainId.GOERLI, '0x2b669B8dF849a250CB3D228C80CcF21D02F4C5dF',
        6, COIN_DATA[COIN_SLUG.DKFT20].code, 
        COIN_DATA[COIN_SLUG.DKFT20].name
      ),
    },
}