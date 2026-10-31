/** API Design · 6.3 — OWASP API Security Top 10 (2023): xếp rủi ro, chặn SSRF (output thật audit.mjs). */
import { doiDau, KHOA, cs, bang1, tn, jsBai, nguon, goi } from './_api.mjs';

const R = ['API1 BOLA', 'API2 Broken Authentication', 'API3 Property Level', 'API4 Resource Consumption', 'API5 Function Level', 'API6 Business Flows', 'API7 SSRF', 'API8 Misconfiguration', 'API9 Inventory', 'API10 Unsafe Consumption'];
const E1 = cs({
  ten: 'OWASP 1 — Name the risk', kho: 'EASY', phut: 10, loai: 'table',
  en: 'For each finding on LabFlow, choose the OWASP API Security Top 10 (2023) risk.',
  vi: 'Với mỗi phát hiện trên LabFlow, chọn rủi ro tương ứng trong OWASP API Security Top 10 (2023).',
  bang: [bang1('b1', ['Finding → risk', 'Phát hiện → rủi ro'], [{ ma: 'x', ten: 'Finding' }, { ma: 'a', ten: 'Risk', luaChon: R }], [
    { o: { x: 'A bot books every Monday slot, one booking per minute' }, a: { a: 'API6 Business Flows' } },
    { o: { x: 'POST /devices/dev_1/manual makes the server fetch http://127.0.0.1:4000/health' }, a: { a: 'API7 SSRF' } },
    { o: { x: 'GET /v2/bookings?limit=1000000 is accepted' }, a: { a: 'API4 Resource Consumption' } },
    { o: { x: 'The old /api/beta/ path still answers, without auth, and nobody remembers it' }, a: { a: 'API9 Inventory' } },
    { o: { x: 'Errors return a stack trace and X-Powered-By: Express' }, a: { a: 'API8 Misconfiguration' } },
    { o: { x: 'A token with "alg": "none" is accepted' }, a: { a: 'API2 Broken Authentication' } },
    { o: { x: 'Data from a partner’s timetable API is stored without validation' }, a: { a: 'API10 Unsafe Consumption' } },
    { o: { x: 'PATCH /v2/me copies "role" from the body into the user' }, a: { a: 'API3 Property Level' } },
  ], ['Rate limits count speed; API6 is about how many bookings someone holds. API7 is the server fetching a URL the client chose. API10 treats third-party data as untrusted input.', 'Giới hạn tần suất đếm tốc độ; API6 nói về số booking một người đang giữ. API7 là server tải một URL do client chọn. API10 coi dữ liệu bên thứ ba là đầu vào không đáng tin.'])],
  goiY: [['Who chooses the thing that goes wrong: the record, the field, the URL, the amount?', 'Ai chọn thứ gây lỗi: bản ghi, trường, URL, hay số lượng?'], ['API9 is about what is running and forgotten; API8 about how it is configured.', 'API9 nói về thứ đang chạy mà bị quên; API8 nói về cách cấu hình.']],
  loi: [['Calling the booking bot “just a rate limit problem”.', 'Gọi bot đặt phòng là “chỉ là chuyện giới hạn tần suất”.'], ['Filing the role field under API5 because it ends in a manager’s power.', 'Xếp trường role vào API5 vì kết cục là có quyền quản lý.']],
  tns: [tn('SSRF (Server Side Request Forgery)', 'lừa server gửi request thay kẻ tấn công'), tn('inventory', 'danh mục các API/phiên bản đang chạy')],
  kn: ['OWASP API Top 10'],
});

