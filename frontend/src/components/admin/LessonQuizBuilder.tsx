'use client';

import { Plus, Trash2, GripVertical } from 'lucide-react';

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

export function emptyQuiz(): QuizData {
  return { timeLimitSeconds: 600, questions: [] };
}

let idCounter = 0;
function newId() { idCounter += 1; return `q${Date.now()}_${idCounter}`; }

/**
 * Admin builder for a QUIZ lesson: a time limit + multiple-choice questions
 * (one correct option each, per-question points). Stored as JSON on the
 * lesson; scored client-side on the learn page (answers are never saved).
 */
export default function LessonQuizBuilder({
  value,
  onChange,
}: {
  value: QuizData | null | undefined;
  onChange: (data: QuizData) => void;
}) {
  const quiz: QuizData = value && Array.isArray(value.questions) ? value : emptyQuiz();
  const update = (patch: Partial<QuizData>) => onChange({ ...quiz, ...patch });
  const setQuestions = (questions: QuizQuestion[]) => update({ questions });

  const addQuestion = () => setQuestions([
    ...quiz.questions,
    { id: newId(), question: '', options: ['', '', '', ''], correctIndex: 0, points: 1 },
  ]);
  const updateQuestion = (idx: number, patch: Partial<QuizQuestion>) =>
    setQuestions(quiz.questions.map((q, i) => (i === idx ? { ...q, ...patch } : q)));
  const removeQuestion = (idx: number) => setQuestions(quiz.questions.filter((_, i) => i !== idx));

  const totalPoints = quiz.questions.reduce((s, q) => s + (Number(q.points) || 0), 0);
  const minutes = Math.round((quiz.timeLimitSeconds || 0) / 60);

  return (
    <div className="rounded-xl border border-neon-violet/30 bg-neon-violet/[0.04] p-4 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="text-sm font-semibold text-text-primary">📝 Bài Quizz (trắc nghiệm)</p>
          <p className="text-xs text-text-muted mt-0.5">{quiz.questions.length} câu · {totalPoints} điểm · tự chấm khi nộp/hết giờ</p>
        </div>
        <label className="flex items-center gap-2 text-sm text-text-secondary">
          Thời gian (phút):
          <input
            type="number" min={1} value={minutes}
            onChange={(e) => update({ timeLimitSeconds: Math.max(1, Number(e.target.value) || 1) * 60 })}
            className="w-20 px-3 py-1.5 rounded-lg bg-darkbg border border-darkborder text-text-primary"
          />
        </label>
      </div>

      <div className="space-y-4">
        {quiz.questions.map((q, idx) => (
          <div key={q.id} className="rounded-xl border border-darkborder bg-darkbg p-3 space-y-3">
            <div className="flex items-start gap-2">
              <GripVertical className="w-4 h-4 text-text-muted mt-2.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-neon-violet shrink-0">Câu {idx + 1}</span>
                  <label className="text-xs text-text-muted ml-auto flex items-center gap-1">
                    Điểm:
                    <input type="number" min={0} step={0.5} value={q.points}
                      onChange={(e) => updateQuestion(idx, { points: Number(e.target.value) || 0 })}
                      className="w-14 px-2 py-1 rounded bg-[#0b0b12] border border-darkborder text-text-primary" />
                  </label>
                  <button onClick={() => removeQuestion(idx)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10" title="Xoá câu">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <textarea
                  value={q.question}
                  onChange={(e) => updateQuestion(idx, { question: e.target.value })}
                  rows={2}
                  placeholder="Nội dung câu hỏi…"
                  className="w-full px-3 py-2 rounded-lg bg-[#0b0b12] border border-darkborder text-text-primary text-sm mb-2"
                />
                <div className="space-y-1.5">
                  {q.options.map((opt, oi) => (
                    <div key={oi} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${q.id}`}
                        checked={q.correctIndex === oi}
                        onChange={() => updateQuestion(idx, { correctIndex: oi })}
                        title="Đáp án đúng"
                        className="accent-green-500 shrink-0"
                      />
                      <input
                        value={opt}
                        onChange={(e) => updateQuestion(idx, { options: q.options.map((o, i) => (i === oi ? e.target.value : o)) })}
                        placeholder={`Đáp án ${String.fromCharCode(65 + oi)}`}
                        className={`flex-1 px-3 py-1.5 rounded-lg bg-[#0b0b12] border text-sm text-text-primary ${q.correctIndex === oi ? 'border-green-500/50' : 'border-darkborder'}`}
                      />
                      {q.options.length > 2 && (
                        <button onClick={() => updateQuestion(idx, {
                          options: q.options.filter((_, i) => i !== oi),
                          correctIndex: q.correctIndex >= oi && q.correctIndex > 0 ? q.correctIndex - 1 : q.correctIndex,
                        })} className="p-1 rounded text-text-muted hover:text-red-400" title="Xoá đáp án">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {q.options.length < 6 && (
                  <button onClick={() => updateQuestion(idx, { options: [...q.options, ''] })} className="mt-2 text-xs text-neon-violet hover:underline flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Thêm đáp án
                  </button>
                )}
                <p className="text-[11px] text-text-muted mt-1.5">Chọn nút tròn ở đáp án đúng.</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={addQuestion} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-neon-violet/40 text-neon-violet hover:bg-neon-violet/10">
        <Plus className="w-4 h-4" /> Thêm câu hỏi
      </button>
    </div>
  );
}
