import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { ChevronDown, Copy, Search } from "lucide-react";
import { getNetworkCoins } from "@/src/utils/corefunctions";
import { NETWORK_SLUG } from "@/src/utils/network-data";
const SelectTokenSection = () => {

  // TODO: selected network will be fetched from redux
  const network = NETWORK_SLUG.GOERLI_ETH;

  const Coins = getNetworkCoins(network);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="text-md cursor-pointer font-semibold text-white bg-primary w-72 h-10 flex items-center justify-center px-1 py-1 rounded-3xl">
          Select Token
          <ChevronDown className="ml-2" size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md border border-slate-900 bg-slate-950 h-[600px] flex flex-col justify-start">
        <DialogHeader>
          <DialogTitle className="text-white">Selece Token</DialogTitle>
        </DialogHeader>
        <div className="">
          <div className="relative w-full flex items-center">
            <Search className="text-white absolute left-3" size={20} />
            <input
              type="text"
              placeholder="Search names or paste address"
              className="bg-slate-950 border border-gray-800 w-full h-10 text-white pl-10 pr-4 rounded-2xl focus:outline-none focus:ring focus:border-primary"
            />
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4 border-b border-gray-800 pb-10">
            {Coins.map((coin) => (
              <div className="px-2 text-white text-sm py-1 border border-gray-800 flex items-center justify-start rounded-2xl">
                <img
                  src={coin.basic.icon}
                  className="h-6 w-6 rounded-full mr-2"
                  alt=""
                />

                {coin.basic.name}
              </div>
            ))}
          </div>
        </div>
        <div className="max-h-[350px] overflow-y-auto mt-4">
          <h1 className="text-white text-sm ">Popular Tokens</h1>
          {Coins.map((coin) => (
            <div className=" text-white text-sm py-4 flex items-center justify-start rounded-2xl">
              <img
                src={coin.basic.icon}
                className="h-9 w-9 rounded-full mr-4"
                alt=""
              />

              {coin.basic.name}
            </div>
          ))}
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SelectTokenSection;
