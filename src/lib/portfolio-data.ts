import p1 from "@/assets/portfolio/p1.jpg";
import p2 from "@/assets/portfolio/p2.jpg";
import p3 from "@/assets/portfolio/p3.jpg";
import p4 from "@/assets/portfolio/p4.jpg";
import p5 from "@/assets/portfolio/p5.jpg";
import p6 from "@/assets/portfolio/p6.jpg";
import p7 from "@/assets/portfolio/p7.jpg";
import p8 from "@/assets/portfolio/p8.jpg";
import p9 from "@/assets/portfolio/p9.jpg";
import a1 from "@/assets/avatars/a1.jpg";
import a2 from "@/assets/avatars/a2.jpg";
import a3 from "@/assets/avatars/a3.jpg";
import a4 from "@/assets/avatars/a4.jpg";
import a5 from "@/assets/avatars/a5.jpg";

// Public sample videos (lightweight, CORS-friendly)
const V = {
  bunny: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  elephants: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  fun: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  joy: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  escape: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  meltdowns:
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  sintel: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  subaru:
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
  tears: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
};

export const HERO_VIDEO = V.subaru;

export type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  thumb: string;
  video: string;
  overview: string;
  techniques: string[];
  results: string[];
  tools: string[];
  clientName?: string;
  metric?: string;
  videoAspect?: "portrait" | "landscape";
};

export const projects: Project[] = [
  {
    id: "p1",
    title: "Neon Studio Vlog",
    category: "YouTube Editing",
    description: "Long-form creator vlog with retention-first pacing.",
    thumb: p1,
    video: V.bunny,
    overview:
      "A 14-minute creator vlog re-cut for maximum retention. Tight pacing, layered b-roll, dynamic captions and reactive sound design.",
    techniques: ["J/L audio cuts", "Speed ramps", "Punch-in zooms", "Dynamic captions"],
    results: [
      "+38% average view duration",
      "+62% CTR via thumbnail/edit synergy",
      "3.4M views in 30 days",
    ],
    tools: ["Premiere Pro", "After Effects", "DaVinci Resolve"],
    clientName: "Marcus Lane",
    metric: "3.4M Views",
  },
  {
    id: "p2",
    title: "Athlete Shorts Series",
    category: "YouTube Shorts",
    description: "9 vertical edits engineered to loop and convert.",
    thumb: p2,
    video: V.fun,
    overview:
      "A series of 60-second athlete shorts built to loop. Each edit lands the hook in under 1.2s.",
    techniques: ["Hook stacking", "Beat-synced cuts", "Whip transitions", "Kinetic text"],
    results: ["12M+ views across set", "4.1% avg engagement", "+220K subscribers"],
    tools: ["Premiere Pro", "After Effects"],
    clientName: "Lane Media",
    metric: "12M+ Views",
  },
  {
    id: "p3",
    title: "Editorial Reels",
    category: "Instagram Reels",
    description: "Fashion brand campaign cut for IG-native audiences.",
    thumb: p3,
    video: V.joy,
    overview: "Editorial fashion reels with cinematic grade and rhythmic typographic motion.",
    techniques: ["Match cuts", "Typography animation", "Film grain", "LUT grading"],
    results: ["8.7M reach", "+412% follower growth in 60d"],
    tools: ["Premiere Pro", "After Effects", "Photoshop"],
    clientName: "Studio Halo",
    metric: "8.7M Reach",
  },
  {
    id: "p4",
    title: "The Founders Podcast",
    category: "Podcast Editing",
    description: "Multi-cam podcast edited for clarity and impact.",
    thumb: p4,
    video: V.escape,
    overview: "Full multi-cam podcast edit with broadcast-grade audio cleanup and chapter design.",
    techniques: ["Multi-cam switching", "Noise reduction", "Chapter markers", "Lower thirds"],
    results: ["Top 50 Business podcast", "Avg 42min listen time"],
    tools: ["Premium Pro", "iZotope RX", "Audition"],
    clientName: "Founders Pod",
    metric: "Avg 42m",
  },
  {
    id: "p5",
    title: "Heritage Watch Ad",
    category: "Business Commercial",
    description: "Premium 30s commercial for a luxury timepiece.",
    thumb: p5,
    video: V.meltdowns,
    overview: "A cinematic 30-second commercial built around macro detail and a single hero shot.",
    techniques: ["Macro coverage", "Color grading", "Sound design", "Logo reveal"],
    results: ["+58% landing-page conversion", "Featured in 3 industry publications"],
    tools: ["DaVinci Resolve", "After Effects"],
    clientName: "Heritage Watch",
    metric: "+58% CVR",
  },
  {
    id: "p6",
    title: "Coastal Villa Tour",
    category: "Real Estate Video",
    description: "Listing film for an 8-figure waterfront property.",
    thumb: p6,
    video: V.sintel,
    overview: "Drone-led property film with twilight grade and immersive ambient mix.",
    techniques: ["Drone integration", "Twilight grade", "Stabilization", "Ambient mix"],
    results: ["Sold in 11 days", "3x avg agent listing views"],
    tools: ["Premiere Pro", "DaVinci Resolve"],
    clientName: "Klein Arch",
    metric: "Sold in 11d",
  },
  {
    id: "p7",
    title: "Neon City Frags",
    category: "Gaming Montage",
    description: "Synced FPS montage with reactive VFX.",
    thumb: p7,
    video: V.subaru,
    overview: "FPS highlight montage synced to a custom track with reactive glitch effects.",
    techniques: ["Beat sync", "Glitch VFX", "Killfeed compositing", "Speed ramps"],
    results: ["2.1M YouTube views", "Trending #14 Gaming"],
    tools: ["After Effects", "Premiere Pro"],
    clientName: "Velo Gaming",
    metric: "2.1M Views",
  },
  {
    id: "p8",
    title: "Golden Hour Wedding",
    category: "Wedding Film",
    description: "Cinematic 4-minute wedding highlight film.",
    thumb: p8,
    video: V.tears,
    overview: "A cinematic highlight film weaving vows, ceremony and reception with golden grade.",
    techniques: ["Vow narration weave", "Color grading", "Slow-mo recovery", "Score-led cut"],
    results: ["Client referral chain of 9 bookings"],
    tools: ["DaVinci Resolve", "Premiere Pro"],
    clientName: "The Smiths",
    metric: "9 Bookings",
  },
  {
    id: "p9",
    title: "Above The Clouds",
    category: "Cinematic Edit",
    description: "Travel short film with anamorphic grade.",
    thumb: p9,
    video: V.bunny,
    overview: "A short cinematic film built from one week of solo travel footage.",
    techniques: ["Anamorphic grade", "Atmospheric sound", "Long dissolves", "Narrative arc"],
    results: ["Vimeo Staff Pick", "180K organic plays"],
    tools: ["DaVinci Resolve", "Premiere Pro"],
    clientName: "Vimeo Staff",
    metric: "180K Plays",
  },
];

