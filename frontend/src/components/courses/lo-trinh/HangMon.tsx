'use client';

import { BookMarked, ChevronRight } from 'lucide-react';
import { trangThai, type MonHoc, type TienDoKhoa } from './chung';
import { DauTrangThai, NhanMon, NutHoc, ThanhTienDo } from './PhanTu';

/**
 * Một dòng môn học. Cả dòng bấm được (mở hộp chi tiết) nhờ một nút phủ kín phía sau;
 * nút "Học tiếp/Bắt đầu" nằm trên nút phủ nên vẫn là một liên kết riêng — không lồng
 * phần tử tương tác vào nhau.
 */
export default function HangMon({
  mon,
  so,
  td,
  coTienDo,
  noiBat = false,
  onMo,
}: {
  mon: MonHoc;
  so?: number;
  td?: TienDoKhoa;
  coTienDo: boolean;
  noiBat?: boolean;
  onMo: () => void;
}) {
  const tt = trangThai(td);
  return (
    <div
      className={`group relative rounded-xl border transition-[border-color,background-color,box-shadow] ${
        noiBat
          ? 'border-neon-violet/60 bg-neon-violet/[0.06] shadow-[0_8px_24px_-14px_rgba(139,92,246,0.8)]'
          : 'border-[var(--border-color)] bg-[var(--bg-card)] hover:border-neon-violet/40 hover:shadow-[0_8px_24px_-16px_rgba(99,102,241,0.6)]'
      }`}
    >
      <button
        type="button"
        onClick={onMo}
        aria-label={`Xem chi tiết: ${mon.ten}`}
        className="absolute inset-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-violet/60"
      />
      <div className="relative pointer-events-none flex items-start gap-3 p-3 sm:p-3.5">
        <DauTrangThai td={td} so={so} mau={mon.hex} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-[14.5px] text-text-primary group-hover:text-violet-700 [.theme-dark_&]:group-hover:text-neon-violet transition-colors">
              {mon.ten}
            </span>
            <NhanMon academy={mon.academy} khung={mon.khung} tuyChon={mon.tuyChon} />
          </div>
          <p className="text-[13px] text-text-secondary mt-0.5 leading-snug">{mon.viSao}</p>
          {coTienDo && td && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 min-w-0">
                <ThanhTienDo pct={td.pct} mau={tt === 'xong' ? ['#34d399', '#059669'] : mon.hex} />
              </div>
              <span className="text-xs font-semibold text-text-primary tabular-nums w-9 text-right">{td.pct}%</span>
            </div>
          )}
          {coTienDo && td?.baiGanNhat && tt === 'dang' && (
            <p className="mt-1 text-[12px] text-text-muted flex items-center gap-1 min-w-0">
              <BookMarked className="w-3 h-3 shrink-0" />
              <span className="truncate">Bài gần nhất: {td.baiGanNhat}</span>
            </p>
          )}
        </div>
        <div className="shrink-0 flex flex-col items-end gap-1.5">
          <span className="pointer-events-auto">
            <NutHoc slug={mon.slug} td={td} mau={mon.hex} />
          </span>
          <span className="hidden sm:flex items-center text-[11px] text-text-muted group-hover:text-violet-700 [.theme-dark_&]:group-hover:text-neon-violet transition-colors">
            Chi tiết <ChevronRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  );
}
