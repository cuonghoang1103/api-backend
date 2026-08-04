'use client';

/**
 * Khối bài tập dùng chung — gắn dưới mỗi bài học và dưới mỗi tình huống Đời sống.
 *
 * Hai quyết định về cách chấm:
 *  - Chấm TỪNG CÂU chứ không chấm cả bộ một lượt. Người học cần biết mình sai
 *    ngay lúc còn nhớ mình đã nghĩ gì; để tới cuối mới biết thì phần lớn đã
 *    quên lý do mình chọn đáp án đó.
 *  - Câu sai KHÔNG khoá lại. Cho sửa và thử lại ngay, vì mục tiêu ở đây là học
 *    chứ không phải đo điểm. Số đúng vẫn đếm theo lần trả lời ĐẦU TIÊN nên
 *    không tự lừa mình được.
 */
import { useCallback, useMemo, useState } from 'react';
import { Check, X, RotateCcw, Lightbulb, PencilLine } from 'lucide-react';
import type { Exercise } from './data/types';
import { isCorrect } from './check';

const KIND_LABEL: Record<Exercise['kind'], string> = {
  choice: 'Chọn đáp án',
  gap: 'Điền từ',
  fix: 'Sửa lỗi sai',
  order: 'Sắp xếp thành câu',
  translate: 'Dịch Việt → Anh',
};

const KIND_COLOR: Record<Exercise['kind'], string> = {
  choice: 'text-sky-300 bg-sky-500/15',
  gap: 'text-violet-300 bg-violet-500/15',
  fix: 'text-rose-300 bg-rose-500/15',
  order: 'text-amber-300 bg-amber-500/15',
  translate: 'text-emerald-300 bg-emerald-500/15',
};

type State = { input: string; checked: boolean; firstTryOk: boolean | null };

