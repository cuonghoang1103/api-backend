'use client';
/**
 * My Language — Grammar (Ngữ pháp) section page.
 * Level Chip filter (re-fetch on change) → accordion of grammar points.
 * Each row always shows title + mono structure formula; expanding reveals
 * explanation (HTML), examples, and optional mistake / comparison callouts.
 */
import { Suspense, useCallback, useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { GraduationCap, ChevronDown, AlertTriangle, GitCompare, Check } from 'lucide-react';
import { toast } from 'sonner';
import { fetchAllPages, languageApi } from '@/lib/language-api';
import type { GrammarPoint } from '@/types/language';
import { usePro } from '@/hooks/usePro';
import { AiExplainButton, AiExplainModal } from '@/components/language/AiExplainModal';
import {
  SectionShell,
  SpeakerButton,
  Chip,
  EmptyState,
  CardsSkeleton,
  useLangUser,
  usePrefersReducedMotion,
} from '@/components/language/primitives';

const ALL = '__all__';

// Suspense wrapper needed for useSearchParams (deep-link ?level= from roadmap).
export default function GrammarPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-5xl px-3 py-8"><CardsSkeleton /></div>}>
      <GrammarInner />
    </Suspense>
  );
}

function GrammarInner() {
  const code = String(useParams().code);
  const router = useRouter();
  const reduced = usePrefersReducedMotion();
  const { isAuthenticated } = useLangUser();
  const { isPro } = usePro();

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<GrammarPoint[]>([]);
  const [levels, setLevels] = useState<string[]>([]);
  const searchParams = useSearchParams();
  const [level, setLevel] = useState<string>(() => searchParams.get('level') || ALL);
  const [openId, setOpenId] = useState<number | null>(null);
  const [learned, setLearned] = useState<Set<number>>(new Set());
  const [aiPoint, setAiPoint] = useState<GrammarPoint | null>(null);

  // Pro-gated AI tutor: guests/non-Pro are sent to /pro; Pro opens the modal.
  const openAi = useCallback(
    (point: GrammarPoint) => {
      if (!isPro) { router.push('/pro'); return; }
      setAiPoint(point);
    },
    [isPro, router],
  );

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchAllPages(async ({ page, limit }) => {
      const res = await languageApi.grammar(code, {
        ...(level === ALL ? {} : { level }),
        page,
        limit,
      });
      // Only replace the level set from the unfiltered ("Tất cả") view so
      // filtering never shrinks the available chips.
      if (alive && page === 1 && level === ALL) setLevels(res.data.data?.levels ?? []);
      return res.data.data?.items ?? [];
    })
      .then((all) => {
        if (alive) setItems(all);
      })
      .catch(() => {
        if (alive) setItems([]);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [code, level]);

  const markLearned = useCallback(async (point: GrammarPoint) => {
    try {
      await languageApi.recordProgress({ itemType: 'GRAMMAR', itemId: point.id, status: 'MASTERED' });
      setLearned((prev) => new Set(prev).add(point.id));
      toast.success('Đã đánh dấu là đã học');
    } catch {
      toast.error('Không thể lưu tiến độ, thử lại sau');
    }
  }, []);

  return (
    <SectionShell code={code} title="Ngữ pháp" icon={<GraduationCap />}>
      {levels.length > 0 && (
        <div role="tablist" aria-label="Cấp độ" className="mb-5 flex flex-wrap gap-2">
          <Chip active={level === ALL} onClick={() => setLevel(ALL)}>
            Tất cả
          </Chip>
          {levels.map((lv) => (
            <Chip key={lv} active={level === lv} onClick={() => setLevel(lv)}>
              {lv}
            </Chip>
          ))}
        </div>
      )}

      {loading ? (
        <CardsSkeleton count={5} />
      ) : items.length === 0 ? (
        <EmptyState
          emoji="📘"
          title="Chưa có ngữ pháp"
          hint="Điểm ngữ pháp cho cấp độ này sẽ sớm được thêm."
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((point) => (
            <GrammarRow
              key={point.id}
              point={point}
              open={openId === point.id}
              onToggle={() => setOpenId((cur) => (cur === point.id ? null : point.id))}
              reduced={reduced}
              canLearn={isAuthenticated}
              learned={learned.has(point.id)}
              onLearn={() => markLearned(point)}
              isPro={isPro}
              onExplain={() => openAi(point)}
            />
          ))}
        </ul>
      )}

      {aiPoint && (
        <AiExplainModal
          kind="grammar"
          itemId={aiPoint.id}
          languageCode={code}
          title={aiPoint.title}
          onClose={() => setAiPoint(null)}
        />
      )}
    </SectionShell>
  );
}

