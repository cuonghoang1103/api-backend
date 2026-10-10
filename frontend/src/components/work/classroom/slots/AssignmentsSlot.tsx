'use client';

/**
 * ĐIỂM CẮM CỦA 9b — Bài tập (Classwork). Khung (ClassShell / ClassworkTab) do 9a sở hữu. Hợp đồng: `slots/types.ts`.
 *
 *   Danh sách bài theo chủ đề/tuần (GV: + nháp/lên lịch + số đã nộp; SV: trạng thái + điểm ĐÃ TRẢ của mình).
 *   `?a=<id>`  mở một bài: Hướng dẫn (mô tả, tệp, hạn, điểm, rubric) + GV "Bài làm của sinh viên" (`&s=<U..|G..>` mở khung
 *              chấm) / SV "Bài làm của bạn".
 * Mọi hook đặt TRƯỚC lệnh return sớm.
 */

import { useCallback, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowLeft, CalendarClock, ClipboardList, Pencil, Plus, Trash2, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workError } from '@/lib/work-api';
import { RichView } from '@/components/work/RichEditor';
import { EmptyState, PageLoading } from '@/components/work/ui';
import { ConfirmDialog } from '@/components/work/settings/shared';
import { useWT } from '@/components/work/i18n';
import { classworkApi, classworkKeys, type AssignmentDetail, type AssignmentListItem } from '../classworkApi';
import AssignmentForm from '../classwork/AssignmentForm';
import StudentWork from '../classwork/StudentWork';
import TeacherWork from '../classwork/TeacherWork';
import { FileList, StateChip, pts } from '../classwork/common';
import type { ClassSlotProps } from './types';

export default function AssignmentsSlot({ cls }: ClassSlotProps) {
  const router = useRouter();
  const pathname = usePathname() ?? '/work/classes';
  const search = useSearchParams();
  const aid = Number(search?.get('a') ?? '') || null;
  const owner = search?.get('s') ?? null;
  const setParams = useCallback((patch: Record<string, string | null>) => {
    const p = new URLSearchParams(search?.toString() ?? '');
    for (const [k, v] of Object.entries(patch)) { if (v) p.set(k, v); else p.delete(k); }
    router.replace(`${pathname}?${p.toString()}`, { scroll: false });
  }, [router, pathname, search]);

  if (aid) return <AssignmentView cls={cls} aid={aid} owner={owner} onBack={() => setParams({ a: null, s: null })} setOwner={(k) => setParams({ s: k })} />;
  return <AssignmentList cls={cls} onOpen={(id) => setParams({ a: String(id), s: null })} />;
}

