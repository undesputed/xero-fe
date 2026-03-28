"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Loader } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { DropZone } from "@/components/upload/DropZone";
import { ingestManoMano } from "@/lib/api";

type UploadStatus = "idle" | "uploading" | "done" | "error";

export default function ManoManoUploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const canUpload = file !== null && status !== "uploading";

  async function handleUpload() {
    if (!canUpload) return;
    setStatus("uploading");
    setErrorMsg("");

    try {
      const result = await ingestManoMano(file!);
      setStatus("done");
      router.push(`/review/${result.session_id}`);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Upload failed");
      setStatus("error");
    }
  }

  return (
    <>
      <TopBar title="ManoMano — Upload Settlement" />
      <main className="flex-1 p-6">
        <div className="max-w-2xl space-y-6">

          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Upload the ManoMano settlement CSV. All document types — sales invoice,
            credit notes, and fee bill — are generated from this single file.
          </p>

          <div
            className="rounded-xl border overflow-hidden"
            style={{ borderColor: status === "error" ? "#fca5a5" : "var(--border)" }}
          >
            {/* Header */}
            <div
              className="px-5 py-3 border-b flex items-center gap-3"
              style={{ background: "#f8fafc", borderColor: "var(--border)" }}
            >
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  Settlement CSV
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  Semicolon-delimited — ORDER, REFUND, SUBSCRIPTION, BOOSTER, REFUND_PENALTY rows
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold"
                  style={{ background: "#e8f8fd", color: "var(--accent)" }}
                >
                  CSV
                </span>
                {status === "uploading" && (
                  <Loader size={14} className="animate-spin" style={{ color: "var(--accent)" }} />
                )}
                {status === "done" && (
                  <CheckCircle size={14} style={{ color: "#16a34a" }} />
                )}
                {status === "error" && (
                  <XCircle size={14} style={{ color: "#dc2626" }} />
                )}
              </div>
            </div>

            {/* Dropzone */}
            <div className="p-4">
              <DropZone onFile={setFile} accept=".csv" fileTypeLabel="CSV" />
              {errorMsg && (
                <p className="text-xs mt-2 px-2 py-1 rounded" style={{ background: "#fef2f2", color: "#dc2626" }}>
                  {errorMsg}
                </p>
              )}
            </div>
          </div>

          <button
            disabled={!canUpload}
            onClick={handleUpload}
            className="w-full rounded-lg py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-40"
            style={{ background: "var(--accent)" }}
          >
            {status === "uploading" ? "Uploading…" : "Upload & Push to Xero"}
          </button>

        </div>
      </main>
    </>
  );
}
