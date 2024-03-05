import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { X } from "lucide-react";

const ClaimFeesModal = ({
  openStatus,
  setOpenStatus,
}: {
  openStatus: boolean;
  setOpenStatus: any;
}) => {
  return (
    <Dialog open={openStatus}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="sm:max-w-md border border-slate-900 bg-slate-950 h-auto flex flex-col justify-start">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-white">Add Liquidity</DialogTitle>
          <X
            className="text-white cursor-pointer"
            size={20}
            onClick={() => setOpenStatus(false)}
          />
        </DialogHeader>
        <div className="flex flex-col ">
          <div className="border mb-2 bg-slate-900 text-gray-400 border-slate-800 rounded-3xl mx-2">
            <div>
              <div className="flex justify-between items-center px-2">
                <div className="flex items-center gap-2 p-2 rounded-3xl">
                  <img
                    src="/coins/dkft20.png"
                    className="h-7 w-7 rounded-full"
                    alt=""
                  />
                  <h1>0.00</h1>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-3xl">
                  <h1>DKFT20</h1>
                </div>
              </div>
              <div className="flex justify-between items-center px-2">
                <div className="flex items-center gap-2 p-2 rounded-3xl">
                  <img
                    src="/coins/dkft20.png"
                    className="h-7 w-7 rounded-full"
                    alt=""
                  />
                  <h1>0.00</h1>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-3xl">
                  <h1>DKFT20</h1>
                </div>
              </div>
            </div>
          </div>
          <div className="items-center p-2 pt-0 flex justify-between">
            <button className="inline-flex items-center justify-center whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 bg-[#7e22ce4a] text-primary py-7 text-xl font-semibold rounded-2xl w-full hover:text-white hover:bg-primary hover:border-primary">
              Increase
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClaimFeesModal;
