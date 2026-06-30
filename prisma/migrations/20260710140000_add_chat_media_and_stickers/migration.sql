-- Chat rich media (GIF/sticker) + sticker packs.
-- Additive + idempotent (safe to re-run), per project conventions.

-- 1) Message media columns (GIF / sticker payload).
ALTER TABLE "messages" ADD COLUMN IF NOT EXISTS "media_url" TEXT;
ALTER TABLE "messages" ADD COLUMN IF NOT EXISTS "media_kind" VARCHAR(12);

-- 2) Sticker packs.
CREATE TABLE IF NOT EXISTS "sticker_packs" (
    "id" SERIAL PRIMARY KEY,
    "slug" VARCHAR(60) NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "cover_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT NOW()
);

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'uk_sticker_pack_slug') THEN
        ALTER TABLE "sticker_packs" ADD CONSTRAINT "uk_sticker_pack_slug" UNIQUE("slug");
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS "idx_sticker_pack_active" ON "sticker_packs"("is_active", "sort_order");

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_sticker_pack_creator') THEN
        ALTER TABLE "sticker_packs" ADD CONSTRAINT "fk_sticker_pack_creator"
            FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL;
    END IF;
END $$;

-- 3) Stickers.
CREATE TABLE IF NOT EXISTS "stickers" (
    "id" SERIAL PRIMARY KEY,
    "pack_id" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "label" VARCHAR(80),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_sticker_pack_sort" ON "stickers"("pack_id", "sort_order");

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_sticker_pack') THEN
        ALTER TABLE "stickers" ADD CONSTRAINT "fk_sticker_pack"
            FOREIGN KEY ("pack_id") REFERENCES "sticker_packs"("id") ON DELETE CASCADE;
    END IF;
END $$;
