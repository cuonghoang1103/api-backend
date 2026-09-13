/**
 * /shop/check-usage — ĐÃ CHUYỂN sang /kiem-tra-key.
 *
 * Trang cũ ở đây chưa bao giờ hoạt động: nó gọi `POST /api/v1/shop/check-usage`,
 * route đó chờ biến `CHECK_USAGE_API_URL` trỏ sang một nhà cung cấp bên ngoài
 * mà chưa ai cắm, nên MỌI key — đúng hay sai — đều nhận đúng một câu
 * "Tính năng kiểm tra đang được cấu hình. Vui lòng quay lại sau."
 *
 * Giữ file này làm chuyển hướng thay vì xoá: đường dẫn cũ đã nằm trong danh
 * mục shop, trong lịch sử trình duyệt của khách và có thể trong tin nhắn hỗ
 * trợ. Xoá thẳng là biến chúng thành 404.
 */
import { redirect } from 'next/navigation';

export default function ChuyenHuongKiemTraKey() {
  redirect('/kiem-tra-key');
}
