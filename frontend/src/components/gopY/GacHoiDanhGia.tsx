'use client';

/**
 * Canh thời điểm hỏi đánh giá (08/11/2026) — gắn MỘT lần ở layout gốc, chạy trên mọi trang, rất nhẹ:
 * chỉ đếm thời gian dùng thật (tab đang hiện) và số ngày ghé vào localStorage. Giao diện hộp hỏi
 * (`HoiDanhGia`, có robot + 5 sao) chỉ được TẢI khi đủ điều kiện, nên trang thường không trả thêm byte nào.
 *
 * Điều kiện hiện (tất cả):
 *   • đã đăng nhập; đã dùng ≥ 25 phút thật cộng dồn, trong ≥ 2 ngày khác nhau;
 *   • không ở trang nhạy cảm (đăng nhập, quản trị, phòng thi, thanh toán, chính trang góp ý…);
 *   • chưa "Không hỏi lại", đã qua hạn "Để sau"; máy chủ xác nhận 60 ngày qua chưa chấm sao (hỏi MỘT lần mỗi phiên);
 *   • đã ở yên trang hiện tại ≥ 20 giây (không chen vào lúc đang chuyển trang).
 */
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

const HoiDanhGia = dynamic(() => import('./HoiDanhGia'), { ssr: false });

export const KHOA = {
  giay: 'ct_gop_y_giay_dung',
  ngay: 'ct_gop_y_ngay_ghe',
  hoan: 'ct_gop_y_hoan_den',
  khongHoi: 'ct_gop_y_khong_hoi',
} as const;
const CAN_GIAY = 25 * 60;
const CAN_NGAY = 2;
const TRANG_CAM = ['/login', '/register', '/admin', '/gop-y', '/verify', '/forgot-password', '/reset-password',
  '/phong-thi', '/exam', '/checkout', '/cart', '/oauth', '/onboarding'];

const doc = (k: string) => { try { return localStorage.getItem(k); } catch { return null; } };
const ghi = (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* chế độ riêng tư */ } };

export function hoanHoi(soNgay: number) { ghi(KHOA.hoan, String(Date.now() + soNgay * 86_400_000)); }
export function khongHoiNua() { ghi(KHOA.khongHoi, '1'); }

function duDieuKienCucBo(): boolean {
  if (doc(KHOA.khongHoi) === '1') return false;
  if (Number(doc(KHOA.hoan) || 0) > Date.now()) return false;
  if (Number(doc(KHOA.giay) || 0) < CAN_GIAY) return false;
  let ngay: string[] = [];
  try { ngay = JSON.parse(doc(KHOA.ngay) || '[]'); } catch { /* hỏng thì coi như rỗng */ }
  return ngay.length >= CAN_NGAY;
}

let daHoiMayChu: Promise<boolean> | null = null;

export default function GacHoiDanhGia() {
  const daDangNhap = useAuthStore((s) => s.isAuthenticated);
  const pathname = usePathname() || '/';
  const [hien, setHien] = useState(false);

  // Đếm thời gian dùng thật + ghi ngày ghé.
  useEffect(() => {
    if (!daDangNhap) return;
    const homNay = new Date().toISOString().slice(0, 10);
    try {
      const ngay: string[] = JSON.parse(doc(KHOA.ngay) || '[]');
      if (!ngay.includes(homNay)) ghi(KHOA.ngay, JSON.stringify([...ngay, homNay].slice(-10)));
    } catch { ghi(KHOA.ngay, JSON.stringify([homNay])); }
    const id = window.setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      ghi(KHOA.giay, String(Number(doc(KHOA.giay) || 0) + 30));
    }, 30_000);
    return () => window.clearInterval(id);
  }, [daDangNhap]);

  // Đủ điều kiện ⇒ đợi 20 giây yên trên trang rồi mới hỏi.
  useEffect(() => {
    setHien(false);
    if (!daDangNhap || TRANG_CAM.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return;
    const id = window.setTimeout(async () => {
      if (!duDieuKienCucBo()) return;
      if (!daHoiMayChu) {
        daHoiMayChu = import('@/lib/api').then(({ gopYApi }) => gopYApi.nenHoi()).catch(() => false);
      }
      const nen = await daHoiMayChu;
      if (!nen) { hoanHoi(30); return; }
      if (duDieuKienCucBo()) setHien(true);
    }, 20_000);
    return () => window.clearTimeout(id);
  }, [daDangNhap, pathname]);

  if (!hien) return null;
  return <HoiDanhGia trang={pathname} onDong={() => setHien(false)} />;
}
