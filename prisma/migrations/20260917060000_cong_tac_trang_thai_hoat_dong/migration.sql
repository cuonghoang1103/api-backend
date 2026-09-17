-- Công tắc "cho người khác thấy trạng thái hoạt động của tôi".
--
-- Mặc định TRUE: đúng với hành vi đang chạy trước migration này, nên không ai
-- bị đổi trải nghiệm cho tới khi họ tự tắt. Đặt mặc định FALSE sẽ làm mọi
-- chấm xanh đang có biến mất cùng lúc — người dùng đọc ra là "app hỏng".
ALTER TABLE "users"
  ADD COLUMN "show_active_status" BOOLEAN NOT NULL DEFAULT true;
