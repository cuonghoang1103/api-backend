'use client';
/**
 * MoneyFlow shell — shared layout for every /finance page.
 * - Auth gate (private module): redirects to /login?next when logged out.
 * - Desktop: left sidebar with the 8 sections (Phase-2 ones disabled).
 * - Mobile: bottom tab bar with a center floating "+" (Quick Add) button.
 * Root uses pt-16 (fixed navbar) + reserves the mobile bottom-nav height.
 */
import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Banknote, CreditCard, Receipt, Wallet as WalletIcon,
  TrendingUp, PiggyBank, BarChart3, Plus, LogIn, ArrowLeftRight,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import { QuickAddSheet } from './QuickAddSheet';

interface NavItem { href: string; label: string; icon: React.ElementType; soon?: boolean }
const NAV: NavItem[] = [
  { href: '/finance', label: 'Tổng quan', icon: LayoutDashboard },
  { href: '/finance/income', label: 'Thu nhập', icon: Banknote },
  { href: '/finance/debts', label: 'Khoản nợ', icon: CreditCard },
  { href: '/finance/expenses', label: 'Chi tiêu', icon: Receipt },
  { href: '/finance/wallets', label: 'Ví', icon: WalletIcon },
  { href: '/finance/investments', label: 'Đầu tư', icon: TrendingUp },
  { href: '/finance/savings', label: 'Tiết kiệm', icon: PiggyBank },
  { href: '/finance/currency', label: 'Tỷ giá', icon: ArrowLeftRight },
  { href: '/finance/reports', label: 'Báo cáo', icon: BarChart3 },
];
// Mobile bottom tabs (4 + center FAB)
const MOBILE_TABS: NavItem[] = [NAV[0], NAV[3], NAV[2], NAV[4]];

function isActive(pathname: string, href: string) {
  return href === '/finance' ? pathname === '/finance' : pathname.startsWith(href);
}

export function FinanceShell({ children, onQuickAddSuccess }: { children: ReactNode; onQuickAddSuccess?: () => void }) {
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const [quickAdd, setQuickAdd] = useState(false);

  if (isHydrated && !isAuthenticated) {
    return (
      <div className="pt-16 flex min-h-[70vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="text-4xl">🔒</div>
        <h1 className="font-heading text-xl font-bold text-text-primary">MoneyFlow là khu vực riêng tư</h1>
        <p className="max-w-sm text-sm text-text-muted">Đăng nhập để quản lý thu chi, khoản nợ và ví của riêng bạn. Chỉ bạn xem được dữ liệu này.</p>
        <Link href={`/login?next=${encodeURIComponent('/finance')}`} className="inline-flex items-center gap-2 rounded-xl bg-neon-violet px-5 py-2.5 text-sm font-medium text-white hover:bg-neon-violet/90">
          <LogIn size={16} /> Đăng nhập
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-[calc(100dvh-var(--app-chrome-bottom))]">
      <div className="mx-auto flex max-w-6xl gap-6 px-3 pb-24 sm:px-4 sm:pb-8">
        {/* Desktop sidebar */}
        <aside className="hidden md:block w-52 shrink-0 pt-4">
          <div className="sticky top-20">
            <div className="mb-3 flex items-center gap-2 px-2">
              <span className="text-lg">💸</span>
              <span className="font-heading text-lg font-bold text-text-primary">MoneyFlow</span>
            </div>
            <nav className="flex flex-col gap-0.5">
              {NAV.map((item) => {
                const active = isActive(pathname, item.href);
                const Icon = item.icon;
                if (item.soon) {
                  return (
                    <div key={item.href} className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-text-muted/60" title="Sắp có (Giai đoạn 2)">
                      <Icon size={18} /> <span>{item.label}</span>
                      <span className="ml-auto rounded-full bg-[var(--border-color)] px-1.5 py-0.5 text-[10px]">soon</span>
                    </div>
                  );
                }
                return (
                  <Link key={item.href} href={item.href}
                    className={cn('flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                      active ? 'bg-neon-violet/15 text-neon-violet' : 'text-text-secondary hover:bg-[var(--border-color)]')}>
                    <Icon size={18} /> <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <button onClick={() => setQuickAdd(true)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-neon-violet px-3 py-2.5 text-sm font-medium text-white hover:bg-neon-violet/90">
              <Plus size={16} /> Ghi nhanh
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1 pt-4">{children}</main>
      </div>

      {/* Mobile bottom tab bar + center FAB */}
      <nav className="md:hidden fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border-color)] bg-[var(--bg-card)]/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
        <div className="relative mx-auto grid max-w-md grid-cols-5 items-center px-2">
          {MOBILE_TABS.slice(0, 2).map((item) => <MobileTab key={item.href} item={item} pathname={pathname} />)}
          <div className="flex justify-center">
            <button onClick={() => setQuickAdd(true)} aria-label="Ghi nhanh"
              className="-mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-neon-violet text-white shadow-lg shadow-neon-violet/40 active:scale-95">
              <Plus size={26} />
            </button>
          </div>
          {MOBILE_TABS.slice(2).map((item) => <MobileTab key={item.href} item={item} pathname={pathname} />)}
        </div>
      </nav>

      <QuickAddSheet open={quickAdd} onClose={() => setQuickAdd(false)} onSuccess={onQuickAddSuccess} />
    </div>
  );
}

function MobileTab({ item, pathname }: { item: NavItem; pathname: string }) {
  const active = isActive(pathname, item.href);
  const Icon = item.icon;
  return (
    <Link href={item.href} className={cn('flex flex-col items-center gap-0.5 py-2 text-[10px]', active ? 'text-neon-violet' : 'text-text-muted')}>
      <Icon size={20} />
      <span>{item.label}</span>
    </Link>
  );
}
