'use client';

/**
 * CTW đợt 5 (10/10/2026) — /work/teaching: HUB GIẢNG VIÊN (A28). Xuyên không gian: mọi nhóm mình mang vai TEACHER.
 *   - Tab "Các nhóm": KPI, lọc môn/lớp/kỳ + tìm, bảng sức khoẻ từng nhóm (lý do cụ thể), hồ sơ FPT, so sánh nhóm,
 *     xuất Excel/PDF, AI tóm tắt (đọc từ cùng số liệu).
 *   - Tab "Rubric": rubric chấm của mình (mẫu SWP391/SEP490 từ quy định môn trong repo) — RubricsPanel.
 *   - Tab "Lớp học": sang /work/classes.
 * Mọi hook đặt TRƯỚC các lệnh return sớm. Bộ lọc nằm trong URL (?subject=&class=&term=&tab=) để chia sẻ link được.
 */

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowUpRight, Columns3, FileDown, FileSpreadsheet, GraduationCap, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workError } from '@/lib/work-api';
import KpiTile from '@/components/work/KpiTile';
import AiMarkdown from '@/components/work/ai/AiMarkdown';
import { Dialog, EmptyState, PageLoading, Spinner } from '@/components/work/ui';
import { PageHeader, Select } from '@/components/work/settings/shared';
import { useWT, type WKey } from '@/components/work/i18n';
import RubricsPanel from './RubricsPanel';
import { FPT_DOCS, saveBlob, teachingApi, teachingKeys, type DocState, type GroupRow, type Health, type OverviewFilter } from './teachingApi';

const HEALTH_TONE: Record<Health, string> = {
  red: 'bg-[var(--w-red-soft,var(--w-sunken))] text-[var(--w-red-text)]',
  amber: 'bg-[var(--w-yellow-soft,var(--w-sunken))] text-[var(--w-yellow-text)]',
  green: 'bg-[var(--w-green-soft,var(--w-sunken))] text-[var(--w-green-text)]',
};
const DOC_TONE: Record<DocState, string> = {
  SUBMITTED: 'bg-[var(--w-green)] border-transparent',
  DRAFT: 'bg-[var(--w-yellow)] border-transparent',
  MISSING: 'bg-transparent border-[var(--w-red-text)]',
  NA: 'bg-[var(--w-sunken)] border-[var(--w-border)]',
};

export function HealthChip({ status }: { status: Health }) {
  const { t } = useWT();
  return <span className={cn('inline-flex h-6 items-center whitespace-nowrap rounded-full px-2 text-[12px] font-medium', HEALTH_TONE[status])}>{t(`teacher.health_${status}` as WKey)}</span>;
}

function DocsStrip({ g }: { g: GroupRow }) {
  const { t } = useWT();
  return (
    <div className="min-w-[132px]">
      <div className="flex flex-wrap gap-[3px]" role="list" aria-label={t('teacher.colDocs')}>
        {FPT_DOCS.map((d) => {
          const label = `${t(`teacher.doc_${d}` as WKey)}: ${t(`teacher.docState_${g.docs[d]}` as WKey)}`;
          return <span key={d} role="listitem" title={label} aria-label={label} className={cn('h-3 w-3 rounded-[3px] border', DOC_TONE[g.docs[d]])} />;
        })}
      </div>
      <div className="mt-1 text-[12px] tabular-nums text-[var(--w-text-2)]">{t('teacher.docsOf', { a: g.docsSubmitted, b: g.docsExpected })}</div>
    </div>
  );
}

function DocsLegend() {
  const { t } = useWT();
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-[var(--w-text-2)]" aria-label={t('teacher.colDocs')}>
      {(['SUBMITTED', 'DRAFT', 'MISSING', 'NA'] as const).map((s) => (
        <li key={s} className="flex items-center gap-1.5"><span aria-hidden="true" className={cn('h-3 w-3 rounded-[3px] border', DOC_TONE[s])} />{t(`teacher.docState_${s}` as WKey)}</li>
      ))}
    </ul>
  );
}

