/**
 * upload-project-covers.mjs — đưa ảnh bìa dự án lên R2 và GẮN THẲNG
 * `thumbnailUrl` vào từng `content/projects/<slug>.mjs`.
 * ─────────────────────────────────────────────────────────────────────────────
 *   node scripts/gen-project-covers.mjs        # vẽ ra .covers/*.webp trước
 *   node scripts/upload-project-covers.mjs     # chạy thử, không ghi gì
 *   node scripts/upload-project-covers.mjs --apply
 *
 * VÌ SAO GHI THẲNG VÀO FILE SPEC
 * `deploy.sh` (Step 3.16) lặp qua `content/projects/*.mjs` và seed lại toàn bộ,
 * nên `thumbnailUrl` nằm trong spec là con đường DUY NHẤT khiến ảnh bìa sống
 * sót qua mọi lần deploy. Sửa thẳng trong DB thì lần seed sau sẽ ghi đè lại
 * bằng giá trị trong spec (tức là null) và ảnh bìa lặng lẽ biến mất.
 *
 * `thumbnailUrl` phải là URL TUYỆT ĐỐI: `ProjectCardPremium` lọc ảnh bằng
 * `u.startsWith('http')`, nên một key trần kiểu `images/projects/x.webp` sẽ bị
 * loại và thẻ rơi về ô giữ chỗ mà không báo lỗi gì.
 */
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import 'dotenv/config';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const COVERS = path.join(ROOT, '.covers');
const CONTENT = path.join(ROOT, 'content/projects');
const APPLY = process.argv.includes('--apply');

const required = ['R2_BUCKET_NAME', 'R2_ENDPOINT_URL', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_PUBLIC_URL'];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`✗ thiếu env: ${missing.join(', ')} — thêm vào .env rồi thử lại`);
  process.exit(1);
}

const files = fs.existsSync(COVERS)
  ? fs.readdirSync(COVERS).filter((f) => f.endsWith('.webp')).sort()
  : [];
if (!files.length) {
  console.error('✗ không có .webp nào trong .covers/ — chạy scripts/gen-project-covers.mjs trước');
  process.exit(1);
}

const base = (process.env.R2_PUBLIC_URL || '').replace(/\/$/, '');
const s3 = new S3Client({
  region: process.env.R2_REGION || 'auto',
  endpoint: process.env.R2_ENDPOINT_URL,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

console.log(`── upload ảnh bìa dự án : ${APPLY ? 'APPLY' : 'DRY'} ──`);

let uploaded = 0, patched = 0, skipped = 0;
for (const f of files) {
  const slug = f.replace(/\.webp$/, '');
  const specPath = path.join(CONTENT, `${slug}.mjs`);
  if (!fs.existsSync(specPath)) {
    console.warn(`  ⚠ ${slug}: không có file spec tương ứng, bỏ qua`);
    skipped++;
    continue;
  }

  const key = `images/projects/${slug}.webp`;
  const url = `${base}/${key}`;
  const body = fs.readFileSync(path.join(COVERS, f));

  if (APPLY) {
    await s3.send(new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: 'image/webp',
      CacheControl: 'public, max-age=2592000',   // 30 ngày: đủ lâu, vẫn vẽ lại được
    }));
    uploaded++;
  }

  // Gắn thumbnailUrl vào spec — idempotent, chạy lại nhiều lần vẫn ra một kết quả.
  const src = fs.readFileSync(specPath, 'utf8');
  let next;
  if (/^\s*thumbnailUrl:/m.test(src)) {
    next = src.replace(/^(\s*)thumbnailUrl:.*$/m, `$1thumbnailUrl: '${url}',`);
  } else if (/^\s*projectUrl:/m.test(src)) {
    // đặt ngay trên projectUrl để cụm siêu dữ liệu đứng cạnh nhau
    next = src.replace(/^(\s*)projectUrl:/m, `$1thumbnailUrl: '${url}',\n$1projectUrl:`);
  } else {
    console.warn(`  ⚠ ${slug}: không tìm thấy chỗ chèn (thiếu cả thumbnailUrl lẫn projectUrl)`);
    skipped++;
    continue;
  }

  if (next !== src) {
    if (APPLY) fs.writeFileSync(specPath, next);
    patched++;
  }
  console.log(`  ${APPLY ? '✓' : '·'} ${slug.padEnd(40)} ${(body.length / 1024).toFixed(0).padStart(3)}KB  ${url}`);
}

console.log(
  `\n${APPLY ? '✓' : 'DRY:'} ${APPLY ? 'đã upload' : 'sẽ upload'} ${APPLY ? uploaded : files.length} ảnh · `
  + `${APPLY ? 'đã gắn' : 'sẽ gắn'} thumbnailUrl cho ${patched} spec`
  + (skipped ? ` · bỏ qua ${skipped}` : ''),
);
if (!APPLY) console.log('   chạy lại với --apply để ghi.');
