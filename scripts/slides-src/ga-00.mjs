/**
 * GitHub Actions · Deck ga-00 — Mục 0: CI thật ra giải quyết vấn đề gì (+ hai bài "Bắt đầu tại đây").
 *
 * Output terminal trên slide là output THẬT:
 *   • run trên sân tập công khai github.com/cuonghoang1103/ga-san-tap, nhánh ch00-mo-dau, 24/09/2026:
 *       35986054380 (đỏ: thiếu config.local.json) · 35986409808 (xanh sau khi sửa) · 35986054351 (ống nuốt mã thoát)
 *       35986054362 (hết giờ 1m0s) · 35986054356 (job không chia sẻ gì) · 35986054396 (ba hệ điều hành)
 *   • số của kho api-backend (run 32662461744, 32400097927, ci-lint.yml) lấy từ các bài cũ của Mục 0.
 * Mốc lịch sử (slide 6–7) đối chiếu 24/09/2026: martinfowler.com/articles/continuousIntegration.html (10/09/2000,
 * viết lại 01/05/2006, sửa lớn 18/01/2024; Booch 1991 / Kent Beck XP); Wikipedia "Continuous integration"
 * (CruiseControl 2001), "Hudson (software)" (07/02/2005), "Jenkins (software)" (bỏ phiếu 29/01/2011), "Travis CI" (2011),
 * "CircleCI" (09/2011); GitLab 8.0 22/09/2015 (CI gộp vào GitLab); GitHub blog 16/10/2018 (Universe), 08/08/2019
 * (CI/CD, GA 13/11/2019); changelog 17/09/2019 (HCL ngừng 30/09/2019).
 * Số liệu slide 9: Octoverse 2025 (11,5 tỷ phút Actions ở dự án công khai, +35%; 180 triệu+ dev);
 * JetBrains "The State of CI/CD in 2025" (805 người; GitHub Actions 62% dự án cá nhân, 41% tổ chức; 32% tổ chức dùng 2 công cụ).
 * Sự cố slide 13–15: SEC Release 2013-222 + lệnh 34-70694 (Knight Capital); GHSA-mrrh-fwg8-r2c3 / CVE-2025-30066
 * (tj-actions/changed-files); about.codecov.io/security-update (Codecov).
 * Cấu hình runner slide 24: docs.github.com/en/actions/reference/runners/github-hosted-runners (09/2026).
 */
import { S, cover, cards, box, steps, table, vs, kpis, flow, two, list, code, mindmap, term as gaTerm, diagram, yaml, pipe, sv, R, T, A, bars, esc, D } from './_ga-chung.mjs';

const term = (lines, { title, fs = 15 } = {}) => gaTerm(lines, { title, dir: '~/ga-san-tap', fs });

export const deck = { key: 'ga-00', code: 'GITHUB ACTIONS · MỤC 0', title: 'CI thật ra giải quyết gì', sub: 'GitHub Actions · Mục 0' };

/* ───────────── hình tự vẽ ───────────── */

/* Slide 3 — nhà bếp: nếm mọi món trước khi ra */
const kitchen = () => {
  let s = '';
  const st = [
    ['👩‍🍳', 'Đầu bếp nấu', 'bạn viết mã, commit, push', 'blu'],
    ['🥄', 'Bếp trưởng NẾM', 'CI: lấy mã sạch, cài, kiểm, test', 'ga'],
    ['🍽', 'Món ra bàn', 'CD: đưa bản đã qua kiểm tới người dùng', 'grn'],
  ];
  st.forEach(([e, t, d, c], i) => {
    const x = 20 + i * 390;
    s += R(x, 20, 330, 210, { c, fill: '#0f182a' });
    s += `<text x="${x + 165}" y="100" font-size="58" text-anchor="middle">${e}</text>`;
    s += T(x + 165, 150, t, { fs: 22, a: 'middle', b: true });
    s += T(x + 165, 185, d, { fs: 15.5, a: 'middle', c: 'mu' });
    if (i < 2) s += A(x + 334, 125, x + 386, 125, { c: 'dk' });
  });
  s += R(410, 250, 340, 64, { c: 'red', fill: 'rgba(255,92,108,.08)', dash: true });
  s += T(580, 278, 'Món hỏng? Trả về bếp NGAY', { fs: 17, a: 'middle', b: true, c: 'red' });
  s += T(580, 302, 'trước khi khách kịp ăn', { fs: 15, a: 'middle', c: 'mu' });
  s += `<path d="M580 250 C580 236 580 236 580 232" stroke="${D.red}" stroke-width="2.5" fill="none"/>`;
  s += `<path d="M410 282 C200 282 190 282 190 236" stroke="${D.red}" stroke-width="2.5" fill="none" stroke-dasharray="7 6" marker-end="url(#m-red)"/>`;
  return sv(1160, 320, s);
};

/* Slide 4 — CI · Continuous Delivery · Continuous Deployment */
const ciCd = () => {
  let s = '';
  const box1 = (x, w, t, c) => R(x, 0, w, 54, { c, fill: '#0f182a', r: 10 }) + T(x + w / 2, 34, t, { fs: 17, a: 'middle', b: true });
  const row = (y, label, sub, stopAt, human) => {
    let o = T(0, y + 22, label, { fs: 18, b: true, c: 'ga' }) + T(0, y + 46, sub, { fs: 14.5, c: 'mu' });
    const items = [['push', 'blu'], ['build', 'tea'], ['test', 'grn'], ['staging', 'vio'], ['production', 'amb']];
    items.forEach(([t, c], i) => {
      const x = 300 + i * 172, on = i <= stopAt;
      o += `<g transform="translate(0 ${y})" opacity="${on ? 1 : 0.28}">${box1(x, 140, t, c)}</g>`;
      if (i < 4) {
        const gate = human && i === 3;
        o += `<g opacity="${i < stopAt ? 1 : 0.28}">` + A(x + 142, y + 27, x + 168, y + 27, { c: gate ? 'amb' : 'dk', dash: gate }) + `</g>`;
        if (gate && i < stopAt + 1) o += T(x + 156, y - 8, '👤 bấm duyệt', { fs: 14.5, a: 'middle', c: 'amb', b: true });
      }
    });
    return o;
  };
  s += row(20, 'Continuous Integration', 'tích hợp liên tục', 2, false);
  s += row(150, 'Continuous Delivery', 'giao hàng liên tục', 4, true);
  s += row(280, 'Continuous Deployment', 'triển khai liên tục', 4, false);
  s += T(1160, 400, 'Delivery: LUÔN sẵn sàng phát hành, người bấm nút · Deployment: không ai bấm, xanh là lên', { fs: 15, a: 'end', c: 'mu' });
  return sv(1160, 410, s);
};

