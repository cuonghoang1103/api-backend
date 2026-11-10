-- Tác vụ đã lên lịch của AI Chat (/chat → Tác vụ đã lên lịch). Viết tay: `migrate dev` hỏng trong repo này (P3006).
CREATE TABLE "chat_tac_vu" (
    "id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "ten" VARCHAR(120) NOT NULL,
    "mau" VARCHAR(40) NOT NULL,
    "chu_de" VARCHAR(200),
    "loi_nhac" TEXT NOT NULL,
    "lich" VARCHAR(10) NOT NULL,
    "gio" INTEGER NOT NULL,
    "thu" INTEGER,
    "bat" BOOLEAN NOT NULL DEFAULT true,
    "session_id" TEXT,
    "lan_toi" TIMESTAMP(3) NOT NULL,
    "lan_cuoi" TIMESTAMP(3),
    "loi_cuoi" VARCHAR(300),
    "so_lan" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chat_tac_vu_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "chat_tac_vu_bat_lan_toi_idx" ON "chat_tac_vu"("bat", "lan_toi");
CREATE INDEX "chat_tac_vu_user_id_idx" ON "chat_tac_vu"("user_id");

ALTER TABLE "chat_tac_vu" ADD CONSTRAINT "chat_tac_vu_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
