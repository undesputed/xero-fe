import Link from "next/link";
import { TopBar } from "@/components/layout/TopBar";
import { ChannelBadge } from "@/components/ui/ChannelBadge";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  CHANNEL_LABELS,
  CHANNEL_STATUS_ROWS,
  DASHBOARD_STATS,
  RECENT_SESSIONS,
} from "@/lib/mock";
import type { ChannelDisplayStatus } from "@/lib/mock";

function ChannelStatusPill({ status }: { status: ChannelDisplayStatus }) {
  const cfg = {
    Done:   { dot: "var(--status-done)",    bg: "#e6faf5", text: "#00664d", label: "Done"   },
    Due:    { dot: "#94a3b8",               bg: "#f1f5f9", text: "#475569", label: "Due"    },
    Paused: { dot: "var(--status-paused)",  bg: "#f8fafc", text: "#94a3b8", label: "Paused" },
  }[status];

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ background: cfg.bg, color: cfg.text }}
    >
      <span
        style={{
          display: "inline-block",
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: cfg.dot,
          flexShrink: 0,
        }}
      />
      {cfg.label}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function DashboardPage() {
  return (
    <>
      <TopBar title="Dashboard" breadcrumb="March 2026" />
      <main className="flex-1 p-6 space-y-6">

        {/* ── Stat cards ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Pending Sessions"     value={DASHBOARD_STATS.pending}            />
          <StatCard label="Processed This Month" value={DASHBOARD_STATS.processedThisMonth} accent="green" />
          <StatCard label="Failed"               value={DASHBOARD_STATS.failed}             accent="red"   />
        </div>

        {/* ── Channel Status ───────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Channel Status
            </h2>
            <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              March 2026
            </span>
          </div>
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1px solid var(--border)" }}>
                  {["Channel", "Last Ref", "Status", "Last Updated"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CHANNEL_STATUS_ROWS.map((row, i) => (
                  <tr
                    key={row.channel}
                    className="transition-colors hover:bg-slate-50"
                    style={{ borderTop: i > 0 ? "1px solid var(--border)" : undefined }}
                  >
                    <td className="px-4 py-3">
                      <ChannelBadge channel={row.channel} />
                    </td>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                      {row.lastRef}
                    </td>
                    <td className="px-4 py-3">
                      <ChannelStatusPill status={row.status} />
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--text-muted)" }}>
                      {row.lastUpdated}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Recent Sessions ──────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Recent Sessions
            </h2>
            <Link
              href="/sessions"
              className="text-xs font-medium hover:underline"
              style={{ color: "var(--accent)" }}
            >
              View all →
            </Link>
          </div>
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1px solid var(--border)" }}>
                  {["Channel", "Ref", "Status", "Date", ""].map((h, i) => (
                    <th
                      key={i}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RECENT_SESSIONS.map((s, i) => (
                  <tr
                    key={s.session_id}
                    className="transition-colors hover:bg-slate-50"
                    style={{ borderTop: i > 0 ? "1px solid var(--border)" : undefined }}
                  >
                    <td className="px-4 py-3">
                      <ChannelBadge channel={CHANNEL_LABELS[s.channel] ?? s.channel} />
                    </td>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--text-primary)" }}>
                      {s.settlement_ref}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={s.status} />
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--text-muted)" }}>
                      {formatDate(s.created_at)}
                    </td>
                    <td className="px-4 py-3 text-right">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </main>
    </>
  );
}
