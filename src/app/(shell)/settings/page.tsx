import { TopBar } from "@/components/layout/TopBar";
import { ChannelBadge } from "@/components/ui/ChannelBadge";
import { ExtractFeeTypesButton } from "@/components/settings/ExtractFeeTypesButton";
import { CHANNEL_CONFIGS } from "@/lib/mock";
import type { ChannelConfig } from "@/lib/types";

const STATUS_CFG: Record<ChannelConfig["status"], { bg: string; text: string; dot: string }> = {
  Active:  { bg: "#e6faf5", text: "#00664d", dot: "var(--status-done)"    },
  Paused:  { bg: "#f8fafc", text: "#94a3b8", dot: "var(--status-paused)"  },
  Pending: { bg: "#fff8e6", text: "#8a5700", dot: "var(--status-pending)" },
};

function StatusPill({ status }: { status: ChannelConfig["status"] }) {
  const cfg = STATUS_CFG[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ background: cfg.bg, color: cfg.text }}
    >
      <span
        style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: cfg.dot, flexShrink: 0 }}
      />
      {status}
    </span>
  );
}

export default function SettingsPage() {
  const activeCount = CHANNEL_CONFIGS.filter((c) => c.status === "Active").length;

  return (
    <>
      <TopBar title="Settings" />
      <main className="flex-1 p-6 space-y-6">

        {/* Channel configuration */}
        <section>
          <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
            Channel Configuration
          </h2>
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1px solid var(--border)" }}>
                  {["Channel", "Xero Contact", "Integration Pattern", "Status"].map((h) => (
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
                {CHANNEL_CONFIGS.map((ch, i) => (
                  <tr
                    key={ch.channel}
                    className="hover:bg-slate-50 transition-colors"
                    style={{ borderTop: i > 0 ? "1px solid var(--border)" : undefined }}
                  >
                    <td className="px-4 py-3">
                      <ChannelBadge channel={ch.channel} />
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--text-muted)" }}>
                      {ch.xero_contact}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-block px-2 py-0.5 rounded-md text-xs font-medium"
                        style={{ background: "#f1f5f9", color: "var(--text-muted)" }}
                      >
                        {ch.pattern}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill status={ch.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Actions */}
        <section>
          <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
            Actions
          </h2>
          <div className="space-y-3">
            <ExtractFeeTypesButton />
          </div>
        </section>

        {/* About */}
        <section>
          <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
            About
          </h2>
          <div
            className="rounded-xl border p-5 space-y-3"
            style={{ borderColor: "var(--border)", background: "var(--card-bg)" }}
          >
            {[
              { label: "Version",          value: "0.1.0"          },
              { label: "Environment",      value: "Development"    },
              { label: "Channels active",  value: `${activeCount} of ${CHANNEL_CONFIGS.length}` },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-sm" style={{ color: "var(--text-muted)" }}>{label}</span>
                <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{value}</span>
              </div>
            ))}
          </div>
        </section>

      </main>
    </>
  );
}
