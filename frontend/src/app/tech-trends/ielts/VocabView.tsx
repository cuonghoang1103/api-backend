'use client';

/**
 * Tab Từ vựng — 300 từ nền, ba chế độ: Danh sách · Lật thẻ · Kiểm tra.
 *
 * Giống khoá Tiếng Anh Giao Tiếp, mặt thẻ hiện TIẾNG VIỆT trước. Lý do vẫn
 * vậy: lúc viết và lúc nói thì trong đầu có ý tiếng Việt trước và phải tự bật
 * ra tiếng Anh. Học chiều ngược lại chỉ luyện đọc hiểu.
 *
 * Khác một chỗ so với khoá kia: ở đây từ vựng chia theo CHỦ ĐỀ, và lật thẻ /
 * kiểm tra chạy trên đúng chủ đề đang chọn (hoặc toàn bộ) — 300 từ trộn chung
 * một cỗ thì học xong không biết mình yếu mảng nào.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Volume2, RotateCcw, Check, X, Shuffle, List, Layers, ClipboardCheck } from 'lucide-react';
import type { StageBundle } from './data/bundles';
import type { VocabWord } from './data/types';

type Mode = 'list' | 'flash' | 'quiz';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function VocabView({
  d, speak, current, supported,
}: {
  d: StageBundle;
  speak: (t: string) => void;
  current: string | null;
  supported: boolean;
}) {
  const [mode, setMode] = useState<Mode>('list');
  const [topicId, setTopicId] = useState<string>('all');
  const [known, setKnown] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);

  const [order, setOrder] = useState<number[]>([]);
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const [quiz, setQuiz] = useState<{ q: VocabWord; options: string[] }[]>([]);
  const [qIdx, setQIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const VOCAB_TOPICS = d.vocabTopics;
  const ALL_WORDS = d.allWords;

  // Đổi chặng thì về "Tất cả", vì id chủ đề của chặng cũ không tồn tại ở chặng mới.
  const [owner, setOwner] = useState(d.id);
  if (owner !== d.id) {
    setOwner(d.id);
    setTopicId('all');
  }

  const words = useMemo(
    () => (topicId === 'all' ? ALL_WORDS : (VOCAB_TOPICS.find((t) => t.id === topicId)?.words ?? ALL_WORDS)),
    [topicId, ALL_WORDS, VOCAB_TOPICS],
  );

  useEffect(() => {
    setHydrated(true);
    try {
      const raw = localStorage.getItem(d.keys.vocabKnown);
      setKnown(raw ? JSON.parse(raw) : {});
    } catch {
      /* bỏ qua */
    }
  }, [d.keys.vocabKnown]);

  // Đổi chủ đề thì trộn lại cỗ thẻ và xoá bài kiểm tra cũ.
  useEffect(() => {
    setOrder(shuffle(words.map((_, i) => i)));
    setPos(0);
    setFlipped(false);
    setQuiz([]);
    setQIdx(0);
    setPicked(null);
    setScore(0);
  }, [words]);

  const toggleKnown = useCallback((en: string) => {
    setKnown((prev) => {
      const next = { ...prev, [en]: !prev[en] };
      try {
        localStorage.setItem(d.keys.vocabKnown, JSON.stringify(next));
      } catch {
        /* bỏ qua */
      }
      return next;
    });
  }, [d.keys.vocabKnown]);

  const knownCount = hydrated ? words.filter((w) => known[w.en]).length : 0;

  const card = order.length ? words[order[pos % order.length]] : null;
  const nextCard = useCallback(() => {
    setFlipped(false);
    setPos((p) => (p + 1) % (order.length || 1));
  }, [order.length]);

  const startQuiz = useCallback(() => {
    const picks = shuffle(words).slice(0, 10);
    setQuiz(
      picks.map((q) => {
        const wrong = shuffle(ALL_WORDS.filter((w) => w.en !== q.en))
          .slice(0, 3)
          .map((w) => w.vi);
        return { q, options: shuffle([q.vi, ...wrong]) };
      }),
    );
    setQIdx(0);
    setPicked(null);
    setScore(0);
  }, [words]);

  useEffect(() => {
    if (mode === 'quiz' && quiz.length === 0) startQuiz();
  }, [mode, quiz.length, startQuiz]);

  const MODES: { id: Mode; label: string; icon: typeof List }[] = [
    { id: 'list', label: 'Danh sách', icon: List },
    { id: 'flash', label: 'Lật thẻ', icon: Layers },
    { id: 'quiz', label: 'Kiểm tra', icon: ClipboardCheck },
  ];

  const topic = VOCAB_TOPICS.find((t) => t.id === topicId);

  return (
    <div>
      {/* Chọn chủ đề */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1">
        <button
          type="button"
          onClick={() => setTopicId('all')}
          className={`shrink-0 px-3 py-2 rounded-xl border text-sm transition-all active:scale-95 ${
            topicId === 'all'
              ? 'bg-sky-500/20 border-sky-400/40 text-text-primary'
              : 'bg-[var(--bg-surface-hover)] border-[var(--border-light)] text-text-secondary hover:text-text-primary'
          }`}
        >
          Tất cả ({ALL_WORDS.length})
        </button>
        {VOCAB_TOPICS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTopicId(t.id)}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm whitespace-nowrap transition-all active:scale-95 ${
              topicId === t.id
                ? 'bg-sky-500/20 border-sky-400/40 text-text-primary'
                : 'bg-[var(--bg-surface-hover)] border-[var(--border-light)] text-text-secondary hover:text-text-primary'
            }`}
          >
            <span>{t.icon}</span>
            {t.title}
          </button>
        ))}
      </div>

      {topic && (
        <p className="text-sm text-text-secondary mb-4 leading-relaxed rounded-xl border border-[var(--border-light)] bg-[var(--bg-surface-hover)] p-3">
          <b className="text-text-primary">Vì sao cần chủ đề này:</b> {topic.why}
        </p>
      )}

      {/* Chọn chế độ */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex gap-2">
          {MODES.map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setMode(m.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm border transition-all active:scale-95 ${
                  mode === m.id
                    ? 'bg-emerald-500/20 border-emerald-400/40 text-text-primary'
                    : 'bg-[var(--bg-surface-hover)] border-[var(--border-light)] text-text-secondary hover:text-text-primary'
                }`}
              >
                <Icon className="w-4 h-4" />
                {m.label}
              </button>
            );
          })}
        </div>
        {hydrated && (
          <span className="text-xs text-text-secondary">
            Đã thuộc <b className="text-tone-emerald">{knownCount}</b>/{words.length}
          </span>
        )}
      </div>

      {/* ── Danh sách ── */}
      {mode === 'list' && (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {words.map((v, i) => {
            const ok = hydrated && known[v.en];
            return (
              <div
                key={`${v.en}-${i}`}
                className={`rounded-xl border p-3 transition-colors ${
                  ok ? 'border-emerald-400/30 bg-emerald-500/[0.07]' : 'border-[var(--border-light)] bg-[var(--bg-surface-hover)]'
                }`}
              >
                <div className="flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-text-primary text-sm">{v.en}</span>
                      {v.pos && <span className="text-[10px] text-text-muted border border-[var(--border-light)] px-1.5 rounded">{v.pos}</span>}
                    </div>
                    <p className="text-tone-violet text-[11px] font-mono mt-0.5">{v.ipa}</p>
                    <p className="text-text-secondary text-sm mt-1">{v.vi}</p>
                    <p className="text-text-muted text-xs mt-1.5 italic leading-relaxed">
                      {v.ex}
                      <span className="not-italic text-text-muted"> — {v.exVi}</span>
                    </p>
                  </div>
                  <div className="shrink-0 flex flex-col gap-1">
                    {supported && (
                      <button
                        type="button"
                        onClick={() => speak(v.en)}
                        aria-label={`Nghe: ${v.en}`}
                        className={`p-1.5 rounded-lg transition-all active:scale-90 ${
                          current === v.en ? 'bg-violet-500/30 text-tone-violet' : 'text-text-muted hover:text-tone-violet'
                        }`}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => toggleKnown(v.en)}
                      aria-label="Đánh dấu đã thuộc"
                      className={`p-1.5 rounded-lg transition-all active:scale-90 ${
                        ok ? 'bg-emerald-500/25 text-tone-emerald' : 'text-text-muted hover:text-tone-emerald'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Lật thẻ ── */}
      {mode === 'flash' && card && (
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-between text-xs text-text-muted mb-3">
            <span>Thẻ {pos + 1}/{order.length}</span>
            <button
              type="button"
              onClick={() => { setOrder(shuffle(words.map((_, i) => i))); setPos(0); setFlipped(false); }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[var(--bg-surface-hover)] hover:text-text-primary transition-colors"
            >
              <Shuffle className="w-3.5 h-3.5" />
              Trộn lại
            </button>
          </div>

          <button
            type="button"
            onClick={() => setFlipped((f) => !f)}
            className="w-full min-h-[13rem] rounded-3xl border border-[var(--border-light-hover)] bg-gradient-to-br from-white/[0.07] to-transparent p-6 flex flex-col items-center justify-center text-center transition-all active:scale-[0.99] hover:border-violet-400/40"
          >
            {!flipped ? (
              <>
                <p className="text-xs text-text-muted mb-2">Nghĩa tiếng Việt — bạn nói tiếng Anh là gì?</p>
                <p className="text-2xl font-bold text-text-primary leading-snug">{card.vi}</p>
                <p className="text-xs text-text-muted mt-4">Bấm để lật</p>
              </>
            ) : (
              <>
                <p className="text-3xl font-bold text-tone-emerald">{card.en}</p>
                <p className="text-tone-violet font-mono text-sm mt-1">{card.ipa}</p>
                <p className="text-text-secondary text-sm mt-2">{card.vi}</p>
                <p className="text-text-muted text-xs mt-3 italic">
                  {card.ex}
                  <span className="not-italic"> — {card.exVi}</span>
                </p>
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
            {supported && (
              <button
                type="button"
                onClick={() => speak(card.en)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-500/15 text-tone-violet hover:bg-violet-500/25 transition-colors text-sm"
              >
                <Volume2 className="w-4 h-4" />
                Nghe
              </button>
            )}
            <button
              type="button"
              onClick={() => { toggleKnown(card.en); nextCard(); }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/15 text-tone-emerald hover:bg-emerald-500/25 transition-colors text-sm"
            >
              <Check className="w-4 h-4" />
              Đã thuộc
            </button>
            <button
              type="button"
              onClick={nextCard}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--bg-surface-hover)] text-text-secondary hover:bg-[var(--bg-surface-active)] transition-colors text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Chưa thuộc
            </button>
          </div>
        </div>
      )}

      {/* ── Kiểm tra ── */}
      {mode === 'quiz' && quiz.length > 0 && (
        <div className="max-w-xl mx-auto">
          {qIdx < quiz.length ? (
            <>
              <div className="flex items-center justify-between text-xs text-text-muted mb-3">
                <span>Câu {qIdx + 1}/{quiz.length}</span>
                <span>Đúng: <b className="text-tone-emerald">{score}</b></span>
              </div>
              <div className="rounded-2xl border border-[var(--border-light)] bg-[var(--bg-surface-hover)] p-5">
                <p className="text-xs text-text-muted mb-2">Từ này nghĩa là gì?</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-text-primary">{quiz[qIdx].q.en}</p>
                  {supported && (
                    <button
                      type="button"
                      onClick={() => speak(quiz[qIdx].q.en)}
                      aria-label="Nghe"
                      className="p-1.5 rounded-lg text-text-muted hover:text-tone-violet transition-colors"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className="text-tone-violet text-xs font-mono mt-1">{quiz[qIdx].q.ipa}</p>

                <div className="mt-4 space-y-2">
                  {quiz[qIdx].options.map((opt, i) => {
                    const isRight = opt === quiz[qIdx].q.vi;
                    const chosen = picked === opt;
                    let cls = 'border-[var(--border-light)] bg-[var(--bg-surface-hover)] hover:border-violet-400/40';
                    if (picked) {
                      if (isRight) cls = 'border-emerald-400/50 bg-emerald-500/15';
                      else if (chosen) cls = 'border-rose-400/50 bg-rose-500/15';
                      else cls = 'border-[var(--border-light)] bg-[var(--bg-surface-hover)] opacity-50';
                    }
                    return (
                      <button
                        key={i}
                        type="button"
                        disabled={!!picked}
                        onClick={() => {
                          setPicked(opt);
                          if (isRight) setScore((s) => s + 1);
                        }}
                        className={`w-full text-left rounded-xl border px-4 py-3 text-sm text-text-primary transition-all ${cls}`}
                      >
                        <span className="flex items-center justify-between gap-2">
                          {opt}
                          {picked && isRight && <Check className="w-4 h-4 text-tone-emerald shrink-0" />}
                          {picked && chosen && !isRight && <X className="w-4 h-4 text-tone-rose shrink-0" />}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {picked && (
                  <>
                    <p className="mt-3 text-xs text-text-secondary italic leading-relaxed">
                      {quiz[qIdx].q.ex} — {quiz[qIdx].q.exVi}
                    </p>
                    <button
                      type="button"
                      onClick={() => { setQIdx((i) => i + 1); setPicked(null); }}
                      className="mt-3 w-full px-4 py-3 rounded-xl bg-violet-500/20 border border-violet-400/40 text-text-primary text-sm hover:bg-violet-500/30 transition-colors"
                    >
                      {qIdx + 1 === quiz.length ? 'Xem kết quả' : 'Câu tiếp theo →'}
                    </button>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-[var(--border-light)] bg-[var(--bg-surface-hover)] p-8 text-center">
              <p className="text-5xl mb-3">{score >= 8 ? '🏆' : score >= 5 ? '👍' : '💪'}</p>
              <p className="text-3xl font-bold text-text-primary">{score}/{quiz.length}</p>
              <p className="text-text-secondary text-sm mt-2">
                {score >= 8
                  ? 'Rất tốt! Chủ đề này bạn nắm chắc rồi.'
                  : score >= 5
                    ? 'Khá ổn. Ôn lại vài từ còn sai rồi thử lại nhé.'
                    : 'Cần ôn thêm. Thử chế độ Lật thẻ trước khi kiểm tra lại.'}
              </p>
              <button
                type="button"
                onClick={startQuiz}
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-500/20 border border-violet-400/40 text-text-primary text-sm hover:bg-violet-500/30 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Làm lại 10 câu khác
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
