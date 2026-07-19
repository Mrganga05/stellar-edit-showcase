import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useInView, animate } from "motion/react";
import { cn } from "@/lib/utils";
import {
  Zap,
  TrendingUp,
  Rocket,
  Instagram,
  Youtube,
  Sparkles,
  Scissors,
  Box,
  ArrowUpRight,
} from "lucide-react";
import editorProfile from "@/assets/editor-profile.jpg";
import a1 from "@/assets/avatars/a1.jpg";
import a2 from "@/assets/avatars/a2.jpg";
import a3 from "@/assets/avatars/a3.jpg";
import a4 from "@/assets/avatars/a4.jpg";
import a5 from "@/assets/avatars/a5.jpg";

// Reusable Count-Up Counter
const Counter = ({
  to,
  duration = 2,
  suffix = "",
  decimals = 0,
}: {
  to: number;
  duration?: number;
  suffix?: string;
  decimals?: number;
}) => {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(nodeRef, { once: true, margin: "0px" });

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

// SVG Sparkline / Mini Wave Visualizer
const Sparkline = ({ color = "#38BDF8" }) => {
  return (
    <svg
      className="w-12 h-5 sm:w-16 sm:h-6 mt-1 sm:mt-1.5 opacity-60 transition-opacity duration-300 hover:opacity-100"
      viewBox="0 0 60 20"
      fill="none"
    >
      <motion.path
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        d="M0,15 Q10,3 20,13 T40,6 T60,11"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

// Staggered Title words (3 lines exactly, compact size)
const StaggeredTitle = () => {
  const containerVars = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const wordVars = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.215, 0.61, 0.355, 1], // easeOutCubic
      },
    },
  };

  return (
    <motion.h2
      variants={containerVars}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1, margin: "-20px" }}
      className="text-section-heading text-lg min-[375px]:text-xl sm:text-2xl lg:text-section-heading mt-4 mb-5 flex flex-col items-center lg:items-start select-none max-lg:leading-[1.35]"
    >
      <span className="block py-1 relative">
        <motion.span
          variants={wordVars}
          className="inline-block mr-[0.2em] font-bold bg-gradient-to-b from-white via-white to-[#A3A3C2] bg-clip-text text-transparent"
        >
          Meet
        </motion.span>
        <motion.span
          variants={wordVars}
          className="inline-block mr-[0.2em] font-bold bg-gradient-to-b from-white via-white to-[#A3A3C2] bg-clip-text text-transparent"
        >
          The
        </motion.span>
        <motion.span
          variants={wordVars}
          className="inline-block mr-[0.05em] pr-[0.15em] font-bold italic bg-gradient-to-r from-[#3B82F6] to-[#38BDF8] bg-clip-text text-transparent filter drop-shadow-[0_2px_15px_rgba(59,130,246,0.3)] hover:scale-105 transition-transform duration-350"
        >
          Editor
        </motion.span>
      </span>

      <span className="block py-1 relative">
        <motion.span
          variants={wordVars}
          className="inline-block mr-[0.2em] font-bold bg-gradient-to-b from-white via-white to-[#A3A3C2] bg-clip-text text-transparent"
        >
          Behind
        </motion.span>
        <motion.span
          variants={wordVars}
          className="inline-block mr-[0.1em] pr-[0.15em] font-bold italic bg-gradient-to-r from-[#3B82F6] to-[#38BDF8] bg-clip-text text-transparent filter drop-shadow-[0_2px_20px_rgba(59,130,246,0.3)] relative group cursor-default"
        >
          Viral
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            className="absolute -top-2 -right-3 text-[12px] text-[#38BDF8] opacity-80 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300 pointer-events-none filter drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]"
          >
            ✦
          </motion.span>
        </motion.span>
      </span>

      <span className="block py-1 relative">
        <motion.span
          variants={wordVars}
          className="inline-block mr-[0.2em] font-bold bg-gradient-to-b from-white via-white to-[#A3A3C2] bg-clip-text text-transparent"
        >
          Content
        </motion.span>
        <motion.span
          variants={wordVars}
          className="inline-block mr-[0.2em] font-bold bg-gradient-to-b from-white via-white to-[#A3A3C2] bg-clip-text text-transparent"
        >
          That
        </motion.span>
        <motion.span
          variants={wordVars}
          className="inline-block mr-[0.05em] pr-[0.15em] font-bold italic bg-gradient-to-r from-[#38BDF8] via-[#3B82F6] to-[#3B82F6] bg-clip-text text-transparent filter drop-shadow-[0_2px_20px_rgba(59,130,246,0.35)]"
        >
          Converts.
        </motion.span>
      </span>
    </motion.h2>
  );
};

