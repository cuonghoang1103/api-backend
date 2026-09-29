/**
 * Deploy lên VPS · Deck dv-12 — Chương 12 (MỚI): Từ tên miền tới HTTPS.
 *
 * MỌI output terminal trên slide là output THẬT, chạy 29/09/2026:
 *  - trên Mac M1 (macOS 27, dig 9.10.6) đọc bản ghi CÔNG KHAI của example.com và cuongthai.com (chỉ đọc, qua
 *    resolver của mạng đang ngồi — mạng này chặn cổng 53 ra ngoài nên dig @1.1.1.1 / +trace hết giờ, cũng ghi lại);
 *  - trên "VPS thí nghiệm" = container ubuntu:24.04 tên dv12-vps (arm64, --memory 512m, mạng dv12-net, SSH từ Mac qua
 *    127.0.0.1:19122 bằng khoá tạo trong thư mục nháp): nginx 1.24.0, certbot 2.9.0, OpenSSL 3.0.13, dig 9.18.39;
 *  - CA thử: Pebble (ghcr.io/letsencrypt/pebble) container dv12-pebble — KHÔNG gọi Let's Encrypt thật;
 *  - DNS thí nghiệm: bind9 có thẩm quyền (dv12-dns, TTL 60, SOA min 30) + unbound đệm (dv12-res);
 *  - Caddy 2.11.4 (dv12-caddy) xin chứng chỉ tự động từ Pebble;
 *  - "máy có tường lửa": dv12-fw (ubuntu:24.04 --privileged ngắn hạn, dockerd 29.1.3 bên trong, ufw 0.36.2,
 *    iptables 1.8.10 nf_tables), quét từ dv12-vps bằng nmap;
 *  - "CDN": nginx 1.27 proxy_cache (dv12-cdn) đứng trước nginx gốc :8080.
 * Hình tự vẽ (SVG): chuoi() registrar → DNS → VPS · ttlHinh() TTL đếm ngược từ số đo · acme() trình tự HTTP-01 ·
 * duongGoi() đường đi gói tin qua iptables khi Docker publish cổng.
 * Tô màu: sh() cho bash; conf() (chép từ dv-03) cho nginx.conf/Caddyfile/zone; yaml() cho compose.
 */
import { S, cover, sh, yaml, term, mindmap, diagram, cards, box, table, vs, kpis, two, bars, sv, R, T, A, D, esc } from './_dv-chung.mjs';

export const deck = { key: 'dv-12', code: 'DEPLOY · CHƯƠNG 12', title: 'Từ tên miền tới HTTPS', sub: 'Deploy lên VPS · Chương 12' };

const FIX = '<style>.c-two>div>*+*{margin-top:12px}.c-t.sm{font-size:15px}.c-t.sm td,.c-t.sm th{padding:6px 10px}' +
  '.d-yml .c .nu{color:#b5cea8}.d-yml .c .sx{color:#c586c0}.d-yml .c .sec{color:#ff7b72;font-weight:700}' +
  '.l-sh .c .ty{color:#4ec9b0}svg{max-width:100%;height:auto}</style>';

