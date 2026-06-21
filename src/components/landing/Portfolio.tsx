import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Play } from "lucide-react";
import { projects as mockProjects, type Project } from "@/lib/portfolio-data";
import { SectionHeading, Reveal } from "./primitives";
import { cn } from "@/lib/utils";
import { usePortfolioProjects } from "@/lib/api/hooks";

function Card({ p, onOpen }: { p: Project; onOpen: () => void }) {
  const [hover, setHover] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  return (
    <button
      onClick={onOpen}
      onMouseEnter={() => {
        setHover(true);
        videoRef.current?.play().catch(() => {});
      }}
      onMouseLeave={() => {
        setHover(false);
        videoRef.current?.pause();
        if (videoRef.current) videoRef.current.currentTime = 0;
      }}
      className="group relative aspect-[9/16] w-full overflow-hidden rounded-2xl border border-white/8 bg-surface text-left transition-transform duration-500 hover:scale-[1.015] hover:border-white/20"
    >
      <img
        src={p.thumb}
        alt={p.title}
        loading="lazy"
        width={1280}
        height={768}
        className={cn(
          "absolute inset-0 size-full object-cover transition-opacity duration-500",
          hover && "opacity-0",
        )}
      />
      <video
        ref={videoRef}
        src={p.video}
        muted
        loop
        playsInline
        preload="none"
        className={cn(
          "absolute inset-0 size-full object-cover transition-opacity duration-500",
          hover ? "opacity-100" : "opacity-0",
        )}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
      <div className="absolute left-4 top-4">
        <span className="inline-flex items-center gap-1.5 rounded-full glass px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-foreground/85">
          {p.category}
        </span>
      </div>
      <div className="absolute right-4 top-4 grid size-10 place-items-center rounded-full glass-strong opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <Play className="size-4 fill-current" />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className="font-display text-xl leading-tight sm:text-2xl">{p.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{p.description}</p>
      </div>
    </button>
  );
}

export function Portfolio() {
  const [open, setOpen] = useState<Project | null>(null);
  const { data: dbProjects, isLoading } = usePortfolioProjects();

  const projectsToRender =
    dbProjects && dbProjects.length > 0
      ? dbProjects.map((p) => ({
          id: p.id,
          title: p.title,
          category: p.category,
          description: p.description,
          thumb: p.thumbnail,
          video: p.videoUrl,
          overview: p.overview,
          techniques: p.techniques,
          results: p.results,
          tools: p.tools,
        }))
      : mockProjects;

  return (
    <section id="work" className="relative mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-36">
      <SectionHeading
        eyebrow="Featured Work"
        title={
          <>
            Cuts that <span className="text-gradient-brand">move metrics</span>.
          </>
        }
        subtitle="A selection of recent work across long-form, shorts, commercial and cinematic editing."
      />
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading && !dbProjects
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[9/16] w-full animate-pulse rounded-2xl bg-surface/50 border border-white/5"
              />
            ))
          : projectsToRender.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 0.05}>
                <Card p={p} onOpen={() => setOpen(p)} />
              </Reveal>
            ))}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
            onClick={() => setOpen(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative grid max-h-[92vh] w-full max-w-md grid-rows-[auto_1fr] overflow-hidden rounded-3xl glass-strong"
            >
              <button
                onClick={() => setOpen(null)}
                className="absolute right-4 top-4 z-50 grid size-10 place-items-center rounded-full bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-white/10"
              >
                <X className="size-5" />
              </button>
              <video
                src={open.video}
                controls
                autoPlay
                className="aspect-[9/16] max-h-[55vh] w-full bg-black object-cover"
              />
              <div className="space-y-6 overflow-y-auto p-6">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-electric">
                    {open.category}
                  </span>
                  <h3 className="mt-2 font-display text-2xl leading-tight">{open.title}</h3>
                  <p className="mt-2.5 text-xs text-muted-foreground leading-relaxed">
                    {open.overview}
                  </p>
                </div>
                <div className="space-y-4 border-t border-white/5 pt-4">
                  <Detail label="Techniques" items={open.techniques} />
                  <Detail label="Results" items={open.results} />
                  <Detail label="Tools" items={open.tools} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Detail({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</div>
      <ul className="mt-2 space-y-1.5 text-sm">
        {items.map((it) => (
          <li key={it} className="flex gap-2">
            <span className="mt-2 size-1 shrink-0 rounded-full bg-electric" />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}
