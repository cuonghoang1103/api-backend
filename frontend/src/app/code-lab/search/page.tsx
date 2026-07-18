'use client';

/** Code Lab — full-text search results. */
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Search, Loader2 } from 'lucide-react';
import { codeLabApi } from '@/lib/code-lab-api';
import type { CodeExercise } from '@/types/code-lab';
import { DifficultyBadge } from '@/components/code-lab/shared';

function Results() {
  const sp = useSearchParams();
  const q = sp.get('q') || '';
  const [items, setItems] = useState<CodeExercise[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!q.trim()) { setItems([]); setLoading(false); return; }
    setLoading(true);
    codeLabApi.search({ q, limit: 40 })
      .then((res) => { setItems(res.data.data.exercises || []); setTotal(res.data.data.total || 0); })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <div className="mx-auto max-w-3xl px-4 pb-10 pt-20" style={{ color: 'var(--text-primary)' }}>
      <Link href="/code-lab" className="mb-4 inline-flex items-center gap-1 text-sm" style={{ color: 'var(--text-muted)' }}>
        <ArrowLeft size={15} /> Code Lab
      </Link>
      <h1 className="mb-1 flex items-center gap-2 text-xl font-bold"><Search size={18} /> Search</h1>
      <p className="mb-5 text-sm" style={{ color: 'var(--text-muted)' }}>
        {loading ? 'Searching…' : `${total} result${total === 1 ? '' : 's'} for "${q}"`}
      </p>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin" style={{ color: 'var(--text-muted)' }} /></div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border py-16 text-center text-sm" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>No exercises matched.</div>
      ) : (
        <ul className="space-y-2">
          {items.map((ex) => (
            <li key={ex.id}>
              <Link href={`/code-lab/${ex.track?.slug || ''}/${ex.slug}`} className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-[var(--bg-surface-hover)]" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium" style={{ color: 'var(--text-primary)' }}>{ex.title}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{ex.track?.name} · {ex.language}</div>
                </div>
                <DifficultyBadge difficulty={ex.difficulty} small />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function CodeLabSearchPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-24"><Loader2 className="animate-spin" style={{ color: 'var(--text-muted)' }} /></div>}>
      <Results />
    </Suspense>
  );
}
