'use client';
/**
 * My Language — Alphabet (Bảng chữ cái) section page.
 * Group tabs (Chip row) → responsive character grid of flip-cards.
 * Front: big character (+ romanization unless "Ẩn phiên âm" self-test).
 * Back: romanization + note + optional image.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Type, Eye, EyeOff, Dumbbell } from 'lucide-react';
import { languageApi } from '@/lib/language-api';
import { getImageUrl } from '@/lib/utils';
import type { AlphabetGroup, AlphabetItem } from '@/types/language';
import {
  SectionShell,
  SpeakerButton,
  Chip,
  EmptyState,
  CardsSkeleton,
  usePrefersReducedMotion,
} from '@/components/language/primitives';

export default function AlphabetPage() {
  const code = String(useParams().code);
  const reduced = usePrefersReducedMotion();

  const [groups, setGroups] = useState<AlphabetGroup[] | null>(null);
  const [activeGroupId, setActiveGroupId] = useState<number | null>(null);
  const [flipped, setFlipped] = useState<Set<number>>(new Set());
  const [hideRomanization, setHideRomanization] = useState(false);
  const [flipAll, setFlipAll] = useState(false);

  useEffect(() => {
    let alive = true;
    languageApi
      .alphabet(code)
      .then((res) => {
        if (!alive) return;
        const data = res.data.data ?? [];
        setGroups(data);
        setActiveGroupId(data[0]?.id ?? null);
      })
      .catch(() => {
        if (alive) setGroups([]);
      });
    return () => {
      alive = false;
    };
  }, [code]);

  const activeGroup = useMemo(
    () => groups?.find((g) => g.id === activeGroupId) ?? null,
    [groups, activeGroupId],
  );

  const toggleFlip = useCallback((id: number) => {
    setFlipped((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const isFaceUp = useCallback((id: number) => flipAll !== flipped.has(id), [flipAll, flipped]);

  const toolbar = (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href={`/language/${code}/alphabet/practice`}
        className="inline-flex items-center gap-1.5 rounded-full bg-neon-gradient px-3.5 py-1.5 text-sm font-semibold text-white shadow-neon transition hover:opacity-95"
      >
        <Dumbbell size={16} /> Luyện tập
      </Link>
      <button
        type="button"
        onClick={() => setHideRomanization((v) => !v)}
        aria-pressed={hideRomanization}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ring-1 transition ${
          hideRomanization
            ? 'bg-neon-violet/20 text-neon-violet ring-neon-violet/40'
            : 'bg-[var(--bg-surface)] text-text-secondary ring-[var(--border-color)] hover:text-text-primary'
        }`}
      >
        {hideRomanization ? <EyeOff size={16} /> : <Eye size={16} />}
        Ẩn phiên âm
      </button>
      <button
        type="button"
        onClick={() => setFlipAll((v) => !v)}
        aria-pressed={flipAll}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ring-1 transition ${
          flipAll
            ? 'bg-neon-cyan/20 text-neon-cyan ring-neon-cyan/40'
            : 'bg-[var(--bg-surface)] text-text-secondary ring-[var(--border-color)] hover:text-text-primary'
        }`}
      >
        Lật tất cả
      </button>
    </div>
  );

  return (
    <SectionShell code={code} title="Bảng chữ cái" icon={<Type />} right={toolbar}>
      {groups === null ? (
        <CardsSkeleton count={8} />
      ) : groups.length === 0 ? (
        <EmptyState
          emoji="🔤"
          title="Chưa có chữ cái"
          hint="Nội dung bảng chữ cái cho ngôn ngữ này sẽ sớm được thêm."
        />
      ) : (
        <>
          {groups.length > 1 && (
            <div role="tablist" aria-label="Nhóm chữ cái" className="mb-5 flex flex-wrap gap-2">
              {groups.map((g) => (
                <Chip key={g.id} active={g.id === activeGroupId} onClick={() => setActiveGroupId(g.id)}>
                  {g.name}
                </Chip>
              ))}
            </div>
          )}

          {activeGroup?.description && (
            <p className="mb-4 text-sm text-text-muted">{activeGroup.description}</p>
          )}

          {!activeGroup || activeGroup.items.length === 0 ? (
            <EmptyState emoji="🌱" title="Nhóm này chưa có chữ" />
          ) : (
            <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-6 sm:gap-3 lg:grid-cols-8">
              {activeGroup.items.map((item) => (
                <CharacterCard
                  key={item.id}
                  item={item}
                  faceUp={isFaceUp(item.id)}
                  onFlip={() => toggleFlip(item.id)}
                  hideRomanization={hideRomanization}
                  reduced={reduced}
                />
              ))}
            </div>
          )}
        </>
      )}
    </SectionShell>
  );
}

function CharacterCard({
  item,
  faceUp,
  onFlip,
  hideRomanization,
  reduced,
}: {
  item: AlphabetItem;
  faceUp: boolean;
  onFlip: () => void;
  hideRomanization: boolean;
  reduced: boolean;
}) {
  const img = item.imageUrl ? getImageUrl(item.imageUrl) : null;
  const duration = reduced ? 0 : 0.28;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={!faceUp}
      aria-label={`Chữ ${item.character}`}
      onClick={onFlip}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onFlip();
        }
      }}
      className="group relative aspect-square cursor-pointer select-none rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-violet/50"
      style={{ perspective: 800 }}
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: faceUp ? 0 : 180 }}
        transition={reduced ? { duration: 0 } : { duration, ease: 'easeInOut' }}
      >
        {/* Front */}
        <div
          className="card absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-2xl p-1.5"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="font-heading text-2xl font-bold leading-none text-text-primary sm:text-3xl">
            {item.character}
          </span>
          {!hideRomanization && item.romanization && (
            <span className="text-[11px] text-text-muted">{item.romanization}</span>
          )}
          <div className="absolute right-0.5 top-0.5">
            <SpeakerButton text={item.character} audioUrl={item.audioUrl} size={15} className="h-7 w-7" />
          </div>
        </div>

        {/* Back */}
        <div
          className="card absolute inset-0 flex flex-col items-center justify-center gap-1 overflow-hidden rounded-2xl border border-neon-violet/40 bg-[var(--bg-surface)] p-1.5 text-center"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          {img && (
            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg">
              <Image src={img} alt={item.character} fill sizes="48px" className="object-cover" />
            </div>
          )}
          <span className="text-sm font-semibold text-neon-cyan">{item.romanization ?? item.character}</span>
          {item.note && (
            <span className="line-clamp-3 text-[10px] leading-tight text-text-muted">{item.note}</span>
          )}
          <div className="absolute right-0.5 top-0.5">
            <SpeakerButton text={item.character} audioUrl={item.audioUrl} size={15} className="h-7 w-7" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
