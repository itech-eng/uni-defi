import { ethers } from "ethers";
import { getProvider } from "../wallet";
import { ERC20_ABI } from "../network/abi";
import { Token } from "@uniswap/sdk-core";
import { convertCoinAmountToDecimal } from "../corefunctions";

export const getERC20Balance = async (
  wallet_address: string,
  token?: Token,
  contract_address?: string,
): Promise<number> => {
  contract_address = contract_address ?? token.address;
  const provider = getProvider();
  const tokenContract = new ethers.Contract(
    contract_address,
    ERC20_ABI,
    provider,
  );

  const balance = await tokenContract.balanceOf(wallet_address);
  const decimals = token
    ? token.decimals
    : Number(await tokenContract.decimals());
  const token_balance = convertCoinAmountToDecimal(balance, decimals, 2);
  return Number(token_balance);
};
