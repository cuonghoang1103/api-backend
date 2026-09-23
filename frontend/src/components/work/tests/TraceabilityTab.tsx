'use client';

/**
 * Tab "Traceability": yêu cầu ↔ test ↔ kết quả gần nhất ↔ bug còn mở.
 * Bấm một khoá thẻ ⇒ `?issue=N` (trang /tests mở IssueDrawer).
 */

import { useCallback, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Bug, Download, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workApi, workError, type Coverage, type IssueRef, type ProjectConfig } from '@/lib/work-api';
import { useLookups, wk } from '../hooks';
import { EmptyState, IssueTypeIcon, Spinner, StatusBadge } from '../ui';
import { downloadCsv, RUN_META, RunStatusPill, safeFileName } from './runStatus';

const COVERAGE_META: Record<Coverage, { label: string; color: string; help: string }> = {
  NOT_COVERED: { label: 'Not covered', color: 'var(--w-text-3)', help: 'No test is linked to this requirement' },
  NOT_RUN: { label: 'Not run', color: 'var(--w-text-2)', help: 'Linked tests have not been executed yet' },
  FAILING: { label: 'Failing', color: 'var(--w-red)', help: 'At least one linked test failed its latest run' },
  BLOCKED: { label: 'Blocked', color: 'var(--w-orange)', help: 'At least one linked test is blocked' },
  PASSING: { label: 'Passing', color: 'var(--w-green)', help: 'Every linked test passed (or was skipped) in its latest run' },
};
const COVERAGE_ORDER: Coverage[] = ['FAILING', 'BLOCKED', 'NOT_RUN', 'NOT_COVERED', 'PASSING'];

function CoverageBadge({ coverage }: { coverage: Coverage }) {
  const m = COVERAGE_META[coverage];
  const muted = coverage === 'NOT_COVERED' || coverage === 'NOT_RUN';
  return (
    <span
      title={m.help}
      className={cn('inline-flex h-[20px] shrink-0 items-center whitespace-nowrap rounded-[4px] border px-1.5 text-[11px] font-semibold uppercase tracking-[0.02em]', coverage === 'NOT_COVERED' && 'border-dashed')}
      style={muted
        ? { color: m.color, background: 'var(--w-sunken)', borderColor: 'var(--w-border-strong)' }
        : { color: m.color, background: `color-mix(in srgb, ${m.color} 13%, transparent)`, borderColor: `color-mix(in srgb, ${m.color} 40%, transparent)` }}
    >
      {m.label}
    </span>
  );
}

