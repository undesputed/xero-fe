import type { DocType } from "@/lib/types";

const DOC_CONFIG: Record<DocType, { label: string; color: string; bg: string; border: string }> = {
  ACCREC:       { label: "Sales Invoice",       color: "var(--accent)", bg: "#e8f8fd", border: "#b3e9f9" },
  ACCPAY:       { label: "Fee Bill",            color: "#7c3aed",       bg: "#faf5ff", border: "#e9d5ff" },
  ACCRECCREDIT: { label: "Credit Note",         color: "#d97706",       bg: "#fffbeb", border: "#fde68a" },
  PAYMENT:      { label: "Settlement Payment",  color: "#2563eb",       bg: "#eff6ff", border: "#bfdbfe" },
};

interface LineItem {
  description: string;
  account_code: string;
  amount: number;
  tax_type: string;
}

interface DocumentCardProps {
  type: DocType;
  reference: string;
  date?: string;
  lines?: LineItem[];
  total?: number;
  skipped?: boolean;
  xero_id?: string;
}

export function DocumentCard({ type, reference, date, lines, total, skipped, xero_id }: DocumentCardProps) {
  const cfg = DOC_CONFIG[type];
  return (
    <div
      className="rounded-xl border p-4 flex flex-col gap-3"
      style={{ background: cfg.bg, borderColor: cfg.border }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <span
            className="text-xs font-semibold uppercase tracking-wide"
            style={{ color: cfg.color }}
          >
            {cfg.label}
          </span>
          <p className="font-mono text-sm font-medium mt-0.5" style={{ color: "var(--text-primary)" }}>
            {reference}
          </p>
        </div>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          {type}
        </span>
      </div>

      {/* Lines */}
      {lines && lines.length > 0 && (
        <div className="space-y-1.5">
          {lines.map((li, i) => (
            <div key={i} className="flex justify-between text-xs">
              <span style={{ color: "var(--text-muted)" }}>
                {li.description}{" "}
                <span className="font-mono bg-white/60 px-1 rounded">{li.account_code}</span>
              </span>
              <span className="font-medium" style={{ color: "var(--text-primary)" }}>
                £{li.amount.toFixed(2)}
              </span>
            </div>
          ))}
          <div className="border-t pt-1.5 flex justify-between text-sm font-semibold" style={{ borderColor: cfg.border }}>
            <span style={{ color: "var(--text-muted)" }}>Total</span>
            <span style={{ color: "var(--text-primary)" }}>£{(total ?? 0).toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs" style={{ color: "var(--text-muted)" }}>
        {date && <span>{date}</span>}
        {skipped && <span className="text-amber-600">↷ Skipped</span>}
        {xero_id && !skipped && <span className="text-emerald-600">✓ Posted</span>}
      </div>
    </div>
  );
}
