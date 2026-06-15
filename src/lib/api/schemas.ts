import { z } from "zod";

const mediaUrl = z
  .string()
  .trim()
  .min(1)
  .max(2048)
  .refine((value) => {
    if (value.startsWith("/")) return true;
    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  }, "Must be an HTTP(S) URL or an absolute site path");

const httpUrl = z
  .string()
  .trim()
  .url()
  .max(2048)
  .refine((value) => {
    const protocol = new URL(value).protocol;
    return protocol === "http:" || protocol === "https:";
  }, "Must be an HTTP(S) URL");

const displayFields = {
  sortOrder: z.number().int().min(0).max(100000).default(0),
  isPublished: z.boolean().default(true),
};

export const portfolioInputSchema = z.object({
  serviceId: z.string().uuid().nullable().optional(),
  title: z.string().trim().min(2).max(160),
  category: z.string().trim().min(2).max(120),
  thumbnail: mediaUrl,
  videoUrl: mediaUrl,
  description: z.string().trim().min(10).max(500),
  overview: z.string().trim().max(3000).default(""),
  techniques: z.array(z.string().trim().min(1).max(160)).max(30).default([]),
  results: z.array(z.string().trim().min(1).max(160)).max(30).default([]),
  tools: z.array(z.string().trim().min(1).max(120)).max(30).default([]),
  ...displayFields,
});

export const comparisonInputSchema = z.object({
  projectTitle: z.string().trim().min(2).max(160),
  beforeVideo: mediaUrl,
  afterVideo: mediaUrl,
  description: z.string().trim().min(10).max(1000),
  ...displayFields,
});

export const testimonialInputSchema = z.object({
  clientName: z.string().trim().min(2).max(120),
  company: z.string().trim().min(2).max(160),
  rating: z.number().int().min(1).max(5),
  review: z.string().trim().min(10).max(2000),
  profileImage: mediaUrl,
  ...displayFields,
});

export const serviceInputSchema = z.object({
  title: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().trim().min(10).max(500),
  iconKey: z.string().trim().min(2).max(80),
  sortOrder: z.number().int().min(0).max(100000).default(0),
  isActive: z.boolean().default(true),
});

export const faqInputSchema = z.object({
  question: z.string().trim().min(5).max(300),
  answer: z.string().trim().min(10).max(3000),
  ...displayFields,
});

export const contactCreateSchema = z.object({
  serviceId: z.string().uuid().nullable().optional(),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  projectType: z.enum([
    "YouTube Long-form",
    "Shorts / Reels",
    "Podcast",
    "Commercial Ad",
    "Wedding / Event",
    "Other",
  ]),
  budget: z.string().optional().default("Not Specified"),
  timeline: z.enum(["ASAP / Urgent", "1–2 Weeks", "3–4 Weeks", "Ongoing Partnership"]),
  details: z.string().trim().min(20).max(5000),
});

export const contactUpdateSchema = z
  .object({
    status: z.enum(["new", "in_progress", "resolved", "archived"]).optional(),
    adminNotes: z.string().trim().max(5000).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, "At least one field is required");

export const sampleRequestCreateSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  footageLink: httpUrl,
  message: z.string().trim().min(10).max(3000),
});

export const sampleRequestUpdateSchema = z
  .object({
    status: z
      .enum(["new", "reviewing", "in_progress", "completed", "rejected"])
      .optional(),
    adminNotes: z.string().trim().max(5000).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, "At least one field is required");

export const idSchema = z.string().uuid();

export type PortfolioInput = z.infer<typeof portfolioInputSchema>;
export type ComparisonInput = z.infer<typeof comparisonInputSchema>;
export type TestimonialInput = z.infer<typeof testimonialInputSchema>;
export type ServiceInput = z.infer<typeof serviceInputSchema>;
export type FaqInput = z.infer<typeof faqInputSchema>;
export type ContactCreateInput = z.infer<typeof contactCreateSchema>;
export type ContactUpdateInput = z.infer<typeof contactUpdateSchema>;
export type SampleRequestCreateInput = z.infer<typeof sampleRequestCreateSchema>;
export type SampleRequestUpdateInput = z.infer<typeof sampleRequestUpdateSchema>;

