'use client';

/**
 * CTW đợt 9c — trang MỘT quiz của giảng viên (`?tab=classwork&q=<id>`): ba thẻ
 *   Questions & settings  mục (câu cố định từ ngân hàng + "rút ngẫu nhiên N câu theo chủ đề", điểm ghi đè, sắp xếp),
 *                         giờ mở/đóng, thời gian làm, số lần, trộn, bố cục, khi nào hiện đáp án, cách lấy điểm ⇒ Lưu / Giao
 *   Results               (QuizResults) bảng sinh viên · lượt làm · chấm tay · xuất xlsx
 *   Statistics            (QuizStats) phân bố điểm + phân tích câu
 * Mọi hook đặt TRƯỚC lệnh return sớm.
 */

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AlertTriangle, ArrowDown, ArrowLeft, ArrowUp, Eye, Library, Plus, Send, Shuffle, Trash2, Undo2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workError } from '@/lib/work-api';
import { Dialog, EmptyState, Field, PageLoading, Spinner } from '@/components/work/ui';
import { ConfirmDialog, Select, Switch } from '@/components/work/settings/shared';
import { useWT, type WKey } from '@/components/work/i18n';
import QuestionBank, { answerSummary, TypeChip } from './QuestionBank';
import QuizText from './QuizText';
import QuizResults from './QuizResults';
import QuizStats from './QuizStats';
import { quizApi, quizKeys, type QuizDetailTeacher, type QuizInput, type QuizItem, type QuizLayout, type Scoring, type ShowAnswers } from './quizApi';

type EditorTab = 'setup' | 'results' | 'stats';

