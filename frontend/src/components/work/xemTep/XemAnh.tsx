'use client';

/**
 * Trình xem tệp — ẢNH: vừa khung, thu phóng (nút, cuộn chuột/touchpad, chụm hai ngón, bấm đúp), kéo để di chuyển, xoay
 * 90°, về vừa khung. Phím: + / − / 0 / R. SVG cũng đi đường này — luôn bằng `<img>` (script trong SVG không chạy).
 *
 * Toạ độ: ảnh vẽ ở kích thước "vừa khung" (đã tính cả xoay), rồi `translate(x, y) scale(z) rotate(r)` quanh tâm khung.
 * Phóng quanh điểm p (tính từ tâm khung): giữ điểm ảnh dưới p đứng yên ⇒ o' = p − (p − o) · z'/z.
 */

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Minus, Plus, RotateCw, Scan } from 'lucide-react';
import { wt } from '@/components/work/i18n';
import { kepZoom } from './loaiTep';

/** Nút tròn trên thanh nổi nền tối. */
export const NUT = 'inline-flex h-8 w-8 items-center justify-center rounded-full text-white hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/70 disabled:opacity-40';

interface Props { src: string; alt: string; onError?: () => void }

export default function XemAnh({ src, alt, onError }: Props) {
  const khungRef = useRef<HTMLDivElement>(null);
  const [khung, setKhung] = useState({ w: 0, h: 0 });
  const [goc, setGoc] = useState<{ w: number; h: number } | null>(null);
  const [z, setZ] = useState(1);
  const [o, setO] = useState({ x: 0, y: 0 });
  const [r, setR] = useState(0);
  const [keo, setKeo] = useState(false);
  const st = useRef({ z: 1, o: { x: 0, y: 0 } });
  st.current = { z, o };

  // Đổi ảnh ⇒ về vừa khung.
  useEffect(() => { setZ(1); setO({ x: 0, y: 0 }); setR(0); setGoc(null); }, [src]);

  useLayoutEffect(() => {
    const el = khungRef.current;
    if (!el) return;
    const do_ = () => setKhung({ w: el.clientWidth, h: el.clientHeight });
    do_();
    const ro = new ResizeObserver(do_);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Kích thước vừa khung (ảnh nhỏ không phóng quá 100%).
  const xoayNgang = r % 180 !== 0;
  const pad = 24;
  const vua = goc && khung.w ? Math.min((khung.w - pad) / (xoayNgang ? goc.h : goc.w), (khung.h - pad) / (xoayNgang ? goc.w : goc.h), 1) : 1;
  const w = goc ? goc.w * vua : undefined;
  const h = goc ? goc.h * vua : undefined;

  /** Điểm (clientX, clientY) ⇒ toạ độ tính từ tâm khung. */
  const tuTam = (cx: number, cy: number) => {
    const b = khungRef.current!.getBoundingClientRect();
    return { x: cx - b.left - b.width / 2, y: cy - b.top - b.height / 2 };
  };
  const phongQuanh = useCallback((z2: number, p: { x: number; y: number }) => {
    const { z: z1, o: o1 } = st.current;
    const nz = kepZoom(z2);
    if (nz <= 1) { setZ(nz); setO({ x: 0, y: 0 }); return; }
    setZ(nz);
    setO({ x: p.x - ((p.x - o1.x) * nz) / z1, y: p.y - ((p.y - o1.y) * nz) / z1 });
  }, []);
  const veVua = useCallback(() => { setZ(1); setO({ x: 0, y: 0 }); }, []);

  // Cuộn: phóng quanh con trỏ (passive: false để chặn cuộn trang). Ctrl+cuộn của touchpad (chụm) cũng tới đây.
  useEffect(() => {
    const el = khungRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const k = Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0015));
      phongQuanh(st.current.z * k, tuTam(e.clientX, e.clientY));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [phongQuanh]);

  // Phím tắt riêng của ảnh (←/→/Esc do khung ngoài lo).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === '+' || e.key === '=') phongQuanh(st.current.z * 1.25, { x: 0, y: 0 });
      else if (e.key === '-' || e.key === '_') phongQuanh(st.current.z / 1.25, { x: 0, y: 0 });
      else if (e.key === '0') veVua();
      else if (e.key === 'r' || e.key === 'R') setR((x) => (x + 90) % 360);
      else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phongQuanh, veVua]);

  // Kéo (1 con trỏ) + chụm (2 con trỏ).
  const conTro = useRef(new Map<number, { x: number; y: number }>());
  const chum = useRef<{ d: number; z: number } | null>(null);
  const onDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    conTro.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (conTro.current.size === 2) {
      const [a, b] = [...conTro.current.values()];
      chum.current = { d: Math.hypot(a.x - b.x, a.y - b.y), z: st.current.z };
    }
    setKeo(true);
  };
  const onMove = (e: React.PointerEvent) => {
    const truoc = conTro.current.get(e.pointerId);
    if (!truoc) return;
    conTro.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (conTro.current.size >= 2 && chum.current) {
      const [a, b] = [...conTro.current.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      phongQuanh(chum.current.z * (d / Math.max(chum.current.d, 1)), tuTam((a.x + b.x) / 2, (a.y + b.y) / 2));
      return;
    }
    if (st.current.z <= 1) return; // vừa khung thì không kéo (vuốt để đổi tệp do khung ngoài lo)
    setO((p) => ({ x: p.x + e.clientX - truoc.x, y: p.y + e.clientY - truoc.y }));
  };
  const onUp = (e: React.PointerEvent) => {
    conTro.current.delete(e.pointerId);
    if (conTro.current.size < 2) chum.current = null;
    if (!conTro.current.size) setKeo(false);
  };

  const phanTram = Math.round(vua * z * 100);
  return (
    <div className="relative h-full w-full">
      <div
        ref={khungRef}
        className="absolute inset-0 touch-none select-none overflow-hidden"
        style={{ cursor: z > 1 ? (keo ? 'grabbing' : 'grab') : 'zoom-in' }}
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
        onDoubleClick={(e) => (z > 1.05 ? veVua() : phongQuanh(2.5, tuTam(e.clientX, e.clientY)))}
        data-testid="xem-anh"
      >
        <div className="absolute left-1/2 top-1/2" style={{ transform: `translate(-50%, -50%) translate(${o.x}px, ${o.y}px)` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src} alt={alt} draggable={false}
            onLoad={(e) => setGoc({ w: e.currentTarget.naturalWidth || 800, h: e.currentTarget.naturalHeight || 600 })}
            onError={onError}
            className="block max-w-none rounded-[2px] bg-[repeating-conic-gradient(#8881_0_25%,transparent_0_50%)] bg-[length:16px_16px]"
            style={{
              width: w, height: h, opacity: goc ? 1 : 0,
              transform: `scale(${z}) rotate(${r}deg)`, transition: keo ? 'none' : 'transform 120ms var(--w-ease)',
            }}
          />
        </div>
      </div>
      {/* Thanh công cụ nổi */}
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-0.5 rounded-full border border-white/10 bg-black/70 px-1.5 py-1 text-white shadow-lg backdrop-blur" onPointerDown={(e) => e.stopPropagation()}>
        <button type="button" className={NUT} aria-label={wt('xem.zoomOut')} title={`${wt('xem.zoomOut')} (−)`} onClick={() => phongQuanh(z / 1.25, { x: 0, y: 0 })}><Minus size={15} /></button>
        <span className="min-w-[46px] text-center text-[12px] tabular-nums" aria-live="polite" aria-label={wt('xem.zoomLevel', { p: phanTram })}>{phanTram}%</span>
        <button type="button" className={NUT} aria-label={wt('xem.zoomIn')} title={`${wt('xem.zoomIn')} (+)`} onClick={() => phongQuanh(z * 1.25, { x: 0, y: 0 })}><Plus size={15} /></button>
        <span className="mx-1 h-4 w-px bg-white/20" aria-hidden="true" />
        <button type="button" className={NUT} aria-label={wt('xem.rotate')} title={`${wt('xem.rotate')} (R)`} onClick={() => setR((x) => (x + 90) % 360)}><RotateCw size={15} /></button>
        <button type="button" className={NUT} aria-label={wt('xem.reset')} title={`${wt('xem.reset')} (0)`} onClick={() => { veVua(); setR(0); }}><Scan size={15} /></button>
      </div>
    </div>
  );
}
