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
      toast.success(editing ? `${q.key} saved` : `${q.key} added to the Q&A log`);
      qc.invalidateQueries({ queryKey: workCtw4Keys.qna(pid) });
      onClose();
    },
    onError: (err) => toast.error(workError(err, 'Could not save the question')),
  });
  const valid = answerOnly || f.question.trim().length > 0;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={editing ? `${answerOnly ? 'Answer' : 'Edit'} ${editing.key}` : 'Ask a question'}
      width={560}
      footer={(
        <>
          <button type="button" className="w-btn" onClick={onClose}>Cancel</button>
          <button type="submit" form="w-qna-form" className="w-btn w-btn-primary" disabled={!valid || save.isPending}>{save.isPending && <Spinner size={12} />} Save</button>
        </>
      )}
    >
      <form id="w-qna-form" onSubmit={(e) => { e.preventDefault(); if (valid && !save.isPending) save.mutate(); }}>
        {answerOnly ? (
          <p className="mb-4 rounded-[8px] bg-[var(--w-sunken)] p-3 text-[13px]">{editing!.question}</p>
        ) : (
          <>
            <Field label="Question"><input className="w-input" autoFocus maxLength={255} value={f.question} onChange={(e) => set('question', e.target.value)} placeholder="What do you need the lecturer or client to clarify?" /></Field>
            <Field label="Details"><textarea className="w-input !h-auto py-2" rows={3} maxLength={10000} value={f.details} onChange={(e) => set('details', e.target.value)} /></Field>
            <div className="grid gap-x-3 sm:grid-cols-2">
              <Field label="Asked by" hint="Empty = you"><input className="w-input" maxLength={120} value={f.askedBy} onChange={(e) => set('askedBy', e.target.value)} /></Field>
              <Field label="Asked to"><input className="w-input" maxLength={120} value={f.askedTo} onChange={(e) => set('askedTo', e.target.value)} placeholder="e.g. Mr. Dong (lecturer)" /></Field>
              <Field label="Priority">
                <select className="w-input" value={f.priority} onChange={(e) => set('priority', e.target.value as Form['priority'])}>
                  <option value="HIGH">High</option><option value="MEDIUM">Medium</option><option value="LOW">Low</option>
                </select>
              </Field>
              <Field label="Due date"><input type="date" className="w-input" value={f.due} onChange={(e) => set('due', e.target.value)} /></Field>
              {editing && <Field label="Date asked"><input type="date" className="w-input" value={f.askedOn} onChange={(e) => set('askedOn', e.target.value)} /></Field>}
            </div>
          </>
        )}
        {editing && (
          <Field label="Status">
            <select className="w-input" value={f.status} onChange={(e) => set('status', e.target.value as Form['status'])}>
              <option value="OPEN">Open</option><option value="ANSWERED">Answered (Closed)</option><option value="CANCELLED">Cancelled</option>
            </select>
          </Field>
        )}
        <Field label="Answer" hint="Saving an answer on an open question marks it answered.">
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
    onSuccess: (x) => { toast.success(`${x.key} is now a question`); qc.invalidateQueries({ queryKey: workCtw4Keys.qna(pid) }); },
    onError: (err) => toast.error(workError(err, 'Could not convert')),
  });
  const del = useMutation({
    mutationFn: (n: number) => workCtw4Api.deleteQuestion(pid, n),
    onSuccess: () => { toast.success('Question deleted'); qc.invalidateQueries({ queryKey: workCtw4Keys.qna(pid) }); },
    onError: (err) => toast.error(workError(err, 'Could not delete')),
  });

  if (q.isLoading) return <PageLoading />;
  if (!q.data) return <EmptyState title="Could not load the Q&A log" body={q.error ? workError(q.error) : undefined} />;
  const { items, counts } = q.data;
  const canEdit = q.data.canEdit && canEditProject;
  const canAnswer = q.data.canAnswer;

  return (
    <div className="mx-auto w-full max-w-[1200px] p-4">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <p className="mr-auto text-[13px] text-[var(--w-text-2)]">
          Questions for your lecturer or client, with the answers — the Q&A sheet of the Project Tracking file is filled from here.
        </p>
        <div className="flex rounded-[7px] border border-[var(--w-border)] p-0.5" role="group" aria-label="Filter questions">
          {(['all', 'open', 'closed'] as Filter[]).map((x) => (
            <button key={x} type="button" aria-pressed={filter === x} onClick={() => setFilter(x)}
              className={cn('rounded-[5px] px-2.5 py-1 text-[12.5px] capitalize', filter === x ? 'bg-[var(--w-sunken)] font-medium text-[var(--w-text)]' : 'text-[var(--w-text-2)] hover:text-[var(--w-text)]')}>
              {x}
            </button>
          ))}
        </div>
        {canEdit && <button type="button" className="w-btn w-btn-primary w-btn-sm" onClick={() => setDialog({ open: true, editing: null })}><Plus size={13} /> Ask a question</button>}
      </div>
      <div className="mb-3 flex flex-wrap gap-4 text-[12.5px] text-[var(--w-text-2)]">
        <span><b className="tabular-nums text-[var(--w-text)]">{counts.total}</b> questions</span>
        <span><b className="tabular-nums text-[var(--w-text)]">{counts.open}</b> open</span>
        <span className={counts.overdue ? 'text-[var(--w-red-text)]' : ''}><b className="tabular-nums">{counts.overdue}</b> overdue</span>
        {counts.legacy > 0 && <span><b className="tabular-nums text-[var(--w-text)]">{counts.legacy}</b> older entries from the RAID log</span>}
      </div>
      {!items.length ? (
        <EmptyState icon={<MessageCircleQuestion size={28} />} title={filter === 'all' ? 'No questions yet' : `No ${filter} questions`} body="Log every question you send to your lecturer or client, then record the answer — it becomes evidence for requirement decisions." />
      ) : (
        <div className="max-h-[calc(100vh-260px)] overflow-auto rounded-[8px] border border-[var(--w-border)]">
          <table className="w-full min-w-[900px] border-collapse text-[13px]">
            <thead className="sticky top-0 z-[1] bg-[var(--w-panel)]">
              <tr className="border-b border-[var(--w-border)] text-left text-[12px] text-[var(--w-text-2)]">
                {['Date', 'Question', 'By', 'To', 'Priority', 'Due', 'Status', 'Answer', ''].map((h, i) => <th key={i} scope="col" className="px-3 py-2 font-medium">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {items.map((x) => (
                <tr key={x.number} className="border-b border-[var(--w-border)] align-top last:border-0">
                  <td className="whitespace-nowrap px-3 py-2 tabular-nums text-[var(--w-text-2)]">{x.askedOn}</td>
                  <td className="px-3 py-2">
                    <div className="font-medium text-[var(--w-text)]"><span className="mr-1.5 font-mono text-[11.5px] text-[var(--w-text-2)]">{x.key}</span>{x.question}</div>
                    {x.details && <div className="mt-0.5 line-clamp-2 text-[12px] text-[var(--w-text-2)]">{x.details}</div>}
                    {x.legacy && <div className="mt-0.5 text-[11.5px] text-[var(--w-text-2)]">Older entry (RAID log, group “Q&A”)</div>}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">{x.askedBy ?? '—'}</td>
                  <td className="whitespace-nowrap px-3 py-2">{x.askedTo ?? '—'}</td>
                  <td className={cn('px-3 py-2', PRIORITY_TONE[x.priorityText])}>{x.priorityText}</td>
                  <td className={cn('whitespace-nowrap px-3 py-2 tabular-nums', x.overdue ? 'font-medium text-[var(--w-red-text)]' : 'text-[var(--w-text-2)]')}>{x.due ?? '—'}{x.overdue ? ' · overdue' : ''}</td>
                  <td className="px-3 py-2"><span className={cn('rounded-[4px] px-1.5 py-0.5 text-[12px] font-medium', STATUS_TONE[x.statusText])}>{x.statusText}</span></td>
                  <td className="max-w-[320px] px-3 py-2 text-[var(--w-text-2)]"><div className="line-clamp-3 whitespace-pre-wrap">{x.answer ?? '—'}</div></td>
                  <td className="whitespace-nowrap px-2 py-1.5 text-right">
                    {x.legacy ? (
                      canEdit && <button type="button" className="w-btn w-btn-sm" disabled={convert.isPending} onClick={() => convert.mutate(x.number)}>Convert to question</button>
                    ) : (
                      <>
                        {(canEdit || canAnswer) && (
                          <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={canEdit ? `Edit ${x.key}` : `Answer ${x.key}`} title={canEdit ? 'Edit' : 'Answer'} onClick={() => setDialog({ open: true, editing: x })}><Pencil size={13} /></button>
                        )}
                        {canEdit && (
                          <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={`Delete ${x.key}`} title="Delete" disabled={del.isPending}
                            onClick={() => { if (window.confirm(`Delete ${x.key}?`)) del.mutate(x.number); }}><Trash2 size={13} /></button>
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
