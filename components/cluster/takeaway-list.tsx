import { SectionTitle } from "@/components/shared/section-title";

type TakeawayListProps = {
  items: string[];
};

export function TakeawayList({ items }: TakeawayListProps) {
  return (
    <section className="mb-6">
      <SectionTitle>Takeaways</SectionTitle>
      <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ol>
    </section>
  );
}
