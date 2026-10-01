'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookMarked, Check, ChevronLeft, ChevronRight, Clock, Compass, FolderGit2, X } from 'lucide-react';
import { dinhDangThoiGian, trangThai, type MonHoc, type TienDoKhoa } from './chung';
import { NEN_PHU, NhanMon, NutHoc, VongTienDo } from './PhanTu';

/**
 * Hộp chi tiết một môn. Bọc bởi <AnimatePresence> ở CourseRoadmap.
 * Chống "lớp phủ ma": exit đặt `pointerEvents: 'none'` NGAY khi bắt đầu đóng, nên kể cả
 * khi hiệu ứng đóng bị kẹt, lớp phủ trong suốt không nuốt cú bấm của trang bên dưới.
 * z-[130]: trên mọi nút nổi toàn cục (robot AI z-100, MiniChatDock z-120).
 */
export default function HopMon({
  ds,
  viTri,
  tienDo,
  coTienDo,
  daDangNhap,
  onDoi,
  onDong,
}: {
  ds: MonHoc[];
  viTri: number;
  tienDo: Record<string, TienDoKhoa>;
  coTienDo: boolean;
  daDangNhap: boolean;
  onDoi: (viTri: number) => void;
  onDong: () => void;
}) {
  const mon = ds[viTri];
  const truoc = viTri > 0 ? ds[viTri - 1] : undefined;
  const sau = viTri < ds.length - 1 ? ds[viTri + 1] : undefined;
  const td = mon ? tienDo[mon.slug] : undefined;
  const tt = trangThai(td);
  const hopRef = useRef<HTMLDivElement>(null);
  const cuonRef = useRef<HTMLDivElement>(null);

  // Giữ hàm mới nhất cho listener phím mà không gắn lại listener mỗi lần đổi môn.
  const hanhDong = useRef({ onDong, onDoi, viTri, n: ds.length });
  hanhDong.current = { onDong, onDoi, viTri, n: ds.length };

  useEffect(() => {
    const truocDo = document.activeElement as HTMLElement | null;
    const tranCu = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    hopRef.current?.focus();
    const phim = (e: KeyboardEvent) => {
      const h = hanhDong.current;
      if (e.key === 'Escape') h.onDong();
      else if (e.key === 'ArrowLeft' && h.viTri > 0) h.onDoi(h.viTri - 1);
      else if (e.key === 'ArrowRight' && h.viTri < h.n - 1) h.onDoi(h.viTri + 1);
    };
    window.addEventListener('keydown', phim);
    return () => {
      window.removeEventListener('keydown', phim);
      document.body.style.overflow = tranCu;
      truocDo?.focus?.();
    };
  }, []);

  useEffect(() => {
    cuonRef.current?.scrollTo({ top: 0 });
  }, [viTri]);

  if (!mon) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[130] flex items-end sm:items-center justify-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, pointerEvents: 'none' }}
      transition={{ duration: 0.18 }}
    >
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[3px]" onClick={onDong} aria-hidden />
      <motion.div
        ref={hopRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="hop-mon-ten"
        tabIndex={-1}
        className="relative w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[86vh] flex flex-col rounded-t-2xl sm:rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-2xl outline-none overflow-hidden"
        initial={{ y: 40, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 24, scale: 0.98 }}
        transition={{ type: 'tween', duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Đầu hộp nhuộm màu tầng/nghề */}
        <div
          className="relative shrink-0 px-5 pt-5 pb-4 text-white"
          style={{ background: `linear-gradient(135deg, ${mon.hex[0]}, ${mon.hex[1]})` }}
        >
          <div aria-hidden className="absolute inset-0 opacity-25 [background-image:radial-gradient(rgba(255,255,255,.5)_1px,transparent_1px)] [background-size:14px_14px]" />
          <div className="relative flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white/85">{mon.nhom}</p>
              <h2 id="hop-mon-ten" className="font-heading text-xl sm:text-2xl font-bold leading-tight mt-0.5 [text-shadow:0_1px_2px_rgba(0,0,0,.25)]">
                {mon.ten}
              </h2>
              <div className="mt-2 flex flex-wrap gap-1.5 [&>span]:bg-white/90">
                <NhanMon academy={mon.academy} khung={mon.khung} tuyChon={mon.tuyChon} />
              </div>
            </div>
            <button
              type="button"
              onClick={onDong}
              aria-label="Đóng"
              className="shrink-0 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div ref={cuonRef} className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 space-y-5">
          {/* Tiến độ */}
          <div className={`${NEN_PHU} rounded-xl p-3.5 flex items-center gap-3.5`}>
            {coTienDo && td ? (
              <>
                <VongTienDo id={`hop-${mon.slug}`} pct={td.pct} co={56} mau={tt === 'xong' ? ['#34d399', '#059669'] : mon.hex} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-text-primary">
                    {tt === 'xong' ? 'Bạn đã học xong khoá này' : `Bạn đã học ${td.pct}% khoá này`}
                  </p>
                  {td.baiGanNhat && (
                    <p className="text-[12.5px] text-text-secondary flex items-center gap-1 min-w-0 mt-0.5">
                      <BookMarked className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">Bài gần nhất: {td.baiGanNhat}</span>
                    </p>
                  )}
                </div>
              </>
            ) : (
              <>
                <span className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center" style={{ background: `${mon.hex[0]}26`, color: mon.hex[1] }}>
                  <Clock className="w-5 h-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-text-primary">
                    {daDangNhap ? 'Bạn chưa bắt đầu khoá này' : 'Đăng nhập để lưu tiến độ khoá này'}
                  </p>
                  <p className="text-[12.5px] text-text-secondary">
                    Ước lượng {dinhDangThoiGian(mon.tuan)} với 15–20 giờ mỗi tuần.
                  </p>
                </div>
              </>
            )}
          </div>

          {mon.lamDuoc.length > 0 && (
            <section>
              <h3 className="font-heading font-bold text-text-primary mb-2">Học xong bạn làm được gì</h3>
              <ul className="space-y-1.5">
                {mon.lamDuoc.map((y) => (
                  <li key={y} className="flex gap-2.5 text-[14px] text-text-secondary leading-snug">
                    <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-700 [.theme-dark_&]:text-emerald-400 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" strokeWidth={3} />
                    </span>
                    <span className="min-w-0">{y}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="rounded-xl border p-3.5" style={{ borderColor: `${mon.hex[0]}66`, background: `${mon.hex[0]}12` }}>
            <h3 className="font-heading font-bold text-text-primary flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 shrink-0" style={{ color: mon.hex[1] }} />
              Đóng góp cho dự án
            </h3>
            <p className="text-xs font-semibold text-text-muted mt-0.5">{mon.duAn}</p>
            <p className="text-[14px] text-text-secondary leading-relaxed mt-1.5">{mon.dongGop}</p>
          </section>

          <section>
            <h3 className="font-heading font-bold text-text-primary flex items-center gap-2 mb-1">
              <Compass className="w-4 h-4 text-violet-700 [.theme-dark_&]:text-neon-violet" /> Vì sao học ở vị trí này
            </h3>
            <p className="text-[14px] text-text-secondary leading-relaxed">{mon.viSao}</p>
          </section>

          {(truoc || sau) && (
            <nav className="grid grid-cols-2 gap-2" aria-label="Môn trước và môn sau">
              {truoc ? (
                <button
                  type="button"
                  onClick={() => onDoi(viTri - 1)}
                  className={`${NEN_PHU} rounded-xl p-2.5 text-left hover:ring-1 hover:ring-neon-violet/40 min-w-0`}
                >
                  <span className="flex items-center gap-1 text-[11px] text-text-muted">
                    <ChevronLeft className="w-3 h-3" /> Học trước
                  </span>
                  <span className="block text-[13px] font-semibold text-text-primary truncate">{truoc.ten}</span>
                </button>
              ) : (
                <span />
              )}
              {sau ? (
                <button
                  type="button"
                  onClick={() => onDoi(viTri + 1)}
                  className={`${NEN_PHU} rounded-xl p-2.5 text-right hover:ring-1 hover:ring-neon-violet/40 min-w-0`}
                >
                  <span className="flex items-center justify-end gap-1 text-[11px] text-text-muted">
                    Học sau <ChevronRight className="w-3 h-3" />
                  </span>
                  <span className="block text-[13px] font-semibold text-text-primary truncate">{sau.ten}</span>
                </button>
              ) : (
                <span />
              )}
            </nav>
          )}
        </div>

        <div className="shrink-0 border-t border-[var(--border-color)] px-5 py-3 flex items-center justify-between gap-2 flex-wrap">
          <Link href={`/courses/${mon.slug}`} className="text-sm font-medium text-text-secondary hover:text-violet-700 [.theme-dark_&]:hover:text-neon-violet">
            Xem trang giới thiệu khoá
          </Link>
          <NutHoc slug={mon.slug} td={td} to mau={mon.hex} />
        </div>
      </motion.div>
    </motion.div>
  );
}
