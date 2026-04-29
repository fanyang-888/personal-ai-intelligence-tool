import type { Metadata } from "next";
import { AppProviders } from "@/components/app-providers";
import { TopNav } from "@/components/layout/top-nav";
import { BottomNav } from "@/components/layout/bottom-nav";
import { PageShell } from "@/components/layout/page-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Sipply — Personal AI Intelligence",
    template: "%s | Sipply",
  },
  description: "AI-curated insights served fresh each morning — drink in what matters, set aside the rest.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <AppProviders>
          <TopNav />
          <PageShell>{children}</PageShell>
          <BottomNav />
        </AppProviders>
      </body>
    </html>
  );
}
