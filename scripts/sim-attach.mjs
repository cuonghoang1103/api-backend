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
const ACADEMY_DIR = path.resolve(value('--academy', 'content/academy'));
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
const all = manifest.videos ?? [];
const videos = all.filter((v) => v.lesson);
const skipped = all.length - videos.length;
if (skipped > 0) {
  console.log(`ⓘ Bỏ qua ${skipped} video chưa khai \`lesson\` trong kịch bản — không biết gắn vào bài nào.`);
}

/* ── Hai kiểu giáo trình, hai cách tìm file ────────────────────────────────
   • Khoá CuongThai: một THƯ MỤC `content/courses/<khoá>/` gồm nhiều file
     chương, phải quét từng file để tìm bài mang slug đó.
   • Môn Academy (`lesson.subject`): một FILE phẳng
     `content/academy/<MÃ MÔN>.mjs` chứa trọn môn — biết luôn đường dẫn.
   Trước đây chỉ hiểu kiểu thứ nhất, nên video của bài Academy bị bỏ qua. */

const isAcademy = (v) => Boolean(v.lesson.subject);

/** Những file .mjs có thể chứa bài học này, theo thứ tự ưu tiên. */
function contentFilesFor(v) {
  if (isAcademy(v)) {
    const file = path.resolve(ACADEMY_DIR, `${v.lesson.subject}.mjs`);
    return fs.existsSync(file) ? [file] : [];
  }
  const dir = path.join(CONTENT_DIR, v.lesson.course);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith('.mjs')).map((f) => path.join(dir, f));
}

/** Khoá R2 của một video. Ổn định theo slug bài học, nên dựng lại là ghi đè.
    Môn Academy đi vào nhánh `videos/academy/<MÃ MÔN>/` để không lẫn với
    khoá CuongThai — hai bên có thể trùng slug bài về sau.

    Bài dùng NHIỀU kịch bản (`simulations: [ … ]`) phải thêm đuôi id kịch bản:
    khoá chỉ theo slug bài thì hai ba video của cùng một bài ghi đè lẫn nhau,
    bài học cuối cùng chỉ còn một video và nó là cái tải lên sau cùng. */
const baseKeyFor = (v) => {
  const stem = isAcademy(v)
    ? `videos/academy/${v.lesson.subject}/${v.lesson.slug}`
    : `videos/courses/${v.lesson.course}/${v.lesson.slug}`;
  return v.multiScenario ? `${stem}--${v.scenarioId}` : stem;
};
const keyFor = (v) => `${baseKeyFor(v)}.mp4`;
const posterKeyFor = (v) => `${baseKeyFor(v)}.jpg`;
const urlFor = (v) => `${MEDIA_BASE}/${keyFor(v)}`;
const posterUrlFor = (v) => `${MEDIA_BASE}/${posterKeyFor(v)}`;

/* ────────────────────────────────────────────────────────────
   1. TẢI LÊN R2
   ──────────────────────────────────────────────────────────── */

