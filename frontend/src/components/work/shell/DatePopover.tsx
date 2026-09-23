'use client';

/**
 * Lịch tháng gọn cho ô ngày của CT Work (thay <input type="date"> gốc, vốn mỗi
 * trình duyệt một kiểu và lệch màu theme). Giá trị luôn là chuỗi YYYY-MM-DD
 * (ngày thuần, không múi giờ) — giống API.
 *
 * Bàn phím: mũi tên = ±1 ngày / ±1 tuần · PageUp/PageDown = ±1 tháng ·
 * Home/End = đầu/cuối tuần · Enter/Space = chọn · Esc do Popover bên ngoài đóng.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

/** Ngày thuần (năm, tháng 0-11, ngày) — tránh lệch múi giờ khi dùng Date. */
interface Ymd { y: number; m: number; d: number }

export function parseYmd(v: string | null | undefined): Ymd | null {
  if (!v) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(v);
  if (!m) return null;
  return { y: Number(m[1]), m: Number(m[2]) - 1, d: Number(m[3]) };
}

export function toYmd(x: Ymd): string {
  return `${x.y}-${String(x.m + 1).padStart(2, '0')}-${String(x.d).padStart(2, '0')}`;
}

function todayYmd(): Ymd {
  const n = new Date();
  return { y: n.getFullYear(), m: n.getMonth(), d: n.getDate() };
}

function addDays(x: Ymd, n: number): Ymd {
  const t = new Date(Date.UTC(x.y, x.m, x.d + n));
  return { y: t.getUTCFullYear(), m: t.getUTCMonth(), d: t.getUTCDate() };
}

function addMonths(x: Ymd, n: number): Ymd {
  const first = new Date(Date.UTC(x.y, x.m + n, 1));
  const y = first.getUTCFullYear();
  const m = first.getUTCMonth();
  const last = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  return { y, m, d: Math.min(x.d, last) };
}

const same = (a: Ymd | null, b: Ymd | null) => !!a && !!b && a.y === b.y && a.m === b.m && a.d === b.d;

/** "Sep 26, 2026" — hiển thị ngày thuần, không phụ thuộc múi giờ máy. */
export function formatYmd(v: string | null | undefined): string {
  const x = parseYmd(v);
  if (!x) return '';
  return new Date(Date.UTC(x.y, x.m, x.d)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

export default function DatePopover({ value, onChange, onClose }: {
  value: string | null;
  onChange: (v: string | null) => void;
  onClose: () => void;
}) {
  const selected = parseYmd(value);
  const today = useMemo(todayYmd, []);
  const [focus, setFocus] = useState<Ymd>(selected ?? today);
  const gridRef = useRef<HTMLDivElement>(null);

  // Tuần bắt đầu thứ Hai; luôn 6 hàng để popover không nhảy chiều cao.
  const days = useMemo(() => {
    const first = new Date(Date.UTC(focus.y, focus.m, 1));
    const offset = (first.getUTCDay() + 6) % 7;
    const start = addDays({ y: focus.y, m: focus.m, d: 1 }, -offset);
    return Array.from({ length: 42 }, (_, i) => addDays(start, i));
  }, [focus.y, focus.m]);

  // Giữ tiêu điểm bàn phím trên ô đang chọn.
  useEffect(() => {
    const el = gridRef.current?.querySelector<HTMLButtonElement>('button[data-focus="true"]');
    el?.focus({ preventScroll: true });
  }, [focus]);

  const pick = (x: Ymd | null) => {
    onChange(x ? toYmd(x) : null);
    onClose();
  };

  const onKey = (e: React.KeyboardEvent) => {
    const map: Record<string, () => Ymd> = {
      ArrowLeft: () => addDays(focus, -1),
      ArrowRight: () => addDays(focus, 1),
      ArrowUp: () => addDays(focus, -7),
      ArrowDown: () => addDays(focus, 7),
      PageUp: () => addMonths(focus, e.shiftKey ? -12 : -1),
      PageDown: () => addMonths(focus, e.shiftKey ? 12 : 1),
      Home: () => addDays(focus, -((new Date(Date.UTC(focus.y, focus.m, focus.d)).getUTCDay() + 6) % 7)),
      End: () => addDays(focus, 6 - ((new Date(Date.UTC(focus.y, focus.m, focus.d)).getUTCDay() + 6) % 7)),
    };
    if (map[e.key]) {
      e.preventDefault();
      setFocus(map[e.key]());
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      pick(focus);
    }
  };

  const monthLabel = new Date(Date.UTC(focus.y, focus.m, 1)).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });

  return (
    <div className="p-2.5" role="dialog" aria-label="Choose a date">
      <div className="mb-2 flex items-center justify-between">
        <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label="Previous month" onClick={() => setFocus(addMonths(focus, -1))}>
          <ChevronLeft size={15} />
        </button>
        <div className="text-[13px] font-semibold" aria-live="polite">{monthLabel}</div>
        <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label="Next month" onClick={() => setFocus(addMonths(focus, 1))}>
          <ChevronRight size={15} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center text-[11px] font-medium text-[var(--w-text-3)]">
        {WEEKDAYS.map((w) => <div key={w} className="py-1">{w}</div>)}
      </div>
      <div ref={gridRef} role="grid" onKeyDown={onKey} className="grid grid-cols-7 gap-0.5">
        {days.map((x) => {
          const inMonth = x.m === focus.m;
          const isSel = same(x, selected);
          const isToday = same(x, today);
          const isFocus = same(x, focus);
          return (
            <button
              key={toYmd(x)}
              type="button"
              role="gridcell"
              aria-selected={isSel}
              aria-label={formatYmd(toYmd(x))}
              data-focus={isFocus}
              tabIndex={isFocus ? 0 : -1}
              onClick={() => pick(x)}
              className={cn(
                'relative flex h-8 items-center justify-center rounded-[6px] text-[13px] tabular-nums outline-none transition-colors',
                isSel
                  ? 'bg-[var(--w-accent)] font-semibold text-white'
                  : inMonth ? 'text-[var(--w-text)] hover:bg-[var(--w-hover)]' : 'text-[var(--w-text-3)] hover:bg-[var(--w-hover)]',
                isFocus && !isSel && 'ring-1 ring-[var(--w-accent-border)]',
                'focus-visible:ring-2 focus-visible:ring-[var(--w-accent-border)]',
              )}
            >
              {x.d}
              {isToday && !isSel && <span aria-hidden="true" className="absolute bottom-[3px] h-[3px] w-[3px] rounded-full bg-[var(--w-accent)]" />}
            </button>
          );
        })}
      </div>
      <div className="mt-2 flex items-center justify-between border-t border-[var(--w-border)] pt-2">
        <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={() => pick(today)}>Today</button>
        <button type="button" className="w-btn w-btn-ghost w-btn-sm" disabled={!value} onClick={() => pick(null)}>Clear</button>
      </div>
    </div>
  );
}
