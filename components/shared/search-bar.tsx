"use client";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  /** Shown above input when not compact. Default "Search". */
  label?: string;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  /** Extra classes for the non-compact label (e.g. muted / small). */
  labelClassName?: string;
  /** Omit label and use tighter spacing (e.g. top nav). */
  compact?: boolean;
  name?: string;
};

export function SearchBar({
  value,
  onChange,
  id = "app-search",
  label = "Search",
  placeholder = "Search…",
  className = "",
  inputClassName = "",
  labelClassName = "",
  compact = false,
  name = "q",
}: SearchBarProps) {
  const inputClasses = compact
    ? `w-full min-w-0 rounded-md border [border-color:var(--border)] [background:var(--surface2)] px-2.5 py-1.5 text-sm text-foreground placeholder:[color:var(--text-muted)] focus:[border-color:var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] ${inputClassName}`
    : `w-full rounded border [border-color:var(--border)] [background:var(--surface2)] px-3 py-2 text-sm text-foreground placeholder:[color:var(--text-muted)] focus:[border-color:var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] ${inputClassName}`;

  return (
    <div className={compact ? `min-w-0 ${className}` : `mb-4 ${className}`}>
      {!compact ? (
        <label
          htmlFor={id}
          className={`mb-1.5 block text-sm font-medium text-foreground ${labelClassName}`}
        >
          {label}
        </label>
      ) : null}
      <input
        id={id}
        name={name}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClasses}
        autoComplete="off"
      />
    </div>
  );
}
