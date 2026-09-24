/**
 * GitHub Actions · Deck ga-01 — Chương 1: Tệp workflow, và những cái bẫy tới từ YAML.
 *
 * MỌI log/output trên slide là THẬT, chạy 24/09/2026:
 *   • runner GitHub: ubuntu-24.04 (image 20260907.300.1), runner 2.337.0 — sân tập công khai
 *     github.com/cuonghoang1103/ga-san-tap, nhánh ch01-workflow (+ ch01-pr-bao-cao, ch01-pr-xung-dot, ch01-khac),
 *     PR #1 và #2 (đã đóng), cron ch01-cron.yml trên main (đã TẮT sau khi đo).
 *   • PyYAML 6.0.3 (python:3.12-alpine), yq v4.53.6, actionlint 1.7.12 — chạy trong container trên Mac M1.
 *   • Số liệu kho api-backend: 14 workflow trong .github/workflows, lịch sử run của vps-cleanup-weekly.yml qua API.
 */
import { S, cover, cards, box, steps, table, two, list, mindmap, term, diagram, yaml, pipe, bars, flow, kpis, sv, R, T, A, D, esc } from './_ga-chung.mjs';

export const deck = { key: 'ga-01', code: 'GITHUB ACTIONS · CHƯƠNG 1', title: 'Tệp workflow và bẫy YAML', sub: 'GitHub Actions · Chương 1' };

/** chữ terminal 14.5px: log của runner có dấu thời gian dài. */
const TCSS = '<style>.g-term pre{font-size:14.5px;line-height:1.42}</style>';
const t = (lines, title, fs) => term(lines, { title, dir: '~/ga-san-tap', fs });

/* ───────────── Slide 4 — một push đi qua những đâu (số đo thật, run 35987243212) ───────────── */
const hanhTrinh = () => {
  const box = (x, y, w, h, c, head, lines, time) =>
    R(x, y, w, h, { c, fill: '#0f182a' }) + T(x + 16, y + 30, head, { fs: 18, b: true }) +
    lines.map((l, i) => T(x + 16, y + 56 + i * 22, l, { fs: 14.5, c: 'mu' })).join('') +
    (time ? T(x + w - 14, y + 30, time, { fs: 14.5, c, a: 'end', b: true, mono: true }) : '');
  let s = '';
  s += box(0, 0, 360, 128, 'tea', '① git push', ['commit ed08af5 lên nhánh', 'ch01-workflow', 'git gửi commit tới github.com'], '10:26:35');
  s += box(400, 0, 360, 128, 'dk', '② sự kiện push', ['ref = refs/heads/ch01-workflow', 'kèm sha, người push (payload)', 'GitHub ghi nhận, chưa chạy gì'], '');
  s += box(800, 0, 350, 128, 'vio', '③ workflow nào khớp?', ['đọc .github/workflows/*.yml', 'TẠI commit đó, xét on: từng file', '⇒ 2 / 6 workflow khớp'], '');
  s += box(800, 196, 350, 128, 'amb', '④ run + job xếp hàng', ['run 35987243212 được tạo', 'job “xem” chờ một máy', '+2 s sau push · status: queued'], '10:26:37');
  s += box(400, 196, 360, 128, 'grn', '⑤ runner nhận job', ['máy ảo MỚI ubuntu-24.04', 'GitHub Actions 1000004248', '+5 s · image 20260907.300.1'], '10:26:40');
  s += box(0, 196, 360, 128, 'blu', '⑥ steps + log', ['checkout → setup-node → run', 'job xong ✓ · run xong 10:26:45', 'log giữ lại để đọc bằng gh'], '10:26:44');
  s += A(360, 64, 396, 64, { c: 'tea' }) + A(760, 64, 796, 64, { c: 'dk' }) + A(975, 128, 975, 192, { c: 'vio' }) +
    A(800, 260, 764, 260, { c: 'amb' }) + A(400, 260, 364, 260, { c: 'grn' });
  s += R(0, 356, 1150, 64, { c: 'dim', fill: 'rgba(255,255,255,.03)', dash: true }) +
    T(575, 395, 'Từ lúc push tới lúc có dấu ✓: 10 giây — 2 s tạo run, 3 s chờ máy, 4 s chạy các bước, 1 s chốt run', { fs: 17, a: 'middle' });
  return sv(1150, 424, s);
};

