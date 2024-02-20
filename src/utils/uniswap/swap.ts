import { CurrencyAmount, Token, TradeType } from "@uniswap/sdk-core";
import { FeeAmount, Pool, Route, SwapQuoter } from "@uniswap/v3-sdk";
import { ethers } from "ethers";
import { getPoolInfo } from "./pool";
import { getProvider } from "../wallet";
import { NetworkData } from "../types";
import {
  convertCoinAmountToDecimal,
  convertCoinAmountToInt,
} from "../corefunctions";
import { CHAIN_SLUG_MAPPING, NETWORK_DATA } from "../network/network-data";

export async function getConvertedAmount(
  inToken: Token,
  outToken: Token,
  inAmount: number,
  network_data?: NetworkData,
  provider?: ethers.providers.Web3Provider,
): Promise<number> {
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
  return Number(outAmount);
}

// export async function executeTrade(
//   trade: TokenTrade
// ): Promise<TransactionState> {
//   const walletAddress = getWalletAddress()
//   const provider = getProvider()

//   if (!walletAddress || !provider) {
//     throw new Error('Cannot execute a trade without a connected wallet')
//   }

//   // Give approval to the router to spend the token
//   const tokenApproval = await getTokenTransferApproval(CurrentConfig.tokens.in)

//   // Fail if transfer approvals do not go through
//   if (tokenApproval !== TransactionState.Sent && !tokenApproval) {
//     return TransactionState.Failed
//   }

//   const options: SwapOptions = {
//     // slippageTolerance: new Percent(50, 10_000), // 50 bips, or 0.50%
//     slippageTolerance: new Percent(100, 10_000), // 50 bips, or 0.50%
//     deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from the current Unix time
//     recipient: walletAddress,
//   }

//   const methodParameters = SwapRouter.swapCallParameters([trade], options)

//   console.log('methodParameters.calldata: ', methodParameters.calldata)

//   const tx = {
//     data: methodParameters.calldata,
//     to: SWAP_ROUTER_ADDRESS,
//     value: methodParameters.value,
//     from: walletAddress,
//     maxFeePerGas: MAX_FEE_PER_GAS.toString(),
//     maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS.toString(),
//   }

//   const res = await sendTransaction(tx)

//   return res
// }

// export async function getTokenTransferApproval(
//   token: Token
// ): Promise<TransactionState | boolean> {
//   const provider = getProvider()
//   const address = getWalletAddress()
//   if (!provider || !address) {
//     console.log('No Provider Found')
//     return TransactionState.Failed
//   }

//   try {
//     const tokenContract = new ethers.Contract(
//       token.address,
//       ERC20_ABI,
//       provider
//     )

//     let approvedAmount = await tokenContract.allowance(
//       address,
//       SWAP_ROUTER_ADDRESS
//     )
//     if (approvedAmount) {
//       approvedAmount = toReadableAmount(
//         approvedAmount,
//         CurrentConfig.tokens.in.decimals
//       )

//       if (approvedAmount >= TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER) {
//         return true
//       }
//     }

//     const transaction = await tokenContract.populateTransaction.approve(
//       SWAP_ROUTER_ADDRESS,
//       fromReadableAmount(
//         TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER,
//         token.decimals
//       ).toString()
//     )

//     return sendTransaction({
//       ...transaction,
//       from: address,
//     })
//   } catch (e) {
//     console.error(e)
//     return TransactionState.Failed
//   }
// }
