-- Create Services Table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  "iconKey" TEXT NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create Portfolio Projects Table
CREATE TABLE IF NOT EXISTS portfolio_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "serviceId" UUID REFERENCES services(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  thumbnail TEXT NOT NULL,
  "videoUrl" TEXT NOT NULL,
  description TEXT NOT NULL,
  overview TEXT NOT NULL DEFAULT '',
  techniques TEXT[] NOT NULL DEFAULT '{}',
  results TEXT[] NOT NULL DEFAULT '{}',
  tools TEXT[] NOT NULL DEFAULT '{}',
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "isPublished" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create Before/After Projects Table
CREATE TABLE IF NOT EXISTS before_after_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "projectTitle" TEXT NOT NULL,
  "beforeVideo" TEXT NOT NULL,
  "afterVideo" TEXT NOT NULL,
  description TEXT NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "isPublished" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "clientName" TEXT NOT NULL,
  company TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT NOT NULL,
  "profileImage" TEXT NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "isPublished" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create FAQ Table
CREATE TABLE IF NOT EXISTS faq (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "isPublished" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create Contact Requests Table
CREATE TABLE IF NOT EXISTS contact_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "serviceId" UUID REFERENCES services(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  "projectType" TEXT NOT NULL,
  budget TEXT NOT NULL,
  timeline TEXT NOT NULL,
  details TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'archived')),
  "adminNotes" TEXT NOT NULL DEFAULT '',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create Sample Edit Requests Table
CREATE TABLE IF NOT EXISTS sample_edit_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  "footageLink" TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'in_progress', 'completed', 'rejected')),
  "adminNotes" TEXT NOT NULL DEFAULT '',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -- Create hero_settings Table
CREATE TABLE IF NOT EXISTS hero_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  headline TEXT NOT NULL,
  subheadline TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE before_after_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE sample_edit_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_settings ENABLE ROW LEVEL SECURITY;

-- Create ALL permissions for public (anon role) on all tables to give admin complete rights
CREATE POLICY "Allow public full access to services" ON services
  FOR ALL TO public USING (true) WITH CHECK (true);

CREATE POLICY "Allow public full access to portfolio_projects" ON portfolio_projects
  FOR ALL TO public USING (true) WITH CHECK (true);

CREATE POLICY "Allow public full access to before_after_projects" ON before_after_projects
  FOR ALL TO public USING (true) WITH CHECK (true);

CREATE POLICY "Allow public full access to testimonials" ON testimonials
  FOR ALL TO public USING (true) WITH CHECK (true);

CREATE POLICY "Allow public full access to faq" ON faq
  FOR ALL TO public USING (true) WITH CHECK (true);

CREATE POLICY "Allow public full access to contact_requests" ON contact_requests
  FOR ALL TO public USING (true) WITH CHECK (true);

CREATE POLICY "Allow public full access to sample_edit_requests" ON sample_edit_requests
  FOR ALL TO public USING (true) WITH CHECK (true);

CREATE POLICY "Allow public full access to hero_settings" ON hero_settings
  FOR ALL TO public USING (true) WITH CHECK (true);

