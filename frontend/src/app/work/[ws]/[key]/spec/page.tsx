'use client';

/**
 * /work/<slug>/<KEY>/spec — Spec quality (đợt S6): chấm Spec Fidelity cho tập thẻ REQUIREMENT/STORY (cả dự án / một
 * epic / một giai đoạn) + lịch sử MỌI lần chấm của dự án (cả trang Docs). Dùng được độc lập, không cần mô-đun stages
 * (dự án School / đồ án). `?stage=<id>` · `?epic=<số>` chọn sẵn phạm vi; `?review=<id>` mở một lần chấm cũ (từ phê
 * duyệt cổng).
 */

import Link from 'next/link';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { FileText, Gauge, ListChecks } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workApi, workError, workStudioApi, workStudioKeys, type ProjectConfig } from '@/lib/work-api';
import { workS6Api, workS6Keys, type SpecReview } from '@/lib/work-s6-api';
import ProjectHeader from '@/components/work/ProjectHeader';
import { useProject, useProjectRealtime } from '@/components/work/hooks';
import { EmptyState, PageLoading, relativeTime } from '@/components/work/ui';
import { Select } from '@/components/work/settings/shared';
import { studioOn } from '@/components/work/studio/shared';
import { OverallBadge, SpecPanel, SpecSparkline, scoreColor } from '@/components/work/spec/SpecPanel';

type Scope = 'all' | 'epic' | 'stage';

