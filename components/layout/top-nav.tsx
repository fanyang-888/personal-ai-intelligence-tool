import Link from "next/link";
import { TopNavSearch } from "@/components/layout/top-nav-search";

const linkClass =
  "shrink-0 text-sm font-medium text-foreground underline-offset-4 hover:text-emerald-800 hover:underline";

export function TopNav() {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="shrink-0 text-sm font-semibold tracking-tight text-foreground"
        >
          Personal AI Intelligence
        </Link>
        <nav
          className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm"
          aria-label="Main"
        >
          <Link href="/" className={linkClass}>
            Daily Digest
          </Link>
          <Link href="/archive" className={linkClass}>
            Archive
          </Link>
          <Link href="/#draft-of-the-day" className={linkClass}>
            Draft of the Day
          </Link>
        </nav>
        <div className="flex min-w-0 flex-1 basis-full sm:basis-[min(100%,12rem)] sm:justify-end">
          <TopNavSearch />
        </div>
      </div>
    </header>
  );
}
