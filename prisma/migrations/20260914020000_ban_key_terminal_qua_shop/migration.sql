-- ─── Bán key terminal qua shop: nối key đã bán vào ví AI Code chung ───────
--
-- Trước đợt này chỉ có một đường cấp key terminal: người dùng xin ở /llm-key,
-- admin duyệt tay và dán key vào `llm_key_requests`. Toàn bộ cơ chế "dùng
-- chung hạn mức với AI Code trên app desktop" (viTien.ts → keyTerminal.ts →
-- /api/v1/internal/ai-code-usage → canh) đọc DUY NHẤT bảng này.
--
-- Mở bán gói key ở /shop mà không ghi vào đây thì người MUA lại không dính
-- luật chung: họ được 60$/5h ở terminal CỘNG THÊM nguyên ví AI Code trên app
-- — gấp đôi thứ họ trả tiền. Nên khi đơn hàng thanh toán xong, hệ thống tự
-- tạo một dòng APPROVED ở đây cho đúng key vừa giao.
--
-- Ba cột thêm:
--   source     phân biệt key xin tay (REQUEST) với key bán ở shop (SHOP)
--   product_id sản phẩm đã bán ra key (để đối chiếu khi bảo hành)
--   expires_at hết hạn gói. Thiếu cột này thì gói "30 ngày" chạy vĩnh viễn.
--
-- Idempotent: chạy lại bao nhiêu lần cũng được (xem CLAUDE.md — `migrate dev`
-- hỏng sẵn trong kho này nên migration viết tay và áp bằng `migrate deploy`).

ALTER TABLE "llm_key_requests" ADD COLUMN IF NOT EXISTS "source" VARCHAR(20) NOT NULL DEFAULT 'REQUEST';
ALTER TABLE "llm_key_requests" ADD COLUMN IF NOT EXISTS "product_id" INTEGER;
ALTER TABLE "llm_key_requests" ADD COLUMN IF NOT EXISTS "expires_at" TIMESTAMP(3);

-- Tra cứu theo key: canh gửi lên hàng chục key một lượt, và mỗi lần giao key
-- mới ta phải hỏi "key này đã gắn cho ai chưa".
CREATE INDEX IF NOT EXISTS "idx_llm_key_req_key" ON "llm_key_requests"("key_value");
