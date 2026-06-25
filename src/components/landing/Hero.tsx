import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValue,
  useInView,
  useSpring,
} from "motion/react";
import {
  ArrowRight,
  Play,
  X,
  TrendingUp,
  Zap,
  Target,
  RotateCcw,
  Sliders,
  Download,
  Layers,
  Volume2,
  Eye,
  Briefcase,
  Users,
  Star,
  RotateCw,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { HERO_VIDEO } from "@/lib/portfolio-data";
import { supabase } from "@/lib/supabase";

// Video timeline thumbnails from assets
import p1 from "@/assets/portfolio/p1.jpg";
import p2 from "@/assets/portfolio/p2.jpg";
import p3 from "@/assets/portfolio/p3.jpg";
import p4 from "@/assets/portfolio/p4.jpg";
import p5 from "@/assets/portfolio/p5.jpg";
import carRacingImg from "@/assets/hero_car_racing.png";

const timelineThumbnails = [p1, p2, p3, p4, p5];

// Ease-out smooth animated counter for stats cards
function AnimatedCounter({ value }: { value: string }) {
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
      className="font-sans text-3xl lg:text-[40px] font-extrabold leading-none tracking-tight text-white"
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
  onClick,
  href,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  href?: string;
}) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
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

  if (href) {
    return (
      <motion.a
        ref={ref as any}
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

  return (
    <motion.button
      ref={ref as any}
      onClick={onClick}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={style}
    >
      {children}
    </motion.button>
  );
}

export function Hero() {
  const [showreelOpen, setShowreelOpen] = useState(false);
  const [heroData, setHeroData] = useState({
    headline:
      'High-End Video Editing<br/>That Scales Your<br/><span class="text-gradient-brand font-display italic font-normal">Views, Retention, &amp; Revenue.</span>',
    subheadline:
      "We transform raw footage into cinematic, high-retention content that grows your audience, strengthens your brand, and drives real business results.",
  });

  // Draggable comparison slider position (percentage 0 - 100)
  const [sliderPos, setSliderPos] = useState(50);
  const [isHovered, setIsHovered] = useState(false);
  const splitContainerRef = useRef<HTMLDivElement>(null);

  // Playback Control States
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [playProgress, setPlayProgress] = useState(40); // default around 00:06
  const [videoDuration, setVideoDuration] = useState(15);
  const [videoCurrentTime, setVideoCurrentTime] = useState(6);

  // Audio Waveform Heights
  const [audioHeights, setAudioHeights] = useState<number[]>(new Array(16).fill(6));

  // Export Progress State
  const [exportProgress, setExportProgress] = useState(87);
  const [isExporting, setIsExporting] = useState(true);
  const [exportCompleted, setExportCompleted] = useState(false);

  // Parallax Motion Values with premium smooth springs
  const xVal = useMotionValue(0);
  const yVal = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 120, mass: 0.5 };
  const xSpring = useSpring(xVal, springConfig);
  const ySpring = useSpring(yVal, springConfig);
  const rotateX = useTransform(ySpring, [-350, 350], [5, -5]);
  const rotateY = useTransform(xSpring, [-350, 350], [-5, 5]);

  // Subtle Mouse Glow Follower coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleGlobalMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  // Load headline data
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
          let formattedHeadline = data.headline;
          if (
            formattedHeadline.includes("That Scales Your ") &&
            !formattedHeadline.includes("That Scales Your<br/>")
          ) {
            formattedHeadline = formattedHeadline.replace(
              "That Scales Your ",
              "That Scales Your<br/>",
            );
          }
          setHeroData({ headline: formattedHeadline, subheadline: data.subheadline });
        }
      } catch (err) {
        console.error("Failed to load hero settings", err);
      }
    }
    loadHero();
  }, []);

  // Video Playback & Waveform loop (with a fallback simulation timer so it always moves, even if blocked by autoplay)
  useEffect(() => {
    let frameId: number;
    let lastTime = performance.now();

    const updateTimeTracking = (now: number) => {
      if (isPlaying) {
        const delta = (now - lastTime) / 1000;
        setVideoCurrentTime((prev) => {
          let next = prev + delta;
          if (next >= videoDuration) {
            next = 0;
          }
          return next;
        });
        setPlayProgress((videoCurrentTime / videoDuration) * 100);
        setAudioHeights((prev) => prev.map(() => Math.floor(Math.random() * 15) + 3));
      } else {
        setAudioHeights((prev) => prev.map((h) => Math.max(3, h - 1.5)));
      }
      lastTime = now;
      frameId = requestAnimationFrame(updateTimeTracking);
    };

    frameId = requestAnimationFrame(updateTimeTracking);
    return () => cancelAnimationFrame(frameId);
  }, [isPlaying, videoDuration, videoCurrentTime]);

  // Sweep-and-pause oscillation loop for comparison slider when user is not actively hovering
  useEffect(() => {
    if (isHovered) return;
    let start: number | null = null;
    let frameId: number;
    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const timeInCycle = progress % 6000;
      let currentPos = 50;
      if (timeInCycle < 1200) {
        currentPos = 25;
      } else if (timeInCycle < 3000) {
        const t = (timeInCycle - 1200) / 1800; // 0 to 1
        const ease = t * t * (3 - 2 * t); // smoothstep ease
        currentPos = 25 + ease * 50; // 25 to 75
      } else if (timeInCycle < 4200) {
        currentPos = 75;
      } else {
        const t = (timeInCycle - 4200) / 1800; // 0 to 1
        const ease = t * t * (3 - 2 * t); // smoothstep ease
        currentPos = 75 - ease * 50; // 75 to 25
      }
      setSliderPos(currentPos);
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [isHovered]);

  // Export simulator loop disabled to match progress spec (static 87%)

  const handleSliderMove = (clientX: number) => {
    if (!splitContainerRef.current) return;
    const rect = splitContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  const handleMouseMoveSlider = (e: React.MouseEvent) => {
    if (e.buttons === 1) handleSliderMove(e.clientX);
  };

  const handleTouchMoveSlider = (e: React.TouchEvent) => {
    if (e.touches[0]) handleSliderMove(e.touches[0].clientX);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReload = () => {
    setVideoCurrentTime(0);
  };

  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
    setPlayProgress(percentage);
    setVideoCurrentTime((percentage / 100) * videoDuration);
  };

  const formatTime = (time: number) => {
    const sec = Math.floor(time % 60);
    const min = Math.floor(time / 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const handleParallaxMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    xVal.set(e.clientX - rect.left - rect.width / 2);
    yVal.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleParallaxLeave = () => {
    xVal.set(0);
    yVal.set(0);
  };

  const gradedFilter = "saturate(130%) contrast(110%) brightness(102%) hue-rotate(-1deg)";
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={scrollRef}
      id="top"
      onMouseMove={handleGlobalMouseMove}
      className="relative min-h-screen w-full flex flex-col pt-[64px] pb-16 lg:pb-24"
      style={{ backgroundColor: "#050810" }}
    >
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
      <div className="relative z-10 mx-auto w-full max-w-[1320px] px-6 md:px-8 pt-4 lg:pt-6 pb-4 lg:pb-5 flex-grow flex flex-col justify-center">
        <div className="grid w-full grid-cols-1 lg:grid-cols-[44%_52%] items-center gap-x-[4%] gap-y-6">
          {/* ── LEFT SIDE: BRAND & COPY ── */}
          <div className="relative text-left flex flex-col items-start justify-start pt-0">
            {/* Top Badge */}
            <div className="relative inline-flex items-center gap-2 rounded-full p-[1px] mb-4 lg:mb-6 select-none bg-gradient-to-r from-[#22d3ee]/80 to-[#a855f7]/80 shadow-[0_4px_20px_rgba(34,211,238,0.15)]">
              <div className="flex items-center gap-2 rounded-full bg-[#050810]/95 px-[18px] py-[8px]">
                <span className="text-[#22d3ee] text-[13px] font-bold">✦</span>
                <span className="text-[13px] font-sans font-semibold uppercase tracking-wider text-[#a5f3fc]">
                  Premium Video Editing Studio
                </span>
              </div>
            </div>

            {/* Editorial Headline */}
            <div className="flex flex-col items-start">
              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, ease: [0.19, 1, 0.22, 1] }}
                className="font-serif text-[32px] sm:text-[38px] lg:text-[44px] leading-[1.12] tracking-[-0.01em] text-white font-medium text-left max-w-[620px]"
              >
                <span className="block sm:inline whitespace-normal sm:whitespace-nowrap">
                  High-End Video Editing
                </span>
                <br />
                <span className="block sm:inline whitespace-normal sm:whitespace-nowrap">
                  That Scales Your
                </span>
                <br />
                <span className="animate-gradient-text font-serif italic font-medium block sm:inline-block whitespace-normal sm:whitespace-nowrap">
                  Views, Retention, &amp; Revenue.
                </span>
              </motion.h1>

              {/* Accent bar */}
              <div className="h-[4px] w-[140px] bg-gradient-to-r from-[#22d3ee] to-[#a855f7] rounded-full mt-3 lg:mt-5" />
            </div>

            {/* Supporting Copy */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12 }}
              className="mt-4 lg:mt-6 max-w-[640px] text-[16px] sm:text-[18px] lg:text-[20px] leading-[1.7] text-[#a1a1aa] text-left font-sans tracking-normal mb-8 lg:mb-10"
            >
              {heroData.subheadline}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.22 }}
              className="flex flex-wrap gap-3.5 items-center justify-start z-20"
            >
              <MagneticButton
                href="#contact"
                className="group relative inline-flex items-center justify-center gap-2.5 rounded-full px-9 h-[54px] text-[14px] lg:text-[15px] font-bold uppercase tracking-wider text-white transition-all duration-300 active:scale-[0.98] cursor-pointer shadow-[0_0_20px_rgba(34,211,238,0.2),0_0_20px_rgba(168,85,247,0.15)]"
                style={{
                  background: "linear-gradient(135deg, #22d3ee 0%, #3b82f6 50%, #a855f7 100%)",
                }}
              >
                <span className="relative flex items-center gap-2.5">
                  <span>BOOK A STRATEGY CALL</span>
                  <ArrowRight className="size-4.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </MagneticButton>
            </motion.div>

            {/* Feature Mini-Cards */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.32 }}
              className="mt-8 lg:mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 w-full"
            >
              {[
                {
                  title: "High Retention",
                  subtitle: "Editing",
                  icon: TrendingUp,
                  color: "text-[#22d3ee]",
                },
                {
                  title: "Scroll-Stopping",
                  subtitle: "Visuals",
                  icon: Zap,
                  color: "text-[#fbbf24]",
                },
                {
                  title: "Platform-Native",
                  subtitle: "Optimization",
                  icon: Target,
                  color: "text-[#10b981]",
                },
                {
                  title: "Revenue-Driven",
                  subtitle: "Storytelling",
                  icon: Star,
                  color: "text-[#a855f7]",
                },
              ].map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={index}
                    className="group/card relative flex flex-col items-start rounded-[14px] border border-white/[0.08] bg-white/[0.03] p-5 lg:p-6 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05] hover:-translate-y-0.5 select-none w-full"
                  >
                    <IconComponent className={`size-[22px] lg:size-[26px] ${item.color} mb-3`} />
                    <span className="text-[14px] lg:text-[15px] font-bold text-white tracking-tight leading-tight">
                      {item.title}
                    </span>
                    <span className="text-[11px] lg:text-[12px] text-[#a1a1aa] leading-tight mt-1">
                      {item.subtitle}
                    </span>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* ── RIGHT SIDE: INTERACTIVE PORTFOLIO & WORKSPACE DASHBOARD ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.85, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            onMouseMove={handleParallaxMove}
            onMouseLeave={handleParallaxLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000 }}
            className="w-full relative flex flex-col group/dashboard"
          >
            {/* Premium Glow effect behind dashboard */}
            <div className="absolute -inset-8 bg-gradient-to-tr from-[#22d3ee]/20 via-[#a855f7]/15 to-[#3b82f6]/20 blur-3xl rounded-full opacity-60 transition-opacity duration-700 group-hover/dashboard:opacity-80 -z-10" />

            {/* ── Main macOS Studio Dashboard Mockup ── */}
            <div
              className="relative overflow-hidden rounded-[12px] border border-white/10 bg-[#07070b]/98 shadow-[0_0_40px_rgba(34,211,238,0.15),0_30px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl"
              style={{
                transform: "translateZ(10px)",
                transformStyle: "preserve-3d",
                backgroundImage:
                  "linear-gradient(to bottom, rgba(255,255,255,0.02) 0%, transparent 100%)",
              }}
            >
              {/* Window Header Toolbar (36px tall) */}
              <div className="flex items-center justify-between px-5 h-[36px] border-b border-white/[0.08] select-none">
                <div className="flex items-center gap-2">
                  <span className="size-[10px] rounded-full bg-[#ff5f56]" />
                  <span className="size-[10px] rounded-full bg-[#ffbd2e]" />
                  <span className="size-[10px] rounded-full bg-[#27c93f]" />
                  <span className="text-[13px] font-medium text-[#a1a1aa] tracking-wide ml-4 uppercase font-sans">
                    RAQVINE_STUDIO_V4.2
                  </span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-0.5 border border-emerald-500/10">
                  <span className="size-1.5 rounded-full bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
                  <span className="text-[11px] font-semibold tracking-wider text-[#10b981]">
                    GPU ACCELERATED
                  </span>
                </div>
              </div>

              {/* ── VERTICAL STACK OF THREE PANELS ── */}
              <div className="flex flex-col gap-2 p-2.5 select-none">
                {/* ── PANEL 1: VIDEO SCREEN / COMPARISON SPLIT SLIDER ── */}
                <div className="flex flex-col rounded-[12px] overflow-hidden border border-white/[0.05] bg-[#040406]/60">
                  <div
                    ref={splitContainerRef}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onTouchStart={() => setIsHovered(true)}
                    onMouseMove={handleMouseMoveSlider}
                    onTouchMove={handleTouchMoveSlider}
                    className="relative w-full aspect-[16/9] max-h-[320px] overflow-hidden cursor-ew-resize rounded-t-[10px]"
                  >
                    {/* Soft screen glass reflection overlay */}
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/[0.015] to-transparent z-25" />

                    {/* FULL FRAME IMAGES */}
                    <img
                      src={carRacingImg}
                      className="absolute inset-0 size-full object-cover pointer-events-none select-none transition-opacity duration-500"
                      style={{ filter: gradedFilter, opacity: 1 }}
                      alt="Cinematic Graded"
                    />
                    <img
                      src={carRacingImg}
                      className="absolute inset-0 size-full object-cover pointer-events-none select-none transition-opacity duration-500"
                      style={{
                        clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`,
                        filter: "grayscale(0.65) contrast(0.85) brightness(1.1) saturate(75%)",
                        opacity: 1,
                      }}
                      alt="Raw ungraded"
                    />

                    {/* Slider divider line */}
                    <div
                      className="absolute top-0 bottom-0 w-[1.5px] bg-[#22d3ee] z-20 pointer-events-none"
                      style={{
                        left: `${sliderPos}%`,
                        boxShadow: "0 0 10px rgba(34,211,238,0.8)",
                      }}
                    >
                      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-[#08080c]/90 border border-white/10 rounded-full size-6 flex items-center justify-center text-[7px] text-white shadow-lg pointer-events-none select-none">
                        ↔
                      </div>
                    </div>

                    {/* Before / After labels */}
                    <div className="absolute top-3.5 left-3.5 z-30 pointer-events-none rounded-full bg-[#050508]/60 border border-white/5 px-2.5 py-0.5 text-[8px] font-semibold uppercase tracking-[0.15em] text-[#a1a1aa] select-none">
                      BEFORE
                    </div>
                    <div className="absolute top-3.5 right-3.5 z-30 pointer-events-none rounded-full bg-[#22d3ee]/10 border border-[#22d3ee]/25 px-2.5 py-0.5 text-[8px] font-semibold uppercase tracking-[0.15em] text-[#22d3ee] select-none">
                      AFTER
                    </div>
                  </div>

                  {/* Video play controls bar (36px tall) */}
                  <div className="flex items-center justify-between px-4 h-[36px] bg-[#07070b] border-t border-white/[0.08] select-none text-[12px] text-[#a1a1aa]/90">
                    {/* Left Controls */}
                    <div className="flex items-center gap-4">
                      <button
                        onClick={togglePlay}
                        className="hover:text-white transition-colors cursor-pointer text-[#22d3ee]"
                        title={isPlaying ? "Pause" : "Play"}
                      >
                        {isPlaying ? (
                          <svg className="size-[14px]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                          </svg>
                        ) : (
                          <Play className="size-[14px] fill-[#22d3ee]/25 animate-pulse" />
                        )}
                      </button>
                      <button
                        onClick={handleReload}
                        className="hover:text-white transition-colors cursor-pointer"
                        title="Step Back"
                      >
                        <svg className="size-[14px] fill-current" viewBox="0 0 24 24">
                          <path d="M6 6h2v12H6zm3 6 8.5 6V6z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => {}}
                        className="hover:text-white transition-colors cursor-pointer"
                        title="Step Forward"
                      >
                        <svg className="size-[14px] fill-current" viewBox="0 0 24 24">
                          <path d="M6 6v12l8.5-6zm9 0h2v12h-2z" />
                        </svg>
                      </button>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setIsMuted((prev) => !prev)}
                          className="hover:text-white transition-colors cursor-pointer"
                          title={isMuted ? "Unmute" : "Mute"}
                        >
                          <Volume2 className={`size-[14px] ${!isMuted ? "text-[#22d3ee]" : ""}`} />
                        </button>
                        {/* Audio Volume Bar representation */}
                        <div className="flex items-end gap-[1.5px] h-2">
                          {[4, 6, 8, 5].map((h, i) => (
                            <span
                              key={i}
                              className="w-[1.5px] bg-[#22d3ee]/60 rounded-t"
                              style={{ height: `${h}px` }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Middle: Time display */}
                    <div className="font-mono text-[12px] text-[#a1a1aa]/80 tracking-wider">
                      {formatTime(videoCurrentTime)} / {formatTime(videoDuration)}
                    </div>

                    {/* Right Controls */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-0.5 rounded text-[11px] font-bold text-[#a1a1aa]">
                        <span>16:9</span>
                        <span className="text-[8px] font-sans">▼</span>
                      </div>
                      <button className="hover:text-white transition-colors cursor-pointer">
                        <svg
                          className="size-[14px]"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75v4.5m0-4.5h-4.5m4.5 0L15 9m5.25 11.25v-4.5m0 4.5h-4.5m4.5 0L15 15"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* ── PANEL 2: TIMELINE (16px gap mt-4) ── */}
                <div className="rounded-[12px] border border-white/10 bg-[#07070b]/60 p-[12px] flex flex-col mt-4">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[12px] font-bold text-white/50 uppercase tracking-wider font-sans">
                      Timeline
                    </div>
                    {/* Zoom control */}
                    <div className="flex items-center gap-2 bg-white/[0.01] border border-white/[0.05] px-2.5 py-0.5 rounded-full select-none text-white/30 text-[10px]">
                      <svg
                        className="size-3 text-[#a1a1aa]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <div className="w-12 h-[2px] bg-white/10 relative rounded-full">
                        <div
                          className="absolute top-1/2 -translate-y-1/2 left-[60%] size-1.5 rounded-full bg-[#22d3ee]"
                          style={{ boxShadow: "0 0 6px #22d3ee" }}
                        />
                      </div>
                      <span className="font-bold text-[10px] text-white/50">+</span>
                    </div>
                  </div>

                  {/* Ruler & Tracks */}
                  <div className="relative">
                    {/* Time ruler */}
                    <div
                      onClick={handleScrub}
                      className="relative h-4 border-t border-white/[0.06] cursor-pointer select-none font-mono text-[10px] text-[#a1a1aa]/50 flex justify-between px-1 items-end pb-1"
                    >
                      {[
                        "00:00",
                        "00:02",
                        "00:04",
                        "00:06",
                        "00:08",
                        "00:10",
                        "00:12",
                        "00:14",
                        "00:16",
                      ].map((t) => (
                        <span key={t}>{t}</span>
                      ))}

                      {/* Playhead */}
                      <div
                        className="absolute top-0 bottom-[-92px] w-[1.5px] z-20 pointer-events-none"
                        style={{
                          left: `${playProgress}%`,
                          background: "#22d3ee",
                          boxShadow: "0 0 6px rgba(34,211,238,0.8)",
                        }}
                      >
                        <div className="absolute top-0 -translate-x-1/2 -mt-1.5 bg-[#22d3ee] text-black text-[6.5px] font-black px-1 py-0.5 rounded-sm flex items-center justify-center shadow-lg pointer-events-none">
                          {formatTime(videoCurrentTime)}
                        </div>
                      </div>
                    </div>

                    {/* Sequencer Track Rows (6px gaps space-y-[6px]) */}
                    <div className="space-y-[6px] relative z-10 select-none mt-1.5 text-[11px] font-bold">
                      {/* Track 1: Video clips (24px height) */}
                      <div className="flex items-center gap-2.5 h-[24px]">
                        <div className="shrink-0 w-[84px] text-[10px] text-[#a1a1aa]/50 uppercase tracking-wider font-sans font-bold">
                          Video Clips
                        </div>
                        <div className="relative flex-1 h-full flex gap-0.5 rounded bg-black/40 border border-white/[0.04] p-0.5 items-stretch overflow-hidden">
                          {timelineThumbnails.map((thumb, i) => (
                            <div key={i} className="flex-1 rounded-[2px] overflow-hidden relative">
                              <img
                                src={thumb}
                                className="size-full object-cover opacity-50"
                                alt=""
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Track 2: Audio waveform (24px height) */}
                      <div className="flex items-center gap-2.5 h-[24px]">
                        <div className="shrink-0 w-[84px] text-[10px] text-[#a1a1aa]/50 uppercase tracking-wider font-sans font-bold">
                          Audio Waveform
                        </div>
                        <div className="relative flex-1 h-full rounded bg-[#0d9488]/5 border border-[#0d9488]/10 overflow-hidden">
                          <svg
                            className="absolute inset-0 size-full pointer-events-none"
                            preserveAspectRatio="none"
                            viewBox="0 0 200 20"
                          >
                            <defs>
                              <linearGradient id="waveform-grad" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#0d9488" stopOpacity={0.15} />
                                <stop
                                  offset={`${playProgress}%`}
                                  stopColor="#10b981"
                                  stopOpacity={0.8}
                                />
                                <stop offset="100%" stopColor="#0d9488" stopOpacity={0.15} />
                              </linearGradient>
                            </defs>
                            <path
                              d="M0,10 C10,5 15,15 20,8 C25,2 30,18 35,10 C40,4 45,16 50,10 C55,4 60,16 65,10 C70,2 75,18 80,10 C85,5 90,15 95,8 C100,2 105,18 110,10 C115,4 120,16 125,10 C130,4 135,16 140,10 C145,2 150,18 155,10 C160,5 165,15 170,8 C175,2 180,18 185,10 C190,4 195,16 200,10 L200,20 L0,20 Z"
                              fill="url(#waveform-grad)"
                            />
                            <path
                              d="M0,10 C10,5 15,15 20,8 C25,2 30,18 35,10 C40,4 45,16 50,10 C55,4 60,16 65,10 C70,2 75,18 80,10 C85,5 90,15 95,8 C100,2 105,18 110,10 C115,4 120,16 125,10 C130,4 135,16 140,10 C145,2 150,18 155,10 C160,5 165,15 170,8 C175,2 180,18 185,10 C190,4 195,16 200,10"
                              stroke="#0d9488"
                              strokeOpacity={0.8}
                              strokeWidth="1"
                              fill="none"
                            />
                          </svg>
                        </div>
                      </div>

                      {/* Track 3: Motion Graphics (24px height) */}
                      <div className="flex items-center gap-2.5 h-[24px]">
                        <div className="shrink-0 w-[84px] text-[10px] text-[#a1a1aa]/50 uppercase tracking-wider font-sans font-bold">
                          Motion Graphics
                        </div>
                        <div className="relative flex-1 h-full rounded bg-purple-950/10 border border-purple-500/10 overflow-hidden flex items-center px-4 gap-2">
                          <div className="h-2.5 rounded bg-[#a855f7]/20 border border-[#a855f7]/40 w-1/3 flex items-center justify-around px-1 relative">
                            {/* Dot markers */}
                            <span className="size-1.5 rounded-full bg-[#a855f7] shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
                            <span className="size-1.5 rounded-full bg-[#a855f7] shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
                          </div>
                          <div className="h-2.5 rounded bg-[#a855f7]/20 border border-[#a855f7]/40 w-1/2 flex items-center justify-around px-1 relative">
                            <span className="size-1.5 rounded-full bg-[#a855f7] shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
                            <span className="size-1.5 rounded-full bg-[#a855f7] shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
                            <span className="size-1.5 rounded-full bg-[#a855f7] shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── PANEL 3: EXPORT QUEUE (12px gap mt-3) ── */}
                <div className="rounded-[12px] border border-white/10 bg-[#07070b]/60 p-[12px] flex items-center justify-between gap-4 mt-3">
                  {/* Left Column: Progress Bar */}
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 text-[12px] font-bold text-white/50 uppercase tracking-wider font-sans">
                      <span>↑</span> Export Queue
                    </div>
                    <div className="flex flex-col gap-1 bg-black/40 border border-white/[0.03] p-2.5 rounded-lg">
                      <div className="flex items-center justify-between text-[13px] font-bold">
                        <span className="text-white/70">Final Edit – 4K Ultra HD</span>
                        <span className="text-[#22d3ee] font-mono">87%</span>
                      </div>
                      {/* Linear progress bar */}
                      <div className="w-full h-[5px] rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#22d3ee] to-[#a855f7]"
                          style={{ width: "87%" }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Status Card */}
                  <div className="w-[110px] p-2 flex flex-col items-center justify-center rounded-[8px] border border-white/10 bg-white/[0.01]">
                    <span className="text-[18px] font-extrabold text-[#22d3ee] leading-none">
                      4K
                    </span>
                    <span className="text-[10px] font-bold text-[#a1a1aa]/60 tracking-wider mt-1">
                      EXPORTING...
                    </span>
                    <span className="text-[10px] text-[#a1a1aa]/60 font-semibold mt-0.5">
                      Estimated: 00:18
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── BOTTOM STATS ROW & LOGOS (32px gap mt-8) ── */}
        <div className="w-full mt-2 lg:mt-4 flex flex-col gap-4 relative z-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 border-t border-white/[0.08] pt-4 lg:pt-6">
            {[
              {
                val: "50M+",
                label: "Views Generated",
                color: "#22d3ee",
                borderStyle: "border-[#22d3ee]/30 text-[#22d3ee]",
                icon: Eye,
              },
              {
                val: "500+",
                label: "Projects Delivered",
                color: "#fbbf24",
                borderStyle: "border-[#fbbf24]/30 text-[#fbbf24]",
                icon: Briefcase,
              },
              {
                val: "100+",
                label: "Happy Clients",
                color: "#a855f7",
                borderStyle: "border-[#a855f7]/30 text-[#a855f7]",
                icon: Users,
              },
              {
                val: "98%",
                label: "Client Satisfaction",
                color: "#a855f7",
                borderStyle: "border-[#a855f7]/30 text-[#a855f7]",
                icon: Star,
              },
            ].map(({ val, label, color, borderStyle, icon: Icon }) => (
              <div
                key={label}
                className="group relative flex flex-row items-center gap-3 lg:gap-4 rounded-[12px] border border-white/[0.08] bg-white/[0.03] p-4 lg:p-5 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05] hover:-translate-y-1 hover:shadow-lg overflow-hidden cursor-pointer w-full"
                style={{ backdropFilter: "blur(20px)" }}
              >
                {/* Glass sheen reflection overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.015] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

                {/* Icon circle (40px) */}
                <div
                  className={`relative shrink-0 size-10 rounded-full border-2 ${borderStyle} flex items-center justify-center bg-[#050810]/40 transition-colors`}
                >
                  <Icon
                    className="size-5 transition-transform duration-500 group-hover:scale-110"
                    strokeWidth={2}
                  />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-sans text-[28px] lg:text-[32px] font-extrabold leading-none tracking-tight text-white">
                    {val}
                  </span>
                  <span className="text-[11px] lg:text-[12px] text-[#a1a1aa] font-bold uppercase tracking-wider mt-1.5 leading-tight font-sans">
                    {label}
                  </span>
                </div>
              </div>
            ))}
          </div>
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
