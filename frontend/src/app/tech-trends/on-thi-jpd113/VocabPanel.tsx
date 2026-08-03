'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Search,
  Check,
  X,
  Eye,
  EyeOff,
  RotateCcw,
  Layers,
  List,
  Trophy,
  ArrowLeftRight,
  Volume2,
} from 'lucide-react';

import {
  VOCAB_CATEGORIES,
  VOCAB_WORDS,
  VOCAB_STORAGE_KEY,
  type VocabWord,
} from './data/vocab';

/**
 * Tab Từ vựng — 231 từ của JPD113.
 *
 * Vì sao đáng đầu tư: theo phân tích 420 câu FE thật, ~70% số câu là dạng
 * điền chỗ trống, và phần lớn chỗ trống đó kiểm tra collocation từ vựng
 * chứ không phải logic ngữ pháp. Đây là nhóm câu lớn nhất của đề.
 *
 * Ba chế độ, dùng cho ba giai đoạn khác nhau:
 *  - 'list'  tra cứu + đánh dấu đã thuộc  → lúc học lần đầu
 *  - 'card'  lật thẻ                      → lúc ôn lại
 *  - 'quiz'  trắc nghiệm hai chiều        → lúc tự kiểm trước khi thi
 *
 * Trạng thái "đã thuộc" lưu localStorage và được cả ba chế độ dùng chung:
 * chế độ thẻ và kiểm tra đều bỏ qua từ đã thuộc để không phí thời gian.
 */

type ViewMode = 'list' | 'card' | 'quiz';
type QuizDir = 'jp2vi' | 'vi2jp';

const QUIZ_SIZE = 15;

