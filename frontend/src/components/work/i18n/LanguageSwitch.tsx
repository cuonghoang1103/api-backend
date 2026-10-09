'use client';

/**
 * CT Work — nút đổi ngôn ngữ giao diện + câu hỏi lần đầu + đồng bộ `<html lang>`.
 *
 * Nhãn ngôn ngữ LUÔN viết bằng chính ngôn ngữ đó ("Tiếng Việt", "English") — người không đọc được ngôn ngữ đang
 * hiển thị vẫn tìm ra lối về.
 */

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Dialog } from '../ui';
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

/** Chip 🇻🇳/🇬🇧 — dùng trong menu tài khoản, ngăn kéo điện thoại và cài đặt cá nhân. */
/** `menu` = nằm trong role="menu" ⇒ dùng group + menuitemradio (radiogroup trong menu là sai ARIA). */
export function WorkLanguageChip({ compact = false, menu = false, className }: { compact?: boolean; menu?: boolean; className?: string }) {
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
