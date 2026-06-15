import { AnimatedCounter, SectionHeading } from "./primitives";

const stats = [
  { to: 50, suffix: "M+", label: "Views Generated" },
  { to: 500, suffix: "+", label: "Projects Delivered" },
  { to: 100, suffix: "+", label: "Happy Clients" },
  { to: 98, suffix: "%", label: "Satisfaction Rate" },
];

export function Results() {
  return (
    <section id="results" className="relative overflow-hidden py-28 sm:py-36">
      <div className="absolute inset-0 aurora-bg opacity-60" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Results & Impact"
          title={<>Numbers that <span className="text-gradient-brand">don't lie</span>.</>}
        />
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-3xl glass-strong p-8 text-center">
              <div className="font-display text-5xl text-gradient-brand sm:text-6xl">
                <AnimatedCounter to={s.to} suffix={s.suffix} />
              </div>
              <div className="mt-3 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
