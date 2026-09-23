/**
 * Docker · Deck dk-08 — Chương 8: Mạng.
 *
 * MỌI output terminal trên slide là output THẬT, chạy 23–24/09/2026:
 *   • "máy Linux" = Fedora 44, nhân 7.1.3, Docker Engine 29.6.2, amd64, firewalld đang bật
 *                   (docker info → Firewall Backend: iptables+firewalld), IP LAN 192.168.1.102
 *   • "máy Mac"   = Mac M1, Docker Desktop 4.91 / Engine 29.8.0, arm64, IP LAN 192.168.1.101
 *   Hai máy cùng một mạng Wi-Fi/LAN ⇒ Mac đóng vai "một máy khác trên mạng" gõ vào cổng của máy Linux.
 * Luật tường lửa chỉ ĐỌC qua container phụ `--network host --privileged` (apk add iptables nftables) — không sửa gì.
 * Tên container trong output mang tiền tố dk08- (luật an toàn của khoá); trong bài người học dùng tên ngắn.
 *
 * Hình tự vẽ (SVG nội tuyến): hostNet() hình trung tâm của chương, portAnatomy(), packetPath(),
 * twoTier(), fourLocal(), shareNs(), wire().
 */
import { S, cover, cards, box, steps, table, vs, kpis, two, mindmap, term as dkTerm, diagram, yaml, esc, D } from './_dk-chung.mjs';

const term = (lines, { title, fs = 15 } = {}) => dkTerm(lines, { title, dir: '~', fs });
const TCSS = '<style>.g-term pre{font-size:15px;line-height:1.45}</style>';

export const deck = { key: 'dk-08', code: 'DOCKER · CHƯƠNG 8', title: 'Mạng', sub: 'Docker · Chương 8' };

/* ───────────── SVG nhỏ tự vẽ (chép từ dk-01) ───────────── */
const MONO = 'SF Mono,Menlo,monospace';
const sv = (w, h, inner) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" style="display:block;margin:0 auto"><defs>` +
  ['dk', 'amb', 'red', 'grn', 'mu', 'tea', 'vio'].map((k) => `<marker id="m-${k}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="${D[k]}"/></marker>`).join('') +
  `</defs>${inner}</svg>`;
