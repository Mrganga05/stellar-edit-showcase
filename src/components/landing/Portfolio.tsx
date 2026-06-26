import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Play } from "lucide-react";
import { projects as mockProjects, type Project } from "@/lib/portfolio-data";
import { Reveal, AnimatedCounter } from "./primitives";
import { cn } from "@/lib/utils";
import { usePortfolioProjects } from "@/lib/api/hooks";

// Floating Particle component
const FloatingParticle = ({ x, y, delay = 0 }: { x: number; y: number; delay?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0.1, y: 0 }}
      animate={{
        opacity: [0.1, 0.5, 0.1],
        y: [0, -20, 0],
        x: [0, 8, 0],
      }}
      transition={{
        duration: 7 + Math.random() * 4,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
      className="absolute size-1 rounded-full bg-[#18B6FF] pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%` }}
    />
  );
};

// StatCard component
function StatCard({ val, suffix, label }: { val: number; suffix: string; label: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="glass relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#050608]/40 p-5 text-center backdrop-blur-md hover:border-[#18B6FF]/35 hover:shadow-[0_8px_30px_rgba(24,182,255,0.12)] transition-all duration-350 group cursor-default"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#18B6FF]/0 to-[#18B6FF]/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="font-space text-2xl sm:text-3xl font-bold text-white mb-1.5">
        <AnimatedCounter to={val} suffix={suffix} />
      </div>
      <div className="text-[10px] sm:text-[11px] uppercase tracking-[1.5px] text-white/60 font-semibold leading-tight">
        {label}
      </div>
    </motion.div>
  );
}

