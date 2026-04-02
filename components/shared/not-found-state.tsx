import Link from "next/link";

type NotFoundStateProps = {
  title?: string;
  message?: string;
};

export function NotFoundState({
  title = "Not found",
  message = "We could not find that page or item.",
}: NotFoundStateProps) {
  return (
    <div className="rounded border border-zinc-200 px-4 py-8 text-center">
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      <p className="mt-2 text-sm text-zinc-600">{message}</p>
      <Link href="/" className="mt-4 inline-block text-sm font-medium underline">
        Back to Daily Digest
      </Link>
    </div>
  );
}
