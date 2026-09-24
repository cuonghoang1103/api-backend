/**
 * GitHub Actions · Deck ga-09 — Chương 9: Deploy từ CI, và vì sao kho này ĐÃ THÔI.
 *
 * Log/con số của api-backend là THẬT, đọc qua API (chỉ đọc) ngày 24/09/2026:
 *   06/07/2026 · push 3a42ec18 + 89a38611 cách nhau 19 s ⇒ 28784916558 (ghcr, huỷ) · 28784916588 (vps) ·
 *                28784932810 (vps) · 28784932814 (ghcr, ĐỎ ở "Recreate": container is running)
 *   03/07/2026 · 9 cú push × 4 workflow (ci-lint, guard, ghcr, vps)
 *   10/09/2026 21:02 UTC · 34529884942 — deploy-ghcr.yml bấm tay từ main cũ đè ảnh deploy-nha.sh vừa tráo
 *   Commit 094db93b (06/07/2026 22:35 +07) — gỡ `on: push` khỏi deploy-ghcr.yml + backend-vps.yml
 * Sân tập github.com/cuonghoang1103/ga-san-tap, nhánh ch09-deploy (24/09/2026):
 *   đua:  36017162526 (ghcr c1, huỷ) · 36017162535 (vps c1) · 36017208796 (ghcr c2) · 36017208846 (vps c2)
 *   khoá: 36017502640 (vps c1) · 36017502683 (ghcr c1, bị thay) · 36017547619 (vps c2) · 36017548107 (ghcr c2, bị thay)
 *   CD:   36017143450 ✓ · 36017616624 (ảnh hỏng → tự rollback) · 36017879471 (đoán HEAD^ → đỏ) ·
 *         36017890545 (nhánh ch09-nhanh-la bị chặn) · 36018120566 ✓ · 36018283303 (người duyệt từ chối)
 * Docs environments đọc 24/09/2026: docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments
 */
import { S, cover, cards, box, table, two, list, mindmap, term as gaTerm, yaml, steps, diagram, sv, R, T, A, D } from './_ga-chung.mjs';

export const deck = { key: 'ga-09', code: 'GITHUB ACTIONS · CHƯƠNG 9', title: 'Deploy từ CI, và vì sao kho này đã thôi', sub: 'GitHub Actions · Chương 9' };

const t = (lines, title, fs = 15) => gaTerm(lines, { title, dir: '~/ga-san-tap', fs });
const fill = (c, p = 26) => `color-mix(in srgb, ${D[c] || c} ${p}%, #0f182a)`;

/* ───────────── Gantt tổng quát: mỗi hàng nhiều đoạn ───────────── */
const gantt = ({ rows, max, K, X0 = 250, tick = 60, lab = (v) => `+${v}s`, bands = [], note, w = 1160, rowH = 66 }) => {
  let s = '';
  const X = (v) => X0 + v * K;
  const Y1 = 30 + rows.length * rowH;
  for (let i = 0; i <= max; i += tick) s += `<line x1="${X(i)}" y1="24" x2="${X(i)}" y2="${Y1}" stroke="#1d2a40"/>` + T(X(i), 16, lab(i), { fs: 13.5, a: 'middle', c: 'dim', mono: true });
  bands.forEach(([a, b, c, txt, end]) => {
    s += `<rect x="${X(a)}" y="24" width="${(b - a) * K}" height="${Y1 - 24}" fill="${D[c]}" opacity=".13"/>` +
      `<line x1="${X(a)}" y1="24" x2="${X(a)}" y2="${Y1}" stroke="${D[c]}" stroke-width="2" stroke-dasharray="5 4"/>` +
      `<line x1="${X(b)}" y1="24" x2="${X(b)}" y2="${Y1}" stroke="${D[c]}" stroke-width="2" stroke-dasharray="5 4"/>`;
    if (txt) s += end ? T(X(b), Y1 + 22, txt, { fs: 14.5, c, b: true, a: 'end' }) : T(X(a) + 6, Y1 + 22, txt, { fs: 14.5, c, b: true });
  });
  rows.forEach(([lb, sub, segs, lc], i) => {
    const y = 30 + i * rowH;
    s += T(0, y + 25, lb, { fs: 15.5, b: true, c: lc || '#e6edf3' }) + (sub ? T(0, y + 45, sub, { fs: 13.5, c: 'mu', mono: true }) : '');
    segs.forEach(([a, d, c, txt, dash]) => {
      s += R(X(a), y + 8, Math.max(3, d * K), 38, { c, fill: dash ? 'rgba(255,255,255,.03)' : fill(c, 30), r: 6, sw: 2, dash });
      if (txt) s += d * K > txt.length * 7.6 + 10 ? T(X(a) + 7, y + 32, txt, { fs: 14, c: '#fff' }) : T(X(a + d) + 6, y + 32, txt, { fs: 14, c: D[c] ? c : 'mu' });
    });
  });
  if (note) s += T(0, Y1 + (bands.some((b) => b[3]) ? 50 : 26), note, { fs: 14, c: 'mu' });
  return sv(w, Y1 + (bands.some((b) => b[3]) ? 60 : 36) + (note ? 10 : 0), s);
};

/* ───────────── Slide 3 — một push, bốn workflow ───────────── */
const motPush = () => {
  let s = '';
  s += R(20, 180, 200, 90, { c: 'vio', fill: fill('vio', 24) }) + T(120, 218, 'git push main', { fs: 19, b: true, a: 'middle', mono: true }) + T(120, 246, 'sửa src/**', { fs: 15, a: 'middle', c: 'mu', mono: true });
  const W = [
    ['ci-lint.yml', 'tsc · test · lint — không chạm VPS', 'grn', false],
    ['guard-no-duplicates.yml', 'SSH vào VPS, dừng/xoá container trùng', 'amb', true],
    ['deploy-ghcr.yml', 'dựng ảnh → GHCR → SSH: recreate → migrate', 'red', true],
    ['backend-vps.yml', 'dựng trên runner → SSH: bơm dist, chép .next', 'red', true],
  ];
  W.forEach(([n, d, c, vps], i) => {
    const y = 20 + i * 110;
    s += `<path d="M220 225 C300 225 300 ${y + 42} 360 ${y + 42}" stroke="${D.mu}" stroke-width="2.5" fill="none" marker-end="url(#m-mu)"/>`;
    s += R(365, y, 420, 84, { c, fill: '#0f182a' }) + T(385, y + 34, n, { fs: 18, b: true, mono: true }) + T(385, y + 62, d, { fs: 15, c: 'mu' });
    if (vps) s += A(785, y + 42, 880, 225 + (i - 2) * 22, { c: 'red', sw: 2.5 });
  });
  s += R(885, 150, 260, 150, { c: 'red', fill: fill('red', 20) }) + T(1015, 200, 'VPS production', { fs: 20, b: true, a: 'middle' }) +
    T(1015, 230, '3 workflow cùng chạm', { fs: 16, a: 'middle', c: 'red', b: true }) + T(1015, 256, 'không khoá chung nào', { fs: 15, a: 'middle', c: 'mu' });
  s += T(20, 470, '03/07/2026: 9 cú push lên main ⇒ 9 × 4 = 36 lần chạy; mỗi cú push có 3 lần chạy cùng SSH vào một máy.', { fs: 15.5 });
  return sv(1160, 480, s);
};

