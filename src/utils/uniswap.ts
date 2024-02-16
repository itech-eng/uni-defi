export function getTickFromPrice(
  price: number,
  floorOrCeil: "floor" | "ceil" = "floor",
): number {
  return Math[floorOrCeil](Math.log(price) / Math.log(1.0001));
}

export function getPriceFromTick(tick: number): number {
  return 1.0001 ** tick;
}

export function getPriceFromSqrtPx96(sqrtPx96: number): number {
  return (sqrtPx96 / 2 ** 96) ** 2;
}

export function getTickAtSqrtPrice(sqrtPx96: number) {
  let tick = Math.floor(
    Math.log(getPriceFromSqrtPx96(sqrtPx96)) / Math.log(1.0001),
  );
  return tick;
}
