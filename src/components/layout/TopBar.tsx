interface TopBarProps {
  title: string;
  breadcrumb?: string;
}

export function TopBar({ title, breadcrumb }: TopBarProps) {
  return (
    <header
      className="h-14 flex items-center px-6 border-b"
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
    </header>
  );
}
