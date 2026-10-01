'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, GraduationCap, PencilRuler, Play, RotateCcw } from 'lucide-react';
import { lienKetHoc, trangThai, type TienDoKhoa } from './chung';

/**
 * Bề mặt theo theme. KHÔNG dùng `bg-darkcard`/`bg-darkbg` ở trang này: hai lớp đó là
 * "đảo tối cố định" (globals.css ghim chúng tối kể cả theme sáng) — trang lộ trình cần
 * đi theo theme sáng/tối thật, nên đọc thẳng biến CSS của theme.
 */
export const BE_MAT = 'bg-[var(--bg-card)] border border-[var(--border-color)]';
export const NEN_PHU = 'bg-[var(--bg-surface)]';
export const VIEN = 'border-[var(--border-color)]';

export function VongTienDo({
  pct,
  co = 64,
  day = 6,
  mau = ['#818cf8', '#8b5cf6'],
  nhan,
  id,
}: {
  pct: number;
  co?: number;
  day?: number;
  mau?: [string, string];
  nhan?: React.ReactNode;
  id: string;
}) {
  const r = (co - day) / 2;
  const chuVi = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(100, pct));
  return (
    <div className="relative shrink-0" style={{ width: co, height: co }}>
      <svg width={co} height={co} className="-rotate-90" aria-hidden>
        <defs>
          <linearGradient id={`vong-${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={mau[0]} />
            <stop offset="100%" stopColor={mau[1]} />
          </linearGradient>
        </defs>
        <circle cx={co / 2} cy={co / 2} r={r} fill="none" stroke="var(--border-color)" strokeWidth={day} />
        <motion.circle
          cx={co / 2}
          cy={co / 2}
          r={r}
          fill="none"
          stroke={`url(#vong-${id})`}
          strokeWidth={day}
          strokeLinecap="round"
          strokeDasharray={chuVi}
          initial={false}
          animate={{ strokeDashoffset: chuVi * (1 - p / 100) }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-center leading-none">
        {nhan ?? <span className="text-sm font-bold tabular-nums text-text-primary">{p}%</span>}
      </div>
    </div>
  );
}

export function ThanhTienDo({ pct, mau, mong = false }: { pct: number; mau: [string, string]; mong?: boolean }) {
  return (
    <div className={`${mong ? 'h-1' : 'h-1.5'} w-full rounded-full bg-[var(--border-color)] overflow-hidden`}>
      <motion.div
        className="h-full rounded-full"
        style={{ background: `linear-gradient(90deg, ${mau[0]}, ${mau[1]})` }}
        initial={false}
        animate={{ width: `${Math.max(0, Math.min(100, pct))}%` }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

export function NhanMon({ academy, khung, tuyChon }: { academy?: string; khung?: boolean; tuyChon?: boolean }) {
  return (
    <>
      {academy && (
        <span className="inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded-md bg-sky-500/15 text-sky-700 [.theme-dark_&]:text-sky-400 font-semibold whitespace-nowrap">
          <GraduationCap className="w-3 h-3" /> Academy {academy}
        </span>
      )}
      {khung && (
        <span className="inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-800 [.theme-dark_&]:text-amber-400 font-semibold whitespace-nowrap">
          <PencilRuler className="w-3 h-3" /> Đang soạn
        </span>
      )}
      {tuyChon && (
        <span className="text-[11px] px-1.5 py-0.5 rounded-md border border-dashed border-[var(--border-color)] text-text-muted font-medium whitespace-nowrap">
          Tuỳ chọn
        </span>
      )}
    </>
  );
}

export function NutHoc({ slug, td, to = false, mau }: { slug: string; td?: TienDoKhoa; to?: boolean; mau?: [string, string] }) {
  const { href, nhan } = lienKetHoc(slug, td);
  const tt = trangThai(td);
  const Icon = tt === 'xong' ? RotateCcw : tt === 'dang' ? Play : ArrowRight;
  const chinh = tt !== 'xong';
  return (
    <Link
      href={href}
      onClick={(e) => e.stopPropagation()}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold whitespace-nowrap transition-[transform,box-shadow,background-color] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-violet/60 ${
        to ? 'px-4 py-2.5 text-sm' : 'px-3 py-1.5 text-xs'
      } ${
        chinh
          ? 'text-white shadow-[0_6px_16px_-6px_rgba(99,102,241,0.7)] hover:shadow-[0_8px_22px_-6px_rgba(139,92,246,0.85)]'
          : `${NEN_PHU} text-text-primary border border-[var(--border-color)] hover:border-neon-violet/50`
      }`}
      style={chinh ? { background: `linear-gradient(135deg, ${mau?.[0] ?? '#6366f1'}, ${mau?.[1] ?? '#8b5cf6'})` } : undefined}
    >
      {tt === 'dang' ? <Icon className="w-3.5 h-3.5 fill-current" /> : <Icon className="w-3.5 h-3.5" />}
      {nhan}
    </Link>
  );
}

export function DauTrangThai({ td, so, mau }: { td?: TienDoKhoa; so?: number; mau: [string, string] }) {
  const tt = trangThai(td);
  if (tt === 'xong') {
    return (
      <span className="shrink-0 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-[0_4px_12px_-4px_rgba(16,185,129,0.8)]">
        <CheckCircle2 className="w-4 h-4" />
      </span>
    );
  }
  return (
    <span
      className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold tabular-nums ${
        tt === 'dang' ? '' : 'text-text-secondary'
      }`}
      style={
        tt === 'dang'
          ? { background: `linear-gradient(135deg, ${mau[0]}, ${mau[1]})`, color: '#fff' }
          : { boxShadow: `inset 0 0 0 1.5px ${mau[0]}` }
      }
    >
      {so ?? '•'}
    </span>
  );
}
