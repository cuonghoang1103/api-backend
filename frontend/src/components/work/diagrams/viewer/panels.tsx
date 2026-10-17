'use client';

/**
 * CTW Diagram — BỐ CỤC STUDIO: danh sách (trái) · mã (giữa) · thông tin/lịch sử (phải) · bảng kiểm thiết kế (dưới) — mỗi ngăn
 * gập/mở được và KÉO VÁCH để đổi cỡ; chế độ "chỉ sơ đồ" (focus) và phóng to toàn khung (maximise). Kích thước + ngăn mở
 * được nhớ theo người dùng (localStorage, có try/catch — chế độ riêng tư/khung xem trước vẫn chạy với mặc định).
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface StudioLayout {
  listOpen: boolean; listW: number;
  sideOpen: boolean; sideW: number;
  codeOpen: boolean; codeW: number;
  lintOpen: boolean; lintH: number;
  focus: boolean;
}

const KEY = 'ctw.dg.layout.v1';
export const LIMITS = { listW: [200, 520], sideW: [240, 620], codeW: [260, 1100], lintH: [90, 520] } as const;

function defaults(): StudioLayout {
  const w = typeof window === 'undefined' ? 1600 : window.innerWidth;
  return {
    listOpen: true, listW: 280,
    sideOpen: w >= 1800, sideW: 300,
    codeOpen: w >= 1180, codeW: Math.round(Math.min(520, Math.max(320, w * 0.28))),
    lintOpen: false, lintH: 180,
    focus: false,
  };
}

const STATIC: StudioLayout = { listOpen: true, listW: 280, sideOpen: false, sideW: 300, codeOpen: true, codeW: 460, lintOpen: false, lintH: 180, focus: false };

function load(): StudioLayout {
  const d = defaults();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return d;
    const o = JSON.parse(raw) as Partial<StudioLayout>;
    const num = (k: keyof typeof LIMITS) => (typeof o[k] === 'number' ? Math.min(LIMITS[k][1], Math.max(LIMITS[k][0], o[k] as number)) : d[k]);
    const bool = (k: 'listOpen' | 'sideOpen' | 'codeOpen' | 'lintOpen' | 'focus') => (typeof o[k] === 'boolean' ? (o[k] as boolean) : d[k]);
    return { listOpen: bool('listOpen'), listW: num('listW'), sideOpen: bool('sideOpen'), sideW: num('sideW'), codeOpen: bool('codeOpen'), codeW: num('codeW'), lintOpen: bool('lintOpen'), lintH: num('lintH'), focus: bool('focus') };
  } catch { return d; }
}

/** Bố cục studio dùng chung (một bản cho cả trang; đồng bộ giữa các tab qua sự kiện storage). */
export function useStudioLayout(): [StudioLayout, (patch: Partial<StudioLayout>) => void] {
  // Lượt vẽ đầu dùng mặc định cố định (giống bản dựng ở máy chủ — tránh lệch hydrate), rồi mới đọc localStorage.
  const [s, setS] = useState<StudioLayout>(STATIC);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => { setS(load()); }, []);
  useEffect(() => {
    const on = (e: StorageEvent) => { if (e.key === KEY) setS(load()); };
    window.addEventListener('storage', on);
    return () => window.removeEventListener('storage', on);
  }, []);
  const patch = useCallback((p: Partial<StudioLayout>) => {
    setS((o) => {
      const n = { ...o, ...p };
      clearTimeout(timer.current);
      timer.current = setTimeout(() => { try { window.localStorage.setItem(KEY, JSON.stringify(n)); } catch { /* không lưu được — vẫn chạy */ } }, 250);
      return n;
    });
  }, []);
  return [s, patch];
}

/** Màn hình rộng ≥ px (cập nhật khi đổi cỡ cửa sổ). */
export function useMinWidth(px: number): boolean {
  const [ok, setOk] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${px}px)`);
    const on = () => setOk(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [px]);
  return ok;
}

/**
 * Vách kéo giữa hai ngăn. `side`: ngăn được đổi cỡ nằm bên nào của vách (left = kéo sang phải thì ngăn TRÁI to ra).
 * Bàn phím: ← → (↑ ↓ cho vách ngang) đổi 24px, Home/End = nhỏ/lớn nhất, Enter = gập/mở.
 */
export function Splitter({ value, min, max, onChange, side, onToggle, label, orientation = 'vertical', className }: {
  value: number; min: number; max: number; onChange: (v: number) => void; side: 'left' | 'right' | 'top' | 'bottom';
  onToggle?: () => void; label: string; orientation?: 'vertical' | 'horizontal'; className?: string;
}) {
  const start = useRef<{ p: number; v: number } | null>(null);
  const [active, setActive] = useState(false);
  const vertical = orientation === 'vertical';
  const sign = side === 'left' || side === 'top' ? 1 : -1;
  const clampV = (v: number) => Math.round(Math.min(max, Math.max(min, v)));
  return (
    <div
      role="separator" aria-orientation={vertical ? 'vertical' : 'horizontal'} aria-label={label} aria-valuemin={min} aria-valuemax={max} aria-valuenow={Math.round(value)} tabIndex={0}
      title={label}
      className={cn('group relative z-20 shrink-0 touch-none outline-none', vertical ? 'w-[7px] -mx-[3px] cursor-col-resize' : 'h-[7px] -my-[3px] cursor-row-resize', className)}
      onPointerDown={(e) => { if (e.button !== 0) return; e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId); start.current = { p: vertical ? e.clientX : e.clientY, v: value }; setActive(true); }}
      onPointerMove={(e) => { const s = start.current; if (!s) return; const d = (vertical ? e.clientX : e.clientY) - s.p; onChange(clampV(s.v + sign * d)); }}
      onPointerUp={() => { start.current = null; setActive(false); }}
      onPointerCancel={() => { start.current = null; setActive(false); }}
      onDoubleClick={() => onToggle?.()}
      onKeyDown={(e) => {
        const inc = (vertical ? (e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0) : (e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0)) * sign;
        if (inc) { e.preventDefault(); onChange(clampV(value + inc * 24)); return; }
        if (e.key === 'Home') { e.preventDefault(); onChange(min); }
        if (e.key === 'End') { e.preventDefault(); onChange(max); }
        if (e.key === 'Enter' && onToggle) { e.preventDefault(); onToggle(); }
      }}
    >
      <span className={cn('pointer-events-none absolute bg-[var(--w-border)] transition-colors group-hover:bg-[var(--w-accent)] group-focus-visible:bg-[var(--w-accent)]', active && '!bg-[var(--w-accent)]', vertical ? 'inset-y-0 left-[3px] w-px group-hover:w-[3px] group-hover:left-[2px]' : 'inset-x-0 top-[3px] h-px group-hover:h-[3px] group-hover:top-[2px]')} />
    </div>
  );
}
