-- ═══════════════════════════════════════════════════════════════════
-- Ví điểm · Gói Pro trả phí · Chuyển khoản đối soát · Đổi key hỏng
-- 13/09/2026
--
-- Viết TAY, không qua `prisma migrate dev`: migration
-- 20260706130000_add_music_and_profile không replay được trên shadow DB
-- (P3006 — xem CLAUDE.md). Áp bằng `npx prisma migrate deploy`.
--
-- Toàn bộ file này là THÊM MỚI: 9 bảng mới + 3 cột thêm vào shop_orders.
-- Không xoá, không đổi kiểu, không đụng dữ liệu cũ → chạy lại an toàn.
-- ═══════════════════════════════════════════════════════════════════

-- CreateTable
CREATE TABLE IF NOT EXISTS "point_accounts" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "total_earned" INTEGER NOT NULL DEFAULT 0,
    "total_spent" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "point_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "point_transactions" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "balance_after" INTEGER NOT NULL,
    "kind" VARCHAR(24) NOT NULL,
    "ref_kind" VARCHAR(24),
    "ref_id" INTEGER,
    "description" VARCHAR(255) NOT NULL,
    "idempotency_key" VARCHAR(120),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "point_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "point_topup_tiers" (
    "id" SERIAL NOT NULL,
    "amount_vnd" INTEGER NOT NULL,
    "bonus_percent" INTEGER NOT NULL DEFAULT 0,
    "label" VARCHAR(80),
    "popular" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "point_topup_tiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "point_topup_orders" (
    "id" SERIAL NOT NULL,
    "orderCode" VARCHAR(50) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "amount_vnd" INTEGER NOT NULL,
    "base_points" INTEGER NOT NULL,
    "bonus_points" INTEGER NOT NULL DEFAULT 0,
    "total_points" INTEGER NOT NULL,
    "bonus_percent" INTEGER NOT NULL DEFAULT 0,
    "status" VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    "payment_method" VARCHAR(30) NOT NULL DEFAULT 'PAYOS',
    "payment_id" VARCHAR(120),
    "paid_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "idempotency_key" VARCHAR(64),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "point_topup_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "pro_plans" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(30) NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "months" INTEGER NOT NULL,
    "price_vnd" INTEGER NOT NULL,
    "original_price_vnd" INTEGER,
    "description" TEXT,
    "badge" VARCHAR(40),
    "popular" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pro_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "pro_subscription_orders" (
    "id" SERIAL NOT NULL,
    "orderCode" VARCHAR(50) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "plan_id" INTEGER,
    "plan_code" VARCHAR(30) NOT NULL,
    "plan_name" VARCHAR(120) NOT NULL,
    "months" INTEGER NOT NULL,
    "amount_vnd" INTEGER NOT NULL,
    "points_used" INTEGER NOT NULL DEFAULT 0,
    "status" VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    "payment_method" VARCHAR(30) NOT NULL DEFAULT 'POINTS',
    "payment_id" VARCHAR(120),
    "paid_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "granted_days" INTEGER,
    "granted" BOOLEAN NOT NULL DEFAULT false,
    "idempotency_key" VARCHAR(64),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pro_subscription_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "payment_settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "bank_transfer_enabled" BOOLEAN NOT NULL DEFAULT false,
    "bank_bin" VARCHAR(20),
    "bank_name" VARCHAR(120),
    "bank_account_no" VARCHAR(40),
    "bank_account_name" VARCHAR(120),
    "transfer_ttl_minutes" INTEGER NOT NULL DEFAULT 60,
    "note" TEXT,
    "updated_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "bank_transfer_payments" (
    "id" SERIAL NOT NULL,
    "ref_code" VARCHAR(40) NOT NULL,
    "order_kind" VARCHAR(20) NOT NULL,
    "order_id" INTEGER NOT NULL,
    "order_code" VARCHAR(50) NOT NULL,
    "user_id" INTEGER,
    "amount_vnd" INTEGER NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'AWAITING',
    "proof_url" VARCHAR(500),
    "buyer_note" VARCHAR(500),
    "admin_note" VARCHAR(500),
    "confirmed_by" INTEGER,
    "confirmed_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bank_transfer_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "product_key_replacement_requests" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "order_id" INTEGER NOT NULL,
    "order_item_id" INTEGER NOT NULL,
    "order_code" VARCHAR(50) NOT NULL,
    "product_name" VARCHAR(255) NOT NULL,
    "reason" TEXT NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    "old_key_id" INTEGER,
    "new_key_id" INTEGER,
    "admin_note" VARCHAR(500),
    "resolved_by" INTEGER,
    "resolved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_key_replacement_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "uk_point_account_user" ON "point_accounts"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "uk_point_tx_idem" ON "point_transactions"("idempotency_key");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "idx_point_tx_user_created" ON "point_transactions"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "idx_point_tx_ref" ON "point_transactions"("ref_kind", "ref_id");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "uk_topup_order_code" ON "point_topup_orders"("orderCode");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "idx_topup_user_status" ON "point_topup_orders"("user_id", "status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "idx_topup_status_created" ON "point_topup_orders"("status", "created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "point_topup_orders_user_id_idempotency_key_key" ON "point_topup_orders"("user_id", "idempotency_key");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "uk_pro_plan_code" ON "pro_plans"("code");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "uk_pro_order_code" ON "pro_subscription_orders"("orderCode");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "idx_pro_order_user_status" ON "pro_subscription_orders"("user_id", "status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "idx_pro_order_status_created" ON "pro_subscription_orders"("status", "created_at" DESC);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "idx_pro_order_plan" ON "pro_subscription_orders"("plan_id");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "pro_subscription_orders_user_id_idempotency_key_key" ON "pro_subscription_orders"("user_id", "idempotency_key");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "uk_bank_transfer_ref" ON "bank_transfer_payments"("ref_code");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "idx_bank_transfer_status_created" ON "bank_transfer_payments"("status", "created_at" DESC);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "idx_bank_transfer_order" ON "bank_transfer_payments"("order_kind", "order_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "idx_bank_transfer_user" ON "bank_transfer_payments"("user_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "idx_key_repl_status_created" ON "product_key_replacement_requests"("status", "created_at" DESC);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "idx_key_repl_user" ON "product_key_replacement_requests"("user_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "idx_key_repl_item" ON "product_key_replacement_requests"("order_item_id");

-- AddForeignKey
DO $$ BEGIN
    ALTER TABLE "point_accounts" ADD CONSTRAINT "point_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$ BEGIN
    ALTER TABLE "point_transactions" ADD CONSTRAINT "point_transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$ BEGIN
    ALTER TABLE "point_topup_orders" ADD CONSTRAINT "point_topup_orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$ BEGIN
    ALTER TABLE "pro_subscription_orders" ADD CONSTRAINT "pro_subscription_orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$ BEGIN
    ALTER TABLE "pro_subscription_orders" ADD CONSTRAINT "pro_subscription_orders_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "pro_plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$ BEGIN
    ALTER TABLE "product_key_replacement_requests" ADD CONSTRAINT "product_key_replacement_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$ BEGIN
    ALTER TABLE "product_key_replacement_requests" ADD CONSTRAINT "product_key_replacement_requests_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "shop_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ═══════════════════════════════════════════════════════════════════
-- shop_orders — 3 cột mới
--   points_used     : điểm đã trừ từ ví cho đơn này
--   expires_at      : đơn chưa trả quá hạn thì không cho trả nữa
--   idempotency_key : chặn double-click đẻ ra hai đơn
-- ═══════════════════════════════════════════════════════════════════

ALTER TABLE "shop_orders" ADD COLUMN IF NOT EXISTS "points_used" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "shop_orders" ADD COLUMN IF NOT EXISTS "expires_at" TIMESTAMP(3);
ALTER TABLE "shop_orders" ADD COLUMN IF NOT EXISTS "idempotency_key" VARCHAR(64);

-- UNIQUE (user_id, idempotency_key): Postgres coi mọi NULL là khác nhau,
-- nên đơn cũ (cả hai cột NULL) và đơn khách vãng lai không đụng nhau.
CREATE UNIQUE INDEX IF NOT EXISTS "shop_orders_user_id_idempotency_key_key"
  ON "shop_orders"("user_id", "idempotency_key");

CREATE INDEX IF NOT EXISTS "idx_orders_status_created"
  ON "shop_orders"("status", "created_at" DESC);


-- ═══════════════════════════════════════════════════════════════════
-- Dữ liệu khởi tạo — ON CONFLICT DO NOTHING nên chạy lại không nhân đôi
-- ═══════════════════════════════════════════════════════════════════

-- Bảng giá Pro. original_price_vnd = months × 50.000 (giá tháng lẻ), dùng
-- để gạch ngang trên UI cho thấy mức tiết kiệm thật.
INSERT INTO "pro_plans" ("code","name","months","price_vnd","original_price_vnd","description","badge","popular","active","sort_order","created_at","updated_at") VALUES
  ('PRO_1M',  'Pro 1 tháng',   1,   50000,    50000, 'Dùng thử trọn vẹn mọi tính năng Pro trong 30 ngày.',            NULL,              false, true, 1, NOW(), NOW()),
  ('PRO_3M',  'Pro 3 tháng',   3,  100000,   150000, 'Tiết kiệm 33% so với mua lẻ từng tháng.',                        'Tiết kiệm 33%',   false, true, 2, NOW(), NOW()),
  ('PRO_6M',  'Pro 6 tháng',   6,  150000,   300000, 'Tiết kiệm 50% — lựa chọn cân bằng nhất.',                        'Phổ biến nhất',   true,  true, 3, NOW(), NOW()),
  ('PRO_12M', 'Pro 12 tháng', 12,  250000,   600000, 'Tiết kiệm 58% — rẻ nhất tính theo tháng, chỉ ~20.833đ/tháng.',   'Tiết kiệm 58%',   false, true, 4, NOW(), NOW())
ON CONFLICT ("code") DO NOTHING;

-- Mốc nạp ví. Thưởng tăng dần theo mệnh giá; admin sửa được trong trang
-- quản trị nên các con số này chỉ là điểm khởi đầu.
-- ⚠️ KHÔNG dùng `ON CONFLICT DO NOTHING` ở bảng này: nó chỉ bắt khi có một
-- ràng buộc UNIQUE bị vi phạm, mà `point_topup_tiers` KHÔNG có ràng buộc nào
-- trên `amount_vnd`. Viết ON CONFLICT ở đây thì mọi INSERT đều thành công và
-- chạy lại migration là nhân đôi toàn bộ mốc nạp (đo thật: 6 → 12).
-- `WHERE NOT EXISTS` mới là thứ chặn đúng.
INSERT INTO "point_topup_tiers" ("amount_vnd","bonus_percent","label","popular","active","sort_order","created_at","updated_at")
SELECT v.amount_vnd, v.bonus_percent, v.label, v.popular, v.active, v.sort_order, NOW(), NOW()
FROM (VALUES
  (  20000,  0, NULL::varchar,   false, true, 1),
  (  50000,  0, NULL::varchar,   false, true, 2),
  ( 100000,  5, 'Tặng 5%',       false, true, 3),
  ( 200000,  8, 'Tặng 8%',       true,  true, 4),
  ( 500000, 12, 'Tặng 12%',      false, true, 5),
  (1000000, 15, 'Tặng 15%',      false, true, 6)
) AS v(amount_vnd, bonus_percent, label, popular, active, sort_order)
WHERE NOT EXISTS (
  SELECT 1 FROM "point_topup_tiers" e WHERE e."amount_vnd" = v.amount_vnd
);

-- Hàng cấu hình thanh toán duy nhất. Để TẮT và để TRỐNG thông tin ngân
-- hàng: admin điền rồi tự bật trong /admin/payment-settings. Không
-- hardcode số tài khoản trong mã hay trong migration.
INSERT INTO "payment_settings" ("id","bank_transfer_enabled","transfer_ttl_minutes","updated_at")
VALUES (1, false, 60, NOW())
ON CONFLICT ("id") DO NOTHING;
