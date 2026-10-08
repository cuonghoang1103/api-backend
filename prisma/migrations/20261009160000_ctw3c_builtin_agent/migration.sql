-- CT Work đợt 3C (09/10/2026): agent dựng sẵn (runtime BUILTIN) — trần chi phí chung của không gian.
-- CHỈ THÊM một bảng. Viết tay theo CLAUDE.md (migrate dev hỏng P3006) — áp bằng `npx prisma migrate deploy`.
-- Không khoá ngoại tới work_spaces (model WorkSpace giữ nguyên); không có dòng ⇒ mặc định an toàn trong mã.

-- CreateTable
CREATE TABLE "work_builtin_budgets" (
    "workspace_id" INTEGER NOT NULL,
    "daily_cap_usd" DECIMAL(10,4) NOT NULL DEFAULT 10,
    "run_cap_usd" DECIMAL(10,4) NOT NULL DEFAULT 2,
    "max_steps" INTEGER NOT NULL DEFAULT 12,
    "updated_by_id" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_builtin_budgets_pkey" PRIMARY KEY ("workspace_id")
);
