import { motion, AnimatePresence, useInView } from "motion/react";
import { ArrowRight, Play, X, Eye, Briefcase, Users, Star } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { HERO_VIDEO } from "@/lib/portfolio-data";
import heroBgImg from "@/assets/hero-bg.png";
import { cn } from "@/lib/utils";

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
  const [heroData, setHeroData] = useState({
    headline:
      'TURNING RAW FOOTAGE<br/>INTO CONTENT<br/><span class="text-gradient-brand font-display italic font-black animate-gradient-text pr-2.5 inline-block">THAT DEMANDS ATTENTION.</span>',
    subheadline:
      "Helping creators, startups, and brands transform raw footage into cinematic content that captures attention, builds credibility, and delivers measurable results.",
  });

  const scrollRef = useRef<HTMLDivElement>(null);



  return (
    <section
      ref={scrollRef}
      id="top"
      className="relative min-h-screen w-full flex flex-col pt-[88px] pb-16 lg:pb-24 overflow-hidden"
      style={{ backgroundColor: "#050816" }}
    >
      {/* Background Image covering whole hero section - Highly Visible with Full Clarity */}
      <div
        className="absolute inset-0 z-0 pointer-events-none bg-cover bg-no-repeat opacity-100"
        style={{
          backgroundImage: `url(${heroBgImg})`,
          backgroundPosition: "68% center",
        }}
      />

      {/* Horizontal & Vertical Gradient Overlay for Text Readability & Smooth Transition - Shifted Left for Background Clarity */}
      <div
        className="absolute inset-0 z-1 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(5, 8, 22, 0.95) 0%, rgba(5, 8, 22, 0.7) 25%, rgba(5, 8, 22, 0) 52%), linear-gradient(to bottom, transparent 75%, #050816 100%)",
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
          <div className="relative text-left flex flex-col items-start justify-start pt-0">
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
                  "0 4px 20px rgba(59,130,246,0.15)"
                ]
              }}
              whileHover={{ scale: 1.05 }}
              transition={{
                opacity: { duration: 0.6 },
                scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                boxShadow: { duration: 4, repeat: Infinity, ease: "easeInOut" }
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
                  CINEMATIC VIDEO EDITOR
                </span>
              </div>
            </motion.div>

            {/* Editorial Headline */}
            <div className="flex flex-col items-start">
              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, ease: [0.19, 1, 0.22, 1] }}
                className="text-hero-title max-w-[820px] text-left pr-6"
              >
                {heroData.headline.includes("<br") || heroData.headline.includes("<span") ? (
                  <span dangerouslySetInnerHTML={{ __html: heroData.headline }} />
                ) : (
                  <>
                    <span className="block">TURNING RAW FOOTAGE</span>
                    <span className="block">INTO CONTENT</span>
                    <span className="animate-gradient-text italic block pr-2.5 font-black">
                      THAT DEMANDS ATTENTION.
                    </span>
                  </>
                )}
              </motion.h1>

              {/* Accent bar */}
              <div className="h-[4px] w-[140px] bg-gradient-to-r from-[#22d3ee] to-[#a855f7] rounded-full mt-4" />
            </div>

            {/* Supporting Copy */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12 }}
              className="mt-6 max-w-[540px] text-hero-subtitle text-left mb-8 text-white/80 leading-relaxed font-sans"
            >
              {heroData.subheadline}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.22 }}
              className="flex flex-wrap gap-4 items-center justify-start z-20"
            >
              <MagneticButton
                href="#contact"
                className="group btn-primary-glow inline-flex items-center justify-center gap-2.5 rounded-full px-9 h-[54px] text-button-text uppercase text-white cursor-pointer overflow-hidden"
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
                className="group btn-secondary-glow inline-flex items-center justify-center gap-2.5 rounded-full px-9 h-[54px] text-button-text uppercase text-white overflow-hidden cursor-pointer"
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 border-t border-white/[0.08] pt-6 lg:pt-8">
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
                  "group relative flex flex-row items-center gap-4 rounded-[12px] border border-white/[0.05] bg-[#050810]/40 p-4 lg:p-6 transition-all duration-500 hover:-translate-y-1.5 overflow-hidden cursor-default w-full backdrop-blur-xl card-tech-grid",
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
                  className={`relative shrink-0 size-10 rounded-full border-2 ${borderStyle} flex items-center justify-center bg-[#050810]/60 transition-all duration-500 group-hover:scale-105 z-10 shadow-[0_0_15px_rgba(255,255,255,0.02)]`}
                >
                  <Icon
                    className="size-5 transition-transform duration-500 group-hover:scale-110"
                    strokeWidth={2}
                  />
                </div>
                <div className="flex flex-col text-left z-10">
                  <span className="font-sans text-[28px] lg:text-[32px] font-extrabold leading-none tracking-tight">
                    <AnimatedCounter value={val} className={textGradientClass} />
                  </span>
                  <span className="text-[10px] lg:text-[11px] text-[#a1a1aa] font-black uppercase tracking-widest mt-1.5 leading-tight font-sans opacity-85 group-hover:opacity-100 group-hover:text-white transition-colors duration-300">
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
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
            style={{ backdropFilter: "blur(12px)" }}
            onClick={() => setShowreelOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative aspect-video w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-black shadow-[0_0_80px_rgba(0,0,0,0.95)]"
            >
              <button
                onClick={() => setShowreelOpen(false)}
                className="absolute right-4 top-4 z-50 grid size-10 place-items-center rounded-full border border-white/10 bg-black/50 text-white transition-colors hover:bg-white/10 cursor-pointer"
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
