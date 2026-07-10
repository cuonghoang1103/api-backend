'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle, XCircle, Clock, RotateCcw, Trophy } from 'lucide-react';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  points: number;
}
export interface QuizData {
  timeLimitSeconds: number;
  questions: QuizQuestion[];
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
 * Quiz player — countdown timer + single-answer MCQs, auto-graded on submit
 * OR when time runs out. Nothing is saved server-side; the student can
 * retake it freely. `onSubmitted` lets the parent mark the lesson complete.
 */
export default function LessonQuizPlayer({
  quiz,
  onSubmitted,
}: {
  quiz: QuizData;
  onSubmitted?: () => void;
}) {
  const questions = useMemo(() => (Array.isArray(quiz?.questions) ? quiz.questions : []), [quiz]);
  const totalPoints = useMemo(() => questions.reduce((s, q) => s + (Number(q.points) || 0), 0), [questions]);

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [remaining, setRemaining] = useState(quiz?.timeLimitSeconds || 0);
  const submittedRef = useRef(false);

  const submit = useMemo(() => () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSubmitted(true);
    onSubmitted?.();
  }, [onSubmitted]);

  // Countdown — auto-submit at zero.
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

  const score = useMemo(() => {
    if (!submitted) return 0;
    return questions.reduce((s, q) => s + (answers[q.id] === q.correctIndex ? (Number(q.points) || 0) : 0), 0);
  }, [submitted, questions, answers]);
  const correctCount = questions.filter((q) => answers[q.id] === q.correctIndex).length;

  const reset = () => {
    submittedRef.current = false;
    setAnswers({});
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
          <p className="text-sm text-text-muted mt-1">Tổng số câu: {questions.length} · Tổng điểm: {totalPoints}</p>
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
            <p className="text-sm font-semibold text-text-primary">Kết quả: {score}/{totalPoints} điểm</p>
            <p className="text-xs text-text-secondary">Đúng {correctCount}/{questions.length} câu {remaining <= 0 ? '· hết giờ' : ''}</p>
          </div>
          <button onClick={reset} className="ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-neon-violet/15 text-neon-violet hover:bg-neon-violet/25">
            <RotateCcw className="w-4 h-4" /> Làm lại
          </button>
        </div>
      )}

      {/* Questions */}
      <div className="p-5 space-y-6">
        {questions.map((q, idx) => (
          <div key={q.id} className="border-b border-darkborder/20 pb-5 last:border-0 last:pb-0">
            <div className="flex gap-3">
              <span className="text-text-muted font-semibold shrink-0">{idx + 1}.</span>
              <div className="flex-1 min-w-0">
                <p className="text-text-primary font-medium mb-3 whitespace-pre-wrap">{q.question}</p>
                <div className="space-y-2">
                  {q.options.map((opt, oi) => {
                    const picked = answers[q.id] === oi;
                    const isCorrect = q.correctIndex === oi;
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
                          type="radio"
                          name={q.id}
                          checked={picked}
                          disabled={submitted}
                          onChange={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                          className="accent-neon-violet shrink-0"
                        />
                        <span className="text-sm text-text-secondary flex-1">{opt}</span>
                        {submitted && isCorrect && <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />}
                        {submitted && picked && !isCorrect && <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Submit */}
      {!submitted && (
        <div className="p-5 border-t border-darkborder/50 flex items-center justify-between gap-4">
          <p className="text-xs text-text-muted">Đã trả lời {Object.keys(answers).length}/{questions.length} câu</p>
          <button onClick={submit} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-medium text-sm hover:opacity-90">
            Nộp bài
          </button>
        </div>
      )}
    </div>
  );
}
