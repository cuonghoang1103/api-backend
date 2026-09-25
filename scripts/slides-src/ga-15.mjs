/**
 * GitHub Actions · Deck ga-15 — Chương 15: Dự án cuối khoá — một pipeline CI/CD hoàn chỉnh từ số 0.
 *
 * MỌI log/output mới trên slide là THẬT, chạy 24–25/09/2026 trên sân tập công khai
 * github.com/cuonghoang1103/ga-san-tap, nhánh ch15-capstone (runner 2.337.0, ubuntu-24.04 20260920.314.1).
 * App "Đặt lịch phòng khám" (ch15/app: Express 5 + pg 8, Postgres 17) — xem sổ đo trong s15-du-an-cuoi-khoa.mjs.
 * Docs kiểm từ mã nguồn github/docs (commit f71cc2a, 24/09/2026).
 */
import { S, cover, cards, box, table, two, list, mindmap, term as gaTerm, yaml, diagram, kpis, bars, sv, R, T, A, D } from './_ga-chung.mjs';

export const deck = { key: 'ga-15', code: 'GITHUB ACTIONS · CHƯƠNG 15', title: 'Dự án cuối khoá', sub: 'GitHub Actions · Chương 15' };

const t = (lines, title, fs = 15) => gaTerm(lines, { title, dir: '~/ga-san-tap', fs });

/** Một hộp job giống đồ thị GitHub: s = ok | fail | skip | cancel. */
const JOB = { ok: ['grn', '✓'], fail: ['red', '✗'], skip: ['dim', '⊘'], cancel: ['amb', '⊘'] };
const job = (x, y, w, name, d, s = 'ok', fs = 15.5) => {
  const [c, ic] = JOB[s];
  return R(x, y, w, 48, { c, fill: '#0f182a', r: 10 }) +
    `<circle cx="${x + 22}" cy="${y + 24}" r="10" fill="${D[c]}"/>` + T(x + 22, y + 30, ic, { fs: 14, c: '#08101e', a: 'middle', b: true }) +
    T(x + 40, y + 30, name, { fs, mono: true, b: true }) + (d ? T(x + w - 10, y + 30, d, { fs: 14, c: 'mu', a: 'end', mono: true }) : '');
};
const curve = (x1, y1, x2, y2) => {
  const mx = (x1 + x2) / 2;
  return `<path d="M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2 - 3} ${y2}" stroke="${D.mu}" stroke-width="2.3" fill="none" marker-end="url(#m-mu)"/>`;
};

/* ───────────── Slide 3 — đồ thị của một run CD ───────────── */
const doThiCD = () => {
  let s = '';
  s += R(0, 0, 470, 330, { c: 'vio', dash: true, fill: 'rgba(188,140,255,.04)' }) + T(16, 26, 'ci (gọi lại ch15-ci.yml)', { fs: 15, c: 'vio', b: true });
  s += job(16, 42, 210, 'ci / lint', '7s');
  s += job(16, 102, 210, 'ci / typecheck', '7s');
  s += job(16, 162, 210, 'ci / test (22)', '16s');
  s += job(16, 222, 210, 'ci / test (24)', '20s');
  s += job(250, 102, 206, 'ci / ci-ok', '4s');
  s += job(250, 222, 206, 'tong-hop-ngay-tho', '', 'ok', 14);
  s += curve(226, 66, 250, 126) + curve(226, 186, 250, 126) + curve(226, 246, 250, 126);
  s += job(510, 102, 250, 'anh', '54s');
  s += curve(456, 126, 510, 126);
  s += job(810, 102, 330, 'trien-khai · ch15-production', '', 'ok', 14.5);
  s += curve(760, 126, 810, 126);
  const note = (x, y, a, b, c) => T(x, y, a, { fs: 16, b: true, c }) + T(x, y + 24, b, { fs: 14.5, c: 'mu' });
  s += note(510, 200, 'build amd64 + arm64', 'đẩy GHCR · ký attestation', 'tea');
  s += note(810, 200, 'environment + concurrency', 'SSH vào “VPS” · smoke · quay lui', 'amb');
  s += R(0, 350, 1160, 80, { c: 'dk', fill: 'rgba(32,136,255,.07)' }) +
    T(20, 382, 'Một push vào ch15-capstone = MỘT run: CI chạy lại (workflow_call) → dựng ảnh MỘT lần → deploy đúng ảnh đó.', { fs: 16.5, b: true }) +
    T(20, 412, 'PR thì chỉ chạy phần CI (ch15-ci.yml, on: pull_request). Không có đường nào deploy thứ CI chưa xanh.', { fs: 15.5, c: 'mu' });
  return sv(1160, 435, s);
};

/* ───────────── Slide 6 — cache: lạnh vs nóng ───────────── */
const doCache = () => {
  let s = '';
  const X = (sec) => 250 + sec * 150;
  s += `<line x1="${X(0)}" y1="236" x2="${X(5)}" y2="236" stroke="${D.dim}" stroke-width="2"/>`;
  [0, 1, 2, 3, 4, 5].forEach((k) => { s += T(X(k), 258, `${k}s`, { fs: 14, c: 'dim', a: 'middle', mono: true }); });
  const bar = (y, lb, sub, parts) => {
    let o = T(0, y + 22, lb, { fs: 17, b: true }) + T(0, y + 44, sub, { fs: 13.5, c: 'mu', mono: true });
    let at = 0;
    parts.forEach(([w, c, txt]) => { o += R(X(at), y, w * 150, 48, { c, fill: 'rgba(255,255,255,.04)', r: 6 }) + T(X(at) + (w * 150) / 2, y + 30, txt, { fs: 14, a: 'middle', mono: true, c }); at += w; });
    return o;
  };
  s += bar(40, 'Lạnh (không có cache)', 'job lint · run 36074781609', [[0.8, 'dim', 'setup 0.8'], [2.27, 'blu', 'npm ci 2.27s']]);
  s += T(X(3.07) + 12, 70, '≈ 3,1 s', { fs: 16, b: true, c: 'blu' });
  s += bar(130, 'Nóng (cache hit 8 MB)', 'job test (24) · cùng run', [[2.72, 'amb', 'setup + tải cache 2.72'], [1.57, 'grn', 'ci 1.57']]);
  s += T(X(4.29) + 12, 160, '≈ 4,3 s', { fs: 16, b: true, c: 'amb' });
  s += R(0, 284, 1160, 150, { c: 'amb', fill: 'rgba(255,194,51,.07)' }) +
    T(20, 318, 'Với 172 gói (8 MB nén), cache làm job CHẬM HƠN ~1,2 giây: tải + giải nén lâu hơn tự cài.', { fs: 16.5, b: true, c: 'amb' }) +
    T(20, 350, 'Khoá = hash(package-lock.json) ⇒ bump version trong lockfile là MISS: 1da59f56… → 682e28bd…', { fs: 15.5, mono: true }) +
    T(20, 382, 'Cache đáng giá khi npm ci > ~20 s (api-backend, Next.js). Đo trên chính repo của bạn trước khi tin.', { fs: 15.5, c: 'mu' }) +
    T(20, 414, 'Job xong TRƯỚC lưu cache; job bắt đầu SAU trong cùng run đã hit (lint lưu 23:51:27, test (24) hit 23:51:36).', { fs: 14.5, c: 'mu' });
  return sv(1160, 440, s);
};

