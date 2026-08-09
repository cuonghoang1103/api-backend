/**
 * database-series-seed.mjs — đăng một bài của loạt "100 Ngày Database với
 * CuongThai" lên feed: tạo mục "Database", dựng ảnh thẻ, upload R2, tạo
 * SocialPost + media. Song sinh với scripts/java-series-seed.mjs.
 * ─────────────────────────────────────────────────────────────────────────────
 *   node scripts/database-series-seed.mjs --file ./content/feed-series/100-ngay-database/day-01.mjs
 *   node scripts/database-series-seed.mjs --file ... --apply
 *   node scripts/database-series-seed.mjs --file ... --apply --skip-card   # trong container
 *
 * KHÁC Java: thẻ KHÔNG chạy `javac`+`java` (thẻ Database không có `verify`).
 * Thay vào đó `proof.lines` là OUTPUT THẬT của psql mà người soạn CHẠY TAY trên
 * PostgreSQL rồi dán vào — kỷ luật "không nói dối về hành vi" y như bên Java,
 * chỉ là bước kiểm chạy bằng tay (SQL) chứ không tự động (Java).
 *
 * IDEMPOTENT theo hashtag ngày (`dayTag`). Tác giả TRA THEO EMAIL (không mật
 * khẩu). Mục "Database" chạy trên feed như "Java" — xem ghi chú ở java-series-seed.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const val = (f) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : undefined; };
const FILE = val('--file');
const APPLY = args.includes('--apply');
const SKIP_CARD = args.includes('--skip-card');
const AUTHOR_EMAIL = val('--author') || 'cuongthaihnhe176322@gmail.com';
if (!FILE) { console.error('cần --file ./content/feed-series/100-ngay-database/day-XX.mjs'); process.exit(1); }

const day = (await import(pathToFileURL(path.resolve(FILE)).href)).default;
const dayTag = `100NgayDatabase-Day${String(day.day).padStart(3, '0')}`;   // khoá nhận diện bài
const prisma = new PrismaClient();

console.log(`── ${path.basename(FILE)} : ${APPLY ? 'APPLY' : 'DRY'} ──`);

/* ── 1. Tác giả ───────────────────────────────────────────────────────────── */
const author = await prisma.user.findFirst({
  where: { email: AUTHOR_EMAIL },
  select: { id: true, username: true, email: true },
});
if (!author) {
  console.error(`✗ không thấy tài khoản ${AUTHOR_EMAIL} trong DB đang kết nối`);
  process.exit(1);
}
console.log(`   tác giả: #${author.id} ${author.username} <${author.email}>`);

/* ── 2. Mục "Database" trên feed ──────────────────────────────────────────── */
const slugify = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

let category = await prisma.videoCategory.findFirst({ where: { name: day.category } });
if (!category) {
  const maxOrder = await prisma.videoCategory.aggregate({ _max: { sortOrder: true } });
  const data = {
    name: day.category,
    slug: slugify(day.category),
    sortOrder: (maxOrder._max.sortOrder ?? 0) + 1,
    isActive: true,
  };
  if (APPLY) category = await prisma.videoCategory.create({ data });
  console.log(`   mục "${day.category}": ${APPLY ? `TẠO MỚI #${category.id}` : 'SẼ TẠO MỚI'} (sortOrder ${data.sortOrder})`);
} else {
  console.log(`   mục "${day.category}": đã có #${category.id}`);
}

/* ── 3. Ảnh thẻ: dựng → nén WebP → R2 ─────────────────────────────────────── */
const cardSpec = path.join(ROOT, 'content/lesson-cards', `${day.card}.mjs`);
if (!SKIP_CARD && !fs.existsSync(cardSpec)) {
  console.error(`✗ không thấy file thẻ ${path.relative(ROOT, cardSpec)}`); process.exit(1);
}

/* `cardRev: 2` → `…-v2.webp` để né CDN cache (kể cả cache 404). Xem java-series-seed. */
const cardFile = day.cardRev && day.cardRev > 1 ? `${day.card}-v${day.cardRev}` : day.card;
const key = `images/lessons/100-ngay-database/${cardFile}.webp`;
const PUBLIC_BASE = (process.env.R2_PUBLIC_URL || 'https://media.cuongthai.com').replace(/\/$/, '');
const url = `${PUBLIC_BASE}/${key}`;
let meta = { width: 1080, height: 1900 };

if (SKIP_CARD) {
  /* Pha GHI BÀI (trong container lúc deploy). Ảnh phải đã có sẵn trên CDN. */
  let probe = null;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    probe = await fetch(url, { method: 'GET' }).catch(() => null);
    if (probe && probe.ok) break;
    if (attempt < 3) await new Promise((r) => setTimeout(r, 20_000));
  }
  if (!probe || !probe.ok) {
    const fresh = await fetch(`${url}?cb=${Date.now()}`, { method: 'GET' }).catch(() => null);
    if (fresh && fresh.ok) {
      console.error(`✗ ảnh CÓ trên R2 nhưng CDN đang giữ bản 404 đã cache: ${url}`);
      console.error('  → chờ hết TTL (Cloudflare cache 404 ~3 phút) rồi chạy lại, đừng upload lại.');
    } else {
      console.error(`✗ ảnh thẻ chưa có trên CDN (${probe ? probe.status : 'không nối được'}): ${url}`);
      console.error('  → chạy ở máy local KHÔNG kèm --skip-card để dựng và upload trước.');
    }
    process.exit(1);
  }
  console.log(`   ảnh: đã có trên CDN (${probe.status}) → ${url}`);
} else {
  /* Pha DỰNG ẢNH (máy local, cần Playwright + sharp). Thẻ Database không có
     `verify` nên gen-lesson-card chỉ RENDER, không chạy Java. */
  const sharp = (await import('sharp')).default;
  const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');

  const pngPath = path.join(ROOT, '.cards', `${day.card}.png`);
  console.log('   dựng ảnh thẻ (render proof SQL — proof.lines là output psql thật)…');
  execFileSync('node', [path.join(ROOT, 'scripts/gen-lesson-card.mjs'), '--file', cardSpec], { stdio: 'pipe' });

  const webpPath = pngPath.replace(/\.png$/, '.webp');
  meta = await sharp(pngPath).webp({ quality: 88, effort: 6 }).toFile(webpPath);
  console.log(`   ảnh: ${meta.width}×${meta.height} · ${(fs.statSync(webpPath).size / 1024).toFixed(0)}KB → ${url}`);

  if (APPLY) {
    const s3 = new S3Client({
      region: process.env.R2_REGION || 'auto',
      endpoint: process.env.R2_ENDPOINT_URL,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    });
    await s3.send(new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: fs.readFileSync(webpPath),
      ContentType: 'image/webp',
      CacheControl: 'public, max-age=2592000',
    }));

    const check = await fetch(`${url}?cb=${Date.now()}`, { method: 'GET' }).catch(() => null);
    if (!check || !check.ok) {
      console.error(`✗ upload xong nhưng đọc lại không được (${check ? check.status : 'không nối được'}): ${key}`);
      process.exit(1);
    }
    console.log(`   ảnh: đã lên R2 và đọc lại được (${check.status})`);
  }
}

