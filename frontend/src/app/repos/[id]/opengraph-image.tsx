import { ImageResponse } from 'next/og'
import { getServerApiBaseUrl } from '@/lib/server-api'

// Per-repo Open Graph card (1200x630).
//
// Before this, sharing any repo link showed the site-wide image from
// app/opengraph-image.tsx — 118 different links, one identical preview. Next's
// file convention picks this up automatically for /repos/[id] and injects it
// into the page's metadata, so generateMetadata in page.tsx needs no change.
//
// Runtime is `nodejs`, NOT `edge` (which the site-wide card uses): this route
// fetches the backend over the internal Docker hostname, and the edge runtime
// is the wrong place to reach it. The site-wide card renders from constants,
// so it has no such constraint.
//
// TEXT IS DELIBERATELY UNACCENTED. Satori ships one default font; Vietnamese
// diacritics render as blank boxes unless font data is supplied per request.
// The rest of the /repos UI is already written this way, so it stays in step.

export const runtime = 'nodejs'
export const alt = 'GitHub Repo Hub — CuongThai'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

interface RepoCard {
  repoName: string
  owner: string
  stars: number
  forks: number
  language: string | null
  pushedAt: string | null
  tags: { name: string }[]
}

async function loadRepo(id: string): Promise<RepoCard | null> {
  try {
    const res = await fetch(`${getServerApiBaseUrl()}/api/v1/repos/${id}`, {
      headers: { accept: 'application/json' },
      next: { revalidate: 300 },
    })
    if (!res.ok) return null
    const json = await res.json()
    return json?.success && json.data ? (json.data as RepoCard) : null
  } catch {
    return null
  }
}

function compact(n: number): string {
  if (n < 1000) return String(n)
  if (n < 1_000_000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`
  return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
}

/** "Commit 3 thang truoc" — the freshness signal, unaccented for Satori. */
function activityLine(iso: string | null): string | null {
  if (!iso) return null
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return null
  const days = (Date.now() - then) / 86_400_000
  if (days < 7) return 'Commit trong tuan nay'
  if (days < 30) return `Commit ${Math.max(1, Math.round(days / 7))} tuan truoc`
  const months = days / 30.44
  if (months < 12) return `Commit ${Math.max(1, Math.round(months))} thang truoc`
  const years = months / 12
  return `Commit ${years < 2 ? 'hon 1' : Math.floor(years)} nam truoc`
}

export default async function Image({ params }: { params: { id: string } }) {
  const repo = await loadRepo(params.id)
  const title = repo?.repoName ?? 'GitHub Repo Hub'
  const owner = repo ? `@${repo.owner}` : 'cuongthai.com'
  const activity = repo ? activityLine(repo.pushedAt) : null
  // Long repo names have to shrink or they overflow the 1200px card.
  const titleSize = title.length > 26 ? 68 : title.length > 18 ? 84 : 104

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: 'linear-gradient(135deg, #0a0a14 0%, #1a0a2e 50%, #0a0a14 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            backgroundImage:
              'linear-gradient(135deg, rgba(139,92,246,0.14) 0%, transparent 45%, rgba(6,182,212,0.10) 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            display: 'flex',
            background: 'linear-gradient(90deg, #8b5cf6 0%, #6366f1 50%, #06b6d4 100%)',
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div
            style={{
              display: 'flex',
              alignSelf: 'flex-start',
              padding: '10px 22px',
              borderRadius: 999,
              border: '2px solid rgba(139,92,246,0.55)',
              color: '#c4b5fd',
              fontSize: 24,
              letterSpacing: 3,
            }}
          >
            GITHUB REPO HUB
          </div>
          <div style={{ display: 'flex', fontSize: titleSize, fontWeight: 700, lineHeight: 1.05 }}>
            {title}
          </div>
          <div style={{ display: 'flex', fontSize: 34, color: '#9ca3af' }}>{owner}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          {repo && (
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {repo.language && (
                <div style={chip('rgba(16,185,129,0.14)', '#6ee7b7')}>{repo.language}</div>
              )}
              <div style={chip('rgba(250,204,21,0.14)', '#fde68a')}>{compact(repo.stars)} stars</div>
              {repo.forks > 0 && (
                <div style={chip('rgba(255,255,255,0.07)', '#d1d5db')}>{compact(repo.forks)} fork</div>
              )}
              {activity && <div style={chip('rgba(99,102,241,0.16)', '#a5b4fc')}>{activity}</div>}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', gap: 12 }}>
              {(repo?.tags ?? []).slice(0, 3).map((t) => (
                <div
                  key={t.name}
                  style={{
                    display: 'flex',
                    padding: '8px 18px',
                    borderRadius: 999,
                    border: '1px solid rgba(255,255,255,0.16)',
                    color: '#9ca3af',
                    fontSize: 22,
                  }}
                >
                  #{t.name}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', fontSize: 26, color: '#8b5cf6' }}>cuongthai.com/repos</div>
          </div>
        </div>
      </div>
    ),
    size,
  )
}

function chip(bg: string, color: string) {
  return {
    display: 'flex',
    padding: '12px 26px',
    borderRadius: 999,
    background: bg,
    color,
    fontSize: 28,
    fontWeight: 600,
  } as const
}
