'use client';

/**
 * CTW đợt 5 — tab "Rubric" của hub giảng viên: rubric của mình + mẫu (SWP391 lặp M1–M3, SWP391 hội đồng 40%, SEP490 theo
 * Report) dựng từ quy định môn có sẵn trong repo. Trình sửa: tiêu chí (tên, trọng số %, mô tả, mức điểm). Tổng trọng số
 * phải bằng 100 — máy chủ kiểm lại (normalizeCriteria).
 */

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Archive, ClipboardList, Pencil, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workError } from '@/lib/work-api';
import { Dialog, EmptyState, Field, PageLoading, Spinner } from '@/components/work/ui';
import { ConfirmDialog } from '@/components/work/settings/shared';
import { useWT, wt } from '@/components/work/i18n';
import { teachingApi, teachingKeys, type Rubric, type RubricCriterion, type RubricTemplate } from './teachingApi';

type Draft = { name: string; subject: string; description: string; scaleMax: number; criteria: RubricCriterion[] };
const blankCriterion = (i: number): RubricCriterion => ({ key: '', name: `${wt('teacher.criterion')} ${i + 1}`, weight: 0, description: '', levels: [] });

function RubricEditor({ open, onClose, editing }: { open: boolean; onClose: () => void; editing: Rubric | null }) {
  const { t } = useWT();
  const qc = useQueryClient();
  const [d, setD] = useState<Draft>({ name: '', subject: '', description: '', scaleMax: 10, criteria: [] });
  const [seed, setSeed] = useState<number | null | undefined>(undefined);
  const k = open ? editing?.id ?? null : undefined;
  if (k !== seed) {
    setSeed(k);
    setD(editing
      ? { name: editing.name, subject: editing.subject ?? '', description: editing.description ?? '', scaleMax: editing.scaleMax, criteria: editing.criteria.map((c) => ({ ...c, levels: c.levels.map((l) => ({ ...l })) })) }
      : { name: '', subject: '', description: '', scaleMax: 10, criteria: [{ ...blankCriterion(0), weight: 100 }] });
  }
  const total = Math.round(d.criteria.reduce((a, c) => a + (Number(c.weight) || 0), 0) * 100) / 100;
  const setC = (i: number, patch: Partial<RubricCriterion>) => setD((x) => ({ ...x, criteria: x.criteria.map((c, j) => (j === i ? { ...c, ...patch } : c)) }));
  const save = useMutation({
    mutationFn: () => {
      const body = { name: d.name.trim(), subject: d.subject.trim() || null, description: d.description.trim() || null, scaleMax: d.scaleMax, criteria: d.criteria.map((c) => ({ ...c, key: c.key || undefined, weight: Number(c.weight) })) };
      return editing ? teachingApi.updateRubric(editing.id, body) : teachingApi.createRubric(body);
    },
    onSuccess: () => { toast.success(editing ? t('teacher.saved') : t('teacher.created')); qc.invalidateQueries({ queryKey: teachingKeys.rubrics }); onClose(); },
    onError: (err) => toast.error(workError(err)),
  });
  const valid = d.name.trim() && d.criteria.length > 0 && Math.abs(total - 100) < 0.01 && d.criteria.every((c) => c.name.trim());
  return (
    <Dialog open={open} onClose={onClose} title={editing ? t('teacher.editRubric') : t('teacher.newRubric')} width={760}
      footer={<>
        <button type="button" className="w-btn" onClick={onClose}>{t('teacher.cancel')}</button>
        <button type="button" className="w-btn w-btn-primary" disabled={!valid || save.isPending} onClick={() => save.mutate()}>{save.isPending && <Spinner size={13} />}{t('teacher.save')}</button>
      </>}>
      <div className="grid gap-x-3 sm:grid-cols-[1fr_140px_140px]">
        <Field label={t('teacher.name')}><input className="w-input" value={d.name} onChange={(e) => setD({ ...d, name: e.target.value })} maxLength={120} /></Field>
        <Field label={t('teacher.subject')}><input className="w-input" value={d.subject} onChange={(e) => setD({ ...d, subject: e.target.value.toUpperCase() })} maxLength={16} placeholder="SWP391" /></Field>
        <Field label={t('teacher.scaleMax')}><input className="w-input" type="number" min={1} max={100} value={d.scaleMax} disabled={!!editing?.gradeCount} onChange={(e) => setD({ ...d, scaleMax: Number(e.target.value) || 10 })} /></Field>
      </div>
      <Field label={t('teacher.description')}><textarea className="w-input min-h-[56px] py-2" value={d.description} onChange={(e) => setD({ ...d, description: e.target.value })} maxLength={4000} /></Field>
      <div className="mb-2 flex items-center justify-between">
        <div className="w-section-title">{t('teacher.criteria')}</div>
        <span className={cn('text-[12px] tabular-nums', Math.abs(total - 100) < 0.01 ? 'text-[var(--w-green-text)]' : 'text-[var(--w-red-text)]')} aria-live="polite">
          {t('teacher.weightTotal', { n: total })}{Math.abs(total - 100) >= 0.01 && ` — ${t('teacher.weightMustBe100')}`}
        </span>
      </div>
      <div className="space-y-3">
        {d.criteria.map((c, i) => (
          <fieldset key={i} className="rounded-[8px] border border-[var(--w-border)] p-3">
            <legend className="sr-only">{t('teacher.criterion')} {i + 1}</legend>
            <div className="grid gap-2 sm:grid-cols-[1fr_96px_auto]">
              <input className="w-input" aria-label={`${t('teacher.criterion')} ${i + 1}`} value={c.name} onChange={(e) => setC(i, { name: e.target.value })} maxLength={120} />
              <input className="w-input tabular-nums" type="number" min={0} max={100} step={1} aria-label={t('teacher.weight')} value={c.weight} onChange={(e) => setC(i, { weight: Number(e.target.value) })} />
              <button type="button" className="w-btn w-btn-ghost w-btn-icon" aria-label={t('teacher.remove')} disabled={!!editing?.gradeCount || d.criteria.length <= 1} onClick={() => setD((x) => ({ ...x, criteria: x.criteria.filter((_, j) => j !== i) }))}><Trash2 size={14} /></button>
            </div>
            <textarea className="w-input mt-2 min-h-[44px] py-1.5 text-[13px]" aria-label={t('teacher.description')} placeholder={t('teacher.description')} value={c.description} onChange={(e) => setC(i, { description: e.target.value })} maxLength={1000} />
            {c.levels.length > 0 && (
              <div className="mt-2 space-y-1.5">
                {c.levels.map((l, li) => (
                  <div key={li} className="grid grid-cols-[64px_120px_1fr_auto] gap-1.5">
                    <input className="w-input h-8 text-[13px] tabular-nums" type="number" min={0} max={d.scaleMax} step={0.25} aria-label={t('teacher.levelScore')} value={l.score} onChange={(e) => setC(i, { levels: c.levels.map((x, j) => (j === li ? { ...x, score: Number(e.target.value) } : x)) })} />
                    <input className="w-input h-8 text-[13px]" aria-label={t('teacher.levelLabel')} value={l.label} onChange={(e) => setC(i, { levels: c.levels.map((x, j) => (j === li ? { ...x, label: e.target.value } : x)) })} maxLength={60} />
                    <input className="w-input h-8 text-[13px]" aria-label={t('teacher.levelDesc')} value={l.description} onChange={(e) => setC(i, { levels: c.levels.map((x, j) => (j === li ? { ...x, description: e.target.value } : x)) })} maxLength={500} />
                    <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={t('teacher.remove')} onClick={() => setC(i, { levels: c.levels.filter((_, j) => j !== li) })}><Trash2 size={13} /></button>
                  </div>
                ))}
              </div>
            )}
            {c.levels.length < 8 && <button type="button" className="w-btn w-btn-ghost w-btn-sm mt-2" onClick={() => setC(i, { levels: [...c.levels, { score: d.scaleMax, label: '', description: '' }] })}><Plus size={13} aria-hidden="true" /><span className="ml-1">{t('teacher.addLevel')}</span></button>}
          </fieldset>
        ))}
      </div>
      {!editing?.gradeCount && d.criteria.length < 20 && (
        <button type="button" className="w-btn w-btn-sm mt-3" onClick={() => setD((x) => ({ ...x, criteria: [...x.criteria, blankCriterion(x.criteria.length)] }))}><Plus size={13} aria-hidden="true" /><span className="ml-1">{t('teacher.addCriterion')}</span></button>
      )}
    </Dialog>
  );
}

