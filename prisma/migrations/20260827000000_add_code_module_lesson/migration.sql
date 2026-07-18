-- Code Lab P2: NTU-style long-form lesson per module.
-- Additive only — three nullable columns on code_modules. Safe on prod:
-- existing rows get NULL (= "no lesson yet"); exercises are unaffected.

-- AlterTable
ALTER TABLE "code_modules"
  ADD COLUMN "lesson_blocks" JSONB,
  ADD COLUMN "lesson_model" VARCHAR(80),
  ADD COLUMN "lesson_generated_at" TIMESTAMP(3);
