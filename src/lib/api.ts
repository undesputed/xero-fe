import type {
  ApproveResponse,
  ChannelRecord,
  IngestSessionResponse,
  SessionDetail,
  SessionSummary,
  Settlement,
} from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, init);
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`API ${res.status}: ${detail}`);
  }
  return res.json() as Promise<T>;
}

// ── Ingest ────────────────────────────────────────────────────────────────────

/** Upload a ManoMano settlement CSV. Returns a pending session with a preview. */
export async function ingestManoMano(
  file: File,
  settlementRef?: string,
): Promise<IngestSessionResponse> {
  const form = new FormData();
  form.append("file", file);
  const url = settlementRef
    ? `/ingest/manomano?settlement_ref=${encodeURIComponent(settlementRef)}`
    : "/ingest/manomano";
  return apiFetch<IngestSessionResponse>(url, { method: "POST", body: form });
}

// ── Sessions ──────────────────────────────────────────────────────────────────

/** List all sessions, newest first. Pass channel to filter to a specific channel. */
export async function listSessions(channel?: string): Promise<SessionSummary[]> {
  const url = channel
    ? `/ingest/sessions?channel=${encodeURIComponent(channel)}`
    : "/ingest/sessions";
  return apiFetch<SessionSummary[]>(url).catch(() => []);
}

/** Retrieve session status, preview, and Xero results. */
export async function getSession(sessionId: string): Promise<SessionDetail> {
  return apiFetch<SessionDetail>(`/ingest/sessions/${encodeURIComponent(sessionId)}`);
}

/** Approve a pending session — pushes all documents to Xero. */
export async function approveSession(sessionId: string): Promise<ApproveResponse> {
  return apiFetch<ApproveResponse>(
    `/ingest/sessions/${encodeURIComponent(sessionId)}/approve`,
    { method: "POST" },
  );
}

/** Decline a pending session — marks it as declined; file remains in S3. */
export async function declineSession(sessionId: string): Promise<{ status: string }> {
  return apiFetch<{ status: string }>(
    `/ingest/sessions/${encodeURIComponent(sessionId)}/decline`,
    { method: "POST" },
  );
}

/** Re-run a session — re-parses the stored file and returns a new pending session. */
export async function rerunSession(sessionId: string): Promise<IngestSessionResponse> {
  return apiFetch<IngestSessionResponse>(
    `/ingest/sessions/${encodeURIComponent(sessionId)}/rerun`,
    { method: "POST" },
  );
}

// ── Channels ──────────────────────────────────────────────────────────────────

export async function getChannels(): Promise<ChannelRecord[]> {
  return apiFetch<ChannelRecord[]>("/channels").catch(() => []);
}

export async function getChannel(channel: string): Promise<ChannelRecord | null> {
  return apiFetch<ChannelRecord>(`/channels/${encodeURIComponent(channel)}`).catch(() => null);
}

// ── Settlements (future persistence) ─────────────────────────────────────────

export async function getSettlements(): Promise<Settlement[]> {
  // Phase 1: returns empty list until BE persistence is added
  return apiFetch<Settlement[]>("/settlements").catch(() => []);
}

export async function getSettlement(ref: string): Promise<Settlement | null> {
  return apiFetch<Settlement>(`/settlements/${encodeURIComponent(ref)}`).catch(() => null);
}
