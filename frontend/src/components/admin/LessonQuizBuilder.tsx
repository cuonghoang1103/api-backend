'use client';

import { Plus, Trash2, GripVertical, Code2 } from 'lucide-react';

export type QuizQuestionType = 'MC' | 'ESSAY';

export interface QuizQuestion {
  id: string;
  type?: QuizQuestionType;          // default 'MC' (multiple choice)
  question: string;
  code?: string;                    // optional code snippet shown syntax-highlighted
  codeLang?: string;                // language for the code block (default 'javascript')
  options: string[];                // MC only
  correctIndex?: number;            // legacy single-answer (kept for back-compat)
  correctIndexes?: number[];        // NEW: multiple correct answers
  sampleAnswer?: string;            // ESSAY: model answer shown after submit
  explanation?: string;             // why the answer is correct (shown after submit)
  points: number;
}
export interface QuizData {
  timeLimitSeconds: number;
  questions: QuizQuestion[];
}

export function emptyQuiz(): QuizData {
  return { timeLimitSeconds: 600, questions: [] };
}

// Correct-answer set, tolerant of the legacy single-index shape.
export function getCorrectSet(q: QuizQuestion): Set<number> {
  if (Array.isArray(q.correctIndexes)) return new Set(q.correctIndexes);
  if (typeof q.correctIndex === 'number') return new Set([q.correctIndex]);
  return new Set();
}

const CODE_LANGS = ['javascript', 'typescript', 'java', 'python', 'c', 'cpp', 'csharp', 'go', 'rust', 'php', 'ruby', 'sql', 'bash', 'json', 'html', 'css', 'kotlin', 'swift'];

let idCounter = 0;
function newId() { idCounter += 1; return `q${Date.now()}_${idCounter}`; }