// Premium Compact Feature Card
interface FeatureCardProps {
  title: string;
  desc: string;
  icon: React.ReactNode;
  delay?: number;
}

const FeatureCard = ({ title, desc, icon, delay = 0 }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.1, margin: "-15px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }}
      whileTap={{ scale: 0.97 }}
      className="group relative overflow-hidden rounded-[18px] border border-white/[0.08] bg-[#0c1224]/80 p-4 sm:p-5 lg:p-6 flex flex-col gap-3 lg:h-[150px] transition-all duration-[450ms] ease-out hover:border-[#38BDF8]/40 hover:-translate-y-1.5 hover:shadow-[0_10px_25px_rgba(56,189,248,0.06)]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#38BDF8]/0 to-[#38BDF8]/[0.03] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Icon + Title row */}
      <div className="flex items-center gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/[0.03] border border-white/10 text-[#9CA3AF] transition-all duration-500 group-hover:scale-110 group-hover:text-[#38BDF8] group-hover:border-[#38BDF8]/30">
          <div className="scale-[0.8]">{icon}</div>
        </div>
        <h4 className="text-xs sm:text-sm lg:text-small-heading font-semibold text-white group-hover:text-[#38BDF8] transition-colors duration-300 leading-tight">
          {title}
        </h4>
      </div>
      <p className="text-[10px] sm:text-xs lg:text-small-body text-neutral-400 leading-relaxed">
        {desc}
      </p>
    </motion.div>
  );
};

// Floating Badge Component (Stable, no floating animation)
const FloatingBadge = ({
  text,
  icon,
  className,
}: {
  text: string;
  icon?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "rounded-full border border-white/[0.08] bg-[#0B1224]/90 px-3 py-1.5 text-xs font-semibold text-white/80 shadow-md cursor-default hover:border-[#38BDF8]/20 hover:text-white transition-all duration-300 flex items-center gap-1.5 whitespace-nowrap",
        className,
      )}
    >
      {icon}
      {text}
    </div>
  );
};

// Background Particle Dot
const Particle = ({ delay = 0, x = 0, y = 0 }: { delay?: number; x?: number; y?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0.1, y: 0 }}
      animate={{
        opacity: [0.1, 0.4, 0.1],
        y: [0, -30, 0],
        x: [0, 15, 0],
      }}
      transition={{
        duration: 8 + Math.random() * 4,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay,
      }}
      className="absolute size-1 rounded-full bg-[#38BDF8] pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%` }}
    />
  );
};

