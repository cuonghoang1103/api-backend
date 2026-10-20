'use client';

/**
 * "Create with CuongMini" — trình hướng dẫn một bản nháp: Điền ⇒ CuongMini hiểu gì (sửa/trả lời ⇒ Chấp nhận) ⇒ Kế hoạch
 * (chỉ khi bật "Xem trước khi tạo") ⇒ Kết quả. Mọi thứ lưu tự động; job chạy ở máy chủ (tải lại trang vẫn theo dõi được).
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, ArrowLeft, Bot, Check, RefreshCw, RotateCcw, Scale, Sparkles, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { workError } from '@/lib/work-api';
import { setTicket, setupApi, setupKeys, type SetupDraft, type SetupInput, type SetupModelId, type SetupPlan, type Understanding } from '@/lib/work-setup-api';
import { PageLoading, Spinner, EmptyState } from '@/components/work/ui';
import { wt } from '@/components/work/i18n';
import FillForm, { SECTIONS } from './FillForm';
import UnderstandingView from './UnderstandingView';
import PlanPreview from './PlanPreview';
import ProgressView from './ProgressView';
import ModelPicker from './ModelPicker';
import ResultView from './ResultView';
import { Check2 } from './bits';

/** Bỏ dòng dở (chưa tên/ngày) trước khi lưu — máy chủ kiểm chặt. */
export function cleanInput(i: SetupInput): SetupInput {
  const day = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s);
  return {
    ...i,
    brief: { ...i.brief, deliverables: i.brief.deliverables.map((x) => x.trim()).filter(Boolean) },
    team: { ...i.team, members: i.team.members.filter((m) => m.name.trim()).map((m) => ({ ...m, email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.email.trim()) ? m.email.trim() : '' })) },
    timeline: {
      ...i.timeline,
      startDate: day(i.timeline.startDate) ? i.timeline.startDate : '',
      endDate: day(i.timeline.endDate) ? i.timeline.endDate : '',
      milestones: i.timeline.milestones.filter((m) => m.name.trim() && day(m.date)),
      avoid: i.timeline.avoid.filter((a) => a.name.trim() && day(a.from) && day(a.to)),
    },
    groups: i.groups.filter((g) => g.name.trim()),
  };
}

const STEPS = ['fill', 'understand', 'plan', 'done'] as const;

