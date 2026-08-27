import type { Metadata } from "next";
import Link from "next/link";
import StudioConsole from "@/components/studio/StudioConsole";
import { Wordmark } from "@/components/ui/Logo";

/**
 * The studio.
 *
 * Shipped with the public site rather than kept in a separate app, on purpose. It
 * needs the audio provider, the waveform and the design tokens that already live
 * here, and duplicating those into a second project to hide a page that does
 * nothing without a token would be cost with no benefit.
 *
 * `noindex` because it has no business in search results, not as a security
 * measure. The actual boundary is the operator token on the song service: without
 * it this page can load and then do precisely nothing.
 */
export const metadata: Metadata = {
  title: "Studio · Tails We Remember",
  description: "Internal. Turning a family's answers into their song.",
  robots: { index: false, follow: false },
};

export default function StudioPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-line">
        <div className="shell flex h-20 items-center justify-between">
          <div className="flex items-baseline gap-4">
            <Link href="/" aria-label="Tails We Remember, home">
              <Wordmark />
            </Link>
            <span className="label">Studio</span>
          </div>
          <Link
            href="/"
            className="text-[0.9375rem] text-muted transition-colors duration-300 hover:text-ink"
          >
            Leave
          </Link>
        </div>
      </header>

      <main className="shell flex-1 py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          <StudioConsole />
        </div>
      </main>

      <footer className="shell pb-10">
        <p className="mx-auto max-w-3xl text-[0.8125rem] leading-relaxed text-muted">
          Every song here is somebody&rsquo;s pet. Read the lyrics before you
          generate, and listen to the whole take before you send it.
        </p>
      </footer>
    </div>
  );
}
