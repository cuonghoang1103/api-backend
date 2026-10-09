/**
 * CT Work — dựng TOÀN BỘ tệp nhận diện từ một nguồn (`src/components/work/brand/ctWorkBrand.ts`).
 *
 *   npx tsx frontend/scripts/ct-work-brand/build.mts        (chạy từ gốc repo; cần sharp — có sẵn)
 *
 * Ghi vào frontend/public/images/ct-work/. Tệp nào ở đó cũng là KẾT QUẢ của script này — sửa hình thì sửa
 * ctWorkBrand.ts rồi chạy lại, đừng sửa tay. Chữ "CT Work" dạng đường viền lấy từ wordmark.ts (sinh bởi
 * wordmark.mjs). Bảng tệp + cách dùng: public/images/ct-work/BRAND.md.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { CTW_COLORS, logoSvg, markBody, markSvg, squirclePath } from '../../src/components/work/brand/ctWorkBrand';

const here = path.dirname(fileURLToPath(import.meta.url));
const FE = path.resolve(here, '../..');
const OUT = path.join(FE, 'public/images/ct-work');
// sharp của frontend (có sẵn trong node_modules của frontend; Docker cũng cài).
const sharp = createRequire(path.join(FE, 'package.json'))('sharp') as typeof import('sharp');

mkdirSync(OUT, { recursive: true });
const written: string[] = [];
const save = (name: string, data: string | Buffer) => { writeFileSync(path.join(OUT, name), data); written.push(name); };

/** SVG → PNG đúng `px` (vẽ ở mật độ cao rồi thu nhỏ để mép mịn). */
async function png(svg: string, px: number, viewBox = 64, opts: { flatten?: string } = {}): Promise<Buffer> {
  let img = sharp(Buffer.from(svg), { density: Math.min(2400, (72 * px * 4) / viewBox) }).resize(px, px, { kernel: 'lanczos3' });
  if (opts.flatten) img = img.flatten({ background: opts.flatten });
  return img.png({ compressionLevel: 9, palette: false }).toBuffer();
}

/** .ico chứa các ảnh PNG (Windows Vista+ và mọi trình duyệt đọc được). */
function ico(images: Array<{ px: number; data: Buffer }>): Buffer {
  const head = Buffer.alloc(6 + 16 * images.length);
  head.writeUInt16LE(0, 0);
  head.writeUInt16LE(1, 2);
  head.writeUInt16LE(images.length, 4);
  let offset = head.length;
  images.forEach((im, i) => {
    const e = 6 + 16 * i;
    head.writeUInt8(im.px >= 256 ? 0 : im.px, e);
    head.writeUInt8(im.px >= 256 ? 0 : im.px, e + 1);
    head.writeUInt8(0, e + 2);
    head.writeUInt8(0, e + 3);
    head.writeUInt16LE(1, e + 4);
    head.writeUInt16LE(32, e + 6);
    head.writeUInt32LE(im.data.length, e + 8);
    head.writeUInt32LE(offset, e + 12);
    offset += im.data.length;
  });
  return Buffer.concat([head, ...images.map((im) => im.data)]);
}

/** Icon app kiểu iOS/macOS: squircle 824/1024 giữa khung trong suốt, đổ bóng mềm (lưới icon macOS). */
function appIconSvg(): string {
  const S = 1024;
  const inner = 824;
  const off = (S - inner) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}" fill="none"><defs>`
    + `<filter id="ai-sh" x="-20%" y="-20%" width="140%" height="145%" color-interpolation-filters="sRGB">`
    + `<feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="${CTW_COLORS.shade}" flood-opacity=".30"/>`
    + `<feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="#000" flood-opacity=".18"/></filter></defs>`
    + `<g filter="url(#ai-sh)"><path transform="translate(${off} ${off})" d="${squirclePath(inner)}" fill="#4f5bd5"/></g>`
    + `<svg x="${off}" y="${off}" width="${inner}" height="${inner}" viewBox="0 0 64 64">${markBody({ idPrefix: 'ai' })}</svg></svg>`;
}

/** Icon maskable (Android): nền tràn viền, glyph thu vào vùng an toàn 80% giữa. */
function maskableSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">`
    + `${markBody({ fullBleed: true, idPrefix: 'mk-bg' }).replace(/<g filter[\s\S]*$/, '')}`
    + `<svg x="9.6" y="9.6" width="44.8" height="44.8" viewBox="0 0 64 64">${markBody({ variant: 'glyph', monoColor: '#fff' })}</svg></svg>`;
}

