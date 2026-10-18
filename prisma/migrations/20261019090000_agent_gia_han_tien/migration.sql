-- MÃ GIA HẠN THEO $ của CuongMini (19/10/2026): lượt cấp + yêu cầu chờ duyệt.
-- Xem src/services/agent/maGiaHanTien.ts. Viết tay: `prisma migrate dev` hỏng ở repo này (CLAUDE.md, P3006).
-- Không FK tới users (cố ý — bảng sổ). Chỉ THÊM bảng, không đụng bảng có sẵn.
CREATE TABLE "agent_gia_han_tien" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "tran" VARCHAR(60) NOT NULL,
    "ky" VARCHAR(10) NOT NULL,
    "project_id" INTEGER,
    "so_usd" DOUBLE PRECISION NOT NULL,
    "trang_thai" VARCHAR(12) NOT NULL,
    "lan_thu" INTEGER NOT NULL,
    "da_dung_usd" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tran_usd" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "phien_ban_ma" INTEGER NOT NULL DEFAULT 0,
    "cap_luc" TIMESTAMP(3),
    "nguoi_duyet_id" INTEGER,
    "ly_do_tu_choi" VARCHAR(300),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agent_gia_han_tien_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "idx_agent_gia_han_tien_user_tran" ON "agent_gia_han_tien"("user_id", "tran", "created_at");
CREATE INDEX "idx_agent_gia_han_tien_trang_thai" ON "agent_gia_han_tien"("trang_thai", "created_at");
CREATE INDEX "idx_agent_gia_han_tien_project" ON "agent_gia_han_tien"("project_id", "trang_thai");
