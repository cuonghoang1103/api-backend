'use client';

/**
 * ⌘K — nhảy tới bất kỳ trang admin nào bằng bàn phím.
 *
 * 45 trang không nhớ hết vị trí được; gõ vài chữ nhanh hơn rê chuột dọc một
 * sidebar dài. Tìm không phân biệt dấu ("khoa hoc" ra "Courses" nhờ keywords
 * tiếng Việt trong nav.ts). ↑/↓ chọn, Enter mở, Esc đóng.
 *
 * Chuyển động duy nhất: hộp hiện ra (mờ → rõ, 0.98 → 1, 120ms) — để mắt thấy
 * nó là một lớp NẰM TRÊN trang, không phải trang mới.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, CornerDownLeft, Globe, LogOut, PanelLeft, Search } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ADMIN_NAV } from './nav';
import { useAdminT } from '../i18n';

interface Entry {
  id: string;
  label: string;
  group: string;
  icon: LucideIcon;
  hint?: string;
  haystack: string;
  run: () => void;
}

/** Bỏ dấu + thường hoá để "khoa hoc" khớp "khoá học". */
function fold(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'd').toLowerCase();
}

function score(e: Entry, q: string): number {
  if (!q) return 1;
  const label = fold(e.label);
  if (label.startsWith(q)) return 4;
  if (label.split(/\s+/).some((w) => w.startsWith(q))) return 3;
  if (label.includes(q)) return 2;
  // mọi từ trong truy vấn đều phải xuất hiện đâu đó
  return q.split(/\s+/).every((w) => e.haystack.includes(w)) ? 1 : 0;
}

export default function CommandPalette({
  open,
  onClose,
  onToggleSidebar,
  onLogout,
}: {
  open: boolean;
  onClose: () => void;
  onToggleSidebar: () => void;
  onLogout: () => void;
}) {
  const router = useRouter();
  const { t, vi } = useAdminT();
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const entries = useMemo<Entry[]>(() => {
    const pages: Entry[] = ADMIN_NAV.flatMap((g) =>
      g.items.map((it) => ({
        id: it.href,
        label: vi && it.vi ? it.vi : it.label,
        group: t('cmdGoTo'),
        icon: it.icon,
        hint: (vi ? g.viLabel ?? g.label : g.label) ?? undefined,
        haystack: fold(`${it.label} ${it.vi ?? ''} ${it.keywords ?? ''} ${it.href} ${g.label ?? ''}`),
        run: () => router.push(it.href),
      })),
    );
    const actions: Entry[] = [
      { id: 'act:sidebar', label: t('cmdToggleSidebar'), group: t('cmdActions'), icon: PanelLeft, hint: '[', haystack: 'toggle sidebar an hien thanh ben', run: onToggleSidebar },
      { id: 'act:site', label: t('cmdOpenSite'), group: t('cmdActions'), icon: Globe, haystack: 'open site ve trang chu public mo trang ngoai', run: () => window.open('/', '_blank') },
      { id: 'act:logout', label: t('logOut'), group: t('cmdActions'), icon: LogOut, haystack: 'log out sign out dang xuat', run: onLogout },
    ];
    return [...pages, ...actions];
  }, [router, onToggleSidebar, onLogout, t, vi]);

  const results = useMemo(() => {
    const fq = fold(q.trim());
    return entries
      .map((e, i) => ({ e, s: score(e, fq), i }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s || a.i - b.i)
      .map((x) => x.e);
  }, [entries, q]);

  useEffect(() => {
    if (!open) return;
    setQ('');
    setSel(0);
    // đợi khung vẽ xong rồi mới focus, không thì Safari bỏ qua
    const t = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(t);
  }, [open]);

  useEffect(() => { setSel(0); }, [q]);

  // Giữ hàng đang chọn trong tầm nhìn khi đi bằng phím.
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${sel}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [sel]);

  if (!open) return null;

  const choose = (e: Entry | undefined) => {
    if (!e) return;
    onClose();
    e.run();
  };

  const onKey = (ev: React.KeyboardEvent) => {
    if (ev.key === 'ArrowDown') { ev.preventDefault(); setSel((s) => Math.min(results.length - 1, s + 1)); }
    else if (ev.key === 'ArrowUp') { ev.preventDefault(); setSel((s) => Math.max(0, s - 1)); }
    else if (ev.key === 'Enter') { ev.preventDefault(); choose(results[sel]); }
    else if (ev.key === 'Escape') { ev.preventDefault(); onClose(); }
  };

  let lastGroup = '';

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[12vh]" onKeyDown={onKey}>
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-label="Command menu"
        className="a-pop relative w-full max-w-[580px] overflow-hidden rounded-[18px] border border-[var(--a-border-strong)] bg-[var(--a-raised)]"
        style={{ boxShadow: '0 0 0 1px rgba(0,0,0,.4), 0 24px 64px -12px rgba(0,0,0,.7)' }}
      >
        <div className="flex items-center gap-2.5 border-b border-[var(--a-border)] px-3.5">
          <Search className="h-4 w-4 shrink-0 text-[var(--a-text-3)]" strokeWidth={1.75} />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('cmdPlaceholder')}
            className="h-11 w-full bg-transparent text-[14px] text-[var(--a-text)] outline-none placeholder:text-[var(--a-text-3)]"
            aria-activedescendant={results[sel] ? `cmd-${sel}` : undefined}
          />
          <kbd className="a-kbd">esc</kbd>
        </div>

        <div ref={listRef} className="max-h-[min(60vh,420px)] overflow-y-auto p-1.5" role="listbox">
          {results.length === 0 ? (
            <p className="px-3 py-8 text-center text-[13px] text-[var(--a-text-3)]">{t('cmdNoResult')} “{q}”</p>
          ) : (
            results.map((e, idx) => {
              const header = e.group !== lastGroup ? e.group : null;
              lastGroup = e.group;
              const active = idx === sel;
              return (
                <div key={e.id}>
                  {header && (
                    <p className="px-2.5 pb-1 pt-2 text-[11px] font-medium text-[var(--a-text-3)]">{header}</p>
                  )}
                  <button
                    id={`cmd-${idx}`}
                    data-idx={idx}
                    role="option"
                    aria-selected={active}
                    onMouseMove={() => sel !== idx && setSel(idx)}
                    onClick={() => choose(e)}
                    className={`flex h-10 w-full items-center gap-2.5 rounded-[10px] px-2.5 text-left text-[13.5px] ${
                      active ? 'bg-[var(--a-active)] text-[var(--a-text)]' : 'text-[var(--a-text-2)]'
                    }`}
                  >
                    <e.icon className="h-4 w-4 shrink-0 text-[var(--a-text-3)]" strokeWidth={1.75} />
                    <span className="truncate">{e.label}</span>
                    {e.hint && <span className="ml-auto shrink-0 text-[12px] text-[var(--a-text-3)]">{e.hint}</span>}
                    {e.id === '/creator' && <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-[var(--a-text-3)]" />}
                    {active && <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-[var(--a-text-3)]" />}
                  </button>
                </div>
              );
            })
          )}
        </div>

        <div className="flex items-center gap-3 border-t border-[var(--a-border)] px-3.5 py-2 text-[11px] text-[var(--a-text-3)]">
          <span className="flex items-center gap-1"><kbd className="a-kbd">↑</kbd><kbd className="a-kbd">↓</kbd> {t('cmdNavigate')}</span>
          <span className="flex items-center gap-1"><kbd className="a-kbd">↵</kbd> {t('cmdOpen')}</span>
          <span className="ml-auto">{results.length} {t('cmdResults')}</span>
        </div>
      </div>
    </div>
  );
}
