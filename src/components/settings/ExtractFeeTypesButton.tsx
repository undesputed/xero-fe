"use client";

import { useState } from "react";
import { Download } from "lucide-react";

type RunState = "idle" | "loading" | "success" | "error";

type FeeTypeEntry = {
  value: string;
  category: string;
  xero_doc: string;
};

type ChannelTypes = {
  channel: string;
  types: FeeTypeEntry[];
};

function toCSV(channels: ChannelTypes[]): string {
  const header = "channel,value,category,xero_doc";
  const rows = channels.flatMap(({ channel, types }) =>
    types.map(({ value, category, xero_doc }) => `${channel},${value},${category},${xero_doc}`)
  );
  return [header, ...rows].join("\n");
}

function downloadCSV(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function ExtractFeeTypesButton() {
  const [state, setState] = useState<RunState>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleClick() {
    setState("loading");
    setMessage(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/channels/types`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      const csv = toCSV(data.channels);
      downloadCSV(csv, "fee-types.csv");
      setState("success");
      setMessage("fee-types.csv downloaded.");
    } catch {
      setState("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  const isLoading = state === "loading";

  return (
    <div
      className="rounded-xl border p-5"
      style={{ borderColor: "var(--border)", background: "var(--card-bg)" }}
    >
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Extract Fee Types
        </h3>
        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
          Download all marketplace fee type definitions as a CSV file.
        </p>
      </div>

      {/* Button row */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleClick}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-opacity disabled:opacity-60"
          style={{
            background: "var(--accent)",
            color: "#fff",
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          {isLoading ? (
            <>
              <span
                className="inline-block h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin"
                aria-hidden
              />
              Extracting…
            </>
          ) : (
            <>
              <Download size={14} />
              Extract Fee Types
            </>
          )}
        </button>

        {/* Inline feedback */}
        {message && (
          <span
            className="text-xs font-medium"
            style={{
              color:
                state === "success"
                  ? "var(--status-done)"
                  : "var(--status-failed)",
            }}
          >
            {state === "success" ? "✓ " : "✕ "}
            {message}
          </span>
        )}
      </div>
    </div>
  );
}
