'use client';

/**
 * CTW đợt 7c (C3) — widget dashboard mới:
 *   test_pass_rate      tỉ lệ đạt theo test cycle gần nhất (đường) + số test flaky
 *   defects_by_severity bug còn mở theo mức nghiêm trọng (cột ngang)
 *   license_expiring    giấy phép / tài sản sắp hoặc đã hết hạn (sổ tài sản)
 *   my_timer            đồng hồ đang chạy của tôi (API đợt 7a /me/timer) + giờ tôi đã ghi hôm nay / tuần này
 *   okr                 objective của dự án ở chu kỳ hiện tại (API OKR đợt 7a /projects/:pid/okrs)
 * Mỗi widget tự tải + tự báo lỗi (một widget hỏng không kéo dashboard chết theo).
 */

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { ProjectConfig } from '@/lib/work-api';
import { workError } from '@/lib/work-api';
import { c7cKeys, widget7cApi } from '@/lib/work-c7c-api';
import { agileApi, agileKeys } from '@/lib/work-agile-api';
import KpiTile from '../KpiTile';
import { Spinner } from '../ui';
import { axisTick } from '../reports/shared';
import { useWT, type WKey } from '../i18n';

function Loading() {
  return <div className="flex h-24 items-center justify-center"><Spinner /></div>;
}
function Fail({ err }: { err: unknown }) {
  return <p className="py-6 text-center text-[12.5px] text-[var(--w-red-text)]">{workError(err)}</p>;
}
function Empty({ children }: { children: React.ReactNode }) {
  return <p className="py-6 text-center text-[12.5px] text-[var(--w-text-3)]">{children}</p>;
}

