import { WordmarkStacked } from "@/components/ui/Logo";

/** Minimal, with a real address. At $97 a stranger needs somewhere to write to. */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-paper py-16 md:py-20">
      <div className="shell">
        <div className="flex flex-col items-center gap-9 text-center">
          <WordmarkStacked />

          <p className="max-w-md text-[0.9375rem] leading-relaxed text-ink-soft">
            Songs for the animals who ran the house. Written by hand, produced
            with AI tools, listened to by a person before they reach you.
          </p>

          <a
            href="mailto:hello@tailsweremember.com"
            className="text-[0.9375rem] text-clay-deep underline decoration-clay-deep/40 decoration-1 underline-offset-4 transition-colors duration-300 hover:decoration-clay-deep"
          >
            hello@tailsweremember.com
          </a>

          <div className="flex w-full flex-col items-center gap-4 border-t border-rule pt-8 sm:flex-row sm:justify-between">
            <p className="text-[0.75rem] uppercase tracking-[0.14em] text-ink-faint">
              © {year} Tails We Remember
            </p>
            <nav className="flex items-center gap-6 text-[0.75rem] uppercase tracking-[0.14em] text-ink-faint">
              <a
                href="#listen"
                className="transition-colors duration-300 hover:text-clay-deep"
              >
                Listen
              </a>
              <a
                href="#pricing"
                className="transition-colors duration-300 hover:text-clay-deep"
              >
                Pricing
              </a>
              <a
                href="#how"
                className="transition-colors duration-300 hover:text-clay-deep"
              >
                How it works
              </a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