async function main() {
  // ── SVG: mark + logo, sáng/tối/một màu ──
  save('ct-work-mark.svg', markSvg({ theme: 'light', idPrefix: 'ctwm' }));
  save('ct-work-mark-dark.svg', markSvg({ theme: 'dark', idPrefix: 'ctwm' }));
  save('ct-work-mark-mono.svg', markSvg({ variant: 'mono', monoColor: CTW_COLORS.inkLight, idPrefix: 'ctwm' }));
  save('ct-work-mark-mono-white.svg', markSvg({ variant: 'mono', monoColor: '#ffffff', idPrefix: 'ctwm' }));
  save('ct-work-glyph.svg', markSvg({ variant: 'glyph', monoColor: CTW_COLORS.inkLight }));
  const logoL = logoSvg({ theme: 'light', idPrefix: 'ctwl' });
  const logoD = logoSvg({ theme: 'dark', idPrefix: 'ctwl' });
  save('ct-work-logo.svg', logoL.svg);
  save('ct-work-logo-dark.svg', logoD.svg);
  save('ct-work-logo-mono.svg', logoSvg({ variant: 'mono', monoColor: CTW_COLORS.inkLight, idPrefix: 'ctwl' }).svg);
  save('ct-work-logo-mono-white.svg', logoSvg({ variant: 'mono', monoColor: '#ffffff', idPrefix: 'ctwl' }).svg);

  // ── Favicon: SVG tối ưu cỡ nhỏ + .ico 16/32/48 ──
  const small = markSvg({ px: 16, idPrefix: 'fv' });
  save('icon.svg', small);
  const ico16 = await png(small, 16);
  const ico32 = await png(small, 32);
  const ico48 = await png(markSvg({ px: 48, idPrefix: 'fv' }), 48);
  save('favicon.ico', ico([{ px: 16, data: ico16 }, { px: 32, data: ico32 }, { px: 48, data: ico48 }]));
  save('favicon-32.png', ico32);

  // ── Apple touch (iOS tự bo góc ⇒ ảnh VUÔNG tràn viền, không trong suốt) ──
  const bleed = markSvg({ fullBleed: true, idPrefix: 'tb' });
  save('apple-touch-icon.png', await png(bleed, 180, 64, { flatten: CTW_COLORS.indigo }));

  // ── PWA (manifest): "any" = squircle trên nền trong suốt; "maskable" = tràn viền ──
  const mark = markSvg({ idPrefix: 'pw' });
  save('icon-192.png', await png(mark, 192));
  save('icon-512.png', await png(mark, 512));
  save('icon-maskable-512.png', await png(maskableSvg(), 512, 64, { flatten: CTW_COLORS.indigo }));

  // ── App icon kiểu iOS (squircle + bóng, nền trong suốt) — dùng cho trang giới thiệu, slide, cửa hàng ──
  const app = appIconSvg();
  for (const px of [1024, 512, 192, 180]) save(`ct-work-app-icon-${px}.png`, await png(app, px, 1024));

  // ── Email: nền ĐẶC (Outlook không bo góc, Gmail tối không đảo màu ảnh) ⇒ ô vuông tràn viền, bo bằng CSS ──
  save('ct-work-email-96.png', await png(bleed, 96, 64, { flatten: CTW_COLORS.indigo }));
  // Logo ngang cho email/tài liệu (2×, nền trắng đặc).
  const lw = logoL.width * 2;
  save('ct-work-logo-email.png', await sharp(Buffer.from(logoL.svg), { density: 72 * 2 * 2 })
    .resize(lw, 128).flatten({ background: '#ffffff' }).png({ compressionLevel: 9 }).toBuffer());

  // ── Ảnh OG (Satori không chạy filter SVG ⇒ đưa PNG): 112 = 2× ô 56 px ──
  save('ct-work-mark-112.png', await png(mark, 112));

  // ── Tên cũ (UX-D) — thư đã gửi và bản app cũ vẫn trỏ vào; giờ mang hình mới ──
  save('ct-work.svg', mark);
  save('ct-work-32.png', ico32);
  save('ct-work-96.png', await png(bleed, 96, 64, { flatten: CTW_COLORS.indigo }));
  save('ct-work-180.png', await png(bleed, 180, 64, { flatten: CTW_COLORS.indigo }));
  save('ct-work-512.png', await png(mark, 512));

  // ── Manifest cho /work (cài CT Work thành app trên điện thoại/Chrome) ──
  const manifest = {
    name: 'CT Work by CuongThai',
    short_name: 'CT Work',
    description: 'Project workspace for teams and student groups — boards, sprints, docs and reports.',
    id: '/work',
    start_url: '/work',
    scope: '/work',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: CTW_COLORS.indigo,
    icons: [
      { src: '/images/ct-work/icon-192.png?v=2', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/images/ct-work/icon-512.png?v=2', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/images/ct-work/icon-maskable-512.png?v=2', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      { src: '/images/ct-work/icon.svg?v=2', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
    ],
  };
  save('work.webmanifest', `${JSON.stringify(manifest, null, 2)}\n`);

  console.log(`Đã ghi ${written.length} tệp vào ${path.relative(process.cwd(), OUT)}:\n  ${written.join('\n  ')}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
