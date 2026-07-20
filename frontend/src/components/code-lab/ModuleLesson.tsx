'use client';

// ModuleLesson — the NTU-style long-form tutorial for a Code Lab module, shown
// (collapsible) at the top of the module's section on the roadmap page, above
// its exercises. The lesson block array is fetched ON DEMAND when expanded, and
// rendered with the SAME DocBlocksView used by Exp Hub docs (heading / prose /
// annotated code / mermaid / links).

import { useEffect, useState } from 'react';
import { BookOpenText, ChevronDown, Loader2 } from 'lucide-react';
import type { DocBlock, DocLang } from '@/types/exp-hub';
import { hasVietnamese, docParts } from '@/types/exp-hub';
import { codeLabApi } from '@/lib/code-lab-api';
import { DocBlocksView } from '@/components/exp-hub/DocBlocksView';

export function ModuleLesson({ moduleId, hasLesson, autoOpen }: { moduleId: number; hasLesson?: boolean; autoOpen?: boolean }) {
  const [open, setOpen] = useState(false);
  const [blocks, setBlocks] = useState<DocBlock[] | null>(null);
  const [loading, setLoading] = useState(false);
  // Reading language for a bilingual lesson. Persisted so the choice survives
  // moving between modules — a learner picks a language once, not per page.
  const [lang, setLang] = useState<DocLang>('en');

  // Arriving from a "practise this" deep link opens the lesson straight away.
  useEffect(() => {
    if (!autoOpen || open || !hasLesson) return;
    setOpen(true);
    if (blocks === null && !loading) {
      setLoading(true);
      codeLabApi.getLesson(moduleId)
        .then((res) => setBlocks((res.data.data.blocks as DocBlock[]) || []))
        .catch(() => setBlocks([]))
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoOpen, hasLesson]);

  useEffect(() => {
    const saved = window.localStorage.getItem('codelab.lessonLang');
    if (saved === 'vi' || saved === 'en') setLang(saved);
  }, []);

  const parts = blocks ? docParts(blocks, lang) : [];

  const pickLang = (next: DocLang) => {
    setLang(next);
    window.localStorage.setItem('codelab.lessonLang', next);
  };

  if (!hasLesson) return null;

  const toggle = async () => {
    const next = !open;
    setOpen(next);
    if (next && blocks === null && !loading) {
      setLoading(true);
      try {
        const res = await codeLabApi.getLesson(moduleId);
        setBlocks((res.data.data.blocks as DocBlock[]) || []);
      } catch {
        setBlocks([]);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="border-b" style={{ borderColor: 'var(--border-color)' }}>
      <button
        onClick={toggle}
        className="flex w-full items-center gap-2 px-4 py-2.5 text-left transition-colors hover:bg-[var(--bg-surface-hover)]"
      >
        <BookOpenText size={16} className="text-[var(--accent-color,#8b5cf6)]" style={{ color: 'var(--accent-color)' }} />
        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Lesson</span>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>— read before the exercises</span>
        <ChevronDown size={16} className={`ml-auto transition-transform ${open ? '' : '-rotate-90'}`} style={{ color: 'var(--text-muted)' }} />
      </button>
      {open && (
        <div className="px-4 pb-4">
          {loading ? (
            <div className="flex items-center gap-2 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>
              <Loader2 size={16} className="animate-spin" /> Loading lesson…
            </div>
          ) : blocks && blocks.length ? (
            <div className="mx-auto min-w-0 max-w-3xl">
              {hasVietnamese(blocks) && (
                <div className="mb-3 flex items-center gap-1.5">
                  <span className="mr-1 text-xs" style={{ color: 'var(--text-muted)' }}>Language</span>
                  {(['en', 'vi'] as const).map((code) => (
                    <button
                      key={code}
                      onClick={() => pickLang(code)}
                      aria-pressed={lang === code}
                      className="rounded-full px-3 py-1 text-xs font-semibold transition-colors"
                      style={lang === code
                        ? { background: 'var(--accent-color, #8b5cf6)', color: '#fff' }
                        : { background: 'var(--bg-surface)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}
                    >
                      {code === 'en' ? 'EN' : 'VN'}
                    </button>
                  ))}
                </div>
              )}
              {parts.length > 1 && (
                <nav
                  className="mb-4 rounded-xl border p-3"
                  style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)' }}
                >
                  <div className="mb-2 text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
                    {lang === 'vi' ? `Nội dung — ${parts.length} phần` : `Contents — ${parts.length} parts`}
                  </div>
                  <ol className="grid gap-1 sm:grid-cols-2">
                    {parts.map((pt) => (
                      <li key={pt.id}>
                        <a
                          href={`#${pt.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            document.getElementById(pt.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }}
                          className="flex items-start gap-2 rounded-lg px-2 py-1 text-sm transition-colors hover:bg-[var(--bg-surface-hover)]"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {pt.number && (
                            <span
                              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded text-[11px] font-bold"
                              style={{ background: 'var(--accent-color, #8b5cf6)', color: '#fff' }}
                            >
                              {pt.number}
                            </span>
                          )}
                          <span className="min-w-0">{pt.text}</span>
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              )}
              <DocBlocksView blocks={blocks} lang={lang} />
            </div>
          ) : (
            <p className="py-3 text-sm" style={{ color: 'var(--text-muted)' }}>No lesson content yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
