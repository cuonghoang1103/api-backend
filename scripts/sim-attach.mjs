#!/usr/bin/env node
/**
 * Gắn video mô phỏng vào bài giảng.
 * ================================
 *
 * Nhận bản kê `manifest.json` do `sim-render.mjs` sinh ra rồi làm hai việc:
 *
 *   1. `--upload`  Tải mp4 lên R2 ở khoá `videos/courses/<khoá>/<slug>.mp4`.
 *                  PHẢI chạy TRONG container backend — nơi có `@aws-sdk` và
 *                  biến môi trường R2_* (giống `course-cover.mjs`).
 *   2. `--patch`   Chèn trường `video: { url, platform, durationSeconds }`
 *                  vào đúng bài trong `content/courses/<khoá>/*.mjs`, để lần
 *                  seed sau video đi kèm giáo trình thay vì phải sửa tay
 *                  trong cơ sở dữ liệu (và biến mất ở lần seed kế tiếp).
 *
 * Hai việc tách rời có chủ ý: `--patch` chạy được ở máy local mà không cần
 * khoá R2, còn `--upload` chạy trong container mà không cần cây mã nguồn.
 *
 * CÁCH DÙNG
 *   node scripts/sim-attach.mjs --manifest _render/manifest.json --patch
 *   node scripts/sim-attach.mjs --manifest _render/manifest.json --upload
 *   node scripts/sim-attach.mjs --manifest _render/manifest.json --patch --dry
 */

import fs from 'node:fs';
import path from 'node:path';

const argv = process.argv.slice(2);
const flag = (name) => argv.includes(name);
const value = (name, fallback = null) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};

const MANIFEST = path.resolve(value('--manifest', '_render/manifest.json'));
const CONTENT_DIR = path.resolve(value('--content', 'content/courses'));
const MEDIA_BASE = value('--media-base', 'https://media.cuongthai.com');
const DRY = flag('--dry');
const DO_UPLOAD = flag('--upload');
const DO_PATCH = flag('--patch');

if (!DO_UPLOAD && !DO_PATCH) {
  console.error('Cần --upload và/hoặc --patch. Xem đầu file để biết cách dùng.');
  process.exit(1);
}
if (!fs.existsSync(MANIFEST)) {
  console.error(`Không thấy bản kê: ${MANIFEST}`);
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
const videos = (manifest.videos ?? []).filter((v) => v.lesson);
const skipped = (manifest.videos ?? []).length - videos.length;
if (skipped > 0) {
  console.log(`ⓘ Bỏ qua ${skipped} video chưa khai \`lesson\` trong kịch bản — không biết gắn vào bài nào.`);
}

/** Khoá R2 của một video. Ổn định theo slug bài học, nên dựng lại là ghi đè. */
const keyFor = (v) => `videos/courses/${v.lesson.course}/${v.lesson.slug}.mp4`;
const urlFor = (v) => `${MEDIA_BASE}/${keyFor(v)}`;

/* ────────────────────────────────────────────────────────────
   1. TẢI LÊN R2
   ──────────────────────────────────────────────────────────── */

async function upload() {
  const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');

  const endpoint = process.env.R2_ENDPOINT;
  const bucket = process.env.R2_BUCKET_NAME || process.env.R2_BUCKET;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  if (!endpoint || !bucket || !accessKeyId || !secretAccessKey) {
    throw new Error('Thiếu biến môi trường R2_* — script này phải chạy TRONG container backend.');
  }

  const s3 = new S3Client({ region: 'auto', endpoint, credentials: { accessKeyId, secretAccessKey } });

  for (const v of videos) {
    const key = keyFor(v);
    const body = fs.readFileSync(v.file);
    console.log(`↑ ${key} (${(body.length / 1048576).toFixed(1)} MB)`);
    if (DRY) continue;
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: 'video/mp4',
        // Video dựng lại thì đổi nội dung ở CÙNG một khoá, nên không đặt
        // cache vĩnh viễn: một năm mà CDN giữ bản cũ thì bài giảng đứng im.
        CacheControl: 'public, max-age=86400',
      })
    );
  }
  console.log(`✓ Đã tải ${videos.length} video lên R2.`);
}

/* ────────────────────────────────────────────────────────────
   2. VÁ GIÁO TRÌNH
   ──────────────────────────────────────────────────────────── */

/**
 * Chèn (hoặc thay) trường `video:` ngay SAU dòng `slug: '<slug>',`.
 *
 * Neo vào dòng slug vì đó là mốc duy nhất chắc chắn: slug là khoá của bài
 * trong seeder, không trùng nhau, và luôn nằm ở đầu object bài học. Phân
 * tích cả file .mjs thành AST rồi in lại sẽ làm xáo trộn toàn bộ định dạng
 * của một file 130KB chỉ để thêm ba dòng.
 */
function patchFile(file, slug, block) {
  const src = fs.readFileSync(file, 'utf8');
  const anchor = new RegExp(`^(\\s*)slug: '${slug}',[ \\t]*$`, 'm');
  const m = src.match(anchor);
  if (!m) return null;

  const indent = m[1];
  const insertAt = m.index + m[0].length;
  const rest = src.slice(insertAt);

  // Đã có `video: { … },` ngay dưới slug thì thay, không chèn thêm cái thứ hai.
  const existing = rest.match(/^\n\s*video: \{[^}]*\},/);
  const tail = existing ? rest.slice(existing[0].length) : rest;

  const lines = block.map((l) => `${indent}${l}`).join('\n');
  return `${src.slice(0, insertAt)}\n${lines}${tail}`;
}

function patch() {
  let done = 0;
  let missing = 0;

  for (const v of videos) {
    const dir = path.join(CONTENT_DIR, v.lesson.course);
    if (!fs.existsSync(dir)) {
      console.error(`  ✗ không thấy thư mục giáo trình: ${dir}`);
      missing++;
      continue;
    }

    const block = [
      `video: { url: '${urlFor(v)}', platform: 'DIRECT', durationSeconds: ${v.durationSeconds} },`,
    ];

    let hit = false;
    for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.mjs'))) {
      const file = path.join(dir, f);
      const next = patchFile(file, v.lesson.slug, block);
      if (!next) continue;
      hit = true;
      console.log(`  ${DRY ? '·' : '✓'} ${path.relative(process.cwd(), file)} ← ${v.lesson.slug} (${v.durationSeconds}s)`);
      if (!DRY) fs.writeFileSync(file, next);
      done++;
      break;
    }
    if (!hit) {
      console.error(`  ✗ không tìm thấy bài có slug '${v.lesson.slug}' trong ${dir}`);
      missing++;
    }
  }

  console.log(`\n${DRY ? '(thử)' : '✓'} Vá ${done} bài, thiếu ${missing}.`);
  if (missing > 0) process.exitCode = 1;
}

/* ── Chạy ───────────────────────────────────────────────────── */

const main = async () => {
  console.log(`Bản kê: ${MANIFEST} — ${videos.length} video có bài học${DRY ? ' · CHẾ ĐỘ THỬ' : ''}\n`);
  if (DO_PATCH) patch();
  if (DO_UPLOAD) await upload();
};

main().catch((e) => {
  console.error('✗', e.message);
  process.exit(1);
});
