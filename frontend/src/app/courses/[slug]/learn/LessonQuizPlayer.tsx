'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle, XCircle, Clock, RotateCcw, Trophy, Lightbulb } from 'lucide-react';
import { CodeBlock } from '@/components/social/CodeBlock';

export type QuizQuestionType = 'MC' | 'ESSAY';
export interface QuizQuestion {
  id: string;
  type?: QuizQuestionType;
  question: string;
  code?: string;
  codeLang?: string;
  options: string[];
  correctIndex?: number;
  correctIndexes?: number[];
  sampleAnswer?: string;
  explanation?: string;
  points: number;
}
export interface QuizData {
  timeLimitSeconds: number;
  questions: QuizQuestion[];
}

function correctSet(q: QuizQuestion): Set<number> {
  if (Array.isArray(q.correctIndexes)) return new Set(q.correctIndexes);
  if (typeof q.correctIndex === 'number') return new Set([q.correctIndex]);
  return new Set();
}
// Legacy questions sometimes stored code with escaped "\n" — show them as real
// newlines so multi-line prompts read correctly.
function unescapeText(s: string): string {
  return (s || '').replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n').replace(/\\t/g, '  ');
}

function TimeBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center">
      <div className="px-3 py-2 rounded-lg bg-darkbg border border-darkborder font-mono text-2xl font-bold text-text-primary tabular-nums min-w-[48px] text-center">
        {String(value).padStart(2, '0')}
      </div>
      <span className="text-[10px] text-text-muted mt-1 uppercase tracking-wide">{label}</span>
    </div>
  );
}

/**
 * Quiz player — countdown timer + questions that are multiple-choice (one OR
 * MORE correct answers, checkbox-style) or essay (free text with a model
 * answer). MC is auto-graded on submit / when time runs out; essay is
 * self-assessed against the shown model answer. Each question can show a
 * syntax-highlighted code snippet and an explanation after submit. Nothing is
 * saved server-side; the student can retake freely.
 */
