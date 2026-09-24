/**
 * GitHub Actions · Deck ga-05 — Chương 5: Cache và artifact, đo thật.
 *
 * MỌI log/con số mới trên slide là THẬT, chạy 24/09/2026 trên sân tập công khai
 * github.com/cuonghoang1103/ga-san-tap, nhánh ch05-cache (runner 2.337.0, ảnh ubuntu-24.04 20260920.314.1):
 *   ch05-do-cache.yml  36004518266 (trượt → lưu) · 36004724418 / 36004886526 / 36004891780 / 36004897271 / 36005363122 (trúng)
 *   ch05-khoa.yml      36004518205 · 36004824230 (tiền tố, thứ tự restore-keys, bất biến, "version" ẩn, khoá hằng)
 *   ch05-pham-vi.yml   36004518119 · 36005100779 (ch05-cache) · 36004861851 · 36005610825 (ch05-cache-em)
 *                      36004957041 lần 1 + lần chạy lại 2 (PR #4: ch05-cache-em → ch05-cache)
 *   ch05-chet.yml      36005363653 · 36005391539 · 36005477680 · 36005567469 (cache rỗng, cache chết, khoá luôn trượt, tsc)
 *   ch05-artifact.yml  36004518209 (409, ID cũ) · 36004824017 (node_modules 28.484 file, quyền + file ẩn)
 * Giới hạn: docs.github.com (dependency-caching, billing github-actions, retention) + README upload-artifact — đọc 24/09/2026.
 * Dự án thử ch05/app: package-lock 743 mục → 681 gói, node_modules 854 MB / 28.446 file.
 */
import { S, cover, cards, box, table, two, list, mindmap, term as gaTerm, yaml, bars, kpis, sv, R, T, A, D } from './_ga-chung.mjs';

export const deck = { key: 'ga-05', code: 'GITHUB ACTIONS · CHƯƠNG 5', title: 'Cache và artifact, đo thật', sub: 'GitHub Actions · Chương 5' };

const t = (lines, title, fs = 15) => gaTerm(lines, { title, dir: '~/ga-san-tap', fs });

/* ───────────── Slide 4 — dòng thời gian trượt / trúng của ba cách cài ───────────── */
const dongThoiGian = () => {
  let s = '';
  const X0 = 250, K = 36; // px mỗi giây
  const X = (sec) => X0 + sec * K;
  // trục
  for (let i = 0; i <= 24; i += 4) s += `<line x1="${X(i)}" y1="30" x2="${X(i)}" y2="420" stroke="#1d2a40" stroke-width="1"/>` + T(X(i), 22, `${i}s`, { fs: 14, a: 'middle', c: 'dim', mono: true });
  const rows = [
    ['không cache · lần nào cũng thế', [[0, 17.5, 'amb', 'npm ci 17,5 s (tải + dựng)']], ''],
    ['cache: npm · TRƯỢT (lần 1)', [[0, 19.5, 'amb', 'npm ci 19,5 s'], [19.5, 2.9, 'vio', 'lưu 2,9']], ''],
    ['cache: npm · TRÚNG', [[0, 2.1, 'tea', '2,1'], [2.1, 11.6, 'amb', 'npm ci 11,6 s — VẪN chạy']], ''],
    ['node_modules · TRƯỢT (lần 1)', [[0, 0.3, 'dim', ''], [0.3, 18.1, 'amb', 'npm ci 18,1 s'], [18.4, 4.9, 'vio', 'lưu 4,9']], ''],
    ['node_modules · TRÚNG', [[0, 3.6, 'grn', '3,6 s']], 'bỏ hẳn npm ci'],
  ];
  rows.forEach(([lb, segs, note], i) => {
    const y = 48 + i * 76;
    s += T(0, y + 32, lb, { fs: 15.5, b: true });
    segs.forEach(([a, w, c, txt]) => {
      s += R(X(a), y + 8, Math.max(4, w * K), 40, { c, fill: `color-mix(in srgb, ${D[c]} 28%, #0f182a)`, r: 7, sw: 2 });
      if (txt && w * K > 50) s += T(X(a) + 10, y + 34, txt, { fs: 14.5, c: '#fff' });
    });
    if (note) {
      const end = segs.reduce((m, [a, w]) => Math.max(m, a + w), 0);
      s += T(X(end) + 12, y + 34, note, { fs: 14, c: 'mu' });
    }
  });
  s += T(0, 440, 'Trung vị: 5 lần trúng, 1 lần trượt, 6 lần không cache, đơn vị giây — tính từ dấu thời gian trong log. Ô tím = bước Post: lưu ~/.npm 213 MB / node_modules 209 MB.', { fs: 14.5, c: 'mu' });
  return sv(1160, 450, s);
};

/* ───────────── Slide 8 — cây khoá: key → restore-keys theo tiền tố ───────────── */
const cayKhoa = () => {
  let s = '';
  // khoá chia đoạn
  const parts = [['ch05-nm', 'dim', 'tên nội dung'], ['Linux', 'blu', 'runner.os'], ['node22', 'tea', 'phiên bản công cụ'], ['74ddf72d…c1ec5f89', 'grn', 'hashFiles(lockfile)']];
  let x = 10;
  parts.forEach(([p, c, lb], i) => {
    const w = p.length * 12.6 + 30;
    s += R(x, 8, w, 50, { c, fill: '#0f182a', r: 9 }) + T(x + w / 2, 40, p, { fs: 19, a: 'middle', b: true, mono: true, c }) + T(x + w / 2, 80, lb, { fs: 14, a: 'middle', c: 'mu' });
    x += w + 24;
    if (i < parts.length - 1) s += T(x - 12, 40, '-', { fs: 22, a: 'middle', b: true, c: 'mu' });
  });
  s += T(x + 6, 40, '= key', { fs: 18, b: true, c: 'grn', mono: true });
  // ba tầng tra
  const L = [
    ['1', 'key (khớp CHÍNH XÁC trước)', 'ch05-nm-Linux-node22-74ddf72d…', 'grn', 'lockfile không đổi → trúng, cache-hit=true, KHÔNG lưu'],
    ['2', 'restore-keys dòng 1 (tiền tố)', 'ch05-nm-Linux-node22-', 'amb', 'lockfile đổi → mục MỚI NHẤT có tiền tố này; cache-hit=false → Post LƯU khoá mới'],
    ['3', 'restore-keys dòng 2 (tiền tố ngắn hơn)', 'ch05-nm-Linux-', 'ora', 'đổi cả Node → vẫn lấy được thứ gì đó (an toàn không? — xem bẫy của bài 5.2)'],
    ['✗', 'không dòng nào khớp', '', 'red', 'lạnh hoàn toàn: chạy đủ, Post lưu — tự chữa ở lần sau'],
  ];
  L.forEach(([n, a, k, c, d], i) => {
    const y = 110 + i * 88, ind = i < 3 ? i * 40 : 0;
    s += `<circle cx="${28 + ind}" cy="${y + 34}" r="17" fill="${D[c]}"/>` + T(28 + ind, y + 40, n, { fs: 16, a: 'middle', b: true, c: '#08101e' });
    s += R(58 + ind, y, 1100 - 58 - ind, 70, { c, fill: '#0f182a', r: 10, sw: 2 });
    s += T(74 + ind, y + 28, a, { fs: 16, b: true, c }) + T(600, y + 28, k, { fs: 16, mono: true }) + T(74 + ind, y + 55, d, { fs: 14.5, c: 'mu' });
    if (i < 2) s += A(28 + ind, y + 52, 28 + ind + 34, y + 88 + 18, { c: 'mu', sw: 2 });
  });
  return sv(1160, 460, s);
};

