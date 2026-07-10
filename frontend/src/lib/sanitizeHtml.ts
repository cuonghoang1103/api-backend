import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize editor-/markdown-authored HTML before passing it to
 * dangerouslySetInnerHTML. This is our stored-XSS defence at the render
 * layer (P1-4 exp-hub notes/explanations, P1-5 tech-trends article body).
 *
 * DOMPurify's default HTML profile is deliberately permissive about
 * *content* and strict about *execution*: it keeps text formatting,
 * links, images (including `data:image/...` paste URIs), tables, lists
 * and code, while removing `<script>`, inline event handlers (onerror,
 * onclick, …), `javascript:` URIs and `<iframe>`. Nothing legitimate is
 * lost here — exp-hub embeds YouTube through a separate structured
 * `youtubeUrl` field (its own iframe), not inline in this HTML, and the
 * tech-trends body is markdown (no iframes). Heading `id`s (TOC anchors)
 * and link `rel`/`target` survive the default allow-list.
 *
 * `isomorphic-dompurify` is used so this is safe to import from client
 * components that may also be evaluated during SSR (it falls back to a
 * jsdom window on the server and native DOMPurify in the browser).
 */
export function sanitizeHtml(dirty: string | null | undefined): string {
  if (!dirty) return '';
  return DOMPurify.sanitize(dirty);
}
