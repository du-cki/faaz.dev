import {
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";

import clsx from "clsx";

type Props = Omit<ComponentPropsWithoutRef<"a">, "content"> & {
  content?: ReactNode;
  trigger?: "hover" | "click";
  align?: "left" | "center" | "right";
  underline?: boolean;
};

const wrapperAlign = {
  left: "left-0",
  center: "left-1/2 -translate-x-1/2",
  right: "right-0",
};

const originAlign = {
  left: "origin-top-left",
  center: "origin-top",
  right: "origin-top-right",
};

export default function Popover({
  children,
  content,
  trigger = "hover",
  align = "left",
  underline = true,
  className,
  href,
  ...props
}: Props) {
  const id = useId();

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const isHover = trigger === "hover" || href !== undefined;

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };

    const onKeyDown = (e: KeyboardEvent) =>
      e.key === "Escape" && setOpen(false);

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const show = () => {
    clearTimeout(timer.current);
    setOpen(true);
  };

  const hide = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(false), 120);
  };

  const label = underline ? (
    <span className="rounded bg-linear-to-r from-accent to-accent bg-size-[0%_2px] bg-bottom-left bg-no-repeat transition-all duration-500 ease-out group-hover:bg-size-[100%_2px] group-aria-expanded:bg-size-[100%_2px]">
      {children}
    </span>
  ) : (
    children
  );

  const triggerClass = clsx(
    "group font-medium text-accent",
    !href && "cursor-pointer",
    className,
  );

  const triggerProps: ComponentPropsWithoutRef<"button"> &
    ComponentPropsWithoutRef<"a"> = {
    "aria-expanded": open,
    "aria-controls": id,
    className: triggerClass,
  };

  const hoverProps = isHover
    ? {
        onPointerEnter: (e: React.PointerEvent) =>
          e.pointerType === "mouse" && show(),
        onPointerLeave: (e: React.PointerEvent) =>
          e.pointerType === "mouse" && hide(),
        onFocus: show,
        onBlur: hide,
      }
    : {};

  return (
    <span ref={ref} className="relative inline-flex" {...hoverProps}>
      {href ? (
        <a href={href} {...props} {...triggerProps}>
          {label}
        </a>
      ) : (
        <button
          type="button"
          onClick={isHover ? undefined : () => setOpen((o) => !o)}
          {...triggerProps}
        >
          {label}
        </button>
      )}

      {content && (
        <span
          className={clsx(
            "absolute top-full z-50 pt-3",
            wrapperAlign[align],
            !open && "pointer-events-none",
          )}
        >
          <span
            id={id}
            role="dialog"
            className={clsx(
              "block w-max max-w-64 rounded-2xl bg-white px-4 py-2 text-left text-sm leading-normal shadow-xl ring-1 ring-black/5 transition duration-150 ease-out",
              originAlign[align],
              open ? "scale-100 opacity-100" : "scale-95 opacity-0",
            )}
          >
            {content}
          </span>
        </span>
      )}
    </span>
  );
}
