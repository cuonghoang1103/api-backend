'use client';

/**
 * /dang-nhap-app — điểm vào "đăng nhập app di động qua web" (16/11/2026).
 *
 * App iOS mở trang này trong ASWebAuthenticationSession (trình duyệt hệ thống — KHÔNG phải WebView nhúng, Google
 * cấm WebView nhúng) với `?nhaCungCap=google|github&app=<khoá>&trangThai=<nonce>&thu=<PKCE S256>`.
 * Trang ghi cookie phiên (POST /api/auth/app/bat-dau) rồi gọi signIn của NextAuth y như nút trên /login. Xong thì
 * NextAuth quay về /dang-nhap-app/xong. Không có tham số nào là URL — app chỉ là một khoá trong bảng cố định.
 */
import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import {
  APP_QUA_WEB, NHA_CUNG_CAP_APP, laKhoaApp, laNhaCungCapApp, laThuApp, laTrangThaiApp,
} from '@/lib/dangNhapApp';
import { KhungDangNhapApp } from '@/components/auth/KhungDangNhapApp';

function NoiDung() {
  const q = useSearchParams();
  const daChay = useRef(false);
  const [loi, setLoi] = useState<string | null>(null);

  const app = q?.get('app');
  const ncc = q?.get('nhaCungCap');
  const tt = q?.get('trangThai');
  const thu = q?.get('thu');
  const hopLe = laKhoaApp(app) && laNhaCungCapApp(ncc) && laTrangThaiApp(tt) && laThuApp(thu);

  useEffect(() => {
    if (!hopLe || daChay.current) return;
    daChay.current = true;
    (async () => {
      try {
        const r = await fetch('/api/auth/app/bat-dau', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ app, nhaCungCap: ncc, trangThai: tt, thu }),
        });
        if (!r.ok) {
          const j = await r.json().catch(() => ({}));
          setLoi(j?.message || 'Không bắt đầu được lượt đăng nhập.');
          return;
        }
        await signIn(ncc as string, { callbackUrl: '/dang-nhap-app/xong' });
      } catch {
        setLoi('Không kết nối được máy chủ. Kiểm tra mạng rồi thử lại.');
      }
    })();
  }, [hopLe, app, ncc, tt, thu]);

  if (!hopLe) {
    return (
      <KhungDangNhapApp>
        <p className="text-text-primary font-semibold">Liên kết đăng nhập không hợp lệ</p>
        <p className="text-text-muted text-sm">Đóng cửa sổ này, quay lại app và bấm đăng nhập lần nữa.</p>
      </KhungDangNhapApp>
    );
  }
  const tenApp = APP_QUA_WEB[app].ten;
  const tenNcc = NHA_CUNG_CAP_APP[ncc];
  return (
    <KhungDangNhapApp>
      {loi ? (
        <>
          <p className="text-text-primary font-semibold">Chưa mở được {tenNcc}</p>
          <p className="text-text-muted text-sm">{loi}</p>
        </>
      ) : (
        <>
          <Loader2 className="w-8 h-8 text-neon-violet animate-spin" />
          <p className="text-text-primary font-semibold">Đang mở {tenNcc}…</p>
          <p className="text-text-muted text-sm">Đăng nhập tài khoản cuongthai.com để dùng trong app {tenApp}.</p>
        </>
      )}
    </KhungDangNhapApp>
  );
}

export default function DangNhapAppPage() {
  return (
    <Suspense fallback={<KhungDangNhapApp><Loader2 className="w-8 h-8 text-neon-violet animate-spin" /></KhungDangNhapApp>}>
      <NoiDung />
    </Suspense>
  );
}
