/**
 * /cuongmini/gia-han — nhập MÃ GIA HẠN THEO $ trên web (19/10/2026).
 *
 * App CŨ (CLI ≤ 0.6.0, extension ≤ 0.8.0, desktop chưa có thẻ) không hiểu thẻ "Nhập mã gia hạn" — máy chủ nối vào câu lỗi
 * "Vào cuongthai.com/cuongmini/gia-han để nhập mã gia hạn". Trang này liệt kê các trần ĐANG chạm của tài khoản, cho nhập
 * mã (lần 1 trong kỳ cộng ngay, lần 2+ chờ admin duyệt) và tự kiểm lại yêu cầu đang chờ.
 * Server: GET/POST /api/v1/agent/gia-han-tien (src/services/agent/maGiaHanTien.ts).
 */
import type { Metadata } from 'next';
import GiaHanClient from './GiaHanClient';

export const metadata: Metadata = {
  title: 'Mã gia hạn CuongMini',
  description: 'Nhập mã gia hạn khi chạm giới hạn chi tiêu của CuongMini (CLI, app desktop, VS Code).',
  robots: { index: false, follow: false },
  alternates: { canonical: '/cuongmini/gia-han' },
};

export default function Page() {
  return <GiaHanClient />;
}
