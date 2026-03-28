"use client";

import {
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  List,
  Clock,
  Settings,
  Store,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const CHANNELS = [
  { value: "manomano",   label: "ManoMano",   manual: true },
  { value: "fruugo",     label: "Fruugo",     manual: false },
  { value: "onbuy",      label: "OnBuy",      manual: false },
  { value: "amazon-uk",  label: "Amazon UK",  manual: false },
  { value: "amazon-eu",  label: "Amazon EU",  manual: false },
  { value: "ebay",       label: "eBay",        manual: false },
  { value: "shopify",    label: "Shopify",    manual: false },
  { value: "bq",         label: "B&Q",         manual: false },
  { value: "debenhams",  label: "Debenhams",  manual: false },
  { value: "tesco",      label: "Tesco",      manual: false },
  { value: "therange",   label: "The Range",  manual: false },
];

const MANUAL_SUB_ITEMS = [
  { href: "upload", label: "Upload" },
  { href: "review", label: "Review" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [expandedChannel, setExpandedChannel] = useState<string | null>(null);

  // Keep the channel expanded when navigating to its sub-pages,
  // but don't collapse when navigating elsewhere (e.g. /review/[sessionId])
  useEffect(() => {
    const match = CHANNELS.find((c) => pathname.startsWith(`/channels/${c.value}`));
    if (match) setExpandedChannel(match.value);
  }, [pathname]);

  const isActive = (href: string) => pathname.startsWith(href);
  const isChannelActive = (channel: string) =>
    pathname.startsWith(`/channels/${channel}`);

  const topItems = [
    { href: "/dashboard",   label: "Dashboard",   icon: LayoutDashboard },
    { href: "/sessions",    label: "Sessions",    icon: Clock },
    { href: "/settlements", label: "Settlements", icon: List },
  ];

  const bottomItems = [
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside
      className="fixed inset-y-0 left-0 w-64 flex flex-col"
      style={{ background: "var(--sidebar-bg)" }}
    >
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-white/10">
        <span
          className="h-2.5 w-2.5 rounded-full flex-shrink-0"
          style={{ background: "var(--sidebar-active)" }}
        />
        <span className="text-white font-semibold text-sm tracking-wide">KU Pipeline</span>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">

        {/* Top items */}
        {topItems.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
              style={
                active
                  ? { background: "var(--sidebar-active)", color: "#fff" }
                  : { color: "var(--sidebar-text)" }
              }
              onMouseEnter={e => {
                if (!active) (e.currentTarget as HTMLElement).style.background = "var(--sidebar-hover)";
              }}
              onMouseLeave={e => {
                if (!active) (e.currentTarget as HTMLElement).style.background = "";
              }}
            >
              <Icon size={16} className="flex-shrink-0" />
              <span className="flex-1">{label}</span>
            </Link>
          );
        })}

        {/* Channels section */}
        <div className="pt-3 pb-1">
          <p className="px-3 text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--sidebar-text)", opacity: 0.5 }}>
            Channels
          </p>
        </div>

        {CHANNELS.map((channel) => {
          const channelActive = isChannelActive(channel.value);
          const isExpanded = expandedChannel === channel.value;

          if (channel.manual) {
            // Expandable channel with sub-items
            return (
              <div key={channel.value}>
                <button
                  onClick={() => setExpandedChannel(isExpanded ? null : channel.value)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                  style={
                    channelActive
                      ? { background: "var(--sidebar-active)", color: "#fff" }
                      : { color: "var(--sidebar-text)" }
                  }
                  onMouseEnter={e => {
                    if (!channelActive) (e.currentTarget as HTMLElement).style.background = "var(--sidebar-hover)";
                  }}
                  onMouseLeave={e => {
                    if (!channelActive) (e.currentTarget as HTMLElement).style.background = "";
                  }}
                >
                  <Store size={16} className="flex-shrink-0" />
                  <span className="flex-1 text-left">{channel.label}</span>
                  {isExpanded
                    ? <ChevronDown size={14} />
                    : <ChevronRight size={14} />
                  }
                </button>

                {isExpanded && (
                  <div className="ml-4 mt-0.5 space-y-0.5">
                    {MANUAL_SUB_ITEMS.map((sub) => {
                      const subHref = `/channels/${channel.value}/${sub.href}`;
                      const subActive = pathname.startsWith(subHref);
                      return (
                        <Link
                          key={sub.href}
                          href={subHref}
                          className="flex items-center gap-2 pl-5 pr-3 py-2 rounded-lg text-sm font-medium transition-colors"
                          style={
                            subActive
                              ? { background: "var(--sidebar-active)", color: "#fff" }
                              : { color: "var(--sidebar-text)", opacity: 0.85 }
                          }
                          onMouseEnter={e => {
                            if (!subActive) (e.currentTarget as HTMLElement).style.background = "var(--sidebar-hover)";
                          }}
                          onMouseLeave={e => {
                            if (!subActive) (e.currentTarget as HTMLElement).style.background = "";
                          }}
                        >
                          {sub.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          // Non-expandable channel (automation pending)
          return (
            <Link
              key={channel.value}
              href={`/channels/${channel.value}`}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
              style={
                channelActive
                  ? { background: "var(--sidebar-active)", color: "#fff" }
                  : { color: "var(--sidebar-text)" }
              }
              onMouseEnter={e => {
                if (!channelActive) (e.currentTarget as HTMLElement).style.background = "var(--sidebar-hover)";
              }}
              onMouseLeave={e => {
                if (!channelActive) (e.currentTarget as HTMLElement).style.background = "";
              }}
            >
              <Store size={16} className="flex-shrink-0" />
              <span className="flex-1">{channel.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom nav */}
      <div className="px-3 pb-4 pt-3 border-t border-white/10 space-y-0.5">
        {bottomItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
            style={{ color: "var(--sidebar-text)" }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = "var(--sidebar-hover)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = "";
            }}
          >
            <Icon size={16} className="flex-shrink-0" />
            {label}
          </Link>
        ))}
      </div>
    </aside>
  );
}
