import { Youtube, Smartphone, Instagram, Mic, Wand2, Palette, Megaphone, Hash } from "lucide-react";
import { SectionHeading, Reveal } from "./primitives";
import { useServices } from "@/lib/api/hooks";

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  Youtube,
  Smartphone,
  Instagram,
  Mic,
  Wand2,
  Palette,
  Megaphone,
  Hash,
};

const mockServices = [
  {
    icon: Youtube,
    title: "YouTube Editing",
    desc: "Long-form retention-first edits that grow channels.",
  },
  {
    icon: Smartphone,
    title: "Shorts Editing",
    desc: "Hook-first vertical edits engineered to loop.",
  },
  {
    icon: Instagram,
    title: "Reels Editing",
    desc: "Editorial reels with kinetic motion and grade.",
  },
  { icon: Mic, title: "Podcast Editing", desc: "Multi-cam + broadcast-grade audio mastering." },
  { icon: Wand2, title: "Motion Graphics", desc: "Custom animation, lower thirds, kinetic type." },
  { icon: Palette, title: "Color Grading", desc: "Cinematic LUTs and bespoke color science." },
  {
    icon: Megaphone,
    title: "Commercial Ads",
    desc: "30s spots built to convert on every platform.",
  },
  {
    icon: Hash,
    title: "Social Content",
    desc: "TikTok, X, LinkedIn — native edits, native results.",
  },
];

export function Services() {
  const { data: dbServices, isLoading } = useServices();

  const servicesToRender =
    dbServices && dbServices.length > 0
      ? dbServices.map((s) => ({
          icon: ICON_MAP[s.iconKey] ?? Hash,
          title: s.title,
          desc: s.description,
        }))
      : mockServices;

  return (
    <section id="services" className="relative mx-auto max-w-[1320px] px-6 py-24 md:px-8 md:py-32">
      <SectionHeading
        eyebrow="Services"
        title={
          <>
            One editor. <span className="text-gradient-brand">Every surface</span>.
          </>
        }
        subtitle="A full creative service for serious operators — from one-off cuts to monthly retainers."
      />
      <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {isLoading && !dbServices
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-44 animate-pulse rounded-2xl bg-surface/50 border border-white/5"
              />
            ))
          : servicesToRender.map((s, i) => (
              <Reveal key={s.title} delay={(i % 4) * 0.05}>
                <div className="group relative h-full overflow-hidden rounded-xl sm:rounded-2xl glass p-3.5 sm:p-6 transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:glow-blue">
                  <div className="pointer-events-none absolute -right-12 -top-12 size-32 rounded-full bg-electric/20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative">
                    <div className="grid size-9 sm:size-12 place-items-center rounded-lg sm:rounded-xl bg-gradient-to-br from-electric/20 to-violet-glow/20 text-electric">
                      <s.icon className="size-4 sm:size-5" />
                    </div>
                    <h3 className="mt-3 sm:mt-5 text-xs min-[375px]:text-sm sm:text-card-title text-white font-semibold">
                      {s.title}
                    </h3>
                    <p className="mt-1 sm:mt-2 text-[10px] min-[375px]:text-xs sm:text-small-body text-neutral-400 leading-normal">
                      {s.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
      </div>
    </section>
  );
}
