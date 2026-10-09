'use client';

/**
 * Đợt S4 — MỘT cách vẽ báo cáo (tuần cho khách / steering nội bộ / cổng khách / bản in). Dữ liệu dựng
 * xác định ở backend (clientReports.service buildReportData) — ở đây chỉ trình bày, không tính gì thêm.
 *
 * `paper` = bản in: giấy trắng chữ đen kể cả theme tối (đè biến màu ngay trên khung), bọc trong `.w-cert`
 * ⇒ work.css @media print chỉ in khối này (cùng cơ chế với biên bản UAT — không thêm thư viện PDF).
 */

import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { fmtMoney, type ReportData } from '@/lib/work-s4-api';
import { wfmt, wt } from '@/components/work/i18n';

const PAPER_VARS = {
  '--w-text': '#111111', '--w-text-2': '#333333', '--w-text-3': '#555555', '--w-border': '#d6d9e0', '--w-border-strong': '#c2c7d0',
  '--w-sunken': '#f3f4f6', '--w-panel': '#ffffff', '--w-accent': '#3f4bbf', '--w-accent-text': '#3f4bbf',
} as CSSProperties;

const STAGE_LABEL: Record<string, string> = {
  get NOT_STARTED() { return wt('rep.rdNotStarted'); },
  get ACTIVE() { return wt('rep.rdInProgress'); },
  get GATE_REVIEW() { return wt('rep.rdGateReview'); },
  get DONE() { return wt('common.done'); },
};
const LEVEL_TONE: Record<string, string> = { HIGH: 'var(--w-red)', MEDIUM: 'var(--w-orange)', LOW: 'var(--w-green)' };

function H({ children }: { children: ReactNode }) {
  return <h3 className="mb-2 mt-5 text-[13px] font-semibold uppercase tracking-[0.04em] text-[var(--w-text-3)]">{children}</h3>;
}

function Items({ items, empty }: { items: Array<{ key: string; title: string }>; empty: string }) {
  if (!items.length) return <p className="text-[13px] text-[var(--w-text-3)]">{empty}</p>;
  return (
    <ul className="space-y-1">
      {items.map((i) => (
        <li key={`${i.key}-${i.title}`} className="flex min-w-0 gap-2 text-[13px]">
          <span className="shrink-0 font-mono text-[12px] text-[var(--w-text-3)]">{i.key}</span>
          <span className="min-w-0 [overflow-wrap:anywhere]">{i.title}</span>
        </li>
      ))}
    </ul>
  );
}

function Stat({ label, value, sub }: { label: string; value: ReactNode; sub?: ReactNode }) {
  return (
    <div className="min-w-0 rounded-[8px] border border-[var(--w-border)] px-3 py-2.5">
      <div className="text-[11.5px] font-medium text-[var(--w-text-3)]">{label}</div>
      <div className="mt-0.5 truncate text-[18px] font-semibold tabular-nums tracking-[-0.01em]">{value}</div>
      {sub && <div className="mt-0.5 truncate text-[11.5px] text-[var(--w-text-3)]">{sub}</div>}
    </div>
  );
}

