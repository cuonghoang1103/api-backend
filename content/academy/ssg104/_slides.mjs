/**
 * _slides.mjs — khối dựng sẵn cho các bài học theo từng slide của SSG104.
 *
 * Nguồn ảnh: 21 bộ .pptx của trường trong "Download All Student Material"
 * (FLM, syllabus 11845), render bằng soffice → pdftoppm 1280px → webp q82 và
 * đẩy lên R2 bằng scripts/upload-academy-slides.mjs:
 *   images/academy/SSG104/v1/<deck>/<NNN>.webp
 *
 * KHOÁ DECK ĐẶT THEO GIÁO TRÌNH, không theo tên file: `s<buổi>-l<bài>`, vì
 * chính tên file của trường đã ghi "Session 3_..._Lesson 12_Conflict and
 * Negotiation" — giữ đúng cặp số đó thì mỗi bài trong Academy chỉ rõ được nó
 * ứng với buổi nào, bài nào của syllabus. Hai file cùng đánh "Lesson 14"
 * (Nonverbal communication và Persuasive presentation) là lỗi đánh số của
 * trường; theo thứ tự buổi thì cái sau là bài 15, nên nó nằm ở `s4-l15`.
 *
 * Markup dùng lại đúng lớp CSS đã có: .anh-slide / .chu-thich cho ảnh, .giang
 * cho khối giảng (🎯 .y-chinh · .nhan · ul/ol một ý một dòng · .meo · .dap-an
 * · .pitfall) — không bao giờ nhồi cả đoạn dài vào một dòng.
 * Thư mục nằm ở độ sâu 2 dưới content/academy nên vòng seed khi deploy
 * (content/academy/*.mjs) không nhầm các module này là spec môn học.
 */
export const CDN_ROOT = 'https://media.cuongthai.com/images/academy/SSG104';

export const DECKS = {
  // Buổi 1 — Tổng quan nhóm & đội
  's1-l1': { code: 'S1 · Lesson 1', en: 'Defining Teams and Groups', vi: 'Định nghĩa nhóm và đội', total: 41, w: 1280, h: 721 },
  's1-l2': { code: 'S1 · Lesson 2', en: 'Cooperation', vi: 'Hợp tác', total: 12, w: 1280, h: 720 },
  's1-l3': { code: 'S1 · Lesson 3', en: 'The Psychology of Groups', vi: 'Tâm lý học nhóm', total: 22, w: 1280, h: 720 },
  's1-l4': { code: 'S1 · Lesson 4', en: 'Social Comparison', vi: 'So sánh xã hội', total: 28, w: 1280, h: 720 },
  // Buổi 2 — Tư duy & phân tích
  's2-l5-6': { code: 'S2 · Lesson 5–6', en: 'Patterns of Thought & Creative Thinking', vi: 'Lối tư duy & tư duy sáng tạo', total: 36, w: 1280, h: 720 },
  's2-l7': { code: 'S2 · Lesson 7', en: 'Business Proposal', vi: 'Đề xuất kinh doanh', total: 20, w: 1280, h: 720 },
  's2-l7-cont': { code: 'S2 · Lesson 7 (tiếp)', en: 'Business Proposal (cont.)', vi: 'Đề xuất kinh doanh (tiếp)', total: 18, w: 1280, h: 720 },
  's2-l8': { code: 'S2 · Lesson 8', en: 'Critical Thinking Skills', vi: 'Kỹ năng tư duy phản biện', total: 24, w: 1280, h: 720 },
  // Buổi 3 — Lý thuyết nhóm & đội
  's3-l9': { code: 'S3 · Lesson 9', en: 'Power in Teams and Groups', vi: 'Quyền lực trong nhóm và đội', total: 31, w: 1280, h: 720 },
  's3-l10-11': { code: 'S3 · Lesson 10–11', en: 'Leadership & Working in Diverse Teams', vi: 'Lãnh đạo & làm việc trong đội đa dạng', total: 36, w: 1280, h: 720 },
  's3-l12': { code: 'S3 · Lesson 12', en: 'Conflict and Negotiation', vi: 'Xung đột và thương lượng', total: 24, w: 1280, h: 720 },
  's3-l13': { code: 'S3 · Lesson 13', en: 'Handling stress in groups', vi: 'Xử lý căng thẳng trong nhóm', total: 22, w: 1280, h: 720 },
  // Buổi 4 — Nhóm & đội trong hành động
  's4-l14': { code: 'S4 · Lesson 14', en: 'Nonverbal communication', vi: 'Giao tiếp phi ngôn ngữ', total: 23, w: 1280, h: 720 },
  's4-l15': { code: 'S4 · Lesson 15', en: 'Persuasive presentation', vi: 'Thuyết trình thuyết phục', total: 20, w: 1280, h: 720 },
  's4-l16': { code: 'S4 · Lesson 16', en: 'Meetings', vi: 'Cuộc họp', total: 21, w: 1280, h: 720 },
  's4-l17': { code: 'S4 · Lesson 17', en: 'Professional writing', vi: 'Viết chuyên nghiệp', total: 23, w: 1280, h: 720 },
  's4-l18': { code: 'S4 · Lesson 18', en: 'Business Email & Letter', vi: 'Email & thư công việc', total: 21, w: 1280, h: 720 },
  's4-l19': { code: 'S4 · Lesson 19', en: 'Report', vi: 'Báo cáo', total: 16, w: 1280, h: 720 },
  // Buổi 5 — Khám phá nghề nghiệp
  's5-l20': { code: 'S5 · Lesson 20', en: 'Career development & Career skills', vi: 'Phát triển nghề nghiệp & kỹ năng nghề', total: 16, w: 1280, h: 720 },
  's5-l21-22': { code: 'S5 · Lesson 21–22', en: 'Resume & Cover Letter', vi: 'CV & thư xin việc', total: 31, w: 1280, h: 720 },
  's5-l23': { code: 'S5 · Lesson 23', en: 'Job Interview Preparation', vi: 'Chuẩn bị phỏng vấn xin việc', total: 19, w: 1280, h: 720 },
};

