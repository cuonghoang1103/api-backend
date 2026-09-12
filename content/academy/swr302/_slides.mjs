/**
 * _slides.mjs — building blocks for the SWR302 slide-by-slide lessons.
 *
 * Every slide of the teacher's SWR302 decks (28 chapter decks under
 * "Slide/" of the course folder — the lecture slides that follow Wiegers &
 * Beatty, "Software Requirements", 3rd ed.) was rendered to WebP and uploaded
 * to R2 by scripts/upload-academy-slides.mjs:
 *   images/academy/SWR302/v1/<deck>/<NNN>.webp
 * Deck keys are the book chapter number: chN = "CHAPTER_N_*.pdf". Slide number
 * here = the page number in the rendered deck (what students see in class).
 *
 * Markup reuses the live global classes (.anh-slide / .chu-thich, and the
 * bilingual .ml-en / .ml-vi wrappers) first built for LAB211 and reused by
 * SWT301 / FER202 — no frontend change. The folder is depth 2 under
 * content/academy, so the deploy seed loop (content/academy/*.mjs) never
 * mistakes these modules for course specs.
 */
export const CDN = 'https://media.cuongthai.com/images/academy/SWR302/v1';

const W = 1500, H = 1125; // every deck is 4:3 rendered at 150 dpi

export const DECKS = {
  ch1:  { code: 'Ch.1',  en: 'Essentials of software requirements',            vi: 'Cơ bản về yêu cầu phần mềm',              total: 28, w: W, h: H },
  ch2:  { code: 'Ch.2',  en: 'Requirements from the customer’s perspective',   vi: 'Yêu cầu từ góc nhìn khách hàng',          total: 34, w: W, h: H },
  ch3:  { code: 'Ch.3',  en: 'Requirements engineering good practices',        vi: 'Thực hành tốt kỹ nghệ yêu cầu',           total: 65, w: W, h: H },
  ch4:  { code: 'Ch.4',  en: 'The business analyst',                           vi: 'Chuyên viên phân tích nghiệp vụ (BA)',    total: 38, w: W, h: H },
  ch5:  { code: 'Ch.5',  en: 'Establishing the business requirements',         vi: 'Thiết lập yêu cầu nghiệp vụ',             total: 40, w: W, h: H },
  ch6:  { code: 'Ch.6',  en: 'Finding the voice of the user',                  vi: 'Tìm tiếng nói của người dùng',            total: 21, w: W, h: H },
  ch7:  { code: 'Ch.7',  en: 'Requirements elicitation',                       vi: 'Khai thác yêu cầu (elicitation)',         total: 38, w: W, h: H },
  ch8:  { code: 'Ch.8',  en: 'Understanding user requirements',                vi: 'Hiểu yêu cầu người dùng',                 total: 36, w: W, h: H },
  ch9:  { code: 'Ch.9',  en: 'Playing by the rules (business rules)',          vi: 'Chơi theo luật (business rules)',         total: 21, w: W, h: H },
  ch10: { code: 'Ch.10', en: 'Documenting the requirements',                   vi: 'Lập tài liệu yêu cầu',                    total: 16, w: W, h: H },
  ch11: { code: 'Ch.11', en: 'Writing excellent requirements',                 vi: 'Viết yêu cầu xuất sắc',                   total: 30, w: W, h: H },
  ch12: { code: 'Ch.12', en: 'A picture is worth 1024 words (visual models)',  vi: 'Một hình đáng 1024 chữ (mô hình trực quan)', total: 25, w: W, h: H },
  ch13: { code: 'Ch.13', en: 'Specifying data requirements',                   vi: 'Đặc tả yêu cầu dữ liệu',                  total: 24, w: W, h: H },
  ch14: { code: 'Ch.14', en: 'Beyond functionality (quality attributes)',      vi: 'Ngoài chức năng (thuộc tính chất lượng)',  total: 19, w: W, h: H },
  ch15: { code: 'Ch.15', en: 'Risk reduction through prototyping',             vi: 'Giảm rủi ro bằng prototyping',            total: 24, w: W, h: H },
  ch16: { code: 'Ch.16', en: 'Setting requirement priorities',                 vi: 'Đặt độ ưu tiên yêu cầu',                  total: 15, w: W, h: H },
  ch17: { code: 'Ch.17', en: 'Validating the requirements',                    vi: 'Thẩm định yêu cầu (validation)',          total: 28, w: W, h: H },
  ch18: { code: 'Ch.18', en: 'Requirements reuse',                             vi: 'Tái sử dụng yêu cầu',                     total: 21, w: W, h: H },
  ch19: { code: 'Ch.19', en: 'Beyond requirements development',                vi: 'Ngoài phát triển yêu cầu',                total: 13, w: W, h: H },
  ch20: { code: 'Ch.20', en: 'Agile projects',                                 vi: 'Yêu cầu trong dự án Agile',               total: 17, w: W, h: H },
  ch21: { code: 'Ch.21', en: 'Enhancement and replacement projects',           vi: 'Dự án nâng cấp & thay thế',               total: 14, w: W, h: H },
  ch22: { code: 'Ch.22', en: 'Packaged solution projects',                     vi: 'Dự án giải pháp đóng gói (COTS)',         total: 18, w: W, h: H },
  ch27: { code: 'Ch.27', en: 'Requirements management practices',              vi: 'Thực hành quản lý yêu cầu',               total: 13, w: W, h: H },
  ch28: { code: 'Ch.28', en: 'Change happens (change management)',             vi: 'Thay đổi luôn xảy ra (quản lý thay đổi)', total: 19, w: W, h: H },
  ch29: { code: 'Ch.29', en: 'Links in the requirements chain (traceability)', vi: 'Mắt xích chuỗi yêu cầu (truy vết)',        total: 12, w: W, h: H },
  ch30: { code: 'Ch.30', en: 'Tools for requirements engineering',             vi: 'Công cụ kỹ nghệ yêu cầu',                 total: 16, w: W, h: H },
  ch31: { code: 'Ch.31', en: 'Improving your requirements processes',          vi: 'Cải tiến quy trình yêu cầu',              total: 25, w: W, h: H },
  ch32: { code: 'Ch.32', en: 'Software requirements and risk management',      vi: 'Yêu cầu phần mềm & quản lý rủi ro',       total: 17, w: W, h: H },
};

