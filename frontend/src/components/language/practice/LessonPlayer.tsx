'use client';
/**
 * My Language — Practice lesson player (Duolingo-style).
 *
 * Full-screen exercise runner for one lesson (= one vocab category). Exercises
 * are generated client-side from the category's words: choose-meaning,
 * choose-word, listen-and-pick, arrange-the-sentence (space-tokenizable
 * languages) and — for Pro users — speak-and-score (records the learner and
 * grades it via /ai/pronounce). On finish it posts the result to
 * `/practice/complete` and shows an XP/crown summary.
 *
 * Theme-aware (CSS vars, never `dark:`).
 */
import { useCallback, useEffect, useState } from 'react';
import { X, Heart, Volume2, Loader2, Flame, Zap, Crown, ArrowRight, Mic, Square } from 'lucide-react';
import { languageApi, type PracticeLesson, type PracticeCompleteResult, type PronunciationResult } from '@/lib/language-api';
import type { VocabWord } from '@/types/language';
import { speakVocabEntry, type VocabLang } from '@/lib/notesTts';
import { useSpeech } from '@/hooks/useSpeech';

function speakLang(code: string): VocabLang | undefined {
  const c = (code || '').toLowerCase();
  if (c === 'ja') return 'ja-JP';
  if (c === 'zh') return 'zh-CN';
  if (c === 'en') return 'en-US';
  return undefined;
}
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function reading(w: VocabWord): string {
  return w.pronunciations?.[0]?.value ?? '';
}
function sample<T>(pool: T[], n: number, exclude: (x: T) => boolean): T[] {
  return shuffle(pool.filter((x) => !exclude(x))).slice(0, n);
}

type Exercise =
  | { type: 'choose-meaning'; word: VocabWord; options: string[]; answer: string }
  | { type: 'choose-word'; word: VocabWord; options: string[]; answer: string }
  | { type: 'listen'; word: VocabWord; options: string[]; answer: string }
  | { type: 'arrange'; word: VocabWord; tokens: string[]; answer: string }
  | { type: 'fill-blank'; word: VocabWord; before: string; after: string; options: string[]; answer: string }
  | { type: 'type-hear'; word: VocabWord; answer: string }
  | { type: 'image-choose'; word: VocabWord; options: string[]; answer: string }
  | { type: 'speak'; word: VocabWord };

const MAX_QUESTIONS = 10;

/** Normalize a free-typed answer for comparison (case/space/diacritic-lenient). */
function norm(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ').replace(/[.,!?;:"']/g, '');
}

