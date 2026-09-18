/**
 * _slides.mjs — khối dựng bài học "theo từng slide" cho SSL101c.
 *
 * Slide LẤY TỪ BỘ SLIDE THẬT của trường: 5 file review của Mooc 1-5.
 * ⚠️ Tên file gốc sắp xếp KHÔNG theo thứ tự Mooc ("SSL101-Mooc 2-review.pptx"
 * có dấu cách nên đứng trước "SSL101-Mooc1- Review.pptx", còn
 * "SSL101_Mooc5-Review.pptx" dùng gạch dưới nên nhảy xuống cuối). Đã chép sang
 * thư mục tạm đặt tên 01_…05_ trước khi chuyển, nên deck ssl1..ssl5 ứng ĐÚNG
 * Mooc 1..5. Đừng chạy lại trực tiếp trên thư mục gốc.
 *
 *   images/academy/SSL101c/v1/<deck>/<NNN>.webp   (4:3, 1280x960)
 *
 * Markup dùng đúng class sống trong globals.css: .anh-slide / .chu-thich /
 * .giang (🎯 .y-chinh · .nhan · .meo · .dap-an · .pitfall).
 */
export const CDN_ROOT = 'https://media.cuongthai.com/images/academy/SSL101c';

export const DECKS = {
  ssl1: { code: 'SSL1', en: 'Mooc 1 — Review', vi: 'Mooc 1 — Ôn tập', total: 109, w: 1280, h: 960 },
  ssl2: { code: 'SSL2', en: 'Mooc 2 — Review', vi: 'Mooc 2 — Ôn tập', total: 101, w: 1280, h: 960 },
  ssl3: { code: 'SSL3', en: 'Mooc 3 — Review', vi: 'Mooc 3 — Ôn tập', total: 15, w: 1280, h: 960 },
  ssl4: { code: 'SSL4', en: 'Mooc 4 — Review', vi: 'Mooc 4 — Ôn tập', total: 64, w: 1280, h: 960 },
  ssl5: { code: 'SSL5', en: 'Mooc 5 — Review', vi: 'Mooc 5 — Ôn tập', total: 46, w: 1280, h: 960 },
};

export function registerDeck(key, meta) {
  if (DECKS[key] && JSON.stringify(DECKS[key]) !== JSON.stringify(meta)) throw new Error(`deck ${key} đã đăng ký khác`);
  DECKS[key] = meta;
}

const pad = (n) => String(n).padStart(3, '0');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const attr = (s) => String(s).replace(/<[^>]+>/g, '').replace(/&/g, '&amp;').replace(/"/g, '&quot;');

export const img = (deck, n) => `${CDN_ROOT}/${DECKS[deck]?.ver || 'v1'}/${deck}/${pad(n)}.webp`;

/** Một slide = ảnh (dùng chung 2 ngôn ngữ) + phần giảng EN/VI. */
export function slide(deck, n, title, en, vi) {
  const d = DECKS[deck];
  if (!d) throw new Error(`deck lạ: ${deck}`);
  if (n < 1 || n > d.total) throw new Error(`${deck} có ${d.total} slide, nhận ${n}`);
  return `<div class="anh-slide"><img src="${img(deck, n)}" alt="${attr(`${d.code} slide ${n}: ${title}`)}" loading="lazy" width="${d.w}" height="${d.h}" />` +
    `<p class="chu-thich">📑 <strong>${esc(d.code)}</strong> · slide ${n}/${d.total} — ${esc(title)}</p></div>\n` +
    `<div class="ml-en giang">${en}</div>\n<div class="ml-vi giang">${vi}</div>`;
}

/** Một dãy slide: rows = [[n, title, en, vi], …]. */
export const walk = (deck, rows) => rows.map((r) => slide(deck, ...r)).join('\n');

/** Tiêu đề mở đầu phần học theo slide. */
export function walkHead(deck, from, to, noteEn = '', noteVi = '') {
  const d = DECKS[deck];
  return `<div class="ml-en"><h2>📑 Slide by slide — ${esc(d.code)} (${esc(d.en)}), slides ${from}–${to}</h2>` +
    `<p>Each slide is shown first, then what it means, how to remember it, and the traps. ${noteEn}</p></div>\n` +
    `<div class="ml-vi"><h2>📑 Học theo từng slide — ${esc(d.code)} (${esc(d.vi)}), slide ${from}–${to}</h2>` +
    `<p>Mỗi slide hiện trước, ngay dưới là giải thích ý nghĩa, cách nhớ và bẫy hay gặp. ${noteVi}</p></div>`;
}

export const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
