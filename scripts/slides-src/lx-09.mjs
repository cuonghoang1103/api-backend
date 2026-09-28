/**
 * Linux & Bash · Deck lx-09 — Chương 9: Mạng & máy từ xa.
 *
 * MỌI output terminal trên slide là output THẬT, chạy 28/09/2026:
 *   • "Ubuntu" = container ubuntu:24.04 (arm64, bash 5.2.21, iproute2 6.1, curl 8.5.0, OpenSSH 9.6p1,
 *                rsync 3.2.7, BIND 9.18.39, ufw 0.36.2, nftables 1.0.9) trên Mac M1.
 *                Phòng thí nghiệm SSH: 3 container trên 2 mạng Docker riêng —
 *                  laptop (lx09-b, 172.21.0.3, người dùng `an`) ── lx09-net ── vps (lx09-a, 172.21.0.2, `deploy`)
 *                  vps ── lx09-priv (mạng nội bộ, không ra ngoài) ── db (lx09-c, 172.22.0.2, `admin`)
 *                Khoá ed25519 sinh trong thư mục nháp, KHÔNG đụng ~/.ssh của máy thật.
 *                ssh.socket + ufw + nftables: container Ubuntu 24.04 chạy systemd thật (--privileged, ngắn hạn).
 *   • "Fedora" = máy linux-nha (Fedora 44, curl 8.18, firewalld 2.4.4), người thường, không sudo.
 *   • "Mac"    = Mac M1, macOS 27, OpenSSH 10.3, curl 8.7.1, openrsync; đang ngồi ở MẠNG TRƯỜNG — nơi mọi gói
 *                tới 1.1.1.1 bị chặn (ping 100% mất, dig @1.1.1.1 timed out) nhưng web vẫn vào được.
 *
 * Hình tự vẽ (SVG nội tuyến): thang() thang 4 bậc chẩn đoán · dnsPath() đường đi một câu hỏi DNS (dig +trace thật) ·
 * reqTimeline() DNS → TCP → TLS → HTTP theo mốc curl -w thật · khoaSvg() khoá công khai/bí mật + khoá máy chủ ·
 * hamSvg() đường hầm -L/-R/-D + ProxyJump · thuTu() luật "giá trị ĐẦU TIÊN thắng" của sshd · annot() (chép lx-05).
 */
import { S, cover, sh, perms, term, mindmap, diagram, cards, box, steps, table, two, tree, sv, R, T, A, D, esc } from './_lx-chung.mjs';

export const deck = { key: 'lx-09', code: 'LINUX · CHƯƠNG 9', title: 'Mạng &amp; máy từ xa', sub: 'Linux & Bash · Chương 9' };

const MONO = 'SF Mono,Menlo,monospace';
const c = (k) => D[k] || k;
const FIX = '<style>.c-two>div>*+*{margin-top:12px}.c-t.sm{font-size:15.5px}.c-t.sm td,.c-t.sm th{padding:6px 10px}</style>';
const P = (t) => `<p style="font-size:14.5px;color:${D.mu};margin-top:6px;text-align:center">${t}</p>`;

/** annot(str, segs) — như lx-05: một dòng chữ đơn cách, ngoặc màu + nhãn dưới từng đoạn. */
const annot = (str, segs, { fs = 40, w = 1150, rowH = 58, y0 = 56, h } = {}) => {
  const cw = fs * 0.602;
  const x0 = Math.round((w - str.length * cw) / 2);
  let s = R(x0 - 22, y0 - fs - 6, str.length * cw + 44, fs + 28, { c: 'bd', fill: '#050806', r: 12, sw: 2 });
  let last = 0;
  const pieces = [];
  segs.slice().sort((a, b) => a.from - b.from).forEach((g) => {
    if (g.from > last) pieces.push([str.slice(last, g.from), '#e6edf3', last]);
    pieces.push([str.slice(g.from, g.to), c(g.c), g.from]);
    last = g.to;
  });
  if (last < str.length) pieces.push([str.slice(last), '#e6edf3', last]);
  pieces.forEach(([t, col, at]) => {
    s += `<text x="${(x0 + at * cw).toFixed(1)}" y="${y0}" font-size="${fs}" fill="${col}" font-family="${MONO}" font-weight="700" xml:space="preserve">${esc(t)}</text>`;
  });
  const rowsEnd = [];
  const by = y0 + 22;
  segs.forEach((g) => {
    const a = x0 + g.from * cw + 2, b = x0 + g.to * cw - 2, mid = (a + b) / 2;
    const half = Math.max(String(g.t).length * 17 * 0.56, String(g.d || '').length * 14.5 * 0.5) / 2 + 6;
    let r = 0;
    while (rowsEnd[r] !== undefined && rowsEnd[r] > mid - half - 8) r++;
    rowsEnd[r] = mid + half;
    const ly = by + 36 + r * rowH;
    const col = c(g.c);
    s += `<path d="M${a} ${by} L${a} ${by + 8} L${b} ${by + 8} L${b} ${by}" stroke="${col}" stroke-width="3" fill="none"/>`;
    s += `<path d="M${mid} ${by + 8} L${mid} ${ly - 18}" stroke="${col}" stroke-width="2" stroke-dasharray="4 4"/>`;
    s += T(mid, ly, g.t, { fs: 17, c: col, a: 'middle', b: true });
    if (g.d) s += T(mid, ly + 21, g.d, { fs: 14.5, c: 'mu', a: 'middle' });
  });
  return sv(w, h || by + 36 + rowsEnd.length * rowH + 4, s);
};

/* Slide 3 — thang 4 bậc: mỗi bậc một lệnh, bậc đầu tiên hỏng gọi tên tầng */
const thang = () => {
  const rows = [
    ['1', 'ping -c3 <IP>', 'có đường ra ngoài không?', 'ip route · ip -br link', 'blu'],
    ['2', 'ping -c3 <tên>', 'DNS có chạy không?', 'resolvectl · dig @…', 'vio'],
    ['3', 'nc -zv <tên> 443', 'CỔNG có ai nghe không?', 'ss -tlnp · tường lửa', 'amb'],
    ['4', "curl -sS -o /dev/null -w '%{http_code}'", 'ỨNG DỤNG có trả lời?', 'curl -v · log dịch vụ', 'grn'],
  ];
  let s = '';
  rows.forEach(([n, cmd, q, fix, col], i) => {
    const y = 300 - i * 96;
    s += R(0, y, 410, 78, { c: col, r: 10 });
    s += `<circle cx="34" cy="${y + 39}" r="19" fill="${D[col]}"/>` + T(34, y + 46, n, { fs: 19, a: 'middle', b: true, c: '#0a0f0c' });
    s += T(58, y + 32, cmd, { fs: cmd.length > 30 ? 13.5 : 16, b: true, mono: true });
    s += T(58, y + 58, q, { fs: 15, c: 'mu' });
    s += A(414, y + 39, 440, y + 39, { c: 'red', sw: 2 });
    s += T(446, y + 34, 'hỏng ở đây ⇒', { fs: 14, c: 'red' }) + T(446, y + 56, fix, { fs: 13, c: col, mono: true });
  });
  s += T(0, 404, '▲ leo từ dưới lên — bậc ĐẦU TIÊN hỏng là tầng cần sửa', { fs: 15, c: 'lx' });
  return sv(690, 412, s);
};

/* Slide 6 — 127.0.0.1 so với 0.0.0.0 */
const bindSvg = () => {
  let s = '';
  s += R(360, 10, 460, 300, { c: 'lx', fill: 'rgba(245,183,0,.05)', r: 14, dash: true });
  s += T(380, 38, 'máy chủ 172.21.0.4', { fs: 16, b: true, c: 'lx' });
  s += R(390, 60, 400, 90, { c: 'red', r: 10 }) + T(410, 90, 'python3 :19090', { fs: 16, b: true, mono: true }) + T(410, 116, 'gắn 127.0.0.1 — chỉ loopback', { fs: 14.5, c: 'red' }) + T(410, 138, 'cửa nhìn VÀO TRONG máy', { fs: 13.5, c: 'mu' });
  s += R(390, 190, 400, 90, { c: 'grn', r: 10 }) + T(410, 220, 'python3 :19091', { fs: 16, b: true, mono: true }) + T(410, 246, 'gắn 0.0.0.0 — MỌI giao diện', { fs: 14.5, c: 'grn' }) + T(410, 268, 'eth0 · docker0 · lo …', { fs: 13.5, c: 'mu' });
  s += R(0, 120, 250, 90, { c: 'blu', r: 10 }) + T(20, 152, 'máy khác (laptop)', { fs: 16, b: true }) + T(20, 176, '172.21.0.3', { fs: 14.5, c: 'mu', mono: true }) + T(20, 198, 'đi qua eth0', { fs: 13.5, c: 'mu' });
  s += A(252, 150, 384, 108, { c: 'red', dash: true }) + T(262, 110, '✗ refused', { fs: 15, c: 'red', b: true, mono: true });
  s += A(252, 180, 384, 232, { c: 'grn' }) + T(270, 238, '✓ 200', { fs: 15, c: 'grn', b: true, mono: true });
  s += R(860, 60, 280, 90, { c: 'tea', r: 10 }) + T(880, 92, 'curl localhost:19090', { fs: 14.5, b: true, mono: true }) + T(880, 118, 'CHÍNH máy chủ ⇒ 200', { fs: 14.5, c: 'grn' }) + T(880, 138, 'và chẳng chứng minh gì', { fs: 13.5, c: 'mu' });
  s += A(858, 105, 794, 105, { c: 'tea' });
  return sv(1150, 320, s);
};

