-- Huấn luyện học kỳ: giờ học dự kiến + dấu đã nhắc (docs/hoc-tap-coach-plan.md)
ALTER TABLE "nhiem_vu_hoc" ADD COLUMN "gio_bat_dau" TIMESTAMP(3);
ALTER TABLE "nhiem_vu_hoc" ADD COLUMN "da_nhac_luc" TIMESTAMP(3);
ALTER TABLE "nhiem_vu_hoc" ADD COLUMN "da_bao_tre_luc" TIMESTAMP(3);
CREATE INDEX "idx_nhiem_vu_hoc_user_gio" ON "nhiem_vu_hoc"("user_id", "gio_bat_dau");
