'use client';
/**
 * 🐼 <GauTruc3D> — khung React cho gấu trúc 3D (gau3d/dungGau.ts).
 *
 *   <GauTruc3D emotion="cheer" talking size={220} variant="bip" vayKey={n} />
 *
 * - three.js (~600 KB) chỉ tải khi gấu THẬT SỰ sắp hiện (IntersectionObserver + import() động) — không
 *   nằm trong gói của trang, không chặn render.
 * - Không WebGL / máy yếu (≤ 2 nhân, RAM < 2 GB) / mất ngữ cảnh WebGL 3 lần ⇒ lùi về ảnh 2D cũ (<Mascot>).
 * - prefers-reduced-motion ⇒ đứng yên, chỉ vẽ lại khi đổi cảm xúc.
 * - Khuất màn hình hoặc tab ẩn ⇒ dừng vòng vẽ.
 * - Miệng đồng bộ với giọng bập bẹ (giongGau.ts › docMieng) hoặc tự mấp máy khi `talking`.
 */
import { useEffect, useRef, useState } from 'react';
import { Mascot } from './mascot';
import type { Emotion, MascotId } from '@/lib/mascotData';
import type { CamXucGau, SanKhauGau, VariantGau } from './gau3d/dungGau';
import { dangNoi, docMieng } from './giongGau';

export type { CamXucGau, VariantGau };

/** Ánh xạ sang bộ ảnh 2D khi phải lùi. */
const LUI_2D: Record<CamXucGau, Emotion> = { happy: 'happy', cheer: 'cheer', sad: 'sad', think: 'think', surprised: 'wow', sleep: 'happy' };

let hoTroCache: boolean | null = null;
/** Máy có vẽ 3D được không — kiểm MỘT lần cho cả phiên. */
export function hoTro3D(): boolean {
  if (hoTroCache !== null) return hoTroCache;
  if (typeof window === 'undefined') return false;
  try {
    const nav = navigator as Navigator & { deviceMemory?: number };
    if ((nav.hardwareConcurrency ?? 4) <= 2 || (nav.deviceMemory ?? 4) < 2) return (hoTroCache = false);
    const cv = document.createElement('canvas');
    const gl = cv.getContext('webgl2') ?? cv.getContext('webgl');
    hoTroCache = !!gl;
    (gl as WebGLRenderingContext | null)?.getExtension('WEBGL_lose_context')?.loseContext();
    return hoTroCache;
  } catch {
    return (hoTroCache = false);
  }
}

