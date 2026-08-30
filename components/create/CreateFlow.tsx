"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { STEPS, TOTAL, LABELS, SUMMARY_ORDER, type Step } from "@/lib/questions";
import { Button, ButtonLink, TextLink } from "@/components/ui/Button";
import { PRICE, PAYMENTS_LIVE, makeRef, checkoutUrl } from "@/lib/config";

type Answers = Record<string, string>;

const ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "";
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "";

function summarise(a: Answers) {
  return SUMMARY_ORDER.filter((k) => a[k]?.trim())
    .map((k) => `${LABELS[k] ?? k}:\n${a[k].trim()}`)
    .join("\n\n");
}

export default function CreateFlow() {
  const [i, setI] = useState(0);
  const [a, setA] = useState<Answers>({});
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<"filling" | "sending" | "done" | "manual">(
    "filling"
  );
  const [copied, setCopied] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  /**
   * Generated in an effect, not in a useState initialiser: crypto exists on the
   * server too, so initialising there would produce one value during SSR and a
   * different one on the client — a hydration mismatch on every load. It isn't
   * needed until submit, so a frame late costs nothing.
   */
  const [ref, setRef] = useState("");
  useEffect(() => setRef(makeRef()), []);

  const step = STEPS[i];
  const last = i === TOTAL - 1;

  const set = useCallback((k: string, v: string) => {
    setA((p) => ({ ...p, [k]: v }));
    setError(null);
  }, []);

  const missing = useMemo(() => {
    if (!step.required) return false;
    if (step.kind === "name")
      return a.petName?.trim() ? false : "Just their name is enough to start.";
    if (step.kind === "contact") {
      if (!a.yourName?.trim()) return "And your name, so we know who to write to.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.email?.trim() ?? ""))
        return "We'll need an email address that works.";
      return false;
    }
    return a[step.id]?.trim() ? false : "Even one line helps.";
  }, [step, a]);

  const submit = useCallback(async () => {
    const payload: Answers = {
      ...a,
      reference: ref,
      photoNames: files.length
        ? files.map((f) => f.name).join(", ")
        : "none — to follow by email",
    };
    // Trimmed: the name lands in an email subject line, and nothing stops
    // someone pasting a paragraph into that field.
    const shortName = (a.petName || "unnamed").trim().slice(0, 40);
    payload.subject = `Song request ${ref} — ${shortName}`;
    payload.summary = summarise(payload);

    if (!ENDPOINT) {
      setA(payload);
      setState("manual");
      return;
    }

    setState("sending");
    try {
      /**
       * Always JSON, never multipart.
       *
       * The earlier version switched to multipart whenever photos were chosen so
       * attachments could ride along. Per Web3Forms' API reference, `attachment`
       * is a PRO feature — on the free plan that request is liable to fail, and
       * a failure here drops someone onto the copy-and-paste fallback instead of
       * quietly emailing their story. Reliable delivery of the words matters far
       * more than carrying the images: photographs are collected by reply, which
       * the confirmation says.
       *
       * `email` is deliberately in the payload — Web3Forms uses it as the
       * reply-to address, so replying to the notification reaches the customer
       * directly. That is exactly how you ask for the photographs.
       */
      const body: Record<string, string> = {
        ...payload,
        from_name: "Tails We Remember",
      };
      if (WEB3FORMS_KEY) body.access_key = WEB3FORMS_KEY;

      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
      });

      // A 200 can still carry success:false, so the status alone isn't enough.
      const json = await res.json().catch(() => null);
      if (!res.ok || (json && json.success === false)) {
        throw new Error(json?.message ?? String(res.status));
      }

      setA(payload);
      setState("done");
    } catch {
      // Never lose what someone just wrote to a network or provider error.
      setA(payload);
      setState("manual");
    }
  }, [a, files, ref]);

  const next = useCallback(() => {
    if (missing) return setError(missing);
    if (last) return void submit();
    setI((n) => Math.min(n + 1, TOTAL - 1));
  }, [missing, last, submit]);

  /* ───────────────────────────── finished ───────────────────────────── */

  if (state === "done" || state === "manual") {
    return (
      <div className="step-in mx-auto max-w-xl">
        <h1 className="text-section font-light">
          {state === "done"
            ? `Thank you for telling us about ${a.petName || "them"}.`
            : "One last step."}
        </h1>

        {state === "done" ? (
          <p className="mt-7 text-lede text-mid">
            A real person will read every word of that. If you haven&rsquo;t sent
            photos yet, just reply to the email we send you.
          </p>
        ) : (
          <>
            <p className="mt-7 text-lede text-mid">
              Copy what you&rsquo;ve written and send it to us — that&rsquo;s
              everything we need to begin.
            </p>
            <pre className="mt-8 max-h-72 overflow-auto whitespace-pre-wrap border border-line bg-surface p-5 text-[0.8125rem] leading-relaxed text-mid">
              {summarise(a)}
            </pre>
            <div className="mt-6 flex flex-wrap items-center gap-5">
              <Button
                variant="outline"
                onClick={() => {
                  void navigator.clipboard
                    ?.writeText(summarise(a))
                    .then(() => setCopied(true))
                    .catch(() => setCopied(false));
                }}
              >
                {copied ? "Copied" : "Copy this"}
              </Button>
              <TextLink
                href={`mailto:hello@tailsweremember.com?subject=${encodeURIComponent(
                  `Song ${ref} for ${a.petName || "my pet"}`
                )}&body=${encodeURIComponent(summarise(a))}`}
              >
                Open my email instead
              </TextLink>
            </div>
          </>
        )}

        {/* Payment is offered after EITHER outcome.
            It used to sit inside the `done` branch only, which meant that with no
            form endpoint configured — the default — the flow ended on the
            copy-and-email fallback and never asked for money at all. */}
        {PAYMENTS_LIVE ? (
          <div className="mt-11 border-t border-line pt-9">
            <p className="label">One last step</p>
            <h2 className="mt-4 font-display text-[1.5rem] font-light leading-snug text-hi">
              Complete your order — {PRICE}
            </h2>
            <p className="mt-3 max-w-md text-[0.9375rem] leading-relaxed text-low">
              We start writing as soon as this comes through, and you&rsquo;ll
              have {a.petName || "their"} song within 48 hours. Payment is handled
              entirely by Stripe — we never see your card details.
            </p>

            <div className="mt-7">
              <ButtonLink href={checkoutUrl(ref)}>
                Pay {PRICE} securely
              </ButtonLink>
            </div>

            <p className="mono mt-7 text-[0.75rem] text-low">
              Order reference {ref}
            </p>
          </div>
        ) : (
          <p className="mt-8 border-t border-line pt-7 text-[0.9375rem] text-low">
            Nothing has been charged. We&rsquo;ll be in touch within 48 hours
            {a.email ? (
              <>
                {" "}
                at <span className="text-hi">{a.email}</span>
              </>
            ) : null}
            .
          </p>
        )}

        <p className="mt-12">
          <TextLink href="/">Return to the songs</TextLink>
        </p>
      </div>
    );
  }

  /* ───────────────────────────── filling ───────────────────────────── */

  return (
    <div className="mx-auto max-w-xl">
      {/* progress: one hairline, filling */}
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-line">
          <div
            className="h-px bg-amber transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ width: `${((i + 1) / TOTAL) * 100}%` }}
          />
        </div>
        <span className="shrink-0 text-[0.6875rem] tabular-nums tracking-[0.16em] text-low">
          {i + 1} / {TOTAL}
        </span>
      </div>

      <div key={i} className="step-in mt-14 min-h-[17rem]">
        <h1 className="font-display text-[clamp(1.75rem,3.6vw,2.5rem)] font-light leading-[1.12] text-hi">
          {step.question}
        </h1>
        {step.help && (
          <p className="mt-4 max-w-lg text-[0.9375rem] leading-relaxed text-low">
            {step.help}
          </p>
        )}

        <div className="mt-9">
          <Field
            step={step}
            a={a}
            set={set}
            files={files}
            setFiles={setFiles}
            fileInput={fileInput}
            onEnter={next}
          />
        </div>

        {error && (
          <p role="alert" className="mt-4 text-[0.875rem] text-amber">
            {error}
          </p>
        )}
      </div>

      <div className="mt-12 flex items-center justify-between gap-4 border-t border-line pt-7">
        <button
          onClick={() => {
            setError(null);
            setI((n) => Math.max(n - 1, 0));
          }}
          disabled={i === 0}
          className="text-[0.9375rem] text-low transition-colors duration-300 hover:text-hi disabled:invisible"
        >
          Back
        </button>

        <div className="flex items-center gap-6">
          {!step.required && (
            <button
              onClick={() => setI((n) => Math.min(n + 1, TOTAL - 1))}
              className="text-[0.9375rem] text-low transition-colors duration-300 hover:text-hi"
            >
              Skip
            </button>
          )}
          <Button onClick={next} disabled={state === "sending"}>
            {state === "sending" ? "Sending…" : last ? "Send" : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────── fields ────────────────────────────── */

const line =
  "w-full bg-transparent border-b border-line py-3 text-[1.125rem] text-hi " +
  "outline-none transition-colors duration-300 placeholder:text-low/55 " +
  "focus:border-amber";

const box =
  "w-full resize-none border border-line bg-surface px-4 py-3.5 text-[1.0625rem] " +
  "leading-relaxed text-hi outline-none transition-colors duration-300 " +
  "placeholder:text-low/55 focus:border-amber";

function Field({
  step,
  a,
  set,
  files,
  setFiles,
  fileInput,
  onEnter,
}: {
  step: Step;
  a: Answers;
  set: (k: string, v: string) => void;
  files: File[];
  setFiles: (f: File[]) => void;
  fileInput: React.RefObject<HTMLInputElement | null>;
  onEnter: () => void;
}) {
  if (step.kind === "name") {
    const species = [
      { value: "dog", label: "Dog" },
      { value: "cat", label: "Cat" },
      { value: "other", label: "Someone else" },
    ];
    return (
      <div className="flex flex-col gap-8">
        <input
          autoFocus
          value={a.petName ?? ""}
          onChange={(e) => set("petName", e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onEnter()}
          placeholder="Their name"
          className={line}
          maxLength={80}
        />
        <div role="radiogroup" aria-label="Dog, cat, or someone else" className="flex flex-wrap gap-2.5">
          {species.map((s) => {
            const on = a.species === s.value;
            return (
              <button
                key={s.value}
                role="radio"
                aria-checked={on}
                onClick={() => set("species", s.value)}
                className={[
                  "rounded-[3px] border px-5 py-2.5 text-[0.9375rem] transition-colors duration-300",
                  on
                    ? "border-amber bg-amber text-base"
                    : "border-line text-mid hover:border-edge",
                ].join(" ")}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (step.kind === "choice") {
    return (
      <div role="radiogroup" aria-label={step.question} className="flex flex-wrap gap-2.5">
        {step.options.map((o) => {
          const on = a[step.id] === o.value;
          return (
            <button
              key={o.value}
              role="radio"
              aria-checked={on}
              onClick={() => set(step.id, o.value)}
              className={[
                "rounded-[3px] border px-5 py-2.5 text-[0.9375rem] transition-colors duration-300",
                on
                  ? "border-amber bg-amber text-base"
                  : "border-line text-mid hover:border-edge",
              ].join(" ")}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    );
  }

  if (step.kind === "photos") {
    return (
      <div>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(e) => setFiles(Array.from(e.target.files ?? []).slice(0, 8))}
        />
        <button
          onClick={() => fileInput.current?.click()}
          className="w-full rounded-[3px] border border-dashed border-line px-5 py-9 text-[0.9375rem] text-low transition-colors duration-300 hover:border-amber hover:text-hi"
        >
          {files.length
            ? `${files.length} photo${files.length > 1 ? "s" : ""} chosen`
            : "Choose photos"}
        </button>
        <p className="mt-3 text-[0.8125rem] leading-relaxed text-low">
          Attach these to your reply when we write back — photographs travel by
          email, not through this page.
        </p>
        {files.length > 0 && (
          <ul className="mt-4 flex flex-col gap-1.5">
            {files.map((f) => (
              <li key={f.name} className="truncate text-[0.8125rem] text-low">
                {f.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  if (step.kind === "contact") {
    return (
      <div className="flex flex-col gap-7">
        <label className="block">
          <span className="label">Your name</span>
          <input
            autoFocus
            value={a.yourName ?? ""}
            onChange={(e) => set("yourName", e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onEnter()}
            className={`${line} mt-2`}
            placeholder="Danni"
          />
        </label>
        <label className="block">
          <span className="label">Email</span>
          <input
            type="email"
            inputMode="email"
            value={a.email ?? ""}
            onChange={(e) => set("email", e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onEnter()}
            className={`${line} mt-2`}
            placeholder="you@email.com"
          />
        </label>
      </div>
    );
  }

  if (step.kind === "long") {
    const v = a[step.id] ?? "";
    return (
      <div>
        <textarea
          autoFocus
          rows={6}
          maxLength={step.maxLength}
          value={v}
          onChange={(e) => set(step.id, e.target.value)}
          placeholder={step.placeholder}
          className={box}
        />
        {step.maxLength && (
          <p className="mt-2 text-right text-[0.75rem] tabular-nums text-low/80">
            {v.length} / {step.maxLength}
          </p>
        )}
      </div>
    );
  }

  return (
    <input
      autoFocus
      value={a[step.id] ?? ""}
      maxLength={step.maxLength}
      onChange={(e) => set(step.id, e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && onEnter()}
      placeholder={step.placeholder}
      className={line}
    />
  );
}