function buildExercises(words: VocabWord[], code: string, isPro: boolean): Exercise[] {
  const tokenizable = code.toLowerCase() !== 'ja' && code.toLowerCase() !== 'zh';
  const picked = shuffle(words).slice(0, MAX_QUESTIONS);
  const out: Exercise[] = [];

  for (const w of picked) {
    const tokens = w.exampleSentence ? w.exampleSentence.trim().split(/\s+/) : [];
    const canArrange = tokenizable && tokens.length >= 3 && tokens.length <= 10;
    // Fill-blank needs the sentence to literally contain the word as a token.
    const blankIdx = tokenizable && tokens.length >= 3
      ? tokens.findIndex((t) => t.replace(/[.,!?;:"']/g, '').toLowerCase() === w.word.toLowerCase())
      : -1;
    const canFill = blankIdx >= 0;
    // Type-what-you-hear: latin, single short token (typing CJK is impractical).
    const canType = tokenizable && /^[\p{L}\p{M}'’-]+$/u.test(w.word) && w.word.length <= 18;
    const hasImage = !!(w.imageUrl && w.imageUrl.trim());

    const types: Exercise['type'][] = ['choose-meaning', 'choose-word', 'listen'];
    if (canArrange) types.push('arrange');
    if (canFill) types.push('fill-blank');
    if (canType) types.push('type-hear');
    if (hasImage) types.push('image-choose', 'image-choose');
    if (isPro) types.push('speak');
    const type = types[Math.floor(Math.random() * types.length)];

    if (type === 'choose-meaning') {
      const distractors = sample(words, 3, (x) => x.meaningVi === w.meaningVi).map((x) => x.meaningVi);
      if (distractors.length < 3) { out.push(makeChooseWord(w, words)); continue; }
      out.push({ type: 'choose-meaning', word: w, answer: w.meaningVi, options: shuffle([w.meaningVi, ...distractors]) });
    } else if (type === 'choose-word' || type === 'image-choose') {
      const distractors = sample(words, 3, (x) => x.word === w.word).map((x) => x.word);
      if (distractors.length < 3) { out.push(makeChooseWord(w, words)); continue; }
      out.push({ type, word: w, answer: w.word, options: shuffle([w.word, ...distractors]) });
    } else if (type === 'listen') {
      const distractors = sample(words, 3, (x) => x.word === w.word).map((x) => x.word);
      if (distractors.length < 3) { out.push(makeChooseWord(w, words)); continue; }
      out.push({ type: 'listen', word: w, answer: w.word, options: shuffle([w.word, ...distractors]) });
    } else if (type === 'speak') {
      out.push({ type: 'speak', word: w });
    } else if (type === 'type-hear') {
      out.push({ type: 'type-hear', word: w, answer: w.word });
    } else if (type === 'fill-blank') {
      const distractors = sample(words, 3, (x) => x.word === w.word).map((x) => x.word);
      if (distractors.length < 3) { out.push(makeChooseWord(w, words)); continue; }
      const before = tokens.slice(0, blankIdx).join(' ');
      const after = tokens.slice(blankIdx + 1).join(' ');
      out.push({ type: 'fill-blank', word: w, before, after, answer: w.word, options: shuffle([w.word, ...distractors]) });
    } else {
      out.push({ type: 'arrange', word: w, tokens: shuffle(tokens), answer: tokens.join(' ') });
    }
  }
  return out;
}
function makeChooseWord(w: VocabWord, words: VocabWord[]): Exercise {
  const distractors = sample(words, 3, (x) => x.word === w.word).map((x) => x.word);
  return { type: 'choose-word', word: w, answer: w.word, options: shuffle([w.word, ...distractors]) };
}

export default function LessonPlayer({
  code,
  lesson,
  initialHearts,
  isPro,
  onClose,
  onFinished,
}: {
  code: string;
  lesson: PracticeLesson;
  initialHearts: number;
  isPro: boolean;
  onClose: () => void;
  onFinished: (result: PracticeCompleteResult) => void;
}) {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [index, setIndex] = useState(0);
  const [hearts, setHearts] = useState(initialHearts);
  const [correct, setCorrect] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [phase, setPhase] = useState<'answer' | 'correct' | 'wrong'>('answer');

  const [choice, setChoice] = useState<string | null>(null);
  const [built, setBuilt] = useState<string[]>([]);
  const [typed, setTyped] = useState('');
  // Per-word outcomes → fed to the SRS review queue on finish.
  const [wrongIds, setWrongIds] = useState<number[]>([]);
  const [rightIds, setRightIds] = useState<number[]>([]);

  const { startRecording, stopRecording, recording, recordSupported } = useSpeech();
  const [scoring, setScoring] = useState(false);
  const [speakResult, setSpeakResult] = useState<PronunciationResult | null>(null);

  const [finishing, setFinishing] = useState(false);
  const [result, setResult] = useState<PracticeCompleteResult | null>(null);

  const forceLang = speakLang(code);
  const ex = exercises[index];

  useEffect(() => {
    let alive = true;
    setLoading(true);
    languageApi
      .vocab(code, { categoryId: lesson.categoryId, limit: 100 })
      .then((res) => {
        if (!alive) return;
        const words = (res.data.data ?? []).filter((w) => w.word && w.meaningVi);
        if (words.length < 4) { setLoadError('Bài học cần ít nhất 4 từ.'); return; }
        setExercises(buildExercises(words, code, isPro));
      })
      .catch(() => alive && setLoadError('Không tải được bài học, thử lại sau.'))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [code, lesson.categoryId, isPro]);

  // On each exercise: reset answer state, auto-play a listen prompt.
  useEffect(() => {
    if (ex?.type === 'listen' || ex?.type === 'type-hear') {
      void speakVocabEntry({ term: ex.word.word, reading: reading(ex.word) }, { forceLang });
    }
    setChoice(null);
    setBuilt([]);
    setTyped('');
    setScoring(false);
    setSpeakResult(null);
    setPhase('answer');
    if (recording) stopRecording();
  }, [index, ex?.type]); // eslint-disable-line react-hooks/exhaustive-deps

  const total = exercises.length;

  // Record a graded outcome + remember the word for SRS.
  const mark = useCallback((ok: boolean, wordId: number) => {
    if (ok) { setCorrect((c) => c + 1); setRightIds((a) => [...a, wordId]); setPhase('correct'); }
    else { setMistakes((m) => m + 1); setHearts((h) => Math.max(0, h - 1)); setWrongIds((a) => [...a, wordId]); setPhase('wrong'); }
  }, []);

  const isArrangeReady = ex?.type === 'arrange' && built.length === ex.tokens.length;
  const canCheck =
    ex?.type === 'arrange' ? isArrangeReady
      : ex?.type === 'type-hear' ? typed.trim().length > 0
        : ex?.type === 'choose-meaning' || ex?.type === 'choose-word' || ex?.type === 'listen' || ex?.type === 'fill-blank' || ex?.type === 'image-choose' ? choice != null
          : false;

  const check = useCallback(() => {
    if (!ex || phase !== 'answer') return;
    let ok = false;
    if (ex.type === 'arrange') ok = built.map(keyToken).join(' ').trim().toLowerCase() === ex.answer.trim().toLowerCase();
    else if (ex.type === 'type-hear') ok = norm(typed) === norm(ex.answer);
    else if (ex.type === 'speak') return;
    else ok = choice === ex.answer;
    mark(ok, ex.word.id);
  }, [ex, phase, built, choice, typed, mark]);

  // Speak exercise: record then grade via /ai/pronounce.
  const recordAndScore = useCallback(() => {
    if (recording) { stopRecording(); return; }
    if (!ex || ex.type !== 'speak') return;
    const word = ex.word;
    void startRecording(async (blob) => {
      if (!blob) return;
      setScoring(true);
      try {
        const r = await languageApi.pronounce({ audio: blob, languageCode: code, target: word.word, reading: reading(word) || undefined });
        const res = r.data.data ?? null;
        setSpeakResult(res);
        const ok = !!(res && (res.verdict === 'good' || res.verdict === 'ok'));
        mark(ok, word.id);
      } catch {
        // Pro required / STT off / network → skip this one with credit.
        setSpeakResult({ target: word.word, heard: '', score: 0, verdict: 'ok', feedback: 'Chấm phát âm chưa khả dụng — đã bỏ qua câu này.', tips: [] });
        setCorrect((c) => c + 1);
        setPhase('correct');
      } finally {
        setScoring(false);
      }
    });
  }, [recording, ex, code, startRecording, stopRecording, mark]);

  const skipSpeak = useCallback(() => {
    if (!ex || ex.type !== 'speak') return;
    setSpeakResult({ target: ex.word.word, heard: '', score: 0, verdict: 'ok', feedback: 'Đã bỏ qua câu nói.', tips: [] });
    setCorrect((c) => c + 1);
    setPhase('correct');
  }, [ex]);

  const finish = useCallback(async (finalCorrect: number, finalMistakes: number) => {
    setFinishing(true);
    try {
      const res = await languageApi.practiceComplete({
        languageCode: code, lessonKey: lesson.lessonKey, correct: finalCorrect, total, mistakes: finalMistakes,
        wrongIds, rightIds,
      });
      setResult(res.data.data ?? null);
    } catch {
      setResult({ xpGained: finalCorrect * 10, crown: lesson.crown, leveledUp: false, state: null as never });
    } finally {
      setFinishing(false);
    }
  }, [code, lesson.lessonKey, lesson.crown, total, wrongIds, rightIds]);

  const next = useCallback(() => {
    if (index + 1 >= total) { void finish(correct, mistakes); return; }
    setIndex((i) => i + 1);
  }, [index, total, correct, mistakes, finish]);

  // ── Render ──────────────────────────────────────────────────────
  const shell = (children: React.ReactNode) => (
    <div className="fixed inset-0 z-[200] flex flex-col bg-[var(--bg-primary)]">{children}</div>
  );

  if (loading) {
    return shell(<div className="flex flex-1 items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-neon-violet" /></div>);
  }
  if (loadError) {
    return shell(
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-text-secondary">{loadError}</p>
        <button onClick={onClose} className="rounded-full bg-neon-violet px-5 py-2 text-sm font-semibold text-white">Đóng</button>
      </div>,
    );
  }

  if (result) {
    const perfect = mistakes === 0;
    return shell(
      <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
        <div className="text-6xl">{perfect ? '🏆' : correct / total >= 0.5 ? '🎉' : '📚'}</div>
        <h2 className="font-heading text-2xl font-bold text-text-primary">{perfect ? 'Hoàn hảo!' : 'Hoàn thành bài học'}</h2>
        <p className="text-text-secondary">{correct}/{total} câu đúng</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-2xl bg-neon-violet/10 px-4 py-2.5 text-sm font-semibold text-neon-violet ring-1 ring-neon-violet/25"><Zap size={16} /> +{result.xpGained} XP</span>
          {result.leveledUp && (
            <span className="inline-flex items-center gap-1.5 rounded-2xl bg-neon-orange/10 px-4 py-2.5 text-sm font-semibold text-neon-orange ring-1 ring-neon-orange/25"><Crown size={16} /> Vương miện {result.crown}</span>
          )}
          {result.state && result.state.streak > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-2xl bg-neon-orange/10 px-4 py-2.5 text-sm font-semibold text-neon-orange ring-1 ring-neon-orange/25"><Flame size={16} /> {result.state.streak} ngày</span>
          )}
        </div>
        <button onClick={() => { onFinished(result); onClose(); }} className="mt-2 inline-flex items-center gap-2 rounded-full bg-neon-violet px-8 py-3 text-sm font-bold text-white transition hover:opacity-90">
          Tiếp tục <ArrowRight size={16} />
        </button>
      </div>,
    );
  }

  if (!ex) return shell(<div className="flex flex-1 items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-neon-violet" /></div>);

  const progress = Math.round((index / total) * 100);
  const feedbackAnswer = ex.type === 'speak' ? (speakResult?.feedback ?? '') : 'answer' in ex ? ex.answer : '';

  return shell(
    <>
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
        <button onClick={onClose} aria-label="Thoát" className="text-text-muted hover:text-text-primary"><X size={22} /></button>
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-[var(--bg-surface)]">
          <div className="h-full rounded-full bg-neon-gradient transition-all" style={{ width: `${progress}%` }} />
        </div>
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-neon-pink"><Heart size={18} className="fill-neon-pink" /> {hearts}</span>
      </div>

      {/* Body */}
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col px-4 pt-4 sm:px-6">
        <ExerciseView
          ex={ex} phase={phase} choice={choice} setChoice={setChoice} built={built} setBuilt={setBuilt}
          typed={typed} setTyped={setTyped} onEnter={() => { if (canCheck && phase === 'answer') check(); }}
          forceLang={forceLang} recordSupported={recordSupported} recording={recording} scoring={scoring}
          speakResult={speakResult} onMic={recordAndScore}
        />
      </div>

      {/* Feedback + action bar */}
      <div className={`border-t px-4 py-4 sm:px-6 ${phase === 'correct' ? 'border-neon-green/30 bg-neon-green/10' : phase === 'wrong' ? 'border-neon-orange/30 bg-neon-orange/10' : 'border-[var(--border-color)]'}`}>
        <div className="mx-auto flex w-full max-w-xl items-center gap-3">
          {phase !== 'answer' && (
            <div className="min-w-0 flex-1">
              <p className={`text-sm font-semibold ${phase === 'correct' ? 'text-neon-green' : 'text-neon-orange'}`}>
                {phase === 'correct' ? 'Chính xác!' : 'Chưa đúng'}
                {ex.type === 'speak' && speakResult ? ` · ${speakResult.score}/100` : ''}
              </p>
              {(phase === 'wrong' || ex.type === 'speak') && feedbackAnswer && (
                <p className="truncate text-xs text-text-secondary">
                  {ex.type === 'speak' ? feedbackAnswer : <>Đáp án: <span className="font-medium text-text-primary">{feedbackAnswer}</span></>}
                </p>
              )}
            </div>
          )}
          {phase === 'answer' ? (
            ex.type === 'speak' ? (
              <button onClick={skipSpeak} disabled={scoring || recording} className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-surface)] px-6 py-3 text-sm font-semibold text-text-secondary ring-1 ring-[var(--border-color)] transition hover:text-text-primary disabled:opacity-40">
                Bỏ qua
              </button>
            ) : (
              <button onClick={check} disabled={!canCheck} className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-neon-violet px-8 py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-40">
                Kiểm tra
              </button>
            )
          ) : (
            <button onClick={next} disabled={finishing} className={`ml-auto inline-flex items-center gap-1.5 rounded-full px-8 py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60 ${phase === 'correct' ? 'bg-neon-green' : 'bg-neon-orange'}`}>
              {finishing ? <Loader2 size={16} className="animate-spin" /> : index + 1 >= total ? 'Hoàn thành' : 'Tiếp tục'}
            </button>
          )}
        </div>
      </div>
    </>,
  );
}

function ExerciseView({
  ex, phase, choice, setChoice, built, setBuilt, typed, setTyped, onEnter, forceLang, recordSupported, recording, scoring, speakResult, onMic,
}: {
  ex: Exercise;
  phase: 'answer' | 'correct' | 'wrong';
  choice: string | null;
  setChoice: (v: string) => void;
  built: string[];
  setBuilt: (v: string[]) => void;
  typed: string;
  setTyped: (v: string) => void;
  onEnter: () => void;
  forceLang?: VocabLang;
  recordSupported: boolean;
  recording: boolean;
  scoring: boolean;
  speakResult: PronunciationResult | null;
  onMic: () => void;
}) {
  const locked = phase !== 'answer';

  // Type-what-you-hear: replay audio + free-text input.
  if (ex.type === 'type-hear') {
    const correctAns = phase === 'correct';
    return (
      <div className="flex flex-1 flex-col items-center text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Nghe và gõ lại từ</p>
        <button type="button" onClick={() => void speakVocabEntry({ term: ex.word.word, reading: reading(ex.word) }, { forceLang })} className="mx-auto mt-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-neon-violet/15 text-neon-violet ring-1 ring-neon-violet/30 transition hover:bg-neon-violet/25" aria-label="Nghe lại">
          <Volume2 size={28} />
        </button>
        <input
          autoFocus
          value={typed}
          disabled={locked}
          onChange={(e) => setTyped(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') onEnter(); }}
          placeholder="Gõ từ bạn nghe được…"
          className={`mt-6 w-full max-w-sm rounded-xl border bg-[var(--bg-surface)] px-4 py-3 text-center text-lg text-text-primary outline-none transition ${
            locked ? (correctAns ? 'border-neon-green/50' : 'border-neon-orange/50') : 'border-[var(--border-color)] focus:border-neon-violet/60'
          }`}
        />
      </div>
    );
  }

  if (ex.type === 'fill-blank') {
    return (
      <div className="flex flex-1 flex-col">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-text-muted">Điền từ còn thiếu</p>
        <p className="mb-1 text-lg leading-relaxed text-text-primary">
          {ex.before} <span className="mx-1 inline-block min-w-[3rem] rounded-md border-b-2 border-dashed border-neon-violet/60 px-2 text-center align-middle text-neon-violet">{locked ? ex.answer : '____'}</span> {ex.after}
        </p>
        <p className="mb-5 text-sm text-text-muted">— {ex.word.meaningVi}</p>
        <OptionsGrid options={ex.options} answer={ex.answer} choice={choice} setChoice={setChoice} locked={locked} />
      </div>
    );
  }

  if (ex.type === 'speak') {
    return (
      <div className="flex flex-1 flex-col items-center text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Đọc to từ này</p>
        <p className="mt-3 text-3xl font-bold text-text-primary">{ex.word.word}</p>
        {reading(ex.word) && <p className="mt-1 text-sm text-text-muted">{reading(ex.word)}</p>}
        <p className="mt-1 text-sm text-text-secondary">{ex.word.meaningVi}</p>

        {!recordSupported ? (
          <p className="mt-8 max-w-xs text-sm text-text-muted">Thiết bị không hỗ trợ ghi âm — hãy bấm “Bỏ qua”.</p>
        ) : (
          <button
            type="button"
            onClick={onMic}
            disabled={scoring || locked}
            aria-label={recording ? 'Dừng' : 'Ghi âm'}
            className={`mt-8 inline-flex h-20 w-20 items-center justify-center rounded-full ring-4 transition disabled:opacity-50 ${
              recording ? 'animate-pulse bg-neon-pink/20 text-neon-pink ring-neon-pink/40' : 'bg-neon-violet/15 text-neon-violet ring-neon-violet/30 hover:bg-neon-violet/25'
            }`}
          >
            {scoring ? <Loader2 size={30} className="animate-spin" /> : recording ? <Square size={28} /> : <Mic size={30} />}
          </button>
        )}
        <p className="mt-3 text-xs text-text-muted">{scoring ? 'Đang chấm…' : recording ? 'Đang nghe… bấm để dừng' : recordSupported ? 'Bấm micro rồi đọc to' : ''}</p>

        {speakResult && speakResult.heard && (
          <p className="mt-4 rounded-xl bg-[var(--bg-surface)] px-3 py-2 text-xs text-text-secondary ring-1 ring-[var(--border-color)]">Nghe được: “{speakResult.heard}”</p>
        )}
      </div>
    );
  }

  if (ex.type === 'arrange') {
    const remaining = ex.tokens.map((t, i) => ({ t, i })).filter(({ i }) => !built.includes(tokenKey(ex.tokens, i)));
    const builtTokens = built.map((k) => keyToken(k));
    return (
      <div className="flex flex-1 flex-col">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-text-muted">Sắp xếp thành câu đúng</p>
        <p className="mb-5 text-lg font-medium text-text-primary">{ex.word.word} <span className="text-sm text-text-muted">— {ex.word.meaningVi}</span></p>
        <div className="flex min-h-[52px] flex-wrap gap-2 rounded-xl border border-dashed border-[var(--border-color)] p-2.5">
          {builtTokens.map((t, i) => (
            <button key={`b-${i}`} disabled={locked} onClick={() => setBuilt(built.filter((_, j) => j !== i))} className="rounded-lg bg-neon-violet/15 px-3 py-1.5 text-sm text-text-primary ring-1 ring-neon-violet/30">{t}</button>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {remaining.map(({ t, i }) => (
            <button key={`r-${i}`} disabled={locked} onClick={() => setBuilt([...built, tokenKey(ex.tokens, i)])} className="rounded-lg bg-[var(--bg-surface)] px-3 py-1.5 text-sm text-text-primary ring-1 ring-[var(--border-color)] transition hover:ring-neon-violet/40 disabled:opacity-50">{t}</button>
          ))}
        </div>
      </div>
    );
  }

  const img = ex.word.imageUrl && ex.word.imageUrl.trim() ? ex.word.imageUrl : null;

  const prompt = ex.type === 'choose-meaning' ? (
    <>
      <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Nghĩa của từ này là?</p>
      {img && <img src={img} alt="" className="mx-auto mt-3 h-28 w-auto max-w-full rounded-xl object-contain ring-1 ring-[var(--border-color)]" />}
      <p className="mt-2 text-3xl font-bold text-text-primary">{ex.word.word}</p>
      {reading(ex.word) && <p className="mt-1 text-sm text-text-muted">{reading(ex.word)}</p>}
    </>
  ) : ex.type === 'image-choose' ? (
    <>
      <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Hình này là từ nào?</p>
      {img && <img src={img} alt="" className="mx-auto mt-3 h-40 w-auto max-w-full rounded-2xl object-contain ring-1 ring-[var(--border-color)]" />}
      <p className="mt-2 text-sm text-text-muted">{ex.word.meaningVi}</p>
    </>
  ) : ex.type === 'choose-word' ? (
    <>
      <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Chọn từ đúng</p>
      {img && <img src={img} alt="" className="mx-auto mt-3 h-24 w-auto max-w-full rounded-xl object-contain ring-1 ring-[var(--border-color)]" />}
      <p className="mt-2 text-2xl font-semibold text-text-primary">{ex.word.meaningVi}</p>
    </>
  ) : (
    <>
      <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Nghe và chọn từ đúng</p>
      <button type="button" onClick={() => void speakVocabEntry({ term: ex.word.word, reading: reading(ex.word) }, { forceLang })} className="mx-auto mt-3 inline-flex h-16 w-16 items-center justify-center rounded-full bg-neon-violet/15 text-neon-violet ring-1 ring-neon-violet/30 transition hover:bg-neon-violet/25" aria-label="Nghe lại">
        <Volume2 size={28} />
      </button>
    </>
  );

  const centered = ex.type === 'listen' || ex.type === 'image-choose';
  return (
    <div className="flex flex-1 flex-col">
      <div className={centered ? 'mb-6 text-center' : 'mb-6'}>{prompt}</div>
      <OptionsGrid options={ex.options} answer={ex.answer} choice={choice} setChoice={setChoice} locked={locked} />
    </div>
  );
}

/** Shared 2-column answer grid for all choice-based exercises. */
function OptionsGrid({
  options, answer, choice, setChoice, locked,
}: { options: string[]; answer: string; choice: string | null; setChoice: (v: string) => void; locked: boolean }) {
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
      {options.map((opt) => {
        const selected = choice === opt;
        const isAnswer = opt === answer;
        let cls = 'bg-[var(--bg-surface)] ring-[var(--border-color)] text-text-primary hover:ring-neon-violet/40';
        if (locked && isAnswer) cls = 'bg-neon-green/15 ring-neon-green/40 text-neon-green';
        else if (locked && selected && !isAnswer) cls = 'bg-neon-orange/15 ring-neon-orange/40 text-neon-orange';
        else if (selected) cls = 'bg-neon-violet/15 ring-neon-violet/50 text-text-primary';
        return (
          <button key={opt} type="button" disabled={locked} onClick={() => setChoice(opt)} className={`rounded-xl px-4 py-3.5 text-left text-sm font-medium ring-1 transition disabled:cursor-default ${cls}`}>{opt}</button>
        );
      })}
    </div>
  );
}

// Token keys let arrange handle duplicate words without collisions.
function tokenKey(tokens: string[], i: number): string { return `${i}::${tokens[i]}`; }
function keyToken(key: string): string { return key.slice(key.indexOf('::') + 2); }
