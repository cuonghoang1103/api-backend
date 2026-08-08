/**
 * java-series-seed.mjs — đăng một bài của loạt "100 Ngày Java với CuongThai"
 * lên feed: tạo mục "Java", dựng ảnh thẻ, upload R2, tạo SocialPost + media.
 * ─────────────────────────────────────────────────────────────────────────────
 *   node scripts/java-series-seed.mjs --file ./content/feed-series/100-ngay-java/day-01.mjs
 *   node scripts/java-series-seed.mjs --file ... --apply
 *   node scripts/java-series-seed.mjs --file ... --apply --skip-card   # trong container
 *
 * IDEMPOTENT: chạy lại cùng một ngày thì CẬP NHẬT bài cũ chứ không đẻ bài mới
 * (khớp theo hashtag ngày, xem `dayTag`). Nhờ vậy sửa nội dung xong chạy lại
 * là xong, không phải vào xoá tay.
 *
 * VÌ SAO GHI THẲNG DB THAY VÌ GỌI API BẰNG TÀI KHOẢN ADMIN
 * Đăng bài qua API cần đăng nhập, tức là cần mật khẩu của user — thứ không
 * bao giờ nên đi qua script hay log. Ở đây tác giả được TRA THEO EMAIL rồi
 * dùng `authorId`, đúng cách mà các seeder khác trong repo vẫn làm.
 *
 * MỤC "JAVA" TRÊN FEED HOẠT ĐỘNG ĐƯỢC VỚI BÀI CHỮ + ẢNH — đã kiểm mã nguồn:
 * `frontend/src/app/feed/page.tsx:226,239` truyền `videoCategoryId` cho CẢ tab
 * "Tất cả" chứ không riêng tab Video, còn `social.service.ts:703` lọc theo cột
 * đó KHÔNG phụ thuộc loại bài. Bảng tên là `video_categories` chỉ vì lúc đầu
 * nó sinh ra cho video — đừng để cái tên làm hiểu nhầm phạm vi.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

/* `sharp` và AWS SDK chỉ cần ở PHA DỰNG ẢNH nên nạp động — pha ghi bài chạy
   TRONG CONTAINER backend, nơi không có Playwright để dựng thẻ. */

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const val = (f) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : undefined; };
const FILE = val('--file');
const APPLY = args.includes('--apply');
/* --skip-card: BỎ pha dựng ảnh, chỉ ghi bài. Dùng khi chạy TRONG container
   lúc deploy — ở đó không có Playwright. Ảnh phải đã nằm sẵn trên CDN. */
const SKIP_CARD = args.includes('--skip-card');
const AUTHOR_EMAIL = val('--author') || 'cuongthaihnhe176322@gmail.com';
if (!FILE) { console.error('cần --file ./content/feed-series/100-ngay-java/day-XX.mjs'); process.exit(1); }

const day = (await import(pathToFileURL(path.resolve(FILE)).href)).default;
const dayTag = `100NgayJava-Day${String(day.day).padStart(3, '0')}`;   // khoá nhận diện bài
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

/* ── 2. Mục "Java" trên feed ──────────────────────────────────────────────── */
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

const key = `images/lessons/100-ngay-java/${day.card}.webp`;
const PUBLIC_BASE = (process.env.R2_PUBLIC_URL || 'https://media.cuongthai.com').replace(/\/$/, '');
const url = `${PUBLIC_BASE}/${key}`;
let meta = { width: 1080, height: 1900 };

if (SKIP_CARD) {
  /* Pha GHI BÀI (chạy trong container lúc deploy). Ảnh phải đã có sẵn trên
     CDN từ pha dựng ở máy local — kiểm bằng GET thật, thiếu là DỪNG. Nếu bỏ
     qua phép kiểm này thì bài lên prod với ảnh 404 và không ai biết. */
  const probe = await fetch(url, { method: 'GET' }).catch(() => null);
  if (!probe || !probe.ok) {
    console.error(`✗ ảnh thẻ chưa có trên CDN (${probe ? probe.status : 'không nối được'}): ${url}`);
    console.error('  → chạy ở máy local KHÔNG kèm --skip-card để dựng và upload trước.');
    process.exit(1);
  }
  console.log(`   ảnh: đã có trên CDN (${probe.status}) → ${url}`);
} else {
  /* Pha DỰNG ẢNH (chạy ở máy local, cần Playwright + sharp). */
  const sharp = (await import('sharp')).default;
  const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');

  const pngPath = path.join(ROOT, '.cards', `${day.card}.png`);
  console.log('   dựng ảnh thẻ (biên dịch + chạy Java để kiểm nội dung)…');
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
  }
}

/* ── 4. Bài đăng ──────────────────────────────────────────────────────────── */

/* Khối "luyện tập chuyên sâu" được GHÉP TỰ ĐỘNG chứ không viết tay trong từng
   bài — để 100 ngày không có ngày nào quên, và đổi cách trình bày thì sửa một
   chỗ. Link đã được kiểm trả 200 trước khi đưa vào (đường chết trong 100 bài
   là thứ không ai phát hiện cho tới khi có người bấm). */
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
  day.content += `\n\n━━━━━━━━━━━━━━━━━━━━\n\n`
    + `💻 LUYỆN TẬP CHUYÊN SÂU\n\n`
    + `Đọc xong rồi thì phải gõ mới nhớ. Bài thực hành chấm tự động cho đúng phần hôm nay:\n\n`
    + `👉 ${title}\n${href}\n\n`
    + `Toàn bộ lộ trình Java Core (16 chương · 160 bài): https://cuongthai.com/code-lab/java-core`;
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
    showInAll: true,          // hiện cả ở "Tất cả" lẫn dưới pill Java
  };
  const post = existing
    ? await prisma.socialPost.update({ where: { id: existing.id }, data: postData })
    : await prisma.socialPost.create({ data: postData });

  // Media: xoá rồi tạo lại để chạy lại không đẻ ảnh trùng.
  await prisma.socialMedia.deleteMany({ where: { postId: post.id } });
  await prisma.socialMedia.create({
    data: {
      postId: post.id,
      type: 'IMAGE',
      url,
      width: meta.width,
      height: meta.height,
      mimeType: 'image/webp',
      fileName: `${day.card}.webp`,
      alt: `Thẻ tóm tắt ${day.card}`,
      sortOrder: 0,
    },
  });
  console.log(`  ✓ bài #${post.id} · ảnh đính kèm 1 · /feed`);
} else {
  console.log('   chạy lại với --apply để ghi.');
}

await prisma.$disconnect();
