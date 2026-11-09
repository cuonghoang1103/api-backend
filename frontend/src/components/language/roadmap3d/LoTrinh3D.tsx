'use client';
/**
 * Khung React cho cảnh 3D lộ trình (sanKhauLoTrinh.ts): tải three.js khi vào tầm nhìn, dừng vẽ khi khuất /
 * tab ẩn, lùi về thông báo khi không có WebGL. Nhãn bài & tên chặng là HTML đặt lên canvas theo toạ độ cảnh
 * chiếu ra mỗi khung hình (ghi thẳng vào style, không qua state ⇒ không re-render 60 lần/giây).
 */
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { hoTro3D } from '../mascot/GauTruc3D';
import { MascotBubble } from '../mascot/MascotBubble';
import type { SanKhauLoTrinh, ViTriChang, ViTriNhan } from './sanKhauLoTrinh';
import type { ChangLoTrinh, NutLoTrinh } from './loTrinhData';
import s from './loTrinh.module.css';

export default function LoTrinh3D({
  code,
  chang,
  nut,
  tienDo,
  donVi,
  loiGau,
  onChon,
}: {
  code: string;
  chang: ChangLoTrinh[];
  nut: NutLoTrinh[];
  /** 0…1 dọc lộ trình (từ vị trí cuộn của danh sách). */
  tienDo: number;
  donVi: string;
  loiGau: string;
  onChon: (n: number) => void;
}) {
  const khungRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sk = useRef<SanKhauLoTrinh | null>(null);
  const nhanRef = useRef<(HTMLButtonElement | null)[]>([]);
  const changRef = useRef<(HTMLSpanElement | null)[]>([]);
  const bongRef = useRef<HTMLDivElement>(null);
  const nutRef = useRef(nut);
  nutRef.current = nut;
  const [hong, setHong] = useState(false);
  const [san, setSan] = useState(false);
  const [gan, setGan] = useState(false);
  const [lan, setLan] = useState(0);

  useEffect(() => { if (!hoTro3D()) setHong(true); }, []);

  useEffect(() => {
    const el = khungRef.current;
    if (!el || hong) return;
    if (typeof IntersectionObserver === 'undefined') { setGan(true); return; }
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { setGan(true); io.disconnect(); } }, { rootMargin: '200px' });
    io.observe(el);
    return () => io.disconnect();
  }, [hong]);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    let hen: ReturnType<typeof setTimeout> | undefined;
    const mat = (e: Event) => { e.preventDefault(); setSan(false); hen = setTimeout(() => { if (lan >= 2) setHong(true); else setLan((n) => n + 1); }, 400); };
    cv.addEventListener('webglcontextlost', mat);
    return () => { cv.removeEventListener('webglcontextlost', mat); clearTimeout(hen); };
  }, [lan, gan]);

  const hienTaiIdx = nut.findIndex((x) => x.hienTai);

  useEffect(() => {
    if (!gan || hong) return;
    let huy = false;
    const giam = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    import('./sanKhauLoTrinh')
      .then((m) => {
        if (huy || !canvasRef.current) return;
        sk.current = m.taoSanKhauLoTrinh(canvasRef.current, {
          code,
          chang,
          nut: nutRef.current,
          toi: document.documentElement.classList.contains('theme-dark'),
          giamChuyenDong: giam,
          onChon,
          onViTri: (ds: ViTriNhan[], cs: ViTriChang[]) => {
            const ht = nutRef.current.findIndex((x) => x.hienTai);
            for (let i = 0; i < ds.length; i++) {
              const el = nhanRef.current[i];
              if (!el) continue;
              const r = ds[i];
              if (r.an) { el.style.display = 'none'; continue; }
              el.style.display = '';
              // Gần máy quay to hơn, xa nhỏ & mờ dần.
              const ty = Math.max(0.72, Math.min(1.05, 1.9 - r.sau * 1.2));
              el.style.transform = `translate(${r.x.toFixed(1)}px, ${r.y.toFixed(1)}px) translate(-50%, -100%) scale(${ty.toFixed(3)})`;
              el.style.opacity = String(Math.max(0.35, Math.min(1, 2.6 - r.sau * 2)));
              el.style.zIndex = String(Math.round((1 - r.sau) * 1000));
              if (i === ht && bongRef.current) {
                bongRef.current.style.display = '';
                bongRef.current.style.transform = `translate(${r.x.toFixed(1)}px, ${(r.y - 34 * ty).toFixed(1)}px) translate(-50%, -100%)`;
              }
            }
            if (ht >= 0 && ds[ht]?.an && bongRef.current) bongRef.current.style.display = 'none';
            for (let i = 0; i < cs.length; i++) {
              const el = changRef.current[i];
              if (!el) continue;
              const r = cs[i];
              if (r.an) { el.style.display = 'none'; continue; }
              el.style.display = '';
              el.style.transform = `translate(${r.x.toFixed(1)}px, ${r.y.toFixed(1)}px) translate(-50%, -100%)`;
            }
          },
        });
        setSan(true);
      })
      .catch(() => { if (!huy) setHong(true); });
    return () => { huy = true; sk.current?.huy(); sk.current = null; };
    // Cảnh dựng một lần theo khoá; tiến độ/nút đẩy qua các effect dưới.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gan, hong, lan, code]);

  useEffect(() => { sk.current?.datTienDo(tienDo); }, [tienDo, san]);
  useEffect(() => { sk.current?.capNhatNut(nut); }, [nut, san]);

  // Theme đổi (nút sáng/tối của web) ⇒ chỉnh ánh sáng.
  useEffect(() => {
    if (!san) return;
    const html = document.documentElement;
    const ap = () => sk.current?.datTheme(html.classList.contains('theme-dark'));
    ap();
    const mo = new MutationObserver(ap);
    mo.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => mo.disconnect();
  }, [san]);

  useEffect(() => {
    const el = khungRef.current;
    if (!el || !san) return;
    let trongKhung = true;
    const capNhat = () => sk.current?.chay(trongKhung && document.visibilityState === 'visible');
    const io = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver((es) => { trongKhung = es.some((e) => e.isIntersecting); capNhat(); }) : null;
    io?.observe(el);
    document.addEventListener('visibilitychange', capNhat);
    return () => { io?.disconnect(); document.removeEventListener('visibilitychange', capNhat); };
  }, [san]);

  const mocChu = (x: NutLoTrinh) => x.loai === 'kiemtra' ? '🚩 Kiểm tra' : x.loai === 'thithu' ? (code === 'ja' ? '⛩️ Thi thử' : '🎯 Thi thử') : x.loai === 'khotu' ? '📚 Kho từ' : '';

  return (
    <div ref={khungRef} className={s.khung3d}>
      {hong ? (
        <div className={s.lui2d}>Máy này không vẽ được 3D — lộ trình hiện ở danh sách bên cạnh.</div>
      ) : (
        <>
          <canvas key={lan} ref={canvasRef} className={s.canvas} style={{ opacity: san ? 1 : 0, transition: 'opacity .6s ease' }} aria-hidden="true" />
          <div className={s.phu} aria-hidden="true">
            {chang.map((c, i) => (
              <span key={c.key} ref={(el) => { changRef.current[i] = el; }} className={s.nhanChang} style={{ '--c': c.mau, display: 'none' } as CSSProperties}>
                {c.ten}
              </span>
            ))}
            {nut.map((x, i) => {
              const c = chang[x.chang];
              const moc = mocChu(x);
              return (
                <button
                  key={x.n}
                  type="button"
                  ref={(el) => { nhanRef.current[i] = el; }}
                  tabIndex={-1}
                  onClick={() => onChon(x.n)}
                  className={`${s.nhan} ${x.xong ? s.nhanXong : ''} ${x.hienTai ? s.nhanHienTai : ''} ${moc ? s.nhanMoc : ''}`}
                  style={{ '--c': c?.mau ?? '#8b5cf6', display: 'none' } as CSSProperties}
                  title={`${donVi} ${x.so} — ${x.title}`}
                >
                  {x.xong && !x.hienTai ? '✓ ' : ''}{moc ? `${moc} · ` : ''}{donVi} {x.so}
                  {x.hienTai && <span className={s.nhanMo}>· {x.title}</span>}
                </button>
              );
            })}
            {hienTaiIdx >= 0 && (
              <div ref={bongRef} className={s.bong} style={{ display: 'none' }}>
                <MascotBubble character="bip" emotion={nut.every((x) => x.xong) ? 'cheer' : 'happy'} text={loiGau} />
              </div>
            )}
            <div className={s.goc}>
              {chang.map((c) => (
                <span key={c.key} className={s.chip} style={{ '--c': c.mau } as CSSProperties}><i className={s.chipCham} /> {c.ten} {c.xong}/{c.nut.length}</span>
              ))}
            </div>
            <span className={s.huongDan}>Cuộn danh sách để đi · kéo để xoay · bấm bệ để mở bài</span>
          </div>
        </>
      )}
    </div>
  );
}
