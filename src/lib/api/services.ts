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
  create: async (input: ContactCreateInput): Promise<ContactInquiry> => {
    const { data, error } = await supabase
      .from("contact_requests")
      .insert([
        {
          serviceId: input.serviceId,
          name: input.name,
          email: input.email,
          phone: input.phone,
          projectType: input.projectType,
          budget: input.budget,
          timeline: input.timeline,
          details: input.details,
        },
      ])
      .select()
      .single();

    if (!error && data) {
      return data as ContactInquiry;
    }

    // Fallback if the 'phone' column has not been added to the remote Supabase database yet
    if (error && (error.message?.includes("phone") || error.code === "PGRST204" || error.code === "PGRST202")) {
      const fallbackDetails = `[Phone: ${input.phone}]\n\n${input.details}`;
      const { data: fbData, error: fbError } = await supabase
        .from("contact_requests")
        .insert([
          {
            serviceId: input.serviceId,
            name: input.name,
            email: input.email,
            projectType: input.projectType,
            budget: input.budget,
            timeline: input.timeline,
            details: fallbackDetails,
          },
        ])
        .select()
        .single();

      if (fbError) {
        throw new ApiClientError(400, {
          success: false,
          error: {
            code: fbError.code || "DATABASE_ERROR",
            message: fbError.message || "An error occurred while submitting request",
            details: fbError.details,
          },
        });
      }
      return { ...fbData, phone: input.phone } as ContactInquiry;
    }

    throw new ApiClientError(400, {
      success: false,
      error: {
        code: error?.code || "DATABASE_ERROR",
        message: error?.message || "An error occurred while submitting request",
        details: error?.details,
      },
    });
  },
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
