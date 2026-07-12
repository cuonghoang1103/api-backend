-- Per-user access flag for the /music page (used in SPECIFIC mode).
ALTER TABLE "users" ADD COLUMN "music_access" BOOLEAN NOT NULL DEFAULT false;

-- Generic site-wide settings. Seeds the music access mode; default is
-- ADMIN_ONLY (only admins see the music page).
-- CreateTable
CREATE TABLE "app_settings" (
    "key" VARCHAR(100) NOT NULL,
    "value" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "app_settings_pkey" PRIMARY KEY ("key")
);

INSERT INTO "app_settings" ("key", "value", "updated_at")
VALUES ('music_access_mode', 'ADMIN_ONLY', CURRENT_TIMESTAMP)
ON CONFLICT ("key") DO NOTHING;
