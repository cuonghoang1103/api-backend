'use client';

/**
 * Khung /work (CT Work) — công cụ toàn màn hình: sidebar trái + vùng nội dung.
 * Navbar của site ẩn ở đây (Navbar.tsx); middleware đã chặn người chưa đăng
 * nhập (trừ /work/invite/* và link chia sẻ /work/share/*). Hai đường công khai
 * đó KHÔNG có sidebar / bảng lệnh / AI (những thứ cần đăng nhập). Toàn bộ chữ
 * trong /work bằng tiếng Anh.
 */

import './work.css';
import { Suspense, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import WorkSidebar from '@/components/work/WorkSidebar';
import CommandPalette from '@/components/work/CommandPalette';
import AiPanelHost from '@/components/work/ai/AiPanelHost';
import HelpPanelHost from '@/components/work/help/HelpPanel';
import { useDaDangNhap } from '@/hooks/useDaDangNhap';
import { Spinner } from '@/components/work/ui';
import { useMobileNav } from '@/components/work/shell/mobileNav';

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '';
  const isPublic = pathname.startsWith('/work/invite/') || pathname.startsWith('/work/share/');
  const { daDangNhap, sanSang } = useDaDangNhap();
  const mobileNav = useMobileNav((s) => s.open);
  const setMobileNav = useMobileNav((s) => s.setOpen);
  // Trang có header riêng (có nút ☰) ⇒ không vẽ thanh dự phòng, tránh hai thanh chồng nhau.
  const pageHasHeader = useMobileNav((s) => s.headers > 0);

  useEffect(() => setMobileNav(false), [pathname, setMobileNav]);

  // Lưới đỡ phía client (middleware là chốt chính): phiên hết hạn giữa chừng.
  useEffect(() => {
    if (sanSang && !daDangNhap && !isPublic) {
      window.location.href = `/login?callbackUrl=${encodeURIComponent(pathname)}`;
    }
  }, [sanSang, daDangNhap, isPublic, pathname]);

  return (
    <div className="work-root fixed inset-0 z-[45] flex overflow-hidden">
      {isPublic ? (
        <main className="flex-1 overflow-y-auto">{children}</main>
      ) : !sanSang || !daDangNhap ? (
        <div className="flex flex-1 items-center justify-center"><Spinner size={20} /></div>
      ) : (
        <>
          <aside className="hidden w-[248px] shrink-0 border-r border-[var(--w-border)] bg-[var(--w-bg)] md:block">
            {/* Sidebar đọc ?tab= (useSearchParams) ⇒ cần Suspense. */}
            <Suspense fallback={null}><WorkSidebar /></Suspense>
          </aside>
          {mobileNav && (
            <div className="fixed inset-0 z-[60] md:hidden" onClick={() => setMobileNav(false)}>
              <div className="absolute inset-0 bg-black/45" />
              <aside
                className="absolute inset-y-0 left-0 w-[284px] max-w-[86vw] border-r border-[var(--w-border)] bg-[var(--w-bg)]"
                style={{ boxShadow: 'var(--w-shadow-pop)' }}
                onClick={(e) => e.stopPropagation()}
              >
                <Suspense fallback={null}><WorkSidebar onNavigate={() => setMobileNav(false)} /></Suspense>
              </aside>
            </div>
          )}
          <main className="flex min-w-0 flex-1 flex-col bg-[var(--w-panel)] md:my-2 md:mr-2 md:rounded-[10px] md:border md:border-[var(--w-border)]" style={{ boxShadow: 'var(--w-shadow-card)' }}>
            {!pageHasHeader && (
              <div className="w-header flex h-[52px] shrink-0 items-center gap-2 border-b border-[var(--w-border)] px-3 md:hidden">
                <button type="button" onClick={() => setMobileNav(true)} className="w-btn w-btn-ghost w-btn-icon" aria-label="Open navigation">
                  <Menu size={17} />
                </button>
                <span className="text-[15px] font-semibold">CT Work</span>
              </div>
            )}
            <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
          </main>
          <CommandPalette />
          <AiPanelHost />
          <HelpPanelHost />
        </>
      )}
      <div id="work-portal" />
    </div>
  );
}
