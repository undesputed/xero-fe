import type { ReactNode } from "react";

interface TopBarProps {
  title: string;
  breadcrumb?: string;
  actions?: ReactNode;
}

export function TopBar({ title, breadcrumb, actions }: TopBarProps) {
  return (
    <header
      className="sticky top-0 z-10 h-14 flex items-center justify-between px-6 border-b"
      style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}
    >
      <div>
        {breadcrumb && (
          <p className="text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>
            {breadcrumb}
          </p>
        )}
        <h1 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
          {title}
        </h1>
      </div>
      {actions && (
        <div className="flex items-center gap-2">{actions}</div>
      )}
    </header>
  );
}
