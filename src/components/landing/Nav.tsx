import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import logoImg from "@/assets/brand-logo-v2.png";

const links = [
  { href: "#work", label: "WORK" },
  { href: "#about", label: "ABOUT" },
  { href: "#services", label: "SERVICES" },
  { href: "#process", label: "PROCESS" },
  { href: "#contact", label: "CONTACTS" },
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
        "fixed inset-x-0 top-0 z-50 h-[64px] flex items-center border-b transition-all duration-500",
        scrolled
          ? "bg-[#050816]/95 backdrop-blur-xl border-white/[0.045] shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
          : "bg-transparent border-transparent",
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
        <nav className="hidden md:flex items-center gap-[44px] absolute left-1/2 -translate-x-1/2">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-nav-menu text-[#a1a1aa] nav-link-premium uppercase"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden md:block">
          <a
            href="#contact"
            className="group btn-primary-glow inline-flex items-center justify-center gap-2 rounded-full px-6 h-[44px] text-button-text uppercase text-white cursor-pointer overflow-hidden"
          >
            {/* Sheen reflection sweep */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
            <span className="relative flex items-center gap-2.5 z-10">
              <span>Book Strategy Call</span>
              <span className="relative size-1.5 rounded-full bg-white shadow-[0_0_8px_#fff] animate-pulse ml-1" />
            </span>
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
      {/* Mobile Menu Dropdown */}
      <div
        className={cn(
          "absolute top-[64px] left-0 right-0 z-40 w-full border-b border-white/[0.035] bg-[#050816]/98 px-6 py-6 flex flex-col gap-4 md:hidden backdrop-blur-xl transition-all duration-300 ease-in-out origin-top",
          open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none",
        )}
      >
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            className="block rounded-lg px-3 py-2 text-nav-menu uppercase text-[#a1a1aa] hover:bg-white/5 hover:text-white transition-all"
          >
            {l.label}
          </a>
        ))}
        <a
          href="#contact"
          onClick={() => setOpen(false)}
          className="mt-2 group btn-primary-glow flex items-center justify-center gap-2 rounded-full px-6 h-[48px] text-button-text uppercase text-white overflow-hidden"
        >
          {/* Sheen reflection sweep */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
          <span className="relative flex items-center gap-2 z-10">
            <span>Book Strategy Call</span>
            <span className="size-1.5 rounded-full bg-white animate-pulse" />
          </span>
        </a>
      </div>
    </header>
  );
}
