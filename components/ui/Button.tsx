import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "outline" | "quiet";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[2px] font-sans font-medium " +
  "transition-[background-color,color,border-color,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] " +
  "active:translate-y-px disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-clay text-paper hover:bg-clay-deep",
  outline:
    "border border-ink/25 text-ink hover:border-ink/60 hover:bg-ink/[0.03]",
  quiet: "text-ink-soft hover:text-clay",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-[3.35rem] px-7 text-[1rem]",
};

function classesFor(variant: Variant, size: Size, className: string) {
  return [base, variants[variant], sizes[size], className]
    .filter(Boolean)
    .join(" ");
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: ComponentPropsWithoutRef<"button"> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}) {
  return (
    <button className={classesFor(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: ComponentPropsWithoutRef<"a"> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}) {
  return (
    <a className={classesFor(variant, size, className)} {...rest}>
      {children}
    </a>
  );
}
