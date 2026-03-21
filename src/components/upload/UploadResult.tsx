import { CheckCircle, SkipForward } from "lucide-react";
import type { DocumentResult, DocType } from "@/lib/types";

const DOC_LABELS: Record<DocType | "PAYMENT", string> = {
  ACCREC: "Sales Invoice",
  ACCPAY: "Fee Bill",
  ACCRECCREDIT: "Credit Note",
  PAYMENT: "Payment",
};

interface UploadResultProps {
  results: DocumentResult[];
  settlementRef: string;
  documentsCreated: number;
}

export function UploadResult({ results, settlementRef, documentsCreated }: UploadResultProps) {
  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
      <div
        className="px-4 py-3 border-b flex items-center justify-between"
        style={{ background: "#f8fafc", borderColor: "var(--border)" }}
      >
        <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          {settlementRef}
        </span>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          {documentsCreated} document{documentsCreated !== 1 ? "s" : ""} created
        </span>
      </div>
      <div className="divide-y" style={{ borderColor: "var(--border)" }}>
        {results.map((r, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              {r.skipped ? (
                <SkipForward size={16} className="text-amber-500" />
              ) : (
                <CheckCircle size={16} className="text-emerald-500" />
              )}
              <div>
                <p className="font-mono text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                  {r.reference}
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {DOC_LABELS[r.type as DocType] ?? r.type}
                  {r.skipped && " · already processed"}
                </p>
              </div>
            </div>
            {r.amount != null && (
              <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                £{r.amount.toFixed(2)}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
