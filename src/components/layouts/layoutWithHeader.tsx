import React from "react";
import Navbar from "../navbar";

const LayoutWithHeader = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default LayoutWithHeader;
