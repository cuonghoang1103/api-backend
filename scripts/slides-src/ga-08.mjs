/**
 * GitHub Actions · Deck ga-08 — Chương 8: Khi CI đỏ.
 *
 * MỌI log/output mới trên slide là THẬT, chạy 24/09/2026 trên sân tập công khai
 * github.com/cuonghoang1103/ga-san-tap, nhánh ch08-do (ubuntu-24.04 image 20260920.314.1, macos-15, windows-2025):
 *   36011088172 ch08-kieu-do   — 10 kiểu đỏ: 1 (test, lint, npm), 2, 126, 127, 134, 137, hết giờ bước / job
 *   36011171932 ch08-huy       — huỷ giữa chừng: SIGINT, "The operation was canceled.", always() vẫn chạy
 *   36011171685 ch08-may       — runner đo thật: nhân / RAM / đĩa / trần heap V8
 *   36011087956 ch08-chap-chon — 20 nhánh cùng một test 20%: 4 đỏ; 200 vòng: 41 đỏ; rerun --failed → success
 *   36011088185 / 36012126658 / 36012290608 ch08-duong-ong — ma trận Node 20/22/24: đỏ glob → đỏ TypeError → xanh
 *   36012429462 ch08-oom       — docker inspect: OOMKilled=true, ExitCode=137
 * act 0.2.89 chạy ở máy (Mac M1, Docker, ảnh node:22-bookworm-slim, --rm). Lịch sử api-backend: chỉ đọc qua gh.
 */
import { S, cover, cards, box, table, two, list, mindmap, term as gaTerm, diagram, bars, kpis, pipe, sv, R, T, A, steps } from './_ga-chung.mjs';

export const deck = { key: 'ga-08', code: 'GITHUB ACTIONS · CHƯƠNG 8', title: 'Khi CI đỏ', sub: 'GitHub Actions · Chương 8' };

const t = (lines, title, fs = 15) => gaTerm(lines, { title, dir: '~/ga-san-tap', fs });

/* ───────────── Slide 4 — mười job, mười kiểu đỏ ───────────── */
const muoiKieuDo = () => {
  const rows = [
    ['test-sai', '1', 'AssertionError 169150 !== 169000', 'red'],
    ['lint', '1', '::error file=… SC2086 / SC2164', 'red'],
    ['npm-sai-ten', '1', 'npm error Missing script: "tset"', 'red'],
    ['cu-phap', '2', 'syntax error: unexpected end of file', 'amb'],
    ['khong-quyen', '126', './scripts/chay.sh: Permission denied', 'ora'],
    ['thieu-lenh', '127', 'eslnt: command not found', 'ora'],
    ['het-heap', '134', 'FATAL ERROR: Reached heap limit', 'vio'],
    ['oom-container', '137', '(không một dòng lỗi nào)', 'pnk'],
    ['het-gio-buoc', '—', "The action '…' has timed out after 1 minutes", 'blu'],
    ['het-gio-job', '—', 'The job has exceeded the maximum execution time', 'blu'],
  ];
  let s = '';
  rows.forEach(([j, c, m, col], i) => {
    const y = 6 + i * 44;
    s += R(0, y, 1160, 38, { c: 'dim', fill: i % 2 ? '#0f182a' : '#111a2b', r: 7, sw: 1 }) +
      `<circle cx="22" cy="${y + 19}" r="10" fill="#ff5c6c"/>` + T(22, y + 25, '✗', { fs: 14, c: '#08101e', a: 'middle', b: true }) +
      T(44, y + 25, j, { fs: 17, b: true, mono: true }) +
      R(230, y + 5, 70, 28, { c: col, fill: '#0b1322', r: 6, sw: 2 }) + T(265, y + 25, c, { fs: 17, b: true, mono: true, a: 'middle', c: col }) +
      T(322, y + 25, m, { fs: 16, mono: true, c: i === 7 ? 'mu' : 'tx' });
  });
  return sv(1160, 450, s);
};

/* ───────────── Slide 8 — dòng thời gian khi bấm Cancel ───────────── */
const dongThoiGianHuy = () => {
  let s = '';
  s += A(20, 120, 1140, 120, { c: 'mu', sw: 2.5 });
  const mk = (x, lab, sub, c) => {
    s += `<circle cx="${x}" cy="120" r="9" fill="${c === 'red' ? '#ff5c6c' : c === 'amb' ? '#ffc233' : c === 'grn' ? '#3fb950' : '#58a6ff'}"/>` +
      T(x, 90, lab, { fs: 18, b: true, a: 'middle' }) + T(x, 158, sub, { fs: 15, a: 'middle', c: 'mu' });
  };
  mk(80, 'bấm Cancel', '14:14:01', 'blu');
  mk(300, 'SIGINT', 'gửi ngay cho bước', 'amb');
  mk(640, 'SIGTERM', '+7 500 ms nếu chưa thoát', 'amb');
  mk(960, 'giết cả cây tiến trình', '+2 500 ms nữa', 'red');
  s += R(20, 200, 1120, 150, { c: 'grn', fill: 'rgba(63,185,80,.06)', dash: true });
  s += T(40, 232, 'Đo trên run 36011171932 — trap bắt được đúng tín hiệu ĐẦU:', { fs: 17, b: true, c: 'grn' });
  s += T(40, 264, 'bat dau 14:13:08, pid 2284', { fs: 16, mono: true });
  s += T(40, 290, 'nhan SIGINT luc 14:14:01      ← không phải SIGTERM', { fs: 16, mono: true, c: 'amb' });
  s += T(40, 316, '##[error]The operation was canceled.   ← KHÔNG có "exit code …"', { fs: 16, mono: true, c: 'red' });
  s += T(40, 342, 'buoc always() van chay sau khi huy? job.status=cancelled', { fs: 16, mono: true, c: 'tx' });
  s += T(580, 400, 'Hết giờ (timeout-minutes) đi CÙNG con đường này — nên cũng không có mã thoát.', { fs: 17, a: 'middle', c: 'mu' });
  return sv(1160, 420, s);
};

