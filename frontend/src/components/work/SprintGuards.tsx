'use client';

/**
 * dm5 G1 — bảng kiểm khi BẮT ĐẦU / LẬP KẾ HOẠCH sprint (GET /projects/:pid/sprints/:sid/guards):
 *   A14  số thẻ chưa Ready (Definition of Ready) + thiếu gì;
 *   A15  ước lượng (giờ) / (sức chứa × hệ số tập trung) — cam từ ngưỡng thận trọng, đỏ khi vượt ngưỡng tối đa;
 *   A22  tỉ lệ Must trên effort so với trần (trường MoSCoW).
 * Chỉ để BÁO — bắt đầu sprint không bị chặn (cổng thật nằm ở lúc kéo thẻ, xem issueChange.ts).
 */

import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, CheckCircle2, Gauge, ListChecks, Scale } from 'lucide-react';
import { dm5Api, dm5Keys, ragColor } from '@/lib/work-dm5a-api';
import { Spinner } from './ui';
import { wt } from '@/components/work/i18n';

export default function SprintGuards({ pid, sprintId, open }: { pid: number; sprintId: number; open: boolean }) {
  const q = useQuery({ queryKey: dm5Keys.guards(pid, sprintId), queryFn: () => dm5Api.sprintGuards(pid, sprintId), enabled: open, staleTime: 15_000 });
  if (q.isLoading) return <div className="flex items-center gap-2 py-2 text-[12px] text-[var(--w-text-3)]"><Spinner size={12} /> {wt('sprint.gChecking')}</div>;
  if (!q.data) return null;
  const g = q.data;
  const c = g.capacity;
  const rows: Array<{ key: string; icon: typeof Gauge; tone: string; text: string; detail?: string }> = [];
  if (g.readyRule) {
    rows.push({
      key: 'ready', icon: ListChecks, tone: g.notReady.length ? 'var(--w-orange)' : 'var(--w-green)',
      text: g.notReady.length ? wt('sprint.gNotReady', { count: g.notReady.length }) : wt('sprint.gAllReady'),
      detail: g.notReady.slice(0, 5).map((x) => `${x.key} — ${x.missing.join(', ')}`).join(' · ') || undefined,
    });
  }
  if (c.pct !== null) {
    rows.push({
      key: 'cap', icon: Gauge, tone: ragColor(c.level),
      text: wt('sprint.gCapacity', { est: c.estimateHours, cap: c.focusedHours ?? 0, pct: c.pct, focus: c.focusFactor, raw: c.capacityHours ?? 0 }),
      detail: [c.over ? wt('sprint.gOver', { warn: c.warnPct }) : '', c.unestimated ? wt('sprint.gUnestimated', { count: c.unestimated }) : ''].filter(Boolean).join(' · ') || undefined,
    });
  } else if (c.estimateHours > 0) {
    rows.push({ key: 'cap', icon: Gauge, tone: 'var(--w-text-3)', text: wt('sprint.gNoCapacity', { est: c.estimateHours }) });
  }
  if (g.moscow.enabled && g.moscow.mustPct != null) {
    rows.push({
      key: 'moscow', icon: Scale, tone: g.moscow.over ? 'var(--w-red)' : 'var(--w-green)',
      text: wt('sprint.gMust', { pct: g.moscow.mustPct, cap: g.moscow.cap ?? '—' }),
      detail: g.moscow.over ? wt('sprint.gMustOver') : undefined,
    });
  }
  if (!rows.length) return null;
  return (
    <ul className="mb-4 space-y-1.5 rounded-[8px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-3 py-2.5" aria-label={wt('sprint.gTitle')}>
      {rows.map((r) => {
        const Icon = r.tone === 'var(--w-green)' ? CheckCircle2 : r.tone === 'var(--w-red)' || r.tone === 'var(--w-orange)' ? AlertTriangle : r.icon;
        return (
          <li key={r.key} className="flex items-start gap-2 text-[12.5px] leading-relaxed">
            <Icon size={13} className="mt-0.5 shrink-0" style={{ color: r.tone }} aria-hidden="true" />
            <span className="min-w-0 break-words">
              <span style={{ color: r.tone === 'var(--w-green)' || r.tone === 'var(--w-text-3)' ? undefined : r.tone }}>{r.text}</span>
              {r.detail && <span className="block text-[11.5px] text-[var(--w-text-3)]">{r.detail}</span>}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
