import { useQuery } from "@tanstack/react-query";
import { comparisonApi, faqApi, portfolioApi, serviceApi, testimonialApi } from "./services";

export function usePortfolioProjects() {
  return useQuery({
    queryKey: ["portfolio-projects"],
    queryFn: portfolioApi.list,
    staleTime: 60_000,
  });
}

export function useComparisons() {
  return useQuery({
    queryKey: ["before-after-projects"],
    queryFn: comparisonApi.list,
    staleTime: 60_000,
  });
}

export function useTestimonials() {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: testimonialApi.list,
    staleTime: 60_000,
  });
}

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: serviceApi.list,
    staleTime: 60_000,
  });
}

export function useFaqs() {
  return useQuery({
    queryKey: ["faqs"],
    queryFn: faqApi.list,
    staleTime: 60_000,
  });
}
