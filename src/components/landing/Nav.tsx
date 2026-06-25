import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import logoImg from "@/assets/brand-logo-v2.png";

const links = [
  { href: "#work", label: "WORK" },
  { href: "#services", label: "SERVICES" },
  { href: "#process", label: "PROCESS" },
  { href: "#results", label: "RESULTS" },
  { href: "#contact", label: "CONTACT" },
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
        "fixed inset-x-0 top-0 z-50 h-[64px] flex items-center border-b border-white/[0.08] transition-all duration-500",
        scrolled ? "bg-[#050810]/95 backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <div className="mx-auto w-full max-w-[1320px] px-6 md:px-8 flex items-center justify-between relative h-full">
        <a href="#top" className="group flex items-center gap-3">
          <img
            src={logoImg}
            alt="Raqvine Logo"
            className="size-8 rounded-full object-cover border border-white/[0.08] transition-transform duration-500 group-hover:scale-105"
          />
          <span className="font-logo text-[19px] tracking-[0.02em] text-white/95 uppercase transition-colors group-hover:text-white">
            RAQ<span className="text-gradient-brand">VINE</span>
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-[32px] absolute left-1/2 -translate-x-1/2">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[13px] font-medium tracking-[0.04em] text-[#a1a1aa] transition-colors hover:text-white uppercase"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden md:block">
          <a
            href="#contact"
            className="group relative inline-flex items-center justify-center gap-2 rounded-full px-5 h-[38px] text-[13px] font-bold uppercase tracking-wider text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background:
                "linear-gradient(135deg, rgba(0,212,255,0.9) 0%, rgba(139,92,246,0.9) 100%)",
              boxShadow: "0 0 20px -3px rgba(0,212,255,0.3), 0 0 20px -3px rgba(139,92,246,0.2)",
            }}
          >
            <span>Book Strategy Call</span>
            <span className="relative size-1.5 rounded-full bg-white shadow-[0_0_8px_#fff] animate-pulse ml-2" />
          </a>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="grid size-9 place-items-center rounded-full border border-white/10 bg-white/5 md:hidden text-white transition-colors hover:bg-white/10"
          aria-label="Menu"
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>
      {open && (
        <div className="w-full mt-2 rounded-2xl border border-white/[0.06] bg-[#07070a]/95 p-6 md:hidden backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col gap-4 mx-auto max-w-[calc(100%-2rem)]">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-widest text-[#a1a1aa] hover:bg-white/5 hover:text-white transition-all"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-3 flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-all duration-300 hover:scale-[1.02]"
            style={{
              background:
                "linear-gradient(135deg, rgba(0,212,255,0.9) 0%, rgba(139,92,246,0.9) 100%)",
            }}
          >
            <span>Book Strategy Call</span>
            <span className="size-1.5 rounded-full bg-white animate-pulse" />
          </a>
        </div>
      )}
    </header>
  );
}
