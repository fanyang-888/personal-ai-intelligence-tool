import Link from "next/link";

const linkClass = "text-sm font-medium text-foreground underline-offset-4 hover:underline";

export function TopNav() {
  return (
    <header className="border-b border-zinc-200 bg-background">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="text-sm font-semibold text-foreground">
          Personal AI Intelligence
        </Link>
        <nav className="flex items-center gap-4" aria-label="Main">
          <Link href="/" className={linkClass}>
            Daily Digest
          </Link>
          <Link href="/archive" className={linkClass}>
            Archive
          </Link>
        </nav>
      </div>
    </header>
  );
}