/* Slide 7 — đường đi của một câu hỏi DNS (dig +trace thật trên Fedora) */
const dnsPath = () => {
  let s = '';
  const box1 = (x, y, w, h, t, d, col) => R(x, y, w, h, { c: col, r: 10 }) + T(x + w / 2, y + 27, t, { fs: 15.5, b: true, a: 'middle', mono: true }) + T(x + w / 2, y + 50, d, { fs: 13.5, a: 'middle', c: 'mu' });
  s += box1(0, 150, 170, 66, 'curl / app', 'getaddrinfo()', 'lx');
  s += box1(230, 40, 190, 66, '/etc/hosts', 'nsswitch: files TRƯỚC', 'red');
  s += box1(230, 150, 190, 66, '127.0.0.53', 'systemd-resolved', 'blu');
  s += box1(480, 150, 190, 66, 'router nhà', '192.168.1.1 · có đệm', 'tea');
  s += box1(760, 10, 380, 60, 'f.root-servers.net', '"com ở chỗ gtld" · 4 ms', 'vio');
  s += box1(760, 100, 380, 60, 'g.gtld-servers.net', '"hỏi cloudflare" · 220 ms', 'amb');
  s += box1(760, 190, 380, 60, 'elliott.ns.cloudflare.com', 'CÓ THẨM QUYỀN · 57 ms', 'grn');
  s += A(172, 170, 226, 84, { c: 'red' }) + T(150, 116, '① file', { fs: 13.5, c: 'red' });
  s += A(172, 183, 226, 183, { c: 'blu' }) + T(186, 205, '② dns', { fs: 13.5, c: 'blu' });
  s += A(422, 183, 476, 183, { c: 'tea' });
  s += A(672, 170, 756, 44, { c: 'vio' }) + A(672, 183, 756, 130, { c: 'amb' }) + A(672, 196, 756, 220, { c: 'grn' });
  s += R(760, 270, 380, 44, { c: 'grn', fill: 'rgba(63,185,80,.12)', r: 8 }) + T(950, 298, 'example.com. 300 IN A 104.20.23.154', { fs: 14.5, a: 'middle', mono: true, c: 'grn', b: true });
  s += T(480, 250, 'TTL 300 = được nhớ 5 phút', { fs: 14, c: 'tea' }) + T(480, 270, '⇒ "đổi DNS rồi mà chưa ăn"', { fs: 14, c: 'mu' });
  s += T(0, 290, 'dig hỏi thẳng máy chủ DNS — BỎ QUA /etc/hosts', { fs: 14.5, c: 'lx' }) + T(0, 312, 'dig +trace tự đi từng chặng thay resolver', { fs: 13.5, c: 'mu' });
  return sv(1150, 320, s);
};

/* Slide 9 — một request HTTPS theo mốc thời gian curl -w (Fedora → example.com, đo thật) */
const reqTimeline = () => {
  const X = (ms) => 150 + ms * 9.6; // 0 → 150px, 102 ms → ~1130px
  const segs = [
    [0, 7.7, 'DNS', '7,7 ms', 'vio', 'tên→IP'],
    [7.7, 34.2, 'TCP', '26,5 ms', 'blu', 'SYN · SYN-ACK · ACK'],
    [34.2, 72.3, 'TLS', '38,0 ms', 'amb', 'bắt tay, kiểm chứng chỉ'],
    [72.3, 101.6, 'CHỜ máy chủ', '29,4 ms', 'red', 'gửi GET → byte đầu'],
    [101.6, 101.9, '', '', 'grn', ''],
  ];
  let s = '';
  s += T(0, 70, 'curl', { fs: 17, b: true, mono: true }) + T(0, 92, 'Fedora, nhà', { fs: 13.5, c: 'mu' });
  segs.forEach(([a, b, t, d, col, sub], i) => {
    const x1 = X(a), x2 = X(b);
    s += `<rect x="${x1}" y="50" width="${Math.max(4, x2 - x1)}" height="46" rx="6" fill="${D[col]}" opacity=".85"/>`;
    if (t) {
      s += T((x1 + x2) / 2, 79, t, { fs: 16, b: true, a: 'middle', c: '#0a0f0c' });
      s += T((x1 + x2) / 2, 122, d, { fs: 15, b: true, a: 'middle', c: col, mono: true });
      s += T((x1 + x2) / 2, 143, sub, { fs: 13.5, a: 'middle', c: 'mu' });
    }
  });
  const marks = [[7.7, 'time_namelookup', 0], [34.2, 'time_connect', 1], [72.3, 'time_appconnect', 0], [101.6, 'time_starttransfer', 1]];
  marks.forEach(([m, lb, r]) => {
    s += `<path d="M${X(m)} 44 L${X(m)} ${158 + r * 30}" stroke="${D.dim}" stroke-width="1.5" stroke-dasharray="4 4"/>`;
    s += T(X(m), 174 + r * 30, `${lb} = ${(m / 1000).toFixed(4)}`, { fs: 13.5, a: m > 90 ? 'end' : 'middle', mono: true, c: 'tx' });
  });
  s += T(X(101.9), 40, 'total 0,1019 s', { fs: 14, a: 'end', mono: true, c: 'grn', b: true });
  s += T(150, 232, 'Mỗi con số là mốc CỘNG DỒN từ lúc bắt đầu ⇒ thời gian của một chặng = mốc sau − mốc trước.', { fs: 14.5, c: 'lx' });
  return sv(1150, 240, s);
};

/* Slide 13 — khoá công khai / khoá bí mật, và khoá máy chủ theo chiều ngược lại */
const khoaSvg = () => {
  let s = '';
  s += R(0, 20, 400, 290, { c: 'blu', fill: 'rgba(88,166,255,.05)', r: 14 });
  s += T(20, 50, '💻 laptop — người dùng an', { fs: 17, b: true, c: 'blu' });
  s += R(20, 70, 360, 70, { c: 'red', r: 10 }) + T(40, 98, '🔑 ~/.ssh/id_ed25519', { fs: 15.5, b: true, mono: true }) + T(40, 122, 'khoá BÍ MẬT · 600 · không rời máy', { fs: 14, c: 'red' });
  s += R(20, 150, 360, 60, { c: 'dim', r: 10 }) + T(40, 176, 'id_ed25519.pub', { fs: 15, mono: true }) + T(40, 197, 'bản công khai — chép đi đâu cũng được', { fs: 13.5, c: 'mu' });
  s += R(20, 222, 360, 70, { c: 'tea', r: 10 }) + T(40, 250, '📒 ~/.ssh/known_hosts', { fs: 15.5, b: true, mono: true }) + T(40, 274, 'vân tay các MÁY CHỦ đã tin', { fs: 14, c: 'tea' });

  s += R(750, 20, 400, 290, { c: 'grn', fill: 'rgba(63,185,80,.05)', r: 14 });
  s += T(770, 50, '🖥 vps — tài khoản deploy', { fs: 17, b: true, c: 'grn' });
  s += R(770, 70, 360, 70, { c: 'lx', r: 10 }) + T(790, 98, '🔒 ~/.ssh/authorized_keys', { fs: 15.5, b: true, mono: true }) + T(790, 122, 'danh sách khoá CÔNG KHAI được vào', { fs: 14, c: 'lx' });
  s += R(770, 222, 360, 70, { c: 'tea', r: 10 }) + T(790, 250, '🏷 /etc/ssh/ssh_host_ed25519_key', { fs: 14.5, b: true, mono: true }) + T(790, 274, 'khoá bí mật của CHÍNH máy chủ', { fs: 14, c: 'tea' });

  s += A(402, 106, 766, 106, { c: 'dim', dash: true }) + T(584, 96, 'ssh-copy-id: chỉ .pub đi qua', { fs: 13.5, a: 'middle', c: 'mu' });
  s += A(746, 150, 406, 150, { c: 'lx' }) + T(576, 143, '① "ký chuỗi phiên này đi"', { fs: 14, a: 'middle', c: 'lx' });
  s += A(404, 184, 744, 184, { c: 'red' }) + T(576, 177, '② chữ ký bằng khoá BÍ MẬT', { fs: 14, a: 'middle', c: 'red' });
  s += T(576, 208, '③ máy chủ kiểm bằng khoá CÔNG KHAI ✓', { fs: 14, a: 'middle', c: 'grn' });
  s += A(746, 262, 406, 262, { c: 'tea' }) + T(576, 255, 'chiều ngược: máy chủ chứng minh nó là NÓ', { fs: 13.5, a: 'middle', c: 'tea' });
  s += T(576, 300, 'khoá bí mật KHÔNG BAO GIỜ đi trên dây', { fs: 14.5, a: 'middle', c: 'red', b: true });
  return sv(1150, 318, s);
};

