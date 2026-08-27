"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { STEPS, TOTAL_STEPS, LABELS, type Step } from "@/lib/questions";
import Waveform from "@/components/ui/Waveform";
import { Button } from "@/components/ui/Button";
import { ArrowIcon, CheckIcon } from "@/components/ui/icons";
import { LogoMark } from "@/components/ui/Logo";

type Answers = Record<string, string>;

/** Optional. When unset the flow falls back to a copy-and-send summary. */
const ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "";
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "";

function defaultAnswers(): Answers {
  const a: Answers = {};
  for (const s of STEPS) {
    if (s.kind === "choice" && s.defaultValue) a[s.id] = s.defaultValue;
  }
  return a;
}

function summarise(answers: Answers) {
  const order = [
    "tier", "name", "species", "breed", "arrival", "personality",
    "signature", "place", "moment", "family", "message", "genre",
    "voice", "avoid", "yourName", "email",
  ];
  return order
    .filter((k) => answers[k]?.trim())
    .map((k) => `${LABELS[k] ?? k}:\n${answers[k].trim()}`)
    .join("\n\n");
}

export default function OrderFlow() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>(defaultAnswers);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<"filling" | "sending" | "done" | "manual">(
    "filling"
  );
  const [copied, setCopied] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const directionRef = useRef<1 | -1>(1);

  const step = STEPS[index];
  const isLast = index === TOTAL_STEPS - 1;
  // index + 1 so the very first step already shows a filled bar — starting at
  // dead zero reads as "nothing is happening".
  const progress = (index + 1) / TOTAL_STEPS;

  const set = useCallback((id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    setError(null);
  }, []);

  // Slide the panel in whenever the step changes. Direction-aware so going
  // back feels like going back.
  useGSAP(
    () => {
      if (!panelRef.current) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(panelRef.current, {
          x: 34 * directionRef.current,
          opacity: 0,
          duration: 0.55,
          ease: "power3.out",
        });
      });
      return () => mm.revert();
    },
    { dependencies: [index, state], scope: panelRef }
  );

  const missing = useMemo(() => {
    if (!step) return false;
    if (!step.required) return false;
    if (step.kind === "contact") {
      const name = answers.yourName?.trim();
      const email = answers.email?.trim();
      if (!name) return "Your name, so we know who we're writing to.";
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        return "We need an email address that works.";
      return false;
    }
    return answers[step.id]?.trim() ? false : "This one we do need.";
  }, [step, answers]);

  const submit = useCallback(async () => {
    if (!ENDPOINT) {
      setState("manual");
      return;
    }
    setState("sending");
    try {
      const payload: Record<string, string> = {
        ...answers,
        subject: `New song request — ${answers.name || "unnamed"}`,
        summary: summarise(answers),
      };
      if (WEB3FORMS_KEY) payload.access_key = WEB3FORMS_KEY;

      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(String(res.status));
      setState("done");
    } catch {
      // Never lose someone's answers to a network error — fall back to the
      // manual path so the work they just did is still recoverable.
      setState("manual");
    }
  }, [answers]);

  const next = useCallback(() => {
    if (missing) {
      setError(missing);
      return;
    }
    if (isLast) {
      void submit();
      return;
    }
    directionRef.current = 1;
    setIndex((i) => Math.min(i + 1, TOTAL_STEPS - 1));
  }, [missing, isLast, submit]);

  const back = useCallback(() => {
    directionRef.current = -1;
    setError(null);
    setIndex((i) => Math.max(i - 1, 0));
  }, []);

  /* ─────────────────────────── finished ─────────────────────────── */

  if (state === "done" || state === "manual") {
    return (
      <div ref={panelRef} className="mx-auto max-w-2xl">
        <div className="flex items-center gap-3">
          <LogoMark className="h-9 w-9 text-clay" />
          <span className="eyebrow">
            {state === "done" ? "Received" : "Almost there"}
          </span>
        </div>

        <h1 className="mt-7 text-h2">
          {state === "done"
            ? `Thank you. We've got everything about ${answers.name || "them"}.`
            : "One last step — send us your answers."}
        </h1>

        {state === "done" ? (
          <>
            <p className="mt-6 text-lede text-ink-soft">
              A real person is going to read every word of that. You&rsquo;ll
              hear from us at{" "}
              <span className="text-ink">{answers.email}</span> within 48 hours,
              and we&rsquo;ll ask for photos then.
            </p>
            <ul className="mt-9 flex flex-col gap-3 border-t border-rule pt-7">
              {[
                "We write the lyrics from your answers",
                "You get two versions to choose between",
                "If it doesn't feel right, we rewrite it",
              ].map((t) => (
                <li
                  key={t}
                  className="flex items-start gap-3 text-[0.9375rem] text-ink-soft"
                >
                  <CheckIcon className="mt-[0.15em] size-4 shrink-0 text-clay-deep" />
                  {t}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <p className="mt-6 text-lede text-ink-soft">
              Copy your answers below and email them to us — that&rsquo;s
              everything we need to start.
            </p>
            <pre className="mt-7 max-h-80 overflow-auto whitespace-pre-wrap rounded-[2px] border border-rule bg-paper-deep/60 p-5 text-[0.8125rem] leading-relaxed text-ink-soft">
              {summarise(answers)}
            </pre>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={() => {
                  void navigator.clipboard
                    ?.writeText(summarise(answers))
                    .then(() => setCopied(true))
                    .catch(() => setCopied(false));
                }}
              >
                {copied ? "Copied" : "Copy my answers"}
              </Button>
              <a
                className="inline-flex h-[3.35rem] items-center justify-center rounded-[2px] border border-ink/25 px-7 text-[1rem] font-medium text-ink transition-colors duration-300 hover:border-ink/60"
                href={`mailto:hello@tailsweremember.com?subject=${encodeURIComponent(
                  `Song for ${answers.name || "my pet"}`
                )}&body=${encodeURIComponent(summarise(answers))}`}
              >
                Open my email app
              </a>
            </div>
          </>
        )}

        <a
          href="/"
          className="mt-10 inline-block text-[0.9375rem] text-clay-deep underline decoration-clay-deep/40 underline-offset-4"
        >
          Back to the songs
        </a>
      </div>
    );
  }

  /* ─────────────────────────── filling ─────────────────────────── */

  return (
    <div className="mx-auto max-w-2xl">
      {/* progress, as a filling waveform */}
      <div className="flex items-center gap-4">
        <Waveform
          bars={TOTAL_STEPS}
          seed={5}
          progress={progress}
          gap={0.45}
          className="h-7 flex-1"
        />
        <span className="shrink-0 text-[0.6875rem] font-medium uppercase tracking-[0.16em] tabular-nums text-ink-faint">
          {index + 1} / {TOTAL_STEPS}
        </span>
      </div>

      <div ref={panelRef} className="mt-12 min-h-[19rem]">
        <h1 className="text-[clamp(1.6rem,3.4vw,2.4rem)] font-display leading-[1.1] tracking-[-0.025em] text-ink">
          {step.question}
        </h1>

        {step.help && (
          <p className="mt-4 max-w-xl text-[0.9375rem] leading-relaxed text-ink-faint">
            {step.help}
          </p>
        )}

        <div className="mt-8">
          <StepField step={step} answers={answers} set={set} onEnter={next} />
        </div>

        {error && (
          <p role="alert" className="mt-4 text-[0.875rem] text-clay-deep">
            {error}
          </p>
        )}
      </div>

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-rule pt-7">
        <button
          onClick={back}
          disabled={index === 0}
          className="text-[0.9375rem] text-ink-faint transition-colors duration-300 hover:text-ink disabled:invisible"
        >
          Back
        </button>

        <div className="flex items-center gap-4">
          {!step.required && !answers[step.id] && (
            <button
              onClick={next}
              className="text-[0.9375rem] text-ink-faint transition-colors duration-300 hover:text-ink"
            >
              Skip
            </button>
          )}
          <Button size="lg" onClick={next} disabled={state === "sending"}>
            {state === "sending"
              ? "Sending…"
              : isLast
                ? "Send it to them"
                : "Continue"}
            {state !== "sending" && <ArrowIcon className="size-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────── fields ───────────────────────────── */

const inputBase =
  "w-full bg-transparent text-ink placeholder:text-ink-faint/55 " +
  "border-b border-rule py-3 text-[1.0625rem] outline-none " +
  "transition-colors duration-300 focus:border-clay-deep";

function StepField({
  step,
  answers,
  set,
  onEnter,
}: {
  step: Step;
  answers: Answers;
  set: (id: string, v: string) => void;
  onEnter: () => void;
}) {
  if (step.kind === "choice") {
    return (
      <div
        role="radiogroup"
        aria-label={step.question}
        className="flex flex-col gap-2.5"
      >
        {step.options.map((o) => {
          const active = answers[step.id] === o.value;
          return (
            <button
              key={o.value}
              role="radio"
              aria-checked={active}
              onClick={() => set(step.id, o.value)}
              className={[
                "flex items-center justify-between gap-4 rounded-[2px] border px-5 py-4 text-left transition-colors duration-300",
                active
                  ? "border-clay bg-clay/[0.06]"
                  : "border-rule hover:border-ink/40",
              ].join(" ")}
            >
              <span>
                <span className="block text-[1rem] text-ink">{o.label}</span>
                {o.note && (
                  <span className="mt-0.5 block text-[0.8125rem] text-ink-faint">
                    {o.note}
                  </span>
                )}
              </span>
              <span
                className={[
                  "flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
                  active ? "border-clay-deep bg-clay-deep text-paper" : "border-rule",
                ].join(" ")}
              >
                {active && <CheckIcon className="size-3" />}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  if (step.kind === "contact") {
    return (
      <div className="flex flex-col gap-6">
        <label className="block">
          <span className="eyebrow">Your name</span>
          <input
            autoFocus
            value={answers.yourName ?? ""}
            onChange={(e) => set("yourName", e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onEnter()}
            className={`${inputBase} mt-2`}
            placeholder="Danni"
          />
        </label>
        <label className="block">
          <span className="eyebrow">Email</span>
          <input
            type="email"
            inputMode="email"
            value={answers.email ?? ""}
            onChange={(e) => set("email", e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onEnter()}
            className={`${inputBase} mt-2`}
            placeholder="you@email.com"
          />
        </label>
      </div>
    );
  }

  if (step.kind === "long") {
    const value = answers[step.id] ?? "";
    return (
      <div>
        <textarea
          autoFocus
          rows={5}
          maxLength={step.maxLength}
          value={value}
          onChange={(e) => set(step.id, e.target.value)}
          placeholder={step.placeholder}
          className="w-full resize-none rounded-[2px] border border-rule bg-paper-deep/50 px-4 py-3.5 text-[1.0625rem] leading-relaxed text-ink outline-none transition-colors duration-300 placeholder:text-ink-faint/55 focus:border-clay-deep"
        />
        {step.maxLength && (
          <p className="mt-2 text-right text-[0.75rem] tabular-nums text-ink-faint/70">
            {value.length} / {step.maxLength}
          </p>
        )}
      </div>
    );
  }

  return (
    <input
      autoFocus
      value={answers[step.id] ?? ""}
      maxLength={step.maxLength}
      onChange={(e) => set(step.id, e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && onEnter()}
      placeholder={step.placeholder}
      className={inputBase}
    />
  );
}
