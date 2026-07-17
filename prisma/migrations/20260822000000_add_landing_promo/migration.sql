-- CreateTable
CREATE TABLE "landing_promos" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(160) NOT NULL,
    "tagline" VARCHAR(255),
    "video_url" VARCHAR(500) NOT NULL,
    "poster_url" VARCHAR(500),
    "href" VARCHAR(255),
    "accent" VARCHAR(16),
    "feature_key" VARCHAR(48),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "landing_promos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_landing_promo_active_order" ON "landing_promos"("is_active", "order");
