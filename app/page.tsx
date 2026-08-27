import Nav from "@/components/site/Nav";
import Hero from "@/components/site/Hero";
import Receive from "@/components/site/Receive";
import Examples from "@/components/site/Examples";
import HowItWorks from "@/components/site/HowItWorks";
import Testimonials from "@/components/site/Testimonials";
import Closing from "@/components/site/Closing";
import Footer from "@/components/site/Footer";

/**
 * Six sections, read top to bottom as one story:
 *
 *   what this is → why a photograph isn't enough, and what you get instead →
 *   other people's → why it's yours and how it happens → what people say → begin
 *
 * Down from eight. The standalone emotional preamble folded into the section
 * showing the song, and the personalisation section folded into how it works —
 * both because a section that only carries one sentence isn't a section.
 */
export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Receive />
        <Examples />
        <HowItWorks />
        <Testimonials />
        <Closing />
      </main>
      <Footer />
    </>
  );
}
