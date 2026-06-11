-- Add frontend catalog details to the exercise table.
ALTER TABLE "exercises" ADD COLUMN "subcategory" TEXT;
ALTER TABLE "exercises" ADD COLUMN "trackingType" TEXT NOT NULL DEFAULT 'weight_reps';
