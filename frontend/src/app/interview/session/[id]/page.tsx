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
import { Loader2, ArrowRight, Flag, CheckCircle2, XCircle, AlertTriangle, ShieldCheck, Volume2, Square, Mic, MessageCircle } from 'lucide-react';
import { useSpeech } from '@/hooks/useSpeech';
import ParticleBackground from '@/components/repos/ParticleBackground';
import Markdown from '@/components/markdown/Markdown';
import { interviewApi } from '@/lib/interview-api';
import { makeT, type ILang } from '@/lib/interview-i18n';
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
  // Display language: defaults to the session language (so the whole room is
  // "pure" VI or EN), toggle-able in the header. Content + AI voice follow the
  // session language; this switches the UI chrome.
  const [displayLang, setDisplayLang] = useState<ILang>('VI');
  const t = makeT(displayLang);
  const [order, setOrder] = useState(0);
  const [answer, setAnswer] = useState('');
  const [mcqChoice, setMcqChoice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [revealed, setRevealed] = useState<SubmitAnswerResponse | null>(null);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const { speak, stopSpeak, speaking, ttsSupported, hasVoiceFor, listen, stopListen, listening, sttSupported, startRecording, stopRecording, recording, recordSupported } = useSpeech();
  const [spoke, setSpoke] = useState(false); // this turn's answer came from voice
  const [transcribing, setTranscribing] = useState(false);
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
        setDisplayLang(s.language === 'EN' ? 'EN' : 'VI');
        const firstUnanswered = s.turns.findIndex((t) => !t.answered);
        setOrder(firstUnanswered < 0 ? Math.max(0, s.turns.length - 1) : firstUnanswered);
        if (firstUnanswered < 0 && s.hasReport) router.replace(`/interview/report/${sessionId}`);
      })
      .catch(() => toast.error(t('tSessionLoadFail')))
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
      toast.info(t('tFocusedPaste'));
    }
  };

  const submit = async () => {
    if (isMcq ? !mcqChoice : !answer.trim()) { toast.warning(t('tEnterAnswer')); return; }
    setSubmitting(true);
    try {
      const res = await interviewApi.answer(sessionId, order, {
        answer: isMcq ? undefined : answer,
        selectedOptionId: isMcq ? mcqChoice : undefined,
        timeSpentMs: Date.now() - startRef.current,
        integritySignals: collectSignals(),
        inputMode: spoke ? 'SPOKEN' : 'TYPED',
        sttProvider: spoke ? (session?.sttProvider ?? 'browser') : undefined,
      });
      setRevealed(res.data.data);
      if (res.data.data.downgraded) {
        toast.info(t('tAiUnavailable'));
      }
    } catch {
      toast.error(t('tSubmitFail'));
    } finally {
      setSubmitting(false);
    }
  };

  // Read the question aloud (browser TTS). If the OS has no voice for the
  // session language, don't read with the wrong voice — keep it text-only.
  const readQuestion = () => {
    if (!session || !turn) return;
    const lang = session.language === 'EN' ? 'EN' : 'VI';
    if (speaking) { stopSpeak(); return; }
    if (!speak(turn.questionText, lang)) {
      toast.info(t(lang === 'VI' ? 'tNoViVoice' : 'tNoEnVoice'));
    }
  };

  // Auto-read the AI grade aloud once it appears (user opted into auto-read).
  // Only AI-graded turns have spoken feedback; STATIC self-assess turns don't.
  const spokenGradeRef = useRef<number | null>(null);
  useEffect(() => {
    if (!session || !revealed?.aiEvaluation || !ttsSupported) return;
    if (spokenGradeRef.current === order) return; // already read this turn
    spokenGradeRef.current = order;
    const lang: 'VI' | 'EN' = session.language === 'EN' ? 'EN' : 'VI';
    speak(buildGradeSpeech(revealed, lang), lang);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealed, session, order, ttsSupported]);

  // Voice answer. Groq path records audio → server transcribes; browser path
  // uses SpeechRecognition. Either way the transcript lands in the editable box.
  const onMic = () => {
    if (!session || !!revealed) return;
    const lang = session.language === 'EN' ? 'EN' : 'VI';
    const useGroq = session.sttProvider === 'groq';
    if (useGroq) {
      if (recording) { stopRecording(); return; }
      void startRecording(async (blob) => {
        if (!blob) { toast.error(t('tRecordFail')); return; }
        setTranscribing(true);
        try {
          const r = await interviewApi.transcribe(sessionId, order, blob, lang === 'EN' ? 'en' : 'vi');
          const txt = (r.data.data.text || '').trim();
          if (txt) {
            setAnswer((p) => (p.trim() ? p.trimEnd() + ' ' : '') + txt);
            setSpoke(true);
            toast.info(t('tTranscribed'));
          } else {
            toast.warning(t('tUnclear'));
          }
        } catch {
          toast.error(t('tSttServerFail'));
        } finally {
          setTranscribing(false);
        }
      });
    } else {
      if (listening) { stopListen(); return; }
      listen(
        lang,
        (t) => { setAnswer((p) => (p.trim() ? p.trimEnd() + ' ' : '') + t); setSpoke(true); },
        (code) => {
          if (code === 'not-allowed' || code === 'service-not-allowed') {
            toast.error(t('tMicBlocked'));
          } else if (code === 'no-speech') {
            toast.warning(t('tNoSpeech'));
          } else if (code === 'unsupported') {
            toast.error(t('tSttUnsupported'));
          } else {
            toast.error(t('tMicUnavailable'));
          }
        },
      );
    }
  };

  const next = async () => {
    stopSpeak(); // stop any in-progress grade read-out before moving on
    const isLast = order + 1 >= total;
    // AI-graded turns have no self-assessment step; only STATIC turns self-score.
    if (!isMcq && revealed && !revealed.aiEvaluation) {
      setAdvancing(true);
      try {
        await interviewApi.selfAssess(sessionId, order, ratings);
      } catch { /* non-fatal — deterministic score already saved */ }
      setAdvancing(false);
    }
    if (isLast) { await finish(); return; }
    setOrder((o) => o + 1);
    setAnswer(''); setMcqChoice(''); setRevealed(null); setRatings({}); setSpoke(false);
  };

  const finish = async () => {
    setFinishing(true);
    try {
      await interviewApi.finish(sessionId);
      router.push(`/interview/report/${sessionId}`);
    } catch {
      toast.error(t('tReportFail'));
      setFinishing(false);
    }
  };

  const elapsed = useMemo(() => (now && startRef.current ? now - startRef.current : 0), [now]);

  if (loading) {
    return <div className="min-h-screen bg-darkbg pt-16 flex items-center justify-center text-slate-400"><Loader2 className="w-5 h-5 animate-spin mr-2" /> {t('entering')}</div>;
  }
  if (!session || !turn) {
    return <div className="min-h-screen bg-darkbg pt-16 flex items-center justify-center text-slate-400">{t('sessionMissing')}</div>;
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
              <div className="text-sm font-semibold text-slate-100">{t('interviewer')}</div>
              <div className="text-xs text-slate-400">
                {session.companyStyle ? `${session.companyStyle} · ` : ''}{state === 'listening' ? t('listening') : t('reviewing')}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Display-language toggle (realtime). Defaults to the session language. */}
            <div className="flex rounded-lg border border-white/10 overflow-hidden text-[11px] font-mono">
              {(['VI', 'EN'] as const).map((lg) => (
                <button
                  key={lg}
                  onClick={() => setDisplayLang(lg)}
                  className={`px-2 py-1 transition-colors ${displayLang === lg ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'}`}
                >
                  {lg}
                </button>
              ))}
            </div>
            <div className="text-right">
              <div className="text-xs font-mono text-slate-400">{t('questionOf', { n: order + 1, total })}</div>
              <div className="text-xs font-mono text-slate-400 tabular-nums">{fmtTime(elapsed)}</div>
            </div>
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
          <div className="flex items-center gap-2 mb-2">
            <div className="text-[11px] font-mono uppercase tracking-widest text-slate-400">{turn.type}</div>
            {ttsSupported && (
              <button
                onClick={readQuestion}
                title={speaking ? t('stopReading') : t('hearQuestionTitle')}
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] border transition-colors ${speaking ? 'border-amber-500/50 bg-amber-500/10 text-amber-300' : 'border-white/10 text-slate-400 hover:text-white hover:border-slate-500'}`}
              >
                {speaking ? <Square className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />} {speaking ? t('stop') : t('hearQuestion')}
              </button>
            )}
          </div>
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
        ) : turn.type === 'CODING' ? (
          <div className="mb-4">
            <CodeAnswer value={answer} onChange={setAnswer} disabled={!!revealed} lang={displayLang} />
          </div>
        ) : (
          <div className="relative">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onPaste={onPaste}
              disabled={!!revealed}
              rows={8}
              placeholder={t('answerPlaceholder')}
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-4 text-slate-100 font-mono text-sm leading-relaxed focus:outline-none focus:border-amber-500/60 resize-y disabled:opacity-70"
            />
            {!revealed && (session.sttProvider === 'groq' ? recordSupported : sttSupported) && (() => {
              const active = recording || listening;
              const busy = transcribing;
              return (
                <button
                  onClick={onMic}
                  disabled={busy}
                  title={active ? t('stopRecording') : t('answerByVoice')}
                  className={`absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs border transition-colors disabled:opacity-60 ${active ? 'border-red-500/50 bg-red-500/15 text-red-300 animate-pulse' : 'border-white/10 bg-white/5 text-slate-300 hover:text-white hover:border-slate-500'}`}
                >
                  {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Mic className="w-3.5 h-3.5" />}
                  {busy ? t('transcribing') : active ? t('micListening') : t('speakBtn')}
                </button>
              );
            })()}
          </div>
        )}
        {/* Transcript-check nudge after a spoken answer (prevents grading on mis-heard terms). */}
        {!isMcq && !revealed && spoke && (
          <p className="-mt-2 mb-3 text-[11px] text-amber-300/80">{t('transcriptNudge')}</p>
        )}

        {/* Actions / reveal */}
        {!revealed ? (
          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-slate-400">{t('noMidScore')}</span>
            <button onClick={submit} disabled={submitting} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-semibold hover:opacity-90 disabled:opacity-40">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />} {t('submitAnswer')}
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
            lang={displayLang}
            sessionId={sessionId}
            order={order}
            aiAvailable={session.aiAvailable !== false}
            ttsSupported={ttsSupported}
            speaking={speaking}
            onSpeakGrade={() => { const lang: 'VI' | 'EN' = session.language === 'EN' ? 'EN' : 'VI'; speak(buildGradeSpeech(revealed, lang), lang); }}
            onStopSpeak={stopSpeak}
          />
        )}
      </div>

      {/* Focused-mode blur overlay */}
      {blurred && (
        <div className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center text-white">
            <ShieldCheck className="w-10 h-10 mx-auto mb-3 opacity-80" />
            <p className="text-lg font-semibold">{t('focusedTitle')}</p>
            <p className="text-sm opacity-70 mt-1">{t('focusedSub')}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Compose the AI grade into a spoken script: verdict + score + summary, then
// each criterion (name + score/4 + what was missing). markdown is stripped by
// speak()'s toPlain, so summary can contain markdown safely.
function buildGradeSpeech(r: SubmitAnswerResponse, lang: 'VI' | 'EN'): string {
  const ev = r.aiEvaluation;
  if (!ev) return '';
  const vi = lang === 'VI';
  const parts: string[] = [];
  parts.push(
    vi
      ? `${r.correct ? 'Câu trả lời đạt yêu cầu.' : 'Câu trả lời chưa đạt.'} Điểm ${ev.finalScore} trên 100, xếp loại ${ev.letterGrade}.`
      : `${r.correct ? 'Answer accepted.' : 'Answer not passing yet.'} Score ${ev.finalScore} out of 100, grade ${ev.letterGrade}.`,
  );
  if (ev.summary) parts.push(ev.summary);
  for (const c of ev.criteria) {
    const name = r.rubric?.find((x) => x.id === c.id)?.criterion ?? c.id;
    let line = vi ? `Tiêu chí ${name}: ${c.score} trên 4.` : `Criterion ${name}: ${c.score} out of 4.`;
    if (c.whatWasMissing) line += vi ? ` Còn thiếu: ${c.whatWasMissing}.` : ` Missing: ${c.whatWasMissing}.`;
    parts.push(line);
  }
  return parts.join(' ');
}

function Reveal({
  revealed, isMcq, ratings, setRatings, onNext, advancing, isLast, lang, sessionId, order, aiAvailable,
  ttsSupported, speaking, onSpeakGrade, onStopSpeak,
}: {
  revealed: SubmitAnswerResponse;
  isMcq: boolean;
  ratings: Record<string, number>;
  setRatings: (r: Record<string, number>) => void;
  onNext: () => void;
  advancing: boolean;
  isLast: boolean;
  lang: ILang;
  sessionId: number;
  order: number;
  aiAvailable: boolean;
  ttsSupported: boolean;
  speaking: boolean;
  onSpeakGrade: () => void;
  onStopSpeak: () => void;
}) {
  const t = makeT(lang);
  const det = revealed.deterministic;
  return (
    <div className="mt-6 space-y-5">
      {isMcq && (
        <div className={`flex items-center gap-2 text-sm font-semibold ${revealed.correct ? 'text-emerald-400' : 'text-red-400'}`}>
          {revealed.correct ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
          {revealed.correct ? t('correct') : t('incorrect')}
        </div>
      )}

      {revealed.injectionAttempted && (
        <div className="flex items-start gap-2 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          {t('injection')}
        </div>
      )}

      {/* Deterministic coverage */}
      {det && (
        <div className="rounded-xl border border-white/10 p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">{t('objectiveGrader')}</div>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {det.mustHit.map((k) => <Tag key={k} tone="ok">{k}</Tag>)}
            {det.mustMiss.map((k) => <Tag key={k} tone="miss">{t('missingTag', { k })}</Tag>)}
          </div>
          {det.redFlagsHit.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {det.redFlagsHit.map((k) => <Tag key={k} tone="flag">⚠ {k}</Tag>)}
            </div>
          )}
          <div className="text-sm text-slate-400">{t('coverage')} <span className="font-mono text-slate-100">{det.mustHit.length}/{det.mustHit.length + det.mustMiss.length}</span> · {t('refScore')} <span className="font-mono text-slate-100">{det.score}/100 ({det.grade})</span></div>
        </div>
      )}

      {/* Reference answer */}
      {revealed.referenceAnswer && (
        <div className="rounded-xl border border-white/10 p-4 bg-white/[0.04]">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">{t('refAnswer')}</div>
          <div className="text-sm text-slate-100 leading-relaxed markdown-body"><Markdown mdx={revealed.referenceAnswer} openLinksInNewTab /></div>
        </div>
      )}

      {/* AI grading (HYBRID/FULL_AI) — replaces self-assessment on AI turns */}
      {revealed.aiEvaluation && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/[0.06] p-4">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-amber-300">{t('aiGrading')}</div>
            <div className="flex items-center gap-2 shrink-0">
              {ttsSupported && (
                <button
                  onClick={speaking ? onStopSpeak : onSpeakGrade}
                  title={speaking ? t('stopReading') : t('hearFeedbackTitle')}
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] border transition-colors ${speaking ? 'border-amber-500/50 bg-amber-500/10 text-amber-300' : 'border-white/10 text-slate-400 hover:text-white hover:border-slate-500'}`}
                >
                  {speaking ? <Square className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />} {speaking ? t('stop') : t('hearFeedback')}
                </button>
              )}
              <div className="text-sm font-mono text-slate-100">{revealed.aiEvaluation.finalScore}/100 ({revealed.aiEvaluation.letterGrade})</div>
            </div>
          </div>
          {revealed.aiEvaluation.summary && <p className="text-sm text-slate-300 mb-3">{revealed.aiEvaluation.summary}</p>}
          <div className="space-y-2">
            {revealed.aiEvaluation.criteria.map((c) => {
              const rub = revealed.rubric?.find((r) => r.id === c.id);
              return (
                <div key={c.id} className="text-sm border-t border-white/10 pt-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-100">{rub?.criterion ?? c.id}</span>
                    <span className="font-mono text-xs shrink-0" style={{ color: c.score >= 3 ? '#84cc16' : c.score >= 2 ? '#f59e0b' : '#ef4444' }}>{c.score}/4</span>
                  </div>
                  {c.evidence ? (
                    <p className="text-xs text-emerald-300/90 mt-0.5">“{c.evidence}”</p>
                  ) : (
                    <p className="text-xs text-slate-500 mt-0.5">{t('noEvidence')}</p>
                  )}
                  {c.whatWasMissing && <p className="text-xs text-slate-400 mt-0.5">{t('missingLabel', { x: c.whatWasMissing })}</p>}
                </div>
              );
            })}
          </div>
          {revealed.aiEvaluation.needsReview && (
            <p className="text-[11px] text-amber-300/80 mt-3">{t('needsReview')}</p>
          )}
        </div>
      )}

      {/* Self-assessment — only on STATIC turns (no AI grade) */}
      {!isMcq && !revealed.aiEvaluation && revealed.rubric && revealed.rubric.length > 0 && (
        <div className="rounded-xl border border-white/10 p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">{t('selfAssess')}</div>
          <p className="text-xs text-slate-400 mb-3">{t('selfAssessHint')}</p>
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

      {/* Follow-up (probing) — open questions only, and only when AI is up */}
      {!isMcq && aiAvailable && <FollowUp sessionId={sessionId} order={order} lang={lang} />}

      <div className="flex justify-end">
        <button onClick={onNext} disabled={advancing} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-semibold hover:opacity-90 disabled:opacity-40">
          {advancing ? <Loader2 className="w-4 h-4 animate-spin" /> : isLast ? <Flag className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          {isLast ? t('finishReport') : t('nextQuestion')}
        </button>
      </div>
    </div>
  );
}

const CODE_LANGS = ['javascript', 'typescript', 'python', 'java', 'csharp', 'cpp', 'go', 'rust', 'sql', 'php', 'other'];

// Lightweight code editor for CODING questions: dark, monospace, Tab inserts two
// spaces. (Full Monaco needs a CDN the CSP blocks, so we keep it dependency-free.)
function CodeAnswer({ value, onChange, disabled, lang }: { value: string; onChange: (v: string) => void; disabled: boolean; lang: ILang }) {
  const t = makeT(lang);
  const [codeLang, setCodeLang] = useState('javascript');
  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = e.currentTarget;
      const s = ta.selectionStart;
      const en = ta.selectionEnd;
      onChange(value.slice(0, s) + '  ' + value.slice(en));
      requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = s + 2; });
    }
  };
  return (
    <div className="rounded-xl border border-white/10 overflow-hidden bg-[#0d1117]">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/10 bg-white/[0.03]">
        <span className="text-xs font-mono text-slate-500">&lt;/&gt; {t('codeEditor')}</span>
        <select value={codeLang} onChange={(e) => setCodeLang(e.target.value)} disabled={disabled} className="bg-[#0d1117] text-xs text-slate-300 focus:outline-none border border-white/10 rounded px-1.5 py-0.5">
          {CODE_LANGS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKey}
        disabled={disabled}
        spellCheck={false}
        rows={14}
        placeholder={t('codePlaceholder')}
        className="w-full bg-[#0d1117] text-[#e2e8f0] font-mono text-[13px] leading-relaxed p-4 focus:outline-none resize-y disabled:opacity-70"
        style={{ tabSize: 2 }}
      />
    </div>
  );
}

