'use client';
/**
 * My Language — Kiểm tra ngữ pháp (AI proofreading). Pro/Max.
 * Rates the text, lists every issue (error / warning / style) with a fix and a
 * Vietnamese explanation, and returns a corrected version.
 * Route is `grammar-check` because `grammar` is the static grammar-points page.
 */
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { SpellCheck, Sparkles, Loader2, AlertTriangle, BookmarkPlus, Check, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { languageApi, notebookApi, type GrammarCheckResult, type GrammarIssue } from '@/lib/language-api';
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

const VERDICT: Record<GrammarCheckResult['verdict'], { label: string; cls: string }> = {
  good: { label: 'Chuẩn', cls: 'text-neon-green' },
  ok: { label: 'Khá — còn vài chỗ nên sửa', cls: 'text-neon-cyan' },
  poor: { label: 'Nhiều lỗi cần sửa', cls: 'text-neon-orange' },
};

const SEVERITY: Record<GrammarIssue['severity'], { label: string; cls: string; ring: string }> = {
  error: { label: 'Lỗi', cls: 'text-neon-pink', ring: 'ring-neon-pink/30' },
  warning: { label: 'Chưa tự nhiên', cls: 'text-neon-orange', ring: 'ring-neon-orange/30' },
  style: { label: 'Văn phong', cls: 'text-neon-cyan', ring: 'ring-neon-cyan/30' },
};

export default function GrammarCheckPage() {
  const code = String(useParams().code);
  const router = useRouter();
  const { isPro } = usePro();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GrammarCheckResult | null>(null);
  const [saved, setSaved] = useState(false);

  const forceLang = speakLang(code);
  const v = result ? VERDICT[result.verdict] : null;
  const clean = result != null && result.issues.length === 0;

  const check = async () => {
    if (!isPro) { router.push('/pro'); return; }
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setSaved(false);
    try {
      const r = await languageApi.grammarCheck({ languageCode: code, text });
      setResult(r.data.data ?? null);
    } catch (e: unknown) {
      setError((e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Không kiểm tra được, thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const copy = async (s: string) => {
    try {
      await navigator.clipboard.writeText(s);
      toast.success('Đã sao chép');
    } catch {
      toast.error('Không sao chép được.');
    }
  };

  const saveToNotebook = async () => {
    if (!result || saved) return;
    const body = [
      `### Văn bản gốc\n${text.trim()}`,
      `**Đánh giá:** ${result.score}/100 — ${VERDICT[result.verdict].label}`,
      result.summary ? `\n${result.summary}` : '',
      result.issues.length
        ? `### Lỗi & sửa\n${result.issues.map((i) => `- [${SEVERITY[i.severity].label}${i.type ? ` · ${i.type}` : ''}] ${i.original ? `~~${i.original}~~ → ` : ''}${i.suggestion}${i.explanation ? `\n  ${i.explanation}` : ''}`).join('\n')}`
        : '',
      result.corrected ? `### Bản đã sửa\n${result.corrected}` : '',
    ].filter(Boolean).join('\n\n');
    try {
      await notebookApi.save({ code, title: text.trim().slice(0, 60) || 'Kiểm tra ngữ pháp', kind: 'grammar-check', body });
      setSaved(true);
      toast.success('Đã lưu vào sổ tay');
    } catch (e: unknown) {
      toast.error((e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Không lưu được.');
    }
  };

  return (
    <SectionShell code={code} title="Kiểm tra ngữ pháp" icon={<SpellCheck className="text-neon-pink" />}>
      <div className="mx-auto max-w-2xl space-y-4">
        <p className="text-sm text-text-muted">
          Dán đoạn văn bạn viết — AI soi từng lỗi ngữ pháp, chính tả và cách dùng từ, giải thích bằng tiếng Việt rồi trả lại bản đã sửa.
        </p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Dán văn bản cần kiểm tra…"
          rows={7}
          className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-sm text-text-primary outline-none focus:border-neon-pink/60"
        />

        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted">{text.trim().length} ký tự</span>
          <button
            type="button"
            onClick={check}
            disabled={loading || !text.trim()}
            className="inline-flex items-center gap-1.5 rounded-full bg-neon-pink/15 px-4 py-2 text-sm font-semibold text-neon-pink ring-1 ring-neon-pink/30 transition hover:bg-neon-pink/25 disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {loading ? 'Đang kiểm tra…' : 'Kiểm tra'}
            {!isPro && <span className="rounded-full bg-neon-pink/25 px-1.5 py-0.5 text-[9px] font-bold uppercase leading-none">Pro</span>}
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
            <div className="flex items-center gap-3 rounded-2xl bg-[var(--bg-surface)] p-4 ring-1 ring-[var(--border-color)] shadow-[var(--shadow-md)]">
              <div className={v.cls}>
                <ProgressRing value={result.score} size={64} label={`${result.score}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-semibold ${v.cls}`}>{v.label}</p>
                {result.summary && <p className="mt-1 text-sm text-text-secondary">{result.summary}</p>}
              </div>
            </div>

            {clean ? (
              <div className="flex items-center gap-2 rounded-xl bg-neon-green/10 p-3 text-neon-green ring-1 ring-neon-green/30">
                <Check size={18} className="shrink-0" />
                <p className="text-sm">Không tìm thấy lỗi nào — văn bản của bạn đã ổn.</p>
              </div>
            ) : (
              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                  {result.issues.length} chỗ nên sửa
                </h3>
                <ul className="space-y-2">
                  {result.issues.map((it, i) => {
                    const sv = SEVERITY[it.severity];
                    return (
                      <li key={i} className={`rounded-xl bg-[var(--bg-surface)] p-3 text-sm ring-1 ${sv.ring} shadow-[var(--shadow-md)]`}>
                        <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${sv.cls} bg-current/10`}>{sv.label}</span>
                          {it.type && <span className="text-[11px] font-medium text-text-muted">{it.type}</span>}
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {it.original && <span className="rounded bg-neon-pink/10 px-1.5 py-0.5 text-neon-pink line-through">{it.original}</span>}
                          {it.original && it.suggestion && <span className="text-text-muted">→</span>}
                          {it.suggestion && <span className="rounded bg-neon-green/10 px-1.5 py-0.5 text-neon-green">{it.suggestion}</span>}
                        </div>
                        {it.explanation && <p className="mt-1.5 text-text-secondary">{it.explanation}</p>}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {result.corrected && (
              <div className="rounded-xl bg-emerald-500/10 p-3 ring-1 ring-emerald-500/30">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-xs font-semibold text-emerald-500">Bản đã sửa</span>
                  <SpeakerButton text={result.corrected} forceLang={forceLang} size={15} className="h-6 w-6" rate={0.9} />
                  <button
                    type="button"
                    onClick={() => copy(result.corrected)}
                    aria-label="Sao chép bản đã sửa"
                    className="ml-auto rounded-full p-1.5 text-text-muted transition hover:text-emerald-500"
                  >
                    <Copy size={14} />
                  </button>
                </div>
                <p className="whitespace-pre-wrap text-sm text-text-primary">{result.corrected}</p>
              </div>
            )}

            <button
              type="button"
              onClick={saveToNotebook}
              disabled={saved}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium ring-1 transition disabled:opacity-70 ${saved ? 'bg-neon-green/15 text-neon-green ring-neon-green/30' : 'bg-[var(--bg-surface)] text-text-secondary ring-[var(--border-color)] hover:text-neon-pink hover:ring-neon-pink/40'}`}
            >
              {saved ? <Check size={15} /> : <BookmarkPlus size={15} />} {saved ? 'Đã lưu vào sổ tay' : 'Lưu vào sổ tay'}
            </button>
          </div>
        )}
      </div>
    </SectionShell>
  );
}
