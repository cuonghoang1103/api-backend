'use client';

/**
 * ReaderTldr — a Pro-gated "tóm tắt nhanh" button. On click it asks the
 * backend to summarize the post's show-notes. Non-Pro / anonymous users see a
 * gentle upsell to /pro. Mirrors the Tech Trends ReaderAiTools pattern.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, Loader2, Crown } from 'lucide-react';
import { voiceApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export default function ReaderTldr({ slug }: { slug: string }) {
  const isAuthed = useAuthStore((s) => s.isAuthenticated);
  const [available, setAvailable] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tldr, setTldr] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthed) return;
    voiceApi.readerAiStatus()
      .then((r) => { setAvailable(r.data.data.available); setIsPro(r.data.data.isPro); })
      .catch(() => {});
  }, [isAuthed]);

  // Only render when the server actually has AI configured.
  if (!isAuthed || !available) return null;

  const run = async () => {
    if (!isPro) return;
    setLoading(true);
    setError(null);
    try {
      const r = await voiceApi.tldr(slug);
      setTldr(r.data.data.tldr);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không tạo được tóm tắt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-neon-violet/20 bg-neon-violet/5 p-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-sm font-semibold text-text-primary">
          <Sparkles className="w-4 h-4 text-neon-violet" /> Tóm tắt nhanh bằng AI
        </div>
        {isPro ? (
          <button
            onClick={run}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-neon-indigo to-neon-violet text-white text-xs font-semibold hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            {tldr ? 'Tạo lại' : 'Tạo tóm tắt'}
          </button>
        ) : (
          <Link href="/pro" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neon-orange/15 text-neon-orange text-xs font-semibold border border-neon-orange/30 hover:bg-neon-orange/20 transition-colors">
            <Crown className="w-3.5 h-3.5" /> Dành cho Pro
          </Link>
        )}
      </div>

      {error && <p className="mt-3 text-xs text-neon-red">{error}</p>}
      {tldr && tldr.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {tldr.map((t, i) => (
            <li key={i} className="flex gap-2 text-sm text-text-secondary">
              <span className="text-neon-violet shrink-0">•</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
