import { Search } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <nav className="bg-transparent text-white fixed top-0 w-full z-10 mx-auto">
      <div className="px-4 py-6 grid grid-cols-3 items-center justify-center">
        <div className="flex items-center">
          <a className="text-3xl font-bold font-heading" href="#">
            <img className="h-9" src="logo.webp" alt="logo" />
          </a>
          <ul className="hidden lg:flex gap-4 ml-10">
            <li>
              <a className="hover:text-gray-200" href="#">
                Swap
              </a>
            </li>
            <li>
              <a className="hover:text-gray-200" href="#">
                Pool
              </a>
            </li>
            <li>
              <a className="hover:text-gray-200" href="#">
                Liquidity
              </a>
            </li>
            <li>
              <a className="hover:text-gray-200" href="#">
                Governance
              </a>
            </li>
          </ul>
        </div>
        <div className="flex items-center justify-center">
          <div className="relative w-full flex items-center">
            <Search className="text-white absolute left-3" size={20} />
            <input
              type="text"
              placeholder="Search Tokens and NFT collections"
              className="bg-slate-950 border border-gray-800 w-full h-10 text-white pl-10 pr-4 rounded-md focus:outline-none focus:ring focus:border-primary"
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-4">
          <div className="t bg-[#7e22ce4a] rounded-2xl px-6 text-purple-300 text-sm py-2 hover:text-gray-200">
            Connect
          </div>
        </div>
      </div>
    </nav>
  );
}
