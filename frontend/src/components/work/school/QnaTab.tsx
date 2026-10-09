'use client';

/**
 * CTW đợt 4 (A22) — Q&A log: câu hỏi làm rõ yêu cầu với giảng viên / khách. Đúng cột sheet Q&A của Report2_Project
 * Tracking (Date · Question · By · To · Priority · Due Date · Status · Notes/answer). Dòng RAID cũ nhóm "Q&A" (trước
 * đợt 4) vẫn hiện, đánh dấu "Older entry", có nút chuyển thành câu hỏi thật. Giảng viên chỉ trả lời.
 */

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { MessageCircleQuestion, Pencil, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workError } from '@/lib/work-api';
import { workCtw4Api, workCtw4Keys, type QuestionInput, type QuestionView } from '@/lib/work-ctw4-api';
import { Dialog, EmptyState, Field, PageLoading, Spinner } from '../ui';
import { wt } from '@/components/work/i18n';

type Filter = 'open' | 'closed' | 'all';
const STATUS_TONE: Record<string, string> = {
  Open: 'bg-[var(--w-accent-soft,var(--w-sunken))] text-[var(--w-accent-text)]',
  Closed: 'bg-[var(--w-sunken)] text-[var(--w-green-text)]',
  Cancelled: 'bg-[var(--w-sunken)] text-[var(--w-text-2)]',
};
const PRIORITY_TONE: Record<string, string> = { High: 'text-[var(--w-red-text)]', Medium: 'text-[var(--w-text)]', Low: 'text-[var(--w-text-2)]' };

interface Form { question: string; details: string; askedBy: string; askedTo: string; priority: 'LOW' | 'MEDIUM' | 'HIGH'; due: string; status: 'OPEN' | 'ANSWERED' | 'CANCELLED'; answer: string; askedOn: string }
const empty = (): Form => ({ question: '', details: '', askedBy: '', askedTo: '', priority: 'MEDIUM', due: '', status: 'OPEN', answer: '', askedOn: '' });
const toForm = (q: QuestionView): Form => ({
  question: q.question, details: q.details ?? '', askedBy: q.askedBy ?? '', askedTo: q.askedTo ?? '', priority: q.priority, due: q.due ?? '',
  status: (['OPEN', 'ANSWERED', 'CANCELLED'].includes(q.status) ? q.status : 'OPEN') as Form['status'], answer: q.answer ?? '', askedOn: q.askedOn,
});

