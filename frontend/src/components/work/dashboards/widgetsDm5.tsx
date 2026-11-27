'use client';

/**
 * dm5 G1 — widget dashboard + dòng cảnh báo sớm:
 *   rag             (A19) RAG dự án 4 chiều (tiến độ · phạm vi · chất lượng · công sức), tổng = chiều tệ nhất,
 *                   + % hoàn thành có trọng số bậc trạng thái (0/20/50/75/100). Ngưỡng: Cài đặt › Chi tiết › Ngưỡng RAG.
 *   EarlyWarnings   (A18) Blocked > 24h · P1–P2 đứng yên > 48h · burndown phẳng ≥ 3 ngày · thêm phạm vi sau Start —
 *                   gắn vào widget Sức khoẻ; mỗi dòng mở danh sách bằng JQL.
 */

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle } from 'lucide-react';
import { workError, type ProjectConfig } from '@/lib/work-api';
import { dm5Api, dm5Keys, ragColor, type RagLevel } from '@/lib/work-dm5a-api';
import { Spinner } from '../ui';
import { jqlListUrl } from '../search/jql';
import { wt, type WKey } from '../i18n';

const levelText = (l: RagLevel) => wt(`dash.rag_${l}` as WKey);

export function RagWidget({ pid }: { pid: number }) {
  const q = useQuery({ queryKey: dm5Keys.rag(pid), queryFn: () => dm5Api.rag(pid), staleTime: 60_000 });
  if (q.isLoading) return <div className="flex h-24 items-center justify-center"><Spinner /></div>;
  if (q.error || !q.data) return <p className="py-6 text-center text-[12.5px] text-[var(--w-red-text)]">{workError(q.error)}</p>;
  const r = q.data;
  const fmt = (k: string, v: number | null) => (v == null ? '—' : k === 'quality' ? String(v) : `${v}%`);
  return (
    <div className="min-w-0 space-y-3" data-testid="widget-rag">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 min-w-[72px] items-center justify-center rounded-[8px] px-3 text-[13px] font-semibold text-white" style={{ background: ragColor(r.overall) }}>
          {levelText(r.overall)}
        </span>
        <div className="min-w-0">
          <div className="text-[12px] text-[var(--w-text-3)]">{wt('dash.ragCompletion')}</div>
          <div className="text-[18px] font-semibold tabular">{r.completionPct == null ? '—' : `${r.completionPct}%`}</div>
        </div>
      </div>
      <ul className="grid grid-cols-2 gap-2">
        {r.dimensions.map((d) => (
          <li key={d.key} className="min-w-0 rounded-[8px] border border-[var(--w-border)] px-2.5 py-2" title={wt(`settings.ragHint_${d.key}` as WKey)}>
            <div className="flex items-center gap-1.5 text-[12px]">
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: ragColor(d.level) }} aria-hidden="true" />
              <span className="truncate font-medium">{wt(`settings.rag_${d.key}` as WKey)}</span>
              <span className="ml-auto text-[11px]" style={{ color: ragColor(d.level) }}>{levelText(d.level)}</span>
            </div>
            <div className="mt-0.5 text-[13px] font-semibold tabular">{fmt(d.key, d.value)}</div>
            <div className="truncate text-[11px] text-[var(--w-text-3)]">{wt('dash.ragThresholds', { a: r.rules[d.key].amber, r: r.rules[d.key].red })}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Dòng cảnh báo sớm (A18) — dùng trong widget Sức khoẻ. Không có cảnh báo ⇒ không vẽ gì. */
export function EarlyWarnings({ pid, config }: { pid: number; config?: ProjectConfig }) {
  const q = useQuery({ queryKey: dm5Keys.warnings(pid), queryFn: () => dm5Api.earlyWarnings(pid), staleTime: 60_000 });
  const w = q.data?.warnings ?? [];
  if (!w.length) return null;
  return (
    <ul className="space-y-1 rounded-[8px] border border-[color-mix(in_srgb,var(--w-orange)_40%,transparent)] bg-[color-mix(in_srgb,var(--w-orange)_7%,transparent)] px-2.5 py-2" data-testid="early-warnings">
      {w.map((x) => {
        const text = wt(`dash.ew_${x.code}` as WKey, { count: x.count, n: x.days ?? 0, p: x.points ?? 0 });
        const href = config && x.jql ? jqlListUrl(config.workspace.slug, config.key, x.jql) : null;
        return (
          <li key={x.code} className="flex items-start gap-1.5 text-[12px] leading-relaxed">
            <AlertTriangle size={12} className="mt-0.5 shrink-0" style={{ color: ragColor(x.level) }} aria-hidden="true" />
            {href ? <Link href={href} className="min-w-0 hover:underline">{text}</Link> : <span className="min-w-0">{text}</span>}
          </li>
        );
      })}
    </ul>
  );
}