/* Slide 6–7 — dòng thời gian */
const timeline = (ev, { note } = {}) => {
  const W = 1160, H = 400, Y = 200, n = ev.length, x = (i) => 110 + i * ((W - 220) / (n - 1));
  let s = `<path d="M20 ${Y} H${W - 20}" stroke="#2a3a55" stroke-width="6" stroke-linecap="round"/>`;
  ev.forEach(([d, a, b, c], i) => {
    const X = x(i), up = i % 2 === 0;
    s += `<line x1="${X}" y1="${Y}" x2="${X}" y2="${up ? Y - 28 : Y + 28}" stroke="${D[c]}" stroke-width="2"/>`;
    s += `<circle cx="${X}" cy="${Y}" r="11" fill="#0b1220" stroke="${D[c]}" stroke-width="4"/>`;
    const t0 = up ? Y - 104 : Y + 56;
    s += T(X, t0, d, { fs: 16, a: 'middle', b: true, mono: true, c });
    s += T(X, t0 + 24, a, { fs: 16, a: 'middle', b: true });
    if (b) s += T(X, t0 + 45, b, { fs: 14.5, a: 'middle', c: 'mu' });
  });
  if (note) s += T(W / 2, H - 6, note, { fs: 14.5, a: 'middle', c: 'dim' });
  return sv(W, H, s);
};

/* Slide 12 / 35 — lộ trình 16 chặng */
const STAGES = [
  { n: 'Nhập môn', c: D.mu }, { n: 'Viết workflow', c: D.ga }, { n: 'Nhanh · an toàn', c: D.tea },
  { n: 'Đỏ · deploy · chẩn đoán', c: D.red }, { n: 'Mức chuyên gia', c: D.vio },
];
const STOPS = [
  ['0', 'CI giải', 'quyết gì', 0], ['1', 'Tệp', 'workflow', 1], ['2', 'Job &', 'runner', 1],
  ['3', 'Biểu thức', 'context', 1], ['4', 'Action', '', 1], ['5', 'Cache &', 'artifact', 2],
  ['6', 'Bí mật', '& quyền', 2], ['7', 'Tốc độ', '& chi phí', 2], ['8', 'Khi CI', 'đỏ', 3],
  ['9', 'Deploy', 'từ CI', 3], ['10', 'Chẩn đoán', 'ca thật', 3], ['11', 'Ôn giữa', 'khoá', 3],
  ['12', 'Tái sử', 'dụng', 4], ['13', 'Runner', 'riêng', 4], ['14', 'Chất lượng', 'phát hành', 4],
  ['15', 'Dự án', 'cuối khoá', 4], ['🏁', 'Thi cuối', '20 câu', 4],
];
const roadmap = () => {
  const W = 1160, H = 440, X = (i) => 92 + i * 195, Y = [40, 200, 360], RR = 25;
  const pos = STOPS.map((_, k) => { const row = Math.floor(k / 6), i = k % 6; return [row % 2 ? X(5 - i) : X(i), Y[row]]; });
  let s = '';
  for (let k = 1; k < STOPS.length; k++) {
    const [x1, y1] = pos[k - 1], [x2, y2] = pos[k], c = STAGES[STOPS[k][3]].c;
    if (y1 === y2) s += `<path d="M${x1} ${y1} H${x2}" stroke="${c}" stroke-width="8" stroke-linecap="round" fill="none"/>`;
    else { const ex = x1 > W / 2 ? x1 + 72 : x1 - 72; s += `<path d="M${x1} ${y1} C${ex} ${y1} ${ex} ${y2} ${x2} ${y2}" stroke="${c}" stroke-width="8" stroke-linecap="round" fill="none"/>`; }
  }
  STOPS.forEach(([num, a, b, st], k) => {
    const [x, y] = pos[k], c = STAGES[st].c;
    s += `<circle cx="${x}" cy="${y}" r="${RR}" fill="#0b1220" stroke="${c}" stroke-width="5"/>`;
    s += `<text x="${x}" y="${y + 7}" text-anchor="middle" font-size="${num === '🏁' ? 22 : 19}" font-weight="800" fill="#fff">${esc(num)}</text>`;
    s += T(x, y + 50, a, { fs: 16, a: 'middle', b: true });
    if (b) s += T(x, y + 69, b, { fs: 14.5, a: 'middle', c: 'mu' });
  });
  return sv(W, H, s);
};
const legend = () => `<div style="display:flex;flex-wrap:wrap;gap:8px 18px;justify-content:center;font-size:15px;color:${D.mu};margin-top:2px">` +
  STAGES.map((x) => `<span><i style="display:inline-block;width:22px;height:8px;border-radius:4px;background:${x.c};margin-right:6px;vertical-align:middle"></i>${esc(x.n)}</span>`).join('') + `</div>`;

/* Slide 13 — Knight Capital: 8 máy, 1 máy sót */
const knight = () => {
  let s = '';
  for (let i = 0; i < 8; i++) {
    const x = 20 + i * 142, bad = i === 7, c = bad ? 'red' : 'grn';
    s += R(x, 20, 124, 150, { c, fill: bad ? 'rgba(255,92,108,.10)' : '#0f182a' });
    s += `<text x="${x + 62}" y="80" font-size="40" text-anchor="middle">🖥</text>`;
    s += T(x + 62, 112, `máy ${i + 1}`, { fs: 16, a: 'middle', b: true, mono: true });
    s += T(x + 62, 140, bad ? 'mã CŨ còn đó' : 'mã mới ✓', { fs: 15, a: 'middle', c, b: bad });
  }
  s += T(20, 212, '27/07/2012: kỹ thuật viên chép mã mới lên từng máy — BẰNG TAY — và sót máy thứ 8.', { fs: 17 });
  s += T(20, 240, 'Không người thứ hai kiểm, không quy trình viết ra (lệnh SEC 34-70694, đoạn 15).', { fs: 17, c: 'mu' });
  return sv(1160, 250, s);
};

