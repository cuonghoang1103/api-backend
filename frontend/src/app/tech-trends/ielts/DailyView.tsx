'use client';

/**
 * Tab Luyện mỗi ngày — 15 câu trộn từ mọi nguồn, kèm chuỗi ngày liên tiếp.
 *
 * Vì sao cần tab này: nội dung khoá học đã đủ nhiều, nhưng người học mở trang
 * ra thường không biết hôm nay nên làm gì, rồi lại đọc lại bài cũ. Ở đây chỉ
 * có một nút: làm 15 câu của hôm nay. Không phải chọn gì cả.
 *
 * Ba quyết định:
 *  - Bộ câu CỐ ĐỊNH THEO NGÀY (gieo số ngẫu nhiên bằng chính ngày hôm đó). Mở
 *    lại giữa chừng vẫn đúng bộ câu đang làm dở, và hai người cùng ngày thì
 *    cùng đề — nói chuyện với nhau được.
 *  - Trộn cả ba nguồn: từ vựng (Việt → Anh), ngữ pháp, và tiếng Anh đời sống.
 *    Ôn xen kẽ nhớ lâu hơn hẳn ôn dồn từng loại.
 *  - Chuỗi ngày (streak) chỉ tăng khi LÀM XONG cả bộ. Mở ra rồi thoát không
 *    tính — nếu không thì con số mất hết ý nghĩa.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Flame, RotateCcw, Check, X, Lightbulb, CalendarDays, Sparkles } from 'lucide-react';
import { LIFE_EXERCISES } from './data/stage1';
import { STAGES } from './data/bundles';
import type { Exercise } from './data/types';
import { isCorrect } from './check';

const DAILY_KEY = 'ielts:s1:daily:v1';
const SIZE = 15;

interface Streak {
  /** Ngày làm xong gần nhất, dạng YYYY-MM-DD. */
  last: string | null;
  streak: number;
  best: number;
  /** 30 ngày gần nhất đã làm xong — vẽ lịch chấm. */
  days: string[];
}

const EMPTY: Streak = { last: null, streak: 0, best: 0, days: [] };

