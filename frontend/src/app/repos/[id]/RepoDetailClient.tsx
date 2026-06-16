'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft, ExternalLink, Github, Star, Calendar, Code2, Tag as TagIcon,
  Share2, Copy, Check, Sparkles, Eye,
} from 'lucide-react';
import { toast } from 'sonner';
import ParticleBackground from '@/components/repos/ParticleBackground';
import type { GithubRepo } from '@/lib/api';

// ─── Language → color map ─────────────────────────────────────────
// Same map as the feed so the badge stays consistent across pages.
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  JavaScript: 'bg-yellow-500/20 text-yellow-200 border-yellow-500/30',
  Python: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  Go: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  Rust: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  Java: 'bg-red-500/20 text-red-300 border-red-500/30',
  Kotlin: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  Swift: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  'C++': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  C: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  'C#': 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  PHP: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  Ruby: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  Shell: 'bg-lime-500/20 text-lime-300 border-lime-500/30',
  HTML: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  CSS: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  Dart: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  Vue: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
};

function languageBadge(lang: string | null): string {
  if (!lang) return 'bg-darkcard text-text-muted border-darkborder';
  return LANGUAGE_COLORS[lang] || 'bg-neon-violet/15 text-neon-violet border-neon-violet/30';
}

function formatStars(n: number): string {
  if (n < 1000) return n.toString();
  if (n < 1_000_000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('vi-VN', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  } catch {
    return '';
  }
}

// ─── Tiny inline markdown renderer ───────────────────────────────
// Same subset as the feed: bold, italic, inline code, links,
// line breaks, and bulleted lists. Keeping it inline avoids
// pulling in a full markdown lib for the admin review text.
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

function renderReview(review: string): string {
  if (!review) return '';
  const lines = review.split('\n');
  const out: string[] = [];
  let inList = false;
  for (const raw of lines) {
    const line = raw.trim();
    if (line.startsWith('- ')) {
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
      } else if (line.startsWith('## ')) {
        out.push(`<h2 class="text-xl font-heading font-bold text-text-primary mt-5 mb-2">${renderInlineMarkdown(line.slice(3))}</h2>`);
      } else if (line.startsWith('# ')) {
        out.push(`<h1 class="text-2xl font-heading font-bold text-text-primary mt-6 mb-3">${renderInlineMarkdown(line.slice(2))}</h1>`);
      } else {
        out.push(`<p class="my-2 leading-relaxed">${renderInlineMarkdown(line)}</p>`);
      }
    }
  }
  if (inList) out.push('</ul>');
  return out.join('');
}

interface Props {
  repo: GithubRepo;
  related: GithubRepo[];
}

