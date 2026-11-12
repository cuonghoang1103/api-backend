-- CT Language (app iOS) — hồ sơ học: ngôn ngữ đang học + lựa chọn làm quen + giờ nhắc. docs/ct-language-app.md.
-- Viết tay: `migrate dev` hỏng trong repo này (P3006). CHỈ THÊM bảng mới; không đụng bảng cũ.
CREATE TABLE "ctlanguage_profiles" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "active_lang" VARCHAR(4) NOT NULL,
    "langs" JSONB NOT NULL,
    "reminder" VARCHAR(5),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ctlanguage_profiles_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "uk_ctlanguage_profile_user" ON "ctlanguage_profiles"("user_id");
