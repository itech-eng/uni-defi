//from token0 to token1
export function getTickFromPrice(
  price: number,
  floorOrCeil: "floor" | "ceil" = "floor",
): number {
  return Math[floorOrCeil](Math.log(price) / Math.log(1.0001));
}

//from token0 to token1
export function getPriceFromTick(tick: number): number {
  return 1.0001 ** tick;
}

//from token0 to token1
export function getPriceFromSqrtPx96(sqrtPx96: number): number {
  return (sqrtPx96 / 2 ** 96) ** 2;
}

//from token0 to token1
export function getSqrtPx96FromPrice(price: number): number {
  return Math.sqrt(price) * 2 ** 96;
}

export function getTickAtSqrtPrice(sqrtPx96: number) {
  let tick = Math.floor(
    Math.log(getPriceFromSqrtPx96(sqrtPx96)) / Math.log(1.0001),
  );
  return tick;
}
