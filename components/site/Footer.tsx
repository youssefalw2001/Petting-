import { LogoStacked } from "@/components/ui/Logo";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-sunk band-tight">
      <div className="shell">
        <div className="flex flex-col items-center gap-7 text-center">
          <LogoStacked />

          <a
            href="mailto:hello@tailsweremember.com"
            className="mt-1 text-[0.9375rem] text-amber underline decoration-amber/40 decoration-1 underline-offset-4 transition-colors duration-300 hover:decoration-amber"
          >
            hello@tailsweremember.com
          </a>

          <p className="label mt-2">© {year} TailsWeRemember</p>
        </div>
      </div>
    </footer>
  );
}