/* ───────────── Slide 10 — 20 nhánh ma trận ───────────── */
const haiMuoiNhanh = () => {
  const red = [1, 3, 8, 20];
  let s = '';
  for (let i = 1; i <= 20; i++) {
    const c = (i - 1) % 5, r = Math.floor((i - 1) / 5);
    const x = 20 + c * 180, y = 10 + r * 64, bad = red.includes(i);
    s += R(x, y, 164, 50, { c: bad ? 'red' : 'grn', fill: '#0f182a', r: 10 }) +
      `<circle cx="${x + 24}" cy="${y + 25}" r="11" fill="${bad ? '#ff5c6c' : '#3fb950'}"/>` +
      T(x + 24, y + 31, bad ? '✗' : '✓', { fs: 15, c: '#08101e', a: 'middle', b: true }) +
      T(x + 46, y + 31, `lan (${i})`, { fs: 17, mono: true, b: true });
  }
  s += R(940, 10, 210, 242, { c: 'amb', fill: 'rgba(255,194,51,.06)' });
  s += T(1045, 60, '4 / 20', { fs: 40, b: true, a: 'middle', c: 'amb' });
  s += T(1045, 92, 'nhánh đỏ', { fs: 17, a: 'middle', c: 'mu' });
  s += T(1045, 160, '41 / 200', { fs: 34, b: true, a: 'middle', c: 'amb' });
  s += T(1045, 190, 'vòng lặp trên', { fs: 16, a: 'middle', c: 'mu' });
  s += T(1045, 212, '1 runner', { fs: 16, a: 'middle', c: 'mu' });
  s += T(20, 300, 'Cùng một commit, cùng một tệp test, fail-fast: false. Bài “đua” thua khi Math.random() < 0,2.', { fs: 17 });
  s += T(20, 330, 'Đỏ không theo vị trí, không theo máy — nó rơi ngẫu nhiên. Đó là chữ ký của một test chập chờn xác suất.', { fs: 17, c: 'mu' });
  return sv(1160, 345, s);
};

/* ───────────── Slide 21 — cây quyết định đọc run đỏ ───────────── */
const cayQuyetDinh = () => diagram({
  w: 1160, h: 470,
  nodes: [
    { id: 'a', x: 0, y: 0, w: 250, h: 96, t: '① Annotation', d: 'đầu trang run\n“exit code 134” / “timed out”', c: 'dk' },
    { id: 'b', x: 305, y: 0, w: 260, h: 96, t: '② Job đỏ ĐẦU TIÊN', d: 'bỏ qua job xám ⊘ và\njob đỏ vì needs:', c: 'red' },
    { id: 'c', x: 620, y: 0, w: 240, h: 96, t: '③ Bước đỏ', d: 'nhóm log có ✗\n(các bước sau: “-”)', c: 'amb' },
    { id: 'd', x: 915, y: 0, w: 245, h: 96, t: '④ Dòng lỗi THẬT', d: 'PHÍA TRÊN ##[error]\ntìm “not ok”, “Error:”', c: 'grn' },
    { id: 'x1', x: 0, y: 190, w: 250, h: 110, t: 'Không có exit code?', d: 'canceled → ai huỷ / fail-fast\ntimed out → treo hay chậm', c: 'vio' },
    { id: 'x2', x: 305, y: 190, w: 260, h: 110, t: 'Chỉ 1 nhánh ma trận đỏ?', d: 'khác biệt nền tảng / phiên bản\n→ bài 8.3: tái lập đúng nhánh', c: 'tea' },
    { id: 'x3', x: 620, y: 190, w: 240, h: 110, t: 'Mã 127 / 126 / 2?', d: 'chương trình CHƯA chạy\n→ sửa lệnh, quyền, cú pháp', c: 'ora' },
    { id: 'x4', x: 915, y: 190, w: 245, h: 110, t: 'Đỏ lặp cùng tên test?', d: 'không phải flake\n→ đừng bấm re-run', c: 'pnk' },
    { id: 'e', x: 305, y: 370, w: 555, h: 90, t: 'Chỉ tới đây mới mở cả log / chạy lại / tái lập ở máy', d: 'gh run view --log-failed · rerun --failed --debug · act / docker run cùng image', c: 'dim' },
  ],
  edges: [
    { from: 'a', to: 'b' }, { from: 'b', to: 'c' }, { from: 'c', to: 'd' },
    { from: 'a', to: 'x1', fs: 'b', ts: 't', dash: true }, { from: 'b', to: 'x2', fs: 'b', ts: 't', dash: true },
    { from: 'c', to: 'x3', fs: 'b', ts: 't', dash: true }, { from: 'd', to: 'x4', fs: 'b', ts: 't', dash: true },
    { from: 'x2', to: 'e', fs: 'b', ts: 't' }, { from: 'x3', to: 'e', fs: 'b', ts: 't' },
  ],
});

/* ───────────── Slide 24 — log 502 dòng, lỗi ở dòng 116 ───────────── */
const logDai = () => {
  let s = '';
  s += R(0, 0, 330, 440, { c: 'dim', fill: '#070c16', r: 10 });
  for (let i = 0; i < 40; i++) {
    const y = 14 + i * 10.5, w = 60 + ((i * 37) % 200);
    const hot = i === 9, sum = i >= 36;
    s += `<rect x="16" y="${y}" width="${w}" height="5" rx="2" fill="${hot ? '#ff5c6c' : sum ? '#ffc233' : '#2a3a55'}"/>`;
  }
  s += A(345, 112, 400, 112, { c: 'red' }) + A(345, 410, 400, 410, { c: 'amb' });
  s += R(410, 70, 750, 110, { c: 'red', fill: 'rgba(255,92,108,.07)' });
  s += T(430, 102, 'dòng 116 / 502 — lỗi THẬT', { fs: 18, b: true, c: 'red' });
  s += T(430, 132, "not ok 15 - chạm trần token thì VIẾT TIẾP, không trả về câu cụt", { fs: 15.5, mono: true });
  s += T(430, 160, "error: không có khung 'done'. Sự kiện: [\"error\"] · vietTiepLuot.test.ts:63", { fs: 15, mono: true, c: 'mu' });
  s += R(410, 360, 750, 80, { c: 'amb', fill: 'rgba(255,194,51,.06)' });
  s += T(430, 392, 'đáy log — thứ bạn thấy ĐẦU TIÊN', { fs: 18, b: true, c: 'amb' });
  s += T(430, 420, '# pass 68 · # fail 1 · ##[error]Process completed with exit code 1.', { fs: 15.5, mono: true });
  s += T(430, 230, 'api-backend, run 32243769111 (19/08/2026), bước “Unit tests — money math…”.', { fs: 16 });
  s += T(430, 258, 'Đáy log chỉ là TỔNG KẾT. Nó nói “có 1 bài hỏng”, không nói bài nào.', { fs: 16, c: 'mu' });
  s += T(430, 296, 'Tìm ngược lên: “not ok” (node:test) · “FAIL” (jest/vitest)', { fs: 16, c: 'grn' });
  s += T(430, 322, '· “error TS” (tsc) · “npm error” · “Error:” đầu tiên.', { fs: 16, c: 'grn' });
  return sv(1160, 445, s);
};