export default function LessonQuizPlayer({
  quiz,
  onSubmitted,
}: {
  quiz: QuizData;
  onSubmitted?: () => void;
}) {
  const questions = useMemo(() => (Array.isArray(quiz?.questions) ? quiz.questions : []), [quiz]);
  const mcQuestions = useMemo(() => questions.filter((q) => q.type !== 'ESSAY'), [questions]);
  const essayCount = questions.length - mcQuestions.length;
  const mcTotalPoints = useMemo(() => mcQuestions.reduce((s, q) => s + (Number(q.points) || 0), 0), [mcQuestions]);

  const [mcAnswers, setMcAnswers] = useState<Record<string, number[]>>({});
  const [essayAnswers, setEssayAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [remaining, setRemaining] = useState(quiz?.timeLimitSeconds || 0);
  const submittedRef = useRef(false);

  const submit = useMemo(() => () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSubmitted(true);
    onSubmitted?.();
  }, [onSubmitted]);

  useEffect(() => {
    if (submitted) return;
    if (remaining <= 0) { submit(); return; }
    const t = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) { window.clearInterval(t); submit(); return 0; }
        return r - 1;
      });
    }, 1000);
    return () => window.clearInterval(t);
  }, [submitted, remaining, submit]);

  const hh = Math.floor(remaining / 3600);
  const mm = Math.floor((remaining % 3600) / 60);
  const ss = remaining % 60;

  const isMcCorrect = (q: QuizQuestion): boolean => {
    const picked = mcAnswers[q.id] || [];
    const correct = correctSet(q);
    return picked.length === correct.size && picked.every((p) => correct.has(p));
  };

  const score = useMemo(() => {
    if (!submitted) return 0;
    return mcQuestions.reduce((s, q) => s + (isMcCorrect(q) ? (Number(q.points) || 0) : 0), 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted, mcQuestions, mcAnswers]);
  const correctCount = mcQuestions.filter((q) => isMcCorrect(q)).length;

  const toggleMc = (qid: string, oi: number) =>
    setMcAnswers((a) => {
      const cur = a[qid] || [];
      const next = cur.includes(oi) ? cur.filter((x) => x !== oi) : [...cur, oi];
      return { ...a, [qid]: next };
    });

  const answeredCount =
    mcQuestions.filter((q) => (mcAnswers[q.id]?.length ?? 0) > 0).length +
    questions.filter((q) => q.type === 'ESSAY' && (essayAnswers[q.id]?.trim() ?? '') !== '').length;

  const reset = () => {
    submittedRef.current = false;
    setMcAnswers({});
    setEssayAnswers({});
    setSubmitted(false);
    setRemaining(quiz?.timeLimitSeconds || 0);
  };

  if (questions.length === 0) {
    return <div className="rounded-2xl border border-darkborder bg-darkcard p-6 text-text-muted text-sm">Quizz chưa có câu hỏi.</div>;
  }

  return (
    <div className="rounded-2xl border border-darkborder bg-darkcard overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 p-5 border-b border-darkborder/50 flex-wrap">
        <div>
          <h2 className="text-xl font-heading font-bold text-text-primary">Quizz — Kiểm tra kiến thức</h2>
          <p className="text-sm text-text-muted mt-1">
            {questions.length} câu ({mcQuestions.length} trắc nghiệm{essayCount > 0 ? ` · ${essayCount} tự luận` : ''}) · {mcTotalPoints} điểm trắc nghiệm
          </p>
        </div>
        {!submitted && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-neon-violet" />
            <div className="flex items-center gap-2">
              <TimeBox label="Giờ" value={hh} />
              <span className="text-text-muted text-xl">:</span>
              <TimeBox label="Phút" value={mm} />
              <span className="text-text-muted text-xl">:</span>
              <TimeBox label="Giây" value={ss} />
            </div>
          </div>
        )}
      </div>

      {/* Result banner */}
      {submitted && (
        <div className="m-5 mb-0 rounded-xl border border-green-500/30 bg-green-500/10 p-4 flex items-center gap-3">
          <Trophy className="w-6 h-6 text-yellow-400 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-text-primary">Kết quả trắc nghiệm: {score}/{mcTotalPoints} điểm</p>
            <p className="text-xs text-text-secondary">
              Đúng {correctCount}/{mcQuestions.length} câu {remaining <= 0 ? '· hết giờ' : ''}
              {essayCount > 0 ? ` · ${essayCount} câu tự luận tự đối chiếu đáp án mẫu` : ''}
            </p>
          </div>
          <button onClick={reset} className="ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-neon-violet/15 text-neon-violet hover:bg-neon-violet/25">
            <RotateCcw className="w-4 h-4" /> Làm lại
          </button>
        </div>
      )}

      {/* Questions */}
      <div className="p-5 space-y-6">
        {questions.map((q, idx) => {
          const isEssay = q.type === 'ESSAY';
          const correct = correctSet(q);
          const mcCorrect = !isEssay && isMcCorrect(q);
          return (
            <div key={q.id} className="border-b border-darkborder/20 pb-5 last:border-0 last:pb-0">
              <div className="flex gap-3">
                <span className="text-text-muted font-semibold shrink-0">{idx + 1}.</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${isEssay ? 'bg-amber-500/15 text-amber-300' : 'bg-neon-violet/15 text-neon-violet'}`}>
                      {isEssay ? 'Tự luận' : 'Trắc nghiệm'}
                    </span>
                    {correct.size > 1 && !isEssay && <span className="text-[10px] text-text-muted">(chọn nhiều đáp án)</span>}
                  </div>
                  <p className="text-text-primary font-medium mb-3 whitespace-pre-wrap">{unescapeText(q.question)}</p>

                  {q.code?.trim() && (
                    <div className="mb-3">
                      <CodeBlock code={unescapeText(q.code)} language={q.codeLang || 'javascript'} showLineNumbers={false} />
                    </div>
                  )}

                  {isEssay ? (
                    <div className="space-y-3">
                      <textarea
                        value={essayAnswers[q.id] || ''}
                        onChange={(e) => setEssayAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                        disabled={submitted}
                        rows={4}
                        placeholder="Nhập câu trả lời của bạn…"
                        className="w-full px-4 py-2.5 rounded-xl bg-darkbg border border-darkborder text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 resize-y disabled:opacity-70"
                      />
                      {submitted && q.sampleAnswer?.trim() && (
                        <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-3">
                          <p className="text-xs font-semibold text-green-400 mb-1">Đáp án mẫu:</p>
                          <p className="text-sm text-text-secondary whitespace-pre-wrap">{unescapeText(q.sampleAnswer)}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {q.options.map((opt, oi) => {
                        const picked = (mcAnswers[q.id] || []).includes(oi);
                        const isCorrect = correct.has(oi);
                        let cls = 'border-darkborder hover:border-neon-violet/40';
                        if (submitted) {
                          if (isCorrect) cls = 'border-green-500/60 bg-green-500/10';
                          else if (picked) cls = 'border-red-500/60 bg-red-500/10';
                          else cls = 'border-darkborder opacity-70';
                        } else if (picked) {
                          cls = 'border-neon-violet/60 bg-neon-violet/10';
                        }
                        return (
                          <label key={oi} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border cursor-pointer transition-colors ${cls}`}>
                            <input
                              type="checkbox"
                              checked={picked}
                              disabled={submitted}
                              onChange={() => toggleMc(q.id, oi)}
                              className="accent-neon-violet shrink-0 w-4 h-4"
                            />
                            <span className="text-sm text-text-secondary flex-1">{opt}</span>
                            {submitted && isCorrect && <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />}
                            {submitted && picked && !isCorrect && <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {/* After submit: per-question verdict + explanation */}
                  {submitted && !isEssay && (
                    <p className={`mt-2 text-sm font-semibold ${mcCorrect ? 'text-green-400' : 'text-red-400'}`}>
                      {mcCorrect ? '✓ Chính xác!' : '✗ Chưa đúng'}
                    </p>
                  )}
                  {submitted && q.explanation?.trim() && (
                    <div className="mt-2 flex items-start gap-2 rounded-xl border border-neon-cyan/25 bg-neon-cyan/5 p-3">
                      <Lightbulb className="w-4 h-4 text-neon-cyan shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-neon-cyan mb-0.5">Giải thích</p>
                        <p className="text-sm text-text-secondary whitespace-pre-wrap">{unescapeText(q.explanation)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit */}
      {!submitted && (
        <div className="p-5 border-t border-darkborder/50 flex items-center justify-between gap-4">
          <p className="text-xs text-text-muted">Đã trả lời {answeredCount}/{questions.length} câu</p>
          <button onClick={submit} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-medium text-sm hover:opacity-90">
            Nộp bài
          </button>
        </div>
      )}
    </div>
  );
}
