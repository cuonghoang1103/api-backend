// Node.js 0.4 — The project we build together (Notes API). Đề nhẹ: tầng nào chứa code nào, Git + .env, ĐỌC package.json, và một
// hàm mô phỏng .gitignore (tập con) để thấy .env bị loại còn .env.example được commit. "npm dev" ⇒ Unknown command: "dev" (npm 10, đã chạy).
import { modul, cs, jsBai, q, bang1, tn, pre } from './_node.mjs';

const TN = [
  tn('Notes API', 'Notes API', 'The single project built across all 18 chapters.'),
  tn('routes / services', 'routes / services', 'Routes stay thin (HTTP in, HTTP out); services hold the business rules and stay testable.'),
  tn('.gitignore', '.gitignore', 'Lists files Git must not track, such as node_modules/ and .env.'),
  tn('.env / .env.example', '.env / .env.example', 'Secrets (never committed) / the same keys without values (committed).'),
  tn('npm scripts', 'script npm', 'Named commands in package.json: npm run dev, npm start, npm test.'),
];

const PKG = `{
  "name": "notes-api",
  "type": "module",
  "engines": { "node": "22.x" },
  "scripts": {
    "dev": "node --watch src/index.js",
    "start": "node src/index.js",
    "test": "node --test"
  },
  "dependencies": { "express": "^5.1.0" },
  "devDependencies": { "eslint": "^9.20.0" }
}`;

