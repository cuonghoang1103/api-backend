/**
 * _slides.mjs — khối dựng chung cho các bài học theo-từng-slide của NWC204.
 *
 * ⚠️ KHÁC mọi môn slide trước đó: slide của môn này do CHÚNG TA tự thiết kế,
 * KHÔNG phải slide của thầy cô. Lý do: FLM không đăng file slide nào cho
 * NWC204 (đã kiểm 20/09/2026 — trang syllabus 14520 không có một link tải nào),
 * và bộ slide CCNA gốc là tài liệu bản quyền của Cisco trên netacad, không
 * được phát hành lại công khai. Vì vậy phần chú thích dưới ảnh phải ghi
 * "slide do cuongthai.com dựng", đừng ghi "slide của thầy".
 *
 * Nguồn ảnh: scripts/slides-src/nwc204-*.mjs → scripts/_render-slides.mjs →
 * scripts/upload-academy-slides.mjs → R2:
 *   images/academy/NWC204/v1/<deck>/<NNN>.webp
 * ⚠️ Sửa slide thì phải render sang prefix MỚI (v2…) — Cloudflare giữ cache
 * bytes của key đã ghi đè.
 *
 * Slide viết HOÀN TOÀN BẰNG TIẾNG ANH (người học yêu cầu: "Slide full hoàn
 * toàn bằng tiếng anh chuyên nghiệp"). Phần giảng song ngữ nằm DƯỚI ảnh.
 * Slide phải thiên về SƠ ĐỒ — người học nói thẳng: "chữ nhiều quá học rất
 * chán + không hiểu lắm vì bài giảng bên dưới của bạn cũng là chữ rồi".
 *
 * Thư mục này nằm ở độ sâu 2 dưới content/academy nên vòng seed của deploy
 * (chỉ quét content/academy/*.mjs) không nhầm nó là spec môn.
 */
export const CDN_ROOT = 'https://media.cuongthai.com/images/academy/NWC204';

export const DECKS = {};

/**
 * Mỗi file chương tự khai deck của mình rồi mới dùng slide()/walk().
 * meta = { code, en, vi, total, w = 1280, h = 720, ver = 'v1' }
 * `total` PHẢI bằng đúng số ảnh đã render, nếu không slide() sẽ ném lỗi —
 * đó là chốt chặn để bài không trỏ vào ảnh không tồn tại.
 */
export function registerDeck(key, meta) {
  const m = { w: 1280, h: 720, ver: 'v1', ...meta };
  if (DECKS[key] && JSON.stringify(DECKS[key]) !== JSON.stringify(m)) {
    throw new Error(`deck ${key} đã khai khác trước đó`);
  }
  DECKS[key] = m;
  return key;
}

