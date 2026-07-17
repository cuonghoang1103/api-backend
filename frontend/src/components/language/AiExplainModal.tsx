'use client';
/**
 * My Language — AI tutor explanation modal (Pro/Max).
 *
 * Shared by the Grammar and Vocab pages. Fetches a Vietnamese explanation of a
 * grammar point or a vocab word from POST /my-language/ai/explain, then renders
 * summary + markdown explanation + fresh examples (each speakable) + tips.
 *
 * Theme-aware (CSS vars, never `dark:`). The Pro gate + non-Pro redirect lives
 * in the trigger button on each page — this modal only opens for Pro users.
 */
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Loader2, AlertTriangle, Lightbulb, BookmarkPlus, Check } from 'lucide-react';
import { toast } from 'sonner';
import { languageApi, notebookApi, type AiExplanation } from '@/lib/language-api';
import { SpeakerButton } from '@/components/language/primitives';
import type { VocabLang } from '@/lib/notesTts';

/** Compose the explanation into a Markdown note body for the notebook. */
function explanationToMarkdown(d: AiExplanation): string {
  const parts: string[] = [];
  if (d.summary) parts.push(`> ${d.summary}`);
  if (d.explanation) parts.push(d.explanation);
  if (d.examples.length) {
    parts.push('### Ví dụ');
    parts.push(d.examples.map((e) => `- ${e.text}${e.reading ? ` (${e.reading})` : ''}${e.translation ? ` — ${e.translation}` : ''}`).join('\n'));
  }
  if (d.tips.length) {
    parts.push('### Mẹo & lưu ý');
    parts.push(d.tips.map((t) => `- ${t}`).join('\n'));
  }
  return parts.join('\n\n');
}

function speakLang(code: string): VocabLang | undefined {
  const c = (code || '').toLowerCase();
  if (c === 'ja') return 'ja-JP';
  if (c === 'zh') return 'zh-CN';
  if (c === 'en') return 'en-US';
  return undefined; // let the speaker auto-detect
}

export function AiExplainModal({
  kind,
  itemId,
  languageCode,
  title,
  onClose,
}: {
  kind: 'grammar' | 'vocab';
  itemId: number;
  languageCode: string;
  title: string;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AiExplanation | null>(null);
  const [mounted, setMounted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const saveToNotebook = async () => {
    if (!data || saving || saved) return;
    setSaving(true);
    try {
      await notebookApi.save({ code: languageCode, title, kind: kind === 'vocab' ? 'vocab' : 'grammar', body: explanationToMarkdown(data) });
      setSaved(true);
      toast.success('Đã lưu vào sổ tay ngôn ngữ');
    } catch (e: unknown) {
      toast.error((e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Không lưu được, thử lại sau.');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => setMounted(true), []);

  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    setData(null);
    languageApi
      .explain({ languageCode, kind, itemId })
      .then((res) => {
        if (alive) setData(res.data.data ?? null);
      })
      .catch((e: unknown) => {
        const msg =
          (e as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Không thể tải lời giải thích. Vui lòng thử lại.';
        if (alive) setError(msg);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [kind, itemId, languageCode]);

  const forceLang = speakLang(languageCode);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
        onClick={onClose}
      >
        <motion.div
          key="panel"
          initial={{ y: 24, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 24, opacity: 0, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Gia sư AI"
          className="card flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl sm:rounded-2xl"
        >
          {/* Header */}
          <div className="flex items-center gap-2.5 border-b border-[var(--border-color)] px-4 py-3.5">
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neon-violet/15 text-neon-violet">
              <Sparkles size={17} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium uppercase tracking-wide text-neon-violet">Gia sư AI</p>
              <p className="truncate font-heading text-base font-semibold text-text-primary">{title}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng"
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-text-muted transition hover:bg-[var(--bg-surface)] hover:text-text-primary"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
                <Loader2 size={28} className="animate-spin text-neon-violet" />
                <p className="text-sm text-text-muted">Đang soạn lời giải thích…</p>
              </div>
            ) : error ? (
              <div className="flex items-start gap-2 rounded-xl bg-neon-orange/10 p-3 text-neon-orange ring-1 ring-neon-orange/30">
                <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            ) : data ? (
              <div className="space-y-4">
                {data.summary && (
                  <p className="rounded-xl bg-neon-violet/10 p-3 text-sm font-medium text-text-primary ring-1 ring-neon-violet/25">
                    {data.summary}
                  </p>
                )}

                {data.explanation && (
                  <div className="note-prose lang-prose max-w-full break-words text-sm leading-relaxed text-text-secondary">
                    <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{data.explanation}</ReactMarkdown>
                  </div>
                )}

                {data.examples.length > 0 && (
                  <div className="space-y-2.5">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted">Ví dụ</h3>
                    <ul className="space-y-2.5">
                      {data.examples.map((ex, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 rounded-xl bg-[var(--bg-surface)] p-3 ring-1 ring-[var(--border-color)]"
                        >
                          <div className="mt-0.5 shrink-0">
                            <SpeakerButton
                              text={ex.text}
                              reading={ex.reading}
                              forceLang={forceLang}
                              size={16}
                              className="h-7 w-7"
                              rate={0.85}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-text-primary">{ex.text}</p>
                            {ex.reading && <p className="text-xs text-text-muted">{ex.reading}</p>}
                            {ex.translation && <p className="text-sm text-text-secondary">{ex.translation}</p>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {data.tips.length > 0 && (
                  <div className="flex items-start gap-2 rounded-xl bg-neon-cyan/10 p-3 text-neon-cyan ring-1 ring-neon-cyan/30">
                    <Lightbulb size={18} className="mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide">Mẹo & lưu ý</p>
                      <ul className="mt-1 list-disc space-y-1 pl-4 text-sm text-text-secondary">
                        {data.tips.map((t, i) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={saveToNotebook}
                  disabled={saving || saved}
                  className={`inline-flex w-full items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium ring-1 transition ${
                    saved ? 'bg-neon-green/15 text-neon-green ring-neon-green/30' : 'bg-[var(--bg-surface)] text-text-secondary ring-[var(--border-color)] hover:text-neon-violet hover:ring-neon-violet/40'
                  } disabled:opacity-70`}
                >
                  {saving ? <Loader2 size={15} className="animate-spin" /> : saved ? <Check size={15} /> : <BookmarkPlus size={15} />}
                  {saved ? 'Đã lưu vào sổ tay' : 'Lưu vào sổ tay'}
                </button>

                <p className="pt-1 text-center text-[11px] text-text-muted">Nội dung do AI tạo — hãy kiểm chứng khi cần.</p>
              </div>
            ) : null}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}

/**
 * AiExplainButton — the Pro-gated trigger. Non-Pro users are redirected to
 * /pro; Pro users open the modal (managed by the parent via `onOpen`).
 */
export function AiExplainButton({ isPro, onOpen, className = '' }: { isPro: boolean; onOpen: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onOpen();
      }}
      title="Giải thích bằng AI"
      /* Secondary: outline. Same shape as the primary, deliberately lighter —
         this is the optional extra, not the point of the card. */
      className={`inline-flex items-center gap-1.5 rounded-full bg-transparent px-3.5 py-1.5 text-xs font-bold text-cat-ai-icon ring-1 ring-cat-ai-icon/40 transition hover:bg-cat-ai-icon/10 ${className}`}
    >
      <Sparkles size={14} />
      <span>Giải thích AI</span>
      {!isPro && (
        <span className="rounded-full bg-neon-violet/25 px-1.5 py-0.5 text-[9px] font-bold uppercase leading-none tracking-wide">
          Pro
        </span>
      )}
    </button>
  );
}
