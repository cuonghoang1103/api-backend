/**
 * _slides.mjs — khối dựng bài học "theo từng slide" cho CEA201.
 *
 * Slide LẤY TỪ BỘ SLIDE THẬT của trường: 21 file CH01..CH21-COA11e.pptx, bộ
 * slide chính hãng đi kèm giáo trình Stallings "Computer Organization and
 * Architecture: Designing for Performance", 11th Edition Global Edition.
 * Chuyển bằng scripts/_pptx-to-slides.mjs rồi upload bằng
 * scripts/upload-academy-slides.mjs:
 *   images/academy/CEA201/v1/<deck>/<NNN>.webp
 * Sửa/đổi slide phải render sang prefix MỚI (v2…) vì Cloudflare giữ cache.
 *
 *
 * ⚠️⚠️ SYLLABUS CỦA TRƯỜNG ĐÁNH SỐ CHƯƠNG THEO BẢN 9th ed, SLIDE LÀ 11th ed —
 * lệch nhau từ chương 4 trở đi. Bảng quy đổi (syllabus -> deck):
 *   Ch1 Introduction          -> cea1
 *   Ch2 Evolution&Performance -> cea1 + cea2
 *   Ch3 Top-Level View        -> cea3
 *   Ch4 Cache Memory          -> cea4 + cea5
 *   Ch5 Internal Memory       -> cea6
 *   Ch6 External Memory       -> cea7
 *   Ch7 Input/Output          -> cea8
 *   Ch8 OS Support            -> cea9
 *   Ch11 Digital Logic        -> cea12
 *   Ch12 Instruction Sets     -> cea13
 *   Ch13 Addressing Modes     -> cea14
 *   Ch14 Processor Structure  -> cea16
 *   Ch15 RISC                 -> cea17
 *   Ch16 ILP & Superscalar    -> cea18
 *   Ch17 Parallel Processing  -> cea20
 *   Ch18 Multicore            -> cea21
 * Không có trong lịch học (chỉ đọc thêm): cea10 Number Systems, cea11 Computer
 * Arithmetic, cea15 Assembly Language (ứng cụm 6 buổi 39-44 "Practical
 * Assembly Language"), cea19 Control Unit Operation.
 * Bảng đầy đủ + nguồn: file GIÁO TRÌNH & SYLLABUS - CEA201 (FLM).md trong
 * ~/Documents/FPTU_Source_Slide_Syllabus/.../CEA201 - .../
 *
 * ⚠️ Bộ này tỉ lệ 4:3 (1280x960), KHÁC PRF192/CSI106 (16:9, 1280x720).
 *
 * Chữ từng slide (để viết lời giảng bám đúng slide) trích bằng
 * scripts/_pptx-text.mjs — agent KHÔNG xem được ảnh.
 *
 * Markup dùng đúng class sống trong globals.css: .anh-slide / .chu-thich /
 * .giang (🎯 .y-chinh · .nhan · .meo · .dap-an · .pitfall).
 */
export const CDN_ROOT = 'https://media.cuongthai.com/images/academy/CEA201';

export const DECKS = {
  cea1: { code: 'CEA1', en: 'Ch.1 — Basic Concepts and Computer Evolution', vi: 'Ch.1 — Khái niệm nền tảng & lịch sử tiến hoá máy tính', total: 43, w: 1280, h: 960 },
  cea2: { code: 'CEA2', en: 'Ch.2 — Performance Concepts', vi: 'Ch.2 — Khái niệm về hiệu năng', total: 33, w: 1280, h: 960 },
  cea3: { code: 'CEA3', en: 'Ch.3 — A Top-Level View of Computer Function and Interconnection', vi: 'Ch.3 — Nhìn tổng thể: chức năng máy tính & liên kết bus', total: 46, w: 1280, h: 960 },
  cea4: { code: 'CEA4', en: 'Ch.4 — The Memory Hierarchy: Locality and Performance', vi: 'Ch.4 — Phân cấp bộ nhớ: tính cục bộ & hiệu năng', total: 29, w: 1280, h: 960 },
  cea5: { code: 'CEA5', en: 'Ch.5 — Cache Memory', vi: 'Ch.5 — Bộ nhớ đệm (cache)', total: 43, w: 1280, h: 960 },
  cea6: { code: 'CEA6', en: 'Ch.6 — Internal Memory', vi: 'Ch.6 — Bộ nhớ trong', total: 40, w: 1280, h: 960 },
  cea7: { code: 'CEA7', en: 'Ch.7 — External Memory', vi: 'Ch.7 — Bộ nhớ ngoài', total: 42, w: 1280, h: 960 },
  cea8: { code: 'CEA8', en: 'Ch.8 — Input/Output', vi: 'Ch.8 — Vào/ra (I/O)', total: 50, w: 1280, h: 960 },
  cea9: { code: 'CEA9', en: 'Ch.9 — Operating System Support', vi: 'Ch.9 — Hỗ trợ của hệ điều hành', total: 51, w: 1280, h: 960 },
  cea10: { code: 'CEA10', en: 'Ch.10 — Number Systems', vi: 'Ch.10 — Hệ đếm', total: 18, w: 1280, h: 960 },
  cea11: { code: 'CEA11', en: 'Ch.11 — Computer Arithmetic', vi: 'Ch.11 — Số học máy tính', total: 55, w: 1280, h: 960 },
  cea12: { code: 'CEA12', en: 'Ch.12 — Digital Logic', vi: 'Ch.12 — Logic số', total: 56, w: 1280, h: 960 },
  cea13: { code: 'CEA13', en: 'Ch.13 — Instruction Sets: Characteristics and Functions', vi: 'Ch.13 — Tập lệnh: đặc điểm & chức năng', total: 48, w: 1280, h: 960 },
  cea14: { code: 'CEA14', en: 'Ch.14 — Instruction Sets: Addressing Modes and Formats', vi: 'Ch.14 — Tập lệnh: chế độ địa chỉ & khuôn dạng', total: 34, w: 1280, h: 960 },
  cea15: { code: 'CEA15', en: 'Ch.15 — Assembly Language and Related Topics', vi: 'Ch.15 — Hợp ngữ và các chủ đề liên quan', total: 37, w: 1280, h: 960 },
  cea16: { code: 'CEA16', en: 'Ch.16 — Processor Structure and Function', vi: 'Ch.16 — Cấu trúc & hoạt động của bộ xử lý', total: 56, w: 1280, h: 960 },
  cea17: { code: 'CEA17', en: 'Ch.17 — Reduced Instruction Set Computers', vi: 'Ch.17 — Máy tính tập lệnh rút gọn (RISC)', total: 42, w: 1280, h: 960 },
  cea18: { code: 'CEA18', en: 'Ch.18 — Instruction-Level Parallelism and Superscalar Processors', vi: 'Ch.18 — Song song mức lệnh & bộ xử lý superscalar', total: 40, w: 1280, h: 960 },
  cea19: { code: 'CEA19', en: 'Ch.19 — Control Unit Operation and Microprogrammed Control', vi: 'Ch.19 — Hoạt động khối điều khiển & vi chương trình', total: 32, w: 1280, h: 960 },
  cea20: { code: 'CEA20', en: 'Ch.20 — Parallel Processing', vi: 'Ch.20 — Xử lý song song', total: 40, w: 1280, h: 960 },
  cea21: { code: 'CEA21', en: 'Ch.21 — Multicore Computers', vi: 'Ch.21 — Máy tính đa lõi', total: 30, w: 1280, h: 960 },
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
