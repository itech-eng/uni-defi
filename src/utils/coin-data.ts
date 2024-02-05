import { Currency, NativeCurrencyName, NativeCurrency } from '@uniswap/sdk-core';
import { CoinBasic } from './types';

export declare abstract class NativeCoin extends NativeCurrency {}

export const EVM_NATIVE_DECIMAL = 18;

export enum COIN_SLUG {
  //native
  ETH = NativeCurrencyName.ETHER,
  MATIC = NativeCurrencyName.MATIC,
  BNB = NativeCurrencyName.BNB,

  //token
  WETH = 'WETH',
  WBTC = 'WBTC',
  UNI = 'UNI',
  DKFT20 = 'DKFT20',
  USDC = 'USDC',
  USDT = 'USDT',
}

export const COIN_DATA: {[slug: string]: CoinBasic } = {
  //native
  [COIN_SLUG.ETH]: { code: NativeCurrencyName.ETHER, name: 'Ether', icon: '/coins/eth.svg'},
  [COIN_SLUG.MATIC]: { code: NativeCurrencyName.MATIC, name: 'Matic', icon: '/coins/matic.png'},
  [COIN_SLUG.BNB]: { code: NativeCurrencyName.BNB, name: 'BNB Coin', icon: '/coins/bnb.png'},

  //token
  [COIN_SLUG.WETH]: { code: 'WETH', name: 'Wrapped Ether', icon: '/coins/weth.svg'},
  [COIN_SLUG.WBTC]: { code: 'WBTC', name: 'Wrapped BTC', icon: '/coins/btc.svg'},
  [COIN_SLUG.UNI]: { code: 'UNI', name: 'Uniswap Coin', icon: '/coins/eth.svg'},
  [COIN_SLUG.DKFT20]: { code: 'DKFT20', name: 'DK Free Token', icon: '/coins/dkft20.png'},
  [COIN_SLUG.USDC]: { code: 'USDC', name: 'USD//C', icon: '/coins/eth.svg'},
  [COIN_SLUG.USDT]: { code:'USDT', name: 'Tether USD', icon: '/coins/usdt.png'},
}