/* ───────────── Slide 14 — 14 lần chạy cron '0 3 * * 0' của api-backend (trễ, phút) ───────────── */
const CRON_KHO = [
  ['21/06', 268], ['28/06', 237], ['05/07', 213], ['12/07', 168], ['19/07', 163], ['26/07', 172], ['02/08', 168],
  ['09/08', 71], ['16/08', 40], ['23/08', 42], ['30/08', 346], ['06/09', 267], ['13/09', 291], ['20/09', 308],
];
const cronKho = () => {
  const X0 = 70, bw = 60, gap = 17, H = 300, M = 360;
  let s = '';
  [0, 60, 120, 180, 240, 300, 360].forEach((m) => {
    const y = 20 + H - (m / M) * H;
    s += `<line x1="${X0 - 6}" y1="${y}" x2="1150" y2="${y}" stroke="#1d2a40" stroke-width="1"/>` + T(X0 - 12, y + 5, `${m / 60}h`, { fs: 14, a: 'end', c: 'dim', mono: true });
  });
  CRON_KHO.forEach(([d, m], i) => {
    const x = X0 + i * (bw + gap), h = (m / M) * H, y = 20 + H - h;
    const c = m >= 240 ? 'red' : m >= 120 ? 'amb' : 'grn';
    s += `<rect x="${x}" y="${y}" width="${bw}" height="${h}" rx="6" fill="${D[c]}" opacity=".85"/>` +
      T(x + bw / 2, y - 8, `${Math.floor(m / 60)}h${String(m % 60).padStart(2, '0')}`, { fs: 13.5, a: 'middle', mono: true }) +
      T(x + bw / 2, 20 + H + 22, d, { fs: 13.5, a: 'middle', c: 'mu', mono: true });
  });
  s += `<line x1="${X0 + 10 * (bw + gap) - gap / 2}" y1="10" x2="${X0 + 10 * (bw + gap) - gap / 2}" y2="${20 + H}" stroke="${D.amb}" stroke-width="2" stroke-dasharray="6 5"/>` +
    T(X0 + 10 * (bw + gap) - gap / 2 - 8, 26, 'bài cũ đo tới đây ▸', { fs: 14, c: 'amb', a: 'end' });
  return sv(1150, 350, s);
};

/* ───────────── Slide 15 — cron mỗi 5 phút trên sân tập (đo thật 24/09/2026, UTC) ───────────── */
const cronSanTap = () => {
  const t0 = 15, t1 = 105, X = (m) => 40 + ((m - t0) / (t1 - t0)) * 1070; // phút sau 10:00
  let s = `<line x1="${X(t0)}" y1="120" x2="${X(t1)}" y2="120" stroke="${D.bd}" stroke-width="3"/>`;
  for (let m = 20; m <= 105; m += 5) {
    s += `<circle cx="${X(m)}" cy="120" r="9" fill="#0b1322" stroke="${D.mu}" stroke-width="2.5"/>`;
    if (m % 15 === 0) s += T(X(m), 160, `${10 + Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`, { fs: 14, a: 'middle', c: 'dim', mono: true });
  }
  s += `<circle cx="${X(15.8)}" cy="120" r="10" fill="${D.dk}"/>` + T(X(15.8), 88, 'push file lên main 10:15:48', { fs: 14.5, c: 'dk' });
  s += `<circle cx="${X(50)}" cy="120" r="13" fill="none" stroke="${D.amb}" stroke-width="4"/>` + T(X(50), 205, 'mốc timezone: 17:50 giờ VN = 10:50 UTC', { fs: 15, a: 'middle', c: 'amb' }) + A(X(50), 188, X(50), 138, { c: 'amb', sw: 2.5 });
  s += `<circle cx="${X(68.4)}" cy="120" r="12" fill="${D.grn}"/>` + T(X(68.4), 88, 'bấm tay 11:08:25 → chạy ngay', { fs: 14.5, c: 'grn', a: 'middle' });
  s += T(X(t1), 205, '○ = mốc */5 không có lần chạy nào', { fs: 15, a: 'end', c: 'mu' });
  return sv(1150, 220, s);
};

/* ───────────── Slide 19 — đồ thị commit của PR #1 (sha thật) ───────────── */
const mergeGraph = () => {
  const dot = (x, y, c, sha, lbl, sub) => `<circle cx="${x}" cy="${y}" r="15" fill="#0b1322" stroke="${D[c]}" stroke-width="4"/>` +
    T(x, y - 28, sha, { fs: 16, a: 'middle', b: true, mono: true, c }) + T(x, y + 40, lbl, { fs: 15, a: 'middle' }) + (sub ? T(x, y + 62, sub, { fs: 13.5, a: 'middle', c: 'mu' }) : '');
  let s = '';
  s += `<path d="M110 200 L420 90" stroke="${D.dk}" stroke-width="4" fill="none"/><path d="M110 200 L420 310" stroke="${D.tea}" stroke-width="4" fill="none"/>`;
  s += `<path d="M420 90 L800 200" stroke="${D.amb}" stroke-width="4" fill="none" stroke-dasharray="9 6"/><path d="M420 310 L800 200" stroke="${D.amb}" stroke-width="4" fill="none" stroke-dasharray="9 6"/>`;
  s += dot(110, 200, 'mu', 'b7d67dd', 'điểm rẽ nhánh', '');
  s += dot(420, 90, 'dk', '93c3050', 'nhánh gốc ch01-workflow', 'đổi calc(a,b) → calc({a,b}) · CI ✓');
  s += dot(420, 310, 'tea', 'e1459aa', 'nhánh PR ch01-pr-bao-cao', 'chỉ THÊM file mới · CI ✓');
  s += dot(800, 200, 'amb', '0815f9a', 'refs/pull/1/merge', 'không nằm trên nhánh nào');
  s += R(900, 140, 250, 120, { c: 'red', fill: 'rgba(255,92,108,.08)' }) + T(1025, 182, 'CI ✗ trên 0815f9a', { fs: 18, a: 'middle', b: true, c: 'red' }) +
    T(1025, 210, 'tongDon(10,20) = NaN', { fs: 15, a: 'middle', mono: true }) + T(1025, 236, 'GITHUB_SHA = cái này', { fs: 14.5, a: 'middle', c: 'mu' });
  s += A(830, 200, 894, 200, { c: 'red' });
  s += T(610, 125, '^1', { fs: 16, c: 'amb', b: true, mono: true }) + T(610, 290, '^2', { fs: 16, c: 'amb', b: true, mono: true });
  return sv(1150, 400, s);
};

