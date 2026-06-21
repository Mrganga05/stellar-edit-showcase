import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs as mockFaqs } from "@/lib/portfolio-data";
import { SectionHeading, Reveal } from "./primitives";
import { useFaqs } from "@/lib/api/hooks";

export function FAQ() {
  const { data: dbFaqs, isLoading } = useFaqs();

  const faqsToRender =
    dbFaqs && dbFaqs.length > 0
      ? dbFaqs.map((f) => ({
          q: f.question,
          a: f.answer,
        }))
      : mockFaqs;

  return (
    <section className="relative mx-auto max-w-4xl px-5 py-28 sm:px-8 sm:py-36">
      <SectionHeading
        eyebrow="FAQ"
        title={
          <>
            Answers, before you <span className="text-gradient-brand">ask</span>.
          </>
        }
      />
      <Reveal>
        <Accordion type="single" collapsible className="mt-12 space-y-3">
          {isLoading && !dbFaqs
            ? Array.from({ length: 3 }).map((_, i) => (
                <AccordionItem key={i} value={`i${i}`} className="rounded-2xl glass px-5">
                  <div className="h-14 animate-pulse rounded-2xl bg-surface/50 border border-white/5 my-2" />
                </AccordionItem>
              ))
            : faqsToRender.map((f, i) => (
                <AccordionItem key={f.q} value={`i${i}`} className="rounded-2xl glass px-5">
                  <AccordionTrigger className="py-5 text-left text-base font-medium hover:no-underline sm:text-lg">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
        </Accordion>
      </Reveal>
    </section>
  );
}
