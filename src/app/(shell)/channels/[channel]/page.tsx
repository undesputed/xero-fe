"use client";

import { use } from "react";
import { TopBar } from "@/components/layout/TopBar";

const CHANNEL_LABELS: Record<string, string> = {
  fruugo:      "Fruugo",
  onbuy:       "OnBuy",
  "amazon-uk": "Amazon UK",
  "amazon-eu": "Amazon EU",
  ebay:        "eBay",
  shopify:     "Shopify",
  bq:          "B&Q",
  debenhams:   "Debenhams",
  tesco:       "Tesco",
  therange:    "The Range",
};

export default function ChannelPage({
  params,
}: {
  params: Promise<{ channel: string }>;
}) {
  const { channel } = use(params);
  const label = CHANNEL_LABELS[channel] ?? channel;

  return (
    <>
      <TopBar title={label} />
      <main className="flex-1 p-6 flex items-center justify-center">
        <div
          className="rounded-xl border p-8 text-center max-w-sm w-full"
          style={{ borderColor: "var(--border)", background: "var(--card-bg)" }}
        >
          <p className="text-2xl mb-4">&#x1F527;</p>
          <p className="text-base font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
            Automation Pending
          </p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {label} is processed automatically via AWS Lambda on a schedule.
            This channel is not yet connected — pipeline setup is in progress.
          </p>
        </div>
      </main>
    </>
  );
}
