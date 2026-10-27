'use client';

/**
 * Sidebar /admin — gọn, dày thông tin, không trang trí.
 *
 * Hàng 28px, chữ 13px, biểu tượng 15px nét mảnh. Nhóm theo mảng việc và gập
 * được; trạng thái gập nhớ trong localStorage (hỏng/không có thì mở hết —
 * localStorage chỉ là tiện nghi, không phải nơi giữ dữ liệu).
 * Mục đang mở chỉ đổi NỀN, không đổi màu nhấn — màu nhấn dành cho hành động.
 */
import { useEffect, useState } from 'react';
import type React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, ChevronRight, LogOut, PanelLeftClose, Search } from 'lucide-react';
import { ADMIN_NAV, activeHref } from './nav';
import { useAdminT } from '../i18n';

const KHOA_NHOM = 'admin.nav.collapsed';

function docNhomGap(): Record<string, boolean> {
  try {
    const raw = window.localStorage.getItem(KHOA_NHOM);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export default function AdminSidebar({
  user,
  inboxCount,
  onOpenCommand,
  onCollapse,
  onLogout,
  onNavigate,
}: {
  user: { name: string; email: string } | null;
  inboxCount: number;
  onOpenCommand: () => void;
  onCollapse?: () => void;
  onLogout: () => void;
  /** Mobile: đóng ngăn kéo sau khi chọn mục. */
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const current = activeHref(pathname);
  const { t, vi } = useAdminT();
  const [gap, setGap] = useState<Record<string, boolean>>({});

  useEffect(() => { setGap(docNhomGap()); }, []);

  const toggle = (id: string) => {
    setGap((g) => {
      const next = { ...g, [id]: !g[id] };
      try { window.localStorage.setItem(KHOA_NHOM, JSON.stringify(next)); } catch { /* chỉ là tiện nghi */ }
      return next;
    });
  };

  const initials = (user?.name || 'A')
    .split(/\s+/)
    .filter(Boolean)
    .slice(-2)
    .map((w) => w[0]!.toUpperCase())
    .join('');

  return (
    <div className="flex h-full w-full flex-col">
      {/* Không gian làm việc */}
      <div className="flex h-[68px] shrink-0 items-center gap-2.5 px-4">
        {/* Logo kiểu aidev: ô vuông viền trắng + chữ in hoa giãn rộng */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] border-2 border-white text-[17px] font-extrabold text-white">
          C
        </div>
        <div className="min-w-0 flex-1 leading-none">
          <p className="truncate text-[17px] font-extrabold tracking-[0.14em] text-white">CUONGTHAI</p>
          <p className="mt-1 text-[11px] font-bold tracking-[0.12em] text-[var(--a-accent-text)]">ADMIN</p>
        </div>
        {onCollapse && (
          <button onClick={onCollapse} className="a-icon-btn" title={`${t('hideSidebar')}  [`} aria-label={t('hideSidebar')}>
            <PanelLeftClose className="h-[15px] w-[15px]" strokeWidth={1.75} />
          </button>
        )}
      </div>

      {/* Tìm kiếm / lệnh */}
      <div className="px-3 pb-3">
        <button
          onClick={onOpenCommand}
          className="flex h-10 w-full items-center gap-2.5 rounded-[8px] border border-white/20 bg-white/[0.06] px-3 text-[14px] text-white/70 hover:border-white/40 hover:text-white"
        >
          <Search className="h-4 w-4" strokeWidth={2} />
          <span>{t('search')}</span>
          <span className="ml-auto flex items-center gap-0.5">
            <kbd className="a-kbd">⌘</kbd>
            <kbd className="a-kbd">K</kbd>
          </span>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4" aria-label="Admin">
        {ADMIN_NAV.map((g) => {
          const collapsed = g.label ? !!gap[g.id] : false;
          return (
            <div
              key={g.id}
              className={g.label ? 'mt-5' : ''}
              style={g.hue ? ({ '--n-hue': g.hue } as React.CSSProperties) : undefined}
            >
              {g.label && (
                <button
                  onClick={() => toggle(g.id)}
                  className="group mb-1 flex h-7 w-full items-center gap-1 rounded-[5px] px-3 text-[12px] font-bold uppercase tracking-[0.1em] text-white/55 hover:text-white"
                  aria-expanded={!collapsed}
                >
                  {vi && g.viLabel ? g.viLabel : g.label}
                  <ChevronRight
                    className={`h-3 w-3 opacity-0 transition-transform duration-150 group-hover:opacity-100 ${collapsed ? '' : 'rotate-90'}`}
                    strokeWidth={2}
                  />
                </button>
              )}
              {!collapsed && (
                <div className="mt-0.5 space-y-1">
                  {g.items.map((it) => {
                    const isActive = current === it.href;
                    const badge = it.href === '/admin/thong-bao' && inboxCount > 0 ? inboxCount : 0;
                    return (
                      <Link
                        key={it.href}
                        href={it.href}
                        onClick={onNavigate}
                        aria-current={isActive ? 'page' : undefined}
                        className="a-nav-item"
                      >
                        <span className="a-tile">
                          <it.icon strokeWidth={2} />
                        </span>
                        <span className="truncate">{vi && it.vi ? it.vi : it.label}</span>
                        {it.external && <ArrowUpRight className="!h-3 !w-3 opacity-60" />}
                        {badge > 0 && (
                          <span className="ml-auto rounded-[6px] bg-white px-1.5 py-[3px] text-[11.5px] font-bold tabular-nums text-[var(--a-navy)]">
                            {badge > 99 ? '99+' : badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Người dùng */}
      <div className="flex shrink-0 items-center gap-2.5 border-t border-white/10 px-4 py-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--a-accent)] text-[13px] font-bold text-white">
          {initials}
        </div>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-[14px] font-semibold text-white">{user?.name ?? 'Admin'}</p>
          {user?.email && <p className="truncate text-[12px] text-white/55">{user.email}</p>}
        </div>
        <Link href="/" className="a-icon-btn" title={t('openSite')} aria-label={t('openSite')}>
          <ArrowUpRight className="h-[15px] w-[15px]" strokeWidth={1.75} />
        </Link>
        <button onClick={onLogout} className="a-icon-btn" title={t('logOut')} aria-label={t('logOut')}>
          <LogOut className="h-[15px] w-[15px]" strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}
