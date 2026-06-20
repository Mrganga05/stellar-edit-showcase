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
        className="relative z-10 mx-auto grid min-h-[100svh] max-w-7xl items-center gap-14 px-5 pb-16 pt-32 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:pb-24 lg:pt-36"
      >
        {/* LEFT: Text column */}
        <div className="text-center lg:text-left">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-foreground/70 sm:text-xs backdrop-blur-sm"
          >
            <Sparkles className="size-3.5 text-[#00D4FF]" style={{ filter: "drop-shadow(0 0 6px #00D4FF)" }} />
            Premium Post-Production Studio
            <span className="h-3 w-px bg-white/15" />
            <span className="text-[#00D4FF] font-semibold" style={{ textShadow: "0 0 12px #00D4FF88" }}>Now Booking Q3</span>
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
            className="mt-8 flex flex-col items-center gap-4.5 sm:flex-row sm:justify-center lg:justify-start"
          >
            <a
              href="#contact"
              className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-full px-8 py-4.5 text-sm font-bold tracking-wide text-white transition-all duration-300 hover:scale-[1.02] sm:w-auto"
              style={{ 
                background: "linear-gradient(135deg, #00D4FF 0%, #8B5CF6 100%)", 
                boxShadow: "0 0 32px rgba(0,212,255,0.4), 0 4px 20px rgba(139,92,246,0.3)" 
              }}
            >
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "linear-gradient(135deg, #00b8db 0%, #7c3aed 100%)" }} />
              <span className="relative">Book A Strategy Call</span>
              <ArrowRight className="relative size-4 transition-transform group-hover:translate-x-1" />
            </a>

            <button
              onClick={() => setShowreelOpen(true)}
              className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] px-8 py-4.5 text-sm font-semibold text-white/90 transition-all duration-200 sm:w-auto backdrop-blur-sm"
            >
              <Play className="size-4 fill-white text-white group-hover:scale-110 transition-transform" />
              <span>Watch Showreel</span>
            </button>
          </motion.div>

          {/* Outcome Badges (Replacing raw software badges) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.44 }}
            className="mt-8 flex flex-col gap-3.5 items-center lg:items-start"
          >
            <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/85 font-bold">
              Engineered For Outcomes:
            </span>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              {[
                {
                  label: "↑ High Retention Hook",
                  color: "#00E5FF",
                  bg: "rgba(0,229,255,0.06)",
                  border: "rgba(0,229,255,0.18)",
                  icon: <TrendingUp className="size-3.5 shrink-0" />,
                },
                {
                  label: "⚡ 24h Turnaround Available",
                  color: "#C4ABFF",
                  bg: "rgba(196,171,255,0.06)",
                  border: "rgba(139,92,246,0.2)",
                  icon: <Zap className="size-3.5 shrink-0" />,
                },
                {
                  label: "🎯 Platform-Native Optimization",
                  color: "#34D399",
                  bg: "rgba(52,211,153,0.06)",
                  border: "rgba(52,211,153,0.18)",
                  icon: <Target className="size-3.5 shrink-0" />,
                },
                {
                  label: "📈 Revenue-Driven Editing",
                  color: "#FBB724",
                  bg: "rgba(251,183,36,0.06)",
                  border: "rgba(251,183,36,0.18)",
                  icon: <Award className="size-3.5 shrink-0" />,
                },
              ].map(({ label, color, bg, border, icon }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[10px] font-bold tracking-wider transition-all duration-200 hover:scale-105 hover:brightness-110 cursor-default"
                  style={{ color, background: bg, border: `1px solid ${border}`, boxShadow: `0 0 12px ${color}10` }}
                >
                  {icon}
                  {label}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* RIGHT: Visual Area - Full-width Workspace Image */}
        <div className="relative w-full lg:mx-0">
          {/* Main Workspace Preview Card */}
          <div className="relative group">
            {/* Outer glow ring */}
            <div
              className="absolute -inset-6 rounded-[36px] opacity-50 group-hover:opacity-75 transition-opacity duration-700 pointer-events-none"
              style={{
                background: "conic-gradient(from 0deg at 50% 50%, #00D4FF22, #8B5CF622, #00D4FF22)",
                filter: "blur(24px)",
                animation: "spin-slow 8s linear infinite",
              }}
            />

            <div
              className="relative overflow-hidden rounded-[28px] border border-white/12 bg-black/70 p-2 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.95)] transition-all duration-300 group-hover:border-white/25"
              style={{ willChange: "transform" }}
            >
              {/* Image Preview Container with landscape aspect ratios to show the full workspace image */}
              <div 
                className="relative aspect-video overflow-hidden rounded-[22px] sm:aspect-[16/10] lg:aspect-[16/10] xl:aspect-[16/10] select-none"
              >
                <img
                  src={heroEditorImg}
                  alt="Premium Video Editing Workspace"
                  className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
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