function SpecView({ config }: { config: ProjectConfig }) {
  const pid = config.id;
  const qc = useQueryClient();
  const sp = useSearchParams();
  const router = useRouter();
  const base = `/work/${config.workspace.slug}/${config.key}`;
  const stagesOn = studioOn(config, 'stages');
  const [scope, setScope] = useState<Scope>(sp?.get('stage') ? 'stage' : sp?.get('epic') ? 'epic' : 'all');
  const [stageId, setStageId] = useState<number | null>(Number(sp?.get('stage')) || null);
  const [epic, setEpic] = useState<number | null>(Number(sp?.get('epic')) || null);
  const [current, setCurrent] = useState<SpecReview | null>(null);
  const reviewParam = Number(sp?.get('review')) || null;

  const epicType = config.issueTypes.find((t) => t.key === 'EPIC');
  const epics = useQuery({
    queryKey: ['work', 'issues', pid, 'spec-epics'],
    queryFn: () => workApi.issues(pid, { type: epicType ? [epicType.id] : [], includeDone: true, limit: 200 }),
    enabled: scope === 'epic' && !!epicType,
  });
  const stages = useQuery({ queryKey: workStudioKeys.stages(pid), queryFn: () => workStudioApi.stages(pid), enabled: stagesOn });
  const settings = useQuery({ queryKey: workS6Keys.settings(pid), queryFn: () => workS6Api.settings(pid) });

  const histQ = scope === 'stage' && stageId ? { scope: 'ISSUES' as const, stage: stageId } : scope === 'epic' && epic ? { scope: 'ISSUES' as const, epic } : { scope: 'ISSUES' as const };
  const hist = useQuery({ queryKey: workS6Keys.reviews(pid, histQ), queryFn: () => workS6Api.reviews(pid, { ...histQ, limit: 30 }) });
  const all = useQuery({ queryKey: workS6Keys.reviews(pid, { all: true }), queryFn: () => workS6Api.reviews(pid, { limit: 50 }) });
  const opened = useQuery({ queryKey: workS6Keys.review(pid, reviewParam ?? 0), queryFn: () => workS6Api.review(pid, reviewParam!), enabled: !!reviewParam });
  const latestId = hist.data?.items[0]?.id;
  const latest = useQuery({ queryKey: workS6Keys.review(pid, latestId ?? 0), queryFn: () => workS6Api.review(pid, latestId!), enabled: !!latestId && !reviewParam });
  useEffect(() => { setCurrent(null); }, [scope, stageId, epic]);
  const review = current ?? (reviewParam ? opened.data : latest.data) ?? null;

  const run = useMutation({
    mutationFn: (semantic: boolean) => workS6Api.reviewIssues(pid, { semantic, epicNumber: scope === 'epic' ? epic : null, stageId: scope === 'stage' ? stageId : null }),
    onSuccess: (r) => {
      setCurrent(r);
      if (reviewParam) router.replace(`${base}/spec`);
      qc.invalidateQueries({ queryKey: workS6Keys.allReviews(pid) });
      toast.success(`Spec Fidelity ${r.overall}/100`);
    },
    onError: (err) => toast.error(workError(err, 'Could not run the check')),
  });
  const canRun = ['ADMIN', 'MEMBER', 'TEACHER'].includes(config.role);
  const scopeReady = scope === 'all' || (scope === 'epic' ? !!epic : !!stageId);
  const gate = settings.data?.specGate;
  const pageReviews = useMemo(() => (all.data?.items ?? []).filter((r) => r.scope === 'PAGE'), [all.data]);

  return (
    <div className="mx-auto grid w-full max-w-[1240px] gap-6 px-4 pb-16 pt-5 md:px-8 lg:grid-cols-[minmax(0,1fr)_320px]">
      <section className="min-w-0 space-y-4">
        <div className="rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)] p-4">
          <h2 className="flex items-center gap-2 text-[15px] font-semibold"><ListChecks size={15} /> Requirements quality</h2>
          <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--w-text-2)]">
            Checks every Requirement and Story issue in the scope: acceptance criteria, failure cases, vague wording, duplicates and linked tests (traceability).
            To check a document (SRS), open it in Docs and use <b className="font-medium">Check spec quality</b>.
          </p>
          <div className="mt-3 flex flex-wrap items-end gap-2">
            <label className="min-w-[150px]">
              <span className="mb-1 block text-[11.5px] text-[var(--w-text-3)]">Scope</span>
              <Select value={scope} onChange={(e) => setScope(e.target.value as Scope)} className="!h-8" aria-label="Scope">
                <option value="all">All requirements</option>
                {epicType && <option value="epic">One epic</option>}
                {stagesOn && <option value="stage">One stage</option>}
              </Select>
            </label>
            {scope === 'epic' && (
              <label className="min-w-[220px] flex-1">
                <span className="mb-1 block text-[11.5px] text-[var(--w-text-3)]">Epic</span>
                <Select value={epic ?? ''} onChange={(e) => setEpic(Number(e.target.value) || null)} className="!h-8" aria-label="Epic">
                  <option value="">Choose an epic…</option>
                  {(epics.data?.items ?? []).map((i) => <option key={i.id} value={i.number}>{config.key}-{i.number} {i.title}</option>)}
                </Select>
              </label>
            )}
            {scope === 'stage' && (
              <label className="min-w-[220px] flex-1">
                <span className="mb-1 block text-[11.5px] text-[var(--w-text-3)]">Stage</span>
                <Select value={stageId ?? ''} onChange={(e) => setStageId(Number(e.target.value) || null)} className="!h-8" aria-label="Stage">
                  <option value="">Choose a stage…</option>
                  {(stages.data ?? []).map((s) => <option key={s.id} value={s.id}>{String(s.n).padStart(2, '0')}. {s.name}</option>)}
                </Select>
              </label>
            )}
          </div>
        </div>
        <div className="rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)] p-4">
          <SpecPanel
            config={config}
            review={review}
            history={hist.data?.items}
            running={run.isPending}
            onRun={(s) => { if (!scopeReady) { toast.error('Choose the epic or stage first'); return; } run.mutate(s); }}
            canRun={canRun && scopeReady}
            gateThreshold={gate?.enabled ? gate.minDimension : undefined}
            onChanged={(r) => { setCurrent(r); qc.invalidateQueries({ queryKey: ['work', 'issues', pid] }); }}
          />
        </div>
      </section>

      <aside className="min-w-0 space-y-4" aria-label="Spec checks in this project">
        <div className="rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)] p-4">
          <h2 className="mb-2 text-[13px] font-semibold">Gate</h2>
          {gate?.enabled ? (
            <p className="text-[12.5px] text-[var(--w-text-2)]">Spec Fidelity gate is on: overall ≥ {gate.minOverall}, every dimension ≥ {gate.minDimension} before the {gate.stageIds.length ? 'chosen stages' : '“Requirements specification” stage'} can be sent for gate review.</p>
          ) : <p className="text-[12.5px] text-[var(--w-text-3)]">No Spec Fidelity gate. {settings.data?.canConfigure ? <Link href={`${base}/settings?tab=quality`} className="text-[var(--w-accent-text)] hover:underline">Set one up</Link> : 'A project admin can turn it on.'}</p>}
        </div>
        <div className="rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)] p-4">
          <h2 className="mb-2 flex items-center gap-1.5 text-[13px] font-semibold"><FileText size={13} /> Document checks</h2>
          {pageReviews.length ? (
            <ul className="space-y-1.5">
              {[...new Map(pageReviews.map((r) => [r.pageId, r])).values()].slice(0, 12).map((r) => (
                <li key={r.id}>
                  <Link href={`${base}/docs/${r.page?.number}`} className="flex min-w-0 items-center gap-2 rounded-[6px] px-1 py-1 text-[12.5px] hover:bg-[var(--w-hover)]">
                    <OverallBadge n={r.overall} size={26} />
                    <span className="min-w-0 flex-1 truncate">{r.page?.title ?? r.scopeLabel}</span>
                    <span className="shrink-0 text-[11px] text-[var(--w-text-3)]">{relativeTime(r.createdAt)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : <p className="text-[12.5px] text-[var(--w-text-3)]">No document checked yet.</p>}
        </div>
        <div className="rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)] p-4">
          <h2 className="mb-2 text-[13px] font-semibold">History · this scope</h2>
          {hist.data?.items.length ? (
            <>
              <SpecSparkline items={hist.data.items} />
              <ul className="mt-2 space-y-0.5 text-[12.5px]">
                {hist.data.items.slice(0, 10).map((r) => (
                  <li key={r.id}>
                    <button type="button" onClick={() => workS6Api.review(pid, r.id).then(setCurrent)} className={cn('flex w-full items-center gap-2 rounded-[6px] px-1 py-1 text-left hover:bg-[var(--w-hover)]', review?.id === r.id && 'bg-[var(--w-active)]')}>
                      <span className="tabular w-7 font-semibold" style={{ color: scoreColor(r.overall) }}>{r.overall}</span>
                      <span className="min-w-0 flex-1 truncate text-[var(--w-text-2)]">{r.createdBy?.name ?? '—'}</span>
                      <span className="shrink-0 text-[11px] text-[var(--w-text-3)]">{relativeTime(r.createdAt)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : <p className="text-[12.5px] text-[var(--w-text-3)]">Not checked yet.</p>}
        </div>
      </aside>
    </div>
  );
}

function SpecPage() {
  const params = useParams<{ ws: string; key: string }>();
  const { pid, config, isLoading, error } = useProject(params.ws, params.key);
  useProjectRealtime(pid);
  if (isLoading) return <PageLoading />;
  if (error || !config || !pid) return <EmptyState title="Project not found" body={error ? workError(error) : undefined} />;
  const restricted = config.role === 'CLIENT';
  return (
    <div className="flex h-full flex-col">
      <ProjectHeader config={config} title="Spec quality" />
      <div className="min-h-0 flex-1 overflow-y-auto">
        {restricted ? <EmptyState title="Not available" body="Spec quality checks are for the project team." icon={<Gauge size={20} />} /> : <SpecView config={config} />}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<PageLoading />}>
      <SpecPage />
    </Suspense>
  );
}
