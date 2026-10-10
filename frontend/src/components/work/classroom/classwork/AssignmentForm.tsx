'use client';

/**
 * CTW đợt 9b — hộp tạo / sửa bài tập (giảng viên). Mô tả giàu định dạng (RichEditor, JSON TipTap), loại cá nhân/nhóm,
 * điểm, rubric của giảng viên, hạn, loại + chủ đề/tuần, giao cả lớp hoặc một số nhóm/SV, nộp muộn + mức trừ,
 * giao ngay / lên lịch / lưu nháp, tệp đính kèm (tải sau khi lưu — cần id bài).
 * Mọi hook đặt TRƯỚC lệnh return sớm.
 */

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { workError, type TiptapDoc } from '@/lib/work-api';
import RichEditor from '@/components/work/RichEditor';
import { Dialog, Field, Spinner } from '@/components/work/ui';
import { Select } from '@/components/work/settings/shared';
import { useWT } from '@/components/work/i18n';
import { teachingApi, teachingKeys, type ClassDetail } from '@/components/work/teaching/teachingApi';
import {
  classworkApi, classworkKeys, fromLocalInput, toLocalInput, type AssignmentDetail, type AssignmentInput, type AssignmentKind, type ClassFile,
} from '../classworkApi';
import { FileList, UploadButton } from './common';

type Publish = 'NOW' | 'SCHEDULE' | 'DRAFT';

interface FormState {
  title: string; description: TiptapDoc | null; kind: AssignmentKind; maxPoints: string; rubricId: string; dueAt: string; category: string; topic: string;
  target: 'ALL' | 'SOME'; groupIds: number[]; studentIds: number[]; allowLate: boolean; latePenaltyPct: string; latePenaltyMaxPct: string;
  publish: Publish; publishAt: string;
}

function initial(a: AssignmentDetail | null): FormState {
  return {
    title: a?.title ?? '', description: a?.description ?? null, kind: a?.kind ?? 'INDIVIDUAL', maxPoints: String(a?.maxPoints ?? 10),
    rubricId: a?.rubricId ? String(a.rubricId) : '', dueAt: toLocalInput(a?.dueAt), category: a?.category ?? 'Assignment', topic: a?.topic ?? '',
    target: !a || a.targetAll ? 'ALL' : 'SOME', groupIds: a?.targetGroupIds ?? [], studentIds: a?.targetStudentIds ?? [],
    allowLate: a?.allowLate ?? true, latePenaltyPct: String(a?.latePenaltyPct ?? 0), latePenaltyMaxPct: String(a?.latePenaltyMaxPct ?? 100),
    publish: a ? (a.state === 'PUBLISHED' ? 'NOW' : a.state === 'SCHEDULED' ? 'SCHEDULE' : 'DRAFT') : 'NOW', publishAt: toLocalInput(a?.publishAt),
  };
}

