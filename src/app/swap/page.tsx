"use client";
import * as React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";
export default function Swap() {
  return (
    <div className="bg-slate-950 h-screen flex items-start justify-center">
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
                  <Input
                    id="name"
                    className="bg-transparent p-0 border-none text-white placeholder:text-gray-400 placeholder:text-4xl py-7 font-medium"
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="grid w-full mt-2 items-center gap-4">
                <div className="flex flex-col bg-slate-900 space-y-1.5 px-3 py-5 rounded-2xl">
                  <Label htmlFor="name" className="text-gray-400">
                    You Recieve
                  </Label>
                  <Input
                    id="name"
                    className="bg-transparent p-0 border-none text-white placeholder:text-gray-400 placeholder:text-4xl py-7 font-medium"
                    placeholder="0"
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button className="bg-[#7e22ce4a] text-primary py-7 text-xl font-semibold rounded-2xl w-full">
              Connect Wallet
            </Button>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
}
