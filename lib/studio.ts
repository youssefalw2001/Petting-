/**
 * The client for tails-song-api, plus the parser that saves the operator from
 * retyping a customer's answers.
 *
 * The site is a static export with no server of its own, so the studio page talks
 * to the song service straight from the browser. That is only possible because
 * the service sets CORS for this origin — the ACE endpoint underneath does not,
 * and cannot be called from a page at all.
 */

import { LABELS } from "./questions";

// --- shapes, mirroring the service ------------------------------------------

export type Answers = {
  petName: string;
  species?: string;
  about?: string;
  personality?: string;
  memories: string;
  include?: string;
  style?: string;
  yourName?: string;
  email?: string;
};

export type SongBrief = {
  title: string;
  caption: string;
  lyrics: string;
  durationSeconds: number;
  bpm?: number;
  keyScale?: string;
  timeSignature?: string;
  vocalLanguage: string;
};

export type JobAttempt = {
  startedAt: string;
  endedAt: string;
  ok: boolean;
  status: number;
  ms: number;
  error?: string;
};

export type JobResult = {
  audioFile: string;
  format: string;
  bytes: number;
  approxDurationSeconds: number;
  provider: string;
  providerId: string | null;
  seed: number;
  finishedAt: string;
};

export type Job = {
  id: string;
  status: "queued" | "generating" | "ready" | "failed";
  createdAt: string;
  updatedAt: string;
  take: number;
  brief: SongBrief;
  result?: JobResult;
  error?: string;
  attempts: JobAttempt[];
  takes: string[];
  answers: Omit<Answers, "email">;
  hasEmail: boolean;
};

export type BriefEnvelope = {
  job: Job;
  warnings: string[];
  notes: string[];
  unusedLines: { text: string; syllables: number; score: number; source: string }[];
  problems: string[];
  queued?: boolean;
};

export type ServiceStatus = {
  provider: { ok: boolean; provider: string; detail: string; models?: string[] };
  queue: { depth: number; current: string | null; running: boolean };
  thinking: boolean;
  /** "open" means the service has no OPERATOR_TOKEN set and accepts anyone. */
  auth?: "open" | "token";
};

// --- connection -------------------------------------------------------------

/**
 * Where the service lives, and who you are.
 *
 * Both are held in the browser rather than baked into the build. The base URL is
 * a runtime value because the operator will often run the service on localhost
 * while the page itself is served from GitHub Pages, and a static export freezes
 * env vars at build time. The token is a runtime value because a static export
 * publishes its env vars to anyone who views source.
 */
/** `token` may be empty — the service treats an unset OPERATOR_TOKEN as open. */
export type Connection = { baseUrl: string; token: string };

const STORAGE_KEY = "tails-studio-connection";

export const DEFAULT_BASE_URL =
  process.env.NEXT_PUBLIC_SONG_API_URL?.replace(/\/+$/, "") || "http://localhost:8787";

/**
 * Persisted in localStorage rather than sessionStorage, deliberately.
 *
 * sessionStorage is the more cautious choice and it was the first instinct here.
 * It is also worse in practice: a 64-character token that has to be re-pasted
 * every time a tab closes is a token that ends up hardcoded in a file somewhere
 * "just for now". Persisting it with an obvious way to clear it is the option
 * that survives contact with a real working day. The trade is real — anything
 * running script on this origin can read it — which is why the token only ever
 * authorises this one service, and why "Forget token" is in the header rather
 * than buried.
 */
export function loadConnection(): Connection | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Connection>;
    // Only the URL is required. A blank token is a valid connection to a service
    // running without OPERATOR_TOKEN set.
    if (!parsed.baseUrl) return null;
    return { baseUrl: parsed.baseUrl, token: parsed.token ?? "" };
  } catch {
    return null;
  }
}

export function saveConnection(connection: Connection): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(connection));
}

export function clearConnection(): void {
  window.localStorage.removeItem(STORAGE_KEY);
}

// --- client -----------------------------------------------------------------

export class ServiceError extends Error {
  readonly status: number;
  readonly detail?: unknown;

  constructor(status: number, message: string, detail?: unknown) {
    super(message);
    this.name = "ServiceError";
    this.status = status;
    this.detail = detail;
  }
}

async function request<T>(
  connection: Connection,
  path: string,
  init: RequestInit = {},
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${connection.baseUrl}${path}`, {
      ...init,
      headers: {
        // Omitted entirely when there is no token, rather than sent as an empty
        // `Bearer `. A header that looks like a credential and isn't one is the
        // kind of thing that makes an auth bug take an afternoon.
        ...(connection.token ? { Authorization: `Bearer ${connection.token}` } : {}),
        ...(init.body ? { "Content-Type": "application/json" } : {}),
        ...(init.headers ?? {}),
      },
    });
  } catch {
    // A failed fetch to a cross-origin service is almost always one of three
    // things, and the browser refuses to say which. Naming all three is more
    // useful than "Failed to fetch".
    throw new ServiceError(
      0,
      `Could not reach ${connection.baseUrl}. Either the service isn't running, ` +
        `the URL is wrong, or this page's origin isn't in the service's ALLOWED_ORIGINS.`,
    );
  }

  if (res.status === 401) {
    throw new ServiceError(401, "The service rejected that operator token.");
  }

  const text = await res.text();
  let body: unknown = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    /* fall through to the status-based message */
  }

  if (!res.ok) {
    const payload = body as { error?: string; detail?: unknown } | null;
    throw new ServiceError(
      res.status,
      payload?.error ?? `The service returned HTTP ${res.status}.`,
      payload?.detail,
    );
  }

  return body as T;
}