/* Slide 14 — tj-actions: thẻ bị dời */
const tagMove = () => {
  let s = '';
  s += T(0, 26, 'workflow của 23.000+ kho viết:', { fs: 16, c: 'mu' });
  s += R(0, 40, 380, 56, { c: 'blu', fill: '#0f182a', r: 10 }) + T(16, 76, 'uses: tj-actions/changed-files@v44.5.1', { fs: 15, mono: true, b: true });
  s += R(520, 0, 300, 60, { c: 'grn', fill: '#0f182a', r: 10 }) + T(540, 36, 'commit tốt (trước 14/03)', { fs: 16, b: true, c: 'grn' });
  s += R(520, 90, 300, 60, { c: 'red', fill: 'rgba(255,92,108,.1)', r: 10 }) + T(540, 126, 'commit độc 0e58ed8…', { fs: 16, b: true, c: 'red', mono: true });
  s += `<path d="M382 60 C450 60 450 30 516 30" stroke="${D.dim}" stroke-width="2.5" fill="none" stroke-dasharray="6 6"/>`;
  s += `<path d="M382 76 C450 76 450 120 516 120" stroke="${D.red}" stroke-width="3" fill="none" marker-end="url(#m-red)"/>`;
  s += T(450, 170, 'kẻ tấn công DỜI thẻ v44.5.1 (và nhiều thẻ khác)', { fs: 15, a: 'middle', c: 'amb' });
  s += A(820, 120, 900, 120, { c: 'red' });
  s += R(904, 70, 256, 110, { c: 'red', fill: '#0f182a' });
  s += T(1032, 104, 'đọc bộ nhớ runner', { fs: 16, a: 'middle', b: true });
  s += T(1032, 130, 'in BÍ MẬT ra log', { fs: 16, a: 'middle', b: true, c: 'red' });
  s += T(1032, 156, 'log kho công khai: ai cũng đọc', { fs: 13.5, a: 'middle', c: 'mu' });
  return sv(1160, 190, s);
};

/* Slide 16 — hai workflow deploy đua nhau */
const race = () => {
  let s = '';
  s += R(0, 70, 170, 70, { c: 'blu', fill: '#0f182a' }) + T(85, 100, 'git push main', { fs: 16, a: 'middle', b: true, mono: true }) + T(85, 124, '1 cú push', { fs: 14, a: 'middle', c: 'mu' });
  s += A(172, 92, 290, 40, { c: 'dk' }) + A(172, 118, 290, 170, { c: 'dk' });
  s += R(294, 10, 300, 64, { c: 'ga', fill: '#0f182a' }) + T(444, 40, 'deploy-ghcr.yml', { fs: 16, a: 'middle', b: true, mono: true }) + T(444, 62, 'dựng ảnh → tráo → migrate', { fs: 14, a: 'middle', c: 'mu' });
  s += R(294, 140, 300, 64, { c: 'ga', fill: '#0f182a' }) + T(444, 170, 'backend-vps.yml', { fs: 16, a: 'middle', b: true, mono: true }) + T(444, 192, 'tạo lại container backend', { fs: 14, a: 'middle', c: 'mu' });
  s += A(596, 42, 700, 96, { c: 'red' }) + A(596, 172, 700, 116, { c: 'red' });
  s += R(704, 60, 456, 100, { c: 'red', fill: 'rgba(255,92,108,.08)' });
  s += T(724, 92, '03/07/2026 · feed 500: ảnh mới, schema cũ', { fs: 16, b: true });
  s += T(724, 120, '06/07/2026 · backend Exited(137) + container mồ côi', { fs: 16, b: true });
  s += T(724, 146, 'cả hai cùng CHẠY, không ai xếp hàng', { fs: 14.5, c: 'mu' });
  s += T(0, 250, 'Sửa: cả hai chỉ còn workflow_dispatch (bấm tay) — deploy là một SCRIPT bạn chạy, không phải tác dụng phụ của push.', { fs: 16, c: 'grn' });
  return sv(1160, 262, s);
};

/* Slide 21 — hệ thống tầng: sự kiện → workflow → job → bước */
const hier = () => diagram({
  w: 1160, h: 400,
  nodes: [
    { id: 'ev', x: 0, y: 150, w: 190, h: 90, t: 'Sự kiện', d: 'push · pull_request\nschedule · dispatch', c: 'amb', ic: '⚡' },
    { id: 'wf', x: 300, y: 150, w: 200, h: 90, t: 'Workflow', d: '1 tệp .yml\n= 1 lần chạy (run)', c: 'dk', ic: '📄' },
    { id: 'j1', x: 590, y: 20, w: 230, h: 90, t: 'Job lint', d: 'MÁY 1 · ubuntu-24.04', c: 'tea', ic: '🖥' },
    { id: 'j2', x: 590, y: 150, w: 230, h: 90, t: 'Job test', d: 'MÁY 2 · ubuntu-24.04', c: 'tea', ic: '🖥' },
    { id: 'j3', x: 590, y: 280, w: 230, h: 90, t: 'Job build', d: 'MÁY 3 · macos-15', c: 'tea', ic: '🖥' },
    { id: 'st', x: 900, y: 150, w: 260, h: 90, t: 'Bước (step)', d: 'checkout → cài → kiểm\ntuần tự · cùng đĩa · dừng ở lỗi đầu', c: 'grn', ic: '🪜' },
  ],
  edges: [
    { from: 'ev', to: 'wf', t: 'khớp on:' },
    { from: 'wf', to: 'j1' }, { from: 'wf', to: 'j2' }, { from: 'wf', to: 'j3' },
    { from: 'j2', to: 'st', t: 'mỗi job' },
  ],
});

/* Slide 28 — bất đối xứng push / pull_request */
const asym = () => table(['Cùng MỘT thay đổi: chỉ sửa README.md', 'push thẳng vào main', 'mở pull request vào main'], [
  ['Bộ lọc áp dụng', 'branches + <code>paths</code> (11 mẫu)', 'chỉ <code>branches</code> — KHÔNG có paths'],
  ['README.md khớp một mẫu paths?', '-Không', '(không xét)'],
  ['ci-lint.yml có chạy?', '-KHÔNG chạy', '+CÓ chạy (~2 phút 20)'],
  ['Có phải lỗi?', '!Chưa chắc — nhưng gần như chắc không phải CỐ Ý', '!Đọc khối on: mới biết'],
], { sm: true });

