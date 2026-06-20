import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { ArrowRight, Sparkles, Play, X, TrendingUp, Zap, Target, Award } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { HERO_VIDEO } from "@/lib/portfolio-data";
import { supabase } from "@/lib/supabase";
import heroEditorImg from "@/assets/hero-editor.jpg";

export function Hero() {
  const [showreelOpen, setShowreelOpen] = useState(false);
  const [heroData, setHeroData] = useState({
    headline: 'High-End Video Editing<br/>That Scales Your <span class="text-gradient-brand font-display italic font-normal">Views, Retention, & Revenue.</span>',
    subheadline:
      "Raqvine transforms raw footage into cinematic, high-retention content built to move audiences, scale channels, and grow ambitious brands worldwide.",
  });

  useEffect(() => {
    async function loadHero() {
      try {
        const { data } = await supabase
          .from("hero_settings")
          .select("*")
          .order("createdAt", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (data) {
          setHeroData({ headline: data.headline, subheadline: data.subheadline });
        }
      } catch (err) {
        console.error("Failed to load hero settings", err);
      }
    }
    loadHero();
  }, []);

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // Parallax constraints for GPU execution
  const y = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} id="top" className="relative min-h-[100svh] w-full overflow-hidden bg-[#050508]">

      {/* ── BACKGROUND LAYER: animated aurora orbs (CSS, GPU-only) ── */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* Large slow-rotating cyan orb */}
        <div className="hero-orb hero-orb-cyan" />
        {/* Large slow-rotating violet orb */}
        <div className="hero-orb hero-orb-violet" />
        {/* Bottom edge fade */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#050508] to-transparent" />
        {/* Vignette top */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#050508]/80 to-transparent" />
      </div>

      {/* ── BACKGROUND VIDEO (subtle, low-opacity) ── */}
      <video
        className="absolute inset-0 size-full object-cover opacity-15 mix-blend-luminosity"
        src={HERO_VIDEO}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />

      {/* ── GRID OVERLAY ── */}
      <div className="hero-grid absolute inset-0 opacity-[0.05]" />

      {/* ── BRIGHT ACCENT DOTS (Reduced for Simplification) ── */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <span className="hero-dot" style={{ top: "18%", left: "12%", animationDelay: "0s", width: 6, height: 6, background: "#00D4FF" }} />
        <span className="hero-dot" style={{ top: "45%", right: "14%", animationDelay: "0.6s", width: 5, height: 5, background: "#00D4FF" }} />
        <span className="hero-dot" style={{ top: "75%", left: "38%", animationDelay: "0.9s", width: 4, height: 4, background: "#8B5CF6" }} />
      </div>

      {/* ── MAIN CONTENT ── */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 mx-auto grid min-h-[100svh] max-w-[1400px] items-center gap-12 px-5 pb-16 pt-32 sm:px-8 lg:grid-cols-[0.8fr_1.35fr] lg:gap-16 lg:pb-24 lg:pt-36"
      >
        {/* LEFT: Text column */}
        <div className="text-center lg:text-left flex flex-col justify-center">

          {/* Engineered For Outcomes Banner */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-8 flex flex-col items-center lg:items-start gap-4.5"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00D4FF]/25 bg-[#00D4FF]/5 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#00D4FF] backdrop-blur-sm shadow-[0_0_24px_rgba(0,212,255,0.08)]">
              <Sparkles className="size-3.5 text-[#00D4FF] animate-pulse" />
              Engineered For Outcomes
            </div>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 text-xs font-bold tracking-wide text-foreground/95">
              <span className="flex items-center gap-1.5 bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 rounded-full px-4 py-2 transition-all hover:scale-[1.03] duration-200 shadow-md">
                <span className="text-emerald-400 font-extrabold">↑</span> High Retention Hook
              </span>
              <span className="flex items-center gap-1.5 bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 rounded-full px-4 py-2 transition-all hover:scale-[1.03] duration-200 shadow-md">
                <span>⚡</span> 24h Turnaround Available
              </span>
              <span className="flex items-center gap-1.5 bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 rounded-full px-4 py-2 transition-all hover:scale-[1.03] duration-200 shadow-md">
                <span>🎯</span> Platform-Native Optimization
              </span>
              <span className="flex items-center gap-1.5 bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 rounded-full px-4 py-2 transition-all hover:scale-[1.03] duration-200 shadow-md">
                <span>📈</span> Revenue-Driven Editing
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[42px] leading-[0.98] tracking-[-0.03em] sm:text-6xl lg:text-[66px] xl:text-[72px]"
            dangerouslySetInnerHTML={{ __html: heroData.headline }}
          />

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22 }}
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0"
          >
            {heroData.subheadline}
          </motion.p>

          {/* CTA Buttons - Conversion Optimized */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.34 }}
            className="mt-8 flex flex-col items-center sm:flex-row sm:justify-center lg:justify-start"
          >
            <a
              href="#contact"
              className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-full px-10 py-5 text-sm font-bold tracking-wide text-white transition-all duration-300 hover:scale-[1.03] sm:w-auto"
              style={{
                background: "linear-gradient(135deg, #00D4FF 0%, #8B5CF6 100%)",
                boxShadow: "0 0 40px rgba(0,212,255,0.45), 0 8px 30px rgba(139,92,246,0.35)"
              }}
            >
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "linear-gradient(135deg, #00b8db 0%, #7c3aed 100%)" }} />
              <span className="relative text-[15px]">Book A Strategy Call</span>
              <ArrowRight className="relative size-4.5 transition-transform group-hover:translate-x-1" />
            </a>
          </motion.div>

          {/* Software & Tools Section */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.44 }}
            className="mt-10 flex flex-col gap-3.5 items-center lg:items-start"
          >
            <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/80 font-extrabold">
              Production Stack & Tools:
            </span>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#00C4FF]/20 bg-[#00C4FF]/5 px-3.5 py-2 text-[10px] font-extrabold tracking-wider text-[#00C4FF] transition-all hover:scale-105 hover:bg-[#00C4FF]/10 duration-200 cursor-default">
                <svg className="size-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" rx="4" fill="#00005C"/>
                  <rect x="0.5" y="0.5" width="23" height="23" rx="3.5" stroke="#00C4FF" strokeOpacity="0.4"/>
                  <text x="5" y="16.5" fill="#00C4FF" fontSize="10" fontWeight="black" fontFamily="sans-serif">Pr</text>
                </svg>
                Premiere Pro
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#D966FF]/20 bg-[#D966FF]/5 px-3.5 py-2 text-[10px] font-extrabold tracking-wider text-[#D966FF] transition-all hover:scale-105 hover:bg-[#D966FF]/10 duration-200 cursor-default">
                <svg className="size-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" rx="4" fill="#1C0030"/>
                  <rect x="0.5" y="0.5" width="23" height="23" rx="3.5" stroke="#D966FF" strokeOpacity="0.4"/>
                  <text x="5" y="16.5" fill="#D966FF" fontSize="10" fontWeight="black" fontFamily="sans-serif">Ae</text>
                </svg>
                After Effects
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#FF9F1C]/20 bg-[#FF9F1C]/5 px-3.5 py-2 text-[10px] font-extrabold tracking-wider text-[#FF9F1C] transition-all hover:scale-105 hover:bg-[#FF9F1C]/10 duration-200 cursor-default">
                <div className="relative size-3.5 flex items-center justify-center rounded-sm bg-black border border-[#FF9F1C]/30 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-red-500 via-blue-500 to-green-500 opacity-80" />
                  <div className="absolute inset-[1px] bg-black rounded-[1px]" />
                  <span className="absolute text-[7px] font-black text-[#FF9F1C]">Dr</span>
                </div>
                DaVinci Resolve
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#00C8FF]/20 bg-[#00C8FF]/5 px-3.5 py-2 text-[10px] font-extrabold tracking-wider text-[#00C8FF] transition-all hover:scale-105 hover:bg-[#00C8FF]/10 duration-200 cursor-default">
                <svg className="size-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" rx="4" fill="#001C26"/>
                  <rect x="0.5" y="0.5" width="23" height="23" rx="3.5" stroke="#00C8FF" strokeOpacity="0.4"/>
                  <text x="5" y="16.5" fill="#00C8FF" fontSize="10" fontWeight="black" fontFamily="sans-serif">Ps</text>
                </svg>
                Photoshop
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#00FFC2]/20 bg-[#00FFC2]/5 px-3.5 py-2 text-[10px] font-extrabold tracking-wider text-[#00FFC2] transition-all hover:scale-105 hover:bg-[#00FFC2]/10 duration-200 cursor-default">
                <svg className="size-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" rx="4" fill="#00261C"/>
                  <rect x="0.5" y="0.5" width="23" height="23" rx="3.5" stroke="#00FFC2" strokeOpacity="0.4"/>
                  <text x="5" y="16.5" fill="#00FFC2" fontSize="10" fontWeight="black" fontFamily="sans-serif">Au</text>
                </svg>
                Audition
              </span>
            </div>
          </motion.div>
        </div>

        {/* RIGHT: Visual Area - Full-width Workspace Image with subtle float */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-full lg:pl-4 xl:pl-8"
          style={{ willChange: "transform" }}
        >
          {/* Main Workspace Preview Card */}
          <div className="relative group">
            {/* Ambient luxury backdrop glow */}
            <div
              className="absolute -inset-8 rounded-[40px] opacity-40 group-hover:opacity-60 transition-opacity duration-700 pointer-events-none"
              style={{
                background: "radial-gradient(circle at 50% 50%, rgba(0, 212, 255, 0.25), rgba(139, 92, 246, 0.15), transparent 70%)",
                filter: "blur(32px)",
              }}
            />

            <div
              className="relative overflow-hidden rounded-[28px] border border-white/10 bg-black/60 p-2 shadow-[0_45px_90px_-25px_rgba(0,0,0,0.95)] transition-all duration-500 group-hover:border-white/20"
              style={{ willChange: "transform" }}
            >
              {/* Glassmorphic border reflection highlight */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

              {/* Image Preview Container with maximized view layout ratios */}
              <div
                className="relative aspect-video overflow-hidden rounded-[22px] sm:aspect-[16/10] lg:aspect-[16/10.5] xl:aspect-[16/10] select-none"
              >
                <img
                  src={heroEditorImg}
                  alt="Premium Video Editing Workspace"
                  className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="eager"
                />

                {/* Subtle vignette boundary shadow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-black/10 pointer-events-none" />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ── SOCIAL PROOF METRICS SECTION (4 Premium Cards) ── */}
      <div className="relative z-10 mx-auto max-w-7xl px-5 pb-20 sm:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { val: "50M+", label: "Views Generated" },
            { val: "500+", label: "Edits Delivered" },
            { val: "100+", label: "Retained Clients" },
            { val: "24-Hour", label: "Turnaround Option" },
          ].map(({ val, label }) => (
            <div
              key={label}
              className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-5 sm:p-6 backdrop-blur-md transition-all duration-300 hover:border-white/12 hover:bg-white/[0.04] metric-card-glow text-center lg:text-left"
            >
              <div
                className="font-display text-3xl sm:text-4xl font-black tracking-tight"
                style={{
                  background: "linear-gradient(135deg, #fff 40%, #00D4FF 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}
              >
                {val}
              </div>
              <div className="mt-2 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80 font-extrabold">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex">
        <div className="h-8 w-5 rounded-full border border-white/10 flex justify-center pt-1.5">
          <div className="w-0.5 h-2 bg-[#00D4FF] hero-scroll-dot" />
        </div>
      </div>

      {/* Showreel Modal */}
      <AnimatePresence>
        {showreelOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
            onClick={() => setShowreelOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative aspect-video w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-black shadow-[0_0_60px_rgba(0,0,0,0.9)]"
            >
              <button
                onClick={() => setShowreelOpen(false)}
                className="absolute right-4 top-4 z-50 grid size-10 place-items-center rounded-full border border-white/10 bg-black/50 text-white transition-colors hover:bg-white/10"
                aria-label="Close modal"
              >
                <X className="size-5" />
              </button>
              <video src={HERO_VIDEO} controls autoPlay className="size-full object-cover" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
