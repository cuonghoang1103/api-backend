'use client';
/**
 * Huấn luyện học kỳ — mảnh giao diện dùng chung.
 * Màu qua biến CSS của theme (không dùng `dark:` — xem CLAUDE.md, chủ đề tối là `theme-dark`).
 */
import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { LogIn } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { MAU_MUC, NHAN_LOAI, NHAN_TRANG_THAI, type MucDo, type TrangThai, type ViecGon } from '@/lib/hoc-tap-api';

export function cx(...a: Array<string | false | null | undefined>) {
  return a.filter(Boolean).join(' ');
}

export function Khung({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  if (isHydrated && !isAuthenticated) {
    return (
      <div className="pt-16 flex min-h-[70vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="text-4xl">🎯</div>
        <h1 className="font-heading text-xl font-bold text-text-primary">Huấn luyện học kỳ</h1>
        <p className="max-w-sm text-sm text-text-muted">Đăng nhập để AI lập kế hoạch học, chấm bài bạn nộp và báo động khi bạn sắp trượt môn.</p>
        <Link href={`/login?next=${encodeURIComponent('/hoc-tap')}`} className="inline-flex items-center gap-2 rounded-xl bg-neon-violet px-5 py-2.5 text-sm font-medium text-white">
          <LogIn size={16} /> Đăng nhập
        </Link>
      </div>
    );
  }
  return (
    <div className="pt-16 min-h-[calc(100dvh-var(--app-chrome-bottom,0px))] bg-[var(--bg-primary)]">
      <div className="mx-auto max-w-6xl px-4 pb-28 pt-4 sm:pb-12">{children}</div>
    </div>
  );
}

export function The({ children, className, style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={cx('rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 shadow-sm', className)} style={style}>
      {children}
    </div>
  );
}

/** Đồng hồ tỷ lệ trượt — nửa vòng tròn, đỏ thì nhấp nháy viền. */
export function DongHoRuiRo({ tyLe, mucDo, nho }: { tyLe: number; mucDo: MucDo; nho?: boolean }) {
  const m = MAU_MUC[mucDo];
  const r = nho ? 34 : 64;
  const w = nho ? 8 : 14;
  const C = Math.PI * r;
  const [hien, setHien] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setHien(tyLe), 60);
    return () => clearTimeout(t);
  }, [tyLe]);
  const size = (r + w) * 2;
  return (
    <div className="relative flex flex-col items-center" style={{ width: size }}>
      <svg width={size} height={r + w * 1.5} viewBox={`0 0 ${size} ${r + w * 1.5}`} aria-hidden>
        <path d={`M ${w} ${r + w} A ${r} ${r} 0 0 1 ${size - w} ${r + w}`} fill="none" stroke="var(--border-color)" strokeWidth={w} strokeLinecap="round" />
        <path
          d={`M ${w} ${r + w} A ${r} ${r} 0 0 1 ${size - w} ${r + w}`}
          fill="none" stroke={m.chu} strokeWidth={w} strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={C * (1 - hien / 100)}
          style={{ transition: 'stroke-dashoffset 900ms cubic-bezier(.2,.8,.2,1)' }}
        />
      </svg>
      <div className={cx('absolute text-center', nho ? 'top-[22px]' : 'top-[42px]')}>
        <div className={cx('font-heading font-black tabular-nums', nho ? 'text-xl' : 'text-4xl')} style={{ color: m.chu }}>{tyLe}%</div>
        {!nho && <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: m.chu }}>{m.nhan}</div>}
      </div>
    </div>
  );
}

export function ThanhTienDo({ tienDo, kyVong, mau = '#6366f1' }: { tienDo: number; kyVong?: number; mau?: string }) {
  return (
    <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-[var(--border-color)]">
      <div className="h-full rounded-full transition-[width] duration-700" style={{ width: `${Math.min(100, tienDo)}%`, background: mau }} />
      {kyVong !== undefined && kyVong > 0 && (
        <div className="absolute top-0 h-full w-0.5 bg-[var(--text-primary)] opacity-70" style={{ left: `${Math.min(100, kyVong)}%` }} title={`Đáng lẽ phải xong ${kyVong}%`} />
      )}
    </div>
  );
}

