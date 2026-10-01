'use client';

/**
 * Tab "🧭 Lộ trình" của /courses — hai chế độ:
 *   🏛 Tháp nền tảng (fullstack): tháp 6 tầng THAP, khối CSS 3D xếp chồng.
 *   🎯 Theo nghề: 6 nghề (lo-trinh/ngheData.ts), mỗi nghề một cầu thang 3D.
 * Bấm tầng/bậc ⇒ bảng chi tiết; bấm môn ⇒ hộp "làm được gì + đóng góp dự án".
 *
 * Thành phần: lo-trinh/*. Dữ liệu: roadmapData.ts (tháp + KHOA) và lo-trinh/ngheData.ts.
 * Tiến độ: coursesApi.getAllMyCourses() → Enrollment.courseSlug/progressPercent/lastLessonTitle.
 * Mọi hook đặt TRƯỚC mọi nhánh return (build không chạy lint rules-of-hooks).
 */

import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, Landmark, Package, Repeat2, Route } from 'lucide-react';
import { THAP, SONG_SONG, NGOAI_LE } from './roadmapData';
import { boTrung, ghepMon, thongKe, useLa3D, useTienDo, type MonHoc } from './lo-trinh/chung';
import { KEYFRAMES_3D } from './lo-trinh/Khoi3D';
import Thap3D, { type SoLieuTang } from './lo-trinh/Thap3D';
import BangTang from './lo-trinh/BangTang';
import HopMon from './lo-trinh/HopMon';
import TongQuan from './lo-trinh/TongQuan';
import HangMon from './lo-trinh/HangMon';
import CheDoNghe, { monCuaNghe } from './lo-trinh/CheDoNghe';
import { NGHE } from './lo-trinh/ngheData';
import { BE_MAT } from './lo-trinh/PhanTu';

type CheDo = 'thap' | 'nghe';

const MAU_XEN_KE: [string, string] = ['#818cf8', '#6366f1'];
const MAU_NGOAI: [string, string] = ['#94a3b8', '#64748b'];

// Môn của từng tầng đã ghép "làm được gì" + dự án — tính một lần.
const MON_THEO_TANG: Record<number, MonHoc[]> = Object.fromEntries(
  THAP.map((t) => [
    t.so,
    t.buoc.map((b, i) => ghepMon(b, { duAn: t.duAn, nhom: `Tầng ${t.so}: ${t.ten}, môn ${i + 1}/${t.buoc.length}`, hex: t.hex })),
  ]),
);
const MON_THAP: MonHoc[] = THAP.flatMap((t) => MON_THEO_TANG[t.so]);
const MON_XEN_KE: MonHoc[] = SONG_SONG.map((b) => ghepMon(b, { duAn: 'Học xen kẽ — dùng cho mọi dự án', nhom: 'Học xen kẽ, không chờ tầng nào', hex: MAU_XEN_KE }));
const MON_NGOAI: MonHoc[] = NGOAI_LE.map((b) => ghepMon(b, { duAn: 'Ngoài đường chính', nhom: 'Ngoài tháp, tuỳ chọn', hex: MAU_NGOAI, tuyChon: true }));

