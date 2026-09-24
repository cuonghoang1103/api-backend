/**
 * GitHub Actions · Deck ga-02 — Chương 2: Job, runner, và những cỗ máy ngồi chờ.
 *
 * MỌI log/output mới trên slide là THẬT, chạy 24/09/2026 trên sân tập công khai
 * github.com/cuonghoang1103/ga-san-tap, nhánh ch02-job (runner 2.337.0, ảnh ubuntu-24.04 20260920.314.1):
 *   35989945596 needs + outputs + skip lan truyền (8 job) · 35989945528 / 35990300805 ba hệ điều hành
 *   35989945632 / 35990300886 bước + mã thoát · 35989945581 ma trận (17 job) · 35990301016 bấm huỷ giữa chừng
 *   35990300992 nhãn runs-on (ubuntu-slim, nhãn gõ sai xếp hàng mãi) · actionlint 1.7.12 trên Mac.
 * Số của kho api-backend (run 32662461744 phát hành desktop) lấy từ bài cũ của chương.
 * Giá phút: docs.github.com/en/billing/reference/actions-runner-pricing (09/2026). Giới hạn: …/actions/reference/limits.
 */
import { S, cover, cards, box, table, two, list, mindmap, term as gaTerm, yaml, pipe, bars, sv, R, T, A, D } from './_ga-chung.mjs';

export const deck = { key: 'ga-02', code: 'GITHUB ACTIONS · CHƯƠNG 2', title: 'Job, runner và ma trận', sub: 'GitHub Actions · Chương 2' };

