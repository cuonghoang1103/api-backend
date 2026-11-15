-- 15/11/2026: sổ dùng giọng ElevenLabs (robot Odin + web) — thống kê admin + trần Pro/ngày.
CREATE TABLE "giong_el_dung" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER,
    "viec" VARCHAR(20) NOT NULL,
    "ky_tu" INTEGER NOT NULL,
    "credit" INTEGER NOT NULL DEFAULT 0,
    "cache" BOOLEAN NOT NULL DEFAULT false,
    "ms" INTEGER NOT NULL DEFAULT 0,
    "ok" BOOLEAN NOT NULL DEFAULT true,
    "loi" VARCHAR(200),

    CONSTRAINT "giong_el_dung_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "giong_el_dung_created_at_idx" ON "giong_el_dung"("created_at");
CREATE INDEX "giong_el_dung_user_id_created_at_idx" ON "giong_el_dung"("user_id", "created_at");
CREATE INDEX "giong_el_dung_viec_created_at_idx" ON "giong_el_dung"("viec", "created_at");
