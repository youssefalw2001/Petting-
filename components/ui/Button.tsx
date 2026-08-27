import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "solid" | "outline" | "onDark";

const base =
  "inline-flex items-center justify-center rounded-[3px] font-sans text-[0.9375rem] " +
  "font-medium tracking-[0.01em] h-[3.25rem] px-8 " +
  "transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] " +
  "disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  // rose-deep, not rose: ivory on rose is 3.20:1 and this is the primary CTA.
  // Hover steps DOWN to rose-press rather than up, which would fall under AA.
  solid: "bg-rose-deep text-page hover:bg-rose-press",
  outline: "border border-ink/20 text-ink hover:border-ink/50",
  onDark: "bg-page text-ink hover:bg-page/90",
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

/** Quiet underlined text link — the only secondary action style on the site. */
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
    "text-[0.9375rem] text-rose-deep underline decoration-rose-deep/35 " +
    "decoration-1 underline-offset-4 transition-colors duration-300 " +
    `hover:decoration-rose-deep ${className}`;
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