export default modul('nodejs-0-4-du-an', '0.4 The project we build together', [
  cs({
    ten: 'Which folder does this code belong in?',
    kho: 'EASY', phut: 5, loai: 'table',
    en: `The folder the Notes API grows into (around chapter 6):${pre("notes-api/\n├─ src/\n│  ├─ routes/        # HTTP endpoints only — thin\n│  ├─ services/      # business logic — the valuable part\n│  ├─ middleware/    # auth, validation, error handler\n│  ├─ lib/           # shared helpers (db client, logger)\n│  └─ index.js       # wiring: create app, start listening\n├─ prisma/schema.prisma\n├─ .env  ·  .env.example\n└─ package.json")}For each piece of code, choose where it lives.`,
    vi: 'Cây thư mục Notes API lớn dần tới (khoảng chương 6). Với mỗi mẩu code, chọn nơi nó ở.',
    bang: [bang1('f1', ['Where does it live?', 'Nó ở đâu?'],
      [{ ma: 'ma', ten: 'Code|||Code' }, { ma: 'noi', ten: 'Location|||Vị trí', luaChon: ['src/routes/', 'src/services/', 'src/middleware/', 'src/lib/', 'src/index.js', 'prisma/schema.prisma', '.env'] }],
      [
        { o: { ma: 'router.post(\'/notes\', …): read req.body, call one service, send the response' }, a: { noi: 'src/routes/' } },
        { o: { ma: 'shareNote(noteId, userId): "can this user share this note?"' }, a: { noi: 'src/services/' } },
        { o: { ma: 'requireAuth(req, res, next): reject requests without a valid token' }, a: { noi: 'src/middleware/' } },
        { o: { ma: 'The shared database client and the logger' }, a: { noi: 'src/lib/' } },
        { o: { ma: 'const app = express(); app.use(…); app.listen(PORT)' }, a: { noi: 'src/index.js' } },
        { o: { ma: 'model Note { id Int @id … } and its relations' }, a: { noi: 'prisma/schema.prisma' } },
        { o: { ma: 'DATABASE_URL=postgres://notes:s3cret@…' }, a: { noi: '.env' } },
      ],
      ['"Routes stay thin, services stay testable": a route reads the request, calls one service function and formats the response. Rules like "can this user share this note?" go in services so the REST API and the realtime socket handler reuse them. Cross-cutting request checks are middleware; shared clients are lib; wiring is index.js; the data model is the Prisma schema; secrets are .env — never committed.', '"Route mỏng, service kiểm thử được": route đọc request, gọi một hàm service và định dạng phản hồi. Luật như "người này có được chia sẻ ghi chú không?" ở service để REST API và handler socket realtime dùng lại. Kiểm tra cắt ngang mọi request là middleware; client dùng chung ở lib; nối dây ở index.js; mô hình dữ liệu ở schema Prisma; bí mật ở .env — không bao giờ commit.'])],
    goiY: [['Ask: does this code know about HTTP (req/res)? Only routes and middleware should.', 'Hỏi: code này có biết HTTP (req/res) không? Chỉ route và middleware nên biết.'], ['A password-like value is always .env.', 'Giá trị giống mật khẩu luôn ở .env.']],
    loi: [['Putting business rules in routes — then you cannot test them without faking HTTP.', 'Đặt luật nghiệp vụ trong route — khi đó không kiểm thử được nếu không giả HTTP.'], ['Hard-coding the database URL in src/lib — the secret ends up in Git.', 'Viết cứng URL CSDL trong src/lib — bí mật vào Git.']],
    tns: TN,
  }),

  cs({
    ten: 'Read the project\'s package.json',
    kho: 'EASY', phut: 6,
    en: `This is the Notes API's package.json at the start of the course. Answer by reading it.${pre(PKG)}`,
    vi: 'Đây là package.json của Notes API lúc đầu khoá. Trả lời bằng cách đọc nó.',
    cau: [
      q('p1', ['Which command starts the server in development (restarts on every save)?', 'Lệnh nào chạy server khi phát triển (tự khởi động lại mỗi lần lưu)?'],
        ['npm run dev', 'npm dev', 'node dev', 'npm start --dev'],
        ['Custom scripts run with <code>npm run &lt;name&gt;</code>. <code>npm dev</code> fails — npm 10 answers <code>Unknown command: "dev"</code> and suggests <code>npm run</code>. The script itself is <code>node --watch src/index.js</code>.', 'Script tự đặt chạy bằng npm run &lt;tên&gt;. npm dev hỏng — npm 10 trả Unknown command: "dev" và gợi ý npm run.']),
      q('p2', ['Which commands work WITHOUT the word <code>run</code>?', 'Lệnh nào chạy được KHÔNG cần chữ run?'],
        ['npm start and npm test', 'npm dev and npm start', 'Only npm test', 'None — every script needs run'],
        ['<code>start</code> and <code>test</code> are special: npm has built-in shortcuts for them. Everything else needs <code>npm run</code>.', 'start và test đặc biệt: npm có lối tắt sẵn cho chúng. Mọi script khác cần npm run.']),
      q('p3', ['Is <code>src/index.js</code> CommonJS or an ES module?', 'src/index.js là CommonJS hay ES module?'],
        ['An ES module — "type": "module" makes every .js in the package ESM', 'CommonJS — a .js file is always CommonJS, whatever package.json says', 'Both — Node picks one at random every time the server starts', 'Neither — it has to be compiled first, because "type" means TypeScript'],
        ['The <code>type</code> field decides for <code>.js</code> files (lesson 1.5): use <code>import</code>/<code>export</code>, and there is no <code>__dirname</code>.', 'Trường type quyết định cho tệp .js (bài 1.5): dùng import/export, không có __dirname.']),
      q('p4', ['Which package is only needed while developing, not on the production server?', 'Gói nào chỉ cần khi phát triển, không cần trên server production?'],
        ['eslint (devDependencies)', 'express (dependencies)', 'node (engines)', 'Both express and eslint'],
        ['<code>dependencies</code> are needed to run the app; <code>devDependencies</code> are tools for writing it (linting, testing). Chapter 4 shows <code>npm ci --omit=dev</code> for production images.', 'dependencies cần để chạy app; devDependencies là công cụ để viết nó (lint, test). Chương 4 dùng npm ci --omit=dev cho ảnh production.']),
      q('p5', ['Which Node version does the project expect?', 'Dự án cần Node phiên bản nào?'],
        ['Any 22.x', 'Exactly 22.0.0', 'Anything from 22 upwards, including 23', 'The latest version on the machine'],
        ['<code>"engines": { "node": "22.x" }</code> = any release of major 22 — the same pin the lesson asks for on laptop, CI and server.', '"engines": { "node": "22.x" } = mọi bản của bản chính 22 — đúng phần ghim bài học yêu cầu cho laptop, CI và server.']),
    ],
    goiY: [['Find the field first: scripts, type, dependencies, devDependencies, engines.', 'Tìm trường trước: scripts, type, dependencies, devDependencies, engines.'], ['Only start and test have npm shortcuts.', 'Chỉ start và test có lối tắt npm.']],
    loi: [['Typing <code>npm dev</code> — npm has no such command.', 'Gõ npm dev — npm không có lệnh đó.'], ['Assuming every .js file is CommonJS while package.json says "type": "module".', 'Tưởng mọi tệp .js là CommonJS trong khi package.json ghi "type": "module".']],
    tns: TN,
  }),

  cs({
    ten: 'Git from lesson one, and the .env that must never be committed',
    kho: 'MEDIUM', phut: 6,
    en: `The lesson starts the project like this:${pre("mkdir notes-api && cd notes-api\ngit init\nprintf 'node_modules/\\n.env\\n' > .gitignore\ngit add . && git commit -m \"chore: empty project\"")}`,
    vi: 'Bài học khởi tạo dự án như trên.',
    cau: [
      q('g1', ['You committed <code>.env</code> with the real database password yesterday. Today you delete it and commit again. Now what?', 'Hôm qua lỡ commit .env có mật khẩu CSDL thật. Hôm nay xoá rồi commit lại. Giờ sao?'],
        ['Treat the password as leaked and rotate it — Git history still contains it', 'Nothing — the file is gone', 'Rename the repository', 'Add .env to .gitignore and it disappears from history'],
        ['"Git remembers history: once a password is committed, deleting it later does not remove it from the repository — it has to be treated as leaked and rotated." That is why <code>.env</code> goes into .gitignore BEFORE the first commit that contains it.', '"Git nhớ lịch sử: mật khẩu đã commit thì xoá sau cũng không mất khỏi kho — phải coi như đã lộ và đổi." Vì vậy .env vào .gitignore TRƯỚC commit đầu tiên chứa nó.']),
      q('g2', ['What goes in <code>.env.example</code>?', '.env.example chứa gì?'],
        ['The same keys as .env with no real values — and it IS committed', 'A full copy of .env with the real values — and it is never committed', 'Example notes used to fill the database with test data on first run', 'Nothing you write — npm creates it automatically from the real .env'],
        ['It documents which variables the app needs (<code>DATABASE_URL=</code>) so a new developer can create their own .env. No secrets, so it is safe in Git.', 'Nó ghi lại app cần biến nào (DATABASE_URL=) để người mới tự tạo .env. Không có bí mật nên an toàn trong Git.']),
      q('g3', ['Why does the course NOT start with the full folder structure?', 'Vì sao khoá KHÔNG bắt đầu bằng cây thư mục đầy đủ?'],
        ['Folders you do not need yet make a project confusing; we arrive there around chapter 6, when one file starts to hurt', 'Node refuses to load files from nested folders before Express is installed', 'Git cannot track empty folders, so creating them early would lose them anyway', 'Each extra folder adds startup time, so the course delays them to keep Node fast'],
        ['Structure should answer the pain you already feel. Chapters 3–5 use one file and an in-memory array on purpose.', 'Cấu trúc nên trả lời một nỗi đau bạn đã thấy. Chương 3–5 cố ý dùng một tệp và mảng trong RAM.']),
      q('g4', ['Why track the project in Git from lesson one?', 'Vì sao theo dõi dự án bằng Git từ bài đầu?'],
        ['So you can always look back ("how did it look before auth?") and return to a working state', 'Because npm install refuses to run in a folder that is not a Git repository', 'Because Git caches compiled files, so Node starts faster after every commit', 'Because a project must be on GitHub before it can be published to npm'],
        ['"A working state you can return to is worth more than clever code you can\'t undo" (lesson 0.2).', '"Một trạng thái chạy được để quay về đáng giá hơn code khéo mà không hoàn tác được" (bài 0.2).']),
    ],
    goiY: [['Git keeps every committed version — deleting a file only affects the newest one.', 'Git giữ mọi phiên bản đã commit — xoá tệp chỉ ảnh hưởng bản mới nhất.'], ['.env = values, secret. .env.example = names, public.', '.env = giá trị, bí mật. .env.example = tên biến, công khai.']],
    loi: [['Believing a later commit erases a leaked secret.', 'Tin rằng commit sau xoá được bí mật đã lộ.'], ['Ignoring .env.example too — new developers then guess the variable names.', 'Ignore luôn .env.example — người mới phải đoán tên biến.']],
    tns: TN,
  }),

  jsBai({
    ten: 'What will Git commit? A tiny .gitignore matcher',
    kho: 'MEDIUM', phut: 16,
    en: `<p>Write <code>committedFiles(files, gitignore)</code>: <code>files</code> is a list of paths in the project (with <code>/</code>), <code>gitignore</code> the text of the .gitignore. Return the files Git would commit, in the same order. Support this subset of the rules:</p>
<ul><li>Blank lines and lines starting with <code>#</code> are ignored.</li>
<li>A rule ending in <code>/</code> (<code>node_modules/</code>) matches a <b>directory</b>: any path that has that name as one of its folder parts.</li>
<li>Any other rule (<code>.env</code>, <code>*.log</code>) matches a path when <b>any</b> part of it (folder or file name) matches the pattern.</li>
<li>In a pattern, <code>*</code> means "any characters" inside one part; everything else must match exactly.</li></ul>${pre("committedFiles(['package.json', 'src/index.js', '.env', '.env.example', 'node_modules/express/index.js'], 'node_modules/\\n.env\\n')\n// ['package.json', 'src/index.js', '.env.example']   ← .env ignored, .env.example committed")}`,
    vi: `<p>Viết committedFiles(files, gitignore): trả các tệp Git sẽ commit, giữ thứ tự. Hỗ trợ tập con luật: bỏ dòng trống và dòng bắt đầu bằng #; luật kết thúc bằng / khớp một THƯ MỤC (đường dẫn có tên đó là một phần thư mục); luật khác khớp khi BẤT KỲ phần nào (thư mục hay tên tệp) khớp mẫu; trong mẫu, * là "ký tự bất kỳ" trong một phần, còn lại phải khớp chính xác.</p>`,
    yc: [
      ['Return the non-ignored files, same order.', 'Trả các tệp không bị ignore, giữ thứ tự.'],
      ['<code>.env</code> must not match <code>.env.example</code> (exact match per part); <code>.env*</code> would.', '.env không được khớp .env.example (khớp chính xác từng phần); .env* thì có.'],
      ['A directory rule never matches a file with that name at the end of the path.', 'Luật thư mục không bao giờ khớp một tệp trùng tên ở cuối đường dẫn.'],
    ],
    goiY: [
      ['Turn a pattern into an anchored regex: escape the dots, then turn <code>*</code> into <code>[^/]*</code>: <code>new RegExp(\'^\' + p.replace(/\\./g, \'\\\\.\').replace(/\\*/g, \'[^/]*\') + \'$\')</code> — so <code>.env</code> becomes <code>^\\.env$</code>.', 'Đổi mẫu thành regex có neo: thoát dấu chấm, rồi * thành [^/]* — .env thành ^\\.env$.'],
      ['Split a path into parts: <code>path.split(\'/\')</code>. Folder parts = all but the last.', 'Tách đường dẫn: path.split(\'/\'). Phần thư mục = mọi phần trừ phần cuối.'],
    ],
    loi: [
      ['Using <code>path.includes(rule)</code> — then <code>.env</code> also hides <code>.env.example</code>, and the new developer never sees which variables exist.', 'Dùng path.includes(rule) — khi đó .env giấu luôn .env.example.'],
      ['Writing the rule <code>.env*</code> "to be safe" — it ignores .env.example too.', 'Viết luật .env* "cho chắc" — nó ignore luôn .env.example.'],
      ['Forgetting comments: a line <code># secrets</code> becomes a rule that matches a file named "# secrets".', 'Quên dòng chú thích: # secrets thành luật khớp tệp tên "# secrets".'],
    ],
    gt: ['Matching per path part with an anchored pattern is what makes <code>.env</code> safe: it ignores exactly the secret file while <code>.env.example</code> — the committed documentation of the keys — survives. Directory rules only look at folder parts, which is why <code>node_modules/</code> drops a whole tree of installed packages but would not drop a file that happened to be called node_modules. Real Git has more rules (leading <code>/</code>, <code>**</code>, <code>!</code>), but these four already explain the lesson\'s .gitignore.',
      'Khớp theo từng phần với mẫu có neo làm .env an toàn: nó ignore đúng tệp bí mật còn .env.example — tài liệu tên biến được commit — vẫn còn. Luật thư mục chỉ nhìn phần thư mục, nên node_modules/ bỏ cả cây gói đã cài nhưng không bỏ một tệp tình cờ tên node_modules. Git thật có thêm luật (/ đầu, **, !), nhưng bốn luật này đã giải thích được .gitignore của bài.'],
    kn: ['.gitignore', 'pattern matching', 'secrets hygiene'],
    tns: TN,
    viDu: [{ input: "committedFiles(['package.json', 'src/index.js', '.env', '.env.example', 'node_modules/express/index.js'], 'node_modules/\\n.env\\n')", output: '["package.json","src/index.js",".env.example"]', explanation: 'The starter also drops .env.example.|||Code khởi đầu bỏ luôn .env.example.' }],
    dau: `function committedFiles(files, gitignore) {
  const rules = gitignore.split('\\n').filter(Boolean);
  return files.filter((f) => !rules.some((r) => f.includes(r.replace('/', ''))));
}
`,
    giai: `// A tiny subset of .gitignore: comments, directory rules (trailing /), and * inside one path part.
function toRegex(pattern) {
  const escaped = pattern.replace(/[.+?^\${}()|[\\]\\\\]/g, '\\\\$&'); // treat dots etc. literally
  return new RegExp('^' + escaped.replace(/\\*/g, '[^/]*') + '$');     // * = any chars in ONE part
}

function committedFiles(files, gitignore) {
  const rules = gitignore
    .split('\\n')
    .map((l) => l.trim())
    .filter((l) => l !== '' && !l.startsWith('#'))     // skip blanks and comments
    .map((l) => (l.endsWith('/') ? { dir: true, re: toRegex(l.slice(0, -1)) } : { dir: false, re: toRegex(l) }));

  const ignored = (path) => {
    const parts = path.split('/');
    const folders = parts.slice(0, -1);
    return rules.some((r) => (r.dir ? folders : parts).some((p) => r.re.test(p)));
  };

  return files.filter((f) => !ignored(f));            // same order as the input
}
`,
    cases: [
      { moTa: ['the lesson\'s .gitignore: .env out, .env.example in', '.gitignore của bài'], goi: "committedFiles(['package.json', 'src/index.js', '.env', '.env.example', 'node_modules/express/index.js'], 'node_modules/\\n.env\\n')" },
      { moTa: ['globs and comments', 'mẫu * và chú thích'], goi: "committedFiles(['app.log', 'logs/old.log', 'src/log.js', 'README.md'], '# logs\\n*.log\\n\\n')" },
      { moTa: ['a directory rule does not hide a file with that name', 'luật thư mục không giấu tệp cùng tên'], goi: "committedFiles(['dist/main.js', 'src/dist', 'docs/dist/x.md'], 'dist/')" },
      { an: true, goi: "committedFiles(['.env', '.env.local', '.env.example', 'config/.env', 'src/env.js'], '.env*')" },
      { an: true, goi: "committedFiles(['a.b', 'axb', 'tmp/cache/x', 'src/tmp.js', 'coverage/lcov.info', 'notes.test.js'], 'a.b\\ntmp/\\ncoverage/\\n  # indented comment')" },
    ],
  }),
]);