/* ───────────── Slide 7 — concurrency hủy run cũ ───────────── */
const huyRunCu = () => {
  let s = '';
  const X = (sec) => 170 + sec * 9.5; // 0 = 23:52:29
  s += `<line x1="${X(0)}" y1="210" x2="${X(95)}" y2="210" stroke="${D.dim}" stroke-width="2"/>`;
  [0, 15, 30, 45, 60, 75, 90].forEach((k) => { s += T(X(k), 232, `+${k}s`, { fs: 13.5, c: 'dim', a: 'middle', mono: true }); });
  s += T(0, 58, 'run 1 · 67c8475', { fs: 15.5, b: true, c: 'amb', mono: true });
  s += R(X(0), 34, X(27) - X(0), 40, { c: 'amb', fill: 'rgba(255,194,51,.08)', r: 6 }) + T(X(27) + 10, 60, 'cancelled sau 27 s', { fs: 15, c: 'amb', b: true });
  s += T(0, 138, 'run 2 · c251002', { fs: 15.5, b: true, c: 'grn', mono: true });
  s += R(X(8), 114, X(91) - X(8), 40, { c: 'grn', fill: 'rgba(63,185,80,.08)', r: 6 }) + T(X(91) - 10, 140, 'success · 83 s', { fs: 15, c: 'grn', b: true, a: 'end' });
  s += A(X(8), 108, X(8), 80, { c: 'red' }) + T(X(8) + 8, 100, 'push thứ 2, 8 s sau', { fs: 14, c: 'red' });
  s += R(0, 256, 1160, 176, { c: 'dim', fill: '#070c16' }) +
    T(20, 288, 'Annotation trên 4 job của run 1 (nguyên văn):', { fs: 15.5, c: 'mu' }) +
    T(20, 318, 'Canceling since a higher priority waiting request for ch15-ci-10 exists', { fs: 16, mono: true, c: 'amb' }) +
    T(20, 356, 'ci-ok (if: always()) VẪN chạy trong run bị hủy — và ĐỎ:', { fs: 15.5, c: 'mu' }) +
    T(20, 386, "co job ket thuc voi 'cancelled' (lint typecheck test = cancelled cancelled cancelled)", { fs: 15, mono: true, c: 'red' }) +
    T(20, 418, 'group: ch15-ci-${{ github.event.pull_request.number || github.ref }} ⇒ ch15-ci-10', { fs: 14.5, c: 'dim', mono: true });
  return sv(1160, 436, s);
};

/* ───────────── Slide 8 — check tổng hợp: skip vs đỏ ───────────── */
const tongHop = () => {
  let s = '';
  s += T(0, 22, 'run 36075106581 · commit f28d29a “bỏ ::int cho gọn”', { fs: 15.5, c: 'mu', b: true });
  s += job(0, 44, 250, 'lint', '7s');
  s += job(0, 104, 250, 'typecheck', '8s');
  s += job(0, 164, 250, 'test (22)', '', 'fail');
  s += job(0, 224, 250, 'test (24)', '', 'fail');
  s += job(330, 74, 300, 'tong-hop-ngay-tho', '0s', 'skip');
  s += job(330, 194, 300, 'ci-ok · if: always()', '3s', 'fail', 15);
  s += curve(250, 128, 330, 98) + curve(250, 188, 330, 218);
  s += T(660, 92, '⊘ skip = required check ĐẠT', { fs: 16.5, b: true, c: 'amb' });
  s += T(660, 118, '→ PR đỏ vẫn merge được', { fs: 15, c: 'mu' });
  s += T(660, 212, '✗ đỏ = PR bị chặn đúng', { fs: 16.5, b: true, c: 'grn' });
  s += T(660, 238, 'KQ: success success failure', { fs: 15, c: 'mu', mono: true });
  s += R(0, 290, 1160, 140, { c: 'red', fill: 'rgba(255,92,108,.06)' }) +
    T(20, 322, 'Lỗi thật mà test bắt được (node --test, cả Node 22 lẫn 24):', { fs: 15.5, c: 'mu' }) +
    T(20, 352, "actual:   [ { bacSi: 'BS Hoa', soLich: '1' }, { bacSi: 'BS Lan', soLich: '1' } ]", { fs: 15.5, mono: true, c: 'red' }) +
    T(20, 380, "expected: [ { bacSi: 'BS Hoa', soLich: 1 }, { bacSi: 'BS Lan', soLich: 1 } ]", { fs: 15.5, mono: true, c: 'grn' }) +
    T(20, 412, 'count(*) của Postgres là bigint ⇒ thư viện pg trả CHUỖI. Bỏ ::int là API đổi kiểu mà không ai hay.', { fs: 15, c: 'mu' });
  return sv(1160, 434, s);
};


/* ───────────── Slide 12 — ba lần dựng, ba thời gian ───────────── */
const baLanDung = () => {
  let s = '';
  const X = (sec) => 330 + sec * 26;
  s += `<line x1="${X(0)}" y1="236" x2="${X(30)}" y2="236" stroke="${D.dim}" stroke-width="2"/>`;
  [0, 5, 10, 15, 20, 25, 30].forEach((k) => { s += T(X(k), 258, `${k}s`, { fs: 14, c: 'dim', a: 'middle', mono: true }); });
  const bar = (y, lb, sub, sec, c, txt) => T(0, y + 22, lb, { fs: 17, b: true }) + T(0, y + 44, sub, { fs: 13.5, c: 'mu', mono: true }) +
    R(X(0), y, X(sec) - X(0), 46, { c, fill: 'rgba(255,255,255,.04)', r: 6 }) + T(X(sec) + 12, y + 29, txt, { fs: 15.5, b: true, c });
  s += bar(20, 'Lạnh — lần dựng đầu', '97ee1c5 · run 36074781609', 27, 'red', '27 s');
  s += bar(90, 'Chỉ đổi tệp workflow', '54cc614 · run 36075460464', 7, 'grn', '7 s — ngữ cảnh không đổi');
  s += bar(160, 'Lockfile đổi (bump version)', '39c37de · run 36075733214', 25, 'amb', '25 s — lockfile đổi');
  s += R(0, 282, 1160, 150, { c: 'dk', fill: 'rgba(32,136,255,.07)' }) +
    T(20, 316, 'cache-from/to: type=gha,scope=ch15-phong-kham,mode=max — tầng lưu thành entry cache của GitHub:', { fs: 15.5, mono: true }) +
    T(20, 348, 'buildkit-blob-1-sha256:f7f2d3…  55 585 204 B   ·   index-ch15-phong-kham-1-5c45fc59#1  10 701 B', { fs: 15, mono: true, c: 'tea' }) +
    T(20, 382, 'Thời gian đo cho CẢ HAI nền tảng (amd64 thật + arm64 qua QEMU) trong một bước build-push.', { fs: 15.5, c: 'mu' }) +
    T(20, 412, 'Bài học: "npm version" ghi vào package-lock.json ⇒ tầng COPY lockfile đổi ⇒ npm ci chạy lại.', { fs: 15.5, b: true, c: 'amb' });
  return sv(1160, 436, s);
};