/* ───────────── Slide 13 — phạm vi nhánh: ai đọc được cache của ai ───────────── */
const phamVi = () => {
  let s = '';
  const box2 = (x, y, w, c, a, b) => R(x, y, w, 76, { c, fill: '#0f182a' }) + T(x + w / 2, y + 32, a, { fs: 17, a: 'middle', b: true, mono: true, c }) + T(x + w / 2, y + 58, b, { fs: 14, a: 'middle', c: 'mu' });
  s += box2(400, 0, 360, 'dim', 'main', 'nhánh MẶC ĐỊNH — ai cũng đọc được (docs)');
  s += box2(90, 170, 330, 'blu', 'ch05-cache', 'nhánh gốc của PR #4');
  s += box2(740, 170, 330, 'vio', 'ch05-cache-em', 'nhánh đầu của PR #4');
  s += box2(400, 350, 360, 'amb', 'refs/pull/4/merge', 'lần chạy pull_request');
  s += box2(0, 350, 280, 'dim', 'ch04-action', '✗ anh em: không ai đọc chéo');
  const ok = (x1, y1, x2, y2, lb) => A(x1, y1, x2, y2, { c: 'grn', sw: 3 }) + T((x1 + x2) / 2 + 8, (y1 + y2) / 2 - 8, lb, { fs: 15, b: true, c: 'grn' });
  const no = (x1, y1, x2, y2, lb, dx = 8, dy = -8) => A(x1, y1, x2, y2, { c: 'red', dash: true, sw: 2.5 }) + T((x1 + x2) / 2 + dx, (y1 + y2) / 2 + dy, lb, { fs: 15, b: true, c: 'red' });
  s += A(255, 170, 470, 78, { c: 'dim', dash: true, sw: 2 }) + A(905, 170, 690, 78, { c: 'dim', dash: true, sw: 2 });
  s += T(300, 120, 'đọc được (docs)', { fs: 14, c: 'mu' }) + T(812, 120, 'đọc được (docs)', { fs: 14, c: 'mu', a: 'end' });
  s += ok(520, 350, 330, 248, '✓ PR đọc gốc');
  s += no(640, 350, 800, 248, '✗ PR KHÔNG đọc nhánh đầu', 14, 20);
  s += no(420, 200, 738, 200, '✗ hai chiều', -60, -10);
  s += no(250, 248, 470, 350, '✗ gốc không đọc PR', -200, 34);
  s += R(790, 360, 370, 66, { c: 'dim', dash: true, fill: 'rgba(255,255,255,.03)', r: 10 }) + T(975, 388, 'cache của PR chỉ đọc lại được', { fs: 14.5, a: 'middle' }) + T(975, 412, 'bởi LẦN CHẠY LẠI của chính PR đó ✓', { fs: 14.5, a: 'middle', c: 'grn' });
  return sv(1160, 440, s);
};

