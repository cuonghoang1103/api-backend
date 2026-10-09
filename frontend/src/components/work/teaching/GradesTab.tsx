'use client';

/**
 * CTW đợt 5 — tab "Điểm" trong FPT reports của dự án.
 *   Giảng viên (vai TEACHER): chấm theo rubric của mình, theo mốc, cho cả nhóm hoặc từng thành viên; nhận xét từng tiêu
 *   chí + nhận xét chung; lưu nháp / công bố / thu hồi; xem lịch sử.
 *   Sinh viên (ADMIN/MEMBER): chỉ thấy điểm ĐÃ công bố — điểm nhóm cả nhóm thấy, điểm cá nhân chỉ chính mình (máy chủ lọc).
 */

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Eye, EyeOff, History, Pencil, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workError } from '@/lib/work-api';
import { Dialog, EmptyState, Field, PageLoading, Spinner } from '@/components/work/ui';
import { Select } from '@/components/work/settings/shared';
import { useWT, type WKey } from '@/components/work/i18n';
import { teachingApi, teachingKeys, type Grade, type GradesView, type Rubric } from './teachingApi';

const total = (r: Rubric, scores: Record<string, number | null | undefined>) => {
  if (r.criteria.some((c) => scores[c.key] === undefined || scores[c.key] === null || Number.isNaN(scores[c.key]))) return null;
  return Math.round(r.criteria.reduce((a, c) => a + (c.weight / 100) * Number(scores[c.key]), 0) * 100) / 100;
};

interface Draft { rubricId: number; milestone: string; stageId: number | null; subjectUserId: number | null; scores: Record<string, number | null>; notes: Record<string, string>; comment: string }

