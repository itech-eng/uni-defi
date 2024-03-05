"use client";
import IncreaseLiquidity from "@/src/section/pool/increaseLiquidity.section";
import RemoveLiquidity from "@/src/section/pool/removeLiquidity.section";
import React from "react";

const page = () => {
  return (
    <div className="bg-slate-950 min-h-screen w-full pb-12 flex flex-col items-center justify-start">
      <RemoveLiquidity />
    </div>
  );
};

export default page;
