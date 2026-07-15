'use client';
/**
 * My Language — Luyện viết (AI writing feedback). Pro/Max.
 * The learner writes freely (optional prompt) → AI scores + estimates a level,
 * lists specific corrections, and returns an improved rewrite.
 */
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PenLine, Sparkles, Loader2, AlertTriangle, BookmarkPlus, Check } from 'lucide-react';
import { toast } from 'sonner';
import { languageApi, notebookApi, type WritingFeedback } from '@/lib/language-api';
import { SectionShell, ProgressRing, SpeakerButton } from '@/components/language/primitives';
import { usePro } from '@/hooks/usePro';
import type { VocabLang } from '@/lib/notesTts';

function speakLang(code: string): VocabLang | undefined {
  const c = (code || '').toLowerCase();
  if (c === 'ja') return 'ja-JP';
  if (c === 'zh') return 'zh-CN';
  if (c === 'en') return 'en-US';
  return undefined;
}

const VERDICT: Record<WritingFeedback['verdict'], { label: string; cls: string }> = {
  good: { label: 'Tốt', cls: 'text-neon-green' },
  ok: { label: 'Khá', cls: 'text-neon-cyan' },
  poor: { label: 'Cần cải thiện', cls: 'text-neon-orange' },
};

export default function WritingPage() {
  const code = String(useParams().code);
  const router = useRouter();
  const { isPro } = usePro();
  const [prompt, setPrompt] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<WritingFeedback | null>(null);
  const [saved, setSaved] = useState(false);

  const forceLang = speakLang(code);
  const v = result ? VERDICT[result.verdict] : null;

  const saveToNotebook = async () => {
    if (!result || saved) return;
    const body = [
      prompt.trim() ? `**Đề bài:** ${prompt.trim()}` : '',
      `### Bài viết của bạn\n${text.trim()}`,
      `**Điểm:** ${result.score}/100${result.level ? ` · ${result.level}` : ''} (${result.verdict})`,
      result.feedback ? `\n${result.feedback}` : '',
      result.corrections.length ? `### Lỗi & gợi ý\n${result.corrections.map((c) => `- ${c.original ? `~~${c.original}~~ → ` : ''}${c.suggestion}${c.note ? ` (${c.note})` : ''}`).join('\n')}` : '',
      result.corrected ? `### Bản viết lại\n${result.corrected}` : '',
    ].filter(Boolean).join('\n\n');
    try {
      await notebookApi.save({ code, title: prompt.trim() || 'Bài viết', kind: 'writing', body });
      setSaved(true);
      toast.success('Đã lưu vào sổ tay');
    } catch (e: unknown) {
      toast.error((e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Không lưu được.');
    }
  };

  const grade = async () => {
    if (!isPro) { router.push('/pro'); return; }
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setSaved(false);
    try {
      const r = await languageApi.gradeWriting({ languageCode: code, text, prompt: prompt.trim() || undefined });
      setResult(r.data.data ?? null);
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Không chấm được, thử lại sau.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SectionShell code={code} title="Luyện viết" icon={<PenLine className="text-neon-emerald" />}>
      <div className="mx-auto max-w-2xl space-y-4">
        <p className="text-sm text-text-muted">
          Viết một đoạn văn — AI sẽ chấm điểm, chỉ lỗi cụ thể và gợi ý bản viết lại. Có thể nhập đề bài (tùy chọn).
        </p>

        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Đề bài (tùy chọn) — vd: Giới thiệu bản thân"
          className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-sm text-text-primary outline-none focus:border-neon-violet/60"
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Viết bài của bạn ở đây…"
          rows={7}
          className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-sm text-text-primary outline-none focus:border-neon-violet/60"
        />

        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted">{text.trim().length} ký tự</span>
          <button
            type="button"
            onClick={grade}
            disabled={loading || !text.trim()}
            className="inline-flex items-center gap-1.5 rounded-full bg-neon-violet/15 px-4 py-2 text-sm font-semibold text-neon-violet ring-1 ring-neon-violet/30 transition hover:bg-neon-violet/25 disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {loading ? 'Đang chấm…' : 'Chấm bài'}
            {!isPro && <span className="rounded-full bg-neon-violet/25 px-1.5 py-0.5 text-[9px] font-bold uppercase leading-none">Pro</span>}
          </button>
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-xl bg-neon-orange/10 p-3 text-neon-orange ring-1 ring-neon-orange/30">
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {result && v && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-2xl bg-[var(--bg-surface)] p-4 ring-1 ring-[var(--border-color)]">
              <div className={v.cls}>
                <ProgressRing value={result.score} size={64} label={`${result.score}`} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-semibold ${v.cls}`}>{v.label}</p>
                  {result.level && (
                    <span className="rounded-full bg-neon-violet/15 px-2 py-0.5 text-[11px] font-semibold text-neon-violet ring-1 ring-neon-violet/30">{result.level}</span>
                  )}
                </div>
                {result.feedback && <p className="mt-1 text-sm text-text-secondary">{result.feedback}</p>}
              </div>
            </div>

            {result.corrections.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted">Lỗi & gợi ý</h3>
                <ul className="space-y-2">
                  {result.corrections.map((c, i) => (
                    <li key={i} className="rounded-xl bg-[var(--bg-surface)] p-3 text-sm ring-1 ring-[var(--border-color)]">
                      <div className="flex flex-wrap items-center gap-2">
                        {c.original && <span className="rounded bg-neon-pink/10 px-1.5 py-0.5 text-neon-pink line-through">{c.original}</span>}
                        {c.suggestion && <span className="text-text-muted">→</span>}
                        {c.suggestion && <span className="rounded bg-neon-green/10 px-1.5 py-0.5 text-neon-green">{c.suggestion}</span>}
                      </div>
                      {c.note && <p className="mt-1 text-text-secondary">{c.note}</p>}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.corrected && (
              <div className="rounded-xl bg-emerald-500/10 p-3 ring-1 ring-emerald-500/30">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-xs font-semibold text-emerald-500">Bản viết lại</span>
                  <SpeakerButton text={result.corrected} forceLang={forceLang} size={15} className="h-6 w-6" rate={0.9} />
                </div>
                <p className="whitespace-pre-wrap text-sm text-text-primary">{result.corrected}</p>
              </div>
            )}

            <button
              type="button"
              onClick={saveToNotebook}
              disabled={saved}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium ring-1 transition disabled:opacity-70 ${saved ? 'bg-neon-green/15 text-neon-green ring-neon-green/30' : 'bg-[var(--bg-surface)] text-text-secondary ring-[var(--border-color)] hover:text-neon-violet hover:ring-neon-violet/40'}`}
            >
              {saved ? <Check size={15} /> : <BookmarkPlus size={15} />} {saved ? 'Đã lưu vào sổ tay' : 'Lưu vào sổ tay'}
            </button>
          </div>
        )}
      </div>
    </SectionShell>
  );
}
