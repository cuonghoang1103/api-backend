/** Bộ luyện bài 1.1 — Terminal. Lược đồ: ./_luoc-do.mjs (loại 'js'). kiem[].moTa = "EN|||VI". ´ = dấu huyền, @{ = ${
 *  Máy chấm không có shell ⇒ viết bằng JS đúng những gì shell làm: tính đường dẫn, tách đối số theo dấu cách/nháy, mở rộng *,
 *  sort | uniq -c, find -name, và một shell thu nhỏ trên hệ thống tệp trong bộ nhớ (pwd/cd/ls/mkdir/touch/rm/rmdir). */
import { c, doiDau } from './_luoc-do.mjs';

const BAI = '<p><em>Bài 1.1 — Terminal.</em> Mỗi bài là một việc shell làm cho bạn sau mỗi lần nhấn Enter — tự viết lại để hiểu vì sao output trong bài lại như vậy.</p>';

export default doiDau({
  slug: 'wf-1-1-terminal',
  ten: '1.1 Terminal',
  baiHoc: 'Nền tảng Web — Bài 1.1 The terminal',
  ngonNgu: 'javascript',
  loaiKiem: 'js',
  level: 'BEGINNER',
  moTa: 'Tính đường dẫn tuyệt đối từ cwd (., .., ~), tách một dòng lệnh thành đối số như shell (dấu cách, nháy, gạch chéo ngược), mở rộng ký tự đại diện *.js, sort | uniq -c, find -name trên một cây thư mục, và một shell thu nhỏ có pwd/cd/ls/mkdir/touch/rm — 6 bài.',
  de: [
    {
      tieuDe: 'Tính đường dẫn tuyệt đối',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['đường dẫn tuyệt đối/tương đối', '. và ..'], tienQuyet: ['split', 'mảng'], the: ['javascript', 'terminal'],
      moTa: `${BAI}<p>Viết ${c('resolvePath(cwd, input, home = "/Users/lan")')} trả đường dẫn tuyệt đối đã chuẩn hoá: ${c('input')} bắt đầu bằng ${c('/')} ⇒ tính từ gốc; bằng ${c('~')} ⇒ từ ${c('home')}; còn lại ⇒ từ ${c('cwd')}. Đoạn ${c('.')} bỏ qua, ${c('..')} lên một cấp (ở gốc thì vẫn ở gốc), dấu ${c('/')} lặp hoặc ở cuối bị bỏ. Gốc là ${c('"/"')}.</p>`,
      yeuCau: ['Ba điểm xuất phát.', 'Xử lý . và ..', 'Không có / thừa.'],
      dauVao: 'cwd: string (tuyệt đối); input: string; home?: string.', dauRa: 'string.',
      rangBuoc: ['Không dùng thư viện path.'],
      viDu: [{ input: 'resolvePath("/Users/lan/projects/shop/src", "../../notes.txt")', output: '"/Users/lan/projects/notes.txt"', explanation: 'Đúng phép thử trong bài.' }],
      goiY: ['const start = input.startsWith("/") ? [] : input.startsWith("~") ? home.split("/") : cwd.split("/");', 'for (const part of input.replace(/^~/, "").split("/")) { if (part === "..") stack.pop(); else if (part && part !== ".") stack.push(part); }'],
      khoiDau: { 'main.js': `// Bài 1.1 — đường dẫn tuyệt đối
function resolvePath(cwd, input, home = '/Users/lan') {
  return cwd + '/' + input;
}
` },
      loiGiai: { 'main.js': `// Bài 1.1 — xếp các đoạn vào ngăn xếp: tên thì đẩy vào, ".." thì lấy ra, "." và "" thì bỏ qua
function resolvePath(cwd, input, home = '/Users/lan') {
  let base;
  if (input.startsWith('/')) base = '';
  else if (input === '~' || input.startsWith('~/')) { base = home; input = input.slice(1); }
  else base = cwd;
  const stack = [];
  for (const part of (base + '/' + input).split('/')) {
    if (part === '' || part === '.') continue;
    if (part === '..') stack.pop();            // ở gốc thì pop trên mảng rỗng — vẫn ở gốc
    else stack.push(part);
  }
  return '/' + stack.join('/');
}
` },
      giaiThich: `<p>Đây là việc shell (và ${c('import')}, ${c('src="…"')}) làm với mọi đường dẫn tương đối: ghép với thư mục hiện tại rồi rút gọn. Lỗi "No such file" trong bài đến từ chỗ ghép sai cwd.</p>`,
      loiHayGap: ['Quên trường hợp ~.', '".." ở gốc làm hỏng kết quả.', 'Để lại "/" cuối.'],
      thamKhao: 'https://en.wikipedia.org/wiki/Path_(computing)',
      kiem: [
        { moTa: 'Relative paths from the lesson|||Đường dẫn tương đối trong bài', goi: '[resolvePath("/Users/lan/projects/shop/src", "../index.html"), resolvePath("/Users/lan/projects/shop/src", "../../notes.txt"), resolvePath("/Users/lan/projects/shop/src", "notes.txt")]', mongDoi: ['/Users/lan/projects/shop/index.html', '/Users/lan/projects/notes.txt', '/Users/lan/projects/shop/src/notes.txt'] },
        { moTa: 'Absolute, home and dots|||Tuyệt đối, nhà và dấu chấm', goi: '[resolvePath("/tmp", "/Users/lan/./projects//blog/"), resolvePath("/tmp", "~"), resolvePath("/tmp", "~/projects/../x")]', mongDoi: ['/Users/lan/projects/blog', '/Users/lan', '/Users/lan/x'] },
        { moTa: 'Cannot go above the root|||Không lên quá gốc', goi: '[resolvePath("/a", "../../.."), resolvePath("/", ".")]', mongDoi: ['/', '/'] },
      ],
    },
    {
      tieuDe: 'Tách dòng lệnh thành đối số',
      doKho: 'EASY', phut: 12,
      khaiNiem: ['đối số', 'dấu nháy', 'ký tự thoát'], tienQuyet: ['vòng lặp chuỗi'], the: ['javascript', 'terminal'],
      moTa: `${BAI}<p>Viết ${c('splitArgs(line)')} như shell: khoảng trắng (dấu cách, tab) ngăn đối số; trong ${c('"…"')} hoặc ${c("'…'")} khoảng trắng là chữ thường và dấu nháy bị bỏ; ${c('\\\\')} trước một ký tự (ngoài nháy) giữ ký tự đó nguyên văn. Phần dính nhau là một đối số (${c('a"b c"d')} ⇒ ${c('"ab cd"')}). Nháy không đóng ⇒ ném ${c('SyntaxError("unterminated quote")')}. ${c('""')} là một đối số rỗng.</p>`,
      yeuCau: ['Dấu cách ngăn đối số.', 'Nháy đơn và kép.', 'Gạch chéo ngược.', 'Nháy không đóng ⇒ lỗi.'],
      dauVao: 'line: string.', dauRa: 'string[].',
      rangBuoc: ['Không cần xử lý $biến hay *.'],
      viDu: [{ input: 'splitArgs("mkdir my project")', output: '["mkdir", "my", "project"]', explanation: 'Vì vậy nó tạo hai thư mục.' }],
      goiY: ['Duyệt từng ký tự với trạng thái quote (null, "\'" hoặc \'"\') và cờ "đang có đối số".', 'Đối số rỗng "" phải được giữ: dùng cờ started thay vì kiểm cur !== "".'],
      khoiDau: { 'main.js': `// Bài 1.1 — tách dòng lệnh
function splitArgs(line) {
  return line.split(' ');
}
` },
      loiGiai: { 'main.js': `// Bài 1.1 — máy trạng thái: ngoài nháy / trong nháy; "started" để giữ được đối số rỗng ""
function splitArgs(line) {
  const args = [];
  let cur = '', started = false, quote = null;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quote) {
      if (ch === quote) quote = null; else cur += ch;
    } else if (ch === '"' || ch === "'") {
      quote = ch; started = true;
    } else if (ch === '\\\\' && i + 1 < line.length) {
      cur += line[++i]; started = true;
    } else if (ch === ' ' || ch === '\\t') {
      if (started) { args.push(cur); cur = ''; started = false; }
    } else {
      cur += ch; started = true;
    }
  }
  if (quote) throw new SyntaxError('unterminated quote');
  if (started) args.push(cur);
  return args;
}
` },
      giaiThich: `<p>Chương trình (${c('mkdir')}, ${c('git')}, ${c('node')}) không bao giờ thấy dòng bạn gõ — nó nhận MẢNG đối số do shell tách sẵn (chính là ${c('process.argv')} ở Bài 1.5). ${c('mkdir my project')} nhận hai đối số, nên tạo hai thư mục.</p>`,
      loiHayGap: ['split(" ") — nhiều dấu cách sinh đối số rỗng.', 'Bỏ mất đối số "".', 'Giữ lại dấu nháy.'],
      thamKhao: 'https://www.gnu.org/software/bash/manual/html_node/Quoting.html',
      kiem: [
        { moTa: 'Spaces split, quotes join|||Dấu cách tách, nháy giữ', goi: '[splitArgs("mkdir my project"), splitArgs(\'mkdir "my project"\'), splitArgs("cd   \'my project\'  ")]', mongDoi: [['mkdir', 'my', 'project'], ['mkdir', 'my project'], ['cd', 'my project']] },
        { moTa: 'Backslash, glued parts, empty argument|||Gạch chéo ngược, phần dính, đối số rỗng', goi: '[splitArgs("cd my\\\\ project"), splitArgs(\'echo a"b c"d\'), splitArgs(\'git commit -m ""\')]', mongDoi: [['cd', 'my project'], ['echo', 'ab cd'], ['git', 'commit', '-m', '']] },
        { moTa: 'Unterminated quote|||Nháy không đóng', goi: 'splitArgs(\'echo "hello\')', mongDoi: { loi: 'SyntaxError', thongDiep: 'unterminated quote' } },
      ],
    },
    {
      tieuDe: 'Mở rộng ký tự đại diện',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['glob', 'tệp ẩn'], tienQuyet: ['regex', 'sort'], the: ['javascript', 'terminal'],
      moTa: `${BAI}<p>Viết ${c('expandGlob(pattern, names)')} như bash: ${c('*')} khớp chuỗi bất kỳ (kể cả rỗng), ${c('?')} khớp đúng một ký tự, ký tự khác khớp chính nó. Tên bắt đầu bằng ${c('.')} chỉ khớp khi mẫu cũng bắt đầu bằng ${c('.')}. Trả các tên khớp đã sắp xếp; KHÔNG khớp gì ⇒ trả ${c('[pattern]')} nguyên văn (vì thế ${c('ls *.py')} báo "No such file *.py"). Mẫu không có ${c('*')}/${c('?')} ⇒ ${c('[pattern]')}.</p>`,
      yeuCau: ['* và ?.', 'Tệp ẩn.', 'Không khớp ⇒ giữ nguyên mẫu.'],
      dauVao: 'pattern: string; names: string[].', dauRa: 'string[].',
      rangBuoc: ['Thoát các ký tự đặc biệt của regex (., +, (…) trong mẫu.'],
      viDu: [{ input: 'expandGlob("*.js", ["a.js", "b.js", "c.css", "notes.txt"])', output: '["a.js", "b.js"]', explanation: 'echo *.js trong bài.' }],
      goiY: ['const re = new RegExp("^" + pattern.replace(/[.+^@{}()|[\\]\\\\$]/g, "\\\\$&").replace(/\\*/g, ".*").replace(/\\?/g, ".") + "$");', 'names.filter((n) => re.test(n) && (!n.startsWith(".") || pattern.startsWith(".")))'],
      khoiDau: { 'main.js': `// Bài 1.1 — mở rộng *
function expandGlob(pattern, names) {
  return names.filter((n) => n.includes(pattern.replace('*', '')));
}
` },
      loiGiai: { 'main.js': `// Bài 1.1 — đổi mẫu glob thành regex có neo; tệp ẩn chỉ khớp mẫu bắt đầu bằng "."
function expandGlob(pattern, names) {
  if (!/[*?]/.test(pattern)) return [pattern];
  const body = pattern
    .replace(/[.+^$(){}|[\\]\\\\]/g, '\\\\$&')
    .replace(/\\*/g, '.*')
    .replace(/\\?/g, '.');
  const re = new RegExp('^' + body + '$');
  const hits = names.filter((n) => re.test(n) && (!n.startsWith('.') || pattern.startsWith('.'))).sort();
  return hits.length ? hits : [pattern];
}
` },
      giaiThich: `<p>Shell mở rộng mẫu TRƯỚC khi chạy lệnh: ${c('ls')} nhận ${c('a.js b.js')}, không bao giờ thấy dấu sao. Khi không khớp, bash để nguyên ${c('*.py')} và ${c('ls')} báo không có tệp tên đúng là "*.py". Đó cũng là lý do ${c('find -name "*.js"')} phải đặt mẫu trong nháy.</p>`,
      loiHayGap: ['Không neo ^…$ ("x.json" khớp "*.js").', 'Không thoát dấu chấm.', '* khớp cả .env.'],
      thamKhao: 'https://www.gnu.org/software/bash/manual/html_node/Pattern-Matching.html',
      kiem: [
        { moTa: 'The lesson\'s folder|||Thư mục trong bài', goi: '(() => { const n = ["a.js", "b.js", "c.css", "notes.txt", "x.json"]; return [expandGlob("*.js", n), expandGlob("*.css", n), expandGlob("*.py", n)]; })()', mongDoi: [['a.js', 'b.js'], ['c.css'], ['*.py']] },
        { moTa: '? and hidden files|||? và tệp ẩn', goi: '(() => { const n = [".env", ".gitignore", "a1.txt", "a12.txt", "index.html"]; return [expandGlob("a?.txt", n), expandGlob("*", n), expandGlob(".*", n)]; })()', mongDoi: [['a1.txt'], ['a1.txt', 'a12.txt', 'index.html'], ['.env', '.gitignore']] },
        { moTa: 'Special characters and plain names|||Ký tự đặc biệt và tên thường', goi: '[expandGlob("(draft)*", ["(draft) a.md", "draft b.md"]), expandGlob("index.html", ["index.html"])]', mongDoi: [['(draft) a.md'], ['index.html']] },
      ],
    },
    {
      tieuDe: 'sort | uniq -c | sort -r',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['ống', 'đếm dòng giống nhau'], tienQuyet: ['sort', 'Map'], the: ['javascript', 'terminal'],
      moTa: `${BAI}<p>Viết ba "lệnh" nhận và trả mảng dòng, rồi ${c('pipe(text, ...steps)')} nối chúng: ${c('sortLines(lines)')} sắp theo bảng mã (như ${c('sort')}, chữ hoa trước chữ thường); ${c('uniqCount(lines)')} gộp các dòng GIỐNG NHAU LIỀN NHAU thành ${c('"<số> <dòng>"')} (chỉ liền nhau — giống ${c('uniq')} thật); ${c('topN(n)')} trả một bước lấy n dòng đầu. ${c('pipe')} tách ${c('text')} theo ${c('\\\\n')} (bỏ dòng rỗng cuối), cho chảy qua các bước, nối lại bằng ${c('\\\\n')}. Thêm ${c('sortByCount(lines)')} sắp dòng dạng ${c('"<số> <chữ>"')} theo số giảm dần (bằng nhau giữ thứ tự).</p>`,
      yeuCau: ['uniq chỉ gộp dòng liền nhau.', 'pipe nối các bước.', 'Sắp theo số, không theo chuỗi.'],
      dauVao: 'text; các hàm bước.', dauRa: 'string.',
      rangBuoc: ['Mỗi bước là hàm (lines) => lines.'],
      viDu: [{ input: 'pipe("apple\\nbanana\\napple\\ncherry\\napple\\n", sortLines, uniqCount, sortByCount, topN(1))', output: '"3 apple"', explanation: 'Đúng chuỗi lệnh trong bài.' }],
      goiY: ['uniqCount: duyệt, so với dòng trước; đổi dòng thì đẩy nhóm cũ.', 'sortByCount: [...lines].sort((a, b) => parseInt(b) - parseInt(a))'],
      khoiDau: { 'main.js': `// Bài 1.1 — sort | uniq -c
function sortLines(lines) { return lines; }
function uniqCount(lines) { return lines; }
function sortByCount(lines) { return lines; }
function topN(n) { return (lines) => lines; }
function pipe(text, ...steps) { return text; }
` },
      loiGiai: { 'main.js': `// Bài 1.1 — mỗi lệnh nhỏ làm MỘT việc; ống nối output của lệnh này vào input lệnh sau
function sortLines(lines) {
  return [...lines].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));     // theo mã ký tự, như sort mặc định với LC_ALL=C
}
function uniqCount(lines) {
  const out = [];
  for (let i = 0; i < lines.length; ) {
    let j = i;
    while (j < lines.length && lines[j] === lines[i]) j++;            // chỉ những dòng LIỀN NHAU
    out.push((j - i) + ' ' + lines[i]);
    i = j;
  }
  return out;
}
function sortByCount(lines) {
  return [...lines].sort((a, b) => parseInt(b, 10) - parseInt(a, 10));
}
function topN(n) {
  return (lines) => lines.slice(0, n);
}
function pipe(text, ...steps) {
  let lines = text.split('\\n');
  if (lines.at(-1) === '') lines.pop();
  for (const step of steps) lines = step(lines);
  return lines.join('\\n');
}
` },
      giaiThich: `<p>${c('uniq')} chỉ gộp dòng LIỀN NHAU — vì thế luôn ${c('sort')} trước. Sắp kết quả ${c('"10 x"')} và ${c('"9 y"')} theo chuỗi sẽ đặt 10 sau 9; ${c('sort -rn')} (số) hay ${c('parseInt')} sửa điều đó. Triết lý Unix: công cụ nhỏ, ghép bằng ống.</p>`,
      loiHayGap: ['uniq gộp cả dòng không liền nhau.', 'Sắp "10" sau "9".', 'Đếm dòng rỗng cuối tệp.'],
      thamKhao: 'https://www.gnu.org/software/coreutils/manual/html_node/uniq-invocation.html',
      kiem: [
        { moTa: 'The fruits pipeline|||Chuỗi lệnh fruits', goi: '[pipe("apple\\nbanana\\napple\\ncherry\\napple\\n", sortLines, uniqCount), pipe("apple\\nbanana\\napple\\ncherry\\napple\\n", sortLines, uniqCount, sortByCount, topN(1))]', mongDoi: ['3 apple\n1 banana\n1 cherry', '3 apple'] },
        { moTa: 'uniq without sort only merges neighbours|||uniq không sort chỉ gộp dòng kề', goi: 'pipe("a\\na\\nb\\na\\n", uniqCount)', mongDoi: '2 a\n1 b\n1 a' },
        { moTa: 'Numbers sort as numbers; byte order|||Sắp số theo số; theo mã ký tự', goi: '[sortByCount(["9 x", "10 y", "2 z"]), sortLines(["banana", "Apple", "apple"])]', mongDoi: [['10 y', '9 x', '2 z'], ['Apple', 'apple', 'banana']] },
      ],
    },
    {
      tieuDe: 'find -name trên một cây thư mục',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['duyệt cây', 'đệ quy'], tienQuyet: ['đệ quy', 'Object.entries'], the: ['javascript', 'terminal'],
      moTa: `${BAI}<p>Cây thư mục là object lồng: thư mục là object, tệp là chuỗi (nội dung). Viết ${c('find(tree, start, opts)')} trả mảng đường dẫn (bắt đầu bằng ${c('start')}, ví dụ ${c('"projects"')}) như ${c('find')}: duyệt mọi mục, sắp tên theo thứ tự chữ ở mỗi cấp, thư mục được liệt kê TRƯỚC nội dung của nó. Lọc theo ${c('opts.type')} (${c('"f"')} tệp / ${c('"d"')} thư mục) và ${c('opts.name')} (mẫu glob chỉ có ${c('*')}, so với TÊN chứ không phải đường dẫn). Không có opts ⇒ mọi mục, kể cả chính ${c('start')}. Viết thêm ${c('grepR(tree, start, word)')} trả ${c('"<đường dẫn>:<số dòng>:<dòng>"')} cho mọi dòng chứa ${c('word')} (phân biệt hoa thường).</p>`,
      yeuCau: ['Thứ tự giống find.', 'Lọc type và name.', 'grep -rn.'],
      dauVao: 'tree: object; start: string; opts?: { type?, name? }.', dauRa: 'string[].',
      rangBuoc: ['start là một khoá cấp trên của tree.'],
      viDu: [{ input: 'find(tree, "projects", { name: "*.js" })', output: '["projects/shop/src/app.js"]', explanation: 'find projects -name "*.js" trong bài.' }],
      goiY: ['function walk(node, path, out) { out.push({ path, isDir: typeof node === "object" }); if (typeof node === "object") for (const k of Object.keys(node).sort()) walk(node[k], path + "/" + k, out); }', 'Mẫu tên: new RegExp("^" + name.replace(/[.]/g, "\\\\.").replace(/\\*/g, ".*") + "$")'],
      khoiDau: { 'main.js': `// Bài 1.1 — find và grep -rn
function find(tree, start, opts = {}) {
  return Object.keys(tree[start]);
}
function grepR(tree, start, word) {
  return [];
}
` },
      loiGiai: { 'main.js': `// Bài 1.1 — duyệt cây theo chiều sâu, tên sắp theo chữ cái, thư mục trước nội dung
function walk(node, path, out) {
  const isDir = typeof node === 'object';
  out.push({ path, isDir, node });
  if (isDir) for (const k of Object.keys(node).sort()) walk(node[k], path + '/' + k, out);
}
function find(tree, start, opts = {}) {
  const all = [];
  walk(tree[start], start, all);
  const re = opts.name ? new RegExp('^' + opts.name.replace(/[.+^$(){}|[\\]\\\\]/g, '\\\\$&').replace(/\\*/g, '.*') + '$') : null;
  return all
    .filter((e) => !opts.type || (opts.type === 'd') === e.isDir)
    .filter((e) => !re || re.test(e.path.split('/').pop()))
    .map((e) => e.path);
}
function grepR(tree, start, word) {
  const all = [];
  walk(tree[start], start, all);
  const out = [];
  for (const e of all) {
    if (e.isDir) continue;
    e.node.split('\\n').forEach((line, i) => { if (line.includes(word)) out.push(e.path + ':' + (i + 1) + ':' + line); });
  }
  return out;
}
` },
      giaiThich: `<p>${c('find')} trả lời "tệp ở đâu", ${c('grep -rn')} trả lời "chữ này ở đâu" — với đúng định dạng ${c('tệp:dòng')} mà trình soạn thảo và thông báo lỗi dùng. "Search in files" của VS Code làm cùng hai việc này.</p>`,
      loiHayGap: ['So mẫu với cả đường dẫn.', 'Không sắp tên.', 'Đánh số dòng từ 0.'],
      thamKhao: 'https://www.gnu.org/software/findutils/manual/html_mono/find.html',
      kiem: [
        { moTa: 'find by name and type|||find theo tên và loại', goi: '(() => { const t = { projects: { "notes.txt": "TODO: write the about page", shop: { "index.html": "<h1>Shop</h1>", src: { "app.js": "console.log(\'shop ready\');" } }, blog: {} } }; return [find(t, "projects", { name: "*.js" }), find(t, "projects", { type: "f" }), find(t, "projects", { type: "d" })]; })()', mongDoi: [['projects/shop/src/app.js'], ['projects/notes.txt', 'projects/shop/index.html', 'projects/shop/src/app.js'], ['projects', 'projects/blog', 'projects/shop', 'projects/shop/src']] },
        { moTa: 'Everything, in find order|||Tất cả, đúng thứ tự find', goi: 'find({ p: { b: { "z.txt": "" }, "a.txt": "" } }, "p")', mongDoi: ['p', 'p/a.txt', 'p/b', 'p/b/z.txt'] },
        { moTa: 'grep -rn is case-sensitive|||grep -rn phân biệt hoa thường', goi: '(() => { const t = { projects: { "notes.txt": "buy milk\\nTODO: shop page", shop: { "index.html": "<h1>Shop</h1>", src: { "app.js": "// shop\\nconsole.log(\'shop ready\');" } } } }; return grepR(t, "projects", "shop"); })()', mongDoi: ['projects/notes.txt:2:TODO: shop page', 'projects/shop/src/app.js:1:// shop', "projects/shop/src/app.js:2:console.log('shop ready');"] },
      ],
    },
    {
      tieuDe: 'Một shell thu nhỏ',
      doKho: 'HARD', phut: 35,
      khaiNiem: ['thư mục làm việc', 'mã thoát', 'thông báo lỗi'], tienQuyet: ['object lồng', 'switch'], the: ['javascript', 'terminal'],
      moTa: `${BAI}<p>Viết ${c('createShell(home = "/Users/lan")')} trả ${c('{ run }')}; hệ thống tệp trong bộ nhớ, ban đầu chỉ có các thư mục ${c('/Users/lan')}. ${c('run(line)')} tách đối số theo dấu cách (đơn giản) và trả ${c('{ out, code }')} (out là chuỗi, các dòng nối ${c('\\\\n')}). Lệnh: ${c('pwd')}; ${c('cd [dir]')} (không đối số ⇒ home, ${c('-')} ⇒ thư mục trước và in nó, ${c('~')}, ${c('..')}, tương đối/tuyệt đối); ${c('mkdir [-p] dir…')}; ${c('touch file…')}; ${c('ls [-a] [dir]')} (tên sắp xếp, mỗi dòng một tên; tên bắt đầu bằng ${c('.')} chỉ hiện với ${c('-a')}); ${c('rm [-r] path')}; ${c('rmdir dir')}. Lỗi (code 1), đúng chữ: ${c('"cd: X: No such file or directory"')}, ${c('"mkdir: X: File exists"')}, ${c('"mkdir: X: No such file or directory"')} (thiếu cha, không -p), ${c('"ls: X: No such file or directory"')}, ${c('"rm: X: is a directory"')} (thiếu -r), ${c('"rm: X: No such file or directory"')}, ${c('"rmdir: X: Directory not empty"')}. X là đối số như người dùng gõ. Lệnh lạ ⇒ ${c('"bash: X: command not found"')}, code 127. Thành công: code 0.</p>`,
      yeuCau: ['cwd và cd - nhớ thư mục trước.', 'Đúng thông báo và mã thoát.', 'ls ẩn tệp chấm.'],
      dauVao: 'line: string.', dauRa: '{ out, code }.',
      rangBuoc: ['Tự viết hàm tính đường dẫn (có thể chép từ bài 1).', 'Không cần nháy hay *.'],
      viDu: [{ input: 'sh.run("mkdir my project"); sh.run("ls")', output: '{ out: "my\\nproject", code: 0 }', explanation: 'Hai thư mục, như trong bài.' }],
      goiY: ['Lưu cây: const root = { Users: { lan: {} } }; thư mục = object, tệp = null hoặc "".', 'Hàm lookup(absPath) đi từng đoạn; parentOf(absPath) cho mkdir/touch/rm.'],
      khoiDau: { 'main.js': `// Bài 1.1 — một shell thu nhỏ
function createShell(home = '/Users/lan') {
  return { run: (line) => ({ out: '', code: 0 }) };
}
` },
      loiGiai: { 'main.js': `// Bài 1.1 — hệ thống tệp = object lồng (thư mục) + chuỗi (tệp); mọi đường dẫn được tính về tuyệt đối trước
function createShell(home = '/Users/lan') {
  const root = {};
  let node = root;
  for (const p of home.split('/').filter(Boolean)) node = node[p] = {};
  let cwd = home, prev = home;

  const resolve = (input) => {
    let base = cwd;
    if (input.startsWith('/')) base = '';
    else if (input === '~' || input.startsWith('~/')) { base = home; input = input.slice(1); }
    const stack = [];
    for (const part of (base + '/' + input).split('/')) {
      if (!part || part === '.') continue;
      if (part === '..') stack.pop(); else stack.push(part);
    }
    return '/' + stack.join('/');
  };
  const lookup = (abs) => {
    let n = root;
    for (const p of abs.split('/').filter(Boolean)) {
      if (typeof n !== 'object' || n === null || !(p in n)) return undefined;
      n = n[p];
    }
    return n;
  };
  const split = (abs) => { const i = abs.lastIndexOf('/'); return [abs.slice(0, i) || '/', abs.slice(i + 1)]; };
  const isDir = (n) => typeof n === 'object' && n !== null;
  const ok = (out = '') => ({ out, code: 0 });
  const fail = (out, code = 1) => ({ out, code });

  const cmds = {
    pwd: () => ok(cwd),
    cd: (args) => {
      const target = args[0] === undefined ? home : args[0] === '-' ? prev : resolve(args[0]);
      if (!isDir(lookup(target))) return fail('cd: ' + args[0] + ': No such file or directory');
      prev = cwd; cwd = target;
      return ok(args[0] === '-' ? cwd : '');
    },
    mkdir: (args) => {
      const p = args[0] === '-p';
      for (const a of p ? args.slice(1) : args) {
        const abs = resolve(a);
        if (lookup(abs) !== undefined) { if (p && isDir(lookup(abs))) continue; return fail('mkdir: ' + a + ': File exists'); }
        if (p) { let n = root; for (const s of abs.split('/').filter(Boolean)) n = n[s] ??= {}; continue; }
        const [dir, name] = split(abs);
        const parent = lookup(dir);
        if (!isDir(parent)) return fail('mkdir: ' + a + ': No such file or directory');
        parent[name] = {};
      }
      return ok();
    },
    touch: (args) => {
      for (const a of args) {
        const [dir, name] = split(resolve(a));
        const parent = lookup(dir);
        if (!isDir(parent)) return fail('touch: ' + a + ': No such file or directory');
        if (!(name in parent)) parent[name] = '';
      }
      return ok();
    },
    ls: (args) => {
      const all = args[0] === '-a';
      const target = (all ? args[1] : args[0]) ?? '.';
      const n = lookup(resolve(target));
      if (n === undefined) return fail('ls: ' + target + ': No such file or directory');
      if (!isDir(n)) return ok(target);
      const names = Object.keys(n).filter((k) => all || !k.startsWith('.')).sort();
      return ok((all ? ['.', '..', ...names] : names).join('\\n'));
    },
    rm: (args) => {
      const r = args[0] === '-r';
      const a = r ? args[1] : args[0];
      const abs = resolve(a);
      const n = lookup(abs);
      if (n === undefined) return fail('rm: ' + a + ': No such file or directory');
      if (isDir(n) && !r) return fail('rm: ' + a + ': is a directory');
      const [dir, name] = split(abs);
      delete lookup(dir)[name];
      return ok();
    },
    rmdir: (args) => {
      const abs = resolve(args[0]);
      const n = lookup(abs);
      if (!isDir(n)) return fail('rmdir: ' + args[0] + ': No such file or directory');
      if (Object.keys(n).length) return fail('rmdir: ' + args[0] + ': Directory not empty');
      const [dir, name] = split(abs);
      delete lookup(dir)[name];
      return ok();
    },
  };

  function run(line) {
    const [cmd, ...args] = line.trim().split(/\\s+/);
    if (!Object.hasOwn(cmds, cmd)) return fail('bash: ' + cmd + ': command not found', 127);
    return cmds[cmd](args);
  }
  return { run };
}
` },
      giaiThich: `<p>Gộp mọi thứ của bài: đường dẫn tính từ cwd, ${c('cd -')} nhớ thư mục trước, ${c('rmdir')} từ chối thư mục không rỗng còn ${c('rm -r')} thì không, tệp chấm bị ẩn, và mã thoát 0/1/127 mà ${c('&&')}, CI và ${c('npm test')} đọc.</p>`,
      loiHayGap: ['cd thất bại mà vẫn đổi cwd.', 'mkdir -p báo lỗi khi thư mục đã có.', 'ls -a thiếu . và ..', 'Lệnh lạ trả code 1.'],
      thamKhao: 'https://www.gnu.org/software/bash/manual/html_node/Exit-Status.html',
      kiem: [
        { moTa: 'Navigate like the lesson|||Di chuyển như trong bài', goi: '(() => { const sh = createShell(); const r = (l) => sh.run(l).out; sh.run("mkdir -p projects/shop/src projects/blog"); sh.run("cd projects/shop/src"); const a = r("pwd"); sh.run("cd ../.."); const b = r("pwd"); sh.run("cd blog"); sh.run("cd ../shop"); return [a, b, r("cd -"), r("pwd"), (sh.run("cd"), r("pwd"))]; })()', mongDoi: ['/Users/lan/projects/shop/src', '/Users/lan/projects', '/Users/lan/projects/blog', '/Users/lan/projects/blog', '/Users/lan'] },
        { moTa: 'mkdir my project, hidden files|||mkdir my project, tệp ẩn', goi: '(() => { const sh = createShell(); sh.run("mkdir my project"); sh.run("touch .env index.html"); return [sh.run("ls").out, sh.run("ls -a").out]; })()', mongDoi: ['index.html\nmy\nproject', '.\n..\n.env\nindex.html\nmy\nproject'] },
        { moTa: 'Errors and exit codes|||Lỗi và mã thoát', goi: '(() => { const sh = createShell(); sh.run("mkdir old"); sh.run("touch old/a.html"); return [sh.run("cd shop"), sh.run("mkdir old"), sh.run("mkdir x/y"), sh.run("rmdir old"), sh.run("rm old"), sh.run("rm -r old"), sh.run("ls old"), sh.run("nodee -v")]; })()', mongDoi: [{ out: 'cd: shop: No such file or directory', code: 1 }, { out: 'mkdir: old: File exists', code: 1 }, { out: 'mkdir: x/y: No such file or directory', code: 1 }, { out: 'rmdir: old: Directory not empty', code: 1 }, { out: 'rm: old: is a directory', code: 1 }, { out: '', code: 0 }, { out: 'ls: old: No such file or directory', code: 1 }, { out: 'bash: nodee: command not found', code: 127 }] },
        { moTa: 'A failed cd does not move you|||cd hỏng không đổi chỗ', goi: '(() => { const sh = createShell(); sh.run("touch file.txt"); sh.run("cd file.txt"); sh.run("cd nowhere"); return sh.run("pwd"); })()', mongDoi: { out: '/Users/lan', code: 0 } },
      ],
    },
  ],
});
