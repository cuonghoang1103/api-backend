/**
 * Deploy lên VPS · Deck dv-03 — Chương 3: Bước tráo (đổi phiên bản mà không rơi request nào).
 *
 * MỌI output terminal MỚI trên slide là output THẬT, chạy 29/09/2026 trên "VPS thí nghiệm" = container
 * ubuntu:24.04 (arm64, nhân linuxkit của Docker Desktop trên Mac M1) tên dv03-vps chạy systemd 255 thật
 * (--privileged ngắn hạn, --memory 512m), SSH từ Mac qua 127.0.0.1:19032 bằng khoá tạo trong thư mục nháp.
 * Phần mềm: Node v18.19.1 (apt), nginx 1.24.0, curl 8.5.0. Ứng dụng thử app.mjs (khởi động 1,5 s, request 20 ms
 * hoặc 300/400 ms), client do.mjs bắn một request mỗi ~10 ms, mỗi request một kết nối mới (như curl), ghi thời
 * điểm + mã. Thêm một phép đo trên Mac (Node 22.21.0) cho phần keepalive.
 * Output CŨ của chương (168/514, 733/0, reusePort, 1.653/0, fd 9 giữ khoá) giữ nguyên từ bài học.
 *
 * Hình tự vẽ (SVG nội tuyến): dongTg() dòng thời gian hai lần tráo từ dữ liệu đo thật (bin 200 ms) ·
 * baCuaSo() ba cửa sổ rơi request · tinHieu() SIGTERM → hạn chót → SIGKILL · hosts() nginx giữ IP cũ.
 * Tô màu: sh() cho bash; conf() (trong deck này) cho unit systemd và nginx.conf; js() cho mã Node.
 */
import { S, cover, sh, term, mindmap, diagram, cards, box, steps, table, vs, kpis, two, bars, sv, R, T, A, D, esc } from './_dv-chung.mjs';

export const deck = { key: 'dv-03', code: 'DEPLOY · CHƯƠNG 3', title: 'Bước tráo', sub: 'Deploy lên VPS · Chương 3' };

const MONO = 'SF Mono,Menlo,monospace';
const FIX = '<style>.c-two>div>*+*{margin-top:12px}.c-t.sm{font-size:15px}.c-t.sm td,.c-t.sm th{padding:6px 10px}' +
  '.d-yml .c .nu{color:#b5cea8}.d-yml .c .sx{color:#c586c0}.d-yml .c .sec{color:#ff7b72;font-weight:700}' +
  '.l-sh .c .ty{color:#4ec9b0}</style>';

/* ─────────── tô màu cấu hình: unit systemd (ini) và nginx.conf — cùng khung .d-yml với yaml() ─────────── */
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
        .replace(/\b(http_\d{3}|error|timeout|off|on)\b/g, '<span class="sx">$1</span>');
      return `${m[1]}<span class="k">${esc(m[2])}</span>${rest}${tail}`;
    }
    return esc(body) + tail;
  };
  return `<div class="d-yml" style="--fs:${fs}px">${lines.map((x) => {
    const [c, a] = Array.isArray(x) ? x : [x, ''];
    return `<div class="c">${hl(c) || ' '}</div><div class="a">${a ? esc(a) : ''}</div>`;
  }).join('')}</div>`;
};

