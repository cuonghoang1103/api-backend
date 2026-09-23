-- CT Work: đính kèm bằng chứng (ảnh chụp…) vào một lần chạy test. Chỉ thêm cột có thể null.

-- AlterTable
ALTER TABLE "work_attachments" ADD COLUMN     "run_id" INTEGER;

-- CreateIndex
CREATE INDEX "idx_work_attachment_run" ON "work_attachments"("run_id");

-- AddForeignKey
ALTER TABLE "work_attachments" ADD CONSTRAINT "work_attachments_run_id_fkey" FOREIGN KEY ("run_id") REFERENCES "work_test_runs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
