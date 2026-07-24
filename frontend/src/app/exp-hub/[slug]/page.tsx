import type { Metadata } from 'next';
import Link from 'next/link';
import { cache } from 'react';
import { notFound } from 'next/navigation';
import hljs from '@/components/exp-hub/hljsCore';
import { ArrowLeft, Github, Download, BookOpen, ExternalLink } from 'lucide-react';
import { getServerApiBaseUrl } from '@/lib/server-api';
import { sanitizeHtml } from '@/lib/sanitizeHtml';
import type { Snippet } from '@/types/exp-hub';
import { CopyButton } from '@/components/exp-hub/CopyButton';

/**
 * EXP_Hub — snippet/project detail page (SSR).
 *
 * The main /exp-hub view is a client app that ships an empty shell to
 * crawlers. This route server-renders one entry (by slug) into the initial
 * HTML so each snippet/project has a shareable permalink with real content,
 * a canonical URL, an OpenGraph card, JSON-LD, and server-highlighted code.
 */
export const dynamic = 'force-dynamic';

const SITE_URL = 'https://cuongthai.com';

interface PageProps { params: { slug: string }; searchParams?: { ref?: string; reflabel?: string } }

const HLJS_ALIASES: Record<string, string> = {
  js: 'javascript', ts: 'typescript', py: 'python', sh: 'bash', shell: 'bash',
  yml: 'yaml', 'c++': 'cpp', cs: 'csharp', golang: 'go', rs: 'rust',
  kt: 'kotlin', md: 'markdown', tf: 'terraform',
};

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function highlight(code: string, language: string): string {
  const lang = HLJS_ALIASES[(language || '').toLowerCase()] ?? (language || '').toLowerCase();
  try {
    if (lang && lang !== 'plaintext' && lang !== 'mermaid' && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang, ignoreIllegals: true }).value;
    }
  } catch { /* fall through */ }
  return escapeHtml(code);
}

const getSnippet = cache(async (slug: string): Promise<Snippet | null> => {
  try {
    const res = await fetch(
      `${getServerApiBaseUrl()}/api/v1/snippets/slug/${encodeURIComponent(slug)}`,
      { headers: { accept: 'application/json' }, cache: 'no-store' },
    );
    if (!res.ok) return null;
    const json = await res.json();
    return (json?.data as Snippet) ?? null;
  } catch {
    return null;
  }
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const s = await getSnippet(params.slug);
  if (!s) return { title: 'EXP_Hub | CuongThai' };
  const title = `${s.title} | EXP_Hub | CuongThai`;
  const description = (s.description || `${s.title} — lệnh, cài đặt & ghi chú tham khảo.`).slice(0, 200);
  const url = `${SITE_URL}/exp-hub/${params.slug}`;
  return {
    title,
    description,
    keywords: s.tags?.length ? s.tags.map((t) => t.name) : undefined,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'article' },
    twitter: { card: 'summary', title, description },
  };
}

