'use client';

// DocBlocksView — the single source of truth for rendering a category's AI
// reference-doc blocks. Used BOTH on the public category page (CategoryDoc) and
// in the admin editor's live preview, so what an admin previews is exactly what
// visitors see. Reuses CodeViewer (code + mermaid) and the shared sanitizeHtml.

import { ExternalLink, Dumbbell, ArrowRight } from 'lucide-react';
import type { DocBlock, DocLang } from '@/types/exp-hub';
import { sanitizeHtml } from '@/lib/sanitizeHtml';
import { CodeViewer } from './CodeViewer';

// Stable DOM id for the Nth block's heading — the middle-column TOC scrolls to
// these, so the id MUST match between the sidebar list and the rendered doc.
export function docHeadingId(index: number): string {
  return `exp-doc-h-${index}`;
}

// The doc's section headings (with their block index) — used to build the
// sub-section navigation ("mục con") in the middle column.
export function docHeadings(blocks: DocBlock[], lang: DocLang = 'en'): Array<{ id: string; text: string }> {
  const out: Array<{ id: string; text: string }> = [];
  blocks.forEach((b, i) => {
    if (b.type !== 'heading') return;
    const text = (lang === 'vi' && b.textVi) || b.text;
    if (text.trim()) out.push({ id: docHeadingId(i), text });
  });
  return out;
}

export function DocBlocksView({ blocks, lang = 'en' }: { blocks: DocBlock[]; lang?: DocLang }) {
  return (
    <div className="space-y-4">
      {blocks.map((b, i) => (
        <DocBlockView key={i} block={b} index={i} lang={lang} />
      ))}
    </div>
  );
}

export function DocBlockView({ block, index, lang = 'en' }: { block: DocBlock; index?: number; lang?: DocLang }) {
  // Per-field fallback: a block translated only in part still renders, with the
  // untranslated fields staying English rather than disappearing.
  const vi = lang === 'vi';
  switch (block.type) {
    case 'part':
      // A full-width banner. The point is that you cannot scroll past it without
      // noticing you have entered a new part of the lesson.
      return (
        <section
          id={index != null ? `doc-part-${index}` : undefined}
          className="mt-10 scroll-mt-24 overflow-hidden rounded-xl border first:mt-0"
          style={{ borderColor: 'var(--accent-color, #8b5cf6)', background: 'color-mix(in srgb, var(--accent-color, #8b5cf6) 10%, transparent)' }}
        >
          <div className="flex items-center gap-3 px-4 py-3">
            {block.number && (
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold"
                style={{ background: 'var(--accent-color, #8b5cf6)', color: '#fff' }}
              >
                {block.number}
              </span>
            )}
            <div className="min-w-0">
              <h2 className="text-base font-bold leading-tight text-[var(--text-primary)]">
                {(vi && block.textVi) || block.text}
              </h2>
              {((vi && block.subtitleVi) || block.subtitle) && (
                <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                  {(vi && block.subtitleVi) || block.subtitle}
                </p>
              )}
            </div>
          </div>
        </section>
      );
    case 'practice':
      // "Go and drill this" — deliberately louder than a plain link list.
      return (
        <div
          className="rounded-xl border p-3"
          style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)' }}
        >
          <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[var(--text-secondary)]">
            <Dumbbell size={13} />
            {vi ? 'Luyện thêm ở Java Core' : 'Practise this in Java Core'}
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {block.items.map((it, j) => (
              <a
                key={j}
                href={it.url}
                target={it.url.startsWith('http') ? '_blank' : undefined}
                rel={it.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors"
                style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-[var(--text-primary)]">
                    {(vi && it.labelVi) || it.label}
                  </span>
                  {((vi && it.noteVi) || it.note) && (
                    <span className="block truncate text-[11px] text-[var(--text-secondary)]">
                      {(vi && it.noteVi) || it.note}
                    </span>
                  )}
                </span>
                <ArrowRight size={15} className="shrink-0 text-[var(--accent-color)] transition-transform group-hover:translate-x-0.5" />
              </a>
            ))}
          </div>
        </div>
      );
    case 'heading':
      return (
        <h3
          id={index != null ? docHeadingId(index) : undefined}
          className="mt-1 scroll-mt-24 text-base font-bold text-[var(--text-primary)]"
        >
          {(vi && block.textVi) || block.text}
        </h3>
      );
    case 'prose':
      return (
        <div
          // `min-w-0` is load-bearing: without it a flex/grid child sizes to its
          // widest content, so a long line escapes the card instead of scrolling.
          // `pre` and `table` then need their own scroll container — prose HTML can
          // contain a terminal transcript or a comparison table far wider than the
          // column, and neither was handled before (long javac/stack-trace lines ran
          // straight off the page).
          className="exp-doc-prose min-w-0 text-sm leading-relaxed text-[var(--text-secondary)] [&_a]:text-[var(--accent-color)] [&_a]:underline [&_code]:rounded [&_code]:bg-[var(--bg-surface-active)] [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[0.85em] [&_li]:my-1 [&_li]:ml-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-2 [&_pre]:my-3 [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-[var(--bg-surface-active)] [&_pre]:p-3 [&_pre]:text-[0.85em] [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_strong]:text-[var(--text-primary)] [&_table]:my-3 [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto [&_td]:border [&_td]:border-white/10 [&_td]:px-2 [&_td]:py-1 [&_th]:border [&_th]:border-white/10 [&_th]:px-2 [&_th]:py-1 [&_th]:text-left [&_ul]:list-disc [&_ul]:pl-5"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml((vi && block.htmlVi) || block.html) }}
        />
      );
    case 'code':
      return (
        <CodeViewer
          code={(vi && block.codeVi) || block.code}
          language={block.language}
          filename={(vi && block.titleVi) || block.title}
          showLineNumbers={false}
          maxHeight="440px"
        />
      );
    case 'mermaid':
      return <CodeViewer code={(vi && block.codeVi) || block.code} language="mermaid" />;
    case 'image':
      return (
        <figure className="my-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={block.url} alt={block.caption || ''} className="max-w-full rounded-lg border border-[var(--border-color)]" />
          {((vi && block.captionVi) || block.caption) && (
            <figcaption className="mt-1 text-center text-xs text-[var(--text-secondary)]">
              {(vi && block.captionVi) || block.caption}
            </figcaption>
          )}
        </figure>
      );
    case 'links':
      return (
        <div className="grid gap-2 sm:grid-cols-2">
          {block.items.map((it, j) => (
            <a
              key={j}
              href={it.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2 transition-colors hover:border-[var(--accent-color)]"
            >
              <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-color)]" />
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-color)]">{(vi && it.labelVi) || it.label}</span>
                {((vi && it.noteVi) || it.note) && (
                  <span className="block text-xs text-[var(--text-secondary)]">{(vi && it.noteVi) || it.note}</span>
                )}
                <span className="block truncate text-[11px] text-[var(--text-secondary)] opacity-70">{it.url}</span>
              </span>
            </a>
          ))}
        </div>
      );
    default:
      return null;
  }
}
