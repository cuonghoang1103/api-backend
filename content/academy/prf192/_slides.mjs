/**
 * _slides.mjs — khối dựng bài học "theo từng slide" cho PRF192.
 *
 * Slide LẤY TỪ BỘ SLIDE THẬT của trường (10 file .pptx trong tài liệu môn,
 * Slot 00-20), chuyển bằng scripts/_pptx-to-slides.mjs (LibreOffice -> pdftoppm
 * -> webp 1280x720) rồi upload bằng scripts/upload-academy-slides.mjs:
 *   images/academy/PRF192/v1/<deck>/<NNN>.webp
 * Sửa/đổi slide phải render sang prefix MỚI (v2…) vì Cloudflare giữ cache.
 *
 * Markup dùng đúng class sống trong globals.css: .anh-slide / .chu-thich /
 * .giang (🎯 .y-chinh · .nhan · .meo · .dap-an · .pitfall).
 */
export const CDN_ROOT = 'https://media.cuongthai.com/images/academy/PRF192';

export const DECKS = {
  prf0: { code: 'PRF0', en: 'Slot 00 — Course Introduction', vi: 'Slot 00 — Giới thiệu môn học', total: 17, w: 1280, h: 720 },
  prf1: { code: 'PRF1', en: 'Slot 01 — Introduction to Programming Fundamentals with C', vi: 'Slot 01 — Nhập môn lập trình với C', total: 45, w: 1280, h: 720 },
  prf2: { code: 'PRF2', en: 'Slot 02-04 — Basic Computation', vi: 'Slot 02-04 — Tính toán cơ bản (biến, kiểu, toán tử, I/O)', total: 62, w: 1280, h: 720 },
  prf3: { code: 'PRF3', en: 'Slot 05-07 — Basic Logics', vi: 'Slot 05-07 — Cấu trúc điều khiển (if, switch, vòng lặp)', total: 60, w: 1280, h: 720 },
  prf4: { code: 'PRF4', en: 'Slot 08-09 — Modules & Functions', vi: 'Slot 08-09 — Hàm & module', total: 71, w: 1280, h: 720 },
  prf5: { code: 'PRF5', en: 'Slot 10 — Pointers', vi: 'Slot 10 — Con trỏ', total: 35, w: 1280, h: 720 },
  prf6: { code: 'PRF6', en: 'Slot 11-12 — Libraries', vi: 'Slot 11-12 — Thư viện chuẩn C', total: 65, w: 1280, h: 720 },
  prf7: { code: 'PRF7', en: 'Slot 13-15 — Contiguous Storage', vi: 'Slot 13-15 — Mảng & struct', total: 70, w: 1280, h: 720 },
  prf8: { code: 'PRF8', en: 'Slot 16-18 — Strings', vi: 'Slot 16-18 — Chuỗi ký tự', total: 49, w: 1280, h: 720 },
  prf9: { code: 'PRF9', en: 'Slot 19-20 — Files', vi: 'Slot 19-20 — Tệp tin', total: 42, w: 1280, h: 720 },
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
