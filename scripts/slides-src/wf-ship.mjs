/** Web Foundations · Deck wf-ship — Chương 14: Đưa sản phẩm lên mạng. */
import { code, F, FH } from './_wf-chung.mjs';

export const deck = { key: 'wf-ship', code: 'WF · CH14', title: 'Đưa lên mạng', sub: 'Nền tảng Lập trình Web · Chương 14' };

export const slides = [
  { kind: 'cover', t: 'Chương 14 — Đưa sản phẩm lên mạng', sub: 'Build · Biến môi trường · Deploy · Đo hiệu năng',
    body: `<p class="cov-meta">Nền tảng Lập trình Web · cuongthai.com<br/>Mã chạy trên máy bạn chưa phải là sản phẩm</p>` },

  { t: 'Nội dung chương', body: `
    <ol class="toc">
      <li>Bản dựng production thật ra làm gì</li>
      <li>Biến môi trường và khoá bí mật ⭐⭐</li>
      <li>Deploy — và bẫy 404 khi tải lại ⭐</li>
      <li>Đo hiệu năng: Core Web Vitals</li>
    </ol>` },

  { t: 'Dev server và bản build là HAI chương trình', body: `
    <div class="two">
      <div class="card"><b>npm start</b><p>Dựng lại mỗi lần lưu. Mã dễ đọc, có cảnh báo, không tối ưu.<br/><b>Đừng deploy cái này.</b></p></div>
      <div class="card"><b>npm run build</b><p>File tĩnh trong <code>build/</code>. Rút gọn, gộp, gắn mã băm.<br/><b>Đây là thứ người dùng nhận.</b></p></div>
    </div>
    ${code(`1. Gộp gói   — hàng trăm module thành vài file
2. Rút gọn   — bỏ chú thích, rút ngắn tên biến
3. Gắn mã băm— main.a80b38e9.js  ← tên ĐỔI khi nội dung đổi
4. Rung cây  — bỏ export không ai dùng
5. Tách gói  — mỗi route một mảnh, tải khi cần`, 'plaintext', 'sm')}` },

  { t: 'Đọc kết quả build', body: `
    ${code(`File sizes after gzip:
  87.75 kB  build/static/js/main.b5d7f1ac.js
  31.87 kB  build/static/css/main.1f2a2a82.css`, 'plaintext')}
    <div class="grid2">
      <div class="f"><b>Dưới ~150 kB JS</b><br/>Lành mạnh cho app nhỏ</div>
      <div class="f"><b>Trên ~500 kB</b><br/>Có thứ nặng lọt vào — thư viện ngày tháng, bộ icon import nguyên cụm</div>
    </div>
    <div class="box">Mã băm trong tên cho phép CDN lưu đệm file đó <b>vĩnh viễn</b>: cái tên chỉ trỏ tới đúng chuỗi byte ấy. Đổi một ký tự là tên đổi ⇒ trình duyệt tải bản mới ngay.</div>` },

  { t: `Biến môi trường — chỗ gây sự cố thật ${FH()}`, body: `
    <div class="two">
      <div class="card"><b>Frontend (lúc BUILD)</b><p><code>REACT_APP_*</code>, <code>VITE_*</code>, <code>NEXT_PUBLIC_*</code><br/><b>Nướng vào bundle.</b> Đi tới MỌI khách, đọc được bằng View Source.</p></div>
      <div class="card"><b>Backend (lúc CHẠY)</b><p>Đọc từ <code>process.env</code> trên máy chủ.<br/>Không bao giờ xuống trình duyệt. <b>Nơi duy nhất an toàn cho khoá.</b></p></div>
    </div>
    <div class="box warn">⛔ <code>REACT_APP_OPENAI_KEY</code> <b>không hề được giấu</b> — nó nằm trong chính đoạn JS bạn đưa cho mọi người. Cách đúng: một route backend nhỏ giữ khoá và chuyển tiếp yêu cầu. Đây là sự cố CÓ THẬT trên trang này.</div>` },

  { t: 'Đổi biến frontend thì phải DỰNG LẠI', body: `
    ${code(`# ❌ không có tác dụng — giá trị cũ đã biên dịch vào rồi
sửa .env  →  khởi động lại server

# ✅
sửa .env  →  npm run build  →  deploy lại`, 'bash')}
    <div class="box">Biến backend thì <b>ngược lại</b>: đọc lúc tiến trình khởi động, nên restart là đủ. Lẫn hai luật này sinh ra câu "em đổi cấu hình rồi mà không thấy gì đổi".</div>` },

  { t: 'Nếu lỡ lộ khoá', body: `
    <div class="steps">
      <div><span class="n">1</span><span><b>XOAY KHOÁ TRƯỚC.</b> Thu hồi khoá cũ, cấp khoá mới. Làm việc này trước mọi thứ khác — đồng hồ đang chạy.</span></div>
      <div><span class="n">2</span><span><b>RỒI mới dọn repo.</b> Xoá file trong commit mới là KHÔNG đủ; giá trị vẫn nằm trong lịch sử và trong mọi bản clone.</span></div>
      <div><span class="n">3</span><span>Thêm vào <code>.gitignore</code> để không lặp lại theo cùng một cách.</span></div>
    </div>
    <div class="box warn">Điểm 1 là chỗ người ta hay làm sai: bỏ cả tiếng viết lại lịch sử git trong khi khoá thật vẫn còn hiệu lực và đã bị quét mất từ lâu.</div>` },

  { t: 'Deploy — chọn thứ đơn giản nhất đủ dùng', body: `
    <div class="two">
      <div class="card"><b>Hosting tĩnh</b><p>Vercel · Netlify · Cloudflare Pages<br/>Cho mọi thứ build ra HTML/CSS/JS, kể cả React. <b>Bắt đầu từ đây.</b></p></div>
      <div class="card"><b>Có máy chủ</b><p>Railway · Render · Fly.io · VPS<br/>Cần khi đã có API Node, CSDL, việc chạy nền.</p></div>
    </div>
    ${code(`1. Đẩy mã lên GitHub
2. Nối repo trên Vercel/Netlify
3. Đặt lệnh build và thư mục kết quả
4. Thêm biến môi trường trong bảng điều khiển
5. Mỗi lần push lên main là tự build, tự deploy`, 'plaintext', 'sm')}
    <div class="box ok">Miễn phí kèm theo: URL xem thử cho MỖI pull request · lùi về bản cũ bằng một cú bấm · HTTPS tự động · CDN toàn cầu.</div>` },

  { t: `Bẫy 404 khi tải lại trang ${F()}`, body: `
    ${code(`/pizzas   → chạy khi BẤM link      (JavaScript tự điều hướng)
/pizzas   → 404 khi TẢI LẠI trang  (máy chủ đi tìm file /pizzas)`, 'plaintext')}
    ${code(`# netlify.toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200`, 'ini')}
    ${code(`# nginx
location / { try_files $uri $uri/ /index.html; }`, 'nginx', 'sm')}
    <div class="box">Ứng dụng một trang tự điều hướng bằng JS nên bấm link không hỏi máy chủ lấy một lần. Tải lại thì CÓ hỏi — và đường dẫn đó không phải file thật.</div>` },

  { t: 'Danh sách kiểm trước khi coi là xong', body: `
    ${code(`☐ Mở URL đã deploy trong cửa sổ ẩn danh
☐ Tải lại một đường dẫn sâu — bẫy 404 ở trên
☐ Thử trên điện thoại THẬT, không chỉ thu hẹp cửa sổ
☐ Xác nhận API trỏ vào production, không phải localhost
☐ Nhìn tab Network xem có dòng đỏ, 4xx/5xx không
☐ Kiểm HTTPS hiện ổ khoá, không phải "Not secure"`, 'plaintext')}
    <div class="box warn"><b>Build xanh không có nghĩa là app chạy.</b> Việc deploy hoàn tất khi bạn đã <i>mở URL thật và dùng thử</i>, không phải khi cái log chuyển xanh.</div>` },

  { t: 'Đo hiệu năng — Core Web Vitals', body: `
    <div class="grid3">
      <div class="card"><b>LCP</b><p>Nội dung chính hiện ra<br/>Nhắm &lt; 2,5s</p></div>
      <div class="card"><b>INP</b><p>Trang đáp lại cú bấm<br/>Nhắm &lt; 200ms</p></div>
      <div class="card"><b>CLS</b><p>Mọi thứ nhảy nhót khi tải<br/>Nhắm &lt; 0,1</p></div>
    </div>
    <div class="box ok"><b>Bắt đầu từ tab Network, sắp theo Size.</b> Dòng to nhất thường là toàn bộ vấn đề. Ví dụ CÓ THẬT trên trang này: trang danh sách khoá học tải <b>2,86 MB</b> JSON chỉ để vẽ lưới tên và ảnh — API trả về mọi chương của mọi khoá. Sắp theo Size tìm ra trong mười giây; ngồi đoán thì không.</div>` },

  { t: 'Bốn cách sửa đáng làm trước', body: `
    <table class="t big2">
      <tr><th>Cách</th><th>Vì sao lợi</th></tr>
      <tr><td><b>Gửi ít dữ liệu đi</b></td><td>Chỉ trả trường màn hình hiện. Rẻ nhất, lợi nhất — và là việc của BACKEND</td></tr>
      <tr><td><b>Chỉnh cỡ ảnh</b></td><td>Ảnh 4MB hiện ở 400px là 4MB ném đi. Đặt <code>width</code>/<code>height</code> để không nhảy (CLS)</td></tr>
      <tr><td><b>Tách gói JS</b></td><td><code>React.lazy</code> cho từng route — trang đầu thôi trả giá cho mã không dùng</td></tr>
      <tr><td><b>Lưu đệm thứ bất biến</b></td><td>File có mã băm lưu được cả năm. HTML thì tuyệt đối không</td></tr>
    </table>
    <div class="box warn">Đo trên máy mình thì mọi thứ đều nhanh. Bóp lại: <b>Network → Fast 3G</b> và <b>Performance → CPU chậm 4 lần</b>.</div>` },
];
