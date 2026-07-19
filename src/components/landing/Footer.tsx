import { ArrowUp, Instagram, Linkedin, Youtube, MessageCircle } from "lucide-react";
import logoImg from "@/assets/brand-logo-v2.png";

export function Footer() {
  return (
    <footer className="relative border-t border-white/8 bg-surface/60 px-6 pt-24 pb-16 md:px-8">
      <div className="mx-auto max-w-[1320px]">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
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
                {
                  icon: Instagram,
                  href: "https://www.instagram.com/raqvine?igsh=cXIxcHN1Y215OTh5",
                },
                { icon: Youtube, href: "https://youtube.com/@move_with_raghu?si=SqOo7Lgrlm2CVDJZ" },
                {
                  icon: Linkedin,
                  href: "https://www.linkedin.com/in/raghu-sai-59a207382?utm_source=share_via&utm_content=profile&utm_medium=member_android",
                },
                { icon: MessageCircle, href: "https://wa.me/919160851678" },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="grid size-11 place-items-center rounded-full glass hover:bg-white/10 active:scale-95 cursor-pointer"
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
            ]}
          />
          <FooterCol
            title="Services"
            links={[
              { label: "YouTube", href: "#services" },
              { label: "Shorts & Reels", href: "#services" },
              { label: "Podcast", href: "#services" },
              { label: "Commercial", href: "#services" },
            ]}
          />
          <FooterCol
            title="Contact"
            links={[
              { label: "WhatsApp", href: "https://wa.me/919160851678" },
              {
                label: "Instagram",
                href: "https://www.instagram.com/raqvine?igsh=cXIxcHN1Y215OTh5",
              },
              {
                label: "LinkedIn",
                href: "https://www.linkedin.com/in/raghu-sai-59a207382?utm_source=share_via&utm_content=profile&utm_medium=member_android",
              },
              { label: "Email", href: "mailto:hello@raqvine.studio" },
            ]}
          />
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/8 pt-8 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-small-body text-muted-foreground text-center sm:text-left">
            <span>© {new Date().getFullYear()} Raqvine Studio. All rights reserved.</span>
            <span className="hidden sm:inline text-white/10">•</span>
            <a href="/admin" className="hover:text-white transition-colors">
              Admin Console
            </a>
          </div>
          <a
            href="#top"
            className="group inline-flex items-center gap-2 rounded-full glass px-5 h-[48px] text-badge-text text-muted-foreground hover:text-white transition-colors w-full sm:w-auto justify-center active:scale-95 cursor-pointer"
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
      <div className="text-badge-text text-muted-foreground">{title}</div>
      <ul className="mt-4 space-y-3 text-small-body">
        {links.map((l) => (
          <li key={l.label}>
            <a href={l.href} className="text-muted-foreground hover:text-white transition-colors">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