export function About() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Parallax Springs
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springMouseX = useSpring(mouseX, { stiffness: 80, damping: 25 });
  const springMouseY = useSpring(mouseY, { stiffness: 80, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(relX * 45); // Shifts elements up to 45px
    mouseY.set(relY * 45);
  };

  const timelineEvents = [
    { year: "2020", text: "Started editing." },
    { year: "2022", text: "Worked with creators." },
    { year: "2024", text: "Built premium studio." },
    { year: "Today", text: "Helping brands scale through high-performing content." },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative w-full overflow-hidden bg-transparent py-24 md:py-32 flex items-center justify-center max-lg:pt-12 max-lg:pb-16"
    >
      {/* Background floating particles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <Particle x={8} y={15} delay={0} />
        <Particle x={85} y={18} delay={1.5} />
        <Particle x={42} y={52} delay={2.8} />
        <Particle x={20} y={72} delay={0.8} />
        <Particle x={80} y={85} delay={2} />
        <Particle x={62} y={32} delay={1.2} />
      </div>

      <div className="relative mx-auto w-full max-w-[1320px] px-6 md:px-8 max-lg:px-5 grid grid-cols-12 gap-8 lg:gap-[48px] items-stretch h-full z-20 max-lg:flex max-lg:flex-col max-lg:gap-0">
        {/* LEFT COLUMN (7 columns of 12) */}
        <div className="col-span-12 lg:col-span-7 flex flex-col justify-between h-full space-y-10 lg:space-y-0 text-center lg:text-left items-center lg:items-start max-lg:contents">
          {/* Top Badge & Heading group */}
          <div className="flex flex-col max-lg:order-1 max-lg:w-full max-lg:items-center max-lg:mb-6">
            {/* About Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="h-[42px] rounded-full border border-white/[0.08] bg-[#0B1224]/90 px-[18px] flex items-center gap-2 self-center lg:self-start hover:border-[#38BDF8]/30 hover:shadow-[0_0_15px_rgba(56,189,248,0.15)] transition-all duration-300 cursor-default"
            >
              <span className="size-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
              <span className="text-badge-text text-white/80">ABOUT THE EDITOR</span>
            </motion.div>

            {/* Title */}
            <StaggeredTitle />
          </div>

          {/* 3 Premium Feature Cards — single col on mobile, 3-col on sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5 w-full max-lg:order-5 max-lg:w-full max-lg:max-w-[420px] max-lg:mx-auto max-lg:mt-7">
            <FeatureCard
              title="Hook First"
              desc="Every edit is engineered to capture attention within the first three seconds."
              icon={<Zap className="size-4" />}
              delay={0.1}
            />
            <FeatureCard
              title="Retention Focus"
              desc="Pacing, storytelling and motion designed for maximum watch time."
              icon={<TrendingUp className="size-4" />}
              delay={0.2}
            />
            <FeatureCard
              title="Business Results"
              desc="Transforming content into followers, customers and revenue."
              icon={<Rocket className="size-4" />}
              delay={0.3}
            />
          </div>

          {/* Timeline & CTA Block Side-by-Side (bottom group) */}
          <div className="flex flex-col sm:flex-row gap-6 items-stretch max-lg:order-6 max-lg:flex-col max-lg:gap-0 max-lg:w-full max-lg:max-w-[360px] max-lg:mx-auto">
            {/* Timeline (40% width on desktop) */}
            <div className="w-full sm:w-[40%] flex flex-col justify-center space-y-3 sm:space-y-4 overflow-hidden max-lg:w-full max-lg:mt-8">
              <h5 className="text-[10px] sm:text-badge-text text-[#9CA3AF] tracking-wider font-bold">
                THE JOURNEY
              </h5>

              <div className="relative pl-2">
                {/* Vertical Indicator Line */}
                <div className="absolute left-[7px] top-2 bottom-2 w-[1.5px] bg-white/5">
                  <motion.div
                    initial={{ height: 0 }}
                    whileInView={{ height: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="w-full bg-gradient-to-b from-[#38BDF8] to-[#3B82F6]"
                  />
                </div>

                {/* Nodes */}
                <div className="space-y-3 sm:space-y-4 max-lg:space-y-[32px]">
                  {timelineEvents.map((event, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.15 }}
                      className="relative pl-7 min-h-[32px] flex flex-col justify-center"
                    >
                      {/* Circle node dot */}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 size-3.5 rounded-full bg-[#050816] border-[1.5px] border-[#38BDF8] flex items-center justify-center shadow-[0_0_6px_rgba(56,189,248,0.3)]">
                        <div className="size-1 rounded-full bg-[#38BDF8]" />
                      </div>
                      <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
                        <span className="font-bold text-[#38BDF8] tracking-wider text-[9px] min-[375px]:text-xs shrink-0">
                          {event.year}
                        </span>
                        <span className="text-[10px] min-[375px]:text-xs lg:text-small-body text-neutral-400 break-words">
                          {event.text}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA Card (60% width on desktop) */}
            <div className="w-full sm:w-[60%] rounded-[24px] border border-white/[0.08] bg-[#0c1224]/90 p-4.5 sm:p-6 xl:p-8 flex flex-col justify-between space-y-4 sm:space-y-5 max-lg:w-full max-lg:mt-10 max-lg:rounded-[20px] max-lg:p-5">
              <div className="space-y-1 sm:space-y-2">
                <span className="text-[9px] sm:text-badge-text text-[#38BDF8] font-bold">
                  READY TO COLLABORATE?
                </span>
                <h4 className="text-xs min-[375px]:text-sm sm:text-card-title text-[#F9FAFB] leading-tight font-bold">
                  Ready To Create Your Next Viral Video?
                </h4>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="#contact"
                  className="group relative inline-flex items-center justify-center gap-2 rounded-full btn-primary-glow px-5 h-[40px] sm:h-[48px] text-[11px] sm:text-button-text text-white cursor-pointer transition-transform hover:scale-[1.02] flex items-center justify-center w-full sm:w-auto max-lg:h-[56px] max-lg:rounded-[999px] max-lg:text-sm max-lg:font-semibold max-lg:shadow-[0_0_20px_rgba(56,189,248,0.2)]"
                >
                  Book Strategy Call
                  <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>

              {/* Avatar Group Trust Badge */}
              <div className="flex items-center gap-2.5 pt-2 border-t border-white/[0.05]">
                <div className="flex items-center -space-x-1.5 shrink-0">
                  {[a1, a2, a3, a4, a5].map((avatar, idx) => (
                    <img
                      key={idx}
                      src={avatar}
                      alt="Creator avatar"
                      className="size-5.5 sm:size-6.5 rounded-full border border-[#050816] object-cover max-lg:size-5"
                    />
                  ))}
                </div>
                <span className="text-[9px] min-[375px]:text-[10px] sm:text-[11px] text-[#9CA3AF] font-medium leading-none">
                  Trusted by 100+ creators worldwide.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (5 columns of 12) */}
        <div className="col-span-12 lg:col-span-5 flex flex-col lg:justify-between lg:h-full space-y-8 lg:space-y-0 items-center w-full max-lg:contents">
          <div className="relative w-full flex flex-col lg:h-full lg:justify-between gap-6 lg:gap-0 lg:max-w-[360px] max-lg:contents">
            {/* Tool Badges — hidden on desktop (rendered in right col), shown on mobile via order */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1, margin: "-15px" }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
              }}
              className="flex flex-col gap-2.5 items-center lg:items-end w-full mb-6 shrink-0 max-lg:order-2 max-lg:mb-0 max-lg:mt-6"
            >
              <div className="flex flex-wrap gap-2 justify-center lg:justify-end">
                {[
                  { text: "Instagram", icon: <Instagram className="size-3 text-[#E1306C]" /> },
                  { text: "YouTube Shorts", icon: <Youtube className="size-3 text-[#FF0000]" /> },
                  { text: "TikTok", icon: <Sparkles className="size-3 text-white" /> },
                  { text: "Premiere Pro", icon: <Scissors className="size-3 text-[#00D4FF]" /> },
                ].map(({ text, icon }) => (
                  <motion.div
                    key={text}
                    variants={{
                      hidden: { opacity: 0, scale: 0.82, y: 10 },
                      visible: {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                      },
                    }}
                    whileHover={{ scale: 1.06, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    <FloatingBadge text={text} icon={icon} />
                  </motion.div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 justify-center lg:justify-end">
                {[
                  { text: "After Effects", icon: <Sparkles className="size-3 text-[#9999FF]" /> },
                  { text: "DaVinci Resolve", icon: <Box className="size-3 text-[#FF9933]" /> },
                  { text: "CapCut", icon: <Scissors className="size-3 text-[#00D4FF]" /> },
                  { text: "Motion Graphics", icon: <Box className="size-3 text-[#3B82F6]" /> },
                ].map(({ text, icon }) => (
                  <motion.div
                    key={text}
                    variants={{
                      hidden: { opacity: 0, scale: 0.82, y: 10 },
                      visible: {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                      },
                    }}
                    whileHover={{ scale: 1.06, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    <FloatingBadge text={text} icon={icon} />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Layered Profile Card Container (Stable, no floating/hover scaling) */}
            <div className="relative w-full aspect-[2/3] shrink-0 max-w-[200px] min-[375px]:max-w-[240px] lg:max-w-none mx-auto max-lg:order-3 max-lg:w-[90%] max-lg:max-w-[320px] max-lg:mx-auto max-lg:mt-6">
              {/* Cinematic spotlight behind the card (ambient back-glow, doesn't overlay image) */}
              <div className="absolute -inset-4 bg-[radial-gradient(circle_at_50%_35%,rgba(24,182,255,0.25)_0%,rgba(139,92,246,0.15)_40%,transparent_70%)] opacity-90 pointer-events-none z-0 blur-lg" />

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="group relative z-10 flex flex-col rounded-[34px] border border-white/[0.08] bg-[#0c1224]/90 shadow-[0_20px_50px_rgba(24,182,255,0.1)] hover:shadow-[0_25px_65px_rgba(24,182,255,0.2)] overflow-hidden animate-border-beam w-full h-full transition-shadow duration-500"
              >
                {/* Main Portrait Image (Full show, no cropping, luxury border) - Original colors and full clarity */}
                <div className="relative w-full h-full overflow-hidden rounded-[34px] bg-[#050810]">
                  <img
                    src={editorProfile}
                    alt="RAQVINE Editor Profile"
                    className="w-full h-full object-cover object-center opacity-100 pointer-events-none select-none"
                  />

                  {/* Subtle card reflection shine */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.03] to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-20" />

                  {/* Inner border highlighted on hover */}
                  <div className="absolute inset-0 rounded-[34px] border border-white/[0.05] group-hover:border-[#38BDF8]/30 transition-colors duration-500 pointer-events-none z-30" />
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 grid grid-cols-2 sm:flex sm:flex-row items-center sm:justify-between gap-y-4 gap-x-2 rounded-2xl border border-white/[0.08] bg-[#0c1224]/90 px-2 py-5 sm:py-3.5 text-xs text-[#9CA3AF] shadow-md shrink-0 w-full max-lg:order-4 max-lg:w-full max-lg:max-w-[360px] max-lg:mx-auto max-lg:mt-6 max-lg:py-4 max-lg:px-3 max-lg:gap-y-3"
            >
              <div className="flex-1 min-w-[70px] text-center px-1 flex flex-col items-center">
                <span className="font-bold text-white text-sm min-[375px]:text-base sm:text-lg max-lg:text-xl">
                  <Counter to={50} suffix="M+" />
                </span>
                <span className="text-[9px] sm:text-badge-text text-[#9CA3AF] mt-0.5 max-lg:text-[9px]">
                  Views
                </span>
                <Sparkline color="#38BDF8" />
              </div>
              <div className="h-10 w-px bg-white/[0.08] hidden sm:block" />
              <div className="flex-1 min-w-[70px] text-center px-1 flex flex-col items-center">
                <span className="font-bold text-white text-sm min-[375px]:text-base sm:text-lg max-lg:text-xl">
                  <Counter to={100} suffix="+" />
                </span>
                <span className="text-[9px] sm:text-badge-text text-[#9CA3AF] mt-0.5 max-lg:text-[9px]">
                  Clients
                </span>
                <Sparkline color="#3B82F6" />
              </div>
              <div className="h-10 w-px bg-white/[0.08] hidden sm:block" />
              <div className="flex-1 min-w-[70px] text-center px-1 flex flex-col items-center">
                <span className="font-bold text-white text-sm min-[375px]:text-base sm:text-lg max-lg:text-xl">
                  <Counter to={4.9} decimals={1} suffix="★" />
                </span>
                <span className="text-[9px] sm:text-badge-text text-[#9CA3AF] mt-0.5 max-lg:text-[9px]">
                  Rating
                </span>
                <Sparkline color="#38BDF8" />
              </div>
              <div className="h-10 w-px bg-white/[0.08] hidden sm:block" />
              <div className="flex-1 min-w-[70px] text-center px-1 flex flex-col items-center">
                <span className="font-bold text-white text-[10px] min-[375px]:text-xs sm:text-xs max-lg:text-base">
                  Worldwide
                </span>
                <span className="text-[9px] sm:text-badge-text text-[#9CA3AF] mt-0.5 max-lg:text-[9px]">
                  Global Reach
                </span>
                <Sparkline color="#3B82F6" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
