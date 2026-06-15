import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import logoImg from "@/assets/brand-logo-v2.png";

const links = [
  { href: "#work", label: "Work" },
  { href: "#services", label: "Services" },
  { href: "#process", label: "Process" },
  { href: "#results", label: "Results" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "py-3" : "py-5",
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div
          className={cn(
            "flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-500",
            scrolled ? "glass-strong" : "bg-transparent",
          )}
        >
          <a href="#top" className="group flex items-center gap-2.5">
            <img
              src={logoImg}
              alt="Raqvine Logo"
              className="size-9 rounded-xl object-cover shadow-[0_8px_24px_-8px_rgba(0,212,255,0.4)]"
            />
            <span className="font-logo text-xl tracking-widest text-white/90">
              RAQ<span className="text-gradient-brand">VINE</span>
            </span>
          </a>
          <nav className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="hidden md:block">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-transform hover:scale-[1.03]"
            >
              Hire Me
              <span className="size-1.5 rounded-full bg-electric" />
            </a>
          </div>
          <button
            onClick={() => setOpen((v) => !v)}
            className="grid size-10 place-items-center rounded-xl glass md:hidden"
            aria-label="Menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
        {open && (
          <div className="mt-2 rounded-2xl glass-strong p-4 md:hidden">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-3 text-sm text-foreground/90 hover:bg-white/5"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-2 block rounded-lg bg-foreground px-3 py-3 text-center text-sm font-medium text-background"
            >
              Hire Me
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
