import { motion, AnimatePresence, useScroll, useTransform, useMotionValue } from "motion/react";
import { ArrowRight, Sparkles, Play, X, TrendingUp, Zap, Target, Award, RotateCcw, Sliders, Download, Layers, Volume2, Check } from "lucide-react";
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

  // Color Grading States
  const [sat, setSat] = useState(125);
  const [contrast, setContrast] = useState(115);
  const [exposure, setExposure] = useState(105);
  const [tint, setTint] = useState(0);

  // Before vs After comparison slider position (percentage 0 - 100)
  const [sliderPos, setSliderPos] = useState(50);
  const splitContainerRef = useRef<HTMLDivElement>(null);

  // Timeline States
  const [playProgress, setPlayProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);

  // Live Waveform Heights (animated when video plays)
  const [audioHeights, setAudioHeights] = useState<number[]>(new Array(24).fill(12));

  // Export Simulator States
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportCompleted, setExportCompleted] = useState(false);

  // Video Refs
  const rawVideoRef = useRef<HTMLVideoElement>(null);
  const gradedVideoRef = useRef<HTMLVideoElement>(null);

  // Parallax Motion Values
  const xVal = useMotionValue(0);
  const yVal = useMotionValue(0);
  const rotateX = useTransform(yVal, [-350, 350], [8, -8]);
  const rotateY = useTransform(xVal, [-350, 350], [-8, 8]);

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

  // Sync dual videos
  useEffect(() => {
    const syncVideos = () => {
      if (rawVideoRef.current && gradedVideoRef.current) {
        if (Math.abs(rawVideoRef.current.currentTime - gradedVideoRef.current.currentTime) > 0.08) {
          gradedVideoRef.current.currentTime = rawVideoRef.current.currentTime;
        }
        // Match play states
        if (rawVideoRef.current.paused !== gradedVideoRef.current.paused) {
          if (rawVideoRef.current.paused) {
            gradedVideoRef.current.pause();
          } else {
            gradedVideoRef.current.play().catch(() => {});
          }
        }
      }
    };
    const interval = setInterval(syncVideos, 250);
    return () => clearInterval(interval);
  }, []);

  // Animate Waveform and sync playhead progress
  useEffect(() => {
    let frameId: number;
    const updateTimeTracking = () => {
      if (rawVideoRef.current) {
        const current = rawVideoRef.current.currentTime;
        const duration = rawVideoRef.current.duration || 1;
        setVideoCurrentTime(current);
        setPlayProgress((current / duration) * 100);

        // Waveform bounce mapping
        if (!rawVideoRef.current.paused) {
          setAudioHeights(prev =>
            prev.map(() => Math.floor(Math.random() * 26) + 4)
          );
        } else {
          setAudioHeights(prev => prev.map(h => Math.max(3, h - 1.5)));
        }
      }
      frameId = requestAnimationFrame(updateTimeTracking);
    };
    frameId = requestAnimationFrame(updateTimeTracking);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const handleTimeUpdate = () => {
    if (rawVideoRef.current) {
      setVideoCurrentTime(rawVideoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (rawVideoRef.current) {
      setVideoDuration(rawVideoRef.current.duration);
    }
  };

  // Compare split-screen slider calculations
  const handleSliderMove = (clientX: number) => {
    if (!splitContainerRef.current) return;
    const rect = splitContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  const handleMouseMoveSlider = (e: React.MouseEvent) => {
    // Only drag or hover based on split container boundaries
    if (e.buttons === 1 || e.type === "mousemove") {
      handleSliderMove(e.clientX);
    }
  };

  const handleTouchMoveSlider = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  // Parallax effects on workspace block
  const handleParallaxMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    xVal.set(mouseX);
    yVal.set(mouseY);
  };

  const handleParallaxLeave = () => {
    xVal.set(0);
    yVal.set(0);
  };

  // Export Simulator Trigger
  const handleExportSimulate = () => {
    if (isExporting) return;
    setIsExporting(true);
    setExportProgress(0);
    setExportCompleted(false);
  };

  useEffect(() => {
    if (isExporting) {
      const renderInterval = setInterval(() => {
        setExportProgress(prev => {
          if (prev >= 100) {
            clearInterval(renderInterval);
            setExportCompleted(true);
            setTimeout(() => {
              setIsExporting(false);
              setExportCompleted(false);
            }, 3000);
            return 100;
          }
          return prev + 5;
        });
      }, 100);
      return () => clearInterval(renderInterval);
    }
  }, [isExporting]);

  const resetGrading = () => {
    setSat(125);
    setContrast(115);
    setExposure(105);
    setTint(0);
  };

  // Format time display (0:00)
  const formatTime = (time: number) => {
    const sec = Math.floor(time % 60);
    const min = Math.floor(time / 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const gradedFilter = `saturate(${sat}%) contrast(${contrast}%) brightness(${exposure}%) hue-rotate(${tint}deg)`;

  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: scrollRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={scrollRef} id="top" className="relative min-h-[100svh] w-full overflow-hidden bg-[#050508] flex flex-col justify-between">
      
      {/* ── HIGH-END CINEMATIC AMBIENCE LAYER ── */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="hero-orb hero-orb-cyan opacity-40 mix-blend-screen scale-125 filter blur-[150px]" />
        <div className="hero-orb hero-orb-violet opacity-35 mix-blend-screen scale-125 filter blur-[150px]" />
        
        {/* Soft volumetric top/bottom vignette gradients */}
        <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-[#050508] via-[#050508]/80 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#050508] to-transparent" />
        
        {/* Moving light ray accentuation */}
        <div className="absolute top-[-10%] left-[20%] w-[35%] h-[60%] bg-gradient-to-br from-[#00D4FF]/8 to-transparent rotate-12 blur-[100px] animate-pulse" style={{ animationDuration: "10s" }} />
      </div>

      {/* ── AMBIENT HERO BACKGROUND VIDEO ── */}
      <video
        className="absolute inset-0 size-full object-cover opacity-12 mix-blend-luminosity select-none pointer-events-none"
        src={HERO_VIDEO}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />

      {/* Grid overlay for digital alignment */}
      <div className="hero-grid absolute inset-0 opacity-[0.04] pointer-events-none" />

      {/* ── MAIN HERO LAYOUT CONTAINER ── */}
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 pt-28 pb-10 sm:px-8 lg:px-12 flex-grow flex items-center">
        <div className="grid w-full grid-cols-1 gap-14 lg:grid-cols-[1.1fr_1.35fr] lg:gap-10 items-center">
          
          {/* ── LEFT SIDE: EDITORIAL & BRAND CONTENT ── */}
          <div className="text-center lg:text-left flex flex-col items-center lg:items-start justify-center">
            
            {/* Announcement badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-foreground/80 backdrop-blur-md"
            >
              <Sparkles className="size-3 text-[#00D4FF] animate-pulse" />
              <span>Premium Post-Production Studio</span>
              <span className="h-3 w-px bg-white/10" />
              <span className="text-[#00D4FF] font-semibold" style={{ textShadow: "0 0 10px rgba(0,212,255,0.4)" }}>Booking Q3</span>
            </motion.div>

            {/* Editorial Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
              className="font-display text-[46px] leading-[0.96] tracking-[-0.03em] sm:text-7xl lg:text-[76px] xl:text-[84px] text-white"
              dangerouslySetInnerHTML={{ __html: heroData.headline }}
            />

            {/* Supporting Copy */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mx-auto mt-7 max-w-lg text-sm leading-relaxed text-muted-foreground/90 sm:text-base lg:mx-0 font-sans tracking-wide"
            >
              {heroData.subheadline}
            </motion.p>

            {/* Primary conversion CTA */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-9 flex flex-col items-center sm:flex-row gap-4 sm:justify-center lg:justify-start w-full sm:w-auto"
            >
              <a
                href="#contact"
                className="group relative inline-flex w-full items-center justify-center gap-3.5 overflow-hidden rounded-full px-9 py-5 text-xs font-black uppercase tracking-widest text-white transition-all duration-350 hover:scale-[1.03] active:scale-[0.98] sm:w-auto shadow-2xl"
                style={{
                  background: "linear-gradient(135deg, #00D4FF 0%, #8B5CF6 100%)",
                  boxShadow: "0 10px 40px -10px rgba(0,212,255,0.4), 0 4px 20px -5px rgba(139,92,246,0.3)"
                }}
              >
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "linear-gradient(135deg, #00b8db 0%, #7c3aed 100%)" }} />
                <span className="relative flex items-center gap-2">
                  <span>Book A Strategy Call</span>
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </a>
            </motion.div>

            {/* Premium Client proof (Avatars) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-10 flex flex-col sm:flex-row items-center gap-3.5"
            >
              <div className="flex -space-x-2.5">
                {[
                  "bg-gradient-to-tr from-cyan-500 to-blue-600",
                  "bg-gradient-to-tr from-purple-500 to-indigo-600",
                  "bg-gradient-to-tr from-pink-500 to-rose-600",
                  "bg-gradient-to-tr from-amber-500 to-orange-600"
                ].map((grad, i) => (
                  <div
                    key={i}
                    className={`size-8 rounded-full border border-black/80 ${grad} flex items-center justify-center text-[7px] font-black text-white shadow-lg`}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white/90">Trusted by 50M+ Creator Audiences</div>
                <div className="text-[10px] text-muted-foreground/80 tracking-wide font-medium mt-0.5">Scale, retention, and production-native conversions.</div>
              </div>
            </motion.div>

          </div>

          {/* ── RIGHT SIDE: INTERACTIVE PORTFOLIO & WORKSPACE DASHBOARD ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onMouseMove={handleParallaxMove}
            onMouseLeave={handleParallaxLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000 }}
            className="w-full relative select-none"
          >
            {/* Ambient luxury backdrop glow */}
            <div
              className="absolute -inset-10 rounded-[44px] opacity-40 group-hover:opacity-60 transition-opacity duration-700 pointer-events-none"
              style={{
                background: "radial-gradient(circle at 50% 50%, rgba(0, 212, 255, 0.22), rgba(139, 92, 246, 0.16), transparent 70%)",
                filter: "blur(45px)",
              }}
            />

            {/* ── Main macOS Studio Dashboard Mockup ── */}
            <div
              className="relative overflow-hidden rounded-[26px] border border-white/10 bg-black/75 p-3.5 shadow-[0_50px_100px_-30px_rgba(0,0,0,0.95)] backdrop-blur-2xl"
              style={{ transform: "translateZ(10px)", transformStyle: "preserve-3d" }}
            >
              
              {/* Window Header Toolbar */}
              <div className="flex items-center justify-between pb-3.5 border-b border-white/6 mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="size-3 rounded-full bg-rose-500/80" />
                  <span className="size-3 rounded-full bg-amber-500/80" />
                  <span className="size-3 rounded-full bg-emerald-500/80" />
                  <span className="text-[10px] font-bold text-muted-foreground/60 tracking-wider ml-2 select-none uppercase">RAQVINE_STUDIO_V4.2</span>
                </div>
                
                {/* Status indicator */}
                <div className="flex items-center gap-1.5 rounded-full bg-white/[0.03] px-3 py-1 border border-white/5">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400">GPU ACCELERATED</span>
                </div>
              </div>

              {/* Grid split pane: Video player & Controls */}
              <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-3">
                
                {/* ── VIDEO SCREEN / COMPARISON SPLIT SLIDER ── */}
                <div
                  ref={splitContainerRef}
                  onMouseMove={handleMouseMoveSlider}
                  onTouchMove={handleTouchMoveSlider}
                  className="relative aspect-video rounded-xl overflow-hidden border border-white/8 bg-black cursor-ew-resize group"
                >
                  
                  {/* Graded/Edited Footage (Standard) */}
                  <video
                    ref={gradedVideoRef}
                    src={HERO_VIDEO}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 size-full object-cover pointer-events-none"
                    style={{ filter: gradedFilter }}
                  />

                  {/* RAW Footage (Clipped overlay) */}
                  <video
                    ref={rawVideoRef}
                    src={HERO_VIDEO}
                    autoPlay
                    muted
                    loop
                    playsInline
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    className="absolute inset-0 size-full object-cover pointer-events-none"
                    style={{
                      clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`,
                      filter: "grayscale(0.7) contrast(0.8) brightness(1.1)",
                      mixBlendMode: "normal"
                    }}
                  />

                  {/* Slider line separator */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-[#00D4FF] z-20 pointer-events-none shadow-[0_0_15px_rgba(0,212,255,0.8)]"
                    style={{ left: `${sliderPos}%` }}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-black/90 text-white border border-[#00D4FF]/50 rounded-full size-7 flex items-center justify-center shadow-lg text-[9px] font-black pointer-events-none">
                      ↔
                    </div>
                  </div>

                  {/* Visual labels overlay */}
                  <div className="absolute top-3 left-3 z-30 pointer-events-none rounded bg-black/60 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-white/70 border border-white/5">
                    RAW LOG
                  </div>
                  <div className="absolute top-3 right-3 z-30 pointer-events-none rounded bg-[#00D4FF]/20 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-[#00D4FF] border border-[#00D4FF]/25 backdrop-blur-sm">
                    GRADED
                  </div>

                  {/* Render Simulator Progress Bar Overlay */}
                  <AnimatePresence>
                    {isExporting && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-40 bg-black/85 flex flex-col items-center justify-center p-5 backdrop-blur-sm"
                      >
                        <div className="w-full max-w-[240px]">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground">
                              {exportCompleted ? "RENDER COMPLETE" : "COMPILING VIDEOS..."}
                            </span>
                            <span className="text-[10px] font-black text-white">{exportProgress}%</span>
                          </div>
                          
                          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
                            <motion.div
                              className="h-full bg-gradient-to-r from-[#00D4FF] to-[#8B5CF6]"
                              style={{ width: `${exportProgress}%` }}
                            />
                          </div>

                          <div className="mt-3 text-[8px] font-bold text-white/40 text-center tracking-wide">
                            {exportCompleted
                              ? "ProRes 422 HQ Exported Successfully"
                              : `Processing frames: ${Math.floor(exportProgress * 6)} / 600`}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>

                {/* ── COLOR GRADING & MASTER CONTROLS PANEL ── */}
                <div className="rounded-xl border border-white/6 bg-white/[0.02] p-3 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold tracking-widest text-white/90 flex items-center gap-1.5 uppercase">
                        <Sliders className="size-3.5 text-[#00D4FF]" /> COLOR GRADE
                      </span>
                      <button
                        onClick={resetGrading}
                        className="text-[9px] font-extrabold tracking-widest text-muted-foreground hover:text-white flex items-center gap-1 transition-colors uppercase"
                        title="Reset Grading Sliders"
                      >
                        <RotateCcw className="size-3" /> RESET
                      </button>
                    </div>

                    {/* Saturation */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[9px] font-bold uppercase text-muted-foreground tracking-wide">
                        <span>Saturation</span>
                        <span className="text-[#00D4FF]">{sat}%</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="200"
                        value={sat}
                        onChange={e => setSat(Number(e.target.value))}
                        className="w-full accent-[#00D4FF]"
                      />
                    </div>

                    {/* Contrast */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[9px] font-bold uppercase text-muted-foreground tracking-wide">
                        <span>Contrast</span>
                        <span className="text-[#00D4FF]">{contrast}%</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="180"
                        value={contrast}
                        onChange={e => setContrast(Number(e.target.value))}
                        className="w-full accent-[#00D4FF]"
                      />
                    </div>

                    {/* Exposure */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[9px] font-bold uppercase text-muted-foreground tracking-wide">
                        <span>Exposure</span>
                        <span className="text-[#00D4FF]">{exposure}%</span>
                      </div>
                      <input
                        type="range"
                        min="70"
                        max="150"
                        value={exposure}
                        onChange={e => setExposure(Number(e.target.value))}
                        className="w-full accent-[#00D4FF]"
                      />
                    </div>

                    {/* Tint (Hue) */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[9px] font-bold uppercase text-muted-foreground tracking-wide">
                        <span>Color Tint</span>
                        <span className="text-[#00D4FF]">{tint}°</span>
                      </div>
                      <input
                        type="range"
                        min="-90"
                        max="90"
                        value={tint}
                        onChange={e => setTint(Number(e.target.value))}
                        className="w-full accent-[#8B5CF6]"
                      />
                    </div>
                  </div>

                  {/* Render simulated button */}
                  <button
                    onClick={handleExportSimulate}
                    disabled={isExporting}
                    className="w-full mt-4 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#00D4FF]/12 to-[#8B5CF6]/12 border border-[#00D4FF]/25 hover:border-[#00D4FF]/45 text-white/90 hover:text-white py-2.5 text-[10px] font-black uppercase tracking-widest transition-all duration-300 disabled:opacity-50"
                  >
                    {isExporting ? (
                      <>
                        <span className="size-2.5 rounded-full border border-white/20 border-t-white animate-spin" />
                        <span>Rendering...</span>
                      </>
                    ) : (
                      <>
                        <Download className="size-3 text-[#00D4FF]" />
                        <span>Simulate Export</span>
                      </>
                    )}
                  </button>

                </div>

              </div>

              {/* ── TIMELINE TRACK PANEL & WAVEFORMS ── */}
              <div className="mt-4 rounded-xl border border-white/6 bg-white/[0.01] p-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                    <Layers className="size-3.5 text-[#8B5CF6]" /> SEQUENCER TIMELINE
                  </div>
                  
                  {/* Waveform / Play time sync */}
                  <div className="flex items-center gap-3">
                    {/* Live Waveform visual animation */}
                    <div className="flex items-end gap-[1.5px] h-4 select-none px-2 py-0.5 rounded bg-black/30 border border-white/5">
                      {audioHeights.map((h, i) => (
                        <span
                          key={i}
                          className="w-[1.5px] rounded-t bg-cyan-400"
                          style={{
                            height: `${h}px`,
                            opacity: 0.35 + (i % 3) * 0.2,
                            transition: "height 0.08s ease-out"
                          }}
                        />
                      ))}
                    </div>

                    <div className="text-[9px] font-black text-white/80 tracking-widest font-mono">
                      {formatTime(videoCurrentTime)} / {formatTime(videoDuration)}
                    </div>
                  </div>
                </div>

                {/* Tracks container block */}
                <div className="relative space-y-2 border-t border-white/6 pt-3 select-none">
                  
                  {/* Current playhead vertical marker line */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-[#00D4FF] z-20 pointer-events-none shadow-[0_0_8px_rgba(0,212,255,0.7)]"
                    style={{ left: `${playProgress}%` }}
                  >
                    <div className="absolute top-0 -translate-x-1/2 size-2 rounded-full bg-[#00D4FF]" />
                  </div>

                  {/* V1 Block */}
                  <div className="relative h-6 rounded bg-purple-500/10 border border-purple-500/20 flex items-center px-3 overflow-hidden text-[9px] font-bold text-purple-400">
                    <div className="absolute inset-y-0 left-0 bg-purple-500/20" style={{ width: `${playProgress}%` }} />
                    <span className="relative z-10">V1: Showreel_Color_Grade_A.mov</span>
                  </div>

                  {/* FX Block */}
                  <div className="relative h-6 rounded bg-amber-500/10 border border-amber-500/20 flex items-center px-3 overflow-hidden text-[9px] font-bold text-amber-400">
                    <div className="absolute inset-y-0 left-[20%] w-[35%] bg-amber-500/20" />
                    <span className="relative z-10 ml-[20%]">FX: Whip Pan Transition</span>
                  </div>

                  {/* A1 Block */}
                  <div className="relative h-6 rounded bg-cyan-500/10 border border-cyan-500/20 flex items-center px-3 overflow-hidden text-[9px] font-bold text-cyan-400">
                    <div className="absolute inset-y-0 left-0 bg-cyan-500/20" style={{ width: `${playProgress}%` }} />
                    <span className="relative z-10">A1: Cinematic Foley Mix (Stereo)</span>
                  </div>

                </div>

              </div>

            </div>

            {/* ── FLOATING ANALYTICS WIDGET CARD ── */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-8 -bottom-4 z-30 hidden sm:block rounded-xl border border-white/8 bg-black/90 px-4 py-3 shadow-2xl backdrop-blur-md text-left"
              style={{ willChange: "transform" }}
            >
              <div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">RENDER SPEED</div>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-xl font-black text-emerald-400">2.1s</span>
                <span className="text-[7px] text-[#00D4FF] font-bold uppercase tracking-wide">PRORES 422 HQ</span>
              </div>
            </motion.div>

          </motion.div>

        </div>
      </div>

      {/* ── BOTTOM MATRIX: 4 PREMIUM STATS CARDS & CLIENT LOGOS ── */}
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 pb-16 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 border-t border-white/6 pt-8">
          {[
            { val: "50M+", label: "Views Generated" },
            { val: "500+", label: "Projects Delivered" },
            { val: "100+", label: "Happy Clients" },
            { val: "98%", label: "Client Satisfaction" },
          ].map(({ val, label }) => (
            <div
              key={label}
              className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.01] p-5 backdrop-blur-md transition-all duration-300 hover:border-white/10 hover:bg-white/[0.03] text-center lg:text-left"
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
              <div className="mt-2 text-[9px] uppercase tracking-[0.2em] text-muted-foreground/70 font-extrabold">{label}</div>
            </div>
          ))}
        </div>

        {/* Client Logos Section */}
        <div className="mt-10 flex flex-col items-center justify-between gap-6 border-t border-white/5 pt-8 sm:flex-row">
          <span className="text-[9px] font-extrabold uppercase tracking-[0.25em] text-muted-foreground/50">
            Trusted by creators & global brands:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 opacity-35 text-[10px] font-black uppercase tracking-[0.24em] text-white">
            <span className="hover:opacity-100 hover:text-[#00D4FF] transition-all duration-300 cursor-default">NEXUS MEDIA</span>
            <span className="hover:opacity-100 hover:text-[#8B5CF6] transition-all duration-300 cursor-default">VORTEX CLIPS</span>
            <span className="hover:opacity-100 hover:text-[#00D4FF] transition-all duration-300 cursor-default">AURA LAB</span>
            <span className="hover:opacity-100 hover:text-[#8B5CF6] transition-all duration-300 cursor-default">APEX DIGITAL</span>
            <span className="hover:opacity-100 hover:text-[#00D4FF] transition-all duration-300 cursor-default">ECLIPSE HQ</span>
          </div>
        </div>
      </div>

      {/* ── IMMERSIVE SHOWREEL POPUP MODAL ── */}
      <AnimatePresence>
        {showreelOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
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
