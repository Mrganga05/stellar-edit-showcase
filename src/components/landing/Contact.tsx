import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { MessageCircle, Instagram, Linkedin, Youtube, ArrowRight } from "lucide-react";
import { SectionHeading, Reveal } from "./primitives";
import { contactApi } from "@/lib/api/services";

const channels = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+91 9160851678",
    href: "https://wa.me/919160851678",
  },
  {
    icon: Instagram,
    label: "Instagram",
    value: "@raqvine",
    href: "https://www.instagram.com/raqvine?igsh=cXIxcHN1Y215OTh5",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "Raghu Sai",
    href: "https://www.linkedin.com/in/raghu-sai-59a207382?utm_source=share_via&utm_content=profile&utm_medium=member_android",
  },
  {
    icon: Youtube,
    label: "YouTube",
    value: "@move_with_raghu",
    href: "https://youtube.com/@move_with_raghu?si=SqOo7Lgrlm2CVDJZ",
  },
];

const projectTypes = [
  "YouTube Long-form",
  "Shorts / Reels",
  "Podcast",
  "Commercial Ad",
  "Wedding / Event",
  "Other",
];
const timelines = ["ASAP / Urgent", "1–2 Weeks", "3–4 Weeks", "Ongoing Partnership"];

export function Contact() {
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const projectType = formData.get("type") as any;
    const timeline = formData.get("timeline") as any;
    const details = formData.get("details") as string;

    try {
      await contactApi.create({
        name,
        email,
        projectType,
        budget: "Not Specified",
        timeline,
        details,
      });
      form.reset();
      toast.success("Project request received", {
        description: "I'll be in touch within 12 hours.",
      });
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to submit request", {
        description: err.message || "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }
  return (
    <section id="contact" className="relative mx-auto max-w-[1320px] px-6 py-24 md:px-8 md:py-32">
      <SectionHeading
        eyebrow="Start a Project"
        title={
          <>
            Let's make something <span className="text-gradient-brand">unforgettable</span>.
          </>
        }
        subtitle="Tell me about your project. I respond within 12 hours, every working day."
      />
      <div className="mt-16 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Reveal>
          <form onSubmit={onSubmit} className="rounded-3xl glass-strong p-5 sm:p-10">
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
              <Field label="Name">
                <input required name="name" className={inputCls} placeholder="Your full name" />
              </Field>
              <Field label="Email">
                <input
                  required
                  type="email"
                  name="email"
                  className={inputCls}
                  placeholder="you@brand.com"
                />
              </Field>
              <Field label="Project Type">
                <select required name="type" className={inputCls} defaultValue="">
                  <option value="" disabled>
                    Choose one
                  </option>
                  {projectTypes.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </Field>
              <Field label="Timeline">
                <select required name="timeline" className={inputCls} defaultValue="">
                  <option value="" disabled>
                    Choose one
                  </option>
                  {timelines.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </Field>
              <Field label="Project Details" className="sm:col-span-2">
                <textarea
                  required
                  name="details"
                  rows={4}
                  className={inputCls}
                  placeholder="Footage type, deliverables, references, deadlines…"
                />
              </Field>
            </div>
            <button
              disabled={loading}
              className="mt-6 sm:mt-8 inline-flex items-center justify-center gap-2 rounded-full btn-primary-glow px-6 sm:px-7 h-[42px] sm:h-[48px] text-xs sm:text-button-text text-white disabled:opacity-60 w-full sm:w-auto"
            >
              {loading ? (
                "Sending…"
              ) : (
                <>
                  Send project request <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="grid grid-cols-2 lg:flex lg:flex-col gap-3 lg:gap-4 h-full">
            {channels.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-2.5 sm:gap-4 rounded-xl sm:rounded-2xl glass p-3.5 sm:p-6 hover-card-premium"
              >
                <div className="grid size-9 sm:size-12 place-items-center rounded-xl bg-gradient-to-br from-electric/20 to-violet-glow/20 text-electric shrink-0">
                  <c.icon className="size-4 sm:size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[9px] sm:text-badge-text text-muted-foreground font-semibold uppercase">{c.label}</div>
                  <div className="truncate text-xs sm:text-base font-semibold text-white mt-0.5">{c.value}</div>
                </div>
                <ArrowRight className="size-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 hidden sm:block" />
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const inputCls =
  "w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:border-electric focus:outline-none focus:ring-2 focus:ring-electric/30 transition";

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[10px] sm:text-badge-text text-muted-foreground font-bold uppercase tracking-wider">{label}</span>
      {children}
    </label>
  );
}
