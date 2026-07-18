import {
  Clapperboard,
  Youtube,
  Sparkles,
  Megaphone,
  Film,
  Wand2,
  Globe,
  Box,
  Bot,
  Mic,
  Smartphone,
  Instagram,
  Palette,
  Hash,
} from "lucide-react";
import { SectionHeading, Reveal } from "./primitives";
import { useServices } from "@/lib/api/hooks";

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  Clapperboard,
  Youtube,
  Sparkles,
  Megaphone,
  Film,
  Wand2,
  Globe,
  Box,
  Bot,
  Mic,
  Smartphone,
  Instagram,
  Palette,
  Hash,
};

const mockServices = [
  {
    icon: Clapperboard,
    title: "Short-Form Editing",
    desc: "High-retention vertical edits engineered to stop scrolling and maximize engagement.",
  },
  {
    icon: Youtube,
    title: "Long-Form Editing",
    desc: "Retention-first YouTube editing designed to increase watch time and audience growth.",
  },
  {
    icon: Sparkles,
    title: "Motion Graphics",
    desc: "Premium animations, kinetic typography, branded graphics, and visual storytelling.",
  },
  {
    icon: Megaphone,
    title: "Commercial Ads",
    desc: "High-converting ad creatives built for Meta, Google, YouTube, and TikTok.",
  },
  {
    icon: Film,
    title: "Cinematic Editing",
    desc: "Luxury cinematic edits with professional color grading and premium finishing.",
  },
  {
    icon: Wand2,
    title: "AI Editing",
    desc: "AI-assisted editing workflows that accelerate production without sacrificing quality.",
  },
  {
    icon: Globe,
    title: "Website Development",
    desc: "Fast, responsive, SEO-optimized websites built to convert visitors into customers.",
  },
  {
    icon: Box,
    title: "3D Web Experiences",
    desc: "Immersive interactive websites powered by modern 3D technologies and smooth animations.",
  },
  {
    icon: Bot,
    title: "AI Automation",
    desc: "Automate repetitive workflows, lead management, and business operations using AI.",
  },
  {
    icon: Mic,
    title: "AI Voice Agents",
    desc: "24/7 AI voice assistants for sales, customer support, bookings, and lead qualification.",
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
            One partner. <span className="text-gradient-brand">Every digital solution.</span>
          </>
        }
        subtitle="A premium creative and AI technology studio helping brands scale through world-class content, intelligent automation, and modern digital experiences."
      />
      <div className="mt-16 grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-6">
        {isLoading && !dbServices
          ? Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-44 animate-pulse rounded-2xl bg-surface/50 border border-white/5"
              />
            ))
          : servicesToRender.map((s, i) => (
              <Reveal key={s.title} delay={(i % 5) * 0.05}>
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

