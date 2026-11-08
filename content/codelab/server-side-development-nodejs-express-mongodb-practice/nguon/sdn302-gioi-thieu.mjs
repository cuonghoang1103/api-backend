/** SDN302 · 0.1 — Giới thiệu & bản đồ kiến trúc back-end: đường đi của một request, ranh giới tin cậy ("đừng tin client"), không bao giờ trả mật khẩu/secret. */
import { doiDau, KHOA, bai, cs, q, qn, ord, tn } from './_sdn.mjs';

const J = String.raw;

const E1 = cs({
  ten: 'How a request flows through your server', kho: 'EASY', phut: 5, loai: 'order',
  en: 'The flow diagram of lesson 0.1, step by step.',
  vi: 'Sơ đồ luồng của bài 0.1, từng bước.',
  cau: [
    ord('f1', ['Order the steps of one request from the React app to MongoDB and back.', 'Sắp các bước của một request từ app React tới MongoDB rồi quay về.'],
      ['Client (React): <code>fetch</code>/<code>axios</code> sends an HTTP request', 'Express: the route matches and the middleware chain runs', 'Controller: validates the input and calls the service', 'Mongoose model: queries MongoDB', 'JSON response goes back to the client'],
      ['This is the map of the whole course: Chapter 1–2 build the Express part, Chapter 3 the Mongoose part, Chapter 4 the controller/service layers, Chapter 5 the security in the middleware chain, Chapter 6 the client side.', 'Đây là bản đồ của cả môn: Chương 1–2 dựng phần Express, Chương 3 phần Mongoose, Chương 4 tầng controller/service, Chương 5 phần bảo mật trong chuỗi middleware, Chương 6 phía client.']),
    ord('f2', ['Order the chapters of the journey.', 'Sắp các chương của hành trình.'],
      ['Node.js foundations (event loop, modules, HTTP module)', 'Express (routing, middleware, generator)', 'MongoDB & Mongoose (CRUD, schema, population)', 'REST API in MVC (+ EJS/Handlebars)', 'Auth & security (bcrypt, sessions, JWT, CORS, uploads)', 'Integrate React & deploy (+ BaaS)'],
      ['Each step uses the previous one: you cannot write a Mongoose controller before you can write an Express route.', 'Mỗi bước dùng bước trước: không thể viết controller Mongoose trước khi viết được route Express.']),
  ],
  goiY: [['Follow the arrow of the lesson\'s diagram.', 'Đi theo mũi tên trong sơ đồ của bài.'], ['The database is the deepest layer.', 'CSDL là tầng sâu nhất.']],
  loi: [['Putting validation after the database call.', 'Đặt kiểm tra sau lời gọi CSDL.'], ['Thinking React talks to MongoDB directly.', 'Tưởng React nói chuyện thẳng với MongoDB.']],
  tns: [tn('back-end', 'phía server'), tn('MERN', 'MongoDB, Express, React, Node')],
  kn: ['architecture'],
});

const E2 = cs({
  ten: 'The trust boundary: what the server must never do', kho: 'EASY', phut: 6,
  en: 'The mindset shift of the lesson: on the server you own the data, the rules and the trust boundary.',
  vi: 'Cú chuyển tư duy của bài: trên server bạn sở hữu dữ liệu, luật và ranh giới tin cậy.',
  cau: [
    q('b1', ['The React form disables the "price" field for normal users. Is the API safe if it accepts <code>price</code> from the body?', 'Form React khoá ô "price" với người dùng thường. API có an toàn không nếu nó nhận <code>price</code> từ body?'],
      ['No — anyone can send any body with Postman or curl; the server must decide what is accepted', 'Yes — a disabled input cannot be submitted', 'Yes — CORS blocks requests that are not from the form', 'Only if the request uses HTTPS'],
      ['The UI is a convenience, not a security layer. Every rule must be enforced on the server.', 'Giao diện là tiện ích, không phải lớp bảo mật. Mọi luật phải được thực thi trên server.']),
    q('b2', ['Which response is acceptable after creating a user?', 'Câu trả lời nào chấp nhận được sau khi tạo người dùng?'],
      ['<code>{ "id": "…", "name": "An", "email": "an@x.com" }</code>', '<code>{ "id": "…", "email": "an@x.com", "password": "$2b$10$…" }</code>', '<code>{ "user": { … }, "jwtSecret": "…" }</code>', '<code>{ "id": "…", "passwordPlain": "secret123" }</code>'],
      ['Never send a password (plain or hashed) or a secret back — "never send a password or secret back".', 'Không bao giờ gửi lại mật khẩu (thô hay đã băm) hay secret — "never send a password or secret back".']),
    qn('b3', ['Which inputs must the server validate? (choose all)', 'Đầu vào nào server phải kiểm tra? (chọn hết)'],
      ['The JSON body', 'Route parameters like <code>:id</code>', 'Query strings like <code>?page=2</code>', 'Headers like <code>Authorization</code>', 'The constants written in your own code'],
      [0, 1, 2, 3],
      ['Everything that arrives over the network is client input. Only your own code is trusted.', 'Mọi thứ đến qua mạng đều là đầu vào của client. Chỉ mã của chính bạn là đáng tin.']),
  ],
  goiY: [['Imagine the request was typed by hand in Postman.', 'Tưởng tượng request được gõ tay trong Postman.'], ['What would an attacker love to read?', 'Kẻ tấn công thích đọc gì?']],
  loi: [['Trusting front-end validation.', 'Tin vào kiểm tra ở front-end.'], ['Returning whole user documents.', 'Trả nguyên document người dùng.']],
  tns: [tn('trust boundary', 'ranh giới tin cậy'), tn('validation', 'kiểm tra dữ liệu vào')],
  kn: ['security mindset'],
});

