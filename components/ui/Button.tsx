import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "outline" | "quiet";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[2px] font-sans font-medium " +
  "transition-[background-color,color,border-color,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] " +
  "active:translate-y-px disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  // clay-deep, not clay: paper on clay is 3.52:1 and this is the primary CTA.
  // Hover steps DOWN to clay-press (6.40:1) — going lighter would drop it
  // back under AA on the one interaction most likely to be used.
  primary: "bg-clay-deep text-paper hover:bg-clay-press",
  outline:
    "border border-ink/25 text-ink hover:border-ink/60 hover:bg-ink/[0.03]",
  quiet: "text-ink-soft hover:text-clay-deep",
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

/**
 * Renders a `next/link` for internal routes and a plain anchor for hashes and
 * external URLs.
 *
 * This matters more than it looks: a raw <a href="/order/"> ignores Next's
 * `basePath`, so on GitHub Pages — where the site is served from a subpath —
 * it would navigate to the wrong place. `next/link` applies the prefix for us.
 */
export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  href = "#",
  children,
  ...rest
}: ComponentPropsWithoutRef<"a"> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}) {
  const classes = classesFor(variant, size, className);
  const isInternal = href.startsWith("/") && !href.startsWith("//");

  if (isInternal) {
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={classes} {...rest}>
      {children}
    </a>
  );
}
