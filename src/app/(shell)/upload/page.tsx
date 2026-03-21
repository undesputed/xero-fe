"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { DropZone } from "@/components/upload/DropZone";
import {
  ApproveResultPanel,
  DeclinedPanel,
  ReviewPanel,
} from "@/components/review/ReviewPanel";
import {
  approveSession,
  declineSession,
  ingestManoMano,
  ingestManoManoFees,
  rerunSession,
} from "@/lib/api";
import type { ApproveResponse, PreviewDocument } from "@/lib/types";

// ── Channel configuration ──────────────────────────────────────────────────────

const CHANNELS = [
  {
    value: "manomano",
    label: "ManoMano — Settlement CSV",
    accept: ".csv",
    hint: "Semicolon-delimited settlement file (ORDER / REFUND rows)",
    active: true,
  },
  {
    value: "manomano-fees",
    label: "ManoMano — Fee Invoice PDF",
    accept: ".pdf",
    hint: "Colibri SAS PDF invoice (Subscription, Booster, Commission)",
    active: true,
  },
  {
    value: "fruugo",
    label: "Fruugo — blocked pending VAT decision",
    accept: ".csv",
    hint: null,
    active: false,
  },
  {
    value: "onbuy",
    label: "OnBuy — paused",
    accept: ".csv",
    hint: null,
    active: false,
  },
];

// ── Page state machine ─────────────────────────────────────────────────────────

type Phase =
  | { kind: "idle" }
  | {
      kind: "pending";
      sessionId: string;
      settlementRef: string;
      preview: PreviewDocument[];
    }
  | {
      kind: "approved";
      settlementRef: string;
      result: ApproveResponse;
    }
  | {
      kind: "declined";
      settlementRef: string;
    };

// ── Page ───────────────────────────────────────────────────────────────────────

export default function UploadPage() {
  const [channelValue, setChannelValue] = useState("manomano");
  const [file, setFile] = useState<File | null>(null);
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });
  const [uploading, setUploading] = useState(false);
  const [actioning, setActioning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const channel = CHANNELS.find((c) => c.value === channelValue) ?? CHANNELS[0];
  const canSubmit = file !== null && channel.active && !uploading && phase.kind === "idle";

  // ── Upload handler ────────────────────────────────────────────────────────

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const res =
        channelValue === "manomano-fees"
          ? await ingestManoManoFees(file)
          : await ingestManoMano(file);
      setPhase({
        kind: "pending",
        sessionId: res.session_id,
        settlementRef: res.settlement_ref,
        preview: res.preview,
      });
      setFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setUploading(false);
    }
  };

  // ── Session action handlers ───────────────────────────────────────────────

  const handleApprove = async () => {
    if (phase.kind !== "pending") return;
    setActioning(true);
    setError(null);
    try {
      const res = await approveSession(phase.sessionId);
      setPhase({ kind: "approved", settlementRef: phase.settlementRef, result: res });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setActioning(false);
    }
  };

  const handleDecline = async () => {
    if (phase.kind !== "pending") return;
    setActioning(true);
    setError(null);
    try {
      await declineSession(phase.sessionId);
      setPhase({ kind: "declined", settlementRef: phase.settlementRef });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setActioning(false);
    }
  };

  const handleRerun = async () => {
    if (phase.kind !== "pending") return;
    setActioning(true);
    setError(null);
    try {
      const res = await rerunSession(phase.sessionId);
      setPhase({
        kind: "pending",
        sessionId: res.session_id,
        settlementRef: res.settlement_ref,
        preview: res.preview,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setActioning(false);
    }
  };

  const handleReset = () => {
    setPhase({ kind: "idle" });
    setFile(null);
    setError(null);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <TopBar title="Upload Settlement" />
      <main className="flex-1 p-6 max-w-3xl space-y-6">

        {/* ── Step 1: Upload form (shown only in idle phase) ── */}
        {phase.kind === "idle" && (
          <>
            {/* Channel selector */}
            <section className="space-y-2">
              <label
                className="block text-sm font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                Channel
              </label>
              <select
                value={channelValue}
                onChange={(e) => {
                  setChannelValue(e.target.value);
                  setFile(null);
                  setError(null);
                }}
                className="w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--card-bg)",
                  color: "var(--text-primary)",
                }}
              >
                {CHANNELS.map((c) => (
                  <option key={c.value} value={c.value} disabled={!c.active}>
                    {c.label}
                  </option>
                ))}
              </select>

              {channel.active && channel.hint && (
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {channel.hint}
                </p>
              )}
              {!channel.active && (
                <p className="text-xs text-amber-600">
                  This channel is not yet available in Phase 1.
                </p>
              )}
            </section>

            {/* Drop zone */}
            {channel.active && (
              <DropZone
                onFile={setFile}
                accept={channel.accept}
                fileTypeLabel={channel.accept === ".pdf" ? "PDF" : "CSV"}
              />
            )}

            {/* Upload button */}
            <button
              onClick={handleUpload}
              disabled={!canSubmit}
              className="w-full rounded-lg py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-40"
              style={{ background: "var(--sidebar-active)" }}
            >
              {uploading ? "Processing…" : "Upload & Preview"}
            </button>
          </>
        )}

        {/* ── Error banner ── */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* ── Step 2: Review panel ── */}
        {phase.kind === "pending" && (
          <ReviewPanel
            sessionId={phase.sessionId}
            settlementRef={phase.settlementRef}
            preview={phase.preview}
            loading={actioning}
            onApprove={handleApprove}
            onDecline={handleDecline}
            onRerun={handleRerun}
          />
        )}

        {/* ── Step 3a: Approved ── */}
        {phase.kind === "approved" && (
          <ApproveResultPanel
            settlementRef={phase.settlementRef}
            result={phase.result}
            onUploadAnother={handleReset}
          />
        )}

        {/* ── Step 3b: Declined ── */}
        {phase.kind === "declined" && (
          <DeclinedPanel
            settlementRef={phase.settlementRef}
            onUploadAnother={handleReset}
          />
        )}
      </main>
    </>
  );
}
