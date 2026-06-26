import { motion, useInView, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow && (
        <div
          className={cn(
            "mb-5 inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground",
            align === "center" && "mx-auto",
          )}
        >
          <span className="size-1.5 rounded-full bg-electric animate-pulse-glow" />
          {eyebrow}
        </div>
      )}
      <h2 className="font-display text-section-title text-gradient">{title}</h2>
      {subtitle && <p className="mt-5 text-body-premium text-muted-foreground">{subtitle}</p>}
    </motion.div>
  );
}

export function GlassCard({
  className,
  children,
  glow,
}: {
  className?: string;
  children: ReactNode;
  glow?: "blue" | "violet";
}) {
  return (
    <div
      className={cn(
        "glass rounded-2xl",
        glow === "blue" && "glow-blue",
        glow === "violet" && "glow-violet",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedCounter({
  to,
  suffix = "",
  duration = 2,
}: {
  to: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.floor(v).toLocaleString());
  const inView = useInView(ref, { once: true, margin: "-80px" });
  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, to, { duration, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [inView, mv, to, duration]);
  useEffect(
    () =>
      rounded.on("change", (v) => {
        if (ref.current) ref.current.textContent = v + suffix;
      }),
    [rounded, suffix],
  );
  return <span ref={ref}>0{suffix}</span>;
}
