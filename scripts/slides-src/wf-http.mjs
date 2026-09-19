/** Web Foundations · Deck wf-http — Chương 6: HTTP & API. */
import { code, F, FH } from './_wf-chung.mjs';

export const deck = { key: 'wf-http', code: 'WF · CH6', title: 'HTTP & API', sub: 'Nền tảng Lập trình Web · Chương 6' };

export const slides = [
  { kind: 'cover', t: 'Chương 6 — HTTP & API', sub: 'Request/Response · Method · Status · Headers · REST',
    body: `<p class="cov-meta">Nền tảng Lập trình Web · cuongthai.com<br/>Chương này quyết định bạn có đọc được tab Network hay không</p>` },

  { t: 'Nội dung chương', body: `
    <ol class="toc">
      <li>Chu trình yêu cầu / phản hồi</li>
      <li>HTTP method — các động từ của web ⭐</li>
      <li>Mã trạng thái — server trả lời gì ⭐⭐</li>
      <li>Headers, JSON và phần thân</li>
      <li>REST API, route param và query string ⭐</li>
    </ol>` },

  { t: 'Một lượt trao đổi HTTP', body: `
    <div class="dg">
      <div class="bx">Client<br/><small>trình duyệt</small></div>
      <div class="ar">→<small>Request</small></div>
      <div class="bx ext">Server</div>
      <div class="ar">←<small>Response</small></div>
      <div class="bx st">Hiển thị</div>
    </div>
    ${code(`GET /api/v1/pizzas HTTP/1.1        ← dòng đầu: method + đường dẫn
Host: cuongthai.com                 ← headers
Authorization: Bearer eyJhbGc...
                                    ← dòng trống ngăn header với thân
(GET không có thân)`, 'http', 'sm')}
    <div class="box">HTTP <b>không nhớ</b> lượt trước (stateless). Mỗi request phải tự mang theo mọi thứ cần thiết — đó là lý do cần cookie hoặc token (chương 7).</div>` },

  { t: `HTTP method — các động từ ${F()}`, body: `
    <table class="t big2">
      <tr><th>Method</th><th>Làm gì</th><th>Có thân?</th></tr>
      <tr><td><b>GET</b></td><td>Lấy dữ liệu — không được đổi gì</td><td>Không</td></tr>
      <tr><td><b>POST</b></td><td>Tạo mới</td><td>Có</td></tr>
      <tr><td><b>PUT</b></td><td>Thay TOÀN BỘ bản ghi</td><td>Có</td></tr>
      <tr><td><b>PATCH</b></td><td>Sửa MỘT PHẦN</td><td>Có</td></tr>
      <tr><td><b>DELETE</b></td><td>Xoá</td><td>Thường không</td></tr>
    </table>
    <div class="box warn">GET phải <b>an toàn</b>: gọi mười lần cũng không đổi gì. Làm nút "Xoá" bằng GET là sai — trình duyệt và bộ nhớ đệm có thể tự gọi lại nó.</div>` },

  { t: `Mã trạng thái — nhớ theo nhóm hàng trăm ${FH()}`, body: `
    <table class="t">
      <tr><th>Nhóm</th><th>Nghĩa</th><th>Hay gặp</th></tr>
      <tr><td><b>2xx</b></td><td>Thành công</td><td>200 OK · 201 Created · 204 No Content</td></tr>
      <tr><td><b>3xx</b></td><td>Chuyển hướng</td><td>301 vĩnh viễn · 302 tạm thời · 304 chưa đổi</td></tr>
      <tr><td><b>4xx</b></td><td><b>LỖI CỦA CLIENT</b></td><td>400 · 401 · 403 · 404 · 422 · 429</td></tr>
      <tr><td><b>5xx</b></td><td><b>LỖI CỦA SERVER</b></td><td>500 · 502 · 503 · 504</td></tr>
    </table>
    <div class="box ok">Phân biệt 4xx và 5xx là việc đầu tiên khi gỡ lỗi: <b>4xx thì sửa phía bạn</b> (sai URL, thiếu token, dữ liệu không hợp lệ), <b>5xx thì server hỏng</b> — gửi lại cũng vậy.</div>` },

  { t: '401 · 403 · 404 — ba cái hay nhầm', body: `
    <div class="grid3">
      <div class="card"><b>401</b><p>Chưa đăng nhập<br/>hoặc token hết hạn<br/><i>"bạn là ai?"</i></p></div>
      <div class="card"><b>403</b><p>Đã biết bạn là ai<br/>nhưng không đủ quyền<br/><i>"biết rồi, nhưng không cho"</i></p></div>
      <div class="card"><b>404</b><p>Không có đường dẫn đó<br/><i>"chỗ này không tồn tại"</i></p></div>
    </div>
    <div class="box">Mẹo gỡ lỗi thật dùng ở dự án này: gọi một endpoint mà <b>không</b> đăng nhập. Trả <b>401</b> = route đã mount, chỉ cần token. Trả <b>404</b> = route chưa có, thường do bản dựng cũ.</div>` },

  { t: 'Headers — ba cái gặp mỗi ngày', body: `
    ${code(`Content-Type: application/json     ← thân là JSON
Authorization: Bearer eyJhbGciOi... ← token đăng nhập
Cache-Control: no-store             ← đừng lưu đệm

Accept: application/json            ← client muốn nhận kiểu gì
Set-Cookie: session=abc; HttpOnly   ← server gửi cookie về`, 'http')}
    <div class="box warn">Gửi JSON mà quên <code>Content-Type: application/json</code> thì server đọc thân ra rỗng, rồi báo "thiếu trường" dù bạn đã gửi đủ. Lỗi này tốn rất nhiều thời gian của người mới.</div>` },

  { t: 'JSON — định dạng trao đổi của cả web', body: `
    ${code(`{
  "id": 3,
  "ten": "Pizza Hải Sản",
  "gia": 239000,
  "conHang": true,
  "topping": ["tôm", "mực", "phô mai"],
  "khuyenMai": null
}`, 'json')}
    <div class="box">Luật JSON chặt hơn object JS: <b>khoá phải có nháy kép</b>, <b>không được có dấu phẩy thừa</b> ở cuối, và không có chú thích. Dán vào <code>jsonlint.com</code> khi nghi ngờ.</div>
    ${code(`JSON.stringify(obj)   // object JS  → chuỗi JSON  (khi GỬI đi)
JSON.parse(chuoi)     // chuỗi JSON → object JS   (khi NHẬN về)`, 'javascript', 'sm')}` },

  { t: `REST — route param và query string ${F()}`, body: `
    ${code(`GET    /api/pizzas          → danh sách
GET    /api/pizzas/3        → MỘT món, id = 3      ← route param
POST   /api/pizzas          → tạo mới
PUT    /api/pizzas/3        → thay toàn bộ món 3
DELETE /api/pizzas/3        → xoá món 3

GET /api/pizzas?loai=chay&page=2&size=12          ← query string
                 └─ lọc ─┘ └── phân trang ──┘`, 'http', 'sm')}
    <div class="two">
      <div class="card"><b>Route param</b><p><code>/pizzas/3</code> — xác định MỘT tài nguyên cụ thể</p></div>
      <div class="card"><b>Query string</b><p><code>?loai=chay</code> — lọc, sắp xếp, phân trang</p></div>
    </div>` },

  { t: 'Đọc tab Network — kỹ năng đáng giá nhất chương', body: `
    <div class="steps">
      <div><span class="n">1</span><span>F12 → <b>Network</b> → tải lại trang. Mỗi dòng là một request.</span></div>
      <div><span class="n">2</span><span>Cột <b>Status</b>: đỏ là hỏng. Bấm vào dòng đó trước.</span></div>
      <div><span class="n">3</span><span>Tab <b>Headers</b>: xem URL thật, method, và header đã gửi đúng chưa.</span></div>
      <div><span class="n">4</span><span>Tab <b>Response</b>: server trả về gì — thường có thông báo lỗi nói rõ nguyên nhân.</span></div>
      <div><span class="n">5</span><span>Cột <b>Size</b> và <b>Time</b>: trang chậm thì tìm dòng nặng nhất ở đây.</span></div>
    </div>
    <div class="box ok">Ví dụ thật ở chính web này: trang danh sách khoá học tải <b>2,86 MB</b> cho một trang chỉ hiện tên và ảnh — nhìn cột Size là thấy ngay.</div>` },

  { t: 'Chương này gặp lại ở FER202 chỗ nào', body: `
    <table class="t big2">
      <tr><th>Kiến thức chương 6</th><th>Dùng ở FER202</th></tr>
      <tr><td>GET / POST / PUT / DELETE</td><td>Chương 11 — gọi API bằng axios</td></tr>
      <tr><td>Mã trạng thái</td><td>Phân biệt 401 (bắt đăng nhập lại) với 500 (báo lỗi server)</td></tr>
      <tr><td><code>Content-Type</code>, <code>Authorization</code></td><td>Cấu hình header cho axios</td></tr>
      <tr><td>JSON</td><td>Mọi dữ liệu đi/về giữa React và server</td></tr>
      <tr><td>Query string</td><td>Ô tìm kiếm, phân trang, bộ lọc</td></tr>
      <tr><td>Tab Network</td><td>Công cụ số một khi "sao dữ liệu không hiện"</td></tr>
    </table>` },

  { t: 'Tự luyện', body: `
    ${code(`// Dùng API công khai, mở F12 → Console

// 1. GET danh sách rồi in ra 5 tiêu đề đầu
fetch('https://jsonplaceholder.typicode.com/posts')

// 2. GET MỘT bài theo route param: /posts/1

// 3. GET có query string: /posts?userId=2 — đếm xem trả về bao nhiêu bài

// 4. POST một bài mới, nhớ Content-Type và JSON.stringify

// 5. Gọi sai URL (thêm chữ 'x') rồi xem Status và Response trong tab Network`, 'javascript', 'sm')}` },
];
