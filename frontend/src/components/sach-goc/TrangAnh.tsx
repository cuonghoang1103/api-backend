'use client';

/**
 * Khung xem MỘT trang sách: vừa màn / vừa ngang, phóng to bằng hai ngón
 * (iPad, iPhone), Ctrl+cuộn hoặc chụm trên trackpad (laptop), chạm đúp để
 * phóng 2,5×, vuốt ngang để lật trang khi chưa phóng.
 *
 * Tự làm cử chỉ thay vì để trình duyệt phóng cả trang web: phóng cả trang thì
 * thanh công cụ và khung hướng dẫn cũng to theo, lật trang xong lại phải thu nhỏ.
 */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { taiTruocAnh, useAnhTrang } from './useSachRieng';
import st from './sachGoc.module.css';

const TI_LE = 1600 / 2259; // rộng / cao của ảnh trang
const Z_MAX = 4;
const kep = (z: number) => Math.min(Z_MAX, Math.max(1, z));

export function TrangAnh({
  p, fit, z, setZ, onPrev, onNext, daoMau,
}: {
  p: number;
  fit: 'man' | 'ngang';
  z: number;
  setZ: (z: number) => void;
  onPrev: () => void;
  onNext: () => void;
  daoMau: boolean;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [kt, setKt] = useState({ w: 0, h: 0 });
  const [tai, setTai] = useState<'dang' | 'xong' | 'loi'>('dang');
  const anh = useAnhTrang(p);
  // App: tải blob hỏng thì báo lỗi ngay (thẻ <img> không có src nên không tự báo).
  useEffect(() => { if (anh === 'loi') setTai('loi'); }, [anh]);
  const zRef = useRef(z);
  zRef.current = z;

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setKt({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    setKt({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  // Trang mới: về đầu trang, chưa phóng.
  useEffect(() => {
    setTai('dang');
    box.current?.scrollTo({ top: 0, left: 0 });
  }, [p]);

  // Tải trước hai trang kề để lật không phải chờ.
  useEffect(() => {
    if (tai !== 'xong') return;
    for (const q of [p + 1, p - 1]) if (q >= 1 && q <= 304) taiTruocAnh(q);
  }, [p, tai]);

  const baseW = fit === 'ngang' ? kt.w : Math.min(kt.w, kt.h * TI_LE);
  const w = Math.max(0, Math.round(baseW * z));

  /** Đổi mức phóng mà giữ nguyên điểm (cx, cy) — toạ độ trong khung — dưới ngón tay/chuột. */
  const phongQuanh = useCallback((zMoi: number, cx: number, cy: number) => {
    const el = box.current;
    if (!el) return;
    const z0 = zRef.current;
    const z1 = kep(zMoi);
    if (z1 === z0) return;
    const r = z1 / z0;
    const sl = (el.scrollLeft + cx) * r - cx;
    const stp = (el.scrollTop + cy) * r - cy;
    zRef.current = z1;
    setZ(z1);
    requestAnimationFrame(() => el.scrollTo({ left: sl, top: stp }));
  }, [setZ]);

  // Cử chỉ chạm: listener gốc với passive:false để chặn trình duyệt phóng cả trang.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let chum: { d0: number; z0: number } | null = null;
    let vuot: { x: number; y: number; t: number } | null = null;
    let chamTruoc = 0;
    const kc = (t: TouchList) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
    const giua = (t: TouchList) => {
      const r = el.getBoundingClientRect();
      return { x: (t[0].clientX + t[1].clientX) / 2 - r.left, y: (t[0].clientY + t[1].clientY) / 2 - r.top };
    };
    const start = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        chum = { d0: kc(e.touches), z0: zRef.current };
        vuot = null;
        e.preventDefault();
      } else if (e.touches.length === 1) {
        vuot = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now() };
      }
    };
    const move = (e: TouchEvent) => {
      if (chum && e.touches.length === 2) {
        e.preventDefault();
        const g = giua(e.touches);
        phongQuanh(chum.z0 * (kc(e.touches) / chum.d0), g.x, g.y);
      }
    };
    const end = (e: TouchEvent) => {
      if (chum && e.touches.length < 2) { chum = null; return; }
      if (!vuot || e.changedTouches.length !== 1) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - vuot.x;
      const dy = t.clientY - vuot.y;
      const nhanh = Date.now() - vuot.t < 600;
      if (zRef.current <= 1.01 && nhanh && Math.abs(dx) > 60 && Math.abs(dx) > 1.6 * Math.abs(dy)) {
        if (dx < 0) onNext(); else onPrev();
      } else if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
        const now = Date.now();
        if (now - chamTruoc < 320) {
          // Chặn chuột giả lập (dblclick) — không thì onDoubleClick phóng ngược lại ngay.
          e.preventDefault();
          const r = el.getBoundingClientRect();
          phongQuanh(zRef.current > 1.2 ? 1 : 2.5, t.clientX - r.left, t.clientY - r.top);
          chamTruoc = 0;
        } else chamTruoc = now;
      }
      vuot = null;
    };
    // Ctrl+cuộn / chụm trên trackpad (Safari & Chrome gửi wheel có ctrlKey).
    const wheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      const r = el.getBoundingClientRect();
      phongQuanh(zRef.current * Math.exp(-e.deltaY / 200), e.clientX - r.left, e.clientY - r.top);
    };
    el.addEventListener('touchstart', start, { passive: false });
    el.addEventListener('touchmove', move, { passive: false });
    el.addEventListener('touchend', end);
    el.addEventListener('wheel', wheel, { passive: false });
    // Safari iOS/iPadOS: chặn cử chỉ phóng CẢ TRANG khi chụm trong khung (ta tự phóng ảnh).
    const cu = (e: Event) => e.preventDefault();
    el.addEventListener('gesturestart', cu);
    el.addEventListener('gesturechange', cu);
    return () => {
      el.removeEventListener('gesturestart', cu);
      el.removeEventListener('gesturechange', cu);
      el.removeEventListener('touchstart', start);
      el.removeEventListener('touchmove', move);
      el.removeEventListener('touchend', end);
      el.removeEventListener('wheel', wheel);
    };
  }, [onNext, onPrev, phongQuanh]);

  return (
    <div
      ref={box}
      className={st.khungAnh}
      data-vua={fit}
      onDoubleClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        phongQuanh(z > 1.2 ? 1 : 2.5, e.clientX - r.left, e.clientY - r.top);
      }}
    >
      <div className={st.giay} style={{ width: w || undefined }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- ảnh riêng tư qua API có cookie, không qua next/image */}
        <img
          key={p}
          src={anh && anh !== 'loi' ? anh : undefined}
          alt={`Trang ${p} sách できる日本語`}
          width={1600}
          height={2259}
          draggable={false}
          className={`${st.anh} ${daoMau ? st.daoMau : ''}`}
          onLoad={() => setTai('xong')}
          onError={() => setTai('loi')}
        />
        {tai === 'dang' && <div className={st.dangTai} aria-busy="true">Đang tải trang {p}…</div>}
        {tai === 'loi' && <div className={st.dangTai} role="alert">Không tải được trang {p}. Kiểm tra mạng rồi lật lại.</div>}
      </div>
    </div>
  );
}