const pad = (n) => String(n).padStart(3, '0');
const attr = (s) => String(s).replace(/<[^>]+>/g, '').replace(/&/g, '&amp;').replace(/"/g, '&quot;');

/** URL công khai của một trang slide. */
export const img = (deck, n) => `${CDN_ROOT}/${DECKS[deck]?.ver || 'v1'}/${deck}/${pad(n)}.webp`;

/**
 * Một slide = ảnh (dùng chung cho cả hai ngôn ngữ nên chỉ tải một lần) rồi
 * đến cặp giảng EN/VI. `title` là chữ thật trên slide, không phải tôi đặt.
 */
export function slide(deck, n, title, en, vi) {
  const d = DECKS[deck];
  if (!d) throw new Error(`deck lạ: ${deck}`);
  if (n < 1 || n > d.total) throw new Error(`${deck} có ${d.total} trang, nhận ${n}`);
  return `<div class="anh-slide"><img src="${img(deck, n)}" alt="${attr(`${d.code} slide ${n}: ${title}`)}" loading="lazy" width="${d.w}" height="${d.h}" />` +
    `<p class="chu-thich">📑 <strong>${d.code}</strong> · slide ${n}/${d.total} — ${title}</p></div>\n` +
    `<div class="ml-en giang">${en}</div>\n<div class="ml-vi giang">${vi}</div>`;
}

/** Một dãy slide liên tiếp: rows = [[n, title, en, vi], …]. */
export const walk = (deck, rows) => rows.map((r) => slide(deck, ...r)).join('\n');

/** Dòng đáp án cho slide có câu hỏi trên lớp. */
export const ansEn = (letter, why) => `<p class="dap-an">✅ <strong>Answer: ${letter}.</strong> ${why}</p>`;
export const ansVi = (letter, why) => `<p class="dap-an">✅ <strong>Đáp án: ${letter}.</strong> ${why}</p>`;

/** Tiêu đề mở đầu một lượt đi qua slide. */
export function walkHead(deck, from, to, noteEn = '', noteVi = '') {
  const d = DECKS[deck];
  return `<div class="ml-en"><h2>📑 Slide by slide — ${d.code} (${d.en}), slides ${from}–${to}</h2>` +
    `<p>Open the lecturer's own deck next to this page. Every slide appears exactly as in class, followed by what it means, how to remember it, and — for every question slide — the answer with the reasoning. ${noteEn}</p></div>\n` +
    `<div class="ml-vi"><h2>📑 Học theo từng slide — ${d.code} (${d.vi}), slide ${from}–${to}</h2>` +
    `<p>Mở đúng bộ slide của thầy/cô bên cạnh trang này. Mỗi slide giữ nguyên như trên lớp, ngay dưới là giải thích ý nghĩa, cách nhớ, và với mọi slide có câu hỏi thì có đáp án kèm lập luận. ${noteVi}</p></div>`;
}

/**
 * Sáu tài liệu tham khảo mà syllabus 11845 liệt kê. Trích dẫn theo khoá để
 * mỗi bài chỉ được đường dẫn tới đúng chương, không nói chung chung.
 */
export const BOOKS = {
  piercy: 'Piercy — <em>Problem Solving in Teams and Groups</em> (University of Kansas Libraries, 2019)',
  lumen: '<em>College Success</em> (Lumen Learning)',
  bcs: '<em>Business Communication for Success</em> (University of Minnesota Libraries, 2015)',
  wig: 'Engleberg & Wynn — <em>Working in Groups</em>, 7th ed. (Pearson, 2017)',
  bc7: 'Krizan, Merrier, Logan & Williams — <em>Business Communication</em>, 7th ed. (Thomson South-Western, 2008)',
  slides: 'Bộ slide bài giảng của giảng viên (chính là các trang được nhúng trong bài này)',
};

/** Khối "đọc thêm trong sách": refs = [[khoá, chỗEn, chỗVi], …]. */
export function books(refs) {
  const li = (lang) => refs.map(([k, en, vi]) => `<li>${BOOKS[k]}: <strong>${lang === 'en' ? en : vi}</strong></li>`).join('');
  return `<div class="ml-en"><h3>📚 Read it in the books</h3><ul>${li('en')}</ul></div>\n` +
    `<div class="ml-vi"><h3>📚 Đọc thêm trong sách (đúng chương, đúng phần)</h3><ul>${li('vi')}</ul></div>`;
}

/** Gói cặp khối song ngữ. */
export const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