/* ───────────── Slide 5 — dòng thời gian thật 06/07/2026 ───────────── */
const su06 = () => gantt({
  max: 600, K: 1.45, X0: 250, tick: 60, lab: (v) => { const m = 26 * 60 + 49 + v; return `10:${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`; },
  bands: [[494, 568, 'red', 'CỬA SỔ ĐỎ 10:35:03 → 10:36:17: ba lần chạy cùng sửa container', true]],
  rows: [
    ['ghcr · 3a42ec18', '28784916558', [[0, 23, 'dim', 'huỷ', false]], 'mu'],
    ['vps · 3a42ec18', '28784916588', [[4, 297, 'blu', 'dựng tsc + next build'], [301, 193, 'tea', 'rsync + chép .next'], [494, 50, 'red', ''], [544, 24, 'red', '']]],
    ['vps · 89a38611', '28784932810', [[25, 297, 'blu', 'dựng tsc + next build'], [322, 178, 'tea', 'rsync + chép .next'], [500, 44, 'red', ''], [544, 22, 'red', '']]],
    ['ghcr · 89a38611', '28784932814', [[27, 403, 'blu', 'dựng + đẩy ảnh GHCR'], [441, 122, 'tea', 'pull trên VPS'], [563, 5, 'red', '✗ recreate']], 'red'],
  ],
  note: 'Đỏ = bước sửa container trên VPS (bơm dist, chép .next, recreate). Hai push cách nhau 19 s. Nguồn: API runs/jobs của api-backend.',
});

/* ───────────── Slide 7 — sân tập: đua ───────────── */
const sanDua = () => gantt({
  max: 140, K: 6.2, X0: 250, tick: 20,
  bands: [[56, 135, 'red', 'ảnh MỚI + schema CŨ suốt 79 s (≈ feed 500 ngày 03/07)']],
  rows: [
    ['ghcr · c1 683e7f8', '36017162526', [[2, 6, 'dim', '', true], [8, 30, 'dim', 'dựng… bị huỷ']], 'mu'],
    ['vps · c1', '36017162535', [[2, 8, 'vio', '', true], [10, 40, 'blu', 'dựng 40 s'], [50, 7, 'amb', 'tráo']]],
    ['vps · c2 383f043', '36017208846', [[24, 6, 'vio', '', true], [30, 40, 'blu', 'dựng 40 s'], [70, 2, 'amb', 'tráo']]],
    ['ghcr · c2', '36017208796', [[24, 22, 'vio', 'chờ c1 huỷ', true], [46, 70, 'blu', 'dựng 70 s'], [116, 4, 'amb', ''], [120, 16, 'grn', 'migrate']]],
  ],
  note: 'push 1 lúc +0 s (15:02:05 UTC), push 2 lúc +22 s. Tím nét đứt = chờ máy. Chép đúng cấu hình tháng 7: ghcr có group riêng + huỷ, vps không có group.',
});

/* ───────────── Slide 13 — hai khoá không biết nhau ───────────── */
const haiKhoa = () => diagram({ w: 1160, h: 340, nodes: [
  { id: 'a', x: 0, y: 0, w: 440, h: 96, t: 'bash deploy-nha.sh', d: 'khoá: flock trên VPS\n/var/lock/cuongthai-deploy.lock', c: 'grn', mono: true },
  { id: 'b', x: 0, y: 236, w: 440, h: 96, t: 'deploy-ghcr.yml (bấm tay)', d: 'khoá: concurrency trên GitHub\ngroup: deploy-ghcr', c: 'amb', mono: true },
  { id: 'v', x: 700, y: 100, w: 460, h: 140, t: 'VPS · đêm 10→11/09/2026', d: '21:00 UTC tráo ảnh mới (deploy-nha)\n21:02 UTC run 34529884942 dựng từ main CŨ\n⇒ production LÙI, log hai bên đều xanh', c: 'red' },
], edges: [
  { from: 'a', to: 'v', c: 'grn', t: 'tráo (giữ flock)' },
  { from: 'b', to: 'v', c: 'red', t: 'recreate (không hỏi flock)' },
] });

