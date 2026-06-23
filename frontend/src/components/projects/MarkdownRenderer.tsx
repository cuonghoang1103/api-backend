'use client';

// Re-export of the shared Markdown renderer.
// The renderer uses the same plugin chain as the backend
// (remark-gfm + remark-breaks + rehype-raw + rehype-pretty-code)
// so the admin live preview matches the public page.
export { default } from '@/components/markdown/Markdown';
