-- Update existing services to match the new cards
-- Card 1: Short-Form Editing (formerly Shorts Editing)
UPDATE services 
SET title = 'Short-Form Editing', 
    slug = 'short-form-editing', 
    description = 'High-retention vertical edits engineered to stop scrolling and maximize engagement.', 
    "iconKey" = 'Clapperboard', 
    "sortOrder" = 0, 
    "updatedAt" = now()
WHERE id = 'a1e73e6a-72ef-4d6d-88f5-bfa33dbb48c2' OR slug = 'shorts-editing';

-- Card 2: Long-Form Editing (formerly YouTube Editing)
UPDATE services 
SET title = 'Long-Form Editing', 
    slug = 'long-form-editing', 
    description = 'Retention-first YouTube editing designed to increase watch time and audience growth.', 
    "iconKey" = 'Youtube', 
    "sortOrder" = 1, 
    "updatedAt" = now()
WHERE id = 'a1e73e6a-72ef-4d6d-88f5-bfa33dbb48c1' OR slug = 'youtube-editing';

-- Card 3: Motion Graphics (formerly Motion Graphics)
UPDATE services 
SET title = 'Motion Graphics', 
    slug = 'motion-graphics', 
    description = 'Premium animations, kinetic typography, branded graphics, and visual storytelling.', 
    "iconKey" = 'Sparkles', 
    "sortOrder" = 2, 
    "updatedAt" = now()
WHERE id = 'a1e73e6a-72ef-4d6d-88f5-bfa33dbb48c5' OR slug = 'motion-graphics';

-- Card 4: Commercial Ads (formerly Commercial Ads)
UPDATE services 
SET title = 'Commercial Ads', 
    slug = 'commercial-ads', 
    description = 'High-converting ad creatives built for Meta, Google, YouTube, and TikTok.', 
    "iconKey" = 'Megaphone', 
    "sortOrder" = 3, 
    "updatedAt" = now()
WHERE id = 'a1e73e6a-72ef-4d6d-88f5-bfa33dbb48c7' OR slug = 'commercial-ads';

-- Card 5: Cinematic Editing (formerly Reels Editing)
UPDATE services 
SET title = 'Cinematic Editing', 
    slug = 'cinematic-editing', 
    description = 'Luxury cinematic edits with professional color grading and premium finishing.', 
    "iconKey" = 'Film', 
    "sortOrder" = 4, 
    "updatedAt" = now()
WHERE id = 'a1e73e6a-72ef-4d6d-88f5-bfa33dbb48c3' OR slug = 'reels-editing';

-- Card 6: AI Editing (formerly Color Grading)
UPDATE services 
SET title = 'AI Editing', 
    slug = 'ai-editing', 
    description = 'AI-assisted editing workflows that accelerate production without sacrificing quality.', 
    "iconKey" = 'Wand2', 
    "sortOrder" = 5, 
    "updatedAt" = now()
WHERE id = 'a1e73e6a-72ef-4d6d-88f5-bfa33dbb48c6' OR slug = 'color-grading';

-- Card 7: Website Development (New)
INSERT INTO services (id, title, slug, description, "iconKey", "sortOrder", "isActive")
VALUES ('a1e73e6a-72ef-4d6d-88f5-bfa33dbb48c9', 'Website Development', 'website-development', 'Fast, responsive, SEO-optimized websites built to convert visitors into customers.', 'Globe', 6, true)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "iconKey" = EXCLUDED."iconKey",
  "sortOrder" = EXCLUDED."sortOrder",
  "updatedAt" = now();

-- Card 8: 3D Web Experiences (New)
INSERT INTO services (id, title, slug, description, "iconKey", "sortOrder", "isActive")
VALUES ('a1e73e6a-72ef-4d6d-88f5-bfa33dbb48ca', '3D Web Experiences', '3d-web-experiences', 'Immersive interactive websites powered by modern 3D technologies and smooth animations.', 'Box', 7, true)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "iconKey" = EXCLUDED."iconKey",
  "sortOrder" = EXCLUDED."sortOrder",
  "updatedAt" = now();

-- Card 9: AI Automation (formerly Social Content)
UPDATE services 
SET title = 'AI Automation', 
    slug = 'ai-automation', 
    description = 'Automate repetitive workflows, lead management, and business operations using AI.', 
    "iconKey" = 'Bot', 
    "sortOrder" = 8, 
    "updatedAt" = now()
WHERE id = 'a1e73e6a-72ef-4d6d-88f5-bfa33dbb48c8' OR slug = 'social-content';

-- Card 10: AI Voice Agents (formerly Podcast Editing)
UPDATE services 
SET title = 'AI Voice Agents', 
    slug = 'ai-voice-agents', 
    description = '24/7 AI voice assistants for sales, customer support, bookings, and lead qualification.', 
    "iconKey" = 'Mic', 
    "sortOrder" = 9, 
    "updatedAt" = now()
WHERE id = 'a1e73e6a-72ef-4d6d-88f5-bfa33dbb48c4' OR slug = 'podcast-editing';
