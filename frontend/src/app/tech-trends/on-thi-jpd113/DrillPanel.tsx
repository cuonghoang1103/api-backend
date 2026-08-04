'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Check, X, RotateCcw, Keyboard, ListChecks, Shuffle, Trophy, Zap, BookOpen } from 'lucide-react';

import TypingPassagePanel from './TypingPassagePanel';

import {
  DRILL_SETS,
  DRILL_STORAGE_KEY,
  buildQueue,
  buildChoices,
  isCorrect,
  type DrillItem,
  type DrillSetId,
  type DrillStat,
} from './data/drill';

/**
 * Khu luyện gõ kana & chữ Hán.
 *
 * Ba kiểu bài, mỗi kiểu ứng với một kỹ năng thi thật:
 *  - 'type'    gõ romaji            → tốc độ đọc, kỹ năng nền của mọi phần thi
 *  - 'choice'  chọn romaji          → dạng "đọc Hán tự → hiragana" (~11% đề FE)
 *  - 'reverse' nhìn âm chọn mặt chữ → dạng "chọn Hán tự đúng" (~11% đề FE)
 *
 * Không gõ được kana trực tiếp nếu máy chưa cài bộ gõ tiếng Nhật, nên
 * chiều ngược lại làm bằng trắc nghiệm chứ không bắt gõ.
 */

type Mode = 'type' | 'choice' | 'reverse';

const MODES: { id: Mode; label: string; sub: string; icon: typeof Keyboard }[] = [
  { id: 'type', label: 'Gõ romaji', sub: 'nhìn chữ → gõ cách đọc', icon: Keyboard },
  { id: 'choice', label: 'Chọn cách đọc', sub: 'nhìn chữ → chọn 1 trong 4', icon: ListChecks },
  { id: 'reverse', label: 'Chọn mặt chữ', sub: 'nhìn cách đọc → chọn chữ', icon: Shuffle },
];

const ROUND_SIZE = 20;

interface Answered {
  item: DrillItem;
  ok: boolean;
  given: string;
}

export default function DrillPanel() {
  // Hai kiểu luyện rất khác nhau nên tách bằng nút chuyển ở đây thay vì
  // thêm tab thứ 7 trên thanh chính (đã 6 tab, thêm nữa là quá tải).
  const [area, setArea] = useState<'char' | 'passage'>('char');

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-2.5">
        {[
          { id: 'char' as const, label: 'Luyện từng chữ', sub: 'kana & kanji rời, vòng 20 chữ', icon: Keyboard },
          { id: 'passage' as const, label: 'Gõ cả đoạn văn', sub: '20 bài trong giáo trình, dễ → khó', icon: BookOpen },
        ].map((a) => {
          const Icon = a.icon;
          return (
            <button
              key={a.id}
              onClick={() => setArea(a.id)}
              className={`flex items-start gap-2.5 text-left px-4 py-3.5 rounded-xl border transition-all active:scale-95 ${
                area === a.id
                  ? 'bg-neon-violet/15 border-neon-violet/45 text-white'
                  : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:border-white/25'
              }`}
            >
              <Icon className="w-4 h-4 mt-0.5 shrink-0" />
              <span>
                <span className="block text-sm font-semibold">{a.label}</span>
                <span className="block text-[11px] text-slate-500 mt-0.5">{a.sub}</span>
              </span>
            </button>
          );
        })}
      </div>

      {area === 'passage' ? <TypingPassagePanel /> : <CharDrill />}
    </div>
  );
}

