'use client';
/**
 * Word of the Day — deterministic-by-date vocab highlight.
 * Reusable widget (also intended to be droppable on the main dashboard).
 * Picks the same word for everyone on a given day (index = day-of-year %
 * count) so it's stable without server state. Links into /language.
 */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { languageApi } from '@/lib/language-api';
import type { VocabWord } from '@/types/language';
import { SpeakerButton } from './primitives';

function dayOfYear(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - start.getTime();
  return Math.floor(diff / 86_400_000);
}

export default function WordOfTheDay({ languageCode = 'en' }: { languageCode?: string }) {
  const [word, setWord] = useState<VocabWord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    // Pull a stable window of words, then pick deterministically by date.
    languageApi
      .vocab(languageCode, { limit: 100, page: 1 })
      .then((res) => {
        const words = res.data.data ?? [];
        if (!alive || words.length === 0) return;
        const idx = dayOfYear(new Date()) % words.length;
        setWord(words[idx]);
      })
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [languageCode]);

  if (loading || !word) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="card relative overflow-hidden p-5">
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-neon-violet/10 blur-2xl" aria-hidden />
        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-neon-violet/15 px-2.5 py-1 text-[11px] font-semibold text-neon-violet">
          <Sparkles size={12} /> Từ của ngày
        </div>
        <div className="flex items-center gap-2">
          <h3 className="font-heading text-2xl font-bold text-text-primary">{word.word}</h3>
          <SpeakerButton text={word.word} reading={word.pronunciations?.[0]?.value} audioUrl={word.audioUrl} />
        </div>
        {word.pronunciations?.length > 0 && (
          <p className="mt-0.5 text-sm text-neon-cyan">
            {word.pronunciations.map((p) => p.value).join(' · ')}
          </p>
        )}
        <p className="mt-1 text-text-secondary">{word.meaningVi}</p>
        {word.exampleSentence && (
          <p className="mt-2 border-l-2 border-neon-violet/40 pl-3 text-sm italic text-text-muted">
            {word.exampleSentence}
          </p>
        )}
        <Link
          href={`/language/${languageCode}/vocab`}
          className="mt-3 inline-block text-sm font-medium text-neon-violet hover:underline"
        >
          Học thêm từ vựng →
        </Link>
      </div>
    </motion.div>
  );
}
