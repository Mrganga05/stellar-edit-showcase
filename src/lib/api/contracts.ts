export type PortfolioProject = {
  id: string;
  serviceId: string | null;
  title: string;
  category: string;
  thumbnail: string;
  videoUrl: string;
  description: string;
  overview: string;
  techniques: string[];
  results: string[];
  tools: string[];
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  clientName?: string;
  metric?: string;
};

export type BeforeAfterProject = {
  id: string;
  projectTitle: string;
  beforeVideo: string;
  afterVideo: string;
  description: string;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Testimonial = {
  id: string;
  clientName: string;
  company: string;
  rating: number;
  review: string;
  profileImage: string;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Service = {
  id: string;
  title: string;
  slug: string;
  description: string;
  iconKey: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ContactInquiry = {
  id: string;
  serviceId: string | null;
  name: string;
  email: string;
  projectType: string;
  budget: string;
  timeline: string;
  details: string;
  status: "new" | "in_progress" | "resolved" | "archived";
  adminNotes: string;
  createdAt: string;
  updatedAt: string;
};

export type SampleEditRequest = {
  id: string;
  name: string;
  email: string;
  footageLink: string;
  message: string;
  status: "new" | "reviewing" | "in_progress" | "completed" | "rejected";
  adminNotes: string;
  createdAt: string;
  updatedAt: string;
};

export type DashboardStats = {
  totalProjects: number;
  totalTestimonials: number;
  totalContactRequests: number;
  totalSampleRequests: number;
};

export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiFailure = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;
