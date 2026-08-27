"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Panel, Field, TextInput, CodeArea, Warning, Note, Meta, StatusDot } from "./ui";
import StudioPlayer from "./StudioPlayer";
import {
  api,
  ServiceError,
  type Connection,
  type Job,
  type SongBrief,
} from "@/lib/studio";

/**
 * One song, from brief to finished take.
 *
 * The shape of this screen is the argument the whole service is built on: the
 * caption and lyrics are editable, and generation is a button you press
 * afterwards. Nothing reaches the model that a human has not read.
 *
 * That is not process for its own sake. The lyric draft is assembled from the
 * owner's own sentences with one invented chorus, and the invented part is the
 * part that repeats four times. Reading it takes twenty seconds. Sending an
 * unreviewed song to someone two days after they lost their dog is not
 * recoverable.
 */

const POLL_MS = 3_000;

export default function JobPanel({
  connection,
  job: initialJob,
  warnings,
  notes,
  unusedLines,
  onBack,
  onChanged,
}: {
  connection: Connection;
  job: Job;
  warnings?: string[];
  notes?: string[];
  unusedLines?: { text: string; syllables: number; score: number; source: string }[];
  onBack: () => void;
  onChanged?: (job: Job) => void;
}) {
  const [job, setJob] = useState<Job>(initialJob);
  const [draft, setDraft] = useState<SongBrief>(initialJob.brief);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [selectedTake, setSelectedTake] = useState<string | null>(null);
  const objectUrl = useRef<string | null>(null);

  // A different job selected in the list is a different screen, not an update.
  useEffect(() => {
    setJob(initialJob);
    setDraft(initialJob.brief);
    setSelectedTake(null);
    setError(null);
  }, [initialJob.id]);

  const working = job.status === "queued" || job.status === "generating";

  const refresh = useCallback(async () => {
    try {
      const { job: fresh } = await api.getJob(connection, job.id);
      setJob(fresh);
      onChanged?.(fresh);
      // Don't clobber edits in progress; only adopt the server's brief when
      // there is nothing local to lose.
      setDraft((prev) => (prev === initialJob.brief ? fresh.brief : prev));
    } catch (err) {
      setError(err instanceof ServiceError ? err.message : String(err));
    }
  }, [connection, job.id, initialJob.brief, onChanged]);

  // Poll only while there is something to wait for.
  useEffect(() => {
    if (!working) return;
    const timer = setInterval(refresh, POLL_MS);
    return () => clearInterval(timer);
  }, [working, refresh]);

  const takeToLoad = selectedTake ?? job.result?.audioFile ?? null;

  // Fetch audio with the auth header, hand the player an object URL, and revoke
  // the previous one. Without the revoke this leaks a few megabytes per take.
  useEffect(() => {
    if (!takeToLoad || job.status !== "ready") {
      setAudioUrl(null);
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const url = await api.audioBlobUrl(connection, job.id, takeToLoad);
        if (cancelled) {
          URL.revokeObjectURL(url);
          return;
        }
        if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
        objectUrl.current = url;
        setAudioUrl(url);
      } catch (err) {
        setError(err instanceof ServiceError ? err.message : String(err));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [connection, job.id, takeToLoad, job.status]);

  useEffect(
    () => () => {
      if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    },
    [],
  );

  async function handleGenerate() {
    setBusy(true);
    setError(null);
    try {
      const { job: fresh } = await api.generate(connection, job.id, draft);
      setJob(fresh);
      onChanged?.(fresh);
    } catch (err) {
      setError(
        err instanceof ServiceError
          ? [err.message, ...(Array.isArray(err.detail) ? err.detail : [])].join(" ")
          : String(err),
      );
    } finally {
      setBusy(false);
    }
  }

  const edited = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(job.brief),
    [draft, job.brief],
  );

  const failedAttempts = job.attempts.filter((a) => !a.ok);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="text-[0.875rem] text-muted transition-colors duration-200 hover:text-ink"
        >
          ← All songs
        </button>
        <div className="flex items-center gap-2 text-[0.8125rem]">
          <StatusDot
            tone={
              job.status === "ready"
                ? "ok"
                : working
                  ? "busy"
                  : job.status === "failed"
                    ? "bad"
                    : "idle"
            }
          />
          <span className="text-muted">
            {job.status === "ready"
              ? `Take ${job.take} ready`
              : job.status === "generating"
                ? `Generating take ${job.take}…`
                : job.status === "queued"
                  ? "Queued"
                  : "Failed"}
          </span>
        </div>
      </div>

      {warnings && warnings.length > 0 ? (
        <Panel title="Read these first" subtitle="Every one is something a human has to judge.">
          <ul className="space-y-3">
            {warnings.map((w) => (
              <Warning key={w}>{w}</Warning>
            ))}
          </ul>
        </Panel>
      ) : null}

      {job.status === "ready" && job.result ? (
        <Panel
          title={job.brief.title}
          subtitle={`${job.answers.petName} · take ${job.take} · ${job.result.approxDurationSeconds}s`}
          actions={
            <a
              href={`${connection.baseUrl}/jobs/${job.id}/audio/${job.result.audioFile}`}
              onClick={(e) => {
                // The download endpoint needs a header, so do it through fetch
                // and a temporary anchor rather than letting the browser navigate.
                e.preventDefault();
                void (async () => {
                  const url = await api.audioBlobUrl(connection, job.id, job.result!.audioFile);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${job.answers.petName} - ${job.brief.title}.${job.result!.format}`;
                  a.click();
                  URL.revokeObjectURL(url);
                })();
              }}
              className="text-[0.875rem] text-rose-deep underline decoration-rose-deep/35 underline-offset-4 hover:decoration-rose-deep"
            >
              Download
            </a>
          }
        >
          {audioUrl ? (
            <StudioPlayer
              id={`${job.id}-${takeToLoad}`}
              pet={job.answers.petName}
              title={job.brief.title}
              src={audioUrl}
              seed={job.result.seed}
              length={job.result.approxDurationSeconds}
            />
          ) : (
            <p className="text-[0.875rem] text-muted">Loading the audio…</p>
          )}

          {job.takes.length > 1 ? (
            <div className="mt-6 border-t border-line-soft pt-5">
              <p className="label">Takes</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {job.takes.map((take) => (
                  <button
                    key={take}
                    onClick={() => setSelectedTake(take)}
                    className={
                      "rounded-[3px] border px-3 py-1.5 text-[0.8125rem] tabular-nums transition-colors duration-200 " +
                      (take === takeToLoad
                        ? "border-rose-deep text-ink"
                        : "border-line text-muted hover:border-ink/40")
                    }
                  >
                    {take.replace(/\.\w+$/, "").replace("take-", "Take ")}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-[0.8125rem] text-muted">
                Every take is kept. Take three is often better than take five.
              </p>
            </div>
          ) : null}

          <div className="mt-6 border-t border-line-soft pt-5">
            <Meta
              items={[
                ["Length", `${job.result.approxDurationSeconds}s (asked for ${job.brief.durationSeconds}s)`],
                ["Size", `${(job.result.bytes / 1_048_576).toFixed(1)} MB ${job.result.format}`],
                ["Model", job.result.provider],
                ["Attempts", String(job.attempts.length)],
              ]}
            />
          </div>
        </Panel>
      ) : null}

      {job.status === "failed" ? (
        <Panel title="This one failed" subtitle="The brief is intact. Nothing was lost.">
          <ul className="space-y-3">
            <Warning>{job.error}</Warning>
          </ul>
        </Panel>
      ) : null}

      <Panel
        title="The brief"
        subtitle="What the model is given. Edit it, then generate."
        actions={
          <Button onClick={handleGenerate} disabled={busy || working}>
            {working
              ? "Generating…"
              : busy
                ? "Sending…"
                : job.take > 0
                  ? `Generate take ${job.take + 1}`
                  : "Generate"}
          </Button>
        }
      >
        <div className="space-y-5">
          <Field label="Title" hint="Filenames and the player. Not sent to the model.">
            <TextInput
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            />
          </Field>

          <Field
            label="Caption"
            hint="Style, instruments, voice, room. The model weights this more heavily than the lyrics. Keep tempo and key out of it — they have their own fields."
          >
            <CodeArea
              value={draft.caption}
              onChange={(e) => setDraft({ ...draft, caption: e.target.value })}
              rows={4}
            />
          </Field>

          <Field
            label="Lyrics"
            hint="Sent verbatim. Section tags matter. Six to ten syllables a line sings best."
          >
            <CodeArea
              value={draft.lyrics}
              onChange={(e) => setDraft({ ...draft, lyrics: e.target.value })}
              rows={22}
            />
          </Field>

          <div className="grid gap-5 md:grid-cols-4">
            <Field label="Length (s)">
              <TextInput
                type="number"
                min={10}
                max={600}
                value={draft.durationSeconds}
                onChange={(e) =>
                  setDraft({ ...draft, durationSeconds: Number(e.target.value) || 0 })
                }
              />
            </Field>
            <Field label="BPM">
              <TextInput
                type="number"
                min={30}
                max={300}
                value={draft.bpm ?? ""}
                onChange={(e) => setDraft({ ...draft, bpm: Number(e.target.value) || undefined })}
              />
            </Field>
            <Field label="Key">
              <TextInput
                value={draft.keyScale ?? ""}
                onChange={(e) => setDraft({ ...draft, keyScale: e.target.value })}
              />
            </Field>
            <Field label="Time signature">
              <TextInput
                value={draft.timeSignature ?? ""}
                onChange={(e) => setDraft({ ...draft, timeSignature: e.target.value })}
              />
            </Field>
          </div>
        </div>

        {edited ? (
          <p className="mt-5 text-[0.8125rem] text-muted">
            Edited. Generating will save these changes as the brief.
          </p>
        ) : null}

        {error ? (
          <ul className="mt-5 space-y-2">
            <Warning>{error}</Warning>
          </ul>
        ) : null}
      </Panel>

      {unusedLines && unusedLines.length > 0 ? (
        <Panel
          title="Their words you haven't used"
          subtitle="Lines found in their answers that didn't make the draft. Better than anything either of us would invent."
        >
          <ul className="space-y-2">
            {unusedLines.map((line) => (
              <li key={line.text} className="flex items-baseline gap-3 text-[0.875rem]">
                <span className="w-12 shrink-0 text-right tabular-nums text-muted">
                  {line.syllables} syl
                </span>
                <span className="text-ink">{line.text}</span>
              </li>
            ))}
          </ul>
        </Panel>
      ) : null}

      {failedAttempts.length > 0 ? (
        <Panel
          title="Attempts"
          subtitle="The free endpoint fails often. This is the queue riding it out."
        >
          <ul className="space-y-2 font-mono text-[0.75rem] leading-relaxed">
            {job.attempts.map((attempt, i) => (
              <li key={attempt.startedAt + i} className="flex flex-wrap gap-x-4 text-muted">
                <span className="tabular-nums">{i + 1}.</span>
                <span className={attempt.ok ? "text-rose-deep" : "text-ink"}>
                  {attempt.ok ? "ok" : `HTTP ${attempt.status || "—"}`}
                </span>
                <span className="tabular-nums">{(attempt.ms / 1000).toFixed(1)}s</span>
                {attempt.error ? <span className="basis-full">{attempt.error}</span> : null}
              </li>
            ))}
          </ul>
        </Panel>
      ) : null}

      {notes && notes.length > 0 ? (
        <Panel title="How this brief was built" subtitle="Every decision the draft made, and why.">
          <ul className="space-y-1.5">
            {notes.map((note) => (
              <Note key={note}>{note}</Note>
            ))}
          </ul>
        </Panel>
      ) : null}

      {job.status === "ready" && job.result ? (
        <Panel
          title="Publishing it to the site"
          subtitle="If this one is going on the public page, paste this into ALL_SONGS in lib/content.ts."
        >
          <CodeArea
            readOnly
            rows={11}
            value={publishSnippet(job)}
            onFocus={(e) => e.currentTarget.select()}
          />
          <ul className="mt-4 space-y-1.5">
            <Note>
              Copy the audio into <code>public/songs/</code> first — the site is a
              static export and cannot read from the service at build time.
            </Note>
            <Note>
              A real customer&rsquo;s song only goes on the page with their written
              permission. The examples currently on the site say they are
              demonstrations; don&rsquo;t quietly swap one for the real thing.
            </Note>
          </ul>
        </Panel>
      ) : null}
    </div>
  );
}

/**
 * The `Song` literal for lib/content.ts.
 *
 * Emitted rather than described because the fields are fiddly and one of them —
 * `seed` — has no meaning the operator could guess. It drives the site's
 * waveform, which is drawn from the integer rather than from the audio, so it has
 * to be carried across from the job or the shape changes on every deploy.
 */
function publishSnippet(job: Job): string {
  const id = job.answers.petName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const line = (job.answers.about ?? job.answers.memories ?? "")
    .split(/(?<=[.!?])\s+/)[0]
    ?.trim()
    .slice(0, 90);

  return `{
  id: ${JSON.stringify(id)},
  pet: ${JSON.stringify(job.answers.petName)},
  title: ${JSON.stringify(job.brief.title)},
  photo: ${JSON.stringify(id)}, // add a matching entry to PHOTOS first
  line: ${JSON.stringify(line ?? "")},
  src: ${JSON.stringify(`/songs/${id}.${job.result?.format ?? "mp3"}`)},
  seed: ${job.result?.seed ?? 0},
  length: ${Math.round(job.result?.approxDurationSeconds ?? 0)},
}`;
}
