'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BarChart3, Boxes, Brain, Cloud, Database, FlaskConical, Info, Layers, Link2, type LucideIcon } from 'lucide-react';
import { ghepMon, thongKe, trangThai, type MonHoc, type TienDoKhoa } from './chung';
import { CHUOI_LABFLOW, NGHE, TEN_DU_AN_NGHE, tinhNenChung, type Nghe } from './ngheData';
import BacThang3D from './BacThang3D';
import HangMon from './HangMon';
import { BE_MAT, NEN_PHU, NhanMon, NutHoc, ThanhTienDo, VongTienDo } from './PhanTu';

export const ICON_NGHE: Record<Nghe['icon'], LucideIcon> = { Brain, BarChart3, Database, Cloud, Boxes, Link2 };

/** Danh sách môn của một nghề theo thứ tự học: bậc chính, nhánh tuỳ chọn chen ngay sau bậc nó gắn. */
export function monCuaNghe(n: Nghe): MonHoc[] {
  const ds: MonHoc[] = [];
  n.buoc.forEach((b, i) => {
    ds.push(ghepMon(b, { duAn: `${TEN_DU_AN_NGHE} — ${n.ten}`, nhom: `${n.ten}, bậc ${i + 1}/${n.buoc.length}`, hex: n.hex }));
    for (const t of n.tuyChon.filter((x) => (x.canh ?? n.buoc.length) === i + 1)) {
      ds.push(ghepMon(t, { duAn: `${TEN_DU_AN_NGHE} — ${n.ten}`, nhom: `${n.ten}, nhánh tuỳ chọn`, hex: n.hex, tuyChon: true }));
    }
  });
  return ds;
}

/** Bậc "Bạn đang ở đây" = bậc chính đầu tiên chưa xong. */
export function bacODay(n: Nghe, tienDo: Record<string, TienDoKhoa>): number {
  const i = n.buoc.findIndex((b) => (tienDo[b.slug]?.pct ?? 0) < 100);
  return i < 0 ? n.buoc.length - 1 : i;
}

