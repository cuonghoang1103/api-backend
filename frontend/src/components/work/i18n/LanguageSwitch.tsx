'use client';

/**
 * CT Work — nút đổi ngôn ngữ giao diện + câu hỏi lần đầu + đồng bộ `<html lang>`.
 *
 * Nhãn ngôn ngữ LUÔN viết bằng chính ngôn ngữ đó ("Tiếng Việt", "English") — người không đọc được ngôn ngữ đang
 * hiển thị vẫn tìm ra lối về.
 */

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { toast } from 'sonner';
import { Monitor, Moon, Sun, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme, type ThemePreference } from '@/context/ThemeContext';
import { Dialog, Popover, useToggle } from '../ui';
import { siteLocale, useWorkLocaleStore, wt, type WorkLocale } from './index';

const OPTIONS: Array<{ id: WorkLocale; flag: string; label: string; short: string }> = [
  { id: 'vi', flag: '🇻🇳', label: 'Tiếng Việt', short: 'VI' },
  { id: 'en', flag: '🇬🇧', label: 'English', short: 'EN' },
];

async function choose(l: WorkLocale) {
  const ok = await useWorkLocaleStore.getState().setLocale(l);
  // Lỗi đọc theo ngôn ngữ VỪA chọn (store đã đổi) — đúng thứ người dùng muốn đọc.
  if (!ok) toast.error(wt('shell.languageSaveFailed'));
}

/**
 * Chip 🇻🇳/🇬🇧 — dùng trong menu tài khoản, ngăn kéo điện thoại và cài đặt cá nhân.
 * `menu` = nằm trong role="menu" ⇒ dùng group + menuitemradio (radiogroup trong menu là sai ARIA).
 * `withTheme` (18/10/2026, mặc định BẬT ngoài menu): vẽ luôn chip Sáng/Tối/Tự động ngay cạnh — chỗ nào đổi được
 * ngôn ngữ thì đổi được giao diện (ngăn kéo điện thoại trong WorkSidebar hưởng mà không phải sửa file đó).
 * Menu tài khoản và Cài đặt cá nhân đặt chip giao diện ở dòng riêng có nhãn ⇒ truyền `withTheme={false}`.
 */
export function WorkLanguageChip({ compact = false, menu = false, withTheme = !menu, className }: { compact?: boolean; menu?: boolean; withTheme?: boolean; className?: string }) {
  if (withTheme) {
    return (
      <div className={cn('flex flex-wrap items-center gap-1.5', className)}>
        <LanguageChip compact={compact} menu={menu} />
        <WorkThemeChip compact={compact} menu={menu} />
      </div>
    );
  }
  return <LanguageChip compact={compact} menu={menu} className={className} />;
}

