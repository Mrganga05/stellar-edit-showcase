import { ArrowRight, Sparkles } from "lucide-react";
import { Reveal } from "./primitives";

export function FreeSample() {
  return (
    <section className="relative mx-auto max-w-[1320px] px-6 py-24 md:px-8 md:py-32">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-surface-2 to-surface p-10 sm:p-16 hover-card-premium">
          <div className="absolute -right-32 -top-32 size-96 rounded-full bg-electric/25 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 size-96 rounded-full bg-violet-glow/25 blur-3xl" />
          <div className="relative max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-badge-text text-muted-foreground">
              <Sparkles className="size-3.5 text-electric" /> No commitment
            </div>
            <h2 className="mt-5 text-section-heading">
              Get a <span className="text-gradient-brand">free sample edit</span> before hiring.
            </h2>
            <p className="mt-5 max-w-xl text-body-text">
              Send a short clip. Receive a professionally edited sample within 72 hours — see the
              quality before you spend a dollar.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#contact"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-7 h-[48px] text-button-text text-background transition-transform hover:scale-[1.03]"
              >
                Claim my free sample
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="#work"
                className="inline-flex items-center justify-center gap-2 rounded-full glass px-7 h-[48px] text-button-text text-white"
              >
                See past work
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