// Live, stateless follow-up coaching: the interviewer probes deeper. Requires
// Pro/AI (backend gates); errors surface as a toast. Not persisted, not scored.
function FollowUp({ sessionId, order, lang }: { sessionId: number; order: number; lang: ILang }) {
  const t = makeT(lang);
  const [rounds, setRounds] = useState<{ question: string; answer: string; feedback: string }[]>([]);
  const [current, setCurrent] = useState<{ question: string; answer: string } | null>(null);
  const [loadingQ, setLoadingQ] = useState(false);
  const [busy, setBusy] = useState(false);

  const ask = async () => {
    setLoadingQ(true);
    try {
      const previous = [...rounds.map((r) => r.question), ...(current ? [current.question] : [])];
      const res = await interviewApi.generateFollowup(sessionId, order, previous.length ? previous : undefined);
      setCurrent({ question: res.data.data.question, answer: '' });
    } catch (e) {
      const code = (e as { response?: { status?: number } })?.response?.status;
      toast.error(code === 403 ? t('followupProOnly') : t('followupError'));
    } finally {
      setLoadingQ(false);
    }
  };

  const submit = async () => {
    if (!current || !current.answer.trim() || busy) return;
    setBusy(true);
    try {
      const res = await interviewApi.answerFollowup(sessionId, order, current.question, current.answer);
      setRounds((rs) => [...rs, { question: current.question, answer: current.answer, feedback: res.data.data.feedback }]);
      setCurrent(null);
    } catch {
      toast.error(t('followupError'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-xl border border-sky-500/30 bg-sky-500/[0.05] p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-sky-300 mb-1">{t('followupTitle')}</div>
      <p className="text-xs text-slate-400 mb-3">{t('followupIntro')}</p>

      {rounds.map((r, i) => (
        <div key={i} className="mb-3 space-y-1.5 border-l-2 border-sky-500/30 pl-3">
          <div className="text-sm text-slate-100"><span className="text-sky-300 font-semibold">{t('interviewer')}: </span>{r.question}</div>
          <div className="text-sm text-slate-300"><span className="text-slate-400 font-semibold">{t('youLabel')}: </span>{r.answer}</div>
          {r.feedback && <div className="text-xs text-emerald-300/90 bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-2 whitespace-pre-wrap">{r.feedback}</div>}
        </div>
      ))}

      {current ? (
        <div className="space-y-2">
          <div className="text-sm text-slate-100"><span className="text-sky-300 font-semibold">{t('interviewer')}: </span>{current.question}</div>
          <textarea
            value={current.answer}
            onChange={(e) => setCurrent({ ...current, answer: e.target.value })}
            rows={3}
            placeholder={t('followupAnswerPlaceholder')}
            className="w-full rounded-lg border border-white/10 bg-white/[0.04] p-3 text-slate-100 text-sm leading-relaxed focus:outline-none focus:border-sky-500/60 resize-y"
          />
          <button onClick={submit} disabled={busy || !current.answer.trim()} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500 text-slate-950 text-sm font-semibold hover:opacity-90 disabled:opacity-40">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : null} {busy ? t('followupThinking') : t('followupSend')}
          </button>
        </div>
      ) : (
        <button onClick={ask} disabled={loadingQ} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-sky-500/40 text-sky-300 text-sm font-medium hover:bg-sky-500/10 disabled:opacity-50">
          {loadingQ ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageCircle className="w-4 h-4" />}
          {loadingQ ? t('followupThinking') : rounds.length ? t('followupAnother') : t('followupAsk')}
        </button>
      )}
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
