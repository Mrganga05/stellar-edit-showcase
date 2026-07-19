import { supabase } from "../supabase";
import type { PostgrestError } from "@supabase/supabase-js";
import type {
  BeforeAfterProject,
  ContactInquiry,
  Faq,
  PortfolioProject,
  Service,
  SampleEditRequest,
  Testimonial,
} from "./contracts";
import type { ContactCreateInput, SampleRequestCreateInput } from "./schemas";
import { ApiClientError } from "./http";

async function handleSupabaseResponse<T>(
  promise: PromiseLike<{ data: T | null; error: PostgrestError | null }>,
): Promise<T> {
  const { data, error } = await promise;
  if (error) {
    throw new ApiClientError(400, {
      success: false,
      error: {
        code: error.code || "DATABASE_ERROR",
        message: error.message || "An error occurred while interacting with the database",
        details: error.details,
      },
    });
  }
  if (data === null) {
    throw new ApiClientError(404, {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: "The requested resource was not found",
      },
    });
  }
  return data as T;
}

export const portfolioApi = {
  list: () =>
    handleSupabaseResponse<PortfolioProject[]>(
      supabase.from("portfolio_projects").select("*").eq("isPublished", true).order("sortOrder"),
    ),
  get: (id: string) =>
    handleSupabaseResponse<PortfolioProject>(
      supabase.from("portfolio_projects").select("*").eq("id", id).single(),
    ),
};

export const comparisonApi = {
  list: () =>
    handleSupabaseResponse<BeforeAfterProject[]>(
      supabase.from("before_after_projects").select("*").eq("isPublished", true).order("sortOrder"),
    ),
};

export const testimonialApi = {
  list: () =>
    handleSupabaseResponse<Testimonial[]>(
      supabase.from("testimonials").select("*").eq("isPublished", true).order("sortOrder"),
    ),
};

export const serviceApi = {
  list: () =>
    handleSupabaseResponse<Service[]>(
      supabase.from("services").select("*").eq("isActive", true).order("sortOrder"),
    ),
};

export const faqApi = {
  list: () =>
    handleSupabaseResponse<Faq[]>(
      supabase.from("faq").select("*").eq("isPublished", true).order("sortOrder"),
    ),
};

export const contactApi = {
  create: (input: ContactCreateInput) =>
    handleSupabaseResponse<ContactInquiry>(
      supabase
        .from("contact_requests")
        .insert([
          {
            serviceId: input.serviceId,
            name: input.name,
            email: input.email,
            projectType: input.projectType,
            budget: input.budget,
            timeline: input.timeline,
            details: input.details,
          },
        ])
        .select()
        .single(),
    ),
};

export const sampleRequestApi = {
  create: (input: SampleRequestCreateInput) =>
    handleSupabaseResponse<SampleEditRequest>(
      supabase
        .from("sample_edit_requests")
        .insert([
          {
            name: input.name,
            email: input.email,
            footageLink: input.footageLink,
            message: input.message,
          },
        ])
        .select()
        .single(),
    ),
};
