import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  CHAIN_SLUG_MAPPING,
  NETWORK_COIN_DATA,
  NETWORK_DATA,
} from "./network/network-data";
import { CoinData, Contract, NetworkData, NetworkExplorer } from "./types";
import { BigNumber, ethers } from "ethers";
import { Token } from "@uniswap/sdk-core";
import { ORDER_DIRECTION } from "./coreconstants";
import { getProvider } from "./wallet";

Number.prototype["noExponents"] = function () {
  const data = String(this).split(/[eE]/);
  if (data.length == 1) return data[0];

  let z = "";
  const sign = this < 0 ? "-" : "";
  const str = data[0].replace(".", "");
  let mag = Number(data[1]) + 1;

  if (mag < 0) {
    z = sign + "0.";
    while (mag++) z += "0";
    return z + str.replace(/^\-/, "");
  }
  mag -= str.length;
  while (mag--) z += "0";
  return str + z;
};

BigInt.prototype["noExponents"] = function () {
  const data = String(this).split(/[eE]/);
  if (data.length == 1) return data[0];

  let z = "";
  const sign = this < 0 ? "-" : "";
  const str = data[0].replace(".", "");
  let mag = Number(data[1]) + 1;

  if (mag < 0) {
    z = sign + "0.";
    while (mag++) z += "0";
    return z + str.replace(/^\-/, "");
  }
  mag -= str.length;
  while (mag--) z += "0";
  return str + z;
};

BigInt.prototype["toJSON"] = function () {
  return this.toString();
};

export function noExponents(value: any): string {
  return Number(value)["noExponents"]();
}

