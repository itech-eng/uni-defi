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
  noExponents,
} from "../corefunctions";
import { CHAIN_SLUG_MAPPING, NETWORK_DATA } from "../network/network-data";
import { getTokenTransferApproval } from "../eth/erc20";
import SwapRouterABI from "@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json";
import { unwrapWETH, wrapETH } from "../eth/weth";

export async function getConvertedAmount(
  inCoin: CoinData,
  outCoin: CoinData,
  inAmount: number,
  network_data?: NetworkData,
  provider?: ethers.providers.Web3Provider,
): Promise<{
  converted_amount: number;
  raw_conv_amount: string;
  pool_fee: number;
}> {
  if (inCoin.basic.code == outCoin.basic.code) {
    throw new Error("Invalid same in and out coin");
  }

  provider = provider ?? getProvider();
  if (!provider) {
    throw new Error("Provider required to get pool state");
  }

  if (!network_data) {
    const network = CHAIN_SLUG_MAPPING[provider._network.chainId];
    network_data = NETWORK_DATA[network];
  }

  if (
    (inCoin.is_native || outCoin.is_native) &&
    (inCoin.is_native_wrap || outCoin.is_native_wrap)
  ) {
    return { converted_amount: inAmount, raw_conv_amount: "0", pool_fee: 0 };
  }

  const poolInfo = await getPoolInfo(
    network_data,
    inCoin.token_info,
    outCoin.token_info,
  );
  const pool = new Pool(
    inCoin.token_info,
    outCoin.token_info,
    poolInfo.fee,
    poolInfo.sqrtPriceX96.toString(),
    poolInfo.liquidity.toString(),
    poolInfo.tick,
  );

  const swapRoute = new Route([pool], inCoin.token_info, outCoin.token_info);

  const { calldata } = await SwapQuoter.quoteCallParameters(
    swapRoute,
    CurrencyAmount.fromRawAmount(
      inCoin.token_info,
      convertCoinAmountToInt(inAmount, inCoin.token_info.decimals).toString(),
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
  const raw_conv_amount = noExponents(Number(data));

  const outAmount = convertCoinAmountToDecimal(
    Number(data),
    outCoin.token_info.decimals,
    6,
  );
  return {
    converted_amount: Number(outAmount),
    raw_conv_amount,
    pool_fee: poolInfo.fee,
  };
}

export async function executeSwap(
  fromCoin: CoinData,
  toCoin: CoinData,
  poolFee: FeeAmount,
  fromAmount: number | string,
  network_data?: NetworkData,
  provider?: ethers.providers.Web3Provider,
): Promise<providers.TransactionReceipt> {
  if (fromCoin.basic.code == toCoin.basic.code) {
    throw new Error("Invalid same from and to coin");
  }

  provider = provider ?? getProvider();
  const walletAddress = await getAddress(provider);

  if (!walletAddress || !provider) {
    throw new Error("Cannot execute a swap without a connected wallet");
  }

  const signer = provider.getSigner();
  network_data = network_data ?? getNetworkData(provider);

  if (!fromCoin.is_native) {
    const tokenApproval = await getTokenTransferApproval(
      fromCoin.token_info,
      fromAmount,
      network_data,
      provider,
    );

    if (!tokenApproval) {
      throw new Error("Approval Process Failed");
    }
  }

  if (
    (fromCoin.is_native || toCoin.is_native) &&
    (fromCoin.is_native_wrap || toCoin.is_native_wrap)
  ) {
    if (fromCoin.is_native) {
      return await wrapETH(fromAmount, provider, network_data);
    } else if (toCoin.is_native) {
      return await unwrapWETH(fromAmount, null, provider, network_data);
    }
  }

  const swapRouter = new ethers.Contract(
    network_data.contract.swap_router.address,
    SwapRouterABI.abi,
    signer,
  );

  const amountIn = convertCoinAmountToInt(
    fromAmount,
    fromCoin.token_info.decimals,
  );

  // const slippagePercent = 10;
  // const toAmountDeductingSlippage = Number(toAmount) - (Number(toAmount) * slippagePercent / 100);
  // const amountOutMinimum = convertCoinAmountToInt(toAmountDeductingSlippage, toCoin.token_info.decimals);
  // const amountOutMinimum = convertCoinAmountToInt(toAmount, toCoin.token_info.decimals);
  // const amountOutMinimum = rawconvAmount;

  const calls = [];

  const swapParam = {
    tokenIn: fromCoin.token_info.address,
    tokenOut: toCoin.token_info.address,
    fee: poolFee,
    recipient: walletAddress,
    deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from the current Unix time
    amountIn: amountIn,
    amountOutMinimum: 0,
    sqrtPriceLimitX96: 0,
  };

  // let convertedAmount = await swapRouter.callStatic.exactInputSingle(swapParam);
  // convertedAmount = noExponents(Number(convertedAmount));
  // swapParam.amountOutMinimum = convertedAmount;

  console.log("swapParam: ", swapParam);

  const swapCalldata = swapRouter.interface.encodeFunctionData(
    "exactInputSingle",
    [swapParam],
  );
  calls.push(swapCalldata);

  // if (toCoin.is_native) {
  //   const unwrapCalldata = swapRouter.interface.encodeFunctionData('unwrapWETH9', [
  //     rawconvAmount, walletAddress
  //   ]);
  //   calls.push(unwrapCalldata);
  // }

  const tx: providers.TransactionResponse = await swapRouter.multicall(calls, {
    value: fromCoin.is_native
      ? ethers.utils.parseEther(String(fromAmount))
      : undefined,
  });

  const txReceipt = await tx.wait();

  if (toCoin.is_native) {
    const convertedAmount = txReceipt.logs[0].data;
    // console.log('convertedAmount: ', convertedAmount);
    await unwrapWETH(null, convertedAmount, provider, network_data);
  }
  return txReceipt;
}
