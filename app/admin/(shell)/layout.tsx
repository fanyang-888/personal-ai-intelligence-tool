"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

const NAV = [
  { href: "/admin",               label: "仪表盘",     icon: "◈" },
  { href: "/admin/pipeline-runs", label: "Pipeline",   icon: "⟳" },
  { href: "/admin/sources",       label: "信源",        icon: "⊞" },
  { href: "/admin/clusters",      label: "Clusters",   icon: "◉" },
  { href: "/admin/drafts",        label: "Drafts",     icon: "✎" },
  { href: "/admin/articles",      label: "文章",        icon: "≡" },
];

export default function AdminShellLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin-auth", { method: "DELETE" });
    router.push("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-zinc-50">
      {/* Sidebar */}
      <aside
        className="flex w-48 shrink-0 flex-col border-r bg-white"
        style={{ borderColor: "var(--sp-border)" }}
      >
        {/* Brand */}
        <div
          className="flex h-14 items-center px-4"
          style={{ background: "var(--sp-navy)", borderBottom: "1px solid var(--sp-navy-light)" }}
        >
          <span
            className="text-[18px] tracking-tight"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, color: "#a8d8f0" }}
          >
            Sip<span style={{ color: "#5dc8f5" }}>ply</span>
            <span className="ml-1.5 text-[10px] tracking-[0.1em] uppercase"
              style={{ color: "#3d7a9e", fontFamily: "sans-serif", fontWeight: 400 }}>
              Admin
            </span>
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-3">
          {NAV.map(({ href, label, icon }) => {
            const active = href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2.5 px-4 py-2 text-sm transition-colors"
                style={{
                  color: active ? "var(--sp-accent-mid)" : "#52525b",
                  background: active ? "var(--sp-chip)" : "transparent",
                  fontWeight: active ? 500 : 400,
                }}
              >
                <span className="text-[12px] opacity-60">{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t p-3" style={{ borderColor: "var(--sp-border)" }}>
          <button
            onClick={handleLogout}
            className="w-full rounded-md border px-3 py-1.5 text-xs text-zinc-500 transition-colors hover:border-zinc-300 hover:text-zinc-700"
          >
            退出登录
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="min-w-0 flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
