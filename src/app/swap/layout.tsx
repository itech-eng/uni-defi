import LayoutWithHeader from "@/src/components/layouts/layout-with-header";
import React from "react";

export default function SwapLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <LayoutWithHeader>{children}</LayoutWithHeader>
    </div>
  );
}
