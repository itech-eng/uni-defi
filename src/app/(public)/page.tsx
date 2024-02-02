"use client";
import { DollarSign, Filter,    Moon, Zap } from "lucide-react";

import ImageComponent from "@/src/components/image/image-component";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-slate-950 py-9">
      <div className=" h-screen">
        <div className="absolute inset-0 m-auto max-w-xs h-[300px] blur-[118px] mt-0 sm:max-w-md md:max-w-lg glow-bg"></div>
        <section className="relative pt-14 md:pt-24">
          <div>
            <ImageComponent
              alt="landing banner"
              src="/landing-banner.png"
              placeholder="blur"
              height={300}
              width={500}
              className="mx-auto opacity-60  hover:mt"
            />
          </div>

          <div className="relative  mt-[-20px] max-w-screen-xl mx-auto px-4 flex flex-col items-center justify-center  md:px-8">
            <div className="space-y-5 max-w-4xl mx-auto text-center">
              <h2 className="text-5xl font-semibold mx-auto md:text-6xl gradient-text">
                Trade crypto and NFTs with confidence
              </h2>
              <p className="max-w-2xl mx-auto text-gray-400">
                Buy, sell, and explore tokens and NFTs
              </p>
            </div>
            <Link href="/swap">
              <button className="bg-gradient-to-r from-primary via-primary to-purple-400 px-24 py-5 text-white rounded-3xl mt-10">
                Get Started
              </button>
            </Link>
            <p className="mt-5 text-gray-400">Learn more</p>
          </div>
        </section>
      </div>
      <div className="mx-auto  rounded-3xl shadow-lg shadow-primary/75 my-6 bg-slate-950 border border-slate-900 py-32 max-w-7xl px-4 sm:px-6   lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto inline-flex rounded-full bg-primary px-4 py-1.5">
            <p className="text-xs font-semibold uppercase tracking-widest text-white">
              Features
            </p>
          </div>
          <h2 className="mt-6 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            Discover our Features
          </h2>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-y-8 text-center sm:grid-cols-2 sm:gap-12 lg:grid-cols-4">
          <div>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-primary via-primary to-purple-400">
              <DollarSign className="h-9 w-9 text-white" />
            </div>
            <h3 className="mt-8 text-lg font-semibold text-white">
              Automated Market Maker
            </h3>
          </div>
          <div>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-primary via-primary to-purple-400">
              <Zap className="h-9 w-9 text-white" />
            </div>
            <h3 className="mt-8 text-lg font-semibold text-white">
              Liquidity Pools
            </h3>
          </div>
          <div>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-primary via-primary to-purple-400">
              <Moon className="h-9 w-9 text-white" />
            </div>
            <h3 className="mt-8 text-lg font-semibold text-white">
              Token Swaps
            </h3>
          </div>
          <div>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-primary via-primary to-purple-400">
              <Filter className="h-9 w-9 text-white" />
            </div>
            <h3 className="mt-8 text-lg font-semibold text-white">
              Decentralization
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