function QuestionDialog({ pid, open, onClose, editing, canEdit }: { pid: number; open: boolean; onClose: () => void; editing: QuestionView | null; canEdit: boolean }) {
  const qc = useQueryClient();
  const [f, setF] = useState<Form>(empty());
  const [seed, setSeed] = useState<number | null | undefined>(undefined);
  const key = open ? editing?.number ?? null : undefined;
  if (key !== seed) { setSeed(key); setF(editing ? toForm(editing) : empty()); }
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((x) => ({ ...x, [k]: v }));
  const answerOnly = !!editing && !canEdit;
  const save = useMutation({
    mutationFn: () => {
      if (answerOnly) return workCtw4Api.updateQuestion(pid, editing!.number, { answer: f.answer.trim() || null, status: f.status, version: editing!.version });
      const body: QuestionInput & { question: string } = {
        question: f.question.trim(), details: f.details.trim() || null, askedBy: f.askedBy.trim() || null, askedTo: f.askedTo.trim() || null,
        priority: f.priority, due: f.due || null, answer: f.answer.trim() || null, ...(f.askedOn ? { askedOn: f.askedOn } : {}),
      };
      return editing ? workCtw4Api.updateQuestion(pid, editing.number, { ...body, status: f.status, version: editing.version }) : workCtw4Api.createQuestion(pid, body);
    },
    onSuccess: (q) => {
      toast.success(editing ? wt('school.qSaved', { key: q.key }) : wt('school.qAdded', { key: q.key }));
      qc.invalidateQueries({ queryKey: workCtw4Keys.qna(pid) });
      onClose();
    },
    onError: (err) => toast.error(workError(err, wt('school.qSaveFailed'))),
  });
  const valid = answerOnly || f.question.trim().length > 0;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={editing ? `${answerOnly ? wt('school.answer') : wt('common.edit')} ${editing.key}` : wt('school.askQ')}
      width={560}
      footer={(
        <>
          <button type="button" className="w-btn" onClick={onClose}>{wt('common.cancel')}</button>
          <button type="submit" form="w-qna-form" className="w-btn w-btn-primary" disabled={!valid || save.isPending}>{save.isPending && <Spinner size={12} />} {wt('common.save')}</button>
        </>
      )}
    >
      <form id="w-qna-form" onSubmit={(e) => { e.preventDefault(); if (valid && !save.isPending) save.mutate(); }}>
        {answerOnly ? (
          <p className="mb-4 rounded-[8px] bg-[var(--w-sunken)] p-3 text-[13px]">{editing!.question}</p>
        ) : (
          <>
            <Field label={wt('school.question')}><input className="w-input" autoFocus maxLength={255} value={f.question} onChange={(e) => set('question', e.target.value)} placeholder={wt('school.questionPh')} /></Field>
            <Field label={wt('common.details')}><textarea className="w-input !h-auto py-2" rows={3} maxLength={10000} value={f.details} onChange={(e) => set('details', e.target.value)} /></Field>
            <div className="grid gap-x-3 sm:grid-cols-2">
              <Field label={wt('school.askedBy')} hint={wt('school.emptyYou')}><input className="w-input" maxLength={120} value={f.askedBy} onChange={(e) => set('askedBy', e.target.value)} /></Field>
              <Field label={wt('school.askedTo')}><input className="w-input" maxLength={120} value={f.askedTo} onChange={(e) => set('askedTo', e.target.value)} placeholder={wt('school.askedToPh')} /></Field>
              <Field label={wt('common.priority')}>
                <select className="w-input" value={f.priority} onChange={(e) => set('priority', e.target.value as Form['priority'])}>
                  <option value="HIGH">{wt('status.prioHigh')}</option><option value="MEDIUM">{wt('status.prioMedium')}</option><option value="LOW">{wt('status.prioLow')}</option>
                </select>
              </Field>
              <Field label={wt('common.dueDate')}><input type="date" className="w-input" value={f.due} onChange={(e) => set('due', e.target.value)} /></Field>
              {editing && <Field label={wt('school.dateAsked')}><input type="date" className="w-input" value={f.askedOn} onChange={(e) => set('askedOn', e.target.value)} /></Field>}
            </div>
          </>
        )}
        {editing && (
          <Field label={wt('common.status')}>
            <select className="w-input" value={f.status} onChange={(e) => set('status', e.target.value as Form['status'])}>
              <option value="OPEN">{wt('school.qOpen')}</option><option value="ANSWERED">{wt('school.qAnswered')}</option><option value="CANCELLED">{wt('school.qCancelled')}</option>
            </select>
          </Field>
        )}
        <Field label={wt('school.answer')} hint={wt('school.answerHint')}>
          <textarea className="w-input !h-auto py-2" rows={4} maxLength={20000} value={f.answer} onChange={(e) => set('answer', e.target.value)} />
        </Field>
      </form>
    </Dialog>
  );
}

