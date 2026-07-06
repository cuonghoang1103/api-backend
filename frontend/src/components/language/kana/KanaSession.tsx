'use client';
/**
 * Session engine: builds the question queue from settings, renders one stage at
 * a time with a live progress bar + score, then hands off to the results screen.
 */
import { useCallback, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LogOut, Check } from 'lucide-react';
import { toast } from 'sonner';
import {
  buildQuestions,
  type KanaGroup,
  type KanaItem,
  type PracticeSettings,
  type QuestionResult,
} from './types';
import { STAGE_META, StageRenderer } from './stages';
import { KanaResults } from './KanaResults';

export function KanaSession({
  groups,
  settings,
  onExit,
  reduced,
}: {
  groups: KanaGroup[];
  settings: PracticeSettings;
  onExit: () => void;
  reduced: boolean;
}) {
  const selectedGroups = useMemo(
    () => groups.filter((g) => settings.groupIds.includes(g.id)),
    [groups, settings.groupIds],
  );
  const pool = useMemo<KanaItem[]>(() => selectedGroups.flatMap((g) => g.items), [selectedGroups]);

  const [seed, setSeed] = useState(0); // bump to rebuild the queue (retry)
  const questions = useMemo(
    () => buildQuestions(selectedGroups, settings.stages, settings.count),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedGroups, settings.stages, settings.count, seed],
  );

  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [done, setDone] = useState(false);
  const resultLocked = useRef(false);

  const current = questions[index];
  const total = questions.length;
  const score = results.filter((r) => r.correct).length;

  const handleResult = useCallback(
    (correct: boolean) => {
      if (resultLocked.current || !current) return;
      resultLocked.current = true;
      setResults((prev) => [...prev, { stage: current.stage, correct }]);
    },
    [current],
  );

  const handleNext = useCallback(() => {
    resultLocked.current = false;
    setIndex((i) => {
      const next = i + 1;
      if (next >= total) setDone(true);
      return next;
    });
  }, [total]);

  const restart = useCallback(() => {
    setResults([]);
    setIndex(0);
    setDone(false);
    resultLocked.current = false;
    setSeed((s) => s + 1);
  }, []);

  if (total === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--border-color)] py-12 text-center">
        <p className="text-text-secondary">Không tạo được câu hỏi từ lựa chọn hiện tại.</p>
        <button
          type="button"
          onClick={onExit}
          className="mt-3 rounded-xl bg-neon-violet px-4 py-2 text-sm font-semibold text-white"
        >
          Quay lại cài đặt
        </button>
      </div>
    );
  }

  if (done) {
    return (
      <KanaResults
        results={results}
        onRetry={restart}
        onReconfigure={onExit}
        reduced={reduced}
      />
    );
  }

  const meta = STAGE_META[current.stage];
  const StageIcon = meta.icon;
  const progress = total ? (index / total) * 100 : 0;

  return (
    <div className="mx-auto max-w-lg">
      {/* Header: progress + score + exit */}
      <div className="mb-4">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-surface)] px-3 py-1 text-xs font-semibold text-text-secondary ring-1 ring-[var(--border-color)]">
            <StageIcon size={13} className="text-neon-violet" />
            {meta.name}
          </span>
          <span className="text-sm font-semibold text-text-secondary">
            {index + 1} / {total}
          </span>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-neon-green">
              <Check size={14} /> {score}
            </span>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Thoát bài luyện? Kết quả hiện tại sẽ không được lưu.')) {
                  toast.info('Đã thoát bài luyện');
                  onExit();
                }
              }}
              aria-label="Thoát"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-text-muted transition hover:bg-neon-red/15 hover:text-neon-red"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-[var(--bg-surface)]">
          <motion.div
            className="h-full rounded-full bg-neon-violet"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: reduced ? 0 : 0.25, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Stage */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0, pointerEvents: 'auto' }}
          exit={reduced ? { opacity: 0, pointerEvents: 'none' } : { opacity: 0, y: -8, pointerEvents: 'none' }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <StageRenderer
            stage={current.stage}
            target={current.target}
            word={current.word}
            pool={pool}
            onResult={handleResult}
            onNext={handleNext}
            reduced={reduced}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