async function upload() {
  const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');

  // Tên biến trên VPS là `R2_ENDPOINT_URL`; chấp nhận cả hai để script chạy
  // được ở mọi môi trường mà không phải nhớ biến thể nào đang dùng.
  const endpoint = process.env.R2_ENDPOINT_URL || process.env.R2_ENDPOINT;
  const bucket = process.env.R2_BUCKET_NAME || process.env.R2_BUCKET;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  if (!endpoint || !bucket || !accessKeyId || !secretAccessKey) {
    throw new Error(
      `Thiếu biến môi trường R2 — script này phải chạy TRONG container backend. ` +
        `Đang thấy: endpoint=${endpoint ? 'có' : 'THIẾU'} bucket=${bucket ? 'có' : 'THIẾU'} ` +
        `key=${accessKeyId ? 'có' : 'THIẾU'} secret=${secretAccessKey ? 'có' : 'THIẾU'}`
    );
  }

  const s3 = new S3Client({ region: 'auto', endpoint, credentials: { accessKeyId, secretAccessKey } });

  // Video dựng lại thì đổi nội dung ở CÙNG một khoá, nên không đặt cache
  // vĩnh viễn: một năm mà CDN giữ bản cũ thì bài giảng đứng im.
  const CACHE = 'public, max-age=86400';

  for (const v of videos) {
    const body = fs.readFileSync(v.file);
    console.log(`↑ ${keyFor(v)} (${(body.length / 1048576).toFixed(1)} MB)`);
    if (!DRY) {
      await s3.send(
        new PutObjectCommand({ Bucket: bucket, Key: keyFor(v), Body: body, ContentType: 'video/mp4', CacheControl: CACHE })
      );
    }
    if (v.poster && fs.existsSync(v.poster)) {
      const img = fs.readFileSync(v.poster);
      console.log(`↑ ${posterKeyFor(v)} (${(img.length / 1024).toFixed(0)} KB)`);
      if (!DRY) {
        await s3.send(
          new PutObjectCommand({ Bucket: bucket, Key: posterKeyFor(v), Body: img, ContentType: 'image/jpeg', CacheControl: CACHE })
        );
      }
    }
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
function patchFile(file, slug, block, scenarioId) {
  const src = fs.readFileSync(file, 'utf8');
  const anchor = new RegExp(`^(\\s*)slug: '${slug}',[ \\t]*$`, 'm');
  const m = src.match(anchor);
  if (!m) return null;

  const indent = m[1];
  const insertAt = m.index + m[0].length;
  const rest = src.slice(insertAt);

  // Bài dùng NHIỀU kịch bản khai bằng `simulations: [ … ]`: phải sửa ĐÚNG
  // phần tử mang `scenario: '<id>'`, không phải chèn thêm một `simulation:`
  // bên cạnh (sẽ ra hai khối cho cùng một video).
  if (/^\n\s*simulations: \[/.test(rest)) {
    const patched = patchArrayEntry(rest, scenarioId, indent, block);
    if (!patched) return 'MANUAL';
    return src.slice(0, insertAt) + patched;
  }

  // Đã có `simulation: { … },` ngay dưới slug thì thay, không chèn thêm cái
  // thứ hai. Khối trải nhiều dòng nên khớp tới dấu đóng thụt đúng cấp.
  const existing = rest.match(/^\n\s*simulation: \{[\s\S]*?\n\s*\},/);
  const tail = existing ? rest.slice(existing[0].length) : rest;

  const lines = block.map((l) => `${indent}${l}`).join('\n');
  return `${src.slice(0, insertAt)}\n${lines}${tail}`;
}

/**
 * Ghi `url` / `poster` / `durationSeconds` vào đúng phần tử của
 * `simulations: [ … ]`.
 *
 * Trả về `null` khi không tìm thấy phần tử — người gọi sẽ báo MANUAL thay vì
 * đoán bừa. Ba trường này được XOÁ trước rồi ghi lại, nên dựng lại video lần
 * hai không đẻ ra dòng trùng.
 */
function patchArrayEntry(rest, scenarioId, indent, block) {
  const open = rest.indexOf('simulations: [');
  if (open < 0 || !scenarioId) return null;
  const closeRe = new RegExp(`^${indent}\\],$`, 'm');
  const afterOpen = rest.slice(open);
  const closeAt = afterOpen.search(closeRe);
  if (closeAt < 0) return null;

  const arrayText = afterOpen.slice(0, closeAt);
  // Phần tử bắt đầu bằng `<indent>  {` và kết thúc bằng `<indent>  },`
  const entryRe = new RegExp(`^${indent}  \\{\\n([\\s\\S]*?)^${indent}  \\},$`, 'gm');
  let found = null;
  for (const m of arrayText.matchAll(entryRe)) {
    if (m[1].includes(`scenario: '${scenarioId}'`)) { found = m; break; }
  }
  if (!found) return null;

  // `block` là dạng `simulation: { … },` — lấy phần thân, bỏ dòng đầu/cuối.
  const body = block.slice(1, -1).map((l) => l.replace(/^ {2}/, ''));
  const keep = found[1]
    .split('\n')
    .filter((l) => !/^\s*(url|poster|durationSeconds):/.test(l));
  const media = body.filter((l) => /^(url|poster|durationSeconds):/.test(l.trim()))
    .map((l) => `${indent}    ${l.trim()}`);
  const newEntry = `${indent}  {\n${media.join('\n')}\n${keep.filter((l) => l.trim()).join('\n')}\n${indent}  },`;

  const newArray = arrayText.slice(0, found.index) + newEntry + arrayText.slice(found.index + found[0].length);
  return rest.slice(0, open) + newArray + afterOpen.slice(closeAt);
}

function patch() {
  let done = 0;
  let missing = 0;

  for (const v of videos) {
    const files = contentFilesFor(v);
    if (files.length === 0) {
      console.error(`  ✗ không thấy giáo trình cho ${isAcademy(v) ? `môn ${v.lesson.subject}` : `khoá ${v.lesson.course}`}`);
      missing++;
      continue;
    }

    // Ghi vào `simulation`, KHÔNG phải `video`.
    //
    // `video` là khung hình chính ở đầu bài — chỗ đó dành cho bài giảng do
    // chính người dạy quay (thường là link YouTube), phải để trống. Clip mô
    // phỏng thuộc về THÂN bài, và `course-seed.mjs` sẽ dựng thẻ <video> chèn
    // vào đúng chỗ trong cả hai vế song ngữ.
    const cap = v.name ?? {};
    const block = [
      'simulation: {',
      `  url: '${urlFor(v)}',`,
      `  poster: '${posterUrlFor(v)}',`,
      `  scenario: '${v.scenarioId}',`,
      `  durationSeconds: ${v.durationSeconds},`,
      `  caption: { en: ${JSON.stringify(cap.en ?? '')}, vi: ${JSON.stringify(cap.vi ?? '')} },`,
      '},',
    ];

    let hit = false;
    for (const file of files) {
      const next = patchFile(file, v.lesson.slug, block, v.scenarioId);
      if (!next) continue;
      if (next === 'MANUAL') {
        hit = true;
        console.error(`  ! ${path.relative(process.cwd(), file)} — bài '${v.lesson.slug}' khai \`simulations: [ … ]\`; cập nhật url/poster của kịch bản '${v.scenarioId}' trong mảng bằng tay.`);
        break;
      }
      hit = true;
      console.log(`  ${DRY ? '·' : '✓'} ${path.relative(process.cwd(), file)} ← ${v.lesson.slug} (${v.durationSeconds}s)`);
      if (!DRY) fs.writeFileSync(file, next);
      done++;
      break;
    }
    if (!hit) {
      const where = files.map((f) => path.relative(process.cwd(), f)).join(', ');
      console.error(`  ✗ không tìm thấy bài có slug '${v.lesson.slug}' trong ${where}`);
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