/* ───────────── Slide 16 — rollback trong 12,6 giây ───────────── */
const rollbackTl = () => {
  let s = '';
  const X0 = 120, K = 76;
  const X = (v) => X0 + v * K;
  for (let i = 0; i <= 13; i += 1) s += `<line x1="${X(i)}" y1="40" x2="${X(i)}" y2="300" stroke="#1d2a40"/>` + T(X(i), 30, `${i}s`, { fs: 13.5, a: 'middle', c: 'dim', mono: true });
  // làn production
  s += T(0, 78, 'prod', { fs: 15, b: true });
  s += R(X(0) - 40, 56, 40, 34, { c: 'grn', fill: fill('grn', 34), r: 6 });
  s += R(X(0), 56, 12.56 * K, 34, { c: 'red', fill: fill('red', 34), r: 6 }) + T(X(0) + 10, 79, 'KHÔNG phục vụ: ảnh 547a5cab thoát ngay (exit 1)', { fs: 14.5, c: '#fff' });
  s += R(X(12.56), 56, 0.44 * K + 40, 34, { c: 'grn', fill: fill('grn', 34), r: 6 }) + T(X(12.56) + 6, 79, '✓', { fs: 16, c: '#fff', b: true });
  // các lần kiểm
  [[0.19, 'reset'], [2.27, '(7)'], [4.29, '(7)'], [6.31, '(7)'], [8.33, '(7)']].forEach(([v, e], i) => {
    s += `<circle cx="${X(v)}" cy="140" r="12" fill="${D.red}"/>` + T(X(v), 146, '✗', { fs: 15, a: 'middle', b: true, c: '#08101e' }) + T(X(v), 176, `lần ${i + 1}`, { fs: 13.5, a: 'middle', c: 'mu' }) + T(X(v), 196, `curl ${e}`, { fs: 13, a: 'middle', c: 'dim', mono: true });
  });
  s += T(0, 146, 'kiểm', { fs: 15, b: true });
  s += R(X(10.39), 118, 2.17 * K, 44, { c: 'amb', fill: fill('amb', 30), r: 6 }) + T(X(10.39) + 8, 146, 'rollback 2,2 s', { fs: 14.5, c: '#fff', b: true });
  s += T(0, 246, 'mốc', { fs: 15, b: true });
  s += `<line x1="${X(0)}" y1="215" x2="${X(0)}" y2="262" stroke="${D.amb}" stroke-width="2"/>` + T(X(0) + 6, 250, '15:06:28,24 · xoá container cũ', { fs: 14, c: 'amb', mono: true });
  s += `<line x1="${X(10.35)}" y1="215" x2="${X(10.35)}" y2="262" stroke="${D.amb}" stroke-width="2"/>` + T(X(10.35) - 6, 250, '15:06:38,59 · hết lượt, in log', { fs: 14, c: 'amb', a: 'end', mono: true });
  s += `<line x1="${X(12.56)}" y1="215" x2="${X(12.56)}" y2="292" stroke="${D.grn}" stroke-width="2"/>` + T(X(12.56) - 6, 284, '15:06:40,80 · khoẻ lại', { fs: 14, c: 'grn', a: 'end', mono: true });
  s += T(0, 340, 'Ngân sách kiểm sức khoẻ = 5 lần × 2 s ⇒ 10 s. Thời gian sập ≈ ngân sách kiểm + rollback: 12,6 s.', { fs: 16, b: true });
  s += T(0, 368, 'Kiểm lâu hơn thì bắt được ảnh khởi động chậm, nhưng mỗi lần hỏng thật cũng sập lâu hơn — đó là một đánh đổi, không phải một hằng số.', { fs: 14.5, c: 'mu' });
  return sv(1160, 380, s);
};

/* ───────────── Slide 21 — dòng đời một deployment ───────────── */
const vongDoi = () => {
  let s = '';
  const P = [
    ['waiting', '15:10:09', 'dung xong; job chờ người duyệt', 'vio'],
    ['queued', '15:10:16', 'đã duyệt (7 s); chờ máy + khoá ch09-production', 'blu'],
    ['in_progress', '15:10:19', 'job trien-khai chạy; bí mật environment mở ra từ đây', 'amb'],
    ['success', '15:10:37', 'environment_url = cây mã của commit ff166e70', 'grn'],
  ];
  P.forEach(([st, tm, d, c], i) => {
    const x = 10 + i * 290;
    s += R(x, 40, 260, 120, { c, fill: fill(c, 22) }) + T(x + 130, 82, st, { fs: 21, b: true, a: 'middle', mono: true }) + T(x + 130, 112, tm, { fs: 16, a: 'middle', c: 'mu', mono: true });
    if (i < 3) s += A(x + 262, 100, x + 288, 100, { c: 'mu', sw: 2.5 });
    const words = d.split(' '); let line = '', ly = 200; const out = [];
    words.forEach((w) => { if ((line + ' ' + w).length > 30) { out.push(line); line = w; } else line = line ? line + ' ' + w : w; });
    out.push(line);
    out.forEach((l, j) => { s += T(x + 4, ly + j * 22, l, { fs: 15, c: '#cfd9e8' }); });
  });
  s += T(10, 330, 'Đọc được bằng API, không cần giao diện:', { fs: 15.5, b: true });
  s += T(10, 360, 'gh api "repos/{o}/{r}/deployments?environment=ch09-production" → id', { fs: 15, mono: true, c: 'tea' });
  s += T(10, 386, 'gh api repos/{o}/{r}/deployments/<id>/statuses --jq \'.[].state\'', { fs: 15, mono: true, c: 'tea' });
  s += T(10, 424, 'Run 36018120566 · sân tập · 24/09/2026. Mỗi job có environment: sinh ra MỘT deployment — kể cả job bị từ chối (failure←waiting).', { fs: 14, c: 'mu' });
  return sv(1160, 440, s);
};

