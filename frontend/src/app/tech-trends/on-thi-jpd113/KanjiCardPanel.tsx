'use client';

/**
 * Khu lật thẻ CHỮ HÁN, nằm ngay đầu mục "Chữ Hán" của tab Bảng tra cứu.
 *
 * Vì sao cần dù tab Từ vựng đã có thẻ lật: tab đó hỏi NGHĨA của từ (thấy
 * わたし đoán "tôi"), còn thứ chặn người học ở 13 bài đọc và ở dạng đề
 * "đọc kanji" là MẶT CHỮ — thấy 会社員 mà không bật ra được かいしゃいん.
 * Nên ở đây mặt trước luôn là chữ Hán, mặt sau mở ra theo đúng thứ tự não
 * cần khi thi nói: cách đọc → nghĩa → mấu nhớ Hán-Việt.
 *
 * Trạng thái "đã thuộc" lưu localStorage, dùng chung cho cả hai chế độ:
 * lật thẻ bỏ qua thẻ đã thuộc, trắc nghiệm cũng ưu tiên thẻ chưa thuộc.
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Check, RotateCcw, Trophy, Shuffle, Layers, AlertTriangle } from 'lucide-react';

import {
  KANJI_DECKS,
  ALL_KANJI_CARDS,
  KANJI_CARD_KEY,
  type KanjiCard,
} from './data/kanjiCards';

type Mode = 'flip' | 'quiz';
/** Chiều hỏi của trắc nghiệm — khớp hai dạng câu có thật trong đề FE */
type QuizDir = 'k2r' | 'k2m' | 'r2k';

const QUIZ_SIZE = 12;

const DIR_LABEL: Record<QuizDir, string> = {
  k2r: 'Chữ Hán → cách đọc',
  k2m: 'Chữ Hán → nghĩa',
  r2k: 'Cách đọc → chữ Hán',
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function KanjiCardPanel() {
  const [deckId, setDeckId] = useState<string>('reading');
  const [mode, setMode] = useState<Mode>('flip');
  const [known, setKnown] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);

  // Đọc localStorage sau khi mount — đọc lúc render đầu sẽ lệch HTML server
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KANJI_CARD_KEY);
      if (raw) setKnown(JSON.parse(raw));
    } catch {
      /* localStorage bị chặn (chế độ riêng tư) — cứ chạy không lưu */
    }
    setMounted(true);
  }, []);

  const persist = (next: Record<string, boolean>) => {
    setKnown(next);
    try {
      localStorage.setItem(KANJI_CARD_KEY, JSON.stringify(next));
    } catch {
      /* không lưu được thì thôi, phiên này vẫn dùng bình thường */
    }
  };

  const toggleKnown = (c: KanjiCard) => {
    const next = { ...known };
    if (next[c.word]) delete next[c.word];
    else next[c.word] = true;
    persist(next);
  };

  const cards = useMemo(
    () => (deckId === 'all' ? ALL_KANJI_CARDS : KANJI_DECKS.find((d) => d.id === deckId)?.cards ?? []),
    [deckId],
  );
  const deck = KANJI_DECKS.find((d) => d.id === deckId);
  const learned = mounted ? cards.filter((c) => known[c.word]).length : 0;

  return (
    <div className="rounded-xl border border-neon-violet/25 bg-neon-violet/[0.05] p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div>
          <div className="text-sm font-bold text-neon-violet mb-1">
            🃏 Lật thẻ chữ Hán — mặt chữ → cách đọc → nghĩa
          </div>
          <p className="text-[13px] text-slate-300 leading-relaxed max-w-2xl">
            Bảng bên dưới để <b className="text-white">tra</b>, khu này để{' '}
            <b className="text-white">nhớ</b>. Nhìn mặt chữ, tự đọc thành tiếng rồi mới lật —
            đúng thao tác bạn phải làm khi giám thị đưa bài đọc.
          </p>
        </div>
        {mounted && learned > 0 && (
          <button
            onClick={() => persist({})}
            className="text-[11px] text-slate-500 hover:text-white transition-colors shrink-0"
          >
            Xoá đánh dấu ({learned})
          </button>
        )}
      </div>

      {/* Chọn bộ thẻ */}
      <div className="flex flex-wrap gap-1.5 mb-2.5">
        <DeckChip
          label="Tất cả"
          icon="🗂️"
          count={ALL_KANJI_CARDS.length}
          done={mounted ? ALL_KANJI_CARDS.filter((c) => known[c.word]).length : 0}
          active={deckId === 'all'}
          onClick={() => setDeckId('all')}
        />
        {KANJI_DECKS.map((d) => (
          <DeckChip
            key={d.id}
            label={d.name}
            icon={d.icon}
            count={d.cards.length}
            done={mounted ? d.cards.filter((c) => known[c.word]).length : 0}
            active={deckId === d.id}
            onClick={() => setDeckId(d.id)}
          />
        ))}
      </div>
      <p className="text-[12px] text-slate-500 leading-relaxed mb-4">
        {deck ? deck.desc : 'Gộp mọi bộ, đã bỏ các thẻ trùng nhau.'}
      </p>

      {/* Chọn chế độ */}
      <div className="flex gap-2 mb-4">
        {(
          [
            ['flip', 'Lật thẻ', Layers],
            ['quiz', 'Trắc nghiệm', Trophy],
          ] as [Mode, string, typeof Layers][]
        ).map(([m, label, Icon]) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border transition-colors ${
              mode === m
                ? 'bg-neon-violet/20 border-neon-violet/50 text-white'
                : 'bg-white/[0.04] border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {mode === 'flip' ? (
        <FlipView cards={cards} known={known} mounted={mounted} onToggle={toggleKnown} />
      ) : (
        <QuizView cards={cards} known={known} mounted={mounted} />
      )}
    </div>
  );
}

