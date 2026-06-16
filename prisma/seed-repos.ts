// ─── Seed script: GitHub Repo Hub ────────────────────────────────
//
// Populates the `github_repos` table with a curated set of
// repos from the admin's GitHub profile. The set is hand-
// chosen — these are repos the admin is publicly proud of and
// wants to surface in the portfolio. The script is idempotent
// (upsert on `url`) so re-running won't create duplicates.
//
// Run with:  npx tsx prisma/seed-repos.ts
//
// Requires:
//   - DATABASE_URL (set in .env)
//   - GITHUB_API_TOKEN (optional but recommended — without it
//     GitHub limits us to 60 req/hr)

import { PrismaClient, GithubRepoStatus } from '@prisma/client';

const prisma = new PrismaClient();

interface SeedRepo {
  /** owner/name shorthand — easier to read in the seed file. */
  slug: string;
  /** Curated review. Markdown-lite (bold/italic/code/lists/headings). */
  review: string;
  /** Tag names to attach. Tags are auto-created on the fly. */
  tagNames: string[];
  /** Initial status. PUBLISHED = visible in the public feed. */
  status: GithubRepoStatus;
}

// ─── Curated set ─────────────────────────────────────────────────
//
// These are public repos the admin wants to feature. They span
// multiple languages + categories so the public feed has a
// diverse first paint. To add more, just append a new entry.
const REPOS: SeedRepo[] = [
  {
    slug: 'cuonghoang1103/api-backend',
    review: `## Mot du an production-ready

Day la monorepo backend chinh cua website portfolio + e-commerce cua toi. **Tech stack gom co**:

- NestJS + Express + TypeScript
- Prisma + PostgreSQL
- Redis cho cache + rate-limit
- WebSocket cho messaging thoi gian thuc
- Docker Compose de deploy

### Bai hoc rut ra

- **Rate limit nen dat o Nginx + app** - khong chi o mot cho. Dat ca hai giup giam tai cho backend.
- **Tach service + controller** - service chua business logic thuan, controller chi parse request. De test hon rat nhieu.
- **Prisma transaction quan trong** - mot so flow (tao repo + tag join) can transaction de tranh race condition.

Repo nay dang chay tren VPS that va xu ly traffic that, khong phai demo.`,
    tagNames: ['Backend', 'TypeScript', 'NestJS', 'Production', 'DevOps'],
    status: 'PUBLISHED',
  },
  {
    slug: 'cuonghoang1103/CuongHoangDev-V2',
    review: `## Frontend portfolio ca nhan

Next.js 14 + Tailwind + framer-motion. **Trang chinh**:

- Home - landing voi hero animation
- /repos - GitHub Repo Hub (trang dang xem)
- /shop - e-commerce demo
- /dashboard - personal dashboard voi task tracking + AI

### Diem nhan ky thuat

- **Server component cho SSR** - tang SEO + first paint
- **Client component cho interactive** - chat, dashboard
- **Middleware auth check** - khong phai check o tung page

Cai hay nhat la **tach biet server/client component** ro rang - ban dau toi hay mix, dan den hydration mismatch rat kho debug.`,
    tagNames: ['Frontend', 'NextJS', 'React', 'TypeScript', 'Tailwind'],
    status: 'PUBLISHED',
  },
  {
    slug: 'vercel/next.js',
    review: `## Framework toi dung hang ngay

Next.js la framework React production. Toi khong contribute code vao day (chua du level), nhung **hoc duoc rat nhieu** qua viec doc source:

### Pattern hay

- **App Router** - nested layout, server component, streaming
- **Turbopack** - Rust-based bundler, sieu nhanh
- **Image optimization** - tu dong gen srcset, lazy load

### Tai sao no tot cho production

- ISR (Incremental Static Regeneration) cho content it doi
- SSR cho SEO-critical pages
- API routes de viet backend mini
- Middleware cho auth/redirect/A/B test

Neu moi bat dau voi React, **hoc Next.js luon** thay vi CRA.`,
    tagNames: ['Frontend', 'NextJS', 'React', 'Open Source'],
    status: 'PUBLISHED',
  },
  {
    slug: 'prisma/prisma',
    review: `## ORM toi yeu thich nhat

Prisma la type-safe ORM cho Node.js. **Diem manh**:

- **Schema-driven** - mot file schema.prisma lam source of truth
- **Auto-generated types** - khong can viet type cho model
- **Migration tool** - tu generate SQL
- **Studio UI** - xem/sua data truc quan

### So sanh voi TypeORM/Sequelize

Prisma **nhanh hon** nhieu ve DX, dac biet voi complex relation. Nhuoc diem la query engine binary lam Docker image lon hon.

### Tip quan trong

Su dung select va include ro rang de tranh N+1. Luon bat query log trong dev de thay SQL dang chay.`,
    tagNames: ['Backend', 'Database', 'TypeScript', 'Open Source'],
    status: 'PUBLISHED',
  },
  {
    slug: 'tailwindlabs/tailwindcss',
    review: `## Utility-first CSS framework

TailwindCSS thay doi cach toi viet CSS. **Tu ghet den yeu** trong 1 tuan.

### Tai sao tot

- **Khong phai dat ten class** - flex items-center gap-4 la du
- **Design system thong nhat** - scale 4, 8, 12, 16... khong bi lan
- **JIT mode** - chi render class su dung, bundle nho
- **Responsive prefix** - md:flex lg:grid cuc ky de

### Khi nao KHONG nen dung

- Team khong quen utility class (giao tiep kho)
- Project rat nho (< 5 page) - CSS thuan la du
- Can customize CSS output (Tailwind generate nhieu class du)

Neu bi nang, thu **cai dat 1 ngay** voi 1 component. Se hieu.`,
    tagNames: ['Frontend', 'CSS', 'Design System', 'Open Source'],
    status: 'PUBLISHED',
  },
];

