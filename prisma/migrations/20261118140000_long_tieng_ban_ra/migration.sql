-- CT Lồng Tiếng (18/11/2026): chọn bản video xuất ra — 'ca-hai' (mặc định) | 'vi' | 'vi-goc'. Hợp đồng: docs/long-tieng-hop-dong.md mục 1.
-- Chỉ THÊM một cột có mặc định ⇒ việc cũ = 'ca-hai' (đúng hành vi trước đây).
ALTER TABLE "long_tieng_viec" ADD COLUMN "ban_ra" VARCHAR(8) NOT NULL DEFAULT 'ca-hai';