/* ─────────────────────────── SLIDES ─────────────────────────── */
export const slides = S([
  /* 1 */ cover({ t: 'CI thật ra giải quyết vấn đề gì', sub: 'CI/CD là gì · ra đời thế nào · vì sao công ty cần · đọc một workflow thật', chap: 'MỤC 0' }),

  /* 2 */ { t: 'Mục 0 có sáu bài, đi từ “vì sao” tới “đọc được”', body: mindmap('Mục 0', 'CI giải quyết gì', [
    { t: 'Bắt đầu 1/2', d: 'CI/CD là gì, lịch sử, vì sao công ty cần', c: 'ga' },
    { t: 'Bắt đầu 2/2', d: 'Sự cố thật khi không có CI · cách học', c: 'red' },
    { t: '0.1 Máy tôi chạy được', d: 'một run đỏ thật, và lời khẳng định CI đưa ra', c: 'amb' },
    { t: '0.2 Bốn tầng', d: 'workflow · job · bước · runner', c: 'tea' },
    { t: '0.3 Đọc workflow thật', d: 'ci-lint.yml từng dòng', c: 'vio' },
    { t: '0.4 Bản đồ khoá', d: '15 chương, cách đo', c: 'grn' },
  ]) },

  /* ── Bắt đầu 1/2 ── */
  /* 3 */ { t: 'CI giống bếp trưởng nếm MỌI món trước khi ra bàn', body: kitchen() + `<p class="c-note" style="text-align:center">Không phải vì đầu bếp dở — mà vì nếm ở bếp rẻ hơn nghe khách phàn nàn ở bàn.</p>` },

  /* 4 */ { t: 'CI, Delivery, Deployment: ba điểm dừng khác nhau', body: ciCd() },

  /* 5 */ { t: 'Một commit đi qua pipeline trong vài phút, và có đồ thị để nhìn', body: pipe({
    w: 1160, h: 250,
    cols: [[{ n: 'push', s: 'ok', d: '0s' }], [{ n: 'lint', s: 'ok', d: '41s' }, { n: 'test', s: 'ok', d: '1m32' }], [{ n: 'build', s: 'ok', d: '2m05' }], [{ n: 'deploy', s: 'wait', d: 'chờ' }]],
    needs: [['push', 'lint'], ['push', 'test'], ['lint', 'build'], ['test', 'build'], ['build', 'deploy']],
  }) + box('info', 'Hình minh hoạ theo giao diện đồ thị job của GitHub. <strong>lint</strong> và <strong>test</strong> chạy SONG SONG trên hai máy; <strong>build</strong> chờ cả hai; <strong>deploy</strong> chờ người duyệt (Chương 9).') },

  /* 6 */ { t: 'CI ra đời trước GitHub Actions gần 30 năm', body: timeline([
    ['1991', 'Grady Booch', 'dùng cụm từ trong sách OOD', 'mu'],
    ['1997', 'Extreme Programming', 'Kent Beck biến nó thành thực hành', 'blu'],
    ['2000', 'Martin Fowler', 'bài “Continuous Integration”', 'tea'],
    ['2001', 'CruiseControl', 'một trong các CI mở đầu tiên', 'grn'],
    ['2005', 'Hudson', 'Kohsuke Kawaguchi, Sun', 'amb'],
    ['2011', 'Jenkins', 'tách khỏi Hudson (Oracle)', 'red'],
  ], { note: 'Nguồn: martinfowler.com (10/09/2000, viết lại 2006 và 2024) · Wikipedia: Continuous integration, Hudson, Jenkins' }) },

  /* 7 */ { t: 'Rồi CI chuyển về nằm ngay cạnh mã: 2011 → 2019', body: timeline([
    ['2011', 'Travis CI · CircleCI', 'CI trên mây, cấu hình trong kho', 'amb'],
    ['09/2015', 'GitLab 8.0', 'CI gộp vào nền tảng Git', 'ora'],
    ['16/10/2018', 'GitHub Actions', 'công bố ở Universe (cú pháp HCL)', 'ga'],
    ['08/08/2019', 'Actions có CI/CD', 'YAML · Linux/macOS/Windows · matrix', 'tea'],
    ['30/09/2019', 'HCL ngừng chạy', 'mọi workflow chuyển sang YAML', 'red'],
    ['13/11/2019', 'GA', 'miễn phí cho kho công khai', 'grn'],
  ], { note: 'Nguồn: github.blog 16/10/2018 và 08/08/2019 · GitHub changelog 17/09/2019 · Wikipedia: Travis CI, CircleCI · GitLab 8.0 release' }) },

  /* 8 */ { t: 'Bốn công cụ CI: khác ở chỗ chạy và chỗ đặt cấu hình', body: table(['', 'GitHub Actions', 'GitLab CI/CD', 'Jenkins', 'CircleCI'], [
    ['Cấu hình', '<code>.github/workflows/*.yml</code>', '<code>.gitlab-ci.yml</code>', 'Jenkinsfile (Groovy) hoặc giao diện', '<code>.circleci/config.yml</code>'],
    ['Máy chạy', 'GitHub cấp sẵn hoặc tự dựng', 'GitLab cấp hoặc tự dựng', 'Tự dựng, tự vận hành', 'CircleCI cấp hoặc tự dựng'],
    ['Mạnh nhất khi', 'mã đã ở GitHub', 'mã ở GitLab, cần tự host cả bộ', 'hệ thống cũ, cần tuỳ biến sâu', 'cần tối ưu tốc độ build'],
    ['Đơn vị tái dùng', 'action · reusable workflow', 'include · component', 'plugin · shared library', 'orb'],
    ['Chi phí khởi đầu', '+Kho công khai: miễn phí', 'có gói miễn phí', '!Miễn phí phần mềm, tốn công vận hành', 'có gói miễn phí'],
  ], { sm: true }) + `<p class="c-note">Ý tưởng chuyển được gần nguyên vẹn: sự kiện → pipeline → job → bước → máy chạy. Học kỹ một cái, cái kia chỉ là cú pháp khác.</p>` },

  /* 9 */ { t: 'Con số hiện nay: CI là việc hằng ngày, không phải tuỳ chọn', body: kpis([
    { v: '11,5 tỷ', l: 'phút GitHub Actions ở dự án công khai (Octoverse 2025, +35%)', c: 'blu' },
    { v: '62%', l: 'người được hỏi dùng Actions cho dự án cá nhân (JetBrains 2025)', c: 'tea' },
    { v: '41%', l: 'dùng Actions trong công việc ở tổ chức (JetBrains 2025)', c: 'grn' },
    { v: '32%', l: 'tổ chức chạy HAI công cụ CI cùng lúc', c: 'amb' },
  ]) + `<p class="c-note">Nguồn: github.blog — Octoverse 2025 (dữ liệu 09/2024–08/2025) · JetBrains “The State of CI/CD in 2025”, 805 người trả lời.</p>` },

  /* 10 */ { t: 'Công ty cần CI vì lỗi rẻ nhất lúc nó vừa sinh ra', body: cards([
    { ic: '⏱', t: 'Phát hiện sớm', d: 'Lỗi thấy sau 2 phút thì người viết còn nhớ mình vừa sửa gì. Sau 2 tuần thì không.', c: 'blu' },
    { ic: '🤝', t: 'Gộp mã không sợ', d: 'Mười người cùng sửa một kho: mỗi PR được kiểm trên máy sạch trước khi vào main.', c: 'tea' },
    { ic: '🚀', t: 'Phát hành thường xuyên', d: 'Việc lặp lại được giao cho máy ⇒ phát hành thành chuyện bình thường, không phải sự kiện.', c: 'grn' },
    { ic: '🧾', t: 'Có dấu vết', d: 'Ai đẩy gì, lúc nào, kiểm gì, log ra sao — kiểm toán và điều tra sự cố đọc lại được.', c: 'amb' },
    { ic: '🧑‍💻', t: 'Người mới vào nhanh', d: 'Workflow là tài liệu CHẠY ĐƯỢC về cách dựng dự án.', c: 'vio' },
    { ic: '🛡', t: 'Bảo mật chuỗi cung ứng', d: 'Quét phụ thuộc, bí mật, ghim phiên bản — nhưng CI cũng là một bề mặt tấn công.', c: 'red' },
  ]) },

  /* 11 */ { t: 'Câu phỏng vấn hay gặp về CI/CD — và ý trả lời gọn', body: table(['Câu hỏi', 'Ý chính khi trả lời'], [
    ['CI khác CD thế nào?', 'CI: mỗi commit được dựng + kiểm tự động. CD: bản qua kiểm luôn sẵn sàng / tự động lên môi trường'],
    ['Delivery khác Deployment?', 'Delivery có người bấm phát hành; Deployment tự lên production khi xanh'],
    ['Pipeline của bạn có những bước gì?', 'checkout → cài (có cache) → lint/type → test → build → artifact → deploy có duyệt'],
    ['CI đỏ thì làm gì?', 'Đọc job đỏ → bước đỏ → dòng lỗi ĐẦU TIÊN; tái lập cục bộ; phân biệt flaky với hỏng thật'],
    ['Giữ bí mật trong CI ra sao?', 'secrets + quyền token tối thiểu; OIDC thay khoá dài hạn; ghim action theo SHA'],
    ['Làm CI nhanh hơn?', 'cache, chạy song song, đường tới hạn, huỷ run lỗi thời (concurrency)'],
  ], { sm: true }) },

  /* 12 */ { t: 'Khoá này đưa bạn qua 16 chặng, từ nhập môn tới dự án thật', body: roadmap() + legend() },

  /* ── Bắt đầu 2/2 ── */
  /* 13 */ { t: 'Knight Capital 2012: deploy tay sót 1 máy, lỗ 460 triệu USD', body: knight() + kpis([
    { v: '45 phút', l: 'sau giờ mở cửa 01/08/2012', c: 'amb' },
    { v: '> 4 triệu', l: 'lệnh gửi đi để khớp 212 lệnh khách', c: 'ora' },
    { v: '> 460 tr USD', l: 'lỗ', c: 'red' },
    { v: '12 tr USD', l: 'tiền phạt SEC (16/10/2013)', c: 'vio' },
  ]) },

  /* 14 */ { t: 'tj-actions 03/2025: một thẻ bị dời, bí mật lộ ra log', body: tagMove() + two(
    list(['CVE-2025-30066 · 14–15/03/2025', 'Bản vá: 46.0.1 · CISA cảnh báo 18/03/2025', 'Kho công khai: log ai cũng đọc được']),
    box('tip', 'Ghim action theo <strong>SHA đầy đủ</strong> thay vì thẻ — thẻ dời được, SHA thì không. Chương 4 và 14 đào sâu.'),
  ) },

  /* 15 */ { t: 'Codecov 2021: script trong CI gửi bí mật ra ngoài hai tháng', body: steps([
    ['31/01/2021 — kẻ tấn công sửa Bash Uploader', 'nhờ một khoá Google Cloud lộ ra từ quy trình dựng ảnh Docker của Codecov'],
    ['Mọi CI chạy <code>curl … | bash</code> đều gửi <code>$(env)</code> đi', 'biến môi trường = token, khoá API, mật khẩu mà job đang cầm'],
    ['01/04/2021 — Codecov phát hiện, vá cùng ngày', 'hơn hai tháng, không ai thấy gì bất thường trong log'],
  ]) + box('warn', 'Bài học cho bạn: CI là nơi <strong>tập trung bí mật nhiều nhất</strong> của dự án. Thứ gì chạy trong đó đều cầm được chúng.') },

  /* 16 */ { t: 'Chính kho này: một cú push, hai workflow deploy đua nhau', body: race() },

  /* 17 */ { t: 'Tình huống minh hoạ: đêm trước buổi demo đồ án', body: steps([
    ['22:40 — Bạn A push “sửa nhỏ giao diện”', 'không chạy lại gì, vì “chỉ sửa CSS”'],
    ['22:55 — Bạn B kéo về, trang trắng', 'A lỡ xoá một import khi sửa; máy A còn bản build cũ nên vẫn chạy'],
    ['01:30 — cả nhóm dò từng commit', 'không ai biết commit nào làm hỏng, vì chẳng có gì được kiểm lúc push'],
    ['Có CI: 22:42 PR của A hiện ✗ đỏ', '“Module not found” — sửa trong 3 phút, B không bao giờ thấy trang trắng'],
  ]) + `<p class="c-note">Minh hoạ, ghép từ những lỗi hay gặp — không phải một sự cố có thật.</p>` },

  /* 18 */ { t: 'Ba nỗi sợ khi mới học CI, và cách vượt qua từng cái', body: table(['Nỗi sợ', 'Vì sao nó xảy ra', 'Làm gì'], [
    ['YAML khó, thụt lề sai là hỏng', 'YAML nhạy dấu cách; lỗi báo mơ hồ', 'Dùng VS Code + tiện ích GitHub Actions; chạy <code>actionlint</code>; chép mẫu nhỏ rồi sửa dần'],
    ['CI đỏ là mình dở', 'đỏ bị hiểu như điểm kém', '!Đỏ là CI đang LÀM VIỆC — nó bắt lỗi trước người dùng'],
    ['Log dài hàng nghìn dòng', 'mở từ trên xuống, lạc giữa chừng', 'Nhảy tới bước ✗, đọc dòng <code>##[error]</code>, rồi đọc NGƯỢC lên vài dòng'],
  ], { sm: true }) },

  /* 19 */ { t: 'Đọc một run đỏ: job ✗ → bước ✗ → dòng lỗi đầu tiên', body: term([
    '$ gh run list -b ch00-mo-dau -w ch00-may-khac.yml -L 2',
    '= completed  success  …  push  35986409808   9s',
    '! completed  failure  …  push  35986054380  12s',
    '$ gh run view 35986054380',
    '! X kiem in 7s',
    '  ✓ Run actions/checkout@v4',
    '  ✓ Cai may nay la cai gi',
    '!   X Chay app giong het tren may nha',
    '$ gh run view 35986054380 --log-failed | grep -m1 Error',
    '! Error: ENOENT: no such file or directory, open \'…/ch00/config.local.json\'',
  ], { title: 'output thật — sân tập ga-san-tap, 24/09/2026' }) },

  /* 20 */ { t: 'Hai lộ trình: tối thiểu để đi làm, đầy đủ để lên chuyên gia', body: two(
    `<div class="nh">Tối thiểu · ~2 tuần</div>` + list(['Mục 0 → Chương 1, 2, 3', 'Chương 5 (cache) · Chương 6 (bí mật)', 'Chương 8 (khi CI đỏ)', 'Đủ viết, đọc, sửa CI cho đồ án']),
    `<div class="nh">Đầy đủ · 6–8 tuần</div>` + list(['Thêm Chương 4, 7, 9, 10 · ôn ở 11', 'Chương 12–14: tái dùng, runner riêng, bảo mật, phát hành', 'Chương 15: tự dựng pipeline từ số 0', 'Mỗi tuần: 1 chương + bài 🧪 trên kho của bạn']),
  ) + box('tip', 'Mẹo không bỏ cuộc: tạo MỘT kho thử ngay hôm nay và làm mọi bài 🧪 trên đó. Tab Actions đầy run của chính bạn là động lực tốt nhất.') },

  /* ── 0.1 ── */
  /* 21 */ { t: 'Máy tôi: chạy được. Máy của GitHub: ENOENT', body: two(
    term(['$ node ch00/app.js', 'Xin chao tu may-cua-Cuong — cong 3000', '$ git status --short --ignored ch00', '!! ch00/config.local.json'], { title: 'máy Mac của khoá' }),
    term(['# run 35986054380 · ubuntu-24.04', '$ node ch00/app.js', '! Error: ENOENT: no such file or directory,', '!   open \'…/ch00/config.local.json\'', '! ##[error]Process completed with exit code 1.'], { title: 'output thật — runner GitHub' }),
  ) + box('warn', 'Tệp nằm trong <code>.gitignore</code> ⇒ nó CÓ trên máy bạn, KHÔNG có trong kho. Runner chỉ có đúng thứ đã commit.') },

  /* 22 */ { t: 'Sửa đúng chỗ: mặc định vào kho, tệp riêng chỉ để ghi đè', body: two(
    code(`// ch00/app.js (bản sửa)
const cfg = {
  ...doc('config.example.json'),      // có trong kho
  ...(fs.existsSync(local)
      ? doc('config.local.json')      // chỉ máy riêng
      : {}),
};`, 'javascript'),
    term(['# run 35986409808 · cùng workflow', '$ node ch00/app.js', '= Xin chao tu cau-hinh-mac-dinh — cong 8080', '# ✓ kiem in 6s'], { title: 'output thật — runner GitHub' }),
  ) + `<p class="c-note">CI không sửa lỗi hộ bạn. Nó biến “máy tôi chạy được” thành “chạy được từ một bản lấy về SẠCH” — câu thứ hai mới kiểm được.</p>` },

  /* 23 */ { t: 'Bốn thứ một phép kiểm cục bộ không bao giờ thấy', body: cards([
    { ic: '📄', t: 'Tệp chưa commit', d: 'Phổ biến nhất. Ví dụ ngay slide trước: <code>config.local.json</code>.', c: 'red' },
    { ic: '📦', t: 'Gói cài toàn cục', d: 'Cài một lần, vài tháng trước, chưa bao giờ vào <code>package.json</code>.', c: 'amb' },
    { ic: '🖥', t: 'Một cái máy khác', d: 'CPU, RAM, hệ điều hành, phiên bản Node khác nhau.', c: 'blu' },
    { ic: '⏭', t: 'Bước bạn bỏ qua', d: '“Chắc chắn qua” nên không chạy. CI không biết “chắc chắn” là gì.', c: 'vio' },
  ], 2) },

  /* 24 */ { t: 'Runner không giống máy bạn — runner kho riêng tư còn yếu hơn', body: table(['Runner chuẩn (09/2026)', 'Kho công khai', 'Kho riêng tư', 'Đo thật trên sân tập'], [
    ['Linux · ubuntu-24.04', '4 CPU · 16 GB', '!2 CPU · 8 GB', 'CPU: 4 · Mem 15Gi · Node v22.23.2'],
    ['Windows · windows-2025', '4 CPU · 16 GB', '!2 CPU · 8 GB', 'CPU: 4 · image win25-vs2026'],
    ['macOS · macos-15 (M1)', '3 CPU · 7 GB', '3 CPU · 7 GB', 'CPU: 3 · arm64'],
    ['Ổ đĩa SSD', '14 GB', '14 GB', ''],
  ], { sm: true }) + box('info', 'Trần heap MẶC ĐỊNH của Node suy ra từ RAM — đo thật (run 35987300829): Mac 32 GB của khoá <strong>4144 MB</strong> · runner Linux/Windows <strong>4144 MB</strong> · runner macOS 7 GB chỉ <strong>2096 MB</strong>. Vì thế bản dựng xanh ở nhà lại <strong>thoát 134</strong> trên macOS.') },

  /* ── 0.2 ── */
  /* 25 */ { t: 'Bốn ranh giới thật: sự kiện → workflow → job → bước', body: hier() },

  /* 26 */ { t: 'Một run phát hành thật: ba máy bắt đầu cùng một giây 19:50:48', body: pipe({
    w: 1160, h: 290,
    cols: [[{ n: 'Kiểm tra', s: 'ok', d: '72s' }], [{ n: 'Linux', s: 'ok', d: '241s' }, { n: 'macOS', s: 'ok', d: '437s' }, { n: 'Windows', s: 'ok', d: '323s' }], [{ n: 'Công bố', s: 'ok', d: '34s' }]],
    needs: [['Kiểm tra', 'Linux'], ['Kiểm tra', 'macOS'], ['Kiểm tra', 'Windows'], ['Linux', 'Công bố'], ['macOS', 'Công bố'], ['Windows', 'Công bố']],
  }) + `<p class="c-note">Run 32662461744 của kho api-backend · tổng 555 giây · macOS là đường tới hạn: hai máy kia xong sớm rồi NGỒI CHỜ.</p>` },

  /* 27 */ { t: 'Job không chia sẻ gì: tệp phải được mang qua bằng artifact', body: pipe({
    w: 1160, h: 200,
    cols: [[{ n: 'dung', s: 'ok', d: '5s' }], [{ n: 'doc-khong-mang', s: 'fail' }, { n: 'doc-co-mang', s: 'ok' }]],
    needs: [['dung', 'doc-khong-mang'], ['dung', 'doc-co-mang']],
  }) + two(
    term(['# job doc-khong-mang', '$ cat dist/ket-qua.txt', '! cat: dist/ket-qua.txt: No such file or directory', '! ##[error]Process completed with exit code 1.'], { title: 'output thật — run 35986054356' }),
    term(['# job doc-co-mang (sau download-artifact)', '$ cat dist/ket-qua.txt', '= ban dung luc 10:14:24'], { title: 'output thật — cùng run' }),
  ) },

  /* 28 */ { t: 'runs-on là một dòng, nhưng đổi hệ điều hành là đổi thời gian', body: bars([
    { l: 'npm ci ×2 · Linux', v: 38, txt: '38 s', c: 'grn' },
    { l: 'npm ci ×2 · macOS', v: 72, txt: '72 s (1,9×)', c: 'amb' },
    { l: 'npm ci ×2 · Windows', v: 107, txt: '107 s (2,8×)', c: 'red' },
    { l: 'build · Linux', v: 149, txt: '149 s', c: 'grn' },
    { l: 'build · Windows', v: 171, txt: '171 s', c: 'red' },
    { l: 'build · macOS', v: 315, txt: '315 s', c: 'amb' },
  ], { lw: 260 }) + `<p class="c-note">Cùng commit, cùng run 32662461744 của api-backend. Mã không đổi một dòng — chỉ đổi máy.</p>` },

  /* 29 */ { t: 'Trong một job, bước chạy tuần tự và dừng ở lỗi đầu tiên', body: yaml([
    ['- uses: actions/checkout@v4', 'không có mã thì không làm gì được'],
    ['- uses: actions/setup-node@v4', 'không có node thì npm không chạy'],
    ['  with: { node-version: \'22\', cache: npm }', '22 vì production là node:22-alpine'],
    ['- run: npm ci --no-audit --no-fund', 'không có gói thì tsc không chạy'],
    ['- run: npx tsc --noEmit', 'chốt 1 · RẺ NHẤT, hay hỏng nhất ⇒ đứng trước'],
    ['- run: npm run eval:grader', 'chốt 2'],
    ['- run: npm test', 'chốt 3 · đắt hơn ⇒ đứng sau'],
    ['- run: npm run lint', 'continue-on-error: true ⇒ hỏng vẫn xanh'],
  ], { fs: 17 }) + box('tip', '<code>continue-on-error: true</code> = bước được phép hỏng. <code>if: always()</code> = bước vẫn chạy sau khi bước trước hỏng. Hai thứ khác nhau.') },

  /* ── 0.3 ── */
  /* 30 */ { t: 'Khối on: của ci-lint.yml có một chỗ bất đối xứng', body: asym() },

  /* 31 */ { t: 'timeout-minutes: mặc định 360 phút — hãy tự đặt', body: two(
    yaml([['jobs:', ''], ['  treo:', ''], ['    runs-on: ubuntu-24.04', ''], ['    timeout-minutes: 1', 'thử với 1 phút'], ['    steps:', ''], ['      - run: sleep 300', 'giả lập bước chờ nhập liệu']], { fs: 16 }),
    term(['# run 35986054362', 'bat dau luc 10:14:23', '! ##[error]The operation was canceled.', 'Terminate orphan process: pid (1903) (sleep)', '# annotation:', '! The job has exceeded the maximum', '!   execution time of 1m0s', '# kết luận: cancelled (không phải failure)'], { title: 'output thật — sân tập' }),
  ) + `<p class="c-note">ci-lint.yml đặt 10 phút: “quá 10 phút là có chuyện, và tôi muốn biết”.</p>` },

  /* 32 */ { t: 'Không khai shell: ⇒ không pipefail, lỗi giữa ống bị nuốt', body: two(
    term(['# job mac-dinh — không khai shell:', 'shell: /usr/bin/bash -e {0}', '$ false | tail -1', '= van chay toi day — buoc XANH', '# ✓ job xanh'], { title: 'output thật — run 35986054351' }),
    term(['# job khai-bash — shell: bash', 'shell: /usr/bin/bash --noprofile --norc', '       -e -o pipefail {0}', '$ false | tail -1', '! ##[error]Process completed with exit code 1.'], { title: 'output thật — cùng run' }),
  ) + box('warn', 'Bước ESLint của ci-lint.yml viết <code>npm run lint 2&gt;&amp;1 | tail -30</code> và KHÔNG khai <code>shell:</code> ⇒ mã thoát của lint bị <code>tail</code> nuốt. Ở bước chỉ báo cáo thì vô hại; ở bước chặn cửa thì cửa không tồn tại.') },

  /* 33 */ { t: 'Bước cố ý bỏ qua: secret vắng thành chuỗi rỗng', body: yaml([
    ['- name: CV critique fabrication test (skips without an AI key)', ''],
    ['  env:', ''],
    ['    ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}', 'secret đã bị XOÁ có chủ đích'],
    ['    LLM_BASE_URL: ${{ secrets.LLM_BASE_URL }}', 'secret vắng ⇒ GitHub thay bằng ""'],
    ['  run: npm run eval:cv-fabrication', 'script thấy không có khoá ⇒ in SKIPPED, thoát 0'],
  ], { fs: 16 }) + two(
    box('good', 'Bỏ qua có ghi chép, ai cũng biết cái giá: không còn gì canh AI bịa số liệu.'),
    box('bad', 'Bỏ qua mà không ai biết = một phép kiểm “xanh” vì nó KHÔNG CHẠY. Chương 8 và 10 săn đúng loại này.'),
  ) },

  /* 34 */ { t: 'Annotation vàng 09/2026: checkout@v4 bị ép chạy Node 24', body: term([
    '$ gh run view 35986409808',
    '= ✓ ch00-mo-dau ch00 — may khac, khong phai may ban · 35986409808',
    'ANNOTATIONS',
    '+ ! Node.js 20 is deprecated. The following actions target Node.js 20',
    '+   but are being forced to run on Node.js 24: actions/checkout@v4.',
  ], { title: 'output thật — sân tập, 24/09/2026' }) + box('info', 'ci-lint.yml của kho này vẫn ghi <code>actions/checkout@v4</code>, trong khi bản mới nhất là v7.0.1 (07/2026). Run vẫn xanh — nhưng annotation vàng là lời báo trước. Chương 4 dạy cách nâng và ghim đúng.') },

  /* ── 0.4 ── */
  /* 35 */ { t: 'Bản đồ 15 chương: mỗi chương trả lời một câu hỏi về cỗ máy', body: table(['Chương', 'Câu hỏi nó trả lời'], [
    ['1 · Tệp workflow', 'Cái gì khởi động một run? Bẫy YAML nào cắn?'],
    ['2 · Job & runner', 'Máy nào chạy, chờ nhau ra sao, matrix tốn gì?'],
    ['3 · Biểu thức', '<code>&#36;{{ }}</code> được tính LÚC NÀO? Vì sao <code>if</code> không nổ?'],
    ['4 · Action', '<code>uses:</code> chạy mã của ai? Ghim thế nào?'],
    ['5 · Cache & artifact · 6 · Bí mật & quyền', 'Mua được bao nhiêu giây? Token với tới đâu?'],
    ['7 · Tốc độ · 8 · Khi CI đỏ', 'Giây đi đâu? Flaky hay hỏng thật?'],
    ['9 · Deploy · 10 · Chẩn đoán · 11 · Ôn giữa khoá', 'Vì sao kho này thôi push-để-deploy? Năm ca thật'],
    ['12–14 · Tái dùng · Runner riêng · Chất lượng & phát hành', 'Làm ở quy mô đội và tổ chức'],
    ['15 · Dự án cuối khoá + thi 20 câu', 'Tự dựng một pipeline hoàn chỉnh'],
  ], { sm: true }) },

  /* 36 */ { t: 'Thứ chuyển sang dự án của bạn là QUAN HỆ, không phải con số', body: cards([
    { ic: '🐢', t: 'Windows chậm với việc nặng hệ tệp', d: 'npm ci 2,8× Linux ở kho này. Số của bạn khác, chiều thì giống.', c: 'amb' },
    { ic: '🧭', t: 'Đường tới hạn là MỘT job', d: 'Tối ưu job không nằm trên đường tới hạn chẳng rút được giây nào.', c: 'blu' },
    { ic: '🎯', t: 'Cache trúng và trượt chênh nhau một hệ số', d: 'Biết hệ số đó cho dự án của bạn bằng cách đo.', c: 'tea' },
    { ic: '✅', t: 'Xanh = mọi lệnh bạn liệt kê thoát 0', d: 'Không hơn. Thiếu bước kiểm nào thì xanh không nói gì về nó.', c: 'grn' },
  ], 2) },

  /* ── cuối ── */
  /* 37 */ { t: 'Sai lầm hay gặp ở Mục 0', body: vs({
    no: { t: 'Hay làm', items: ['Tin “máy tôi chạy được” là đủ', 'Để job chạy tối đa 6 giờ mặc định', '<code>cmd | tail</code> ở bước chặn cửa, không khai <code>shell: bash</code>', 'Nghĩ job sau thấy tệp job trước tạo', 'Dùng <code>ubuntu-latest</code> mà không biết nó sẽ DỜI', 'Hiểu “xanh” là “mã đúng”'] },
    yes: { t: 'Nên làm', items: ['Chứng minh bằng một bản lấy về SẠCH', 'Đặt <code>timeout-minutes</code> cho mọi job', 'Khai <code>shell: bash</code> (có pipefail) hoặc <code>set -o pipefail</code>', 'Mang tệp qua bằng artifact', 'Ghim <code>ubuntu-24.04</code> khi cần ổn định', 'Biết chính xác xanh của mình kiểm những gì'] },
  }) },

  /* 38 */ { t: 'Bảng tra nhanh Mục 0', body: table(['Muốn…', 'Dùng / nhớ'], [
    ['Chỗ đặt workflow', '<code>.github/workflows/*.yml</code> — mỗi tệp một workflow'],
    ['Xem run gần nhất', '<code>gh run list --limit 5</code> · <code>gh run view &lt;id&gt;</code>'],
    ['Chỉ đọc phần hỏng', '<code>gh run view &lt;id&gt; --log-failed</code>'],
    ['Biết đang ở CI', 'biến <code>CI=true</code>, <code>GITHUB_ACTIONS=true</code>'],
    ['Giới hạn thời gian', '<code>timeout-minutes:</code> (mặc định 360)'],
    ['Có pipefail', '<code>shell: bash</code> ⇒ <code>bash --noprofile --norc -eo pipefail</code>'],
    ['Chuyển tệp giữa job', '<code>actions/upload-artifact</code> → <code>download-artifact</code>'],
    ['Delivery ≠ Deployment', 'Delivery có người bấm phát hành; Deployment thì không'],
  ], { sm: true }) },

  /* 39 */ { t: 'Thực hành Mục 0: workflow đầu tiên trên kho của bạn', body: steps([
    ['Tạo kho thử công khai, thêm <code>.github/workflows/hello.yml</code>', 'on: push · một job ubuntu-24.04 · timeout-minutes: 5'],
    ['Bước in <code>echo "CI=$CI"; nproc; node --version</code>', 'push, mở tab Actions, thấy ✓'],
    ['Cố ý làm đỏ: đọc một tệp nằm trong .gitignore', 'đọc ✗ bằng <code>gh run view --log-failed</code>'],
    ['Sửa cho xanh lại, ghi lại hai số run', 'bạn vừa đi trọn vòng đỏ → đọc log → sửa → xanh'],
  ]) },
]);
