import { ArrowRight, Sparkles } from "lucide-react";
import { Reveal } from "./primitives";

export function FreeSample() {
  return (
    <section className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-surface-2 to-surface p-10 sm:p-16">
          <div className="absolute -right-32 -top-32 size-96 rounded-full bg-electric/25 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 size-96 rounded-full bg-violet-glow/25 blur-3xl" />
          <div className="relative max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs uppercase tracking-[0.22em] text-muted-foreground">
              <Sparkles className="size-3.5 text-electric" /> No commitment
            </div>
            <h2 className="mt-5 font-display text-4xl leading-[1.02] tracking-tight sm:text-6xl">
              Get a <span className="text-gradient-brand">free sample edit</span> before hiring.
            </h2>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              Send a short clip. Receive a professionally edited sample within 72 hours — see the quality before you spend a dollar.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#contact" className="group inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-7 py-4 text-sm font-medium text-background transition-transform hover:scale-[1.03]">
                Claim my free sample
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a href="#work" className="inline-flex items-center justify-center gap-2 rounded-full glass px-7 py-4 text-sm">See past work</a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
