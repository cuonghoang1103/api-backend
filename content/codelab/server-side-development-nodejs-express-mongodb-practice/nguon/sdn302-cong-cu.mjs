/** SDN302 · 0.4 — Công cụ & môi trường: node -v ≥ 20, .env đọc như dotenv, package.json đúng (start, dependencies, engines), Postman/Compass/Atlas để làm gì. */
import { doiDau, KHOA, bai, cs, q, qn, tn } from './_sdn.mjs';

const J = String.raw;

const E1 = cs({
  ten: 'Five tools and what each one is for', kho: 'EASY', phut: 5,
  en: 'The toolkit of lesson 0.4.',
  vi: 'Bộ công cụ của bài 0.4.',
  cau: [
    q('u1', ['You want to send a <code>POST /api/products</code> with a JSON body before any front-end exists. Which tool?', 'Bạn muốn gửi <code>POST /api/products</code> kèm thân JSON khi chưa có front-end. Công cụ nào?'],
      ['Postman (or curl)', 'MongoDB Compass', 'npm', 'VS Code\'s Prettier'], ['Postman sends requests and saves them in collections you can re-run.', 'Postman gửi request và lưu thành collection chạy lại được.']),
    q('u2', ['You want to SEE the documents your API wrote into MongoDB. Which tool?', 'Bạn muốn XEM các document API đã ghi vào MongoDB. Công cụ nào?'],
      ['MongoDB Compass', 'Postman', 'node -v', 'Git'], ['Compass is a GUI for the database; Postman only sees what the API returns.', 'Compass là GUI cho CSDL; Postman chỉ thấy những gì API trả về.']),
    q('u3', ['Why does the lesson recommend MongoDB Atlas over a local install?', 'Vì sao bài khuyên dùng MongoDB Atlas thay vì cài cục bộ?'],
      ['It works anywhere, mirrors production and gives a reusable connection string', 'It is the only kind of MongoDB that Mongoose is able to connect to', 'A local MongoDB install cannot store JSON documents at all', 'Atlas also runs your Express code, so no other host is needed'], ['The same URI moves to the host\'s environment variables at deploy time (Chapter 6).', 'Cùng URI đó chuyển vào biến môi trường của host khi deploy (Chương 6).']),
    qn('u4', ['After <code>npm init -y</code> and <code>npm install express mongoose</code>, what exists? (choose all)', 'Sau <code>npm init -y</code> và <code>npm install express mongoose</code>, có những gì? (chọn hết)'],
      ['<code>package.json</code> listing express and mongoose', 'a <code>node_modules/</code> folder with the packages', 'a <code>package-lock.json</code> with exact versions', 'an <code>app.js</code> with a server already running', 'a <code>.env</code> file containing MONGODB_URI'],
      [0, 1, 2], ['npm installs packages; it does not write your app or your configuration.', 'npm cài gói; nó không viết app hay cấu hình cho bạn.']),
  ],
  goiY: [['API requests vs database contents.', 'Request tới API vs nội dung CSDL.'], ['npm manages packages only.', 'npm chỉ quản lý gói.']],
  loi: [['Using Compass to test endpoints.', 'Dùng Compass để thử endpoint.'], ['Expecting npm to create app.js.', 'Mong npm tạo app.js.']],
  tns: [tn('Postman collection', 'bộ request lưu sẵn'), tn('connection string', 'chuỗi kết nối')],
  kn: ['tooling'],
});

