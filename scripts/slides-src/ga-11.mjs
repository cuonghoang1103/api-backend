/**
 * GitHub Actions · Deck ga-11 — Chương 11: Ôn tổng giữa khoá (Chương 1–10).
 *
 * Deck ôn tập: không chạy workflow mới. Mọi con số lấy từ các chương ĐÃ đo (tóm tắt 📌 của s01…s10,
 * đọc bằng node -e ngày 24/09/2026) và từ các run thật trên sân tập github.com/cuonghoang1103/ga-san-tap:
 *   Ch1 35986150275 (run: > gập dòng) · Ch2 35989945632 (bảng điều kiện bước) · Ch3 36000179987 (hashFiles rỗng)
 *   Ch4 36000264372 (action cục bộ trước checkout) · Ch5 36005610825 (restore-key khớp tiền tố)
 *   Ch6 36007044889 (soát bằng grep + actionlint + zizmor) · Ch7 36009923442 (huỷ giữa chừng)
 *   Ch8 36011087956 (flake 20%) · Ch9 36017616624 (tự rollback 12,6 s)
 * Đếm api-backend 24/09/2026: 24 dòng uses:, 0 dòng ghim SHA đủ 40 ký tự.
 */
import { S, cover, cards, box, table, two, list, mindmap, term as gaTerm, yaml, steps, diagram, pipe, bars, flow, sv, R, T, A, D } from './_ga-chung.mjs';

export const deck = { key: 'ga-11', code: 'GITHUB ACTIONS · CHƯƠNG 11', title: 'Ôn tổng giữa khoá: Chương 1–10', sub: 'GitHub Actions · Chương 11' };

const t = (lines, title, fs = 15) => gaTerm(lines, { title, dir: '~/kho-cua-ban', fs });
const fill = (c, p = 26) => `color-mix(in srgb, ${D[c] || c} ${p}%, #0f182a)`;

/* ───────────── Slide 3 — hành trình của MỘT lần chạy, gắn số chương ───────────── */
const hanhTrinh = () => {
  let s = '';
  const box1 = (x, y, w, h, c, ch, t1, d1, d2) => {
    s += R(x, y, w, h, { c, fill: fill(c, 20) });
    s += `<rect x="${x + 12}" y="${y - 14}" width="${ch.length * 9 + 18}" height="26" rx="7" fill="${D[c]}"/>` + T(x + 21, y + 5, ch, { fs: 14, b: true, c: '#08101e', mono: true });
    s += T(x + w / 2, y + 42, t1, { fs: 18, b: true, a: 'middle' });
    if (d1) s += T(x + w / 2, y + 68, d1, { fs: 14.5, a: 'middle', c: 'mu' });
    if (d2) s += T(x + w / 2, y + 89, d2, { fs: 14.5, a: 'middle', c: 'mu' });
  };
  // hàng trên: trước khi có máy
  box1(0, 30, 250, 104, 'vio', 'Ch 1', 'Sự kiện', 'push · PR · cron · dispatch', 'types: thay mặc định');
  box1(300, 30, 250, 104, 'blu', 'Ch 1 · 3', 'Lọc + if:', 'branches/paths · biểu thức', 'tính TRƯỚC khi có shell');
  box1(600, 30, 250, 104, 'dk', 'Ch 2', 'Job xin máy', 'runs-on · needs · matrix', 'mỗi job = máy MỚI');
  box1(900, 30, 260, 104, 'tea', 'Ch 4', 'Set up job', 'tải action theo SHA', 'quyền token in ra ở đây');
  s += A(250, 82, 296, 82, { c: 'mu' }) + A(550, 82, 596, 82, { c: 'mu' }) + A(850, 82, 896, 82, { c: 'mu' });
  // xuống hàng dưới
  s += `<path d="M1030 134 C1030 190 1030 190 1030 214" stroke="${D.mu}" stroke-width="3" fill="none" marker-end="url(#m-mu)"/>`;
  // hàng dưới: trên runner → sau run
  box1(900, 220, 260, 104, 'grn', 'Ch 2 · 5', 'Các bước chạy', 'bash -e · cache · artifact', 'mã thoát quyết định ✓/✗');
  box1(600, 220, 250, 104, 'amb', 'Ch 6', 'Bí mật + token', 'che chuỗi đã lưu', 'permissions · OIDC');
  box1(300, 220, 250, 104, 'red', 'Ch 8', 'Log + annotation', 'đỏ ⇒ đọc theo 4 bậc', 'mã thoát 1/127/137');
  box1(0, 220, 250, 104, 'pnk', 'Ch 9 · 10', 'Deploy + kiểm', 'một đường · rollback', 'bộ kiểm phải từng ĐỎ');
  s += A(900, 272, 854, 272, { c: 'mu' }) + A(600, 272, 554, 272, { c: 'mu' }) + A(300, 272, 254, 272, { c: 'mu' });
  // Ch7 bao trùm
  s += R(0, 366, 1160, 60, { c: 'ora', fill: 'rgba(255,138,61,.07)', dash: true, r: 10 });
  s += T(20, 403, 'Ch 7 · tốc độ & concurrency phủ lên TẤT CẢ: đường tới hạn · nhóm concurrency · phương sai 2× · giá theo phút', { fs: 16, c: 'ora', b: true });
  s += T(0, 462, 'Mỗi ô là một chỗ run có thể hỏng. Hỏi "hỏng ở ô nào?" trước khi hỏi "sửa thế nào?".', { fs: 15.5, c: 'mu' });
  return sv(1160, 475, s);
};