function GradeDialog({ pid, view, open, onClose, start }: { pid: number; view: GradesView; open: boolean; onClose: () => void; start: Grade | null }) {
  const { t } = useWT();
  const qc = useQueryClient();
  const blank = (): Draft => ({ rubricId: view.rubrics[0]?.id ?? 0, milestone: view.milestoneHints[0] ?? '', stageId: null, subjectUserId: null, scores: {}, notes: {}, comment: '' });
  const [d, setD] = useState<Draft>(blank);
  const [seed, setSeed] = useState<number | null | undefined>(undefined);
  const k = open ? start?.id ?? null : undefined;
  if (k !== seed) {
    setSeed(k);
    setD(start ? { rubricId: start.rubricId, milestone: start.milestone, stageId: start.stageId, subjectUserId: start.subjectUserId, scores: { ...start.scores }, notes: { ...start.notes }, comment: start.comment ?? '' } : blank());
  }
  const rubric = view.rubrics.find((r) => r.id === d.rubricId) ?? null;
  // Đổi sang tổ hợp đã có điểm ⇒ nạp điểm đó (lưu là SỬA, không tạo trùng).
  const pickExisting = (patch: Partial<Draft>) => {
    const n = { ...d, ...patch };
    const hit = view.grades.find((g) => g.rubricId === n.rubricId && g.milestone === n.milestone.trim() && g.subjectUserId === n.subjectUserId);
    setD(hit ? { ...n, scores: { ...hit.scores }, notes: { ...hit.notes }, comment: hit.comment ?? '', stageId: hit.stageId } : n);
  };
  const save = useMutation({
    mutationFn: (publish: boolean) => teachingApi.saveGrade(pid, {
      rubricId: d.rubricId, milestone: d.milestone.trim(), stageId: d.stageId, subjectUserId: d.subjectUserId,
      scores: Object.fromEntries(Object.entries(d.scores).filter(([, v]) => v !== null && v !== undefined && !Number.isNaN(v))) as Record<string, number>,
      notes: Object.fromEntries(Object.entries(d.notes).filter(([, v]) => v.trim())), comment: d.comment.trim() || null, ...(publish ? { publish: true } : {}),
    }),
    onSuccess: (g) => { toast.success(g.publishedAt ? t('teacher.gradePublished') : t('teacher.gradeSaved')); qc.invalidateQueries({ queryKey: teachingKeys.grades(pid) }); onClose(); },
    onError: (err) => toast.error(workError(err)),
  });
  const tt = rubric ? total(rubric, d.scores) : null;
  const valid = !!rubric && d.milestone.trim().length > 0;
  return (
    <Dialog open={open} onClose={onClose} title={start ? t('teacher.editGrade') : t('teacher.newGrade')} width={760}
      footer={<>
        <button type="button" className="w-btn" onClick={onClose}>{t('teacher.cancel')}</button>
        <button type="button" className="w-btn" disabled={!valid || save.isPending} onClick={() => save.mutate(false)}>{t('teacher.saveDraft')}</button>
        <button type="button" className="w-btn w-btn-primary" disabled={!valid || save.isPending} onClick={() => save.mutate(true)}>{save.isPending && <Spinner size={13} />}{t('teacher.saveAndPublish')}</button>
      </>}>
      <div className="grid gap-x-3 sm:grid-cols-2">
        <Field label={t('teacher.pickRubric')}>
          <Select value={d.rubricId} onChange={(e) => pickExisting({ rubricId: Number(e.target.value), scores: {}, notes: {} })}>
            {view.rubrics.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </Select>
        </Field>
        <Field label={t('teacher.milestone')}>
          <input className="w-input" list={`ms-${pid}`} value={d.milestone} placeholder={t('teacher.milestonePh')} maxLength={80} onChange={(e) => setD({ ...d, milestone: e.target.value })} onBlur={() => pickExisting({})} />
          <datalist id={`ms-${pid}`}>{view.milestoneHints.map((m) => <option key={m} value={m} />)}</datalist>
        </Field>
        <Field label={t('teacher.gradeFor')}>
          <Select value={d.subjectUserId ?? ''} onChange={(e) => pickExisting({ subjectUserId: e.target.value ? Number(e.target.value) : null })}>
            <option value="">{t('teacher.wholeTeam')}</option>
            {view.team.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </Select>
        </Field>
        <Field label={t('teacher.stage')}>
          <Select value={d.stageId ?? ''} onChange={(e) => setD({ ...d, stageId: e.target.value ? Number(e.target.value) : null })}>
            <option value="">{t('teacher.noStage')}</option>
            {view.stages.map((s) => <option key={s.id} value={s.id}>{s.n}. {s.name}</option>)}
          </Select>
        </Field>
      </div>
      {rubric && (
        <div className="space-y-3">
          {rubric.criteria.map((c) => (
            <fieldset key={c.key} className="rounded-[8px] border border-[var(--w-border)] p-3">
              <legend className="px-1 text-[13px] font-semibold">{c.name} <span className="font-normal text-[var(--w-text-2)]">· {c.weight}%</span></legend>
              {c.description && <p className="mb-2 text-[12.5px] leading-snug text-[var(--w-text-2)]">{c.description}</p>}
              <div className="flex flex-wrap items-center gap-1.5">
                <input className="w-input h-8 w-[88px] tabular-nums" type="number" min={0} max={rubric.scaleMax} step={0.25} aria-label={`${c.name} — ${t('teacher.score', { max: rubric.scaleMax })}`}
                  value={d.scores[c.key] ?? ''} onChange={(e) => setD({ ...d, scores: { ...d.scores, [c.key]: e.target.value === '' ? null : Number(e.target.value) } })} />
                {c.levels.map((l) => (
                  <button key={`${l.score}-${l.label}`} type="button" title={l.description} aria-pressed={d.scores[c.key] === l.score}
                    className={cn('w-btn w-btn-sm', d.scores[c.key] === l.score && 'w-btn-on')} onClick={() => setD({ ...d, scores: { ...d.scores, [c.key]: l.score } })}>
                    {l.score}{l.label ? ` · ${l.label}` : ''}
                  </button>
                ))}
              </div>
              <input className="w-input mt-2 h-8 text-[13px]" aria-label={`${c.name} — ${t('teacher.note')}`} placeholder={t('teacher.note')} value={d.notes[c.key] ?? ''} maxLength={2000} onChange={(e) => setD({ ...d, notes: { ...d.notes, [c.key]: e.target.value } })} />
            </fieldset>
          ))}
          <Field label={t('teacher.overall')}><textarea className="w-input min-h-[70px] py-2" value={d.comment} maxLength={8000} onChange={(e) => setD({ ...d, comment: e.target.value })} /></Field>
          <div className="text-[14px]" aria-live="polite">
            <span className="font-medium">{t('teacher.total')}: </span>
            {tt === null ? <span className="text-[var(--w-text-2)]">{t('teacher.notComplete')}</span> : <span className="font-semibold tabular-nums">{tt} / {rubric.scaleMax}</span>}
          </div>
        </div>
      )}
    </Dialog>
  );
}

function HistoryDialog({ pid, grade, onClose }: { pid: number; grade: Grade | null; onClose: () => void }) {
  const { t, fmtDateTime } = useWT();
  const q = useQuery({ queryKey: [...teachingKeys.grades(pid), 'history', grade?.id], queryFn: () => teachingApi.history(pid, grade!.id), enabled: !!grade });
  return (
    <Dialog open={!!grade} onClose={onClose} title={t('teacher.historyTitle')} width={560}>
      {q.isLoading && <Spinner />}
      <ol className="space-y-2 text-[13px]">
        {(q.data ?? []).map((h) => (
          <li key={h.id} className="flex flex-wrap items-baseline gap-x-2 border-b border-[var(--w-border)] pb-2 last:border-0">
            <span className="font-medium">{t(`teacher.action_${h.action}` as WKey)}</span>
            <span className="tabular-nums">{h.total ?? '—'}</span>
            <span className="text-[var(--w-text-2)]">{h.actor ? (h.actor.displayName || h.actor.username) : ''} · {fmtDateTime(h.createdAt)}</span>
          </li>
        ))}
      </ol>
    </Dialog>
  );
}

function GradeCard({ g, view, teacher, onEdit, onHistory, pid }: { g: Grade; view: GradesView; teacher: boolean; onEdit: () => void; onHistory: () => void; pid: number }) {
  const { t, fmtDate } = useWT();
  const qc = useQueryClient();
  const who = g.subjectUserId ? view.team.find((m) => m.id === g.subjectUserId)?.name ?? `#${g.subjectUserId}` : t('teacher.wholeTeam');
  const pub = useMutation({
    mutationFn: (published: boolean) => teachingApi.publish(pid, [g.id], published),
    onSuccess: (_r, published) => { toast.success(published ? t('teacher.gradePublished') : t('teacher.gradeUnpublished')); qc.invalidateQueries({ queryKey: teachingKeys.grades(pid) }); },
    onError: (err) => toast.error(workError(err)),
  });
  const del = useMutation({
    mutationFn: () => teachingApi.deleteGrade(pid, g.id),
    onSuccess: () => { toast.success(t('teacher.deleted')); qc.invalidateQueries({ queryKey: teachingKeys.grades(pid) }); },
    onError: (err) => toast.error(workError(err)),
  });
  return (
    <li className="w-card min-w-0 p-4">
      <div className="flex flex-wrap items-start gap-2">
        <div className="min-w-0 flex-1">
          <div className="font-semibold">{g.subjectUserId ? t('teacher.forPerson', { name: who }) : who}</div>
          <div className="text-[12px] text-[var(--w-text-2)]">{g.rubric.name}{g.grader ? ` · ${t('teacher.gradedBy', { name: g.grader.displayName || g.grader.username })}` : ''}{g.publishedAt ? ` · ${fmtDate(g.publishedAt)}` : ''}</div>
        </div>
        <div className="text-right">
          <div className="text-[20px] font-semibold tabular-nums">{g.total ?? '—'}<span className="text-[13px] font-normal text-[var(--w-text-2)]"> / {g.rubric.scaleMax}</span></div>
          {teacher && <span className={cn('rounded-full px-2 py-0.5 text-[11.5px] font-medium', g.publishedAt ? 'bg-[var(--w-sunken)] text-[var(--w-green-text)]' : 'bg-[var(--w-sunken)] text-[var(--w-text-2)]')}>{g.publishedAt ? t('teacher.published') : t('teacher.draft')}</span>}
        </div>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <tbody>
            {g.rubric.criteria.map((c) => (
              <tr key={c.key} className="border-t border-[var(--w-border)] align-top">
                <th scope="row" className="py-1.5 pr-2 text-left font-normal">{c.name} <span className="text-[var(--w-text-2)]">· {c.weight}%</span>{g.notes[c.key] && <div className="text-[12px] text-[var(--w-text-2)]">{g.notes[c.key]}</div>}</th>
                <td className="w-16 py-1.5 text-right tabular-nums">{g.scores[c.key] ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {g.comment && <p className="mt-2 whitespace-pre-wrap text-[13px] leading-relaxed">{g.comment}</p>}
      {teacher && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          <button type="button" className="w-btn w-btn-sm" onClick={onEdit}><Pencil size={13} aria-hidden="true" /><span className="ml-1">{t('teacher.edit')}</span></button>
          <button type="button" className="w-btn w-btn-sm" disabled={pub.isPending} onClick={() => pub.mutate(!g.publishedAt)}>{g.publishedAt ? <EyeOff size={13} aria-hidden="true" /> : <Eye size={13} aria-hidden="true" />}<span className="ml-1">{g.publishedAt ? t('teacher.unpublish') : t('teacher.publish')}</span></button>
          <button type="button" className="w-btn w-btn-sm w-btn-ghost" onClick={onHistory}><History size={13} aria-hidden="true" /><span className="ml-1">{t('teacher.history')}</span></button>
          {!g.publishedAt && <button type="button" className="w-btn w-btn-sm w-btn-ghost w-btn-danger" disabled={del.isPending} onClick={() => del.mutate()}><Trash2 size={13} aria-hidden="true" /><span className="ml-1">{t('teacher.deleteDraft')}</span></button>}
        </div>
      )}
    </li>
  );
}

export default function GradesTab({ pid }: { pid: number }) {
  const { t } = useWT();
  const qc = useQueryClient();
  const q = useQuery({ queryKey: teachingKeys.grades(pid), queryFn: () => teachingApi.grades(pid) });
  const [dialog, setDialog] = useState<{ open: boolean; start: Grade | null }>({ open: false, start: null });
  const [hist, setHist] = useState<Grade | null>(null);
  const byMilestone = useMemo(() => {
    const m = new Map<string, Grade[]>();
    for (const g of q.data?.grades ?? []) m.set(g.milestone, [...(m.get(g.milestone) ?? []), g]);
    return [...m.entries()];
  }, [q.data]);
  const publishAll = useMutation({
    mutationFn: (ids: number[]) => teachingApi.publish(pid, ids, true),
    onSuccess: () => { toast.success(t('teacher.gradePublished')); qc.invalidateQueries({ queryKey: teachingKeys.grades(pid) }); },
    onError: (err) => toast.error(workError(err)),
  });

  if (q.isLoading) return <PageLoading rows={3} />;
  if (q.error || !q.data) return <EmptyState title={t('teacher.gradesTitle')} body={workError(q.error, t('teacher.notAvailBody'))} />;
  const v = q.data;
  const teacher = v.mode === 'teacher';
  return (
    <div className="w-page space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="max-w-[720px] text-[13px] text-[var(--w-text-2)]">{teacher ? t('teacher.teacherHint') : t('teacher.studentHint')}</p>
        {teacher && v.rubrics.length > 0 && <button type="button" data-testid="ctw5-new-grade" className="w-btn w-btn-primary w-btn-sm" onClick={() => setDialog({ open: true, start: null })}><Plus size={14} aria-hidden="true" /><span className="ml-1">{t('teacher.newGrade')}</span></button>}
      </div>
      {teacher && !v.rubrics.length && (
        <EmptyState title={t('teacher.noRubricYet')} action={<Link href="/work/teaching?tab=rubrics" className="w-btn w-btn-primary">{t('teacher.openHub')}</Link>} />
      )}
      {!teacher && v.hiddenDrafts > 0 && <p className="text-[13px]">{t('teacher.hiddenDrafts', { count: v.hiddenDrafts })}</p>}
      {!byMilestone.length && (teacher ? v.rubrics.length > 0 : true) && <EmptyState title={t('teacher.noPublished')} />}
      {byMilestone.map(([m, list]) => {
        const drafts = list.filter((g) => !g.publishedAt).map((g) => g.id);
        return (
          <section key={m} aria-label={m}>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-[15px] font-semibold">{m}</h3>
              {teacher && drafts.length > 0 && <button type="button" className="w-btn w-btn-sm" disabled={publishAll.isPending} onClick={() => publishAll.mutate(drafts)}>{t('teacher.publishAll', { m })}</button>}
            </div>
            <ul className="grid gap-3 lg:grid-cols-2">
              {list.map((g) => <GradeCard key={g.id} g={g} view={v} teacher={teacher} pid={pid} onEdit={() => setDialog({ open: true, start: g })} onHistory={() => setHist(g)} />)}
            </ul>
          </section>
        );
      })}
      {teacher && <GradeDialog pid={pid} view={v} open={dialog.open} start={dialog.start} onClose={() => setDialog({ open: false, start: null })} />}
      <HistoryDialog pid={pid} grade={hist} onClose={() => setHist(null)} />
    </div>
  );
}
