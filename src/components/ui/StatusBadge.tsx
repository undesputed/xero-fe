import type { SettlementStatus } from "@/lib/types";

const CONFIG: Record<SettlementStatus, { label: string; dot: string; bg: string; text: string }> = {
  COMPLETE: { label: "Complete", dot: "#10b981", bg: "#f0fdf4", text: "#166534" },
  PENDING: { label: "Pending", dot: "#f59e0b", bg: "#fffbeb", text: "#92400e" },
  IN_PROGRESS: { label: "In Progress", dot: "#3b82f6", bg: "#eff6ff", text: "#1e40af" },
  FAILED: { label: "Failed", dot: "#ef4444", bg: "#fef2f2", text: "#991b1b" },
  SKIPPED: { label: "Skipped", dot: "#94a3b8", bg: "#f8fafc", text: "#475569" },
  PAUSED: { label: "Paused", dot: "#94a3b8", bg: "#f8fafc", text: "#475569" },
};

interface StatusBadgeProps {
  status: SettlementStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const cfg = CONFIG[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ background: cfg.bg, color: cfg.text }}
    >
      <span
        className={status === "IN_PROGRESS" ? "animate-pulse" : ""}
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: cfg.dot,
          flexShrink: 0,
          display: "inline-block",
          border: status === "PAUSED" ? "1px dashed #94a3b8" : "none",
        }}
      />
      {cfg.label}
    </span>
  );
}
