# Premium Video Editor Portfolio — Build Plan

A single-page, frontend-only site built to feel like a $20K creative agency. Dark cinematic theme, glassmorphism, Framer Motion throughout. No backend.

## Visual system

- Background `#050505`, foreground `#FFFFFF`, electric blue `#00D4FF`, premium purple `#8B5CF6`
- Tokens defined in `src/styles.css` via `@theme` (oklch) + gradient/shadow/glow tokens
- Typography: **Instrument Serif** (display, editorial luxury) + **Inter Tight** (UI/body), loaded via `<link>` in `__root.tsx`
- Reusable primitives: `GlassCard`, `GlowButton`, `SectionHeading`, `AnimatedCounter`, `BeforeAfterSlider`, `MarqueeRow`

## Tech

- TanStack Start (existing stack — Next.js isn't supported here; same React + Vite + TS + Tailwind v4 capabilities)
- Framer Motion (`motion`) for scroll reveal, parallax, hover, counters
- Embla Carousel for testimonials
- All content is static; videos are placeholder MP4 URLs from public CDNs + generated cinematic thumbnails

## Page structure (single route `/`)

One landing page composed of section components in `src/components/landing/`:

1. `Nav.tsx` — fixed glass nav, blur-on-scroll, anchor links, "Hire Me" CTA
2. `Hero.tsx` — full-bleed muted autoplay showreel, gradient vignette, headline, dual CTA, 3 stats, 3 floating glass metric cards with parallax
3. `TrustBar.tsx` — infinite marquee of client-type chips + 4 trust badges
4. `Portfolio.tsx` — 3×3 grid; hover swaps thumbnail → muted video preview; click opens fullscreen Dialog modal with player + overview/techniques/results/tools
5. `BeforeAfter.tsx` — 5 stacked large comparison showcases using a draggable slider (pointer events, no lib) over two stacked videos
6. `Services.tsx` — 8 glass service cards w/ Lucide icons, hover glow + lift
7. `WhyChooseMe.tsx` — 8-feature bento grid
8. `Process.tsx` — 5-step animated vertical/horizontal timeline with scroll-linked progress line
9. `Results.tsx` — 4 large animated counters (IntersectionObserver-triggered count-up)
10. `Testimonials.tsx` — Embla carousel of glass cards with avatar (generated), name, company, quote, stars
11. `FreeSample.tsx` — high-conversion banner with gradient orb background + large CTA
12. `FAQ.tsx` — shadcn Accordion, 5 items
13. `Contact.tsx` — luxury form (Name, Email, Project Type select, Budget select, Timeline select, Details) + WhatsApp/Instagram/LinkedIn/Email cards. Submit shows toast (no backend)
14. `Footer.tsx` — nav links, socials, copyright, back-to-top

## Animations

- Global `useReducedMotion` respect
- Reveal: opacity+y on `whileInView`
- Hero: subtle parallax on floating cards via `useScroll` + `useTransform`
- Marquee: CSS keyframes, pause on hover
- Counters: animate on view, easeOut
- Page-level smooth scroll via `scroll-behavior: smooth` and Lenis-free CSS approach

## Assets

- 9 portfolio thumbnails generated with `imagegen` (cinematic, varied categories)
- 5 client avatars generated
- Hero showreel + before/after + portfolio previews use lightweight public sample MP4s (e.g. Coverr / Pexels CDN) referenced by URL — no bundling

## Files to create

- `src/styles.css` — add tokens, gradients, glow shadows, marquee keyframes
- `src/routes/__root.tsx` — add font `<link>` tags, update meta
- `src/routes/index.tsx` — compose all sections, set SEO meta (title, description, OG)
- `src/components/landing/*` — 14 section components listed above
- `src/components/landing/primitives/` — GlassCard, GlowButton, AnimatedCounter, BeforeAfterSlider, Marquee, SectionHeading
- `src/lib/portfolio-data.ts` — 9 projects, 8 services, 8 features, 5 process steps, 5 testimonials, 5 FAQs, 5 before/afters
- `src/assets/portfolio/*.jpg` — 9 generated thumbnails
- `src/assets/avatars/*.jpg` — 5 generated avatars

## Out of scope (per request)

No backend, DB, auth, admin, or Lovable Cloud. Form submit is UI-only with a success toast.

## Quality bar

- Mobile-first; verified at 375px and 1440px
- Lighthouse-friendly: lazy-load videos below the fold, `preload="metadata"`, generated images sized appropriately
- No hardcoded color classes — all via semantic tokens
- Strong hierarchy, generous spacing, restrained motion (no fade-in-everything)
