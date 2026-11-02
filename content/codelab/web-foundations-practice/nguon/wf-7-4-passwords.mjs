/** Bộ luyện bài 7.4 — Lưu mật khẩu. Lược đồ: ./_luoc-do.mjs (loại 'js'). kiem[].moTa = "EN|||VI". ´ = dấu huyền, @{ = ${
 *  Máy chấm không có crypto ⇒ bài dùng một hàm hash ĐỒ CHƠI cho sẵn (FNV-1a) để mô phỏng tấn công. Luật mật khẩu kiểu NIST,
 *  đọc chuỗi bcrypt, khi nào cần hash lại, đổi số lần đoán thành thời gian, so sánh thời gian cố định, đo chi phí tấn công có/không muối. */
import { c, doiDau } from './_luoc-do.mjs';

const BAI = '<p><em>Bài 7.4 — Lưu mật khẩu.</em> Mỗi bài là một mảnh của việc lưu và kiểm mật khẩu cho đúng — hoặc của việc kẻ tấn công làm khi bạn lưu sai.</p>';

const TOY = `// CHO SẴN — hàm hash ĐỒ CHƠI (FNV-1a, 32 bit) chỉ để luyện; KHÔNG BAO GIỜ dùng cho mật khẩu thật.
function toyHash(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}
`;

