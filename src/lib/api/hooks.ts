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
    title: "YouTube Editing",
    slug: "youtube-editing",
    description: "Long-form retention-first edits that grow channels.",
    iconKey: "Youtube",
    sortOrder: 0,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "s2",
    title: "Shorts Editing",
    slug: "shorts-editing",
    description: "Hook-first vertical edits engineered to loop.",
    iconKey: "Smartphone",
    sortOrder: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "s3",
    title: "Reels Editing",
    slug: "reels-editing",
    description: "Editorial reels with kinetic motion and grade.",
    iconKey: "Instagram",
    sortOrder: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "s4",
    title: "Podcast Editing",
    slug: "podcast-editing",
    description: "Multi-cam + broadcast-grade audio mastering.",
    iconKey: "Mic",
    sortOrder: 3,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "s5",
    title: "Motion Graphics",
    slug: "motion-graphics",
    description: "Custom animation, lower thirds, kinetic type.",
    iconKey: "Wand2",
    sortOrder: 4,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "s6",
    title: "Color Grading",
    slug: "color-grading",
    description: "Cinematic LUTs and bespoke color science.",
    iconKey: "Palette",
    sortOrder: 5,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "s7",
    title: "Commercial Ads",
    slug: "commercial-ads",
    description: "30s spots built to convert on every platform.",
    iconKey: "Megaphone",
    sortOrder: 6,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "s8",
    title: "Social Content",
    slug: "social-content",
    description: "TikTok, X, LinkedIn — native edits, native results.",
    iconKey: "Hash",
    sortOrder: 7,
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
