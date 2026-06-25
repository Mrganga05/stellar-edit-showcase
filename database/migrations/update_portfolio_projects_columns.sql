-- Migration: Add clientName and metric to portfolio_projects table
ALTER TABLE portfolio_projects 
ADD COLUMN IF NOT EXISTS "clientName" TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS "metric" TEXT DEFAULT '';