export default function CheDoNghe({
  la3D,
  ngheChon,
  onChonNghe,
  tienDo,
  coTienDo,
  daDangNhap,
  onMoMon,
}: {
  la3D: boolean;
  ngheChon: string;
  onChonNghe: (slug: string) => void;
  tienDo: Record<string, TienDoKhoa>;
  coTienDo: boolean;
  daDangNhap: boolean;
  onMoMon: (ds: MonHoc[], viTri: number) => void;
}) {
  const nghe = NGHE.find((x) => x.slug === ngheChon) ?? NGHE[0];
  const ds = useMemo(() => monCuaNghe(nghe), [nghe]);
  const oDay = bacODay(nghe, tienDo);
  const [chon, setChon] = useState(nghe.buoc[oDay]?.slug ?? nghe.buoc[0].slug);

  // Đổi nghề (hoặc tiến độ vừa tải xong) ⇒ đưa lựa chọn về bậc đang đứng.
  useEffect(() => {
    setChon(nghe.buoc[bacODay(nghe, tienDo)]?.slug ?? nghe.buoc[0].slug);
  }, [nghe, tienDo]);

  const nenChung = useMemo(() => tinhNenChung(), []);
  const chinh = ds.filter((m) => !m.tuyChon);
  const tk = thongKe(chinh, tienDo);
  const viTriChon = Math.max(0, ds.findIndex((m) => m.slug === chon));
  const monChon = ds[viTriChon];
  const tdChon = tienDo[monChon.slug];
  const Icon = ICON_NGHE[nghe.icon];

  return (
    <div className="space-y-8">
      {/* Chọn nghề */}
      <div className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto [scrollbar-width:none]">
        <div className="flex gap-2 w-max sm:w-auto sm:flex-wrap" role="tablist" aria-label="Chọn nghề">
          {NGHE.map((n) => {
            const I = ICON_NGHE[n.icon];
            const dang = n.slug === nghe.slug;
            const s = thongKe(monCuaNghe(n).filter((m) => !m.tuyChon), tienDo);
            return (
              <button
                key={n.slug}
                type="button"
                role="tab"
                aria-selected={dang}
                onClick={() => onChonNghe(n.slug)}
                className={`relative flex items-center gap-2 pl-2 pr-3 py-2 rounded-xl border text-sm font-semibold whitespace-nowrap transition-[border-color,box-shadow,color] ${
                  dang
                    ? 'border-transparent text-text-primary shadow-[0_8px_22px_-12px_rgba(99,102,241,0.9)]'
                    : 'border-[var(--border-color)] bg-[var(--bg-card)] text-text-secondary hover:text-text-primary hover:border-neon-violet/40'
                }`}
                style={dang ? { background: `linear-gradient(var(--bg-card), var(--bg-card)) padding-box, linear-gradient(135deg, ${n.hex[0]}, ${n.hex[1]}) border-box`, borderWidth: 2 } : undefined}
              >
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0"
                  style={{ background: `linear-gradient(135deg, ${n.hex[0]}, ${n.hex[1]})` }}
                >
                  <I className="w-4 h-4" />
                </span>
                {n.ten}
                {coTienDo && s.pctTB > 0 && <span className="text-xs font-bold tabular-nums text-text-muted">{s.pctTB}%</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bậc thang + bảng chi tiết */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-start">
        <div className={`${BE_MAT} rounded-2xl overflow-hidden relative lt-luoi`}>
          <div className="relative px-4 pt-4 sm:px-5 flex items-center gap-2 text-sm text-text-secondary">
            <Icon className="w-4 h-4" style={{ color: nghe.hex[1] }} />
            Cầu thang {nghe.ten}: {nghe.buoc.length} bậc
            {nghe.tuyChon.length > 0 && `, ${nghe.tuyChon.length} nhánh tuỳ chọn`}
          </div>
          <div className="relative px-3 pb-3 sm:px-4">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={nghe.slug}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <BacThang3D
                  la3D={la3D}
                  nghe={nghe}
                  tienDo={tienDo}
                  coTienDo={coTienDo}
                  daDangNhap={daDangNhap}
                  chon={chon}
                  oDay={oDay}
                  onChon={setChon}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.section
            key={nghe.slug}
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={`${BE_MAT} rounded-2xl overflow-hidden`}
            aria-label={`Lộ trình ${nghe.ten}`}
          >
            <div className="relative px-5 pt-5 pb-4">
              <div aria-hidden className="absolute inset-0 opacity-[0.14]" style={{ background: `linear-gradient(135deg, ${nghe.hex[0]}, ${nghe.hex[1]} 60%, transparent)` }} />
              <div className="relative flex items-start gap-4">
                <VongTienDo
                  id={`nghe-${nghe.slug}`}
                  pct={coTienDo ? tk.pctTB : 0}
                  co={68}
                  mau={nghe.hex}
                  nhan={coTienDo ? undefined : <Icon className="w-6 h-6" style={{ color: nghe.hex[1] }} />}
                />
                <div className="min-w-0 flex-1">
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-text-primary leading-tight">{nghe.ten}</h3>
                  <p className="text-[13.5px] text-text-secondary leading-snug mt-1">{nghe.moTa}</p>
                  {coTienDo && (
                    <p className="text-xs text-text-muted mt-1.5 tabular-nums">
                      {tk.xong}/{tk.tong} bậc xong{tk.dang > 0 && `, ${tk.dang} đang học`}
                    </p>
                  )}
                </div>
              </div>
              <div className={`relative mt-3 ${NEN_PHU} rounded-xl p-3 flex gap-2.5`}>
                <FlaskConical className="w-[18px] h-[18px] shrink-0 mt-0.5" style={{ color: nghe.hex[1] }} />
                <p className="text-[13px] text-text-secondary leading-snug">
                  <b className="text-text-primary">Phần của bạn trong LabFlow AI. </b>
                  {nghe.labflow}
                </p>
              </div>
            </div>

            {/* Bậc đang chọn */}
            <div className="px-5">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={monChon.slug}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="rounded-xl p-4 border"
                  style={{ borderColor: `${nghe.hex[0]}77`, background: `${nghe.hex[0]}10` }}
                >
                  <p className="text-xs font-semibold text-text-muted">{monChon.nhom}</p>
                  <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                    <span className="font-heading text-lg font-bold text-text-primary leading-tight">{monChon.ten}</span>
                    <NhanMon academy={monChon.academy} khung={monChon.khung} tuyChon={monChon.tuyChon} />
                  </div>
                  {coTienDo && tdChon && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 min-w-0">
                        <ThanhTienDo pct={tdChon.pct} mau={trangThai(tdChon) === 'xong' ? ['#34d399', '#059669'] : nghe.hex} />
                      </div>
                      <span className="text-xs font-semibold tabular-nums text-text-primary">{tdChon.pct}%</span>
                    </div>
                  )}
                  {monChon.lamDuoc.length > 0 && (
                    <ul className="mt-2.5 space-y-1">
                      {monChon.lamDuoc.slice(0, 3).map((y) => (
                        <li key={y} className="text-[13px] text-text-secondary leading-snug flex gap-2">
                          <span className="mt-[7px] w-1.5 h-1.5 rounded-full shrink-0" style={{ background: nghe.hex[1] }} />
                          <span className="min-w-0">{y}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <NutHoc slug={monChon.slug} td={tdChon} mau={nghe.hex} />
                    <button
                      type="button"
                      onClick={() => onMoMon(ds, viTriChon)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-text-primary border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-neon-violet/50"
                    >
                      <Info className="w-3.5 h-3.5" /> Làm được gì, góp gì cho dự án
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="px-5 pt-4 pb-5">
              <p className="text-sm font-semibold text-text-primary mb-2">Cả lộ trình, theo thứ tự</p>
              <ol className="space-y-2">
                {ds.map((m, i) => {
                  const soBac = m.tuyChon ? undefined : nghe.buoc.findIndex((b) => b.slug === m.slug) + 1;
                  return (
                    <li key={m.slug} className={m.tuyChon ? 'pl-6 sm:pl-8' : ''}>
                      <HangMon
                        mon={m}
                        so={soBac}
                        td={tienDo[m.slug]}
                        coTienDo={coTienDo}
                        noiBat={m.slug === chon}
                        onMo={() => {
                          setChon(m.slug);
                          onMoMon(ds, i);
                        }}
                      />
                    </li>
                  );
                })}
              </ol>
            </div>
          </motion.section>
        </AnimatePresence>
      </div>

      {/* Chuỗi dự án LabFlow */}
      <section>
        <h3 className="font-heading text-lg font-bold text-text-primary">Sáu nghề, một dự án: LabFlow AI</h3>
        <p className="text-sm text-text-secondary mt-1 max-w-[70ch]">
          Hệ thống đặt phòng lab, mượn thiết bị, thu dữ liệu cảm biến và trợ lý AI (Spring Boot + React + PostgreSQL).
          Dự án cuối khoá của mỗi nghề là một mắt xích — dữ liệu nghề trước làm ra là đầu vào của nghề sau.
        </p>
        <ol className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {CHUOI_LABFLOW.map((c, i) => {
            const n = NGHE.find((x) => x.slug === c.nghe)!;
            const I = ICON_NGHE[n.icon];
            const dang = n.slug === nghe.slug;
            return (
              <li key={c.nghe} className="relative">
                <button
                  type="button"
                  onClick={() => onChonNghe(n.slug)}
                  className={`w-full h-full text-left rounded-xl p-3 border transition-[border-color,box-shadow] ${
                    dang ? 'shadow-[0_10px_24px_-14px_rgba(99,102,241,0.9)]' : 'border-[var(--border-color)] bg-[var(--bg-card)] hover:border-neon-violet/40'
                  } ${i === CHUOI_LABFLOW.length - 1 ? 'border-dashed' : ''}`}
                  style={dang ? { borderColor: n.hex[0], background: `${n.hex[0]}14` } : undefined}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-[11px] font-bold tabular-nums text-text-muted">{i + 1}</span>
                    <span className="w-6 h-6 rounded-md flex items-center justify-center text-white shrink-0" style={{ background: `linear-gradient(135deg, ${n.hex[0]}, ${n.hex[1]})` }}>
                      <I className="w-3.5 h-3.5" />
                    </span>
                  </span>
                  <span className="block mt-2 text-[13px] font-bold text-text-primary leading-tight">{n.ten}</span>
                  <span className="block text-[12px] text-text-secondary leading-snug mt-0.5">{c.viec}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Tầng nền dùng chung */}
      <section>
        <h3 className="font-heading text-lg font-bold text-text-primary flex items-center gap-2">
          <Layers className="w-5 h-5 text-violet-700 [.theme-dark_&]:text-neon-violet" /> Tầng nền dùng chung
        </h3>
        <p className="text-sm text-text-secondary mt-1 max-w-[70ch]">
          Mỗi chủ đề chỉ có MỘT khoá. Khoá dưới đây nằm trong nhiều nghề — học một lần là đi được nhiều hướng, đổi nghề
          giữa chừng cũng không mất công.
        </p>
        <div className={`${BE_MAT} mt-3 rounded-2xl overflow-x-auto`}>
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-[var(--border-color)]">
                <th className="text-left font-semibold text-text-secondary px-4 py-2.5">Khoá</th>
                {NGHE.map((n) => {
                  const I = ICON_NGHE[n.icon];
                  return (
                    <th key={n.slug} className="px-2 py-2.5 font-semibold text-text-secondary text-center">
                      <span className="inline-flex flex-col items-center gap-1 text-[11px]">
                        <I className="w-4 h-4" style={{ color: n.hex[1] }} />
                        {n.ngan}
                      </span>
                    </th>
                  );
                })}
                <th className="px-3 py-2.5 text-right font-semibold text-text-secondary">Tiến độ</th>
              </tr>
            </thead>
            <tbody>
              {nenChung.map((k) => {
                const td = tienDo[k.slug];
                return (
                  <tr key={k.slug} className="border-b last:border-b-0 border-[var(--border-color)] hover:bg-[var(--bg-surface)]">
                    <td className="px-4 py-2">
                      <span className="font-medium text-text-primary">{k.ten}</span>
                      {k.khung && <span className="ml-1.5 text-[10.5px] text-amber-800 [.theme-dark_&]:text-amber-400 font-semibold">Đang soạn</span>}
                    </td>
                    {NGHE.map((n) => {
                      const co = k.nghe.includes(n.slug);
                      return (
                        <td key={n.slug} className="px-2 py-2 text-center">
                          {co ? (
                            <button
                              type="button"
                              onClick={() => onChonNghe(n.slug)}
                              aria-label={`${k.ten} có trong ${n.ten}`}
                              className="inline-block w-3.5 h-3.5 rounded-full ring-2 ring-[var(--bg-card)] hover:scale-125 transition-transform"
                              style={{ background: `linear-gradient(135deg, ${n.hex[0]}, ${n.hex[1]})` }}
                            />
                          ) : (
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--border-color)]" aria-hidden />
                          )}
                        </td>
                      );
                    })}
                    <td className="px-3 py-2 text-right">
                      {coTienDo && td ? (
                        <span className="text-xs font-semibold tabular-nums text-text-primary">{td.pct}%</span>
                      ) : (
                        <span className="pointer-events-auto">
                          <NutHoc slug={k.slug} td={td} />
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
