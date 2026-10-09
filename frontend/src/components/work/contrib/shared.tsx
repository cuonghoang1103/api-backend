'use client';

/**
 * CTW Đóng góp — mảnh dùng chung: khoảng thời gian trong URL, ▲▼%, sparkline, heatmap kiểu GitHub, tiêu đề chỉ số có
 * giải thích CÁCH TÍNH (định nghĩa lấy từ máy chủ — một nguồn với sheet "Definitions" của tệp xuất).
 * Màu thành viên: --w-chart-1…8 theo THỨ TỰ CỐ ĐỊNH của người (sắp theo id), không theo hạng ⇒ lọc/sắp không đổi màu ai.
 */

import { useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ArrowDownRight, ArrowUpRight, Info } from 'lucide-react';
import type { ContribRange, RangePreset } from '@/lib/work-contrib-api';
import { cn } from '@/lib/utils';

const PRESETS: RangePreset[] = ['today', '7d', '30d', 'week', 'sprint', 'stage', 'project', 'custom'];

export type ContribSub = 'team' | 'member' | 'task' | 'peer';

/** Trạng thái trang Đóng góp nằm hết trong URL (?cv=&cm=&ci=&rp=&rf=&rt=&rs=&rg=&rc=) — link chia sẻ được cho giảng viên. */
export function useContribUrl() {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const get = (k: string) => search?.get(k) ?? null;
  const rp = get('rp') as RangePreset | null;
  const range: ContribRange = useMemo(() => ({
    preset: rp && PRESETS.includes(rp) ? rp : '30d',
    from: get('rf') ?? undefined,
    to: get('rt') ?? undefined,
    sprintId: Number(get('rs')) || undefined,
    stageId: Number(get('rg')) || undefined,
    compare: get('rc') !== '0',
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [search]);
  const cv = get('cv');
  const sub: ContribSub = cv === 'member' || cv === 'task' || cv === 'peer' ? cv : 'team';
  const memberId = Number(get('cm')) || null;
  const issueNum = Number(get('ci')) || null;
  const roundId = Number(get('cr')) || null;
  const set = useCallback((patch: Record<string, string | number | null | undefined>) => {
    const p = new URLSearchParams(search?.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (v === null || v === undefined || v === '') p.delete(k);
      else p.set(k, String(v));
    }
    router.replace(`${pathname}?${p.toString()}`, { scroll: false });
  }, [router, pathname, search]);
  return { range, sub, memberId, issueNum, roundId, set };
}

/** ▲ 12% / ▼ 8% — `good` = chiều tăng là tốt (mặc định). Không màu đỏ/xanh cho chỉ số trung tính. */
export function Delta({ value, good = 'up', className, label }: { value: number | null | undefined; good?: 'up' | 'down' | 'none'; className?: string; label?: string }) {
  if (value === null || value === undefined) return null;
  if (value === 0) return <span className={cn('text-[11px] tabular-nums text-[var(--w-text-3)]', className)}>±0%</span>;
  const up = value > 0;
  const tone = good === 'none' ? 'text-[var(--w-text-2)]' : (up === (good === 'up')) ? 'text-[var(--w-green-text)]' : 'text-[var(--w-red-text)]';
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={cn('inline-flex items-center gap-0.5 text-[11px] font-medium tabular-nums', tone, className)} title={label ?? 'Change vs the previous period'}>
      <Icon size={11} aria-hidden="true" />
      <span className="sr-only">{up ? 'up' : 'down'} </span>{Math.abs(value)}%
    </span>
  );
}

/** Sparkline SVG nhỏ (không trục) — hành động theo ngày/tuần. Có nhãn cho trình đọc màn hình. */
export function Sparkline({ data, color = 'var(--w-chart-1)', width = 96, height = 24, label }: { data: number[]; color?: string; width?: number; height?: number; label: string }) {
  const max = Math.max(1, ...data);
  const n = data.length;
  if (n < 2) return <span className="text-[11px] text-[var(--w-text-3)]">—</span>;
  const pts = data.map((v, i) => `${((i / (n - 1)) * (width - 2) + 1).toFixed(1)},${(height - 2 - (v / max) * (height - 4)).toFixed(1)}`);
  const total = data.reduce((a, b) => a + b, 0);
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${label}: ${total} actions, peak ${max} per ${n > 35 ? 'week' : 'bucket'}`} className="block">
      <polyline points={`1,${height - 1} ${pts.join(' ')} ${width - 1},${height - 1}`} fill={color} fillOpacity={0.12} stroke="none" />
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

/** Màu cố định theo người (thứ tự id), 8 màu; người thứ 9+ dùng màu trung tính. */
export function colorMap(ids: number[]): Map<number, string> {
  const sorted = [...new Set(ids)].sort((a, b) => a - b);
  return new Map(sorted.map((id, i) => [id, i < 8 ? `var(--w-chart-${i + 1})` : 'var(--w-chart-8)']));
}

/**
 * Heatmap lịch kiểu GitHub: cột = tuần (T2 → CN), ô = ngày. Một sắc (accent), 5 bậc theo phân vị — tuần đều không bị
 * một ngày đột biến làm nhạt hết. Mỗi ô có title (ngày + số hành động); cả lưới có bảng ẩn cho trình đọc màn hình.
 */
export function Heatmap({ data, label }: { data: Array<[string, number]>; label: string }) {
  const { weeks, levels, total, active, months } = useMemo(() => {
    const vals = data.map(([, v]) => v).filter((v) => v > 0).sort((a, b) => a - b);
    const q = (p: number) => vals.length ? vals[Math.min(vals.length - 1, Math.floor(p * vals.length))] : 1;
    const cuts = [q(0.25), q(0.5), q(0.75)];
    const level = (v: number) => (v <= 0 ? 0 : v <= cuts[0] ? 1 : v <= cuts[1] ? 2 : v <= cuts[2] ? 3 : 4);
    const first = data[0]?.[0];
    const pad = first ? (new Date(`${first}T00:00:00Z`).getUTCDay() + 6) % 7 : 0;
    const cells: Array<[string, number] | null> = [...Array(pad).fill(null), ...data];
    const w: Array<Array<[string, number] | null>> = [];
    for (let i = 0; i < cells.length; i += 7) w.push(cells.slice(i, i + 7));
    const ms: Array<{ col: number; label: string }> = [];
    w.forEach((col, ci) => {
      const firstDay = col.find((c) => c && c[0].endsWith('-01')) ?? (ci === 0 ? col.find(Boolean) : null);
      if (firstDay) ms.push({ col: ci, label: new Date(`${firstDay[0]}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }) });
    });
    return { weeks: w, levels: level, total: data.reduce((a, [, v]) => a + v, 0), active: data.filter(([, v]) => v > 0).length, months: ms };
  }, [data]);
  const FILL = ['var(--w-sunken)', 'color-mix(in srgb, var(--w-accent) 28%, var(--w-panel))', 'color-mix(in srgb, var(--w-accent) 50%, var(--w-panel))', 'color-mix(in srgb, var(--w-accent) 74%, var(--w-panel))', 'var(--w-accent)'];
  return (
    <figure className="min-w-0" aria-label={label}>
      <div className="overflow-x-auto pb-1">
        <div className="inline-flex flex-col gap-1">
          <div className="relative h-3 text-[10px] text-[var(--w-text-3)]" aria-hidden="true">
            {months.map((m) => <span key={m.col} className="absolute" style={{ left: m.col * 13 }}>{m.label}</span>)}
          </div>
          <div className="flex gap-[3px]" aria-hidden="true">
            {weeks.map((col, ci) => (
              <div key={ci} className="flex flex-col gap-[3px]">
                {Array.from({ length: 7 }, (_, di) => {
                  const c = col[di];
                  return <span key={di} className="block h-[10px] w-[10px] rounded-[2px]" style={{ background: c ? FILL[levels(c[1])] : 'transparent', outline: c && c[1] === 0 ? '1px solid var(--w-border)' : undefined, outlineOffset: -1 }} title={c ? `${c[0]}: ${c[1]} action${c[1] === 1 ? '' : 's'}` : undefined} />;
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      <figcaption className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[var(--w-text-3)]">
        <span>{total} actions · {active} active days in {data.length} days</span>
        <span className="ml-auto inline-flex items-center gap-1" aria-hidden="true">Less {FILL.map((f, i) => <span key={i} className="inline-block h-[10px] w-[10px] rounded-[2px]" style={{ background: f, outline: i === 0 ? '1px solid var(--w-border)' : undefined, outlineOffset: -1 }} />)} More</span>
      </figcaption>
      <table className="sr-only">
        <caption>{label}</caption>
        <tbody>{data.filter(([, v]) => v > 0).map(([d, v]) => <tr key={d}><th scope="row">{d}</th><td>{v}</td></tr>)}</tbody>
      </table>
    </figure>
  );
}

/** Chữ nhỏ có biểu tượng ⓘ; di chuột / focus thấy cách tính (title + aria-describedby qua sr-only). */
export function MetricLabel({ label, how, className }: { label: string; how?: string; className?: string }) {
  if (!how) return <span className={className}>{label}</span>;
  return (
    <span className={cn('inline-flex items-center gap-1', className)} title={how}>
      {label}
      <Info size={11} aria-hidden="true" className="shrink-0 opacity-60" />
      <span className="sr-only">. {how}</span>
    </span>
  );
}

export const fmtN = (n: number | null | undefined, digits = 1) => (n === null || n === undefined ? '—' : String(Math.round(n * 10 ** digits) / 10 ** digits));
export const fmtPct = (n: number | null | undefined) => (n === null || n === undefined ? '—' : `${n}%`);
export const fmtDayShort = (d: string) => new Date(`${d.slice(0, 10)}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
export const fmtWhen = (iso: string) => new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

/** Nhãn trạng thái — quan sát trung tính, KHÔNG BAO GIỜ đánh giá người. */
export const STATUS_LABEL: Record<'attention' | 'watch' | 'ok' | 'idle', { text: string; cls: string }> = {
  attention: { text: 'Needs attention', cls: 'border-[var(--w-red-text)] text-[var(--w-red-text)]' },
  watch: { text: 'Worth a look', cls: 'border-[var(--w-yellow-text)] text-[var(--w-yellow-text)]' },
  ok: { text: 'On track', cls: 'border-[var(--w-border-strong)] text-[var(--w-text-2)]' },
  idle: { text: 'No work in range', cls: 'border-[var(--w-border)] text-[var(--w-text-3)]' },
};