const E2 = bai({
  ten: 'Is this Node version new enough? isSupportedNode(version)', kho: 'MEDIUM', phut: 10, lib: [],
  en: J`<p>The course needs Node.js LTS <b>20.x or newer</b>. Write <code>isSupportedNode(v)</code> that receives the text printed by <code>node -v</code> (e.g. <code>"v22.23.3"</code>) and returns <code>true</code> when the major version is ≥ 20. Accept the text with or without the leading <code>v</code>, with surrounding spaces or a newline. Anything that is not <code>MAJOR.MINOR.PATCH</code> ⇒ <code>false</code>.</p>`,
  vi: J`<p>Môn học cần Node.js LTS <b>20.x trở lên</b>. Viết <code>isSupportedNode(v)</code> nhận chữ do <code>node -v</code> in ra (vd <code>"v22.23.3"</code>) và trả <code>true</code> khi phiên bản chính ≥ 20. Nhận cả khi có hoặc không có chữ <code>v</code> đầu, có khoảng trắng hay xuống dòng hai đầu. Mọi thứ không phải dạng <code>MAJOR.MINOR.PATCH</code> ⇒ <code>false</code>.</p>`,
  yc: [['Compare NUMBERS: <code>"9.0.0"</code> &lt; <code>"20.0.0"</code> as versions, but <code>"9" &gt; "20"</code> as strings.', 'So SỐ: <code>"9.0.0"</code> &lt; <code>"20.0.0"</code> theo phiên bản, nhưng <code>"9" &gt; "20"</code> theo chuỗi.'], ['Use a regular expression: <code>/^v?(\\d+)\\.(\\d+)\\.(\\d+)$/</code>.', 'Dùng biểu thức chính quy: <code>/^v?(\\d+)\\.(\\d+)\\.(\\d+)$/</code>.']],
  viDu: [['isSupportedNode("v22.23.3\\n")', 'true', 'Major 22 ≥ 20.', 'Chính 22 ≥ 20.'], ['isSupportedNode("v18.19.0")', 'false', 'Major 18.', 'Chính 18.']],
  goiY: [['<code>const m = String(v).trim().match(/^v?(\\d+)\\.(\\d+)\\.(\\d+)$/); if (!m) return false;</code>', '<code>const m = String(v).trim().match(/^v?(\\d+)\\.(\\d+)\\.(\\d+)$/); if (!m) return false;</code>'], ['<code>return Number(m[1]) &gt;= 20;</code>', '<code>return Number(m[1]) &gt;= 20;</code>']],
  loi: [['<code>v &gt;= "v20"</code> — string comparison: "v9.0.0" &gt; "v20" is true.', '<code>v &gt;= "v20"</code> — so chuỗi: "v9.0.0" &gt; "v20" là đúng.'], ['<code>parseInt(v)</code> on "v22.1.0" is NaN because of the "v".', '<code>parseInt(v)</code> với "v22.1.0" là NaN vì có chữ "v".']],
  gt: ['Versions are tuples of numbers; parse first, then compare numerically. Anchoring the regex (<code>^…$</code>) rejects garbage such as "v22.1.0-nightly" or "twenty".', 'Phiên bản là bộ số; tách trước, so theo số sau. Neo regex (<code>^…$</code>) loại bỏ rác như "v22.1.0-nightly" hay "twenty".'],
  kn: ['regex', 'semver'],
  tns: [tn('major version', 'phiên bản chính'), tn('LTS', 'bản hỗ trợ dài hạn')],
  dau: J`function isSupportedNode(v) {
  return v >= 'v20';
}
`,
  giai: J`// "v22.23.3" ⇒ [22, 23, 3]; compare NUMBERS, never strings
function isSupportedNode(v) {
  const m = String(v).trim().match(/^v?(\d+)\.(\d+)\.(\d+)$/);
  if (!m) return false;                  // not MAJOR.MINOR.PATCH
  return Number(m[1]) >= 20;             // Node 20.x LTS or newer
}
`,
  cases: [
    { goi: `[isSupportedNode('v22.23.3\\n'), isSupportedNode('v20.0.0'), isSupportedNode('v18.19.0')]`, moTa: ['22 and 20 yes, 18 no', '22 và 20 có, 18 không'] },
    { goi: `isSupportedNode('v9.11.2')`, moTa: ['v9 is old (string comparison would say yes)', 'v9 là cũ (so chuỗi sẽ nói có)'] },
    { goi: `[isSupportedNode('24.1.0'), isSupportedNode('  v100.0.0  ')]`, an: true },
    { goi: `[isSupportedNode('v22'), isSupportedNode('twenty'), isSupportedNode(''), isSupportedNode('v22.1.0-nightly')]`, an: true },
  ],
});