function GrammarRow({
  point,
  open,
  onToggle,
  reduced,
  canLearn,
  learned,
  onLearn,
  isPro,
  onExplain,
}: {
  point: GrammarPoint;
  open: boolean;
  onToggle: () => void;
  reduced: boolean;
  canLearn: boolean;
  learned: boolean;
  onLearn: () => void;
  isPro: boolean;
  onExplain: () => void;
}) {
  const panelId = `grammar-panel-${point.id}`;
  const headerId = `grammar-header-${point.id}`;
  const examples = point.examples ?? [];

  return (
    <li className="card overflow-hidden rounded-2xl">
      <button
        type="button"
        id={headerId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-violet/50"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-heading text-base font-semibold text-text-primary">{point.title}</span>
            {point.level && (
              <span className="rounded-full bg-neon-violet/15 px-2 py-0.5 text-[11px] font-medium text-neon-violet ring-1 ring-neon-violet/30">
                {point.level}
              </span>
            )}
          </div>
          {/* A grammar structure IS the lesson — clipping it to one line hides
              the half that matters ("Vます → Vたい" becomes "Vます → V…"). */}
          <p className="mt-1 break-words font-mono text-sm text-neon-cyan">{point.structure}</p>
        </div>
        <motion.span
          aria-hidden
          animate={{ rotate: open ? 180 : 0 }}
          transition={reduced ? { duration: 0 } : { duration: 0.2 }}
          className="shrink-0 text-text-muted"
        >
          <ChevronDown size={20} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="panel"
            id={panelId}
            role="region"
            aria-labelledby={headerId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0, pointerEvents: 'none' }}
            transition={reduced ? { duration: 0 } : { duration: 0.26, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="space-y-4 border-t border-[var(--border-color)] px-4 py-4">
              {point.explanation && (
                <div
                  className="note-prose lang-prose max-w-full break-words text-sm leading-relaxed text-text-secondary"
                  dangerouslySetInnerHTML={{ __html: point.explanation }}
                />
              )}

              {examples.length > 0 && (
                <div className="space-y-2.5">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted">Ví dụ</h3>
                  <ul className="space-y-2.5">
                    {examples.map((ex, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 rounded-xl bg-[var(--bg-surface)] p-3 ring-1 ring-[var(--border-color)]"
                      >
                        <div className="mt-0.5 shrink-0">
                          <SpeakerButton text={ex.sentence} size={16} className="h-7 w-7" rate={0.85} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-text-primary">{ex.sentence}</p>
                          {ex.pronunciation && (
                            <p className="text-xs text-text-muted">{ex.pronunciation}</p>
                          )}
                          {ex.meaningVi && <p className="text-sm text-text-secondary">{ex.meaningVi}</p>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {point.commonMistakes && (
                <div className="flex items-start gap-2 rounded-xl bg-neon-orange/10 p-3 text-neon-orange ring-1 ring-neon-orange/30">
                  <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide">Lỗi thường gặp</p>
                    <p className="mt-0.5 whitespace-pre-line text-sm">{point.commonMistakes}</p>
                  </div>
                </div>
              )}

              {point.comparedWith && (
                <div className="flex items-start gap-2 rounded-xl bg-neon-blue/10 p-3 text-neon-blue ring-1 ring-neon-blue/30">
                  <GitCompare size={18} className="mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide">So sánh với</p>
                    <p className="mt-0.5 whitespace-pre-line text-sm">{point.comparedWith}</p>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <AiExplainButton isPro={isPro} onOpen={onExplain} />
                {canLearn && (
                  <button
                    type="button"
                    onClick={onLearn}
                    disabled={learned}
                    className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium ring-1 transition ${
                      learned
                        ? 'cursor-default bg-neon-green/15 text-neon-green ring-neon-green/30'
                        : 'bg-[var(--bg-surface)] text-text-secondary ring-[var(--border-color)] hover:text-neon-green hover:ring-neon-green/40'
                    }`}
                  >
                    <Check size={16} />
                    {learned ? 'Đã học' : 'Đánh dấu đã học'}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}