const R = (x, y, w, h, { c = 'dk', fill = '#111a2b', dash = false, r = 12, sw = 2.5, op = 1 } = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${D[c] || c}" stroke-width="${sw}"${dash ? ' stroke-dasharray="9 7"' : ''} opacity="${op}"/>`;
const T = (x, y, s, { fs = 17, c = '#e6edf3', a = 'start', b = false, mono = false } = {}) =>
  `<text x="${x}" y="${y}" font-size="${fs}" fill="${D[c] || c}" text-anchor="${a}"${b ? ' font-weight="800"' : ''}${mono ? ` font-family="${MONO}"` : ''}>${esc(s)}</text>`;
const A = (x1, y1, x2, y2, { c = 'dk', dash = false, sw = 3 } = {}) =>
  `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${D[c]}" stroke-width="${sw}" fill="none"${dash ? ' stroke-dasharray="7 6"' : ''} marker-end="url(#m-${c})"/>`;
const L = (x1, y1, x2, y2, { c = 'mu', sw = 3, dash = false } = {}) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${D[c] || c}" stroke-width="${sw}"${dash ? ' stroke-dasharray="6 5"' : ''}/>`;
/** hộp container: tên + 1–2 dòng phụ */
const ctr = (x, y, w, h, n, lines, c = 'dk') =>
  R(x, y, w, h, { c, fill: '#0d1628' }) + `<rect x="${x}" y="${y}" width="7" height="${h}" rx="3" fill="${D[c]}"/>` +
  T(x + 18, y + 26, n, { fs: 17, b: true }) + lines.map((s, i) => T(x + 18, y + 49 + i * 20, s, { fs: 14, c: 'mu', mono: true })).join('');

/* Slide 3 — HÌNH TRUNG TÂM: một máy chủ, hai cầu, veth, DNS nhúng, NAT từ card mạng thật */
const hostNet = () => {
  let s = '';
  // thế giới bên ngoài
  s += R(0, 196, 132, 86, { c: 'blu', fill: '#0b1426' }) + T(66, 224, 'máy khác', { fs: 16, a: 'middle', b: true }) +
    T(66, 246, 'Mac', { fs: 14, a: 'middle', c: 'mu' }) + T(66, 266, '192.168.1.101', { fs: 12.5, a: 'middle', c: 'mu', mono: true });
  // khung máy chủ
  s += R(172, 4, 986, 462, { c: 'bd', fill: 'rgba(17,26,43,.55)', r: 16 }) + T(190, 30, '🖥 máy chủ Linux · Docker Engine 29.6', { fs: 16, c: 'mu', b: true });
  // card mạng thật + NAT
  s += R(192, 196, 196, 86, { c: 'amb', fill: '#1a1608' }) + T(290, 226, 'enp3s0', { fs: 17, a: 'middle', b: true, mono: true }) +
    T(290, 250, '192.168.1.102', { fs: 14, a: 'middle', c: 'mu', mono: true }) + T(290, 270, 'card mạng THẬT', { fs: 13, a: 'middle', c: 'amb' });
  s += A(132, 239, 190, 239, { c: 'blu' }) + T(161, 230, ':18080', { fs: 12, a: 'middle', c: 'blu', mono: true });
  s += R(192, 316, 196, 138, { c: 'red', fill: 'rgba(255,92,108,.07)' }) + T(206, 342, 'iptables (nat)', { fs: 15, b: true, c: 'red' }) +
    T(206, 366, 'VÀO: DNAT :18080', { fs: 13.5, mono: true }) + T(206, 386, '  → 172.17.0.5:80', { fs: 13.5, mono: true }) +
    T(206, 412, 'RA: MASQUERADE', { fs: 13.5, mono: true }) + T(206, 432, '(đổi IP nguồn)', { fs: 13, c: 'mu' });
  s += A(290, 282, 290, 314, { c: 'amb' });
  // cầu docker0 (mặc định)
  s += `<rect x="424" y="142" width="716" height="38" rx="8" fill="rgba(255,138,61,.14)" stroke="${D.ora}" stroke-width="2.5"/>` +
    T(440, 167, 'docker0 · 172.17.0.1/16 — bridge MẶC ĐỊNH · KHÔNG có DNS theo tên', { fs: 15, b: true, c: 'ora' });
  s += ctr(446, 44, 250, 72, 'pub  (-p 18080:80)', ['eth0 172.17.0.5'], 'ora') + ctr(716, 44, 200, 72, 'web', ['eth0 172.17.0.4'], 'ora');
  s += L(571, 116, 571, 142, { c: 'ora' }) + L(816, 116, 816, 142, { c: 'ora' }) + T(580, 134, 'veth', { fs: 12.5, c: 'mu', mono: true });
  s += R(936, 44, 196, 72, { c: 'red', dash: true, fill: 'rgba(255,92,108,.06)' }) + T(1034, 74, 'pub hỏi “web”?', { fs: 14.5, a: 'middle' }) +
    T(1034, 98, '⇒ không ai trả lời', { fs: 14.5, a: 'middle', c: 'red', b: true });
  // đường NAT vào cầu mặc định
  s += `<path d="M388 330 C 410 300, 410 190, 424 172" stroke="${D.red}" stroke-width="3" fill="none" marker-end="url(#m-red)"/>`;
  // cầu tự tạo
  s += `<rect x="424" y="410" width="716" height="38" rx="8" fill="rgba(45,212,191,.12)" stroke="${D.tea}" stroke-width="2.5"/>` +
    T(440, 435, 'br-46b0… · 172.24.0.1/16 — mạng TỰ TẠO dk08-app-net · CÓ DNS', { fs: 15, b: true, c: 'tea' });
  s += ctr(446, 232, 220, 92, 'a', ['eth0 172.24.0.2', 'nameserver 127.0.0.11'], 'tea') + ctr(912, 232, 220, 92, 'b', ['eth0 172.24.0.3'], 'tea');
  s += L(556, 324, 556, 410, { c: 'tea' }) + L(1022, 324, 1022, 410, { c: 'tea' }) + T(566, 372, 'veth', { fs: 12.5, c: 'mu', mono: true });
  // DNS nhúng
  s += R(700, 232, 180, 92, { c: 'vio', dash: true, fill: 'rgba(188,140,255,.08)' }) + T(790, 258, 'DNS nhúng', { fs: 15.5, a: 'middle', b: true, c: 'vio' }) +
    T(790, 280, '127.0.0.11', { fs: 14, a: 'middle', mono: true }) + T(790, 300, '(do dockerd trả lời)', { fs: 12.5, a: 'middle', c: 'mu' });
  s += A(666, 262, 698, 262, { c: 'vio' }) + T(682, 250, '“b”?', { fs: 13, a: 'middle', c: 'vio', b: true });
  s += A(880, 290, 910, 290, { c: 'grn' }) + T(894, 346, '= 172.24.0.3', { fs: 13.5, a: 'middle', c: 'grn', mono: true });
  // hai cầu cách ly nhau
  s += T(1128, 208, '✗ hai cầu không thông nhau', { fs: 13.5, a: 'end', c: 'red' });
  return sv(1160, 470, s);
};

/* Slide 10 — giải phẫu cờ -p */
const portAnatomy = () => {
  const parts = [['-p ', 'mu', ''], ['127.0.0.1', 'vio', 'IP máy chủ (bỏ trống = MỌI card)'], [':', 'mu', ''], ['18081', 'amb', 'cổng trên MÁY CHỦ'], [':', 'mu', ''], ['80', 'grn', 'cổng app nghe TRONG container'], ['/tcp', 'tea', 'giao thức (mặc định tcp)']];
  const cw = 24.6; let x = 60, s = '';
  const marks = [];
  for (const [t, c, lab] of parts) {
    s += T(x, 62, t, { fs: 41, c, b: true, mono: true });
    if (lab) marks.push([x + (t.length * cw) / 2, c, lab]);
    x += t.length * cw;
  }
  const lx = [150, 395, 660, 915];
  marks.forEach(([mx, c, lab], i) => {
    s += `<path d="M${mx} 76 L${mx} 96 L${lx[i]} 118" stroke="${D[c]}" stroke-width="2" fill="none"/>` +
      R(lx[i] - 118, 118, 236, 46, { c, fill: '#0d1628', r: 9, sw: 2 }) + T(lx[i], 147, lab, { fs: 14, a: 'middle' });
  });
  return sv(1040, 170, s);
};

/* Slide 11 — đường đi của một gói tin tới cổng đã công bố */
const packetPath = () => {
  let s = '';
  const bx = (x, y, w, h, c, t1, t2, t3) => R(x, y, w, h, { c, fill: '#0d1628' }) + T(x + w / 2, y + 28, t1, { fs: 16, a: 'middle', b: true }) +
    (t2 ? T(x + w / 2, y + 50, t2, { fs: 13.5, a: 'middle', c: 'mu', mono: true }) : '') + (t3 ? T(x + w / 2, y + 70, t3, { fs: 13.5, a: 'middle', c: 'mu', mono: true }) : '');
  s += bx(0, 120, 170, 90, 'blu', 'Mac gõ vào', '192.168.1.102', ':18082');
  s += bx(210, 110, 230, 110, 'red', 'PREROUTING (nat)', 'chuỗi DOCKER:', 'DNAT → 172.23.0.2:5432');
  s += bx(480, 120, 170, 90, 'mu', 'Định tuyến', 'đích giờ là IP', 'container ⇒ ĐI QUA');
  // nhánh INPUT (bị bỏ qua)
  s += R(700, 6, 440, 118, { c: 'dim', dash: true, fill: 'rgba(107,122,147,.08)' }) + T(920, 34, 'INPUT — gói gửi CHO máy chủ', { fs: 16, a: 'middle', b: true, c: 'mu' }) +
    T(920, 58, 'nơi UFW / firewalld zone đặt luật “chỉ mở 22”', { fs: 14, a: 'middle', c: 'mu' }) +
    T(920, 84, 'gói tới cổng đã công bố KHÔNG đi qua đây', { fs: 14.5, a: 'middle', c: 'red', b: true }) + T(920, 108, '✗', { fs: 20, a: 'middle', c: 'red', b: true });
  // nhánh FORWARD
  s += R(700, 170, 440, 134, { c: 'grn', fill: 'rgba(63,185,80,.07)' }) + T(920, 198, 'FORWARD — gói đi XUYÊN máy chủ', { fs: 16, a: 'middle', b: true, c: 'grn' }) +
    T(716, 226, '1. DOCKER-USER   ← chuỗi của BẠN (đang rỗng)', { fs: 14, mono: true }) +
    T(716, 250, '2. DOCKER-FORWARD → DOCKER: ACCEPT :5432', { fs: 14, mono: true }) +
    T(716, 274, '3. firewalld: “ct status dnat accept”', { fs: 14, mono: true }) + T(716, 294, '   (đã DNAT ⇒ cho qua, không xét zone)', { fs: 13, c: 'mu' });
  s += bx(840, 340, 300, 76, 'tea', 'container db-mo', '172.23.0.2:5432', '');
  s += A(170, 165, 208, 165, { c: 'blu' }) + A(440, 165, 478, 165, { c: 'red' });
  s += A(650, 150, 698, 90, { c: 'mu', dash: true }) + A(650, 180, 698, 230, { c: 'grn' }) + A(990, 304, 990, 338, { c: 'grn' });
  s += T(20, 290, 'Luật “mở/đóng cổng” của tường lửa', { fs: 16, b: true, c: 'amb' }) + T(20, 314, 'nằm ở INPUT. Docker bẻ hướng gói', { fs: 15, c: 'mu' }) +
    T(20, 336, 'NGAY Ở CỬA (PREROUTING), nên gói', { fs: 15, c: 'mu' }) + T(20, 358, 'đi đường FORWARD — tường lửa', { fs: 15, c: 'mu' }) + T(20, 380, 'không bao giờ được hỏi.', { fs: 15, c: 'mu' });
  return sv(1150, 420, s);
};

/* Slide 18 — hai tầng: public / private */
const twoTier = () => {
  let s = '';
  s += R(10, 10, 560, 250, { c: 'blu', dash: true, fill: 'rgba(88,166,255,.05)' }) + T(28, 38, 'mạng dk08-public', { fs: 17, b: true, c: 'blu' });
  s += R(430, 110, 560, 240, { c: 'vio', dash: true, fill: 'rgba(188,140,255,.05)' }) + T(972, 134, 'mạng dk08-private (--internal)', { fs: 17, b: true, c: 'vio', a: 'end' });
  s += ctr(40, 64, 230, 86, 'proxy', ['172.25.0.3', '-p 127.0.0.1:18080:80'], 'blu');
  s += ctr(470, 140, 240, 100, 'backend', ['eth0 172.24.0.3 (private)', 'eth1 172.25.0.2 (public)'], 'tea');
  s += ctr(720, 262, 240, 76, 'db (postgres)', ['172.24.0.2:5432'], 'vio');
  s += A(270, 112, 468, 172, { c: 'grn' }) + T(372, 126, '✓ tên backend', { fs: 14.5, c: 'grn', a: 'middle' });
  s += A(640, 240, 736, 260, { c: 'grn' }) + T(640, 268, '✓ :5432', { fs: 14.5, c: 'grn' });
  s += A(100, 150, 718, 310, { c: 'red', dash: true }) + T(40, 246, '✗ “db”? không phân giải được', { fs: 14.5, c: 'red', b: true });
  s += R(1010, 150, 140, 80, { c: 'dim', fill: '#0b1322' }) + T(1080, 184, 'Internet', { fs: 16, a: 'middle', b: true }) + T(1080, 206, 'example.com', { fs: 13, a: 'middle', c: 'mu', mono: true });
  s += A(960, 292, 1030, 232, { c: 'red', dash: true }) + T(1080, 268, '✗ bad address', { fs: 14, c: 'red', a: 'middle', mono: true });
  s += A(710, 160, 1006, 176, { c: 'grn', dash: true }) + T(880, 198, 'backend ra được (qua public)', { fs: 13.5, c: 'grn', a: 'middle' });
  return sv(1160, 356, s);
};

/* Slide 21 — bốn chữ localhost */
const fourLocal = () => {
  let s = '';
  const panel = (x, y, title, sub, boxes, loopAt, c) => {
    let p = R(x, y, 560, 200, { c: 'bd', fill: 'rgba(17,26,43,.6)', r: 14 }) + T(x + 18, y + 30, title, { fs: 17, b: true }) + T(x + 18, y + 52, sub, { fs: 14, c: 'mu' });
    boxes.forEach(([bx, by, bw, bh, t, bc, dash]) => { p += R(x + bx, y + by, bw, bh, { c: bc, dash, fill: '#0d1628' }) + T(x + bx + bw / 2, y + by + 26, t, { fs: 14.5, a: 'middle', b: true }); });
    const [lx, ly] = loopAt;
    p += `<path d="M${x + lx - 28} ${y + ly} C ${x + lx - 36} ${y + ly + 30}, ${x + lx + 36} ${y + ly + 30}, ${x + lx + 28} ${y + ly + 3}" stroke="${D[c]}" stroke-width="3" fill="none" marker-end="url(#m-${c})"/>` +
      T(x + lx, y + ly + 44, 'localhost', { fs: 13.5, a: 'middle', c, mono: true, b: true });
    return p;
  };
  // 1. terminal trên máy chủ
  s += panel(0, 0, '① Terminal trên máy chủ', 'loopback của máy chủ + mọi cổng đã -p', [[20, 70, 520, 110, 'máy chủ', 'amb'], [330, 100, 180, 50, 'container', 'dim', true]], [150, 110], 'amb');
  // 2. trong container A
  s += panel(580, 0, '② Bên trong container A', 'loopback của RIÊNG A — không phải máy chủ, không phải B', [[20, 62, 520, 128, 'máy chủ', 'dim', true], [40, 98, 220, 84, 'container A', 'tea'], [290, 98, 220, 84, 'container B', 'dim', true]], [150, 130], 'tea');
  // 3. trình duyệt trên laptop, container trên VPS
  s += panel(0, 214, '③ Trình duyệt trên laptop', 'container chạy trên VPS ⇒ localhost = laptop ⇒ chẳng có gì', [[20, 70, 230, 110, 'laptop', 'blu'], [290, 70, 250, 110, 'VPS (ở xa)', 'dim', true]], [135, 110], 'blu');
  // 4. --network host
  s += panel(580, 214, '④ Container --network host', 'không có namespace riêng ⇒ localhost = máy chủ', [[20, 70, 520, 110, 'máy chủ = container (chung ngăn xếp mạng)', 'vio']], [270, 108], 'vio');
  return sv(1140, 416, s);
};

/* Slide 24 — --network container: mượn namespace */
const shareNs = () => {
  let s = '';
  s += R(10, 10, 560, 300, { c: 'tea', dash: true, fill: 'rgba(45,212,191,.05)' }) + T(28, 40, 'MỘT network namespace (của app)', { fs: 17, b: true, c: 'tea' }) +
    T(28, 64, 'eth0 172.26.0.8 · lo · hostname 4d08dd240b48', { fs: 14, c: 'mu', mono: true });
  s += ctr(36, 92, 240, 96, 'app', ['python :3000', 'không có ss/curl'], 'dk') + ctr(304, 92, 240, 96, 'netshoot', ['ss · curl · dig', 'tcpdump · nc'], 'amb');
  s += R(36, 214, 508, 72, { c: 'grn', fill: 'rgba(63,185,80,.08)' }) + T(290, 244, 'localhost:3000 của netshoot = app', { fs: 16, a: 'middle', b: true, c: 'grn' }) +
    T(290, 268, 'không thêm byte nào vào ảnh app', { fs: 14, a: 'middle', c: 'mu' });
  return sv(580, 320, s);
};

/* Slide 27 — refused và timeout trên dây */
const wire = () => {
  let s = '';
  const col2 = (x, title, c) => R(x, 0, 270, 380, { c: 'bd', fill: 'rgba(17,26,43,.55)', r: 14 }) + T(x + 135, 28, title, { fs: 17, a: 'middle', b: true, c });
  s += col2(0, 'REFUSED — bị từ chối', 'amb') + col2(290, 'TIMEOUT — im lặng', 'red');
  // refused
  s += L(40, 60, 40, 330, { c: 'mu', sw: 2 }) + L(230, 60, 230, 330, { c: 'mu', sw: 2 }) + T(40, 54, 'api', { fs: 14, a: 'middle', mono: true }) + T(230, 54, 'db:9999', { fs: 14, a: 'middle', mono: true });
  s += A(40, 100, 228, 130, { c: 'dk' }) + T(120, 102, 'SYN', { fs: 14, mono: true, c: 'dk' });
  s += A(230, 140, 42, 170, { c: 'amb' }) + T(150, 150, 'RST', { fs: 14, mono: true, c: 'amb' });
  s += T(135, 220, '0,00 s', { fs: 26, a: 'middle', b: true, c: 'amb' }) + T(135, 246, 'đúng máy, sai cổng', { fs: 14, a: 'middle', c: 'mu' }) + T(135, 266, 'hoặc dịch vụ chết', { fs: 14, a: 'middle', c: 'mu' });
  // timeout
  s += L(330, 60, 330, 330, { c: 'mu', sw: 2 }) + L(520, 60, 520, 330, { c: 'dim', sw: 2, dash: true }) + T(330, 54, 'api', { fs: 14, a: 'middle', mono: true }) + T(520, 54, '.0.250 ?', { fs: 14, a: 'middle', mono: true });
  [100, 150, 200].forEach((y, i) => { s += A(330, y, 505, y + 12, { c: 'red', dash: true }) + T(410, y - 4, `ARP who-has #${i + 1}`, { fs: 13, mono: true, c: 'red' }); });
  s += T(425, 260, '3,00 s', { fs: 26, a: 'middle', b: true, c: 'red' }) + T(425, 286, 'không ai trả lời —', { fs: 14, a: 'middle', c: 'mu' }) + T(425, 306, 'hết -w 3 thì bỏ cuộc', { fs: 14, a: 'middle', c: 'mu' });
  return sv(560, 384, s);
};

export const slides = S([
  cover({ t: 'Chương 8 — Mạng', sub: 'bridge tự tạo &amp; DNS · công bố cổng &amp; bẫy tường lửa · container gọi nhau · localhost &amp; máy chủ · chẩn đoán', chap: 'CHƯƠNG 8' }),

  { t: 'Bản đồ chương: 5 câu hỏi, 5 bài', body: mindmap('Mạng Docker', 'một namespace + một cây cầu', [
    { t: '8.1 Mạng bridge', d: 'veth, docker0, 5 driver — vì sao bridge MẶC ĐỊNH là cái sai', c: 'dk' },
    { t: '8.2 Công bố cổng', d: '-p là một luật DNAT — và nó đi vòng qua tường lửa', c: 'red' },
    { t: '8.3 Container gọi nhau', d: 'DNS 127.0.0.11, alias, mạng hai tầng', c: 'tea' },
    { t: '8.4 localhost &amp; máy chủ', d: 'host.docker.internal trên Mac vs Linux, --network host', c: 'amb' },
    { t: '8.5 Chẩn đoán', d: '4 câu hỏi theo thứ tự · refused ≠ timeout · netshoot', c: 'vio' },
  ]) },

  /* ───────────── 8.1 ───────────── */
  { t: 'Cả chương trong một hình: namespace, dây veth, cây cầu, NAT', body: `${hostNet()}
    <p style="font-size:15px;color:${D.mu};text-align:center;margin-top:4px">Số liệu thật trên máy Linux của khoá. Cầu mặc định chỉ nối dây; cầu tự tạo có thêm DNS nhúng trả lời theo TÊN; cổng <code>-p</code> là một luật NAT ở card mạng thật.</p>` },

  { t: 'Một sợi dây veth, hai đầu: eth0 (container) ↔ veth (máy chủ)', body: two(
    term(['$ docker exec a ip -o link show eth0 | cut -c1-24', '2: eth0@if646: <BROADCAST…', '$ docker exec a cat /sys/class/net/eth0/iflink', '+ 646              # số của đầu dây bên kia', '# ── trên MÁY CHỦ:', '$ ip -o link | awk -F\': \' \'$1==646\'', '+ 646: vethb5fcc2a@if2', '$ ip -br link show master br-46b006276067', 'vethb5fcc2a@if2  UP   4e:45:8f:57:da:65', 'vethbe8c5a9@if2  UP   3e:8c:f5:a6:6a:d7', '$ ip -br addr show br-46b006276067', 'br-46b006276067  UP   172.24.0.1/16', '$ docker exec a ip route', '= default via 172.24.0.1 dev eth0'], { title: 'output thật — máy Linux, Docker 29.6' }),
    `${steps([
      ['<code>eth0</code> trong container', 'một đầu dây, nằm trong namespace mạng riêng'],
      ['<code>vethb5fcc2a</code> trên máy chủ', 'đầu kia, cắm vào cầu <code>br-46b0…</code>'],
      ['Cầu = cái switch bằng phần mềm', 'IP của cầu (172.24.0.1) là <b>gateway</b> của container'],
    ])}
    ${box('info', 'Trong ảnh alpine, <code>ip</code> là của BusyBox: <b>không có</b> <code>-brief</code>. Dùng <code>ip -o -4 addr</code> hoặc <code>ip addr</code>.')}`, 'l') },

  { t: 'Năm driver — 95% thời gian bạn chỉ cần bridge TỰ TẠO', body: table(['Driver', 'Container nhận được gì', 'Dùng khi'], [
    ['+<code>bridge</code> (tự tạo)', 'IP riêng trên mạng con riêng + DNS theo tên + NAT ra ngoài', 'Gần như mọi lúc'],
    ['!<code>bridge</code> mặc định (<code>docker0</code>)', 'Như trên nhưng <b>KHÔNG có DNS</b> — chỉ gọi nhau bằng IP', 'Không bao giờ, nếu bạn chọn được'],
    ['<code>host</code>', 'KHÔNG có namespace mạng — dùng thẳng card của máy chủ', 'Agent giám sát, multicast (Bài 8.4)'],
    ['<code>none</code>', 'Chỉ có <code>lo</code>', 'Việc phải chứng minh là ngoại tuyến'],
    ['<code>macvlan</code> / <code>ipvlan</code>', 'MAC/IP riêng ngay trên LAN thật, như một máy riêng', 'Thiết bị cũ buộc phải gọi thẳng'],
    ['<code>overlay</code>', 'Mạng trải qua nhiều máy Docker', 'Swarm — ngoài phạm vi một VPS'],
  ], { sm: true }) + box('tip', '<code>docker network ls</code> luôn có sẵn 3 mạng: <code>bridge</code>, <code>host</code>, <code>none</code>. Container không có cờ <code>--network</code> rơi vào <code>bridge</code> — chính là cái mặc định.') },

  { t: 'Bridge mặc định KHÔNG trả lời tên — bridge tự tạo thì có', body: two(
    term(['# không có cờ --network ⇒ bridge mặc định', '$ docker run -d --name db-a -e POSTGRES_PASSWORD=x \\', '    postgres:16-alpine', '$ docker run --rm alpine:3.20 nslookup db-a', 'Server:     192.168.65.7', '…', '! ** server can\'t find db-a: NXDOMAIN', '$ docker run --rm alpine:3.20 cat /etc/resolv.conf', '…', 'nameserver 192.168.65.7   # DNS của máy chủ', '…'], { title: 'output thật — máy Mac' }),
    term(['$ docker network create app-net', '$ docker run -d --name db-b --network app-net \\', '    -e POSTGRES_PASSWORD=x postgres:16-alpine', '$ docker run --rm --network app-net alpine:3.20 \\', '    nslookup db-b', '+ Server:     127.0.0.11', '…', 'Name:   db-b', '= Address: 172.23.0.2', '$ docker run --rm --network app-net alpine:3.20 \\', '    cat /etc/resolv.conf | grep -E "nameserver|options"', '+ nameserver 127.0.0.11', 'options ndots:0'], { title: 'cùng máy Mac, mạng tự tạo' })) +
    box('warn', '<b>Vì sao “compose chạy được mà docker run thì không”:</b> compose TỰ tạo mạng <code>&lt;dự-án&gt;_default</code> cho mọi dịch vụ; <code>docker run</code> trần rơi vào cầu mặc định, nơi <code>/etc/resolv.conf</code> trỏ thẳng ra DNS máy chủ — thứ không hề biết tên container.') },

  { t: 'Một container vào hai mạng = hai card mạng, hai tập tên', body: two(
    term(['$ docker network create --driver bridge \\', '    --subnet 10.42.0.0/24 --gateway 10.42.0.1 edge', '$ docker network connect edge web      # đang chạy vẫn gắn được', '$ docker network inspect edge \\', '    -f \'{{range .Containers}}{{.Name}} {{.IPv4Address}}{{end}}\'', '= web 10.42.0.2/24', '$ docker exec web ip -o -4 addr | awk \'{print $2, $4}\'', 'lo 127.0.0.1/8', 'eth0 172.17.0.10/16     # bridge mặc định', '+ eth1 10.42.0.2/24       # mạng edge vừa gắn', '$ docker exec web ip route', 'default via 172.17.0.1 dev eth0', '10.42.0.0/24 dev eth1 scope link  src 10.42.0.2'], { title: 'output thật — máy Mac' }),
    table(['Cờ khi tạo mạng', 'Nghĩa là'], [
      ['<code>--driver bridge</code>', 'Loại mạng (mặc định đã là bridge)'],
      ['<code>--subnet 10.42.0.0/24</code>', 'Tự chọn dải IP — tránh đụng VPN công ty/trường'],
      ['<code>--gateway 10.42.0.1</code>', 'IP của cầu; container ra ngoài qua đây'],
      ['<code>--internal</code>', 'Cầu KHÔNG có đường ra Internet'],
      ['<code>--ipv6</code>', 'Thêm địa chỉ IPv6 (Docker 29: song song IPv4)'],
      ['<code>--label dkhoc=08</code>', 'Nhãn để lọc/dọn theo nhóm'],
    ], { sm: true }), 'l') },

  { t: 'Khác mạng thì không thấy nhau; mạng --internal thì không ra ngoài', body: two(
    term(['$ docker run --rm alpine:3.20 wget -qO- -T 3 \\', '    http://172.17.0.10/ | head -1      # cùng cầu mặc định', '= <!DOCTYPE html>', '# từ MẠNG KHÁC, cùng IP đó:', '$ docker run --rm --network app-net alpine:3.20 \\', '    wget -qO- -T 3 http://172.17.0.10/', '! wget: download timed out', '# mạng --internal:', '$ docker network create --internal private', '$ docker run --rm --network private alpine:3.20 \\', '    wget -qO- -T 3 http://example.com/', '! wget: bad address \'example.com\'', '$ docker run --rm --network private alpine:3.20 ip route', '+ 172.24.0.0/16 dev eth0 scope link  src 172.24.0.2'], { title: 'output thật — máy Mac' }),
    `${cards([
      { ic: '🧱', t: 'Hai cầu cách ly nhau', d: 'Docker cài luật DROP giữa các cầu: gói bị vứt <strong>im lặng</strong> ⇒ timeout, không phải refused.', c: 'red' },
      { ic: '🔒', t: '--internal: không có route mặc định', d: 'Bảng định tuyến chỉ còn dòng mạng con; tên ngoài không phân giải. Hợp cho CSDL.', c: 'vio' },
      { ic: '🏷', t: 'Đừng ghi IP vào cấu hình', d: 'IP phát theo thứ tự khởi động — đổi thứ tự là đổi IP. Dùng TÊN.', c: 'amb' },
    ], 1)}`, 'l') },

  /* ───────────── 8.2 ───────────── */
  { t: 'EXPOSE chỉ là một dòng ghi chú — -p mới khoét lỗ', body: two(
    term(['$ docker image inspect nginx:1.27-alpine \\', '    -f \'{{json .Config.ExposedPorts}}\'', '{"80/tcp":{}}', '$ docker run -d --name doc nginx:1.27-alpine', '$ docker port doc                 # trống trơn', '$ curl -s -o /dev/null -w \'%{http_code}\\n\' \\', '    --max-time 2 http://localhost:80/ || echo \'khong co ai\'', '! 000', '! khong co ai', '$ docker run -d --name pub -p 18080:80 nginx:1.27-alpine', '$ docker port pub', '+ 80/tcp -> 0.0.0.0:18080', '+ 80/tcp -> [::]:18080'], { title: 'output thật — máy Linux' }),
    `${table(['', '<code>EXPOSE 80</code>', '<code>-p 18080:80</code>'], [
      ['Nằm ở đâu', 'Dockerfile → cấu hình ảnh', 'Lệnh <code>docker run</code> / <code>ports:</code>'],
      ['Mở cổng trên máy chủ?', '-Không', '+Có'],
      ['Container khác gọi được?', 'Được — nhưng KHÔNG nhờ EXPOSE', 'Được (không liên quan)'],
      ['Tác dụng thật', 'Tài liệu + gợi ý cho <code>-P</code>', 'Luật DNAT + <code>docker-proxy</code>'],
    ], { sm: true })}
    ${box('info', '<code>curl</code> in <code>000</code> khi không kết nối được, RỒI mới tới <code>|| echo</code> — đọc output nhớ để ý dòng đó.')}`, 'l') },

  { t: '-p đọc TRÁI = máy chủ, PHẢI = container', body: `${portAnatomy()}
    ${two(table(['Viết', 'docker port (thật, máy Linux)', 'Ai gọi được'], [
      ['<code>-p 18080:80</code>', '<code>0.0.0.0:18080</code> + <code>[::]:18080</code>', '-MỌI máy tới được card mạng'],
      ['<code>-p 127.0.0.1:18081:80</code>', '<code>127.0.0.1:18081</code>', '+Chỉ chính máy chủ (+ SSH tunnel)'],
      ['<code>-p 80</code>', '<code>0.0.0.0:32768</code> (ngẫu nhiên)', 'Thử nghiệm, test'],
      ['<code>-p 18085-18086:5000-5001/udp</code>', '<code>5000/udp -&gt; 0.0.0.0:18085</code> …', 'Cả dải, giao thức UDP'],
    ], { sm: true }),
    term(['# viết NGƯỢC: nginx nghe 80, ta trỏ vào 8080', '$ docker run -d --name nguoc -p 18084:8080 \\', '    nginx:1.27-alpine', '$ curl -sS http://127.0.0.1:18084/', '! curl: (56) Recv failure: Connection reset by peer', '# từ máy khác: Couldn\'t connect to server'], { title: 'máy Linux — container "chạy ngon", không trả lời' }), 'l')}` },

  { t: 'Gói tin tới cổng đã -p bị bẻ hướng NGAY Ở CỬA — tường lửa không được hỏi', body: packetPath() },

  { t: 'Đọc luật thật: mỗi -p là một dòng DNAT, đếm được từng kết nối', body: `
    ${term(['$ docker run --rm --network host --privileged alpine sh -c \\', '    \'apk add -q iptables; iptables -t nat -S DOCKER | grep -E "1808[01]"\'   # chỉ ĐỌC', '+ -A DOCKER ! -i docker0 -p tcp -m tcp --dport 18080 -j DNAT --to-destination 172.17.0.5:80', '= -A DOCKER -d 127.0.0.1/32 ! -i docker0 -p tcp -m tcp --dport 18081 -j DNAT --to-destination 172.17.0.6:80', '$ iptables -t nat -S PREROUTING', '-A PREROUTING -m addrtype --dst-type LOCAL -j DOCKER', '$ iptables -t raw -S PREROUTING | grep 18081', '= -A PREROUTING -d 127.0.0.1/32 ! -i lo -p tcp -m tcp --dport 18081 -j DROP', '# bộ đếm dòng 18080 lúc này = 1. Từ máy Mac: curl http://192.168.1.102:18080/ ×3 → 200 200 200', '$ iptables -t nat -L DOCKER -nv | grep -E "pkts|dpt:1808[01]"', ' pkts bytes target  prot  in        out  source      destination', '+    4   256 DNAT    tcp   !docker0  *    0.0.0.0/0   0.0.0.0/0    tcp dpt:18080 to:172.17.0.5:80', '    0     0 DNAT    tcp   !docker0  *    0.0.0.0/0   127.0.0.1    tcp dpt:18081 to:172.17.0.6:80'], { title: 'output thật — máy Linux (firewalld đang bật) · đọc bằng container phụ, không sudo, không sửa gì' })}
    ${two(box('warn', '<strong>1 → 4:</strong> mỗi kết nối mới từ máy khác làm bộ đếm của dòng DNAT tăng 1. Cổng <code>0.0.0.0</code> không có điều kiện đích ⇒ ai gõ vào IP nào của máy cũng khớp.'),
    box('good', '<strong>127.0.0.1:</strong> dòng DNAT chỉ khớp đích <code>127.0.0.1</code>, lại thêm luật <code>raw … ! -i lo -j DROP</code> (thấy trên Engine 29.6) chặn gói lạ giả đích loopback. Bộ đếm đứng yên ở 0.'))}` },

  { t: 'Sự cố thật: ports: "5432:5432" = Postgres mở cho cả mạng', body: two(
    `${yaml([
      ['services:', ''],
      ['  db-mo:', ''],
      ['    image: postgres:16-alpine', ''],
      ['    ports:', ''],
      ['      - "18082:5432"', 'MỌI card ⇒ cả Internet'],
      ['  db-lo:', ''],
      ['    image: postgres:16-alpine', ''],
      ['    ports:', ''],
      ['      - "127.0.0.1:18083:5432"', 'chỉ máy chủ'],
    ], { fs: 15 })}
    ${box('bad', 'Trên VPS, dòng <code>"5432:5432"</code> “để migrate từ laptop cho tiện” là cửa mở cho máy quét cả Internet. Mật khẩu yếu làm nốt phần còn lại.')}`,
    term(['# gõ từ máy MAC (192.168.1.101) vào máy Linux', '$ nc -zv -G 3 192.168.1.102 18082', '! Connection to 192.168.1.102 port 18082 [tcp/*] succeeded!', '$ docker run --rm -e PGPASSWORD=matkhau-yeu \\', '    postgres:16-alpine psql -h 192.168.1.102 \\', '    -p 18082 -U postgres -Atc \\', '    \'select current_user, inet_server_addr(), version()\'', '! postgres|172.23.0.2|PostgreSQL 16.15 on x86_64-pc-linux…', '$ nc -zv -G 3 192.168.1.102 18083', '= nc: connectx … port 18083 (tcp) failed:', '= Connection refused'], { title: 'output thật — một máy KHÁC đăng nhập được CSDL' }), 'r') },

  { t: 'Ba cách vá, xếp từ an toàn nhất — và một phép rà 2 giây', body: two(
    steps([
      ['<strong>Đừng công bố gì cả</strong> — API gọi <code>db:5432</code> qua mạng container', 'máy chủ không cần cổng nào ⇒ không có luật nào để mà lộ'],
      ['<strong>Buộc phải có:</strong> <code>127.0.0.1:5432:5432</code> + SSH tunnel', '<code>ssh -L 5432:localhost:5432 deploy@vps</code> — xong phiên là đóng'],
      ['<strong>Buộc phải mở ra ngoài:</strong> luật trong <code>DOCKER-USER</code>', 'chuỗi duy nhất Docker không ghi đè; <code>ufw-docker</code> tự làm hộ'],
    ]),
    `${term(['$ docker ps --format \'{{.Names}}\\t{{.Ports}}\'', 'dk08-lo          127.0.0.1:18081->80/tcp', '! dk08-pub         0.0.0.0:18080->80/tcp, [::]:18080->…', '! dk08-pg-db-mo-1  0.0.0.0:18082->5432/tcp, [::]:…', '= dk08-pg-db-lo-1  127.0.0.1:18083->5432/tcp', 'dk08-web         80/tcp        # không publish'], { title: 'rà cổng — chạy được không cần sudo' })}
    ${box('warn', 'Thấy <code>0.0.0.0:</code> hay <code>[::]:</code> đứng trước cổng CSDL, Redis, trang quản trị ⇒ nó đang mở cho mọi máy, bất kể tường lửa nói gì.')}`, 'r') },

  { t: 'docker-proxy và hai lỗi “cổng bận” khác nhau', body: two(
    term(['$ ps -eo pid,args | grep docker-prox[y] | grep 18080', '493315 /usr/bin/docker-proxy -proto tcp -host-ip 0.0.0.0', '       -host-port 18080 -container-ip 172.17.0.5 …', '493322 /usr/bin/docker-proxy -proto tcp -host-ip ::', '       -host-port 18080 -container-ip 172.17.0.5 …', '# ① cổng bị CONTAINER khác giữ:', '! … Bind for 0.0.0.0:18080 failed: port is already allocated', '# ② cổng bị TIẾN TRÌNH máy chủ giữ (python):', '! … failed to bind host port 0.0.0.0:18087/tcp: address already in use', '$ ss -lntp \'sport = :18087\'', '+ LISTEN 0 5 0.0.0.0:18087 … users:(("python3",pid=498970,fd=3))'], { title: 'output thật — máy Linux, Docker 29.6' }),
    `${cards([
      { ic: '🔁', t: 'docker-proxy', d: 'Mỗi cổng công bố: <strong>2 tiến trình</strong> (IPv4 + IPv6) giữ cổng trên máy chủ, lo ca iptables không lo được.', c: 'blu' },
      { ic: '🧟', t: 'Lỗi xong vẫn để lại xác', d: 'Container lỗi cổng nằm ở trạng thái <code>Created</code>. <code>start</code> lại sau đó có thể ra <strong>Up mà KHÔNG có mạng</strong> (đã gặp trên 29.6 và 29.8) ⇒ <code>rm -f</code> rồi tạo lại.', c: 'red' },
      { ic: '🔎', t: 'Ai giữ cổng?', d: '<code>docker ps --filter publish=18080</code> · <code>sudo ss -lntp</code>', c: 'tea' },
    ], 1)}`, 'l') },

  /* ───────────── 8.3 ───────────── */
  { t: 'DNS nhúng 127.0.0.11: hỏi TÊN, nhận IP HIỆN TẠI', body: `
    ${diagram({ w: 1160, h: 220, nodes: [
      { id: 'app', x: 10, y: 60, w: 210, h: 84, t: 'api', d: 'getent hosts cache', c: 'dk' },
      { id: 'dns', x: 330, y: 60, w: 250, h: 84, t: '127.0.0.11', d: 'dockerd trả lời, trong\nnamespace của từng container', c: 'vio' },
      { id: 'known', x: 760, y: 6, w: 390, h: 84, t: 'Tên của mạng này?', d: 'tên container · alias · tên dịch vụ', c: 'tea' },
      { id: 'up', x: 760, y: 130, w: 390, h: 84, t: 'Tên lạ (github.com…)', d: 'hỏi tiếp DNS máy chủ (192.168.65.7)', c: 'dim' },
    ], edges: [{ from: 'app', to: 'dns', t: 'hỏi', c: 'vio' }, { from: 'dns', to: 'known', t: 'có ⇒ IP', c: 'tea' }, { from: 'dns', to: 'up', t: 'không', c: 'dim' }] })}
    ${two(term(['$ docker exec api grep -E "nameserver|options" /etc/resolv.conf', '+ nameserver 127.0.0.11', 'options ndots:0', '$ docker exec api sh -c \'getent hosts cache;', '    nc -z cache 6379 && echo "6379 open"\'', '= 172.26.0.3      cache', '= 6379 open', '$ docker ps --filter name=cache --format \'{{.Ports}}\'', '6379/tcp         # KHÔNG công bố gì'], { title: 'output thật — máy Mac (tên đã rút gọn)' }),
    term(['# ai đang nghe 127.0.0.11 trong namespace?', '$ docker run --rm --pid=host --privileged \\', '    nicolaka/netshoot nsenter -t $PID -n ss -lntp', 'LISTEN 127.0.0.1:3000   users:(("python",pid=14462…))', '+ LISTEN 127.0.0.11:45039 users:(("dockerd",pid=286…))'], { title: 'máy Mac — chính dockerd' }))}` },

  { t: 'Một container, nhiều tên: tên, alias, tên dịch vụ — và xoay vòng', body: two(
    term(['$ docker run -d --name pg --network shop \\', '    --network-alias db --network-alias primary.db \\', '    -e POSTGRES_PASSWORD=x postgres:16-alpine', '$ for n in pg db primary.db; do … getent hosts $n; done', 'pg           172.26.0.4', 'db           172.26.0.4', 'primary.db   172.26.0.4', '# hai container cùng alias "worker":', '$ docker run --rm --network shop nicolaka/netshoot \\', '    dig +short worker', '+ 172.26.0.7', '+ 172.26.0.6', '# compose: tên dịch vụ = tên DNS', '$ docker compose exec api getent hosts cache', '= 172.27.0.2      cache', '$ docker compose exec api getent hosts dk08-cmp-cache-1', '= 172.27.0.2      dk08-cmp-cache-1'], { title: 'output thật — máy Mac' }),
    table(['Tên', 'Ai đặt', 'Phạm vi'], [
      ['Tên container', '<code>--name</code>', 'Mọi mạng tự tạo nó gắn vào'],
      ['<code>--network-alias</code>', 'Bạn, lúc run/connect', 'Chỉ mạng đó'],
      ['Tên dịch vụ compose', 'Khoá dưới <code>services:</code>', 'Mạng của dự án'],
      ['Nhiều container, 1 alias', 'DNS trả <strong>mọi</strong> IP', 'Xoay vòng thô — không phải cân bằng tải'],
      ['Tên lạ', '—', 'Hỏi tiếp DNS máy chủ'],
    ], { sm: true }), 'l') },

  { t: 'Mạng hai tầng: proxy bị chiếm cũng không gọi nổi tên CSDL', body: `${twoTier()}
    ${term(['$ docker exec proxy sh -c \'getent hosts backend && echo backend-ok; getent hosts db || echo "db: not resolvable"\'', '= 172.25.0.2      backend', '= backend-ok', '! db: not resolvable'], { title: 'output thật — máy Mac' })}` },

  { t: 'Tên phân giải được mà vẫn “refused”: 4 nguyên nhân', body: two(
    table(['Thấy gì', 'Nguyên nhân', 'Sửa'], [
      ['-Refused ngay', 'Dịch vụ nghe <code>127.0.0.1</code> trong container của nó', '<code>0.0.0.0</code>: <code>-H 0.0.0.0</code>, <code>listen(3000,\'0.0.0.0\')</code>'],
      ['-Refused, vài giây sau lại được', 'Dịch vụ chưa lên xong (Postgres đang khởi tạo)', 'healthcheck + <code>service_healthy</code> (Ch.9)'],
      ['!Tên không phân giải', 'Hai container không chung mạng nào', 'Gắn chung mạng'],
      ['-Refused / sai giao thức', 'Dùng cổng CÔNG BỐ (5433) thay vì cổng container (5432)', 'Giữa container: luôn cổng container'],
    ], { sm: true }),
    term(['$ docker run -d --name lb --network shop python:3.12-alpine \\', '    python -c "…HTTPServer((\'127.0.0.1\',8000)…"', '$ docker exec api sh -c \'nc -z -w2 lb 8000 && echo open ||', '    echo "refused — bound to loopback"\'', '! refused — bound to loopback', '$ docker run --rm --network container:lb \\', '    nicolaka/netshoot ss -lnt', '! LISTEN 0 5   127.0.0.1:8000   0.0.0.0:*', '# Postgres mới chạy: giai đoạn khởi tạo chỉ nghe socket Unix', '$ docker logs db | grep "listening on"', '… listening on Unix socket "/var/run/postgresql/…"', '+ … listening on IPv4 address "0.0.0.0", port 5432'], { title: 'output thật — máy Mac' }), 'r') },

  { t: '--link đã chết: Docker 29 cảnh báo, và TỪ CHỐI trên mạng tự tạo', body: two(
    term(['$ docker run -d --name old2 --link web:web alpine:3.20 sleep 60', '! WARNING: Links on the default bridge network are deprecated', '! and will be removed in a future release. Use a custom', '! network instead.', '$ docker exec old2 grep web /etc/hosts', '172.17.0.10     web 66b55bdbace9 dk08-web', '# cache nằm trên mạng tự tạo "shop":', '$ docker run -d --name old --link cache:redis \\', '    alpine:3.20 sleep 60', '! docker: Error response from daemon: container f744043b…', '! not attached to default bridge network'], { title: 'output thật — máy Mac, Engine 29.8' }),
    vs({
      no: { t: '--link (cũ)', items: ['Chép IP vào <code>/etc/hosts</code> MỘT lần lúc start ⇒ IP đổi là hỏng', 'Chỉ chạy trên bridge mặc định', 'Một chiều: web không biết old2'] },
      yes: { t: 'Mạng tự tạo', items: ['DNS hỏi lúc cần ⇒ luôn IP hiện tại', 'Hai chiều, mọi container trên mạng', 'Thay <code>--link a:b</code> bằng <code>--network</code> + <code>--network-alias b</code>'] },
    }), 'l') },

  /* ───────────── 8.4 ───────────── */
  { t: 'Bốn chữ localhost, bốn nơi khác nhau', body: `${fourLocal()}
    <p style="font-size:15px;color:${D.mu};text-align:center;margin-top:2px">Mũi tên vòng = nơi <code>localhost</code> thật sự trỏ tới. Chỉ ① và ④ là máy chủ; trong container thường, nó là CHÍNH container đó.</p>` },

  { t: 'host.docker.internal: Mac có sẵn — Linux phải tự thêm, và dịch vụ phải nghe 0.0.0.0', body: two(
    term(['# dịch vụ trên Mac nghe 127.0.0.1:18089', '$ docker run --rm alpine:3.20 \\', '    getent hosts host.docker.internal', '+ 192.168.65.254   host.docker.internal', '$ docker run --rm alpine:3.20 \\', '    wget -qO- http://localhost:18089/', '! wget: can\'t connect … Connection refused', '$ docker run --rm alpine:3.20 \\', '    wget -qO- http://host.docker.internal:18089/', '= xin chao tu may Mac', '# Docker Desktop chuyển tiếp về 127.0.0.1 CỦA MAC'], { title: 'Mac · Docker Desktop 4.91' }),
    term(['$ docker run --rm alpine getent hosts \\', '    host.docker.internal; echo "exit $?"', '! exit 2          # Linux: không có sẵn', '$ docker run --rm \\', '    --add-host=host.docker.internal:host-gateway \\', '    alpine getent hosts host.docker.internal', '+ 172.17.0.1       host.docker.internal', '# dịch vụ nghe 127.0.0.1:18089:', '! wget: … (172.17.0.1): Connection refused', '# dịch vụ nghe 0.0.0.0:18089:', '= xin chao tu may Linux'], { title: 'Linux · Engine 29.6' })) +
    box('info', 'Linux: gói từ container tới máy chủ đi vào qua cầu <code>docker0</code> (172.17.0.1), KHÔNG qua loopback ⇒ dịch vụ phải nghe <code>0.0.0.0</code> (hoặc 172.17.0.1). Compose: <code>extra_hosts: ["host.docker.internal:host-gateway"]</code> — chạy được trên cả hai.') },

  { t: '--network host: bỏ hẳn namespace — được gì, mất gì', body: two(
    term(['$ docker run --rm --network host alpine sh -c \\', '    \'ip -o -4 addr | awk "{print \\$2, \\$4}"\'', 'lo 127.0.0.1/8', '+ enp3s0 192.168.1.102/24     # card THẬT', 'tailscale0 100.98.11.81/32', '…', '$ docker run --rm --network host alpine hostname', '+ CuongThai                   # tên máy chủ', '$ docker run --rm --network host -p 18081:80 alpine true', '! WARNING: Published ports are discarded when using host', '! network mode', '# dịch vụ máy chủ nghe 127.0.0.1:18089:', '$ docker run --rm --network host alpine \\', '    wget -qO- http://localhost:18089/', '! wget: can\'t connect to remote host: Connection refused', '$ … wget -qO- http://127.0.0.1:18089/', '= xin chao tu may Linux'], { title: 'output thật — máy Linux' }),
    `${vs({
      no: { t: 'Mất', items: ['Toàn bộ cách ly mạng', '<code>-p</code> bị vứt (chỉ một dòng WARNING)', 'Hai container không cùng giữ 8080 được'] },
      yes: { t: 'Được', items: ['Không NAT, không veth', 'Thấy card thật: agent giám sát, multicast'] },
    })}
    ${box('warn', '<strong>Bẫy nhỏ:</strong> trong alpine, <code>localhost</code> ra <code>::1</code> (IPv6) trước ⇒ dịch vụ chỉ nghe <code>127.0.0.1</code> sẽ refused. Gõ thẳng <code>127.0.0.1</code>. Trên Mac, “host” là <strong>máy ảo</strong> của Docker Desktop, không phải Mac.')}`, 'l') },

  { t: '--network container:app — mượn đôi mắt của chính app', body: two(
    `${shareNs()}`,
    term(['$ docker run -d --name app --network shop \\', '    -p 127.0.0.1:18081:3000 python:3.12-alpine \\', '    python -m http.server 3000', '$ docker run --rm --network container:app \\', '    nicolaka/netshoot sh -c \'ss -lntp;', '    curl -s -o /dev/null -w "%{http_code}\\n" \\', '    http://localhost:3000/\'', 'State  Local Address:Port', 'LISTEN 127.0.0.11:46591   # DNS nhúng', '+ LISTEN 0.0.0.0:3000        # app nghe đúng', '= 200', '$ docker run --rm --network container:app \\', '    nicolaka/netshoot hostname', '+ 4d08dd240b48              # = hostname của app'], { title: 'output thật — máy Mac' }), 'r') },

  /* ───────────── 8.5 ───────────── */
  { t: 'Bốn câu hỏi, hỏi ĐÚNG thứ tự — mỗi câu loại cả một nhóm nguyên nhân', body: `
    ${diagram({ w: 1160, h: 330, nodes: [
      { id: 'q1', x: 0, y: 10, w: 260, h: 96, t: '① Có đang nghe?', d: 'ss -lntp trong namespace\ncủa container', c: 'dk' },
      { id: 'q2', x: 300, y: 10, w: 260, h: 96, t: '② Nghe ở đâu?', d: '0.0.0.0 hay 127.0.0.1', c: 'tea' },
      { id: 'q3', x: 600, y: 10, w: 260, h: 96, t: '③ Tên phân giải?', d: 'getent hosts / dig\ntừ container BÊN GỌI', c: 'vio' },
      { id: 'q4', x: 900, y: 10, w: 260, h: 96, t: '④ Gói có tới?', d: 'nc -zv → curl -v\n→ tcpdump', c: 'amb' },
      { id: 'c1', x: 0, y: 210, w: 260, h: 110, t: 'Lỗi của APP', d: 'docker logs, lệnh CMD,\nchưa khởi động xong', c: 'red' },
      { id: 'c2', x: 300, y: 210, w: 260, h: 110, t: 'Bind loopback', d: 'đổi sang 0.0.0.0', c: 'red' },
      { id: 'c3', x: 600, y: 210, w: 260, h: 110, t: 'Không chung mạng', d: 'hoặc đang ở bridge\nmặc định', c: 'red' },
      { id: 'c4', x: 900, y: 210, w: 260, h: 110, t: 'refused / timeout', d: 'sai cổng · tường lửa ·\nsai mạng con', c: 'red' },
    ], edges: [
      { from: 'q1', to: 'q2', c: 'grn' }, { from: 'q2', to: 'q3', c: 'grn' }, { from: 'q3', to: 'q4', c: 'grn' },
      { from: 'q1', to: 'c1', t: 'không', c: 'red' }, { from: 'q2', to: 'c2', t: '127.0.0.1', c: 'red' },
      { from: 'q3', to: 'c3', t: 'không', c: 'red' }, { from: 'q4', to: 'c4', t: 'không', c: 'red' },
    ] })}
    ${box('tip', 'Mũi tên xanh = “có, sang câu kế”. Hai câu đầu trả lời chung bằng MỘT lệnh <code>ss -lntp</code>. Luôn thử từ đúng <strong>góc nhìn</strong> của bên đang hỏng.')}` },

  { t: 'Soi socket của một ảnh không có công cụ — không cần sudo', body: two(
    term(['$ docker run -d --name bug --network shop python:3.12-alpine \\', '    python -m http.server 3000 --bind 127.0.0.1', '$ PID=$(docker inspect -f \'{{.State.Pid}}\' bug)', '$ docker run --rm --pid=host --privileged \\', '    nicolaka/netshoot nsenter -t $PID -n ss -lntp', 'Local Address:Port  Process', '! 127.0.0.1:3000     users:(("python",pid=14462,fd=3))', '127.0.0.11:45039    users:(("dockerd",pid=286,fd=261))', '# từ container khác trên cùng mạng:', '$ docker run --rm --network shop nicolaka/netshoot \\', '    nc -zv -w3 bug 3000', '! nc: connect to bug (172.26.0.9) port 3000 (tcp) failed:', '! Connection refused'], { title: 'output thật — máy Mac' }),
    table(['Cách vào', 'Khi nào'], [
      ['<code>--network container:X</code> + netshoot', 'Mặc định: đúng góc nhìn của X'],
      ['<code>--network &lt;mạng&gt;</code> + netshoot', 'Thử GIỮA các container'],
      ['<code>--pid=host --privileged</code> + <code>nsenter -t PID -n</code>', 'Thấy cả tên tiến trình; máy không có sudo'],
      ['<code>sudo nsenter -t PID -n ss -lntp</code>', 'VPS có sudo: không cần ảnh phụ'],
    ], { sm: true }), 'l') },

  { t: 'Refused và timeout nhìn trên dây: một có trả lời, một im lặng', body: two(
    wire(),
    term(['$ docker run --rm --network shop nicolaka/netshoot sh -c \\', '  \'nc -zv -w3 pg 5432; nc -zv -w3 pg 9999;', '   nc -zv -w3 172.26.0.250 5432\'', '= Connection to pg (172.26.0.4) 5432 port … succeeded!', '! nc: connect to pg (172.26.0.4) port 9999 (tcp) failed:', '!     Connection refused', '! nc: connect to 172.26.0.250 port 5432 (tcp) timed out', '# tcpdump trong namespace của api (bỏ cột giờ):', 'IP 172.26.0.2.37821 > 172.26.0.4.9999: Flags [S]', '+ IP 172.26.0.4.9999 > 172.26.0.2.37821: Flags [R.]', 'ARP, Request who-has 172.26.0.250 tell 172.26.0.2', 'ARP, Request who-has 172.26.0.250 tell 172.26.0.2', 'ARP, Request who-has 172.26.0.250 tell 172.26.0.2'], { title: 'output thật — máy Mac (tên rút gọn)' }), 'r') },

  { t: 'dig → nc → curl -v → tcpdump: mỗi công cụ trả lời một tầng', body: two(
    term(['$ … netshoot dig pg @127.0.0.11 +noall +answer', '= pg.            600  IN  A  172.26.0.4', '$ … netshoot curl -sS -o /dev/null -v http://app:3000/', '* IPv4: 172.26.0.8', '*   Trying 172.26.0.8:3000...', '+ * Established connection to app (172.26.0.8 port 3000)', '> GET / HTTP/1.1', '= < HTTP/1.0 200 OK', '$ docker run --rm --net container:api --cap-add NET_ADMIN \\', '    nicolaka/netshoot tcpdump -ni any -c 6 \'tcp port 5432\'', 'eth0 Out IP …2.42635 > 172.26.0.4.5432: Flags [S]', 'eth0 In  IP 172.26.0.4.5432 > …2.42635: Flags [S.]', 'eth0 Out IP …2.42635 > 172.26.0.4.5432: Flags [.]'], { title: 'output thật — máy Mac (đã rút gọn tên)' }),
    table(['Công cụ', 'Trả lời câu', 'Đọc thế nào'], [
      ['<code>dig</code> / <code>getent</code>', '③ tên → IP', 'Không có dòng ANSWER = không chung mạng'],
      ['<code>nc -zv</code>', '④ cổng mở?', 'succeeded / refused / timed out'],
      ['<code>curl -v</code>', 'Ứng dụng trả lời gì', '<code>*</code> kết nối · <code>&gt;</code> gửi · <code>&lt;</code> nhận'],
      ['<code>tcpdump</code>', 'Gói có đi thật không', '[S] [S.] [.] = bắt tay đủ ⇒ mạng ổn, lỗi ở app'],
    ], { sm: true }), 'l') },

  { t: 'Kịch bản phân loại 10 giây: ai ở mạng nào, cổng nào mở ra đâu', body: `
    ${term(['$ docker ps --filter name=dk08- --format \'table {{.Names}}\\t{{.Ports}}\'', 'NAMES          PORTS', '…', 'dk08-proxy     127.0.0.1:18080->80/tcp', 'dk08-backend   80/tcp', 'dk08-db        5432/tcp', '…', '$ docker inspect -f \'{{ .Name }} → {{ range $n, $v := .NetworkSettings.Networks }}{{ $n }} {{ $v.IPAddress }} {{ end }}\' \\', '    $(docker ps -q --filter name=dk08-proxy --filter name=dk08-backend --filter name=dk08-db)', '+ /dk08-proxy → dk08-public 172.25.0.3', '+ /dk08-backend → dk08-private 172.24.0.3 dk08-public 172.25.0.2', '+ /dk08-db → dk08-private 172.24.0.2', '/dk08-db-b → dk08-app-net 172.23.0.2          # (bộ lọc name= khớp cả chuỗi con “dk08-db”)', '! /dk08-db-a → bridge 172.17.0.9                # ← ở bridge MẶC ĐỊNH: không ai gọi tên được'], { title: 'output thật — máy Mac' })}
    ${two(box('tip', 'Hai lệnh này trả lời được phần lớn ca “mạng hỏng”: container thiếu mạng, nằm nhầm bridge mặc định, hoặc cổng mở ra <code>0.0.0.0</code> không nên mở.'),
    box('warn', '<code>ss -lntp | grep docker-proxy</code> chỉ thấy tên tiến trình khi chạy bằng <strong>sudo</strong> — không sudo thì grep ra rỗng và bạn tưởng không có gì mở.'))}` },

  /* ───────────── Cuối chương ───────────── */
  { t: 'Sai lầm hay gặp ở Chương 8', body: table(['Triệu chứng', 'Nguyên nhân thật', 'Sửa'], [
    ['<code>ENOTFOUND db</code> với <code>docker run</code>, compose thì chạy', 'Bridge mặc định không có DNS', '<code>docker network create</code> + <code>--network</code>'],
    ['<code>ECONNREFUSED 127.0.0.1:5432</code> từ container app', '<code>localhost</code> = chính container app', 'Host = tên dịch vụ: <code>db</code>'],
    ['Tên đúng, refused tức thì', 'Dịch vụ nghe <code>127.0.0.1</code> trong container', 'Nghe <code>0.0.0.0</code>'],
    ['Postgres bị đăng nhập từ ngoài dù UFW “chỉ mở 22”', '<code>ports: "5432:5432"</code> = DNAT trước tường lửa', 'Không publish / <code>127.0.0.1:</code> / DOCKER-USER'],
    ['Container Up mà không có IP, PORTS mất <code>-&gt;</code>', '<code>start</code> lại sau lần lỗi “port is already allocated”', '<code>docker rm -f</code> rồi tạo lại'],
    ['Linux: <code>host.docker.internal</code> không phân giải', 'Chỉ Docker Desktop có sẵn', '<code>--add-host=…:host-gateway</code>'],
    ['Thêm <code>--network host</code> cho “hết lỗi”', 'Che lỗi thật, mất cách ly, <code>-p</code> bị vứt', 'Tìm nguyên nhân bằng 4 câu hỏi'],
  ], { sm: true }) },

  { t: 'Bảng tra nhanh Chương 8', body: table(['Muốn…', 'Gõ'], [
    ['Tạo mạng / mạng không ra Internet', '<code>docker network create app-net</code> · <code>--internal</code>'],
    ['Gắn container đang chạy vào mạng', '<code>docker network connect app-net web</code>'],
    ['Container ở mạng nào, IP gì', '<code>docker inspect -f \'{{json .NetworkSettings.Networks}}\' web</code>'],
    ['Cổng nào đang mở ra đâu', '<code>docker ps --format \'{{.Names}}\\t{{.Ports}}\'</code> · <code>docker port web</code>'],
    ['Chỉ máy chủ thấy cổng', '<code>-p 127.0.0.1:18080:80</code> (compose: <code>"127.0.0.1:18080:80"</code>)'],
    ['Tên phụ trên mạng', '<code>--network-alias db</code>'],
    ['Từ container gọi máy chủ', '<code>--add-host=host.docker.internal:host-gateway</code>'],
    ['Soi mạng của container X', '<code>docker run --rm -it --network container:X nicolaka/netshoot</code>'],
    ['Đọc luật NAT (Linux, chỉ đọc)', '<code>sudo iptables -t nat -S DOCKER</code>'],
    ['Tên → IP / cổng mở?', '<code>dig +short db</code> · <code>nc -zv -w3 db 5432</code>'],
  ], { sm: true }) },

  { t: 'Thực hành chương 8 (45 phút)', body: `
    ${steps([
      ['Chứng minh bridge mặc định không có DNS, rồi sửa bằng một mạng tự tạo', '<code>nslookup</code> NXDOMAIN → <code>127.0.0.11</code> trả IP'],
      ['Chạy Postgres với <code>ports: "5432:…"</code>, đăng nhập từ máy KHÁC, rồi đóng lại', 'đổi sang <code>127.0.0.1:</code> → <code>Connection refused</code>'],
      ['Dựng mạng hai tầng: proxy không phân giải được <code>db</code>, db không ra Internet', '<code>getent hosts db</code> rỗng · <code>bad address</code>'],
      ['Gọi một dịch vụ trên máy chủ từ container (Mac và, nếu có, Linux)', 'Linux: <code>host-gateway</code> + dịch vụ nghe <code>0.0.0.0</code>'],
      ['Chẩn đoán một app nghe <code>127.0.0.1</code> bằng 4 câu hỏi', '<code>--network container:</code> + <code>ss -lntp</code> chỉ ra thủ phạm'],
    ])}
    ${box('good', '<b>Đạt khi:</b> giải thích được từng kết quả; sau khi dọn, <code>docker ps -a</code> và <code>docker network ls</code> lọc <code>name=thu-</code> đều rỗng.')}` },
]).map((x) => ({ ...x, body: TCSS + x.body }));
