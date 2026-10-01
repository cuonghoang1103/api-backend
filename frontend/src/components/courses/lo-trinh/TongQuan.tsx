'use client';

import Link from 'next/link';
import { BookMarked, Hourglass, LogIn, Play } from 'lucide-react';
import { dinhDangThoiGian, type TienDoKhoa } from './chung';
import { BE_MAT, NEN_PHU, ThanhTienDo, VongTienDo } from './PhanTu';

interface SoLieu {
  tong: number;
  xong: number;
  dang: number;
  chua: number;
  pctTB: number;
  tuanCon: number;
}

/** Ô tổng quan đầu trang: vòng tiến độ của lộ trình đang xem + "học tiếp ngay". */
export default function TongQuan({
  tenLoTrinh,
  soLieu,
  daDangNhap,
  dangTai,
  loi,
  hocTiep,
}: {
  tenLoTrinh: string;
  soLieu: SoLieu;
  daDangNhap: boolean;
  dangTai: boolean;
  loi: boolean;
  hocTiep?: { slug: string; td: TienDoKhoa };
}) {
  const callback = encodeURIComponent('/courses?tab=lo-trinh');

  if (!daDangNhap) {
    return (
      <div className={`${BE_MAT} rounded-2xl p-5 grid gap-4 md:grid-cols-[1fr_auto] md:items-center`}>
        <div className="flex items-start gap-4 min-w-0">
          <VongTienDo
            id="tong-khach"
            pct={0}
            co={72}
            nhan={<span className="font-heading text-lg font-bold text-text-primary tabular-nums">{soLieu.tong}</span>}
          />
          <div className="min-w-0">
            <h2 className="font-heading text-lg font-bold text-text-primary leading-snug">
              {tenLoTrinh.charAt(0).toUpperCase() + tenLoTrinh.slice(1)}: {soLieu.tong} khoá, {dinhDangThoiGian(soLieu.tuanCon)} nếu học đều
            </h2>
            <p className="text-sm text-text-secondary mt-1 leading-relaxed max-w-[62ch]">
              Đăng nhập để trang này đánh dấu khoá bạn đã xong, hiện % từng môn, chỉ ra tầng bạn đang đứng và đưa bạn
              về đúng bài đang học dở. Chưa đăng nhập vẫn xem được toàn bộ lộ trình bên dưới.
            </p>
          </div>
        </div>
        <Link
          href={`/login?callbackUrl=${callback}`}
          className="justify-self-start md:justify-self-end inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-neon-gradient shadow-[0_8px_20px_-8px_rgba(139,92,246,0.8)] hover:brightness-110"
        >
          <LogIn className="w-4 h-4" /> Đăng nhập để theo dõi tiến độ
        </Link>
      </div>
    );
  }

  const o = (nhan: string, so: number, mau: string) => (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5 text-xs text-text-muted">
        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: mau }} />
        {nhan}
      </div>
      <div className="font-heading text-xl font-bold text-text-primary tabular-nums">{dangTai ? '–' : so}</div>
    </div>
  );

  return (
    <div className={`${BE_MAT} rounded-2xl p-4 sm:p-5 grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]`}>
      <div className="flex items-center gap-4 sm:gap-5 min-w-0">
        <VongTienDo id="tong" pct={dangTai ? 0 : soLieu.pctTB} co={92} day={8} />
        <div className="min-w-0 flex-1">
          <p className="text-sm text-text-secondary">
            Tiến độ <b className="text-text-primary">{tenLoTrinh}</b>
          </p>
          <div className="mt-2 grid grid-cols-3 gap-3">
            {o('Đã xong', soLieu.xong, '#10b981')}
            {o('Đang học', soLieu.dang, '#8b5cf6')}
            {o('Chưa học', soLieu.chua, 'var(--border-color)')}
          </div>
          <p className="mt-2 text-xs text-text-muted flex items-center gap-1">
            <Hourglass className="w-3.5 h-3.5 shrink-0" />
            {soLieu.tuanCon > 0
              ? `Còn khoảng ${dinhDangThoiGian(soLieu.tuanCon)} với 15–20 giờ mỗi tuần`
              : 'Bạn đã học xong cả lộ trình này'}
          </p>
          {loi && <p className="mt-1 text-xs text-amber-800 [.theme-dark_&]:text-amber-400">Chưa tải được tiến độ — tải lại trang để thử lại.</p>}
        </div>
      </div>

      {hocTiep ? (
        <Link
          href={`/courses/${hocTiep.slug}/learn`}
          className={`${NEN_PHU} group rounded-xl p-4 flex items-center gap-3 min-w-0 border border-transparent hover:border-neon-violet/40 transition-colors`}
        >
          <span className="shrink-0 w-11 h-11 rounded-xl bg-neon-gradient text-white flex items-center justify-center shadow-[0_6px_16px_-6px_rgba(139,92,246,0.9)] group-hover:scale-105 transition-transform">
            <Play className="w-5 h-5 fill-current" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-text-muted">Học tiếp ngay</p>
            <p className="font-semibold text-text-primary truncate">{hocTiep.td.tenKhoa}</p>
            {hocTiep.td.baiGanNhat && (
              <p className="text-[12px] text-text-secondary flex items-center gap-1 min-w-0">
                <BookMarked className="w-3 h-3 shrink-0" />
                <span className="truncate">{hocTiep.td.baiGanNhat}</span>
              </p>
            )}
            <div className="mt-1.5 flex items-center gap-2">
              <div className="flex-1 min-w-0">
                <ThanhTienDo pct={hocTiep.td.pct} mau={['#818cf8', '#8b5cf6']} mong />
              </div>
              <span className="text-xs font-semibold text-text-primary tabular-nums">{hocTiep.td.pct}%</span>
            </div>
          </div>
        </Link>
      ) : (
        <div className={`${NEN_PHU} rounded-xl p-4 text-sm text-text-secondary flex items-center`}>
          {dangTai
            ? 'Đang tải tiến độ…'
            : 'Bạn chưa có khoá nào đang học dở. Bấm vào tầng có ghim "Bạn đang ở đây" để chọn khoá đầu tiên.'}
        </div>
      )}
    </div>
  );
}
