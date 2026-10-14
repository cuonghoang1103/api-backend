'use client';

/**
 * Code Lab — full-text search results.
 * Lọc độ khó (14/10/2026): API `/code-lab/search` đã nhận `difficulty` sẵn ⇒ lọc
 * PHÍA MÁY CHỦ (đếm `total` đúng theo bộ lọc), tham số nằm trên URL `?difficulty=`.
 */
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Search, Loader2 } from 'lucide-react';
import { codeLabApi } from '@/lib/code-lab-api';
import type { CodeDifficulty, CodeExercise } from '@/types/code-lab';
import { DIFF_ORDER, DIFF_UI } from '@/lib/codelabUi';
import { DifficultyChip } from '@/components/code-lab/ProblemCard';

function Results() {
  const sp = useSearchParams();
  const q = sp.get('q') || '';
  const router = useRouter();
  const pathname = usePathname();
  const rawDiff = (sp.get('difficulty') || '').toUpperCase();
  const difficulty = (DIFF_ORDER as string[]).includes(rawDiff) ? (rawDiff as CodeDifficulty) : undefined;
  const pickDiff = (d?: CodeDifficulty) => {
    const next = new URLSearchParams(sp.toString());
    if (d) next.set('difficulty', d); else next.delete('difficulty');
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };
  const [items, setItems] = useState<CodeExercise[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!q.trim()) { setItems([]); setLoading(false); return; }
    setLoading(true);
    codeLabApi.search({ q, limit: 40, difficulty })
      .then((res) => { setItems(res.data.data.exercises || []); setTotal(res.data.data.total || 0); })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [q, difficulty]);

  return (
    <div className="cl-root mx-auto max-w-3xl px-4 pb-10 pt-20" style={{ color: 'var(--text-primary)' }}>
      <Link href="/code-lab" className="mb-4 inline-flex items-center gap-1.5 text-sm transition-colors hover:opacity-80" style={{ color: 'var(--text-muted)' }}>
        <ArrowLeft size={15} /> Code Lab
      </Link>
      <div className="cl-hero cl-in mb-6 p-5 sm:p-6">
        <div className="cl-eyebrow mb-2">Search results</div>
        <h1 className="cl-display flex items-center gap-2.5 text-2xl">
          <Search size={22} style={{ color: 'var(--cl-accent)' }} /> “{q}”
        </h1>
        <p className="mt-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
          {loading ? 'Searching…' : `${total} result${total === 1 ? '' : 's'} found`}
        </p>
      </div>

      <div className="cl-filterbar mb-4" role="group" aria-label="Lọc theo độ khó">
        <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Độ khó</span>
        <button type="button" className="cl-fpill" data-on={!difficulty ? 'true' : undefined} onClick={() => pickDiff(undefined)}>Tất cả</button>
        {DIFF_ORDER.filter((d) => d !== 'EXPERT').map((d) => (
          <button key={d} type="button" className="cl-fpill" data-on={difficulty === d ? 'true' : undefined} onClick={() => pickDiff(d)}
            style={difficulty === d ? { background: DIFF_UI[d].bg, color: DIFF_UI[d].color, borderColor: DIFF_UI[d].border } : undefined}>
            {DIFF_UI[d].label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="cl-skel" style={{ height: 62 }} />)}</div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border py-16 text-center text-sm" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>No exercises matched.</div>
      ) : (
        <ul className="space-y-2.5">
          {items.map((ex, i) => (
            <li key={ex.id} className="cl-in" style={{ animationDelay: `${Math.min(i, 10) * 0.04}s` }}>
              <Link href={`/code-lab/${ex.track?.slug || ''}/${ex.slug}`} className="group flex items-center gap-3 rounded-xl border p-3.5 transition-all hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--cl-accent)_45%,var(--border-color))]" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold transition-colors group-hover:text-[var(--cl-accent)]" style={{ color: 'var(--text-primary)' }}>{ex.title}</div>
                  <div className="mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>{ex.track?.name} · {ex.language}</div>
                </div>
                <DifficultyChip difficulty={ex.difficulty} small />
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