export const api = {
  status: (c: Connection) => request<ServiceStatus>(c, "/status"),

  listJobs: (c: Connection) =>
    request<{ jobs: Job[]; queue: ServiceStatus["queue"] }>(c, "/jobs"),

  getJob: (c: Connection, id: string) => request<{ job: Job }>(c, `/jobs/${id}`),

  /** Build a brief without creating anything. Costs nothing, generates nothing. */
  previewBrief: (c: Connection, answers: Answers) =>
    request<Omit<BriefEnvelope, "job"> & { brief: SongBrief }>(c, "/brief", {
      method: "POST",
      body: JSON.stringify(answers),
    }),

  createJob: (c: Connection, answers: Answers) =>
    request<BriefEnvelope>(c, "/jobs", { method: "POST", body: JSON.stringify(answers) }),

  generate: (c: Connection, id: string, brief: Partial<SongBrief>) =>
    request<{ job: Job }>(c, `/jobs/${id}/generate`, {
      method: "POST",
      body: JSON.stringify({ brief }),
    }),

  /**
   * Audio has to come through fetch rather than straight into `<audio src>`,
   * because the endpoint needs an Authorization header and an audio element
   * cannot send one. The alternative — a token in the query string — would put it
   * in browser history and every access log on the way.
   */
  async audioBlobUrl(c: Connection, id: string, take?: string): Promise<string> {
    const path = take ? `/jobs/${id}/audio/${take}` : `/jobs/${id}/audio`;
    const res = await fetch(`${c.baseUrl}${path}`, {
      headers: { Authorization: `Bearer ${c.token}` },
    });
    if (!res.ok) throw new ServiceError(res.status, `Could not load the audio (HTTP ${res.status}).`);
    return URL.createObjectURL(await res.blob());
  },
};

// --- parsing what the customer actually sent --------------------------------

/** Label -> field id, the reverse of what the Create flow writes. */
const FIELD_BY_LABEL = new Map<string, string>(
  Object.entries(LABELS).map(([key, label]) => [label.toLowerCase(), key]),
);

/**
 * Turn a pasted summary back into answers.
 *
 * With no form endpoint configured, the Create flow falls back to showing the
 * customer a formatted summary and inviting them to email it. That means the
 * realistic input to this whole service is a block of text in an inbox, not a
 * tidy JSON payload — so being able to paste the email and get the fields back
 * is the difference between using the studio and retyping someone's grief into a
 * form.
 *
 * Parses by looking for lines that are exactly a known label followed by a colon,
 * and taking everything up to the next one. Splitting on blank lines would be
 * simpler and would break the moment someone's paragraph about their dog contains
 * one, which it will.
 */
export function parseSummary(text: string): { answers: Partial<Answers>; matched: string[] } {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const answers: Record<string, string> = {};
  const matched: string[] = [];

  let currentField: string | null = null;
  let buffer: string[] = [];

  const flush = () => {
    if (currentField) {
      const value = buffer.join("\n").trim();
      if (value) {
        answers[currentField] = value;
        matched.push(currentField);
      }
    }
    buffer = [];
  };

  for (const line of lines) {
    const heading = /^\s*([A-Za-z][A-Za-z /']{2,40}):\s*$/.exec(line);
    const field = heading ? FIELD_BY_LABEL.get(heading[1]!.trim().toLowerCase()) : undefined;

    if (field) {
      flush();
      currentField = field;
      continue;
    }

    // Some mail clients reflow "Label: value" onto one line.
    const inline = /^\s*([A-Za-z][A-Za-z /']{2,40}):\s+(.+)$/.exec(line);
    if (inline) {
      const inlineField = FIELD_BY_LABEL.get(inline[1]!.trim().toLowerCase());
      if (inlineField) {
        flush();
        answers[inlineField] = inline[2]!.trim();
        matched.push(inlineField);
        currentField = null;
        continue;
      }
    }

    if (currentField) buffer.push(line);
  }
  flush();

  // `species` and `style` are constrained sets in the form; normalise what the
  // summary shows back into the values the service expects.
  if (answers.species) {
    const s = answers.species.toLowerCase();
    answers.species = s.includes("dog") ? "dog" : s.includes("cat") ? "cat" : "other";
  }
  if (answers.style) {
    const s = answers.style.toLowerCase();
    answers.style =
      s.includes("piano") ? "piano"
      : s.includes("folk") ? "folk"
      : s.includes("country") ? "country"
      : s.includes("acoustic") ? "acoustic"
      : "unsure";
  }

  // photoNames is in the summary but is not an input to the song.
  delete answers.photoNames;

  return { answers: answers as Partial<Answers>, matched };
}

/** What's still missing before the service will accept it. */
export function missingRequired(answers: Partial<Answers>): string[] {
  const missing: string[] = [];
  if (!answers.petName?.trim()) missing.push("their name");
  if (!answers.memories?.trim()) missing.push("what you never want to forget");
  return missing;
}
