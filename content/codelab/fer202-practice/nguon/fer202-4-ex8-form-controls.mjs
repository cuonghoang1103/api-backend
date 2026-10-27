/**
 * FER202 · Exercise 8 — Form controls (bài luyện React-Bootstrap Form).
 */
import { doiDau, KHOA, reactNho } from './_chung.mjs';

const RB = ['react-bootstrap', 'bootstrap'];
const IMPORT = "import 'bootstrap/dist/css/bootstrap.min.css';\n";

export default doiDau({
  slug: 'fer202-4-ex8-form-controls',
  ten: '4.7 Exercise 8 — Form controls',
  khoa: KHOA,
  baiHoc: 'fer202-4-ex8-form-controls',
  de: [
    reactNho({
      tieuDe: 'Form groups with labels and help text',
      doKho: 'EASY', phut: 8, thuVien: RB,
      khaiNiem: ['Form.Group', 'controlId', 'Form.Label', 'Form.Text'], the: ['bootstrap', 'forms'],
      moTa: {
        en: '<p>Build an accessible sign-up form: every input has a label linked by <code>controlId</code>, and the password has a help text under it.</p>',
        vi: '<p>Dựng form đăng ký dễ tiếp cận: mỗi ô có nhãn nối bằng <code>controlId</code>, ô mật khẩu có dòng hướng dẫn bên dưới.</p>',
      },
      yeuCau: [
        { en: 'Groups <code>email</code> (type email, placeholder "name@example.com"), <code>password</code> (type password) with <code>Form.Text</code> "At least 8 characters.", <code>bio</code> (<code>as="textarea"</code>, 3 rows).', vi: 'Nhóm <code>email</code> (type email, placeholder "name@example.com"), <code>password</code> (type password) kèm <code>Form.Text</code> "At least 8 characters.", <code>bio</code> (<code>as="textarea"</code>, 3 dòng).' },
        { en: 'Each group has <code>className="mb-3"</code>; submit button <code>#btn-signup</code>.', vi: 'Mỗi nhóm có <code>className="mb-3"</code>; nút gửi <code>#btn-signup</code>.' },
      ],
      viDu: [{ input: '<Form.Group controlId="email"><Form.Label>Email</Form.Label><Form.Control … /></Form.Group>', output: '<label for="email"> … <input id="email" class="form-control">', explanation: 'controlId sets both the label\'s htmlFor and the input id.|||controlId đặt cả htmlFor của nhãn lẫn id của ô.' }],
      goiY: ['controlId ở Form.Group tự nối Label ↔ Control.', '<Form.Control as="textarea" rows={3} />'],
      loiHayGap: ['Nhãn không nối với ô (thiếu controlId/htmlFor) ⇒ bấm nhãn không focus được ô, trình đọc màn hình không đọc nhãn.', 'Dùng <code>&lt;input&gt;</code> trơn ⇒ mất class <code>form-control</code>.'],
      thuatNgu: [{ en: 'accessible', vi: 'dễ tiếp cận (cho cả người dùng trình đọc màn hình)' }, { en: 'help text', vi: 'dòng hướng dẫn' }],
      giaiThich: '<p><code>Form.Group controlId</code> là cách gọn nhất để nối nhãn với ô — bấm nhãn là focus ô, và công cụ hỗ trợ đọc được tên ô.</p>',
      dau: `// src/App.js — STARTER
${IMPORT}
export default function App() {
  return (
    <form>
      Email <input />
      Password <input />
      Bio <textarea />
      <button>Sign up</button>
    </form>
  );
}
`,
      giai: `// src/App.js — Form.Group controlId nối Label ↔ Control
${IMPORT}import { Button, Form } from 'react-bootstrap';

export default function App() {
  return (
    <Form className="p-3" style={{ maxWidth: 420 }}>
      <Form.Group className="mb-3" controlId="email">
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" placeholder="name@example.com" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" />
        <Form.Text muted>At least 8 characters.</Form.Text>
      </Form.Group>
      <Form.Group className="mb-3" controlId="bio">
        <Form.Label>Bio</Form.Label>
        <Form.Control as="textarea" rows={3} />
      </Form.Group>
      <Button id="btn-signup" type="submit">Sign up</Button>
    </Form>
  );
}
`,
      kiem: [
        { moTa: 'Labels linked to inputs', kiem: 'co-nhan', selector: '#email, #password, #bio' },
        { moTa: 'Inputs are form-controls with the right types', kiem: 'so-luong', selector: 'input#email.form-control[type=email], input#password.form-control[type=password], textarea#bio.form-control[rows="3"]', giaTri: 3 },
        { moTa: 'Help text under password', kiem: 'text', selector: '#password ~ .form-text', giaTri: 'At least 8 characters.' },
        { an: true, moTa: 'Three .mb-3 groups', kiem: 'so-luong', selector: 'form > .mb-3', giaTri: 3 },
      ],
    }),
    reactNho({
      tieuDe: 'Select, inline radios, checkboxes and a switch',
      doKho: 'MEDIUM', phut: 12, thuVien: RB,
      khaiNiem: ['Form.Select', 'Form.Check inline', 'type="switch"', 'controlled checkbox'], the: ['bootstrap', 'forms'],
      moTa: {
        en: '<p>A preferences form with every choice control. Make them <b>controlled</b> and print the current values in <code>#summary</code>.</p>',
        vi: '<p>Form tuỳ chọn có đủ loại ô lựa chọn. Làm chúng <b>controlled</b> và in giá trị hiện tại trong <code>#summary</code>.</p>',
      },
      yeuCau: [
        { en: '<code>#language</code> select (English, Vietnamese, Japanese; default English).', vi: '<code>#language</code> select (English, Vietnamese, Japanese; mặc định English).' },
        { en: 'Inline radios <code>#plan-free</code>, <code>#plan-pro</code> (name <code>plan</code>, default free); checkboxes <code>#topic-react</code>, <code>#topic-node</code>; switch <code>#dark</code>.', vi: 'Radio inline <code>#plan-free</code>, <code>#plan-pro</code> (name <code>plan</code>, mặc định free); checkbox <code>#topic-react</code>, <code>#topic-node</code>; công tắc <code>#dark</code>.' },
        { en: '<code>#summary</code>: <code>English · free · topics: none · dark: off</code>, updating live.', vi: '<code>#summary</code>: <code>English · free · topics: none · dark: off</code>, cập nhật trực tiếp.' },
      ],
      viDu: [{ input: 'select Japanese, pro, React, dark on', output: 'Japanese · pro · topics: React · dark: on', explanation: 'Checkbox groups are stored as an array.|||Nhóm checkbox lưu thành mảng.' }],
      goiY: ['<Form.Check inline type="radio" id="plan-pro" name="plan" label="Pro" checked={plan === "pro"} onChange={() => setPlan("pro")} />', '<Form.Check type="switch" id="dark" … /> — checked/onChange như checkbox.'],
      loiHayGap: ['Radio khác <code>name</code> ⇒ chọn được cả hai.', 'Đọc <code>e.target.value</code> cho checkbox ⇒ luôn "on"; phải đọc <code>e.target.checked</code>.'],
      thuatNgu: [{ en: 'switch', vi: 'công tắc (checkbox dạng gạt)' }, { en: 'inline', vi: 'nằm cùng một dòng' }],
      giaiThich: '<p><code>Form.Check</code> phục vụ cả radio, checkbox và switch; prop <code>inline</code> xếp chúng một dòng. Ô controlled đọc <code>checked</code> (checkbox/radio) hoặc <code>value</code> (select) từ state.</p>',
      dau: `// src/App.js — STARTER
${IMPORT}import { Form } from 'react-bootstrap';

export default function App() {
  // TODO: state + các ô controlled + #summary
  return (
    <Form className="p-3">
      <Form.Select id="language"><option>English</option></Form.Select>
      <p id="summary">English</p>
    </Form>
  );
}
`,
      giai: `// src/App.js — mọi ô lựa chọn đều controlled; topics là mảng
${IMPORT}import { useState } from 'react';
import { Form } from 'react-bootstrap';

const TOPICS = [{ id: 'react', label: 'React' }, { id: 'node', label: 'Node' }];

export default function App() {
  const [language, setLanguage] = useState('English');
  const [plan, setPlan] = useState('free');
  const [topics, setTopics] = useState([]);
  const [dark, setDark] = useState(false);

  const toggleTopic = (id) => setTopics((t) => (t.includes(id) ? t.filter((x) => x !== id) : [...t, id]));
  const topicText = TOPICS.filter((t) => topics.includes(t.id)).map((t) => t.label).join(', ') || 'none';

  return (
    <Form className="p-3" style={{ maxWidth: 420 }}>
      <Form.Group className="mb-3" controlId="language">
        <Form.Label>Language</Form.Label>
        <Form.Select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option>English</option>
          <option>Vietnamese</option>
          <option>Japanese</option>
        </Form.Select>
      </Form.Group>
      <div className="mb-3">
        <Form.Check inline type="radio" id="plan-free" name="plan" label="Free" checked={plan === 'free'} onChange={() => setPlan('free')} />
        <Form.Check inline type="radio" id="plan-pro" name="plan" label="Pro" checked={plan === 'pro'} onChange={() => setPlan('pro')} />
      </div>
      <div className="mb-3">
        {TOPICS.map((t) => (
          <Form.Check key={t.id} type="checkbox" id={´topic-@{t.id}´} label={t.label} checked={topics.includes(t.id)} onChange={() => toggleTopic(t.id)} />
        ))}
      </div>
      <Form.Check className="mb-3" type="switch" id="dark" label="Dark mode" checked={dark} onChange={(e) => setDark(e.target.checked)} />
      <p id="summary">{language} · {plan} · topics: {topicText} · dark: {dark ? 'on' : 'off'}</p>
    </Form>
  );
}
`,
      kiem: [
        { moTa: 'Initial summary', kiem: 'text', selector: '#summary', giaTri: 'English · free · topics: none · dark: off' },
        { moTa: 'All controls update the summary', kiem: 'text', selector: '#summary', giaTri: 'Japanese · pro · topics: React · dark: on', truoc: [{ hanhDong: 'doi', selector: '#language', giaTri: 'Japanese' }, { hanhDong: 'chon-o', selector: '#plan-pro' }, { hanhDong: 'chon-o', selector: '#topic-react' }, { hanhDong: 'chon-o', selector: '#dark' }] },
        { moTa: 'Radios are inline and share name="plan"', kiem: 'so-luong', selector: '.form-check-inline input[type=radio][name=plan]', giaTri: 2 },
        { moTa: 'Dark is a switch', kiem: 'ton-tai', selector: '.form-switch #dark' },
        { an: true, moTa: 'Topics listed in fixed order', kiem: 'text', selector: '#summary', giaTri: 'English · free · topics: React, Node · dark: off', truoc: [{ hanhDong: 'chon-o', selector: '#topic-node' }, { hanhDong: 'chon-o', selector: '#topic-react' }] },
      ],
    }),
    reactNho({
      tieuDe: 'Input groups and floating labels',
      doKho: 'MEDIUM', phut: 10, thuVien: RB,
      khaiNiem: ['InputGroup', 'InputGroup.Text', 'FloatingLabel'], the: ['bootstrap', 'forms'],
      moTa: {
        en: '<p>Two modern input styles: an <b>input group</b> with text before and after the input (a price field), and <b>floating labels</b> that sit inside the input and move up when you type.</p>',
        vi: '<p>Hai kiểu ô nhập hiện đại: <b>input group</b> có chữ trước và sau ô (ô giá tiền), và <b>floating label</b> nằm trong ô rồi bay lên khi gõ.</p>',
      },
      yeuCau: [
        { en: '<code>InputGroup#price-group</code>: <code>InputGroup.Text</code> "₫", <code>Form.Control#price</code> (type number), <code>InputGroup.Text</code> ".000".', vi: '<code>InputGroup#price-group</code>: <code>InputGroup.Text</code> "₫", <code>Form.Control#price</code> (type number), <code>InputGroup.Text</code> ".000".' },
        { en: '<code>FloatingLabel controlId="fullname" label="Full name"</code> and <code>FloatingLabel controlId="city" label="City"</code> with a <code>Form.Select</code>. Floating inputs need a <code>placeholder</code>.', vi: '<code>FloatingLabel controlId="fullname" label="Full name"</code> và <code>FloatingLabel controlId="city" label="City"</code> chứa <code>Form.Select</code>. Ô floating cần có <code>placeholder</code>.' },
      ],
      viDu: [{ input: '<FloatingLabel label="Full name"><Form.Control placeholder="Full name" /></FloatingLabel>', output: '<div class="form-floating"><input …><label>Full name</label></div>', explanation: 'The CSS uses :placeholder-shown, so a placeholder is required.|||CSS dựa vào :placeholder-shown nên bắt buộc có placeholder.' }],
      goiY: ['<InputGroup><InputGroup.Text>₫</InputGroup.Text><Form.Control /><InputGroup.Text>.000</InputGroup.Text></InputGroup>', 'FloatingLabel bọc ngoài Form.Control/Form.Select.'],
      loiHayGap: ['Floating label thiếu placeholder ⇒ nhãn đè lên chữ.', 'Đặt <code>InputGroup.Text</code> bên ngoài <code>InputGroup</code> ⇒ không dính vào ô.'],
      thuatNgu: [{ en: 'input group', vi: 'nhóm ô nhập kèm phần phụ' }, { en: 'floating label', vi: 'nhãn nổi' }],
      giaiThich: '<p><code>InputGroup</code> nối các phần thành một khối liền; <code>FloatingLabel</code> sinh <code>.form-floating</code> với ô trước, nhãn sau — trật tự đó và placeholder là điều kiện để hiệu ứng chạy.</p>',
      dau: `// src/App.js — STARTER
${IMPORT}
export default function App() {
  return (
    <form className="p-3">
      <input id="price" type="number" />
      <input id="fullname" />
      <select id="city"><option>Hanoi</option></select>
    </form>
  );
}
`,
      giai: `// src/App.js — InputGroup (phần phụ hai bên) + FloatingLabel (nhãn nổi, cần placeholder)
${IMPORT}import { FloatingLabel, Form, InputGroup } from 'react-bootstrap';

export default function App() {
  return (
    <Form className="p-3" style={{ maxWidth: 420 }}>
      <InputGroup id="price-group" className="mb-3">
        <InputGroup.Text>₫</InputGroup.Text>
        <Form.Control id="price" type="number" aria-label="Price in thousands" />
        <InputGroup.Text>.000</InputGroup.Text>
      </InputGroup>
      <FloatingLabel controlId="fullname" label="Full name" className="mb-3">
        <Form.Control placeholder="Full name" />
      </FloatingLabel>
      <FloatingLabel controlId="city" label="City">
        <Form.Select>
          <option>Hanoi</option>
          <option>Da Nang</option>
          <option>Ho Chi Minh City</option>
        </Form.Select>
      </FloatingLabel>
    </Form>
  );
}
`,
      kiem: [
        { moTa: 'Input group: ₫ · input · .000', kiem: 'danh-sach-text', selector: '#price-group > *', mongDoi: ['₫', '', '.000'] },
        { moTa: '#price is a number form-control inside the group', kiem: 'ton-tai', selector: '#price-group.input-group > input#price.form-control[type=number]' },
        { moTa: 'Two .form-floating blocks', kiem: 'so-luong', selector: '.form-floating > #fullname[placeholder] + label, .form-floating > select#city + label', giaTri: 2 },
      ],
    }),
    reactNho({
      tieuDe: 'Validation feedback with isInvalid',
      doKho: 'HARD', phut: 15, thuVien: RB,
      khaiNiem: ['isInvalid', 'isValid', 'Form.Control.Feedback', 'live validation'], the: ['bootstrap', 'forms', 'validation'],
      moTa: {
        en: '<p>Show Bootstrap feedback from your own validation (not the browser\'s): red border + message for invalid fields, green border for valid ones. Feedback appears only after the field was <b>touched</b> (changed at least once).</p>',
        vi: '<p>Hiện phản hồi kiểu Bootstrap từ luật kiểm của bạn (không phải của trình duyệt): viền đỏ + câu lỗi cho ô sai, viền xanh cho ô đúng. Phản hồi chỉ hiện sau khi ô đã được <b>chạm</b> (đổi ít nhất một lần).</p>',
      },
      yeuCau: [
        { en: '<code>#username</code>: 3–16 letters/digits ⇒ else <code>Username must be 3–16 letters or digits.</code>', vi: '<code>#username</code>: 3–16 chữ/số ⇒ sai thì <code>Username must be 3–16 letters or digits.</code>' },
        { en: '<code>#password</code>: ≥ 8 chars with a digit ⇒ else <code>Password needs 8+ characters and a number.</code>', vi: '<code>#password</code>: ≥ 8 ký tự có chữ số ⇒ sai thì <code>Password needs 8+ characters and a number.</code>' },
        { en: 'Use <code>isInvalid</code>/<code>isValid</code> + <code>Form.Control.Feedback type="invalid"</code>; nothing is coloured before the first change.', vi: 'Dùng <code>isInvalid</code>/<code>isValid</code> + <code>Form.Control.Feedback type="invalid"</code>; trước lần đổi đầu không tô màu gì.' },
      ],
      viDu: [{ input: 'username "ab"', output: 'is-invalid + message', explanation: 'touched.username becomes true on the first change.|||touched.username thành true ở lần đổi đầu tiên.' }],
      goiY: ['State: values + touched; const errors = validate(values) tính mỗi lần render.', 'isInvalid={touched.username && !!errors.username} isValid={touched.username && !errors.username}'],
      loiHayGap: ['Tô đỏ mọi ô ngay khi trang mở ⇒ trải nghiệm tệ.', 'Viết câu lỗi trong <code>&lt;p&gt;</code> thường ⇒ không ẩn/hiện theo <code>is-invalid</code> như <code>.invalid-feedback</code>.'],
      thuatNgu: [{ en: 'touched', vi: 'đã được người dùng tương tác' }, { en: 'feedback', vi: 'phản hồi (thông báo đúng/sai)' }],
      giaiThich: '<p><code>isInvalid</code>/<code>isValid</code> thêm class <code>is-invalid</code>/<code>is-valid</code>; <code>.invalid-feedback</code> ngay sau ô tự hiện khi ô có <code>is-invalid</code>. Lỗi là giá trị suy ra; cờ <code>touched</code> chỉ quyết định khi nào bắt đầu hiển thị.</p>',
      dau: `// src/App.js — STARTER
${IMPORT}import { Form } from 'react-bootstrap';

export default function App() {
  return (
    <Form className="p-3" noValidate>
      <Form.Control id="username" placeholder="Username" />
      <Form.Control id="password" type="password" placeholder="Password" />
    </Form>
  );
}
`,
      giai: `// src/App.js — lỗi SUY RA từ values; touched quyết định lúc hiển thị
${IMPORT}import { useState } from 'react';
import { Form } from 'react-bootstrap';

function validate({ username, password }) {
  const errors = {};
  if (!/^[A-Za-z0-9]{3,16}$/.test(username)) errors.username = 'Username must be 3–16 letters or digits.';
  if (password.length < 8 || !/\\d/.test(password)) errors.password = 'Password needs 8+ characters and a number.';
  return errors;
}

export default function App() {
  const [values, setValues] = useState({ username: '', password: '' });
  const [touched, setTouched] = useState({ username: false, password: false });
  const errors = validate(values);

  const change = (e) => {
    const { id, value } = e.target;
    setValues((v) => ({ ...v, [id]: value }));
    setTouched((t) => ({ ...t, [id]: true }));
  };
  const state = (f) => ({ isInvalid: touched[f] && !!errors[f], isValid: touched[f] && !errors[f] });

  return (
    <Form className="p-3" noValidate style={{ maxWidth: 380 }}>
      <Form.Group className="mb-3">
        <Form.Control id="username" placeholder="Username" value={values.username} onChange={change} {...state('username')} />
        <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Control id="password" type="password" placeholder="Password" value={values.password} onChange={change} {...state('password')} />
        <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
      </Form.Group>
    </Form>
  );
}
`,
      kiem: [
        { moTa: 'Nothing coloured at first', kiem: 'so-luong', selector: '.is-invalid, .is-valid', giaTri: 0 },
        { moTa: 'Short username ⇒ is-invalid + message', kiem: 'text', selector: '#username.is-invalid + .invalid-feedback', giaTri: 'Username must be 3–16 letters or digits.', truoc: [{ hanhDong: 'nhap', selector: '#username', giaTri: 'ab' }] },
        { moTa: 'Valid username ⇒ is-valid', kiem: 'ton-tai', selector: '#username.is-valid', truoc: [{ hanhDong: 'nhap', selector: '#username', giaTri: 'cuong2006' }] },
        { moTa: 'Password without a digit ⇒ message', kiem: 'text', selector: '#password.is-invalid + .invalid-feedback', giaTri: 'Password needs 8+ characters and a number.', truoc: [{ hanhDong: 'nhap', selector: '#password', giaTri: 'abcdefgh' }] },
        { an: true, moTa: 'Untouched password stays neutral', kiem: 'so-luong', selector: '#password.is-invalid, #password.is-valid', giaTri: 0, truoc: [{ hanhDong: 'nhap', selector: '#username', giaTri: 'ab' }] },
        { an: true, moTa: 'Strong password ⇒ is-valid', kiem: 'ton-tai', selector: '#password.is-valid', truoc: [{ hanhDong: 'nhap', selector: '#password', giaTri: 'react2026' }] },
      ],
    }),
  ],
});
