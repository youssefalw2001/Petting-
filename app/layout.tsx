import type { Metadata } from "next";
import { Sora, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AudioProvider } from "@/components/audio/AudioProvider";
import Reveal from "@/components/ui/Reveal";

/**
 * Sora for headlines — geometric, modern, and at weight 300 with tight tracking
 * it reads precise rather than technical. The elegant serif it replaced was
 * beautiful but firmly traditional; this is the direction change.
 *
 * Manrope for body: modern, slightly warm, and not Inter.
 *
 * JetBrains Mono for micro-labels, step numbers and timecodes. Monospace at
 * small sizes is doing most of the work of making the page feel engineered.
 */
const sora = Sora({
  subsets: ["latin"],
  weight: ["200", "300", "400"],
  variable: "--font-sora",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono-jb",
  display: "swap",
});

const SITE = "https://tailsweremember.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "Tails We Remember — A song for the one you'll always remember",
  description:
    "A personalised song made from the memories, personality and moments you shared with your pet. Made from your memories. Kept forever.",
  openGraph: {
    title: "Tails We Remember",
    description:
      "A personalised song made from the memories you shared with your pet.",
    url: SITE,
    siteName: "Tails We Remember",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tails We Remember",
    description:
      "A personalised song made from the memories you shared with your pet.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${manrope.variable} ${mono.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js')`,
          }}
        />
      </head>
      <body>
        <AudioProvider>{children}</AudioProvider>
        <div className="grain" aria-hidden="true" />
        <Reveal />
      </body>
    </html>
  );
}