export function NhanTrangThai({ t }: { t: TrangThai }) {
  const n = NHAN_TRANG_THAI[t];
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ color: n.mau, background: `${n.mau}1f` }}>
      {t === 'DAT' ? '✓' : t === 'CHO_CHAM' ? '⏳' : t === 'CHUA_DAT' ? '↻' : '•'} {n.ten}
    </span>
  );
}

export function conLai(han: string, now = Date.now()) {
  const ms = new Date(han).getTime() - now;
  const tre = ms < 0;
  const a = Math.abs(ms);
  const ngay = Math.floor(a / 86_400_000);
  const gio = Math.floor((a % 86_400_000) / 3_600_000);
  const s = ngay > 0 ? `${ngay} ngày ${gio}h` : gio > 0 ? `${gio}h ${Math.floor((a % 3_600_000) / 60_000)}'` : `${Math.floor(a / 60_000)}'`;
  return { tre, chu: tre ? `trễ ${s}` : `còn ${s}` };
}

export function DongViec({ v, onMo }: { v: ViecGon; onMo: (id: number) => void }) {
  const l = NHAN_LOAI[v.loai] ?? { ten: v.loai, bieuTuong: '•' };
  const h = conLai(v.hanChot);
  return (
    <button
      onClick={() => onMo(v.id)}
      className="group flex w-full items-center gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] px-3 py-2.5 text-left transition hover:-translate-y-0.5 hover:shadow-md"
      style={{ borderLeft: `4px solid ${v.mau ?? '#6366f1'}` }}
    >
      <span className="text-lg" aria-hidden>{l.bieuTuong}</span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-text-primary">{v.tieuDe}</span>
        <span className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[11px] text-text-muted">
          <b style={{ color: v.mau ?? undefined }}>{v.maMon}</b>
          <span>{l.ten}</span>
          <span>⏱ {v.thoiLuongPhut}′</span>
          <span className={h.tre ? 'font-semibold text-red-500' : ''}>{h.chu}</span>
        </span>
      </span>
      <NhanTrangThai t={v.trangThai} />
    </button>
  );
}

export function Nut({ children, onClick, kieu = 'chinh', disabled, className, type = 'button' }: {
  children: ReactNode; onClick?: () => void; kieu?: 'chinh' | 'phu' | 'nguy'; disabled?: boolean; className?: string; type?: 'button' | 'submit';
}) {
  const k = {
    chinh: 'bg-neon-violet text-white hover:bg-neon-violet/90',
    phu: 'border border-[var(--border-color)] bg-[var(--bg-card)] text-text-primary hover:border-neon-violet/60',
    nguy: 'bg-red-500 text-white hover:bg-red-600',
  }[kieu];
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cx('inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50', k, className)}>
      {children}
    </button>
  );
}

/** Hộp thoại đơn giản, cuộn được, khớp bề ngang điện thoại. */
export function HopThoai({ mo, onDong, tieuDe, children, rong }: { mo: boolean; onDong: () => void; tieuDe: ReactNode; children: ReactNode; rong?: boolean }) {
  useEffect(() => {
    if (!mo) return;
    const f = (e: KeyboardEvent) => { if (e.key === 'Escape') onDong(); };
    window.addEventListener('keydown', f);
    return () => window.removeEventListener('keydown', f);
  }, [mo, onDong]);
  if (!mo) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4" onClick={onDong}>
      <div
        className={cx('max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 shadow-2xl sm:rounded-3xl', rong ? 'sm:max-w-3xl' : 'sm:max-w-xl')}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="font-heading text-lg font-bold text-text-primary">{tieuDe}</div>
          <button onClick={onDong} className="rounded-lg px-2 text-xl leading-none text-text-muted hover:text-text-primary" aria-label="Đóng">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export const oNhap = 'w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-sm text-text-primary outline-none focus:border-neon-violet';
