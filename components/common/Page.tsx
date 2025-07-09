import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function Page({ children }: Props) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 space-y-12">{children}</div>
  );
}
