'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft, ExternalLink, Github, Star, Calendar, Code2, Tag as TagIcon,
  Share2, Copy, Check, Sparkles, GitFork, Eye, Clock, GitBranch,
} from 'lucide-react';
import { toast } from 'sonner';
import ParticleBackground from '@/components/repos/ParticleBackground';
import { languageBadgeClasses, formatStars } from '@/lib/repos';
import { renderReview } from '@/lib/markdown';
import type { GithubRepo } from '@/lib/api';

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

// Build a GitHub avatar URL. The avatars CDN serves 404s gracefully
// (returns the default monster), so this is safe to render even
// when we don't know if the user exists.
function ownerAvatarUrl(owner: string, size: number = 80): string {
  return `https://github.com/${owner}.png?size=${size}`;
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

  // Whether the review was updated after creation.
  const wasUpdated =
    repo.updatedAt && repo.createdAt &&
    Math.abs(+new Date(repo.updatedAt) - +new Date(repo.createdAt)) > 1000;

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
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-neon-violet/30 bg-neon-violet/10 px-3 py-1 text-[10px] uppercase tracking-wider text-neon-violet">
              <Sparkles className="h-3 w-3" />
              GitHub Repo Hub
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 flex-1 items-start gap-4">
                {/* Owner avatar */}
                <div className="shrink-0">
                  <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-darkborder bg-darkbg/60 ring-1 ring-neon-violet/20">
                    {/* Use a plain img tag (not next/image) because the
                        GitHub avatar URL is on a third-party domain and
                        we don't want to fight the next/image config
                        for a 56px cosmetic asset. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={ownerAvatarUrl(repo.owner)}
                      alt={repo.owner}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <h1 className="break-words font-heading text-3xl font-bold leading-tight text-text-primary md:text-4xl">
                    {repo.repoName}
                  </h1>
                  <p className="mt-1 flex items-center gap-1.5 text-text-muted">
                    <Github className="h-3.5 w-3.5" />
                    <span>@{repo.owner}</span>
                  </p>
                </div>
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
            <div className="mt-6 flex flex-wrap items-center gap-2">
              {repo.language && (
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${languageBadgeClasses(repo.language)}`}
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
              <span className="inline-flex items-center gap-1.5 rounded-full border border-darkborder bg-darkbg/60 px-3 py-1 text-xs text-text-muted">
                <GitBranch className="h-3 w-3" />
                <span className="font-mono font-semibold text-text-secondary">{formatStars(0)}</span>
                <span>fork</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-darkborder bg-darkbg/60 px-3 py-1 text-xs text-text-muted">
                <GitFork className="h-3 w-3" />
                <span className="font-mono font-semibold text-text-secondary">v0.1</span>
              </span>
              {repo.createdAt && (
                <span
                  className="inline-flex items-center gap-1.5 rounded-full border border-darkborder bg-darkbg/60 px-3 py-1 text-xs text-text-muted"
                  title="Ngay them vao kho"
                >
                  <Calendar className="h-3 w-3" />
                  {formatDate(repo.createdAt)}
                </span>
              )}
              {wasUpdated && repo.updatedAt && (
                <span
                  className="inline-flex items-center gap-1.5 rounded-full border border-neon-indigo/30 bg-neon-indigo/10 px-3 py-1 text-xs text-neon-indigo"
                  title="Cap nhat lan cuoi"
                >
                  <Clock className="h-3 w-3" />
                  Updated {formatDate(repo.updatedAt)}
                </span>
              )}
              <span
                className="inline-flex items-center gap-1.5 rounded-full border border-darkborder bg-darkbg/60 px-3 py-1 text-xs text-text-muted"
                title="Trang thai"
              >
                <Eye className="h-3 w-3" />
                {repo.status === 'PUBLISHED' ? 'Da xuat ban' : 'Ban nhap'}
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
              dangerouslySetInnerHTML={{ __html: renderReview(repo.myReview, { headings: true }) }}
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
            <div className="mb-4 flex items-center gap-2">
              <h2 className="font-heading text-lg font-semibold text-text-primary">
                Repo khac trong kho
              </h2>
              <span className="rounded-full border border-darkborder bg-darkcard/40 px-2 py-0.5 text-xs text-text-muted">
                {related.length}
              </span>
            </div>
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
                    {r.description && (
                      <p className="mb-2 line-clamp-2 text-xs leading-relaxed text-text-muted">
                        {r.description}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-text-muted">
                      <span>@{r.owner}</span>
                      {r.language && (
                        <span className={`rounded-full border px-2 py-0.5 ${languageBadgeClasses(r.language)}`}>
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
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/repos"
            className="inline-flex items-center gap-2 rounded-xl border border-darkborder bg-darkcard/60 px-5 py-2.5 text-sm text-text-secondary transition-colors hover:border-neon-violet/40 hover:text-text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Xem tat ca repo
          </Link>
          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-neon-violet/40 bg-neon-violet/10 px-5 py-2.5 text-sm font-medium text-neon-violet transition-colors hover:bg-neon-violet/20"
          >
            <Github className="h-4 w-4" />
            Star tren GitHub
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
