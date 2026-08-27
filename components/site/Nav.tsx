"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";

const LINKS = [
  { href: "#how", label: "How It Works" },
  { href: "#examples", label: "Examples" },
];

export default function Nav() {
  const [settled, setSettled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSettled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("hashchange", close);
    return () => window.removeEventListener("hashchange", close);
  }, [open]);

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        settled
          ? "border-b border-line bg-base/80 backdrop-blur-xl"
          : "border-b border-transparent",
      ].join(" ")}
    >
      <div className="shell flex h-20 items-center justify-between">
        <Link href="/" aria-label="Tails We Remember, home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[0.9375rem] text-mid transition-colors duration-300 hover:text-hi"
            >
              {l.label}
            </a>
          ))}
          <ButtonLink href="/create/" className="h-11 px-6">
            Create a Song
          </ButtonLink>
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="-mr-2 flex size-11 items-center justify-center md:hidden"
        >
          <span className="relative block h-3 w-6">
            <span
              className={[
                "absolute left-0 block h-px w-6 bg-hi transition-transform duration-300",
                open ? "top-1.5 rotate-45" : "top-0",
              ].join(" ")}
            />
            <span
              className={[
                "absolute left-0 block h-px w-6 bg-hi transition-transform duration-300",
                open ? "top-1.5 -rotate-45" : "top-3",
              ].join(" ")}
            />
          </span>
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-base md:hidden">
          <nav className="shell flex flex-col gap-1 py-6">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-3 font-display text-[1.375rem] font-light text-hi"
              >
                {l.label}
              </a>
            ))}
            <ButtonLink href="/create/" className="mt-4 w-full">
              Create a Song
            </ButtonLink>
          </nav>
        </div>
      )}
    </header>
  );
}
