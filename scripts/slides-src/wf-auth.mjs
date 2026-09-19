/** Web Foundations · Deck wf-auth — Chương 7: Xác thực & bảo mật. */
import { code, F } from './_wf-chung.mjs';

export const deck = { key: 'wf-auth', code: 'WF · CH7', title: 'Xác thực & bảo mật', sub: 'Nền tảng Lập trình Web · Chương 7' };

export const slides = [
  { kind: 'cover', t: 'Chương 7 — Xác thực & bảo mật', sub: 'Cookie · Session · JWT · Mật khẩu · HTTPS · CORS',
    body: `<p class="cov-meta">Nền tảng Lập trình Web · cuongthai.com</p>` },

  { t: 'Nội dung chương', body: `
    <ol class="toc">
      <li>Xác thực vs phân quyền — hai việc khác nhau</li>
      <li>Cookie &amp; session</li>
      <li>Token &amp; JWT ⭐</li>
      <li>Bảo mật mật khẩu</li>
      <li>HTTPS và CORS ⭐</li>
    </ol>` },

  { t: 'Hai từ hay bị dùng lẫn', body: `
    <div class="two">
      <div class="card"><b>Authentication — Xác thực</b><p><i>"Bạn là ai?"</i><br/>Kiểm email + mật khẩu. Sai → <b>401</b></p></div>
      <div class="card"><b>Authorization — Phân quyền</b><p><i>"Bạn được làm gì?"</i><br/>Đã biết bạn là ai, nhưng không đủ quyền → <b>403</b></p></div>
    </div>
    <div class="box">Đăng nhập xong <b>không</b> có nghĩa là được làm mọi thứ. Một người dùng thường đăng nhập rồi vẫn nhận 403 khi mở trang quản trị — đó là phân quyền đang làm việc.</div>` },

  { t: 'HTTP không nhớ gì — nên cần cookie', body: `
    <div class="dg">
      <div class="bx">Đăng nhập</div><div class="ar">→<small>đúng mật khẩu</small></div>
      <div class="bx ext">Server tạo session</div><div class="ar">→<small>Set-Cookie</small></div>
      <div class="bx st">Trình duyệt giữ cookie</div>
    </div>
    ${code(`Set-Cookie: session=a1b2c3; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`, 'http')}
    <div class="grid2">
      <div class="f"><b>HttpOnly</b><br/>JavaScript KHÔNG đọc được → chống đánh cắp</div>
      <div class="f"><b>Secure</b><br/>Chỉ gửi qua HTTPS</div>
      <div class="f"><b>SameSite</b><br/>Chặn gửi kèm từ trang khác → chống CSRF</div>
      <div class="f"><b>Max-Age</b><br/>Sống bao lâu, tính bằng giây</div>
    </div>` },

  { t: `Token & JWT ${F()}`, body: `
    ${code(`eyJhbGciOiJIUzI1NiJ9 . eyJ1c2VySWQiOjEsInJvbGUiOiJVU0VSIn0 . 4f2a...
└──── header ────┘   └────────── payload ──────────┘   └─ chữ ký ─┘`, 'plaintext')}
    ${code(`// Client gửi kèm mỗi request
fetch('/api/me', {
  headers: { Authorization: 'Bearer ' + token }
});`, 'javascript', 'sm')}
    <div class="box warn">⚠️ <b>Payload của JWT KHÔNG được mã hoá</b> — chỉ là base64, ai cũng giải ra đọc được. Chữ ký chỉ chứng minh nó <i>chưa bị sửa</i>. Đừng bao giờ để mật khẩu hay dữ liệu nhạy cảm trong JWT.</div>` },

  { t: 'Session hay Token — chọn cái nào', body: `
    <table class="t big2">
      <tr><th></th><th>Session (cookie)</th><th>Token (JWT)</th></tr>
      <tr><td>Lưu ở</td><td>Server nhớ</td><td>Client giữ, server không nhớ</td></tr>
      <tr><td>Thu hồi</td><td>Dễ — xoá ở server</td><td>Khó — phải đợi hết hạn</td></tr>
      <tr><td>Nhiều server</td><td>Cần chia sẻ kho session</td><td>Tự nhiên hợp</td></tr>
      <tr><td>App di động</td><td>Cồng kềnh</td><td>Hợp hơn</td></tr>
    </table>
    <div class="box">Thực tế hay dùng cả hai: <b>token ngắn hạn</b> (15 phút) + <b>refresh token dài hạn</b> trong cookie HttpOnly. Hết hạn thì tự làm mới, người dùng không thấy gì.</div>` },

  { t: 'Mật khẩu — ba luật không được phá', body: `
    <div class="steps">
      <div><span class="n">1</span><span><b>KHÔNG BAO GIỜ lưu mật khẩu dạng chữ thường.</b> Lộ cơ sở dữ liệu là mất sạch tài khoản người dùng — và họ thường dùng lại mật khẩu đó ở nơi khác.</span></div>
      <div><span class="n">2</span><span><b>Hash bằng bcrypt / argon2</b>, không dùng MD5 hay SHA-1 — hai cái đó phá được trong vài giây.</span></div>
      <div><span class="n">3</span><span><b>Không tự viết</b> thuật toán băm. Dùng thư viện đã được kiểm chứng.</span></div>
    </div>
    ${code(`const hash = await bcrypt.hash(matKhau, 10);      // khi ĐĂNG KÝ
const dung = await bcrypt.compare(nhapVao, hash);  // khi ĐĂNG NHẬP
// hash KHÔNG giải ngược được — chỉ so sánh được`, 'javascript', 'sm')}` },

  { t: 'Thông báo lỗi đăng nhập — đừng nói quá nhiều', body: `
    <div class="two">
      <div class="card"><b>❌ Sai</b><p>"Email không tồn tại"<br/>"Mật khẩu không đúng"</p></div>
      <div class="card"><b>✅ Đúng</b><p>"Email hoặc mật khẩu không đúng"</p></div>
    </div>
    <div class="box warn">Tách hai thông báo là cho kẻ tấn công biết <b>email nào có thật</b> trong hệ thống — họ dò được danh sách người dùng rồi mới đi đoán mật khẩu. Một câu chung chung chặn việc đó.</div>` },

  { t: 'HTTPS — vì sao bắt buộc', body: `
    <div class="two">
      <div class="card"><b>HTTP</b><p>Gửi chữ trần. Ai ngồi chung Wi-Fi cũng đọc được mật khẩu bạn vừa gõ.</p></div>
      <div class="card"><b>HTTPS</b><p>Mã hoá đường truyền. Chứng chỉ miễn phí từ Let's Encrypt.</p></div>
    </div>
    <div class="box ok">Không có lý do gì để chạy HTTP nữa: chứng chỉ miễn phí, trình duyệt gắn nhãn "Not secure" cho HTTP, và cookie <code>Secure</code> chỉ hoạt động trên HTTPS.</div>` },

  { t: `CORS — lỗi bạn chắc chắn sẽ gặp ${F()}`, body: `
    ${code(`Access to fetch at 'https://api.abc.com/data' from origin
'http://localhost:3000' has been blocked by CORS policy`, 'plaintext')}
    <div class="steps">
      <div><span class="n">1</span><span>Trình duyệt <b>chặn</b> trang ở origin A đọc dữ liệu từ origin B, trừ khi B cho phép.</span></div>
      <div><span class="n">2</span><span>Sửa ở <b>SERVER</b>, không sửa ở client — server phải trả header <code>Access-Control-Allow-Origin</code>.</span></div>
      <div><span class="n">3</span><span>Đây là luật của <b>trình duyệt</b>. Gọi bằng Postman hay curl vẫn chạy bình thường — nên đừng dùng Postman để kết luận "API ổn".</span></div>
    </div>
    <div class="box warn">${F()} Chạy React ở <code>localhost:3000</code> gọi API ở <code>localhost:8080</code> là <b>khác origin</b> — bạn sẽ gặp CORS ngay buổi đầu nối API.</div>` },

  { t: 'Ba lỗ hổng phải biết tên', body: `
    <table class="t big2">
      <tr><th>Tên</th><th>Là gì</th><th>Chặn bằng</th></tr>
      <tr><td><b>XSS</b></td><td>Chèn mã JS vào nội dung người dùng nhập</td><td>Không dùng <code>innerHTML</code> với dữ liệu người dùng; lọc HTML</td></tr>
      <tr><td><b>CSRF</b></td><td>Trang khác lừa trình duyệt gửi request thay bạn</td><td>Cookie <code>SameSite</code>, CSRF token</td></tr>
      <tr><td><b>SQL Injection</b></td><td>Chèn câu SQL qua ô nhập</td><td>Truy vấn tham số hoá / ORM — chương 8</td></tr>
    </table>
    <div class="box">${F()} React tự escape nội dung trong <code>{ }</code> nên chống XSS khá tốt — trừ khi bạn dùng <code>dangerouslySetInnerHTML</code>. Cái tên dài và đáng sợ như vậy là cố ý.</div>` },

  { t: 'Tự luyện', body: `
    <div class="steps">
      <div><span class="n">1</span><span>Mở một trang bạn đã đăng nhập → F12 → <b>Application → Cookies</b>. Tìm cookie phiên, xem nó có <code>HttpOnly</code> và <code>Secure</code> không.</span></div>
      <div><span class="n">2</span><span>Vào <b>jwt.io</b>, dán một token bất kỳ và xem payload giải ra được gì — để tự thấy vì sao không được để dữ liệu nhạy cảm trong đó.</span></div>
      <div><span class="n">3</span><span>Gọi một API cần đăng nhập mà <b>không</b> gửi token, xem mã trả về là 401. Rồi gửi token sai, xem có khác không.</span></div>
      <div><span class="n">4</span><span>Tự gây một lỗi CORS: từ Console của trang bất kỳ, <code>fetch</code> sang một tên miền khác và đọc kỹ thông báo lỗi.</span></div>
    </div>` },
];
