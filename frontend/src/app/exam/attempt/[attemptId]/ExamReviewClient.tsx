'use client';

/**
 * Exam result & review. Score ring + pass/fail, then per-question breakdown:
 *   FE  → each option marked correct/wrong/missed + bilingual explanation.
 *   PE  → AI grade (verdict, per-criterion scores, bilingual summary &
 *         suggestions) + revealed reference solution / expected output.
 * EN/VN toggle applies everywhere via pickLang + data-ml.
 */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ArrowLeft as ArrowLeftIcon, CheckCircle2 as CheckCircleIcon, XCircle as XCircleIcon, Clock as ClockIcon, RotateCw as ArrowPathIcon } from 'lucide-react';
import { examApi } from '@/lib/api';
import { useTranslation } from '@/context/LocaleContext';
import { pickLang, sanitizeHtml, stripInlineColors } from '@/lib/utils';
import './../../exam.css';

interface ReviewQuestion {
  id: number; kind: string; sortOrder: number; points: number; prompt: string; imageUrl: string | null;
  options: { text: string }[] | null; correctIndexes: number[]; explanation: string | null;
  language: string | null; starterCode: string | null; sampleSolution: string | null;
  expectedOutput: string | null; rubric: unknown; speakingPrompts: { text: string }[] | null;
  myAnswer: unknown;
}
interface PeGrade {
  score: number; maxScore: number; percent: number; verdict: string; summary: string;
  criteria: { id: string; name: string; score: number; maxScore: number; comment: string }[];
  suggestions: string[]; transcript?: string;
}
interface ReviewData {
  attempt: { id: number; examId: number; status: string; submittedAt: string | null; timeSpentSeconds: number; score: number | null; maxScore: number | null; passed: boolean | null; gradingMode: string; feedback: Record<string, unknown> };
  exam: { id: number; kind: string; peType: string | null; title: string; code: string | null; courseId: number; totalPoints: number; passMark: number };
  questions: ReviewQuestion[];
}

