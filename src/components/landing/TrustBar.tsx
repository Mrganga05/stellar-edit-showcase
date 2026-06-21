import { Zap, Sparkles, RotateCw, Globe2 } from "lucide-react";

const clients = [
  "YouTube Creators",
  "Brands",
  "Agencies",
  "Startups",
  "Businesses",
  "Coaches",
  "Podcasters",
  "E-commerce",
  "SaaS",
  "Real Estate",
];

const badges = [
  { icon: Zap, label: "Fast Delivery" },
  { icon: Sparkles, label: "Premium Quality" },
  { icon: RotateCw, label: "Unlimited Revisions" },
  { icon: Globe2, label: "Worldwide Clients" },
];

export function TrustBar() {
  const row = [...clients, ...clients];
  return (
    <section className="relative border-y border-white/5 bg-surface/50 py-10">
      <div className="text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        Trusted by content teams in 24 countries
      </div>
      <div className="group relative mt-6 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
        <div className="flex w-max gap-12 animate-marquee group-hover:[animation-play-state:paused]">
          {row.map((c, i) => (
            <div
              key={i}
              className="font-display text-2xl text-foreground/40 transition-colors hover:text-foreground sm:text-3xl"
            >
              {c}
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-3 px-4 sm:grid-cols-4">
        {badges.map((b) => (
          <div key={b.label} className="flex items-center gap-3 rounded-2xl glass px-4 py-3">
            <div className="grid size-9 place-items-center rounded-lg bg-electric/10 text-electric">
              <b.icon className="size-4" />
            </div>
            <span className="text-sm font-medium">{b.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
