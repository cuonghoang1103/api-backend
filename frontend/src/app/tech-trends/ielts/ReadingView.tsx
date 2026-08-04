'use client';

/**
 * Tab Đọc — 5 bài tự soạn, làm bài rồi chấm và xem giải thích.
 *
 * Ba quyết định về cách bày:
 *  - Bản dịch và giải thích ĐỀU ẨN cho tới khi bấm "Chấm bài". Bày sẵn thì
 *    người học liếc đáp án rồi tưởng mình làm được.
 *  - Có đồng hồ đếm ngược theo số phút của bài. Đọc không bấm giờ là bỏ qua
 *    đúng thứ khó nhất của IELTS Reading.
 *  - Chấm xong hiện CẢ "vì sao đúng" lẫn "vì sao các phương án kia sai" — biết
 *    mình sai vì sao mới không lặp lại.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Timer, Check, X, Eye, EyeOff, RotateCcw, Lightbulb, BookOpen, Languages,
} from 'lucide-react';
import { READINGS } from './data/stage1';
import { isCorrect } from './check';

export default function ReadingView() {
  const [id, setId] = useState(READINGS[0].id);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [graded, setGraded] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const passage = READINGS.find((r) => r.id === id) ?? READINGS[0];

  const stopTimer = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }, []);

  // Dọn đồng hồ khi rời tab, nếu không interval chạy tiếp dưới nền.
  useEffect(() => stopTimer, [stopTimer]);

  const reset = useCallback(() => {
    setAnswers({});
    setGraded(false);
    setShowTranslation(false);
    setSecondsLeft(null);
    stopTimer();
  }, [stopTimer]);

  const startTimer = useCallback(() => {
    stopTimer();
    setSecondsLeft(passage.minutes * 60);
    timer.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s === null) return null;
        if (s <= 1) {
          stopTimer();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }, [passage.minutes, stopTimer]);

  const correctCount = passage.questions.filter((q, i) =>
    isCorrect(answers[i] ?? '', q.answer, q.alt),
  ).length;

  const mmss = (s: number): string =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div>
      {/* Chọn bài */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1">
        {READINGS.map((r, i) => (
          <button
            key={r.id}
            type="button"
            onClick={() => { setId(r.id); reset(); }}
            className={`shrink-0 px-3 py-2 rounded-xl border text-sm whitespace-nowrap transition-all active:scale-95 ${
              r.id === id
                ? 'bg-sky-500/20 border-sky-400/40 text-white'
                : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            Bài {i + 1} · {r.titleVi}
          </button>
        ))}
      </div>

      {/* Đầu bài + đồng hồ */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5 mb-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="min-w-0">
            <h3 className="text-xl font-bold text-white">{passage.title}</h3>
            <p className="text-slate-400 text-sm mt-0.5">{passage.titleVi}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-500">
              <span>{passage.level}</span>
              <span>{passage.words} từ</span>
              <span>{passage.questions.length} câu hỏi</span>
              <span>Nên làm trong {passage.minutes} phút</span>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            {secondsLeft !== null && (
              <span
                className={`font-mono text-lg px-3 py-1.5 rounded-xl border ${
                  secondsLeft === 0
                    ? 'border-rose-400/40 bg-rose-500/15 text-rose-300'
                    : secondsLeft < 60
                      ? 'border-amber-400/40 bg-amber-500/15 text-amber-300'
                      : 'border-white/10 bg-white/5 text-slate-300'
                }`}
              >
                {mmss(secondsLeft)}
              </span>
            )}
            <button
              type="button"
              onClick={startTimer}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-sky-500/15 border border-sky-400/30 text-sky-200 text-sm hover:bg-sky-500/25 transition-colors"
            >
              <Timer className="w-4 h-4" />
              {secondsLeft === null ? 'Bấm giờ' : 'Bấm lại'}
            </button>
          </div>
        </div>
      </div>

      {/* Mẹo làm dạng câu hỏi có trong bài */}
      <details className="rounded-2xl border border-amber-500/25 bg-amber-500/[0.06] p-4 mb-4">
        <summary className="cursor-pointer text-amber-300 text-sm font-semibold flex items-center gap-2">
          <Lightbulb className="w-4 h-4" />
          Mẹo làm bài này ({passage.strategy.length})
        </summary>
        <ul className="mt-3 space-y-2">
          {passage.strategy.map((s, i) => (
            <li key={i} className="text-slate-200 text-sm leading-relaxed flex gap-2">
              <span className="text-amber-400 shrink-0">→</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </details>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Bài đọc */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
          <p className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
            <BookOpen className="w-4 h-4 text-sky-400" />
            Bài đọc
          </p>
          <div className="space-y-3">
            {passage.paragraphs.map((p) => (
              <div key={p.label} className="flex gap-3">
                <span className="shrink-0 w-6 h-6 rounded-lg bg-sky-500/15 text-sky-300 text-xs font-bold flex items-center justify-center">
                  {p.label}
                </span>
                <p className="text-slate-300 text-sm leading-relaxed flex-1">{p.text}</p>
              </div>
            ))}
          </div>

          {/* Từ khó */}
          <div className="mt-5 pt-4 border-t border-white/10">
            <p className="text-xs text-slate-500 mb-2">Từ khó trong bài</p>
            <div className="flex flex-wrap gap-2">
              {passage.glossary.map((g, i) => (
                <span
                  key={i}
                  className="text-xs rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5"
                >
                  <b className="text-white">{g.en}</b>
                  <span className="text-violet-300/60 font-mono ml-1.5">{g.ipa}</span>
                  <span className="text-slate-400 ml-1.5">{g.vi}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Bản dịch — chỉ mở được sau khi chấm */}
          <div className="mt-4">
            <button
              type="button"
              disabled={!graded}
              onClick={() => setShowTranslation((v) => !v)}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm border transition-colors ${
                graded
                  ? 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
                  : 'bg-white/[0.02] border-white/5 text-slate-600 cursor-not-allowed'
              }`}
            >
              {showTranslation ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {graded ? (showTranslation ? 'Ẩn bản dịch' : 'Xem bản dịch') : 'Bản dịch mở sau khi chấm bài'}
            </button>
            {graded && showTranslation && (
              <p className="mt-3 text-slate-400 text-sm leading-relaxed whitespace-pre-line rounded-xl border border-white/10 bg-white/[0.02] p-3">
                {passage.translation}
              </p>
            )}
          </div>
        </div>

        {/* Câu hỏi */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-white">Câu hỏi</p>
            {graded && (
              <span
                className={`text-sm px-3 py-1 rounded-lg ${
                  correctCount >= passage.questions.length * 0.7
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-amber-500/20 text-amber-300'
                }`}
              >
                Đúng {correctCount}/{passage.questions.length}
              </span>
            )}
          </div>

          <div className="space-y-3">
            {passage.questions.map((q, i) => {
              const given = answers[i] ?? '';
              const ok = isCorrect(given, q.answer, q.alt);
              return (
                <div
                  key={i}
                  className={`rounded-xl border p-3 transition-colors ${
                    graded
                      ? ok
                        ? 'border-emerald-400/30 bg-emerald-500/[0.07]'
                        : 'border-rose-400/30 bg-rose-500/[0.07]'
                      : 'border-white/10 bg-white/[0.03]'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="shrink-0 text-xs font-bold text-sky-400 bg-sky-500/15 px-1.5 py-0.5 rounded">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-200 text-sm leading-relaxed">{q.q}</p>
                      <p className="text-[10px] text-slate-600 mt-1 uppercase tracking-wide">{q.kind}</p>
                    </div>
                    {graded && (ok
                      ? <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      : <X className="w-4 h-4 text-rose-400 shrink-0" />)}
                  </div>

                  {/* Ô trả lời */}
                  <div className="mt-2.5">
                    {q.options ? (
                      <div className="flex flex-wrap gap-2">
                        {q.options.map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            disabled={graded}
                            onClick={() => setAnswers((a) => ({ ...a, [i]: opt }))}
                            className={`text-left text-xs rounded-lg border px-2.5 py-1.5 transition-all ${
                              given === opt
                                ? 'border-sky-400/50 bg-sky-500/20 text-white'
                                : 'border-white/10 bg-white/[0.02] text-slate-300 hover:border-white/25'
                            } ${graded ? 'cursor-default' : 'active:scale-95'}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={given}
                        disabled={graded}
                        onChange={(e) => setAnswers((a) => ({ ...a, [i]: e.target.value }))}
                        placeholder="Gõ từ lấy từ bài đọc…"
                        className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-slate-600 outline-none focus:border-sky-400/50 disabled:text-slate-400"
                      />
                    )}
                  </div>

                  {/* Giải thích sau khi chấm */}
                  {graded && (
                    <div className="mt-2.5 pt-2.5 border-t border-white/10 space-y-1.5">
                      <p className="text-xs text-emerald-300">
                        Đáp án: <b>{q.answer}</b>
                        {q.alt && q.alt.length > 0 && (
                          <span className="text-slate-500"> (chấp nhận: {q.alt.join(', ')})</span>
                        )}
                      </p>
                      <p className="text-xs text-slate-300 leading-relaxed">{q.why}</p>
                      {q.whyNot && (
                        <p className="text-xs text-slate-500 leading-relaxed">{q.whyNot}</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex gap-2">
            {!graded ? (
              <button
                type="button"
                onClick={() => { setGraded(true); stopTimer(); }}
                className="flex-1 px-4 py-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-white text-sm hover:bg-emerald-500/30 transition-colors"
              >
                Chấm bài
              </button>
            ) : (
              <button
                type="button"
                onClick={reset}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-sm hover:bg-white/10 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Làm lại từ đầu
              </button>
            )}
          </div>

          {graded && (
            <p className="mt-3 text-xs text-slate-500 leading-relaxed flex gap-2">
              <Languages className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>
                Đọc kỹ phần giải thích của những câu SAI trước, rồi mới xem bản dịch. Xem dịch trước thì
                bạn chỉ nhớ nội dung bài chứ không nhớ cách làm dạng câu hỏi.
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
