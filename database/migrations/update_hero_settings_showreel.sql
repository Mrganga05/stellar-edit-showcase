-- Migration: Add showreel columns to hero_settings table
ALTER TABLE hero_settings 
ADD COLUMN IF NOT EXISTS "showreelVideoUrl" TEXT DEFAULT 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
ADD COLUMN IF NOT EXISTS "showreelTitle" TEXT DEFAULT 'Raqvine Signature Showreel',
ADD COLUMN IF NOT EXISTS "showreelDescription" TEXT DEFAULT 'A compilation of our finest edits, showcasing pacing, storytelling, sound design, and grading.';
