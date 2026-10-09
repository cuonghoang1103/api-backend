'use client';

/**
 * UX-D (09/10/2026): phần CLIENT của khung /work, tách khỏi layout.tsx để layout là component MÁY CHỦ (đặt được
 * metadata: favicon CT Work, og:site_name, ảnh xem trước "Sign in to view"). Nội dung bên dưới giữ nguyên.
 *
 * Khung /work (CT Work) — công cụ toàn màn hình: sidebar trái + vùng nội dung.
 * Navbar của site ẩn ở đây (Navbar.tsx); middleware đã chặn người chưa đăng
 * nhập (trừ /work/invite/* và link chia sẻ /work/share/*). Hai đường công khai
 * đó KHÔNG có sidebar / bảng lệnh / AI (những thứ cần đăng nhập). Toàn bộ chữ
 * trong /work bằng tiếng Anh.
 *
 * 10/10/2026: giao diện song ngữ — ngôn ngữ theo NGƯỜI DÙNG (components/work/i18n). Vùng nội dung mang `key={locale}`
 * ⇒ đổi ngôn ngữ thì cả cây CT Work vẽ lại, nên `wt()` gọi trong lúc render luôn đúng.
 */

import { Fragment, Suspense, useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import WorkSidebar from '@/components/work/WorkSidebar';
import CommandPalette from '@/components/work/CommandPalette';
import { ChatNotifierHost } from '@/components/work/chat/ChatNotifier'; // CTW K-3: badge/âm/thông báo tin chat
import AiPanelHost from '@/components/work/ai/AiPanelHost';
import HelpPanelHost from '@/components/work/help/HelpPanel';
import { useDaDangNhap } from '@/hooks/useDaDangNhap';
import { useMobileNav, useSidebarRail } from '@/components/work/shell/mobileNav';
import { useLayoutPrefs } from '@/components/work/shell/panes';
import { isTyping } from '@/components/work/ui';
import { useWorkLocaleStore, wt } from '@/components/work/i18n';
import { FirstRunLanguagePrompt, WorkLangSync } from '@/components/work/i18n/LanguageSwitch';
import { CtWorkMark } from '@/components/work/brand/CtWorkMark';

/**
 * UX-B (c): vùng nội dung CT Work là `<div>` mang `role="main"` CHỈ KHI chưa nằm trong một `<main>` khác.
 * Trên web, layout site (DockLayout) đã bọc mọi trang trong `<main class="app-main">` ⇒ thêm một main nữa là
 * "main lồng nhau" (axe best-practice landmark-no-duplicate-main / landmark-main-is-top-level). App desktop dựng
 * thẳng layout này, không có DockLayout ⇒ ở đó vùng này tự nhận vai main. Đổi `role` không làm cây con dựng lại
 * (khác với đổi thẻ <main>↔<div>). Skip-link vẫn trỏ `#work-main` (tabIndex −1).
 */
function useMainRole(): [(el: HTMLElement | null) => void, 'main' | undefined] {
  const [role, setRole] = useState<'main' | undefined>(undefined);
  const ref = useCallback((el: HTMLElement | null) => {
    if (!el) return;
    const nested = !!el.parentElement?.closest('main, [role="main"]');
    setRole(nested ? undefined : 'main');
  }, []);
  return [ref, role];
}

export default function WorkShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '';
  const isPublic = pathname.startsWith('/work/invite/') || pathname.startsWith('/work/share/');
  const { daDangNhap, sanSang } = useDaDangNhap();
  const mobileNav = useMobileNav((s) => s.open);
  const setMobileNav = useMobileNav((s) => s.setOpen);
  // Trang có header riêng (có nút ☰) ⇒ không vẽ thanh dự phòng, tránh hai thanh chồng nhau.
  const pageHasHeader = useMobileNav((s) => s.headers > 0);

  useEffect(() => setMobileNav(false), [pathname, setMobileNav]);
  const [mainRef, mainRole] = useMainRole();
  const [publicMainRef, publicMainRole] = useMainRole();

  // Ngôn ngữ CT Work: đọc bản đệm/cookie ngay (vẽ đúng từ lần đầu), rồi hỏi máy chủ.
  const locale = useWorkLocaleStore((s) => s.locale);
  const localeReady = useWorkLocaleStore((s) => s.ready);
  useEffect(() => { useWorkLocaleStore.getState().init(); }, []);

  // Sidebar thu gọn (≥md): đọc lựa chọn đã lưu / tự thu gọn khi cửa sổ hẹp.
  const rail = useSidebarRail((s) => s.collapsed);
  useEffect(() => { useSidebarRail.getState().init(); useLayoutPrefs.getState().load(); }, []);

  // UX-E: chế độ Focus của trang (Docs, Tests…) ẩn hẳn sidebar dự án. Rời khỏi trang đã bật
  // (đường dẫn ra ngoài `focusBase`) ⇒ tự thoát, sidebar quay lại.
  const focus = useLayoutPrefs((s) => s.focus);
  const focusBase = useLayoutPrefs((s) => s.focusBase);
  useEffect(() => {
    if (focus && focusBase && pathname !== focusBase && !pathname.startsWith(`${focusBase}/`)) useLayoutPrefs.getState().exitFocus();
  }, [pathname, focus, focusBase]);

  // ⌘\ (Ctrl+\): thu gọn / mở sidebar; đang Focus thì thoát Focus. Chạy cả khi đang gõ
  // (phím có ⌘ không gõ ra chữ) — trừ ô nhập thường, nơi ⌘\ không có nghĩa gì nên vẫn cho.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.altKey || e.shiftKey || e.key !== '\\' || e.defaultPrevented) return;
      if (isTyping(e.target) && (e.target as HTMLElement).tagName === 'SELECT') return;
      e.preventDefault();
      const lp = useLayoutPrefs.getState();
      if (lp.focus) lp.exitFocus();
      else useSidebarRail.getState().toggle();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Lưới đỡ phía client (middleware là chốt chính): phiên hết hạn giữa chừng.
  useEffect(() => {
    if (sanSang && !daDangNhap && !isPublic) {
      window.location.href = `/login?callbackUrl=${encodeURIComponent(pathname)}`;
    }
  }, [sanSang, daDangNhap, isPublic, pathname]);

  return (
    <div className="work-root fixed inset-0 z-[45] flex overflow-hidden" lang={locale}>
      <WorkLangSync />
      {isPublic ? (
        <div key={locale} ref={publicMainRef} role={publicMainRole} className="flex-1 overflow-y-auto">{children}</div>
      ) : !sanSang || !daDangNhap || !localeReady ? (
        // Màn tải: logo động (giảm chuyển động ⇒ logo tĩnh). Chữ cho trình đọc màn hình.
        <div className="flex flex-1 items-center justify-center" role="status">
          <CtWorkMark size={52} animate="loop" />
          <span className="sr-only">{wt('shell.loading')}</span>
        </div>
      ) : (
        <Fragment key={locale}>
          <a href="#work-main" className="w-skip-link">{wt('shell.skipToContent')}</a>
          <aside
            className={`hidden shrink-0 overflow-hidden bg-[var(--w-bg)] transition-[width] duration-200 ease-out ${focus ? '' : 'md:block'}`}
            style={{ width: rail ? 'var(--w-sidebar-rail)' : 'var(--w-sidebar-w)' }}
            data-focus-hidden={focus ? '' : undefined}
          >
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
          <div id="work-main" ref={mainRef} role={mainRole} tabIndex={-1} className={`flex min-w-0 flex-1 flex-col bg-[var(--w-panel)] md:my-2 md:mr-2 md:rounded-[12px] md:border md:border-[var(--w-border)] ${focus ? 'md:ml-2' : ''}`} style={{ boxShadow: 'var(--w-shadow-card)' }}>
            {!pageHasHeader && (
              <div className="w-header flex h-[52px] shrink-0 items-center gap-2 border-b border-[var(--w-border)] px-3 md:hidden">
                <button type="button" onClick={() => setMobileNav(true)} className="w-btn w-btn-ghost w-btn-icon" aria-label={wt('shell.openNavigation')}>
                  <Menu size={17} />
                </button>
                <span className="flex items-center gap-2 text-[15px] font-semibold"><CtWorkMark size={22} />CT Work</span>
              </div>
            )}
            <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
          </div>
          <CommandPalette />
          <ChatNotifierHost />
          <AiPanelHost />
          <HelpPanelHost />
          <FirstRunLanguagePrompt />
        </Fragment>
      )}
      <div id="work-portal" />
    </div>
  );
}