/* ───────────── Slide 25 — điểm hoà vốn ───────────── */
const hoaVon = () => {
  let s = '';
  const X0 = 90, Y0 = 380, KX = 34, KY = 17; // KX px / giây tiết kiệm (trục x) · KY px / giây (trục y)
  s += `<line x1="${X0}" y1="${Y0}" x2="${X0 + 30 * KX}" y2="${Y0}" stroke="${D.mu}" stroke-width="2"/>` + `<line x1="${X0}" y1="${Y0}" x2="${X0}" y2="30" stroke="${D.mu}" stroke-width="2"/>`;
  for (let i = 0; i <= 30; i += 5) s += T(X0 + i * KX, Y0 + 24, `${i}`, { fs: 14, a: 'middle', c: 'dim', mono: true });
  for (let i = 0; i <= 20; i += 5) s += T(X0 - 10, Y0 - i * KY + 5, `${i}`, { fs: 14, a: 'end', c: 'dim', mono: true });
  s += T(X0 + 15 * KX, Y0 + 48, 'thời gian dựng lại mà cache THAY THẾ (giây)', { fs: 15, a: 'middle', c: 'mu' });
  s += `<text x="24" y="${Y0 - 170}" font-size="15" fill="${D.mu}" transform="rotate(-90 24 ${Y0 - 170})" text-anchor="middle">giây LÃI mỗi lần chạy</text>`;
  // đường lãi = dựng lại - (khôi phục)  với khôi phục ~ 0,4 s + size/150MB/s + giải nén
  const line = (c, off) => {
    const pts = [];
    for (let x = 0; x <= 30; x += 0.5) { const y = x - off; if (y >= -2 && y <= 20) pts.push(`${X0 + x * KX},${Y0 - y * KY}`); }
    return `<polyline points="${pts.join(' ')}" fill="none" stroke="${D[c]}" stroke-width="3"/>`;
  };
  s += R(X0, Y0 - 1, 3.6 * KX, 2 * KY, { c: 'red', fill: 'rgba(255,92,108,.14)', r: 2, sw: 0 });
  s += line('grn', 0.4) + line('amb', 3.6);
  // điểm đo thật
  const pt = (x, y, c) => `<circle cx="${X0 + x * KX}" cy="${Y0 - y * KY}" r="8" fill="${D[c]}"/>`;
  s += pt(2.2, 1.8, 'grn') + pt(17.5, 13.9, 'amb') + pt(5.9, 3.8, 'tea');
  s += A(425, Y0 - 34, X0 + 2.2 * KX + 12, Y0 - 1.8 * KY + 2, { c: 'grn', sw: 2 }) + T(432, Y0 - 28, 'tsc: dựng 3,4 → 1,2 s, lãi 1,8 s', { fs: 14.5, c: 'grn' });
  s += A(425, Y0 - 70, X0 + 5.9 * KX + 12, Y0 - 3.8 * KY + 2, { c: 'tea', sw: 2 }) + T(432, Y0 - 64, 'cache: npm: lãi 3,8 s', { fs: 14.5, c: 'tea' });
  s += T(X0 + 17.5 * KX + 16, Y0 - 13.9 * KY + 26, 'node_modules: lãi 13,9 s', { fs: 14.5, c: 'amb' });
  s += T(X0 + 6, Y0 - 12, 'LỖ', { fs: 13.5, b: true, c: 'red' });
  s += R(110, 20, 340, 176, { c: 'dim', dash: true, fill: 'rgba(8,16,30,.9)' }) +
    T(126, 50, 'lãi = dựng lại − khôi phục', { fs: 17, b: true, mono: true }) +
    T(126, 78, 'khôi phục ≈ 0,3 s', { fs: 14.5, c: 'mu', mono: true }) +
    T(126, 100, '  + cỡ ÷ (75–230 MB/s)', { fs: 14.5, c: 'mu', mono: true }) +
    T(126, 122, '  + giải nén (~2 s / 28k file)', { fs: 14.5, c: 'mu', mono: true }) +
    `<line x1="126" y1="152" x2="162" y2="152" stroke="${D.grn}" stroke-width="3"/>` + T(172, 157, 'cache nhỏ: phí ~0,4 s', { fs: 14.5 }) +
    `<line x1="126" y1="180" x2="162" y2="180" stroke="${D.amb}" stroke-width="3"/>` + T(172, 185, 'cache 209 MB: phí ~3,6 s', { fs: 14.5 });
  return sv(1160, 440, s);
};

