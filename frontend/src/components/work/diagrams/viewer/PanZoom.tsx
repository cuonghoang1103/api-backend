'use client';

/**
 * CTW Diagram — KHUNG XEM PHÓNG/KÉO cho mọi sơ đồ (Mermaid, ERD của Database designer):
 *   - Phóng: nút − / + / 100% / Vừa khung, Ctrl/⌘ + lăn chuột (phóng quanh con trỏ), chụm hai ngón trên trackpad
 *     (Chrome/Edge gửi wheel + ctrlKey, Safari gửi gesturechange), chụm hai ngón trên màn hình cảm ứng.
 *   - Kéo: giữ chuột trái trên nền (hoặc phím Space + kéo, nút giữa), lăn chuột / vuốt hai ngón = cuộn ngang dọc.
 *   - Phím (khi khung đang được trỏ/chọn): + − phóng · 0 = 100% · 1 = vừa khung · mũi tên = dịch · F = phóng to toàn
 *     màn hình (nơi gọi xử lý).
 *   - Bản đồ nhỏ (minimap) cho sơ đồ to: thấy vị trí khung nhìn, bấm/kéo để nhảy.
 * Phần tử con có `data-pz-nodrag` (bảng ERD kéo được, nút…) không kích hoạt kéo nền.
 */

import { forwardRef, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { Map as MapIcon, Maximize2, Minimize2, Minus, Plus, Scan } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWT } from '@/components/work/i18n';

export interface PanZoomHandle {
  fit(): void;
  zoomTo(k: number): void;
  /** Đưa một vùng (toạ độ nội dung) vào giữa khung nếu đang khuất (hoặc luôn, nếu force). */
  reveal(rect: { x: number; y: number; w: number; h: number }, force?: boolean): void;
  scale(): number;
  /** Toạ độ màn hình ⇒ toạ độ nội dung. */
  toContent(clientX: number, clientY: number): { x: number; y: number };
}

interface View { x: number; y: number; k: number }

const MIN = 0.05;
const MAX = 4;
const clamp = (k: number) => Math.min(MAX, Math.max(MIN, k));

function readPref(key: string, fallback: boolean): boolean {
  try { const v = window.localStorage.getItem(key); return v === null ? fallback : v === '1'; } catch { return fallback; }
}
function writePref(key: string, v: boolean) { try { window.localStorage.setItem(key, v ? '1' : '0'); } catch { /* chế độ riêng tư */ } }