function isPrivate(ip) {
  const a = ip.toLowerCase().replace(/^\[|\]$/g, '');
  const v4 = a.startsWith('::ffff:') ? a.slice(7) : a;
  if (/^\d+\.\d+\.\d+\.\d+$/.test(v4)) {
    const [x, y] = v4.split('.').map(Number);
    return x === 0 || x === 10 || x === 127 || (x === 169 && y === 254) || (x === 172 && y >= 16 && y <= 31)
      || (x === 192 && y === 168) || (x === 100 && y >= 64 && y <= 127);
  }
  return a === '::' || a === '::1' || /^f[cd]/.test(a) || /^fe[89ab]/.test(a);
}
const E2 = jsBai({
  ten: 'OWASP 2 — Write isPrivate(ip): addresses safeFetch must refuse', kho: 'MEDIUM', phut: 15,
  en: `<p>Return <code>true</code> when the address must not be fetched by the server. IPv4: <code>0.0.0.0/8</code>, <code>10/8</code>, <code>127/8</code> (loopback), <code>169.254/16</code> (link-local — cloud metadata lives there), <code>172.16/12</code>, <code>192.168/16</code>, <code>100.64/10</code> (CGNAT). IPv6: <code>::</code>, <code>::1</code>, <code>fc00::/7</code> (starts with fc or fd), <code>fe80::/10</code> (fe8…feb). An IPv4-mapped IPv6 address <code>::ffff:a.b.c.d</code> is judged as <code>a.b.c.d</code>. Square brackets and upper case may appear.</p>`,
  vi: `<p>Trả <code>true</code> khi server không được tải địa chỉ đó. IPv4: <code>0.0.0.0/8</code>, <code>10/8</code>, <code>127/8</code> (loopback), <code>169.254/16</code> (link-local — nơi đặt metadata của cloud), <code>172.16/12</code>, <code>192.168/16</code>, <code>100.64/10</code> (CGNAT). IPv6: <code>::</code>, <code>::1</code>, <code>fc00::/7</code> (bắt đầu bằng fc hoặc fd), <code>fe80::/10</code> (fe8…feb). Địa chỉ IPv6 ánh xạ IPv4 <code>::ffff:a.b.c.d</code> được xét như <code>a.b.c.d</code>. Có thể có ngoặc vuông và chữ hoa.</p>`,
  dauVao: ['ip — a resolved IPv4 or IPv6 address (string)', 'ip — địa chỉ IPv4 hoặc IPv6 đã phân giải (chuỗi)'],
  dauRa: ['true | false', 'true | false'],
  goiY: [['Strip brackets, lower-case, unwrap ::ffff: first.', 'Bỏ ngoặc, hạ chữ thường, gỡ ::ffff: trước.'], ['172.16/12 means the second number is 16 to 31.', '172.16/12 nghĩa là số thứ hai từ 16 tới 31.']],
  loi: [['Only blocking the string "localhost" and "127.0.0.1".', 'Chỉ chặn chuỗi "localhost" và "127.0.0.1".'], ['Forgetting 169.254.169.254 — the cloud metadata address.', 'Quên 169.254.169.254 — địa chỉ metadata của cloud.']],
  gt: ['Lesson 6.3: the guard refused https://169.254.169.254/latest/meta-data/ with 422 “private address”, after resolving.', 'Bài 6.3: lớp chặn từ chối https://169.254.169.254/latest/meta-data/ với 422 “private address”, sau khi phân giải.'],
  kn: ['SSRF', 'OWASP API Top 10'],
  tns: [tn('loopback', 'địa chỉ vòng về chính máy'), tn('link-local', 'địa chỉ chỉ dùng trong một đoạn mạng')],
  dau: `/** must the server refuse to fetch this address? */
function isPrivate(ip) {
  // Write your solution here
  return ip === '127.0.0.1' || ip === 'localhost';
}
`,
  giai: '// Reference solution\n' + nguon(isPrivate),
  cases: [
    { goi: `['127.0.0.1', '169.254.169.254', '93.184.215.14'].map(isPrivate)`, moTa: ['Loopback, metadata, a public address', 'Loopback, metadata, một địa chỉ công khai'] },
    { goi: `['10.1.2.3', '172.16.0.1', '172.31.255.255', '172.32.0.1', '192.168.1.102'].map(isPrivate)`, moTa: ['Private ranges and the edge of 172.16/12', 'Dải riêng và mép của 172.16/12'] },
    { goi: `['::1', '[::1]', 'fd00::5', 'FE80::1', '2606:4700::1'].map(isPrivate)`, an: true, moTa: ['IPv6', 'IPv6'] },
    { goi: `['::ffff:127.0.0.1', '::ffff:8.8.8.8'].map(isPrivate)`, an: true, moTa: ['IPv4-mapped IPv6', 'IPv6 ánh xạ IPv4'] },
    { goi: `['100.64.0.1', '100.128.0.1', '0.0.0.0', '127.255.0.9'].map(isPrivate)`, an: true },
    { goi: goi('isPrivate', '203.0.113.10'), an: true },
  ],
});