// ─── URL parsing (inline copy of the service so the seed script
//      is self-contained and doesn't pull in the compiled JS).
function parseRepoUrl(input: string): { owner: string; repoName: string; url: string } {
  const raw = input.trim();
  if (/^[\w.-]+\/[\w.-]+$/.test(raw)) {
    const [owner, repoName] = raw.split('/');
    return { owner, repoName, url: `https://github.com/${owner}/${repoName}` };
  }
  throw new Error(`Invalid slug: ${input}`);
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);
}

interface GitHubMetadata {
  owner: string;
  repoName: string;
  url: string;
  stars: number;
  language: string | null;
  description: string | null;
}

const GITHUB_TOKEN = process.env.GITHUB_API_TOKEN || '';

function githubHeaders(): Record<string, string> {
  const h: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'cuongthai-repo-hub-seed',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (GITHUB_TOKEN) h.Authorization = `Bearer ${GITHUB_TOKEN}`;
  return h;
}

async function withRetry<T>(fn: () => Promise<T>, label: string): Promise<T> {
  const retries = 3;
  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const msg = err instanceof Error ? err.message : String(err);
      // 404 / Not Found is permanent — don't waste retries.
      if (msg === 'GITHUB_API_NOT_FOUND') throw err;
      // Rate limit: cap retries (the backoff might be enough)
      // and bubble the original error so callers can decide
      // whether to skip the row.
      if (msg.startsWith('GITHUB_RATE_LIMIT_')) {
        // For seed runs we don't want to wait too long. After
        // the first rate-limit hit, abort — the rest of the
        // batch will also be rate-limited.
        console.warn(`[${label}] rate limit hit — aborting retry`);
        throw err;
      }
      if (attempt === retries) break;
      const delay = 1000 * 2 ** attempt + Math.random() * 250;
      console.warn(`[${label}] retry ${attempt + 1}/${retries} after ${Math.round(delay)}ms (${msg})`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastErr;
}

async function fetchRepoMetadata(owner: string, repoName: string): Promise<GitHubMetadata | null> {
  return withRetry(async () => {
    const url = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repoName)}`;
    const res = await fetch(url, { headers: githubHeaders() });
    if (res.status === 404) {
      throw new Error('GITHUB_API_NOT_FOUND');
    }
    if (res.status === 403 || res.status === 429) {
      throw new Error(`GITHUB_RATE_LIMIT_${res.status}`);
    }
    if (!res.ok) {
      throw new Error(`GITHUB_API_ERROR_${res.status}`);
    }
    const body = (await res.json()) as {
      full_name?: string;
      html_url?: string;
      stargazers_count?: number;
      language?: string | null;
      description?: string | null;
      owner?: { login?: string };
      name?: string;
    };
    return {
      owner: body.owner?.login || owner,
      repoName: body.name || repoName,
      url: body.html_url || `https://github.com/${owner}/${repoName}`,
      stars: body.stargazers_count ?? 0,
      language: body.language ?? null,
      description: body.description ?? null,
    };
  }, `${owner}/${repoName}`);
}

