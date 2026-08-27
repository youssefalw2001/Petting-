import type { Metadata } from "next";
import Link from "next/link";
import OrderFlow from "@/components/order/OrderFlow";
import { Wordmark } from "@/components/ui/Logo";

export const metadata: Metadata = {
  title: "Tell us about them",
  description:
    "Thirteen questions, about five minutes. A real person reads every answer.",
  robots: { index: false, follow: true },
};

export default function OrderPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-rule">
        <div className="shell flex h-[4.5rem] items-center justify-between">
          <Link href="/" aria-label="Tails We Remember, home">
            <Wordmark />
          </Link>
          <Link
            href="/"
            className="text-[0.9375rem] text-ink-faint transition-colors duration-300 hover:text-clay-deep"
          >
            Leave
          </Link>
        </div>
      </header>

      <main className="shell flex-1 py-14 md:py-20">
        <OrderFlow />
      </main>

      <footer className="shell py-8">
        <p className="mx-auto max-w-2xl text-[0.8125rem] leading-relaxed text-ink-faint">
          Nothing is charged yet — we&rsquo;ll email you before anything is
          taken. Your answers stay between us and are never posted without your
          permission.
        </p>
      </footer>
    </div>
  );
}
