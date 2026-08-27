import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { AudioProvider } from "@/components/audio/AudioProvider";
import Reveal from "@/components/ui/Reveal";

/**
 * Cormorant Garamond for headlines — high contrast, delicate, and at light
 * weight it carries emotion without tipping into decoration.
 *
 * DM Sans for everything else. The brief offered Inter as an option; DM Sans is
 * on the same list and slightly warmer, and it avoids the single most
 * recognisable typeface of generated landing pages.
 */
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const dm = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm",
  display: "swap",
});

const SITE = "https://tailsweremember.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "Tails We Remember — A song for the one you'll always remember",
  description:
    "A personalised song made from the memories, personality and moments you shared with your pet. Made from your memories. Kept forever.",
  openGraph: {
    title: "A song for the one you'll always remember",
    description:
      "A personalised song made from the memories, personality and moments you shared with your pet.",
    url: SITE,
    siteName: "Tails We Remember",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "A song for the one you'll always remember",
    description:
      "A personalised song made from the memories you shared with your pet.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dm.variable}`}>
      <head>
        {/* Blocking and pre-paint: marks JS as available so reveal targets can
            start hidden. Without JS the class never lands and everything
            renders normally. */}
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
