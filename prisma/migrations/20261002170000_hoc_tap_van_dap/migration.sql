-- Huấn luyện học kỳ: vấn đáp chống học vẹt
ALTER TABLE "nhiem_vu_hoc" ADD COLUMN IF NOT EXISTS "van_dap" JSONB;
