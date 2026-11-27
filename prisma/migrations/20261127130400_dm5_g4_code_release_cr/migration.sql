-- dm5 G4 (27/11/2026): code, phát hành, báo cáo theo vai, CR/RAID. Chỉ THÊM cột (NULL/mặc định) — an toàn khi chạy lại dữ liệu cũ.

-- D14: version freeze + git tag/SHA + CI ở SHA lúc release
ALTER TABLE "work_versions" ADD COLUMN "freeze_level" VARCHAR(8) NOT NULL DEFAULT 'NONE';
ALTER TABLE "work_versions" ADD COLUMN "git_tag" VARCHAR(100);
ALTER TABLE "work_versions" ADD COLUMN "commit_sha" VARCHAR(64);
ALTER TABLE "work_versions" ADD COLUMN "release_ci" VARCHAR(16);

-- C5: mũ vai khi ghi giờ
ALTER TABLE "work_worklogs" ADD COLUMN "hat" VARCHAR(4);

-- C7: quyết định với đầu ra AI
ALTER TABLE "work_ai_usage_logs" ADD COLUMN "decision" VARCHAR(10);

-- C8: CR có cấu trúc + CR con + checklist đồng bộ
ALTER TABLE "work_change_requests" ADD COLUMN "impact_matrix" JSONB;
ALTER TABLE "work_change_requests" ADD COLUMN "options" JSONB;
ALTER TABLE "work_change_requests" ADD COLUMN "parent_id" INTEGER;
ALTER TABLE "work_change_requests" ADD COLUMN "sync_checklist" JSONB;
CREATE INDEX "idx_work_cr_parent" ON "work_change_requests"("parent_id");
ALTER TABLE "work_change_requests" ADD CONSTRAINT "work_change_requests_parent_id_fkey"
  FOREIGN KEY ("parent_id") REFERENCES "work_change_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- C10: RAID Plan B
ALTER TABLE "work_raid_items" ADD COLUMN "contingency" TEXT;