/**
 * Admin builder for a QUIZ lesson: a time limit + questions that are either
 * multiple-choice (ONE OR MORE correct options) or essay (free text with a
 * model answer). Each question can carry a syntax-highlighted code snippet and
 * an explanation. Stored as JSON on the lesson; MC is auto-scored on the learn
 * page, essay is self-assessed.
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

  const addQuestion = (type: QuizQuestionType) => setQuestions([
    ...quiz.questions,
    type === 'ESSAY'
      ? { id: newId(), type: 'ESSAY', question: '', options: [], sampleAnswer: '', explanation: '', points: 1 }
      : { id: newId(), type: 'MC', question: '', options: ['', '', '', ''], correctIndexes: [0], explanation: '', points: 1 },
  ]);
  const updateQuestion = (idx: number, patch: Partial<QuizQuestion>) =>
    setQuestions(quiz.questions.map((q, i) => (i === idx ? { ...q, ...patch } : q)));
  const removeQuestion = (idx: number) => setQuestions(quiz.questions.filter((_, i) => i !== idx));

  const toggleCorrect = (idx: number, oi: number) => {
    const q = quiz.questions[idx];
    const set = getCorrectSet(q);
    if (set.has(oi)) set.delete(oi); else set.add(oi);
    updateQuestion(idx, { correctIndexes: Array.from(set).sort((a, b) => a - b), correctIndex: undefined });
  };

  const totalPoints = quiz.questions.reduce((s, q) => s + (Number(q.points) || 0), 0);
  const minutes = Math.round((quiz.timeLimitSeconds || 0) / 60);

  return (
    <div className="rounded-xl border border-neon-violet/30 bg-neon-violet/[0.04] p-4 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="text-sm font-semibold text-text-primary">📝 Bài Quizz (trắc nghiệm + tự luận)</p>
          <p className="text-xs text-text-muted mt-0.5">{quiz.questions.length} câu · {totalPoints} điểm · trắc nghiệm tự chấm, tự luận tự đối chiếu</p>
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
        {quiz.questions.map((q, idx) => {
          const isEssay = q.type === 'ESSAY';
          const correct = getCorrectSet(q);
          return (
            <div key={q.id} className="rounded-xl border border-darkborder bg-darkbg p-3 space-y-3">
              <div className="flex items-start gap-2">
                <GripVertical className="w-4 h-4 text-text-muted mt-2.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xs font-semibold text-neon-violet shrink-0">Câu {idx + 1}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${isEssay ? 'bg-amber-500/15 text-amber-300' : 'bg-neon-violet/15 text-neon-violet'}`}>
                      {isEssay ? 'Tự luận' : 'Trắc nghiệm'}
                    </span>
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

                  {/* Optional code snippet — shown syntax-highlighted to the student */}
                  <div className="mb-2 rounded-lg border border-darkborder/70 bg-[#0b0b12] p-2">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Code2 className="w-3.5 h-3.5 text-neon-cyan" />
                      <span className="text-[11px] text-text-muted">Code minh hoạ (tuỳ chọn — sẽ được tô màu)</span>
                      <select
                        value={q.codeLang || 'javascript'}
                        onChange={(e) => updateQuestion(idx, { codeLang: e.target.value })}
                        className="ml-auto text-[11px] bg-darkbg border border-darkborder rounded px-2 py-0.5 text-text-secondary"
                      >
                        {CODE_LANGS.map((l) => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                    <textarea
                      value={q.code || ''}
                      onChange={(e) => updateQuestion(idx, { code: e.target.value })}
                      rows={q.code ? 4 : 2}
                      placeholder={'int[] arr = {10, 20, 30};\nfor (int i = 0; i <= arr.length; i++) { ... }'}
                      className="w-full px-3 py-2 rounded bg-black/40 border border-darkborder text-text-primary text-xs font-mono resize-y"
                    />
                  </div>

                  {isEssay ? (
                    <div>
                      <label className="block text-[11px] text-text-muted mb-1">Đáp án mẫu (học viên xem sau khi nộp)</label>
                      <textarea
                        value={q.sampleAnswer || ''}
                        onChange={(e) => updateQuestion(idx, { sampleAnswer: e.target.value })}
                        rows={3}
                        placeholder="Đáp án mẫu / gợi ý chấm…"
                        className="w-full px-3 py-2 rounded-lg bg-[#0b0b12] border border-darkborder text-text-primary text-sm"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="space-y-1.5">
                        {q.options.map((opt, oi) => (
                          <div key={oi} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={correct.has(oi)}
                              onChange={() => toggleCorrect(idx, oi)}
                              title="Đáp án đúng (có thể chọn nhiều)"
                              className="accent-green-500 shrink-0 w-4 h-4"
                            />
                            <input
                              value={opt}
                              onChange={(e) => updateQuestion(idx, { options: q.options.map((o, i) => (i === oi ? e.target.value : o)) })}
                              placeholder={`Đáp án ${String.fromCharCode(65 + oi)}`}
                              className={`flex-1 px-3 py-1.5 rounded-lg bg-[#0b0b12] border text-sm text-text-primary ${correct.has(oi) ? 'border-green-500/50' : 'border-darkborder'}`}
                            />
                            {q.options.length > 2 && (
                              <button onClick={() => {
                                const remaining = q.options.filter((_, i) => i !== oi);
                                // Re-map correct indexes after removing option oi.
                                const remapped = Array.from(correct)
                                  .filter((c) => c !== oi)
                                  .map((c) => (c > oi ? c - 1 : c));
                                updateQuestion(idx, { options: remaining, correctIndexes: remapped, correctIndex: undefined });
                              }} className="p-1 rounded text-text-muted hover:text-red-400" title="Xoá đáp án">
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
                      <p className="text-[11px] text-text-muted mt-1.5">Tích vào ô vuông ở (các) đáp án đúng — có thể chọn nhiều.</p>
                    </>
                  )}

                  {/* Explanation — shown to the student after submit */}
                  <div className="mt-2">
                    <label className="block text-[11px] text-text-muted mb-1">Giải thích — vì sao đáp án này đúng (hiện sau khi nộp)</label>
                    <textarea
                      value={q.explanation || ''}
                      onChange={(e) => updateQuestion(idx, { explanation: e.target.value })}
                      rows={2}
                      placeholder="VD: Vòng lặp dùng i <= arr.length nên vượt chỉ số cuối → ArrayIndexOutOfBoundsException…"
                      className="w-full px-3 py-2 rounded-lg bg-[#0b0b12] border border-darkborder text-text-secondary text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <button onClick={() => addQuestion('MC')} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-neon-violet/40 text-neon-violet hover:bg-neon-violet/10">
          <Plus className="w-4 h-4" /> Thêm câu trắc nghiệm
        </button>
        <button onClick={() => addQuestion('ESSAY')} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-amber-500/40 text-amber-300 hover:bg-amber-500/10">
          <Plus className="w-4 h-4" /> Thêm câu tự luận
        </button>
      </div>
    </div>
  );
}
