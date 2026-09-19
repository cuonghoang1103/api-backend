/** Web Foundations · Deck wf-think — Chương 10: Tư duy, gỡ lỗi & Git workflow. */
import { code, F } from './_wf-chung.mjs';

export const deck = { key: 'wf-think', code: 'WF · CH10', title: 'Tư duy & gỡ lỗi', sub: 'Nền tảng Lập trình Web · Chương 10' };

export const slides = [
  { kind: 'cover', t: 'Chương 10 — Tư duy, gỡ lỗi & quy trình Git', sub: 'Chia nhỏ vấn đề · Đọc lỗi · Branch & PR · Học tiếp thế nào',
    body: `<p class="cov-meta">Nền tảng Lập trình Web · cuongthai.com<br/>Chương này không dạy cú pháp mới — nó dạy cách làm việc</p>` },

  { t: 'Nội dung chương', body: `
    <ol class="toc">
      <li>Tư duy như một lập trình viên</li>
      <li>Đọc lỗi &amp; vòng lặp gỡ lỗi ⭐</li>
      <li>Quy trình Git cho công việc thật</li>
      <li>Cách tiếp tục học</li>
      <li>Bức tranh full-stack</li>
    </ol>` },

  { t: 'Chia nhỏ — kỹ năng quan trọng nhất', body: `
    <div class="box warn">❌ <b>"Làm trang giỏ hàng"</b> — quá lớn, không biết bắt đầu từ đâu, ngồi nhìn màn hình trắng.</div>
    <div class="steps">
      <div><span class="n">1</span><span>Hiện danh sách món <b>cứng</b> trong mã — chưa cần dữ liệu thật</span></div>
      <div><span class="n">2</span><span>Thêm nút "Thêm vào giỏ", mới chỉ <code>console.log</code></span></div>
      <div><span class="n">3</span><span>Giữ giỏ trong state, hiện <b>số lượng</b></span></div>
      <div><span class="n">4</span><span>Hiện danh sách món trong giỏ</span></div>
      <div><span class="n">5</span><span>Tính tổng tiền</span></div>
    </div>
    <div class="box ok">Mỗi bước <b>chạy được và thấy được</b>. Đó là điểm mấu chốt: bạn luôn có thứ đang hoạt động, nên sai ở đâu là biết ngay ở đó.</div>` },

  { t: 'Bốn bước trước khi gõ dòng nào', body: `
    <div class="grid2">
      <div class="f"><b>1. Đầu vào là gì?</b><br/>Dữ liệu nào có sẵn, kiểu gì</div>
      <div class="f"><b>2. Đầu ra mong muốn?</b><br/>Viết ra một ví dụ cụ thể</div>
      <div class="f"><b>3. Các bước trung gian?</b><br/>Viết bằng tiếng Việt trước, chưa cần mã</div>
      <div class="f"><b>4. Trường hợp biên?</b><br/>Mảng rỗng · null · số 0 · chuỗi rỗng</div>
    </div>
    <div class="box">Viết bốn dòng chú thích tiếng Việt rồi mới điền mã vào dưới từng dòng. Nghe thủ công, nhưng nó biến "không biết bắt đầu từ đâu" thành bốn việc nhỏ.</div>` },

  { t: `Đọc thông báo lỗi — từ trên xuống ${F()}`, body: `
    ${code(`TypeError: Cannot read properties of undefined (reading 'ten')
    at PizzaCard (PizzaCard.js:12:24)
    at renderWithHooks (react-dom.development.js:15486:18)`, 'plaintext')}
    <div class="steps">
      <div><span class="n">1</span><span><b>Loại lỗi</b>: <code>TypeError</code> — sai kiểu, không phải sai cú pháp</span></div>
      <div><span class="n">2</span><span><b>Nội dung</b>: đọc <code>.ten</code> của một thứ <code>undefined</code></span></div>
      <div><span class="n">3</span><span><b>Dòng đầu tiên thuộc VỀ MÃ CỦA BẠN</b>: <code>PizzaCard.js:12</code> ← đi tới đây</span></div>
      <div><span class="n">4</span><span>Bỏ qua các dòng trong <code>node_modules</code> / <code>react-dom</code> — đó là ruột thư viện</span></div>
    </div>
    <div class="box ok">Lỗi này gần như luôn có nghĩa: dữ liệu <b>chưa về</b> lúc component vẽ lần đầu. Chữa bằng <code>pizza?.ten</code> hoặc kiểm <code>if (!pizza) return null</code>.</div>` },

  { t: 'Vòng lặp gỡ lỗi — năm bước', body: `
    <div class="steps">
      <div><span class="n">1</span><span><b>Tái hiện được</b>. Lỗi lúc có lúc không thì chưa gỡ được — tìm cách làm nó xảy ra mỗi lần trước đã.</span></div>
      <div><span class="n">2</span><span><b>Đoán một giả thuyết</b>, nói thành lời: <i>"tôi nghĩ mảng đang rỗng lúc render đầu"</i>.</span></div>
      <div><span class="n">3</span><span><b>Kiểm giả thuyết đó</b> bằng một phép đo — <code>console.log</code> đúng chỗ, hoặc đặt breakpoint.</span></div>
      <div><span class="n">4</span><span><b>Đổi MỘT thứ</b> rồi thử lại. Đổi ba thứ cùng lúc thì không biết cái nào có tác dụng.</span></div>
      <div><span class="n">5</span><span><b>Sai thì quay lại bước 2</b> với giả thuyết mới.</span></div>
    </div>
    <div class="box warn">Cái bẫy lớn nhất: sửa đại nhiều chỗ cho tới khi hết lỗi, rồi không biết vì sao nó hết. Lần sau gặp lại vẫn phải mò từ đầu.</div>` },

  { t: 'console.log cho ra thông tin, không phải tiếng ồn', body: `
    ${code(`console.log(data);                    // ❌ hiện lên rồi không biết của ai
console.log('pizzas sau khi loc:', data);  // ✅ có nhãn

console.table(pizzas);          // mảng object → hiện thành bảng, rất dễ đọc
console.log({ keyword, loai, soKetQua: shown.length });  // gom nhiều biến

console.error('...')  console.warn('...')   // đỏ và vàng, dễ tìm lại`, 'javascript', 'sm')}
    <div class="box">Đặt log ở <b>hai đầu</b> chỗ nghi ngờ: ngay trước và ngay sau. Nếu vào đúng mà ra sai thì lỗi nằm gọn ở giữa — bạn vừa thu hẹp phạm vi tìm kiếm một nửa.</div>` },

  { t: 'Rubber duck — nói thành lời', body: `
    <p class="lead2">Giải thích bài toán <b>thành tiếng</b> cho một con vịt nhựa, cho bạn cùng lớp, hoặc cho chính mình.</p>
    <div class="box ok">Nghe buồn cười nhưng nó hiệu quả thật, vì nói ra buộc bạn phải <b>tuần tự hoá</b> mớ suy nghĩ đang rối. Rất thường xuyên, bạn tự phát hiện chỗ sai ở giữa câu — trước cả khi người nghe kịp đáp.</div>
    <div class="two">
      <div class="card"><b>Khi hỏi người khác</b><p>Nói rõ: mình muốn gì · đã thử gì · lỗi nói gì. Ba câu đó giúp người ta trả lời trúng ngay.</p></div>
      <div class="card"><b>Khi hỏi AI</b><p>Dán nguyên dòng lỗi, đừng kể lại bằng lời. Và nói rõ mình hiểu tới đâu.</p></div>
    </div>` },

  { t: 'Quy trình Git thật', body: `
    ${code(`git checkout -b feature/gio-hang   # tạo nhánh cho MỘT việc
# ... làm việc, commit nhiều lần ...
git push -u origin feature/gio-hang
# → mở Pull Request trên GitHub, người khác review, rồi merge vào main`, 'bash')}
    <div class="steps">
      <div><span class="n">1</span><span><b>Một nhánh = một việc.</b> Dễ review, dễ bỏ nếu hướng đi sai.</span></div>
      <div><span class="n">2</span><span><b>main luôn chạy được.</b> Không đẩy thẳng thứ chưa xong lên main.</span></div>
      <div><span class="n">3</span><span><b>Commit nhỏ, lời nhắn rõ.</b> "sửa lỗi" không nói gì; "sửa giỏ hàng tính sai tổng khi xoá món" nói đủ.</span></div>
    </div>` },

  { t: 'Viết lời nhắn commit', body: `
    ${code(`# ❌ vô dụng
fix
update
asdasd

# ✅ nói được: sửa CÁI GÌ, và nếu cần thì VÌ SAO
fix(gio-hang): tong tien sai khi xoa mon cuoi cung
feat(tim-kiem): loc pizza theo ten, khong phan biet hoa thuong
docs: them huong dan cai dat cho Windows`, 'bash')}
    <div class="box">Thử đọc lời nhắn của mình sau <b>ba tháng</b>. Nếu lúc đó không hiểu mình đã làm gì thì lời nhắn đó chưa đạt.</div>` },

  { t: 'Bức tranh full-stack', body: `
    <div class="dg">
      <div class="bx">React<br/><small>trình duyệt</small></div>
      <div class="ar">→<small>HTTP / JSON</small></div>
      <div class="bx ext">Node API<br/><small>máy chủ</small></div>
      <div class="ar">→<small>SQL</small></div>
      <div class="store">Cơ sở dữ liệu</div>
    </div>
    <table class="t">
      <tr><th>Tầng</th><th>Chương đã học</th></tr>
      <tr><td>Giao diện</td><td>2 (HTML) · 3 (CSS) · 4 (JS) · 5 (bất đồng bộ)</td></tr>
      <tr><td>Đường truyền</td><td>6 (HTTP &amp; API) · 7 (xác thực)</td></tr>
      <tr><td>Dữ liệu</td><td>8 (SQL &amp; ORM)</td></tr>
      <tr><td>Chất lượng mã</td><td>9 (TypeScript) · 10 (tư duy &amp; Git)</td></tr>
    </table>` },

  { t: 'Học tiếp gì sau khoá này', body: `
    <div class="steps">
      <div><span class="n">1</span><span><b>React</b> — <i>react.dev → Learn React</i>. Đây là môn <b>FER202</b> của bạn.</span></div>
      <div><span class="n">2</span><span><b>Node.js + Express</b> — tự viết API mà React của bạn gọi tới.</span></div>
      <div><span class="n">3</span><span><b>Một dự án thật của riêng bạn.</b> Không phải bài tập — thứ bạn muốn dùng.</span></div>
      <div><span class="n">4</span><span><b>Đưa nó lên mạng.</b> Vercel hoặc Netlify miễn phí. Có link để khoe là động lực rất khác.</span></div>
    </div>
    <div class="box ok">Mẹo cuối: <b>làm xong thứ nhỏ còn hơn bỏ dở thứ lớn</b>. Một trang danh sách việc cần làm chạy được đáng giá hơn một mạng xã hội bỏ dở ở tuần thứ hai.</div>` },
];
