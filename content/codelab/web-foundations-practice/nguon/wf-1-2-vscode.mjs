/** Bộ luyện bài 1.2 — VS Code. Lược đồ: ./_luoc-do.mjs (loại 'js'). kiem[].moTa = "EN|||VI".
 *  Mỗi đề cài lại một tính năng của trình soạn thảo bằng hàm thuần: Go to File, Ctrl+/, Alt+↑↓, Ctrl+D, đọc JSONC, đổi tên định danh. */
import { c, doiDau } from './_luoc-do.mjs';

const BAI = '<p><em>Bài 1.2 — VS Code: xưởng làm việc.</em> Bạn bấm phím tắt này hằng ngày; giờ tự viết logic đằng sau nó.</p>';

export default doiDau({
  slug: 'wf-1-2-vscode',
  ten: '1.2 VS Code: tính năng trình soạn thảo',
  baiHoc: 'Nền tảng Web — Bài 1.2 VS Code',
  ngonNgu: 'javascript',
  loaiKiem: 'js',
  level: 'BEGINNER',
  moTa: 'Bật/tắt chú thích (Ctrl+/), dời dòng (Alt+↑↓), chọn lần xuất hiện kế (Ctrl+D), khớp tên file kiểu Ctrl+P, đọc settings.json có chú thích (JSONC), đổi tên định danh bỏ qua chuỗi và chú thích — 6 bài.',
  de: [
    {
      tieuDe: 'Ctrl+/ — bật/tắt chú thích',
      doKho: 'EASY', phut: 12,
      khaiNiem: ['mảng dòng', 'every', 'thụt lề'], tienQuyet: ['chuỗi', 'map'], the: ['javascript', 'editor'],
      moTa: `${BAI}<p>Viết ${c('toggleComment(lines)')} nhận mảng dòng đang chọn và trả mảng mới. Nếu MỌI dòng không rỗng đều đã bắt đầu (sau thụt lề) bằng ${c('// ')} ⇒ bỏ ${c('// ')} ở từng dòng (giữ thụt lề). Ngược lại ⇒ chèn ${c('// ')} vào mỗi dòng không rỗng, ngay sau phần thụt lề. Dòng rỗng (chỉ khoảng trắng) giữ nguyên.</p>`,
      yeuCau: ['Quyết định chung cho cả khối, không từng dòng.', 'Giữ nguyên thụt lề.', 'Dòng rỗng không bị đụng tới.'],
      dauVao: 'lines: string[].', dauRa: 'string[].',
      rangBuoc: ['Không sửa mảng vào.'],
      viDu: [{ input: 'toggleComment(["  let a = 1;", "  a++;"])', output: '["  // let a = 1;", "  // a++;"]', explanation: 'Bấm lần nữa là trở lại như cũ.' }],
      goiY: ['Tách thụt lề: const m = /^(\\s*)(.*)$/.exec(line); m[1] là thụt lề, m[2] là phần còn lại.', 'const allCommented = lines.filter((l) => l.trim()).every((l) => l.trim().startsWith("// "));'],
      khoiDau: { 'main.js': `// Bài 1.2 — Ctrl+/
function toggleComment(lines) {
  return lines.map((l) => '// ' + l);
}
` },
      loiGiai: { 'main.js': `// Bài 1.2 — Ctrl+/: cả khối đã là chú thích ⇒ bỏ; còn không ⇒ thêm
function toggleComment(lines) {
  const nonEmpty = lines.filter((l) => l.trim() !== '');
  const allCommented = nonEmpty.length > 0 && nonEmpty.every((l) => l.trim().startsWith('// '));
  return lines.map((line) => {
    if (line.trim() === '') return line;                   // dòng rỗng giữ nguyên
    const [, indent, rest] = /^(\\s*)(.*)$/.exec(line);       // tách thụt lề và phần chữ
    return allCommented ? indent + rest.slice(3) : indent + '// ' + rest;
  });
}
` },
      giaiThich: `<p>VS Code quyết định cho cả vùng chọn: chỉ khi mọi dòng đều đã là chú thích thì mới bỏ. Nhờ vậy bấm hai lần luôn trả về đúng như cũ — tính chất mà một phím tắt tốt phải có.</p>`,
      loiHayGap: ['Quyết định từng dòng — khối lẫn lộn bị đảo ngược lung tung.', 'Chèn // ở đầu dòng thay vì sau thụt lề.'],
      thamKhao: 'https://code.visualstudio.com/docs/editor/codebasics',
      kiem: [
        { moTa: 'Comment a block, keep indentation|||Chú thích một khối, giữ thụt lề', goi: 'toggleComment(["  let a = 1;", "", "  a++;"])', mongDoi: ['  // let a = 1;', '', '  // a++;'] },
        { moTa: 'Uncomment when every line is commented|||Bỏ chú thích khi mọi dòng đã là chú thích', goi: 'toggleComment(["// x();", "    // y();"])', mongDoi: ['x();', '    y();'] },
        { moTa: 'Mixed block ⇒ comment all; toggling twice is identity|||Khối lẫn ⇒ chú thích hết; bấm hai lần là như cũ', goi: '(() => { const a = ["// a", "b"]; const once = toggleComment(a); return [once, toggleComment(once)]; })()', mongDoi: [['// // a', '// b'], ['// a', 'b']] },
      ],
    },
    {
      tieuDe: 'Alt+↑ / Alt+↓ — dời dòng',
      doKho: 'EASY', phut: 12,
      khaiNiem: ['hoán đổi phần tử', 'chỉ số biên'], tienQuyet: ['mảng', 'slice'], the: ['javascript', 'editor'],
      moTa: `${BAI}<p>Viết ${c('moveLines(lines, from, to, dir)')}: dời khối dòng có chỉ số từ ${c('from')} tới ${c('to')} (gồm cả hai) lên (${c('dir = -1')}) hoặc xuống (${c('dir = 1')}) một dòng. Trả ${c('{ lines, from, to }')} — mảng mới và vị trí mới của khối (con trỏ đi theo khối). Ở mép trên/dưới thì không đổi gì.</p>`,
      yeuCau: ['Khối nhiều dòng di chuyển cùng nhau.', 'Ở mép ⇒ trả nguyên (bản sao).', 'Trả cả vị trí mới.'],
      dauVao: 'lines: string[]; from, to: số; dir: -1 | 1.', dauRa: '{ lines, from, to }.',
      rangBuoc: ['Không sửa mảng vào.'],
      viDu: [{ input: 'moveLines(["a","b","c"], 1, 1, -1)', output: '{ lines: ["b","a","c"], from: 0, to: 0 }', explanation: 'Dòng "b" lên trên "a".' }],
      goiY: ['Lên: phần tử ngay trên khối (from-1) chuyển xuống dưới khối.', 'const block = lines.slice(from, to + 1);'],
      khoiDau: { 'main.js': `// Bài 1.2 — dời dòng
function moveLines(lines, from, to, dir) {
  return { lines, from, to };
}
` },
      loiGiai: { 'main.js': `// Bài 1.2 — dời dòng: khối đổi chỗ với đúng một dòng hàng xóm
function moveLines(lines, from, to, dir) {
  if ((dir < 0 && from === 0) || (dir > 0 && to === lines.length - 1)) {
    return { lines: [...lines], from, to };               // đã chạm mép
  }
  const block = lines.slice(from, to + 1);
  if (dir < 0) {
    const above = lines[from - 1];
    return { lines: [...lines.slice(0, from - 1), ...block, above, ...lines.slice(to + 1)], from: from - 1, to: to - 1 };
  }
  const below = lines[to + 1];
  return { lines: [...lines.slice(0, from), below, ...block, ...lines.slice(to + 2)], from: from + 1, to: to + 1 };
}
` },
      giaiThich: `<p>Dời một khối thực chất là đổi chỗ khối với MỘT dòng hàng xóm. Cách nghĩ này đơn giản hơn nhiều so với "xoá khối rồi chèn lại", và tự xử lý khối nhiều dòng.</p>`,
      loiHayGap: ['Quên cập nhật from/to — con trỏ ở lại chỗ cũ.', 'Không kiểm mép — undefined chen vào mảng.'],
      thamKhao: 'https://code.visualstudio.com/docs/getstarted/keybindings',
      kiem: [
        { moTa: 'Move one line up|||Dời một dòng lên', goi: 'moveLines(["a", "b", "c"], 1, 1, -1)', mongDoi: { lines: ['b', 'a', 'c'], from: 0, to: 0 } },
        { moTa: 'Move a block down|||Dời một khối xuống', goi: 'moveLines(["a", "b", "c", "d"], 0, 1, 1)', mongDoi: { lines: ['c', 'a', 'b', 'd'], from: 1, to: 2 } },
        { moTa: 'At the edge nothing changes|||Ở mép không đổi gì', goi: '[moveLines(["a", "b"], 0, 0, -1), moveLines(["a", "b"], 0, 1, 1)]', mongDoi: [{ lines: ['a', 'b'], from: 0, to: 0 }, { lines: ['a', 'b'], from: 0, to: 1 }] },
      ],
    },
    {
      tieuDe: 'Ctrl+D — chọn lần xuất hiện kế tiếp',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['tìm theo từ nguyên', 'quay vòng', 'đa con trỏ'], tienQuyet: ['indexOf', 'regex'], the: ['javascript', 'editor'],
      moTa: `${BAI}<p>Viết ${c('nextOccurrence(text, word, selections)')}: ${c('selections')} là mảng vị trí bắt đầu đã chọn (theo thứ tự đã chọn). Tìm lần xuất hiện kế tiếp của ${c('word')} dưới dạng <strong>từ nguyên</strong> (ký tự trước và sau không phải chữ, số hay ${c('_')}/${c('$')}), bắt đầu tìm SAU lần chọn cuối cùng; hết văn bản thì quay lại từ đầu. Bỏ qua vị trí đã chọn. Trả mảng ${c('selections')} mới có thêm vị trí đó; không còn gì ⇒ trả bản sao như cũ.</p>`,
      yeuCau: ['Chỉ khớp từ nguyên ("total" không khớp trong "subtotal").', 'Tìm sau lần chọn cuối, rồi quay vòng.', 'Không chọn trùng.'],
      dauVao: 'text, word: string; selections: number[].', dauRa: 'number[].',
      rangBuoc: ['Không dựng regex từ word (word có thể chứa $).'],
      viDu: [{ input: 'nextOccurrence("a total; subtotal; total", "total", [2])', output: '[2, 19]', explanation: 'Bỏ qua "subtotal".' }],
      goiY: ['Hàm isWordChar(ch) = /[A-Za-z0-9_$]/.test(ch ?? "")', 'Thu mọi vị trí từ nguyên bằng vòng indexOf, rồi chọn vị trí đầu tiên > lần chọn cuối chưa có; không có thì vị trí nhỏ nhất chưa có.'],
      khoiDau: { 'main.js': `// Bài 1.2 — Ctrl+D
function nextOccurrence(text, word, selections) {
  return [...selections, text.indexOf(word, selections.at(-1) + 1)];
}
` },
      loiGiai: { 'main.js': `// Bài 1.2 — Ctrl+D: lần xuất hiện kế tiếp (từ nguyên), quay vòng, không trùng
const isWordChar = (ch) => ch !== undefined && /[A-Za-z0-9_$]/.test(ch);

function nextOccurrence(text, word, selections) {
  const all = [];
  for (let i = text.indexOf(word); i !== -1; i = text.indexOf(word, i + 1)) {
    if (!isWordChar(text[i - 1]) && !isWordChar(text[i + word.length])) all.push(i);   // từ nguyên
  }
  const free = all.filter((p) => !selections.includes(p));
  if (free.length === 0) return [...selections];
  const last = selections.length ? selections[selections.length - 1] : -1;
  const next = free.find((p) => p > last) ?? free[0];          // sau lần chọn cuối, hoặc quay vòng
  return [...selections, next];
}
` },
      giaiThich: `<p>Ctrl+D là cách sửa nhiều chỗ cùng lúc mà vẫn kiểm từng chỗ bằng mắt — an toàn hơn thay-tất-cả. Từ nguyên là điểm mấu chốt: chọn ${c('total')} không được dính vào ${c('subtotal')}.</p>`,
      loiHayGap: ['Khớp cả trong từ khác.', 'Không quay vòng — dừng ở cuối file.'],
      thamKhao: 'https://code.visualstudio.com/docs/editor/codebasics#_multiple-selections-multicursor',
      kiem: [
        { moTa: 'Whole words only|||Chỉ từ nguyên', goi: 'nextOccurrence("a total; subtotal; total", "total", [2])', mongDoi: [2, 19] },
        { moTa: 'Wraps around to the start|||Quay vòng về đầu', goi: 'nextOccurrence("x = x + x", "x", [8])', mongDoi: [8, 0] },
        { moTa: 'Nothing left ⇒ unchanged; $ is a word character|||Hết ⇒ giữ nguyên; $ là ký tự của từ', goi: '[nextOccurrence("x = x", "x", [0, 4]), nextOccurrence("$el el", "el", [])]', mongDoi: [[0, 4], [4]] },
      ],
    },
    {
      tieuDe: 'Ctrl+P — khớp tên file',
      doKho: 'MEDIUM', phut: 20,
      khaiNiem: ['fuzzy match', 'dãy con', 'xếp hạng'], tienQuyet: ['vòng lặp', 'sort'], the: ['javascript', 'editor', 'thuật toán'],
      moTa: `${BAI}<p>Viết ${c('quickOpen(query, files)')}: một file khớp nếu các ký tự của ${c('query')} (không phân biệt hoa thường, bỏ dấu cách) xuất hiện <strong>theo thứ tự</strong> trong đường dẫn (không cần liền nhau). Điểm: duyệt tham lam từ trái sang; mỗi ký tự khớp +1; +5 nếu ký tự khớp nằm ngay sau ký tự khớp trước đó (liền nhau); +3 nếu nó là ký tự đầu của tên file (ngay sau ${c('/')} cuối) hoặc ngay sau ${c('/ - _ .')}. Trả các đường dẫn khớp, điểm cao trước; bằng điểm thì đường dẫn ngắn trước, rồi theo thứ tự chữ cái.</p>`,
      yeuCau: ['Khớp dãy con, không phân biệt hoa thường.', 'Tính điểm đúng ba quy tắc.', 'Sắp xếp ổn định theo ba khoá.'],
      dauVao: 'query: string; files: string[].', dauRa: 'string[].',
      rangBuoc: ['Duyệt tham lam (ký tự query khớp vị trí sớm nhất còn lại).'],
      viDu: [{ input: 'quickOpen("cart", ["src/cart.js", "src/components/CartItem.jsx", "README.md"])', output: '["src/cart.js", "src/components/CartItem.jsx"]', explanation: 'Cùng điểm, đường dẫn ngắn hơn đứng trước.' }],
      goiY: ['score(q, path): let pos = -1; for (const ch of q) { const i = lower.indexOf(ch, pos + 1); if (i < 0) return null; … pos = i; }', 'Ký tự trước vị trí i: path[i - 1]; i === 0 cũng tính là đầu.'],
      khoiDau: { 'main.js': `// Bài 1.2 — Ctrl+P
function quickOpen(query, files) {
  return files.filter((f) => f.includes(query));
}
` },
      loiGiai: { 'main.js': `// Bài 1.2 — Ctrl+P: khớp dãy con + điểm cho chữ liền nhau và đầu từ
function score(query, path) {
  const q = query.toLowerCase().replace(/\\s+/g, '');
  const lower = path.toLowerCase();
  let pos = -1, total = 0;
  for (const ch of q) {
    const i = lower.indexOf(ch, pos + 1);                 // tham lam: vị trí sớm nhất còn lại
    if (i < 0) return null;
    total += 1;
    if (pos >= 0 && i === pos + 1) total += 5;            // liền nhau
    if (i === 0 || '/-_.'.includes(path[i - 1])) total += 3;   // đầu tên / đầu từ
    pos = i;
  }
  return total;
}

function quickOpen(query, files) {
  return files
    .map((f) => ({ f, s: score(query, f) }))
    .filter((x) => x.s !== null)
    .sort((a, b) => b.s - a.s || a.f.length - b.f.length || (a.f < b.f ? -1 : a.f > b.f ? 1 : 0))
    .map((x) => x.f);
}
` },
      giaiThich: `<p>Đây là bản rút gọn của thuật toán sau Ctrl+P: khớp dãy con cho phép gõ tắt (${c('crt')} vẫn ra ${c('cart.js')}), còn điểm thưởng cho chữ liền nhau và đầu từ đẩy kết quả "giống điều bạn nghĩ" lên đầu.</p>`,
      loiHayGap: ['Dùng includes — gõ tắt không ra gì.', 'Quên bỏ dấu cách trong query.'],
      thamKhao: 'https://code.visualstudio.com/docs/getstarted/tips-and-tricks#_quick-open',
      kiem: [
        { moTa: 'Subsequence match, shorter path first on ties|||Khớp dãy con, bằng điểm thì đường dẫn ngắn trước', goi: 'quickOpen("cart", ["src/components/CartItem.jsx", "README.md", "src/cart.js"])', mongDoi: ['src/cart.js', 'src/components/CartItem.jsx'] },
        { moTa: 'Abbreviations work; contiguous letters rank higher|||Gõ tắt được; chữ liền nhau xếp cao hơn', goi: '[quickOpen("ca", ["chart.js", "c_a.js", "cart.js"]), quickOpen("ec", ["src/exec.js", "index.css", "eslint.config.js"])]', mongDoi: [['cart.js', 'c_a.js', 'chart.js'], ['eslint.config.js', 'index.css', 'src/exec.js']] },
        { moTa: 'Case-insensitive, spaces ignored, no match ⇒ empty|||Không phân biệt hoa thường, bỏ dấu cách, không khớp ⇒ rỗng', goi: '[quickOpen("PK J", ["package.json", "src/pk.ts"]), quickOpen("zz", ["a.js"])]', mongDoi: [['package.json'], []] },
      ],
    },
    {
      tieuDe: 'Đọc settings.json (JSON có chú thích)',
      doKho: 'MEDIUM', phut: 20,
      khaiNiem: ['JSONC', 'máy trạng thái', 'chuỗi trong nháy'], tienQuyet: ['vòng lặp ký tự', 'JSON.parse'], the: ['javascript', 'editor', 'json'],
      moTa: `${BAI}<p>${c('.vscode/settings.json')} cho phép chú thích ${c('// …')} và ${c('/* … */')} cùng dấu phẩy thừa trước ${c('}')} hoặc ${c(']')} — ${c('JSON.parse')} thường sẽ ném lỗi. Viết ${c('parseJsonc(text)')}: bỏ chú thích (nhưng KHÔNG đụng vào nội dung trong chuỗi nháy kép, kể cả ${c('"http://…"')} và nháy thoát ${c('\\"')}), bỏ dấu phẩy thừa (ngoài chuỗi), rồi ${c('JSON.parse')}.</p>`,
      yeuCau: ['Chuỗi chứa // hay /* giữ nguyên.', 'Xử lý \\" trong chuỗi.', 'Dấu phẩy thừa trước } hoặc ] (có thể có khoảng trắng xen giữa).'],
      dauVao: 'text: string.', dauRa: 'giá trị JSON.',
      rangBuoc: ['Không dùng regex xoá chú thích trên cả văn bản (sẽ phá URL trong chuỗi).'],
      viDu: [{ input: 'parseJsonc(\'{ // a\\n "x": 1, }\')', output: '{ x: 1 }', explanation: 'Đúng kiểu settings.json của bài.' }],
      goiY: ['Duyệt từng ký tự với cờ inString; trong chuỗi: gặp \\\\ thì chép cả ký tự sau, gặp " thì thoát chuỗi.', 'Ngoài chuỗi: "//" ⇒ bỏ tới hết dòng; "/*" ⇒ bỏ tới "*/"; "," ⇒ nhìn trước ký tự không phải khoảng trắng kế tiếp, là } hoặc ] thì bỏ.'],
      khoiDau: { 'main.js': `// Bài 1.2 — JSONC
function parseJsonc(text) {
  return JSON.parse(text.replace(/\\/\\/.*$/gm, ''));
}
` },
      loiGiai: { 'main.js': `// Bài 1.2 — JSONC: duyệt từng ký tự, nhớ đang ở trong chuỗi hay không
function parseJsonc(text) {
  let out = '';
  let inString = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      out += ch;
      if (ch === '\\\\') { out += text[i + 1]; i++; }   // ký tự thoát: chép nguyên cặp
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') { inString = true; out += ch; continue; }
    if (ch === '/' && text[i + 1] === '/') {              // chú thích một dòng
      while (i < text.length && text[i] !== '\\n') i++;
      out += '\\n';
      continue;
    }
    if (ch === '/' && text[i + 1] === '*') {              // chú thích khối
      const end = text.indexOf('*/', i + 2);
      i = end === -1 ? text.length : end + 1;
      continue;
    }
    if (ch === ',') {                                       // dấu phẩy thừa?
      let j = i + 1;
      while (j < text.length && /\\s/.test(text[j])) j++;
      if (text[j] === '}' || text[j] === ']') continue;
    }
    out += ch;
  }
  return JSON.parse(out);
}
` },
      giaiThich: `<p>Đây là lý do một "máy trạng thái" nhỏ tốt hơn regex: chỉ khi biết mình đang ở ngoài chuỗi thì ${c('//')} mới là chú thích. VS Code dùng thư viện ${c('jsonc-parser')} làm đúng việc này cho mọi file cấu hình của nó.</p>`,
      loiHayGap: ['Regex xoá // trên cả văn bản — URL trong chuỗi bị cắt.', 'Quên chuỗi có \\" — thoát chuỗi sai chỗ.'],
      thamKhao: 'https://code.visualstudio.com/docs/languages/json#_json-with-comments',
      kiem: [
        { moTa: 'The lesson settings file|||File settings của bài', goi: 'parseJsonc("{\\n  // Workspace settings\\n  \\"editor.formatOnSave\\": true,\\n  \\"editor.codeActionsOnSave\\": { \\"source.fixAll.eslint\\": \\"explicit\\" },\\n}\\n")', mongDoi: { 'editor.formatOnSave': true, 'editor.codeActionsOnSave': { 'source.fixAll.eslint': 'explicit' } } },
        { moTa: 'Strings with // and /* are kept|||Chuỗi chứa // và /* được giữ', goi: 'parseJsonc("{ \\"url\\": \\"http://localhost:5173\\", /* port */ \\"glob\\": \\"src/**/*.js\\" }")', mongDoi: { url: 'http://localhost:5173', glob: 'src/**/*.js' } },
        { moTa: 'Escaped quotes and trailing comma in arrays|||Nháy thoát và dấu phẩy thừa trong mảng', goi: 'parseJsonc("[\\"say \\\\\\"hi\\\\\\" // not a comment\\", 2,\\n ]")', mongDoi: ['say "hi" // not a comment', 2] },
      ],
    },
    {
      tieuDe: 'Đổi tên định danh, bỏ qua chuỗi và chú thích',
      doKho: 'HARD', phut: 25,
      khaiNiem: ['tokenizer', 'định danh', 'F2 rename'], tienQuyet: ['vòng lặp ký tự', 'regex'], the: ['javascript', 'editor'],
      moTa: `${BAI}<p>F2 thật cần hiểu phạm vi; ở đây ta làm một nửa quan trọng: ${c('renameIdentifier(code, from, to)')} đổi mọi <strong>định danh</strong> đúng bằng ${c('from')} thành ${c('to')}, NHƯNG không đụng vào: nội dung chuỗi (${c("'…'")}, ${c('"…"')}, ${c('&#96;…&#96;')} — không cần xử lý ${c('${}')}), chú thích (${c('//')} và ${c('/* */')}), phần của định danh dài hơn (${c('subtotal')}), và tên thuộc tính sau dấu chấm (${c('obj.total')}). Trả ${c('{ code, count }')} với ${c('count')} = số chỗ đã đổi.</p>`,
      yeuCau: ['Bỏ qua chuỗi, chú thích, từ dài hơn, thuộc tính sau dấu chấm.', 'Xử lý ký tự thoát trong chuỗi.', 'Đếm đúng số chỗ đổi.'],
      dauVao: 'code, from, to: string.', dauRa: '{ code, count }.',
      rangBuoc: ['Định danh: [A-Za-z_$][A-Za-z0-9_$]*.'],
      viDu: [{ input: 'renameIdentifier(\'let total = 0; // total\\nlog("total", total, subtotal, o.total);\', "total", "sum")', output: '{ code: \'let sum = 0; // total\\nlog("total", sum, subtotal, o.total);\', count: 2 }', explanation: 'Text search ra 6, đổi đúng 2.' }],
      goiY: ['Duyệt i từ 0: nếu gặp nháy ⇒ chép tới nháy đóng (bỏ qua \\\\x); nếu // hoặc /* ⇒ chép nguyên chú thích; nếu ký tự đầu định danh ⇒ đọc cả định danh.', 'Thuộc tính: ký tự không phải khoảng trắng ngay trước định danh là "." ⇒ giữ nguyên.'],
      khoiDau: { 'main.js': `// Bài 1.2 — đổi tên định danh
function renameIdentifier(code, from, to) {
  const parts = code.split(from);
  return { code: parts.join(to), count: parts.length - 1 };
}
` },
      loiGiai: { 'main.js': `// Bài 1.2 — đổi tên định danh: tokenizer tối giản, chép nguyên chuỗi và chú thích
function renameIdentifier(code, from, to) {
  let out = '', count = 0, i = 0;
  const isStart = (ch) => /[A-Za-z_$]/.test(ch);
  const isPart = (ch) => ch !== undefined && /[A-Za-z0-9_$]/.test(ch);
  while (i < code.length) {
    const ch = code[i];
    if (ch === '"' || ch === "'" || ch === '\`') {                 // chuỗi: chép tới nháy đóng
      let j = i + 1;
      while (j < code.length && code[j] !== ch) j += code[j] === '\\\\' ? 2 : 1;
      out += code.slice(i, j + 1); i = j + 1; continue;
    }
    if (ch === '/' && code[i + 1] === '/') {                       // chú thích dòng
      let j = code.indexOf('\\n', i); if (j === -1) j = code.length;
      out += code.slice(i, j); i = j; continue;
    }
    if (ch === '/' && code[i + 1] === '*') {                       // chú thích khối
      let j = code.indexOf('*/', i + 2); j = j === -1 ? code.length : j + 2;
      out += code.slice(i, j); i = j; continue;
    }
    if (isStart(ch)) {                                              // một định danh trọn vẹn
      let j = i; while (isPart(code[j])) j++;
      const word = code.slice(i, j);
      const before = out.trimEnd().slice(-1);                       // ký tự đáng kể ngay trước
      if (word === from && before !== '.') { out += to; count++; } else out += word;
      i = j; continue;
    }
    out += ch; i++;
  }
  return { code: out, count };
}
` },
      giaiThich: `<p>Ở bài học, text search ra 9 chỗ còn F2 đổi 3. Hàm này loại được chuỗi, chú thích, từ dài hơn và thuộc tính — phần còn thiếu so với F2 thật là <em>phạm vi</em>: hai biến cùng tên ở hai hàm khác nhau. Để làm được việc đó cần một trình phân tích cú pháp đầy đủ, và đó chính là dịch vụ ngôn ngữ TypeScript mà VS Code dùng.</p>`,
      loiHayGap: ['Thay theo chữ — phá chuỗi hiện cho người dùng.', 'Đọc định danh từng ký tự — "subtotal" bị đổi một phần.'],
      thamKhao: 'https://code.visualstudio.com/docs/editor/refactoring#_rename-symbol',
      kiem: [
        { moTa: 'Skips strings, comments, longer words, properties|||Bỏ qua chuỗi, chú thích, từ dài hơn, thuộc tính', goi: 'renameIdentifier("let total = 0; // total\\nlog(\\"total\\", total, subtotal, o.total);", "total", "sum")', mongDoi: { code: 'let sum = 0; // total\nlog("total", sum, subtotal, o.total);', count: 2 } },
        { moTa: 'Block comments and escaped quotes|||Chú thích khối và nháy thoát', goi: 'renameIdentifier("/* x */ x = \'it\\\\\'s x\' + x;", "x", "y")', mongDoi: { code: "/* x */ y = 'it\\'s x' + y;", count: 2 } },
        { moTa: 'Template literals and $ in names|||Template literal và $ trong tên', goi: 'renameIdentifier("const $el = q(\\"#a\\"); $el.x = \\u0060$el\\u0060; $elem;", "$el", "node")', mongDoi: { code: 'const node = q("#a"); node.x = `$el`; $elem;', count: 2 } },
      ],
    },
  ],
});
