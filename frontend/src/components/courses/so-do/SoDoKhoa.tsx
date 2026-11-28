'use client';

/**
 * 🗺 Roadmap sơ đồ đầu khoá (28/11/2026) — kiểu roadmap.sh/backend.
 *
 *   • Trục dọc giữa: các CHƯƠNG (ô vàng) nối bằng đường liền; nhánh hai bên: BÀI (ô nhạt) nối bằng đường chấm.
 *     Trái = bài học (lý thuyết, slide, bắt đầu); phải = thực hành & kiểm tra (lab, Code Lab, quiz, mốc dự án, đề thi).
 *   • Nút tô theo loại + tiến độ (đã xong / đang học / chưa). Bấm ⇒ ngăn chi tiết: Học gì · Cần biết trước ·
 *     Học xong làm được gì · Kết hợp với · nút "Vào học" mở THẲNG đúng bài.
 *   • Máy tính: canvas thu phóng (nút −/+, Ctrl/⌘ + cuộn, "Vừa khung"), kéo để di chuyển, phím ↑/↓ đi theo thứ tự học,
 *     toàn màn hình. Điện thoại (< 768px): dạng dọc gọn, chương gập/mở.
 *   • Chỉ dùng biến theme (var(--bg-card)…) + màu cố định đọc được trên cả hai nền ⇒ đúng sáng lẫn tối.
 *
 * Dữ liệu: lib/roadmapKhoa.ts (dựng) + GET /courses/:slug/roadmap (4 ý mỗi bài, content/roadmap-khoa/<slug>.json).
 * Dùng ở trang giới thiệu khoá (CoursePageClient) và trang học (LearnPageClient — tab "Sơ đồ").
 */
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft, ArrowRight, BookOpen, Check, ChevronDown, ChevronUp, Clock, Code2, ExternalLink, FileText, Flag,
  FlaskConical, GraduationCap, Hammer, Layers, ListChecks, Map as MapIcon, Maximize2, Minimize2, Play, Presentation,
  Puzzle, Rocket, Sparkles, Star, Trophy, X, ZoomIn, ZoomOut, Link2, type LucideIcon,
} from 'lucide-react';
import { createPortal } from 'react-dom';
import { coursesApi } from '@/lib/api';
import {
  dungRoadmap, NHAN_LOAI_NUT, thoiLuongChu, type ChangRoadmap, type ChuongVao, type LoaiNut, type MetaRoadmap,
  type NutRoadmap, type TrangThai,
} from '@/lib/roadmapKhoa';

type Lang = 'vi' | 'en';

const ICON: Record<LoaiNut, LucideIcon> = {
  'bat-dau': Star, bai: Play, slide: Presentation, lab: FlaskConical, 'code-lab': Code2, quiz: ListChecks,
  'du-an': Hammer, 'de-thi': Trophy, 'on-tap': Layers, 'tai-lieu': FileText, 'chuyen-sau': Sparkles,
};
const MAU_TT: Record<TrangThai, string> = { xong: '#22c55e', dang: '#8b5cf6', chua: '#94a3b8' };
const VANG = { nen: '#facc15', chu: '#1c1917', vien: '#a16207' };
const RONG = 1160; // bề ngang canvas (px, chưa thu phóng)

const T = {
  vi: {
    tieuDe: 'Lộ trình khoá học', phu: 'Sơ đồ tổng quan — bấm một ô để xem học gì, cần biết gì trước và vào học ngay',
    chang: 'chương', bai: 'bài', xong: 'đã học', coMoTa: 'có mô tả chi tiết', thuGon: 'Thu gọn', moRong: 'Mở sơ đồ',
    batDau: 'Bắt đầu', ketThuc: 'Hoàn thành khoá', canTruoc: 'Cần biết trước khi học', hocXong: 'Học xong khoá này',
    lyThuyet: 'Bài học', thucHanh: 'Thực hành & kiểm tra', vuaKhung: 'Vừa khung', toanMan: 'Toàn màn hình', thoat: 'Thu nhỏ',
    hoc: 'Học gì', canBiet: 'Cần biết trước', lamDuoc: 'Học xong làm được gì', ketHop: 'Kết hợp với', vaoHoc: 'Vào học',
    truoc: 'Bài trước', sau: 'Bài sau', dong: 'Đóng', daHoc: 'Đã học', dangHoc: 'Đang học', chuaHoc: 'Chưa học', hocThu: 'Học thử',
    dangSoan: 'Mô tả chi tiết của bài này đang được soạn — tóm tắt dưới đây lấy từ bài.', chuGiai: 'Chú giải',
    keo: 'Kéo để di chuyển · Ctrl/⌘ + cuộn để thu phóng · ↑/↓ đi theo thứ tự học', dangTai: 'Đang tải sơ đồ…',
    xemKhoa: 'Xem khoá', moTab: 'mở tab mới',
  },
  en: {
    tieuDe: 'Course roadmap', phu: 'The whole course at a glance — click a box to see what it covers, what you need first, and jump in',
    chang: 'chapters', bai: 'lessons', xong: 'done', coMoTa: 'with detailed notes', thuGon: 'Collapse', moRong: 'Open roadmap',
    batDau: 'Start', ketThuc: 'Course complete', canTruoc: 'Before you start', hocXong: 'After this course',
    lyThuyet: 'Lessons', thucHanh: 'Practice & checks', vuaKhung: 'Fit', toanMan: 'Full screen', thoat: 'Exit full screen',
    hoc: 'What you learn', canBiet: 'Know first', lamDuoc: 'You will be able to', ketHop: 'Pairs well with', vaoHoc: 'Start lesson',
    truoc: 'Previous', sau: 'Next', dong: 'Close', daHoc: 'Done', dangHoc: 'In progress', chuaHoc: 'Not started', hocThu: 'Free preview',
    dangSoan: 'Detailed notes for this lesson are being written — this summary comes from the lesson itself.', chuGiai: 'Legend',
    keo: 'Drag to pan · Ctrl/⌘ + scroll to zoom · ↑/↓ follow the learning order', dangTai: 'Loading roadmap…',
    xemKhoa: 'Open course', moTab: 'opens a new tab',
  },
};
type Chu = (typeof T)['vi'];