/* ───────────── Slide 13 — attestation: ai ký, lưu ở đâu ───────────── */
const attestHinh = () => diagram({
  w: 1160, h: 300,
  nodes: [
    { id: 'job', x: 0, y: 100, w: 220, h: 96, t: 'job anh', d: 'id-token: write\nattestations: write', c: 'dk', mono: true },
    { id: 'oidc', x: 300, y: 0, w: 250, h: 84, t: 'OIDC token', d: 'workflow_ref + sha + event', c: 'tea' },
    { id: 'fulcio', x: 300, y: 200, w: 250, h: 84, t: 'Sigstore (public-good)', d: 'chứng chỉ sống 10 phút', c: 'vio' },
    { id: 'rekor', x: 640, y: 0, w: 240, h: 84, t: 'Rekor', d: 'logIndex=2946244881', c: 'amb', mono: true },
    { id: 'gh', x: 640, y: 200, w: 240, h: 84, t: 'GitHub attestations', d: '/attestations/50030102', c: 'grn', mono: true },
    { id: 'reg', x: 940, y: 100, w: 220, h: 96, t: 'GHCR', d: 'push-to-registry\n@sha256:93642a39…', c: 'blu', mono: true },
  ],
  edges: [{ from: 'job', to: 'oidc', t: 'xin' }, { from: 'oidc', to: 'fulcio', t: 'đổi lấy' }, { from: 'fulcio', to: 'rekor', t: 'ghi' }, { from: 'fulcio', to: 'gh', t: 'lưu' }, { from: 'gh', to: 'reg' }],
});

/* ───────────── Slide 15 — kiến trúc deploy mô phỏng ───────────── */
const kienTruc = () => {
  let s = '';
  s += R(0, 0, 1160, 400, { c: 'dim', dash: true, fill: 'rgba(255,255,255,.02)' }) + T(16, 26, 'runner ubuntu-24.04 của job trien-khai (một máy, sống ~25 giây)', { fs: 15, c: 'mu', b: true });
  s += R(24, 60, 250, 150, { c: 'dk', fill: '#0f182a' }) + T(40, 92, 'các bước của job', { fs: 17, b: true }) +
    T(40, 122, 'ssh vps …', { fs: 15, mono: true, c: 'tea' }) + T(40, 150, 'curl :19153/healthz', { fs: 15, mono: true, c: 'tea' }) + T(40, 178, 'gh api …/deployments', { fs: 15, mono: true, c: 'tea' });
  s += R(360, 60, 330, 150, { c: 'amb', fill: '#0f182a' }) + T(376, 92, '“VPS” = container ch15-vps', { fs: 17, b: true, c: 'amb' }) +
    T(376, 122, 'sshd · user deployer · chỉ khoá', { fs: 15, c: 'mu' }) + T(376, 150, '/srv/phong-kham/trien-khai.sh', { fs: 15, mono: true }) + T(376, 178, 'docker CLI → docker.sock', { fs: 15, mono: true, c: 'mu' });
  s += A(274, 110, 356, 110, { c: 'tea' }) + T(278, 136, 'SSH:19152', { fs: 13, c: 'tea', mono: true });
  s += R(780, 60, 360, 150, { c: 'grn', fill: '#0f182a' }) + T(796, 92, 'Docker daemon của runner', { fs: 17, b: true, c: 'grn' }) +
    T(796, 122, 'ch15-app  :19153 → 3000', { fs: 15, mono: true }) + T(796, 150, 'ch15-db   postgres:17-alpine', { fs: 15, mono: true }) + T(796, 178, 'mạng ch15-net', { fs: 15, mono: true, c: 'mu' });
  s += A(690, 170, 776, 170, { c: 'grn' }) + T(700, 160, 'socket', { fs: 14, c: 'grn', mono: true });
  s += `<path d="M150 210 C150 300 960 300 960 214" stroke="${D.vio}" stroke-width="2.5" fill="none" stroke-dasharray="7 6" marker-end="url(#m-vio)"/>` + T(470, 292, 'smoke test đi đường người dùng đi: HTTP :19153', { fs: 15, c: 'vio' });
  s += R(24, 318, 1112, 70, { c: 'red', fill: 'rgba(255,92,108,.06)' }) +
    T(40, 348, 'MÔ PHỎNG: không SSH ra máy thật nào. VPS giả chết cùng job ⇒ mỗi run phải dựng lại “bản đang chạy”', { fs: 15.5, b: true, c: 'red' }) +
    T(40, 374, 'trước khi deploy (bước "MO PHONG: dua VPS ve trang thai production hien tai"). VPS thật thì trạng thái nằm sẵn đó.', { fs: 14.5, c: 'mu' });
  return sv(1160, 404, s);
};

/* ───────────── Slide 20 — dòng thời gian của lần deploy hỏng ───────────── */
const deployHong = () => {
  let s = '';
  const X = (sec) => 60 + sec * 26; // 0 = 00:07:34
  s += `<line x1="${X(0)}" y1="150" x2="${X(40)}" y2="150" stroke="${D.dim}" stroke-width="2"/>`;
  [0, 10, 20, 30, 40].forEach((k) => { s += T(X(k), 172, `+${k}s`, { fs: 13.5, c: 'dim', a: 'middle', mono: true }); });
  s += R(X(0), 40, X(3) - X(0), 50, { c: 'amb', fill: 'rgba(255,194,51,.1)', r: 6 }) + T(X(0), 32, 'trao sha-4787c43', { fs: 14, c: 'amb', b: true });
  s += R(X(3), 40, X(34) - X(3), 50, { c: 'red', fill: 'rgba(255,92,108,.08)', r: 6 }) + T(X(3) + 12, 72, 'smoke: 15 lan × 2 s — container restarting, restart=1 → 9', { fs: 15, c: 'red', mono: true });
  s += R(X(34), 40, X(36.7) - X(34), 50, { c: 'grn', fill: 'rgba(63,185,80,.14)', r: 6 }) + T(X(37) + 6, 72, 'quay lui 2,7 s', { fs: 15, c: 'grn', b: true });
  s += R(0, 196, 1160, 234, { c: 'dim', fill: '#070c16' });
  const L = (y, a, c = '#c9d1d9') => T(20, y, a, { fs: 14.5, mono: true, c });
  s += L(226, 'curl: (56) Recv failure: Connection reset by peer', 'mu') +
    L(252, 'lan 1: chua tra loi (container: restarting restart=1 exit=1)', 'amb') +
    L(278, "curl: (7) Failed to connect to localhost port 19153 after 0 ms: Couldn't connect to server", 'mu') +
    L(304, 'lan 15: chua tra loi (container: restarting restart=9 exit=1)', 'amb') +
    L(330, "  code: 'MODULE_NOT_FOUND',          ##[error]Process completed with exit code 1.", 'red') +
    L(356, 'quay lui: …:sha-4787c43 -> …:sha-39c37de', 'tea') +
    L(382, '{"ok":true,"phienBan":"1.1.0+39c37de04a4a…","db":"ok"}', 'grn') +
    L(408, 'quay lui XONG sau lan 2      · run ĐỎ, production XANH (v1.1.0)', 'grn');
  return sv(1160, 434, s);
};

