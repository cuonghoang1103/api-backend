'use client';
/**
 * My Language — Q&A section page.
 *  • Accordion mode: tap a question → answer expands with pronunciation,
 *    meaning (VI) and a speaker button.
 *  • Random mode ("Câu hỏi ngẫu nhiên"): reflex training — a full card shows
 *    one random question; reveal answer; shuffle to the next.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { HelpCircle, ChevronDown, Shuffle } from 'lucide-react';
import { fetchAllPages, languageApi } from '@/lib/language-api';
import type { QnaItem } from '@/types/language';
import {
  SectionShell,
  SpeakerButton,
  EmptyState,
  CardsSkeleton,
  usePrefersReducedMotion,
} from '@/components/language/primitives';

export default function QnaPage() {
  const code = String(useParams().code);
  const reduced = usePrefersReducedMotion();

  const [items, setItems] = useState<QnaItem[] | null>(null);
  const [randomMode, setRandomMode] = useState(false);

  useEffect(() => {
    let alive = true;
    fetchAllPages(async ({ page, limit }) => {
      const res = await languageApi.qna(code, { page, limit });
      return res.data.data ?? [];
    })
      .then((all) => {
        if (alive) setItems(all);
      })
      .catch(() => {
        if (alive) setItems([]);
      });
    return () => {
      alive = false;
    };
  }, [code]);

  const toggle = (
    <button
      type="button"
      onClick={() => setRandomMode((v) => !v)}
      aria-pressed={randomMode}
      disabled={!items || items.length === 0}
      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium ring-1 transition disabled:cursor-not-allowed disabled:opacity-50 ${
        randomMode
          ? 'bg-neon-orange/20 text-neon-orange ring-neon-orange/40'
          : 'bg-[var(--bg-surface)] text-text-secondary ring-[var(--border-color)] hover:text-text-primary'
      }`}
    >
      <Shuffle size={16} />
      Câu hỏi ngẫu nhiên
    </button>
  );

  return (
    <SectionShell code={code} title="Q&A" icon={<HelpCircle />} right={toggle}>
      {items === null ? (
        <CardsSkeleton count={5} />
      ) : items.length === 0 ? (
        <EmptyState
          emoji="💬"
          title="Chưa có câu hỏi"
          hint="Nội dung Q&A cho ngôn ngữ này sẽ sớm được thêm."
        />
      ) : randomMode ? (
        <RandomMode items={items} reduced={reduced} />
      ) : (
        <Accordion items={items} reduced={reduced} />
      )}
    </SectionShell>
  );
}

// ─── Accordion mode ───────────────────────────────────────────────
function Accordion({ items, reduced }: { items: QnaItem[]; reduced: boolean }) {
  const [openId, setOpenId] = useState<number | null>(null);
  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <li key={item.id} className="card overflow-hidden rounded-2xl">
            <button
              type="button"
              onClick={() => setOpenId(open ? null : item.id)}
              aria-expanded={open}
              className="flex w-full items-center gap-3 p-4 text-left transition hover:bg-[var(--bg-surface)]"
            >
              <span className="min-w-0 flex-1 break-words font-medium text-text-primary">{item.question}</span>
              <motion.span
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: reduced ? 0 : 0.2, ease: 'easeOut' }}
                className="shrink-0 text-text-muted"
              >
                <ChevronDown size={18} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  key="body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0, transition: { duration: reduced ? 0 : 0.2, ease: 'easeOut' } }}
                  transition={{ duration: reduced ? 0 : 0.24, ease: 'easeOut' }}
                  style={{ overflow: 'hidden', pointerEvents: 'auto' }}
                >
                  <AnswerBody item={item} />
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}

function AnswerBody({ item }: { item: QnaItem }) {
  return (
    <div className="border-t border-[var(--border-color)] px-4 pb-4 pt-3">
      <div className="flex items-start gap-2">
        <p className="min-w-0 flex-1 break-words text-lg font-semibold text-neon-violet">{item.answer}</p>
        <SpeakerButton text={item.answer} audioUrl={item.audioUrl} rate={0.85} />
      </div>
      {item.pronunciation && <p className="mt-1 text-sm text-text-muted">{item.pronunciation}</p>}
      {item.meaningVi && <p className="mt-2 text-text-secondary">{item.meaningVi}</p>}
    </div>
  );
}

// ─── Random / reflex mode ─────────────────────────────────────────
function RandomMode({ items, reduced }: { items: QnaItem[]; reduced: boolean }) {
  const pickRandom = useCallback(
    (excludeId?: number) => {
      if (items.length === 1) return 0;
      let idx = Math.floor(Math.random() * items.length);
      if (excludeId !== undefined) {
        let guard = 0;
        while (items[idx].id === excludeId && guard < 20) {
          idx = Math.floor(Math.random() * items.length);
          guard += 1;
        }
      }
      return idx;
    },
    [items],
  );

  const [index, setIndex] = useState<number>(() => Math.floor(Math.random() * items.length));
  const [revealed, setRevealed] = useState(false);

  const current = items[index];
  const dur = reduced ? 0 : 0.24;

  const next = useCallback(() => {
    setRevealed(false);
    setIndex((prev) => pickRandom(items[prev]?.id));
  }, [pickRandom, items]);

  const answered = useMemo(() => revealed, [revealed]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-xl" style={{ minHeight: 320 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${current.id}-${revealed ? 'a' : 'q'}`}
            initial={{ opacity: 0, y: reduced ? 0 : 24, rotate: reduced ? 0 : -1 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, y: reduced ? 0 : -24, rotate: reduced ? 0 : 1, transition: { duration: dur, ease: 'easeOut' } }}
            transition={{ duration: dur, ease: 'easeOut' }}
            style={{ pointerEvents: 'auto' }}
            className="card flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-3xl p-6 text-center"
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-neon-orange">Câu hỏi</span>
            <p className="max-w-full break-words text-xl font-bold text-text-primary sm:text-2xl">{current.question}</p>

            {answered && (
              <div className="mt-2 w-full border-t border-[var(--border-color)] pt-4">
                <div className="flex items-center justify-center gap-2">
                  <p className="max-w-full break-words text-lg font-semibold text-neon-violet sm:text-xl">{current.answer}</p>
                  <SpeakerButton text={current.answer} audioUrl={current.audioUrl} rate={0.85} />
                </div>
                {current.pronunciation && (
                  <p className="mt-1 text-sm text-text-muted">{current.pronunciation}</p>
                )}
                {current.meaningVi && <p className="mt-2 text-text-secondary">{current.meaningVi}</p>}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center gap-3">
        {!revealed ? (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="rounded-full bg-neon-violet/20 px-5 py-2.5 font-medium text-neon-violet ring-1 ring-neon-violet/40 transition hover:bg-neon-violet/30"
          >
            Hiện đáp án
          </button>
        ) : (
          <button
            type="button"
            onClick={next}
            className="inline-flex items-center gap-2 rounded-full bg-neon-orange/20 px-5 py-2.5 font-medium text-neon-orange ring-1 ring-neon-orange/40 transition hover:bg-neon-orange/30"
          >
            <Shuffle size={17} />
            Câu tiếp theo
          </button>
        )}
      </div>
    </div>
  );
}
