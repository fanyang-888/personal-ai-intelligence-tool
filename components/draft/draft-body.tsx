type DraftBodyProps = {
  text: string;
};

export function DraftBody({ text }: DraftBodyProps) {
  return (
    <div className="mb-6 whitespace-pre-wrap rounded border border-zinc-200 bg-zinc-50 p-4 text-sm leading-relaxed text-foreground">
      {text}
    </div>
  );
}
