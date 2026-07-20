'use client';

// AI walkthrough of one exercise, plus a follow-up chat about that walkthrough.
//
// Generating is Pro-only and costs tokens, so the result is cached server-side
// on the exercise: the first Pro reader pays, everyone after reads it for free.
// The chat is per-person and is not stored — it is a conversation, not content.

import { useCallback, useEffect, useRef, useState } from 'react';
import { Sparkles, Loader2, RefreshCw, Send, MessageCircle, Crown, User } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import type { DocBlock, DocLang } from '@/types/exp-hub';
import { hasVietnamese } from '@/types/exp-hub';
import { DocBlocksView } from '@/components/exp-hub/DocBlocksView';
import { codeLabApi } from '@/lib/code-lab-api';
import { useAuthStore } from '@/store/authStore';
import { usePro } from '@/hooks/usePro';

interface Turn { role: 'user' | 'assistant'; content: string }

export function AiExplain({ exerciseId }: { exerciseId: number }) {
  const isAuthed = useAuthStore((s) => s.isAuthenticated);
  // The project already has one source of truth for entitlement — use it rather
  // than guessing from a field that may not be on the cached user object.
  const { isPro } = usePro();

  const [blocks, setBlocks] = useState<DocBlock[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [lang, setLang] = useState<DocLang>('en');

  // When the poll below is waiting for a REGENERATED explanation, the old one
  // is still cached — so "is it ready?" has to mean "is it newer than the one I
  // already had?", not merely "does one exist?".
  const generatedAtRef = useRef<string | null>(null);

  const [turns, setTurns] = useState<Turn[]>([]);
  const [question, setQuestion] = useState('');
  const [asking, setAsking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  // Read the cached explanation on mount. Costs nothing and needs no Pro.
  useEffect(() => {
    let alive = true;
    codeLabApi.readAiExplanation(exerciseId)
      .then((r) => {
        if (!alive) return;
        setBlocks(r.data.data.blocks || []);
        generatedAtRef.current = r.data.data.generatedAt ?? null;
      })
      .catch(() => { if (alive) setBlocks([]); });
    return () => { alive = false; };
  }, [exerciseId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [turns, asking]);

  const generate = useCallback(async (force: boolean) => {
    setBusy(true);
    try {
      const r = await codeLabApi.generateAiExplanation(exerciseId, force);
      setBlocks(r.data.data.blocks || []);
      generatedAtRef.current = r.data.data.generatedAt ?? generatedAtRef.current;
      toast.success(force ? 'Explanation regenerated' : 'Explanation ready');
    } catch (e: unknown) {
      const err = e as { code?: string; response?: { status?: number; data?: { message?: string } } };
      const status = err?.response?.status;

      // The server does NOT stop working when the connection dies: it finishes
      // the walkthrough and caches it on the exercise. So a dropped connection
      // is a reason to go and look for the result, not to report a failure —
      // otherwise the reader sees an error sitting on top of a finished answer.
      //
      // 504/502 count as dropped. Those come from NGINX giving up on the
      // upstream, not from the backend answering — which is exactly what the
      // longest exercises produced, since they are the ones that run past the
      // proxy's ceiling. Treating them as real errors is why "wait forever,
      // still nothing" happened on the big assignments and nowhere else.
      if (!status || status === 502 || status === 504 || status === 408 || status === 524) {
        for (let i = 0; i < 40; i++) {
          await new Promise((r2) => setTimeout(r2, 15_000));
          try {
            const got = await codeLabApi.readAiExplanation(exerciseId);
            const ready = got.data.data.blocks || [];
            const at = got.data.data.generatedAt ?? null;
            if (ready.length && at !== generatedAtRef.current) {
              generatedAtRef.current = at;
              setBlocks(ready);
              toast.success('Explanation ready');
              return;
            }
          } catch { /* keep waiting — the generation is still running */ }
        }
      }

      toast.error(status === 403
        ? 'AI explanation is a Pro feature.'
        : err?.response?.data?.message || 'Could not generate the explanation.');
    } finally { setBusy(false); }
  }, [exerciseId]);

  const ask = useCallback(async () => {
    const q = question.trim();
    if (!q || asking) return;
    setQuestion('');
    const history = turns.slice(-12);
    setTurns((t) => [...t, { role: 'user', content: q }]);
    setAsking(true);
    try {
      const r = await codeLabApi.askAiFollowUp(exerciseId, q, history);
      setTurns((t) => [...t, { role: 'assistant', content: r.data.data.answer }]);
    } catch (e: unknown) {
      const status = (e as { response?: { status?: number } })?.response?.status;
      setTurns((t) => t.slice(0, -1));
      setQuestion(q);
      toast.error(status === 403 ? 'Asking the AI is a Pro feature.' : 'The AI could not answer. Try again.');
    } finally { setAsking(false); }
  }, [question, asking, turns, exerciseId]);

  const hasExplanation = !!blocks?.length;

  return (
    <section className="mb-5">
      <h2 className="mb-2 flex flex-wrap items-center gap-2 text-sm font-bold uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
        <Sparkles size={14} /> AI explanation
        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
          style={{ background: 'linear-gradient(90deg,#f59e0b,#f97316)', color: '#fff' }}>
          <Crown size={10} /> Pro
        </span>
        {hasExplanation && hasVietnamese(blocks!) && (
          <span className="ml-auto flex items-center gap-1">
            {(['en', 'vi'] as const).map((c) => (
              <button key={c} onClick={() => setLang(c)} aria-pressed={lang === c}
                className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                style={lang === c
                  ? { background: 'var(--accent-color, #8b5cf6)', color: '#fff' }
                  : { background: 'var(--bg-surface)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>
                {c === 'en' ? 'EN' : 'VN'}
              </button>
            ))}
          </span>
        )}
      </h2>

      <div className="rounded-xl border p-4" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}>
        {!hasExplanation && (
          <div className="text-center">
            <p className="mb-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Have the assignment explained step by step — what it is really asking, how to approach it,
              which Java APIs it needs, and the mistakes that lose marks.
            </p>
            {!isAuthed ? (
              <Link href="/login" className="text-sm underline" style={{ color: '#6366f1' }}>Sign in to use this</Link>
            ) : !isPro ? (
              <Link href="/pro" className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold"
                style={{ background: 'linear-gradient(90deg,#f59e0b,#f97316)', color: '#fff' }}>
                <Crown size={15} /> Upgrade to Pro
              </Link>
            ) : (
              <button onClick={() => generate(false)} disabled={busy}
                className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold"
                style={{ background: 'var(--accent-color, #8b5cf6)', color: '#fff' }}>
                {busy ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
                {busy ? 'Writing the walkthrough…' : 'Explain this exercise'}
              </button>
            )}
            {busy && (
              // A full walkthrough takes MINUTES on the strongest model. Without
              // saying so, a spinner that long reads as a hang and gets reloaded
              // away seconds before the answer lands.
              <p className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                This is a full lesson, not a summary — it takes a few minutes.
                You can leave the page; it is saved when it is done.
              </p>
            )}
          </div>
        )}

        {hasExplanation && (
          <>
            <DocBlocksView blocks={blocks!} lang={lang} />

            {isPro && (
              <div className="mt-3 flex justify-end">
                <button onClick={() => generate(true)} disabled={busy}
                  className="inline-flex items-center gap-1 text-xs underline" style={{ color: 'var(--text-muted)' }}>
                  {busy ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />} Regenerate
                </button>
              </div>
            )}

            {/* Follow-up chat — anchored to the explanation above */}
            <div className="mt-4 border-t pt-3" style={{ borderColor: 'var(--border-color)' }}>
              <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase" style={{ color: 'var(--text-secondary)' }}>
                <MessageCircle size={13} /> Something unclear? Ask about this explanation
              </div>

              {turns.length > 0 && (
                <div className="mb-2 max-h-[420px] space-y-2 overflow-y-auto pr-1">
                  {turns.map((t, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="mt-0.5 shrink-0">
                        {t.role === 'user'
                          ? <User size={14} style={{ color: 'var(--text-muted)' }} />
                          : <Sparkles size={14} style={{ color: 'var(--accent-color, #8b5cf6)' }} />}
                      </span>
                      <div className="min-w-0 flex-1 whitespace-pre-wrap rounded-lg px-3 py-2 text-sm"
                        style={{
                          background: t.role === 'user' ? 'var(--bg-surface)' : 'var(--bg-surface-active, var(--bg-surface))',
                          color: 'var(--text-primary)',
                        }}>
                        {t.content}
                      </div>
                    </div>
                  ))}
                  {asking && (
                    <div className="flex items-center gap-2 px-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                      <Loader2 size={14} className="animate-spin" /> Thinking…
                    </div>
                  )}
                  <div ref={endRef} />
                </div>
              )}

              {isPro ? (
                <div className="flex items-end gap-2">
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void ask(); } }}
                    rows={2}
                    placeholder="e.g. why do we need a Comparator here, not Collections.sort?"
                    className="flex-1 resize-none rounded-lg border px-3 py-2 text-sm outline-none"
                    style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
                  />
                  <button onClick={() => void ask()} disabled={asking || !question.trim()}
                    className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold disabled:opacity-40"
                    style={{ background: 'var(--accent-color, #8b5cf6)', color: '#fff' }}>
                    <Send size={14} /> Ask
                  </button>
                </div>
              ) : (
                <Link href="/pro" className="inline-flex items-center gap-1.5 text-sm underline" style={{ color: '#f59e0b' }}>
                  <Crown size={14} /> Upgrade to Pro to ask follow-up questions
                </Link>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
