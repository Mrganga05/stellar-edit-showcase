import useEmblaCarousel from "embla-carousel-react";
import { Star, ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { useCallback } from "react";
import { testimonials as mockTestimonials } from "@/lib/portfolio-data";
import { SectionHeading } from "./primitives";
import { useTestimonials } from "@/lib/api/hooks";

export function Testimonials() {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, align: "start" });
  const prev = useCallback(() => embla?.scrollPrev(), [embla]);
  const next = useCallback(() => embla?.scrollNext(), [embla]);
  const { data: dbTestimonials, isLoading } = useTestimonials();

  const testimonialsToRender =
    dbTestimonials && dbTestimonials.length > 0
      ? dbTestimonials.map((t) => ({
          name: t.clientName,
          company: t.company,
          quote: t.review,
          avatar: t.profileImage,
          rating: t.rating,
        }))
      : mockTestimonials;

  return (
    <section
      id="testimonials"
      className="relative mx-auto max-w-[1320px] px-6 py-24 md:px-8 md:py-32"
    >
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <SectionHeading
          align="left"
          eyebrow="Client Testimonials"
          title={
            <>
              Loved by <span className="text-gradient-brand">serious creators</span>.
            </>
          }
        />
        <div className="flex gap-2">
          <button
            onClick={prev}
            className="grid size-11 place-items-center rounded-full glass hover:bg-white/10"
            aria-label="Previous"
          >
            <ArrowLeft className="size-4" />
          </button>
          <button
            onClick={next}
            className="grid size-11 place-items-center rounded-full glass hover:bg-white/10"
            aria-label="Next"
          >
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
      <div ref={emblaRef} className="mt-12 overflow-hidden">
        <div className="flex gap-6">
          {isLoading && !dbTestimonials
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="min-w-0 flex-[0_0_100%] sm:flex-[0_0_60%] lg:flex-[0_0_40%]"
                >
                  <div className="h-64 animate-pulse rounded-3xl bg-surface/50 border border-white/5" />
                </div>
              ))
            : testimonialsToRender.map((t) => (
                <div
                  key={t.name}
                  className="min-w-0 flex-[0_0_100%] sm:flex-[0_0_60%] lg:flex-[0_0_40%]"
                >
                  <div className="flex h-full flex-col rounded-3xl glass-strong p-7">
                    <Quote className="size-7 text-electric" />
                    <p className="mt-5 text-body-text">"{t.quote}"</p>
                    <div className="mt-auto flex items-center gap-4 pt-8">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        loading="lazy"
                        width={56}
                        height={56}
                        className="size-14 rounded-full object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-white">{t.name}</div>
                        <div className="truncate text-sm text-muted-foreground">{t.company}</div>
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star key={i} className="size-3.5 fill-electric text-electric" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