async function ensureTag(name: string): Promise<number> {
  const slug = slugify(name);
  const tag = await prisma.tag.upsert({
    where: { slug },
    create: { name, slug },
    update: {},
  });
  return tag.id;
}

async function seedOne(repo: SeedRepo): Promise<{ status: 'inserted' | 'updated' | 'skipped'; url: string }> {
  const { owner, repoName } = parseRepoUrl(repo.slug);
  let meta: GitHubMetadata | null;
  try {
    meta = await fetchRepoMetadata(owner, repoName);
  } catch (err) {
    // Don't let one bad / rate-limited repo kill the whole
    // seed run. Skip it and log the reason so the admin can
    // investigate later.
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[seed] ${repo.slug} error — skipping (${msg.slice(0, 80)})`);
    return { status: 'skipped', url: `https://github.com/${owner}/${repoName}` };
  }
  if (!meta) {
    console.warn(`[seed] ${repo.slug} not found on GitHub — skipping`);
    return { status: 'skipped', url: `https://github.com/${owner}/${repoName}` };
  }

  const tagIds = await Promise.all(repo.tagNames.map(ensureTag));

  const existing = await prisma.githubRepo.findUnique({ where: { url: meta.url } });
  await prisma.githubRepo.upsert({
    where: { url: meta.url },
    create: {
      repoName: meta.repoName,
      owner: meta.owner,
      url: meta.url,
      stars: meta.stars,
      language: meta.language,
      description: meta.description,
      myReview: repo.review,
      status: repo.status,
      tags: { create: tagIds.map((tagId) => ({ tagId })) },
    },
    update: {
      // Only refresh live metadata. Don't overwrite the admin's
      // review text or status — re-running the seed is idempotent.
      stars: meta.stars,
      language: meta.language,
      description: meta.description,
    },
  });

  return { status: existing ? 'updated' : 'inserted', url: meta.url };
}

async function main(): Promise<void> {
  console.log('🌱 Seeding GitHub Repo Hub...');
  console.log(`  GitHub token: ${GITHUB_TOKEN ? 'yes (5k req/hr)' : 'no (60 req/hr — set GITHUB_API_TOKEN)'}`);

  let inserted = 0;
  let updated = 0;
  let skipped = 0;
  for (const r of REPOS) {
    const result = await seedOne(r);
    if (result.status === 'inserted') inserted += 1;
    else if (result.status === 'updated') updated += 1;
    else skipped += 1;
    console.log(`  ${result.status === 'skipped' ? '⏭' : '✓'} ${r.slug}`);
    // Polite pause to stay under the 60/hr anonymous limit.
    // 5 seconds × 5 repos = 25 sec total, well under the limit.
    if (!GITHUB_TOKEN) {
      await new Promise((res) => setTimeout(res, 5000));
    }
  }

  console.log(`\n📊 Inserted: ${inserted} | Updated: ${updated} | Skipped: ${skipped}`);
  console.log('\n✅ Done.');
}

main()
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
