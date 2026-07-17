import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  Lock,
  User,
  LogOut,
  Inbox,
  Video,
  Trash2,
  Clock,
  ChevronRight,
  RefreshCw,
  Search,
  CheckCircle,
  FileText,
  Edit2,
  Plus,
  Save,
  Sparkles,
  Layers,
  X,
  Star,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Raqvine — Admin Dashboard" },
      { name: "description", content: "Secure Admin Panel for Raqvine Video Editing Studio" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [activeTab, setActiveTab] = useState<"contact" | "sample" | "portfolio" | "testimonials">(
    "contact",
  );
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Data states
  const [contacts, setContacts] = useState<any[]>([]);
  const [samples, setSamples] = useState<any[]>([]);
  const [portfolioProjects, setPortfolioProjects] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);

  // Portfolio project form states
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [savingProject, setSavingProject] = useState(false);

  const [projTitle, setProjTitle] = useState("");
  const [projCategory, setProjCategory] = useState("");
  const [projThumbnail, setProjThumbnail] = useState("");
  const [projVideoUrl, setProjVideoUrl] = useState("");
  const [projDescription, setProjDescription] = useState("");
  const [projOverview, setProjOverview] = useState("");
  const [projTechniques, setProjTechniques] = useState("");
  const [projResults, setProjResults] = useState("");
  const [projTools, setProjTools] = useState("");
  const [projSortOrder, setProjSortOrder] = useState<number>(0);
  const [projIsPublished, setProjIsPublished] = useState(true);
  const [projServiceId, setProjServiceId] = useState("");
  const [projClientName, setProjClientName] = useState("");
  const [projMetric, setProjMetric] = useState("");

  // Testimonials form states
  const [editingTestimonial, setEditingTestimonial] = useState<any | null>(null);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [savingTestimonial, setSavingTestimonial] = useState(false);
  const [testClientName, setTestClientName] = useState("");
  const [testCompany, setTestCompany] = useState("");
  const [testRating, setTestRating] = useState<number>(5);
  const [testReview, setTestReview] = useState("");
  const [testProfileImage, setTestProfileImage] = useState("");
  const [testSortOrder, setTestSortOrder] = useState<number>(0);
  const [testIsPublished, setTestIsPublished] = useState(true);

  // Upload states
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingTestimonialAvatar, setUploadingTestimonialAvatar] = useState(false);

  const handleUploadFile = async (
    file: File,
    folder: "portfolio" | "avatars",
    setUploadingState: React.Dispatch<React.SetStateAction<boolean>>,
    setUrlState: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    setUploadingState(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("portfolio")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("portfolio").getPublicUrl(filePath);

      setUrlState(publicUrl);
      toast.success("File uploaded successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to upload file", {
        description: err.message,
      });
    } finally {
      setUploadingState(false);
    }
  };

  useEffect(() => {
    const authStatus = sessionStorage.getItem("is_raqvine_admin");
    if (authStatus === "true") {
      setIsAuthenticated(true);
      fetchData();
    }
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      // Fetch contact requests
      const { data: contactData, error: contactErr } = await supabase
        .from("contact_requests")
        .select("*")
        .order("createdAt", { ascending: false });

      if (contactErr) throw contactErr;
      setContacts(contactData || []);

      // Fetch sample requests
      const { data: sampleData, error: sampleErr } = await supabase
        .from("sample_edit_requests")
        .select("*")
        .order("createdAt", { ascending: false });

      if (sampleErr) throw sampleErr;
      setSamples(sampleData || []);

      // Fetch portfolio projects
      const { data: portfolioData, error: portfolioErr } = await supabase
        .from("portfolio_projects")
        .select("*")
        .order("sortOrder", { ascending: true });

      if (portfolioErr) throw portfolioErr;
      setPortfolioProjects(portfolioData || []);

      // Fetch services for dropdowns
      const { data: serviceData, error: serviceErr } = await supabase
        .from("services")
        .select("*")
        .order("sortOrder", { ascending: true });

      if (serviceErr) throw serviceErr;
      setServices(serviceData || []);

      // Fetch testimonials
      const { data: testimonialData, error: testimonialErr } = await supabase
        .from("testimonials")
        .select("*")
        .order("sortOrder", { ascending: true });

      if (testimonialErr) throw testimonialErr;
      setTestimonials(testimonialData || []);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load requests from Supabase", {
        description: err.message || "Database fetch failed.",
      });
    } finally {
      setLoading(false);
    }
  }

  // Testimonial management functions
  function openAddTestimonialModal() {
    setEditingTestimonial(null);
    setTestClientName("");
    setTestCompany("");
    setTestRating(5);
    setTestReview("");
    setTestProfileImage(
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
    );
    setTestSortOrder(testimonials.length);
    setTestIsPublished(true);
    setIsTestimonialModalOpen(true);
  }

  function openEditTestimonialModal(t: any) {
    setEditingTestimonial(t);
    setTestClientName(t.clientName || "");
    setTestCompany(t.company || "");
    setTestRating(t.rating || 5);
    setTestReview(t.review || "");
    setTestProfileImage(t.profileImage || "");
    setTestSortOrder(t.sortOrder || 0);
    setTestIsPublished(t.isPublished !== false);
    setIsTestimonialModalOpen(true);
  }

  async function handleSaveTestimonial(e: React.FormEvent) {
    e.preventDefault();
    setSavingTestimonial(true);

    const payload = {
      clientName: testClientName,
      company: testCompany,
      rating: Number(testRating),
      review: testReview,
      profileImage:
        testProfileImage ||
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
      sortOrder: Number(testSortOrder),
      isPublished: testIsPublished,
      updatedAt: new Date().toISOString(),
    };

    try {
      if (editingTestimonial) {
        const { error } = await supabase
          .from("testimonials")
          .update(payload)
          .eq("id", editingTestimonial.id);

        if (error) throw error;
        toast.success("Testimonial updated successfully");
      } else {
        const { error } = await supabase
          .from("testimonials")
          .insert([{ ...payload, createdAt: new Date().toISOString() }]);

        if (error) throw error;
        toast.success("Testimonial added successfully");
      }
      setIsTestimonialModalOpen(false);
      fetchData();
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to save testimonial", {
        description: err.message,
      });
    } finally {
      setSavingTestimonial(false);
    }
  }

  async function deleteTestimonial(id: string) {
    if (!confirm("Are you sure you want to delete this testimonial? This action is permanent.")) {
      return;
    }

    try {
      const { error } = await supabase.from("testimonials").delete().eq("id", id);
      if (error) throw error;
      toast.success("Testimonial deleted successfully");
      fetchData();
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to delete testimonial", {
        description: err.message,
      });
    }
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (usernameInput === "9160851678" && passwordInput === "9160851678") {
      sessionStorage.setItem("is_raqvine_admin", "true");
      setIsAuthenticated(true);
      toast.success("Welcome back, Raqvine!", {
        description: "Authenticated successfully.",
      });
      fetchData();
    } else {
      toast.error("Authentication failed", {
        description: "Invalid username or password.",
      });
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("is_raqvine_admin");
    setIsAuthenticated(false);
    setUsernameInput("");
    setPasswordInput("");
    toast.info("Logged out", {
      description: "Admin session cleared.",
    });
  }

  async function updateStatus(
    table: "contact_requests" | "sample_edit_requests",
    id: string,
    newStatus: string,
  ) {
    try {
      const { error } = await supabase
        .from(table)
        .update({ status: newStatus, updatedAt: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
      toast.success("Status updated");
      fetchData();
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to update status", {
        description: err.message,
      });
    }
  }

  async function deleteRequest(table: "contact_requests" | "sample_edit_requests", id: string) {
    if (!confirm("Are you sure you want to delete this submission? This action is permanent.")) {
      return;
    }

    try {
      const { error } = await supabase.from(table).delete().eq("id", id);

      if (error) throw error;
      toast.success("Request deleted successfully");
      fetchData();
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to delete request", {
        description: err.message,
      });
    }
  }

  function openAddProjectModal() {
    setEditingProject(null);
    setProjTitle("");
    setProjCategory("YouTube Editing");
    setProjThumbnail("");
    setProjVideoUrl("");
    setProjDescription("");
    setProjOverview("");
    setProjTechniques("");
    setProjResults("");
    setProjTools("");
    setProjSortOrder(portfolioProjects.length);
    setProjIsPublished(true);
    setProjServiceId(services[0]?.id || "");
    setProjClientName("");
    setProjMetric("");
    setIsProjectModalOpen(true);
  }

  function openEditProjectModal(project: any) {
    setEditingProject(project);
    setProjTitle(project.title || "");
    setProjCategory(project.category || "");
    setProjThumbnail(project.thumbnail || "");
    setProjVideoUrl(project.videoUrl || "");
    setProjDescription(project.description || "");
    setProjOverview(project.overview || "");
    setProjTechniques(Array.isArray(project.techniques) ? project.techniques.join("\n") : "");
    setProjResults(Array.isArray(project.results) ? project.results.join("\n") : "");
    setProjTools(Array.isArray(project.tools) ? project.tools.join("\n") : "");
    setProjSortOrder(project.sortOrder || 0);
    setProjIsPublished(project.isPublished !== false);
    setProjServiceId(project.serviceId || "");
    setProjClientName(project.clientName || "");
    setProjMetric(project.metric || "");
    setIsProjectModalOpen(true);
  }

  async function handleSaveProject(e: React.FormEvent) {
    e.preventDefault();
    setSavingProject(true);

    // Parse newline-separated values
    const techniquesArr = projTechniques
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const resultsArr = projResults
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const toolsArr = projTools
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const projectPayload = {
      title: projTitle,
      category: projCategory,
      thumbnail: projThumbnail,
      videoUrl: projVideoUrl,
      description: projDescription,
      overview: projOverview,
      techniques: techniquesArr,
      results: resultsArr,
      tools: toolsArr,
      sortOrder: Number(projSortOrder),
      isPublished: projIsPublished,
      serviceId: projServiceId || null,
      updatedAt: new Date().toISOString(),
      clientName: projClientName,
      metric: projMetric,
    };

    try {
      if (editingProject) {
        const { error } = await supabase
          .from("portfolio_projects")
          .update(projectPayload)
          .eq("id", editingProject.id);

        if (error) throw error;
        toast.success("Portfolio project updated successfully");
      } else {
        const { error } = await supabase
          .from("portfolio_projects")
          .insert([{ ...projectPayload, createdAt: new Date().toISOString() }]);

        if (error) throw error;
        toast.success("New portfolio project added successfully");
      }

      setIsProjectModalOpen(false);
      fetchData();
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to save project", {
        description: err.message,
      });
    } finally {
      setSavingProject(false);
    }
  }

  async function deletePortfolioProject(id: string) {
    if (
      !confirm("Are you sure you want to delete this portfolio project? This action is permanent.")
    ) {
      return;
    }

    try {
      const { error } = await supabase.from("portfolio_projects").delete().eq("id", id);

      if (error) throw error;
      toast.success("Portfolio project deleted successfully");
      fetchData();
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to delete project", {
        description: err.message,
      });
    }
  }

  // Filtered queries
  const filteredContacts = contacts.filter(
    (c) =>
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.projectType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.details?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredSamples = samples.filter(
    (s) =>
      s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.message?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredProjects = portfolioProjects.filter(
    (p) =>
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredTestimonials = testimonials.filter(
    (t) =>
      t.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.review?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (!isAuthenticated) {
    return (
      <main className="relative grid min-h-screen place-items-center bg-background text-foreground overflow-hidden px-4">
        {/* Glow rings background */}
        <div className="absolute left-[10%] top-[10%] h-80 w-80 rounded-full bg-electric/10 blur-[130px]" />
        <div className="absolute right-[10%] bottom-[10%] h-80 w-80 rounded-full bg-violet-glow/10 blur-[130px]" />
        <div className="hero-grid absolute inset-0 opacity-25" />

        <div className="relative w-full max-w-[420px] rounded-3xl border border-white/10 bg-black/60 p-8 shadow-2xl backdrop-blur-xl">
          <div className="text-center">
            <Link to="/" className="inline-flex items-center justify-center gap-2 group mb-6">
              <span className="font-logo text-2xl tracking-widest text-white/90">
                RAQ<span className="text-gradient-brand">VINE</span>
              </span>
            </Link>
            <h1 className="font-display text-3xl leading-none">Admin Portal</h1>
            <p className="mt-2 text-sm text-muted-foreground">Sign in to manage studio inquiries</p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5">
                Admin Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 size-4 text-muted-foreground" />
                <input
                  required
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3.5 pl-11 pr-4 text-sm text-foreground focus:border-electric focus:outline-none focus:ring-2 focus:ring-electric/30 transition"
                  placeholder="Enter username"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5">
                Security Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 size-4 text-muted-foreground" />
                <input
                  required
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3.5 pl-11 pr-4 text-sm text-foreground focus:border-electric focus:outline-none focus:ring-2 focus:ring-electric/30 transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 w-full inline-flex items-center justify-center rounded-xl bg-foreground py-3.5 text-sm font-semibold text-background hover:scale-[1.01] transition-transform"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-xs text-muted-foreground hover:text-electric transition-colors"
            >
              ← Return to homepage
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Define tab headers configuration
  const tabConfig = {
    contact: {
      title: "Project Inquiries",
      desc: "Manage client submissions stored directly on Supabase.",
    },
    sample: {
      title: "Free Sample Requests",
      desc: "Manage client free sample submissions stored on Supabase.",
    },
    portfolio: {
      title: "Featured Work Manager",
      desc: "Manage the portfolio projects shown on the homepage (9:16 aspect ratio edits).",
    },
    testimonials: {
      title: "Client Testimonials",
      desc: "Manage client testimonials and reviews shown on the homepage.",
    },
  };

  return (
    <main className="relative min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-white/10 bg-black/45 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="font-logo text-xl tracking-widest text-white/90">
              RAQ<span className="text-gradient-brand">VINE</span>{" "}
              <span className="font-sans text-xs text-muted-foreground uppercase tracking-[0.22em] ml-2">
                Console
              </span>
            </Link>
            <nav className="hidden md:flex gap-4">
              <button
                onClick={() => setActiveTab("contact")}
                className={`text-sm font-medium px-3 py-1.5 rounded-lg transition ${activeTab === "contact" ? "bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                Inquiries
              </button>
              <button
                onClick={() => setActiveTab("sample")}
                className={`text-sm font-medium px-3 py-1.5 rounded-lg transition ${activeTab === "sample" ? "bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                Free Samples
              </button>
              <button
                onClick={() => setActiveTab("portfolio")}
                className={`text-sm font-medium px-3 py-1.5 rounded-lg transition ${activeTab === "portfolio" ? "bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                Featured Work
              </button>
              <button
                onClick={() => setActiveTab("testimonials")}
                className={`text-sm font-medium px-3 py-1.5 rounded-lg transition ${activeTab === "testimonials" ? "bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                Testimonials
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-xs text-muted-foreground hidden sm:block">
              Logged in as <span className="text-electric font-medium">raqvineee</span>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition"
            >
              <LogOut className="size-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        {/* Mobile Tab Nav */}
        <div className="flex gap-2 md:hidden overflow-x-auto pb-2 border-b border-white/5 scrollbar-none">
          <button
            onClick={() => setActiveTab("contact")}
            className={`whitespace-nowrap px-4 py-2.5 rounded-xl font-medium text-sm border transition ${activeTab === "contact" ? "bg-foreground text-background border-foreground" : "border-white/10 text-muted-foreground"}`}
          >
            Inquiries
          </button>
          <button
            onClick={() => setActiveTab("sample")}
            className={`whitespace-nowrap px-4 py-2.5 rounded-xl font-medium text-sm border transition ${activeTab === "sample" ? "bg-foreground text-background border-foreground" : "border-white/10 text-muted-foreground"}`}
          >
            Free Samples
          </button>
          <button
            onClick={() => setActiveTab("portfolio")}
            className={`whitespace-nowrap px-4 py-2.5 rounded-xl font-medium text-sm border transition ${activeTab === "portfolio" ? "bg-foreground text-background border-foreground" : "border-white/10 text-muted-foreground"}`}
          >
            Featured Work
          </button>
          <button
            onClick={() => setActiveTab("testimonials")}
            className={`whitespace-nowrap px-4 py-2.5 rounded-xl font-medium text-sm border transition ${activeTab === "testimonials" ? "bg-foreground text-background border-foreground" : "border-white/10 text-muted-foreground"}`}
          >
            Testimonials
          </button>
        </div>

        {/* Dashboard Title & Controls */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-4xl">{tabConfig[activeTab].title}</h1>
            <p className="text-sm text-muted-foreground mt-1">{tabConfig[activeTab].desc}</p>
          </div>

          <div className="flex gap-2 items-center">
            {activeTab === "portfolio" && (
              <button
                onClick={openAddProjectModal}
                className="inline-flex items-center gap-2 rounded-xl bg-foreground hover:scale-[1.01] text-background px-4 py-2 text-xs font-semibold transition"
              >
                <Plus className="size-4" /> Add Project
              </button>
            )}
            {activeTab === "testimonials" && (
              <button
                onClick={openAddTestimonialModal}
                className="inline-flex items-center gap-2 rounded-xl bg-foreground hover:scale-[1.01] text-background px-4 py-2 text-xs font-semibold transition cursor-pointer"
              >
                <Plus className="size-4" /> Add Testimonial
              </button>
            )}

            {/* Search Input for searchable lists */}
            <div className="relative">
              <Search className="absolute left-3.5 top-2.5 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 rounded-xl border border-white/10 bg-white/[0.03] py-2 pl-10 pr-4 text-xs text-foreground placeholder:text-muted-foreground focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric/30 transition"
              />
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchData}
              disabled={loading}
              className="grid size-9 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-muted-foreground hover:text-foreground transition disabled:opacity-50"
              aria-label="Refresh data"
            >
              <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Loading Spinner / Skeletons */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-2xl bg-surface/50 border border-white/5"
              />
            ))}
          </div>
        ) : (
          <div className="flex-1">
            {activeTab === "contact" &&
              (filteredContacts.length === 0 ? (
                <EmptyState icon={Inbox} text="No project inquiries found" />
              ) : (
                <div className="grid gap-4">
                  {filteredContacts.map((c) => (
                    <div
                      key={c.id}
                      className="rounded-2xl border border-white/8 bg-surface/40 p-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between transition-colors hover:border-white/15"
                    >
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-lg text-foreground">{c.name}</span>
                          <span className="text-muted-foreground text-sm">({c.email})</span>
                          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground bg-white/5 rounded-full px-2 py-0.5">
                            {c.projectType}
                          </span>
                        </div>
                        <p className="text-sm text-foreground/80 leading-relaxed max-w-3xl whitespace-pre-wrap">
                          {c.details}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Clock className="size-3.5 text-electric" />
                            <span>
                              Timeline: <strong>{c.timeline}</strong>
                            </span>
                          </div>
                          <div>
                            Submitted: <strong>{new Date(c.createdAt).toLocaleString()}</strong>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end md:self-start pt-2 md:pt-0">
                        {/* Status Select */}
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            Status:
                          </span>
                          <select
                            value={c.status}
                            onChange={(e) => updateStatus("contact_requests", c.id, e.target.value)}
                            className="bg-black/40 border border-white/10 rounded-lg text-xs text-foreground px-2.5 py-1.5 focus:outline-none focus:border-electric"
                          >
                            <option value="new">New</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="archived">Archived</option>
                          </select>
                        </div>
                        {/* Delete Button */}
                        <button
                          onClick={() => deleteRequest("contact_requests", c.id)}
                          className="grid size-9 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-muted-foreground hover:text-red-400 hover:border-red-400/20 transition"
                          title="Delete submission"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

            {activeTab === "sample" &&
              (filteredSamples.length === 0 ? (
                <EmptyState icon={Video} text="No sample edit requests found" />
              ) : (
                <div className="grid gap-4">
                  {filteredSamples.map((s) => (
                    <div
                      key={s.id}
                      className="rounded-2xl border border-white/8 bg-surface/40 p-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between transition-colors hover:border-white/15"
                    >
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-lg text-foreground">{s.name}</span>
                          <span className="text-muted-foreground text-sm">({s.email})</span>
                        </div>

                        {/* Footage link button/display */}
                        <div className="pt-1">
                          <a
                            href={s.footageLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-electric/10 border border-electric/25 px-3 py-2 text-xs font-semibold text-electric transition hover:bg-electric/20"
                          >
                            <Video className="size-3.5" />
                            Open Footage Link <ChevronRight className="size-3" />
                          </a>
                          <span className="ml-2 text-xs text-muted-foreground break-all">
                            {s.footageLink}
                          </span>
                        </div>

                        <p className="text-sm text-foreground/80 leading-relaxed max-w-3xl whitespace-pre-wrap">
                          {s.message}
                        </p>

                        <div className="text-xs text-muted-foreground pt-1">
                          Submitted: <strong>{new Date(s.createdAt).toLocaleString()}</strong>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end md:self-start pt-2 md:pt-0">
                        {/* Status Select */}
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            Status:
                          </span>
                          <select
                            value={s.status}
                            onChange={(e) =>
                              updateStatus("sample_edit_requests", s.id, e.target.value)
                            }
                            className="bg-black/40 border border-white/10 rounded-lg text-xs text-foreground px-2.5 py-1.5 focus:outline-none focus:border-electric"
                          >
                            <option value="new">New</option>
                            <option value="reviewing">Reviewing</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                        {/* Delete Button */}
                        <button
                          onClick={() => deleteRequest("sample_edit_requests", s.id)}
                          className="grid size-9 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-muted-foreground hover:text-red-400 hover:border-red-400/20 transition"
                          title="Delete submission"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

            {activeTab === "portfolio" &&
              (filteredProjects.length === 0 ? (
                <EmptyState icon={Video} text="No portfolio projects found" />
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {filteredProjects.map((p) => (
                    <div
                      key={p.id}
                      className="relative rounded-2xl border border-white/8 bg-surface/40 overflow-hidden flex flex-col group hover:border-white/15 transition-colors"
                    >
                      <div className="aspect-[9/16] relative bg-black">
                        <img
                          src={p.thumbnail}
                          alt={p.title}
                          className="absolute inset-0 size-full object-cover opacity-60"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
                          <span className="inline-flex items-center gap-1.5 rounded-full glass px-2.5 py-0.5 text-[9px] uppercase tracking-[0.18em] text-foreground/80">
                            {p.category}
                          </span>
                          <div className="flex gap-1.5">
                            {!p.isPublished && (
                              <span className="inline-flex items-center rounded-full bg-red-500/10 border border-red-500/25 px-2 py-0.5 text-[9px] font-medium text-red-400">
                                Draft
                              </span>
                            )}
                            {p.metric && (
                              <span className="inline-flex items-center rounded-full bg-electric/25 border border-electric/40 px-2 py-0.5 text-[9px] font-bold text-electric">
                                {p.metric}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="absolute bottom-3 left-3 right-3 z-10">
                          {p.clientName && (
                            <span className="text-[9px] font-bold uppercase tracking-wider text-electric block mb-0.5">
                              {p.clientName}
                            </span>
                          )}
                          <h3 className="font-display text-lg leading-tight text-white">
                            {p.title}
                          </h3>
                          <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                            {p.description}
                          </p>
                        </div>
                      </div>
                      <div className="p-3 flex items-center justify-between border-t border-white/5 bg-black/40 mt-auto">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                          Order: {p.sortOrder}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditProjectModal(p)}
                            className="grid size-8 place-items-center rounded-lg border border-white/10 bg-white/[0.02] text-muted-foreground hover:text-white hover:border-white/20 transition"
                            title="Edit Project"
                          >
                            <Edit2 className="size-3.5" />
                          </button>
                          <button
                            onClick={() => deletePortfolioProject(p.id)}
                            className="grid size-8 place-items-center rounded-lg border border-white/10 bg-white/[0.02] text-muted-foreground hover:text-red-400 hover:border-red-400/20 transition"
                            title="Delete Project"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

            {activeTab === "testimonials" &&
              (filteredTestimonials.length === 0 ? (
                <EmptyState icon={Star} text="No testimonials found" />
              ) : (
                <div className="grid gap-4">
                  {filteredTestimonials.map((t) => (
                    <div
                      key={t.id}
                      className="rounded-2xl border border-white/8 bg-surface/40 p-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between transition-colors hover:border-white/15"
                    >
                      <div className="space-y-3 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-lg text-foreground">
                            {t.clientName}
                          </span>
                          <span className="text-muted-foreground text-sm">({t.company})</span>
                          <div className="flex gap-0.5 ml-2">
                            {Array.from({ length: t.rating }).map((_, i) => (
                              <Star key={i} className="size-3 fill-electric text-electric" />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground ml-auto sm:ml-0">
                            Order: {t.sortOrder}
                          </span>
                        </div>
                        <p className="text-sm text-foreground/80 leading-relaxed max-w-3xl whitespace-pre-wrap">
                          "{t.review}"
                        </p>
                        <div className="flex items-center gap-2 pt-1">
                          <img
                            src={t.profileImage}
                            alt={t.clientName}
                            className="size-8 rounded-full object-cover border border-white/10"
                          />
                          <span className="text-xs text-muted-foreground break-all">
                            {t.profileImage}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end md:self-start pt-2 md:pt-0">
                        {/* Publish status toggle */}
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            Status:
                          </span>
                          <select
                            value={t.isPublished ? "published" : "draft"}
                            onChange={async (e) => {
                              try {
                                const isPub = e.target.value === "published";
                                const { error } = await supabase
                                  .from("testimonials")
                                  .update({
                                    isPublished: isPub,
                                    updatedAt: new Date().toISOString(),
                                  })
                                  .eq("id", t.id);
                                if (error) throw error;
                                toast.success("Status updated");
                                fetchData();
                              } catch (err: any) {
                                toast.error("Failed to update status", {
                                  description: err.message,
                                });
                              }
                            }}
                            className="bg-black/40 border border-white/10 rounded-lg text-xs text-foreground px-2.5 py-1.5 focus:outline-none focus:border-electric"
                          >
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                          </select>
                        </div>
                        {/* Edit Button */}
                        <button
                          onClick={() => openEditTestimonialModal(t)}
                          className="grid size-9 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-muted-foreground hover:text-white hover:border-white/20 transition cursor-pointer"
                          title="Edit review"
                        >
                          <Edit2 className="size-4" />
                        </button>
                        {/* Delete Button */}
                        <button
                          onClick={() => deleteTestimonial(t.id)}
                          className="grid size-9 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-muted-foreground hover:text-red-400 hover:border-red-400/20 transition cursor-pointer"
                          title="Delete review"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Portfolio Add/Edit Modal */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-[#090909] p-6 shadow-2xl backdrop-blur-xl my-8">
            <button
              onClick={() => setIsProjectModalOpen(false)}
              className="absolute right-4 top-4 z-10 grid size-10 place-items-center rounded-full border border-white/10 bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-white/10"
              type="button"
            >
              <X className="size-5" />
            </button>

            <h2 className="font-display text-2xl mb-6">
              {editingProject ? "Edit Portfolio Project" : "Add Portfolio Project"}
            </h2>

            <form
              onSubmit={handleSaveProject}
              className="space-y-4 max-h-[75vh] overflow-y-auto pr-2"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5">
                    Project Title
                  </label>
                  <input
                    required
                    type="text"
                    value={projTitle}
                    onChange={(e) => setProjTitle(e.target.value)}
                    placeholder="e.g. Athlete Shorts Series"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-foreground focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric/30 transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5">
                    Category
                  </label>
                  <input
                    required
                    type="text"
                    value={projCategory}
                    onChange={(e) => setProjCategory(e.target.value)}
                    placeholder="e.g. YouTube Shorts"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-foreground focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric/30 transition"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5">
                    Client / Creator Name
                  </label>
                  <input
                    type="text"
                    value={projClientName}
                    onChange={(e) => setProjClientName(e.target.value)}
                    placeholder="e.g. Marcus Lane"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-foreground focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric/30 transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5">
                    Primary Metric (Highlight Badge)
                  </label>
                  <input
                    type="text"
                    value={projMetric}
                    onChange={(e) => setProjMetric(e.target.value)}
                    placeholder="e.g. 12M+ Views"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-foreground focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric/30 transition"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5">
                    Thumbnail Image File / URL
                  </label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file)
                          handleUploadFile(
                            file,
                            "portfolio",
                            setUploadingThumbnail,
                            setProjThumbnail,
                          );
                      }}
                      className="w-full text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-foreground hover:file:bg-white/20 file:cursor-pointer"
                      disabled={uploadingThumbnail}
                    />
                    {uploadingThumbnail && (
                      <div className="text-xs text-electric animate-pulse">
                        Uploading thumbnail...
                      </div>
                    )}
                    <input
                      required
                      type="url"
                      value={projThumbnail}
                      onChange={(e) => setProjThumbnail(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-foreground focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric/30 transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5">
                    Video File / URL
                  </label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file)
                          handleUploadFile(file, "portfolio", setUploadingVideo, setProjVideoUrl);
                      }}
                      className="w-full text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-foreground hover:file:bg-white/20 file:cursor-pointer"
                      disabled={uploadingVideo}
                    />
                    {uploadingVideo && (
                      <div className="text-xs text-electric animate-pulse">Uploading video...</div>
                    )}
                    <input
                      required
                      type="url"
                      value={projVideoUrl}
                      onChange={(e) => setProjVideoUrl(e.target.value)}
                      placeholder="https://commondatastorage.googleapis.com/..."
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-foreground focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric/30 transition"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5">
                  Short Card Description
                </label>
                <input
                  required
                  type="text"
                  value={projDescription}
                  onChange={(e) => setProjDescription(e.target.value)}
                  placeholder="Brief 1-sentence description for the listing card."
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-foreground focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric/30 transition"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5">
                  Overview / Details (Popup)
                </label>
                <textarea
                  required
                  value={projOverview}
                  onChange={(e) => setProjOverview(e.target.value)}
                  placeholder="Detailed explanation of the project context and problem solved."
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-foreground focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric/30 transition"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5">
                    Techniques (One per line)
                  </label>
                  <textarea
                    value={projTechniques}
                    onChange={(e) => setProjTechniques(e.target.value)}
                    placeholder="Hook stacking&#10;Beat-synced cuts&#10;Kinetic text"
                    rows={4}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-foreground focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric/30 transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5">
                    Results (One per line)
                  </label>
                  <textarea
                    value={projResults}
                    onChange={(e) => setProjResults(e.target.value)}
                    placeholder="12M+ views&#10;+220K subscribers"
                    rows={4}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-foreground focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric/30 transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5">
                    Tools (One per line)
                  </label>
                  <textarea
                    value={projTools}
                    onChange={(e) => setProjTools(e.target.value)}
                    placeholder="Premiere Pro&#10;After Effects"
                    rows={4}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-foreground focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric/30 transition"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 items-center pt-2">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={projSortOrder}
                    onChange={(e) => setProjSortOrder(Number(e.target.value))}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-foreground focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric/30 transition"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5">
                    Link to Service
                  </label>
                  <select
                    value={projServiceId}
                    onChange={(e) => setProjServiceId(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black p-3 text-sm text-foreground focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric/30 transition"
                  >
                    <option value="">None / Unlinked</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 h-full pt-5">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={projIsPublished}
                    onChange={(e) => setProjIsPublished(e.target.checked)}
                    className="size-4 rounded border-white/10 bg-white/[0.03] text-electric focus:ring-electric"
                  />
                  <label
                    htmlFor="isPublished"
                    className="text-xs uppercase tracking-wider text-muted-foreground select-none cursor-pointer"
                  >
                    Published
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="rounded-xl border border-white/10 px-5 py-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProject}
                  className="inline-flex items-center justify-center rounded-xl bg-foreground px-5 py-2.5 text-xs font-semibold text-background hover:scale-[1.01] transition-transform disabled:opacity-50"
                >
                  {savingProject ? "Saving..." : "Save Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Testimonial Add/Edit Modal */}
      {isTestimonialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#090909] p-6 shadow-2xl backdrop-blur-xl my-8">
            <button
              onClick={() => setIsTestimonialModalOpen(false)}
              className="absolute right-4 top-4 z-10 grid size-10 place-items-center rounded-full border border-white/10 bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-white/10"
              type="button"
            >
              <X className="size-5" />
            </button>

            <h2 className="font-display text-2xl mb-6">
              {editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}
            </h2>

            <form onSubmit={handleSaveTestimonial} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5 font-bold">
                  Client Name
                </label>
                <input
                  required
                  type="text"
                  value={testClientName}
                  onChange={(e) => setTestClientName(e.target.value)}
                  placeholder="e.g. David Dobrik"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-foreground focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric/30 transition"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5 font-bold">
                  Company / Platform
                </label>
                <input
                  required
                  type="text"
                  value={testCompany}
                  onChange={(e) => setTestCompany(e.target.value)}
                  placeholder="e.g. YouTube Creator"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-foreground focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric/30 transition"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5 font-bold">
                  Profile Image File / URL
                </label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file)
                        handleUploadFile(
                          file,
                          "avatars",
                          setUploadingTestimonialAvatar,
                          setTestProfileImage,
                        );
                    }}
                    className="w-full text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-foreground hover:file:bg-white/20 file:cursor-pointer"
                    disabled={uploadingTestimonialAvatar}
                  />
                  {uploadingTestimonialAvatar && (
                    <div className="text-xs text-electric animate-pulse">Uploading avatar...</div>
                  )}
                  <input
                    required
                    type="url"
                    value={testProfileImage}
                    onChange={(e) => setTestProfileImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-foreground focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric/30 transition"
                  />
                </div>
              </div>

              <div className="grid gap-4 grid-cols-2">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5 font-bold">
                    Rating (1-5)
                  </label>
                  <input
                    required
                    type="number"
                    min={1}
                    max={5}
                    value={testRating}
                    onChange={(e) => setTestRating(Number(e.target.value))}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-foreground focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric/30 transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5 font-bold">
                    Sort Order
                  </label>
                  <input
                    required
                    type="number"
                    value={testSortOrder}
                    onChange={(e) => setTestSortOrder(Number(e.target.value))}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-foreground focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric/30 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5 font-bold">
                  Review Text
                </label>
                <textarea
                  required
                  rows={4}
                  value={testReview}
                  onChange={(e) => setTestReview(e.target.value)}
                  placeholder="Collaborated on 10+ projects. Absolute standard..."
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-foreground focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric/30 transition resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="testIsPublished"
                  checked={testIsPublished}
                  onChange={(e) => setTestIsPublished(e.target.checked)}
                  className="size-4 rounded border-white/10 bg-white/[0.03] text-electric focus:ring-electric"
                />
                <label
                  htmlFor="testIsPublished"
                  className="text-xs uppercase tracking-wider text-muted-foreground select-none cursor-pointer"
                >
                  Published
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsTestimonialModalOpen(false)}
                  className="rounded-xl border border-white/10 px-5 py-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingTestimonial}
                  className="inline-flex items-center justify-center rounded-xl bg-foreground px-5 py-2.5 text-xs font-semibold text-background hover:scale-[1.01] transition-transform disabled:opacity-50 cursor-pointer"
                >
                  {savingTestimonial ? "Saving..." : "Save Testimonial"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

function EmptyState({ icon: Icon, text }: { icon: React.ComponentType<any>; text: string }) {
  return (
    <div className="rounded-3xl border border-white/5 bg-surface/20 py-20 px-4 flex flex-col items-center justify-center text-center">
      <div className="grid size-14 place-items-center rounded-2xl bg-white/[0.02] border border-white/5 text-muted-foreground mb-4">
        <Icon className="size-6" />
      </div>
      <h3 className="font-semibold text-lg text-foreground">{text}</h3>
      <p className="text-sm text-muted-foreground mt-1.5 max-w-xs">
        When items are configured in your Supabase backend, they will show up here.
      </p>
    </div>
  );
}
