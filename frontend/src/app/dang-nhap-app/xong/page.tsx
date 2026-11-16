'use client';

/**
 * /dang-nhap-app/xong — NextAuth quay về đây sau khi đăng nhập Google/GitHub cho app (16/11/2026).
 * Xin mã một lần (POST /api/auth/app/ma) rồi chuyển hướng `<scheme>://dang-nhap?ma=…&trangThai=…` — URL do BACKEND
 * dựng từ bảng app cố định; ASWebAuthenticationSession bắt scheme đó và trả về app. Không bao giờ hiện token ở đây.
 */
import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { KhungDangNhapApp } from '@/components/auth/KhungDangNhapApp';

export default function DangNhapAppXongPage() {
  const daChay = useRef(false);
  const [loi, setLoi] = useState<string | null>(null);
  const [duongVe, setDuongVe] = useState<string | null>(null);

  useEffect(() => {
    if (daChay.current) return;
    daChay.current = true;
    (async () => {
      try {
        const r = await fetch('/api/auth/app/ma', { method: 'POST' });
        const j = await r.json().catch(() => ({}));
        if (!r.ok || typeof j?.chuyenHuong !== 'string') {
          setLoi(j?.message || 'Chưa đăng nhập xong. Quay lại app và thử lại.');
          return;
        }
        setDuongVe(j.chuyenHuong);
        window.location.replace(j.chuyenHuong);
      } catch {
        setLoi('Không kết nối được máy chủ. Kiểm tra mạng rồi thử lại.');
      }
    })();
  }, []);

  return (
    <KhungDangNhapApp>
      {loi ? (
        <>
          <p className="text-text-primary font-semibold">Chưa đăng nhập được</p>
          <p className="text-text-muted text-sm">{loi}</p>
          <p className="text-text-muted text-xs">Đóng cửa sổ này (nút Huỷ phía trên) để quay lại app.</p>
        </>
      ) : (
        <>
          <Loader2 className="w-8 h-8 text-neon-violet animate-spin" />
          <p className="text-text-primary font-semibold">Đang quay lại app…</p>
          {duongVe && (
            // Dự phòng khi trình duyệt không tự mở app (hiếm) — cùng URL, người dùng tự bấm.
            <a href={duongVe} className="text-sm text-neon-violet underline">Mở lại app</a>
          )}
        </>
      )}
    </KhungDangNhapApp>
  );
}
