/**
 * deepdive-seed.mjs — publish ONE long-form Deep Dive guide into
 * `TechTrendArticle` from a spec file in `content/deepdives/`.
 * ─────────────────────────────────────────────────────────────────────────────
 * Deep Dives are the tutorials linked from the home page's Deep Dives strip
 * (`frontend/src/components/home/landing/deepDivesData.ts`). They deliberately
 * live in the tech-trends table instead of getting their own Next route: that
 * table already has a public `[slug]` page with SSR, JSON-LD, RSS, a sidebar
 * TOC and comments. A separate route would mean re-implementing all of it and
 * then watching the two copies drift.
 *
 *   node scripts/deepdive-seed.mjs --file ./content/deepdives/<slug>.mjs --dry
 *   node scripts/deepdive-seed.mjs --file ./content/deepdives/<slug>.mjs --apply
 *
 * PURE DATA — no LLM anywhere in this path. Idempotent: the article is keyed by
 * `slug`, so re-running re-authors the body in place. Deliberately preserved
 * across re-runs:
 *   • `viewCount`     — re-authoring a guide must not reset its read counter
 *   • `publishedAt`   — the original publish date, not "whenever we last
 *                        fixed a typo". Only set on the first publish.
 *   • comments        — they key on articleId, which never changes
 *   • `authorId`      — kept unless the spec/flag names a different author
 *
 * SPEC SHAPE (default-exported object):
 *   {
 *     slug: 'how-to-use-the-command-line-in-linux-and-macos',
 *     title: 'How to Use the Command Line in Linux and macOS',
 *     summary: 'One paragraph. Shown on cards and in <meta description>.',
 *     category: 'DeepDive',          // optional, defaults to DeepDive
 *     tags: ['cli', 'bash', 'macos'],
 *     coverEmoji: '⌨️',
 *     coverImageUrl: '/deepdives/command-line/cover.svg',   // optional
 *     readTimeMin: 32,
 *     isFeatured: true,              // optional
 *     trendingScore: 70,             // optional
 *     status: 'PUBLISHED',           // or DRAFT
 *     bodyMdx: `# heading …`,        // the guide itself, Markdown
 *   }
 *
 * WHY THE RENDERER COMES FROM dist/
 * The public page reads the cached `bodyHtml` column and nothing else — no
 * markdown parser runs on a read. So the seeder has to produce byte-identical
 * HTML to what the admin route would produce, which means calling the SAME
 * renderer (`src/services/techTrendsRenderer.service.ts`) rather than a second
 * copy of a marked pipeline that would slowly drift out of step. This file is
 * .mjs, so it imports the compiled `dist/` build of that service. Run
 * `npm run build` first if dist is missing or stale — the seeder says so
 * loudly instead of silently rendering with an old sanitiser.
 */
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const val = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };
const APPLY = has('--apply');
const FILE = val('--file');
const AUTHOR = val('--author');
const ROOT = path.resolve(import.meta.dirname, '..');

if (!FILE) {
  console.error('cần --file ./content/deepdives/<slug>.mjs');
  process.exit(1);
}

/* ── The shared renderer, from the compiled build ──────────────────────────
   A missing dist is the single most likely way to run this script wrong, so
   it gets a real error message rather than a bare MODULE_NOT_FOUND. A stale
   dist only gets a warning: the renderer changes rarely, and blocking a
   content seed because an unrelated service was edited would be worse. */
const RENDERER_SRC = path.join(ROOT, 'src/services/techTrendsRenderer.service.ts');
const RENDERER_DIST = path.join(ROOT, 'dist/services/techTrendsRenderer.service.js');
if (!fs.existsSync(RENDERER_DIST)) {
  console.error(`  ✗ thiếu ${path.relative(ROOT, RENDERER_DIST)} — chạy \`npm run build\` trước.`);
  console.error('    (seeder phải dùng ĐÚNG renderer của backend để bodyHtml khớp với admin route)');
  process.exit(1);
}
if (fs.existsSync(RENDERER_SRC) && fs.statSync(RENDERER_SRC).mtimeMs > fs.statSync(RENDERER_DIST).mtimeMs) {
  console.warn('  ⚠ dist/techTrendsRenderer cũ hơn src/ — cân nhắc `npm run build` để HTML khớp backend.');
}
const { renderArticle } = await import(pathToFileURL(RENDERER_DIST).href);

const spec = (await import(pathToFileURL(path.resolve(FILE)).href)).default;

/* ── Guards ────────────────────────────────────────────────────────────────
   Everything here is a mistake we can catch in a second, versus a bad row we
   would only notice when a reader hits a blank page or a dead image. */
const problems = [];
const warnings = [];

const need = (field) => { if (!spec?.[field]) problems.push(`thiếu \`${field}\``); };
['slug', 'title', 'summary', 'bodyMdx'].forEach(need);

const slug = String(spec.slug ?? '');
if (slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  problems.push(`slug "${slug}" phải là kebab-case a-z0-9 (nó là URL công khai)`);
}

