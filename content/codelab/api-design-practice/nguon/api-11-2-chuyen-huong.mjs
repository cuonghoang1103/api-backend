/** API Design · 11.3 — Rút gọn link (2): 301 hay 302, đường nóng, gộp lượt bấm (output thật bài 11.3: browser-redirect.mjs, bench-short.sh). */
import { doiDau, KHOA, cs, q, tn, jsBai, nguon, goi } from './_api.mjs';

const E1 = cs({
  ten: 'Redirects 1 — 301, 302 and the hot path, measured', kho: 'EASY', phut: 8,
  en: 'Facts from lesson 11.3: Chromium via Playwright clicking a short link, and autocannon on GET /{code} with three ways of counting clicks.',
  vi: 'Những điều từ bài 11.3: Chromium qua Playwright bấm một link rút gọn, và autocannon vào GET /{code} với ba cách đếm lượt bấm.',
  cau: [
    q('c1', ['Two browser profiles click a 301 link five times each. What did the server count?', 'Hai hồ sơ trình duyệt mỗi bên bấm link 301 năm lần. Server đếm được bao nhiêu?'],
      ['2 — one request per browser, the rest followed from the browser cache', '10 — every click is a new navigation and reaches the server', '1 — the second profile shared the first profile’s cache', '0 — Chromium resolves 301 links without asking the server'],
      ['RFC 9110 makes 301 heuristically cacheable; with 302 the server counted 10 of 10.', 'RFC 9110 cho 301 là heuristically cacheable; với 302 server đếm đủ 10/10.']),
    q('c2', ['The owner wants to change where an existing short link points. Which redirect status makes that possible?', 'Chủ link muốn đổi đích của một link đã có. Status chuyển hướng nào cho phép điều đó?'],
      ['302, because browsers ask the server again on every visit', '301, because it tells clients the URL is permanent', '308, because it keeps the method', 'Any status, if the server clears its own cache'],
      ['A browser that cached a 301 keeps going to the old target; the server never hears about it.', 'Trình duyệt đã cache 301 cứ đi tới đích cũ; server không hề biết.']),
    q('c3', ['One UPDATE per click on a single PostgreSQL row versus an XADD to a Redis Stream — what did four runs show?', 'Mỗi lượt bấm một UPDATE trên một dòng PostgreSQL so với XADD vào Redis Stream — bốn lần đo cho thấy gì?'],
      ['UPDATE cost 21–39% of the redirects per second, the stream 0–12%', 'Both cost nothing, because the database ran on the same laptop', 'The stream was slower, because each XADD waits for the worker', 'UPDATE lost about a third of the clicks under 50 connections'],
      ['The database still counted every click exactly; the price is throughput and one hot row.', 'CSDL vẫn đếm chính xác mọi lượt; cái giá là thông lượng và một dòng nóng.']),
    q('c4', ['The interviewer’s peak is 28 clicks per second. What is the honest scaling answer?', 'Đỉnh của đề là 28 lượt bấm mỗi giây. Câu trả lời trung thực về quy mô là gì?'],
      ['One process redirects thousands per second; keep writes off the hot path, no sharding needed', 'Shard the links table across ten nodes before launch', 'Put every redirect behind a 301 at the CDN to save the database', 'Move the redirect to WebSocket to keep connections open'],
      ['Measured 10,900–15,100 redirects/s on one process: the peak is ~0.2–0.3% of it.', 'Đo được 10.900–15.100 chuyển hướng/s trên một tiến trình: đỉnh chỉ ~0,2–0,3%.']),
  ],
  goiY: [['Which responses may a browser keep without being told?', 'Response nào trình duyệt được giữ mà không cần ai bảo?'], ['Compare the peak with what one process measured.', 'So đỉnh với số một tiến trình đo được.']],
  loi: [['Choosing 301 because the link “is permanent”.', 'Chọn 301 vì link “vĩnh viễn”.'], ['Sharding before measuring.', 'Shard trước khi đo.']],
  tns: [tn('heuristically cacheable', 'được cache theo suy đoán'), tn('hot row', 'dòng nóng'), tn('hot path', 'đường nóng')],
  kn: ['http', 'performance'],
});

