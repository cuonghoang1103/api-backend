// Per-tag landing page: /repos/tag/ai, /repos/tag/cli, …
//
// WHY A SEPARATE PAGE INSTEAD OF REUSING THE FEED
// The feed's tag filter lives in client state, so its URL never changes and
// Google only ever sees the unfiltered list. A crawlable page per tag gives
// each topic its own title, description and JSON-LD — someone searching
// "repo AI tieng Viet" can land straight on the AI shelf.
//
// This route renders server-side and does NOT mount ReposFeedClient: that
// component re-fetches from its own (empty) filter state on mount, which
// would immediately overwrite the tag-filtered list with everything.
//
// The static `tag` segment wins over the sibling `[id]` dynamic segment in
// Next's matcher, so /repos/tag/ai never resolves as a repo id.

import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { Star, GitFork, ArrowLeft, Tag as TagIcon } from 'lucide-react'
import { getServerApiBaseUrl } from '@/lib/server-api'
import { languageBadgeClasses, formatStars, describeActivity, activityBadgeClasses } from '@/lib/repos'
import type { GithubRepo, GithubRepoTag } from '@/lib/api'

export const dynamic = 'force-dynamic'
const CACHE_TTL_SECONDS = 300

interface PageProps {
  params: { slug: string }
}

async function fetchJson<T>(path: string, cookie: string): Promise<T | null> {
  try {
    const res = await fetch(`${getServerApiBaseUrl()}${path}`, {
      headers: { cookie, accept: 'application/json' },
      next: { revalidate: CACHE_TTL_SECONDS },
    })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

async function loadTag(slug: string, cookie: string) {
  const tags = await fetchJson<{ data: GithubRepoTag[] }>('/api/v1/repos/tags', cookie)
  return tags?.data?.find((t) => t.slug === slug) ?? null
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const cookie = headers().get('cookie') ?? ''
  const tag = await loadTag(params.slug, cookie)
  if (!tag) return { title: 'Tag khong ton tai | CuongThai' }

  const title = `Repo ${tag.name} dang chu y — GitHub Repo Hub`
  const description =
    `Tuyen chon repo GitHub ve ${tag.name}${tag.count ? ` (${tag.count} repo)` : ''}, ` +
    'moi repo kem bai danh gia tieng Viet: dung vao viec gi, bat dau tu dau, luu y gi.'
  return {
    title: `${title} | CuongThai`,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://cuongthai.com/repos/tag/${params.slug}`,
      images: ['/opengraph-image'],
    },
    alternates: { canonical: `https://cuongthai.com/repos/tag/${params.slug}` },
  }
}

export default async function RepoTagPage({ params }: PageProps) {
  const cookie = headers().get('cookie') ?? ''
  const tag = await loadTag(params.slug, cookie)
  if (!tag) notFound()

  const list = await fetchJson<{ items: GithubRepo[]; total: number }>(
    `/api/v1/repos?tagSlug=${encodeURIComponent(params.slug)}&pageSize=50&sort=most-stars`,
    cookie,
  )
  const items = list?.items ?? []

  // JSON-LD so the shelf can surface as a rich result rather than a bare link.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Repo GitHub ve ${tag.name}`,
    numberOfItems: items.length,
    itemListElement: items.slice(0, 30).map((r, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://cuongthai.com/repos/${r.id}`,
      name: `${r.owner}/${r.repoName}`,
    })),
  }

  return (
    <div className="min-h-screen bg-darkbg px-4 py-10 md:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-6xl">
        <Link
          href="/repos"
          className="mb-6 inline-flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-neon-violet"
        >
          <ArrowLeft className="h-4 w-4" />
          Tat ca repo
        </Link>

        <header className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-neon-violet/40 bg-neon-violet/10 px-3 py-1 text-xs uppercase tracking-wider text-neon-violet">
            <TagIcon className="h-3 w-3" />
            {tag.name}
          </div>
          <h1 className="font-heading text-3xl font-bold text-text-primary md:text-4xl">
            Repo ve {tag.name}
          </h1>
          <p className="mt-2 text-text-secondary">
            <span className="font-mono font-semibold text-text-primary">{items.length}</span> repo
            {' '}tuyen chon, moi repo kem bai danh gia rieng.
          </p>
        </header>

        {items.length === 0 ? (
          <p className="rounded-2xl border border-darkborder bg-darkcard/40 p-8 text-center text-text-muted">
            Chua co repo nao gan tag nay.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {items.map((repo) => (
              <Link
                key={repo.id}
                href={`/repos/${repo.id}`}
                className="group rounded-2xl border border-darkborder bg-darkcard/40 p-5 transition-colors hover:border-neon-violet/40"
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate font-heading text-lg font-semibold text-text-primary group-hover:text-neon-violet">
                      {repo.repoName}
                    </h2>
                    <p className="truncate text-xs text-text-muted">@{repo.owner}</p>
                  </div>
                  {repo.language && (
                    <span
                      className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] ${languageBadgeClasses(repo.language)}`}
                    >
                      {repo.language}
                    </span>
                  )}
                </div>

                {repo.description && (
                  <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-text-secondary">
                    {repo.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="inline-flex items-center gap-1 rounded-full border border-darkborder bg-darkbg/60 px-2 py-0.5 text-yellow-300">
                    <Star className="h-3 w-3 fill-yellow-400" />
                    <span className="font-mono">{formatStars(repo.stars)}</span>
                  </span>
                  {repo.forks > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-darkborder bg-darkbg/60 px-2 py-0.5 text-text-muted">
                      <GitFork className="h-3 w-3" />
                      <span className="font-mono">{formatStars(repo.forks)}</span>
                    </span>
                  )}
                  {repo.pushedAt && (
                    <span className={`rounded-full border px-2 py-0.5 ${activityBadgeClasses(repo.pushedAt)}`}>
                      {describeActivity(repo.pushedAt)}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