/* summary is what lands in <meta description> and on the card — VarChar-free
   (it's Text) but a 500-char blurb wrecks the card layout. */
const summary = String(spec.summary ?? '');
if (summary.length > 400) warnings.push(`summary ${summary.length} ký tự — thẻ trên trang danh sách sẽ bị tràn (nên < 300)`);

/* The admin editor route rejects bodyMdx over 100KB (MAX_BODY_MDX in
   src/routes/techTrends.routes.ts). The seeder writes through Prisma so it
   would happily exceed that — and then the article could never be edited in
   the admin UI again without truncation. Fail instead. */
const MAX_BODY_MDX = 100 * 1024;
const bodyMdx = String(spec.bodyMdx ?? '');
if (bodyMdx.length > MAX_BODY_MDX) {
  problems.push(`bodyMdx ${bodyMdx.length} ký tự > ${MAX_BODY_MDX} — admin route sẽ không sửa được bài này nữa (MAX_BODY_MDX)`);
}

const CATEGORIES = ['TechNews', 'FixBug', 'Experience', 'Interviews', 'DeepDive'];
const category = String(spec.category ?? 'DeepDive');
if (!CATEGORIES.includes(category)) problems.push(`category "${category}" không thuộc ${CATEGORIES.join(', ')}`);

const status = String(spec.status ?? 'PUBLISHED');
if (!['DRAFT', 'PUBLISHED'].includes(status)) problems.push(`status "${status}" phải là DRAFT hoặc PUBLISHED`);

/* ── Render, then look at what came out ───────────────────────────────────*/
const { html, toc } = renderArticle(bodyMdx);
if (bodyMdx.trim() && !html.trim()) problems.push('render ra HTML rỗng — sanitizer đã ăn hết nội dung?');
if (bodyMdx.trim() && toc.length === 0) warnings.push('không có heading h1-h3 nào → sidebar TOC trống');

/* Images must exist under frontend/public. The site's CSP is
   `img-src 'self' data:`, so a remote URL is not merely a broken link — it is
   blocked outright. Checking here is the difference between a 404 the reader
   sees and a message we see now.

   BUT: this same script runs inside the backend container during deploy
   (deploy.sh Step 3.15), and Dockerfile.backend copies only content/, scripts/,
   src/, dist/ and data/ — there is no frontend/ in there. Treating a missing
   frontend/public as "image not found" would fail every production deploy on a
   file that is perfectly fine on disk. So the check runs where the tree exists
   (a dev machine, where you are authoring and can fix it) and announces that it
   skipped otherwise. */
const imgSrcs = [...html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)].map((m) => m[1]);
const localImgs = imgSrcs.filter((s) => s.startsWith('/'));
const PUBLIC_DIR = path.join(ROOT, 'frontend/public');
const canCheckImages = fs.existsSync(PUBLIC_DIR);
if (!canCheckImages && localImgs.length) {
  console.log(`   (bỏ qua kiểm ảnh: không có frontend/public ở đây — bình thường khi chạy trong container backend)`);
}
if (canCheckImages) {
  for (const src of [...new Set(localImgs)]) {
    const onDisk = path.join(PUBLIC_DIR, src.split('?')[0]);
    if (!fs.existsSync(onDisk)) problems.push(`ảnh không có trên đĩa: ${src} (tìm ở frontend/public${src})`);
  }
}
for (const src of imgSrcs.filter((s) => /^https?:/i.test(s))) {
  problems.push(`ảnh ngoài site bị CSP chặn (img-src 'self'): ${src} — tải về frontend/public/ rồi trỏ đường dẫn tương đối`);
}
if (canCheckImages && spec.coverImageUrl && String(spec.coverImageUrl).startsWith('/')) {
  const cover = path.join(PUBLIC_DIR, String(spec.coverImageUrl).split('?')[0]);
  if (!fs.existsSync(cover)) problems.push(`coverImageUrl không có trên đĩa: ${spec.coverImageUrl}`);
}

/* Internal links: a Deep Dive earns its keep partly by pointing at the parts
   of the site that already teach the topic (Code Lab, Exp Hub, courses). A
   typo'd internal path is a dead end, and nothing else in the pipeline looks
   at it. We can't resolve dynamic Next routes from here, so this is a warning
   listing them for eyeball review, not a hard failure. */
