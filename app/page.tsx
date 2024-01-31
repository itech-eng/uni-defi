"use client";

import ImageComponent from "@/components/image/image-component";
import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-gray-900 h-screen">
      <div className="absolute inset-0 m-auto max-w-xs h-[357px] blur-[118px] sm:max-w-md md:max-w-lg glow-bg"></div>
      <section className="relative pt-14 md:pt-24">
        <div>
          <ImageComponent
            alt="landing banner"
            src="/landing-banner.png"
            placeholder="blur"
            height={300}
            width={500}
            className="mx-auto opacity-70"
          />
        </div>

        <div className="relative z-10 max-w-screen-xl mx-auto px-4  md:px-8">
          <div className="space-y-5 max-w-4xl mx-auto text-center">
            <h2 className="text-4xl text-white font-extrabold mx-auto md:text-5xl">
              Trade crypto and NFTs with confidence
            </h2>
            <p className="max-w-2xl mx-auto text-gray-400">
              Buy, sell, and explore tokens and NFTs
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
