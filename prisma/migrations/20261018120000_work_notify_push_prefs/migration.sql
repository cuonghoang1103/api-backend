-- CT Work iOS (18/10/2026): công tắc đẩy theo loại + múi giờ cho giờ im lặng.
ALTER TABLE "work_notify_settings" ADD COLUMN "push_prefs" JSONB;
ALTER TABLE "work_notify_settings" ADD COLUMN "timezone" VARCHAR(64);
