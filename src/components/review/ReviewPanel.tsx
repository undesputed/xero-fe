"use client";

import { CheckCircle, RefreshCw, SkipForward, XCircle } from "lucide-react";
import type { ApproveResponse, PreviewDocument, XeroResult } from "@/lib/types";
import { PreviewCard } from "./PreviewCard";

// ── Preview state (before approval) ──────────────────────────────────────────

interface ReviewPanelProps {
  sessionId: string;
  settlementRef: string;
  preview: PreviewDocument[];
  loading: boolean;
  onApprove: () => void;
  onDecline: () => void;
  onRerun: () => void;
}

export function ReviewPanel({
  sessionId,
  settlementRef,
  preview,
  loading,
  onApprove,
  onDecline,
  onRerun,
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
            style={{ background: "#fef3c7", color: "#92400e" }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            Pending Review
          </span>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            Session{" "}
            <span className="font-mono">{shortId}…</span>
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
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {preview.map((doc, i) => (
              <PreviewCard key={i} doc={doc} />
            ))}
          </div>
        )}
      </div>

      {/* Action footer */}
      <div
        className="px-5 py-4 border-t flex items-center gap-3 flex-wrap"
        style={{ borderColor: "var(--border)", background: "#f8fafc" }}
      >
        <button
          onClick={onApprove}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-50"
          style={{ background: "var(--sidebar-active)" }}
        >
          <CheckCircle size={15} />
          {loading ? "Pushing to Xero…" : "Approve & Push to Xero"}
        </button>

        <button
          onClick={onDecline}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50"
          style={{
            borderColor: "#fca5a5",
            color: "#dc2626",
            background: "#fff",
          }}
        >
          <XCircle size={15} />
          Decline
        </button>

        <button
          onClick={onRerun}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 ml-auto"
          style={{
            borderColor: "var(--border)",
            color: "var(--text-muted)",
            background: "#fff",
          }}
        >
          <RefreshCw size={13} />
          Re-run
        </button>
      </div>
    </div>
  );
}

// ── Approved state ────────────────────────────────────────────────────────────

interface ApproveResultPanelProps {
  settlementRef: string;
  result: ApproveResponse;
  onUploadAnother: () => void;
}

export function ApproveResultPanel({
  settlementRef,
  result,
  onUploadAnother,
}: ApproveResultPanelProps) {
  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ borderColor: "#86efac" }}
    >
      {/* Success header */}
      <div
        className="px-5 py-4 border-b flex items-center justify-between gap-4"
        style={{ background: "#f0fdf4", borderColor: "#86efac" }}
      >
        <div className="flex items-center gap-3">
          <CheckCircle size={22} className="text-emerald-500 shrink-0" />
          <div>
            <p
              className="font-semibold text-base"
              style={{ color: "#166534" }}
            >
              Approved — pushed to Xero
            </p>
            <p className="text-xs mt-0.5" style={{ color: "#15803d" }}>
              Settlement {settlementRef} ·{" "}
              {result.documents_created} document
              {result.documents_created !== 1 ? "s" : ""} created
              {result.skipped > 0 && `, ${result.skipped} skipped`}
            </p>
          </div>
        </div>
      </div>

      {/* Result rows */}
      <div className="divide-y" style={{ borderColor: "var(--border)" }}>
        {result.results.map((r, i) => (
          <XeroResultRow key={i} result={r} />
        ))}
      </div>

      {/* Footer */}
      <div
        className="px-5 py-4 border-t"
        style={{ borderColor: "var(--border)", background: "#f8fafc" }}
      >
        <button
          onClick={onUploadAnother}
          className="text-sm font-medium hover:underline"
          style={{ color: "var(--sidebar-active)" }}
        >
          ← Upload another file
        </button>
      </div>
    </div>
  );
}

// ── Declined state ────────────────────────────────────────────────────────────

interface DeclinedPanelProps {
  settlementRef: string;
  onUploadAnother: () => void;
}

export function DeclinedPanel({ settlementRef, onUploadAnother }: DeclinedPanelProps) {
  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ borderColor: "#fca5a5" }}
    >
      <div
        className="px-5 py-4 flex items-center gap-3"
        style={{ background: "#fff7f7" }}
      >
        <XCircle size={22} className="text-red-400 shrink-0" />
        <div>
          <p className="font-semibold text-base" style={{ color: "#991b1b" }}>
            Settlement declined
          </p>
          <p className="text-xs mt-0.5" style={{ color: "#dc2626" }}>
            {settlementRef} — no documents were sent to Xero
          </p>
        </div>
      </div>
      <div
        className="px-5 py-4 border-t"
        style={{ borderColor: "#fca5a5", background: "#f8fafc" }}
      >
        <button
          onClick={onUploadAnother}
          className="text-sm font-medium hover:underline"
          style={{ color: "var(--sidebar-active)" }}
        >
          ← Upload another file
        </button>
      </div>
    </div>
  );
}

// ── Shared helpers ─────────────────────────────────────────────────────────────

const DOC_LABELS: Record<string, string> = {
  ACCREC: "Sales Invoice",
  ACCPAY: "Fee Bill",
  ACCRECCREDIT: "Credit Note",
  PAYMENT: "Payment",
};

function XeroResultRow({ result }: { result: XeroResult }) {
  return (
    <div className="flex items-center justify-between px-5 py-3 gap-3">
      <div className="flex items-center gap-3 min-w-0">
        {result.skipped ? (
          <SkipForward size={15} className="text-amber-400 shrink-0" />
        ) : (
          <CheckCircle size={15} className="text-emerald-500 shrink-0" />
        )}
        <div className="min-w-0">
          <p
            className="font-mono text-xs font-medium truncate"
            style={{ color: "var(--text-primary)" }}
          >
            {result.reference}
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {DOC_LABELS[result.type] ?? result.type}
            {result.skipped && " · already processed"}
            {result.note && ` · ${result.note}`}
          </p>
        </div>
      </div>
      {result.xero_id && !result.skipped && (
        <span
          className="font-mono text-xs shrink-0"
          style={{ color: "var(--text-muted)" }}
        >
          {result.xero_id.slice(0, 8)}…
        </span>
      )}
    </div>
  );
}