const E3 = bai({
  ten: 'Read a .env file like dotenv: parseEnv(text)', kho: 'MEDIUM', phut: 15, lib: [],
  en: J`<p>Secrets and URLs live in a git-ignored <code>.env</code> file that <code>dotenv</code> loads into <code>process.env</code>. Write <code>parseEnv(text)</code> → an object, following dotenv's rules (checked against dotenv 16):</p>
<ul><li>one <code>KEY=VALUE</code> per line; blank lines and lines starting with <code>#</code> are skipped; lines without <code>=</code> are skipped;</li>
<li>an optional <code>export </code> prefix is ignored; spaces around the key and the value are trimmed;</li>
<li>a value wrapped in matching <code>"…"</code> or <code>'…'</code> keeps everything inside the quotes (even <code>#</code>);</li>
<li>otherwise a <code>#</code> starts a comment — the value stops there (then trim);</li>
<li>the same key twice ⇒ the LAST one wins; <code>EMPTY=</code> gives <code>""</code>.</li></ul>`,
  vi: J`<p>Bí mật và URL nằm trong tệp <code>.env</code> bị git-ignore mà <code>dotenv</code> nạp vào <code>process.env</code>. Viết <code>parseEnv(text)</code> → một đối tượng, theo luật của dotenv (đã đối chiếu dotenv 16):</p>
<ul><li>mỗi dòng một <code>KEY=VALUE</code>; bỏ dòng trống và dòng bắt đầu bằng <code>#</code>; bỏ dòng không có <code>=</code>;</li>
<li>tiền tố <code>export </code> tuỳ chọn bị bỏ qua; khoảng trắng quanh khoá và giá trị bị cắt;</li>
<li>giá trị bọc trong <code>"…"</code> hoặc <code>'…'</code> cùng loại giữ mọi thứ bên trong (kể cả <code>#</code>);</li>
<li>ngược lại <code>#</code> bắt đầu chú thích — giá trị dừng ở đó (rồi cắt khoảng trắng);</li>
<li>cùng khoá hai lần ⇒ cái SAU thắng; <code>EMPTY=</code> cho <code>""</code>.</li></ul>`,
  yc: [['Split on the FIRST <code>=</code> only — values such as MongoDB URIs contain <code>=</code> (<code>?retryWrites=true</code>).', 'Chỉ tách ở dấu <code>=</code> ĐẦU TIÊN — giá trị như URI MongoDB có chứa <code>=</code> (<code>?retryWrites=true</code>).'], ['Lines may end with <code>\\r\\n</code> (Windows).', 'Dòng có thể kết thúc bằng <code>\\r\\n</code> (Windows).']],
  viDu: [['parseEnv("PORT=3000\\nMONGODB_URI=mongodb+srv://u:p@c/db?retryWrites=true")', '{"PORT":"3000","MONGODB_URI":"mongodb+srv://u:p@c/db?retryWrites=true"}', 'Split at the first = only.', 'Chỉ tách ở = đầu tiên.'], ['parseEnv(\'SECRET="a b # c"\\nURL=http://x/#frag\')', '{"SECRET":"a b # c","URL":"http://x/"}', 'Quoted: # kept. Unquoted: # starts a comment.', 'Có nháy: giữ #. Không nháy: # là chú thích.']],
  goiY: [['<code>for (const raw of text.split(/\\r?\\n/)) { const line = raw.trim(); if (!line || line.startsWith(\'#\')) continue; … }</code>', '<code>for (const raw of text.split(/\\r?\\n/)) { const line = raw.trim(); if (!line || line.startsWith(\'#\')) continue; … }</code>'], ['<code>const i = line.indexOf(\'=\'); const key = line.slice(0, i).replace(/^export\\s+/, \'\').trim(); let value = line.slice(i + 1).trim();</code>', '<code>const i = line.indexOf(\'=\'); const key = line.slice(0, i).replace(/^export\\s+/, \'\').trim(); let value = line.slice(i + 1).trim();</code>']],
  loi: [['<code>line.split(\'=\')</code> — the URI <code>…?retryWrites=true&amp;w=majority</code> is cut into pieces.', '<code>line.split(\'=\')</code> — URI <code>…?retryWrites=true&amp;w=majority</code> bị chặt thành mảnh.'], ['Keeping the quotes: <code>"a b"</code> becomes the 5-character value <code>"a b"</code> with quotes.', 'Giữ dấu nháy: <code>"a b"</code> thành giá trị 5 ký tự có cả dấu nháy.'], ['Committing the .env file to Git "because the code reads it" — add it to .gitignore and set the same keys on the host.', 'Commit tệp .env lên Git "vì mã đọc nó" — thêm vào .gitignore và đặt cùng các khoá trên host.']],
  gt: ['A .env file is just lines of key/value text; the subtle rules are the first-<code>=</code> split, the quotes and the comment character. Writing the parser once shows why the URL of the example lost its <code>#frag</code> — and why you quote values that contain <code>#</code>.', 'Tệp .env chỉ là các dòng chữ khoá/giá trị; luật tinh tế là tách ở <code>=</code> đầu, dấu nháy và ký tự chú thích. Tự viết bộ đọc một lần cho thấy vì sao URL trong ví dụ mất <code>#frag</code> — và vì sao phải đặt giá trị có <code>#</code> trong ngoặc nháy.'],
  kn: ['.env', 'parsing'],
  tns: [tn('dotenv', 'gói nạp .env vào process.env'), tn('.gitignore', 'danh sách tệp Git bỏ qua')],
  dau: J`function parseEnv(text) {
  const out = {};
  for (const line of text.split('\n')) {
    const [key, value] = line.split('=');
    out[key] = value;
  }
  return out;
}
`,
  giai: J`function parseEnv(text) {
  const out = {};
  for (const raw of String(text).split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;            // blank line or full-line comment
    const i = line.indexOf('=');
    if (i < 0) continue;                                    // not KEY=VALUE
    const key = line.slice(0, i).replace(/^export\s+/, '').trim();
    if (!key) continue;
    let value = line.slice(i + 1).trim();                   // split at the FIRST "=" only
    const q = value.charAt(0);
    if ((q === '"' || q === "'") && value.length >= 2 && value.endsWith(q)) {
      value = value.slice(1, -1);                           // quoted: keep everything inside, even #
    } else {
      const hash = value.indexOf('#');                      // unquoted: # starts a comment
      if (hash >= 0) value = value.slice(0, hash).trim();
    }
    out[key] = value;                                       // the last duplicate wins
  }
  return out;
}
`,
  cases: [
    { goi: `parseEnv('PORT=3000\\nMONGODB_URI=mongodb+srv://u:p@c/db?retryWrites=true&w=majority')`, moTa: ['Split at the first = only', 'Chỉ tách ở = đầu tiên'] },
    { goi: `parseEnv(${JSON.stringify('SECRET="a b # c"\nNAME=\'single\'\nURL=http://x/#frag\nINLINE=value # comment')})`, moTa: ['Quotes and # comments', 'Dấu nháy và chú thích #'] },
    { goi: `parseEnv('# config\\n\\nexport MODE=prod\\nPORT=3000\\nPORT=4000\\nEMPTY=\\nNOEQUALS\\n  SPACED  =  yes  ')`, moTa: ['export, duplicates, empty, spaces', 'export, trùng khoá, rỗng, khoảng trắng'] },
    { goi: `parseEnv('A=1\\r\\nB=two words\\r\\n#C=3\\r\\n')`, an: true },
    { goi: `parseEnv(${JSON.stringify('JWT_SECRET="unterminated\nX="ok"\nY=\'mixed"')})`, an: true },
  ],
});

