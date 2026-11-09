-- Quyền xem Sách gốc / tài liệu gốc (riêng tư) do admin cấp cho từng tài khoản (09/11/2026). CHỈ THÊM, không phá.
-- Viết tay + `npx prisma migrate deploy` (CLAUDE.md: `migrate dev` hỏng P3006 ở repo này).

CREATE TABLE "sach_rieng_quyen" (
    "id"         SERIAL NOT NULL,
    "user_id"    INTEGER NOT NULL,
    "cap_boi_id" INTEGER,
    "ghi_chu"    VARCHAR(200),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sach_rieng_quyen_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "sach_rieng_quyen_user_id_key" ON "sach_rieng_quyen"("user_id");
