"use client";
import React, { useEffect } from "react";
import Navbar from "../navbar";
import { getProvider } from "@/src/utils/wallet";
import { IRootState } from "@/store";
import { setWallet, walletSliceType } from "@/store/slice/wallet.slice";
import { useDispatch, useSelector } from "react-redux";

const LayoutWithHeader = ({ children }: { children: React.ReactNode }) => {
  const { chain_id } = useSelector((state: IRootState) => state.wallet);

  const dispatch = useDispatch();

  useEffect(() => {
    const provider = getProvider();
    provider && provider.off("block");
    provider &&
      provider.on("block", async (blockNumber: number) => {
        console.log(`New block mined: ${blockNumber}`);
        dispatch(setWallet<walletSliceType>({ block_number: blockNumber }));
      });
  }, [chain_id]);

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default LayoutWithHeader;
