-- Migration: Add videoAspect to portfolio_projects table
ALTER TABLE portfolio_projects 
ADD COLUMN IF NOT EXISTS "videoAspect" TEXT DEFAULT 'portrait';