const pad = (n) => String(n).padStart(3, '0');
const attr = (s) => String(s).replace(/<[^>]+>/g, '').replace(/&/g, '&amp;').replace(/"/g, '&quot;');

/** Đường dẫn công khai của một ảnh slide. */
export const img = (deck, n) => `${CDN_ROOT}/${DECKS[deck]?.ver || 'v1'}/${deck}/${pad(n)}.webp`;

/**
 * Một slide = ảnh (dùng chung cho cả hai ngôn ngữ nên chỉ tải một lần)
 * + phần giảng EN/VI đi kèm. `title` là chữ thuần, không thẻ.
 */
export function slide(deck, n, title, en, vi) {
  const d = DECKS[deck];
  if (!d) throw new Error(`chưa khai deck ${deck} — gọi registerDeck() trước`);
  if (n < 1 || n > d.total) throw new Error(`deck ${deck} có ${d.total} slide, nhận ${n}`);
  return `<div class="anh-slide"><img src="${img(deck, n)}" alt="${attr(`${d.code} slide ${n}: ${title}`)}" loading="lazy" width="${d.w}" height="${d.h}" />` +
    `<p class="chu-thich">📑 <strong>${d.code}</strong> · slide ${n}/${d.total} — ${title}</p></div>\n` +
    `<div class="ml-en giang">${en}</div>\n<div class="ml-vi giang">${vi}</div>`;
}

/** Một loạt slide: rows = [[n, title, en, vi], …]. */
export const walk = (deck, rows) => rows.map((r) => slide(deck, ...r)).join('\n');

/** Mở đầu một mạch slide — nói rõ slide do ta dựng, không phải của trường. */
export function walkHead(deck, from, to, noteEn = '', noteVi = '') {
  const d = DECKS[deck];
  return `<div class="ml-en"><h2>📑 Slide by slide — ${d.code} (${d.en}), slides ${from}–${to}</h2>` +
    `<p>FPT does not publish a slide deck for NWC204 on FLM, and the original CCNA decks are Cisco's own material on netacad. These slides were therefore <strong>designed for this site</strong>, following the exact session plan of FLM Syllabus 14520. Each slide is followed by what it means, how to check it on a real machine, and the mistakes people actually make. ${noteEn}</p></div>\n` +
    `<div class="ml-vi"><h2>📑 Học theo từng slide — ${d.code} (${d.vi}), slide ${from}–${to}</h2>` +
    `<p>FLM KHÔNG đăng bộ slide nào cho NWC204, còn slide CCNA gốc là tài liệu bản quyền của Cisco trên netacad. Vì vậy bộ slide này <strong>do cuongthai.com tự thiết kế</strong>, bám đúng kế hoạch 60 buổi của Syllabus FLM 14520. Dưới mỗi slide là phần giải nghĩa, cách tự kiểm trên máy thật, và những lỗi người học hay mắc. ${noteVi}</p></div>`;
}

/** Cặp khối song ngữ. */
export const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;

/** Dòng đáp án cho slide dạng câu hỏi. */
export const ansEn = (letter, why) => `<p class="dap-an">✅ <strong>Answer: ${letter}.</strong> ${why}</p>`;
export const ansVi = (letter, why) => `<p class="dap-an">✅ <strong>Đáp án: ${letter}.</strong> ${why}</p>`;

/**
 * Câu hỏi kiến tạo của trường cho đúng buổi đó (bảng cauHoiKienTao trong
 * _syllabus-flm/NWC204.json). rows = [[ 'CQ1.1', 'nguyên văn', 'bản dịch' ], …]
 */
export function cq(buoi, rows) {
  const li = (i) => rows.map((r) => `<li><strong>${r[0]}</strong> — ${r[i]}</li>`).join('');
  return `<div class="ml-en"><h3>💬 The school's constructive questions — session ${buoi}</h3>` +
    `<p>These are the questions FPT lists for this session, quoted exactly. Answer them out loud before you read on.</p><ul>${li(1)}</ul></div>\n` +
    `<div class="ml-vi"><h3>💬 Câu hỏi kiến tạo của trường — buổi ${buoi}</h3>` +
    `<p>Đây là câu hỏi trường ghi cho đúng buổi này, trích nguyên văn. Tự trả lời thành lời trước khi đọc tiếp.</p><ul>${li(2)}</ul></div>`;
}

/**
 * Thẻ sách cho môn này. Cả 5 tài liệu của FLM đều là của Cisco, KHÔNG có
 * ISBN và KHÔNG có link ⇒ đều dùng .the-sach.khong-link. Đừng gắn link đoán.
 */
export const SACH = {
  slides: { ten: 'CCNA: Introduction to Networks — Slides', tacGia: 'Cisco', nhan: ['chinh'], ghi: 'Trường đánh "giáo trình chính". Chỉ mở được trong netacad.com sau khi trường cấp lớp — FLM không cho link.' },
  elearn: { ten: 'CCNA ITN — E-Learning Content: 17 modules', tacGia: 'Cisco', nhan: ['chinh'], ghi: 'Bản tự học 17 module, là xương sống của 60 buổi.' },
  video: { ten: 'CCNA ITN — 36 videos', tacGia: 'Cisco', nhan: ['chinh'], ghi: 'Trường đánh "giáo trình chính".' },
  labs: { ten: 'CCNA ITN — 24 hands-on and paper-based labs', tacGia: 'Cisco', nhan: ['tham-khao'], ghi: '⚠️ Trường đánh "KHÔNG phải giáo trình chính" dù Lab chiếm 20% điểm — chỗ chưa khớp trong syllabus gốc.' },
  pt: { ten: 'CCNA ITN — 31 Packet Tracer activities', tacGia: 'Cisco', nhan: ['tham-khao'], ghi: '⚠️ Cũng bị đánh "không phải giáo trình chính". Packet Tracer là phần mềm MIỄN PHÍ tải từ netacad — đây là thứ cần nhất để tự luyện cấu hình.' },
};
