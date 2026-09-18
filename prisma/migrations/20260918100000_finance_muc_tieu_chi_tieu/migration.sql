-- Mục tiêu CHI TIÊU theo kỳ (ngày/tuần/tháng).
--
-- Khác `expense_categories.monthly_budget` (trần cho MỘT nhóm chi): đây là
-- trần cho TỔNG chi trong kỳ — thứ người dùng theo dõi hằng ngày, và là con
-- số lời nhắc 20h đem ra so.
--
-- Viết tay + IF NOT EXISTS: `prisma migrate dev` hỏng sẵn trong kho này
-- (P3006 vì migration 20260706130000), nên mọi migration đi `migrate deploy`
-- và phải chạy lại được nhiều lần mà không vỡ.
CREATE TABLE IF NOT EXISTS "finance_spending_goals" (
    "id"         SERIAL PRIMARY KEY,
    "user_id"    INTEGER NOT NULL,
    "period"     VARCHAR(8) NOT NULL,
    "amount"     DECIMAL(18,2) NOT NULL,
    "is_active"  BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- Một người MỘT mục tiêu cho mỗi kỳ. Không có ràng buộc này thì bấm lưu hai
-- lần đẻ ra hai hàng, và `findFirst` lúc nhắc 20h lấy trúng hàng cũ.
CREATE UNIQUE INDEX IF NOT EXISTS "uk_fin_goal_user_period"
    ON "finance_spending_goals" ("user_id", "period");
