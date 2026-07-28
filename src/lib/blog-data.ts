export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category:
    | "Video Editing"
    | "YouTube Growth"
    | "Content Creation"
    | "Short-form Content"
    | "Editing Tips"
    | "Creator Economy"
    | "AI Video Tools";
  readTime: string;
  author: string;
  publishedAt: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
}

export const BLOG_CATEGORIES = [
  "All",
  "Video Editing",
  "YouTube Growth",
  "Content Creation",
  "Short-form Content",
  "Editing Tips",
  "Creator Economy",
  "AI Video Tools",
] as const;

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "post-1",
    slug: "youtube-retention-editing-guide",
    title: "10 Retention Editing Hacks That Doubled View Duration for 2.4M Creators",
    excerpt:
      "Learn the exact J/L cut, visual pacing, and sound design techniques top YouTubers use to keep viewers hooked past the 30-second mark.",
    content:
      "Audience retention is the single most important metric for YouTube recommendation algorithms. In this breakdown, we examine 10 proven editing techniques...",
    category: "YouTube Growth",
    readTime: "6 min read",
    author: "Raqvine Editorial",
    publishedAt: "2026-07-20",
    seoTitle: "10 Retention Editing Hacks to Double YouTube View Duration | Raqvine",
    seoDescription:
      "Discover proven retention editing techniques for YouTube: hook stacking, speed ramping, J/L audio cuts, dynamic captions, and sound design.",
    keywords: [
      "youtube retention",
      "youtube video editing",
      "video retention hacks",
      "youtube algorithm",
      "editor guide",
    ],
  },
  {
    id: "post-2",
    slug: "short-form-hooks-reels-shorts-tiktok",
    title: "How to Structure the First 1.5 Seconds of Vertical Video to Stop Scrolling",
    excerpt:
      "Anatomy of high-converting Instagram Reels and YouTube Shorts hooks. Beat-synced cuts, visual contrast, and kinetic typography tactics.",
    content:
      "Vertical video algorithms prioritize completion rate and loop count. If your hook takes longer than 1.5 seconds to land, 70% of viewers scroll away...",
    category: "Short-form Content",
    readTime: "5 min read",
    author: "Raqvine Editorial",
    publishedAt: "2026-07-15",
    seoTitle: "Anatomy of Viral Short-Form Video Hooks (Reels & Shorts) | Raqvine",
    seoDescription:
      "Learn how to edit the first 1.5 seconds of Instagram Reels and YouTube Shorts to maximize retention and loop counts.",
    keywords: [
      "shorts editing",
      "reels editing",
      "tiktok video editing",
      "short form content hooks",
      "viral video editing",
    ],
  },
  {
    id: "post-3",
    slug: "ai-video-editing-tools-workflow-2026",
    title: "AI Video Editing in 2026: Balancing Automation with Cinematic Artistry",
    excerpt:
      "How professional editing studios leverage AI speech enhancement, auto-reframing, and smart rotoscoping to accelerate client turnarounds.",
    content:
      "Artificial intelligence is transforming post-production. Here is how modern video editors combine AI automation with human creative storytelling...",
    category: "AI Video Tools",
    readTime: "7 min read",
    author: "Raqvine Editorial",
    publishedAt: "2026-07-10",
    seoTitle: "AI Video Editing Workflows & Best Tools 2026 | Raqvine Studio",
    seoDescription:
      "Explore how AI video editing tools automate transcription, color matching, and rotoscoping while preserving human creative direction.",
    keywords: [
      "ai video editing",
      "ai video tools",
      "editing workflow automation",
      "content creation ai",
      "raqvine ai",
    ],
  },
];
