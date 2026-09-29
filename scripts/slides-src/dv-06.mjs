/**
 * Deploy lên VPS · Deck dv-06 — Chương 6: Lùi bản, và thứ không lùi được.
 *
 * MỌI output terminal MỚI trên slide là output THẬT, chạy 29/09/2026 trong "VPS thí nghiệm" (hợp đồng mục 7b):
 *   • dv06-vps = container ubuntu:24.04 (arm64, Mac M1, --memory 512m): sshd, Node v18.19.1, PostgreSQL 16.15,
 *     nginx 1.24.0 (chạy bằng user deploy, cửa trước 127.0.0.1:3320) — SSH từ Mac qua 127.0.0.1:19062.
 *     lui.sh (symlink + khởi động lại + chờ /health), app-db.mjs (đọc cột qua psql), app-phien.mjs (phiên HMAC),
 *     do-63.sh (ghi_boi), do-64.sh (hộp gửi), lui-an-toan.sh (kiểm qua cửa trước).
 *   • dv06-dind = cùng ảnh, --privileged NGẮN hạn, dockerd 29.1.3 + compose 2.40.3 bên trong: ảnh mồ côi,
 *     docker tag cứu, build lại --no-cache, TAG theo phiên bản, prune; so kho ảnh overlay2 (cũ) với containerd (mặc
 *     định cho cài MỚI từ Engine 29). Docker lồng trong container trên Mac ⇒ giây của nó KHÔNG phải giây của VPS thật;
 *     số production (40 giây / 15 phút) lấy từ CLAUDE.md của dự án, không đo lại.
 *   • Prisma 5.22.0 trên Mac vào PostgreSQL của dv06-vps qua đường hầm ssh -L 19064: git revert xoá tệp migration,
 *     `migrate status` vẫn "up to date".
 * Output CŨ của chương (140 ms, 1.994 ms, 240 dòng, 1,287 ms, 90 lá thư, X-Cache HIT…) giữ nguyên từ bài học.
 *
 * Hình tự vẽ (SVG nội tuyến): conTro() thư mục bản + con trỏ hien-tai · tamLui() tầm lùi theo mở rộng/thu hẹp ·
 * motChieu() cánh cửa một chiều · chuoiDem() chuỗi bộ đệm trước người dùng.
 * Tô màu: sh() cho bash; conf() (chép từ dv-03) cho nginx.conf; js() cho mã Node; sql() cho SQL.
 */
import { S, cover, sh, term, mindmap, diagram, cards, box, steps, table, kpis, two, bars, code, sv, R, T, A, D, esc } from './_dv-chung.mjs';

export const deck = { key: 'dv-06', code: 'DEPLOY · CHƯƠNG 6', title: 'Lùi bản', sub: 'Deploy lên VPS · Chương 6' };

const FIX = '<style>.c-two>div>*+*{margin-top:12px}.bd>*+*{margin-top:12px}.c-t.sm{font-size:15px}.c-t.sm td,.c-t.sm th{padding:6px 10px}' +
  '.d-yml .c .nu{color:#b5cea8}.d-yml .c .sx{color:#c586c0}.d-yml .c .sec{color:#ff7b72;font-weight:700}' +
  '.l-sh .c .ty{color:#4ec9b0}.c-code{margin:0}</style>';

