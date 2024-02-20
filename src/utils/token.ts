import { ERC20_ABI } from "./network/abi";
import { getProvider } from "./wallet";
import { ethers } from "ethers";
export const getTokenBalance = async (
  wallet_address: string,
  contract_address: string,
) => {
  const provider = getProvider();
  const tokenContract = new ethers.Contract(
    contract_address,
    ERC20_ABI,
    provider,
  );

  const balance = await tokenContract.balanceOf(wallet_address);
  console.log(balance, "balancesss");
  const decimals = await tokenContract.decimals();
  const token_balance = ethers.utils.formatUnits(balance, decimals);
  console.log(token_balance, "token_balance");
  return parseFloat(token_balance);
};
