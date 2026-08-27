"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Panel, Field, TextInput, Warning, StatusDot } from "./ui";
import Intake from "./Intake";
import JobPanel from "./JobPanel";
import {
  api,
  loadConnection,
  saveConnection,
  clearConnection,
  DEFAULT_BASE_URL,
  ServiceError,
  type BriefEnvelope,
  type Connection,
  type Job,
  type ServiceStatus,
} from "@/lib/studio";

/**
 * The operator's console.
 *
 * Everything here runs in the browser, because the site is a static export with
 * no server of its own. That is fine: this page holds no secret of its own and
 * does nothing without a token the operator types in. The security boundary is the
 * song service, which checks that token on every request — not this page, which
 * is inert without it.
 *
 * The ACE endpoint itself cannot be called from a browser at all: it sends no
 * CORS headers and its preflight doesn't answer. The song service exists partly
 * to be the thing a page is allowed to talk to.
 */
export default function StudioConsole() {
  const [connection, setConnection] = useState<Connection | null>(null);
  // Nothing may render from localStorage until after mount, or the server-rendered
  // HTML and the first client render disagree and React throws away the tree.
  const [hydrated, setHydrated] = useState(false);

  const [status, setStatus] = useState<ServiceStatus | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selected, setSelected] = useState<Job | null>(null);
  const [envelope, setEnvelope] = useState<BriefEnvelope | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setConnection(loadConnection());
    setHydrated(true);
  }, []);

  const load = useCallback(
    async (c: Connection) => {
      setError(null);
      try {
        const [s, j] = await Promise.all([api.status(c), api.listJobs(c)]);
        setStatus(s);
        setJobs(j.jobs);
      } catch (err) {
        setError(err instanceof ServiceError ? err.message : String(err));
        setStatus(null);
      }
    },
    [],
  );

  useEffect(() => {
    if (!connection) return;
    void load(connection);
    // The queue is shared, so the list can change without this tab doing
    // anything. Cheap poll; the service answers /jobs from disk in under a
    // millisecond.
    const timer = setInterval(() => void load(connection), 15_000);
    return () => clearInterval(timer);
  }, [connection, load]);

  if (!hydrated) {
    return <p className="text-[0.875rem] text-muted">Loading…</p>;
  }

  if (!connection) {
    return <Connect onConnect={setConnection} />;
  }

  return (
    <div className="space-y-8">
      <ServiceStrip
        connection={connection}
        status={status}
        error={error}
        onForget={() => {
          clearConnection();
          setConnection(null);
          setStatus(null);
          setJobs([]);
          setSelected(null);
        }}
      />

      {selected ? (
        <JobPanel
          connection={connection}
          job={selected}
          warnings={envelope?.job.id === selected.id ? envelope.warnings : undefined}
          notes={envelope?.job.id === selected.id ? envelope.notes : undefined}
          unusedLines={envelope?.job.id === selected.id ? envelope.unusedLines : undefined}
          onBack={() => {
            setSelected(null);
            void load(connection);
          }}
          onChanged={(fresh) => {
            setSelected(fresh);
            setJobs((prev) => prev.map((j) => (j.id === fresh.id ? fresh : j)));
          }}
        />
      ) : (
        <>
          {jobs.length > 0 ? <JobList jobs={jobs} onSelect={setSelected} /> : null}
          <Intake
            connection={connection}
            onCreated={(job) => {
              // Hold the envelope: warnings, notes and the unused lines are
              // returned once at creation and are the most useful thing on the
              // review screen. Refetching a job doesn't bring them back.
              setSelected(job);
              setJobs((prev) => [job, ...prev]);
            }}
          />
        </>
      )}
    </div>
  );
}