/* ───────────── Slide 26 — ba lần chạy của một bản vá ───────────── */
const baVongVa = () => {
  let s = '';
  const col = (x, title, id, n20, msg, c) => {
    s += R(x, 0, 360, 380, { c, fill: '#0f182a' });
    s += T(x + 20, 36, title, { fs: 19, b: true, c });
    s += T(x + 20, 62, 'run ' + id, { fs: 15, mono: true, c: 'mu' });
    [['lint', 'ok'], ['test (20)', n20], ['test (22)', 'ok'], ['test (24)', 'ok'], ['build', n20 === 'ok' ? 'ok' : 'skip'], ['deploy', n20 === 'ok' ? 'ok' : 'skip']].forEach(([j, st], i) => {
      const y = 84 + i * 34, cc = st === 'ok' ? '#3fb950' : st === 'fail' ? '#ff5c6c' : '#6b7a93';
      s += `<circle cx="${x + 34}" cy="${y + 12}" r="9" fill="${cc}"/>` + T(x + 34, y + 17, st === 'ok' ? '✓' : st === 'fail' ? '✗' : '⊘', { fs: 12, c: '#08101e', a: 'middle', b: true }) +
        T(x + 54, y + 18, j, { fs: 16, mono: true });
    });
    msg.forEach((m, i) => { s += T(x + 20, 322 + i * 26, m, { fs: 14.5, mono: i === 0, c: i === 0 ? 'tx' : 'mu' }); });
  };
  col(0, 'Vòng 0 — đỏ', '36011088185', 'fail', ["Could not find '…/*.test.js'", 'Node 20 không hiểu glob'], 'red');
  col(400, 'Vòng 1 — vẫn đỏ', '36012126658', 'fail', ['ds.values(...).map is not a function', 'lỗi thứ HAI lộ ra'], 'amb');
  col(800, 'Vòng 2 — xanh', '36012290608', 'ok', ['ds.map((x) => x * 2)', 'cả 3 phiên bản Node'], 'grn');
  s += A(362, 165, 398, 165, { c: 'mu' }) + A(762, 165, 798, 165, { c: 'mu' });
  s += T(580, 420, 'Mỗi vòng: tái lập ở máy bằng docker run node:20-slim TRƯỚC, rồi mới push.', { fs: 17, a: 'middle' });
  s += T(580, 448, 'Vá cú đỏ thứ nhất không có nghĩa là hết đỏ — nó có thể chỉ mở cửa cho cú thứ hai.', { fs: 16, a: 'middle', c: 'mu' });
  return sv(1160, 460, s);
};

