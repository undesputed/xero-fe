import type { PreviewDocument } from "@/lib/types";
import { PreviewCard } from "./PreviewCard";

interface ReviewPanelProps {
  sessionId: string;
  settlementRef: string;
  preview: PreviewDocument[];
}

export function ReviewPanel({
  sessionId,
  settlementRef,
  preview,
}: ReviewPanelProps) {
  const shortId = sessionId.slice(0, 8);

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ borderColor: "var(--border)" }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 border-b flex items-center justify-between gap-4 flex-wrap"
        style={{ background: "#f8fafc", borderColor: "var(--border)" }}
      >
        <div>
          <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            Settlement preview
          </p>
          <p
            className="font-mono text-base font-semibold mt-0.5"
            style={{ color: "var(--text-primary)" }}
          >
            {settlementRef}
          </p>
        </div>
        <div className="text-right">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
            style={{ background: "#fff8e6", color: "#8a5700" }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full animate-pulse"
              style={{ background: "var(--status-pending)" }}
            />
            Pending Review
          </span>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            Session <span className="font-mono">{shortId}…</span>
          </p>
        </div>
      </div>

      {/* Document grid */}
      <div className="p-5">
        {preview.length === 0 ? (
          <p className="text-sm text-center py-6" style={{ color: "var(--text-muted)" }}>
            No documents in preview
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {preview.map((doc, i) => (
              <PreviewCard key={i} doc={doc} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
