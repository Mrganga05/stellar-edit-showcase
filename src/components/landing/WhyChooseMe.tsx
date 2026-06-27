import {
  Clock,
  RefreshCw,
  MessageSquare,
  Sparkles,
  Eye,
  Layers,
  Palette,
  Monitor,
} from "lucide-react";
import { SectionHeading, Reveal } from "./primitives";

const items = [
  { icon: Clock, title: "Fast Turnaround", desc: "48–72h for most cuts, 24h for shorts." },
  { icon: RefreshCw, title: "Unlimited Revisions", desc: "Until you're genuinely happy." },
  { icon: MessageSquare, title: "Pro Communication", desc: "Slack, Loom, async-first." },
  { icon: Sparkles, title: "Creative Storytelling", desc: "Narrative-led, not template-led." },
  { icon: Eye, title: "High Retention", desc: "Built for watch-time, every frame." },
  { icon: Layers, title: "Motion Graphics", desc: "Custom AE work, not stock packs." },
  { icon: Palette, title: "Premium Color", desc: "Cinematic grades, custom LUTs." },
  { icon: Monitor, title: "4K Delivery", desc: "ProRes, H.264, masters & socials." },
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
            <div className="h-full rounded-xl sm:rounded-2xl border border-white/8 bg-surface p-3.5 sm:p-6 hover-card-premium flex flex-col justify-start">
              <it.icon className="size-4 sm:size-5 text-electric shrink-0" />
              <h3 className="mt-3 sm:mt-5 text-xs min-[375px]:text-sm sm:text-card-title text-white font-semibold">{it.title}</h3>
              <p className="mt-1 sm:mt-2 text-[10px] min-[375px]:text-xs sm:text-small-body text-neutral-400 leading-normal">{it.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
