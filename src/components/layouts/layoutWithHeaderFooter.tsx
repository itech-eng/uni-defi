"use client";
import React, { useEffect } from "react";
import Navbar from "../navbar";
import Footer from "../footer";
import { getAddress, getChainInfo, getProvider } from "@/src/utils/wallet";
import { IRootState } from "@/store";
import { setWallet, walletSliceType } from "@/store/slice/wallet.slice";
import { useDispatch, useSelector } from "react-redux";

const LayoutWithHeaderAndFooter = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { chain_id } = useSelector((state: IRootState) => state.wallet);

  const dispatch = useDispatch();

  useEffect(() => {
    const provider = getProvider();
    provider && provider.off("block");
    provider &&
      provider.on("block", async (blockNumber: number) => {
        // console.log(`New block mined: ${blockNumber}`);
        const address = await getAddress(provider);
        const chain_id = await getChainInfo(provider);
        dispatch(
          setWallet<walletSliceType>({
            wallet_address: address,
            chain_id,
            block_number: blockNumber,
          }),
        );
      });

    return () => {
      provider?.off("block");
    };
  }, [chain_id]);

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default LayoutWithHeaderAndFooter;
