import { SectionTitle } from "@/components/shared/section-title";

type WhyItMattersBlockProps = {
  text: string;
};

export function WhyItMattersBlock({ text }: WhyItMattersBlockProps) {
  return (
    <section className="mb-6">
      <SectionTitle>Why it matters</SectionTitle>
      <p className="text-sm leading-relaxed text-foreground">{text}</p>
    </section>
  );
}
