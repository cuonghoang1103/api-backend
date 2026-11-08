// Node.js 0.3 — Setting up your environment. Bài cài đặt ⇒ đề nhẹ: chọn lệnh, sắp bước nvm, bảng lệnh → kết quả, và một hàm
// đọc "engines" của package.json để bắt lệch phiên bản giữa laptop / CI / server (lỗi bài học nhấn mạnh).
import { modul, cs, jsBai, q, ord, bang1, tn, pre } from './_node.mjs';

const TN = [
  tn('version manager', 'trình quản lý phiên bản', 'nvm / fnm / volta — installs and switches Node versions per project.'),
  tn('LTS vs odd major', 'LTS vs bản lẻ', 'Even majors (22, 24) get ~30 months of support; odd majors are experimental — never production.'),
  tn('engines', 'engines', 'package.json field that pins the Node version a project expects, e.g. "node": "22.x".'),
  tn('.nvmrc', '.nvmrc', 'A file with the Node version for this folder; nvm use reads it.'),
  tn('REPL', 'REPL', 'The interactive prompt you get by typing node with no file.'),
  tn('node: prefix', 'tiền tố node:', 'require(\'node:os\') — says "built-in", not an npm package with the same name.'),
];

export default modul('nodejs-0-3-cai-dat', '0.3 Setting up your environment', [
  cs({
    ten: 'Pick the right version, the right tool',
    kho: 'EASY', phut: 6,
    en: 'Setup decisions from the lesson. Choose the correct one each time.',
    vi: 'Các quyết định cài đặt trong bài. Mỗi câu chọn cái đúng.',
    cau: [
      q('v1', ['Which Node version should a new project in this course use?', 'Dự án mới trong khoá này dùng Node nào?'],
        ['The current LTS — Node 22.x', 'Node 23, the newest', 'Node 18, the most tutorials use it', 'Whatever the OS package manager installs'],
        ['Even majors become LTS. 23 is odd (experimental), and 16, 18 and — as of October 2026 — 20 are past end-of-life. The course is verified on 22.x.', 'Bản chẵn thành LTS. 23 là lẻ (thử nghiệm), còn 16, 18 và — tính tới 10/2026 — 20 đã hết vòng đời. Khoá được kiểm trên 22.x.']),
      q('v2', ['Why install Node through a version manager instead of the plain installer?', 'Vì sao cài Node qua trình quản lý phiên bản thay vì bộ cài thường?'],
        ['Two projects will disagree on the version; switching becomes one command instead of a reinstall', 'The plain installer is slower to download and needs a restart afterwards', 'npm only works when Node was installed through nvm, never from the installer', 'The plain installer cannot install LTS versions, only the newest odd major'],
        ['Every real project pins a version, and sooner or later two of yours disagree. <code>nvm use 22</code> is a one-command switch.', 'Dự án thật nào cũng ghim phiên bản, sớm muộn hai dự án của bạn sẽ khác nhau. nvm use 22 là chuyển trong một lệnh.']),
      q('v3', ['You installed nvm and the same terminal says <code>nvm: command not found</code>. Fix?', 'Cài nvm xong, chính terminal đó báo nvm: command not found. Sửa thế nào?'],
        ['Close the terminal and open a new one — it never re-read ~/.zshrc / ~/.bashrc', 'Reinstall nvm with sudo so it can write to the system folders', 'Install Node from nodejs.org instead — nvm does not work on macOS', 'Run nvm install 22 again; the first install did not finish'],
        ['The installer appended its setup lines to your shell profile; an already-open terminal read that file before the change.', 'Bộ cài nối các dòng thiết lập vào profile của shell; terminal đang mở đã đọc tệp đó trước khi đổi.']),
      q('v4', ['You are on Windows. Which is right?', 'Bạn dùng Windows. Cái nào đúng?'],
        ['Use nvm-windows or fnm, remove any Node from nodejs.org first, install from an Administrator terminal', 'Use the same Linux nvm install.sh script through PowerShell, as on macOS', 'Keep both the nodejs.org Node and nvm-windows so you always have a fallback', 'Windows cannot run Node 22 natively, so install Node 20 from the installer'],
        ['The Linux nvm does not work on Windows, and two Nodes on the PATH is "a debugging nightmare".', 'nvm của Linux không chạy trên Windows, và hai Node trên PATH là "ác mộng gỡ lỗi".']),
      q('v5', ['Why write <code>require(\'node:os\')</code> instead of <code>require(\'os\')</code>?', 'Vì sao viết require(\'node:os\') thay vì require(\'os\')?'],
        ['node: says "built-in", so nothing published to npm under the same name can be loaded by mistake', 'It is faster, because Node skips the search through node_modules folders', 'require(\'os\') no longer works in Node 22 and throws ERR_UNKNOWN_BUILTIN', 'It loads the newest version of os from npm instead of the bundled one'],
        ['Both work today, but the prefix removes the ambiguity — and package-name attacks are real (chapter 4).', 'Cả hai đều chạy, nhưng tiền tố loại bỏ sự mơ hồ — và tấn công bằng tên gói là có thật (chương 4).']),
    ],
    goiY: [['Even = LTS = production.', 'Chẵn = LTS = production.'], ['Most "it did not install" reports are an old terminal or two Nodes on the PATH.', 'Phần lớn báo "không cài được" là do terminal cũ hoặc hai Node trên PATH.']],
    loi: [['Deploying an odd major because it has new features.', 'Deploy bản lẻ vì có tính năng mới.'], ['Reinstalling when only a new terminal was needed.', 'Cài lại trong khi chỉ cần mở terminal mới.']],
    tns: TN,
  }),

  cs({
    ten: 'Install Node 22 with nvm, in order',
    kho: 'EASY', phut: 3, loai: 'order',
    en: 'macOS / Linux. Put the steps in order, ending with the check that Node really is 22.',
    vi: 'macOS / Linux. Sắp các bước, kết thúc bằng phép kiểm Node đúng là 22.',
    cau: [
      ord('n1', ['Order the steps.', 'Sắp các bước.'], [
        'Run the nvm install script (curl … install.sh | bash)',
        'Close the terminal and open a new one',
        'nvm install 22',
        'nvm use 22',
        'nvm alias default 22',
        'node -v (expect v22.x)',
      ], ['Install the manager, reload the shell so it is found, install and activate 22, make it the default for future shells, and only then trust it: <code>node -v</code> in a terminal opened after the change.', 'Cài trình quản lý, nạp lại shell để tìm thấy nó, cài và kích hoạt 22, đặt làm mặc định cho shell sau này, rồi mới tin: node -v trong terminal mở sau khi đổi.']),
    ],
    goiY: [['The new terminal comes right after installing nvm.', 'Terminal mới ngay sau khi cài nvm.'], ['Verify last.', 'Kiểm tra sau cùng.']],
    loi: [['Running nvm install 22 in the same terminal that just installed nvm.', 'Chạy nvm install 22 ngay trong terminal vừa cài nvm.'], ['Skipping nvm alias default — the next terminal falls back to another version.', 'Bỏ nvm alias default — terminal sau quay về phiên bản khác.']],
    tns: TN,
  }),

  cs({
    ten: 'Command → what it tells you',
    kho: 'EASY', phut: 5, loai: 'table',
    en: 'For each command from the lesson, choose what it answers.',
    vi: 'Với mỗi lệnh trong bài, chọn thứ nó cho biết.',
    bang: [bang1('k1', ['What does each command tell you?', 'Mỗi lệnh cho biết gì?'],
      [{ ma: 'lenh', ten: 'Command|||Lệnh' }, { ma: 'kq', ten: 'Answers|||Cho biết', luaChon: ['the Node version (e.g. v22.21.0)', 'the npm version', 'the V8 engine version', 'the libuv version', 'opens the interactive REPL', 'runs a file'] }],
      [
        { o: { lenh: 'node -v' }, a: { kq: 'the Node version (e.g. v22.21.0)' } },
        { o: { lenh: 'npm -v' }, a: { kq: 'the npm version' } },
        { o: { lenh: 'node -p "process.versions.v8"' }, a: { kq: 'the V8 engine version' } },
        { o: { lenh: 'node -p "process.versions.uv"' }, a: { kq: 'the libuv version' } },
        { o: { lenh: 'node   (no file name)' }, a: { kq: 'opens the interactive REPL' } },
        { o: { lenh: 'node hello.js' }, a: { kq: 'runs a file' } },
      ],
      ['Three commands verify an install: <code>node -v</code>, <code>npm -v</code> and <code>process.versions.v8</code> (proof that Node wraps V8). <code>process.versions.uv</code> shows libuv, the event-loop library. <code>node</code> alone opens the REPL — the fastest way to ask "what does this expression return?" (try <code>typeof null</code> ⇒ \'object\').', 'Ba lệnh kiểm cài đặt: node -v, npm -v và process.versions.v8 (chứng minh Node bọc V8). process.versions.uv cho biết libuv. node không kèm tệp mở REPL — cách nhanh nhất hỏi "biểu thức này trả gì?" (thử typeof null ⇒ \'object\').'])],
    goiY: [['-p means "print the value of this expression".', '-p nghĩa là "in giá trị biểu thức này".'], ['v8 and uv are the two engines inside Node.', 'v8 và uv là hai bộ máy bên trong Node.']],
    loi: [['Expecting node -v to print the npm version.', 'Tưởng node -v in phiên bản npm.'], ['Thinking node with no file does nothing — it opens the REPL.', 'Nghĩ node không kèm tệp không làm gì — nó mở REPL.']],
    tns: TN,
  }),

  jsBai({
    ten: 'Laptop, CI and server must agree: read "engines"',
    kho: 'MEDIUM', phut: 14,
    en: `<p>"Your laptop, your CI and your server should run the same major. Version drift causes bugs that only appear after deploy." This website pins Node 22 in package.json <code>engines</code>, the Dockerfile and CI. Write <code>checkNodeSetup(pkg, envs)</code>:</p>
<ul><li><code>pkg</code> is a parsed package.json. The pinned major is the first whole number in <code>pkg.engines.node</code> (<code>'22.x'</code>, <code>'&gt;=22 &lt;23'</code>, <code>'^22.11.0'</code> all pin 22).</li>
<li><code>envs</code> maps an environment name to the output of <code>node -v</code> there, e.g. <code>{ laptop: 'v22.21.0', ci: '22.23.3', server: 'v20.11.1' }</code> (with or without the <code>v</code>).</li>
<li>Return an array of problems, in this order: first <code>'package.json has no engines.node'</code> if it is missing; then for each environment (in the order of <code>envs</code>): <code>'&lt;env&gt;: Node &lt;m&gt; is an odd major (not LTS)'</code> when its major is odd, and <code>'&lt;env&gt;: runs Node &lt;m&gt;, package.json pins &lt;p&gt;'</code> when it differs from the pinned major.</li></ul>${pre("checkNodeSetup({ engines: { node: '22.x' } }, { laptop: 'v22.21.0', ci: '22.23.3', server: 'v20.11.1' })\n// ['server: runs Node 20, package.json pins 22']")}`,
    vi: `<p>"Laptop, CI và server nên chạy cùng bản chính. Lệch phiên bản gây bug chỉ hiện sau khi deploy." Viết checkNodeSetup(pkg, envs): bản chính được ghim = số nguyên đầu tiên trong pkg.engines.node; envs ánh xạ tên môi trường → output node -v ở đó (có hoặc không có v). Trả mảng vấn đề theo thứ tự: thiếu engines.node ⇒ 'package.json has no engines.node'; rồi mỗi môi trường: bản lẻ ⇒ '&lt;env&gt;: Node &lt;m&gt; is an odd major (not LTS)', khác bản ghim ⇒ '&lt;env&gt;: runs Node &lt;m&gt;, package.json pins &lt;p&gt;'.</p>`,
    yc: [
      ['Exact messages, in the order described; <code>[]</code> when everything agrees.', 'Đúng chuỗi thông báo, đúng thứ tự; [] khi mọi thứ khớp.'],
      ['Accept versions with and without the leading <code>v</code>.', 'Nhận phiên bản có và không có chữ v đầu.'],
      ['Without <code>engines.node</code> there is nothing to compare against — still report odd majors.', 'Không có engines.node thì không có gì để so — vẫn báo bản lẻ.'],
    ],
    goiY: [['Major of a version: <code>Number(v.replace(/^v/, \'\').split(\'.\')[0])</code>.', 'Bản chính: Number(v.replace(/^v/, \'\').split(\'.\')[0]).'], ['Pinned major: <code>const m = String(pkg.engines.node).match(/\\d+/)</code> — the first run of digits.', 'Bản ghim: const m = String(pkg.engines.node).match(/\\d+/) — dãy chữ số đầu tiên.'], ['<code>pkg.engines?.node</code> is safe when engines is missing; loop with <code>for (const [env, v] of Object.entries(envs))</code>.', 'pkg.engines?.node an toàn khi thiếu engines; lặp bằng Object.entries(envs).']],
    loi: [['Comparing whole version strings (<code>\'v22.21.0\' !== \'22.23.3\'</code>) — patch differences are normal; only the major has to match.', 'So cả chuỗi phiên bản — khác bản vá là bình thường; chỉ bản chính phải khớp.'], ['Parsing <code>\'&gt;=22 &lt;23\'</code> with <code>parseInt</code> — it starts with "&gt;", so you get NaN.', 'Dùng parseInt cho \'>=22 <23\' — chuỗi bắt đầu bằng ">" nên ra NaN.']],
    gt: ['Only the major matters for compatibility in this check ("a newer patch such as 22.23.x is normal"). Reading the pin from <code>engines</code> makes package.json the single source of truth; comparing every environment with it turns "works on my machine" into an explicit report. Odd majors are flagged independently because they are wrong for production even when every machine agrees on them.',
      'Với phép kiểm này chỉ bản chính quan trọng ("bản vá mới hơn như 22.23.x là bình thường"). Đọc bản ghim từ engines làm package.json thành nguồn sự thật duy nhất; so mọi môi trường với nó biến "máy tôi chạy được" thành một báo cáo rõ ràng. Bản lẻ bị báo riêng vì nó sai cho production kể cả khi mọi máy đều dùng nó.'],
    kn: ['package.json engines', 'version drift'],
    tns: TN,
    viDu: [{ input: "checkNodeSetup({ engines: { node: '22.x' } }, { laptop: 'v22.21.0', ci: '22.23.3', server: 'v20.11.1' })", output: '["server: runs Node 20, package.json pins 22"]', explanation: 'Different patches are fine; a different major is not.|||Khác bản vá thì ổn; khác bản chính thì không.' }],
    dau: `function checkNodeSetup(pkg, envs) {
  const problems = [];
  const pinned = pkg.engines.node;
  for (const env in envs) {
    if (envs[env] !== pinned) problems.push(env + ': runs Node ' + envs[env] + ', package.json pins ' + pinned);
  }
  return problems;
}
`,
    giai: `// Only the MAJOR has to match ("a newer patch such as 22.23.x is normal").
const majorOf = (v) => Number(String(v).replace(/^v/, '').split('.')[0]);

function checkNodeSetup(pkg, envs) {
  const problems = [];
  const range = pkg.engines?.node;                       // safe when "engines" is missing
  const m = range ? String(range).match(/\\d+/) : null;  // first whole number: 22.x, >=22 <23, ^22.11.0
  const pinned = m ? Number(m[0]) : null;
  if (pinned === null) problems.push('package.json has no engines.node');

  for (const [env, version] of Object.entries(envs)) {   // keeps the order of envs
    const major = majorOf(version);
    if (major % 2 === 1) problems.push(env + ': Node ' + major + ' is an odd major (not LTS)');
    if (pinned !== null && major !== pinned) problems.push(env + ': runs Node ' + major + ', package.json pins ' + pinned);
  }
  return problems;
}
`,
    cases: [
      { moTa: ['server drifted to 20', 'server lệch sang 20'], goi: "checkNodeSetup({ engines: { node: '22.x' } }, { laptop: 'v22.21.0', ci: '22.23.3', server: 'v20.11.1' })" },
      { moTa: ['everything on 22 (different patches) ⇒ []', 'tất cả 22 (khác bản vá) ⇒ []'], goi: "checkNodeSetup({ engines: { node: '>=22 <23' } }, { laptop: 'v22.21.0', ci: 'v22.23.3', server: '22.11.0' })" },
      { moTa: ['no engines field, odd major on the laptop', 'thiếu engines, laptop chạy bản lẻ'], goi: "checkNodeSetup({ name: 'notes-api' }, { laptop: 'v23.4.0', server: 'v22.21.0' })" },
      { an: true, goi: "checkNodeSetup({ engines: { node: '^22.11.0' } }, { laptop: 'v23.1.0', docker: '22.23.3', ci: 'v18.20.4' })" },
      { an: true, goi: "[checkNodeSetup({ engines: { node: '24' } }, { a: 'v24.0.1' }), checkNodeSetup({ engines: {} }, {})]" },
    ],
  }),
]);
