/** Bộ luyện bài 10.1 — Tư duy như lập trình viên. Lược đồ: ./_luoc-do.mjs (loại 'js'). kiem[].moTa = "EN|||VI". ´ = dấu huyền, @{ = ${
 *  Mỗi đề là một bài toán nhỏ mà ca biên mới là phần khó: đảo từ, viết hoa tiêu đề, ba từ hay gặp nhất, khách chi nhiều nhất,
 *  nén chuỗi lặp, ngoặc cân bằng kèm vị trí lỗi. Viết kế hoạch thành chú thích trước, kiểm từng ca biên. */
import { c, doiDau } from './_luoc-do.mjs';

const BAI = '<p><em>Bài 10.1 — Tư duy như lập trình viên.</em> Trước khi gõ: nói lại đầu vào/đầu ra, viết kế hoạch bằng lời thành chú thích, liệt kê ca biên. Bộ kiểm dưới đây cố ý dồn vào ca biên.</p>';

export default doiDau({
  slug: 'wf-10-1-think-like-a-programmer',
  ten: '10.1 Tư duy như lập trình viên',
  baiHoc: 'Nền tảng Web — Bài 10.1 Thinking like a programmer',
  ngonNgu: 'javascript',
  loaiKiem: 'js',
  level: 'BEGINNER',
  moTa: 'Sáu bài toán nhỏ mà ca biên mới là phần khó: đảo từ với khoảng trắng thừa, viết hoa tiêu đề trừ từ nhỏ, ba từ hay gặp nhất, N khách chi nhiều nhất, nén chuỗi lặp, và kiểm ngoặc cân bằng kèm vị trí lỗi đầu tiên — 6 bài.',
  de: [
    {
      tieuDe: 'Đảo thứ tự từ',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['chia nhỏ bài toán', 'ca biên'], tienQuyet: ['split', 'trim'], the: ['javascript', 'tư duy'],
      moTa: `${BAI}<p>Viết ${c('reverseWords(sentence)')} trả các TỪ theo thứ tự ngược, nối bằng đúng một dấu cách. Mọi chuỗi khoảng trắng (dấu cách, tab, xuống dòng) là MỘT dấu ngăn; khoảng trắng hai đầu bị bỏ. Câu rỗng hoặc chỉ có khoảng trắng ⇒ ${c('""')}.</p>`,
      yeuCau: ['Đảo từ, không đảo chữ.', 'Mọi loại khoảng trắng là dấu ngăn.', 'Không có từ rỗng.'],
      dauVao: 'sentence: string.', dauRa: 'string.',
      rangBuoc: ['Không sửa thứ tự chữ trong từ.'],
      viDu: [{ input: 'reverseWords("  the   sky\\tis blue ")', output: '"blue is sky the"', explanation: 'Khoảng trắng thừa và tab bị gộp.' }],
      goiY: ['Kế hoạch: tách → đảo → nối. Bước tách là chỗ khó.', 'sentence.trim().split(/\\s+/) — rồi xử lý riêng câu rỗng.'],
      khoiDau: { 'main.js': `// Bài 10.1 — đảo từ
// 1. tách thành từ   2. đảo   3. nối
function reverseWords(sentence) {
  return sentence.split(' ').reverse().join(' ');
}
` },
      loiGiai: { 'main.js': `// Bài 10.1 — kế hoạch: (1) tách theo MỌI chuỗi khoảng trắng, bỏ hai đầu  (2) đảo  (3) nối bằng một dấu cách
function reverseWords(sentence) {
  const trimmed = sentence.trim();
  if (trimmed === '') return '';                 // ca biên: không có từ nào
  return trimmed.split(/\\s+/).reverse().join(' ');
}
` },
      giaiThich: `<p>Kế hoạch "tách, đảo, nối" đúng ngay từ đầu; chỗ sai nằm ở cách hiểu "tách". ${c("split(' ')")} tạo từ rỗng giữa hai dấu cách liền nhau và coi tab là một phần của từ. Ca biên buộc bạn định nghĩa "từ" cho chính xác.</p>`,
      loiHayGap: ["split(' ') với khoảng trắng thừa.", 'Quên tab/xuống dòng.', '"   " trả về " ".'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split',
      kiem: [
        { moTa: 'The normal sentence|||Câu bình thường', goi: 'reverseWords("the sky is blue")', mongDoi: 'blue is sky the' },
        { moTa: 'Extra spaces, tabs and newlines|||Khoảng trắng thừa, tab, xuống dòng', goi: '[reverseWords("  the   sky  "), reverseWords("one\\ttwo\\nthree")]', mongDoi: ['sky the', 'three two one'] },
        { moTa: 'Empty and single word|||Rỗng và một từ', goi: '[reverseWords(""), reverseWords("   "), reverseWords("hello")]', mongDoi: ['', '', 'hello'] },
      ],
    },
    {
      tieuDe: 'Viết hoa tiêu đề',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['quy tắc có ngoại lệ'], tienQuyet: ['map', 'Set'], the: ['javascript', 'tư duy'],
      moTa: `${BAI}<p>Viết ${c('titleCase(text)')}: viết hoa chữ cái đầu mỗi từ, các chữ còn lại viết thường — TRỪ các từ nhỏ ${c('a, an, the, and, or, of, in, on, to, for')} thì viết thường hoàn toàn, nhưng từ ĐẦU và từ CUỐI luôn viết hoa. Từ có dấu gạch nối viết hoa từng phần (${c('"full-stack"')} → ${c('"Full-Stack"')}). Khoảng trắng gộp như bài trước.</p>`,
      yeuCau: ['Từ nhỏ viết thường ở giữa.', 'Từ đầu/cuối luôn viết hoa.', 'Gạch nối viết hoa từng phần.'],
      dauVao: 'text: string.', dauRa: 'string.',
      rangBuoc: ['Chữ có dấu tiếng Việt cũng phải đúng (toUpperCase lo được).'],
      viDu: [{ input: 'titleCase("the art OF debugging")', output: '"The Art of Debugging"', explanation: '"the" ở đầu vẫn viết hoa; "of" ở giữa viết thường.' }],
      goiY: ['const words = text.trim().split(/\\s+/).filter(Boolean);', 'const cap = (w) => w.split("-").map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join("-");'],
      khoiDau: { 'main.js': `// Bài 10.1 — viết hoa tiêu đề
function titleCase(text) {
  return text.toUpperCase();
}
` },
      loiGiai: { 'main.js': `// Bài 10.1 — quy tắc chính (viết hoa) + ngoại lệ (từ nhỏ) + ngoại lệ của ngoại lệ (đầu/cuối)
const SMALL = new Set(['a', 'an', 'the', 'and', 'or', 'of', 'in', 'on', 'to', 'for']);
const cap = (w) => w.split('-').map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join('-');

function titleCase(text) {
  const words = text.trim().split(/\\s+/).filter(Boolean);
  return words.map((w, i) => {
    const lower = w.toLowerCase();
    const edge = i === 0 || i === words.length - 1;
    return SMALL.has(lower) && !edge ? lower : cap(w);
  }).join(' ');
}
` },
      giaiThich: `<p>Viết quy tắc thành ba dòng chú thích trước (chính, ngoại lệ, ngoại lệ của ngoại lệ) làm mã gần như tự viết. Bộ kiểm có đúng các ca: từ nhỏ ở đầu, ở cuối, chữ hoa lộn xộn, gạch nối.</p>`,
      loiHayGap: ['Viết thường "The" ở đầu.', 'Không hạ phần còn lại ("OF" → "OF").', 'Gạch nối chỉ hoa phần đầu.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase',
      kiem: [
        { moTa: 'Small words in the middle|||Từ nhỏ ở giữa', goi: 'titleCase("the art OF debugging")', mongDoi: 'The Art of Debugging' },
        { moTa: 'First and last word always capitalised|||Từ đầu và cuối luôn hoa', goi: '[titleCase("what is it for"), titleCase("of mice and men")]', mongDoi: ['What Is It For', 'Of Mice and Men'] },
        { moTa: 'Hyphens, accents and extra spaces|||Gạch nối, dấu và khoảng trắng thừa', goi: '[titleCase("  a full-stack   guide "), titleCase("đà nẵng in summer")]', mongDoi: ['A Full-Stack Guide', 'Đà Nẵng in Summer'] },
      ],
    },
    {
      tieuDe: 'Ba từ hay gặp nhất',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['dò tay', 'đếm', 'phân định hoà'], tienQuyet: ['Map', 'sort', 'regex'], the: ['javascript', 'tư duy'],
      moTa: `${BAI}<p>Viết ${c('topWords(text, n = 3)')} trả mảng ${c('{ word, count }')}: từ là chuỗi chữ/số liên tiếp (chữ mọi ngôn ngữ, ${c("/[\\p{L}\\p{N}']+/gu")}), không phân biệt hoa thường (trả về chữ thường), bỏ từ dừng ${c('the, a, an, is, and, of, to, in, it')}. Sắp theo số lần giảm dần, hoà thì theo bảng chữ cái (${c('localeCompare')}), lấy ${c('n')} phần tử đầu. Văn bản rỗng ⇒ ${c('[]')}.</p>`,
      yeuCau: ['Bỏ dấu câu và chữ hoa.', 'Bỏ từ dừng.', 'Phân định hoà theo chữ cái.'],
      dauVao: 'text: string; n?: number.', dauRa: '{ word, count }[].',
      rangBuoc: ['match trả null khi không có từ.'],
      viDu: [{ input: 'topWords("The cache is fast. The cache is small; a small cache is a fast cache!")', output: '[{ word: "cache", count: 4 }, { word: "fast", count: 2 }, { word: "small", count: 2 }]', explanation: 'Đúng phần dò tay trong bài.' }],
      goiY: ['1. tách  2. bỏ từ dừng  3. đếm bằng Map  4. sắp + cắt', '.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))'],
      khoiDau: { 'main.js': `// Bài 10.1 — ba từ hay gặp nhất (bản viết một mạch — chạy bộ kiểm xem nó hỏng ở đâu)
function topWords(text, n = 3) {
  const counts = {};
  for (const w of text.split(' ')) counts[w] = (counts[w] || 0) + 1;
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, n).map(([word, count]) => ({ word, count }));
}
` },
      loiGiai: { 'main.js': `// Bài 10.1 — bốn bước của kế hoạch, mỗi bước một dòng chú thích
const STOP = new Set(['the', 'a', 'an', 'is', 'and', 'of', 'to', 'in', 'it']);

function topWords(text, n = 3) {
  const words = text.toLowerCase().match(/[\\p{L}\\p{N}']+/gu) ?? [];   // 1. tách (chữ mọi ngôn ngữ)
  const counts = new Map();
  for (const w of words) if (!STOP.has(w)) counts.set(w, (counts.get(w) ?? 0) + 1);   // 2–3. bỏ từ dừng, đếm
  return [...counts]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))          // 4. nhiều trước, hoà theo chữ cái
    .slice(0, n)
    .map(([word, count]) => ({ word, count }));
}
` },
      giaiThich: `<p>Bản khởi đầu là bản v1 của bài học: đúng ca đơn giản, hỏng bốn ca còn lại (chữ hoa + dấu câu, từ dừng, văn bản rỗng, hoà). Sửa từng ca một, chạy lại sau mỗi lần.</p>`,
      loiHayGap: ['"Cache." và "cache" thành hai từ.', 'Văn bản rỗng đếm "" là một từ.', 'Hoà theo thứ tự xuất hiện.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Regular_expressions/Unicode_character_class_escape',
      kiem: [
        { moTa: 'The traced example|||Ví dụ đã dò tay', goi: 'topWords("The cache is fast. The cache is small; a small cache is a fast cache!")', mongDoi: [{ word: 'cache', count: 4 }, { word: 'fast', count: 2 }, { word: 'small', count: 2 }] },
        { moTa: 'Case, punctuation, stop words|||Hoa thường, dấu câu, từ dừng', goi: '[topWords("Cache. cache, CACHE!", 1), topWords("the the the sql", 1)]', mongDoi: [[{ word: 'cache', count: 3 }], [{ word: 'sql', count: 1 }]] },
        { moTa: 'Empty text and ties|||Văn bản rỗng và hoà', goi: '[topWords(""), topWords("pear apple", 2)]', mongDoi: [[], [{ word: 'apple', count: 1 }, { word: 'pear', count: 1 }]] },
        { moTa: 'Letters in any language|||Chữ mọi ngôn ngữ', goi: 'topWords("Đà Nẵng, đà nẵng và Huế", 2)', mongDoi: [{ word: 'đà', count: 2 }, { word: 'nẵng', count: 2 }] },
      ],
    },
    {
      tieuDe: 'N khách chi nhiều nhất',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['cộng dồn theo khoá', 'ca biên'], tienQuyet: ['Map', 'sort'], the: ['javascript', 'tư duy'],
      moTa: `${BAI}<p>Đây là bài luyện của bài học. Viết ${c('topCustomers(orders, n)')} với ${c('orders')} là mảng ${c('{ customer, total }')}. Trả mảng ${c('{ customer, spent, orders }')} (tổng tiền và số đơn) của N khách chi nhiều nhất; hoà thì khách có NHIỀU đơn hơn trước, vẫn hoà thì theo tên (${c('localeCompare')}). Tên khách so khớp sau khi trim và không phân biệt hoa thường, nhưng trả về đúng cách viết ở đơn ĐẦU TIÊN. Đơn có ${c('total')} không phải số hữu hạn ≥ 0 bị bỏ qua. ${c('n')} lớn hơn số khách ⇒ trả hết.</p>`,
      yeuCau: ['Cộng dồn theo khách.', 'Ba tầng sắp xếp.', 'Gộp tên khác hoa thường.', 'Bỏ đơn sai.'],
      dauVao: 'orders: { customer: string, total: number }[]; n: number.', dauRa: '{ customer, spent, orders }[].',
      rangBuoc: ['Không sửa mảng đầu vào.'],
      viDu: [{ input: 'topCustomers([{ customer: "Lan", total: 50000 }, { customer: "Minh", total: 80000 }, { customer: "lan ", total: 40000 }], 1)', output: '[{ customer: "Lan", spent: 90000, orders: 2 }]', explanation: '"lan " là cùng một khách.' }],
      goiY: ['const key = o.customer.trim().toLowerCase(); — lưu { customer, spent, orders } trong Map theo key', 'sort((a, b) => b.spent - a.spent || b.orders - a.orders || a.customer.localeCompare(b.customer))'],
      khoiDau: { 'main.js': `// Bài 10.1 — N khách chi nhiều nhất
// 1. bỏ đơn sai  2. cộng dồn theo khách  3. sắp  4. lấy n
function topCustomers(orders, n) {
  return [];
}
` },
      loiGiai: { 'main.js': `// Bài 10.1 — cùng hình dạng với topWords: "đếm" thành "cộng dồn"
function topCustomers(orders, n) {
  const byKey = new Map();
  for (const o of orders) {
    if (!Number.isFinite(o.total) || o.total < 0) continue;             // 1. bỏ đơn sai
    const key = String(o.customer).trim().toLowerCase();
    const row = byKey.get(key) ?? { customer: String(o.customer).trim(), spent: 0, orders: 0 };
    row.spent += o.total;                                               // 2. cộng dồn
    row.orders += 1;
    byKey.set(key, row);
  }
  return [...byKey.values()]
    .sort((a, b) => b.spent - a.spent || b.orders - a.orders || a.customer.localeCompare(b.customer))   // 3.
    .slice(0, n);                                                       // 4.
}
` },
      giaiThich: `<p>Kế hoạch giống hệt ${c('topWords')} — đó là điểm của bài: nhận ra hình dạng đã giải rồi. Ca biên nằm ở định nghĩa "cùng một khách" và "đơn hợp lệ", phải quyết định TRƯỚC khi viết.</p>`,
      loiHayGap: ['"Lan" và "lan " thành hai khách.', 'Cộng "50000" (chuỗi).', 'Quên tầng sắp theo số đơn.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map',
      kiem: [
        { moTa: 'Same customer, different spelling|||Cùng khách, viết khác', goi: 'topCustomers([{ customer: "Lan", total: 50000 }, { customer: "Minh", total: 80000 }, { customer: "lan ", total: 40000 }], 1)', mongDoi: [{ customer: 'Lan', spent: 90000, orders: 2 }] },
        { moTa: 'Ties: more orders first, then name|||Hoà: nhiều đơn trước, rồi theo tên', goi: 'topCustomers([{ customer: "Binh", total: 100 }, { customer: "An", total: 60 }, { customer: "An", total: 40 }, { customer: "Chi", total: 100 }], 5)', mongDoi: [{ customer: 'An', spent: 100, orders: 2 }, { customer: 'Binh', spent: 100, orders: 1 }, { customer: 'Chi', spent: 100, orders: 1 }] },
        { moTa: 'Bad totals ignored; empty list|||Bỏ đơn sai; danh sách rỗng', goi: '[topCustomers([{ customer: "X", total: "500" }, { customer: "Y", total: -1 }, { customer: "Z", total: NaN }, { customer: "W", total: 0 }], 3), topCustomers([], 3)]', mongDoi: [[{ customer: 'W', spent: 0, orders: 1 }], []] },
      ],
    },
    {
      tieuDe: 'Nén chuỗi lặp',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['duyệt có trạng thái', 'bài toán ngược'], tienQuyet: ['vòng lặp', 'regex'], the: ['javascript', 'tư duy'],
      moTa: `${BAI}<p>Viết ${c('compress(s)')}: mỗi nhóm ký tự giống nhau liên tiếp thành ký tự đó kèm số lần nếu lớn hơn 1 (${c('"aaabcc"')} → ${c('"a3bc2"')}). Chỉ áp cho chuỗi CHỮ CÁI (a–z, A–Z); chuỗi có chữ số ⇒ ném ${c('TypeError("digits are not allowed")')} (vì không giải nén được). Rồi viết ${c('expand(s)')} làm ngược lại, sao cho ${c('expand(compress(x)) === x')}.</p>`,
      yeuCau: ['Số chỉ khi > 1.', 'Phân biệt hoa thường ("aA" giữ nguyên).', 'expand là phép ngược.'],
      dauVao: 's: string.', dauRa: 'string.',
      rangBuoc: ['Nhóm có thể dài hơn 9 ("a12").'],
      viDu: [{ input: 'compress("aaaaaaaaaaaab")', output: '"a12b"', explanation: 'Số có hai chữ số.' }],
      goiY: ['Duyệt, giữ ký tự hiện tại và số đếm; khi ký tự đổi thì ghi nhóm cũ.', 'expand: s.replace(/([a-zA-Z])(\\d*)/g, (_, ch, n) => ch.repeat(n ? Number(n) : 1))'],
      khoiDau: { 'main.js': `// Bài 10.1 — nén chuỗi lặp
function compress(s) {
  return s;
}
function expand(s) {
  return s;
}
` },
      loiGiai: { 'main.js': `// Bài 10.1 — duyệt một lượt, nhớ (ký tự, số lần); ghi ra khi ký tự đổi VÀ ở cuối chuỗi
function compress(s) {
  if (/\\d/.test(s)) throw new TypeError('digits are not allowed');
  let out = '';
  for (let i = 0; i < s.length; ) {
    let j = i;
    while (j < s.length && s[j] === s[i]) j++;
    out += s[i] + (j - i > 1 ? String(j - i) : '');
    i = j;
  }
  return out;
}

function expand(s) {
  return s.replace(/([a-zA-Z])(\\d*)/g, (_, ch, n) => ch.repeat(n ? Number(n) : 1));
}
` },
      giaiThich: `<p>Ca biên kinh điển của bài này là nhóm CUỐI chuỗi (vòng lặp kiểu "ghi khi ký tự đổi" quên ghi nó) và số nhiều chữ số. Viết ${c('expand')} rồi kiểm ${c('expand(compress(x)) === x')} là một cách kiểm mạnh: đúng cho mọi x.</p>`,
      loiHayGap: ['Quên nhóm cuối.', 'Viết "a1".', 'Đọc số từng chữ số khi giải nén.'],
      thamKhao: 'https://en.wikipedia.org/wiki/Run-length_encoding',
      kiem: [
        { moTa: 'Basic compression|||Nén cơ bản', goi: '[compress("aaabcc"), compress("abc"), compress(""), compress("aA")]', mongDoi: ['a3bc2', 'abc', '', 'aA'] },
        { moTa: 'Long groups and the last group|||Nhóm dài và nhóm cuối', goi: '[compress("aaaaaaaaaaaab"), compress("bzzz")]', mongDoi: ['a12b', 'bz3'] },
        { moTa: 'expand undoes compress|||expand đảo ngược compress', goi: '["aaabcc", "a", "xyzzzzzzzzzzzzzz", "AAaa"].map((x) => expand(compress(x)) === x)', mongDoi: [true, true, true, true] },
        { moTa: 'Digits are refused|||Chữ số bị từ chối', goi: 'compress("a1")', mongDoi: { loi: 'TypeError', thongDiep: '^digits are not allowed$' } },
      ],
    },
    {
      tieuDe: 'Ngoặc cân bằng và vị trí lỗi',
      doKho: 'HARD', phut: 20,
      khaiNiem: ['ngăn xếp', 'thông báo lỗi hữu ích'], tienQuyet: ['mảng như ngăn xếp'], the: ['javascript', 'tư duy'],
      moTa: `${BAI}<p>Viết ${c('checkBrackets(code)')} kiểm ${c('()')} ${c('[]')} ${c('{}')}. Trả ${c('{ ok: true }')} hoặc ${c('{ ok: false, line, col, message }')} cho lỗi ĐẦU TIÊN (dòng, cột đánh số từ 1): ngoặc đóng không khớp ⇒ ${c('"expected ) but found ]"')}; ngoặc đóng thừa ⇒ ${c('"unexpected }"')}; hết văn bản mà còn ngoặc mở ⇒ báo ở VỊ TRÍ ngoặc mở đó (ngoặc mở gần nhất chưa đóng) với ${c('"unclosed ("')}. Ngoặc nằm trong chuỗi ${c("'...'")} hoặc ${c('"..."')} không tính (không cần xử lý ký tự thoát).</p>`,
      yeuCau: ['Dùng ngăn xếp.', 'Dòng/cột chính xác.', 'Bỏ qua ngoặc trong chuỗi.'],
      dauVao: 'code: string (nhiều dòng).', dauRa: '{ ok } | { ok, line, col, message }.',
      rangBuoc: ['Báo lỗi đầu tiên theo thứ tự đọc.'],
      viDu: [{ input: 'checkBrackets("if (a[0] > 1) {\\n  run(a];\\n}")', output: '{ ok: false, line: 2, col: 8, message: "expected ) but found ]" }', explanation: 'Như cách trình biên dịch chỉ đúng chỗ.' }],
      goiY: ['Ngăn xếp lưu { ch, line, col } của ngoặc mở.', 'Giữ biến quote (null, "\'" hoặc \'"\'): đang trong chuỗi thì chỉ tìm dấu nháy đóng.'],
      khoiDau: { 'main.js': `// Bài 10.1 — ngoặc cân bằng
function checkBrackets(code) {
  const opens = (code.match(/[([{]/g) || []).length;
  const closes = (code.match(/[)\\]}]/g) || []).length;
  return { ok: opens === closes };
}
` },
      loiGiai: { 'main.js': `// Bài 10.1 — ngăn xếp các ngoặc mở kèm vị trí; lỗi đầu tiên thắng
const PAIR = { ')': '(', ']': '[', '}': '{' };
const CLOSE = { '(': ')', '[': ']', '{': '}' };

function checkBrackets(code) {
  const stack = [];
  let line = 1, col = 0, quote = null;
  for (const ch of code) {
    if (ch === '\\n') { line++; col = 0; continue; }
    col++;
    if (quote) { if (ch === quote) quote = null; continue; }        // trong chuỗi: bỏ qua ngoặc
    if (ch === "'" || ch === '"') { quote = ch; continue; }
    if ('([{'.includes(ch)) stack.push({ ch, line, col });
    else if (ch in PAIR) {
      const top = stack.pop();
      if (!top) return { ok: false, line, col, message: 'unexpected ' + ch };
      if (top.ch !== PAIR[ch]) return { ok: false, line, col, message: 'expected ' + CLOSE[top.ch] + ' but found ' + ch };
    }
  }
  const open = stack.pop();
  return open ? { ok: false, line: open.line, col: open.col, message: 'unclosed ' + open.ch } : { ok: true };
}
` },
      giaiThich: `<p>Đếm số ngoặc (mã khởi đầu) nói "có sai" mà không nói "ở đâu", và còn cho qua ${c(')(')}. Thông báo lỗi tốt có vị trí và nói thứ được mong đợi — đúng kiểu thông báo bạn tập đọc ở Bài 10.2. Ngăn xếp là cấu trúc tự nhiên vì ngoặc mở sau phải đóng trước.</p>`,
      loiHayGap: ['Chỉ đếm số lượng.', 'Báo ngoặc mở đầu tiên thay vì gần nhất khi thiếu đóng.', 'Đếm cột lệch sau xuống dòng.'],
      thamKhao: 'https://en.wikipedia.org/wiki/Stack_(abstract_data_type)',
      kiem: [
        { moTa: 'Balanced code|||Mã cân bằng', goi: '[checkBrackets("function f(a) { return [a, {b: (1)}]; }"), checkBrackets("")]', mongDoi: [{ ok: true }, { ok: true }] },
        { moTa: 'Mismatch with line and column|||Không khớp kèm dòng và cột', goi: 'checkBrackets("if (a[0] > 1) {\\n  run(a];\\n}")', mongDoi: { ok: false, line: 2, col: 8, message: 'expected ) but found ]' } },
        { moTa: 'Unexpected close and unclosed open|||Đóng thừa và mở chưa đóng', goi: '[checkBrackets(")("), checkBrackets("a(b[c]\\n{d")]', mongDoi: [{ ok: false, line: 1, col: 1, message: 'unexpected )' }, { ok: false, line: 2, col: 1, message: 'unclosed {' }] },
        { moTa: 'Brackets inside strings are ignored|||Ngoặc trong chuỗi bị bỏ qua', goi: '[checkBrackets("log(\\")\\", \'[\')"), checkBrackets("x = \'(\' + (y")]', mongDoi: [{ ok: true }, { ok: false, line: 1, col: 11, message: 'unclosed (' }] },
      ],
    },
  ],
});
