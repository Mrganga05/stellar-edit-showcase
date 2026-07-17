import useEmblaCarousel from "embla-carousel-react";
import { Star, ArrowLeft, ArrowRight, Quote, X, Sparkles, Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { testimonials as mockTestimonials } from "@/lib/portfolio-data";
import { SectionHeading } from "./primitives";
import { useTestimonials } from "@/lib/api/hooks";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const defaultAvatars = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150&q=80",
];

export function Testimonials() {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, align: "start" });
  const prev = useCallback(() => embla?.scrollPrev(), [embla]);
  const next = useCallback(() => embla?.scrollNext(), [embla]);
  const { data: dbTestimonials, isLoading, refetch } = useTestimonials();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form fields
  const [clientName, setClientName] = useState("");
  const [company, setCompany] = useState("");
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [selectedAvatarIdx, setSelectedAvatarIdx] = useState(0);
  const [customAvatarUrl, setCustomAvatarUrl] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }

    setUploadingAvatar(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("portfolio")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("portfolio").getPublicUrl(filePath);

      setCustomAvatarUrl(publicUrl);
      setSelectedAvatarIdx(-1);
      toast.success("Avatar uploaded successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to upload avatar", {
        description: err.message,
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const testimonialsToRender =
    dbTestimonials && dbTestimonials.length > 0
      ? dbTestimonials.map((t) => ({
          name: t.clientName,
          company: t.company,
          quote: t.review,
          avatar: t.profileImage,
          rating: t.rating,
        }))
      : mockTestimonials;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !company.trim() || !review.trim()) {
      toast.error("Please fill out all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const avatarUrl =
        selectedAvatarIdx === -1 ? customAvatarUrl : defaultAvatars[selectedAvatarIdx];
      if (!avatarUrl) {
        toast.error("Please select or upload an avatar image.");
        setIsSubmitting(false);
        return;
      }
      const { error } = await supabase.from("testimonials").insert([
        {
          clientName: clientName.trim(),
          company: company.trim(),
          rating,
          review: review.trim(),
          profileImage: avatarUrl,
          isPublished: true, // visible immediately
          sortOrder: testimonialsToRender.length,
        },
      ]);

      if (error) throw error;

      toast.success("Review submitted!", {
        description: "Thank you for sharing your experience!",
      });

      // Reset form
      setClientName("");
      setCompany("");
      setRating(5);
      setReview("");
      setIsModalOpen(false);

      // Refresh list
      refetch();
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to submit review", {
        description: err.message || "Database insert failed.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="testimonials"
      className="relative mx-auto max-w-[1320px] px-6 py-24 md:px-8 md:py-32"
    >
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <SectionHeading
          align="left"
          eyebrow="Client Testimonials"
          title={
            <>
              Loved by <span className="text-gradient-brand">serious creators</span>.
            </>
          }
        />
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 hover:border-[#22d3ee]/30 bg-white/5 hover:bg-[#22d3ee]/10 text-xs font-semibold px-4 h-11 text-white transition-all cursor-pointer"
          >
            <Plus className="size-3.5" />
            <span>Write a Review</span>
          </button>
          <div className="flex gap-2">
            <button
              onClick={prev}
              className="grid size-11 place-items-center rounded-full glass hover:bg-white/10"
              aria-label="Previous"
            >
              <ArrowLeft className="size-4" />
            </button>
            <button
              onClick={next}
              className="grid size-11 place-items-center rounded-full glass hover:bg-white/10"
              aria-label="Next"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
      <div ref={emblaRef} className="mt-12 overflow-hidden">
        <div className="flex gap-6">
          {isLoading && !dbTestimonials
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="min-w-0 flex-[0_0_100%] sm:flex-[0_0_60%] lg:flex-[0_0_40%]"
                >
                  <div className="h-64 animate-pulse rounded-3xl bg-surface/50 border border-white/5" />
                </div>
              ))
            : testimonialsToRender.map((t, idx) => (
                <div
                  key={idx}
                  className="min-w-0 flex-[0_0_100%] sm:flex-[0_0_60%] lg:flex-[0_0_40%]"
                >
                  <div className="flex h-full flex-col rounded-[20px] sm:rounded-3xl glass-strong p-4.5 sm:p-7">
                    <Quote className="size-5 sm:size-7 text-electric shrink-0" />
                    <p className="mt-3 sm:mt-5 text-xs sm:text-body-text text-neutral-300 leading-normal">
                      "{t.quote}"
                    </p>
                    <div className="mt-auto flex items-center gap-2.5 sm:gap-4 pt-5 sm:pt-8">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        loading="lazy"
                        width={56}
                        height={56}
                        className="size-10 sm:size-14 rounded-full object-cover border border-white/10 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-xs sm:text-base text-white">
                          {t.name}
                        </div>
                        <div className="truncate text-[10px] sm:text-sm text-muted-foreground">
                          {t.company}
                        </div>
                      </div>
                      <div className="flex gap-0.5 shrink-0">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star
                            key={i}
                            className="size-2.5 sm:size-3.5 fill-electric text-electric"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>

      {/* Write a Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#090909] p-6 shadow-2xl backdrop-blur-xl my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 z-10 grid size-10 place-items-center rounded-full border border-white/10 bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-white/10"
              type="button"
            >
              <X className="size-5" />
            </button>

            <h2 className="font-display text-2xl mb-2 flex items-center gap-2">
              <Sparkles className="size-5 text-[#22d3ee]" />
              <span>Share Your Feedback</span>
            </h2>
            <p className="text-xs text-muted-foreground mb-6">
              Let us know how your experience working with Raqvine Studio was.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5 font-bold">
                  Your Name
                </label>
                <input
                  required
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="David Dobrik"
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
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="YouTube Creator / Tech Startup"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-foreground focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric/30 transition"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5 font-bold">
                  Select Profile Avatar
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  {defaultAvatars.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedAvatarIdx(idx);
                        setCustomAvatarUrl("");
                      }}
                      className={cn(
                        "size-12 rounded-full border-2 overflow-hidden transition-all",
                        selectedAvatarIdx === idx
                          ? "border-electric scale-105 shadow-[0_0_10px_rgba(34,211,238,0.4)]"
                          : "border-transparent opacity-60 hover:opacity-100",
                      )}
                    >
                      <img
                        src={url}
                        alt={`Avatar option ${idx + 1}`}
                        className="size-full object-cover"
                      />
                    </button>
                  ))}

                  <label
                    className={cn(
                      "size-12 rounded-full border border-dashed flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-white/5 relative overflow-hidden",
                      selectedAvatarIdx === -1 && customAvatarUrl
                        ? "border-electric scale-105 shadow-[0_0_10px_rgba(34,211,238,0.4)]"
                        : "border-white/20",
                    )}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      disabled={uploadingAvatar}
                    />
                    {uploadingAvatar ? (
                      <span className="text-[10px] text-electric animate-pulse font-bold">...</span>
                    ) : customAvatarUrl ? (
                      <img
                        src={customAvatarUrl}
                        alt="Uploaded avatar"
                        className="size-full object-cover"
                      />
                    ) : (
                      <Plus className="size-5 text-muted-foreground" />
                    )}
                  </label>
                </div>
                <div className="text-[10px] text-muted-foreground mt-1.5">
                  Choose a preset or click the "+" button to upload a custom profile image.
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5 font-bold">
                  Rating
                </label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="text-muted-foreground hover:scale-110 transition-transform"
                    >
                      <Star
                        className={cn(
                          "size-6 transition-colors",
                          star <= rating ? "fill-electric text-electric" : "text-white/20",
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5 font-bold">
                  Your Review
                </label>
                <textarea
                  required
                  rows={4}
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Tell us what you liked about our collaboration, timing, and cinematic style..."
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-foreground focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric/30 transition resize-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-white/10 px-5 py-2.5 text-xs font-semibold text-muted-foreground hover:text-white hover:bg-white/5 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center rounded-xl bg-foreground px-5 py-2.5 text-xs font-semibold text-background hover:scale-[1.01] transition-transform disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "Submitting..." : "Post Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
