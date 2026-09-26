'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUp, CheckCircle2, ChevronRight, Clock, MapPin, Target, Trophy } from 'lucide-react';
import { coursesApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import type { Enrollment } from '@/types';
import { THAP, SONG_SONG, NGOAI_LE, type BuocHoc } from './roadmapData';

// Tháp: tầng 1 (nền) rộng nhất ở ĐÁY. Lớp phải viết nguyên văn để Tailwind thấy.
const DO_RONG = ['md:w-full', 'md:w-[90%]', 'md:w-[80%]', 'md:w-[70%]', 'md:w-[60%]', 'md:w-[50%]'];

function lienKet(b: BuocHoc) {
  return b.academy ? `/academy/courses/${b.slug}` : `/courses/${b.slug}`;
}

function TheBuoc({ b, thuTu, tienDo }: { b: BuocHoc; thuTu?: number; tienDo?: number }) {
  const xong = tienDo === 100;
  return (
    <Link
      href={lienKet(b)}
      className="group flex items-start gap-3 p-3 rounded-xl bg-darkcard border border-darkborder hover:border-neon-violet/40 transition-colors"
    >
      {thuTu !== undefined && (
        <span
          className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
            xong ? 'bg-emerald-500 text-white' : 'bg-neon-violet/15 text-neon-violet'
          }`}
        >
          {xong ? <CheckCircle2 className="w-4 h-4" /> : thuTu}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-text-primary group-hover:text-neon-violet transition-colors">{b.ten}</span>
          {b.academy && (
            <span className="text-[11px] px-1.5 py-0.5 rounded bg-sky-500/15 text-sky-500 font-medium">🎓 Academy</span>
          )}
          {b.khung && (
            <span className="text-[11px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-600 font-medium">Đang soạn</span>
          )}
        </div>
        <p className="text-sm text-text-secondary mt-0.5">{b.viSao}</p>
        {tienDo !== undefined && (
          <div className="mt-2 flex items-center gap-2">
            <div className="h-1.5 flex-1 rounded-full bg-darkborder overflow-hidden">
              <div className="h-full bg-gradient-to-r from-neon-indigo to-neon-violet" style={{ width: `${tienDo}%` }} />
            </div>
            <span className="text-xs text-text-muted tabular-nums">{tienDo}%</span>
          </div>
        )}
      </div>
      <ChevronRight className="shrink-0 w-4 h-4 mt-1 text-text-muted group-hover:text-neon-violet" />
    </Link>
  );
}

export default function CourseRoadmap() {
  const daDangNhap = useAuthStore((s) => s.isAuthenticated);
  const [tienDo, setTienDo] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!daDangNhap) return;
    coursesApi
      .getAllMyCourses()
      .then((r) => {
        const map: Record<string, number> = {};
        for (const e of (r.data.data || []) as Enrollment[]) map[e.courseSlug] = Math.round(e.progressPercent || 0);
        setTienDo(map);
      })
      .catch(() => {});
  }, [daDangNhap]);

  // "Bạn đang ở đây" = tầng thấp nhất còn khoá chưa xong (khoá đang soạn không tính).
  const tangHienTai = useMemo(() => {
    for (const t of THAP) {
      if (t.buoc.some((b) => !b.khung && tienDo[b.slug] !== 100)) return t.so;
    }
    return THAP[THAP.length - 1].so;
  }, [tienDo]);

  const [chon, setChon] = useState<number | null>(null);
  const tangChon = THAP.find((t) => t.so === (chon ?? tangHienTai))!;

  return (
    <div className="space-y-10">
      {/* Lời dẫn */}
      <div className="rounded-2xl border border-darkborder bg-darkcard p-5">
        <h2 className="text-xl font-heading font-bold text-text-primary mb-1">Nhiều khoá quá — bắt đầu từ đâu?</h2>
        <p className="text-text-secondary text-sm leading-relaxed">
          Học <b>từ đáy tháp lên</b>. Mỗi tầng dựa trên tầng dưới nó: chưa vững tầng dưới thì tầng trên sẽ rất khó.
          Trong một tầng, học theo <b>số thứ tự</b>. Không cần học hết mọi khoá trên trang này — những khoá không có
          trong tháp là tuỳ chọn. Stack chính: <b>React + Node.js + PostgreSQL</b>, <b>Python</b> cho AI,{' '}
          <b>Spring Boot</b> là backend thứ hai.
        </p>
      </div>

      {/* Tháp */}
      <div>
        <div className="flex flex-col items-center gap-2">
          {[...THAP].reverse().map((t) => {
            const dangChon = t.so === tangChon.so;
            const oDay = t.so === tangHienTai;
            const chinh = t.buoc.filter((b) => !b.khung);
            const xong = chinh.filter((b) => tienDo[b.slug] === 100).length;
            return (
              <button
                key={t.so}
                onClick={() => setChon(t.so)}
                className={`relative w-full ${DO_RONG[t.so - 1]} rounded-xl px-4 py-3 text-left text-white bg-gradient-to-r ${t.mau} transition-all ${
                  dangChon ? 'ring-4 ring-neon-violet/40 scale-[1.01] shadow-lg' : 'opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
                    {t.so}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold leading-tight flex items-center gap-2 flex-wrap">
                      {t.ten}
                      {oDay && (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white text-gray-900 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {daDangNhap ? 'Bạn đang ở đây' : 'Bắt đầu ở đây'}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-white/85 truncate">{t.phu}</div>
                  </div>
                  <div className="hidden sm:block text-right text-xs text-white/90 shrink-0">
                    <div>{t.thoiGian}</div>
                    {Object.keys(tienDo).length > 0 && chinh.length > 0 && (
                      <div className="font-semibold">
                        {xong}/{chinh.length} khoá xong
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-center text-xs text-text-muted flex items-center justify-center gap-1">
          <ArrowUp className="w-3.5 h-3.5" /> Bắt đầu từ tầng 1 ở đáy tháp · bấm vào một tầng để xem chi tiết
        </p>
      </div>

      {/* Chi tiết tầng đang chọn */}
      <div className="rounded-2xl border border-darkborder p-5 md:p-6 bg-darkbg">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-text-muted font-semibold">Tầng {tangChon.so}</p>
            <h3 className="text-2xl font-heading font-bold text-text-primary">{tangChon.ten}</h3>
          </div>
          <span className="flex items-center gap-1.5 text-sm text-text-secondary">
            <Clock className="w-4 h-4" /> {tangChon.thoiGian}
          </span>
        </div>
        <div className="grid md:grid-cols-2 gap-3 mb-5">
          <div className="flex gap-2 p-3 rounded-xl bg-darkcard border border-darkborder">
            <Target className="w-5 h-5 shrink-0 text-neon-violet" />
            <p className="text-sm text-text-secondary">
              <b className="text-text-primary">Mục tiêu: </b>
              {tangChon.mucTieu}
            </p>
          </div>
          <div className="flex gap-2 p-3 rounded-xl bg-darkcard border border-darkborder">
            <Trophy className="w-5 h-5 shrink-0 text-amber-500" />
            <p className="text-sm text-text-secondary">
              <b className="text-text-primary">Học xong làm được: </b>
              {tangChon.lamDuoc}
            </p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {tangChon.buoc.map((b, i) => (
            <TheBuoc key={b.slug} b={b} thuTu={i + 1} tienDo={tienDo[b.slug]} />
          ))}
        </div>
        {tangChon.so < THAP.length && (
          <button
            onClick={() => setChon(tangChon.so + 1)}
            className="mt-5 text-sm font-medium text-neon-violet hover:underline flex items-center gap-1"
          >
            Xong tầng này? Xem tầng {tangChon.so + 1}: {THAP[tangChon.so].ten} <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Song song */}
      <div>
        <h3 className="text-lg font-heading font-bold text-text-primary mb-1">Học xen kẽ, không chờ tầng nào</h3>
        <p className="text-sm text-text-muted mb-3">Mỗi tuần một ít — những thứ này quyết định bạn có qua được phỏng vấn không.</p>
        <div className="grid md:grid-cols-2 gap-3">
          {SONG_SONG.map((b) => (
            <TheBuoc key={b.slug} b={b} tienDo={tienDo[b.slug]} />
          ))}
        </div>
      </div>

      {/* Hỏi đáp */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-darkborder bg-darkcard p-5">
          <h3 className="font-heading font-bold text-text-primary mb-2">🎨 Figma (môn WDU203c UI/UX) có phải học không?</h3>
          <div className="text-sm text-text-secondary space-y-2 leading-relaxed">
            <p>
              <b>Với trường: có.</b> WDU203c là môn trong khung chương trình, phải qua để lấy tín chỉ.
            </p>
            <p>
              <b>Với nghề lập trình: không cần giỏi vẽ.</b> Designer vẽ giao diện bằng Figma, còn lập trình viên cần{' '}
              <b>đọc được</b> file Figma: lấy màu, cỡ chữ, khoảng cách, xuất ảnh/icon, rồi dựng lại bằng HTML/CSS. Phần
              đó chỉ mất vài buổi.
            </p>
            <p>
              <b>Khi nào học:</b> sau khi vững CSS (tầng 1), hoặc khi tới kỳ có môn này — đừng để nó chen trước HTML/CSS/JS.
            </p>
          </div>
          <Link
            href="/academy/courses/ui-ux-design"
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-neon-violet hover:underline"
          >
            Mở WDU203c — UI/UX Design <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="rounded-2xl border border-darkborder bg-darkcard p-5">
          <h3 className="font-heading font-bold text-text-primary mb-2">📦 Những khoá không có trong tháp</h3>
          <p className="text-sm text-text-secondary mb-3">
            Có thật và dùng được, nhưng <b>không nằm trên đường chính</b>. Bỏ qua cũng không sao.
          </p>
          <div className="space-y-2">
            {NGOAI_LE.map((b) => (
              <TheBuoc key={b.slug} b={b} tienDo={tienDo[b.slug]} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
