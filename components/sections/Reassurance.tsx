import Reveal from "@/components/ui/Reveal";
import { REASSURANCE } from "@/lib/data";

/** Four short promises on hairlines. Sits directly under pricing, where the doubt is. */
export default function Reassurance() {
  return (
    <section className="border-y border-rule bg-paper-deep/60">
      <div className="shell">
        <Reveal
          stagger={0.08}
          start="top 92%"
          className="grid divide-rule sm:grid-cols-2 sm:divide-x lg:grid-cols-4"
        >
          {REASSURANCE.map((item, i) => (
            <p
              key={item}
              className={[
                "flex items-center gap-3.5 px-2 py-7 text-[0.9375rem] text-ink sm:px-7",
                i > 1 ? "border-t border-rule lg:border-t-0" : "",
                i === 1 ? "border-t border-rule sm:border-t-0" : "",
              ].join(" ")}
            >
              <span
                className="inline-block size-1.5 shrink-0 rounded-full bg-clay"
                aria-hidden="true"
              />
              {item}
            </p>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
