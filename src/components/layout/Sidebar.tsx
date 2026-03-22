"use client";

import { LayoutDashboard, List, Settings, Upload, Clock } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/settlements", label: "Settlements", icon: List },
  { href: "/sessions", label: "Sessions", icon: Clock },
  { href: "/upload", label: "Upload CSV", icon: Upload },
];

const bottomItems = [{ href: "/settings", label: "Settings", icon: Settings }];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <aside className="fixed inset-y-0 left-0 w-60 flex flex-col" style={{ background: "var(--sidebar-bg)" }}>
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-slate-700">
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--sidebar-active)" }} />
        <span className="text-white font-semibold text-sm tracking-wide">KU Pipeline</span>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={[
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              isActive(href)
                ? "text-white"
                : "hover:bg-slate-800",
            ].join(" ")}
            style={
              isActive(href)
                ? { background: "var(--sidebar-active)", color: "#fff" }
                : { color: "var(--sidebar-text)" }
            }
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Bottom nav */}
      <div className="px-3 pb-4 border-t border-slate-700 pt-3 space-y-0.5">
        {bottomItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-slate-800"
            style={{ color: "var(--sidebar-text)" }}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </div>
    </aside>
  );
}
