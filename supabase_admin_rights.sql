-- Create hero_settings table
CREATE TABLE IF NOT EXISTS hero_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  headline TEXT NOT NULL,
  subheadline TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on hero_settings
ALTER TABLE hero_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to prevent conflicts
DROP POLICY IF EXISTS "Allow public read access to active services" ON services;
DROP POLICY IF EXISTS "Allow authenticated full access to services" ON services;
DROP POLICY IF EXISTS "Allow public full access to services" ON services;

DROP POLICY IF EXISTS "Allow public read access to published portfolio projects" ON portfolio_projects;
DROP POLICY IF EXISTS "Allow authenticated full access to portfolio projects" ON portfolio_projects;
DROP POLICY IF EXISTS "Allow public full access to portfolio_projects" ON portfolio_projects;

DROP POLICY IF EXISTS "Allow public read access to published before/after projects" ON before_after_projects;
DROP POLICY IF EXISTS "Allow authenticated full access to before/after projects" ON before_after_projects;
DROP POLICY IF EXISTS "Allow public full access to before_after_projects" ON before_after_projects;

DROP POLICY IF EXISTS "Allow public read access to published testimonials" ON testimonials;
DROP POLICY IF EXISTS "Allow authenticated full access to testimonials" ON testimonials;
DROP POLICY IF EXISTS "Allow public full access to testimonials" ON testimonials;

DROP POLICY IF EXISTS "Allow public read access to published faq" ON faq;
DROP POLICY IF EXISTS "Allow authenticated full access to faq" ON faq;
DROP POLICY IF EXISTS "Allow public full access to faq" ON faq;

DROP POLICY IF EXISTS "Allow public insert access for contact requests" ON contact_requests;
DROP POLICY IF EXISTS "Allow public select access for contact requests" ON contact_requests;
DROP POLICY IF EXISTS "Allow public delete access for contact requests" ON contact_requests;
DROP POLICY IF EXISTS "Allow public update access for contact requests" ON contact_requests;
DROP POLICY IF EXISTS "Allow authenticated select/update/delete for contact requests" ON contact_requests;
DROP POLICY IF EXISTS "Allow public full access to contact_requests" ON contact_requests;

DROP POLICY IF EXISTS "Allow public insert access for sample edit requests" ON sample_edit_requests;
DROP POLICY IF EXISTS "Allow public select access for sample edit requests" ON sample_edit_requests;
DROP POLICY IF EXISTS "Allow public delete access for sample edit requests" ON sample_edit_requests;
DROP POLICY IF EXISTS "Allow public update access for sample edit requests" ON sample_edit_requests;
DROP POLICY IF EXISTS "Allow authenticated select/update/delete for sample edit requests" ON sample_edit_requests;
DROP POLICY IF EXISTS "Allow public full access to sample_edit_requests" ON sample_edit_requests;

DROP POLICY IF EXISTS "Allow public full access to hero_settings" ON hero_settings;

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

-- Seed initial hero settings
INSERT INTO hero_settings (id, headline, subheadline) VALUES
  ('71e73e6a-72ef-4d6d-88f5-bfa33dbb48c1', 'Edits That <span class="font-display italic font-normal text-gradient-brand">Hold Attention</span> <br/> And Drive Results.', 'Raqvine transforms raw footage into cinematic, high-retention content built to move audiences, scale channels, and grow ambitious brands worldwide.')
ON CONFLICT (id) DO NOTHING;
