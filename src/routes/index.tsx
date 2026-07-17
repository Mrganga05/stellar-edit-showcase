import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { TrustBar } from "@/components/landing/TrustBar";
import { Portfolio } from "@/components/landing/Portfolio";
import { About } from "@/components/landing/About";
import { Services } from "@/components/landing/Services";
import { WhyChooseMe } from "@/components/landing/WhyChooseMe";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import { Contact } from "@/components/landing/Contact";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Raqvine — Premium Video Editing Studio" },
      {
        name: "description",
        content:
          "Premium video editing for YouTubers, brands, podcasts and businesses. Cinematic edits engineered for retention, growth and conversion.",
      },
      { property: "og:title", content: "Raqvine — Premium Video Editing Studio" },
      {
        property: "og:description",
        content: "Cinematic video editing built for retention, growth and conversion.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const divider = (
    <div className="mx-auto w-full max-w-[1320px] px-6 md:px-8">
      <div className="h-px w-full bg-white/[0.08]" />
    </div>
  );

  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#050816] text-foreground">
      <Nav />
      <Hero />
      <TrustBar />
      {divider}
      <Portfolio />
      {divider}
      <About />
      {divider}
      <Services />
      {divider}
      <WhyChooseMe />
      {divider}
      <Testimonials />
      {divider}
      <FAQ />
      {divider}
      <Contact />
      <Footer />
      <Toaster theme="dark" position="bottom-right" />
    </main>
  );
}
