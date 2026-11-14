-- CT Language (app iOS) — ẢNH trong bài / câu trả lời Cộng đồng (15/11/2026). docs/ct-language-app.md mục "Cộng đồng".
-- Viết tay (`migrate dev` hỏng trong repo này — P3006). CHỈ THÊM một bảng mới; không đụng bảng/dữ liệu cũ.
-- Xoá tài khoản / bài / câu trả lời ⇒ dòng ảnh xoá theo (FK CASCADE); tệp R2 do mã dọn (congDongAnh.ts).

-- CreateTable
CREATE TABLE "ctl_anh" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "bai_id" INTEGER,
    "tra_loi_id" INTEGER,
    "khoa" VARCHAR(200) NOT NULL,
    "url" TEXT NOT NULL,
    "rong" INTEGER NOT NULL,
    "cao" INTEGER NOT NULL,
    "kich_thuoc" INTEGER NOT NULL,
    "thu_tu" SMALLINT NOT NULL DEFAULT 0,
    "so_bao_cao" INTEGER NOT NULL DEFAULT 0,
    "an_luc" TIMESTAMP(3),
    "an_boi" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ctl_anh_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_ctl_anh_bai" ON "ctl_anh"("bai_id");

-- CreateIndex
CREATE INDEX "idx_ctl_anh_tra_loi" ON "ctl_anh"("tra_loi_id");

-- CreateIndex
CREATE INDEX "idx_ctl_anh_user" ON "ctl_anh"("user_id", "created_at");

-- AddForeignKey
ALTER TABLE "ctl_anh" ADD CONSTRAINT "ctl_anh_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ctl_anh" ADD CONSTRAINT "ctl_anh_bai_id_fkey" FOREIGN KEY ("bai_id") REFERENCES "ctl_bai"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ctl_anh" ADD CONSTRAINT "ctl_anh_tra_loi_id_fkey" FOREIGN KEY ("tra_loi_id") REFERENCES "ctl_tra_loi"("id") ON DELETE CASCADE ON UPDATE CASCADE;
