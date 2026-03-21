import { TopBar } from "@/components/layout/TopBar";
import { ChannelBadge } from "@/components/ui/ChannelBadge";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { ChannelSummary, SettlementStatus } from "@/lib/types";

// Static channel list — all 11 channels with their current Phase 1 state
const CHANNELS: ChannelSummary[] = [
  { channel: "ManoMano", status: "PENDING", last_period: undefined },
  { channel: "B&Q", status: "PAUSED", last_period: undefined },
  { channel: "Debenhams", status: "PAUSED", last_period: undefined },
  { channel: "Tesco", status: "PAUSED", last_period: undefined },
  { channel: "The Range", status: "PAUSED", last_period: undefined },
  { channel: "Amazon UK", status: "PAUSED", last_period: undefined },
  { channel: "Amazon EU", status: "PAUSED", last_period: undefined },
  { channel: "eBay", status: "PAUSED", last_period: undefined },
  { channel: "Shopify", status: "PAUSED", last_period: undefined },
  { channel: "Fruugo", status: "PAUSED", last_period: undefined },
  { channel: "OnBuy", status: "PAUSED", last_period: undefined },
];

const STATUS_SORT: Record<SettlementStatus, number> = {
  IN_PROGRESS: 0,
  PENDING: 1,
  FAILED: 2,
  COMPLETE: 3,
  SKIPPED: 4,
  PAUSED: 5,
};

export default function DashboardPage() {
  const sorted = [...CHANNELS].sort((a, b) => STATUS_SORT[a.status] - STATUS_SORT[b.status]);
  const pending = CHANNELS.filter((c) => c.status === "PENDING").length;
  const complete = CHANNELS.filter((c) => c.status === "COMPLETE").length;

  return (
    <>
      <TopBar title="Dashboard" breadcrumb="March 2026" />
      <main className="flex-1 p-6 space-y-6">
        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Settlements this month" value={complete} sub="of 11 channels" />
          <StatCard label="Pending" value={pending} sub="awaiting processing" />
          <StatCard label="Net this month" value="—" sub="connect channels to see totals" />
        </div>

        {/* Channel status table */}
        <section>
          <h2
            className="text-sm font-semibold mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            Channel Status
          </h2>
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1px solid var(--border)" }}>
                  {["Channel", "Status", "Last Period", "Net"].map((h) => (
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
              <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
                {sorted.map((ch) => (
                  <tr key={ch.channel} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <ChannelBadge channel={ch.channel} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={ch.status} />
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--text-muted)" }}>
                      {ch.last_period ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                      {ch.last_net != null ? `£${ch.last_net.toLocaleString()}` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recent activity placeholder */}
        <section>
          <h2
            className="text-sm font-semibold mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            Recent Activity
          </h2>
          <div
            className="rounded-xl border py-10 text-center"
            style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
          >
            <p className="text-sm">No activity yet.</p>
            <p className="text-xs mt-1">Upload a ManoMano CSV to get started.</p>
          </div>
        </section>
      </main>
    </>
  );
}