export function hex_to_ascii(str1) {
  const hex = str1.toString();
  let str = "";
  for (let n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  return str;
}

export function ascii_to_hex(str) {
  const arr1 = [];
  for (let n = 0, l = str.length; n < l; n++) {
    const hex = Number(str.charCodeAt(n)).toString(16);
    arr1.push(hex);
  }
  return arr1.join("");
}

export function getRandomInt(length: number, skip_int?: number) {
  let result = "";
  let characters = "0123456789";
  if (skip_int >= 0) {
    characters = characters.replace(skip_int.toString(), "");
  }
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;

  /* let init_number = 1;
  let multiply_number = 9;
  for (let i = 1; i < digit; i++) {
    init_number *= 10;
    multiply_number *= 10;
  }
  return Math.floor(
    Math.random() * init_number + Math.random() * multiply_number,
  ); */
}

export function getRandomDecimalNumber(intLength?: number, decimal = 8) {
  if (empty(intLength)) intLength = Number(getRandomInt(1, 0));
  let result = getRandomInt(intLength);
  if (Number(result) == 0) {
    result = Math.random().toFixed(decimal);
  } else {
    const decimalNum = Number(result) + Math.random();
    result = decimalNum.toFixed(decimal);
  }
  return result;
}

export function empty(value: any): boolean {
  if (value == null || value == undefined) return true;
  return false;
}

export function fakeTrans(key: string) {
  return key;
}

export function lcfirst(str: string): string {
  str += "";
  const f = str.charAt(0).toLowerCase();
  return f + str.substring(1);
}

export function ucfirst(str: string): string {
  str += "";
  const f = str.charAt(0).toUpperCase();
  return f + str.substring(1);
}

export function cleanMultiSlash(endpoint, replaceWith = "/") {
  endpoint = endpoint.replace(/\/{2,}/g, replaceWith);
  return endpoint;
}

export function clearTrailingSlash(str: string) {
  return str.replace(/\/$/, "");
}

export function clearBeginingSlash(str: string) {
  return str.replace(/^\//, "");
}

export function clearBothEndSlash(str: string) {
  return str.replace(/\/$/, "").replace(/^\//, "");
}

export async function callFetcher(
  base_url: string,
  endpoint: string,
  method: string,
  data?: any,
  headers?: any,
): Promise<any> {
  endpoint = cleanMultiSlash(endpoint);
  endpoint = clearBeginingSlash(endpoint);

  const response = await fetch(`${base_url}/${endpoint}`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}

export function appName(): string {
  return process.env.NEXT_PUBLIC_APP_NAME || "";
}

export function base_url() {
  return clearTrailingSlash(process.env.APP_URL ?? "");
}

export function data_storage_url() {
  return clearTrailingSlash(process.env.DATA_STORAGE_BASE_URL ?? "");
}

export async function sleep(delay_in_milisec: number) {
  await new Promise((resolve) => setTimeout(resolve, delay_in_milisec));
  return;
}

export function loadContractObject(
  v3_factory: string,
  quoter: string,
  quoter_v2: string,
  swap_router: string,
  nonfungible_position_manager: string,
): Contract {
  return {
    quoter: {
      address: quoter,
    },
    quoter_v2: {
      address: quoter_v2,
    },
    swap_router: {
      address: swap_router,
    },
    v3_factory: {
      address: v3_factory,
    },
    nonfungible_position_manager: {
      address: nonfungible_position_manager,
    },
  };
}

export function getNetworks(): NetworkData[] {
  return Object.values(NETWORK_DATA);
}

export function getNetworkCoins(network_slug: string): CoinData[] {
  return Object.values(NETWORK_COIN_DATA[network_slug]);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFromLocalStorage(key: string): string | null {
  if (typeof window !== "undefined") {
    return window.localStorage.getItem(key);
  }
  return null;
}

export function setToLocalStorage(key: string, value: string): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(key, value);
  }
}

export function convertCoinAmountToInt(
  amount: number | string,
  decimals: number,
): BigNumber | string {
  // return ethers.utils.parseUnits(amount.toString(), decimals);
  return noExponents(Number(amount) * 10 ** decimals).split(".")[0];
}

export function convertCoinAmountToDecimal(
  rawAmount: number,
  decimals: number,
  toFixed = 5,
  abs = true,
): BigNumber | string {
  // return ethers.utils.formatUnits(rawAmount, decimals).slice(0, toFixed);
  let out = formatNumber(Number(rawAmount / 10 ** decimals), toFixed);
  if (abs) {
    out = Math.abs(Number(out));
  }
  return noExponents(out);
}

export function formatNumber(
  value: number | string,
  decimal: number,
  abs = true,
): number {
  value = Number(value);
  // const result = Number(value.toFixed(decimal));
  const numOfZeros = 10 ** decimal;
  const result = Math.floor(value * numOfZeros) / numOfZeros;
  if (!abs) return result;
  else return Math.abs(result);
}

export function beautifyNumber(value: number): number {
  if (value >= 100) {
    value = Math.ceil(value);
  } else if (value >= 0.01 && value <= 99) {
    value = formatNumber(value, 4);
  } else if (value >= 0.0001 && value < 0.009) {
    value = formatNumber(value, 6);
  } else if (value >= 0.000001 && value < 0.00009) {
    value = formatNumber(value, 8);
  } else if (value >= 0.00000001 && value < 0.0000009) {
    value = formatNumber(value, 10);
  } else if (value >= 0.0000000001 && value < 0.000000009) {
    value = formatNumber(value, 12);
  } else if (value >= 0.000000000001 && value < 0.00000000009) {
    value = formatNumber(value, 14);
  }
  return value;
}

export function decodeMulticall(abi: ReadonlyArray<any>, calls: string[]) {
  const abiInterface = new ethers.utils.Interface(abi);
  return calls.map((call) => {
    try {
      const func = call.slice(0, 10);
      const decodedArgs = abiInterface.decodeFunctionData(func, call);
      const functionName = abiInterface.getFunction(func).name;
      return { name: functionName, args: decodedArgs };
    } catch (ex) {
      return; // you could return a type here to indicate it was not parsed
    }
  });
}

export function getTokenByAddress(
  network_data: NetworkData,
  address: string,
): Token {
  const coins = network_data.coin_or_token;
  for (const slug in coins) {
    if (coins[slug].token_info.address == address)
      return coins[slug].token_info;
  }
}

export function sortObjectArray(
  field: string,
  direction: string,
  array: object[],
): any[] {
  if (direction == ORDER_DIRECTION.DESC) {
    array.sort((a1, a2) =>
      a1[field] < a2[field] ? 1 : a1[field] > a2[field] ? -1 : 0,
    ); // sorting desc
  } else {
    array.sort((a1, a2) =>
      a1[field] < a2[field] ? -1 : a1[field] > a2[field] ? 1 : 0,
    ); // sorting asc
  }
  return array;
}

export function sortObjectArrayForDecimal(
  field: string,
  direction: string,
  array: object[],
): any[] {
  if (direction == ORDER_DIRECTION.DESC) {
    array.sort((a1, a2) =>
      Number(a1[field]) < Number(a2[field])
        ? 1
        : Number(a1[field]) > Number(a2[field])
          ? -1
          : 0,
    ); // sorting desc
  } else {
    array.sort((a1, a2) =>
      Number(a1[field]) < Number(a2[field])
        ? -1
        : Number(a1[field]) > Number(a2[field])
          ? 1
          : 0,
    ); // sorting asc
  }
  return array;
}

export function calculatePercentRatio(
  value1: number,
  value2: number,
): { value1_percent: number; value2_percent: number } {
  const result = {
    value1_percent: 0,
    value2_percent: 0,
  };
  const formula_constant = 100 / (value1 + value2);
  result.value1_percent = value1 * formula_constant;
  result.value2_percent = value2 * formula_constant;
  return result;
}

export async function getNetworkData(
  provider?: ethers.providers.Web3Provider,
): Promise<NetworkData> {
  provider = provider ?? getProvider();
  await sleep(200);
  const network = CHAIN_SLUG_MAPPING[provider._network.chainId];
  const network_data = NETWORK_DATA[network];
  return network_data;
}
