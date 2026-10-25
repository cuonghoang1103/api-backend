/**
 * _slides.mjs — nhúng ảnh slide của khoá "PostgreSQL" vào bài học (25/10/2026).
 *
 * Slide tự soạn (TIẾNG ANH, dáng slide trường FU, logo CuongThai.com), dựng bằng
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/pg-NN-M.mjs --out <dir>
 * rồi đẩy lên R2 bằng
 *   node --env-file=.env scripts/upload-academy-slides.mjs --dir <dir> --prefix PG/v1 --decks pg-NN-M
 * ⇒ images/academy/PG/v1/<deck>/<NNN>.webp
 *
 * ⚠️ Prefix mang số phiên bản CÓ CHỦ ĐÍCH: Cloudflare giữ bytes CŨ cho key bị ghi đè (cache immutable 1 năm).
 * Dựng lại một deck đã đẩy ⇒ đẩy sang prefix mới (PG/v2) và ghi deck đó vào VER — đừng ghi đè v1.
 *
 * Mỗi bài có tệp giảng riêng `giang/pg-NN-M.mjs`:
 *   import { walkPg } from '../_slides.mjs';
 *   export default walkPg('pg-09-1', 'What is an index', 'Chỉ mục là gì', [[n, 'Slide title', '<p>EN…</p>', '<p>VI…</p>'], …]);
 * rồi bài trong sNN-*.mjs chèn `${G091}` ở ĐẦU content (CHỈ THÊM, không xoá chữ cũ).
 */
export const CDN_ROOT = 'https://media.cuongthai.com/images/academy/PG';

/** Deck nào đã phải dựng lại thì ghi phiên bản ở đây, vd { 'pg-05-1': 'v2' }. */
const VER = {};

const pad = (n) => String(n).padStart(3, '0');
const attr = (s) => String(s).replace(/<[^>]+>/g, '').replace(/&/g, '&amp;').replace(/"/g, '&quot;');
export const img = (deck, n) => `${CDN_ROOT}/${VER[deck] || 'v1'}/${deck}/${pad(n)}.webp`;
const code = (deck) => deck.toUpperCase().replace(/^PG-0?(\d+)-(\d+)$/, 'PG $1.$2');

/** Một slide + giảng EN/VI ngay dưới. `total` = số slide của deck (walkPg tự truyền). */
export function slide(deck, n, title, en, vi, total) {
  if (!/^pg-(\d\d-\d+|lab-\d+|thi-[a-z0-9-]+)$/.test(deck)) throw new Error(`deck lạ: ${deck}`);
  if (!Number.isInteger(n) || n < 1 || n > total) throw new Error(`${deck} có ${total} slide, nhận ${n}`);
  return `<div class="anh-slide"><img src="${img(deck, n)}" alt="${attr(`${code(deck)} slide ${n}: ${title}`)}" loading="lazy" width="1280" height="720" />` +
    `<p class="chu-thich">📑 <strong>${code(deck)}</strong> · slide ${n}/${total} — ${title}</p></div>\n` +
    `<div class="ml-en giang">${en}</div>\n<div class="ml-vi giang">${vi}</div>`;
}

/**
 * Cả phần "học theo slide" của một bài: tiêu đề + mọi slide + dòng chuyển sang bài đọc chi tiết.
 * rows = [[n, title, en, vi], …] — phải phủ ĐỦ mọi slide của deck, đúng thứ tự (số slide = rows.length).
 */
export function walkPg(deck, tenEn, tenVi, rows) {
  const total = rows.length;   // deck có đúng bấy nhiêu slide — rows phải phủ đủ 1..total, mỗi số một lần
  const nums = rows.map((r) => r[0]);
  for (let i = 1; i <= total; i++) if (nums.filter((x) => x === i).length !== 1) throw new Error(`${deck}: slide ${i} phải có đúng một dòng giảng`);
  const head = `<div class="ml-en"><h2>📑 Slides — ${tenEn}</h2><p>Every slide of this lesson, each followed by what it means and how to remember it. The video above walks through the same slides in Vietnamese. The full written lesson with every query and its real output follows after the slides.</p></div>\n` +
    `<div class="ml-vi"><h2>📑 Học theo slide — ${tenVi}</h2><p>Toàn bộ slide của bài, mỗi slide kèm giải thích ý nghĩa và cách nhớ. Video phía trên giảng đúng các slide này bằng tiếng Việt. Bài đọc chi tiết (mọi truy vấn kèm output thật) nằm ngay sau phần slide.</p></div>\n`;
  const tail = `\n<div class="ml-en"><h2>📖 Full written lesson</h2></div>\n<div class="ml-vi"><h2>📖 Bài đọc chi tiết</h2></div>\n`;
  return head + rows.map((r) => slide(deck, ...r, total)).join('\n') + tail;
}

/** Nhãn cho bài lướt được (đường tắt, Ch2–7). */
export const NHAN_LUOT =
  `<div class="ml-en"><div class="callout ok"><p>⏩ <strong>Know SQL Server or MySQL already?</strong> You can skim this lesson — read the slides and the traps, run the examples, then move on. Start from lesson 0.5 if you have not.</p></div></div>\n` +
  `<div class="ml-vi"><div class="callout ok"><p>⏩ <strong>Đã biết SQL Server/MySQL?</strong> Có thể lướt bài này — xem slide và phần bẫy, chạy thử ví dụ rồi đi tiếp. Chưa xem bài 0.5 thì xem trước.</p></div></div>\n`;