/* Slide 17 — đường hầm -L / -R / -D và ProxyJump, ba máy thật trong phòng thí nghiệm */
const hamSvg = () => {
  let s = '';
  const M = (x, y, w, h, t, d, col) => R(x, y, w, h, { c: col, fill: 'rgba(255,255,255,.02)', r: 14, dash: true }) + T(x + 16, y + 28, t, { fs: 16.5, b: true, c: col }) + T(x + 16, y + 48, d, { fs: 13, c: 'mu', mono: true });
  s += M(0, 0, 270, 300, '💻 laptop (an)', '172.21.0.3', 'blu');
  s += M(480, 0, 290, 300, '🖥 vps (deploy)', '172.21.0.2 · 172.22.0.3', 'lx');
  s += M(870, 0, 280, 300, '🗄 db (admin)', '172.22.0.2 · NỘI BỘ', 'vio');
  const P2 = (x, y, t, col, w = 230) => R(x, y, w, 36, { c: col, r: 8 }) + T(x + w / 2, y + 24, t, { fs: 14, a: 'middle', mono: true, b: true });
  const L = (y, t, col) => T(375, y, t, { fs: 13, a: 'middle', c: col, mono: true });
  // -L
  s += P2(20, 62, 'localhost:19094', 'grn') + P2(500, 62, '127.0.0.1:19092', 'grn');
  s += A(252, 80, 496, 80, { c: 'grn' }) + L(72, '-L 19094:localhost:19092', 'grn');
  // -L tới máy thứ ba
  s += P2(20, 110, 'localhost:19095', 'tea') + P2(890, 110, '0.0.0.0:19093', 'tea');
  s += A(252, 128, 886, 128, { c: 'tea' }) + L(120, '-L 19095:172.22.0.2:19093', 'tea');
  // -R
  s += P2(20, 162, '127.0.0.1:19096', 'amb') + P2(500, 162, 'localhost:19097', 'amb');
  s += A(498, 180, 254, 180, { c: 'amb' }) + L(172, '-R 19097:localhost:19096', 'amb');
  // -D
  s += P2(20, 212, 'SOCKS :19098', 'pnk');
  s += A(252, 230, 886, 230, { c: 'pnk', dash: true }) + T(625, 222, '-D 19098 : đích do từng request chọn', { fs: 13, a: 'middle', c: 'pnk', mono: true });
  // ProxyJump
  s += A(252, 270, 476, 270, { c: 'lx' }) + A(774, 270, 886, 270, { c: 'lx' }) + L(262, 'ProxyJump vps', 'lx');
  s += T(625, 262, 'ssh db ⇒ qua vps', { fs: 13, a: 'middle', c: 'lx', mono: true });
  s += T(625, 290, 'đi thẳng laptop → db: timed out', { fs: 13, c: 'red', a: 'middle' });
  return sv(1150, 302, s);
};

/* Slide 18 — luật "giá trị ĐẦU TIÊN thắng": thứ tự đọc file của sshd */
const thuTu = () => {
  let s = '';
  const F = (y, name, line, col, note, win) => {
    s += R(0, y, 560, 70, { c: col, r: 10, fill: win ? 'rgba(63,185,80,.12)' : '#111812' });
    s += T(16, y + 23, name, { fs: 14.5, b: true, mono: true }) + T(16, y + 43, line, { fs: 14, mono: true, c: col });
    s += T(16, y + 62, note, { fs: 13.5, c: win ? 'grn' : 'mu', b: win });
  };
  s += T(0, 16, 'sshd đọc theo thứ tự (Include …/*.conf xếp theo ABC):', { fs: 14.5, c: 'lx' });
  F(28, 'sshd_config.d/01-hardening.conf', 'PasswordAuthentication no', 'grn', '▲ đọc TRƯỚC ⇒ THẮNG', true);
  F(106, 'sshd_config.d/50-cloud-init.conf', 'PasswordAuthentication yes', 'red', 'thắng mọi file đứng sau nó', false);
  F(184, 'sshd_config.d/99-hardening.conf', 'PasswordAuthentication no', 'dim', 'tên 99- ⇒ đọc sau 50- ⇒ VÔ TÁC DỤNG', false);
  F(262, '/etc/ssh/sshd_config (sau dòng Include)', '#PasswordAuthentication yes', 'dim', 'chỉ là chú thích — mặc định', false);
  s += A(580, 280, 580, 60, { c: 'lx' }) + T(590, 170, 'đầu', { fs: 13, c: 'lx' }) + T(590, 188, 'tiên', { fs: 13, c: 'lx' }) + T(590, 206, 'thắng', { fs: 13, c: 'lx' });
  return sv(640, 340, s);
};

/* Slide 21 — 11 ô của --itemize-changes: YXcstpoguax (theo rsync(1)), hai dòng output THẬT */
const itemSvg = () => {
  const H = [['Y', 'hướng', 'lx'], ['X', 'loại', 'blu'], ['c', 'checksum', 'red'], ['s', 'cỡ', 'amb'], ['t', 'giờ sửa', 'amb'],
    ['p', 'quyền', 'vio'], ['o', 'chủ', 'vio'], ['g', 'nhóm', 'vio'], ['u', 'giờ đọc', 'dim'], ['a', 'ACL', 'dim'], ['x', 'xattr', 'dim']];
  const rows = [['<fc........', 'index.html', 'gửi lên máy xa · file · NỘI DUNG khác (-c)'], ['>f..t......', 'index.html', 'chép cục bộ · file · giờ sửa khác ⇒ chép lại'], ['<f+++++++++', 'assets/new.css', 'file MỚI: + ở mọi ô']];
  const W = 50, x0 = 0;
  let s = '';
  H.forEach(([k, d, col], i) => {
    s += T(x0 + i * W + W / 2, 18, k, { fs: 20, b: true, a: 'middle', mono: true, c: col });
    s += T(x0 + i * W + W / 2, 38, d, { fs: 11.5, a: 'middle', c: 'mu' });
  });
  rows.forEach(([code, name, note], r) => {
    const y = 52 + r * 50;
    [...code].forEach((ch, i) => {
      const col = ch === '.' ? 'dim' : H[i][2];
      s += R(x0 + i * W + 3, y, W - 6, 40, { c: ch === '.' ? 'bd' : col, r: 6, fill: ch === '.' ? '#0c130f' : 'rgba(245,183,0,.06)', sw: 1.8 });
      s += T(x0 + i * W + W / 2, y + 28, ch, { fs: 21, b: true, a: 'middle', mono: true, c: col });
    });
    s += T(x0 + 11 * W + 16, y + 20, name, { fs: 16, mono: true, b: true });
    s += T(x0 + 11 * W + 16, y + 38, note, { fs: 13.5, c: 'mu' });
  });
  s += T(0, 222, 'Y: < gửi lên · > nhận/chép cục bộ · c tạo mới · * thông điệp (*deleting)   X: f file · d thư mục · L link', { fs: 13.5, c: 'lx' });
  return sv(1000, 230, s);
};