export default function SetupWizard({ draftId, wsId, slug }: { draftId: number; wsId: number; slug: string }) {
  const qc = useQueryClient();
  const router = useRouter();
  const q = useQuery({
    queryKey: setupKeys.draft(draftId), queryFn: () => setupApi.get(draftId),
    refetchInterval: (qq) => (qq.state.data?.busy ? 1500 : false),
  });
  const draft = q.data;
  const [input, setInputState] = useState<SetupInput | null>(null);
  const [u, setU] = useState<Understanding | null>(null);
  const [plan, setPlan] = useState<SetupPlan | null>(null);
  const [forceView, setForceView] = useState<'fill' | 'understand' | null>(null);
  const [saving, setSaving] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [reread, setReread] = useState<string | null>(null);
  const [instruction, setInstruction] = useState('');
  const dirty = useRef({ input: false, u: false, plan: false, rev: 0 });
  const lastStatus = useRef<string | null>(null);

  const onDraft = useCallback((d: SetupDraft) => { qc.setQueryData(setupKeys.draft(draftId), d); }, [qc, draftId]);

  // Đồng bộ trạng thái cục bộ khi máy chủ đổi pha (job xong) — không đè thứ người dùng đang gõ.
  useEffect(() => {
    if (!draft) return;
    if (!input || (!dirty.current.input && lastStatus.current !== draft.status)) setInputState(draft.input);
    if (draft.understanding && (!u || lastStatus.current !== draft.status) && !dirty.current.u) setU(draft.understanding);
    if (draft.plan && (!plan || lastStatus.current !== draft.status) && !dirty.current.plan) setPlan(draft.plan);
    if (lastStatus.current && lastStatus.current !== draft.status) setForceView(null);
    lastStatus.current = draft.status;
  }, [draft]); // eslint-disable-line react-hooks/exhaustive-deps

  const editable = !!draft && !draft.busy && draft.status !== 'APPLIED';

  // Lưu tự động (1 s sau lần gõ cuối).
  useEffect(() => {
    if (!draft || !editable) return;
    const d0 = dirty.current;
    if (!d0.input && !d0.u && !d0.plan) return;
    const rev = d0.rev;
    const t = setTimeout(async () => {
      const body: Parameters<typeof setupApi.patch>[1] = {};
      if (d0.input && input) body.input = cleanInput(input);
      if (d0.u && u) body.understanding = u;
      if (d0.plan && plan) body.plan = plan;
      setSaving('saving');
      try {
        const saved = await setupApi.patch(draft.id, body);
        if (dirty.current.rev === rev) {
          dirty.current = { input: false, u: false, plan: false, rev };
          qc.setQueryData(setupKeys.draft(draftId), saved);
          if (body.plan && saved.plan) setPlan((p) => (p ? { ...p, warnings: saved.plan!.warnings } : p));
        }
        setSaving('saved');
      } catch (e) {
        setSaving('error');
        toast.error(workError(e, wt('tcm.saveFailed')));
      }
    }, 1000);
    return () => clearTimeout(t);
  }, [input, u, plan]); // eslint-disable-line react-hooks/exhaustive-deps

  const setInput = (f: (x: SetupInput) => SetupInput) => { dirty.current.input = true; dirty.current.rev += 1; setInputState((x) => (x ? f(x) : x)); };
  const setUnderstanding = (x: Understanding) => { dirty.current.u = true; dirty.current.rev += 1; setU(x); };
  const setPlanEdit = (x: SetupPlan) => { dirty.current.plan = true; dirty.current.rev += 1; setPlan(x); };

  /** Lưu ngay phần đang dở trước khi chạy job (job đọc bản trên máy chủ). */
  const flush = async () => {
    if (!draft) return;
    const d0 = dirty.current;
    if (!d0.input && !d0.u && !d0.plan) return;
    const body: Parameters<typeof setupApi.patch>[1] = {};
    if (d0.input && input) body.input = cleanInput(input);
    if (d0.u && u) body.understanding = u;
    if (d0.plan && plan) body.plan = plan;
    dirty.current = { input: false, u: false, plan: false, rev: d0.rev + 1 };
    onDraft(await setupApi.patch(draft.id, body));
  };

  const onErr = (e: unknown) => {
    const code = (e as { response?: { data?: { code?: string } } })?.response?.data?.code;
    if (code === 'WORK_SETUP_KEY_REQUIRED') { setTicket(null); void qc.invalidateQueries({ queryKey: setupKeys.models(wsId) }); }
    toast.error(workError(e, wt('tcm.actionFailed')));
  };
  const run = useMutation({
    mutationFn: async (fn: () => Promise<SetupDraft>) => { await flush(); return fn(); },
    onSuccess: (d) => { onDraft(d); setForceView(null); },
    onError: onErr,
  });
  const cancel = useMutation({ mutationFn: () => setupApi.cancel(draftId), onSuccess: onDraft, onError: onErr });
  const setModel = async (m: SetupModelId) => { try { onDraft(await setupApi.patch(draftId, { model: m })); } catch (e) { onErr(e); } };

  if (q.isLoading || (draft && !input)) return <PageLoading />;
  if (!draft || !input) return <EmptyState title={wt('tcm.draftNotFound')} body={workError(q.error, wt('tcm.draftNotFoundBody'))} />;

  const st = draft.status;
  const failedAt = st === 'FAILED' ? draft.failedPhase : null;
  const view: 'fill' | 'understand' | 'plan' | 'progress' | 'done' =
    draft.busy ? 'progress'
      : st === 'APPLIED' ? 'done'
        : forceView === 'fill' ? 'fill'
          : forceView === 'understand' && u ? 'understand'
          : (st === 'READY' || failedAt === 'APPLYING') && plan ? 'plan'
            : (st === 'UNDERSTOOD' || failedAt === 'PLANNING' || (st === 'READY' && !plan)) && u ? 'understand'
              : 'fill';
  const stepIdx = view === 'done' ? 3 : view === 'plan' || (view === 'progress' && st === 'APPLYING') ? 2 : view === 'understand' || (view === 'progress' && st === 'PLANNING') ? 1 : 0;
  const reviewFirst = input.reviewFirst;
  const canRead = !!(input.overview.name.trim() || input.overview.goal.trim() || input.brief.text.trim() || draft.sources.some((s) => s.status === 'OK'));

  return (
    <div className="mx-auto w-full max-w-[1120px] px-3 pt-4 md:px-6">
      {/* Bước */}
      <ol className="mb-4 flex max-w-full items-center gap-1 overflow-x-auto text-[12.5px]" aria-label={wt('tcm.steps')}>
        {STEPS.map((s, i) => (
          <li key={s} className="flex shrink-0 items-center gap-1">
            <span className={cn('flex h-6 items-center gap-1.5 rounded-full px-2.5 font-medium', i === stepIdx ? 'bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]' : i < stepIdx ? 'text-[var(--w-text-2)]' : 'text-[var(--w-text-3)]')}>
              {i < stepIdx ? <Check size={12} /> : <span className="tabular-nums">{i + 1}</span>} {wt(`tcm.step_${s}` as const)}
            </span>
            {i < STEPS.length - 1 && <span className="h-px w-4 bg-[var(--w-border-strong)]" aria-hidden />}
          </li>
        ))}
        <li className="ml-auto shrink-0 pl-3 text-[11.5px] text-[var(--w-text-3)]">
          {saving === 'saving' ? wt('tcm.saving') : saving === 'saved' ? wt('tcm.saved') : saving === 'error' ? wt('tcm.saveError') : ''}
          {draft.usage.calls > 0 && <span className="ml-2">{wt('tcm.usage', { n: draft.usage.calls, usd: draft.usage.usd.toFixed(3) })}</span>}
        </li>
      </ol>

      {draft.error && !draft.busy && st !== 'APPLIED' && (
        <div role="alert" className="mb-4 flex flex-wrap items-start gap-2 rounded-[8px] border border-[var(--w-border-strong)] bg-[var(--w-sunken)] px-3 py-2.5 text-[13px]">
          <AlertTriangle size={15} className="mt-0.5 shrink-0 text-[var(--w-orange)]" />
          <span className="min-w-0 flex-1">{failedAt ? wt('tcm.failedAt', { phase: wt(`tcm.phase_${failedAt}` as const) }) : ''} {draft.error}</span>
          {failedAt && (
            <button type="button" className="w-btn w-btn-sm" disabled={run.isPending} onClick={() => run.mutate(() =>
              failedAt === 'READING' ? setupApi.understand(draftId) : failedAt === 'PLANNING' ? setupApi.accept(draftId, { understanding: u ?? undefined }) : setupApi.apply(draftId, { sendInvites: input.team.sendInvites }))}>
              <RotateCcw size={13} /> {wt('tcm.retry')}
            </button>
          )}
        </div>
      )}

      {view === 'progress' && <ProgressView draft={draft} cancelling={cancel.isPending} onCancel={() => cancel.mutate()} />}
      {view === 'done' && <ResultView draft={draft} slug={slug} onNew={() => router.push(`/work/${slug}/setup`)} />}

      {view === 'fill' && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[180px_minmax(0,1fr)]">
          <nav className="sticky top-2 hidden self-start lg:block" aria-label={wt('tcm.sections')}>
            <ul className="space-y-0.5 text-[12.5px]">
              {SECTIONS.filter((s) => s !== 'groups' || draft.mode === 'WORKSPACE').map((s) => (
                <li key={s}><a href={`#${s}`} className="block rounded-[6px] px-2 py-1 text-[var(--w-text-2)] hover:bg-[var(--w-hover)] hover:text-[var(--w-text)]">{wt(`tcm.nav_${s}` as const)}</a></li>
              ))}
            </ul>
          </nav>
          <FillForm draft={draft} input={input} setInput={setInput} onDraft={onDraft} wsId={wsId} disabled={!editable} />
        </div>
      )}

      {view === 'understand' && u && (
        <div>
          <div className="mb-3 flex items-start gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]"><Bot size={17} /></span>
            <div>
              <h2 className="text-[16px] font-semibold">{wt('tcm.uTitle')}</h2>
              <p className="text-[12.5px] text-[var(--w-text-2)]">{wt('tcm.uIntro')}</p>
            </div>
          </div>
          <UnderstandingView u={u} onChange={setUnderstanding} disabled={!editable} />
        </div>
      )}

      {view === 'plan' && plan && (
        <div>
          <div className="mb-3 flex items-start gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]"><Sparkles size={16} /></span>
            <div>
              <h2 className="text-[16px] font-semibold">{wt('tcm.planTitle')}</h2>
              <p className="text-[12.5px] text-[var(--w-text-2)]">{wt('tcm.planIntro')}</p>
            </div>
          </div>
          <PlanPreview plan={plan} onChange={setPlanEdit} disabled={!editable} />
        </div>
      )}

      {/* Thanh hành động dính đáy */}
      {(view === 'fill' || view === 'understand' || view === 'plan') && editable && (
        <div className="sticky bottom-0 z-20 -mx-3 mt-6 border-t border-[var(--w-border)] bg-[var(--w-panel)] md:-mx-6">
          <div className="flex w-full flex-wrap items-center gap-2 px-3 py-2.5 md:px-6">
            {view !== 'plan' && <ModelPicker wsId={wsId} value={draft.model} onChange={(m) => void setModel(m)} disabled={run.isPending} />}
            <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
              {view === 'fill' && (
                <>
                  {u && <button type="button" className="w-btn w-btn-sm" onClick={() => setForceView(st === 'READY' ? null : 'understand')}>{st === 'READY' ? wt('tcm.toPlan') : wt('tcm.toSummary')}</button>}
                  <button type="button" className="w-btn w-btn-primary" disabled={run.isPending || !canRead} title={canRead ? undefined : wt('tcm.needSomething')}
                    onClick={() => run.mutate(() => setupApi.understand(draftId, {}))}>
                    {run.isPending ? <Spinner size={12} /> : <Wand2 size={14} />} {u ? wt('tcm.reread') : wt('tcm.readSummarize')}
                  </button>
                </>
              )}
              {view === 'understand' && (
                <>
                  <button type="button" className="w-btn w-btn-sm" onClick={() => setForceView('fill')}><ArrowLeft size={13} /> {wt('tcm.backToInputs')}</button>
                  {reread === null ? (
                    <button type="button" className="w-btn w-btn-sm" disabled={run.isPending} onClick={() => setReread('')}><RefreshCw size={13} /> {wt('tcm.reread')}</button>
                  ) : (
                    <span className="flex min-w-[240px] flex-1 gap-1.5">
                      <input className="w-input h-8 min-w-0 flex-1 text-[12.5px]" autoFocus value={reread} placeholder={wt('tcm.rereadPh')} aria-label={wt('tcm.reread')} onChange={(e) => setReread(e.target.value)} />
                      <button type="button" className="w-btn w-btn-sm" disabled={run.isPending} onClick={() => { const n = reread; setReread(null); run.mutate(() => setupApi.understand(draftId, { reread: n || undefined })); }}>{wt('tcm.go')}</button>
                    </span>
                  )}
                  <Check2 checked={input.reviewFirst} label={wt('tcm.reviewFirst')} onChange={(v) => setInput((x) => ({ ...x, reviewFirst: v }))} />
                  <Check2 checked={input.team.sendInvites} label={wt('tcm.sendInvitesShort')} onChange={(v) => setInput((x) => ({ ...x, team: { ...x.team, sendInvites: v } }))} />
                  <button type="button" className="w-btn w-btn-primary" disabled={run.isPending}
                    onClick={() => run.mutate(() => setupApi.accept(draftId, { understanding: u ?? undefined, reviewFirst, sendInvites: input.team.sendInvites }))}>
                    {run.isPending ? <Spinner size={12} /> : <Check size={14} />} {reviewFirst ? wt('tcm.acceptDraft') : wt('tcm.acceptCreate')}
                  </button>
                </>
              )}
              {view === 'plan' && (
                <>
                  <button type="button" className="w-btn w-btn-sm" onClick={() => setForceView('understand')} title={wt('tcm.backToSummaryHint')}><ArrowLeft size={13} /> {wt('tcm.backToSummary')}</button>
                  <span className="flex min-w-[220px] flex-1 gap-1.5">
                    <input className="w-input h-8 min-w-0 flex-1 text-[12.5px]" value={instruction} placeholder={wt('tcm.revisePh')} aria-label={wt('tcm.revise')} onChange={(e) => setInstruction(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && instruction.trim()) { e.preventDefault(); const t = instruction; setInstruction(''); run.mutate(() => setupApi.revise(draftId, t)); } }} />
                    <button type="button" className="w-btn w-btn-sm" disabled={run.isPending || !instruction.trim()} onClick={() => { const t = instruction; setInstruction(''); run.mutate(() => setupApi.revise(draftId, t)); }}><Bot size={13} /> {wt('tcm.revise')}</button>
                  </span>
                  <button type="button" className="w-btn w-btn-sm" disabled={run.isPending} title={wt('tcm.rebalanceHint')} onClick={() => run.mutate(async () => { const d = await setupApi.rebalance(draftId); setPlan(d.plan); return d; })}><Scale size={13} /> {wt('tcm.rebalance')}</button>
                  <Check2 checked={input.team.sendInvites} label={wt('tcm.sendInvitesShort')} onChange={(v) => setInput((x) => ({ ...x, team: { ...x.team, sendInvites: v } }))} />
                  <button type="button" className="w-btn w-btn-primary" disabled={run.isPending} onClick={() => run.mutate(() => setupApi.apply(draftId, { sendInvites: input.team.sendInvites }))}>
                    {run.isPending ? <Spinner size={12} /> : <Check size={14} />} {(plan?.projects.length ?? 1) > 1 ? wt('tcm.createN', { n: plan?.projects.length ?? 1 }) : wt('tcm.create1')}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
