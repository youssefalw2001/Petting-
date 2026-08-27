import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import Listen from "@/components/sections/Listen";
import HowItWorks from "@/components/sections/HowItWorks";
import IntakeTease from "@/components/sections/IntakeTease";
import AnswersToLyrics from "@/components/sections/AnswersToLyrics";
import Reactions from "@/components/sections/Reactions";
import Pricing from "@/components/sections/Pricing";
import Reassurance from "@/components/sections/Reassurance";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Listen />
        <HowItWorks />
        <IntakeTease />
        <AnswersToLyrics />
        <Reactions />
        <Pricing />
        <Reassurance />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      {/* Leaves room for the docked player so it never covers the footer links */}
      <div className="h-24" aria-hidden="true" />
    </>
  );
}
