/**
 * _slides.mjs — nhúng ảnh slide của khoá "Content Creator" vào bài học.
 *
 * Slide do khoá tự soạn, dựng bằng
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/cr-NN.mjs --out <dir>
 * rồi đẩy lên R2 bằng
 *   node --env-file=.env scripts/upload-academy-slides.mjs --dir <dir> --prefix CR/v1
 * ⇒ images/academy/CR/v1/<deck>/<NNN>.webp
 *
 * ⚠️ Prefix mang số phiên bản CÓ CHỦ ĐÍCH: Cloudflare vẫn phục vụ bytes CŨ cho
 * một key bị ghi đè (cache immutable 1 năm). Dựng lại một deck đã đẩy ⇒ đẩy
 * sang prefix mới (CR/v2) và ghi deck đó vào VER bên dưới — đừng ghi đè v1.
 *
 * Khác Web Foundations: ở đây KHÔNG giữ bảng tổng số slide từng deck. Nhiều
 * agent soạn song song từng chương, một bảng chung là chỗ giẫm chân nhau. Việc
 * "slide số n có thật không" được kiểm ở bước ghép bằng cách GET từng ảnh trên
 * CDN (xem content/courses/content-creator/_HOP-DONG.md, mục Kiểm tra).
 *
 * Dùng lại class đang sống trong globals.css (.anh-slide / .chu-thich) — không
 * phải sửa frontend.
 */
export const CDN_ROOT = 'https://media.cuongthai.com/images/academy/CR';

/** Deck nào đã phải dựng lại thì ghi phiên bản ở đây, vd { 'cr-05': 'v2' }. */
const VER = {};

const pad = (n) => String(n).padStart(3, '0');
const attr = (s) => String(s).replace(/<[^>]+>/g, '').replace(/&/g, '&amp;').replace(/"/g, '&quot;');

export const img = (deck, n) => `${CDN_ROOT}/${VER[deck] || 'v1'}/${deck}/${pad(n)}.webp`;

/**
 * slide(deck, n, caption) — một ảnh slide + một dòng chú thích.
 * Dùng được ở bất kỳ đâu trong thân bài (cả khối .ml-en lẫn .ml-vi): đặt hình
 * minh hoạ ngay cạnh đoạn đang giảng về nó.
 */
export function slide(deck, n, caption) {
  if (!/^cr-\d\d$/.test(deck)) throw new Error(`deck lạ: ${deck}`);
  if (!Number.isInteger(n) || n < 1 || n > 60) throw new Error(`${deck}: số slide không hợp lệ ${n}`);
  return `<div class="anh-slide"><img src="${img(deck, n)}" alt="${attr(`${deck.toUpperCase()} slide ${n}: ${caption}`)}" loading="lazy" width="1280" height="720" />` +
    `<p class="chu-thich">📑 ${deck.toUpperCase()} · slide ${n} — ${caption}</p></div>`;
}

/** Cả bộ: rows = [[n, caption], …] */
export const gallery = (deck, rows) => rows.map(([n, c]) => slide(deck, n, c)).join('\n');
