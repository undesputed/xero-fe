"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RefreshCw, ChevronRight } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { listSessions } from "@/lib/api";
import type { SessionSummary } from "@/lib/types";

// ── Helpers ───────────────────────────────────────────────────────────────────

const CHANNEL_LABELS: Record<string, string> = {
  manomano: "ManoMano",
  fruugo: "Fruugo",
  onbuy: "OnBuy",
  "amazon-uk": "Amazon UK",
  "amazon-eu": "Amazon EU",
  ebay: "eBay",
  shopify: "Shopify",
  bq: "B&Q",
  debenhams: "Debenhams",
  tesco: "Tesco",
  therange: "The Range",
};

const FILE_TYPE_LABELS: Record<string, string> = {
  csv: "Settlement CSV",
  "csv-deductions": "Deductions CSV",
  pdf: "Fee PDF",
};

const STATUS_STYLES: Record<string, { bg: string; color: string; dot: string }> = {
  APPROVED: { bg: "#f0fdf4", color: "#15803d", dot: "#22c55e" },
  PENDING:  { bg: "#fef3c7", color: "#92400e", dot: "#f59e0b" },
  DECLINED: { bg: "#fff7ed", color: "#9a3412", dot: "#f97316" },
  FAILED:   { bg: "#fef2f2", color: "#991b1b", dot: "#ef4444" },
};

function formatPeriod(start: string, end: string): string {
  if (!start && !end) return "—";
  const fmt = (d: string) => {
    if (!d) return "";
    const date = new Date(d);
    return date.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
  };
  const s = fmt(start);
  const e = fmt(end);
  return s === e ? s : `${s} – ${e}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SessionsPage() {
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    listSessions()
      .then(setSessions)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  return (
    <>
      <TopBar title="Sessions" />
      <main className="flex-1 p-6 space-y-4">

        {/* Header row */}
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            All upload sessions — click a row to review or view results.
          </p>
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-40"
            style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && sessions.length === 0 && (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-14 rounded-lg animate-pulse"
                style={{ background: "var(--card-bg)" }}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && sessions.length === 0 && !error && (
          <div
            className="rounded-xl border py-16 text-center"
            style={{ borderColor: "var(--border)" }}
          >
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              No sessions yet
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              Upload a CSV or PDF to get started.
            </p>
            <Link
              href="/upload"
              className="inline-block mt-4 text-sm font-medium underline"
              style={{ color: "var(--sidebar-active)" }}
            >
              Go to Upload
            </Link>
          </div>
        )}

        {/* Table */}
        {sessions.length > 0 && (
          <div
            className="rounded-xl border overflow-hidden"
            style={{ borderColor: "var(--border)" }}
          >
            {/* Table header */}
            <div
              className="grid grid-cols-[1fr_120px_160px_110px_100px_32px] px-4 py-2.5 text-xs font-semibold uppercase tracking-wide border-b"
              style={{
                background: "#f8fafc",
                borderColor: "var(--border)",
                color: "var(--text-muted)",
              }}
            >
              <span>Channel / File</span>
              <span>Ref</span>
              <span>Period</span>
              <span>Type</span>
              <span>Status</span>
              <span />
            </div>

            {/* Rows */}
            <div className="divide-y" style={{ borderColor: "var(--border)" }}>
              {sessions.map((s) => {
                const statusStyle = STATUS_STYLES[s.status] ?? STATUS_STYLES.FAILED;
                return (
                  <Link
                    key={s.session_id}
                    href={`/review/${s.session_id}`}
                    className="grid grid-cols-[1fr_120px_160px_110px_100px_32px] px-4 py-3 items-center hover:bg-slate-50 transition-colors"
                  >
                    {/* Channel + file name */}
                    <div className="min-w-0">
                      <p
                        className="text-sm font-medium truncate"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {CHANNEL_LABELS[s.channel] ?? s.channel}
                      </p>
                      <p
                        className="text-xs font-mono truncate mt-0.5"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {s.file_name}
                      </p>
                    </div>

                    {/* Settlement ref */}
                    <span
                      className="text-sm font-mono"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {s.settlement_ref}
                    </span>

                    {/* Period */}
                    <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                      {formatPeriod(s.period_start, s.period_end)}
                    </span>

                    {/* File type */}
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {FILE_TYPE_LABELS[s.file_type] ?? s.file_type}
                    </span>

                    {/* Status badge */}
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold w-fit"
                      style={{ background: statusStyle.bg, color: statusStyle.color }}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full shrink-0"
                        style={{ background: statusStyle.dot }}
                      />
                      {s.status}
                    </span>

                    {/* Arrow */}
                    <ChevronRight size={14} style={{ color: "var(--text-muted)" }} />
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Upload date shown below each row on narrower layouts */}
        {sessions.length > 0 && (
          <p className="text-xs text-right" style={{ color: "var(--text-muted)" }}>
            Showing {sessions.length} session{sessions.length !== 1 ? "s" : ""} ·
            last updated {formatDate(new Date().toISOString())}
          </p>
        )}

      </main>
    </>
  );
}
