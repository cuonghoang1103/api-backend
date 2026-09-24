/**
 * GitHub Actions · Deck ga-06 — Chương 6: Bí mật, quyền, và cái token.
 *
 * MỌI log/output mới trên slide là THẬT, chạy 24/09/2026 trên sân tập công khai
 * github.com/cuonghoang1103/ga-san-tap, nhánh ch06-bi-mat (runner 2.337.0, ubuntu-24.04 / macos-15).
 * MỌI giá trị bí mật là GIẢ (gia-tri-thu-khong-that-123 …), đã xoá khỏi sân tập sau khi đo.
 *   36006295872 ch06-che      — che gì / lọt gì, add-mask nhiều dòng, secret ngắn, output bị bỏ
 *   36006295870 ch06-quyen    — GITHUB_TOKEN Permissions (mặc định, {}, read-all, write-all), 403, liên kho
 *   36006295911 ch06-thay-the — khối permissions: của job THAY THẾ khối của workflow
 *   36006295897 ch06-oidc     — claims của token OIDC (payload đã giải mã, không in chữ ký)
 *   36006295900 ch06-env      — environment: người duyệt, luật nhánh, secret theo environment, sub đổi theo
 *   36006867501 / 36007044889 ch06-soat — script soát (ubuntu vs macOS), actionlint 1.7.12, zizmor 1.30.1
 * zizmor 1.30.1 --offline trên .github/workflows của api-backend (chỉ đọc, 24/09/2026).
 */
import { S, cover, cards, box, table, two, list, mindmap, term as gaTerm, yaml, diagram, bars, kpis, pipe, sv, R, T, A, D } from './_ga-chung.mjs';

export const deck = { key: 'ga-06', code: 'GITHUB ACTIONS · CHƯƠNG 6', title: 'Bí mật, quyền, và cái token', sub: 'GitHub Actions · Chương 6' };

const t = (lines, title, fs = 15) => gaTerm(lines, { title, dir: '~/ga-san-tap', fs });

/* ───────────── Slide 3 — che là phép tìm chuỗi trên LOG ───────────── */
const cheLaTimChuoi = () => diagram({
  w: 1160, h: 450,
  nodes: [
    { id: 'kho', x: 0, y: 20, w: 250, h: 90, t: 'Secret đã lưu', d: 'gia-tri-thu-khong-that-123', c: 'vio' },
    { id: 'dk', x: 310, y: 20, w: 260, h: 90, t: 'Runner ĐĂNG KÝ', d: 'giá trị + vài dạng mã hoá\n(base64 của chính nó…)', c: 'dk' },
    { id: 'b', x: 620, y: 20, w: 220, h: 90, t: 'Bước của bạn chạy', d: 'echo, curl, npm…', c: 'dim' },
    { id: 'loc', x: 950, y: 20, w: 210, h: 90, t: 'Bộ lọc LOG', d: 'khớp đúng chuỗi → ***', c: 'grn' },
    { id: 't', x: 0, y: 250, w: 270, h: 100, t: 'Tệp trên đĩa', d: 'ra-tep.txt: 26 byte\nKHÔNG che', c: 'red' },
    { id: 'a', x: 295, y: 250, w: 270, h: 100, t: 'Artifact · cache', d: 'tải lên nguyên văn\nKHÔNG che', c: 'red' },
    { id: 'm', x: 590, y: 250, w: 270, h: 100, t: 'Mạng ra ngoài', d: 'curl gửi đi đâu cũng được\nKHÔNG che', c: 'red' },
    { id: 'o', x: 885, y: 250, w: 275, h: 100, t: 'Output của job', d: 'bị BỎ: “Skip output …\nsince it may contain secret”', c: 'amb' },
  ],
  edges: [
    { from: 'kho', to: 'dk' }, { from: 'dk', to: 'b' }, { from: 'b', to: 'loc', t: 'stdout' },
    { from: 'b', to: 't', fs: 'b', ts: 't' }, { from: 'b', to: 'a', fs: 'b', ts: 't' }, { from: 'b', to: 'm', fs: 'b', ts: 't' }, { from: 'b', to: 'o', fs: 'b', ts: 't' },
  ],
});

