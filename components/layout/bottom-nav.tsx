"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  {
    href: "/",
    label: "Digest",
    matchExact: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" width={22} height={22}>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    href: "/archive",
    label: "Archive",
    matchExact: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" width={22} height={22}>
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    href: "/#draft-of-the-day",
    label: "Draft",
    matchPrefix: "/draft",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" width={22} height={22}>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
  {
    href: "/archive",
    label: "Search",
    matchExact: false,
    searchTab: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" width={22} height={22}>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
];

export function BottomNav() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <nav
      className="sm:hidden fixed bottom-0 left-0 right-0 z-50 flex"
      style={{ background: "var(--sp-navy)", borderTop: "1px solid #1a3d57" }}
      aria-label="Main navigation"
    >
      {tabs.map((tab) => {
        const active =
          tab.matchExact
            ? pathname === tab.href
            : tab.matchPrefix
              ? pathname.startsWith(tab.matchPrefix)
              : false;

        return (
          <Link
            key={tab.label}
            href={tab.href}
            className="flex flex-1 flex-col items-center gap-1 py-2"
            style={{ paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom, 0px))" }}
          >
            <span style={{ stroke: active ? "#5dc8f5" : "#3d6a88" }}>{tab.icon}</span>
            <span
              style={{
                fontSize: "9px",
                letterSpacing: "0.04em",
                color: active ? "#5dc8f5" : "#3d6a88",
              }}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