export function PassRateWidget({ pid, config }: { pid: number; config: ProjectConfig }) {
  const { t } = useWT();
  const q = useQuery({ queryKey: c7cKeys.widget(pid, 'pass-rate'), queryFn: () => widget7cApi.passRate(pid), staleTime: 30_000 });
  if (q.isLoading) return <Loading />;
  if (q.error || !q.data) return <Fail err={q.error} />;
  const pts = q.data.points.filter((p) => p.passRate !== null);
  if (!pts.length) return <Empty>{t('c7c.wNoCycles')}</Empty>;
  const last = q.data.last;
  return (
    <div data-testid="widget-test-pass-rate">
      <div className="mb-2 grid grid-cols-2 gap-2">
        <KpiTile size="sm" label={t('c7c.wLastCycle')} value={last?.passRate == null ? '—' : `${last.passRate}%`} hint={last?.name} tone={last?.passRate == null ? undefined : last.passRate >= 95 ? 'green' : last.passRate >= 80 ? 'yellow' : 'red'} />
        <Link href={`/work/${config.workspace.slug}/${config.key}/tests?tab=automation`} className="contents"><KpiTile size="sm" label={t('c7c.tFlaky')} value={q.data.flaky} tone={q.data.flaky ? 'orange' : undefined} /></Link>
      </div>
      <div className="h-[150px]" role="img" aria-label={t('c7c.wPassRateAria', { list: pts.map((p) => `${p.name} ${p.passRate}%`).join(', ') })}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={pts} margin={{ top: 6, right: 8, bottom: 0, left: -18 }}>
            <CartesianGrid stroke="var(--w-border)" vertical={false} />
            <XAxis dataKey="name" tick={axisTick} tickLine={false} axisLine={false} interval="preserveStartEnd" />
            <YAxis domain={[0, 100]} tick={axisTick} tickLine={false} axisLine={false} unit="%" />
            <Tooltip formatter={(v: number) => `${v}%`} />
            <Line type="monotone" dataKey="passRate" stroke="var(--w-green)" strokeWidth={2} dot={{ r: 2.5 }} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const SEV_COLOR: Record<string, string> = { CRITICAL: 'var(--w-red)', MAJOR: 'var(--w-orange)', MINOR: 'var(--w-yellow)', TRIVIAL: 'var(--w-blue)', UNSET: 'var(--w-border-strong)' };

export function SeverityWidget({ pid }: { pid: number }) {
  const { t } = useWT();
  const q = useQuery({ queryKey: c7cKeys.widget(pid, 'severity'), queryFn: () => widget7cApi.severity(pid), staleTime: 30_000 });
  if (q.isLoading) return <Loading />;
  if (q.error || !q.data) return <Fail err={q.error} />;
  if (!q.data.total) return <Empty>{t('c7c.wNoBugs')}</Empty>;
  const data = q.data.groups.map((g) => ({ ...g, label: t(`c7c.sev_${g.severity}` as WKey) }));
  return (
    <div className="h-[190px]" data-testid="widget-defects-by-severity" role="img" aria-label={t('c7c.wSevAria', { list: data.map((g) => `${g.label} ${g.count}`).join(', ') })}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, bottom: 0, left: 8 }}>
          <CartesianGrid stroke="var(--w-border)" horizontal={false} />
          <XAxis type="number" allowDecimals={false} tick={axisTick} tickLine={false} axisLine={false} />
          <YAxis type="category" dataKey="label" width={74} tick={axisTick} tickLine={false} axisLine={false} />
          <Tooltip />
          <Bar dataKey="count" isAnimationActive={false} radius={[0, 3, 3, 0]}>
            {data.map((g) => <Cell key={g.severity} fill={SEV_COLOR[g.severity]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function LicenseWidget({ pid, config }: { pid: number; config: ProjectConfig }) {
  const { t } = useWT();
  const q = useQuery({ queryKey: c7cKeys.widget(pid, 'licenses'), queryFn: () => widget7cApi.licenses(pid), staleTime: 60_000 });
  if (q.isLoading) return <Loading />;
  if (q.error || !q.data) return <Fail err={q.error} />;
  if (!q.data.items.length) return <Empty>{t('c7c.wNoExpiring')}</Empty>;
  const base = `/work/${config.workspace.slug}/${config.key}/assets`;
  return (
    <ul className="divide-y divide-[var(--w-border)]" data-testid="widget-license-expiring">
      {q.data.items.map((a) => (
        <li key={a.key}>
          <Link href={`${base}?asset=${a.number}`} className="flex min-w-0 items-center gap-2 py-2 text-[13px] hover:bg-[var(--w-hover)]">
            <span className="shrink-0 font-mono text-[12px] text-[var(--w-accent-text)]">{a.key}</span>
            <span className="min-w-0 flex-1 truncate">{a.name}</span>
            <span className={`shrink-0 text-[12px] ${a.daysLeft !== null && a.daysLeft < 0 ? 'text-[var(--w-red-text)]' : 'text-[var(--w-yellow-text)]'}`}>
              {a.daysLeft !== null && a.daysLeft < 0 ? t('c7c.aExpiredAgo', { count: -a.daysLeft }) : t('c7c.aDaysLeft', { count: a.daysLeft ?? 0 })}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

const hm = (min: number) => `${Math.floor(min / 60)}h ${String(min % 60).padStart(2, '0')}m`;

export function MyTimerWidget({ pid }: { pid: number }) {
  const { t } = useWT();
  const timer = useQuery({ queryKey: agileKeys.timer, queryFn: agileApi.myTimer, staleTime: 15_000 });
  const mine = useQuery({ queryKey: c7cKeys.widget(pid, 'my-time'), queryFn: () => widget7cApi.myTime(pid), staleTime: 60_000 });
  const [now, setNow] = useState(() => Date.now());
  const running = timer.data?.timer?.running;
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [running]);
  if (timer.isLoading || mine.isLoading) return <Loading />;
  const tm = timer.data?.timer ?? null;
  const elapsed = tm ? tm.elapsedSec + (tm.running && tm.runningSince ? Math.max(0, Math.floor((now - new Date(tm.serverNow).getTime()) / 1000)) : 0) : 0;
  const clock = `${String(Math.floor(elapsed / 3600)).padStart(2, '0')}:${String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0')}:${String(elapsed % 60).padStart(2, '0')}`;
  return (
    <div className="flex flex-col gap-2" data-testid="widget-my-timer">
      {tm ? (
        <Link href={tm.url} className="rounded-[8px] border border-[var(--w-border)] px-3 py-2 hover:bg-[var(--w-hover)]">
          <div className="text-[12px] text-[var(--w-text-3)]">{tm.running ? t('c7c.wTimerRunning') : t('c7c.wTimerPaused')}</div>
          <div className="font-mono text-[22px] font-semibold tabular-nums" aria-live="off">{clock}</div>
          <div className="truncate text-[12.5px]"><span className="font-mono text-[var(--w-accent-text)]">{tm.issueKey}</span> {tm.issueTitle}</div>
        </Link>
      ) : <p className="text-[12.5px] text-[var(--w-text-3)]">{t('c7c.wNoTimer')}</p>}
      {mine.data && (
        <div className="grid grid-cols-2 gap-2">
          <KpiTile size="sm" label={t('c7c.wToday')} value={hm(mine.data.todayMinutes)} />
          <KpiTile size="sm" label={t('c7c.wThisWeek')} value={hm(mine.data.weekMinutes)} />
        </div>
      )}
    </div>
  );
}

export function OkrWidget({ pid, config }: { pid: number; config: ProjectConfig }) {
  const { t } = useWT();
  const q = useQuery({ queryKey: agileKeys.okrProject(pid), queryFn: () => agileApi.projectOkrs(pid), staleTime: 60_000 });
  if (q.isLoading) return <Loading />;
  if (q.error || !q.data) return <Fail err={q.error} />;
  const v = q.data;
  if (!v.cycle) return <Empty>{t('c7c.wNoOkrCycle')}</Empty>;
  if (!v.objectives.length) return <Empty>{t('c7c.wNoObjectives', { c: v.cycle.name })}</Empty>;
  return (
    <div data-testid="widget-okr">
      <div className="mb-2 text-[12px] text-[var(--w-text-3)]">{t('c7c.wOkrCycle', { c: v.cycle.name, p: Math.round(v.dashboard.avgProgress) })}</div>
      <ul className="flex flex-col gap-2">
        {v.objectives.slice(0, 6).map((o) => (
          <li key={o.id} className="text-[13px]">
            <div className="flex items-center gap-2">
              <span className="min-w-0 flex-1 truncate">{o.title}</span>
              <span className="shrink-0 tabular-nums text-[12px] text-[var(--w-text-2)]">{Math.round(o.progress)}%</span>
            </div>
            <div className="mt-1 h-[6px] overflow-hidden rounded-full bg-[var(--w-sunken)]" role="progressbar" aria-valuenow={Math.round(o.progress)} aria-valuemin={0} aria-valuemax={100} aria-label={o.title}>
              <div className="h-full rounded-full" style={{ width: `${Math.min(100, Math.max(0, o.progress))}%`, background: o.status === 'OFF_TRACK' ? 'var(--w-red)' : o.status === 'AT_RISK' ? 'var(--w-orange)' : 'var(--w-green)' }} />
            </div>
          </li>
        ))}
      </ul>
      <Link className="mt-2 inline-block text-[12px] text-[var(--w-accent-text)] hover:underline" href={`/work/${config.workspace.slug}/${config.key}/okrs`}>{t('c7c.wOpenOkrs')}</Link>
    </div>
  );
}
