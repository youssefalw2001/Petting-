import { Wordmark } from "@/components/ui/Logo";
import { TailMark } from "@/components/ui/Logo";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="band-tight">
      <div className="shell">
        <div className="flex flex-col items-center gap-7 text-center">
          <TailMark className="h-8 w-8 text-rose" />
          <Wordmark />

          <a
            href="mailto:hello@tailsweremember.com"
            className="text-[0.9375rem] text-rose-deep underline decoration-rose-deep/35 decoration-1 underline-offset-4 transition-colors duration-300 hover:decoration-rose-deep"
          >
            hello@tailsweremember.com
          </a>

          <p className="mt-2 text-[0.75rem] uppercase tracking-[0.16em] text-muted">
            © {year} Tails We Remember
          </p>
        </div>
      </div>
    </footer>
  );
}
