'use client';

/**
 * Bài kiểm tra cuối tuần — 2 phần, đúng thứ tự kỹ năng cần rèn.
 *
 * Phần 1 "Tự nói": hiện NGHĨA TIẾNG VIỆT, người học phải tự bật ra câu tiếng
 * Anh rồi mới bấm xem đáp án và TỰ chấm. Cố ý không chấm tự động: không có
 * cách nào chấm phát âm bằng trắc nghiệm, mà mục tiêu ở đây là mở miệng nói
 * chứ không phải chọn ô đúng. Tự chấm trung thực vẫn hiệu quả hơn nhiều so
 * với nhận diện giọng nói hay sai.
 *
 * Phần 2 "Trắc nghiệm": chọn nghĩa đúng của từ — chấm được tự động, dùng để
 * đo phần từ vựng của tuần.
 *
 * Điểm lưu theo tuần ở localStorage để lần sau mở lại còn thấy mình đã đạt
 * bao nhiêu.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Volume2, Check, X, RotateCcw, Eye, Trophy } from 'lucide-react';
import type { WeekBlock } from './data';

const SCORE_KEY = 'english-speaking:weekly-score:v1';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type SpeakItem = { vi: string; en: string; ipa?: string };
type QuizItem = { en: string; ipa: string; answer: string; options: string[] };

export default function WeeklyTest({
  weeks, speak, current, supported,
}: {
  weeks: WeekBlock[];
  speak: (t: string) => void;
  current: string | null;
  supported: boolean;
}) {
  const [week, setWeek] = useState(weeks[0]?.week ?? 1);
  const [phase, setPhase] = useState<'intro' | 'speak' | 'quiz' | 'done'>('intro');
  const [scores, setScores] = useState<Record<number, { speak: number; quiz: number; total: number }>>({});
  const [hydrated, setHydrated] = useState(false);

  const [speakItems, setSpeakItems] = useState<SpeakItem[]>([]);
  const [sIdx, setSIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [sRight, setSRight] = useState(0);

  const [quizItems, setQuizItems] = useState<QuizItem[]>([]);
  const [qIdx, setQIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [qRight, setQRight] = useState(0);

  useEffect(() => {
    setHydrated(true);
    try {
      const raw = localStorage.getItem(SCORE_KEY);
      if (raw) setScores(JSON.parse(raw));
    } catch {
      /* bỏ qua */
    }
  }, []);

  const block = useMemo(() => weeks.find((w) => w.week === week) ?? weeks[0], [weeks, week]);

  const start = useCallback(() => {
    const days = block.days;
    // Phần nói: lấy 8 câu trả lời rải đều các ngày trong tuần.
    const pool: SpeakItem[] = days.flatMap((d) =>
      d.qa.flatMap((p) => [
        { vi: p.q.vi, en: p.q.en, ipa: p.q.ipa },
        ...p.answers.slice(0, 1).map((a) => ({ vi: a.vi, en: a.en, ipa: a.ipa })),
      ]),
    );
    setSpeakItems(shuffle(pool).slice(0, 8));

    // Phần trắc nghiệm: 8 từ của tuần, mỗi từ 4 lựa chọn nghĩa.
    const vocab = days.flatMap((d) => d.vocab);
    const picks = shuffle(vocab).slice(0, 8);
    setQuizItems(
      picks.map((v) => {
        const wrong = shuffle(vocab.filter((x) => x.en !== v.en)).slice(0, 3).map((x) => x.vi);
        return { en: v.en, ipa: v.ipa, answer: v.vi, options: shuffle([v.vi, ...wrong]) };
      }),
    );

    setSIdx(0); setRevealed(false); setSRight(0);
    setQIdx(0); setPicked(null); setQRight(0);
    setPhase('speak');
  }, [block]);

  const finish = useCallback((finalQuiz: number) => {
    const total = sRight + finalQuiz;
    setScores((prev) => {
      const next = { ...prev, [week]: { speak: sRight, quiz: finalQuiz, total } };
      try {
        localStorage.setItem(SCORE_KEY, JSON.stringify(next));
      } catch {
        /* bỏ qua */
      }
      return next;
    });
    setPhase('done');
  }, [sRight, week]);

  const saved = hydrated ? scores[week] : undefined;
  const maxScore = speakItems.length + quizItems.length || 16;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Chọn tuần */}
      <div className="flex flex-wrap gap-2 mb-5">
        {weeks.map((w) => {
          const s = hydrated ? scores[w.week] : undefined;
          return (
            <button
              key={w.week}
              type="button"
              onClick={() => { setWeek(w.week); setPhase('intro'); }}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm border transition-all active:scale-95 ${
                week === w.week
                  ? 'bg-amber-500/20 border-amber-400/40 text-text-primary'
                  : 'bg-[var(--bg-surface-hover)] border-[var(--border-light)] text-text-secondary hover:text-text-primary'
              }`}
            >
              Tuần {w.week}
              {s && <span className="text-[10px] text-tone-emerald">{s.total}/16</span>}
            </button>
          );
        })}
      </div>

      {/* Giới thiệu */}
      {phase === 'intro' && (
        <div className="rounded-2xl border border-[var(--border-light)] bg-[var(--bg-surface-hover)] p-6 text-center">
          <p className="text-2xl mb-2">📝</p>
          <h3 className="text-xl font-bold text-text-primary">
            Kiểm tra tuần {block.week} — {block.title}
          </h3>
          <p className="text-text-secondary text-sm mt-2 leading-relaxed">
            Hai phần, tổng 16 câu:
          </p>
          <div className="mt-4 space-y-2 text-left text-sm">
            <p className="rounded-xl border border-[var(--border-light)] bg-[var(--bg-surface-hover)] px-4 py-3 text-text-secondary">
              <b className="text-tone-violet">Phần 1 — Tự nói (8 câu).</b> Hiện nghĩa tiếng Việt, bạn
              nói to câu tiếng Anh rồi bấm xem đáp án và tự chấm. Nói ra miệng thật, đừng nghĩ thầm.
            </p>
            <p className="rounded-xl border border-[var(--border-light)] bg-[var(--bg-surface-hover)] px-4 py-3 text-text-secondary">
              <b className="text-tone-emerald">Phần 2 — Trắc nghiệm từ vựng (8 câu).</b> Chọn nghĩa
              đúng, chấm tự động.
            </p>
          </div>
          {saved && (
            <p className="mt-4 text-xs text-text-muted">
              Lần trước bạn đạt <b className="text-tone-emerald">{saved.total}/16</b>
              {' '}(nói {saved.speak}/8 · trắc nghiệm {saved.quiz}/8)
            </p>
          )}
          <button
            type="button"
            onClick={start}
            className="mt-5 px-6 py-3 rounded-xl bg-amber-500/20 border border-amber-400/40 text-text-primary text-sm hover:bg-amber-500/30 transition-colors"
          >
            Bắt đầu kiểm tra
          </button>
        </div>
      )}

      {/* Phần 1 — Tự nói */}
      {phase === 'speak' && speakItems[sIdx] && (
        <div>
          <div className="flex items-center justify-between text-xs text-text-muted mb-3">
            <span>Phần 1 · Câu {sIdx + 1}/{speakItems.length}</span>
            <span>Đúng: <b className="text-tone-emerald">{sRight}</b></span>
          </div>
          <div className="rounded-2xl border border-[var(--border-light)] bg-[var(--bg-surface-hover)] p-6">
            <p className="text-xs text-text-muted mb-2">Nói câu này bằng tiếng Anh:</p>
            <p className="text-xl font-bold text-text-primary leading-snug">{speakItems[sIdx].vi}</p>

            {!revealed ? (
              <button
                type="button"
                onClick={() => setRevealed(true)}
                className="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-violet-500/20 border border-violet-400/40 text-text-primary text-sm hover:bg-violet-500/30 transition-colors"
              >
                <Eye className="w-4 h-4" />
                Tôi đã nói xong — xem đáp án
              </button>
            ) : (
              <>
                <div className="mt-5 rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-4">
                  <div className="flex items-start gap-2">
                    <p className="text-lg text-tone-emerald flex-1">{speakItems[sIdx].en}</p>
                    {supported && (
                      <button
                        type="button"
                        onClick={() => speak(speakItems[sIdx].en)}
                        aria-label="Nghe"
                        className={`shrink-0 p-1.5 rounded-lg transition-all active:scale-90 ${
                          current === speakItems[sIdx].en ? 'bg-violet-500/30 text-tone-violet' : 'text-text-secondary hover:text-tone-violet'
                        }`}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {speakItems[sIdx].ipa && (
                    <p className="text-tone-violet text-xs font-mono mt-1">{speakItems[sIdx].ipa}</p>
                  )}
                </div>
                <p className="text-xs text-text-muted mt-4 text-center">Bạn nói có khớp không?</p>
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSRight((s) => s + 1);
                      setRevealed(false);
                      if (sIdx + 1 >= speakItems.length) setPhase('quiz'); else setSIdx((i) => i + 1);
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-tone-emerald text-sm hover:bg-emerald-500/25 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    Khớp
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRevealed(false);
                      if (sIdx + 1 >= speakItems.length) setPhase('quiz'); else setSIdx((i) => i + 1);
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[var(--bg-surface-hover)] border border-[var(--border-light)] text-text-secondary text-sm hover:bg-[var(--bg-surface-active)] transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Chưa khớp
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Phần 2 — Trắc nghiệm */}
      {phase === 'quiz' && quizItems[qIdx] && (
        <div>
          <div className="flex items-center justify-between text-xs text-text-muted mb-3">
            <span>Phần 2 · Câu {qIdx + 1}/{quizItems.length}</span>
            <span>Đúng: <b className="text-tone-emerald">{qRight}</b></span>
          </div>
          <div className="rounded-2xl border border-[var(--border-light)] bg-[var(--bg-surface-hover)] p-5">
            <p className="text-xs text-text-muted mb-2">Từ này nghĩa là gì?</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-text-primary">{quizItems[qIdx].en}</p>
              {supported && (
                <button
                  type="button"
                  onClick={() => speak(quizItems[qIdx].en)}
                  aria-label="Nghe"
                  className="p-1.5 rounded-lg text-text-muted hover:text-tone-violet transition-colors"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-tone-violet text-xs font-mono mt-1">{quizItems[qIdx].ipa}</p>

            <div className="mt-4 space-y-2">
              {quizItems[qIdx].options.map((opt, i) => {
                const isRight = opt === quizItems[qIdx].answer;
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
                      if (isRight) setQRight((s) => s + 1);
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
              <button
                type="button"
                onClick={() => {
                  // `qRight` ở đây đã là giá trị SAU khi cộng: điểm được cộng
                  // lúc bấm đáp án, component đã render lại, nên closure của
                  // nút này giữ giá trị mới.
                  setPicked(null);
                  if (qIdx + 1 >= quizItems.length) finish(qRight);
                  else setQIdx((i) => i + 1);
                }}
                className="mt-4 w-full px-4 py-3 rounded-xl bg-violet-500/20 border border-violet-400/40 text-text-primary text-sm hover:bg-violet-500/30 transition-colors"
              >
                {qIdx + 1 === quizItems.length ? 'Xem kết quả' : 'Câu tiếp theo →'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Kết quả */}
      {phase === 'done' && (
        <div className="rounded-2xl border border-[var(--border-light)] bg-[var(--bg-surface-hover)] p-8 text-center">
          <Trophy className={`w-12 h-12 mx-auto mb-3 ${
            sRight + qRight >= 13 ? 'text-tone-amber' : sRight + qRight >= 9 ? 'text-text-secondary' : 'text-text-muted'
          }`} />
          <p className="text-3xl font-bold text-text-primary">{sRight + qRight}/{maxScore}</p>
          <p className="text-text-secondary text-sm mt-1">
            Tự nói {sRight}/{speakItems.length} · Trắc nghiệm {qRight}/{quizItems.length}
          </p>
          <p className="text-text-secondary text-sm mt-4 leading-relaxed">
            {sRight + qRight >= 13
              ? 'Rất tốt! Bạn đã sẵn sàng sang tuần tiếp theo.'
              : sRight + qRight >= 9
                ? 'Khá ổn. Ôn lại những ngày bạn còn ngập ngừng rồi thử lại.'
                : 'Nên học lại tuần này một lượt nữa trước khi đi tiếp — nền không chắc thì tuần sau sẽ đuối.'}
          </p>
          <button
            type="button"
            onClick={start}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-text-primary text-sm hover:bg-amber-500/30 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Làm lại với câu khác
          </button>
        </div>
      )}
    </div>
  );
}
