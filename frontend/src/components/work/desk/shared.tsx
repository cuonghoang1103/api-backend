'use client';

/**
 * CT Work — mảnh dùng chung của SERVICE DESK (đợt S5a): huy hiệu P1–P4, đồng hồ SLA đếm ngược, nhãn.
 * Màu theo token `--w-*` của work.css (theme tối đi qua biến CSS — không dùng Tailwind `dark:`).
 *
 * Đồng hồ: số liệu do SERVER tính (slaRules.computeSla — giờ làm, ngày lễ, tạm dừng). Giao diện chỉ đếm lùi
 * trơn khi CHẮC CHẮN đồng hồ chạy liên tục tới hạn (lịch 24/7, hoặc hạn rơi trong cùng khung giờ làm hiện tại —
 * hạn − lúc tải ≈ số phút còn lại); còn lại để nguyên con số của server, hàng đợi tự tải lại mỗi 30 giây.
 */

import { useEffect, useState } from 'react';
import { AlarmClock, CheckCircle2, CircleAlert, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';
import { signalText } from '../ui';
import type { DeskPriority, SlaStatus, SlaTarget } from '@/lib/work-s5a-api';
import { wt, wfmt } from '@/components/work/i18n';

export const P_COLOR: Record<DeskPriority, string> = { P1: 'var(--w-red)', P2: 'var(--w-orange)', P3: 'var(--w-blue)', P4: 'var(--w-status-todo)' };
/** Màu CHỮ của huy hiệu (UX-A P0-3: trước 3.1–3.9:1). P4 dùng chữ phụ mức 2 thay vì xám glyph. */
export const P_TEXT: Record<DeskPriority, string> = { P1: 'var(--w-red-text)', P2: 'var(--w-orange-text)', P3: 'var(--w-blue-text)', P4: 'var(--w-text-2)' };
export const P_LABEL: Record<DeskPriority, string> = { get P1() { return wt('desk.pCritical'); }, get P2() { return wt('status.prioHigh'); }, get P3() { return wt('status.prioMedium'); }, get P4() { return wt('status.prioLow'); } };

export function PriorityBadge({ p, className, long }: { p: DeskPriority; className?: string; long?: boolean }) {
  return (
    <span
      title={`${p} · ${P_LABEL[p]}`}
      className={cn('inline-flex h-[20px] shrink-0 items-center gap-1 rounded-[5px] px-1.5 text-[11.5px] font-semibold tabular-nums', className)}
      style={{ color: P_TEXT[p], background: `color-mix(in srgb, ${P_COLOR[p]} 12%, transparent)`, boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${P_COLOR[p]} 35%, transparent)` }}
      data-testid={`prio-${p}`}
    >
      {p}{long && <span className="font-medium">· {P_LABEL[p]}</span>}
    </span>
  );
}

const STATUS_COLOR: Record<SlaStatus, string> = { ON_TRACK: 'var(--w-green)', AT_RISK: 'var(--w-orange)', BREACHED: 'var(--w-red)', MET: 'var(--w-green)' };
export const SLA_STATUS_LABEL: Record<SlaStatus, string> = { get ON_TRACK() { return wt('desk.onTrack'); }, get AT_RISK() { return wt('desk.atRisk'); }, get BREACHED() { return wt('desk.breached'); }, get MET() { return wt('desk.met'); } };

function fmtMin(min: number): string {
  const m = Math.round(Math.abs(min));
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  if (h < 24) return r ? `${h}h ${r}m` : `${h}h`;
  const d = Math.floor(h / 24);
  const hh = h % 24;
  return hh ? `${d}d ${hh}h` : `${d}d`;
}

/** Phút còn lại "sống": chỉ đếm lùi khi đồng hồ chắc chắn chạy liên tục tới hạn. */
function useLiveRemaining(t: SlaTarget, fetchedAt: number): number {
  const linear = !t.stopped && !t.paused && !!t.dueAt && (t.calendar === 'ALWAYS' || Math.abs((Date.parse(t.dueAt) - fetchedAt) / 60_000 - t.remainingMin) < 1.5);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!linear) return;
    const id = setInterval(() => setNow(Date.now()), 15_000);
    return () => clearInterval(id);
  }, [linear]);
  return linear ? t.remainingMin - Math.max(0, now - fetchedAt) / 60_000 : t.remainingMin;
}

/** Đồng hồ một mục tiêu SLA: trạng thái + còn lại / quá + thanh đã dùng. */
export function SlaClock({ t, fetchedAt, compact, label }: { t: SlaTarget; fetchedAt: number; compact?: boolean; label?: string }) {
  const remaining = useLiveRemaining(t, fetchedAt);
  const breached = t.status === 'BREACHED' || remaining < 0;
  // Ngưỡng at-risk do server quyết (cấu hình theo dự án); giao diện chỉ tự chuyển sang Breached khi đếm lùi qua 0.
  const status: SlaStatus = t.stopped ? t.status : breached ? 'BREACHED' : t.status;
  const color = STATUS_COLOR[status];
  const used = Math.min(100, Math.max(0, ((t.goalMin - remaining) / t.goalMin) * 100));
  const text = t.stopped ? (t.status === 'MET' ? wt('desk.met') : wt('desk.breachedBy', { t: fmtMin(t.elapsedMin - t.goalMin) }))
    : t.paused ? (compact ? wt('desk.paused') : wt('desk.pausedLeft', { t: fmtMin(Math.max(0, remaining)) }))
      : remaining >= 0 ? wt('desk.left', { t: fmtMin(remaining) }) : wt('desk.over', { t: fmtMin(-remaining) });
  const Icon = t.stopped ? (t.status === 'MET' ? CheckCircle2 : CircleAlert) : t.paused ? Pause : breached ? CircleAlert : AlarmClock;
  const title = [
    label, `${wt('desk.goalTip', { t: fmtMin(t.goalMin) })}${t.calendar === 'BUSINESS' ? wt('desk.businessHoursParen') : ' (24/7)'}`, wt('desk.usedTip', { t: fmtMin(t.elapsedMin) }),
    t.dueAt && !t.stopped && !t.paused ? wt('desk.dueTip', { t: new Date(t.dueAt).toLocaleString(wfmt.intl()) }) : null,
    t.breachedAt ? wt('desk.breachedAtTip', { t: new Date(t.breachedAt).toLocaleString(wfmt.intl()) }) : null,
  ].filter(Boolean).join(' · ');
  return (
    <div className={cn('min-w-0', compact ? 'w-[118px]' : 'w-full')} title={title} data-sla-status={status}>
      <div className="flex min-w-0 items-center gap-1 text-[12px] font-medium tabular-nums" style={{ color: t.paused && !t.stopped ? 'var(--w-text-3)' : signalText(color) }}>
        <Icon size={12} className="shrink-0" />
        <span className="truncate">{text}</span>
      </div>
      <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-[var(--w-sunken)]" aria-hidden="true">
        <div className="h-full rounded-full" style={{ width: `${t.stopped && t.status === 'MET' ? Math.min(100, (t.elapsedMin / t.goalMin) * 100) : used}%`, background: t.paused && !t.stopped ? 'var(--w-text-3)' : color, opacity: t.stopped ? 0.55 : 1 }} />
      </div>
    </div>
  );
}

export const VIEW_LABEL: Record<string, string> = {
  get open() { return wt('desk.vOpen'); }, get unassigned() { return wt('common.unassigned'); }, get mine() { return wt('desk.vMine'); }, get at_risk() { return wt('desk.atRisk'); }, get breached() { return wt('desk.breached'); }, get waiting() { return wt('desk.waitingCustomer'); }, get team() { return wt('desk.vTeam'); }, get resolved() { return wt('common.resolved'); },
};

export const EVENT_LABEL: Record<string, string> = {
  get START() { return wt('desk.evStart'); }, get PAUSE() { return wt('desk.evPause'); }, get RESUME() { return wt('desk.evResume'); }, get FIRST_RESPONSE() { return wt('desk.firstResponse'); }, get RESOLVE() { return wt('common.resolved'); }, get REOPEN() { return wt('desk.evReopen'); }, get PRIORITY() { return wt('desk.evPriority'); },
};

/** Phút ⇄ chữ gọn cho ô nhập mục tiêu ("90" ⇒ "1h 30m"). */
export const minutesText = fmtMin;