export function registerDeck(key, meta) {
  if (DECKS[key] && JSON.stringify(DECKS[key]) !== JSON.stringify(meta)) throw new Error(`deck ${key} already registered differently`);
  DECKS[key] = meta;
}

const pad = (n) => String(n).padStart(3, '0');
const attr = (s) => String(s).replace(/<[^>]+>/g, '').replace(/&/g, '&amp;').replace(/"/g, '&quot;');

/** Public URL of one rendered slide. */
export const img = (deck, n) => `${CDN}/${deck}/${pad(n)}.webp`;

/**
 * One slide = the picture (shared by both languages) followed by the paired
 * EN/VI explanation. `title` is plain slide text.
 */
export function slide(deck, n, title, en, vi) {
  const d = DECKS[deck];
  if (!d) throw new Error(`unknown deck ${deck}`);
  if (n < 1 || n > d.total) throw new Error(`${deck} has ${d.total} slides, got ${n}`);
  return `<div class="anh-slide"><img src="${img(deck, n)}" alt="${attr(`${d.code} slide ${n}: ${title}`)}" loading="lazy" width="${d.w}" height="${d.h}" />` +
    `<p class="chu-thich">📖 <strong>${d.code}</strong> · slide ${n}/${d.total} — ${title}</p></div>\n` +
    `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
}

/** A run of slides: rows = [[n, title, en, vi], …]. */
export const walk = (deck, rows) => rows.map((r) => slide(deck, ...r)).join('\n');

/** Answer line for an in-class "Question / Exercise" slide. */
export const ansEn = (letter, why) => `<p><strong>✅ Answer: ${letter}.</strong> ${why}</p>`;
export const ansVi = (letter, why) => `<p><strong>✅ Đáp án: ${letter}.</strong> ${why}</p>`;

/** Heading that opens a slide walkthrough. */
export function walkHead(deck, from, to, noteEn = '', noteVi = '') {
  const d = DECKS[deck];
  return `<div class="ml-en"><h2>📖 Slide by slide — ${d.code} (${d.en}), slides ${from}–${to}</h2>` +
    `<p>Open your own copy of the <em>${d.code}</em> deck next to this page. Each slide is shown exactly as in class, followed by what it means, why it matters and how to apply it on a real project. ${noteEn}</p></div>\n` +
    `<div class="ml-vi"><h2>📖 Học theo từng slide — ${d.code} (${d.vi}), slide ${from}–${to}</h2>` +
    `<p>Mở bộ slide <em>${d.code}</em> của thầy/cô bên cạnh trang này. Mỗi slide được giữ nguyên như trên lớp, ngay dưới là giải thích ý nghĩa, vì sao quan trọng và cách áp dụng trên dự án thật. ${noteVi}</p></div>`;
}

/** Wrap paired blocks: bi(en, vi). */
export const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;

/** The reference books & docs cited throughout SWR302. */
export const BOOKS = {
  wiegers: 'Karl Wiegers &amp; Joy Beatty — <em>Software Requirements</em>, 3rd ed. (Microsoft Press, 2013) — the course textbook; every deck follows one of its chapters',
  more: 'Karl Wiegers — <em>More About Software Requirements: Thorny Issues and Practical Advice</em> (Microsoft Press, 2006)',
  cos: 'Course sample artifacts (Document_GuideLines): the Cafeteria Ordering System (COS) Vision &amp; Scope, SRS, Use Cases and Business Rules, plus the PearlsFromSand.com SRS example',
  babok: 'IIBA — <em>BABOK</em> (Business Analysis Body of Knowledge) — the BA profession’s reference, aligned with Ch.4',
  iso: 'ISO/IEC/IEEE 29148 (successor to IEEE 830) — the standard for requirements specifications',
};

/** "Read it in the books" block: refs = [[bookKey, whereEn, whereVi], …]. */
export function books(refs) {
  const li = (lang) => refs.map(([k, en, vi]) => `<li>${BOOKS[k]}: <strong>${lang === 'en' ? en : vi}</strong></li>`).join('');
  return `<div class="ml-en"><h3>📚 Read it in the books</h3><ul>${li('en')}</ul></div>\n` +
    `<div class="ml-vi"><h3>📚 Đọc thêm trong sách (đúng chương)</h3><ul>${li('vi')}</ul></div>`;
}
