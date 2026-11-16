-- CT Language — VÒNG QUAY MAY MẮN (16/11/2026): lượt đã quay + quà (chỉ đồ trong app). CHỈ THÊM: một bảng.
-- Viết tay (prisma migrate dev hỏng trong repo — CLAUDE.md mục Pre-Push).
CREATE TABLE "ctl_vong_quay" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "ngay" DATE NOT NULL,
    "nguon" VARCHAR(12) NOT NULL,
    "stt" SMALLINT NOT NULL DEFAULT 1,
    "qua" VARCHAR(16) NOT NULL,
    "xu" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ctl_vong_quay_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "uk_ctl_vong_quay_luot" ON "ctl_vong_quay"("user_id", "ngay", "nguon", "stt");
CREATE INDEX "idx_ctl_vong_quay_nguoi" ON "ctl_vong_quay"("user_id", "created_at");
CREATE INDEX "idx_ctl_vong_quay_moi" ON "ctl_vong_quay"("created_at");

ALTER TABLE "ctl_vong_quay" ADD CONSTRAINT "ctl_vong_quay_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