export const slides = S([
  /* 1 */ cover({ t: 'Chương 5 — Cache và artifact, đo thật', sub: 'cache mua được gì · khoá và restore-keys · cache chết · artifact · điểm hoà vốn', chap: 'CHƯƠNG 5' }),

  /* 2 */ { t: 'Bản đồ chương: cache để NHANH, artifact để GIAO', body: mindmap('cache & artifact', 'hai cách mang file qua ranh giới giữa các job và các lần chạy', [
    { t: '5.1 Cache mua gì', d: 'đo trên runner: 17,5 s → 13,7 s → 3,6 s', c: 'dk' },
    { t: '5.2 Khoá', d: 'bất biến · tiền tố · version ẩn · phạm vi nhánh', c: 'amb' },
    { t: '5.3 Cache chết', d: 'path không tồn tại · cache rỗng · khoá luôn trượt', c: 'red' },
    { t: '5.4 Artifact', d: 'zip từng file · tên trùng 409 · v7 archive:false', c: 'tea' },
    { t: '5.5 Hoà vốn', d: 'lãi = dựng lại − khôi phục · 10 GB · 7 ngày', c: 'grn' },
  ]) },

  /* ───── 5.1 ───── */
  /* 3 */ { t: 'Trên runner: cache: npm cắt 22%, cache node_modules cắt 79%', body: two(
    bars([
      { l: 'không cache', sub: 'npm ci, ~/.npm rỗng', v: 17.5, txt: '17,5 s', c: 'amb' },
      { l: 'cache: npm (trúng)', sub: 'khôi phục 2,1 + npm ci 11,6', v: 13.7, txt: '13,7 s', c: 'blu' },
      { l: 'cache node_modules (trúng)', sub: 'khôi phục, bỏ npm ci', v: 3.6, txt: '3,6 s', c: 'grn' },
    ], { lw: 300, max: 18 }),
    `${kpis([{ v: '681', l: 'gói (743 mục lockfile)', c: 'blu' }, { v: '854 MB', l: 'node_modules · 28.446 file', c: 'amb' }, { v: '5', l: 'lần trúng đo được', c: 'grn' }])}
     ${box('info', 'Trung vị trên <code>ubuntu-24.04</code>, 24/09/2026. Không cache dao động <strong>14,1–22,3 s</strong>; <code>npm ci</code> ấm 10,9–15,9 s. Một lần đo không nói gì — nhìn cả dải.')}`) },

  /* 4 */ { t: 'Dòng thời gian: trượt thì trả thêm tiền lưu, trúng mới thu lãi', body: dongThoiGian() },

  /* 5 */ { t: 'Hai cái cache giữ hai thứ khác nhau: kho tải về và cây đã dựng', body: two(
    t(['# job khong-cache — run 36004518266', "~/.npm truoc:", 'added 681 packages in 14s', 'npm ci: 14.05 giay', '+ node_modules: 854M, 28446 file', '+ ~/.npm sau: 225M', '# cache: npm giữ ~/.npm (tarball các gói)', 'Cache Size: ~213 MB (223865560 B)'], 'cái gì nằm trên đĩa', 14.5),
    t(['# job cache-node-modules — run 36004724418', 'Cache hit for: ch05-nm-Linux-node22-74ddf72d…', 'Received 218882539 of 218882539 (100.0%),', '  181.8 MBs/sec', 'Cache Size: ~209 MB (218882539 B)', '[command]/usr/bin/tar -xf …cache.tzst … unzstd', 'Cache restored successfully', '+ cache-hit = true  → bước npm ci bị bỏ qua'], 'khôi phục 3,3 s', 14.5)) +
    box('warn', '<code>npm ci</code> luôn <strong>xoá</strong> <code>node_modules</code> trước khi cài. Cache <code>node_modules</code> chỉ có nghĩa khi bước cài được BỎ QUA bằng <code>if: steps.nm.outputs.cache-hit != \'true\'</code>.') },

  /* 6 */ { t: 'Máy cục bộ cắt 40%, runner chỉ 22% — runner tải gói rất nhanh', body: table(['Đo ở đâu', 'npm ci lạnh', 'npm ci ấm (cache: npm)', 'Cắt được', 'node_modules khôi phục'], [
    ['Máy cục bộ (bài 5.1 cũ, lockfile api-backend 898 gói)', '31,4 s', '18,8 s', '40%', '14,7 s (đĩa, chưa tính mạng)'],
    ['Runner <code>ubuntu-24.04</code> (sân tập, 681 gói)', '17,5 s', '13,7 s (2,1 khôi phục + 11,6)', '!22%', '+3,6 s (đã gồm mạng)'],
  ], { sm: true }) + two(
    box('info', 'Runner nằm trong Azure, sát registry npm: phần <strong>tải</strong> vốn rẻ ⇒ cache kho tải về lãi ít. Phần <strong>dựng</strong> 28 nghìn file mới đắt — và chỉ cache <code>node_modules</code> bỏ được nó.'),
    box('tip', 'Bài học: con số của máy bạn KHÔNG chuyển sang runner. Đo trên đúng nơi code chạy — cùng một câu hỏi, hai câu trả lời khác nhau.')) },

  /* 7 */ { t: 'Cache chỉ chạm tới bước cài — bản dựng 149 giây vẫn nguyên', body: two(
    bars([
      { l: 'Dựng', sub: 'cache phụ thuộc không chạm tới', v: 149, txt: '149 s', c: 'vio' },
      { l: 'npm ci (hai lần)', sub: 'cache ảnh hưởng tới', v: 35, txt: '35 s', c: 'amb' },
      { l: 'checkout + setup-node', v: 20, txt: '20 s', c: 'blu' },
      { l: 'tải artifact lên', v: 8, txt: '8 s', c: 'tea' },
    ], { lw: 280 }),
    `${box('warn', 'Job dựng Linux của api-backend, run 32662461744: <strong>241 s</strong>. Cache hoàn hảo nhất cũng chỉ lấy được ~35 s.')}
     ${box('good', 'Trước khi thêm cache: đọc thời gian từng bước (<code>gh run view --json jobs</code>) và hỏi bước nào đang ĐẮT nhất — bài học đường tới hạn của Chương 2.')}`) },

  /* ───── 5.2 ───── */
  /* 8 */ { t: 'Cây khoá: khớp chính xác trước, rồi lùi dần theo tiền tố', body: cayKhoa() },

  /* 9 */ { t: 'Ghi một lần: lưu lại cùng khoá bị từ chối, job vẫn xanh', body: two(
    yaml([['- run: echo "lan ghi 1" > bb/x.txt', ''], ['- uses: actions/cache/save@v5', 'lưu lần 1'], ["  with: { path: bb, key: 'ch05-bb-…' }", ''], ['- run: echo "lan ghi 2" > bb/x.txt', ''], ['- uses: actions/cache/save@v5', 'lưu LẠI, cùng khoá'], ["  with: { path: bb, key: 'ch05-bb-…' }", ''], ['- run: rm -rf bb', ''], ['- uses: actions/cache/restore@v5', 'đọc lại']], { fs: 14.5 }),
    t(['# job bat-bien — run 36004518205', 'Cache saved with key: ch05-bb-36004518205', '# bước "Luu LAI cung khoa":', '! Failed to save: Unable to reserve cache with', '!   key ch05-bb-36004518205, another job may be', '!   creating this cache.', '+ ✓ bước vẫn xanh — chỉ là một dòng chữ', '$ cat bb/x.txt', 'lan ghi 1'], 'bất biến', 14.5)) },

  /* 10 */ { t: 'Khoá hằng số đông cứng ở lần chạy đầu tiên', body: two(
    t(['# run 1 — 36004518205, job khoa-hang', 'Cache not found for input keys: ch05-khoa-hang', 'noi dung trong cache: (trong)', 'Cache saved with key: ch05-khoa-hang', '', '# run 2 — 36004824230 (sau đó 3 phút)', 'Cache hit for: ch05-khoa-hang', '+ noi dung trong cache: lan chay nay la', '+   run 36004518205 attempt 1', '= Cache hit occurred on the primary key', '=   ch05-khoa-hang, not saving cache.'], 'key: ch05-khoa-hang', 14.5),
    `${box('bad', 'Run 2 ghi nội dung MỚI vào <code>hs/</code> — và nó không bao giờ tới cache: trúng khoá chính thì Post <strong>không lưu</strong>. Từ nay mọi lần chạy nhận nội dung của run 1.')}
     ${box('tip', 'Khoá phải chứa thứ mà nội dung <strong>phụ thuộc</strong>: <code>hashFiles(lockfile)</code>, <code>runner.os</code>, phiên bản công cụ. Đổi nội dung ⇒ đổi khoá.')}`) },

  /* 11 */ { t: 'Tiền tố lấy mục mới nhất; nhiều dòng thì dòng trên thắng', body: two(
    t(['# luu-cu 13:19:11 → ch05-rk-<run>-a · luu-moi 13:19:19 → -b', '# 1) key …-c (không có), restore-keys: ch05-rk-<run>-', 'Cache hit for restore-key: ch05-rk-36004824230-b', 'ban MOI — job luu-moi, 13:19:19', 'cache-hit=false', '+ Post: Cache saved with key: ch05-rk-36004824230-c', '# 2) restore-keys: …-a  rồi  ch05-rk-<run>-', 'Cache hit for restore-key: ch05-rk-36004824230-a', 'cache-hit=false  matched=ch05-rk-36004824230-a'], 'run 36004824230 · job tien-to', 14),
    `${box('info', 'Mỗi dòng <code>restore-keys</code> là một <strong>tiền tố</strong>. Nhiều mục khớp một dòng ⇒ lấy mục <strong>tạo gần nhất</strong> (-b). Dòng trên khớp được ⇒ dòng dưới không được xét, dù có mục mới hơn.')}
     ${box('warn', 'Trúng restore-key vẫn là <code>cache-hit=false</code> ⇒ Post <strong>lưu</strong> khoá mới. Đó là cách cache "lăn" về phía trước khi lockfile đổi.')}`) },

  /* 12 */ { t: 'Hai bẫy: đổi path là mục khác, và khoá cũng khớp tiền tố', body: two(
    t(['# job phien-ban-an — run 36004518205', 'Cache saved with key: ch05-ver-36004518205', '# cùng khoá, path: thu-b', '! Cache not found for input keys: ch05-ver-36004518205', '# cùng khoá, path: thu-a (lookup-only)', 'Cache hit for: ch05-ver-36004518205', '# ⇒ khoá + path + cách nén = một mục'], 'đổi path = mục KHÁC', 14),
    t(['# nhánh ch05-cache-em — run 36005610825', '# tra key: ch05-pv-ch05-cache  (không có ở đây)', '! Cache hit for restore-key: ch05-pv-ch05-cache-em', 'Lookup only - skipping download', "# cache-hit = 'false' nhưng VẪN tìm thấy", '# vì "…-cache" là tiền tố của "…-cache-em"'], 'khoá chính cũng khớp tiền tố', 14)) +
    box('tip', 'Kết thúc khoá bằng một hash hoặc dấu phân cách cố định; và chỉ tin <code>cache-hit == \'true\'</code>, đừng tin "có cái gì đó được khôi phục".') },

  /* 13 */ { t: 'Đọc được: nhánh mình, nhánh mặc định, nhánh gốc của PR', body: phamVi() },

  /* 14 */ { t: 'Ma trận đo thật: 12 phép tra, chỉ 4 lần ✓', body: table(['Lần chạy trên ↓ · tra cache của →', 'ch05-cache', 'ch05-cache-em', 'PR #4 (refs/pull/4/merge)', 'ch04-action'], [
    ['<code>ch05-cache</code> (run 36005100779)', '+✓ của chính nó', '-✗ nhánh con', '-✗ PR vào chính nó', '-✗ anh em'],
    ['<code>ch05-cache-em</code> (run 36005610825)', '-✗ nhánh "cha"', '+✓ của chính nó', '-✗', '-✗'],
    ['PR #4, lần chạy lại (36004957041 · 2)', '+✓ nhánh GỐC', '!✗ nhánh ĐẦU của chính PR', '+✓ chỉ khi chạy lại', '-✗'],
  ], { sm: true, center: [1, 2, 3, 4] }) + two(
    box('info', '"Cha–con" giữa hai nhánh thường KHÔNG có nghĩa gì với cache: <code>ch05-cache-em</code> tách từ <code>ch05-cache</code> nhưng không đọc được. Chỉ nhánh <strong>mặc định</strong> và nhánh <strong>gốc của PR</strong> được đọc.'),
    box('good', 'Muốn mọi PR ấm: cho một workflow chạy trên <code>main</code> (push/lịch) để nạp cache. Cache do PR lưu KHÔNG làm ấm <code>main</code>.')) },

  /* ───── 5.3 ───── */
  /* 15 */ { t: 'Bốn câu trong log cho biết cache sống hay chết', body: t([
    '= ' + 'Cache hit for: <key>'.padEnd(58) + '→ ĐANG CHẠY',
    '=   … Cache hit occurred on the primary key …, not saving cache.',
    '+ ' + 'Cache hit for restore-key: <key cũ>'.padEnd(58) + '→ trúng một phần, Post sẽ lưu',
    'Cache not found for input keys: <key>, <restore-keys>'.padEnd(60) + '→ TRƯỢT (bình thường ở lần 1)',
    '! [warning]Path Validation Error: Path(s) specified in the action for caching',
    '!   ' + 'do(es) not exist, hence no cache is being saved.'.padEnd(56) + '→ CHẾT, không bao giờ lưu',
    '',
    '# tái lập trên sân tập — run 36005567469, job chet-that (path: build/.cache-tsc):',
    'Cache not found for input keys: ch05-chet-that-Linux',
    '! Post: [warning]Path Validation Error: … hence no cache is being saved.',
    '+ job: ✓ success — cảnh báo vàng nằm trong một job XANH',
  ], 'bốn tín hiệu', 15) },

  /* 16 */ { t: 'Còn tệ hơn cache chết: cache "sống" mà rỗng — 237 byte', body: two(
    t(['# chép y hệt bước cache backend của api-backend:', '#   path: node_modules/.cache', '# run 36005363653 (lần 1)', 'Cache not found for input keys: ch05-chet-Linux-lock-…', '$ ls node_modules/.cache', 'jiti            # thư mục RỖNG do một gói tạo', '+ Cache saved with key: ch05-chet-Linux-lock-…', '# run 36005567469 (lần 3)', 'Cache hit for: ch05-chet-Linux-lock-74ddf72d…', '! Cache Size: ~0 MB (237 B)'], 'không cảnh báo nào', 14),
    `${box('bad', 'Trên api-backend, thư mục ấy không tồn tại ⇒ cảnh báo vàng. Ở sân tập, một gói tạo thư mục rỗng <code>jiti/</code> ⇒ "saved", "hit" — trông khoẻ mạnh, chở 237 byte.')}
     ${box('tip', 'Phép kiểm thứ tư: dòng <code>Cache Size:</code>. Một cache đáng giá phải có kích thước khớp với thứ bạn nghĩ nó chứa.')}`) },

  /* 17 */ { t: 'Khoá chứa github.sha: trượt mọi lần, lưu mọi lần', body: two(
    t(['$ gh cache list --key ch05-luon', 'ch05-luon-truot-a2b82e3d…-36005567469   254 B', 'ch05-luon-truot-2ef08436…-36005477680   252 B', 'ch05-luon-truot-2ef08436…-36005391539   253 B', 'ch05-luon-truot-fc047c8e…-36005363653   270 B', '# mỗi run: "Cache not found" → "Cache saved"', '# 4 run → 4 mục, 0 lần trúng'], 'khoá: …-${{ github.sha }}-${{ github.run_id }}', 14),
    `${box('warn', 'Không có cảnh báo nào — mỗi log trông "bình thường". Dấu hiệu duy nhất: dòng <em>not found</em> không bao giờ biến thành <em>hit</em>, và danh sách cache cứ dài ra.')}
     ${box('info', 'Với cache 200 MB, đó là 200 MB tải lên mỗi lần chạy, đẩy mục khác ra khỏi hạn mức 10 GB, đổi lấy con số không.')}`) },

  /* 18 */ { t: 'Quy tắc ba lần chạy: trượt → trúng → trúng, trên cùng một nhánh', body: table(['Khuôn hình trong log', 'Lần 1', 'Lần 2', 'Lần 3', 'Chẩn đoán'], [
    ['Khoẻ', 'not found → saved', '+hit, not saving', '+hit, not saving', '+đúng'],
    ['Chết', '!Path Validation Error', '!Path Validation Error', '!Path Validation Error', '-path không tồn tại'],
    ['Rỗng', 'saved (237 B)', 'hit ~0 MB', 'hit ~0 MB', '-path có nhưng không chứa gì'],
    ['Luôn trượt', 'not found → saved', '-not found → saved', '-not found → saved', '-khoá đổi mỗi lần (sha, ngày, run_id)'],
    ['Đông cứng', 'not found → saved', 'hit', 'hit — nội dung cũ', '!khoá hằng, thiếu hash'],
  ], { sm: true }) + box('good', 'Soi nhanh: <code>gh run view &lt;id&gt; --log | grep -E "Cache (hit|not found|saved|Size)|Path Validation|Failed to save"</code>') },

  /* 19 */ { t: 'Cache .tsbuildinfo: tsc 3,4 s → 1,2 s, với 84 KB cache', body: two(
    t(['# job tsc-tang-dan · 600 tệp .ts · tsconfig incremental', '# run 36005363653 (trượt)', 'tsc lanh: 3.32 giay', 'Cache not found … → Sent 83806 B → saved', '# run 36005391539 (trúng)', 'tsc lanh: 3.41 giay', 'Cache hit for: ch05-tsb-Linux-cae157ed…', 'Cache Size: ~0 MB (83806 B)', '+ tsc am: 1.20 giay', '+ khôi phục 0,4 s ⇒ lãi ≈ 1,8 s mỗi lần'], 'đo cách vá thứ nhất của bài 5.3', 14),
    `${box('info', 'Cách vá bài 5.3 đề xuất (<code>incremental</code> + cache <code>.tsbuildinfo</code>) giờ đã có số: cache nhỏ ⇒ phí gần 0 ⇒ lãi <strong>dương</strong> dù nhỏ.')}
     ${box('bad', 'Chỉ cache <code>.tsbuildinfo</code> mà không có <code>dist/</code>: tsc 5.9 tin sổ ghi, <strong>không phát ra file nào</strong>, thoát mã 0 — <code>dist/</code> trống (thử trên Mac). Cache CẢ HAI.')}`) },

  /* ───── 5.4 ───── */
  /* 20 */ { t: 'Cache và artifact: hai dịch vụ, hai lời hứa khác nhau', body: table(['', 'Cache (<code>actions/cache</code>)', 'Artifact (<code>upload-artifact</code>)'], [
    ['Dùng để', 'tăng tốc — thiếu thì CHẬM hơn', 'bàn giao — thiếu thì HỎNG'],
    ['Định danh', 'khoá (+ path + cách nén)', 'tên, duy nhất trong một lần chạy · ID'],
    ['Sống bao lâu', '!bị xoá sau 7 ngày không dùng', '90 ngày mặc định (công khai 1–90, riêng tư 1–400)'],
    ['Ai đọc được', 'nhánh mình · nhánh mặc định · nhánh gốc PR', 'job sau cùng run · người trên giao diện · API/run khác'],
    ['Ghi đè', '-không bao giờ', '<code>overwrite: true</code> — xoá rồi tạo ID mới'],
    ['Giới hạn', '10 GB/kho mặc định (nâng được, tính tiền) · 200 lượt lưu/phút', '500 artifact/job · tính vào dung lượng lưu trữ'],
    ['Thấy trên trang run', '-không', '+có, tải về được'],
  ], { sm: true }) },

  /* 21 */ { t: 'Hình dạng quyết định giá: 28.484 file 37 giây, tarball 4 giây', body: two(
    bars([
      { l: 'node_modules nguyên cây', sub: '28.484 file → zip 255 MB', v: 37.2, txt: '37,2 s', c: 'red' },
      { l: 'tar + zstd rồi tải 1 file', sub: '2,3 s nén + 1,8 s tải · 217 MB', v: 4.1, txt: '4,1 s', c: 'grn' },
      { l: '5.000 file nhỏ (40 MB)', sub: 'zip 14,7 MB', v: 3.7, txt: '3,7 s', c: 'amb' },
      { l: '1 tarball cùng nội dung', sub: 'tar 0,85 + tải 2,0', v: 2.9, txt: '2,9 s', c: 'tea' },
    ], { lw: 320, max: 38 }),
    `${box('info', 'Run 36004824017 (job hinh-dang) và 36004518209 (job tao). <code>upload-artifact</code> nén <strong>từng file</strong> vào zip — mỗi file là một lượt đọc, nén, ghi riêng.')}
     ${box('good', 'Cần BÀN GIAO một cây lớn cho job sau? Đóng gói thành một file trước. Chỉ để nguyên cây khi một <em>người</em> cần duyệt từng file trên giao diện.')}`) },

  /* 22 */ { t: 'Tên trùng bị từ chối 409; overwrite: true xoá bản cũ và đổi ID', body: t([
    '# job tao — run 36004518209',
    'Artifact mot-tarball has been successfully uploaded! … Artifact ID is 10809103300',
    '# tải lên lần hai, cùng name: mot-tarball',
    '! ##[error]Failed to CreateArtifact: Received non-retryable error: Failed request:',
    '!   (409) Conflict: an artifact with this name already exists on the workflow run',
    '# lần ba, overwrite: true',
    "+ Artifact 'mot-tarball' (ID: 10809103300) deleted",
    '+ Artifact mot-tarball … successfully uploaded! … Artifact ID is 10809417256',
    '# job dung tải theo ID đã lưu TRƯỚC khi overwrite:',
    '! ##[error]Unable to download artifact(s): None of the provided artifact IDs were found',
  ], 'bất biến theo tên · ID sống theo bản', 14.5) + box('warn', 'Truyền <code>artifact-id</code> sang job sau? Lấy output của <strong>bước tải lên cuối cùng</strong>. Ma trận ghi cùng một tên ⇒ 409 — đặt tên theo <code>matrix</code>.') },

  /* 23 */ { t: 'Zip làm mất bit chạy và bỏ file ẩn — tar thì giữ', body: two(
    t(['# trước khi tải lên', '-rw-r--r--  27  .env-thu', '-rwxr-xr-x  25  chay.sh', '# upload-artifact path: goi/ → tải về', 'With the provided path, there will be 1 file uploaded', '! -rw-r--r--  25  chay.sh    # mất +x', '! (không có .env-thu)        # file ẩn bị bỏ'], 'qua zip · run 36004824017', 14.5),
    t(['# tar -cf goi.tar goi → tải lên → tải về', '$ tar -xf ve-tar/goi.tar -C ve-tar', '$ ls -la ve-tar/goi', '= -rw-r--r--  27  .env-thu', '= -rwxr-xr-x  25  chay.sh', '# giữ nguyên quyền, giữ cả file ẩn'], 'qua tar', 14.5)) +
    box('info', 'Bỏ file ẩn là <strong>cố ý</strong> (tránh lộ <code>.env</code>) — muốn gửi thì <code>include-hidden-files: true</code>. Bản cài hay script cần <code>+x</code>: tar trước, hoặc <code>chmod</code> lại sau khi tải về.') },

  /* 24 */ { t: 'Ma trận ghi nhiều tên, job gom tải về một chỗ', body: two(
    yaml([['ma-tran:', ''], ['  strategy: { matrix: { n: [linux, windows, macos] } }', ''], ['  steps:', ''], ['    - uses: actions/upload-artifact@v7', ''], ['      with:', ''], ["        name: 'ket-qua-${{ matrix.n }}'", 'MỖI nhánh một tên'], ['        path: kq/', ''], ['dung:', ''], ['  needs: [tao, ma-tran]', 'chờ đủ'], ['  steps:', ''], ['    - uses: actions/download-artifact@v8', ''], ['      with:', ''], ["        pattern: 'ket-qua-*'", 'lọc theo mẫu'], ['        merge-multiple: true', 'đổ chung 1 thư mục']], { fs: 14 }),
    t(['# job dung — run 36004824017', 'Found 8 artifact(s)', "Filtering artifacts by pattern 'ket-qua-*'", '- ket-qua-windows (ID: 10809736778, Size: 163 …)', '- ket-qua-macos   (ID: 10809377743, Size: 157 …)', '- ket-qua-linux   (ID: 10809343783, Size: 157 …)', 'SHA256 digest of downloaded artifact is e02df5d6…', 'Total of 3 artifact(s) downloaded', '$ cat ve/gom/*.txt', 'ket qua tu nhanh linux', 'ket qua tu nhanh macos', 'ket qua tu nhanh windows'], 'gom 3 → 1', 14)) },

  /* 25 */ { t: 'Phiên bản action artifact đã đi tới đâu (09/2026)', body: table(['Action', 'Bản mới', 'Đổi gì đáng biết'], [
    ['<code>actions/upload-artifact</code>', '<code>v7.0.1</code>', 'v4: bất biến theo tên, 409 · v4.x: <code>overwrite</code>, bỏ file ẩn · v6: Node 24 · <strong>v7: <code>archive: false</code></strong> tải thẳng một file'],
    ['<code>actions/download-artifact</code>', '<code>v8.0.1</code>', 'v5: đường dẫn tải theo ID thống nhất · v7: Node 24 · <strong>v8: sai digest là LỖI</strong>, không nén thì không giải nén'],
    ['<code>actions/cache</code>', '<code>v6.1.0</code>', 'v4.2+: dịch vụ cache v2 · v5: Node 24 (runner ≥ 2.327.1) · v6: ESM · v6.1: xử lý quyền cache chỉ-đọc'],
  ], { sm: true }) + two(
    t(['# upload-artifact@v7, archive: false', 'Uploading artifact: nm.tar.zst', 'Uploaded bytes 217038194', '+ Artifact nm.tar.zst successfully finalized.', '!   … Artifact artifact has been successfully uploaded!'], 'tên lấy theo file, name: bị bỏ qua', 14),
    box('warn', 'Bài cũ viết <code>@v4</code> — vẫn chạy, nhưng v4 còn chạy Node 20. Ghim SHA của bản mới + Dependabot (Chương 4). Kiểm: <code>gh api repos/actions/cache/releases --jq ".[0].tag_name"</code>.')) },

  /* ───── 5.5 ───── */
  /* 26 */ { t: 'Điểm hoà vốn: cache lãi khi dựng lại đắt hơn khôi phục', body: hoaVon() },

  /* 27 */ { t: 'Bảng quyết định, bằng số đo trên runner', body: table(['Việc', 'Không cache', 'Có cache (trúng)', 'Phí khi trượt', 'Lãi mỗi lần trúng', 'Kết luận'], [
    ['npm ci → <code>cache: npm</code>', '17,5 s', '13,7 s', '2,9 s lưu', '3,8 s', '+nên — một dòng'],
    ['npm ci → cache <code>node_modules</code>', '17,5 s', '3,6 s', '4,9 s lưu', '13,9 s', '!đáng, nếu khoá đủ chặt'],
    ['<code>tsc</code> 600 tệp → <code>.tsbuildinfo</code>', '3,4 s', '1,2 s + 0,4 khôi phục', '0,8 s lưu', '1,8 s', 'nhỏ nhưng dương'],
    ['<code>node_modules/.cache</code> (api-backend)', '—', '—', 'mỗi lần', '0', '-xoá bước'],
    ['khoá chứa <code>github.sha</code>', '—', 'không bao giờ trúng', 'mỗi lần', '-âm', '-sửa khoá'],
  ], { sm: true }) + box('warn', 'Bài 5.5 cũ dự đoán cache <code>node_modules</code> "không đoán được dấu" vì phần truyền chưa đo. Đo trên runner: tải xuống 75–232 MB/s ⇒ 209 MB mất ~1–3 s ⇒ lãi <strong>13,9 s</strong>. Dự đoán ấy đã được thay bằng số đo.') },

  /* 28 */ { t: 'Giới hạn theo tài liệu GitHub (đọc 24/09/2026)', body: two(
    table(['Cache', 'Giá trị'], [
      ['Dung lượng mỗi kho', '10 GB mặc định; kho cá nhân nâng tới 10 TB, phần vượt tính tiền'],
      ['Giá phần vượt', '$0,07 / GB / tháng (đỉnh theo giờ)'],
      ['Không dùng', '!quá 7 ngày ⇒ bị xoá'],
      ['Vượt hạn mức', 'xoá theo lần truy cập cũ nhất trước'],
      ['Tốc độ', '200 lượt lưu / 1.500 lượt tải mỗi phút, mỗi kho'],
    ], { sm: true }),
    table(['Artifact', 'Giá trị'], [
      ['Giữ mặc định', '90 ngày'],
      ['Đặt được', 'công khai 1–90 · riêng tư 1–400 ngày'],
      ['Mỗi job', 'tối đa 500 artifact'],
      ['Lưu trữ', 'kho công khai: miễn phí · Free cá nhân, kho riêng: 500 MB chung'],
      ['Tính dung lượng', '6–12 giờ cập nhật một lần'],
    ], { sm: true })) },

  /* 29 */ { t: 'Đo cả kho bằng gh cache — và dọn khi xong', body: two(
    t(['$ gh cache list --sort size_in_bytes --limit 3', 'node-cache-Linux-x64-npm-74ddf72d…   213.49 MiB', 'ch05-nm-Linux-node22-74ddf72d…       208.74 MiB', 'node-cache-Linux-x64-npm-d94a99a0…   353.96 KiB', '$ gh api repos/{owner}/{repo}/actions/cache/usage', '{"active_caches_size_in_bytes":443114305,', ' "active_caches_count":17}', '$ gh cache delete ch05-khoa-hang', '# (không in gì, mã thoát 0 — mục đã mất)', '# gh cache delete --all  ← xoá SẠCH cả kho, cẩn thận'], 'gh 2.93 · sân tập', 14),
    `${box('info', 'Câu hỏi thứ ba của bài 5.5 — "cache này có chèn ép cái khác không?" — trả lời bằng một lệnh: sắp theo kích thước, nhìn cột lần truy cập cuối.')}
     ${box('tip', 'Muốn làm mới một cache đông cứng mà không đổi YAML: <code>gh cache delete &lt;key&gt;</code> rồi chạy lại — lần sau trượt và lưu nội dung mới.')}`) },

  /* 30 */ { t: 'Sai lầm hay gặp ở Chương 5', body: cards([
    { ic: '🧊', t: 'Khoá hằng số', d: 'Đông cứng ở lần chạy đầu. Thêm <code>hashFiles(lockfile)</code>.', c: 'blu' },
    { ic: '🔁', t: 'Khoá chứa github.sha', d: 'Trượt mọi lần, lưu mọi lần, lãi âm.', c: 'red' },
    { ic: '👻', t: 'Không đọc log cache', d: 'Cảnh báo vàng / 237 B nằm trong job xanh. Quy tắc ba lần chạy.', c: 'amb' },
    { ic: '🧨', t: 'npm ci sau khi khôi phục node_modules', d: 'npm ci XOÁ node_modules. Bỏ bước cài khi <code>cache-hit == \'true\'</code>.', c: 'ora' },
    { ic: '📦', t: 'Tải lên cả cây 28k file', d: '37 s so với 4 s. Tar trước.', c: 'vio' },
    { ic: '🏷', t: 'Cache thay cho artifact', d: 'Cache bị xoá lúc nào cũng được. Thứ bắt buộc phải có ⇒ artifact.', c: 'pnk' },
  ], 3) },

  /* 31 */ { t: 'Bảng tra nhanh Chương 5', body: table(['Muốn', 'Viết / làm'], [
    ['Cache phụ thuộc, một dòng', '<code>setup-node</code> + <code>cache: npm</code> (+ <code>cache-dependency-path</code>)'],
    ['Khoá đúng', '<code>tên-${{ runner.os }}-&lt;phiên bản&gt;-${{ hashFiles(\'**/package-lock.json\') }}</code>'],
    ['Trúng một phần khi lockfile đổi', '<code>restore-keys:</code> tiền tố — chỉ khi bước đúng vẫn chạy sau đó'],
    ['Chỉ đọc / chỉ ghi', '<code>actions/cache/restore</code> · <code>actions/cache/save</code> (+ <code>if: always()</code>)'],
    ['Có cache không, khỏi tải', '<code>lookup-only: true</code> · bắt buộc có: <code>fail-on-cache-miss: true</code>'],
    ['Soát log', '<code>grep -E "Cache (hit|not found|saved|Size)|Path Validation|Failed to save"</code>'],
    ['Bàn giao file giữa job', '<code>upload-artifact@v7</code> → <code>download-artifact@v8</code>, tên theo <code>matrix</code>'],
    ['Gom ma trận', '<code>pattern: \'ket-qua-*\'</code> + <code>merge-multiple: true</code>'],
    ['Ít lưu trữ', '<code>retention-days: 5</code> cho PR · <code>gh cache delete</code>'],
  ], { sm: true }) },

  /* 32 */ { t: 'Thực hành Chương 5 (45 phút) trên kho của chính bạn', body: two(list([
    '<strong>1.</strong> Thêm <code>cache: npm</code>; chạy 3 lần; ghi thời gian <code>npm ci</code> và dòng <code>Cache Size</code>.',
    '<strong>2.</strong> Job thứ hai cache <code>node_modules</code> với khoá có <code>runner.os</code> + phiên bản Node + <code>hashFiles</code>; bỏ <code>npm ci</code> khi trúng.',
    '<strong>3.</strong> Cố ý viết một khoá hằng; chạy 2 lần; chứng minh nội dung đông cứng; xoá bằng <code>gh cache delete</code>.',
    '<strong>4.</strong> Tải lên thư mục dựng (<code>dist/</code>) nguyên cây và dạng tarball; so thời gian bước.',
    '<strong>5.</strong> Lập bảng: lãi mỗi lần trúng = không cache − có cache. Giữ lại dòng nào dương.',
  ]), box('good', '<strong>Đạt khi</strong> bạn có: 3 log khoẻ (trượt → trúng → trúng); một bảng ba cách cài có số của CHÍNH dự án bạn; một khoá hằng bị bắt quả tang rồi xoá; và hai con số tải lên (cây / tarball).<br><br>Soi: <code>gh run view &lt;id&gt; --json jobs --jq \'.jobs[].steps[] | [.name, .started_at, .completed_at]\'</code>.')) },
]);
