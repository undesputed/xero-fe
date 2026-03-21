const CHANNEL_COLORS: Record<string, { bg: string; text: string }> = {
  manomano: { bg: "#fef3c7", text: "#92400e" },
  "b&q": { bg: "#e0f2fe", text: "#0c4a6e" },
  debenhams: { bg: "#fce7f3", text: "#831843" },
  tesco: { bg: "#dcfce7", text: "#14532d" },
  "the range": { bg: "#f3e8ff", text: "#581c87" },
  ebay: { bg: "#fff7ed", text: "#7c2d12" },
  shopify: { bg: "#f0fdf4", text: "#166534" },
  "amazon uk": { bg: "#fff3cd", text: "#663c00" },
  "amazon eu": { bg: "#fef9c3", text: "#713f12" },
  fruugo: { bg: "#ede9fe", text: "#4c1d95" },
  onbuy: { bg: "#fdf4ff", text: "#701a75" },
};

interface ChannelBadgeProps {
  channel: string;
}

export function ChannelBadge({ channel }: ChannelBadgeProps) {
  const key = channel.toLowerCase();
  const cfg = CHANNEL_COLORS[key] ?? { bg: "#f1f5f9", text: "#475569" };
  return (
    <span
      className="inline-block px-2 py-0.5 rounded text-xs font-medium capitalize"
      style={{ background: cfg.bg, color: cfg.text }}
    >
      {channel}
    </span>
  );
}