/** YYYY-MM-DD theo giờ MÁY người học, không dùng UTC (lệch múi giờ là lệch ngày). */
function localDay(d: Date): string {
  const p = (n: number): string => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function addDays(iso: string, n: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(y, m - 1, d + n);
  return localDay(dt);
}

/** Bộ sinh số giả ngẫu nhiên có gieo — cùng một ngày luôn ra cùng một bộ câu. */
function seeded(seedText: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < seedText.length; i++) {
    h ^= seedText.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickSome<T>(arr: T[], n: number, rnd: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, n);
}

/** Đổi một từ vựng thành câu hỏi Việt → Anh, đúng cách kiểm ở bài 40. */
function wordToExercise(w: { en: string; vi: string; ipa: string }): Exercise {
  return {
    kind: 'translate',
    q: 'Từ này tiếng Anh là gì?',
    hint: w.vi,
    answer: w.en,
    why: `${w.en} ${w.ipa} — ${w.vi}`,
  };
}

export default function DailyView() {
  const [today, setToday] = useState<string | null>(null);
  const [st, setSt] = useState<Streak>(EMPTY);
  const [hydrated, setHydrated] = useState(false);
  /** Tăng lên khi bấm "bộ câu khác" — đổi hạt giống mà vẫn giữ tính lặp lại. */
  const [variant, setVariant] = useState(0);

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setHydrated(true);
    setToday(localDay(new Date()));
    try {
      const raw = localStorage.getItem(DAILY_KEY);
      if (raw) setSt({ ...EMPTY, ...JSON.parse(raw) });
    } catch {
      /* localStorage bị chặn — vẫn luyện được, chỉ không nhớ chuỗi ngày */
    }
  }, []);

  /**
   * 15 câu của hôm nay: 6 từ vựng + 6 ngữ pháp + 3 đời sống.
   *
   * Gộp từ MỌI chặng đã soạn, không chỉ chặng đang xem. Lý do: mục đích của
   * tab này là giữ nhịp và chống quên, mà thứ dễ quên nhất lại chính là nội
   * dung chặng cũ — nếu chỉ ôn chặng hiện tại thì chặng 1 rơi rụng dần.
   */
  const items = useMemo<Exercise[]>(() => {
    if (!today) return [];
    const rnd = seeded(`${today}#${variant}`);
    const words = STAGES.flatMap((s) => s.allWords);
    const exercises = STAGES.flatMap((s) => s.allExercises);
    return [
      ...pickSome(words, 6, rnd).map(wordToExercise),
      ...pickSome(exercises, 6, rnd),
      ...pickSome(LIFE_EXERCISES, 3, rnd),
    ];
  }, [today, variant]);

  const doneCount = Object.keys(checked).length;
  const score = items.filter((ex, i) => checked[i] && isCorrect(answers[i] ?? '', ex.answer, ex.alt)).length;
  const alreadyToday = hydrated && today !== null && st.last === today;

  const finish = useCallback(() => {
    setFinished(true);
    if (!today) return;
    setSt((prev) => {
      if (prev.last === today) return prev; // hôm nay đã tính rồi, không cộng hai lần
      const yesterday = addDays(today, -1);
      const streak = prev.last === yesterday ? prev.streak + 1 : 1;
      const next: Streak = {
        last: today,
        streak,
        best: Math.max(prev.best, streak),
        days: [...prev.days.filter((d) => d !== today), today].slice(-30),
      };
      try {
        localStorage.setItem(DAILY_KEY, JSON.stringify(next));
      } catch {
        /* bỏ qua */
      }
      return next;
    });
  }, [today]);

  const another = useCallback(() => {
    setVariant((v) => v + 1);
    setAnswers({});
    setChecked({});
    setFinished(false);
  }, []);

  const check = useCallback((i: number) => {
    setChecked((c) => ({ ...c, [i]: true }));
  }, []);

  /** Lịch 14 ngày gần nhất — nhìn thấy khoảng trống thì tự khắc muốn lấp. */
  const calendar = useMemo(() => {
    if (!today) return [];
    return Array.from({ length: 14 }, (_, k) => {
      const d = addDays(today, k - 13);
      return { day: d, done: st.days.includes(d), isToday: d === today };
    });
  }, [today, st.days]);

  if (!hydrated || !today) {
    return <div className="h-40 rounded-2xl border border-white/10 bg-white/[0.02] animate-pulse" />;
  }

  return (
    <div>
      {/* Chuỗi ngày */}
      <div className="rounded-2xl border border-amber-500/25 bg-amber-500/[0.06] p-4 sm:p-5 mb-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Flame className={`w-6 h-6 ${st.streak > 0 ? 'text-amber-400' : 'text-slate-600'}`} />
            </span>
            <div>
              <p className="text-2xl font-bold text-white leading-none">
                {st.streak} <span className="text-sm font-normal text-slate-400">ngày liên tiếp</span>
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Kỷ lục: {st.best} ngày · {alreadyToday ? 'Hôm nay đã xong ✓' : 'Hôm nay chưa làm'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {calendar.map((c) => (
              <span
                key={c.day}
                title={c.day}
                className={`w-4 h-7 rounded ${
                  c.done
                    ? 'bg-amber-400/80'
                    : c.isToday
                      ? 'bg-white/20 ring-1 ring-amber-400/50'
                      : 'bg-white/5'
                }`}
              />
            ))}
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-3 leading-relaxed">
          Mười lăm câu trộn từ ba nguồn: từ vựng (Việt → Anh), ngữ pháp trong bài học, và tiếng Anh đời
          sống. Ôn xen kẽ như vậy nhớ lâu hơn hẳn ôn dồn từng loại. Bộ câu cố định theo ngày — mở lại
          giữa chừng vẫn đúng bộ đang làm dở.
        </p>
      </div>

      {/* Tiến độ */}
      <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <CalendarDays className="w-4 h-4" />
          Bộ câu ngày {today}
          {variant > 0 && <span className="text-xs text-slate-600">(bộ thêm #{variant})</span>}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-lg bg-white/5 text-slate-300">
            Đã làm {doneCount}/{items.length} · Đúng <b className="text-emerald-300">{score}</b>
          </span>
          <button
            type="button"
            onClick={another}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Bộ câu khác
          </button>
        </div>
      </div>

      <div className="h-2 rounded-full bg-white/10 overflow-hidden mb-5">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-500"
          style={{ width: `${(doneCount / (items.length || 1)) * 100}%` }}
        />
      </div>

      {/* Câu hỏi */}
      <div className="space-y-3">
        {items.map((ex, i) => {
          const given = answers[i] ?? '';
          const isChecked = !!checked[i];
          const ok = isChecked && isCorrect(given, ex.answer, ex.alt);
          return (
            <div
              key={i}
              className={`rounded-xl border p-3 transition-colors ${
                isChecked
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
                  <p className="text-slate-100 text-sm leading-relaxed">{ex.q}</p>
                  {ex.hint && <p className="text-sky-200 text-sm mt-1 font-medium">{ex.hint}</p>}
                </div>
                {isChecked && (ok
                  ? <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  : <X className="w-4 h-4 text-rose-400 shrink-0" />)}
              </div>

              <div className="mt-2.5">
                {ex.options ? (
                  <div className="grid gap-1.5 sm:grid-cols-2">
                    {ex.options.map((opt) => {
                      const chosen = given === opt;
                      const isRight = isCorrect(opt, ex.answer, ex.alt);
                      let cls = 'border-white/10 bg-white/[0.02] text-slate-300 hover:border-white/25';
                      if (isChecked) {
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
                          onClick={() => {
                            setAnswers((a) => ({ ...a, [i]: opt }));
                            check(i);
                          }}
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
                      value={given}
                      onChange={(e) => setAnswers((a) => ({ ...a, [i]: e.target.value }))}
                      onKeyDown={(e) => { if (e.key === 'Enter') check(i); }}
                      placeholder="Gõ câu trả lời rồi bấm Enter…"
                      className="flex-1 min-w-0 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-slate-600 outline-none focus:border-amber-400/50"
                    />
                    <button
                      type="button"
                      onClick={() => check(i)}
                      className="shrink-0 px-3 py-2 rounded-lg text-sm bg-amber-500/20 border border-amber-400/40 text-amber-100 hover:bg-amber-500/30 transition-colors"
                    >
                      Kiểm
                    </button>
                  </div>
                )}
              </div>

              {isChecked && (
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

      {/* Kết thúc */}
      <div className="mt-5">
        {doneCount === items.length && items.length > 0 ? (
          finished ? (
            <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/[0.08] p-6 text-center">
              <p className="text-4xl mb-2">{score >= 13 ? '🏆' : score >= 9 ? '👍' : '💪'}</p>
              <p className="text-2xl font-bold text-white">{score}/{items.length}</p>
              <p className="text-slate-300 text-sm mt-2">
                {score >= 13
                  ? 'Rất tốt. Giữ nhịp này là chắc chắn qua chặng 1.'
                  : score >= 9
                    ? 'Ổn. Đọc lại phần giải thích của những câu sai trước khi rời trang.'
                    : 'Còn sai nhiều — nhưng làm đều mới là thứ quan trọng. Mai quay lại nhé.'}
              </p>
              <p className="text-amber-300 text-sm mt-3 flex items-center justify-center gap-1.5">
                <Flame className="w-4 h-4" />
                Chuỗi hiện tại: {st.streak} ngày
              </p>
              <button
                type="button"
                onClick={another}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-sm hover:bg-white/10 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Làm thêm một bộ nữa
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={finish}
              className="w-full px-4 py-3.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-white text-sm font-semibold hover:bg-emerald-500/30 transition-colors"
            >
              Hoàn thành buổi luyện hôm nay {alreadyToday ? '' : '(cộng 1 ngày vào chuỗi)'}
            </button>
          )
        ) : (
          <p className="text-center text-xs text-slate-500">
            Làm hết {items.length} câu rồi bấm hoàn thành để cộng vào chuỗi ngày.
          </p>
        )}
      </div>
    </div>
  );
}
