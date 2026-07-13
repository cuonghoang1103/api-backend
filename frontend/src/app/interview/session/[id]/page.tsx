'use client';

/**
 * /interview/session/[id] — the interview room (STATIC self-assessment).
 * Low-chrome by design: the question, your answer, the timer, and the
 * interviewer's quiet presence. After you answer, the reference answer + rubric
 * are revealed so you self-score; the objective deterministic check is shown
 * alongside. No mid-interview verdict beyond that — the payoff is the report.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, ArrowRight, Flag, CheckCircle2, XCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import ParticleBackground from '@/components/repos/ParticleBackground';
import Markdown from '@/components/markdown/Markdown';
import { interviewApi } from '@/lib/interview-api';
import type { SessionState, PublicTurn, SubmitAnswerResponse, IntegritySignals } from '@/types/interview';

function fmtTime(ms: number): string {
  const s = Math.floor(ms / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

export default function InterviewRoomPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = Number(params.id);

  const [session, setSession] = useState<SessionState | null>(null);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(0);
  const [answer, setAnswer] = useState('');
  const [mcqChoice, setMcqChoice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [revealed, setRevealed] = useState<SubmitAnswerResponse | null>(null);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [advancing, setAdvancing] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [now, setNow] = useState(0);

  // Integrity signals (non-invasive, informational).
  const startRef = useRef<number>(0);
  const blurAccumRef = useRef<number>(0);
  const blurStartRef = useRef<number | null>(null);
  const pastesRef = useRef<{ count: number; chars: number }>({ count: 0, chars: 0 });
  const [blurred, setBlurred] = useState(false);

  const turn: PublicTurn | undefined = session?.turns[order];
  const isMcq = turn?.type === 'MCQ';
  const total = session?.total ?? 0;

  // Load session + resume at first unanswered turn.
  useEffect(() => {
    interviewApi
      .getSession(sessionId)
      .then((res) => {
        const s = res.data.data;
        setSession(s);
        const firstUnanswered = s.turns.findIndex((t) => !t.answered);
        setOrder(firstUnanswered < 0 ? Math.max(0, s.turns.length - 1) : firstUnanswered);
        if (firstUnanswered < 0 && s.hasReport) router.replace(`/interview/report/${sessionId}`);
      })
      .catch(() => toast.error('Không tải được phiên phỏng vấn'))
      .finally(() => setLoading(false));
  }, [sessionId, router]);

  // Per-question timer + reset integrity accumulators when the turn changes.
  useEffect(() => {
    startRef.current = Date.now();
    blurAccumRef.current = 0;
    blurStartRef.current = null;
    pastesRef.current = { count: 0, chars: 0 };
    setNow(Date.now());
    const iv = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(iv);
  }, [order]);

  // Tab-blur tracking (Page Visibility API). In Focused Mode we surface an
  // overlay; either way we only *record*, never punish.
  useEffect(() => {
    const onVis = () => {
      if (document.hidden) {
        blurStartRef.current = Date.now();
        if (session?.focusedMode) setBlurred(true);
      } else if (blurStartRef.current) {
        blurAccumRef.current += Date.now() - blurStartRef.current;
        blurStartRef.current = null;
        setBlurred(false);
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [session?.focusedMode]);

  const collectSignals = useCallback((): IntegritySignals => ({
    pastes: pastesRef.current.count,
    pastedChars: pastesRef.current.chars,
    tabBlurMs: blurAccumRef.current,
    typedChars: answer.length,
    elapsedMs: Date.now() - startRef.current,
  }), [answer.length]);

  const onPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const text = e.clipboardData.getData('text');
    if (text.length > 20) { pastesRef.current.count += 1; pastesRef.current.chars += text.length; }
    if (session?.focusedMode) {
      e.preventDefault();
      toast.info('Focused Mode: đã tắt dán để buổi luyện có giá trị thật.');
    }
  };

  const submit = async () => {
    if (isMcq ? !mcqChoice : !answer.trim()) { toast.warning('Nhập câu trả lời trước'); return; }
    setSubmitting(true);
    try {
      const res = await interviewApi.answer(sessionId, order, {
        answer: isMcq ? undefined : answer,
        selectedOptionId: isMcq ? mcqChoice : undefined,
        timeSpentMs: Date.now() - startRef.current,
        integritySignals: collectSignals(),
      });
      setRevealed(res.data.data);
    } catch {
      toast.error('Không gửi được câu trả lời');
    } finally {
      setSubmitting(false);
    }
  };

  const next = async () => {
    const isLast = order + 1 >= total;
    if (!isMcq && revealed) {
      // Record self-assessment before advancing.
      setAdvancing(true);
      try {
        await interviewApi.selfAssess(sessionId, order, ratings);
      } catch { /* non-fatal — deterministic score already saved */ }
      setAdvancing(false);
    }
    if (isLast) { await finish(); return; }
    setOrder((o) => o + 1);
    setAnswer(''); setMcqChoice(''); setRevealed(null); setRatings({});
  };

  const finish = async () => {
    setFinishing(true);
    try {
      await interviewApi.finish(sessionId);
      router.push(`/interview/report/${sessionId}`);
    } catch {
      toast.error('Không tạo được báo cáo');
      setFinishing(false);
    }
  };

  const elapsed = useMemo(() => (now && startRef.current ? now - startRef.current : 0), [now]);

  if (loading) {
    return <div className="min-h-screen bg-darkbg pt-16 flex items-center justify-center text-slate-400"><Loader2 className="w-5 h-5 animate-spin mr-2" /> Đang vào phòng…</div>;
  }
  if (!session || !turn) {
    return <div className="min-h-screen bg-darkbg pt-16 flex items-center justify-center text-slate-400">Phiên không tồn tại.</div>;
  }

  const state: 'listening' | 'reviewing' = revealed ? 'reviewing' : 'listening';

  return (
    <div className="relative min-h-screen bg-darkbg text-slate-100 pt-16 overflow-hidden">
      <ParticleBackground density="low" followPointer={false} />
      <div className="relative z-10 max-w-3xl mx-auto px-4 py-8">
        {/* Interviewer presence + progress */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className={`w-2.5 h-2.5 rounded-full ${state === 'listening' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <div>
              <div className="text-sm font-semibold text-slate-100">Người phỏng vấn</div>
              <div className="text-xs text-slate-400">
                {session.companyStyle ? `${session.companyStyle} · ` : ''}{state === 'listening' ? 'đang lắng nghe' : 'đang xem xét câu trả lời'}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-mono text-slate-400">Câu {order + 1} / {total}</div>
            <div className="text-xs font-mono text-slate-400 tabular-nums">{fmtTime(elapsed)}</div>
          </div>
        </div>

        {/* Progress rail */}
        <div className="flex gap-1 mb-8">
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full ${i < order ? 'bg-amber-500' : i === order ? 'bg-amber-500/50' : 'bg-white/10'}`} />
          ))}
        </div>

        {/* Question */}
        <div className="mb-6">
          <div className="text-[11px] font-mono uppercase tracking-widest text-slate-400 mb-2">{turn.type}</div>
          <div className="text-xl md:text-2xl font-semibold text-slate-100 leading-relaxed markdown-body"><Markdown mdx={turn.questionText} openLinksInNewTab /></div>
        </div>

        {/* Answer area */}
        {isMcq ? (
          <div className="space-y-2 mb-4">
            {turn.mcqOptions?.map((o) => {
              const chosen = mcqChoice === o.id;
              const isCorrect = revealed?.correctOptionId === o.id;
              return (
                <button
                  key={o.id}
                  disabled={!!revealed}
                  onClick={() => setMcqChoice(o.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                    revealed
                      ? isCorrect ? 'border-emerald-500/60 bg-emerald-500/10' : chosen ? 'border-red-500/50 bg-red-500/10' : 'border-white/10'
                      : chosen ? 'border-amber-500/60 bg-amber-500/10' : 'border-white/10 hover:border-slate-500'
                  }`}
                >
                  <span className="text-slate-100">{o.text}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onPaste={onPaste}
            disabled={!!revealed}
            rows={8}
            placeholder="Trả lời như đang phỏng vấn thật. Giải thích bằng ngôn ngữ của bạn — máy chấm hiểu cả từ đồng nghĩa."
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-4 text-slate-100 font-mono text-sm leading-relaxed focus:outline-none focus:border-amber-500/60 resize-y disabled:opacity-70"
          />
        )}

        {/* Actions / reveal */}
        {!revealed ? (
          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-slate-400">Không hiện điểm giữa buổi — cảm giác áp lực là điều làm buổi luyện có giá trị.</span>
            <button onClick={submit} disabled={submitting} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-semibold hover:opacity-90 disabled:opacity-40">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />} Gửi câu trả lời
            </button>
          </div>
        ) : (
          <Reveal
            revealed={revealed}
            isMcq={isMcq}
            ratings={ratings}
            setRatings={setRatings}
            onNext={next}
            advancing={advancing || finishing}
            isLast={order + 1 >= total}
          />
        )}
      </div>

      {/* Focused-mode blur overlay */}
      {blurred && (
        <div className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center text-white">
            <ShieldCheck className="w-10 h-10 mx-auto mb-3 opacity-80" />
            <p className="text-lg font-semibold">Focused Mode — quay lại buổi phỏng vấn</p>
            <p className="text-sm opacity-70 mt-1">Đồng hồ tạm dừng. Nhấp vào đây để tiếp tục.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function Reveal({
  revealed, isMcq, ratings, setRatings, onNext, advancing, isLast,
}: {
  revealed: SubmitAnswerResponse;
  isMcq: boolean;
  ratings: Record<string, number>;
  setRatings: (r: Record<string, number>) => void;
  onNext: () => void;
  advancing: boolean;
  isLast: boolean;
}) {
  const det = revealed.deterministic;
  return (
    <div className="mt-6 space-y-5">
      {isMcq && (
        <div className={`flex items-center gap-2 text-sm font-semibold ${revealed.correct ? 'text-emerald-400' : 'text-red-400'}`}>
          {revealed.correct ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
          {revealed.correct ? 'Chính xác' : 'Chưa đúng'}
        </div>
      )}

      {revealed.injectionAttempted && (
        <div className="flex items-start gap-2 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          Câu trả lời có dấu hiệu cố gắng "điều khiển" người chấm. Điểm chỉ tính trên nội dung kỹ thuật.
        </div>
      )}

      {/* Deterministic coverage */}
      {det && (
        <div className="rounded-xl border border-white/10 p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">Máy chấm khách quan (Pass A)</div>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {det.mustHit.map((k) => <Tag key={k} tone="ok">{k}</Tag>)}
            {det.mustMiss.map((k) => <Tag key={k} tone="miss">thiếu: {k}</Tag>)}
          </div>
          {det.redFlagsHit.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {det.redFlagsHit.map((k) => <Tag key={k} tone="flag">⚠ {k}</Tag>)}
            </div>
          )}
          <div className="text-sm text-slate-400">Bao phủ khái niệm cốt lõi: <span className="font-mono text-slate-100">{det.mustHit.length}/{det.mustHit.length + det.mustMiss.length}</span> · Điểm tham chiếu: <span className="font-mono text-slate-100">{det.score}/100 ({det.grade})</span></div>
        </div>
      )}

      {/* Reference answer */}
      {revealed.referenceAnswer && (
        <div className="rounded-xl border border-white/10 p-4 bg-white/[0.04]">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">Đáp án mẫu (mức mong đợi)</div>
          <div className="text-sm text-slate-100 leading-relaxed markdown-body"><Markdown mdx={revealed.referenceAnswer} openLinksInNewTab /></div>
        </div>
      )}

      {/* Self-assessment (non-MCQ) */}
      {!isMcq && revealed.rubric && revealed.rubric.length > 0 && (
        <div className="rounded-xl border border-white/10 p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">Tự chấm theo từng tiêu chí</div>
          <p className="text-xs text-slate-400 mb-3">Thành thật với chính mình — chênh lệch giữa "mình nghĩ đúng" và máy chấm là phản hồi giá trị nhất.</p>
          <div className="space-y-3">
            {revealed.rubric.map((c) => (
              <div key={c.id} className="flex items-center justify-between gap-3">
                <span className="text-sm text-slate-100">{c.criterion} <span className="text-slate-400">({Math.round(c.weight * 100)}%)</span></span>
                <div className="flex gap-1 shrink-0">
                  {[0, 1, 2, 3, 4].map((v) => (
                    <button key={v} onClick={() => setRatings({ ...ratings, [c.id]: v })} className={`w-7 h-7 rounded-md text-xs font-mono border ${ratings[c.id] === v ? 'border-amber-500/70 bg-amber-500/15 text-amber-300' : 'border-white/10 text-slate-400'}`}>{v}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button onClick={onNext} disabled={advancing} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-semibold hover:opacity-90 disabled:opacity-40">
          {advancing ? <Loader2 className="w-4 h-4 animate-spin" /> : isLast ? <Flag className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          {isLast ? 'Kết thúc & xem báo cáo' : 'Câu tiếp theo'}
        </button>
      </div>
    </div>
  );
}

function Tag({ tone, children }: { tone: 'ok' | 'miss' | 'flag'; children: React.ReactNode }) {
  const cls =
    tone === 'ok' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
    : tone === 'flag' ? 'bg-red-500/10 text-red-300 border-red-500/30'
    : 'bg-white/[0.04] text-slate-400 border-white/10';
  return <span className={`px-2 py-0.5 rounded-md text-xs border ${cls}`}>{children}</span>;
}
