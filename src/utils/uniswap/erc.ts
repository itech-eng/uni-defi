import { getTokenBalance } from "../token";
import { getAddress, getBalance, getProvider } from "../wallet";

export const getAllBalance = async (walletInfo) => {
  let balance = 0;
  const provider = getProvider();
  const wallet_address = await getAddress(provider);
  if (walletInfo) {
    if (walletInfo.is_native) {
      let local_balance = await getBalance(
        wallet_address,
        walletInfo.net_info.decimals,
      );

      balance = parseFloat(local_balance);
      console.log(balance, "sss");
      return balance;
    } else {
      balance = await getTokenBalance(
        wallet_address,
        walletInfo.net_info.address,
      );

      console.log(balance, "sss");
      return balance;
    }
  }
};