const E3 = bai({
  ten: 'Never send a password back: toPublicUser(user)', kho: 'MEDIUM', phut: 10, lib: [],
  en: J`<p>Write <code>toPublicUser(user)</code> that turns a user record (as it comes from the database) into what the API may send to a client:</p>
<pre>{ id, name, email, role }</pre>
<ul><li><code>id</code> is <code>String(user._id)</code> (or <code>user.id</code> if there is no <code>_id</code>);</li>
<li>every other field is dropped — <code>password</code>, <code>resetToken</code>, <code>__v</code>, and anything added to the model later;</li>
<li>a missing <code>role</code> becomes <code>"user"</code>; the input object must not be modified.</li></ul>
<p>Also write <code>toPublicUsers(list)</code> for arrays.</p>`,
  vi: J`<p>Viết <code>toPublicUser(user)</code> biến một bản ghi người dùng (như lấy từ CSDL) thành thứ API được gửi cho client:</p>
<pre>{ id, name, email, role }</pre>
<ul><li><code>id</code> là <code>String(user._id)</code> (hoặc <code>user.id</code> nếu không có <code>_id</code>);</li>
<li>mọi field khác bị bỏ — <code>password</code>, <code>resetToken</code>, <code>__v</code>, và bất cứ thứ gì model thêm về sau;</li>
<li>thiếu <code>role</code> thì thành <code>"user"</code>; không được sửa đối tượng đầu vào.</li></ul>
<p>Viết thêm <code>toPublicUsers(list)</code> cho mảng.</p>`,
  yc: [
    ['Build a NEW object from an allow-list of fields (do not <code>delete</code> from the original).', 'Dựng đối tượng MỚI từ danh sách field cho phép (không <code>delete</code> trên bản gốc).'],
    ['<code>toPublicUsers</code> uses <code>map</code>.', '<code>toPublicUsers</code> dùng <code>map</code>.'],
  ],
  viDu: [['toPublicUser({ _id: "u1", name: "An", email: "an@x.com", password: "$2b$10$…", __v: 0 })', '{"id":"u1","name":"An","email":"an@x.com","role":"user"}', 'Allow-list: only four fields survive.', 'Danh sách cho phép: chỉ bốn field còn lại.']],
  goiY: [
    ['<code>return { id: String(user._id ?? user.id), name: user.name, email: user.email, role: user.role || \'user\' };</code>', '<code>return { id: String(user._id ?? user.id), name: user.name, email: user.email, role: user.role || \'user\' };</code>'],
    ['An allow-list is safer than a block-list: a field added next month (e.g. <code>otpSecret</code>) is hidden automatically.', 'Danh sách cho phép an toàn hơn danh sách cấm: field thêm tháng sau (vd <code>otpSecret</code>) tự động bị giấu.'],
  ],
  loi: [
    ['<code>delete user.password; return user;</code> — mutates the caller\'s object and forgets <code>resetToken</code>.', '<code>delete user.password; return user;</code> — sửa đối tượng của bên gọi và quên <code>resetToken</code>.'],
    ['<code>const { password, ...rest } = user; return rest;</code> — a block-list: the next secret field leaks.', '<code>const { password, ...rest } = user; return rest;</code> — danh sách cấm: field bí mật tiếp theo sẽ lộ.'],
  ],
  gt: [
    'An allow-list states what may leave the server; everything else stays inside by default. That is the safest way to honour "never send a password or secret back", and it keeps the response shape stable for the React app even when the database model grows.',
    'Danh sách cho phép nói rõ cái gì được rời server; mọi thứ khác mặc định ở lại. Đó là cách an toàn nhất để giữ "never send a password or secret back", và giữ hình dạng câu trả lời ổn định cho app React ngay cả khi model CSDL lớn dần.',
  ],
  kn: ['allow-list', 'response shaping'],
  tns: [tn('allow-list', 'danh sách cho phép'), tn('block-list', 'danh sách cấm')],
  dau: J`function toPublicUser(user) {
  delete user.password;
  return user;
}
function toPublicUsers(list) {
  return list;
}
`,
  giai: J`// allow-list: name exactly what may leave the server; everything else stays inside
function toPublicUser(user) {
  return {
    id: String(user._id ?? user.id),     // MongoDB's _id, as a string
    name: user.name,
    email: user.email,
    role: user.role || 'user',
  };
}

function toPublicUsers(list) {
  return list.map(toPublicUser);          // a new array of new objects; the input is untouched
}
`,
  chuanBi: `const an = { _id: 'u1', name: 'An', email: 'an@x.com', password: '$2b$10$abc', resetToken: 'r-123', __v: 0, role: 'admin' };`,
  cases: [
    { goi: `toPublicUser(an)`, moTa: ['Only id, name, email, role', 'Chỉ id, name, email, role'] },
    { goi: `(toPublicUser(an), an.password)`, moTa: ['The input is not modified', 'Không sửa đầu vào'] },
    { goi: `toPublicUser({ id: 'u2', name: 'Bao', email: 'b@x.com', password: 'x' })`, moTa: ['No _id → id; no role → "user"', 'Không _id → id; không role → "user"'] },
    { goi: `toPublicUsers([an, { _id: 7, name: 'C', email: 'c@x.com', otpSecret: 'JBSWY3DP' }])`, an: true },
    { goi: `JSON.stringify(toPublicUsers([an])).includes('r-123')`, an: true },
  ],
});