export default function ExamReviewClient({ attemptId }: { attemptId: number }) {
  const router = useRouter();
  const { locale, setLocale } = useTranslation();
  const L = locale === 'vi' ? 'vi' : 'en';
  const isVi = L === 'vi';
  const [data, setData] = useState<ReviewData | null>(null);

  useEffect(() => {
    let alive = true;
    examApi.getAttempt(attemptId)
      .then((r) => { if (alive) setData(r.data.data); })
      .catch((e) => { toast.error(e?.response?.data?.message || 'Không tải được kết quả'); router.push('/exam'); });
    return () => { alive = false; };
  }, [attemptId, router]);

  if (!data) return <div className="min-h-[60vh] flex items-center justify-center text-text-muted">{isVi ? 'Đang tải…' : 'Loading…'}</div>;

  const { attempt, exam, questions } = data;
  const score = attempt.score ?? 0;
  const max = attempt.maxScore ?? exam.totalPoints;
  const pct = max ? Math.round((score / max) * 100) : 0;
  const passed = attempt.passed === true;
  const ringCol = passed ? 'var(--exam-ok)' : 'var(--exam-danger)';
  const pePerQ = ((attempt.feedback?.perQuestion as { questionId: number; grade: PeGrade }[]) || []);
  const feGrade = attempt.feedback as { correctCount?: number; total?: number };

  const mins = Math.floor(attempt.timeSpentSeconds / 60);
  const secs = attempt.timeSpentSeconds % 60;

  return (
    <div className="exam-root min-h-screen" data-ml={L}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => router.push('/exam')} className="text-sm text-text-secondary hover:text-text-primary flex items-center gap-1"><ArrowLeftIcon className="w-4 h-4" />{isVi ? 'Phòng thi' : 'Exam Room'}</button>
          <button onClick={() => setLocale(isVi ? 'en' : 'vi')} className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-[var(--border-color)] hover:border-[var(--exam-accent)]">{isVi ? 'EN' : 'VI'}</button>
        </div>

        {/* Score card */}
        <div className="exam-card p-6 sm:p-8 mb-6 flex flex-col sm:flex-row items-center gap-6">
          <div className="exam-ring" style={{ ['--p' as string]: pct, ['--ring-col' as string]: ringCol }}>
            <div className="exam-ring-hole">
              <div className="text-3xl font-bold exam-timer" style={{ color: ringCol }}>{score}</div>
              <div className="text-xs text-text-muted">/ {max}</div>
            </div>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
              <span className={`exam-badge ${passed ? 'exam-badge-pass' : 'exam-badge-fail'}`}>
                {passed ? <CheckCircleIcon className="w-4 h-4" /> : <XCircleIcon className="w-4 h-4" />}
                {passed ? (isVi ? 'ĐẠT' : 'PASSED') : (isVi ? 'CHƯA ĐẠT' : 'NOT PASSED')}
              </span>
              {exam.code && <span className="exam-badge" style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>{exam.code}</span>}
            </div>
            <h1 className="text-xl font-bold mb-1">{pickLang(exam.title, L)}</h1>
            <div className="text-sm text-text-secondary flex items-center justify-center sm:justify-start gap-3 flex-wrap">
              <span>{isVi ? 'Điểm đạt' : 'Pass'}: ≥ {exam.passMark}</span>
              <span className="flex items-center gap-1"><ClockIcon className="w-4 h-4" />{mins}:{String(secs).padStart(2, '0')}</span>
              {exam.kind === 'FE' && feGrade.correctCount != null && <span>{feGrade.correctCount}/{feGrade.total} {isVi ? 'câu đúng' : 'correct'}</span>}
            </div>
            <button onClick={() => router.push(`/exam/${exam.id}`)} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--exam-accent)]"><ArrowPathIcon className="w-4 h-4" />{isVi ? 'Thi lại' : 'Retake'}</button>
          </div>
        </div>

        {/* Per-question review */}
        <div className="space-y-4">
          {questions.map((q, i) => {
            const grade = pePerQ.find((p) => p.questionId === q.id)?.grade;
            return (
              <div key={q.id} className="exam-card p-5">
                <div className="text-sm font-semibold text-text-secondary mb-3">{isVi ? 'Câu' : 'Question'} {i + 1} · {q.points}đ</div>
                <div className="text-[15px] leading-relaxed mb-3"><div className="rich-content max-w-none" data-ml={L} dangerouslySetInnerHTML={{ __html: sanitizeHtml(stripInlineColors(pickLang(q.prompt, L))) }} /></div>
                {q.imageUrl && <img src={q.imageUrl} alt="" className="max-w-full rounded-lg border border-[var(--border-color)] mb-3" />}

                {/* FE options */}
                {q.kind === 'MCQ' && (
                  <div className="space-y-2">
                    {(q.options || []).map((o, oi) => {
                      const my = Array.isArray(q.myAnswer) ? (q.myAnswer as number[]) : [];
                      const isCorrect = q.correctIndexes.includes(oi);
                      const chosen = my.includes(oi);
                      const state = isCorrect && chosen ? 'correct' : chosen && !isCorrect ? 'wrong' : isCorrect ? 'missed' : undefined;
                      const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
                      return (
                        <div key={oi} className="exam-opt" data-state={state} style={{ cursor: 'default' }}>
                          <span className="exam-opt-mark">{letters[oi]}</span>
                          <span className="pt-0.5">{pickLang(o.text, L)}{state === 'missed' && <em className="text-[var(--exam-ok)] ml-2 text-xs">({isVi ? 'đáp án đúng' : 'correct'})</em>}</span>
                        </div>
                      );
                    })}
                    {q.explanation && (
                      <div className="exam-explain mt-3 text-sm">
                        <div className="font-semibold mb-1 text-[var(--exam-accent)]">{isVi ? 'Giải thích' : 'Explanation'}</div>
                        <div className="rich-content max-w-none" data-ml={L} dangerouslySetInnerHTML={{ __html: sanitizeHtml(stripInlineColors(pickLang(q.explanation, L))) }} />
                      </div>
                    )}
                  </div>
                )}

                {/* PE grade */}
                {q.kind !== 'MCQ' && grade && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className={`exam-badge ${grade.percent >= (exam.passMark / exam.totalPoints * 100) ? 'exam-badge-pass' : 'exam-badge-fail'}`}>{grade.score}/{grade.maxScore} · {grade.verdict}</span>
                    </div>
                    {grade.summary && <p className="text-sm">{pickLang(grade.summary, L)}</p>}
                    {grade.criteria?.length > 0 && (
                      <div className="space-y-1.5">
                        {grade.criteria.map((c) => (
                          <div key={c.id} className="text-sm">
                            <div className="flex justify-between"><span className="font-medium">{pickLang(c.name, L)}</span><span className="exam-timer text-text-secondary">{c.score}/{c.maxScore}</span></div>
                            {c.comment && <div className="text-text-secondary text-[13px]">{pickLang(c.comment, L)}</div>}
                          </div>
                        ))}
                      </div>
                    )}
                    {grade.suggestions?.length > 0 && (
                      <div className="exam-explain text-sm">
                        <div className="font-semibold mb-1 text-[var(--exam-accent)]">{isVi ? 'Gợi ý cải thiện' : 'Suggestions'}</div>
                        <ul className="list-disc pl-5 space-y-1">{grade.suggestions.map((s, si) => <li key={si}>{pickLang(s, L)}</li>)}</ul>
                      </div>
                    )}
                    {grade.transcript && (<div><div className="text-xs text-text-muted mb-1">{isVi ? 'Bản ghi giọng nói' : 'Transcript'}</div><p className="text-sm text-text-secondary italic">“{grade.transcript}”</p></div>)}
                    {q.sampleSolution && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-sm font-semibold text-[var(--exam-accent)]">{isVi ? 'Xem đáp án mẫu' : 'Show reference solution'}</summary>
                        <pre className="exam-terminal mt-2">{q.sampleSolution}</pre>
                      </details>
                    )}
                    {q.expectedOutput && (
                      <details className="mt-1">
                        <summary className="cursor-pointer text-sm font-semibold text-text-secondary">{isVi ? 'Kết quả mong đợi' : 'Expected output'}</summary>
                        <pre className="exam-terminal mt-2">{q.expectedOutput}</pre>
                      </details>
                    )}
                  </div>
                )}

                {q.kind !== 'MCQ' && !grade && <p className="text-sm text-text-muted">{isVi ? 'Chưa có bài chấm cho câu này.' : 'No grade for this question.'}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