const t = (lines, title, fs = 15) => gaTerm(lines, { title, dir: '~/ga-san-tap', fs });
const line = (x1, y1, x2, y2, c = '#1d2a40', w = 1, dash = '') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${D[c] || c}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
const bar = (x, y, w, h, c, op = 0.85) => `<rect x="${x}" y="${y}" width="${Math.max(w, 2)}" height="${h}" rx="5" fill="${D[c] || c}" opacity="${op}"/>`;
const hatch = (x, y, w, h, c) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="none" stroke="${D[c]}" stroke-width="2" stroke-dasharray="6 5"/>`;

/* ───────────── Slide 4 — máy "mới" đã bật sẵn từ trước (uptime thật) ───────────── */
const mayDungSan = () => {
  // trục: 10:52:00 → 10:55:00 = 180 s, 1 s = 5.4 px, gốc x=200
  const X = (s) => 200 + s * 5.2, Y0 = 70;
  let s = '';
  [0, 30, 60, 90, 120, 150].forEach((v) => {
    s += line(X(v), 40, X(v), 250) + T(X(v), 30, `10:${String(52 + Math.floor(v / 60)).padStart(2, '0')}:${String(v % 60).padStart(2, '0')}`, { fs: 13.5, a: 'middle', c: 'dim', mono: true });
  });
  const row = (y, name, boot, js, je, c) =>
    T(0, y + 26, name, { fs: 17, b: true, mono: true }) +
    hatch(X(boot), y + 6, X(js) - X(boot), 32, 'mu') + T((X(boot) + X(js)) / 2, y + 28, `bật sẵn, chờ trong hồ · ${js - boot}s`, { fs: 14.5, a: 'middle', c: 'mu' }) +
    bar(X(js), y + 6, X(je) - X(js), 32, c) + T(X(je) + 8, y + 28, `job ${je - js}s`, { fs: 14.5, c });
  s += row(Y0, 'chuan-bi', 6, 157, 162, 'grn');
  s += row(Y0 + 70, 'dung', 73, 165, 168, 'tea');
  s += line(X(154), 44, X(154), 250, 'amb', 2, '6 5') + T(X(154) - 6, 272, 'git push 10:54:34', { fs: 14.5, c: 'amb', a: 'end' });
  s += R(0, 290, 1150, 64, { c: 'dim', fill: 'rgba(255,255,255,.03)', dash: true }) +
    T(575, 329, '“Máy mới” = chưa ai dùng, KHÔNG phải vừa bật. uptime 152s và 92s ở bước đầu tiên — GitHub bật sẵn một hồ máy.', { fs: 16.5, a: 'middle' });
  return sv(1150, 360, s);
};

/* ───────────── Slide 5 — dòng thời gian một job (run 35989945632, job buoc) ───────────── */
const dongThoiGian = () => {
  const X = (v) => 30 + (v - 35) * 100; // giây 35 → 46
  let s = '';
  for (let v = 35; v <= 46; v++) s += line(X(v), 60, X(v), 200) + T(X(v), 50, `:${v}`, { fs: 14, a: 'middle', c: 'dim', mono: true });
  let k = 0;
  const seg = (a, b, y, c, lb, sub) => bar(X(a), y, X(b) - X(a), 40, c) + T((X(a) + X(b)) / 2, y + 26, lb, { fs: 15, a: 'middle', b: true, c: '#08101e' }) + (sub ? T((X(a) + X(b)) / 2, y + 62 + (k++ % 2) * 22, sub, { fs: 13.5, a: 'middle', c: 'mu' }) : '');
  s += hatch(X(35), 80, X(38) - X(35), 40, 'vio') + T((X(35) + X(38)) / 2, 106, 'xếp hàng 3s', { fs: 15, a: 'middle', c: 'vio', b: true });
  s += seg(38, 39, 80, 'dim', 'nhận', 'runner nhận job');
  s += seg(39, 40, 80, 'blu', 'Set up', 'Set up job');
  s += seg(40, 41, 80, 'tea', 'checkout', 'Run actions/…');
  s += seg(41, 41.9, 80, 'grn', 'bước', '11 bước của bạn');
  s += seg(41.9, 42.6, 80, 'amb', 'Post', 'Post checkout');
  s += seg(42.6, 43, 80, 'ora', '', '');
  s += T(X(42.8), 184, 'Complete', { fs: 13.5, a: 'middle', c: 'ora' });
  s += hatch(X(43), 80, X(46) - X(43), 40, 'dim') + T((X(43) + X(46)) / 2, 106, 'chốt + báo về', { fs: 14.5, a: 'middle', c: 'mu' });
  s += T(30, 225, 'Số thứ tự bước trong API: 1 Set up job · 2–14 bước · 27 Post setup-node · 28 Post checkout · 29 Complete job', { fs: 15.5, c: 'mu', mono: false });
  s += T(30, 253, 'Post chạy NGƯỢC thứ tự dựng: setup-node (bước 3) được dọn TRƯỚC checkout (bước 2).', { fs: 15.5, c: 'mu' });
  return sv(1150, 265, s);
};

/* ───────────── Slide 13 — đường tới hạn của run phát hành (bài cũ, run 32662461744) ───────────── */
const duongToiHan = () => {
  const X = (v) => 170 + v * 1.62; // 0 → 555 s
  let s = '';
  [0, 100, 200, 300, 400, 500].forEach((v) => { s += line(X(v), 20, X(v), 330) + T(X(v), 14, `${v}s`, { fs: 13.5, a: 'middle', c: 'dim', mono: true }); });
  const r = (y, n, a, b, c, idle, cho) => T(0, y + 25, n, { fs: 16.5, b: true }) + bar(X(a), y + 6, X(b) - X(a), 30, c) + T(X(a) + 8, y + 27, `${b - a}s`, { fs: 14, c: '#08101e', b: true, mono: true }) +
    (idle ? hatch(X(b), y + 6, X(509) - X(b), 30, 'red') + T((X(b) + X(509)) / 2, y + 27, `ngồi chờ ${cho}s`, { fs: 14, a: 'middle', c: 'red', b: true }) : '');
  s += r(30, 'Kiểm tra mã', 0, 72, 'blu');
  s += r(90, 'Dựng Linux', 72, 313, 'tea', true, 197);
  s += r(140, 'Dựng Windows', 72, 395, 'vio', true, 115);
  s += r(190, 'Dựng macOS', 72, 509, 'amb');
  s += r(250, 'Công bố', 509, 543, 'grn');
  s += `<path d="M${X(72)} 36 L${X(72)} 196 M${X(509)} 216 L${X(509)} 256" stroke="${D.amb}" stroke-width="2.5" fill="none" stroke-dasharray="5 4"/>`;
  s += T(575, 318, 'Đường tới hạn = 72 + 437 + 34 = 543s. Làm Linux nhanh hơn KHÔNG rút được giây nào.', { fs: 17, a: 'middle', c: 'amb', b: true });
  return sv(1150, 330, s);
};

/* ───────────── Slide 14 — giá của mỗi cạnh needs (run 35989945596) ───────────── */
const giaoCa = () => {
  const X = (v) => 190 + (v - 34) * 40; // giây 34 → 57
  let s = '';
  for (let v = 34; v <= 57; v += 2) s += line(X(v), 22, X(v), 300) + T(X(v), 14, `:${v}`, { fs: 13, a: 'middle', c: 'dim', mono: true });
  const r = (y, n, c0, st, en, c) => T(0, y + 22, n, { fs: 16, b: true, mono: true }) +
    hatch(X(c0), y + 4, X(st) - X(c0), 28, 'vio') + bar(X(st), y + 4, X(en) - X(st), 28, c);
  s += r(30, 'chuan-bi', 35, 37, 42, 'grn');
  s += r(72, 'dung', 42, 45, 48, 'grn');
  s += r(114, 'kiem', 42, 45, 48, 'red');
  s += r(156, 'bao-loi', 48, 52, 56, 'grn');
  s += r(198, 'bao-cao', 49, 52, 56, 'grn');
  s += T(0, 262, 'deploy', { fs: 16, b: true, mono: true, c: 'dim' }) + T(X(42), 262, '⊘ skipped lúc :49 — không xin máy, không tốn giây nào', { fs: 15, c: 'dim' });
  s += T(575, 300, 'Khung tím = job đã có mà chưa có máy: ~3 giây mỗi lần “giao ca”, 3 tầng = ~9 trong 22 giây của cả run.', { fs: 16, a: 'middle', c: 'vio' });
  return sv(1150, 310, s);
};

/* ───────────── Slide 26 — ma trận nở thành 6 job ───────────── */
const maTranNo = () => {
  let s = '';
  const cx = [360, 560, 760, 960], cy = [110, 210];
  const nodes = ['20', '22', '24', '25'], oss = ['ubuntu-24.04', 'ubuntu-24.04-arm'];
  nodes.forEach((n, i) => { s += T(cx[i] + 80, 70, `node ${n}`, { fs: 17, a: 'middle', b: true, mono: true, c: i === 3 ? 'vio' : '#e6edf3' }); });
  oss.forEach((o, j) => { s += T(330, cy[j] + 44, o, { fs: 16, a: 'end', b: true, mono: true }); });
  const cell = (i, j, kind) => {
    const x = cx[i], y = cy[j];
    if (kind === 'ok') return R(x, y, 160, 70, { c: 'grn', fill: 'rgba(63,185,80,.10)' }) + T(x + 80, y + 43, '✓ job', { fs: 17, a: 'middle', c: 'grn', b: true });
    if (kind === 'plus') return R(x, y, 160, 70, { c: 'amb', fill: 'rgba(255,194,51,.10)' }) + T(x + 80, y + 32, '✓ job', { fs: 17, a: 'middle', c: 'amb', b: true }) + T(x + 80, y + 55, '+ thu-nghiem: true', { fs: 13.5, a: 'middle', c: 'amb', mono: true });
    if (kind === 'x') return R(x, y, 160, 70, { c: 'red', fill: 'rgba(255,92,108,.06)', dash: true }) + T(x + 80, y + 43, 'exclude ✂', { fs: 16, a: 'middle', c: 'red', b: true });
    if (kind === 'new') return R(x, y, 160, 70, { c: 'vio', fill: 'rgba(188,140,255,.12)' }) + T(x + 80, y + 32, '✓ job MỚI', { fs: 17, a: 'middle', c: 'vio', b: true }) + T(x + 80, y + 55, 'include thêm hẳn', { fs: 13.5, a: 'middle', c: 'vio' });
    return R(x, y, 160, 70, { c: 'dim', fill: 'none', dash: true, op: 0.4 });
  };
  s += cell(0, 0, 'ok') + cell(1, 0, 'ok') + cell(2, 0, 'plus') + cell(3, 0, 'new');
  s += cell(0, 1, 'ok') + cell(1, 1, 'ok') + cell(2, 1, 'x') + cell(3, 1, 'none');
  s += line(cx[3] - 20, 60, cx[3] - 20, 290, 'vio', 2, '6 5');
  s += R(0, 310, 1150, 70, { c: 'dim', fill: 'rgba(255,255,255,.03)', dash: true }) +
    T(575, 352, '2 × 3 = 6 → exclude bỏ 1 → include “node 24” GẮN thêm khoá vào ô có sẵn → include “node 25” đẻ ô MỚI = 6 job', { fs: 16.5, a: 'middle' });
  return sv(1150, 385, s);
};

/* ───────────── Slide 29 — max-parallel: 1 xếp hàng dọc ───────────── */
const tungCaiMot = () => {
  const X = (v) => 200 + (v - 35) * 17; // 10:54:35 → 10:55:30
  let s = '';
  for (let v = 35; v <= 85; v += 5) s += line(X(v), 22, X(v), 210) + T(X(v), 14, `:${String(v % 60).padStart(2, '0')}`, { fs: 13, a: 'middle', c: 'dim', mono: true });
  const r = (y, n, c0, st, en) => T(0, y + 22, n, { fs: 16, b: true, mono: true }) + hatch(X(c0), y + 4, X(st) - X(c0), 28, 'vio') + bar(X(st), y + 4, X(en) - X(st), 28, 'grn') + T(X(en) + 8, y + 24, `bắt đầu ${st < 60 ? '10:54:' + st : '10:55:' + String(st - 60).padStart(2, '0')}`, { fs: 14, c: 'mu', mono: true });
  s += r(30, 'nhánh 1', 35, 38, 51);
  s += r(80, 'nhánh 2', 35, 54, 66);
  s += r(130, 'nhánh 3', 35, 69, 82);
  s += T(575, 200, 'Cả ba được TẠO cùng lúc 10:54:35 — max-parallel: 1 bắt hai nhánh sau đứng xếp hàng (khung tím).', { fs: 16, a: 'middle', c: 'vio' });
  return sv(1150, 215, s);
};

export const slides = S([
  /* 1 */ cover({ t: 'Chương 2 — Job, runner, và những cỗ máy ngồi chờ', sub: 'máy mới mỗi lần · needs và outputs · ba nền tảng · bước và mã thoát · ma trận', chap: 'CHƯƠNG 2' }),

  /* 2 */ { t: 'Bản đồ chương: một job là một cỗ máy, và mọi thứ suy ra từ đó', body: mindmap('Job & runner', 'mỗi job = một máy ảo mới, thuê đúng bằng độ dài job', [
    { t: '2.1 Máy mới mỗi lần', d: 'runner_id · hồ máy bật sẵn · Set up job · runs-on', c: 'dk' },
    { t: '2.2 needs:', d: 'đồ thị job · outputs · skip lan truyền · always()', c: 'tea' },
    { t: '2.3 Ba nền tảng', d: 'bash / pwsh · đường dẫn · CRLF · bash 3.2 · giá phút', c: 'vio' },
    { t: '2.4 Bước + mã thoát', d: 'pipefail · outcome ≠ conclusion · GITHUB_ENV · if:', c: 'amb' },
    { t: '2.5 Ma trận', d: 'include / exclude · fail-fast · max-parallel', c: 'grn' },
  ]) },

  /* ───── 2.1 ───── */
  /* 3 */ { t: 'Hai job nối nhau bằng needs — hai cỗ máy khác hẳn nhau', body: two(
    t(['# job chuan-bi', 'runner_name : GitHub Actions 1000004262', 'hostname    : runnervmtr4k5', 'machine-id  : fa19dc2cce72', '$ echo "..." > /tmp/dau-vet.txt', '$ echo "..." > $HOME/dau-vet.txt', '= -rw-r--r-- 1 runner  22 /tmp/dau-vet.txt', '= -rw-r--r-- 1 runner   8 /home/runner/dau-vet.txt'], 'run 35989945596 · job chuan-bi', 15.5),
    t(['# job dung  (needs: chuan-bi)', 'runner_name : GitHub Actions 1000004282', 'hostname    : runnervmlun5p', 'machine-id  : 58b34b8c91a9', '$ ls -l /tmp/dau-vet.txt $HOME/dau-vet.txt', "! ls: cannot access '/tmp/dau-vet.txt'", "! ls: cannot access '/home/runner/dau-vet.txt'", '>> khong co gi cua job chuan-bi'], 'cùng run · job dung', 15.5)) +
    box('info', '8 job trong run này → 6 runner_id khác nhau (hai job bị <strong>skip</strong> không xin máy nào). Muốn mang gì sang job sau: <code>outputs</code> (chuỗi ngắn) hoặc artifact (tệp) — bài 2.2.') },

  /* 4 */ { t: 'Máy “mới” nghĩa là chưa ai dùng — không phải vừa bật', body: mayDungSan() },

  /* 5 */ { t: 'Dòng thời gian một job: xếp hàng → Set up → bước → Post', body: dongThoiGian() },

  /* 6 */ { t: '“Set up job” là lý lịch cỗ máy — đọc nó đầu tiên khi CI đổi tính', body: two(
    t(["Current runner version: '2.337.0'", 'Runner Image Provisioner', '  Hosted Compute Agent 20260828.587', '  Azure Region: westus2', 'Operating System', '  Ubuntu 24.04.5 LTS', 'Runner Image', '+  Image: ubuntu-24.04', '+  Version: 20260920.314.1', 'GITHUB_TOKEN Permissions', '  Contents: read · Metadata: read', 'Prepare all required actions'], 'log “Set up job” · run 35989945596', 15),
    list([
      '<strong>Version</strong> của ảnh đổi hằng tuần — xanh thứ Sáu, đỏ thứ Hai mà không có commit: so hai dòng này giữa hai run.',
      '<strong>Region</strong> khác nhau giữa các job cùng run (westus2, centralus, eastus) — mạng chậm một job không nói gì về job khác.',
      '<strong>GITHUB_TOKEN Permissions</strong>: quyền thật của token trong job này (Chương 6).',
      '<strong>Prepare all required actions</strong>: tải mọi <code>uses:</code> TRƯỚC bước đầu — action sai tên hỏng ở đây.',
    ])) },

  /* 7 */ { t: 'runs-on chọn LOẠI máy: 1 lõi container tới Mac M1', body: table(['Nhãn (09/2026)', 'CPU · RAM (kho công khai)', 'Là gì', 'Đo thật trên sân tập'], [
    ['<code>ubuntu-slim</code>', '1 · 5 GB', 'container trên máy ảo', '+CPU 1 · RAM 4.8Gi · virt: docker · VM Image: ubuntu:24.04'],
    ['<code>ubuntu-24.04</code> / <code>-latest</code>', '4 · 16 GB', 'máy ảo x64', 'CPU 4 · RAM 15Gi · virt: microsoft'],
    ['<code>ubuntu-24.04-arm</code>', '4 · 16 GB', 'máy ảo arm64', 'chạy ma trận ở bài 2.5'],
    ['<code>windows-2025</code>', '4 · 16 GB', 'máy ảo x64', 'shell mặc định pwsh 7'],
    ['<code>macos-15</code> / <code>-latest</code>', '3 (M1) · 7 GB', 'máy Mac arm64', '!bash mặc định 3.2.57'],
  ], { sm: true }) + box('warn', 'Kho <strong>riêng tư</strong>: Linux/Windows chỉ còn <strong>2 CPU · 8 GB</strong>. Ghim bản (<code>ubuntu-24.04</code>) thay vì <code>-latest</code> cho job mà hỏng thì chặn deploy.') },

  /* 8 */ { t: 'Gõ sai nhãn: job xếp hàng mãi — timeout-minutes không cứu', body: two(
    t(['$ docker run … rhysd/actionlint -no-color', '! ch02-nhan.yml:24:14: label "ubuntu-lastest"', '!   is unknown. available labels are', '!   "windows-latest", …, "ubuntu-slim", …', '# bắt được TRƯỚC khi push'], 'actionlint 1.7.12 · trên Mac', 15),
    t(['$ gh api …/runs/35990300992/jobs', 'slim    completed/success   2s', 'chuan   completed/success   4s', '+ go-sai  queued  labels=["ubuntu-lastest"]', '+   created 10:58:25 · 11:04:42 vẫn queued (6m17s)', '# timeout-minutes: 5 chỉ đếm khi ĐÃ CHẠY', '$ gh run cancel 35990300992'], 'GitHub · không có lỗi nào hiện ra', 15)) +
    box('bad', 'GitHub không báo “nhãn không tồn tại” — nó nghĩ bạn có một runner tự host tên thế và <strong>chờ</strong>. Hàng đợi runner tự host tự huỷ sau 24 giờ.') },

  /* ───── 2.2 ───── */
  /* 9 */ { t: 'Một job hỏng: job phụ thuộc bị SKIP, không phải hỏng', body: pipe({
    w: 1160, h: 330,
    cols: [[{ n: 'chuan-bi', s: 'ok', d: '5s' }], [{ n: 'dung', s: 'ok', d: '3s' }, { n: 'kiem', s: 'fail', d: '3s' }], [{ n: 'deploy', s: 'skip' }, { n: 'bao-loi', s: 'ok', d: '4s' }], [{ n: 'sau-deploy', s: 'skip' }, { n: 'bao-cao', s: 'ok', d: '4s' }, { n: 'chua-huy', s: 'ok', d: '2s' }]],
    needs: [['chuan-bi', 'dung'], ['chuan-bi', 'kiem'], ['dung', 'deploy'], ['kiem', 'deploy'], ['kiem', 'bao-loi'], ['deploy', 'sau-deploy'], ['deploy', 'bao-cao'], ['deploy', 'chua-huy']],
  }) + `<p class="c-note">Run 35989945596 · <code>bao-loi</code>: <code>if: failure()</code> · <code>bao-cao</code>: <code>if: always()</code> · <code>chua-huy</code>: <code>if: !cancelled()</code> — cả ba chạy dù <code>deploy</code> bị skip. Đọc run đỏ: tìm ✗ đầu tiên, bỏ qua các ⊘.</p>` },

  /* 10 */ { t: 'if: của job quyết định nó có chạy sau hỏng, skip, huỷ hay không', body: table(['Điều kiện của job', 'needs xanh', 'needs có ✗', 'needs bị ⊘ skip', 'người bấm huỷ'], [
    ['(không ghi) = <code>success()</code>', '+chạy', '-skip', '-skip', '-huỷ'],
    ['<code>failure()</code>', '-skip', '+chạy', '(chỉ khi có ✗ trước đó)', '-skip'],
    ['<code>always()</code>', '+chạy', '+chạy', '+chạy', '!chạy (kể cả khi huỷ)'],
    ['<code>!cancelled()</code>', '+chạy', '+chạy', '+chạy', '-huỷ'],
    ['<code>cancelled()</code>', '-skip', '-skip', '-skip', '+chạy'],
  ], { sm: true }) + box('tip', 'Đo thật ở run 35989945596 (hỏng + skip) và 35990301016 (bấm huỷ lúc 10:58:56). Deploy KHÔNG BAO GIỜ dùng <code>always()</code>: một run bị huỷ không được đẩy lên production.') },

  /* 11 */ { t: 'outputs: ghi vào GITHUB_OUTPUT, khai ở job, đọc qua needs', body: two(
    yaml([
      ['chuan-bi:', ''],
      ['  outputs:', 'khai ở mức JOB'],
      ['    phien-ban: ${{ steps.pb.outputs.phien_ban }}', 'lấy từ bước id pb'],
      ['  steps:', ''],
      ['    - id: pb', 'BẮT BUỘC có id'],
      ['      run: |', ''],
      ['        echo "phien_ban=1.4.$GITHUB_RUN_NUMBER" \\', ''],
      ['          >> "$GITHUB_OUTPUT"', 'tệp, không phải stdout'],
      ['dung:', ''],
      ['  needs: chuan-bi', 'phải needs TRỰC TIẾP'],
      ['  steps:', ''],
      ['    - run: echo "${{ needs.chuan-bi.outputs.phien-ban }}"', ''],
    ], { fs: 14.5 }),
    t(['# job chuan-bi', 'da ghi vao GITHUB_OUTPUT:', 'phien_ban=1.4.1', 'ngay=2026-09-24', '# Complete job:', '= Evaluate and set job outputs', "= Set output 'phien-ban'", "= Set output 'ngay'", '# job dung', 'phien ban : 1.4.1', '+ khong khai: []   ← tên sai = chuỗi rỗng'], 'run 35989945596', 15)) },

  /* 12 */ { t: 'needs chỉ thấy phụ thuộc TRỰC TIẾP — ông của job thì rỗng', body: two(
    t(['# bao-cao: needs: [dung, kiem, deploy]', 'dung   : success', 'kiem   : failure', 'deploy : skipped', '+ chuan-bi (khong needs truc tiep): []', '{', '  "dung":   { "result": "success", "outputs": {} },', '  "kiem":   { "result": "failure", "outputs": {} },', '  "deploy": { "result": "skipped", "outputs": {} }', '}'], 'toJSON(needs) · run 35989945596', 15),
    t(['$ docker run … rhysd/actionlint -no-color', '! ch02-needs.yml:83:184: property "chuan-bi"', '!   is not defined in object type', '!   {deploy: …; dung: …; kiem: …}', '! ch02-needs.yml:46:150: property "khong-co"', '!   is not defined in object type', '!   {ngay: string; phien-ban: string}', '# GitHub: không lỗi, chỉ ra chuỗi rỗng'], 'actionlint 1.7.12', 15)) +
    box('tip', 'Cần output của job “ông”? Thêm nó vào <code>needs:</code> (không đổi thứ tự chạy nếu nó đã là tổ tiên) — hoặc cho job giữa chuyển tiếp output.') },

  /* 13 */ { t: 'Đường tới hạn: job chậm nhất định nhịp, job nhanh ngồi chờ', body: duongToiHan() + `<p class="c-note">Run phát hành desktop 32662461744 của kho api-backend · Linux ngồi chờ 197s, Windows 115s = 5m12s máy đã dựng xong mà chưa dùng được.</p>` },

  /* 14 */ { t: 'Mỗi cạnh needs tốn thêm ~3 giây “giao ca”', body: giaoCa() },

  /* 15 */ { t: 'Mang gì qua ranh giới job: bốn kênh, bốn mục đích', body: cards([
    { ic: '🏷', t: 'outputs', d: 'Chuỗi ngắn: số phiên bản, tag, cờ. Tối đa <strong>1 MB/job, 50 MB/run</strong>. Output có vẻ chứa secret bị BỎ.', c: 'blu' },
    { ic: '📦', t: 'artifact', d: 'Tệp đầu ra: bản dựng, báo cáo. Tải lên/tải về tường minh; <code>upload-artifact@v4+</code> không ghi đè tên trùng.', c: 'tea' },
    { ic: '⚡', t: 'cache', d: 'Tăng tốc TẠO LẠI (node_modules…). Có thể trượt bất cứ lúc nào — không bao giờ dựa vào để đúng. Chương 5.', c: 'amb' },
    { ic: '🌐', t: 'hệ thống ngoài', d: 'Registry ảnh, máy chủ, bản phát hành. Thứ duy nhất sống quá thời hạn artifact.', c: 'vio' },
  ], 2) },

  /* ───── 2.3 ───── */
  /* 16 */ { t: 'Cùng một dòng run:, ba shell khác nhau', body: table(['Runner', 'Không ghi shell:', 'shell: bash'], [
    ['ubuntu-24.04', '<code>/usr/bin/bash -e {0}</code>', '<code>/usr/bin/bash --noprofile --norc -e -o pipefail {0}</code> · bash 5.2.21'],
    ['macos-15', '<code>/bin/bash -e {0}</code>', '!<code>/bin/bash … -o pipefail</code> · bash 3.2.57 (2007)'],
    ['windows-2025', '!<code>pwsh.EXE -command ". \'{0}\'"</code>', '<code>C:\\Program Files\\Git\\bin\\bash.EXE … -o pipefail</code> · bash 5.3.15'],
  ], { sm: true }) + box('tip', 'Dòng <code>shell:</code> in ngay dưới tiêu đề mỗi bước trong log — nhìn nó trước khi đoán. Một dòng <code>defaults: run: shell: bash</code> ở mức job/workflow gỡ gần hết khác biệt.') + `<p class="c-note">Run 35989945528 · cùng một commit, cùng tệp workflow, ba runner.</p>` },

  /* 17 */ { t: 'Windows (pwsh): lệnh hỏng ở GIỮA script — bước vẫn XANH', body: two(
    t(['$ node -e "process.exit(3)"', '$ node -e "console.log(\'lenh sau van chay\')"', 'shell: /usr/bin/bash -e {0}', '! ##[error]Process completed with exit code 3.', '# buoc B outcome=failure'], 'ubuntu-24.04 · bash -e', 15.5),
    t(['$ node -e "process.exit(3)"', '$ node -e "console.log(\'lenh sau van chay\')"', 'shell: pwsh.EXE -command ". \'{0}\'"', '= lenh sau van chay', '+ # buoc B outcome=success'], 'windows-2025 · pwsh mặc định', 15.5)) +
    box('bad', 'GitHub chèn <code>$ErrorActionPreference = \'stop\'</code> — nó chỉ dừng lỗi của lệnh PowerShell, <strong>không</strong> dừng chương trình ngoài (node, npm, git). Bước chỉ lấy <code>$LASTEXITCODE</code> của lệnh CUỐI. Đây là “pipefail” của Windows.') },

  /* 18 */ { t: 'Đường dẫn, CRLF, hoa thường: ba nền tảng, ba câu trả lời', body: table(['Đo bằng shell: bash', 'ubuntu-24.04', 'macos-15', 'windows-2025'], [
    ['<code>$GITHUB_WORKSPACE</code>', '/home/runner/work/ga-san-tap/ga-san-tap', '/Users/runner/work/…', '!D:\\a\\ga-san-tap\\ga-san-tap'],
    ['<code>pwd</code> (Git Bash)', 'như trên', 'như trên', '/d/a/ga-san-tap/ga-san-tap'],
    ['<code>$HOME</code>', '/home/runner', '/Users/runner', '/c/Users/runneradmin'],
    ['<code>core.autocrlf</code> sau checkout', '(chưa đặt) → \\n', '(chưa đặt) → \\n', '!true → \\r \\n'],
    ['<code>-f CH02/XIN-CHAO.SH</code>', '-KHÔNG thấy', '+THẤY', '+THẤY'],
  ], { sm: true }) + box('warn', 'Linux là cái phân biệt hoa thường — và production của bạn chạy Linux. Tệp CRLF trên Windows vẫn chạy được bằng Git Bash, rồi <strong>hỏng khi rời sang máy Linux</strong> (ảnh Docker, artifact). Chặn bằng <code>.gitattributes</code>: <code>*.sh text eol=lf</code>.') },

  /* 19 */ { t: 'shell: bash trên macOS là bash 3.2 — cú pháp bash 4 vỡ', body: two(
    yaml([['- name: G. Bash 4+ tren ca ba?', ''], ['  shell: bash', 'cùng một bước'], ['  run: |', ''], ['    ten="GitHub"', ''], ['    echo "chu thuong: ${ten,,}"', 'bash 4.0+ (2009)'], ['    declare -A m=([a]=1)', 'mảng kết hợp, bash 4+'], ['    echo "mang ket hop: ${m[a]}"', '']], { fs: 16 }),
    `${t(['# ubuntu-24.04 (5.2.21) và windows-2025 (5.3.15)', '= chu thuong: github', '= mang ket hop: 1', '', '# macos-15 (3.2.57)', '! line 2: chu thuong: ${ten,,}: bad substitution', '! ##[error]Process completed with exit code 1.'], 'run 35990300805', 15)}
     ${box('tip', 'Script chạy trên cả ba nền tảng: chỉ dùng cú pháp bash 3.2, hoặc viết bằng Node/Python — một bản chạy giống nhau ở cả ba nơi. Đừng đoán phiên bản: in <code>$BASH_VERSION</code>.')}`) },

  /* 20 */ { t: 'Giá mỗi phút: macOS đắt gấp ~10 lần Linux (kho riêng tư)', body: `${bars([
      { l: 'Linux 2 lõi', sub: 'ubuntu-latest', v: 0.006, txt: '$0.006 / phút', c: 'grn' },
      { l: 'Windows 2 lõi', sub: 'windows-latest', v: 0.010, txt: '$0.010 / phút', c: 'blu' },
      { l: 'macOS 3–4 lõi', sub: 'macos-latest', v: 0.062, txt: '$0.062 / phút', c: 'red' },
      { l: 'Linux 1 lõi', sub: 'ubuntu-slim', v: 0.002, txt: '$0.002 / phút', c: 'tea' },
    ], { lw: 300 })}
    ${two(list([
      'Kho <strong>công khai</strong>: runner chuẩn <strong>miễn phí, không giới hạn</strong>.',
      'Mỗi job làm tròn LÊN phút — 5 giây vẫn tính 1 phút.',
      'Gói Free: 2.000 phút/tháng cho kho riêng tư, <strong>20 job</strong> cùng lúc, tối đa <strong>5 job macOS</strong>.',
    ]), box('info', 'Run phát hành 32662461744 nếu ở kho riêng tư: Linux 5 phút $0.03 · Windows 6 phút $0.06 · macOS 8 phút <strong>$0.50 = 85% hoá đơn</strong> cho 44% thời gian.'))}` },

  /* ───── 2.4 ───── */
  /* 21 */ { t: 'Mặc định thiếu pipefail: lệnh không tồn tại, bước vẫn XANH', body: two(
    t(['# bước 1 — không ghi shell:', 'shell: /usr/bin/bash -e {0}', '$ lenh-khong-ton-tai | tail -1', '! …sh: line 1: lenh-khong-ton-tai: command not found', '= ma thoat cua ca ong: 0', '# ✓ bước XANH'], 'run 35989945632 · trên runner thật', 15),
    t(['# bước 2 — shell: bash', 'shell: /usr/bin/bash --noprofile --norc \\', '       -e -o pipefail {0}', '$ lenh-khong-ton-tai | tail -1', '! …sh: line 1: lenh-khong-ton-tai: command not found', '! ##[error]Process completed with exit code 127.'], 'cùng job', 15)) +
    box('tip', 'Một dòng <code>defaults: run: shell: bash</code> ở đầu workflow = mọi bước có <code>pipefail</code>. Rẻ nhất, giá trị nhất.') },

  /* 22 */ { t: 'continue-on-error: outcome = failure nhưng conclusion = success', body: two(
    yaml([['- name: 2. Ong, shell bash', ''], ['  id: ong', 'để đọc kết quả'], ['  continue-on-error: true', 'cho phép hỏng'], ['  shell: bash', ''], ['  run: lenh-khong-ton-tai | tail -1', ''], ['- name: 3. outcome va conclusion', ''], ['  run: |', ''], ['    echo "${{ steps.ong.outcome }}"', 'kết quả THẬT'], ['    echo "${{ steps.ong.conclusion }}"', 'sau khi “tha”']], { fs: 15 }),
    `${t(['outcome    = failure', 'conclusion = success', '', '$ gh api …/jobs --jq \'.jobs[].steps[]\'', '+ 5  2. Ong, shell bash (co pipefail)  success', '# API và dấu tick chỉ thấy conclusion'], 'run 35989945632', 15)}
     ${box('warn', 'Rẽ nhánh theo bước được tha thì dùng <code>outcome</code>. Dùng <code>conclusion</code> là luôn thấy “success”.')}`) },

  /* 23 */ { t: 'Mỗi bước là một shell mới: export và cd không đi tiếp', body: two(
    t(['# bước 4', '$ export XUAT=co', '$ echo "GHI=co" >> "$GITHUB_ENV"', '$ cd /tmp', 'trong buoc 4: XUAT=[co] GHI=[] thu muc: /tmp', '', '# bước 5 — log in thêm:  env: GHI: co', '+ buoc 5: XUAT=[] GHI=[co]', '+   thu muc: /home/runner/work/ga-san-tap/ga-san-tap'], 'run 35990300886', 15),
    list([
      '<code>export</code> chết cùng shell của bước.',
      '<code>$GITHUB_ENV</code> có hiệu lực từ bước <strong>SAU</strong> — chính bước ghi vẫn thấy rỗng.',
      '<code>cd</code> không đi tiếp: mỗi bước bắt đầu lại ở workspace. Dùng <code>working-directory:</code>.',
      'Biểu thức <code>&#36;{{ }}</code> được thay <strong>trước</strong> khi shell chạy — log in sẵn giá trị (vd <code>echo "phien ban : 1.4.1"</code>).',
    ])) },

  /* 24 */ { t: 'Sau một bước hỏng, chỉ bước có if: mới còn chạy', body: two(
    `<div style="font-size:17px">${table(['#', 'Bước (run 35989945632)', 'Kết quả'], [
      ['7', '<code>if: failure()</code> — trước khi có gì hỏng', '⊘ skipped'],
      ['8', '<code>run: exit 7</code>', '-✗ failure'],
      ['9', '(không if) = <code>success()</code>', '⊘ skipped'],
      ['10', '<code>if: failure()</code>', '+✓ chạy'],
      ['11', '<code>if: always()</code>', '+✓ chạy'],
    ], { sm: true })}</div>`,
    `<div style="font-size:17px">${table(['Bước (run 35990301016, bấm huỷ)', 'Kết quả'], [
      ['sleep 120', '⊘ cancelled'],
      ['<code>if: always()</code>', '+✓ chạy'],
      ['<code>if: !cancelled()</code>', '⊘ skipped'],
      ['<code>if: failure()</code>', '⊘ skipped'],
      ['<code>if: cancelled()</code>', '+✓ chạy'],
    ], { sm: true })}</div>`) +
    box('info', 'Bấm huỷ lúc 10:58:56 → job dừng 10:59:12: runner gửi tín hiệu, chạy các bước <code>always()</code>/<code>cancelled()</code>, rồi “Terminate orphan process: sleep”. Huỷ không phải tức thì.') },

  /* ───── 2.5 ───── */
  /* 25 */ { t: 'Ma trận: include gắn thêm khoá hoặc đẻ tổ hợp mới', body: maTranNo() },

  /* 26 */ { t: 'Viết ma trận: YAML bên trái, 6 job thật bên phải', body: two(
    yaml([['strategy:', ''], ['  matrix:', ''], ['    os: [ubuntu-24.04, ubuntu-24.04-arm]', '2 giá trị'], ['    node: [20, 22, 24]', '× 3 = 6'], ['    exclude:', 'xử lý TRƯỚC'], ['      - os: ubuntu-24.04-arm', ''], ['        node: 24', '6 − 1 = 5'], ['    include:', 'xử lý SAU'], ['      - node: 24', 'khớp ô có sẵn…'], ['        thu-nghiem: true', '…gắn thêm khoá'], ['      - os: ubuntu-24.04', 'không khớp ô nào…'], ['        node: 25', '…thành ô MỚI = 6'], ['runs-on: ${{ matrix.os }}', '']], { fs: 14.5 }),
    t(['# toJSON(matrix) · 6 job', '{"os":"ubuntu-24.04","node":20}', '{"os":"ubuntu-24.04","node":22}', '+ {"os":"ubuntu-24.04","node":24,', '+  "thu-nghiem":true}', '= {"os":"ubuntu-24.04","node":25,', '=  "thu-nghiem":true}', '{"os":"ubuntu-24.04-arm","node":20}', '{"os":"ubuntu-24.04-arm","node":22}', '# trần: 256 job / run'], 'run 35989945581 · job tich-cheo', 15)) },

  /* 27 */ { t: 'fail-fast mặc định BẬT: một nhánh hỏng, cả nhóm bị huỷ', body: `${pipe({
    w: 1160, h: 175,
    cols: [[{ n: 'fail-fast bật', s: 'fail' }], [{ n: 'cham=5', s: 'fail', d: '7s' }], [{ n: 'cham=60', s: 'skip', d: 'huỷ' }], [{ n: 'cham=90', s: 'skip', d: 'huỷ' }]],
  })}${pipe({
    w: 1160, h: 175,
    cols: [[{ n: 'fail-fast tắt', s: 'fail' }], [{ n: 'cham=5 ', s: 'fail', d: '8s' }], [{ n: 'cham=60 ', s: 'ok', d: '63s' }], [{ n: 'cham=90 ', s: 'ok', d: '93s' }]],
  })}<p class="c-note">Run 35989945581 · trên: <code>fail-fast</code> mặc định → nhánh 90s bị “The operation was canceled.” sau 20s, mất trắng · dưới: <code>fail-fast: false</code> → hai nhánh kia xong và có kết quả.</p>` },

  /* 28 */ { t: 'Nhánh thử nghiệm được phép hỏng mà không huỷ cả nhóm', body: two(
    yaml([['thu-nghiem:', 'fail-fast vẫn BẬT'], ['  strategy:', ''], ['    matrix:', ''], ['      loai: [on-dinh, thu-nghiem]', ''], ['      include:', ''], ['        - loai: thu-nghiem', ''], ['          cho-hong: true', 'khoá tự đặt'], ['  continue-on-error: ${{ matrix.cho-hong == true }}', 'chỉ nhánh này']], { fs: 14 }),
    `${pipe({ w: 480, h: 200, cols: [[{ n: 'thu-nghiem', s: 'fail', d: '8s' }, { n: 'on-dinh', s: 'ok', d: '43s' }]] })}
     ${box('good', 'Nhánh thử nghiệm hỏng ở giây 5 — nhánh ổn định vẫn chạy đủ 40s tới ✓. Dùng cho “Node bản mới nhất”, “hệ điều hành beta”.')}`) },

  /* 29 */ { t: 'max-parallel: 1 — ba nhánh chạy lần lượt, không song song', body: tungCaiMot() + box('info', 'Dùng khi các nhánh tranh một thứ bên ngoài (một DB test chung, trần gọi API). Tổng việc không đổi — chỉ chậm hơn. Trần thật của cả tài khoản: gói Free <strong>20 job</strong> cùng lúc, <strong>5 job macOS</strong>.') },

  /* 30 */ { t: 'Sai lầm hay gặp ở Chương 2', body: cards([
    { ic: '📁', t: 'Trông tệp của job trước', d: 'Job sau là máy KHÁC. Dùng artifact / outputs.', c: 'red' },
    { ic: '🏷', t: 'Gõ sai nhãn runs-on', d: 'Không lỗi — xếp hàng mãi. Chạy actionlint.', c: 'amb' },
    { ic: '🟢', t: 'always() cho deploy', d: 'Chạy cả khi bị huỷ. Dùng mặc định hoặc !cancelled() cho báo cáo.', c: 'ora' },
    { ic: '🪟', t: 'Tin pwsh dừng khi lệnh hỏng', d: 'Lệnh ngoài hỏng ở giữa → bước xanh. Dùng shell: bash.', c: 'vio' },
    { ic: '🔇', t: 'continue-on-error cho test', d: 'Dấu ✓ thôi mang nghĩa. Nếu tha, ghi “(informational)” trong tên.', c: 'pnk' },
    { ic: '✖️', t: 'Ma trận nhân mọi thứ', d: '3 OS × 3 Node = 9 job, 3 cái macOS. include đúng ô có nghĩa.', c: 'blu' },
  ], 3) },

  /* 31 */ { t: 'Bảng tra nhanh Chương 2', body: table(['Muốn', 'Viết'], [
    ['Job B chạy sau job A', '<code>needs: a</code> · nhiều: <code>needs: [a, b]</code>'],
    ['Chuyển chuỗi A → B', '<code>echo "k=v" &gt;&gt; "$GITHUB_OUTPUT"</code> + <code>outputs:</code> + <code>&#36;{{ needs.a.outputs.k }}</code>'],
    ['Biến cho các bước sau', '<code>echo "K=V" &gt;&gt; "$GITHUB_ENV"</code>'],
    ['Job báo cáo luôn chạy (trừ khi huỷ)', '<code>if: &#36;{{ !cancelled() }}</code>'],
    ['Bước chỉ khi có hỏng', '<code>if: failure()</code> · đọc thật: <code>steps.x.outcome</code>'],
    ['Có pipefail ở mọi bước, mọi OS', '<code>defaults: run: shell: bash</code>'],
    ['Ma trận không huỷ nhau', '<code>strategy: fail-fast: false</code>'],
    ['Chạy từng nhánh một', '<code>strategy: max-parallel: 1</code>'],
    ['Không để job treo 6 giờ', '<code>timeout-minutes: 15</code> (mặc định 360)'],
  ], { sm: true }) },

  /* 32 */ { t: 'Thực hành Chương 2 (45 phút) trên kho của chính bạn', body: two(list([
    '<strong>1.</strong> Hai job nối <code>needs</code>: job 1 ghi <code>/tmp/x</code> + in <code>hostname</code>; job 2 tìm <code>/tmp/x</code>. Chứng minh hai máy.',
    '<strong>2.</strong> Chuyển <code>1.0.$GITHUB_RUN_NUMBER</code> từ job 1 sang job 2 bằng <code>outputs</code>.',
    '<strong>3.</strong> Thêm job cố ý <code>exit 1</code>, một job <code>needs</code> nó, một job <code>if: always()</code>. Đếm ✓ ✗ ⊘.',
    '<strong>4.</strong> Ma trận <code>[ubuntu-latest, windows-latest, macos-latest]</code> chạy <code>node -e "process.exit(3)"</code> rồi một lệnh xanh — nhánh nào xanh?',
    '<strong>5.</strong> Ma trận 3 nhánh <code>sleep</code> khác nhau, nhánh ngắn nhất hỏng: chạy với fail-fast bật rồi tắt.',
  ]), box('good', '<strong>Đạt khi</strong> bạn có 4 run thật và trả lời được bằng số trong log: bao nhiêu <code>runner_id</code>, job nào skip, nhánh Windows xanh hay đỏ, bao nhiêu nhánh bị huỷ.<br><br>Soi kết quả: <code>gh run view &lt;id&gt; --log</code> và <code>gh api repos/&lt;bạn&gt;/&lt;kho&gt;/actions/runs/&lt;id&gt;/jobs</code>.')) },
]);
