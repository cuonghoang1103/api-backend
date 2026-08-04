'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Check,
  X,
  RotateCcw,
  Eye,
  EyeOff,
  Trophy,
  Zap,
  Timer,
  BookOpen,
  AlertTriangle,
} from 'lucide-react';

import {
  TYPING_PASSAGES,
  TYPING_STORAGE_KEY,
  LEVEL_META,
  KANA_TRAPS,
  tokenize,
  matchToken,
  type Token,
  type TypingPassage,
} from './data/typing';

/**
 * Luyện gõ cả đoạn văn.
 *
 * Người học gõ ROMAJI (chưa ai cài bộ gõ tiếng Nhật ở trình độ này), mỗi
 * kana gõ đúng thì sáng xanh tại chỗ. Gõ sai không làm kẹt bài — ký tự
 * nháy đỏ, được ghi vào sổ lỗi, rồi vẫn cho gõ tiếp; dừng lại giữa chừng
 * chỉ làm mất nhịp và nản.
 *
 * Xử lý ん giống hệt bộ gõ thật: "n" chưa quyết định ngay mà chờ ký tự
 * kế — gõ "nn" thì xong ん, gõ "na" thì ん xong rồi な bắt đầu.
 */

interface TypedError {
  index: number;
  expected: string;
  typed: string;
}

interface BestRecord {
  /** ký tự kana mỗi phút */
  kpm: number;
  accuracy: number;
}

