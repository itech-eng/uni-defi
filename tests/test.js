const uni_core = require('@uniswap/sdk-core');
const { getTokenAmounts, getFees } = require('./functions');

// Assuming you have the necessary data
const currentTick = -108166; // slot0 tick
const tickLower = -887200;
const tickUpper = 887200;
const liquidity = Number(1952931264130274449n);
const sqrtPriceX96 = Number(354994108308571189386340633n);

const getPrice = () => {
  // price from token0 to token1; 1 token0 = price token1
  return (sqrtPriceX96 / (2**96)) ** 2;
  //or
  // return (1.0001 ** currentTick);
};

const price = getPrice();
const sqrtRatioL = Math.sqrt(1.0001 ** tickLower);
const sqrtRatioU = Math.sqrt(1.0001 ** tickUpper);
const sqrtP = Math.sqrt(price);

const Decimal0 = 18;
const Decimal1 = 18;

let amount_token0 = 0;
let amount_token1 = 0;

if(currentTick < tickLower){
  amount_token0 = Math.floor(liquidity*((sqrtRatioU-sqrtRatioL)/(sqrtRatioL*sqrtRatioU)));
} else if(currentTick >= tickUpper){
  amount_token1 = Math.floor(liquidity*(sqrtRatioU-sqrtRatioL));
} else if(currentTick >= tickLower && currentTick < tickUpper) {
  amount_token0 = liquidity * ((sqrtRatioU - sqrtP) / (sqrtRatioU * sqrtP));
  amount_token1 = liquidity * (sqrtP - sqrtRatioL)
}

amount_token0 = (amount_token0/(10**Decimal0)).toFixed(Decimal0);
amount_token1 = (amount_token1/(10**Decimal1)).toFixed(Decimal1);

console.log('price:', price);
// getTokenAmounts(liquidity, sqrtPriceX96, tickLower, tickUpper, 18, 18);
// console.log('Fee Earned Token0:', fees_earned_token0.toString());
// console.log('Fee Earned Token1:', fees_earned_token1.toString());
console.log('Amount of Token0:', amount_token0.toString());
console.log('Amount of Token1:', amount_token1.toString());

const feeGrowthGlobal0X128 = 308945033615290578619123104512101582427n;
const feeGrowthInside0LastX128 = 213086802882828011452425920098799198542n;
const feeGrowthOutside0X128Low = 0n;
const feeGrowthOutside0X128High = 0n;

const feeGrowthGlobal1X128 = 4261736057656560224786782344319423n;
const feeGrowthInside1LastX128 = 4261736057656560224786782344319423n;
const feeGrowthOutside1X128Low = 0n;
const feeGrowthOutside1X128High = 0n;

getFees(
  feeGrowthGlobal0X128,
  feeGrowthInside0LastX128,
  feeGrowthOutside0X128Low,
  feeGrowthOutside0X128High,
  feeGrowthGlobal1X128,
  feeGrowthInside1LastX128,
  feeGrowthOutside1X128Low,
  feeGrowthOutside1X128High,
  liquidity,
  Decimal0,
  Decimal1,
  tickLower,
  tickUpper,
  currentTick
);