/* ── 4. Bài đăng ──────────────────────────────────────────────────────────── */

/* Khối "luyện tập chuyên sâu" ghép tự động, link đã kiểm 200. Track mặc định
   là postgresql (khớp dự án user); mỗi ngày khai `codeLab.track` riêng. */
if (day.codeLab) {
  const { track, slug, title } = day.codeLab;
  if (!track || !slug) { console.error('✗ `codeLab` phải có cả `track` lẫn `slug`'); process.exit(1); }
  const href = `https://cuongthai.com/code-lab/${track}/${slug}`;
  const res = await fetch(href, { method: 'GET' }).catch(() => null);
  if (!res || !res.ok) {
    console.error(`✗ link Code Lab chết (${res ? res.status : 'không nối được'}): ${href}`);
    process.exit(1);
  }
  console.log(`   Code Lab: ${res.status} ${href}`);
  const tenLoTrinh = track === 'postgresql' ? 'PostgreSQL (21 chương · 210 bài)'
    : track === 'sql' ? 'SQL (16 chương · 160 bài)' : track;
  day.content += `\n\n━━━━━━━━━━━━━━━━━━━━\n\n`
    + `💻 LUYỆN TẬP CHUYÊN SÂU\n\n`
    + `Đọc xong rồi thì phải gõ mới nhớ. Bài thực hành chấm tự động cho đúng phần hôm nay:\n\n`
    + `👉 ${title}\n${href}\n\n`
    + `Toàn bộ lộ trình ${tenLoTrinh}: https://cuongthai.com/code-lab/${track}`;
}

const content = `${day.content}\n\n#${dayTag}`;   // thẻ ngày để nhận lại bài khi chạy lại
const existing = await prisma.socialPost.findFirst({
  where: { authorId: author.id, content: { contains: `#${dayTag}` } },
  select: { id: true },
});

console.log(`   bài: ${existing ? `CẬP NHẬT #${existing.id}` : 'TẠO MỚI'} · ${content.length} ký tự · mục ${day.category}`);

if (APPLY) {
  const postData = {
    authorId: author.id,
    content,
    type: 'IMAGE',
    status: 'PUBLISHED',
    visibility: 'PUBLIC',
    videoCategoryId: category.id,
    showInAll: true,
  };
  const post = existing
    ? await prisma.socialPost.update({ where: { id: existing.id }, data: postData })
    : await prisma.socialPost.create({ data: postData });

  await prisma.socialMedia.deleteMany({ where: { postId: post.id } });
  await prisma.socialMedia.create({
    data: {
      postId: post.id,
      type: 'IMAGE',
      url,
      width: meta.width,
      height: meta.height,
      mimeType: 'image/webp',
      fileName: `${cardFile}.webp`,
      alt: `Thẻ tóm tắt ${day.card}`,
      sortOrder: 0,
    },
  });
  console.log(`  ✓ bài #${post.id} · ảnh đính kèm 1 · /feed`);
} else {
  console.log('   chạy lại với --apply để ghi.');
}

await prisma.$disconnect();
