'use client';

/**
 * ReaderAiTools — PRO-gated AI helpers on the article detail page.
 *
 *   - TL;DR:        one-tap bullet summary of this article
 *   - Explain code: plain-language walkthrough of the Before/After block
 *   - Ask:          question answered from the published article corpus (RAG)
 *
 * Auth/entitlement is decided by the server (`readerAiStatus`):
 *   - not logged in (401) or logged-in-not-Pro → a compact /pro upsell
 *   - Pro + key present → the tools
 *   - server has no key (available=false) → renders nothing (no dead UI)
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Sparkles, Loader2, ListTree, MessageCircleQuestion, Code2, Lock, ArrowRight } from 'lucide-react';
import { techTrendsApi } from '@/lib/api';

type Gate = 'loading' | 'off' | 'need_pro' | 'ready';

function errMsg(err: unknown, fallback: string): string {
  return err instanceof Error && err.message ? err.message : fallback;
}

export default function ReaderAiTools({ articleId, hasCodeBlock }: { articleId: number; hasCodeBlock: boolean }) {
  const [gate, setGate] = useState<Gate>('loading');
  const [busy, setBusy] = useState<null | 'tldr' | 'code' | 'ask'>(null);
  const [tldr, setTldr] = useState<string[] | null>(null);
  const [codeExplain, setCodeExplain] = useState<string | null>(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<{ text: string; sources: { id: number; slug: string; title: string }[] } | null>(null);

  useEffect(() => {
    let cancelled = false;
    techTrendsApi
      .readerAiStatus()
      .then((r) => {
        if (cancelled) return;
        const { available, isPro } = r.data.data;
        setGate(!available ? 'off' : isPro ? 'ready' : 'need_pro');
      })
      .catch(() => { if (!cancelled) setGate('need_pro'); }); // 401 (anon) → show upsell
    return () => { cancelled = true; };
  }, []);

  const onProError = (err: unknown, fallback: string) => {
    // If the entitlement lapsed between the probe and the call, flip to upsell.
    const msg = errMsg(err, fallback);
    if (/pro/i.test(msg)) setGate('need_pro');
    toast.error(msg);
  };

  const runTldr = async () => {
    setBusy('tldr');
    try {
      const r = await techTrendsApi.tldr(articleId);
      setTldr(r.data.data.tldr);
    } catch (err) {
      onProError(err, 'Không tạo được tóm tắt');
    } finally {
      setBusy(null);
    }
  };

  const runCode = async () => {
    setBusy('code');
    try {
      const r = await techTrendsApi.explainArticleCode(articleId);
      setCodeExplain(r.data.data.explanation);
    } catch (err) {
      onProError(err, 'Không giải thích được code');
    } finally {
      setBusy(null);
    }
  };

  const runAsk = async () => {
    if (!question.trim()) { toast.error('Nhập câu hỏi trước'); return; }
    setBusy('ask');
    try {
      const r = await techTrendsApi.ask(question.trim());
      setAnswer({ text: r.data.data.answer, sources: r.data.data.sources });
    } catch (err) {
      onProError(err, 'Không trả lời được');
    } finally {
      setBusy(null);
    }
  };

  if (gate === 'loading' || gate === 'off') return null;

  if (gate === 'need_pro') {
    return (
      <div className="rounded-2xl border border-neon-violet/30 bg-neon-violet/[0.06] p-5 flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-neon-violet/15 flex items-center justify-center shrink-0">
          <Lock className="w-5 h-5 text-neon-violet" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-text-primary flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-neon-violet" /> Trợ lý AI đọc bài
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-neon-violet/20 text-neon-violet">PRO</span>
          </p>
          <p className="text-xs text-text-secondary mt-1 leading-relaxed">
            Tóm tắt nhanh (TL;DR), hỏi đáp dựa trên blog và giải thích code — dành cho tài khoản Pro.
          </p>
          <Link
            href="/pro"
            className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet text-white text-xs font-semibold shadow-neon hover:opacity-90 active:scale-95 transition-all"
          >
            Mở khoá với Pro <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  // gate === 'ready'
  return (
    <div className="rounded-2xl border border-neon-violet/30 bg-neon-violet/[0.05] p-5 space-y-4">
      <p className="text-sm font-semibold text-text-primary flex items-center gap-1.5">
        <Sparkles className="w-4 h-4 text-neon-violet" /> Trợ lý AI
        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-neon-violet/20 text-neon-violet">PRO</span>
      </p>

      <div className="flex flex-wrap gap-2">
        <button onClick={runTldr} disabled={busy === 'tldr'} className={chip}>
          {busy === 'tldr' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ListTree className="w-3.5 h-3.5" />}
          Tóm tắt nhanh (TL;DR)
        </button>
        {hasCodeBlock && (
          <button onClick={runCode} disabled={busy === 'code'} className={chip}>
            {busy === 'code' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Code2 className="w-3.5 h-3.5" />}
            Giải thích đoạn code
          </button>
        )}
      </div>

      {tldr && (
        <ul className="space-y-1.5 rounded-xl bg-black/20 border border-darkborder p-3">
          {tldr.map((t, i) => (
            <li key={i} className="flex gap-2 text-sm text-text-secondary leading-relaxed">
              <span className="text-neon-violet shrink-0">•</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      )}

      {codeExplain && (
        <div className="rounded-xl bg-black/20 border border-darkborder p-3 text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
          {codeExplain}
        </div>
      )}

      {/* Ask the blog */}
      <div className="pt-2 border-t border-neon-violet/15 space-y-2">
        <p className="text-xs text-text-muted flex items-center gap-1.5">
          <MessageCircleQuestion className="w-3.5 h-3.5" /> Hỏi về blog (trả lời dựa trên các bài đã đăng)
        </p>
        <div className="flex gap-2">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') runAsk(); }}
            placeholder="vd: Cách xử lý letterbox video trong feed?"
            className="flex-1 min-w-0 px-3 py-2 bg-darkcard border border-darkborder rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 focus:ring-2 focus:ring-neon-violet/15 transition-all"
          />
          <button onClick={runAsk} disabled={busy === 'ask'} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-neon-indigo to-neon-violet text-white text-xs font-semibold shadow-neon hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all shrink-0">
            {busy === 'ask' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            Hỏi
          </button>
        </div>
        {answer && (
          <div className="rounded-xl bg-black/20 border border-darkborder p-3 space-y-2">
            <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">{answer.text}</p>
            {answer.sources.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[11px] text-text-muted">Nguồn:</span>
                {answer.sources.map((s) => (
                  <Link key={s.id} href={`/tech-trends/${s.slug}`} className="text-[11px] text-neon-violet hover:underline">
                    {s.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <p className="text-[11px] text-text-muted">⚠️ AI có thể sai — hãy kiểm chứng lại thông tin quan trọng.</p>
    </div>
  );
}

const chip = [
  'inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium',
  'bg-white/[0.04] text-text-secondary border border-darkborder',
  'hover:text-neon-violet hover:border-neon-violet/30 disabled:opacity-50 active:scale-95 transition-all',
].join(' ');
