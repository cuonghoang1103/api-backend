'use client';

/**
 * Danh mục dự án (portfolio) của một không gian — đợt S3a. CHỈ ĐỌC.
 *
 * Màu RAG do server tính bằng luật minh bạch (portfolioRules.ts) và luôn đi kèm
 * lý do — rê chuột (máy tính) hoặc chạm (điện thoại) vào chấm để đọc. Không AI.
 * Bố cục: dải số tổng → bộ lọc → bảng dự án (≥lg là bảng, hẹp hơn thành thẻ) →
 * dải mốc gộp các dự án → phụ thuộc chặn liên dự án.
 */

import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, CalendarClock, CircleHelp, Link2, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { userName, workError, type ProjectKind, type WorkspaceDetail } from '@/lib/work-api';
import { portfolioKeys, workPortfolioApi, type PortfolioProject, type Rag } from '@/lib/work-portfolio-api';
import { EmptyState, PageLoading, Popover, ProjectMark, UserAvatar, useToggle } from '../ui';
import { fmtDay } from '../reports/shared';
import { KIND_INFO, Pill } from '../studio/shared';
import { openIssuesDefinition } from '../openIssues';
import KpiTile, { KpiRow } from '../KpiTile';
import { wt } from '@/components/work/i18n';

export const RAG_META: Record<Rag, { label: string; color: string; tone: 'red' | 'orange' | 'green'; rank: number }> = {
  RED: { get label() { return wt('pf.offTrack'); }, color: 'var(--w-red)', tone: 'red', rank: 0 },
  AMBER: { get label() { return wt('pf.atRisk'); }, color: 'var(--w-yellow)', tone: 'orange', rank: 1 },
  GREEN: { get label() { return wt('pf.onTrack'); }, color: 'var(--w-green)', tone: 'green', rank: 2 },
};

const PACE_LABEL: Record<string, { label: string; tone: 'red' | 'orange' | 'green' | 'neutral' | 'blue' }> = {
  AT_RISK: { get label() { return wt('pf.atRisk'); }, tone: 'red' },
  ON_TRACK: { get label() { return wt('pf.onTrack'); }, tone: 'green' },
  DONE: { get label() { return wt('common.done'); }, tone: 'green' },
  TOO_EARLY: { get label() { return wt('pf.tooEarly'); }, tone: 'neutral' },
  NO_ESTIMATES: { get label() { return wt('pf.noEstimates'); }, tone: 'neutral' },
};

type SortKey = 'health' | 'name' | 'overdue' | 'milestone' | 'open';

/** Chấm RAG: rê/chạm/bàn phím mở lý do. */
function RagDot({ p, withLabel }: { p: PortfolioProject; withLabel?: boolean }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const meta = RAG_META[p.health.rag];
  return (
    <>
      <button
        ref={ref}
        type="button"
        data-rag={p.health.rag}
        aria-label={wt('pf.healthAria', { l: meta.label })}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        // Rê chuột mở; chạm (touch) thì đi đường onClick — không để mouseenter giả lập của cảm ứng bật rồi click tắt ngay.
        onPointerEnter={(e) => e.pointerType === 'mouse' && setOpen(true)}
        onPointerLeave={(e) => e.pointerType === 'mouse' && setOpen(false)}
        className="inline-flex min-h-[28px] items-center gap-2 rounded-[6px] px-1 text-[13px] text-[var(--w-text-2)] hover:bg-[var(--w-hover)]"
      >
        <span className="h-3 w-3 shrink-0 rounded-full ring-2 ring-[var(--w-panel)]" style={{ background: meta.color, boxShadow: `0 0 0 1px ${meta.color}` }} aria-hidden="true" />
        {withLabel && <span className="whitespace-nowrap font-medium text-[var(--w-text)]">{meta.label}</span>}
      </button>
      <Popover open={open} onClose={() => setOpen(false)} anchorRef={ref} width={300}>
        <div className="p-3" role="tooltip">
          <div className="mb-1.5 flex items-center gap-2 text-[12px] font-semibold">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: meta.color }} aria-hidden="true" />
            {meta.label} · {p.key}
          </div>
          <ul className="space-y-1.5">
            {p.health.reasons.map((r, i) => (
              <li key={i} className="flex gap-2 text-[12.5px] leading-snug text-[var(--w-text-2)]">
                <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: RAG_META[r.level].color }} aria-hidden="true" />
                <span>{r.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </Popover>
    </>
  );
}

