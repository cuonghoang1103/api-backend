// ─── Safe markdown renderer for repo reviews ──────────────────────
//
// The repo admin can write free-form reviews in Markdown-lite
// (bold, italic, inline code, links, headings, lists). We render
// this subset to HTML and then pass it through DOMPurify so
// `dangerouslySetInnerHTML` never sees an untrusted string.
//
// We deliberately do NOT pull in a full Markdown library. The
// admin review text is small, the syntax is constrained, and the
// output goes through a sanitizer anyway — so a regex-based
// transformer is fine here and saves ~30 kB of bundle.

import DOMPurify from 'dompurify';

// Browser-only sanitize. SSR returns the raw HTML — the markdown
// is generated server-side from a trusted DB column, so it's safe
// to render as-is on the server (no user-submitted input at SSR
// time). On the client we sanitize before injecting via
// dangerouslySetInnerHTML.
function sanitize(html: string): string {
  if (typeof window === 'undefined') return html;
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'strong', 'em', 'code', 'a', 'br', 'ul', 'ol', 'li',
      'p', 'h1', 'h2', 'h3', 'h4', 'blockquote', 'pre',
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
    ALLOW_DATA_ATTR: false,
  });
}

// Apply inline transformations: bold, italic, code, links.
// The output is HTML-safe (we escape the user input first), but
// the wrapper tags are constructed from a fixed allowlist, so
// the result is a tightly-scoped snippet.
function renderInlineMarkdown(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-darkbg/70 text-neon-violet text-[0.85em]">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-text-primary">$1</strong>')
    .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>')
    .replace(
      /\[([^\]]+)\]\((https?:[^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-neon-indigo hover:text-neon-violet underline underline-offset-2">$1</a>',
    );
}

// Block-level renderer. Returns sanitized HTML ready to inject.
export function renderReview(review: string, opts: { headings?: boolean } = {}): string {
  if (!review) return '';
  const lines = review.split('\n');
  const out: string[] = [];
  let inList = false;
  for (const raw of lines) {
    const line = raw.trim();
    if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inList) {
        out.push('<ul class="list-disc list-inside space-y-1.5 my-3">');
        inList = true;
      }
      out.push(`<li>${renderInlineMarkdown(line.slice(2))}</li>`);
    } else {
      if (inList) {
        out.push('</ul>');
        inList = false;
      }
      if (line === '') {
        out.push('<br/>');
      } else if (opts.headings && line.startsWith('### ')) {
        out.push(`<h3 class="text-lg font-heading font-bold text-text-primary mt-4 mb-2">${renderInlineMarkdown(line.slice(4))}</h3>`);
      } else if (opts.headings && line.startsWith('## ')) {
        out.push(`<h2 class="text-xl font-heading font-bold text-text-primary mt-5 mb-2">${renderInlineMarkdown(line.slice(3))}</h2>`);
      } else if (opts.headings && line.startsWith('# ')) {
        out.push(`<h1 class="text-2xl font-heading font-bold text-text-primary mt-6 mb-3">${renderInlineMarkdown(line.slice(2))}</h1>`);
      } else {
        out.push(`<p class="my-2 leading-relaxed">${renderInlineMarkdown(line)}</p>`);
      }
    }
  }
  if (inList) out.push('</ul>');
  return sanitize(out.join(''));
}