function serverCounts(clicks, status, cacheControl) {
  const cc = (cacheControl || '').toLowerCase();
  const maxAge = /max-age=(\d+)/.exec(cc);
  const cacheable = !cc.includes('no-store') && !cc.includes('no-cache') &&
    ((status === 301 || status === 308) ? !(maxAge && Number(maxAge[1]) === 0) : !!(maxAge && Number(maxAge[1]) > 0));
  const seen = new Set();
  let server = 0;
  for (const who of clicks) {
    if (cacheable && seen.has(who)) continue;                       // followed from this browser's own cache
    seen.add(who);
    server++;
  }
  return { server, landing: clicks.length };
}
const E2 = jsBai({
  ten: 'Redirects 2 — Write serverCounts(clicks, status, cacheControl)', kho: 'MEDIUM', phut: 15,
  en: `<p>Model what lesson 11.3 measured. <code>clicks</code> is the sequence of browser profiles that clicked, e.g. <code>["A","A","B"]</code>. A redirect is <b>cacheable</b> when <code>cacheControl</code> (may be empty) contains neither <code>no-store</code> nor <code>no-cache</code>, and either the status is 301 or 308 without <code>max-age=0</code>, or the status is 302/307 with an explicit <code>max-age</code> greater than 0. A cacheable redirect reaches the server only on each profile’s first click; otherwise every click reaches it. Return <code>{ server, landing }</code> — landing is every click (the user always arrives). Ignore expiry.</p>`,
  vi: `<p>Mô phỏng điều bài 11.3 đã đo. <code>clicks</code> là dãy hồ sơ trình duyệt đã bấm, vd <code>["A","A","B"]</code>. Chuyển hướng <b>được cache</b> khi <code>cacheControl</code> (có thể rỗng) không chứa <code>no-store</code> lẫn <code>no-cache</code>, và hoặc status là 301/308 không có <code>max-age=0</code>, hoặc status là 302/307 có <code>max-age</code> rõ ràng lớn hơn 0. Chuyển hướng được cache chỉ tới server ở lượt bấm đầu của mỗi hồ sơ; ngược lại mọi lượt đều tới. Trả <code>{ server, landing }</code> — landing là mọi lượt bấm (người dùng luôn tới nơi). Bỏ qua chuyện hết hạn.</p>`,
  dauVao: ['clicks — string[]; status — 301 | 302 | 307 | 308; cacheControl — string', 'clicks — string[]; status — 301 | 302 | 307 | 308; cacheControl — chuỗi'],
  dauRa: ['{ server: number, landing: number }', '{ server: number, landing: number }'],
  goiY: [['Decide “cacheable” once, then walk the clicks with a Set of profiles.', 'Quyết “được cache” một lần, rồi duyệt các lượt bấm với một Set hồ sơ.'], ['Explicit headers beat the default of the status code.', 'Header rõ ràng thắng mặc định của status code.']],
  loi: [['Sharing one cache between profiles.', 'Dùng chung một cache cho mọi hồ sơ.'], ['Treating 302 as cacheable by default.', 'Coi 302 được cache mặc định.']],
  gt: ['Measured: 302 ⇒ server 5 then 10, landing 5 then 10; 301 ⇒ server 1 then 2, landing 5 then 10. A shortener that promises counts answers 302 — or adds no-store to whatever it answers.', 'Đo được: 302 ⇒ server 5 rồi 10, tới nơi 5 rồi 10; 301 ⇒ server 1 rồi 2, tới nơi 5 rồi 10. Dịch vụ hứa đếm lượt bấm thì trả 302 — hoặc thêm no-store vào bất cứ gì nó trả.'],
  kn: ['http', 'caching'],
  tns: [tn('Cache-Control', 'header điều khiển cache'), tn('browser profile', 'hồ sơ trình duyệt')],
  dau: `/** how many clicks reach the server? */
function serverCounts(clicks, status, cacheControl) {
  // Write your solution here
  if (status === 301) return { server: new Set(clicks).size, landing: clicks.length };
  return { server: clicks.length, landing: clicks.length };
}
`,
  giai: '// Reference solution\n' + nguon(serverCounts),
  cases: [
    { goi: goi('serverCounts', ['A', 'A', 'A', 'A', 'A', 'B', 'B', 'B', 'B', 'B'], 301, ''), moTa: ['The 301 run of lesson 11.3', 'Lần chạy 301 của bài 11.3'] },
    { goi: goi('serverCounts', ['A', 'A', 'A', 'A', 'A', 'B', 'B', 'B', 'B', 'B'], 302, ''), moTa: ['The 302 run', 'Lần chạy 302'] },
    { goi: goi('serverCounts', ['A', 'A', 'B'], 301, 'no-store'), an: true },
    { goi: goi('serverCounts', ['A', 'A', 'B', 'A'], 302, 'private, max-age=60'), an: true },
    { goi: goi('serverCounts', ['A', 'A'], 308, 'max-age=0'), an: true },
    { goi: goi('serverCounts', ['A', 'B', 'A', 'C', 'B'], 307, 'no-cache, max-age=600'), an: true },
    { goi: goi('serverCounts', [], 301, ''), an: true },
  ],
});

