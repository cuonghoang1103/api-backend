'use client';

/**
 * /interview/drill — the daily spaced-repetition habit. Rapid-fire flashcards
 * from concepts you got wrong: recall → reveal reference → rate. SM-2 reschedules.
 * STATIC, zero LLM, unlimited, mobile-first. This is what brings you back daily.
 */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, Sparkles, Check } from 'lucide-react';
import ParticleBackground from '@/components/repos/ParticleBackground';
import Markdown from '@/components/markdown/Markdown';
import { interviewApi } from '@/lib/interview-api';
import type { DrillCard } from '@/types/interview';

const RATINGS = [
  { q: 1, label: 'Quên', cls: 'border-red-500/50 text-red-300 hover:bg-red-500/10' },
  { q: 3, label: 'Khó', cls: 'border-amber-500/50 text-amber-300 hover:bg-amber-500/10' },
  { q: 4, label: 'Được', cls: 'border-lime-500/50 text-lime-300 hover:bg-lime-500/10' },
  { q: 5, label: 'Dễ', cls: 'border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/10' },
];

export default function InterviewDrillPage() {
  const [cards, setCards] = useState<DrillCard[]>([]);
  const [totalDue, setTotalDue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [grading, setGrading] = useState(false);
  const [done, setDone] = useState(0);

  useEffect(() => {
    interviewApi.drill('VI').then((r) => { setCards(r.data.data.cards); setTotalDue(r.data.data.totalDue); }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const card = cards[idx];

  const grade = async (quality: number) => {
    if (!card) return;
    setGrading(true);
    try {
      const res = await interviewApi.gradeCard(card.cardId, { quality, answer: answer.trim() || undefined });
      const d = res.data.data;
      if (d.deterministic) {
        toast[d.deterministic.score >= 70 ? 'success' : 'info'](`Máy chấm: ${d.deterministic.score}/100 (${d.deterministic.grade})${d.deterministic.redFlagsHit.length ? ' · có lỗi kiến thức' : ''}`);
      }
      setDone((n) => n + 1);
      // advance
      if (idx + 1 < cards.length) {
        setIdx((i) => i + 1); setAnswer(''); setRevealed(false);
      } else {
        setCards([]); // finished this batch
      }
    } catch {
      toast.error('Không ghi được kết quả');
    } finally {
      setGrading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-darkbg text-slate-100 pt-16 overflow-hidden">
      <ParticleBackground density="low" followPointer={false} />
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/interview" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-100"><ArrowLeft className="w-4 h-4" /> Phòng luyện</Link>
          {cards.length > 0 && <span className="text-xs font-mono text-slate-400">Thẻ {Math.min(idx + 1, cards.length)} / {cards.length} · {totalDue} tới hạn</span>}
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-slate-400"><Loader2 className="w-4 h-4 animate-spin" /> Đang tải thẻ ôn…</div>
        ) : !card ? (
          <div className="text-center py-16">
            <Sparkles className="w-10 h-10 mx-auto mb-4 text-amber-400" />
            <h1 className="text-xl font-bold mb-2">{done > 0 ? `Xong ${done} thẻ hôm nay! 🎉` : 'Không có thẻ nào tới hạn'}</h1>
            <p className="text-slate-400 mb-6">Thẻ ôn được tạo từ những khái niệm bạn trả lời chưa tốt trong buổi phỏng vấn. Cứ luyện thêm phiên đầy đủ để có thẻ ôn.</p>
            <Link href="/interview" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-semibold">Bắt đầu một phiên</Link>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-3 text-xs">
              {card.topic && <span className="px-2 py-0.5 rounded bg-white/5 text-slate-300">{card.topic}</span>}
              {card.concept && <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300">{card.concept}</span>}
              {card.variantGap && <span className="px-2 py-0.5 rounded bg-white/5 text-slate-500" title="Chưa có biến thể khác của khái niệm này">1 phiên bản</span>}
            </div>

            <div className="text-lg font-semibold leading-relaxed mb-4 markdown-body">
              <Markdown mdx={card.question.body} openLinksInNewTab />
            </div>

            {!revealed ? (
              <>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  rows={5}
                  placeholder="(Tuỳ chọn) Trả lời nhanh rồi bấm Hiện đáp án — nếu có, máy sẽ chấm khách quan."
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-4 text-slate-100 font-mono text-sm focus:outline-none focus:border-amber-500/60 resize-y mb-3"
                />
                <button onClick={() => setRevealed(true)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-semibold">
                  <Check className="w-4 h-4" /> Hiện đáp án
                </button>
              </>
            ) : (
              <div className="space-y-4">
                {card.question.referenceAnswer && (
                  <div className="rounded-xl border border-white/10 p-4 bg-white/[0.04]">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">Đáp án mẫu</div>
                    <div className="text-sm markdown-body"><Markdown mdx={card.question.referenceAnswer} openLinksInNewTab /></div>
                  </div>
                )}
                <div>
                  <p className="text-sm text-slate-400 mb-2">Bạn nhớ khái niệm này tới đâu?</p>
                  <div className="grid grid-cols-4 gap-2">
                    {RATINGS.map((r) => (
                      <button key={r.q} disabled={grading} onClick={() => grade(r.q)} className={`py-3 rounded-xl border font-semibold text-sm transition-all disabled:opacity-50 ${r.cls}`}>
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
