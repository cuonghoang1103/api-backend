-- Phiếu yêu cầu dự án: lời nhắn công khai cho khách (trang tra cứu /about/nhan-du-an/tra-cuu).
-- Khác internal_note (ghi chú nội bộ, không bao giờ trả ra ngoài).
ALTER TABLE "project_requests" ADD COLUMN "client_note" TEXT;