const E4 = bai({
  ten: 'Lint your package.json before the first commit: checkPackageJson(pkg)', kho: 'HARD', phut: 18, lib: [],
  en: J`<p>Write <code>checkPackageJson(pkg, { usesRequire })</code> that returns the list of problems (strings, in this order) for the project of this course:</p>
<ol><li><code>"missing start script"</code> — <code>scripts.start</code> absent (hosts run <code>npm start</code>);</li>
<li><code>"express must be a dependency"</code> / <code>"mongoose must be a dependency"</code> — absent from <code>dependencies</code> (being only in <code>devDependencies</code> counts as absent: production installs skip dev dependencies);</li>
<li><code>"engines.node must require 20 or newer"</code> — <code>engines.node</code> absent, or its first number is below 20 (e.g. <code>"&gt;=18"</code>, <code>"16.x"</code>);</li>
<li><code>"type module conflicts with require()"</code> — <code>pkg.type === 'module'</code> while <code>usesRequire</code> is true.</li></ol>
<p>No problem ⇒ <code>[]</code>.</p>`,
  vi: J`<p>Viết <code>checkPackageJson(pkg, { usesRequire })</code> trả danh sách vấn đề (chuỗi, theo thứ tự này) cho dự án của môn:</p>
<ol><li><code>"missing start script"</code> — thiếu <code>scripts.start</code> (host chạy <code>npm start</code>);</li>
<li><code>"express must be a dependency"</code> / <code>"mongoose must be a dependency"</code> — không có trong <code>dependencies</code> (chỉ có trong <code>devDependencies</code> tính là không có: bản cài production bỏ qua dev dependencies);</li>
<li><code>"engines.node must require 20 or newer"</code> — thiếu <code>engines.node</code>, hoặc số đầu tiên của nó nhỏ hơn 20 (vd <code>"&gt;=18"</code>, <code>"16.x"</code>);</li>
<li><code>"type module conflicts with require()"</code> — <code>pkg.type === 'module'</code> trong khi <code>usesRequire</code> là true.</li></ol>
<p>Không vấn đề ⇒ <code>[]</code>.</p>`,
  yc: [['Guard every nested read: <code>(pkg.scripts || {}).start</code>.', 'Phòng mọi lần đọc lồng: <code>(pkg.scripts || {}).start</code>.'], ['First number of a range: <code>/(\\d+)/.exec(range)</code>.', 'Số đầu tiên của một khoảng: <code>/(\\d+)/.exec(range)</code>.']],
  viDu: [['{ "scripts": { "dev": "nodemon app.js" }, "dependencies": { "express": "^4.21.2" }, "devDependencies": { "mongoose": "^8.9.0" } }', '["missing start script","mongoose must be a dependency","engines.node must require 20 or newer"]', 'Three problems.', 'Ba vấn đề.']],
  goiY: [['<code>const deps = pkg.dependencies || {}; if (!deps.express) problems.push(\'express must be a dependency\');</code>', '<code>const deps = pkg.dependencies || {}; if (!deps.express) problems.push(\'express must be a dependency\');</code>'], ['<code>const m = /(\\d+)/.exec((pkg.engines || {}).node || \'\'); if (!m || Number(m[1]) &lt; 20) …</code>', '<code>const m = /(\\d+)/.exec((pkg.engines || {}).node || \'\'); if (!m || Number(m[1]) &lt; 20) …</code>']],
  loi: [['Accepting mongoose in devDependencies — <code>npm ci --omit=dev</code> on the host leaves it out and the server crashes on start.', 'Chấp nhận mongoose trong devDependencies — <code>npm ci --omit=dev</code> trên host bỏ nó ra và server sập khi khởi động.'], ['<code>pkg.scripts.start</code> when <code>scripts</code> is missing: TypeError.', '<code>pkg.scripts.start</code> khi thiếu <code>scripts</code>: TypeError.']],
  gt: ['Most "works on my machine" deploy failures are visible in package.json: no start script for the host, runtime packages listed as dev-only, an engine range that allows an old Node, or a module type that contradicts the code. Checking them mechanically is cheaper than discovering them in a host log.', 'Phần lớn lỗi deploy "máy tôi chạy được" hiện ngay trong package.json: không có script start cho host, gói chạy thật chỉ ghi ở dev, khoảng engine cho phép Node cũ, hay kiểu module mâu thuẫn với mã. Kiểm chúng một cách máy móc rẻ hơn phát hiện chúng trong log của host.'],
  kn: ['package.json', 'deploy readiness'],
  tns: [tn('dependencies vs devDependencies', 'gói chạy thật vs gói chỉ để phát triển'), tn('engines', 'phiên bản Node yêu cầu')],
  dau: J`function checkPackageJson(pkg, opts) {
  const problems = [];
  if (!pkg.scripts.start) problems.push('missing start script');
  if (!pkg.dependencies.express && !pkg.devDependencies.express) problems.push('express must be a dependency');
  return problems;
}
`,
  giai: J`function checkPackageJson(pkg, opts = {}) {
  const problems = [];
  const scripts = pkg.scripts || {};
  const deps = pkg.dependencies || {};               // devDependencies do NOT count: hosts install without them
  if (!scripts.start) problems.push('missing start script');
  if (!deps.express) problems.push('express must be a dependency');
  if (!deps.mongoose) problems.push('mongoose must be a dependency');
  const range = (pkg.engines || {}).node || '';
  const first = /(\d+)/.exec(range);                // ">=20.11" ⇒ 20 · "16.x" ⇒ 16
  if (!first || Number(first[1]) < 20) problems.push('engines.node must require 20 or newer');
  if (pkg.type === 'module' && opts.usesRequire) problems.push('type module conflicts with require()');
  return problems;
}
`,
  cases: [
    { goi: `checkPackageJson({ scripts: { dev: 'nodemon app.js' }, dependencies: { express: '^4.21.2' }, devDependencies: { mongoose: '^8.9.0' } }, { usesRequire: true })`, moTa: ['The example: three problems', 'Ví dụ: ba vấn đề'] },
    { goi: `checkPackageJson({ scripts: { start: 'node ./bin/www' }, dependencies: { express: '~4.16.1', mongoose: '^8.9.0' }, engines: { node: '>=20.11' } }, { usesRequire: true })`, moTa: ['A good package.json → []', 'package.json tốt → []'] },
    { goi: `checkPackageJson({ type: 'module', scripts: { start: 'node app.js' }, dependencies: { express: '5', mongoose: '8' }, engines: { node: '16.x' } }, { usesRequire: true })`, an: true },
    { goi: `checkPackageJson({}, {})`, an: true },
    { goi: `checkPackageJson({ type: 'module', scripts: { start: 'node app.js' }, dependencies: { express: '5', mongoose: '8' }, engines: { node: '^22' } }, { usesRequire: false })`, an: true },
  ],
});

export default doiDau({
  slug: 'sdn302-cong-cu',
  ten: '0.4 Tools & environment setup',
  khoa: KHOA,
  baiHoc: 'sdn302-cong-cu',
  de: [E1, E2, E3, E4],
});