/* ───────────── Slide 16 — giải phẫu claim sub ───────────── */
const giaiPhauSub = () => {
  let s = '';
  const parts = [
    ['repo:', 'dim', 'loại'],
    ['cuonghoang1103', 'blu', 'chủ kho'],
    ['@125522434', 'amb', 'ID chủ kho'],
    ['/ga-san-tap', 'tea', 'tên kho'],
    ['@1385223175', 'amb', 'ID kho'],
    [':ref:refs/heads/ch06-bi-mat', 'grn', 'ngữ cảnh'],
  ];
  let x = 10;
  parts.forEach(([p, c, lb]) => {
    const w = p.length * 12.6 + 22;
    s += R(x, 40, w, 58, { c, fill: '#0f182a', r: 8 }) + T(x + w / 2, 77, p, { fs: 19, a: 'middle', b: true, mono: true, c }) + T(x + w / 2, 124, lb, { fs: 15, a: 'middle', c: 'mu' });
    x += w + 6;
  });
  s += T(10, 180, 'Phần “ngữ cảnh” đổi theo job:', { fs: 18, b: true });
  const rows = [
    ['push lên nhánh', ':ref:refs/heads/ch06-bi-mat', 'run 36006295897'],
    ['job có environment:', ':environment:ch06-production', 'run 36006295900 — THAY chỗ ref'],
    ['pull_request', ':pull_request', 'theo docs'],
    ['đẩy thẻ', ':ref:refs/tags/v1.2.0', 'theo docs'],
  ];
  rows.forEach(([a, b, c2], i) => {
    const y = 200 + i * 44;
    s += R(10, y, 1140, 38, { c: 'dim', fill: i % 2 ? '#0f182a' : '#111a2b', r: 6, sw: 1 }) +
      T(28, y + 26, a, { fs: 16 }) + T(300, y + 26, b, { fs: 16, mono: true, c: i === 1 ? 'vio' : 'grn', b: true }) + T(1136, y + 26, c2, { fs: 14.5, c: 'mu', a: 'end' });
  });
  s += R(10, 390, 1140, 62, { c: 'amb', fill: 'rgba(255,194,51,.07)', dash: true }) +
    T(580, 416, 'Kho tạo SAU 15/07/2026 (như sân tập) dùng dạng có @ID. Kho cũ (api-backend, 06/2026) vẫn là repo:owner/repo:… trừ khi bật.', { fs: 15.5, a: 'middle' }) +
    T(580, 440, 'Vì sao: tên kho/tài khoản bị xoá rồi người khác đăng ký lại ⇒ cùng chuỗi sub cũ. ID thì không tái sinh.', { fs: 15, a: 'middle', c: 'mu' });
  return sv(1160, 460, s);
};

/* ───────────── Slide 19 — ba nhân vật, ba ranh giới ───────────── */
const baNhanVat = () => {
  let s = '';
  const col = (x, c, tt, who, holds, fix) => {
    s += R(x, 10, 360, 420, { c, fill: '#0f182a' });
    s += T(x + 180, 48, tt, { fs: 21, a: 'middle', b: true, c });
    s += T(x + 180, 76, who, { fs: 15.5, a: 'middle', c: 'mu' });
    holds.forEach((h, i) => { s += T(x + 22, 124 + i * 32, h, { fs: 16 }); });
    s += R(x + 16, 316, 328, 104, { c, fill: 'rgba(255,255,255,.03)', dash: true, r: 8 });
    fix.forEach((f, i) => { s += T(x + 30, 346 + i * 28, f, { fs: 15.5, b: i === 0, c: i === 0 ? c : 'tx' }); });
  };
  col(0, 'grn', 'Người lạ (PR từ fork)', 'viết được: mã, tiêu đề PR, tên nhánh', ['✗ không secret nào', '✗ token chỉ đọc', '✗ không environment', '→ nguy chỉ khi workflow', '   ĐƯA dữ liệu của họ', '   vào chỗ chạy lệnh'], ['Phòng thủ:', 'env: + "$VAR" (bài 3.1)', 'tránh pull_request_target']);
  col(400, 'red', 'Action bên thứ ba', 'chạy TRONG job của bạn', ['✓ workspace, $GITHUB_ENV', '✓ token của job', '✓ secret truyền cho bước', '✓ sudo trên runner', '→ đây là CỘT GIỮA,', '   nơi sự cố thật xảy ra'], ['Phòng thủ:', 'ghim SHA · permissions', 'tối thiểu · environment']);
  col(800, 'amb', 'Người có quyền ghi', 'sửa được chính tệp workflow', ['✓ mọi secret của kho', '✓ nâng permissions:', '✓ in secret dạng nào', '   cũng được', '→ Actions không chặn', '   được — theo thiết kế'], ['Phòng thủ:', 'review + branch protection', 'environment có người duyệt']);
  return sv(1160, 440, s);
};

