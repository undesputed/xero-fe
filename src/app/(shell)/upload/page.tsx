"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TopBar } from "@/components/layout/TopBar";
import { DropZone } from "@/components/upload/DropZone";
import { ingestManoMano } from "@/lib/api";

// Only CSV channels require manual upload — all API channels (Amazon, Mirakl, eBay, Shopify)
// are triggered automatically on a schedule via AWS Lambda.
const CHANNELS = [
  { value: "manomano", label: "ManoMano — Settlement CSV", accept: ".csv", hint: "Semicolon-delimited settlement file (ORDER / REFUND / SUBSCRIPTION / BOOSTER / REFUND_PENALTY rows)" },
  { value: "fruugo",   label: "Fruugo — Settlement CSV",   accept: ".csv", hint: "Settlement CSV (VAT treatment pending confirmation)"  },
  { value: "onbuy",    label: "OnBuy — Settlement CSV",    accept: ".csv", hint: "Settlement CSV (channel currently paused)"            },
];

const STEPS = [
  { n: 1, title: "Parse",   body: "File is validated and rows are extracted into structured line items." },
  { n: 2, title: "Preview", body: "Xero documents are generated for your review — nothing is posted yet." },
  { n: 3, title: "Review",  body: "Inspect each invoice, bill, and credit note before approving." },
  { n: 4, title: "Push",    body: "Approved documents are posted to Xero with idempotency protection." },
];

export default function UploadPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialChannel = CHANNELS.find((c) => c.value === searchParams.get("channel"))?.value ?? "manomano";
  const [channelValue, setChannelValue] = useState(initialChannel);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const channel = CHANNELS.find((c) => c.value === channelValue) ?? CHANNELS[0];

  async function handleUpload() {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const result = await ingestManoMano(file);
      router.push(`/review/${result.session_id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setLoading(false);
    }
  }

  return (
    <>
      <TopBar title="Upload Settlement File" />
      <main className="flex-1 p-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">

          {/* ── Left column: selector + dropzone ─────────────────────────────── */}
          <div className="space-y-5">

            {/* Channel selector */}
            <div
              className="rounded-xl border p-5 space-y-4"
              style={{ borderColor: "var(--border)", background: "var(--card-bg)" }}
            >
              <div>
                <label
                  className="block text-sm font-semibold mb-1.5"
                  style={{ color: "var(--text-primary)" }}
                >
                  Select channel
                </label>
                <select
                  value={channelValue}
                  onChange={(e) => { setChannelValue(e.target.value); setFile(null); }}
                  className="w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
                  style={{
                    borderColor: "var(--border)",
                    background: "#f8fafc",
                    color: "var(--text-primary)",
                  }}
                >
                  {CHANNELS.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
                {channel.hint && (
                  <p className="text-xs mt-1.5" style={{ color: "var(--text-muted)" }}>
                    {channel.hint}
                  </p>
                )}
              </div>

              <div>
                <p className="text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>
                  Accepted file type
                </p>
                <span
                  className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold"
                  style={{ background: "#e8f8fd", color: "var(--accent)" }}
                >
                  {channel.accept.toUpperCase().replace(".", "")}
                </span>
              </div>
            </div>

            {/* Drop zone */}
            <DropZone
              onFile={setFile}
              accept={channel.accept}
              fileTypeLabel="CSV"
            />

            {/* Error message */}
            {error && (
              <p className="text-sm rounded-lg px-3 py-2" style={{ background: "#fef2f2", color: "#dc2626" }}>
                {error}
              </p>
            )}

            {/* Upload button */}
            <button
              disabled={file === null || loading}
              onClick={handleUpload}
              className="w-full rounded-lg py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-40"
              style={{ background: "var(--accent)" }}
            >
              {loading ? "Uploading…" : "Upload & Push to Xero"}
            </button>

          </div>

          {/* ── Right column: explainer card ─────────────────────────────────── */}
          <div
            className="rounded-xl border p-5 h-fit"
            style={{ borderColor: "var(--border)", background: "var(--card-bg)" }}
          >
            <p className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
              What happens next
            </p>
            <div className="space-y-4">
              {STEPS.map((step) => (
                <div key={step.n} className="flex gap-3">
                  <span
                    className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white"
                    style={{ background: "var(--accent)" }}
                  >
                    {step.n}
                  </span>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                      {step.title}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </>
  );
}