function perMinute(events) {
  const out = {};
  for (const e of events) {
    const minute = Math.floor(e.at / 60000) * 60000;
    const rows = (out[e.code] = out[e.code] || []);
    const last = rows.find((r) => r.minute === minute);
    if (last) last.count++; else rows.push({ minute, count: 1 });
  }
  for (const code of Object.keys(out)) out[code].sort((a, b) => a.minute - b.minute);
  return out;
}
const E3 = jsBai({
  ten: 'Redirects 3 — Write perMinute(events): the click worker', kho: 'HARD', phut: 15,
  en: `<p>The hot path only appends <code>{ code, at }</code> (at = epoch milliseconds) to a stream; a worker aggregates. Return an object mapping each code to an array of <code>{ minute, count }</code> sorted by <code>minute</code>, where <code>minute</code> is <code>at</code> rounded down to a whole minute (in milliseconds). Events may arrive out of order.</p>`,
  vi: `<p>Đường nóng chỉ thêm <code>{ code, at }</code> (at = mili-giây epoch) vào một stream; worker gộp lại. Trả object ánh xạ mỗi mã sang mảng <code>{ minute, count }</code> sắp theo <code>minute</code>, với <code>minute</code> là <code>at</code> làm tròn xuống phút chẵn (tính bằng mili-giây). Sự kiện có thể tới sai thứ tự.</p>`,
  dauVao: ['events — {code: string, at: number}[]', 'events — {code: string, at: number}[]'],
  dauRa: ['{ [code]: {minute: number, count: number}[] }', '{ [code]: {minute: number, count: number}[] }'],
  goiY: [['Math.floor(at / 60000) * 60000 gives the minute.', 'Math.floor(at / 60000) * 60000 cho ra phút.'], ['Group first, sort each code’s rows at the end.', 'Gộp trước, sắp từng mã ở cuối.']],
  loi: [['Assuming events arrive in time order.', 'Cho rằng sự kiện tới đúng thứ tự thời gian.'], ['Rounding to the nearest minute instead of down.', 'Làm tròn về phút gần nhất thay vì xuống.']],
  gt: ['This is the worker of 11.3: clicks leave the request in an XADD (no row lock), and the statistics endpoint reads these per-minute rows — counts lag by up to a minute, which the API says with asOf.', 'Đây là worker của bài 11.3: lượt bấm rời request bằng một XADD (không khoá dòng), endpoint thống kê đọc các dòng theo phút này — số đếm trễ tối đa một phút, API nói rõ bằng asOf.'],
  kn: ['async APIs', 'performance'],
  tns: [tn('aggregate', 'gộp số liệu'), tn('eventually consistent', 'nhất quán sau')],
  dau: `/** clicks per code per minute */
function perMinute(events) {
  // Write your solution here
  const out = {};
  for (const e of events) {
    out[e.code] = out[e.code] || [];
    out[e.code].push({ minute: Math.round(e.at / 60000) * 60000, count: 1 });
  }
  return out;
}
`,
  giai: '// Reference solution\n' + nguon(perMinute),
  cases: [
    { goi: goi('perMinute', [{ code: 'f-code-k20', at: 1793500000000 }, { code: 'f-code-k20', at: 1793500010000 }, { code: 'f-code-k20', at: 1793500070000 }]), moTa: ['Three clicks across two minutes', 'Ba lượt bấm qua hai phút'] },
    { goi: goi('perMinute', [{ code: 'a', at: 120001 }, { code: 'b', at: 59999 }, { code: 'a', at: 60000 }, { code: 'a', at: 179999 }]), an: true },
    { goi: goi('perMinute', []), an: true },
    { goi: goi('perMinute', [{ code: 'x', at: 30000 }, { code: 'x', at: 29999 }, { code: 'x', at: 1 }]), an: true },
  ],
});

export default doiDau({ slug: 'api-11-2-chuyen-huong', ten: '11.3 Interview: a URL shortener (2) — redirects and the hot path', khoa: KHOA, baiHoc: 'api-11-2-chuyen-huong', de: [E1, E2, E3] });