const pad = (n: number) => String(n).padStart(2, '0');
export function toLocalInput(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
const fromLocalInput = (v: string) => (v ? new Date(v).toISOString() : null);

function formOf(q: QuizDetailTeacher): Required<Omit<QuizInput, 'items'>> & { items: QuizItem[] } {
  return {
    title: q.title, description: q.description ?? '', topic: q.topic ?? '', items: q.items, openAt: toLocalInput(q.openAt), closeAt: toLocalInput(q.closeAt),
    timeLimitMin: q.timeLimitMin, maxAttempts: q.maxAttempts, shuffleQuestions: q.shuffleQuestions, shuffleOptions: q.shuffleOptions,
    layout: q.layout, showAnswers: q.showAnswers, scoring: q.scoring,
  };
}

export default function QuizEditor({ cid, qid, onBack }: { cid: number; qid: number; onBack: () => void }) {
  const { t, fmtDateTime } = useWT();
  const qc = useQueryClient();
  const [tab, setTab] = useState<EditorTab>('setup');
  const detail = useQuery({ queryKey: quizKeys.quiz(cid, qid), queryFn: () => quizApi.get(cid, qid) });
  const q = detail.data && detail.data.manage ? detail.data : null;
  const [f, setF] = useState<ReturnType<typeof formOf> | null>(null);
  const [dirty, setDirty] = useState(false);
  const [bankOpen, setBankOpen] = useState(false);
  const [drawOpen, setDrawOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => { if (q && !dirty) setF(formOf(q)); }, [q, dirty]);

  const refresh = () => {
    qc.invalidateQueries({ queryKey: quizKeys.quiz(cid, qid) });
    qc.invalidateQueries({ queryKey: quizKeys.list(cid) });
  };
  const save = useMutation({
    mutationFn: () => quizApi.update(cid, qid, {
      ...f!, description: f!.description || null, topic: f!.topic || null, openAt: fromLocalInput(f!.openAt ?? ''), closeAt: fromLocalInput(f!.closeAt ?? ''),
    }),
    onSuccess: (r) => { toast.success(t('c9c.saved')); setDirty(false); qc.setQueryData(quizKeys.quiz(cid, qid), r); refresh(); },
    onError: (err) => toast.error(workError(err)),
  });
  const publish = useMutation({
    mutationFn: async (on: boolean) => { if (dirty) await save.mutateAsync(); return quizApi.publish(cid, qid, on); },
    onSuccess: (r) => { toast.success(t(r.status === 'PUBLISHED' ? 'c9c.published' : 'c9c.unpublished')); qc.setQueryData(quizKeys.quiz(cid, qid), r); refresh(); },
    onError: (err) => toast.error(workError(err)),
  });
  const remove = useMutation({
    mutationFn: () => quizApi.remove(cid, qid),
    onSuccess: () => { toast.success(t('c9c.deleted')); qc.invalidateQueries({ queryKey: quizKeys.list(cid) }); onBack(); },
    onError: (err) => toast.error(workError(err)),
  });

  const questionById = useMemo(() => new Map((q?.questions ?? []).map((x) => [x.id, x])), [q]);
  const pickedIds = useMemo(() => new Set((f?.items ?? []).filter((i): i is Extract<QuizItem, { kind: 'Q' }> => i.kind === 'Q').map((i) => i.questionId)), [f]);

  if (detail.isLoading) return <PageLoading rows={4} />;
  if (detail.error || !q || !f) return <EmptyState title={workError(detail.error)} action={<button type="button" className="w-btn" onClick={onBack}>{t('c9c.back')}</button>} />;

  const set = (patch: Partial<typeof f>) => { setF({ ...f, ...patch }); setDirty(true); };
  const setItems = (items: QuizItem[]) => set({ items });
  const move = (i: number, d: -1 | 1) => { const a = f.items.slice(); const j = i + d; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; setItems(a); };
  const published = q.status === 'PUBLISHED';

  return (
    <div className="space-y-4" data-testid="quiz-editor">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-1 text-[13px] text-[var(--w-text-2)] hover:text-[var(--w-text)]"><ArrowLeft size={14} aria-hidden="true" />{t('c9c.back')}</button>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[12px] text-[var(--w-text-2)]">
            <StateChip state={q.state} />
            <span className="tabular-nums">{t('c9c.questionsPoints', { n: q.questionCount, p: q.totalPoints })}</span>
            {q.closeAt && <span>· {t('c9c.closes', { d: fmtDateTime(q.closeAt) })}</span>}
          </div>
          <h3 className="text-[17px] font-semibold">{q.title}</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="w-btn w-btn-sm" onClick={() => setPreviewOpen(true)} disabled={!q.questionCount}><Eye size={13} aria-hidden="true" />{t('c9c.preview')}</button>
          {published
            ? <button type="button" className="w-btn w-btn-sm" onClick={() => publish.mutate(false)} disabled={publish.isPending || q.attemptCount > 0} title={q.attemptCount ? t('c9c.cannotUnpublish') : undefined}><Undo2 size={13} aria-hidden="true" />{t('c9c.unpublish')}</button>
            : <button type="button" className="w-btn w-btn-primary w-btn-sm" onClick={() => publish.mutate(true)} disabled={publish.isPending} data-testid="quiz-publish">{publish.isPending ? <Spinner size={12} /> : <Send size={13} aria-hidden="true" />}{t('c9c.publish')}</button>}
          <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={t('c9c.delete')} onClick={() => setDeleting(true)}><Trash2 size={14} /></button>
        </div>
      </div>

      <div role="tablist" aria-label={t('c9c.editorTabs')} className="flex gap-1 border-b border-[var(--w-border)]">
        {(['setup', 'results', 'stats'] as const).map((k) => (
          <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)} data-testid={`quiz-tab-${k}`}
            className={cn('-mb-px border-b-2 px-2.5 pb-2 pt-1 text-[13px] font-medium', tab === k ? 'border-[var(--w-accent)] text-[var(--w-text)]' : 'border-transparent text-[var(--w-text-2)] hover:text-[var(--w-text)]')}>
            {t(`c9c.tab_${k}` as WKey)}
          </button>
        ))}
      </div>

      {tab === 'results' && <QuizResults cid={cid} qid={qid} />}
      {tab === 'stats' && <QuizStats cid={cid} qid={qid} />}
      {tab === 'setup' && (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section className="w-card space-y-3 p-4" aria-labelledby="quiz-items-h">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 id="quiz-items-h" className="w-section-title">{t('c9c.itemsTitle')}</h4>
              <div className="flex gap-2">
                <button type="button" className="w-btn w-btn-sm" onClick={() => setDrawOpen(true)}><Shuffle size={13} aria-hidden="true" />{t('c9c.addDraw')}</button>
                <button type="button" className="w-btn w-btn-primary w-btn-sm" onClick={() => setBankOpen(true)} data-testid="quiz-add-from-bank"><Library size={13} aria-hidden="true" />{t('c9c.addFromBank')}</button>
              </div>
            </div>
            {!!q.problems.length && (
              <div role="alert" className="rounded-[8px] border border-[var(--w-orange)] bg-[var(--w-sunken)] px-3 py-2 text-[13px]">
                <div className="mb-1 flex items-center gap-1.5 font-medium text-[var(--w-orange-text)]"><AlertTriangle size={14} aria-hidden="true" />{t('c9c.problemsTitle')}</div>
                <ul className="list-disc pl-5 text-[var(--w-text-2)]">{q.problems.map((p) => <li key={p}>{p}</li>)}</ul>
              </div>
            )}
            {!f.items.length ? <EmptyState title={t('c9c.noItems')} body={t('c9c.noItemsBody')} /> : (
              <ol className="divide-y divide-[var(--w-border)] rounded-[8px] border border-[var(--w-border)]">
                {f.items.map((it, i) => {
                  const bq = it.kind === 'Q' ? questionById.get(it.questionId) : null;
                  return (
                    <li key={it.kind === 'Q' ? `q${it.questionId}` : `d${i}${it.topic}`} className="flex items-start gap-2 px-3 py-2">
                      <span className="mt-0.5 w-5 shrink-0 text-right text-[12px] tabular-nums text-[var(--w-text-3)]">{i + 1}.</span>
                      <div className="min-w-0 flex-1">
                        {it.kind === 'DRAW' ? (
                          <div className="text-[13.5px]"><Shuffle size={13} aria-hidden="true" className="mr-1 inline text-[var(--w-accent)]" />{t('c9c.drawLabel', { n: it.count, topic: it.topic })}</div>
                        ) : bq ? (
                          <>
                            <div className="mb-0.5 flex items-center gap-1.5 text-[12px] text-[var(--w-text-2)]"><TypeChip type={bq.type} />{bq.topic}</div>
                            <QuizText text={bq.prompt} className="text-[13.5px]" />
                            <div className="truncate text-[12px] text-[var(--w-green-text)]">{answerSummary(bq, t)}</div>
                          </>
                        ) : <div className="text-[13px] text-[var(--w-red-text)]">{t('c9c.itemMissing', { id: it.questionId })}</div>}
                      </div>
                      <label className="flex shrink-0 items-center gap-1 text-[12px] text-[var(--w-text-2)]">
                        <span>{t('c9c.pointsOverride')}</span>
                        <input className="w-input h-7 w-[64px] px-1.5" type="number" min={0.25} max={100} step={0.25} value={it.points ?? ''} placeholder={bq ? String(bq.points) : '—'}
                          onChange={(e) => setItems(f.items.map((x, j) => (j === i ? { ...x, points: e.target.value ? Number(e.target.value) : null } : x)))} />
                      </label>
                      <div className="flex shrink-0">
                        <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={t('c9c.moveUp')} disabled={i === 0} onClick={() => move(i, -1)}><ArrowUp size={13} /></button>
                        <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={t('c9c.moveDown')} disabled={i === f.items.length - 1} onClick={() => move(i, 1)}><ArrowDown size={13} /></button>
                        <button type="button" className="w-btn w-btn-ghost w-btn-icon w-btn-sm" aria-label={t('c9c.remove')} onClick={() => setItems(f.items.filter((_, j) => j !== i))}><Trash2 size={13} /></button>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </section>

          <section className="w-card space-y-1 p-4" aria-labelledby="quiz-settings-h">
            <h4 id="quiz-settings-h" className="w-section-title mb-2">{t('c9c.settings')}</h4>
            <Field label={t('c9c.title')}><input className="w-input" value={f.title} maxLength={200} onChange={(e) => set({ title: e.target.value })} data-testid="quiz-title" /></Field>
            <Field label={t('c9c.description')}><textarea className="w-input min-h-[56px] py-2" value={f.description ?? ''} maxLength={8000} onChange={(e) => set({ description: e.target.value })} /></Field>
            <Field label={t('c9c.topic')}><input className="w-input" value={f.topic ?? ''} maxLength={80} onChange={(e) => set({ topic: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-x-2">
              <Field label={t('c9c.openAt')}><input className="w-input" type="datetime-local" value={f.openAt ?? ''} onChange={(e) => set({ openAt: e.target.value })} /></Field>
              <Field label={t('c9c.closeAt')}><input className="w-input" type="datetime-local" value={f.closeAt ?? ''} onChange={(e) => set({ closeAt: e.target.value })} data-testid="quiz-close" /></Field>
              <Field label={t('c9c.timeLimit')} hint={t('c9c.timeLimitHint')}><input className="w-input" type="number" min={1} max={600} value={f.timeLimitMin ?? ''} onChange={(e) => set({ timeLimitMin: e.target.value ? Number(e.target.value) : null })} data-testid="quiz-limit" /></Field>
              <Field label={t('c9c.maxAttempts')}><input className="w-input" type="number" min={1} max={20} value={f.maxAttempts} onChange={(e) => set({ maxAttempts: Math.max(1, Number(e.target.value) || 1) })} /></Field>
            </div>
            <Field label={t('c9c.layout')}>
              <Select value={f.layout} onChange={(e) => set({ layout: e.target.value as QuizLayout })}>
                <option value="ALL">{t('c9c.layout_ALL')}</option><option value="ONE_PER_PAGE">{t('c9c.layout_ONE_PER_PAGE')}</option>
              </Select>
            </Field>
            <Field label={t('c9c.showAnswers')} hint={f.showAnswers === 'IMMEDIATE' && f.maxAttempts > 1 ? t('c9c.immediateWarn') : undefined}>
              <Select value={f.showAnswers} onChange={(e) => set({ showAnswers: e.target.value as ShowAnswers })}>
                {(['IMMEDIATE', 'AFTER_DUE', 'NEVER'] as const).map((k) => <option key={k} value={k}>{t(`c9c.show_${k}` as WKey)}</option>)}
              </Select>
            </Field>
            <Field label={t('c9c.scoring')}>
              <Select value={f.scoring} onChange={(e) => set({ scoring: e.target.value as Scoring })}>
                {(['HIGHEST', 'LAST', 'AVERAGE'] as const).map((k) => <option key={k} value={k}>{t(`c9c.scoring_${k}` as WKey)}</option>)}
              </Select>
            </Field>
            <label className="flex items-center gap-2 py-1 text-[13px]"><Switch checked={f.shuffleQuestions} onChange={(v) => set({ shuffleQuestions: v })} label={t('c9c.shuffleQuestions')} />{t('c9c.shuffleQuestions')}</label>
            <label className="flex items-center gap-2 py-1 text-[13px]"><Switch checked={f.shuffleOptions} onChange={(v) => set({ shuffleOptions: v })} label={t('c9c.shuffleOptions')} />{t('c9c.shuffleOptions')}</label>
            <div className="flex justify-end gap-2 pt-2">
              {dirty && <button type="button" className="w-btn w-btn-sm" onClick={() => { setDirty(false); setF(formOf(q)); }}>{t('c9c.discard')}</button>}
              <button type="button" className="w-btn w-btn-primary w-btn-sm" disabled={!dirty || save.isPending} onClick={() => save.mutate()} data-testid="quiz-save">{save.isPending && <Spinner size={12} />}{t('c9c.save')}</button>
            </div>
          </section>
        </div>
      )}

      <Dialog open={bankOpen} onClose={() => setBankOpen(false)} width={900} title={t('c9c.bankTitle')}>
        <QuestionBank cid={cid} pickedIds={pickedIds} onPick={(bq) => { setItems([...f.items, { kind: 'Q', questionId: bq.id }]); qc.setQueryData(quizKeys.quiz(cid, qid), { ...q, questions: [...q.questions, bq] }); }} />
      </Dialog>
      <DrawDialog open={drawOpen} onClose={() => setDrawOpen(false)} topics={q.topics} onAdd={(topic, count) => setItems([...f.items, { kind: 'DRAW', topic, count }])} />
      <PreviewDialog open={previewOpen} onClose={() => setPreviewOpen(false)} cid={cid} qid={qid} />
      <ConfirmDialog open={deleting} onClose={() => setDeleting(false)} onConfirm={() => remove.mutate()} pending={remove.isPending} title={t('c9c.delete')} body={t('c9c.deleteBody')} confirmLabel={t('c9c.delete')} />
    </div>
  );
}

export function StateChip({ state }: { state: QuizDetailTeacher['state'] }) {
  const { t } = useWT();
  const tone = state === 'OPEN' ? 'text-[var(--w-green-text)]' : state === 'CLOSED' ? 'text-[var(--w-text-2)]' : state === 'SCHEDULED' ? 'text-[var(--w-blue-text)]' : 'text-[var(--w-orange-text)]';
  return <span className={cn('inline-flex h-5 items-center rounded-full bg-[var(--w-sunken)] px-2 text-[11.5px] font-medium', tone)}>{t(`c9c.state_${state}` as WKey)}</span>;
}

function DrawDialog({ open, onClose, topics, onAdd }: { open: boolean; onClose: () => void; topics: Array<{ topic: string; count: number }>; onAdd: (topic: string, count: number) => void }) {
  const { t } = useWT();
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(5);
  useEffect(() => { if (open) { setTopic(topics[0]?.topic ?? ''); setCount(5); } }, [open, topics]);
  const max = topics.find((x) => x.topic === topic)?.count ?? 0;
  return (
    <Dialog open={open} onClose={onClose} width={440} title={t('c9c.addDraw')}
      footer={<>
        <button type="button" className="w-btn" onClick={onClose}>{t('c9c.cancel')}</button>
        <button type="button" className="w-btn w-btn-primary" disabled={!topic || count < 1} onClick={() => { onAdd(topic, count); onClose(); }}><Plus size={13} aria-hidden="true" />{t('c9c.add')}</button>
      </>}>
      <p className="mb-3 text-[13px] text-[var(--w-text-2)]">{t('c9c.drawIntro')}</p>
      {!topics.length ? <p className="text-[13px]">{t('c9c.noTopics')}</p> : (
        <div className="grid grid-cols-[1fr_100px] gap-x-2">
          <Field label={t('c9c.qTopic')}>
            <Select value={topic} onChange={(e) => setTopic(e.target.value)}>{topics.map((x) => <option key={x.topic} value={x.topic}>{x.topic} ({x.count})</option>)}</Select>
          </Field>
          <Field label={t('c9c.aiCount')} hint={t('c9c.ofN', { n: max })}><input className="w-input" type="number" min={1} max={200} value={count} onChange={(e) => setCount(Math.max(1, Number(e.target.value) || 1))} /></Field>
        </div>
      )}
    </Dialog>
  );
}

function PreviewDialog({ open, onClose, cid, qid }: { open: boolean; onClose: () => void; cid: number; qid: number }) {
  const { t } = useWT();
  const pv = useQuery({ queryKey: [...quizKeys.quiz(cid, qid), 'preview', open], queryFn: () => quizApi.preview(cid, qid), enabled: open, staleTime: 0 });
  return (
    <Dialog open={open} onClose={onClose} width={760} title={t('c9c.previewTitle')}
      footer={<button type="button" className="w-btn" onClick={() => pv.refetch()}><Shuffle size={13} aria-hidden="true" />{t('c9c.anotherVersion')}</button>}>
      {pv.isLoading ? <PageLoading rows={3} /> : pv.error ? <EmptyState title={workError(pv.error)} /> : (
        <ol className="space-y-3">
          {(pv.data?.paper ?? []).map((p, i) => (
            <li key={p.key} className="rounded-[8px] border border-[var(--w-border)] p-3">
              <div className="mb-1 flex items-center gap-2 text-[12px] text-[var(--w-text-2)]"><span className="font-semibold text-[var(--w-text)]">{i + 1}.</span><TypeChip type={p.type} /><span>{t('c9c.pts', { n: p.points })}</span></div>
              <QuizText text={p.prompt} />
              {p.options && <ul className="mt-1 space-y-0.5 text-[13px]">{p.options.map((o) => <li key={o.id} className={cn(p.answer.correct?.includes(o.id) && 'font-medium text-[var(--w-green-text)]')}>{p.answer.correct?.includes(o.id) ? '✓ ' : '○ '}<QuizText text={o.text} inline /></li>)}</ul>}
              {p.type === 'TRUE_FALSE' && <div className="mt-1 text-[13px] text-[var(--w-green-text)]">✓ {t(p.answer.value ? 'c9c.trueLabel' : 'c9c.falseLabel')}</div>}
              {p.type === 'SHORT' && <div className="mt-1 text-[13px] text-[var(--w-green-text)]">✓ {(p.answer.accepted ?? []).join(' | ')}</div>}
              {p.left && <ul className="mt-1 text-[13px]">{p.left.map((l) => <li key={l.id}>{l.text} → <span className="text-[var(--w-green-text)]">{p.right?.find((r) => r.id === p.answer.pairs?.[l.id])?.text}</span></li>)}</ul>}
              {p.explanation && <div className="mt-1.5 border-l-2 border-[var(--w-border-strong)] pl-2 text-[12.5px] text-[var(--w-text-2)]"><QuizText text={p.explanation} /></div>}
            </li>
          ))}
        </ol>
      )}
    </Dialog>
  );
}
