/** Bộ luyện bài 14.1 — Bản dựng production làm gì. Lược đồ: ./_luoc-do.mjs (loại 'js'). kiem[].moTa = "EN|||VI".
 *  Mô phỏng từng việc của một bundler bằng hàm thuần: băm tên, thu gọn CSS, thay biến môi trường, tree-shaking, thứ tự gói, viết lại HTML. */
import { c, doiDau } from './_luoc-do.mjs';

const BAI = '<p><em>Bài 14.1 — Bản dựng production thật ra làm gì.</em> Mỗi bài cài lại một việc nhỏ mà Vite làm khi bạn chạy <code>npm run build</code>.</p>';

export default doiDau({
  slug: 'wf-14-1-build',
  ten: '14.1 Bản dựng production thật ra làm gì',
  baiHoc: 'Nền tảng Web — Bài 14.1 Production build',
  ngonNgu: 'javascript',
  loaiKiem: 'js',
  level: 'INTERMEDIATE',
  moTa: 'Tên file có mã băm, thu gọn CSS, thay import.meta.env lúc dựng, tree-shaking trên đồ thị module, thứ tự đóng gói theo phụ thuộc, viết lại index.html trỏ tới file đã dựng — 6 bài.',
  de: [
    {
      tieuDe: 'Tên file có mã băm nội dung',
      doKho: 'EASY', phut: 12,
      khaiNiem: ['content hash', 'FNV-1a', 'cache busting'], tienQuyet: ['vòng lặp', 'toán tử bit'], the: ['javascript', 'build'],
      moTa: `${BAI}<p>Viết ${c('hashName(fileName, content)')} trả về tên kiểu Vite: ${c('"index.js"')} + nội dung ⇒ ${c('"index-<8 ký tự hex>.js"')}. Mã băm là FNV-1a 32 bit trên từng ${c('charCodeAt')} của ${c('content')}: bắt đầu ${c('h = 0x811c9dc5')}; với mỗi ký tự ${c('h ^= code; h = Math.imul(h, 0x01000193) >>> 0')}; cuối cùng ${c("h.toString(16).padStart(8, '0')")}.</p>`,
      yeuCau: ['Cùng nội dung ⇒ cùng tên; khác một ký tự ⇒ tên khác.', 'Giữ tên gốc và đuôi file; chèn "-<hash>" trước đuôi.', 'Hash luôn đủ 8 ký tự hex.'],
      dauVao: 'fileName: "tên.đuôi"; content: string.', dauRa: 'string.',
      rangBuoc: ['Không dùng thư viện băm.'],
      viDu: [{ input: 'hashName("index.js", "")', output: '"index-811c9dc5.js"', explanation: 'Chuỗi rỗng giữ nguyên giá trị khởi đầu.' }],
      goiY: ['Tách đuôi: const dot = fileName.lastIndexOf("."); base = fileName.slice(0, dot); ext = fileName.slice(dot);', 'Math.imul nhân 32 bit; >>> 0 giữ số không âm.'],
      khoiDau: { 'main.js': `// Bài 14.1 — tên có mã băm
function hashName(fileName, content) {
  return fileName;
}
` },
      loiGiai: { 'main.js': `// Bài 14.1 — tên có mã băm: nội dung đổi ⇒ tên đổi ⇒ trình duyệt tải bản mới
function fnv1a(text) {
  let h = 0x811c9dc5;                          // giá trị khởi đầu của FNV-1a 32 bit
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;        // nhân 32 bit, giữ số không âm
  }
  return h.toString(16).padStart(8, '0');
}

function hashName(fileName, content) {
  const dot = fileName.lastIndexOf('.');
  return fileName.slice(0, dot) + '-' + fnv1a(content) + fileName.slice(dot);
}
` },
      giaiThich: `<p>Dấu vân tay nội dung trong tên là thứ cho phép máy chủ bảo trình duyệt giữ file cả năm: sửa một ký tự là tên mới, nên không bao giờ dùng nhầm bản cũ. Vite dùng hàm băm khác (và mã hoá base64-url) nhưng nguyên lý giống hệt.</p>`,
      loiHayGap: ['Quên >>> 0 — số âm ra chuỗi có dấu trừ.', 'Không padStart — hash ngắn hơn 8 ký tự.'],
      thamKhao: 'https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function',
      kiem: [
        { moTa: 'Empty content keeps the offset basis|||Nội dung rỗng giữ giá trị khởi đầu', goi: 'hashName("index.js", "")', mongDoi: 'index-811c9dc5.js' },
        { moTa: 'Same content ⇒ same name|||Cùng nội dung ⇒ cùng tên', goi: 'hashName("app.css", "body{margin:0}") === hashName("app.css", "body{margin:0}")', mongDoi: true },
        { moTa: 'One character changes the name|||Đổi một ký tự là đổi tên', goi: 'hashName("app.css", "body{margin:0}") !== hashName("app.css", "body{margin:1}")', mongDoi: true },
        { moTa: 'Shape: name-8hex.ext|||Dạng: tên-8hex.đuôi', goi: '/^main\\.min-[0-9a-f]{8}\\.js$/.test(hashName("main.min.js", "console.log(1)"))', mongDoi: true },
      ],
    },
    {
      tieuDe: 'Thu gọn CSS',
      doKho: 'EASY', phut: 12,
      khaiNiem: ['minify', 'regex replace'], tienQuyet: ['regex'], the: ['javascript', 'build', 'css'],
      moTa: `${BAI}<p>Viết ${c('minifyCss(css)')}: bỏ mọi chú thích ${c('/* … */')} (kể cả nhiều dòng), gộp mọi chuỗi khoảng trắng thành một dấu cách, bỏ khoảng trắng quanh ${c('{ } : ; ,')}, bỏ dấu ${c(';')} ngay trước ${c('}')}, và cắt hai đầu. Kết quả chạy y hệt nhưng nhẹ hơn.</p>`,
      yeuCau: ['Không còn chú thích và xuống dòng.', 'Không khoảng trắng quanh { } : ; ,', 'Bỏ ; thừa trước }.'],
      dauVao: 'css: string.', dauRa: 'string.',
      rangBuoc: ['Không cần xử lý chuỗi trong nháy chứa ký tự đặc biệt.'],
      viDu: [{ input: 'minifyCss("h1 {\\n  color: #2563eb;\\n}")', output: '"h1{color:#2563eb}"', explanation: 'Đúng như CSS trong bundle bài 14.1.' }],
      goiY: ['Thứ tự: bỏ chú thích (/\\/\\*[\\s\\S]*?\\*\\//g) → gộp khoảng trắng (/\\s+/g) → bỏ khoảng trắng quanh ký hiệu (/\\s*([{}:;,])\\s*/g, "$1").', 'Cuối: .replace(/;}/g, "}").trim()'],
      khoiDau: { 'main.js': `// Bài 14.1 — thu gọn CSS
function minifyCss(css) {
  return css.trim();
}
` },
      loiGiai: { 'main.js': `// Bài 14.1 — thu gọn CSS: cùng ý nghĩa, ít byte hơn
function minifyCss(css) {
  return css
    .replace(/\\/\\*[\\s\\S]*?\\*\\//g, '')        // chú thích, kể cả nhiều dòng (lười: *?)
    .replace(/\\s+/g, ' ')                      // mọi khoảng trắng ⇒ một dấu cách
    .replace(/\\s*([{}:;,])\\s*/g, '$1')         // bỏ khoảng trắng quanh ký hiệu
    .replace(/;}/g, '}')                       // dấu ; cuối khối là thừa
    .trim();
}
` },
      giaiThich: `<p>Trình duyệt không cần khoảng trắng và chú thích; bỏ chúng thường giảm 20–40% dung lượng CSS trước khi nén. Regex chú thích phải "lười" (${c('*?')}) để không nuốt từ chú thích đầu tới chú thích cuối file.</p>`,
      loiHayGap: ['Regex tham lam /\\/\\*.*\\*\\// — xoá luôn code giữa hai chú thích.', 'Bỏ hết dấu cách — "margin: 0 auto" thành "0auto".'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Glossary/Minification',
      kiem: [
        { moTa: 'Lesson stylesheet|||Stylesheet của bài', goi: 'minifyCss("/* readable source CSS */\\nbody {\\n  font-family: system-ui, sans-serif;\\n  margin: 2rem;\\n}\\n\\nh1 {\\n  color: #2563eb;\\n}\\n")', mongDoi: 'body{font-family:system-ui,sans-serif;margin:2rem}h1{color:#2563eb}' },
        { moTa: 'Multi-line comments and two comments|||Chú thích nhiều dòng và hai chú thích', goi: 'minifyCss("/* a\\n b */ p { color: red; } /* c */ a { x: y }")', mongDoi: 'p{color:red}a{x:y}' },
        { moTa: 'Keeps spaces inside values|||Giữ dấu cách bên trong giá trị', goi: 'minifyCss(".box {  margin:   0   auto ; }")', mongDoi: '.box{margin:0 auto}' },
      ],
    },
    {
      tieuDe: 'Thay import.meta.env lúc dựng',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['biến lúc dựng', 'tiền tố VITE_', 'JSON.stringify'], tienQuyet: ['regex replace với hàm'], the: ['javascript', 'build', 'env'],
      moTa: `${BAI}<p>Viết ${c('replaceEnv(code, env, mode)')} mô phỏng Vite: thay mỗi ${c('import.meta.env.TÊN')} trong ${c('code')} bằng: ${c('"production"')}/${c('"development"')} cho ${c('MODE')}; ${c('true')}/${c('false')} cho ${c('DEV')} và ${c('PROD')}; ${c('JSON.stringify(giá trị)')} cho biến bắt đầu bằng ${c('VITE_')} có trong ${c('env')}; còn lại (không tiền tố, hoặc không có) ⇒ ${c('void 0')}.</p>`,
      yeuCau: ['VITE_ có trong env ⇒ chuỗi JSON.', 'Không tiền tố ⇒ void 0, KHÔNG bao giờ lộ giá trị.', 'MODE/DEV/PROD đúng theo mode.'],
      dauVao: 'code: string; env: object; mode: "production" | "development".', dauRa: 'string.',
      rangBuoc: ['Một replace với regex và hàm.'],
      viDu: [{ input: 'replaceEnv("x = import.meta.env.DATABASE_URL", { DATABASE_URL: "pg://…" }, "production")', output: '"x = void 0"', explanation: 'Không tiền tố ⇒ không bao giờ vào bundle.' }],
      goiY: ['/import\\.meta\\.env\\.([A-Z_][A-Z0-9_]*)/g', 'if (name === "DEV") return String(mode === "development"); … if (name.startsWith("VITE_") && name in env) return JSON.stringify(env[name]); return "void 0";'],
      khoiDau: { 'main.js': `// Bài 14.1 — thay biến môi trường
function replaceEnv(code, env, mode) {
  return code.replace(/import\\.meta\\.env\\.(\\w+)/g, (_, name) => JSON.stringify(env[name]));
}
` },
      loiGiai: { 'main.js': `// Bài 14.1 — thay biến môi trường như Vite: chỉ VITE_ được công khai
function replaceEnv(code, env, mode) {
  return code.replace(/import\\.meta\\.env\\.([A-Z_][A-Z0-9_]*)/g, (_, name) => {
    if (name === 'MODE') return JSON.stringify(mode);
    if (name === 'DEV') return String(mode === 'development');
    if (name === 'PROD') return String(mode === 'production');
    if (name.startsWith('VITE_') && Object.hasOwn(env, name)) return JSON.stringify(env[name]);
    return 'void 0';                                   // không tiền tố ⇒ KHÔNG lộ, kể cả khi env có giá trị
  });
}
` },
      giaiThich: `<p>Đây là lý do giá trị VITE_ bị "nướng" vào bundle (bài 14.2): build thay chữ bằng giá trị thật. Luật tiền tố là hàng rào duy nhất ngăn ${c('DATABASE_URL')} bị chép theo; ${c('JSON.stringify')} đảm bảo chuỗi có nháy và ký tự đặc biệt được thoát đúng.</p>`,
      loiHayGap: ['Trả giá trị cho mọi biến có trong env — lộ bí mật.', 'Chèn giá trị không qua JSON.stringify — code hỏng vì thiếu nháy.'],
      thamKhao: 'https://vite.dev/guide/env-and-mode.html',
      kiem: [
        { moTa: 'VITE_ value is inlined as a string|||Giá trị VITE_ được chèn thành chuỗi', goi: 'replaceEnv("api(import.meta.env.VITE_API_URL)", { VITE_API_URL: "https://api.ctshop.example" }, "production")', mongDoi: 'api("https://api.ctshop.example")' },
        { moTa: 'Unprefixed variables never leak|||Biến không tiền tố không bao giờ lộ', goi: 'replaceEnv("db = import.meta.env.DATABASE_URL; x = import.meta.env.VITE_MISSING", { DATABASE_URL: "pg://demo-password" }, "production")', mongDoi: 'db = void 0; x = void 0' },
        { moTa: 'MODE, DEV, PROD|||MODE, DEV, PROD', goi: '[replaceEnv("import.meta.env.MODE|import.meta.env.DEV|import.meta.env.PROD", {}, "production"), replaceEnv("import.meta.env.DEV", {}, "development")]', mongDoi: ['"production"|false|true', 'true'] },
        { moTa: 'Hidden: quotes are escaped|||Ẩn: dấu nháy được thoát', an: true, goi: 'replaceEnv("t = import.meta.env.VITE_TITLE", { VITE_TITLE: "CT \\"Shop\\"" }, "production")', mongDoi: 't = "CT \\"Shop\\""' },
      ],
    },
    {
      tieuDe: 'Tree-shaking trên đồ thị module',
      doKho: 'MEDIUM', phut: 18,
      khaiNiem: ['tree-shaking', 'đồ thị phụ thuộc', 'Set'], tienQuyet: ['object', 'Set', 'vòng lặp'], the: ['javascript', 'build'],
      moTa: `${BAI}<p>Mỗi module được mô tả: ${c('{ exports: [...], imports: [{ from, names: [...] }] }')}. Viết ${c('usedExports(modules, entry)')} trả về object ${c('{ tênModule: [export được dùng, sắp xếp] }')} cho mọi module với tới được từ ${c('entry')}. Một export "được dùng" nếu module nào đó (với tới được) import nó. Module không với tới được thì không xuất hiện. Đây là phần còn lại sau tree-shaking.</p>`,
      yeuCau: ['Chỉ liệt kê module với tới được từ entry (entry luôn có mặt, có thể rỗng []).', 'Export không ai import bị loại.', 'Danh sách được sắp xếp.'],
      dauVao: 'modules: object; entry: string.', dauRa: 'object tên ⇒ mảng.',
      rangBuoc: ['Không có vòng lặp import trong dữ liệu kiểm (nhưng nên chịu được).'],
      viDu: [{ input: 'main import { formatVnd } từ format', output: '{ main: [], format: ["formatVnd"] }', explanation: 'unusedReportGenerator bị loại.' }],
      goiY: ['Duyệt từ entry bằng một hàng đợi; với mỗi import, thêm names vào Set của module đích và đưa module đích vào hàng đợi nếu chưa thăm.', 'Cuối cùng chỉ giữ name có trong exports của module đó, rồi sort.'],
      khoiDau: { 'main.js': `// Bài 14.1 — tree-shaking
function usedExports(modules, entry) {
  const out = {};
  for (const [name, m] of Object.entries(modules)) out[name] = [...m.exports];
  return out;
}
` },
      loiGiai: { 'main.js': `// Bài 14.1 — tree-shaking: đi theo import từ entry, chỉ giữ export có người dùng
function usedExports(modules, entry) {
  const used = { [entry]: new Set() };
  const queue = [entry];
  const seen = new Set([entry]);
  while (queue.length) {
    const name = queue.shift();
    for (const imp of modules[name].imports) {
      used[imp.from] ??= new Set();
      for (const n of imp.names) used[imp.from].add(n);       // export này có người import
      if (!seen.has(imp.from)) { seen.add(imp.from); queue.push(imp.from); }
    }
  }
  const out = {};
  for (const [name, set] of Object.entries(used)) {
    out[name] = [...set].filter((n) => modules[name].exports.includes(n)).sort();
  }
  return out;
}
` },
      giaiThich: `<p>Tree-shaking chạy được vì ES module là tĩnh: ${c('import { a } from "./x.js"')} cho bundler biết chính xác dùng gì mà không cần chạy code. Duyệt theo chiều rộng từ entry tìm mọi module với tới được; export không ai nhắc tới là "cành chết" và bị rung rơi.</p>`,
      loiHayGap: ['Liệt kê cả module không ai import.', 'Thêm name không có trong exports (import sai tên).'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking',
      kiem: [
        { moTa: 'The lesson project|||Dự án của bài', goi: 'usedExports({ main: { exports: [], imports: [{ from: "format", names: ["formatVnd"] }] }, format: { exports: ["formatVnd", "unusedReportGenerator"], imports: [] } }, "main")', mongDoi: { main: [], format: ['formatVnd'] } },
        { moTa: 'Unreachable modules disappear|||Module không với tới được biến mất', goi: 'Object.keys(usedExports({ a: { exports: [], imports: [{ from: "b", names: ["x"] }] }, b: { exports: ["x", "y"], imports: [] }, c: { exports: ["z"], imports: [] } }, "a")).sort()', mongDoi: ['a', 'b'] },
        { moTa: 'Uses collected across importers, sorted|||Gom từ nhiều nơi import, đã sắp xếp', goi: 'usedExports({ a: { exports: [], imports: [{ from: "u", names: ["z"] }, { from: "b", names: ["run"] }] }, b: { exports: ["run"], imports: [{ from: "u", names: ["a1", "z"] }] }, u: { exports: ["a1", "m", "z"], imports: [] } }, "a")', mongDoi: { a: [], u: ['a1', 'z'], b: ['run'] } },
      ],
    },
    {
      tieuDe: 'Thứ tự đóng gói theo phụ thuộc',
      doKho: 'MEDIUM', phut: 18,
      khaiNiem: ['sắp xếp topo', 'DFS', 'phát hiện vòng'], tienQuyet: ['đệ quy', 'Set'], the: ['javascript', 'build', 'thuật toán'],
      moTa: `${BAI}<p>Trong bundle, một module phải chạy SAU các module nó import. Viết ${c('bundleOrder(graph, entry)')} với ${c('graph = { tên: [các module nó import, theo thứ tự] }')}: trả mảng tên theo thứ tự chạy (duyệt sâu, phụ thuộc trước, mỗi module một lần, entry cuối cùng). Có vòng import ⇒ ném ${c("Error('circular import: a -> b -> a')")} (đường đi của vòng).</p>`,
      yeuCau: ['Phụ thuộc đứng trước module dùng nó; entry ở cuối.', 'Mỗi module một lần; giữ thứ tự import.', 'Vòng ⇒ Error nêu đường đi.'],
      dauVao: 'graph: object; entry: string.', dauRa: 'string[].',
      rangBuoc: ['Đệ quy hoặc ngăn xếp đều được.'],
      viDu: [{ input: 'bundleOrder({ main: ["format", "cart"], cart: ["format"], format: [] }, "main")', output: '["format", "cart", "main"]', explanation: 'format chỉ xuất hiện một lần, trước những ai dùng nó.' }],
      goiY: ['DFS hậu thứ tự: visit(n) { for (d of graph[n]) visit(d); out.push(n); }', 'Giữ "đang thăm" (stack) để phát hiện vòng và "đã xong" để không lặp.'],
      khoiDau: { 'main.js': `// Bài 14.1 — thứ tự đóng gói
function bundleOrder(graph, entry) {
  return [entry, ...graph[entry]];
}
` },
      loiGiai: { 'main.js': `// Bài 14.1 — thứ tự đóng gói: DFS hậu thứ tự, phụ thuộc trước, phát hiện vòng
function bundleOrder(graph, entry) {
  const out = [];
  const done = new Set();
  const stack = [];                          // đường đi đang thăm (để báo vòng)
  function visit(name) {
    if (done.has(name)) return;
    if (stack.includes(name)) {
      throw new Error('circular import: ' + [...stack.slice(stack.indexOf(name)), name].join(' -> '));
    }
    stack.push(name);
    for (const dep of graph[name] || []) visit(dep);
    stack.pop();
    done.add(name);
    out.push(name);                          // chỉ thêm sau khi mọi phụ thuộc đã thêm
  }
  visit(entry);
  return out;
}
` },
      giaiThich: `<p>Đây là sắp xếp topo bằng DFS: một module chỉ được ghi ra sau khi mọi thứ nó cần đã được ghi. ${c('done')} đảm bảo mỗi module một lần dù được nhiều nơi import; ${c('stack')} phát hiện vòng — thứ ES module xử lý được nhưng thường là dấu hiệu thiết kế cần sửa.</p>`,
      loiHayGap: ['Thêm module trước khi thăm phụ thuộc (tiền thứ tự) — sai thứ tự chạy.', 'Không có done — module dùng chung bị lặp.'],
      thamKhao: 'https://en.wikipedia.org/wiki/Topological_sorting',
      kiem: [
        { moTa: 'Shared dependency appears once, first|||Phụ thuộc dùng chung xuất hiện một lần, trước tiên', goi: 'bundleOrder({ main: ["format", "cart"], cart: ["format"], format: [] }, "main")', mongDoi: ['format', 'cart', 'main'] },
        { moTa: 'Deep chain|||Chuỗi sâu', goi: 'bundleOrder({ a: ["b"], b: ["c"], c: ["d"], d: [] }, "a")', mongDoi: ['d', 'c', 'b', 'a'] },
        { moTa: 'Circular import throws with the path|||Import vòng ném lỗi kèm đường đi', goi: 'bundleOrder({ a: ["b"], b: ["c"], c: ["b"] }, "a")', mongDoi: { loi: 'Error', thongDiep: 'circular import: b -> c -> b' } },
        { moTa: 'Hidden: import order kept|||Ẩn: giữ thứ tự import', an: true, goi: 'bundleOrder({ m: ["z", "y"], z: [], y: [] }, "m")', mongDoi: ['z', 'y', 'm'] },
      ],
    },
    {
      tieuDe: 'Viết lại index.html trỏ tới file đã dựng',
      doKho: 'HARD', phut: 20,
      khaiNiem: ['manifest', 'viết lại HTML', 'đường dẫn tuyệt đối'], tienQuyet: ['regex replace', 'object'], the: ['javascript', 'build', 'html'],
      moTa: `${BAI}<p>Sau khi dựng, Vite có một ${c('manifest')}: ${c('{ "src/main.js": { file: "assets/index-27wt_Xcd.js", css: ["assets/index-BKlmIFzn.css"] } }')}. Viết ${c('rewriteHtml(html, manifest)')}: (1) mọi ${c('<script type="module" src="/X">')} có X trong manifest ⇒ src thành ${c('/<file>')} và thêm ${c('crossorigin')}; (2) mọi ${c('<link rel="stylesheet" href="/X">')} trỏ tới file .css nguồn ⇒ XOÁ (CSS đã gom vào bundle); (3) chèn ${c('<link rel="stylesheet" crossorigin href="/<css>">')} cho từng css của entry ngay trước ${c('</head>')}. Nguồn không có trong manifest ⇒ ném ${c("Error('not in manifest: X')")}.</p>`,
      yeuCau: ['Script entry trỏ tới file có mã băm, kèm crossorigin.', 'Link CSS nguồn bị xoá; CSS đã dựng được chèn trước </head>.', 'Nguồn lạ ⇒ Error.'],
      dauVao: 'html: string; manifest: object.', dauRa: 'string.',
      rangBuoc: ['Không dùng DOMParser (chạy được cả trên máy chủ).'],
      viDu: [{ input: '<script type="module" src="/src/main.js"></script>', output: '<script type="module" crossorigin src="/assets/index-27wt_Xcd.js"></script>', explanation: 'Đúng như dist/index.html.' }],
      goiY: ['html.replace(/<script type="module" src="\\/([^"]+)"><\\/script>/g, (_, src) => …) — tra manifest[src].', 'Gom css của các entry đã gặp vào một mảng, rồi html.replace("</head>", links + "</head>").'],
      khoiDau: { 'main.js': `// Bài 14.1 — viết lại index.html
function rewriteHtml(html, manifest) {
  return html;
}
` },
      loiGiai: { 'main.js': `// Bài 14.1 — viết lại index.html: trỏ tới file đã dựng, CSS nguồn thay bằng CSS đã gom
function rewriteHtml(html, manifest) {
  const cssFiles = [];
  let out = html.replace(/<script type="module" src="\\/([^"]+)"><\\/script>/g, (_, src) => {
    const entry = manifest[src];
    if (!entry) throw new Error('not in manifest: ' + src);
    cssFiles.push(...(entry.css || []));                       // CSS mà entry này import
    return '<script type="module" crossorigin src="/' + entry.file + '"></script>';
  });
  // link tới file .css NGUỒN không còn cần: nội dung đã nằm trong CSS đã dựng
  out = out.replace(/\\s*<link rel="stylesheet" href="\\/[^"]+\\.css">/g, '');
  const links = cssFiles.map((f) => '<link rel="stylesheet" crossorigin href="/' + f + '">').join('');
  return out.replace('</head>', links + '</head>');
}
` },
      giaiThich: `<p>HTML là điểm vào duy nhất không có mã băm trong tên — nên nó phải được viết lại ở MỖI lần dựng để trỏ tới tên mới. Đây cũng là lý do HTML không được lưu đệm lâu (bài 14.3): HTML cũ trỏ tới asset cũ.</p>`,
      loiHayGap: ['Giữ link CSS nguồn — 404 trên máy chủ vì /src không được phục vụ.', 'Chèn CSS sau </head> — vẽ trang trước khi có CSS, nhấp nháy.'],
      thamKhao: 'https://vite.dev/guide/backend-integration.html',
      kiem: [
        { moTa: 'Rewrites the lesson page|||Viết lại trang của bài', chuanBi: 'const m = { "src/main.js": { file: "assets/index-27wt_Xcd.js", css: ["assets/index-BKlmIFzn.css"] } }; const h = "<head><title>CT Shop</title>\\n<link rel=\\"stylesheet\\" href=\\"/src/style.css\\"></head><body><script type=\\"module\\" src=\\"/src/main.js\\"></script></body>";', goi: 'rewriteHtml(h, m)', mongDoi: '<head><title>CT Shop</title><link rel="stylesheet" crossorigin href="/assets/index-BKlmIFzn.css"></head><body><script type="module" crossorigin src="/assets/index-27wt_Xcd.js"></script></body>' },
        { moTa: 'Unknown source throws|||Nguồn lạ ném lỗi', goi: 'rewriteHtml("<script type=\\"module\\" src=\\"/src/other.js\\"></script>", {})', mongDoi: { loi: 'Error', thongDiep: 'not in manifest: src/other.js' } },
        { moTa: 'Entry without CSS adds no link|||Entry không có CSS thì không thêm link', goi: 'rewriteHtml("<head></head><script type=\\"module\\" src=\\"/a.js\\"></script>", { "a.js": { file: "assets/a-1.js" } })', mongDoi: '<head></head><script type="module" crossorigin src="/assets/a-1.js"></script>' },
      ],
    },
  ],
});