const PanZoom = forwardRef<PanZoomHandle, {
  children: ReactNode;
  /** Đổi ⇒ vừa khung lại (vd mở sơ đồ khác). Nội dung đổi do người đang gõ thì KHÔNG tự vừa khung. */
  fitKey?: string | number;
  className?: string;
  background?: string;
  label: string;
  /** Vẽ bản đồ nhỏ (thu nhỏ nội dung) — nhận kích thước nội dung. */
  minimap?: (size: { w: number; h: number }) => ReactNode;
  maximised?: boolean;
  onToggleMaximise?: () => void;
  onBackgroundClick?: () => void;
  /** Thanh công cụ thêm (đặt cạnh nút phóng). */
  extraTools?: ReactNode;
}>(function PanZoom({ children, fitKey, className, background, label, minimap, maximised, onToggleMaximise, onBackgroundClick, extraTools }, ref) {
  const { t } = useWT();
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const view = useRef<View>({ x: 0, y: 0, k: 1 });
  const [, force] = useState(0);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [showMap, setShowMap] = useState(false);
  const fitted = useRef<string | number | undefined | null>(null);
  const raf = useRef(0);
  useEffect(() => { setShowMap(readPref('ctw.dg.minimap', true)); }, []);

  const apply = useCallback(() => {
    if (inner.current) inner.current.style.transform = `translate(${view.current.x}px, ${view.current.y}px) scale(${view.current.k})`;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => force((n) => n + 1));
  }, []);
  const set = useCallback((v: View) => { view.current = { x: v.x, y: v.y, k: clamp(v.k) }; apply(); }, [apply]);

  const zoomAt = useCallback((k: number, cx?: number, cy?: number) => {
    const el = outer.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = cx === undefined ? r.width / 2 : cx - r.left;
    const py = cy === undefined ? r.height / 2 : cy - r.top;
    const v = view.current;
    const nk = clamp(k);
    set({ k: nk, x: px - ((px - v.x) * nk) / v.k, y: py - ((py - v.y) * nk) / v.k });
  }, [set]);

  const fit = useCallback(() => {
    const el = outer.current; const c = inner.current;
    if (!el || !c) return;
    const w = c.offsetWidth; const h = c.offsetHeight;
    const W = el.clientWidth; const H = el.clientHeight;
    if (!w || !h || !W || !H) return;
    const k = clamp(Math.min(1, Math.min((W - 32) / w, (H - 56) / h)));
    set({ k, x: (W - w * k) / 2, y: Math.max(16, (H - 40 - h * k) / 2) });
  }, [set]);

  useImperativeHandle(ref, () => ({
    fit,
    zoomTo: (k) => zoomAt(k),
    scale: () => view.current.k,
    toContent: (cx, cy) => {
      const r = outer.current!.getBoundingClientRect();
      const v = view.current;
      return { x: (cx - r.left - v.x) / v.k, y: (cy - r.top - v.y) / v.k };
    },
    reveal: (rc, forceIt) => {
      const el = outer.current;
      if (!el) return;
      const v = view.current;
      const W = el.clientWidth; const H = el.clientHeight;
      const sx = rc.x * v.k + v.x; const sy = rc.y * v.k + v.y;
      const inside = sx >= 0 && sy >= 0 && sx + rc.w * v.k <= W && sy + rc.h * v.k <= H;
      if (inside && !forceIt) return;
      const k = rc.w * v.k > W * 0.9 || rc.h * v.k > H * 0.9 ? clamp(Math.min((W * 0.8) / rc.w, (H * 0.8) / rc.h)) : v.k;
      set({ k, x: W / 2 - (rc.x + rc.w / 2) * k, y: H / 2 - (rc.y + rc.h / 2) * k });
    },
  }), [fit, zoomAt, set]);

  // Kích thước nội dung + khung; vừa khung lần đầu / khi fitKey đổi.
  useLayoutEffect(() => {
    const el = outer.current; const c = inner.current;
    if (!el || !c) return;
    const ro = new ResizeObserver(() => {
      const s = { w: c.offsetWidth, h: c.offsetHeight };
      setSize((o) => (o.w === s.w && o.h === s.h ? o : s));
      setBox((o) => (o.w === el.clientWidth && o.h === el.clientHeight ? o : { w: el.clientWidth, h: el.clientHeight }));
      if (s.w && s.h && fitted.current !== (fitKey ?? 'x')) { fitted.current = fitKey ?? 'x'; fit(); }
    });
    ro.observe(c); ro.observe(el);
    return () => ro.disconnect();
  }, [fit, fitKey]);
  useEffect(() => { fitted.current = null; }, [fitKey]);

  // Lăn chuột / chụm trackpad (passive: false để chặn trang cuộn theo).
  useEffect(() => {
    const el = outer.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
        const f = Math.exp(-e.deltaY * (e.deltaMode === 1 ? 0.05 : 0.0022));
        zoomAt(view.current.k * f, e.clientX, e.clientY);
      } else {
        const m = e.deltaMode === 1 ? 16 : 1;
        const dx = e.shiftKey && !e.deltaX ? e.deltaY : e.deltaX;
        const dy = e.shiftKey && !e.deltaX ? 0 : e.deltaY;
        set({ ...view.current, x: view.current.x - dx * m, y: view.current.y - dy * m });
      }
    };
    let g0 = 1; let k0 = 1;
    const onGs = (e: Event) => { e.preventDefault(); g0 = (e as unknown as { scale: number }).scale || 1; k0 = view.current.k; };
    const onGc = (e: Event) => { e.preventDefault(); const ge = e as unknown as { scale: number; clientX: number; clientY: number }; zoomAt(k0 * (ge.scale / g0), ge.clientX, ge.clientY); };
    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('gesturestart', onGs as EventListener);
    el.addEventListener('gesturechange', onGc as EventListener);
    return () => { el.removeEventListener('wheel', onWheel); el.removeEventListener('gesturestart', onGs as EventListener); el.removeEventListener('gesturechange', onGc as EventListener); };
  }, [zoomAt, set]);

  // Kéo nền / chụm hai ngón (pointer events)
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const drag = useRef<{ x: number; y: number; vx: number; vy: number; moved: boolean; id: number } | null>(null);
  const pinch = useRef<{ d: number; k: number; cx: number; cy: number } | null>(null);
  const space = useRef(false);
  const onPointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { d: Math.hypot(a.x - b.x, a.y - b.y), k: view.current.k, cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2 };
      drag.current = null;
      return;
    }
    const nodrag = !!target.closest('[data-pz-nodrag],button,a,input,select,textarea,[role="button"]');
    if ((e.button === 0 && (!nodrag || space.current)) || e.button === 1) {
      drag.current = { x: e.clientX, y: e.clientY, vx: view.current.x, vy: view.current.y, moved: false, id: e.pointerId };
      if (e.button === 1) e.preventDefault();
    }
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch.current && pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      zoomAt(pinch.current.k * (d / Math.max(1, pinch.current.d)), (a.x + b.x) / 2, (a.y + b.y) / 2);
      return;
    }
    const dg = drag.current;
    if (!dg || dg.id !== e.pointerId) return;
    const dx = e.clientX - dg.x; const dy = e.clientY - dg.y;
    if (!dg.moved && Math.hypot(dx, dy) < 3) return;
    // Chỉ bắt con trỏ khi đã thật sự kéo — bấm (không kéo) vẫn tới đúng phần tử con (chọn bảng trên ERD…).
    if (!dg.moved) { try { outer.current?.setPointerCapture(e.pointerId); } catch { /* */ } }
    dg.moved = true;
    set({ ...view.current, x: dg.vx + dx, y: dg.vy + dy });
  };
  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    const dg = drag.current;
    if (dg && dg.id === e.pointerId) {
      drag.current = null;
      if (!dg.moved && !(e.target as HTMLElement).closest('[data-pz-nodrag]')) onBackgroundClick?.();
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if ((e.target as HTMLElement).closest('input,textarea,select,[contenteditable="true"]')) return;
    const k = view.current.k;
    const step = 60;
    switch (e.key) {
      case '+': case '=': zoomAt(k * 1.2); break;
      case '-': case '_': zoomAt(k / 1.2); break;
      case '0': zoomAt(1); break;
      case '1': case '!': fit(); break;
      case 'ArrowLeft': set({ ...view.current, x: view.current.x + step }); break;
      case 'ArrowRight': set({ ...view.current, x: view.current.x - step }); break;
      case 'ArrowUp': set({ ...view.current, y: view.current.y + step }); break;
      case 'ArrowDown': set({ ...view.current, y: view.current.y - step }); break;
      case 'f': case 'F': if (onToggleMaximise && !e.metaKey && !e.ctrlKey && !e.altKey) { onToggleMaximise(); break; } return;
      case 'm': case 'M': if (minimap && !e.metaKey && !e.ctrlKey) { setShowMap((s) => { writePref('ctw.dg.minimap', !s); return !s; }); break; } return;
      case ' ': space.current = true; return;
      default: return;
    }
    e.preventDefault();
  };
  const onKeyUp = (e: React.KeyboardEvent) => { if (e.key === ' ') space.current = false; };

  const v = view.current;
  const pct = Math.round(v.k * 100);
  const big = size.w * v.k > box.w * 1.15 || size.h * v.k > box.h * 1.15;
  const mapW = 168;
  const mapK = size.w && size.h ? Math.min(mapW / size.w, 120 / size.h) : 0;
  const onMap = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const cx = (e.clientX - r.left) / mapK; const cy = (e.clientY - r.top) / mapK;
    set({ ...view.current, x: box.w / 2 - cx * view.current.k, y: box.h / 2 - cy * view.current.k });
  };

  return (
    <div
      ref={outer}
      className={cn('ctw-pz relative h-full w-full select-none overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-[var(--w-accent)] focus-visible:ring-inset', className)}
      style={{ background, touchAction: 'none', cursor: drag.current?.moved ? 'grabbing' : 'grab' }}
      tabIndex={0}
      role="region"
      aria-label={`${label} — ${t('dbd.pzHelp')}`}
      onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown} onKeyUp={onKeyUp}
      onDoubleClick={(e) => { if (!(e.target as HTMLElement).closest('[data-pz-nodrag]')) zoomAt(view.current.k * 1.6, e.clientX, e.clientY); }}
    >
      <div ref={inner} className="absolute left-0 top-0 origin-top-left will-change-transform" style={{ transform: `translate(${v.x}px, ${v.y}px) scale(${v.k})` }}>
        {children}
      </div>
      <div className="absolute bottom-2 right-2 z-10 flex items-center gap-0.5 rounded-[8px] border border-[var(--w-border)] bg-[var(--w-panel)] p-0.5 text-[var(--w-text-2)]" style={{ boxShadow: 'var(--w-shadow-pop)' }} data-pz-nodrag="" onPointerDown={(e) => e.stopPropagation()}>
        {extraTools}
        <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" onClick={() => zoomAt(v.k / 1.25)} aria-label={t('dbd.zoomOut')} title={`${t('dbd.zoomOut')} (−)`}><Minus size={14} /></button>
        <button type="button" className="min-w-[46px] rounded-[6px] px-1 py-0.5 text-center font-mono text-[11.5px] tabular-nums hover:bg-[var(--w-hover)]" onClick={() => zoomAt(1)} aria-label={t('dbd.zoom100')} title={`${t('dbd.zoom100')} (0)`}>{pct}%</button>
        <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" onClick={() => zoomAt(v.k * 1.25)} aria-label={t('dbd.zoomIn')} title={`${t('dbd.zoomIn')} (+)`}><Plus size={14} /></button>
        <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" onClick={fit} aria-label={t('dbd.fit')} title={`${t('dbd.fit')} (1)`}><Scan size={14} /></button>
        {minimap && <button type="button" className={cn('w-btn w-btn-ghost w-btn-icon w-btn-sm', showMap && 'text-[var(--w-accent-text)]')} aria-pressed={showMap} onClick={() => setShowMap((s) => { writePref('ctw.dg.minimap', !s); return !s; })} aria-label={t('dbd.minimap')} title={`${t('dbd.minimap')} (M)`}><MapIcon size={14} /></button>}
        {onToggleMaximise && <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" onClick={onToggleMaximise} aria-pressed={!!maximised} aria-label={maximised ? t('dbd.restoreSize') : t('dbd.maximise')} title={`${maximised ? t('dbd.restoreSize') : t('dbd.maximise')} (F)`}>{maximised ? <Minimize2 size={14} /> : <Maximize2 size={14} />}</button>}
      </div>
      {minimap && showMap && big && mapK > 0 && box.w > 420 && (
        <div className="absolute bottom-12 right-2 z-10 overflow-hidden rounded-[8px] border border-[var(--w-border)] bg-[var(--w-panel)]" style={{ width: size.w * mapK + 8, height: size.h * mapK + 8, boxShadow: 'var(--w-shadow-pop)', cursor: 'pointer' }}
          data-pz-nodrag="" aria-hidden="true"
          onPointerDown={(e) => { e.stopPropagation(); e.currentTarget.setPointerCapture(e.pointerId); onMap(e); }}
          onPointerMove={(e) => { if (e.buttons & 1) onMap(e); }}>
          <div className="pointer-events-none absolute left-1 top-1 origin-top-left" style={{ width: size.w, height: size.h, transform: `scale(${mapK})` }}>{minimap(size)}</div>
          <div className="pointer-events-none absolute rounded-[2px] border-2 border-[var(--w-accent)] bg-[var(--w-accent-soft)]" style={{
            left: 4 + Math.max(0, (-v.x / v.k) * mapK), top: 4 + Math.max(0, (-v.y / v.k) * mapK),
            width: Math.min(size.w * mapK, (box.w / v.k) * mapK), height: Math.min(size.h * mapK, (box.h / v.k) * mapK), opacity: 0.6,
          }} />
        </div>
      )}
    </div>
  );
});

export default PanZoom;
