/** Bộ luyện bài 9.5 — TypeScript trong dự án thật. Lược đồ: ./_luoc-do.mjs (loại 'js'). kiem[].moTa = "EN|||VI". ´ = dấu huyền, @{ = ${
 *  Máy chấm chạy JavaScript (không có tsc, zod, process) ⇒ luyện phần "dự án": soát tsconfig, soát script npm, nạp cấu hình
 *  hỏng sớm từ object env, tìm cú pháp KHÔNG xoá được (enum, namespace, tham số thuộc tính) mà Node strip-types từ chối,
 *  và tự viết một bộ kiểm schema nhỏ kiểu zod (safeParse + issues có path + message). */
import { c, doiDau } from './_luoc-do.mjs';

const BAI = '<p><em>Bài 9.5 — TypeScript trong dự án thật.</em> Thiết lập, script, cấu hình và ranh giới dữ liệu. Mỗi bài là một công cụ nhỏ bạn có thể dùng thật trong dự án của mình.</p>';

export default doiDau({
  slug: 'wf-9-5-ts-in-practice',
  ten: '9.5 TypeScript trong dự án thật',
  baiHoc: 'Nền tảng Web — Bài 9.5 TypeScript in a real project',
  ngonNgu: 'javascript',
  loaiKiem: 'js',
  level: 'INTERMEDIATE',
  moTa: 'Soát package.json có đủ script dev/typecheck/build/start, soát tsconfig (strict, rootDir/outDir, NodeNext), nạp cấu hình từ env và hỏng sớm, tìm cú pháp TypeScript không xoá được mà Node từ chối, và tự viết bộ kiểm schema kiểu zod với safeParse + issues — 6 bài.',
  de: [
    {
      tieuDe: 'Script npm của một dự án TypeScript',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['npm scripts', 'tsc --noEmit'], tienQuyet: ['object', 'includes'], the: ['javascript', 'typescript'],
      moTa: `${BAI}<p>Viết ${c('scriptProblems(pkg)')} nhận object ${c('package.json')}, trả mảng vấn đề theo thứ tự: thiếu ${c('scripts.typecheck')} ⇒ ${c('"missing typecheck"')}; có nhưng không chứa ${c('"tsc"')} và ${c('"--noEmit"')} ⇒ ${c('"typecheck must run tsc --noEmit"')}; thiếu ${c('build')} ⇒ ${c('"missing build"')}; thiếu ${c('start')} ⇒ ${c('"missing start"')}; ${c('start')} chạy tệp ${c('.ts')} (chứa ${c('".ts"')}) ⇒ ${c('"start should run built JavaScript"')}; ${c('typescript')} nằm trong ${c('dependencies')} thay vì ${c('devDependencies')} ⇒ ${c('"typescript belongs in devDependencies"')}. Không có ${c('scripts')} thì coi như object rỗng.</p>`,
      yeuCau: ['Đúng thứ tự vấn đề.', 'Chịu được thiếu scripts/dependencies.'],
      dauVao: 'pkg: object.', dauRa: 'string[].',
      rangBuoc: ['Không cần kiểm script dev.'],
      viDu: [{ input: 'scriptProblems({ scripts: { dev: "tsx src/index.ts", typecheck: "tsc --noEmit", build: "tsc -p .", start: "node dist/index.js" }, devDependencies: { typescript: "5.9.2" } })', output: '[]', explanation: 'Đúng bộ script trong bài luyện 9.5.' }],
      goiY: ['const s = pkg.scripts ?? {};', 'Object.hasOwn(pkg.dependencies ?? {}, "typescript")'],
      khoiDau: { 'main.js': `// Bài 9.5 — soát script npm
function scriptProblems(pkg) {
  return [];
}
` },
      loiGiai: { 'main.js': `// Bài 9.5 — kiểm (tsc --noEmit), build (tsc -p .), start chạy JavaScript đã build
function scriptProblems(pkg) {
  const s = pkg.scripts ?? {};
  const problems = [];
  if (!s.typecheck) problems.push('missing typecheck');
  else if (!s.typecheck.includes('tsc') || !s.typecheck.includes('--noEmit')) problems.push('typecheck must run tsc --noEmit');
  if (!s.build) problems.push('missing build');
  if (!s.start) problems.push('missing start');
  else if (s.start.includes('.ts')) problems.push('start should run built JavaScript');
  if (Object.hasOwn(pkg.dependencies ?? {}, 'typescript')) problems.push('typescript belongs in devDependencies');
  return problems;
}
` },
      giaiThich: `<p>tsx và Vite chạy mã mà không kiểm kiểu, nên ${c('typecheck')} là script riêng — chạy trong CI và hook trước khi push. Production chạy ${c('dist/')}; TypeScript chỉ cần lúc phát triển và build nên thuộc ${c('devDependencies')}.</p>`,
      loiHayGap: ['Coi "tsc" là đủ (nó sẽ ghi tệp ra).', 'Không chịu được pkg không có scripts.'],
      thamKhao: 'https://docs.npmjs.com/cli/v10/using-npm/scripts',
      kiem: [
        { moTa: 'A complete project|||Dự án đủ script', goi: 'scriptProblems({ scripts: { dev: "tsx src/index.ts", typecheck: "tsc --noEmit", build: "tsc -p .", start: "node dist/index.js" }, devDependencies: { typescript: "5.9.2" } })', mongDoi: [] },
        { moTa: 'Running .ts in production, no typecheck|||Chạy .ts ở production, không typecheck', goi: 'scriptProblems({ scripts: { start: "tsx src/index.ts" }, dependencies: { typescript: "5.9.2" } })', mongDoi: ['missing typecheck', 'missing build', 'start should run built JavaScript', 'typescript belongs in devDependencies'] },
        { moTa: 'typecheck that emits files; no scripts at all|||typecheck ghi tệp; không có scripts', goi: '[scriptProblems({ scripts: { typecheck: "tsc", build: "tsc", start: "node dist/index.js" } }), scriptProblems({})]', mongDoi: [['typecheck must run tsc --noEmit'], ['missing typecheck', 'missing build', 'missing start']] },
      ],
    },
    {
      tieuDe: 'Soát tsconfig.json',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['strict', 'rootDir/outDir', 'NodeNext'], tienQuyet: ['object'], the: ['javascript', 'typescript'],
      moTa: `${BAI}<p>Viết ${c('tsconfigWarnings(cfg)')} với ${c('cfg')} là object tsconfig. Trả mảng cảnh báo theo thứ tự: ${c('compilerOptions.strict !== true')} ⇒ ${c('"turn on strict"')}; ${c('outDir')} trùng ${c('rootDir')} (cùng chuỗi sau khi bỏ ${c('"./"')} đầu và ${c('"/"')} cuối) ⇒ ${c('"outDir must differ from rootDir"')}; ${c('module')} là ${c('"NodeNext"')} (không phân biệt hoa thường) mà ${c('moduleResolution')} có và khác ${c('"NodeNext"')} ⇒ ${c('"moduleResolution must match module NodeNext"')}; không có ${c('include')} cũng không có ${c('files')} ⇒ ${c('"add include"')}; ${c('noImplicitAny === false')} ⇒ ${c('"noImplicitAny is turned off"')} (strict không bật lại được nó).</p>`,
      yeuCau: ['Đúng thứ tự.', 'Chuẩn hoá đường dẫn đơn giản.', 'Chịu được thiếu compilerOptions.'],
      dauVao: 'cfg: object.', dauRa: 'string[].',
      rangBuoc: ['Không đọc tệp — cfg đã là object.'],
      viDu: [{ input: 'tsconfigWarnings({ compilerOptions: { target: "ES2022", module: "NodeNext", moduleResolution: "NodeNext", strict: true, outDir: "dist", rootDir: "src" }, include: ["src"] })', output: '[]', explanation: 'tsconfig của dự án shop trong bài.' }],
      goiY: ['const o = cfg.compilerOptions ?? {};', 'const norm = (p) => String(p ?? "").replace(/^\\.\\//, "").replace(/\\/$/, "");'],
      khoiDau: { 'main.js': `// Bài 9.5 — soát tsconfig
function tsconfigWarnings(cfg) {
  return [];
}
` },
      loiGiai: { 'main.js': `// Bài 9.5 — những thiết lập làm dự án TypeScript kiểm ít hơn bạn tưởng (hoặc build đè lên nguồn)
const norm = (p) => String(p).replace(/^\\.\\//, '').replace(/\\/$/, '');

function tsconfigWarnings(cfg) {
  const o = cfg.compilerOptions ?? {};
  const out = [];
  if (o.strict !== true) out.push('turn on strict');
  if (o.outDir !== undefined && o.rootDir !== undefined && norm(o.outDir) === norm(o.rootDir)) out.push('outDir must differ from rootDir');
  if (String(o.module ?? '').toLowerCase() === 'nodenext' && o.moduleResolution !== undefined
      && String(o.moduleResolution).toLowerCase() !== 'nodenext') out.push('moduleResolution must match module NodeNext');
  if (!cfg.include && !cfg.files) out.push('add include');
  if (o.noImplicitAny === false) out.push('noImplicitAny is turned off');
  return out;
}
` },
      giaiThich: `<p>Bài đo thật: cùng một tệp, 0 lỗi khi tắt strict và 7 khi bật. ${c('"strict": true, "noImplicitAny": false')} trông như strict mà vẫn để tham số thành ${c('any')} lặng lẽ — cờ riêng thắng cờ chung.</p>`,
      loiHayGap: ['Coi strict: "true" (chuỗi) là bật.', 'So "./src" với "src" là khác.'],
      thamKhao: 'https://www.typescriptlang.org/tsconfig/',
      kiem: [
        { moTa: 'The shop project is clean|||Dự án shop sạch', goi: 'tsconfigWarnings({ compilerOptions: { target: "ES2022", module: "NodeNext", moduleResolution: "NodeNext", strict: true, outDir: "dist", rootDir: "src" }, include: ["src"] })', mongDoi: [] },
        { moTa: 'Every warning in order|||Mọi cảnh báo đúng thứ tự', goi: 'tsconfigWarnings({ compilerOptions: { module: "nodenext", moduleResolution: "node", outDir: "./src/", rootDir: "src", noImplicitAny: false } })', mongDoi: ['turn on strict', 'outDir must differ from rootDir', 'moduleResolution must match module NodeNext', 'add include', 'noImplicitAny is turned off'] },
        { moTa: 'strict as a string is not strict; files counts as include|||strict dạng chuỗi không tính; files thay include được', goi: 'tsconfigWarnings({ compilerOptions: { strict: "true" }, files: ["index.ts"] })', mongDoi: ['turn on strict'] },
      ],
    },
    {
      tieuDe: 'Nạp cấu hình và hỏng sớm',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['fail fast', 'process.env là string | undefined'], tienQuyet: ['regex', 'throw'], the: ['javascript', 'typescript'],
      moTa: `${BAI}<p>Viết ${c('loadConfig(env)')} (${c('env')} thay cho ${c('process.env')}: object chuỗi). Trả ${c('{ port, databaseUrl, logLevel }')}: ${c('PORT')} không có/rỗng ⇒ ${c('3000')}, có thì phải toàn chữ số và trong 1–65535; ${c('DATABASE_URL')} bắt buộc, phải bắt đầu bằng ${c('postgres://')} hoặc ${c('postgresql://')}; ${c('LOG_LEVEL')} mặc định ${c('"info"')}, chỉ nhận ${c('"debug" | "info" | "warn" | "error"')}. Gom MỌI lỗi, rồi nếu có lỗi ném ${c('Error("invalid config: " + lỗi nối bằng "; ")')} với lỗi dạng ${c('"PORT must be 1-65535"')}, ${c('"DATABASE_URL is required"')}, ${c('"DATABASE_URL must be a postgres URL"')}, ${c('"LOG_LEVEL must be one of debug, info, warn, error"')}.</p>`,
      yeuCau: ['Giá trị mặc định.', 'Gom mọi lỗi rồi ném một lần.', 'port là number.'],
      dauVao: 'env: { [k]: string | undefined }.', dauRa: '{ port, databaseUrl, logLevel }.',
      rangBuoc: ['Không đọc process.env thật.'],
      viDu: [{ input: 'loadConfig({ DATABASE_URL: "postgres://localhost/shop", PORT: "8080" })', output: '{ port: 8080, databaseUrl: "postgres://localhost/shop", logLevel: "info" }', explanation: 'Như lần chạy thứ hai của dự án shop.' }],
      goiY: ['const errors = []; … if (errors.length) throw new Error("invalid config: " + errors.join("; "));', '/^\\d+$/.test(raw) && Number(raw) >= 1 && Number(raw) <= 65535'],
      khoiDau: { 'main.js': `// Bài 9.5 — nạp cấu hình
function loadConfig(env) {
  return { port: env.PORT || 3000, databaseUrl: env.DATABASE_URL, logLevel: env.LOG_LEVEL };
}
` },
      loiGiai: { 'main.js': `// Bài 9.5 — biến môi trường là string | undefined; biến chúng thành Config có kiểu ở MỘT chỗ, lúc khởi động
const LEVELS = ['debug', 'info', 'warn', 'error'];

function loadConfig(env) {
  const errors = [];

  const rawPort = (env.PORT ?? '').trim();
  let port = 3000;
  if (rawPort !== '') {
    port = Number(rawPort);
    if (!/^\\d+$/.test(rawPort) || port < 1 || port > 65535) errors.push('PORT must be 1-65535');
  }

  const databaseUrl = (env.DATABASE_URL ?? '').trim();
  if (databaseUrl === '') errors.push('DATABASE_URL is required');
  else if (!/^postgres(ql)?:\\/\\//.test(databaseUrl)) errors.push('DATABASE_URL must be a postgres URL');

  const logLevel = (env.LOG_LEVEL ?? '').trim() || 'info';
  if (!LEVELS.includes(logLevel)) errors.push('LOG_LEVEL must be one of ' + LEVELS.join(', '));

  if (errors.length) throw new Error('invalid config: ' + errors.join('; '));
  return { port, databaseUrl, logLevel };
}
` },
      giaiThich: `<p>Hỏng ngay lúc khởi động, với MỌI vấn đề trong một thông báo, tốt hơn nhiều so với sập ở truy vấn đầu tiên lúc 2 giờ sáng. Sau hàm này, phần còn lại của chương trình dùng ${c('config.port')} kiểu ${c('number')} — không ai phải nghĩ tới ${c('undefined')} nữa.</p>`,
      loiHayGap: ['env.PORT || 3000 trả chuỗi "8080".', 'Ném ở lỗi đầu tiên.', 'Nhận "80abc".'],
      thamKhao: 'https://12factor.net/config',
      kiem: [
        { moTa: 'Defaults and conversion|||Mặc định và đổi kiểu', goi: '[loadConfig({ DATABASE_URL: "postgres://localhost/shop", PORT: "8080" }), loadConfig({ DATABASE_URL: "postgresql://db/app", LOG_LEVEL: "debug" })]', mongDoi: [{ port: 8080, databaseUrl: 'postgres://localhost/shop', logLevel: 'info' }, { port: 3000, databaseUrl: 'postgresql://db/app', logLevel: 'debug' }] },
        { moTa: 'Missing DATABASE_URL fails fast|||Thiếu DATABASE_URL hỏng ngay', goi: 'loadConfig({})', mongDoi: { loi: 'Error', thongDiep: '^invalid config: DATABASE_URL is required$' } },
        { moTa: 'Every problem in one message|||Mọi vấn đề trong một thông báo', goi: 'loadConfig({ PORT: "80abc", DATABASE_URL: "mysql://x", LOG_LEVEL: "verbose" })', mongDoi: { loi: 'Error', thongDiep: '^invalid config: PORT must be 1-65535; DATABASE_URL must be a postgres URL; LOG_LEVEL must be one of debug, info, warn, error$' } },
        { moTa: 'Port range|||Khoảng cổng', goi: 'loadConfig({ PORT: "70000", DATABASE_URL: "postgres://x" })', mongDoi: { loi: 'Error', thongDiep: 'PORT must be 1-65535' } },
      ],
    },
    {
      tieuDe: 'Cú pháp không xoá được',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['type stripping', 'erasable syntax'], tienQuyet: ['regex', 'split'], the: ['javascript', 'typescript'],
      moTa: `${BAI}<p>Node chạy TypeScript bằng cách XOÁ kiểu, nên từ chối cú pháp sinh ra mã JavaScript thật. Viết ${c('nonErasable(source)')} trả mảng ${c('{ line, kind }')} (dòng đánh số từ 1) cho từng dòng chứa: ${c('enum')} (dòng bắt đầu — sau khoảng trắng và tuỳ chọn ${c('export ')}/${c('const ')}/${c('declare ')} — bằng ${c('enum <Tên>')}) ⇒ ${c('kind: "enum"')}, NHƯNG ${c('declare enum')} thì bỏ qua (chỉ là kiểu); ${c('namespace <Tên>')} hoặc ${c('module <Tên> {')} ở đầu dòng (tuỳ chọn ${c('export ')}) ⇒ ${c('"namespace"')}; tham số thuộc tính trong constructor — dòng chứa ${c('constructor(')} và một trong ${c('public ')}, ${c('private ')}, ${c('protected ')}, ${c('readonly ')} bên trong ngoặc ⇒ ${c('"parameter property"')}. Bỏ qua dòng chú thích bắt đầu bằng ${c('//')}.</p>`,
      yeuCau: ['Đúng số dòng.', 'Bỏ declare enum.', 'Bỏ dòng chú thích.'],
      dauVao: 'source: string.', dauRa: '{ line, kind }[].',
      rangBuoc: ['Mỗi dòng tối đa một kết quả (ưu tiên enum, namespace, parameter property).'],
      viDu: [{ input: 'nonErasable("enum Role { User, Admin }\\nconsole.log(Role.Admin);")', output: '[{ line: 1, kind: "enum" }]', explanation: 'Đúng dòng Node báo ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX trong bài.' }],
      goiY: ['/^\\s*(export\\s+)?(const\\s+)?enum\\s+\\w+/', '/constructor\\s*\\([^)]*\\b(public|private|protected|readonly)\\s/'],
      khoiDau: { 'main.js': `// Bài 9.5 — tìm cú pháp không xoá được
function nonErasable(source) {
  return source.includes('enum') ? [{ line: 1, kind: 'enum' }] : [];
}
` },
      loiGiai: { 'main.js': `// Bài 9.5 — enum / namespace / tham số thuộc tính sinh ra mã JS ⇒ không "bóc kiểu" được
const ENUM = /^\\s*(export\\s+)?(const\\s+)?enum\\s+\\w+/;
const NAMESPACE = /^\\s*(export\\s+)?(namespace\\s+\\w+|module\\s+\\w+\\s*\\{)/;
const PARAM_PROP = /constructor\\s*\\([^)]*\\b(public|private|protected|readonly)\\s/;

function nonErasable(source) {
  const found = [];
  String(source).split('\\n').forEach((text, i) => {
    if (/^\\s*\\/\\//.test(text)) return;                          // dòng chú thích
    if (/^\\s*(export\\s+)?declare\\s/.test(text)) return;         // declare chỉ là kiểu, xoá được
    let kind = null;
    if (ENUM.test(text)) kind = 'enum';
    else if (NAMESPACE.test(text)) kind = 'namespace';
    else if (PARAM_PROP.test(text)) kind = 'parameter property';
    if (kind) found.push({ line: i + 1, kind });
  });
  return found;
}
` },
      giaiThich: `<p>${c('enum Role { User, Admin }')} biên dịch thành một object JavaScript thật — xoá đi là mất ${c('Role.Admin')}. Cả ba loại ở đây là lý do TypeScript có cờ ${c('erasableSyntaxOnly')}: bật nó lên thì tsc báo lỗi đúng những dòng mà Node sẽ từ chối. Thay enum bằng union literal + ${c('as const')}.</p>`,
      loiHayGap: ['Bắt cả từ "enum" trong chuỗi/chú thích.', 'Báo declare enum.', 'Đánh số dòng từ 0.'],
      thamKhao: 'https://nodejs.org/api/typescript.html#type-stripping',
      kiem: [
        { moTa: 'The enum from the lesson|||enum trong bài', goi: 'nonErasable("// Lesson 9.5 — enum test\\nenum Role { User, Admin }\\nconsole.log(Role.Admin);")', mongDoi: [{ line: 2, kind: 'enum' }] },
        { moTa: 'All three kinds|||Đủ ba loại', goi: 'nonErasable(["export const enum Dir { Up }", "export namespace Utils {", "  export const x = 1;", "}", "class Repo {", "  constructor(private db: Db, name: string) {}", "}"].join("\\n"))', mongDoi: [{ line: 1, kind: 'enum' }, { line: 2, kind: 'namespace' }, { line: 6, kind: 'parameter property' }] },
        { moTa: 'Erasable code passes|||Mã xoá được thì qua', goi: 'nonErasable(["declare enum Legacy { A }", "type Role = \'user\' | \'admin\';", "const ROLES = [\'user\', \'admin\'] as const;", "const label = \'enum Role\';", "class A { constructor(db: Db) { this.db = db; } }"].join("\\n"))', mongDoi: [] },
      ],
    },
    {
      tieuDe: 'Thông báo lỗi kiểu zod',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['issues', 'path'], tienQuyet: ['map', 'join'], the: ['javascript', 'typescript'],
      moTa: `${BAI}<p>zod trả lỗi dạng ${c('issues: [{ path: ["items", 0, "price"], message: "Expected number, received string" }]')}. Viết ${c('formatIssues(issues)')} trả ${c('{ body, status }')} cho một response 422 (Bài 6.3): ${c('status')} là ${c('422')}; ${c('body')} là ${c('{ errors: [...] }')} với mỗi phần tử ${c('"<đường dẫn> - <message>"')}, đường dẫn ghép kiểu JavaScript: khoá chữ nối bằng ${c('"."')}, chỉ số số viết ${c('"[0]"')} (vd ${c('"items[0].price"')}); path rỗng ⇒ ${c('"(root)"')}. Bỏ trùng (cùng chuỗi chỉ giữ lần đầu). Không có issue nào ⇒ ${c('{ body: { errors: [] }, status: 200 }')}.</p>`,
      yeuCau: ['Ghép đường dẫn đúng.', '(root) cho path rỗng.', 'Bỏ trùng giữ thứ tự.'],
      dauVao: 'issues: { path: (string | number)[], message: string }[].', dauRa: '{ body, status }.',
      rangBuoc: ['Không sắp xếp lại.'],
      viDu: [{ input: 'formatIssues([{ path: ["name"], message: "Required" }, { path: ["price"], message: "Expected number, received string" }])', output: '{ body: { errors: ["name - Required", "price - Expected number, received string"] }, status: 422 }', explanation: 'Đúng hai dòng "invalid:" của validate.ts.' }],
      goiY: ['path.reduce((s, k) => typeof k === "number" ? s + "[" + k + "]" : (s ? s + "." + k : k), "")', '[...new Set(lines)]'],
      khoiDau: { 'main.js': `// Bài 9.5 — issues của zod thành response 422
function formatIssues(issues) {
  return { body: { errors: issues }, status: 400 };
}
` },
      loiGiai: { 'main.js': `// Bài 9.5 — lỗi kiểm dữ liệu ⇒ 422 + danh sách đọc được, đường dẫn viết như trong JavaScript
function pathText(path) {
  const s = path.reduce((acc, key) => (typeof key === 'number' ? acc + '[' + key + ']' : acc ? acc + '.' + key : String(key)), '');
  return s === '' ? '(root)' : s;
}

function formatIssues(issues) {
  if (issues.length === 0) return { body: { errors: [] }, status: 200 };
  const errors = [...new Set(issues.map((i) => pathText(i.path) + ' - ' + i.message))];
  return { body: { errors }, status: 422 };
}
` },
      giaiThich: `<p>422 Unprocessable Content nói "JSON đọc được nhưng nội dung sai" — khác 400 (không đọc được). Trả MỌI lỗi một lần, có đường dẫn, để form trên trình duyệt tô đúng ô nhập.</p>`,
      loiHayGap: ['"items.0.price" thay vì "items[0].price".', 'Path bắt đầu bằng số: "[0].name".', 'Trả 400.'],
      thamKhao: 'https://zod.dev/ERROR_HANDLING',
      kiem: [
        { moTa: 'The validate.ts issues|||Các lỗi của validate.ts', goi: 'formatIssues([{ path: ["name"], message: "Required" }, { path: ["price"], message: "Expected number, received string" }])', mongDoi: { body: { errors: ['name - Required', 'price - Expected number, received string'] }, status: 422 } },
        { moTa: 'Nested paths, root and duplicates|||Đường dẫn lồng, gốc và trùng', goi: 'formatIssues([{ path: ["items", 0, "price"], message: "Too small" }, { path: [], message: "Expected object" }, { path: [2, "id"], message: "Required" }, { path: ["items", 0, "price"], message: "Too small" }])', mongDoi: { body: { errors: ['items[0].price - Too small', '(root) - Expected object', '[2].id - Required'] }, status: 422 } },
        { moTa: 'No issues|||Không có lỗi', goi: 'formatIssues([])', mongDoi: { body: { errors: [] }, status: 200 } },
      ],
    },
    {
      tieuDe: 'Một zod thu nhỏ',
      doKho: 'HARD', phut: 30,
      khaiNiem: ['schema validation', 'safeParse', 'ép kiểu có kiểm'], tienQuyet: ['đệ quy', 'closure'], the: ['javascript', 'typescript'],
      moTa: `${BAI}<p>Viết object ${c('z')} với ${c('z.string()')}, ${c('z.number()')}, ${c('z.boolean()')}, ${c('z.array(schema)')}, ${c('z.object({ ... })')}. Mỗi schema có ${c('safeParse(value)')} trả ${c('{ success: true, data }')} hoặc ${c('{ success: false, issues }')} (issue = ${c('{ path, message }')}) và các phương thức nối được (trả schema MỚI, không sửa schema cũ): ${c('.optional()')} (undefined ⇒ thành công, data undefined), ${c('.min(n)')} (chuỗi: độ dài ≥ n, message ${c('"Too short"')}; số: ≥ n, ${c('"Too small"')}), ${c('.int()')} (số nguyên, ${c('"Expected integer"')}). Message sai kiểu: ${c('"Expected <kiểu>, received <kiểu thật>"')} (kiểu thật: ${c('"null"')}, ${c('"array"')}, hoặc typeof; NaN coi là ${c('"nan"')}); thiếu (undefined) ở schema bắt buộc ⇒ ${c('"Required"')}. ${c('z.object')} kiểm mọi khoá của shape theo thứ tự (gom mọi issue, path có tên khoá), BỎ khoá thừa khỏi ${c('data')}; ${c('z.array')} kiểm từng phần tử (path có chỉ số).</p>`,
      yeuCau: ['Gom mọi issue với path.', 'object bỏ khoá thừa.', 'Phương thức trả schema mới.', 'Đúng chữ message.'],
      dauVao: 'value: unknown.', dauRa: '{ success, data } | { success, issues }.',
      rangBuoc: ['Không dùng thư viện.', 'z.object chỉ nhận object thường (không null, không mảng).'],
      viDu: [{ input: 'z.object({ id: z.number().int(), name: z.string().min(1), price: z.number().int().min(0) }).safeParse({ id: 7, title: "Ruler", price: "8000" })', output: '{ success: false, issues: [{ path: ["name"], message: "Required" }, { path: ["price"], message: "Expected number, received string" }] }', explanation: 'Cùng hai lỗi validate.ts in ra.' }],
      goiY: ['Mỗi schema là { check(value, path, issues) => data, … }; safeParse gọi check với path [] và mảng issues rỗng.', 'Phương thức nối: tạo schema mới bọc check cũ rồi thêm luật — const next = make(base, [...rules, rule]).'],
      khoiDau: { 'main.js': `// Bài 9.5 — một zod thu nhỏ
const z = {
  string: () => ({ safeParse: (v) => ({ success: true, data: v }) }),
  number: () => ({ safeParse: (v) => ({ success: true, data: v }) }),
  boolean: () => ({ safeParse: (v) => ({ success: true, data: v }) }),
  array: (s) => ({ safeParse: (v) => ({ success: true, data: v }) }),
  object: (shape) => ({ safeParse: (v) => ({ success: true, data: v }) }),
};
` },
      loiGiai: { 'main.js': `// Bài 9.5 — một schema = hàm kiểm (giá trị, path, issues) ⇒ data; phương thức nối tạo schema MỚI
const kindOf = (v) => (v === null ? 'null' : Array.isArray(v) ? 'array' : Number.isNaN(v) ? 'nan' : typeof v);

function makeSchema(check, optional = false) {
  const schema = {
    run(value, path, issues) {
      if (value === undefined) {
        if (!optional) issues.push({ path, message: 'Required' });
        return undefined;
      }
      return check(value, path, issues);
    },
    safeParse(value) {
      const issues = [];
      const data = schema.run(value, [], issues);
      return issues.length ? { success: false, issues } : { success: true, data };
    },
    optional: () => makeSchema(check, true),
    refine: (ok, message) => makeSchema((value, path, issues) => {
      const before = issues.length;
      const data = check(value, path, issues);
      if (issues.length === before && !ok(data)) issues.push({ path, message });
      return data;
    }, optional),
  };
  return schema;
}

function primitive(type) {
  const base = makeSchema((value, path, issues) => {
    if (kindOf(value) !== type) issues.push({ path, message: 'Expected ' + type + ', received ' + kindOf(value) });
    return value;
  });
  return withExtras(base, type);
}

function withExtras(schema, type) {                    // .min() / .int() trả schema mới và vẫn nối tiếp được
  return {
    ...schema,
    optional: () => withExtras(schema.optional(), type),
    min: (n) => withExtras(type === 'string'
      ? schema.refine((v) => v.length >= n, 'Too short')
      : schema.refine((v) => v >= n, 'Too small'), type),
    int: () => withExtras(schema.refine((v) => Number.isInteger(v), 'Expected integer'), type),
  };
}

const z = {
  string: () => primitive('string'),
  number: () => primitive('number'),
  boolean: () => primitive('boolean'),
  array: (item) => makeSchema((value, path, issues) => {
    if (!Array.isArray(value)) { issues.push({ path, message: 'Expected array, received ' + kindOf(value) }); return value; }
    return value.map((v, i) => item.run(v, [...path, i], issues));
  }),
  object: (shape) => makeSchema((value, path, issues) => {
    if (kindOf(value) !== 'object') { issues.push({ path, message: 'Expected object, received ' + kindOf(value) }); return value; }
    const data = {};
    for (const [key, s] of Object.entries(shape)) {
      const v = s.run(value[key], [...path, key], issues);
      if (v !== undefined) data[key] = v;              // khoá thừa không được chép sang data
    }
    return data;
  }),
};
` },
      giaiThich: `<p>Thư viện thật làm thêm một việc quan trọng mà JavaScript không thể làm: ${c('z.infer<typeof Product>')} — kiểu TypeScript được SUY RA từ schema, nên kiểu và phép kiểm không bao giờ lệch nhau. Phần lúc chạy thì đúng như ở đây: kiểm, gom issue có path, và trả về data sạch (khoá thừa như ${c('passwordHash')} bị bỏ — khác hẳn một kiểu TypeScript, thứ không bao giờ gỡ trường).</p>`,
      loiHayGap: ['Sửa schema cũ khi gọi .min().', 'Dừng ở issue đầu tiên.', 'Giữ khoá thừa trong data.', 'Kiểm min trên giá trị sai kiểu (báo hai lỗi cho một trường).'],
      thamKhao: 'https://zod.dev/basics',
      kiem: [
        { moTa: 'The validate.ts product passes|||Sản phẩm hợp lệ của validate.ts', goi: 'z.object({ id: z.number().int(), name: z.string().min(1), price: z.number().int().min(0) }).safeParse({ id: 7, name: "Ruler", price: 8000, secret: "x" })', mongDoi: { success: true, data: { id: 7, name: 'Ruler', price: 8000 } } },
        { moTa: 'The wrong shape gives the same two issues|||Hình dạng sai cho đúng hai issue', goi: 'z.object({ id: z.number().int(), name: z.string().min(1), price: z.number().int().min(0) }).safeParse({ id: 7, title: "Ruler", price: "8000" })', mongDoi: { success: false, issues: [{ path: ['name'], message: 'Required' }, { path: ['price'], message: 'Expected number, received string' }] } },
        { moTa: 'min, int and received types|||min, int và kiểu thật', goi: '[z.string().min(3).safeParse("ab"), z.number().int().safeParse(2.5), z.number().min(0).safeParse(-1), z.number().safeParse(NaN), z.boolean().safeParse(null)]', mongDoi: [{ success: false, issues: [{ path: [], message: 'Too short' }] }, { success: false, issues: [{ path: [], message: 'Expected integer' }] }, { success: false, issues: [{ path: [], message: 'Too small' }] }, { success: false, issues: [{ path: [], message: 'Expected number, received nan' }] }, { success: false, issues: [{ path: [], message: 'Expected boolean, received null' }] }] },
        { moTa: 'Arrays, nesting and optional|||Mảng, lồng nhau và optional', goi: 'z.object({ items: z.array(z.object({ price: z.number() })), note: z.string().optional() }).safeParse({ items: [{ price: 1 }, { price: "2" }, null] })', mongDoi: { success: false, issues: [{ path: ['items', 1, 'price'], message: 'Expected number, received string' }, { path: ['items', 2], message: 'Expected object, received null' }] } },
        { moTa: 'Chaining returns a new schema|||Nối phương thức tạo schema mới', goi: '(() => { const s = z.string(); const s3 = s.min(3); return [s.safeParse("a").success, s3.safeParse("a").success, s3.optional().safeParse(undefined)]; })()', mongDoi: [true, false, { success: true, data: { $js: 'undefined' } }] },
      ],
    },
  ],
});
