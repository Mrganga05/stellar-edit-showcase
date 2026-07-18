import { motion, AnimatePresence, useInView } from "motion/react";
import { ArrowRight, Play, X, Eye, Briefcase, Users, Star, Heart, Share2, Bookmark, Info, Volume2, VolumeX, Sparkles, Film, Sliders, Music } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { HERO_VIDEO } from "@/lib/portfolio-data";
import heroBgImg from "@/assets/hero-bg.png";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

// ─── Letter-by-letter animation for "THAT DEMANDS ATTENTION." ───────────────
const prefersReducedMotion =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

interface TypeAnimationProps {
  sequence: (string | number)[];
  speed: number;
  className?: string;
}

function TypeAnimation({ sequence, speed, className }: TypeAnimationProps) {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let isMounted = true;
    let sequenceIndex = 0;

    const runSequence = async () => {
      while (isMounted) {
        const currentVal = sequence[sequenceIndex];

        if (typeof currentVal === "string") {
          // Type character by character
          for (let i = 0; i <= currentVal.length; i++) {
            if (!isMounted) return;
            setDisplayText(currentVal.slice(0, i));
            await new Promise((r) => setTimeout(r, speed));
          }
        } else if (typeof currentVal === "number") {
          // Pause for the duration
          await new Promise((r) => setTimeout(r, currentVal));

          if (!isMounted) return;
          // Erase character by character
          const lastIndex = (sequenceIndex - 1 + sequence.length) % sequence.length;
          const lastVal = sequence[lastIndex];
          const textToErase = typeof lastVal === "string" ? lastVal : "";

          for (let i = textToErase.length; i >= 0; i--) {
            if (!isMounted) return;
            setDisplayText(textToErase.slice(0, i));
            await new Promise((r) => setTimeout(r, speed / 3)); // Erase 3x faster
          }
          await new Promise((r) => setTimeout(r, 400));
        }

        sequenceIndex = (sequenceIndex + 1) % sequence.length;
      }
    };

    runSequence();

    return () => {
      isMounted = false;
    };
  }, [sequence, speed]);

  return (
    <span className={className}>
      {displayText}
      <span className="animate-blink font-normal text-electric select-none">|</span>
    </span>
  );
}

// Ease-out smooth animated counter for stats cards
function AnimatedCounter({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const num = parseInt(value.replace(/[^0-9]/g, ""));
  const suffix = value.replace(/[0-9]/g, "");
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let startTime: number | null = null;
    const duration = 2000; // 2s smooth animation

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const progressCubic = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(progressCubic * num));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [num, isInView]);

  return (
    <span
      ref={ref}
      className={cn(
        "font-sans text-3xl lg:text-[40px] font-extrabold leading-none tracking-tight",
        className,
      )}
    >
      {count}
      {suffix}
    </span>
  );
}

