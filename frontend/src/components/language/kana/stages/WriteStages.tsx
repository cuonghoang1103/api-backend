'use client';
/**
 * Stages 4–7: Write the answer, Write a word, Write text, Listen.
 * All four share a typed-romaji input; Listen adds a TTS playback button.
 */
import { useCallback, useEffect, useState } from 'react';
import { Volume2, Loader2, ArrowRight } from 'lucide-react';
import { speakVocabEntry } from '@/lib/notesTts';
import { normalizeRomaji, type KanaItem, type StageProps } from '../types';
import { AnswerBar } from './common';

function expectedRomaji(word: KanaItem[]): string {
  return word.map((w) => w.romaji).join('');
}

// ─── Shared typed-answer form ────────────────────────────────────
function TypedAnswer({
  answerKey,
  solution,
  placeholder,
  onResult,
  onNext,
  reduced,
  autoFocus = true,
}: {
  answerKey: string; // normalized expected value
  solution: string; // human-readable correct answer to reveal
  placeholder: string;
  onResult: (correct: boolean) => void;
  onNext: () => void;
  reduced: boolean;
  autoFocus?: boolean;
}) {
  const [value, setValue] = useState('');
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);

  const submit = () => {
    if (result !== null || !value.trim()) return;
    const ok = normalizeRomaji(value) === answerKey;
    setResult(ok ? 'correct' : 'wrong');
    onResult(ok);
  };

  return (
    <div className="mt-4">
      <div className="flex items-stretch gap-2">
        <input
          type="text"
          inputMode="text"
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          autoFocus={autoFocus}
          value={value}
          disabled={result !== null}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              submit();
            }
          }}
          placeholder={placeholder}
          className={`min-w-0 flex-1 rounded-xl border bg-[var(--bg-surface)] px-4 py-3 text-lg text-text-primary outline-none transition placeholder:text-text-muted focus:border-neon-violet/60 ${
            result === 'correct'
              ? 'border-neon-green/60'
              : result === 'wrong'
                ? 'border-neon-red/60'
                : 'border-[var(--border-color)]'
          }`}
        />
        {result === null && (
          <button
            type="button"
            onClick={submit}
            disabled={!value.trim()}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-neon-violet px-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-40"
          >
            Kiểm tra
            <ArrowRight size={16} />
          </button>
        )}
      </div>
      {result !== null && (
        <AnswerBar status={result} solution={solution} onNext={onNext} reduced={reduced} />
      )}
    </div>
  );
}

// ─── Stage 4: Write the answer ───────────────────────────────────
export function WriteAnswerStage({ target, onResult, onNext, reduced }: StageProps) {
  return (
    <div>
      <div className="flex flex-col items-center rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] px-4 py-8 text-center">
        <div className="font-heading text-6xl font-bold leading-none text-text-primary sm:text-7xl">
          {target.kana}
        </div>
        <p className="mt-3 text-sm text-text-muted">Gõ romaji của kana này</p>
      </div>
      <TypedAnswer
        answerKey={normalizeRomaji(target.romaji)}
        solution={target.romaji}
        placeholder="Ví dụ: ka"
        onResult={onResult}
        onNext={onNext}
        reduced={reduced}
      />
    </div>
  );
}

// ─── Stages 5 & 6: Write a word / Write text ─────────────────────
function WordStage({ word, onResult, onNext, reduced, hint }: StageProps & { hint: string }) {
  const kana = word.map((w) => w.kana).join('');
  const solution = word.map((w) => w.romaji).join('');
  return (
    <div>
      <div className="flex flex-col items-center rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] px-4 py-7 text-center">
        <div className="font-heading text-4xl font-bold leading-none tracking-wide text-text-primary sm:text-5xl">
          {kana}
        </div>
        <p className="mt-3 text-sm text-text-muted">{hint}</p>
      </div>
      <TypedAnswer
        answerKey={normalizeRomaji(expectedRomaji(word))}
        solution={solution}
        placeholder="Gõ romaji (có thể cách chữ)"
        onResult={onResult}
        onNext={onNext}
        reduced={reduced}
      />
    </div>
  );
}

export function WriteWordStage(props: StageProps) {
  return <WordStage {...props} hint="Gõ romaji của cả chuỗi kana" />;
}

export function WriteTextStage(props: StageProps) {
  return <WordStage {...props} hint="Gõ romaji cả đoạn — có thể cách giữa các âm" />;
}

// ─── Stage 7: Listen ─────────────────────────────────────────────
export function ListenStage({ target, onResult, onNext, reduced }: StageProps) {
  const [busy, setBusy] = useState(false);
  const [missingVoice, setMissingVoice] = useState(false);

  const play = useCallback(async () => {
    setBusy(true);
    try {
      const res = await speakVocabEntry({ term: target.kana }, { forceLang: 'ja-JP' });
      setMissingVoice(!res.ok && res.missingVoice);
    } finally {
      setBusy(false);
    }
  }, [target.kana]);

  useEffect(() => {
    // Auto-play once when the question appears.
    void play();
  }, [play]);

  return (
    <div>
      <div className="flex flex-col items-center rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] px-4 py-8 text-center">
        <button
          type="button"
          onClick={() => void play()}
          className="inline-flex items-center gap-2 rounded-2xl bg-neon-violet/15 px-6 py-4 text-lg font-semibold text-neon-violet ring-1 ring-neon-violet/40 transition hover:bg-neon-violet/25 focus:outline-none focus-visible:ring-2"
        >
          {busy ? <Loader2 size={22} className="animate-spin" /> : <Volume2 size={22} />}
          Nghe
        </button>
        <p className="mt-3 text-sm text-text-muted">Nghe rồi gõ romaji bạn nghe được</p>
        {missingVoice && (
          <p className="mt-2 max-w-xs text-xs text-neon-orange">
            Trình duyệt chưa cài giọng tiếng Nhật — hãy cài gói giọng ja-JP để nghe được kana.
          </p>
        )}
      </div>
      <TypedAnswer
        answerKey={normalizeRomaji(target.romaji)}
        solution={target.romaji}
        placeholder="Gõ romaji"
        onResult={onResult}
        onNext={onNext}
        reduced={reduced}
      />
    </div>
  );
}
