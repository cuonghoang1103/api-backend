'use client';

/**
 * Trình xem ảnh TRONG trang — kiểu Messenger (14/10/2026).
 *
 * Trước đây bấm ảnh trong tin nhắn là `<a target="_blank">`: web mở tab mới,
 * còn app desktop thì `setWindowOpenHandler` ⇒ `shell.openExternal` ⇒ ảnh bật
 * ra trình duyệt hệ thống. Nay ảnh mở ngay trên trang:
 *
 *   · nền tối phủ toàn màn hình, ảnh ở giữa, nét (ảnh gốc, `object-contain`)
 *   · đóng: ✕ · Esc · bấm ra nền
 *   · ← / → (phím hoặc nút) đi qua MỌI ảnh của hội thoại đang mở
 *   · phóng to: lăn chuột · nhấp đúp · chụm hai ngón; đang phóng thì kéo để dời
 *   · lưu ảnh: `luuAnhVeMay` — app desktop mở hộp thoại lưu, KHÔNG ra trình duyệt
 *
 * Một component cho cả web lẫn app desktop (app dùng lại nguyên cây messenger).
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Download, X, ZoomIn, ZoomOut } from 'lucide-react';
import toast from 'react-hot-toast';
import type { AnhTrongHoiThoai } from '@/lib/tinNhan/nhom';
import { luuAnhVeMay } from '@/lib/tinNhan/luuAnh';
import { cn } from '@/lib/utils';

const ZOOM_MIN = 1;
const ZOOM_MAX = 5;

export default function AnhLightbox({
  ds,
  chiSo,
  onDoi,
  onDong,
}: {
  ds: AnhTrongHoiThoai[];
  chiSo: number;
  onDoi: (i: number) => void;
  onDong: () => void;
}) {
  const anh = ds[chiSo];
  const [zoom, datZoom] = useState(1);
  const [dich, datDich] = useState({ x: 0, y: 0 });
  const [dangLuu, datDangLuu] = useState(false);
  const conTro = useRef(new Map<number, { x: number; y: number }>());
  const chum = useRef<{ kc: number; zoom: number } | null>(null);
  const keo = useRef<{ x: number; y: number; dx: number; dy: number } | null>(null);
  const daKeo = useRef(false);

  const coTruoc = chiSo > 0;
  const coSau = chiSo < ds.length - 1;

  // Đổi ảnh ⇒ về cỡ gốc.
  useEffect(() => { datZoom(1); datDich({ x: 0, y: 0 }); }, [chiSo]);

  const datZoomKep = useCallback((z: number) => {
    const k = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z));
    datZoom(k);
    if (k === 1) datDich({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    const phim = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopPropagation(); onDong(); }
      else if (e.key === 'ArrowLeft' && coTruoc) { e.stopPropagation(); onDoi(chiSo - 1); }
      else if (e.key === 'ArrowRight' && coSau) { e.stopPropagation(); onDoi(chiSo + 1); }
      else if (e.key === '+' || e.key === '=') datZoomKep(zoom * 1.5);
      else if (e.key === '-') datZoomKep(zoom / 1.5);
    };
    // capture: chặn trước mọi phím tắt của trang bên dưới (Esc đóng hội thoại…)
    window.addEventListener('keydown', phim, true);
    return () => window.removeEventListener('keydown', phim, true);
  }, [chiSo, coTruoc, coSau, onDoi, onDong, zoom, datZoomKep]);

  if (!anh || typeof document === 'undefined') return null;

  const luu = async () => {
    datDangLuu(true);
    try { await luuAnhVeMay(anh.url); } catch (e) { toast.error((e as Error).message || 'Không lưu được ảnh'); }
    finally { datDangLuu(false); }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    conTro.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    daKeo.current = false;
    if (conTro.current.size === 2) {
      const [a, b] = Array.from(conTro.current.values());
      chum.current = { kc: Math.hypot(a!.x - b!.x, a!.y - b!.y), zoom };
      keo.current = null;
    } else if (zoom > 1) {
      keo.current = { x: e.clientX, y: e.clientY, dx: dich.x, dy: dich.y };
    }
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!conTro.current.has(e.pointerId)) return;
    conTro.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (chum.current && conTro.current.size === 2) {
      const [a, b] = Array.from(conTro.current.values());
      const kc = Math.hypot(a!.x - b!.x, a!.y - b!.y);
      datZoomKep(chum.current.zoom * (kc / Math.max(1, chum.current.kc)));
      daKeo.current = true;
    } else if (keo.current) {
      const dx = e.clientX - keo.current.x;
      const dy = e.clientY - keo.current.y;
      if (Math.abs(dx) + Math.abs(dy) > 3) daKeo.current = true;
      datDich({ x: keo.current.dx + dx, y: keo.current.dy + dy });
    }
  };
  const onPointerUp = (e: React.PointerEvent) => {
    conTro.current.delete(e.pointerId);
    if (conTro.current.size < 2) chum.current = null;
    if (conTro.current.size === 0) keo.current = null;
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[300] flex flex-col bg-black/90 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Xem ảnh"
      data-testid="image-lightbox"
      onClick={(e) => { if (e.target === e.currentTarget) onDong(); }}
    >
      <div className="flex shrink-0 items-center gap-2 px-4 py-3 text-white" onClick={(e) => e.stopPropagation()}>
        <span className="text-[13px] tabular-nums text-white/70">{ds.length > 1 ? `${chiSo + 1} / ${ds.length}` : ''}</span>
        <div className="ml-auto flex items-center gap-1">
          <NutTron nhan="Thu nhỏ" onClick={() => datZoomKep(zoom / 1.5)} tat={zoom <= ZOOM_MIN}><ZoomOut className="h-5 w-5" /></NutTron>
          <NutTron nhan="Phóng to" onClick={() => datZoomKep(zoom * 1.5)} tat={zoom >= ZOOM_MAX}><ZoomIn className="h-5 w-5" /></NutTron>
          <NutTron nhan="Lưu ảnh" onClick={() => void luu()} tat={dangLuu}><Download className="h-5 w-5" /></NutTron>
          <NutTron nhan="Đóng" onClick={onDong}><X className="h-6 w-6" /></NutTron>
        </div>
      </div>

      <div
        className="relative flex min-h-0 flex-1 touch-none select-none items-center justify-center overflow-hidden"
        onClick={(e) => { if (e.target === e.currentTarget) onDong(); }}
        onWheel={(e) => { datZoomKep(zoom * (e.deltaY < 0 ? 1.15 : 1 / 1.15)); }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={anh.url}
          src={anh.url}
          alt={anh.ten}
          draggable={false}
          className={cn('max-h-full max-w-full object-contain transition-transform duration-75', zoom > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in')}
          style={{ transform: `translate(${dich.x}px, ${dich.y}px) scale(${zoom})` }}
          onDoubleClick={() => datZoomKep(zoom > 1 ? 1 : 2.5)}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        />
        {coTruoc && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onDoi(chiSo - 1); }}
            className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="Ảnh trước"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}
        {coSau && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onDoi(chiSo + 1); }}
            className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="Ảnh sau"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}
      </div>

      {ds.length > 1 && (
        <div className="flex shrink-0 justify-center gap-1.5 overflow-x-auto px-4 py-3" onClick={(e) => e.stopPropagation()}>
          {ds.map((a, i) => (
            <button
              key={`${a.tinId}-${a.url}`}
              type="button"
              onClick={() => onDoi(i)}
              className={cn('h-12 w-12 shrink-0 overflow-hidden rounded-lg ring-2 transition', i === chiSo ? 'ring-white' : 'opacity-50 ring-transparent hover:opacity-90')}
              aria-label={`Ảnh ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={a.url} alt="" className="h-full w-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body,
  );
}

function NutTron({ nhan, onClick, tat, children }: { nhan: string; onClick: () => void; tat?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={tat}
      title={nhan}
      aria-label={nhan}
      className="flex h-10 w-10 items-center justify-center rounded-full text-white/85 transition-colors hover:bg-white/15 hover:text-white disabled:opacity-35"
    >
      {children}
    </button>
  );
}
