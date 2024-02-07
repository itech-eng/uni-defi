const { getUncollectedFees } = require("./uncollected_fees");
const { getTokenAmountsTheirs, getTokenAmountsOurs } = require("./liquidity_amount");

// liquidity token amount
const currentTick = -108166; // slot0 tick
const tickLower = -887200;
const tickUpper = 887200;
const liquidity = Number(1952931264130274449n);
const sqrtPriceX96 = Number(354994108308571189386340633n);

// getTokenAmountsOurs(liquidity, sqrtPriceX96, tickLower, tickUpper, 18, 18);
// console.log('=======');
// getTokenAmountsTheirs(liquidity, sqrtPriceX96, tickLower, tickUpper, 18, 18);




// uncollected fee
const { Token } = require('@uniswap/sdk-core');

const SupportedChainId = {
  GOERLI: 5,
  SEPOLIA: 11155111,
};

const POSITION_CONTRACT_ADDRESS = '0x1238536071E1c677A632429e3655c799b22cDA52';

const POOL_FACTORY_ADDRESS =
  // '0x1F98431c8aD98523631AE4a59f267346ea31F984'
  '0x0227628f3F023bb0B980b67D528571c95c6DaC1c' //sepolia

const WETH_CONTRACT_ADDRESS =
  // '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
  "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14"; //sepolia

const WETH_TOKEN = new Token(
  SupportedChainId.SEPOLIA,
  WETH_CONTRACT_ADDRESS,
  18,
  "WETH",
  "Wrapped Ether",
);

const DKFT20_TOKEN = new Token(
  // SupportedChainId.GOERLI,
  // '0x2b669B8dF849a250CB3D228C80CcF21D02F4C5dF',
  SupportedChainId.SEPOLIA,
  "0x0228A456B4719Dd584230202b9FF47c986Ad7893",
  18,
  "DKFT20",
  "DK Free Token",
);

const { FeeAmount } = require('@uniswap/v3-sdk');
const wallet_address = '0x9908CbCb070d1ed8d8f2c064b281D3029545b185';
const nft_token_id = 7879;
// const wallet_address = '0x31d4Ae75Cd68f3eaEfAa8b77fF1bc505FBC32184';
// const nft_token_id = 7884;

getUncollectedFees(DKFT20_TOKEN, WETH_TOKEN, FeeAmount.HIGH, 
  POOL_FACTORY_ADDRESS, POSITION_CONTRACT_ADDRESS,
  nft_token_id, wallet_address, wallet_address);