function LanguageChip({ compact = false, menu = false, className }: { compact?: boolean; menu?: boolean; className?: string }) {
  const locale = useWorkLocaleStore((s) => s.locale);
  return (
    <div role={menu ? 'group' : 'radiogroup'} aria-label={`${wt('common.language')} / Language`} className={cn('inline-flex rounded-[7px] border border-[var(--w-border)] bg-[var(--w-sunken)] p-0.5', className)}>
      {OPTIONS.map((o) => {
        const on = locale === o.id;
        return (
          <button
            key={o.id}
            type="button"
            role={menu ? 'menuitemradio' : 'radio'}
            aria-checked={on}
            lang={o.id}
            title={o.label}
            onClick={() => { if (!on) void choose(o.id); }}
            className={cn(
              'inline-flex h-[26px] items-center gap-1.5 whitespace-nowrap rounded-[5px] px-2 text-[12px] font-medium transition-colors',
              on ? 'bg-[var(--w-panel)] text-[var(--w-text)] shadow-[0_0_0_1px_var(--w-border)]' : 'text-[var(--w-text-2)] hover:text-[var(--w-text)]',
            )}
          >
            <span aria-hidden="true">{o.flag}</span>
            <span>{compact ? o.short : o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Giao diện Sáng / Tối / Tự động (18/10/2026) ─────────────────────────────────────────────
// Nhãn viết thẳng hai thứ tiếng ở đây (như nhãn ngôn ngữ ở trên) thay vì thêm khoá vào từ điển: tooltip luôn song
// ngữ "Sáng · Light" để người không đọc được ngôn ngữ đang hiện vẫn hiểu. Lựa chọn đi qua ThemeContext của cả site
// (localStorage 'theme' + đồng bộ tài khoản; 'system' chỉ lưu ở máy này) ⇒ app desktop CT Work hưởng luôn.

const THEME_OPTIONS: Array<{ id: ThemePreference; Icon: LucideIcon; vi: string; en: string; hintVi: string; hintEn: string }> = [
  { id: 'light', Icon: Sun, vi: 'Sáng', en: 'Light', hintVi: 'Nền sáng', hintEn: 'Light background' },
  { id: 'dark', Icon: Moon, vi: 'Tối', en: 'Dark', hintVi: 'Nền tối', hintEn: 'Dark background' },
  { id: 'system', Icon: Monitor, vi: 'Tự động', en: 'Auto', hintVi: 'Theo hệ điều hành', hintEn: 'Match your system' },
];

function themeText(locale: WorkLocale) {
  const vi = locale === 'vi';
  return {
    group: vi ? 'Giao diện / Theme' : 'Theme / Giao diện',
    label: (o: (typeof THEME_OPTIONS)[number]) => (vi ? o.vi : o.en),
    hint: (o: (typeof THEME_OPTIONS)[number]) => (vi ? o.hintVi : o.hintEn),
    tip: (o: (typeof THEME_OPTIONS)[number]) => (vi ? `${o.vi} · ${o.en} — ${o.hintVi}` : `${o.en} · ${o.vi} — ${o.hintEn}`),
  };
}

/** Phím mũi tên trong nhóm nút: ←/→ (↑/↓) chuyển và CHỌN luôn, Home/End về đầu/cuối — kiểu radiogroup chuẩn. */
function arrowPick(e: KeyboardEvent<HTMLElement>, current: number, pick: (i: number) => void) {
  const n = THEME_OPTIONS.length;
  let next = -1;
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (current + 1) % n;
  else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (current - 1 + n) % n;
  else if (e.key === 'Home') next = 0;
  else if (e.key === 'End') next = n - 1;
  if (next < 0) return;
  e.preventDefault();
  pick(next);
  const btns = (e.currentTarget as HTMLElement).querySelectorAll<HTMLButtonElement>('button[data-theme-opt]');
  btns[next]?.focus();
}

/** Chữ hiện tên lựa chọn đang dùng — cho tiêu đề dòng "Giao diện" trong menu/cài đặt. */
export function useWorkThemeLabel(): string {
  const locale = useWorkLocaleStore((s) => s.locale);
  return themeText(locale).group.split(' / ')[0];
}

/**
 * Chip ☀️ Sáng · 🌙 Tối · 🖥 Tự động — cùng dáng chip ngôn ngữ. `compact` = chỉ icon (tooltip song ngữ vẫn có).
 * Nút nào đang chọn mới nằm trong vòng Tab (roving tabindex); mũi tên đổi lựa chọn.
 */
export function WorkThemeChip({ compact = false, menu = false, className }: { compact?: boolean; menu?: boolean; className?: string }) {
  const locale = useWorkLocaleStore((s) => s.locale);
  const { preference, setTheme } = useTheme();
  const tx = themeText(locale);
  const current = Math.max(0, THEME_OPTIONS.findIndex((o) => o.id === preference));
  const pick = (i: number) => { const o = THEME_OPTIONS[i]; if (o && o.id !== preference) setTheme(o.id); };
  return (
    <div
      role={menu ? 'group' : 'radiogroup'}
      aria-label={tx.group}
      onKeyDown={(e) => arrowPick(e, current, pick)}
      className={cn('inline-flex rounded-[7px] border border-[var(--w-border)] bg-[var(--w-sunken)] p-0.5', className)}
    >
      {THEME_OPTIONS.map((o, i) => {
        const on = i === current;
        return (
          <button
            key={o.id}
            type="button"
            data-theme-opt={o.id}
            role={menu ? 'menuitemradio' : 'radio'}
            aria-checked={on}
            aria-label={compact ? tx.tip(o) : undefined}
            tabIndex={on ? 0 : -1}
            title={tx.tip(o)}
            onClick={() => pick(i)}
            className={cn(
              'inline-flex h-[26px] items-center justify-center gap-1.5 whitespace-nowrap rounded-[5px] text-[12px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--w-accent-border)]',
              compact ? 'w-[28px]' : 'px-2',
              on ? 'bg-[var(--w-panel)] text-[var(--w-text)] shadow-[0_0_0_1px_var(--w-border)]' : 'text-[var(--w-text-2)] hover:text-[var(--w-text)]',
            )}
          >
            <o.Icon size={13} aria-hidden="true" className="shrink-0" />
            {!compact && <span>{tx.label(o)}</span>}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Nút giao diện trên thanh trên (HeaderTools, ≥md): icon của lựa chọn đang dùng; bấm ⇒ menu 3 lựa chọn.
 * Một ô 30px — vừa cả khổ app desktop hẹp, không chiếm chỗ của ô tìm/tên dự án.
 */
export function WorkThemeButton() {
  const locale = useWorkLocaleStore((s) => s.locale);
  const { preference, resolvedTheme, setTheme } = useTheme();
  const pop = useToggle();
  const ref = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const tx = themeText(locale);
  const current = Math.max(0, THEME_OPTIONS.findIndex((o) => o.id === preference));
  const cur = THEME_OPTIONS[current];
  // 'Tự động' vẽ icon màn hình; còn lại vẽ đúng mặt trời/mặt trăng.
  const Icon = cur.Icon;
  const now = resolvedTheme === 'dark' ? (locale === 'vi' ? 'đang tối' : 'now dark') : (locale === 'vi' ? 'đang sáng' : 'now light');
  const label = `${tx.group}: ${tx.label(cur)}${preference === 'system' ? ` (${now})` : ''}`;
  useEffect(() => {
    if (!pop.on) return;
    // Mở menu ⇒ đưa tiêu điểm vào lựa chọn đang dùng (dùng được hoàn toàn bằng bàn phím).
    const id = requestAnimationFrame(() => listRef.current?.querySelector<HTMLButtonElement>('button[aria-checked="true"]')?.focus());
    return () => cancelAnimationFrame(id);
  }, [pop.on]);
  const choose = (i: number) => {
    const o = THEME_OPTIONS[i];
    if (o && o.id !== preference) setTheme(o.id);
  };
  return (
    <>
      <button
        ref={ref}
        type="button"
        onClick={pop.toggle}
        aria-haspopup="menu"
        aria-expanded={pop.on}
        aria-label={label}
        title={label}
        className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[6px] text-[var(--w-text-2)] transition-colors hover:bg-[var(--w-hover)] hover:text-[var(--w-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--w-accent-border)]"
      >
        <Icon size={16} aria-hidden="true" />
      </button>
      <Popover open={pop.on} onClose={pop.close} anchorRef={ref} width={220} align="end">
        <div
          ref={listRef}
          role="menu"
          aria-label={tx.group}
          className="p-1"
          onKeyDown={(e) => {
            if (e.key === 'Tab') { pop.close(); return; }
            const btns = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>('button[data-theme-opt]'));
            const at = btns.indexOf(document.activeElement as HTMLButtonElement);
            const n = btns.length;
            let next = -1;
            if (e.key === 'ArrowDown') next = (at + 1) % n;
            else if (e.key === 'ArrowUp') next = (at - 1 + n) % n;
            else if (e.key === 'Home') next = 0;
            else if (e.key === 'End') next = n - 1;
            if (next >= 0) { e.preventDefault(); btns[next]?.focus(); }
          }}
        >
          <div className="px-2 pb-1 pt-1.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-[var(--w-text-3)]">{tx.group}</div>
          {THEME_OPTIONS.map((o, i) => {
            const on = i === current;
            return (
              <button
                key={o.id}
                type="button"
                role="menuitemradio"
                aria-checked={on}
                data-theme-opt={o.id}
                title={tx.tip(o)}
                onClick={() => { choose(i); pop.close(); ref.current?.focus(); }}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-[6px] px-2 py-1.5 text-left text-[13px] outline-none hover:bg-[var(--w-hover)] focus-visible:bg-[var(--w-hover)]',
                  on ? 'text-[var(--w-text)]' : 'text-[var(--w-text-2)]',
                )}
              >
                <o.Icon size={15} aria-hidden="true" className="shrink-0" />
                <span className="min-w-0 flex-1 leading-tight">
                  <span className="block font-medium">{tx.label(o)}</span>
                  <span className="block text-[11.5px] text-[var(--w-text-3)]">{tx.hint(o)}</span>
                </span>
                {on && <span aria-hidden="true" className="text-[var(--w-accent-text)]">✓</span>}
              </button>
            );
          })}
        </div>
      </Popover>
    </>
  );
}

/** Lần đầu vào CT Work (máy chủ báo chưa chọn): hỏi một lần, song ngữ. Đóng ngang = giữ ngôn ngữ đang hiện. */
export function FirstRunLanguagePrompt() {
  const serverLoaded = useWorkLocaleStore((s) => s.serverLoaded);
  const explicit = useWorkLocaleStore((s) => s.explicit);
  const locale = useWorkLocaleStore((s) => s.locale);
  const [closed, setClosed] = useState(false);
  const open = serverLoaded && explicit === null && !closed;
  const pick = (l: WorkLocale) => { setClosed(true); void choose(l); };
  return (
    <Dialog open={open} onClose={() => pick(locale)} width={440} title={<span>Bạn muốn dùng Tiếng Việt hay English?</span>}>
      <p className="text-[14px] leading-relaxed text-[var(--w-text-2)]" lang="vi">
        Chọn ngôn ngữ cho toàn bộ giao diện CT Work. Đổi lại bất cứ lúc nào ở menu tài khoản (góc trên bên phải) hoặc trong Cài đặt cá nhân.
      </p>
      <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--w-text-3)]" lang="en">
        Which language would you like CT Work in? You can change it any time from the account menu.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2.5">
        {OPTIONS.map((o) => (
          <button
            key={o.id}
            type="button"
            lang={o.id}
            onClick={() => pick(o.id)}
            className={cn(
              'flex flex-col items-center gap-1.5 rounded-[10px] border px-3 py-4 text-[14px] font-semibold transition-colors hover:border-[var(--w-accent-border)] hover:bg-[var(--w-accent-soft)]',
              locale === o.id ? 'border-[var(--w-accent-border)]' : 'border-[var(--w-border)]',
            )}
          >
            <span aria-hidden="true" className="text-[26px] leading-none">{o.flag}</span>
            {o.label}
          </button>
        ))}
      </div>
    </Dialog>
  );
}

/**
 * Giữ `<html lang>` đúng ngôn ngữ CT Work trong lúc ở /work. LocaleContext của site cũng ghi thuộc tính này (effect
 * của nó chạy SAU effect của con khi gắn lần đầu, và chạy lại khi site đổi ngôn ngữ) ⇒ canh bằng MutationObserver.
 * Rời /work ⇒ trả về ngôn ngữ của site.
 */
export function WorkLangSync() {
  const locale = useWorkLocaleStore((s) => s.locale);
  useEffect(() => {
    const html = document.documentElement;
    const apply = () => { if (html.lang !== locale) html.lang = locale; };
    apply();
    const mo = new MutationObserver(apply);
    mo.observe(html, { attributes: true, attributeFilter: ['lang'] });
    return () => { mo.disconnect(); };
  }, [locale]);
  useEffect(() => () => { document.documentElement.lang = siteLocale(); }, []);
  return null;
}
