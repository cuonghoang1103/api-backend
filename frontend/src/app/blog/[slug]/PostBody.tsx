'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * Markdown body for a resource post.
 *
 * Client-side because react-markdown v9 uses hooks and cannot render in a
 * server component. Styled with `.tech-prose` — the same typography as the
 * article pages, so the two systems now read as one blog rather than as two
 * codebases that happen to share a domain.
 */
export default function PostBody({ markdown }: { markdown: string }) {
  return (
    <div className="tech-prose !max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  );
}
