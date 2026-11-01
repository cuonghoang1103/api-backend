/** Bộ luyện bài 11.5 — Regex vừa đủ dùng. Lược đồ: ./_luoc-do.mjs (loại 'js'). kiem[].moTa = "EN|||VI". */
import { c, doiDau } from './_luoc-do.mjs';

const BAI = '<p><em>Bài 11.5 — Biểu thức chính quy, vừa đủ dùng.</em> Máy chấm gọi hàm của bạn với cả đầu vào đúng lẫn SAI — bug regex trốn ở đầu vào sai.</p>';

export default doiDau({
  slug: 'wf-11-5-regex',
  ten: '11.5 Biểu thức chính quy, vừa đủ dùng',
  baiHoc: 'Nền tảng Web — Bài 11.5 Regex',
  ngonNgu: 'javascript',
  loaiKiem: 'js',
  level: 'INTERMEDIATE',
  moTa: 'Số di động Việt Nam có neo, đuôi ảnh không phân biệt hoa thường, đổi ngày bằng nhóm có tên, rút điểm bằng matchAll, slugify tiếng Việt, đếm từ nguyên vẹn có hiểu Unicode — 6 bài.',
  de: [
    {
      tieuDe: 'Số di động Việt Nam',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['neo ^$', 'lớp ký tự', 'lượng từ'], tienQuyet: ['regex test'], the: ['javascript', 'regex'],
      moTa: `${BAI}<p>Viết ${c('isVnMobile(s)')}: true khi ${c('s')} là ĐÚNG 10 chữ số, bắt đầu bằng 0 rồi một trong 3, 5, 7, 8, 9. Mọi thứ khác (khoảng trắng, chữ, số máy bàn 02…, 9 hoặc 11 chữ số, số nằm lẫn trong câu) là false. Gọi nhiều lần liền với cùng đầu vào phải cho cùng đáp án.</p>`,
      yeuCau: [
        `${c('isVnMobile("0912345678")')} và ${c('isVnMobile("0381234567")')} là true.`,
        `${c('" 0912345678"')}, ${c('"0212345678"')}, ${c('"091234567"')}, ${c('"09123456789"')} là false.`,
        'Gọi hai lần liền cùng số hợp lệ ⇒ true cả hai (không dùng cờ g).',
      ],
      dauVao: 's: string.', dauRa: 'boolean.',
      rangBuoc: ['Dùng một regex có neo hai đầu.'],
      viDu: [{ input: 'isVnMobile("call 0912345678")', output: 'false', explanation: 'Có neo ⇒ không nhận số nằm lẫn trong câu.' }],
      goiY: ['^0[35789] rồi \\d{8} rồi $.', 'return /^0[35789]\\d{8}$/.test(s);'],
      khoiDau: { 'main.js': `// Bài 11.5 — số di động
const MOBILE = /0[35789]\\d{8}/g;   // thiếu neo + có cờ g

function isVnMobile(s) {
  return MOBILE.test(s);
}
` },
      loiGiai: { 'main.js': `// Bài 11.5 — số di động: neo hai đầu, KHÔNG cờ g (test không được nhớ lastIndex)
const MOBILE = /^0[35789]\\d{8}$/;   // đầu · 0 · một trong 3/5/7/8/9 · đúng 8 chữ số · hết

function isVnMobile(s) {
  return MOBILE.test(s);
}
` },
      giaiThich: `<p>Không có ${c('^')} và ${c('$')} là đang TÌM chứ không KIỂM: chuỗi có mười chữ số ở đâu đó cũng qua. Cờ ${c('g')} làm regex nhớ ${c('lastIndex')}, nên lần ${c('test')} thứ hai bắt đầu từ cuối lần trước và trả false.</p>`,
      loiHayGap: ['Quên neo — "091234567890" (12 số) vẫn qua.', 'Dùng \\d{10} — nhận cả 02… và 01….'],
      thamKhao: 'https://javascript.info/regexp-anchors',
      kiem: [
        { moTa: 'Valid numbers|||Số hợp lệ', goi: '[isVnMobile("0912345678"), isVnMobile("0381234567"), isVnMobile("0587654321")]', mongDoi: [true, true, true] },
        { moTa: 'Invalid numbers|||Số không hợp lệ', goi: '[" 0912345678", "0212345678", "091234567", "09123456789", "09a2345678"].map(isVnMobile)', mongDoi: [false, false, false, false, false] },
        { moTa: 'Same answer twice in a row|||Hai lần liền cùng đáp án', goi: '[isVnMobile("0912345678"), isVnMobile("0912345678")]', mongDoi: [true, true] },
        { moTa: 'Hidden: number inside a sentence|||Ẩn: số nằm lẫn trong câu', an: true, goi: 'isVnMobile("call 0912345678 now")', mongDoi: false },
      ],
    },
    {
      tieuDe: 'Đuôi file ảnh',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['cờ i', 'nhóm |', 'thoát dấu chấm'], tienQuyet: ['regex test'], the: ['javascript', 'regex'],
      moTa: `${BAI}<p>Viết ${c('isImage(filename)')}: true khi tên file KẾT THÚC bằng ${c('.jpg')}, ${c('.jpeg')}, ${c('.png')} hoặc ${c('.webp')}, không phân biệt hoa thường. ${c('"photo.PNG"')} đúng; ${c('"png.txt"')}, ${c('"photo.png.exe"')}, ${c('"photopng"')} sai.</p>`,
      yeuCau: [
        'Nhận bốn đuôi, mọi kiểu hoa thường.',
        'Đuôi phải ở CUỐI tên và có dấu chấm thật trước nó.',
        `${c('"archive.jpg.zip"')} là false.`,
      ],
      dauVao: 'filename: string.', dauRa: 'boolean.',
      rangBuoc: ['Một regex.'],
      viDu: [{ input: 'isImage("A.JPEG")', output: 'true', explanation: 'Cờ i bỏ qua hoa/thường.' }],
      goiY: ['Dấu chấm phải thoát: \\. ; cuối chuỗi: $.', 'return /\\.(jpe?g|png|webp)$/i.test(filename);'],
      khoiDau: { 'main.js': `// Bài 11.5 — đuôi ảnh
function isImage(filename) {
  return /(jpg|jpeg|png|webp)/.test(filename);
}
` },
      loiGiai: { 'main.js': `// Bài 11.5 — đuôi ảnh: dấu chấm thật (\\.) + một trong các đuôi + hết chuỗi, cờ i
// \\.        dấu chấm THẬT (không thoát thì . là "ký tự bất kỳ")
// (jpe?g|png|webp)  một trong các đuôi; jpe?g = jpg hoặc jpeg
// $          đuôi phải nằm ở CUỐI tên file
// i          không phân biệt hoa thường
const IMAGE = /\\.(jpe?g|png|webp)$/i;

function isImage(filename) {
  return IMAGE.test(filename);
}
` },
      giaiThich: `<p>${c('.')} không thoát nghĩa là "ký tự bất kỳ" nên ${c('"photopng"')} sẽ qua; ${c('\\\\.')} là dấu chấm thật. ${c('$')} buộc đuôi nằm cuối, chặn ${c('"photo.png.exe"')}. ${c('jpe?g')} gọn hơn ${c('jpg|jpeg')}.</p>`,
      loiHayGap: ['Quên $ — "x.png.exe" lọt.', 'Viết . thay vì \\. — "photopng" lọt.'],
      thamKhao: 'https://javascript.info/regexp-escaping',
      kiem: [
        { moTa: 'Accepts the four extensions, any case|||Nhận bốn đuôi, mọi kiểu chữ', goi: '["a.jpg", "b.JPEG", "c.Png", "d.webp"].map(isImage)', mongDoi: [true, true, true, true] },
        { moTa: 'Rejects lookalikes|||Loại các tên trông giống', goi: '["png.txt", "photo.png.exe", "photopng", "archive.jpg.zip"].map(isImage)', mongDoi: [false, false, false, false] },
        { moTa: 'Hidden: no extension|||Ẩn: không có đuôi', an: true, goi: 'isImage("README")', mongDoi: false },
      ],
    },
    {
      tieuDe: 'Đổi ngày dd/mm/yyyy sang ISO',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['nhóm có tên', 'match'], tienQuyet: ['regex'], the: ['javascript', 'regex', 'date'],
      moTa: `${BAI}<p>Viết ${c('toIsoDate(s)')}: ${c('"01/11/2026"')} ⇒ ${c('"2026-11-01"')}. Dùng nhóm có tên ${c('(?<day>…)')}. Chuỗi không đúng dạng (thiếu số 0, sai dấu, có chữ thừa) ⇒ ${c('null')}. Ngoài ra kiểm tháng 1–12 và ngày 1–31 (không cần kiểm ngày 31/2).</p>`,
      yeuCau: [
        'Đúng dạng ⇒ chuỗi ISO.',
        'Sai dạng hoặc tháng 13, ngày 00 ⇒ null.',
        'Dùng nhóm có tên (groups).',
      ],
      dauVao: 's: string.', dauRa: 'string | null.',
      rangBuoc: ['Không dùng Date để phân tích.'],
      viDu: [{ input: 'toIsoDate("1/11/2026")', output: 'null', explanation: 'Ngày phải có hai chữ số.' }],
      goiY: ['/^(?<day>\\d{2})\\/(?<month>\\d{2})\\/(?<year>\\d{4})$/ — nhớ kiểm m === null.', 'const { day, month, year } = m.groups; if (+month < 1 || +month > 12 || +day < 1 || +day > 31) return null;'],
      khoiDau: { 'main.js': `// Bài 11.5 — đổi ngày
function toIsoDate(s) {
  const p = s.split('/');
  return p[2] + '-' + p[1] + '-' + p[0];
}
` },
      loiGiai: { 'main.js': `// Bài 11.5 — đổi ngày: nhóm có tên + kiểm khoảng
const DMY = /^(?<day>\\d{2})\\/(?<month>\\d{2})\\/(?<year>\\d{4})$/;

function toIsoDate(s) {
  const m = s.match(DMY);
  if (m === null) return null;                     // match trả null khi không khớp
  const { day, month, year } = m.groups;
  if (+month < 1 || +month > 12 || +day < 1 || +day > 31) return null;
  return year + '-' + month + '-' + day;
}
` },
      giaiThich: `<p>Neo hai đầu loại chữ thừa; ${c('\\\\d{2}')} bắt buộc hai chữ số; ${c('\\\\/')} là dấu gạch chéo thật. ${c('m.groups')} cho ${c('day')}, ${c('month')}, ${c('year')} theo tên, không phải đếm ngoặc. Nhớ ${c('match')} trả ${c('null')} — đọc ${c('.groups')} trên null là sập.</p>`,
      loiHayGap: ['Không kiểm null trước khi đọc groups.', 'split("/") — chấp nhận mọi rác.'],
      thamKhao: 'https://javascript.info/regexp-groups#named-groups',
      kiem: [
        { moTa: 'Converts a valid date|||Đổi ngày hợp lệ', goi: 'toIsoDate("01/11/2026")', mongDoi: '2026-11-01' },
        { moTa: 'Wrong shapes give null|||Sai dạng cho null', goi: '["1/11/2026", "01-11-2026", "01/11/2026x", "aa/bb/cccc"].map(toIsoDate)', mongDoi: [null, null, null, null] },
        { moTa: 'Out-of-range parts give null|||Ngoài khoảng cho null', goi: '[toIsoDate("01/13/2026"), toIsoDate("00/10/2026"), toIsoDate("32/01/2026")]', mongDoi: [null, null, null] },
        { moTa: 'Uses named groups|||Dùng nhóm có tên', kiem: 'ma-nguon', tep: 'main.js', khop: '\\(\\?<\\w+>' },
        { moTa: 'Hidden: 31/12|||Ẩn: 31/12', an: true, goi: 'toIsoDate("31/12/1999")', mongDoi: '1999-12-31' },
      ],
    },
    {
      tieuDe: 'Rút điểm bằng matchAll',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['matchAll', 'cờ g', '\\p{L}'], tienQuyet: ['nhóm bắt'], the: ['javascript', 'regex'],
      moTa: `${BAI}<p>Văn bản dạng ${c('"Lan: 9, Minh: 7.5, Đức: 10"')}. Viết ${c('parseScores(text)')} trả mảng ${c('{ name, score }')} theo thứ tự xuất hiện, ${c('score')} là số. Tên có thể là chữ tiếng Việt có dấu; điểm có thể có phần thập phân. Không có cặp nào ⇒ mảng rỗng.</p>`,
      yeuCau: [
        'Trả đủ mọi cặp, đúng thứ tự, điểm là number.',
        'Tên tiếng Việt có dấu được nhận nguyên vẹn (Đức, không phải "c").',
        'Chuỗi không có cặp ⇒ [].',
      ],
      dauVao: 'text: string.', dauRa: '{ name: string, score: number }[].',
      rangBuoc: ['Dùng matchAll.'],
      viDu: [{ input: 'parseScores("Đức: 10")', output: '[{ name: "Đức", score: 10 }]', explanation: '\\w sẽ chỉ bắt được "c".'}],
      goiY: ['/(\\p{L}+):\\s*(\\d+(?:\\.\\d+)?)/gu — matchAll cần cờ g.', '[...text.matchAll(re)].map((m) => ({ name: m[1], score: Number(m[2]) }))'],
      khoiDau: { 'main.js': `// Bài 11.5 — rút điểm
function parseScores(text) {
  const m = text.match(/(\\w+): (\\d+)/);
  return m ? [{ name: m[1], score: m[2] }] : [];
}
` },
      loiGiai: { 'main.js': `// Bài 11.5 — rút điểm: \\p{L} hiểu chữ có dấu (cờ u), matchAll cho mọi cặp (cờ g)
const PAIR = /(\\p{L}+):\\s*(\\d+(?:\\.\\d+)?)/gu;   // (?: ) = nhóm không bắt, cho phần thập phân tuỳ chọn

function parseScores(text) {
  return [...text.matchAll(PAIR)].map((m) => ({ name: m[1], score: Number(m[2]) }));
}
` },
      giaiThich: `<p>${c('match')} không có ${c('g')} chỉ cho cặp đầu; ${c('matchAll')} (bắt buộc ${c('g')}) cho mọi cặp kèm nhóm. ${c('\\\\w')} là ASCII nên "Đức" thành "c" — dùng ${c('\\\\p{L}')} với cờ ${c('u')}. Điểm đọc ra là chuỗi, đổi bằng ${c('Number')}.</p>`,
      loiHayGap: ['Dùng \\w — tên có dấu bị cắt.', 'Quên Number — score là "9".'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/matchAll',
      kiem: [
        { moTa: 'All pairs, numbers|||Mọi cặp, điểm là số', goi: 'parseScores("Lan: 9, Minh: 7.5, Đức: 10")', mongDoi: [{ name: 'Lan', score: 9 }, { name: 'Minh', score: 7.5 }, { name: 'Đức', score: 10 }] },
        { moTa: 'No pairs ⇒ []|||Không có cặp ⇒ []', goi: 'parseScores("no scores here")', mongDoi: [] },
        { moTa: 'Uses matchAll|||Dùng matchAll', kiem: 'ma-nguon', tep: 'main.js', khop: 'matchAll' },
        { moTa: 'Hidden: flexible spacing|||Ẩn: khoảng trắng linh hoạt', an: true, goi: 'parseScores("Hà:8;  Nguyễn:   6.25")', mongDoi: [{ name: 'Hà', score: 8 }, { name: 'Nguyễn', score: 6.25 }] },
      ],
    },
    {
      tieuDe: 'slugify tiếng Việt',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['normalize NFD', '\\p{M}', 'replace'], tienQuyet: ['regex replace'], the: ['javascript', 'regex', 'tiếng việt'],
      moTa: `${BAI}<p>Viết ${c('slugify(text)')} cho URL: bỏ dấu tiếng Việt, ${c('đ/Đ')} ⇒ ${c('d')}, viết thường, mọi chuỗi ký tự không phải ${c('a-z0-9')} thành MỘT dấu gạch ngang, không có gạch ngang ở đầu/cuối. ${c('"Học CSS Nâng Cao!"')} ⇒ ${c('"hoc-css-nang-cao"')}.</p>`,
      yeuCau: [
        `${c('"Đà Nẵng"')} ⇒ ${c('"da-nang"')}; ${c('"Học CSS Nâng Cao!"')} ⇒ ${c('"hoc-css-nang-cao"')}.`,
        'Nhiều ký tự lạ liền nhau chỉ thành một gạch; không có gạch thừa hai đầu.',
        'Chữ đã ở dạng NFD (tách dấu) vẫn cho cùng kết quả.',
      ],
      dauVao: 'text: string.', dauRa: 'string.',
      rangBuoc: ['Không dùng bảng tra từng chữ có dấu.'],
      viDu: [{ input: 'slugify("  --Xin   chào, thế giới!!  ")', output: '"xin-chao-the-gioi"', explanation: 'Gạch ở hai đầu bị cắt.' }],
      goiY: ['normalize("NFD") tách chữ khỏi dấu; replace(/\\p{M}/gu, "") bỏ dấu.', '.replace(/đ/gi, "d").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")'],
      khoiDau: { 'main.js': `// Bài 11.5 — slugify
function slugify(text) {
  return text.toLowerCase().replace(/ /g, '-');
}
` },
      loiGiai: { 'main.js': `// Bài 11.5 — slugify: tách dấu, bỏ dấu, xử lý đ, gom mọi thứ khác thành một gạch
function slugify(text) {
  return text
    .normalize('NFD')                // "ọ" -> "o" + dấu tổ hợp
    .replace(/\\p{M}/gu, '')          // bỏ mọi dấu tổ hợp (Mark)
    .replace(/đ/gi, 'd')             // đ/Đ không có dạng tổ hợp, xử lý riêng
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')     // chuỗi ký tự lạ -> một gạch
    .replace(/^-+|-+$/g, '');        // không gạch ở hai đầu
}
` },
      giaiThich: `<p>NFD biến mỗi chữ có dấu thành chữ gốc + dấu tổ hợp; ${c('\\\\p{M}')} (cờ ${c('u')}) bắt đúng các dấu đó. ${c('đ')} là một chữ riêng nên phải thay tay. Lớp phủ định ${c('[^a-z0-9]+')} với ${c('+')} gom cả cụm ký tự lạ thành một gạch.</p>`,
      loiHayGap: ['Quên đ — "Đà Nẵng" thành "a-nang".', 'Thiếu + — "a  b" thành "a--b".'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize',
      kiem: [
        { moTa: 'Vietnamese titles|||Tiêu đề tiếng Việt', goi: '[slugify("Học CSS Nâng Cao!"), slugify("Đà Nẵng")]', mongDoi: ['hoc-css-nang-cao', 'da-nang'] },
        { moTa: 'Collapses and trims dashes|||Gom và cắt gạch', goi: 'slugify("  --Xin   chào, thế giới!!  ")', mongDoi: 'xin-chao-the-gioi' },
        { moTa: 'NFD input gives the same slug|||Đầu vào NFD cho cùng slug', goi: 'slugify("Nguyễn Đức".normalize("NFD")) === slugify("Nguyễn Đức")', mongDoi: true },
        { moTa: 'Hidden: digits kept|||Ẩn: giữ chữ số', an: true, goi: 'slugify("Bài 11.5 — Regex")', mongDoi: 'bai-11-5-regex' },
      ],
    },
    {
      tieuDe: 'Đếm một từ nguyên vẹn (Unicode)',
      doKho: 'HARD', phut: 20,
      khaiNiem: ['lookbehind/lookahead', '\\p{L}', 'thoát ký tự đặc biệt', 'new RegExp'], tienQuyet: ['regex', 'normalize'], the: ['javascript', 'regex', 'tiếng việt'],
      moTa: `${BAI}<p>Viết ${c('countWord(text, word)')}: đếm số lần ${c('word')} xuất hiện như một TỪ NGUYÊN VẸN (không dính chữ/số ở trước hoặc sau), không phân biệt hoa thường, hiểu tiếng Việt: đếm "ăn" trong "Tôi ăn cơm, Văn ăn phở" phải ra 2, không phải 3. ${c('word')} có thể chứa ký tự đặc biệt của regex (${c('"C++"')}, ${c('"a.b"')}) — phải thoát trước khi dựng regex. So khớp sau khi chuẩn hoá NFC cả hai bên.</p>`,
      yeuCau: [
        `${c('countWord("Tôi ăn cơm, Văn ăn phở", "ăn")')} là 2 (không đếm "ăn" trong "Văn").`,
        `${c('countWord("C++ và c++, không phải XC++", "C++")')} xử lý đúng ký tự đặc biệt.`,
        'Không phân biệt hoa thường; chữ ở dạng NFD vẫn đếm được.',
      ],
      dauVao: 'text, word: string.', dauRa: 'number.',
      rangBuoc: ['Không dùng \\b (ASCII).'],
      viDu: [{ input: 'countWord("a.b axb a.b", "a.b")', output: '2', explanation: 'Dấu chấm được thoát nên "axb" không khớp.' }],
      goiY: ['Thoát: word.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&")', 'new RegExp("(?<![\\\\p{L}\\\\p{N}])" + esc + "(?![\\\\p{L}\\\\p{N}])", "giu") rồi (text.match(re) ?? []).length'],
      khoiDau: { 'main.js': `// Bài 11.5 — đếm từ (hỏng: \\b là ASCII, không thoát ký tự đặc biệt)
function countWord(text, word) {
  const re = new RegExp('\\\\b' + word + '\\\\b', 'gi');
  return (text.match(re) || []).length;
}
` },
      loiGiai: { 'main.js': `// Bài 11.5 — đếm từ nguyên vẹn, hiểu Unicode
function escapeRegExp(s) {
  return s.replace(/[.*+?^@{}()|[\\]\\\\]/g, '\\\\$&');   // $& = chính ký tự vừa khớp, thêm \\ phía trước
}

function countWord(text, word) {
  const t = text.normalize('NFC');
  const w = escapeRegExp(word.normalize('NFC'));
  // trước và sau từ KHÔNG được là chữ cái (\\p{L}) hay chữ số (\\p{N}) của bất kỳ ngôn ngữ nào
  const re = new RegExp('(?<![\\\\p{L}\\\\p{N}])' + w + '(?![\\\\p{L}\\\\p{N}])', 'giu');
  return (t.match(re) ?? []).length;
}
` },
      giaiThich: `<p>${c('\\\\b')} coi "ă" không phải chữ cái, nên thấy ranh giới giữa "V" và "ăn". Lookbehind ${c('(?<![\\\\p{L}\\\\p{N}])')} và lookahead ${c('(?![\\\\p{L}\\\\p{N}])')} nói đúng ý "không dính chữ/số". ${c('escapeRegExp')} thêm ${c('\\\\')} trước mọi ký tự đặc biệt để "C++" là chữ thường chứ không phải lượng từ. Chuẩn hoá NFC để "ă" dạng tách dấu vẫn khớp.</p>`,
      loiHayGap: ['Không thoát — new RegExp("C++") ném SyntaxError (Nothing to repeat).', 'Quên cờ u — \\p{L} không có nghĩa.'],
      thamKhao: 'https://javascript.info/regexp-lookahead-lookbehind',
      kiem: [
        { moTa: 'Whole Vietnamese words only|||Chỉ đếm từ tiếng Việt nguyên vẹn', goi: 'countWord("Tôi ăn cơm, Văn ăn phở", "ăn")', mongDoi: 2 },
        { moTa: 'Special characters escaped|||Thoát ký tự đặc biệt', goi: '[countWord("C++ và c++, không phải XC++", "C++"), countWord("a.b axb a.b", "a.b")]', mongDoi: [2, 2] },
        { moTa: 'Case-insensitive|||Không phân biệt hoa thường', goi: 'countWord("Đức đức ĐỨC Đứcx", "đức")', mongDoi: 3 },
        { moTa: 'NFD text still counts|||Chữ dạng NFD vẫn đếm', goi: 'countWord("Văn ăn".normalize("NFD"), "ăn")', mongDoi: 1 },
        { moTa: 'Does not use \\b|||Không dùng \\b', kiem: 'ma-nguon', tep: 'main.js', khop: '\\\\\\\\b', phuDinh: true },
        { moTa: 'Hidden: no match ⇒ 0|||Ẩn: không khớp ⇒ 0', an: true, goi: 'countWord("xin chào", "ăn")', mongDoi: 0 },
      ],
    },
  ],
});
