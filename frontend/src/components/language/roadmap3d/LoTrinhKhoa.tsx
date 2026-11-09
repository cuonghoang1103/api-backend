'use client';
/**
 * Trang LỘ TRÌNH cho ngôn ngữ có KHOÁ CHÍNH (ja → Dekiru, en → IELTS, zh → CH): dựng thẳng từ `course.days`,
 * tiến độ thật từ useTienDo (localStorage + máy chủ). Hai cột trên máy tính: cảnh 3D dính bên trái, danh sách
 * 2D cuộn bên phải — cuộn tới đâu máy quay trượt tới đó, bấm bài ở đâu cũng mở `?buoi=<n>`. Điện thoại hoặc
 * máy không vẽ 3D: chỉ danh sách 2D có chuyển động (framer-motion) + gấu 2D chào.
 */
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { Route, Check, Play, ChevronRight, Lock } from 'lucide-react';
import { SectionShell, ProgressRing, useLangUser } from '@/components/language/primitives';
import { MascotRow } from '@/components/language/mascot/MascotScene';
import { useTienDo } from '@/components/sach-hoc/useTienDo';
import type { Course } from '@/components/sach-hoc/course';
import { KHOA_CHINH } from '@/lib/khoaChinh';
import { dungLoTrinh, loiBip, type NutLoTrinh } from './loTrinhData';
import LoTrinh3D from './LoTrinh3D';
import s from './loTrinh.module.css';

/** Khoá chính theo mã — tải chậm: mỗi khoá một chunk, trang chỉ kéo đúng khoá đang xem. */
const NAP_KHOA: Record<string, () => Promise<Course>> = {
  ja: () => import('@/app/language/[code]/dekiru/data').then((m) => m.DEKIRU),
  en: () => import('@/app/language/[code]/ielts/data').then((m) => m.IELTS),
  zh: () => import('@/app/language/[code]/ch/data').then((m) => m.CH),
};

export const coLoTrinhKhoa = (code: string) => !!NAP_KHOA[code] && !!KHOA_CHINH[code];

export default function LoTrinhKhoa({ code }: { code: string }) {
  const [course, setCourse] = useState<Course | null>(null);
  useEffect(() => {
    let alive = true;
    NAP_KHOA[code]?.().then((c) => { if (alive) setCourse(c); });
    return () => { alive = false; };
  }, [code]);
  if (!course) {
    return (
      <SectionShell code={code} title="Lộ trình" icon={<Route className="text-neon-violet" />}>
        <div className="flex items-center justify-center py-20 text-sm text-text-muted">Đang tải lộ trình…</div>
      </SectionShell>
    );
  }
  return <Than code={code} course={course} />;
}

