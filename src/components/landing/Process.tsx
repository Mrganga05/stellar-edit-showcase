import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Upload, MessageCircle, Scissors, Eye, Send } from "lucide-react";
import { SectionHeading } from "./primitives";

const steps = [
  {
    icon: Upload,
    title: "Send Footage",
    desc: "Upload raw clips, voiceover, brand assets via Frame.io or Drive.",
  },
  {
    icon: MessageCircle,
    title: "Project Discussion",
    desc: "30-min call to align on tone, references and deliverables.",
  },
  {
    icon: Scissors,
    title: "Professional Editing",
    desc: "First cut delivered in 48–72 hours, ready for review.",
  },
  {
    icon: Eye,
    title: "Review & Feedback",
    desc: "Frame-accurate comments. Unlimited revisions within scope.",
  },
  {
    icon: Send,
    title: "Final Delivery",
    desc: "Masters + platform-specific exports. Yours to launch.",
  },
];

export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 30%"] });
  const lineH = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="process" className="relative mx-auto max-w-[1320px] px-6 py-24 md:px-8 md:py-32">
      <SectionHeading
        eyebrow="Editing Process"
        title={
          <>
            Five steps. <span className="text-gradient-brand">Zero friction</span>.
          </>
        }
      />
      <div ref={ref} className="relative mt-16">
        <div className="absolute left-6 top-6 bottom-6 hidden w-px bg-white/10 sm:block" />
        <motion.div
          style={{ height: lineH }}
          className="absolute left-6 top-6 bottom-6 hidden w-px bg-gradient-to-b from-electric to-violet-glow sm:block"
        />
        <div className="space-y-8 sm:space-y-12">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className="relative grid grid-cols-[auto_1fr] items-start gap-6 sm:gap-8"
            >
              <div className="relative z-10 grid size-12 place-items-center rounded-full glass-strong glow-blue">
                <s.icon className="size-5 text-electric" />
              </div>
              <div className="rounded-2xl glass p-6 hover-card-premium">
                <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  Step {i + 1}
                </div>
                <h3 className="mt-2 font-display text-2xl sm:text-3xl text-white">{s.title}</h3>
                <p className="mt-2 text-muted-foreground text-sm sm:text-base">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