-- Insert Seed Data (Optional helper for initial setup)
INSERT INTO services (id, title, slug, description, "iconKey", "sortOrder", "isActive") VALUES
  ('a1e73e6a-72ef-4d6d-88f5-bfa33dbb48c2', 'Short-Form Editing', 'short-form-editing', 'High-retention vertical edits engineered to stop scrolling and maximize engagement.', 'Clapperboard', 0, true),
  ('a1e73e6a-72ef-4d6d-88f5-bfa33dbb48c1', 'Long-Form Editing', 'long-form-editing', 'Retention-first YouTube editing designed to increase watch time and audience growth.', 'Youtube', 1, true),
  ('a1e73e6a-72ef-4d6d-88f5-bfa33dbb48c5', 'Motion Graphics', 'motion-graphics', 'Premium animations, kinetic typography, branded graphics, and visual storytelling.', 'Sparkles', 2, true),
  ('a1e73e6a-72ef-4d6d-88f5-bfa33dbb48c7', 'Commercial Ads', 'commercial-ads', 'High-converting ad creatives built for Meta, Google, YouTube, and TikTok.', 'Megaphone', 3, true),
  ('a1e73e6a-72ef-4d6d-88f5-bfa33dbb48c3', 'Cinematic Editing', 'cinematic-editing', 'Luxury cinematic edits with professional color grading and premium finishing.', 'Film', 4, true),
  ('a1e73e6a-72ef-4d6d-88f5-bfa33dbb48c6', 'AI Editing', 'ai-editing', 'AI-assisted editing workflows that accelerate production without sacrificing quality.', 'Wand2', 5, true),
  ('a1e73e6a-72ef-4d6d-88f5-bfa33dbb48c9', 'Website Development', 'website-development', 'Fast, responsive, SEO-optimized websites built to convert visitors into customers.', 'Globe', 6, true),
  ('a1e73e6a-72ef-4d6d-88f5-bfa33dbb48ca', '3D Web Experiences', '3d-web-experiences', 'Immersive interactive websites powered by modern 3D technologies and smooth animations.', 'Box', 7, true),
  ('a1e73e6a-72ef-4d6d-88f5-bfa33dbb48c8', 'AI Automation', 'ai-automation', 'Automate repetitive workflows, lead management, and business operations using AI.', 'Bot', 8, true),
  ('a1e73e6a-72ef-4d6d-88f5-bfa33dbb48c4', 'AI Voice Agents', 'ai-voice-agents', '24/7 AI voice assistants for sales, customer support, bookings, and lead qualification.', 'Mic', 9, true)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  "iconKey" = EXCLUDED."iconKey",
  "sortOrder" = EXCLUDED."sortOrder";

