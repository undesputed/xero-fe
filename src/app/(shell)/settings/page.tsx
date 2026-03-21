import { TopBar } from "@/components/layout/TopBar";
import { ChannelBadge } from "@/components/ui/ChannelBadge";
import type { ChannelConfig } from "@/lib/types";

const CHANNELS: ChannelConfig[] = [
  { channel: "ManoMano", xero_contact: "ManoMano (Colibri SAS)", pattern: "CSV", status: "Active" },
  { channel: "B&Q", xero_contact: "B&Q (Kingfisher)", pattern: "Mirakl", status: "Paused" },
  { channel: "Debenhams", xero_contact: "Debenhams", pattern: "Mirakl", status: "Paused" },
  { channel: "Tesco", xero_contact: "Tesco", pattern: "Mirakl", status: "Paused" },
  { channel: "The Range", xero_contact: "The Range", pattern: "Mirakl", status: "Pending" },
  { channel: "Amazon UK", xero_contact: "Amazon UK", pattern: "SP-API", status: "Paused" },
  { channel: "Amazon EU", xero_contact: "Amazon EU", pattern: "SP-API", status: "Paused" },
  { channel: "eBay", xero_contact: "eBay UK", pattern: "Finances API", status: "Paused" },
  { channel: "Shopify", xero_contact: "Shopify / Stripe", pattern: "Finances API", status: "Paused" },
  { channel: "Fruugo", xero_contact: "Fruugo", pattern: "CSV", status: "Paused" },
  { channel: "OnBuy", xero_contact: "OnBuy", pattern: "CSV", status: "Paused" },
];

const STATUS_STYLE: Record<ChannelConfig["status"], { color: string }> = {
  Active: { color: "#16a34a" },
  Paused: { color: "#94a3b8" },
  Pending: { color: "#d97706" },
};

export default function SettingsPage() {
  return (
    <>
      <TopBar title="Settings" />
      <main className="flex-1 p-6 space-y-4">
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Channel configuration is read-only in Phase 1. Credentials are managed via environment
          variables.
        </p>
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid var(--border)" }}>
                {["Channel", "Xero Contact", "Pattern", "Status"].map((h) => (
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
              {CHANNELS.map((ch) => (
                <tr key={ch.channel} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <ChannelBadge channel={ch.channel} />
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "var(--text-muted)" }}>
                    {ch.xero_contact}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-slate-100"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {ch.pattern}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs font-semibold" style={STATUS_STYLE[ch.status]}>
                    {ch.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
