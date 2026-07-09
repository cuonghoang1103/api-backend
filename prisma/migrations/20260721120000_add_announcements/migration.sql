-- Admin announcements ("Diễn đàn / Tin tức")
CREATE TABLE "announcements" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "body" TEXT NOT NULL,
    "category" VARCHAR(20) NOT NULL DEFAULT 'general',
    "cover_image_url" VARCHAR(500),
    "is_pinned" BOOLEAN NOT NULL DEFAULT false,
    "author_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "announcements_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "idx_announcements_pinned_created" ON "announcements"("is_pinned", "created_at");

ALTER TABLE "announcements" ADD CONSTRAINT "announcements_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