function reasonText(t: (k: WKey, v?: Record<string, string | number>) => string, r: { code: string; n: number }) {
  return t(`teacher.reason_${r.code}` as WKey, { count: r.n });
}

function GroupsTable({ groups, selected, onToggle }: { groups: GroupRow[]; selected: Set<number>; onToggle: (id: number) => void }) {
  const { t, fmtShortDate } = useWT();
  return (
    <div className="overflow-x-auto rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)]">
      <table className="w-full min-w-[980px] border-collapse text-[13px]">
        <thead>
          <tr className="border-b border-[var(--w-border)] text-left text-[12px] font-medium text-[var(--w-text-2)]">
            <th scope="col" className="w-9 px-3 py-2"><span className="sr-only">{t('teacher.compare')}</span></th>
            <th scope="col" className="px-2 py-2">{t('teacher.colGroup')}</th>
            <th scope="col" className="px-2 py-2">{t('teacher.colHealth')}</th>
            <th scope="col" className="px-2 py-2">{t('teacher.colProgress')}</th>
            <th scope="col" className="px-2 py-2 text-right">{t('teacher.colOverdue')}</th>
            <th scope="col" className="px-2 py-2">{t('teacher.colQna')}</th>
            <th scope="col" className="px-2 py-2">{t('teacher.colRisks')}</th>
            <th scope="col" className="px-2 py-2">{t('teacher.colDocs')}</th>
            <th scope="col" className="px-2 py-2">{t('teacher.colTeam')}</th>
            <th scope="col" className="px-2 py-2">{t('teacher.colGrades')}</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((g) => {
            const flagged = g.members.filter((m) => m.signals.length);
            return (
              <tr key={g.projectId} className="border-b border-[var(--w-border)] align-top last:border-0 hover:bg-[var(--w-hover)]">
                <td className="px-3 py-2.5">
                  <input type="checkbox" className="mt-0.5 h-4 w-4 accent-[var(--w-accent)]" checked={selected.has(g.projectId)} onChange={() => onToggle(g.projectId)} aria-label={t('teacher.selectGroup', { name: g.name })} />
                </td>
                <td className="max-w-[260px] px-2 py-2.5">
                  <Link href={g.href} className="group flex items-start gap-1 font-medium text-[var(--w-text)] hover:underline">
                    <span className="min-w-0 truncate">{g.name}</span>
                    <ArrowUpRight size={13} className="mt-0.5 shrink-0 text-[var(--w-text-3)]" aria-hidden="true" />
                  </Link>
                  <div className="mt-0.5 truncate text-[12px] text-[var(--w-text-2)]">
                    {[g.subject, g.classCode, g.term, g.groupCode].filter(Boolean).join(' · ')} · {t('teacher.members', { count: g.members.length })}
                  </div>
                </td>
                <td className="px-2 py-2.5">
                  <HealthChip status={g.health.status} />
                  {g.health.reasons.length > 0 && (
                    <ul className="mt-1 space-y-0.5 text-[12px] text-[var(--w-text-2)]">
                      {g.health.reasons.slice(0, 3).map((r) => <li key={r.code} className={r.level === 'red' ? 'text-[var(--w-red-text)]' : undefined}>{reasonText(t, r)}</li>)}
                    </ul>
                  )}
                </td>
                <td className="px-2 py-2.5 text-[12px] text-[var(--w-text-2)]">
                  {g.stage && <div className="text-[13px] text-[var(--w-text)]">{t('teacher.stageOf', { n: g.stage.n, total: g.stage.total })}</div>}
                  {g.sprint
                    ? <div>{g.sprint.name}: {t('teacher.sprintOf', { done: g.sprint.done, total: g.sprint.total })}{g.sprint.atRisk && <span className="text-[var(--w-red-text)]"> · {t('teacher.behind')}</span>}</div>
                    : <div>{t('teacher.noSprint')}</div>}
                </td>
                <td className="px-2 py-2.5 text-right tabular-nums">
                  <span className={g.issues.overdue ? 'font-semibold text-[var(--w-red-text)]' : 'text-[var(--w-text-2)]'}>{g.issues.overdue}</span>
                  <span className="text-[var(--w-text-3)]">/{g.issues.open}</span>
                </td>
                <td className="px-2 py-2.5 text-[12px]">
                  <span className={cn('tabular-nums', g.qna.open ? 'font-semibold text-[var(--w-text)]' : 'text-[var(--w-text-2)]')}>{g.qna.open}</span>
                  {g.qna.open > 0 && <div className="text-[var(--w-text-2)]">{t('teacher.questionsOldest', { count: g.qna.oldestDays })}</div>}
                </td>
                <td className="px-2 py-2.5 text-[12px] tabular-nums text-[var(--w-text-2)]">{t('teacher.highOf', { high: g.risks.high, open: g.risks.open })}</td>
                <td className="px-2 py-2.5"><DocsStrip g={g} /></td>
                <td className="max-w-[220px] px-2 py-2.5 text-[12px] text-[var(--w-text-2)]">
                  {g.contrib && <div className="text-[var(--w-text)]">{g.contrib.lastActiveDay ? t('teacher.lastActive', { date: fmtShortDate(g.contrib.lastActiveDay) }) : t('teacher.noActivity')}</div>}
                  {flagged.length > 0 && (
                    <ul className="mt-0.5 space-y-0.5">
                      {flagged.slice(0, 3).map((m) => <li key={m.id} className="truncate" title={m.signals.join(' · ')}><span className="font-medium text-[var(--w-text)]">{m.name}</span>: {m.signals[0]}</li>)}
                    </ul>
                  )}
                </td>
                <td className="px-2 py-2.5 text-[12px] text-[var(--w-text-2)]">
                  {g.grades.total ? <>{g.grades.latestMilestone}<div>{t('teacher.gradesOf', { published: g.grades.published, total: g.grades.total })}</div></> : t('teacher.noGrades')}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function CompareDialog({ open, onClose, groups }: { open: boolean; onClose: () => void; groups: GroupRow[] }) {
  const { t } = useWT();
  const rows: Array<[string, (g: GroupRow) => string]> = [
    [t('teacher.colHealth'), (g) => t(`teacher.health_${g.health.status}` as WKey)],
    [t('teacher.kpiStudents'), (g) => String(g.members.length)],
    [t('teacher.colProgress'), (g) => [g.stage ? t('teacher.stageOf', { n: g.stage.n, total: g.stage.total }) : '', g.sprint ? t('teacher.sprintOf', { done: g.sprint.done, total: g.sprint.total }) : ''].filter(Boolean).join(' · ') || '—'],
    [t('teacher.kpiOverdue'), (g) => `${g.issues.overdue}/${g.issues.open}`],
    [t('teacher.colQna'), (g) => String(g.qna.open)],
    [t('teacher.colRisks'), (g) => t('teacher.highOf', { high: g.risks.high, open: g.risks.open })],
    [t('teacher.colDocs'), (g) => t('teacher.docsOf', { a: g.docsSubmitted, b: g.docsExpected })],
    [t('teacher.colTeam'), (g) => (g.contrib ? `${g.contrib.actions} · ${t('teacher.flagged', { count: g.contrib.attention })}` : '—')],
    [t('teacher.colGrades'), (g) => (g.grades.total ? t('teacher.gradesOf', { published: g.grades.published, total: g.grades.total }) : t('teacher.noGrades'))],
  ];
  return (
    <Dialog open={open} onClose={onClose} title={t('teacher.compareTitle')} width={Math.min(1100, 260 + groups.length * 200)}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-[var(--w-border)] text-left">
              <th scope="col" className="py-2 pr-3 text-[12px] font-medium text-[var(--w-text-2)]">{t('teacher.metric')}</th>
              {groups.map((g) => <th key={g.projectId} scope="col" className="min-w-[150px] px-2 py-2 font-semibold">{g.groupCode ?? g.key}<div className="truncate text-[12px] font-normal text-[var(--w-text-2)]">{g.name}</div></th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, fn]) => (
              <tr key={label} className="border-b border-[var(--w-border)] last:border-0">
                <th scope="row" className="py-2 pr-3 text-left text-[12px] font-medium text-[var(--w-text-2)]">{label}</th>
                {groups.map((g) => <td key={g.projectId} className="px-2 py-2 tabular-nums">{fn(g)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Dialog>
  );
}

type Tab = 'groups' | 'rubrics';

function HubInner() {
  const { t, locale, fmtDateTime } = useWT();
  const router = useRouter();
  const pathname = usePathname() ?? '/work/teaching';
  const search = useSearchParams();
  const tab: Tab = search?.get('tab') === 'rubrics' ? 'rubrics' : 'groups';
  const filter: OverviewFilter = useMemo(() => ({
    subject: search?.get('subject') || undefined, classCode: search?.get('class') || undefined, term: search?.get('term') || undefined,
  }), [search]);
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [compareOpen, setCompareOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [exporting, setExporting] = useState<'xlsx' | 'pdf' | null>(null);

  const access = useQuery({ queryKey: teachingKeys.access, queryFn: teachingApi.access, staleTime: 60_000 });
  const ov = useQuery({ queryKey: teachingKeys.overview(filter), queryFn: () => teachingApi.overview(filter), enabled: !!access.data?.teaching && tab === 'groups', staleTime: 30_000 });
  const ai = useMutation({ mutationFn: () => teachingApi.aiSummary({ ...filter, language: locale }), onError: (err) => toast.error(workError(err, t('teacher.aiFailed'))) });

  const setParam = useCallback((k: string, v: string | null) => {
    const p = new URLSearchParams(search?.toString());
    if (v) p.set(k, v); else p.delete(k);
    const s = p.toString();
    router.replace(s ? `${pathname}?${s}` : pathname, { scroll: false });
  }, [router, pathname, search]);

  useEffect(() => { setSelected(new Set()); }, [filter.subject, filter.classCode, filter.term]);

  const groups = useMemo(() => {
    const all = ov.data?.groups ?? [];
    const s = q.trim().toLowerCase();
    if (!s) return all;
    return all.filter((g) => `${g.name} ${g.key} ${g.groupCode ?? ''} ${g.members.map((m) => `${m.name} ${m.username}`).join(' ')}`.toLowerCase().includes(s));
  }, [ov.data, q]);
  const toggle = useCallback((id: number) => setSelected((cur) => { const n = new Set(cur); if (n.has(id)) n.delete(id); else n.add(id); return n; }), []);

  const doExport = async (kind: 'xlsx' | 'pdf') => {
    setExporting(kind);
    try {
      const blob = await teachingApi.download(kind, filter);
      saveBlob(blob, `ctwork-teaching-${new Date().toISOString().slice(0, 10)}.${kind}`);
    } catch (err) {
      toast.error(workError(err, t('teacher.exportFailed')));
    } finally {
      setExporting(null);
    }
  };

  if (access.isLoading) return <PageLoading />;
  if (!access.data?.teaching) {
    return (
      <div className="flex h-full flex-col">
        <PageHeader title={t('teacher.title')} />
        <EmptyState icon={<GraduationCap size={20} />} title={t('teacher.notTeacherTitle')} body={t('teacher.notTeacherBody')} action={<Link href="/work/classes" className="w-btn w-btn-primary">{t('classroom.title')}</Link>} />
      </div>
    );
  }

  const o = ov.data;
  const facet = (k: 'subject' | 'class' | 'term', label: string, values: string[]) => (
    <label className="flex min-w-0 items-center gap-1.5 text-[12px] text-[var(--w-text-2)]">
      <span className="whitespace-nowrap">{label}</span>
      <Select value={search?.get(k) ?? ''} onChange={(e) => setParam(k, e.target.value || null)} className="h-8 w-auto max-w-[160px] py-0 text-[13px]" aria-label={label}>
        <option value="">{t('teacher.all')}</option>
        {values.map((v) => <option key={v} value={v}>{v}</option>)}
      </Select>
    </label>
  );
  const chosen = groups.filter((g) => selected.has(g.projectId));

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title={t('teacher.title')}
        sub={t('teacher.sub')}
        actions={tab === 'groups' ? (
          <>
            <div className="hidden gap-1.5 sm:flex">
              <button type="button" className="w-btn w-btn-sm" onClick={() => doExport('xlsx')} disabled={!!exporting}>{exporting === 'xlsx' ? <Spinner size={13} /> : <FileSpreadsheet size={14} aria-hidden="true" />}<span className="ml-1">{t('teacher.exportXlsx')}</span></button>
              <button type="button" className="w-btn w-btn-sm" onClick={() => doExport('pdf')} disabled={!!exporting}>{exporting === 'pdf' ? <Spinner size={13} /> : <FileDown size={14} aria-hidden="true" />}<span className="ml-1">{t('teacher.exportPdf')}</span></button>
            </div>
            <button type="button" className="w-btn w-btn-sm w-btn-primary" onClick={() => { setAiOpen(true); if (!ai.data) ai.mutate(); }}><Sparkles size={14} aria-hidden="true" /><span className="ml-1 hidden sm:inline">{t('teacher.aiSummary')}</span><span className="sr-only sm:hidden">{t('teacher.aiSummary')}</span></button>
          </>
        ) : undefined}
      />
      <div className="flex shrink-0 gap-1 overflow-x-auto border-b border-[var(--w-border)] px-4">
        <div className="flex gap-1" role="tablist" aria-label={t('teacher.title')}>
          {(['groups', 'rubrics'] as const).map((id) => (
            <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setParam('tab', id === 'groups' ? null : id)}
              className={cn('-mb-px whitespace-nowrap border-b-2 px-2.5 py-2.5 text-[13px] font-medium transition-colors', tab === id ? 'border-[var(--w-accent)] text-[var(--w-text)]' : 'border-transparent text-[var(--w-text-2)] hover:text-[var(--w-text)]')}>
              {t(id === 'groups' ? 'teacher.tabGroups' : 'teacher.tabRubrics')}
            </button>
          ))}
        </div>
        <Link href="/work/classes" className="-mb-px whitespace-nowrap border-b-2 border-transparent px-2.5 py-2.5 text-[13px] font-medium text-[var(--w-text-2)] hover:text-[var(--w-text)]">{t('teacher.tabClasses')}</Link>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {tab === 'rubrics' ? <RubricsPanel /> : (
          <div className="w-page space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {facet('subject', t('teacher.filterSubject'), o?.facets.subjects ?? [])}
              {facet('class', t('teacher.filterClass'), o?.facets.classes ?? [])}
              {facet('term', t('teacher.filterTerm'), o?.facets.terms ?? [])}
              <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('teacher.search')} aria-label={t('teacher.search')} className="w-input h-8 min-w-0 flex-1 basis-[200px] text-[13px]" />
              <div className="flex gap-1.5 sm:hidden">
                <button type="button" className="w-btn w-btn-sm" onClick={() => doExport('xlsx')} disabled={!!exporting}>{t('teacher.exportXlsx')}</button>
                <button type="button" className="w-btn w-btn-sm" onClick={() => doExport('pdf')} disabled={!!exporting}>{t('teacher.exportPdf')}</button>
              </div>
            </div>
            {ov.isLoading && <PageLoading rows={4} />}
            {ov.error && <EmptyState title={workError(ov.error)} />}
            {o && (
              <>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 2xl:grid-cols-8">
                  <KpiTile label={t('teacher.kpiGroups')} value={o.totals.groups} />
                  <KpiTile label={t('teacher.kpiAtRisk')} value={o.totals.red} tone={o.totals.red ? 'red' : undefined} dot="var(--w-red)" />
                  <KpiTile label={t('teacher.kpiWatch')} value={o.totals.amber} tone={o.totals.amber ? 'yellow' : undefined} dot="var(--w-yellow)" />
                  <KpiTile label={t('teacher.kpiOnTrack')} value={o.totals.green} tone={o.totals.green ? 'green' : undefined} dot="var(--w-green)" />
                  <KpiTile label={t('teacher.kpiStudents')} value={o.totals.students} />
                  <KpiTile label={t('teacher.kpiOverdue')} value={o.totals.overdue} tone={o.totals.overdue ? 'red' : undefined} />
                  <KpiTile label={t('teacher.kpiQna')} value={o.totals.qnaOpen} tone={o.totals.qnaOpen ? 'orange' : undefined} />
                  <KpiTile label={t('teacher.kpiDocsMissing')} value={o.totals.docsMissing} />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-[12px] text-[var(--w-text-2)]">
                  <span>{chosen.length >= 2 ? '' : t('teacher.compareHint')}</span>
                  <div className="flex items-center gap-2">
                    {selected.size > 0 && <button type="button" className="w-btn w-btn-sm w-btn-ghost" onClick={() => setSelected(new Set())}>{t('teacher.clearSelection')}</button>}
                    <button type="button" className="w-btn w-btn-sm" disabled={chosen.length < 2} onClick={() => setCompareOpen(true)}><Columns3 size={14} aria-hidden="true" /><span className="ml-1">{chosen.length >= 2 ? t('teacher.compareSelected', { count: chosen.length }) : t('teacher.compare')}</span></button>
                    <span className="hidden tabular-nums md:inline">{t('teacher.generated', { time: fmtDateTime(o.generatedAt) })}</span>
                  </div>
                </div>
                {!o.groups.length
                  ? <EmptyState icon={<GraduationCap size={20} />} title={t('teacher.noGroups')} body={t('teacher.noGroupsBody')} action={<Link href="/work/classes" className="w-btn w-btn-primary">{t('classroom.createClass')}</Link>} />
                  : !groups.length ? <EmptyState title={t('teacher.noMatch')} />
                    : (
                      <>
                        <GroupsTable groups={groups} selected={selected} onToggle={toggle} />
                        <DocsLegend />
                      </>
                    )}
              </>
            )}
          </div>
        )}
      </div>
      <CompareDialog open={compareOpen} onClose={() => setCompareOpen(false)} groups={chosen} />
      <Dialog open={aiOpen} onClose={() => setAiOpen(false)} title={<span className="flex items-center gap-2"><Sparkles size={15} aria-hidden="true" />{t('teacher.aiSummaryTitle')}</span>} width={720}
        footer={<button type="button" className="w-btn" onClick={() => ai.mutate()} disabled={ai.isPending}>{ai.isPending ? <Spinner size={13} /> : <Sparkles size={14} aria-hidden="true" />}<span className="ml-1">{t('teacher.aiSummary')}</span></button>}>
        {ai.isPending && <div className="flex items-center gap-2 py-6 text-[13px] text-[var(--w-text-2)]"><Spinner size={14} />{t('teacher.aiRunning')}</div>}
        {!ai.isPending && ai.data && (
          <>
            <AiMarkdown text={ai.data.summary} />
            <p className="mt-3 text-[12px] text-[var(--w-text-2)]">{t('teacher.aiNote')}</p>
          </>
        )}
        {!ai.isPending && ai.error && <p className="py-4 text-[13px] text-[var(--w-red-text)]">{workError(ai.error, t('teacher.aiFailed'))}</p>}
      </Dialog>
    </div>
  );
}

export default function TeachingHub() {
  return (
    <Suspense fallback={<PageLoading />}>
      <HubInner />
    </Suspense>
  );
}