function urlVerdict(raw, resolve) {
  const m = /^([a-z][a-z0-9+.-]*):\/\/(\[[^\]]+\]|[^\/:?#]+)/i.exec(raw);
  if (!m) return 'bad url';
  if (m[1].toLowerCase() !== 'https') return 'https only';
  const host = m[2].replace(/^\[|\]$/g, '').toLowerCase();
  const addrs = /^[\d.]+$/.test(host) || host.includes(':') ? [host] : (resolve[host] || []);
  if (addrs.length === 0) return 'cannot resolve';
  const priv = (ip) => /^(127\.|10\.|0\.|169\.254\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(ip) || ip === '::1';
  return addrs.some(priv) ? 'private address' : 'OK';
}
const E3 = jsBai({
  ten: 'OWASP 3 — Write urlVerdict(raw, resolve): safeFetch’s decision before fetching', kho: 'HARD', phut: 18,
  en: `<p>Decide what <code>safeFetch</code> does with a URL. <code>resolve</code> plays DNS: <code>{ hostname: [addresses] }</code>. Return the first that applies:</p><ol>
<li><code>'bad url'</code> — <code>raw</code> does not start with <code>scheme://host</code> (host = <code>[ipv6]</code> or the characters up to <code>/ : ? #</code>)</li>
<li><code>'https only'</code> — the scheme is not <code>https</code> (any case)</li>
<li>the addresses: an IP host (digits and dots, or containing <code>:</code> — strip <code>[ ]</code>) is its own address; otherwise <code>resolve[hostname]</code>. None ⇒ <code>'cannot resolve'</code></li>
<li><code>'private address'</code> — ANY address is private (here: <code>127.</code>, <code>10.</code>, <code>0.</code>, <code>169.254.</code>, <code>192.168.</code>, <code>172.16–31.</code>, <code>::1</code>)</li>
<li>otherwise <code>'OK'</code></li></ol>
<p>The real <code>safeFetch</code> parses with <code>new URL()</code>, which also rewrites spellings such as <code>https://127.1/</code> or <code>https://2130706433/</code> into <code>127.0.0.1</code> before the check; here you read the host as typed.</p>`,
  vi: `<p>Quyết định <code>safeFetch</code> làm gì với một URL. <code>resolve</code> đóng vai DNS: <code>{ hostname: [địa chỉ] }</code>. Trả điều đầu tiên khớp:</p><ol>
<li><code>'bad url'</code> — <code>raw</code> không bắt đầu bằng <code>scheme://host</code> (host = <code>[ipv6]</code> hoặc các ký tự tới <code>/ : ? #</code>)</li>
<li><code>'https only'</code> — scheme khác <code>https</code> (không phân biệt hoa thường)</li>
<li>các địa chỉ: host là IP (chữ số và dấu chấm, hoặc có <code>:</code> — bỏ <code>[ ]</code>) thì chính nó là địa chỉ; còn lại lấy <code>resolve[hostname]</code>. Không có ⇒ <code>'cannot resolve'</code></li>
<li><code>'private address'</code> — BẤT KỲ địa chỉ nào là nội bộ (ở đây: <code>127.</code>, <code>10.</code>, <code>0.</code>, <code>169.254.</code>, <code>192.168.</code>, <code>172.16–31.</code>, <code>::1</code>)</li>
<li>còn lại <code>'OK'</code></li></ol>
<p><code>safeFetch</code> thật phân tích bằng <code>new URL()</code>, thứ còn tự đổi các cách viết như <code>https://127.1/</code> hay <code>https://2130706433/</code> thành <code>127.0.0.1</code> trước khi kiểm; ở đây bạn đọc host đúng như đã gõ.</p>`,
  dauVao: ['raw — string; resolve — { hostname: string[] }', 'raw — chuỗi; resolve — { hostname: string[] }'],
  dauRa: ['"bad url" | "https only" | "cannot resolve" | "private address" | "OK"', '"bad url" | "https only" | "cannot resolve" | "private address" | "OK"'],
  goiY: [['One regular expression gives the scheme and the host.', 'Một biểu thức chính quy cho ra scheme và host.'], ['A name that resolves to several addresses is refused if any one is private.', 'Một tên phân giải ra nhiều địa chỉ thì bị từ chối nếu có một địa chỉ nội bộ.']],
  loi: [['Checking the hostname string instead of the resolved addresses.', 'Kiểm chuỗi hostname thay vì các địa chỉ đã phân giải.'], ['Checking only the first resolved address.', 'Chỉ kiểm địa chỉ phân giải đầu tiên.']],
  gt: ['Lesson 6.3: http://127.0.0.1:4000/health ⇒ 422 “https only”; https://169.254.169.254/… ⇒ 422 “private address”. A name pointing at 127.0.0.1 is caught after resolving.', 'Bài 6.3: http://127.0.0.1:4000/health ⇒ 422 “https only”; https://169.254.169.254/… ⇒ 422 “private address”. Một tên trỏ về 127.0.0.1 bị bắt sau khi phân giải.'],
  kn: ['SSRF', 'OWASP API Top 10'],
  tns: [tn('DNS resolution', 'phân giải tên miền ra địa chỉ'), tn('allow-list', 'danh sách cho phép')],
  dau: `/** what safeFetch decides before fetching */
function urlVerdict(raw, resolve) {
  // Write your solution here
  if (raw.includes('localhost') || raw.includes('127.0.0.1')) return 'private address';
  return 'OK';
}
`,
  giai: '// Reference solution\n' + nguon(urlVerdict),
  cases: [
    { goi: goi('urlVerdict', 'http://127.0.0.1:4000/health', {}), moTa: ['Lesson 6.3, first URL', 'Bài 6.3, URL thứ nhất'] },
    { goi: goi('urlVerdict', 'https://169.254.169.254/latest/meta-data/', {}), moTa: ['Cloud metadata', 'Metadata của cloud'] },
    { goi: goi('urlVerdict', 'https://docs.vendor.example/manual.pdf', { 'docs.vendor.example': ['93.184.215.14'] }), moTa: ['A real manual', 'Một tài liệu thật'] },
    { goi: goi('urlVerdict', 'https://evil.example/x', { 'evil.example': ['93.184.215.14', '127.0.0.1'] }), an: true, moTa: ['One of the addresses is private', 'Một trong các địa chỉ là nội bộ'] },
    { goi: `['https://localtest.me/', 'https://[::1]/', 'HTTPS://10.0.0.5:8443/x'].map((u) => urlVerdict(u, { 'localtest.me': ['127.0.0.1'] }))`, an: true, moTa: ['A name pointing home, IPv6 loopback, upper-case scheme', 'Tên trỏ về máy mình, loopback IPv6, scheme chữ hoa'] },
    { goi: goi('urlVerdict', 'not a url', {}), an: true },
    { goi: goi('urlVerdict', 'https://nowhere.example/', {}), an: true },
    { goi: goi('urlVerdict', 'https://172.20.1.1/', {}), an: true },
  ],
});

export default doiDau({ slug: 'api-6-3-owasp-api', ten: '6.3 OWASP API Security Top 10', khoa: KHOA, baiHoc: 'api-6-3-owasp-api', de: [E1, E2, E3] });