/* ─────────── tô màu cấu hình: nginx.conf / Caddyfile / zone — cùng khung .d-yml với yaml() (chép từ dv-03) ─────────── */
const conf = (lines, { fs = 15, lang = 'nginx' } = {}) => {
  const hl = (raw) => {
    const ci = raw.search(/(^|\s)#/);
    let body = raw, tail = '';
    if (ci >= 0) { const at = raw[ci] === '#' ? ci : ci + 1; tail = `<span class="cm">${esc(raw.slice(at))}</span>`; body = raw.slice(0, at); }
    let m;
    if (lang === 'ini') {
      if ((m = body.match(/^(\s*)(\[[^\]]+\])(.*)$/))) return `${m[1]}<span class="sec">${esc(m[2])}</span>${esc(m[3])}${tail}`;
      if ((m = body.match(/^(\s*)([A-Za-z]+)(=)(.*)$/))) {
        const v = esc(m[4]).replace(/\b(\d+(?:s|ms)?)\b/g, '<span class="nu">$1</span>');
        return `${m[1]}<span class="k">${esc(m[2])}</span>${m[3]}${v}${tail}`;
      }
      return esc(body) + tail;
    }
    if (lang === 'zone') {
      if ((m = body.match(/^(\S*)(\s+)(IN\s+)?([A-Z]+)(\s+)(.*)$/))) {
        return `<span class="k">${esc(m[1])}</span>${m[2]}${m[3] || ''}<span class="sx">${m[4]}</span>${m[5]}` +
          esc(m[6]).replace(/("[^"]*"|&quot;[^&]*&quot;)/g, '<span class="s">$1</span>').replace(/(\d+\.\d+\.\d+\.\d+)/g, '<span class="nu">$1</span>') + tail;
      }
      return esc(body).replace(/(\$TTL)/, '<span class="sx">$1</span>') + tail;
    }
    // nginx / Caddyfile: từ đầu dòng là chỉ thị
    if ((m = body.match(/^(\s*)([a-z_][a-z0-9_.]*)(\s.*)?$/))) {
      const rest = esc(m[3] || '').replace(/("[^"]*")/g, '<span class="s">$1</span>')
        .replace(/(\d+\.\d+\.\d+\.\d+)(:\d+)?/g, '<span class="nu">$1$2</span>')
        .replace(/(\$[a-z_]+)/g, '<span class="sx">$1</span>')
        .replace(/\b(ssl|http2|always|off|on|permanent)\b/g, '<span class="sx">$1</span>');
      return `${m[1]}<span class="k">${esc(m[2])}</span>${rest}${tail}`;
    }
    return esc(body) + tail;
  };
  return `<div class="d-yml" style="--fs:${fs}px">${lines.map((x) => {
    const [c, a] = Array.isArray(x) ? x : [x, ''];
    return `<div class="c">${hl(c) || ' '}</div><div class="a">${a ? esc(a) : ''}</div>`;
  }).join('')}</div>`;
};

/* ─────────── Registrar → DNS → VPS, số liệu thật của cuongthai.com (dig + RDAP, 29/09) ─────────── */
const chuoi = () => {
  let s = '';
  const bx = (x, w, c, t, d1, d2, d3) => {
    s += R(x, 40, w, 170, { c, r: 12, fill: 'rgba(255,255,255,.03)' });
    s += T(x + w / 2, 76, t, { fs: 19, b: true, a: 'middle', c });
    s += T(x + w / 2, 110, d1, { fs: 15, a: 'middle', mono: true });
    s += T(x + w / 2, 140, d2, { fs: 14, a: 'middle', c: 'mu' });
    s += T(x + w / 2, 168, d3, { fs: 14, a: 'middle', c: 'mu' });
  };
  bx(10, 330, 'vio', '① Nhà đăng ký (registrar)', 'Porkbun LLC', 'bạn TRẢ TIỀN thuê tên ở đây', 'hết hạn 2027-06-07 (RDAP)');
  bx(410, 340, 'dv', '② Nơi giữ DNS (DNS host)', 'kyrie / meilani.ns.cloudflare.com', 'bạn SỬA BẢN GHI ở đây', 'bản ghi NS trỏ sang đây');
  bx(820, 320, 'grn', '③ Máy chủ (VPS)', '160.187.1.208', 'app thật chạy ở đây', 'bản ghi A trỏ vào đây');
  s += A(342, 125, 406, 125, { c: 'vio' }) + T(374, 112, 'NS', { fs: 14, a: 'middle', c: 'vio', b: true });
  s += A(752, 125, 816, 125, { c: 'dv' }) + T(784, 112, 'A', { fs: 14, a: 'middle', c: 'dv', b: true });
  s += T(10, 250, 'Ba bên, ba tài khoản, ba chỗ có thể hỏng. Đổi IP → sửa ở ②. Đổi nhà DNS → sửa NS ở ①. Quên gia hạn ① → cả web mất.', { fs: 15, c: 'amb', b: true });
  return sv(1150, 262, s);
};

/* ─────────── TTL đếm ngược: số đo thật trên bind9 + unbound (29/09, 14:27–14:28) ─────────── */
const ttlHinh = () => {
  let s = '';
  const x0 = 170, W = 900, t0 = 0, t1 = 64; // giây tính từ 14:27:13
  const X = (t) => x0 + ((t - t0) / (t1 - t0)) * W;
  s += T(0, 58, 'máy có thẩm quyền', { fs: 15, b: true, c: 'grn' }) + T(0, 78, '(bind9 · sửa zone)', { fs: 13, c: 'mu' });
  s += T(0, 158, 'resolver đệm', { fs: 15, b: true, c: 'dv' }) + T(0, 178, '(unbound · như 1.1.1.1)', { fs: 13, c: 'mu' });
  s += T(0, 258, 'tên chưa tồn tại', { fs: 15, b: true, c: 'amb' }) + T(0, 278, 'api.vidu.test', { fs: 13, c: 'mu', mono: true });
  // auth
  s += R(X(0), 45, X(2) - X(0), 40, { c: 'blu', fill: 'rgba(88,166,255,.18)', r: 6, sw: 1.5 });
  s += R(X(2), 45, X(64) - X(2), 40, { c: 'grn', fill: 'rgba(63,185,80,.18)', r: 6, sw: 1.5 });
  s += T(X(33), 71, '203.0.113.20 ngay khi sửa', { fs: 15, a: 'middle', c: 'grn', b: true, mono: true });
  // resolver
  s += R(X(0), 145, X(53) - X(0), 40, { c: 'blu', fill: 'rgba(88,166,255,.18)', r: 6, sw: 1.5 });
  s += R(X(53), 145, X(64) - X(53), 40, { c: 'grn', fill: 'rgba(63,185,80,.18)', r: 6, sw: 1.5 });
  s += T(X(26), 171, 'vẫn 203.0.113.10 (IP CŨ)', { fs: 15, a: 'middle', c: 'blu', b: true, mono: true });
  [[2, 46], [12, 36], [22, 25], [33, 15], [43, 5], [53, 60]].forEach(([t, ttl]) => {
    s += `<circle cx="${X(t)}" cy="${128}" r="4" fill="${D.dv}"/>` + T(X(t), 120, `TTL ${ttl}`, { fs: 13, a: 'middle', c: ttl === 60 ? 'grn' : 'mu', mono: true });
  });
  // negative
  s += R(X(0), 245, X(33) - X(0), 40, { c: 'red', fill: 'rgba(248,81,73,.15)', r: 6, sw: 1.5 });
  s += R(X(33), 245, X(64) - X(33), 40, { c: 'grn', fill: 'rgba(63,185,80,.18)', r: 6, sw: 1.5 });
  s += T(X(16), 271, 'NXDOMAIN (đệm "không có")', { fs: 14, a: 'middle', c: 'red', b: true });
  s += T(X(48), 271, 'NOERROR', { fs: 14, a: 'middle', c: 'grn', b: true, mono: true });
  // trục
  s += `<path d="M${X(2)} 30 L${X(2)} 300" stroke="${D.amb}" stroke-width="2" stroke-dasharray="5 5"/>` + T(X(2) + 6, 24, 'sửa A + thêm api (14:27:15)', { fs: 13, c: 'amb', b: true });
  for (let t = 0; t <= 60; t += 10) s += T(X(t), 322, `+${t} s`, { fs: 13, a: 'middle', c: 'dim', mono: true });
  s += T(0, 352, 'Zone TTL 60 s: người đã hỏi TRƯỚC khi sửa giữ IP cũ tới hết 46 s còn lại. Tên hỏi trước khi tạo bị đệm "không có" theo SOA (30 s).', { fs: 14.5, c: 'amb', b: true });
  return sv(1150, 362, s);
};

/* ─────────── ACME HTTP-01: ai nói gì với ai ─────────── */
const acme = () => {
  let s = '';
  const cols = [[140, 'certbot trên VPS', 'vio'], [575, 'CA (Pebble / Let\'s Encrypt)', 'dv'], [1000, 'nginx :80 của VPS', 'grn']];
  cols.forEach(([x, t, c]) => {
    s += R(x - 130, 8, 260, 44, { c, r: 10 }) + T(x, 37, t, { fs: 16, b: true, a: 'middle', c });
    s += `<path d="M${x} 54 L${x} 420" stroke="${D.bd}" stroke-width="2" stroke-dasharray="4 6"/>`;
  });
  const msg = (y, a, b, t, c, dash) => {
    s += A(a, y, b, y, { c, dash, sw: 2.5 });
    s += T((a + b) / 2, y - 8, t, { fs: 14, a: 'middle', c: 'tx' });
  };
  msg(88, 140, 575, '① tạo tài khoản + đặt hàng: vidu.test', 'vio');
  msg(128, 575, 140, '② thử thách http-01: token Upv7…', 'dv', true);
  s += R(20, 150, 240, 44, { c: 'amb', r: 8, fill: 'rgba(210,153,34,.10)' }) + T(140, 177, '③ ghi tệp token vào webroot', { fs: 14, a: 'middle', c: 'amb' });
  msg(218, 140, 575, '④ "sẵn sàng, mời kiểm"', 'vio');
  msg(262, 575, 1000, '⑤ GET /.well-known/acme-challenge/<token>', 'dv');
  msg(302, 1000, 575, '200 + nội dung token ⇒ bạn giữ tên này', 'grn', true);
  msg(346, 140, 575, '⑥ gửi CSR (khoá công khai)', 'vio');
  msg(390, 575, 140, '⑦ chứng chỉ 90 ngày (+ chuỗi)', 'dv', true);
  s += T(575, 445, 'Log nginx thật: 172.22.12.14 "GET /.well-known/acme-challenge/wReO… HTTP/1.1" 200 87 "LetsEncrypt-Pebble-VA"', { fs: 13.5, a: 'middle', c: 'mu', mono: true });
  return sv(1150, 456, s);
};

/* ─────────── Gói tin tới cổng đã publish đi đường nào ─────────── */
const duongGoi = () => {
  let s = '';
  s += R(0, 150, 170, 80, { c: 'dim', r: 10 }) + T(85, 184, 'gói tin tới', { fs: 15, a: 'middle', b: true }) + T(85, 208, ':5432 / :6379', { fs: 14, a: 'middle', c: 'mu', mono: true });
  s += R(230, 150, 220, 80, { c: 'vio', r: 10 }) + T(340, 180, 'PREROUTING (nat)', { fs: 15, a: 'middle', b: true, c: 'vio', mono: true }) + T(340, 206, 'DOCKER: DNAT → 172.17.0.2', { fs: 13, a: 'middle', c: 'mu', mono: true });
  s += A(172, 190, 226, 190, { c: 'dim' });
  // nhánh trên: FORWARD
  s += R(540, 30, 580, 110, { c: 'red', r: 10, fill: 'rgba(248,81,73,.06)' });
  s += T(830, 60, 'FORWARD — gói đã bị đổi đích sang container', { fs: 15, a: 'middle', b: true, c: 'red' });
  s += T(560, 92, '1 DOCKER-USER  →  2 DOCKER-FORWARD: ACCEPT', { fs: 14, mono: true, c: 'tx' });
  s += T(560, 120, '3… ufw-*-forward (không bao giờ tới lượt)', { fs: 14, mono: true, c: 'dim' });
  s += A(452, 175, 536, 95, { c: 'red' }) + T(440, 128, ':5432 (docker -p)', { fs: 13.5, c: 'red', b: true, a: 'end' });
  // nhánh dưới: INPUT
  s += R(540, 240, 580, 110, { c: 'grn', r: 10, fill: 'rgba(63,185,80,.06)' });
  s += T(830, 270, 'INPUT — gói cho chính máy này', { fs: 15, a: 'middle', b: true, c: 'grn' });
  s += T(560, 302, 'ufw-before-input → ufw-user-input → policy DROP', { fs: 14, mono: true, c: 'tx' });
  s += T(560, 330, 'chỉ 22, 80, 443 được qua', { fs: 14, c: 'mu' });
  s += A(452, 205, 536, 290, { c: 'grn' }) + T(440, 266, ':6379 (tiến trình thường)', { fs: 13.5, c: 'grn', b: true, a: 'end' });
  s += T(0, 376, 'ufw chỉ canh INPUT. Docker đổi đích gói tin ở PREROUTING ⇒ gói đi FORWARD ⇒ luật của ufw không được hỏi tới.', { fs: 15, c: 'amb', b: true });
  return sv(1150, 384, s);
};

export const slides = S([
  cover({ t: 'Chương 12 — Từ tên miền tới HTTPS', sub: 'tên miền & DNS · reverse proxy + chứng chỉ ACME · chỉ mở đúng cổng · CDN và tệp tĩnh', chap: 'CHƯƠNG 12' }),

  { t: 'Bản đồ chương: đưa máy ra Internet', body: mindmap('Ra Internet', 'tên · khoá · cửa · bộ đệm', [
    { t: '12.1 Tên miền & DNS', d: 'registrar · A/CNAME/TXT/CAA · TTL · dig', c: 'dv' },
    { t: '12.2 HTTPS', d: 'nginx trước app · ACME HTTP-01/DNS-01 · gia hạn', c: 'grn' },
    { t: '12.3 Chỉ mở đúng cổng', d: 'ss · ufw · Docker vượt ufw · nmap', c: 'red' },
    { t: '12.4 CDN & tệp tĩnh', d: 'Cache-Control · đổi tên khi đổi nội dung', c: 'amb' },
    { t: 'Đã học ở Nginx', d: 'cú pháp · chuỗi chứng chỉ · HSTS', c: 'vio' },
    { t: 'Ch13 tiếp theo', d: 'compose · registry · CI', c: 'blu' },
  ]) },

  /* ───────────── 12.1 ───────────── */
  { t: 'Tên miền đi qua ba bên, không phải một', body: chuoi() + two(
    term([
      '$ dig cuongthai.com NS +noall +answer',
      'cuongthai.com.  1200  IN  NS  kyrie.ns.cloudflare.com.',
      'cuongthai.com.  1200  IN  NS  meilani.ns.cloudflare.com.',
      '$ dig cuongthai.com A +noall +answer',
      '= cuongthai.com.  1163  IN  A  160.187.1.208',
    ], { title: 'Mac — đọc bản ghi công khai, 29/09', fs: 13 }),
    term([
      '$ curl -s https://rdap.verisign.com/com/v1/domain/cuongthai.com | jq …',
      '+ Porkbun LLC',
      'registration 2026-06-07T21:31:00Z',
      '! expiration 2027-06-07T21:31:00Z',
    ], { title: 'RDAP — "whois" qua HTTPS', fs: 13 }), 'l') },

  { t: 'Bảy loại bản ghi bạn sẽ thật sự gõ', body: table(['Loại', 'Trỏ tên tới', 'Ví dụ thật (29/09)', 'Dùng khi'], [
    ['<strong>A</strong>', 'địa chỉ IPv4', '<code>cuongthai.com → 160.187.1.208</code>', 'trỏ tên vào VPS'],
    ['<strong>AAAA</strong>', 'địa chỉ IPv6', '<code>cuongthai.com</code>: không có', 'VPS có IPv6 — thiếu thì chỉ đi IPv4'],
    ['<strong>CNAME</strong>', 'một TÊN khác', '<code>www.vidu.test → vidu.test</code>', 'bí danh; KHÔNG đặt ở đỉnh tên miền'],
    ['<strong>TXT</strong>', 'chuỗi chữ', '<code>"v=spf1 include:_spf.porkbun.com ~all"</code>', 'SPF, xác minh Google, <code>_acme-challenge</code>'],
    ['<strong>CAA</strong>', 'CA nào được cấp', '<code>0 issue "letsencrypt.org"</code> (lab)', 'chặn CA lạ cấp chứng chỉ cho tên bạn'],
    ['<strong>MX</strong>', 'máy nhận thư', '<code>10 cuongthai.com · 20 fwd2.porkbun.com</code>', 'email theo tên miền'],
    ['<strong>NS</strong>', 'ai giữ bản ghi', '<code>kyrie.ns.cloudflare.com</code>', 'đổi nhà DNS (sửa ở registrar)'],
  ], { sm: true }) + two(
    box('bad', '<strong>Đọc thật mới thấy:</strong> <code>cuongthai.com</code> đang có <strong>HAI</strong> bản ghi <code>v=spf1</code> (porkbun + amazonses). RFC 7208 §4.5: nhiều hơn một ⇒ <code>permerror</code> — máy nhận thư coi như không có SPF. Phải gộp làm một.'),
    box('info', '<code>cuongthai.com CAA</code>: không có bản ghi ⇒ <strong>mọi</strong> CA được cấp. Thêm <code>0 issue "letsencrypt.org"</code> là một dòng, miễn phí.')) },

  { t: 'dig: hỏi DNS và đọc từng cột', body: two(
    sh([
      ['dig vidu.test', 'hỏi bản ghi A qua resolver mặc định'],
      ['dig vidu.test AAAA +short', 'chỉ in giá trị'],
      ['dig vidu.test +noall +answer', 'chỉ phần trả lời, có TTL'],
      ['dig @172.22.12.53 vidu.test', 'hỏi THẲNG máy có thẩm quyền'],
      ['dig @172.22.12.54 vidu.test', 'hỏi resolver đệm — có thể cũ'],
      ['dig +trace vidu.com', 'đi từ gốc . → .com → NS của bạn'],
      ['dig -x 160.187.1.208 +short', 'tra ngược IP → tên (PTR)'],
      ['getent hosts vidu.test', 'hỏi như app hỏi: /etc/hosts trước'],
    ], { fs: 14 }),
    `${term([
      '$ dig example.com +noall +answer',
      'example.com.  48  IN  A  172.66.147.243',
      'example.com.  48  IN  A  104.20.23.154',
      '# tên        TTL-còn-lại  lớp  loại  giá-trị',
    ], { title: 'Mac, 29/09', fs: 13.5 })}
    ${term([
      '$ dig @1.1.1.1 example.com',
      '! ;; connection timed out; no servers could be reached',
      '$ dig +trace example.com',
      '! ;; connection timed out; no servers could be reached',
    ], { title: 'Mac, mạng trường — cổng 53 ra ngoài bị chặn', fs: 13.5 })}
    ${box('tip', 'Mạng chặn cổng 53 thì chỉ resolver của mạng trả lời. Chạy <code>+trace</code> trên VPS, hoặc hỏi qua HTTPS (DoH, cổng 443).')}`, 'l') },

  { t: 'TTL: đổi IP rồi mà người khác chưa thấy', body: ttlHinh() + two(
    term([
      '== 14:27:15   auth: 203.0.113.20',
      '! res : vidu.test.  46  IN  A  203.0.113.10',
      '== 14:28:06',
      '= res : vidu.test.  60  IN  A  203.0.113.20',
    ], { title: 'VPS thí nghiệm — bind9 + unbound, TTL 60 s', fs: 12.5 }),
    box('tip', '<strong>Sắp chuyển VPS?</strong> Hạ TTL xuống 60–300 s TRƯỚC một khoảng bằng TTL cũ (1200 s của cuongthai.com = 20 phút; 86400 = một ngày), rồi mới đổi IP. Xong xuôi thì nâng lại.'), 'l') },

  { t: 'Cam hay xám: IP thật của VPS lộ hay không', body: vs({
    no: { t: 'DNS only (xám) — cuongthai.com', items: [
      '<code>dig cuongthai.com</code> → <strong>160.187.1.208</strong> — IP thật của VPS',
      'ai cũng gõ thẳng IP được, vượt mọi lớp bảo vệ của Cloudflare',
      'chứng chỉ HTTPS do chính VPS giữ (certbot)',
      'TTL do bạn đặt (1200 s)',
    ] },
    yes: { t: 'Proxied (cam) — media.cuongthai.com', items: [
      '<code>dig</code> → <strong>172.67.161.19, 104.21.90.200</strong> — IP anycast của Cloudflare',
      'người dùng nói chuyện với Cloudflare; Cloudflare nói với gốc',
      'có cache, chặn DDoS, nhưng CHỈ A/AAAA/CNAME được bật cam',
      'TTL "Auto" = 300 s, không sửa được (đo: 240 đang đếm)',
    ] },
  }) + two(
    box('warn', '<strong>Bật cam mà không giấu nổi IP:</strong> bản ghi cũ còn trong lịch sử DNS, <code>MX cuongthai.com</code> trỏ đúng máy đó, và tường lửa VPS vẫn nhận mọi IP. Muốn giấu thật: chỉ cho IP của Cloudflare vào cổng 80/443.'),
    box('info', 'Bật cam thì có HAI chứng chỉ: trình duyệt ↔ Cloudflare (Cloudflare lo) và Cloudflare ↔ VPS (bạn lo). Chế độ SSL "Flexible" bỏ trống đoạn sau — đừng dùng.')) },

  { t: '/etc/hosts thắng DNS — và Docker có DNS riêng', body: two(
    term([
      '$ grep -v "^#" /etc/resolv.conf',
      'nameserver 127.0.0.11',
      '$ getent hosts vidu.test',
      '172.22.0.3      vidu.test',
      '$ echo "203.0.113.99 vidu.test" | sudo tee -a /etc/hosts',
      '$ getent hosts vidu.test',
      '! 203.0.113.99    vidu.test',
      '$ dig vidu.test +short',
      '172.22.0.3',
      '# ↑ dig bỏ qua /etc/hosts; getent/curl/trình duyệt thì không',
      '$ grep hosts /etc/nsswitch.conf',
      'hosts:          files dns',
      '$ sudo sed -i "/203.0.113.99/d" /etc/hosts',
      '! sed: cannot rename /etc/sedk9TLIa: Device or resource busy',
    ], { title: 'VPS thí nghiệm (container)', fs: 12.5 }),
    `${table(['Công cụ', 'Đọc /etc/hosts?'], [
      ['<code>getent hosts</code>, <code>curl</code>, Node, trình duyệt', '+có — <code>files</code> đứng trước <code>dns</code>'],
      ['<code>dig</code>, <code>nslookup</code>, <code>host</code>', '-không — hỏi thẳng máy DNS'],
    ], { sm: true })}
    ${box('warn', 'Trong container, <code>/etc/hosts</code> là <strong>bind-mount một tệp</strong> — <code>sed -i</code> đổi inode nên hỏng (đúng chuyện nginx.conf 25/08). Ghi đè tại chỗ: <code>grep -v … &gt; /tmp/h; cat /tmp/h &gt; /etc/hosts</code>.')}
    ${box('tip', 'Thử tên miền trước khi trỏ DNS: <code>curl --resolve vidu.com:443:1.2.3.4 https://vidu.com/</code> — không cần sửa tệp nào.')}`, 'l') },

  /* ───────────── 12.2 ───────────── */
  { t: 'App không nghe thẳng 443: nginx đứng trước', body: diagram({
    w: 1150, h: 300,
    nodes: [
      { id: 'u', x: 0, y: 110, w: 190, h: 80, t: 'trình duyệt', d: 'https://vidu.test', c: 'dim' },
      { id: 'n', x: 300, y: 70, w: 330, h: 160, t: 'nginx :80 · :443', d: 'giải mã TLS (chứng chỉ ở đây)\nchuyển 80 → 443\ngiữ /.well-known/acme-challenge/', c: 'dv', mono: true },
      { id: 'a', x: 770, y: 20, w: 370, h: 90, t: 'app 127.0.0.1:3000', d: 'HTTP thường, không biết gì về TLS', c: 'grn', mono: true },
      { id: 'b', x: 770, y: 200, w: 370, h: 90, t: 'certbot / Caddy', d: 'xin + gia hạn chứng chỉ', c: 'vio', mono: true },
    ],
    edges: [
      { from: 'u', to: 'n', t: 'TLS', c: 'dim' },
      { from: 'n', to: 'a', t: 'HTTP nội bộ', c: 'grn', off: -22 },
      { from: 'b', to: 'n', t: 'reload', c: 'vio', dash: true, off: 0 },
    ],
  }) + table(['Vì sao không cho app tự nghe 443', ''], [
    ['cổng &lt; 1024 cần root', 'app chạy bằng root = một lỗ hổng là mất cả máy'],
    ['chứng chỉ đổi mỗi 60–90 ngày', 'một chỗ nạp lại (nginx), không phải restart app'],
    ['nhiều app, một IP', 'nginx chia theo <code>server_name</code> — cú pháp: <strong>/courses/nginx</strong> Ch3, Ch6'],
  ], { sm: true }) },

  { t: 'ACME: chứng minh bạn giữ tên miền', body: acme() },

  { t: 'Xin chứng chỉ trên VPS thí nghiệm (Pebble)', body: two(
    sh([
      ['sudo certbot certonly --webroot \\', 'chỉ xin, không sửa nginx'],
      ['  -w /var/www/html \\', 'thư mục nginx phục vụ ACME'],
      ['  -d vidu.test -d www.vidu.test \\', 'mỗi tên một -d'],
      ['  --server https://pebble:14000/dir \\', 'lab: CA thử; thật: bỏ dòng'],
      ['  --agree-tos -m admin@vidu.test -n', 'không hỏi gì (chạy trong script)'],
    ], { fs: 13.5 }) + term([
      '# lần 1: nginx đang TẮT',
      '! Type:   connection',
      '! Detail: … dial tcp 172.22.0.3:80: connect: connection refused',
      '# lần 2: nginx chạy',
      '= Successfully received certificate.',
      'Certificate is saved at: /etc/letsencrypt/live/vidu.test/fullchain.pem',
      'This certificate expires on 2026-12-28.',
      'real    0m3.690s',
    ], { title: 'VPS thí nghiệm — certbot 2.9.0', fs: 12.5 }),
    `${table(['Tệp trong live/vidu.test/', 'Dùng cho'], [
      ['<code>fullchain.pem</code>', '<code>ssl_certificate</code> — chứng chỉ + trung gian'],
      ['<code>privkey.pem</code>', '<code>ssl_certificate_key</code> — KHÔNG rời máy'],
      ['<code>cert.pem</code> / <code>chain.pem</code>', 'tách riêng (ít dùng)'],
    ], { sm: true })}
    ${box('info', 'Bốn tệp đều là <strong>symlink</strong> sang <code>archive/…/cert1.pem</code>, <code>cert2.pem</code>… — gia hạn tạo số mới rồi đổi symlink.')}
    ${box('warn', 'Lỗi <code>connection</code> nghĩa là CA không vào được cổng 80 — nginx tắt, tường lửa, hay DNS trỏ sai máy. <strong>5 lần sai/giờ/tên</strong> là LE khoá tên đó (09/2026).')}`, 'l') },

  { t: 'HTTP-01 hay DNS-01: chọn theo tình huống', body: table(['', 'HTTP-01', 'DNS-01'], [
    ['CA kiểm bằng', 'GET <code>http://tên/.well-known/acme-challenge/…</code> cổng <strong>80</strong>', 'bản ghi TXT <code>_acme-challenge.tên</code>'],
    ['Wildcard <code>*.vidu.test</code>', '-không được', '+được — cách DUY NHẤT'],
    ['Máy chưa mở ra Internet / sau NAT', '-không được', '+được'],
    ['Cần gì trên VPS', 'cổng 80 mở + webroot', '!khoá API của nhà DNS (lộ = mất tên miền)'],
    ['Hay hỏng vì', 'chuyển hướng 80→443 nuốt đường ACME, tường lửa', 'TXT chưa lan tới, hook ghi đè thay vì THÊM'],
  ], { sm: true }) + two(
    term([
      '$ sudo certbot certonly --webroot … -d "*.vidu.test"',
      '! Client with the currently selected authenticator does not support',
      '! any combination of challenges that will satisfy the CA.',
      '$ sudo certbot certonly --manual --preferred-challenges dns \\',
      '    --manual-auth-hook dns-hook.sh … -d vidu.test -d "*.vidu.test"',
      '= Successfully received certificate.',
      '    DNS:vidu.test, DNS:*.vidu.test',
    ], { title: 'VPS thí nghiệm — Pebble + bind9 (nsupdate)', fs: 12 }),
    term([
      "# log bind9: HAI TXT cùng một tên, cùng lúc",
      "adding an RR at '_acme-challenge.vidu.test' TXT \"FKXx…\"",
      "adding an RR at '_acme-challenge.vidu.test' TXT \"CWq2…\"",
      'deleting an RR at _acme-challenge.vidu.test TXT',
    ], { title: 'vidu.test và *.vidu.test dùng chung tên TXT', fs: 12 }), 'l') },

  { t: 'nginx HTTPS: cổng 80 chỉ còn ACME + chuyển', body: two(
    conf([
      ['server {', ''],
      ['    listen 80;', ''],
      ['    server_name vidu.test www.vidu.test;', ''],
      ['    location /.well-known/acme-challenge/ { root /var/www/html; }', 'gia hạn cần'],
      ['    location / { return 301 https://$host$request_uri; }', ''],
      ['}', ''],
      ['server {', ''],
      ['    listen 443 ssl http2;', '1.24: chưa có "http2 on"'],
      ['    server_name vidu.test www.vidu.test;', ''],
      ['    ssl_certificate     /etc/letsencrypt/live/vidu.test/fullchain.pem;', ''],
      ['    ssl_certificate_key /etc/letsencrypt/live/vidu.test/privkey.pem;', ''],
      ['    add_header Strict-Transport-Security "max-age=300" always;', 'thử nhỏ trước'],
      ['    location / { proxy_pass http://127.0.0.1:3000; }', ''],
      ['}', ''],
    ], { fs: 12.5 }),
    `${term([
      '$ curl -sI http://vidu.test/gio-hang',
      'HTTP/1.1 301 Moved Permanently',
      'Location: https://vidu.test/gio-hang',
      '$ curl -sS https://vidu.test/',
      '! curl: (60) SSL certificate problem: unable to get local issuer certificate',
      '$ curl -s --cacert pebble-root.pem https://vidu.test/',
      '= xin chao tu app — ban dang o /',
      'HTTP/2 200',
      'strict-transport-security: max-age=300',
    ], { title: 'VPS thí nghiệm', fs: 12.5 })}
    ${box('info', 'Lỗi 60 là ĐÚNG: gốc của Pebble không có trong kho tin cậy; gốc của Let\'s Encrypt thì có sẵn.')}
    ${box('warn', '<code>http2 on;</code> (nginx ≥ 1.25.1) trên 1.24: <code>unknown directive</code>. Chuyển hướng + HSTS: <strong>/courses/nginx</strong> 6.5.')}`, 'l') },

  { t: 'Gia hạn xong, nginx vẫn đưa bản cũ', body: two(
    term([
      '$ sudo certbot renew --force-renewal --no-random-sleep-on-renew',
      '= Congratulations, all renewals succeeded:',
      'tren dia : serial=0DD8F6F83872E283',
      '! nginx dua: serial=20503F1A88252ED1',
      '! 5 s sau  : serial=20503F1A88252ED1',
      '$ sudo nginx -s reload',
      '= sau reload: serial=0DD8F6F83872E283',
      '# thêm hook ở renewal-hooks/deploy/ rồi gia hạn lần nữa',
      'truoc  : serial=0DD8F6F83872E283',
      "Hook 'deploy-hook' ran with error output:",
      ' … [notice] 623#623: signal process started',
      '= sau    : serial=618F45BE66DFA322',
    ], { title: 'VPS thí nghiệm — so số seri trên đĩa và trên dây', fs: 12.5 }),
    `${sh([
      ['# /etc/letsencrypt/renewal-hooks/deploy/nap-lai-nginx.sh', ''],
      ['#!/bin/sh', ''],
      ['nginx -t -q && nginx -s reload', 'chỉ chạy khi CẤP MỚI thật'],
    ], { fs: 13.5 })}
    ${box('bad', 'nginx đọc chứng chỉ <strong>lúc nạp cấu hình</strong>. Không reload ⇒ tới ngày hết hạn nó vẫn đưa bản cũ, trong khi <code>certbot certificates</code> báo "VALID: 89 days" — hai nơi nói hai điều.')}
    ${box('info', '"error output" chỉ là dòng <code>[notice]</code> nginx in ra stderr. Kiểm bằng số seri <strong>trên dây</strong>, không bằng tệp.')}`, 'l') },

  { t: 'Bộ hẹn giờ gia hạn: ai chạy, khi nào', body: two(
    `${conf([
      ['# /usr/lib/systemd/system/certbot.timer (gói Ubuntu)', ''],
      ['[Timer]', ''],
      ['OnCalendar=*-*-* 00,12:00:00', 'hai lần mỗi ngày'],
      ['RandomizedDelaySec=43200', 'lệch ngẫu nhiên ≤ 12 giờ'],
      ['Persistent=true', 'máy tắt lỡ giờ ⇒ chạy bù'],
      ['# certbot.service', ''],
      ['ExecStart=/usr/bin/certbot -q renew --no-random-sleep-on-renew', ''],
    ], { fs: 13, lang: 'ini' })}
    ${conf([
      ['# /etc/letsencrypt/renewal/vidu.test.conf', ''],
      ['# renew_before_expiry = 30 days', 'mặc định: còn 30 ngày thì gia hạn'],
      ['server = https://pebble:14000/dir', 'CA nhớ từ lần xin'],
      ['authenticator = webroot', ''],
      ['webroot_path = /var/www/html,', ''],
    ], { fs: 13, lang: 'ini' })}`,
    `${term([
      '$ sudo certbot renew',
      '  …/vidu.test/fullchain.pem expires on 2026-12-28 (skipped)',
      '$ sudo certbot renew --force-renewal     # không có TTY',
      '! Non-interactive renewal: random delay of 356.3 seconds',
      '$ sudo certbot renew --dry-run --server https://pebble:14000/dir',
      '= Congratulations, all simulated renewals succeeded',
    ], { title: 'VPS thí nghiệm', fs: 12.5 })}
    ${box('warn', '<code>--dry-run</code> KHÔNG dùng <code>server</code> trong tệp renewal: nó tự sang máy <strong>staging</strong> của LE. Lab phải ghi rõ <code>--server</code>.')}
    ${box('tip', 'Chạy tay mà treo vài phút? Không phải hỏng: không có terminal thì certbot tự chờ ngẫu nhiên ≤ 8 phút. Thêm <code>--no-random-sleep-on-renew</code>.')}`, 'r') },

  { t: 'certbot hay Caddy: ai giữ chìa khoá', body: two(
    `${conf([
      ['{', ''],
      ['    acme_ca https://pebble:14000/dir', 'lab; thật: bỏ'],
      ['    acme_ca_root /etc/pebble-minica.pem', ''],
      ['    email admin@vidu.test', ''],
      ['}', ''],
      ['caddy.test {', 'có tên ⇒ tự HTTPS'],
      ['    reverse_proxy app.test:3000', ''],
      ['}', ''],
    ], { fs: 14 })}
    ${term([
      '07:34:21 trying to solve challenge tls-alpn-01',
      '= 07:34:27 certificate obtained successfully caddy.test',
      '$ curl -sI http://caddy.test/abc',
      'HTTP/1.1 308 Permanent Redirect',
      'Location: https://caddy.test/abc',
    ], { title: 'Caddy 2.11.4 — không một lệnh certbot nào', fs: 13 })}`,
    table(['', 'nginx + certbot', 'Caddy'], [
      ['Xin chứng chỉ', 'lệnh riêng, bạn chạy', '+tự, khi thấy tên trong cấu hình'],
      ['Gia hạn + nạp lại', 'timer + deploy hook — bạn ráp', '+tự, trong cùng tiến trình'],
      ['Chuyển 80 → 443', 'bạn viết', '+tự (308)'],
      ['Thử thách', 'HTTP-01 (webroot), DNS-01 qua plugin', 'TLS-ALPN-01, HTTP-01, DNS-01 (plugin)'],
      ['Chỗ lưu chứng chỉ', '<code>/etc/letsencrypt</code>', '!<code>/data/caddy</code> — container thì PHẢI là volume'],
      ['Hợp khi', 'đã có nginx (như cuongthai.com)', 'dự án mới, ít cấu hình'],
    ], { sm: true }), 'l') },

  { t: 'Kiểm hạn từ bên ngoài, đừng tin tệp', body: two(
    sh([
      ['echo | openssl s_client -connect vidu.test:443 \\', 'echo: bắt tay xong thì thoát'],
      ['    -servername vidu.test 2>/dev/null \\', 'SNI: chọn đúng khối server'],
      ['  | openssl x509 -noout -issuer -dates -serial \\', ''],
      ['    -ext subjectAltName', 'tên nào được bảo vệ'],
      ['… | openssl x509 -noout -checkend $((30*86400))', 'hết hạn trong 30 ngày? exit 1'],
    ], { fs: 13 }) + term([
      'issuer=CN = Pebble Intermediate CA 1bc889',
      'notBefore=Sep 29 07:29:48 2026 GMT',
      'notAfter=Dec 28 07:29:47 2026 GMT',
      'serial=20503F1A88252ED1',
      '    DNS:vidu.test, DNS:www.vidu.test',
      '# -checkend 30 ngày',
      '= Certificate will not expire   exit=0',
      '# -checkend 100 ngày',
      '! Certificate will expire       exit=1',
    ], { title: 'VPS thí nghiệm — OpenSSL 3.0.13', fs: 12.5 }),
    `${bars([
      { l: 'Hiện tại (classic)', sub: 'mặc định LE', v: 90, txt: '90 ngày', c: 'grn' },
      { l: '10/02/2027', sub: 'classic', v: 64, txt: '64 ngày', c: 'amb' },
      { l: '16/02/2028', sub: 'classic', v: 45, txt: '45 ngày', c: 'ora' },
      { l: 'short-lived', sub: 'tuỳ chọn', v: 6, txt: '6 ngày', c: 'red' },
    ], { lw: 170, max: 90 })}
    ${box('warn', 'LE <strong>thôi gửi email báo hết hạn từ 04/06/2025</strong>. Không ai nhắc nữa: phép kiểm <code>-checkend</code> từ máy khác (Ch9) là thứ duy nhất báo trước. Và "gia hạn cứng 60 ngày" sẽ trễ khi hạn còn 45.')}`, 'l') },

  { t: 'Giới hạn của Let\'s Encrypt (09/2026)', body: table(['Giới hạn', 'Mức', 'Chạm khi'], [
    ['Chứng chỉ mới / tên miền đăng ký', '50 / 7 ngày', 'nhiều tên con, mỗi cái một chứng chỉ'],
    ['Cùng ĐÚNG bộ tên', '!5 / 7 ngày — không xin nới', 'script deploy xin lại chứng chỉ MỖI LẦN chạy'],
    ['Xác minh hỏng / tên / tài khoản', '!5 / giờ', 'thử đi thử lại khi cổng 80 còn đóng'],
    ['Đơn hàng mới / tài khoản', '300 / 3 giờ', 'hiếm với một VPS'],
    ['Tài khoản mới / IP', '10 / 3 giờ', 'container tạo tài khoản mỗi lần khởi động'],
    ['Gia hạn qua ARI', '+miễn mọi giới hạn', 'client hỏi CA "khi nào nên gia hạn"'],
  ], { sm: true }) + two(
    box('tip', 'Thử nghiệm thì dùng máy <strong>staging</strong> (<code>--test-cert</code>) hoặc Pebble như chương này — không bao giờ lặp thử trên máy thật. Lưu <code>/etc/letsencrypt</code> (hoặc <code>/data/caddy</code>) vào volume để khởi động lại không xin lại.'),
    box('info', 'Nguồn: letsencrypt.org/docs/rate-limits (cập nhật 05/08/2026) và bài "Decreasing Certificate Lifetimes to 45 Days". Số hay đổi — đọc lại trước khi tin.')) },

  /* ───────────── 12.3 ───────────── */
  { t: 'ss -tlnp: ai đang nghe, nghe ở đâu', body: term([
      '$ sudo ss -tlnp',
      'State  Recv-Q Send-Q Local Address:Port  Peer Address:PortProcess',
      '! LISTEN 0      511          0.0.0.0:8080       0.0.0.0:*    users:(("nginx",pid=372,fd=10))',
      'LISTEN 0      4096      127.0.0.11:37435      0.0.0.0:*',
      'LISTEN 0      511          0.0.0.0:443        0.0.0.0:*    users:(("nginx",pid=372,fd=28))',
      'LISTEN 0      128          0.0.0.0:22         0.0.0.0:*    users:(("sshd",pid=1,fd=3))',
      'LISTEN 0      511          0.0.0.0:80         0.0.0.0:*    users:(("nginx",pid=372,fd=5))',
      '= LISTEN 0      5          127.0.0.1:3000       0.0.0.0:*',
      'LISTEN 0      128             [::]:22            [::]:*    users:(("sshd",pid=1,fd=4))',
    ], { title: 'VPS thí nghiệm — sau khi bật 443 và dựng gốc :8080 cho bài 12.4', fs: 13 }) + two(
    `${table(['Địa chỉ nghe', 'Ai vào được'], [
      ['<code>0.0.0.0:80</code> / <code>[::]:22</code>', '-mọi máy (nếu tường lửa cho)'],
      ['<code>127.0.0.1:3000</code>', '+chỉ chính máy này — app sau nginx'],
      ['<code>127.0.0.11:…</code>', 'DNS nhúng của Docker — kệ nó'],
    ], { sm: true })}
    ${sh([
      ['sudo ss -tlnp', 't=TCP l=nghe n=số p=tiến trình'],
      ['sudo ss -ulnp', 'u=UDP'],
    ], { fs: 13, so: false })}`,
    `${box('bad', '<code>0.0.0.0:8080</code> là gốc thử của bài 12.4 — nó chỉ cần cho CDN gọi vào, vậy mà đang mở cho <strong>mọi</strong> máy. Đọc <code>ss</code> là thấy ngay; không đọc thì không ai biết.')}
    ${box('good', 'VPS web: chỉ <strong>22 · 80 · 443</strong> nên nghe 0.0.0.0. Postgres, Redis, cổng app: <code>127.0.0.1</code> hoặc mạng nội bộ.')}`, 'l') },

  { t: 'ufw đang bật, mà cổng DB vẫn mở ra ngoài', body: two(
    term([
      '$ sudo ufw status',
      'Status: active',
      '22,80,443/tcp              ALLOW       Anywhere',
      '$ docker run -d --name db -e POSTGRES_PASSWORD=12345 -p 5432:5432 postgres:16-alpine',
      '$ sudo ss -tlnp | grep 5432 | sed "s/  */ /g"',
      'LISTEN 0 4096 0.0.0.0:5432 0.0.0.0:* users:(("docker-proxy",pid=506,fd=7))',
    ], { title: 'dv12-fw — Ubuntu 24.04, ufw 0.36.2, Docker 29.1.3', fs: 12.5 }),
    term([
      '$ nmap -Pn -p 22,80,443,5432,6379 172.22.12.60',
      'PORT     STATE    SERVICE',
      '22/tcp   closed   ssh',
      '! 5432/tcp open     postgresql',
      '= 6379/tcp filtered redis',
      '$ PGPASSWORD=12345 psql -h 172.22.12.60 -U postgres -Atc "select version();"',
      '! PostgreSQL 16.14 on aarch64-unknown-linux-musl, compiled by …',
    ], { title: 'dv12-vps — "máy khác trên Internet"', fs: 12.5 }), 'r') + box('bad', '<strong>6379</strong> (một tiến trình thường nghe 0.0.0.0) bị ufw chặn — <code>filtered</code>. <strong>5432</strong> (Docker <code>-p</code>) thì <code>open</code> và đăng nhập được bằng mật khẩu yếu. Cùng một luật ufw, hai kết quả ngược nhau.') },

  { t: 'Vì sao: Docker rẽ gói tin trước khi ufw hỏi', body: duongGoi() + term([
      '$ sudo iptables -L FORWARD -n --line-numbers | sed -n 3,5p',
      '1    DOCKER-USER  0    --  0.0.0.0/0            0.0.0.0/0',
      '2    DOCKER-FORWARD  0    --  0.0.0.0/0            0.0.0.0/0',
      '3    ufw-before-logging-forward  0    --  0.0.0.0/0            0.0.0.0/0',
    ], { title: 'dv12-fw — iptables 1.8.10 (nf_tables)', fs: 12 }) },

  { t: 'Ba cách đóng cổng DB — đo cả ba', body: table(['Cách', 'Lệnh / cấu hình', 'nmap từ máy khác', 'Khi nào'], [
    ['<strong>A. Chỉ nghe loopback</strong>', '<code>-p 127.0.0.1:5432:5432</code>', '+filtered', 'cần psql từ chính VPS / qua đường hầm SSH'],
    ['<strong>B. Không publish</strong>', 'bỏ <code>-p</code>; API và DB chung mạng Docker', '+filtered (không gì nghe)', '<strong>mặc định đúng</strong> cho compose'],
    ['<strong>C. DOCKER-USER</strong>', '<code>iptables -I DOCKER-USER -i eth0 … --ctorigdstport 5432 -j DROP</code>', '+filtered (2 gói bị chặn)', 'lỡ publish 0.0.0.0, cần vá ngay'],
  ], { sm: true }) + two(
    yaml([
      ['services:', ''],
      ['  db:', ''],
      ['    image: postgres:16-alpine', ''],
      ['    # KHÔNG có ports:', 'chỉ api thấy db:5432'],
      ['  api:', ''],
      ['    ports:', ''],
      ['      - "127.0.0.1:3000:3000"', 'nginx trên máy gọi vào'],
    ], { fs: 13.5 }),
    `${term([
      '$ docker run --rm --network noibo postgres:16-alpine pg_isready -h db',
      '= db:5432 - accepting connections',
      '$ sudo ss -tlnp | grep 5432 || echo "(khong co gi …)"',
      '(khong co gi nghe 5432 tren may)',
    ], { title: 'dv12-fw — cách B', fs: 12.5 })}
    ${box('warn', 'Luật <code>iptables</code> gõ tay mất sau khi khởi động lại máy. A và B nằm trong compose.yaml — đi theo mỗi lần deploy.')}`, 'l') },

  { t: 'Tự quét máy mình từ một máy khác', body: two(
    term([
      '$ nmap -Pn -p- vidu.test',
      'Not shown: 65532 closed tcp ports (reset)',
      'PORT    STATE SERVICE',
      '22/tcp  open  ssh',
      '80/tcp  open  http',
      '443/tcp open  https',
      'Nmap done: 1 IP address (1 host up) scanned in 1.29 seconds',
      '$ nmap -Pn -sV -p 22,80,443 vidu.test',
      '22/tcp  open  ssh      OpenSSH 9.6p1 Ubuntu 3ubuntu13.19',
      '80/tcp  open  http     nginx 1.24.0 (Ubuntu)',
      '443/tcp open  ssl/http nginx 1.24.0 (Ubuntu)',
    ], { title: 'dv12-fw quét dv12-vps (mạng lab, 1,3 s)', fs: 12.5 }),
    `${table(['nmap nói', 'Nghĩa là'], [
      ['<code>open</code>', '-có tiến trình nghe VÀ tường lửa cho qua'],
      ['<code>closed</code>', 'gói tới máy, không ai nghe (RST)'],
      ['<code>filtered</code>', '+tường lửa nuốt gói — không trả lời gì'],
    ], { sm: true })}
    ${box('warn', '<code>-sV</code> đọc được cả phiên bản: <code>nginx 1.24.0 (Ubuntu)</code>. <code>server_tokens off;</code> bỏ số khỏi header — không vá lỗ nào, chỉ bớt mời gọi.')}
    ${box('bad', 'Chỉ quét <strong>máy của bạn</strong>. Quét máy người khác không xin phép có thể phạm luật và bị nhà mạng khoá VPS.')}`, 'l') },

  /* ───────────── 12.4 ───────────── */
  { t: 'Hai loại tệp, hai chính sách cache', body: two(
    term([
      '$ curl -sI http://127.0.0.1:8080/index.html',
      'ETag: "6abb6b3f-32"',
      '= Cache-Control: no-cache',
      '$ curl -sI http://127.0.0.1:8080/assets/app.3f9a1c.js',
      'ETag: "6abb6b3f-f"',
      '= Cache-Control: public, max-age=31536000, immutable',
    ], { title: 'VPS thí nghiệm — nginx gốc :8080', fs: 13 }),
    table(['Tệp', 'Header', 'Vì sao'], [
      ['HTML <code>/</code>, <code>/index.html</code>', '<code>no-cache</code>', 'được lưu, nhưng HỎI LẠI mỗi lần ⇒ deploy xong thấy ngay'],
      ['JS/CSS có mã băm <code>app.3f9a1c.js</code>', '<code>max-age=31536000, immutable</code>', 'nội dung đổi ⇒ TÊN đổi ⇒ không bao giờ cần hỏi lại'],
      ['Ảnh người dùng tải lên', '<code>max-age=…</code> dài', 'tên ngẫu nhiên, không bao giờ ghi đè'],
      ['API <code>/api/…</code>', '<code>no-store</code> / <code>private</code>', 'dữ liệu riêng từng người'],
    ], { sm: true }), 'r') + box('info', '<code>no-cache</code> ≠ "đừng lưu" — đó là <code>no-store</code>. HTML "trỏ" tới tên tệp băm mới: đổi HTML là đổi cả bộ.') },

  { t: 'CDN đứng giữa: lần đầu MISS, sau đó HIT', body: diagram({
    w: 1150, h: 250,
    nodes: [
      { id: 'u', x: 0, y: 90, w: 200, h: 80, t: 'người dùng', d: 'Hà Nội, TP.HCM…', c: 'dim' },
      { id: 'c', x: 330, y: 70, w: 320, h: 120, t: 'CDN (điểm biên)', d: 'lưu theo Cache-Control\nX-Cache-Status: MISS / HIT', c: 'amb', mono: true },
      { id: 'o', x: 800, y: 70, w: 340, h: 120, t: 'gốc = VPS của bạn', d: 'nginx :8080\nchỉ bị hỏi khi MISS', c: 'dv', mono: true },
    ],
    edges: [
      { from: 'u', to: 'c', t: 'mọi request', c: 'dim' },
      { from: 'c', to: 'o', t: 'chỉ khi MISS', c: 'dv', dash: true },
    ],
  }) + two(
    term([
      '$ curl -s -D- http://cdn.test/slides/v1/005.webp',
      'X-Cache-Status: MISS',
      '$ curl -s -D- http://cdn.test/slides/v1/005.webp',
      '= X-Cache-Status: HIT',
      '$ curl -s -D- http://cdn.test/index.html     # hai lần',
      'X-Cache-Status: MISS',
      'X-Cache-Status: MISS',
    ], { title: 'lab — nginx 1.27 proxy_cache đóng vai CDN', fs: 13 }),
    box('info', 'Cloudflare (09/2026): <strong>không cache HTML/JSON mặc định</strong>, cache theo đuôi tệp (js, css, png, webp…); gốc gửi <code>no-cache</code>/<code>no-store</code>/<code>private</code>/<code>max-age=0</code> thì không cache. Gốc không gửi gì: 200 được giữ 120 phút.'), 'l') },

  { t: 'Đổi nội dung, giữ tên: CDN phát bản cũ', body: two(
    term([
      '$ curl -s http://cdn.test/slides/v1/005.webp',
      'ANH SLIDE 5 - ban cu (co loi chinh ta)',
      '# deploy: sửa ảnh, GIỮ TÊN',
      '$ curl -s http://127.0.0.1:8080/slides/v1/005.webp   # gốc',
      '= ANH SLIDE 5 - ban moi (da sua)',
      '$ curl -s -D- http://cdn.test/slides/v1/005.webp',
      '! X-Cache-Status: HIT',
      '! ANH SLIDE 5 - ban cu (co loi chinh ta)',
      '# sửa đúng: đẩy lên tiền tố mới v2',
      '$ curl -s -D- http://cdn.test/slides/v2/005.webp',
      'X-Cache-Status: MISS',
      '= ANH SLIDE 5 - ban moi (da sua)',
    ], { title: 'lab — immutable 1 năm', fs: 13 }),
    `${box('bad', '<strong>Chuyện thật của khoá này:</strong> ảnh slide nằm ở <code>media.cuongthai.com/…/DV/v1/</code> với cache immutable một năm. Dựng lại một deck đã đẩy mà ghi đè cùng tên ⇒ người học thấy ảnh cũ. Luật trong <code>_slides.mjs</code>: đẩy sang <strong>v2</strong>, ghi deck vào <code>VER</code>.')}
    ${table(['Cách sửa', 'Được gì'], [
      ['+đổi tên / tiền tố (<code>v2</code>, mã băm)', 'tức thì, mọi điểm biên, mọi trình duyệt'],
      ['!purge trên CDN', 'xoá bản ở CDN — trình duyệt đã lưu <code>immutable</code> vẫn giữ'],
      ['-chờ hết hạn', '31 536 000 giây = một năm'],
    ], { sm: true })}`, 'l') },

  { t: 'nginx nuốt header app đã đặt', body: two(
    `${term([
      '$ curl -sI http://127.0.0.1:3000/_next/static/chunk.js   # app',
      '= Cache-Control: public, max-age=31536000, immutable',
      '$ curl -sI http://127.0.0.1:8080/_next/static/chunk.js   # qua nginx',
      '! Cache-Control: no-store',
    ], { title: 'VPS thí nghiệm', fs: 13 })}
    ${conf([
      ['location /_next/ {', 'bản SAI'],
      ['    proxy_pass http://127.0.0.1:3000;', ''],
      ['    proxy_hide_header Cache-Control;', 'gỡ header của app'],
      ['    add_header Cache-Control "no-store";', 'dán cái của nginx'],
      ['}', ''],
    ], { fs: 13.5 })}`,
    `${box('bad', '<strong>cuongthai.com, 23/08:</strong> <code>next.config.js</code> đặt cache một tuần cho <code>/playground/**</code> (94MB) — quy tắc đó <strong>chưa từng có hiệu lực ngày nào</strong>: <code>location /</code> của nginx gỡ header rồi dán <code>no-store</code> lên mọi thứ. "nginx thắng Next, luôn luôn."')}
    ${conf([
      ['location /_next/static/ {', 'bản ĐÚNG: nhánh riêng'],
      ['    proxy_pass http://127.0.0.1:3000;', 'KHÔNG proxy_hide_header'],
      ['}', 'header của app đi thẳng ra'],
    ], { fs: 13.5 })}
    ${box('tip', 'Kiểm bằng <code>curl -I</code> qua CỬA TRƯỚC (tên miền thật), không bằng đọc cấu hình của app.')}`, 'l') },

  { t: 'Ảnh người dùng: kho object, không phải đĩa VPS', body: diagram({
    w: 1150, h: 240,
    nodes: [
      { id: 'u', x: 0, y: 80, w: 190, h: 80, t: 'trình duyệt', d: 'tải ảnh lên / xem', c: 'dim' },
      { id: 'v', x: 300, y: 0, w: 300, h: 90, t: 'VPS: API', d: 'ký URL tải lên (presigned)\nlưu KHOÁ tệp vào DB', c: 'dv', mono: true },
      { id: 'r', x: 300, y: 150, w: 300, h: 90, t: 'R2 / S3 (object storage)', d: 'giữ byte của ảnh', c: 'amb', mono: true },
      { id: 'c', x: 800, y: 150, w: 340, h: 90, t: 'CDN media.ten-mien', d: 'cache immutable\ntên cũ không bao giờ đổi', c: 'grn', mono: true },
    ],
    edges: [
      { from: 'u', to: 'v', t: 'xin URL', c: 'dim', off: 8 },
      { from: 'u', to: 'r', t: 'PUT thẳng', c: 'amb', off: 8 },
      { from: 'r', to: 'c', t: 'gốc của CDN', c: 'grn' },
    ],
  }) + table(['Để ảnh trên đĩa VPS', 'Để ở object storage'], [
    ['-chung đĩa với Postgres: đầy là DB chết theo (18/08 đĩa đầy vì cache build)', '+dung lượng không phải lo, trả theo GB'],
    ['-mỗi lượt xem ăn băng thông + CPU của VPS', '+CDN phục vụ, VPS không biết'],
    ['-chuyển VPS / thêm máy thứ hai: phải chép theo', '+mọi máy đọc chung một kho (Ch14)'],
    ['-sao lưu chung với mã và DB', '!sao lưu riêng — xoá nhầm trên kho là mất'],
  ], { sm: true }) },

  { t: 'Sai lầm hay gặp khi ra Internet', body: table(['Việc làm', 'Vì sao hỏng', 'Làm thay bằng'], [
    ['Đổi IP ngay khi chuyển VPS', 'resolver giữ IP cũ tới hết TTL (đo: 46 s còn lại)', 'hạ TTL trước một khoảng bằng TTL cũ'],
    ['Hỏi tên trước khi tạo bản ghi', 'NXDOMAIN bị đệm theo SOA (30 s ở lab)', 'tạo bản ghi rồi mới hỏi / test'],
    ['Hai TXT <code>v=spf1</code>', 'SPF <code>permerror</code> — như không có', 'gộp một bản ghi'],
    ['Gia hạn mà không reload nginx', 'tệp mới, dây vẫn cũ (số seri đo được)', 'deploy hook <code>nginx -t &amp;&amp; nginx -s reload</code>'],
    ['Chuyển 80→443 nuốt <code>/.well-known</code>', 'HTTP-01 hỏng im lặng 60 ngày sau', '<code>location</code> ACME đứng trên (nginx 6.5)'],
    ['Thử đi thử lại trên LE thật', '5 lần sai/giờ, 5 chứng chỉ trùng/tuần', 'staging / Pebble'],
    ['<code>ports: "5432:5432"</code> + tin ufw', 'Docker DNAT trước ufw ⇒ DB lộ (đo: open)', 'không publish / <code>127.0.0.1:</code>'],
    ['Ghi đè tệp tĩnh cùng tên', 'CDN + trình duyệt giữ bản cũ tới 1 năm', 'tên mới / tiền tố <code>v2</code>'],
    ['<code>proxy_hide_header Cache-Control</code> ở <code>/</code>', 'nuốt cache của mọi thứ app đặt', '<code>location</code> riêng cho tệp tĩnh'],
  ], { sm: true }) },

  { t: 'Bảng tra nhanh (1/2): DNS và chứng chỉ', body: two(
    sh([
      ['dig ten.com +noall +answer', 'giá trị + TTL còn lại'],
      ['dig ten.com NS +short', 'ai giữ bản ghi'],
      ['dig ten.com CAA +short', 'CA nào được cấp'],
      ['dig @ns1.nha-dns ten.com +short', 'hỏi thẳng máy có thẩm quyền'],
      ['dig +trace ten.com', 'đi từ gốc (cần cổng 53)'],
      ['getent hosts ten.com', 'như app thấy (có /etc/hosts)'],
      ['curl --resolve ten.com:443:IP https://ten.com/', 'thử trước khi trỏ'],
    ], { fs: 12.5 }),
    sh([
      ['sudo certbot certonly --webroot -w DIR -d ten.com', 'xin'],
      ['sudo certbot certificates', 'đang có gì, còn bao lâu'],
      ['sudo certbot renew --dry-run', 'thử gia hạn (staging)'],
      ['systemctl list-timers certbot.timer', 'lần chạy tới'],
      ['ls /etc/letsencrypt/renewal-hooks/deploy/', 'có hook reload chưa'],
      ['echo | openssl s_client -connect ten.com:443 \\', ''],
      ['  -servername ten.com 2>/dev/null | openssl x509 \\', ''],
      ['  -noout -dates -serial -checkend $((14*86400))', 'hạn TRÊN DÂY'],
    ], { fs: 12.5 }), 'r') },

  { t: 'Bảng tra nhanh (2/2): cổng và cache', body: two(
    sh([
      ['sudo ss -tlnp', 'ai nghe, ở địa chỉ nào'],
      ['sudo ufw status verbose', 'luật + chính sách mặc định'],
      ['sudo ufw allow 22,80,443/tcp', 'chỉ ba cổng'],
      ['docker ps --format "{{.Names}} {{.Ports}}"', 'ai publish 0.0.0.0'],
      ['sudo iptables -t nat -L DOCKER -n', 'DNAT Docker đã tạo'],
      ['sudo iptables -L DOCKER-USER -n -v', 'luật chạy TRƯỚC Docker'],
      ['nmap -Pn -p- IP-cua-ban', 'quét từ máy KHÁC'],
    ], { fs: 12.5 }),
    `${sh([
      ['curl -sI https://ten.com/ | grep -i cache-control', 'HTML: no-cache'],
      ['curl -sI https://ten.com/_next/static/x.js', 'tệp băm: immutable'],
      ['curl -s -D- -o /dev/null URL | grep -i cf-cache-status', 'Cloudflare HIT/MISS'],
    ], { fs: 12.5 })}
    ${table(['Thấy', 'Nghĩa là'], [
      ['<code>curl: (60)</code>', 'chuỗi/gốc không tin được — thiếu trung gian?'],
      ['certbot <code>connection refused</code>', 'CA không vào được cổng 80'],
      ['nmap <code>open</code> cổng DB', 'publish 0.0.0.0 — ufw không cứu'],
      ['<code>HIT</code> mà nội dung cũ', 'ghi đè cùng tên — đổi tên'],
      ['<code>no-store</code> ở tệp băm', 'nginx nuốt header của app'],
    ], { sm: true })}`, 'l') },

  { t: 'Thực hành chương 12 (45 phút, VPS thí nghiệm)', body: table(['Bước', 'Làm gì', 'Đạt khi'], [
    ['<strong>1. DNS</strong> · 10′', 'bind9 + unbound, zone TTL 60; hỏi qua resolver, sửa A, hỏi lại mỗi 10 s', 'ghi được lúc resolver đổi sang IP mới ≈ TTL còn lại'],
    ['<strong>2. Chứng chỉ</strong> · 12′', 'Pebble + nginx webroot; xin cho 2 tên; tắt nginx thử một lần', '+<code>curl --cacert</code> 200; lỗi <code>connection</code> đọc hiểu được'],
    ['<strong>3. Gia hạn</strong> · 8′', '<code>renew --force-renewal</code>, so seri trên dây; thêm deploy hook', 'lần 1 seri CŨ trên dây; có hook thì MỚI'],
    ['<strong>4. Cổng</strong> · 8′', 'dind + ufw; <code>-p 5432:5432</code>; nmap từ máy khác; sửa bằng 127.0.0.1', '<code>open</code> → <code>filtered</code>'],
    ['<strong>5. Cache</strong> · 7′', 'nginx proxy_cache trước gốc; ghi đè ảnh cùng tên rồi đổi <code>v2</code>', 'thấy HIT bản cũ, rồi MISS bản mới'],
  ], { sm: true }) + two(
    box('info', '<strong>Dựng lab:</strong> <code>docker network create dv12-net</code>; Pebble <code>ghcr.io/letsencrypt/pebble</code> với <code>httpPort: 80</code>, alias <code>pebble</code>; VPS có alias <code>vidu.test</code>. certbot cần <code>REQUESTS_CA_BUNDLE=pebble.minica.pem</code>.'),
    box('warn', 'Không gọi Let\'s Encrypt thật, không quét máy người khác. <code>--privileged</code> chỉ cho container tường lửa, xong là <code>docker rm -f</code>.')) },
].map((s) => (s.kind === 'cover' ? s : { ...s, body: FIX + s.body })));
