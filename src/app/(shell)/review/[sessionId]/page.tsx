"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Calendar, CheckCircle, FileText, Hash, RefreshCw, XCircle } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ReviewPanel } from "@/components/review/ReviewPanel";
import { getSession, approveSession, declineSession, rerunSession } from "@/lib/api";
import type { SessionDetail } from "@/lib/types";

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

const FILE_TYPE_LABELS: Record<string, string> = {
  csv: "Settlement CSV",
  "csv-deductions": "Commission Deductions CSV",
  pdf: "Fee Invoice PDF",
};

function SummaryField({
  icon,
  label,
  value,
  mono = false,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="text-xs flex items-center gap-1 mb-0.5" style={{ color: "var(--text-muted)" }}>
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

export default function ReviewPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = use(params);
  const router = useRouter();
  const [session, setSession] = useState<SessionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSession(sessionId)
      .then(setSession)
      .catch((err) => setError(err instanceof Error ? err.message : "Session not found"))
      .finally(() => setLoading(false));
  }, [sessionId]);

  const backLink = (
    <Link
      href="/sessions"
      className="text-sm font-medium hover:underline"
      style={{ color: "var(--text-muted)" }}
    >
      ← Back to Sessions
    </Link>
  );

  async function handleApprove() {
    if (!session) return;
    setActionLoading(true);
    try {
      await approveSession(sessionId);
      router.push("/sessions");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Approve failed");
      setActionLoading(false);
    }
  }

  async function handleDecline() {
    if (!session) return;
    if (!confirm("Are you sure you want to decline? This will VOID the documents in Xero.")) return;
    setActionLoading(true);
    try {
      await declineSession(sessionId);
      router.push("/sessions");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Decline failed");
      setActionLoading(false);
    }
  }

  async function handleRerun() {
    if (!session) return;
    setActionLoading(true);
    try {
      const result = await rerunSession(sessionId);
      router.push(`/review/${result.session_id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Re-run failed");
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <>
        <TopBar title="Review Session" actions={backLink} />
        <main className="flex-1 p-6 flex items-center justify-center">
          <p className="text-sm animate-pulse" style={{ color: "var(--text-muted)" }}>
            Fetching documents from Xero…
          </p>
        </main>
      </>
    );
  }

  if (!session) {
    return (
      <>
        <TopBar title="Review Session" actions={backLink} />
        <main className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center space-y-2">
            <p className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
              Session not found
            </p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {error ?? "The session may have expired or been deleted."}
            </p>
            <Link href="/sessions" className="inline-block mt-2 text-sm font-medium underline" style={{ color: "var(--accent)" }}>
              ← Back to Sessions
            </Link>
          </div>
        </main>
      </>
    );
  }

  const isPending = session.status === "PENDING";

  return (
    <>
      <TopBar title="Review Session" actions={backLink} />
      <main className="flex-1 p-6 space-y-5">

        {/* Error banner */}
        {error && (
          <div className="rounded-lg px-4 py-3 text-sm" style={{ background: "#fef2f2", color: "#dc2626" }}>
            {error}
          </div>
        )}

        {/* Summary bar */}
        <div
          className="rounded-xl border p-4 grid gap-4"
          style={{
            borderColor: "var(--border)",
            background: "var(--card-bg)",
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          }}
        >
          <SummaryField
            icon={<FileText size={12} />}
            label="Channel"
            value={CHANNEL_LABELS[session.channel] ?? session.channel}
          />
          <SummaryField
            icon={<Hash size={12} />}
            label="Settlement Ref"
            value={session.settlement_ref}
            mono
          />
          <SummaryField
            icon={<Calendar size={12} />}
            label="Period Start"
            value={session.period_start}
          />
          <SummaryField
            icon={<Calendar size={12} />}
            label="Period End"
            value={session.period_end}
          />
          <SummaryField label="File" value={session.file_name} mono />
          <SummaryField label="Type" value={FILE_TYPE_LABELS[session.file_type] ?? session.file_type} />
          <SummaryField
            label="Uploaded"
            value={new Date(session.created_at).toLocaleDateString("en-GB", {
              day: "2-digit", month: "short", year: "numeric",
            })}
          />
          <div>
            <p className="text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>Status</p>
            <StatusBadge status={session.status} />
          </div>
        </div>

        {/* Document preview */}
        <ReviewPanel
          sessionId={session.session_id}
          settlementRef={session.settlement_ref}
          preview={session.preview}
        />

        {/* Action footer */}
        <div
          className="rounded-xl border p-4 flex items-center gap-3 flex-wrap"
          style={{ borderColor: "var(--border)", background: "var(--card-bg)" }}
        >
          {isPending && (
            <>
              <button
                onClick={handleApprove}
                disabled={actionLoading}
                className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                style={{ background: "var(--accent)" }}
              >
                <CheckCircle size={15} />
                {actionLoading ? "Processing…" : "Approve & Push to Xero"}
              </button>
              <button
                onClick={handleDecline}
                disabled={actionLoading}
                className="flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
                style={{ borderColor: "#fca5a5", color: "#dc2626", background: "#fff" }}
              >
                <XCircle size={15} />
                Decline
              </button>
            </>
          )}
          <button
            onClick={handleRerun}
            disabled={actionLoading}
            className="flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium ml-auto disabled:opacity-50"
            style={{ borderColor: "var(--border)", color: "var(--text-muted)", background: "#fff" }}
          >
            <RefreshCw size={13} />
            Re-run
          </button>
        </div>

      </main>
    </>
  );
}
