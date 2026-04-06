"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { uiTextLinkPrimary } from "@/lib/ui/classes";

type BackLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export function BackLink({ href, children, className = "" }: BackLinkProps) {
  return (
    <Link href={href} className={`${uiTextLinkPrimary} ${className}`.trim()}>
      {children}
    </Link>
  );
}
