/**
 * Deploy lên VPS · Deck dv-15 — Chương 15 (MỚI): Dự án cuối khoá — đưa một ứng dụng thật lên từ đầu tới cuối.
 *
 * MỌI output terminal trên slide là output THẬT, chạy 29/09/2026 trong phòng thí nghiệm của chương:
 *  - "VPS" dv15-vps: container ubuntu:24.04 (arm64, --privileged, --memory 1536m, mạng dv15-net 172.22.15.10,
 *    bí danh phongkham.test), lúc giao chỉ có sshd + khoá của root — script ngay1.sh cài Docker 29.1.3, nginx 1.24.0,
 *    certbot 2.9.0, ufw; SSH từ Mac qua 127.0.0.1:19152 bằng khoá tạo trong thư mục nháp;
 *  - "máy khác" dv15-vps2 (172.22.15.20): khách hàng đo request, nơi phục hồi, máy canh từ ngoài;
 *  - registry:2 dv15-reg (Mac đẩy qua localhost:19155), CA thử Pebble dv15-pebble (KHÔNG gọi Let's Encrypt thật),
 *    webhook giả dv15-hook (node:22-alpine in ra mọi POST);
 *  - app "Đặt lịch phòng khám": Node 22 + pg 8.16.3 + PostgreSQL 16.15, ảnh dựng TRÊN MAC từ git archive.
 * Hình tự vẽ (SVG): toanCanh() năm máy của dự án · xanhLam() tráo bằng một dòng upstream · cotDb() cột của bảng
 * lich_hen qua các bản phát hành · phucHoi() thanh thời gian bốn lần phục hồi.
 * Tô màu: sh() cho bash; conf() (chép từ dv-03, thêm nhận '.' trong tên chỉ thị) cho nginx.conf/authorized_keys;
 * code(…,'sql') cho SQL; yaml() cho compose.
 */
import { S, cover, sh, yaml, term, mindmap, diagram, cards, box, table, two, code, sv, R, T, A, D, esc } from './_dv-chung.mjs';

export const deck = { key: 'dv-15', code: 'DEPLOY · CHƯƠNG 15', title: 'Dự án cuối khoá', sub: 'Deploy lên VPS · Chương 15' };

const FIX = '<style>.c-two>div>*+*{margin-top:12px}.c-t.sm{font-size:15px}.c-t.sm td,.c-t.sm th{padding:6px 10px}' +
  '.c-t.xs{font-size:13.5px}.c-t.xs td,.c-t.xs th{padding:5px 9px}' +
  '.d-yml .c .nu{color:#b5cea8}.d-yml .c .sx{color:#c586c0}.d-yml .c .sec{color:#ff7b72;font-weight:700}' +
  '.l-sh .c .ty{color:#4ec9b0}svg{max-width:100%;height:auto}.c-code{font-size:14px;margin:0}</style>';

/* ─────────── tô màu cấu hình: unit systemd (ini) và nginx.conf — cùng khung .d-yml với yaml() (chép từ dv-03) ─────────── */
const conf = (lines, { fs = 15, lang = 'nginx' } = {}) => {
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
        .replace(/(\$[a-z_]+)/g, '<span class="sx">$1</span>')
        .replace(/\b(http_\d{3}|error|timeout|off|on|ssl|http2)\b/g, '<span class="sx">$1</span>');
      return `${m[1]}<span class="k">${esc(m[2])}</span>${rest}${tail}`;
    }
    return esc(body) + tail;
  };
  return `<div class="d-yml" style="--fs:${fs}px">${lines.map((x) => {
    const [c, a] = Array.isArray(x) ? x : [x, ''];
    return `<div class="c">${hl(c) || ' '}</div><div class="a">${a ? esc(a) : ''}</div>`;
  }).join('')}</div>`;
};

/* ─────────── Toàn cảnh: năm máy của dự án ─────────── */
const toanCanh = () => diagram({
  w: 1150, h: 350,
  nodes: [
    { id: 'mac', x: 0, y: 10, w: 240, h: 110, t: '💻 Mac (máy build)', d: 'git archive | build\nkiem-anh.sh → push', c: 'blu', mono: true },
    { id: 'reg', x: 0, y: 240, w: 240, h: 90, t: 'dv15-reg (registry)', d: 'phongkham:<commit>', c: 'vio', mono: true },
    { id: 'vps', x: 390, y: 10, w: 390, h: 320, t: 'dv15-vps · phongkham.test', d: 'nginx :443 (Pebble cấp chứng chỉ)\n→ upstream 127.0.0.1:3001 | 3002\npk-xanh · pk-lam (Node 22)\npk-db (Postgres 16, KHÔNG publish)\nufw: 22 · 80 · 443\n/var/backups/phongkham (7 bản)\nphat-hanh.sh · sao-luu.sh', c: 'dv', mono: true },
    { id: 'v2', x: 910, y: 10, w: 240, h: 150, t: 'dv15-vps2 (máy khác)', d: 'dem.sh: khách hàng\ncanh.sh: canh từ ngoài\nphuc-hoi.sh', c: 'grn', mono: true },
    { id: 'hook', x: 910, y: 250, w: 240, h: 80, t: 'dv15-hook', d: 'webhook giả (Discord…)', c: 'amb', mono: true },
  ],
  edges: [
    { from: 'mac', to: 'reg', t: 'push', c: 'vio', off: 8 },
    { from: 'mac', to: 'vps', t: 'ssh', c: 'blu', off: 8 },
    { from: 'reg', to: 'vps', t: 'pull', c: 'vio', off: 8 },
    { from: 'v2', to: 'vps', t: 'HTTPS', c: 'grn', off: 8 },
    { from: 'v2', to: 'hook', t: 'POST khi đổi trạng thái', c: 'amb', off: 8 },
  ],
});

/* ─────────── Xanh/lam: nginx đổi một dòng upstream ─────────── */
const xanhLam = () => {
  let s = '';
  s += R(0, 120, 180, 90, { c: 'dim', r: 10 }) + T(90, 158, 'khách', { fs: 17, a: 'middle', b: true }) + T(90, 184, 'https://phongkham.test', { fs: 12.5, a: 'middle', c: 'mu', mono: true });
  s += R(250, 90, 290, 150, { c: 'dv', r: 12 }) + T(395, 122, 'nginx :443', { fs: 18, a: 'middle', b: true, c: 'dv', mono: true });
  s += T(395, 152, 'upstream phongkham_api {', { fs: 13, a: 'middle', mono: true, c: 'tx' });
  s += T(395, 176, 'include phongkham-upstream.conf;', { fs: 13, a: 'middle', mono: true, c: 'amb' });
  s += T(395, 200, '}', { fs: 13, a: 'middle', mono: true, c: 'tx' });
  s += T(395, 226, 'reload = tín hiệu HUP', { fs: 13, a: 'middle', c: 'mu' });
  s += A(182, 165, 246, 165, { c: 'dim' });
  // tệp upstream
  s += R(250, 290, 290, 70, { c: 'amb', r: 10, fill: 'rgba(210,153,34,.10)' });
  s += T(395, 318, 'cat > phongkham-upstream.conf', { fs: 13, a: 'middle', mono: true, c: 'amb' });
  s += T(395, 342, '"server 127.0.0.1:3002;"', { fs: 13, a: 'middle', mono: true, c: 'tx' });
  s += `<path d="M395 288 L395 244" stroke="${D.amb}" stroke-width="2.5" stroke-dasharray="6 5"/>`;
  // hai màu
  s += R(660, 30, 300, 110, { c: 'dim', r: 12, dash: true }) + T(810, 64, 'pk-xanh · 127.0.0.1:3001', { fs: 15, a: 'middle', b: true, mono: true, c: 'mu' });
  s += T(810, 92, 'bản CŨ (2139d95)', { fs: 14, a: 'middle', c: 'mu' }) + T(810, 118, 'xả xong → docker stop -t 20', { fs: 13, a: 'middle', c: 'dim', mono: true });
  s += R(660, 190, 300, 110, { c: 'grn', r: 12 }) + T(810, 224, 'pk-lam · 127.0.0.1:3002', { fs: 15, a: 'middle', b: true, mono: true, c: 'grn' });
  s += T(810, 252, 'bản MỚI (ef8f9c5)', { fs: 14, a: 'middle', c: 'tx' }) + T(810, 278, 'health + thử đường đọc TRƯỚC', { fs: 13, a: 'middle', c: 'mu' });
  s += `<path d="M542 140 L656 85" stroke="${D.dim}" stroke-width="2.5" stroke-dasharray="7 6" fill="none"/>`;
  s += A(542, 190, 656, 245, { c: 'grn' });
  s += R(990, 110, 160, 110, { c: 'vio', r: 12 }) + T(1070, 150, 'pk-db', { fs: 16, a: 'middle', b: true, mono: true, c: 'vio' }) + T(1070, 176, 'mạng phongkham', { fs: 12.5, a: 'middle', c: 'mu' }) + T(1070, 198, 'không -p', { fs: 12.5, a: 'middle', c: 'mu', mono: true });
  s += A(962, 90, 988, 140, { c: 'dim', sw: 2 }) + A(962, 245, 988, 195, { c: 'vio', sw: 2 });
  s += T(0, 392, 'Không có lúc nào hai bản cùng vắng mặt: bản mới đã trả lời TRƯỚC khi nginx trỏ sang, bản cũ chỉ tắt SAU khi cửa trước nói đúng bản mới.', { fs: 14.5, c: 'amb', b: true });
  return sv(1150, 402, s);
};

