import type { SettlementStatus } from "@/lib/types";

type BadgeStatus = SettlementStatus | "APPROVED" | "DECLINED";

interface StatusBadgeProps {
  status: BadgeStatus;
}

interface BadgeConfig {
  label: string;
  dot: string;
  bg: string;
  text: string;
  pulse?: boolean;
}

const CONFIG: Record<BadgeStatus, BadgeConfig> = {
  COMPLETE:    { label: "Complete",    dot: "var(--status-done)",    bg: "#e6faf5", text: "#00664d" },
  APPROVED:    { label: "Approved",    dot: "var(--status-done)",    bg: "#e6faf5", text: "#00664d" },
  PENDING:     { label: "Pending",     dot: "var(--status-pending)", bg: "#fff8e6", text: "#8a5700" },
  IN_PROGRESS: { label: "In Progress", dot: "var(--accent)",         bg: "#e8f8fd", text: "#096b8a", pulse: true },
  FAILED:      { label: "Failed",      dot: "var(--status-failed)",  bg: "#fef2f2", text: "#991b1b" },
  SKIPPED:     { label: "Skipped",     dot: "var(--status-paused)",  bg: "#f8fafc", text: "#475569" },
  PAUSED:      { label: "Paused",      dot: "var(--status-paused)",  bg: "#f8fafc", text: "#475569" },
  DECLINED:    { label: "Declined",    dot: "#f97316",               bg: "#fff7ed", text: "#9a3412" },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const cfg = CONFIG[status] ?? CONFIG.SKIPPED;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ background: cfg.bg, color: cfg.text }}
    >
      <span
        className={cfg.pulse ? "animate-pulse" : ""}
        style={{
          display: "inline-block",
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: cfg.dot,
          flexShrink: 0,
        }}
      />
      {cfg.label}
    </span>
  );
}