export const slides = S([
  /* 1 */ cover({ t: 'Chương 6 — Bí mật, quyền, và cái token', sub: 'che *** phủ đến đâu · GITHUB_TOKEN · OIDC · environment · soát kho', chap: 'CHƯƠNG 6' }),

  /* 2 */ { t: 'Bản đồ chương: ai cầm chìa nào, chìa mở được cửa nào', body: mindmap('Bí mật & quyền', 'thứ job CẦM (secret, token) và thứ job LÀM ĐƯỢC (permissions)', [
    { t: '6.1 Che bí mật', d: '*** là phép tìm chuỗi · biến đổi thì lọt · add-mask', c: 'vio' },
    { t: '6.2 GITHUB_TOKEN', d: 'quyền mặc định · 403 · khối job thay thế · PAT', c: 'dk' },
    { t: '6.3 OIDC', d: 'không lưu gì · JWT 5 phút · claim sub', c: 'tea' },
    { t: '6.4 Bề mặt tấn công', d: '3 nhân vật · environment · chấm điểm kho', c: 'red' },
    { t: '6.5 Soát kho', d: 'script grep · actionlint · zizmor', c: 'grn' },
  ]) },

  /* ───── 6.1 ───── */
  /* 3 */ { t: 'Che *** là bộ lọc trên LOG, không phải két sắt', body: cheLaTimChuoi() },

  /* 4 */ { t: 'Thứ runner biết thì bị che — kể cả giữa một dòng dài', body: two(
    yaml([['env:', ''], ['  S: ${{ secrets.CH06_GIA }}', 'giá trị GIẢ'], ['steps:', ''], ['  - run: |', ''], ['      echo "gia tri: $S"', 'qua biến môi trường'], ['      echo "truoc-${S}-sau"', 'nằm giữa dòng'], ['  - run: |', ''], ['      echo "noi suy: ${{ secrets.CH06_GIA }}"', 'nội suy thẳng']], { fs: 14.5 }),
    t(['##[group]Run echo "gia tri: $S"', 'env:', '  S: ***', '##[endgroup]', '+ gia tri: ***', '+ truoc-***-sau', '##[group]Run echo "noi suy: ***"', '# ↑ tiêu đề nhóm = script ĐÃ nở, cũng che', '+ noi suy: ***'], 'run 36006295872 · bước 1–2', 14.5)) +
    box('info', 'Nội suy thẳng một secret CỦA BẠN vào <code>run:</code> không làm lộ nó trong log. Luật “qua <code>env:</code>” của bài 3.1 là về dữ liệu <strong>người khác</strong> điều khiển.') },

  /* 5 */ { t: 'Đo bằng giá trị giả: biến đổi nào bị che, biến đổi nào lọt', body: table(['Việc bước làm với secret', 'Log in ra (run 36006295872)', 'Kết quả'], [
    ['in 8 ký tự đầu “để gỡ lỗi”', '<code>gia-tri-</code>', '-lọt'],
    ['viết hoa', '<code>GIA-TRI-THU-KHONG-THAT-123</code>', '-lọt'],
    ['thay ký tự (<code>-</code> → <code>%2D</code>)', '<code>gia%2Dtri%2Dthu…</code>', '-lọt'],
    ['base64 của RIÊNG nó', '<code>***</code>', '+che'],
    ['base64 của <code>thu:</code>+secret (kiểu Basic auth)', '<code>dGh1Omdp***</code>', '!che phần lớn'],
    ['JSON: cả khối / một trường qua jq', '<code>***</code> / <code>mat-khau-gia-khong-that-789</code>', '-trường thì lọt'],
    ['khoá lưu base64, <code>base64 -d</code> rồi <code>cat</code>', '<code>day-la-khoa-gia-…-0001</code>', '-lọt cả khoá'],
    ['secret nhiều dòng lưu thẳng', 'mỗi dòng <code>***</code>, kể cả đứng một mình', '+che'],
    ['một JWT (không phải secret)', '<code>***</code>', '+tự che theo mẫu'],
  ], { sm: true }) },

  /* 6 */ { t: 'add-mask một giá trị nhiều dòng: chỉ dòng ĐẦU được đăng ký', body: two(
    t(['$ echo "::add-mask::$KHOA"   # cả khối 4 dòng', '! day-la-khoa-gia-khong-mo-duoc-gi-ca-0001', '! day-la-khoa-gia-khong-mo-duoc-gi-ca-0002', '! -----END KHOA GIA-----', '# ↑ lệnh chỉ ăn dòng 1; 3 dòng sau bị IN RA', '$ echo "$KHOA"', '+ ***', '! day-la-khoa-gia-khong-mo-duoc-gi-ca-0001', '! …'], 'bước 5 · sai cách', 14.5),
    t(['$ while IFS= read -r dong; do', '    [ -n "$dong" ] && echo "::add-mask::$dong"', '  done <<< "$KHOA"', '$ echo "$KHOA"', '+ ***', '+ ***', '+ ***', '+ ***'], 'bước 5 · đúng cách: TỪNG DÒNG', 14.5)) +
    box('warn', 'Chính lệnh <code>add-mask</code> sai cách đã làm lộ 3 dòng — trước cả khi bạn kịp dùng giá trị. Thứ tự đúng: <strong>tính → che từng dòng → mới dùng</strong>.') },

  /* 7 */ { t: 'Secret ngắn phá nát log; secret vắng mặt thì thành chuỗi rỗng', body: two(
    t(['# CH06_NGAN = 8080 (một số cổng)', '##[group]Run echo "cong web: *** · cong phu: 1*** …', '+ cong web: *** · cong phu: 1***', '+ url: http://localhost:***/api', '+ nam 2026, ma don ***1', '# ↑ cả TÊN BƯỚC cũng bị che:', '8. Bi mat NGAN (***) pha nat log'], 'bước 8', 14.5),
    t(['# secrets.KHONG_HE_CO — chưa từng tạo', 'env:', '  K: ', '+ KHONG_HE_CO -> chuoi rong', '# không lỗi, không cảnh báo', '', '# job output mang secret:', '! ##[warning]Skip output \'bi-mat-ra-ngoai\'', '!   since it may contain secret.', "bi-mat-ra-ngoai = ''"], 'bước 9 + Complete job', 14.5)) +
    box('tip', 'Đặt tên secret sai chính tả = chuỗi rỗng im lặng. Thêm một dòng chặn: <code>: "${K:?thieu secret K}"</code> để job đỏ ngay với lời nhắn rõ.') },

  /* 8 */ { t: 'Rò rồi thì XOAY — xoá log không thu hồi được gì', body: cards([
    { ic: '🧾', t: 'Che chỉ là tính năng của log', d: 'Tệp, artifact, cache, request mạng nhận giá trị <strong>nguyên văn</strong>. Tệp đo được: 26 byte, chứa đủ chuỗi.', c: 'red' },
    { ic: '🧮', t: 'Giá trị SUY RA không được che', d: 'Cắt chuỗi, giải mã, parse JSON, ký JWT từ khoá… → tự <code>::add-mask::</code> từng dòng trước khi dùng.', c: 'amb' },
    { ic: '🧱', t: 'Đừng lưu dữ liệu có cấu trúc', d: 'Docs khuyên tách JSON/YAML thành từng secret riêng — che dựa vào khớp chính xác.', c: 'blu' },
    { ic: '🔁', t: 'Nghi lộ = coi như đã lộ', d: 'Docs: xoá log <strong>và</strong> xoay secret. Người đã tải log về rồi thì xoá cũng muộn.', c: 'grn' },
  ], 2) },

  /* ───── 6.2 ───── */
  /* 9 */ { t: 'Mỗi job một token mới: quyền được tính qua 4 lớp', body: diagram({
    w: 1160, h: 420,
    nodes: [
      { id: 'a', x: 0, y: 20, w: 255, h: 96, t: 'Mặc định của kho', d: 'restricted: contents +\npackages đọc (sân tập: read)', c: 'dim' },
      { id: 'b', x: 300, y: 20, w: 255, h: 96, t: 'permissions: (workflow)', d: 'nêu 1 quyền ⇒\nquyền khác = none', c: 'dk' },
      { id: 'c', x: 600, y: 20, w: 255, h: 96, t: 'permissions: (job)', d: 'THAY THẾ khối\nworkflow, không cộng', c: 'vio' },
      { id: 'd', x: 900, y: 20, w: 260, h: 96, t: 'PR từ fork?', d: 'mọi write → read\n(trừ pull_request_target)', c: 'amb' },
      { id: 'e', x: 300, y: 250, w: 560, h: 110, t: 'GITHUB_TOKEN của job', d: 'installation token của GitHub App “GitHub Actions”\nchỉ kho này · hết hạn khi job xong (tối đa 6 giờ trên runner GitHub)', c: 'grn' },
    ],
    edges: [{ from: 'a', to: 'b' }, { from: 'b', to: 'c' }, { from: 'c', to: 'd' }, { from: 'd', to: 'e', fs: 'b', ts: 'r', t: 'kết quả' }],
  }) + box('info', 'Không cần đoán: log <strong>Set up job</strong> in khối <code>GITHUB_TOKEN Permissions</code> — đó là kết quả cuối cùng của 4 lớp trên.') },

  /* 10 */ { t: 'Khối “GITHUB_TOKEN Permissions” đo thật với 6 cách khai', body: table(['Khai trong job', 'Set up job in ra (run 36006295870)', 'Số quyền'], [
    ['(không khai) — mặc định sân tập', 'Contents: read · Metadata: read · Packages: read', '3'],
    ['<code>permissions: {}</code>', 'Metadata: read', '1'],
    ['<code>statuses: write</code>', 'Metadata: read · Statuses: write', '2'],
    ['<code>id-token: write</code> (không gì khác)', 'Metadata: read — <em>id-token không hiện</em> (run …897)', '1'],
    ['<code>read-all</code>', 'Actions … VulnerabilityAlerts: read', '19'],
    ['<code>write-all</code>', '!17 write + Metadata · Models · VulnerabilityAlerts read', '20'],
  ], { sm: true }) + box('tip', '<code>Metadata: read</code> luôn có mặt — không tắt được. <code>write-all</code> bật cả những quyền bạn chưa từng nghe tên (Models, Drives, CopilotRequests) — đúng lý do đừng dùng nó.') },

  /* 11 */ { t: 'Thiếu quyền là 403 “not accessible by integration”', body: two(
    t(['# mac-dinh: không có statuses: write', '$ gh api -X POST repos/$R/statuses/$GITHUB_SHA \\', '    -f state=success -f context=ch06/mac-dinh', '! gh: Resource not accessible by integration (HTTP 403)', '$ git push origin HEAD:refs/heads/ch06-thu-push', '! remote: Permission to cuonghoang1103/ga-san-tap.git', '!   denied to github-actions[bot].', '! fatal: … returned error: 403'], 'job mac-dinh', 14),
    t(['# toi-thieu: statuses: write', '+ HTTP 201 · status id 54846750063 · ch06/toi-thieu', '# cùng token, sang kho KHÁC:', '$ gh api -X POST repos/actions/checkout/statuses/…', '! Resource not accessible by integration (HTTP 403)', '# issues: none, nhưng kho CÔNG KHAI:', '$ gh api repos/$R/issues?state=all --jq length', '= 1'], 'job toi-thieu', 14)) +
    box('warn', '<code>none</code> chặn GHI và chặn đọc dữ liệu RIÊNG TƯ. Với kho công khai, thứ ai cũng đọc được thì token <code>{}</code> vẫn đọc được — <code>checkout</code> với <code>permissions: {}</code> chạy xanh.') },

  /* 12 */ { t: 'Khối permissions: của job THAY THẾ khối của workflow', body: two(
    yaml([['permissions:', 'mức workflow'], ['  contents: read', ''], ['  statuses: write', ''], ['jobs:', ''], ['  ke-thua:', 'không khai gì'], ['    steps: [ POST status ]', ''], ['  thay-the:', ''], ['    permissions:', 'mức job'], ['      issues: read', 'tưởng là “thêm”…'], ['    steps: [ POST status ]', '']], { fs: 15 }),
    t(['# ke-thua — Set up job', 'Contents: read', 'Metadata: read', 'Statuses: write', '+ ke-thua: HTTP 201 · ch06/ke-thua', '', '# thay-the — Set up job', 'Issues: read', 'Metadata: read', '! Resource not accessible by integration (HTTP 403)'], 'run 36006295911', 14.5)) +
    box('good', 'Job cần thêm một quyền thì phải <strong>liệt kê lại</strong> mọi quyền nó vẫn cần. Đọc khối Set up job để biết chắc — đừng cộng trừ trong đầu.') },

  /* 13 */ { t: 'Ba loại token: chọn cái sống ngắn nhất làm được việc', body: table(['', 'GITHUB_TOKEN', 'GitHub App token', 'PAT fine-grained', 'PAT classic'], [
    ['Ai cấp', 'tự động mỗi job', 'app của bạn, xin lúc chạy', 'một người, tạo tay', 'một người, tạo tay'],
    ['Phạm vi', '+đúng 1 kho', '+các kho đã cài app', '!kho chọn + quyền chọn', '-mọi kho người đó với tới'],
    ['Sống bao lâu', '+tới hết job (≤ 6 giờ)', '+1 giờ', '!tới hạn đặt (bắt buộc có)', '-có thể vô hạn'],
    ['Kích hoạt workflow khác', '-không (trừ dispatch)', '+có', '+có', '+có'],
    ['Khi nào dùng', 'mọi việc trong kho này', 'liên kho, bot lâu dài', 'liên kho, việc nhỏ', 'tránh'],
  ], { sm: true }) + box('info', 'api-backend dùng <code>RELEASE_TOKEN</code> (PAT) để phát hành sang kho <code>cuongthai-desktop</code> — đúng ca liên kho mà <code>GITHUB_TOKEN</code> không làm được. Nâng cấp tự nhiên: GitHub App token.') },

  /* ───── 6.3 ───── */
  /* 14 */ { t: 'OIDC: job chứng minh mình là ai, rồi đổi lấy khoá sống ngắn', body: diagram({
    w: 1160, h: 400,
    nodes: [
      { id: 'j', x: 0, y: 140, w: 250, h: 100, t: 'Job', d: 'permissions:\n  id-token: write', c: 'dk', mono: true },
      { id: 'g', x: 400, y: 0, w: 360, h: 100, t: 'GitHub OIDC issuer', d: 'token.actions.githubusercontent.com\nký JWT (RS256) mô tả job · sống 5 phút', c: 'tea' },
      { id: 'c', x: 800, y: 135, w: 360, h: 110, t: 'Cloud (AWS · GCP · Azure · Vault)', d: 'kiểm chữ ký bằng khoá công khai\nkhớp aud + sub với chính sách tin cậy', c: 'amb' },
      { id: 'k', x: 400, y: 290, w: 360, h: 100, t: 'Thông tin đăng nhập sống ngắn', d: 'của vai trò đã cấu hình\ntự hết hạn', c: 'grn' },
    ],
    edges: [
      { from: 'j', to: 'g', t: '1. xin JWT' }, { from: 'j', to: 'c', t: '2. trình JWT' },
      { from: 'c', to: 'k', t: '3. nếu khớp', fs: 'b', ts: 'r' }, { from: 'k', to: 'j', t: '4. dùng', dash: true },
    ],
  }) + box('good', 'Settings → Secrets: <strong>không có gì để lưu</strong> — không access key nào để lộ, để xoay, hay để quên xoay. Sự tin cậy nằm trong CẤU HÌNH phía cloud.') },

  /* 15 */ { t: 'Claims thật của một token OIDC (payload đã giải mã)', body: two(
    t(['so phan cua JWT: 3 · do dai: 2007 ky tu', '--- header ---', '{"alg":"RS256","typ":"JWT","kid":"38826b17-6a3…"}', '--- payload ---', '"iss": "https://token.actions.githubusercontent.com"', '+ "aud": "https://github.com/cuonghoang1103"', '+ "sub": "repo:cuonghoang1103@125522434/', '+        ga-san-tap@1385223175:ref:refs/heads/ch06-bi-mat"', '"repository": "cuonghoang1103/ga-san-tap"', '"ref": "refs/heads/ch06-bi-mat"', '"event_name": "push" · "environment": null', '"runner_environment": "github-hosted"', '= exp - iat = 300 giây'], 'run 36006295897 · job co-id-token', 13.5),
    list([
      '<strong>aud</strong> mặc định = URL chủ kho; xin <code>&amp;audience=sts.amazonaws.com</code> thì đổi thành đúng chuỗi đó (đo cùng run).',
      '<strong>sub</strong> là thứ chính sách tin cậy khớp — slide sau.',
      '31 claim có mặt: <code>ref_protected</code>, <code>repository_visibility</code>, <code>job_workflow_ref</code>, <code>workflow_sha</code>…',
      'Sống <strong>300 giây</strong>. Lộ thì cửa sổ là 5 phút, không phải “tới khi có người nhớ ra”.',
      'Script chỉ in payload; token đầy đủ không bao giờ ra log (runner cũng tự che mẫu JWT).',
    ])) },

  /* 16 */ { t: 'Claim sub: chuỗi mà chính sách tin cậy thật sự khớp', body: giaiPhauSub() },

  /* 17 */ { t: 'Chính sách tin cậy chỉ hẹp bằng chuỗi sub bạn viết', body: table(['Điều kiện trên sub (phía cloud)', 'Chấp nhận token từ', 'Đánh giá'], [
    ['<code>repo:org/*</code>', 'mọi kho của org — kể cả kho vừa tạo hôm qua', '-quá rộng'],
    ['<code>repo:org/app:*</code>', 'mọi nhánh, mọi PR, mọi environment của kho', '-rộng: ai push nhánh là deploy được'],
    ['<code>repo:org/app:ref:refs/heads/main</code>', 'chỉ job chạy trên main', '+ổn'],
    ['<code>repo:org/app:environment:production</code>', 'chỉ job khai <code>environment: production</code>', '+tốt nhất — cổng có người duyệt'],
    ['<code>aud</code> không kiểm', 'token xin cho dịch vụ khác cũng dùng được', '-luôn kiểm aud'],
  ], { sm: true }) + box('warn', 'Bản rộng là bản hay được chép từ blog vì “chạy ngay”. Viết chặt từ đầu; lỗi khớp sub hiện ra ở phía cloud dưới dạng <em>AccessDenied</em>, rất dễ đọc nhầm thành lỗi ARN.') },

  /* 18 */ { t: 'Thiếu id-token: write thì biến xin token không tồn tại', body: two(
    t(['# khong-id-token: permissions: contents: read', '! ACTIONS_ID_TOKEN_REQUEST_URL: (khong co)', '!   -> job thieu permissions id-token: write', '', '# chi-id-token: CHỈ id-token: write', 'GITHUB_TOKEN Permissions', '  Metadata: read', '# checkout vẫn XANH — vì kho công khai', '+ "sub": "repo:…:ref:refs/heads/ch06-bi-mat"'], 'run 36006295897', 14.5),
    yaml([['permissions:', ''], ['  id-token: write', 'để XIN JWT'], ['  contents: read', 'kho riêng tư: bắt buộc'], ['steps:', ''], ['  - uses: actions/checkout@v4', ''], ['  - uses: aws-actions/configure-aws-credentials@v4', ''], ['    with:', ''], ['      role-to-assume: arn:aws:iam::…:role/deploy', ''], ['      aws-region: ap-southeast-1', 'không key nào']], { fs: 14 })) +
    box('info', '<code>write</code> ở đây nghĩa là “được phép XIN”, không ghi được gì vào kho. Và <code>id-token</code> không hiện trong khối Set up job — muốn chắc thì kiểm biến <code>ACTIONS_ID_TOKEN_REQUEST_URL</code>.') },

  /* ───── 6.4 ───── */
  /* 19 */ { t: 'Ba nhân vật, ba ranh giới — sự cố thật nằm ở cột giữa', body: baNhanVat() },

  /* 20 */ { t: 'environment: là cổng — job đứng chờ tới khi người duyệt bấm', body: pipe({
    w: 1160, h: 250,
    cols: [[{ n: 'khong-env', s: 'ok', d: '2s' }, { n: 'co-env', s: 'wait', d: '41s' }, { n: 'chi-main', s: 'fail', d: '0s' }], [{ n: 'co-env ', s: 'ok', d: '6s' }]],
    needs: [['co-env', 'co-env ']],
  }) + two(
    t(['$ gh api …/runs/36006295900/pending_deployments', '{"env":"ch06-production",', ' "reviewers":["cuonghoang1103"],', ' "current_user_can_approve":true}', '$ gh api -X POST …/pending_deployments \\', '    -f state=approved …', '+ approved · "ch06: duyet thu tren san tap"'], 'duyệt bằng API (hoặc nút Review)', 13.5),
    t(['! Branch "ch06-bi-mat" is not allowed to deploy', '!   to ch06-chi-main due to environment', '!   protection rules.', '# luật nhánh: chỉ main — job bị từ chối', '# TRƯỚC khi có runner, không bước nào chạy'], 'job chi-main', 13.5)) },

  /* 21 */ { t: 'Secret của environment chỉ tới job khai environment đó', body: two(
    t(['# khong-env (không khai environment)', 'env:', '  TRUNG: ***', '  ENVG: ', '+ CH06_TRUNG dai 26 ky tu (ban cap KHO)', '! CH06_ENV_GIA: (rong)'], 'job khong-env', 15),
    t(['# co-env: environment: ch06-production', '+ CH06_TRUNG dai 33 ky tu (ban cap ENVIRONMENT)', 'CH06_ENV_GIA: ***', '"sub": "repo:…/ga-san-tap@1385223175:', '        environment:ch06-production"', '"environment": "ch06-production"'], 'job co-env · sau khi duyệt', 15)) +
    box('good', 'Trùng tên: <strong>environment thắng kho, kho thắng tổ chức</strong>. Secret của environment được đọc lúc job BẮT ĐẦU — tức là <strong>sau</strong> khi được duyệt; job chưa duyệt không cầm được nó.') +
    box('info', 'Gói Free/Pro/Team: người duyệt và hẹn giờ chỉ có ở kho <strong>công khai</strong> (kho riêng tư cần Enterprise); luật nhánh cho kho riêng tư cần Pro/Team (docs, 09/2026). api-backend là kho công khai.') },

  /* 22 */ { t: 'Mỗi mối nguy một lớp chặn — và cách biết lớp đó còn sống', body: table(['Mối nguy', 'Lớp chặn', 'Kiểm bằng'], [
    ['Dữ liệu sự kiện chạy thành lệnh', '<code>env:</code> + <code>"$VAR"</code> (bài 3.1)', 'zizmor <code>template-injection</code>'],
    ['Action bị chiếm qua thẻ dời', 'ghim SHA 40 ký tự + Dependabot (bài 4.2)', 'zizmor <code>unpinned-uses</code>'],
    ['Token quá quyền', '<code>permissions:</code> tối thiểu, mức job', 'khối Set up job · zizmor <code>excessive-permissions</code>'],
    ['Khoá checkout đi theo artifact', '<code>persist-credentials: false</code>', 'zizmor <code>artipacked</code>'],
    ['Secret sống lâu bị lộ', 'OIDC / token app sống ngắn · xoay định kỳ', 'kiểm kê Settings → Secrets'],
    ['Deploy không ai duyệt', '<code>environment:</code> + người duyệt + luật nhánh', 'job “Waiting” trên giao diện'],
    ['Giá trị suy ra bị in', '<code>::add-mask::</code> từng dòng', 'đọc log sau lần chạy thử'],
  ], { sm: true }) },

  /* 23 */ { t: 'Chấm lại api-backend hôm nay (24/09/2026)', body: two(
    table(['Hàng', 'Bài cũ', 'Hôm nay'], [
      ['workflow', '11', '14'],
      ['lượt <code>secrets.*</code>', '44', '56'],
      ['ghim SHA', '0 / 21', '!0 / 24'],
      ['<code>permissions:</code> mức workflow', '1 / 11', '!2 / 14'],
      ['<code>environment:</code>', '0 / 11', '!0 / 14'],
      ['quyền mặc định của kho', '“không biết”', '+read (đọc qua API)'],
      ['<code>pull_request_target</code>', '0', '+0'],
    ], { sm: true }),
    `${kpis([{ v: 'read', l: 'mặc định token', c: 'grn' }, { v: '0/24', l: 'ghim SHA', c: 'red' }, { v: 'public', l: 'kho → env miễn phí', c: 'blu' }])}
     ${box('info', 'Hàng “không biết” của bài cũ trả lời được bằng MỘT lệnh chỉ đọc:<br><code>gh api repos/O/R/actions/permissions/workflow</code><br>→ <code>{"default_workflow_permissions":"read"}</code>')}`) },

  /* ───── 6.5 ───── */
  /* 24 */ { t: 'Cùng script, hai hệ điều hành: macOS lệch cột vì wc -l', body: two(
    t(['# ubuntu-24.04', '  ✅ bieu thuc github.event trong run:      0 cho', '  ⚠️  action CHUA ghim bang SHA              0 / 8', '  ⚠️  workflow KHONG khai permissions:       5 / 6', '  ℹ️  12 luot tham chieu secrets.*'], 'run 36006867501 · Linux', 14.5),
    t(['# macos-15', '  ✅ bieu thuc github.event trong run:      0 cho', '! ⚠️  action CHUA ghim bang SHA              0 /        8', '! ⚠️  workflow KHONG khai permissions:       5 /        6', '! ℹ️        12 luot tham chieu secrets.*'], 'cùng run · macOS', 14.5)) +
    box('warn', '<code>wc -l</code> của BSD (macOS) đệm dấu cách trước con số; GNU thì không. Số vẫn đúng, chỉ lệch chữ — nhưng một phép so <code>[ "$n" = "0" ]</code> sẽ SAI trên Mac. Sửa: <code>$(… | wc -l | tr -d " ")</code> hoặc dùng <code>$((n))</code>.') },

  /* 25 */ { t: 'Phép thử làm hỏng: bộ kiểm bắt được — và bắt nhầm chính nó', body: two(
    t(['# kho sân tập KHÔNG có workflow pull_request_target nào', '! ⚠️  workflow dung pull_request_target   1 workflow', '$ grep -n pull_request_target .github/workflows/*.yml', 'ch06-soat.yml:22: - name: Thu lam HONG — … pull_request_target', 'ch06-soat.yml:25: printf \'on: pull_request_target\\n…\'', '# thêm tệp nháp có pull_request_target:', '+ ⚠️  workflow dung pull_request_target   2 workflow'], 'run 36007044889', 13.5),
    list([
      '<strong>Bắt được:</strong> thêm một tệp nháp, số tăng 1 → 2. Bộ kiểm không “câm”.',
      '<strong>Bắt nhầm:</strong> grep khớp cả <em>chữ</em> trong tên bước và chuỗi <code>printf</code> — không phân biệt khoá YAML với văn bản.',
      'Grep tốt để <strong>báo khói</strong>. Hiểu YAML thật (khoá <code>on:</code>) là việc của actionlint/zizmor.',
      'Luật: chưa từng thấy bộ kiểm ĐỎ thì chưa kiểm bộ kiểm.',
    ])) },

  /* 26 */ { t: 'zizmor đọc 14 workflow của api-backend: 60 phát hiện', body: two(
    bars([
      { l: 'unpinned-uses', sub: 'thẻ @v4 thay vì SHA', v: 24, txt: '24', c: 'red' },
      { l: 'excessive-permissions', sub: 'không khai permissions:', v: 17, txt: '17', c: 'amb' },
      { l: 'artipacked', sub: 'checkout giữ khoá', v: 8, txt: '8', c: 'ora' },
      { l: 'template-injection', sub: 'inputs.version trong run:', v: 7, txt: '4+3', c: 'vio' },
      { l: 'cache-poisoning', sub: 'cache trong job phát hành', v: 3, txt: '3', c: 'blu' },
      { l: 'use-trusted-publishing', sub: 'mức info', v: 1, txt: '1', c: 'tea' },
    ], { lw: 300 }),
    `${box('warn', 'Script grep báo <strong>0</strong> template-injection vì nó chỉ tìm <code>github.event.*</code>. zizmor thấy <code>&#36;{{ inputs.version }}</code> nội suy vào <code>run:</code> ở <code>desktop-release.yml</code> (4 chỗ, độ tin High).')}
     ${box('info', 'Rủi ro thực tế thấp: input đó chỉ người có quyền ghi gõ được (<code>workflow_dispatch</code>). Nhưng vá vẫn rẻ: <code>env: VER: &#36;{{ inputs.version }}</code> rồi dùng <code>"$VER"</code>.')}`) },

  /* 27 */ { t: 'Ba công cụ, ba độ sâu — dùng cả ba', body: table(['', 'script grep 6.5', 'actionlint 1.7.12', 'zizmor 1.30.1'], [
    ['Hiểu YAML', '-không (khớp chữ)', '+có', '+có'],
    ['Bắt lỗi cú pháp, biểu thức, tên input', '-không', '+có — việc chính', '-không'],
    ['Bắt injection', '!chỉ <code>github.event.*</code>', '+ngữ cảnh không tin cậy', '+mọi biểu thức, có độ tin'],
    ['Ghim SHA · quyền · artipacked · cache', '!đếm thô', '-không', '+có, có mức nghiêm trọng'],
    ['Trên sân tập ch06', '2 đạt · 4 cảnh báo', '0 lỗi (bỏ shellcheck)', '59 phát hiện (38 bị ẩn)'],
    ['Giá trị dạy học', '+hiểu mình đang kiểm gì', 'lưới an toàn khi gõ', 'bản soát bảo mật thật'],
  ], { sm: true }) + box('tip', 'Chạy zizmor không cần quyền gì: <code>pipx run zizmor --offline .github/workflows</code> — job <code>permissions: {}</code>, không secret.') },

  /* 28 */ { t: 'Sai lầm hay gặp ở Chương 6', body: cards([
    { ic: '🔓', t: '“Có *** là an toàn”', d: 'Chỉ log được che. Giá trị suy ra, tệp, artifact, mạng — nguyên văn.', c: 'red' },
    { ic: '📜', t: 'add-mask cả khối nhiều dòng', d: 'Chỉ dòng đầu được đăng ký, các dòng sau bị IN RA. Che từng dòng.', c: 'amb' },
    { ic: '🔢', t: 'Secret ngắn (8080, true)', d: 'Che mọi chỗ trùng chuỗi, kể cả tên bước. Đừng coi cấu hình là secret — dùng vars.', c: 'ora' },
    { ic: '➕', t: 'Tưởng khối job CỘNG thêm', d: 'permissions: của job THAY THẾ khối workflow. Liệt kê lại mọi quyền; đọc Set up job.', c: 'vio' },
    { ic: '🌐', t: 'sub khớp repo:org/*', d: 'Mọi kho, mọi nhánh đổi được khoá cloud. Khớp tới environment.', c: 'blu' },
    { ic: '🪪', t: 'PAT classic cho việc trong kho', d: 'Gần như luôn là do thiếu một dòng <code>permissions:</code> — PAT chỉ dành cho việc liên kho.', c: 'pnk' },
  ], 3) },

  /* 29 */ { t: 'Bảng tra nhanh Chương 6', body: table(['Muốn', 'Viết / làm'], [
    ['Che giá trị tự tính ra', '<code>while IFS= read -r l; do echo "::add-mask::$l"; done &lt;&lt;&lt; "$V"</code>'],
    ['Bắt secret bị quên đặt', '<code>: "${K:?thieu secret K}"</code>'],
    ['Quyền tối thiểu', 'đầu tệp <code>permissions: contents: read</code>, nâng ở đúng job'],
    ['Job không cần token', '<code>permissions: {}</code>'],
    ['Xem token THẬT có quyền gì', 'log Set up job → <code>GITHUB_TOKEN Permissions</code>'],
    ['Quyền mặc định của kho', '<code>gh api repos/O/R/actions/permissions/workflow</code>'],
    ['Deploy lên cloud không lưu key', '<code>id-token: write</code> + action đăng nhập của cloud + trust policy khớp <code>sub</code>'],
    ['Cổng có người duyệt', '<code>environment: production</code> + required reviewers + luật nhánh'],
    ['Soát cả kho', '<code>actionlint</code> + <code>zizmor --offline .github/workflows</code>'],
    ['Nghi đã lộ', 'xoay secret ngay, rồi xoá log'],
  ], { sm: true }) },

  /* 30 */ { t: 'Thực hành Chương 6 (60 phút) trên kho của chính bạn', body: two(list([
    '<strong>1.</strong> Tạo secret GIẢ <code>THU_GIA</code>; in nó, 8 ký tự đầu, và base64 của nó. Ghi lại cái nào thành <code>***</code>.',
    '<strong>2.</strong> Thêm <code>permissions: contents: read</code> đầu một workflow; tìm khối <code>GITHUB_TOKEN Permissions</code> trong Set up job.',
    '<strong>3.</strong> Gọi <code>gh api -X POST …/statuses/$GITHUB_SHA</code>: thấy 403, thêm <code>statuses: write</code> ở job, thấy 201.',
    '<strong>4.</strong> Job <code>id-token: write</code> chạy script in claims; đọc <code>sub</code> và <code>exp - iat</code>.',
    '<strong>5.</strong> Tạo environment <code>thu-prod</code> có bạn là người duyệt; chạy, duyệt, so <code>sub</code>.',
    '<strong>6.</strong> Chạy zizmor trên kho; vá 1 phát hiện; chạy lại.',
  ]), box('good', '<strong>Đạt khi</strong> bạn có: bảng “che / lọt” của chính mình; một 403 và một 201 cùng lệnh; claim <code>sub</code> đổi từ <code>ref:</code> sang <code>environment:</code>; zizmor giảm ít nhất 1 phát hiện.<br><br>Dọn: <code>gh secret delete THU_GIA</code>, xoá environment thử.')) },
]);
