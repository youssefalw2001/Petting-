import type { Metadata } from "next";
import Link from "next/link";
import CreateFlow from "@/components/create/CreateFlow";
import { Logo } from "@/components/ui/Logo";

export const metadata: Metadata = {
  title: "Tell us about them · Tails We Remember",
  description: "Share their name, their personality, and the memories you never want to forget.",
  robots: { index: false, follow: true },
};

export default function CreatePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-line">
        <div className="shell flex h-20 items-center justify-between">
          <Link href="/" aria-label="Tails We Remember, home">
            <Logo />
          </Link>
          <Link
            href="/"
            className="text-[0.9375rem] text-low transition-colors duration-300 hover:text-hi"
          >
            Leave
          </Link>
        </div>
      </header>

      <main className="shell flex-1 py-16 md:py-24">
        <CreateFlow />
      </main>

      <footer className="shell pb-10">
        <p className="mx-auto max-w-xl text-[0.8125rem] leading-relaxed text-low">
          Nothing is charged yet. What you write stays between us, and is never
          shared without your permission.
        </p>
      </footer>
    </div>
  );
}
