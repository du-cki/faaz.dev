import React from "react";
import clsx from "clsx";

type Props = {} & React.ComponentProps<"a">;

export default function AnimatedAnchor({
  className,
  children,
  ...props
}: Props) {
  return (
    <a
      {...props}
      className={clsx(
        "group font-medium text-accent transition-all duration-300 ease-in-out",
        className,
      )}
    >
      <span className="bg-bottom-left bg-linear-to-r from-accent to-accent bg-size-[0%_2px] bg-no-repeat group-hover:bg-size-[100%_2px] transition-all duration-500 ease-out rounded">
        {children}
      </span>
    </a>
  );
}
