import { formatNumber } from "../corefunctions";
import { CoinData } from "../types";
import { getProvider, getAddress, getBalance } from "../wallet";
import { getERC20Balance } from "./erc20";

export const getCoinBalance = async (coin: CoinData): Promise<number> => {
  let balance = 0;
  const provider = getProvider();
  const wallet_address = await getAddress(provider);
  if (coin) {
    if (coin.is_native) {
      const local_balance = await getBalance(
        wallet_address,
        coin.net_info.decimals,
      );

      balance = formatNumber(local_balance, 2);
    } else {
      balance = await getERC20Balance(wallet_address, coin.net_info);
    }
    return balance;
  }
};
