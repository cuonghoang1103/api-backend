'use client';
/**
 * My Language — Luyện viết chữ Hán (kanji / hanzi).
 *
 * Grid of characters by level → open one → three stages that build on each
 * other: watch the strokes, trace them, then write from memory. Only the last
 * one counts as learned; tracing with the outline showing proves nothing.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import {
  PenTool, Play, RotateCcw, Check, X, ChevronLeft, ChevronRight, Loader2,
  Eye, EyeOff, Lightbulb, Sparkles, Trophy, ImageIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { languageApi, type HanziChar } from '@/lib/language-api';
import { SectionShell, EmptyState, SpeakerButton, useLangUser } from '@/components/language/primitives';
import { HanziWriterBox, type HanziWriterHandle } from '@/components/language/hanzi/HanziWriterBox';
import { Mascot, playMascotSound, praisePhrase, comfortPhrase } from '@/components/language/mascot/mascot';
import { dailyMascot } from '@/lib/mascotData';
import type { VocabLang } from '@/lib/notesTts';

type Stage = 'watch' | 'trace' | 'memory';
const STAGES: Array<{ id: Stage; label: string; hint: string }> = [
  { id: 'watch', label: '1 · Xem nét', hint: 'Xem thứ tự viết từng nét' },
  { id: 'trace', label: '2 · Tô theo', hint: 'Viết theo nét mờ — sai sẽ báo đỏ' },
  { id: 'memory', label: '3 · Nhớ & viết', hint: 'Không có mẫu — viết từ trí nhớ' },
];

export default function HanziPage() {
  const code = String(useParams().code);
  const lang: 'ja' | 'zh' = code === 'zh' ? 'zh' : 'ja';
  const { isAuthenticated } = useLangUser();
  const [levels, setLevels] = useState<string[]>([]);
  const [level, setLevel] = useState<string>('');
  const [chars, setChars] = useState<HanziChar[]>([]);
  const [loading, setLoading] = useState(true);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  // Review mode replaces the grid with just the characters this learner keeps
  // getting wrong — the list the server ranks, not a filter of the full set.
  const [review, setReview] = useState<HanziChar[] | null>(null);
  const [dueCount, setDueCount] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await languageApi.hanziList(code, level || undefined);
      const d = r.data.data;
      setChars(d?.chars ?? []);
      // Levels come from the unfiltered set, so filtering never empties the bar.
      if (!level) setLevels(d?.levels ?? []);
    } catch {
      setChars([]);
    } finally {
      setLoading(false);
    }
  }, [code, level]);

  useEffect(() => { void load(); }, [load]);

  // How many are due — shown on the button so it is worth pressing.
  useEffect(() => {
    if (!isAuthenticated) { setDueCount(0); return; }
    languageApi.hanziReview(code).then((r) => setDueCount(r.data.data?.count ?? 0)).catch(() => {});
  }, [code, isAuthenticated, chars]);

  const startReview = useCallback(async () => {
    try {
      const r = await languageApi.hanziReview(code);
      const list = r.data.data?.chars ?? [];
      if (!list.length) { toast.info('Chưa có chữ nào cần ôn — luyện thêm vài chữ đã nhé!'); return; }
      setReview(list);
      setOpenIdx(0);
    } catch {
      toast.error('Không tải được danh sách ôn tập');
    }
  }, [code]);

  // Whatever is on screen: the review queue when reviewing, else the grid.
  const shown = review ?? chars;
  const learned = chars.filter((c) => c.progress?.learned).length;

  return (
    <SectionShell
      code={code}
      title="Luyện viết chữ Hán"
      icon={<PenTool className="text-neon-orange" />}
      right={
        chars.length > 0 ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-neon-green/10 px-3 py-1.5 text-sm font-semibold text-neon-green ring-1 ring-neon-green/25">
            <Trophy size={14} /> {learned}/{chars.length} đã thuộc
          </span>
        ) : undefined
      }
    >
      <p className="mb-3 text-sm text-text-muted">
        Xem thứ tự nét → tô theo mẫu → viết từ trí nhớ. Viết sai nét sẽ được báo ngay và gợi ý.
      </p>

      {isAuthenticated && dueCount > 0 && (
        <button
          type="button"
          onClick={() => void startReview()}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-neon-gradient px-4 py-3 font-semibold text-white shadow-neon transition hover:opacity-95"
        >
          <RotateCcw size={17} /> Ôn {dueCount} chữ hay viết sai
        </button>
      )}

      {levels.length > 1 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setLevel('')}
            className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 transition ${
              !level ? 'bg-neon-orange/15 text-neon-orange ring-neon-orange/40' : 'bg-[var(--bg-surface)] text-text-muted ring-[var(--border-color)]'
            }`}
          >
            Tất cả
          </button>
          {levels.map((lv) => (
            <button
              key={lv}
              type="button"
              onClick={() => setLevel(lv)}
              className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 transition ${
                level === lv ? 'bg-neon-orange/15 text-neon-orange ring-neon-orange/40' : 'bg-[var(--bg-surface)] text-text-muted ring-[var(--border-color)]'
              }`}
            >
              {lv}
            </button>
          ))}
        </div>
      )}

      {review && (
        <div className="mb-3 flex items-center gap-2 rounded-2xl bg-neon-violet/10 p-3 ring-1 ring-neon-violet/30">
          <RotateCcw size={16} className="text-neon-violet" />
          <p className="min-w-0 flex-1 text-sm text-text-secondary">
            Đang ôn <span className="font-semibold text-neon-violet">{review.length} chữ</span> bạn hay viết sai — vào thẳng chặng viết từ trí nhớ.
          </p>
          <button type="button" onClick={() => { setReview(null); setOpenIdx(null); }} className="shrink-0 rounded-full px-3 py-1 text-xs font-semibold text-text-muted ring-1 ring-[var(--border-color)] hover:text-text-primary">
            Thoát ôn tập
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-neon-orange" /></div>
      ) : !chars.length ? (
        <EmptyState emoji="🖌️" title="Chưa có chữ Hán nào" hint="Quản trị viên có thể thêm trong trang admin." />
      ) : (
        <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-6 lg:grid-cols-8">
          {shown.map((c, i) => (
            <motion.button
              key={c.id}
              type="button"
              onClick={() => setOpenIdx(i)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.18, delay: Math.min(i * 0.012, 0.3) }}
              className={`group relative flex aspect-square flex-col items-center justify-center rounded-2xl ring-1 transition hover:-translate-y-0.5 ${
                c.progress?.learned
                  ? 'bg-neon-green/10 ring-neon-green/30'
                  : c.progress
                    ? 'bg-neon-orange/10 ring-neon-orange/25'
                    : 'bg-[var(--bg-surface)] ring-[var(--border-color)] hover:ring-neon-orange/40'
              }`}
            >
              {c.progress?.learned && (
                <Check size={12} className="absolute right-1.5 top-1.5 text-neon-green" />
              )}
              <span className="font-serif text-3xl text-text-primary sm:text-4xl">{c.char}</span>
              <span className="mt-0.5 line-clamp-1 px-1 text-[10px] text-text-muted">{c.meaningVi.split(/[,，]/)[0]}</span>
            </motion.button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {openIdx != null && shown[openIdx] && (
          <CharModal
            key={shown[openIdx].id}
            char={shown[openIdx]}
            lang={lang}
            code={code}
            isAuthenticated={isAuthenticated}
            hasPrev={openIdx > 0}
            hasNext={openIdx < shown.length - 1}
            onPrev={() => setOpenIdx((i) => (i != null && i > 0 ? i - 1 : i))}
            onNext={() => setOpenIdx((i) => (i != null && i < shown.length - 1 ? i + 1 : i))}
            onClose={() => setOpenIdx(null)}
            // Review opens straight at the hard part: these are characters the
            // learner has already watched and traced and still gets wrong.
            initialStage={review ? 'memory' : 'watch'}
            onProgress={(p) => {
              const patch = (arr: HanziChar[]) => arr.map((c, i) => (i === openIdx ? { ...c, progress: p } : c));
              if (review) setReview((prev) => (prev ? patch(prev) : prev));
              else setChars(patch);
            }}
          />
        )}
      </AnimatePresence>
    </SectionShell>
  );
}

function speakLang(code: string): VocabLang | undefined {
  if (code === 'ja') return 'ja-JP';
  if (code === 'zh') return 'zh-CN';
  return undefined;
}

// ─── Character detail ────────────────────────────────────────────
function CharModal({
  char, lang, code, isAuthenticated, hasPrev, hasNext, onPrev, onNext, onClose, onProgress, initialStage = 'watch',
}: {
  char: HanziChar;
  lang: 'ja' | 'zh';
  code: string;
  isAuthenticated: boolean;
  initialStage?: Stage;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
  onProgress: (p: HanziChar['progress']) => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [stage, setStage] = useState<Stage>(initialStage);
  const [strokes, setStrokes] = useState<number | null>(char.strokeCount);
  const [err, setErr] = useState<string | null>(null);
  const [wrong, setWrong] = useState(0);
  const [done, setDone] = useState<{ mistakes: number } | null>(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [saving, setSaving] = useState(false);
  const writer = useRef<HanziWriterHandle | null>(null);
  const coach = dailyMascot(char.char);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && hasNext) onNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  // Each stage starts fresh — carrying a previous run's mistakes into the next
  // stage would score the learner for something they already fixed.
  useEffect(() => { setWrong(0); setDone(null); }, [stage, char.id]);

  const finish = useCallback(
    async (mistakes: number) => {
      setDone({ mistakes });
      const fromMemory = stage === 'memory';
      const clean = mistakes === 0;
      playMascotSound(clean ? (fromMemory ? 'cheer' : 'praise') : 'sad');

      if (!isAuthenticated) return;
      setSaving(true);
      try {
        const r = await languageApi.hanziAttempt({ charId: char.id, mistakes, fromMemory });
        onProgress(r.data.data ?? null);
        if (clean && fromMemory) toast.success(`Thuộc chữ ${char.char} rồi! 🎉`);
      } catch {
        /* progress is a nicety — never block the practice on it */
      } finally {
        setSaving(false);
      }
    },
    [char.id, char.char, stage, isAuthenticated, onProgress],
  );

  if (!mounted) return null;

  const stageIdx = STAGES.findIndex((s) => s.id === stage);
  const readings = [char.onyomi, char.kunyomi].filter(Boolean).join(' · ') || char.pinyin || '';

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 24, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Chữ ${char.char}`}
        className="card flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl sm:rounded-2xl"
        // The sheet is fixed, so it escapes .app-main and must clear the notch itself.
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {/* Header */}
        <div className="flex items-center gap-2.5 border-b border-[var(--border-color)] px-4 py-3">
          <span className="font-serif text-2xl text-text-primary">{char.char}</span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              {char.level && <span className="rounded-full bg-neon-orange/15 px-1.5 py-0.5 text-[10px] font-bold text-neon-orange">{char.level}</span>}
              {strokes != null && <span className="text-[11px] text-text-muted">{strokes} nét</span>}
              {char.radical && <span className="text-[11px] text-text-muted">bộ {char.radical}</span>}
              {char.progress?.learned && (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-neon-green/15 px-1.5 py-0.5 text-[10px] font-semibold text-neon-green"><Check size={9} /> đã thuộc</span>
              )}
            </div>
            <p className="truncate text-sm font-medium text-text-primary">{char.meaningVi}</p>
          </div>
          <button type="button" onClick={onPrev} disabled={!hasPrev} aria-label="Chữ trước" className="flex h-8 w-8 items-center justify-center rounded-full text-text-muted transition hover:bg-[var(--bg-surface)] disabled:opacity-30"><ChevronLeft size={18} /></button>
          <button type="button" onClick={onNext} disabled={!hasNext} aria-label="Chữ sau" className="flex h-8 w-8 items-center justify-center rounded-full text-text-muted transition hover:bg-[var(--bg-surface)] disabled:opacity-30"><ChevronRight size={18} /></button>
          <button type="button" onClick={onClose} aria-label="Đóng" className="flex h-9 w-9 items-center justify-center rounded-full text-text-muted transition hover:bg-[var(--bg-surface)] hover:text-text-primary"><X size={18} /></button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {/* Stage tabs */}
          <div className="flex gap-1.5 px-4 pt-3">
            {STAGES.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStage(s.id)}
                className={`flex-1 rounded-xl px-2 py-2 text-xs font-semibold ring-1 transition ${
                  stage === s.id
                    ? 'bg-neon-orange/15 text-neon-orange ring-neon-orange/40'
                    : i < stageIdx
                      ? 'bg-neon-green/10 text-neon-green ring-neon-green/25'
                      : 'bg-[var(--bg-surface)] text-text-muted ring-[var(--border-color)]'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <p className="px-4 pt-1.5 text-center text-[11px] text-text-muted">{STAGES[stageIdx].hint}</p>

          {/* Writer */}
          <div className="px-4 py-3">
            {err ? (
              <div className="rounded-xl bg-neon-orange/10 p-4 text-center text-sm text-neon-orange ring-1 ring-neon-orange/30">{err}</div>
            ) : (
              <HanziWriterBox
                ref={writer}
                // Remount per stage: the writer configures outline visibility at
                // construction, so switching stages must rebuild it.
                key={`${char.id}-${stage}`}
                char={char.char}
                lang={lang}
                size={260}
                mode={stage === 'watch' ? 'animate' : 'quiz'}
                showOutline={stage !== 'memory'}
                onReady={(n) => setStrokes(n)}
                onStrokeWrong={() => setWrong((w) => w + 1)}
                onQuizComplete={(r) => void finish(r.mistakes)}
                onError={(m) => setErr(m)}
              />
            )}

            {/* Controls */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              {stage === 'watch' ? (
                <button type="button" onClick={() => writer.current?.animate()} className="inline-flex items-center gap-1.5 rounded-full bg-neon-orange/15 px-4 py-2 text-sm font-semibold text-neon-orange ring-1 ring-neon-orange/30 transition hover:bg-neon-orange/25">
                  <Play size={15} /> Xem lại
                </button>
              ) : (
                <button type="button" onClick={() => { setWrong(0); setDone(null); writer.current?.startQuiz(); }} className="inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-surface)] px-4 py-2 text-sm font-medium text-text-secondary ring-1 ring-[var(--border-color)] transition hover:text-neon-orange">
                  <RotateCcw size={15} /> Viết lại
                </button>
              )}
              <SpeakerButton text={char.char} forceLang={speakLang(code)} size={16} className="h-9 w-9" />
              {stage !== 'watch' && wrong > 0 && !done && (
                <span className="text-xs text-neon-orange">sai {wrong} nét</span>
              )}
            </div>
          </div>

          {/* Result */}
          <AnimatePresence>
            {done && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mx-4 mb-3 flex items-center gap-3 rounded-2xl bg-[var(--bg-surface)] p-3 ring-1 ring-[var(--border-color)]">
                <Mascot character={coach} emotion={done.mistakes === 0 ? 'cheer' : 'sad'} size={50} />
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-semibold ${done.mistakes === 0 ? 'text-neon-green' : 'text-neon-orange'}`}>
                    {done.mistakes === 0 ? praisePhrase(1) : comfortPhrase()}
                  </p>
                  <p className="text-xs text-text-muted">
                    {done.mistakes === 0 ? 'Viết đúng hết các nét!' : `Sai ${done.mistakes} nét — xem lại thứ tự nét nhé.`}
                    {saving && ' · đang lưu…'}
                  </p>
                </div>
                {stage !== 'memory' && (
                  <button type="button" onClick={() => setStage(stage === 'watch' ? 'trace' : 'memory')} className="shrink-0 rounded-full bg-neon-orange px-3 py-1.5 text-xs font-bold text-white">
                    Bước tiếp →
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Details */}
          <div className="space-y-3 px-4 pb-4">
            {readings && (
              <Row label={lang === 'ja' ? 'Âm đọc' : 'Pinyin'}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-text-primary">{readings}</span>
                  {lang === 'ja' && char.onyomi && <span className="rounded bg-neon-violet/10 px-1.5 py-0.5 text-[10px] text-neon-violet">on: {char.onyomi}</span>}
                  {lang === 'ja' && char.kunyomi && <span className="rounded bg-neon-cyan/10 px-1.5 py-0.5 text-[10px] text-neon-cyan">kun: {char.kunyomi}</span>}
                </div>
              </Row>
            )}

            {char.mnemonic && (
              <div className="rounded-2xl bg-neon-violet/10 p-3 ring-1 ring-neon-violet/25">
                <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-neon-violet"><Lightbulb size={13} /> Cách nhớ</p>
                <p className="whitespace-pre-wrap text-sm text-text-secondary">{char.mnemonic}</p>
              </div>
            )}

            {char.breakdown && <Row label="Chiết tự"><p className="text-sm text-text-secondary">{char.breakdown}</p></Row>}

            {char.images.length > 0 && (
              <div className="rounded-2xl bg-[var(--bg-surface)] p-3 ring-1 ring-[var(--border-color)] shadow-[var(--shadow-md)]">
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-text-muted"><ImageIcon size={13} /> Hình minh hoạ</p>
                <div className="relative overflow-hidden rounded-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={char.images[imgIdx]?.url} alt={char.images[imgIdx]?.caption || `Minh hoạ ${char.char}`} className="max-h-64 w-full object-contain" />
                  {char.images.length > 1 && (
                    <div className="mt-2 flex justify-center gap-1.5">
                      {char.images.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setImgIdx(i)}
                          aria-label={`Ảnh ${i + 1}`}
                          className={`h-1.5 rounded-full transition-all ${i === imgIdx ? 'w-5 bg-neon-orange' : 'w-1.5 bg-text-muted/40'}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
                {char.images[imgIdx]?.caption && <p className="mt-1.5 text-center text-xs text-text-muted">{char.images[imgIdx].caption}</p>}
              </div>
            )}

            {char.examples.length > 0 && (
              <Row label="Từ ghép thường gặp">
                <ul className="space-y-1.5">
                  {char.examples.map((e, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="font-medium text-text-primary">{e.word}</span>
                      {e.reading && <span className="text-xs text-text-muted">{e.reading}</span>}
                      <span className="min-w-0 flex-1 break-words text-text-secondary">— {e.meaningVi}</span>
                      <SpeakerButton text={e.word} reading={e.reading} forceLang={speakLang(code)} size={13} className="h-6 w-6 shrink-0" />
                    </li>
                  ))}
                </ul>
              </Row>
            )}

            {char.note && <Row label="Ghi chú"><p className="text-sm text-text-secondary">{char.note}</p></Row>}

            {!isAuthenticated && (
              <p className="text-center text-[11px] text-text-muted">Đăng nhập để lưu tiến độ luyện viết.</p>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-[var(--bg-surface)] p-3 ring-1 ring-[var(--border-color)] shadow-[var(--shadow-md)]">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-text-muted">{label}</p>
      {children}
    </div>
  );
}