/* ─────────── tô màu cấu hình: unit systemd (ini) và nginx.conf — chép từ dv-03 (cùng khung .d-yml với yaml()) ─────────── */
const conf = (lines, { fs = 15, lang = 'ini' } = {}) => {
  const hl = (raw) => {
    const ci = raw.search(/(^|\s)#/);
    let body = raw, tail = '';
    if (ci >= 0) { const at = raw[ci] === '#' ? ci : ci + 1; tail = `<span class="cm">${esc(raw.slice(at))}</span>`; body = raw.slice(0, at); }
    let m;
    if (lang === 'ini') {
      if ((m = body.match(/^(\s*)(\[[^\]]+\])(.*)$/))) return `${m[1]}<span class="sec">${esc(m[2])}</span>${esc(m[3])}${tail}`;
      if ((m = body.match(/^(\s*)([A-Za-z]+)(=)(.*)$/))) {
        const v = esc(m[4]).replace(/(%[a-zA-Z])/g, '<span class="sx">$1</span>')
          .replace(/(&#39;[^&]*?&#39;|'[^']*')/g, '<span class="s">$1</span>')
          .replace(/\b(\d+(?:s|ms)?)\b/g, '<span class="nu">$1</span>');
        return `${m[1]}<span class="k">${esc(m[2])}</span>${m[3]}${v}${tail}`;
      }
      return esc(body) + tail;
    }
    // nginx: từ đầu dòng là chỉ thị
    if ((m = body.match(/^(\s*)([a-z_]+)(\s.*)?$/))) {
      const rest = esc(m[3] || '').replace(/("[^"]*")/g, '<span class="s">$1</span>')
        .replace(/(\d+\.\d+\.\d+\.\d+)(:\d+)?/g, '<span class="nu">$1$2</span>')
        .replace(/\b(http_\d{3}|error|timeout|off|on)\b/g, '<span class="sx">$1</span>')
        .replace(/(\$[a-z_]+)/g, '<span class="sx">$1</span>');
      return `${m[1]}<span class="k">${esc(m[2])}</span>${rest}${tail}`;
    }
    return esc(body) + tail;
  };
  return `<div class="d-yml" style="--fs:${fs}px">${lines.map((x) => {
    const [c, a] = Array.isArray(x) ? x : [x, ''];
    return `<div class="c">${hl(c) || ' '}</div><div class="a">${a ? esc(a) : ''}</div>`;
  }).join('')}</div>`;
};

/* ─────────── tô màu JavaScript kiểu VS Code (khung .l-sh của sh()) — chép từ dv-03 ─────────── */
const JKW = new Set(['const', 'let', 'if', 'return', 'new', 'await', 'async', 'function', 'else', 'true', 'false', 'import', 'from']);
const hlJs = (raw) => {
  const ci = raw.indexOf('//');
  const body = ci >= 0 ? raw.slice(0, ci) : raw;
  const tail = ci >= 0 ? `<span class="cm">${esc(raw.slice(ci))}</span>` : '';
  let out = '', i = 0, m;
  while (i < body.length) {
    const r = body.slice(i);
    if ((m = r.match(/^'[^']*'/)) || (m = r.match(/^"[^"]*"/))) { out += `<span class="st">${esc(m[0])}</span>`; i += m[0].length; continue; }
    if ((m = r.match(/^\d+/))) { out += `<span class="nu">${m[0]}</span>`; i += m[0].length; continue; }
    if ((m = r.match(/^[A-Za-z_][\w]*/))) {
      const w = m[0];
      const nx = body[i + w.length];
      out += JKW.has(w) ? `<span class="kw">${w}</span>` : nx === '(' ? `<span class="bi">${w}</span>` : /^(process|http|res|req|c|r|p)$/.test(w) ? `<span class="va">${w}</span>` : w;
      i += w.length; continue;
    }
    if ((m = r.match(/^(=>|===|&&|\|\||\?\?|\?\.|\?|:)/))) { out += `<span class="op">${esc(m[0])}</span>`; i += m[0].length; continue; }
    out += esc(body[i]); i++;
  }
  return out + tail;
};
const js = (lines, { fs = 15, so = true } = {}) =>
  `<div class="l-sh${so ? '' : ' nono'}" style="--fs:${fs}px">${lines.map((x, k) => {
    const [c, a] = Array.isArray(x) ? x : [x, ''];
    return `${so ? `<div class="n">${k + 1}</div>` : ''}<div class="c">${hlJs(c) || ' '}</div><div class="a">${a ? esc(a) : ''}</div>`;
  }).join('')}</div>`;

/** Khối SQL tô màu kiểu VS Code (highlight.js), cỡ chữ chỉnh được — như dv-05. */
const sql = (src, fs = 15) => code(src, 'sql').replace('<pre class="c-code">', `<pre class="c-code" style="font-size:${fs}px;line-height:1.45">`);

/* ─────────── Slide 3 — thư mục bản + con trỏ hien-tai: lùi = dời một con trỏ ─────────── */
const conTro = () => {
  let s = '';
  const ban = [['ban/v1/', 'bản cũ hơn', 'dim'], ['ban/v2/', 'bản TỐT gần nhất', 'grn'], ['ban/v3/', 'bản HỎNG vừa lên', 'red']];
  ban.forEach(([t, d, c], i) => {
    const x = 20 + i * 250;
    s += R(x, 20, 220, 96, { c, r: 12, fill: '#0d1420' });
    s += T(x + 110, 58, t, { fs: 19, a: 'middle', b: true, mono: true, c: c === 'dim' ? 'tx' : c });
    s += T(x + 110, 88, d, { fs: 14.5, a: 'middle', c: 'mu' });
  });
  s += T(20, 150, 'mỗi bản: đầy đủ, đã bung, không ai sửa (bất biến)', { fs: 14, c: 'dim' });
  // con trỏ
  s += R(270, 228, 220, 70, { c: 'dv', r: 12, fill: '#0b1826' });
  s += T(380, 258, 'hien-tai →', { fs: 19, a: 'middle', b: true, mono: true, c: 'dv' });
  s += T(380, 284, 'một symlink', { fs: 14, a: 'middle', c: 'mu' });
  s += `<path d="M430 228 L600 120" stroke="${D.red}" stroke-width="3" stroke-dasharray="8 6" fill="none" marker-end="url(#m-red)"/>`;
  s += T(560, 176, 'trước: v3', { fs: 14, c: 'red', b: true });
  s += `<path d="M380 228 L380 122" stroke="${D.grn}" stroke-width="3.5" fill="none" marker-end="url(#m-grn)"/>`;
  s += T(392, 190, 'sau khi lùi: v2', { fs: 14, c: 'grn', b: true });
  // tiến trình
  s += R(270, 340, 220, 70, { c: 'vio', r: 12, fill: '#120f22' });
  s += T(380, 370, 'node hien-tai/app.mjs', { fs: 15, a: 'middle', b: true, mono: true, c: 'vio' });
  s += T(380, 394, 'khởi động LẠI để nhặt mã mới', { fs: 13.5, a: 'middle', c: 'mu' });
  s += A(380, 338, 380, 302, { c: 'vio', sw: 2.5 });
  // bên phải: hai cách về bản cũ
  s += R(800, 20, 340, 180, { c: 'grn', r: 14, fill: 'rgba(63,185,80,.07)' });
  s += T(820, 54, 'LÙI = trỏ lại', { fs: 19, b: true, c: 'grn' });
  s += T(820, 86, '1. mv -Tf một symlink', { fs: 15, mono: true });
  s += T(820, 112, '2. khởi động lại tiến trình', { fs: 15 });
  s += T(820, 138, '3. chờ /health trả 200', { fs: 15 });
  s += T(820, 176, 'mili giây → vài trăm ms', { fs: 15, b: true, c: 'grn' });
  s += R(800, 230, 340, 180, { c: 'red', r: 14, fill: 'rgba(255,92,108,.07)' });
  s += T(820, 264, 'DỰNG LẠI = làm từ đầu', { fs: 19, b: true, c: 'red' });
  s += T(820, 296, '1. git clone / checkout', { fs: 15, mono: true });
  s += T(820, 322, '2. npm ci + build', { fs: 15, mono: true });
  s += T(820, 348, '3. chuyển lên, rồi mới trỏ', { fs: 15 });
  s += T(820, 386, 'giây → phút, lúc web đang hỏng', { fs: 15, b: true, c: 'red' });
  return sv(1150, 420, s);
};

/* ─────────── Slide 14 — tầm lùi: bản nào còn chạy được với lược đồ HÔM NAY ─────────── */
const tamLui = () => {
  let s = '';
  const x0 = 170, cw = 150;
  const bans = ['v1', 'v2', 'v3', 'v4', 'v5', 'v6'];
  s += T(0, 40, 'bản phát hành', { fs: 14, c: 'mu' });
  bans.forEach((b, i) => { s += R(x0 + i * cw, 16, cw - 20, 40, { c: 'dim', r: 8, fill: '#0d1420' }) + T(x0 + i * cw + (cw - 20) / 2, 43, b, { fs: 17, a: 'middle', b: true, mono: true }); });
  // mốc lược đồ
  s += `<path d="M${x0 + 2 * cw - 10} 66 L${x0 + 2 * cw - 10} 250" stroke="${D.blu}" stroke-width="3"/>`;
  s += T(x0 + 2 * cw - 4, 84, 'v3 MỞ RỘNG: thêm ho_ten, giữ ten', { fs: 14, c: 'blu', b: true });
  s += `<path d="M${x0 + 5 * cw - 10} 66 L${x0 + 5 * cw - 10} 250" stroke="${D.red}" stroke-width="3"/>`;
  s += T(x0 + 5 * cw - 16, 84, 'v6 THU HẸP: xoá ten', { fs: 14, c: 'red', b: true, a: 'end' });
  // hàng 1: đang chạy v5 (trước thu hẹp)
  s += T(0, 136, 'đang ở v5', { fs: 15, b: true }) + T(0, 156, 'lược đồ: ten + ho_ten', { fs: 12.5, c: 'mu' });
  bans.slice(0, 5).forEach((b, i) => {
    const ok = true;
    s += R(x0 + i * cw, 116, cw - 20, 44, { c: ok ? 'grn' : 'red', r: 8, fill: 'rgba(63,185,80,.14)', sw: 2 }) + T(x0 + i * cw + (cw - 20) / 2, 144, i === 4 ? 'đang chạy' : '✓ lùi được', { fs: 14, a: 'middle', c: 'grn', b: true });
  });
  // hàng 2: đang chạy v6 (sau thu hẹp)
  s += T(0, 216, 'đang ở v6', { fs: 15, b: true }) + T(0, 236, 'lược đồ: chỉ ho_ten', { fs: 12.5, c: 'mu' });
  bans.slice(0, 6).forEach((b, i) => {
    const ok = i >= 2;
    s += R(x0 + i * cw, 196, cw - 20, 44, { c: ok ? 'grn' : 'red', r: 8, fill: ok ? 'rgba(63,185,80,.14)' : 'rgba(255,92,108,.14)', sw: 2 }) +
      T(x0 + i * cw + (cw - 20) / 2, 224, ok ? (i === 5 ? 'đang chạy' : '✓ lùi được') : '✗ đọc ten', { fs: 14, a: 'middle', c: ok ? 'grn' : 'red', b: true });
  });
  s += T(x0, 290, 'Tầm lùi KHÔNG do số thư mục giữ trên đĩa quyết định — nó bắt đầu từ bản MỞ RỘNG gần nhất.', { fs: 15, c: 'amb', b: true });
  return sv(1150, 300, s);
};

/* ─────────── Slide 19 — cánh cửa một chiều ─────────── */
const motChieu = () => {
  let s = '';
  s += R(0, 0, 470, 410, { c: 'grn', r: 16, fill: 'rgba(63,185,80,.06)' });
  s += T(24, 38, 'TRONG MÁY BẠN — lùi được', { fs: 18, b: true, c: 'grn' });
  const trong = [['mã nào đang chạy', '140 ms (6.1)'], ['cấu hình .env', 'lùi RIÊNG, trục thứ hai'], ['hình dạng lược đồ', 'chỉ khi đã mở rộng trước (6.2)'], ['dòng bản hỏng đã ghi', 'sửa được NẾU tìm ra (6.3)'], ['bộ đệm nginx của bạn', 'rm -rf + reload: 7 ms (6.5)']];
  trong.forEach(([t, d], i) => { s += T(24, 84 + i * 64, t, { fs: 16.5, b: true }) + T(24, 106 + i * 64, d, { fs: 14, c: 'mu' }); });
  // cánh cửa
  s += R(505, 60, 120, 290, { c: 'amb', r: 10, fill: '#1a1406', sw: 3 });
  s += `<circle cx="605" cy="150" r="7" fill="${D.amb}"/>`;
  s += T(565, 40, 'CỬA', { fs: 16, a: 'middle', b: true, c: 'amb' });
  s += `<path d="M470 205 L660 205" stroke="${D.red}" stroke-width="5" fill="none" marker-end="url(#m-red)"/>`;
  s += T(565, 385, 'ra thì được,', { fs: 14, a: 'middle', c: 'mu' }) + T(565, 404, 'vào lại thì không', { fs: 14, a: 'middle', c: 'mu' });
  s += `<path d="M665 250 L480 250" stroke="${D.dim}" stroke-width="2.5" stroke-dasharray="7 6" fill="none"/>`;
  s += T(565, 272, '✗', { fs: 20, a: 'middle', b: true, c: 'red' });
  s += R(670, 0, 480, 410, { c: 'red', r: 16, fill: 'rgba(255,92,108,.06)' });
  s += T(694, 38, 'ĐÃ RA NGOÀI — không lùi được', { fs: 18, b: true, c: 'red' });
  const ngoai = [['email đã phát', 'đo: gửi 90, sau khi lùi vẫn 90'], ['tiền đã thu / webhook đã bắn', 'hoàn tiền là giao dịch MỚI'], ['phiên do bản mới cấp', 'bản cũ không đọc ⇒ đăng xuất'], ['CDN + trình duyệt đã đệm', 'chỉ xoá qua API / phải CHỜ'], ['tệp đã xoá khỏi kho đối tượng', 'mất, trừ khi bật versioning TRƯỚC']];
  ngoai.forEach(([t, d], i) => { s += T(694, 84 + i * 64, t, { fs: 16.5, b: true }) + T(694, 106 + i * 64, d, { fs: 14, c: 'mu' }); });
  return sv(1150, 412, s);
};

/* ─────────── Slide 24 — chuỗi bộ đệm đứng trước người dùng ─────────── */
const chuoiDem = () => diagram({
  w: 1150, h: 250,
  nodes: [
    { id: 'a', x: 0, y: 70, w: 190, h: 90, t: 'app :3300', d: 'đã lùi về v1 ✓', c: 'grn', mono: true },
    { id: 'n', x: 290, y: 70, w: 230, h: 90, t: 'nginx proxy_cache', d: 'của BẠN: rm -rf + reload\nđo: 7 ms', c: 'dv' },
    { id: 'c', x: 620, y: 70, w: 230, h: 90, t: 'CDN', d: 'của NHÀ CUNG CẤP:\ngọi API purge', c: 'amb' },
    { id: 'b', x: 950, y: 70, w: 200, h: 90, t: 'trình duyệt', d: 'của NGƯỜI DÙNG:\nchỉ CHỜ max-age', c: 'red' },
  ],
  edges: [
    { from: 'a', to: 'n', t: 'v1', c: 'grn' },
    { from: 'n', to: 'c', t: 'v3?', c: 'amb' },
    { from: 'c', to: 'b', t: 'v3?', c: 'red' },
  ],
});

export const slides = S([
  cover({ t: 'Chương 6 — Lùi bản, và thứ không lùi được', sub: 'lùi = trỏ lại thứ đã chạy · ảnh Docker cũ và ảnh mồ côi · cú lùi nói dối · dữ liệu bản hỏng đã ghi · cánh cửa một chiều · chứng minh qua cửa trước', chap: 'CHƯƠNG 6' }),

  { t: 'Bản đồ chương: dừng đồng hồ, rồi đếm thiệt hại', body: mindmap('Lùi bản', 'nhanh thì dễ — đủ mới khó', [
    { t: '6.1 Cú lùi chạy được', d: 'symlink ~150 ms · dựng lại chậm gấp nhiều lần · ảnh cũ, docker tag, TAG theo phiên bản', c: 'grn' },
    { t: '6.2 Cú lùi nói dối', d: '/health 200, request thật 500 · git revert ≠ lùi CSDL · tầm lùi', c: 'amb' },
    { t: '6.3 Thứ bản hỏng đã ghi', d: '240 dòng ở lại · cửa sổ thời gian dính người vô tội · ghi_boi · DROP COLUMN', c: 'red' },
    { t: '6.4 Cửa một chiều', d: 'email, tiền, webhook · phiên đăng nhập · tệp tải lên · hộp gửi', c: 'vio' },
    { t: '6.5 Chứng minh', d: 'bộ đệm vẫn phục vụ bản cũ · kiểm PHIÊN BẢN qua cửa trước · lùi hay đi tới', c: 'blu' },
    { t: 'Chuyện thật', d: 'ảnh mồ côi: 40 giây thay vì 15 phút · "revert code không revert CSDL"', c: 'tea' },
  ]) },

  /* ───────────── 6.1 cú lùi chạy được ───────────── */
  { t: 'Lùi bản là trỏ lại thứ đã chạy được', body: `
    ${conTro()}
    ${box('info', 'Toàn bộ tốc độ của cú lùi đến từ một quyết định làm <strong>TRƯỚC</strong> sự cố: giữ lại <strong>tạo tác</strong> (thư mục bản, ảnh Docker) chứ không chỉ giữ mã nguồn để dựng lại.')}` },

  { t: 'Đo thật: lùi trọn vẹn dưới 250 ms', body: `
    ${sh([
      ['GOC=${GOC:-~/lui}; DICH=${1:?dung: lui.sh <ban>}', 'bản đích, bắt buộc'],
      ['[ -d "$GOC/ban/$DICH" ] || { echo "KHONG co ban ..." >&2; exit 2; }', 'đích không có ⇒ thoát 2'],
      ['ln -sfn "$GOC/ban/$DICH" "$GOC/ht.moi" && mv -Tf "$GOC/ht.moi" "$GOC/hien-tai"', 'rename(2): nguyên tử'],
      ['for p in $(ss -ltnp | grep \':3300 \' | ...); do kill -TERM "$p"; done', 'giết theo CỔNG'],
      ['CONG=3300 setsid nohup node "$GOC/hien-tai/app.mjs" >"$GOC/app.log" 2>&1 &', 'chạy bản đích'],
      ['until [ "$(curl -s -o /dev/null -w \'%{http_code}\' .../health)" = 200 ]; do sleep 0.02; done', 'chờ TRẢ LỜI'],
    ], { fs: 13.5 })}
    ${term([
      '$ ./lui.sh v2',
      'symlink 3 ms | khoi dong 27 ms | san sang 218 ms | dang phuc vu: v2',
      '$ ./lui.sh v1',
      'symlink 3 ms | khoi dong 24 ms | san sang 189 ms | dang phuc vu: v1',
      '$ ./lui.sh v3',
      'symlink 2 ms | khoi dong 24 ms | san sang 157 ms | dang phuc vu: v3',
      '$ ./lui.sh v9; echo "ma thoat: $?"',
      "! KHONG co ban 'v9'. Co: v1 v2 v3 ",
      'ma thoat: 2',
    ], { title: 'dv06-vps (Ubuntu 24.04, Node 18) — output thật · lui.sh trích', fs: 13.5 })}` },

  { t: 'Về bản cũ: đo bằng mili giây hay bằng phút', body: two(
    table(['Cách về bản cũ', 'Đo ở đâu', 'Thời gian'], [
      ['Đổi symlink', 'VPS thí nghiệm', '+2–4 ms'],
      ['Symlink + khởi động + chờ /health', 'VPS thí nghiệm', '+157–218 ms'],
      ['Dựng lại dự án 83 gói (clone + npm ci + tsc)', 'hộp cát của bài', '!1.994 ms'],
      ['Đổi <code>TAG=v1</code>, <code>compose up --no-build</code>', 'Docker lồng trong lab', '+3,6 s'],
      ['<code>docker tag</code> ảnh mồ côi + <code>up</code>', 'Docker lồng trong lab', '+10,8 s'],
      ['<code>git revert</code> + build <code>--no-cache</code> + <code>up</code>', 'Docker lồng trong lab', '-<span>30,5 s</span>'],
      ['Tag lại ảnh cũ trên VPS thật', 'CLAUDE.md của dự án', '+~40 giây'],
      ['Dựng lại trên VPS thật', 'CLAUDE.md của dự án', '-~15 phút'],
    ], { sm: true }),
    `${box('warn', '<strong>Dự án thử là cái SÀN.</strong> 83 gói so với 897 + 1.159 gói của kho thật, và <code>next build</code> chứ không phải <code>tsc</code>. Tỷ số cần nhớ: <strong>mili giây/giây</strong> so với <strong>phút</strong> — trong lúc web đang hỏng.')}
    ${box('info', 'Docker lồng trong container trên Mac: giây của nó chậm và dao động (10,8–16,6 s cho cùng một cú tag). Đọc <strong>tỷ lệ</strong>, đừng chép con số sang VPS của bạn.')}`, 'l') },

  { t: 'Build đè tag latest: ảnh cũ thành mồ côi', body: two(
    term([
      '$ bash do-anh.sh     # kho ảnh overlay2 (kiểu cũ)',
      '=== 1. build v1, cache SACH (keo node:22-alpine + npm install) ===',
      '  build v1: 28225 ms',
      '  dang phuc vu: v1',
      '=== 2. build v2 (co bug) CUNG TAG latest, trao ===',
      '  build v2: 665 ms',
      '  dang phuc vu: v2',
      '=== 3. anh v1 gio o dau? ===',
      'IMAGE        ID             DISK USAGE   CONTENT SIZE   EXTRA',
      '+ <untagged>   e2b6a7a92107        510MB             0B',
    ], { title: 'dv06-dind — dockerd 29.1.3, driver overlay2', fs: 13 }),
    `${term([
      '$ docker info | grep -A1 "Storage Driver"',
      ' Storage Driver: overlayfs',
      '  driver-type: io.containerd.snapshotter.v1',
      '$ bash do-anh.sh     # cùng kịch bản, kho containerd',
      '=== 3. anh v1 gio o dau? ===',
      'IMAGE   ID             DISK USAGE   CONTENT SIZE   EXTRA',
      '# ↑ không còn dòng nào: không có ảnh mồ côi để cứu',
    ], { title: 'dv06-dind — kho ảnh containerd', fs: 13 })}
    ${box('warn', 'Kho <strong>containerd</strong> là mặc định cho bản cài MỚI từ Docker Engine 29 (tài liệu Docker, 09/2026). Máy nâng cấp từ bản cũ vẫn là overlay2. Cách cứu bằng ảnh mồ côi <strong>tuỳ vào điều đó</strong> — kiểm <code>docker info</code> trước khi cần.')}`) },

  { t: 'Cứu bằng docker tag: không build lại', body: two(
    `${sh([
      ['# 1) tìm ảnh cũ còn nằm trên máy', ''],
      ['docker images -a --filter dangling=true', 'đối chiếu ID, tuổi'],
      ['# 2) gắn lại tên mà compose đang dùng', ''],
      ['docker tag e2b6a7a92107 app-backend:latest', '47–654 ms'],
      ['# 3) tráo, KHÔNG build', ''],
      ['docker compose up -d --no-build backend', 'tạo lại container'],
      ['# 4) kiểm bằng request thật', ''],
      ['curl -s localhost:8080/', 'phải thấy v1'],
    ], { fs: 14.5 })}
    ${term([
      '=== 4. CUU: tag lai anh mo coi, trao KHONG build ===',
      '=   tag + up + cho v1: 10732 ms   dang phuc vu: v1',
      '=== 5. CACH KIA: build lai v1 tu git (git revert + build --no-cache) ===',
      '!   revert + build + up: 30472 ms',
    ], { title: 'dv06-dind — output thật', fs: 13 })}`,
    `${box('good', '<strong>Chuyện thật (18/08):</strong> build nhầm Dockerfile ⇒ backend restart vô tận, <strong>API 502 bảy phút</strong>. Ảnh cũ vẫn còn dạng mồ côi trên VPS ⇒ <code>docker tag</code> + <code>compose up --no-build</code>: <strong>~40 giây</strong>, thay vì dựng lại <strong>~15 phút</strong>.')}
    ${box('info', 'Trong lab: <code>docker tag</code> 47 ms, <code>compose up</code> xong ở 10.580 ms, v1 trả lời ở 10.790 ms. Gần hết thời gian là <strong>tạo lại container</strong>, không phải việc đổi tên.')}
    ${box('tip', 'Lệnh <code>up</code> phải chạy với <strong>đúng env của production</strong> (<code>set -a; . /opt/…/.env</code>) và đúng <code>-p</code> tên dự án compose.')}`, 'l') },

  { t: 'Ảnh mồ côi là may mắn, không phải kế hoạch', body: two(
    `${term([
      '$ docker images -a --filter dangling=true',
      'IMAGE        ID             DISK USAGE   CONTENT SIZE   EXTRA',
      '<untagged>   e9f547a42324        510MB             0B',
      '<untagged>   df56b958cc08        510MB             0B',
      '<untagged>   d3eedce8e4a3        510MB             0B',
      '<untagged>   e2b6a7a92107        510MB             0B',
      '# bốn ảnh, CÙNG 510MB — "đối chiếu kích thước" không phân biệt được',
    ], { title: 'dv06-dind — sau vài lần build đè', fs: 13 })}
    ${term([
      '$ docker image prune -f',
      'Deleted Images:',
      '! deleted: sha256:9df5f6c395ddfd320e627e670d3a37e896643a11e831763b3e422552ebf8af57',
      '! deleted: sha256:cd12032685f8b7ff577c6ca4f729003fd97332efdd5629f03d9ff7fedb9a6901',
      '',
      'Total reclaimed space: 0B',
    ], { title: 'dv06-dind — prune xoá chính thứ bạn định cứu', fs: 12 })}`,
    cards([
      { ic: '⚖️', t: 'Kích thước trùng nhau', d: 'Chỉ đổi mã ⇒ các bản nặng như nhau. Phải xem <strong>thời điểm</strong> hoặc nhãn phiên bản.', c: 'amb' },
      { ic: '🧹', t: 'Dọn đĩa xoá mất', d: '<code>docker image prune</code> xoá <strong>mọi</strong> ảnh mồ côi. Có job dọn đĩa định kỳ? Biết nó xoá gì TRƯỚC khi trông vào ảnh mồ côi.', c: 'red' },
      { ic: '📦', t: 'Kho containerd', d: 'Build đè tag không để lại ảnh mồ côi nào (slide trước).', c: 'vio' },
    ], 1), 'l2') },

  { t: 'Tag theo phiên bản: lùi = đổi một biến', body: two(
    `${sh([
      ['# build: MỖI bản một tag không bao giờ bị đè', ''],
      ['docker build -t app-backend:v2 \\', ''],
      ['  --label org.opencontainers.image.version=v2 .', 'nhãn chuẩn OCI'],
      ['# compose.yaml:  image: app-backend:${TAG:-latest}', ''],
      ['TAG=v2 docker compose up -d', 'deploy v2'],
      ['# lùi: đổi TAG, không build', ''],
      ['TAG=v1 docker compose up -d --no-build backend', '3,6 s trong lab'],
    ], { fs: 14 })}
    ${term([
      '=== dang chay app-backend:v2. LUI = doi TAG ===',
      '=   TAG=v1 up + cho v1: 3640 ms   dang phuc vu: v1',
      'REPOSITORY:TAG       IMAGE ID       CREATED',
      'app-backend:v2       84c5bb72ebf3   11 seconds ago',
      'app-backend:v1       a43b4700ed66   17 seconds ago',
      'app-backend:latest   b15c2180ac9c   3 minutes ago',
    ], { title: 'dv06-dind — output thật', fs: 13 })}`,
    `${box('good', 'Ảnh có tag thì <code>prune</code> không đụng tới — output ở slide trước: sau khi dọn, <code>v1</code> và <code>v2</code> vẫn còn nguyên.')}
    ${box('tip', 'Giữ N tag gần nhất trên VPS (và trên registry). Đích lùi là <strong>một cái tên</strong>, không phải một ID đi mò.')}
    ${box('warn', '<strong>Lùi tạo tác không lùi <code>.env</code>.</strong> Đo: v2 đổi <code>API_KEY</code> → <code>KHOA_API</code>, lùi về v1 ⇒ <code>API_KEY = undefined</code> ⇒ nổ lúc khởi động. Đổi tên biến cũng phải mở rộng–thu hẹp.')}`) },

  /* ───────────── 6.2 cú lùi nói dối ───────────── */
  { t: '/health 200, còn mọi request thật 500', body: two(
    term([
      '$ bash do-62.sh',
      '=== 1. v1 tren luoc do cu ===',
      '=   /health  200  ok',
      '=   /don     200  khach 1',
      '=== 2. deploy v2: doi ten cot roi trao ma ===',
      'ALTER TABLE',
      '=   /health  200  ok',
      '=   /don     200  khach 1',
      '=== 3. LUI ma ve v1, khong dung CSDL ===',
      '=   /health  200  ok',
      '!   /don     500  ERROR:  column "ten" does not exist',
    ], { title: 'dv06-vps — PostgreSQL 16.15, output thật', fs: 13.5 }),
    steps([
      ['v1 + lược đồ cũ', 'cột <code>ten</code> có, v1 đọc nó — khoẻ'],
      ['deploy v2: đổi tên cột + tráo mã', 'lược đồ và mã dời CÙNG nhau — khoẻ'],
      ['lùi MÃ về v1, lược đồ ở lại', 'v1 đọc <code>ten</code>, CSDL chỉ còn <code>ho_ten</code>'],
      ['script lùi bản in ✓', 'vì nó chỉ hỏi <code>/health</code>'],
    ]), 'l') },

  { t: 'Chốt kiểm sức khoẻ nông là có chủ đích', body: two(
    `${js([
      ['if (req.url === "/health") {', 'trả lời TRƯỚC mọi thứ'],
      ['  res.writeHead(200); return res.end("ok");', 'không CSDL, không cấu hình'],
      ['}', ''],
    ], { fs: 15 })}
    ${box('info', 'Vì sao nông: nếu <code>/health</code> gọi CSDL, một cú nấc 5 giây của CSDL ⇒ trình giám sát tưởng app chết ⇒ giết ⇒ <strong>vòng lặp khởi động lại</strong>.')}
    ${box('bad', '<code>SELECT 1</code> vẫn trượt: nó chạy mỹ mãn trên một lược đồ mà mã của bạn không đọc nổi.')}`,
    `${box('good', '<strong>Hai phép kiểm, hai chỗ:</strong><br>• <code>/health</code> nông — cho trình giám sát, gõ mỗi vài giây.<br>• <strong>phép kiểm khói</strong> gọi endpoint THẬT trên bảng THẬT — cho script deploy/lùi, chạy một lần sau mỗi lần đổi bản.')}
    ${box('tip', 'Smoke-test của dự án đang làm đúng việc đó: gõ các route thật; <strong>401/200 = có route</strong>, <strong>404 = ảnh cũ</strong>. Thêm vào đó một GET đọc bảng là bắt được lệch lược đồ.')}`) },

  { t: 'Thay đổi lược đồ nào lùi được', body: two(
    table(['Thay đổi', 'Lùi được?', 'Cái giá'], [
      ['Đổi tên một cột', '+được', 'một câu <code>RENAME</code> — đo ở 6.2'],
      ['Thêm một cột', '!được', 'xoá cột = mất thứ đã ghi vào đó'],
      ['Thêm <code>NOT NULL</code>', '!được', 'dòng bị từ chối lúc đó không quay lại'],
      ['Đổi kiểu <code>int → bigint</code>', '!đôi khi', 'chỉ khi chưa giá trị nào vượt khoảng cũ'],
      ['Xoá một cột', '-không', 'dữ liệu đi rồi (6.3)'],
      ['Gộp / tách bảng', '-không', 'nghịch đảo là một cuộc di trú riêng'],
    ], { sm: true }),
    `${box('good', '<strong>Luật:</strong> một migration an toàn để deploy khi bản phát hành <strong>TRƯỚC ĐÓ</strong> vẫn chạy được với lược đồ mới. Không phải bản hiện tại — bản TRƯỚC.')}
    ${box('info', 'Làm lại cùng kịch bản theo kiểu MỞ RỘNG (giữ <code>ten</code>, thêm <code>ho_ten</code>): v2 <code>/don 200</code>, lùi về v1 <code>/don 200</code> — đo trên dv06-vps.')}`, 'l') },

  { t: 'git revert xoá tệp migration, CSDL giữ cột', body: two(
    term([
      '$ git log --oneline',
      'fe90aec v42: doi don vi gia + them cot ghi_boi',
      'db72d38 v41: tinh gia',
      '$ git revert --no-edit HEAD',
      '[main 3f49440] Revert "v42: doi don vi gia + them cot ghi_boi"',
      ' Date: Tue Sep 29 13:38:56 2026 +0700',
      ' 2 files changed, 1 insertion(+), 2 deletions(-)',
      '!  delete mode 100644 prisma/migrations/20260929_them_cot/migration.sql',
    ], { title: 'Mac — kho thử trong thư mục nháp', fs: 13 }),
    `${term([
      '$ psql -d lab -c "\\d don"',
      '…',
      ' ghi_boi | text    |           |          | ',
      '$ npx prisma migrate status',
      '…',
      '1 migration found in prisma/migrations',
      '',
      '= Database schema is up to date!',
    ], { title: 'Prisma 5.22 → dv06-vps, thư mục v42 đã xoá', fs: 13 })}
    ${box('bad', '<strong>Revert code không revert CSDL</strong> — và công cụ còn báo xanh. Tệp migration đã deploy bị xoá (dự án CẤM việc này), sổ <code>_prisma_migrations</code> vẫn ghi v42 đã chạy.')}`, 'l') },

  { t: 'git revert và lùi ảnh là hai việc khác nhau', body: two(
    table(['', 'Lùi ảnh / symlink', 'git revert'], [
      ['Là gì', 'chạy lại tạo tác CŨ', 'một commit MỚI đảo ngược commit hỏng'],
      ['Nhanh', '+giây', '-phút: CI + build + deploy'],
      ['Nhánh <code>main</code>', '-vẫn chứa bug', '+sạch — deploy sau không mang bug lại'],
      ['CSDL', '-không đụng', '-không đụng (và có thể xoá tệp migration)'],
      ['Khi nào', 'đang cháy: DỪNG đồng hồ', 'ngay sau đó: sửa lịch sử cho đúng'],
    ], { sm: true }),
    `${steps([
      ['Lùi ảnh/symlink về bản tốt', 'hết cháy trong vài giây'],
      ['<code>git revert</code> commit hỏng trên <code>main</code>', 'để lần deploy kế tiếp không đưa bug trở lại'],
      ['Commit có migration? DỪNG, bàn trước', 'giữ tệp migration; viết migration MỚI nếu cần đảo lược đồ'],
      ['Kiểm lại: <code>migrate status</code> + <code>\\d bảng</code>', 'đừng tin mỗi dòng "up to date"'],
    ])}`, 'r') },

  { t: 'Tầm lùi đo bằng lược đồ, không bằng đĩa', body: `
    ${tamLui()}
    ${two(
      box('info', '<strong>Đo tầm lùi TRƯỚC khi cần:</strong> khởi động bản N−1 trên CSDL hiện tại rồi gõ một endpoint THẬT. Một lệnh <code>curl</code>.'),
      box('warn', 'Giữ 10 thư mục/ảnh trên đĩa mà đổi tên cột tại chỗ ⇒ tầm lùi = <strong>0</strong>. Mười bản kia chỉ để trang trí.'))}` },

  /* ───────────── 6.3 thứ bản hỏng đã ghi ───────────── */
  { t: 'Lùi bản cầm máu, không chữa vết thương', body: two(
    term([
      '=== ban HONG len song. Do luu luong that trong 20 giay ===',
      '  cua so: 18616 ms',
      ' dong_HONG | dong_dung | tong',
      '-----------+-----------+------',
      '!        240 |       500 |  740',
      '=== LUI: giet ban hong, dua ban dung len ===',
      '  ban moi tra: x-ban: v2',
      '  so_tien  | count',
      '-----------+-------',
      '    100000 |   531',
      '!  100000000 |   240',
    ], { title: 'hộp cát của bài — PostgreSQL 16.13', fs: 13 }),
    `${kpis([
      { v: '18,6 s', l: 'bản hỏng sống', c: 'amb' },
      { v: '12,9/s', l: 'dòng hỏng ghi mỗi giây', c: 'ora' },
      { v: '240', l: 'dòng ở LẠI sau cú lùi', c: 'red' },
    ])}
    ${box('warn', '<strong>Con số quyết định ngày của bạn:</strong> thời gian bản hỏng sống × số lệnh ghi mỗi giây. Hỏng 09:00, phát hiện 09:35, 50 lệnh ghi/giây ⇒ <strong>105.000 dòng</strong>.')}`, 'l') },

  { t: 'Tìm dòng hỏng: ba cách, ba độ chính xác', body: two(
    term([
      '$ bash do-63.sh',
      ' ghi_boi |  nguon  | count |  max',
      '---------+---------+-------+--------',
      ' v2      | dang-ky |    20 |      0',
      ' v2      | don     |    90 |    100',
      ' v3      | dang-ky |    10 |      0',
      '!  v3      | don     |    30 | 100000',
      '(4 rows)',
      '',
      '            cach             | dinh | that_su_hong',
      '-----------------------------+------+--------------',
      '!  cua so thoi gian            |   65 |           30',
      '+  ghi_boi = v3                |   40 |           30',
      '=  ghi_boi = v3 va nguon = don |   30 |           30',
      '(3 rows)',
    ], { title: 'dv06-vps — v3 hỏng ở /don; xanh/lam: v2 vẫn xả request', fs: 13 }),
    table(['Cách nhận dạng', 'Dính người vô tội', 'Điều kiện'], [
      ['Theo CỬA SỔ thời gian', '-<span>35 / 65</span>', 'lúc nào cũng có; đếm cả bản cũ đang xả'],
      ['Theo <code>ghi_boi</code>', '!10 / 40', 'phải đóng dấu TRƯỚC sự cố'],
      ['<code>ghi_boi</code> + đường ghi', '+0 / 30', 'dấu phiên bản + dấu nguồn'],
      ['Theo GIÁ TRỊ (<code>so_tien</code>)', '+0', 'chỉ khi lỗi để lại chữ ký viết ra SQL được'],
    ], { sm: true }), 'l') },

  { t: 'ghi_boi: đóng dấu phiên bản vào từng dòng', body: two(
    sql([
      'CREATE TABLE ghi (',
      '  id      bigserial PRIMARY KEY,',
      "  nguon   text NOT NULL,      -- 'don' | 'dang-ky'",
      '  so_tien int,',
      '  ghi_boi text NOT NULL',
      "          DEFAULT current_setting('application_name'),",
      '  luc     timestamptz NOT NULL DEFAULT clock_timestamp()',
      ');',
      '-- ứng dụng v3 kết nối với application_name = v3',
      "-- (psql: PGAPPNAME=v3; URL libpq: ?application_name=v3)",
      '',
      '-- sau sự cố: nhắm ĐÚNG thứ v3 ghi ở đường hỏng',
      'SELECT count(*) FROM ghi',
      " WHERE ghi_boi = 'v3' AND nguon = 'don';",
    ].join('\n'), 14),
    `${box('good', 'Vài byte mỗi dòng, thêm được ngay hôm nay. Tạo tác đã mang số phiên bản từ Chương 1 — đưa nó vào lệnh ghi là xong.')}
    ${box('tip', 'Với Prisma: ghi rõ trường <code>ghiBoi: process.env.BAN</code> trong mã — chắc chắn hơn phụ thuộc vào tham số kết nối.')}
    ${box('warn', 'Chỉ <code>ghi_boi</code> vẫn dính 10 dòng <code>dang-ky</code> vô tội, vì CÙNG bản v3 ghi chúng. Chính xác cần thêm <strong>đường ghi</strong>.')}`, 'l') },

  { t: 'DROP COLUMN 1,3 ms: nhanh nhất, một chiều', body: two(
    `${term([
      'alter table kh drop column dien_thoai;',
      'ALTER TABLE',
      '! Time: 1.287 ms',
      'alter table kh add column dien_thoai text;',
      '  tong  | con_du_lieu',
      '--------+-------------',
      '!  200000 |           0',
    ], { title: 'hộp cát — bảng 200.000 dòng', fs: 13.5 })}
    ${bars([
      { l: 'DROP COLUMN', sub: 'phá 200.000 số điện thoại', v: 1.287, txt: '1,287 ms', c: 'red' },
      { l: 'ADD COLUMN … gen_random_uuid()', sub: 'vô hại (Chương 5)', v: 2606, txt: '2.606 ms', c: 'grn' },
    ], { lw: 290 })}`,
    `${box('bad', 'Không có liên hệ nào giữa <strong>một migration chạy lâu bao nhiêu</strong> và <strong>nó phá tới đâu</strong>. "Xong ngay nên chắc chẳng làm gì" là bản năng phải bỏ.')}
    ${box('info', 'Bảng vẫn <strong>20 MB</strong> sau khi xoá: PostgreSQL chỉ sửa danh mục; byte cũ còn trong heap tới <code>VACUUM FULL</code> (239 ms). Đó là chẩn đoán, KHÔNG phải đường cứu — cứu là sao lưu (Chương 10).')}
    ${box('good', 'Thôi ghi → phát hành → chờ hết tầm lùi → mới xoá ở một bản SAU.')}`, 'l') },

  /* ───────────── 6.4 cửa một chiều ───────────── */
  { t: 'Cửa một chiều: thứ đã rời khỏi máy', body: `
    ${motChieu()}
    ${box('tip', 'Dấu hiệu nhận biết: nếu hoàn tác nó đòi hỏi <strong>một lời xin lỗi</strong>, thì nó là cửa một chiều — cần chuẩn bị TRƯỚC khi deploy.')}` },

  { t: 'Hộp gửi: không hoàn tác, mà thu hẹp cửa sổ', body: two(
    `${bars([
      { l: 'Gửi thẳng trong request', sub: 'lùi xong vẫn đã phát', v: 90, txt: '90 / 90 mất', c: 'red' },
      { l: 'Hộp gửi, thợ đang chạy', sub: 'lùi sau 1,6 s', v: 40, txt: '40 mất', c: 'amb' },
      { l: 'Hộp gửi, thợ chưa chạy', sub: 'bắt trước lượt rút đầu', v: 0.5, txt: '0 / 90', c: 'grn' },
    ], { lw: 250, max: 90 })}
    ${term([
      '$ bash do-64.sh     # 20 đơn, thợ chạy 2 lượt',
      'da gui (khong lay lai duoc): 10',
      '= huy y dinh chua gui        : 10',
    ], { title: 'dv06-vps — output thật', fs: 13 })}`,
    `${js([
      ['await c.query("begin");', ''],
      ['const r = await c.query(', ''],
      ['  "insert into dh (email) values ($1) returning id", [email]);', ''],
      ['// Ý ĐỊNH gửi nằm CÙNG giao dịch với đơn hàng', ''],
      ['await c.query("insert into hop_gui (den, than) values ($1, $2)",', ''],
      ['  [email, "don " + r.rows[0].id + " da dat"]);', ''],
      ['await c.query("commit");', 'cả hai, hoặc không gì'],
    ], { fs: 13, so: false })}
    ${box('warn', 'Thợ gửi RỒI mới đánh dấu ⇒ chết giữa hai bước là gửi hai lần. Chữa ở phía nhận: <strong>khoá bất biến</strong> (idempotency key).')}`) },

  { t: 'Phiên đăng nhập: bản cũ không đọc được', body: two(
    `${js([
      ['// v1 cấp { userId: 42 }; v2 đổi tên trường thành { sub: 42 }', ''],
      ['const id = BAN === "v1" ? p?.userId', 'v1 chỉ biết kiểu cũ'],
      ['                        : (p?.sub ?? p?.userId);', 'v2 đọc được cả hai'],
      ['if (!id) { res.writeHead(401); return res.end("chua dang nhap"); }', ''],
    ], { fs: 13 })}
    ${term([
      '$ bash do-phien.sh   # An đăng nhập lúc v1, Bình lúc v2',
      '=== dang chay v2 ===',
      '=   An  : 200 v2: xin chao nguoi dung 42',
      '=   Binh: 200 v2: xin chao nguoi dung 42',
      '=== da LUI ve v1 ===',
      '=   An  : 200 v1: xin chao nguoi dung 42',
      '!   Binh: 401 v1: chua dang nhap',
    ], { title: 'dv06-vps — cùng khoá ký, chỉ đổi hình dạng phiên', fs: 13 })}`,
    `${box('bad', 'Ai đăng nhập trong lúc bản mới sống thì bị <strong>đăng xuất</strong> khi lùi. Tệ hơn nếu bản mới <strong>đổi khoá ký</strong> JWT: mọi phiên cấp sau đó đều chết.')}
    ${box('good', '<strong>Chuẩn bị:</strong> bản mới phải ĐỌC được kiểu cũ (như v2 ở đây), và chỉ bắt đầu CẤP kiểu mới ở một bản sau — mở rộng–thu hẹp cho phiên.')}
    ${box('info', 'Tệp người dùng tải lên cũng vậy: lùi mã <strong>không xoá</strong> tệp đã tải, nhưng bản cũ có thể không hiển thị được định dạng/đường dẫn mà bản mới đặt ra.')}`, 'l') },

  { t: 'Lùi được, không lùi được, chuẩn bị gì', body: table(['Thứ', 'Lùi mã có lùi nó?', 'Chuẩn bị TRƯỚC khi deploy'], [
    ['Mã đang chạy', '+có — symlink/tag, giây', 'giữ N bản/tag; script lùi đã chạy thử'],
    ['Cấu hình <code>.env</code>', '-không — trục riêng', 'thêm tên mới, giữ tên cũ vài bản'],
    ['Migration đã chạy', '-không', 'mở rộng–thu hẹp; bản TRƯỚC chạy được với lược đồ mới'],
    ['Cột đã xoá', '-không bao giờ', 'xoá ở bản sau; sao lưu đã thử khôi phục'],
    ['Dòng bản hỏng đã ghi', '-không (ở lại nguyên)', 'cột <code>ghi_boi</code> + đường ghi'],
    ['Email / webhook / tiền đã đi', '-không', 'hộp gửi + khoá bất biến'],
    ['Phiên đăng nhập bản mới cấp', '-không — bản cũ từ chối', 'đọc được cả kiểu cũ/mới; không đổi khoá ký cùng lúc'],
    ['Tệp người dùng đã tải lên', '!còn nguyên — có thể không hiển thị', 'định dạng/đường dẫn mới đi sau khi bản cũ đọc được'],
    ['Bộ đệm nginx / CDN / trình duyệt', '-không — phục vụ bản cũ tiếp', 'HTML <code>no-store</code>; lệnh purge sẵn trong script'],
  ], { sm: true }) },

  /* ───────────── 6.5 chứng minh ───────────── */
  { t: 'Cửa sau đã v1, cửa trước vẫn v3', body: two(
    term([
      '=== 1. ban v3 dang phuc vu, bo dem da giu ban tra loi cua no ===',
      'x-ban: v3 X-Cache: HIT',
      'x-ban: v3 X-Cache: HIT',
      'x-ban: v3 X-Cache: HIT',
      '=== 2. LUI ve v1 (140ms, sach se) ===',
      '  cho san sang: 128 ms',
      '  TONG      : 142 ms   → dang phuc vu: v1',
      '=== 3. Hoi qua CUA SAU (thang app): ===',
      '=    v1',
      '=== 4. Hoi qua CUA TRUOC (qua bo dem) — nguoi dung thay gi? ===',
      '! x-ban: v3 X-Cache: HIT',
      '! x-ban: v3 X-Cache: HIT',
      '! x-ban: v3 X-Cache: HIT',
      '!    than: v3',
    ], { title: 'hộp cát của bài — nginx 1.24.0', fs: 12.5 }),
    `${conf([
      ['# ~/nx/nginx.conf trên dv06-vps (trích)', ''],
      ['proxy_cache_path /home/deploy/nx/cache', ''],
      ['                 keys_zone=dem:1m max_size=50m;', 'vùng đệm'],
      ['server {', ''],
      ['    listen 127.0.0.1:3320;', 'cửa TRƯỚC'],
      ['    location / {', ''],
      ['        proxy_pass        http://127.0.0.1:3300;', 'cửa SAU'],
      ['        proxy_cache       dem;', ''],
      ['        proxy_cache_valid 200 5m;', '5 phút'],
      ['        add_header        X-Cache $upstream_cache_status;', 'HIT/MISS'],
      ['    }', ''],
      ['}', ''],
    ], { fs: 12.5, lang: 'nginx' })}
    ${box('bad', 'Script lùi hài lòng vì nó hỏi <strong>cửa sau</strong>. Người dùng đi <strong>cửa trước</strong> — và nhận bản vừa bị lùi đi suốt 5 phút.')}`, 'l') },

  { t: 'Chuỗi bộ đệm: ai xoá được, mất bao lâu', body: `
    ${chuoiDem()}
    ${two(
      box('info', 'nginx mã nguồn mở KHÔNG có lệnh xoá một mục (<code>proxy_cache_purge</code> là bản thương mại) ⇒ <code>rm -rf cache/*</code> + <code>nginx -s reload</code>: thô, nhưng 7 ms.'),
      box('good', 'Dự án đang làm đúng chỗ khó nhất: <code>location /</code> trong nginx dán <code>no-store</code> lên HTML ⇒ trình duyệt không giữ trang cũ. Chỉ tài nguyên có mã băm mới đệm dài.'))}` },

  { t: 'Script lùi: kiểm PHIÊN BẢN qua cửa trước', body: `
    ${sh([
      ['set -euo pipefail', ''],
      ['GOC=~/lui; CUA_TRUOC=http://127.0.0.1:3320; BO_DEM=~/nx/cache', ''],
      ['DICH=${1:?dung: lui-an-toan.sh <ban>}', ''],
      ['[ -d "$GOC/ban/$DICH" ] || { echo "KHONG co ban ..." >&2; exit 2; }', 'đích lạ ⇒ 2'],
      ['~/lui.sh "$DICH" >/dev/null', '1) symlink + chờ /health'],
      ['if [ "${QUEN_DON:-0}" != 1 ]; then', ''],
      ['  rm -rf "${BO_DEM:?}"/*', '2) dọn bộ đệm'],
      ['  nginx -p ~/nx -c ~/nx/nginx.conf -s reload; sleep 0.3', ''],
      ['fi', ''],
      ['THAY=$(curl -s --max-time 3 "$CUA_TRUOC/")', '3) hỏi như NGƯỜI DÙNG'],
      ['[ "$THAY" = "$DICH" ] || { echo "  ✗ cua truoc van tra \'$THAY\'..." >&2; exit 3; }', 'so PHIÊN BẢN'],
      ['echo "  ✓ cua truoc tra \'$THAY\'"', ''],
    ], { fs: 13.5 })}
    ${two(box('good', '<strong>Bản rút gọn chạy trên dv06-vps.</strong> Nó từ chối đích lạ và in đích CÓ; phép kiểm cuối đi qua <strong>địa chỉ người dùng</strong> và so <strong>phiên bản</strong>. Bản đầy đủ trong bài thêm: chạy lại lần hai vô hại, khoá <code>flock</code> chống hai người lùi cùng lúc.'),
    box('tip', '<code>${BO_DEM:?}</code> — biến rỗng thì dừng, KHÔNG thành <code>rm -rf /*</code>. Bỏ dấu <code>:?</code> là một lần gõ sai tên biến đủ để xoá sạch máy.'), 'l')}` },

  { t: 'Kiểm lại bộ kiểm: quên dọn ⇒ thoát 3', body: two(
    term([
      '$ ./lui-an-toan.sh v3',
      "=   ✓ cua truoc tra 'v3'",
      '# hai lần curl qua cửa trước:',
      'x-ban: v3 X-Cache: HIT',
      'x-ban: v3 X-Cache: HIT',
      '=== lui ve v1, QUEN don bo dem ===',
      "!   ✗ cua truoc van tra 'v3', khong phai 'v1'",
      '  ma thoat: 3',
      '  cua sau (thang app): v1',
      '=== chay lai DAY DU ===',
      "=   ✓ cua truoc tra 'v1'",
      '  ma thoat: 0  (520 ms)',
    ], { title: 'dv06-vps — nginx 1.24.0 chạy bằng user deploy', fs: 13.5 }),
    `${box('good', 'Mã thoát 3 gọi tên CẢ HAI nửa của chỗ vênh: app chạy v1, người dùng thấy v3. Đó là khác biệt giữa script báo nó <strong>đã làm gì</strong> và script báo chuyện gì <strong>đã xảy ra</strong>.')}
    ${box('info', 'Một phép kiểm chưa ai thấy nó HỎNG thì chưa phải phép kiểm. Cố tình tắt bước 2 một lần, xem nó đỏ, rồi mới tin nó.')}`, 'l') },

  { t: 'Lùi lại hay đi tới?', body: two(
    steps([
      ['Bản trước còn chạy với lược đồ hôm nay? (6.2)', 'không ⇒ lùi mã sẽ mở thêm lỗi — cân nhắc đi tới'],
      ['Bản hỏng còn đang ghi thiệt hại từng giây? (6.3)', 'có ⇒ LÙI NGAY, sửa sau'],
      ['Lùi xong: kiểm qua cửa trước, dọn bộ đệm (6.5)', 'rồi mới báo "đã xong"'],
      ['Đếm thiệt hại: dòng hỏng, thư đã gửi, phiên bị đăng xuất (6.3–6.4)', 'danh sách việc sửa dữ liệu'],
      ['<code>git revert</code> trên <code>main</code>; sửa theo nhịp của mình', 'deploy kế tiếp không mang bug lại'],
    ]),
    `${kpis([
      { v: '0,15 s', l: 'lùi trọn (symlink)', c: 'grn' },
      { v: '0,5 s', l: 'kể cả kiểm qua cửa trước', c: 'tea' },
      { v: 'phút', l: 'viết + duyệt + deploy một cách sửa', c: 'red' },
    ])}
    ${box('warn', '"Đi tới" nghe chuyên nghiệp hơn — nhưng nó là canh bạc rằng bạn chẩn đoán đúng dưới áp lực. Lùi lại thì KHÔNG phải canh bạc: <strong>lùi trước, sửa sau</strong>.')}`, 'l') },

  /* ───────────── tổng kết ───────────── */
  { t: 'Sai lầm hay gặp ở Chương 6', body: table(['Triệu chứng', 'Nguyên nhân thật', 'Sửa'], [
    ['Script lùi in ✓, request thật vẫn 500', 'chỉ hỏi <code>/health</code> nông; lược đồ đã đi tiếp', 'smoke-test endpoint thật; mở rộng–thu hẹp'],
    ['Lùi xong mà người dùng vẫn thấy bản hỏng', 'bộ đệm nginx/CDN đứng trước', 'purge trong script + kiểm qua cửa trước'],
    ['Muốn lùi mà "không có bản để về"', 'luật giữ bản quá gắt / chỉ có tag <code>latest</code>', 'tag theo phiên bản, giữ N bản'],
    ['Ảnh mồ côi để cứu đã biến mất', '<code>docker image prune</code> hằng tuần / kho containerd', 'đừng dựa vào mồ côi — tag rõ ràng'],
    ['Lùi về bản cũ, nó chết lúc khởi động', '<code>.env</code> đã đổi tên biến', 'đổi tên biến theo kiểu mở rộng–thu hẹp'],
    ['Lùi xong, một nhóm người bị đăng xuất', 'bản mới cấp phiên kiểu mới', 'bản mới đọc cả kiểu cũ, cấp kiểu mới sau'],
    ['<code>git revert</code> xong, CSDL vẫn khác, Prisma báo xanh', 'revert xoá tệp migration, không đụng CSDL', 'giữ tệp; migration MỚI nếu cần đảo'],
    ['Dọn dữ liệu hỏng xoá cả dòng tốt', 'dọn theo cửa sổ thời gian', '<code>ghi_boi</code> + đường ghi'],
  ], { sm: true }) },

  { t: 'Bảng tra nhanh Chương 6 (1/2): lệnh lùi', body: sh([
    ['# symlink: đổi con trỏ NGUYÊN TỬ (Linux) — macOS: mv -fh thay cho mv -Tf', ''],
    ['ln -sfn ban/v2 ht.moi && mv -Tf ht.moi hien-tai', 'rename(2), không có khe hở'],
    ['readlink -f hien-tai', 'đang trỏ đâu?'],
    ['# Docker: tag theo phiên bản, lùi = đổi TAG', ''],
    ['TAG=v1 docker compose up -d --no-build backend', 'không build lại'],
    ['docker images -a --filter dangling=true', 'ảnh mồ côi còn không?'],
    ["docker image inspect -f '{{.Created}}' <ID>", 'ID nào là bản nào?'],
    ['docker tag <ID> app-backend:latest', 'cứu ảnh mồ côi'],
    ['docker info | grep -A1 "Storage Driver"', 'overlay2 hay containerd?'],
    ['# chứng minh cú lùi: qua CỬA TRƯỚC, so PHIÊN BẢN', ''],
    ['curl -s -D - -o /dev/null URL | grep -i x-', 'phiên bản + X-Cache'],
    ['curl -s -o /dev/null -w "%{http_code}" URL', '401/200 = có route, 404 = ảnh cũ'],
    ['rm -rf "${BO_DEM:?}"/* && nginx -s reload', 'dọn bộ đệm nginx'],
    ['# CSDL và lịch sử: revert KHÔNG đụng tới CSDL', ''],
    ['git revert --no-edit <sha>', 'commit mới, không --force'],
    ['npx prisma migrate status', 'đừng tin mỗi dòng này'],
    ['psql -c "\\d bang"', 'nhìn lược đồ THẬT'],
    ['psql -c "select ghi_boi, count(*) from t group by 1"', 'ai đã ghi gì'],
  ], { fs: 13.5 }) },

  { t: 'Bảng tra nhanh Chương 6 (2/2): trước khi deploy', body: two(
    table(['Câu hỏi trước mỗi lần deploy', 'Nếu "không"'], [
      ['Bản TRƯỚC có chạy được với lược đồ sau migration này?', '-tách migration (Ch5)'],
      ['Có tag/thư mục của bản trước trên máy chủ?', '-giữ lại trước khi tráo'],
      ['Script lùi đã chạy thử, kể cả lần CỐ TÌNH hỏng?', '-chạy thử trên VPS thí nghiệm'],
      ['Bản mới có đổi tên biến env / hình dạng phiên?', '!đọc cả hai kiểu trước'],
      ['Có email/webhook/thu tiền trong đường ghi mới?', '!hộp gửi + khoá bất biến'],
      ['Dòng mới có mang dấu phiên bản?', '!thêm <code>ghi_boi</code>'],
      ['HTML có <code>no-store</code>? purge CDN có sẵn trong script?', '-bộ đệm sẽ giữ bản hỏng'],
    ], { sm: true }),
    `${box('good', '<strong>Một câu cho cả chương:</strong> lùi bản dừng được đồng hồ trong mili giây — nhưng chỉ lấy lại được những gì còn nằm <strong>trong máy bạn</strong>, và chỉ khi bạn đã chuẩn bị <strong>trước</strong> sự cố.')}
    ${box('warn', 'Commit hỏng có migration ⇒ <strong>bàn với cả nhóm trước khi revert</strong>: revert mã không revert CSDL.')}`, 'l') },

  { t: 'Thực hành Chương 6 (45 phút): lùi, rồi đếm', body: `
    ${steps([
      'VPS thí nghiệm (Ubuntu + Node + PostgreSQL + nginx), bản v1–v3, <code>lui.sh</code>: ghi thời gian ba đoạn; <code>lui.sh v9</code> thoát 2',
      'Đổi tên cột rồi lùi mã: <code>/health</code> 200, <code>/don</code> 500 — làm lại theo mở rộng: toàn 200',
      'Bảng <code>ghi</code> có <code>ghi_boi</code>: bản hỏng ghi, bản cũ vẫn xả — ba cách dọn, ba con số "dính"',
      'Hộp gửi 20 đơn, thợ chạy 2 lượt rồi "lùi"; phiên do v2 cấp sau khi lùi về v1 — ai bị 401?',
      'nginx đệm 5 phút; <code>lui-an-toan.sh</code> có và không có bước dọn — thoát 3 khi quên, 0 khi đủ',
    ])}
    ${box('good', '<strong>Đạt khi:</strong> bạn điền được bảng "lùi được / không lùi được" bằng CON SỐ của chính máy mình, và script lùi của bạn đã từng đỏ đúng lúc — rồi đã dọn container, mạng, ảnh thử.')}` },
].map((s) => (s.kind === 'cover' ? s : { ...s, body: FIX + s.body })));
