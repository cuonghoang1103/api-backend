/**
 * _slides.mjs — nhúng ảnh slide của khoá "Linux & Bash" vào bài học.
 *
 * Slide do khoá tự soạn, dựng bằng
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/lx-NN.mjs --out <dir>
 * rồi đẩy lên R2 bằng
 *   node --env-file=.env scripts/upload-academy-slides.mjs --dir <dir> --prefix LX/v1 --decks lx-NN
 * ⇒ images/academy/LX/v1/<deck>/<NNN>.webp
 *
 * ⚠️ Prefix mang số phiên bản CÓ CHỦ ĐÍCH: Cloudflare vẫn phục vụ bytes CŨ cho
 * một key bị ghi đè (cache immutable 1 năm). Dựng lại một deck đã đẩy ⇒ đẩy
 * sang prefix mới (LX/v2) và ghi deck đó vào VER bên dưới — đừng ghi đè v1.
 *
 * Việc "slide số n có thật không" được kiểm ở bước ghép bằng
 * `node scripts/lx-ghep-chuong.mjs <file chương> --render <dir> [--cdn]`.
 */
export const CDN_ROOT = 'https://media.cuongthai.com/images/academy/LX';

/** Deck nào đã phải dựng lại thì ghi phiên bản ở đây, vd { 'lx-05': 'v2' }. */
// v2 (28/09/2026): lx-07 đổi token mẫu để qua gitleaks (v2 bỏ, v3 là bản cuối)
const VER = { 'lx-07': 'v3' };

const pad = (n) => String(n).padStart(3, '0');
const attr = (s) => String(s).replace(/<[^>]+>/g, '').replace(/&/g, '&amp;').replace(/"/g, '&quot;');

export const img = (deck, n) => `${CDN_ROOT}/${VER[deck] || 'v1'}/${deck}/${pad(n)}.webp`;

/**
 * slide(deck, n, caption) — một ảnh slide + một dòng chú thích.
 * Đặt ngay cạnh đoạn đang giảng về nó (cả khối .ml-en lẫn .ml-vi).
 */
export function slide(deck, n, caption) {
  if (!/^lx-\d\d$/.test(deck)) throw new Error(`deck lạ: ${deck}`);
  if (!Number.isInteger(n) || n < 1 || n > 60) throw new Error(`${deck}: số slide không hợp lệ ${n}`);
  return `<div class="anh-slide"><img src="${img(deck, n)}" alt="${attr(`${deck.toUpperCase()} slide ${n}: ${caption}`)}" loading="lazy" width="1280" height="720" />` +
    `<p class="chu-thich">📑 ${deck.toUpperCase()} · slide ${n} — ${caption}</p></div>`;
}

/** Cả bộ: rows = [[n, caption], …] */
export const gallery = (deck, rows) => rows.map(([n, c]) => slide(deck, n, c)).join('\n');
