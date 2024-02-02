import { MoveRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const Footer = () => {
  const footerNavs = [
    {
      href: "javascript:void()",
      name: "Terms",
    },
    {
      href: "javascript:void()",
      name: "License",
    },
    {
      href: "javascript:void()",
      name: "Privacy",
    },
    {
      href: "javascript:void()",
      name: "About us",
    },
  ];
  return (
    <footer className="pt-10 bg-slate-950">
      <div className="mx-auto px-4 text-white md:px-8">
        <div className="space-y-6 sm:max-w-md sm:mx-auto sm:text-center">
          <img src="/logo.webp" className="w-32 sm:mx-auto" />
          <p>Powered by the Uni Defi Protocol</p>
          <div className="items-center gap-x-3 space-y-3 sm:flex sm:justify-center sm:space-y-0">
            <Link
              href="/swap"
              className="block py-3 px-6 text-center text-white font-medium bg-gradient-to-r from-primary via-primary to-purple-400 hover:from-primary hover:via-primary hover:to-purple-400 rounded-lg shadow-lg hover:shadow-none"
            >
              Let's get started
            </Link>
            <a
              href="javascript:void(0)"
              className="flex items-center justify-center gap-x-2 py-3 px-6 text-white hover:text-white font-medium duration-150 active:bg-white border border-slate-800 rounded-lg md:inline-flex"
            >
              Connect Wallet
              <MoveRight size={20} />
            </a>
          </div>
        </div>
        <div className="mt-10 py-10 border-t border-slate-800 items-center justify-between sm:flex">
          <p>© {new Date().getFullYear()} Uni Defi. All rights reserved.</p>
          <ul className="flex flex-wrap items-center gap-4 mt-6 sm:text-sm sm:mt-0">
            {footerNavs.map((item, idx) => (
              <li className="text-white hover:text-white duration-150">
                <a key={idx} href={item.href}>
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
