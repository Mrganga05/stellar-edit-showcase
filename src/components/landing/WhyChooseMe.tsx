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
    <section className="relative mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-36">
      <SectionHeading
        eyebrow="Why Clients Choose Me"
        title={
          <>
            Built for the <span className="text-gradient-brand">top 1%</span>.
          </>
        }
      />
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => (
          <Reveal key={it.title} delay={(i % 4) * 0.05}>
            <div className="h-full rounded-2xl border border-white/8 bg-surface p-6 transition-colors hover:border-white/20">
              <it.icon className="size-5 text-electric" />
              <h3 className="mt-5 font-medium">{it.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{it.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