function Than({ code, course }: { code: string; course: Course }) {
  const router = useRouter();
  const { isAuthenticated } = useLangUser();
  const { done } = useTienDo(isAuthenticated, course.stage, course.storageKey);
  const giam = useReducedMotion();
  const lt = useMemo(() => dungLoTrinh(code, course, done), [code, course, done]);
  const donVi = course.unit || 'Bài';
  const href = KHOA_CHINH[code].href;
  const moBai = useCallback((n: number) => router.push(`${href}?buoi=${n}`), [router, href]);
  const loi = useMemo(() => loiBip(lt, donVi), [lt, donVi]);

  /* Máy tính rộng ≥ 900px mới dựng 3D (bản 2D vẫn luôn có ở cột phải). */
  const [rong, setRong] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 900px)');
    const ap = () => setRong(mq.matches);
    ap();
    mq.addEventListener('change', ap);
    return () => mq.removeEventListener('change', ap);
  }, []);

  /* Cuộn danh sách ⇒ tiến độ 0…1 cho máy quay. */
  const dsRef = useRef<HTMLDivElement>(null);
  const hangRef = useRef<Map<number, HTMLElement>>(new Map());
  const [tienDo, setTienDo] = useState(0);
  useEffect(() => {
    if (!rong) return;
    let raf = 0;
    const tinh = () => {
      raf = 0;
      const N = lt.nut.length;
      if (N < 2) return;
      // Vạch ngắm ở 42% chiều cao màn hình. Đầu trang (scrollY = 0) ⇒ 0, bài cuối chạm vạch ⇒ 1 — ánh xạ
      // tuyến tính theo vị trí TÀI LIỆU của hàng đầu/cuối nên không nhảy khi hàng cao thấp khác nhau.
      const dau = hangRef.current.get(lt.nut[0].n), cuoi = hangRef.current.get(lt.nut[N - 1].n);
      if (!dau || !cuoi) return;
      const vach = window.innerHeight * 0.42;
      const yDau = dau.getBoundingClientRect().top + window.scrollY + dau.offsetHeight / 2;
      const yCuoi = cuoi.getBoundingClientRect().top + window.scrollY + cuoi.offsetHeight / 2;
      const dai = Math.max(1, yCuoi - yDau);
      const p0 = Math.max(0, Math.min(1, (vach - yDau) / dai));          // giá trị tại scrollY = 0
      const p = Math.max(0, Math.min(1, (window.scrollY + vach - yDau) / dai));
      setTienDo(p0 >= 1 ? 1 : Math.max(0, (p - p0) / (1 - p0)));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tinh); };
    tinh();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [rong, lt.nut]);

  // Lần đầu: cuộn danh sách tới bài đang học (nếu không ở đầu).
  const daCuon = useRef(false);
  useEffect(() => {
    if (daCuon.current || !lt.hienTai || lt.xong === 0) return;
    daCuon.current = true;
    const el = hangRef.current.get(lt.hienTai.n);
    if (el) setTimeout(() => el.scrollIntoView({ block: 'center', behavior: giam ? 'auto' : 'smooth' }), 300);
  }, [lt.hienTai, lt.xong, giam]);

  const mocChu = (x: NutLoTrinh) => x.loai === 'kiemtra' ? 'Kiểm tra chặng' : x.loai === 'thithu' ? 'Thi thử' : x.loai === 'khotu' ? 'Kho từ' : '';

  return (
    <SectionShell
      code={code}
      title="Lộ trình"
      icon={<Route className="text-neon-violet" />}
      right={lt.tong > 0 ? (
        <div className="flex items-center gap-2.5">
          <ProgressRing value={lt.pct} size={44} label={`${lt.pct}`} />
          <span className="text-sm text-text-muted">{lt.xong}/{lt.tong} {donVi.toLowerCase()}</span>
        </div>
      ) : undefined}
    >
      <p className="mb-4 text-sm text-text-secondary">
        <b className="text-text-primary">{KHOA_CHINH[code].ten}</b> — {KHOA_CHINH[code].capDo}. Lộ trình là chính các bài của khoá:
        bấm một bài để vào học, tiến độ lấy từ bài bạn đã hoàn thành.
      </p>

      <div className={s.khoi}>
        {/* Cột 3D — chỉ máy tính rộng */}
        {rong && (
          <aside className={s.canh} aria-hidden="true">
            <LoTrinh3D code={code} chang={lt.chang} nut={lt.nut} tienDo={tienDo} donVi={donVi} loiGau={loi} onChon={moBai} />
          </aside>
        )}

        {/* Danh sách 2D — luôn có (bàn phím, trình đọc màn hình, điện thoại) */}
        <div ref={dsRef} className={s.ds}>
          {!rong && (
            <div className={s.chao2d}>
              <MascotRow character="bip" emotion={lt.xong >= lt.tong && lt.tong > 0 ? 'cheer' : 'happy'} text={loi} size={72} />
            </div>
          )}
          {lt.chang.map((c, ci) => (
            <motion.section
              key={c.key}
              className={s.chang}
              style={{ '--c': c.mau } as CSSProperties}
              initial={giam ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.35, delay: Math.min(ci * 0.05, 0.2) }}
              aria-labelledby={`chang-${c.key}`}
            >
              <header className={s.changDau}>
                <span className={s.changSo} aria-hidden>{ci + 1}</span>
                <div className="min-w-0">
                  <h2 id={`chang-${c.key}`} className={s.changTen}>{c.ten}</h2>
                  {c.mota && <p className={s.changMo}>{c.mota}</p>}
                </div>
                <span className={s.changTien}>{c.xong}/{c.nut.length}</span>
              </header>
              <div className={s.thanh} aria-hidden><div className={s.thanhDay} style={{ width: `${c.nut.length ? (c.xong / c.nut.length) * 100 : 0}%` }} /></div>
              <ol className={`${s.hang} ${rong ? '' : s.doc}`}>
                {c.nut.map((x, i) => {
                  const moc = mocChu(x);
                  return (
                    <motion.li
                      key={x.n}
                      ref={(el) => { if (el) hangRef.current.set(x.n, el); else hangRef.current.delete(x.n); }}
                      initial={giam || rong ? false : { opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.25, delay: Math.min(i * 0.03, 0.3) }}
                    >
                      <Link
                        href={`${href}?buoi=${x.n}`}
                        className={`${s.bai} ${x.hienTai ? s.baiHienTai : ''}`}
                        aria-current={x.hienTai ? 'step' : undefined}
                      >
                        <span className={`${s.so} ${x.xong ? s.soXong : x.hienTai ? s.soHienTai : !x.sanSang ? s.soMo : ''}`} aria-hidden>
                          {x.xong ? <Check size={14} /> : x.hienTai ? <Play size={12} /> : x.so}
                        </span>
                        <span className={s.than}>
                          <span className={`${s.ten} ${!x.sanSang ? s.tenMo : ''}`}>
                            <span className="sr-only">{donVi} {x.so}{x.xong ? ', đã xong' : x.hienTai ? ', đang học' : ''}: </span>
                            {x.title}
                          </span>
                          {(moc || x.nhan || !x.sanSang) && (
                            <span className={s.phuNhan}>
                              {moc && <span className={s.moc}>{x.loai === 'thithu' ? '🎯' : x.loai === 'kiemtra' ? '🚩' : '📚'} {moc}</span>}
                              {x.nhan && <span className={`${s.moc} ${s.mocXam}`}>{x.nhan}</span>}
                              {!x.sanSang && <span className={`${s.moc} ${s.mocXam}`}><Lock size={10} /> sắp có</span>}
                            </span>
                          )}
                        </span>
                        <ChevronRight size={16} className={s.mui} aria-hidden />
                      </Link>
                    </motion.li>
                  );
                })}
              </ol>
            </motion.section>
          ))}
          {!isAuthenticated && <p className={s.ghiChu}>Đăng nhập để tiến độ đồng bộ giữa các máy — chưa đăng nhập thì lưu trên trình duyệt này.</p>}
        </div>
      </div>
    </SectionShell>
  );
}
