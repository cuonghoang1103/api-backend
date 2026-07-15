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
  { q: 1, vi: 'Quên', en: 'Forgot', cls: 'border-red-500/50 text-red-300 hover:bg-red-500/10' },
  { q: 3, vi: 'Khó', en: 'Hard', cls: 'border-amber-500/50 text-amber-300 hover:bg-amber-500/10' },
  { q: 4, vi: 'Được', en: 'Good', cls: 'border-lime-500/50 text-lime-300 hover:bg-lime-500/10' },
  { q: 5, vi: 'Dễ', en: 'Easy', cls: 'border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/10' },
];

export default function InterviewDrillPage() {
  const [lang, setLangState] = useState<'VI' | 'EN'>('VI');
  // Share the module-wide language choice with the setup/history pages.
  useEffect(() => {
    try {
      const saved = localStorage.getItem('interview:uiLang');
      if (saved === 'EN' || saved === 'VI') setLangState(saved);
    } catch { /* ignore */ }
  }, []);
  const setLang = (l: 'VI' | 'EN') => {
    setLangState(l);
    try { localStorage.setItem('interview:uiLang', l); } catch { /* ignore */ }
  };
  const [cards, setCards] = useState<DrillCard[]>([]);
  const [totalDue, setTotalDue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [grading, setGrading] = useState(false);
  const [done, setDone] = useState(0);
  const L = (vi: string, en: string) => (lang === 'EN' ? en : vi);

  useEffect(() => {
    setLoading(true); setIdx(0); setAnswer(''); setRevealed(false); setDone(0);
    interviewApi.drill(lang).then((r) => { setCards(r.data.data.cards); setTotalDue(r.data.data.totalDue); }).catch(() => {}).finally(() => setLoading(false));
  }, [lang]);

  const card = cards[idx];

  const grade = async (quality: number) => {
    if (!card) return;
    setGrading(true);
    try {
      const res = await interviewApi.gradeCard(card.cardId, { quality, answer: answer.trim() || undefined });
      const d = res.data.data;
      if (d.deterministic) {
        toast[d.deterministic.score >= 70 ? 'success' : 'info'](`${L('Máy chấm', 'Grader')}: ${d.deterministic.score}/100 (${d.deterministic.grade})${d.deterministic.redFlagsHit.length ? L(' · có lỗi kiến thức', ' · knowledge error') : ''}`);
      }
      setDone((n) => n + 1);
      // advance
      if (idx + 1 < cards.length) {
        setIdx((i) => i + 1); setAnswer(''); setRevealed(false);
      } else {
        setCards([]); // finished this batch
      }
    } catch {
      toast.error(L('Không ghi được kết quả', 'Failed to save result'));
    } finally {
      setGrading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-darkbg text-slate-100 pt-16 overflow-hidden">
      <ParticleBackground density="low" followPointer={false} />
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/interview" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-100"><ArrowLeft className="w-4 h-4" /> {L('Phòng luyện', 'Practice room')}</Link>
          <div className="flex items-center gap-3">
            <div className="flex rounded-lg border border-white/10 overflow-hidden text-[11px] font-mono">
              {(['VI', 'EN'] as const).map((lg) => (
                <button key={lg} onClick={() => setLang(lg)} className={`px-2 py-1 transition-colors ${lang === lg ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'}`}>{lg}</button>
              ))}
            </div>
            {cards.length > 0 && <span className="text-xs font-mono text-slate-400">{L('Thẻ', 'Card')} {Math.min(idx + 1, cards.length)} / {cards.length} · {totalDue} {L('tới hạn', 'due')}</span>}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-slate-400"><Loader2 className="w-4 h-4 animate-spin" /> {L('Đang tải thẻ ôn…', 'Loading review cards…')}</div>
        ) : !card ? (
          <div className="text-center py-16">
            <Sparkles className="w-10 h-10 mx-auto mb-4 text-amber-400" />
            <h1 className="text-xl font-bold mb-2">{done > 0 ? L(`Xong ${done} thẻ hôm nay! 🎉`, `Done ${done} cards today! 🎉`) : L('Không có thẻ nào tới hạn', 'No cards due')}</h1>
            <p className="text-slate-400 mb-6">{L('Thẻ ôn được tạo từ những khái niệm bạn trả lời chưa tốt trong buổi phỏng vấn. Cứ luyện thêm phiên đầy đủ để có thẻ ôn.', 'Review cards come from concepts you answered poorly in interviews. Do more full sessions to build your deck.')}</p>
            <Link href="/interview" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-semibold">{L('Bắt đầu một phiên', 'Start a session')}</Link>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-3 text-xs">
              {card.topic && <span className="px-2 py-0.5 rounded bg-white/5 text-slate-300">{card.topic}</span>}
              {card.concept && <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300">{card.concept}</span>}
              {card.variantGap && <span className="px-2 py-0.5 rounded bg-white/5 text-slate-500" title={L('Chưa có biến thể khác của khái niệm này', 'No other variant of this concept yet')}>{L('1 phiên bản', '1 variant')}</span>}
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
                  placeholder={L('(Tuỳ chọn) Trả lời nhanh rồi bấm Hiện đáp án — nếu có, máy sẽ chấm khách quan.', '(Optional) Answer quickly then reveal — if you do, the grader scores it objectively.')}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-4 text-slate-100 font-mono text-sm focus:outline-none focus:border-amber-500/60 resize-y mb-3"
                />
                <button onClick={() => setRevealed(true)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-semibold">
                  <Check className="w-4 h-4" /> {L('Hiện đáp án', 'Reveal answer')}
                </button>
              </>
            ) : (
              <div className="space-y-4">
                {card.question.referenceAnswer && (
                  <div className="rounded-xl border border-white/10 p-4 bg-white/[0.04]">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">{L('Đáp án mẫu', 'Model answer')}</div>
                    <div className="text-sm markdown-body"><Markdown mdx={card.question.referenceAnswer} openLinksInNewTab /></div>
                  </div>
                )}
                <div>
                  <p className="text-sm text-slate-400 mb-2">{L('Bạn nhớ khái niệm này tới đâu?', 'How well do you recall this concept?')}</p>
                  <div className="grid grid-cols-4 gap-2">
                    {RATINGS.map((r) => (
                      <button key={r.q} disabled={grading} onClick={() => grade(r.q)} className={`py-3 rounded-xl border font-semibold text-sm transition-all disabled:opacity-50 ${r.cls}`}>
                        {L(r.vi, r.en)}
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
