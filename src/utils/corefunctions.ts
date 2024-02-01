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