function Card({ p, onOpen }: { p: Project; onOpen: () => void }) {
  const [hover, setHover] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Extract key metric from results if metric field is not set
  const displayMetric = p.metric || (p.results && p.results[0]) || "";

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
      className="group relative aspect-[9/16] w-full overflow-hidden rounded-2xl border border-white/8 bg-surface text-left transition-all duration-500 hover:scale-[1.03] hover:border-electric/40 hover:shadow-[0_0_25px_rgba(0,212,255,0.15)] focus:outline-none focus-visible:ring-2 focus-visible:ring-electric/50"
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

      {/* Background gradient shadow */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent transition-opacity duration-300 group-hover:from-black/100" />

      {/* Top badges bar */}
      <div className="absolute inset-x-0 top-0 p-4 flex items-center justify-between z-10">
        {/* Category */}
        <span className="inline-flex items-center gap-1.5 rounded-full glass px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-white/90">
          {p.category}
        </span>

        {/* Metric */}
        {displayMetric && (
          <span className="inline-flex items-center justify-center rounded-full bg-electric/15 border border-electric/30 px-3 py-1 text-[9px] font-bold tracking-wider text-electric shadow-[0_0_12px_rgba(0,212,255,0.2)]">
            {displayMetric}
          </span>
        )}
      </div>

      {/* Center play button on hover */}
      <div className="absolute inset-0 grid place-items-center pointer-events-none z-10">
        <div className="grid size-12 place-items-center rounded-full bg-black/60 text-white border border-white/20 opacity-0 scale-75 blur-xs transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 group-hover:blur-none group-hover:bg-electric group-hover:text-background group-hover:border-electric shadow-[0_0_15px_rgba(0,212,255,0.4)]">
          <Play className="size-5 fill-current ml-0.5" />
        </div>
      </div>

      {/* Bottom information */}
      <div className="absolute inset-x-0 bottom-0 p-5 z-10 flex flex-col justify-end">
        {/* Client handle/name */}
        {p.clientName && (
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-electric mb-1.5">
            {p.clientName}
          </span>
        )}
        <h3 className="font-display text-xl sm:text-2xl leading-tight text-white group-hover:text-electric transition-colors duration-300">
          {p.title}
        </h3>
        <p className="mt-1 text-xs text-white/60 line-clamp-1 group-hover:text-white/80 transition-colors duration-300">
          {p.description}
        </p>
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
          clientName: p.clientName || "",
          metric: p.metric || "",
        }))
      : mockProjects;

  return (
    <section id="work" className="relative mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-36">
      {/* Decorative Background Elements */}
      <div className="absolute inset-x-0 top-0 h-[650px] overflow-hidden pointer-events-none z-0">
        {/* Ambient radial glows */}
        <div className="absolute top-[25%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(24,182,255,0.06)_0%,rgba(139,92,246,0.04)_45%,transparent_70%)] blur-2xl" />
        {/* Soft ambient blurs */}
        <div className="absolute top-[10%] left-[25%] w-[380px] h-[380px] rounded-full bg-[#18B6FF]/3 blur-[120px]" />
        <div className="absolute top-[15%] right-[25%] w-[380px] h-[380px] rounded-full bg-[#7C5CFF]/3 blur-[120px]" />
        {/* Noise overlay */}
        <div className="absolute inset-0 about-noise opacity-[0.015]" />
        {/* Floating particles */}
        <FloatingParticle x={20} y={15} delay={0} />
        <FloatingParticle x={80} y={22} delay={1.5} />
        <FloatingParticle x={35} y={48} delay={0.8} />
        <FloatingParticle x={65} y={35} delay={2.3} />
        <FloatingParticle x={12} y={55} delay={3.1} />
        <FloatingParticle x={88} y={45} delay={1.9} />
      </div>

      <div className="relative mx-auto max-w-[900px] text-center mb-16 z-10">
        {/* Top Glass Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-[#18B6FF]/20 bg-white/[0.04] px-4.5 py-2 text-[13px] uppercase tracking-[5px] text-white/95 backdrop-blur-md shadow-[0_0_15px_rgba(24,182,255,0.12)]"
        >
          <span className="size-2 rounded-full bg-[#18B6FF] shadow-[0_0_8px_#18B6FF] animate-pulse" />
          SIGNATURE WORK
        </motion.div>

        {/* Main Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="font-playfair text-[44px] sm:text-[62px] md:text-[72px] font-bold leading-[0.98] tracking-[-0.03em] text-white mb-6 select-none"
        >
          Every Frame <br className="hidden sm:block" />
          Earns{" "}
          <span className="relative inline-block">
            <span className="inline-block italic pr-[0.12em] animate-work-gradient filter drop-shadow-[0_2px_22px_rgba(36,214,255,0.45)]">
              Attention.
            </span>
            <motion.span
              animate={{ rotate: 360, scale: [0.85, 1.15, 0.85] }}
              transition={{
                rotate: { repeat: Infinity, duration: 12, ease: "linear" },
                scale: { repeat: Infinity, duration: 3, ease: "easeInOut" }
              }}
              className="absolute -top-1 -right-4.5 text-[13px] text-[#24D6FF] opacity-90 filter drop-shadow-[0_0_6px_rgba(24,182,255,0.8)] pointer-events-none font-sans"
            >
              ✦
            </motion.span>
          </span>
        </motion.h2>

        {/* Supporting Text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="mx-auto max-w-[700px] text-base sm:text-[20px] font-sans text-white/70 leading-[1.6]"
        >
          Explore a curated collection of high-performing edits crafted for creators, brands, and businesses. Every project combines cinematic storytelling, retention-driven pacing, and platform-native optimization to deliver measurable results.
        </motion.p>

        {/* Glowing Divider Line */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.7 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.35 }}
          className="relative w-full max-w-[500px] h-px mx-auto bg-gradient-to-r from-transparent via-white/[0.08] to-transparent my-10"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#18B6FF]/30 to-transparent blur-[2px]" />
        </motion.div>

        {/* Trust Indicators Stats Grid */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto w-full px-2">
          <StatCard val={50} suffix="M+" label="Views Generated" />
          <StatCard val={100} suffix="+" label="Creators" />
          <StatCard val={500} suffix="+" label="Projects" />
          <StatCard val={98} suffix="%" label="Client Satisfaction" />
        </div>
      </div>
      <div className="mt-14 grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {isLoading && !dbProjects
          ? Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[9/16] w-full animate-pulse rounded-2xl bg-surface/50 border border-white/5"
              />
            ))
          : projectsToRender.map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 0.05}>
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
              className="relative grid w-full max-w-md md:max-w-4xl h-[90vh] md:h-[80vh] grid-cols-1 md:grid-cols-[1.15fr_1fr] grid-rows-[auto_1fr] md:grid-rows-1 overflow-hidden rounded-3xl glass-strong border border-white/10 shadow-2xl"
            >
              <button
                onClick={() => setOpen(null)}
                className="absolute right-4 top-4 z-50 grid size-9 place-items-center rounded-full bg-black/60 text-white/80 border border-white/10 hover:text-white hover:bg-white/10 transition backdrop-blur-md shadow-lg"
                title="Close dialog"
              >
                <X className="size-4.5" />
              </button>

              {/* Left Column: Video Player Container */}
              <div className="relative w-full h-[45vh] md:h-full bg-black overflow-hidden flex items-center justify-center">
                <video src={open.video} controls autoPlay className="w-full h-full object-cover" />
              </div>

              {/* Right Column: Project Details Panel */}
              <div className="flex flex-col h-[45vh] md:h-full overflow-y-auto p-6 md:p-8 bg-[#090b11]/75 backdrop-blur-md border-t md:border-t-0 md:border-l border-white/5">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2">
                      {open.clientName && (
                        <span className="text-[10px] uppercase tracking-[0.2em] text-electric font-bold">
                          {open.clientName}
                        </span>
                      )}
                      {open.clientName && <span className="text-white/20">•</span>}
                      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
                        {open.category}
                      </span>
                    </div>
                    <h3 className="mt-2 font-display text-2xl md:text-3xl leading-tight text-white">
                      {open.title}
                    </h3>
                    <p className="mt-3 text-xs text-white/60 leading-relaxed">{open.overview}</p>
                  </div>

                  <div className="space-y-4 border-t border-white/5 pt-5">
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
