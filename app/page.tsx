import Nav from "@/components/site/Nav";
import Hero from "@/components/site/Hero";
import Receive from "@/components/site/Receive";
import Examples from "@/components/site/Examples";
import HowItWorks from "@/components/site/HowItWorks";
import Promise from "@/components/site/Promise";
import Testimonials from "@/components/site/Testimonials";
import Closing from "@/components/site/Closing";
import Footer from "@/components/site/Footer";

/**
 * Six sections, read top to bottom as one story:
 *
 *   what this is → why a photograph isn't enough, and what you get instead →
 *   other people's → why it's yours and how it happens → what we promise → begin
 *
 * <Testimonials /> renders nothing until there are real quotes in content.ts, at
 * which point it appears between the promise and the close by itself.
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
        <Promise />
        <Testimonials />
        <Closing />
      </main>
      <Footer />
    </>
  );
}
