-- Migration: Add video metadata and thumbnail columns to portfolio_projects and hero_settings
ALTER TABLE portfolio_projects 
ADD COLUMN IF NOT EXISTS "duration" NUMERIC,
ADD COLUMN IF NOT EXISTS "resolution" TEXT,
ADD COLUMN IF NOT EXISTS "fileSize" BIGINT;

ALTER TABLE hero_settings 
ADD COLUMN IF NOT EXISTS "thumbnailUrl" TEXT,
ADD COLUMN IF NOT EXISTS "duration" NUMERIC,
ADD COLUMN IF NOT EXISTS "resolution" TEXT,
ADD COLUMN IF NOT EXISTS "fileSize" BIGINT;