export default function TypingPassagePanel() {
  const [mounted, setMounted] = useState(false);
  const [passage, setPassage] = useState<TypingPassage>(TYPING_PASSAGES[0]);
  const [showHint, setShowHint] = useState(true);
  const [best, setBest] = useState<Record<string, BestRecord>>({});

  const tokens = useMemo(() => tokenize(passage.reading), [passage]);

  const [pos, setPos] = useState(0);
  const [buffer, setBuffer] = useState('');
  const [errors, setErrors] = useState<TypedError[]>([]);
  const [flash, setFlash] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Trạng thái gõ thật nằm ở ref, không phải state.
   *
   * State React cập nhật bất đồng bộ: gõ hai phím nhanh hơn một lần
   * re-render thì phím thứ hai đọc phải `pos`/`buffer` cũ và bị nuốt.
   * Ref cập nhật ngay lập tức nên gõ nhanh cỡ nào cũng không mất ký tự;
   * state chỉ còn nhiệm vụ vẽ lại màn hình.
   */
  const engine = useRef<{ pos: number; buf: string; errs: TypedError[] }>({
    pos: 0,
    buf: '',
    errs: [],
  });

  /* ── Hydrate ─────────────────────────────────────────────── */
  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(TYPING_STORAGE_KEY);
      if (raw) setBest(JSON.parse(raw));
    } catch {
      /* dữ liệu hỏng — coi như chưa có kỷ lục */
    }
  }, []);

  /** Vị trí gõ được đầu tiên từ `from` (nhảy qua dấu câu) */
  const skipForward = useCallback(
    (from: number) => {
      let i = from;
      while (i < tokens.length && tokens[i].kind === 'skip') i++;
      return i;
    },
    [tokens],
  );

  const reset = useCallback(() => {
    const start = skipForward(0);
    engine.current = { pos: start, buf: '', errs: [] };
    setPos(start);
    setBuffer('');
    setErrors([]);
    setStartedAt(null);
    setElapsed(0);
    if (inputRef.current) inputRef.current.value = '';
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [skipForward]);

  // Đổi bài thì làm lại từ đầu
  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passage]);

  const finished = pos >= tokens.length;

  /* ── Đồng hồ ─────────────────────────────────────────────── */
  useEffect(() => {
    if (startedAt === null || finished) return;
    const id = setInterval(() => setElapsed(Date.now() - startedAt), 200);
    return () => clearInterval(id);
  }, [startedAt, finished]);

  const typedCount = tokens.filter((t, i) => i < pos && t.kind !== 'skip').length;
  const totalCount = tokens.filter((t) => t.kind !== 'skip').length;
  const accuracy =
    typedCount + errors.length === 0
      ? 100
      : Math.round((typedCount / (typedCount + errors.length)) * 100);
  const kpm = elapsed > 1000 ? Math.round((typedCount / (elapsed / 60000)) * 10) / 10 : 0;

  /* ── Lưu kỷ lục khi xong bài ─────────────────────────────── */
  useEffect(() => {
    if (!finished || !mounted || elapsed === 0) return;
    const rec: BestRecord = { kpm, accuracy };
    const cur = best[passage.id];
    if (cur && cur.kpm >= rec.kpm) return;
    const next = { ...best, [passage.id]: rec };
    setBest(next);
    try {
      localStorage.setItem(TYPING_STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* hết quota */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  /* ── Bộ máy gõ ───────────────────────────────────────────── */

  /**
   * Nạp một ký tự. Trả về state mới để vòng lặp ngoài dùng tiếp —
   * viết kiểu thuần hàm vì một lần onChange có thể đến nhiều ký tự
   * (gõ nhanh, hoặc bàn phím mobile gửi cả cụm).
   */
  const feed = useCallback(
    (
      c: string,
      state: { pos: number; buf: string; errs: TypedError[] },
      depth = 0,
    ): { pos: number; buf: string; errs: TypedError[]; bad: boolean } => {
      const { pos: p, buf, errs } = state;
      if (p >= tokens.length) return { pos: p, buf, errs, bad: false };
      const token = tokens[p];

      /**
       * ん/ン xử lý y như bộ gõ thật, và đây là chỗ dễ sai nhất.
       *
       * "n" một mình chưa quyết định được, vì ん đứng trước hàng な gây
       * nhập nhằng: こんにちは gõ "konnichiha" thì cụm "nni" phải hiểu là
       * ん + に, còn せんせい gõ "sennsei" thì "nn" là ん rồi せ mới bắt
       * đầu. Nên phải chờ tới ký tự thứ ba mới chốt.
       */
      const isN = token.char === 'ん' || token.char === 'ン';
      if (isN) {
        if (buf === '' && c === 'n') return { pos: p, buf: 'n', errs, bad: false };

        if (buf === 'n') {
          if (c === 'n') return { pos: p, buf: 'nn', errs, bad: false };
          // Ký tự khác 'n' → ん chốt bằng "n", ký tự này thuộc token kế
          const advanced = skipForward(p + 1);
          if (depth > 2) return { pos: advanced, buf: '', errs, bad: false };
          return feed(c, { pos: advanced, buf: '', errs }, depth + 1);
        }

        if (buf === 'nn') {
          const advanced = skipForward(p + 1);
          if (depth > 2) return { pos: advanced, buf: '', errs, bad: false };
          /**
           * Nguyên âm ngay sau "nn" chỉ thuộc về token kế khi token đó
           * thật sự bắt đầu bằng "n" (hàng な). こんにちは gõ "konnichiha"
           * thì "nni" = ん + に; nhưng はっせんえん gõ "…sennen" thì "nne"
           * phải là ん + え, vì え không hề bắt đầu bằng "n".
           */
          const nextStartsWithN =
            advanced < tokens.length && tokens[advanced].answers.some((a) => a.startsWith('n'));
          const keepN = 'aiueo'.includes(c) && nextStartsWithN;
          return feed(c, { pos: advanced, buf: keepN ? 'n' : '', errs }, depth + 1);
        }
      }

      const attempt = buf + c;
      const r = matchToken(attempt, token);

      if (r === 'match') {
        return { pos: skipForward(p + 1), buf: '', errs, bad: false };
      }
      if (r === 'prefix') {
        return { pos: p, buf: attempt, errs, bad: false };
      }
      // Sai: ghi sổ lỗi, xoá buffer, KHÔNG tiến — cho gõ lại ký tự đó
      return {
        pos: p,
        buf: '',
        errs: [...errs, { index: p, expected: token.char, typed: attempt }],
        bad: true,
      };
    },
    [tokens, skipForward],
  );

  const handleInput = useCallback(
    (raw: string) => {
      if (finished) return;
      if (startedAt === null) setStartedAt(Date.now());

      // Chỉ nhận chữ Latinh và dấu trừ (cho ー)
      const chars = raw.toLowerCase().replace(/[^a-z-]/g, '');
      if (!chars) return;

      let state = engine.current;
      let anyBad = false;
      for (const c of chars) {
        const r = feed(c, state);
        state = { pos: r.pos, buf: r.buf, errs: r.errs };
        if (r.bad) anyBad = true;
      }

      // ん ở CUỐI bài không bao giờ có ký tự sau để chốt, nên phải tự
      // chốt ở đây — nếu không bài treo mãi ở chữ cuối.
      if (state.pos < tokens.length) {
        const t = tokens[state.pos];
        const isN = t.char === 'ん' || t.char === 'ン';
        const isLast = skipForward(state.pos + 1) >= tokens.length;
        if (isN && isLast && (state.buf === 'n' || state.buf === 'nn')) {
          state = { ...state, pos: tokens.length, buf: '' };
        }
      }

      engine.current = state;
      setPos(state.pos);
      setBuffer(state.buf);
      setErrors(state.errs);
      if (anyBad) {
        setFlash(true);
        setTimeout(() => setFlash(false), 220);
      }
    },
    [finished, startedAt, feed, tokens, skipForward],
  );

  /* ── Gom lỗi để tổng kết ─────────────────────────────────── */
  const errorSummary = useMemo(() => {
    const map = new Map<string, { count: number; typed: Set<string> }>();
    for (const e of errors) {
      const cur = map.get(e.expected) ?? { count: 0, typed: new Set<string>() };
      cur.count++;
      if (e.typed) cur.typed.add(e.typed);
      map.set(e.expected, cur);
    }
    return [...map.entries()]
      .map(([char, v]) => ({ char, count: v.count, typed: [...v.typed] }))
      .sort((a, b) => b.count - a.count);
  }, [errors]);

  const byLevel = useMemo(() => {
    const g: Record<number, TypingPassage[]> = {};
    for (const p of TYPING_PASSAGES) (g[p.level] ??= []).push(p);
    return g;
  }, []);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-neon-violet/25 bg-neon-violet/[0.05] p-5 sm:p-6">
        <h2 className="flex items-center gap-2 text-lg font-heading font-bold text-white mb-2">
          <BookOpen className="w-5 h-5 text-neon-violet" />
          Gõ cả đoạn văn — 20 bài từ dễ tới khó
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          Bạn gõ bằng <b className="text-white">romaji</b> (wa → わ, shi → し). Mỗi chữ đúng sẽ{' '}
          <b className="text-neon-green">sáng xanh</b> ngay tại chỗ; gõ sai thì chữ đó{' '}
          <b className="text-neon-red">nháy đỏ</b> và được ghi vào bảng lỗi cuối bài — nhưng bài
          không bị kẹt, cứ gõ lại là đi tiếp. Dấu câu 。、 tự nhảy qua, không phải gõ.
        </p>
      </section>

      {/* Chọn bài */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((lv) => {
          const meta = LEVEL_META[lv];
          return (
            <div key={lv}>
              <div className="text-[11px] font-bold uppercase tracking-wide mb-2" style={{ color: meta.color }}>
                {meta.label}
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {(byLevel[lv] ?? []).map((p) => {
                  const active = passage.id === p.id;
                  const rec = mounted ? best[p.id] : undefined;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setPassage(p)}
                      className={`text-left px-3.5 py-2.5 rounded-xl border transition-all active:scale-95 ${
                        active
                          ? 'bg-white/[0.08] border-white/30 text-white'
                          : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:border-white/25'
                      }`}
                    >
                      <span className="block text-[13px] font-semibold leading-snug">{p.title}</span>
                      <span className="block text-[10px] text-slate-500 mt-0.5">
                        {rec ? `✓ ${rec.kpm} chữ/phút · ${rec.accuracy}%` : p.source.split('·')[0].trim()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sân gõ */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <div className="text-sm font-bold text-white">{passage.title}</div>
            <div className="text-[11px] text-slate-500">{passage.source}</div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHint(!showHint)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-white/[0.04] border border-white/10 text-slate-300 hover:text-white transition-colors"
            >
              {showHint ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              Gợi ý
            </button>
            <button
              onClick={reset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-white/[0.04] border border-white/10 text-slate-300 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Gõ lại
            </button>
          </div>
        </div>

        {/* Bản gốc có kanji */}
        <div className="rounded-xl border border-white/[0.08] bg-black/25 px-4 py-3 mb-4">
          <div className="text-[10px] font-bold tracking-wider text-slate-500 mb-1.5">
            BẢN GỐC — đúng như đề thi in ra
          </div>
          <p className="text-[15px] leading-relaxed text-slate-300">{passage.text}</p>
        </div>

        {/* Khu gõ */}
        <div
          className={`rounded-xl border px-4 py-5 mb-4 transition-colors ${
            flash ? 'border-neon-red/60 bg-neon-red/[0.06]' : 'border-white/10 bg-white/[0.02]'
          }`}
          onClick={() => inputRef.current?.focus()}
        >
          <div className="text-[10px] font-bold tracking-wider text-slate-500 mb-3">
            GÕ THEO CÁCH ĐỌC
          </div>
          <p className="text-2xl sm:text-3xl leading-[1.9] tracking-wide break-words">
            {tokens.map((t, i) => (
              <TokenSpan key={i} token={t} index={i} pos={pos} finished={finished} />
            ))}
          </p>
        </div>

        {/* Ô nhập + gợi ý */}
        {!finished ? (
          <>
            {/* Ô nhập KHÔNG controlled theo buffer: nếu để React quản value,
                lúc gõ nhanh value chưa kịp reset thì ký tự cũ bị xử lý lại
                và tính thành lỗi oan. Ở đây nhận xong là xoá ngay, nên mỗi
                lần onChange chỉ chứa đúng ký tự vừa gõ. */}
            <input
              ref={inputRef}
              type="text"
              defaultValue=""
              onChange={(e) => {
                const v = e.target.value;
                e.target.value = '';
                handleInput(v);
              }}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              placeholder="Bấm vào đây rồi gõ romaji…"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/15 text-center text-lg text-white placeholder:text-slate-600 focus:outline-none focus:border-neon-violet/60 transition-colors"
            />
            {buffer && (
              <p className="text-center text-xs text-slate-500 mt-2">
                đang gõ: <b className="text-neon-cyan font-mono text-sm">{buffer}</b>
              </p>
            )}
            {showHint && tokens[pos] && (
              <p className="text-center text-sm text-slate-500 mt-3">
                Chữ tiếp theo: <b className="text-white text-lg">{tokens[pos].char}</b> — gõ{' '}
                <b className="text-neon-cyan font-mono">{tokens[pos].answers[0]}</b>
                {tokens[pos].answers.length > 1 && (
                  <span className="text-slate-600"> (hoặc {tokens[pos].answers.slice(1).join(', ')})</span>
                )}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center gap-5 mt-5 text-xs text-slate-400">
              <span>
                <b className="text-white">{typedCount}</b>/{totalCount} chữ
              </span>
              <span className="inline-flex items-center gap-1">
                <Timer className="w-3.5 h-3.5" />
                {(elapsed / 1000).toFixed(0)}s
              </span>
              <span className="inline-flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                {kpm} chữ/phút
              </span>
              <span className={errors.length ? 'text-neon-red' : ''}>
                {errors.length} lỗi
              </span>
            </div>
          </>
        ) : (
          <Summary
            passage={passage}
            typedCount={typedCount}
            errors={errors}
            errorSummary={errorSummary}
            kpm={kpm}
            accuracy={accuracy}
            elapsed={elapsed}
            onAgain={reset}
          />
        )}
      </section>
    </div>
  );
}

function TokenSpan({
  token,
  index,
  pos,
  finished,
}: {
  token: Token;
  index: number;
  pos: number;
  finished: boolean;
}) {
  if (token.kind === 'skip') {
    return <span className={index < pos ? 'text-neon-green/60' : 'text-slate-600'}>{token.char}</span>;
  }
  const done = index < pos;
  const current = index === pos && !finished;
  return (
    <span
      className={
        done
          ? 'text-neon-green'
          : current
            ? 'text-white bg-neon-violet/30 rounded px-0.5 outline outline-2 outline-neon-violet/60'
            : 'text-slate-600'
      }
    >
      {token.char}
    </span>
  );
}

function Summary({
  passage,
  typedCount,
  errors,
  errorSummary,
  kpm,
  accuracy,
  elapsed,
  onAgain,
}: {
  passage: TypingPassage;
  typedCount: number;
  errors: TypedError[];
  errorSummary: { char: string; count: number; typed: string[] }[];
  kpm: number;
  accuracy: number;
  elapsed: number;
  onAgain: () => void;
}) {
  const good = accuracy >= 95;
  return (
    <div>
      <div className="text-center mb-7">
        <div
          className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
            good ? 'bg-neon-green/15' : 'bg-neon-orange/15'
          }`}
        >
          <Trophy className={`w-8 h-8 ${good ? 'text-neon-green' : 'text-neon-orange'}`} />
        </div>
        <div className="text-3xl font-heading font-bold text-white mb-1">Xong bài</div>
        <div className="flex flex-wrap items-center justify-center gap-5 text-sm mt-3">
          <span className="text-slate-400">
            Chính xác <b className={good ? 'text-neon-green' : 'text-neon-orange'}>{accuracy}%</b>
          </span>
          <span className="text-slate-400">
            Tốc độ <b className="text-white">{kpm}</b> chữ/phút
          </span>
          <span className="text-slate-400">
            Thời gian <b className="text-white">{(elapsed / 1000).toFixed(0)}s</b>
          </span>
          <span className="text-slate-400">
            Gõ được <b className="text-white">{typedCount}</b> chữ
          </span>
        </div>
      </div>

      {/* Bảng lỗi + giải thích */}
      {errorSummary.length > 0 ? (
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-bold text-neon-red uppercase tracking-wide mb-3">
            <AlertTriangle className="w-4 h-4" />
            {errorSummary.length} chữ gõ sai · tổng {errors.length} lần
          </div>
          <div className="space-y-2">
            {errorSummary.map((e) => (
              <div
                key={e.char}
                className="rounded-xl border border-neon-red/25 bg-neon-red/[0.05] px-4 py-3"
              >
                <div className="flex flex-wrap items-center gap-3 mb-1">
                  <span className="text-2xl text-white leading-none">{e.char}</span>
                  <span className="text-sm text-neon-green font-mono">
                    đúng phải gõ: {tokenAnswer(e.char)}
                  </span>
                  {e.typed.length > 0 && (
                    <span className="text-xs text-neon-red">bạn gõ: {e.typed.join(', ')}</span>
                  )}
                  {e.count > 1 && (
                    <span className="text-[11px] text-slate-500 ml-auto">sai {e.count} lần</span>
                  )}
                </div>
                {KANA_TRAPS[e.char] && (
                  <p className="text-[13px] text-slate-300 leading-relaxed">{KANA_TRAPS[e.char]}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-neon-green/25 bg-neon-green/[0.06] px-4 py-3 mb-6 text-center">
          <Check className="w-5 h-5 text-neon-green inline mr-2" strokeWidth={3} />
          <span className="text-sm text-white font-semibold">Không sai chữ nào. Sang bài khó hơn.</span>
        </div>
      )}

      {/* Dịch nghĩa */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 mb-4">
        <div className="text-[10px] font-bold tracking-wider text-slate-500 mb-1.5">NGHĨA CẢ ĐOẠN</div>
        <p className="text-[14px] text-slate-300 leading-relaxed">{passage.vi}</p>
      </div>

      {/* Note từ vựng / kanji */}
      <div className="rounded-xl border border-neon-cyan/20 bg-neon-cyan/[0.04] px-4 py-3 mb-6">
        <div className="text-[10px] font-bold tracking-wider text-neon-cyan mb-2">
          TỪ VỰNG &amp; NGỮ PHÁP TRONG BÀI
        </div>
        <div className="space-y-2">
          {passage.notes.map((n) => (
            <div key={n.term} className="text-[13px] leading-relaxed">
              <b className="text-white">{n.term}</b>
              {n.reading && <span className="text-neon-cyan"> ({n.reading})</span>}
              <span className="text-slate-400"> — {n.meaning}</span>
              <span className="text-slate-600 text-[11px]"> · {n.ref}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={onAgain}
          className="px-5 py-2.5 rounded-xl bg-neon-violet/15 border border-neon-violet/40 text-sm font-medium text-white hover:bg-neon-violet/25 transition-colors active:scale-95"
        >
          <RotateCcw className="w-4 h-4 inline mr-1.5" />
          Gõ lại bài này
        </button>
      </div>
    </div>
  );
}

/** Romaji chuẩn của một kana — dùng trong bảng lỗi */
function tokenAnswer(char: string): string {
  const t = tokenize(char)[0];
  return t?.answers[0] ?? '?';
}
