/**
 * GitHub Actions · Deck ga-04 — Chương 4: Action, và chuyện chạy mã của người khác.
 *
 * MỌI log/output mới trên slide là THẬT, chạy 24/09/2026 trên sân tập công khai
 * github.com/cuonghoang1103/ga-san-tap, nhánh ch04-action (commit 9b06fcb, runner 2.337.0, ubuntu-24.04):
 *   36000261804 giải uses: (thẻ vs SHA, _actions/, action JS tự viết, gõ sai input, docker://)
 *   36000261745 checkout (fetch-depth 1/0, khoá nằm đâu, push 403, persist-credentials: false)
 *   36000264687 / 36000590425 setup-node (cache trượt → lưu, rồi trúng) · 36000261759 composite
 *   36000264372 cố ý đỏ (SHA ngắn, docker trên macOS, action cục bộ trước checkout) · actionlint 1.7.12 trên Mac.
 * Thẻ actions/checkout: gh api repos/actions/checkout/git/ref/tags/… (24/09/2026).
 * tj-actions: github.com/advisories/GHSA-mrrh-fwg8-r2c3 (CVE-2025-30066).
 * Khoá cache cũ của api-backend: run 32662461744 (commit 6a121bac), tái lập offline bằng node:crypto.
 */
import { S, cover, cards, box, table, two, list, mindmap, term as gaTerm, yaml, diagram, bars, kpis, sv, R, T, A, D } from './_ga-chung.mjs';

export const deck = { key: 'ga-04', code: 'GITHUB ACTIONS · CHƯƠNG 4', title: 'Action và mã của người khác', sub: 'GitHub Actions · Chương 4' };

const t = (lines, title, fs = 15) => gaTerm(lines, { title, dir: '~/ga-san-tap', fs });
const line = (x1, y1, x2, y2, c = '#1d2a40', w = 1, dash = '') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${D[c] || c}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
const dot = (x, y, c, r = 9) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${D[c] || c}"/>`;

/* ───────────── Slide 3 — một dòng uses: được giải ra thế nào ───────────── */
const giaiUses = () => diagram({
  w: 1160, h: 470,
  nodes: [
    { id: 'u', x: 0, y: 20, w: 250, h: 86, t: 'uses: owner/repo@ref', d: 'actions/checkout@v4', c: 'dk', mono: true },
    { id: 'r', x: 305, y: 20, w: 250, h: 86, t: 'Hỏi API: ref → SHA', d: 'v4 → 11d5960a…', c: 'blu' },
    { id: 'd', x: 610, y: 20, w: 250, h: 86, t: 'Tải tarball', d: 'Download action repository', c: 'tea' },
    { id: 'f', x: 910, y: 20, w: 250, h: 86, t: '_actions/…/v4/', d: 'thư mục trên runner', c: 'grn', mono: false },
    { id: 'a', x: 910, y: 190, w: 250, h: 86, t: 'đọc action.yml', d: 'inputs · outputs · runs:', c: 'amb' },
    { id: 'js', x: 0, y: 360, w: 330, h: 96, t: 'using: node20 / node24', d: 'JS: pre → main → post\nchạy bằng Node CỦA RUNNER', c: 'vio' },
    { id: 'dk', x: 415, y: 360, w: 330, h: 96, t: 'using: docker', d: 'kéo/dựng ảnh ở Set up job\nCHỈ Linux', c: 'blu' },
    { id: 'cp', x: 830, y: 360, w: 330, h: 96, t: 'using: composite', d: 'một chùm bước thường\nmỗi run: phải có shell:', c: 'tea' },
  ],
  edges: [
    { from: 'u', to: 'r' }, { from: 'r', to: 'd' }, { from: 'd', to: 'f' }, { from: 'f', to: 'a' },
    { from: 'a', to: 'js', t: 'runs.using', fs: 'l', ts: 't' }, { from: 'a', to: 'dk', fs: 'b', ts: 't' }, { from: 'a', to: 'cp', fs: 'b', ts: 't' },
  ],
});

/* ───────────── Slide 6 — cây quyền: một action với tới được gì ───────────── */
const cayQuyen = () => {
  let s = '';
  const cx = 575, cy = 235;
  s += R(cx - 150, cy - 45, 300, 90, { c: 'dk', fill: 'rgba(32,136,255,.14)' }) + T(cx, cy - 8, 'một bước uses:', { fs: 21, a: 'middle', b: true }) + T(cx, cy + 22, 'chạy NHƯ CHÍNH BẠN', { fs: 16, a: 'middle', c: 'mu' });
  const leaf = (x, y, w, c, t1, t2, ok) => {
    const bx = x, by = y;
    return R(bx, by, w, 74, { c, fill: '#0f182a' }) + T(bx + 14, by + 30, t1, { fs: 17, b: true, c }) + T(bx + 14, by + 56, t2, { fs: 14.5, c: 'mu' }) + (ok ? T(bx + w - 12, by + 30, ok, { fs: 17, a: 'end', b: true }) : '');
  };
  const L = [
    [0, 0, 350, 'grn', 'Thư mục làm việc', 'đọc + SỬA mã trước bước dựng', '✓'],
    [0, 105, 350, 'grn', 'Mạng ra ngoài', 'không có tường lửa chiều ra', '✓'],
    [0, 210, 350, 'amb', 'GITHUB_ENV · GITHUB_PATH', 'đổi PATH ⇒ thay lệnh bước sau', '✓'],
    [0, 315, 350, 'red', 'Bộ nhớ Runner.Worker', 'sudo đọc được — vụ tj-actions', '!'],
    [800, 0, 360, 'blu', 'Biến môi trường', 'INPUT_*, ACTIONS_RUNTIME_TOKEN', '✓'],
    [800, 105, 360, 'dim', 'GITHUB_TOKEN trong env?', 'đo thật: false — KHÔNG có', '✗'],
    [800, 210, 360, 'vio', 'token qua input mặc định', 'checkout, setup-node: github.token', '✓'],
    [800, 315, 360, 'ora', 'khoá checkout để lại', 'git config --get … = 545 ký tự', '✓'],
  ];
  L.forEach(([x, y, w, c, a, b, ok]) => {
    s += leaf(x, y + 20, w, c, a, b, ok);
    const ex = x < 500 ? x + w : x, ey = y + 57;
    s += `<path d="M${cx + (x < 500 ? -150 : 150)} ${cy} C${(cx + ex) / 2} ${cy} ${(cx + ex) / 2} ${ey} ${ex + (x < 500 ? 4 : -4)} ${ey}" stroke="${D[c]}" stroke-width="2.2" fill="none" opacity=".75"/>`;
  });
  s += R(380, 410, 390, 60, { c: 'dim', dash: true, fill: 'rgba(255,255,255,.03)' }) + T(575, 436, 'Trần của token: permissions:', { fs: 16, a: 'middle', b: true }) + T(575, 459, 'contents: read ⇒ git push 403', { fs: 15, a: 'middle', c: 'mu', mono: true });
  return sv(1160, 480, s);
};

