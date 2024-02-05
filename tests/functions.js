const JSBI = require('jsbi');
const Q96 = JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(96));

const ZERO = JSBI.BigInt(0);
const Q128 = JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(128));
const Q256 = JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(256));

function getTickAtSqrtPrice(sqrtPriceX96){
	let tick = Math.floor(Math.log((sqrtPriceX96/Q96)**2)/Math.log(1.0001));
	return tick;
}

async function getTokenAmounts(liquidity,sqrtPriceX96,tickLow,tickHigh,Decimal0,Decimal1){
	let sqrtRatioL = Math.sqrt(1.0001**tickLow);
	let sqrtRatioU = Math.sqrt(1.0001**tickHigh);
	let currentTick = getTickAtSqrtPrice(sqrtPriceX96);
  let sqrtPrice = sqrtPriceX96 / Q96;
	let amount0 = 0;
	let amount1 = 0;
	if(currentTick < tickLow){
		amount0 = Math.floor(liquidity*((sqrtRatioU-sqrtRatioL)/(sqrtRatioL*sqrtRatioU)));
	}
	else if(currentTick >= tickHigh){
		amount1 = Math.floor(liquidity*(sqrtRatioU-sqrtRatioL));
	}
	else if(currentTick >= tickLow && currentTick < tickHigh){ 
		amount0 = Math.floor(liquidity*((sqrtRatioU-sqrtPrice)/(sqrtPrice*sqrtRatioU)));
		amount1 = Math.floor(liquidity*(sqrtPrice-sqrtRatioL));
	}

	let amount0Human = (amount0/(10**Decimal0)).toFixed(Decimal0);
	let amount1Human = (amount1/(10**Decimal1)).toFixed(Decimal1);

	// console.log("Amount Token0 in lowest decimal: "+amount0);
	// console.log("Amount Token1 in lowest decimal: "+amount1);
	console.log("Amount Token0 : "+amount0Human);
	console.log("Amount Token1 : "+amount1Human);
	return [amount0, amount1]
}

// this handles the over and underflows which is needed for all subtraction in the fees math
function subIn256(x, y) {
  const difference = JSBI.subtract(x, y)
  if (JSBI.lessThan(difference, ZERO)) {
    return JSBI.add(Q256, difference)
  } else {
    return difference}
}

function toBigNumber(value) {
  return value;
}

async function getFees(feeGrowthGlobal0, feeGrowthInside0, feeGrowth0Low, feeGrowth0Hi,
  feeGrowthGlobal1, feeGrowthInside1, feeGrowth1Low, feeGrowth1Hi, 
  liquidity, decimals0, decimals1, tickLower, tickUpper, tickCurrent){
                                // all needs to be bigNumber
	let feeGrowthGlobal_0 = toBigNumber(feeGrowthGlobal0);
	let feeGrowthGlobal_1 = toBigNumber(feeGrowthGlobal1);
	let tickLowerFeeGrowthOutside_0 = toBigNumber(feeGrowth0Low);
	let tickLowerFeeGrowthOutside_1 = toBigNumber(feeGrowth1Low);
	let tickUpperFeeGrowthOutside_0 = toBigNumber(feeGrowth0Hi);
	let tickUpperFeeGrowthOutside_1 = toBigNumber(feeGrowth1Hi);
                               // preset variables to 0 BigNumber
	let tickLowerFeeGrowthBelow_0 = ZERO;
	let tickLowerFeeGrowthBelow_1 = ZERO;
	let tickUpperFeeGrowthAbove_0 = ZERO;
	let tickUpperFeeGrowthAbove_1 = ZERO;

              // As stated above there is different math needed if the position is in or out of range
                              // If current tick is above the range fg- fo,iu Growth Above range

	if (tickCurrent >= tickUpper){
		tickUpperFeeGrowthAbove_0 = subIn256(feeGrowthGlobal_0, tickUpperFeeGrowthOutside_0);
		tickUpperFeeGrowthAbove_1 = subIn256(feeGrowthGlobal_1, tickUpperFeeGrowthOutside_1);
	} else{                // Else if current tick is in range only need fg for upper growth
		tickUpperFeeGrowthAbove_0 = tickUpperFeeGrowthOutside_0
		tickUpperFeeGrowthAbove_1 = tickUpperFeeGrowthOutside_1
	}
                              // If current tick is in range  only need fg for lower growth
	if (tickCurrent >= tickLower){
		tickLowerFeeGrowthBelow_0 = tickLowerFeeGrowthOutside_0
		tickLowerFeeGrowthBelow_1 = tickLowerFeeGrowthOutside_1
	} else{                // If current tick is above the range fg- fo,il Growth below range
		tickLowerFeeGrowthBelow_0 = subIn256(feeGrowthGlobal_0, tickLowerFeeGrowthOutside_0);
		tickLowerFeeGrowthBelow_1 = subIn256(feeGrowthGlobal_1, tickLowerFeeGrowthOutside_1);
	}

                             //   fr(t1) For both token0 and token1
	let fr_t1_0 = subIn256(subIn256(feeGrowthGlobal_0, tickLowerFeeGrowthBelow_0), tickUpperFeeGrowthAbove_0);
	let fr_t1_1 = subIn256(subIn256(feeGrowthGlobal_1, tickLowerFeeGrowthBelow_1), tickUpperFeeGrowthAbove_1);
                                // feeGrowthInside to BigNumber
	let feeGrowthInsideLast_0 = toBigNumber(feeGrowthInside0);
	let feeGrowthInsideLast_1 = toBigNumber(feeGrowthInside1);

	// The final calculations uncollected fees formula
	// for both token 0 and token 1 since we now know everything that is needed to compute it
       // subtracting the two values and then multiplying with liquidity l *(fr(t1) - fr(t0)) 
	let uncollectedFees_0 = (liquidity * subIn256(fr_t1_0, feeGrowthInsideLast_0)) / Q128;
	let uncollectedFees_1 = (liquidity * subIn256(fr_t1_1, feeGrowthInsideLast_1)) / Q128;

	// console.log("Amount fees token 0 in lowest decimal: "+Math.floor(uncollectedFees_0));
	// console.log("Amount fees token 1 in lowest decimal: "+Math.floor(uncollectedFees_1));

	// Decimal adjustment to get final results
	let uncollectedFeesAdjusted_0 = (uncollectedFees_0 / toBigNumber(10**decimals0)).toFixed(decimals0);
	let uncollectedFeesAdjusted_1 = (uncollectedFees_1 / toBigNumber(10**decimals1)).toFixed(decimals1);
	console.log("Amount fees token 0: "+uncollectedFeesAdjusted_0);
	console.log("Amount fees token 1: "+uncollectedFeesAdjusted_1);
}

module.exports = { getTokenAmounts, getFees };