function DeckChip({
  label,
  icon,
  count,
  done,
  active,
  onClick,
}: {
  label: string;
  icon: string;
  count: number;
  done: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition-colors ${
        active
          ? 'bg-neon-violet/20 border-neon-violet/50 text-white'
          : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
      }`}
    >
      {icon} {label}{' '}
      <span className={active ? 'text-neon-violet' : 'text-slate-600'}>
        {done > 0 ? `${done}/${count}` : count}
      </span>
    </button>
  );
}

/* ══════════════════ LẬT THẺ ══════════════════ */

function FlipView({
  cards,
  known,
  mounted,
  onToggle,
}: {
  cards: KanjiCard[];
  known: Record<string, boolean>;
  mounted: boolean;
  onToggle: (c: KanjiCard) => void;
}) {
  const [order, setOrder] = useState<number[] | null>(null);
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);

  // Đổi bộ thì về thẻ đầu và bỏ thứ tự đã trộn của bộ cũ
  useEffect(() => {
    setI(0);
    setFlipped(false);
    setOrder(null);
  }, [cards]);

  // Ôn lại thẻ đã thuộc là phí thời gian — chỉ học phần chưa thuộc
  const deck = useMemo(() => {
    const base = mounted ? cards.filter((c) => !known[c.word]) : cards;
    if (!order) return base;
    // `order` là hoán vị của MẢNG GỐC, nên lọc lại theo base để thẻ vừa
    // đánh dấu "đã thuộc" biến mất ngay mà không phải trộn lại
    const set = new Set(base.map((c) => c.word));
    return order.map((idx) => cards[idx]).filter((c) => c && set.has(c.word));
  }, [cards, known, mounted, order]);

  if (!mounted) {
    return <div className="h-40 flex items-center justify-center text-sm text-slate-500">Đang tải…</div>;
  }

  if (deck.length === 0) {
    return (
      <div className="rounded-xl border border-neon-green/25 bg-neon-green/[0.06] p-8 text-center">
        <Trophy className="w-9 h-9 text-neon-green mx-auto mb-3" />
        <p className="text-white font-semibold mb-1">Thuộc hết bộ này rồi</p>
        <p className="text-[13px] text-slate-400">
          Chọn bộ khác, hoặc bấm “Xoá đánh dấu” ở góc trên để ôn lại từ đầu.
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
    <div className="space-y-3">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-slate-400">
          Thẻ <b className="text-white">{Math.min(i + 1, deck.length)}</b>/{deck.length} · chưa thuộc
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setOrder(shuffle(cards.map((_, idx) => idx)));
              setI(0);
              setFlipped(false);
            }}
            className="inline-flex items-center gap-1 text-slate-500 hover:text-white transition-colors"
          >
            <Shuffle className="w-3.5 h-3.5" />
            Trộn
          </button>
          <button
            onClick={() => {
              setI(0);
              setFlipped(false);
            }}
            className="inline-flex items-center gap-1 text-slate-500 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Thẻ đầu
          </button>
        </div>
      </div>

      <button
        onClick={() => setFlipped((v) => !v)}
        className={`w-full rounded-2xl border px-5 py-10 sm:py-12 text-center transition-colors ${
          card.danger
            ? 'border-neon-red/35 bg-neon-red/[0.05] hover:border-neon-red/55'
            : 'border-white/12 bg-white/[0.03] hover:border-neon-violet/40'
        }`}
      >
        {!flipped ? (
          <>
            <div className="text-5xl sm:text-6xl text-white leading-tight tracking-wide">{card.word}</div>
            <div className="text-[11px] text-slate-600 mt-6">đọc thành tiếng rồi bấm để lật</div>
          </>
        ) : (
          <>
            {card.kana !== card.word && (
              <div className="text-3xl sm:text-4xl text-neon-cyan leading-tight mb-3">{card.kana}</div>
            )}
            <div className="text-xl sm:text-2xl text-white leading-snug">{card.meaning}</div>
            {card.hanviet && (
              <div className="text-[13px] text-neon-green font-semibold mt-2.5 tracking-wide">
                {card.hanviet}
              </div>
            )}
            {card.note && (
              <p className="text-[12px] text-slate-400 leading-relaxed mt-4 max-w-md mx-auto">
                {card.danger && <AlertTriangle className="w-3.5 h-3.5 inline mr-1 -mt-0.5 text-neon-red" />}
                {card.note}
              </p>
            )}
            <div className="text-[11px] text-slate-600 mt-5">bấm để lật lại</div>
          </>
        )}
      </button>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => {
            onToggle(card);
            setFlipped(false);
          }}
          className="px-3 py-2.5 rounded-xl bg-neon-green/15 border border-neon-green/40 text-[13px] font-medium text-white hover:bg-neon-green/25 transition-colors active:scale-95"
        >
          <Check className="w-4 h-4 inline mr-1.5" />
          Thuộc rồi
        </button>
        <button
          onClick={next}
          className="px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/15 text-[13px] font-medium text-white hover:border-neon-violet/40 transition-colors active:scale-95"
        >
          Chưa thuộc, thẻ tiếp →
        </button>
      </div>
    </div>
  );
}

/* ══════════════════ TRẮC NGHIỆM ══════════════════ */

interface QuizQ {
  card: KanjiCard;
  choices: string[];
}

function QuizView({
  cards,
  known,
  mounted,
}: {
  cards: KanjiCard[];
  known: Record<string, boolean>;
  mounted: boolean;
}) {
  const [dir, setDir] = useState<QuizDir>('k2r');
  const [queue, setQueue] = useState<QuizQ[]>([]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [wrong, setWrong] = useState<KanjiCard[]>([]);
  const [right, setRight] = useState(0);

  /**
   * Với bộ katakana, mặt chữ TRÙNG cách đọc (テスト = テスト) nên câu hỏi
   * "đọc thế nào" lộ luôn đáp án — loại các thẻ đó khỏi hai chiều liên
   * quan đến cách đọc.
   */
  const pool = useMemo(() => {
    const usable = dir === 'k2m' ? cards : cards.filter((c) => c.kana !== c.word);
    const un = mounted ? usable.filter((c) => !known[c.word]) : usable;
    return un.length >= 4 ? un : usable;
  }, [cards, known, mounted, dir]);

  const label = useCallback(
    (c: KanjiCard) => (dir === 'k2r' ? c.kana : dir === 'k2m' ? c.meaning : c.word),
    [dir],
  );

  const build = useCallback(() => {
    if (pool.length < 4) {
      setQueue([]);
      return;
    }
    const picks = shuffle(pool).slice(0, Math.min(QUIZ_SIZE, pool.length));
    const qs: QuizQ[] = picks.map((c) => {
      const correct = label(c);
      const others = shuffle(
        pool
          .filter((o) => o.word !== c.word)
          .map(label)
          .filter((v, i, arr) => v !== correct && arr.indexOf(v) === i),
      );
      return { card: c, choices: shuffle([correct, ...others.slice(0, 3)]) };
    });
    setQueue(qs);
    setIdx(0);
    setPicked(null);
    setWrong([]);
    setRight(0);
  }, [pool, label]);

  useEffect(() => {
    if (mounted) build();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, dir, cards]);

  if (!mounted) {
    return <div className="h-40 flex items-center justify-center text-sm text-slate-500">Đang tải…</div>;
  }

  const dirPicker = (
    <div className="flex flex-wrap gap-1.5">
      {(Object.keys(DIR_LABEL) as QuizDir[]).map((d) => (
        <button
          key={d}
          onClick={() => setDir(d)}
          className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition-colors ${
            dir === d
              ? 'bg-neon-cyan/15 border-neon-cyan/45 text-white'
              : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
          }`}
        >
          {DIR_LABEL[d]}
        </button>
      ))}
    </div>
  );

  if (queue.length === 0) {
    return (
      <div className="space-y-3">
        {dirPicker}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-8 text-center text-[13px] text-slate-400">
          Bộ này chưa đủ 4 thẻ hỏi được theo chiều đang chọn — đổi chiều hỏi, hoặc chọn bộ
          “Tất cả”.
        </div>
      </div>
    );
  }

  const finished = idx >= queue.length;

  if (finished) {
    const acc = Math.round((right / queue.length) * 100);
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
          <div className="text-center mb-5">
            <div
              className={`w-14 h-14 mx-auto mb-3 rounded-2xl flex items-center justify-center ${
                acc >= 80 ? 'bg-neon-green/15' : 'bg-neon-orange/15'
              }`}
            >
              <Trophy className={`w-7 h-7 ${acc >= 80 ? 'text-neon-green' : 'text-neon-orange'}`} />
            </div>
            <div className="text-3xl font-heading font-bold text-white mb-0.5">
              {right}/{queue.length}
            </div>
            <div className={`text-[13px] font-semibold ${acc >= 80 ? 'text-neon-green' : 'text-neon-orange'}`}>
              Chính xác {acc}%
            </div>
          </div>

          {wrong.length > 0 && (
            <div className="mb-5">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-2">
                {wrong.length} thẻ cần học lại
              </div>
              <div className="space-y-1.5">
                {wrong.map((c, i) => (
                  <div
                    key={`${c.word}-${i}`}
                    className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2"
                  >
                    <span className="text-lg text-white">{c.word}</span>
                    {c.kana !== c.word && <span className="text-[13px] text-neon-cyan">{c.kana}</span>}
                    <span className="text-[13px] text-slate-400">{c.meaning}</span>
                    {c.hanviet && (
                      <span className="text-[11px] text-neon-green font-semibold">{c.hanviet}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={build}
            className="w-full px-4 py-2.5 rounded-xl bg-neon-violet/20 border border-neon-violet/45 text-[13px] font-medium text-white hover:bg-neon-violet/30 transition-colors"
          >
            <RotateCcw className="w-4 h-4 inline mr-1.5" />
            Làm lại {QUIZ_SIZE} câu khác
          </button>
        </div>
        {dirPicker}
      </div>
    );
  }

  const q = queue[idx];
  const correct = label(q.card);
  const prompt = dir === 'r2k' ? q.card.kana : q.card.word;

  const pick = (c: string) => {
    if (picked) return;
    setPicked(c);
    if (c === correct) setRight((v) => v + 1);
    else setWrong((v) => [...v, q.card]);
  };

  return (
    <div className="space-y-3">
      {dirPicker}

      <div className="flex items-center justify-between text-[11px] text-slate-400">
        <span>
          Câu <b className="text-white">{idx + 1}</b>/{queue.length}
        </span>
        <span>
          Đúng <b className="text-neon-green">{right}</b>
        </span>
      </div>

      <div className="rounded-2xl border border-white/12 bg-white/[0.03] px-5 py-8 text-center">
        <div className={`text-white leading-tight ${dir === 'r2k' ? 'text-3xl sm:text-4xl' : 'text-5xl sm:text-6xl'}`}>
          {prompt}
        </div>
        <div className="text-[11px] text-slate-600 mt-4">
          {dir === 'k2r' ? 'đọc thế nào?' : dir === 'k2m' ? 'nghĩa là gì?' : 'viết bằng chữ nào?'}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-2">
        {q.choices.map((c) => {
          const isCorrect = c === correct;
          const isPicked = picked === c;
          return (
            <button
              key={c}
              onClick={() => pick(c)}
              disabled={!!picked}
              className={`px-3.5 py-3 rounded-xl border text-left transition-colors ${
                picked
                  ? isCorrect
                    ? 'bg-neon-green/15 border-neon-green/50 text-white'
                    : isPicked
                      ? 'bg-neon-red/15 border-neon-red/50 text-white'
                      : 'bg-white/[0.02] border-white/[0.08] text-slate-500'
                  : 'bg-white/[0.04] border-white/12 text-white hover:border-neon-violet/45'
              }`}
            >
              <span className={dir === 'r2k' ? 'text-xl' : 'text-[15px]'}>{c}</span>
            </button>
          );
        })}
      </div>

      {picked && (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
            <span className="text-2xl text-white">{q.card.word}</span>
            {q.card.kana !== q.card.word && (
              <span className="text-base text-neon-cyan">{q.card.kana}</span>
            )}
            <span className="text-[13px] text-slate-300">{q.card.meaning}</span>
            {q.card.hanviet && (
              <span className="text-[11px] text-neon-green font-semibold">{q.card.hanviet}</span>
            )}
          </div>
          {q.card.note && (
            <p className="text-[12px] text-slate-400 leading-relaxed">{q.card.note}</p>
          )}
          <button
            onClick={() => {
              setPicked(null);
              setIdx((v) => v + 1);
            }}
            className="w-full mt-3 px-4 py-2.5 rounded-xl bg-neon-violet/20 border border-neon-violet/45 text-[13px] font-medium text-white hover:bg-neon-violet/30 transition-colors"
          >
            {idx + 1 >= queue.length ? 'Xem kết quả' : 'Câu tiếp →'}
          </button>
        </div>
      )}
    </div>
  );
}
