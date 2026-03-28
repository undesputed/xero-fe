interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: "red" | "green" | "blue";
}

export function StatCard({ label, value, sub, accent }: StatCardProps) {
  const valueColor =
    accent === "red"   ? "var(--status-failed)" :
    accent === "green" ? "var(--status-done)"   :
    accent === "blue"  ? "var(--accent)"        :
    "var(--text-primary)";

  return (
    <div
      className="rounded-2xl p-5 border"
      style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}
    >
      <p className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: "var(--text-muted)" }}>
        {label}
      </p>
      <p className="text-2xl font-bold" style={{ color: valueColor }}>
        {value}
      </p>
      {sub && (
        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
          {sub}
        </p>
      )}
    </div>
  );
}
