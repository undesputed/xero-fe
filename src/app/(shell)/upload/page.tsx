"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TopBar } from "@/components/layout/TopBar";
import { DropZone } from "@/components/upload/DropZone";
import {
  ingestManoMano,
  ingestManoManoDeductions,
  ingestManoManoFees,
} from "@/lib/api";

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
    value: "manomano-deductions",
    label: "ManoMano — Commission Deductions CSV",
    accept: ".csv",
    hint: "DEDUCTIONS-FROM-COMMISSIONS-*.csv (commissions withheld on refunds)",
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

// ── Page ───────────────────────────────────────────────────────────────────────

export default function UploadPage() {
  const router = useRouter();
  const [channelValue, setChannelValue] = useState("manomano");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const channel = CHANNELS.find((c) => c.value === channelValue) ?? CHANNELS[0];
  const canSubmit = file !== null && channel.active && !uploading;

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const res =
        channelValue === "manomano-fees"
          ? await ingestManoManoFees(file)
          : channelValue === "manomano-deductions"
            ? await ingestManoManoDeductions(file)
            : await ingestManoMano(file);
      // Redirect to dedicated review page
      router.push(`/review/${res.session_id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setUploading(false);
    }
  };

  return (
    <>
      <TopBar title="Upload Settlement" />
      <main className="flex-1 p-6 w-full space-y-6">

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

        {/* Error banner */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <strong>Error:</strong> {error}
          </div>
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

      </main>
    </>
  );
}
