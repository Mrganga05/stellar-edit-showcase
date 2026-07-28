import React from "react";

export function JsonLd() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://raqvine.com/#organization",
    "name": "Raqvine",
    "legalName": "Raqvine Creative Studio",
    "url": "https://raqvine.com",
    "logo": "https://raqvine.com/favicon.png",
    "image": "https://raqvine.com/favicon.png",
    "description":
      "Raqvine is a premium video editing agency and creative studio delivering high-retention YouTube video editing, Shorts, Reels, podcasts, motion graphics, color grading, and commercial video production.",
    "email": "hello@raqvine.com",
    "sameAs": [
      "https://youtube.com/@raqvine",
      "https://instagram.com/raqvine",
      "https://x.com/raqvine",
      "https://linkedin.com/company/raqvine"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "hello@raqvine.com",
      "availableLanguage": ["English"]
    },
    "knowsAbout": [
      "YouTube Video Editing",
      "Short-Form Video Editing",
      "Instagram Reels Editing",
      "Podcast Editing",
      "Motion Graphics",
      "Color Grading",
      "Commercial Video Ads",
      "Content Repurposing",
      "AI Video Editing"
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://raqvine.com/#website",
    "url": "https://raqvine.com",
    "name": "Raqvine",
    "description":
      "Premium Video Editing Agency for YouTubers, Content Creators & Brands.",
    "publisher": {
      "@id": "https://raqvine.com/#organization"
    },
    "inLanguage": "en-US"
  };

  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Raqvine Creative Services",
    "itemListElement": [
      {
        "@type": "Service",
        "position": 1,
        "name": "YouTube Long-Form Editing",
        "serviceType": "Video Editing",
        "description": "Retention-first YouTube editing designed to increase watch time, subscriber growth, and audience engagement.",
        "provider": { "@id": "https://raqvine.com/#organization" }
      },
      {
        "@type": "Service",
        "position": 2,
        "name": "Short-Form Video Editing (Shorts & Reels)",
        "serviceType": "Social Media Video Editing",
        "description": "High-retention vertical edits engineered to stop scrolling, maximize completion rates, and go viral on TikTok, Reels, and Shorts.",
        "provider": { "@id": "https://raqvine.com/#organization" }
      },
      {
        "@type": "Service",
        "position": 3,
        "name": "Motion Graphics & Kinetic Typography",
        "serviceType": "Visual Effects & Animation",
        "description": "Premium animations, kinetic typography, branded graphic overlays, and visual storytelling for high-end digital content.",
        "provider": { "@id": "https://raqvine.com/#organization" }
      },
      {
        "@type": "Service",
        "position": 4,
        "name": "Commercial Video Ads",
        "serviceType": "Commercial Video Production",
        "description": "High-converting ad creatives built specifically for Meta, Google, YouTube, TikTok, and direct-response campaigns.",
        "provider": { "@id": "https://raqvine.com/#organization" }
      },
      {
        "@type": "Service",
        "position": 5,
        "name": "Cinematic Color Grading & Finishing",
        "serviceType": "Post-Production",
        "description": "Luxury cinematic color grading, look development, sound design, and master audio polishing.",
        "provider": { "@id": "https://raqvine.com/#organization" }
      },
      {
        "@type": "Service",
        "position": 6,
        "name": "AI Video Editing & Workflows",
        "serviceType": "AI Video Production",
        "description": "AI-assisted editing workflows that accelerate turnaround time without sacrificing high-end creative precision.",
        "provider": { "@id": "https://raqvine.com/#organization" }
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How long does video editing take with Raqvine?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Most YouTube long-form videos ship within 48–72 hours. Shorts, Reels, and TikToks turn around in 24 hours. Larger commercial campaign work is scoped per project timeline."
        }
      },
      {
        "@type": "Question",
        "name": "Do you offer revisions on video edits?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes — every project includes unlimited revisions within scope until you are genuinely 100% satisfied with the final cut."
        }
      },
      {
        "@type": "Question",
        "name": "What raw file formats do you accept?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We accept raw camera footage, screen recordings, voiceovers, MP4, MOV, WEBM, MKV, and brand assets uploaded via direct Cloudflare R2, Frame.io, Dropbox, or Google Drive."
        }
      },
      {
        "@type": "Question",
        "name": "How does payment work for editing services?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "For project work, 50% deposit to start and 50% upon final approval delivery. Monthly retainers for ongoing creators are billed at the start of each billing cycle."
        }
      },
      {
        "@type": "Question",
        "name": "Can Raqvine handle long-form podcasts and documentary edits?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. Multi-cam podcasts, documentaries, corporate films, and 30+ minute long-form YouTube edits are a core specialty."
        }
      }
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://raqvine.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Services",
        "item": "https://raqvine.com/#services"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Portfolio",
        "item": "https://raqvine.com/#portfolio"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "FAQ",
        "item": "https://raqvine.com/#faq"
      },
      {
        "@type": "ListItem",
        "position": 5,
        "name": "Contact",
        "item": "https://raqvine.com/#contact"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