/* ───────────── Slide 21 — hai khoá: pha A và pha B ───────────── */
const haiKhoa = () => {
  let s = '';
  s += T(0, 20, 'Pha A · khoá CI theo github.ref — hai push cách 6 s', { fs: 16, b: true, c: 'red' });
  s += T(0, 50, '9b26683', { fs: 15, mono: true, c: 'amb', b: true }) + R(100, 32, 250, 30, { c: 'amb', fill: 'rgba(255,194,51,.08)', r: 6 }) + T(360, 53, 'CI bị HỦY sau 29 s ⇒ commit này không bao giờ lên production', { fs: 15, c: 'amb' });
  s += T(0, 88, '0fef5f5', { fs: 15, mono: true, c: 'grn', b: true }) + R(130, 70, 520, 30, { c: 'grn', fill: 'rgba(63,185,80,.08)', r: 6 }) + T(660, 91, 'success', { fs: 15, c: 'grn' });
  s += T(0, 120, 'Canceling since a higher priority waiting request for ch15-ci-refs/heads/ch15-capstone exists', { fs: 14, mono: true, c: 'mu' });
  // pha B: dòng thời gian job trien-khai, 0 = 00:18:50
  const X = (sec) => 150 + sec * 7.3;
  s += T(0, 170, 'Pha B · khoá CI theo run_id, khoá deploy ch15-production (cancel-in-progress: false)', { fs: 16, b: true, c: 'grn' });
  s += `<line x1="${X(0)}" y1="352" x2="${X(125)}" y2="352" stroke="${D.dim}" stroke-width="2"/>`;
  [[0, '00:18:50'], [30, ':19:20'], [60, ':19:50'], [90, ':20:20'], [120, ':20:50']].forEach(([k, l]) => { s += T(X(k), 374, l, { fs: 13, c: 'dim', a: 'middle', mono: true }); });
  const row = (y, lb, c) => T(0, y + 22, lb, { fs: 15, mono: true, b: true, c });
  s += row(190, 'acd5829', 'grn') + R(X(11), 190, X(65) - X(11), 34, { c: 'grn', fill: 'rgba(63,185,80,.12)', r: 6 }) + T(X(11) + 8, 212, 'chạy 00:19:01 → 19:55', { fs: 13.5, c: 'grn' });
  s += row(238, '5c7b348', 'amb') + R(X(12), 238, X(58) - X(12), 34, { c: 'amb', fill: 'rgba(255,194,51,.06)', r: 6, dash: true }) + T(X(12) + 8, 260, 'chờ 46 s → bị THAY', { fs: 13.5, c: 'amb' });
  s += row(286, 'c17030d', 'grn') + R(X(57), 286, X(68) - X(57), 34, { c: 'vio', fill: 'rgba(188,140,255,.06)', r: 6, dash: true }) + R(X(68), 286, X(130) - X(68), 34, { c: 'grn', fill: 'rgba(63,185,80,.12)', r: 6 }) + T(X(68) + 8, 308, 'chạy 00:19:58 → 21:00 · PREV = acd5829', { fs: 13.5, c: 'grn' });
  s += A(X(65), 206, X(68), 292, { c: 'mu', sw: 2 });
  s += R(0, 386, 1160, 46, { c: 'dk', fill: 'rgba(32,136,255,.07)' }) + T(20, 415, 'Một đang chạy + một đang chờ; bản chờ mới thay bản chờ cũ; KHÔNG bao giờ giết deploy đang chạy.', { fs: 16, b: true });
  return sv(1160, 436, s);
};

