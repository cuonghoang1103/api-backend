/**
 * course-cover-offline.mjs — dựng ảnh bìa khoá học KHÔNG cần mạng.
 * ─────────────────────────────────────────────────────────────────────────────
 * Bản sinh ảnh gốc (`course-cover.mjs`) kéo logo từ `cdn.simpleicons.org` ngay
 * lúc chạy, rồi đẩy thẳng lên R2. Hai chỗ đó đều là mạng, và mỗi chỗ đều đã
 * từng làm cả mẻ ảnh hỏng. File này bỏ cả hai: đọc logo từ gói `simple-icons`
 * trên đĩa, ghi PNG ra thư mục, không đụng R2. Ai đẩy lên thì đẩy sau —
 * kéo thả trên bảng điều khiển R2 cũng được.
 *
 * Bố cục sao y `course-cover.mjs` để ảnh mới xếp cạnh ảnh cũ không lệch:
 * 1200×675 · logo 232px bên trái · eyebrow 24px · tiêu đề 82px · phụ đề 30px ·
 * gạch chân 132×6 · chữ ký "cuongthai.com" góc dưới · viền màu thương hiệu.
 *
 *   node scripts/course-cover-offline.mjs --out /tmp/bia
 *   node scripts/course-cover-offline.mjs --out /tmp/bia --slug redis
 *   node scripts/course-cover-offline.mjs --out /tmp/bia --icons-dir <đường dẫn>
 *
 * `--icons-dir` mặc định là `scripts/icons/` — 19 logo chép sẵn trong repo.
 * Muốn logo khác thì trỏ sang gói simple-icons:
 *   npm install simple-icons --prefix /tmp/si --no-save
 *   node scripts/course-cover-offline.mjs --out /tmp/bia \
 *     --icons-dir /tmp/si/node_modules/simple-icons/icons
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const args = process.argv.slice(2);
const val = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };
const OUT = val('--out', '/tmp/bia');
const ONLY = val('--slug', null);
const ICONS = val('--icons-dir', new URL('./icons', import.meta.url).pathname);
const EYEBROW = val('--eyebrow', 'CUONGTHAI COURSE');
const W = 1200, H = 675;

/* Chữ trên ảnh theo đúng mẫu bộ ảnh đã có: tiêu đề là tên khoá (cắt ngắn cho
   vừa khung 82px — trần thực tế ~16 ký tự), phụ đề dạng "Zero → <đích>".
   Hai hex bị ép sang FFFFFF: Next.js #000000 và Socket.IO #010101 vẽ lên nền
   gradient tối thì mất tiêu. */
const KHOA = [
  ['nodejs',                   'nodedotjs',     '5FA04E', 'Node.js',          'Zero → Production'],
  ['nextjs',                   'nextdotjs',     'FFFFFF', 'Next.js & React',  'Zero → Production · App Router'],
  ['typescript',               'typescript',    '3178C6', 'TypeScript',       'Zero → làm chủ hệ thống kiểu'],
  ['postgresql',               'postgresql',    '4169E1', 'PostgreSQL',       'Zero → Production'],
  ['web-foundations',          'html5',         'E34F26', 'Nền tảng Web',     'Zero → sẵn sàng học Node.js & Next.js'],
  ['object-storage',           'cloudflare',    'F38020', 'Object Storage',   'Zero → S3 API & Cloudflare R2'],
  ['media-processing',         'ffmpeg',        '007808', 'Media Processing', 'Zero → Sharp & FFmpeg'],
  ['socket-io',                'socketdotio',   'FFFFFF', 'Socket.IO',        'Zero → realtime chạy thật'],
  ['tailwind-css',             'tailwindcss',   '06B6D4', 'Tailwind CSS',     'Zero → design system'],
  ['git',                      'git',           'F05032', 'Git & GitHub',     'Zero → Production'],
  ['linux-bash',               'linux',         'FCC624', 'Linux & Bash',     'Zero → làm chủ máy chủ'],
  ['docker',                   'docker',        '2496ED', 'Docker',           'Zero → Production'],
  ['redis',                    'redis',         'DC382D', 'Redis',            'Zero → cache chạy thật'],
  ['prisma-orm',               'prisma',        '2D3748', 'Prisma ORM',       'Zero → lược đồ & truy vấn'],
  ['authentication',           'openid',        'F78C40', 'Authentication',   'Zero → đăng nhập an toàn'],
  ['nginx',                    'nginx',         '009639', 'Nginx',            'Zero → reverse proxy thật'],
  ['deploy-vps',               'ubuntu',        'E95420', 'Deploy lên VPS',   'Zero → production tự tráo'],
  ['github-actions',           'githubactions', '2088FF', 'GitHub Actions',   'Zero → CI/CD chạy thật'],
  ['observability-monitoring', 'grafana',       'F46800', 'Observability',    'Log → Metric → Trace'],
];

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&apos;');

function veSvg(paths, COLOR, TITLE, SUBTITLE) {
  const LOGO_BOX = 232;
  const LOGO_X = 96, LOGO_Y = (H - LOGO_BOX) / 2 - 12;
  const scale = LOGO_BOX / 24;
  const TX = LOGO_X + LOGO_BOX + 76;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
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

  <g transform="translate(${LOGO_X}, ${LOGO_Y}) scale(${scale})" fill="#${COLOR}">
    ${paths.map((d) => `<path d="${d}"/>`).join('\n    ')}
  </g>

  <text x="${TX}" y="${H / 2 - 74}" font-family="DejaVu Sans" font-size="24" font-weight="bold"
        fill="#${COLOR}" letter-spacing="4">${esc(EYEBROW)}</text>
  <text x="${TX}" y="${H / 2 + 8}" font-family="DejaVu Sans" font-size="82" font-weight="bold"
        fill="#f2f5fb">${esc(TITLE)}</text>
  ${SUBTITLE ? `<text x="${TX}" y="${H / 2 + 58}" font-family="DejaVu Sans" font-size="30"
        fill="#9aa4bd">${esc(SUBTITLE)}</text>` : ''}
  <rect x="${TX}" y="${H / 2 + 92}" width="132" height="6" rx="3" fill="#${COLOR}"/>

  <text x="${LOGO_X}" y="${H - 46}" font-family="DejaVu Sans" font-size="22"
        fill="#6b7590">cuongthai.com</text>
  <rect x="0" y="${H - 8}" width="${W}" height="8" fill="#${COLOR}" opacity="0.85"/>
</svg>`;
}

mkdirSync(OUT, { recursive: true });
let ok = 0, loi = 0;
for (const [slug, icon, color, title, subtitle] of KHOA) {
  if (ONLY && ONLY !== slug) continue;
  const p = path.join(ICONS, `${icon}.svg`);
  if (!existsSync(p)) { console.error(`✗ ${slug}: không thấy logo ${p}`); loi++; continue; }
  const paths = [...readFileSync(p, 'utf8').matchAll(/<path\b[^>]*\bd="([^"]+)"/g)].map((m) => m[1]);
  if (!paths.length) { console.error(`✗ ${slug}: logo không có <path d="…">`); loi++; continue; }
  const png = await sharp(Buffer.from(veSvg(paths, color, title, subtitle)))
    .png({ compressionLevel: 9 }).toBuffer();
  const dich = path.join(OUT, `${slug}.png`);
  writeFileSync(dich, png);
  console.log(`✓ ${slug.padEnd(26)} ${(png.length / 1024).toFixed(1).padStart(6)} KB  → ${dich}`);
  ok++;
}
console.log(`\n${ok} ảnh · ${loi} lỗi · thư mục ${OUT}`);
process.exit(loi > 0 ? 1 : 0);