function CriteriaSummary({ criteria }: { criteria: RubricCriterion[] }) {
  return (
    <ul className="mt-2 flex flex-wrap gap-1.5">
      {criteria.map((c) => <li key={c.key || c.name} className="rounded-full bg-[var(--w-sunken)] px-2 py-0.5 text-[12px] text-[var(--w-text-2)]">{c.name} · {c.weight}%</li>)}
    </ul>
  );
}

export default function RubricsPanel() {
  const { t } = useWT();
  const qc = useQueryClient();
  const q = useQuery({ queryKey: teachingKeys.rubrics, queryFn: teachingApi.rubrics });
  const [editor, setEditor] = useState<{ open: boolean; rubric: Rubric | null }>({ open: false, rubric: null });
  const [archiving, setArchiving] = useState<Rubric | null>(null);
  const fromTpl = useMutation({
    mutationFn: (tpl: RubricTemplate) => teachingApi.createRubric({ templateKey: tpl.key }),
    onSuccess: () => { toast.success(t('teacher.created')); qc.invalidateQueries({ queryKey: teachingKeys.rubrics }); },
    onError: (err) => toast.error(workError(err)),
  });
  const archive = useMutation({
    mutationFn: (id: number) => teachingApi.archiveRubric(id),
    onSuccess: () => { toast.success(t('teacher.archived')); setArchiving(null); qc.invalidateQueries({ queryKey: teachingKeys.rubrics }); },
    onError: (err) => toast.error(workError(err)),
  });

  if (q.isLoading) return <PageLoading rows={4} />;
  if (q.error || !q.data) return <EmptyState title={workError(q.error)} />;

  return (
    <div className="w-page space-y-6">
      <section aria-labelledby="rubrics-mine">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 id="rubrics-mine" className="text-[15px] font-semibold">{t('teacher.rubricsTitle')}</h2>
            <p className="text-[13px] text-[var(--w-text-2)]">{t('teacher.rubricsSub')}</p>
          </div>
          <button type="button" className="w-btn w-btn-primary w-btn-sm" onClick={() => setEditor({ open: true, rubric: null })}><Plus size={14} aria-hidden="true" /><span className="ml-1">{t('teacher.blankRubric')}</span></button>
        </div>
        {!q.data.rubrics.length
          ? <div className="rounded-[10px] border border-dashed border-[var(--w-border-strong)] px-4 py-5 text-[13px] text-[var(--w-text-2)]"><div className="font-medium text-[var(--w-text)]">{t('teacher.noRubrics')}</div>{t('teacher.noRubricsBody')}</div>
          : (
            <ul className="grid gap-3 md:grid-cols-2">
              {q.data.rubrics.map((r) => (
                <li key={r.id} className="w-card min-w-0 p-4">
                  <div className="flex items-start gap-2">
                    <ClipboardList size={16} className="mt-0.5 shrink-0 text-[var(--w-text-3)]" aria-hidden="true" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-semibold">{r.name}</div>
                      <div className="text-[12px] text-[var(--w-text-2)]">{[r.subject, `0–${r.scaleMax}`, r.gradeCount ? t('teacher.inUse', { count: r.gradeCount }) : null].filter(Boolean).join(' · ')}</div>
                    </div>
                    <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={`${t('teacher.edit')} ${r.name}`} onClick={() => setEditor({ open: true, rubric: r })}><Pencil size={14} /></button>
                    <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={`${t('teacher.archive')} ${r.name}`} onClick={() => setArchiving(r)}><Archive size={14} /></button>
                  </div>
                  <CriteriaSummary criteria={r.criteria} />
                </li>
              ))}
            </ul>
          )}
      </section>
      <section aria-labelledby="rubrics-templates">
        <h2 id="rubrics-templates" className="mb-3 text-[15px] font-semibold">{t('teacher.templates')}</h2>
        <ul className="grid gap-3 md:grid-cols-3">
          {q.data.templates.map((tpl) => (
            <li key={tpl.key} className="w-card flex min-w-0 flex-col p-4">
              <div className="font-semibold">{tpl.name}</div>
              <p className="mt-1 text-[12.5px] leading-snug text-[var(--w-text-2)]">{tpl.description}</p>
              <CriteriaSummary criteria={tpl.criteria} />
              <div className="mt-2 text-[12px] text-[var(--w-text-2)]"><span className="font-medium">{t('teacher.milestones')}:</span> {tpl.milestones.join(' · ')}</div>
              <div className="mt-auto pt-3">
                <button type="button" className="w-btn w-btn-sm" disabled={fromTpl.isPending} onClick={() => fromTpl.mutate(tpl)}>{t('teacher.useTemplate')}</button>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <RubricEditor open={editor.open} editing={editor.rubric} onClose={() => setEditor({ open: false, rubric: null })} />
      <ConfirmDialog
        open={!!archiving}
        onClose={() => setArchiving(null)}
        title={t('teacher.archive')}
        body={archiving ? t('teacher.archiveConfirm', { name: archiving.name }) : ''}
        confirmLabel={t('teacher.archive')}
        onConfirm={() => archiving && archive.mutate(archiving.id)}
        pending={archive.isPending}
      />
    </div>
  );
}
