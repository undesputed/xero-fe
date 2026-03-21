import type { PreviewDocument } from "@/lib/types";

const DOC_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  ACCREC: { label: "Sales Invoice", color: "#0d9488", bg: "#f0fdfa", border: "#99f6e4" },
  ACCPAY: { label: "Fee Bill", color: "#7c3aed", bg: "#faf5ff", border: "#e9d5ff" },
  ACCRECCREDIT: { label: "Credit Note", color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
  PAYMENT: { label: "Settlement Payment", color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
};

interface PreviewCardProps {
  doc: PreviewDocument;
}

export function PreviewCard({ doc }: PreviewCardProps) {
  const cfg = DOC_CONFIG[doc.type] ?? {
    label: doc.type,
    color: "#64748b",
    bg: "#f8fafc",
    border: "#e2e8f0",
  };

  const lineTotal =
    doc.line_items?.reduce(
      (sum, li) => sum + parseFloat(li.unit_amount || "0") * parseFloat(li.quantity || "1"),
      0,
    ) ?? 0;

  return (
    <div
      className="rounded-xl border p-4 flex flex-col gap-3"
      style={{ background: cfg.bg, borderColor: cfg.border }}
    >
      {/* Type badge + reference */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <span
            className="text-xs font-semibold uppercase tracking-wide"
            style={{ color: cfg.color }}
          >
            {cfg.label}
          </span>
          <p
            className="font-mono text-sm font-medium mt-0.5 truncate"
            style={{ color: "var(--text-primary)" }}
          >
            {doc.reference}
          </p>
        </div>
        <div className="text-right text-xs shrink-0" style={{ color: "var(--text-muted)" }}>
          {doc.date && <p>{doc.date}</p>}
          {doc.currency && (
            <p className="font-mono font-medium mt-0.5" style={{ color: cfg.color }}>
              {doc.currency}
            </p>
          )}
        </div>
      </div>

      {/* Contact */}
      {doc.contact && (
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          To:{" "}
          <span className="font-medium" style={{ color: "var(--text-primary)" }}>
            {doc.contact}
          </span>
        </p>
      )}

      {/* Line items */}
      {doc.line_items && doc.line_items.length > 0 && (
        <div className="space-y-1.5">
          {doc.line_items.map((li, i) => (
            <div key={i} className="flex justify-between text-xs gap-2">
              <span className="truncate" style={{ color: "var(--text-muted)" }}>
                {li.description}{" "}
                <span
                  className="font-mono px-1 rounded"
                  style={{ background: "rgba(255,255,255,0.7)", color: cfg.color }}
                >
                  {li.account_code}
                </span>{" "}
                <span
                  className="italic"
                  style={{ color: "var(--text-muted)" }}
                >
                  {li.tax_type}
                </span>
              </span>
              <span className="font-medium shrink-0" style={{ color: "var(--text-primary)" }}>
                £{parseFloat(li.unit_amount || "0").toFixed(2)}
              </span>
            </div>
          ))}
          <div
            className="border-t pt-1.5 flex justify-between text-xs font-semibold"
            style={{ borderColor: cfg.border }}
          >
            <span style={{ color: "var(--text-muted)" }}>Total (ex VAT)</span>
            <span style={{ color: "var(--text-primary)" }}>£{lineTotal.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Payment amount */}
      {doc.type === "PAYMENT" && doc.amount != null && (
        <div className="flex justify-between text-sm font-semibold">
          <span style={{ color: "var(--text-muted)" }}>Net payout</span>
          <span style={{ color: "var(--text-primary)" }}>
            £{parseFloat(doc.amount).toFixed(2)}
          </span>
        </div>
      )}

      {/* Due date */}
      {doc.due_date && (
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          Due: <span style={{ color: "var(--text-primary)" }}>{doc.due_date}</span>
        </p>
      )}
    </div>
  );
}