export default function RepoDetailClient({ repo, related }: Props) {
  const [copied, setCopied] = useState(false);

  const fullUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/repos/${repo.id}`;
  }, [repo.id]);

  const copyLink = useCallback(async () => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      toast.error('Trinh duyet khong ho tro copy');
      return;
    }
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      toast.success('Da copy link');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Copy that bai');
    }
  }, [fullUrl]);

  return (
    <div className="relative min-h-screen bg-darkbg text-text-primary pt-24 pb-20">
      <ParticleBackground density="high" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/repos"
          className="mb-6 inline-flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lai GitHub Repo Hub
        </Link>

        {/* Header card */}
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-darkborder/50 bg-gradient-to-br from-darkcard/80 to-darkcard/40 p-8 backdrop-blur-xl"
        >
          {/* Decorative gradient blur */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-neon-violet/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-neon-indigo/10 blur-3xl" />

          <div className="relative">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-neon-violet/30 bg-neon-violet/10 px-3 py-1 text-[10px] uppercase tracking-wider text-neon-violet">
              <Sparkles className="h-3 w-3" />
              GitHub Repo Hub
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <h1 className="break-words font-heading text-3xl font-bold leading-tight text-text-primary md:text-4xl">
                  {repo.repoName}
                </h1>
                <p className="mt-1 text-text-muted">@{repo.owner}</p>
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-neon-violet/40 bg-neon-violet/10 px-4 py-2 text-sm font-medium text-neon-violet transition-colors hover:bg-neon-violet/20"
                >
                  <Github className="h-4 w-4" />
                  Mo tren GitHub
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <button
                  onClick={copyLink}
                  className="inline-flex items-center gap-2 rounded-xl border border-darkborder bg-darkcard/60 px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-neon-violet/40 hover:text-text-primary"
                  title="Copy link"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4" />}
                  {copied ? 'Da copy' : 'Chia se'}
                </button>
              </div>
            </div>

            {/* Stats row */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {repo.language && (
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${languageBadge(repo.language)}`}
                >
                  <Code2 className="h-3 w-3" />
                  {repo.language}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 rounded-full border border-darkborder bg-darkbg/60 px-3 py-1 text-xs text-yellow-300">
                <Star className="h-3 w-3 fill-yellow-400" />
                <span className="font-mono font-semibold">{formatStars(repo.stars)}</span>
                <span className="text-text-muted">stars</span>
              </span>
              {repo.createdAt && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-darkborder bg-darkbg/60 px-3 py-1 text-xs text-text-muted">
                  <Calendar className="h-3 w-3" />
                  {formatDate(repo.createdAt)}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 rounded-full border border-darkborder bg-darkbg/60 px-3 py-1 text-xs text-text-muted">
                <Eye className="h-3 w-3" />
                Trang chi tiet
              </span>
            </div>

            {/* Tags */}
            {repo.tags && repo.tags.length > 0 && (
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <TagIcon className="h-3.5 w-3.5 text-text-muted" />
                {repo.tags.map((t) => (
                  <span
                    key={t.id}
                    className="rounded-full border border-darkborder bg-darkbg/60 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-text-muted"
                  >
                    #{t.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.header>

        {/* Description (GitHub's own) */}
        {repo.description && (
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8"
          >
            <h2 className="mb-3 font-heading text-lg font-semibold text-text-primary">
              Mo ta tren GitHub
            </h2>
            <p className="rounded-2xl border border-darkborder/50 bg-darkcard/40 p-5 text-base leading-relaxed text-text-secondary">
              {repo.description}
            </p>
          </motion.section>
        )}

        {/* myReview */}
        {repo.myReview && (
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8"
          >
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-neon-violet" />
              <h2 className="font-heading text-lg font-semibold text-text-primary">
                Bai hoc &amp; danh gia
              </h2>
            </div>
            <div
              className="rich-content rounded-2xl border border-neon-violet/20 bg-gradient-to-br from-neon-violet/[0.04] to-neon-indigo/[0.04] p-6 text-[15px] leading-relaxed text-text-secondary"
              dangerouslySetInnerHTML={{ __html: renderReview(repo.myReview) }}
            />
          </motion.section>
        )}

        {/* Related repos */}
        {related.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12"
          >
            <h2 className="mb-4 font-heading text-lg font-semibold text-text-primary">
              Repo khac trong kho
            </h2>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {related.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/repos/${r.id}`}
                    className="group block h-full rounded-2xl border border-darkborder/50 bg-darkcard/40 p-4 transition-all hover:-translate-y-0.5 hover:border-neon-violet/40 hover:shadow-[0_8px_32px_-12px_rgba(167,139,250,0.4)]"
                  >
                    <div className="mb-2 flex items-start gap-2">
                      <Github className="mt-0.5 h-4 w-4 shrink-0 text-text-secondary group-hover:text-text-primary" />
                      <h3 className="truncate font-heading text-sm font-semibold text-text-primary group-hover:text-neon-violet">
                        {r.repoName}
                      </h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-text-muted">
                      <span>@{r.owner}</span>
                      {r.language && (
                        <span className={`rounded-full border px-2 py-0.5 ${languageBadge(r.language)}`}>
                          {r.language}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 text-yellow-300">
                        <Star className="h-3 w-3 fill-yellow-400" />
                        {formatStars(r.stars)}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.section>
        )}

        {/* CTA at the bottom */}
        <div className="mt-10 text-center">
          <Link
            href="/repos"
            className="inline-flex items-center gap-2 rounded-xl border border-darkborder bg-darkcard/60 px-5 py-2.5 text-sm text-text-secondary transition-colors hover:border-neon-violet/40 hover:text-text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Xem tat ca repo
          </Link>
        </div>
      </div>
    </div>
  );
}
