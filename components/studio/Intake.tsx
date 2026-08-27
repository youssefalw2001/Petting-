"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Panel, Field, TextInput, TextArea, Warning, Note } from "./ui";
import {
  api,
  parseSummary,
  missingRequired,
  ServiceError,
  type Answers,
  type Connection,
  type Job,
} from "@/lib/studio";
import { LABELS } from "@/lib/questions";

/**
 * Getting a customer's answers into the studio.
 *
 * The realistic input is a block of text in an inbox. With no form endpoint
 * configured the Create flow shows the customer a formatted summary and asks them
 * to email it, so paste-and-parse is the primary path and the fields underneath
 * are for fixing what the parse got wrong. Typing all ten fields by hand would
 * mean transcribing someone's account of their dead pet, which nobody will do
 * twice.
 */

const STYLES: { value: string; label: string }[] = [
  { value: "acoustic", label: "Gentle acoustic" },
  { value: "piano", label: "Piano" },
  { value: "folk", label: "Soft folk" },
  { value: "country", label: "Country" },
  { value: "unsure", label: "You choose" },
];

const EMPTY: Answers = { petName: "", memories: "" };

export default function Intake({
  connection,
  onCreated,
}: {
  connection: Connection;
  onCreated: (job: Job) => void;
}) {
  const [pasted, setPasted] = useState("");
  const [answers, setAnswers] = useState<Answers>(EMPTY);
  const [parseNote, setParseNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (key: keyof Answers) => (value: string) =>
    setAnswers((prev) => ({ ...prev, [key]: value }));

  const missing = missingRequired(answers);

  function handleParse() {
    const { answers: parsed, matched } = parseSummary(pasted);
    if (matched.length === 0) {
      setParseNote(
        "Nothing recognisable in that. It expects the summary the Create flow " +
          "produces — lines like “Their name:” followed by the answer. Fill the " +
          "fields in by hand instead.",
      );
      return;
    }
    setAnswers((prev) => ({ ...prev, ...parsed }));
    setParseNote(
      `Read ${matched.length} field${matched.length === 1 ? "" : "s"}: ` +
        matched.map((k) => LABELS[k] ?? k).join(", ") +
        ". Check them against the original before you go on.",
    );
  }

  async function handleCreate() {
    setBusy(true);
    setError(null);
    try {
      // Creating a job does not generate anything — the service requires a
      // separate, deliberate act for that. This is the review step existing.
      const created = await api.createJob(connection, answers);
      onCreated(created.job);
      setAnswers(EMPTY);
      setPasted("");
      setParseNote(null);
    } catch (err) {
      setError(err instanceof ServiceError ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <Panel
        title="Paste what they sent"
        subtitle="The summary from the Create flow, straight out of the email."
      >
        <TextArea
          value={pasted}
          onChange={(e) => setPasted(e.target.value)}
          placeholder={"Their name:\nBuddy\n\nNever want to forget:\nHe never once slept in the bed we bought him…"}
          className="min-h-40 font-mono text-[0.8125rem]"
          aria-label="Pasted summary"
        />
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <Button variant="outline" onClick={handleParse} disabled={!pasted.trim()}>
            Read the fields
          </Button>
          {parseNote ? (
            <p className="max-w-lg text-[0.8125rem] leading-relaxed text-muted">{parseNote}</p>
          ) : null}
        </div>
      </Panel>

      <Panel
        title="Their answers"
        subtitle="Only their name and one memory are required — the same three the form asks for."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Their name">
            <TextInput
              value={answers.petName}
              onChange={(e) => set("petName")(e.target.value)}
              placeholder="Buddy"
              maxLength={80}
            />
          </Field>

          <Field label="Dog, cat or other">
            <div className="flex gap-2">
              {["dog", "cat", "other"].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => set("species")(value)}
                  className={
                    "flex-1 rounded-[3px] border px-3 py-2.5 text-[0.875rem] capitalize transition-colors duration-200 " +
                    (answers.species === value
                      ? "border-rose-deep text-ink"
                      : "border-line text-muted hover:border-ink/40")
                  }
                >
                  {value}
                </button>
              ))}
            </div>
          </Field>
        </div>

        <div className="mt-5 space-y-5">
          <Field
            label="What you never want to forget"
            hint="The verses are built almost entirely from this. Specific beats general."
          >
            <TextArea
              value={answers.memories}
              onChange={(e) => set("memories")(e.target.value)}
              placeholder="He never once slept in the bed we bought him. Always the laundry basket, right on the warm clothes."
              maxLength={900}
            />
          </Field>

          <Field label="About them">
            <TextArea
              value={answers.about ?? ""}
              onChange={(e) => set("about")(e.target.value)}
              maxLength={900}
            />
          </Field>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="What they were like" hint="Tints the caption.">
              <TextInput
                value={answers.personality ?? ""}
                onChange={(e) => set("personality")(e.target.value)}
                placeholder="Gentle, stubborn, always hungry"
                maxLength={160}
              />
            </Field>

            <Field label="Preferred sound">
              <select
                value={answers.style ?? ""}
                onChange={(e) => set("style")(e.target.value)}
                className="w-full rounded-[3px] border border-line bg-page px-3 py-2.5 text-[0.9375rem] text-ink focus:border-rose-deep focus:outline-none"
              >
                <option value="">Not stated — we choose</option>
                {STYLES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field
            label="To include or avoid"
            hint="Names here go in the bridge. Anything they asked you to leave out is flagged before you generate."
          >
            <TextArea
              value={answers.include ?? ""}
              onChange={(e) => set("include")(e.target.value)}
              placeholder="Please include my daughter Ellie. And please don't mention the illness."
              maxLength={600}
            />
          </Field>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Their name (the owner)">
              <TextInput
                value={answers.yourName ?? ""}
                onChange={(e) => set("yourName")(e.target.value)}
              />
            </Field>
            <Field label="Email" hint="Stored, never returned by the API.">
              <TextInput
                type="email"
                value={answers.email ?? ""}
                onChange={(e) => set("email")(e.target.value)}
              />
            </Field>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-5 border-t border-line-soft pt-6">
          <Button onClick={handleCreate} disabled={busy || missing.length > 0}>
            {busy ? "Building the brief…" : "Build the brief"}
          </Button>

          {missing.length > 0 ? (
            <p className="text-[0.8125rem] text-muted">
              Still need {missing.join(" and ")}.
            </p>
          ) : (
            <p className="text-[0.8125rem] text-muted">
              This writes the lyrics and caption. It does not generate audio yet.
            </p>
          )}
        </div>

        {error ? (
          <ul className="mt-5 space-y-2">
            <Warning>{error}</Warning>
          </ul>
        ) : null}
      </Panel>

      <ul className="space-y-1.5">
        <Note>
          Nothing here is sent to the music model until you press Generate on the
          next screen. The brief is the thing you review.
        </Note>
      </ul>
    </div>
  );
}