const internalLinks = [...new Set([...html.matchAll(/<a\b[^>]*\bhref="(\/[^"#]*)"/g)].map((m) => m[1]))];

const words = bodyMdx.replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(Boolean).length;
const codeBlocks = (bodyMdx.match(/^```/gm) ?? []).length / 2;
const readTimeMin = Number(spec.readTimeMin) || Math.max(1, Math.round(words / 200));

console.log(`── deepdive-seed ${slug || '(no slug)'} : ${APPLY ? 'APPLY' : 'DRY'} ──`);
console.log(`   ${words.toLocaleString('en-US')} từ (không tính code) · ${codeBlocks} khối code · ${toc.length} heading · bodyMdx ${(bodyMdx.length / 1024).toFixed(1)}KB · đọc ~${readTimeMin}′`);
console.log(`   ảnh cục bộ: ${localImgs.length ? [...new Set(localImgs)].join(', ') : '(không có)'}`);
console.log(`   link nội bộ: ${internalLinks.length ? internalLinks.join(', ') : '(không có)'}`);

for (const w of warnings) console.warn(`  ⚠ ${w}`);
if (problems.length) {
  for (const p of problems) console.error(`  ✗ ${p}`);
  await prisma.$disconnect();
  process.exit(1);
}

/* ── Author ────────────────────────────────────────────────────────────────
   The public page shows an author byline, and "CuongThai" is the fallback when
   authorId is null — acceptable, but a real user row also gives the avatar and
   bio. Resolve by --author username, else the first admin, else leave null. */
async function resolveAuthorId(existingId) {
  if (AUTHOR) {
    const u = await prisma.user.findFirst({ where: { username: AUTHOR }, select: { id: true } });
    if (!u) {
      console.error(`  ✗ --author ${AUTHOR}: không có user nào tên vậy`);
      process.exit(1);
    }
    return u.id;
  }
  if (existingId) return existingId;      // don't steal an article from its author
  // Roles live in the `user_roles` join table, not a column on User — the
  // obvious `where: { role: 'ADMIN' }` compiles to nothing and silently
  // returns the first user in the table, which is not the same thing.
  const admin = await prisma.user.findFirst({
    where: { roles: { some: { role: { name: { in: ['ROLE_ADMIN', 'ADMIN'] } } } } },
    orderBy: { id: 'asc' },
    select: { id: true, username: true },
  });
  if (admin) return admin.id;
  console.warn('  ⚠ không tìm thấy admin — để authorId null, trang sẽ hiện "CuongThai"');
  return null;
}

const existing = await prisma.techTrendArticle.findUnique({
  where: { slug },
  select: { id: true, authorId: true, publishedAt: true, viewCount: true, status: true },
});

const authorId = await resolveAuthorId(existing?.authorId ?? null);

const data = {
  title: String(spec.title).slice(0, 255),
  summary,
  // Legacy paragraph column is NOT NULL and predates bodyMdx. Readers prefer
  // bodyHtml when it exists, so this is only a floor: if the rich body ever
  // came back empty the page still shows the summary instead of nothing.
  body: [summary],
  bodyMdx,
  bodyHtml: html,
  toc,
  category,
  coverEmoji: spec.coverEmoji ? String(spec.coverEmoji).slice(0, 16) : null,
  coverImageUrl: spec.coverImageUrl ? String(spec.coverImageUrl).slice(0, 500) : null,
  tags: Array.isArray(spec.tags) ? spec.tags.map(String) : [],
  trendingScore: Number.isFinite(spec.trendingScore) ? Number(spec.trendingScore) : 60,
  isFeatured: Boolean(spec.isFeatured),
  status,
  readTimeMin,
  kind: 'ARTICLE',
  aiGenerated: false,
  authorId,
};

if (!APPLY) {
  console.log(existing
    ? `   DRY: sẽ CẬP NHẬT bài #${existing.id} (giữ viewCount ${existing.viewCount}, publishedAt ${existing.publishedAt?.toISOString() ?? 'null'})`
    : '   DRY: sẽ TẠO MỚI bài này');
  console.log('   chạy lại với --apply để ghi.');
  await prisma.$disconnect();
  process.exit(0);
}

/* First publish stamps publishedAt; later re-runs keep the original date.
   A guide that gets a correction three months later is not new content, and
   re-stamping it would jump it back to the top of the feed. */
const publishedAt = status === 'PUBLISHED' ? (existing?.publishedAt ?? new Date()) : (existing?.publishedAt ?? null);

const saved = existing
  ? await prisma.techTrendArticle.update({ where: { id: existing.id }, data: { ...data, publishedAt } })
  : await prisma.techTrendArticle.create({ data: { ...data, slug, publishedAt } });

/* Read back rather than trusting the write: bodyHtml is the only thing the
   public page renders, and a silently-empty column looks exactly like a
   successful seed from the log alone. */
const check = await prisma.techTrendArticle.findUnique({
  where: { id: saved.id },
  select: { bodyHtml: true, toc: true, status: true, slug: true },
});
const htmlLen = check?.bodyHtml?.length ?? 0;
const tocLen = Array.isArray(check?.toc) ? check.toc.length : 0;
if (htmlLen < 500 || tocLen === 0) {
  console.error(`  ✗ đọc lại thấy sai: bodyHtml ${htmlLen} ký tự, toc ${tocLen} mục`);
  await prisma.$disconnect();
  process.exit(1);
}

console.log(`  ✓ ${existing ? 'cập nhật' : 'tạo'} bài #${saved.id} · ${check.status} · bodyHtml ${(htmlLen / 1024).toFixed(1)}KB · toc ${tocLen} mục`);
console.log(`    /tech-trends/${check.slug}`);
console.log('Done.');
await prisma.$disconnect();