export default async function ExpHubSnippetPage({ params, searchParams }: PageProps) {
  // "Back to course" — set when an Academy/Courses lesson links here with
  // ?ref=<internal path>&reflabel=<name>. Only internal paths are honoured.
  const backRef = searchParams?.ref || '';
  const backLabel = searchParams?.reflabel || 'khóa học';
  const showCourseBack = /^\/(?!\/)/.test(backRef);
  const s = await getSnippet(params.slug);
  if (!s) notFound();

  const blocks = (s.codeBlocks && s.codeBlocks.length > 0)
    ? s.codeBlocks
    : (s.code ? [{ name: 'Code', language: s.language, code: s.code }] : []);
  const isProject = s.kind === 'PROJECT' || !!s.repoUrl;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: s.title,
    description: s.description || undefined,
    programmingLanguage: s.language || undefined,
    codeRepository: s.repoUrl || undefined,
    url: `${SITE_URL}/exp-hub/${params.slug}`,
    dateCreated: s.createdAt,
    dateModified: s.updatedAt,
  };

  return (
    <div className="min-h-[calc(100dvh-var(--app-chrome-bottom))] bg-[var(--bg-primary)] pt-16 text-[var(--text-primary)] sm:pt-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mx-auto w-full max-w-3xl px-4 py-6">
        {/* Back to course (when arrived from an Academy/Courses lesson) */}
        {showCourseBack && (
          <Link
            href={backRef}
            className="mb-3 mr-2 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all hover:-translate-y-0.5"
            style={{
              borderColor: 'color-mix(in srgb, var(--accent-color) 45%, var(--border-color))',
              background: 'color-mix(in srgb, var(--accent-color) 10%, var(--bg-card))',
              color: 'var(--accent-color)',
            }}
          >
            <ArrowLeft className="h-4 w-4" /> Quay lại: <span style={{ color: 'var(--text-primary)' }}>{backLabel}</span>
          </Link>
        )}
        {/* Back to hub */}
        <Link href="/exp-hub" className="mb-5 inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
          <ArrowLeft className="h-4 w-4" /> EXP_Hub
        </Link>

        {/* Breadcrumb category */}
        {s.category && (
          <div className="mb-2 text-sm text-[var(--text-muted)]">{s.category.name}</div>
        )}

        {/* Title */}
        <div className="mb-2 flex flex-wrap items-center gap-2">
          {isProject && (
            <span className="inline-flex items-center gap-1 rounded-md bg-violet-500/15 px-2 py-0.5 text-xs font-semibold text-violet-500 dark:text-violet-300">
              <Github className="h-3.5 w-3.5" /> Project
            </span>
          )}
          <h1 className="text-2xl font-bold">{s.title}</h1>
        </div>
        {s.description && <p className="mb-5 text-[var(--text-secondary)]">{s.description}</p>}

        {/* GitHub repo */}
        {s.repoUrl && (
          <a href={s.repoUrl} target="_blank" rel="noopener noreferrer"
            className="mb-5 flex items-center gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-3.5 transition-colors hover:border-violet-400/50">
            <Github className="h-6 w-6 shrink-0" />
            <span className="min-w-0 flex-1 truncate text-sm font-semibold">{s.repoUrl.replace(/^https?:\/\//, '')}</span>
            <ExternalLink className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
          </a>
        )}

        {/* Tags */}
        {s.tags.length > 0 && (
          <div className="mb-5 flex flex-wrap gap-2">
            {s.tags.map((t) => (
              <span key={t.id} className="rounded border border-[var(--border-color)] bg-[var(--bg-surface)] px-2 py-1 text-xs text-[var(--text-secondary)]">{t.name}</span>
            ))}
          </div>
        )}

        {/* Code blocks — server-highlighted for SEO, client copy island */}
        {blocks.map((b, i) => (
          <div key={i} className="mb-5 overflow-hidden rounded-lg border border-white/10">
            <div className="flex items-center justify-between bg-[#252526] px-4 py-2">
              <span className="truncate text-xs font-medium text-slate-400">{b.name || (b.language || 'code').toUpperCase()}</span>
              <CopyButton snippetId={s.id} code={b.code} language={b.language} variant="icon" />
            </div>
            <div className="exphub-code-editor overflow-auto bg-[#1e1e1e]">
              <pre className="hljs m-0 p-4 text-[13px] leading-relaxed text-slate-200" style={{ background: 'transparent' }}>
                <code dangerouslySetInnerHTML={{ __html: highlight(b.code, b.language) }} />
              </pre>
            </div>
          </div>
        ))}

        {/* Attachments */}
        {s.attachments && s.attachments.length > 0 && (
          <div className="mb-5">
            <div className="mb-2 text-sm font-medium text-[var(--text-secondary)]">Tệp đính kèm</div>
            <div className="flex flex-col gap-2">
              {s.attachments.map((a) => (
                <a key={a.id} href={a.fileUrl} target="_blank" rel="noopener noreferrer" download={a.originalName}
                  className="flex items-center gap-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2 text-sm hover:bg-[var(--bg-surface-hover)]">
                  <Download className="h-4 w-4 shrink-0 text-violet-500" />
                  <span className="min-w-0 flex-1 truncate">{a.originalName}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Note */}
        {s.noteContent?.trim() && (
          <div className="rich-content prose mb-5 max-w-none dark:prose-invert prose-img:rounded-lg"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(s.noteContent) }} />
        )}

        {/* Explanation */}
        {s.explanation?.trim() && (
          <div className="rich-content prose mb-5 max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(s.explanation) }} />
        )}

        {/* Docs link (from category) */}
        {s.category?.docsUrl && (
          <a href={s.category.docsUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]">
            <BookOpen className="h-4 w-4" /> Tài liệu chính thức
          </a>
        )}

        <div className="mt-8 border-t border-[var(--border-color)] pt-5">
          <Link href="/exp-hub" className="text-sm text-violet-500 hover:underline dark:text-violet-300">
            ← Mở trong EXP_Hub
          </Link>
        </div>
      </div>
    </div>
  );
}
