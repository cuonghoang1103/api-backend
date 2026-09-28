-- Tiền nong — khoản nợ (28/09/2026): hai trường TUỲ CHỌN, không đụng dữ liệu cũ.
--   rate_unit       DAY | MONTH | YEAR — đơn vị của interest_rate. NULL = cách
--                   hiểu cũ (%/ngày cho DAILY_PERCENT, %/tháng cho kiểu khác).
--   prepay_fee_pct  phí trả trước hạn, % trên gốc trả trước. NULL = chưa khai.
ALTER TABLE "finance_debts" ADD COLUMN "prepay_fee_pct" DECIMAL(6,3),
ADD COLUMN "rate_unit" VARCHAR(8);
