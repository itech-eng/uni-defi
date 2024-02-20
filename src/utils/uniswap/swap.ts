import { CurrencyAmount, Percent, Token, TradeType } from "@uniswap/sdk-core";
import {
  FeeAmount,
  Pool,
  Route,
  SwapOptions,
  SwapQuoter,
} from "@uniswap/v3-sdk";
import { ethers, providers } from "ethers";
import { getPoolInfo } from "./pool";
import {
  getAddress,
  getProvider,
  sendTransactionViaExtension,
  watchTransaction,
} from "../wallet";
import { CoinData, NetworkData } from "../types";
import {
  convertCoinAmountToDecimal,
  convertCoinAmountToInt,
  getNetworkData,
} from "../corefunctions";
import { CHAIN_SLUG_MAPPING, NETWORK_DATA } from "../network/network-data";
import { getTokenTransferApproval } from "../eth/erc20";
import SwapRouterABI from "@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json";

export async function getConvertedAmount(
  inToken: Token,
  outToken: Token,
  inAmount: number,
  network_data?: NetworkData,
  provider?: ethers.providers.Web3Provider,
): Promise<{ converted_amount: number; pool_fee: number }> {
  provider = provider ?? getProvider();
  if (!provider) {
    throw new Error("Provider required to get pool state");
  }

  if (!network_data) {
    const network = CHAIN_SLUG_MAPPING[provider._network.chainId];
    network_data = NETWORK_DATA[network];
  }

  const poolInfo = await getPoolInfo(network_data, inToken, outToken);
  const pool = new Pool(
    inToken,
    outToken,
    poolInfo.fee,
    poolInfo.sqrtPriceX96.toString(),
    poolInfo.liquidity.toString(),
    poolInfo.tick,
  );

  const swapRoute = new Route([pool], inToken, outToken);

  const { calldata } = await SwapQuoter.quoteCallParameters(
    swapRoute,
    CurrencyAmount.fromRawAmount(
      inToken,
      convertCoinAmountToInt(inAmount, inToken.decimals).toString(),
    ),
    TradeType.EXACT_INPUT,
    {
      useQuoterV2: true,
    },
  );

  const quoteCallReturnData = await provider.call({
    to: network_data.contract.quoter_v2.address,
    data: calldata,
  });

  const data = ethers.utils.defaultAbiCoder.decode(
    ["uint256"],
    quoteCallReturnData,
  );
  const outAmount = convertCoinAmountToDecimal(
    Number(data),
    outToken.decimals,
    6,
  );
  return { converted_amount: Number(outAmount), pool_fee: poolInfo.fee };
}

export async function executeSwap(
  fromCoin: CoinData,
  toCoin: CoinData,
  poolFee: FeeAmount,
  fromAmount: number | string,
  callback: (tx: any) => void,
  network_data?: NetworkData,
  provider?: ethers.providers.Web3Provider,
): Promise<string> {
  provider = provider ?? getProvider();
  const walletAddress = await getAddress(provider);

  if (!walletAddress || !provider) {
    throw new Error("Cannot execute a swap without a connected wallet");
  }

  network_data = network_data ?? getNetworkData(provider);

  if (!fromCoin.is_native) {
    const tokenApproval = await getTokenTransferApproval(
      fromCoin.token_info,
      fromAmount,
      network_data,
    );

    if (!tokenApproval) {
      throw new Error("Approval Process Failed");
    }
  }

  const swapRouter = new ethers.Contract(
    network_data.contract.swap_router.address,
    SwapRouterABI.abi,
    provider,
  );

  const amountIn = convertCoinAmountToInt(
    fromAmount,
    fromCoin.token_info.decimals,
  );
  const transcation = await swapRouter.populateTransaction.exactInputSingle({
    tokenIn: fromCoin.token_info.address,
    tokenOut: toCoin.token_info.address,
    fee: poolFee,
    recipient: walletAddress,
    deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from the current Unix time
    amountIn: amountIn,
    amountOutMinimum: 0,
    sqrtPriceLimitX96: 0,
  });

  // console.log("populated transcation: ", transcation);

  const tx: providers.TransactionRequest = {
    ...transcation,
    value: fromCoin.is_native ? Number(amountIn).toString(16) : undefined,
    from: walletAddress,
  };

  const txHash = await sendTransactionViaExtension(tx);
  console.log("txHash: ", txHash);

  txHash &&
    watchTransaction(txHash, (tx) => {
      callback(tx);
    });

  return txHash;
}