/* ───────────── Slide 7 — needs + output 4 chặng ───────────── */
const chuong2 = () => pipe({
  w: 1160, h: 230,
  cols: [[{ n: 'kiem', s: 'ok', d: '12s' }], [{ n: 'ubuntu', s: 'ok', d: '41s' }, { n: 'windows', s: 'fail', d: '58s' }, { n: 'macos', s: 'skip', d: 'huỷ' }], [{ n: 'dung', s: 'skip' }], [{ n: 'bao-cao', s: 'ok', d: 'always' }]],
  needs: [['kiem', 'ubuntu'], ['kiem', 'windows'], ['kiem', 'macos'], ['ubuntu', 'dung'], ['windows', 'dung'], ['macos', 'dung'], ['dung', 'bao-cao']],
});

/* ───────────── Slide 16 — workflow mẫu gom nửa khoá ───────────── */

export const slides = S([
  /* 1 */ cover({ t: 'Chương 11 — Ôn tổng giữa khoá', sub: 'Chương 1–10 · một bản đồ · mười chương · mười lỗi · mười lăm câu phỏng vấn · nửa sau khoá', chap: 'CHƯƠNG 11' }),

  /* 2 */ { t: 'Nửa khoá đầu là năm năng lực, không phải mười chương rời', body: mindmap('Ch 1–10', 'viết · dùng lại · nhanh · an toàn · sửa & ship', [
    { t: 'VIẾT được (Ch 1–3)', d: 'YAML · sự kiện · job/runner · biểu thức, if:', c: 'dk' },
    { t: 'DÙNG LẠI an toàn (Ch 4)', d: 'action là mã người khác · ghim SHA · checkout', c: 'tea' },
    { t: 'NHANH có số đo (Ch 5, 7)', d: 'cache/artifact · đường tới hạn · concurrency', c: 'grn' },
    { t: 'AN TOÀN (Ch 6)', d: 'che bí mật · GITHUB_TOKEN · OIDC · soát', c: 'amb' },
    { t: 'SỬA khi đỏ (Ch 8)', d: 'mã thoát · flake · tái lập · đọc log', c: 'red' },
    { t: 'SHIP & chẩn đoán (Ch 9–10)', d: 'deploy · rollback · environment · ca thật', c: 'vio' },
  ]) },

  /* 3 */ { t: 'Một lần chạy đi qua tám ô — mỗi ô là một chương', body: hanhTrinh() },

  /* 4 */ { t: 'Muốn làm được việc này thì ôn chương nào', body: table(['Kỹ năng người đi làm cần', 'Chương', 'Bằng chứng bạn đã có'], [
    ['Viết workflow chạy đúng sự kiện, đúng nhánh, đúng file', 'Ch 1', 'bộ lọc đo trên sân tập · <code>src/*</code> ≠ <code>src/**</code>'],
    ['Chia job, truyền dữ liệu giữa job, ma trận nhiều OS', 'Ch 2', 'output 4 chặng · 2×3 − 1 + 1 = 6 job'],
    ['Viết <code>if:</code> không nổ sai, không chết im', 'Ch 3', '5 giá trị sai · chữ ngoài <code>&#36;{{ }}</code> luôn đúng'],
    ['Dùng action của người khác mà không trao chìa khoá', 'Ch 4', 'ghim SHA 40 ký tự · vụ tj-actions 03/2025'],
    ['Tăng tốc có số đo, biết khi nào cache LỖ', 'Ch 5 · 7', 'node_modules −79% · hoà vốn ~26% trúng'],
    ['Giữ bí mật, cấp quyền tối thiểu, bỏ khoá cloud', 'Ch 6', '<code>permissions:</code> · OIDC sống 300 s'],
    ['Đọc run đỏ, tách flake khỏi hỏng thật', 'Ch 8', '4 bậc đọc · 0,8⁴ ≈ 41%'],
    ['Deploy có cổng, có rollback, một đường duy nhất', 'Ch 9', 'tự rollback 12,6 s · environment duyệt/từ chối'],
    ['Chẩn đoán sự cố production bằng phép đo', 'Ch 10', '401/200 = có route · 404 = bản dựng cũ'],
  ], { sm: true }) },

  /* ───── mỗi chương một trang ───── */
  /* 5 */ { t: 'Ch 1 — YAML đọc khác bạn nghĩ; trigger là một chính sách', body: two(
    yaml([
      ['on:', 'YAML 1.1 đọc thành True'],
      ['  pull_request:', ''],
      ['    types: [opened]', 'THAY mặc định: mất synchronize'],
      ['    paths: [\'src/**\']', 'src/* chỉ 1 file · src/** 353'],
      ['jobs:', ''],
      ['  ci:', ''],
      ['    steps:', ''],
      ['      - uses: actions/setup-node@v4', ''],
      ['        with: { node-version: 18.20 }', 'thành 18.2 — đặt nháy'],
      ['      - run: >', 'gập: lệnh 2 biến mất'],
      ['          npm ci', ''],
      ['          npm test', 'dùng | thay >'],
    ], { fs: 15 }),
    `${box('info', '<strong>pull_request</strong> chạy trên merge commit <code>refs/pull/N/merge</code> — hai nhánh xanh vẫn có thể ra PR đỏ. <code>github.sha</code> ≠ <code>head.sha</code>.')}
     ${box('warn', '<strong>cron</strong> = "không sớm hơn": 14 Chủ nhật đo được, 0 lần đúng giờ, trễ 41 phút → 5,8 giờ. Luôn kèm <code>workflow_dispatch</code>.')}
     ${box('bad', 'Ô kiểm bắt buộc + lọc <code>paths:</code> ở trigger ⇒ PR chờ mãi "Expected". Đưa điều kiện vào TRONG job.')}`) },

  /* 6 */ { t: 'Ch 2 — Mỗi job là một cỗ máy mới; needs: là thứ tự duy nhất', body: chuong2() + two(list([
      '8 job → 6 runner_id: tệp, biến, <code>export</code> không qua job',
      'Output 4 chặng: <code>$GITHUB_OUTPUT</code> → bước có <code>id</code> → <code>outputs:</code> → <code>needs.X.outputs</code>',
      'Cha hỏng ⇒ con SKIP (xám), và skip lan truyền',
    ]), list([
      '<code>bash -e</code> mặc định THIẾU <code>pipefail</code>; Windows chạy pwsh',
      'fail-fast mặc định true: nhánh khác bị huỷ, không kết quả',
      'Nhãn <code>runs-on</code> gõ sai: xếp hàng mãi, không báo lỗi',
    ])) },

  /* 7 */ { t: 'Ch 3 — Biểu thức được thay thành chữ TRƯỚC khi shell tồn tại', body: two(
    table(['Viết', 'Kết quả đo'], [
      ['<code>if: \'false\'</code>', '+bị bỏ qua (đúng)'],
      ['<code>if: &#36;{{ x }} == \'a\'</code>', '-chữ ngoài ngoặc ⇒ LUÔN đúng'],
      ['<code>if: github.event.inputs.deploy</code>', '-chuỗi \'false\' vẫn đúng'],
      ['<code>if: inputs.deploy</code>', '+boolean thật'],
      ['<code>cond &amp;&amp; \'\' || \'b\'</code>', '-giá trị giữa rỗng ⇒ ra \'b\''],
      ['<code>hashFiles(\'khong-co/**\')</code>', '-chuỗi rỗng, khoá cache-Linux-'],
      ['<code>secrets.X</code> trong <code>if:</code>', '-không dùng được — qua <code>env:</code>'],
    ], { sm: true }),
    `${box('info', 'Chỉ 5 giá trị là SAI: <code>false</code>, <code>0</code>, <code>-0</code>, <code>\'\'</code>, <code>null</code>. <code>\'false\'</code>, <code>\'0\'</code>, <code>[]</code> đều ĐÚNG.')}
     ${box('good', 'Dữ liệu bạn không kiểm soát (tiêu đề PR, tên nhánh) đi qua <code>env:</code> rồi đọc <code>"$VAR"</code> — không bao giờ dán thẳng <code>&#36;{{ }}</code> vào <code>run:</code>.')}
     ${box('tip', 'Context gõ sai ra CHUỖI RỖNG, không ra lỗi. Khi bước làm chuyện lạ: đọc script đã nở trong tiêu đề nhóm log.')}`) },

  /* 8 */ { t: 'Ch 4 — @v4 là một con trỏ; chỉ SHA 40 ký tự là đứng yên', body: two(
    `${diagram({ w: 560, h: 330, nodes: [
      { id: 'v', x: 0, y: 20, w: 200, h: 70, t: '@v4', d: 'thẻ — trỏ lại được', c: 'amb', mono: true },
      { id: 'm', x: 0, y: 130, w: 200, h: 70, t: '@main', d: 'nhánh — luôn đi', c: 'red', mono: true },
      { id: 's', x: 0, y: 240, w: 200, h: 70, t: '@8e5e7e5…(40)', d: 'SHA — bất biến', c: 'grn', mono: true },
      { id: 'a', x: 330, y: 70, w: 230, h: 80, t: 'commit A (tốt)', d: 'hôm qua', c: 'grn' },
      { id: 'b', x: 330, y: 200, w: 230, h: 80, t: 'commit X (độc)', d: 'kẻ xấu dời thẻ', c: 'red' },
    ], edges: [
      { from: 'v', to: 'b', c: 'red', dash: true },
      { from: 'm', to: 'b', c: 'red', dash: true },
      { from: 's', to: 'a', c: 'grn' },
    ] })}`,
    `${box('bad', '<strong>tj-actions/changed-files, 03/2025:</strong> thẻ bị dời sang commit độc ⇒ workflow ghim thẻ in secret ra log công khai; workflow ghim SHA thì không.')}
     ${box('warn', 'api-backend (24/09/2026): <strong>24 dòng <code>uses:</code>, 0 dòng ghim SHA</strong>. Ghim + Dependabot <code>github-actions</code> để SHA không già.')}
     ${box('info', 'checkout mặc định <code>--depth=1</code>: không có <code>origin/main</code> ⇒ diff ba chấm "ambiguous argument". <code>persist-credentials: false</code> gỡ khoá khỏi <code>.git</code>.')}`) },

  /* 9 */ { t: 'Ch 5 — Cache là tối ưu có thể biến mất; artifact là bàn giao', body: two(
    `${bars([
      { l: 'không cache', sub: 'npm ci trên runner', v: 17.5, txt: '17,5 s', c: 'dim' },
      { l: 'cache: npm', sub: 'giữ ~/.npm', v: 13.7, txt: '13,7 s (−22%)', c: 'blu' },
      { l: 'cache node_modules', sub: 'bỏ npm ci khi trúng', v: 3.6, txt: '3,6 s (−79%)', c: 'grn' },
    ], { lw: 250, max: 17.5 })}<div style="height:22px"></div>
     ${box('info', 'Hoà vốn: cache node_modules lãi khi tỉ lệ trúng trên ~26%. Lần chạy ĐẦU luôn chậm hơn (lưu ở bước Post).')}`,
    table(['', 'cache', 'artifact'], [
      ['Mục đích', 'tăng tốc, có thể MẤT', 'bàn giao, bảo đảm'],
      ['Sống', '7 ngày không dùng · 10 GB/kho', 'mặc định 90 ngày'],
      ['Ghi', 'một lần / khoá (ghi lần 2 bị từ chối)', 'trùng tên ⇒ 409'],
      ['Khoá', 'OS + phiên bản + <code>hashFiles(lock)</code>', 'tên theo nhánh ma trận'],
      ['Bẫy', '-khoá có <code>github.sha</code>: trượt mãi', '-zip bỏ bit thực thi'],
    ], { sm: true })) },

  /* 10 */ { t: 'Ch 6 — Che bí mật chỉ phủ ĐÚNG chuỗi đã lưu, trong LOG', body: two(
    table(['Giá trị giả đã đo', 'Bị che?'], [
      ['chính giá trị', '+có'],
      ['base64 trơn của nó', '+có'],
      ['từng dòng của secret nhiều dòng', '+có'],
      ['viết hoa · thay ký tự · tiền tố', '-KHÔNG'],
      ['một trường trong khối JSON', '-KHÔNG'],
      ['tệp · artifact · request mạng', '-KHÔNG (che chỉ ở log)'],
    ], { sm: true }) + box('bad', 'Rò ⇒ XOAY khoá trước, xoá log sau.'),
    `${yaml([
      ['permissions:', 'nêu một quyền ⇒'],
      ['  contents: read', 'phần còn lại = none'],
      ['jobs:', ''],
      ['  deploy:', ''],
      ['    permissions:', 'THAY khối trên,'],
      ['      contents: read', 'không cộng'],
      ['      id-token: write', 'OIDC: JWT sống 300 s'],
    ], { fs: 15 })}
     ${box('info', '<code>GITHUB_TOKEN</code>: một job, một kho, hết hạn cùng job. Liên kho: token GitHub App › PAT fine-grained › (không) PAT classic.')}`) },

  /* 11 */ { t: 'Ch 7 — Chỉ job trên đường tới hạn làm run nhanh hơn', body: pipe({ w: 1160, h: 170, cols: [[{ n: 'cai', s: 'ok', d: '15s' }], [{ n: 'linux', s: 'ok', d: '90s' }, { n: 'macos', s: 'ok', d: '430s' }], [{ n: 'phat-hanh', s: 'ok', d: '20s' }]], needs: [['cai', 'linux'], ['cai', 'macos'], ['linux', 'phat-hanh'], ['macos', 'phat-hanh']] }) + two(
    box('warn', 'Đường tới hạn đi qua <strong>macos</strong>. Giảm nửa job Linux của api-backend (độ chùng 199 s) tiết kiệm <strong>0 s</strong>; dựng macOS −20% ≈ 87 s.') +
    box('info', 'Cùng commit, 14 lần: 37–77 s (2,08×) ⇒ so TRUNG VỊ theo cặp. Giá 09/2026 (kho riêng tư): Linux $0,006 · Windows $0,010 · macOS $0,062 mỗi phút.'),
    table(['concurrency · 3 cú push', 'Commit cuối xong'], [
      ['<code>cancel-in-progress: true</code>', '+154 s — hợp PR'],
      ['<code>false</code> (mặc định)', '!183 s — bỏ ÂM THẦM commit giữa'],
      ['<code>queue: max</code>', '274 s — chạy đủ mọi commit'],
    ], { sm: true })) },

  /* 12 */ { t: 'Ch 8 — Đọc mã thoát trước, đọc log sau', body: two(
    table(['Mã', 'Nghĩa', 'Làm gì'], [
      ['1', 'công cụ phán: test/lint hỏng', 'đọc dòng lỗi phía trên <code>##[error]</code>'],
      ['2 · 126 · 127', 'shell không chạy nổi lệnh', 'sai cú pháp / thiếu quyền / thiếu lệnh'],
      ['134', 'V8 bỏ cuộc ồn ào (hết heap)', 'nâng trần <code>--max-old-space-size</code>'],
      ['137', 'nhân giết im lặng (OOM)', 'hạ trần heap dưới RAM máy — ngược 134'],
      ['(không mã)', '"The operation was canceled."', 'huỷ / hết giờ: SIGINT → SIGTERM → kill'],
    ], { sm: true }),
    `${steps([
      ['Annotation cuối trang run', 'đã in mã thoát từng job'],
      ['Job ĐỎ ĐẦU TIÊN', 'job xám là hệ quả của needs:'],
      ['Bước đỏ', '<code>gh run view --log-failed</code>'],
      ['Dòng lỗi THẬT', '<code>grep -F -B 25 "##[error]"</code>'],
    ])}
     ${box('warn', 'Flake 20%: chạy lại 4 nhánh đỏ, cả 4 xanh với xác suất 0,8⁴ ≈ 41% — "chạy lại thì qua" KHÔNG chứng minh gì.')}`) },

  /* 13 */ { t: 'Ch 9 — Deploy an toàn cần một đường, một khoá, và rollback', body: two(
    cards([
      { ic: '1️⃣', t: 'Một đường deploy', d: '06/07/2026: paths: trùng ⇒ 3 lần chạy cùng sửa container trong 74 s', c: 'red' },
      { ic: '🔒', t: 'Khoá CHUNG mọi đường', d: 'nhóm concurrency chỉ giữ 1 lần chờ — migration bị thay', c: 'amb' },
      { ic: '⏮', t: 'Rollback trên đường deploy', d: 'sân tập: ảnh hỏng → sập 12,6 s, rollback 2,2 s, job vẫn ĐỎ', c: 'grn' },
      { ic: '🚦', t: 'environment có người duyệt', d: 'duyệt · từ chối · chặn nhánh — đều đã đo', c: 'blu' },
    ], 2),
    `${box('bad', '"Bản trước" là thứ production ĐANG chạy, không phải <code>HEAD^</code> — sau một rollback, HEAD^ chính là bản hỏng.')}
     ${box('info', 'Site của bạn deploy bằng <code>bash deploy-nha.sh</code> (và nó TỰ <code>git push</code> ở cuối). GitHub Actions ở kho này chỉ tự chạy CI: 12/14 workflow chỉ bấm tay.')}
     ${box('tip', 'Schema: expand → chép → contract. Mỗi bước rollback được bằng MÃ.')}`) },

  /* 14 */ { t: 'Ch 10 — Chẩn đoán bằng một phép đo rẻ trước khi sửa', body: two(
    `${t([
      'curl -s -o /dev/null -w "%{http_code}\\n" \\',
      '  https://cuongthai.com/api/v1/gifs',
      '401         # route CÓ trong bản dựng (cần đăng nhập)',
      '# 200 = có, công khai · 404 = KHÔNG có → bản dựng cũ',
      'lsof -ti:3000 | xargs -r kill -9   # diệt theo CỔNG',
      '! pkill -f "next start"   # rc=1: tên đã đổi thành next-server',
    ], 'phép đo rẻ nhất', 14.5)}`,
    `${list([
      '<strong>10.1</strong> Bản dựng cũ: 404 với 401 là phép chẩn đoán',
      '<strong>10.2</strong> Checklist xanh chỉ chứng minh những tệp nó mở — seed nằm ngoài',
      '<strong>10.3</strong> Bộ kiểm chưa từng đỏ không phải bộ kiểm (chốt wget 7 tuần)',
      '<strong>10.4</strong> Diệt theo tên trượt; diệt theo cổng rồi xác nhận',
      '<strong>10.5</strong> Migration hỏng là câu hỏi TRẠNG THÁI — đo bằng <code>migrate diff</code>, không <code>resolve</code> bừa',
    ])}`) },

  /* 15 */ { t: 'Một workflow CI mẫu gom cả nửa khoá, từng dòng một chương', body: yaml([
    ['name: ci', ''],
    ['on:', ''],
    ['  pull_request:', 'Ch1 · chạy trên merge commit'],
    ['  push: { branches: [main] }', 'Ch1 · KHÔNG deploy ở đây (Ch9)'],
    ['permissions: { contents: read }', 'Ch6 · quyền tối thiểu'],
    ['concurrency:', 'Ch7'],
    ['  group: ci-${{ github.ref }}', 'một run mỗi nhánh/PR'],
    ['  cancel-in-progress: true', 'PR thì huỷ run cũ; deploy thì KHÔNG'],
    ['jobs:', ''],
    ['  test:', ''],
    ['    runs-on: ubuntu-24.04', 'Ch2 · ghim ảnh, không -latest'],
    ['    timeout-minutes: 15', 'Ch2 · treo thì chết sớm'],
    ['    defaults: { run: { shell: bash } }', 'Ch2/8 · có pipefail'],
    ['    steps:', ''],
    ['      - uses: actions/checkout@<sha40> # v4', 'Ch4 · ghim SHA'],
    ['        with: { persist-credentials: false }', 'Ch4/6'],
    ['      - uses: actions/setup-node@<sha40> # v4', ''],
    ['        with: { node-version-file: .nvmrc, cache: npm }', 'Ch4/5 · khoá tự tính'],
    ['      - run: npm ci && npm test', 'Ch8 · mã thoát là phán quyết'],
  ], { fs: 14 }) },

  /* 16 */ { t: '10 lỗi hay gặp nhất của nửa khoá (1–5)', body: cards([
    { ic: '📝', t: '1 · Tin YAML như đọc bằng mắt', d: '18.20 → 18.2 · <code>run: &gt;</code> gập lệnh · <code>on</code> → True (Ch1)', c: 'red' },
    { ic: '🎯', t: '2 · Lọc ô kiểm bắt buộc ở trigger', d: 'PR đứng "Expected" mãi — đưa điều kiện vào job (Ch1, 3)', c: 'ora' },
    { ic: '📦', t: '3 · Mong thứ gì đó tự qua job sau', d: 'tệp, biến, <code>export</code> đều mất — dùng artifact/outputs (Ch2)', c: 'amb' },
    { ic: '🔣', t: '4 · <code>if:</code> luôn đúng hoặc chết im', d: 'chữ ngoài <code>&#36;{{ }}</code> · chuỗi \'false\' · context gõ sai = rỗng (Ch3)', c: 'vio' },
    { ic: '📌', t: '5 · Ghim action theo thẻ/nhánh', d: '<code>@v4</code> là con trỏ; tj-actions 03/2025 (Ch4)', c: 'blu' },
    { ic: '🔍', t: 'Bắt sớm 1–5 thế nào', d: 'actionlint trước push (lược đồ, needs, nhãn sai) · zizmor (ghim thẻ, tiêm lệnh) · đặt nháy mọi phiên bản', c: 'grn' },
  ], 3) },

  /* 17 */ { t: '10 lỗi hay gặp nhất của nửa khoá (6–10)', body: cards([
    { ic: '🧊', t: '6 · Cache không ai đo', d: 'khoá có <code>github.sha</code> trượt mãi · cache rỗng ~0 MB vẫn "trúng" (Ch5)', c: 'tea' },
    { ic: '🔑', t: '7 · Tin mặt nạ che mọi thứ', d: 'giá trị biến đổi, JSON, tệp, artifact đều lọt (Ch6)', c: 'amb' },
    { ic: '🏎', t: '8 · Tối ưu job không nằm trên đường', d: 'Linux −50% = 0 s; tách job nhân đôi máy-giây (Ch7)', c: 'grn' },
    { ic: '🔁', t: '9 · Bấm Re-run làm phép chẩn đoán', d: 'cùng commit, flake 20% qua 4 lần ≈ 41% (Ch8)', c: 'pnk' },
    { ic: '🚀', t: '10 · Hai đường deploy, rollback đoán HEAD^', d: 'sự cố 06/07/2026 · bộ kiểm chưa từng đỏ (Ch9, 10)', c: 'red' },
    { ic: '🔍', t: 'Bắt sớm 6–10 thế nào', d: 'đọc 3 run liên tiếp · đếm lỗi theo tên test · làm hỏng bộ kiểm có chủ đích · hỏi prod đang chạy gì', c: 'blu' },
  ], 3) },

  /* 18 */ { t: 'Mẫu chung của cả mười lỗi: một thứ HỎNG mà không ỒN', body: flow([
      { e: '🤫', t: 'Hỏng im lặng', d: 'rỗng thay vì lỗi · xanh thay vì đỏ', c: 'red' },
      { e: '📏', t: 'Đo một lần', d: 'run thật, log thật, API', c: 'amb' },
      { e: '💥', t: 'Làm hỏng có chủ đích', d: 'bộ kiểm phải ĐỎ', c: 'vio' },
      { e: '🛡', t: 'Chốt thành phép kiểm', d: 'actionlint · zizmor · smoke-test', c: 'grn' },
    ]) + `<div style="height:18px"></div>` + table(['Lỗi im lặng', 'Tín hiệu duy nhất', 'Chương'], [
      ['bộ lọc <code>src/*</code> hỏng', 'run KHÔNG xuất hiện', 'Ch 1'],
      ['<code>hashFiles</code> không khớp', 'khoá kết thúc bằng <code>-</code>', 'Ch 3'],
      ['khoá <code>with:</code> gõ sai', 'cảnh báo vàng "Unexpected input"', 'Ch 4'],
      ['cache rỗng', '<code>Cache Size: ~0 MB</code> ở bước Post', 'Ch 5'],
      ['ống giấu mã thoát', 'bước xanh, log có "command not found"', 'Ch 2 · 8'],
      ['concurrency bỏ commit giữa', 'run "cancelled" mà không ai bấm', 'Ch 7'],
    ], { sm: true }) },

  /* 19 */ { t: 'Tự kiểm: tôi đã làm được những việc này chưa?', body: two(list([
    '☐ Viết workflow PR + push, lọc <code>paths</code> đúng, không khoá chết ô kiểm bắt buộc',
    '☐ Chia 3 job, truyền một phiên bản từ job đầu tới job cuối qua outputs',
    '☐ Ma trận 3 OS có <code>exclude</code>/<code>include</code>, <code>fail-fast: false</code>',
    '☐ Viết <code>if:</code> cho "chỉ main, chỉ khi test hỏng, kể cả khi bị huỷ"',
    '☐ Ghim mọi action bằng SHA + bật Dependabot <code>github-actions</code>',
    '☐ Đo cache bằng 3 run liên tiếp, đọc 4 dòng log + kích thước',
  ]), list([
    '☐ Đặt <code>permissions:</code> tối thiểu và đọc kết quả trong "Set up job"',
    '☐ Giải thích OIDC thay khoá cloud thế nào (claim <code>sub</code>, <code>aud</code>)',
    '☐ Tìm đường tới hạn của một run từ API jobs',
    '☐ Đọc một run đỏ theo 4 bậc trong &lt; 5 phút bằng <code>gh</code>',
    '☐ Viết job deploy: lưu PREV → tráo → kiểm → rollback → vẫn đỏ',
    '☐ Làm hỏng một bộ kiểm có chủ đích và thấy nó ĐỎ',
  ])) },

  /* 20 */ { t: 'Câu hỏi phỏng vấn nền tảng (1/2): trả lời bằng cơ chế + số đo', body: table(['Câu hỏi', 'Ý chính phải nói'], [
    ['Workflow, job, step, action khác nhau thế nào?', 'workflow = tệp; job = một máy; step = một tiến trình; action = mã đóng gói gọi bằng <code>uses:</code>'],
    ['PR xanh, merge xong main đỏ — sao được?', 'PR chạy trên merge commit lúc đó; main đã đi tiếp ⇒ "require up to date" / merge queue'],
    ['Truyền dữ liệu giữa hai job?', 'outputs (chuỗi nhỏ) hoặc artifact (tệp); không có đĩa chung'],
    ['Vì sao ghim SHA thay vì @v4?', 'thẻ trỏ lại được (tj-actions 03/2025); SHA bất biến; Dependabot để cập nhật'],
    ['<code>pull_request_target</code> nguy hiểm ở đâu?', 'chạy với quyền + secret của kho gốc; checkout mã PR = trao secret cho fork'],
    ['Cache và artifact khác gì?', 'cache = tối ưu, có thể mất; artifact = bàn giao bảo đảm, có hạn giữ'],
    ['CI mất 12 phút, bạn bắt đầu từ đâu?', 'đo đường tới hạn trước; chỉ job trên đường mới đáng tối ưu'],
    ['Secret có bị che trong log không?', 'chỉ đúng chuỗi đã lưu, chỉ trong log; biến đổi/tệp/artifact thì không'],
  ], { sm: true }) },

  /* 21 */ { t: 'Câu hỏi phỏng vấn nền tảng (2/2): kể một sự cố thật', body: table(['Câu hỏi', 'Ý chính phải nói'], [
    ['Deploy lên cloud mà không lưu khoá?', 'OIDC: <code>id-token: write</code>, JWT 5 phút, trust policy khớp <code>sub</code> tới environment'],
    ['Test hỏng, chạy lại thì qua — flake?', 'chưa chắc: chạy N lần, đếm; Re-run dùng CÙNG commit'],
    ['Exit 137 và 134 khác gì?', '137 = bị giết (OOM, im lặng); 134 = V8 tự bỏ cuộc — hai cách vá ngược nhau'],
    ['Hai workflow deploy đè nhau — chặn thế nào?', 'một đường deploy; một nhóm concurrency CHUNG theo đích; deploy bất biến'],
    ['Rollback một deploy hỏng?', 'lưu bản đang chạy trước khi tráo; kiểm sức khoẻ; tự tráo lại; job vẫn đỏ'],
    ['Deploy xanh mà endpoint mới 404?', 'curl không xác thực: 401/200 = có route, 404 = bản dựng cũ ⇒ dựng lại, thêm smoke-test'],
    ['Sao biết một bộ kiểm có tác dụng?', 'làm hỏng đích có chủ đích, thấy nó đỏ; danh sách trắng mã HTTP'],
  ], { sm: true }) },

  /* 22 */ { t: 'Bảng tra nhanh nửa khoá: lệnh và dòng YAML dùng nhiều nhất', body: table(['Muốn', 'Viết / chạy'], [
    ['Xem run gần nhất / log bước đỏ', '<code>gh run list -L 5</code> · <code>gh run view &lt;id&gt; --log-failed</code>'],
    ['Chạy lại có log gỡ lỗi', '<code>gh run rerun &lt;id&gt; --debug</code> (nhớ: CÙNG commit)'],
    ['Soát tĩnh trước khi push', '<code>actionlint</code> (đúng) + <code>zizmor</code> (bảo mật)'],
    ['Truyền giá trị', '<code>echo "v=1" &gt;&gt; "$GITHUB_OUTPUT"</code> · <code>needs.a.outputs.v</code>'],
    ['Điều kiện báo cáo / dọn', '<code>if: failure()</code> · <code>if: &#36;{{ !cancelled() }}</code> · <code>always()</code> không cho deploy'],
    ['Khoá cache', '<code>&#36;{{ runner.os }}-node22-&#36;{{ hashFiles(\'package-lock.json\') }}</code>'],
    ['Quyền tối thiểu', '<code>permissions: { contents: read }</code> ở đầu tệp'],
    ['Xem cache / huỷ một mục', '<code>gh cache list</code> · <code>gh cache delete &lt;khoá&gt;</code>'],
    ['Một deploy một lúc', '<code>concurrency: { group: production, cancel-in-progress: false }</code>'],
  ], { sm: true }) },

  /* 23 */ { t: 'Nửa sau khoá: từ "dùng được" tới "dựng cho cả đội"', body: cards([
    { ic: '♻️', t: 'Ch 12 · Tái sử dụng ở quy mô đội', d: 'reusable workflow <code>workflow_call</code> · composite · action JS/Docker tự viết · mẫu cho tổ chức', c: 'tea' },
    { ic: '🖥', t: 'Ch 13 · Runner của riêng bạn', d: 'self-hosted ephemeral trong container · vì sao KHÔNG cho kho công khai · ARC', c: 'blu' },
    { ic: '🛡', t: 'Ch 14 · Chất lượng, bảo mật, phát hành', d: 'rulesets · CodeQL · Dependabot · release tự động · attestation · monorepo', c: 'amb' },
    { ic: '🏁', t: 'Ch 15 · Dự án cuối khoá + thi cuối khoá', d: 'pipeline hoàn chỉnh từ số 0 · Postgres service · GHCR · deploy có cổng · 20 câu', c: 'grn' },
  ], 2) + box('info', 'Nửa đầu dạy ĐỌC và SỬA một pipeline đang có. Nửa sau dạy DỰNG một pipeline mà người khác dùng lại — đúng mức "chuyên gia" nhà tuyển dụng hỏi.') },

  /* 24 */ { t: 'Thực hành Chương 11 (60 phút): soát kho của chính bạn', body: two(list([
    '<strong>1.</strong> <code>ls .github/workflows</code> · với mỗi tệp ghi: sự kiện, <code>paths</code>, <code>permissions</code>, có chạm máy chủ không.',
    '<strong>2.</strong> Đếm <code>uses:</code> ghim SHA / tổng: <code>grep -h "uses:" .github/workflows/*.yml</code>.',
    '<strong>3.</strong> <code>gh run list --status failure -L 5</code> · đọc từng run theo 4 bậc, ghi mã thoát.',
    '<strong>4.</strong> Chọn MỘT lỗi trong 10 lỗi hay gặp mà kho bạn đang có; sửa trên nhánh, mở PR.',
    '<strong>5.</strong> Trả lời thành tiếng 5 câu phỏng vấn ở slide 20–21, mỗi câu ≤ 60 giây.',
  ]), box('good', '<strong>Đạt khi</strong> bạn có: một bảng soát (mỗi workflow một dòng), tỉ lệ ghim SHA đã đo, 5 mã thoát đã phân loại, một PR sửa một lỗi có link run xanh sau sửa — và bản ghi âm 5 câu trả lời.') + box('tip', 'Nộp kèm "số đo trước → sau" của lỗi đã sửa. Người phỏng vấn nhớ con số, không nhớ tính từ.')) },
]);