/* ─────────── Cột của bảng lich_hen qua từng bản phát hành ─────────── */
const cotDb = () => {
  let s = '';
  const cols = [
    ['10e26b6', 'a', 'dv'], ['2139d95', 'b · mở rộng', 'dv'], ['ef8f9c5', 'c2', 'dv'], ['95b548d', '(script)', 'dv'], ['07630fa', 'd · thu hẹp', 'red'],
  ];
  const rows = [
    ['ten_benh_nhan', [1, 1, 1, 1, 0]],
    ['ho_ten', [0, 1, 1, 1, 1]],
    ['so_dien_thoai', [0, 0, 1, 1, 1]],
  ];
  const x0 = 200, dx = 190;
  cols.forEach(([tag, nh, c], i) => {
    s += T(x0 + i * dx + 80, 24, tag, { fs: 14, a: 'middle', mono: true, b: true, c });
    s += T(x0 + i * dx + 80, 46, nh, { fs: 13, a: 'middle', c: 'mu' });
  });
  rows.forEach(([ten, v], j) => {
    const y = 70 + j * 52;
    s += T(0, y + 27, ten, { fs: 15, mono: true, c: 'tx' });
    v.forEach((on, i) => {
      const xoa = !on && j === 0;                     // chỉ ten_benh_nhan là bị XOÁ; hai cột kia là CHƯA CÓ
      s += R(x0 + i * dx, y, 160, 40, { c: on ? 'grn' : (xoa ? 'red' : 'dim'), r: 8, sw: 1.5, fill: on ? 'rgba(63,185,80,.12)' : (xoa ? 'rgba(248,81,73,.10)' : 'rgba(255,255,255,.02)'), dash: !on });
      s += T(x0 + i * dx + 80, y + 26, on ? 'có' : (xoa ? 'ĐÃ XOÁ' : 'chưa có'), { fs: 13.5, a: 'middle', c: on ? 'grn' : (xoa ? 'red' : 'dim'), b: xoa });
    });
  });
  const cx = (i) => x0 + i * dx + 80;
  s += A(cx(4) - 10, 250, cx(3) + 10, 250, { c: 'red' });
  s += T((cx(3) + cx(4)) / 2, 280, 'lùi → 95b548d: BỊ CHẶN', { fs: 14, a: 'middle', c: 'red', b: true });
  s += A(cx(1) - 10, 250, cx(0) + 10, 250, { c: 'grn' });
  s += T((cx(0) + cx(1)) / 2, 280, 'lùi → 10e26b6: CHẠY', { fs: 14, a: 'middle', c: 'grn', b: true });
  s += T(0, 262, 'mũi tên = lùi bản', { fs: 13, c: 'mu' });
  return sv(1150, 292, s);
};

/* ─────────── Phục hồi: bốn lần, bấm giờ từng chặng ─────────── */
const phucHoi = () => {
  let s = '';
  const W = 800, x0 = 230, M = 101000;
  const X = (ms) => x0 + (ms / M) * W;
  const lan = [
    ['lần 1 (máy trống)', [[224, 'kéo dump', 'blu'], [95364, 'kéo ảnh postgres từ Docker Hub', 'amb'], [96260, 'restore', 'grn'], [100673, 'kéo ảnh app', 'vio'], [100790, '', 'dv']], '100,8 s'],
    ['lần 3 (ảnh có sẵn)', [[226, '', 'blu'], [3299, 'Postgres TẠM', 'amb']], 'HỎNG: pg_restore bị cắt'],
    ['lần ok 1', [[202, '', 'blu'], [1898, '', 'amb'], [2827, '', 'grn'], [3350, '', 'vio'], [3423, '', 'dv']], '3,4 s'],
    ['lần ok 3', [[203, '', 'blu'], [1859, '', 'amb'], [3162, '', 'grn'], [3775, '', 'vio'], [3897, '', 'dv']], '3,9 s'],
  ];
  lan.forEach(([ten, ph, kq], j) => {
    const y = 20 + j * 62;
    s += T(0, y + 26, ten, { fs: 15, b: true, c: j === 1 ? 'red' : 'tx' });
    let prev = 0;
    ph.forEach(([t, nh, c]) => {
      const w = Math.max(3, X(t) - X(prev));
      s += R(X(prev), y, w, 38, { c, r: 4, sw: 1, fill: `color-mix(in srgb, ${D[c]} 35%, transparent)` });
      if (nh && w > 120) s += T(X(prev) + w / 2, y + 25, nh, { fs: 13, a: 'middle', c: 'tx' });
      prev = t;
    });
    s += T(X(prev) + 10, y + 25, kq, { fs: 14, b: true, c: j === 1 ? 'red' : 'grn' });
  });
  s += T(0, 290, 'Chặng phục hồi dữ liệu (pg_restore 300 000 dòng) chỉ tốn ~0,9–1,3 s. Cái đắt là THỨ CHƯA CÓ SẴN trên máy dự phòng.', { fs: 14.5, c: 'amb', b: true });
  return sv(1150, 300, s);
};

