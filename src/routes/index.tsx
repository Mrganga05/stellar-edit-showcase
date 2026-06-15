import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { TrustBar } from "@/components/landing/TrustBar";
import { Portfolio } from "@/components/landing/Portfolio";
import { About } from "@/components/landing/About";
import { Services } from "@/components/landing/Services";
import { WhyChooseMe } from "@/components/landing/WhyChooseMe";
import { Process } from "@/components/landing/Process";
import { Results } from "@/components/landing/Results";
import { Testimonials } from "@/components/landing/Testimonials";
import { FreeSample } from "@/components/landing/FreeSample";
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
  return (
    <main className="relative min-h-screen overflow-x-clip bg-background text-foreground">
      <Nav />
      <Hero />
      <TrustBar />
      <Portfolio />
      <About />
      <Services />
      <WhyChooseMe />
      <Process />
      <Results />
      <Testimonials />
      <FreeSample />
      <FAQ />
      <Contact />
      <Footer />
      <Toaster theme="dark" position="bottom-right" />
    </main>
  );
}

