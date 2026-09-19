/**
 * Web Foundations · Deck wf-js2 — Chương 5: JavaScript bất đồng bộ.
 * Dựng: node scripts/_render-slides.mjs --deck scripts/slides-src/wf-js2.mjs --out /tmp/wf-js2
 */
import hljs from 'highlight.js';

const CSS = `<style>
.vs{background:#1e1e1e;border-radius:10px;padding:14px 16px;font-family:"SF Mono",Menlo,Consolas,monospace;
  font-size:18px;line-height:1.5;color:#d4d4d4;text-align:left;overflow:hidden}
.vs.sm{font-size:16px;line-height:1.45;padding:12px 14px}
.vs .hljs-keyword{color:#569cd6}.vs .hljs-string{color:#ce9178}.vs .hljs-number{color:#b5cea8}
.vs .hljs-comment{color:#6a9955;font-style:italic}.vs .hljs-title{color:#dcdcaa}
.vs .hljs-built_in{color:#4ec9b0}.vs .hljs-literal{color:#569cd6}.vs .hljs-regexp{color:#d16969}
.vs .hljs-variable,.vs .hljs-property,.vs .hljs-attr,.vs .hljs-params{color:#9cdcfe}
.vs .hljs-subst{color:#d4d4d4}.vs .hljs-tag{color:#569cd6}.vs .hljs-name{color:#4ec9b0}
.fer{display:inline-block;background:#1b5fa8;color:#fff;font-size:15px;font-weight:800;
  padding:3px 10px;border-radius:20px;letter-spacing:.4px;vertical-align:middle;margin-left:8px}
.fer.hot{background:#c2410c}
.ghi{font-size:19px;color:#5d7288;margin-top:6px}
</style>`;

const code = (src, lang = 'javascript', cls = '') =>
  `${CSS}<pre class="vs ${cls}"><code>${hljs.highlight(src, { language: lang }).value}</code></pre>`;

const F = (t = 'FER202') => `<span class="fer">⭐ ${t}</span>`;
const FH = (t = 'FER202') => `<span class="fer hot">⭐⭐ ${t}</span>`;

export const deck = {
  key: 'wf-js2',
  code: 'WF · CH5',
  title: 'JavaScript bất đồng bộ',
  sub: 'Nền tảng Lập trình Web · Chương 5',
};