function useLaHep() {
  const [hep, setHep] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const f = () => setHep(mq.matches);
    f(); mq.addEventListener('change', f);
    return () => mq.removeEventListener('change', f);
  }, []);
  return hep;
}

/** Nền ô theo loại: lý thuyết ⇒ vàng nhạt (kiểu roadmap.sh), thực hành ⇒ nhuộm màu loại; xong ⇒ xanh nhạt. */
function nenNut(n: NutRoadmap) {
  if (n.trangThai === 'xong') return 'color-mix(in srgb, #22c55e 13%, var(--bg-card))';
  if (n.ben === 'phai') return `color-mix(in srgb, ${NHAN_LOAI_NUT[n.loai].mau} 11%, var(--bg-card))`;
  return 'color-mix(in srgb, #fde68a 24%, var(--bg-card))';
}

function ONut({ n, lang, chon, onChon, onRef }: {
  n: NutRoadmap; lang: Lang; chon: boolean; onChon: (n: NutRoadmap) => void; onRef?: (el: HTMLButtonElement | null) => void;
}) {
  const Icon = ICON[n.loai];
  const mau = NHAN_LOAI_NUT[n.loai].mau;
  const tl = thoiLuongChu(n.thoiLuong, lang);
  const dang = n.trangThai === 'dang';
  return (
    <button
      ref={onRef} type="button" data-thu-tu={n.thuTu} data-dang={dang ? '1' : undefined} onClick={() => onChon(n)}
      aria-label={`${n.so ? n.so + ' ' : ''}${n.ten} — ${NHAN_LOAI_NUT[n.loai][lang]}${n.trangThai === 'xong' ? ' — ' + T[lang].daHoc : dang ? ' — ' + T[lang].dangHoc : ''}`}
      className="group relative flex w-full items-start gap-2 rounded-xl border px-2.5 py-2 text-left outline-none transition hover:-translate-y-px hover:shadow-md focus-visible:ring-2"
      style={{
        background: nenNut(n),
        borderColor: chon ? mau : dang ? '#8b5cf6' : n.trangThai === 'xong' ? '#22c55e88' : 'var(--border-color)',
        borderLeft: `4px solid ${mau}`,
        boxShadow: chon ? `0 0 0 2px ${mau}55` : dang ? '0 0 0 2px #8b5cf655, 0 6px 18px -10px #8b5cf6' : undefined,
        ['--tw-ring-color' as string]: mau,
      }}>
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: mau }} aria-hidden />
      <span className="min-w-0 flex-1">
        <span className="line-clamp-2 text-[12.5px] font-semibold leading-snug" style={{ color: 'var(--text-primary)' }}>
          {n.so && <span className="mr-1 font-bold tabular-nums" style={{ color: mau }}>{n.so}</span>}{n.ten}
        </span>
        <span className="mt-0.5 flex items-center gap-1.5 text-[10.5px]" style={{ color: 'var(--text-muted)' }}>
          <span style={{ color: mau }} className="font-semibold">{NHAN_LOAI_NUT[n.loai][lang]}</span>
          {tl && <><span aria-hidden>·</span><span>{tl}</span></>}
          {dang && <span className="ml-auto rounded-full px-1.5 text-[9.5px] font-bold text-white" style={{ background: '#8b5cf6' }}>{T[lang].dangHoc}</span>}
        </span>
      </span>
      {n.trangThai === 'xong' && (
        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-white" style={{ background: '#22c55e' }} aria-hidden>
          <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
        </span>
      )}
    </button>
  );
}