export const slides = S([
  cover({ t: 'Chương 9 — Mạng &amp; máy từ xa', sub: 'ip · ss · dig/host/nslookup · curl -w/-v · SSH: khoá, config, Match, đường hầm · rsync · ufw/nftables/firewalld', chap: 'CHƯƠNG 9' }),

  { t: 'Bản đồ chương: “không kết nối được” thành một tầng có tên', body: mindmap('Mạng', 'hỏi theo TẦNG, không đoán', [
    { t: '9.1 Mạng từ shell', d: 'ip addr/route · ss -tlnp · 127.0.0.1 vs 0.0.0.0 · thang 4 bậc', c: 'blu' },
    { t: '9.1 DNS', d: 'dig · host · nslookup · getent · /etc/hosts · TTL', c: 'vio' },
    { t: '9.2 curl', d: '-sSfL · -w đo DNS→TCP→TLS→HTTP · -v · mã thoát 6/7/22/28', c: 'grn' },
    { t: '9.3 SSH', d: 'khoá · ~/.ssh/config · Match exec · ProxyJump · -L -R -D · sshd -T', c: 'lx' },
    { t: '9.4 Chuyển file', d: 'scp · rsync -avz · dấu / cuối · --delete · --dry-run', c: 'tea' },
    { t: '9.5 Tường lửa', d: 'tcpdump · ufw · nftables · firewalld · DROP vs REJECT · ssh.socket', c: 'red' },
  ]) },

  /* ───────────── 9.1 ───────────── */
  { t: '“Không kết nối được” là 4 bệnh — leo thang để gọi tên', body: two(
    thang(),
    `${term(['$ ping -c1 example.com     # DNS hỏng', '! ping: example.com: Temporary failure in name resolution', '$ nc -zv 172.21.0.4 19090', '! nc: … port 19090 (tcp) failed: Connection refused', '$ nc -zv -w 3 172.22.0.2 22', '! nc: … port 22 (tcp) timed out: …', '$ curl -sS -o /dev/null -w "%{http_code}" …:19091/', '= 200'], { title: 'Ubuntu — output thật', fs: 12.5 })}
    ${box('warn', '<b>Mạng trường (đo 28/09):</b> mọi gói tới <code>1.1.1.1</code> bị chặn — ping mất 100%, <code>dig @1.1.1.1</code> timed out — mà web vẫn vào được. Bậc 1 hỏng chưa chắc là mạng chết: thử thêm một đích khác.')}`, 'l') },

  { t: 'ip thay ifconfig: địa chỉ, giao diện và tuyến mặc định', body: two(
    `${term(['$ ip -brief addr', 'lo          UNKNOWN  127.0.0.1/8 ::1/128', '+ enp3s0      UP       192.168.1.102/24 fe80::8561:…/64', 'docker0     UP       172.17.0.1/16 fe80::fc75:…/64', 'br-6ed29a…  DOWN     172.20.0.1/16', '…', '$ ip route | head -2', '= default via 192.168.1.1 dev enp3s0 proto dhcp src 192.168.1.102', '172.17.0.0/16 dev docker0 proto kernel scope link src 172.17.0.1', '$ ip route get 104.20.23.154', '104.20.23.154 via 192.168.1.1 dev enp3s0 src 192.168.1.102 uid 1000'], { title: 'Fedora 44 — output thật (đã cắt bớt)', fs: 13 })}`,
    `${table(['Cột / từ', 'Nghĩa'], [
      ['<code>lo</code>', 'loopback — không bao giờ rời máy'],
      ['<code>enp3s0</code> · <code>ens3</code> · <code>eth0</code>', 'card thật (tên đoán trước được)'],
      ['<code>UP</code> / <code>DOWN</code>', 'giao diện bật / tắt (cầu Docker rỗi = DOWN)'],
      ['<code>/24</code>', 'mặt nạ mạng: 24 bit đầu là “mạng”'],
      ['!<code>default via</code>', 'cổng ra internet — thiếu dòng này = không có mạng'],
    ], { sm: true })}
    ${table(['Cũ (net-tools)', 'Mới (iproute2)'], [
      ['<code>ifconfig</code>', '<code>ip addr</code> · <code>ip -br a</code>'],
      ['<code>route -n</code>', '<code>ip route</code>'],
      ['<code>netstat -tulpn</code>', '<code>ss -tulpn</code>'],
      ['<code>arp -a</code>', '<code>ip neigh</code>'],
    ], { sm: true })}`, 'l') },

  { t: 'ss -tlnp: đọc từng cột — ĐỊA CHỈ quan trọng hơn cổng', body: `
    ${(() => {
      const L = 'LISTEN    0     5     127.0.0.1:19090  0.0.0.0:*  users:(("python3",pid=44,fd=3))';
      const at = (x, k = 0) => L.indexOf(x, k);
      return annot(L, [
        { from: 0, to: 6, t: 'State', d: 'đang nghe', c: 'grn' },
        { from: at('0'), to: at('0') + 1, t: 'Recv-Q', d: 'chờ accept', c: 'dim' },
        { from: at('5'), to: at('5') + 1, t: 'Send-Q', d: 'backlog tối đa', c: 'dim' },
        { from: at('127'), to: at(':19090'), t: 'ĐỊA CHỈ GẮN', d: 'chỉ loopback!', c: 'red' },
        { from: at(':19090') + 1, to: at(':19090') + 6, t: 'cổng', d: '', c: 'lx' },
        { from: at('0.0.0.0'), to: at('0.0.0.0') + 9, t: 'Peer', d: '* = ai cũng được', c: 'blu' },
        { from: at('users'), to: L.length, t: 'Process (-p)', d: 'tên · PID · fd', c: 'vio' },
      ], { fs: 22, rowH: 50 });
    })()}
    ${two(
      sh([
        ['sudo ss -tulpn', 'TCP+UDP · nghe · tiến trình · số'],
        ['ss -tlnp "sport = :19090"', 'lọc theo cổng nguồn'],
        ['ss -tan state established', 'các kết nối đang mở'],
        ['ss -s', 'đếm tổng: estab, timewait…'],
      ], { fs: 14.5 }),
      term(['$ ss -tanp state established', 'Recv-Q Send-Q Local Address:Port  Peer Address:Port', '0      0      127.0.0.1:57222    127.0.0.1:19091 ("bash",…)', '0      0      127.0.0.1:19091    127.0.0.1:57222 ("python3",…)'], { title: 'Ubuntu — một kết nối = HAI dòng (hai đầu)', fs: 12.5 }), 'l')}` },

  { t: '127.0.0.1 chỉ nghe trong máy — không tường lửa nào mở được', body: `
    ${bindSvg()}
    ${two(
      term(['# từ laptop 172.21.0.3', '$ curl -sS -o /dev/null -w "%{http_code}\\n" http://172.21.0.4:19090/', '! curl: (7) Failed to connect to 172.21.0.4 port 19090 after 0 ms', '000', '$ curl -sS -o /dev/null -w "%{http_code}\\n" http://172.21.0.4:19091/', '= 200'], { title: 'Ubuntu — hai container, output thật', fs: 13 }),
      box('tip', 'Trong container, <code>127.0.0.1</code> là loopback CỦA CONTAINER ⇒ app phải nghe <code>0.0.0.0</code> bên trong, rồi công bố hẹp: <code>-p 127.0.0.1:3000:3000</code>. Rà nhanh máy mới tiếp quản: <code>sudo ss -tlnp | grep 0.0.0.0</code>.'), 'l')}` },

  { t: 'Một câu hỏi DNS đi qua 5 chặng — và /etc/hosts đi tắt', body: `
    ${dnsPath()}
    ${term(['$ dig +trace +nodnssec example.com | grep "^;; Received"', ';; Received 239 bytes from 127.0.0.53#53(127.0.0.53) in 0 ms', ';; Received 864 bytes from 192.5.5.241#53(f.root-servers.net) in 4 ms', ';; Received 359 bytes from 192.42.93.30#53(g.gtld-servers.net) in 220 ms', ';; Received 72 bytes from 162.159.44.228#53(elliott.ns.cloudflare.com) in 57 ms'], { title: 'Fedora 44 — dig +trace thật', fs: 13 })}` },

  { t: 'dig · host · nslookup · getent: bốn cách hỏi, bốn câu trả lời', body: two(
    `${table(['Lệnh', 'Hỏi ai', 'Đọc /etc/hosts?', 'NXDOMAIN ⇒ $?'], [
      ['<code>dig +short tên</code>', 'máy chủ DNS thẳng', '-không', '!0 (!)'],
      ['<code>host tên</code>', 'máy chủ DNS thẳng', '-không', '1'],
      ['<code>nslookup tên</code>', 'máy chủ DNS thẳng', '-không', '1'],
      ['<code>getent hosts tên</code>', '+như ỨNG DỤNG (nsswitch)', '+CÓ, trước DNS', '2'],
    ], { sm: true })}
    ${sh([
      ['dig +short example.com', 'chỉ IP'],
      ['dig +noall +answer example.com NS', 'chỉ phần trả lời'],
      ['dig @8.8.8.8 example.com', 'hỏi resolver CỤ THỂ'],
      ['host -t MX example.com', 'câu ngắn, dễ đọc'],
      ['nslookup -type=NS example.com 1.1.1.1', 'có ở cả Windows'],
      ['getent hosts example.com', 'đường của curl/node'],
    ], { fs: 13 })}`,
    `${term(['$ echo "10.9.9.9 example.com" >> /etc/hosts', '$ getent hosts example.com', '! 10.9.9.9        example.com', '$ dig +short example.com', '104.20.23.154', '172.66.147.243', '$ curl -sS -m 3 -o /dev/null http://example.com', '! curl: (28) Connection timed out after 3002 milliseconds', '$ dig +short khong-ton-tai-lx09.example; echo $?', '+ 0'], { title: 'Ubuntu — dig nói "ổn", app vẫn hỏng', fs: 13 })}
    ${box('bad', '<b>dig trả 0 cả khi tên KHÔNG tồn tại</b> (status: NXDOMAIN nằm trong output). Script kiểm DNS: dùng <code>getent</code>, <code>host</code>, hoặc kiểm <code>dig +short</code> có rỗng không.')}`, '') },

  /* ───────────── 9.2 ───────────── */
  { t: 'Một request HTTPS = DNS → TCP → TLS → chờ máy chủ', body: `
    ${reqTimeline()}
    ${two(
      sh([
        ["curl -s -o /dev/null -w '", ''],
        ["  dns=%{time_namelookup} tcp=%{time_connect}", 'mốc cộng dồn, đơn vị giây'],
        ["  tls=%{time_appconnect} ttfb=%{time_starttransfer}", 'ttfb = byte đầu tiên'],
        ["  total=%{time_total} ip=%{remote_ip}\\n' https://example.com/", ''],
      ], { fs: 13.5 }),
      table(['Chặng dài', 'Nghi gì trước'], [
        ['DNS', 'resolver chậm/chết — thử resolver khác'],
        ['TCP', 'xa, mạng nghẽn, SYN bị rớt'],
        ['TLS', 'chuỗi chứng chỉ dài, CPU máy chủ'],
        ['!Chờ máy chủ', 'CODE / CSDL — mạng vô tội'],
      ], { sm: true }), '')}` },

  { t: 'curl -v: * là curl nghĩ, > là gửi đi, < là nhận về', body: two(
    term(['$ curl -v https://example.com/ -o /dev/null', '* Host example.com:443 was resolved.', '* IPv4: 104.20.23.154, 172.66.147.243', '*   Trying 104.20.23.154:443...', '* Connected to example.com (104.20.23.154) port 443', '* ALPN: curl offers h2,http/1.1', '* SSL connection using TLSv1.3 / TLS_AES_256_GCM_SHA384', '*  subject: CN=example.com', '+ *  expire date: Dec 25 22:56:35 2026 GMT', '*  issuer: C=US; O=SSL Corporation; CN=Cloudflare TLS…', '= *  SSL certificate verify ok.', '> GET / HTTP/2', '> Host: example.com', '> User-Agent: curl/8.5.0', '< HTTP/2 200', '< content-type: text/html', '< server: cloudflare'], { title: 'Ubuntu, curl 8.5.0 — output thật (lọc bớt dòng TLS)', fs: 13 }),
    `${table(['Dấu', 'Nghĩa', 'Tìm gì ở đó'], [
      ['<code>*</code>', 'ghi chú của curl', 'IP thật, TLS, <b>expire date</b>'],
      ['<code>&gt;</code>', 'request GỬI đi', 'Host, header xác thực'],
      ['<code>&lt;</code>', 'response NHẬN về', 'mã trạng thái, header'],
      ['<code>{ }</code>', 'số byte đi/về (thô)', 'thường bỏ qua'],
    ], { sm: true })}
    ${sh([
      ['curl -v URL 2>&1 | grep -E "^[<>*]"', '-v ghi ra stderr'],
      ['curl -sI URL', 'HEAD: chỉ header'],
      ['curl --resolve example.com:443:1.2.3.4 URL', 'thử máy mới TRƯỚC khi đổi DNS'],
    ], { fs: 13.5 })}
    ${box('warn', '<code>-k</code> tắt kiểm chứng chỉ: vẫn mã hoá nhưng KHÔNG biết đang nói với ai. Đọc dòng <code>*</code> để chữa đúng bệnh.')}`, 'l') },

  { t: 'Mặc định của curl sai cho script — mã thoát nói tầng nào hỏng', body: two(
    `${term(['$ curl -sSf --max-time 5 -o /dev/null https://khong-ton-tai-lx09.example; echo $?', '! curl: (6) Could not resolve host: khong-ton-tai-lx09.example', '6', '$ curl -sSf --max-time 5 -o /dev/null http://172.21.0.4:19090; echo $?', "! curl: (7) Failed to connect to 172.21.0.4 port 19090 after 0 ms: …", '7', '$ curl -sSf --max-time 5 -o /dev/null https://example.com/khong-co; echo $?', '! curl: (22) The requested URL returned error: 404', '22', '$ curl -sSf --max-time 2 -o /dev/null http://10.255.255.1; echo $?', '! curl: (28) Connection timed out after 2005 milliseconds', '28'], { title: 'Ubuntu — bốn kiểu hỏng, output thật', fs: 12 })}`,
    `${table(['Mã', 'Tầng', 'Nghĩa'], [
      ['<code>6</code>', 'DNS', 'không phân giải được tên'],
      ['<code>7</code>', 'cổng', 'bị từ chối: không ai nghe / REJECT'],
      ['<code>28</code>', 'mạng / máy chủ', 'hết giờ: DROP, máy treo'],
      ['<code>22</code>', 'ứng dụng', 'HTTP ≥ 400 (chỉ khi có <code>-f</code>)'],
      ['<code>35</code> · <code>60</code>', 'TLS', 'bắt tay hỏng · chứng chỉ không tin'],
    ], { sm: true })}
    ${table(['Cờ', 'Sửa mặc định nào'], [
      ['<code>-s</code> / <code>-S</code>', 'tắt thanh tiến độ / nhưng vẫn in lỗi'],
      ['!<code>-f</code>', '404/500 ⇒ thoát 22 thay vì 0'],
      ['<code>-L</code>', 'đi theo 301/302'],
      ['<code>--max-time</code>', 'không bao giờ treo mãi'],
    ], { sm: true })}`, 'l') },

  { t: 'Bẫy: trong nhánh then của if !, $? đã thành 0', body: two(
    `${sh([
      ['# SAI — bản cũ của bài này', ''],
      ['if ! body=$(curl -sSf "$url"); then', ''],
      ['  case $? in', '$? của "!" = 0'],
      ['    6) die "DNS hỏng" ;;', 'không bao giờ khớp'],
      ['    *) die "curl hỏng với mã $?" ;;', ''],
      ['  esac', ''],
      ['fi', ''],
    ], { fs: 14 })}
    ${sh([
      ['# ĐÚNG — chụp mã ngay dòng sau', ''],
      ['body=$(curl -sSf "$url") || {', ''],
      ['  rc=$?', 'lưu NGAY, trước lệnh nào khác'],
      ['  case $rc in', ''],
      ['    6) die "DNS hỏng với $url" ;;', ''],
      ['    *) die "curl hỏng với mã $rc" ;;', ''],
      ['  esac; }', ''],
    ], { fs: 14 })}`,
    `${term(['# url = một tên không tồn tại (curl thoát 6)', '$ bash sai.sh', '! DIE: curl hỏng với mã 0', '$ bash dung.sh', '= DIE: DNS hỏng với https://khong-ton-tai-lx09.example'], { title: 'Ubuntu, bash 5.2 — output thật', fs: 13.5 })}
    ${term(["$ code=$(curl -s -o /dev/null -w '%{http_code}' $url || echo 000)", '$ echo "[$code]"', '! [000000]', "$ code=$(curl -s -o /dev/null -w '%{http_code}' $url) || true", '$ echo "[$code]"', '= [000]'], { title: 'Bẫy thứ hai: -w ĐÃ in 000 khi không kết nối được', fs: 12 })}
    ${box('tip', '<code>!</code> đảo mã thoát ⇒ <code>$?</code> trong <code>then</code> luôn là 0. Và <code>-w</code> luôn in, kể cả khi curl hỏng — đừng <code>|| echo 000</code>.')}`, '') },

  /* ───────────── 9.3 ───────────── */
  { t: 'Khoá SSH: máy chủ giữ ổ khoá, chỉ bạn giữ chìa', body: `
    ${khoaSvg()}
    ${two(
      box('info', 'Chìa (khoá bí mật) ký một chuỗi mới cho MỖI phiên ⇒ nghe lén cũng không dùng lại được. Mật khẩu thì đi trên dây (đã mã hoá) và đoán được.'),
      box('warn', 'Hai chiều tin nhau: bạn chứng minh bằng <code>id_ed25519</code>; máy chủ chứng minh bằng host key — ghi vào <code>known_hosts</code> ở lần đầu (“Are you sure…?”).'))}` },

  { t: 'ssh-keygen → ssh-copy-id → quyền 700/600, sai là bị lờ', body: two(
    `${term(['$ ssh-keygen -t ed25519 -f /tmp/id_demo -N "" -C "an@laptop"', '# -N "" chỉ để demo — khoá thật thì ĐẶT mật khẩu', 'Your identification has been saved in /tmp/id_demo', 'The key fingerprint is:', 'SHA256:W8tJKQmCOT8OketOwchAqR/f9ynxjhZkze/m6ItkUpk an@laptop', '$ ssh-copy-id -i ~/.ssh/id_ed25519.pub deploy@172.21.0.2', '… INFO: 1 key(s) remain to be installed', '= Number of key(s) added: 1', '$ chmod 644 ~/.ssh/id_ed25519; ssh vps true', '! WARNING: UNPROTECTED PRIVATE KEY FILE!', "! Permissions 0644 for '/home/an/.ssh/id_ed25519' are too open.", '! This private key will be ignored.', '! deploy@172.21.0.2: Permission denied (publickey,password).'], { title: 'Ubuntu — laptop → vps, output thật', fs: 12 })}`,
    `<style>.l-pm .ch{width:44px;height:52px;font-size:26px}.l-pm>.row{gap:18px}.l-pm{gap:10px}.l-pm .raw{font-size:16px;padding:6px 14px}</style>${perms('-rw-------', { raw: '-rw------- 1 an an 399 id_ed25519' })}
    ${table(['Đường dẫn', 'Chế độ'], [
      ['<code>~/.ssh/</code>', '<code>700</code>'],
      ['khoá bí mật · <code>authorized_keys</code> · <code>config</code>', '<code>600</code>'],
      ['<code>*.pub</code>', '<code>644</code>'],
      ['<code>~</code> (nhà) trên máy chủ', 'không cho NGƯỜI KHÁC ghi'],
    ], { sm: true })}
    ${box('info', 'Đo thật: nhà <code>777</code> ⇒ sshd ghi “bad ownership or modes for directory /home/deploy”. Ubuntu vẫn cho <code>775</code> khi nhóm chỉ có đúng bạn.')}`, '') },

  { t: '~/.ssh/config: một chữ “vps” thay cả dòng lệnh dài', body: two(
    sh([
      ['Host vps', 'bí danh bạn gõ'],
      ['    HostName 172.21.0.2', 'địa chỉ thật'],
      ['    User deploy', ''],
      ['    IdentityFile ~/.ssh/id_ed25519', ''],
      ['    IdentitiesOnly yes', 'chỉ chào đúng khoá này'],
      ['', ''],
      ['Host db', ''],
      ['    HostName 172.22.0.2', 'mạng riêng, không ra ngoài'],
      ['    User admin', ''],
      ['    ProxyJump vps', 'nhảy qua vps'],
      ['', ''],
      ['Host *', 'mọi máy — đặt CUỐI file'],
      ['    ServerAliveInterval 60', 'gõ cửa mỗi 60 s'],
      ['    ControlMaster auto', 'dùng chung 1 kết nối'],
      ['    ControlPath ~/.ssh/cm-%r@%h:%p', ''],
      ['    ControlPersist 10m', ''],
    ], { fs: 14 }),
    `${term(['$ ssh -G vps | grep -E "^(hostname|user|port) "', 'user deploy', 'hostname 172.21.0.2', 'port 22', '$ ssh db "hostname; hostname -I"', '= db', '= 172.22.0.2', '$ ssh -o ProxyJump=none admin@172.22.0.2 true', '! ssh: connect to host 172.22.0.2 port 22: Connection timed out'], { title: 'Ubuntu — laptop, output thật', fs: 12.5 })}
    ${term(['lần đầu (bắt tay đầy đủ):  171 ms', '$ ssh -O check vps', 'Master running (pid=256)', '+ lần hai (dùng lại kết nối): 6 ms'], { title: 'ControlMaster — đo thật', fs: 13 })}`, 'l') },

  { t: 'Mạng trường chặn cổng 22: Match exec tự đổi sang 993', body: two(
    `${sh([
      ['# ~/.ssh/config trên Mac — Match phải đứng TRƯỚC', ''],
      ['Match originalhost vps exec "ipconfig getifaddr en0 | grep -q ^10\\."', ''],
      ['    Port 993', 'ở trường: cổng này'],
      ['', ''],
      ['Host vps', ''],
      ['    HostName 203.0.113.42', ''],
      ['    Port 22', 'ở nhà: cổng mặc định'],
    ], { fs: 13.5 })}
    ${table(['Từ khoá', 'Nghĩa'], [
      ['<code>Match … exec "lệnh"</code>', 'khối áp dụng khi lệnh thoát 0'],
      ['<code>originalhost</code>', 'tên đúng như BẠN gõ (“vps”)'],
      ['<code>ipconfig getifaddr en0</code>', 'IP Wi-Fi của Mac (Linux: <code>ip -br a</code>)'],
    ], { sm: true })}`,
    `${term(['# Match đặt TRƯỚC · giả lập “ở trường”', '$ ssh -G vps | grep ^port', '= port 993', '$ ssh -v vps true 2>&1 | grep Connecting', 'debug1: Connecting to 172.21.0.2 […] port 993.', '# cùng khối Match, nhưng đặt SAU Host vps', '$ ssh -F cfg-sai -G vps | grep ^port', '! port 22'], { title: 'Ubuntu — output thật', fs: 12 })}
    ${box('bad', '<b>ssh_config: giá trị ĐẦU TIÊN thắng.</b> <code>Host vps</code> đã đặt <code>Port 22</code> thì mọi <code>Port</code> phía sau bị bỏ qua. Vì thế khối chung <code>Host *</code> luôn nằm cuối.')}`, 'l') },

  { t: 'Đường hầm: -L kéo cổng xa về, -R đẩy cổng mình ra, -D là proxy', body: `
    ${hamSvg()}
    ${two(
      term(['$ curl -sS http://172.21.0.2:19092/', '! curl: (7) Failed to connect to 172.21.0.2 port 19092', '$ ssh -fN -L 19094:localhost:19092 vps; curl -sS localhost:19094', '= tu VPS: Postgres gia (127.0.0.1)', '$ ssh -fN -D 19098 vps', '$ curl -sS --socks5-hostname localhost:19098 http://172.22.0.2:19093/', '= tu DB: may rieng 172.22.0.2'], { title: 'Ubuntu — laptop, output thật', fs: 12 }),
      table(['Cờ', 'Nghe ở', 'Dùng khi'], [
        ['<code>-L</code>', 'máy BẠN', 'vào CSDL chỉ nghe loopback ở xa'],
        ['<code>-R</code>', 'máy CHỦ', 'máy chủ gọi vào máy dev'],
        ['<code>-D</code>', 'máy BẠN (SOCKS5)', 'duyệt mạng riêng qua máy chủ'],
      ], { sm: true }) + '<p style="font-size:14.5px;color:#a3b3a8;margin-top:6px">Mặc định cổng nghe ở <code>127.0.0.1</code>. <code>-f</code> chạy nền · <code>-N</code> không mở shell.</p>', 'l')}` },

  { t: 'sshd: giá trị ĐẦU TIÊN thắng — file 99- thua file 50-', body: two(
    thuTu(),
    `${term(['$ ls /etc/ssh/sshd_config.d/', '50-cloud-init.conf  99-hardening.conf', '$ sshd -t && echo OK', 'OK', '$ sshd -T | grep ^passwordauthentication', '! passwordauthentication yes', '# từ laptop, chỉ dùng mật khẩu:', '! vào được bằng MẬT KHẨU', '$ mv 99-hardening.conf 01-hardening.conf', '$ kill -HUP <PID giữ :22>      # nạp lại', '$ sshd -T | grep ^passwordauthentication', '= passwordauthentication no', '= deploy@172.21.0.2: Permission denied (publickey).'], { title: 'Ubuntu 24.04, OpenSSH 9.6 — dựng lại sự cố thật', fs: 12.5 })}
    ${box('tip', '<code>sshd -t</code> chỉ kiểm CÚ PHÁP. Nghiệm thu bằng <code>sshd -T</code> (giá trị đang hiệu lực) + thử đăng nhập thật từ terminal THỨ HAI.')}`, 'l') },

  { t: 'Khi SSH hỏng: đọc đúng câu lỗi, và đừng để việc chết theo phiên', body: two(
    `${table(['Câu lỗi', 'Nghĩa', 'Làm gì'], [
      ['<code>Connection refused</code>', 'không ai nghe cổng đó', '<code>ss -tlnp</code> trên máy chủ · sai Port'],
      ['<code>Connection timed out</code>', 'gói bị vứt (tường lửa, mạng trường)', '<code>tcpdump</code> · đổi cổng'],
      ['<code>Permission denied (publickey)</code>', 'khoá bị từ chối', '<code>ssh -v</code> · quyền · <code>auth.log</code>'],
      ['!<code>HOST IDENTIFICATION HAS CHANGED</code>', 'host key khác <code>known_hosts</code>', 'KIỂM vân tay rồi mới <code>ssh-keygen -R</code>'],
    ], { sm: true })}
    ${term(['$ ssh-keyscan -t ed25519 172.21.0.2 | ssh-keygen -lf -', '256 SHA256:jggiJjPdbvroyLR+7Aki1B75zHu2PvT1dywocd0aSqs 172.21.0.2 (ED25519)'], { title: 'Ubuntu — vân tay để so với người quản trị', fs: 12.5 })}`,
    `${term(["$ timeout 3 ssh vps 'bash -c \"for i in $(seq 1 20); do echo buoc $i; …; sleep 1; done\" &'", 'buoc 1', 'buoc 2', 'buoc 3', '! ssh rc=124   # như gập máy / rớt Wi-Fi', '$ ssh vps cat /tmp/tien-do.txt', '! 3              # vòng lặp chết ở bước 4 (ghi vào kênh đã đóng)', "$ ssh vps 'tmux new -d -s deploy ./deploy.sh'", '= # sống, rớt mạng bao nhiêu lần cũng được', '$ ssh -t vps tmux attach -t deploy'], { title: 'Ubuntu — đo thật: & KHÔNG đủ', fs: 12.5 })}
    ${box('info', 'Không pty: <code>ssh vps "job &amp;"</code> treo chờ output, rớt thì job chết khi ghi ra kênh đã đóng. Có pty (<code>-t</code>): chết vì SIGHUP. Dùng <code>tmux</code> (Bài 5.4).')}`, 'l') },

  /* ───────────── 9.4 ───────────── */
  { t: 'rsync: dấu / cuối NGUỒN nghĩa là “nội dung của”', body: two(
    `${tree(`# rsync -a dist vps:app/      (KHÔNG /)
app/
└── dist/
    ├── index.html
    └── assets/
        ├── main.css
        └── main.js`)}
    ${tree(`# rsync -a dist/ vps:app/     (CÓ /)
app/
├── index.html
└── assets/
    ├── main.css
    └── main.js`)}`,
    `${term(['$ rsync -av dist/ vps:app/', 'sending incremental file list', './', 'index.html', 'assets/', 'assets/main.css', 'assets/main.js', '', 'sent 317 bytes  received 84 bytes  802.00 bytes/sec', '$ rsync -av dist/ vps:app/       # chạy lại', 'sending incremental file list', '', '= sent 144 bytes  received 13 bytes   # không gửi file nào'], { title: 'Ubuntu, rsync 3.2.7 — laptop → vps, output thật', fs: 13 })}
    ${box('tip', 'Dấu / ở ĐÍCH không đổi gì. Chạy lại nhiều lần kết quả vẫn thế — nên cái sai <code>app/dist/</code> nằm yên, không ai để ý.')}`, 'l') },

  { t: 'Bảng cờ rsync và cách đọc --itemize-changes', body: `
    ${itemSvg()}
    ${two(
      table(['Cờ', 'Nghĩa', 'Ghi nhớ'], [
        ['<code>-a</code>', '= <code>-rlptgoD</code>: đệ quy, giữ quyền/giờ/link', 'gần như luôn dùng'],
        ['<code>-v</code> · <code>-z</code>', 'kể tên file · nén trên đường', '<code>-z</code> vô ích với .gz/.jpg'],
        ['!<code>-n</code> <code>--dry-run</code>', 'chỉ in, KHÔNG làm', 'luôn chạy trước'],
        ['!<code>--delete</code>', 'xoá ở đích thứ nguồn không có', 'tạo bản gương'],
        ['<code>-c</code>', 'so NỘI DUNG thay vì cỡ+giờ', 'sau git clone / CI'],
        ['<code>-i</code>', 'in mã 11 ô cho từng mục', 'đọc kế hoạch'],
      ], { sm: true }),
      term(['$ rsync -an --delete -i dist/ vps:app/', '*deleting   assets/main.js', '<f+++++++++ assets/new.css', '# index.html sửa v1→v2: cùng cỡ, cùng giây ⇒ BỊ BỎ QUA', '$ rsync -an -i --checksum dist/ vps:app/', '! <fc........ index.html', '<f+++++++++ assets/new.css'], { title: 'Ubuntu — output thật', fs: 13 }), 'l')}` },

  { t: '--delete + nguồn rỗng = dọn sạch đích, và báo thành công', body: two(
    `${term(['$ mkdir build        # bản dựng hỏng → rỗng', '$ rsync -av --delete build/ vps:app/; echo "exit=$?"', 'sending incremental file list', '! deleting assets/new.css', '! deleting assets/main.css', '! deleting assets/', '! deleting index.html', './', '= exit=0', '$ rsync -av --delete ./biuld/ vps:app/; echo "exit=$?"', 'rsync: [sender] change_dir "/home/an/./biuld" failed: No such file…', '+ exit=23      # nguồn KHÔNG tồn tại: dừng, không xoá'], { title: 'Ubuntu — output thật', fs: 12.5 })}`,
    `${term(['$ rsync -av --delete --max-delete=2 --dry-run build/ vps:app/', 'deleting assets/new.css', 'deleting assets/main.css', '! Deletions stopped due to --max-delete limit (2 skipped)', 'rsync error: the --max-delete limit stopped deletions (code 25)'], { title: '--max-delete VẪN xoá N file đầu', fs: 12.5 })}
    ${sh([
      ['[[ -d $src ]] || die "không có $src"', 'chốt 1: tồn tại'],
      ['[[ -n $(ls -A "$src") ]] || die "rỗng"', 'chốt 2: khác rỗng'],
      ['rsync -ain --delete "$src/" "$dst/"', 'chốt 3: ĐỌC kế hoạch'],
      ['rsync -a --delete --max-delete=50 \\', 'chốt 4: trần xoá'],
      ['  --exclude=".env*" "$src/" "$dst/"', ''],
    ], { fs: 13.5 })}`, 'l') },

  { t: 'scp, rsync, tar qua ssh, sftp — chọn theo việc', body: two(
    table(['Công cụ', 'Hợp với', 'Không hợp với'], [
      ['<code>scp</code>', 'một file, gõ tay', '-nối tiếp, so khác biệt, script lặp lại'],
      ['!<code>rsync -avz</code>', 'deploy, sao lưu, thư mục lớn, chạy lại', 'máy đích không cài rsync'],
      ['<code>tar -cz . | ssh h "tar -xz -C /srv"</code>', 'container tối giản, không rsync', 'chạy lại (gửi lại TẤT CẢ)'],
      ['<code>sftp</code>', 'duyệt/tải tương tác, app đồ hoạ', 'tự động hoá'],
      ['ảnh Docker / registry', 'deploy không cần chép file', '—'],
    ], { sm: true }),
    `${sh([
      ['scp -P 2222 f.txt vps:/srv/', '-P HOA = cổng (ssh: -p)'],
      ['scp -r ./dist vps:/srv/app/', ''],
      ['rsync -avz -e "ssh -p 2222" dist/ vps:/srv/', 'cổng lạ cho rsync'],
      ['rsync -avz --partial --progress big.iso vps:', 'tải dở thì nối tiếp'],
    ], { fs: 13.5 })}
    ${box('warn', '<b>Mac không có GNU rsync:</b> <code>/usr/bin/rsync</code> là <b>openrsync</b> (“2.6.9 compatible”). Đo thật: <code>--info=progress2</code>, <code>--append-verify</code> ⇒ <code>unrecognized option</code>; mã itemize ngắn hơn. Cần đủ cờ: <code>brew install rsync</code>.')}`, 'r') },

  /* ───────────── 9.5 ───────────── */
  { t: 'tcpdump trả lời câu duy nhất: gói tin CÓ tới máy không?', body: `
    ${term(['$ sudo tcpdump -i eth0 -n "tcp port 19091 or tcp port 19090"', '! 10:57:53.927167 IP 172.21.0.3.46006 > 172.21.0.5.19091: Flags [S], seq 122370713 …', '! 10:57:54.942512 IP 172.21.0.3.46006 > 172.21.0.5.19091: Flags [S], seq 122370713 …   ← gửi LẠI, không ai đáp', '= 10:57:55.937311 IP 172.21.0.3.55052 > 172.21.0.5.19090: Flags [S], seq 870537449 …', '= 10:57:55.937356 IP 172.21.0.5.19090 > 172.21.0.3.55052: Flags [S.], seq 4284871842, ack 870537450 …'], { title: 'Ubuntu — máy chủ có tường lửa, output thật (cắt phần options)', fs: 12.5 })}
    ${table(['tcpdump thấy', 'Kết luận', 'Tầng'], [
      ['không có gì', 'bị chặn TRƯỚC khi tới máy: security group, nhà mạng, sai IP', '1 · ngoài máy'],
      ['<code>[S]</code> lặp lại, không có hồi đáp', 'tới nơi, tường lửa của máy VỨT đi (DROP)', '2 · tường lửa máy'],
      ['<code>[S]</code> rồi <code>[R.]</code>', 'tới nơi, KHÔNG AI NGHE cổng đó (nhân trả RST)', '3 · dịch vụ, địa chỉ gắn'],
      ['<code>[S]</code> rồi <code>ICMP … unreachable</code>', 'tới nơi, tường lửa REJECT (luật <code>reject</code> của nft)', '2 · tường lửa máy'],
      ['<code>[S]</code> rồi <code>[S.]</code>', 'bắt tay xong — mạng ổn, xem ứng dụng', '4 · ứng dụng'],
    ], { sm: true })}` },

  { t: 'ufw, firewalld, nftables: hai giao diện, một bộ máy', body: `
    ${table(['', 'ufw', 'firewalld', 'nftables (<code>nft</code>)'], [
      ['Mặc định trên', 'Ubuntu, Debian (cài sẵn, TẮT)', 'Fedora, RHEL (BẬT)', 'tầng bên dưới của cả hai'],
      ['Mô hình', 'luật theo cổng / nguồn', 'VÙNG (zone) gắn với giao diện', 'bảng → chuỗi → luật'],
      ['Mở cổng 443', '<code>ufw allow 443/tcp</code>', '<code>firewall-cmd --add-service=https --permanent</code>', '<code>nft add rule … tcp dport 443 accept</code>'],
      ['Xem', '<code>ufw status verbose</code>', '<code>firewall-cmd --list-all</code>', '<code>nft list ruleset</code>'],
    ], { sm: true })}
    ${two(
      term(['$ ufw allow 22/tcp; ufw allow 80,443/tcp', '$ ufw allow from 172.21.0.3 to any port 19090 proto tcp', '$ ufw default deny incoming; ufw --force enable', '$ ufw status numbered', '[ 1] 22/tcp          ALLOW IN    Anywhere', '[ 3] 19090/tcp       ALLOW IN    172.21.0.3', '$ nft list chain ip filter ufw-user-input', '+ tcp dport 22 counter packets 0 bytes 0 accept', '+ ip saddr 172.21.0.3 tcp dport 19090 counter packets 1 bytes 60 accept'], { title: 'Ubuntu 24.04 — ufw dịch thành nftables, output thật', fs: 12 }),
      `${term(['$ firewall-cmd --list-all', 'FedoraWorkstation (default, active)', '  interfaces: enp3s0', '  services: dhcpv6-client mdns samba-client ssh', '! ports: 1025-65535/udp 1025-65535/tcp'], { title: 'Fedora 44 Workstation — mặc định mở mọi cổng ≥ 1025', fs: 12 })}
      ${P('<code>iptables -V</code> → <code>iptables v1.8.10 (nf_tables)</code>: lệnh iptables chỉ là lớp vỏ ghi vào nftables. <b>Luôn <code>allow 22</code> TRƯỚC <code>enable</code>.</b>')}`, '')}` },

  { t: 'DROP làm client chờ (28), REJECT trả lời ngay (7)', body: two(
    `${sh([
      ['nft add table inet lx09', ''],
      ['nft add chain inet lx09 input \\', ''],
      ['  "{ type filter hook input priority 0; policy accept; }"', ''],
      ['nft add rule inet lx09 input tcp dport 19091 counter drop', 'im lặng vứt'],
      ['nft add rule inet lx09 input ip saddr 172.21.0.4 \\', ''],
      ['  tcp dport 19090 counter reject', 'trả lời “không”'],
    ], { fs: 13 })}
    ${term(['$ curl -sS -m 3 http://172.21.0.5:19091/; echo exit=$?', '! curl: (28) Connection timed out after 3003 milliseconds', '$ curl -sS -m 3 http://172.21.0.5:19090/; echo exit=$?   # từ .4', "! curl: (7) Failed to connect to 172.21.0.5 port 19090 after 0 ms", '$ nft list table inet lx09 | grep counter', '+ tcp dport 19091 counter packets 3 bytes 180 drop', '+ ip saddr 172.21.0.4 tcp dport 19090 counter packets 1 bytes 60 reject'], { title: 'Ubuntu — output thật', fs: 12.5 })}`,
    `${box('bad', '<b>Docker vượt mặt ufw.</b> <code>-p 3306:3306</code> ghi luật vào bảng <code>nat</code> của Docker, xét TRƯỚC luật <code>filter</code> của ufw ⇒ <code>ufw status</code> nói “chặn”, internet vẫn vào.')}
    ${sh([
      ['docker run -p 127.0.0.1:5432:5432 postgres', 'chỉ máy chủ thấy'],
      ['# compose:', ''],
      ['#   ports: ["127.0.0.1:5432:5432"]', ''],
      ['sudo ss -tlnp | grep 0.0.0.0', 'phép rà nói thật'],
    ], { fs: 13.5 })}
    ${table(['Lỗi client', 'Tường lửa đang'], [['refused (7) ngay', 'REJECT, hoặc không ai nghe'], ['timed out (28)', 'DROP — hoặc chặn ở ngoài máy']], { sm: true })}`, 'l') },

  { t: 'Ubuntu 24.04: cổng SSH do systemd giữ, không phải sshd', body: two(
    `${term(['$ systemctl is-enabled ssh.socket ssh.service', 'enabled', 'disabled', '$ ss -tlnp | grep :22', 'LISTEN 0 4096 0.0.0.0:22 … users:(("systemd",pid=1,fd=50))', '$ echo "Port 993" >> /etc/ssh/sshd_config', '$ systemctl restart ssh; sshd -T | grep ^port', '! port 993', '$ ss -tlnp | grep -E ":22 |:993 "', '! LISTEN 0 4096 0.0.0.0:22 … ("sshd",pid=665),("systemd",pid=1)', '$ systemctl daemon-reload; systemctl restart ssh.socket', '$ ss -tlnp | grep -E ":22 |:993 "', '= LISTEN 0 4096 0.0.0.0:993 … ("sshd",pid=709),("systemd",pid=1)'], { title: 'Ubuntu 24.04 chạy systemd thật — output thật', fs: 12.5 })}`,
    `${steps([
      ['<code>sshd -T</code> nói <b>993</b>, <code>ss</code> nói <b>22</b>', 'cấu hình ≠ thực tế: socket do systemd mở'],
      ['Generator đọc <code>Port</code> khi <b>daemon-reload</b>', 'rồi phải <code>restart ssh.socket</code>'],
      ['<code>Port 993</code> một mình THAY cổng 22', 'muốn cả hai: viết <code>Port 22</code> + <code>Port 993</code>'],
      ['Máy production: thêm listener RIÊNG', 'không restart socket đang giữ lối vào'],
    ])}
    ${box('tip', 'Mỗi câu hỏi một phép đo: cấu hình → <code>sshd -T</code>; ai đang nghe cổng nào → <code>ss -tlnp</code>; vào được không → đăng nhập thử từ máy khác.')}`, 'l') },

  /* ───────────── Cuối chương ───────────── */
  { t: 'Sai lầm hay gặp ở Chương 9', body: table(['Triệu chứng', 'Nguyên nhân thật', 'Sửa'], [
    ['Mở tường lửa rồi mà vẫn không vào được', 'dịch vụ gắn <code>127.0.0.1</code>', '<code>ss -tlnp</code> TRƯỚC khi đụng tường lửa'],
    ['<code>dig</code> ra IP đúng, app vẫn gọi IP cũ', 'dòng sót trong <code>/etc/hosts</code>', 'so với <code>getent hosts</code>'],
    ['Script tải về một trang lỗi HTML mà vẫn “thành công”', 'curl thiếu <code>-f</code>', '<code>curl -sSfL --max-time</code>'],
    ['Báo lỗi luôn là “mã 0”', '<code>$?</code> đọc trong <code>then</code> của <code>if !</code>', 'chụp <code>rc=$?</code> ngay'],
    ['<code>PasswordAuthentication no</code> không ăn', 'file <code>50-cloud-init.conf</code> đọc TRƯỚC', 'tên <code>01-…</code> · kiểm <code>sshd -T</code>'],
    ['Thêm <code>Port 993</code>, cổng vẫn 22', '<code>ssh.socket</code> giữ cổng', '<code>daemon-reload</code> + <code>restart ssh.socket</code>'],
    ['Deploy qua SSH chết giữa chừng khi rớt Wi-Fi', '<code>ssh vps "job &amp;"</code> không tách rời', '<code>tmux new -d</code> · <code>nohup … &gt; log</code>'],
    ['Thư mục app trên máy chủ bị dọn sạch', '<code>--delete</code> + nguồn rỗng', 'chốt khác-rỗng · <code>-n</code> · <code>--max-delete</code>'],
    ['<code>ufw</code> chặn mà CSDL vẫn lộ ra internet', 'Docker <code>-p</code> đi bảng nat trước ufw', '<code>-p 127.0.0.1:…</code>'],
  ], { sm: true }) },

  { t: 'Ubuntu · Fedora · macOS · WSL: cùng việc, khác lệnh', body: table(['Việc', 'Ubuntu 24.04 / WSL2', 'Fedora 44', 'macOS (đo trên Mac M1)'], [
    ['Địa chỉ · tuyến', '<code>ip -br a</code> · <code>ip route</code>', 'như Ubuntu', '-không có <code>ip</code>: <code>ifconfig en0</code> · <code>route -n get default</code>'],
    ['Ai nghe cổng nào', '<code>ss -tlnp</code>', '<code>ss -tlnp</code>', '-không có <code>ss</code>: <code>lsof -nP -iTCP -sTCP:LISTEN</code>'],
    ['Cấu hình DNS', '<code>resolvectl status</code>', '<code>resolvectl status</code>', '<code>scutil --dns</code> · <code>dscacheutil -q host -a name …</code>'],
    ['<code>dig</code> · <code>host</code> · <code>nslookup</code>', '<code>apt install dnsutils</code>', '<code>bind-utils</code>', 'có sẵn cả ba'],
    ['<code>ping</code> hết giờ', '<code>ping -W 2</code> (<code>-t</code> = TTL!)', 'như Ubuntu', '!<code>ping -t 3</code> (<code>-t</code> = hết giờ)'],
    ['rsync', 'GNU rsync 3.2.7', 'GNU rsync', '!openrsync (thiếu nhiều cờ)'],
    ['Tường lửa', 'ufw (tắt sẵn)', 'firewalld (bật, mở ≥ 1025)', 'Application Firewall (theo ứng dụng)'],
    ['<code>timeout</code> · <code>tmux</code>', 'có · <code>apt install tmux</code>', 'có · <code>dnf install tmux</code>', '-không có · <code>brew install tmux</code>'],
    ['Cổng 5000 bị chiếm', '—', '—', '!ControlCenter (AirPlay Receiver) nghe <code>*:5000</code>'],
  ], { sm: true }) },

  { t: 'Bảng tra nhanh Chương 9 (1/2): mạng, DNS, curl', body: two(
    sh([
      ['ip -br a · ip route · ip route get IP', 'địa chỉ · tuyến · đi đường nào'],
      ['sudo ss -tulpn', 'ai nghe cổng nào, địa chỉ nào'],
      ['ss -tan state established', 'kết nối đang mở'],
      ['ping -c3 IP · ping -c3 tên', 'bậc 1 · bậc 2'],
      ['nc -zv host 443 · nc -zv host 20-25', 'bậc 3: cổng'],
      ['timeout 3 bash -c "echo >/dev/tcp/h/443"', 'không cần nc'],
      ['traceroute -n IP · mtr -rwc 20 IP', 'đường đi dừng ở đâu'],
      ['sudo tcpdump -i any -n port 443', 'gói có tới không'],
      ['dig +short tên · dig @8.8.8.8 tên', 'DNS · hỏi resolver khác'],
      ['dig +trace tên · host tên · nslookup tên', 'uỷ quyền · câu ngắn'],
      ['getent hosts tên · resolvectl flush-caches', 'như app · xả đệm'],
    ], { fs: 13.5 }),
    sh([
      ['curl -sSfL --max-time 10 URL', 'mặc định cho script'],
      ['curl -o f URL · curl -O URL · -C -', 'lưu · giữ tên · nối tiếp'],
      ["curl -s -o /dev/null -w '%{http_code}' URL", 'chỉ lấy mã'],
      ["-w '%{time_namelookup} %{time_connect}…'", 'đo từng chặng'],
      ['curl -v URL 2>&1 | grep -E "^[<>*]"', 'đọc cuộc trao đổi'],
      ['curl -sI URL', 'chỉ header'],
      ["curl --json '{\"a\":1}' URL", 'POST JSON (7.82+)'],
      ['curl -H @auth.txt URL', 'token không lộ ra ps'],
      ['curl --resolve h:443:IP https://h/', 'thử máy mới'],
      ['--connect-timeout 3 --retry 3', 'chịu lỗi thoáng qua'],
      ['mã: 6 DNS · 7 cổng · 22 HTTP · 28 hết giờ', ''],
    ], { fs: 13.5 })) },

  { t: 'Bảng tra nhanh Chương 9 (2/2): SSH, rsync, tường lửa', body: two(
    sh([
      ['ssh-keygen -t ed25519 -C "an@laptop"', 'sinh khoá'],
      ['ssh-copy-id -i ~/.ssh/id_ed25519.pub u@h', 'cài khoá'],
      ['ssh -G vps · ssh -v vps', 'cấu hình đã giải · gỡ lỗi'],
      ['ssh -O check vps · ssh -O exit vps', 'ControlMaster'],
      ['ssh -J vps admin@10.0.1.15', 'ProxyJump một lần'],
      ['ssh -fN -L 5432:localhost:5432 vps', 'kéo cổng về'],
      ['ssh -fN -R 8000:localhost:3000 vps', 'đẩy cổng ra'],
      ['ssh -fN -D 1080 vps', 'proxy SOCKS'],
      ["ssh vps 'tmux new -d -s x ./job.sh'", 'việc dài qua SSH'],
      ['ssh-keygen -R host · ssh-keyscan host', 'xoá/lấy host key'],
      ['sudo sshd -t · sudo sshd -T', 'cú pháp · giá trị thật'],
    ], { fs: 13.5 }),
    sh([
      ['rsync -avz src/ host:dst/', '/ cuối = nội dung'],
      ['rsync -ain --delete src/ host:dst/', 'chạy thử, đọc từng mục'],
      ['rsync -az --delete --max-delete=50 …', 'bản gương có trần'],
      ["rsync -avz --exclude='.env*' …", 'không đè .env'],
      ['rsync -avz -e "ssh -p 2222" …', 'cổng lạ'],
      ['scp -P 2222 f host:/p · scp -r d host:', 'một lần, gõ tay'],
      ['sudo ufw allow 22/tcp · ufw enable', 'SSH TRƯỚC khi bật'],
      ['sudo ufw status numbered · ufw delete N', 'xem · gỡ'],
      ['sudo nft list ruleset', 'luật thật bên dưới'],
      ['sudo firewall-cmd --list-all', 'Fedora/RHEL'],
      ['systemctl restart ssh.socket', 'sau daemon-reload: đổi Port'],
    ], { fs: 13.5 })) },

  { t: 'Thực hành Chương 9 (45 phút): ba container, một sự cố', body: `
    ${steps([
      ['Mạng <code>lab-net</code> + 2 container (laptop, vps có <code>openssh-server</code>); vps chạy web ở <code>127.0.0.1:19090</code>', 'từ laptop: thang 4 bậc — bậc nào hỏng, mã curl bao nhiêu?'],
      ['Sinh khoá ed25519, <code>ssh-copy-id</code>, viết <code>~/.ssh/config</code> (Host vps + Host *), đo lần 1 và lần 2 với ControlMaster', 'ra được hai con số ms khác hẳn nhau'],
      ['Mở <code>ssh -fN -L 19094:localhost:19090 vps</code> rồi <code>curl localhost:19094</code>', 'thấy trang của vps dù nó chỉ nghe loopback'],
      ['Trên vps: tạo <code>50-cloud-init.conf</code> (yes) + <code>99-…conf</code> (no); đọc <code>sshd -T</code>; đổi tên thành <code>01-</code>', 'giải thích được vì sao 99- thua'],
      ['<code>rsync -ain --delete</code> một thư mục rỗng lên vps, đọc kế hoạch, rồi thêm chốt khác-rỗng', 'không mất file nào ở đích'],
    ])}
    ${box('good', '<b>Đạt khi:</b> gọi đúng tầng hỏng, có 3 output thật (-L, <code>sshd -T</code>, kế hoạch rsync), đã dọn <code>docker rm -f</code> + <code>network rm</code>.')}` },
].map((s) => (s.kind === 'cover' ? s : { ...s, body: FIX + s.body })));
