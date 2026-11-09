/**
 * _goc.mjs — nhúng SLIDE GỐC của trường (FPT University, SDN302) vào bài học, kèm giảng EN/VI từng slide (09/11/2026).
 *
 * Nguồn: ~/Documents/FLM-nguon/SDN302/goc/{1,2,3}_SDN302_Slides_*.zip (19 tệp .pptx, 599 slide nhìn thấy, không slide ẩn).
 * Dựng ảnh: soffice --headless --convert-to pdf ⇒ pdftoppm -scale-to-x 1280 ⇒ cwebp -q 82 (1280×720), bản đồ deck ↔ tệp
 * ở flm-nguon/SDN302/deck-map.json. Đẩy R2:
 *   node --env-file=.env scripts/upload-academy-slides.mjs --dir ~/Documents/FLM-nguon/SDN302/img --prefix SDN302/goc-v1
 * ⇒ images/academy/SDN302/goc-v1/<deck>/<NNN>.webp
 *
 * ⚠️ Prefix mang phiên bản CÓ CHỦ ĐÍCH (Cloudflare giữ bytes cũ của key bị ghi đè). Dựng lại một deck ⇒ prefix mới
 * (goc-v2) + ghi `ver` cho deck đó trong GOC — đừng ghi đè goc-v1. Đừng GET ảnh qua media.cuongthai.com trước khi đẩy.
 *
 * Slide tự soạn (khuôn _slides.mjs, deck sdn-NN-M) vẫn giữ ở các bài "⭐ Chuyên sâu" — tệp này CHỈ cho slide của trường.
 *
 * Mỗi deck một tệp `goc/<deck>.mjs`:
 *   import { walkGoc } from '../_goc.mjs';
 *   export default walkGoc('g3-1', [[n, 'Slide title', '<p>EN…</p>', '<p>VI…</p>'], …]);   // phủ ĐỦ mọi slide, đúng thứ tự
 */
export const CDN_ROOT = 'https://media.cuongthai.com/images/academy/SDN302';

const D = (slot, en, vi, total, file) => ({ slot, en, vi, total, file });
export const GOC = {
  'g00': D('Course Introduction', 'Course introduction', 'Giới thiệu môn học', 15, 'Course-Introduction.pptx'),
  'g1-1': D('Slot 1.1', 'What is back-end development?', 'Back-end development là gì?', 18, 'Slot1.1_What-is-Back-End-Development.pptx'),
  'g1-2': D('Slot 1.2', 'NodeJS', 'NodeJS', 37, 'Slot1.2_NodeJS.pptx'),
  'g2-1': D('Slot 2.1', 'Using API', 'Dùng API', 28, 'Slot2.1_API.pptx'),
  'g2-2': D('Slot 2.2', 'Node & HTTP', 'Node & HTTP', 52, 'Slot2.2_Node&Http.pptx'),
  'g3-1': D('Slot 3.1', 'ExpressJS', 'ExpressJS', 51, 'Slot3.1_ExpressJS.pptx'),
  'g3-2': D('Slot 3.2', 'NoSQL database with MongoDB', 'CSDL NoSQL với MongoDB', 53, 'Slot3.2_NoSQL-Database-With-MongoDB.pptx'),
  'g3-3': D('Slot 3.3', 'NodeJS with MongoDB', 'NodeJS với MongoDB', 46, 'Slot3.3_NodeJS-with-MongoDB.pptx'),
  'g4-1': D('Slot 4.1', 'Mongoose', 'Mongoose', 36, 'Slot4.1_Mongoose.pptx'),
  'g5-1': D('Slot 5.1', 'Mongoose population', 'Mongoose population', 18, 'Slot5.1_Mongoose Population.pptx'),
  'g6': D('Slot 6', 'RESTful API with Express, MongoDB and Mongoose', 'RESTful API với Express, MongoDB và Mongoose', 22, 'Slot6_RestfulApi-with-Express-mongodb-and-mongoose.pptx'),
  'g7': D('Slot 7', 'EJS (Embedded JavaScript)', 'EJS (Embedded JavaScript)', 21, 'Slot7_EJS(EmbbedJavascript).pptx'),
  'g8': D('Slot 8', 'Handlebars', 'Handlebars', 16, 'Slot8_HandleBars.pptx'),
  'g9-10': D('Slot 9–10', 'Authentication and security', 'Xác thực và bảo mật', 64, 'Slot9-10_Authentication_and_Security.pptx'),
  'g11': D('Slot 11', 'HTTPS — secure communication', 'HTTPS — giao tiếp an toàn', 24, 'Slot11_HTTPS_Secure-communication.pptx'),
  'g12': D('Slot 12', 'Upload and download files', 'Upload và download file', 21, 'Slot12_Upload-Download-Files.pptx'),
  'g13': D('Slot 13', 'CORS', 'CORS', 13, 'Slot13_Cors.pptx'),
  'g15-16': D('Slot 15–16', 'Backend as a Service (BaaS)', 'Backend as a Service (BaaS)', 32, 'Slot15-16_Backend-as-a-Service-(BaaS).pptx'),
  'g17-19': D('Slot 17–19', 'Frameworks: NestJS and Hono', 'Framework: NestJS và Hono', 32, 'Slot17-18-19_Frameworks-NestJS-Hono.pptx'),
};