export default function TraceabilityTab({ config, pid }: { config: ProjectConfig; pid: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const lk = useLookups(config);
  const trace = useQuery({ queryKey: [...wk.tests(pid), 'traceability'], queryFn: () => workApi.traceability(pid) });
  const [filter, setFilter] = useState<Coverage | 'ALL'>('ALL');
  const [q, setQ] = useState('');

  const openIssue = useCallback((n: number) => {
    const p = new URLSearchParams(search?.toString());
    p.set('issue', String(n));
    router.push(`${pathname}?${p.toString()}`, { scroll: false });
  }, [router, pathname, search]);

  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    return (trace.data?.rows ?? []).map((r) => {
      const bugs = new Map<number, IssueRef>();
      r.tests.forEach((x) => x.openBugs.forEach((b) => bugs.set(b.number, b)));
      return { ...r, bugs: [...bugs.values()] };
    }).filter((r) => (filter === 'ALL' || r.coverage === filter)
      && (!t || `${lk.issueKey(r.number)} ${r.title} ${r.tests.map((x) => `${lk.issueKey(x.number)} ${x.title}`).join(' ')}`.toLowerCase().includes(t)));
  }, [trace.data, filter, q, lk]);

  const counts = useMemo(() => {
    const c = Object.fromEntries(COVERAGE_ORDER.map((k) => [k, 0])) as Record<Coverage, number>;
    trace.data?.rows.forEach((r) => { c[r.coverage] += 1; });
    return c;
  }, [trace.data]);

  const exportCsv = () => {
    if (!trace.data) return;
    downloadCsv(
      `${safeFileName(`${config.key}-traceability`)}.csv`,
      ['Requirement', 'Title', 'Coverage', 'Tests', 'Latest results', 'Open bugs'],
      rows.map((r) => [
        lk.issueKey(r.number), r.title, COVERAGE_META[r.coverage].label,
        r.tests.map((x) => lk.issueKey(x.number)).join(' '),
        r.tests.map((x) => `${lk.issueKey(x.number)}: ${x.lastStatus ? RUN_META[x.lastStatus].label : 'Never run'}`).join('; '),
        r.bugs.map((b) => lk.issueKey(b.number)).join(' '),
      ]),
    );
  };

  if (trace.isLoading) return <div className="flex h-full items-center justify-center py-16"><Spinner size={20} /></div>;
  if (trace.error || !trace.data) {
    return <EmptyState title="Could not load traceability" body={workError(trace.error)} action={<button type="button" className="w-btn" onClick={() => trace.refetch()}>Try again</button>} />;
  }
  const s = trace.data.summary;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 border-b border-[var(--w-border)] px-4 pb-3 pt-3">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Card label="Requirements" value={s.total} />
          <Card label="Covered" value={`${s.coveragePct}%`} sub={`${s.covered} of ${s.total} have tests`} pct={s.coveragePct} color="var(--w-accent)" />
          <Card label="Passing" value={`${s.passingPct}%`} sub={`${s.passing} of ${s.total} pass`} pct={s.passingPct} color="var(--w-green)" />
          <Card label="Failing" value={s.failing} sub={s.failing ? 'Need attention' : 'None failing'} color={s.failing ? 'var(--w-red)' : undefined} />
        </div>
        <p className="mt-2.5 text-[12px] leading-relaxed text-[var(--w-text-3)]">
          Requirements are Requirement and Story issues. A requirement is <b className="font-medium text-[var(--w-text-2)]">covered</b> when at least one test is linked to it with a “tests” link;
          its status comes from each linked test’s <b className="font-medium text-[var(--w-text-2)]">latest run</b> in any cycle — any failure makes it Failing, any block makes it Blocked, and it is Passing only when every test passed or was skipped.
        </p>
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <div className="relative mr-1">
            <Search size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--w-text-3)]" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search requirements or tests" className="w-input !h-[28px] w-[210px] pl-7 text-[12px]" />
          </div>
          {(['ALL', ...COVERAGE_ORDER] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setFilter(k)}
              title={k === 'ALL' ? undefined : COVERAGE_META[k].help}
              className={cn('inline-flex h-[26px] items-center gap-1.5 rounded-full border px-2.5 text-[12px]', filter === k ? 'border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]' : 'border-[var(--w-border-strong)] text-[var(--w-text-2)] hover:bg-[var(--w-hover)]')}
            >
              {k !== 'ALL' && <span className="h-1.5 w-1.5 rounded-full" style={{ background: COVERAGE_META[k].color }} />}
              {k === 'ALL' ? 'All' : COVERAGE_META[k].label}
              <span className="tabular text-[var(--w-text-3)]">{k === 'ALL' ? s.total : counts[k]}</span>
            </button>
          ))}
          <button type="button" className="w-btn w-btn-sm ml-auto" onClick={exportCsv} disabled={!rows.length}><Download size={13} /> Export CSV</button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        {!trace.data.rows.length ? (
          <EmptyState
            title="No requirements yet"
            body="Create Requirement or Story issues, then link tests to them (a test “tests” a requirement) to see coverage here."
          />
        ) : !rows.length ? (
          <EmptyState title="No matching requirements" body="Try a different search or coverage filter." />
        ) : (
          <div className="min-w-[820px]">
            <div className="sticky top-0 z-[1] grid grid-cols-[minmax(240px,1.6fr)_110px_minmax(280px,2fr)_minmax(150px,1fr)] gap-3 border-b border-[var(--w-border)] bg-[var(--w-panel)] px-4 py-2 text-[11px] font-medium uppercase tracking-wide text-[var(--w-text-3)]">
              <span>Requirement</span><span>Coverage</span><span>Tests · latest result</span><span>Open bugs</span>
            </div>
            {rows.map((r) => (
              <div key={r.number} className="grid grid-cols-[minmax(240px,1.6fr)_110px_minmax(280px,2fr)_minmax(150px,1fr)] items-start gap-3 border-b border-[var(--w-border)] px-4 py-2.5 text-[13px]">
                <button type="button" onClick={() => openIssue(r.number)} className="group flex min-w-0 items-start gap-2 text-left">
                  <span className="mt-0.5"><IssueTypeIcon type={lk.types.get(r.typeId)} size={13} /></span>
                  <span className="min-w-0">
                    <span className="mr-1.5 text-[12px] font-medium text-[var(--w-text-2)] group-hover:text-[var(--w-accent-text)]">{lk.issueKey(r.number)}</span>
                    <span className="group-hover:underline">{r.title}</span>
                    <span className="mt-1 block"><StatusBadge status={lk.statuses.get(r.statusId)} className="!h-[18px] !text-[10px]" /></span>
                  </span>
                </button>
                <div className="pt-0.5"><CoverageBadge coverage={r.coverage} /></div>
                <div className="min-w-0 space-y-1">
                  {r.tests.length ? r.tests.map((t) => (
                    <button key={t.number} type="button" onClick={() => openIssue(t.number)} className="flex w-full min-w-0 items-center gap-2 rounded-[4px] text-left hover:bg-[var(--w-hover)]">
                      <RunStatusPill status={t.lastStatus} />
                      <span className="shrink-0 text-[12px] font-medium text-[var(--w-text-2)]">{lk.issueKey(t.number)}</span>
                      <span className="min-w-0 truncate text-[12.5px]">{t.title}</span>
                    </button>
                  )) : <span className="text-[12px] text-[var(--w-text-3)]">No linked tests</span>}
                </div>
                <div className="flex min-w-0 flex-wrap gap-1">
                  {r.bugs.length ? r.bugs.map((b) => (
                    <button
                      key={b.number}
                      type="button"
                      title={b.title}
                      onClick={() => openIssue(b.number)}
                      className="inline-flex h-[20px] items-center gap-1 rounded-[4px] border border-[color-mix(in_srgb,var(--w-red)_40%,transparent)] px-1.5 text-[11px] font-medium text-[var(--w-red)] hover:bg-[var(--w-hover)]"
                    >
                      <Bug size={11} /> {lk.issueKey(b.number)}
                    </button>
                  )) : <span className="text-[12px] text-[var(--w-text-3)]">—</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Card({ label, value, sub, pct, color }: { label: string; value: number | string; sub?: string; pct?: number; color?: string }) {
  return (
    <div className="rounded-[8px] border border-[var(--w-border)] bg-[var(--w-panel)] px-3 py-2">
      <div className="text-[11px] text-[var(--w-text-3)]">{label}</div>
      <div className="text-[18px] font-semibold tabular" style={color ? { color } : undefined}>{value}</div>
      {pct !== undefined && (
        <div className="mt-1 h-1 overflow-hidden rounded-full bg-[var(--w-sunken)]"><div className="h-full" style={{ width: `${pct}%`, background: color }} /></div>
      )}
      {sub && <div className="mt-1 truncate text-[11px] text-[var(--w-text-3)]">{sub}</div>}
    </div>
  );
}