export default function CourseRoadmap() {
  const { daDangNhap, tienDo, dangTai, loi } = useTienDo();
  const { la3D, giamChuyenDong } = useLa3D();
  const coTienDo = daDangNhap && !dangTai;

  const [cheDo, setCheDo] = useState<CheDo>('thap');
  const [ngheChon, setNgheChon] = useState(NGHE[0].slug);
  const [tangChonTay, setTangChonTay] = useState<number | null>(null);
  const [hop, setHop] = useState<{ ds: MonHoc[]; viTri: number } | null>(null);

  // "Bạn đang ở đây" = tầng thấp nhất còn khoá chưa xong (khoá đang soạn không tính).
  const tangHienTai = useMemo(() => {
    for (const t of THAP) {
      if (t.buoc.some((b) => !b.khung && (tienDo[b.slug]?.pct ?? 0) < 100)) return t.so;
    }
    return THAP[THAP.length - 1].so;
  }, [tienDo]);
  const tangChon = tangChonTay ?? tangHienTai;
  const tang = THAP.find((t) => t.so === tangChon) ?? THAP[0];

  const soLieuTang = useMemo(() => {
    const r: Record<number, SoLieuTang> = {};
    for (const t of THAP) {
      const s = thongKe(MON_THEO_TANG[t.so], tienDo);
      r[t.so] = { tong: s.tong, xong: s.xong, pctTB: s.pctTB };
    }
    return r;
  }, [tienDo]);

  const nghe = NGHE.find((n) => n.slug === ngheChon) ?? NGHE[0];
  const tongQuan = useMemo(() => {
    const ds = cheDo === 'thap' ? MON_THAP : monCuaNghe(nghe).filter((m) => !m.tuyChon);
    return thongKe(boTrung(ds), tienDo);
  }, [cheDo, nghe, tienDo]);

  // Học tiếp ngay = khoá đang học dở được mở gần nhất (bất kể lộ trình nào).
  const hocTiep = useMemo(() => {
    let tot: { slug: string; td: (typeof tienDo)[string] } | undefined;
    for (const [slug, td] of Object.entries(tienDo)) {
      if (td.pct >= 100) continue;
      if (!tot || (td.truyCap ?? '') > (tot.td.truyCap ?? '')) tot = { slug, td };
    }
    return tot;
  }, [tienDo]);

  const moMon = useCallback((ds: MonHoc[], viTri: number) => setHop({ ds, viTri }), []);
  const dongHop = useCallback(() => setHop(null), []);

  const tenLoTrinh = cheDo === 'thap' ? 'tháp nền tảng' : `lộ trình ${nghe.ten}`;

  return (
    <div className="space-y-8">
      <style>{KEYFRAMES_3D}</style>

      {/* Lời dẫn + chọn chế độ */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 max-w-[68ch]">
          <h2 className="font-heading text-2xl sm:text-[28px] font-bold text-text-primary leading-tight">
            Nhiều khoá quá — bắt đầu từ đâu?
          </h2>
          <p className="text-text-secondary text-[14.5px] leading-relaxed mt-1.5">
            {cheDo === 'thap' ? (
              <>
                Học <b className="text-text-primary">từ đáy tháp lên</b>: mỗi tầng dựa trên tầng dưới nó. Trong một tầng,
                học theo số thứ tự. Stack chính là <b className="text-text-primary">React + Node.js + PostgreSQL</b>,{' '}
                <b className="text-text-primary">Python</b> cho AI, <b className="text-text-primary">Spring Boot</b> là
                backend thứ hai. Khoá không có trong tháp là tuỳ chọn.
              </>
            ) : (
              <>
                Đã có nền và muốn đi sâu một nghề? Mỗi nghề là một cầu thang: <b className="text-text-primary">mỗi bậc một
                khoá</b>, học từ bậc thấp lên. Khoá nền như Python, PostgreSQL, Docker dùng chung giữa các nghề — học một
                lần là đủ.
              </>
            )}
          </p>
        </div>
        <div
          role="tablist"
          aria-label="Chế độ xem lộ trình"
          className={`${BE_MAT} self-start lg:self-auto shrink-0 inline-flex p-1 rounded-xl max-w-full`}
        >
          {(
            [
              { id: 'thap', nhan: 'Tháp nền tảng', phu: 'fullstack', Icon: Landmark },
              { id: 'nghe', nhan: 'Theo nghề', phu: '6 nghề', Icon: Route },
            ] as const
          ).map(({ id, nhan, phu, Icon }) => {
            const dang = cheDo === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={dang}
                onClick={() => setCheDo(id)}
                className={`relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-colors min-w-0 ${
                  dang ? 'text-white' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {dang && (
                  <motion.span
                    layoutId="lo-trinh-che-do"
                    className="absolute inset-0 rounded-lg bg-neon-gradient shadow-[0_6px_18px_-8px_rgba(139,92,246,0.9)]"
                    transition={giamChuyenDong ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <Icon className="relative w-4 h-4 shrink-0" />
                <span className="relative whitespace-nowrap">{nhan}</span>
                <span className={`relative hidden sm:inline text-[11px] font-medium ${dang ? 'text-white/80' : 'text-text-muted'}`}>
                  {phu}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <TongQuan
        tenLoTrinh={tenLoTrinh}
        soLieu={tongQuan}
        daDangNhap={daDangNhap}
        dangTai={dangTai}
        loi={loi}
        hocTiep={hocTiep}
      />

      {cheDo === 'thap' ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-start">
          <div className={`${BE_MAT} relative rounded-2xl overflow-hidden lt-luoi lg:sticky lg:top-20`}>
            <div className="relative px-4 sm:px-5 pt-4 flex items-center justify-between gap-2 flex-wrap text-sm text-text-secondary">
              <span className="flex items-center gap-2">
                <Landmark className="w-4 h-4 text-violet-700 [.theme-dark_&]:text-neon-violet" /> Tháp 6 tầng, {MON_THAP.length} khoá
              </span>
              {la3D && <span className="text-[11px] text-text-muted">Rê chuột để xoay nhẹ</span>}
            </div>
            <div className="relative px-3 sm:px-4 pb-4">
              <Thap3D
                la3D={la3D}
                tangs={THAP}
                soLieu={soLieuTang}
                chon={tangChon}
                oDay={tangHienTai}
                coTienDo={coTienDo}
                daDangNhap={daDangNhap}
                onChon={setTangChonTay}
              />
            </div>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={tang.so}
              initial={giamChuyenDong ? { opacity: 0 } : { opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={giamChuyenDong ? { opacity: 0 } : { opacity: 0, x: -18 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            >
              <BangTang
                tang={tang}
                mon={MON_THEO_TANG[tang.so]}
                tienDo={tienDo}
                coTienDo={coTienDo}
                tongTang={THAP.length}
                onDoiTang={setTangChonTay}
                onMoMon={(slug) => {
                  const i = MON_THAP.findIndex((m) => m.slug === slug);
                  moMon(MON_THAP, Math.max(0, i));
                }}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        <CheDoNghe
          la3D={la3D}
          ngheChon={ngheChon}
          onChonNghe={setNgheChon}
          tienDo={tienDo}
          coTienDo={coTienDo}
          daDangNhap={daDangNhap}
          onMoMon={moMon}
        />
      )}

      {/* Học xen kẽ */}
      <section>
        <div className="flex items-start gap-3">
          <span className="shrink-0 w-9 h-9 rounded-xl bg-neon-indigo/15 text-neon-indigo flex items-center justify-center">
            <Repeat2 className="w-5 h-5" />
          </span>
          <div className="min-w-0">
            <h3 className="font-heading text-lg font-bold text-text-primary">Học xen kẽ, không chờ tầng nào</h3>
            <p className="text-sm text-text-secondary">
              Mỗi tuần một ít — những thứ này quyết định bạn có qua được phỏng vấn không.
            </p>
          </div>
        </div>
        <div className="mt-3 grid md:grid-cols-2 gap-2.5">
          {MON_XEN_KE.map((m, i) => (
            <HangMon key={m.slug} mon={m} td={tienDo[m.slug]} coTienDo={coTienDo} onMo={() => moMon(MON_XEN_KE, i)} />
          ))}
        </div>
      </section>

      {/* Hỏi đáp */}
      <section className="grid md:grid-cols-2 gap-4">
        <div className={`${BE_MAT} rounded-2xl p-5`}>
          <h3 className="font-heading font-bold text-text-primary mb-2">🎨 Figma (môn WDU203c UI/UX) có phải học không?</h3>
          <div className="text-sm text-text-secondary space-y-2 leading-relaxed">
            <p>
              <b className="text-text-primary">Với trường: có.</b> WDU203c là môn trong khung chương trình, phải qua để lấy
              tín chỉ.
            </p>
            <p>
              <b className="text-text-primary">Với nghề lập trình: không cần giỏi vẽ.</b> Designer vẽ giao diện bằng Figma,
              còn lập trình viên cần <b className="text-text-primary">đọc được</b> file Figma: lấy màu, cỡ chữ, khoảng cách,
              xuất ảnh/icon, rồi dựng lại bằng HTML/CSS. Phần đó chỉ mất vài buổi.
            </p>
            <p>
              <b className="text-text-primary">Khi nào học:</b> sau khi vững CSS (tầng 1), hoặc khi tới kỳ có môn này —
              đừng để nó chen trước HTML/CSS/JS.
            </p>
          </div>
          <Link
            href="/courses/ui-ux-design"
            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-violet-700 [.theme-dark_&]:text-neon-violet hover:underline"
          >
            Mở WDU203c — UI/UX Design <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className={`${BE_MAT} rounded-2xl p-5`}>
          <h3 className="font-heading font-bold text-text-primary mb-1 flex items-center gap-2">
            <Package className="w-5 h-5 text-text-muted" /> Những khoá không có trong tháp
          </h3>
          <p className="text-sm text-text-secondary mb-3">
            Có thật và dùng được, nhưng <b className="text-text-primary">không nằm trên đường chính</b>. Bỏ qua cũng không
            sao.
          </p>
          <div className="space-y-2">
            {MON_NGOAI.map((m, i) => (
              <HangMon key={m.slug} mon={m} td={tienDo[m.slug]} coTienDo={coTienDo} onMo={() => moMon(MON_NGOAI, i)} />
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {hop && (
          <HopMon
            key="hop-mon"
            ds={hop.ds}
            viTri={hop.viTri}
            tienDo={tienDo}
            coTienDo={coTienDo}
            daDangNhap={daDangNhap}
            onDoi={(viTri) => setHop((h) => (h ? { ...h, viTri } : h))}
            onDong={dongHop}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

