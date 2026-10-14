/** Bộ luyện bài 2.4 — Biểu mẫu. Lược đồ: ./_luoc-do.mjs */
import { c, code } from './_luoc-do.mjs';

const KHUNG = (title, body) => `
<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title}</title>
  </head>
  <body>
${body}
  </body>
</html>
`;

export default {
  slug: 'wf-2-4-forms',
  ten: '2.4 Biểu mẫu: cách web thu thập dữ liệu',
  baiHoc: 'Nền tảng Web — Bài 2.4 Biểu mẫu: cách web thu thập dữ liệu',
  ngonNgu: 'html',
  level: 'BEGINNER',
  moTa: 'form action/method, label + input, name, các type input, textarea/select, kiểm tra sẵn của trình duyệt (required, minlength, min/max, pattern) — 7 bài từ dễ đến khó.',
  de: [
    /* ───────────────────────────── 1 · EASY ───────────────────────────── */
    {
      tieuDe: 'label for + input id: ghép đôi từng ô với nhãn của nó',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['label', 'for', 'id', 'vùng bấm', 'trình đọc màn hình đọc tên ô'],
      tienQuyet: ['thuộc tính id'],
      the: ['html', 'forms', 'label', 'a11y'],
      moTa: `<p>Bài 2.4: <em>"Thuộc tính ${c('for')} của một ${c('<label>')} phải khớp với ${c('id')} của ô input. Khi đó bấm vào nhãn sẽ đưa con trỏ vào ô, và trình đọc màn hình đọc tên ô."</em> Form liên hệ dưới đây có nhãn nhưng chẳng nhãn nào nối với ô của nó: cái thì thiếu ${c('for')}, cái thì ${c('for')} gõ sai, cái thì ô thiếu ${c('id')}. Sửa cho cả ba cặp khớp nhau.</p>`,
      yeuCau: [
        `Nhãn "Họ và tên" nối với ô ${c('id="ho-ten"')}.`,
        `Nhãn "Email" nối với ô ${c('id="email"')}.`,
        `Nhãn "Lời nhắn" nối với ${c('<textarea id="loi-nhan">')}.`,
        `Mọi ô nhập (input, textarea) đều có nhãn.`,
      ],
      dauVao: 'Form 3 ô: một nhãn thiếu for, một for gõ sai, một ô thiếu id.',
      dauRa: 'Bấm vào chữ "Email" ⇒ con trỏ nhảy vào ô email. Trình đọc màn hình đọc "Email, ô nhập".',
      rangBuoc: [
        'Mỗi id duy nhất trong trang.',
        'Không bỏ nhãn ra ngoài để "dùng placeholder thay" (placeholder không phải nhãn — bài 2.5).',
      ],
      viDu: [{
        input: '<label>Email</label>\n<input type="email" id="email" name="email">',
        output: 'Bấm chữ "Email": không có gì xảy ra. Trình đọc: "ô nhập" (không tên).',
        explanation: 'Nhãn và ô chỉ nằm cạnh nhau trên màn hình; với trình duyệt chúng không liên quan.',
      }, {
        input: '<label for="email">Email</label>\n<input type="email" id="email" name="email">',
        output: 'Bấm chữ "Email": con trỏ vào ô. Trình đọc: "Email, ô nhập".',
        explanation: 'for="email" trỏ tới id="email" — ghép đôi xong.',
      }],
      goiY: [
        'Với mỗi cặp, đọc id của ô rồi chép y nguyên vào for của nhãn (không chép tên name!).',
        'Ô "Lời nhắn" thiếu id: thêm id="loi-nhan" vào <textarea> và for="loi-nhan" vào nhãn.',
      ],
      khoiDau: {
        'index.html': KHUNG('Liên hệ', `    <h1>Liên hệ</h1>
    <form action="/lien-he" method="post">
      <label>Họ và tên</label>
      <input type="text" id="ho-ten" name="hoTen">

      <label for="e-mail">Email</label>
      <input type="email" id="email" name="email">

      <label for="loi-nhan">Lời nhắn</label>
      <textarea name="loiNhan" rows="4"></textarea>

      <button type="submit">Gửi</button>
    </form>`),
      },
      loiGiai: {
        'index.html': KHUNG('Liên hệ', `    <h1>Liên hệ</h1>
    <form action="/lien-he" method="post">
      <!-- for = id của ô (không phải name) -->
      <label for="ho-ten">Họ và tên</label>
      <input type="text" id="ho-ten" name="hoTen">

      <!-- for phải khớp từng ký tự: "e-mail" ≠ "email" -->
      <label for="email">Email</label>
      <input type="email" id="email" name="email">

      <!-- textarea cũng cần id để nhãn trỏ tới -->
      <label for="loi-nhan">Lời nhắn</label>
      <textarea id="loi-nhan" name="loiNhan" rows="4"></textarea>

      <button type="submit">Gửi</button>
    </form>`),
      },
      giaiThich: `<p>${c('for')} và ${c('id')} là một con trỏ: nhãn nói "tôi là tên của phần tử có id này". Sai một ký tự là con trỏ chỉ vào hư không, và không có lỗi nào hiện ra — đó là lý do máy chấm dùng kiểm ${c('co-nhan')}: với mỗi ô, trình duyệt có tìm được nhãn của nó không (${c('input.labels')}).</p>
<p>Lợi ích không chỉ cho trình đọc màn hình: nhãn bấm được mở rộng vùng chạm trên điện thoại — đặc biệt quan trọng với checkbox và radio bé xíu ở bài sau. Bài 2.4 gọi đây là "một trong những thói quen tiếp cận đáng giá nhất".</p>`,
      loiHayGap: [
        `Viết ${c('for')} bằng giá trị ${c('name')} (${c('for="hoTen"')}) — for trỏ tới id, không phải name.`,
        `Hai ô cùng ${c('id')} — nhãn chỉ nối với ô đầu.`,
        `Bọc ô trong nhãn (${c('<label>Email <input …></label>')}) cũng đúng; nhưng đề này yêu cầu dùng for/id để luyện ghép đôi.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label',
      kiem: [
        { moTa: 'Mọi input (trừ nút) và textarea đều có nhãn', kiem: 'co-nhan', selector: 'input:not([type="submit"]):not([type="button"]), textarea' },
        { moTa: 'label[for="ho-ten"] nối với ô Họ và tên', kiem: 'text', selector: 'label[for="ho-ten"]', giaTri: 'Họ và tên' },
        { moTa: 'label[for="email"] nối với ô email', kiem: 'ton-tai', selector: 'label[for="email"]' },
        { moTa: 'textarea có id="loi-nhan"', kiem: 'ton-tai', selector: 'textarea#loi-nhan' },
        { moTa: 'Mọi label đều có for trỏ tới id có thật', kiem: 'khong-ton-tai', selector: 'label:not([for])' },
        { moTa: 'Không còn for gõ sai "e-mail"', kiem: 'khong-ton-tai', selector: 'label[for="e-mail"]' },
      ],
    },

    /* ───────────────────────────── 2 · EASY ───────────────────────────── */
    {
      tieuDe: 'Không có name thì không được gửi: hoàn thiện action, method và name',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['form action', 'method post', 'name', 'dữ liệu gửi đi'],
      tienQuyet: ['label + input'],
      the: ['html', 'forms', 'name', 'submit'],
      moTa: `<p>Bài 2.4: <em>"Chỉ những trường có thuộc tính ${c('name')} mới được đưa vào. Một trường thiếu nó là vô hình với phép gửi — một lỗi lặng lẽ và rất phổ biến."</em> Backend của form đăng ký mong nhận ba khoá ${c('email')}, ${c('password')}, ${c('hoTen')} ở route ${c('POST /signup')}. Form hiện tại thiếu name, thiếu action và để method mặc định. Hoàn thiện nó.</p>`,
      yeuCau: [
        `${c('<form>')} có ${c('action="/signup"')} và ${c('method="post"')}.`,
        `Ô email có ${c('name="email"')}, ô mật khẩu ${c('name="password"')}, ô họ tên ${c('name="hoTen"')}.`,
        `Nút gửi là ${c('<button type="submit">')}.`,
        `Giữ nguyên label/id đã có.`,
      ],
      dauVao: 'Form 3 ô, có label/id nhưng không có name, form không có action/method.',
      dauRa: 'Bấm "Tạo tài khoản" ⇒ trình duyệt gửi POST /signup với thân: email=…&password=…&hoTen=…',
      rangBuoc: [
        'Giá trị name đúng từng chữ (phân biệt hoa thường): hoTen, không phải hoten.',
        'Mật khẩu phải đi bằng POST (không bao giờ nằm trên URL).',
      ],
      viDu: [{
        input: '<form>\n  <input id="email" type="email">\n  <button>Gửi</button>\n</form>',
        output: 'Bấm Gửi ⇒ GET tới chính trang này, URL thêm "?" và… không có gì. Backend nhận được rỗng.',
        explanation: 'Không name ⇒ không gửi; không action ⇒ gửi về trang hiện tại; không method ⇒ GET.',
      }],
      goiY: [
        'Ba thứ quyết định một lần gửi: action (gửi đi đâu), method (gửi kiểu gì), name (mỗi giá trị mang khoá gì).',
        '<form action="/signup" method="post"> … <input type="email" id="email" name="email" …> … <button type="submit">Tạo tài khoản</button>.',
      ],
      khoiDau: {
        'index.html': KHUNG('Đăng ký', `    <h1>Tạo tài khoản</h1>
    <form>
      <label for="ho-ten">Họ và tên</label>
      <input type="text" id="ho-ten">

      <label for="email">Email</label>
      <input type="email" id="email">

      <label for="pw">Mật khẩu</label>
      <input type="password" id="pw">

      <button>Tạo tài khoản</button>
    </form>`),
      },
      loiGiai: {
        'index.html': KHUNG('Đăng ký', `    <h1>Tạo tài khoản</h1>
    <!-- action: gửi tới route nào; method post: dữ liệu đi trong THÂN request -->
    <form action="/signup" method="post">
      <label for="ho-ten">Họ và tên</label>
      <!-- name = khoá mà backend đọc: req.body.hoTen -->
      <input type="text" id="ho-ten" name="hoTen">

      <label for="email">Email</label>
      <input type="email" id="email" name="email">

      <label for="pw">Mật khẩu</label>
      <!-- id (cho label) và name (cho backend) là hai việc khác nhau -->
      <input type="password" id="pw" name="password">

      <!-- type="submit": rõ ràng là nút gửi form -->
      <button type="submit">Tạo tài khoản</button>
    </form>`),
      },
      giaiThich: `<p>${c('id')} và ${c('name')} hay bị nhầm vì thường cùng giá trị, nhưng phục vụ hai người khác nhau: id cho trình duyệt (nhãn, CSS, JS), name cho máy chủ (khoá trong dữ liệu gửi đi). Ô mật khẩu ở đây cố ý dùng ${c('id="pw"')} và ${c('name="password"')} để thấy chúng độc lập.</p>
<p>Không có ${c('method')}, form mặc định là GET — mật khẩu sẽ nằm trên URL (${c('/signup?password=123456')}), lưu lại trong lịch sử trình duyệt và log máy chủ. Máy chấm kiểm action/method, từng name, và nút submit.</p>`,
      loiHayGap: [
        `Thêm ${c('name')} cho hai ô, quên ô thứ ba — form vẫn gửi, backend báo "thiếu họ tên" mà trang không có lỗi nào.`,
        `Viết ${c('method="POST"')} — vẫn đúng (không phân biệt hoa thường); viết ${c('method="put"')} thì form HTML không hỗ trợ, trình duyệt quay về GET.`,
        `Đặt ${c('name')} lên ${c('<label>')} — label không được gửi đi.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Learn/Forms/Sending_and_retrieving_form_data',
      kiem: [
        { moTa: 'form có action="/signup"', kiem: 'thuoc-tinh', selector: 'form', thuocTinh: 'action', giaTri: '/signup' },
        { moTa: 'form có method="post"', kiem: 'thuoc-tinh', selector: 'form', thuocTinh: 'method', khop: '^post$' },
        { moTa: 'Ô email có name="email"', kiem: 'ton-tai', selector: 'input#email[name="email"]' },
        { moTa: 'Ô mật khẩu có name="password"', kiem: 'ton-tai', selector: 'input#pw[type="password"][name="password"]' },
        { moTa: 'Ô họ tên có name="hoTen"', kiem: 'ton-tai', selector: 'input#ho-ten[name="hoTen"]' },
        { moTa: 'Mọi ô nhập đều có name', kiem: 'khong-ton-tai', selector: 'form input:not([name])' },
        { moTa: 'Nút gửi là button type="submit"', kiem: 'ton-tai', selector: 'form button[type="submit"]' },
      ],
    },

    /* ───────────────────────────── 3 · EASY ───────────────────────────── */
    {
      tieuDe: 'Chọn đúng type cho từng ô: email, password, number, date, tel, url',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['input type', 'bàn phím trên điện thoại', 'kiểm tra định dạng sẵn', 'che mật khẩu'],
      tienQuyet: ['label + input'],
      the: ['html', 'forms', 'input-types'],
      moTa: `<p>Bài 2.4 có bảng "các type input bạn dùng nhiều nhất". Form hồ sơ dưới đây để mọi ô là ${c('type="text"')}: mật khẩu hiện rõ, điện thoại bật bàn phím chữ khi nhập số điện thoại, email sai định dạng vẫn gửi được. Đổi ${c('type')} cho đúng từng ô.</p>`,
      yeuCau: [
        `Email ⇒ ${c('type="email"')}; mật khẩu ⇒ ${c('type="password"')}.`,
        `Tuổi ⇒ ${c('type="number"')}; ngày sinh ⇒ ${c('type="date"')}.`,
        `Số điện thoại ⇒ ${c('type="tel"')}; trang cá nhân ⇒ ${c('type="url"')}.`,
        `Không đổi id, name, label.`,
      ],
      dauVao: 'Form 6 ô, tất cả type="text".',
      dauRa: 'Mật khẩu hiện chấm tròn, điện thoại bật bàn phím số/email/URL, email "abc" bị chặn khi gửi.',
      rangBuoc: [
        'Chỉ sửa thuộc tính type.',
      ],
      viDu: [{
        input: '<input type="email" id="email" name="email">\n(người dùng gõ: abc)',
        output: 'Bấm Gửi ⇒ trình duyệt hiện bong bóng "Vui lòng nhập địa chỉ email" và KHÔNG gửi.',
        explanation: 'type="email" vừa đổi bàn phím trên điện thoại (có phím @) vừa kiểm định dạng — không cần JavaScript.',
      }],
      goiY: [
        'Đọc nhãn từng ô và tra bảng của bài 2.4: text/email/password, number/date/tel/url.',
        'Lưu ý: số điện thoại dùng tel, không dùng number (số 0 đầu và dấu + sẽ hỏng với number).',
      ],
      khoiDau: {
        'index.html': KHUNG('Hồ sơ', `    <h1>Cập nhật hồ sơ</h1>
    <form action="/ho-so" method="post">
      <label for="email">Email</label>
      <input type="text" id="email" name="email">
      <label for="pw">Mật khẩu</label>
      <input type="text" id="pw" name="password">
      <label for="tuoi">Tuổi</label>
      <input type="text" id="tuoi" name="tuoi">
      <label for="ngay-sinh">Ngày sinh</label>
      <input type="text" id="ngay-sinh" name="ngaySinh">
      <label for="dien-thoai">Số điện thoại</label>
      <input type="text" id="dien-thoai" name="dienThoai">
      <label for="trang">Trang cá nhân</label>
      <input type="text" id="trang" name="trang">
      <button type="submit">Lưu</button>
    </form>`),
      },
      loiGiai: {
        'index.html': KHUNG('Hồ sơ', `    <h1>Cập nhật hồ sơ</h1>
    <form action="/ho-so" method="post">
      <label for="email">Email</label>
      <!-- email: bàn phím có @, kiểm định dạng x@y -->
      <input type="email" id="email" name="email">
      <label for="pw">Mật khẩu</label>
      <!-- password: che ký tự -->
      <input type="password" id="pw" name="password">
      <label for="tuoi">Tuổi</label>
      <!-- number: bàn phím số, nút tăng/giảm, chỉ nhận số -->
      <input type="number" id="tuoi" name="tuoi">
      <label for="ngay-sinh">Ngày sinh</label>
      <!-- date: bộ chọn lịch, gửi đi dạng YYYY-MM-DD -->
      <input type="date" id="ngay-sinh" name="ngaySinh">
      <label for="dien-thoai">Số điện thoại</label>
      <!-- tel (không phải number): giữ số 0 đầu và dấu +84 -->
      <input type="tel" id="dien-thoai" name="dienThoai">
      <label for="trang">Trang cá nhân</label>
      <!-- url: kiểm có giao thức https:// -->
      <input type="url" id="trang" name="trang">
      <button type="submit">Lưu</button>
    </form>`),
      },
      giaiThich: `<p>Một thuộc tính ${c('type')} cho ba thứ miễn phí: bàn phím đúng trên điện thoại, giao diện chọn phù hợp (lịch cho date), và kiểm tra định dạng trước khi gửi. Máy chấm kiểm từng type và thử thật: gán "abc" vào ô email thì ${c('checkValidity()')} phải trả ${c('false')}, gán "minh@vidu.com" thì ${c('true')}.</p>
<p>${c('tel')} không kiểm định dạng (số điện thoại mỗi nước một kiểu) — nó chỉ đổi bàn phím. Đó là lý do không dùng ${c('number')} cho số điện thoại: "0912…" thành 912…, "+84" không gõ được, và nút tăng/giảm vô nghĩa.</p>`,
      loiHayGap: [
        `Dùng ${c('type="number"')} cho số điện thoại hay mã sinh viên — mất số 0 đầu.`,
        `Nghĩ ${c('type="email"')} là đủ an toàn — người dùng tắt được trong DevTools; máy chủ vẫn phải kiểm (bài 2.4).`,
        `Dùng ${c('type="text"')} + chú thích "dd/mm/yyyy" cho ngày — mỗi người gõ một kiểu; ${c('date')} gửi đi chuẩn YYYY-MM-DD.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types',
      kiem: [
        { moTa: 'Email là type="email"', kiem: 'thuoc-tinh', selector: '#email', thuocTinh: 'type', giaTri: 'email' },
        { moTa: 'Mật khẩu là type="password"', kiem: 'thuoc-tinh', selector: '#pw', thuocTinh: 'type', giaTri: 'password' },
        { moTa: 'Tuổi là type="number"', kiem: 'thuoc-tinh', selector: '#tuoi', thuocTinh: 'type', giaTri: 'number' },
        { moTa: 'Ngày sinh là type="date"', kiem: 'thuoc-tinh', selector: '#ngay-sinh', thuocTinh: 'type', giaTri: 'date' },
        { moTa: 'Điện thoại là type="tel"', kiem: 'thuoc-tinh', selector: '#dien-thoai', thuocTinh: 'type', giaTri: 'tel' },
        { moTa: 'Trang cá nhân là type="url"', kiem: 'thuoc-tinh', selector: '#trang', thuocTinh: 'type', giaTri: 'url' },
        { moTa: 'Gõ "abc" vào email ⇒ trình duyệt báo không hợp lệ', kiem: 'hop-le', selector: '#email', dien: { '#email': 'abc' }, giaTri: false },
        { moTa: 'Gõ "minh@vidu.com" ⇒ hợp lệ', kiem: 'hop-le', selector: '#email', dien: { '#email': 'minh@vidu.com' }, giaTri: true },
        { moTa: 'Gõ "cuongthai.com" (thiếu https://) vào ô url ⇒ không hợp lệ', kiem: 'hop-le', selector: '#trang', dien: { '#trang': 'cuongthai.com' }, giaTri: false },
      ],
    },

    /* ──────────────────────────── 4 · MEDIUM ──────────────────────────── */
    {
      tieuDe: 'Form đăng ký tự kiểm tra: required, minlength, min/max và pattern',
      doKho: 'MEDIUM', phut: 20,
      khaiNiem: ['required', 'minlength', 'min / max', 'pattern', 'checkValidity', 'kiểm phía client ≠ bảo mật'],
      tienQuyet: ['name', 'type'],
      the: ['html', 'forms', 'validation'],
      moTa: `<p>Bài 2.4: <em>"Các thuộc tính như ${c('required')}, ${c('minlength')}, ${c('maxlength')}, ${c('min')}, ${c('max')}, ${c('pattern')} và ${c('type="email"')} khiến trình duyệt kiểm tra dữ liệu trước khi gửi đi — không cần JavaScript."</em> Form đăng ký thành viên câu lạc bộ có đủ ô nhưng chưa có luật nào. Thêm luật theo đặc tả của ban chủ nhiệm.</p>
${code(`
Ô              Luật
Email          bắt buộc, đúng định dạng email
Mật khẩu       bắt buộc, ít nhất 8 ký tự
Mã sinh viên   bắt buộc, dạng 2 chữ in hoa + 6 chữ số   (vd HE180311)
Năm học        số từ 1 đến 5
`)}`,
      yeuCau: [
        `Email: ${c('type="email"')} + ${c('required')}.`,
        `Mật khẩu: ${c('required')} + ${c('minlength="8"')}.`,
        `Mã sinh viên: ${c('required')} + ${c('pattern="[A-Z]{2}[0-9]{6}"')}.`,
        `Năm học: ${c('type="number"')}, ${c('min="1"')}, ${c('max="5"')}.`,
        `Form chỉ hợp lệ khi mọi luật đều thoả.`,
      ],
      dauVao: 'Form 4 ô có label/name, chưa có luật kiểm tra.',
      dauRa: 'Bấm "Đăng ký" với dữ liệu sai ⇒ trình duyệt chặn và chỉ ra ô sai; dữ liệu đúng ⇒ gửi đi.',
      rangBuoc: [
        'Không dùng JavaScript.',
        'pattern phải khớp TRỌN giá trị (trình duyệt tự thêm ^…$).',
        'Ghi nhớ: đây là tiện lợi, không phải bảo mật — backend vẫn kiểm lại.',
      ],
      viDu: [{
        input: 'Mã sinh viên: he180311',
        output: 'Không hợp lệ — "Vui lòng khớp với định dạng được yêu cầu".',
        explanation: '[A-Z] chỉ nhận chữ IN HOA.',
      }, {
        input: 'Email: lan@vidu.com · Mật khẩu: matkhau123 · Mã: HE180311 · Năm: 2',
        output: 'Hợp lệ — form được gửi.',
        explanation: 'Mọi luật đều thoả.',
      }],
      goiY: [
        'Mỗi luật là một thuộc tính gắn thẳng vào ô — không có thuộc tính nào trên <form>.',
        'pattern dùng cú pháp biểu thức chính quy: [A-Z]{2} = đúng 2 chữ in hoa, [0-9]{6} = đúng 6 chữ số.',
      ],
      khoiDau: {
        'index.html': KHUNG('Đăng ký CLB', `    <h1>Đăng ký thành viên</h1>
    <form action="/clb/dang-ky" method="post">
      <label for="email">Email</label>
      <input type="text" id="email" name="email">

      <label for="pw">Mật khẩu</label>
      <input type="password" id="pw" name="password">

      <label for="mssv">Mã sinh viên</label>
      <input type="text" id="mssv" name="mssv">

      <label for="nam">Năm học</label>
      <input type="text" id="nam" name="namHoc">

      <button type="submit">Đăng ký</button>
    </form>`),
      },
      loiGiai: {
        'index.html': KHUNG('Đăng ký CLB', `    <h1>Đăng ký thành viên</h1>
    <!-- luật kiểm tra nằm trên TỪNG Ô; trình duyệt chặn gửi khi có ô sai -->
    <form action="/clb/dang-ky" method="post">
      <label for="email">Email</label>
      <!-- bắt buộc + đúng định dạng email -->
      <input type="email" id="email" name="email" required>

      <label for="pw">Mật khẩu</label>
      <!-- bắt buộc + tối thiểu 8 ký tự -->
      <input type="password" id="pw" name="password" required minlength="8">

      <label for="mssv">Mã sinh viên</label>
      <!-- pattern khớp TRỌN giá trị: 2 chữ in hoa rồi 6 chữ số -->
      <input type="text" id="mssv" name="mssv" required pattern="[A-Z]{2}[0-9]{6}">

      <label for="nam">Năm học</label>
      <!-- số trong khoảng 1..5 (để trống thì được vì không required) -->
      <input type="number" id="nam" name="namHoc" min="1" max="5">

      <button type="submit">Đăng ký</button>
    </form>`),
      },
      giaiThich: `<p>Mỗi thuộc tính là một luật độc lập, và trình duyệt gộp lại: form hợp lệ khi mọi ô hợp lệ. Máy chấm thử 6 kịch bản thật bằng ${c('checkValidity()')}: form trống (sai vì required), mã viết thường (sai pattern), năm học 7 (vượt max), email sai, dữ liệu đúng hết (hợp lệ).</p>
<p>${c('minlength')} được kiểm bằng thuộc tính thay vì thử: theo đặc tả, trình duyệt chỉ kiểm độ dài với giá trị <em>người dùng tự gõ</em> — gán bằng mã thì luật này không kích hoạt. Và như bẫy cuối bài 2.4: tất cả các luật này tắt được bằng hai cú bấm trong DevTools; chúng giúp người dùng ngay thẳng gõ đúng, còn backend Node.js vẫn phải kiểm lại từng giá trị.</p>`,
      loiHayGap: [
        `Viết ${c('pattern="^[A-Z]{2}[0-9]{6}$"')} — vẫn chạy, nhưng thừa: trình duyệt tự neo đầu–cuối.`,
        `Viết ${c('pattern="[A-Z]{2}\\d{6}"')} trong một số công cụ cũ — ${c('\\d')} chạy được ở trình duyệt hiện đại, nhưng ${c('[0-9]')} rõ nghĩa hơn với người mới.`,
        `Để Năm học ${c('type="text"')} rồi thêm min/max — min/max chỉ có tác dụng với number/date/range.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation',
      kiem: [
        { moTa: 'Email là type="email" và required', kiem: 'ton-tai', selector: '#email[type="email"][required]' },
        { moTa: 'Mật khẩu required, minlength="8"', kiem: 'ton-tai', selector: '#pw[required][minlength="8"]' },
        { moTa: 'Mã sinh viên required và có pattern', kiem: 'ton-tai', selector: '#mssv[required][pattern]' },
        { moTa: 'Năm học là number, min=1, max=5', kiem: 'ton-tai', selector: '#nam[type="number"][min="1"][max="5"]' },
        { moTa: 'Form trống ⇒ không hợp lệ', kiem: 'hop-le', selector: 'form', giaTri: false },
        { moTa: 'Dữ liệu đúng hết ⇒ hợp lệ', kiem: 'hop-le', selector: 'form', dien: { '#email': 'lan@vidu.com', '#pw': 'matkhau123', '#mssv': 'HE180311', '#nam': '2' }, giaTri: true },
        { moTa: 'Mã "he180311" (chữ thường) ⇒ không hợp lệ', kiem: 'hop-le', selector: '#mssv', dien: { '#mssv': 'he180311' }, giaTri: false },
        { moTa: 'Mã "HE18031" (thiếu số) ⇒ không hợp lệ', kiem: 'hop-le', selector: '#mssv', dien: { '#mssv': 'HE18031' }, giaTri: false },
        { moTa: 'Năm học 7 ⇒ không hợp lệ', kiem: 'hop-le', selector: '#nam', dien: { '#nam': '7' }, giaTri: false },
        { moTa: 'Email "lan@" ⇒ không hợp lệ', kiem: 'hop-le', selector: '#email', dien: { '#email': 'lan@' }, giaTri: false, an: true },
      ],
    },

    /* ──────────────────────────── 5 · MEDIUM ──────────────────────────── */
    {
      tieuDe: 'Phiếu khảo sát: radio cùng name, checkbox, select và textarea',
      doKho: 'MEDIUM', phut: 20,
      khaiNiem: ['radio dùng chung name', 'value', 'checkbox', 'select / option', 'textarea', 'required trên nhóm radio'],
      tienQuyet: ['label + input', 'name'],
      the: ['html', 'forms', 'radio', 'checkbox', 'select'],
      moTa: `<p>Bài 2.4: <em>"checkbox / radio — nhiều lựa chọn (checkbox) vs chọn đúng một (radio, dùng chung một name)."</em> Phiếu khảo sát cuối khoá cần bốn câu hỏi. Mỗi câu chọn đúng loại điều khiển, và mỗi lựa chọn mang ${c('value')} riêng để máy chủ biết người dùng chọn gì (radio không có value thì gửi đi chữ "on" — vô nghĩa).</p>
${code(`
1. Mức độ hài lòng (chọn MỘT, bắt buộc):   Chưa tốt | Ổn | Rất tốt        → muc-do = chua-tot | on | rat-tot
2. Phần thích nhất (chọn NHIỀU):           HTML | CSS | JavaScript         → thich = html | css | js
3. Bạn học ở đâu (danh sách xổ):           Hà Nội | Đà Nẵng | TP.HCM        → co-so = hn | dn | hcm
4. Góp ý (nhiều dòng, 4 dòng)                                               → gop-y
`)}`,
      yeuCau: [
        `Câu 1: ba ${c('<input type="radio">')} cùng ${c('name="muc-do"')}, value như bảng, ô đầu có ${c('required')} (một radio required là cả nhóm bắt buộc).`,
        `Câu 2: ba ${c('<input type="checkbox">')} cùng ${c('name="thich"')}, value html/css/js.`,
        `Câu 3: ${c('<select name="co-so">')} với ba ${c('<option>')} có value hn/dn/hcm.`,
        `Câu 4: ${c('<textarea name="gop-y" rows="4">')}.`,
        `Mọi radio, checkbox, select, textarea đều có nhãn (label for/id).`,
      ],
      dauVao: 'Form khảo sát chỉ có tiêu đề các câu hỏi.',
      dauRa: 'Chọn "Rất tốt" + "CSS" + "JavaScript" + "Đà Nẵng" ⇒ gửi: muc-do=rat-tot&thich=css&thich=js&co-so=dn&gop-y=…',
      rangBuoc: [
        'Mỗi radio/checkbox có id riêng để label trỏ tới.',
        'Radio trong cùng câu phải cùng name — khác name là chọn được nhiều.',
      ],
      viDu: [{
        input: '<input type="radio" id="md-1" name="muc-do" value="chua-tot">\n<input type="radio" id="md-2" name="mucdo" value="on">',
        output: 'Chọn được CẢ HAI cùng lúc.',
        explanation: 'Hai name khác nhau ⇒ hai nhóm khác nhau. Trình duyệt chỉ loại trừ nhau trong cùng một name.',
      }],
      goiY: [
        'Mỗi lựa chọn là một cặp <input id="…"> + <label for="…">. Đặt id theo mẫu md-1, md-2, md-3 / th-1… để khỏi trùng.',
        'Câu 1: <input type="radio" id="md-1" name="muc-do" value="chua-tot" required> <label for="md-1">Chưa tốt</label> — hai ô còn lại giống vậy, không cần required lặp lại.',
      ],
      khoiDau: {
        'index.html': KHUNG('Khảo sát cuối khoá', `    <h1>Khảo sát cuối khoá</h1>
    <form action="/khao-sat" method="post">
      <p>1. Mức độ hài lòng</p>
      <!-- 3 radio -->
      <p>2. Phần thích nhất</p>
      <!-- 3 checkbox -->
      <p>3. Bạn học ở đâu</p>
      <!-- select -->
      <p>4. Góp ý</p>
      <!-- textarea -->
      <button type="submit">Gửi khảo sát</button>
    </form>`),
      },
      loiGiai: {
        'index.html': KHUNG('Khảo sát cuối khoá', `    <h1>Khảo sát cuối khoá</h1>
    <form action="/khao-sat" method="post">
      <p>1. Mức độ hài lòng</p>
      <!-- radio: CÙNG name ⇒ chọn đúng một; value = thứ được gửi đi -->
      <!-- required trên một radio ⇒ cả nhóm bắt buộc -->
      <input type="radio" id="md-1" name="muc-do" value="chua-tot" required>
      <label for="md-1">Chưa tốt</label>
      <input type="radio" id="md-2" name="muc-do" value="on">
      <label for="md-2">Ổn</label>
      <input type="radio" id="md-3" name="muc-do" value="rat-tot">
      <label for="md-3">Rất tốt</label>

      <p>2. Phần thích nhất</p>
      <!-- checkbox: chọn nhiều; mỗi ô được chọn gửi một cặp, vd thich=css -->
      <input type="checkbox" id="th-1" name="thich" value="html">
      <label for="th-1">HTML</label>
      <input type="checkbox" id="th-2" name="thich" value="css">
      <label for="th-2">CSS</label>
      <input type="checkbox" id="th-3" name="thich" value="js">
      <label for="th-3">JavaScript</label>

      <p>3. Bạn học ở đâu</p>
      <label for="co-so">Cơ sở</label>
      <!-- select: name trên select, value trên từng option -->
      <select id="co-so" name="co-so">
        <option value="hn">Hà Nội</option>
        <option value="dn">Đà Nẵng</option>
        <option value="hcm">TP.HCM</option>
      </select>

      <p>4. Góp ý</p>
      <label for="gop-y">Góp ý của bạn</label>
      <textarea id="gop-y" name="gop-y" rows="4"></textarea>

      <button type="submit">Gửi khảo sát</button>
    </form>`),
      },
      giaiThich: `<p>Radio và checkbox khác nhau đúng ở ${c('name')}: radio cùng name loại trừ nhau (chọn một), checkbox cùng name thì cộng dồn (gửi nhiều cặp ${c('thich=css&thich=js')}). ${c('value')} là thứ máy chủ nhận — không có value thì mọi radio gửi "on", máy chủ không biết bạn chọn gì.</p>
<p>${c('required')} đặt trên <em>một</em> radio là đủ cho cả nhóm cùng name. Máy chấm thử: chưa chọn gì ⇒ form không hợp lệ; chọn "Rất tốt" ⇒ hợp lệ. Nó cũng kiểm mọi lựa chọn có nhãn — nhãn bấm được là vùng chạm lớn cho các ô tròn/vuông bé xíu trên điện thoại.</p>`,
      loiHayGap: [
        `Đặt ${c('name')} khác nhau cho từng radio — thành ba câu hỏi có/không độc lập.`,
        `Quên ${c('value')} trên option — option gửi đi CHỮ hiển thị ("Hà Nội"), dễ vỡ khi đổi chữ.`,
        `Đặt ${c('required')} lên checkbox với ý "chọn ít nhất một" — HTML không làm vậy; required trên checkbox nghĩa là chính ô đó phải được tích.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio',
      kiem: [
        { moTa: 'Ba radio cùng name="muc-do"', kiem: 'so-luong', selector: 'input[type="radio"][name="muc-do"]', giaTri: 3 },
        { moTa: 'Radio có value đúng bảng', kiem: 'so-luong', selector: 'input[type="radio"][value="chua-tot"], input[type="radio"][value="on"], input[type="radio"][value="rat-tot"]', giaTri: 3 },
        { moTa: 'Ba checkbox name="thich" với value html/css/js', kiem: 'so-luong', selector: 'input[type="checkbox"][name="thich"][value="html"], input[type="checkbox"][name="thich"][value="css"], input[type="checkbox"][name="thich"][value="js"]', giaTri: 3 },
        { moTa: 'select name="co-so" có 3 option value hn/dn/hcm', kiem: 'so-luong', selector: 'select[name="co-so"] option[value="hn"], select[name="co-so"] option[value="dn"], select[name="co-so"] option[value="hcm"]', giaTri: 3 },
        { moTa: 'textarea name="gop-y" rows="4"', kiem: 'ton-tai', selector: 'textarea[name="gop-y"][rows="4"]' },
        { moTa: 'Mọi radio, checkbox, select, textarea đều có nhãn', kiem: 'co-nhan', selector: 'input[type="radio"], input[type="checkbox"], select, textarea' },
        { moTa: 'Chưa chọn mức độ ⇒ form không hợp lệ', kiem: 'hop-le', selector: 'form', giaTri: false },
        { moTa: 'Chọn "Rất tốt" ⇒ form hợp lệ', kiem: 'hop-le', selector: 'form', chon: ['input[name="muc-do"][value="rat-tot"]'], giaTri: true },
      ],
    },

    /* ──────────────────────────── 6 · MEDIUM ──────────────────────────── */
    {
      tieuDe: 'GET hay POST? Một form tìm kiếm và một form đăng nhập trên cùng trang',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['method get', 'method post', 'giá trị trên URL', 'mật khẩu không bao giờ trên URL'],
      tienQuyet: ['action, method, name'],
      the: ['html', 'forms', 'get', 'post'],
      moTa: `<p>Bài 2.4, bước 3 của "chuyện gì xảy ra khi form được gửi": <em>"${c('method="get"')} đặt giá trị vào URL; ${c('method="post"')} đặt vào thân. Mật khẩu KHÔNG BAO GIỜ được đi trong URL."</em> Trang chủ thư viện có hai form: tìm sách (muốn chia sẻ được đường dẫn kết quả, kiểu ${c('/tim-kiem?q=html')}) và đăng nhập. Người viết trước đã đảo ngược method của hai form.</p>`,
      yeuCau: [
        `Form tìm kiếm: ${c('action="/tim-kiem"')}, ${c('method="get"')}, ô từ khoá có ${c('name="q"')}.`,
        `Form đăng nhập: ${c('action="/dang-nhap"')}, ${c('method="post"')}, có ô ${c('type="password" name="password"')}.`,
        `Không ô mật khẩu nào nằm trong form GET.`,
        `Mỗi ô có nhãn; nút của mỗi form là ${c('type="submit"')}.`,
      ],
      dauVao: 'Hai form với method bị đảo, ô tìm kiếm thiếu name.',
      dauRa: 'Tìm "html" ⇒ URL /tim-kiem?q=html (chia sẻ được). Đăng nhập ⇒ URL /dang-nhap, mật khẩu nằm trong thân request.',
      rangBuoc: [
        'Không gộp hai form làm một.',
        'Ô tìm kiếm dùng name="q" (quy ước phổ biến cho từ khoá).',
      ],
      viDu: [{
        input: '<form action="/dang-nhap" method="get">\n  …<input type="password" name="password">',
        output: 'Sau khi bấm: thanh địa chỉ hiện /dang-nhap?email=lan%40vidu.com&password=matkhau123',
        explanation: 'Mật khẩu giờ nằm trong lịch sử trình duyệt, log máy chủ, và có thể trong ảnh chụp màn hình bạn gửi ai đó.',
      }],
      goiY: [
        'Hỏi: "người dùng có muốn đánh dấu/chia sẻ kết quả này không?" Có ⇒ GET (tìm kiếm). Gửi thông tin bí mật hoặc làm thay đổi dữ liệu ⇒ POST.',
        'Đổi method hai form cho nhau và thêm name="q" vào ô tìm kiếm.',
      ],
      khoiDau: {
        'index.html': KHUNG('Thư viện', `    <h1>Thư viện CLB</h1>
    <form action="/tim-kiem" method="post">
      <label for="tu-khoa">Tìm sách</label>
      <input type="text" id="tu-khoa">
      <button type="submit">Tìm</button>
    </form>

    <form action="/dang-nhap" method="get">
      <label for="email">Email</label>
      <input type="email" id="email" name="email" required>
      <label for="pw">Mật khẩu</label>
      <input type="password" id="pw" name="password" required>
      <button type="submit">Đăng nhập</button>
    </form>`),
      },
      loiGiai: {
        'index.html': KHUNG('Thư viện', `    <h1>Thư viện CLB</h1>
    <!-- GET: giá trị lên URL ⇒ /tim-kiem?q=html — đánh dấu, chia sẻ, bấm Back được -->
    <form action="/tim-kiem" method="get">
      <label for="tu-khoa">Tìm sách</label>
      <!-- name="q": khoá trên URL -->
      <input type="text" id="tu-khoa" name="q">
      <button type="submit">Tìm</button>
    </form>

    <!-- POST: giá trị đi trong THÂN request ⇒ mật khẩu không bao giờ lên URL -->
    <form action="/dang-nhap" method="post">
      <label for="email">Email</label>
      <input type="email" id="email" name="email" required>
      <label for="pw">Mật khẩu</label>
      <input type="password" id="pw" name="password" required>
      <button type="submit">Đăng nhập</button>
    </form>`),
      },
      giaiThich: `<p>GET và POST không khác nhau ở "độ an toàn" theo nghĩa mã hoá — cả hai đều đi qua HTTPS như nhau. Khác nhau ở <em>chỗ dữ liệu nằm</em>: GET đặt lên URL, mà URL thì được lưu ở khắp nơi (lịch sử, dấu trang, log máy chủ, header Referer gửi sang trang khác). Đó vừa là ưu điểm cho tìm kiếm (chia sẻ được kết quả) vừa là thảm hoạ cho mật khẩu.</p>
<p>Chương 6 sẽ nói thêm: GET dùng cho "đọc", POST cho "thay đổi" hoặc gửi dữ liệu nhạy cảm. Máy chấm kiểm method của từng form, name="q", và luật cứng: ${c('form[method="get"] input[type="password"]')} không được tồn tại.</p>`,
      loiHayGap: [
        `Để tìm kiếm là POST "cho an toàn" — người dùng không chia sẻ được kết quả, bấm Back hiện hộp "Gửi lại biểu mẫu?".`,
        `Quên ${c('name="q"')} — URL thành ${c('/tim-kiem?')}, máy chủ không nhận từ khoá.`,
        `Bỏ method của form đăng nhập — mặc định là GET.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Learn/Forms/Sending_and_retrieving_form_data#the_method_attribute',
      kiem: [
        { moTa: 'Form tìm kiếm dùng GET', kiem: 'thuoc-tinh', selector: 'form[action="/tim-kiem"]', thuocTinh: 'method', khop: '^get$' },
        { moTa: 'Ô từ khoá có name="q"', kiem: 'ton-tai', selector: 'form[action="/tim-kiem"] input[name="q"]' },
        { moTa: 'Form đăng nhập dùng POST', kiem: 'thuoc-tinh', selector: 'form[action="/dang-nhap"]', thuocTinh: 'method', khop: '^post$' },
        { moTa: 'Form đăng nhập có ô password name="password"', kiem: 'ton-tai', selector: 'form[action="/dang-nhap"] input[type="password"][name="password"]' },
        { moTa: 'Không có ô mật khẩu trong form GET (hoặc form không khai method)', kiem: 'khong-ton-tai', selector: 'form:not([method="post" i]) input[type="password"]' },
        { moTa: 'Mọi ô có nhãn', kiem: 'co-nhan', selector: 'input' },
        { moTa: 'Mỗi form có một nút submit', kiem: 'so-luong', selector: 'form > button[type="submit"]', giaTri: 2 },
      ],
    },

    /* ───────────────────────────── 7 · HARD ───────────────────────────── */
    {
      tieuDe: 'Biểu mẫu đăng ký khoá học hoàn chỉnh từ đặc tả, có 9 kịch bản kiểm',
      doKho: 'HARD', phut: 35,
      khaiNiem: ['tổng hợp label/name/type', 'required', 'pattern', 'min/max', 'radio/checkbox/select', 'textarea maxlength'],
      tienQuyet: ['toàn bộ bài 2.4'],
      the: ['html', 'forms', 'validation', 'tong-hop'],
      moTa: `<p>Bài tổng hợp của 2.4: viết từ đầu form đăng ký khoá học theo đặc tả của phòng đào tạo. Không có ô nào sẵn. Máy chấm sẽ "điền thử" 9 bộ dữ liệu và đòi trình duyệt chấp nhận/từ chối đúng như đặc tả — giống cách kiểm thử viên làm với một form thật.</p>
${code(`
Trường         id / name          Kiểu              Luật
Họ và tên      ho-ten / hoTen     text              bắt buộc, 2–50 ký tự
Email          email / email      email             bắt buộc
Điện thoại     sdt / sdt          tel               bắt buộc, 10 chữ số bắt đầu bằng 0   (pattern 0[0-9]{9})
Tuổi           tuoi / tuoi        number            16 đến 60, không bắt buộc
Khoá học       khoa / khoa        select            bắt buộc; option đầu "-- Chọn khoá --" value="" ;
                                                    rồi web (Nền tảng Web), react (React), node (Node.js)
Hình thức      hinh-thuc          radio ×2          bắt buộc; value: online | offline
Ghi chú        ghi-chu / ghiChu   textarea          tối đa 300 ký tự
Đồng ý         dong-y / dongY     checkbox          bắt buộc tích
Form           action="/dang-ky-khoa"  method="post"
`)}`,
      yeuCau: [
        `Đủ 9 trường theo bảng, mỗi trường (và mỗi radio) có ${c('<label for>')} riêng.`,
        `Đúng ${c('id')}, ${c('name')}, ${c('type')} và luật kiểm tra của từng dòng.`,
        `Ô chọn khoá học có option đầu ${c('value=""')} — kết hợp ${c('required')} để buộc người dùng chọn thật.`,
        `Checkbox đồng ý có ${c('required')}.`,
        `Một nút ${c('<button type="submit">Đăng ký</button>')}.`,
      ],
      dauVao: 'Chỉ có bộ khung tài liệu và tiêu đề.',
      dauRa: 'Form 9 trường, gửi POST /dang-ky-khoa; trình duyệt chặn đúng mọi dữ liệu sai theo đặc tả.',
      rangBuoc: [
        'Không JavaScript.',
        'minlength/maxlength được kiểm bằng thuộc tính (trình duyệt không kích hoạt chúng khi giá trị gán bằng mã).',
        'Mọi id duy nhất.',
      ],
      viDu: [{
        input: 'Khoá học: (để nguyên "-- Chọn khoá --")',
        output: 'Không hợp lệ — "Vui lòng chọn một mục trong danh sách".',
        explanation: 'select required + option đầu value="" ⇒ option đó coi như "chưa chọn".',
      }, {
        input: 'Điện thoại: 912345678',
        output: 'Không hợp lệ — sai định dạng.',
        explanation: 'pattern 0[0-9]{9}: phải bắt đầu bằng 0 và đủ 10 chữ số.',
      }],
      goiY: [
        'Làm từng dòng của bảng thành một cặp label + điều khiển; kiểm một dòng xong mới sang dòng sau. Radio "Hình thức" cần 2 cặp input/label (id khác nhau, name chung "hinh-thuc").',
        'Các thuộc tính cần nhớ: required, minlength="2" maxlength="50", pattern="0[0-9]{9}", min="16" max="60", maxlength="300". Option giả: <option value="">-- Chọn khoá --</option>.',
      ],
      khoiDau: {
        'index.html': KHUNG('Đăng ký khoá học', `    <h1>Đăng ký khoá học</h1>
    <!-- Viết form theo bảng đặc tả trong đề -->
`),
      },
      loiGiai: {
        'index.html': KHUNG('Đăng ký khoá học', `    <h1>Đăng ký khoá học</h1>
    <form action="/dang-ky-khoa" method="post">
      <!-- text 2..50 ký tự, bắt buộc -->
      <label for="ho-ten">Họ và tên</label>
      <input type="text" id="ho-ten" name="hoTen" required minlength="2" maxlength="50">

      <!-- email: định dạng do type lo, bắt buộc do required -->
      <label for="email">Email</label>
      <input type="email" id="email" name="email" required>

      <!-- tel không tự kiểm định dạng ⇒ pattern: 0 rồi 9 chữ số -->
      <label for="sdt">Điện thoại</label>
      <input type="tel" id="sdt" name="sdt" required pattern="0[0-9]{9}">

      <!-- number 16..60, không bắt buộc (để trống là hợp lệ) -->
      <label for="tuoi">Tuổi</label>
      <input type="number" id="tuoi" name="tuoi" min="16" max="60">

      <!-- select required + option đầu value="" ⇒ phải chọn khoá thật -->
      <label for="khoa">Khoá học</label>
      <select id="khoa" name="khoa" required>
        <option value="">-- Chọn khoá --</option>
        <option value="web">Nền tảng Web</option>
        <option value="react">React</option>
        <option value="node">Node.js</option>
      </select>

      <!-- radio: cùng name, value riêng; required trên một ô = cả nhóm -->
      <p>Hình thức học</p>
      <input type="radio" id="ht-online" name="hinh-thuc" value="online" required>
      <label for="ht-online">Trực tuyến</label>
      <input type="radio" id="ht-offline" name="hinh-thuc" value="offline">
      <label for="ht-offline">Tại lớp</label>

      <!-- textarea tối đa 300 ký tự -->
      <label for="ghi-chu">Ghi chú</label>
      <textarea id="ghi-chu" name="ghiChu" rows="3" maxlength="300"></textarea>

      <!-- checkbox required: phải tích mới gửi được -->
      <input type="checkbox" id="dong-y" name="dongY" required>
      <label for="dong-y">Tôi đồng ý với quy định của lớp</label>

      <button type="submit">Đăng ký</button>
    </form>`),
      },
      giaiThich: `<p>Form đúng không phải vì "có đủ ô" mà vì <em>hành xử</em> đúng với mọi dữ liệu. Máy chấm điền 9 bộ dữ liệu: đúng hết (hợp lệ); thiếu đồng ý; chưa chọn khoá; số điện thoại thiếu số 0; tuổi 12; tuổi để trống (vẫn hợp lệ vì không bắt buộc); chưa chọn hình thức; email sai; họ tên trống. Mỗi kịch bản khớp với một dòng luật trong bảng.</p>
<p>Hai chi tiết hay sót: (1) ${c('<select required>')} chỉ có tác dụng khi option đầu có ${c('value=""')} — nếu option đầu mang chữ "-- Chọn khoá --" mà không có value, trình duyệt coi chữ đó là giá trị và cho qua; (2) ${c('pattern')} không đi với ${c('type="number"')}, nên số điện thoại phải là ${c('tel')} + pattern.</p>`,
      loiHayGap: [
        `Option giả không có ${c('value=""')} — required trên select mất tác dụng.`,
        `Đặt ${c('required')} cho Tuổi "cho chắc" — sai đặc tả: tuổi không bắt buộc.`,
        `Dùng ${c('type="number"')} + ${c('pattern')} cho điện thoại — pattern bị bỏ qua trên number, số 0 đầu cũng mất.`,
        `Radio "Hình thức" thiếu value — máy chủ nhận ${c('hinh-thuc=on')}.`,
      ],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Constraint_validation',
      kiem: [
        { moTa: 'form action="/dang-ky-khoa" method="post"', kiem: 'ton-tai', selector: 'form[action="/dang-ky-khoa"][method="post" i]' },
        { moTa: 'Mọi điều khiển đều có nhãn', kiem: 'co-nhan', selector: 'input, select, textarea' },
        { moTa: 'Họ tên: required, minlength=2, maxlength=50', kiem: 'ton-tai', selector: '#ho-ten[name="hoTen"][required][minlength="2"][maxlength="50"]' },
        { moTa: 'Điện thoại: tel + pattern', kiem: 'ton-tai', selector: '#sdt[type="tel"][name="sdt"][required][pattern]' },
        { moTa: 'Khoá học: select required, option đầu value=""', kiem: 'ton-tai', selector: 'select#khoa[name="khoa"][required] > option:first-child[value=""]' },
        { moTa: 'Khoá học có đủ web/react/node', kiem: 'so-luong', selector: '#khoa option[value="web"], #khoa option[value="react"], #khoa option[value="node"]', giaTri: 3 },
        { moTa: 'Hình thức: 2 radio name="hinh-thuc" value online/offline', kiem: 'so-luong', selector: 'input[type="radio"][name="hinh-thuc"][value="online"], input[type="radio"][name="hinh-thuc"][value="offline"]', giaTri: 2 },
        { moTa: 'Ghi chú: textarea maxlength=300', kiem: 'ton-tai', selector: 'textarea#ghi-chu[name="ghiChu"][maxlength="300"]' },
        { moTa: 'Đồng ý: checkbox required', kiem: 'ton-tai', selector: 'input#dong-y[type="checkbox"][name="dongY"][required]' },
        { moTa: 'Kịch bản 1 — dữ liệu đúng hết ⇒ hợp lệ', kiem: 'hop-le', selector: 'form', dien: { '#ho-ten': 'Nguyễn Lan', '#email': 'lan@vidu.com', '#sdt': '0912345678', '#tuoi': '20', '#khoa': 'web' }, chon: ['#ht-online', '#dong-y'], giaTri: true },
        { moTa: 'Kịch bản 2 — chưa tích đồng ý ⇒ không hợp lệ', kiem: 'hop-le', selector: 'form', dien: { '#ho-ten': 'Nguyễn Lan', '#email': 'lan@vidu.com', '#sdt': '0912345678', '#khoa': 'web' }, chon: ['#ht-online'], giaTri: false },
        { moTa: 'Kịch bản 3 — chưa chọn khoá ⇒ không hợp lệ', kiem: 'hop-le', selector: 'form', dien: { '#ho-ten': 'Nguyễn Lan', '#email': 'lan@vidu.com', '#sdt': '0912345678', '#khoa': '' }, chon: ['#ht-online', '#dong-y'], giaTri: false },
        { moTa: 'Kịch bản 4 — điện thoại "912345678" ⇒ không hợp lệ', kiem: 'hop-le', selector: '#sdt', dien: { '#sdt': '912345678' }, giaTri: false },
        { moTa: 'Kịch bản 5 — tuổi 12 ⇒ không hợp lệ', kiem: 'hop-le', selector: '#tuoi', dien: { '#tuoi': '12' }, giaTri: false },
        { moTa: 'Kịch bản 6 — tuổi để trống vẫn hợp lệ (không bắt buộc)', kiem: 'hop-le', selector: 'form', dien: { '#ho-ten': 'Nguyễn Lan', '#email': 'lan@vidu.com', '#sdt': '0912345678', '#tuoi': '', '#khoa': 'react' }, chon: ['#ht-offline', '#dong-y'], giaTri: true },
        { moTa: 'Kịch bản 7 — chưa chọn hình thức ⇒ không hợp lệ', kiem: 'hop-le', selector: 'form', dien: { '#ho-ten': 'Nguyễn Lan', '#email': 'lan@vidu.com', '#sdt': '0912345678', '#khoa': 'web' }, chon: ['#dong-y'], giaTri: false, an: true },
        { moTa: 'Kịch bản 8 — email "lan.vidu.com" ⇒ không hợp lệ', kiem: 'hop-le', selector: '#email', dien: { '#email': 'lan.vidu.com' }, giaTri: false, an: true },
        { moTa: 'Kịch bản 9 — họ tên trống ⇒ không hợp lệ', kiem: 'hop-le', selector: '#ho-ten', dien: { '#ho-ten': '' }, giaTri: false, an: true },
      ],
    },
  ],
};
