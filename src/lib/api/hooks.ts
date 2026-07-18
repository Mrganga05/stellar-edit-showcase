import { useQuery } from "@tanstack/react-query";
import { comparisonApi, faqApi, portfolioApi, serviceApi, testimonialApi } from "./services";
import {
  projects as mockProjects,
  beforeAfter as mockBeforeAfter,
  testimonials as mockTestimonials,
  faqs as mockFaqs,
} from "../portfolio-data";
import type { PortfolioProject, BeforeAfterProject, Testimonial, Service, Faq } from "./contracts";

const initialPortfolioProjects: PortfolioProject[] = mockProjects.map((p, idx) => ({
  id: p.id,
  serviceId: null,
  title: p.title,
  category: p.category,
  thumbnail: p.thumb,
  videoUrl: p.video,
  description: p.description,
  overview: p.overview,
  techniques: p.techniques,
  results: p.results,
  tools: p.tools,
  sortOrder: idx,
  isPublished: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  clientName: p.clientName,
  metric: p.metric,
}));

const initialComparisons: BeforeAfterProject[] = mockBeforeAfter.map((b, idx) => ({
  id: b.id,
  projectTitle: b.title,
  beforeVideo: b.before,
  afterVideo: b.after,
  description: b.desc,
  sortOrder: idx,
  isPublished: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

const initialTestimonials: Testimonial[] = mockTestimonials.map((t, idx) => ({
  id: `t${idx}`,
  clientName: t.name,
  company: t.company,
  rating: t.rating,
  review: t.quote,
  profileImage: t.avatar,
  sortOrder: idx,
  isPublished: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

const initialFaqs: Faq[] = mockFaqs.map((f, idx) => ({
  id: `f${idx}`,
  question: f.q,
  answer: f.a,
  sortOrder: idx,
  isPublished: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

const initialServices: Service[] = [
  {
    id: "s1",
    title: "Short-Form Editing",
    slug: "short-form-editing",
    description: "High-retention vertical edits engineered to stop scrolling and maximize engagement.",
    iconKey: "Clapperboard",
    sortOrder: 0,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "s2",
    title: "Long-Form Editing",
    slug: "long-form-editing",
    description: "Retention-first YouTube editing designed to increase watch time and audience growth.",
    iconKey: "Youtube",
    sortOrder: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "s3",
    title: "Motion Graphics",
    slug: "motion-graphics",
    description: "Premium animations, kinetic typography, branded graphics, and visual storytelling.",
    iconKey: "Sparkles",
    sortOrder: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "s4",
    title: "Commercial Ads",
    slug: "commercial-ads",
    description: "High-converting ad creatives built for Meta, Google, YouTube, and TikTok.",
    iconKey: "Megaphone",
    sortOrder: 3,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "s5",
    title: "Cinematic Editing",
    slug: "cinematic-editing",
    description: "Luxury cinematic edits with professional color grading and premium finishing.",
    iconKey: "Film",
    sortOrder: 4,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "s6",
    title: "AI Editing",
    slug: "ai-editing",
    description: "AI-assisted editing workflows that accelerate production without sacrificing quality.",
    iconKey: "Wand2",
    sortOrder: 5,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "s7",
    title: "Website Development",
    slug: "website-development",
    description: "Fast, responsive, SEO-optimized websites built to convert visitors into customers.",
    iconKey: "Globe",
    sortOrder: 6,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "s8",
    title: "3D Web Experiences",
    slug: "3d-web-experiences",
    description: "Immersive interactive websites powered by modern 3D technologies and smooth animations.",
    iconKey: "Box",
    sortOrder: 7,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "s9",
    title: "AI Automation",
    slug: "ai-automation",
    description: "Automate repetitive workflows, lead management, and business operations using AI.",
    iconKey: "Bot",
    sortOrder: 8,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "s10",
    title: "AI Voice Agents",
    slug: "ai-voice-agents",
    description: "24/7 AI voice assistants for sales, customer support, bookings, and lead qualification.",
    iconKey: "Mic",
    sortOrder: 9,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function usePortfolioProjects() {
  return useQuery({
    queryKey: ["portfolio-projects"],
    queryFn: portfolioApi.list,
    staleTime: 60_000,
    initialData: initialPortfolioProjects,
  });
}

export function useComparisons() {
  return useQuery({
    queryKey: ["before-after-projects"],
    queryFn: comparisonApi.list,
    staleTime: 60_000,
    initialData: initialComparisons,
  });
}

export function useTestimonials() {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: testimonialApi.list,
    staleTime: 60_000,
    initialData: initialTestimonials,
  });
}

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: serviceApi.list,
    staleTime: 60_000,
    initialData: initialServices,
  });
}

export function useFaqs() {
  return useQuery({
    queryKey: ["faqs"],
    queryFn: faqApi.list,
    staleTime: 60_000,
    initialData: initialFaqs,
  });
}