/* ───────────── Slide 8 — pre / main / post: dựng xuôi, dọn ngược ───────────── */
const truocSau = () => {
  let s = '';
  const X = (i) => 20 + i * 140;
  const main = [['1', 'checkout@v4', 'tea'], ['2', 'checkout@SHA', 'tea'], ['3', 'run: ls', 'dim'], ['4', 'soi (JS)', 'vio'], ['5', 'run: echo', 'dim'], ['6', 'setup-node', 'grn'], ['7', 'run: node', 'dim'], ['8', 'docker://', 'blu']];
  s += T(0, 36, 'Chạy xuôi', { fs: 17, b: true, c: 'mu' });
  main.forEach(([n, lb, c], i) => { s += R(X(i), 55, 126, 58, { c, fill: '#0f182a', r: 9 }) + T(X(i) + 63, 80, n, { fs: 16, a: 'middle', b: true, c }) + T(X(i) + 63, 102, lb, { fs: 13.5, a: 'middle', mono: true }); });
  const post = [['17', 'post setup-node', 'grn', 5], ['18', 'post soi (JS)', 'vio', 3], ['19', 'post checkout@SHA', 'tea', 1], ['20', 'post checkout@v4', 'tea', 0]];
  s += T(0, 196, 'Dọn ngược', { fs: 17, b: true, c: 'mu' });
  post.forEach(([n, lb, c, src], i) => {
    const x = 220 + i * 230;
    s += R(x, 215, 200, 58, { c, fill: '#0f182a', r: 9 }) + T(x + 100, 240, `bước ${n}`, { fs: 15, a: 'middle', b: true, c }) + T(x + 100, 262, lb, { fs: 13.5, a: 'middle', mono: true });
    s += `<path d="M${X(src) + 63} 115 C${X(src) + 63} 170 ${x + 100} 160 ${x + 100} 211" stroke="${D[c]}" stroke-width="2" fill="none" stroke-dasharray="6 5" opacity=".8"/>`;
  });
  s += R(0, 305, 1160, 92, { c: 'amb', fill: 'rgba(255,194,51,.07)', dash: true }) +
    T(20, 338, '⚠ `pre` execution is not supported for local action from \'./.github/actions/soi-moi-truong\'', { fs: 16, c: 'amb', mono: true }) +
    T(20, 372, 'pre: chỉ chạy với action TẢI VỀ (có sẵn trước bước 1). Action cục bộ chưa có trên đĩa lúc đó — runner bỏ qua và cảnh báo.', { fs: 16 });
  return sv(1160, 400, s);
};

/* ───────────── Slide 10 — thẻ v4 của actions/checkout đã dời bao nhiêu lần ───────────── */
const theDiDong = () => {
  let s = '';
  const X = (y) => 70 + (y - 2024.6) * 470; // năm thập phân
  s += line(X(2024.7), 120, X(2026.8), 120, 'dim', 3);
  [2025, 2026].forEach((y) => { s += line(X(y), 108, X(y), 132, 'dim', 2) + T(X(y), 152, String(y), { fs: 15, a: 'middle', c: 'dim', mono: true }); });
  const ev = [
    [2024.81, 'v4.2.2', '11bd719', 'tea', '23/10/2024'],
    [2025.61, 'v4.3.0', '08eba0b', 'tea', '11/08/2025'],
    [2025.87, 'v4.3.1', '34e1148', 'tea', '13/11/2025'],
    [2026.55, 'v4.4.0', '11d5960', 'red', '20/07/2026'],
  ];
  ev.forEach(([y, v, sha, c, d], i) => {
    s += dot(X(y), 120, c, 11) + T(X(y), 70 - (i % 2) * 0, v, { fs: 18, a: 'middle', b: true, c }) + T(X(y), 94, d, { fs: 13.5, a: 'middle', c: 'mu' }) + T(X(y), 182, sha, { fs: 14, a: 'middle', mono: true, c: 'mu' });
  });
  s += `<path d="M${X(2024.81)} 205 L${X(2025.61)} 205 L${X(2025.87)} 205 L${X(2026.55)} 205" stroke="${D.dk}" stroke-width="4" fill="none" stroke-dasharray="2 8" stroke-linecap="round"/>`;
  s += T(X(2025.7), 232, '4 lần dời gần nhất (tổng 15 bản v4.0.0 → v4.4.0) — tệp workflow của bạn không đổi một chữ', { fs: 16, a: 'middle', c: 'dk', b: true });
  s += R(0, 262, 1160, 118, { c: 'red', fill: 'rgba(255,92,108,.07)' }) +
    T(20, 294, 'v4.4.0 — ghi chú phát hành: “[BREAKING] backport allow-unsafe-pr-checkout to v4”', { fs: 17, b: true, c: 'red' }) +
    T(20, 324, 'GitHub (changelog 18/06/2026): “Workflows pinned to a floating major tag (e.g., actions/checkout@v4)', { fs: 15.5, c: 'mu' }) +
    T(20, 348, 'will automatically pick up the change.” — một bản vá bảo mật VÀ một thay đổi phá vỡ, cùng đi qua đường @v4.', { fs: 15.5, c: 'mu' });
  return sv(1160, 385, s);
};