export default function AssignmentForm({ open, onClose, cls, assignment, topics, onSaved }: {
  open: boolean; onClose: () => void; cls: ClassDetail; assignment: AssignmentDetail | null; topics: string[]; onSaved: (id: number) => void;
}) {
  const { t } = useWT();
  const qc = useQueryClient();
  const [f, setF] = useState<FormState>(() => initial(assignment));
  const [queued, setQueued] = useState<File[]>([]);
  const [files, setFiles] = useState<ClassFile[]>(assignment?.files ?? []);
  const [removing, setRemoving] = useState<number | null>(null);
  useEffect(() => { if (open) { setF(initial(assignment)); setQueued([]); setFiles(assignment?.files ?? []); } }, [open, assignment]);
  const rubrics = useQuery({ queryKey: teachingKeys.rubrics, queryFn: () => teachingApi.rubrics(), enabled: open, retry: false });
  const published = assignment?.state === 'PUBLISHED';
  const students = useMemo(() => (cls.students ?? []).filter((s) => s.user), [cls.students]);

  const save = useMutation({
    mutationFn: async () => {
      const body: AssignmentInput = {
        title: f.title.trim(), description: f.description, kind: f.kind, maxPoints: Number(f.maxPoints) || 10,
        rubricId: f.rubricId ? Number(f.rubricId) : null, dueAt: fromLocalInput(f.dueAt), category: f.category.trim() || 'Assignment', topic: f.topic.trim() || null,
        targetAll: f.target === 'ALL', targetGroupIds: f.target === 'ALL' ? [] : f.groupIds, targetStudentIds: f.target === 'ALL' || f.kind === 'GROUP' ? [] : f.studentIds,
        allowLate: f.allowLate, latePenaltyPct: Number(f.latePenaltyPct) || 0, latePenaltyMaxPct: Number(f.latePenaltyMaxPct) || 0,
        ...(published ? {} : { publish: f.publish, publishAt: f.publish === 'SCHEDULE' ? fromLocalInput(f.publishAt) : null }),
      };
      const a = assignment ? await classworkApi.update(cls.id, assignment.id, body) : await classworkApi.create(cls.id, body);
      for (const file of queued) {
        try { await classworkApi.uploadAssignmentFile(cls.id, a.id, file); } catch (err) { toast.error(`${file.name}: ${workError(err)}`); }
      }
      return a;
    },
    onSuccess: (a) => {
      toast.success(t(f.publish === 'DRAFT' && !published ? 'c9b.savedDraft' : f.publish === 'SCHEDULE' && !published ? 'c9b.scheduled' : 'c9b.saved'));
      qc.invalidateQueries({ queryKey: classworkKeys.list(cls.id) });
      qc.invalidateQueries({ queryKey: classworkKeys.one(cls.id, a.id) });
      qc.invalidateQueries({ queryKey: classworkKeys.gradebook(cls.id) });
      onSaved(a.id);
    },
    onError: (err) => toast.error(workError(err)),
  });

  const toggle = (list: number[], id: number) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  const valid = f.title.trim() && (f.target === 'ALL' || f.groupIds.length || (f.kind === 'INDIVIDUAL' && f.studentIds.length)) && (f.publish !== 'SCHEDULE' || published || f.publishAt);
  const submitLabel = published ? t('c9b.save') : f.publish === 'NOW' ? t('c9b.assign') : f.publish === 'SCHEDULE' ? t('c9b.schedule') : t('c9b.saveDraft');

  return (
    <Dialog
      open={open} onClose={onClose} width={760} title={assignment ? t('c9b.editTitle') : t('c9b.createTitle')}
      footer={<>
        <button type="button" className="w-btn" onClick={onClose}>{t('c9b.cancel')}</button>
        <button type="button" className="w-btn w-btn-primary" data-testid="cw-save" disabled={!valid || save.isPending} onClick={() => save.mutate()}>
          {save.isPending && <Spinner size={13} />}{submitLabel}
        </button>
      </>}
    >
      <Field label={t('c9b.fTitle')}><input className="w-input" value={f.title} maxLength={200} onChange={(e) => setF({ ...f, title: e.target.value })} data-testid="cw-title" /></Field>
      <Field label={t('c9b.fInstructions')}>
        <div className="rounded-[8px] border border-[var(--w-border)]">
          <RichEditor value={f.description} onChange={(doc, empty) => setF((p) => ({ ...p, description: empty ? null : doc }))} placeholder={t('c9b.fInstructionsPh')} minHeight={110} />
        </div>
      </Field>
      <div className="mb-4 space-y-2">
        <div className="w-label">{t('c9b.fFiles')}</div>
        <FileList classId={cls.id} files={files} removing={removing} onRemove={assignment ? async (file) => {
          setRemoving(file.id);
          try { await classworkApi.removeAssignmentFile(cls.id, assignment.id, file.id); setFiles((x) => x.filter((y) => y.id !== file.id)); } catch (err) { toast.error(workError(err)); }
          setRemoving(null);
        } : undefined} />
        {queued.length > 0 && <ul className="text-[12.5px] text-[var(--w-text-2)]">{queued.map((q, i) => <li key={`${q.name}-${i}`}>· {q.name} <span className="text-[var(--w-text-3)]">({t('c9b.uploadOnSave')})</span></li>)}</ul>}
        <UploadButton onPick={async (file) => { setQueued((q) => [...q, file]); }} />
      </div>

      <div className="grid gap-x-3 sm:grid-cols-3">
        <Field label={t('c9b.fKind')}>
          <Select value={f.kind} disabled={!!assignment && published} onChange={(e) => setF({ ...f, kind: e.target.value as AssignmentKind })}>
            <option value="INDIVIDUAL">{t('c9b.kind_INDIVIDUAL')}</option>
            <option value="GROUP">{t('c9b.kind_GROUP')}</option>
          </Select>
        </Field>
        <Field label={t('c9b.fPoints')}><input className="w-input" type="number" min={1} max={1000} step="0.5" value={f.maxPoints} onChange={(e) => setF({ ...f, maxPoints: e.target.value })} /></Field>
        <Field label={t('c9b.fDue')}><input className="w-input" type="datetime-local" value={f.dueAt} onChange={(e) => setF({ ...f, dueAt: e.target.value })} /></Field>
      </div>
      <div className="grid gap-x-3 sm:grid-cols-3">
        <Field label={t('c9b.fRubric')} hint={rubrics.isError ? t('c9b.rubricNone') : undefined}>
          <Select value={f.rubricId} onChange={(e) => setF({ ...f, rubricId: e.target.value })}>
            <option value="">{t('c9b.noRubric')}</option>
            {(rubrics.data?.rubrics ?? []).map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            {assignment?.rubric && !(rubrics.data?.rubrics ?? []).some((r) => r.id === assignment.rubric!.id) && <option value={assignment.rubric.id}>{assignment.rubric.name}</option>}
          </Select>
        </Field>
        <Field label={t('c9b.fCategory')} hint={t('c9b.fCategoryHint')}><input className="w-input" value={f.category} maxLength={40} list="cw-categories" onChange={(e) => setF({ ...f, category: e.target.value })} /></Field>
        <Field label={t('c9b.fTopic')}><input className="w-input" value={f.topic} maxLength={80} list="cw-topics" placeholder={t('c9b.fTopicPh')} onChange={(e) => setF({ ...f, topic: e.target.value })} /></Field>
        <datalist id="cw-categories">{['Assignment', 'Lab', 'Project', 'Report', 'Presentation'].map((c) => <option key={c} value={c} />)}</datalist>
        <datalist id="cw-topics">{topics.map((c) => <option key={c} value={c} />)}</datalist>
      </div>

      <fieldset className="mb-4">
        <legend className="w-label">{t('c9b.fAssignTo')}</legend>
        <div className="flex flex-wrap gap-4 text-[13px]">
          <label className="flex items-center gap-2"><input type="radio" name="cw-target" className="accent-[var(--w-accent)]" checked={f.target === 'ALL'} onChange={() => setF({ ...f, target: 'ALL' })} />{t('c9b.allStudents')}</label>
          <label className="flex items-center gap-2"><input type="radio" name="cw-target" className="accent-[var(--w-accent)]" checked={f.target === 'SOME'} onChange={() => setF({ ...f, target: 'SOME' })} />{f.kind === 'GROUP' ? t('c9b.someGroups') : t('c9b.someGroupsStudents')}</label>
        </div>
        {f.target === 'SOME' && (
          <div className="mt-2 grid max-h-[220px] gap-3 overflow-y-auto rounded-[8px] border border-[var(--w-border)] p-3 sm:grid-cols-2">
            <div>
              <div className="mb-1 text-[12px] font-medium text-[var(--w-text-2)]">{t('c9b.groups')}</div>
              {cls.groups.length ? cls.groups.map((g) => (
                <label key={g.id} className="flex items-center gap-2 py-0.5 text-[13px]"><input type="checkbox" className="accent-[var(--w-accent)]" checked={f.groupIds.includes(g.id)} onChange={() => setF({ ...f, groupIds: toggle(f.groupIds, g.id) })} />{g.name}</label>
              )) : <p className="text-[12.5px] text-[var(--w-text-3)]">{t('c9b.noGroups')}</p>}
            </div>
            {f.kind === 'INDIVIDUAL' && (
              <div>
                <div className="mb-1 text-[12px] font-medium text-[var(--w-text-2)]">{t('c9b.students')}</div>
                {students.length ? students.map((s) => (
                  <label key={s.id} className="flex items-center gap-2 py-0.5 text-[13px]"><input type="checkbox" className="accent-[var(--w-accent)]" checked={f.studentIds.includes(s.id)} onChange={() => setF({ ...f, studentIds: toggle(f.studentIds, s.id) })} /><span className="truncate">{s.fullName || s.user?.displayName || s.user?.username}{s.studentCode ? ` · ${s.studentCode}` : ''}</span></label>
                )) : <p className="text-[12.5px] text-[var(--w-text-3)]">{t('c9b.noStudents')}</p>}
              </div>
            )}
          </div>
        )}
        {f.kind === 'GROUP' && <p className="mt-1 text-[12px] text-[var(--w-text-3)]">{t('c9b.groupHint')}</p>}
      </fieldset>

      <fieldset className="mb-4">
        <legend className="w-label">{t('c9b.fLate')}</legend>
        <label className="mb-2 flex items-center gap-2 text-[13px]"><input type="checkbox" className="h-4 w-4 accent-[var(--w-accent)]" checked={f.allowLate} onChange={(e) => setF({ ...f, allowLate: e.target.checked })} />{t('c9b.allowLate')}</label>
        {f.allowLate && (
          <div className="grid gap-x-3 sm:grid-cols-2">
            <Field label={t('c9b.penaltyPerDay')}><input className="w-input" type="number" min={0} max={100} value={f.latePenaltyPct} onChange={(e) => setF({ ...f, latePenaltyPct: e.target.value })} /></Field>
            <Field label={t('c9b.penaltyMax')}><input className="w-input" type="number" min={0} max={100} value={f.latePenaltyMaxPct} onChange={(e) => setF({ ...f, latePenaltyMaxPct: e.target.value })} /></Field>
          </div>
        )}
      </fieldset>

      {!published && (
        <fieldset>
          <legend className="w-label">{t('c9b.fPublish')}</legend>
          <div className="flex flex-wrap gap-4 text-[13px]">
            {(['NOW', 'SCHEDULE', 'DRAFT'] as const).map((p) => (
              <label key={p} className="flex items-center gap-2"><input type="radio" name="cw-publish" className="accent-[var(--w-accent)]" checked={f.publish === p} onChange={() => setF({ ...f, publish: p })} />{t(`c9b.publish_${p}`)}</label>
            ))}
          </div>
          {f.publish === 'SCHEDULE' && <div className="mt-2 max-w-[260px]"><Field label={t('c9b.publishAt')}><input className="w-input" type="datetime-local" value={f.publishAt} onChange={(e) => setF({ ...f, publishAt: e.target.value })} /></Field></div>}
        </fieldset>
      )}
    </Dialog>
  );
}