export default function ExercisePanel({
  items, title = 'Bài tập', storageKeyHint,
}: {
  items: Exercise[];
  title?: string;
  /** Đổi giá trị này (id bài học / id tình huống) là reset toàn bộ trạng thái. */
  storageKeyHint: string;
}) {
  const [state, setState] = useState<Record<number, State>>({});
  /** Đổi bài thì xoá sạch trạng thái cũ — nếu không câu 1 của bài mới hiện đáp án bài cũ. */
  const [ownerKey, setOwnerKey] = useState(storageKeyHint);
  if (ownerKey !== storageKeyHint) {
    setOwnerKey(storageKeyHint);
    setState({});
  }

  const get = useCallback(
    (i: number): State => state[i] ?? { input: '', checked: false, firstTryOk: null },
    [state],
  );

  const setInput = useCallback((i: number, v: string) => {
    setState((s) => ({ ...s, [i]: { ...(s[i] ?? { checked: false, firstTryOk: null, input: '' }), input: v, checked: false } }));
  }, []);

  const check = useCallback((i: number, ex: Exercise) => {
    setState((s) => {
      const cur = s[i] ?? { input: '', checked: false, firstTryOk: null };
      const ok = isCorrect(cur.input, ex.answer, ex.alt);
      return {
        ...s,
        // firstTryOk chỉ ghi MỘT lần — làm lại đúng sau đó không đổi được thống kê.
        [i]: { ...cur, checked: true, firstTryOk: cur.firstTryOk === null ? ok : cur.firstTryOk },
      };
    });
  }, []);

  const pick = useCallback((i: number, ex: Exercise, opt: string) => {
    setState((s) => {
      const cur = s[i] ?? { input: '', checked: false, firstTryOk: null };
      const ok = isCorrect(opt, ex.answer, ex.alt);
      return {
        ...s,
        [i]: { input: opt, checked: true, firstTryOk: cur.firstTryOk === null ? ok : cur.firstTryOk },
      };
    });
  }, []);

  const done = useMemo(
    () => items.filter((_, i) => get(i).firstTryOk !== null).length,
    [items, get],
  );
  const rightFirst = useMemo(
    () => items.filter((_, i) => get(i).firstTryOk === true).length,
    [items, get],
  );

  const reset = useCallback(() => setState({}), []);

  return (
    <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.04] p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-emerald-200">
          <PencilLine className="w-4 h-4" />
          {title}
          <span className="text-xs font-normal text-slate-500">({items.length} câu)</span>
        </p>
        <div className="flex items-center gap-2">
          {done > 0 && (
            <span className="text-xs px-2.5 py-1 rounded-lg bg-white/5 text-slate-300">
              Đúng ngay lần đầu: <b className="text-emerald-300">{rightFirst}</b>/{done}
            </span>
          )}
          {done > 0 && (
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Làm lại
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {items.map((ex, i) => {
          const st = get(i);
          const ok = st.checked && isCorrect(st.input, ex.answer, ex.alt);
          return (
            <div
              key={i}
              className={`rounded-xl border p-3 transition-colors ${
                st.checked
                  ? ok
                    ? 'border-emerald-400/40 bg-emerald-500/[0.08]'
                    : 'border-rose-400/40 bg-rose-500/[0.08]'
                  : 'border-white/10 bg-white/[0.03]'
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="shrink-0 text-xs font-bold text-slate-400 bg-white/5 px-1.5 py-0.5 rounded">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <span className={`inline-block text-[10px] px-1.5 py-0.5 rounded mb-1.5 ${KIND_COLOR[ex.kind]}`}>
                    {KIND_LABEL[ex.kind]}
                  </span>
                  <p className="text-slate-100 text-sm leading-relaxed">{ex.q}</p>
                  {ex.hint && (
                    <p className="text-slate-400 text-xs mt-1 italic">{ex.hint}</p>
                  )}
                </div>
                {st.checked && (ok
                  ? <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  : <X className="w-4 h-4 text-rose-400 shrink-0" />)}
              </div>

              {/* Ô trả lời */}
              <div className="mt-2.5">
                {ex.options ? (
                  <div className="grid gap-1.5 sm:grid-cols-2">
                    {ex.options.map((opt) => {
                      const chosen = st.input === opt;
                      const isRight = isCorrect(opt, ex.answer, ex.alt);
                      let cls = 'border-white/10 bg-white/[0.02] text-slate-300 hover:border-white/25';
                      if (st.checked) {
                        if (isRight) cls = 'border-emerald-400/50 bg-emerald-500/15 text-white';
                        else if (chosen) cls = 'border-rose-400/50 bg-rose-500/15 text-white';
                        else cls = 'border-white/5 bg-white/[0.01] text-slate-500';
                      } else if (chosen) {
                        cls = 'border-sky-400/50 bg-sky-500/15 text-white';
                      }
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => pick(i, ex, opt)}
                          className={`text-left text-xs rounded-lg border px-3 py-2 leading-relaxed transition-all active:scale-[0.98] ${cls}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={st.input}
                      onChange={(e) => setInput(i, e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') check(i, ex); }}
                      placeholder={
                        ex.kind === 'translate' ? 'Viết câu tiếng Anh…'
                          : ex.kind === 'order' ? 'Viết lại thành câu hoàn chỉnh…'
                            : ex.kind === 'fix' ? 'Viết lại câu đã sửa…'
                              : 'Điền vào đây…'
                      }
                      className="flex-1 min-w-0 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-slate-600 outline-none focus:border-emerald-400/50"
                    />
                    <button
                      type="button"
                      onClick={() => check(i, ex)}
                      className="shrink-0 px-3 py-2 rounded-lg text-sm bg-emerald-500/20 border border-emerald-400/40 text-emerald-100 hover:bg-emerald-500/30 transition-colors"
                    >
                      Kiểm
                    </button>
                  </div>
                )}
              </div>

              {/* Giải thích */}
              {st.checked && (
                <div className="mt-2.5 pt-2.5 border-t border-white/10">
                  {!ok && (
                    <p className="text-xs text-emerald-300 mb-1">
                      Đáp án: <b>{ex.answer}</b>
                      {ex.alt && ex.alt.length > 0 && (
                        <span className="text-slate-500"> (chấp nhận: {ex.alt.join(' · ')})</span>
                      )}
                    </p>
                  )}
                  <p className="text-xs text-slate-300 leading-relaxed flex gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
                    <span>{ex.why}</span>
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {done === items.length && items.length > 0 && (
        <p className="mt-4 text-sm text-center text-slate-300">
          {rightFirst === items.length
            ? '🏆 Đúng hết ngay lần đầu — chắc bài rồi, sang bài sau được.'
            : rightFirst >= items.length * 0.6
              ? '👍 Khá ổn. Đọc lại phần giải thích của những câu sai rồi làm lại một lượt.'
              : '💪 Còn sai nhiều. Quay lên đọc lại phần giảng phía trên rồi làm lại — đừng sang bài mới vội.'}
        </p>
      )}
    </div>
  );
}
