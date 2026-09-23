'use client';

/**
 * Khung /work (CT Work) — công cụ toàn màn hình: sidebar trái + vùng nội dung.
 * Navbar của site ẩn ở đây (Navbar.tsx); middleware đã chặn người chưa đăng
 * nhập (trừ /work/invite/*). Toàn bộ chữ trong /work bằng tiếng Anh.
 */

import './work.css';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import WorkSidebar from '@/components/work/WorkSidebar';
import CommandPalette from '@/components/work/CommandPalette';
import { useDaDangNhap } from '@/hooks/useDaDangNhap';
import { Spinner } from '@/components/work/ui';

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '';
  const isInvite = pathname.startsWith('/work/invite/');
  const { daDangNhap, sanSang } = useDaDangNhap();
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => setMobileNav(false), [pathname]);

  // Lưới đỡ phía client (middleware là chốt chính): phiên hết hạn giữa chừng.
  useEffect(() => {
    if (sanSang && !daDangNhap && !isInvite) {
      window.location.href = `/login?callbackUrl=${encodeURIComponent(pathname)}`;
    }
  }, [sanSang, daDangNhap, isInvite, pathname]);

  return (
    <div className="work-root fixed inset-0 z-[45] flex overflow-hidden">
      {isInvite ? (
        <main className="flex-1 overflow-y-auto">{children}</main>
      ) : !sanSang || !daDangNhap ? (
        <div className="flex flex-1 items-center justify-center"><Spinner size={20} /></div>
      ) : (
        <>
          <aside className="hidden w-[236px] shrink-0 border-r border-[var(--w-border)] bg-[var(--w-bg)] md:block">
            <WorkSidebar />
          </aside>
          {mobileNav && (
            <div className="fixed inset-0 z-[60] md:hidden" onClick={() => setMobileNav(false)}>
              <div className="absolute inset-0 bg-black/40" />
              <aside className="absolute inset-y-0 left-0 w-[260px] border-r border-[var(--w-border)] bg-[var(--w-bg)]" onClick={(e) => e.stopPropagation()}>
                <WorkSidebar onNavigate={() => setMobileNav(false)} />
              </aside>
            </div>
          )}
          <main className="flex min-w-0 flex-1 flex-col bg-[var(--w-panel)] md:my-2 md:mr-2 md:rounded-[10px] md:border md:border-[var(--w-border)]">
            <div className="flex h-11 shrink-0 items-center border-b border-[var(--w-border)] px-3 md:hidden">
              <button type="button" onClick={() => setMobileNav(true)} className="w-btn w-btn-ghost w-btn-icon" aria-label="Open navigation">
                <Menu size={16} />
              </button>
              <span className="ml-2 text-[13px] font-semibold">CT Work</span>
            </div>
            <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
          </main>
          <CommandPalette />
        </>
      )}
      <div id="work-portal" />
    </div>
  );
}
