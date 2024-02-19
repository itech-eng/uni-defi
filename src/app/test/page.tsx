"use client";
import { Button } from "@/src/components/ui/button";
import { convertCoinAmountToInt, noExponents } from "@/src/utils/corefunctions";
import {
  CHAIN_SLUG_MAPPING,
  NETWORK_DATA,
} from "@/src/utils/network/network-data";
import {
  getAddress,
  getProvider,
  sendTransactionViaExtension,
  watchTransaction,
} from "@/src/utils/wallet";
import { IRootState } from "@/store";
import { BigNumber, ethers, providers, utils } from "ethers";
import * as React from "react";
import { useSelector } from "react-redux";
import NonfungiblePositionManagerABI from "@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json";
import { COIN_SLUG } from "@/src/utils/network/coin-data";
import {
  getSqrtPx96FromPrice,
  getTickFromPrice,
} from "@/src/utils/uniswap/maths";
import { LIQUIDITY_PRICE_RANGE } from "@/src/utils/coreconstants";
import { FeeAmount } from "@uniswap/v3-sdk";
import { PoolInfo, getPoolInfo } from "@/src/utils/uniswap/pool";
import { getSqrtPx96 } from "@/src/utils/uniswap/helpers";
import { useSearchParams } from "next/navigation";
import { getPositions } from "@/src/utils/uniswap/liquidity";

export default async function Test() {
  // const qParams = useSearchParams();
  const qParams = { get: (key: string) => 0 };
  const qPoolFee = Number(qParams?.get("fee"));
  const qPrice = Number(qParams?.get("price"));

  // const { wallet_address, chain_id } = useSelector(
  //   (state: IRootState) => state.wallet,
  // )

  // console.log('redusx data: ', { wallet_address, chain_id });

  const provider = getProvider();
  const wallet_address = await getAddress(provider);

  const handleNewPositionMulticall = async () => {
    const network = CHAIN_SLUG_MAPPING[provider._network.chainId];
    const network_data = NETWORK_DATA[network];
    console.log("network_data: ", network_data);

    const dkft20 = network_data.coin_or_token[COIN_SLUG.DKFT20];
    const eth = network_data.coin_or_token[COIN_SLUG.ETH];

    const nftPositionManager = new ethers.Contract(
      network_data.contract.nonfungible_position_manager.address,
      NonfungiblePositionManagerABI.abi,
      provider,
    );
    // console.log('nftPositionManager: ', nftPositionManager.functions);
    const calls = [];

    const token0 =
      dkft20.net_info.address < eth.net_info.address
        ? dkft20.net_info.address
        : eth.net_info.address;
    const token1 =
      eth.net_info.address > dkft20.net_info.address
        ? eth.net_info.address
        : dkft20.net_info.address;

    const poolFee = qPoolFee || FeeAmount.MEDIUM;

    // let poolInfo: PoolInfo = null;
    // try {
    //   poolInfo = await getPoolInfo(
    //     network_data,
    //     dkft20.net_info,
    //     eth.net_info,
    //     poolFee,
    //   );
    // } catch (error) {
    //   // console.log(error);
    // }

    // if (!poolInfo) {
    //   alert("No pool available, will create a new pool also");

    const sqrtP = noExponents(
      getSqrtPx96({
        fromToken: eth.net_info,
        toToken: dkft20.net_info,
        price: qPrice || 25000,
      }),
    );
    const param = [token0, token1, poolFee, sqrtP];
    console.log("pool create param: ", param);

    const calldata = nftPositionManager.interface.encodeFunctionData(
      "createAndInitializePoolIfNecessary",
      param,
    );
    calls.push(calldata);
    // }

    const priceRange = LIQUIDITY_PRICE_RANGE[poolFee];

    // Prepare data for adding new position (example)
    const fee = poolFee;
    const tickLower = getTickFromPrice(priceRange.min_price);
    const tickUpper = getTickFromPrice(priceRange.max_price);
    const amount0Desired = convertCoinAmountToInt(
      100,
      dkft20.net_info.decimals,
    );
    const amount1Desired = convertCoinAmountToInt(0.004, eth.net_info.decimals); // Convert ETH to Wei
    const amount0Min = "0";
    const amount1Min = "0";
    const recipient = wallet_address;
    const deadline = Math.ceil((new Date().getTime() + 10 * 60 * 1000) / 1000);

    const mintParam = {
      token0,
      token1,
      tickLower,
      tickUpper,
      amount0Desired,
      amount1Desired,
      fee,
      amount0Min,
      amount1Min,
      recipient,
      deadline,
    };

    console.log("mintParam: ", mintParam);

    const mintCalldata = nftPositionManager.interface.encodeFunctionData(
      "mint",
      [mintParam],
    );
    calls.push(mintCalldata);
    // console.log('calls: ', calls);

    // Encode function calls and parameters
    const multicallData = nftPositionManager.interface.encodeFunctionData(
      "multicall",
      [calls],
    );
    // console.log('multicallData: ', multicallData);

    const tx: providers.TransactionRequest = {
      from: wallet_address,
      to: network_data.contract.nonfungible_position_manager.address,
      data: multicallData,
      value: Number(amount1Desired).toString(16), //hex format
    };

    const txHash = await sendTransactionViaExtension(tx);
    console.log("txHash: ", txHash);

    txHash &&
      watchTransaction(txHash, (tx) => {
        console.log("tx: ", tx);
      });
  };

  const handleSinglecall = async () => {
    const network = CHAIN_SLUG_MAPPING[provider._network.chainId];
    const network_data = NETWORK_DATA[network];
    console.log("network_data: ", network_data);

    const dkft20 = network_data.coin_or_token[COIN_SLUG.DKFT20];
    const eth = network_data.coin_or_token[COIN_SLUG.ETH];

    const nftPositionManager = new ethers.Contract(
      network_data.contract.nonfungible_position_manager.address,
      NonfungiblePositionManagerABI.abi,
      provider,
    );
    // console.log('nftPositionManager: ', nftPositionManager.functions);

    const poolFee = FeeAmount.LOW;
    const sqrtP = noExponents(
      getSqrtPx96({
        fromToken: eth.net_info,
        toToken: dkft20.net_info,
        price: 25000,
      }),
    );
    const param = [
      dkft20.net_info.address,
      eth.net_info.address,
      poolFee,
      sqrtP,
    ];

    console.log("pool create param: ", param);
    const transcation =
      await nftPositionManager.populateTransaction.createAndInitializePoolIfNecessary(
        ...param,
      );

    console.log("populated transcation: ", transcation);

    const tx: providers.TransactionRequest = {
      ...transcation,
      from: wallet_address,
    };

    const txHash = await sendTransactionViaExtension(tx);
    console.log("txHash: ", txHash);

    txHash &&
      watchTransaction(txHash, (tx) => {
        console.log("tx: ", tx);
      });
  };

  const handlePositionList = async () => {
    const positions = await getPositions(provider);
    console.log("positions: ", positions);
  };

  return (
    <div className="flex flex-col items-center p-5">
      <Button className="text-white m-2" onClick={handleNewPositionMulticall}>
        testNewPositionMulticall
      </Button>
      <Button className="text-white m-2" onClick={handleSinglecall}>
        testSingleCall
      </Button>
      <Button className="text-white m-2" onClick={handlePositionList}>
        getPositionsInConsole
      </Button>
    </div>
  );
}