export const beforeAfter = [
  {
    id: "ba1",
    title: "Color Grading",
    desc: "Flat log footage transformed into cinematic teal-and-orange.",
    before: V.bunny,
    after: V.escape,
  },
  {
    id: "ba2",
    title: "Motion Graphics",
    desc: "Plain talking head elevated with kinetic typography and overlays.",
    before: V.fun,
    after: V.joy,
  },
  {
    id: "ba3",
    title: "Sound Design",
    desc: "Raw camera audio mastered with FX, music and dialogue cleanup.",
    before: V.elephants,
    after: V.meltdowns,
  },
  {
    id: "ba4",
    title: "Transitions & Pace",
    desc: "Static cuts re-edited with whip, match and seamless transitions.",
    before: V.sintel,
    after: V.subaru,
  },
  {
    id: "ba5",
    title: "Retention Editing",
    desc: "Slow intro rebuilt into a hook-first sequence that holds viewers.",
    before: V.tears,
    after: V.bunny,
  },
];

export const testimonials = [
  {
    name: "Marcus Lane",
    company: "Lane Media · 2.4M subs",
    quote:
      "Best editor I've worked with — full stop. Retention jumped immediately and our channel pace doubled.",
    avatar: a1,
    rating: 5,
  },
  {
    name: "Sofia Martinez",
    company: "Studio Halo",
    quote: "Cinematic, fast, communicative. Every deliverable felt premium and on-brand.",
    avatar: a2,
    rating: 5,
  },
  {
    name: "Rohan Mehta",
    company: "Founder, Northbeam",
    quote: "Our ad CVR jumped 58% after switching. This is the bar for high-end video editing.",
    avatar: a3,
    rating: 5,
  },
  {
    name: "Amara Okafor",
    company: "Okafor & Co.",
    quote: "Treated our brand film like it was their own. The grade alone was worth the price.",
    avatar: a4,
    rating: 5,
  },
  {
    name: "David Klein",
    company: "Klein Architecture",
    quote: "Listing film closed the property in under two weeks. The drone work was unreal.",
    avatar: a5,
    rating: 5,
  },
];

export const faqs = [
  {
    q: "How long does editing take?",
    a: "Most YouTube long-forms ship within 48–72 hours. Shorts and reels turn around in 24 hours. Larger commercial work is scoped per project.",
  },
  {
    q: "Do you offer revisions?",
    a: "Yes — every project includes unlimited revisions within scope until you're genuinely happy with the cut.",
  },
  {
    q: "What files do you accept?",
    a: "Raw camera footage, screen recordings, voiceovers, brand assets — uploaded via Frame.io, Dropbox, Google Drive or WeTransfer.",
  },
  {
    q: "How does payment work?",
    a: "50% to start, 50% on delivery for project work. Monthly retainers are billed at the start of each cycle. Wire, Stripe, PayPal and UPI all accepted.",
  },
  {
    q: "Can you handle long-form content?",
    a: "Absolutely. Long-form podcasts, documentaries and 30+ minute YouTube edits are a core specialty.",
  },
];
