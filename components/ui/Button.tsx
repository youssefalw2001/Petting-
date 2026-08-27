import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "solid" | "outline";

const base =
  "inline-flex items-center justify-center rounded-full font-sans text-[0.9375rem] " +
  "font-medium tracking-[0.005em] h-[3.25rem] px-8 " +
  "transition-[background-color,border-color,color,box-shadow] duration-300 " +
  "ease-[cubic-bezier(0.22,1,0.36,1)] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  // Base text on amber is 10.58:1. Going dark made the accent usable as a
  // filled control, which the previous rose never was.
  solid:
    "surface-amber bg-amber text-base hover:bg-amber-deep " +
    "shadow-[0_0_30px_-10px_rgba(240,178,122,0.5)] hover:shadow-[0_0_40px_-8px_rgba(240,178,122,0.65)]",
  // edge, not line: a control boundary needs 3:1 under 1.4.11.
  outline: "border border-edge text-hi hover:border-amber hover:text-amber",
};

function cls(v: Variant, extra: string) {
  return [base, variants[v], extra].filter(Boolean).join(" ");
}

export function Button({
  variant = "solid",
  className = "",
  children,
  ...rest
}: ComponentPropsWithoutRef<"button"> & {
  variant?: Variant;
  children: ReactNode;
}) {
  return (
    <button className={cls(variant, className)} {...rest}>
      {children}
    </button>
  );
}

/**
 * next/link for internal routes, plain anchor for hashes and external URLs.
 * A raw anchor ignores basePath, which would break every /create link once the
 * site is served from a subpath.
 */
export function ButtonLink({
  variant = "solid",
  className = "",
  href = "#",
  children,
  ...rest
}: ComponentPropsWithoutRef<"a"> & {
  variant?: Variant;
  children: ReactNode;
}) {
  const c = cls(variant, className);
  const internal = href.startsWith("/") && !href.startsWith("//");

  return internal ? (
    <Link href={href} className={c} {...rest}>
      {children}
    </Link>
  ) : (
    <a href={href} className={c} {...rest}>
      {children}
    </a>
  );
}

/** Quiet underlined text link — the only secondary action style. */
export function TextLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const c =
    "text-[0.9375rem] text-amber underline decoration-amber/40 decoration-1 " +
    `underline-offset-4 transition-colors duration-300 hover:decoration-amber ${className}`;
  const internal = href.startsWith("/") && !href.startsWith("//");

  return internal ? (
    <Link href={href} className={c}>
      {children}
    </Link>
  ) : (
    <a href={href} className={c}>
      {children}
    </a>
  );
}
