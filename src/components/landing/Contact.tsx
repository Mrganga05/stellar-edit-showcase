import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { MessageCircle, Instagram, Linkedin, Youtube, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { SectionHeading, Reveal } from "./primitives";
import { contactApi } from "@/lib/api/services";
import { contactCreateSchema } from "@/lib/api/schemas";

import { useServices } from "@/lib/api/hooks";

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

const defaultProjectTypes = [
  "Short-Form Editing",
  "Long-Form Editing",
  "Motion Graphics",
  "Commercial Ads",
  "Cinematic Editing",
  "AI Editing",
  "Website Development",
  "3D Web Experiences",
  "AI Automation",
  "AI Voice Agents",
  "Other",
];
const timelines = ["ASAP / Urgent", "1–2 Weeks", "3–4 Weeks", "Ongoing Partnership"];

const countryCodes = [
  { code: "+91", country: "IN", flag: "🇮🇳", label: "India (+91)" },
  { code: "+1", country: "US", flag: "🇺🇸", label: "USA/Canada (+1)" },
  { code: "+44", country: "GB", flag: "🇬🇧", label: "UK (+44)" },
  { code: "+61", country: "AU", flag: "🇦🇺", label: "Australia (+61)" },
  { code: "+971", country: "AE", flag: "🇦🇪", label: "UAE (+971)" },
  { code: "+49", country: "DE", flag: "🇩🇪", label: "Germany (+49)" },
  { code: "+33", country: "FR", flag: "🇫🇷", label: "France (+33)" },
  { code: "+81", country: "JP", flag: "🇯🇵", label: "Japan (+81)" },
  { code: "+65", country: "SG", flag: "🇸🇬", label: "Singapore (+65)" },
  { code: "+86", country: "CN", flag: "🇨🇳", label: "China (+86)" },
  { code: "+966", country: "SA", flag: "🇸🇦", label: "Saudi Arabia (+966)" },
  { code: "+31", country: "NL", flag: "🇳🇱", label: "Netherlands (+31)" },
  { code: "+41", country: "CH", flag: "🇨🇭", label: "Switzerland (+41)" },
  { code: "+55", country: "BR", flag: "🇧🇷", label: "Brazil (+55)" },
  { code: "+27", country: "ZA", flag: "🇿🇦", label: "South Africa (+27)" },
  { code: "+82", country: "KR", flag: "🇰🇷", label: "South Korea (+82)" },
  { code: "+64", country: "NZ", flag: "🇳🇿", label: "New Zealand (+64)" },
  { code: "+39", country: "IT", flag: "🇮🇹", label: "Italy (+39)" },
  { code: "+34", country: "ES", flag: "🇪🇸", label: "Spain (+34)" },
  { code: "+62", country: "ID", flag: "🇮🇩", label: "Indonesia (+62)" },
  { code: "+60", country: "MY", flag: "🇲🇾", label: "Malaysia (+60)" },
  { code: "+63", country: "PH", flag: "🇵🇭", label: "Philippines (+63)" },
  { code: "+84", country: "VN", flag: "🇻🇳", label: "Vietnam (+84)" },
  { code: "+92", country: "PK", flag: "🇵🇰", label: "Pakistan (+92)" },
  { code: "+880", country: "BD", flag: "🇧🇩", label: "Bangladesh (+880)" },
  { code: "+94", country: "LK", flag: "🇱🇰", label: "Sri Lanka (+94)" },
  { code: "+977", country: "NP", flag: "🇳🇵", label: "Nepal (+977)" },
  { code: "+20", country: "EG", flag: "🇪🇬", label: "Egypt (+20)" },
  { code: "+234", country: "NG", flag: "🇳🇬", label: "Nigeria (+234)" },
  { code: "+254", country: "KE", flag: "🇰🇪", label: "Kenya (+254)" },
  { code: "+52", country: "MX", flag: "🇲🇽", label: "Mexico (+52)" },
  { code: "+54", country: "AR", flag: "🇦🇷", label: "Argentina (+54)" },
  { code: "+57", country: "CO", flag: "🇨🇴", label: "Colombia (+57)" },
  { code: "+56", country: "CL", flag: "🇨🇱", label: "Chile (+56)" },
  { code: "+46", country: "SE", flag: "🇸🇪", label: "Sweden (+46)" },
  { code: "+47", country: "NO", flag: "🇳🇴", label: "Norway (+47)" },
  { code: "+45", country: "DK", flag: "🇩🇰", label: "Denmark (+45)" },
  { code: "+358", country: "FI", flag: "🇫🇮", label: "Finland (+358)" },
  { code: "+353", country: "IE", flag: "🇮🇪", label: "Ireland (+353)" },
  { code: "+32", country: "BE", flag: "🇧🇪", label: "Belgium (+32)" },
  { code: "+43", country: "AT", flag: "🇦🇹", label: "Austria (+43)" },
  { code: "+48", country: "PL", flag: "🇵🇱", label: "Poland (+48)" },
  { code: "+420", country: "CZ", flag: "🇨🇿", label: "Czechia (+420)" },
  { code: "+30", country: "GR", flag: "🇬🇷", label: "Greece (+30)" },
  { code: "+351", country: "PT", flag: "🇵🇹", label: "Portugal (+351)" },
  { code: "+90", country: "TR", flag: "🇹🇷", label: "Turkey (+90)" },
  { code: "+972", country: "IL", flag: "🇮🇱", label: "Israel (+972)" },
  { code: "+974", country: "QA", flag: "🇶🇦", label: "Qatar (+974)" },
  { code: "+968", country: "OM", flag: "🇴🇲", label: "Oman (+968)" },
  { code: "+965", country: "KW", flag: "🇰🇼", label: "Kuwait (+965)" },
  { code: "+973", country: "BH", flag: "🇧🇭", label: "Bahrain (+973)" },
];

export function Contact() {
  const [loading, setLoading] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const { data: dbServices } = useServices();

  const projectTypes =
    dbServices && dbServices.length > 0
      ? Array.from(new Set([...dbServices.map((s) => s.title), "Other"]))
      : defaultProjectTypes;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const rawPhone = (formData.get("phoneNumber") as string) || "";
    const phone = rawPhone.trim().startsWith("+") ? rawPhone.trim() : `${countryCode} ${rawPhone.trim()}`;
    const projectType = formData.get("type") as string;
    const timeline = formData.get("timeline") as string;
    const details = formData.get("details") as string;

    const validationResult = contactCreateSchema.safeParse({
      name,
      email,
      phone,
      projectType,
      budget: "Not Specified",
      timeline,
      details,
    });

    if (!validationResult.success) {
      setLoading(false);
      const errors = validationResult.error.flatten().fieldErrors;
      const errorMsg = Object.values(errors).flat().join(". ");
      toast.error("Validation Error", {
        description: errorMsg || "Please check your inputs.",
      });
      return;
    }

    try {
      await contactApi.create(validationResult.data);
      form.reset();
      setPhoneNumber("");
      toast.success("Project request received", {
        description: "I'll be in touch within 12 hours.",
      });
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      toast.error("Failed to submit request", {
        description: message,
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
              <Field label="Phone Number">
                <div className="w-full rounded-xl border border-white/10 bg-[#050816]/90 flex items-center focus-within:border-electric focus-within:ring-2 focus-within:ring-electric/30 transition overflow-hidden">
                  <select
                    aria-label="Country Code"
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="bg-[#050816] text-foreground text-[14px] md:text-sm py-3 pl-3 pr-1.5 focus:outline-none border-r border-white/10 cursor-pointer shrink-0"
                  >
                    {countryCodes.map((c) => (
                      <option key={`${c.country}-${c.code}`} value={c.code} className="bg-[#050816] text-white">
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                  <input
                    required
                    type="tel"
                    name="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-transparent px-3.5 py-3 sm:px-4 sm:py-3 text-[16px] md:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                    placeholder="91608 51678"
                  />
                </div>
              </Field>
              <Field label="Project Type">
                <select required name="type" className={inputCls} defaultValue="">
                  <option value="" disabled className="bg-[#050816] text-white">
                    Choose one
                  </option>
                  {projectTypes.map((p) => (
                    <option key={p} className="bg-[#050816] text-white">
                      {p}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Timeline" className="sm:col-span-2">
                <select required name="timeline" className={inputCls} defaultValue="">
                  <option value="" disabled className="bg-[#050816] text-white">
                    Choose one
                  </option>
                  {timelines.map((p) => (
                    <option key={p} className="bg-[#050816] text-white">
                      {p}
                    </option>
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
              className="mt-6 sm:mt-8 inline-flex items-center justify-center gap-2 rounded-full btn-primary-glow px-6 sm:px-7 h-[48px] sm:h-[52px] text-xs sm:text-button-text text-white disabled:opacity-60 w-full sm:w-auto active:scale-95 cursor-pointer"
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
              <motion.a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noreferrer"
                whileTap={{ scale: 0.98 }}
                className="group flex items-center gap-2.5 sm:gap-4 rounded-xl sm:rounded-2xl glass p-3.5 sm:p-6 hover-card-premium"
              >
                <div className="grid size-9 sm:size-12 place-items-center rounded-xl bg-gradient-to-br from-electric/20 to-violet-glow/20 text-electric shrink-0">
                  <c.icon className="size-4 sm:size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[9px] sm:text-badge-text text-muted-foreground font-semibold uppercase">
                    {c.label}
                  </div>
                  <div className="truncate text-xs sm:text-base font-semibold text-white mt-0.5">
                    {c.value}
                  </div>
                </div>
                <ArrowRight className="size-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 hidden sm:block" />
              </motion.a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const inputCls =
  "w-full rounded-xl border border-white/10 bg-[#050816]/90 px-3.5 py-3 sm:px-4 sm:py-3 text.16px md:text-sm text-foreground placeholder:text-muted-foreground focus:border-electric focus:outline-none focus:ring-2 focus:ring-electric/30 transition text-[16px] md:text-sm";

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
      <span className="mb-1.5 block text-[10px] sm:text-badge-text text-muted-foreground font-bold uppercase tracking-wider">
        {label}
      </span>
      {children}
    </label>
  );
}