export default function ReportDocument({ data, paper, polished, title }: { data: ReportData; paper?: boolean; polished?: string | null; title?: string }) {
  const internal = data.internal;
  const heading = title ?? (data.audience === 'client' ? wt('rep.rdWeekly') : wt('rep.rdSteering'));
  return (
    <article
      className={cn('w-full min-w-0 text-[var(--w-text)]', paper ? 'w-cert rounded-[10px] border border-[#d6d9e0] bg-white p-6 md:p-9' : '')}
      style={paper ? PAPER_VARS : undefined}
      data-testid={paper ? 'report-paper' : 'report-document'}
    >
      <header className="mb-4 border-b border-[var(--w-border)] pb-3">
        <div className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-[var(--w-text-3)]">{data.project.name} · {data.project.key}</div>
        <h2 className="mt-1 text-[20px] font-semibold tracking-[-0.015em]">{heading}</h2>
        <div className="mt-0.5 text-[12.5px] text-[var(--w-text-3)]">{wt('rep.rdPeriod', { a: data.period.from, b: data.period.to, d: new Date(data.generatedAt).toLocaleString(wfmt.intl(), { dateStyle: 'medium', timeStyle: 'short' }) })}</div>
      </header>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label={wt('rep.completed')} value={data.counts.completed} sub={wt('rep.rdThisPeriod')} />
        <Stat label={wt('rep.rdInProgress')} value={data.counts.inProgress} sub={wt('rep.rdOpenTotal', { n: data.counts.open })} />
        <Stat label={wt('rep.rdOverall')} value={data.overallPercent === null ? '—' : `${data.overallPercent}%`} sub={data.stages ? wt('rep.rdStagesDone', { a: data.stages.filter((s) => s.status === 'DONE').length, b: data.stages.length }) : wt('rep.rdNoStages')} />
        <Stat label={data.audience === 'client' ? wt('rep.rdWaitingYou') : wt('rep.rdWaitingClient')} value={data.waitingOnClient.length} sub={wt('rep.rdApprUat')} />
      </div>

      {polished && (
        <>
          <H>{wt('rep.rdSummaryTeam')}</H>
          <div className="whitespace-pre-wrap rounded-[8px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-3 py-2.5 text-[13px] leading-relaxed [overflow-wrap:anywhere]">{polished}</div>
        </>
      )}

      {data.stages && data.stages.length > 0 && (
        <>
          <H>{wt('rep.rdStages')}</H>
          <ol className="space-y-1.5">
            {data.stages.map((s) => (
              <li key={s.n} className="grid grid-cols-[minmax(0,1fr)_88px_44px] items-center gap-2 text-[13px] sm:grid-cols-[minmax(0,1fr)_140px_120px_44px]">
                <span className="min-w-0 truncate"><span className="tabular-nums text-[var(--w-text-3)]">{s.n}.</span> {s.name}</span>
                <span className="hidden text-[12px] text-[var(--w-text-3)] sm:block">{STAGE_LABEL[s.status] ?? s.status}</span>
                <span className="h-1.5 overflow-hidden rounded-full bg-[var(--w-sunken)]" aria-hidden="true">
                  <span className="block h-full rounded-full" style={{ width: `${s.percent}%`, background: s.status === 'DONE' ? 'var(--w-green)' : 'var(--w-accent)' }} />
                </span>
                <span className="text-right text-[12px] tabular-nums text-[var(--w-text-2)]">{s.percent}%</span>
              </li>
            ))}
          </ol>
        </>
      )}

      <div className="grid gap-x-8 md:grid-cols-2">
        <div><H>{wt('rep.completed')}</H><Items items={data.completed} empty={wt('rep.rdNothingCompleted')} /></div>
        <div><H>{wt('rep.rdInProgress')}</H><Items items={data.inProgress} empty={wt('rep.rdNothingProgress')} /></div>
      </div>

      {data.waitingOnClient.length > 0 && (
        <>
          <H>{data.audience === 'client' ? wt('rep.rdWaitingYou') : wt('rep.rdWaitingTheClient')}</H>
          <ul className="space-y-1 text-[13px]">
            {data.waitingOnClient.map((w, i) => <li key={i}>{w.kind === 'UAT' ? wt('rep.rdUatSignoff') : wt('rep.rdApproval')}: {w.title}{w.dueAt ? <span className="text-[var(--w-text-3)]">{wt('rep.rdDueSp', { d: w.dueAt.slice(0, 10) })}</span> : null}</li>)}
          </ul>
        </>
      )}

      {(data.upcoming.versions.length > 0 || (data.upcoming.payments?.length ?? 0) > 0) && (
        <>
          <H>{wt('rep.rdUpcoming')}</H>
          <ul className="space-y-1 text-[13px]">
            {data.upcoming.versions.map((v) => <li key={v.name}>{v.name}{v.releaseDate ? ` — ${v.releaseDate}` : ''} <span className="text-[var(--w-text-3)]">{wt('rep.rdDoneOf', { a: v.done, b: v.items })}</span></li>)}
            {data.upcoming.payments?.map((p) => <li key={`p${p.number}`}>{wt('rep.rdPayment', { n: p.name, m: fmtMoney(p.amount, data.currency), d: p.dueDate ? wt('rep.rdDueComma', { d: p.dueDate }) : '' })} <span className="text-[var(--w-text-3)]">({p.status.toLowerCase()})</span></li>)}
          </ul>
        </>
      )}

      {data.changes && data.changes.length > 0 && (
        <>
          <H>{wt('rep.rdApprovedChanges')}</H>
          <ul className="space-y-1 text-[13px]">
            {data.changes.map((c) => <li key={c.number}><span className="font-mono text-[12px] text-[var(--w-text-3)]">CR-{c.number}</span> {c.title}{c.scheduleDays ? wt('rep.rdDays', { s: c.scheduleDays > 0 ? '+' : '', count: c.scheduleDays }) : ''}{c.costAmount ? ` · ${fmtMoney(c.costAmount, c.costCurrency)}` : ''}</li>)}
          </ul>
        </>
      )}

      {data.risks && data.risks.length > 0 && (
        <>
          <H>{wt('rep.rdRisks')}</H>
          <ul className="space-y-1.5 text-[13px]">
            {data.risks.map((r) => (
              <li key={r.key} className="flex min-w-0 gap-2">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ background: LEVEL_TONE[r.level ?? ''] ?? 'var(--w-text-3)' }} aria-hidden="true" />
                <span className="min-w-0 [overflow-wrap:anywhere]">{r.title}{r.level ? <span className="text-[var(--w-text-3)]"> · {r.level.toLowerCase()}</span> : null}{r.mitigation ? <span className="text-[var(--w-text-2)]"> — {r.mitigation}</span> : null}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {internal?.finance && (
        <>
          <H>{wt('rep.rdFinance')}</H>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Stat label={wt('rep.rdBudget')} value={fmtMoney(internal.finance.bac, internal.finance.currency)} />
            <Stat label={wt('rep.rdActual')} value={fmtMoney(internal.finance.actual, internal.finance.currency)} sub={internal.finance.percentUsed !== null ? wt('rep.rdOfBudget', { n: internal.finance.percentUsed }) : undefined} />
            <Stat label={wt('rep.rdBurn')} value={fmtMoney(internal.finance.burnRatePerWeek, internal.finance.currency)} sub={wt('rep.rdLast28')} />
            <Stat label={wt('rep.rdForecast')} value={fmtMoney(internal.finance.eac, internal.finance.currency)} sub={internal.finance.eacMethod ?? wt('rep.rdNotEnough')} />
          </div>
          <p className="mt-2 text-[12.5px] text-[var(--w-text-2)]">
            {wt('rep.rdPayments', { a: fmtMoney(internal.finance.payments.due, internal.finance.currency), b: fmtMoney(internal.finance.payments.invoiced, internal.finance.currency), c: fmtMoney(internal.finance.payments.paid, internal.finance.currency) })}
            {internal.finance.pendingHours ? wt('rep.rdPendingH', { n: internal.finance.pendingHours }) : ''}
            {internal.finance.alerts.length ? wt('rep.rdAlerts', { s: internal.finance.alerts.join(', ') }) : ''}
          </p>
        </>
      )}

      {internal?.raid && (
        <>
          <H>RAID</H>
          <p className="mb-1.5 text-[12.5px] text-[var(--w-text-2)]">{wt('rep.rdOpen', { s: Object.entries(internal.raid.open).map(([k, v]) => `${k.toLowerCase()} ${v}`).join(' · ') })}</p>
          <ul className="space-y-1 text-[13px]">
            {internal.raid.top.map((r) => <li key={r.key}><span className="font-mono text-[12px] text-[var(--w-text-3)]">{r.key}</span> {r.title}{r.score ? <span className="text-[var(--w-text-3)]">{wt('rep.rdScore', { n: r.score })}</span> : null}{r.owner ? <span className="text-[var(--w-text-3)]"> · {r.owner}</span> : null}</li>)}
          </ul>
        </>
      )}

      {internal && internal.overdue.length > 0 && (
        <>
          <H>{wt('common.overdue')}</H>
          <ul className="space-y-1 text-[13px]">
            {internal.overdue.map((i) => <li key={i.key}><span className="font-mono text-[12px] text-[var(--w-text-3)]">{i.key}</span> {i.title}<span className="text-[var(--w-text-3)]">{i.dueDate ? wt('rep.rdDueSp', { d: i.dueDate }) : ''}{i.assignee ? ` · ${i.assignee}` : ''}</span></li>)}
          </ul>
        </>
      )}

      {internal && internal.workload.length > 0 && (
        <>
          <H>{wt('rep.workload')}</H>
          <ul className="grid gap-x-6 gap-y-1 text-[13px] sm:grid-cols-2">
            {internal.workload.map((w) => <li key={w.name} className="flex justify-between gap-2"><span className="truncate">{w.name}</span><span className="shrink-0 tabular-nums text-[var(--w-text-3)]">{wt('rep.rdOpenH', { n: w.open, h: w.remainingHours })}</span></li>)}
          </ul>
          <p className="mt-1 text-[11.5px] text-[var(--w-text-3)]">{wt('rep.rdPendingAppr', { count: internal.pendingApprovals })}</p>
        </>
      )}

      <H>{wt('rep.rdNextSteps')}</H>
      <Items items={data.nextSteps} empty={wt('rep.rdToBeAgreed')} />
    </article>
  );
}