/* ───────────── Slide 11 — vụ tj-actions/changed-files 03/2025 ───────────── */
const tjActions = () => {
  let s = '';
  const box2 = (x, y, w, h, c, a, b, cc) => R(x, y, w, h, { c, fill: '#0f182a' }) + T(x + 14, y + 30, a, { fs: 17, b: true, c }) + (b ? T(x + 14, y + 56, b, { fs: 14.5, c: 'mu' }) : '') + (cc ? T(x + 14, y + 80, cc, { fs: 14.5, c: 'mu' }) : '');
  s += box2(0, 10, 360, 100, 'red', '14/03/2025 · kẻ tấn công', 'commit độc 0e58ed8…', 'rồi DỜI các thẻ cũ trỏ vào nó');
  s += box2(400, 10, 360, 100, 'amb', 'workflow dùng thẻ bị dời', 'vd @v44.5.1 · @v35.7.7-sec · @v1.0.0', 'lần chạy kế tải mã độc');
  s += box2(800, 10, 360, 100, 'red', 'memdump.py (sudo)', 'đọc bộ nhớ Runner.Worker', 'in secret (base64) ra LOG');
  s += A(360, 60, 396, 60, { c: 'red' }) + A(760, 60, 796, 60, { c: 'red' });
  s += box2(0, 150, 560, 100, 'red', 'Kho công khai: log ai cũng đọc được', 'hơn 23.000 kho bị ảnh hưởng (theo advisory)', 'CVE-2025-30066 · GHSA-mrrh-fwg8-r2c3');
  s += box2(600, 150, 560, 100, 'grn', 'Ghim SHA của bản sạch: KHÔNG bị', 'thẻ dời thế nào thì SHA cũ vẫn là nội dung cũ', 'bản vá: v46.0.1');
  s += R(0, 285, 1160, 90, { c: 'dim', dash: true, fill: 'rgba(255,255,255,.03)' }) +
    T(580, 320, 'Bài học: “secret chỉ đưa cho bước đó” là ranh giới của BIẾN MÔI TRƯỜNG, không phải của bộ nhớ.', { fs: 17, a: 'middle', b: true }) +
    T(580, 350, 'Một bước chạy sudo trên runner GitHub đọc được mọi thứ runner đã nhận cho job.', { fs: 16, a: 'middle', c: 'mu' });
  return sv(1160, 380, s);
};

/* ───────────── Slide 17 — khoá của checkout nằm ở đâu: v4 vs v6+ ───────────── */
const khoaNamDau = () => {
  let s = '';
  s += T(280, 30, 'checkout @v4 (≤ v5)', { fs: 19, a: 'middle', b: true, c: 'amb' });
  s += R(40, 50, 480, 170, { c: 'amb', fill: '#0f182a' }) + T(60, 84, '.git/config (trong workspace)', { fs: 16, b: true, mono: true }) +
    T(60, 120, '[http "https://github.com/"]', { fs: 15, mono: true, c: 'mu' }) + T(80, 148, 'extraheader = AUTHORIZATION: basic ***', { fs: 15, mono: true, c: 'amb' }) +
    T(60, 196, 'action JS tự viết đọc .git/config: extraheader? true', { fs: 14.5, c: 'mu' });
  s += T(870, 30, 'checkout @v6 / @v7', { fs: 19, a: 'middle', b: true, c: 'tea' });
  s += R(630, 50, 480, 110, { c: 'tea', fill: '#0f182a' }) + T(650, 84, '.git/config', { fs: 16, b: true, mono: true }) +
    T(650, 116, 'includeIf.gitdir:…/.git.path =', { fs: 15, mono: true, c: 'mu' }) + T(670, 142, '$RUNNER_TEMP/git-credentials-….config', { fs: 14.5, mono: true, c: 'tea' });
  s += R(630, 200, 480, 80, { c: 'ora', fill: '#0f182a' }) + T(650, 232, '_temp/git-credentials-6083cfe7….config', { fs: 15, mono: true, b: true }) + T(650, 262, 'extraheader = AUTHORIZATION: basic ***', { fs: 15, mono: true, c: 'ora' });
  s += A(870, 162, 870, 196, { c: 'tea' });
  s += R(40, 300, 1070, 86, { c: 'red', fill: 'rgba(255,92,108,.07)' }) +
    T(575, 334, 'Chuyển chỗ ≠ biến mất: với v7, `git config --get http.https://github.com/.extraheader` vẫn trả 545 ký tự.', { fs: 16.5, a: 'middle', b: true }) +
    T(575, 364, 'v6+: tệp khoá nằm NGOÀI workspace — nén/tải lên cả thư mục làm việc không mang khoá theo. Muốn không có khoá: persist-credentials: false.', { fs: 15.5, a: 'middle', c: 'mu' });
  return sv(1160, 395, s);
};

/* ───────────── Slide 21 — công thức khoá cache của setup-node ───────────── */
const congThucKhoa = () => {
  let s = '';
  const parts = [['node-cache', 'dim', 'cố định'], ['Linux', 'blu', 'RUNNER_OS'], ['x64', 'tea', 'os.arch()'], ['npm', 'vio', 'cache:'], ['d94a99a0…3739622d', 'grn', 'hashFiles(cache-dependency-path)']];
  let x = 20;
  parts.forEach(([p, c, lb], i) => {
    const w = p.length * 13.2 + 34;
    s += R(x, 40, w, 60, { c, fill: '#0f182a', r: 9 }) + T(x + w / 2, 78, p, { fs: 21, a: 'middle', b: true, mono: true, c }) + T(x + w / 2, 128, lb, { fs: 14.5, a: 'middle', c: 'mu' });
    x += w + (i < parts.length - 1 ? 28 : 0);
    if (i < parts.length - 1) s += T(x - 15, 80, '-', { fs: 24, a: 'middle', b: true, c: 'mu' });
  });
  s += R(0, 165, 1160, 205, { c: 'dim', fill: 'rgba(255,255,255,.03)', dash: true });
  s += T(24, 200, 'hashFiles(a, b) = sha256( sha256(bytes của a) ‖ sha256(bytes của b) )   — theo thứ tự đã liệt kê', { fs: 17, mono: true });
  s += T(24, 240, 'src/cache-restore.ts:  const primaryKey = `${keyPrefix}-${fileHash}`', { fs: 16, mono: true, c: 'tea' });
  s += T(24, 282, 'outputs.cache-primary-key = node-cache-Linux-x64-npm-d94a99a05ccf72b4…', { fs: 15.5, mono: true, c: 'mu' });
  s += T(24, 310, 'hashFiles(\'ch04/app/package-lock.json\')          = d94a99a05ccf72b4…', { fs: 15.5, mono: true, c: 'grn' });
  s += T(24, 348, 'Khớp đủ 64 ký tự. Khoá “có sẵn” KHÔNG bí ẩn — nó tính được từ tệp.', { fs: 17, b: true, c: 'grn' });
  return sv(1160, 380, s);
};

