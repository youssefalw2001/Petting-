import type { Metadata } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/providers/SmoothScroll";
import { AudioProvider } from "@/components/audio/AudioProvider";
import MiniPlayer from "@/components/audio/MiniPlayer";
import Grain from "@/components/ui/Grain";

// Display: variable serif with SOFT + WONK axes. Warm, crafted, not-Inter.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});

// Body: clean without being Inter.
const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const SITE = "https://sunbeamrecords.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Sunbeam Records — Their story, turned into a song",
    template: "%s · Sunbeam Records",
  },
  description:
    "An original song about your dog or cat, written from your memories and delivered in 48 hours. One record, pressed for one family.",
  openGraph: {
    title: "Sunbeam Records — Their story, turned into a song",
    description:
      "An original song about your dog or cat, written from your memories and delivered in 48 hours.",
    url: SITE,
    siteName: "Sunbeam Records",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sunbeam Records — Their story, turned into a song",
    description:
      "An original song about your dog or cat, written from your memories and delivered in 48 hours.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${instrument.variable} antialiased`}
    >
      <head>
        {/* Blocking, pre-paint: marks JS as available so reveal targets can
            start hidden. Without JS the class never lands and all content
            renders normally. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js')`,
          }}
        />
      </head>
      <body className="bg-paper text-ink-soft">
        <AudioProvider>
          <SmoothScroll>{children}</SmoothScroll>
          <MiniPlayer />
        </AudioProvider>
        <Grain />
      </body>
    </html>
  );
}
