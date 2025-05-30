import React from "react";

type Props = {
  align?: "normal" | "space-around";
  children?: React.ReactNode;
};

export default function Section({ align = "space-around", children }: Props) {
  return (
    <div
      className="flex flex-col min-h-screen p-10 md:p-20 space-y-10 md:space-y-5"
      style={{ justifyContent: align }}
    >
      {children}
    </div>
  );
}
