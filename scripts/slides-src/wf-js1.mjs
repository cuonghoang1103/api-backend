/**
 * Web Foundations · Deck wf-js1 — Chương 4: JavaScript nền tảng.
 * Dựng bằng: node scripts/_render-slides.mjs --deck scripts/slides-src/wf-js1.mjs --out /tmp/wf-js1
 *
 * Mã nguồn tô màu bằng highlight.js, bảng màu VS Code Dark+ (xem CSS bên dưới).
 * Nhãn ⭐ FER202 đánh dấu kiến thức sẽ gặp lại ở môn FER202.
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
  key: 'wf-js1',
  code: 'WF · CH4',
  title: 'JavaScript nền tảng',
  sub: 'Nền tảng Lập trình Web · Chương 4',
};

export const slides = [
  { kind: 'cover', t: 'Chương 4 — JavaScript nền tảng',
    sub: 'Biến · Kiểu dữ liệu · Điều kiện · Vòng lặp · Hàm · Mảng · Object · DOM',
    body: `<p class="cov-meta">Nền tảng Lập trình Web · cuongthai.com<br/>Chương này là nền trực tiếp cho môn <b>FER202 — React</b></p>` },

  { t: 'Nội dung chương', body: `
    <ol class="toc">
      <li>Biến: <b>const</b>, <b>let</b> — và vì sao tránh <b>var</b></li>
      <li>Kiểu dữ liệu · <b>typeof</b> · chuỗi và template literal</li>
      <li>So sánh: bẫy <b>==</b> và cách dùng <b>===</b></li>
      <li>Điều kiện và vòng lặp</li>
      <li>Hàm · <b>arrow function</b> ⭐</li>
      <li>Mảng và các method: <b>map / filter / find / reduce</b> ⭐⭐</li>
      <li>Object · destructuring · spread ⭐</li>
      <li>DOM và sự kiện</li>
    </ol>
    <p class="ghi">Nhãn ⭐ = kiến thức bạn sẽ gặp lại ngay ở môn FER202.</p>` },

  { t: 'JavaScript chạy ở đâu?', body: `
    <p class="lead2">Cùng một ngôn ngữ, <b>hai nơi chạy</b> — hiểu chỗ này thì mọi thứ về sau đỡ rối.</p>
    <div class="two">
      <div class="card"><b>Trong trình duyệt</b><p>Chrome, Firefox… Điều khiển trang web: đổi chữ, bắt cú bấm, gọi API. Đây là chỗ React sống.</p></div>
      <div class="card"><b>Trên máy tính (Node.js)</b><p>Chạy ngoài trình duyệt, trong terminal. Nhờ nó mà có <code>npm</code>, có công cụ dựng React.</p></div>
    </div>
    <div class="box ok">Thử ngay: mở trình duyệt → <b>F12</b> → tab <b>Console</b> → gõ <code>1 + 1</code>. Đó là JavaScript đang chạy thật.</div>` },

  { t: 'Biến — cái hộp có dán nhãn', body: `
    ${code(`const ten = "Lan";     // giá trị sẽ KHÔNG gán lại
let diem = 0;          // giá trị sẽ thay đổi
diem = diem + 10;      // giờ là 10

const tong = 5;
tong = 6;              // ❌ TypeError: Assignment to constant variable`)}
    <div class="steps">
      <div><span class="n">1</span><span>Mặc định dùng <b>const</b> — nó nói "cái tên này không trỏ đi đâu khác".</span></div>
      <div><span class="n">2</span><span>Đổi sang <b>let</b> chỉ khi thật sự gán lại (bộ đếm, tổng đang cộng dồn).</span></div>
      <div><span class="n">3</span><span><b>var</b>: cách cũ trước 2015, phạm vi khó đoán. Không dùng trong mã mới.</span></div>
    </div>` },

  { t: 'const KHÔNG có nghĩa là "đóng băng"', body: `
    <p class="lead2">Nó khoá <b>cái tên</b>, không khoá <b>giá trị</b>. Đây là chỗ gần như ai cũng hiểu nhầm lần đầu.</p>
    ${code(`const user = { ten: 'An' };
user.ten = 'Bình';         // ✅ được — sửa BÊN TRONG object
user = { ten: 'Chi' };     // ❌ TypeError — đổi chính cái tên

const arr = [1, 2];
arr.push(3);               // ✅ được — arr vẫn là đúng mảng đó`)}
    <div class="box">Nhớ: <b>const</b> = "cái tên này luôn trỏ vào đúng một thứ". Thứ đó ruột có đổi hay không là chuyện khác.</div>` },

  { t: 'Các kiểu dữ liệu gặp đầu tiên', body: `
    ${code(`const chu    = "Hello";   // string  — chữ, trong dấu nháy
const tuoi   = 25;        // number  — nguyên và thập phân CHUNG một kiểu
const moCua  = true;      // boolean — true / false
const rong   = null;      // null      — cố ý "không có gì"
let chuaDat;              // undefined — khai rồi nhưng chưa gán

console.log(typeof chu);   // "string"
console.log(typeof tuoi);  // "number"
console.log(typeof rong);  // "object"  ← lỗi lịch sử của JS, nhớ là được`)}
    <p class="note">Khác Java/C#: JavaScript chỉ có <b>một</b> kiểu số, không tách <code>int</code> và <code>float</code>.</p>` },

  { t: 'Chuỗi và template literal', body: `
    ${code(`const ho = "Nguyễn", ten = "Lan";

const cach1 = ho + " " + ten;        // nối bằng dấu +
const cach2 = \`\${ho} \${ten}\`;        // template literal — dấu \` (backtick)

const gia = 199000;
const dong = \`Giá: \${gia.toLocaleString('vi-VN')} đ\`;
// "Giá: 199.000 đ"`)}
    <div class="box ok">Template literal dùng dấu <b>backtick</b> \` (phím trên Tab), không phải nháy đơn. Bên trong <code>\${ }</code> viết được mọi biểu thức JS. ${F()} React dùng nó liên tục.</div>` },

  { t: 'Bẫy: dấu + bị quá tải', body: `
    ${code(`2 + 2          // 4     — hai số thì CỘNG
"2" + 2        // "22"  — có chuỗi thì NỐI
2 + 2 + "1"    // "41"  — trái sang phải: 4, rồi "4"+"1"
"3" - 1        // 2     — dấu trừ KHÔNG bị quá tải, nó ép về số

Number("25")   // 25    — đổi chuỗi sang số cho chắc
String(25)     // "25"`)}
    <div class="box warn">Ô <code>&lt;input&gt;</code> luôn trả về <b>chuỗi</b>, kể cả <code>type="number"</code>. Quên <code>Number()</code> là phép cộng thành nối chữ, và lỗi hiện ra ở tận màn hình kết quả.</div>` },

  { t: 'So sánh: === chứ không phải ==', body: `
    ${code(`'' == 0          // true   ⟵ ép kiểu rồi mới so
'0' == 0         // true
'' == '0'        // false  ⟵ không có luật nào dễ nhớ ở đây
null == undefined // true

'' === 0         // false  ✅ so thẳng, không ép
1 === 1          // true`)}
    <div class="box warn">Dùng <b>===</b> và <b>!==</b> ở mọi chỗ. Lỗi do <code>==</code> rất câm: một ô trống lọt qua phép kiểm "bằng 0", rồi ba hàm sau mới ra kết quả sai.</div>
    <p class="ghi">Ngoại lệ duy nhất hay dùng: <code>x == null</code> — cố ý bắt cả <code>null</code> lẫn <code>undefined</code>.</p>` },

  { t: 'Điều kiện', body: `
    ${code(`const diem = 7;

if (diem >= 8)       console.log('Giỏi');
else if (diem >= 5)  console.log('Đạt');
else                 console.log('Chưa đạt');

// Toán tử ba ngôi — viết gọn khi chỉ chọn giữa HAI giá trị
const nhan = diem >= 5 ? 'Đạt' : 'Chưa đạt';

// Rút gọn hay gặp
const ten = nhapVao ?? 'Khách';     // null/undefined thì lấy vế sau
const dai = mang?.length;           // mang là null cũng không nổ`)}
    <div class="box">${F()} Trong React bạn sẽ viết <code>{dieuKien ? &lt;A/&gt; : &lt;B/&gt;}</code> và <code>{dieuKien && &lt;A/&gt;}</code> suốt ngày — chính là hai thứ trên.</div>` },

  { t: 'Vòng lặp', body: `
    ${code(`const mon = ['Toán', 'Lý', 'Hoá'];

for (let i = 0; i < mon.length; i++) console.log(i, mon[i]);

for (const m of mon) console.log(m);        // duyệt GIÁ TRỊ — dễ đọc nhất

let i = 0;
while (i < 3) { console.log(i); i++; }`)}
    <div class="box warn">${F()} Trong React bạn <b>gần như không viết vòng lặp</b> để dựng giao diện — dùng <code>.map()</code> ở slide sau. Vòng lặp vẫn cần khi xử lý dữ liệu thuần.</div>` },

  { t: 'Hàm — khối việc đặt tên được', body: `
    ${code(`function tinhTong(a, b) {
  return a + b;              // return trả giá trị ra ngoài
}
tinhTong(2, 3);              // 5

function chao(ten = 'bạn') { // tham số mặc định
  return \`Xin chào \${ten}\`;
}
chao();                      // "Xin chào bạn"`)}
    <div class="box">Hàm <b>không có</b> <code>return</code> thì trả về <code>undefined</code>. Đây là nguyên nhân số một của "sao biến của em là undefined".</div>` },

  { t: `Arrow function ${F()}`, body: `
    ${code(`// ba cách viết CÙNG một hàm
function gap2a(x) { return x * 2; }
const gap2b = function (x) { return x * 2; };
const gap2c = (x) => x * 2;        // arrow — return NGẦM khi viết một dòng

const cong = (a, b) => a + b;
const chao = (ten) => {            // có ngoặc nhọn thì PHẢI viết return
  const loi = \`Chào \${ten}\`;
  return loi;
};

const taoObj = (x) => ({ gia: x });  // trả object phải BỌC ngoặc tròn`)}
    <div class="box ok">Ba chỗ React dùng arrow liên tục: <code>onClick={() => ...}</code>, <code>arr.map(x => ...)</code>, và <code>setState(s => s + 1)</code>.</div>` },

  { t: 'Mảng — danh sách xếp theo thứ tự', body: `
    ${code(`const mon = ['Toán', 'Lý', 'Hoá'];

mon.length      // 3
mon[0]          // 'Toán'   ← đếm từ 0, KHÔNG phải 1
mon[mon.length - 1]  // 'Hoá'  ← phần tử cuối

mon.push('Sinh');      // thêm vào cuối   → 4 phần tử
mon.includes('Lý');    // true
mon.indexOf('Hoá');    // 2`)}
    <p class="note">Mảng trong JS chứa được mọi kiểu, kể cả lẫn lộn — nhưng thực tế nên để cùng một loại.</p>` },

  { t: `Method mảng — map / filter / find ${FH()}`, body: `
    ${code(`const sv = [
  { id: 1, ten: 'An',   diem: 8 },
  { id: 2, ten: 'Bình', diem: 4 },
  { id: 3, ten: 'Chi',  diem: 9 },
];

sv.map(s => s.ten);             // ['An','Bình','Chi']   — mảng MỚI, cùng độ dài
sv.filter(s => s.diem >= 5);    // [An, Chi]             — mảng MỚI, ngắn hơn
sv.find(s => s.diem >= 5);      // { An }                — MỘT phần tử đầu tiên
sv.some(s => s.diem < 5);       // true                  — có ai không?
sv.every(s => s.diem >= 5);     // false                 — tất cả chứ?`, 'javascript', 'sm')}
    <div class="box ok">Đây là phần <b>quan trọng nhất</b> của cả chương với FER202: React biến dữ liệu thành giao diện bằng đúng <code>.map()</code>.</div>` },

  { t: 'reduce · sort — và hai cái bẫy', body: `
    ${code(`[1, 2, 3, 4].reduce((acc, n) => acc + n, 0);   // 10  — tổng
[1, 2, 3, 4].reduce((acc, n) => acc * n, 1);   // 24  — tích, khởi tạo 1

// ⚠️ BẪY 1 — sort() sắp xếp TẠI CHỖ, sửa luôn mảng gốc
const moi = [...goc].sort((a, b) => a - b);    // chép trước bằng [...]

// ⚠️ BẪY 2 — không truyền hàm so sánh thì nó so như CHUỖI
[10, 9, 2].sort();                 // [10, 2, 9]  ← sai
[10, 9, 2].sort((a, b) => a - b);  // [2, 9, 10]  ✅`)}
    <div class="box warn">${F()} Sửa thẳng mảng đang nằm trong state của React là lỗi kinh điển — màn hình không cập nhật. Luôn <code>[...mang]</code> trước khi <code>sort</code>.</div>` },

  { t: `Object · destructuring · spread ${F()}`, body: `
    ${code(`const sv = { id: 1, ten: 'An', diem: 8 };

sv.ten;                 // 'An'      — dấu chấm
sv['ten'];              // 'An'      — ngoặc vuông, khi tên nằm trong biến

const { ten, diem } = sv;            // destructuring — tách ra thành biến rời
const { ten: hoTen } = sv;           // đổi tên khi tách

const sv2 = { ...sv, diem: 10 };     // spread — object MỚI, diem bị đè
const gop = [...mangA, ...mangB];    // spread cho mảng`)}
    <div class="box ok">React nhận props bằng destructuring — <code>function Card({ title, price })</code> — và cập nhật state bằng spread — <code>setForm({ ...form, ten: 'An' })</code>.</div>` },

  { t: 'DOM — nối JavaScript với trang HTML', body: `
    ${code(`<h1 id="tieu-de">Xin chào</h1>
<button id="nut">Bấm tôi</button>`, 'xml')}
    ${code(`const h1 = document.querySelector('#tieu-de');
h1.textContent = 'Đã đổi!';        // đổi chữ
h1.style.color = 'red';            // đổi kiểu

document.querySelector('#nut')
  .addEventListener('click', () => {
     console.log('vừa bấm');
  });`, 'javascript', 'sm')}
    <div class="box">${F()} React <b>thay thế</b> cách làm này: bạn mô tả giao diện theo state, React tự sửa DOM. Nhưng phải hiểu DOM trước thì mới hiểu React đang đỡ hộ mình cái gì.</div>` },

  { t: 'Bốn lỗi người mới hay gặp', body: `
    <div class="grid2">
      <div class="f"><b>undefined bất ngờ</b><br/>Hàm quên <code>return</code></div>
      <div class="f"><b>[10, 2, 9]</b><br/><code>sort()</code> thiếu hàm so sánh</div>
      <div class="f"><b>"41" thay vì 5</b><br/><code>+</code> gặp chuỗi thì nối</div>
      <div class="f"><b>Cannot read of undefined</b><br/>Đọc thuộc tính của thứ chưa có → dùng <code>?.</code></div>
    </div>
    <div class="box ok">Gặp lỗi thì mở <b>Console (F12)</b> đọc dòng đầu tiên trước — nó có tên file và số dòng. Đoán mò trước khi đọc lỗi là cách chậm nhất.</div>` },

  { t: 'Chương này gặp lại ở FER202 chỗ nào', body: `
    <table class="t big2">
      <tr><th>Kiến thức chương 4</th><th>Dùng ở FER202</th></tr>
      <tr><td>Arrow function</td><td><code>onClick={() => setShow(true)}</code></td></tr>
      <tr><td><code>.map()</code> + <code>key</code></td><td>Dựng danh sách Card từ mảng sản phẩm</td></tr>
      <tr><td><code>.filter()</code></td><td>Ô tìm kiếm, lọc theo loại</td></tr>
      <tr><td>Destructuring</td><td>Nhận props: <code>function Card({ title })</code></td></tr>
      <tr><td>Spread <code>...</code></td><td>Cập nhật state: <code>setForm({ ...form, ten })</code></td></tr>
      <tr><td>Ba ngôi <code>? :</code> và <code>&&</code></td><td>Hiện/ẩn có điều kiện trong JSX</td></tr>
      <tr><td>Template literal</td><td>Ghép chuỗi class, thông báo</td></tr>
    </table>` },

  { t: 'Tự luyện — làm ngay trong Console', body: `
    ${code(`const menu = [
  { id: 1, ten: 'Margherita', gia: 149000, loai: 'chay' },
  { id: 2, ten: 'Pepperoni',  gia: 199000, loai: 'thit' },
  { id: 3, ten: 'Hải sản',    gia: 239000, loai: 'thit' },
];

// 1. Lấy mảng chỉ gồm TÊN các món
// 2. Lọc các món dưới 200.000
// 3. Tìm món đầu tiên loại 'thit'
// 4. Tính TỔNG tiền cả menu
// 5. Sắp xếp theo giá tăng dần mà KHÔNG sửa mảng gốc`, 'javascript', 'sm')}
    <div class="box ok">Mở <b>F12 → Console</b>, dán mảng vào rồi tự viết 5 dòng. Làm được cả 5 là bạn đủ nền cho phần khó nhất của FER202.</div>` },

  { t: 'Học thêm ở đâu', body: `
    <table class="t">
      <tr><th>Nguồn</th><th>Dùng khi</th></tr>
      <tr><td><b>javascript.info</b></td><td>Học có thứ tự, giải thích sâu, có bài tập — phần "Array methods" là hay nhất</td></tr>
      <tr><td><b>developer.mozilla.org</b> (MDN)</td><td>Tra cứu chuẩn: một method nhận gì, trả gì</td></tr>
      <tr><td><b>Console của trình duyệt</b></td><td>Thử nhanh một dòng — không cần cài gì</td></tr>
      <tr><td><b>react.dev</b> → "Learn React"</td><td>Bước kế tiếp sau chương 5</td></tr>
    </table>
    <div class="box">Cách học hiệu quả nhất: đọc 15 phút → <b>gõ lại bằng tay</b> (đừng copy) → cố ý làm sai một chỗ để xem lỗi → tự làm một biến thể.</div>` },
];
