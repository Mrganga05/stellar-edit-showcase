-- Migration: Add videoAspect to hero_settings table
ALTER TABLE hero_settings 
ADD COLUMN IF NOT EXISTS "videoAspect" TEXT DEFAULT 'portrait';
