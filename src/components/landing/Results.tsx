import { AnimatedCounter, SectionHeading } from "./primitives";

const stats = [
  { to: 50, suffix: "M+", label: "Views Generated" },
  { to: 500, suffix: "+", label: "Projects Delivered" },
  { to: 100, suffix: "+", label: "Happy Clients" },
  { to: 99, suffix: "%", label: "Satisfaction Rate" },
];

export function Results() {
  return (
    <section id="results" className="relative overflow-hidden py-24 md:py-32">
      <div className="absolute inset-0 aurora-bg opacity-60" />
      <div className="relative mx-auto max-w-[1320px] px-6 md:px-8">
        <SectionHeading
          eyebrow="Results & Impact"
          title={
            <>
              Numbers that <span className="text-gradient-brand">don't lie</span>.
            </>
          }
        />
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl sm:rounded-3xl glass-strong p-4 sm:p-8 text-center hover-card-premium"
            >
              <div className="font-sans font-black text-2xl min-[375px]:text-3xl sm:text-5xl text-gradient-brand lg:text-6xl">
                <AnimatedCounter to={s.to} suffix={s.suffix} />
              </div>
              <div className="mt-1.5 sm:mt-3 text-[9px] sm:text-badge-text text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
