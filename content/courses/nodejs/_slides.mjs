/**
 * _slides.mjs — nhúng ảnh slide của khoá "Node.js" vào bài học (08/11/2026; khuôn y hệt postgresql/_slides.mjs).
 *
 * Slide tự soạn (TIẾNG ANH, dáng slide trường FU, logo CuongThai.com) — nguồn scripts/slides-src/node-NN-M.mjs
 * (khuôn _node-chung.mjs + _c7/_c8/_c9-chung.mjs; output THẬT đọc từ ~/Documents/video-bai-giang/src/khung/node/that), dựng bằng
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/node-NN-M.mjs --out <dir>
 * rồi đẩy lên R2 bằng
 *   node --env-file=.env scripts/upload-academy-slides.mjs --dir <dir> --prefix NODE/v1 --decks node-NN-M
 * ⇒ images/academy/NODE/v1/<deck>/<NNN>.webp   (cùng bộ ảnh mà video bài giảng chiếu)
 *
 * ⚠️ Prefix mang số phiên bản CÓ CHỦ ĐÍCH: Cloudflare giữ bytes CŨ cho key bị ghi đè (cache immutable 1 năm).
 * Dựng lại một deck đã đẩy ⇒ đẩy sang prefix mới (NODE/v2) và ghi deck đó vào VER — đừng ghi đè v1.
 *
 * Mỗi bài có tệp giảng riêng `giang/node-NN-M.mjs`:
 *   import { walkNode } from '../_slides.mjs';
 *   export default walkNode('node-12-2', 'Cache-aside…', 'Cache-aside…', [[n, 'Slide title', '<p>EN…</p>', '<p>VI…</p>'], …]);
 * rồi bài trong sNN-*.mjs chèn `${G122}` ở ĐẦU content (CHỈ THÊM, không xoá chữ cũ).
 */
export const CDN_ROOT = 'https://media.cuongthai.com/images/academy/NODE';

/** Deck nào đã phải dựng lại thì ghi phiên bản ở đây, vd { 'node-05-1': 'v2' }. */
const VER = { 'node-18-6': 'v2' };   // v1/node-18-6/018 bị GET qua CDN trước khi lên R2 ⇒ 404 bị Cloudflare cache (08/11) ⇒ đẩy lại cả deck sang v2

const pad = (n) => String(n).padStart(3, '0');
const attr = (s) => String(s).replace(/<[^>]+>/g, '').replace(/&/g, '&amp;').replace(/"/g, '&quot;');
export const img = (deck, n) => `${CDN_ROOT}/${VER[deck] || 'v1'}/${deck}/${pad(n)}.webp`;
const code = (deck) => deck.replace(/^node-0?(\d+)-(\d+)$/, 'Node.js $1.$2');

/** Một slide + giảng EN/VI ngay dưới. `total` = số slide của deck (walkNode tự truyền). */
export function slide(deck, n, title, en, vi, total) {
  if (!/^node-\d\d-\d+$/.test(deck)) throw new Error(`deck lạ: ${deck}`);
  if (!Number.isInteger(n) || n < 1 || n > total) throw new Error(`${deck} có ${total} slide, nhận ${n}`);
  return `<div class="anh-slide"><img src="${img(deck, n)}" alt="${attr(`${code(deck)} slide ${n}: ${title}`)}" loading="lazy" width="1280" height="720" />` +
    `<p class="chu-thich">📑 <strong>${code(deck)}</strong> · slide ${n}/${total} — ${title}</p></div>\n` +
    `<div class="ml-en giang">${en}</div>\n<div class="ml-vi giang">${vi}</div>`;
}

/**
 * Cả phần "học theo slide" của một bài: tiêu đề + mọi slide + dòng chuyển sang bài đọc chi tiết.
 * rows = [[n, title, en, vi], …] — phải phủ ĐỦ mọi slide của deck, đúng thứ tự (số slide = rows.length).
 */
export function walkNode(deck, tenEn, tenVi, rows) {
  const total = rows.length;
  const nums = rows.map((r) => r[0]);
  for (let i = 1; i <= total; i++) if (nums.filter((x) => x === i).length !== 1) throw new Error(`${deck}: slide ${i} phải có đúng một dòng giảng`);
  const head = `<div class="ml-en"><h2>📑 Slides — ${tenEn}</h2><p>Every slide of this lesson, each followed by what it means and how to remember it. The video above walks through the same slides in Vietnamese. The full written lesson, with every program and its real output, follows after the slides.</p></div>\n` +
    `<div class="ml-vi"><h2>📑 Học theo slide — ${tenVi}</h2><p>Toàn bộ slide của bài, mỗi slide kèm giải thích ý nghĩa và cách nhớ. Video phía trên giảng đúng các slide này bằng tiếng Việt. Bài đọc chi tiết (mọi chương trình kèm output thật) nằm ngay sau phần slide.</p></div>\n`;
  const tail = `\n<div class="ml-en"><h2>📖 Full written lesson</h2></div>\n<div class="ml-vi"><h2>📖 Bài đọc chi tiết</h2></div>\n`;
  return head + rows.map((r) => slide(deck, ...r, total)).join('\n') + tail;
}