function AssignmentList({ cls, onOpen }: { cls: ClassSlotProps['cls']; onOpen: (id: number) => void }) {
  const { t, locale, fmtDateTime } = useWT();
  const [creating, setCreating] = useState(false);
  const q = useQuery({ queryKey: classworkKeys.list(cls.id), queryFn: () => classworkApi.list(cls.id) });
  const groups = useMemo(() => {
    const m = new Map<string, AssignmentListItem[]>();
    for (const a of q.data?.assignments ?? []) { const k = a.topic?.trim() || ''; m.set(k, [...(m.get(k) ?? []), a]); }
    return [...m.entries()];
  }, [q.data]);
  const topics = groups.map(([k]) => k).filter(Boolean);

  return (
    <section aria-labelledby="cw-assignments-h" className="space-y-3" data-testid="cw-assignments">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 id="cw-assignments-h" className="flex items-center gap-1.5 text-[15px] font-semibold"><ClipboardList size={16} aria-hidden="true" />{t('c9b.assignments')}</h3>
        {cls.manage && <button type="button" className="w-btn w-btn-primary" data-testid="cw-create" onClick={() => setCreating(true)}><Plus size={14} />{t('c9b.create')}</button>}
      </div>
      {q.isLoading ? <PageLoading rows={3} /> : q.error ? <p className="text-[13px] text-[var(--w-red-text)]">{workError(q.error)}</p> : !q.data?.assignments.length ? (
        <EmptyState icon={<ClipboardList size={20} />} title={t('c9b.emptyTitle')} body={cls.manage ? t('c9b.emptyBodyTeacher') : t('c9b.emptyBodyStudent')} action={cls.manage ? <button type="button" className="w-btn w-btn-primary" onClick={() => setCreating(true)}><Plus size={14} />{t('c9b.create')}</button> : undefined} />
      ) : (
        <div className="space-y-4">
          {groups.map(([topic, list]) => (
            <div key={topic || '_'}>
              {topic && <h4 className="mb-1.5 border-b border-[var(--w-border)] pb-1 text-[13px] font-semibold text-[var(--w-text-2)]">{topic}</h4>}
              <ul className="divide-y divide-[var(--w-border)] overflow-hidden rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)]">
                {list.map((a) => (
                  <li key={a.id}>
                    <button type="button" onClick={() => onOpen(a.id)} className="flex w-full flex-wrap items-center gap-x-3 gap-y-1 px-3.5 py-2.5 text-left hover:bg-[var(--w-hover)] focus-visible:bg-[var(--w-hover)]" data-testid={`cw-row-${a.id}`}>
                      <ClipboardList size={16} className="shrink-0 text-[var(--w-accent)]" aria-hidden="true" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13.5px] font-medium">{a.title}</span>
                        <span className="block text-[12px] text-[var(--w-text-2)]">
                          {a.dueAt ? t('c9b.dueAt', { at: fmtDateTime(a.dueAt) }) : t('c9b.noDue')} · {t('c9b.pointsN', { n: pts(a.maxPoints, locale) })}
                          {a.kind === 'GROUP' && <> · <Users size={11} className="inline" aria-hidden="true" /> {t('c9b.kind_GROUP')}</>}
                          {a.state === 'SCHEDULED' && a.publishAt && <> · <CalendarClock size={11} className="inline" aria-hidden="true" /> {t('c9b.scheduledFor', { at: fmtDateTime(a.publishAt) })}</>}
                        </span>
                      </span>
                      {cls.manage && a.counts ? (
                        <span className="flex shrink-0 items-center gap-3 text-[12px] text-[var(--w-text-2)]">
                          {a.state !== 'PUBLISHED' && <StateChip state={a.state} />}
                          <span className="tabular-nums"><b className="text-[var(--w-text)]">{a.counts.turnedIn + a.counts.returned}</b> / {a.counts.assigned} {t('c9b.turnedInShort')}</span>
                          {a.counts.missing > 0 && <span className="tabular-nums text-[var(--w-red-text)]">{a.counts.missing} {t('c9b.missingShort')}</span>}
                        </span>
                      ) : a.my ? (
                        <span className="flex shrink-0 items-center gap-2">
                          {a.my.grade?.points !== null && a.my.grade?.points !== undefined && <span className="tabular-nums text-[13px] font-semibold">{pts(a.my.grade.points, locale)}/{pts(a.maxPoints, locale)}</span>}
                          <StateChip state={a.my.state} />
                        </span>
                      ) : null}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      {cls.manage && <AssignmentForm open={creating} onClose={() => setCreating(false)} cls={cls} assignment={null} topics={topics} onSaved={(id) => { setCreating(false); onOpen(id); }} />}
    </section>
  );
}

function AssignmentView({ cls, aid, owner, onBack, setOwner }: { cls: ClassSlotProps['cls']; aid: number; owner: string | null; onBack: () => void; setOwner: (k: string | null) => void }) {
  const { t, locale, fmtDateTime } = useWT();
  const qc = useQueryClient();
  const [tab, setTab] = useState<'instructions' | 'work'>(owner ? 'work' : 'instructions');
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const q = useQuery({ queryKey: classworkKeys.one(cls.id, aid), queryFn: () => classworkApi.get(cls.id, aid) });
  const topics = useMemo(() => [...new Set(((qc.getQueryData(classworkKeys.list(cls.id)) as { assignments?: AssignmentListItem[] } | undefined)?.assignments ?? []).map((x) => x.topic).filter(Boolean) as string[])], [qc, cls.id]);
  const del = useMutation({
    mutationFn: () => classworkApi.remove(cls.id, aid),
    onSuccess: () => { toast.success(t('c9b.deleted')); qc.invalidateQueries({ queryKey: classworkKeys.list(cls.id) }); qc.invalidateQueries({ queryKey: classworkKeys.gradebook(cls.id) }); onBack(); },
    onError: (err) => toast.error(workError(err)),
  });

  const back = <button type="button" onClick={onBack} className="inline-flex items-center gap-1 text-[13px] text-[var(--w-text-2)] hover:text-[var(--w-text)]"><ArrowLeft size={14} aria-hidden="true" />{t('c9b.backToClasswork')}</button>;
  if (q.isLoading) return <div className="space-y-3">{back}<PageLoading rows={4} /></div>;
  if (q.error || !q.data) return <div className="space-y-3">{back}<EmptyState title={workError(q.error)} /></div>;
  const a: AssignmentDetail = q.data;

  const meta = (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] text-[var(--w-text-2)]">
      {a.state !== 'PUBLISHED' && <StateChip state={a.state} />}
      <span>{a.dueAt ? t('c9b.dueAt', { at: fmtDateTime(a.dueAt) }) : t('c9b.noDue')}</span>
      <span>{t('c9b.pointsN', { n: pts(a.maxPoints, locale) })}</span>
      <span>{t(`c9b.kind_${a.kind}`)}</span>
      <span>{a.category}{a.topic ? ` · ${a.topic}` : ''}</span>
      {!a.allowLate ? <span className="text-[var(--w-red-text)]">{t('c9b.lateClosedShort')}</span> : a.latePenaltyPct > 0 ? <span>{t('c9b.latePolicy', { pct: a.latePenaltyPct, max: a.latePenaltyMaxPct })}</span> : null}
      {a.state === 'SCHEDULED' && a.publishAt && <span>{t('c9b.scheduledFor', { at: fmtDateTime(a.publishAt) })}</span>}
    </div>
  );
  const instructions = (
    <div className="space-y-3 rounded-[10px] border border-[var(--w-border)] bg-[var(--w-panel)] p-4">
      {a.description ? <RichView value={a.description} /> : <p className="text-[13px] text-[var(--w-text-3)]">{t('c9b.noInstructions')}</p>}
      <FileList classId={cls.id} files={a.files} />
      {a.rubric && (
        <details className="text-[13px]">
          <summary className="cursor-pointer font-medium">{t('c9b.rubricLabel', { name: a.rubric.name })}</summary>
          <table className="mt-2 w-full border-collapse text-[12.5px]">
            <thead><tr className="text-left text-[var(--w-text-2)]"><th className="py-1 pr-2 font-medium">{t('c9b.criterion')}</th><th className="py-1 pr-2 text-right font-medium">{t('c9b.weight')}</th></tr></thead>
            <tbody>{a.rubric.criteria.map((c) => <tr key={c.key} className="border-t border-[var(--w-border)]"><td className="py-1 pr-2">{c.name}{c.description ? <div className="text-[12px] text-[var(--w-text-3)]">{c.description}</div> : null}</td><td className="py-1 text-right tabular-nums">{c.weight}%</td></tr>)}</tbody>
          </table>
        </details>
      )}
    </div>
  );

  return (
    <div className="space-y-4" data-testid="cw-assignment">
      {back}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[18px] font-semibold tracking-[-0.01em]">{a.title}</h3>
          {meta}
        </div>
        {a.manage && (
          <div className="flex gap-2">
            <button type="button" className="w-btn" onClick={() => setEditing(true)}><Pencil size={14} />{t('c9b.edit')}</button>
            <button type="button" className="w-btn w-btn-ghost w-btn-icon" aria-label={t('c9b.delete')} onClick={() => setDeleting(true)}><Trash2 size={14} /></button>
          </div>
        )}
      </div>
      {a.manage ? (
        <>
          <div role="tablist" aria-label={t('c9b.assignmentSections')} className="flex gap-1 border-b border-[var(--w-border)]">
            {(['instructions', 'work'] as const).map((k) => (
              <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)} data-testid={`cw-tab-${k}`}
                className={cn('-mb-px border-b-2 px-2.5 pb-2 pt-1 text-[13px] font-medium', tab === k ? 'border-[var(--w-accent)]' : 'border-transparent text-[var(--w-text-2)] hover:text-[var(--w-text)]')}>
                {k === 'instructions' ? t('c9b.instructions') : t('c9b.studentWork')}
              </button>
            ))}
          </div>
          <div role="tabpanel">{tab === 'instructions' ? instructions : <TeacherWork classId={cls.id} a={a} owner={owner} setOwner={setOwner} />}</div>
          <AssignmentForm open={editing} onClose={() => setEditing(false)} cls={cls} assignment={a} topics={topics} onSaved={() => setEditing(false)} />
          <ConfirmDialog open={deleting} onClose={() => setDeleting(false)} onConfirm={() => del.mutate()} pending={del.isPending} title={t('c9b.deleteTitle')} body={t('c9b.deleteBody')} confirmLabel={t('c9b.delete')} />
        </>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)]">
          <div className="min-w-0">{instructions}</div>
          <div className="min-w-0"><StudentWork classId={cls.id} a={a} /></div>
        </div>
      )}
    </div>
  );
}