export const slides = S([
  /* 1 */ cover({ t: 'Chương 8 — Khi CI đỏ', sub: 'mã thoát · test chập chờn · tái lập ở máy · thứ tự đọc run đỏ · kiểm bản vá', chap: 'CHƯƠNG 8' }),

  /* 2 */ { t: 'Bản đồ chương: từ dấu ✗ đỏ tới bản vá có bằng chứng', body: mindmap('Khi CI đỏ', 'đọc đúng thứ tự, đo trước khi đoán, vá rồi chứng minh', [
    { t: '8.1 Mã thoát', d: '1 · 2 · 126 · 127 · 134 · 137 · huỷ/hết giờ', c: 'red' },
    { t: '8.2 Chập chờn', d: '4/20 nhánh · rerun --failed · thứ tự', c: 'amb' },
    { t: '8.3 Tái lập', d: 'runner đo thật · act · docker cùng image', c: 'tea' },
    { t: '8.4 Thứ tự đọc', d: 'annotation → job → bước → dòng lỗi', c: 'dk' },
    { t: '8.5 Kiểm bản vá', d: 'đỏ ở máy → vá → xanh ở máy → push', c: 'grn' },
  ]) },

  /* ───── 8.1 ───── */
  /* 3 */ { t: 'Bảng mã thoát: con số nói ai đã dừng tiến trình', body: table(['Mã', 'Nghĩa', 'Dòng log thật (run 36011088172)', 'Việc đầu tiên'], [
    ['<code>1</code>', 'công cụ tự báo hỏng', '<code>169150 !== 169000</code> · <code>Missing script</code>', 'đọc đầu ra của công cụ'],
    ['<code>2</code>', 'bash: cú pháp / dùng sai', '<code>syntax error: unexpected end of file</code>', '!chạy actionlint trước khi push'],
    ['<code>126</code>', 'thấy tệp, không chạy được', '<code>./scripts/chay.sh: Permission denied</code>', '<code>git update-index --chmod=+x</code>'],
    ['<code>127</code>', 'không tìm thấy lệnh', '<code>eslnt: command not found</code>', 'gõ sai? bước cài bị bỏ?'],
    ['<code>130</code>', '128+2 · SIGINT', '(Ctrl-C; runner gửi khi bạn huỷ)', 'ai huỷ — không phải lỗi mã'],
    ['<code>134</code>', '128+6 · SIGABRT', '<code>FATAL ERROR: Reached heap limit</code>', 'V8 hết heap → giảm dùng / nâng trần'],
    ['<code>137</code>', '128+9 · SIGKILL', '<strong>không có dòng nào</strong> · <code>OOMKilled=true</code>', '-máy/container hết RAM THẬT'],
    ['<code>143</code>', '128+15 · SIGTERM', 'bị yêu cầu dừng (docker stop, huỷ quá 7,5 s)', 'tìm ai gửi tín hiệu'],
  ], { sm: true }) },

  /* 4 */ { t: 'Một run, mười job, mười kiểu đỏ — annotation đã nói gần hết', body: muoiKieuDo() },

  /* 5 */ { t: '127 và 1: gõ sai tên LỆNH khác gõ sai tên SCRIPT npm', body: two(
    t(['##[group]Run eslnt .', 'shell: /usr/bin/bash --noprofile --norc -e -o pipefail {0}', '##[endgroup]', '! …/_temp/50ebfc49….sh: line 1: eslnt: command not found', '! ##[error]Process completed with exit code 127.', '# chương trình CHƯA hề chạy'], 'job thieu-lenh', 14),
    t(['##[group]Run npm run tset', '##[endgroup]', '! npm error Missing script: "tset"', 'npm error Did you mean this?', 'npm error   npm set # Set a value …', '! ##[error]Process completed with exit code 1.', '# npm CÓ chạy — và tự chọn mã 1'], 'job npm-sai-ten', 14)) +
    box('info', 'Cùng là “gõ sai”, nhưng 127 nói <strong>shell</strong> không tìm thấy chương trình, còn 1 nói chương trình đã chạy và <strong>tự</strong> báo lỗi. Đọc mã trước để biết nên đọc thông báo của ai.') },

  /* 6 */ { t: '126 và 2: thiếu chmod, thiếu fi — và dòng 1 VẪN chạy', body: two(
    t(['$ git ls-files -s ch08/app/scripts/chay.sh', '100644 e27c1f5… 0  ch08/app/scripts/chay.sh', '# 100644 = không có bit thực thi', '##[group]Run ./scripts/chay.sh', '! ./scripts/chay.sh: Permission denied', '! ##[error]Process completed with exit code 126.', '$ git update-index --chmod=+x scripts/chay.sh', '# → 100755, commit lại'], 'job khong-quyen', 14),
    t(['run: |', '  echo "dong nay KHONG duoc in…"', '  if [ -n "$HOME" ]; then', '    echo "co HOME"', '# ── log thật ──', '! …sh: line 4: syntax error: unexpected end of file', '+ dong nay KHONG duoc in, vi bash doc ca khoi truoc', '! ##[error]Process completed with exit code 2.'], 'job cu-phap', 14)) +
    box('warn', 'Tôi đoán bash đọc hết tệp rồi mới chạy — <strong>sai</strong>. Bash chạy từng lệnh khi đọc tới, nên các dòng TRƯỚC chỗ hỏng đã chạy xong. actionlint (có shellcheck) bắt lỗi này ở máy: <code>SC1046 Couldn&#39;t find &#39;fi&#39;</code>.') },

  /* 7 */ { t: '134 thì V8 kêu lên; 137 thì bị giết trong im lặng', body: two(
    t(['##[group]Run node --max-old-space-size=64 -e …', '<--- Last few GCs --->', '[2051:0xb206000] 684 ms: Mark-Compact 49.3 (66.4) -> 49.2 …', '! FATAL ERROR: Reached heap limit Allocation failed', '!   - JavaScript heap out of memory', '----- Native stack trace -----', '…sh: line 1: 2051 Aborted (core dumped) node …', '! ##[error]Process completed with exit code 134.'], 'job het-heap', 13.5),
    t(['$ docker run --name ga08-oom -m 128m node:22-alpine \\', '    node --max-old-space-size=4096 -e …', '# … không một dòng nào …', 'exit cua docker run: 137', '$ docker inspect ga08-oom --format …', '+ OOMKilled=true ExitCode=137', '# -m 128m, KHÔNG ép heap:', 'heap limit MB: 259   → vẫn 137'], 'run 36012429462', 13.5)) +
    box('bad', 'Đọc ngược là vá ngược: 134 → nâng <code>--max-old-space-size</code> (hoặc giảm bộ nhớ dùng). 137 → nâng trần V8 chỉ làm tệ hơn; phải giảm dùng hoặc cho máy/container thêm RAM.') },

  /* 8 */ { t: 'Huỷ và hết giờ KHÔNG có mã thoát — runner gửi SIGINT trước', body: dongThoiGianHuy() },

  /* ───── 8.2 ───── */
  /* 9 */ { t: 'Ba kiểu đỏ, ba cách chẩn đoán — chỉ một kiểu là “ngẫu nhiên”', body: cards([
    { ic: '🧱', t: 'Hỏng thật · 100%', d: '<code>169150 !== 169000</code>: đỏ mọi lần. Một lần xanh là đủ bác bỏ. Chạy lại = phí phút.', c: 'red' },
    { ic: '🎲', t: 'Chập chờn xác suất', d: 'Cuộc đua, đồng hồ, mạng, hạt ngẫu nhiên. Có <strong>tỉ lệ</strong> đo được: 41/200 = 20,5%.', c: 'amb' },
    { ic: '🔗', t: 'Phụ thuộc thứ tự', d: 'Xanh khi chạy riêng, đỏ sau bài khác. Không có tỉ lệ — có <strong>điều kiện</strong>. 5/5 lần đỏ như nhau.', c: 'vio' },
  ], 3) + box('tip', 'Câu hỏi đầu tiên không phải “chạy lại chưa?” mà là “<strong>cùng một tên test có đỏ lặp lại không?</strong>” — lặp lại thì gần như chắc là hỏng thật.') },

  /* 10 */ { t: '20 nhánh cùng một test: 4 đỏ, rải ngẫu nhiên', body: haiMuoiNhanh() },

  /* 11 */ { t: 'Nếu tỉ lệ thật là 20%, thấy 4/20 là chuyện bình thường nhất', body: two(
    bars([
      { l: '0 đỏ', v: 1.2, txt: '1,2%', c: 'grn' }, { l: '1 đỏ', v: 5.8, txt: '5,8%', c: 'grn' }, { l: '2 đỏ', v: 13.7, txt: '13,7%', c: 'blu' },
      { l: '3 đỏ', v: 20.5, txt: '20,5%', c: 'blu' }, { l: '4 đỏ ← đo được', v: 21.8, txt: '21,8%', c: 'amb' }, { l: '5 đỏ', v: 17.5, txt: '17,5%', c: 'blu' },
      { l: '6 đỏ', v: 10.9, txt: '10,9%', c: 'blu' }, { l: '7+ đỏ', v: 8.6, txt: '8,6%', c: 'blu' },
    ], { lw: 170, max: 24 }),
    list([
      'Phân bố nhị thức 20 lần, p = 0,2: đỉnh ở 4.',
      'Chỉ <strong>1,2%</strong> khả năng 20 lần đều xanh ⇒ “chạy 20 lần không thấy đỏ” mới là bằng chứng.',
      'Chạy lại 4 nhánh đỏ: xác suất cả 4 xanh là 0,8⁴ = <strong>41%</strong> — và lần đo này rơi đúng vào đó.',
      'api-backend: CI lint đỏ <strong>40/741</strong> lần (5,4%) — 11 lần trong đó là CÙNG một test, trong một ngày (slide 15).',
    ])) },

  /* 12 */ { t: 'rerun --failed: 4 nhánh đỏ thành xanh, cả run thành “success”', body: two(
    t(['$ gh run rerun 36011087956 --failed', '$ gh run view 36011087956 --json attempt,conclusion', '+ attempt 2 success', '$ gh api …/runs/36011087956/attempts/2/jobs', 'lan (1)  success  14:17:27Z  ← chạy lại', 'lan (2)  success  14:12:34Z  ← CHÉP từ lần 1', 'lan (4)  success  14:12:34Z  ← CHÉP từ lần 1', '# chỉ job đỏ (và job phụ thuộc) được chạy lại'], 'run 36011087956', 14),
    list([
      'Bug 20% vẫn nằm nguyên trong mã. Trang run giờ hiện ✓ xanh.',
      'Lần 1 vẫn xem được: <code>gh run view ID --attempt 1</code>.',
      'Re-run dùng <strong>CÙNG SHA, cùng ref</strong> của lần chạy gốc (docs) — nó không bao giờ kiểm một bản vá bạn vừa push.',
      'Tối đa 50 lần re-run, trong 30 ngày (docs, 09/2026).',
      '<strong>Dùng đúng chỗ:</strong> hạ tầng hỏng (runner chết, mạng npm), SAU khi đã đọc log.',
    ])) },

  /* 13 */ { t: 'Test hẹn giờ: 0/200 trên runner, 26/40 trong Docker trên Mac', body: two(
    bars([
      { l: 'runner ubuntu-24.04', sub: '200 vòng, 1 máy', v: 0, txt: '0 / 200', c: 'grn' },
      { l: 'Mac M1 chạy thẳng', sub: '40 vòng', v: 0, txt: '0 / 40', c: 'grn' },
      { l: 'Docker trên Mac, --cpus 4', sub: '40 vòng', v: 65, txt: '26 / 40', c: 'amb' },
      { l: 'Docker, --cpus 0.5', sub: '40 vòng', v: 67.5, txt: '27 / 40', c: 'ora' },
      { l: 'Docker, --cpus 0.1', sub: '40 vòng', v: 87.5, txt: '35 / 40', c: 'red' },
    ], { lw: 250, max: 100 }),
    t(['// hẹn 50 ms, đòi xong dưới 53 ms', 'await new Promise(r => setTimeout(r, 50));', 'assert.ok(ms < 53, `mat ${ms} ms`);', '# trong Docker trên Mac:', '! mat 60.4 ms', '! mat 53.0 ms', '! mat 58.2 ms'], 'test-chap-chon', 14)) +
    box('info', 'Tỉ lệ chập chờn là tính chất của <strong>test + môi trường</strong>, không của riêng test. Bóp CPU là cách tái lập loại “chỉ đỏ khi máy bận”.') },

  /* 14 */ { t: 'Phụ thuộc thứ tự: riêng thì xanh, cả tệp thì đỏ — mọi lần', body: two(
    t(['const gioHang = [];      // trạng thái CHUNG', "test('them mon vao gio', () => {", "  gioHang.push('ca-phe'); … });", "test('gio moi phai rong', () => {", '  assert.equal(gioHang.length, 0); });'], 'test-thu-tu/gio-hang.test.js', 14.5),
    t(["$ node --test --test-name-pattern='gio moi' …", "= chay RIENG 'gio moi phai rong': exit 0 · # pass 1 # fail 0", '$ node --test "test-thu-tu/*.test.js"', '! chay CA TEP (sau \'them mon\'):  exit 1 · # pass 1 # fail 1', '# 5 lần cả tệp: 1 1 1 1 1 — không ngẫu nhiên chút nào'], 'job vong-lap · run 36011087956', 13.5)) +
    box('tip', 'Trông “ngẫu nhiên” chỉ khi thứ tự thay đổi (chạy song song, chia mảnh, đổi danh sách tệp). Chẩn đoán: chạy riêng một bài. Vá: mỗi bài tự dựng và tự dọn trạng thái (<code>beforeEach</code>).') },

  /* 15 */ { t: 'Lịch sử thật của api-backend: đỏ lặp cùng tên = hỏng thật', body: table(['Run (api-backend)', 'Lúc (UTC)', 'Bước đỏ', 'Test đỏ'], [
    ['32129506023', '18/08 10:59', 'Unit tests — money math…', '<code>not ok 19 - thiếu khoá của nhóm thì LÙI…</code>'],
    ['32155902125', '18/08 15:40', 'Unit tests — money math…', '<code>not ok 22 - thiếu khoá của nhóm thì LÙI…</code>'],
    ['32178394854', '18/08 19:45', 'Unit tests — money math…', '<code>not ok 22 - thiếu khoá của nhóm thì LÙI…</code>'],
    ['… 8 run khác', '18/08', '-cùng bước', '-cùng test: 11 run đỏ trong ~9 giờ'],
    ['32243769111', '19/08 10:39', 'Unit tests — money math…', '<code>not ok 15 - chạm trần token thì VIẾT TIẾP…</code>'],
  ], { sm: true }) + box('warn', 'Mười một lần đỏ cùng một tên test trong một ngày không phải “CI chập chờn”. Số thứ tự đổi (19 → 22) giữa các commit — tên thì không đổi. Đếm theo <strong>tên test</strong>, không theo số.') },

  /* ───── 8.3 ───── */
  /* 16 */ { t: 'Runner đo thật: macOS có 7 GB và trần heap V8 chỉ 2 096 MB', body: table(['Runner (kho công khai)', 'Nhân', 'RAM đo', 'Đĩa trống', 'Node', 'Trần heap V8 mặc định'], [
    ['ubuntu-24.04 · 20260920.314.1', '4', '15 989 MB', '87 GB', 'v22.23.2', '<strong>4 144 MB</strong>'],
    ['windows-2025 · 20260907.229.1', '4', '16 379 MB', '32 GB', 'v22.23.2', '<strong>4 144 MB</strong>'],
    ['macos-15 (arm64) · 20260907.0337.1', '3', '7 168 MB', '43 GB', 'v22.23.2', '-<strong>2 096 MB</strong>'],
    ['Mac M1 của khoá (32 GB)', '—', '32 768 MB', '—', 'v22.21.0', '4 144 MB'],
    ['Docker trên Mac (VM 8 GB)', '—', '7 934 MB', '—', 'v22.23.1', '2 096 MB'],
    ['Docker <code>-m 1g</code> / <code>-m 128m</code>', '—', '1 GB / 128 MB', '—', 'v22', '524 / 259 MB'],
  ], { sm: true }) + box('info', 'Run 36011171685. Docs hứa 14 GB SSD — đo thấy nhiều hơn, nhưng đừng dựa vào phần dư. Trần heap chạy THEO máy: cùng một bản dựng, macOS có ngân sách bằng một nửa.') },

  /* 17 */ { t: 'Hỏi máy trước khi đoán: một dòng in trần heap', body: two(
    t(['- name: May nay la may nao', '  shell: bash', '  run: |', '    echo "runner: $RUNNER_OS $RUNNER_ARCH"', '    echo "image: $ImageOS $ImageVersion"', '    node -e \'console.log("heap limit MB:",', '      (require("v8").getHeapStatistics()', '        .heap_size_limit/1048576).toFixed(0))\''], 'ch08-may.yml', 14.5),
    t(['may (ubuntu-24.04)', '+ runner: Linux X64 · image: ubuntu24 20260920.314.1', '+ heap limit MB: 4144', 'may (macos-15)', '+ runner: macOS ARM64 · image: macos15 20260907.0337.1', '+ heap limit MB: 2096', 'may (windows-2025)', '+ heap limit MB: 4144'], 'run 36011171685', 14)) +
    box('warn', 'Bài 8.3 cũ nói “4 GB đã lỗi thời, máy này đo 8 240 MB”. Đo lại trên 3 runner + Mac + Docker: không nơi nào ra 8 240. Trên runner, 4 GB vẫn đúng — và macOS chỉ có 2 GB. Con số đúng là con số đo trên CHÍNH máy chạy CI.') },

  /* 18 */ { t: 'act tái lập nhánh Node 20 đỏ ở máy — không cần push', body: t([
    '$ act push -W .github/workflows/ch08-duong-ong.yml -j test --matrix node:20 \\',
    '      -P ubuntu-24.04=node:22-bookworm-slim --pull=false --rm',
    '[ch08-duong-ong/lint] 🏁  Job succeeded          # act chạy cả job trong needs:',
    '[ch08-duong-ong/test] ⭐ Run Main actions/setup-node@v5',
    '[ch08-duong-ong/test]   | node: v20.20.2',
    '[ch08-duong-ong/test]   ✅  Success - Main actions/setup-node@v5 [40.5s]',
    '[ch08-duong-ong/test] ⭐ Run Main npm test',
    "!   | Could not find '…/vong0/ch08/app/test-that/*.test.js'",
    "! [ch08-duong-ong/test] exitcode '1': failure",
    '# đúng dòng lỗi của run 36011088185 trên GitHub — ~45 giây, 0 phút Actions',
  ], 'act 0.2.89 · Mac M1', 14) + box('tip', '<code>-P nhãn=ảnh</code> quyết định container nào đóng vai runner. <code>--rm</code> dọn container sau khi xong; act còn tạo volume <code>act-toolcache</code> — xoá bằng <code>docker volume rm act-toolcache</code>.') },

  /* 19 */ { t: 'Cách rẻ hơn nữa: chạy đúng lệnh trong đúng image', body: two(
    t(['$ docker run --rm -v "$PWD":/app:ro -w /app \\', '    node:20-slim sh -c \'node --version; npm test\'', 'v20.20.2', "! Could not find '/app/test-that/*.test.js'", '# vá vòng 1 (bỏ glob), chạy lại:', '! not ok 2 - nhanDoi [1,2,3]', "!   name: 'TypeError'", '# vá vòng 2, chạy cả 3 bản:', '= v20.20.2 # pass 2 # fail 0', '= v22.23.1 # pass 2 # fail 0'], 'Mac · Docker', 14),
    list([
      'Không cần hiểu YAML — chỉ cần <strong>lệnh</strong> và <strong>phiên bản</strong> của nhánh đỏ.',
      'Vòng lặp tính bằng giây; CI tính bằng phút + chờ hàng đợi.',
      '<code>--rm</code> để không để lại container; <code>:ro</code> để lệnh không ghi bẩn thư mục.',
      'Bóp tài nguyên như runner: <code>-m 7g</code>, <code>--cpus 3</code> cho giống macOS.',
      '<strong>Không</strong> tái lập được: macOS/Windows, ảnh runner đúng bản, mạng của runner.',
    ])) },

  /* 20 */ { t: 'act giỏi và không giỏi việc gì', body: table(['Việc', 'act ở máy', 'Runner GitHub'], [
    ['Thử cú pháp, needs:, matrix, biểu thức', '+nhanh, 0 phút', 'mỗi lần 1 commit + chờ'],
    ['Tái lập lỗi lệnh / phiên bản Node', '+được (run trên)', '+được'],
    ['Cùng ảnh runner (phần mềm cài sẵn)', '-không — ảnh bạn chọn bằng -P', '+ubuntu24 20260920.314.1'],
    ['macOS / Windows', '-không', '+có'],
    ['Secret, OIDC, GITHUB_TOKEN thật', '!phải tự đưa vào (<code>-s</code>)', '+có'],
    ['Cache, artifact, concurrency', '!mô phỏng một phần', '+thật'],
    ['Số dòng trong log', '!<code>line 2</code> (act thêm 1 dòng)', '<code>line 1</code>'],
  ], { sm: true }) + box('info', 'Quy tắc: act để <strong>lặp nhanh</strong> trên workflow; docker cùng image để <strong>tái lập lệnh</strong>; runner thật để <strong>xác nhận</strong>.') },

  /* ───── 8.4 ───── */
  /* 21 */ { t: 'Cây quyết định: đọc một run đỏ theo bốn bậc', body: cayQuyetDinh() },

  /* 22 */ { t: 'Đồ thị job: đọc chỗ đỏ SỚM nhất, job xám chỉ là hệ quả', body: pipe({
    w: 1160, h: 300,
    cols: [[{ n: 'lint', s: 'ok', d: '5s' }], [{ n: 'test (20)', s: 'fail', d: '11s' }, { n: 'test (22)', s: 'ok', d: '7s' }, { n: 'test (24)', s: 'ok', d: '7s' }], [{ n: 'build', s: 'skip' }], [{ n: 'deploy', s: 'skip' }]],
    needs: [['lint', 'test (20)'], ['lint', 'test (22)'], ['lint', 'test (24)'], ['test (20)', 'build'], ['test (22)', 'build'], ['test (24)', 'build'], ['build', 'deploy']],
  }) + box('tip', 'Run 36011088185: một ô đỏ, hai ô xám. Một cột ma trận đỏ trong khi hai cột kia xanh = khác biệt <strong>phiên bản</strong>, không phải lỗi mã chung. fail-fast không kịp huỷ 22/24 vì chúng xong trước (7 s &lt; 11 s).') },

  /* 23 */ { t: 'gh run view --log-failed: chỉ in các bước đỏ', body: t([
    '$ gh run view 36011088185',
    '! X test (20) in 11s (ID 107671726176)',
    '!   X Run npm test',
    '  - build · - deploy',
    'ANNOTATIONS',
    '! X Process completed with exit code 1.   test (20): .github#10',
    '$ gh run view 36011088185 --log-failed      # 10 dòng, thay vì cả log',
    'test (20)  Run npm test  ##[group]Run npm test',
    'test (20)  Run npm test  shell: /usr/bin/bash --noprofile --norc -e -o pipefail {0}',
    "! test (20)  Run npm test  Could not find '/home/runner/work/…/test-that/*.test.js'",
    '! test (20)  Run npm test  ##[error]Process completed with exit code 1.',
    '$ gh run view --job 107671726176 --log | grep -n -B3 "##\\[error\\]"',
  ], 'annotation → job → bước → dòng lỗi', 14) },

  /* 24 */ { t: 'Dòng lỗi thật nằm PHÍA TRÊN — đáy log chỉ là tổng kết', body: logDai() },

  /* 25 */ { t: 'Chạy lại với debug: thêm ##[debug] cho từng bước', body: two(
    t(['$ gh run rerun 36011088185 --failed --debug', '$ gh run view … --attempt 2 --log-failed', "+ ##[debug]Evaluating condition for step: 'Run npm test'", '+ ##[debug]Evaluating: success()', '+ ##[debug]=> true', '+ ##[debug]Overwrite \'working-directory\' base on job defaults.', "+ ##[debug]Overwrite 'shell' base on job defaults.", '+ ##[debug]/usr/bin/bash --noprofile --norc -e -o pipefail /home/…/db6d….sh', '# 12 dòng debug thêm cho 1 bước'], 'run 36011088185 · attempt 2', 13.5),
    list([
      '<strong>Một lần:</strong> nút “Enable debug logging” khi re-run, hay <code>gh run rerun --debug</code>.',
      '<strong>Mọi run:</strong> secret hoặc biến <code>ACTIONS_STEP_DEBUG=true</code> (secret thắng biến).',
      '<code>ACTIONS_RUNNER_DEBUG=true</code>: thêm 2 tệp log chẩn đoán runner trong gói zip.',
      'Hữu ích khi <code>if:</code> không như ý, input của action, shell nào đang chạy.',
      'Không làm lỗi của CHƯƠNG TRÌNH bạn rõ hơn — đó là việc của lệnh <code>-v</code> của chính công cụ.',
    ])) },

  /* ───── 8.5 ───── */
  /* 26 */ { t: 'Ba lần chạy của một bản vá: vá lỗi một mở ra lỗi hai', body: baVongVa() },

  /* 27 */ { t: 'Kiểm bản vá: đỏ ở máy → vá → xanh ở máy → mới push', body: steps([
    ['<strong>Tái lập đỏ</strong> ở máy, đúng điều kiện', '<code>docker run node:20-slim npm test</code> → Could not find'],
    ['<strong>Vá</strong> và chạy lại dưới CÙNG điều kiện', 'vòng 1 → TypeError: vẫn đỏ, nhưng là lỗi KHÁC'],
    ['<strong>Vá tiếp</strong> tới khi mọi phiên bản xanh', 'v20 · v22 ở máy đều <code># fail 0</code> (v24 xác nhận trên CI)'],
    ['<strong>Push</strong> — CI chỉ còn là xác nhận', 'run 36012290608: 6/6 job ✓'],
    ['<strong>Giữ</strong> điều kiện trong CI mãi mãi', 'ma trận Node 20 ở lại ⇒ lỗi cùng loại không quay về im lặng'],
  ]) },

  /* 28 */ { t: 'Re-run không kiểm bản vá — nó chạy lại commit CŨ', body: diagram({
    w: 1160, h: 380,
    nodes: [
      { id: 'c1', x: 0, y: 30, w: 260, h: 90, t: 'commit A (có bug)', d: 'run #1 đỏ', c: 'red', mono: true },
      { id: 'c2', x: 0, y: 230, w: 260, h: 90, t: 'commit B (bản vá)', d: 'push → run MỚI', c: 'grn', mono: true },
      { id: 'r1', x: 430, y: 30, w: 300, h: 90, t: 'Re-run run #1', d: 'GITHUB_SHA = A (docs)\nkhông thấy bản vá', c: 'amb' },
      { id: 'r2', x: 430, y: 230, w: 300, h: 90, t: 'Run #2 trên B', d: 'đây mới là phép kiểm\nbản vá trên CI', c: 'grn' },
      { id: 'k1', x: 880, y: 30, w: 280, h: 90, t: 'xanh ⇒ ?', d: 'hạ tầng hồi phục,\nhay flake may mắn', c: 'dim' },
      { id: 'k2', x: 880, y: 230, w: 280, h: 90, t: 'xanh ⇒ bằng chứng', d: 'NẾU trước đó đã\ntái lập đỏ ở máy', c: 'grn' },
    ],
    edges: [{ from: 'c1', to: 'r1' }, { from: 'r1', to: 'k1' }, { from: 'c2', to: 'r2' }, { from: 'r2', to: 'k2' }, { from: 'c1', to: 'c2', t: 'git commit', dash: true }],
  }) },

  /* 29 */ { t: 'Sai lầm hay gặp ở Chương 8', body: cards([
    { ic: '🔁', t: 'Bấm re-run trước khi đọc', d: '4 nhánh đỏ → 4 xanh, bug 20% vẫn nằm đó. Re-run là SỬA CHỮA hạ tầng, không phải chẩn đoán.', c: 'red' },
    { ic: '⬇️', t: 'Chỉ đọc đáy log', d: 'Đáy là tổng kết (<code># fail 1</code>). Lỗi thật ở dòng 116/502 — tìm <code>not ok</code>, <code>FAIL</code>, <code>error TS</code>.', c: 'amb' },
    { ic: '🧮', t: 'Nhầm 134 với 137', d: '134: V8 tự bỏ, có FATAL ERROR. 137: bị giết, im lặng, <code>OOMKilled=true</code>. Hai bản vá ngược nhau.', c: 'vio' },
    { ic: '⏹️', t: 'Tưởng huỷ = 143', d: 'Runner gửi SIGINT trước; log chỉ có “The operation was canceled.” — không có mã thoát.', c: 'blu' },
    { ic: '🧑‍⚖️', t: 'Đổ tội job cuối', d: 'build/deploy xám vì <code>needs:</code>. Đọc ô đỏ SỚM nhất trong đồ thị.', c: 'ora' },
    { ic: '🖥️', t: 'Tin con số trên mạng', d: '“heap 4 GB”, “8 GB”… In trần heap trên CHÍNH runner: macOS 2 096 MB.', c: 'pnk' },
  ], 3) },

  /* 30 */ { t: 'Bảng tra nhanh Chương 8', body: table(['Muốn', 'Lệnh / cách làm'], [
    ['Xem job/bước đỏ + annotation', '<code>gh run view ID</code>'],
    ['Chỉ log của bước đỏ', '<code>gh run view ID --log-failed</code>'],
    ['Log một job, nhảy tới lỗi', '<code>gh run view --job JID --log | grep -n -B20 "##\\[error\\]"</code>'],
    ['Chạy lại job đỏ (+ job phụ thuộc)', '<code>gh run rerun ID --failed</code> · thêm <code>--debug</code> để có <code>##[debug]</code>'],
    ['Xem lại lần chạy trước', '<code>gh run view ID --attempt 1</code>'],
    ['Đếm tỉ lệ đỏ qua lịch sử', '<code>gh run list -w ci.yml -L 200 --json conclusion</code>'],
    ['Tái lập ở máy', '<code>act -j JOB --matrix node:20 --rm</code> · <code>docker run --rm node:20-slim …</code>'],
    ['Container bị giết vì RAM?', '<code>docker inspect C --format "{{.State.OOMKilled}}"</code>'],
    ['Chặn treo', '<code>timeout-minutes:</code> ở job (mặc định 360) và ở bước'],
    ['Bắt lỗi cú pháp trước khi push', '<code>actionlint</code> (gồm shellcheck)'],
  ], { sm: true }) },

  /* 31 */ { t: 'Thực hành Chương 8 (60 phút) trên kho của chính bạn', body: two(list([
    '<strong>1.</strong> Workflow có 4 job cố ý đỏ: <code>false</code>, <code>eslnt .</code>, script chưa chmod, <code>node --max-old-space-size=64</code>. Ghi mã thoát từng job từ annotation.',
    '<strong>2.</strong> Test đỏ 20% (<code>Math.random()</code>) chạy trong ma trận 10 nhánh, <code>fail-fast: false</code>. Đếm nhánh đỏ.',
    '<strong>3.</strong> <code>gh run rerun ID --failed</code>; so attempt 1 và 2.',
    '<strong>4.</strong> <code>gh run view ID --log-failed</code>; tìm dòng lỗi thật bằng <code>grep -n</code>.',
    '<strong>5.</strong> Tái lập một job đỏ ở máy bằng <code>docker run --rm</code> cùng image; vá; chạy lại; mới push.',
  ]), box('good', '<strong>Đạt khi</strong> bạn có: bảng 4 mã thoát (1, 127, 126, 134) chụp từ annotation; số nhánh đỏ ở attempt 1 và 2; một lệnh <code>docker run</code> in ra ĐÚNG dòng lỗi của CI trước khi vá và <code># fail 0</code> sau khi vá.<br><br>Dọn: xoá workflow thử, <code>docker volume rm act-toolcache</code> nếu có dùng act.')) },
]);