function OChuong({ c, lang, onRef }: { c: ChangRoadmap; lang: Lang; onRef?: (el: HTMLDivElement | null) => void }) {
  const pct = c.tong ? Math.round((c.xong / c.tong) * 100) : 0;
  return (
    <div ref={onRef} className="relative z-[1] w-full rounded-xl border-2 px-3 py-2.5 text-center shadow-sm"
      style={{ background: VANG.nen, borderColor: c.trangThai === 'xong' ? '#15803d' : VANG.vien, color: VANG.chu }}>
      <div className="flex items-center justify-center gap-1.5 text-[10.5px] font-bold uppercase tracking-wider opacity-75">
        {c.trangThai === 'xong' && <Check className="h-3 w-3" strokeWidth={3.5} />}{c.nhan}
      </div>
      <div className="mt-0.5 line-clamp-2 text-[14px] font-extrabold leading-snug">{c.ten}</div>
      <div className="mt-1.5 flex items-center gap-2 text-[10.5px] font-semibold opacity-80">
        <span className="h-1.5 flex-1 overflow-hidden rounded-full" style={{ background: 'rgba(28,25,23,0.15)' }}>
          <span className="block h-full rounded-full" style={{ width: `${pct}%`, background: '#15803d' }} />
        </span>
        <span className="tabular-nums">{c.xong}/{c.tong}</span>
        {c.thoiLuong > 0 && <span className="tabular-nums">· {thoiLuongChu(c.thoiLuong, lang)}</span>}
      </div>
    </div>
  );
}

/** Một hàng chương trên canvas máy tính + đường chấm SVG đo theo vị trí thật của từng ô. */
function HangChuong({ c, lang, chonId, onChon }: { c: ChangRoadmap; lang: Lang; chonId: number | null; onChon: (n: NutRoadmap) => void }) {
  const hangRef = useRef<HTMLDivElement>(null);
  const truc = useRef<HTMLDivElement | null>(null);
  const nutRef = useRef(new Map<number, HTMLButtonElement>());
  const [duong, setDuong] = useState<Array<{ id: number; d: string; mau: string }>>([]);
  const trai = c.nut.filter((n) => n.ben === 'trai');
  const phai = c.nut.filter((n) => n.ben === 'phai');

  const do_ = useCallback(() => {
    const t = truc.current;
    if (!t) return;
    const ty = t.offsetTop + t.offsetHeight / 2;
    const ds: Array<{ id: number; d: string; mau: string }> = [];
    for (const n of c.nut) {
      const el = nutRef.current.get(n.id);
      if (!el) continue;
      const ny = el.offsetTop + el.offsetHeight / 2;
      const trai_ = n.ben === 'trai';
      const sx = trai_ ? t.offsetLeft : t.offsetLeft + t.offsetWidth;
      const nx = trai_ ? el.offsetLeft + el.offsetWidth : el.offsetLeft;
      const k = (nx - sx) * 0.5;
      ds.push({ id: n.id, d: `M ${sx} ${ty} C ${sx + k} ${ty}, ${nx - k} ${ny}, ${nx} ${ny}`, mau: MAU_TT[n.trangThai] });
    }
    setDuong(ds);
  }, [c.nut]);

  useLayoutEffect(() => {
    do_();
    const el = hangRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => do_());
    ro.observe(el);
    return () => ro.disconnect();
  }, [do_]);

  const datRef = (id: number) => (el: HTMLButtonElement | null) => { if (el) nutRef.current.set(id, el); else nutRef.current.delete(id); };
  return (
    <div ref={hangRef} className="relative grid items-center py-5" style={{ gridTemplateColumns: '1fr 270px 1fr', columnGap: 76 }}>
      <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden>
        {duong.map((p) => (
          <path key={p.id} d={p.d} fill="none" stroke={p.mau} strokeWidth={p.id === chonId ? 3 : 2.2} strokeDasharray="1.5 6" strokeLinecap="round" opacity={p.mau === MAU_TT.chua ? 0.7 : 1} />
        ))}
      </svg>
      <div className="flex flex-col items-stretch gap-2 justify-self-end" style={{ width: 300 }}>
        {trai.map((n) => <ONut key={n.id} n={n} lang={lang} chon={n.id === chonId} onChon={onChon} onRef={datRef(n.id)} />)}
      </div>
      <div className="flex flex-col items-center gap-2">
        <OChuong c={c} lang={lang} onRef={(el) => { truc.current = el; }} />
        {c.hoc && (
          <p className="relative z-[1] rounded-lg px-2.5 py-1.5 text-center text-[11px] leading-snug" title={c.hoc}
            style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>
            <span className="line-clamp-3">{c.hoc}</span>
          </p>
        )}
      </div>
      <div className="flex flex-col items-stretch gap-2 justify-self-start" style={{ width: 300 }}>
        {phai.map((n) => <ONut key={n.id} n={n} lang={lang} chon={n.id === chonId} onChon={onChon} onRef={datRef(n.id)} />)}
      </div>
    </div>
  );
}

function KhoiChu({ tieuDe, icon: Icon, children, mau }: { tieuDe: string; icon: LucideIcon; children: React.ReactNode; mau: string }) {
  return (
    <div className="relative z-[1] rounded-xl border p-3 text-left" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
      <p className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide" style={{ color: mau }}><Icon className="h-3.5 w-3.5" /> {tieuDe}</p>
      <div className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{children}</div>
    </div>
  );
}