export const slides = S([
  /* 1 */ cover({ t: 'Chương 1 — Tệp workflow, và những cái bẫy tới từ YAML', sub: 'giải phẫu một workflow · on: · cron · merge commit của pull_request · bộ lọc branches/paths', chap: 'CHƯƠNG 1' }),

  /* 2 */ { t: 'Bản đồ chương: 5 câu hỏi, 5 bài', body: mindmap('Tệp workflow', 'đọc đúng ⇒ biết nó chạy KHI NÀO, TRÊN GÌ', [
    { t: '1.1 Nó là YAML', d: 'giải phẫu file · on: thành True · 18.20 thành 18.2 · run: &gt;', c: 'dk' },
    { t: '1.2 Cái gì khởi động', d: 'push · pull_request · dispatch · schedule — và vì sao deploy thôi tự động', c: 'tea' },
    { t: '1.3 schedule', d: 'cron chạy theo UTC và luôn TRỄ — đo thật', c: 'amb' },
    { t: '1.4 Merge commit', d: 'pull_request chạy trên commit không nằm trên nhánh nào', c: 'red' },
    { t: '1.5 Bộ lọc', d: 'branches / paths: * khác **, và ô kiểm treo mãi', c: 'vio' },
  ]) },

  /* ───── 1.1 ───── */
  /* 3 */ { t: 'Giải phẫu một file workflow: 8 khoá là đủ đọc mọi file', body: yaml([
    ['name: ch01 giai phau', 'tên hiện ở tab Actions'],
    ['on:', 'KHI NÀO chạy — danh sách sự kiện'],
    ['  push:', 'có commit được push…'],
    ['    branches: [ch01-workflow]', '…lên ĐÚNG nhánh này (bộ lọc)'],
    ['  workflow_dispatch:', 'thêm nút “Run workflow”'],
    ['jobs:', 'CHẠY GÌ — một hay nhiều job'],
    ['  xem:', 'id của job, bạn tự đặt'],
    ['    runs-on: ubuntu-latest', 'xin một máy ảo MỚI tinh'],
    ['    steps:', 'các bước, chạy LẦN LƯỢT'],
    ['      - uses: actions/checkout@v7', 'dùng action có sẵn: tải mã về máy'],
    ['      - uses: actions/setup-node@v7', 'action cài Node…'],
    ['        with:', '…tham số truyền cho action'],
    ["          node-version: '22'", 'ĐẶT NHÁY — lý do ở slide 6'],
    ['      - name: Ai kich hoat toi', 'tên bước hiện trong log'],
    ['        run: |', 'lệnh shell (bash), giữ xuống dòng'],
    ['          echo "sha : $GITHUB_SHA"', 'biến GitHub cấp sẵn cho mọi bước'],
  ], { fs: 15.5 }) },

  /* 4 */ { t: 'Một lần push đi qua 6 chặng — đo thật: 10 giây', body: hanhTrinh() },

  /* 5 */ { t: 'Khoá on: bị PyYAML đọc thành True — yq thì không', body: two(
    t(['$ python p.py        # trong container', 'PyYAML 6.0.3  (YAML 1.1)', "khoa cap tren: [('name', 'str'),", "  (True, 'bool'), ('jobs', 'str')]", "+ d.get('on') = None", "d[True]     = {'push': {'branches': ['main']}}", "country: NO   -> False  bool"], 'PyYAML — YAML 1.1', 17),
    t(['$ yq keys thu.yml     # trong container', 'yq v4.53.6  (YAML 1.2)', '- name', '= - on', '- jobs', 'country: NO   -> NO  (!!str)', '# GitHub tự xử lý on: — công cụ CỦA BẠN thì không'], 'yq — YAML 1.2', 17)) + box('info', 'YAML 1.1 coi <code>on</code>, <code>yes</code>, <code>NO</code> là boolean; YAML 1.2 thì không. Nhưng CẢ HAI vẫn đọc <code>18.20</code> là số thực <code>!!float</code> — bẫy ở slide sau không phiên bản YAML nào cứu.') },

  /* 6 */ { t: 'node-version: 18.20 không nháy ⇒ runner cài Node 18.2.0 (2022)', body: two(
    t(['# job khong-nhay:  node-version: 18.20', 'Run actions/setup-node@v7', 'with:', '! node-version: 18.2', 'Attempting to download 18.2...', 'Acquiring 18.2.0 - x64 from …', '$ node --version', '! v18.2.0'], 'run 35986150275 · job khong-nhay', 17),
    t(["# job co-nhay:  node-version: '18.20'", 'Run actions/setup-node@v7', 'with:', '= node-version: 18.20', 'Attempting to download 18.20...', 'Acquiring 18.20.8 - x64 from …', '$ node --version', '= v18.20.8'], 'run 35986150275 · job co-nhay', 17)) + box('warn', 'Không có lỗi nào: 18.2.0 là một phiên bản CÓ THẬT, nên setup-node cài nó vui vẻ. Cùng bẫy: <code>python-version: 3.10</code> → 3.1. Và actionlint 1.7.12 KHÔNG bắt được (đo ở slide 8).') },

  /* 7 */ { t: 'run: > gập hai lệnh thành MỘT, lệnh thứ hai biến mất', body: two(
    yaml([['- name: run voi dau |', ''], ['  run: |', 'giữ xuống dòng'], ['    echo mot', ''], ['    echo hai', ''], ['- name: run voi dau >', ''], ['  run: >', 'GẬP thành dấu cách'], ['    echo mot', ''], ['    echo hai', '']], { fs: 16 }),
    t(['# bước dùng |', 'Run echo mot', '= mot', '= hai', '', '# bước dùng >', '! Run echo mot echo hai', '! mot echo hai', '# thoát 0 → bước XANH, không ai biết'], 'run 35986150275 · job gap-dong', 17)) + box('tip', '<code>|</code> cho mọi khối <code>run:</code>. <code>&gt;</code> chỉ dành cho văn xuôi dài (một <code>description</code>). Log in dòng <code>Run echo mot echo hai</code> — đó là chỗ duy nhất lộ ra.') },

  /* 8 */ { t: 'actionlint bắt 4 lỗi trước push — GitHub báo 1, sau push', body: two(
    t(['$ docker run --rm -v "$PWD":/repo -w /repo \\', '    rhysd/actionlint:latest -no-color', '! ch01-hong.yml:6:3: "steps" section is missing', '!   in job "build" [syntax-check]', '! 8:5: unexpected key "step" for "job"', '! 10:3: job "deploy" needs job "biuld"', '!   which does not exist [job-needs]', '! 14:23: "github.event.pull_request.title"', '!   is potentially untrusted [expression]', '# node-version: 18.20 → KHÔNG bị bắt'], 'actionlint 1.7.12 · trên Mac'),
    `${t(['$ git push   # run 35986887824', '! X .github/workflows/ch01-hong.yml', '! This run likely failed because of', '!   a workflow file issue.', '', 'Invalid workflow file:', '! (Line: 8, Col: 5): Unexpected value \'step\''], 'tab Actions · sau 1 vòng push')}
     ${box('warn', 'Tên run là <b>đường dẫn file</b>, không phải <code>name:</code> — vì GitHub không đọc nổi file để lấy tên.')}`)
  },

  /* ───── 1.2 ───── */
  /* 9 */ { t: 'Kho api-backend: 14 workflow, chỉ 1 cái chạy khi push', body: `${bars([
      { l: 'chỉ workflow_dispatch', sub: 'deploy, restart, chẩn đoán SSH…', v: 12, c: 'blu' },
      { l: 'schedule + dispatch', sub: 'vps-cleanup-weekly.yml', v: 1, c: 'amb' },
      { l: 'push + pull_request + dispatch', sub: 'ci-lint.yml', v: 1, c: 'grn' },
    ], { lw: 380 })}
    ${two(list([
      '<code>ci-lint.yml</code> — workflow DUY NHẤT tự chạy theo mã: kiểm kiểu khi PR/push vào <code>main</code>',
      '<code>vps-cleanup-weekly.yml</code> — cron Chủ nhật 03:00 UTC dọn đĩa VPS',
    ]), list([
      '12 cái còn lại chỉ chạy khi NGƯỜI bấm (hoặc <code>gh workflow run</code>)',
      'Đếm bằng PyYAML (tra cả <code>d[True]</code>!) trên <code>.github/workflows</code>, 24/09/2026',
    ]))}` },

  /* 10 */ { t: 'Deploy thôi tự động vì hai workflow từng đua nhau', body: `${flow([
    { e: '📦', t: 'push vào main', d: 'deploy-ghcr.yml VÀ backend-vps.yml cùng nổ', c: 'blu' },
    { e: '💥', t: '03/07/2026', d: 'bảng tin 500: lược đồ DB tụt sau ảnh mới', c: 'red' },
    { e: '☠️', t: '06/07/2026', d: 'tạo lại backend đua nhau ⇒ Exited(137) + container mồ côi', c: 'red' },
    { e: '🔘', t: 'sau đó', d: 'cả hai chỉ còn workflow_dispatch', c: 'grn' },
  ])}
  ${box('tip', '<b>Bộ kích hoạt là CHÍNH SÁCH:</b> “chạy khi push” = “ai push được thì khởi động được”. Nếu job đụng production, câu đó đọc là “ai push được thì deploy được”.')}` },

  /* 11 */ { t: 'Sáu bộ kích hoạt bạn sẽ gặp trong 90% workflow', body: cards([
    { ic: '📤', t: 'push', d: 'commit tới nhánh/tag. Lọc: <code>branches</code>, <code>tags</code>, <code>paths</code>', c: 'blu' },
    { ic: '🔀', t: 'pull_request', d: 'PR mở/cập nhật/mở lại. Chạy trên <strong>merge commit</strong> (bài 1.4)', c: 'tea' },
    { ic: '🔘', t: 'workflow_dispatch', d: 'nút Run workflow + <code>inputs</code> có kiểu. Cách deploy có chủ đích', c: 'grn' },
    { ic: '⏰', t: 'schedule', d: 'cron, mặc định UTC, chỉ trên nhánh mặc định, luôn trễ (bài 1.3)', c: 'amb' },
    { ic: '⛓', t: 'workflow_run', d: 'khi workflow khác XONG — nối test → deploy mà không gộp file', c: 'vio' },
    { ic: '🏷', t: 'release · issues · …', d: 'hàng chục sự kiện khác, mỗi cái một bộ <code>types</code> riêng', c: 'pnk' },
  ]) },

  /* 12 */ { t: 'pull_request mặc định chỉ nổ với 3 loại hoạt động', body: two(
    yaml([['on:', ''], ['  pull_request:', 'không ghi types…'], ['    branches: [main]', '…= opened, synchronize, reopened'], ['', ''], ['on:', ''], ['  pull_request:', ''], ['    types: [opened]', 'CHỈ lần mở đầu tiên!'], ['', 'push thêm commit ⇒ KHÔNG chạy lại']], { fs: 16 }),
    table(['Hoạt động trên PR', 'Mặc định?'], [
      ['opened — mở PR', '✅'], ['synchronize — push commit mới', '✅'], ['reopened — mở lại', '✅'],
      ['labeled — gắn nhãn', '❌'], ['ready_for_review — hết nháp', '❌'], ['edited — sửa tiêu đề', '❌'],
    ], { sm: true })) },

  /* 13 */ { t: 'workflow_dispatch: một nút, một biểu mẫu — và bẫy boolean', body: two(
    yaml([['on:', ''], ['  workflow_dispatch:', ''], ['    inputs:', 'thành ô trên giao diện'], ['      moi_truong:', ''], ['        type: choice', 'ô thả xuống'], ['        options: [staging, production]', ''], ['      bo_qua_test:', ''], ['        type: boolean', 'ô tích'], ['        default: false', '']], { fs: 16 }),
    `${table(['Tệp workflow nằm ở đâu', 'Có chạy?'], [
      ['push / pull_request: file trên CHÍNH nhánh đó', '✅'],
      ['schedule: file chỉ trên nhánh tính năng', '❌ không bao giờ'],
      ['dispatch: file chưa từng lên nhánh mặc định', '❌ HTTP 404 “not found on the default branch”'],
      ['push bằng GITHUB_TOKEN', '❌ không kích hoạt tiếp'],
    ], { sm: true })}
    ${box('warn', '<code>github.event.inputs.bo_qua_test</code> là CHUỖI: <code>\'false\'</code> vẫn ĐÚNG ⇒ bước chạy. <code>inputs.bo_qua_test</code> giữ boolean thật ⇒ bước bị bỏ qua. Đo: run 35987558284.')}`) },

  /* ───── 1.3 ───── */
  /* 14 */ { t: 'Cron 03:00 UTC Chủ nhật: 14 lần, KHÔNG lần nào đúng giờ', body: `${cronKho()}
    <p style="text-align:center;font-size:16px;color:${D.mu};margin-top:4px">vps-cleanup-weekly.yml của api-backend · cột = số giờ TRỄ so với 03:00 UTC · xu hướng “tốt dần” của tháng 8 đã đảo chiều</p>` },

  /* 15 */ { t: 'Cron */5 mới tạo trên sân tập: 90 phút, 0 lần chạy theo lịch', body: `${cronSanTap()}
    ${kpis([{ v: '18', l: 'mốc */5 đã qua (10:20 → 11:45 UTC)', c: 'blu' }, { v: '0', l: 'lần chạy theo lịch — kể cả mốc timezone 10:50', c: 'red' }, { v: '1', l: 'bấm tay 11:08:25 → run 35991278091 chạy ngay', c: 'grn' }])}` },

  /* 16 */ { t: 'Cron tính theo UTC; muốn giờ Việt Nam thì trừ 7', body: two(
    table(['Bạn viết', 'Chạy lúc (giờ VN)'], [
      ["<code>'0 0 * * *'</code>", '07:00'], ["<code>'0 3 * * 0'</code>", '10:00 Chủ nhật'],
      ["<code>'0 17 * * *'</code>", '00:00 hôm SAU'], ["<code>'0 20 * * *'</code>", '03:00 hôm sau'],
      ["<code>'*/5 * * * *'</code>", '“mỗi 5 phút” — trên giấy'],
    ], { sm: true }),
    `${yaml([['on:', ''], ['  schedule:', ''], ["    - cron: '50 17 * * *'", '17:50…'], ["      timezone: 'Asia/Ho_Chi_Minh'", '…giờ VN = 10:50 UTC']], { fs: 16 })}
     ${box('info', 'Khoá <code>timezone:</code> (tên múi giờ IANA) có trong tài liệu GitHub, tính đến 09/2026. Không ghi thì là UTC. Đã thử trên sân tập: GitHub nhận tệp, nhưng trong 90 phút đo chưa có lần chạy nào để quan sát.')}`) },

  /* 17 */ { t: 'schedule trả lời “đại khái hằng tuần”, không trả lời “lúc 03:00”', body: cards([
    { ic: '⛔', t: 'Đừng hẹn giờ cho việc cần đúng giờ', d: '“đăng bài lúc 09:00” — hãy chạy NGAY khi thứ đó sẵn sàng', c: 'red' },
    { ic: '🔔', t: 'Báo động theo SỰ VẮNG MẶT', d: '“chưa chạy suốt 8 ngày” thay vì “chưa xong trước 04:00”', c: 'amb' },
    { ic: '⛓', t: 'Đừng nối hai cron', d: '“A 03:00, B 04:00, B cần A” là tung đồng xu — dùng <code>workflow_run</code>', c: 'vio' },
    { ic: '🔘', t: 'Luôn kèm workflow_dispatch', d: 'lịch trễ 5 tiếng mà cần ngay ⇒ bấm nút', c: 'grn' },
    { ic: '🔁', t: 'Job phải chạy lại được', d: 'chạy 03:00 hay 08:46 cũng cho cùng kết quả', c: 'tea' },
    { ic: '💤', t: '60 ngày im ⇒ bị TẮT', d: 'kho công khai không hoạt động 60 ngày: GitHub tự tắt cron', c: 'blu' },
  ]) },

  /* 18 */ { t: 'Cron trên nhánh tính năng: không chạy, không báo lỗi', body: two(
    yaml([['# .github/workflows/ch01-cron-nhanh.yml', ''], ['# CHỈ nằm trên nhánh ch01-workflow', ''], ['on:', ''], ['  schedule:', ''], ["    - cron: '*/5 * * * *'", 'mỗi 5 phút?']], { fs: 16 }),
    t(['$ gh run list -w "ch01 cron tren nhanh"', '! could not find any workflows named', '!   ch01 cron tren nhanh', '$ gh api …/workflows/ch01-cron.yml -q .state', '= active      # bản trên main: GitHub CÓ đăng ký', '# bản trên nhánh: GitHub KHÔNG biết nó tồn tại'], 'gh CLI · sân tập')) },

  /* ───── 1.4 ───── */
  /* 19 */ { t: 'pull_request chạy trên commit THỨ BA — không phải nhánh bạn', body: `${mergeGraph()}
    <p style="text-align:center;font-size:16px;color:${D.mu}">PR #1 trên sân tập: GitHub tự tạo <code>0815f9a</code> “Merge e1459aa into 93c3050” rồi chạy CI trên nó</p>` },

  /* 20 */ { t: 'Hai nhánh xanh, gộp sạch — lần chạy pull_request ĐỎ', body: `${pipe({ w: 1150, h: 250, cols: [
    [{ n: 'push·gốc', s: 'ok', d: '93c3050' }, { n: 'push·PR', s: 'ok', d: 'e1459aa' }],
    [{ n: 'PR·merge', s: 'fail', d: '0815f9a' }],
  ], needs: [['push·gốc', 'PR·merge'], ['push·PR', 'PR·merge']] })}
    ${table(['Run', 'Sự kiện', 'Commit', 'Kết quả'], [
      ['35986530494', 'push · ch01-workflow', '93c3050 (gốc)', '✅ CI XANH'],
      ['35986526254', 'push · ch01-pr-bao-cao', 'e1459aa (PR)', '✅ CI XANH'],
      ['35986554816', 'pull_request · PR #1', '0815f9a (merge)', '❌ tongDon(10,20) = NaN'],
    ], { sm: true })}` },

  /* 21 */ { t: 'GITHUB_SHA là merge commit; head.sha mới là nhánh bạn', body: t([
    '# run 35986554816 · bước "Commit nao dang nam trong thu muc lam viec"',
    'su kien     = pull_request',
    '+ GITHUB_REF  = refs/pull/1/merge',
    '+ GITHUB_SHA  = 0815f9af01e8c0b24d39825dcb5f802b4e62ec7c',
    'head.sha    = e1459aae73936edd84bd618bcab9422ae46e56a3',
    'base.sha    = 93c30503ebacb40a2254851a26f34ea603682806',
    'parents     =            # checkout nông depth=1 ⇒ git không thấy cha',
    '# bước node tests/chay.js',
    '!   HONG: bao-cao.test.js - tongDon(10,20) = NaN, mong doi 30',
    '= xanh: calc.test.js',
    '! CI DO (1 hong)',
    '! ##[error]Process completed with exit code 1.',
    '$ gh api repos/…/commits/0815f9a --jq .parents[].sha',
    '93c30503…  (^1 = gốc)     e1459aae…  (^2 = PR)',
  ], 'log thật · ubuntu-24.04', 15) },

  /* 22 */ { t: 'API nói run “thuộc về” head.sha — job lại kiểm merge commit', body: two(
    table(['Bạn cần', 'Dùng'], [
      ['commit CI đã kiểm (merge)', '<code>github.sha</code>'],
      ['đầu nhánh PR', '<code>github.event.pull_request.head.sha</code>'],
      ['đầu nhánh gốc', '<code>…pull_request.base.sha</code>'],
      ['TÊN nhánh PR', '<code>github.head_ref</code>'],
      ['(github.ref trên PR)', '<code>refs/pull/1/merge</code> — không phải tên nhánh'],
    ], { sm: true }),
    `${t(['$ gh api …/actions/runs/35986554816 \\', '    --jq .head_sha', '+ e1459aae…   ← đầu nhánh PR', '$ gh pr checks 1', '! test  fail  4s  …/runs/35986554816', '= test  pass  7s  …/runs/35986526254'], 'gh CLI')}
     ${box('warn', 'Cùng một PR hiện HAI dòng “test”: push trên nhánh (xanh) và pull_request (đỏ). Đừng nhìn dòng xanh rồi gộp.')}`) },

  /* 23 */ { t: 'Xung đột ⇒ không có merge commit ⇒ không có lần chạy', body: two(
    t(['$ gh pr view 2 --json mergeable,mergeState…', '! "mergeable": "CONFLICTING"', '! "mergeStateStatus": "DIRTY"', '$ gh api …/pulls/2 --jq .merge_commit_sha', '! null', '$ gh run list … (sau 60 giây)', '# 0 lần chạy "ch01 test" cho PR #2'], 'PR #2 · sân tập'),
    `${list(['Không đỏ, không xanh — ô kiểm bắt buộc nằm ở <b>“Expected — Waiting for status to be reported”</b>',
      'Không có log nào để đọc',
      'Ba thủ phạm của ô kiểm treo mãi: <b>xung đột</b> · <b>bộ lọc đã loại PR</b> · <b>workflow bắt buộc đã bị xoá/đổi tên</b>'])}
     ${box('tip', 'Sửa: rebase/merge nhánh gốc vào nhánh PR, giải xung đột, push — pull_request (synchronize) chạy lại.')}`) },

  /* 24 */ { t: 'pull_request_target + checkout head.sha = lộ bí mật', body: table(['Tổ hợp', 'Mã chạy là của', 'Có bí mật?', 'Kết quả'], [
    ['<code>pull_request</code> (PR từ fork)', 'PR', '❌ không', '✅ an toàn — script lạ chạy nhưng không thấy gì'],
    ['<code>pull_request_target</code>, checkout mặc định', 'nhánh GỐC', '✅ có', '✅ an toàn — mã PR không chạy'],
    ['<code>pull_request_target</code> + <code>ref: head.sha</code>', 'PR', '✅ có', '⛔ LỘ — một dòng <code>ref:</code> là toàn bộ lỗ hổng'],
    ['Cần bình luận/gắn nhãn cho PR fork?', 'tách đôi', '—', '<code>pull_request</code> dựng + artifact → <code>workflow_run</code> đăng'],
  ], { sm: true }) },

  /* ───── 1.5 ───── */
  /* 25 */ { t: 'Bộ lọc paths đo thật: 3 commit × 2 workflow', body: `${table(['Commit (push lên ch01-workflow)', 'paths: [\'app/**\']', 'paths: [\'app/*\']'], [
    ['<code>2f4ef2a</code> chỉ sửa <code>docs/ghi-chu.md</code>', '— không chạy', '— không chạy'],
    ['<code>8d5a151</code> thêm <code>app/con/sau.js</code>', '✅ chạy (35986372146)', '— <b>không chạy</b>'],
    ['<code>b7d67dd</code> thêm <code>app/tinh.js</code>', '✅ chạy', '✅ chạy'],
  ])}
    ${box('warn', '<code>*</code> KHÔNG vượt qua dấu <code>/</code>. <code>app/*</code> chỉ khớp file nằm NGAY trong <code>app/</code>. Không lỗi, không cảnh báo — chỉ im lặng không chạy.')}` },

  /* 26 */ { t: 'Trên kho thật: src/* khớp 1 file, src/** khớp 353', body: two(
    table(['Mẫu', 'Số file khớp'], [
      ['<code>src/**</code>', '353'], ['<code>src/*</code>', '<b>1</b> — chỉ src/index.ts'], ['<code>**/*.ts</code>', '1.039'],
      ['<code>*.json</code>', '5 — chỉ thư mục gốc'], ['<code>**/*.json</code>', '93'],
    ], { sm: true }),
    table(['Ký hiệu', 'Nghĩa'], [
      ['<code>*</code>', 'mọi ký tự, TRỪ <code>/</code>'], ['<code>**</code>', 'mọi ký tự, KỂ CẢ <code>/</code>'],
      ['<code>?</code>', 'đúng một ký tự'], ['<code>!mau</code>', 'loại trừ (trong <code>paths</code>)'],
      ['<code>paths</code> + <code>paths-ignore</code>', '❌ không được dùng cùng một sự kiện'],
    ], { sm: true })) },

  /* 27 */ { t: 'branches lọc nhánh ĐÍCH — push sang nhánh khác: 0 lần chạy', body: two(
    t(['$ git checkout -b ch01-khac', '$ git add app/khac.js && git commit -m …', '$ git push -u origin ch01-khac', '$ gh run list -b ch01-khac --json databaseId \\', '    --jq length', '+ 0', '# mọi workflow ch01 đều branches: [ch01-workflow]'], 'sân tập · commit 6dee4ec'),
    table(['Sự kiện', '<code>branches:</code> so với'], [
      ['<code>push</code>', 'nhánh được push TỚI'],
      ['<code>pull_request</code>', 'nhánh GỐC (nơi PR đi tới), không phải nhánh PR'],
      ['<code>tags:</code> mà không có <code>branches:</code>', 'push lên nhánh THÔI kích hoạt'],
      ['nhánh mới tinh', 'paths so với cha của commit sâu nhất được push'],
    ], { sm: true })) },

  /* 28 */ { t: 'paths trên PR + ô kiểm bắt buộc = PR kẹt vĩnh viễn', body: two(
    `${yaml([['on:', ''], ['  pull_request:', ''], ['    branches: [main]', 'KHÔNG có paths (cố ý)'], ['  push:', ''], ['    branches: [main]', ''], ["    paths: ['src/**', …]", 'CÓ paths']], { fs: 16 })}
     ${box('info', '<code>ci-lint.yml</code> của api-backend: cặp lệch này KHÔNG phải sót.')}`,
    steps([
      ['Workflow bị lọc ra thì KHÔNG báo gì', 'GitHub không coi “bị lọc” là “qua”'],
      ['Ô kiểm bắt buộc chờ mãi', '“Expected — Waiting for status to be reported”'],
      ['Cách vá chuẩn', 'job LUÔN chạy; bước đầu xem file nào đổi, các bước đắt dùng <code>if:</code> (Chương 3)'],
    ])) },

  /* 29 */ { t: 'Bộ lọc không giấu job hỏng — nó giấu job KHÔNG TỒN TẠI', body: `${kpis([{ v: '200', l: 'commit gần nhất trên main (08/2026)', c: 'blu' }, { v: '53', l: 'khớp paths → ci-lint chạy', c: 'grn' }, { v: '73,5%', l: 'không chạy CI nào', c: 'amb' }])}
    ${two(list(['Bỏ qua <code>desktop/</code>, <code>content/</code>, <code>firmware/</code> là ĐÚNG: <code>tsc</code> không nhìn tới đó',
      'Nhưng cú hỏng CI đắt nhất (run 32400097927, <code>vite build</code> hết heap trên macOS) nằm ở <code>desktop/</code> — nơi KHÔNG có job nào kiểm']),
    box('tip', '<b>Trước khi thêm <code>paths:</code></b>, diễn lại nó trên 200 commit gần nhất. Rồi hỏi câu quan trọng hơn: thư mục bị loại ra có job nào kiểm không?'))}` },

  /* 30 */ { t: 'Sai lầm hay gặp ở Chương 1', body: table(['Triệu chứng', 'Nguyên nhân thật', 'Sửa'], [
    ['Script kiểm kê workflow trả về rỗng', 'PyYAML đọc khoá <code>on</code> thành <code>True</code>', 'tra cả <code>d[True]</code>, hoặc dùng yq/ruamel (YAML 1.2)'],
    ['CI cài Node/Python “lạ”', '<code>18.20</code> → 18.2, <code>3.10</code> → 3.1', 'đặt nháy MỌI số phiên bản'],
    ['Lệnh thứ hai “không làm gì”', '<code>run: &gt;</code> gập dòng', 'dùng <code>run: |</code>'],
    ['Cron không bao giờ chạy', 'file chỉ nằm trên nhánh tính năng', 'đưa lên nhánh mặc định'],
    ['Báo động “chưa xong trước 04:00” kêu hoài', 'schedule trễ 40 phút – 6 tiếng', 'báo theo sự vắng mặt'],
    ['PR xanh, gộp xong main đỏ', 'tick xanh tính trên merge commit CŨ', 'bật “up to date before merging”'],
    ['Ô kiểm PR treo “Expected”', 'xung đột · bị lọc · workflow bị xoá', 'giải xung đột; bỏ paths khỏi pull_request'],
    ['Workflow im lặng không chạy', '<code>app/*</code> thay vì <code>app/**</code>', 'dùng <code>**</code>; diễn lại trên commit thật'],
  ], { sm: true }) },

  /* 31 */ { t: 'Bảng tra nhanh Chương 1', body: table(['Muốn…', 'Viết / gõ'], [
    ['Kiểm workflow trước khi push', '<code>docker run --rm -v "$PWD":/repo -w /repo rhysd/actionlint:latest</code>'],
    ['Xem các lần chạy · log', '<code>gh run list -L 10</code> · <code>gh run view &lt;id&gt; --log</code>'],
    ['Chỉ log bước hỏng', '<code>gh run view &lt;id&gt; --log-failed</code>'],
    ['Chạy tay một workflow', '<code>gh workflow run ten.yml -f moi_truong=staging</code>'],
    ['Tắt một cron', '<code>gh workflow disable ten.yml</code>'],
    ['Chuỗi nhiều dòng cho lệnh', '<code>run: |</code> (không bao giờ <code>&gt;</code>)'],
    ['Số phiên bản', "<code>node-version: '22'</code> — luôn có nháy"],
    ['Mọi file dưới app/', "<code>paths: ['app/**']</code>"],
    ['Commit đầu nhánh PR', '<code>github.event.pull_request.head.sha</code>'],
    ['Cron theo giờ VN', "<code>cron: '0 20 * * *'</code> (= 03:00 VN) hoặc <code>timezone:</code>"],
  ], { sm: true }) },

  /* 32 */ { t: 'Thực hành chương 1 (45 phút)', body: `
    ${steps([
      ['Tạo repo thử, thêm workflow giải phẫu, push, đọc 6 chặng', '<code>gh run view --log</code>: tìm GITHUB_SHA, tên runner, phiên bản image'],
      ['Gài bẫy YAML rồi bắt nó', '<code>node-version: 18.20</code> không nháy + <code>run: &gt;</code> — xem log in gì'],
      ['Viết một file hỏng, để actionlint bắt trước khi push', '<code>step:</code> gõ sai, <code>needs:</code> sai tên'],
      ['Mở một PR mà nhánh gốc đã đi tiếp', 'in <code>GITHUB_SHA</code> và <code>head.sha</code> — hai số khác nhau'],
      ['Bộ lọc: push 3 commit (docs/, app/con/, app/)', 'đoán trước workflow nào chạy, rồi mới nhìn tab Actions'],
    ])}
    ${box('good', '<b>Đạt khi:</b> bạn chỉ ra được link của một run pull_request mà GITHUB_SHA ≠ head.sha, và bảng “commit × workflow” bạn đoán khớp 100% với tab Actions.')}` },
]).map((x) => ({ ...x, body: TCSS + x.body }));
