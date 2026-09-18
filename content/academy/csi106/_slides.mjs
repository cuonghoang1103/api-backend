/**
 * _slides.mjs — khối dựng bài học "theo từng slide" cho CSI106.
 *
 * Slide LẤY TỪ BỘ SLIDE THẬT của trường (12 file .pptx CSI_01..CSI_12 trong
 * tài liệu môn, bám giáo trình Forouzan "Foundations of Computer Science"),
 * chuyển bằng scripts/_pptx-to-slides.mjs (LibreOffice -> pdftoppm -> webp)
 * rồi upload bằng scripts/upload-academy-slides.mjs:
 *   images/academy/CSI106/v1/<deck>/<NNN>.webp
 * Sửa/đổi slide phải render sang prefix MỚI (v2…) vì Cloudflare giữ cache.
 *
 * Chữ từng slide (để viết lời giảng bám đúng slide) trích bằng
 * scripts/_pptx-text.mjs — agent KHÔNG xem được ảnh.
 *
 * Markup dùng đúng class sống trong globals.css: .anh-slide / .chu-thich /
 * .giang (🎯 .y-chinh · .nhan · .meo · .dap-an · .pitfall).
 */
export const CDN_ROOT = 'https://media.cuongthai.com/images/academy/CSI106';

export const DECKS = {
  csi1: { code: 'CSI1', en: 'Ch.1 — Computer Organization', vi: 'Ch.1 — Tổ chức máy tính', total: 59, w: 1280, h: 720 },
  csi2: { code: 'CSI2', en: 'Ch.2 — Numbering systems', vi: 'Ch.2 — Hệ đếm', total: 21, w: 1280, h: 720 },
  csi3: { code: 'CSI3', en: 'Ch.3 — Data storage & operations', vi: 'Ch.3 — Lưu trữ & thao tác dữ liệu', total: 54, w: 1280, h: 720 },
  csi4: { code: 'CSI4', en: 'Ch.4 — Computer Networks and Internet', vi: 'Ch.4 — Mạng máy tính & Internet', total: 32, w: 1280, h: 720 },
  csi5: { code: 'CSI5', en: 'Ch.5 — Operating System', vi: 'Ch.5 — Hệ điều hành', total: 33, w: 1280, h: 720 },
  csi6: { code: 'CSI6', en: 'Ch.6 — Algorithms', vi: 'Ch.6 — Thuật toán', total: 30, w: 1280, h: 720 },
  csi7: { code: 'CSI7', en: 'Ch.7 — Programming', vi: 'Ch.7 — Lập trình', total: 25, w: 1280, h: 720 },
  csi8: { code: 'CSI8', en: 'Ch.8 — Software engineering', vi: 'Ch.8 — Công nghệ phần mềm', total: 30, w: 1280, h: 720 },
  csi9: { code: 'CSI9', en: 'Ch.9 — Data structures', vi: 'Ch.9 — Cấu trúc dữ liệu', total: 37, w: 1280, h: 720 },
  csi10: { code: 'CSI10', en: 'Ch.10 — File structure', vi: 'Ch.10 — Cấu trúc tệp', total: 17, w: 1280, h: 720 },
  csi11: { code: 'CSI11', en: 'Ch.11 — Databases', vi: 'Ch.11 — Cơ sở dữ liệu', total: 42, w: 1280, h: 720 },
  csi12: { code: 'CSI12', en: 'Ch.12 — Security and Ethical Issues', vi: 'Ch.12 — An toàn & vấn đề đạo đức', total: 27, w: 1280, h: 720 },
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
