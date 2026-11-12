/**
 * _slides.mjs — nhúng ảnh slide của khoá "API Design" vào bài học (31/10/2026). Chép khuôn từ postgresql/_slides.mjs.
 *
 * Slide tự soạn (TIẾNG ANH, dáng slide trường FU, logo CuongThai.com), dựng bằng
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/api-NN-M.mjs --out <dir>
 * rồi đẩy lên R2 bằng
 *   node --env-file=.env scripts/upload-academy-slides.mjs --dir <dir> --prefix API/v1 --decks api-NN-M
 * ⇒ images/academy/API/v1/<deck>/<NNN>.webp
 *
 * ⚠️ Prefix mang số phiên bản CÓ CHỦ ĐÍCH: Cloudflare giữ bytes CŨ cho key bị ghi đè (cache immutable 1 năm).
 * Dựng lại một deck đã đẩy ⇒ đẩy sang prefix mới (API/v2) và ghi deck đó vào VER — đừng ghi đè v1.
 *
 * Mỗi bài có tệp giảng riêng `giang/api-NN-M.mjs`:
 *   import { walkApi } from '../_slides.mjs';
 *   export default walkApi('api-01-1', 'Resources', 'Tài nguyên', [[n, 'Slide title', '<p>EN…</p>', '<p>VI…</p>'], …]);
 * rồi bài trong sNN-*.mjs chèn `${G011}` ở ĐẦU content.
 */
export const CDN_ROOT = 'https://media.cuongthai.com/images/academy/API';

/** Deck nào đã phải dựng lại thì ghi phiên bản ở đây, vd { 'pg-05-1': 'v2' }. */
const VER = { 'api-01-3': 'v2', 'api-02-3': 'v2', 'api-03-3': 'v2', 'api-04-2': 'v2', 'api-05-1': 'v2', 'api-08-3': 'v2', 'api-10-6': 'v2', 'api-lab-10': 'v2' };

const pad = (n) => String(n).padStart(3, '0');
const attr = (s) => String(s).replace(/<[^>]+>/g, '').replace(/&/g, '&amp;').replace(/"/g, '&quot;');
export const img = (deck, n) => `${CDN_ROOT}/${VER[deck] || 'v1'}/${deck}/${pad(n)}.webp`;
const code = (deck) => deck.toUpperCase().replace(/^API-0?(\d+)-(\d+)$/, 'API $1.$2').replace(/^API-LAB-(\d+)$/, 'API Lab $1');

/** Một slide + giảng EN/VI ngay dưới. `total` = số slide của deck (walkPg tự truyền). */
export function slide(deck, n, title, en, vi, total) {
  if (!/^api-(\d\d-\d+|lab-\d+)$/.test(deck)) throw new Error(`deck lạ: ${deck}`);
  if (!Number.isInteger(n) || n < 1 || n > total) throw new Error(`${deck} có ${total} slide, nhận ${n}`);
  return `<div class="anh-slide"><img src="${img(deck, n)}" alt="${attr(`${code(deck)} slide ${n}: ${title}`)}" loading="lazy" width="1280" height="720" />` +
    `<p class="chu-thich">📑 <strong>${code(deck)}</strong> · slide ${n}/${total} — ${title}</p></div>\n` +
    `<div class="ml-en giang">${en}</div>\n<div class="ml-vi giang">${vi}</div>`;
}

/**
 * Cả phần "học theo slide" của một bài: tiêu đề + mọi slide + dòng chuyển sang bài đọc chi tiết.
 * rows = [[n, title, en, vi], …] — phải phủ ĐỦ mọi slide của deck, đúng thứ tự (số slide = rows.length).
 */
export function walkApi(deck, tenEn, tenVi, rows) {
  const total = rows.length;   // deck có đúng bấy nhiêu slide — rows phải phủ đủ 1..total, mỗi số một lần
  const nums = rows.map((r) => r[0]);
  for (let i = 1; i <= total; i++) if (nums.filter((x) => x === i).length !== 1) throw new Error(`${deck}: slide ${i} phải có đúng một dòng giảng`);
  const head = `<div class="ml-en"><h2>📑 Slides — ${tenEn}</h2><p>Every slide of this lesson, each followed by what it means and how to remember it. The full written lesson — every command with its real output — follows after the slides.</p></div>\n` +
    `<div class="ml-vi"><h2>📑 Học theo slide — ${tenVi}</h2><p>Toàn bộ slide của bài, mỗi slide kèm giải thích ý nghĩa và cách nhớ. Bài đọc chi tiết (mọi lệnh kèm output chạy thật) nằm ngay sau phần slide.</p></div>\n`;
  const tail = `\n<div class="ml-en"><h2>📖 Full written lesson</h2></div>\n<div class="ml-vi"><h2>📖 Bài đọc chi tiết</h2></div>\n`;
  return head + rows.map((r) => slide(deck, ...r, total)).join('\n') + tail;
}