export default doiDau({
  slug: 'wf-7-4-passwords',
  ten: '7.4 Lưu mật khẩu',
  baiHoc: 'Nền tảng Web — Bài 7.4 Passwords: hashing, salting, bcrypt',
  ngonNgu: 'javascript',
  loaiKiem: 'js',
  level: 'INTERMEDIATE',
  moTa: 'Luật mật khẩu kiểu NIST (dài, không ép ký tự, chặn mật khẩu phổ biến), đọc chuỗi bcrypt, quyết định khi nào hash lại, đổi số lần đoán thành thời gian dễ đọc, so sánh thời gian cố định, và đếm chi phí tấn công từ điển khi có và không có muối — 6 bài.',
  de: [
    {
      tieuDe: 'Luật mật khẩu hiện đại',
      doKho: 'EASY', phut: 12,
      khaiNiem: ['NIST 800-63B', 'mật khẩu phổ biến'], tienQuyet: ['chuỗi', 'mảng'], the: ['javascript', 'mật khẩu'],
      moTa: `${BAI}<p>Viết ${c('passwordProblems(password, { email, common })')} trả mảng vấn đề theo thứ tự: ${c('"too-short"')} (ít hơn 8 KÝ TỰ — đếm theo ký tự thật, ${c('[...password].length')}, để emoji hay chữ có dấu tính là một), ${c('"too-long"')} (hơn 64 ký tự), ${c('"contains-email"')} (phần trước ${c('@')} của email, nếu dài ít nhất 3 ký tự, xuất hiện trong mật khẩu — không phân biệt hoa thường), ${c('"common"')} (mật khẩu viết thường nằm trong mảng ${c('common')}). KHÔNG đòi chữ hoa/số/ký hiệu. Rỗng ⇒ mật khẩu chấp nhận được.</p>`,
      yeuCau: ['Đếm ký tự thật.', 'Không có luật thành phần ký tự.', 'Đúng thứ tự vấn đề.'],
      dauVao: 'password: string; { email: string, common: string[] }.', dauRa: 'string[].',
      rangBuoc: ['Cụm mật khẩu dài có dấu cách phải được chấp nhận.'],
      viDu: [{ input: 'passwordProblems("correct horse battery", { email: "an@example.com", common: [] })', output: '[]', explanation: 'Cụm từ dài, không có chữ hoa hay ký hiệu — vẫn tốt.' }],
      goiY: ['const n = [...password].length;', 'const local = email.split("@")[0].toLowerCase(); if (local.length >= 3 && password.toLowerCase().includes(local)) …'],
      khoiDau: { 'main.js': `// Bài 7.4 — luật mật khẩu
function passwordProblems(password, { email, common }) {
  const problems = [];
  if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) problems.push('needs-uppercase-and-digit');
  return problems;
}
` },
      loiGiai: { 'main.js': `// Bài 7.4 — dài, không lộ email, không phổ biến; KHÔNG ép chữ hoa / số / ký hiệu
function passwordProblems(password, { email, common }) {
  const problems = [];
  const n = [...password].length;                            // ký tự thật, không phải đơn vị UTF-16
  if (n < 8) problems.push('too-short');
  if (n > 64) problems.push('too-long');
  const local = String(email ?? '').split('@')[0].toLowerCase();
  if (local.length >= 3 && password.toLowerCase().includes(local)) problems.push('contains-email');
  if (common.includes(password.toLowerCase())) problems.push('common');
  return problems;
}
` },
      giaiThich: `<p>Luật thành phần (chữ hoa + số + ký hiệu) sinh ra ${c('Password1!')} — có trong mọi danh sách dò. NIST SP 800-63B đổi sang: đủ dài, cho phép mọi ký tự kể cả dấu cách, và chặn những mật khẩu đã biết là tệ. Trần 64 vẫn rất rộng cho cụm mật khẩu, đồng thời chặn chuỗi khổng lồ làm máy chủ hash mãi.</p>`,
      loiHayGap: ['Đếm .length — emoji tính 2.', 'Ép chữ hoa/số/ký hiệu.', 'So common phân biệt hoa thường.'],
      thamKhao: 'https://pages.nist.gov/800-63-4/sp800-63b.html#password',
      kiem: [
        { moTa: 'A long passphrase passes|||Cụm mật khẩu dài được nhận', goi: 'passwordProblems("correct horse battery", { email: "an@example.com", common: ["123456"] })', mongDoi: [] },
        { moTa: 'Short, common, contains email|||Ngắn, phổ biến, chứa email', goi: '[passwordProblems("Qwerty", { email: "x@y.z", common: ["qwerty"] }), passwordProblems("lan.nguyen2009", { email: "Lan.Nguyen@school.edu", common: [] })]', mongDoi: [['too-short', 'common'], ['contains-email']] },
        { moTa: 'Real characters are counted; very long is refused|||Đếm ký tự thật; quá dài bị từ chối', goi: '[passwordProblems("😀😀😀😀🔑🔑🔑", { email: "an@x.vn", common: [] }), passwordProblems("a".repeat(65), { email: "an@x.vn", common: [] })]', mongDoi: [['too-short'], ['too-long']] },
      ],
    },
    {
      tieuDe: 'Đọc một chuỗi bcrypt',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['định dạng bcrypt', 'cost'], tienQuyet: ['regex', 'Number'], the: ['javascript', 'mật khẩu'],
      moTa: `${BAI}<p>Viết ${c('parseBcrypt(hash)')} cho chuỗi dạng ${c('$2a$10$RFFthUmbL7xyCto/rg1Sh.6p0uzSWd.RJQT2xi3OoN.rCi0HnuKEe')} (60 ký tự). Trả ${c('{ version, cost, salt, hash }')}: ${c('version')} là ${c('"2a" | "2b" | "2y"')}, ${c('cost')} là SỐ (2 chữ số, từ 4 tới 31), ${c('salt')} là 22 ký tự kế tiếp, ${c('hash')} là 31 ký tự cuối; bảng chữ là ${c('./A-Za-z0-9')}. Sai ở bất kỳ đâu ⇒ ${c('null')}.</p>`,
      yeuCau: ['Kiểm độ dài từng phần.', 'cost là number trong 4–31.', 'Sai ⇒ null.'],
      dauVao: 'hash: string.', dauRa: 'object hoặc null.',
      rangBuoc: ['Không cần kiểm hash có đúng với mật khẩu nào không.'],
      viDu: [{ input: 'parseBcrypt("$2a$10$RFFthUmbL7xyCto/rg1Sh.6p0uzSWd.RJQT2xi3OoN.rCi0HnuKEe")', output: '{ version: "2a", cost: 10, salt: "RFFthUmbL7xyCto/rg1Sh.", hash: "6p0uzSWd.RJQT2xi3OoN.rCi0HnuKEe" }', explanation: 'Hash #1 trong output của bài.' }],
      goiY: ['/^\\$(2[aby])\\$(\\d{2})\\$([./A-Za-z0-9]{22})([./A-Za-z0-9]{31})$/', 'const cost = Number(m[2]); if (cost < 4 || cost > 31) return null;'],
      khoiDau: { 'main.js': `// Bài 7.4 — đọc chuỗi bcrypt
function parseBcrypt(hash) {
  const [, version, cost, rest] = hash.split('$');
  return { version, cost, salt: rest.slice(0, 22), hash: rest.slice(22) };
}
` },
      loiGiai: { 'main.js': `// Bài 7.4 — $phiên bản$cost$muối(22)hash(31): mọi thứ cần để kiểm nằm trong một chuỗi
const BCRYPT = /^\\$(2[aby])\\$(\\d{2})\\$([./A-Za-z0-9]{22})([./A-Za-z0-9]{31})$/;
function parseBcrypt(hash) {
  const m = BCRYPT.exec(String(hash));
  if (!m) return null;
  const cost = Number(m[2]);
  if (cost < 4 || cost > 31) return null;
  return { version: m[1], cost, salt: m[3], hash: m[4] };
}
` },
      giaiThich: `<p>Vì cost và muối nằm ngay trong chuỗi, ${c('bcrypt.compare')} không cần bạn lưu riêng chúng, và bạn nâng cost cho người dùng mới mà hash cũ vẫn kiểm được. Bài kế tiếp dùng chính hàm này để quyết định khi nào hash lại.</p>`,
      loiHayGap: ['Để cost là chuỗi "10".', 'Không kiểm độ dài — chuỗi cụt vẫn "đọc được".'],
      thamKhao: 'https://en.wikipedia.org/wiki/Bcrypt#Description',
      kiem: [
        { moTa: 'Hash #1 from the lesson|||Hash #1 trong bài', goi: 'parseBcrypt("$2a$10$RFFthUmbL7xyCto/rg1Sh.6p0uzSWd.RJQT2xi3OoN.rCi0HnuKEe")', mongDoi: { version: '2a', cost: 10, salt: 'RFFthUmbL7xyCto/rg1Sh.', hash: '6p0uzSWd.RJQT2xi3OoN.rCi0HnuKEe' } },
        { moTa: 'Version 2b, cost 12|||Phiên bản 2b, cost 12', goi: 'parseBcrypt("$2b$12$abcdefghijklmnopqrstuv0123456789ABCDEFGHIJKLMNOPQRSTU").cost', mongDoi: 12 },
        { moTa: 'Invalid strings give null|||Chuỗi sai trả null', goi: '[parseBcrypt("$2a$10$tooShort"), parseBcrypt("$2c$10$RFFthUmbL7xyCto/rg1Sh.6p0uzSWd.RJQT2xi3OoN.rCi0HnuKEe"), parseBcrypt("$2a$03$RFFthUmbL7xyCto/rg1Sh.6p0uzSWd.RJQT2xi3OoN.rCi0HnuKEe"), parseBcrypt("8d969eef6ecad3c29a3a629280e686cf")]', mongDoi: [null, null, null, null] },
      ],
    },
    {
      tieuDe: 'Khi nào cần hash lại?',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['nâng cấp hash', 'cost tăng dần'], tienQuyet: ['regex'], the: ['javascript', 'mật khẩu'],
      moTa: `${BAI}<p>Khi người dùng đăng nhập ĐÚNG, máy chủ có mật khẩu thô trong tay một khoảnh khắc — lúc duy nhất để nâng cấp hash cũ. Viết ${c('needsRehash(stored, targetCost)')}: ${c('true')} nếu ${c('stored')} không phải chuỗi bcrypt hợp lệ (vd hash SHA-256 hex từ hệ thống cũ), là phiên bản ${c('"2a"')} (nâng lên ${c('"2b"')}), hoặc có cost NHỎ HƠN ${c('targetCost')}; ngược lại ${c('false')}. Viết lại phần đọc bcrypt bên trong hàm.</p>`,
      yeuCau: ['Không phải bcrypt ⇒ true.', '2a ⇒ true.', 'cost < target ⇒ true; cost ≥ target ⇒ false.'],
      dauVao: 'stored: string; targetCost: number.', dauRa: 'boolean.',
      rangBuoc: ['Một hàm tự đủ.'],
      viDu: [{ input: 'needsRehash("$2b$10$…", 12)', output: 'true', explanation: 'Hash từ năm trước, máy chủ giờ đủ nhanh cho cost 12.' }],
      goiY: ['const m = /^\\$(2[aby])\\$(\\d{2})\\$[./A-Za-z0-9]{53}$/.exec(stored);', 'return !m || m[1] === "2a" || Number(m[2]) < targetCost;'],
      khoiDau: { 'main.js': `// Bài 7.4 — khi nào cần hash lại?
function needsRehash(stored, targetCost) {
  return false;
}
` },
      loiGiai: { 'main.js': `// Bài 7.4 — đăng nhập đúng là lúc duy nhất có mật khẩu thô để nâng cấp hash cũ
function needsRehash(stored, targetCost) {
  const m = /^\\$(2[aby])\\$(\\d{2})\\$[./A-Za-z0-9]{53}$/.exec(String(stored));
  if (!m) return true;                                       // hash kiểu cũ (MD5, SHA-1, SHA-256) ⇒ thay bằng bcrypt
  if (m[1] === '2a') return true;                            // phiên bản cũ ⇒ nâng lên 2b
  return Number(m[2]) < targetCost;                          // máy nhanh hơn ⇒ cost cao hơn
}
` },
      giaiThich: `<p>Không ai bắt mọi người đổi mật khẩu để nâng cấp. Luồng đúng: ${c('compare')} thành công → ${c('needsRehash')} → nếu true thì ${c('hash')} lại mật khẩu vừa gõ với cost mới và lưu đè. Sau vài tháng, gần hết người dùng tích cực đã được nâng cấp mà không biết.</p>`,
      loiHayGap: ['So cost dạng chuỗi ("9" > "12").', 'Hash lại khi đăng nhập SAI (khi đó bạn không có mật khẩu đúng).'],
      thamKhao: 'https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#upgrading-legacy-hashes',
      kiem: [
        { moTa: 'Cost below target|||Cost dưới mục tiêu', goi: '[needsRehash("$2b$10$abcdefghijklmnopqrstuv0123456789ABCDEFGHIJKLMNOPQRSTU", 12), needsRehash("$2b$12$abcdefghijklmnopqrstuv0123456789ABCDEFGHIJKLMNOPQRSTU", 12), needsRehash("$2b$13$abcdefghijklmnopqrstuv0123456789ABCDEFGHIJKLMNOPQRSTU", 12)]', mongDoi: [true, false, false] },
        { moTa: 'Old version and legacy hashes|||Phiên bản cũ và hash kiểu cũ', goi: '[needsRehash("$2a$12$abcdefghijklmnopqrstuv0123456789ABCDEFGHIJKLMNOPQRSTU", 12), needsRehash("8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92", 10), needsRehash("", 10)]', mongDoi: [true, true, true] },
        { moTa: 'Numbers, not strings|||So số, không so chuỗi', goi: 'needsRehash("$2b$09$abcdefghijklmnopqrstuv0123456789ABCDEFGHIJKLMNOPQRSTU", 12)', mongDoi: true },
      ],
    },
    {
      tieuDe: 'Bao lâu thì bị phá?',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['tốc độ hash', 'đơn vị thời gian'], tienQuyet: ['Math.round', 'chuỗi'], the: ['javascript', 'mật khẩu'],
      moTa: `${BAI}<p>Viết ${c('crackTime(guesses, hashesPerSecond)')} trả chuỗi dễ đọc cho ${c('guesses / hashesPerSecond')} giây: dưới 1 giây ⇒ ${c('"<n> ms"')} (làm tròn); dưới 60 ⇒ ${c('"<x> s"')}; dưới 3600 ⇒ ${c('"<x> min"')}; dưới 86 400 ⇒ ${c('"<x> h"')}; dưới 365 ngày ⇒ ${c('"<x> days"')}; còn lại ${c('"<x> years"')} (1 năm = 31 536 000 giây). ${c('x')} làm tròn 1 chữ số thập phân và bỏ ${c('".0"')}. Dùng số đo thật của bài: SHA-256 ~1 917 183/giây, bcrypt cost 10 ~13,3/giây.</p>`,
      yeuCau: ['Chọn đúng đơn vị.', 'Làm tròn 1 chữ số, bỏ .0.', 'ms làm tròn số nguyên.'],
      dauVao: 'guesses: number; hashesPerSecond: number.', dauRa: 'string.',
      rangBuoc: ['Không dùng thư viện định dạng thời gian.'],
      viDu: [{ input: 'crackTime(10000, 13.3)', output: '"12.5 min"', explanation: 'Bảng ở Bước 5 của bài.' }],
      goiY: ['const s = guesses / hashesPerSecond;', 'const r = (x) => String(Math.round(x * 10) / 10);'],
      khoiDau: { 'main.js': `// Bài 7.4 — bao lâu thì bị phá?
function crackTime(guesses, hashesPerSecond) {
  return guesses / hashesPerSecond + ' s';
}
` },
      loiGiai: { 'main.js': `// Bài 7.4 — số lần đoán ÷ tốc độ, đổi sang đơn vị con người hiểu
function crackTime(guesses, hashesPerSecond) {
  const s = guesses / hashesPerSecond;
  const r = (x) => String(Math.round(x * 10) / 10);         // 12.5, 46.3, 3 (không in "3.0")
  if (s < 1) return Math.round(s * 1000) + ' ms';
  if (s < 60) return r(s) + ' s';
  if (s < 3600) return r(s / 60) + ' min';
  if (s < 86400) return r(s / 3600) + ' h';
  if (s < 365 * 86400) return r(s / 86400) + ' days';
  return r(s / (365 * 86400)) + ' years';
}
` },
      giaiThich: `<p>Đặt hai con số cạnh nhau là thấy vì sao bcrypt tồn tại: cùng 10 000 lần đoán, 5 ms với SHA-256 và 12,5 phút với bcrypt cost 10 — mỗi tài khoản. Nhân với một triệu tài khoản bị lộ: vài giờ so với hàng chục năm.</p>`,
      loiHayGap: ['In 751.8796992481203 s thay vì 12.5 min.', 'toFixed(1) giữ ".0".'],
      thamKhao: 'https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#work-factors',
      kiem: [
        { moTa: 'The lesson table|||Bảng của bài', goi: '[crackTime(10000, 1917183), crackTime(10000, 13.3), crackTime(10000, 3.6)]', mongDoi: ['5 ms', '12.5 min', '46.3 min'] },
        { moTa: 'Seconds, hours, days, years|||Giây, giờ, ngày, năm', goi: '[crackTime(30, 1), crackTime(7200, 1), crackTime(1e6 * 13.3 * 2, 13.3), crackTime(1e9, 13.3)]', mongDoi: ['30 s', '2 h', '23.1 days', '2.4 years'] },
        { moTa: 'Edges between units|||Ranh giới giữa các đơn vị', goi: '[crackTime(1, 1), crackTime(60, 1), crackTime(0.4, 1)]', mongDoi: ['1 s', '1 min', '400 ms'] },
      ],
    },
    {
      tieuDe: 'So sánh thời gian cố định',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['timing attack', 'so sánh thời gian cố định'], tienQuyet: ['vòng lặp', 'toán tử bit'], the: ['javascript', 'bảo mật'],
      moTa: `${BAI}<p>${c('a === b')} dừng ở ký tự khác đầu tiên, nên thời gian trả lời để lộ có bao nhiêu ký tự đầu khớp. Viết ${c('safeEqual(a, b)')} cho hai chuỗi: duyệt HẾT độ dài chuỗi dài hơn, gom khác biệt bằng ${c('|=')} và ${c('^')} trên mã ký tự, không ${c('return')} giữa vòng lặp, khác độ dài cũng tính là khác. Trả boolean. Không được so ${c('a')} với ${c('b')} bằng ${c('===')} / ${c('==')}.</p>`,
      yeuCau: ['Duyệt hết, không thoát sớm.', 'Khác độ dài ⇒ false.', 'Không dùng === giữa a và b.'],
      dauVao: 'a, b: string.', dauRa: 'boolean.',
      rangBuoc: ['Đây là việc của crypto.timingSafeEqual trong Node.'],
      viDu: [{ input: 'safeEqual("t1", "t1x")', output: 'false', explanation: 'Khác độ dài.' }],
      goiY: ['let diff = a.length ^ b.length;', 'for (let i = 0; i < Math.max(a.length, b.length); i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);'],
      khoiDau: { 'main.js': `// Bài 7.4 — so sánh thời gian cố định
function safeEqual(a, b) {
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
` },
      loiGiai: { 'main.js': `// Bài 7.4 — thời gian chạy không phụ thuộc vào vị trí ký tự khác đầu tiên
function safeEqual(a, b) {
  let diff = a.length ^ b.length;                            // khác độ dài ⇒ diff khác 0
  const n = Math.max(a.length, b.length);
  for (let i = 0; i < n; i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0); // gom mọi khác biệt, không dừng
  }
  return diff === 0;
}
` },
      giaiThich: `<p>Code khởi đầu sai hai lần: thoát sớm (lộ thời gian), và trả ${c('true')} cho ${c('safeEqual("ab", "abc")')} vì chỉ duyệt độ dài của ${c('a')}. Qua mạng, khác biệt vài nano giây rất khó đo nhưng đã từng bị khai thác với token và chữ ký; dùng hàm thời gian cố định không tốn gì.</p>`,
      loiHayGap: ['return false trong vòng lặp.', 'Chỉ duyệt a.length — "ab" bằng "abc".'],
      thamKhao: 'https://nodejs.org/api/crypto.html#cryptotimingsafeequala-b',
      kiem: [
        { moTa: 'Equal and different|||Bằng và khác', goi: '[safeEqual("pm_1On9", "pm_1On9"), safeEqual("pm_1On9", "pm_1On8"), safeEqual("", "")]', mongDoi: [true, false, true] },
        { moTa: 'Different lengths|||Khác độ dài', goi: '[safeEqual("ab", "abc"), safeEqual("abc", "ab"), safeEqual("", "x")]', mongDoi: [false, false, false] },
        { moTa: 'No early return inside the loop|||Không return giữa vòng lặp', kiem: 'ma-nguon', tep: 'main.js', khop: 'for\\s*\\([^)]*\\)\\s*\\{[^}]*return', phuDinh: true },
        { moTa: 'No === between a and b|||Không so a với b bằng ===', kiem: 'ma-nguon', tep: 'main.js', khop: '\\b(a|b)\\s*===?\\s*(a|b)\\b', phuDinh: true },
      ],
    },
    {
      tieuDe: 'Chi phí tấn công từ điển',
      doKho: 'HARD', phut: 25,
      khaiNiem: ['bảng tra', 'muối', 'chi phí tấn công'], tienQuyet: ['Map', 'vòng lặp'], the: ['javascript', 'mật khẩu', 'bảo mật'],
      moTa: `${BAI}<p>Đóng vai kẻ tấn công với hàm đồ chơi ${c('toyHash')} cho sẵn. ${c('leaked')} là mảng ${c('{ user, salt, hash }')}: ${c('salt')} là ${c('null')} (lưu ${c('toyHash(password)')}) hoặc chuỗi (lưu ${c('toyHash(salt + password)')}). Viết ${c('attack(leaked, dictionary)')} trả ${c('{ cracked, hashesComputed }')}: ${c('cracked')} là object ${c('user → password')} cho những ai phá được; ${c('hashesComputed')} là số lần GỌI ${c('toyHash')}. Cách tính phải tối ưu như kẻ tấn công thật: với các mục KHÔNG muối, hash từ điển MỘT lần (chỉ khi có ít nhất một mục không muối) rồi tra bảng; với mỗi mục CÓ muối, thử lần lượt từng từ và DỪNG khi trúng.</p>`,
      yeuCau: ['Bảng dùng chung cho mọi mục không muối.', 'Mục có muối: thử từng từ, dừng khi trúng.', 'Đếm đúng số lần hash.'],
      dauVao: 'leaked: { user, salt, hash }[]; dictionary: string[].', dauRa: '{ cracked: object, hashesComputed: number }.',
      rangBuoc: ['Không sửa toyHash.', 'Gọi toyHash qua một hàm đếm của riêng bạn.'],
      viDu: [{ input: '1000 người không muối, từ điển 10 từ', output: 'hashesComputed: 10', explanation: 'Một bảng phá cả nghìn người.' }],
      goiY: ['let count = 0; const H = (s) => { count++; return toyHash(s); };', 'const table = new Map(dictionary.map((w) => [H(w), w]));'],
      khoiDau: { 'main.js': `${TOY}
// Bài 7.4 — chi phí tấn công từ điển
function attack(leaked, dictionary) {
  const cracked = {};
  for (const e of leaked) {
    for (const w of dictionary) if (toyHash(w) === e.hash) cracked[e.user] = w;
  }
  return { cracked, hashesComputed: 0 };
}
` },
      loiGiai: { 'main.js': `${TOY}
// Bài 7.4 — không muối: một bảng phá tất cả; có muối: mỗi người một lần dò riêng
function attack(leaked, dictionary) {
  let count = 0;
  const H = (s) => { count++; return toyHash(s); };
  const cracked = {};
  const unsalted = leaked.filter((e) => e.salt === null);
  if (unsalted.length > 0) {
    const table = new Map(dictionary.map((w) => [H(w), w])); // tính MỘT lần cho mọi người
    for (const e of unsalted) if (table.has(e.hash)) cracked[e.user] = table.get(e.hash);
  }
  for (const e of leaked.filter((x) => x.salt !== null)) {
    for (const w of dictionary) {
      if (H(e.salt + w) === e.hash) { cracked[e.user] = w; break; }   // trúng thì dừng
    }
  }
  return { cracked, hashesComputed: count };
}
` },
      giaiThich: `<p>Hai con số kể toàn bộ câu chuyện của bài: không muối, chi phí là ${c('|từ điển|')} cho CẢ cơ sở dữ liệu; có muối, chi phí là ${c('|từ điển|')} cho MỖI người. Nhân thêm hệ số chậm của bcrypt (khoảng 144 000 lần so với SHA-256 trong bài) là thấy vì sao cả hai lớp đều cần.</p>`,
      loiHayGap: ['Hash từ điển lại cho từng người không muối.', 'Không dừng khi đã trúng.', 'Đếm sai vì gọi toyHash trực tiếp ở vài chỗ.'],
      thamKhao: 'https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#salting',
      kiem: [
        { moTa: 'Unsalted: one table cracks everyone|||Không muối: một bảng phá tất cả', chuanBi: 'const D = ["123456", "password", "qwerty", "sunflower2009"]; const L = [{ user: "an", salt: null, hash: toyHash("123456") }, { user: "binh", salt: null, hash: toyHash("123456") }, { user: "lan", salt: null, hash: toyHash("sunflower2009") }, { user: "minh", salt: null, hash: toyHash("x7#long-unique") }];', goi: 'attack(L, D)', mongDoi: { cracked: { an: '123456', binh: '123456', lan: 'sunflower2009' }, hashesComputed: 4 } },
        { moTa: 'Salted: each user costs separately; stop on hit|||Có muối: mỗi người tốn riêng; trúng thì dừng', chuanBi: 'const D = ["123456", "password", "qwerty", "sunflower2009"]; const L = [{ user: "an", salt: "s1", hash: toyHash("s1" + "123456") }, { user: "binh", salt: "s2", hash: toyHash("s2" + "qwerty") }, { user: "minh", salt: "s3", hash: toyHash("s3" + "x7#long-unique") }];', goi: 'attack(L, D)', mongDoi: { cracked: { an: '123456', binh: 'qwerty' }, hashesComputed: 8 } },
        { moTa: 'Mixed table|||Bảng trộn', chuanBi: 'const D = ["a1", "b2", "c3"]; const L = [{ user: "u1", salt: null, hash: toyHash("b2") }, { user: "u2", salt: "zz", hash: toyHash("zz" + "c3") }];', goi: 'attack(L, D)', mongDoi: { cracked: { u1: 'b2', u2: 'c3' }, hashesComputed: 6 } },
      ],
    },
  ],
});
