import React from "react";

type Props = {
  title: React.ReactNode | string;
  description?: React.ReactNode | string;
  align?: "left" | "right";
  children?: React.ReactNode;
};

export default function Segment({
  title,
  description,
  align,
  children,
}: Props) {
  return (
    <div style={{ textAlign: align }} className="bg-gray-500/30]">
      <h1 className="pb-2">{title}</h1>

      {description && (
        <p
          className="md:w-2/3"
          style={{ marginLeft: align == "right" ? "auto" : 0 }}
        >
          {description}
        </p>
      )}

      {children}
    </div>
  );
}
