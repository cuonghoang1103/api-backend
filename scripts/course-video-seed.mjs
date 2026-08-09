/**
 * course-video-seed.mjs — attach the curated YouTube track (and, later, the
 * VN/EN recordings) to a course's lessons from a small map file, WITHOUT
 * touching the big content/*.mjs lesson bodies.
 * ─────────────────────────────────────────────────────────────────────────────
 * Why a separate map instead of a `videos:` block per lesson: a course has
 * 100+ lessons spread over 20 files of ~45KB each. Video links rot, get
 * replaced, and need re-verifying in bulk — keeping them in one reviewable
 * table means a swap is a one-line edit and `verify-youtube-videos.mjs` can
 * check the whole course in one pass.
 *
 * PURE DATA — no LLM. Idempotent: a lesson is matched by (course slug, lesson
 * slug) and only its video columns are patched, so re-running never touches
 * lesson bodies, ids, or per-user progress.
 *
 *   node scripts/course-video-seed.mjs --file ./content/course-videos/nextjs.mjs
 *   node scripts/course-video-seed.mjs --file ./content/course-videos/nextjs.mjs --apply
 *   node scripts/course-video-seed.mjs --all --apply     # every map file
 *
 * MAP SHAPE (default export):
 *   {
 *     courseSlug: 'nextjs',
 *     // Optional: applied to every entry that doesn't set its own.
 *     defaultVideoTrack: 'YT',
 *     lessons: {
 *       '<lesson-slug>': {
 *         yt: 'dQw4w9WgXcQ' | 'https://youtu.be/dQw4w9WgXcQ',
 *         credit: 'Channel — Video title',
 *         vi?: { url, platform? },   // when the instructor's own recording lands
 *         en?: { url, platform? },
 *         defaultVideoTrack?: 'VI'|'EN'|'YT',
 *       },
 *     },
 *   }
 */
import { pathToFileURL } from 'node:url';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const val = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };
const APPLY = has('--apply');
const MAP_DIR = './content/course-videos';

const files = has('--all')
  ? readdirSync(MAP_DIR).filter((f) => f.endsWith('.mjs')).sort().map((f) => path.join(MAP_DIR, f))
  : [val('--file')].filter(Boolean);
if (!files.length) { console.error('cần --file <map.mjs> hoặc --all'); process.exit(1); }

const isYouTube = (url) => /(?:youtube\.com|youtu\.be)/i.test(String(url));

/** Accept a bare 11-char id or any YouTube URL; return the canonical short URL. */
function ytUrl(raw) {
  const s = String(raw || '').trim();
  if (!s) return null;
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return `https://youtu.be/${s}`;
  const m =
    s.match(/[?&]v=([A-Za-z0-9_-]{11})/) ||
    s.match(/youtu\.be\/([A-Za-z0-9_-]{11})/) ||
    s.match(/\/embed\/([A-Za-z0-9_-]{11})/) ||
    s.match(/\/shorts\/([A-Za-z0-9_-]{11})/);
  return m?.[1] ? `https://youtu.be/${m[1]}` : null;
}

let totalPatched = 0, totalMissing = 0, totalBad = 0;

for (const file of files) {
  const map = (await import(pathToFileURL(path.resolve(file)).href)).default;
  const cslug = map.courseSlug;
  console.log(`\n── course-video-seed ${cslug} (${path.basename(file)}) : ${APPLY ? 'APPLY' : 'DRY'} ──`);

  const course = await prisma.course.findUnique({ where: { slug: cslug }, select: { id: true } });
  if (!course) { console.error(`  ✗ chưa có khoá slug "${cslug}" — seed khoá trước.`); totalBad++; continue; }

  const rows = await prisma.lesson.findMany({
    where: { section: { courseId: course.id } },
    select: { id: true, slug: true, title: true },
  });
  const bySlug = new Map(rows.map((r) => [r.slug, r]));

  let patched = 0, missing = 0, bad = 0;
  for (const [lessonSlug, entry] of Object.entries(map.lessons || {})) {
    const lesson = bySlug.get(lessonSlug);
    if (!lesson) { console.warn(`  ? không thấy bài "${lessonSlug}"`); missing++; continue; }

    const yt = entry.yt ? ytUrl(entry.yt) : null;
    if (entry.yt && !yt) { console.error(`  ✗ ${lessonSlug}: link YouTube không hợp lệ "${entry.yt}"`); bad++; continue; }

    const data = {
      ...(yt ? { videoUrlYt: yt, videoYtCredit: entry.credit ?? null } : {}),
      ...(entry.vi?.url ? { videoUrlVi: entry.vi.url, videoPlatformVi: entry.vi.platform ?? (isYouTube(entry.vi.url) ? 'EMBED' : 'DIRECT') } : {}),
      ...(entry.en?.url ? { videoUrlEn: entry.en.url, videoPlatformEn: entry.en.platform ?? (isYouTube(entry.en.url) ? 'EMBED' : 'DIRECT') } : {}),
    };
    if (!Object.keys(data).length) continue;

    // Which track opens the lesson: the entry's own choice, else the map's,
    // else the instructor's own recording when present, else the YT lecture.
    const def = String(entry.defaultVideoTrack || map.defaultVideoTrack || (entry.vi?.url ? 'VI' : 'YT')).toUpperCase();
    data.defaultVideoTrack = ['VI', 'EN', 'YT'].includes(def) ? def : 'YT';

    // The legacy single-video columns follow the default track, so course
    // cards and any older reader resolve to the same video.
    const headline = data.defaultVideoTrack === 'VI' ? data.videoUrlVi
      : data.defaultVideoTrack === 'EN' ? data.videoUrlEn
        : data.videoUrlYt;
    const headlinePlatform = data.defaultVideoTrack === 'VI' ? data.videoPlatformVi
      : data.defaultVideoTrack === 'EN' ? data.videoPlatformEn
        : 'EMBED';

    console.log(`  ~ ${lessonSlug} → ${data.defaultVideoTrack} ${yt || headline || ''}`);
    if (APPLY) {
      await prisma.lessonDetail.upsert({
        where: { lessonId: lesson.id },
        create: { lessonId: lesson.id, videoPlatform: headlinePlatform || 'EMBED', videoUrl: headline ?? null, ...data },
        update: { ...data, ...(headline ? { videoUrl: headline, videoPlatform: headlinePlatform || 'EMBED' } : {}) },
      });
      if (headline) await prisma.lesson.update({ where: { id: lesson.id }, data: { videoUrl: headline } });
    }
    patched++;
  }

  console.log(`  · ${patched} bài gắn video · ${missing} không khớp slug · ${bad} link hỏng`);
  totalPatched += patched; totalMissing += missing; totalBad += bad;
}

console.log(`\nTổng: ${totalPatched} bài · ${totalMissing} thiếu · ${totalBad} lỗi. ${APPLY ? 'Done.' : 'Dry-run — thêm --apply.'}`);
await prisma.$disconnect();
if (totalBad > 0) process.exit(1);