export const slides = S([
  /* 1 */ cover({ t: 'Chương 4 — Action, và chuyện chạy mã của người khác', sub: 'uses: được giải ra thế nào · ghim thẻ hay SHA · checkout · setup-* · tự viết action', chap: 'CHƯƠNG 4' }),

  /* 2 */ { t: 'Bản đồ chương: mỗi uses: là mã lạ chạy dưới tên bạn', body: mindmap('uses:', 'tải kho của người khác về runner rồi chạy nó trong job của bạn', [
    { t: '4.1 Action là gì', d: 'JS · Docker · composite · INPUT_* · pre/main/post', c: 'dk' },
    { t: '4.2 Ghim phiên bản', d: '@v4 là con trỏ · SHA đầy đủ · tj-actions · Dependabot', c: 'red' },
    { t: '4.3 checkout', d: 'fetch-depth · khoá trong .git · persist-credentials', c: 'tea' },
    { t: '4.4 setup-*', d: 'tool cache · khoá cache = hashFiles · CRLF', c: 'grn' },
    { t: '4.5 Tự viết', d: 'composite trong repo · 9 bản chép trôi · → Ch12', c: 'vio' },
  ]) },

  /* ───── 4.1 ───── */
  /* 3 */ { t: 'Một dòng uses: đi qua 5 chặng trước khi chạy được', body: giaiUses() },

  /* 4 */ { t: 'Log “Set up job” cho thấy action tải về đâu và ghim vào SHA nào', body: two(
    t(['Prepare all required actions', 'Getting action download info', "Download action repository 'actions/checkout@v4'", '+   (SHA:11d5960a326750d5838078e36cf38b85af677262)', "Download action repository 'actions/checkout@3d3c42e…'", '+   (SHA:3d3c42e5aac5ba805825da76410c181273ba90b1)', "Download action repository 'actions/setup-node@8207627…'", '# docker:// được kéo NGAY đây, trước bước 1:', '3.20: Pulling from library/alpine'], 'log Set up job · run 36000261804', 14.5),
    t(['$ cd "$RUNNER_WORKSPACE/../_actions" && pwd', '/home/runner/work/_actions', '$ find . -maxdepth 3 -mindepth 3 -type d', './actions/checkout/3d3c42e5aac5ba80…', './actions/checkout/v4', './actions/setup-node/820762786026740c…', '$ sed -n \'/^runs:/,$p\' actions/checkout/v4/action.yml', 'runs:', '!  using: node20', '   main: dist/index.js', '   post: dist/index.js'], 'bước 3 · cùng job', 14.5)) +
    box('info', 'Mọi thẻ đều được đổi thành SHA <strong>lúc chạy</strong> — log ghi lại SHA thật. Muốn biết tuần trước <code>@v4</code> là mã nào: đọc dòng này trong log cũ.') },

  /* 5 */ { t: 'Ba loại action: JS chạy mọi nơi, Docker chỉ chạy Linux', body: table(['', 'JavaScript', 'Docker', 'composite'], [
    ['<code>runs.using</code>', '<code>node20</code> / <code>node24</code>', '<code>docker</code> (+ <code>image:</code>)', '<code>composite</code>'],
    ['Chạy ở đâu', '+Linux · macOS · Windows', '!CHỈ Linux', '+nơi các bước chạy được'],
    ['Chạy bằng gì', 'Node của runner (<code>externals/node24</code>)', 'container riêng, tự mang công cụ', 'shell của bạn — mỗi <code>run:</code> phải có <code>shell:</code>'],
    ['Khởi động', 'gần 0 giây', 'kéo/dựng ảnh MỖI job (alpine: 1 giây)', 'gần 0 giây'],
    ['pre / post', 'có', 'có (<code>pre-entrypoint</code>…)', '-không'],
    ['Đo trên macos-15', '+chạy', '-“Container action is only supported on Linux” → ✗', '+chạy'],
  ], { sm: true }) + box('warn', 'Docker trên macOS không báo lỗi rõ ràng: log ghi <em>skip pull</em>, rồi bước đỏ với <code>Value cannot be null. (Parameter \'container\')</code> — run 36000264372.') },

  /* 6 */ { t: 'Cây quyền: một action với tới đúng những gì job với tới', body: cayQuyen() },

  /* 7 */ { t: 'with: trở thành INPUT_*; gõ sai tên chỉ nhận một cảnh báo vàng', body: two(
    `${yaml([['- id: soi', ''], ['  uses: ./.github/actions/soi-moi-truong', 'action JS tự viết'], ['  with:', ''], ['    loi-nhan: xin chao', 'thành INPUT_LOI-NHAN'], ['- uses: actions/setup-node@8207… # v7.0.0', ''], ['  with:', ''], ["    node_version: '20'", 'gạch dưới: SAI tên']], { fs: 14.5 })}
     ${box('tip', 'actionlint bắt lỗi này với <code>@v4</code> (nó biết input của action phổ biến) nhưng <strong>im lặng</strong> với <code>@SHA</code>.')}`,
    t(['bien INPUT_* : INPUT_LOI-NHAN=xin chao  INPUT_SO-LAN=2', '# so-lan không truyền → nhận giá trị default', '', "! Unexpected input(s) 'node_version', valid inputs",
      "!   are ['node-version', 'node-version-file', …]", '# bước vẫn ✓ XANH, và cài node mặc định:', 'node: v22.23.2', '+ không phải 20 — sai im lặng, chỉ có cảnh báo'], 'run 36000261804', 14.5)) },

  /* 8 */ { t: 'pre → main → post: dựng xuôi, dọn NGƯỢC thứ tự', body: truocSau() },

  /* ───── 4.2 ───── */
  /* 9 */ { t: 'Kho api-backend: 21 lượt uses:, 21 ghim thẻ major, 0 ghim SHA', body: two(
    bars([
      { l: 'actions/checkout@v4', v: 7, txt: '7', c: 'blu' },
      { l: 'actions/setup-node@v4', v: 6, txt: '6', c: 'grn' },
      { l: 'docker/build-push-action@v6', v: 2, txt: '2', c: 'tea' },
      { l: 'actions/cache@v4', v: 2, txt: '2', c: 'amb' },
      { l: '4 action khác (@v3, @v4)', v: 4, txt: '4', c: 'vio' },
    ], { lw: 330 }),
    `${kpis([{ v: '21/21', l: 'ghim thẻ major', c: 'amb' }, { v: '0', l: 'ghim SHA', c: 'red' }, { v: '8', l: 'action khác nhau', c: 'blu' }])}
     ${box('info', 'Lệnh kiểm kê một dòng:<br><code>grep -ho "uses: *[^ ]*" .github/workflows/*.yml | sort | uniq -c</code>')}`) },

  /* 10 */ { t: '@v4 là con trỏ: 15 bản phát hành khác nhau, cùng một chữ “v4”', body: theDiDong() },

  /* 11 */ { t: 'tj-actions 03/2025: dời thẻ, hơn 23.000 kho bị ảnh hưởng', body: tjActions() },

  /* 12 */ { t: 'Bốn cách ghim: ai quyết định khi nào CI của bạn đổi?', body: table(['Viết', 'Là gì', 'Tự nhận bản vá', 'Tự nhận thay đổi phá vỡ', 'Kiểu tj-actions'], [
    ['<code>@main</code>', 'nhánh — mã mới nhất', '+có', '-có, bất cứ lúc nào', '-dính'],
    ['<code>@v4</code>', 'thẻ major, người bảo trì dời', '+có', '-có (v4.4.0 [BREAKING])', '-dính'],
    ['<code>@v4.4.0</code>', 'thẻ đầy đủ — “không đổi” theo quy ước', '-không', '+không', '!vẫn dính (thẻ dời được)'],
    ['<code>@11d5960…677262 # v4.4.0</code>', 'SHA 40 ký tự + chú thích', '-không (cần Dependabot)', '+không', '+không dính'],
  ], { sm: true }) + box('good', 'Mặc định nên dùng: <strong>SHA đầy đủ + chú thích phiên bản + Dependabot</strong>. Bot mở PR khi có bản mới; bạn đọc changelog rồi mới merge — thay vì người khác quyết định giùm.') },

  /* 13 */ { t: 'SHA phải đủ 40 ký tự — SHA ngắn bị từ chối ngay ở Set up job', body: two(
    t(['# job sha-ngan: uses: actions/checkout@3d3c42e', 'Prepare all required actions', 'Getting action download info', '! ##[error]Unable to resolve action', "!   `actions/checkout@3d3c42e`, the provided ref", "!   `3d3c42e` is the shortened version of a commit", '!   SHA, which is not supported. Please use the full', '!   commit SHA `3d3c42e5aac5ba805825da76410c181273ba90b1`'], 'run 36000264372 · job đỏ trong 3 giây', 14.5),
    `${yaml([['# ĐÚNG: SHA đầy đủ + phiên bản trong chú thích', ''], ['- uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1', ''], ['# Dependabot đọc chú thích này và sửa', ''], ['# CẢ SHA lẫn "# v7.0.1" trong PR cập nhật', '']], { fs: 13.5 })}
     ${box('warn', 'Vì sao cấm SHA ngắn: 7 ký tự chỉ là tiền tố — người khác có thể cố ý tạo một commit trùng tiền tố (kể cả trong một <strong>fork</strong>, vốn nhìn thấy được qua kho gốc). 40 ký tự thì không.')}`) },

  /* 14 */ { t: 'Ghim SHA chỉ bền khi có Dependabot cập nhật giùm', body: two(
    yaml([['# .github/dependabot.yml', ''], ['version: 2', ''], ['updates:', ''], ['  - package-ecosystem: github-actions', 'đọc mọi uses:'], ['    directory: /', 'gồm .github/workflows'], ['    schedule:', ''], ['      interval: weekly', 'một PR/tuần'], ['    groups:', ''], ['      actions:', 'gộp thành 1 PR'], ['        patterns: ["*"]', '']], { fs: 15 }),
    list([
      'Dependabot mở PR đổi <code>@SHA-cũ # v7.0.0</code> → <code>@SHA-mới # v7.0.1</code>, kèm ghi chú phát hành.',
      'Từ 08/2025, cài đặt Actions của kho/tổ chức có thể <strong>bắt buộc ghim SHA</strong> — workflow dùng thẻ sẽ bị chặn không chạy.',
      'Cũng từ đó: chặn hẳn một action/phiên bản bằng tiền tố <code>!</code> trong danh sách cho phép.',
      'Ghim action KHÔNG ghim thứ action tải về (Node, gói npm) — đó là việc của lockfile.',
    ])) },

  /* ───── 4.3 ───── */
  /* 15 */ { t: 'checkout mặc định: 1 commit, 0 thẻ — lịch sử phải xin thêm', body: two(
    t(['# fetch-depth: 1 (mặc định)', 'shallow        : true', 'so commit      : 1', 'so tag         : 0', 'nhanh          : * ch04-action  remotes/origin/ch04-action', 'HEAD = GITHUB_SHA = 9b06fcb3…', '$ git diff --stat origin/main...HEAD', "! fatal: ambiguous argument 'origin/main...HEAD'"], 'job mac-dinh · run 36000261745', 14.5),
    t(['# fetch-depth: 0', 'shallow   : false', 'so commit : 7', 'nhanh     : 9 nhanh o xa', '$ git diff --stat origin/main...HEAD', '+  12 files changed, 287 insertions(+)', '$ du -sh .git', '284K  .git'], 'job day-du · cùng run', 14.5)) +
    box('tip', 'Cần so với nhánh khác (<code>git diff</code>, changed-files), cần <code>git describe</code>, cần thẻ ⇒ <code>fetch-depth: 0</code> hoặc <code>filter: blob:none</code>. Chỉ dựng/kiểm ⇒ để mặc định.') },

  /* 16 */ { t: 'Một lần checkout đi qua những chặng nào — đọc từ log', body: diagram({
    w: 1160, h: 330,
    nodes: [
      { id: 'a', x: 0, y: 10, w: 210, h: 80, t: 'git init', d: 'xoá sạch workspace', c: 'dim' },
      { id: 'b', x: 235, y: 10, w: 210, h: 80, t: 'Setting up auth', d: 'GHI khoá vào git', c: 'amb' },
      { id: 'c', x: 470, y: 10, w: 210, h: 80, t: 'fetch --depth=1', d: '+9b06fcb:refs/…', c: 'tea' },
      { id: 'd', x: 705, y: 10, w: 210, h: 80, t: 'checkout -B', d: 'nhánh ch04-action', c: 'grn' },
      { id: 'e', x: 940, y: 10, w: 220, h: 80, t: 'persist?', d: 'true: để khoá lại', c: 'ora' },
      { id: 'f', x: 0, y: 210, w: 330, h: 90, t: 'các bước CỦA BẠN', d: 'mọi lệnh đọc được khoá\n(persist-credentials: true)', c: 'red' },
      { id: 'g', x: 420, y: 210, w: 330, h: 90, t: 'Post checkout', d: 'Removing credentials config\nsau bước cuối cùng', c: 'vio' },
      { id: 'h', x: 830, y: 210, w: 330, h: 90, t: 'persist-credentials: false', d: 'gỡ khoá NGAY trong checkout\n→ push: could not read Username', c: 'grn' },
    ],
    edges: [{ from: 'a', to: 'b' }, { from: 'b', to: 'c' }, { from: 'c', to: 'd' }, { from: 'd', to: 'e' }, { from: 'e', to: 'f', fs: 'b', ts: 't', t: 'true' }, { from: 'f', to: 'g' }, { from: 'e', to: 'h', fs: 'b', ts: 't', t: 'false' }],
  }) },

  /* 17 */ { t: 'Khoá của checkout: v4 ghi vào .git/config, v6+ ghi ra tệp riêng', body: khoaNamDau() },

  /* 18 */ { t: 'Bước sau đọc được khoá — permissions: là trần của nó', body: two(
    t(['$ h=$(git config --get-all http.https://github.com/.extraheader)', 'do dai header : 545 ky tu', '20 ky tu dau  : AUTHORIZATION: basic', '$ git push origin HEAD:refs/heads/ch04-thu-push', '! remote: Permission to cuonghoang1103/ga-san-tap.git', '!   denied to github-actions[bot].', '! fatal: … The requested URL returned error: 403'], 'job mac-dinh · permissions: contents: read', 14.5),
    t(['# persist-credentials: false', 'Removing credentials config', "  '/home/runner/work/_temp/git-credentials-f726….config'", '# ↑ ngay trong bước checkout, TRƯỚC bước của bạn', '$ git config --list | grep -i extraheader', '(khong co dong nao)', '$ git push origin HEAD:refs/heads/ch04-thu-push', "! fatal: could not read Username for 'https://github.com'"], 'job khong-khoa · cùng run', 14.5)) +
    box('good', 'Hai lớp, hai việc: <code>persist-credentials: false</code> để các bước sau <strong>không cầm</strong> khoá; <code>permissions: contents: read</code> để nếu cầm được thì khoá cũng <strong>không ghi</strong> được gì.') },

  /* 19 */ { t: 'Những tuỳ chọn của checkout đáng thuộc lòng', body: table(['Tuỳ chọn', 'Mặc định', 'Dùng khi'], [
    ['<code>fetch-depth</code>', '1', '<code>0</code> khi cần lịch sử/diff/thẻ'],
    ['<code>filter</code>', '(không)', '<code>blob:none</code>: đủ commit, nội dung tải khi cần'],
    ['<code>fetch-tags</code>', 'false', 'cần thẻ mà không cần toàn bộ lịch sử'],
    ['<code>persist-credentials</code>', '!true', '<code>false</code> trừ khi bước sau cần <code>git push</code>'],
    ['<code>ref</code>', 'commit kích hoạt (PR: merge commit)', 'dựng một nhánh/thẻ khác'],
    ['<code>path</code>', 'workspace', 'checkout nhiều kho trong một job'],
    ['<code>sparse-checkout</code>', '(toàn bộ cây)', 'kho lớn mà job chỉ cần <code>src/</code>'],
    ['<code>submodules</code>', 'false', '<code>true</code> / <code>recursive</code> — không thì thư mục RỖNG, không lỗi'],
    ['<code>allow-unsafe-pr-checkout</code>', '+false (từ 07/2026)', 'gần như không bao giờ — chặn “pwn request” ở <code>pull_request_target</code>'],
  ], { sm: true }) },

  /* ───── 4.4 ───── */
  /* 20 */ { t: 'setup-node: bản có sẵn mất 1 giây, bản phải tải mất 4–5 giây', body: two(
    t(["# node-version: 22", 'Found in cache @ /opt/hostedtoolcache/node/22.23.2/x64', 'node: v22.23.2 · npm: 10.9.8', 'tool cache co san : 22.23.2 24.21.0', '# run sau, ảnh runner khác (20260907.300.1):', 'tool cache co san : 22.23.2 24.20.0'], 'job cache-npm · bước 1 giây', 14.5),
    t(["# node-version: '20.10.0'", 'Attempting to download 20.10.0...', 'Acquiring 20.10.0 - x64 from https://github.com/', '  actions/node-versions/releases/download/…', 'Extracting ...', 'Adding to the cache ...', 'node: v20.10.0', '/opt/hostedtoolcache/node/20.10.0/x64/bin/node'], 'job tai-ve · bước 4–5 giây', 14.5)) +
    box('tip', 'Ghim <strong>major</strong> (<code>22</code>) hoặc <code>node-version-file: .nvmrc</code> ⇒ thường trúng tool cache. Ghim bản vá cũ (<code>20.10.0</code>) ⇒ tải mỗi lần. Ảnh runner đổi ⇒ “22” có thể thành bản vá khác tuần sau.') },

  /* 21 */ { t: 'Khoá cache của setup-node = hashFiles(lockfile) — tính được', body: congThucKhoa() },

  /* 22 */ { t: 'Tái lập khoá cũ của api-backend: Windows khác vì CRLF', body: table(['Job (run 32662461744)', 'Khoá trong log', 'Tính lại offline từ commit 6a121bac'], [
    ['Kiểm tra mã · Dựng Linux', '<code>node-cache-Linux-x64-npm-1271543c…</code>', '+hashFiles(desktop, frontend) = 1271543c… ✓'],
    ['Dựng macOS', '<code>node-cache-macOS-arm64-npm-1271543c…</code>', '+cùng hash — chỉ tiền tố đổi ✓'],
    ['Dựng Windows', '<code>node-cache-Windows-x64-npm-c7c75d0c…</code>', '!cùng tệp đổi \\n → \\r\\n rồi hash = c7c75d0c… ✓'],
    ['Thứ tự ngược (frontend, desktop)', '—', '-d216f380… ✗ thứ tự CÓ ý nghĩa'],
    ['Bài 4.4 cũ: băm package-lock.json ở GỐC', '—', '-sai tệp: YAML nói desktop/ + frontend/'],
  ], { sm: true }) + box('warn', 'Log chỉ in <strong>dòng đầu</strong> của một <code>with:</code> nhiều dòng (<code>cache-dependency-path: desktop/package-lock.json</code>). Đọc YAML thật ở đúng commit, đừng tin bản in trong log.') },

  /* 23 */ { t: 'Trượt thì lưu ở Post, trúng thì bỏ qua — và npm ci VẪN chạy', body: two(
    t(['# lần 1 (push) — run 36000264687', 'npm cache is not found', 'cache-hit = false', 'added 2 packages … in 815ms · real 0.911s', 'Post: Sent 362465 of 362465 (100.0%)', '+ Cache saved with the key: node-cache-Linux-x64-', '+   npm-d94a99a05ccf72b4…'], 'cache trượt → lưu', 14.5),
    t(['# lần 2 (dispatch) — run 36000590425', 'Cache hit for: node-cache-Linux-x64-npm-d94a99a…', 'Cache Size: ~0 MB (362465 B)', 'cache-hit = true', 'added 2 packages … in 786ms · real 0.856s', '= Cache hit occurred on the primary key …,', '=   not saving cache.'], 'cache trúng', 14.5)) +
    box('info', 'Thứ được cache là <code>~/.npm</code> (kho tải về), <strong>không phải</strong> <code>node_modules</code>. <code>npm ci</code> vẫn xoá và dựng lại <code>node_modules</code> — cache chỉ bỏ được phần tải qua mạng.') },

  /* 24 */ { t: 'Họ setup-*: phiên bản → tool cache → cache phụ thuộc', body: table(['Action', 'Khai phiên bản', 'Cache sẵn có', 'Thư mục được cache'], [
    ['<code>setup-node</code>', '<code>node-version</code> / <code>node-version-file</code>', '<code>cache: npm|yarn|pnpm</code>', '<code>~/.npm</code>, kho yarn/pnpm'],
    ['<code>setup-python</code>', '<code>python-version</code> / <code>-file</code>', '<code>cache: pip|pipenv|poetry</code>', '<code>~/.cache/pip</code>…'],
    ['<code>setup-java</code>', '<code>java-version</code> + <code>distribution</code>', '<code>cache: maven|gradle|sbt</code>', '<code>~/.m2</code>, <code>~/.gradle</code>'],
    ['<code>setup-go</code>', '<code>go-version</code> / <code>go-version-file</code>', 'BẬT sẵn (<code>cache: true</code>)', 'module + build cache'],
    ['<code>setup-dotnet</code>', '<code>dotnet-version</code>', '<code>cache: true</code>', 'gói NuGet'],
  ], { sm: true }) + box('tip', 'Cần điều khiển khoá (thêm OS, phiên bản, restore-keys riêng)? Dùng <code>actions/cache</code> tường minh — Chương 5.') },

  /* ───── 4.5 ───── */
  /* 25 */ { t: 'Bốn cách thôi chép, bốn kích cỡ', body: cards([
    { ic: '🧩', t: 'composite action', d: '<code>.github/actions/&lt;tên&gt;/action.yml</code> — gom <strong>các bước</strong>, gọi bằng <code>uses: ./…</code> trong một job.', c: 'blu' },
    { ic: '🔁', t: 'reusable workflow', d: '<code>on: workflow_call</code> — gom <strong>cả job</strong>, gọi bằng <code>uses:</code> ở mức job. Secret phải truyền tường minh.', c: 'vio' },
    { ic: '📜', t: 'script trong repo', d: '<code>scripts/x.sh</code> gọi từ một dòng <code>run:</code> — chạy được trên máy bạn, gỡ lỗi không cần push.', c: 'grn' },
    { ic: '📦', t: 'action JS / Docker riêng', d: 'Kho riêng, phát hành có thẻ, có test — khi nhiều kho cùng dùng. <strong>Chương 12</strong> dạy sâu.', c: 'amb' },
  ], 2) },

  /* 26 */ { t: 'Composite action trong chính repo: input vào, output ra', body: two(
    yaml([['# .github/actions/chao-ga/action.yml', ''], ['inputs:', ''], ['  ten: { required: true }', ''], ['outputs:', 'phải NỐI tay'], ['  loi-chao:', ''], ['    value: ${{ steps.ghep.outputs.loi-chao }}', 'id của bước bên trong'], ['runs:', ''], ['  using: composite', ''], ['  steps:', ''], ['    - id: ghep', ''], ['      shell: bash', 'BẮT BUỘC'], ['      env: { TEN: ${{ inputs.ten }} }', 'qua env, không nội suy'], ['      run: echo "loi-chao=Xin chao $TEN …" >> "$GITHUB_OUTPUT"', '']], { fs: 13.5 }),
    t(['# gọi: uses: ./.github/actions/chao-ga', '#      with: { ten: Cuong }', 'action_path = /home/runner/work/ga-san-tap/', '  ga-san-tap/./.github/actions/chao-ga', 'shell: /usr/bin/bash --noprofile --norc', '       -e -o pipefail {0}', '# bước sau đọc steps.chao.outputs.loi-chao:', '+ Xin chao Cuong tu composite action'], 'run 36000261759', 14)) },

  /* 27 */ { t: 'Action cục bộ chỉ tồn tại SAU checkout', body: two(
    t(['# job local-truoc-checkout (không có checkout)', 'Prepare all required actions', '# ↑ không than gì: action cục bộ không được tải trước', "! Can't find 'action.yml', 'action.yaml' or 'Dockerfile'", "!   under '/home/runner/work/ga-san-tap/ga-san-tap/", "!   .github/actions/chao-ga'. Did you forget to run", '!   actions/checkout before running your local action?'], 'run 36000264372', 14.5),
    list([
      '<code>uses: ./…</code> đọc từ <strong>đĩa của runner</strong> — phải có <code>actions/checkout</code> trước.',
      'Vì thế <code>pre:</code> của action cục bộ không bao giờ chạy (slide 8).',
      'Action ở kho khác (<code>owner/repo/path@ref</code>) thì được tải ở Set up job như mọi action khác.',
      'Composite không đọc được <code>secrets.*</code>: truyền vào qua <code>inputs</code> — tự nó thành tài liệu “action này cần gì”.',
    ])) },

  /* 28 */ { t: 'Chín bản chép một khối SSH đã trôi thành hai phiên bản', body: two(
    bars([
      { l: 'bản 3de67690', sub: 'không giữ kết nối', v: 7, txt: '7 workflow', c: 'amb' },
      { l: 'bản 57e5f9fc', sub: '+ ServerAliveInterval…', v: 2, txt: '2 workflow', c: 'grn' },
    ], { lw: 250 }),
    box('warn', 'Ai đó sửa lỗi SSH rớt ở hai workflow deploy rồi dừng. Bảy bản còn lại vẫn giữ hành vi cũ và <strong>không chỗ nào ghi</strong> chúng là bản chưa sửa. Một composite action <code>ssh-vps</code> = sửa một chỗ, chín nơi hưởng.') +
    box('tip', 'Luật ngón tay cái: 2 bản chép chưa phải là mẫu; ≥3 bản với một trục khác biệt thì gom. Gom quá sớm sinh ra action có 10 input.')) },

  /* 29 */ { t: 'Sai lầm hay gặp ở Chương 4', body: cards([
    { ic: '🏷', t: 'Tin @v4 là hằng số', d: '15 bản v4.x dưới cùng một chữ, bản cuối có [BREAKING]. Ghim SHA + Dependabot.', c: 'red' },
    { ic: '✂️', t: 'SHA ngắn', d: 'Bị từ chối: “shortened version of a commit SHA”. Dùng đủ 40 ký tự.', c: 'amb' },
    { ic: '🔑', t: 'Để khoá checkout nằm đó', d: 'Mọi bước sau đọc được. persist-credentials: false.', c: 'ora' },
    { ic: '⌨️', t: 'Gõ sai tên input', d: 'Chỉ một cảnh báo vàng, action dùng giá trị mặc định. Đọc action.yml.', c: 'vio' },
    { ic: '🐳', t: 'Docker action trong ma trận có macOS', d: 'Chỉ Linux. Chọn bản JS hoặc tách job.', c: 'blu' },
    { ic: '📁', t: 'uses: ./ trước checkout', d: '“Did you forget to run actions/checkout?”', c: 'pnk' },
  ], 3) },

  /* 30 */ { t: 'Bảng tra nhanh Chương 4', body: table(['Muốn', 'Viết / làm'], [
    ['Ghim action an toàn', '<code>uses: owner/repo@&lt;SHA 40 ký tự&gt; # vX.Y.Z</code> + Dependabot <code>github-actions</code>'],
    ['Biết @v4 đang là SHA nào', 'log “Download action repository … (SHA:…)” · <code>gh api repos/o/r/git/ref/tags/v4</code>'],
    ['Kiểm kê action đang dùng', '<code>grep -ho "uses: *[^ ]*" .github/workflows/*.yml | sort | uniq -c</code>'],
    ['Không để khoá lại cho bước sau', '<code>persist-credentials: false</code> + <code>permissions: contents: read</code>'],
    ['Có lịch sử để diff', '<code>fetch-depth: 0</code> hoặc <code>filter: blob:none</code>'],
    ['Node đúng dự án', '<code>node-version-file: .nvmrc</code> · <code>cache: npm</code>'],
    ['Đoán khoá cache', '<code>node-cache-&lt;OS&gt;-&lt;arch&gt;-npm-</code> + <code>hashFiles(các lockfile, đúng thứ tự)</code>'],
    ['Gom các bước lặp', '<code>.github/actions/x/action.yml</code>, <code>using: composite</code>, mỗi <code>run:</code> có <code>shell:</code>'],
    ['Kiểm trước khi push', '<code>actionlint</code> (bắt tên input sai khi dùng thẻ đã biết)'],
  ], { sm: true }) },

  /* 31 */ { t: 'Thực hành Chương 4 (45 phút) trên kho của chính bạn', body: two(list([
    '<strong>1.</strong> Kiểm kê <code>uses:</code> của kho bạn; tra SHA hiện tại của từng thẻ bằng <code>gh api …/git/ref/tags/vN</code>.',
    '<strong>2.</strong> Đổi một action sang SHA đầy đủ + <code># vX.Y.Z</code>; push; tìm dòng “Download action repository” khớp SHA.',
    '<strong>3.</strong> Thêm bước in <code>git config --get-all http.https://github.com/.extraheader | cut -c1-20</code>, rồi bật <code>persist-credentials: false</code> và chạy lại.',
    '<strong>4.</strong> Bật <code>cache: npm</code>; chạy 2 lần; so <code>cache-primary-key</code> với <code>hashFiles(\'package-lock.json\')</code>.',
    '<strong>5.</strong> Chuyển 2–3 bước lặp thành composite trong <code>.github/actions/</code>, có 1 input và 1 output.',
  ]), box('good', '<strong>Đạt khi</strong> bạn có: 1 action ghim SHA chạy xanh; log chứng minh khoá có rồi mất; hai run cache (false → true) với khoá = hashFiles; một composite trả output đọc được ở bước sau.<br><br>Soi: <code>gh run view &lt;id&gt; --log | grep -E "Download action|Cache|extraheader"</code>.')) },
]);
