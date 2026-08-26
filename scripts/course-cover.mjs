/**
 * course-cover.mjs — generate a 1200×675 course cover (brand logo + title on a
 * dark gradient) and upload it to R2, then print the public URL.
 *
 * The logo path is pulled from Simple Icons' CDN at build time and inlined into
 * the SVG, so the finished PNG has no external dependency (the site's CSP only
 * allows images from media.cuongthai.com).
 *
 * MUST run inside the backend container: it needs `sharp`, `@aws-sdk/client-s3`
 * and the R2_* environment variables.
 *
 *   node scripts/course-cover.mjs --slug nodejs --icon nodedotjs \
 *        --color 5FA04E --title "Node.js" --subtitle "Zero → Production"
 *
 * Flags:
 *   --slug      course slug → object key images/course-covers/<slug>.png
 *   --icon      Simple Icons slug (nodedotjs, nextdotjs, git, docker…)
 *   --color     brand hex WITHOUT '#' (accent for logo + glow + rule)
 *   --title     big line (keep it short — it is the brand name)
 *   --subtitle  small line under the title
 *   --eyebrow   tiny uppercase line above the title (default "CUONGTHAI COURSE")
 *   --dry       render to /tmp only, do not upload
 */
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import fs from 'node:fs/promises';

const args = process.argv.slice(2);
const val = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };
const has = (f) => args.includes(f);

const SLUG = val('--slug');
const ICON = val('--icon');
const COLOR = (val('--color', '5FA04E') || '').replace('#', '');
const TITLE = val('--title', SLUG);
const SUBTITLE = val('--subtitle', '');
const EYEBROW = val('--eyebrow', 'CUONGTHAI COURSE');
const DRY = has('--dry');
if (!SLUG || !ICON) { console.error('cần --slug và --icon'); process.exit(1); }

const W = 1200, H = 675;

/** XML-escape text that goes inside an SVG <text> node. */
const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&apos;');

/* 1. Lấy logo và rút path. Simple Icons phát SVG viewBox 24×24, đúng thứ cần
      nhúng thẳng vào ảnh.

      ĐĨA TRƯỚC, MẠNG SAU (26/08/2026). Trước đó bước này gọi thẳng
      cdn.simpleicons.org và `exit 1` khi CDN không trả 200 — nghĩa là cả mẻ
      ảnh bìa phụ thuộc một dịch vụ ngoài, ngay lúc chạy, bên trong container.
      Nó đã hỏng câm hai lần liền: script chạy đủ, deploy xanh, smoke-test
      sạch, mà redis.png vẫn 404 trên R2. Nên 19 logo đang dùng được chép sẵn
      vào assets/simple-icons/ (88 KB cho cả bộ) và đọc từ đĩa trước; CDN chỉ
      còn là đường lùi cho logo chưa chép. */
// Giải theo vị trí FILE này, không theo cwd — script chạy bằng `docker exec`
// nên cwd không chắc là gốc repo.
const iconLocal = new URL(`../assets/simple-icons/${ICON}.svg`, import.meta.url);
let iconSvg = null;
try {
  iconSvg = await fs.readFile(iconLocal, 'utf8');
  console.log(`· logo ${ICON}: đọc từ đĩa (assets/simple-icons/${ICON}.svg)`);
} catch {
  const iconUrl = `https://cdn.simpleicons.org/${ICON}/${COLOR}`;
  console.log(`· logo ${ICON}: chưa chép vào assets/simple-icons/, thử CDN…`);
  const res = await fetch(iconUrl).catch((e) => ({ ok: false, status: 0, err: e.message }));
  if (!res.ok) {
    console.error(`✗ không lấy được logo "${ICON}" (${res.status || res.err}) từ ${iconUrl}`);
    console.error(`  Chép tay cho khỏi phụ thuộc mạng: assets/simple-icons/${ICON}.svg`);
    process.exit(1);
  }
  iconSvg = await res.text();
}
const paths = [...iconSvg.matchAll(/<path\b[^>]*\bd="([^"]+)"/g)].map((m) => m[1]);
if (!paths.length) { console.error('✗ SVG logo không có <path d="…">'); process.exit(1); }
console.log(`· logo ${ICON}: ${paths.length} path, ${iconSvg.length} bytes`);

/* 2. Compose the cover. Logo sits left, text right, brand colour drives the
      glow / rule / logo fill so every course cover is visually a family. */
const LOGO_BOX = 232;                 // rendered logo size in px
const LOGO_X = 96, LOGO_Y = (H - LOGO_BOX) / 2 - 12;
const scale = LOGO_BOX / 24;          // Simple Icons viewBox is 24×24
const TX = LOGO_X + LOGO_BOX + 76;    // text column x

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a0e1a"/>
      <stop offset="55%" stop-color="#11162a"/>
      <stop offset="100%" stop-color="#0d1220"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.22" cy="0.5" r="0.62">
      <stop offset="0%" stop-color="#${COLOR}" stop-opacity="0.30"/>
      <stop offset="100%" stop-color="#${COLOR}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="0.92" cy="0.12" r="0.5">
      <stop offset="0%" stop-color="#6366f1" stop-opacity="0.20"/>
      <stop offset="100%" stop-color="#6366f1" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="#ffffff" stroke-opacity="0.035" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <rect width="${W}" height="${H}" fill="url(#glow2)"/>

  <!-- logo -->
  <g transform="translate(${LOGO_X}, ${LOGO_Y}) scale(${scale})" fill="#${COLOR}">
    ${paths.map((d) => `<path d="${d}"/>`).join('\n    ')}
  </g>

  <!-- text column -->
  <text x="${TX}" y="${H / 2 - 74}" font-family="DejaVu Sans" font-size="24" font-weight="bold"
        fill="#${COLOR}" letter-spacing="4">${esc(EYEBROW)}</text>
  <text x="${TX}" y="${H / 2 + 8}" font-family="DejaVu Sans" font-size="82" font-weight="bold"
        fill="#f2f5fb">${esc(TITLE)}</text>
  ${SUBTITLE ? `<text x="${TX}" y="${H / 2 + 58}" font-family="DejaVu Sans" font-size="30"
        fill="#9aa4bd">${esc(SUBTITLE)}</text>` : ''}
  <rect x="${TX}" y="${H / 2 + 92}" width="132" height="6" rx="3" fill="#${COLOR}"/>

  <!-- bottom-left wordmark -->
  <text x="${LOGO_X}" y="${H - 46}" font-family="DejaVu Sans" font-size="22"
        fill="#6b7590">cuongthai.com</text>
  <rect x="0" y="${H - 8}" width="${W}" height="8" fill="#${COLOR}" opacity="0.85"/>
</svg>`;

const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
console.log(`· render ${W}×${H} → ${(png.length / 1024).toFixed(1)} KB`);

const key = `images/course-covers/${SLUG}.png`;
if (DRY) {
  const out = `/tmp/cover-${SLUG}.png`;
  await fs.writeFile(out, png);
  console.log(`DRY → ${out} (key sẽ là ${key})`);
  process.exit(0);
}

/* 3. Upload to R2 under the same prefix the app already serves publicly. */
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
  Body: png,
  ContentType: 'image/png',
  CacheControl: 'public, max-age=31536000, immutable',
}));

const publicUrl = `${(process.env.R2_PUBLIC_URL || '').replace(/\/$/, '')}/${key}`;
console.log(`\n✅ ${publicUrl}`);
