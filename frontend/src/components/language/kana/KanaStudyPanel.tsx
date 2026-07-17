'use client';
/**
 * Everything you can DO with one kana, below the fold of its detail modal:
 * write it, get a mnemonic, see what it gets confused with, keep it.
 *
 * Only mounted for Japanese — the stroke data is the Japanese set, and "viết
 * đúng thứ tự nét" is not a thing for the Latin alphabet or bare pinyin.
 */
import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PenTool, Sparkles, Loader2, BookmarkPlus, Check, AlertTriangle, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { languageApi, notebookApi, type KanaTip, type KanaConfusable } from '@/lib/language-api';
import { HanziWriterBox, type HanziWriterHandle } from '@/components/language/hanzi/HanziWriterBox';
import { usePro } from '@/hooks/usePro';
import { useRef } from 'react';

function tipToMarkdown(t: KanaTip): string {
  const lines = [`## ${t.char}${t.romaji ? ` (${t.romaji})` : ''}`, '', `**Mẹo nhớ:** ${t.mnemonic}`];
  if (t.strokeTip) lines.push('', `**Thứ tự nét:** ${t.strokeTip}`);
  if (t.confusable.length) {
    lines.push('', '**Dễ nhầm với:**');
    for (const c of t.confusable) lines.push(`- ${c.char}${c.romaji ? ` (${c.romaji})` : ''} — ${c.how}`);
  }
  if (t.examples.length) {
    lines.push('', '**Từ ví dụ:**');
    for (const e of t.examples) lines.push(`- ${e.word} (${e.reading}) — ${e.meaningVi}`);
  }
  return lines.join('\n');
}

export function KanaStudyPanel({ char, romaji, code }: { char: string; romaji?: string | null; code: string }) {
  const { isPro } = usePro();
  const [writing, setWriting] = useState(false);
  const [outline, setOutline] = useState(true);
  const [tip, setTip] = useState<KanaTip | null>(null);
  const [tipLoading, setTipLoading] = useState(false);
  const [confusable, setConfusable] = useState<KanaConfusable[]>([]);
  const [saved, setSaved] = useState(false);
  const writer = useRef<HanziWriterHandle>(null);

  // Confusables are a fixed table, so they load for everyone, always — no Pro
  // gate and no AI call. This is the part a learner needs most and it is free.
  useEffect(() => {
    setTip(null);
    setSaved(false);
    languageApi.kanaConfusable(char)
      .then((r) => setConfusable(r.data.data?.items ?? []))
      .catch(() => setConfusable([]));
  }, [char]);

  const askTip = useCallback(async () => {
    if (!isPro) { toast.info('Mẹo nhớ AI dành cho tài khoản Pro — nâng cấp tại /pro nhé.'); return; }
    setTipLoading(true);
    try {
      const r = await languageApi.kanaTip({ char, romaji: romaji ?? undefined });
      setTip(r.data.data ?? null);
    } catch (e) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Không lấy được mẹo nhớ, thử lại nhé.');
    } finally {
      setTipLoading(false);
    }
  }, [char, romaji, isPro]);

  const save = useCallback(async () => {
    if (!tip) return;
    try {
      await notebookApi.save({ code, title: `Kana ${tip.char}${tip.romaji ? ` (${tip.romaji})` : ''}`, kind: 'vocab', body: tipToMarkdown(tip) });
      setSaved(true);
      toast.success('Đã lưu vào sổ tay');
    } catch {
      toast.error('Không lưu được, thử lại nhé.');
    }
  }, [tip, code]);

  return (
    <div className="mt-4 space-y-3 text-left">
      {/* ── Known confusables. Free, instant, and the highest-value thing here. ── */}
      {confusable.length > 0 && (
        <div className="rounded-xl bg-neon-orange/10 p-3 ring-1 ring-neon-orange/25">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-neon-orange">
            <AlertTriangle size={13} /> Dễ nhầm với
          </p>
          <ul className="space-y-2">
            {confusable.map((c) => (
              <li key={c.char} className="flex gap-2.5">
                <span className="shrink-0 font-heading text-2xl font-bold leading-none text-text-primary">{c.char}</span>
                <span className="min-w-0 text-xs leading-relaxed text-text-secondary">
                  {c.romaji && <span className="font-semibold text-neon-orange">{c.romaji} — </span>}
                  {c.how}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setWriting((v) => !v)}
          className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold ring-1 transition ${
            writing ? 'bg-neon-violet/20 text-neon-violet ring-neon-violet/40' : 'bg-[var(--bg-surface)] text-text-secondary ring-[var(--border-color)] hover:text-text-primary'
          }`}
        >
          <PenTool size={15} /> Luyện viết
        </button>
        <button
          type="button"
          onClick={() => void askTip()}
          disabled={tipLoading}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-neon-gradient px-3 py-2 text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-60"
        >
          {tipLoading ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
          Mẹo nhớ AI{!isPro && ' 🔒'}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {writing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col items-center gap-2 rounded-xl bg-[var(--bg-surface)] p-3 ring-1 ring-[var(--border-color)]">
              <HanziWriterBox
                ref={writer}
                // Remount when the outline toggles: the library reads showOutline
                // at construction and ignores it afterwards.
                key={`${char}-${outline}`}
                char={char}
                lang="ja"
                size={200}
                mode="quiz"
                showOutline={outline}
                showGrid
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOutline((v) => !v)}
                  className="rounded-full px-3 py-1 text-xs font-semibold text-text-muted ring-1 ring-[var(--border-color)] transition hover:text-text-primary"
                >
                  {outline ? 'Ẩn nét mẫu' : 'Hiện nét mẫu'}
                </button>
                <button
                  type="button"
                  onClick={() => writer.current?.animate()}
                  className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold text-text-muted ring-1 ring-[var(--border-color)] transition hover:text-text-primary"
                >
                  <RotateCcw size={12} /> Xem lại nét
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {tip && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2 rounded-xl bg-neon-violet/10 p-3 ring-1 ring-neon-violet/25"
          >
            <p className="text-sm leading-relaxed text-text-primary">
              <span className="font-bold text-neon-violet">Mẹo nhớ: </span>{tip.mnemonic}
            </p>
            {tip.strokeTip && (
              <p className="text-xs leading-relaxed text-text-secondary">
                <span className="font-semibold">Nét: </span>{tip.strokeTip}
              </p>
            )}
            {tip.examples.length > 0 && (
              <ul className="space-y-1 border-t border-[var(--border-color)] pt-2">
                {tip.examples.map((e) => (
                  <li key={e.word} className="text-xs text-text-secondary">
                    <span className="font-heading text-sm font-bold text-text-primary">{e.word}</span>
                    {e.reading && <span className="text-neon-cyan"> ({e.reading})</span>} — {e.meaningVi}
                  </li>
                ))}
              </ul>
            )}
            <button
              type="button"
              onClick={() => void save()}
              disabled={saved}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[var(--bg-surface)] px-3 py-2 text-xs font-semibold text-text-secondary ring-1 ring-[var(--border-color)] transition hover:text-text-primary disabled:opacity-60"
            >
              {saved ? <><Check size={13} /> Đã lưu vào sổ tay</> : <><BookmarkPlus size={13} /> Lưu vào sổ tay</>}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