export const slides = S([
  cover({ t: 'Chương 15 — Dự án cuối khoá', sub: 'máy mới → HTTPS · đường ống phát hành · lùi bản, sao lưu, canh từ ngoài · ra mắt và tám sự cố kinh điển', chap: 'CHƯƠNG 15' }),

  { t: 'Bản đồ chương: một ứng dụng, ba ngày, một tuần', body: mindmap('Phòng khám', 'web + API + Postgres', [
    { t: '15.1 Ngày 1', d: 'máy mới · khoá · ufw · Docker · HTTPS', c: 'dv' },
    { t: '15.2 Ngày 2', d: 'build → registry → phát hành × 3', c: 'grn' },
    { t: '15.3 Ngày 3', d: 'lùi · sao lưu · phục hồi · canh', c: 'amb' },
    { t: '15.4 Ra mắt', d: 'runbook · tám sự cố dựng lại', c: 'red' },
    { t: 'Đã có ở Linux Ch16', d: 'systemd · bootstrap · logrotate', c: 'vio' },
    { t: '15.5 Bài thi', d: '20 câu, Mục 0 → Ch15', c: 'blu' },
  ]) },

  { t: 'Toàn cảnh: năm máy, một ứng dụng', body: toanCanh() + two(
    box('info', '<strong>App cố ý nhỏ:</strong> 35 dòng Node + <code>pg</code>, một bảng, một trang tĩnh. Chương nói về cách ĐƯA nó lên và GIỮ nó sống.'),
    box('tip', '8 script trong <code>ops/</code> + app = <strong>360 dòng</strong>. Mac gọi <code>ssh … sudo phat-hanh.sh</code>; vps2 đi HTTPS và ssh kéo bản sao lưu.')) },

  /* ───────────── 15.1 ───────────── */
  { t: 'Ngày 1: sáu bước, 52 giây trên máy mới', body: two(
    sh([
      ['set -Eeuo pipefail', 'hỏng là dừng, có dòng'],
      ['export DEBIAN_FRONTEND=noninteractive', 'không có: tzdata HỎI'],
      ['need=(sudo docker.io nginx certbot ufw …)', '[1] gói'],
      ['useradd -m -s /bin/bash deploy', '[2] người deploy'],
      ["echo 'deploy ALL=(root) NOPASSWD: …/phat-hanh.sh'", 'MỘT lệnh sudo'],
      ['cat > /etc/docker/daemon.json', '[3] xoay log 10m × 3'],
      ['ufw allow 22,80,443/tcp; ufw --force enable', '[4] ba cổng'],
      ['location /.well-known/acme-challenge/', '[5] 80: ACME + 301'],
      ['certbot certonly --webroot -w /var/www/acme', '[6] chứng chỉ'],
      ['curl … https://$TEN/  →  200', 'nghiệm thu'],
    ], { fs: 13.5 }),
    term([
      '[1/6] goi phan mem',
      '  + cai sudo docker.io docker-compose-v2 nginx …',
      '[2/6] nguoi dung deploy: chi SSH bang khoa …',
      '  + tao deploy',
      '  + sudoers mot dong',
      '  ✓ sshd: passwordauthentication no (da nap lai)',
      '[3/6] Docker: xoay log, registry noi bo',
      '  ✓ docker 29.1.3',
      '[4/6] tuong lua: chi 22, 80, 443',
      '  ✓ Status: active',
      '[6/6] chung chi (ACME, webroot) + trang …',
      '  + xin chung chi phongkham.test',
      '= = https://phongkham.test/ -> 200 (lan hoi thu 2)',
      'real    0m52.586s',
    ], { title: 'dv15-vps mới tinh — lần chạy trên máy thứ hai', fs: 12.5 }), 'l') },

  { t: 'Script Ngày 1 phải chạy năm lần mới đúng', body: table(['Lần', 'Thấy gì (output thật)', 'Nguyên nhân', 'Sửa'], [
    ['1', '<code>debconf: delaying package configuration…</code> rồi im <strong>6 phút 11 giây</strong>', 'gói <code>tzdata</code> hỏi múi giờ qua SSH không có TTY', '<code>export DEBIAN_FRONTEND=noninteractive</code>'],
    ['2', '<code>visudo: command not found</code> — script vẫn chạy tiếp', 'ảnh tối giản không có <code>sudo</code>; lỗi nằm giữa chuỗi <code>&amp;&amp;</code>', 'cài <code>sudo</code>; <code>visudo -cqf</code> đứng riêng một dòng'],
    ['2', '<code>unknown directive "http2"</code>', '<code>http2 on;</code> có từ nginx 1.25.1; Ubuntu 24.04 là 1.24.0', '<code>listen 443 ssl http2;</code>'],
    ['3', '<code>https://phongkham.test/ -&gt; 000</code>', '<code>nginx -s reload</code> trả về TRƯỚC khi worker mới mở 443', 'hỏi lại tới 5 s'],
    ['4', 'mọi dòng ✓, 200, <strong>2,4 s</strong>', '—', '—'],
    ['5', 'từ ngoài: <code>Permission denied (publickey,password)</code>', 'ghi drop-in sshd mà không nạp lại — <code>sshd -T</code> đọc TỆP', '<code>kill -HUP</code> / <code>systemctl reload ssh</code>'],
  ], { sm: true }) + box('good', 'Không lỗi nào trong số này hiện ra khi <em>đọc</em> script. Tất cả hiện ra khi <strong>chạy trên một máy mới tinh</strong> — lý do Ngày 1 phải là một script chạy lại được, không phải 30 lệnh gõ tay.') },

  { t: 'set -e không bắt lỗi nằm giữa chuỗi &&', body: two(
    `${sh([
      ['set -Eeuo pipefail', ''],
      ["visudo -cqf /tmp/sudoers.pk && install … && ok", 'lần 2: SAI'],
      ['', ''],
      ['visudo -cqf /tmp/sudoers.pk', 'sửa: đứng riêng ⇒ set -e dừng'],
      ['cmp -s /tmp/sudoers.pk /etc/sudoers.d/phongkham \\', ''],
      ['  || install -m 440 /tmp/sudoers.pk /etc/sudoers.d/phongkham', ''],
    ], { fs: 13.5 })}
    ${term([
      '  + chep khoa',
      '! /root/ops/ngay1.sh: line 23: visudo: command not found',
      '  ✓ sshd: passwordauthentication no',
      '[3/6] Docker: xoay log, registry noi bo',
    ], { title: 'lần 2 — script KHÔNG dừng', fs: 13 })}`,
    `${box('bad', '<strong>Hướng dẫn Bash (The Set Builtin):</strong> shell KHÔNG thoát khi lệnh hỏng là <em>một phần của danh sách <code>&amp;&amp;</code> / <code>||</code>, trừ lệnh sau <code>&amp;&amp;</code> cuối cùng</em>. Nên <code>visudo &amp;&amp; install</code> hỏng im lặng — và người deploy không có dòng sudoers nào.')}
    ${box('warn', 'Cùng loại ở lần 2: <code>nginx -t -q &amp;&amp; nginx -s reload</code> — cấu hình sai, script vẫn đi tiếp; chỉ <code>curl</code> (đứng riêng) mới kích hoạt <code>trap ERR</code>.')}
    ${box('tip', '<strong>Lệnh kiểm tra đứng riêng một dòng.</strong> <code>&amp;&amp;</code> là "làm B nếu A đúng", không phải "A bắt buộc đúng".')}`, 'l') },

  { t: 'reload trả về trước khi cấu hình mới chạy', body: two(
    `${conf([
      ['server {', ''],
      ['    listen 443 ssl http2;', '1.24: chưa có "http2 on;"'],
      ['    server_name phongkham.test www.phongkham.test;', ''],
      ['    ssl_certificate     /etc/letsencrypt/live/…/fullchain.pem;', ''],
      ['    ssl_certificate_key /etc/letsencrypt/live/…/privkey.pem;', ''],
      ['    root /var/www/sap-ra-mat;', 'trang "sắp ra mắt"'],
      ['}', ''],
    ], { fs: 13 })}
    ${term([
      '! [emerg] unknown directive "http2" in …/phongkham:9',
      '! nginx: configuration file /etc/nginx/nginx.conf test failed',
    ], { title: 'lần 2 — nginx -t', fs: 13 })}`,
    `${term([
      '  ✓ nginx :443',
      '!   = https://phongkham.test/ -> 000',
      '! ngay1: HONG o dong 84: curl -s -o /dev/null …',
      '# vài giây sau, gõ tay:',
      '$ curl -sS -o /dev/null -w "%{http_code}\\n" … https://phongkham.test/',
      '= 200',
    ], { title: 'lần 3 — ngay sau nginx -s reload', fs: 13 })}
    ${box('info', '<strong>nginx.org — Controlling nginx:</strong> HUP làm master kiểm cú pháp, mở socket nghe mới, <em>khởi động worker mới</em> rồi mới cho worker cũ tắt dần. Lệnh <code>nginx -s reload</code> chỉ GỬI tín hiệu rồi thoát.')}
    ${box('good', 'Trên máy thứ hai script in <code>(lan hoi thu 2)</code>: lần hỏi đầu vẫn trượt. Mọi thứ "ngay sau reload" — smoke-test, đo phiên bản — phải <strong>hỏi lại có hạn</strong>.')}`, 'l') },

  { t: 'Nghiệm thu Ngày 1 từ một máy khác', body: two(
    term([
      '$ curl -sI http://phongkham.test/ | head -3',
      'HTTP/1.1 301 Moved Permanently',
      'Server: nginx/1.24.0 (Ubuntu)',
      'Date: Tue, 29 Sep 2026 09:27:02 GMT',
      '$ curl -s --cacert pebble-root.pem https://phongkham.test/',
      '… <h1>Dat lich phong kham — sap ra mat</h1>',
      '$ echo | openssl s_client -connect phongkham.test:443 … \\',
      '  | openssl x509 -noout -subject -issuer -enddate -ext subjectAltName',
      'subject=',
      'issuer=CN = Pebble Intermediate CA 126f52',
      'notAfter=Oct  5 09:25:08 2026 GMT',
      'X509v3 Subject Alternative Name: critical',
      '    DNS:phongkham.test, DNS:www.phongkham.test',
    ], { title: 'dv15-vps2 → dv15-vps', fs: 12.5 }),
    `${term([
      '$ nmap -Pn -p- phongkham.test',
      '…',
      'Not shown: 65532 filtered tcp ports (no-response)',
      '= 22/tcp  open  ssh',
      '= 80/tcp  open  http',
      '= 443/tcp open  https',
      '$ ssh -o PreferredAuthentications=password … deploy@… true',
      'deploy@127.0.0.1: Permission denied (publickey).',
      '$ ssh deploy@… "sudo -l | tail -2"',
      'User deploy may run the following commands on phongkham-vps:',
      '    (root) NOPASSWD: /opt/phongkham/bin/phat-hanh.sh',
    ], { title: 'quét cổng + thử mật khẩu', fs: 12.5 })}
    ${box('tip', 'Bốn câu hỏi, bốn bằng chứng <strong>từ bên ngoài</strong>: HTTP chuyển sang HTTPS · chứng chỉ đúng tên · chỉ ba cổng · SSH không nhận mật khẩu.')}`, 'l') },

  /* ───────────── 15.2 ───────────── */
  { t: 'Một lần phát hành: VPS không build gì cả', body: diagram({
    w: 1150, h: 300,
    nodes: [
      { id: 'a', x: 0, y: 10, w: 250, h: 100, t: '① dựng', d: 'git archive HEAD\n| docker build -', c: 'blu', mono: true },
      { id: 'b', x: 300, y: 10, w: 250, h: 100, t: '② kiem-anh.sh', d: 'đúng nền arm64/amd64\nrequire() mọi thư viện\nkhởi động tới listen', c: 'amb', mono: true },
      { id: 'c', x: 600, y: 10, w: 230, h: 100, t: '③ docker push', d: 'registry\nphongkham:<commit>', c: 'vio', mono: true },
      { id: 'd', x: 880, y: 10, w: 270, h: 100, t: '④ ssh sudo', d: 'phat-hanh.sh <commit>\n(dòng sudoers duy nhất)', c: 'dv', mono: true },
      { id: 'e', x: 0, y: 180, w: 1150, h: 110, t: 'trên VPS: phat-hanh.sh (dưới flock)', d: 'pull → migrate.js MỘT lần → màu mới 127.0.0.1:300x → health → thử /api/lich-hen\n→ ghi đè upstream → nginx -s reload → chờ cửa trước nói đúng tag → dừng màu cũ → ghi sổ', c: 'grn' },
    ],
    edges: [
      { from: 'a', to: 'b', c: 'blu' }, { from: 'b', to: 'c', c: 'amb' }, { from: 'c', to: 'd', c: 'vio' },
      { from: 'd', to: 'e', c: 'dv', fs: 'b', ts: 't' },
    ],
  }) + table(['Chốt', 'Chặn được gì (đo trong chương)'], [
    ['cây làm việc phải sạch', 'deploy thứ chưa commit — <code>deploy-nha.sh</code> của dự án cũng chặn đúng chỗ này'],
    ['kiểm ảnh trước khi đẩy', 'ảnh Alpine mang thư viện glibc (15.4 sự cố 1)'],
    ['thử đường đọc trên màu mới', 'quên migration: 21 request 500 → 0'],
  ], { sm: true }) },

  { t: 'deploy.sh: chỉ bản đã commit mới được lên', body: two(
    sh([
      ['set -Eeuo pipefail', ''],
      ['trap \'echo "deploy: HONG o dong $LINENO: $BASH_COMMAND" >&2\' ERR', ''],
      ['cd "$(git rev-parse --show-toplevel)"', ''],
      ['REG=${REG:-localhost:19155}', 'thật: ghcr.io/…'],
      ['[ -z "$(git status --porcelain)" ] || { …; exit 2; }', 'cây phải sạch'],
      ['TAG=$(git rev-parse --short=7 HEAD)', 'tag = commit'],
      ['git archive HEAD | docker build -q \\', 'CHỈ nội dung đã commit'],
      ['  --platform linux/arm64 --build-arg BAN="$TAG" \\', 'VPS thật: amd64'],
      ['  -t "$REG/phongkham:$TAG" -', ''],
      ['ops/kiem-anh.sh "$REG/phongkham:$TAG"', 'hỏng ⇒ không đẩy'],
      ['docker push -q "$REG/phongkham:$TAG"', ''],
      ['$VPS_SSH "sudo /opt/phongkham/bin/phat-hanh.sh $TAG"', ''],
    ], { fs: 12.5 }),
    term([
      '① dung 2139d95 tu git archive (chi noi dung da commit)',
      '② kiem anh truoc khi day',
      '  thu vien nap duoc: pg',
      '  khoi dong duoc: phongkham 2139d95 nghe :3000',
      '  OK localhost:19155/phongkham:2139d95 (linux/arm64)',
      '③ day localhost:19155/phongkham:2139d95',
      '④ VPS keo + trao',
      '2026-09-29T09:34:33 2139d95 bat-dau mau=lam',
      'khong co migration moi',
      '  health xanh sau 2 s',
      '…',
      '  cua truoc (HTTPS) tra ban 2139d95',
      '= 2026-09-29T09:34:37 2139d95 OK mau=lam',
      'xong 2139d95 sau 12 s',
      '# dv15-vps2 cùng lúc: 917 request · 917 × 200',
    ], { title: 'Mac → VPS, lần phát hành thứ hai', fs: 12.5 }), 'l') },

  { t: 'phat-hanh.sh: khoá, migration, màu mới', body: two(
    sh([
      ['exec 9>/run/phongkham-phat-hanh.lock', 'mở fd 9 trên tệp khoá'],
      ['flock -n 9 || { echo "TU CHOI: …"; exit 3; }', 'không chờ: từ chối'],
      ['docker pull -q "$KHO:$TAG"', ''],
      ['docker run --rm --network phongkham \\', 'migration MỘT lần,'],
      ['  --env-file "$ENV" "$KHO:$TAG" node migrate.js', 'TRƯỚC khi API mới lên'],
      ['docker run -d --name "pk-$moi" … \\', ''],
      ['  -p "127.0.0.1:$cong:3000" --memory 256m "$KHO:$TAG"', 'chỉ loopback'],
      ['curl -fsS "http://127.0.0.1:$cong/api/health"', 'lặp tới 20 s'],
      ['curl -fsS "http://127.0.0.1:$cong/api/lich-hen"', 'đường đọc THẬT'],
      ['cat > "$UP" <<< "server 127.0.0.1:$cong;"', 'ghi đè TẠI CHỖ'],
      ['nginx -t -q && nginx -s reload', ''],
      ['cho_ban "$TAG"', 'cửa trước nói đúng bản'],
      ['docker stop -t 20 "pk-$cu"', 'bản cũ xả rồi tắt'],
      ['ghi "$TAG OK mau=$moi"', 'sổ phát hành'],
    ], { fs: 12.5 }),
    `${code(`-- migrate.js: khoá MỘT lần, rồi mỗi tệp một giao dịch
select pg_advisory_lock(15);   -- ai tới sau thì chờ
begin;
set local lock_timeout = '5s'; -- chờ khoá > 5 s thì bỏ
-- <nội dung 002_ho_ten_mo_rong.sql>
insert into schema_migrations (ten)
  values ('002_ho_ten_mo_rong.sql');
commit;`, 'sql')}
    ${table(['Tệp trên VPS', 'Của ai · để làm gì'], [
      ['<code>/etc/phongkham/phongkham.env</code>', 'root 600 · mật khẩu DB, sinh một lần'],
      ['<code>/etc/nginx/phongkham-upstream.conf</code>', 'một dòng <code>server 127.0.0.1:300x;</code>'],
      ['<code>/etc/phongkham/mau-dang-chay</code>', '<code>xanh</code> | <code>lam</code>'],
      ['<code>/var/log/phongkham/phat-hanh.log</code>', 'mỗi lần: bat-dau / OK / HONG'],
    ], { sm: true })}`, 'l') },

  { t: 'Xanh/lam: tráo bằng một dòng upstream', body: xanhLam() },

  { t: 'Mỗi lần hỏng dạy script một điều', body: table(['Tag', 'Chuyện gì (sổ + dem.sh trên vps2)', 'Khách thấy', 'Script học được'], [
    ['10e26b6', '<code>curl: (60) SSL certificate problem</code> ở smoke — VPS chưa tin CA của lab', '-<span>502 (lần đầu, không có bản cũ)</span>', 'smoke đi qua đúng tên + HTTPS như khách'],
    ['10e26b6', 'lần 2: OK sau <strong>9 s</strong> · migration 001 đã chạy ở lần hỏng', '+200', 'migration chạy cả khi phát hành hỏng'],
    ['b19213a', '<code>SMOKE HONG: cua truoc tra ban=10e26b6</code> — hỏi ngay sau reload', '-<span>902 × 200 · <strong>4 × 502</strong></span>', '<code>cho_ban</code>: hỏi lại tới 10 s'],
    ['2139d95', 'OK sau 12 s', '+917 × 200', ''],
    ['4f67bce', 'quên migration: health xanh, <code>/api/lich-hen</code> 500 SAU khi tráo', '-<span>874 × 200 · <strong>21 × 500</strong></span>', 'thử đường đọc TRƯỚC khi tráo'],
    ['bb00bfd', 'cùng lỗi, chặn trước: <code>HONG thu-truoc (chua khach nao thay)</code>', '+957 × 200', ''],
    ['ef8f9c5', 'thêm <code>003_so_dien_thoai.sql</code>, OK sau 14 s', '+897 × 200', ''],
  ], { sm: true }) + box('info', '<code>dem.sh</code> trên dv15-vps2 gọi <code>https://phongkham.test/api/lich-hen</code> liên tục (mỗi request một kết nối mới, như trình duyệt mới mở) trong 25 s, từ lúc trước tới lúc sau mỗi lần phát hành.') },

  { t: 'Bắt lỗi trước khi khách thấy: 21 → 0', body: two(
    term([
      '2026-09-29T09:35:11 4f67bce bat-dau mau=xanh',
      '  health xanh sau 2 s',
      '…',
      '! curl: (22) The requested URL returned error: 500',
      'SMOKE HONG: cua truoc tra ban=4f67bce (can 4f67bce)',
      '2026-09-29T09:35:15 4f67bce HONG smoke',
      '# dv15-vps2: 895 request trong 25 s:',
      '    874 200',
      '!     21 500',
    ], { title: 'trước: kiểm SAU khi nginx trỏ sang', fs: 12.5 }),
    `${term([
      '2026-09-29T09:35:52 bb00bfd bat-dau mau=xanh',
      '  health xanh sau 2 s',
      '--- mau moi tra loi o /api/lich-hen:',
      '! {"loi":"column \\"so_dien_thoai\\" does not exist"}',
      '2026-09-29T09:35:54 bb00bfd HONG thu-truoc (chua khach nao thay)',
      '# dv15-vps2: 957 request trong 25 s:',
      '=     957 200',
    ], { title: 'sau: kiểm màu mới TRƯỚC khi trỏ', fs: 11.5 })}
    ${box('warn', '<code>/api/health</code> chỉ <code>select 1</code> — nó KHÔNG biết cột nào thiếu. Health nói "sống"; chỉ đường đọc thật nói "đúng".')}`, 'l') },

  { t: 'Khoá chặn deploy chồng — và | head giết deploy', body: two(
    `${term([
      '$ sudo phat-hanh.sh ef8f9c5 &',
      '$ sudo phat-hanh.sh 2139d95; echo "exit=$?"',
      '! TU CHOI: mot lan phat hanh khac dang chay (khoa /run/phongkham-phat-hanh.lock)',
      'exit=3',
    ], { title: 'hai lần phát hành cùng lúc, có flock', fs: 12.5 })}
    ${box('info', '<code>flock -n</code>: không lấy được khoá thì thoát NGAY với mã khác 0. Khoá gắn với fd 9 của tiến trình: script chết thì nhân tự nhả — không có tệp khoá "mồ côi" phải xoá tay.')}`,
    `${term([
      '$ ssh vps "sudo phat-hanh.sh lui 2>&1 | head -2"',
      'lui: 2139d95 -> ef8f9c5',
      '2026-09-29T09:37:40 ef8f9c5 bat-dau mau=lam',
      "$ sed -n '/09:37:2/,$p' …/phat-hanh.log",
      '2026-09-29T09:37:25 2139d95 OK mau=xanh',
      '! 2026-09-29T09:37:40 ef8f9c5 bat-dau mau=lam',
      '2026-09-29T09:37:53 10e26b6 bat-dau mau=lam',
      '# 09:37:40 không có OK, không có HONG: chết giữa chừng',
    ], { title: 'đo thật: head đóng ống ⇒ SIGPIPE', fs: 12.5 })}
    ${box('bad', '<code>head -2</code> đọc đủ hai dòng rồi thoát; lần <code>echo</code> kế tiếp của script ghi vào ống không còn ai đọc ⇒ nhận <strong>SIGPIPE</strong> và chết. Đừng bao giờ <code>| head</code> một lệnh làm thay đổi hệ thống. Muốn xem ít: chuyển hướng vào tệp rồi <code>tail</code>.')}`, 'l') },

  /* ───────────── 15.3 ───────────── */
  { t: 'Lùi bản: 3,7 giây — và lỗi lùi hai lần', body: two(
    `${term([
      '$ time sudo phat-hanh.sh lui',
      'lui: ef8f9c5 -> 2139d95',
      '2026-09-29T09:37:21 2139d95 bat-dau mau=xanh',
      '  health xanh sau 2 s',
      '…',
      '  cua truoc (HTTPS) tra ban 2139d95',
      '= 2026-09-29T09:37:25 2139d95 OK mau=xanh',
      'real    0m3.709s',
      '# dv15-vps2: 782 request trong 20 s: 782 × 200',
    ], { title: 'lùi lần 1', fs: 12.5 })}
    ${term([
      '$ sudo phat-hanh.sh lui      # lùi thêm một bậc?',
      '! lui: 2139d95 -> ef8f9c5',
    ], { title: 'lùi lần 2 — đi TỚI, không đi lui', fs: 12.5 })}`,
    `${sh([
      ['# SAI: "OK gần nhất khác bản đang chạy"', ''],
      ['awk -v d="$dang" \'$3=="OK" && $2!=d {t=$2} END{print t}\'', ''],
      ['', ''],
      ['# ĐÚNG: thứ tự = lần OK ĐẦU TIÊN của mỗi tag', ''],
      ['awk \'$3=="OK" && !thay[$2]++ {print $2}\' "$SO" \\', '10e26b6 2139d95 ef8f9c5'],
      ['  | grep -B1 -x "$dang" | head -n -1 | tail -1', 'tag đứng TRƯỚC'],
    ], { fs: 12.5 })}
    ${term([
      'lui: 2139d95 -> 10e26b6',
      '2026-09-29T09:37:57 10e26b6 OK mau=lam',
      'khong co ban nao truoc 10e26b6 de lui',
    ], { title: 'sau khi sửa: ba lần lùi liên tiếp', fs: 12.5 })}
    ${box('warn', 'Bản đang chạy lúc đó là <code>10e26b6</code> — bản <strong>đầu tiên</strong>, trên lược đồ đã có <code>ho_ten</code> và <code>so_dien_thoai</code>. Nó chạy được vì mọi migration tới đó đều là MỞ RỘNG.')}`, 'l') },

  { t: 'Mở rộng thì lùi được, thu hẹp thì đóng cửa', body: cotDb() + two(
    term([
      'migration 004_bo_ten_benh_nhan.sql xong (67 ms)',
      '= 2026-09-29T09:46:45 07630fa OK mau=lam',
      '# dv15-vps2 trong lúc đó: 908 request',
      '    861 200',
      '!     47 500',
    ], { title: 'thu hẹp CÙNG bản với đổi mã — sổ báo OK', fs: 12.5 }),
    term([
      '$ sudo phat-hanh.sh lui',
      'lui: 07630fa -> 95b548d',
      '--- mau moi tra loi o /api/lich-hen:',
      '! {"loi":"column \\"ten_benh_nhan\\" does not exist"}',
      '95b548d HONG thu-truoc (chua khach nao thay)',
      'exit=4',
    ], { title: 'lùi sau khi đã xoá cột', fs: 12.5 }), 'l') },

  { t: 'Sao lưu: kiểm ngay, giữ 7, không ai khác đọc được', body: two(
    `${sh([
      ['umask 027', 'tệp mới: 640, thư mục 750'],
      ['docker exec pk-db pg_dump -U postgres -Fc postgres > "$F.tmp"', ''],
      ['docker exec -i pk-db pg_restore -l < "$F.tmp" \\', 'đọc được mục lục'],
      ["  | grep -q 'TABLE DATA public lich_hen'", 'có dữ liệu bảng chính'],
      ['chgrp saoluu "$F.tmp"; mv "$F.tmp" "$F"', 'chỉ bản ĐÃ KIỂM có tên'],
      ['ln -sfn "$(basename "$F")" "$D/moi-nhat.dump"', ''],
      ['ls -1t "$D"/pk-*.dump | tail -n +8 | while read -r cu; do', 'giữ 7'],
      ['  rm -f "$cu" "$cu.sha256"; done', ''],
    ], { fs: 12.5 })}
    ${term([
      '2026-09-29T09:38:47 OK pk-20260929-093846.dump 3.4M 433 ms',
      '! -rw-r--r-- 1 root root   3505255 … pk-20260929-093846.dump',
    ], { title: 'lần chạy đầu: ai trên máy cũng ĐỌC được CSDL', fs: 12.5 })}`,
    `${term([
      '$ ls -la /var/backups/phongkham/',
      'drwxr-x--- 2 root saoluu    4096 … .',
      'lrwxrwxrwx 1 root root        23 … moi-nhat.dump -> pk-…',
      '-rw-r----- 1 root saoluu 3505255 … pk-20260929-094238.dump',
      '-rw-r----- 1 root root        65 … pk-20260929-094238.dump.sha256',
      '$ sudo -u deploy cat /var/backups/phongkham/moi-nhat.dump',
      '! cat: /var/backups/phongkham/moi-nhat.dump: Permission denied',
      '# chạy 9 lần liên tiếp → còn đúng 7 tệp pk-*.dump',
    ], { title: 'sau khi sửa', fs: 11 })}
    ${box('info', '300 000 lịch hẹn (CSDL 42 MB) → dump nén 3,4 MB trong 0,4–0,6 s. Hẹn giờ: timer systemd như <strong>Linux 16.3</strong> (VPS thí nghiệm không có systemd — chạy tay và bằng vòng lặp).')}`, 'l') },

  { t: 'Kéo chứ đừng đẩy: một khoá chỉ làm một việc', body: `${conf([
    ['restrict,command="cat /var/backups/phongkham/moi-nhat.dump" ssh-ed25519 AAAAC3Nz… keo-sao-luu@vps2', ''],
  ], { fs: 13.5 })}` + two(
    term([
      '$ ssh -T -i keo keo@phongkham.test "cat /etc/passwd" | head -c 5 | od -c',
      '= 0000000   P   G   D   M   P',
      '# ↑ lệnh xin bị BỎ QUA: forced command luôn là cat bản dump',
      '$ ssh -i keo -N -L 15432:pk-db:5432 keo@phongkham.test',
      '! channel 2: open failed: administratively prohibited: open failed',
    ], { title: 'dv15-vps2 thử vượt quyền', fs: 12.5 }),
    `${table(['Tuỳ chọn', 'Nghĩa (sshd(8))'], [
      ['<code>command="…"</code>', 'mọi phiên đều chạy lệnh này, bất kể client xin gì'],
      ['<code>restrict</code>', 'tắt chuyển tiếp cổng, agent, X11, PTY, <code>~/.ssh/rc</code>'],
      ['nhóm <code>saoluu</code>', 'người dùng <code>keo</code> đọc được bản dump, không gì khác'],
    ], { sm: true })}
    ${box('tip', '<strong>Ch10.7:</strong> máy dự phòng KÉO về. VPS bị chiếm thì kẻ đó không có khoá nào để xoá bản sao ở máy kia.')}`, 'l') },

  { t: 'Phục hồi bấm giờ: 100,8 s — 95 s là kéo ảnh', body: phucHoi() + two(
    term([
      '  ① keo ban sao luu (3.4M)            202 ms',
      '  ② CSDL trong san sang              1898 ms',
      '  ③ pg_restore xong                  2827 ms',
      '  ④ API ban 95b548d len, health xanh   3350 ms',
      '{"id":"300000","ho_ten":"Benh nhan 300000"}',
      '= ⑤ tra du lieu that: 300000 lich hen   3423 ms',
    ], { title: 'phuc-hoi.sh trên dv15-vps2', fs: 12 }),
    term([
      '  ② CSDL trong san sang              3299 ms',
      '! pg_restore: error: could not execute query: FATAL:  terminating',
      '!   connection due to administrator command',
      '# entrypoint dựng máy chủ TẠM (chỉ unix socket) rồi tắt nó;',
      '# pg_isready không -h báo "sẵn sàng" cho chính máy TẠM đó',
      '$ until docker exec ph-db pg_isready -q -h 127.0.0.1; do …',
    ], { title: 'lần 3 — phục hồi NÓI DỐI', fs: 11.5 }), 'l') },

  { t: 'Canh từ máy ngoài, chỉ báo khi đổi trạng thái', body: two(
    sh([
      ['ma=$(curl -s -o /dev/null -w \'%{http_code}\' \\', 'như khách: tên + HTTPS'],
      ['     --max-time 5 "$URL")', ''],
      ['het=$(… openssl s_client … | openssl x509 -noout -enddate)', 'hạn chứng chỉ TRÊN DÂY'],
      ['if [ "$ma" = 200 ]; then dem=0; moi=LEN', ''],
      ['else dem=$((dem+1)); [ "$dem" -ge 2 ] && moi=SAP; fi', 'hỏng 2 lần mới tính'],
      ['[ "$con" -lt 3 ] && moi=CHUNG-CHI-SAP-HET', ''],
      ['[ "$moi" != "$cu" ] && curl -X POST "$HOOK" -d …', 'chỉ báo khi ĐỔI'],
      ['read -r cu dem 2>/dev/null < "$F"', '2> đứng TRƯỚC <'],
    ], { fs: 12.5 }),
    `${term([
      '09:47:26 ma=200 dem=0 LEN->LEN cert=5d',
      '# 09:47:28 docker stop pk-lam',
      '09:47:28 ma=502 dem=1 LEN->LEN cert=5d',
      '! 09:47:30 ma=502 dem=2 LEN->SAP cert=5d',
      '09:47:33 ma=502 dem=3 SAP->SAP cert=5d',
      '= 09:47:37 ma=200 dem=0 SAP->LEN cert=5d',
    ], { title: 'canh.sh trên dv15-vps2 (gọi 2 s/lần để đo)', fs: 12.5 })}
    ${term([
      '09:47:30 POST /canh {"text":"phongkham: LEN -> SAP (ma 502, …)"}',
      '09:47:37 POST /canh {"text":"phongkham: SAP -> LEN (ma 200, …)"}',
    ], { title: 'dv15-hook — hai tin, không phải năm', fs: 11.5 })}`, 'l') },

  /* ───────────── 15.4 ───────────── */
  { t: 'Runbook một trang: trước, trong, sau', body: cards([
    { ic: '🧭', t: 'Trước (5 phút)', d: '<strong>cây sạch</strong>, đúng nhánh · <code>df -h /</code> &gt; 20% · bản sao lưu &lt; 24 h và đã thử <code>pg_restore -l</code> · migration là MỞ RỘNG? · biết tag để lùi · báo nhóm, không deploy 22:00 hôm trước bảo vệ', c: 'blu' },
    { ic: '🚀', t: 'Trong (1 lệnh)', d: '<code>ops/deploy.sh</code> — không <code>| head</code>, không hai người cùng lúc · đọc từng chặng ① → ④ · HỎNG thì <strong>dừng lại đọc</strong>, không chạy lại mù', c: 'grn' },
    { ic: '🔎', t: 'Sau (10 phút)', d: 'từ máy khác: <code>curl https://…/api/version</code> đúng tag · đường đọc 200 · <code>docker ps</code> không <code>Restarting</code> · log 5 phút không lặp lỗi · <code>canh.sh</code> xanh', c: 'tea' },
    { ic: '↩️', t: 'Lùi khi nào', d: 'lỗi người dùng thấy mà không sửa được trong 15 phút · <code>phat-hanh.sh lui</code> (3,7 s) · migration THU HẸP đã chạy ⇒ lùi bị chặn ⇒ sửa tới, hoặc phục hồi (3,4 s + chờ)', c: 'amb' },
  ], 4) + box('info', 'Viết thành <code>RUNBOOK.md</code> ngay trong kho. Người đọc nó lúc 2 giờ sáng là bạn — đang mệt, đang hoảng, và không nhớ gì về tuần trước.') },

  { t: 'Tám sự cố kinh điển, dựng lại thật', body: table(['#', 'Triệu chứng', 'Lệnh chẩn đoán đầu tiên', 'Học ở'], [
    ['1', 'API 502, container <code>Restarting (1)</code>', '<code>docker logs --tail 20</code> · <code>ls /lib/ld-*</code> trong ảnh', 'Ch13.2 · Ch11'],
    ['2', '<code>no space left on device</code>, DB không ghi được', '<code>df -h</code> · <code>docker system df</code>', 'Ch8.4 · Ch13.2'],
    ['3', 'cổng DB <code>open</code> từ Internet dù ufw bật', '<code>nmap</code> từ máy khác · <code>ss -tlnp</code>', 'Ch12.3'],
    ['4', '<code>curl: (60) … certificate has expired</code>', '<code>openssl x509 -checkend</code> · <code>certbot certificates</code>', 'Ch12.2'],
    ['5', 'route mới 404 dù "deploy thành công"', '<code>/api/version</code> · <code>docker inspect … Created</code>', 'Ch13.1 · Ch11.3'],
    ['6', 'sửa nginx.conf, <code>nginx -t</code> xanh, không gì đổi', '<code>sha256sum</code> host vs <code>docker exec</code>', 'Ch13.1'],
    ['7', 'sổ nói bản A, cửa trước trả bản B, vài 502', 'đọc sổ phát hành · <code>/api/version</code>', 'Ch7.3'],
    ['8', 'mọi request treo, rồi 000 / 504', '<code>pg_stat_activity</code> + <code>pg_blocking_pids()</code>', 'Ch5.3'],
  ], { sm: true }) + box('tip', 'Mỗi sự cố đi theo đúng một khuôn: <strong>triệu chứng → lệnh chẩn đoán → cứu → phòng → chương liên quan</strong>. Cứu là để tối nay ngủ được; phòng là để không có tối sau.') },

  { t: 'Sự cố 1–2: ảnh sai libc · đĩa đầy', body: two(
    `${term([
      '$ docker ps --filter name=thu-libc --format "{{.Names}}  {{.Status}}"',
      '! thu-libc  Restarting (1) 4 seconds ago',
      '$ docker inspect -f "RestartCount={{.RestartCount}} …" thu-libc',
      'RestartCount=7 ExitCode=1',
      '$ docker logs thu-libc 2>&1 | grep -m2 …',
      'Error: Failed to load native binding',
      "!     Error: Cannot find module '@node-rs/bcrypt-linux-arm64-musl'",
      '$ docker run --rm --entrypoint sh ANH -c "ls /lib/ld-*"',
      '/lib/ld-musl-aarch64.so.1',
      '# node_modules có …-linux-arm64-gnu: cài trên Debian, chạy trên Alpine',
    ], { title: '1 · dựng trên bookworm, chạy trên alpine', fs: 12 })}
    ${box('good', '<strong>Phòng:</strong> cài và chạy trên CÙNG một nền; <code>kiem-anh.sh</code> <code>require()</code> mọi thư viện TRONG ảnh — ảnh này bị chặn trước <code>docker push</code>.')}`,
    `${term([
      '09:58:17 lan 1: dung xong ·  1.1G  279M  80%',
      '09:58:24 lan 2: HONG',
      '! failed to apply diff: … .next-cache: no space left on device',
      '! 09:58:23 db: ERROR:  could not extend file "base/5/16385":',
      '!   No space left on device',
      '/dev/loop0      1.5G  1.4G     0 100% /var/lib/docker-nho',
      '# 10 s một app ồn ào; daemon KHÔNG có log-opts:',
      '! 289M …/9f5806a21041…-json.log',
      '# cùng app trên VPS (max-size 10m, max-file 3):',
      '= 8.2M …-json.log · 9.6M ….log.1 · 9.6M ….log.2',
    ], { title: '2 · dựng TRÊN máy chủ, chung đĩa với Postgres', fs: 12 })}`, 'l') },

  { t: 'Sự cố 3–4: cổng DB lộ · chứng chỉ hết hạn', body: two(
    `${term([
      '$ docker run -d … -p 5432:5432 postgres:16-alpine   # "cho DBeaver"',
      '$ nmap -Pn -p 22,80,443,5432,3001,3002 phongkham.test  # vps2',
      '= 22/tcp   open     ssh',
      '…',
      '3001/tcp filtered nessus',
      '3002/tcp filtered exlm-agent',
      '! 5432/tcp open     postgresql',
      '$ docker run --rm -e PGPASSWORD=12345 postgres:16-alpine \\',
      '    psql -h 172.22.15.10 -U postgres -Atc "select …" | cut -c1-60',
      '! vao duoc: PostgreSQL 16.15 on aarch64-unknown-linux-musl, co',
      '# sửa: -p 127.0.0.1:5432:5432',
      '= 5432/tcp filtered postgresql',
    ], { title: '3 · ufw đang active', fs: 12 })}`,
    `${term([
      '$ curl -sS https://phongkham.test/api/health',
      '! curl: (60) SSL certificate problem: certificate has expired',
      '$ certbot certificates',
      '!     Expiry Date: 2026-09-29 10:04:41+00:00 (INVALID: EXPIRED)',
      '$ curl -s -o /dev/null -w … 127.0.0.1:3001/api/health',
      '= tu trong VPS qua 127.0.0.1:3001 -> 200',
      '# /etc/cron.d/certbot: test … -a \\! -d /run/systemd/system && …',
      '# không có cron, không có systemd ⇒ KHÔNG AI gọi certbot renew',
    ], { title: '4 · chứng chỉ Pebble 4 phút, không ai gia hạn', fs: 12 })}
    ${box('good', '<code>canh.sh</code> báo <code>CHUNG-CHI-SAP-HET</code> lúc 10:00:51 — bốn phút TRƯỚC khi khách thấy lỗi. Kiểm tra từ bên trong vẫn 200.')}`, 'l') },

  { t: 'Sự cố 5–6: --no-build · bind-mount theo inode', body: two(
    `${term([
      '# sửa app.js: thêm /api/bac-si, "ban 2"',
      '$ docker compose up -d --no-build',
      '!  Container su-co-5-api-1  Running',
      '/api/version -> 200',
      '! /api/bac-si -> 404',
      'anh dang chay tao luc 2026-09-29T10:05:38',
      'app.js sua luc 2026-09-29 10:05:39',
      '$ docker compose up -d --build',
      '= /api/bac-si -> 200',
    ], { title: '5 · "deploy xanh" mà vẫn ảnh cũ', fs: 12 })}
    ${box('tip', '<strong>404 = route chưa có = ảnh cũ</strong>; 401/200 = có route. Smoke-test hỏi <code>/api/version</code> phải khớp đúng tag vừa đẩy.')}`,
    `${term([
      'inode truoc: 148365',
      '$ sed -i \'s/X-Ban "1"/X-Ban "2"/\' nginx.conf',
      'inode sau sed -i: 149463',
      'nginx: configuration file … test is successful',
      '! X-Ban: 1',
      'tren may:        X-Ban "2"   sha=60d52c9bf864',
      '! trong container: X-Ban "1"   sha=df715bd85d8a',
      '# tạo lại container một lần, rồi chỉ ghi đè TẠI CHỖ:',
      '$ cat /tmp/moi.conf > nginx.conf    # inode giữ nguyên',
      '= X-Ban: 3',
    ], { title: '6 · bind-mount MỘT tệp gắn theo inode', fs: 12 })}`, 'l') },

  { t: 'Sự cố 7–8: chạy chồng · migration kẹt khoá', body: two(
    `${term([
      '2026-09-29T09:51:58 85065be bat-dau mau=lam',
      '2026-09-29T09:51:59 3c65eb7 bat-dau mau=lam',
      '2026-09-29T09:52:02 85065be OK mau=lam',
      '! Error response from daemon: No such container: pk-xanh',
      '! 2026-09-29T09:52:03 3c65eb7 HONG dong 67: docker stop …',
      '$ curl -s https://phongkham.test/api/version',
      '! {"ban":"3c65eb7"}',
      '# sổ nói 85065be; khách nhận 3c65eb7; 12 × 502',
    ], { title: '7 · bỏ flock, hai lần phát hành cách 1 s', fs: 12 })}
    ${box('bad', 'Cả hai đọc <code>mau-dang-chay</code> trước khi ai ghi ⇒ cùng chọn <code>lam</code> ⇒ lần sau xoá container lần trước vừa dựng. Sổ giờ <strong>nói dối</strong>.')}`,
    `${table(['pid', 'bi_chan_boi', 'state', 'cho', 'da_cho', 'cau'], [
      ['442', '{}', '!idle in transaction', 'Client', '00:00:11.169675', 'select count(*)'],
      ['446', '-{442}', 'active', 'Lock', '00:00:07.791297', 'ALTER TABLE'],
      ['445', '{446}', 'active', 'Lock', '00:00:07.783704', 'select (API)'],
      ['448', '{446}', 'active', 'Lock', '00:00:04.759105', 'select (API)'],
    ], { sm: true })}
    ${term([
      '$ select pg_terminate_backend(442);',
      't',
      'migration 006_chi_nhanh.sql xong (14050 ms)',
      '# lần trước, có lock_timeout 5s:',
      '! … HONG: canceling statement due to lock timeout',
      '# bản cũ vẫn phục vụ · 574 × 200 · 1 × 000',
    ], { title: '8 · một phiên "idle in transaction" giữ bảng', fs: 12 })}`, 'l') },

  { t: 'Sai lầm hay gặp ở dự án cuối khoá', body: table(['Việc làm', 'Đo được gì', 'Làm thay bằng'], [
    ['Gõ tay Ngày 1 theo trí nhớ', '5 lần chạy mới đúng — mỗi lần một lỗi chỉ lộ trên máy mới', 'script chạy lại được, thử trên máy trống'],
    ['<code>cmd1 &amp;&amp; cmd2</code> cho bước bắt buộc', '<code>visudo</code> hỏng mà script đi tiếp', 'lệnh kiểm đứng riêng dưới <code>set -e</code>'],
    ['Smoke ngay sau <code>nginx -s reload</code>', 'đọc được bản CŨ ⇒ lùi oan, 4 × 502', 'hỏi lại có hạn tới khi đúng tag'],
    ['Chỉ kiểm <code>/api/health</code>', 'health xanh, 21 × 500 ở đường đọc', 'thử đường đọc thật TRƯỚC khi tráo'],
    ['Thu hẹp cùng bản với đổi mã', '47 × 500; lùi bị chặn', 'mở rộng → đổi mã → (sau) thu hẹp'],
    ['<code>… | head</code> một lệnh deploy', 'SIGPIPE giết script giữa chừng', 'ghi ra tệp, đọc bằng <code>tail</code>'],
    ['Tin <code>pg_isready</code> lúc khởi tạo', 'pg_restore bị cắt giữa chừng', '<code>pg_isready -h 127.0.0.1</code>'],
    ['Máy dự phòng "trống trơn"', '95 / 100,8 s là kéo ảnh', 'kéo sẵn ảnh, tập phục hồi mỗi tháng'],
    ['Kiểm từ trong VPS', '200 bên trong, chứng chỉ đã hết hạn bên ngoài', 'canh từ máy KHÁC, qua tên + HTTPS'],
  ], { sm: true }) },

  { t: 'Bảng tra nhanh (1/2): dựng và phát hành', body: two(
    sh([
      ['DEBIAN_FRONTEND=noninteractive apt-get install -y …', 'không hỏi gì'],
      ['visudo -cqf tep && install -m 440 …', 'kiểm sudoers TRƯỚC'],
      ['sshd -t && systemctl reload ssh', 'rồi thử mật khẩu từ ngoài'],
      ['ufw allow 22,80,443/tcp && ufw --force enable', ''],
      ['certbot certonly --webroot -w DIR -d ten', '+ --deploy-hook reload'],
      ['nmap -Pn -p- ten   # từ máy khác', 'chỉ 22/80/443'],
      ['git archive HEAD | docker build -t R/app:$TAG -', 'chỉ bản đã commit'],
      ['docker image inspect -f \'{{.Os}}/{{.Architecture}}\'', 'đúng nền VPS'],
      ['docker run --rm --init ANH node -e "require(…)"', 'thư viện nạp được'],
    ], { fs: 12.5 }),
    sh([
      ['exec 9>/run/app.lock; flock -n 9 || exit 3', 'từng người một'],
      ['docker run --rm … ANH node migrate.js', 'migration MỘT lần'],
      ['docker run -d -p 127.0.0.1:3002:3000 …', 'màu mới'],
      ['curl -fsS 127.0.0.1:3002/api/lich-hen', 'TRƯỚC khi tráo'],
      ['cat > up.conf <<< "server 127.0.0.1:3002;"', 'tại chỗ'],
      ['nginx -t -q && nginx -s reload', ''],
      ['cho_ban "$TAG"   # hỏi lại tới 10 s', ''],
      ['docker stop -t 20 pk-cu', 'xả rồi tắt'],
      ['sudo phat-hanh.sh lui', '3,7 s'],
    ], { fs: 12.5 }), 'l') },

  { t: 'Bảng tra nhanh (2/2): sao lưu, canh, sự cố', body: two(
    sh([
      ['umask 027; pg_dump -Fc … > f.tmp', ''],
      ['pg_restore -l < f.tmp | grep -q "TABLE DATA"', 'kiểm rồi mới mv'],
      ['ssh -T -i keo keo@vps > pk.dump', 'KÉO từ máy khác'],
      ['pg_isready -q -h 127.0.0.1', 'máy chủ THẬT, không TẠM'],
      ['pg_restore -d postgres --no-owner --exit-on-error', ''],
      ['curl -s -o /dev/null -w "%{http_code}" https://ten/', 'canh như khách'],
      ['openssl x509 -noout -checkend $((3*86400))', 'còn ≥ 3 ngày?'],
    ], { fs: 12.5 }),
    `${sh([
      ['docker logs --tail 20 app', '1 · libc'],
      ['df -h; docker system df', '2 · đĩa'],
      ['nmap -Pn -p 5432 ip   # từ ngoài', '3 · cổng'],
      ['certbot certificates', '4 · chứng chỉ'],
      ['curl https://ten/api/version', '5 · ảnh cũ'],
      ['docker exec c sha256sum /etc/…', '6 · inode'],
      ['tail /var/log/phongkham/phat-hanh.log', '7 · chồng'],
      ['select pid, pg_blocking_pids(pid) …', '8 · khoá'],
    ], { fs: 12.5 })}`, 'l') },

  { t: 'Thực hành chương 15 (90 phút, VPS thí nghiệm)', body: table(['Chặng', 'Làm gì', 'Đạt khi'], [
    ['<strong>1. Ngày 1</strong> · 20′', 'container ubuntu:24.04 chỉ có sshd; chạy <code>ngay1.sh</code> hai lần', 'lần 2 toàn ✓; từ máy khác: 301, 200, ba cổng, mật khẩu bị từ chối'],
    ['<strong>2. Phát hành</strong> · 25′', 'registry:2 + <code>deploy.sh</code>; ba bản, một bản quên migration; <code>dem.sh</code> chạy song song', '+bản hỏng: <code>HONG thu-truoc</code>, 0 request lỗi'],
    ['<strong>3. Lùi + lược đồ</strong> · 15′', 'mở rộng → lùi (chạy) → thu hẹp → lùi (bị chặn)', 'giải thích được vì sao lần hai bị chặn'],
    ['<strong>4. Sao lưu</strong> · 15′', 'sao-luu.sh + khoá kéo + phuc-hoi.sh sang máy khác, bấm giờ 2 lần', 'số dòng khớp; biết chặng nào đắt nhất'],
    ['<strong>5. Sự cố</strong> · 15′', 'chọn 2 trong 8, dựng lại, viết postmortem 5 dòng', 'có triệu chứng · lệnh · cứu · phòng · chương'],
  ], { sm: true }) + two(
    box('info', '<strong>Dựng lab:</strong> VPS cần <code>--privileged</code> + volume cho <code>/var/lib/docker</code> (Docker lồng trên overlay báo <code>invalid argument</code>). Pebble có bí danh <code>pebble</code>; VPS có bí danh <code>phongkham.test</code>.'),
    box('warn', 'Không gọi Let\'s Encrypt thật, không quét máy người khác, không <code>docker login</code> vào registry thật. Xong: <code>docker rm -f</code> mọi thứ tên <code>dv15-</code>.')) },

  { t: 'Cả khoá trong một dự án', body: table(['Phần', 'Dự án này dùng ở đâu'], [
    ['Mục 0 · Ch1 tạo tác', 'ảnh = tạo tác, tag = commit, <code>git archive</code> chỉ lấy thứ đã commit'],
    ['Ch2 vận chuyển · Ch3 tráo', 'registry thay rsync; xanh/lam sau nginx, xả trước khi tắt'],
    ['Ch4 cấu hình · Ch5 migration', '<code>--env-file</code> ngoài ảnh; mở rộng/thu hẹp, <code>lock_timeout</code>, khoá tư vấn'],
    ['Ch6 lùi · Ch7 script', '<code>lui</code> theo thứ tự phát hành; <code>set -Eeuo</code>, <code>trap ERR</code>, <code>flock</code>, mã thoát có nghĩa'],
    ['Ch8 máy nhỏ · Ch9 giám sát', 'không build trên VPS, log 10m × 3; canh từ ngoài, báo khi đổi trạng thái'],
    ['Ch10 sao lưu · Ch11 chẩn đoán', 'kiểm ngay, kéo về, phục hồi bấm giờ; tám sự cố theo khuôn chữ ký'],
    ['Ch12 HTTPS · Ch13 container · Ch14 môi trường', 'ACME + tường lửa + DB không publish; kiểm ảnh trước khi đẩy; một ảnh, nhiều nơi chạy'],
  ], { sm: true }) + box('good', 'Bài thi 15.5: 20 câu tình huống trải từ Mục 0 tới Chương 15 — phần lớn là "bước nào hỏng?" và "lệnh nào kiểm?".') },
].map((s) => (s.kind === 'cover' ? s : { ...s, body: FIX + s.body })));