function Bar({ pct, color = 'var(--w-accent)' }: { pct: number; color?: string }) {
  return (
    <div className="h-1.5 w-full min-w-[48px] overflow-hidden rounded-full bg-[var(--w-sunken)]" role="img" aria-label={`${pct}%`}>
      <div className="h-full rounded-full" style={{ width: `${Math.max(0, Math.min(100, pct))}%`, background: color }} />
    </div>
  );
}

const whenText = (days: number) => (days < 0 ? wt('pf.dLate', { n: -days }) : days === 0 ? wt('pf.todayLc') : wt('pf.inD', { n: days }));

/** Một dự án — bảng ở ≥lg, thẻ ở màn hẹp (cùng một DOM). */
function ProjectRow({ p }: { p: PortfolioProject }) {
  const ms = p.milestones.find((m) => m.daysUntil < 0) ?? p.nextMilestone;
  const unit = p.sprint?.unit === 'HOURS' ? 'h' : 'pts';
  return (
    <li className="pf-row grid grid-cols-2 gap-x-4 gap-y-3 border-b border-[var(--w-border)] px-4 py-3.5 last:border-b-0 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,0.8fr)_minmax(0,0.9fr)_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,0.7fr)] lg:items-center lg:py-2.5" data-key={p.key}>
      <div className="col-span-2 flex min-w-0 items-center gap-2.5 lg:col-span-1">
        <ProjectMark k={p.key} size={28} brand={p} />
        <div className="min-w-0 flex-1">
          <Link href={p.url} className="block truncate text-[14px] font-semibold hover:underline">{p.name}</Link>
          <div className="flex min-w-0 items-center gap-1.5 text-[12px] text-[var(--w-text-3)]">
            <span className="font-mono">{p.key}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{KIND_INFO[p.kind]?.short ?? p.kind}</span>
            {p.archivedAt && <><span aria-hidden="true">·</span><span>{wt('common.archived')}</span></>}
            {p.lead && <><span aria-hidden="true">·</span><span className="flex min-w-0 items-center gap-1" title={wt('pf.leadT', { n: userName(p.lead) })}><UserAvatar user={p.lead} size={14} /><span className="truncate">{userName(p.lead)}</span></span></>}
          </div>
        </div>
        <span className="lg:hidden"><RagDot p={p} withLabel /></span>
      </div>

      <div className="max-lg:hidden"><RagDot p={p} withLabel /></div>

      <Cell label={wt('common.issues')}>
        <span className="tabular-nums" title={openIssuesDefinition()}><b className="font-semibold text-[var(--w-text)]">{p.counts.open}</b> {wt('pf.openLc')}</span>
        <span className="text-[12px] text-[var(--w-text-3)]">
          <span className={cn('whitespace-nowrap tabular-nums', p.counts.overdue > 0 && 'font-semibold text-[var(--w-red)]')}>{wt('pf.nOverdue', { n: p.counts.overdue })}</span> · <span className="whitespace-nowrap tabular-nums" title={wt('pf.done14Title')}>{wt('pf.done14', { n: p.counts.done14 })}</span>
        </span>
      </Cell>

      <Cell label={wt('common.sprint')}>
        {p.sprint ? (
          <>
            <span className="flex min-w-0 items-center gap-1.5">
              <span className="truncate">{p.sprint.name}</span>
              <Pill tone={PACE_LABEL[p.sprint.status].tone} className="!h-[18px] !px-1.5 !text-[11px]" title={p.sprint.summary}>{PACE_LABEL[p.sprint.status].label}</Pill>
            </span>
            <span className="text-[12px] text-[var(--w-text-3)] tabular-nums">{wt('pf.leftD', { n: p.sprint.remaining, u: unit, d: p.sprint.daysLeft })}</span>
          </>
        ) : <span className="text-[var(--w-text-3)]">{wt('pf.noActiveSprint')}</span>}
      </Cell>

      <Cell label={wt('pf.stage')}>
        {p.stage ? (
          <>
            <span className="truncate">{p.stage.current ? `${p.stage.current.n}. ${p.stage.current.name}` : '—'}</span>
            <span className="flex items-center gap-2 text-[12px] text-[var(--w-text-3)]"><Bar pct={p.stage.percent} /> <span className="shrink-0 tabular-nums">{p.stage.done}/{p.stage.total}</span></span>
          </>
        ) : <span className="text-[var(--w-text-3)]">—</span>}
      </Cell>

      <Cell label={wt('pf.nextMs')}>
        {ms ? (
          <>
            <span className="truncate">{ms.name}</span>
            <span className={cn('text-[12px] tabular-nums', ms.daysUntil < 0 ? 'font-semibold text-[var(--w-red)]' : 'text-[var(--w-text-3)]')}>{fmtDay(ms.date)} · {whenText(ms.daysUntil)}</span>
          </>
        ) : <span className="text-[var(--w-text-3)]">—</span>}
      </Cell>

      <Cell label={wt('pf.waiting')}>
        <span className="text-[12px] tabular-nums text-[var(--w-text-2)]">
          {p.approvals.pending ? <>{wt('pf.nApprovals', { count: p.approvals.pending })}</> : <span className="text-[var(--w-text-3)]">{wt('pf.nApprovals', { count: 0 })}</span>}
        </span>
        <span className={cn('text-[12px] tabular-nums', p.dependencies.blockedBy ? 'font-semibold text-[var(--w-orange)]' : 'text-[var(--w-text-3)]')}>{wt('pf.nBlocked', { n: p.dependencies.blockedBy })}</span>
      </Cell>

    </li>
  );
}

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5 text-[13px]">
      <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-[var(--w-text-3)] lg:hidden">{label}</span>
      {children}
    </div>
  );
}