export const slides = S([
  /* 1 */ cover({ t: 'Chương 9 — Deploy từ CI, và vì sao kho này đã thôi', sub: 'push-để-deploy · chạy ở đâu · rollback · environment có người duyệt · thông báo', chap: 'CHƯƠNG 9' }),

  /* 2 */ { t: 'Bản đồ chương: deploy là một TRÌNH TỰ, không phải một nút', body: mindmap('deploy', 'năm câu hỏi trước khi bật "push là lên"', [
    { t: '9.1 Push-để-deploy', d: '4 workflow / 1 push · đua 06/07 · khoá chung vẫn thiếu', c: 'red' },
    { t: '9.2 Script hay pipeline', d: 'deploy-nha.sh vs GitHub Actions · ba nơi chạy', c: 'dk' },
    { t: '9.3 Rollback', d: 'tự rollback 12,6 s · hỏi prod, đừng đoán HEAD^', c: 'amb' },
    { t: '9.4 Environment', d: 'duyệt · từ chối · chặn nhánh — đo thật', c: 'tea' },
    { t: '9.5 Thông báo', d: 'tóm tắt job · ::error · Telegram của script', c: 'grn' },
  ]) },

  /* ───── 9.1 ───── */
  /* 3 */ { t: 'Tháng 7: một cú push = bốn workflow, ba cái SSH vào VPS', body: motPush() },

  /* 4 */ { t: 'paths: trùng nhau ⇒ hai workflow deploy luôn chạy cùng lúc', body: two(
    yaml([
      ['# deploy-ghcr.yml (trước 094db93b)', ''],
      ['on:', ''],
      ['  push:', ''],
      ['    branches: [main]', ''],
      ['    paths:', ''],
      ["      # All other commits keep using", 'chú thích này SAI'],
      ["      #   backend-vps.yml", ''],
      ["      - 'src/**'", 'trùng'],
      ["      - 'prisma/**'", 'trùng'],
      ["      - 'frontend/**'", 'trùng'],
      ["      - 'nginx/**'", 'trùng'],
    ], { fs: 15.5 }),
    yaml([
      ['# backend-vps.yml (trước 094db93b)', ''],
      ['on:', ''],
      ['  push:', ''],
      ['    branches: [main]', ''],
      ['    paths:', ''],
      ["      - 'src/**'", ''],
      ["      - 'prisma/**'", ''],
      ["      - 'frontend/**'", ''],
      ["      - 'nginx/**'", ''],
      ["      - 'scripts/**'", ''],
      ['# (không có concurrency:)', 'không khoá'],
    ], { fs: 15.5 }) + box('warn', 'Tác giả tin bộ lọc chia việc cho hai workflow. Thật ra mọi push đụng mã đều khớp CẢ HAI. Đọc <code>paths:</code> như một phép giao, không như lời hứa.')) },

  /* 5 */ { t: 'Sự cố 06/07/2026: 74 giây ba lần chạy cùng sửa container', body: su06() },

  /* 6 */ { t: 'Log thật: lần chạy thứ ba vấp container mà lần khác đang dùng', body: two(
    gaTerm([
      '# api-backend · run 28784932814 · deploy-ghcr.yml',
      '# bước "Recreate backend + frontend containers"',
      'docker compose -f docker-compose.yml \\',
      '  -f docker-compose.ghcr.yml \\',
      '  up -d --force-recreate --no-deps backend frontend',
      ' Container cuonghoangdev_backend Recreate',
      ' Container cuonghoangdev_frontend Recreate',
      '! Error response from daemon: cannot remove',
      '!   container "6095eb881aed…": container is running:',
      '!   stop the container before removing or force remove',
      '! ##[error]Process completed with exit code 1.',
    ], { title: 'gh run view 28784932814 --log-failed', dir: '~/api-backend', fs: 14.5 }),
    `${table(['Bước sau đó', 'Kết quả'], [
      ['Apply Prisma migrations', '-skipped'],
      ['Reload nginx', '-skipped'],
      ['Wait for backend healthcheck', '-skipped'],
      ['Verify production URL', '-skipped'],
    ], { sm: true })}
     ${box('bad', 'Đỏ nửa chừng: ảnh MỚI đã kéo về, migration KHÔNG chạy, còn hai lần chạy <code>backend-vps</code> kia báo <strong>xanh</strong>. Ai nhìn tab Actions thấy 2 xanh 1 đỏ — không thấy production đang ở trạng thái nào.')}`) },

  /* 7 */ { t: 'Sân tập chép cấu hình tháng 7: ảnh mới + schema cũ 79 giây', body: sanDua() },

  /* 8 */ { t: 'Khoá chung chưa đủ: workflow có migration bị thay khi chờ', body: two(
    table(['Lần chạy (group ch09-prod-khoa)', 'Kết quả'], [
      ['vps · c1 ba75b31 · 36017502640', '+chạy, tráo lúc 15:05:37'],
      ['ghcr · c1 · 36017502683', '-bị thay khi chờ · 0 job'],
      ['ghcr · c2 1b2d46b · 36017548107', '-bị thay khi chờ · 0 job'],
      ['vps · c2 · 36017547619', '+chờ c1 xong, tráo lúc 15:06:28'],
    ], { sm: true }) + t(['cat production.txt   # nhánh ch09-prod, sau cùng', 'anh=1b2d46b', '! schema=383f043      # của thí nghiệm TRƯỚC'], 'kết quả', 15),
    `${box('warn', 'Khoá chung làm đúng việc của nó: <strong>không còn hai lần tráo chồng nhau</strong>. Nhưng một group chỉ giữ MỘT lần chạy đang chờ — cái mới hơn thay cái cũ. Workflow duy nhất biết chạy migration bị thay hai lần; hai commit lên production mà schema chưa từng được áp.')}
     ${box('good', 'Vì vậy thuộc tính đầu tiên của push-để-deploy an toàn là <strong>đúng MỘT workflow deploy</strong>, sở hữu cả trình tự migrate → tráo → kiểm. Khoá chỉ là thuộc tính thứ hai.')}`) },

  /* ───── 9.2 ───── */
  /* 9 */ { t: 'Site bạn deploy bằng script tay — GitHub Actions chỉ làm CI', body: table(['', 'bash deploy-nha.sh (đang dùng)', 'Pipeline CD trên GitHub Actions'], [
    ['Ai bấm', 'Bạn, trên máy Mac, khi quyết định', 'Một sự kiện: push / tag / bấm Run'],
    ['Dựng ở đâu', 'Máy nhà 12 nhân · song song ~3–6 phút', 'Runner GitHub 4 nhân · dùng một lần'],
    ['Lấy mã từ', '<code>git push</code> commit đã commit sang kho trần ở nhà', '<code>actions/checkout</code> — commit trên GitHub'],
    ['Khoá chống đua', '<code>flock</code> trên VPS', '<code>concurrency:</code> trên GitHub'],
    ['Bí mật', 'khoá SSH trên máy bạn · <code>.env</code> trên VPS', '<code>secrets.*</code> / environment secrets'],
    ['Người duyệt', 'chính bạn (đang nhìn terminal)', '<code>environment:</code> có required reviewers'],
    ['Ghi lại', 'log trong terminal + tin Telegram khi hỏng', 'tab Actions, deployments, tóm tắt job — ai cũng xem được'],
    ['Đẩy GitHub', 'TỰ <code>git push</code> ở cuối nếu bộ kiểm CI xanh', 'mã đã ở GitHub trước khi deploy'],
    ['Điểm yếu', '!phụ thuộc một người + một máy', '!chạy khi không ai nhìn · runner phải SSH vào VPS'],
  ], { sm: true }) },

  /* 10 */ { t: 'Chọn cái nào: đếm người, đếm máy, đếm số lần deploy', body: two(
    cards([
      { ic: '🧑‍💻', t: 'Giữ script chạy tay khi', d: '1–2 người deploy · một VPS · dựng nặng cần máy khoẻ của bạn · cần deploy thứ chưa lên GitHub (deploy.sh)', c: 'grn' },
      { ic: '🏭', t: 'Chuyển sang pipeline CD khi', d: 'có người thứ hai/ba · cần lịch sử ai deploy gì · muốn người duyệt khác người viết · deploy nhiều lần mỗi ngày', c: 'blu' },
    ], 1),
    `${box('info', 'Không phải lựa chọn một lần. Kho này đi CD → script (06/07) vì CD thiếu ba thuộc tính. Muốn quay lại CD thì mang theo đúng những thứ script đã học: MỘT đường deploy, khoá chung, hỏi production đang chạy gì, tự rollback.')}
     ${box('tip', 'Dạng lai hay gặp: CI trên GitHub (<code>ci-lint.yml</code>) + deploy chạy tay có chốt. Script của bạn thậm chí chạy lại đúng bộ kiểm của CI trước khi push.')}`) },

  /* 11 */ { t: 'Ba nơi một bước có thể chạy — kho này đặt bước nào ở đâu', body: diagram({ w: 1160, h: 470, nodes: [
    { id: 'gh', x: 0, y: 10, w: 350, h: 190, t: '☁ Runner GitHub', d: 'dùng một lần · 4 nhân · 16 GB\nci-lint.yml: tsc, test, eval\ndeploy-ghcr.yml: dựng ảnh (4 phút)\nsân tập ch09-cd.yml: dựng + tráo giả', c: 'blu' },
    { id: 'nha', x: 405, y: 10, w: 350, h: 190, t: '🏠 Máy nhà (Fedora)', d: '12 nhân · 31 GB · cache ẤM\ndeploy-nha.sh bước 3: dựng 2 ảnh\nsong song, kiểm libc ↔ engine\nbước 4: đẩy lên GHCR', c: 'grn' },
    { id: 'vps', x: 810, y: 10, w: 350, h: 190, t: '🖥 VPS production', d: '6 GB · đĩa chung với Postgres\ndeploy-nha.sh bước 5: flock,\npull, tráo, migrate, smoke-test\nKHÔNG dựng gì (--no-build)', c: 'red' },
    { id: 'mac', x: 400, y: 330, w: 360, h: 110, t: '💻 Mac của bạn', d: 'chạy deploy-nha.sh, điều phối qua SSH\nbước 8: chạy lại bộ kiểm CI → git push', c: 'vio' },
  ], edges: [
    { from: 'mac', to: 'nha', c: 'vio', t: 'git push kho trần' },
    { from: 'nha', to: 'vps', c: 'grn', t: 'GHCR' },
    { from: 'mac', to: 'vps', c: 'vio', t: 'ssh', bend: 60 },
    { from: 'mac', to: 'gh', c: 'dim', t: 'git push (cuối)', bend: -60 },
  ] }) },

  /* 12 */ { t: 'deploy-ghcr.yml: runner dựng 4 phút, rồi mọi việc thật đi qua SSH', body: gantt({
    max: 600, K: 1.45, X0: 250, tick: 60,
    rows: [
      ['trên runner', 'checkout → buildx', [[0, 22, 'dim', ''], [22, 280, 'blu', 'npm ci + tsc + next build (4 phút)'], [302, 105, 'tea', 'dựng + đẩy 2 ảnh']]],
      ['qua SSH → VPS', 'ssh vps "…"', [[407, 11, 'vio', ''], [418, 122, 'amb', 'docker pull 2 phút'], [540, 5, 'red', 'recreate ✗']]],
      ['không tới', 'migrate · nginx · kiểm', [[545, 55, 'dim', 'bỏ qua', true]], 'mu'],
    ],
    note: 'Run 28784932814 (06/07/2026, 10:27:16 → 10:36:25). Runner làm phần dễ lặp lại; 5 bước chạm production đều là lệnh ssh — log chỉ thấy cái SSH in ra.',
  }) },

  /* 13 */ { t: 'Dựng MỘT lần, gửi ảnh dạng artifact, đích chỉ nạp và tráo', body: two(
    diagram({ w: 600, h: 430, nodes: [
      { id: 'k', x: 0, y: 10, w: 250, h: 74, t: 'kiem', d: '5 s', c: 'grn', mono: true },
      { id: 'd', x: 0, y: 150, w: 250, h: 92, t: 'dung', d: 'docker build · save | gzip\n2,2 MB · 8 s', c: 'blu', mono: true },
      { id: 'a', x: 340, y: 150, w: 250, h: 92, t: 'artifact anh-ch09', d: 'upload-artifact@v4\ngiữ 3 ngày', c: 'vio', mono: true },
      { id: 't', x: 0, y: 320, w: 590, h: 92, t: 'trien-khai · environment ch09-production', d: 'download → docker load → tráo → kiểm → ghi "đang chạy" · 17 s', c: 'amb', mono: true },
    ], edges: [{ from: 'k', to: 'd' }, { from: 'd', to: 'a', c: 'vio' }, { from: 'a', to: 't', c: 'vio' }] }),
    `${t(['Run actions/download-artifact@v4', 'gunzip -c anh.tar.gz | docker load', 'Loaded image: ch09-app:ff166e70', 'truoc khi trao: ch09-app:1b2d46bf', 'da trao sang: ch09-app:ff166e70', 'phien-ban=ff166e70', '+ khoe sau lan 1'], 'run 36018120566 · job trien-khai', 14.5)}
     ${box('good', 'Ảnh được kiểm là ĐÚNG ảnh được deploy — cùng tệp, cùng mã băm. Dựng lại ở đích là dựng một thứ KHÁC thứ đã kiểm (và 18/08 kho này dựng nhầm Dockerfile: xanh cả ba bước, 502 bảy phút).')}`) },

  /* 14 */ { t: 'Hai đường deploy, hai khoá không biết nhau', body: haiKhoa() + box('warn', 'Khoá chỉ bảo vệ những ai HỎI khoá. <code>deploy-nha.sh</code> giữ <code>flock</code> trên VPS; <code>deploy-ghcr.yml</code> vẫn bấm tay được và không hỏi <code>flock</code>. Cách vá của script: chốt cuối so mã băm ảnh container với mã băm lúc tráo — lệch là báo "bị tráo đè".') },

  /* ───── 9.3 ───── */
  /* 15 */ { t: 'Ba kiểu rollback — chỉ một kiểu nhanh, và chỉ khi ảnh cũ còn', body: cards([
    { ic: '🏷', t: 'Tráo lại ảnh cũ', big: '~40 s', d: 'ảnh gắn thẻ theo SHA còn trên GHCR (kho này: 1.647 phiên bản). <code>deploy-nha.sh --cho-lui</code> hoặc tag + <code>up --no-build</code>', c: 'grn' },
    { ic: '↩️', t: 'git revert + deploy lại', big: '3–15 phút', d: 'mã là thứ duy nhất hỏng. Đi đúng đường deploy thường, có đủ chốt kiểm', c: 'blu' },
    { ic: '🗄', t: 'Khôi phục dữ liệu', big: 'giờ', d: 'schema/dữ liệu đã đổi kiểu một chiều. Không phải rollback mã — là sự cố dữ liệu', c: 'red' },
  ], 3) + box('info', 'Bước 7 của <code>deploy-nha.sh</code> xoá ảnh SHA cũ TRÊN VPS để cứu đĩa (13/09: ~20 GB ảnh có thẻ lấp ổ Postgres). Nghĩa là ảnh cũ nằm ở GHCR, không nằm trên máy — rollback nhanh phải <code>docker pull</code> lại.') },

  /* 16 */ { t: 'Sân tập: ảnh hỏng → 5 lần kiểm → tự rollback, sập 12,6 giây', body: rollbackTl() },

  /* 17 */ { t: 'Log thật của rollback: nhánh else nằm NGAY trong workflow', body: two(
    t([
      'da trao sang: ch09-app:547a5cab',
      'curl: (56) Recv failure: Connection reset by peer',
      'lan 1: chua tra loi (trang thai: exited exit=1)',
      '…  lan 2 → lan 5: curl: (7) Failed to connect',
      '--- log container ---',
      '! LOI: khong nap duoc engine (gia lap anh hong)',
      '! ##[error]Process completed with exit code 1.',
      'rollback: ch09-app:547a5cab -> ch09-app:1b2d46bf',
      '+ phien-ban=1b2d46bf',
      '+ rollback XONG, production khoe lai',
    ], 'run 36017616624 · trien-khai', 14.5),
    yaml([
      ['- name: Kiểm sức khoẻ (5 lần × 2 s)', ''],
      ['  id: kiem_suc_khoe', 'đặt id để hỏi lại'],
      ['  run: for i in 1 2 3 4 5; do …', 'exit 1 nếu hết lượt'],
      ['- name: TỰ rollback về ảnh trước', ''],
      ["  if: failure() && steps.kiem_suc_khoe", 'chỉ khi KIỂM hỏng,'],
      ["      .outcome == 'failure'", 'không phải khi tải hỏng'],
      ['  run: docker run … "$PREV"', 'PREV ghi TRƯỚC khi tráo'],
      ['- name: Tóm tắt deploy', ''],
      ['  if: always()', 'luôn ghi prod đang chạy gì'],
    ], { fs: 14.5 }) + box('warn', 'Job vẫn ĐỎ sau khi rollback thành công — đúng ý: deploy thất bại, production an toàn. Hai sự thật, cần cả hai.')) },

  /* 18 */ { t: '"Bản trước" không phải HEAD^ — hỏi production đang chạy gì', body: two(
    `${t(['# run 36017879471 · commit b406a95 (vá lỗi)', '# bản đầu của bước chuẩn bị: PREV = HEAD^', 'PREV=547a5cab   # chính là ảnh HỎNG vừa rollback', 'docker run -d --name ch09-prod … ch09-app:547a5cab', '! curl: (7) Failed to connect to localhost port 19090', '! ##[error]Process completed with exit code 7.'], 'lần đoán sai', 14.5)}
     ${t(['# run 36018120566 · bản sửa: đọc cd-dang-chay.txt', 'production dang chay: 1b2d46bf', 'truoc khi trao: ch09-app:1b2d46bf', '+ da trao sang: ch09-app:ff166e70'], 'lần hỏi đúng', 14.5)}`,
    `${box('bad', 'Sau một lần rollback, commit cha là bản đã BỊ gỡ. Mọi script coi "HEAD^ là bản đang chạy" sẽ rollback về chính cái hỏng.')}
     ${box('good', '<code>deploy-nha.sh</code> chốt 0a làm đúng việc này: đọc mã băm ảnh của container <code>cuonghoangdev_backend</code>, tra ra SHA, rồi <code>git merge-base --is-ancestor</code>. Không chứa ⇒ DỪNG (sự cố 13/09: nhánh tách sớm gỡ mất mã thương mại).')}
     ${box('tip', 'Muốn CỐ Ý lùi: <code>bash deploy-nha.sh --cho-lui</code>. Cờ tên riêng = hành động có chủ ý, không phải tai nạn.')}`) },

  /* 19 */ { t: 'Schema: mở rộng trước, thu hẹp sau — rollback bằng MÃ', body: two(
    steps([
      ['Deploy 1 · <strong>expand</strong>: thêm cột mới (nullable)', 'mã cũ vẫn chạy — nó không biết cột mới'],
      ['Deploy 2: mã ghi CẢ HAI cột, đọc cột cũ', 'rollback = về Deploy 1, schema giữ nguyên'],
      ['Chạy nền: chép dữ liệu cũ → mới', 'không cần deploy'],
      ['Deploy 3: mã đọc cột mới', 'rollback = về Deploy 2'],
      ['Deploy 4 · <strong>contract</strong>: xoá cột cũ', 'bước DUY NHẤT một chiều — làm khi đã yên'],
    ]),
    `${box('warn', 'Thứ tự trong <code>deploy-nha.sh</code>: bước 5 TRÁO ảnh, bước 6 mới <code>prisma migrate deploy</code>. Có một khoảng mã mới chạy trên schema cũ — an toàn CHỈ KHI migration là kiểu expand. Đổi tên cột trong một lần = lặp lại 03/07.')}
     ${box('info', 'Sân tập <code>ch09-khoa-ghcr.yml</code> đảo lại: migrate TRƯỚC, tráo SAU. Cách nào cũng được, miễn mã cũ lẫn mã mới đều chạy được trên schema ở giữa.')}`) },

  /* ───── 9.4 ───── */
  /* 20 */ { t: 'environment: biến một job thành cuộc deploy có cổng', body: two(
    yaml([
      ['trien-khai:', ''],
      ['  needs: dung', ''],
      ['  runs-on: ubuntu-24.04', ''],
      ['  environment:', ''],
      ['    name: ch09-production', 'luật đặt ở Settings'],
      ['    url: https://github.com/…/tree/…', 'hiện trên run + deployments'],
      ['  concurrency:', ''],
      ['    group: ch09-production', 'một deploy một lúc'],
      ['    cancel-in-progress: false', 'không cắt giữa tráo'],
      ['  permissions:', ''],
      ['    contents: write', 'CHỈ job này được ghi'],
    ], { fs: 15 }),
    table(['Luật của ch09-production', 'Đặt bằng'], [
      ['Required reviewers: cuonghoang1103', '<code>PUT …/environments/ch09-production</code>'],
      ['prevent_self_review: false', 'một mình trên sân tập nên tự duyệt'],
      ['Chỉ nhánh <code>ch09-deploy</code>', '<code>POST …/deployment-branch-policies</code>'],
      ['Bí mật riêng environment', 'không dùng ở sân tập'],
    ], { sm: true }) + box('info', 'Job có <code>environment:</code> không chạy bước nào — kể cả không nhận bí mật environment — trước khi qua cổng.')) },

  /* 21 */ { t: 'Một deployment đi qua bốn trạng thái — và API ghi lại cả bốn', body: vongDoi() },

  /* 22 */ { t: 'Ba lần cổng nói KHÔNG, ba câu báo lỗi khác nhau', body: table(['Tình huống (sân tập, 24/09/2026)', 'Run', 'Kết quả job trien-khai'], [
    ['Người duyệt bấm Approve, ghi lý do', '36018120566', '+success · approvals: "Da doc: … Duyet."'],
    ['Người duyệt bấm Reject: "dang gio cao diem"', '36018283303', '-failure · "The deployment was rejected or didn\'t satisfy other protection rules."'],
    ['Push từ nhánh <code>ch09-nhanh-la</code>', '36017890545', '-failure · "Branch "ch09-nhanh-la" is not allowed to deploy to ch09-production due to environment protection rules."'],
    ['Không ai bấm gì', '—', '!chờ tối đa 30 ngày rồi tự huỷ'],
  ], { sm: true }) + box('tip', 'Duyệt không cần giao diện: <code>gh api -X POST …/runs/&lt;id&gt;/pending_deployments -F environment_ids[]=&lt;id&gt; -f state=approved -f comment=…</code>. Lời bình được lưu, đọc lại bằng <code>…/runs/&lt;id&gt;/approvals</code>.') },

  /* 23 */ { t: 'Luật environment tuỳ gói và kho công khai/riêng tư (09/2026)', body: two(
    table(['Tính năng', 'Kho công khai', 'Kho riêng tư · Free', 'Riêng tư · Pro/Team'], [
      ['Required reviewers (≤ 6)', '+có', '-không', '-không'],
      ['Wait timer 1–43.200 phút', '+có', '-không', '-không'],
      ['Chặn theo nhánh/tag', '+có', '-không', '+có'],
      ['Bí mật environment', '+có', '-không', '+có'],
      ['Cấm admin vượt cổng', '+có', '-không', '-không'],
    ], { sm: true }),
    `${box('info', 'api-backend là kho <strong>công khai</strong> ⇒ dùng được hết. Enterprise thì có cả cho kho riêng tư. Nguồn: docs.github.com "Deployments and environments", đọc 24/09/2026.')}
     ${box('warn', 'Mặc định <strong>admin vượt được cổng</strong>. Bạn là admin kho của mình ⇒ "cần người duyệt" chưa chặn được chính bạn, trừ khi tắt quyền vượt.')}`) },

  /* ───── 9.5 ───── */
  /* 24 */ { t: 'Thông báo rẻ nhất: tóm tắt job + một annotation lỗi', body: two(
    `<div style="background:#0d1117;border:1.5px solid ${D.bd};border-radius:12px;padding:16px 20px;text-align:left;color:#e6edf3">
      <div style="font-size:21px;font-weight:800;margin-bottom:10px">Deploy ch09-production</div>
      <table style="border-collapse:collapse;font-size:16px;width:100%">${[['Commit', '547a5cab'], ['Ảnh muốn tráo', 'ch09-app:547a5cab'], ['Kiểm sức khoẻ', 'failure'], ['Production đang chạy', 'ch09-app:1b2d46bf'], ['Thời gian', '13 s']].map(([a, b], i) => `<tr style="border-top:1px solid ${D.bd}"><td style="padding:7px 10px;color:${D.mu}">${a}</td><td style="padding:7px 10px;font-family:SF Mono,Menlo,monospace;color:${i === 2 ? D.red : '#e6edf3'}">${b}</td></tr>`).join('')}</table>
      <div style="margin-top:14px;padding:10px 12px;border-left:4px solid ${D.red};background:rgba(255,92,108,.08);font-size:15px"><b style="color:${D.red}">Deploy hong</b> · 547a5cab khong qua kiem suc khoe, da rollback ve ch09-app:1b2d46bf</div>
      <div style="font-size:13.5px;color:${D.mu};margin-top:8px">run 36017616624 · trang tóm tắt của lần chạy + annotation</div></div>`,
    yaml([
      ['- name: Tóm tắt deploy', ''],
      ['  if: always()', 'đỏ hay xanh đều ghi'],
      ['  run: |', ''],
      ['    { echo "### Deploy …"', 'Markdown'],
      ['      echo "| Commit | … |"', ''],
      ['    } >> "$GITHUB_STEP_SUMMARY"', 'hiện trên trang run'],
      ['- name: Thông báo', ''],
      ['  if: failure()', 'CHỈ khi hỏng'],
      ['  run: echo "::error title=Deploy', 'annotation đỏ'],
      ['      hong::… da rollback ve $PREV"', ''],
    ], { fs: 14.5 })) },

  /* 25 */ { t: 'Gửi gì, cho ai, qua đâu — xanh không phải tin tức', body: table(['Sự kiện', 'Gửi?', 'Kênh', 'Phải có trong tin'], [
    ['Deploy production HỎNG, đã rollback', '+có', 'kênh trực', 'commit · bước hỏng · prod ĐANG chạy gì · link run'],
    ['Deploy production HỎNG, rollback cũng hỏng', '+có — gấp', 'gọi / trực', 'như trên + "production đang sập"'],
    ['Deploy thành công', '!ghi, không ping', 'kênh ít ưu tiên / tóm tắt', 'SHA + thời gian'],
    ['CI đỏ trên main', '+có', 'kênh nhóm', 'bước đỏ + mã thoát'],
    ['CI đỏ trên PR', '-không', 'chính trang PR', '—'],
    ['Cron dọn dẹp hỏng', '+có', 'kênh vận hành', 'đĩa còn bao nhiêu'],
  ], { sm: true }) + box('tip', 'Quy tắc: mỗi tin phải trả lời được "tôi có cần mở máy NGAY không?" mà chưa cần bấm link.') },

  /* 26 */ { t: 'Script của bạn đã có thông báo: ba chỗ gọi bao-tin.sh', body: two(
    table(['Chỗ trong deploy-nha.sh', 'Khi nào báo'], [
      ['5c · kiểm từ ngoài', '"container khoẻ nhưng TỪ NGOÀI 502 — nginx trỏ IP cũ?"'],
      ['8 · bộ kiểm CI hỏng', '"Deploy xong (prod chạy SHA) nhưng KHÔNG push"'],
      ['Chốt cuối · mã băm lệch', '"Deploy SHA BỊ TRÁO ĐÈ — chạy lại"'],
      ['Mọi bước khác', 'không báo — bạn đang nhìn terminal'],
    ], { sm: true }) + box('info', 'Tin đi qua máy nhà (<code>$HOME/bin/bao-tin.sh</code>, Telegram). Bài 9.5 bản cũ ghi "0 thông báo" là đúng với <code>.github/workflows/</code>, nhưng thiếu phần script.'),
    `${box('bad', 'Trước 06/09/2026 bước 8 HỎI DUYỆT qua Telegram, chờ 15 phút. Bốn lượt một ngày không ai trả lời ⇒ "KHÔNG push" rồi kết thúc XANH. Dồn tới 288 commit chỉ nằm trên một máy.')}
     ${box('good', 'Bài học cho thông báo: tin chờ người trả lời là một cái cổng; cổng hết giờ phải kêu, không được lặng lẽ chọn nhánh an toàn. Nay bước 8 tự chạy bộ kiểm và chỉ báo khi hỏng.')}`) },

  /* 27 */ { t: 'Sai lầm hay gặp ở Chương 9', body: cards([
    { ic: '🔀', t: 'Hai workflow cùng deploy', d: 'paths: trùng ⇒ luôn chạy cùng lúc. Một đường deploy duy nhất.', c: 'red' },
    { ic: '🔒', t: 'Khoá chung là đủ', d: 'Group giữ 1 lần chờ: workflow mang migration bị thay.', c: 'ora' },
    { ic: '🏗', t: 'Dựng lại ở đích', d: 'Ảnh deploy khác ảnh đã kiểm. Dựng một lần, ship artifact.', c: 'amb' },
    { ic: '⏮', t: 'Bản trước = HEAD^', d: 'Sau rollback, HEAD^ là bản hỏng. Hỏi production.', c: 'vio' },
    { ic: '✅', t: 'Người duyệt không đọc gì', d: 'Đưa commit, ảnh, migration lên TRƯỚC cổng.', c: 'blu' },
    { ic: '🔔', t: 'Ping mọi lần chạy xanh', d: 'Kênh bị tắt tiếng; tin đỏ thứ 11 bị bỏ qua.', c: 'pnk' },
  ], 3) },

  /* 28 */ { t: 'Bảng tra nhanh Chương 9', body: table(['Muốn', 'Viết / làm'], [
    ['Cổng deploy', '<code>environment: { name: production, url: … }</code> trên job deploy'],
    ['Một deploy một lúc', '<code>concurrency: { group: production, cancel-in-progress: false }</code> — CHUNG mọi đường deploy'],
    ['Dựng một lần', '<code>upload-artifact</code> ở job dựng → <code>download-artifact</code> + <code>docker load</code> ở job deploy'],
    ['Tự rollback', 'ghi <code>PREV</code> trước khi tráo · bước kiểm có <code>id</code> · <code>if: failure() &amp;&amp; steps.&lt;id&gt;.outcome == \'failure\'</code>'],
    ['Duyệt bằng CLI', '<code>gh api -X POST …/runs/&lt;id&gt;/pending_deployments -F environment_ids[]=… -f state=approved</code>'],
    ['Xem lịch sử deploy', '<code>gh api "…/deployments?environment=&lt;tên&gt;"</code> + <code>…/deployments/&lt;id&gt;/statuses</code>'],
    ['Tóm tắt + báo lỗi', '<code>&gt;&gt; "$GITHUB_STEP_SUMMARY"</code> với <code>if: always()</code> · <code>::error title=…::…</code> với <code>if: failure()</code>'],
    ['Deploy site bạn', '<code>bash deploy-nha.sh</code> (TỰ push cuối) · lùi: <code>deploy.sh</code> · cố ý lùi: <code>--cho-lui</code>'],
  ], { sm: true }) },

  /* 29 */ { t: 'Thực hành Chương 9 (60 phút) trên kho thử của chính bạn', body: two(list([
    '<strong>1.</strong> Chép <code>ch09-cd.yml</code> + <code>ch09/app/</code> (nhánh <code>ch09-deploy</code> của sân tập) vào kho thử CÔNG KHAI; tạo nhánh <code>ch09-prod</code> có <code>cd-dang-chay.txt</code> = SHA commit đầu.',
    '<strong>2.</strong> Tạo environment <code>thu-production</code>: bạn là người duyệt, chỉ cho nhánh của bạn.',
    '<strong>3.</strong> Push bản tốt → duyệt → xanh. Push <code>HONG=1</code> → duyệt → thấy tự rollback.',
    '<strong>4.</strong> Push từ nhánh khác; chụp dòng "is not allowed to deploy".',
    '<strong>5.</strong> Viết bảng: site của bạn đang deploy thế nào (deploy-nha.sh làm gì ở đâu) so với pipeline vừa làm.',
  ]), box('good', '<strong>Đạt khi</strong> bạn có 4 link run (xanh · rollback · bị chặn nhánh · bị từ chối), <code>gh api …/deployments</code> ra đủ 4 deployment với trạng thái đúng, và bảng so sánh trả lời được "khi nào tôi chuyển sang CD".<br><br>Dọn: xoá environment thử, xoá nhánh thử.')) },
]);
