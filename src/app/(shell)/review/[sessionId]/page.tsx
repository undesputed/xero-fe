"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FileText, Calendar, Hash, RefreshCw, AlertTriangle } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import {
  ApproveResultPanel,
  DeclinedPanel,
  ReviewPanel,
} from "@/components/review/ReviewPanel";
import { approveSession, declineSession, getSession, rerunSession } from "@/lib/api";
import type { ApproveResponse, SessionDetail } from "@/lib/types";

// ── File type labels ──────────────────────────────────────────────────────────

const FILE_TYPE_LABELS: Record<string, string> = {
  csv: "Settlement CSV",
  "csv-deductions": "Commission Deductions CSV",
  pdf: "Fee Invoice PDF",
};

const CHANNEL_LABELS: Record<string, string> = {
  manomano: "ManoMano",
  fruugo: "Fruugo",
  onbuy: "OnBuy",
  "amazon-uk": "Amazon UK",
  "amazon-eu": "Amazon EU",
  ebay: "eBay",
  shopify: "Shopify",
  bq: "B&Q",
  debenhams: "Debenhams",
  tesco: "Tesco",
  therange: "The Range",
};

// ── Page state ────────────────────────────────────────────────────────────────

type Phase =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "pending"; session: SessionDetail }
  | { kind: "failed"; session: SessionDetail }
  | { kind: "approved"; session: SessionDetail; result: ApproveResponse }
  | { kind: "declined"; session: SessionDetail }
  | { kind: "already-approved"; session: SessionDetail }
  | { kind: "already-declined"; session: SessionDetail };

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [phase, setPhase] = useState<Phase>({ kind: "loading" });
  const [actioning, setActioning] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // ── Load session on mount ────────────────────────────────────────────────

  useEffect(() => {
    getSession(sessionId).then((s) => {
      if (!s) {
        setPhase({ kind: "error", message: "Session not found or has expired." });
        return;
      }
      if (s.status === "APPROVED") {
        setPhase({ kind: "already-approved", session: s });
      } else if (s.status === "DECLINED") {
        setPhase({ kind: "already-declined", session: s });
      } else if (s.status === "FAILED") {
        setPhase({ kind: "failed", session: s });
      } else {
        setPhase({ kind: "pending", session: s });
      }
    }).catch((err: unknown) => {
      setPhase({
        kind: "error",
        message: err instanceof Error ? err.message : "Failed to load session.",
      });
    });
  }, [sessionId]);

  // ── Action handlers ──────────────────────────────────────────────────────

  const handleApprove = async () => {
    if (phase.kind !== "pending" && phase.kind !== "failed") return;
    setActioning(true);
    setActionError(null);
    const currentSession = phase.session;
    try {
      const result = await approveSession(sessionId);
      setPhase({ kind: "approved", session: currentSession, result });
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Approve failed");
    } finally {
      setActioning(false);
    }
  };

  const handleDecline = async () => {
    if (phase.kind !== "pending" && phase.kind !== "failed") return;
    setActioning(true);
    setActionError(null);
    const currentSession = phase.session;
    try {
      await declineSession(sessionId);
      setPhase({ kind: "declined", session: currentSession });
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Decline failed");
    } finally {
      setActioning(false);
    }
  };

  const handleRerun = async () => {
    if (phase.kind !== "pending" && phase.kind !== "failed") return;
    setActioning(true);
    setActionError(null);
    try {
      const res = await rerunSession(sessionId);
      router.push(`/review/${res.session_id}`);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Re-run failed");
    } finally {
      setActioning(false);
    }
  };

  const goUpload = () => router.push("/upload");

  // ── Derive session for summary bar ───────────────────────────────────────

  const session =
    phase.kind === "loading" || phase.kind === "error"
      ? null
      : phase.session;

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      <TopBar title="Review Settlement" />
      <main className="flex-1 p-6 w-full space-y-5">

        {/* ── Loading ── */}
        {phase.kind === "loading" && (
          <div className="flex items-center gap-3 py-10 justify-center">
            <RefreshCw size={18} className="animate-spin" style={{ color: "var(--text-muted)" }} />
            <span className="text-sm" style={{ color: "var(--text-muted)" }}>
              Loading session…
            </span>
          </div>
        )}

        {/* ── Error ── */}
        {phase.kind === "error" && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <strong>Error:</strong> {phase.message}
            <div className="mt-3">
              <button
                onClick={goUpload}
                className="text-sm font-medium underline"
                style={{ color: "#dc2626" }}
              >
                ← Back to upload
              </button>
            </div>
          </div>
        )}

        {/* ── Session summary bar ── */}
        {session && (
          <div
            className="rounded-xl border p-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4"
            style={{ borderColor: "var(--border)", background: "var(--card-bg)" }}
          >
            <SummaryField
              icon={<FileText size={14} />}
              label="Channel"
              value={CHANNEL_LABELS[session.channel] ?? session.channel}
            />
            <SummaryField
              icon={<Hash size={14} />}
              label="Settlement ref"
              value={session.settlement_ref}
              mono
            />
            <SummaryField
              icon={<Calendar size={14} />}
              label="Period start"
              value={session.period_start || "—"}
            />
            <SummaryField
              icon={<Calendar size={14} />}
              label="Period end"
              value={session.period_end || "—"}
            />
            <SummaryField
              label="File"
              value={session.file_name}
              mono
              colSpan2
            />
            <SummaryField
              label="Type"
              value={FILE_TYPE_LABELS[session.file_type] ?? session.file_type}
            />
            <SummaryField
              label="Uploaded"
              value={new Date(session.created_at).toLocaleString("en-GB")}
            />
          </div>
        )}

        {/* ── Action error ── */}
        {actionError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <strong>Error:</strong> {actionError}
          </div>
        )}

        {/* ── Failed (previous attempt errored — can retry) ── */}
        {phase.kind === "failed" && (
          <>
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 flex items-start gap-2">
              <AlertTriangle size={15} className="shrink-0 mt-0.5" />
              <div>
                <strong>Previous attempt failed</strong>
                {phase.session.error && (
                  <span className="ml-1 text-amber-700">— {phase.session.error}</span>
                )}
                <p className="mt-0.5 text-xs text-amber-600">
                  Documents that were already pushed to Xero will be skipped automatically. You can safely retry.
                </p>
              </div>
            </div>
            <ReviewPanel
              sessionId={sessionId}
              settlementRef={phase.session.settlement_ref}
              preview={phase.session.preview}
              loading={actioning}
              onApprove={handleApprove}
              onDecline={handleDecline}
              onRerun={handleRerun}
            />
          </>
        )}

        {/* ── Pending review ── */}
        {phase.kind === "pending" && (
          <ReviewPanel
            sessionId={sessionId}
            settlementRef={phase.session.settlement_ref}
            preview={phase.session.preview}
            loading={actioning}
            onApprove={handleApprove}
            onDecline={handleDecline}
            onRerun={handleRerun}
          />
        )}

        {/* ── Already approved (loaded from DB) ── */}
        {phase.kind === "already-approved" && (
          <ApproveResultPanel
            settlementRef={phase.session.settlement_ref}
            result={{
              status: "APPROVED",
              documents_created: phase.session.xero_results.filter((r) => !r.skipped).length,
              skipped: phase.session.xero_results.filter((r) => r.skipped).length,
              results: phase.session.xero_results,
            }}
            onUploadAnother={goUpload}
          />
        )}

        {/* ── Approved this session ── */}
        {phase.kind === "approved" && (
          <ApproveResultPanel
            settlementRef={phase.session.settlement_ref}
            result={phase.result}
            onUploadAnother={goUpload}
          />
        )}

        {/* ── Declined ── */}
        {(phase.kind === "declined" || phase.kind === "already-declined") && (
          <DeclinedPanel
            settlementRef={phase.session.settlement_ref}
            onUploadAnother={goUpload}
          />
        )}

      </main>
    </>
  );
}

// ── Summary field helper ──────────────────────────────────────────────────────

function SummaryField({
  icon,
  label,
  value,
  mono = false,
  colSpan2 = false,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
  colSpan2?: boolean;
}) {
  return (
    <div className={colSpan2 ? "col-span-2" : ""}>
      <p
        className="text-xs flex items-center gap-1 mb-0.5"
        style={{ color: "var(--text-muted)" }}
      >
        {icon}
        {label}
      </p>
      <p
        className={`text-sm font-medium truncate ${mono ? "font-mono" : ""}`}
        style={{ color: "var(--text-primary)" }}
      >
        {value}
      </p>
    </div>
  );
}
