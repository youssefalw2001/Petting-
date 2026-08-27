"use client";

import type { ReactNode } from "react";

/**
 * Shared parts for the studio.
 *
 * The studio uses the site's colour and type tokens but not its restraint. The
 * public page is designed to be quiet; this one is a working tool where the
 * operator needs to see state, warnings and dense text at a glance. Same
 * vocabulary, different register.
 */

export function Panel({
  title,
  subtitle,
  children,
  actions,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section className="rounded-[3px] border border-line bg-raise/40 p-6 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-[1.5rem] font-light leading-tight text-ink">{title}</h2>
          {subtitle ? (
            <p className="mt-1 text-[0.875rem] leading-relaxed text-muted">{subtitle}</p>
          ) : null}
        </div>
        {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="label block">{label}</span>
      {hint ? <span className="mt-1 block text-[0.8125rem] text-muted">{hint}</span> : null}
      <div className="mt-2">{children}</div>
    </label>
  );
}

const inputBase =
  "w-full rounded-[3px] border border-line bg-page px-3 py-2.5 font-sans text-[0.9375rem] " +
  "text-ink placeholder:text-muted/70 transition-colors duration-200 " +
  "focus:border-rose-deep focus:outline-none";

export function TextInput(props: React.ComponentPropsWithoutRef<"input">) {
  return <input {...props} className={`${inputBase} ${props.className ?? ""}`} />;
}

export function TextArea(props: React.ComponentPropsWithoutRef<"textarea">) {
  return (
    <textarea
      {...props}
      className={`${inputBase} min-h-32 resize-y leading-relaxed ${props.className ?? ""}`}
    />
  );
}

/** Monospace, for anything the model reads literally. */
export function CodeArea(props: React.ComponentPropsWithoutRef<"textarea">) {
  return (
    <textarea
      {...props}
      spellCheck={false}
      className={
        "w-full rounded-[3px] border border-line bg-page px-3 py-2.5 " +
        "font-mono text-[0.8125rem] leading-[1.7] text-ink " +
        "transition-colors duration-200 focus:border-rose-deep focus:outline-none " +
        `resize-y ${props.className ?? ""}`
      }
    />
  );
}

/**
 * A warning the operator has to read.
 *
 * Rose is decoration-only elsewhere on the site because it fails AA for text.
 * Here the warning text is ink and rose is confined to the rule and the marker,
 * which keeps it on the right side of that line while still reading as a flag.
 */
export function Warning({ children }: { children: ReactNode }) {
  return (
    <li className="border-l-2 border-rose pl-3 text-[0.875rem] leading-relaxed text-ink">
      {children}
    </li>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return <li className="text-[0.8125rem] leading-relaxed text-muted">{children}</li>;
}

export function StatusDot({ tone }: { tone: "ok" | "busy" | "bad" | "idle" }) {
  const colour =
    tone === "ok"
      ? "bg-rose-deep"
      : tone === "busy"
        ? "bg-rose animate-pulse"
        : tone === "bad"
          ? "bg-ink"
          : "bg-line";
  return <span className={`inline-block size-2 shrink-0 rounded-full ${colour}`} aria-hidden />;
}

export function Meta({ items }: { items: [string, ReactNode][] }) {
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-1.5 text-[0.8125rem]">
      {items.map(([key, value]) => (
        <div key={key} className="contents">
          <dt className="text-muted">{key}</dt>
          <dd className="tabular-nums text-ink">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
