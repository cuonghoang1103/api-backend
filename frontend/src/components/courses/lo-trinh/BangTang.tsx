'use client';

import { ChevronLeft, ChevronRight, Clock, FolderGit2, Target, Trophy } from 'lucide-react';
import type { TangThap } from '../roadmapData';
import { thongKe, type MonHoc, type TienDoKhoa } from './chung';
import HangMon from './HangMon';
import { BE_MAT, NEN_PHU, VongTienDo } from './PhanTu';

/** Bảng chi tiết một tầng: mục tiêu, dự án, danh sách môn có % đã học. */
export default function BangTang({
  tang,
  mon,
  tienDo,
  coTienDo,
  tongTang,
  onDoiTang,
  onMoMon,
}: {
  tang: TangThap;
  mon: MonHoc[];
  tienDo: Record<string, TienDoKhoa>;
  coTienDo: boolean;
  tongTang: number;
  onDoiTang: (so: number) => void;
  onMoMon: (slug: string) => void;
}) {
  const tk = thongKe(mon, tienDo);
  return (
    <section className={`${BE_MAT} rounded-2xl overflow-hidden`} aria-label={`Tầng ${tang.so}: ${tang.ten}`}>
      {/* Đầu bảng nhuộm màu tầng */}
      <div className="relative px-5 pt-5 pb-4">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.14]"
          style={{ background: `linear-gradient(135deg, ${tang.hex[0]}, ${tang.hex[1]} 60%, transparent)` }}
        />
        <div className="relative flex items-start gap-4">
          <VongTienDo
            id={`tang-${tang.so}`}
            pct={coTienDo ? tk.pctTB : 0}
            co={68}
            mau={tang.hex}
            nhan={
              coTienDo ? (
                <span className="text-sm font-bold tabular-nums text-text-primary">{tk.pctTB}%</span>
              ) : (
                <span className="font-heading text-2xl font-bold text-text-primary">{tang.so}</span>
              )
            }
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-text-muted">Tầng {tang.so} / {tongTang}</p>
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-text-primary leading-tight">{tang.ten}</h3>
            <p className="text-sm text-text-secondary">{tang.phu}</p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-secondary">
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {tang.thoiGian}
              </span>
              <span className="tabular-nums">
                {coTienDo ? `${tk.xong}/${tk.tong} khoá xong` : `${tk.tong} khoá`}
                {coTienDo && tk.dang > 0 && `, ${tk.dang} đang học`}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 space-y-4">
        <div className="grid sm:grid-cols-2 gap-2.5">
          <div className={`${NEN_PHU} rounded-xl p-3 flex gap-2.5`}>
            <Target className="w-[18px] h-[18px] shrink-0 text-violet-700 [.theme-dark_&]:text-neon-violet mt-0.5" />
            <p className="text-[13px] text-text-secondary leading-snug">
              <b className="text-text-primary">Mục tiêu. </b>
              {tang.mucTieu}
            </p>
          </div>
          <div className={`${NEN_PHU} rounded-xl p-3 flex gap-2.5`}>
            <Trophy className="w-[18px] h-[18px] shrink-0 text-amber-500 mt-0.5" />
            <p className="text-[13px] text-text-secondary leading-snug">
              <b className="text-text-primary">Học xong làm được. </b>
              {tang.lamDuoc}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[13px] text-text-secondary">
          <FolderGit2 className="w-4 h-4 shrink-0" style={{ color: tang.hex[1] }} />
          <span className="min-w-0">
            Dự án của tầng: <b className="text-text-primary">{tang.duAn}</b>
          </span>
        </div>

        <ol className="space-y-2">
          {mon.map((m, i) => (
            <li key={m.slug}>
              <HangMon mon={m} so={i + 1} td={tienDo[m.slug]} coTienDo={coTienDo} onMo={() => onMoMon(m.slug)} />
            </li>
          ))}
        </ol>

        <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
          {tang.so > 1 ? (
            <button
              type="button"
              onClick={() => onDoiTang(tang.so - 1)}
              className="inline-flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-violet-700 [.theme-dark_&]:hover:text-neon-violet"
            >
              <ChevronLeft className="w-4 h-4" /> Tầng {tang.so - 1}
            </button>
          ) : (
            <span />
          )}
          {tang.so < tongTang && (
            <button
              type="button"
              onClick={() => onDoiTang(tang.so + 1)}
              className="inline-flex items-center gap-1 text-sm font-medium text-violet-700 [.theme-dark_&]:text-neon-violet hover:underline"
            >
              Xong tầng này? Lên tầng {tang.so + 1} <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
