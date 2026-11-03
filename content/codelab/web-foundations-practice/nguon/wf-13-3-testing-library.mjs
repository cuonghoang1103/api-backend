/** Bộ luyện bài 13.3 — Kiểm giao diện như người dùng. Lược đồ: ./_luoc-do.mjs (loại 'dom', có chayScript). kiem[].moTa = "EN|||VI".
 *  Ý tưởng: các truy vấn của Testing Library (role, label, text) chỉ chạy được trên HTML có ngữ nghĩa — người học sửa HTML/JS
 *  để "người dùng" (máy chấm) tìm được và dùng được giao diện. */
import { c } from './_luoc-do.mjs';

const BAI = '<p><em>Bài 13.3 — Kiểm thử giao diện theo cách người dùng thấy.</em> Máy chấm dựng trang, chạy script của bạn, rồi gõ/bấm như người dùng và kiểm thứ hiện ra — giống một test Testing Library.</p>';
const vo = (body, script = '') => `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <title>Bài 13.3</title>
</head>
<body>
${body}
${script ? `  <script>\n${script}\n  </script>\n` : ''}</body>
</html>
`;

export default {
  slug: 'wf-13-3-testing-library',
  ten: '13.3 Kiểm thử giao diện theo cách người dùng thấy',
  baiHoc: 'Nền tảng Web — Bài 13.3 Testing Library',
  ngonNgu: 'html',
  level: 'INTERMEDIATE',
  moTa: 'Gắn nhãn cho ô nhập, đổi div thành button thật, thông báo role="status"/"alert", bộ đếm có nút khoá ở 0, form khoá nút tới khi hợp lệ, tab có ARIA — 6 bài chấm bằng tương tác thật.',
  de: [
    {
      tieuDe: 'Ô nhập phải có nhãn',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['label for', 'getByLabelText', 'khả năng tiếp cận'], tienQuyet: ['form HTML'], the: ['html', 'a11y', 'testing'],
      moTa: `${BAI}<p>Test ${c("getByLabelText('Email')")} và ${c("getByLabelText('Password')")} đang đỏ vì form chỉ có chữ gợi ý (placeholder), không có nhãn. Thêm ${c('<label>')} nối với từng ô bằng ${c('for')}/${c('id')}: "Email" và "Password". Giữ placeholder nếu muốn — nhưng placeholder không phải nhãn.</p>`,
      yeuCau: ['Mỗi input có một label nối đúng (for = id).', 'Chữ của nhãn là "Email" và "Password".', 'Nút gửi là button type="submit".'],
      dauVao: 'index.html.', dauRa: 'Form có nhãn.',
      rangBuoc: ['Không dùng aria-label thay cho nhãn nhìn thấy được.'],
      viDu: [{ input: '<label for="email">Email</label><input id="email">', output: 'getByLabelText("Email") tìm thấy', explanation: 'Nhãn nối bằng for/id.' }],
      goiY: ['Mỗi input cần một id duy nhất; label for trỏ đúng id đó.', '<label for="email">Email</label> <input id="email" name="email" type="email">'],
      khoiDau: { 'index.html': vo(`  <form>
    <input name="email" type="email" placeholder="Email">
    <input name="password" type="password" placeholder="Password">
    <button type="submit">Log in</button>
  </form>`) },
      loiGiai: { 'index.html': vo(`  <form>
    <!-- nhãn nhìn thấy được, nối bằng for/id: người dùng, trình đọc màn hình và getByLabelText đều tìm được -->
    <label for="email">Email</label>
    <input id="email" name="email" type="email" placeholder="lan@example.com">
    <label for="password">Password</label>
    <input id="password" name="password" type="password">
    <button type="submit">Log in</button>
  </form>`) },
      giaiThich: `<p>Placeholder biến mất khi gõ và nhiều trình đọc màn hình không đọc nó — nó không phải nhãn. ${c('<label for>')} cho ô một tên truy cập; ${c('getByLabelText')} tìm theo đúng tên đó. Test tìm không thấy thường là lỗi tiếp cận thật.</p>`,
      loiHayGap: ['for không khớp id — nhãn không nối với ô nào.', 'Dùng hai id trùng nhau.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label',
      kiem: [
        { moTa: 'Every input has a label|||Mọi input đều có nhãn', kiem: 'co-nhan', selector: 'input' },
        { moTa: 'A label reads "Email"|||Có nhãn "Email"', kiem: 'text', selector: 'label[for="email"], label[for]:first-of-type', giaTri: 'Email', tatCa: false },
        { moTa: 'A label reads "Password"|||Có nhãn "Password"', kiem: 'ton-tai', selector: 'label[for="password"]' },
        { moTa: 'Submit is a real button|||Nút gửi là button thật', kiem: 'thuoc-tinh', selector: 'form button', thuocTinh: 'type', giaTri: 'submit' },
      ],
    },
    {
      tieuDe: 'div bấm được thành button thật',
      doKho: 'EASY', phut: 10, chayScript: true,
      khaiNiem: ['role button', 'getByRole', 'bàn phím'], tienQuyet: ['addEventListener'], the: ['html', 'a11y', 'testing'],
      moTa: `${BAI}<p>"Nút" Thêm vào giỏ là một ${c('<div class="btn">')} có ${c('onclick')} — test ${c("getByRole('button', { name: 'Add to cart' })")} không tìm thấy, và người dùng bàn phím không bấm được. Đổi thành ${c('<button type="button">')} thật, giữ hành vi: mỗi lần bấm tăng số trong ${c('#count')}.</p>`,
      yeuCau: ['Có <button> với chữ "Add to cart".', 'Không còn div có onclick.', 'Bấm 2 lần ⇒ #count hiện 2.'],
      dauVao: 'index.html.', dauRa: 'Nút thật.',
      rangBuoc: ['Gắn sự kiện bằng addEventListener.'],
      viDu: [{ input: 'bấm "Add to cart" hai lần', output: '#count = 2', explanation: 'Hành vi giữ nguyên.' }],
      goiY: ['<button type="button" id="add">Add to cart</button>', "document.getElementById('add').addEventListener('click', () => { … });"],
      khoiDau: { 'index.html': vo(`  <div class="btn" onclick="add()">Add to cart</div>
  <p>In cart: <span id="count">0</span></p>`, `    let n = 0;
    function add() { n++; document.getElementById('count').textContent = n; }`) },
      loiGiai: { 'index.html': vo(`  <!-- button thật: có vai trò "button", nhận focus và bấm được bằng Enter/Space -->
  <button type="button" id="add">Add to cart</button>
  <p>In cart: <span id="count">0</span></p>`, `    let n = 0;
    document.getElementById('add').addEventListener('click', () => {
      n++;
      document.getElementById('count').textContent = n;
    });`) },
      giaiThich: `<p>${c('<button>')} có sẵn vai trò, focus bằng Tab, và bấm được bằng Enter/Space — div thì không có gì cả. Đổi đúng phần tử là sửa được cả test lẫn trải nghiệm của người dùng bàn phím và trình đọc màn hình.</p>`,
      loiHayGap: ['Thêm role="button" vào div — vẫn thiếu focus và phím Enter/Space.', 'Quên type="button" trong form — nút thành submit.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button',
      kiem: [
        { moTa: 'A real button named "Add to cart"|||Có button thật tên "Add to cart"', kiem: 'text', selector: 'button', giaTri: 'Add to cart', tatCa: false },
        { moTa: 'No clickable div left|||Không còn div bấm được', kiem: 'khong-ton-tai', selector: 'div[onclick]' },
        { moTa: 'Two clicks ⇒ 2|||Bấm hai lần ⇒ 2', kiem: 'text', selector: '#count', giaTri: '2', truoc: [{ hanhDong: 'click', selector: 'button', lan: 2 }] },
        { moTa: 'No JavaScript errors|||Không lỗi JavaScript', kiem: 'khong-loi-js', truoc: [{ hanhDong: 'click', selector: 'button' }] },
      ],
    },
    {
      tieuDe: 'Thông báo có vai trò: status và alert',
      doKho: 'MEDIUM', phut: 12, chayScript: true,
      khaiNiem: ['role="status"', 'role="alert"', 'findByRole'], tienQuyet: ['form submit', 'preventDefault'], the: ['html', 'a11y', 'testing'],
      moTa: `${BAI}<p>Form đăng ký tin: khi gửi với email KHÔNG có ${c('@')}, hiện ${c('<p role="alert">')} "Please enter a valid email"; khi hợp lệ, xoá cảnh báo (nếu có) và đặt chữ ${c('"Subscribed: <email>"')} vào phần tử ${c('role="status"')} có sẵn. Không được tải lại trang. Code khởi đầu chỉ ${c('console.log')}.</p>`,
      yeuCau: ['Email sai ⇒ có role="alert" với đúng chữ.', 'Email đúng ⇒ status = "Subscribed: <email>", không còn alert.', 'Không tải lại trang (preventDefault).'],
      dauVao: 'index.html.', dauRa: 'Form có thông báo truy cập được.',
      rangBuoc: ['Thông báo nằm trong phần tử có role đúng.'],
      viDu: [{ input: 'gõ "lan" rồi gửi', output: 'alert: Please enter a valid email', explanation: 'findByRole("alert") tìm thấy.' }],
      goiY: ['form.addEventListener("submit", (e) => { e.preventDefault(); … })', 'Tạo alert: const p = document.createElement("p"); p.setAttribute("role", "alert");'],
      khoiDau: { 'index.html': vo(`  <form id="sub">
    <label for="email">Email</label>
    <input id="email" name="email">
    <button type="submit">Subscribe</button>
    <p role="status" id="status"></p>
  </form>`, `    document.getElementById('sub').addEventListener('submit', () => {
      console.log('submitted');
    });`) },
      loiGiai: { 'index.html': vo(`  <form id="sub">
    <label for="email">Email</label>
    <input id="email" name="email">
    <button type="submit">Subscribe</button>
    <p role="status" id="status"></p>
  </form>`, `    const form = document.getElementById('sub');
    const status = document.getElementById('status');
    form.addEventListener('submit', (e) => {
      e.preventDefault();                                    // không tải lại trang
      const email = document.getElementById('email').value.trim();
      const old = form.querySelector('[role="alert"]');
      if (old) old.remove();                                 // xoá cảnh báo cũ
      if (!email.includes('@')) {
        const p = document.createElement('p');
        p.setAttribute('role', 'alert');                     // trình đọc màn hình đọc ngay
        p.textContent = 'Please enter a valid email';
        form.append(p);
        status.textContent = '';
        return;
      }
      status.textContent = 'Subscribed: ' + email;          // role="status": đọc khi rảnh
    });`) },
      giaiThich: `<p>${c('role="alert"')} được trình đọc màn hình đọc ngay lập tức (lỗi); ${c('role="status"')} đọc lịch sự khi rảnh (thành công). Testing Library tìm chúng bằng ${c("findByRole('alert')")} — cùng một thuộc tính phục vụ cả người dùng lẫn test.</p>`,
      loiHayGap: ['Quên preventDefault — trang tải lại, mọi thông báo mất.', 'Không xoá alert cũ — gửi đúng rồi vẫn còn chữ lỗi.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/alert_role',
      kiem: [
        { moTa: 'Invalid email ⇒ alert|||Email sai ⇒ có alert', kiem: 'text', selector: '[role="alert"]', giaTri: 'Please enter a valid email', truoc: [{ hanhDong: 'nhap', selector: '#email', giaTri: 'lan' }, { hanhDong: 'gui', selector: '#sub' }] },
        { moTa: 'Valid email ⇒ status text|||Email đúng ⇒ có chữ status', kiem: 'text', selector: '[role="status"]', giaTri: 'Subscribed: lan@example.com', truoc: [{ hanhDong: 'nhap', selector: '#email', giaTri: 'lan@example.com' }, { hanhDong: 'gui', selector: '#sub' }] },
        { moTa: 'Fixing the email removes the alert|||Sửa email thì mất alert', kiem: 'khong-ton-tai', selector: '[role="alert"]', truoc: [{ hanhDong: 'nhap', selector: '#email', giaTri: 'lan' }, { hanhDong: 'gui', selector: '#sub' }, { hanhDong: 'nhap', selector: '#email', giaTri: 'lan@example.com' }, { hanhDong: 'gui', selector: '#sub' }] },
        { moTa: 'The page does not reload|||Trang không tải lại', kiem: 'khong-tai-lai', truoc: [{ hanhDong: 'nhap', selector: '#email', giaTri: 'a@b.c' }, { hanhDong: 'gui', selector: '#sub' }] },
      ],
    },
    {
      tieuDe: 'Bộ đếm: nút −1 khoá ở 0',
      doKho: 'MEDIUM', phut: 15, chayScript: true,
      khaiNiem: ['disabled', 'role="status"', 'trạng thái giao diện'], tienQuyet: ['DOM events'], the: ['javascript', 'dom', 'testing'],
      moTa: `${BAI}<p>Bài luyện trong bài học. Có hai nút "+1", "−1" và một dòng ${c('role="status"')} hiện ${c('"Count: 0"')}. Viết script: "+1" tăng, "−1" giảm, dòng status luôn hiện ${c('"Count: N"')}, và "−1" bị ${c('disabled')} khi số đếm là 0 (cả lúc mới vào trang).</p>`,
      yeuCau: ['Ba lần "+1" ⇒ "Count: 3".', '"−1" khoá khi 0, mở khi > 0.', '"+1" ×3 rồi "−1" ⇒ "Count: 2".'],
      dauVao: 'index.html.', dauRa: 'Bộ đếm truy cập được.',
      rangBuoc: ['Dùng thuộc tính disabled thật, không chỉ đổi màu.'],
      viDu: [{ input: 'mới vào trang', output: '"−1" disabled', explanation: 'Không cho đếm âm.' }],
      goiY: ['Một hàm render() cập nhật status và minus.disabled = count === 0; gọi nó lúc đầu và sau mỗi lần bấm.', "plus.addEventListener('click', () => { count++; render(); });"],
      khoiDau: { 'index.html': vo(`  <button type="button" id="plus">+1</button>
  <button type="button" id="minus">−1</button>
  <p role="status" id="status">Count: 0</p>`, `    let count = 0;
    document.getElementById('plus').addEventListener('click', () => { count++; });`) },
      loiGiai: { 'index.html': vo(`  <button type="button" id="plus">+1</button>
  <button type="button" id="minus">−1</button>
  <p role="status" id="status">Count: 0</p>`, `    let count = 0;
    const plus = document.getElementById('plus');
    const minus = document.getElementById('minus');
    const status = document.getElementById('status');
    // một chỗ duy nhất vẽ lại giao diện từ trạng thái
    function render() {
      status.textContent = 'Count: ' + count;
      minus.disabled = count === 0;          // không cho đếm âm — và người dùng THẤY là không bấm được
    }
    plus.addEventListener('click', () => { count++; render(); });
    minus.addEventListener('click', () => { count--; render(); });
    render();                                // trạng thái ban đầu`) },
      giaiThich: `<p>Một hàm ${c('render()')} vẽ lại toàn bộ giao diện từ trạng thái giúp không bao giờ quên cập nhật một chỗ (đây cũng là ý tưởng của React). ${c('disabled')} thật được trình đọc màn hình báo "dimmed/unavailable" và Testing Library kiểm bằng ${c('toBeDisabled()')}.</p>`,
      loiHayGap: ['Quên gọi render() lúc đầu — "−1" bấm được ở 0.', 'Chỉ làm mờ bằng CSS — vẫn bấm được.'],
      thamKhao: 'https://testing-library.com/docs/queries/byrole',
      kiem: [
        { moTa: 'Minus starts disabled|||"−1" khởi đầu bị khoá', kiem: 'thuoc-tinh-js', selector: '#minus', thuocTinh: 'disabled', giaTri: true },
        { moTa: 'Three +1 ⇒ Count: 3|||Ba lần +1 ⇒ Count: 3', kiem: 'text', selector: '[role="status"]', giaTri: 'Count: 3', truoc: [{ hanhDong: 'click', selector: '#plus', lan: 3 }] },
        { moTa: '+1 ×3 then −1 ⇒ Count: 2|||+1 ×3 rồi −1 ⇒ Count: 2', kiem: 'text', selector: '[role="status"]', giaTri: 'Count: 2', truoc: [{ hanhDong: 'click', selector: '#plus', lan: 3 }, { hanhDong: 'click', selector: '#minus' }] },
        { moTa: 'Minus enabled above zero|||"−1" mở khi lớn hơn 0', kiem: 'thuoc-tinh-js', selector: '#minus', thuocTinh: 'disabled', giaTri: false, truoc: [{ hanhDong: 'click', selector: '#plus' }] },
        { moTa: 'Hidden: back to zero disables again|||Ẩn: về 0 thì khoá lại', an: true, kiem: 'thuoc-tinh-js', selector: '#minus', thuocTinh: 'disabled', giaTri: true, truoc: [{ hanhDong: 'click', selector: '#plus' }, { hanhDong: 'click', selector: '#minus' }] },
      ],
    },
    {
      tieuDe: 'Khoá nút tới khi form hợp lệ',
      doKho: 'MEDIUM', phut: 15, chayScript: true,
      khaiNiem: ['sự kiện input', 'disabled', 'kiểm tra dữ liệu'], tienQuyet: ['DOM events'], the: ['javascript', 'dom', 'testing'],
      moTa: `${BAI}<p>Như form trong bài học: nút "Sign up" phải ${c('disabled')} cho tới khi email chứa ${c('@')} VÀ mật khẩu có ít nhất 8 ký tự; kiểm lại sau mỗi lần gõ (sự kiện ${c('input')}). Code khởi đầu chỉ kiểm lúc bấm nút.</p>`,
      yeuCau: ['Ban đầu nút disabled.', 'Email đúng + mật khẩu 7 ký tự ⇒ vẫn disabled.', 'Email đúng + mật khẩu 8 ký tự ⇒ enabled; xoá @ ⇒ disabled lại.'],
      dauVao: 'index.html.', dauRa: 'Form khoá/mở đúng lúc.',
      rangBuoc: ['Nghe sự kiện input (không phải change).'],
      viDu: [{ input: 'gõ lan@example.com + correct-horse', output: 'nút mở', explanation: 'Cả hai điều kiện đều đúng.' }],
      goiY: ['form.addEventListener("input", update) — sự kiện input nổi bọt lên form.', 'button.disabled = !(email.value.includes("@") && password.value.length >= 8);'],
      khoiDau: { 'index.html': vo(`  <form id="f">
    <label for="email">Email</label> <input id="email" type="email">
    <label for="password">Password</label> <input id="password" type="password">
    <button type="submit" id="go">Sign up</button>
  </form>`, `    document.getElementById('go').addEventListener('click', (e) => {
      const ok = document.getElementById('email').value.includes('@');
      if (!ok) e.preventDefault();
    });`) },
      loiGiai: { 'index.html': vo(`  <form id="f">
    <label for="email">Email</label> <input id="email" type="email">
    <label for="password">Password</label> <input id="password" type="password">
    <button type="submit" id="go" disabled>Sign up</button>
  </form>`, `    const form = document.getElementById('f');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const button = document.getElementById('go');
    // kiểm lại sau MỖI lần gõ: sự kiện input nổi bọt từ ô nhập lên form
    function update() {
      button.disabled = !(email.value.includes('@') && password.value.length >= 8);
    }
    form.addEventListener('input', update);
    update();                                   // trạng thái ban đầu: khoá`) },
      giaiThich: `<p>Một listener ${c('input')} trên form bắt được mọi ô nhờ nổi bọt (Chương 4). Điều kiện tính lại từ đầu mỗi lần, nên xoá ${c('@')} sẽ khoá lại nút. Test trong bài học kiểm đúng chuỗi này bằng ${c('user.type')} rồi ${c('toBeEnabled()')}.</p>`,
      loiHayGap: ['Nghe change — chỉ bắn khi rời ô, nút mở trễ.', 'Chỉ mở mà không bao giờ khoá lại.'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/API/Element/input_event',
      kiem: [
        { moTa: 'Disabled at first|||Ban đầu bị khoá', kiem: 'thuoc-tinh-js', selector: '#go', thuocTinh: 'disabled', giaTri: true },
        { moTa: 'Short password keeps it disabled|||Mật khẩu ngắn vẫn khoá', kiem: 'thuoc-tinh-js', selector: '#go', thuocTinh: 'disabled', giaTri: true, truoc: [{ hanhDong: 'nhap', selector: '#email', giaTri: 'lan@example.com' }, { hanhDong: 'nhap', selector: '#password', giaTri: '1234567' }] },
        { moTa: 'Valid ⇒ enabled|||Hợp lệ ⇒ mở', kiem: 'thuoc-tinh-js', selector: '#go', thuocTinh: 'disabled', giaTri: false, truoc: [{ hanhDong: 'nhap', selector: '#email', giaTri: 'lan@example.com' }, { hanhDong: 'nhap', selector: '#password', giaTri: '12345678' }] },
        { moTa: 'Removing @ disables again|||Xoá @ thì khoá lại', kiem: 'thuoc-tinh-js', selector: '#go', thuocTinh: 'disabled', giaTri: true, truoc: [{ hanhDong: 'nhap', selector: '#password', giaTri: 'correct-horse' }, { hanhDong: 'nhap', selector: '#email', giaTri: 'lan@example.com' }, { hanhDong: 'nhap', selector: '#email', giaTri: 'lan.example.com' }] },
      ],
    },
    {
      tieuDe: 'Tab có ARIA: tablist, tab, tabpanel',
      doKho: 'HARD', phut: 20, chayScript: true,
      khaiNiem: ['role="tab"', 'aria-selected', 'aria-controls', 'hidden'], tienQuyet: ['DOM events', 'thuộc tính'], the: ['html', 'a11y', 'testing'],
      moTa: `${BAI}<p>Biến ba nút và ba khối nội dung thành tab truy cập được: vùng chứa ${c('role="tablist"')}; mỗi nút ${c('role="tab"')} có ${c('aria-selected')} (${c('"true"')}/${c('"false"')}) và ${c('aria-controls')} trỏ tới khối của nó; mỗi khối ${c('role="tabpanel"')}, chỉ khối đang chọn hiện (các khối khác có thuộc tính ${c('hidden')}). Bấm một tab ⇒ chọn nó, bỏ chọn tab khác. Tab đầu được chọn sẵn.</p>`,
      yeuCau: ['Đúng role cho tablist / tab / tabpanel.', 'aria-selected và hidden khớp với tab đang chọn.', 'Bấm "Reviews" ⇒ chỉ khối Reviews hiện, tab đó aria-selected="true".'],
      dauVao: 'index.html.', dauRa: 'Tab dùng được với trình đọc màn hình.',
      rangBuoc: ['Ẩn bằng thuộc tính hidden, không chỉ bằng CSS.'],
      viDu: [{ input: 'bấm tab "Reviews"', output: 'getByRole("tabpanel") là khối Reviews', explanation: 'Các khối khác hidden.' }],
      goiY: ['Thêm role và aria-controls trong HTML; script chỉ cần một hàm select(tab).', 'select: mọi tab aria-selected="false", panel.hidden = true; rồi bật tab được chọn và panel = document.getElementById(tab.getAttribute("aria-controls")).'],
      khoiDau: { 'index.html': vo(`  <div class="tabs">
    <button type="button" id="t1">Details</button>
    <button type="button" id="t2">Reviews</button>
    <button type="button" id="t3">Shipping</button>
  </div>
  <div id="p1">Made of aluminium.</div>
  <div id="p2">4.8 stars from 120 reviews.</div>
  <div id="p3">Ships in 2 days.</div>`, `    // TODO: tab hoạt động`) },
      loiGiai: { 'index.html': vo(`  <div class="tabs" role="tablist" aria-label="Product information">
    <button type="button" role="tab" id="t1" aria-controls="p1" aria-selected="true">Details</button>
    <button type="button" role="tab" id="t2" aria-controls="p2" aria-selected="false">Reviews</button>
    <button type="button" role="tab" id="t3" aria-controls="p3" aria-selected="false">Shipping</button>
  </div>
  <div role="tabpanel" id="p1" aria-labelledby="t1">Made of aluminium.</div>
  <div role="tabpanel" id="p2" aria-labelledby="t2" hidden>4.8 stars from 120 reviews.</div>
  <div role="tabpanel" id="p3" aria-labelledby="t3" hidden>Ships in 2 days.</div>`, `    const tabs = [...document.querySelectorAll('[role="tab"]')];
    // chọn một tab: cập nhật aria-selected của mọi tab và ẩn/hiện panel tương ứng
    function select(tab) {
      for (const t of tabs) {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      }
    }
    tabs.forEach((t) => t.addEventListener('click', () => select(t)));`) },
      giaiThich: `<p>Vai trò ARIA cho trình đọc màn hình biết "đây là tab 2 trên 3, đang chọn"; ${c('aria-controls')} nối tab với khối của nó; thuộc tính ${c('hidden')} ẩn thật (cả với công nghệ hỗ trợ). Testing Library tìm ${c("getByRole('tab', { name: 'Reviews', selected: true })")} chính nhờ các thuộc tính này.</p>`,
      loiHayGap: ['Ẩn bằng class CSS — trình đọc màn hình vẫn đọc khối ẩn.', 'Đặt aria-selected là boolean thay vì chuỗi "true"/"false".'],
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tab_role',
      kiem: [
        { moTa: 'Roles: tablist, 3 tabs, 3 tabpanels|||Vai trò: tablist, 3 tab, 3 tabpanel', kiem: 'so-luong', selector: '[role="tablist"] [role="tab"]', giaTri: 3 },
        { moTa: 'Each tab controls its panel|||Mỗi tab trỏ tới khối của nó', kiem: 'thuoc-tinh', selector: '[role="tab"]', thuocTinh: 'aria-controls', khop: '^p[123]$' },
        { moTa: 'First tab selected, other panels hidden|||Tab đầu được chọn, khối khác ẩn', kiem: 'thuoc-tinh', selector: '#p2', thuocTinh: 'hidden' },
        { moTa: 'Click Reviews ⇒ selected|||Bấm Reviews ⇒ được chọn', kiem: 'thuoc-tinh', selector: '#t2', thuocTinh: 'aria-selected', giaTri: 'true', truoc: [{ hanhDong: 'click', selector: '#t2' }] },
        { moTa: 'Click Reviews ⇒ only its panel is visible|||Bấm Reviews ⇒ chỉ khối của nó hiện', kiem: 'thuoc-tinh-js', selector: '#p1', thuocTinh: 'hidden', giaTri: true, truoc: [{ hanhDong: 'click', selector: '#t2' }] },
        { moTa: 'Hidden: the old tab is deselected|||Ẩn: tab cũ bị bỏ chọn', an: true, kiem: 'thuoc-tinh', selector: '#t1', thuocTinh: 'aria-selected', giaTri: 'false', truoc: [{ hanhDong: 'click', selector: '#t3' }] },
      ],
    },
  ],
};