function SoDoMayTinh({ chang, lang, chonId, onChon, yeuCau, hocDuoc, toanMan }: {
  chang: ChangRoadmap[]; lang: Lang; chonId: number | null; onChon: (n: NutRoadmap) => void;
  yeuCau?: string[]; hocDuoc?: string[]; toanMan: boolean;
}) {
  const s = T[lang];
  const khungRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [z, setZ] = useState(1);
  const [cao, setCao] = useState(800);
  const keo = useRef<{ x: number; y: number; sl: number; st: number } | null>(null);

  const vuaKhung = useCallback(() => {
    const w = khungRef.current?.clientWidth ?? RONG;
    setZ(Math.max(0.5, Math.min(1, (w - 24) / RONG)));
  }, []);
  useEffect(() => { vuaKhung(); }, [vuaKhung, toanMan]);
  useLayoutEffect(() => {
    const el = canvasRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => setCao(el.offsetHeight));
    ro.observe(el); setCao(el.offsetHeight);
    return () => ro.disconnect();
  }, []);
  // Ctrl/⌘ + cuộn = thu phóng (listener không passive để chặn zoom cả trang)
  useEffect(() => {
    const el = khungRef.current;
    if (!el) return;
    const f = (e: WheelEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      setZ((v) => Math.max(0.4, Math.min(1.6, +(v * (e.deltaY > 0 ? 0.92 : 1.08)).toFixed(3))));
    };
    el.addEventListener('wheel', f, { passive: false });
    return () => el.removeEventListener('wheel', f);
  }, []);
  // Mở lần đầu ⇒ cuộn tới bài đang học
  useEffect(() => {
    const t = window.setTimeout(() => {
      const el = khungRef.current?.querySelector<HTMLElement>('[data-dang="1"]');
      const k = khungRef.current;
      if (el && k) {
        const r = el.getBoundingClientRect(); const rk = k.getBoundingClientRect();
        k.scrollTo({ top: k.scrollTop + r.top - rk.top - rk.height / 2 + r.height / 2, behavior: 'smooth' });
      }
    }, 250);
    return () => window.clearTimeout(t);
  }, []);

  const diTheoPhim = (e: React.KeyboardEvent) => {
    if (!['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    const hien = (document.activeElement as HTMLElement | null)?.dataset?.thuTu;
    if (hien == null) return;
    e.preventDefault();
    const toi = Number(hien) + (e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1);
    const el = khungRef.current?.querySelector<HTMLElement>(`[data-thu-tu="${toi}"]`);
    if (el) { el.focus({ preventScroll: true }); el.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' }); }
  };

  return (
    <div className="relative">
      <div className="mb-2 flex justify-end"><div className="flex items-center gap-1 rounded-xl border p-1 shadow-sm" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
        <button type="button" onClick={() => setZ((v) => Math.max(0.4, +(v - 0.1).toFixed(2)))} className="rounded-lg p-1.5 transition hover:opacity-70" style={{ color: 'var(--text-secondary)' }} aria-label="Thu nhỏ"><ZoomOut className="h-4 w-4" /></button>
        <button type="button" onClick={() => setZ(1)} className="min-w-[46px] rounded-lg px-1.5 py-1 text-xs font-semibold tabular-nums" style={{ color: 'var(--text-primary)' }} aria-label="Về 100%">{Math.round(z * 100)}%</button>
        <button type="button" onClick={() => setZ((v) => Math.min(1.6, +(v + 0.1).toFixed(2)))} className="rounded-lg p-1.5 transition hover:opacity-70" style={{ color: 'var(--text-secondary)' }} aria-label="Phóng to"><ZoomIn className="h-4 w-4" /></button>
        <button type="button" onClick={vuaKhung} className="rounded-lg px-2 py-1 text-xs font-semibold transition hover:opacity-70" style={{ color: 'var(--text-secondary)' }}>{s.vuaKhung}</button>
      </div></div>
      <div
        ref={khungRef} onKeyDown={diTheoPhim}
        onPointerDown={(e) => {
          if (e.pointerType !== 'mouse' || e.button !== 0 || (e.target as HTMLElement).closest('button,a')) return;
          const k = khungRef.current!; keo.current = { x: e.clientX, y: e.clientY, sl: k.scrollLeft, st: k.scrollTop };
          k.setPointerCapture(e.pointerId); k.style.cursor = 'grabbing';
        }}
        onPointerMove={(e) => {
          const d = keo.current; const k = khungRef.current; if (!d || !k) return;
          k.scrollLeft = d.sl - (e.clientX - d.x); k.scrollTop = d.st - (e.clientY - d.y);
        }}
        onPointerUp={(e) => { keo.current = null; const k = khungRef.current; if (k) { k.style.cursor = ''; if (k.hasPointerCapture(e.pointerId)) k.releasePointerCapture(e.pointerId); } }}
        className="thin-scroll cursor-grab overflow-auto rounded-2xl border"
        style={{
          height: toanMan ? 'calc(100vh - 150px)' : 'min(78vh, 920px)', borderColor: 'var(--border-color)',
          backgroundColor: 'var(--bg-surface)',
          backgroundImage: 'radial-gradient(circle, color-mix(in srgb, var(--text-muted) 28%, transparent) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}>
        <div className="relative mx-auto" style={{ width: RONG * z, height: cao * z }}>
          <div ref={canvasRef} className="absolute left-0 top-0 px-6 pb-10 pt-6" style={{ width: RONG, transform: `scale(${z})`, transformOrigin: '0 0' }}>
            {/* Trục chính */}
            <div aria-hidden className="absolute bottom-16 top-16 w-[3px] -translate-x-1/2 rounded-full" style={{ left: '50%', background: 'linear-gradient(#3b82f6, #6366f1)' }} />
            {/* Đầu sơ đồ: cần biết trước · Bắt đầu · học xong làm được */}
            <div className="grid items-start pb-2" style={{ gridTemplateColumns: '1fr 270px 1fr', columnGap: 76 }}>
              <div className="justify-self-end" style={{ width: 300 }}>
                {yeuCau && yeuCau.length > 0 && (
                  <KhoiChu tieuDe={s.canTruoc} icon={Puzzle} mau="#0ea5e9">
                    <ul className="list-disc space-y-0.5 pl-4">{yeuCau.slice(0, 4).map((y) => <li key={y} className="line-clamp-2">{y}</li>)}</ul>
                  </KhoiChu>
                )}
              </div>
              <div className="relative z-[1] mx-auto mt-2 flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-extrabold text-white shadow-lg" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                <Flag className="h-4 w-4" /> {s.batDau}
              </div>
              <div className="justify-self-start" style={{ width: 300 }}>
                {hocDuoc && hocDuoc.length > 0 && (
                  <KhoiChu tieuDe={s.hocXong} icon={Rocket} mau="#16a34a">
                    <ul className="list-disc space-y-0.5 pl-4">{hocDuoc.slice(0, 4).map((y) => <li key={y} className="line-clamp-2">{y}</li>)}</ul>
                  </KhoiChu>
                )}
              </div>
            </div>
            <div className="grid pb-1 pt-3 text-[11px] font-bold uppercase tracking-wider" style={{ gridTemplateColumns: '1fr 270px 1fr', columnGap: 76, color: 'var(--text-muted)' }}>
              <span className="justify-self-end pr-1" style={{ width: 300, textAlign: 'right' }}>← {s.lyThuyet}</span><span />
              <span className="justify-self-start pl-1" style={{ width: 300 }}>{s.thucHanh} →</span>
            </div>
            {chang.map((c) => <HangChuong key={c.id} c={c} lang={lang} chonId={chonId} onChon={onChon} />)}
            <div className="relative z-[1] mx-auto mt-4 flex w-fit items-center gap-2 rounded-full px-5 py-2.5 text-sm font-extrabold text-white shadow-lg" style={{ background: 'linear-gradient(135deg,#16a34a,#22c55e)' }}>
              <GraduationCap className="h-4 w-4" /> {s.ketThuc}
            </div>
          </div>
        </div>
      </div>
      <p className="mt-2 text-center text-[11px]" style={{ color: 'var(--text-muted)' }}>{s.keo}</p>
    </div>
  );
}

function SoDoDienThoai({ chang, lang, chonId, onChon }: { chang: ChangRoadmap[]; lang: Lang; chonId: number | null; onChon: (n: NutRoadmap) => void }) {
  const dangMo = chang.find((c) => c.trangThai === 'dang')?.id ?? chang[0]?.id;
  const [mo, setMo] = useState<Set<number>>(() => new Set(dangMo != null ? [dangMo] : []));
  return (
    <ol className="relative space-y-3 pl-7">
      <span aria-hidden className="absolute bottom-3 left-[11px] top-3 w-[3px] rounded-full" style={{ background: 'linear-gradient(#3b82f6, #6366f1)' }} />
      {chang.map((c) => {
        const m = mo.has(c.id);
        return (
          <li key={c.id} className="relative">
            <span aria-hidden className="absolute -left-[23px] top-4 h-3.5 w-3.5 rounded-full border-2" style={{ background: c.trangThai === 'xong' ? '#22c55e' : VANG.nen, borderColor: c.trangThai === 'xong' ? '#15803d' : VANG.vien }} />
            <button type="button" aria-expanded={m} onClick={() => setMo((p) => { const n = new Set(p); if (n.has(c.id)) n.delete(c.id); else n.add(c.id); return n; })} className="block w-full text-left">
              <div className="relative">
                <OChuong c={c} lang={lang} />
                <span className="absolute right-2 top-2 z-[2]" style={{ color: VANG.chu }}>{m ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</span>
              </div>
            </button>
            {m && (
              <div className="mt-2 space-y-1.5 border-l-2 border-dotted pl-3" style={{ borderColor: 'var(--text-muted)' }}>
                {c.hoc && <p className="pb-1 text-[11.5px] leading-snug" style={{ color: 'var(--text-secondary)' }}>{c.hoc}</p>}
                {c.nut.map((n) => <ONut key={n.id} n={n} lang={lang} chon={n.id === chonId} onChon={onChon} />)}
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function NganChiTiet({ n, c, lang, tatCa, onChon, onDong, onVaoHoc, nhanVao }: {
  n: NutRoadmap; c: ChangRoadmap | undefined; lang: Lang; tatCa: NutRoadmap[]; onChon: (n: NutRoadmap) => void;
  onDong: () => void; onVaoHoc: (id: number) => void; nhanVao?: string;
}) {
  const s = T[lang];
  const mau = NHAN_LOAI_NUT[n.loai].mau;
  const Icon = ICON[n.loai];
  const truoc = tatCa[n.thuTu - 1];
  const sau = tatCa[n.thuTu + 1];
  const hopRef = useRef<HTMLDivElement>(null);
  useEffect(() => { hopRef.current?.focus(); }, [n.id]);
  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDong();
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowLeft' && truoc && hopRef.current?.contains(document.activeElement)) onChon(truoc);
      if (e.key === 'ArrowRight' && sau && hopRef.current?.contains(document.activeElement)) onChon(sau);
    };
    window.addEventListener('keydown', f);
    return () => window.removeEventListener('keydown', f);
  }, [onDong, onChon, truoc, sau]);
  const tt = n.trangThai === 'xong' ? { chu: s.daHoc, mau: '#16a34a' } : n.trangThai === 'dang' ? { chu: s.dangHoc, mau: '#8b5cf6' } : { chu: s.chuaHoc, mau: 'var(--text-muted)' };
  const theBai = (x: { id: number; ten: string; loai: LoaiNut }) => {
    const dich = tatCa.find((y) => y.id === x.id);
    const K = ICON[x.loai];
    return (
      <button key={x.id} type="button" onClick={() => dich && onChon(dich)}
        className="inline-flex max-w-full items-center gap-1.5 rounded-lg border px-2 py-1 text-left text-xs font-medium transition hover:opacity-80"
        style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}>
        <K className="h-3.5 w-3.5 shrink-0" style={{ color: NHAN_LOAI_NUT[x.loai].mau }} />
        <span className="truncate">{dich?.so ? `${dich.so} · ` : ''}{x.ten}</span>
        {dich?.trangThai === 'xong' && <Check className="h-3 w-3 shrink-0 text-green-500" strokeWidth={3} />}
      </button>
    );
  };
  const muc = (tieuDe: string, I: LucideIcon, mauY: string, noiDung: string, them?: React.ReactNode) => (noiDung || them) ? (
    <section className="rounded-2xl border p-3.5" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}>
      <h4 className="mb-1.5 flex items-center gap-1.5 text-[11.5px] font-bold uppercase tracking-wide" style={{ color: mauY }}><I className="h-4 w-4" /> {tieuDe}</h4>
      {noiDung && <p className="text-[13.5px] leading-relaxed" style={{ color: 'var(--text-primary)' }}>{noiDung}</p>}
      {them && <div className="mt-2 flex flex-wrap gap-1.5">{them}</div>}
    </section>
  ) : null;

  return (
    <>
      <button type="button" aria-label={s.dong} onClick={onDong} className="fixed inset-0 z-[94] cursor-default bg-black/40 sm:bg-black/25" />
      <aside ref={hopRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label={n.ten}
        className="fixed inset-x-0 bottom-0 z-[95] flex max-h-[86vh] flex-col overflow-hidden rounded-t-3xl border shadow-2xl outline-none sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-[440px] sm:rounded-none sm:rounded-l-3xl"
        style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
        <div className="shrink-0 border-b px-5 pb-4 pt-4" style={{ borderColor: 'var(--border-color)', background: `linear-gradient(180deg, color-mix(in srgb, ${mau} 14%, var(--bg-card)), var(--bg-card))` }}>
          <div className="mx-auto mb-2 h-1 w-10 rounded-full sm:hidden" style={{ background: 'var(--border-color)' }} />
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-white shadow" style={{ background: mau }}><Icon className="h-5 w-5" /></span>
            <div className="min-w-0 flex-1">
              {c && <p className="truncate text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>{c.nhan} · {c.ten}</p>}
              <h3 className="mt-0.5 text-[17px] font-bold leading-snug" style={{ color: 'var(--text-primary)' }}>
                {n.so && <span className="mr-1.5 tabular-nums" style={{ color: mau }}>{n.so}</span>}{n.ten}
              </h3>
            </div>
            <button type="button" onClick={onDong} aria-label={s.dong} className="rounded-xl p-1.5 transition hover:opacity-70" style={{ color: 'var(--text-secondary)' }}><X className="h-5 w-5" /></button>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px] font-semibold">
            <span className="rounded-full px-2 py-0.5 text-white" style={{ background: mau }}>{NHAN_LOAI_NUT[n.loai][lang]}</span>
            {n.thoiLuong > 0 && <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}><Clock className="h-3 w-3" /> {thoiLuongChu(n.thoiLuong, lang)}</span>}
            <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5" style={{ borderColor: 'var(--border-color)', color: tt.mau }}>
              {n.trangThai === 'xong' ? <Check className="h-3 w-3" strokeWidth={3} /> : n.trangThai === 'dang' ? <Play className="h-3 w-3" /> : null}{tt.chu}
            </span>
            {n.hocThu && <span className="rounded-full px-2 py-0.5" style={{ background: '#22c55e22', color: '#16a34a' }}>{s.hocThu}</span>}
          </div>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4 thin-scroll">
          {!n.coMoTa && (
            <p className="flex items-start gap-2 rounded-xl px-3 py-2 text-xs" style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>
              <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {s.dangSoan}
            </p>
          )}
          {muc(s.hoc, BookOpen, '#3b82f6', n.hoc)}
          {muc(s.canBiet, Puzzle, '#0ea5e9', n.canBiet, n.canBietBai.length ? n.canBietBai.map(theBai) : undefined)}
          {muc(s.lamDuoc, Rocket, '#16a34a', n.lamDuoc)}
          {muc(s.ketHop, Link2, '#ec4899', n.ketHop, (n.ketHopBai.length || n.ketHopKhoa.length) ? (
            <>
              {n.ketHopBai.map(theBai)}
              {n.ketHopKhoa.map((k) => (
                <a key={k.slug} href={`/courses/${k.slug}`} target="_blank" rel="noopener noreferrer" title={`${s.xemKhoa} — ${s.moTab}`}
                  className="inline-flex max-w-full items-center gap-1.5 rounded-lg border px-2 py-1 text-xs font-medium transition hover:opacity-80"
                  style={{ borderColor: '#ec489955', background: '#ec48990f', color: 'var(--text-primary)' }}>
                  <GraduationCap className="h-3.5 w-3.5 shrink-0 text-pink-500" /><span className="truncate">{k.ten}</span><ExternalLink className="h-3 w-3 shrink-0 opacity-60" />
                </a>
              ))}
            </>
          ) : undefined)}
        </div>
        <div className="flex shrink-0 items-center gap-2 border-t px-5 py-3" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}>
          <button type="button" disabled={!truoc} onClick={() => truoc && onChon(truoc)} aria-label={s.truoc}
            className="inline-flex items-center gap-1 rounded-xl border px-2.5 py-2 text-xs font-semibold transition hover:opacity-80 disabled:opacity-35" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
            <ArrowLeft className="h-3.5 w-3.5" /><span className="hidden min-[380px]:inline">{s.truoc}</span>
          </button>
          <button type="button" disabled={!sau} onClick={() => sau && onChon(sau)} aria-label={s.sau}
            className="inline-flex items-center gap-1 rounded-xl border px-2.5 py-2 text-xs font-semibold transition hover:opacity-80 disabled:opacity-35" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
            <span className="hidden min-[380px]:inline">{s.sau}</span><ArrowRight className="h-3.5 w-3.5" />
          </button>
          <button type="button" onClick={() => onVaoHoc(n.id)}
            className="ml-auto inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold text-white shadow transition hover:opacity-90"
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
            <Play className="h-4 w-4" /> {nhanVao ?? s.vaoHoc}
          </button>
        </div>
      </aside>
    </>
  );
}

export interface SoDoKhoaProps {
  slug: string;
  sections: ChuongVao[] | null | undefined;
  xong?: (lessonId: number) => boolean;
  hienTai?: number | null;
  onVaoHoc: (lessonId: number) => void;
  lang?: Lang;
  /** Mở sẵn hay gập (mặc định mở). */
  macDinhMo?: boolean;
  /** "Cần biết trước khi học" + "Học xong khoá này" (khối chữ đầu sơ đồ). */
  yeuCau?: string[];
  hocDuoc?: string[];
  /** Nhãn nút "Vào học" (trang giới thiệu chưa đăng ký có thể đổi). */
  nhanVao?: string;
  className?: string;
}

/** Thành phần chính: vỏ có tiêu đề + thu gọn, tự tải mô tả 4 ý, chọn bố cục theo bề rộng. */
export default function SoDoKhoa({ slug, sections, xong, hienTai, onVaoHoc, lang = 'vi', macDinhMo = true, yeuCau, hocDuoc, nhanVao, className }: SoDoKhoaProps) {
  const s = T[lang] as Chu;
  const hep = useLaHep();
  const [mo, setMo] = useState(macDinhMo);
  const [toanMan, setToanMan] = useState(false);
  const [meta, setMeta] = useState<MetaRoadmap | null>(null);
  const [daTai, setDaTai] = useState(false);
  const [chonId, setChonId] = useState<number | null>(null);

  useEffect(() => {
    if (!mo || daTai) return;
    let song = true;
    coursesApi.getCourseRoadmap(slug)
      .then((r) => { if (song) setMeta((r.data?.data as MetaRoadmap | null) ?? null); })
      .catch(() => { /* không có mô tả ⇒ sơ đồ vẫn vẽ từ chương/bài */ })
      .finally(() => { if (song) setDaTai(true); });
    return () => { song = false; };
  }, [mo, daTai, slug]);

  const rd = useMemo(() => dungRoadmap(sections, meta, { xong, hienTai, lang }), [sections, meta, xong, hienTai, lang]);
  const tatCa = useMemo(() => rd.chang.flatMap((c) => c.nut), [rd]);
  const chon = chonId != null ? tatCa.find((n) => n.id === chonId) ?? null : null;
  const chuongChon = chon ? rd.chang.find((c) => c.nut.some((x) => x.id === chon.id)) : undefined;
  const onChon = useCallback((n: NutRoadmap) => setChonId(n.id), []);
  const onDong = useCallback(() => setChonId(null), []);
  useEffect(() => {
    if (!toanMan) return;
    const f = (e: KeyboardEvent) => { if (e.key === 'Escape' && chonId == null) setToanMan(false); };
    window.addEventListener('keydown', f);
    const cu = document.body.style.overflow; document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', f); document.body.style.overflow = cu; };
  }, [toanMan, chonId]);

  if (!rd.chang.length) return null;
  const pct = rd.tongNut ? Math.round((rd.soXong / rd.tongNut) * 100) : 0;
  const loaiCo = [...new Set(tatCa.map((n) => n.loai))];

  // Ngăn chi tiết + chế độ toàn màn hình đi qua PORTAL ra <body>: trang giới thiệu bọc nội dung trong `relative z-10`
  // (một stacking context) ⇒ `fixed` bên trong bị kẹt DƯỚI thanh điều hướng (z-40) dù z-index cao hơn (đo 28/11).
  const ngan = chon ? createPortal(
    <NganChiTiet n={chon} c={chuongChon} lang={lang} tatCa={tatCa} onChon={onChon} onDong={onDong} nhanVao={nhanVao}
      onVaoHoc={(id) => { setChonId(null); setToanMan(false); onVaoHoc(id); }} />,
    document.body,
  ) : null;
  const khung = (
    <section aria-labelledby={`so-do-${slug}`}
      className={toanMan ? 'fixed inset-0 z-[85] overflow-y-auto p-4 sm:p-6' : `rounded-2xl border p-4 sm:p-5 ${className ?? ''}`}
      style={{ background: toanMan ? 'var(--bg-primary)' : 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
      <div className="flex flex-wrap items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-white shadow" style={{ background: 'linear-gradient(135deg,#f59e0b,#eab308)' }}>
          <MapIcon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 id={`so-do-${slug}`} className="text-lg font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>{s.tieuDe}</h2>
          <p className="mt-0.5 text-xs" style={{ color: 'var(--text-secondary)' }}>{s.phu}</p>
          <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
            {[`${rd.chang.length} ${s.chang}`, `${rd.tongNut} ${s.bai}`, `${pct}% ${s.xong}`, ...(rd.soCoMoTa ? [`${rd.soCoMoTa} ${s.coMoTa}`] : [])].map((x) => (
              <span key={x} className="rounded-full border px-2 py-0.5 font-semibold tabular-nums" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>{x}</span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {mo && !hep && (
            <button type="button" onClick={() => setToanMan((v) => !v)} className="inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-semibold transition hover:opacity-80" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
              {toanMan ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />} {toanMan ? s.thoat : s.toanMan}
            </button>
          )}
          <button type="button" onClick={() => { setMo((v) => !v); setToanMan(false); }} aria-expanded={mo}
            className="inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-semibold transition hover:opacity-80" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
            {mo ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />} {mo ? s.thuGon : s.moRong}
          </button>
        </div>
      </div>

      {mo && (
        <>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px]" aria-label={s.chuGiai}>
            {loaiCo.map((l) => {
              const I = ICON[l];
              return <span key={l} className="inline-flex items-center gap-1 font-semibold" style={{ color: NHAN_LOAI_NUT[l].mau }}><I className="h-3 w-3" /> {NHAN_LOAI_NUT[l][lang]}</span>;
            })}
            <span className="mx-1 h-3 w-px" style={{ background: 'var(--border-color)' }} aria-hidden />
            {(['xong', 'dang', 'chua'] as TrangThai[]).map((t) => (
              <span key={t} className="inline-flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: MAU_TT[t] }} /> {t === 'xong' ? s.daHoc : t === 'dang' ? s.dangHoc : s.chuaHoc}
              </span>
            ))}
          </div>
          <div className="mt-3">
            {hep
              ? <SoDoDienThoai chang={rd.chang} lang={lang} chonId={chonId} onChon={onChon} />
              : <SoDoMayTinh chang={rd.chang} lang={lang} chonId={chonId} onChon={onChon} yeuCau={yeuCau} hocDuoc={hocDuoc} toanMan={toanMan} />}
          </div>
        </>
      )}

      {ngan}
    </section>
  );
  if (!toanMan) return khung;
  return (
    <>
      <div className={`rounded-2xl border p-4 text-sm ${className ?? ''}`} style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>{s.tieuDe} — {s.toanMan}…</div>
      {createPortal(khung, document.body)}
    </>
  );
}