/* ─────────── tô màu JavaScript kiểu VS Code (khung .l-sh của sh()) ─────────── */
const JKW = new Set(['const', 'let', 'if', 'return', 'new', 'await', 'async', 'function', 'else', 'true', 'false', 'import', 'from']);
const hlJs = (raw) => {
  const ci = raw.indexOf('//');
  const body = ci >= 0 ? raw.slice(0, ci) : raw;
  const tail = ci >= 0 ? `<span class="cm">${esc(raw.slice(ci))}</span>` : '';
  let out = '', i = 0, m;
  while (i < body.length) {
    const r = body.slice(i);
    if ((m = r.match(/^'[^']*'/))) { out += `<span class="st">${esc(m[0])}</span>`; i += m[0].length; continue; }
    if ((m = r.match(/^\d+/))) { out += `<span class="nu">${m[0]}</span>`; i += m[0].length; continue; }
    if ((m = r.match(/^[A-Za-z_][\w]*/))) {
      const w = m[0];
      const nx = body[i + w.length];
      out += JKW.has(w) ? `<span class="kw">${w}</span>` : nx === '(' ? `<span class="bi">${w}</span>` : /^(process|http|res|req|sv|server)$/.test(w) ? `<span class="va">${w}</span>` : w;
      i += w.length; continue;
    }
    if ((m = r.match(/^(=>|===|&&|\|\||\?|:)/))) { out += `<span class="op">${esc(m[0])}</span>`; i += m[0].length; continue; }
    out += esc(body[i]); i++;
  }
  return out + tail;
};
const js = (lines, { fs = 15, so = true } = {}) =>
  `<div class="l-sh${so ? '' : ' nono'}" style="--fs:${fs}px">${lines.map((x, k) => {
    const [c, a] = Array.isArray(x) ? x : [x, ''];
    return `${so ? `<div class="n">${k + 1}</div>` : ''}<div class="c">${hlJs(c) || ' '}</div><div class="a">${a ? esc(a) : ''}</div>`;
  }).join('')}</div>`;

/* ─────────── Dữ liệu đo THẬT: số request theo từng khoảng 200 ms (do.mjs, VPS thí nghiệm, 29/09) ─────────── */
// mỗi phần tử: [ok_A, ok_B, hong] — "hong" là 502 (nginx), 500 (bản chưa ấm) tuỳ lần đo.
const NGAY_THO = [[17, 0, 0], [18, 0, 0], [14, 0, 0], [15, 0, 0], [14, 0, 0], [0, 0, 18], [0, 0, 18], [0, 0, 15], [0, 0, 17], [0, 0, 17], [0, 0, 15], [0, 0, 17], [0, 0, 15], [0, 17, 1], [0, 14, 0], [0, 17, 0], [0, 14, 0], [0, 16, 0], [0, 14, 0], [0, 16, 0], [0, 17, 0], [0, 16, 0], [0, 15, 0], [0, 14, 0], [0, 16, 0], [0, 15, 0], [0, 15, 0], [0, 15, 0], [0, 16, 0], [0, 15, 0]];
const XANH_LAM = [[17, 0, 0], [18, 0, 0], [15, 0, 0], [16, 0, 0], [15, 0, 0], [17, 0, 0], [18, 0, 0], [19, 0, 0], [18, 0, 0], [18, 0, 0], [18, 0, 0], [15, 0, 0], [15, 0, 0], [19, 0, 0], [1, 15, 0], [0, 16, 0], [0, 16, 0], [0, 14, 0], [0, 16, 0], [0, 16, 0], [0, 15, 0], [0, 18, 0], [0, 19, 0], [0, 18, 0], [0, 15, 0], [0, 16, 0], [0, 15, 0], [0, 16, 0], [0, 15, 0], [0, 15, 0]];
const RESTART = [[17, 0, 0], [15, 0, 0], [15, 0, 0], [17, 0, 0], [18, 0, 0], [0, 0, 17], [0, 0, 18], [0, 0, 17], [0, 0, 16], [0, 0, 17], [0, 0, 15], [0, 0, 16], [0, 0, 15], [0, 0, 15], [0, 0, 16], [0, 0, 16], [0, 0, 18], [0, 0, 17], [0, 0, 17], [0, 0, 16], [0, 0, 16], [0, 0, 13], [0, 0, 16], [0, 0, 10], [6, 0, 0], [15, 0, 0], [14, 0, 0], [15, 0, 0], [17, 0, 0], [18, 0, 0]];

/** Một làn dòng thời gian: cột xếp chồng mỗi 200 ms. */
const lan = (y, data, { ten, sub, moc = [], mauA = 'blu', mauB = 'grn', loi = 'red', nhanLoi = '502' }) => {
  const x0 = 240, bw = 26, H = 92, M = 20;
  let s = T(0, y + 34, ten, { fs: 16, b: true }) + T(0, y + 58, sub, { fs: 13.5, c: 'mu' });
  s += R(x0 - 6, y - 6, 30 * bw + 12, H + 12, { c: 'bd', fill: '#070b12', r: 8, sw: 1.2 });
  data.forEach(([a, b, h], i) => {
    const x = x0 + i * bw;
    let yy = y + H;
    [[a, mauA], [b, mauB], [h, loi]].forEach(([n, c]) => {
      if (!n) return;
      const hh = (n / M) * H;
      yy -= hh;
      s += `<rect x="${x + 2}" y="${yy.toFixed(1)}" width="${bw - 4}" height="${hh.toFixed(1)}" rx="2" fill="${D[c]}" opacity="${c === loi ? 0.95 : 0.8}"/>`;
    });
  });
  moc.forEach(([ms, t, c, dy = 0]) => {
    const x = x0 + (ms / 200) * bw;
    s += `<path d="M${x} ${y - 10} L${x} ${y + H + 8}" stroke="${D[c]}" stroke-width="2" stroke-dasharray="4 4"/>`;
    s += T(x + 5, y - 12 + dy, t, { fs: 12.5, c, b: true });
  });
  const hong = data.reduce((t, d) => t + d[2], 0), tong = data.reduce((t, d) => t + d[0] + d[1] + d[2], 0);
  s += T(x0 + 30 * bw + 16, y + 40, hong ? `${hong} ${nhanLoi}` : '0 lỗi', { fs: 20, b: true, c: hong ? 'red' : 'grn' });
  s += T(x0 + 30 * bw + 16, y + 62, `trên ${tong}`, { fs: 13.5, c: 'mu' });
  return s;
};
const dongTg = () => {
  let s = '';
  s += lan(30, NGAY_THO, { ten: 'A) Dừng rồi chạy', sub: 'kill A → chạy B', moc: [[1011, 'kill A', 'red'], [2651, 'B sẵn sàng', 'grn']] });
  s += lan(190, XANH_LAM, { ten: 'B) Xanh/lam', sub: 'B chạy song song', moc: [[1028, 'chạy B', 'grn'], [2708, 'reload', 'dv'], [3716, 'SIGTERM A', 'amb']] });
  s += lan(350, RESTART, { ten: 'C) Restart=on-failure', sub: 'app sập lúc 1 s', moc: [[1019, 'sập', 'red'], [4773, 'sống lại', 'grn', 0]] });
  const x0 = 240, bw = 26;
  for (let ms = 0; ms <= 6000; ms += 1000) { s += T(x0 + (ms / 200) * bw, 470, `${ms / 1000} s`, { fs: 13, c: 'mu', a: 'middle' }); }
  s += R(250, 486, 14, 14, { c: 'blu', fill: D.blu, r: 3, sw: 0 }) + T(270, 498, 'bản A trả 200', { fs: 13.5, c: 'mu' });
  s += R(400, 486, 14, 14, { c: 'grn', fill: D.grn, r: 3, sw: 0 }) + T(420, 498, 'bản B trả 200', { fs: 13.5, c: 'mu' });
  s += R(550, 486, 14, 14, { c: 'red', fill: D.red, r: 3, sw: 0 }) + T(570, 498, '502 từ nginx', { fs: 13.5, c: 'mu' });
  s += T(700, 498, 'mỗi cột = 200 ms · một request ~10 ms · mỗi request một kết nối mới', { fs: 13.5, c: 'dim' });
  return sv(1150, 506, s);
};

/* Ba cửa sổ rơi request trên một trục thời gian */
const baCuaSo = () => {
  let s = '';
  const y = 70, x0 = 40, W = 1070;
  s += A(x0, y + 92, x0 + W, y + 92, { c: 'dim', sw: 2 });
  const seg = (a, b, col, t, d1, d2, fix) => {
    s += R(a, y, b - a, 80, { c: col, r: 8, fill: 'rgba(255,255,255,.03)' });
    s += T((a + b) / 2, y + 34, t, { fs: 16, b: true, a: 'middle', c: col });
    s += T((a + b) / 2, y + 58, d1, { fs: 13.5, a: 'middle', c: 'mu' });
    s += T(a + 4, y + 122, d2, { fs: 14, c: 'tx' });
    s += T(a + 4, y + 144, fix, { fs: 14, c: col, b: true });
  };
  s += R(x0, y, 150, 80, { c: 'blu', r: 8, fill: 'rgba(88,166,255,.10)' }) + T(x0 + 75, y + 46, 'A phục vụ', { fs: 15, a: 'middle', b: true, c: 'blu' });
  seg(200, 420, 'amb', '① đang bay', 'A đã nhận, chưa trả', 'SIGKILL ⇒ ECONNRESET', 'sửa: tắt tử tế (3.2)');
  seg(430, 790, 'red', '② không ai nghe', 'A chết → B chưa listen', 'refused ⇒ 502 · 133 cái', 'sửa: chạy B TRƯỚC (3.3)');
  seg(800, 980, 'ora', '③ nghe mà chưa ấm', 'cổng mở, app chưa xong', '500 · 33 cái (đo)', 'sửa: chờ /health');
  s += R(990, y, 120, 80, { c: 'grn', r: 8, fill: 'rgba(63,185,80,.10)' }) + T(1050, y + 46, 'B phục vụ', { fs: 15, a: 'middle', b: true, c: 'grn' });
  s += T(x0, 36, 'một lần tráo ngây thơ, phóng to', { fs: 15, c: 'mu' });
  s += T(x0, 262, 'Rút ngắn khởi động chỉ làm ② NGẮN lại. Đổi THỨ TỰ thì ② biến mất: luôn có thứ đang nghe.', { fs: 15, c: 'amb', b: true });
  return sv(1150, 276, s);
};

/* SIGTERM → hạn chót → SIGKILL */
const tinHieu = () => {
  let s = '';
  const y = 10, x0 = 30;
  s += A(x0, y + 82, 1120, y + 82, { c: 'dim', sw: 2 });
  s += R(x0, y, 150, 60, { c: 'amb', r: 8 }) + T(x0 + 75, y + 36, 'SIGTERM', { fs: 17, b: true, a: 'middle', c: 'amb', mono: true });
  s += R(200, y, 480, 60, { c: 'grn', r: 8, fill: 'rgba(63,185,80,.08)' });
  s += T(440, y + 26, 'close() · phục vụ nốt · đóng pool · thoát 0', { fs: 15, a: 'middle', c: 'grn', b: true });
  s += T(440, y + 48, 'hạn chót CỦA BẠN (vd 10 s) — tự quyết bỏ gì', { fs: 13, a: 'middle', c: 'mu' });
  s += R(700, y, 200, 60, { c: 'dim', r: 8, dash: true }) + T(800, y + 36, 'chờ thêm…', { fs: 15, a: 'middle', c: 'mu' });
  s += R(920, y, 170, 60, { c: 'red', r: 8, fill: 'rgba(248,81,73,.12)' }) + T(1005, y + 36, 'SIGKILL', { fs: 17, b: true, a: 'middle', c: 'red', mono: true });
  s += T(x0, y + 112, 't = 0', { fs: 13, c: 'mu', mono: true }) + T(680, y + 112, 'hạn chót trong mã', { fs: 13, c: 'grn', a: 'end' });
  s += T(910, y + 112, 'TimeoutStopSec / --time', { fs: 13, c: 'red', a: 'end' });
  return sv(1150, 130, s);
};

/* /etc/hosts đổi nhưng nginx giữ IP đã phân giải lúc nạp */
const hosts = () => diagram({
  w: 1150, h: 250,
  nodes: [
    { id: 'c', x: 0, y: 90, w: 170, h: 70, t: 'client', d: 'curl :80', c: 'dim', mono: true },
    { id: 'n', x: 260, y: 80, w: 260, h: 90, t: 'nginx', d: 'đã phân giải ungdung-may\n= 127.0.0.2 LÚC NẠP', c: 'dv', mono: true },
    { id: 'a', x: 700, y: 10, w: 360, h: 80, t: 'A · 127.0.0.2:3101', d: 'đã SIGTERM — không ai nghe', c: 'red', mono: true, dash: true },
    { id: 'b', x: 700, y: 160, w: 360, h: 80, t: 'B · 127.0.0.3:3101', d: 'hosts trỏ đây — nginx chưa biết', c: 'grn', mono: true },
  ],
  edges: [
    { from: 'c', to: 'n', t: ':80', c: 'dim' },
    { from: 'n', to: 'a', t: '502 · 3,1 s', c: 'red' },
    { from: 'n', to: 'b', t: 'sau nginx -s reload', c: 'grn', dash: true, off: 34 },
  ],
});

export const slides = S([
  cover({ t: 'Chương 3 — Bước tráo', sub: 'dừng-rồi-chạy làm rơi gì · tắt tử tế · xanh/lam sau nginx · systemd Restart= · script tráo + smoke-test', chap: 'CHƯƠNG 3' }),

  { t: 'Bản đồ chương: LUÔN có thứ đang nghe', body: mindmap('Bước tráo', 'không rơi request nào', [
    { t: '3.1 Tráo ngây thơ', d: 'dừng rồi chạy · ba cửa sổ · đo bằng vòng request', c: 'red' },
    { t: '3.2 Tắt tử tế', d: 'SIGKILL · SIGTERM · close() · hạn chót', c: 'amb' },
    { t: '3.3 Xanh/lam', d: 'hai cổng sau nginx · chờ /health · reload', c: 'grn' },
    { t: '3.4 systemd', d: 'Restart= · StartLimit · TimeoutStopSec · app@', c: 'blu' },
    { t: '3.5 Script tráo', d: 'khoá · tự lùi · smoke-test 404', c: 'vio' },
    { t: 'Ch13: tráo container', d: 'IP đổi · reload nginx · compose', c: 'pnk' },
  ]) },

  /* ───────────── 3.1 ───────────── */
  { t: 'Dừng rồi chạy: 1,6 giây không ai trả lời', body: two(
    term([
      '$ bash A.sh   # kill bản A, chạy bản B (khởi động 1,5 s)',
      '# client gọi THẲNG cổng 3101',
      '  +1022ms  kill -TERM ban A',
      '  +1040ms  khoi dong ban B (KHOI=1500ms)',
      '  +2725ms  ban B san sang (cho 1679 ms)',
      '! tong: 534  200: 382  ECONNRESET: 3  ECONNREFUSED: 149',
      '  cua so hong: tu 1010ms den 2662ms (1652ms)',
      '# client gọi qua NGINX :80',
      '  +1011ms  kill -TERM ban A',
      '  +2651ms  ban B san sang (cho 1630 ms)',
      '! tong: 473  200: 340  502: 133',
      '  cua so hong: tu 1007ms den 2601ms (1594ms)',
    ], { title: 'VPS thí nghiệm — Ubuntu 24.04, Node 18, nginx 1.24', fs: 13 }),
    `${kpis([
      { v: '149', l: 'bị TỪ CHỐI — không mã HTTP', c: 'red' },
      { v: '133', l: '502 khi có nginx đứng trước', c: 'amb' },
      { v: '3', l: 'ECONNRESET — đang bay thì bị cắt', c: 'vio' },
    ])}
    ${box('info', 'Cùng một lỗ hổng, hai cái áo: không có proxy thì trình duyệt báo <strong>"không truy cập được"</strong>; có nginx thì người dùng thấy <strong>502 Bad Gateway</strong>. Độ dài lỗ hổng = thời gian khởi động của bản mới.')}`, 'l') },

  { t: 'Dòng thời gian: nơi request rơi', body: dongTg() },

  { t: 'Ba cửa sổ rơi request, ba cách sửa', body: baCuaSo() + two(
    term([
      '# ② chuyển sau "sleep 1" mà B chưa listen',
      '! tong: 455   200: 421   502: 34',
      '# ③ B listen ngay nhưng 1,5 s đầu trả 500',
      '! tong: 447   200: 414   500: 33',
    ], { title: 'VPS thí nghiệm — xanh/lam nhưng ĐOÁN bằng sleep', fs: 13.5 }),
    box('warn', 'Cửa sổ ③ <strong>vô hình</strong> nếu chỉ nhìn cổng: <code>ss -ltn</code> thấy cổng mở, proxy đẩy tới, app trả 500. Chỉ phép kiểm <code>/health</code> của chính app mới biết nó đã sẵn sàng.'), 'l') },

  { t: 'Bốn bước — và bản ngây thơ làm NGƯỢC', body: vs({
    no: { t: 'Ngây thơ: dừng → chạy → hy vọng', items: [
      '<strong>dừng</strong> A trước ⇒ không ai nghe',
      '<strong>chạy</strong> B, mất trọn thời gian khởi động',
      '<strong>hy vọng</strong> B ổn — không có phép kiểm',
      'B hỏng? A đã chết, <strong>không có đường lùi</strong>',
    ] },
    yes: { t: 'Đúng thứ tự: chạy → chờ → chuyển → dừng', items: [
      '<strong>1. chạy</strong> B SONG SONG, A vẫn phục vụ',
      '<strong>2. chờ</strong> <code>/health</code> của B trả 200 — không <code>sleep</code>',
      '<strong>3. chuyển</strong> một thao tác nguyên tử: <code>nginx -s reload</code>',
      '<strong>4. dừng</strong> A SAU CÙNG, bằng SIGTERM ⇒ A là đường lùi tới phút chót',
    ] },
  }) + box('good', 'Kubernetes, Docker Swarm, Heroku preboot, <code>pm2 reload</code> — tên khác nhau, đều là đúng bốn bước này. Học trên một VPS là học cả hình dạng chung.') },

  { t: 'Đo bằng vòng request, không bằng một curl', body: two(
    sh([
      ['#!/bin/bash  vong.sh URL GIAY', ''],
      ['HET=$(( $(date +%s%3N) + ${2:-6} * 1000 ))', 'mốc hết giờ (ms)'],
      ['T0=$(date +%s%3N)', ''],
      ['while [ "$(date +%s%3N)" -lt "$HET" ]; do', ''],
      ["  ma=$(curl -s -o /dev/null -w '%{http_code}' \\", 'chỉ lấy mã HTTP'],
      ['       --max-time 2 "$1")', '000 = không phản hồi'],
      ['  echo "$(( $(date +%s%3N) - T0 )) $ma"', 'thời điểm + mã'],
      ['done', ''],
    ], { fs: 13.5 }),
    `${term([
      '$ bash vong.sh http://127.0.0.1/ 5 > /tmp/vong.txt &',
      '# … trong lúc đó: kill bản A, chạy bản B …',
      "$ awk '{print $2}' /tmp/vong.txt | sort | uniq -c",
      '    121 200',
      '!    266 502',
      "$ awk '$2!=200' /tmp/vong.txt | sed -n '1p;$p'",
      '1005 502',
      '2615 502',
    ], { title: 'VPS thí nghiệm — vòng curl, ~13 ms/lần', fs: 13 })}
    ${box('bad', 'Một lệnh curl bắn lúc bạn chọn có ~1% cơ hội rơi trúng cửa sổ 1,6 s ⇒ "deploy mượt lắm" trong khi người dùng thấy 502. Lưu ý: 502 về NHANH hơn 200 nên chúng chiếm đa số dòng.')}`, 'l') },

  /* ───────────── 3.2 ───────────── */
  { t: 'Bốn cách dừng, cùng mười request đang bay', body: two(
    term([
      '$ bash B.sh   # 10 request /cham (400 ms), tín hiệu sau 150 ms',
      '# SIGKILL',
      '!  ma tra ve: 000 000 000 000 000 000 000 000 000 000',
      '# SIGTERM, KHÔNG có process.on(SIGTERM)',
      '!  ma tra ve: 000 000 000 000 000 000 000 000 000 000',
      '# SIGTERM, cờ xả trả 503',
      '!  ma tra ve: 503 503 503 503 503 503 503 503 503 503',
      '    [S] da dong sach sau 259ms',
      '# SIGTERM, close() + phục vụ nốt',
      '=  ma tra ve: 200 200 200 200 200 200 200 200 200 200',
      '    [S] da dong sach sau 272ms',
      '  socket con nghe cong 3107: 0',
    ], { title: 'VPS thí nghiệm — Node v18.19.1', fs: 13 }),
    `${bars([
      { l: 'SIGKILL', v: 10, txt: '10 × 000', c: 'red' },
      { l: 'SIGTERM, không bắt', v: 10, txt: '10 × 000', c: 'red' },
      { l: 'SIGTERM, cờ 503', v: 10, txt: '10 × 503', c: 'amb' },
      { l: 'SIGTERM, tử tế', v: 10, txt: '10 × 200', c: 'grn' },
    ], { lw: 170 })}
    ${box('warn', '<strong>Không bắt SIGTERM = như bị SIGKILL.</strong> Hành động mặc định của SIGTERM là kết thúc tiến trình; Node không tự "tắt tử tế" nếu bạn không viết.')}`, 'l') },

  { t: 'Bộ xử lý SIGTERM đúng: bốn phần', body: two(
    js([
      ["process.on('SIGTERM', () => {", ''],
      ['  dang_dong = true;', 'chỉ để thêm Connection: close'],
      ['  sv.close(() => {', '1. đóng socket NGHE ngay'],
      ["    db.end();  console.log('da dong sach');", '3. đóng pool, hàng đợi'],
      ['    process.exit(0);', ''],
      ['  });', '2. request đã nhận: làm nốt'],
      ['  setTimeout(() => {', '4. hạn chót của CHÍNH BẠN'],
      ["    console.log('het gio, thoat cung');", ''],
      ['    process.exit(1);', 'khác 0 ⇒ systemd biết'],
      ['  }, 10000).unref();', 'unref: không giữ tiến trình'],
      ['});', ''],
    ], { fs: 14 }),
    steps([
      ['Thôi nhận NGAY', '<code>server.close()</code> đóng socket nghe — đo: <code>socket: 0</code> khi 10 request còn đang trả lời'],
      ['Làm nốt, KHÔNG đổi', 'trả đúng phản hồi vốn sẽ trả — không 503, không cắt'],
      ['Đóng thứ không phải request', 'pool Postgres/Prisma, consumer hàng đợi, <code>setInterval</code>'],
      ['Có hạn chót, thoát khác 0', 'treo mãi còn tệ hơn tắt nhanh — tự chọn cái bị bỏ'],
    ]), 'r') },

  { t: 'Cờ xả đặt SAI chỗ: 10 cú 503', body: vs({
    no: { t: 'Bản đầu — kiểm cờ trong handler', items: [
      '<code>if (dang_dong) return res.writeHead(503)</code>',
      'request <strong>đã nhận</strong> vẫn bị đổi thành lỗi',
      'log nói "đã chờ 10 request, đóng sạch" — <strong>đúng</strong>',
      'người dùng: 10 trang lỗi — từ phía họ ≈ SIGKILL',
    ] },
    yes: { t: 'Bản sửa — cờ chỉ đổi header', items: [
      'trả đúng 200 như bình thường',
      'thêm <code>Connection: close</code> khi đang tắt',
      'client keepalive thôi gửi tiếp vào kết nối này',
      'đo: 10 × <strong>200</strong>, socket nghe đã biến mất',
    ] },
  }) + box('tip', 'Cờ 503 chỉ đúng ở <strong>/health</strong>: khi đang tắt, cho <code>/health</code> trả 503 để bộ cân bằng tải ngừng gửi request MỚI — còn request đã vào thì phục vụ nốt.') },

  { t: 'Cái gì giữ tiến trình lại khi tắt?', body: two(
    term([
      '# v18.19.1 · 1 kết nối keepalive NHÀN RỖI',
      '  ket noi ESTAB toi 3107 truoc SIGTERM: 1',
      '=  thoat sau 8ms',
      '# v22.21.0 (Mac) · cùng phép đo',
      '=    [S] da dong sach sau 1ms',
      "# v18.19.1 · 1 kết nối TCP 'trong' (chưa gửi gì)",
      '!  tien trinh thoat sau 10057ms',
      '!    [S] het gio sau 10000ms, thoat cung',
      "# … thêm closeIdleConnections()",
      '!  IDLE=1, TCP trong: thoat sau 10019ms',
    ], { title: 'VPS thí nghiệm + Mac — server.close() chờ ai?', fs: 13 }),
    `${table(['Kết nối', 'close() chờ?', 'Đo'], [
      ['keepalive rỗi (đã xong request)', '+không — đóng luôn', '1–8 ms'],
      ['request đang chạy', 'chờ làm xong', '259–272 ms'],
      ['TCP mở, chưa gửi đủ request', '-chờ tới hạn chót', '10 000 ms'],
    ], { sm: true })}
    ${box('info', 'Tài liệu Node: từ <strong>v19.0.0</strong> <code>close()</code> tự đóng kết nối rỗi; bản 18.19 của Ubuntu đo cũng đóng. Thứ còn giữ được tiến trình là kết nối <em>chưa thành request</em> — chỉ hạn chót (hoặc <code>closeAllConnections()</code>) cắt được.')}`, 'l') },

  { t: 'Ai gửi tín hiệu, bạn được bao lâu', body: tinHieu() + two(
    table(['Ai dừng', 'Gửi', 'Chờ trước khi SIGKILL'], [
      ['<code>systemctl stop</code>', '<code>KillSignal=</code> (SIGTERM)', '<code>TimeoutStopSec=</code>, mặc định 90 s'],
      ['<code>docker stop</code>', 'SIGTERM (hoặc <code>STOPSIGNAL</code>)', '10 s — <code>--time</code> / <code>stop_grace_period</code>'],
      ['<code>kill PID</code>', 'SIGTERM', 'không ai gửi SIGKILL hộ'],
      ['<code>kill -9 PID</code>', 'SIGKILL', '0 s — không mã nào được chạy'],
    ], { sm: true }),
    box('tip', 'Đặt hạn chót của trình giám sát <strong>nhỉnh hơn</strong> hạn chót trong mã (15 s &gt; 10 s) ⇒ mã của bạn quyết, không phải SIGKILL.') + box('warn', '<strong>Container:</strong> PID 1 là <code>sh -c "node …"</code> thì SIGTERM dừng ở shell ⇒ <code>docker stop</code> luôn mất đúng 10 s rồi SIGKILL. Sửa: <code>exec node …</code> hoặc <code>--init</code> (Ch13).'), 'l') },

  /* ───────────── 3.3 ───────────── */
  { t: 'Xanh/lam: cổng cố định thuộc về proxy', body: diagram({
    w: 1150, h: 330,
    nodes: [
      { id: 'u', x: 0, y: 125, w: 180, h: 80, t: 'người dùng', d: 'chỉ biết :80 / :443', c: 'dim' },
      { id: 'n', x: 290, y: 115, w: 250, h: 100, t: 'nginx :80', d: 'include upstream.conf\nTỆP DUY NHẤT deploy sửa', c: 'dv', mono: true },
      { id: 'a', x: 700, y: 20, w: 420, h: 90, t: 'XANH · app@3101 · bản A', d: 'đang phục vụ → xả → thoát', c: 'blu', mono: true },
      { id: 'b', x: 700, y: 220, w: 420, h: 90, t: 'LAM · app@3102 · bản B', d: 'chạy trước, nhận tải khi /health = 200', c: 'grn', mono: true },
    ],
    edges: [
      { from: 'u', to: 'n', t: 'HTTP', c: 'dim' },
      { from: 'n', to: 'a', t: 'trước reload', c: 'blu', dash: true },
      { from: 'n', to: 'b', t: 'sau reload', c: 'grn' },
    ],
  }) + box('tip', 'Không có màu nào "chính": lần sau tráo NGƯỢC lại. Script đọc <code>upstream.conf</code> để biết đang ở cổng nào, cổng còn lại là đích.') },

  { t: 'upstream.conf: tệp duy nhất lần deploy sửa', body: two(
    conf([
      ['# /srv/app/upstream.conf — deploy GHI ĐÈ tệp này', ''],
      ['upstream ungdung {', ''],
      ['    server 127.0.0.1:3102;', 'màu đang chạy'],
      ['    keepalive 16;', 'giữ 16 kết nối rỗi lên app'],
      ['}', ''],
      ['# /etc/nginx/conf.d/ungdung.conf — không bao giờ đổi', ''],
      ['include /srv/app/upstream.conf;', ''],
      ['server {', ''],
      ['    listen 80;', ''],
      ['    location / {', ''],
      ['        proxy_pass http://ungdung;', ''],
      ['        proxy_http_version 1.1;', 'bắt buộc cho keepalive'],
      ['        proxy_set_header Connection "";', 'xoá "close" của client'],
      ['        proxy_next_upstream error timeout;', 'mặc định: thử máy khác'],
      ['    }', ''],
      ['}', ''],
    ], { fs: 14, lang: 'nginx' }),
    table(['Chỉ thị', 'Làm gì'], [
      ['<code>upstream NAME { server … }</code>', 'bể backend; tên dùng trong <code>proxy_pass</code>'],
      ['<code>server … backup</code>', 'chỉ nhận khi máy chính hỏng'],
      ['<code>keepalive N</code>', 'giữ N kết nối rỗi mỗi worker'],
      ['<code>proxy_next_upstream</code>', 'lỗi nào thì thử máy khác (mặc định <code>error timeout</code>)'],
      ['<code>max_fails / fail_timeout</code>', 'bao nhiêu lỗi thì tạm gạch tên một máy'],
      ['<code>nginx -t</code> rồi <code>-s reload</code>', 'kiểm cú pháp, rồi nạp — worker cũ làm nốt việc'],
    ], { sm: true }), 'l') },

  { t: 'Cùng lần deploy, đổi thứ tự: 0 lỗi', body: two(
    term([
      '$ bash C1.sh',
      '# XANH/LAM sau nginx',
      '  +1028ms  1. khoi dong B tren 3102',
      '  +2699ms  2. B /health 200 (cho 1669 ms)',
      '  +2708ms  3. upstream → 3102, reload',
      '  +3716ms  4. SIGTERM A',
      '=  tong: 494   200: 494',
      '  phan bo ban: {"A":239,"B":255}',
    ], { title: 'VPS thí nghiệm — app khởi động 1,5 s như bản ngây thơ', fs: 14 }),
    `${bars([
      { l: 'Dừng rồi chạy', sub: 'qua nginx', v: 133, txt: '133 × 502', c: 'red' },
      { l: 'Xanh/lam', sub: 'chờ /health', v: 0.5, txt: '0 lỗi / 494', c: 'grn' },
      { l: '3 lần tráo + 1 lần lùi', sub: 'systemd, request 300 ms', v: 0.5, txt: '0 lỗi / 1.607', c: 'grn' },
    ], { lw: 190, max: 133 })}
    ${box('good', 'Ứng dụng KHÔNG nhanh hơn chút nào — vẫn 1,5 s. Thứ duy nhất đổi là thứ tự: trong 1,67 s B khởi động, A vẫn trả lời.')}`, 'l') },

  { t: 'Dừng bản cũ ngay sau reload: vẫn rơi', body: two(
    `${term([
      '$ bash C8.sh     # request 300 ms, SIGTERM bản cũ sau X giây',
      '!  cho 0 s sau reload roi SIGTERM ban cu → so 502 qua 3 lan: 9 8 9',
      '!  cho 0.05 s sau reload roi SIGTERM ban cu → so 502 qua 3 lan: 4 5 4',
      '+  cho 0.1 s sau reload roi SIGTERM ban cu → so 502 qua 3 lan: 0 0 1',
      '=  cho 0.3 s sau reload roi SIGTERM ban cu → so 502 qua 3 lan: 0 0 0',
      '=  cho 1 s sau reload roi SIGTERM ban cu → so 502 qua 3 lan: 0 0 0',
    ], { title: 'VPS thí nghiệm — 3 lần đo mỗi mức', fs: 12 })}
    ${term([
      "$ ps -eo pid,etimes,args | grep '[n]ginx:'   # ~20 ms sau reload",
      '   3216       0 nginx: worker process is shutting down',
      '   …',
      '# (10 worker cũ "shutting down" đang làm nốt, rồi các worker mới)',
      '   3270       0 nginx: worker process',
    ], { title: 'nginx -s reload là BẤT ĐỒNG BỘ', fs: 13 })}`,
    `${box('bad', '<code>nginx -s reload</code> chỉ GỬI tín hiệu rồi trả về. Trong vài chục ms, worker cũ vẫn chuyển request tới bản A. SIGTERM A lúc đó ⇒ A đã đóng cổng ⇒ nginx nhận <em>refused</em> ⇒ 502.')}
    ${box('good', 'Đo được: chờ ≥ 0,3 s là sạch trên máy này. Script dùng <strong>1 s</strong> — rẻ, và có dư cho máy chậm hơn. Con số này là của MÁY NÀY — đo lại trên máy của bạn bằng vòng request.')}`, 'l') },

  { t: 'nginx phân giải tên máy MỘT lần, lúc nạp', body: hosts() + two(
    term([
      '  +1531ms  B chay o 127.0.0.3:3101',
      '  +1546ms  ungdung-may → 127.0.0.3 (127.0.0.3)',
      '  +1554ms  SIGTERM ban A (127.0.0.2)',
      '  +4558ms  nginx -s reload',
      '! tong: 544   200: 304   502: 240',
      '  cua so hong: tu 1562ms den 4662ms (3100ms)',
      '# error.log trong lúc đó:',
      '! connect() failed (111: Connection refused) … upstream: "http://127.0.0.2:3101/"',
    ], { title: 'VPS thí nghiệm — upstream theo TÊN, bản mới ở IP mới', fs: 12.5 }),
    box('warn', '<strong>Đúng chuyện của container:</strong> tạo lại container ⇒ IP mới trong mạng Docker; nginx vẫn gọi IP cũ tới khi <code>reload</code> (hoặc <code>resolver 127.0.0.11</code> + biến trong <code>proxy_pass</code>). Chương 13.4 làm bản container.'), 'l') },

  /* ───────────── 3.4 ───────────── */
  { t: 'nohup không hồi sinh; Restart= thì có', body: two(
    term([
      '# Restart=no — app sập giữa lúc có tải',
      '  +1018ms  ung dung sap (loi khong ai bat)',
      '! tong: 506   200: 72   502: 434',
      '! cua so hong: tu 998ms den 6997ms   ← tới hết phép đo',
      '# Restart=on-failure, RestartSec=2s',
      '  +1019ms  ung dung sap',
      '  +4773ms  3101 tra 200 tro lai (sau 3750 ms)',
      '+ tong: 574   200: 273   502: 301',
      '# journalctl -u app -o short-precise',
      '01:52:46.313 app.service: Main process exited, status=1/FAILURE',
      '01:52:48.403 Scheduled restart job, restart counter is at 1.',
      '01:52:48.411 Started app.service - Ung dung web (Chuong 3).',
    ], { title: 'VPS thí nghiệm — systemd 255', fs: 12.5 }),
    `${bars([
      { l: 'Restart=no', sub: 'như nohup', v: 6000, txt: 'chết tới khi có người thấy', c: 'red' },
      { l: 'on-failure', sub: 'RestartSec=2s', v: 3722, txt: '3,7 s', c: 'amb' },
    ], { lw: 150, max: 6000 })}
    ${box('info', '3,7 s = 2,09 s <code>RestartSec</code> + 1,5 s khởi động + ~0,1 s. Hồi sinh <strong>không</strong> phải không gián đoạn — nó biến "chết tới sáng" thành "vài giây".')}`, 'l') },

  { t: 'Unit systemd, từng dòng', body: two(
    conf([
      ['[Unit]', ''],
      ['Description=Ung dung web', ''],
      ['After=network-online.target', 'mạng lên rồi mới chạy'],
      ['StartLimitIntervalSec=60', 'PHẢI ở [Unit]'],
      ['StartLimitBurst=5', '5 lần/60 s thì bỏ cuộc'],
      ['', ''],
      ['[Service]', ''],
      ['Type=exec', 'OK khi exec() thành công'],
      ['User=deploy', 'không chạy bằng root'],
      ['WorkingDirectory=/srv/app/hien-tai', 'symlink — đọc lúc START'],
      ['EnvironmentFile=/srv/app/chung/.env', 'ngoài bản phát hành (Ch4)'],
      ['ExecStart=/usr/bin/node app.mjs', 'đường dẫn TUYỆT ĐỐI'],
      ['Restart=on-failure', 'sập / thoát ≠ 0 ⇒ chạy lại'],
      ['RestartSec=2s', 'chờ trước khi chạy lại'],
      ['KillSignal=SIGTERM', ''],
      ['TimeoutStopSec=15s', '> hạn chót 10 s trong mã'],
      ['', ''],
      ['[Install]', ''],
      ['WantedBy=multi-user.target', 'enable ⇒ lên sau reboot'],
    ], { fs: 13.5 }),
    `${sh([
      ['sudo systemd-analyze verify /etc/systemd/system/app.service', 'kiểm TRƯỚC'],
      ['sudo systemctl daemon-reload', 'nạp tệp unit mới'],
      ['sudo systemctl enable --now app', 'bật + chạy'],
      ['systemctl status app', 'sống? từ bao giờ?'],
      ['journalctl -u app -f', 'log đang chạy'],
      ['systemctl show app -p NRestarts', 'sập bao nhiêu lần'],
    ], { fs: 13, so: false })}
    ${box('warn', '<code>WorkingDirectory</code> trỏ symlink được <strong>giải lúc tiến trình khởi động</strong> — đổi symlink mà không restart thì tiến trình vẫn ở bản cũ (đo ở slide 25).')}`, 'l') },

  { t: 'Bảng chỉ thị: Restart= và những người bạn', body: table(['Chỉ thị', 'Giá trị', 'Nghĩa — dùng khi'], [
    ['<code>Restart=</code>', '<code>no</code>', 'mặc định — sập là thôi. Chỉ cho việc chạy-một-lần'],
    ['', '<code>on-failure</code>', '+thoát ≠ 0, bị tín hiệu giết, hết giờ, watchdog — ứng dụng web: DÙNG CÁI NÀY'],
    ['', '<code>on-abnormal</code>', 'chỉ khi bị tín hiệu/hết giờ — thoát 1 thì KHÔNG chạy lại'],
    ['', '<code>always</code>', '!cả khi thoát 0; <code>systemctl stop</code> vẫn dừng được, nhưng app tự thoát 0 cũng bị kéo dậy'],
    ['<code>RestartSec=</code>', '<code>100ms</code> mặc định', 'khoảng nghỉ giữa hai lần — đặt 1–5 s để không đập máy'],
    ['<code>StartLimitIntervalSec=</code> · <code>Burst=</code>', '10 s · 5 mặc định', 'quá Burst lần trong Interval ⇒ <code>failed</code>, thôi thử — ở <strong>[Unit]</strong>'],
    ['<code>TimeoutStopSec=</code>', '90 s mặc định', 'SIGTERM rồi chờ chừng này mới SIGKILL'],
    ['<code>Type=</code>', '<code>exec</code> · <code>notify</code> · <code>simple</code>', '<code>notify</code>: chỉ "chạy" khi app gọi <code>sd_notify(READY=1)</code>'],
    ['<code>ExecReload=</code>', 'lệnh', 'cho <code>systemctl reload</code> — vd <code>kill -HUP $MAINPID</code>'],
  ], { sm: true }) + box('tip', 'Tra nhanh trên máy: <code>systemctl show app -p Restart -p RestartUSec -p TimeoutStopUSec</code> in giá trị ĐANG hiệu lực — không phải giá trị bạn nghĩ đã viết.') },

  { t: 'Chỉ thị sai mục: vòng lặp sập không dừng', body: two(
    term([
      '$ systemd-analyze verify /tmp/loop.service   # StartLimit* đặt ở [Service]',
      "! /tmp/loop.service:9: Unknown key name 'StartLimitIntervalSec' in section 'Service', ignoring.",
      '# đúng mục ([Unit]) · RestartSec=2s · chờ 30 s',
      '= Result=exit-code NRestarts=5 ActiveState=failed',
      '  loop.service: Start request repeated too quickly.',
      '# sai mục ([Service]) · cùng mọi thứ khác',
      '! Result=exit-code NRestarts=13 ActiveState=activating',
      '  … restart counter is at 13.',
    ], { title: 'VPS thí nghiệm — bản deploy hỏng sập ngay khi chạy', fs: 12.5 }),
    `${box('bad', 'Sai mục thì <code>StartLimitIntervalSec=60</code> bị <strong>phớt lờ</strong>, còn lại mặc định 10 s. Với <code>RestartSec=2s</code>, 5 lần chạy trải hơn 10 s ⇒ <strong>không bao giờ</strong> chạm trần ⇒ sập–chạy mãi mãi, log ngập, lỗi gốc bị chôn.')}
    ${box('info', '<code>StartLimitBurst</code> ở [Service] thì systemd vẫn nhận (tên cũ để tương thích) nên <code>verify</code> chỉ kêu một dòng. Đọc kỹ từng cảnh báo — một dòng là đủ đổi hành vi.')}`, 'l') },

  { t: 'systemctl restart cũng là tráo ngây thơ', body: two(
    term([
      '# systemctl restart app (một unit, một cổng)',
      '  +1007ms  systemctl restart app',
      '  +1046ms  lenh restart tra ve',
      '  +2675ms  san sang (sau 1625 ms)',
      '! tong: 498   200: 371   502: 127',
      '  cua so hong: tu 1015ms den 2625ms (1610ms)',
      '$ sudo systemctl show app -p NRestarts',
      '+ NRestarts=0     # sau 1 lần sập + 1 lần restart tay',
    ], { title: 'VPS thí nghiệm — Type=exec', fs: 13 }),
    `${box('warn', '<strong>Lệnh trả về sau 39 ms</strong>, app sẵn sàng sau 1,6 s: <code>Type=exec</code> coi "đã exec" là xong. Script mà tin mã thoát của <code>restart</code> rồi báo "deploy xong" là báo sớm 1,6 s.')}
    ${box('info', '<code>systemctl restart</code> tay <strong>đặt lại <code>NRestarts</code> về 0</strong> (đo thật) — đồ thị số lần sập có "khoảng sạch" giả sau mỗi deploy.')}
    ${box('good', 'Trang ít khách, chấp nhận ~1,6 s: <code>ln -sfn … &amp;&amp; systemctl restart app</code> + smoke-test là đủ. Cần 0 lỗi: hai unit <code>app@3101</code>/<code>app@3102</code> + nginx.')}`, 'l') },

  /* ───────────── 3.5 ───────────── */
  { t: 'Script tráo: khoá · chờ · chuyển · dừng', body: sh([
    ['set -euo pipefail', 'trao.sh BAN'],
    ['exec 9>/tmp/trao.lock; flock -w 30 9 || { echo "co lan trao khac dang chay" >&2; exit 1; }', 'một lúc một lần'],
    ["CU=$(grep -oE '127\\.0\\.0\\.1:[0-9]+' /srv/app/upstream.conf | cut -d: -f2)", 'đang chạy cổng nào'],
    ['MOI=$([ "$CU" = 3101 ] && echo 3102 || echo 3101)', 'cổng còn lại là đích'],
    ['echo "V=${1:?can ten ban}" > /srv/app/mau-$MOI.env', ''],
    ['sudo systemctl start app@$MOI', '1. chạy SONG SONG'],
    ['for i in $(seq 1 100); do', '2. chờ SẴN SÀNG thật'],
    ["  [ \"$(curl -s -o /dev/null -w '%{http_code}' --max-time 1 \\", ''],
    ['       http://127.0.0.1:$MOI/health)" = 200 ] && break', ''],
    ['  [ "$i" = 100 ] && { sudo systemctl stop app@$MOI; exit 1; }', 'hỏng ⇒ A vẫn nguyên'],
    ['  sleep 0.1', ''],
    ['done', ''],
    ['echo "upstream ungdung { server 127.0.0.1:$MOI; keepalive 16; }" \\', '3. chuyển'],
    ['  > /srv/app/upstream.conf', ''],
    ['sudo nginx -t -q && sudo nginx -s reload', 'kiểm rồi mới nạp'],
    ['sleep 1', 'worker nginx cũ làm nốt'],
    ['bash smoke.sh || { echo "SMOKE HONG — lui ve $CU" >&2', 'kiểm qua CỬA TRƯỚC'],
    ['  echo "upstream ungdung { server 127.0.0.1:$CU; keepalive 16; }" > /srv/app/upstream.conf', 'A còn sống ⇒'],
    ['  sudo nginx -s reload; sleep 1; sudo systemctl stop app@$MOI; exit 1; }', 'lùi tức thì'],
    ['sudo systemctl stop app@$CU', '4. SIGTERM, chờ xả ≤ 15 s'],
  ], { fs: 13 }) },

  { t: 'Ba lần tráo + một lần lùi: 0 lỗi', body: two(
    conf([
      ['# /etc/systemd/system/app@.service', ''],
      ['[Unit]', ''],
      ['Description=Ung dung web tren cong %i', '%i = phần sau @'],
      ['StartLimitIntervalSec=60', ''],
      ['StartLimitBurst=5', ''],
      ['[Service]', ''],
      ['Type=exec', ''],
      ['User=deploy', ''],
      ['EnvironmentFile=/srv/app/mau-%i.env', 'V=v2 … mỗi màu một tệp'],
      ['WorkingDirectory=/srv/app/lab', ''],
      ['Environment=CONG=%i KHOI=1500 CHE_DO=tutu TRE=300', ''],
      ['ExecStart=/usr/bin/node app.mjs', ''],
      ['Restart=on-failure', ''],
      ['RestartSec=2s', ''],
      ['TimeoutStopSec=15s', ''],
    ], { fs: 12.5 }),
    `${term([
      '$ for v in v2 v3 v4 v1; do bash trao.sh $v; done',
      '  3101 → 3102  xong',
      '  3102 → 3101  xong',
      '  3101 → 3102  xong',
      '!  HONG  404  /api/moi   ← … dang chay ban CU?',
      '! SMOKE HONG — lui ve 3102',
      '=  tong: 1607   200: 1607',
      '  phan bo ban: {"v1":324,"v2":245,"v3":244,"v4":794}',
    ], { title: 'VPS thí nghiệm — dưới tải, request 300 ms', fs: 12.5 })}
    ${box('bad', '<strong>Bản đầu của nhánh lùi</strong> quên <code>sleep 1</code> sau reload ⇒ lần lùi đó tự gây <strong>9 × 502</strong> — đúng cái lỗi đường chính đã tránh. Đường lùi ít khi chạy nên là chỗ lỗi trốn: phải đo nó như đường chính.')}`, 'l') },

  { t: 'Smoke-test sau tráo: 404 nghĩa là bản CŨ', body: two(
    term([
      '$ ln -sfn /srv/app/phat-hanh/v2 /srv/app/hien-tai   # QUÊN restart',
      '$ curl -s localhost/',
      '! v1',
      '$ bash smoke.sh',
      '  ok    200  /health',
      '!  HONG  404  /api/moi   ← route khong ton tai: dang chay ban CU?',
      '  ma thoat: 1',
      '$ sudo readlink /proc/$(systemctl show web -p MainPID --value)/cwd',
      '! /srv/app/phat-hanh/v1',
      '$ sudo systemctl restart web; bash smoke.sh',
      '  ok    200  /health',
      '=  ok    401  /api/moi',
      '  ma thoat: 0',
    ], { title: 'VPS thí nghiệm — symlink đổi, tiến trình không', fs: 12 }),
    `${sh([
      ['for r in /health /api/moi; do', ''],
      ["  ma=$(curl -s -o /dev/null -w '%{http_code}' \"$GOC$r\")", ''],
      ['  case $ma in', ''],
      ['    200|401) echo "  ok    $ma  $r" ;;', ''],
      ['    404) echo "  HONG  $ma  $r"; hong=1 ;;', ''],
      ['    *)   echo "  HONG  $ma  $r"; hong=1 ;;', ''],
      ['  esac', ''],
      ['done; exit $hong', ''],
    ], { fs: 12.5 })}
    ${box('bad', '<strong>02/07, cuongthai.com:</strong> deploy <code>--no-build</code> chỉ rsync, container chạy ảnh CŨ, route GIF mới 404 cả ngày ⇒ từ đó <code>deploy.sh</code> có smoke-test: 401/200 = có route, 404 = bản cũ.')}`, 'l') },

  { t: 'Con của script thừa hưởng khoá deploy', body: two(
    term([
      '$ bash khoa-sai.sh',
      '  da chay app nen, pid=11626',
      '  ma thoat: 0',
      '$ bash khoa-sai.sh      # lan 2, khong con lan nao dang chay',
      '! co lan trao khac dang chay',
      '  ma thoat: 1',
      '$ ls -l /proc/11626/fd | grep lock',
      '! l-wx------ 1 deploy deploy 64 Sep 29 02:08 9 -> /run/lock/trao.lock',
      '$ fuser -v /run/lock/trao.lock',
      '                     USER        PID ACCESS COMMAND',
      '! /run/lock/trao.lock: deploy    11626 F.... node',
    ], { title: 'VPS thí nghiệm — quên 9>&-, ứng dụng giữ fd 9', fs: 12 }),
    `${sh([
      ['exec 9>/run/lock/trao.lock   # shell mở fd 9', ''],
      ['flock -w 30 9               # khoá trên fd 9', ''],
      ['setsid nohup node app.mjs >log 2>&1 \\', ''],
      ['    </dev/null 9>&- &        # 9>&- ĐÓNG fd 9 ở con', ''],
    ], { fs: 13 })}
    ${box('warn', 'Mọi thứ script MỞ thì con THỪA HƯỞNG: khoá, log, socket, cả stdin của SSH. Với <code>systemctl start</code> thì không bị — systemd khởi động app từ PID 1, không phải từ shell của bạn.')}`, 'l2') },

  { t: 'Sai lầm hay gặp ở bước tráo', body: table(['Việc làm', 'Vì sao hỏng', 'Làm thay bằng'], [
    ['Dừng bản cũ rồi mới chạy bản mới', 'cửa sổ = thời gian khởi động (133 × 502)', 'chạy song song, dừng cũ SAU CÙNG'],
    ['<code>sleep 5</code> thay cho phép kiểm', 'đoán thiếu ⇒ 502/500; đoán thừa ⇒ chậm', 'vòng hỏi <code>/health</code> có trần'],
    ['<code>kill -9</code> / không bắt SIGTERM', '10/10 request đang bay mất', '<code>close()</code> + làm nốt + hạn chót'],
    ['Cờ "đang tắt" trả 503 cho request đã nhận', '10/10 thành trang lỗi', 'cờ chỉ thêm <code>Connection: close</code>'],
    ['Dừng bản cũ NGAY sau <code>nginx -s reload</code>', 'worker cũ còn gửi tới: 8–9 × 502', 'chờ ≥ 0,3 s (script: 1 s)'],
    ['Upstream theo tên, tráo sang IP mới', 'nginx giữ IP cũ: 240 × 502 / 3,1 s', '<code>nginx -s reload</code> sau khi tráo'],
    ['<code>StartLimit*</code> ở [Service]', 'phớt lờ ⇒ sập–chạy mãi (13 lần/30 s)', '[Unit] + <code>systemd-analyze verify</code>'],
    ['Đổi symlink, quên restart', 'đang chạy v1, smoke /health vẫn 200', 'smoke-test route MỚI: 404 = bản cũ'],
    ['<code>wait</code> không tham số trong script đo', 'chờ luôn cả app chạy nền ⇒ treo', '<code>wait $PID</code> của đúng tiến trình'],
  ], { sm: true }) },

  { t: 'Bảng tra nhanh (1/2): tín hiệu và nginx', body: two(
    sh([
      ['kill -TERM $PID', 'xin dừng — app bắt được'],
      ['kill -9 $PID', 'giết — CHỈ khi hết hạn chót'],
      ["ss -ltnp | grep ':3101 '", 'ai đang nghe cổng'],
      ["ss -tn state established '( sport = :3101 )'", 'kết nối đang mở'],
      ['ls -l /proc/$PID/fd', 'tiến trình giữ gì'],
      ['readlink /proc/$PID/cwd', 'đang chạy từ bản nào'],
      ['nginx -t && nginx -s reload', 'kiểm rồi nạp'],
      ["ps -eo pid,etimes,args | grep '[n]ginx:'", 'worker "shutting down"'],
      ["tail -f /var/log/nginx/error.log", 'upstream nào bị refused'],
      ["curl -s -o /dev/null -w '%{http_code}' URL", 'chỉ mã HTTP'],
      ['bash vong.sh URL 6 | awk \'{print $2}\' | sort | uniq -c', 'đếm 200/502 cả lần tráo'],
    ], { fs: 13 }),
    table(['Thấy', 'Nghĩa là'], [
      ['<code>000</code> / refused', 'không ai nghe cổng (cửa sổ ②)'],
      ['<code>ECONNRESET</code>', 'đang bay thì tiến trình chết (①)'],
      ['<code>502</code> từ nginx', 'upstream refused/reset — thường là ②'],
      ['<code>500</code> ngay sau tráo', 'app nghe mà chưa ấm (③)'],
      ['<code>503</code> lúc tắt', 'handler kiểm cờ sai chỗ'],
      ['<code>404</code> route mới', 'đang chạy bản CŨ'],
      ['<code>401</code> route mới', 'route có — chỉ cần đăng nhập'],
    ], { sm: true }), 'l') },

  { t: 'Bảng tra nhanh (2/2): systemd', body: sh([
    ['sudo systemd-analyze verify /etc/systemd/system/app.service', 'kiểm unit TRƯỚC khi bật'],
    ['sudo systemctl daemon-reload', 'sau MỌI lần sửa tệp unit'],
    ['sudo systemctl enable --now app', 'bật khi boot + chạy ngay'],
    ['sudo systemctl start app@3102', 'chạy màu thứ hai (unit khuôn)'],
    ['sudo systemctl stop app@3101', 'SIGTERM, chờ ≤ TimeoutStopSec'],
    ['systemctl status app --no-pager', 'trạng thái + dòng log cuối'],
    ['journalctl -u app -f', 'log đang chạy'],
    ["journalctl -u app --since '10 min ago' -p err", 'chỉ lỗi'],
    ['journalctl -u app -o short-precise | grep -i restart', 'mốc sập/chạy lại tới mili giây'],
    ['systemctl show app -p NRestarts -p ActiveState -p Result', 'đếm sập (restart tay đặt về 0)'],
    ['systemctl show app -p Restart -p RestartUSec -p TimeoutStopUSec', 'giá trị ĐANG hiệu lực'],
    ['sudo systemctl reset-failed app', 'gỡ trạng thái start-limit-hit'],
  ], { fs: 15 }) },

  { t: 'Thực hành chương 3 (45 phút, VPS thí nghiệm)', body: table(['Bước', 'Làm gì', 'Đạt khi'], [
    ['<strong>1. Đo ngây thơ</strong> · 10′', 'app khởi động 1,5 s sau nginx; <code>vong.sh</code> 6 s; kill rồi chạy lại', 'có số 502 và độ dài cửa sổ ≈ thời gian khởi động'],
    ['<strong>2. Tắt tử tế</strong> · 10′', '10 request 400 ms; SIGKILL, rồi SIGTERM có <code>close()</code>', '+000 ×10 → 200 ×10, <code>ss</code> không còn cổng'],
    ['<strong>3. Xanh/lam</strong> · 10′', 'hai cổng + <code>upstream.conf</code>; thử <code>sleep 1</code> rồi thử vòng <code>/health</code>', '+0 lỗi khi chờ /health; ghi số 502 khi đoán'],
    ['<strong>4. systemd</strong> · 8′', '<code>app@.service</code>; gọi <code>/sap</code>; đặt StartLimit sai mục', 'đo được thời gian hồi sinh; <code>verify</code> bắt dòng sai'],
    ['<strong>5. Script + smoke</strong> · 7′', '<code>trao.sh</code> ×3 dưới tải; đổi symlink quên restart', '+1 lần 0 lỗi; smoke in 404 rồi 401'],
  ], { sm: true }) + two(
    box('info', '<strong>VPS thí nghiệm có systemd:</strong> <code>docker run -d --name dv03-vps --privileged --cgroupns=private --tmpfs /run --tmpfs /run/lock -p 127.0.0.1:19032:22 dv03-img</code> (<code>CMD ["/sbin/init"]</code>). Xong: <code>docker rm -f dv03-vps</code>.'),
    box('warn', '<code>--privileged</code> chỉ cho phòng thí nghiệm, bật ngắn rồi xoá. Đừng chạy vòng đo tải nhắm vào máy chủ THẬT của người khác.')) },
].map((s) => (s.kind === 'cover' ? s : { ...s, body: FIX + s.body })));
