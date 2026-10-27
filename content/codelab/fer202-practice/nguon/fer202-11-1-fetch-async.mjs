/**
 * FER202 · 11.1 — Promise, async/await và fetch (bài JS, máy chấm gọi hàm; fetch + hẹn giờ GIẢ, đồng hồ ảo).
 * Dễ → khó: Promise tự tạo + race (timeout) → getJSON kiểm res.ok → tuần tự có phụ thuộc → song song
 * Promise.all (đo bằng đồng hồ ảo) → thử lại có giới hạn + allSettled.
 */
import { doiDau, KHOA, jsNho } from './_chung.mjs';

const API = 'https://api.ctshop.dev';

export default doiDau({
  slug: 'fer202-11-1-fetch-async',
  ten: '11.1 Promise, async/await & fetch',
  khoa: KHOA,
  baiHoc: 'fer202-11-1-fetch-async',
  de: [
    jsNho({
      tieuDe: 'delay() and withTimeout() with Promises',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['new Promise', 'setTimeout', 'Promise.race'], the: ['async', 'promise'],
      moTa: {
        en: '<p>Two small utilities every app ends up writing. <code>delay(ms, value)</code> returns a Promise that resolves with <code>value</code> after <code>ms</code>. <code>withTimeout(promise, ms)</code> resolves like <code>promise</code>, but rejects with <code>Error("Timeout after 500ms")</code> if it takes longer than <code>ms</code>.</p>',
        vi: '<p>Hai tiện ích app nào rồi cũng viết. <code>delay(ms, value)</code> trả Promise resolve với <code>value</code> sau <code>ms</code>. <code>withTimeout(promise, ms)</code> kết thúc giống <code>promise</code>, nhưng reject với <code>Error("Timeout after 500ms")</code> nếu lâu hơn <code>ms</code>.</p>',
      },
      yeuCau: [
        { en: '<code>delay(300, "ok")</code> ⇒ "ok" after 300 ms (virtual clock).', vi: '<code>delay(300, "ok")</code> ⇒ "ok" sau 300 ms (đồng hồ ảo).' },
        { en: 'Use <code>Promise.race</code> for <code>withTimeout</code>; a rejection of the original promise passes through unchanged.', vi: 'Dùng <code>Promise.race</code> cho <code>withTimeout</code>; nếu promise gốc reject thì giữ nguyên lỗi đó.' },
      ],
      viDu: [{ input: 'withTimeout(delay(800, 1), 500)', output: 'Error: Timeout after 500ms', explanation: 'The timer promise wins the race.|||Promise hẹn giờ thắng cuộc đua.' }],
      goiY: ['const delay = (ms, value) => new Promise((resolve) => setTimeout(() => resolve(value), ms));', 'withTimeout: Promise.race([promise, new Promise((_, reject) => setTimeout(() => reject(new Error(´Timeout after @{ms}ms´)), ms))])'],
      loiHayGap: ['Gọi <code>resolve</code> ngay rồi mới setTimeout ⇒ không chờ gì cả.', 'Ném lỗi (throw) trong callback setTimeout ⇒ không reject được Promise, thành lỗi không bắt.'],
      thuatNgu: [{ en: 'settle', vi: 'Promise kết thúc: fulfilled hoặc rejected' }, { en: 'race', vi: 'lấy kết quả của Promise xong TRƯỚC' }],
      giaiThich: '<p>Promise có ba trạng thái: pending → fulfilled/rejected, và chỉ chuyển một lần. <code>Promise.race</code> settle theo Promise về trước — đúng hình dạng của một "hạn chót".</p>',
      dau: `// main.js — STARTER
function delay(ms, value) {
  setTimeout(() => {}, ms);
  return Promise.resolve(value);
}

function withTimeout(promise, ms) {
  return promise;
}
`,
      giai: `// main.js — Promise tự tạo + Promise.race làm hạn chót
function delay(ms, value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function withTimeout(promise, ms) {
  const timer = new Promise((_, reject) => {
    setTimeout(() => reject(new Error(´Timeout after @{ms}ms´)), ms);
  });
  return Promise.race([promise, timer]);
}
`,
      kiem: [
        { moTa: 'delay resolves with the value', goi: 'await delay(300, "ok")', mongDoi: 'ok' },
        { moTa: 'delay really waits', chuanBi: 'const t0 = Date.now(); await delay(300, 1);', goi: 'Date.now() - t0', mongDoi: 300 },
        { moTa: 'Fast promise passes', goi: 'await withTimeout(delay(100, "fast"), 500)', mongDoi: 'fast' },
        { moTa: 'Slow promise times out', goi: 'await withTimeout(delay(800, 1), 500)', mongDoi: { loi: 'Error', thongDiep: '^Timeout after 500ms$' } },
        { an: true, moTa: 'Original rejection passes through', goi: 'await withTimeout(Promise.reject(new TypeError("bad")), 500)', mongDoi: { loi: 'TypeError', thongDiep: '^bad$' } },
        { an: true, moTa: 'Timeout fires at the deadline', chuanBi: 'const t0 = Date.now(); try { await withTimeout(delay(5000, 1), 250); } catch (e) {}', goi: 'Date.now() - t0', mongDoi: 250 },
      ],
    }),
    jsNho({
      tieuDe: 'getJSON: fetch that respects HTTP errors',
      doKho: 'EASY', phut: 10,
      fetchGia: {
        [`${API}/products/1`]: { json: { id: 1, name: 'Keyboard', price: 590000 } },
        [`${API}/products/500`]: { status: 500, text: '<html>Internal Server Error</html>' },
      },
      khaiNiem: ['fetch', 'res.ok', 'res.status', 'async/await'], the: ['async', 'fetch'],
      moTa: {
        en: '<p><code>fetch</code> only rejects on network failure — a 404 or 500 still <b>resolves</b>. Write <code>async function getJSON(url)</code> that returns the parsed JSON for 2xx responses and throws <code>Error("HTTP 404")</code> (with the real status) otherwise, WITHOUT trying to parse the error body (it may be HTML).</p>',
        vi: '<p><code>fetch</code> chỉ reject khi lỗi mạng — 404 hay 500 vẫn <b>resolve</b>. Viết <code>async function getJSON(url)</code> trả JSON đã parse với phản hồi 2xx và ném <code>Error("HTTP 404")</code> (đúng mã thật) trong trường hợp khác, KHÔNG parse thân lỗi (có thể là HTML).</p>',
      },
      yeuCau: [
        { en: 'Check <code>res.ok</code> before <code>res.json()</code>.', vi: 'Kiểm <code>res.ok</code> trước <code>res.json()</code>.' },
        { en: 'Network errors (TypeError) propagate as they are.', vi: 'Lỗi mạng (TypeError) truyền ra nguyên vẹn.' },
      ],
      viDu: [{ input: 'getJSON(".../products/500")', output: 'Error: HTTP 500 (not SyntaxError)', explanation: 'Parsing an HTML error page as JSON would hide the real problem.|||Parse trang lỗi HTML như JSON sẽ che mất lỗi thật.' }],
      goiY: ['Bước 1: const res = await fetch(url); — res có status, ok, json().', 'Bước 2: if (!res.ok) throw new Error(´HTTP @{res.status}´); rồi mới return res.json();'],
      loiHayGap: ['Gọi <code>res.json()</code> trước khi kiểm ⇒ SyntaxError: Unexpected token &lt;.', 'Bọc try/catch rồi <code>return null</code> ⇒ nơi gọi không biết đã lỗi gì.'],
      thuatNgu: [{ en: 'status code', vi: 'mã trạng thái HTTP (200, 404, 500…)' }],
      giaiThich: '<p><code>res.ok</code> là true khi status 200–299. Mọi hàm gọi API nên đi qua một hàm như getJSON để xử lý lỗi HTTP ở MỘT chỗ.</p>',
      dau: `// main.js — STARTER
async function getJSON(url) {
  const res = await fetch(url);
  return res.json();
}
`,
      giai: `// main.js — kiểm res.ok trước khi parse; lỗi HTTP thành Error có mã
async function getJSON(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(´HTTP @{res.status}´);
  }
  return res.json();
}
`,
      kiem: [
        { moTa: '200 ⇒ JSON', goi: `await getJSON("${API}/products/1")`, mongDoi: { id: 1, name: 'Keyboard', price: 590000 } },
        { moTa: '404 ⇒ Error("HTTP 404")', goi: `await getJSON("${API}/products/999")`, mongDoi: { loi: 'Error', thongDiep: '^HTTP 404$' } },
        { moTa: '500 with HTML body ⇒ Error("HTTP 500")', goi: `await getJSON("${API}/products/500")`, mongDoi: { loi: 'Error', thongDiep: '^HTTP 500$' } },
        { an: true, moTa: 'Network error propagates', fetchGia: { [`${API}/down`]: { loiMang: true } }, goi: `await getJSON("${API}/down")`, mongDoi: { loi: 'TypeError' } },
        { an: true, moTa: 'Uses GET', chuanBi: `await getJSON("${API}/products/1");`, goi: '__fetchDaGoi.map((r) => r.method)', mongDoi: ['GET'] },
      ],
    }),
    jsNho({
      tieuDe: 'Sequential requests: user, then their orders',
      doKho: 'MEDIUM', phut: 12,
      fetchGia: {
        [`${API}/users?email=lan@fpt.edu.vn`]: { json: [{ id: 7, name: 'Lan', email: 'lan@fpt.edu.vn' }] },
        [`${API}/users?email=nobody@fpt.edu.vn`]: { json: [] },
        [`${API}/orders?userId=7`]: { json: [{ id: 101, total: 250000 }, { id: 102, total: 120000 }, { id: 103, total: 80000 }] },
      },
      khaiNiem: ['await in sequence', 'dependent requests', 'returning a summary'], the: ['async', 'fetch'],
      moTa: {
        en: '<p>Some requests depend on others: to load a customer\'s orders you first need their id. Write <code>async function getOrderSummary(email)</code>: find the user by email (<code>GET /users?email=</code>), then load <code>GET /orders?userId=&lt;id&gt;</code> and return <code>{ name, orderCount, totalSpent }</code>. Unknown email ⇒ throw <code>Error("User not found")</code> and do NOT request orders.</p>',
        vi: '<p>Có request phụ thuộc request khác: muốn tải đơn hàng của khách phải biết id trước. Viết <code>async function getOrderSummary(email)</code>: tìm user theo email (<code>GET /users?email=</code>), rồi tải <code>GET /orders?userId=&lt;id&gt;</code> và trả <code>{ name, orderCount, totalSpent }</code>. Email không có ⇒ ném <code>Error("User not found")</code> và KHÔNG gọi đơn hàng.</p>',
      },
      yeuCau: [
        { en: 'Base URL <code>https://api.ctshop.dev</code>. Use a small <code>getJSON</code> helper with an <code>res.ok</code> check.', vi: 'Địa chỉ gốc <code>https://api.ctshop.dev</code>. Dùng hàm phụ <code>getJSON</code> có kiểm <code>res.ok</code>.' },
        { en: '<code>totalSpent</code> = sum of <code>total</code>.', vi: '<code>totalSpent</code> = tổng các <code>total</code>.' },
      ],
      viDu: [{ input: 'getOrderSummary("lan@fpt.edu.vn")', output: '{ name: "Lan", orderCount: 3, totalSpent: 450000 }', explanation: 'Two awaits in a row — the second needs the first result.|||Hai lần await nối tiếp — lần sau cần kết quả lần trước.' }],
      goiY: ['const [user] = await getJSON(´@{API}/users?email=@{email}´); if (!user) throw new Error("User not found");', 'Rồi: const orders = await getJSON(´@{API}/orders?userId=@{user.id}´); totalSpent = orders.reduce((s, o) => s + o.total, 0).'],
      loiHayGap: ['Quên <code>await</code> ⇒ <code>user</code> là Promise, <code>user.id</code> undefined.', 'Dùng <code>.forEach(async …)</code> để cộng ⇒ forEach không chờ async.'],
      thuatNgu: [{ en: 'dependent request', vi: 'request cần kết quả của request trước' }],
      giaiThich: '<p>async/await giúp code bất đồng bộ đọc như tuần tự. Khi request B cần dữ liệu của A thì chờ tuần tự là đúng; khi KHÔNG phụ thuộc thì nên chạy song song (bài sau).</p>',
      dau: `// main.js — STARTER
const API = 'https://api.ctshop.dev';

async function getOrderSummary(email) {
  const users = fetch(API + '/users?email=' + email).then((r) => r.json());
  const orders = await fetch(API + '/orders?userId=' + users.id).then((r) => r.json());
  return { name: users.name, orderCount: orders.length, totalSpent: 0 };
}
`,
      giai: `// main.js — hai request tuần tự (request sau cần id của request trước)
const API = 'https://api.ctshop.dev';

async function getJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(´HTTP @{res.status}´);
  return res.json();
}

async function getOrderSummary(email) {
  const users = await getJSON(´@{API}/users?email=@{email}´);
  const user = users[0];
  if (!user) throw new Error('User not found');
  const orders = await getJSON(´@{API}/orders?userId=@{user.id}´);
  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
  return { name: user.name, orderCount: orders.length, totalSpent };
}
`,
      kiem: [
        { moTa: 'Summary for Lan', goi: 'await getOrderSummary("lan@fpt.edu.vn")', mongDoi: { name: 'Lan', orderCount: 3, totalSpent: 450000 } },
        { moTa: 'Requests in the right order', chuanBi: 'await getOrderSummary("lan@fpt.edu.vn");', goi: '__fetchDaGoi.map((r) => r.url.replace("https://api.ctshop.dev", ""))', mongDoi: ['/users?email=lan@fpt.edu.vn', '/orders?userId=7'] },
        { moTa: 'Unknown email ⇒ Error', goi: 'await getOrderSummary("nobody@fpt.edu.vn")', mongDoi: { loi: 'Error', thongDiep: '^User not found$' } },
        { an: true, moTa: 'No orders request for an unknown user', chuanBi: 'try { await getOrderSummary("nobody@fpt.edu.vn"); } catch (e) {}', goi: '__fetchDaGoi.length', mongDoi: 1 },
        { an: true, moTa: 'HTTP error propagates', fetchGia: { [`${API}/users?email=x@fpt.edu.vn`]: { status: 503, text: 'down' } }, goi: 'await getOrderSummary("x@fpt.edu.vn")', mongDoi: { loi: 'Error', thongDiep: '^HTTP 503$' } },
      ],
    }),
    jsNho({
      tieuDe: 'Parallel requests with Promise.all',
      doKho: 'MEDIUM', phut: 12,
      fetchGia: {
        [`${API}/stats`]: { json: { visitors: 1200, orders: 37 }, treMs: 300 },
        [`${API}/news`]: { json: [{ id: 1, title: 'Sale 11.11' }, { id: 2, title: 'New arrivals' }], treMs: 300 },
        [`${API}/me`]: { json: { name: 'Admin' }, treMs: 300 },
      },
      khaiNiem: ['Promise.all', 'concurrency', 'destructuring results'], the: ['async', 'promise'],
      moTa: {
        en: '<p>A dashboard needs three INDEPENDENT resources: <code>/stats</code>, <code>/news</code> and <code>/me</code>, each taking 300 ms. Awaiting them one by one takes 900 ms; starting them together with <code>Promise.all</code> takes ~300 ms. Write <code>loadDashboard()</code> returning <code>{ user, visitors, headlines }</code>.</p>',
        vi: '<p>Dashboard cần ba tài nguyên ĐỘC LẬP: <code>/stats</code>, <code>/news</code> và <code>/me</code>, mỗi cái mất 300 ms. Await lần lượt mất 900 ms; khởi chạy cùng lúc bằng <code>Promise.all</code> chỉ ~300 ms. Viết <code>loadDashboard()</code> trả <code>{ user, visitors, headlines }</code>.</p>',
      },
      yeuCau: [
        { en: '<code>user</code> = name from <code>/me</code>, <code>visitors</code> from <code>/stats</code>, <code>headlines</code> = array of news titles.', vi: '<code>user</code> = name từ <code>/me</code>, <code>visitors</code> từ <code>/stats</code>, <code>headlines</code> = mảng tiêu đề tin.' },
        { en: 'Must finish in at most 350 ms on the virtual clock. If any request fails, the whole call rejects.', vi: 'Phải xong trong tối đa 350 ms theo đồng hồ ảo. Một request lỗi thì cả lời gọi reject.' },
      ],
      viDu: [{ input: 'loadDashboard()', output: '{ user: "Admin", visitors: 1200, headlines: ["Sale 11.11", "New arrivals"] }', explanation: 'const [stats, news, me] = await Promise.all([...])|||const [stats, news, me] = await Promise.all([...])' }],
      goiY: ['const [stats, news, me] = await Promise.all([getJSON(´@{API}/stats´), getJSON(´@{API}/news´), getJSON(´@{API}/me´)]);', 'Promise.all giữ ĐÚNG thứ tự mảng đầu vào, bất kể cái nào về trước.'],
      loiHayGap: ['Ba lần <code>await</code> nối tiếp cho ba request độc lập ⇒ chậm gấp ba.', 'Dùng <code>Promise.all</code> nhưng truyền vào hàm thay vì Promise (quên gọi) ⇒ nhận lại chính các hàm.'],
      thuatNgu: [{ en: 'concurrent', vi: 'chạy đồng thời' }, { en: 'fail-fast', vi: 'một cái lỗi là dừng cả nhóm' }],
      giaiThich: '<p>Request bắt đầu ngay khi gọi <code>fetch</code>; <code>Promise.all</code> chỉ chờ tất cả xong. Tổng thời gian ≈ request chậm nhất, không phải tổng.</p>',
      dau: `// main.js — STARTER
const API = 'https://api.ctshop.dev';

async function getJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return res.json();
}

async function loadDashboard() {
  const stats = await getJSON(API + '/stats');
  const news = await getJSON(API + '/news');
  const me = await getJSON(API + '/me');
  return { user: me.name, visitors: stats.visitors, headlines: news.map((n) => n.title) };
}
`,
      giai: `// main.js — ba request độc lập chạy SONG SONG bằng Promise.all
const API = 'https://api.ctshop.dev';

async function getJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(´HTTP @{res.status}´);
  return res.json();
}

async function loadDashboard() {
  const [stats, news, me] = await Promise.all([
    getJSON(´@{API}/stats´),
    getJSON(´@{API}/news´),
    getJSON(´@{API}/me´),
  ]);
  return { user: me.name, visitors: stats.visitors, headlines: news.map((n) => n.title) };
}
`,
      kiem: [
        { moTa: 'Correct summary', goi: 'await loadDashboard()', mongDoi: { user: 'Admin', visitors: 1200, headlines: ['Sale 11.11', 'New arrivals'] } },
        { moTa: 'Runs in parallel (≤ 350 ms)', chuanBi: 'const t0 = Date.now(); await loadDashboard();', goi: 'Date.now() - t0 <= 350', mongDoi: true },
        { moTa: 'Three requests', chuanBi: 'await loadDashboard();', goi: '__fetchDaGoi.length', mongDoi: 3 },
        { an: true, moTa: 'One failure rejects everything', fetchGia: { [`${API}/news`]: { status: 500, text: 'x' } }, goi: 'await loadDashboard()', mongDoi: { loi: 'Error', thongDiep: '^HTTP 500$' } },
      ],
    }),
    jsNho({
      tieuDe: 'Retry with back-off, and allSettled for partial results',
      doKho: 'HARD', phut: 18,
      khaiNiem: ['retry loop', 'transient vs permanent errors', 'Promise.allSettled'], the: ['async', 'promise', 'fetch'],
      moTa: {
        en: '<p>Networks are flaky. Write <code>fetchWithRetry(url, { retries = 2, delayMs = 100 } = {})</code>: on a network error or a <b>5xx</b> status, wait <code>delayMs × attempt</code> and try again (at most <code>retries</code> extra attempts). <b>4xx</b> errors are permanent — fail immediately. Then write <code>loadWidgets(urls)</code> using <code>Promise.allSettled</code> so one broken widget does not kill the page.</p>',
        vi: '<p>Mạng chập chờn. Viết <code>fetchWithRetry(url, { retries = 2, delayMs = 100 } = {})</code>: gặp lỗi mạng hoặc mã <b>5xx</b> thì đợi <code>delayMs × lần</code> rồi thử lại (tối đa <code>retries</code> lần thêm). Lỗi <b>4xx</b> là vĩnh viễn — thất bại ngay. Sau đó viết <code>loadWidgets(urls)</code> dùng <code>Promise.allSettled</code> để một widget hỏng không làm sập cả trang.</p>',
      },
      yeuCau: [
        { en: '<code>fetchWithRetry</code> returns parsed JSON; final failure throws <code>Error("HTTP 503")</code> (last status) or the last network <code>TypeError</code>.', vi: '<code>fetchWithRetry</code> trả JSON đã parse; thất bại cuối cùng ném <code>Error("HTTP 503")</code> (mã cuối) hoặc <code>TypeError</code> lỗi mạng cuối.' },
        { en: '<code>loadWidgets(urls)</code> ⇒ <code>{ data: [...successful JSON in order], failed: number }</code> (each widget via <code>fetchWithRetry</code> with <code>retries: 0</code>).', vi: '<code>loadWidgets(urls)</code> ⇒ <code>{ data: [...JSON thành công theo thứ tự], failed: số lỗi }</code> (mỗi widget gọi <code>fetchWithRetry</code> với <code>retries: 0</code>).' },
      ],
      viDu: [{ input: '/flaky answers 503, 503, then 200', output: 'JSON after 3 attempts, waited 100 + 200 ms', explanation: 'Linear back-off: delayMs × attempt.|||Giãn cách tuyến tính: delayMs × lần thử.' }],
      goiY: ['for (let attempt = 0; ; attempt++) { try { const res = await fetch(url); if (res.ok) return res.json(); if (res.status < 500 || attempt >= retries) throw new Error(´HTTP @{res.status}´); } catch (e) { … } await new Promise(r => setTimeout(r, delayMs * (attempt + 1))); }', 'Phân biệt lỗi do mình ném (4xx — không thử lại) với lỗi mạng: đánh dấu bằng một cờ hoặc kiểm e instanceof TypeError.', 'allSettled ⇒ [{ status: "fulfilled", value } | { status: "rejected", reason }]'],
      loiHayGap: ['Thử lại cả lỗi 404 ⇒ tốn request vô ích, lỗi vẫn là 404.', 'Vòng lặp thử lại không có giới hạn ⇒ treo mãi khi server chết.'],
      thuatNgu: [{ en: 'transient error', vi: 'lỗi tạm thời, thử lại có thể thành công' }, { en: 'back-off', vi: 'đợi lâu dần giữa các lần thử' }],
      giaiThich: '<p>Chỉ thử lại lỗi có thể tự hết (mạng, 5xx). <code>Promise.all</code> thất bại ngay khi một cái lỗi; <code>Promise.allSettled</code> chờ tất cả và cho biết từng kết quả — hợp với trang gồm nhiều widget độc lập.</p>',
      dau: `// main.js — STARTER
async function fetchWithRetry(url, { retries = 2, delayMs = 100 } = {}) {
  const res = await fetch(url);
  return res.json();
}

async function loadWidgets(urls) {
  const data = await Promise.all(urls.map((u) => fetchWithRetry(u, { retries: 0 })));
  return { data, failed: 0 };
}
`,
      giai: `// main.js — thử lại lỗi tạm thời (mạng, 5xx), không thử lại 4xx; allSettled cho kết quả từng phần
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithRetry(url, { retries = 2, delayMs = 100 } = {}) {
  for (let attempt = 0; ; attempt += 1) {
    let res;
    try {
      res = await fetch(url);
    } catch (networkError) {
      if (attempt >= retries) throw networkError; // hết lượt thử
      await wait(delayMs * (attempt + 1));
      continue;
    }
    if (res.ok) return res.json();
    const error = new Error(´HTTP @{res.status}´);
    if (res.status < 500 || attempt >= retries) throw error; // 4xx: lỗi vĩnh viễn ⇒ dừng ngay
    await wait(delayMs * (attempt + 1)); // 5xx: đợi lâu dần rồi thử lại
  }
}

async function loadWidgets(urls) {
  const results = await Promise.allSettled(urls.map((u) => fetchWithRetry(u, { retries: 0 })));
  return {
    data: results.filter((r) => r.status === 'fulfilled').map((r) => r.value),
    failed: results.filter((r) => r.status === 'rejected').length,
  };
}
`,
      kiem: [
        { moTa: 'Succeeds after two 503s', fetchGia: { [`${API}/flaky`]: [{ status: 503, text: 'busy' }, { status: 503, text: 'busy' }, { json: { ok: true } }] }, goi: `await fetchWithRetry("${API}/flaky")`, mongDoi: { ok: true } },
        { moTa: 'Back-off timing 100 + 200 ms', fetchGia: { [`${API}/flaky`]: [{ status: 503, text: 'b', treMs: 0 }, { status: 503, text: 'b', treMs: 0 }, { json: { ok: true }, treMs: 0 }] }, chuanBi: `const t0 = Date.now(); await fetchWithRetry("${API}/flaky");`, goi: 'Date.now() - t0', mongDoi: 300 },
        { moTa: 'Gives up after retries', fetchGia: { [`${API}/dead`]: { status: 503, text: 'down' } }, goi: `await fetchWithRetry("${API}/dead", { retries: 1, delayMs: 10 })`, mongDoi: { loi: 'Error', thongDiep: '^HTTP 503$' } },
        { moTa: '404 is not retried', fetchGia: { [`${API}/missing`]: { status: 404, text: 'no' } }, chuanBi: `try { await fetchWithRetry("${API}/missing"); } catch (e) {}`, goi: '__fetchDaGoi.length', mongDoi: 1 },
        { an: true, moTa: 'Network errors are retried', fetchGia: { [`${API}/net`]: [{ loiMang: true }, { json: [1, 2] }] }, goi: `await fetchWithRetry("${API}/net", { delayMs: 5 })`, mongDoi: [1, 2] },
        { an: true, moTa: 'Last network error is thrown', fetchGia: { [`${API}/net2`]: { loiMang: true } }, goi: `await fetchWithRetry("${API}/net2", { retries: 1, delayMs: 5 })`, mongDoi: { loi: 'TypeError' } },
        { an: true, moTa: 'allSettled keeps partial results', fetchGia: { [`${API}/w1`]: { json: { id: 1 } }, [`${API}/w2`]: { status: 500, text: 'x' }, [`${API}/w3`]: { json: { id: 3 } } }, goi: `await loadWidgets(["${API}/w1", "${API}/w2", "${API}/w3"])`, mongDoi: { data: [{ id: 1 }, { id: 3 }], failed: 1 } },
        { an: true, moTa: '404 error message', fetchGia: { [`${API}/missing`]: { status: 404, text: 'no' } }, goi: `await fetchWithRetry("${API}/missing")`, mongDoi: { loi: 'Error', thongDiep: '^HTTP 404$' } },
      ],
    }),
  ],
});
