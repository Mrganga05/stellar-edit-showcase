import {
  Target,
  Rocket,
  Zap,
  Handshake,
  Film,
  TrendingUp,
  Gem,
  Flame,
} from "lucide-react";
import { SectionHeading, Reveal } from "./primitives";

const items = [
  {
    icon: Target,
    title: "🎯 Retention-First Editing",
    desc: "Every cut is crafted to maximize watch time, audience retention, and viewer engagement.",
  },
  {
    icon: Rocket,
    title: "🚀 Content That Performs",
    desc: "Videos engineered to generate more clicks, shares, and meaningful audience growth.",
  },
  {
    icon: Zap,
    title: "⚡ 48-Hour Delivery",
    desc: "Fast turnaround without compromising quality, storytelling, or attention to detail.",
  },
  {
    icon: Handshake,
    title: "🤝 White-Glove Collaboration",
    desc: "Clear communication, proactive updates, and a seamless client experience from start to finish.",
  },
  {
    icon: Film,
    title: "🎬 Cinematic Quality",
    desc: "Premium color grading, polished sound, and professional finishing that elevates every frame.",
  },
  {
    icon: TrendingUp,
    title: "📈 Built for Growth",
    desc: "Editing designed to strengthen your personal brand and help your content scale consistently.",
  },
  {
    icon: Gem,
    title: "💎 No Template Edits",
    desc: "Every project is crafted from scratch with unique pacing, motion, and storytelling.",
  },
  {
    icon: Flame,
    title: "🔥 Trusted by Serious Creators",
    desc: "A reliable creative partner focused on long-term success—not one-off edits.",
  },
];

export function WhyChooseMe() {
  return (
    <section className="relative mx-auto max-w-[1320px] px-6 py-24 md:px-8 md:py-32">
      <SectionHeading
        eyebrow="Why Clients Choose Me"
        title={
          <>
            Built for the <span className="text-gradient-brand">top 1%</span>.
          </>
        }
      />
      <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {items.map((it, i) => (
          <Reveal key={it.title} delay={(i % 4) * 0.05}>
            <div className="group relative h-full overflow-hidden rounded-xl sm:rounded-2xl glass p-3.5 sm:p-6 transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:glow-blue">
              <div className="pointer-events-none absolute -right-12 -top-12 size-32 rounded-full bg-electric/20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative">
                <div className="grid size-9 sm:size-12 place-items-center rounded-lg sm:rounded-xl bg-gradient-to-br from-electric/20 to-violet-glow/20 text-electric">
                  <it.icon className="size-4 sm:size-5" />
                </div>
                <h3 className="mt-3 sm:mt-5 text-xs min-[375px]:text-sm sm:text-card-title text-white font-semibold">
                  {it.title}
                </h3>
                <p className="mt-1 sm:mt-2 text-[10px] min-[375px]:text-xs sm:text-small-body text-neutral-400 leading-normal">
                  {it.desc}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