export const slides = [
  { kind: 'cover', t: 'Chương 5 — JavaScript bất đồng bộ',
    sub: 'Event loop · Promise · async/await · fetch · ES Modules',
    body: `<p class="cov-meta">Nền tảng Lập trình Web · cuongthai.com<br/>Chương quyết định việc bạn có gọi được API trong <b>FER202</b> hay không</p>` },

  { t: 'Nội dung chương', body: `
    <ol class="toc">
      <li>Vì sao cần bất đồng bộ — JavaScript chỉ có <b>một luồng</b></li>
      <li>Call stack và <b>event loop</b></li>
      <li>Callback và "callback hell"</li>
      <li><b>Promise</b>: ba trạng thái, <code>.then / .catch</code></li>
      <li><b>async / await</b> ⭐ và <code>try / catch</code></li>
      <li><b>fetch</b> — gọi API thật ⭐⭐</li>
      <li><b>ES Modules</b>: <code>export</code> / <code>import</code> ⭐</li>
    </ol>` },

  { t: 'JavaScript chỉ có MỘT luồng', body: `
    <p class="lead2">Một việc tại một thời điểm. Nếu một việc chạy lâu, <b>cả trang đứng hình</b> — không bấm được, không cuộn được.</p>
    ${code(`// Thử trong Console — trang sẽ ĐỨNG khoảng 3 giây
const het = Date.now() + 3000;
while (Date.now() < het) {}      // chặn luồng
console.log('xong');`)}
    <div class="box warn">Một lời gọi mạng mất 200ms–2s. Nếu chờ theo kiểu chặn như trên, mỗi lần tải dữ liệu là người dùng ngồi nhìn trang treo. Bất đồng bộ sinh ra để giải đúng chuyện này.</div>` },

  { t: 'Event loop — ai chạy trước, ai chạy sau', body: `
    <div class="dg">
      <div class="bx">Call stack<br/><small>việc đang chạy</small></div>
      <div class="ar">→<small>hẹn giờ / mạng</small></div>
      <div class="bx ext">Web APIs<br/><small>trình duyệt lo</small></div>
      <div class="ar">→<small>xong thì xếp hàng</small></div>
      <div class="bx st">Hàng đợi</div>
    </div>
    ${code(`console.log('1');
setTimeout(() => console.log('2'), 0);   // 0ms nhưng vẫn phải XẾP HÀNG
Promise.resolve().then(() => console.log('3'));
console.log('4');

// In ra: 1 → 4 → 3 → 2`, 'javascript', 'sm')}
    <div class="box">Thứ tự: mã đồng bộ chạy hết trước → rồi tới <b>microtask</b> (Promise) → cuối cùng mới tới <b>macrotask</b> (setTimeout). Nhớ được thứ tự này là hiểu được 90% câu hỏi phỏng vấn về event loop.</div>` },

  { t: 'Callback — cách cũ, và vì sao nó khổ', body: `
    ${code(`layUser(1, function (user) {
  layDonHang(user.id, function (don) {
    layChiTiet(don[0].id, function (ct) {
      console.log(ct);          // lồng ba tầng — "callback hell"
    }, loi);
  }, loi);
}, loi);`)}
    <div class="box warn">Ba vấn đề: thụt lề trôi sang phải mãi · xử lý lỗi phải lặp ở từng tầng · không cách nào <code>return</code> ra ngoài. Promise sinh ra để chữa đúng ba thứ này.</div>` },

  { t: 'Promise — lời hứa có ba trạng thái', body: `
    <div class="grid3">
      <div class="card"><b>pending</b><p>Đang chờ — chưa biết kết quả</p></div>
      <div class="card"><b>fulfilled</b><p>Xong, có giá trị</p></div>
      <div class="card"><b>rejected</b><p>Hỏng, có lý do</p></div>
    </div>
    ${code(`const p = new Promise((resolve, reject) => {
  setTimeout(() => resolve('xong rồi'), 1000);
});

p.then(kq  => console.log(kq))      // chạy khi fulfilled
 .catch(e  => console.error(e))     // chạy khi rejected
 .finally(() => console.log('dọn')); // chạy dù thế nào`, 'javascript', 'sm')}
    <div class="box">Một Promise chỉ đổi trạng thái <b>một lần duy nhất</b>. Đã resolve rồi thì gọi reject sau đó không có tác dụng.</div>` },

  { t: `async / await — viết bất đồng bộ như đồng bộ ${F()}`, body: `
    ${code(`// Cách cũ với .then
function layDL() {
  return fetch('/api/pizzas')
    .then(res => res.json())
    .then(data => console.log(data));
}

// Cách mới — đọc từ trên xuống như mã thường
async function layDL() {
  const res  = await fetch('/api/pizzas');
  const data = await res.json();
  console.log(data);
}`)}
    <div class="box ok"><b>async</b> đặt trước hàm ⇒ hàm luôn trả về Promise. <b>await</b> chỉ dùng được BÊN TRONG hàm async, nó "dừng lại chờ" mà không chặn cả trang.</div>` },

  { t: 'Bắt lỗi: try / catch quanh await', body: `
    ${code(`async function layPizza() {
  try {
    const res = await fetch('/api/pizzas');

    // ⚠️ BẪY: fetch KHÔNG ném lỗi khi máy chủ trả 404 hay 500.
    // Nó chỉ ném khi mất mạng. Phải TỰ kiểm tra res.ok.
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);

    return await res.json();
  } catch (e) {
    console.error('Lỗi tải:', e.message);
    return [];                  // trả mặc định để giao diện không vỡ
  } finally {
    setDangTai(false);          // dù thành công hay hỏng cũng tắt spinner
  }
}`, 'javascript', 'sm')}
    <div class="box warn">Quên <code>if (!res.ok)</code> là lỗi phổ biến nhất khi mới gọi API: máy chủ trả 404 kèm trang HTML, <code>res.json()</code> ném lỗi cú pháp, và bạn đi tìm nhầm chỗ.</div>` },

  { t: `fetch — gọi API thật ${FH()}`, body: `
    ${code(`// GET — lấy dữ liệu
const res  = await fetch('https://api.example.com/pizzas');
const data = await res.json();

// POST — gửi dữ liệu lên
const res2 = await fetch('/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ pizzaId: 3, soLuong: 2 }),
});`)}
    <div class="two">
      <div class="card"><b>res.status</b><p>200 OK · 401 chưa đăng nhập · 404 không có · 500 lỗi máy chủ</p></div>
      <div class="card"><b>res.json()</b><p>Cũng là Promise — phải <code>await</code> lần nữa</p></div>
    </div>` },

  { t: 'Chạy song song: Promise.all', body: `
    ${code(`// ❌ Tuần tự — mất 3 giây nếu mỗi cái 1 giây
const a = await layA();
const b = await layB();
const c = await layC();

// ✅ Song song — mất khoảng 1 giây
const [a, b, c] = await Promise.all([layA(), layB(), layC()]);

// Một cái hỏng KHÔNG làm chết cả nhóm:
const kq = await Promise.allSettled([layA(), layB()]);`)}
    <div class="box">Dùng <code>Promise.all</code> khi các lời gọi <b>độc lập</b> nhau. Nếu cái sau cần kết quả cái trước thì buộc phải tuần tự.</div>` },

  { t: `ES Modules — tách mã ra nhiều file ${F()}`, body: `
    ${code(`// pizzas.js — XUẤT ra
export const pizzas = [...];              // named export
export function tinhTien(gio) { ... }     // named export
export default function Menu() { ... }    // default export — MỖI FILE MỘT CÁI`, 'javascript', 'sm')}
    ${code(`// App.js — NHẬP vào
import Menu from './Menu';                   // default: đặt tên tuỳ ý
import { pizzas, tinhTien } from './pizzas'; // named: PHẢI đúng tên
import Menu, { pizzas } from './Menu';       // lấy cả hai kiểu`, 'javascript', 'sm')}
    <div class="box warn">Lỗi hay gặp: <code>import { Menu }</code> trong khi file dùng <code>export default</code> ⇒ nhận <code>undefined</code>, React báo "Element type is invalid". Ngoặc nhọn hay không là khác nhau.</div>` },

  { t: 'Bốn bẫy bất đồng bộ hay gặp', body: `
    ${code(`// 1. Quên await → nhận Promise chứ không phải dữ liệu
const data = fetch(url);        // Promise { <pending> }

// 2. await trong forEach → KHÔNG chờ gì cả
arr.forEach(async x => { await luu(x); });   // sai
for (const x of arr) { await luu(x); }       // đúng

// 3. Quên res.ok → 404 vẫn đi tiếp như thành công

// 4. Không tắt trạng thái tải khi lỗi → spinner quay mãi
//    → đặt setDangTai(false) trong finally`, 'javascript', 'sm')}` },

  { t: 'Chương này gặp lại ở FER202 chỗ nào', body: `
    <table class="t big2">
      <tr><th>Kiến thức chương 5</th><th>Dùng ở FER202</th></tr>
      <tr><td><code>async / await</code></td><td>Hàm tải dữ liệu trong component</td></tr>
      <tr><td><code>fetch</code> / axios</td><td>Chương 11 — giao tiếp client–server</td></tr>
      <tr><td><code>try / catch / finally</code></td><td>Hiện thông báo lỗi, tắt spinner</td></tr>
      <tr><td><code>res.ok</code>, mã trạng thái</td><td>Phân biệt 401 chưa đăng nhập với 500 lỗi máy chủ</td></tr>
      <tr><td><code>Promise.all</code></td><td>Tải nhiều thứ cùng lúc khi mở trang</td></tr>
      <tr><td><code>export / import</code></td><td>Mỗi component một file — dùng ở MỌI bài</td></tr>
      <tr><td>Event loop</td><td>Hiểu vì sao state không đổi ngay sau <code>setState</code></td></tr>
    </table>` },

  { t: 'Tự luyện', body: `
    ${code(`// API công khai, không cần khoá — mở Console và làm thử

// 1. Lấy 5 bài viết đầu tiên, in ra tiêu đề của từng bài
//    https://jsonplaceholder.typicode.com/posts

// 2. Bọc lời gọi trên trong try/catch, kiểm tra res.ok

// 3. Lấy SONG SONG cả posts và users bằng Promise.all,
//    rồi in ra "tên tác giả — tiêu đề" cho 5 bài đầu

// 4. Cố ý gọi sai URL (thêm chữ 'x') và xem lỗi trông thế nào`, 'javascript', 'sm')}
    <div class="box ok">Bài 3 chính là thứ bạn sẽ làm ở FER202 khi ghép dữ liệu từ hai endpoint. Làm được nó là qua được phần khó nhất của chương 11.</div>` },

  { t: 'Học thêm ở đâu', body: `
    <table class="t">
      <tr><th>Nguồn</th><th>Dùng khi</th></tr>
      <tr><td><b>javascript.info</b> → Promises, async/await</td><td>Học có thứ tự, nhiều bài tập</td></tr>
      <tr><td><b>MDN</b> → Using the Fetch API</td><td>Tra cú pháp chính xác của fetch</td></tr>
      <tr><td><b>latentflip.com/loupe</b></td><td>Xem event loop chạy bằng hoạt hình — rất đáng thử</td></tr>
      <tr><td><b>jsonplaceholder.typicode.com</b></td><td>API giả miễn phí để luyện fetch</td></tr>
    </table>
    <div class="box">Chương 5 là chương khó nhất của khoá nền tảng. Đừng cố hiểu hết trong một buổi — làm xong phần Tự luyện rồi quay lại đọc lần hai.</div>` },
];