export default function GauTruc3D({
  emotion = 'happy',
  talking = false,
  size = 200,
  variant = 'bip',
  vayKey,
  saoKey,
  className = '',
  nhinTheoTro = true,
  onClick,
  ariaLabel,
}: {
  emotion?: CamXucGau;
  /** Đang nói: miệng mấp máy (theo giọng nếu đang phát, không thì tự động). */
  talking?: boolean;
  /** Cạnh khung vuông (px). Truyền `0` để canvas lấp đầy khối cha (đặt kích thước qua className). */
  size?: number;
  variant?: VariantGau;
  /** Đổi giá trị ⇒ vẫy tay một lượt. */
  vayKey?: number;
  /** Đổi giá trị ⇒ bung sao một lượt. */
  saoKey?: number;
  className?: string;
  nhinTheoTro?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
}) {
  const khungRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sk = useRef<SanKhauGau | null>(null);
  const noiRef = useRef(talking);
  noiRef.current = talking;
  const [hong, setHong] = useState(false);
  const [san, setSan] = useState(false);
  const [gan, setGan] = useState(false); // sắp vào màn hình ⇒ mới tải three
  const [lan, setLan] = useState(0);     // dựng lại sau khi mất ngữ cảnh

  // Kiểm năng lực máy ở client (SSR không biết).
  useEffect(() => { if (!hoTro3D()) setHong(true); }, []);

  // Chỉ tải three.js khi gấu cách màn hình < 300px.
  useEffect(() => {
    const el = khungRef.current;
    if (!el || hong) return;
    if (typeof IntersectionObserver === 'undefined') { setGan(true); return; }
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { setGan(true); io.disconnect(); } }, { rootMargin: '300px' });
    io.observe(el);
    return () => io.disconnect();
  }, [hong]);

  // Mất ngữ cảnh WebGL (nhiều tab 3D) ⇒ dựng lại trên canvas mới; quá 3 lần ⇒ 2D.
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    let hen: ReturnType<typeof setTimeout> | undefined;
    const mat = (e: Event) => {
      e.preventDefault();
      setSan(false);
      hen = setTimeout(() => { if (lan >= 3) setHong(true); else setLan((n) => n + 1); }, 400);
    };
    cv.addEventListener('webglcontextlost', mat);
    return () => { cv.removeEventListener('webglcontextlost', mat); clearTimeout(hen); };
  }, [lan, gan]);

  useEffect(() => {
    if (!gan || hong) return;
    let huy = false;
    const giam = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    import('./gau3d/dungGau')
      .then((m) => {
        if (huy || !canvasRef.current) return;
        sk.current = m.taoSanKhauGau(canvasRef.current, {
          variant,
          giamChuyenDong: giam,
          docMieng: () => (noiRef.current || dangNoi() ? (dangNoi() ? docMieng() : -1) : -1),
          docDangNoi: () => noiRef.current,
          nhinTheoTro,
        });
        sk.current.datCamXuc(emotion);
        setSan(true);
      })
      .catch(() => { if (!huy) setHong(true); });
    return () => { huy = true; sk.current?.huy(); sk.current = null; };
    // variant/emotion đổi sau đó được đẩy qua các effect dưới — không dựng lại sân khấu.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gan, hong, lan]);

  useEffect(() => { sk.current?.datCamXuc(emotion); }, [emotion, san]);
  useEffect(() => { sk.current?.datVariant(variant); }, [variant, san]);
  useEffect(() => { if (vayKey) sk.current?.vay(); }, [vayKey, san]);
  useEffect(() => { if (saoKey) sk.current?.sao(); }, [saoKey, san]);

  // Dừng vẽ khi khuất màn hình hoặc tab ẩn.
  useEffect(() => {
    const el = khungRef.current;
    if (!el || !san) return;
    let trongKhung = true;
    const capNhat = () => sk.current?.chay(trongKhung && document.visibilityState === 'visible');
    const io = typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver((es) => { trongKhung = es.some((e) => e.isIntersecting); capNhat(); })
      : null;
    io?.observe(el);
    document.addEventListener('visibilitychange', capNhat);
    return () => { io?.disconnect(); document.removeEventListener('visibilitychange', capNhat); };
  }, [san]);

  const kich = size > 0 ? { width: size, height: size } : undefined;

  if (hong) {
    const id: MascotId = emotion === 'sleep' ? 'grumpy' : variant;
    return (
      <div ref={khungRef} className={`relative inline-flex items-end justify-center ${className}`} style={kich} onClick={onClick} role={onClick ? 'button' : undefined} aria-label={ariaLabel}>
        <Mascot character={id} emotion={LUI_2D[emotion]} size={size > 0 ? Math.round(size * 0.86) : 160} />
      </div>
    );
  }
  return (
    <div
      ref={khungRef}
      className={`relative inline-block select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={kich}
      onClick={onClick}
      role={onClick ? 'button' : 'img'}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
      aria-label={ariaLabel ?? 'Gấu trúc Bíp'}
    >
      {/* Ảnh 2D làm "khung chờ" cho tới khi WebGL vẽ khung đầu — không bao giờ có ô trống. */}
      {!san && (
        <div className="absolute inset-0 flex items-end justify-center opacity-70">
          <Mascot character={emotion === 'sleep' ? 'grumpy' : variant} emotion={LUI_2D[emotion]} size={size > 0 ? Math.round(size * 0.8) : 150} />
        </div>
      )}
      <canvas
        key={lan}
        ref={canvasRef}
        className="block h-full w-full transition-opacity duration-500"
        style={{ opacity: san ? 1 : 0, touchAction: 'pan-y' }}
        aria-hidden="true"
      />
    </div>
  );
}