const E4 = bai({
  ten: 'Never trust the client: accept a registration body', kho: 'MEDIUM', phut: 15, lib: [],
  en: J`<p>Write <code>readRegistration(body)</code>, the first thing a register endpoint should do with <code>req.body</code>. Return</p>
<pre>{ ok: true, data: { name, email, password, role: 'user' } }   // or
{ ok: false, errors: ['…', …] }</pre>
<ul><li>accept only <code>name</code>, <code>email</code>, <code>password</code>; anything else (<code>role</code>, <code>isAdmin</code>, <code>_id</code>…) is ignored — <code>role</code> is ALWAYS <code>'user'</code>;</li>
<li><code>name</code>: a string, trimmed, not empty ⇒ else <code>"name is required"</code>;</li>
<li><code>email</code>: a string, trimmed + lower-cased, containing exactly one <code>@</code> with text on both sides ⇒ else <code>"email is invalid"</code>;</li>
<li><code>password</code>: a string of 8+ characters (not trimmed) ⇒ else <code>"password must have 8+ characters"</code>;</li>
<li>errors in this order; <code>body</code> may be <code>undefined</code> or not an object (treat it as <code>{}</code>).</li></ul>`,
  vi: J`<p>Viết <code>readRegistration(body)</code>, việc đầu tiên một endpoint đăng ký nên làm với <code>req.body</code>. Trả</p>
<pre>{ ok: true, data: { name, email, password, role: 'user' } }   // hoặc
{ ok: false, errors: ['…', …] }</pre>
<ul><li>chỉ nhận <code>name</code>, <code>email</code>, <code>password</code>; mọi thứ khác (<code>role</code>, <code>isAdmin</code>, <code>_id</code>…) bị bỏ qua — <code>role</code> LUÔN là <code>'user'</code>;</li>
<li><code>name</code>: chuỗi, đã trim, không rỗng ⇒ không thì <code>"name is required"</code>;</li>
<li><code>email</code>: chuỗi, đã trim + chữ thường, có đúng một <code>@</code> với chữ ở hai bên ⇒ không thì <code>"email is invalid"</code>;</li>
<li><code>password</code>: chuỗi 8+ ký tự (không trim) ⇒ không thì <code>"password must have 8+ characters"</code>;</li>
<li>lỗi theo đúng thứ tự này; <code>body</code> có thể là <code>undefined</code> hoặc không phải object (coi như <code>{}</code>).</li></ul>`,
  yc: [
    ['Check types first: <code>typeof x === \'string\'</code> — a client can send <code>"name": ["An"]</code>.', 'Kiểm kiểu trước: <code>typeof x === \'string\'</code> — client gửi được <code>"name": ["An"]</code>.'],
    ['Collect ALL errors, do not stop at the first one.', 'Gom HẾT lỗi, đừng dừng ở lỗi đầu.'],
  ],
  viDu: [['readRegistration({ name: " An ", email: " AN@X.COM ", password: "secret123", role: "admin" })', '{"ok":true,"data":{"name":"An","email":"an@x.com","password":"secret123","role":"user"}}', 'role "admin" from the client is ignored.', 'role "admin" từ client bị bỏ qua.'], ['readRegistration({ email: "nope", password: "123" })', '{"ok":false,"errors":["name is required","email is invalid","password must have 8+ characters"]}', 'Three errors, in order.', 'Ba lỗi, đúng thứ tự.']],
  goiY: [
    ['<code>const b = body && typeof body === \'object\' ? body : {};</code>', '<code>const b = body && typeof body === \'object\' ? body : {};</code>'],
    ['Email check: <code>const parts = email.split(\'@\'); const valid = parts.length === 2 && parts[0] && parts[1];</code>', 'Kiểm email: <code>const parts = email.split(\'@\'); const valid = parts.length === 2 && parts[0] && parts[1];</code>'],
  ],
  loi: [
    ['<code>return { ok: true, data: { ...body } }</code> — the client chooses its own <code>role</code>: privilege escalation in one field.', '<code>return { ok: true, data: { ...body } }</code> — client tự chọn <code>role</code>: leo thang đặc quyền chỉ bằng một field.'],
    ['<code>body.name.trim()</code> without a type check: <code>{"name": 5}</code> crashes the handler (500).', '<code>body.name.trim()</code> không kiểm kiểu: <code>{"name": 5}</code> làm sập handler (500).'],
    ['Trimming the password — "secret123 " and "secret123" are different passwords.', 'Trim mật khẩu — "secret123 " và "secret123" là hai mật khẩu khác nhau.'],
  ],
  gt: [
    'The body is untrusted until proven otherwise: choose the fields you accept, normalise them (trim, lower-case), validate types and values, and set the privileged ones (<code>role</code>) yourself. Returning all errors at once lets the React form highlight every field in one round trip — and this function is exactly the kind of "validate at the edge" step lesson 8.2 asks for.',
    'Body là không tin được cho tới khi chứng minh được: chọn field bạn nhận, chuẩn hoá chúng (trim, chữ thường), kiểm kiểu và giá trị, và tự đặt các field đặc quyền (<code>role</code>). Trả mọi lỗi cùng lúc giúp form React tô đỏ mọi ô trong một lượt — và hàm này chính là bước "kiểm tra ở rìa" mà bài 8.2 yêu cầu.',
  ],
  kn: ['input validation', 'mass assignment'],
  tns: [tn('privilege escalation', 'leo thang đặc quyền'), tn('normalise', 'chuẩn hoá')],
  dau: J`function readRegistration(body) {
  if (!body.name) return { ok: false, errors: ['name is required'] };
  return { ok: true, data: { ...body } };
}
`,
  giai: J`function readRegistration(body) {
  const b = body && typeof body === 'object' ? body : {};
  const errors = [];

  // accept ONLY these three fields, check their TYPE before touching them
  const name = typeof b.name === 'string' ? b.name.trim() : '';
  if (!name) errors.push('name is required');

  const email = typeof b.email === 'string' ? b.email.trim().toLowerCase() : '';
  const parts = email.split('@');
  if (!(parts.length === 2 && parts[0] && parts[1])) errors.push('email is invalid');

  const password = typeof b.password === 'string' ? b.password : '';   // never trim a password
  if (password.length < 8) errors.push('password must have 8+ characters');

  if (errors.length) return { ok: false, errors };
  return { ok: true, data: { name, email, password, role: 'user' } };   // role is decided by the SERVER
}
`,
  cases: [
    { goi: `readRegistration({ name: ' An ', email: ' AN@X.COM ', password: 'secret123', role: 'admin', isAdmin: true })`, moTa: ['Normalised data, role forced to "user"', 'Dữ liệu chuẩn hoá, role bị ép "user"'] },
    { goi: `readRegistration({ email: 'nope', password: '123' })`, moTa: ['All three errors in order', 'Cả ba lỗi đúng thứ tự'] },
    { goi: `[readRegistration(undefined), readRegistration('hello')]`, moTa: ['A missing or non-object body', 'Body thiếu hoặc không phải object'] },
    { goi: `readRegistration({ name: ['An'], email: 'a@@x.com', password: 'secret123 ' })`, an: true },
    { goi: `readRegistration({ name: 'An', email: '@x.com', password: 12345678 })`, an: true },
    { goi: `readRegistration({ name: 'An', email: 'a@x', password: '        ' })`, an: true },
  ],
});

export default doiDau({
  slug: 'sdn302-gioi-thieu',
  ten: '0.1 About SDN302 & the back-end architecture map',
  khoa: KHOA,
  baiHoc: 'sdn302-gioi-thieu',
  de: [E1, E2, E3, E4],
});