const pad = (n) => String(n).padStart(3, '0');
const attr = (s) => String(s).replace(/<[^>]+>/g, '').replace(/&/g, '&amp;').replace(/"/g, '&quot;');
export const imgGoc = (deck, n) => `${CDN_ROOT}/${GOC[deck]?.ver || 'goc-v1'}/${deck}/${pad(n)}.webp`;

/** Một slide gốc + giảng EN/VI ngay dưới. */
export function slideGoc(deck, n, title, en, vi) {
  const d = GOC[deck];
  if (!d) throw new Error(`deck gốc lạ: ${deck}`);
  if (!Number.isInteger(n) || n < 1 || n > d.total) throw new Error(`${deck} có ${d.total} slide, nhận ${n}`);
  const code = `SDN302 · ${d.slot}`;
  return `<div class="anh-slide"><img src="${imgGoc(deck, n)}" alt="${attr(`${code} slide ${n}: ${title}`)}" loading="lazy" width="1280" height="720" />` +
    `<p class="chu-thich">📑 <strong>${code}</strong> · slide ${n}/${d.total} — ${title}</p></div>\n` +
    `<div class="ml-en giang">${en}</div>\n<div class="ml-vi giang">${vi}</div>`;
}

/**
 * Cả phần "📑 Học theo slide gốc" của một deck: tiêu đề + mọi slide (đủ, đúng thứ tự).
 * rows = [[n, title, en, vi], …]
 */
export function walkGoc(deck, rows) {
  const d = GOC[deck];
  if (!d) throw new Error(`deck gốc lạ: ${deck}`);
  if (rows.length !== d.total) throw new Error(`${deck}: cần ${d.total} dòng giảng, có ${rows.length}`);
  rows.forEach((r, i) => { if (r[0] !== i + 1) throw new Error(`${deck}: dòng ${i + 1} mang số slide ${r[0]}`); });
  const head = `<div class="ml-en"><h2>📑 Official slides — ${d.slot}: ${d.en}</h2><p>These are the <strong>school's own slides</strong> for this slot (FPT University, SDN302 — the deck <em>${d.file}</em>), every slide in order. Under each slide: what it means in plain words, the English terms explained, and — where the slide shows code — the code explained line by line and what it really prints. This is the main study path for the exams; the "⭐ Deep dive" lessons go further.</p></div>\n` +
    `<div class="ml-vi"><h2>📑 Học theo slide gốc — ${d.slot}: ${d.vi}</h2><p>Đây là <strong>slide của trường</strong> cho buổi này (FPT University, SDN302 — tệp <em>${d.file}</em>), đủ mọi slide, đúng thứ tự. Dưới mỗi slide: ý nghĩa bằng lời dễ hiểu, giải nghĩa thuật ngữ tiếng Anh, và — slide nào có code — giải thích từng dòng và output thật. Đây là đường học CHÍNH để thi; các bài "⭐ Chuyên sâu" đi sâu hơn.</p></div>\n`;
  return head + rows.map((r) => slideGoc(deck, ...r)).join('\n');
}

/** Hộp liên kết cuối bài gốc: [[href, nhãn EN, nhãn VI], …] */
export function lienKet(items) {
  const li = (lang) => items.map(([href, en, vi]) => `<li><a href="${href}">${lang === 'en' ? en : vi}</a></li>`).join('');
  return `<div class="ml-en"><div class="callout"><strong>Go further</strong><ul>${li('en')}</ul></div></div>\n` +
    `<div class="ml-vi"><div class="callout"><strong>Học sâu thêm</strong><ul>${li('vi')}</ul></div></div>`;
}
