'use client';

/**
 * Khung /admin — một công cụ, không phải một trang web (23/09/2026).
 *
 * Toàn màn hình (Navbar của site ẩn ở /admin — xem Navbar.tsx), sidebar gọn
 * bên trái, nội dung nằm trong MỘT khung viền mảnh. ⌘K nhảy tới bất kỳ trang
 * nào; `[` ẩn/hiện sidebar. Bảng màu + lớp phủ cho các trang cũ: admin.css.
 *
 * Framer Motion bị đặt reducedMotion="always" cho cả nhánh /admin: các trang
 * cũ trượt/phóng từng thẻ khi vào trang — chuyển động không mang thông tin.
 * Mờ-hiện (opacity) vẫn chạy, nên không có gì "giật".
 */
import './admin.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { MotionConfig } from 'framer-motion';
import { Menu, PanelLeft, Search } from 'lucide-react';
import ChuongAdmin from '@/components/admin/ChuongAdmin';
import AdminSidebar from '@/components/admin/shell/AdminSidebar';
import CommandPalette from '@/components/admin/shell/CommandPalette';
import { ADMIN_NAV, activeHref } from '@/components/admin/shell/nav';
import { useAdminT } from '@/components/admin/i18n';

const KHOA_SIDEBAR = 'admin.sidebar.hidden';

/** Đang gõ trong ô nhập thì phím tắt một chữ không được ăn mất ký tự. */
function dangGo(t: EventTarget | null): boolean {
  const el = t as HTMLElement | null;
  if (!el) return false;
  return el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName);
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [sidebarHidden, setSidebarHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [inbox, setInbox] = useState(0);
  const { t, vi, setLocale } = useAdminT();

  // Kiểm quyền admin MỘT lần khi vào /admin, không kiểm lại mỗi lần đổi trang:
  // layout sống suốt các lần điều hướng con, và một phản hồi chập chờn giữa
  // chừng từng đá người dùng ra /login ngay khi bấm menu.
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/admin-check', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          const user = data.data;
          setCurrentUser({
            name: user?.fullName || user?.username || 'Admin',
            email: user?.email || '',
          });
          setAuthChecked(true);
          return;
        }
      } catch {}
      router.push('/login?redirect=' + encodeURIComponent(pathnameRef.current));
    };
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  useEffect(() => {
    try { setSidebarHidden(window.localStorage.getItem(KHOA_SIDEBAR) === '1'); } catch { /* mặc định hiện */ }
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarHidden((h) => {
      try { window.localStorage.setItem(KHOA_SIDEBAR, h ? '0' : '1'); } catch { /* chỉ là tiện nghi */ }
      return !h;
    });
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch {}
    router.push('/login');
  }, [router]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen((o) => !o);
        return;
      }
      if (e.key === '[' && !e.metaKey && !e.ctrlKey && !e.altKey && !dangGo(e.target)) {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggleSidebar]);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Breadcrumb: nhóm / trang (theo nav.ts, không đoán từ URL).
  const cur = activeHref(pathname);
  const group = ADMIN_NAV.find((g) => g.items.some((i) => i.href === cur));
  const item = group?.items.find((i) => i.href === cur);

  if (!authChecked) {
    return (
      <div className="admin-root flex h-dvh items-center justify-center">
        <div className="flex items-center gap-2.5 text-[13px] text-[var(--a-text-3)]">
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-[1.5px] border-[var(--a-text-3)] border-t-transparent" />
          {t('checkingAccess')}
        </div>
      </div>
    );
  }

  const sidebarProps = {
    user: currentUser,
    inboxCount: inbox,
    onOpenCommand: () => setCmdOpen(true),
    onLogout: handleLogout,
  };

  return (
    <MotionConfig reducedMotion="always">
      <div className="admin-root flex h-dvh overflow-hidden">
        {/* Sidebar — desktop */}
        {!sidebarHidden && (
          <aside className="hidden w-[232px] shrink-0 md:block">
            <AdminSidebar {...sidebarProps} onCollapse={toggleSidebar} />
          </aside>
        )}

        {/* Sidebar — mobile (ngăn kéo) */}
        {mobileOpen && (
          <div className="fixed inset-0 z-[70] md:hidden">
            <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} aria-hidden />
            <aside className="a-pop absolute inset-y-0 left-0 w-[264px] border-r border-[var(--a-border)] bg-[var(--a-bg)]">
              <AdminSidebar {...sidebarProps} onNavigate={() => setMobileOpen(false)} />
            </aside>
          </div>
        )}

        {/* Khung nội dung */}
        <div
          className={`flex min-w-0 flex-1 flex-col overflow-hidden bg-[var(--a-panel)] md:my-2 md:mr-2 md:rounded-[14px] md:border md:border-[var(--a-border)] ${
            sidebarHidden ? 'md:ml-2' : ''
          }`}
        >
          <header className="flex h-12 shrink-0 items-center gap-2 border-b border-[var(--a-border)] px-3 md:px-4">
            <button onClick={() => setMobileOpen(true)} className="a-icon-btn md:hidden" aria-label={t('openMenu')}>
              <Menu className="h-[18px] w-[18px]" strokeWidth={2} />
            </button>
            {sidebarHidden && (
              <button onClick={toggleSidebar} className="a-icon-btn hidden md:inline-flex" title={`${t('showSidebar')}  [`} aria-label={t('showSidebar')}>
                <PanelLeft className="h-4 w-4" strokeWidth={2} />
              </button>
            )}
            <nav className="flex min-w-0 items-center gap-1.5 text-[13.5px]" aria-label="Breadcrumb">
              <span className="text-[var(--a-text-3)]">
                {(vi ? group?.viLabel ?? group?.label : group?.label) ?? t('admin')}
              </span>
              <span className="text-[var(--a-text-3)]">/</span>
              <span className="truncate font-semibold text-[var(--a-text)]">
                {(vi ? item?.vi ?? item?.label : item?.label) ?? t('overview')}
              </span>
            </nav>
            <div className="ml-auto flex items-center gap-2">
              {/* Đổi ngôn ngữ ngay trong admin — cùng cookie `locale` với
                  trang ngoài, nên đổi ở đây thì cả site đổi theo. */}
              <div className="a-seg" role="group" aria-label={t('language')}>
                {(['vi', 'en'] as const).map((ma) => (
                  <button
                    key={ma}
                    onClick={() => setLocale(ma)}
                    aria-pressed={vi === (ma === 'vi')}
                    className="a-seg-item"
                  >
                    {ma.toUpperCase()}
                  </button>
                ))}
              </div>
              <button onClick={() => setCmdOpen(true)} className="a-icon-btn md:hidden" aria-label={t('search')}>
                <Search className="h-[18px] w-[18px]" strokeWidth={2} />
              </button>
              <ChuongAdmin onDem={(d) => setInbox(d.canXuLy)} />
            </div>
          </header>

          <main className="min-h-0 flex-1 overflow-y-auto px-4 py-5 md:px-6">
            {children}
          </main>
        </div>

        <CommandPalette
          open={cmdOpen}
          onClose={() => setCmdOpen(false)}
          onToggleSidebar={toggleSidebar}
          onLogout={handleLogout}
        />
      </div>
    </MotionConfig>
  );
}
