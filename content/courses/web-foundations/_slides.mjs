/**
 * _slides.mjs — nhúng bộ slide bài giảng của khoá Web Foundations.
 *
 * Slide do CuongThai tự soạn (không phải deck của trường), dựng bằng
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/wf-*.mjs --out <dir>
 * rồi đẩy lên R2 bằng scripts/upload-academy-slides.mjs --prefix WF/v1:
 *   images/academy/WF/v1/<deck>/<NNN>.webp
 *
 * ⚠️ Prefix mang số phiên bản (v1, v2…) CÓ CHỦ ĐÍCH: Cloudflare vẫn phục vụ
 * bytes CŨ cho một key bị ghi đè, nên dựng lại phải đi sang prefix mới chứ
 * không ghi đè — xem [[feedback_bay_cdn_va_cache]].
 *
 * Dùng lại đúng các class đang sống trong globals.css (.anh-slide /
 * .chu-thich) và cặp .ml-en / .ml-vi của khoá — không phải sửa frontend.
 */
export const CDN = 'https://media.cuongthai.com/images/academy/WF/v1';

const W = 1280, H = 720;

export const DECKS = {
  'wf-js1': { code: 'Chương 4', en: 'JavaScript fundamentals', vi: 'JavaScript nền tảng',   total: 22, w: W, h: H },
  'wf-js2': { code: 'Chương 5', en: 'Asynchronous JavaScript', vi: 'JavaScript bất đồng bộ', total: 15, w: W, h: H },
};

const pad = (n) => String(n).padStart(3, '0');
const attr = (s) => String(s).replace(/<[^>]+>/g, '').replace(/&/g, '&amp;').replace(/"/g, '&quot;');

export const img = (deck, n) => `${CDN}/${deck}/${pad(n)}.webp`;

/**
 * Một slide: ảnh + một dòng chú thích.
 *
 * Khác các môn Academy (ở đó slide là của giảng viên nên phải giải thích lại
 * từng cái): slide ở đây do chính khoá soạn và bài học bên dưới đã dạy chi
 * tiết rồi. Nên chú thích cố ý NGẮN — nó là mục lục hình ảnh để ôn lại, không
 * phải bản dạy thứ hai.
 */
export function slide(deck, n, caption) {
  const d = DECKS[deck];
  if (!d) throw new Error(`deck lạ: ${deck}`);
  if (n < 1 || n > d.total) throw new Error(`${deck} có ${d.total} slide, nhận ${n}`);
  return `<div class="anh-slide"><img src="${img(deck, n)}" alt="${attr(`${d.code} slide ${n}: ${caption}`)}" loading="lazy" width="${d.w}" height="${d.h}" />` +
    `<p class="chu-thich">📑 slide ${n}/${d.total} — ${caption}</p></div>`;
}

/** Cả bộ: rows = [[n, caption], …] */
export const gallery = (deck, rows) => rows.map((r) => slide(deck, ...r)).join('\n');
