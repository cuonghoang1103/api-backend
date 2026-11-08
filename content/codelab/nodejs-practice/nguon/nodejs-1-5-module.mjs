// Node.js 1.5 — Modules: CommonJS vs ES Modules. Luật chọn chế độ + thông báo lỗi đã chạy bằng Node 22.23.3 (n02/kiem-node/m/*).
import { modul, cs, jsBai, modBai, q, bang1, tn, pre, bi } from './_node.mjs';

const TN = [
  tn('CommonJS (CJS)', 'CommonJS', 'require() + module.exports — the original Node module system.'),
  tn('ES Modules (ESM)', 'ES Modules', 'import / export — the language standard; always strict; allows top-level await.'),
  tn('"type": "module"', '"type": "module"', 'package.json field that makes every .js file in that package ESM.'),
  tn('.mjs / .cjs', '.mjs / .cjs', 'Extensions that force ESM / CommonJS whatever package.json says.'),
  tn('named vs default export', 'export có tên vs mặc định', 'export function add … (import { add }) vs export default … (import anyName).'),
  tn('import.meta.url', 'import.meta.url', 'The URL of the current ES module file — how you rebuild __dirname.'),
];

export default modul('nodejs-1-5-module', '1.5 Modules: CommonJS vs ES Modules', [
  cs({
    ten: 'CJS or ESM? Decide the mode of each file (Node 22)',
    kho: 'EASY', phut: 7, loai: 'table',
    en: 'Node 22 decides a file\'s mode in this order: the <b>extension</b> first (.mjs / .cjs), then the <b>nearest</b> package.json <code>"type"</code>, and with no type at all it <b>reads the code</b> (import/export syntax ⇒ ESM). For each file, pick the mode Node runs it in. Every row was run on Node 22.23.3.',
    vi: 'Node 22 quyết chế độ của tệp theo thứ tự: ĐUÔI trước (.mjs / .cjs), rồi "type" của package.json GẦN NHẤT, không có type thì ĐỌC CODE (cú pháp import/export ⇒ ESM). Chọn chế độ Node chạy mỗi tệp. Mọi hàng đã chạy trên Node 22.23.3.',
    bang: [bang1('m1', ['The mode Node 22 runs each file in.', 'Chế độ Node 22 chạy từng tệp.'],
      [{ ma: 'tep', ten: 'File · nearest package.json · code|||Tệp · package.json gần nhất · code' }, { ma: 'mode', ten: 'Mode|||Chế độ', luaChon: ['ESM', 'CommonJS'] }],
      [
        { o: { tep: 'util.mjs · "type": "commonjs" · require nothing' }, a: { mode: 'ESM' } },
        { o: { tep: 'seed.cjs · "type": "module" · plain code' }, a: { mode: 'CommonJS' } },
        { o: { tep: 'server.js · "type": "module" · uses import' }, a: { mode: 'ESM' } },
        { o: { tep: 'server.js · "type": "commonjs" · uses import (crashes)' }, a: { mode: 'CommonJS' } },
        { o: { tep: 'app.js · no "type" field · uses import' }, a: { mode: 'ESM' } },
        { o: { tep: 'app.js · no "type" field · uses require only' }, a: { mode: 'CommonJS' } },
        { o: { tep: 'scripts/old.js · scripts/package.json says "commonjs", root says "module"' }, a: { mode: 'CommonJS' } },
      ],
      ['The extension wins over everything. For <code>.js</code>, the NEAREST package.json decides — a <code>scripts/package.json</code> overrides the root, which is how one repo holds both. Row 4 is still CommonJS: Node runs it as CJS and it dies with <code>SyntaxError: Cannot use import statement outside a module</code>. With no <code>"type"</code> at all, Node 22 looks at the code: import/export ⇒ ESM (with a MODULE_TYPELESS_PACKAGE_JSON warning), otherwise CommonJS.', 'Đuôi thắng tất cả. Với .js, package.json GẦN NHẤT quyết — scripts/package.json đè gốc, nhờ vậy một repo chứa được cả hai. Hàng 4 vẫn là CommonJS: Node chạy kiểu CJS và chết với SyntaxError: Cannot use import statement outside a module. Không có "type", Node 22 đọc code: import/export ⇒ ESM (kèm cảnh báo MODULE_TYPELESS_PACKAGE_JSON), còn lại CommonJS.'])],
    goiY: [
      ['Check the extension first; only a plain <code>.js</code> goes on to package.json.', 'Xem đuôi trước; chỉ .js trơn mới xét tiếp package.json.'],
      ['"Nearest" means the first package.json found walking UP from the file\'s folder.', '"Gần nhất" là package.json đầu tiên gặp khi đi NGƯỢC lên từ thư mục của tệp.'],
    ],
    loi: [
      ['Letting package.json override <code>.mjs</code>/<code>.cjs</code> — the extension always wins.', 'Để package.json đè .mjs/.cjs — đuôi luôn thắng.'],
      ['Assuming a file that uses import must be ESM: under <code>"type": "commonjs"</code> it is CJS and crashes.', 'Tưởng tệp dùng import thì phải là ESM: dưới "type": "commonjs" nó là CJS và sập.'],
      ['Reading only the root package.json in a repo that has a nested one.', 'Chỉ đọc package.json gốc trong repo có package.json lồng.'],
    ],
    tns: TN,
  }),

  cs({
    ten: 'Read the module error, name the fix',
    kho: 'EASY', phut: 7,
    en: 'Each message below is the real output of Node 22 for a small file. Choose the cause and fix the lesson gives.',
    vi: 'Mỗi thông báo dưới đây là output thật của Node 22 cho một tệp nhỏ. Chọn nguyên nhân và cách sửa mà bài học đưa ra.',
    cau: [
      q('e1', [`${pre("SyntaxError: Cannot use import statement outside a module")}`, 'Thông báo này nghĩa là gì?'],
        ['You wrote import in a file Node treats as CommonJS — add "type": "module" or rename to .mjs', 'The imported package is not installed — run npm install', 'import must be inside an async function', 'The file has a typo in the word import'],
        ['Node is running the file as CommonJS (for example <code>"type": "commonjs"</code>). Switch the package to ESM or give the file the <code>.mjs</code> extension.', 'Node đang chạy tệp kiểu CommonJS (vd "type": "commonjs"). Chuyển gói sang ESM hoặc đặt đuôi .mjs.']),
      q('e2', [`${pre("ReferenceError: require is not defined in ES module scope, you can use import instead")}`, 'Còn thông báo này?'],
        ['The mirror image: require in an ES module — use import (or rename the file to .cjs)', 'require was misspelled somewhere — check the spelling of every call', 'The module you require does not exist — run npm install to add it', 'require must be called inside a function in modern Node, not at the top'],
        ['ESM has no <code>require</code>, <code>module</code> or <code>__dirname</code>. Replace it with <code>import</code>, or make that file CommonJS with <code>.cjs</code>.', 'ESM không có require, module hay __dirname. Thay bằng import, hoặc biến tệp đó thành CommonJS bằng .cjs.']),
      q('e3', [`${pre("Error [ERR_MODULE_NOT_FOUND]: Cannot find module '…/esm/math' imported from …/esm/noext.js")}`, 'Code là: import { add } from \'./math\';'],
        ['ESM requires the file extension: import from \'./math.js\'', 'math.js is missing an export named add', 'Relative imports are not allowed in ESM', 'You need a package.json inside the math folder'],
        ['"ESM requires file extensions — CommonJS was lenient; ESM is not." The file <code>math.js</code> exists, but <code>./math</code> is a different path.', '"ESM bắt buộc đuôi tệp — CommonJS dễ dãi; ESM thì không." Tệp math.js có, nhưng ./math là một đường dẫn khác.']),
      q('e4', [`${pre("SyntaxError: await is only valid in async functions and the top level bodies of modules")}`, 'Tệp tla.cjs có một dòng const x = await Promise.resolve(\'ok\');'],
        ['Top-level await only works in ES modules — the .cjs file is CommonJS', 'Promise.resolve cannot be awaited', 'await needs parentheses around its argument', 'Node 22 does not support top-level await'],
        ['ESM allows <code>await</code> at the top of a file; CommonJS does not. Move the code into an async function, or make the file an ES module.', 'ESM cho await ở cấp cao nhất; CommonJS thì không. Đưa vào hàm async, hoặc biến tệp thành ES module.']),
      q('e5', ['A CommonJS file does <code>require(\'./config.mjs\')</code> and gets <code>ERR_REQUIRE_ASYNC_MODULE</code>. Why?', 'Một tệp CommonJS require(\'./config.mjs\') và nhận ERR_REQUIRE_ASYNC_MODULE. Vì sao?'],
        ['config.mjs (or something it imports) uses top-level await — use import() there', 'require can never load an ES module', 'The .mjs extension is not allowed in require', 'config.mjs has no default export'],
        ['Since Node 22.12, <code>require()</code> can load an ES module — measured: <code>require(\'./plain.mjs\').v</code> works — unless that module has top-level await. Then use dynamic <code>await import(\'./config.mjs\')</code>.', 'Từ Node 22.12, require() nạp được ES module — đã đo: require(\'./plain.mjs\').v chạy — trừ khi module đó có top-level await. Khi đó dùng await import(\'./config.mjs\').']),
      q('e6', ['In an ES module, which line gives you back <code>__dirname</code>?', 'Trong ES module, dòng nào lấy lại __dirname?'],
        ['const __dirname = path.dirname(fileURLToPath(import.meta.url));', 'const __dirname = process.cwd();', 'const __dirname = require.main.path;', 'const __dirname = import.meta.dirname || module.path;'],
        ['<code>import.meta.url</code> is the file\'s own <code>file://</code> URL; <code>fileURLToPath</code> turns it into a path and <code>path.dirname</code> keeps the folder. <code>process.cwd()</code> is where you started node from — a different folder in general.', 'import.meta.url là URL file:// của chính tệp; fileURLToPath đổi thành đường dẫn, path.dirname giữ thư mục. process.cwd() là thư mục bạn chạy node — nói chung khác.']),
    ],
    goiY: [
      ['First decide which mode the file is in; most of these messages are "right syntax, wrong mode".', 'Trước hết xác định tệp ở chế độ nào; phần lớn thông báo này là "cú pháp đúng, sai chế độ".'],
      ['ESM is strict and explicit: extensions, no require/module/__dirname, top-level await allowed.', 'ESM nghiêm và tường minh: có đuôi, không require/module/__dirname, cho top-level await.'],
    ],
    loi: [
      ['Running npm install for "Cannot use import statement" — nothing is missing; the mode is wrong.', 'Chạy npm install cho "Cannot use import statement" — không thiếu gì; sai chế độ.'],
      ['Using <code>process.cwd()</code> as <code>__dirname</code>: works when you start node from the project folder, breaks from anywhere else.', 'Dùng process.cwd() làm __dirname: chạy được khi đứng ở thư mục dự án, hỏng khi chạy từ chỗ khác.'],
    ],
    tns: TN,
  }),

  modBai({
    ten: 'Split the in-memory notes store into an ES module',
    kho: 'MEDIUM', phut: 12,
    tepChinh: 'main.js',
    en: `<p>Chapter 3 starts the Notes API with notes in an in-memory array. Put that store in its own ES module <code>notes/store.js</code> and use it from <code>main.js</code>:</p>
<ul><li><code>store.js</code> exports exactly three named functions: <code>addNote(title)</code> (adds <code>{ id, title }</code> with ids 1, 2, 3… and returns the note), <code>listNotes()</code> (returns a <b>copy</b> of the list) and <code>countNotes()</code>.</li>
<li>The array itself is <b>not</b> exported — other modules can only change it through <code>addNote</code>.</li>
<li><code>main.js</code> imports with the path ESM requires, adds "Buy milk" and "Call Binh", and prints <code>2 notes: Buy milk, Call Binh</code>.</li></ul>
<p>The starter fails to load: <code>import … from './notes/store'</code> has no extension. It also exports the array.</p>`,
    vi: `<p>Chương 3 bắt đầu Notes API với ghi chú trong một mảng trong RAM. Tách kho đó ra ES module notes/store.js và dùng từ main.js: store.js export đúng ba hàm có tên addNote, listNotes (trả BẢN SAO), countNotes; KHÔNG export chính mảng; main.js import đúng đường dẫn ESM đòi, thêm hai ghi chú và in "2 notes: Buy milk, Call Binh". Code khởi đầu không nạp được vì import thiếu đuôi, và còn export cả mảng.</p>`,
    yc: [
      ['<code>main.js</code> loads and prints <code>2 notes: Buy milk, Call Binh</code>.', 'main.js nạp được và in 2 notes: Buy milk, Call Binh.'],
      ['<code>notes/store.js</code> exports exactly <code>addNote</code>, <code>countNotes</code>, <code>listNotes</code>.', 'notes/store.js export đúng addNote, countNotes, listNotes.'],
      ['<code>listNotes()</code> returns a copy: pushing into it does not change <code>countNotes()</code>.', 'listNotes() trả bản sao: push vào nó không đổi countNotes().'],
    ],
    goiY: [
      ['ESM import paths are relative AND have the extension: <code>\'./notes/store.js\'</code>.', 'Đường import ESM là tương đối VÀ có đuôi: \'./notes/store.js\'.'],
      ['Keep <code>const notes = []</code> without <code>export</code>: module scope is private, like a closure.', 'Giữ const notes = [] không export: phạm vi module là riêng, như closure.'],
      ['<code>listNotes = () =&gt; notes.map((n) =&gt; ({ ...n }))</code> — a new array of new objects.', 'listNotes = () => notes.map((n) => ({ ...n })) — mảng mới gồm object mới.'],
    ],
    loi: [
      ['<code>import { addNote } from \'./notes/store\'</code> — fine in CommonJS habits, "Cannot find module" in ESM.', 'import từ \'./notes/store\' — quen tay CommonJS, "Cannot find module" ở ESM.'],
      ['<code>export const notes = []</code> — any module can now <code>notes.length = 0</code> and wipe the store.', 'export const notes = [] — module nào cũng notes.length = 0 xoá sạch kho được.'],
      ['Returning <code>notes</code> itself from <code>listNotes</code> — the same leak through the back door.', 'listNotes trả chính notes — cùng lỗ rò, qua cửa sau.'],
    ],
    gt: ['An ES module has its own scope: anything not exported is private to the file, so the array plays the role a closure variable played in lesson 1.2, and the three exported functions are the only door. ESM resolves imports before running anything and does not guess extensions, so the path must name the real file. Returning copies keeps the module the only owner of its data.',
      'ES module có phạm vi riêng: thứ gì không export là riêng của tệp, nên mảng đóng vai biến closure ở bài 1.2, và ba hàm export là cánh cửa duy nhất. ESM phân giải import trước khi chạy và không đoán đuôi, nên đường dẫn phải gọi đúng tệp thật. Trả bản sao giữ module là chủ duy nhất của dữ liệu.'],
    kn: ['ES modules', 'named exports', 'module scope'],
    tns: TN,
    viDu: [{ input: 'node main.js', output: '2 notes: Buy milk, Call Binh', explanation: 'The starter fails to resolve ./notes/store.|||Code khởi đầu không phân giải được ./notes/store.' }],
    dau: {
      'main.js': `import { addNote, listNotes } from './notes/store';

addNote('Buy milk');
addNote('Call Binh');
const titles = listNotes().map((n) => n.title).join(', ');
console.log(listNotes().length + ' notes: ' + titles);
`,
      'notes/store.js': `export const notes = [];

export function addNote(title) {
  const note = { id: notes.length + 1, title };
  notes.push(note);
  return note;
}

export function listNotes() {
  return notes;
}
`,
    },
    giai: {
      'main.js': `// ESM: relative path WITH the extension, resolved before anything runs.
import { addNote, listNotes, countNotes } from './notes/store.js';

addNote('Buy milk');
addNote('Call Binh');
const titles = listNotes().map((n) => n.title).join(', ');
console.log(countNotes() + ' notes: ' + titles);
`,
      'notes/store.js': `// Module scope is private: "notes" is NOT exported, so other files can
// only change it through addNote (like a closure variable in lesson 1.2).
const notes = [];
let nextId = 1;

export function addNote(title) {
  const note = { id: nextId++, title };
  notes.push(note);
  return { ...note };            // hand out a copy, keep ours
}

export function listNotes() {
  return notes.map((n) => ({ ...n })); // new array of new objects
}

export function countNotes() {
  return notes.length;
}
`,
    },
    kiem: [
      { moTa: bi('main.js loads (imports resolve)', 'main.js nạp được (import phân giải được)'), kiem: 'nap-duoc' },
      { moTa: bi('main.js prints "2 notes: Buy milk, Call Binh"', 'main.js in "2 notes: Buy milk, Call Binh"'), so: 'console', mongDoi: ['2 notes: Buy milk, Call Binh'] },
      { moTa: bi('store.js exports exactly addNote, countNotes, listNotes', 'store.js export đúng ba hàm'), goi: "Object.keys(__module('./notes/store.js')).sort()", mongDoi: ['addNote', 'countNotes', 'listNotes'] },
      { moTa: bi('listNotes() returns a copy', 'listNotes() trả bản sao'), an: true, goi: "(() => { const s = __module('./notes/store.js'); s.listNotes().push({ id: 99 }); s.listNotes()[0].title = 'hacked'; return [s.countNotes(), s.listNotes()[0].title]; })()", mongDoi: [2, 'Buy milk'] },
      { moTa: bi('addNote gives the next id and returns the note', 'addNote cấp id kế tiếp và trả ghi chú'), an: true, goi: "(() => { const s = __module('./notes/store.js'); const n = s.addNote('Third'); return [n, s.countNotes()]; })()", mongDoi: [{ id: 3, title: 'Third' }, 3] },
    ],
  }),

  modBai({
    ten: 'Convert a CommonJS pair to ES Modules',
    kho: 'MEDIUM', phut: 12,
    tepChinh: 'index.js',
    en: `<p>The project switched to <code>"type": "module"</code> (like this website\'s backend). These two files are still written in CommonJS, so in an ES module <code>module.exports</code> throws <code>ReferenceError: module is not defined</code>. Rewrite them as ES modules — same behaviour:</p>
<ul><li><code>slug.js</code>: a <b>named</b> export <code>slugify(title)</code> — lowercase, every run of characters that are not a–z or 0–9 becomes one <code>-</code>, no <code>-</code> at the ends.</li>
<li><code>index.js</code>: a <b>default</b> export <code>makeNote(title)</code> returning <code>{ title, slug }</code>, plus a named export <code>VERSION = '1.0'</code>. It uses <code>slugify</code> from <code>slug.js</code>.</li></ul>${pre("import makeNote, { VERSION } from './index.js';\nmakeNote('Hello, Node.js 22!');   // { title: 'Hello, Node.js 22!', slug: 'hello-node-js-22' }")}`,
    vi: `<p>Dự án đã chuyển sang "type": "module". Hai tệp vẫn viết kiểu CommonJS nên trong ES module, module.exports ném ReferenceError. Viết lại thành ES module, giữ hành vi: slug.js export CÓ TÊN slugify(title); index.js export MẶC ĐỊNH makeNote(title) trả { title, slug } và export có tên VERSION = '1.0', dùng slugify từ slug.js.</p>`,
    yc: [
      ['No <code>require</code>, <code>module.exports</code> or <code>exports.</code> left.', 'Không còn require, module.exports hay exports.'],
      ['<code>slug.js</code>: named export <code>slugify</code>.', 'slug.js: export có tên slugify.'],
      ['<code>index.js</code>: default export <code>makeNote</code>, named export <code>VERSION</code>.', 'index.js: export mặc định makeNote, export có tên VERSION.'],
    ],
    goiY: [
      ['<code>module.exports = { slugify }</code> ⇒ <code>export function slugify(…) {…}</code>. <code>const { slugify } = require(\'./slug.js\')</code> ⇒ <code>import { slugify } from \'./slug.js\'</code>.', 'module.exports = { slugify } ⇒ export function slugify… ; require ⇒ import { slugify } from \'./slug.js\'.'],
      ['One default per file: <code>export default function makeNote(title) {…}</code>; <code>export const VERSION = \'1.0\';</code>', 'Mỗi tệp một default: export default function makeNote… ; export const VERSION = \'1.0\';'],
    ],
    loi: [
      ['Mixing systems: <code>export</code> in one file, <code>require</code> in the other — "require is not defined in ES module scope".', 'Trộn hai hệ: export ở tệp này, require ở tệp kia — "require is not defined in ES module scope".'],
      ['<code>export default { makeNote, VERSION }</code> — then <code>import { VERSION }</code> fails: named imports read named exports, not properties of the default object.', 'export default { makeNote, VERSION } — khi đó import { VERSION } hỏng: import có tên đọc export có tên, không đọc thuộc tính của object default.'],
    ],
    gt: ['CommonJS builds an <code>exports</code> object at run time; ESM declares its exports statically with <code>export</code>, and Node links them before any code runs. A named export is imported by its exact name in braces; the default export is imported without braces under any name. Keeping <code>VERSION</code> as a real named export is what lets <code>import { VERSION }</code> link.',
      'CommonJS dựng object exports lúc chạy; ESM khai export TĨNH bằng export, Node liên kết trước khi chạy code. Export có tên được import đúng tên trong ngoặc nhọn; export default import không ngoặc, đặt tên gì cũng được. Giữ VERSION là export có tên thật mới cho import { VERSION } liên kết được.'],
    kn: ['ES modules', 'default export', 'CommonJS to ESM'],
    tns: TN,
    viDu: [{ input: "makeNote('Hello, Node.js 22!')", output: '{"title":"Hello, Node.js 22!","slug":"hello-node-js-22"}', explanation: 'The starter throws ReferenceError: module is not defined.|||Code khởi đầu ném ReferenceError: module is not defined.' }],
    dau: {
      'index.js': `const { slugify } = require('./slug.js');

function makeNote(title) {
  return { title, slug: slugify(title) };
}

module.exports = makeNote;
module.exports.VERSION = '1.0';
`,
      'slug.js': `function slugify(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

module.exports = { slugify };
`,
    },
    giai: {
      'index.js': `// ESM: static import (path with extension), static exports.
import { slugify } from './slug.js';

// one default export per file — imported without braces, under any name
export default function makeNote(title) {
  return { title, slug: slugify(title) };
}

// a real NAMED export, so a named import of VERSION links
export const VERSION = '1.0';
`,
      'slug.js': `// named export: importers must use this exact name in braces
export function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')  // every run of other characters -> one "-"
    .replace(/^-+|-+$/g, '');     // no "-" at the ends
}
`,
    },
    kiem: [
      { moTa: bi('index.js loads as an ES module', 'index.js nạp được như ES module'), kiem: 'nap-duoc' },
      { moTa: bi('default export makeNote works', 'export mặc định makeNote chạy'), goi: "__module('./index.js').default('Hello, Node.js 22!')", mongDoi: { title: 'Hello, Node.js 22!', slug: 'hello-node-js-22' } },
      { moTa: bi('named export VERSION is "1.0"', 'export có tên VERSION là "1.0"'), goi: "__module('./index.js').VERSION", mongDoi: '1.0' },
      { moTa: bi('slug.js has a named export slugify', 'slug.js có export có tên slugify'), an: true, goi: "[Object.keys(__module('./slug.js')), __module('./slug.js').slugify('  --Notes API: v2--  ')]", mongDoi: [['slugify'], 'notes-api-v2'] },
      { moTa: bi('no CommonJS left', 'không còn CommonJS'), kiem: 'ma-nguon', khop: '\\brequire\\s*\\(|module\\.exports|\\bexports\\.', phuDinh: true },
    ],
  }),

  jsBai({
    ten: 'detectModuleType: implement Node 22\'s decision rules',
    kho: 'HARD', phut: 20,
    en: `<p>Turn the lesson\'s table "How Node decides whether a file is CJS or ESM" into code. Write <code>detectModuleType(file, packages, code)</code> that returns <code>'esm'</code> or <code>'cjs'</code>:</p>
<ul><li><code>file</code>: a path such as <code>'notes-api/scripts/seed.js'</code> (always <code>/</code>).</li>
<li><code>packages</code>: an object mapping the path of every package.json to its parsed content, e.g. <code>{ 'notes-api/package.json': { type: 'module' } }</code>.</li>
<li><code>code</code>: the file\'s text.</li></ul>
<p>Rules, in order: (1) <code>.mjs</code> ⇒ esm, <code>.cjs</code> ⇒ cjs. (2) Otherwise find the <b>nearest</b> package.json — start in the file\'s folder and walk up one folder at a time (the root folder is <code>''</code>, its file is <code>'package.json'</code>); stop at the first one that exists. Its <code>type</code> <code>'module'</code> ⇒ esm, <code>'commonjs'</code> ⇒ cjs. (3) If that nearest package.json has no <code>type</code>, or there is none at all: the code has ESM syntax ⇒ esm, otherwise cjs. "ESM syntax" here means a line that starts (after spaces) with <code>import </code>, <code>import{</code>, <code>export </code> or <code>await </code>, or the text <code>import.meta</code> anywhere. A dynamic <code>import(</code> is NOT ESM syntax.</p>${pre("detectModuleType('api/src/a.js', { 'api/package.json': { type: 'module' } }, 'const x = 1')   // 'esm'\ndetectModuleType('api/tools/b.js', { 'api/package.json': { type: 'module' }, 'api/tools/package.json': { type: 'commonjs' } }, '')  // 'cjs'\ndetectModuleType('c.js', {}, \"import fs from 'node:fs'\")   // 'esm' (no package.json: Node reads the code)")}`,
    vi: `<p>Biến bảng "Node quyết tệp là CJS hay ESM" của bài thành code. detectModuleType(file, packages, code) trả 'esm' hoặc 'cjs'. Luật theo thứ tự: (1) .mjs ⇒ esm, .cjs ⇒ cjs. (2) Không thì tìm package.json GẦN NHẤT — bắt đầu ở thư mục của tệp, đi ngược lên từng cấp (thư mục gốc là '', tệp của nó là 'package.json'); dừng ở cái đầu tiên tồn tại; type 'module' ⇒ esm, 'commonjs' ⇒ cjs. (3) package.json gần nhất không có type, hoặc không có cái nào: code có cú pháp ESM ⇒ esm, ngược lại cjs. "Cú pháp ESM" = một dòng bắt đầu (sau khoảng trắng) bằng "import ", "import{", "export " hoặc "await ", hoặc có chữ import.meta. import( động KHÔNG tính.</p>`,
    yc: [
      ['Extension first, then the nearest package.json type, then the code.', 'Đuôi trước, rồi type của package.json gần nhất, rồi code.'],
      ['Only the NEAREST package.json counts — even if it has no type (then you go to the code, not further up).', 'Chỉ package.json GẦN NHẤT tính — kể cả khi nó không có type (khi đó xét code, không đi tiếp lên).'],
      ['Return exactly <code>\'esm\'</code> or <code>\'cjs\'</code>.', 'Trả đúng \'esm\' hoặc \'cjs\'.'],
    ],
    goiY: [
      ['Folder of a file: <code>file.split(\'/\').slice(0, -1)</code>. Walk with a loop that pops one part per step; the package.json path is <code>[...parts, \'package.json\'].join(\'/\')</code>.', 'Thư mục của tệp: file.split(\'/\').slice(0, -1). Lặp, mỗi bước bỏ một phần; đường package.json là [...parts, \'package.json\'].join(\'/\').'],
      ['Test the root too: when <code>parts</code> is empty the path is just <code>\'package.json\'</code>.', 'Kiểm cả gốc: khi parts rỗng, đường dẫn là \'package.json\'.'],
      ['ESM syntax: <code>/^\\s*(import[\\s{]|export\\s|await\\s)/m.test(code) || code.includes(\'import.meta\')</code> — note that <code>import(</code> does not match <code>import[\\s{]</code>.', 'Cú pháp ESM: /^\\s*(import[\\s{]|export\\s|await\\s)/m.test(code) || code.includes(\'import.meta\') — import( không khớp import[\\s{].'],
    ],
    loi: [
      ['Reading only the root package.json — a <code>scripts/package.json</code> with <code>"commonjs"</code> must override it.', 'Chỉ đọc package.json gốc — scripts/package.json "commonjs" phải đè nó.'],
      ['When the nearest package.json has no type, continuing to a parent that has one. Node stops at the nearest file; with no type it reads the code.', 'package.json gần nhất không có type mà vẫn đi tiếp lên cha có type. Node dừng ở tệp gần nhất; không type thì đọc code.'],
      ['Treating <code>await import(\'./x.js\')</code> inside a function, or <code>import(</code> at all, as ESM syntax — dynamic import works in CommonJS too.', 'Coi import( động là cú pháp ESM — import động chạy cả trong CommonJS.'],
    ],
    gt: ['The three steps mirror how Node resolves the format: explicit extension, then package scope, then syntax detection (unflagged in Node 22). The walk-up stops at the first package.json because that file defines the package the module belongs to — a nested package.json starts a new package even if it says nothing about <code>type</code>. Each rule was checked against real Node 22.23.3 runs (for example a file under <code>"type": "commonjs"</code> that uses import is CommonJS and crashes, and a typeless package with import runs as ESM with a MODULE_TYPELESS_PACKAGE_JSON warning).',
      'Ba bước phản ánh cách Node phân giải định dạng: đuôi tường minh, rồi phạm vi gói, rồi dò cú pháp (không cần cờ ở Node 22). Việc đi ngược lên dừng ở package.json đầu tiên vì tệp đó định nghĩa gói chứa module — package.json lồng bắt đầu một gói mới kể cả khi nó không nói gì về type. Mỗi luật đã đối chiếu với Node 22.23.3 thật.'],
    kn: ['module resolution', 'package scope', 'syntax detection'],
    tns: TN,
    viDu: [{ input: "detectModuleType('api/tools/b.js', { 'api/package.json': { type: 'module' }, 'api/tools/package.json': { type: 'commonjs' } }, '')", output: '"cjs"', explanation: 'The nearest package.json (api/tools) wins.|||package.json gần nhất (api/tools) thắng.' }],
    dau: `function detectModuleType(file, packages, code) {
  if (file.endsWith('.mjs')) return 'esm';
  const root = packages['package.json'];
  if (root && root.type === 'module') return 'esm';
  return 'cjs';
}
`,
    giai: `// Node 22 decides a file's module system in three steps.
function hasEsmSyntax(code) {
  // a line starting with import/export/await statements, or import.meta anywhere.
  // "import(" (dynamic import) does not match import[\\s{] — it is allowed in CJS too.
  return /^\\s*(import[\\s{]|export\\s|await\\s)/m.test(code) || code.includes('import.meta');
}

function detectModuleType(file, packages, code) {
  // 1. the extension wins over everything
  if (file.endsWith('.mjs')) return 'esm';
  if (file.endsWith('.cjs')) return 'cjs';

  // 2. walk up from the file's folder to the NEAREST package.json
  const parts = file.split('/').slice(0, -1);
  let nearest = null;
  for (;;) {
    const p = [...parts, 'package.json'].join('/');
    if (packages[p]) { nearest = packages[p]; break; }   // stop at the first one
    if (parts.length === 0) break;                       // root checked: none found
    parts.pop();
  }
  if (nearest && nearest.type === 'module') return 'esm';
  if (nearest && nearest.type === 'commonjs') return 'cjs';

  // 3. no "type" (or no package.json): Node 22 reads the code
  return hasEsmSyntax(code) ? 'esm' : 'cjs';
}
`,
    cases: [
      { moTa: ['type "module" ⇒ esm', 'type "module" ⇒ esm'], goi: "detectModuleType('api/src/a.js', { 'api/package.json': { type: 'module' } }, 'const x = 1')" },
      { moTa: ['nearest package.json overrides the root', 'package.json gần nhất đè gốc'], goi: "detectModuleType('api/tools/b.js', { 'api/package.json': { type: 'module' }, 'api/tools/package.json': { type: 'commonjs' } }, '')" },
      { moTa: ['extension beats package.json', 'đuôi thắng package.json'], goi: "[detectModuleType('api/x.cjs', { 'api/package.json': { type: 'module' } }, 'export const a = 1'), detectModuleType('api/y.mjs', { 'api/package.json': { type: 'commonjs' } }, '')]" },
      { moTa: ['no package.json: Node reads the code', 'không có package.json: Node đọc code'], goi: "[detectModuleType('c.js', {}, \"import fs from 'node:fs'\"), detectModuleType('d.js', {}, \"const fs = require('node:fs')\")]" },
      { an: true, goi: "[detectModuleType('a/b/c/d.js', { 'a/b/package.json': {}, 'a/package.json': { type: 'module' } }, 'module.exports = 1'), detectModuleType('a/b/c/e.js', { 'a/b/package.json': { name: 'x' }, 'a/package.json': { type: 'module' } }, '  export default 1')]" },
      { an: true, goi: "[detectModuleType('s/run.js', { 'package.json': { type: 'module' } }, ''), detectModuleType('s/run.js', { 'package.json': {} }, 'async function f() { return await import(\"./x.js\"); }'), detectModuleType('s/m.js', {}, 'console.log(import.meta.url)')]" },
      { an: true, goi: "[detectModuleType('t.js', {}, 'const x = 1;\\nawait Promise.resolve(x);'), detectModuleType('u.js', {}, 'const s = \"import x\";'), detectModuleType('v.js', {}, 'import{ a } from \"./a.js\"')]" },
    ],
  }),
]);