export const slides = S([
  /* 1 */ cover({ t: 'Chương 15 — Dự án cuối khoá', sub: 'pipeline CI/CD từ số 0: PR → CI → ảnh → deploy an toàn → vận hành', chap: 'CHƯƠNG 15' }),

  /* 2 */ { t: 'Bản đồ chương: một app thật, bốn tầng của một pipeline', body: mindmap('Đặt lịch phòng khám', 'Express 5 + Postgres 17 · nhánh ch15-capstone · mọi run là run thật', [
    { t: '15.1 CI cho PR', d: 'lint · typecheck · test Postgres · ma trận 22/24 · concurrency · ci-ok', c: 'dk' },
    { t: '15.2 Dựng ảnh', d: 'multi-stage · amd64+arm64 · cache gha · tag SHA+semver · GHCR · attestation', c: 'tea' },
    { t: '15.3 Deploy an toàn', d: 'environment · SSH mô phỏng · khoá production · smoke · tự quay lui', c: 'amb' },
    { t: '15.4 Vận hành', d: 'đọc CI đỏ · test chập chờn · chi phí · dọn dẹp · checklist · phỏng vấn', c: 'vio' },
    { t: '15.5 Thi cuối khoá', d: '20 câu · Mục 0 → Chương 15 · 30 phút', c: 'grn' },
  ]) },

  /* ───── 15.1 ───── */
  /* 3 */ { t: 'Một push = một run: CI → dựng ảnh MỘT lần → deploy ảnh đó', body: doThiCD() },

  /* 4 */ { t: 'ch15-ci.yml: 3 job song song, 1 job tổng hợp, khoá theo số PR', body: two(
    yaml([['on:', ''], ['  pull_request:', ''], ['    branches: [ch15-capstone]', 'PR vào nhánh chính'], ["    paths: ['ch15/app/**', …]", 'đổi docs ⇒ không chạy'], ['  workflow_call:', 'CD gọi lại đúng tệp này'], ['concurrency:', ''], ['  group: ch15-ci-${{ PR || run_id }}', 'PR: khoá theo số PR'], ['  cancel-in-progress: true', 'push: mỗi run 1 nhóm (15.3)'], ['permissions:', ''], ['  contents: read', 'tối thiểu'], ['defaults:', ''], ['  run:', ''], ['    working-directory: ch15/app', 'monorepo: app nằm sâu']], { fs: 14 }),
    yaml([['jobs:', ''], ['  lint:       { … npm run lint }', '7s'], ['  typecheck:  { … tsc -p jsconfig }', '7s'], ['  test:', ''], ['    strategy:', ''], ['      fail-fast: false', 'thấy CẢ HAI bản đỏ'], ['      matrix: { node: [22, 24] }', 'prod 22, bản kế 24'], ['    services: { postgres: … }', 'DB thật, không mock'], ['  tong-hop-ngay-tho:', 'CỐ Ý sai để so'], ['    needs: [lint, typecheck, test]', ''], ['  ci-ok:', 'check BẮT BUỘC'], ['    if: always()', ''], ['    needs: [lint, typecheck, test]', '']], { fs: 14 })) },

  /* 5 */ { t: 'Service container: Postgres thật cho mỗi job test, 7–10 giây', body: two(
    yaml([['services:', ''], ['  postgres:', ''], ['    image: postgres:17-alpine', ''], ['    env:', ''], ['      POSTGRES_HOST_AUTH_METHOD: trust', 'không mật khẩu nào'], ["    ports: ['5432:5432']", 'job chạy trên runner'], ['    options: >-', ''], ['      --health-cmd "pg_isready -U postgres"', 'chờ tới khi SẴN SÀNG'], ['      --health-interval 2s', ''], ['      --health-retries 15', ''], ['env:', ''], ['  DATABASE_URL: postgres://postgres@localhost:5432/…', '']], { fs: 14 }),
    t(['# test (24) · run 36074781609', 'Initialize containers        23:51:24 → 34 (10 s)', 'starting PostgreSQL 17.11 on x86_64-pc-linux-musl', 'database system is ready to accept connections', '✔ healthz noi chuyen duoc voi Postgres (99ms)', '✔ dat lich roi doc lai (32ms)', '✔ trung khung gio cua cung bac si thi 409', '# tests 8 · pass 8 · duration_ms 356', '# log service (runner tu in cuoi job):', '! ERROR: duplicate key value violates unique', '!   constraint "lich_hen_bac_si_bat_dau_key"', '+ = test 409 CO Y gay ra, khong phai loi'], 'service container · log thật', 13.5)) },

  /* 6 */ { t: 'Cache npm đo thật: với app nhỏ, cache CHẬM hơn tự cài', body: doCache() },

  /* 7 */ { t: 'concurrency theo số PR: push mới hủy run cũ trong vài giây', body: huyRunCu() },

  /* 8 */ { t: 'Check tổng hợp: “skip” lọt qua, job always() mới chặn PR đỏ', body: tongHop() },

  /* ───── 15.2 ───── */
  /* 9 */ { t: 'Dockerfile hai tầng: tầng chạy chỉ có thứ production cần', body: two(
    yaml([['FROM node:22-alpine AS deps', 'tầng 1: cài'], ['WORKDIR /app', ''], ['COPY package.json package-lock.json ./', 'CHỈ 2 tệp ⇒ cache tốt'], ['RUN npm ci --omit=dev --no-audit --no-fund', 'không devDependencies'], ['', ''], ['FROM node:22-alpine AS runtime', 'tầng 2: chạy'], ['ENV NODE_ENV=production PORT=3000', ''], ['COPY --from=deps /app/node_modules ./node_modules', 'chỉ lấy kết quả'], ['COPY src ./src', ''], ['COPY public ./public', ''], ['ARG APP_VERSION=dev', 'CD truyền vào'], ['ENV APP_VERSION=$APP_VERSION', '/healthz in ra'], ['USER node', 'không chạy bằng root'], ['HEALTHCHECK … fetch(/healthz)', ''], ['CMD ["node", "src/server.js"]', 'nhớ dòng này (15.3)']], { fs: 14, lang: 'docker' }),
    list([
      '<code>.dockerignore</code> loại <code>node_modules</code>, <code>test</code>, cấu hình lint ⇒ ngữ cảnh dựng nhỏ, và <strong>không</strong> có test trong ảnh.',
      '<code>--omit=dev</code>: 90 trong 172 gói (eslint, typescript, @types) không được cài. Tầng chạy có 82 gói, <code>node_modules</code> 5,3 MB (đo trên máy dựng bài).',
      '<code>USER node</code>: ảnh <code>node:*-alpine</code> có sẵn user này (uid 1000). Một lỗ hổng trong app không thành quyền root trong container.',
      'Chi tiết từng lệnh: khoá Docker, bài multi-stage — <code>/courses/docker</code>.',
    ])) },

  /* 10 */ { t: 'buildx + QEMU: một digest, hai manifest, hai kiến trúc', body: two(
    yaml([['- uses: docker/setup-qemu-action@9901…04e1 # v4.4.0', 'giả lập arm64'], ['- uses: docker/setup-buildx-action@f87e…f069 # v4.4.1', ''], ['- uses: docker/login-action@dbcb…9679f # v4.6.0', ''], ['  with:', ''], ['    registry: ghcr.io', ''], ['    username: ${{ github.actor }}', ''], ['    password: ${{ secrets.GITHUB_TOKEN }}', 'không cần PAT'], ['- uses: docker/build-push-action@c3c9…c0dc # v7.4.0', ''], ['  with:', ''], ['    context: ch15/app', ''], ['    platforms: linux/amd64,linux/arm64', ''], ['    push: true', ''], ['    provenance: false', 'dùng actions/attest'], ['    sbom: false', '']], { fs: 13.5 }),
    t(['$ docker buildx imagetools inspect \\', '    ghcr.io/…/ch15-phong-kham@sha256:06d60601…', 'MediaType: application/vnd.oci.image.index.v1+json', 'Digest:    sha256:06d606010bafc0547b04…', 'Manifests:', '  Name:     …@sha256:a2e3fa6747c9d034…', '+ Platform: linux/amd64', '  Name:     …@sha256:3d2a7db40545c186…', '+ Platform: linux/arm64', '# docker pull trên Mac M1 tự lấy arm64,', '# trên VPS x86 tự lấy amd64 — cùng một tên.'], 'run 36074781609 · job anh', 14)) },

  /* 11 */ { t: 'Ba tag cho một ảnh — deploy bằng tag KHÔNG bao giờ dời', body: table(['Tag', 'Ví dụ (run 36075733214)', 'Dời được?', 'Dùng để'], [
    ['<code>sha-&lt;7&gt;</code>', '<code>sha-39c37de</code>', '+không — một commit, một ảnh', '!deploy + quay lui (15.3)'],
    ['<code>v&lt;semver&gt;</code>', '<code>v1.1.0</code>', 'về nguyên tắc không; thực tế ai cũng ghi đè được', 'người đọc, ghi chú phát hành'],
    ['<code>v&lt;major.minor&gt;</code>', '<code>v1.1</code>', '-có — dời theo mỗi bản vá', 'người dùng muốn “bản 1.1 mới nhất”'],
    ['<code>latest</code>', '(không tạo)', '-luôn dời', 'không dùng cho deploy'],
    ['digest <code>@sha256:…</code>', '<code>@sha256:3532003b…</code>', '+không bao giờ', 'attestation, kiểm chứng, ghim tuyệt đối'],
  ], { sm: true }) + box('info', '<code>docker/metadata-action</code> sinh cả ba tag + nhãn OCI: <code>org.opencontainers.image.revision=39c37de0…</code>, <code>source=https://github.com/cuonghoang1103/ga-san-tap</code>, <code>version=v1.1.0</code>. Semver đọc từ <code>package.json</code> — push thẻ git bị chặn trong phiên dựng bài, và đọc từ tệp thì không phụ thuộc thẻ.') },

  /* 12 */ { t: 'cache type=gha: 27 giây lạnh, 7 giây nóng, 25 giây khi lockfile đổi', body: baLanDung() },

  /* 13 */ { t: 'Attestation: “ảnh này dựng từ commit này, bởi workflow này”', body: attestHinh() + t(['Attestation created for ghcr.io/cuonghoang1103/ch15-phong-kham@sha256:06d6…', 'Attestation signed using certificate from Public Good Sigstore instance', '$ gh attestation verify oci://…@sha256:3532003b… --repo cuonghoang1103/ga-san-tap', '+ da ky boi: …/.github/workflows/ch15-cd.yml@refs/heads/ch15-capstone', '+ kich hoat: push · commit 39c37de · runner github-hosted'], 'run 36074781609 + 36075733214', 13.5) },

  /* 14 */ { t: 'Quyền tối thiểu: chỉ job anh được ghi gói và xin OIDC', body: two(
    yaml([['permissions:', 'mức workflow'], ['  contents: read', 'mặc định cho MỌI job'], ['jobs:', ''], ['  ci:', 'uses: …ch15-ci.yml — chỉ đọc'], ['  anh:', ''], ['    permissions:', ''], ['      contents: read', ''], ['      packages: write', 'đẩy GHCR'], ['      id-token: write', 'xin chứng chỉ Sigstore'], ['      attestations: write', 'lưu attestation'], ['      artifact-metadata: write', 'actions/attest v4'], ['  trien-khai:', ''], ['    permissions:', ''], ['      contents: read', ''], ['      packages: read', 'kéo ảnh'], ['      deployments: read', 'hỏi bản đang chạy']], { fs: 14 }),
    list([
      'Khai quyền ở mức <strong>job</strong> thay vì workflow: một bước bị chiếm quyền ở <code>trien-khai</code> không đẩy được ảnh giả lên GHCR.',
      '<code>id-token: write</code> chỉ cho job ký. Token OIDC ghi <code>workflow_ref</code> + <code>sha</code> — đó chính là thứ attestation chứng nhận.',
      'Không PAT, không secret nào cho GHCR: <code>GITHUB_TOKEN</code> đủ, sống tới hết job (Bài 6.3).',
      'Attestation dùng được cho kho <strong>public</strong> ở mọi gói; kho private cần GitHub Enterprise Cloud (README actions/attest, 09/2026).',
    ])) },
  /* ───── 15.3 ───── */
  /* 15 */ { t: 'Mô phỏng: SSH vào một “VPS” là container ngay trong job', body: kienTruc() },

  /* 16 */ { t: 'Environment: gọi tên từ job thì lỗi, Deployments API thì tạo được', body: two(
    t(['# run 36074781609 — lần đầu job gọi environment', '! environment not found', '# job trien-khai: không chạy, không có log', '', '# run 36075156166 — tạo qua Deployments API', '$ gh api -X POST …/deployments --input -', '+ deployment 6650623893', '+ trang thai: inactive', '$ gh api …/environments --jq ".environments[].name"', 'ch09-production', '+ ch15-production'], 'hai run thật · 24/09/2026', 14),
    list([
      'Docs: “chạy một workflow tham chiếu environment chưa có sẽ TẠO nó”. Đo được ở sân tập 09/2026: <strong>không</strong> — run đỏ với “environment not found”.',
      'Tạo một deployment qua API bằng <code>GITHUB_TOKEN</code> (<code>deployments: write</code>) thì environment xuất hiện; job sau gọi được.',
      '<strong>Người duyệt, secret theo environment, giới hạn nhánh</strong> cần quyền admin — chưa bật được từ phiên dựng bài (⏳ ghi trong bài).',
      'Environment mới tạo KHÔNG có luật nào: bất kỳ nhánh nào cũng deploy vào được — slide 18 cho thấy cái giá.',
    ])) },

  /* 17 */ { t: 'SSH đúng cách: khoá riêng, ghim host key, không dùng root', body: two(
    yaml([['env:', ''], ['  SSH_KEY: ${{ secrets.CH15_SSH_KEY }}', 'secret theo ENVIRONMENT'], ['run: |', ''], ['  if [ -n "$SSH_KEY" ]; then …', ''], ['  else ssh-keygen -t ed25519 …', 'chưa có ⇒ khoá tạm'], ['# ghim khoa may chu, khong tat kiem', ''], ['ssh-keyscan -t ed25519 -p 19152 …', 'MÔ PHỎNG'], ['  > ~/.ssh/known_hosts', 'thật: lấy từ secret'], ['Host vps', ''], ['  User deployer', 'không root'], ['  StrictHostKeyChecking yes', 'KHÔNG "no"'], ['# mat khau DB di qua stdin', ''], ["printf '%s\\n' \"$DB_PASSWORD\" | ssh vps \\", ''], ['  "read -r DB_PASSWORD && …"', 'không lộ trong ps']], { fs: 13.5 }),
    t(['::notice title=Khoa SSH tam::environment', '  ch15-production chua co secret CH15_SSH_KEY', '256 SHA256:QZfetKJhiTBioVV7zxI2Fs0gNWgycJrNWfrc3U1rMiw', '    [127.0.0.1]:19152 (ED25519)', 'da vao b4907221cc9e voi user deployer', 'docker 28.0.4', '# sshd cua VPS: 01-chi-khoa.conf', 'PasswordAuthentication no', 'PermitRootLogin no', '! WARNING! Your credentials are stored unencrypted', '+ Login Succeeded'], 'run 36075460464 · trien-khai', 14)) },

  /* 18 */ { t: '“Bản trước” = bản ĐANG CHẠY — hỏi Deployments API', body: two(
    t(['# lan 1 (run 36075225804): khong loc nhanh', 'production dang chay: …:sha-069ee49', '  (deployment 6650624512)', '[vps] keo: …:sha-069ee49', '! Error response from daemon: manifest unknown', '# 069ee49 = job "thu" chi echo, nhanh', '#   ch15-moi-truong — van la deployment success', '', '# sua: &ref=ch15-capstone + kiem anh ton tai', '+ chua co lan deploy thanh cong nao tu', '+   ch15-capstone — lan dau (run 36075460464)', '+ PREV: …:sha-54cc614   (run 36075733214)'], 'ba run thật', 14),
    list([
      'Lịch sử environment ghi <strong>mọi</strong> job có <code>environment:</code> — kể cả job thử trên nhánh khác. Không giới hạn nhánh thì “bản trước” có thể là rác.',
      'Lọc <code>deployments?environment=…&amp;ref=ch15-capstone</code>, lấy bản <code>success</code> mới nhất, rồi <code>imagetools inspect</code> xem ảnh còn tồn tại.',
      'Đúng bài 9.3: hỏi production đang chạy gì, <strong>đừng đoán</strong> bằng commit cha.',
      'Kho thật: bật “Deployment branches: main” cho environment production — một dòng cấu hình chặn cả loại lỗi này.',
    ])) },

  /* 19 */ { t: 'Deploy xanh: trao ảnh 1 giây, smoke kiểm ĐÚNG phiên bản', body: two(
    t(['[vps] dang chay: …:sha-54cc614', '[vps] keo: …:sha-39c37de', '[vps] da trao: …sha-54cc614 -> …sha-39c37de', '# smoke test', 'curl: (56) Recv failure: Connection reset by peer', 'lan 1: chua tra loi (container: running', '       restart=0 exit=0)', '+ lan 2: {"ok":true,"phienBan":"1.1.0+39c37de0…",', '+        "db":"ok"}', '+ GET /api/lich -> 200', '+ GET / -> 200', '# Thoi gian tu luc deploy: 3 s'], 'run 36075733214 · v1.1.0', 14),
    list([
      'Lần thử 1 luôn hỏng: app còn đang chờ Postgres. Vòng lặp <strong>thử lại có giới hạn</strong> (15 × 2 s), không phải <code>sleep 30</code> cố định.',
      '<code>/healthz</code> trả <code>phienBan = version + SHA đầy đủ</code>; smoke so khớp nó — bắt được cả ca “container cũ vẫn trả lời”.',
      'Kiểm cả đường API và trang tĩnh: <code>/api/lich</code> 200 nghĩa là DB + bảng + truy vấn đều sống.',
      'Smoke đi từ <strong>ngoài</strong> vào (HTTP :19153), như người dùng; không <code>docker exec</code> vào trong.',
    ])) },

  /* 20 */ { t: 'Deploy hỏng: mọi thứ xanh, container chết — tự quay lui', body: deployHong() },
  /* 21 */ { t: 'Khoá CI hủy mất bản trước; khoá deploy thì xếp hàng', body: haiKhoa() },

  /* 22 */ { t: 'So với deploy-nha.sh: đã có khoá, thiếu quay lui tự động', body: table(['', 'deploy-nha.sh (api-backend, 09/2026)', 'ch15-cd.yml (dự án này)'], [
    ['Kích hoạt', 'người chạy tay từ máy nhà', 'push vào nhánh chính (sau PR)'],
    ['Kiểm trước khi tráo', 'tsc, eval, npm test chạy SAU khi tráo ảnh', '+CI chạy lại TRƯỚC khi dựng ảnh (<code>needs</code>)'],
    ['Dựng ảnh', '+máy nhà 12 nhân, song song, đẩy GHCR', 'runner GitHub, buildx 2 kiến trúc, cache gha'],
    ['Khoá hai deploy', '+<code>flock -n</code> trên VPS: phiên sau bị TỪ CHỐI', '+<code>concurrency</code>: phiên sau XẾP HÀNG'],
    ['Biết production chạy gì', '+đọc SHA của ảnh đang chạy, chặn deploy làm LÙI mã', '+Deployments API, lấy bản success mới nhất'],
    ['Smoke test', '+có (404 = route chưa mount)', '+có (phiên bản + /api + /)'],
    ['Quay lui', '-tay: <code>--cho-lui</code> hoặc gắn tag ảnh mồ côi (~40 s)', '+tự động khi smoke hỏng (2,7 s)'],
    ['Dấu vết', 'log trên terminal của người chạy', '+deployment + status trên GitHub'],
  ], { sm: true }) + box('tip', 'Script của repo là kết quả của sự cố thật (06/07, 18/08) và đã có hai thứ khó nhất: khoá và chốt chống lùi. Thứ đáng chép từ chương này sang: <strong>kiểm trước khi tráo</strong> và <strong>quay lui tự động</strong> khi smoke hỏng.') },

  /* ───── 15.4 ───── */
  /* 23 */ { t: 'CI đỏ: đọc bốn lớp từ ngoài vào, dừng khi đã có câu trả lời', body: two(
    table(['Lớp', 'Ở đâu', 'Ví dụ thật (run 36075106581)'], [
      ['1 · Annotation', 'trang tóm tắt run', '<code>CI chua xanh: … = success success failure</code>'],
      ['2 · Job nào', 'đồ thị job', 'test (22) ✗ · test (24) ✗ · lint/typecheck ✓'],
      ['3 · Bước nào', 'danh sách bước của job', '“Run npm test” — không phải setup, không phải DB'],
      ['4 · Dòng nào', 'log của bước (+ log service)', '<code>actual: soLich: \'1\'</code> vs <code>expected: 1</code>'],
    ], { sm: true }),
    list([
      'Lớp 2 đã cho nửa câu trả lời: <strong>cả hai</strong> phiên bản Node đỏ ⇒ không phải lỗi phiên bản; lint/typecheck xanh ⇒ không phải lỗi cú pháp.',
      'Đỏ ở “Initialize containers” ⇒ lỗi hạ tầng (kéo ảnh, health check), không phải mã.',
      'Test tích hợp đỏ khó hiểu ⇒ cuộn xuống khối <code>Print service container logs</code> cuối job.',
      'Không có log (“environment not found”, startup_failure) ⇒ đọc annotation của RUN, không phải của job.',
      'Chạy lại chỉ khi nghi hạ tầng — và ghi lại, vì “chạy lại cho xanh” là cách test chập chờn sống mãi.',
    ])) },

  /* 24 */ { t: 'Test chập chờn: 20/40 lần đỏ, thêm một await thì 0/40', body: two(
    yaml([['// nhac-lich-chap-chon.test.js', ''], ['const tt = { daGui: false };', ''], ['guiNhacLich(tt);', 'QUÊN await'], ['await new Promise(r => setTimeout(r, 50));', '“50 ms chắc đủ”'], ['assert.equal(tt.daGui, true);', 'mạng 20–80 ms'], ['', ''], ['// nhac-lich-da-sua.test.js', ''], ['await guiNhacLich(tt);', 'chờ đúng thứ cần chờ'], ['assert.equal(tt.daGui, true);', '']], { fs: 14.5 }) +
    t(['chap-chon: 20/40 lan DO', 'da-sua: 0/40 lan DO', 'do o lan thu 1:', '! AssertionError [ERR_ASSERTION]: Expected values', '!   to be strictly equal:  actual: false, expected: true'], 'run 36074955148 · job chap-chon', 14),
    list([
      'Test chập chờn không “thỉnh thoảng hỏng” — nó hỏng với <strong>một xác suất đo được</strong>. Chạy nó 40 lần trong một job (6 giây) là có con số.',
      'Nguyên nhân hay gặp: chờ bằng thời gian thay vì chờ sự kiện; phụ thuộc thứ tự test; dữ liệu dùng chung; đồng hồ thật.',
      'Quy trình: đo tỉ lệ → cách ly (<code>skip</code> có ghi issue, KHÔNG xoá) → sửa → đo lại 0/N.',
      '“Bấm Re-run cho xanh” biến 50% thành 25% rồi 12% — và biến CI thành thứ không ai tin.',
    ])) },

  /* 25 */ { t: 'Chi phí: kho public 0 phút tính tiền — kho private thì đếm theo job', body: two(
    kpis([{ v: '106s', l: 'một run CD (8 job)', c: 'blu' }, { v: '0', l: 'phút tính tiền (public)', c: 'grn' }, { v: '8', l: 'job ⇒ 8 lần làm tròn', c: 'amb' }, { v: '40s', l: 'xếp hàng chờ runner', c: 'red' }]) +
    box('info', '<code>actions_get … get_workflow_run_usage</code> cho run 36075733214: <code>UBUNTU total_ms: 0 · jobs: 8 · run_duration_ms: 106000</code>. Runner chuẩn miễn phí, không giới hạn cho kho public (docs, 09/2026).'),
    list([
      'Kho private tính theo phút <strong>của từng job</strong>, không theo thời gian run: 8 job ngắn tốn hơn 2 job dài cùng tổng thời gian.',
      'Gộp job nhỏ (<code>tong-hop-ngay-tho</code> chỉ để dạy — kho thật bỏ nó), <code>paths</code> cho PR tài liệu, <code>timeout-minutes</code> cho mọi job.',
      'Thời gian chờ runner cũng là chi phí — của người đợi: <code>tong-hop-ngay-tho</code> chờ 39 s (run 36074781609), <code>test (24)</code> chờ 40 s (run 36074887634).',
      'Đo trước: <code>gh run view --json jobs</code> hoặc API <code>/timing</code>; tối ưu job dài nhất trên đường găng, không phải job ngắn nhất.',
    ])) },

  /* 26 */ { t: 'Dọn dẹp: cache và artifact có hạn mức — xoá đúng thứ của mình', body: two(
    t(['$ gh api repos/$R/actions/cache/usage', 'tong: 5 cache, 560614647 byte', '$ gh cache list --json key,sizeInBytes …', '2001209   ch15-rac-36074955148', '10701     index-ch15-phong-kham-1-5c45fc59#1', '55585204  buildkit-blob-1-sha256:f7f2d3…', '8284393   node-cache-Linux-x64-npm-682e28bd…', '55602437  buildkit-blob-1-sha256:87919e…', '$ gh cache delete "ch15-rac-36074955148"', '+ con lai 0 cache ch15-rac-*', '$ gh api …/runs/36074955148/artifacts', '+ ch15-bao-cao  162 byte  het han 2026-09-25T23:53:33Z'], 'run 36074955148 · job don-dep', 13.5),
    list([
      '<code>cache/usage</code> báo “5 cache” trong khi danh sách có hơn 15 mục ch15 — API tổng hợp <strong>cập nhật trễ</strong>; tin danh sách.',
      'Xoá theo <strong>khoá chính xác</strong> của mình (<code>permissions: actions: write</code>) — không <code>gh cache delete --all</code> trên kho dùng chung.',
      '<code>retention-days: 1</code> cho artifact tạm: API ghi hạn đúng 24 giờ sau lúc tải lên.',
      'Mặc định giữ artifact + log 90 ngày; kho public chỉnh 1–90 ngày. Từ 01/10/2026 hạn này áp cả cho run, check, status (docs 09/2026).',
    ])) },

  /* 27 */ { t: 'Checklist sẵn sàng production: 12 dòng kiểm được', body: table(['#', 'Điều kiện', 'Kiểm bằng'], [
    ['1', 'Mọi job có <code>timeout-minutes</code>', '<code>grep -L timeout-minutes .github/workflows/*.yml</code> rỗng'],
    ['2', '<code>permissions</code> tối thiểu, khai ở mức job', 'Set up job in đúng quyền'],
    ['3', 'Action ghim SHA + Dependabot', 'Bài 12.4 — không còn <code>@v</code>'],
    ['4', 'Một check tổng hợp bắt buộc', 'PR đỏ không merge được'],
    ['5', 'Test tích hợp với DB thật', '<code>services:</code> + health check'],
    ['6', 'Ảnh dựng MỘT lần, tag SHA, có chữ ký', '<code>gh attestation verify</code>'],
    ['7', 'Deploy có khoá, không hủy giữa chừng', '<code>cancel-in-progress: false</code>'],
    ['8', 'Smoke test kiểm đúng phiên bản', '<code>/healthz</code> trả SHA'],
    ['9', 'Quay lui tự động, đã diễn tập', 'một run đỏ + production xanh'],
    ['10', 'Environment giới hạn nhánh + người duyệt', 'Settings → Environments'],
    ['11', 'Không secret thật trong log / mã', 'push protection, <code>***</code>'],
    ['12', 'Có người nhận thông báo khi đỏ', 'tóm tắt + kênh chat'],
  ], { sm: true }) },

  /* 28 */ { t: 'Sai lầm hay gặp ở Chương 15', body: cards([
    { ic: '⊘', t: 'Check bắt buộc bị skip', d: 'Job skip = Success. Dùng job tổng hợp <code>if: always()</code>.', c: 'red' },
    { ic: '🧊', t: 'Thêm cache không đo', d: '172 gói: cache chậm hơn 1,2 s. Bump version là miss.', c: 'amb' },
    { ic: '🏷', t: 'Deploy tag dời', d: '<code>latest</code>/<code>v1</code> không có địa chỉ để quay lui. Dùng <code>sha-</code>.', c: 'ora' },
    { ic: '✅', t: 'Build xanh = chạy được', d: 'CMD sai: CI, ảnh, chữ ký đều xanh. Chỉ smoke test bắt được.', c: 'vio' },
    { ic: '🧾', t: 'Environment không giới hạn nhánh', d: 'Job thử ghi “success” vào lịch sử production ⇒ quay lui về rác.', c: 'blu' },
    { ic: '⛓', t: 'Khoá CI theo ref trên push', d: 'Push liên tiếp vào main hủy CI của bản deploy trước.', c: 'pnk' },
  ], 3) },

  /* 29 */ { t: 'Bảng tra nhanh Chương 15', body: table(['Muốn', 'Viết / làm'], [
    ['DB thật cho test', '<code>services: postgres:</code> + <code>--health-cmd "pg_isready"</code>, <code>ports: [\'5432:5432\']</code>'],
    ['Hủy run cũ của PR', '<code>concurrency: ci-${{ github.event.pull_request.number || github.run_id }}</code>, <code>cancel-in-progress: true</code>'],
    ['Check bắt buộc', 'job <code>if: always()</code> đọc <code>join(needs.*.result, \' \')</code>'],
    ['Ảnh 2 kiến trúc', 'qemu + buildx, <code>platforms: linux/amd64,linux/arm64</code>, <code>cache-to: type=gha,mode=max</code>'],
    ['Tag', 'metadata-action: <code>type=sha,prefix=sha-</code> + semver; deploy <code>sha-</code>'],
    ['Chữ ký', '<code>actions/attest</code> + <code>id-token: write</code>; <code>gh attestation verify oci://…</code>'],
    ['Khoá deploy', '<code>concurrency: { group: production, cancel-in-progress: false }</code> ở job deploy'],
    ['Bản đang chạy', '<code>gh api …/deployments?environment=…&amp;ref=main</code> → state success mới nhất'],
    ['Quay lui', 'bước <code>if: failure() &amp;&amp; steps.smoke.outcome == \'failure\'</code>'],
    ['Dọn', '<code>gh cache delete &lt;key&gt;</code> (actions: write) · <code>retention-days:</code>'],
  ], { sm: true }) },

  /* 30 */ { t: 'Thực hành Chương 15: dựng lại cả pipeline trên app của bạn', body: two(list([
    '<strong>1.</strong> CI cho PR: lint + typecheck + test với DB service, ma trận 2 phiên bản, concurrency theo số PR, job <code>ci-ok</code>.',
    '<strong>2.</strong> CD trên push vào main: gọi lại CI (<code>workflow_call</code>) → dựng ảnh 2 kiến trúc, tag <code>sha-</code>, attestation.',
    '<strong>3.</strong> Deploy: environment <code>production</code> (giới hạn nhánh main), khoá <code>cancel-in-progress: false</code>, smoke kiểm phiên bản, tự quay lui.',
    '<strong>4.</strong> Cố ý làm hỏng một lần (CMD sai) và xem production tự về bản trước.',
    '<strong>5.</strong> Thêm badge vào README; làm bài thi 15.5.',
  ]), box('good', '<strong>Đạt khi</strong> có đủ bốn run để chỉ cho người phỏng vấn: một PR bị <code>ci-ok</code> chặn · một run bị hủy bởi concurrency · một deploy xanh có <code>phienBan</code> đúng SHA · một deploy đỏ mà production vẫn xanh.<br><br>Soi: <code>gh run list --workflow cd.yml</code> · <code>gh api …/deployments?environment=production</code>.')) },
]);