export default function QnaTab({ pid, canEdit: canEditProject }: { pid: number; canEdit: boolean }) {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<Filter>('all');
  const [dialog, setDialog] = useState<{ open: boolean; editing: QuestionView | null }>({ open: false, editing: null });
  const q = useQuery({ queryKey: [...workCtw4Keys.qna(pid), filter], queryFn: () => workCtw4Api.qna(pid, filter) });
  const convert = useMutation({
    mutationFn: (n: number) => workCtw4Api.convertQuestion(pid, n),
    onSuccess: (x) => { toast.success(wt('school.converted', { key: x.key })); qc.invalidateQueries({ queryKey: workCtw4Keys.qna(pid) }); },
    onError: (err) => toast.error(workError(err, wt('school.convertFailed'))),
  });
  const del = useMutation({
    mutationFn: (n: number) => workCtw4Api.deleteQuestion(pid, n),
    onSuccess: () => { toast.success(wt('school.qDeleted')); qc.invalidateQueries({ queryKey: workCtw4Keys.qna(pid) }); },
    onError: (err) => toast.error(workError(err, wt('common.couldNotDelete'))),
  });

  if (q.isLoading) return <PageLoading />;
  if (!q.data) return <EmptyState title={wt('school.qLoadFailed')} body={q.error ? workError(q.error) : undefined} />;
  const { items, counts } = q.data;
  const canEdit = q.data.canEdit && canEditProject;
  const canAnswer = q.data.canAnswer;

  return (
    <div className="mx-auto w-full max-w-[1200px] p-4">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <p className="mr-auto text-[13px] text-[var(--w-text-2)]">
          {wt('school.qIntro')}
        </p>
        <div className="flex rounded-[7px] border border-[var(--w-border)] p-0.5" role="group" aria-label={wt('school.filterQ')}>
          {(['all', 'open', 'closed'] as Filter[]).map((x) => (
            <button key={x} type="button" aria-pressed={filter === x} onClick={() => setFilter(x)}
              className={cn('rounded-[5px] px-2.5 py-1 text-[12.5px] capitalize', filter === x ? 'bg-[var(--w-sunken)] font-medium text-[var(--w-text)]' : 'text-[var(--w-text-2)] hover:text-[var(--w-text)]')}>
              {x === 'all' ? wt('common.all') : x === 'open' ? wt('school.fOpen') : wt('school.fClosed')}
            </button>
          ))}
        </div>
        {canEdit && <button type="button" className="w-btn w-btn-primary w-btn-sm" onClick={() => setDialog({ open: true, editing: null })}><Plus size={13} /> {wt('school.askQ')}</button>}
      </div>
      <div className="mb-3 flex flex-wrap gap-4 text-[12.5px] text-[var(--w-text-2)]">
        <span><b className="tabular-nums text-[var(--w-text)]">{counts.total}</b> {wt('school.questions')}</span>
        <span><b className="tabular-nums text-[var(--w-text)]">{counts.open}</b> {wt('school.fOpen')}</span>
        <span className={counts.overdue ? 'text-[var(--w-red-text)]' : ''}><b className="tabular-nums">{counts.overdue}</b> {wt('school.overdueLower')}</span>
        {counts.legacy > 0 && <span><b className="tabular-nums text-[var(--w-text)]">{counts.legacy}</b> {wt('school.legacyN')}</span>}
      </div>
      {!items.length ? (
        <EmptyState icon={<MessageCircleQuestion size={28} />} title={filter === 'all' ? wt('school.noQ') : filter === 'open' ? wt('school.noOpenQ') : wt('school.noClosedQ')} body={wt('school.noQBody')} />
      ) : (
        <div className="max-h-[calc(100vh-260px)] overflow-auto rounded-[8px] border border-[var(--w-border)]">
          <table className="w-full min-w-[900px] border-collapse text-[13px]">
            <thead className="sticky top-0 z-[1] bg-[var(--w-panel)]">
              <tr className="border-b border-[var(--w-border)] text-left text-[12px] text-[var(--w-text-2)]">
                {[wt('common.day'), wt('school.question'), wt('school.by'), wt('school.to'), wt('common.priority'), wt('school.due'), wt('common.status'), wt('school.answer'), ''].map((h, i) => <th key={i} scope="col" className="px-3 py-2 font-medium">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {items.map((x) => (
                <tr key={x.number} className="border-b border-[var(--w-border)] align-top last:border-0">
                  <td className="whitespace-nowrap px-3 py-2 tabular-nums text-[var(--w-text-2)]">{x.askedOn}</td>
                  <td className="px-3 py-2">
                    <div className="font-medium text-[var(--w-text)]"><span className="mr-1.5 font-mono text-[11.5px] text-[var(--w-text-2)]">{x.key}</span>{x.question}</div>
                    {x.details && <div className="mt-0.5 line-clamp-2 text-[12px] text-[var(--w-text-2)]">{x.details}</div>}
                    {x.legacy && <div className="mt-0.5 text-[11.5px] text-[var(--w-text-2)]">{wt('school.olderEntry')}</div>}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">{x.askedBy ?? '—'}</td>
                  <td className="whitespace-nowrap px-3 py-2">{x.askedTo ?? '—'}</td>
                  <td className={cn('px-3 py-2', PRIORITY_TONE[x.priorityText])}>{x.priorityText}</td>
                  <td className={cn('whitespace-nowrap px-3 py-2 tabular-nums', x.overdue ? 'font-medium text-[var(--w-red-text)]' : 'text-[var(--w-text-2)]')}>{x.due ?? '—'}{x.overdue ? ` · ${wt('school.overdueLower')}` : ''}</td>
                  <td className="px-3 py-2"><span className={cn('rounded-[4px] px-1.5 py-0.5 text-[12px] font-medium', STATUS_TONE[x.statusText])}>{x.statusText}</span></td>
                  <td className="max-w-[320px] px-3 py-2 text-[var(--w-text-2)]"><div className="line-clamp-3 whitespace-pre-wrap">{x.answer ?? '—'}</div></td>
                  <td className="whitespace-nowrap px-2 py-1.5 text-right">
                    {x.legacy ? (
                      canEdit && <button type="button" className="w-btn w-btn-sm" disabled={convert.isPending} onClick={() => convert.mutate(x.number)}>{wt('school.convert')}</button>
                    ) : (
                      <>
                        {(canEdit || canAnswer) && (
                          <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={`${canEdit ? wt('common.edit') : wt('school.answer')} ${x.key}`} title={canEdit ? wt('common.edit') : wt('school.answer')} onClick={() => setDialog({ open: true, editing: x })}><Pencil size={13} /></button>
                        )}
                        {canEdit && (
                          <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={`${wt('common.delete')} ${x.key}`} title={wt('common.delete')} disabled={del.isPending}
                            onClick={() => { if (window.confirm(wt('releases.deleteQ', { name: x.key }))) del.mutate(x.number); }}><Trash2 size={13} /></button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <QuestionDialog pid={pid} open={dialog.open} editing={dialog.editing} canEdit={canEdit} onClose={() => setDialog({ open: false, editing: null })} />
    </div>
  );
}
