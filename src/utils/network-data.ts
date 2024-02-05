import { ChainId, Currency } from '@uniswap/sdk-core';
import { CoinBasic, NetworkCoinData, NetworkData } from './types';
import { COIN_SLUG } from './coin-data';
import { CommonContractData } from './contract-data';
import { loadContractObject } from './corefunctions';
import { eth_coin_data } from './network/ethereum';
import { goerli_eth_coin_data } from './network/goerli-eth';
import { sepolia_eth_coin_data } from './network/sepolia-eth';

export enum NETWORK_SLUG {
  ETHEREUM = 'ethereum',
  GOERLI_ETH = 'goerli-eth',
  SPOLIA_ETH = 'spolia-eth',
  POLYGON = 'polygon',
  MUMBAI_POLY_TEST = 'mumbai_polygon_testnet',
  BINANCE_SMART_CHAIN = 'binane-smart-chain',
  BINANCE_TESTNET = 'binance-testnet',
}

export enum OtherChainId {
  //
}

export const NETWORK_COIN_DATA: { [net_slug: string]: NetworkCoinData } = {
  [NETWORK_SLUG.ETHEREUM]: eth_coin_data,
  [NETWORK_SLUG.GOERLI_ETH]: goerli_eth_coin_data,
  [NETWORK_SLUG.SPOLIA_ETH]: sepolia_eth_coin_data,
}

export const NETWORK_DATA: { [slug: string]: NetworkData } = {
  [NETWORK_SLUG.ETHEREUM]: {
    value: NETWORK_SLUG.ETHEREUM,
    chain_id: ChainId.MAINNET,
    native_currency_code: COIN_SLUG.ETH,
    icon: '/networks/ethereum.png',
    label: 'Ethereum',
    contract: CommonContractData,
    coin_or_token: NETWORK_COIN_DATA[NETWORK_SLUG.ETHEREUM]
  },
  [NETWORK_SLUG.GOERLI_ETH]: {
    value: NETWORK_SLUG.GOERLI_ETH,
    chain_id: ChainId.GOERLI,
    native_currency_code: COIN_SLUG.ETH,
    icon: '/networks/ethereum.png',
    label: 'Goerli Ethereum',
    contract: CommonContractData,
    coin_or_token: NETWORK_COIN_DATA[NETWORK_SLUG.GOERLI_ETH]
  },
  [NETWORK_SLUG.SPOLIA_ETH]: {
    value: NETWORK_SLUG.SPOLIA_ETH,
    chain_id: ChainId.SEPOLIA,
    native_currency_code: COIN_SLUG.ETH,
    icon: '/networks/ethereum.png',
    label: 'Sepolia Ethereum',
    contract: loadContractObject(
      '0x0227628f3F023bb0B980b67D528571c95c6DaC1c','0x013C34d683BA9e5712118Ba290190d9ff508bAef',
      '0x5502365e486Ed7F5a62E80e8035aE1635dEd4Fa6','0x2b669B8dF849a250CB3D228C80CcF21D02F4C5dF',
      '0x1238536071E1c677A632429e3655c799b22cDA52'),
    coin_or_token: NETWORK_COIN_DATA[NETWORK_SLUG.SPOLIA_ETH]
  }
};


// export const Networks = [
//   {
//     value: "bsc",
//     label: "BSC",
//     icon: "/networks/bsc.png",
//   },
//   {
//     value: "solana",
//     label: "Solana",
//     icon: "/networks/solana.png",
//   },
//   {
//     value: "polygon",
//     label: "Polygon",
//     icon: "/networks/polygon.png",
//   },
//   {
//     value: "ethereum",
//     label: "Ethereum",
//     icon: "/networks/ethereum.png",
//   },
//   {
//     value: "arbitrum",
//     label: "Arbitrum",
//     icon: "/networks/arbitrum.png",
//   },
//   {
//     value: "fantom",
//     label: "Fantom",
//     icon: "/networks/fantom.png",
//   },
// ];