export default function VocabPanel() {
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<ViewMode>('list');
  const [cat, setCat] = useState<string>('all');
  const [query, setQuery] = useState('');
  const [known, setKnown] = useState<Record<string, boolean>>({});
  const [showMeaning, setShowMeaning] = useState(true);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(VOCAB_STORAGE_KEY);
      if (raw) setKnown(JSON.parse(raw));
    } catch {
      /* dữ liệu hỏng — coi như chưa đánh dấu từ nào */
    }
  }, []);

  const persistKnown = useCallback((next: Record<string, boolean>) => {
    setKnown(next);
    try {
      localStorage.setItem(VOCAB_STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* hết quota / chế độ riêng tư */
    }
  }, []);

  const toggleKnown = useCallback(
    (w: VocabWord) => {
      const key = w.word;
      const next = { ...known };
      if (next[key]) delete next[key];
      else next[key] = true;
      persistKnown(next);
    },
    [known, persistKnown],
  );

  /** Danh sách sau khi lọc chủ đề + tìm kiếm */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return VOCAB_WORDS.filter((w) => {
      if (cat !== 'all' && w.cat !== cat) return false;
      if (!q) return true;
      return (
        w.word.toLowerCase().includes(q) ||
        w.kana.toLowerCase().includes(q) ||
        w.meaning.toLowerCase().includes(q)
      );
    });
  }, [cat, query]);

  const knownCount = mounted ? Object.keys(known).length : 0;
  const pct = Math.round((knownCount / VOCAB_WORDS.length) * 100);

  return (
    <div className="space-y-6">
      {/* Giới thiệu + tiến độ */}
      <section className="rounded-2xl border border-neon-green/25 bg-neon-green/[0.05] p-5 sm:p-6">
        <h2 className="flex items-center gap-2 text-lg font-heading font-bold text-white mb-2">
          <Layers className="w-5 h-5 text-neon-green" />
          231 từ vựng — nhóm câu lớn nhất của đề trắc nghiệm
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed mb-5">
          ~70% câu trong đề FE là điền chỗ trống, và phần lớn kiểm tra{' '}
          <b className="text-white">từ vựng theo ngữ cảnh</b> chứ không phải ngữ pháp. Đây là đúng bộ
          từ của môn, chia 11 chủ đề, mỗi từ kèm câu ví dụ. Đánh dấu từ đã thuộc để chế độ thẻ và
          kiểm tra tự bỏ qua nó.
        </p>
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-slate-400">Đã thuộc</span>
          <span className="font-semibold text-white">
            {mounted ? `${knownCount}/${VOCAB_WORDS.length}` : '—'}
          </span>
        </div>
        <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-neon-green to-neon-emerald transition-all duration-500"
            style={{ width: mounted ? `${pct}%` : '0%' }}
          />
        </div>
      </section>

      {/* Chế độ */}
      <div className="grid sm:grid-cols-3 gap-2.5">
        {[
          { id: 'list' as const, label: 'Tra cứu', sub: 'đọc & đánh dấu đã thuộc', icon: List },
          { id: 'card' as const, label: 'Lật thẻ', sub: 'ôn nhanh, tự chấm', icon: Layers },
          { id: 'quiz' as const, label: 'Kiểm tra', sub: 'trắc nghiệm hai chiều', icon: Trophy },
        ].map((m) => {
          const Icon = m.icon;
          return (
            <button
              key={m.id}
              onClick={() => setView(m.id)}
              className={`flex items-start gap-2.5 text-left px-4 py-3 rounded-xl border transition-all active:scale-95 ${
                view === m.id
                  ? 'bg-neon-green/15 border-neon-green/45 text-white'
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

      {/* Lọc chủ đề */}
      <div>
        <div className="flex flex-wrap gap-2">
          <CatChip
            active={cat === 'all'}
            onClick={() => setCat('all')}
            label={`Tất cả · ${VOCAB_WORDS.length}`}
          />
          {VOCAB_CATEGORIES.map((c) => {
            const n = VOCAB_WORDS.filter((w) => w.cat === c.key).length;
            return (
              <CatChip
                key={c.key}
                active={cat === c.key}
                onClick={() => setCat(c.key)}
                label={`${c.icon} ${c.name} · ${n}`}
              />
            );
          })}
        </div>
      </div>

      {view === 'list' && (
        <ListView
          words={filtered}
          known={known}
          mounted={mounted}
          onToggle={toggleKnown}
          query={query}
          setQuery={setQuery}
          showMeaning={showMeaning}
          setShowMeaning={setShowMeaning}
        />
      )}
      {view === 'card' && (
        <CardView words={filtered} known={known} mounted={mounted} onToggle={toggleKnown} />
      )}
      {view === 'quiz' && <QuizView words={filtered} known={known} mounted={mounted} />}
    </div>
  );
}

function CatChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all active:scale-95 ${
        active
          ? 'bg-neon-violet/15 border-neon-violet/45 text-white'
          : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:border-white/25'
      }`}
    >
      {label}
    </button>
  );
}

/* ══════════════════ CHẾ ĐỘ TRA CỨU ══════════════════ */

function ListView({
  words,
  known,
  mounted,
  onToggle,
  query,
  setQuery,
  showMeaning,
  setShowMeaning,
}: {
  words: VocabWord[];
  known: Record<string, boolean>;
  mounted: boolean;
  onToggle: (w: VocabWord) => void;
  query: string;
  setQuery: (v: string) => void;
  showMeaning: boolean;
  setShowMeaning: (v: boolean) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm theo chữ Nhật, kana hoặc nghĩa tiếng Việt…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-neon-violet/50 transition-colors"
          />
        </div>
        <button
          onClick={() => setShowMeaning(!showMeaning)}
          className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-medium bg-white/[0.04] border border-white/10 text-slate-300 hover:text-white transition-colors"
        >
          {showMeaning ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          {showMeaning ? 'Che nghĩa' : 'Hiện nghĩa'}
        </button>
      </div>

      {!showMeaning && (
        <p className="text-[12px] text-slate-500 leading-relaxed">
          Nghĩa đang bị che — đọc từ tiếng Nhật, tự nhớ nghĩa trong đầu rồi bấm vào dòng đó để lật ra
          kiểm chứng. Đây là cách ôn hiệu quả hơn nhiều so với đọc xuôi cả bảng.
        </p>
      )}

      <div className="text-xs text-slate-500">{words.length} từ</div>

      <div className="space-y-2">
        {words.map((w) => (
          <VocabRow
            key={w.word + w.kana}
            word={w}
            known={mounted && !!known[w.word]}
            onToggle={() => onToggle(w)}
            showMeaning={showMeaning}
          />
        ))}
        {words.length === 0 && (
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-8 text-center text-sm text-slate-500">
            Không có từ nào khớp.
          </div>
        )}
      </div>
    </div>
  );
}

function VocabRow({
  word,
  known,
  onToggle,
  showMeaning,
}: {
  word: VocabWord;
  known: boolean;
  onToggle: () => void;
  showMeaning: boolean;
}) {
  const [revealed, setRevealed] = useState(false);
  const visible = showMeaning || revealed;

  return (
    <div
      className={`rounded-xl border p-3.5 transition-all ${
        known ? 'border-neon-green/25 bg-neon-green/[0.04]' : 'border-white/10 bg-white/[0.02]'
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={onToggle}
          aria-pressed={known}
          aria-label={known ? `Bỏ đánh dấu thuộc: ${word.word}` : `Đánh dấu đã thuộc: ${word.word}`}
          className={`mt-1 w-5 h-5 shrink-0 rounded-md border-2 flex items-center justify-center transition-all active:scale-90 ${
            known ? 'bg-neon-green border-neon-green' : 'border-white/25 hover:border-neon-green'
          }`}
        >
          {known && <Check className="w-3.5 h-3.5 text-black" strokeWidth={3.5} />}
        </button>

        <button
          onClick={() => !showMeaning && setRevealed((v) => !v)}
          className="flex-1 min-w-0 text-left"
        >
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-xl text-white leading-tight">{word.word}</span>
            {word.kana !== word.word && (
              <span className="text-sm text-neon-cyan">{word.kana}</span>
            )}
            {visible ? (
              <span className="text-sm text-slate-300">— {word.meaning}</span>
            ) : (
              <span className="text-sm text-slate-600 italic">— bấm để xem nghĩa</span>
            )}
          </div>
          {visible && word.ex && (
            <div className="mt-1.5 text-[13px] leading-relaxed">
              <span className="text-slate-400">{word.ex}</span>
              <span className="text-slate-600"> — {word.exVi}</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}

/* ══════════════════ CHẾ ĐỘ LẬT THẺ ══════════════════ */

function CardView({
  words,
  known,
  mounted,
  onToggle,
}: {
  words: VocabWord[];
  known: Record<string, boolean>;
  mounted: boolean;
  onToggle: (w: VocabWord) => void;
}) {
  // Bỏ qua từ đã thuộc — ôn lại cái đã biết là phí thời gian
  const deck = useMemo(
    () => (mounted ? words.filter((w) => !known[w.word]) : words),
    [words, known, mounted],
  );

  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);

  // Danh sách đổi (lọc chủ đề, hoặc đánh dấu thuộc) thì quay về thẻ đầu
  useEffect(() => {
    setI(0);
    setFlipped(false);
  }, [words]);

  if (!mounted) {
    return <div className="h-56 flex items-center justify-center text-sm text-slate-500">Đang tải…</div>;
  }

  if (deck.length === 0) {
    return (
      <div className="rounded-2xl border border-neon-green/25 bg-neon-green/[0.06] p-10 text-center">
        <Trophy className="w-10 h-10 text-neon-green mx-auto mb-3" />
        <p className="text-white font-semibold mb-1">Đã thuộc hết nhóm này</p>
        <p className="text-sm text-slate-400">
          Chọn chủ đề khác, hoặc bỏ đánh dấu vài từ ở chế độ Tra cứu để ôn lại.
        </p>
      </div>
    );
  }

  const card = deck[Math.min(i, deck.length - 1)];
  const next = () => {
    setFlipped(false);
    setI((v) => (v + 1) % deck.length);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400">
          Thẻ <b className="text-white">{Math.min(i + 1, deck.length)}</b>/{deck.length} · chưa thuộc
        </span>
        <button
          onClick={() => {
            setI(0);
            setFlipped(false);
          }}
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-white transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Về thẻ đầu
        </button>
      </div>

      <button
        onClick={() => setFlipped((v) => !v)}
        className="w-full rounded-2xl border border-white/12 bg-white/[0.03] px-6 py-14 text-center hover:border-neon-violet/35 transition-colors"
      >
        {!flipped ? (
          <>
            <div className="text-5xl sm:text-6xl text-white leading-tight mb-3">{card.word}</div>
            {card.kana !== card.word && (
              <div className="text-lg text-neon-cyan">{card.kana}</div>
            )}
            <div className="text-xs text-slate-600 mt-6">bấm để lật</div>
          </>
        ) : (
          <>
            <div className="text-2xl sm:text-3xl text-white leading-snug mb-4">{card.meaning}</div>
            {card.ex && (
              <div className="text-[13px] leading-relaxed max-w-md mx-auto">
                <div className="text-slate-300">{card.ex}</div>
                <div className="text-slate-500 mt-0.5">{card.exVi}</div>
              </div>
            )}
            <div className="text-xs text-slate-600 mt-6">bấm để lật lại</div>
          </>
        )}
      </button>

      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={() => {
            onToggle(card);
            setFlipped(false);
          }}
          className="px-4 py-3 rounded-xl bg-neon-green/15 border border-neon-green/40 text-sm font-medium text-white hover:bg-neon-green/25 transition-colors active:scale-95"
        >
          <Check className="w-4 h-4 inline mr-1.5" />
          Đã thuộc, bỏ khỏi bộ
        </button>
        <button
          onClick={next}
          className="px-4 py-3 rounded-xl bg-white/[0.05] border border-white/15 text-sm font-medium text-white hover:border-neon-violet/40 transition-colors active:scale-95"
        >
          Chưa thuộc, thẻ tiếp →
        </button>
      </div>
    </div>
  );
}

/* ══════════════════ CHẾ ĐỘ KIỂM TRA ══════════════════ */

interface QuizQ {
  word: VocabWord;
  choices: string[];
}

function QuizView({
  words,
  known,
  mounted,
}: {
  words: VocabWord[];
  known: Record<string, boolean>;
  mounted: boolean;
}) {
  const [dir, setDir] = useState<QuizDir>('jp2vi');
  const [queue, setQueue] = useState<QuizQ[]>([]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [wrong, setWrong] = useState<VocabWord[]>([]);
  const [right, setRight] = useState(0);

  const pool = useMemo(() => {
    // Ưu tiên từ chưa thuộc; nếu thuộc gần hết thì lấy cả bộ để vẫn kiểm tra được
    const un = mounted ? words.filter((w) => !known[w.word]) : words;
    return un.length >= 4 ? un : words;
  }, [words, known, mounted]);

  const build = useCallback(() => {
    if (pool.length < 4) {
      setQueue([]);
      return;
    }
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const picks = shuffled.slice(0, Math.min(QUIZ_SIZE, shuffled.length));

    const qs: QuizQ[] = picks.map((w) => {
      const label = (x: VocabWord) => (dir === 'jp2vi' ? x.meaning : x.word);
      const correct = label(w);
      const others = pool
        .filter((o) => o.word !== w.word)
        .map(label)
        .filter((v, i2, arr) => v !== correct && arr.indexOf(v) === i2);
      for (let i = others.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [others[i], others[j]] = [others[j], others[i]];
      }
      const choices = [correct, ...others.slice(0, 3)];
      for (let i = choices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [choices[i], choices[j]] = [choices[j], choices[i]];
      }
      return { word: w, choices };
    });

    setQueue(qs);
    setIdx(0);
    setPicked(null);
    setWrong([]);
    setRight(0);
  }, [pool, dir]);

  useEffect(() => {
    if (mounted) build();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, dir, words]);

  if (!mounted) {
    return <div className="h-56 flex items-center justify-center text-sm text-slate-500">Đang tải…</div>;
  }

  if (queue.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-10 text-center text-sm text-slate-400">
        Nhóm này chưa đủ 4 từ để làm trắc nghiệm — chọn chủ đề rộng hơn hoặc “Tất cả”.
      </div>
    );
  }

  const finished = idx >= queue.length;
  const q = queue[idx];
  const correctLabel = q ? (dir === 'jp2vi' ? q.word.meaning : q.word.word) : '';

  const pick = (c: string) => {
    if (picked) return;
    setPicked(c);
    if (c === correctLabel) setRight((v) => v + 1);
    else setWrong((v) => [...v, q.word]);
  };

  const next = () => {
    setPicked(null);
    setIdx((v) => v + 1);
  };

  if (finished) {
    const acc = Math.round((right / queue.length) * 100);
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
        <div className="text-center mb-7">
          <div
            className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
              acc >= 80 ? 'bg-neon-green/15' : 'bg-neon-orange/15'
            }`}
          >
            <Trophy className={`w-8 h-8 ${acc >= 80 ? 'text-neon-green' : 'text-neon-orange'}`} />
          </div>
          <div className="text-4xl font-heading font-bold text-white mb-1">
            {right}/{queue.length}
          </div>
          <div className={`text-sm font-semibold ${acc >= 80 ? 'text-neon-green' : 'text-neon-orange'}`}>
            Chính xác {acc}%
          </div>
        </div>

        {wrong.length > 0 && (
          <div className="mb-6">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2.5">
              {wrong.length} từ cần học lại
            </div>
            <div className="space-y-2">
              {wrong.map((w, i) => (
                <div
                  key={`${w.word}-${i}`}
                  className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5"
                >
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <span className="text-lg text-white">{w.word}</span>
                    {w.kana !== w.word && <span className="text-sm text-neon-cyan">{w.kana}</span>}
                    <span className="text-sm text-slate-300">— {w.meaning}</span>
                  </div>
                  {w.ex && (
                    <div className="text-[12px] text-slate-500 mt-0.5 leading-relaxed">
                      {w.ex} — {w.exVi}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={build}
            className="px-5 py-2.5 rounded-xl bg-neon-green/15 border border-neon-green/40 text-sm font-medium text-white hover:bg-neon-green/25 transition-colors active:scale-95"
          >
            Làm bộ mới
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4 text-xs">
          <span className="text-slate-400">
            Câu <b className="text-white">{idx + 1}</b>/{queue.length}
          </span>
          <span className="text-slate-400">
            Đúng <b className="text-neon-green">{right}</b>
          </span>
        </div>
        <button
          onClick={() => setDir(dir === 'jp2vi' ? 'vi2jp' : 'jp2vi')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-white/[0.04] border border-white/10 text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          {dir === 'jp2vi' ? 'Nhật → Việt' : 'Việt → Nhật'}
        </button>
      </div>

      <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-neon-green to-neon-cyan transition-all duration-300"
          style={{ width: `${(idx / queue.length) * 100}%` }}
        />
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
        <div className="text-center mb-7">
          {dir === 'jp2vi' ? (
            <>
              <div className="text-4xl sm:text-5xl text-white leading-tight mb-2">{q.word.word}</div>
              {q.word.kana !== q.word.word && (
                <div className="text-base text-neon-cyan">{q.word.kana}</div>
              )}
            </>
          ) : (
            <div className="text-2xl sm:text-3xl text-white leading-snug">{q.word.meaning}</div>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-2.5">
          {q.choices.map((c) => {
            const isRight = c === correctLabel;
            const chosen = picked === c;
            let cls = 'border-white/12 bg-white/[0.03] text-white hover:border-neon-green/45';
            if (picked) {
              if (isRight) cls = 'border-neon-green/60 bg-neon-green/10 text-neon-green';
              else if (chosen) cls = 'border-neon-red/60 bg-neon-red/10 text-neon-red';
              else cls = 'border-white/8 bg-white/[0.02] text-slate-600';
            }
            return (
              <button
                key={c}
                onClick={() => pick(c)}
                disabled={!!picked}
                className={`px-4 py-3.5 rounded-xl border text-left transition-all active:scale-95 ${cls} ${
                  dir === 'vi2jp' ? 'text-lg' : 'text-sm'
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>

        {picked && (
          <div className="mt-6">
            <div
              className={`rounded-xl border p-4 mb-3 ${
                picked === correctLabel
                  ? 'border-neon-green/30 bg-neon-green/[0.07]'
                  : 'border-neon-red/30 bg-neon-red/[0.07]'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                {picked === correctLabel ? (
                  <>
                    <Check className="w-4 h-4 text-neon-green" strokeWidth={3} />
                    <span className="text-sm font-bold text-neon-green">Đúng</span>
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4 text-neon-red" strokeWidth={3} />
                    <span className="text-sm font-bold text-neon-red">
                      {q.word.word}
                      {q.word.kana !== q.word.word ? ` (${q.word.kana})` : ''} — {q.word.meaning}
                    </span>
                  </>
                )}
              </div>
              {q.word.ex && (
                <p className="text-[13px] text-slate-300 leading-relaxed">
                  <Volume2 className="w-3.5 h-3.5 inline mr-1 text-slate-500" />
                  {q.word.ex} <span className="text-slate-500">— {q.word.exVi}</span>
                </p>
              )}
            </div>
            <button
              onClick={next}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/15 text-sm font-medium text-white hover:border-neon-green/40 transition-colors active:scale-95"
            >
              Câu tiếp theo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
