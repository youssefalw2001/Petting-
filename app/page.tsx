import Nav from "@/components/site/Nav";
import Hero from "@/components/site/Hero";
import Opening from "@/components/site/Opening";
import Receive from "@/components/site/Receive";
import Examples from "@/components/site/Examples";
import HowItWorks from "@/components/site/HowItWorks";
import Personal from "@/components/site/Personal";
import Testimonials from "@/components/site/Testimonials";
import Closing from "@/components/site/Closing";
import Footer from "@/components/site/Footer";

/**
 * One page, read top to bottom as a single story:
 *
 *   what this is → why it exists → what you receive → other people's →
 *   how it happens → why it's yours → what people say → begin
 *
 * Eight sections. Anything that didn't help someone understand the product,
 * trust it, feel something, or buy it isn't here.
 */
export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Opening />
        <Receive />
        <Examples />
        <HowItWorks />
        <Personal />
        <Testimonials />
        <Closing />
      </main>
      <Footer />
    </>
  );
}
