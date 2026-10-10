'use client';

/**
 * ĐIỂM CẮM CỦA 9c — Quiz (Classwork). Khung (ClassShell / ClassworkTab) do 9a sở hữu; hợp đồng: `slots/types.ts`.
 *
 *   Không có `q`   danh sách quiz của lớp (giảng viên: mọi quiz + số đã nộp + điểm TB; sinh viên: quiz đã giao + trạng thái
 *                  của mình) + nút Quiz mới / Ngân hàng câu hỏi (giảng viên).
 *   `q=<id>`       giảng viên ⇒ QuizEditor (câu hỏi & cài đặt · kết quả · thống kê); sinh viên ⇒ QuizStudent (làm bài).
 *   `q=bank`       ngân hàng câu hỏi của lớp (giảng viên).
 * Tham số phụ dùng tiền tố `q` (không đụng `id`/`tab`/`a`/`checkin`).
 */

import { useSearchParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowLeft, ClipboardCheck, Library, Plus } from 'lucide-react';
import { workError } from '@/lib/work-api';
import { EmptyState, PageLoading, Spinner } from '@/components/work/ui';
import { useWT, wt } from '@/components/work/i18n';
import QuestionBank from '../quiz/QuestionBank';
import QuizEditor, { StateChip } from '../quiz/QuizEditor';
import { QuizStudent } from '../quiz/QuizTake';
import { quizApi, quizKeys, type QuizListItem } from '../quiz/quizApi';
import type { ClassSlotProps } from './types';

export default function QuizzesSlot({ cls, goTab }: ClassSlotProps) {
  const { t } = useWT();
  const search = useSearchParams();
  const qParam = search?.get('q') ?? '';
  const qc = useQueryClient();
  const cid = cls.id;
  const list = useQuery({ queryKey: quizKeys.list(cid), queryFn: () => quizApi.list(cid), enabled: !qParam });
  const create = useMutation({
    mutationFn: () => quizApi.create(cid, { title: wt('c9c.untitled') }),
    onSuccess: (q) => { qc.invalidateQueries({ queryKey: quizKeys.list(cid) }); goTab('classwork', { q: String(q.id) }); },
    onError: (err) => toast.error(workError(err)),
  });
  const back = () => goTab('classwork');

  if (qParam === 'bank' && cls.manage) {
    return (
      <section className="space-y-3" aria-labelledby="quiz-bank-h">
        <button type="button" onClick={back} className="inline-flex items-center gap-1 text-[13px] text-[var(--w-text-2)] hover:text-[var(--w-text)]"><ArrowLeft size={14} aria-hidden="true" />{t('c9c.back')}</button>
        <h3 id="quiz-bank-h" className="text-[17px] font-semibold">{t('c9c.bankTitle')}</h3>
        <QuestionBank cid={cid} />
      </section>
    );
  }
  const qid = Number(qParam);
  if (qParam && Number.isInteger(qid) && qid > 0) {
    return cls.manage ? <QuizEditor cid={cid} qid={qid} onBack={back} /> : <QuizStudent cid={cid} qid={qid} onBack={back} />;
  }

  return (
    <section aria-labelledby="quiz-slot-h" data-testid="quiz-slot">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h3 id="quiz-slot-h" className="w-section-title flex items-center gap-1.5"><ClipboardCheck size={15} aria-hidden="true" />{t('c9c.sectionTitle')}</h3>
        {cls.manage && (
          <div className="flex gap-2">
            <button type="button" className="w-btn w-btn-sm" onClick={() => goTab('classwork', { q: 'bank' })} data-testid="quiz-open-bank"><Library size={13} aria-hidden="true" />{t('c9c.bankTitle')}</button>
            <button type="button" className="w-btn w-btn-primary w-btn-sm" onClick={() => create.mutate()} disabled={create.isPending} data-testid="quiz-new">{create.isPending ? <Spinner size={12} /> : <Plus size={13} aria-hidden="true" />}{t('c9c.newQuiz')}</button>
          </div>
        )}
      </div>
      {list.isLoading ? <PageLoading rows={2} /> : list.error ? <EmptyState title={workError(list.error)} /> : !list.data?.quizzes.length ? (
        <EmptyState icon={<ClipboardCheck size={20} />} title={t(cls.manage ? 'c9c.noQuizzesT' : 'c9c.noQuizzesS')} body={t(cls.manage ? 'c9c.noQuizzesTBody' : 'c9c.noQuizzesSBody')} />
      ) : (
        <ul className="divide-y divide-[var(--w-border)] rounded-[8px] border border-[var(--w-border)] bg-[var(--w-panel)]">
          {list.data.quizzes.map((q) => <QuizRow key={q.id} q={q} manage={cls.manage} onOpen={() => goTab('classwork', { q: String(q.id) })} />)}
        </ul>
      )}
    </section>
  );
}

function QuizRow({ q, manage, onOpen }: { q: QuizListItem; manage: boolean; onOpen: () => void }) {
  const { t, fmtDateTime } = useWT();
  const me = q.me;
  return (
    <li>
      <button type="button" onClick={onOpen} className="flex w-full flex-wrap items-center gap-3 px-3 py-2.5 text-left hover:bg-[var(--w-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--w-accent-border)]" data-testid={`quiz-row-${q.id}`}>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]"><ClipboardCheck size={15} aria-hidden="true" /></span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13.5px] font-medium">{q.title}</span>
          <span className="block text-[12px] text-[var(--w-text-2)]">
            {t('c9c.questionsPoints', { n: q.questionCount, p: q.totalPoints })}
            {q.timeLimitMin ? ` · ${t('c9c.minutes', { n: q.timeLimitMin })}` : ''}
            {' · '}{q.closeAt ? t('c9c.closes', { d: fmtDateTime(q.closeAt) }) : t('c9c.noDeadline')}
          </span>
        </span>
        <StateChip state={q.state} />
        {manage ? (
          <span className="w-[150px] text-right text-[12px] tabular-nums text-[var(--w-text-2)]">
            {q.status === 'PUBLISHED' ? t('c9c.submittedOf', { n: q.submittedStudents ?? 0, total: q.students ?? 0 }) : '—'}
            {q.averagePct !== null && q.averagePct !== undefined && <span className="block">{t('c9c.avgPct', { p: q.averagePct })}</span>}
          </span>
        ) : me ? (
          <span className="w-[150px] text-right text-[12px] tabular-nums text-[var(--w-text-2)]">
            {me.score ? <span className="font-semibold text-[var(--w-text)]">{me.score.score} / {me.score.max}</span> : me.canResume ? t('c9c.inProgress') : me.canStart ? t('c9c.notStarted') : '—'}
            <span className="block">{t('c9c.attemptsUsed', { used: me.attemptsUsed, max: q.maxAttempts })}</span>
          </span>
        ) : null}
      </button>
    </li>
  );
}
