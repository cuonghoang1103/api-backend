'use client';

/**
 * CTW đợt 9c — KẾT QUẢ quiz cho giảng viên: mỗi sinh viên một dòng (điểm tính theo cách lấy điểm, từng lượt, số lần rời
 * tab, số câu điền ngắn nên xem lại) ⇒ mở một lượt: câu trả lời, đáp án, điểm tự chấm, CHẤM TAY từng câu (điền ngắn sai
 * chính tả, cho điểm một phần…). Xuất xlsx (điểm + phân tích câu + tổng hợp).
 */

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Download, Eye, MonitorX, TimerOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workError } from '@/lib/work-api';
import { Dialog, EmptyState, PageLoading, Spinner, UserAvatar } from '@/components/work/ui';
import { useWT } from '@/components/work/i18n';
import { TypeChip } from './QuestionBank';
import QuizText from './QuizText';
import { quizApi, quizKeys, type Resp, type TeacherAttempt } from './quizApi';

export default function QuizResults({ cid, qid }: { cid: number; qid: number }) {
  const { t, fmtDateTime } = useWT();
  const res = useQuery({ queryKey: quizKeys.results(cid, qid), queryFn: () => quizApi.results(cid, qid) });
  const [open, setOpen] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  if (res.isLoading) return <PageLoading rows={4} />;
  if (res.error || !res.data) return <EmptyState title={workError(res.error)} />;
  const rows = res.data.rows;
  const started = rows.filter((r) => r.attempts.length).length;
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-[13px] text-[var(--w-text-2)]">{t('c9c.submittedOf', { n: rows.filter((r) => r.counted).length, total: rows.length })} · {t('c9c.startedN', { n: started })}</div>
        <button type="button" className="w-btn w-btn-sm" disabled={busy} onClick={async () => { setBusy(true); try { await quizApi.exportXlsx(cid, qid); } catch (err) { toast.error(workError(err)); } setBusy(false); }}>
          {busy ? <Spinner size={12} /> : <Download size={13} aria-hidden="true" />}{t('c9c.exportXlsx')}
        </button>
      </div>
      {!rows.length ? <EmptyState title={t('c9c.noStudents')} /> : (
        <div className="overflow-x-auto rounded-[8px] border border-[var(--w-border)] bg-[var(--w-panel)]">
          <table className="w-full min-w-[720px] border-collapse text-[13px]" data-testid="quiz-results-table">
            <thead className="bg-[var(--w-sunken)] text-left text-[12px] text-[var(--w-text-2)]">
              <tr>
                <th scope="col" className="px-3 py-2">{t('c9c.student')}</th>
                <th scope="col" className="px-3 py-2">{t('c9c.code')}</th>
                <th scope="col" className="px-3 py-2 text-right">{t('c9c.score')}</th>
                <th scope="col" className="px-3 py-2">{t('c9c.attemptsCol')}</th>
                <th scope="col" className="px-3 py-2 text-right">{t('c9c.tabSwitches')}</th>
                <th scope="col" className="px-3 py-2 text-right">{t('c9c.toReview')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.studentId} className="border-t border-[var(--w-border)] align-top">
                  <td className="px-3 py-2"><span className="inline-flex items-center gap-2"><UserAvatar user={r.user} size={20} />{r.name ?? '—'}</span></td>
                  <td className="px-3 py-2 tabular-nums text-[var(--w-text-2)]">{r.studentCode ?? '—'}</td>
                  <td className="px-3 py-2 text-right font-medium tabular-nums">{r.counted ? `${r.counted.score} / ${r.counted.max}` : <span className="font-normal text-[var(--w-text-3)]">{r.attempts.length ? t('c9c.inProgress') : t('c9c.notStarted')}</span>}</td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1">
                      {r.attempts.map((a) => (
                        <button key={a.id} type="button" className="w-btn w-btn-sm" onClick={() => setOpen(a.id)} title={a.submittedAt ? fmtDateTime(a.submittedAt) : undefined}>
                          <Eye size={12} aria-hidden="true" />#{a.number} {a.status === 'SUBMITTED' ? `${a.score}/${a.maxScore}` : t('c9c.inProgress')}
                          {a.autoSubmitted && <TimerOff size={12} aria-label={t('c9c.autoTag')} className="text-[var(--w-orange-text)]" />}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className={cn('px-3 py-2 text-right tabular-nums', r.attempts.some((a) => a.blurCount > 0) && 'text-[var(--w-orange-text)]')}>{r.attempts.reduce((n, a) => n + a.blurCount, 0)}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{r.needsReview || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <AttemptDialog cid={cid} qid={qid} aid={open} onClose={() => setOpen(null)} />
    </div>
  );
}

export function ResponseText({ item, resp }: { item: TeacherAttempt['items'][number]; resp: Resp | null }) {
  const { t } = useWT();
  if (!resp) return <span className="text-[var(--w-text-3)]">{t('c9c.blank')}</span>;
  if (item.type === 'SINGLE') return <>{item.options?.find((o) => o.id === resp.choice)?.text ?? '—'}</>;
  if (item.type === 'MULTI') return <>{(resp.choices ?? []).map((c) => item.options?.find((o) => o.id === c)?.text).filter(Boolean).join(' · ')}</>;
  if (item.type === 'TRUE_FALSE') return <>{t(resp.value ? 'c9c.trueLabel' : 'c9c.falseLabel')}</>;
  if (item.type === 'SHORT') return <>{resp.text}</>;
  return <>{(item.left ?? []).map((l) => `${l.text} → ${item.right?.find((r) => r.id === resp.pairs?.[l.id])?.text ?? '—'}`).join(' · ')}</>;
}

function AttemptDialog({ cid, qid, aid, onClose }: { cid: number; qid: number; aid: number | null; onClose: () => void }) {
  const { t, fmtDateTime } = useWT();
  const qc = useQueryClient();
  const q = useQuery({ queryKey: quizKeys.attempt(cid, qid, aid ?? 0), queryFn: () => quizApi.attempt(cid, qid, aid!), enabled: !!aid });
  const [edit, setEdit] = useState<Record<string, string>>({});
  const grade = useMutation({
    mutationFn: ({ key, points }: { key: string; points: number | null }) => quizApi.grade(cid, qid, aid!, key, points),
    onSuccess: (r) => {
      toast.success(t('c9c.manualSaved'));
      qc.setQueryData(quizKeys.attempt(cid, qid, aid!), r);
      qc.invalidateQueries({ queryKey: quizKeys.results(cid, qid) });
      qc.invalidateQueries({ queryKey: quizKeys.stats(cid, qid) });
    },
    onError: (err) => toast.error(workError(err)),
  });
  const v = q.data && q.data.manage ? q.data : null;
  const a = v?.attempt;
  return (
    <Dialog open={!!aid} onClose={onClose} width={820} title={v ? `${v.student?.displayName || v.student?.username || ''} · ${t('c9c.attemptN', { n: a?.number ?? '' })}` : t('c9c.attempt')}>
      {q.isLoading ? <PageLoading rows={3} /> : !a ? <EmptyState title={workError(q.error)} /> : (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-[var(--w-text-2)]">
            <span className="font-semibold text-[var(--w-text)]">{a.score ?? '—'} / {a.maxScore}</span>
            <span>{t('c9c.startedAt', { t: fmtDateTime(a.startedAt) })}</span>
            {a.submittedAt && <span>{t('c9c.submittedAt', { t: fmtDateTime(a.submittedAt) })}</span>}
            {a.autoSubmitted && <span className="text-[var(--w-orange-text)]"><TimerOff size={13} aria-hidden="true" className="mr-1 inline" />{t('c9c.autoSubmitted')}</span>}
            <span className={cn(a.blurCount > 0 && 'text-[var(--w-orange-text)]')}><MonitorX size={13} aria-hidden="true" className="mr-1 inline" />{t('c9c.blurN', { n: a.blurCount })}</span>
          </div>
          <ol className="space-y-2">
            {a.items.map((it, i) => {
              const r = it.result;
              const manual = a.manual[it.key];
              return (
                <li key={it.key} className={cn('rounded-[8px] border p-3', r?.correct ? 'border-[var(--w-green)]' : r?.partial ? 'border-[var(--w-yellow)]' : 'border-[var(--w-border)]')}>
                  <div className="mb-1 flex flex-wrap items-center gap-2 text-[12px] text-[var(--w-text-2)]">
                    <span className="font-semibold text-[var(--w-text)]">{i + 1}.</span><TypeChip type={it.type} /><span>{it.topic}</span>
                    <span className="ml-auto font-medium tabular-nums text-[var(--w-text)]">{r ? `${r.earned} / ${r.max}` : `— / ${it.points}`}{manual !== undefined && <span className="ml-1 text-[11px] text-[var(--w-accent-text)]">({t('c9c.manualTag')})</span>}</span>
                  </div>
                  <QuizText text={it.prompt} className="text-[13.5px]" />
                  <div className="mt-1.5 grid gap-1 text-[13px] sm:grid-cols-2">
                    <div><span className="text-[var(--w-text-2)]">{t('c9c.response')}: </span><ResponseText item={it} resp={it.response} /></div>
                    <div className="text-[var(--w-green-text)]"><span className="text-[var(--w-text-2)]">{t('c9c.correctAnswer')}: </span>{answerText(it, t)}</div>
                  </div>
                  {a.status === 'SUBMITTED' && (
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[12.5px]">
                      <label className="flex items-center gap-1.5">{t('c9c.manualPoints')}
                        <input className="w-input h-7 w-[72px] px-1.5" type="number" min={0} max={it.points} step={0.25} value={edit[it.key] ?? (manual ?? r?.earned ?? '').toString()} onChange={(e) => setEdit({ ...edit, [it.key]: e.target.value })} />
                        <span className="text-[var(--w-text-3)]">/ {it.points}</span>
                      </label>
                      <button type="button" className="w-btn w-btn-sm" disabled={grade.isPending || edit[it.key] === undefined || edit[it.key] === ''} onClick={() => grade.mutate({ key: it.key, points: Number(edit[it.key]) })}>{t('c9c.setPoints')}</button>
                      {manual !== undefined && <button type="button" className="w-btn w-btn-ghost w-btn-sm" disabled={grade.isPending} onClick={() => { setEdit((p) => { const n = { ...p }; delete n[it.key]; return n; }); grade.mutate({ key: it.key, points: null }); }}>{t('c9c.clearManual')}</button>}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </Dialog>
  );
}

export function answerText(it: { type: string; options?: Array<{ id: string; text: string }>; left?: Array<{ id: string; text: string }>; right?: Array<{ id: string; text: string }>; answer: { correct?: string[]; value?: boolean; accepted?: string[]; pairs?: Record<string, string> } }, t: (k: 'c9c.trueLabel' | 'c9c.falseLabel') => string): string {
  if (it.type === 'SINGLE' || it.type === 'MULTI') return (it.answer.correct ?? []).map((c) => it.options?.find((o) => o.id === c)?.text).filter(Boolean).join(' · ');
  if (it.type === 'TRUE_FALSE') return t(it.answer.value ? 'c9c.trueLabel' : 'c9c.falseLabel');
  if (it.type === 'SHORT') return (it.answer.accepted ?? []).join(' | ');
  return (it.left ?? []).map((l) => `${l.text} → ${it.right?.find((r) => r.id === it.answer.pairs?.[l.id])?.text ?? ''}`).join(' · ');
}
