"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TopBar } from "@/components/layout/TopBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { listSessions } from "@/lib/api";
import type { SessionSummary } from "@/lib/types";

const FILE_TYPE_LABELS: Record<string, string> = {
  csv: "Settlement CSV",
  "csv-deductions": "Deductions CSV",
  pdf: "Fee PDF",
};

const STATUS_FILTERS = ["All", "Pending", "Approved", "Declined", "Failed"] as const;
type FilterTab = (typeof STATUS_FILTERS)[number];

function formatPeriod(start: string, end: string): string {
  if (!start && !end) return "—";
  const fmt = (d: string) =>
    d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }) : "";
  const s = fmt(start);
  const e = fmt(end);
  return s === e ? s : `${s} – ${e}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ManoManoReviewPage() {
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>("All");

  useEffect(() => {
    listSessions("manomano").then((data) => {
      setSessions(data);
      setLoading(false);
    });
  }, []);

  const filtered =
    activeTab === "All"
      ? sessions
      : sessions.filter((s) => s.status === activeTab.toUpperCase());

  const pendingCount = sessions.filter((s) => s.status === "PENDING").length;

  const TABS: { label: FilterTab; count: number | null }[] = [
    { label: "All", count: sessions.length },
    { label: "Pending", count: pendingCount },
    { label: "Approved", count: null },
    { label: "Declined", count: null },
    { label: "Failed", count: null },
  ];

  return (
    <>
      <TopBar
        title="ManoMano — Review"
        actions={
          <Link
            href="/channels/manomano/upload"
            className="inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-lg text-white"
            style={{ background: "var(--accent)" }}
          >
            Upload new →
          </Link>
        }
      />
      <main className="flex-1 flex flex-col">

        {/* Filter tabs */}
        <div
          className="flex gap-0 px-6 border-b overflow-x-auto"
          style={{ borderColor: "var(--border)", background: "var(--card-bg)" }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className="flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors"
              style={
                activeTab === tab.label
                  ? { borderColor: "var(--accent)", color: "var(--accent)" }
                  : { borderColor: "transparent", color: "var(--text-muted)" }
              }
            >
              {tab.label}
              {tab.count !== null && (
                <span
                  className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full text-xs font-bold"
                  style={
                    activeTab === tab.label
                      ? { background: "var(--accent)", color: "#fff" }
                      : { background: "var(--border)", color: "var(--text-muted)" }
                  }
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="p-6">
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>

            {/* Header */}
            <div
              className="px-4 py-3 text-xs font-semibold uppercase tracking-wide border-b"
              style={{
                display: "grid",
                gridTemplateColumns: "170px 140px 130px 110px 130px 90px",
                background: "#f8fafc",
                borderColor: "var(--border)",
                color: "var(--text-muted)",
              }}
            >
              <span>Settlement Ref</span>
              <span>Period</span>
              <span>File Type</span>
              <span>Status</span>
              <span>Date</span>
              <span />
            </div>

            {/* Loading skeleton */}
            {loading && (
              <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="px-4 py-4 animate-pulse"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "170px 140px 130px 110px 130px 90px",
                    }}
                  >
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-4 rounded" style={{ background: "var(--border)", width: "70%" }} />
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!loading && filtered.length === 0 && (
              <div className="py-12 text-center" style={{ color: "var(--text-muted)" }}>
                <p className="text-sm">No sessions found.</p>
                <Link
                  href="/channels/manomano/upload"
                  className="text-sm font-medium underline mt-2 inline-block"
                  style={{ color: "var(--accent)" }}
                >
                  Upload files →
                </Link>
              </div>
            )}

            {/* Rows */}
            {!loading && (
              <div>
                {filtered.map((s, i) => (
                  <div
                    key={s.session_id}
                    className="px-4 py-3 items-center hover:bg-slate-50 transition-colors"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "170px 140px 130px 110px 130px 90px",
                      borderTop: i > 0 ? "1px solid var(--border)" : undefined,
                    }}
                  >
                    <div>
                      <span className="font-mono text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                        {s.settlement_ref}
                      </span>
                      <p className="font-mono text-xs mt-0.5 truncate" style={{ color: "var(--text-muted)" }}>
                        {s.file_name}
                      </p>
                    </div>

                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {formatPeriod(s.period_start, s.period_end)}
                    </span>

                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {FILE_TYPE_LABELS[s.file_type] ?? s.file_type}
                    </span>

                    <div>
                      <StatusBadge status={s.status} />
                      {s.error && (
                        <p className="text-xs mt-1 truncate" style={{ color: "var(--status-failed)" }}>
                          {s.error}
                        </p>
                      )}
                    </div>

                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {formatDate(s.created_at)}
                    </span>

                    <div className="text-right">
                      {s.status === "PENDING" ? (
                        <Link
                          href={`/review/${s.session_id}`}
                          className="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-lg text-white"
                          style={{ background: "var(--accent)" }}
                        >
                          Review
                        </Link>
                      ) : (
                        <Link
                          href={`/review/${s.session_id}`}
                          className="text-xs font-medium hover:underline"
                          style={{ color: "var(--text-muted)" }}
                        >
                          View
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {!loading && (
            <p className="text-xs mt-3 text-right" style={{ color: "var(--text-muted)" }}>
              Showing {filtered.length} of {sessions.length} sessions
            </p>
          )}
        </div>
      </main>
    </>
  );
}
