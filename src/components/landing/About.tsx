import { Reveal, SectionHeading } from "./primitives";
import { Calendar, MapPin, Film, Video, Users } from "lucide-react";

export function About() {
  return (
    <section id="about" className="relative mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-36">
      <SectionHeading
        eyebrow="About the Studio"
        title={
          <>
            Behind the <span className="text-gradient-brand">scenes</span>.
          </>
        }
        subtitle="Raqvine is a premium boutique video editing studio specializing in high-impact narrative and retention-first digital content."
      />

      <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_480px]">
        {/* Biography & Approach */}
        <Reveal>
          <div className="space-y-8 text-left">
            <h3 className="font-display text-3xl leading-tight sm:text-4xl text-foreground">
              We translate raw vision into visual impact.
            </h3>

            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              Raqvine was founded on a simple philosophy: in the digital landscape, attention is the
              ultimate currency. We do not just assemble clips on a timeline; we meticulously design
              the viewer's emotional journey. By combining cinematic color grading, punchy sound
              design, and retention-first pacing, we help creators and brands stand out in a
              saturated feed.
            </p>

            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              Whether you are an established creator seeking to scale your channel or a premium
              brand looking to launch a cinematic commercial campaign, we provide bespoke, elite
              post-production services.
            </p>

            {/* Core Values grid */}
            <div className="grid gap-6 sm:grid-cols-2 pt-4">
              <div className="flex gap-4">
                <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-electric/10 text-electric">
                  <Film className="size-5" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Cinema Grade</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Every video receives bespoke cinematic color science and premium grading.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-violet-glow/10 text-violet-glow">
                  <Video className="size-5" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Retention-First</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Paced, hook-first storytelling engineered to keep viewers engaged to the end.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Right column: Image placeholder and profile card */}
        <Reveal delay={0.15}>
          <div className="relative">
            {/* Background glow effects */}
            <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-br from-electric/30 to-violet-glow/30 opacity-50 blur-xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-surface p-3 shadow-2xl">
              {/* Placeholder Image */}
              <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-white/[0.02]">
                <img
                  src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800"
                  alt="About Raqvine Studio"
                  className="size-full object-cover opacity-85 transition-transform duration-700 hover:scale-[1.03]"
                />
              </div>

              {/* Bio Details */}
              <div className="p-5 text-left">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                      Lead Editor & Director
                    </span>
                    <h4 className="font-display text-2xl text-foreground mt-0.5">Raqvine</h4>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full glass px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-electric">
                    Active
                  </span>
                </div>

                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-3">
                    <MapPin className="size-4 text-electric shrink-0" />
                    <span>Worldwide / Remote Operations</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Calendar className="size-4 text-electric shrink-0" />
                    <span>Established 2020</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Users className="size-4 text-electric shrink-0" />
                    <span>Serving 100+ Creators & Brands</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
