import { motion, useScroll, useTransform, useMotionValue, useSpring, useMotionTemplate, AnimatePresence } from "motion/react";
import { ArrowRight, Sparkles, Play, X } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { HERO_VIDEO } from "@/lib/portfolio-data";
import { supabase } from "@/lib/supabase";

export function Hero() {
  const [showreelOpen, setShowreelOpen] = useState(false);
  const [colorGradeMode, setColorGradeMode] = useState<"before" | "after">("after");
  const [heroData, setHeroData] = useState({
    headline: 'Edits That <span class="font-display italic font-normal text-gradient-brand">Hold Attention</span> <br/> And Drive Results.',
    subheadline: 'Raqvine transforms raw footage into cinematic, high-retention content built to move audiences, scale channels, and grow ambitious brands worldwide.'
  });

  useEffect(() => {
    async function loadHero() {
      try {
        const { data, error } = await supabase
          .from("hero_settings")
          .select("*")
          .order("createdAt", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (data) {
          setHeroData({
            headline: data.headline,
            subheadline: data.subheadline,
          });
        }
      } catch (err) {
        console.error("Failed to load hero settings", err);
      }
    }
    loadHero();
  }, []);

  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // 3D Perspective Card Tilt states using Motion Values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 120, damping: 18 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 120, damping: 18 });

  // Glare / Reflection effect values
  const glareX = useSpring(useTransform(mouseX, [-0.5, 0.5], [0, 100]), { stiffness: 120, damping: 18 });
  const glareY = useSpring(useTransform(mouseY, [-0.5, 0.5], [0, 100]), { stiffness: 120, damping: 18 });
  const glareBg = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.12) 0%, transparent 65%)`;

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    mouseX.set(clientX / width - 0.5);
    mouseY.set(clientY / height - 0.5);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <section ref={ref} id="top" className="relative min-h-[100svh] w-full overflow-hidden">
      <video
        className="absolute inset-0 size-full scale-105 object-cover opacity-35 blur-[2px]"
        src={HERO_VIDEO}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster=""
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_38%,rgba(0,212,255,0.14),transparent_24%),radial-gradient(circle_at_28%_78%,rgba(139,92,246,0.14),transparent_28%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/45 via-background/75 to-background" />
      <div className="hero-grid absolute inset-0 opacity-20" />
      <div className="absolute left-[8%] top-24 h-56 w-56 rounded-full bg-electric/10 blur-[110px]" />
      <div className="absolute bottom-16 right-[4%] h-72 w-72 rounded-full bg-violet-glow/15 blur-[130px]" />

      {/* Floating Sparkle Particles in Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-[15%] size-1.5 rounded-full bg-electric/30 animate-pulse-glow" style={{ animationDelay: "1s" }} />
        <div className="absolute top-[65%] left-[25%] size-1 rounded-full bg-violet-glow/40 animate-pulse-glow" style={{ animationDelay: "2s" }} />
        <div className="absolute top-[40%] right-[30%] size-2 rounded-full bg-electric/25 animate-pulse-glow" style={{ animationDelay: "0.5s" }} />
        <div className="absolute top-[80%] right-[15%] size-1.5 rounded-full bg-violet-glow/30 animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
      </div>

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 mx-auto grid min-h-[100svh] max-w-7xl items-center gap-14 px-5 pb-16 pt-32 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pb-20 lg:pt-36"
      >
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-foreground/70 sm:text-xs"
          >
            <Sparkles className="size-3.5 text-electric animate-spin" style={{ animationDuration: "3s" }} />
            Premium post-production studio
            <span className="h-3 w-px bg-white/15" />
            <span className="text-electric">Now booking</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[42px] leading-[0.96] tracking-[-0.03em] sm:text-6xl lg:text-[72px] xl:text-[80px]"
            dangerouslySetInnerHTML={{ __html: heroData.headline }}
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0"
          >
            {heroData.subheadline}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
          >
            <button
              onClick={() => setShowreelOpen(true)}
              className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-foreground px-7 py-4 text-sm font-semibold text-background shadow-[0_0_30px_-5px_rgba(0,212,255,0.3)] hover:shadow-[0_0_30px_5px_rgba(0,212,255,0.5)] transition-all hover:-translate-y-0.5 sm:w-auto"
            >
              <Play className="size-4 fill-current" />
              View Showreel
            </button>
            <a
              href="#contact"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full glass px-7 py-4 text-sm font-medium text-white/90 transition-all hover:-translate-y-0.5 hover:bg-white/5 hover:border-white/20 sm:w-auto"
            >
              Book A Free Consultation
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </motion.div>

          {/* Software Logos Section */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.38 }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-6 justify-center lg:justify-start"
          >
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">Software Used:</span>
            <div className="flex items-center gap-3.5">
              <div className="group/tool relative flex items-center gap-1.5 rounded-lg border border-white/8 bg-white/2 px-2.5 py-1.5 transition-colors hover:border-[#00D4FF]/30 hover:bg-[#00D4FF]/5">
                <svg className="size-4 text-[#00E5FF]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c0 1.1.9-2 2-2V4c0-1.1-.9-2-2-2zM9.9 16.5H8.2V9.3h3c1.5 0 2.2.7 2.2 1.8 0 1.2-.8 1.8-2 1.8H9.9v3.6zm0-5.1v1.6h1.2c.4 0 .7-.2.7-.8s-.3-.8-.7-.8h-1.2zm6.2 5.1h-1.6v-5.2h1.6v1.1c.3-.8.9-1.2 1.6-1.2.2 0 .4 0 .6.1v1.5c-.2-.1-.5-.1-.7-.1-.9 0-1.5.6-1.5 1.7v2.1z" />
                </svg>
                <span className="text-[9px] font-bold tracking-widest text-white/90">Premiere Pro</span>
              </div>
              <div className="group/tool relative flex items-center gap-1.5 rounded-lg border border-white/8 bg-white/2 px-2.5 py-1.5 transition-colors hover:border-[#8B5CF6]/30 hover:bg-[#8B5CF6]/5">
                <svg className="size-4 text-[#D3B7FF]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c0 1.1.9-2 2-2V4c0-1.1-.9-2-2-2zm-8.8 14.5L10.3 14H7.7l-.9 2.5H5.1l3.3-9.2h1.8l3.3 9.2h-1.7zm1.1-5.1c.4-.7.9-1 1.6-1 .3 0 .6.1.8.2l-.3 1.5c-.2-.1-.4-.1-.6-.1-.5 0-.9.3-1.1.8v3.7h-1.6V9.4h1.5v1.2zm-2.9 2.1l-.8-2.5-.8 2.5h1.6z" />
                </svg>
                <span className="text-[9px] font-bold tracking-widest text-white/90">After Effects</span>
              </div>
              <div className="group/tool relative flex items-center gap-1.5 rounded-lg border border-white/8 bg-white/2 px-2.5 py-1.5 transition-colors hover:border-amber-500/30 hover:bg-amber-500/5">
                <svg className="size-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v6M12 16v6M2 12h6M16 12h6" />
                </svg>
                <span className="text-[9px] font-bold tracking-widest text-white/90">Resolve</span>
              </div>
            </div>
          </motion.div>

          {/* Trust Bar + Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.44 }}
            className="mt-10 mx-auto max-w-xl border-t border-white/10 pt-6 lg:mx-0"
          >
            <div className="text-center lg:text-left">
              <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-semibold">
                Trusted By Creators, Brands & Businesses Worldwide
              </span>
            </div>
            
            <div className="mt-5 grid grid-cols-3 divide-x divide-white/10">
              <div className="px-2 text-center lg:text-left first:pl-0">
                <div className="font-display text-2xl text-foreground sm:text-3xl font-bold tracking-tight">50M+</div>
                <div className="mt-1 text-[9px] uppercase tracking-[0.16em] text-muted-foreground font-medium">Views Generated</div>
              </div>
              <div className="px-4 text-center lg:text-left">
                <div className="font-display text-2xl text-foreground sm:text-3xl font-bold tracking-tight">500+</div>
                <div className="mt-1 text-[9px] uppercase tracking-[0.16em] text-muted-foreground font-medium">Projects Shipped</div>
              </div>
              <div className="px-4 text-center lg:text-left">
                <div className="font-display text-2xl text-foreground sm:text-3xl font-bold tracking-tight">100+</div>
                <div className="mt-1 text-[9px] uppercase tracking-[0.16em] text-muted-foreground font-medium">Happy Clients</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Interactive 3D Card + Hologram Elements */}
        <div className="relative mx-auto w-full max-w-[560px] lg:mx-0">
          
          {/* Floating Premium Stats above card */}
          <div className="absolute -top-12 left-0 z-30 hidden sm:flex flex-col gap-3">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/60 px-3 py-2 shadow-lg backdrop-blur-md"
            >
              <span className="size-1.5 rounded-full bg-electric animate-pulse" />
              <span className="text-[10px] font-bold tracking-wider text-white/90">Ultra HD 4K Export</span>
            </motion.div>

            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/60 px-3 py-2 shadow-lg backdrop-blur-md"
            >
              <span className="size-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[10px] font-bold tracking-wider text-white/90">24-Hour Delivery</span>
            </motion.div>
          </div>

          {/* Floating Sound Waveform Card (top-right) */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-10 -right-8 z-30 hidden sm:block rounded-2xl border border-white/10 bg-black/60 p-3.5 shadow-xl backdrop-blur-md w-36"
          >
            <div className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground">Audio Master</div>
            <div className="mt-2 flex items-end gap-1.5 h-6 justify-center">
              <span className="w-1 rounded-full bg-[#00D4FF] h-2 animate-bounce" style={{ animationDuration: "0.8s" }} />
              <span className="w-1 rounded-full bg-[#00D4FF] h-5 animate-bounce" style={{ animationDuration: "1.2s", animationDelay: "0.2s" }} />
              <span className="w-1 rounded-full bg-[#8B5CF6] h-3 animate-bounce" style={{ animationDuration: "0.9s", animationDelay: "0.1s" }} />
              <span className="w-1 rounded-full bg-[#8B5CF6] h-6 animate-bounce" style={{ animationDuration: "1.4s", animationDelay: "0.3s" }} />
              <span className="w-1 rounded-full bg-[#00D4FF] h-4 animate-bounce" style={{ animationDuration: "1.1s", animationDelay: "0.15s" }} />
              <span className="w-1 rounded-full bg-[#00D4FF] h-2 animate-bounce" style={{ animationDuration: "0.7s", animationDelay: "0.05s" }} />
            </div>
          </motion.div>

          {/* Floating Timeline Tracks Card (bottom-left) */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            className="absolute -bottom-8 -left-12 z-30 hidden sm:block rounded-2xl border border-white/10 bg-black/75 p-3.5 shadow-2xl backdrop-blur-md w-48"
          >
            <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
              <span className="text-[8px] font-bold uppercase tracking-wider text-[#00D4FF]">Timeline.prproj</span>
              <span className="text-[8px] text-white/45">00:14:02</span>
            </div>
            <div className="mt-2 space-y-1.5">
              <div className="flex items-center gap-1">
                <span className="text-[6px] text-white/30 w-3">V2</span>
                <div className="h-3.5 rounded bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 w-28 flex items-center px-1 overflow-hidden">
                  <span className="text-[5px] text-[#D3B7FF] font-semibold truncate">Motion_Title.aep</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[6px] text-white/30 w-3">V1</span>
                <div className="h-3.5 rounded bg-[#00D4FF]/20 border border-[#00D4FF]/40 w-36 flex items-center px-1 overflow-hidden">
                  <span className="text-[5px] text-[#00E5FF] font-semibold truncate">Raw_Showreel_2026.mp4</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[6px] text-white/30 w-3">A1</span>
                <div className="h-3.5 rounded bg-emerald-500/15 border border-emerald-500/35 w-36 flex items-center px-1 overflow-hidden">
                  <span className="text-[5px] text-emerald-400 font-semibold truncate">SFX_Impact_Whoosh.wav</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Floating Analytics Card (bottom-right) */}
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            className="absolute -right-12 -bottom-4 z-30 hidden sm:block rounded-2xl border border-white/10 bg-black/75 p-3.5 shadow-2xl backdrop-blur-md w-36"
          >
            <div className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground">Avg. Retention</div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="font-display text-lg font-bold text-emerald-400">+142%</span>
              <span className="text-[6px] text-[#00D4FF]">vs Benchmark</span>
            </div>
            <div className="mt-1.5 flex items-end gap-0.5 h-6">
              <span className="w-1 rounded-t bg-white/5 h-2" />
              <span className="w-1 rounded-t bg-white/10 h-3" />
              <span className="w-1 rounded-t bg-white/15 h-2.5" />
              <span className="w-1 rounded-t bg-emerald-500/30 h-4" />
              <span className="w-1 rounded-t bg-emerald-500/60 h-5" />
              <span className="w-1 rounded-t bg-emerald-500 h-6" />
            </div>
          </motion.div>

          {/* Main 3D Card Showcase */}
          <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
              perspective: 1000,
            }}
            className="group relative cursor-pointer"
          >
            {/* Slower rotating gradient backdrop glow */}
            <div className="absolute -inset-8 rounded-[40px] bg-gradient-to-br from-electric/30 via-transparent to-violet-glow/40 opacity-70 blur-3xl transition-opacity duration-1000 group-hover:opacity-90 animate-pulse-glow" style={{ animationDuration: "8s" }} />
            
            <div 
              style={{ transform: "translateZ(10px)", transformStyle: "preserve-3d" }}
              className="relative overflow-hidden rounded-[28px] border border-white/15 bg-black/65 p-2 shadow-[0_45px_100px_-35px_rgba(0,0,0,0.95)] backdrop-blur-xl transition-all duration-300 group-hover:border-white/30"
            >
              <div 
                style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}
                className="relative aspect-[4/5] overflow-hidden rounded-[22px] sm:aspect-[16/13] lg:aspect-[4/5] xl:aspect-[16/13]"
              >
                {/* Auto Playing Showreel with dynamic color-grade flat filters */}
                <video
                  src={HERO_VIDEO}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className={`size-full object-cover transition-all duration-700 ${
                    colorGradeMode === "before" 
                      ? "saturate-[0.30] contrast-[0.75] brightness-[1.1] sepia-[10%] filter blur-[0.4px]" 
                      : "saturate-[1.12] contrast-[1.04]"
                  }`}
                />

                {/* Pulse Play Showreel overlay */}
                <div 
                  className="absolute inset-0 flex items-center justify-center z-20 cursor-pointer"
                  onClick={() => setShowreelOpen(true)}
                >
                  <div className="relative grid size-16 place-items-center rounded-full border border-white/20 bg-black/45 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-500 scale-90 group-hover:scale-100 group-hover:bg-white/15 group-hover:border-white/45">
                    <div className="absolute inset-0 rounded-full border-2 border-electric opacity-0 scale-90 group-hover:animate-ping group-hover:opacity-60 duration-1000" />
                    <Play className="size-6 text-white fill-white transition-transform duration-300 group-hover:scale-110 ml-0.5" />
                  </div>
                </div>

                {/* Interactive Color Grade Toggle */}
                <div 
                  className="absolute bottom-4 right-4 z-30 flex items-center rounded-full border border-white/10 bg-black/75 p-1 backdrop-blur-md"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setColorGradeMode("before")}
                    className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider transition-all ${
                      colorGradeMode === "before" 
                        ? "bg-white/10 text-white" 
                        : "text-white/40 hover:text-white"
                    }`}
                  >
                    Raw Log
                  </button>
                  <span className="text-white/20 text-[9px] px-0.5">|</span>
                  <button
                    onClick={() => setColorGradeMode("after")}
                    className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider transition-all ${
                      colorGradeMode === "after" 
                        ? "bg-gradient-to-r from-electric to-violet-glow text-white shadow-lg" 
                        : "text-white/40 hover:text-white"
                    }`}
                  >
                    Graded
                  </button>
                </div>
                
                {/* Glare Reflection */}
                <motion.div
                  className="pointer-events-none absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: glareBg }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="pointer-events-none absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-3 text-[9px] uppercase tracking-[0.32em] text-muted-foreground lg:flex">
        <span className="h-px w-10 bg-gradient-to-r from-transparent to-white/25" />
        Scroll to discover
        <span className="h-px w-10 bg-gradient-to-l from-transparent to-white/25" />
      </div>

      {/* Fully Interactive Immersive Video Modal */}
      <AnimatePresence>
        {showreelOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-lg"
            onClick={() => setShowreelOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative aspect-video w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-black shadow-[0_0_50px_rgba(0,0,0,0.8)]"
            >
              <button
                onClick={() => setShowreelOpen(false)}
                className="absolute right-4 top-4 z-50 grid size-10 place-items-center rounded-full border border-white/10 bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-white/10"
                aria-label="Close modal"
              >
                <X className="size-5" />
              </button>
              <video
                src={HERO_VIDEO}
                controls
                autoPlay
                className="size-full object-cover"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
