import Link from "next/link";
import { ChannelBadge } from "@/components/ui/ChannelBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Settlement } from "@/lib/types";

interface SettlementTableProps {
  settlements: Settlement[];
}

export function SettlementTable({ settlements }: SettlementTableProps) {
  if (settlements.length === 0) {
    return (
      <div
        className="rounded-xl border text-center py-16"
        style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
      >
        <p className="text-sm">No settlements found.</p>
        <p className="text-xs mt-1">Upload a CSV or wait for an API-triggered settlement.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: "#f8fafc", borderBottom: "1px solid var(--border)" }}>
            {["Channel", "Reference", "Period", "Net (£)", "Status"].map((h) => (
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
          {settlements.map((s) => (
            <tr
              key={s.id}
              className="hover:bg-slate-50 transition-colors"
            >
              <td className="px-4 py-3">
                <ChannelBadge channel={s.channel} />
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/settlements/${encodeURIComponent(s.reference)}`}
                  className="font-mono text-xs font-medium hover:underline"
                  style={{ color: "var(--sidebar-active)" }}
                >
                  {s.reference}
                </Link>
              </td>
              <td className="px-4 py-3 text-xs" style={{ color: "var(--text-muted)" }}>
                {s.period}
              </td>
              <td className="px-4 py-3 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                {s.net_amount != null ? `£${s.net_amount.toLocaleString()}` : "—"}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={s.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
