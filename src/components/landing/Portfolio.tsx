import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView, animate } from "motion/react";
import { X, Play } from "lucide-react";
import { projects as mockProjects, type Project } from "@/lib/portfolio-data";
import { SectionHeading, Reveal } from "./primitives";
import { cn } from "@/lib/utils";
import { usePortfolioProjects } from "@/lib/api/hooks";

// Reusable Count-Up Counter
const Counter = ({
  to,
  duration = 2.5,
  suffix = "",
  decimals = 0,
}: {
  to: number;
  duration?: number;
  suffix?: string;
  decimals?: number;
}) => {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(nodeRef, { once: true, amount: 0.1, margin: "-20px" });

  useEffect(() => {
    if (!inView) return;
    const node = nodeRef.current;
    if (!node) return;

    const controls = animate(0, to, {
      duration: duration,
      ease: [0.16, 1, 0.3, 1], // easeOutExpo
      onUpdate(value) {
        node.textContent = value.toFixed(decimals) + suffix;
      },
    });

    return () => controls.stop();
  }, [inView, to, duration, suffix, decimals]);

  return (
    <span ref={nodeRef} className="font-space font-bold">
      0{suffix}
    </span>
  );
};

// Background Particle Dot
const Particle = ({ delay = 0, x = 0, y = 0 }: { delay?: number; x?: number; y?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0.1, y: 0 }}
      animate={{
        opacity: [0.1, 0.45, 0.1],
        y: [0, -35, 0],
        x: [0, 15, 0],
      }}
      transition={{
        duration: 9 + Math.random() * 4,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay,
      }}
      className="absolute size-1 rounded-full bg-[#38BDF8] pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%` }}
    />
  );
};
function Card({ p, onOpen }: { p: Project; onOpen: () => void }) {
  const [hover, setHover] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Extract key metric from results if metric field is not set
  const displayMetric = p.metric || (p.results && p.results[0]) || "";

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
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
      className={cn(
        "group relative w-full overflow-hidden rounded-2xl border border-white/8 bg-surface text-left transition-all duration-500 hover:scale-[1.03] hover:border-electric/40 hover:shadow-[0_0_25px_rgba(0,212,255,0.15)] focus:outline-none focus-visible:ring-2 focus-visible:ring-electric/50 cursor-pointer",
        p.videoAspect === "landscape" ? "aspect-video" : "aspect-[9/16]",
      )}
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
        preload="metadata"
        controlsList="nodownload"
        poster={p.thumb}
        className={cn(
          "absolute inset-0 size-full object-cover transition-opacity duration-500",
          hover ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Background gradient shadow */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent transition-opacity duration-300 group-hover:from-black/100" />

      {/* Top badges bar */}
      <div className="absolute inset-x-0 top-0 p-3 sm:p-4 flex flex-row gap-1 items-center justify-between z-10 w-full">
        {/* Category */}
        <span className="inline-flex items-center gap-1 rounded-full glass px-2 py-0.5 sm:px-2.5 sm:py-1 text-[8px] sm:text-[9px] font-semibold uppercase tracking-[0.15em] text-white/90 truncate max-w-[50%]">
          {p.category}
        </span>

        {/* Metric */}
        {displayMetric && (
          <span className="inline-flex items-center justify-center rounded-full bg-electric/15 border border-electric/30 px-2 py-0.5 sm:px-3 sm:py-1 text-[8px] sm:text-[9px] font-bold tracking-wider text-electric shadow-[0_0_12px_rgba(0,212,255,0.2)] truncate max-w-[50%]">
            {displayMetric}
          </span>
        )}
      </div>

      {/* Center play button on hover */}
      <div className="absolute inset-0 grid place-items-center pointer-events-none z-10">
        <div className="grid size-10 sm:size-12 place-items-center rounded-full bg-black/60 text-white border border-white/20 opacity-0 scale-75 blur-xs transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 group-hover:blur-none group-hover:bg-electric group-hover:text-background group-hover:border-electric shadow-[0_0_15px_rgba(0,212,255,0.4)]">
          <Play className="size-4 sm:size-5 fill-current ml-0.5" />
        </div>
      </div>

      {/* Bottom information */}
      <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-5 z-10 flex flex-col justify-end">
        {/* Client name */}
        {p.clientName && (
          <span className="text-[9px] sm:text-badge-text text-electric mb-1 font-bold">
            {p.clientName}
          </span>
        )}
        <h3 className="text-xs sm:text-card-title font-semibold text-white group-hover:text-electric transition-colors duration-300 line-clamp-2 leading-tight">
          {p.title}
        </h3>
        <p className="mt-0.5 text-[10px] sm:text-small-body text-white/60 line-clamp-1 group-hover:text-white/80 transition-colors duration-300">
          {p.description}
        </p>
      </div>
    </motion.button>
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
          clientName: p.clientName || "",
          metric: p.metric || "",
          videoAspect: p.videoAspect || "portrait",
        }))
      : mockProjects.map((p) => ({
          ...p,
          videoAspect: p.videoAspect || "portrait",
        }));

  return (
    <section
      id="work"
      className="relative mx-auto max-w-[1320px] px-6 py-24 md:px-8 md:py-32 overflow-hidden"
    >
      {/* Decorative Atmosphere Behind Heading */}
      <div className="absolute inset-x-0 top-0 h-[650px] overflow-hidden pointer-events-none z-0">
        {/* Soft Blue Radial Glow */}
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[500px] h-[350px] rounded-full bg-[#38BDF8]/5 blur-[100px]" />

        {/* Purple Ambient Blur */}
        <div className="absolute top-[25%] left-1/3 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[#3B82F6]/3.5 blur-[125px]" />

        {/* Noise overlay */}
        <div className="absolute inset-0 about-noise opacity-30" />

        {/* Tiny Floating Particles */}
        <Particle x={20} y={15} delay={0} />
        <Particle x={78} y={22} delay={1.8} />
        <Particle x={45} y={45} delay={3.2} />
        <Particle x={12} y={55} delay={0.9} />
        <Particle x={88} y={65} delay={2.3} />
      </div>

      <div className="relative z-10 max-w-[900px] mx-auto text-center flex flex-col items-center mb-16 sm:mb-20">
        {/* TOP LABEL (Premium Glass Badge) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 rounded-full border border-[#38BDF8]/25 bg-[#0c1224]/90 px-4.5 py-1.5 shadow-[0_0_15px_rgba(56,189,248,0.08)] mb-6 sm:mb-8 hover:border-[#38BDF8]/40 transition-colors duration-300 select-none"
        >
          {/* Blue Glowing Dot */}
          <span className="size-2 rounded-full bg-[#38BDF8] animate-pulse shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
          <span className="text-badge-text text-white/95">SIGNATURE WORK</span>
        </motion.div>

        {/* MAIN HEADING */}
        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-section-heading select-none max-w-[800px] mx-auto"
        >
          Where Creativity Meets{" "}
          <span className="inline-block relative group pr-[0.1em] animate-work-gradient bg-clip-text text-transparent filter drop-shadow-[0_2px_15px_rgba(56,189,248,0.3)]">
            Performance.
            {/* Sparkle Icon */}
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="absolute -top-3.5 -right-3 text-[14px] text-[#38BDF8] opacity-75 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300 pointer-events-none filter drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]"
            >
              ✦
            </motion.span>
          </span>
        </motion.h2>

        {/* SUPPORTING TEXT */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="mt-5 sm:mt-6 max-w-[620px] text-body-text text-neutral-400 mx-auto"
        >
          Explore a curated collection of high-performing edits crafted for creators, brands, and
          businesses. Every project combines cinematic storytelling, retention-driven pacing, and
          platform-native optimization to deliver measurable results.
        </motion.p>

        {/* THIN GLOWING DIVIDER LINE */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.6 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="h-px w-full max-w-[820px] bg-gradient-to-r from-transparent via-white/10 to-transparent mt-12 relative"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-[1.5px] bg-gradient-to-r from-[#38BDF8] to-[#3B82F6] blur-[0.5px] shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
        </motion.div>
      </div>
      <div className="relative z-10 mt-16 grid gap-3 sm:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {isLoading && !dbProjects
          ? Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[9/16] w-full animate-pulse rounded-2xl bg-surface/50 border border-white/5"
              />
            ))
          : projectsToRender.map((p, i) => (
              <Reveal
                key={p.id}
                delay={(i % 4) * 0.05}
                className={
                  p.videoAspect === "landscape" ? "col-span-2 md:col-span-2" : "col-span-1"
                }
              >
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
              className={cn(
                "relative w-[calc(100vw-1.5rem)] overflow-y-auto md:overflow-hidden rounded-[28px] md:rounded-3xl glass-strong border border-white/10 shadow-2xl flex flex-col md:grid",
                open.videoAspect === "landscape"
                  ? "max-w-sm md:max-w-5xl h-[90vh] md:h-[75vh] md:grid-cols-[1.4fr_1fr]"
                  : "max-w-sm md:max-w-4xl h-[90vh] md:h-[80vh] md:grid-cols-[auto_1fr]",
              )}
            >
              <button
                onClick={() => setOpen(null)}
                className="absolute right-4 top-4 z-50 grid size-9 place-items-center rounded-full bg-black/60 text-white/80 border border-white/10 hover:text-white hover:bg-white/10 transition backdrop-blur-md shadow-lg"
                title="Close dialog"
              >
                <X className="size-4.5" />
              </button>

              {/* Video Player — portrait on mobile, landscape fill on desktop */}
              <div
                className={cn(
                  "relative w-full bg-black border-b md:border-b-0 md:border-r border-white/10 flex items-center justify-center flex-shrink-0 p-4 overflow-hidden group/video-container",
                  open.videoAspect === "landscape"
                    ? "aspect-video md:aspect-auto md:h-full max-h-[40vh] md:max-h-none"
                    : "aspect-[9/16] md:w-[380px] md:aspect-auto md:h-full max-h-[50vh] md:max-h-none",
                )}
              >
                {/* Phone/Monitor mockup styled frame */}
                <div
                  className={cn(
                    "relative w-full rounded-2xl overflow-hidden border border-white/10 bg-black flex items-center justify-center shadow-inner",
                    open.videoAspect === "landscape" ? "aspect-video" : "w-full h-full",
                  )}
                >
                  {/* Glowing neon animated border */}
                  <div className="absolute inset-0 z-0 p-[1.5px] rounded-2xl overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 opacity-60 animate-gradient-text" />
                  </div>

                  <video
                    src={open.video}
                    controls
                    autoPlay
                    playsInline
                    preload="metadata"
                    controlsList="nodownload"
                    poster={open.thumb}
                    className={cn(
                      "relative z-10 w-full h-full rounded-2xl",
                      open.videoAspect === "landscape" ? "object-contain" : "object-cover",
                    )}
                  />
                </div>
              </div>

              {/* Project Details Panel — scrollable below video on mobile */}
              <div className="flex flex-col flex-1 overflow-y-visible md:overflow-y-auto p-6 md:p-8 lg:p-10 bg-gradient-to-b from-[#0b1224]/80 to-[#040612]/95 backdrop-blur-md min-h-0 relative border-t md:border-t-0 md:border-l border-white/[0.08]">
                {/* Glow accents */}
                <div className="absolute top-0 right-0 size-[200px] rounded-full bg-[#22d3ee]/5 blur-[80px] pointer-events-none" />

                <div className="space-y-6 flex-grow flex flex-col justify-start relative z-10">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-3">
                      {open.clientName && (
                        <div className="inline-flex items-center gap-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-cyan-400">
                          {open.clientName}
                        </div>
                      )}
                      <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.02] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                        {open.category}
                      </div>
                      {open.metric && (
                        <div className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-400">
                          {open.metric}
                        </div>
                      )}
                    </div>

                    <h3 className="text-xl font-bold tracking-tight text-white font-display text-left">
                      {open.title}
                    </h3>

                    {/* Thin Glowing Divider */}
                    <div className="h-[2px] w-24 bg-gradient-to-r from-[#22d3ee] to-[#a855f7] rounded-full my-4" />

                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed whitespace-pre-wrap font-sans text-left mt-2">
                      {open.overview}
                    </p>
                  </div>

                  <div className="space-y-4 border-t border-white/5 pt-4 text-left">
                    <Detail label="Techniques" items={open.techniques} />
                    <Detail label="Results" items={open.results} />
                    <Detail label="Tools" items={open.tools} />
                  </div>
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
      <div className="text-badge-text text-muted-foreground">{label}</div>
      <ul className="mt-2 space-y-1.5 text-small-body">
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