export default function PortfolioView({ ws }: { ws: WorkspaceDetail }) {
  const archived = useToggle(false);
  const q = useQuery({
    queryKey: portfolioKeys.portfolio(ws.id, archived.on),
    queryFn: () => workPortfolioApi.portfolio(ws.id, archived.on),
    staleTime: 30_000,
  });
  const [rag, setRag] = useState<Rag | 'ALL'>('ALL');
  const [kind, setKind] = useState<ProjectKind | 'ALL'>('ALL');
  const [lead, setLead] = useState<number | 'ALL'>('ALL');
  const [sort, setSort] = useState<SortKey>('health');
  const rulesBtn = useRef<HTMLButtonElement>(null);
  const rules = useToggle(false);

  const data = q.data;
  const leads = useMemo(() => {
    const m = new Map<number, NonNullable<PortfolioProject['lead']>>();
    for (const p of data?.projects ?? []) if (p.lead) m.set(p.lead.id, p.lead);
    return [...m.values()].sort((a, b) => userName(a).localeCompare(userName(b)));
  }, [data]);
  const kinds = useMemo(() => [...new Set((data?.projects ?? []).map((p) => p.kind))], [data]);
  const counts = useMemo(() => {
    const c = { RED: 0, AMBER: 0, GREEN: 0 } as Record<Rag, number>;
    for (const p of data?.projects ?? []) c[p.health.rag] += 1;
    return c;
  }, [data]);
  const rows = useMemo(() => {
    const list = (data?.projects ?? []).filter((p) => (rag === 'ALL' || p.health.rag === rag) && (kind === 'ALL' || p.kind === kind) && (lead === 'ALL' || p.lead?.id === lead));
    const msDays = (p: PortfolioProject) => (p.milestones.find((m) => m.daysUntil < 0) ?? p.nextMilestone)?.daysUntil ?? Number.POSITIVE_INFINITY;
    return [...list].sort((a, b) => {
      switch (sort) {
        case 'name': return a.name.localeCompare(b.name);
        case 'overdue': return b.counts.overdue - a.counts.overdue || a.name.localeCompare(b.name);
        case 'open': return b.counts.open - a.counts.open || a.name.localeCompare(b.name);
        case 'milestone': return msDays(a) - msDays(b) || a.name.localeCompare(b.name);
        default: return RAG_META[a.health.rag].rank - RAG_META[b.health.rag].rank || b.counts.overdue - a.counts.overdue || a.name.localeCompare(b.name);
      }
    });
  }, [data, rag, kind, lead, sort]);

  if (q.isLoading) return <PageLoading rows={6} />;
  if (q.error || !data) return <EmptyState title={wt('pf.loadFailed')} body={workError(q.error)} />;
  if (!data.projects.length) {
    return <EmptyState title={wt('pf.noProjects')} body={wt('pf.noProjectsBody')} />;
  }

  return (
    <div className="w-page">
      {/* Số tổng theo màu — bấm để lọc. */}
      <KpiRow min={150} className="mb-4" label={wt('pf.filterHealth')}>
        {(['ALL', 'RED', 'AMBER', 'GREEN'] as const).map((k) => {
          const on = rag === k;
          const n = k === 'ALL' ? data.projects.length : counts[k];
          return (
            <KpiTile
              key={k}
              size="sm"
              label={k === 'ALL' ? wt('pf.allProjects') : RAG_META[k].label}
              value={n}
              dot={k === 'ALL' ? undefined : RAG_META[k].color}
              pressed={on}
              onClick={() => setRag(on && k !== 'ALL' ? 'ALL' : k)}
            />
          );
        })}
      </KpiRow>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <select aria-label={wt('pf.projectType')} className="w-input h-8 w-auto max-w-full py-0 pr-7 text-[13px]" value={kind} onChange={(e) => setKind(e.target.value as ProjectKind | 'ALL')}>
          <option value="ALL">{wt('res.allTypes')}</option>
          {kinds.map((k) => <option key={k} value={k}>{KIND_INFO[k]?.short ?? k}</option>)}
        </select>
        <select aria-label={wt('studio.lead')} className="w-input h-8 w-auto max-w-full py-0 pr-7 text-[13px]" value={lead} onChange={(e) => setLead(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}>
          <option value="ALL">{wt('pf.anyLead')}</option>
          {leads.map((u) => <option key={u.id} value={u.id}>{userName(u)}</option>)}
        </select>
        <select aria-label={wt('pf.sort')} className="w-input h-8 w-auto max-w-full py-0 pr-7 text-[13px]" value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
          <option value="health">{wt('pf.sHealth')}</option>
          <option value="milestone">{wt('pf.sMs')}</option>
          <option value="overdue">{wt('pf.sOverdue')}</option>
          <option value="open">{wt('pf.sOpen')}</option>
          <option value="name">{wt('pf.sName')}</option>
        </select>
        <label className="flex h-8 items-center gap-1.5 px-1 text-[13px] text-[var(--w-text-2)]">
          <input type="checkbox" checked={archived.on} onChange={archived.toggle} /> {wt('common.archived')}
        </label>
        <span className="flex-1" />
        <button ref={rulesBtn} type="button" className="w-btn w-btn-sm" onClick={rules.toggle} aria-expanded={rules.on}>
          <CircleHelp size={13} /> {wt('pf.howHealth')}
        </button>
        <Popover open={rules.on} onClose={rules.close} anchorRef={rulesBtn} width={340} align="end">
          <div className="space-y-2 p-3 text-[12.5px] leading-snug">
            <p className="text-[var(--w-text-2)]">{wt('pf.fixedRules')}</p>
            {(['RED', 'AMBER'] as const).map((lv) => (
              <div key={lv}>
                <div className="mb-1 flex items-center gap-1.5 font-semibold"><span className="h-2 w-2 rounded-full" style={{ background: RAG_META[lv].color }} />{wt('pf.whenDots', { l: RAG_META[lv].label })}</div>
                <ul className="ml-3.5 list-disc space-y-0.5 text-[var(--w-text-2)]">
                  {data.rules.filter((r) => r.level === lv).map((r, i) => <li key={i}>{r.text}</li>)}
                </ul>
              </div>
            ))}
            <p className="text-[var(--w-text-2)]"><b className="font-semibold text-[var(--w-text)]">{wt('pf.onTrack')}</b> {wt('pf.onTrackWhen')}</p>
          </div>
        </Popover>
      </div>

      <section aria-label={wt('common.projects')} className="overflow-hidden rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)]">
        <div className="hidden border-b border-[var(--w-border)] bg-[var(--w-sunken)] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.04em] text-[var(--w-text-3)] lg:grid lg:grid-cols-[minmax(0,1.7fr)_minmax(0,0.8fr)_minmax(0,0.9fr)_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,0.7fr)] lg:gap-x-4">
          <span>{wt('common.project')}</span><span>{wt('pf.health')}</span><span>{wt('common.issues')}</span><span>{wt('common.sprint')}</span><span>{wt('pf.stage')}</span><span>{wt('pf.nextMs')}</span><span>{wt('pf.waiting')}</span>
        </div>
        {rows.length ? <ul>{rows.map((p) => <ProjectRow key={p.id} p={p} />)}</ul> : (
          <p className="px-4 py-8 text-center text-[13px] text-[var(--w-text-3)]">{wt('pf.noMatch')}</p>
        )}
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section aria-labelledby="pf-ms" className="min-w-0">
          <h2 id="pf-ms" className="mb-2 flex items-center gap-2 text-[14px] font-semibold"><CalendarClock size={15} className="text-[var(--w-text-3)]" /> {wt('pf.upcomingMs')}</h2>
          {data.milestones.length ? (
            <ol className="relative space-y-0 overflow-hidden rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)]">
              {data.milestones.map((m) => (
                <li key={`${m.projectId}-${m.id}`} className="flex min-w-0 items-center gap-3 border-b border-[var(--w-border)] px-3.5 py-2.5 last:border-b-0">
                  <div className={cn('w-[64px] shrink-0 text-[12px] font-semibold tabular-nums', m.daysUntil < 0 ? 'text-[var(--w-red)]' : 'text-[var(--w-text-2)]')}>
                    {fmtDay(m.date)}
                    <div className="text-[11px] font-normal">{whenText(m.daysUntil)}</div>
                  </div>
                  <ProjectMark k={m.projectKey} size={20} />
                  <div className="min-w-0 flex-1">
                    <Link href={m.url} className="block truncate text-[13px] font-medium hover:underline">{m.name}</Link>
                    <div className="truncate text-[12px] text-[var(--w-text-3)]">{m.projectName} · {m.done}/{m.total} done</div>
                  </div>
                  <div className="w-16 shrink-0"><Bar pct={m.total ? Math.round((m.done / m.total) * 100) : 0} color={m.daysUntil < 0 ? 'var(--w-red)' : 'var(--w-green)'} /></div>
                </li>
              ))}
            </ol>
          ) : <p className="rounded-[10px] border border-dashed border-[var(--w-border-strong)] px-4 py-5 text-[13px] text-[var(--w-text-3)]">{wt('pf.noMs')}</p>}
        </section>

        <section aria-labelledby="pf-dep" className="min-w-0">
          <h2 id="pf-dep" className="mb-2 flex items-center gap-2 text-[14px] font-semibold"><Link2 size={15} className="text-[var(--w-text-3)]" /> {wt('pf.blockedAcross')}</h2>
          {data.blockers.length ? (
            <ul className="overflow-hidden rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)]">
              {data.blockers.map((b) => (
                <li key={b.id} className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 border-b border-[var(--w-border)] px-3.5 py-2.5 text-[13px] last:border-b-0">
                  <DepChip side={b.blocker} slug={ws.slug} />
                  <span className="flex items-center gap-1 text-[12px] text-[var(--w-text-3)]">blocks <ArrowRight size={12} /></span>
                  <DepChip side={b.blocked} slug={ws.slug} />
                </li>
              ))}
            </ul>
          ) : <p className="rounded-[10px] border border-dashed border-[var(--w-border-strong)] px-4 py-5 text-[13px] text-[var(--w-text-3)]">{wt('pf.nothingBlocked')}</p>}
        </section>
      </div>
    </div>
  );
}

function DepChip({ side, slug }: { side: import('@/lib/work-portfolio-api').DepSide; slug: string }) {
  if (side.hidden) {
    return (
      <span className="inline-flex min-w-0 items-center gap-1.5 text-[var(--w-text-3)]" title={wt('pf.issueNoAccess')}>
        <Lock size={12} /> <span className="italic">{wt('pf.issueOther')}</span>
      </span>
    );
  }
  return (
    <Link href={`/work/${slug}/${side.projectKey}/issue/${side.number}`} className="inline-flex min-w-0 max-w-full items-center gap-1.5 hover:underline">
      <span className="shrink-0 font-mono text-[12px] text-[var(--w-text-2)]">{side.key}</span>
      <span className="min-w-0 truncate">{side.title}</span>
    </Link>
  );
}