function CharDrill() {
  const [setId, setSetId] = useState<DrillSetId>('hira-base');
  const [mode, setMode] = useState<Mode>('type');
  const [stats, setStats] = useState<Record<string, DrillStat>>({});
  const [mounted, setMounted] = useState(false);

  const [queue, setQueue] = useState<DrillItem[]>([]);
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<'none' | 'right' | 'wrong'>('none');
  const [answered, setAnswered] = useState<Answered[]>([]);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeSet = DRILL_SETS.find((s) => s.id === setId) ?? DRILL_SETS[0];
  const current = queue[idx];
  const finished = queue.length > 0 && idx >= queue.length;

  /* ── Hydrate thống kê ─────────────────────────────────────── */
  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(DRILL_STORAGE_KEY);
      if (raw) setStats(JSON.parse(raw));
    } catch {
      /* dữ liệu hỏng — coi như chưa luyện lần nào */
    }
  }, []);

  // Dọn timer khi rời trang, tránh setState trên component đã unmount
  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const persistStats = useCallback((next: Record<string, DrillStat>) => {
    setStats(next);
    try {
      localStorage.setItem(DRILL_STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* hết quota / chế độ riêng tư — thống kê chỉ còn trong phiên này */
    }
  }, []);

  const startRound = useCallback(
    (onlyWrong?: DrillItem[]) => {
      const source = onlyWrong?.length ? onlyWrong : activeSet.items;
      const size = onlyWrong?.length ? onlyWrong.length : Math.min(ROUND_SIZE, source.length);
      setQueue(buildQueue(source, stats, size));
      setIdx(0);
      setInput('');
      setFeedback('none');
      setAnswered([]);
      setStreak(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    },
    [activeSet, stats],
  );

  // Vòng đầu tiên + đổi bộ/đổi kiểu bài thì bắt đầu lại
  useEffect(() => {
    if (!mounted) return;
    setQueue(buildQueue(activeSet.items, {}, Math.min(ROUND_SIZE, activeSet.items.length)));
    setIdx(0);
    setInput('');
    setFeedback('none');
    setAnswered([]);
    setStreak(0);
    // `stats` cố tình không nằm trong deps: mỗi lần trả lời stats đổi,
    // đưa vào đây sẽ khởi động lại vòng ngay giữa chừng.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setId, mode, mounted]);

  const record = useCallback(
    (item: DrillItem, ok: boolean, given: string) => {
      const s = stats[item.char] ?? { right: 0, wrong: 0 };
      persistStats({
        ...stats,
        [item.char]: { right: s.right + (ok ? 1 : 0), wrong: s.wrong + (ok ? 0 : 1) },
      });
      setAnswered((a) => [...a, { item, ok, given }]);
      setStreak((v) => {
        const next = ok ? v + 1 : 0;
        setBestStreak((b) => Math.max(b, next));
        return next;
      });
    },
    [stats, persistStats],
  );

  const next = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setFeedback('none');
    setInput('');
    setIdx((i) => i + 1);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const submitTyped = useCallback(() => {
    if (!current || feedback !== 'none') return;
    const ok = isCorrect(input, current);
    record(current, ok, input);
    setFeedback(ok ? 'right' : 'wrong');
    // Đúng thì chạy tiếp luôn cho giữ nhịp; sai thì dừng lại để người
    // học kịp nhìn đáp án, tự bấm mới đi tiếp.
    if (ok) timerRef.current = setTimeout(next, 420);
  }, [current, input, feedback, record, next]);

  const pickChoice = useCallback(
    (value: string) => {
      if (!current || feedback !== 'none') return;
      const ok = mode === 'reverse' ? value === current.char : isCorrect(value, current);
      record(current, ok, value);
      setFeedback(ok ? 'right' : 'wrong');
      setInput(value);
      if (ok) timerRef.current = setTimeout(next, 420);
    },
    [current, feedback, mode, record, next],
  );

  const choices = useMemo(() => {
    if (!current || mode === 'type') return [];
    return buildChoices(current, activeSet.items, mode === 'reverse');
  }, [current, mode, activeSet]);

  const wrongItems = useMemo(
    () => answered.filter((a) => !a.ok).map((a) => a.item),
    [answered],
  );

  const rightCount = answered.filter((a) => a.ok).length;
  const accuracy = answered.length ? Math.round((rightCount / answered.length) * 100) : 0;

  /* ── Chữ đang yếu (toàn bộ lịch sử) ───────────────────────── */
  const weakChars = useMemo(() => {
    if (!mounted) return [];
    return Object.entries(stats)
      .filter(([, s]) => s.wrong > 0)
      .sort((a, b) => b[1].wrong - a[1].wrong)
      .slice(0, 16);
  }, [stats, mounted]);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-neon-cyan/25 bg-neon-cyan/[0.05] p-5 sm:p-6">
        <h2 className="flex items-center gap-2 text-lg font-heading font-bold text-white mb-2">
          <Zap className="w-5 h-5 text-neon-cyan" />
          Luyện tới khi thành phản xạ
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          Nhìn bảng và <b className="text-white">nhận ra</b> mặt chữ là kỹ năng dễ; đọc bật ra ngay
          không kịp nghĩ mới là thứ phòng thi cần. Mỗi vòng {ROUND_SIZE} chữ, chữ nào bạn từng sai
          sẽ quay lại thường xuyên hơn. Kết quả lưu trên máy bạn.
        </p>
      </section>

      {/* Chọn bộ chữ */}
      <div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2.5">Chọn bộ chữ</div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5">
          {DRILL_SETS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSetId(s.id)}
              className={`text-left px-4 py-3 rounded-xl border transition-all active:scale-95 ${
                setId === s.id
                  ? 'bg-neon-violet/15 border-neon-violet/45 text-white'
                  : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:border-white/25'
              }`}
            >
              <span className="block text-sm font-semibold">{s.label}</span>
              <span className="block text-[11px] text-slate-500 mt-0.5">{s.sub}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chọn kiểu bài */}
      <div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2.5">Kiểu bài</div>
        <div className="grid sm:grid-cols-3 gap-2.5">
          {MODES.map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`flex items-start gap-2.5 text-left px-4 py-3 rounded-xl border transition-all active:scale-95 ${
                  mode === m.id
                    ? 'bg-neon-cyan/15 border-neon-cyan/45 text-white'
                    : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:border-white/25'
                }`}
              >
                <Icon className="w-4 h-4 mt-0.5 shrink-0" />
                <span>
                  <span className="block text-sm font-semibold">{m.label}</span>
                  <span className="block text-[11px] text-slate-500 mt-0.5">{m.sub}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sân luyện */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-8">
        {!mounted ? (
          <div className="h-64 flex items-center justify-center text-sm text-slate-500">Đang tải…</div>
        ) : finished ? (
          <RoundSummary
            total={answered.length}
            right={rightCount}
            accuracy={accuracy}
            bestStreak={bestStreak}
            wrong={answered.filter((a) => !a.ok)}
            onAgain={() => startRound()}
            onDrillWrong={() => startRound(wrongItems)}
          />
        ) : current ? (
          <>
            {/* Thanh trạng thái */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-4 text-xs">
                <span className="text-slate-400">
                  Câu <b className="text-white">{idx + 1}</b>/{queue.length}
                </span>
                <span className="text-slate-400">
                  Đúng <b className="text-neon-green">{rightCount}</b>
                </span>
                {streak >= 3 && (
                  <span className="inline-flex items-center gap-1 text-neon-orange font-semibold">
                    <Zap className="w-3.5 h-3.5" />
                    {streak} liên tiếp
                  </span>
                )}
              </div>
              <button
                onClick={() => startRound()}
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-white transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Vòng mới
              </button>
            </div>

            <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden mb-8">
              <div
                className="h-full rounded-full bg-gradient-to-r from-neon-violet to-neon-cyan transition-all duration-300"
                style={{ width: `${(idx / queue.length) * 100}%` }}
              />
            </div>

            {/* Đề bài */}
            <div className="text-center mb-7">
              <div
                className={`inline-block leading-none transition-colors ${
                  mode === 'reverse' ? 'text-5xl sm:text-6xl font-mono' : 'text-7xl sm:text-8xl'
                } ${
                  feedback === 'right'
                    ? 'text-neon-green'
                    : feedback === 'wrong'
                      ? 'text-neon-red'
                      : 'text-white'
                }`}
              >
                {mode === 'reverse' ? current.answers[0] : current.char}
              </div>
              {mode === 'reverse' && current.reading && (
                <div className="text-sm text-slate-500 mt-3">{current.reading}</div>
              )}
            </div>

            {/* Nhập / chọn */}
            {mode === 'type' ? (
              <div className="max-w-sm mx-auto">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key !== 'Enter') return;
                    if (feedback === 'none') submitTyped();
                    else next();
                  }}
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  placeholder="gõ cách đọc rồi Enter"
                  className={`w-full px-4 py-3.5 rounded-xl bg-white/[0.04] border text-center text-lg text-white placeholder:text-slate-600 focus:outline-none transition-colors ${
                    feedback === 'right'
                      ? 'border-neon-green'
                      : feedback === 'wrong'
                        ? 'border-neon-red'
                        : 'border-white/15 focus:border-neon-violet/60'
                  }`}
                />
                {feedback === 'none' && (
                  <button
                    onClick={submitTyped}
                    className="w-full mt-3 px-4 py-2.5 rounded-xl bg-neon-violet/15 border border-neon-violet/40 text-sm font-medium text-white hover:bg-neon-violet/25 transition-colors active:scale-95"
                  >
                    Kiểm tra (Enter)
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5 max-w-lg mx-auto">
                {choices.map((c) => {
                  const isRight =
                    mode === 'reverse' ? c === current.char : isCorrect(c, current);
                  const chosen = input === c;
                  let cls = 'border-white/12 bg-white/[0.03] text-white hover:border-neon-violet/45';
                  if (feedback !== 'none') {
                    if (isRight) cls = 'border-neon-green/60 bg-neon-green/10 text-neon-green';
                    else if (chosen) cls = 'border-neon-red/60 bg-neon-red/10 text-neon-red';
                    else cls = 'border-white/8 bg-white/[0.02] text-slate-600';
                  }
                  return (
                    <button
                      key={c}
                      onClick={() => pickChoice(c)}
                      disabled={feedback !== 'none'}
                      className={`px-4 py-4 rounded-xl border transition-all active:scale-95 ${cls} ${
                        mode === 'reverse' ? 'text-3xl' : 'text-lg font-mono'
                      }`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Phản hồi */}
            {feedback !== 'none' && (
              <div className="mt-6 max-w-lg mx-auto">
                <div
                  className={`rounded-xl border p-4 ${
                    feedback === 'right'
                      ? 'border-neon-green/30 bg-neon-green/[0.07]'
                      : 'border-neon-red/30 bg-neon-red/[0.07]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    {feedback === 'right' ? (
                      <>
                        <Check className="w-4 h-4 text-neon-green" strokeWidth={3} />
                        <span className="text-sm font-bold text-neon-green">Đúng</span>
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4 text-neon-red" strokeWidth={3} />
                        <span className="text-sm font-bold text-neon-red">
                          {current.char} = {current.answers[0]}
                          {current.reading ? ` (${current.reading})` : ''}
                        </span>
                      </>
                    )}
                  </div>
                  {current.hint && (
                    <p className="text-[13px] text-slate-300 leading-relaxed">{current.hint}</p>
                  )}
                  {current.answers.length > 1 && feedback === 'wrong' && (
                    <p className="text-[12px] text-slate-500 mt-1.5">
                      Cách đọc chấp nhận: {current.answers.join(' · ')}
                    </p>
                  )}
                </div>
                {feedback === 'wrong' && (
                  <button
                    onClick={next}
                    className="w-full mt-3 px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/15 text-sm font-medium text-white hover:border-neon-violet/40 transition-colors active:scale-95"
                  >
                    Chữ tiếp theo (Enter)
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-10">
            <button
              onClick={() => startRound()}
              className="px-5 py-3 rounded-xl bg-neon-violet/15 border border-neon-violet/40 text-sm font-medium text-white hover:bg-neon-violet/25 transition-colors"
            >
              Bắt đầu luyện
            </button>
          </div>
        )}
      </section>

      {/* Chữ đang yếu */}
      {weakChars.length > 0 && (
        <section className="rounded-2xl border border-neon-red/25 bg-neon-red/[0.04] p-5">
          <h3 className="text-sm font-bold text-white mb-1">Những chữ bạn hay sai nhất</h3>
          <p className="text-xs text-slate-500 mb-4">
            Tính trên toàn bộ lịch sử luyện. Đây chính là danh sách cần chép tay thêm.
          </p>
          <div className="flex flex-wrap gap-2">
            {weakChars.map(([char, s]) => (
              <div
                key={char}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/[0.03]"
              >
                <span className="text-xl text-white leading-none">{char}</span>
                <span className="text-[11px] text-neon-red font-semibold">sai {s.wrong}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function RoundSummary({
  total,
  right,
  accuracy,
  bestStreak,
  wrong,
  onAgain,
  onDrillWrong,
}: {
  total: number;
  right: number;
  accuracy: number;
  bestStreak: number;
  wrong: Answered[];
  onAgain: () => void;
  onDrillWrong: () => void;
}) {
  const pass = accuracy >= 90;
  return (
    <div>
      <div className="text-center mb-7">
        <div
          className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
            pass ? 'bg-neon-green/15' : 'bg-neon-orange/15'
          }`}
        >
          <Trophy className={`w-8 h-8 ${pass ? 'text-neon-green' : 'text-neon-orange'}`} />
        </div>
        <div className="text-4xl font-heading font-bold text-white mb-1">
          {right}/{total}
        </div>
        <div className={`text-sm font-semibold ${pass ? 'text-neon-green' : 'text-neon-orange'}`}>
          Chính xác {accuracy}% · chuỗi dài nhất {bestStreak}
        </div>
        <p className="text-[13px] text-slate-400 mt-3 max-w-md mx-auto leading-relaxed">
          {pass
            ? 'Đạt ngưỡng. Bộ này coi như xong — chuyển sang bộ khác hoặc đổi sang kiểu bài khó hơn.'
            : 'Chưa đạt ngưỡng 90%. Luyện lại đúng những chữ vừa sai trước khi làm vòng mới — đó là cách nhanh nhất.'}
        </p>
      </div>

      {wrong.length > 0 && (
        <div className="mb-6">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2.5">
            {wrong.length} chữ sai trong vòng này
          </div>
          <div className="space-y-2">
            {wrong.map((w, i) => (
              <div
                key={`${w.item.char}-${i}`}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5"
              >
                <span className="text-2xl text-white leading-none w-9">{w.item.char}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-neon-green">
                    {w.item.answers.join(' · ')}
                    {w.item.reading ? ` — ${w.item.reading}` : ''}
                  </div>
                  {w.item.hint && (
                    <div className="text-[12px] text-slate-500 leading-relaxed">{w.item.hint}</div>
                  )}
                </div>
                {w.given && (
                  <span className="text-[11px] text-neon-red shrink-0">bạn gõ: {w.given}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3 justify-center">
        {wrong.length > 0 && (
          <button
            onClick={onDrillWrong}
            className="px-5 py-2.5 rounded-xl bg-neon-red/15 border border-neon-red/40 text-sm font-medium text-white hover:bg-neon-red/25 transition-colors active:scale-95"
          >
            Luyện lại {wrong.length} chữ sai
          </button>
        )}
        <button
          onClick={onAgain}
          className="px-5 py-2.5 rounded-xl bg-neon-violet/15 border border-neon-violet/40 text-sm font-medium text-white hover:bg-neon-violet/25 transition-colors active:scale-95"
        >
          Vòng mới
        </button>
      </div>
    </div>
  );
}
