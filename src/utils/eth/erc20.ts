import { ethers } from "ethers";
import {
  getAddress,
  getProvider,
  sendTransactionViaExtension,
  watchTransaction,
} from "../wallet";
import { ERC20_ABI } from "../network/abi";
import { Token } from "@uniswap/sdk-core";
import {
  convertCoinAmountToDecimal,
  getNetworkData,
  sleep,
} from "../corefunctions";
import { NetworkData } from "../types";
import { MAX_APPROVE_AMOUNT_INT } from "../coreconstants";

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

export async function getTokenTransferApproval(
  token: Token,
  min_amount: number | string,
  network_data?: NetworkData,
  provider?: ethers.providers.Web3Provider,
): Promise<boolean> {
  provider = provider ?? getProvider();
  const address = await getAddress(provider);
  if (!provider || !address) {
    throw new Error("No provider or addess available");
  }

  network_data = network_data ?? getNetworkData(provider);

  try {
    const tokenContract = new ethers.Contract(
      token.address,
      ERC20_ABI,
      provider,
    );

    let approvedAmount = await tokenContract.allowance(
      address,
      network_data.contract.swap_router.address,
    );

    if (approvedAmount) {
      approvedAmount = convertCoinAmountToDecimal(
        approvedAmount,
        token.decimals,
      );

      if (Number(approvedAmount) >= Number(min_amount)) {
        console.log("min_amount: ", min_amount);
        return true;
      }
    }

    const transaction = await tokenContract.populateTransaction.approve(
      network_data.contract.swap_router.address,
      MAX_APPROVE_AMOUNT_INT,
    );

    const txHash = await sendTransactionViaExtension({
      ...transaction,
      from: address,
    });

    if (txHash) {
      watchTransaction(txHash, (tx: any) => {
        console.log("approval tx: ", tx);
      });
      await sleep(10000);
    }

    return txHash;
  } catch (e) {
    console.error(e);
    return false;
  }
}
