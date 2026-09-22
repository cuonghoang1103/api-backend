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
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, ChevronRight, LogOut, PanelLeftClose, Search } from 'lucide-react';
import { ADMIN_NAV, activeHref } from './nav';

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
      <div className="flex h-12 shrink-0 items-center gap-2 px-3">
        <div className="flex h-[22px] w-[22px] items-center justify-center rounded-[5px] bg-[var(--a-text)] text-[11px] font-semibold text-[var(--a-bg)]">
          C
        </div>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-[13px] font-medium text-[var(--a-text)]">cuongthai.com</p>
        </div>
        {onCollapse && (
          <button onClick={onCollapse} className="a-icon-btn" title="Hide sidebar  [" aria-label="Hide sidebar">
            <PanelLeftClose className="h-[15px] w-[15px]" strokeWidth={1.75} />
          </button>
        )}
      </div>

      {/* Tìm kiếm / lệnh */}
      <div className="px-2 pb-2">
        <button
          onClick={onOpenCommand}
          className="flex h-8 w-full items-center gap-2 rounded-[6px] border border-[var(--a-border)] bg-white/[0.02] px-2.5 text-[13px] text-[var(--a-text-3)] hover:border-[var(--a-border-strong)] hover:text-[var(--a-text-2)]"
        >
          <Search className="h-[14px] w-[14px]" strokeWidth={1.75} />
          <span>Search…</span>
          <span className="ml-auto flex items-center gap-0.5">
            <kbd className="a-kbd">⌘</kbd>
            <kbd className="a-kbd">K</kbd>
          </span>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 pb-3" aria-label="Admin">
        {ADMIN_NAV.map((g) => {
          const collapsed = g.label ? !!gap[g.id] : false;
          return (
            <div key={g.id} className={g.label ? 'mt-3' : ''}>
              {g.label && (
                <button
                  onClick={() => toggle(g.id)}
                  className="group flex h-6 w-full items-center gap-1 rounded-[5px] px-2 text-[11.5px] font-medium text-[var(--a-text-3)] hover:text-[var(--a-text-2)]"
                  aria-expanded={!collapsed}
                >
                  {g.label}
                  <ChevronRight
                    className={`h-3 w-3 opacity-0 transition-transform duration-150 group-hover:opacity-100 ${collapsed ? '' : 'rotate-90'}`}
                    strokeWidth={2}
                  />
                </button>
              )}
              {!collapsed && (
                <div className="mt-0.5 space-y-px">
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
                        <it.icon strokeWidth={1.75} />
                        <span className="truncate">{it.label}</span>
                        {it.external && <ArrowUpRight className="!h-3 !w-3 opacity-60" />}
                        {badge > 0 && (
                          <span className="ml-auto rounded-[4px] bg-[var(--a-accent-soft)] px-1.5 py-[3px] text-[11px] font-medium tabular-nums text-[var(--a-accent-text)]">
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
      <div className="flex shrink-0 items-center gap-2 border-t border-[var(--a-border)] px-3 py-2.5">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/[0.08] text-[10.5px] font-semibold text-[var(--a-text-2)]">
          {initials}
        </div>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-[12.5px] font-medium text-[var(--a-text)]">{user?.name ?? 'Admin'}</p>
          {user?.email && <p className="truncate text-[11px] text-[var(--a-text-3)]">{user.email}</p>}
        </div>
        <Link href="/" className="a-icon-btn" title="Open site" aria-label="Open site">
          <ArrowUpRight className="h-[15px] w-[15px]" strokeWidth={1.75} />
        </Link>
        <button onClick={onLogout} className="a-icon-btn" title="Log out" aria-label="Log out">
          <LogOut className="h-[15px] w-[15px]" strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}
