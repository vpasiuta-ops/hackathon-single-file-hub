-- Add new fields to hackathons table for extended form functionality

-- Add new columns for the enhanced hackathon form
ALTER TABLE hackathons ADD COLUMN IF NOT EXISTS prize_fund TEXT;
ALTER TABLE hackathons ADD COLUMN IF NOT EXISTS timeline JSONB DEFAULT '[]'::jsonb;
ALTER TABLE hackathons ADD COLUMN IF NOT EXISTS prizes JSONB DEFAULT '[]'::jsonb;
ALTER TABLE hackathons ADD COLUMN IF NOT EXISTS partner_cases JSONB DEFAULT '[]'::jsonb;
ALTER TABLE hackathons ADD COLUMN IF NOT EXISTS evaluation_criteria JSONB DEFAULT '[]'::jsonb;
ALTER TABLE hackathons ADD COLUMN IF NOT EXISTS rules_and_requirements TEXT;
ALTER TABLE hackathons ADD COLUMN IF NOT EXISTS partners JSONB DEFAULT '[]'::jsonb;
ALTER TABLE hackathons ADD COLUMN IF NOT EXISTS jury JSONB DEFAULT '[]'::jsonb;

-- Update status to include the new options from the design
ALTER TABLE hackathons ALTER COLUMN status SET DEFAULT 'Чернетка';