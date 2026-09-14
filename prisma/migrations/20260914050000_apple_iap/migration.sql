-- Apple In-App Purchase.
--
-- Apple là MỘT CÁCH TRẢ TIỀN NỮA cho đúng gói Pro đã bán trên web, không phải
-- một hệ Pro thứ hai: việc cấp quyền vẫn đi qua `grantProToUser()` và ghi vào
-- `users.is_pro` / `users.pro_expires_at` như mọi đường mua khác.
--
-- Hai bảng chứ không một, và lý do nằm ở `original_transaction_id`:
--   · nó định danh LƯỢT MUA, còn mỗi lần gia hạn sinh `transaction_id` MỚI
--   · nên UNIQUE nó trong bảng giao dịch sẽ đâm khoá ngay lần gia hạn đầu
--   · mà không ràng gì thì một lượt mua cấp Pro được cho nhiều tài khoản
-- Tách ra làm khoá chính của bảng liên kết giải quyết cả hai, ở tầng CSDL chứ
-- không phải trông vào việc mã ứng dụng có nhớ kiểm hay không.

CREATE TABLE "apple_iap_links" (
    "original_transaction_id" VARCHAR(64) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "app_account_token" VARCHAR(64),
    "first_seen_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "apple_iap_links_pkey" PRIMARY KEY ("original_transaction_id")
);

CREATE TABLE "apple_iap_transactions" (
    "id" SERIAL NOT NULL,
    "transaction_id" VARCHAR(64) NOT NULL,
    "original_transaction_id" VARCHAR(64) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "product_id" VARCHAR(64) NOT NULL,
    "granted_days" INTEGER NOT NULL,
    "purchase_date" TIMESTAMP(3) NOT NULL,
    "expires_date" TIMESTAMP(3),
    "environment" VARCHAR(16) NOT NULL,
    "revoked_at" TIMESTAMP(3),
    "revocation_reason" INTEGER,
    "raw_payload" JSONB NOT NULL,
    -- ⚠️ `grantProToUser()` PHẢI chạy ngoài transaction (nó đọc-rồi-ghi trên
    -- bảng `users`), nên tồn tại cửa sổ: giao dịch đã ghi mà Pro chưa cấp.
    -- Không có cột này thì cửa sổ đó là mất tiền câm — người dùng trả tiền,
    -- không có Pro, và không truy vấn nào tìm ra được. Cùng lý do với lưới
    -- cứu ở `billing.service.ts:358`.
    "granted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "apple_iap_transactions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ix_apple_iap_link_user" ON "apple_iap_links"("user_id");
CREATE UNIQUE INDEX "uk_apple_iap_transaction" ON "apple_iap_transactions"("transaction_id");
CREATE INDEX "ix_apple_iap_txn_user" ON "apple_iap_transactions"("user_id");
CREATE INDEX "ix_apple_iap_txn_original" ON "apple_iap_transactions"("original_transaction_id");

ALTER TABLE "apple_iap_transactions"
  ADD CONSTRAINT "apple_iap_transactions_original_transaction_id_fkey"
  FOREIGN KEY ("original_transaction_id")
  REFERENCES "apple_iap_links"("original_transaction_id")
  ON DELETE CASCADE ON UPDATE CASCADE;