INSERT INTO portfolio_projects (id, "serviceId", title, category, thumbnail, "videoUrl", description, overview, techniques, results, tools, "sortOrder", "isPublished") VALUES
  ('d1b11111-1111-1111-1111-111111111111', 'a1e73e6a-72ef-4d6d-88f5-bfa33dbb48c1', 'Neon Studio Vlog', 'YouTube Editing', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 'Long-form creator vlog with retention-first pacing.', 'A 14-minute creator vlog re-cut for maximum retention. Tight pacing, layered b-roll, dynamic captions and reactive sound design.', ARRAY['J/L audio cuts', 'Speed ramps', 'Punch-in zooms', 'Dynamic captions'], ARRAY['+38% average view duration', '+62% CTR via thumbnail/edit synergy', '3.4M views in 30 days'], ARRAY['Premiere Pro', 'After Effects', 'DaVinci Resolve'], 0, true),
  ('d1b11111-1111-1111-1111-111111111112', 'a1e73e6a-72ef-4d6d-88f5-bfa33dbb48c2', 'Athlete Shorts Series', 'YouTube Shorts', 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', '9 vertical edits engineered to loop and convert.', 'A series of 60-second athlete shorts built to loop. Each edit lands the hook in under 1.2s.', ARRAY['Hook stacking', 'Beat-synced cuts', 'Whip transitions', 'Kinetic text'], ARRAY['12M+ views across set', '4.1% avg engagement', '+220K subscribers'], ARRAY['Premiere Pro', 'After Effects'], 1, true),
  ('d1b11111-1111-1111-1111-111111111113', 'a1e73e6a-72ef-4d6d-88f5-bfa33dbb48c3', 'Editorial Reels', 'Instagram Reels', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', 'Fashion brand campaign cut for IG-native audiences.', 'Editorial fashion reels with cinematic grade and rhythmic typographic motion.', ARRAY['Match cuts', 'Typography animation', 'Film grain', 'LUT grading'], ARRAY['8.7M reach', '+412% follower growth in 60d'], ARRAY['Premiere Pro', 'After Effects', 'Photoshop'], 2, true),
  ('d1b11111-1111-1111-1111-111111111114', 'a1e73e6a-72ef-4d6d-88f5-bfa33dbb48c4', 'The Founders Podcast', 'Podcast Editing', 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=600', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', 'Multi-cam podcast edited for clarity and impact.', 'Full multi-cam podcast edit with broadcast-grade audio cleanup and chapter design.', ARRAY['Multi-cam switching', 'Noise reduction', 'Chapter markers', 'Lower thirds'], ARRAY['Top 50 Business podcast', 'Avg 42min listen time'], ARRAY['Premiere Pro', 'iZotope RX', 'Audition'], 3, true),
  ('d1b11111-1111-1111-1111-111111111115', 'a1e73e6a-72ef-4d6d-88f5-bfa33dbb48c7', 'Heritage Watch Ad', 'Business Commercial', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=600', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', 'Premium 30s commercial for a luxury timepiece.', 'A cinematic 30-second commercial built around macro detail and a single hero shot.', ARRAY['Macro coverage', 'Color grading', 'Sound design', 'Logo reveal'], ARRAY['+58% landing-page conversion', 'Featured in 3 industry publications'], ARRAY['DaVinci Resolve', 'After Effects'], 4, true),
  ('d1b11111-1111-1111-1111-111111111116', 'a1e73e6a-72ef-4d6d-88f5-bfa33dbb48c8', 'Coastal Villa Tour', 'Real Estate Video', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=600', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', 'Listing film for an 8-figure waterfront property.', 'Drone-led property film with twilight grade and immersive ambient mix.', ARRAY['Drone integration', 'Twilight grade', 'Stabilization', 'Ambient mix'], ARRAY['Sold in 11 days', '3x avg agent listing views'], ARRAY['Premiere Pro', 'DaVinci Resolve'], 5, true),
  ('d1b11111-1111-1111-1111-111111111117', 'a1e73e6a-72ef-4d6d-88f5-bfa33dbb48c5', 'Neon City Frags', 'Gaming Montage', 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=600', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4', 'Synced FPS montage with reactive VFX.', 'FPS highlight montage synced to a custom track with reactive glitch effects.', ARRAY['Beat sync', 'Glitch VFX', 'Killfeed compositing', 'Speed ramps'], ARRAY['2.1M YouTube views', 'Trending #14 Gaming'], ARRAY['After Effects', 'Premiere Pro'], 6, true),
  ('d1b11111-1111-1111-1111-111111111118', 'a1e73e6a-72ef-4d6d-88f5-bfa33dbb48c6', 'Golden Hour Wedding', 'Wedding Film', 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', 'Cinematic 4-minute wedding highlight film.', 'A cinematic highlight film weaving vows, ceremony and reception with golden grade.', ARRAY['Vow narration weave', 'Color grading', 'Slow-mo recovery', 'Score-led cut'], ARRAY['Client referral chain of 9 bookings'], ARRAY['DaVinci Resolve', 'Premiere Pro'], 7, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO before_after_projects (id, "projectTitle", "beforeVideo", "afterVideo", description, "sortOrder", "isPublished") VALUES
  ('b1b11111-1111-1111-1111-111111111111', 'Color Grading', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', 'Flat log footage transformed into cinematic teal-and-orange.', 0, true),
  ('b1b11111-1111-1111-1111-111111111112', 'Motion Graphics', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', 'Plain talking head elevated with kinetic typography and overlays.', 1, true),
  ('b1b11111-1111-1111-1111-111111111113', 'Sound Design', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', 'Raw camera audio mastered with FX, music and dialogue cleanup.', 2, true),
  ('b1b11111-1111-1111-1111-111111111114', 'Transitions & Pace', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4', 'Static cuts re-edited with whip, match and seamless transitions.', 3, true),
  ('b1b11111-1111-1111-1111-111111111115', 'Retention Editing', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 'Slow intro rebuilt into a hook-first sequence that holds viewers.', 4, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO testimonials (id, "clientName", company, rating, review, "profileImage", "sortOrder", "isPublished") VALUES
  ('c1b11111-1111-1111-1111-111111111111', 'Marcus Lane', 'Lane Media · 2.4M subs', 5, 'Best editor I''ve worked with — full stop. Retention jumped immediately and our channel pace doubled.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150', 0, true),
  ('c1b11111-1111-1111-1111-111111111112', 'Sofia Martinez', 'Studio Halo', 5, 'Cinematic, fast, communicative. Every deliverable felt premium and on-brand.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150', 1, true),
  ('c1b11111-1111-1111-1111-111111111113', 'Rohan Mehta', 'Founder, Northbeam', 5, 'Our ad CVR jumped 58% after switching. This is the bar for high-end video editing.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150', 2, true),
  ('c1b11111-1111-1111-1111-111111111114', 'Amara Okafor', 'Okafor & Co.', 5, 'Treated our brand film like it was their own. The grade alone was worth the price.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150', 3, true),
  ('c1b11111-1111-1111-1111-111111111115', 'David Klein', 'Klein Architecture', 5, 'Listing film closed the property in under two weeks. The drone work was unreal.', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150', 4, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO faq (id, question, answer, "sortOrder", "isPublished") VALUES
  ('f1b11111-1111-1111-1111-111111111111', 'How long does editing take?', 'Most YouTube long-forms ship within 48–72 hours. Shorts and reels turn around in 24 hours. Larger commercial work is scoped per project.', 0, true),
  ('f1b11111-1111-1111-1111-111111111112', 'Do you offer revisions?', 'Yes — every project includes unlimited revisions within scope until you''re genuinely happy with the cut.', 1, true),
  ('f1b11111-1111-1111-1111-111111111113', 'What files do you accept?', 'Raw camera footage, screen recordings, voiceovers, brand assets — uploaded via Frame.io, Dropbox, Google Drive or WeTransfer.', 2, true),
  ('f1b11111-1111-1111-1111-111111111114', 'How does payment work?', '50% to start, 50% on delivery for project work. Monthly retainers are billed at the start of each cycle. Wire, Stripe, PayPal and UPI all accepted.', 3, true),
  ('f1b11111-1111-1111-1111-111111111115', 'Can you handle long-form content?', 'Absolutely. Long-form podcasts, documentaries and 30+ minute YouTube edits are a core specialty.', 4, true)
ON CONFLICT (id) DO NOTHING;

-- Seed initial hero settings
INSERT INTO hero_settings (id, headline, subheadline) VALUES
  ('71e73e6a-72ef-4d6d-88f5-bfa33dbb48c1', 'Edits That <span class="font-display italic font-normal text-gradient-brand">Hold Attention</span> <br/> And Drive Results.', 'Raqvine transforms raw footage into cinematic, high-retention content built to move audiences, scale channels, and grow ambitious brands worldwide.')
ON CONFLICT (id) DO NOTHING;

-- Ensure storage bucket configurations exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio', 'portfolio', true) 
ON CONFLICT (id) DO NOTHING;

-- Enable storage policies for public access (Read/Write)
CREATE POLICY "Allow public select on portfolio storage" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'portfolio');

CREATE POLICY "Allow public insert on portfolio storage" ON storage.objects
  FOR INSERT TO public WITH CHECK (bucket_id = 'portfolio');

CREATE POLICY "Allow public update on portfolio storage" ON storage.objects
  FOR UPDATE TO public USING (bucket_id = 'portfolio') WITH CHECK (bucket_id = 'portfolio');

CREATE POLICY "Allow public delete on portfolio storage" ON storage.objects
  FOR DELETE TO public USING (bucket_id = 'portfolio');
