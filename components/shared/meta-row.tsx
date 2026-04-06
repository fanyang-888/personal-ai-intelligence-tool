import type { ReactNode } from "react";

export type MetaRowItem = {
  label: ReactNode;
  value: ReactNode;
  key?: string;
  /** Hide label visually but keep for assistive tech (e.g. card stat rows). */
  labelSrOnly?: boolean;
};

type MetaRowProps = {
  items: MetaRowItem[];
  className?: string;
  /** Use denser text for card footers. */
  dense?: boolean;
};

/**
 * Horizontal metadata (label + value pairs). Prefer with sr-only labels where needed.
 */
export function MetaRow({ items, className = "", dense = false }: MetaRowProps) {
  const textCls = dense ? "text-xs text-zinc-500" : "text-sm text-zinc-600";
  return (
    <dl
      className={`flex flex-wrap gap-x-4 gap-y-1 ${textCls} ${className}`.trim()}
    >
      {items.map((item, i) => (
        <div key={item.key ?? String(i)} className="flex flex-wrap gap-x-1.5">
          <dt
            className={
              item.labelSrOnly ? "sr-only" : "font-medium text-zinc-500"
            }
          >
            {item.label}
          </dt>
          <dd className="text-foreground">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
