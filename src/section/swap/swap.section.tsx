import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";
import { ArrowDown, ChevronDown } from "lucide-react";
const SwapSection = () => {
  return (
    <section className="mt-36">
      <Card className="w-[450px] shadow-[0_0_80px_10px_#7e22ce4a] shadow-primary/20 border border-slate-800 rounded-3xl">
        <CardHeader>
          <CardTitle className="text-white text-base font-medium px-2 py-2">
            Swap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col bg-slate-900 space-y-1.5 px-3 py-5 rounded-2xl">
                <Label htmlFor="name" className="text-gray-400">
                  You Pay
                </Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="youPay"
                    type="text"
                    inputMode="decimal"
                    className="bg-transparent p-0 border-none text-white placeholder:text-gray-400 text-4xl placeholder:text-4xl py-7 font-medium focus:outline-none focus:border-none"
                    placeholder="0"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                  />
                  <div className="text-md cursor-pointer font-semibold text-white bg-primary w-72 h-10 flex items-center justify-center px-1 py-1 rounded-3xl">
                    Select Token
                    <ChevronDown className="ml-2" size={18} />
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -translate-x-1/2 border-[4px] border-slate-950 -translate-y-1/2 flex w-10 h-10 bg-slate-900 rounded-xl items-center justify-center left-1/2 hover:bg-slate-800 hover:border-slate-700 cursor-pointer">
              <ArrowDown className="mx-auto text-3xl text-white" size={15} />
            </div>
            <div className="grid w-full mt-2 items-center gap-4">
              <div className="flex flex-col bg-slate-900 space-y-1.5 px-3 py-5 rounded-2xl">
                <Label htmlFor="name" className="text-gray-400">
                  You Recieve
                </Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="youRecieve"
                    type="text"
                    inputMode="decimal"
                    className="bg-transparent p-0 border-none text-white placeholder:text-gray-400 text-4xl placeholder:text-4xl py-7 font-medium focus:outline-none focus:border-none"
                    placeholder="0"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                  />
                  <div className="text-xl cursor-pointer font-semibold text-white bg-slate-950 w-40  h-10 flex items-center justify-center border border-slate-800 px-3 rounded-3xl hover:bg-slate-800 hover:border-slate-700">
                    <img
                      src={"/networks/ethereum.png"}
                      className="h-5  mr-3 shrink-0"
                    />
                    ETH
                    <ChevronDown className="ml-2" size={18} />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button className="bg-[#7e22ce4a] text-primary py-7 text-xl font-semibold rounded-2xl w-full hover:text-white hover:bg-primary hover:border-primary  ">
            Connect Wallet
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
};

export default SwapSection;