// Reusable premium spring-loaded Magnetic Button Wrapper
function MagneticButton({
  children,
  className,
  style,
  href,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  href?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    // Limit range to max 8px for subtle magnetic pull
    setPosition({ x: x * 0.22, y: y * 0.22 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={style}
    >
      {children}
    </motion.a>
  );
}

export function Hero() {
  const [showreelOpen, setShowreelOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showDetailsOnMobile, setShowDetailsOnMobile] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(15420);

  const [heroData, setHeroData] = useState({
    showreelVideoUrl: "",
    showreelTitle: "Raqvine Signature Showreel",
    showreelDescription: "A compilation of our finest edits, showcasing pacing, storytelling, sound design, and grading.",
    videoAspect: "portrait"
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadHeroSettings() {
      try {
        const { data, error } = await supabase
          .from("hero_settings")
          .select("*");
        if (!error && data && data.length > 0) {
          const row = data[0];
          setHeroData({
            showreelVideoUrl: row.showreelVideoUrl || "",
            showreelTitle: row.showreelTitle || "Raqvine Signature Showreel",
            showreelDescription: row.showreelDescription || "A compilation of our finest edits, showcasing pacing, storytelling, sound design, and grading.",
            videoAspect: row.videoAspect || "portrait"
          });
        }
      } catch (err) {
        console.error("Failed to load hero settings from database:", err);
      }
    }
    loadHeroSettings();
  }, []);

  const showreelUrl = heroData.showreelVideoUrl || HERO_VIDEO;

  return (
    <section
      ref={scrollRef}
      id="top"
      className="relative min-h-screen w-full flex flex-col pt-[88px] pb-16 lg:pb-24 overflow-hidden"
      style={{ backgroundColor: "#050816" }}
    >
      {/* Background Image covering whole hero section - Highly Visible with Full Clarity */}
      {/* Desktop background - untouched */}
      <div
        className="absolute inset-0 z-0 pointer-events-none bg-cover bg-no-repeat opacity-100 hidden lg:block"
        style={{
          backgroundImage: `url(${heroBgImg})`,
          backgroundPosition: "68% center",
        }}
      />
      {/* Mobile/Tablet background - centered and slightly lower opacity for text contrast */}
      <div
        className="absolute inset-0 z-0 pointer-events-none bg-cover bg-no-repeat opacity-30 lg:hidden"
        style={{
          backgroundImage: `url(${heroBgImg})`,
          backgroundPosition: "center center",
        }}
      />

      {/* Horizontal & Vertical Gradient Overlay for Text Readability & Smooth Transition - Shifted Left for Background Clarity */}
      {/* Desktop overlay - untouched */}
      <div
        className="absolute inset-0 z-1 pointer-events-none hidden lg:block"
        style={{
          background:
            "linear-gradient(to right, rgba(5, 8, 22, 0.95) 0%, rgba(5, 8, 22, 0.7) 25%, rgba(5, 8, 22, 0) 52%), linear-gradient(to bottom, transparent 75%, #050816 100%)",
        }}
      />
      {/* Mobile/Tablet overlay - full screen dark radial gradient for readability */}
      <div
        className="absolute inset-0 z-1 pointer-events-none lg:hidden"
        style={{
          background:
            "radial-gradient(circle at center, rgba(5, 8, 22, 0.85) 0%, rgba(5, 8, 22, 0.95) 100%), linear-gradient(to bottom, transparent 75%, #050816 100%)",
        }}
      />

      {/* Film Grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.018] z-15"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none vignette z-10" />

      {/* Grid overlay for digital alignment */}
      <div className="hero-grid absolute inset-0 opacity-[0.015] pointer-events-none" />

      {/* ── MAIN HERO LAYOUT CONTAINER ── */}
      <div className="relative z-10 mx-auto w-full max-w-[1440px] pl-6 pr-6 md:pl-8 md:pr-8 lg:pl-12 lg:pr-12 xl:pl-16 xl:pr-16 pt-8 lg:pt-12 pb-6 lg:pb-8 flex-grow flex flex-col justify-center">
        {/* Two-Column Grid: Left Column has structured copy, Right Column is empty to expose background image */}
        <div className="grid w-full grid-cols-1 lg:grid-cols-[54%_42%] items-center gap-x-[4%]">
          {/* ── LEFT SIDE: BRAND & COPY ── */}
          <div className="relative text-center lg:text-left flex flex-col items-center lg:items-start justify-center lg:justify-start pt-0">
            {/* Ambient light glow behind text for contrast and aesthetics */}
            <div className="absolute -left-20 -top-20 size-[400px] rounded-full bg-cyan-500/25 blur-[120px] pointer-events-none -z-10" />
            <div className="absolute -right-10 -bottom-10 size-[350px] rounded-full bg-purple-500/20 blur-[120px] pointer-events-none -z-10" />

            {/* Top Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: -12 }}
              animate={{
                opacity: 1,
                scale: [1, 1.02, 1],
                boxShadow: [
                  "0 4px 20px rgba(59,130,246,0.15)",
                  "0 4px 30px rgba(34,211,238,0.4)",
                  "0 4px 20px rgba(59,130,246,0.15)",
                ],
              }}
              whileHover={{ scale: 1.05 }}
              transition={{
                opacity: { duration: 0.6 },
                scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                boxShadow: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              }}
              className="relative inline-flex items-center gap-2 rounded-full p-[1.5px] mb-5 lg:mb-6 select-none bg-gradient-to-r from-[#3B82F6] via-[#22d3ee] to-[#a855f7] bg-[length:200%_auto] animate-gradient-text"
            >
              <div className="flex items-center gap-2 rounded-full bg-[#050816]/95 px-[18px] py-[8px]">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  className="text-[#22d3ee] text-[13px] font-bold inline-block"
                >
                  ✦
                </motion.span>
                <span className="text-badge-text text-white font-black tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-[#a5f3fc] via-[#ffffff] to-[#a5f3fc] bg-[length:200%_auto] animate-gradient-text">
                  PROFESSIONAL VIDEO EDITOR
                </span>
              </div>
            </motion.div>

            {/* Editorial Headline */}
            <div className="flex flex-col items-center lg:text-left w-full">
              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, ease: [0.19, 1, 0.22, 1] }}
                className="text-hero-title max-w-[820px] text-center lg:text-left pr-6 font-display"
              >
                <span className="block">TURNING RAW FOOTAGE</span>
                <span className="block">INTO CONTENT</span>
                <span className="block min-h-[2.2em] relative">
                  <TypeAnimation
                    sequence={["THAT DEMANDS ATTENTION.", 3000]}
                    speed={110}
                    className="text-gradient-brand font-display italic font-black animate-gradient-text pr-2.5 inline-block filter drop-shadow-[0_0_15px_rgba(56,189,248,0.45)]"
                  />
                </span>
              </motion.h1>

              {/* Accent bar */}
              <div className="h-[4px] w-[140px] bg-gradient-to-r from-[#22d3ee] to-[#a855f7] rounded-full mt-4" />
            </div>

            {/* Supporting Copy */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12 }}
              className="mt-6 max-w-[540px] text-hero-subtitle text-center lg:text-left mb-8 text-white/80 leading-relaxed font-sans"
            >
              Helping creators, startups, and brands transform raw footage into cinematic content that captures attention, builds credibility, and delivers measurable results.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.22 }}
              className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start w-full sm:w-auto z-20"
            >
              <MagneticButton
                href="#contact"
                className="group btn-primary-glow inline-flex items-center justify-center gap-2.5 rounded-full px-9 h-[54px] text-button-text uppercase text-white cursor-pointer overflow-hidden w-full sm:w-auto"
              >
                {/* Sheen reflection sweep */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
                <span className="relative flex items-center gap-2.5 z-10">
                  <span>BOOK A STRATEGY CALL</span>
                  <ArrowRight className="size-4.5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </MagneticButton>

              <button
                onClick={() => setShowreelOpen(true)}
                className="group btn-secondary-glow inline-flex items-center justify-center gap-2.5 rounded-full px-9 h-[54px] text-button-text uppercase text-white overflow-hidden cursor-pointer w-full sm:w-auto"
              >
                {/* Sheen reflection sweep */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
                <span className="relative flex items-center gap-2.5 z-10">
                  <Play className="size-4.5 fill-white/10 text-white group-hover:fill-[#22d3ee]/20 group-hover:text-[#22d3ee] transition-colors" />
                  <span>WATCH SHOWREEL</span>
                </span>
              </button>
            </motion.div>
          </div>

          {/* ── RIGHT SIDE: EMPTY FOR BG IMAGE VISIBILITY ── */}
          <div className="hidden lg:block w-full h-[1px]" />
        </div>
      </div>

      {/* ── BOTTOM STATS ROW ── */}
      <div className="relative z-10 mx-auto w-full max-w-[1320px] px-6 md:px-8 mt-auto pt-6 pb-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 border-t border-white/[0.08] pt-6 lg:pt-8">
          {[
            {
              val: "50M+",
              label: "VIEWS GENERATED",
              color: "#38bdf8",
              borderBeamClass: "hover-beam-cyan",
              textGradientClass: "text-gradient-cyan",
              borderStyle: "border-[#38bdf8]/30 text-[#38bdf8]",
              icon: Eye,
            },
            {
              val: "500+",
              label: "PROJECTS DELIVERED",
              color: "#38bdf8",
              borderBeamClass: "hover-beam-cyan",
              textGradientClass: "text-gradient-cyan",
              borderStyle: "border-[#38bdf8]/30 text-[#38bdf8]",
              icon: Briefcase,
            },
            {
              val: "100+",
              label: "HAPPY CLIENTS",
              color: "#38bdf8",
              borderBeamClass: "hover-beam-cyan",
              textGradientClass: "text-gradient-cyan",
              borderStyle: "border-[#38bdf8]/30 text-[#38bdf8]",
              icon: Users,
            },
            {
              val: "99%",
              label: "SATISFACTION RATE",
              color: "#38bdf8",
              borderBeamClass: "hover-beam-cyan",
              textGradientClass: "text-gradient-cyan",
              borderStyle: "border-[#38bdf8]/30 text-[#38bdf8]",
              icon: Star,
            },
          ].map(
            ({
              val,
              label,
              borderStyle,
              icon: Icon,
              borderBeamClass,
              textGradientClass,
              color,
            }) => (
              <div
                key={label}
                className={cn(
                  "group relative flex flex-row items-center gap-2 sm:gap-4 rounded-[12px] border border-white/[0.05] bg-[#050810]/40 p-2.5 sm:p-4 lg:p-6 transition-all duration-500 hover:-translate-y-1.5 overflow-hidden cursor-default w-full backdrop-blur-xl card-tech-grid",
                  borderBeamClass,
                )}
              >
                {/* Glass sheen reflection overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none z-1" />

                {/* Ambient soft background glow behind icon on hover */}
                <div
                  className="absolute size-12 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"
                  style={{
                    background: color,
                    left: "24px",
                    top: "24px",
                    filter: "blur(20px)",
                    zIndex: 0,
                  }}
                />

                {/* Icon circle */}
                <div
                  className={`relative shrink-0 size-8 sm:size-10 rounded-full border-2 ${borderStyle} flex items-center justify-center bg-[#050810]/60 transition-all duration-500 group-hover:scale-105 z-10 shadow-[0_0_15px_rgba(255,255,255,0.02)]`}
                >
                  <Icon
                    className="size-4 sm:size-5 transition-transform duration-500 group-hover:scale-110"
                    strokeWidth={2}
                  />
                </div>
                <div className="flex flex-col text-left z-10 min-w-0">
                  <span className="font-sans text-[20px] min-[375px]:text-[22px] sm:text-[28px] lg:text-[32px] font-extrabold leading-none tracking-tight">
                    <AnimatedCounter value={val} className={textGradientClass} />
                  </span>
                  <span className="text-[8px] min-[375px]:text-[9px] sm:text-[10px] lg:text-[11px] text-[#a1a1aa] font-black uppercase tracking-widest mt-1 leading-tight font-sans opacity-85 group-hover:opacity-100 group-hover:text-white transition-colors duration-300">
                    {label}
                  </span>
                </div>
              </div>
            ),
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 opacity-25 select-none pointer-events-none">
        <span className="text-[8px] font-bold uppercase tracking-wider text-[#a1a1aa]/30 font-sans">
          Scroll
        </span>
        <div className="w-4 h-7 rounded-full border border-white/10 flex items-start justify-center p-0.5">
          <div className="w-0.5 h-1 rounded-full bg-[#22d3ee] hero-scroll-dot" />
        </div>
      </div>

      {/* ── SHOWREEL MODAL ── */}
      <AnimatePresence>
        {showreelOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
            style={{ backdropFilter: "blur(16px)" }}
            onClick={() => setShowreelOpen(false)}
          >
            {/* Ambient colorful background blobs for depth */}
            <div className="absolute top-1/4 left-1/4 size-[400px] rounded-full bg-cyan-500/10 blur-[150px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 size-[400px] rounded-full bg-purple-500/10 blur-[150px] pointer-events-none" />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "relative w-full overflow-hidden rounded-[32px] border border-white/10 bg-[#040612]/90 shadow-[0_0_80px_rgba(0,0,0,0.9)] backdrop-blur-xl flex flex-col md:grid",
                heroData.videoAspect === "landscape"
                  ? "max-w-sm md:max-w-5xl h-[92vh] md:h-[75vh] max-h-[700px] md:grid-cols-[1.4fr_1fr]"
                  : "max-w-sm md:max-w-4xl h-[92vh] md:h-[80vh] max-h-[750px] md:grid-cols-[auto_1fr]"
              )}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowreelOpen(false)}
                className="absolute right-5 top-5 z-[60] grid size-10 place-items-center rounded-full bg-black/60 text-white/80 border border-white/10 hover:text-white hover:bg-white/10 transition duration-300 backdrop-blur-md shadow-lg cursor-pointer"
                title="Close dialog"
              >
                <X className="size-5" />
              </button>

              {/* ──────────────── LEFT COLUMN: VIDEO PLAYER (PORTRAIT 9:16 vs LANDSCAPE 16:9) ──────────────── */}
              <div className={cn(
                "relative w-full bg-black border-b md:border-b-0 md:border-r border-white/10 flex items-center justify-center flex-shrink-0 p-4 overflow-hidden group/video-container",
                heroData.videoAspect === "landscape"
                  ? "aspect-video md:aspect-auto md:h-full"
                  : "md:w-[380px] aspect-[9/16] md:aspect-auto md:h-full"
              )}>
                {/* Phone mockup styled frame */}
                <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 bg-black flex items-center justify-center shadow-inner">
                  
                  {/* Glowing neon animated border border beam */}
                  <div className="absolute inset-0 z-0 p-[1.5px] rounded-2xl overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 opacity-60 animate-gradient-text" />
                  </div>

                  <video
                    src={showreelUrl}
                    controls={false}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    className={cn(
                      "relative z-10 w-full h-full rounded-2xl",
                      heroData.videoAspect === "landscape" ? "object-contain" : "object-cover"
                    )}
                  />

                  {/* Volume Control Overlay */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMuted(!isMuted);
                    }}
                    className="absolute top-4 left-4 z-20 grid size-9 place-items-center rounded-full bg-black/50 text-white/90 border border-white/10 hover:bg-black/75 transition backdrop-blur-md cursor-pointer"
                  >
                    {isMuted ? <VolumeX className="size-4.5" /> : <Volume2 className="size-4.5" />}
                  </button>

                  {/* Playback Indicator Glow (Hover/Tap UI) */}
                  <div className="absolute inset-0 z-15 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none rounded-2xl" />

                  {/* ── MOBILE OVERLAYS: INSTAGRAM STYLE ── */}
                  <div className="absolute inset-x-0 bottom-0 z-20 p-4 flex flex-col justify-end text-left md:hidden bg-gradient-to-t from-black/80 via-black/30 to-transparent pt-12">
                    
                    {/* User profile section */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="size-8 rounded-full border border-white/20 bg-gradient-to-tr from-cyan-500 to-purple-500 p-[1px]">
                        <div className="size-full rounded-full bg-[#050816] flex items-center justify-center text-[10px] font-black text-white">R</div>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-white tracking-wide">raqvine.edits</span>
                          <span className="grid size-3.5 place-items-center rounded-full bg-[#22d3ee] text-black text-[8px] font-black">✓</span>
                        </div>
                      </div>
                    </div>

                    {/* Showreel Title & Snippet Description */}
                    <h4 className="text-xs font-bold text-white mb-1">
                      {heroData.showreelTitle}
                    </h4>
                    <p className="text-[10px] text-white/80 line-clamp-2 leading-relaxed pr-8">
                      {heroData.showreelDescription}
                    </p>

                    {/* Expand Details Trigger */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDetailsOnMobile(true);
                      }}
                      className="text-[9px] font-bold text-[#22d3ee] hover:underline text-left mt-1.5 flex items-center gap-1 cursor-pointer"
                    >
                      <Info className="size-3" /> View Full Showreel Details
                    </button>

                    {/* Music Ticker Marquee */}
                    <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-white/5 overflow-hidden w-[80%]">
                      <Music className="size-3 text-white/50 shrink-0" />
                      <div className="text-[9px] text-white/50 whitespace-nowrap animate-marquee">
                        original audio - Raqvine Edits • original audio - Raqvine Edits
                      </div>
                    </div>
                  </div>

                  {/* Mobile Right Action Tray */}
                  <div className="absolute right-3 bottom-24 z-20 flex flex-col gap-4 items-center md:hidden">
                    {/* Like button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsLiked(!isLiked);
                        setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
                      }}
                      className="flex flex-col items-center gap-1 group/btn"
                    >
                      <div className={cn(
                        "grid size-10 place-items-center rounded-full transition-all border border-white/10 backdrop-blur-md cursor-pointer",
                        isLiked ? "bg-red-500 text-white border-red-500 scale-110" : "bg-black/45 text-white hover:bg-black/60"
                      )}>
                        <Heart className={cn("size-4.5", isLiked && "fill-current")} />
                      </div>
                      <span className="text-[9px] font-bold text-white/90">{likesCount.toLocaleString()}</span>
                    </button>

                    {/* Save/Bookmark */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsBookmarked(!isBookmarked);
                      }}
                      className="flex flex-col items-center gap-1"
                    >
                      <div className={cn(
                        "grid size-10 place-items-center rounded-full transition-all border border-white/10 backdrop-blur-md cursor-pointer",
                        isBookmarked ? "bg-yellow-500 text-black border-yellow-500 scale-110" : "bg-black/45 text-white hover:bg-black/60"
                      )}>
                        <Bookmark className={cn("size-4.5", isBookmarked && "fill-current")} />
                      </div>
                      <span className="text-[9px] font-bold text-white/90">Save</span>
                    </button>

                    {/* Info button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDetailsOnMobile(true);
                      }}
                      className="flex flex-col items-center gap-1"
                    >
                      <div className="grid size-10 place-items-center rounded-full bg-black/45 text-white border border-white/10 hover:bg-black/60 backdrop-blur-md cursor-pointer">
                        <Info className="size-4.5" />
                      </div>
                      <span className="text-[9px] font-bold text-white/90">Info</span>
                    </button>
                  </div>

                  {/* Style block for marquee effect */}
                  <style>{`
                    @keyframes marquee {
                      0% { transform: translateX(0%); }
                      100% { transform: translateX(-50%); }
                    }
                    .animate-marquee {
                      display: inline-block;
                      animation: marquee 12s linear infinite;
                    }
                  `}</style>

                </div>
              </div>

              {/* ──────────────── RIGHT COLUMN: DETAILS BOARD (DESKTOP) ──────────────── */}
              <div className="hidden md:flex flex-col h-full overflow-y-auto p-8 lg:p-10 bg-gradient-to-b from-[#0b1224]/80 to-[#040612]/95 backdrop-blur-md min-h-0 relative">
                {/* Glow accents */}
                <div className="absolute top-0 right-0 size-[200px] rounded-full bg-[#22d3ee]/5 blur-[80px] pointer-events-none" />

                <div className="space-y-6 flex-grow flex flex-col justify-center">
                  <div>
                    {/* Glass Badge */}
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-400 mb-4 select-none"
                    >
                      <Sparkles className="size-3" />
                      <span>Featured Video Showreel</span>
                    </motion.div>

                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="text-2xl font-bold tracking-tight text-white font-display"
                    >
                      {heroData.showreelTitle}
                    </motion.h3>

                    {/* Thin Glowing Divider */}
                    <div className="h-[2px] w-32 bg-gradient-to-r from-[#22d3ee] to-[#a855f7] rounded-full my-4" />

                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-sm text-neutral-300 leading-relaxed whitespace-pre-wrap font-sans mt-2"
                    >
                      {heroData.showreelDescription}
                    </motion.p>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-white/[0.08] mt-2">
                    {[
                      { icon: Film, label: "Editing Style", desc: "Retention-focused pacing" },
                      { icon: Users, label: "Platform Fit", desc: "9:16 portrait native" },
                      { icon: Sliders, label: "VFX & Graphics", desc: "Kinetic titles & SFX" },
                      { icon: Star, label: "Resolution", desc: "4K ultra-sharp grade" },
                    ].map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.25 + idx * 0.05 }}
                          className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition duration-300"
                        >
                          <div className="grid size-8 place-items-center rounded-lg border border-cyan-500/20 text-cyan-400 bg-cyan-500/5 shrink-0">
                            <Icon className="size-4" />
                          </div>
                          <div className="flex flex-col text-left">
                            <span className="text-[10px] font-black text-white/50 uppercase tracking-widest leading-none">{item.label}</span>
                            <span className="text-xs text-neutral-200 mt-1 font-semibold leading-tight">{item.desc}</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Action row */}
                  <div className="pt-6 border-t border-white/[0.08] flex items-center justify-between mt-auto">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                      Format: Instagram Reel / YouTube Short
                    </span>
                    <a
                      href="#contact"
                      onClick={() => setShowreelOpen(false)}
                      className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition duration-300"
                    >
                      <span>BOOK A CALL NOW</span>
                      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </a>
                  </div>
                </div>
              </div>

              {/* ── MOBILE OVERLAY FULL DETAILS DRAWER ── */}
              <AnimatePresence>
                {showDetailsOnMobile && (
                  <motion.div
                    initial={{ opacity: 0, y: "100%" }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 220 }}
                    className="absolute inset-x-0 bottom-0 z-50 bg-[#050816]/95 border-t border-white/10 rounded-t-[24px] p-6 text-left md:hidden flex flex-col max-h-[70%] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-4" />
                    
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-white font-display">Showreel Info</h3>
                      <button
                        onClick={() => setShowDetailsOnMobile(false)}
                        className="text-xs font-bold text-cyan-400 uppercase tracking-widest cursor-pointer"
                      >
                        Done
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-white">{heroData.showreelTitle}</h4>
                        <p className="text-xs text-neutral-300 leading-relaxed mt-2 whitespace-pre-wrap">
                          {heroData.showreelDescription}
                        </p>
                      </div>

                      <div className="h-px bg-white/5 my-2" />

                      <div className="space-y-3">
                        <div className="flex gap-3 items-center text-xs text-neutral-300">
                          <Film className="size-4 text-cyan-400" />
                          <span><strong>Editing Style:</strong> Retention-focused pacing</span>
                        </div>
                        <div className="flex gap-3 items-center text-xs text-neutral-300">
                          <Sliders className="size-4 text-cyan-400" />
                          <span><strong>Graphics:</strong> Kinetic titles & custom SFX</span>
                        </div>
                        <div className="flex gap-3 items-center text-xs text-neutral-300">
                          <Star className="size-4 text-cyan-400" />
                          <span><strong>Resolution:</strong> 4K ultra-sharp grade</span>
                        </div>
                      </div>

                      <a
                        href="#contact"
                        onClick={() => {
                          setShowDetailsOnMobile(false);
                          setShowreelOpen(false);
                        }}
                        className="w-full text-center mt-4 bg-gradient-to-r from-cyan-500 to-blue-600 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white inline-block cursor-pointer"
                      >
                        Book a Strategy Call
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
