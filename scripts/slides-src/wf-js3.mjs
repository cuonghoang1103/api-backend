/** Web Foundations · Deck wf-js3 — Chương 11: JavaScript nâng cao. */
import { code, F } from './_wf-chung.mjs';

export const deck = { key: 'wf-js3', code: 'WF · CH11', title: 'JavaScript nâng cao', sub: 'Nền tảng Lập trình Web · Chương 11' };

export const slides = [
  { kind: 'cover', t: 'Chương 11 — JavaScript nâng cao', sub: 'Closure · this · Prototype & class · Map/Set · Regex · Bất biến',
    body: `<p class="cov-meta">Nền tảng Lập trình Web · cuongthai.com<br/>Ranh giới giữa "dùng được ngôn ngữ" và "hiểu ngôn ngữ"</p>` },

  { t: 'Nội dung chương', body: `
    <ol class="toc">
      <li>Closure — hàm nhớ được nơi nó sinh ra ⭐</li>
      <li><code>this</code> — bốn luật giải thích tất cả</li>
      <li>Prototype và class</li>
      <li>Map, Set và tư duy <b>bất biến</b> ⭐⭐</li>
      <li>Biểu thức chính quy, vừa đủ dùng</li>
    </ol>` },

  { t: 'Closure — ví dụ nhỏ nhất', body: `
    ${code(`function taoBoDem() {
  let dem = 0;                // sống trong phạm vi của taoBoDem
  return function () {
    dem = dem + 1;            // vẫn với tới được, dù hàm ngoài đã return
    return dem;
  };
}

const tiep = taoBoDem();
tiep();  // 1
tiep();  // 2
// KHÔNG có cách nào đặt dem = 100 từ bên ngoài`)}
    <div class="box ok">Closure cho bạn <b>state riêng tư</b>. Hai closure khác nhau giữ hai <code>dem</code> riêng — đúng lý do hai <code>&lt;Counter /&gt;</code> trong React đếm độc lập.</div>` },

  { t: 'Bẫy closure kinh điển — var vs let', body: `
    ${code(`for (var i = 0; i < 3; i++) setTimeout(() => console.log(i), 0);
// 3, 3, 3   ← chỉ có MỘT i; lúc hẹn giờ chạy thì i đã là 3

for (let j = 0; j < 3; j++) setTimeout(() => console.log(j), 0);
// 0, 1, 2   ← let tạo một j MỚI cho mỗi vòng`)}
    <div class="box warn">Closure bắt giữ <b>CÁI BIẾN</b>, không phải bản chụp giá trị. Riêng ví dụ này là lý do <code>let</code> thay thế <code>var</code> — không phải chuyện phong cách, nó đổi kết quả chương trình. Đã chạy thật để lấy đáp án.</div>` },

  { t: 'this — bốn luật, theo thứ tự ưu tiên', body: `
    ${code(`new Person('Lan')          // 1. new     → this = object vừa tạo
hi.call({ ten: 'An' })     // 2. gán thẳng → this = cái bạn đưa
user.chao()                // 3. method   → this = object TRƯỚC dấu chấm
const g = user.chao; g()   // 4. gọi trơn → this = undefined (strict)`)}
    <div class="box warn">Luật 4 là chỗ mất hàng giờ: lôi method ra khỏi object là mất <code>this</code>. Đo thật — trong module (strict) nó ném <code>TypeError</code>; trong script thường nó trả <code>undefined</code> lặng lẽ.</div>` },

  { t: 'Arrow function không có this riêng', body: `
    ${code(`const dongHo = {
  dem: 0,
  hong()  { setInterval(function () { this.dem++; }, 1000); },  // ❌
  dung()  { setInterval(() => { this.dem++; }, 1000); },        // ✅
};`)}
    <div class="two">
      <div class="card"><b>Hàm thường</b><p><code>this</code> tuỳ CHỖ GỌI. Linh hoạt, dễ hỏng.</p></div>
      <div class="card"><b>Arrow</b><p><code>this</code> cố định lúc VIẾT. Đoán được, nhưng sai nếu làm method.</p></div>
    </div>
    <div class="box">${F()} Component hàm của React tránh <code>this</code> hoàn toàn — một trong những lý do hooks thay thế class component.</div>` },

  { t: 'Chuỗi prototype', body: `
    <div class="dg">
      <div class="bx">arr</div><div class="ar">→</div>
      <div class="bx">Array.prototype<br/><small>map, filter…</small></div><div class="ar">→</div>
      <div class="bx">Object.prototype</div><div class="ar">→</div>
      <div class="bx st">null</div>
    </div>
    ${code(`class DongVat { keu() { return 'tiếng'; } }
class Cho extends DongVat { keu() { return 'sủa'; } }
new Cho() instanceof DongVat;   // true`, 'javascript', 'sm')}
    <div class="box warn">⛔ Đừng mở rộng prototype có sẵn (<code>Array.prototype.cuoi = ...</code>): mọi mảng ở mọi nơi mọc thêm thuộc tính, và hai thư viện cùng làm vậy sẽ đánh nhau.</div>` },

  { t: `Bất biến — luật sống còn với React ${F()}`, body: `
    ${code(`// ❌ sửa tại chỗ — React KHÔNG thấy gì đổi
arr.push(4);  obj.ten = 'mới';

// ✅ thay bằng cái mới
const arr2 = [...arr, 4];
const obj2 = { ...obj, ten: 'mới' };

// SỬA tại chỗ: push pop shift unshift splice sort reverse
// TRẢ CÁI MỚI: map filter slice concat`)}
    <div class="box warn">React so sánh <b>tham chiếu</b>. Sửa tại chỗ thì cũ và mới là CÙNG một object ⇒ React thấy "không có gì đổi" ⇒ màn hình đứng im, không lỗi nào báo. Câu "em cập nhật rồi mà không thấy gì" gần như luôn là chuyện này.</div>` },

  { t: 'Spread chỉ chép NÔNG', body: `
    ${code(`const u = { ten: 'A', diaChi: { thanhPho: 'HN' } };
const c = { ...u };
c.diaChi.thanhPho = 'Huế';
u.diaChi.thanhPho;        // 'Huế'  ← đã CHẠY THẬT: object con dùng CHUNG

// chép từng tầng mình đụng tới
const dung = { ...u, diaChi: { ...u.diaChi, thanhPho: 'Huế' } };
// hoặc chép sâu hoàn toàn
const sau = structuredClone(u);`)}
    <div class="box">Đây là nguồn của lỗi "sửa một cái mà cả loạt cùng đổi".</div>` },

  { t: 'Map và Set', body: `
    ${code(`const m = new Map();
m.set(42, 'khoá là số');     // khoá KIỂU GÌ cũng được
m.get(42);  m.has(42);  m.size;

const khongTrung = [...new Set([1, 2, 2, 3])];   // [1, 2, 3]`)}
    <div class="two">
      <div class="card"><b>Dùng Map</b><p>Khoá không phải chuỗi · thêm/xoá liên tục · cần <code>.size</code></p></div>
      <div class="card"><b>Dùng object</b><p>Hình dáng cố định, viết được thành JSON</p></div>
    </div>` },

  { t: 'Regex — bảy ký hiệu đủ dùng', body: `
    ${code(`\\d \\w \\s      một chữ số · ký tự từ · khoảng trắng
.             một ký tự bất kỳ
+ * ?         một-hoặc-nhiều · không-hoặc-nhiều · không-hoặc-một
^ $           đầu chuỗi · cuối chuỗi
[abc] [^abc]  một trong · không phải
( )           nhóm bắt
{2,4}         lặp 2 tới 4 lần`, 'plaintext')}
    ${code(`/^\\d{10}$/.test('0912345678');       // true
'a1b2'.replace(/\\d/g, '#');           // "a#b#"
'2026-09-19'.match(/(\\d{4})-(\\d{2})/)[1];  // "2026"`, 'javascript', 'sm')}
    <div class="box warn">⛔ Đừng tự viết regex kiểm email. Dùng phép kiểm hình dáng tối thiểu rồi <b>gửi email xác nhận</b> — đó là cách mọi hệ thống nghiêm túc làm.</div>` },

  { t: 'Tự luyện', body: `
    ${code(`// 1. Viết taoViSo(batDau) trả về hàm tăng dần, mỗi lần gọi ra số kế tiếp
// 2. Giải thích vì sao vòng lặp var in ra 3,3,3 — bằng lời của bạn
// 3. Viết class Hinh có chu vi(), rồi HinhTron extends Hinh ghi đè nó
// 4. Khử trùng lặp một mảng object theo id (gợi ý: Map)
// 5. Viết hàm capNhat(sv, id, diemMoi) trả về MẢNG MỚI, không sửa mảng cũ`, 'javascript', 'sm')}
    <div class="box ok">Bài 5 là bài quan trọng nhất — nó đúng là thứ bạn làm mỗi ngày khi cập nhật state trong React.</div>` },
];
