import { ArrowUp, Instagram, Linkedin, Youtube, MessageCircle } from "lucide-react";
import logoImg from "@/assets/brand-logo-v2.png";

export function Footer() {
  return (
    <footer className="relative border-t border-white/8 bg-surface/60 px-5 pb-10 pt-20 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <img src={logoImg} alt="Raqvine Logo" className="size-9 rounded-xl object-cover" />
              <span className="font-logo text-xl tracking-widest text-white/90">
                RAQ<span className="text-gradient-brand">VINE</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Premium video editing for creators, brands and businesses who want their footage to
              move people — and metrics.
            </p>
            <div className="mt-6 flex gap-2">
              {[
                { icon: Instagram, href: "https://www.instagram.com/raqvine?igsh=cXIxcHN1Y215OTh5" },
                { icon: Youtube, href: "https://youtube.com/@move_with_raghu?si=SqOo7Lgrlm2CVDJZ" },
                { icon: Linkedin, href: "https://www.linkedin.com/in/raghu-sai-59a207382?utm_source=share_via&utm_content=profile&utm_medium=member_android" },
                { icon: MessageCircle, href: "https://wa.me/919160851678" }
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="grid size-10 place-items-center rounded-full glass hover:bg-white/10"
                >
                  <social.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>
          <FooterCol
            title="Work"
            links={[
              { label: "Portfolio", href: "#work" },
              { label: "About", href: "#about" },
              { label: "Process", href: "#process" },
              { label: "Results", href: "#results" }
            ]}
          />
          <FooterCol
            title="Services"
            links={[
              { label: "YouTube", href: "#services" },
              { label: "Shorts & Reels", href: "#services" },
              { label: "Podcast", href: "#services" },
              { label: "Commercial", href: "#services" }
            ]}
          />
          <FooterCol
            title="Contact"
            links={[
              { label: "WhatsApp", href: "https://wa.me/919160851678" },
              { label: "Instagram", href: "https://www.instagram.com/raqvine?igsh=cXIxcHN1Y215OTh5" },
              { label: "LinkedIn", href: "https://www.linkedin.com/in/raghu-sai-59a207382?utm_source=share_via&utm_content=profile&utm_medium=member_android" },
              { label: "Email", href: "mailto:hello@raqvine.studio" }
            ]}
          />
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/8 pt-8 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span>© {new Date().getFullYear()} Raqvine Studio. All rights reserved.</span>
            <span className="hidden sm:inline text-white/10">•</span>
            <a href="/admin" className="hover:text-foreground transition-colors">Admin Console</a>
          </div>
          <a
            href="#top"
            className="group inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground"
          >
            Back to top{" "}
            <ArrowUp className="size-3.5 transition-transform group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{title}</div>
      <ul className="mt-4 space-y-2.5 text-sm">
        {links.map((l) => (
          <li key={l.label}>
            <a href={l.href} className="text-foreground/80 hover:text-foreground">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
