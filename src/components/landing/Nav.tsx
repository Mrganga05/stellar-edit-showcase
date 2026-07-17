import { useEffect, useState, useCallback } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import logoImg from "@/assets/brand-logo-v2.png";
import { motion, AnimatePresence } from "motion/react";

const links = [
  { href: "work", label: "WORK" },
  { href: "about", label: "ABOUT" },
  { href: "services", label: "SERVICES" },
  { href: "contact", label: "CONTACTS" },
];

// Smooth-scroll to a section by id, offsetting 72px for fixed nav
function scrollTo(id: string) {
  if (id === "top") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 72;
  window.scrollTo({ top: y, behavior: "smooth" });
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("#mobile-nav-menu") && !target.closest("#mobile-nav-btn")) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleLink = useCallback((id: string) => {
    setOpen(false);
    setTimeout(() => scrollTo(id), 50);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 h-[64px] flex items-center border-b transition-all duration-500",
          scrolled
            ? "bg-[#050816]/95 backdrop-blur-xl border-white/[0.045] shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
            : "bg-transparent border-transparent",
        )}
      >
        <div className="mx-auto w-full max-w-[1320px] px-6 md:px-8 flex items-center justify-between relative h-full">
          {/* Logo */}
          <button
            onClick={() => handleLink("top")}
            className="group flex items-center gap-3 cursor-pointer bg-transparent border-none p-0"
          >
            <img
              src={logoImg}
              alt="Raqvine Logo"
              className="size-8 rounded-full object-cover border border-white/[0.08] transition-transform duration-500 group-hover:scale-105"
            />
            <span className="font-logo text-[19px] tracking-[0.02em] text-white/95 uppercase transition-colors group-hover:text-white">
              RAQ<span className="text-gradient-brand">VINE</span>
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-[44px] absolute left-1/2 -translate-x-1/2">
            {links.map((l) => (
              <button
                key={l.href}
                onClick={() => handleLink(l.href)}
                className="text-nav-menu text-[#a1a1aa] nav-link-premium uppercase bg-transparent border-none cursor-pointer p-0 hover:text-white transition-colors duration-200"
              >
                {l.label}
              </button>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <button
              onClick={() => handleLink("contact")}
              className="group btn-primary-glow relative inline-flex items-center justify-center gap-2 rounded-full px-6 h-[44px] text-button-text uppercase text-white cursor-pointer overflow-hidden border-none"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
              <span className="relative flex items-center gap-2.5 z-10">
                <span>Book Strategy Call</span>
                <span className="relative size-1.5 rounded-full bg-white shadow-[0_0_8px_#fff] animate-pulse ml-1" />
              </span>
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            id="mobile-nav-btn"
            onClick={() => setOpen((v) => !v)}
            className="grid size-11 place-items-center rounded-full border border-white/10 bg-white/5 md:hidden text-white transition-colors hover:bg-white/10 cursor-pointer"
            aria-label="Menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <X className="size-5" />
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <Menu className="size-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </header>

      {/* Mobile Dropdown — rendered outside header to avoid clipping */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-[64px] left-0 right-0 z-[49] md:hidden border-b border-white/[0.05] bg-[#050816]/98 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {links.map((l, i) => (
                <motion.button
                  key={l.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2, delay: i * 0.04 }}
                  onClick={() => handleLink(l.href)}
                  className="flex items-center w-full min-h-[50px] rounded-xl px-5 text-nav-menu uppercase text-[#a1a1aa] hover:bg-white/[0.06] hover:text-white transition-all text-left bg-transparent border-none cursor-pointer font-semibold tracking-widest"
                >
                  {l.label}
                </motion.button>
              ))}

              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.22, delay: links.length * 0.04 }}
                onClick={() => handleLink("contact")}
                className="mt-2 group btn-primary-glow relative flex items-center justify-center gap-2 rounded-full px-6 h-[50px] text-button-text uppercase text-white overflow-hidden cursor-pointer border-none w-full"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
                <span className="relative flex items-center gap-2 z-10">
                  <span>Book Strategy Call</span>
                  <span className="size-1.5 rounded-full bg-white animate-pulse" />
                </span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