function Connect({ onConnect }: { onConnect: (c: Connection) => void }) {
  const [baseUrl, setBaseUrl] = useState(DEFAULT_BASE_URL);
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConnect() {
    setBusy(true);
    setError(null);
    const candidate: Connection = { baseUrl: baseUrl.replace(/\/+$/, ""), token: token.trim() };
    try {
      // Prove the token works before storing it, so a typo surfaces here rather
      // than as a wall of 401s later.
      await api.status(candidate);
      saveConnection(candidate);
      onConnect(candidate);
    } catch (err) {
      setError(err instanceof ServiceError ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Panel
      title="Connect to the song service"
      subtitle="Kept in this browser. Never in the build — a static export publishes its env vars to anyone who views source."
    >
      <div className="max-w-xl space-y-5">
        <Field label="Service URL" hint="Where tails-song-api is running.">
          <TextInput
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="http://localhost:8787"
            autoComplete="off"
          />
        </Field>

        <Field
          label="Operator token"
          hint="OPERATOR_TOKEN from the service's environment. Leave blank if the service doesn't have one set."
        >
          <TextInput
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            autoComplete="off"
            placeholder="none"
            onKeyDown={(e) => {
              if (e.key === "Enter") void handleConnect();
            }}
          />
        </Field>

        {/* Not disabled on an empty token: a service without OPERATOR_TOKEN set
            is open, and requiring one here would make it unreachable. */}
        <Button onClick={handleConnect} disabled={busy}>
          {busy ? "Checking…" : "Connect"}
        </Button>

        {error ? (
          <ul className="space-y-2">
            <Warning>{error}</Warning>
          </ul>
        ) : null}
      </div>
    </Panel>
  );
}

function ServiceStrip({
  connection,
  status,
  error,
  onForget,
}: {
  connection: Connection;
  status: ServiceStatus | null;
  error: string | null;
  onForget: () => void;
}) {
  return (
    <div className="rounded-[3px] border border-line bg-raise/40 px-5 py-4">
      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.8125rem]">
          <span className="flex items-center gap-2">
            <StatusDot tone={status?.provider.ok ? "ok" : "bad"} />
            <span className="text-ink">{status?.provider.provider ?? "service"}</span>
          </span>

          {status ? (
            <>
              <span className="text-muted">
                queue {status.queue.depth}
                {status.queue.current ? ` · running ${status.queue.current}` : ""}
              </span>
              {/*
                Surfaced because it is the single setting that decides whether
                songs come back or every job times out. Measured: thinking off
                generates a three-minute song in about twenty seconds; thinking on
                returns 504 at the sixty-second gateway limit.
              */}
              {status.thinking ? (
                <span className="text-ink">
                  thinking on — expect timeouts on the hosted endpoint
                </span>
              ) : null}
              {/* An open service should be visible while you work, not only in a
                  boot log nobody re-reads. */}
              {status.auth === "open" ? (
                <span className="border-l-2 border-rose pl-2 text-ink">
                  no token — anyone with this URL can read every customer&rsquo;s answers
                </span>
              ) : null}
            </>
          ) : null}

          <span className="text-muted">{connection.baseUrl}</span>
        </div>

        <button
          onClick={onForget}
          className="text-[0.8125rem] text-muted underline decoration-muted/30 underline-offset-4 transition-colors duration-200 hover:text-ink"
        >
          Disconnect
        </button>
      </div>

      {status?.provider.detail ? (
        <p className="mt-3 border-t border-line-soft pt-3 text-[0.75rem] leading-relaxed text-muted">
          {status.provider.detail}
        </p>
      ) : null}

      {error ? (
        <ul className="mt-3 space-y-2">
          <Warning>{error}</Warning>
        </ul>
      ) : null}
    </div>
  );
}

function JobList({ jobs, onSelect }: { jobs: Job[]; onSelect: (job: Job) => void }) {
  return (
    <Panel title="Songs" subtitle={`${jobs.length} in the store.`}>
      <ul className="divide-y divide-line-soft">
        {jobs.map((job) => (
          <li key={job.id}>
            <button
              onClick={() => onSelect(job)}
              className="flex w-full flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3 text-left transition-colors duration-200 hover:text-rose-deep"
            >
              <span className="flex items-baseline gap-3">
                <StatusDot
                  tone={
                    job.status === "ready"
                      ? "ok"
                      : job.status === "failed"
                        ? "bad"
                        : job.status === "generating"
                          ? "busy"
                          : "idle"
                  }
                />
                <span className="font-display text-[1.125rem] text-ink">{job.answers.petName}</span>
                <span className="text-[0.875rem] text-muted">{job.brief.title}</span>
              </span>
              <span className="text-[0.75rem] tabular-nums text-muted">
                {job.status === "ready" ? `take ${job.take}` : job.status} ·{" "}
                {new Date(job.createdAt).toLocaleDateString()}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
