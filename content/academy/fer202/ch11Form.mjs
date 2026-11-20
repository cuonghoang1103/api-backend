/**
 * FER202 · 11.5 — Forms with validation, .env, confirmed delete & bulk writes (PE-style, in depth).
 * Soạn 20/11/2026 theo yêu cầu người học: bài đọc trước đây còn mỏng ở .find, for…of + await,
 * checkbox có checked, isInvalid/Feedback, .env, window.confirm (Code Lab đã có, bài đọc chưa).
 * Nguồn mẫu đã kiểm: lời giải Code Lab PE (Sneaker, Plant Shop, Company, Attendance, Lecturer Workload).
 */
import { bi, books } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202';
const PE_LAB = `/code-lab/fer202-practice${REF}`;
const KHOA = '/courses/front-end-web-development-with-react/learn?lessonSlug=';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const js = (s) => `<pre><code class="language-javascript">${esc(s.trim())}</code></pre>`;
const sh = (s) => `<pre><code class="language-bash">${esc(s.trim())}</code></pre>`;

/* ─────────────────────────── code dùng chung cho cả hai ngôn ngữ ─────────────────────────── */
const C_STATE = `
const EMPTY = { name: '', brand: '', category: '', price: '', isHot: false };
const [form, setForm] = useState(EMPTY);   // ONE object for the whole form

// ONE handler for every field: the input's name attribute picks the key
const handleChange = (e) => {
  const { name, value, type, checked } = e.target;
  setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
};

<Form.Control name="name" value={form.name} onChange={handleChange} />
<Form.Select name="category" value={form.category} onChange={handleChange}>
  <option value="">-- Select category --</option>
  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
</Form.Select>
<Form.Check type="switch" id="isHot" name="isHot" label="Hot item"
            checked={form.isHot} onChange={handleChange} />`;

const C_VALIDATE = `
const isValidUrl = (v) => {
  try { const u = new URL(v); return u.protocol === 'http:' || u.protocol === 'https:'; }
  catch { return false; }
};
const todayLocal = () => {                       // "YYYY-MM-DD" in LOCAL time
  const d = new Date();
  return \`\${d.getFullYear()}-\${String(d.getMonth() + 1).padStart(2, '0')}-\${String(d.getDate()).padStart(2, '0')}\`;
};

// returns { field: message } — an EMPTY object means "valid"
function validate(f) {
  const e = {};
  const name = f.name.trim();
  if (!name) e.name = 'Name is required.';
  else if (name.length < 2) e.name = 'Name must contain at least 2 characters.';

  if (f.brand.trim().split(/\\s+/).filter(Boolean).length < 2)
    e.brand = 'Brand name must consist of at least 2 words.';

  if (!f.category) e.category = 'Please select a category.';

  const price = String(f.price).trim();
  if (price === '') e.price = 'Price is required.';
  else if (!/^[1-9]\\d{0,2}$/.test(price)) e.price = 'Price must be a positive integer of at most 3 digits.';

  if (f.stock === '') e.stock = 'Stock is required.';          // "" is an error...
  else if (!(Number(f.stock) >= 0)) e.stock = 'Stock must be >= 0.'; // ...but "0" is valid

  if (f.image && !isValidUrl(f.image.trim())) e.image = 'Image must be a valid URL.';
  if (f.date && f.date > todayLocal()) e.date = 'Date cannot be in the future.';
  return e;
}`;

const C_FEEDBACK = `
const [errors, setErrors] = useState({});

<Form noValidate onSubmit={handleSubmit}>
  <Form.Group className="mb-3">
    <Form.Label>Name</Form.Label>
    <Form.Control name="name" value={form.name} onChange={handleChange}
                  isInvalid={!!errors.name} />           {/* red border */}
    <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
  </Form.Group>
  ...
  <Button type="submit">Save</Button>                   {/* NOT disabled when invalid */}
</Form>

// Variant: all messages in one red box
{Object.values(errors).length > 0 && (
  <Alert variant="danger">
    <ul className="mb-0">{Object.values(errors).map((m) => <li key={m}>{m}</li>)}</ul>
  </Alert>
)}

// Re-check while typing once an error is visible, so it disappears as soon as it is fixed
const handleChange2 = (e) => {
  const next = { ...form, [e.target.name]: e.target.value };
  setForm(next);
  if (errors[e.target.name]) setErrors(validate(next));
};`;

const C_ADDEDIT = `
// App.js — static path BEFORE the dynamic one
<Route path="/items/add" element={<ItemForm />} />
<Route path="/items/:id/edit" element={<ItemForm />} />

// ItemForm.js — one component, two modes
const { id } = useParams();
const isEdit = Boolean(id);
const navigate = useNavigate();
const [submitting, setSubmitting] = useState(false);

useEffect(() => {
  if (!isEdit) { setForm(EMPTY); return; }
  axios.get(\`\${API}/items/\${id}\`).then((res) => {
    const d = res.data;                              // pre-fill with the current data
    setForm({ name: d.name, brand: d.brand, category: d.category,
              price: String(d.price), isHot: Boolean(d.isHot) });
  });
}, [id, isEdit]);

const handleSubmit = async (e) => {
  e.preventDefault();                                 // stop the browser reloading the page
  const errs = validate(form);
  setErrors(errs);
  if (Object.keys(errs).length > 0) return;           // invalid ⇒ NO request at all

  const payload = { ...form, name: form.name.trim(), price: Number(form.price) }; // store a NUMBER
  setSubmitting(true);
  try {
    if (isEdit) await axios.put(\`\${API}/items/\${id}\`, { ...payload, id }); // PUT = the WHOLE record
    else await axios.post(\`\${API}/items\`, payload);                        // server creates the id
    navigate('/items');                               // the list page re-fetches on mount
  } catch (err) {
    setErrors({ form: 'Could not save. Is json-server running?' });
  } finally {
    setSubmitting(false);
  }
};

<Button type="submit" disabled={submitting}>{isEdit ? 'Update' : 'Add'}</Button>`;

const C_ENV = `
# .env  — next to package.json (NOT inside src/)
REACT_APP_API_URL=http://localhost:9999      # Create React App: must start with REACT_APP_
# VITE_API_URL=http://localhost:9999         # Vite: must start with VITE_`;

const C_ENV_JS = `
// src/api.js
import axios from 'axios';
export const API = process.env.REACT_APP_API_URL;      // CRA
// export const API = import.meta.env.VITE_API_URL;    // Vite

export const getItems   = ()         => axios.get(\`\${API}/items\`).then((r) => r.data);
export const updateItem = (id, data) => axios.put(\`\${API}/items/\${id}\`, data).then((r) => r.data);
export const deleteItem = (id)       => axios.delete(\`\${API}/items/\${id}\`);`;

const C_DELETE = `
const [items, setItems] = useState([]);
const [message, setMessage] = useState('');

const load = () => axios.get(\`\${API}/items\`).then((res) => setItems(res.data));
useEffect(() => { load(); }, []);

const handleDelete = async (item) => {
  // 1) confirm FIRST — Cancel ⇒ stop, nothing is sent
  if (!window.confirm(\`Are you sure you want to delete "\${item.name}"?\`)) return;
  try {
    await axios.delete(\`\${API}/items/\${item.id}\`);
    setMessage(\`Item "\${item.name}" deleted successfully.\`);   // 2) tell the user
    load();                                                     // 3) reload the list
    // or, without a second request:
    // setItems((prev) => prev.filter((i) => i.id !== item.id));
  } catch {
    setMessage('Delete failed.');
  }
};

// auto-hide the message after 3 s (only if the paper asks)
useEffect(() => {
  if (!message) return;
  const t = setTimeout(() => setMessage(''), 3000);
  return () => clearTimeout(t);                                 // cleanup
}, [message]);`;

const C_BULK = `
const [rows, setRows] = useState([]);
const [selected, setSelected] = useState([]);                 // ids of the ticked rows

const toggle = (id, checked) =>
  setSelected((prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id)));

const selectable = rows.filter((r) => r.status !== 'CLOSED');
const allTicked = selectable.length > 0 && selectable.every((r) => selected.includes(r.id));
const toggleAll = (checked) => setSelected(checked ? selectable.map((r) => r.id) : []);

// header cell + one cell per row
<input type="checkbox" checked={allTicked} onChange={(e) => toggleAll(e.target.checked)} />
<input type="checkbox" className="form-check-input"
       checked={selected.includes(r.id)}            // controlled: React decides the tick
       disabled={r.status === 'CLOSED'}             // shown but locked
       onChange={(e) => toggle(r.id, e.target.checked)} />`;

const C_BULK_SEND = `
const handleCloseSelected = async () => {
  setError(''); setSuccess('');
  if (subject?.status === 'INACTIVE') return setError('This subject is inactive. Classes cannot be updated.');
  if (selected.length === 0) return setError('Please select at least one class to close.');

  // A) one by one, in order — easiest to read, what most papers expect
  for (const id of selected) {
    await axios.patch(\`\${API}/classes/\${id}\`, { status: 'CLOSED' });
  }

  // B) all at once (faster): await Promise.all(selected.map((id) => axios.patch(...)))
  // C) keep going when some fail and count them:
  //    const results = await Promise.allSettled(selected.map((id) => axios.patch(...)));
  //    const ok = results.filter((r) => r.status === 'fulfilled').length;

  setSuccess(\`\${selected.length} class(es) closed successfully.\`);
  setSelected([]);
  const res = await axios.get(\`\${API}/classes?subjectId=\${subjectId}\`);   // reload
  setRows(res.data);
};

// ❌ TRAP — forEach does NOT wait: the success message and the reload run BEFORE the PATCHes finish
selected.forEach(async (id) => { await axios.patch(\`\${API}/classes/\${id}\`, { status: 'CLOSED' }); });`;

const C_FIND = `
// .filter ⇒ an ARRAY (0..n items)      .find ⇒ ONE item or undefined
const lecturerClasses = classes.filter((c) => c.lecturerName === name);
const subject = subjects.find((s) => s.id === cls.subjectId);

// join two collections: show a NAME instead of an id
const subjectCode = (sid) => subjects.find((s) => String(s.id) === String(sid))?.code ?? 'Unknown';

// sum through a join
const totalCredits = lecturerClasses.reduce((sum, c) => {
  const s = subjects.find((x) => x.id === c.subjectId);
  return sum + (s ? s.credits : 0);       // guard: an id with no match must not crash
}, 0);`;

const C_HACK = `
# Anyone can skip your React form and call the API directly:
curl -X PATCH http://localhost:9999/classes/65bb00000000000000000004 \\
     -H "Content-Type: application/json" -d '{"status":"OPEN","credits":999}'
# json-server accepts it. A real back-end must validate again on the server.`;

/* ─────────────────────────────────────────── bài học ─────────────────────────────────────────── */
const FORM_PE = {
  title: '11.5 — Forms with validation, .env, confirmed delete & bulk updates (PE in depth)|||11.5 — Form kiểm lỗi, .env, xoá có xác nhận & cập nhật hàng loạt (chuyên sâu theo PE)',
  slug: 'fer202-11-5-form-env-delete-bulk',
  type: 'DOCUMENT',
  description: 'Nửa "ghi dữ liệu" của mọi đề PE: form nhiều ô một state, hàm validate trả về lỗi từng ô (isInvalid + Feedback), form Thêm/Sửa dùng chung (POST/PUT, pre-fill, navigate), URL API ở .env, xoá có window.confirm + thông báo + tải lại, chọn nhiều bằng checkbox + PATCH hàng loạt (for…of vs Promise.all vs forEach), .find để nối dữ liệu; góc hacker: kiểm ở client chưa đủ, bấm hai lần, .env không giấu được bí mật.',
  content: [
    bi(
      `<span class="eyebrow">Chapter 11 · Lesson 11.5 · PE deep dive</span>
<h2>The "write" half of every PE paper</h2>
<p class="lead">Lessons 11.1–11.2 taught you to <strong>read</strong> data (GET). In a real FER202 PE, roughly half of the marks are for <strong>writing</strong> it back: a form that refuses bad input, an Add/Edit page, a Delete button that asks first, a "close all selected" button. This lesson is the complete toolkit for that half, built from the PE papers in the Code Lab (Sneaker, Plant Shop, Company, Attendance, Lecturer Workload).</p>
<div class="callout"><b>Everyday picture.</b> A bank teller checks your ID and the form <em>before</em> sending anything to head office: wrong field ⇒ they point at the box and say why. Only a clean form goes through, and they tell you "done" at the end. Your React form is that teller; json-server is head office.</div>
<h3>What you will be able to do</h3>
<ul>
<li>Hold a whole form in <strong>one state object</strong> with <strong>one</strong> change handler (text, select, checkbox, switch).</li>
<li>Write a <code>validate()</code> that returns an error per field, and show it the Bootstrap way.</li>
<li>Build <strong>one</strong> component for both Add and Edit (POST vs PUT, pre-fill, navigate).</li>
<li>Move the API URL to <code>.env</code> (some papers give <strong>0 points</strong> for a hard-coded URL).</li>
<li>Delete with confirmation, a message and a reload; tick many rows and PATCH them all.</li>
<li>Avoid the traps that cost marks: <code>forEach</code> + <code>await</code>, strings vs numbers, a disabled submit button.</li>
</ul>`,
      `<span class="eyebrow">Chương 11 · Bài 11.5 · Chuyên sâu theo PE</span>
<h2>Nửa "ghi dữ liệu" của mọi đề PE</h2>
<p class="lead">Bài 11.1–11.2 dạy bạn <strong>đọc</strong> dữ liệu (GET). Trong đề PE FER202 thật, khoảng một nửa số điểm nằm ở việc <strong>ghi</strong> dữ liệu: form chặn dữ liệu sai, trang Thêm/Sửa, nút Xoá hỏi lại trước khi xoá, nút "đóng các mục đã chọn". Bài này là bộ đồ nghề trọn vẹn cho nửa đó, rút ra từ chính các đề PE trong Code Lab (Sneaker, Plant Shop, Company, Attendance, Lecturer Workload).</p>
<div class="callout"><b>Liên tưởng đời thường.</b> Giao dịch viên ngân hàng kiểm giấy tờ và tờ khai của bạn <em>trước</em> khi gửi lên hội sở: ô nào sai thì chỉ đúng ô đó và nói lý do. Chỉ tờ khai sạch mới được gửi đi, xong thì báo "đã xong". Form React của bạn chính là giao dịch viên; json-server là hội sở.</div>
<h3>Học xong bạn làm được</h3>
<ul>
<li>Giữ cả form trong <strong>một object state</strong> với <strong>một</strong> hàm onChange (ô chữ, select, checkbox, switch).</li>
<li>Viết <code>validate()</code> trả lỗi cho từng ô và hiện lỗi đúng kiểu Bootstrap.</li>
<li>Dựng <strong>một</strong> component cho cả Thêm và Sửa (POST hay PUT, điền sẵn, chuyển trang).</li>
<li>Đưa URL API vào <code>.env</code> (có đề cho <strong>0 điểm</strong> nếu viết cứng URL).</li>
<li>Xoá có xác nhận + thông báo + tải lại; tích nhiều dòng rồi PATCH tất cả.</li>
<li>Né các bẫy mất điểm: <code>forEach</code> + <code>await</code>, chuỗi với số, khoá nút Submit.</li>
</ul>`,
    ),

    bi(
      `<h3>1. One state object, one handler</h3>
<p>Instead of five <code>useState</code> calls, keep the form in one object. Every input gets a <code>name</code> equal to its key, so a single handler can update any field with a <strong>computed key</strong> <code>[name]</code>. Checkboxes and switches report <code>checked</code> (a boolean), not <code>value</code>.</p>
${js(C_STATE)}
<div class="pitfall"><b>Traps.</b> (1) Every value from an input or select is a <strong>string</strong> — <code>"189"</code>, not <code>189</code>. Convert with <code>Number()</code> when you save. (2) A select whose first option is <code>value=""</code> starts empty — that is how papers say "no default category". (3) A checkbox with <code>checked</code> but no <code>onChange</code> is frozen.</div>`,
      `<h3>1. Một object state, một hàm xử lý</h3>
<p>Thay vì năm lần <code>useState</code>, giữ cả form trong một object. Mỗi ô có <code>name</code> trùng tên khoá, nên một hàm duy nhất cập nhật được mọi ô nhờ <strong>khoá động</strong> <code>[name]</code>. Checkbox và switch báo <code>checked</code> (true/false), không phải <code>value</code>.</p>
${js(C_STATE)}
<div class="pitfall"><b>Bẫy.</b> (1) Mọi giá trị lấy từ input hay select đều là <strong>chuỗi</strong>: <code>"189"</code> chứ không phải <code>189</code>. Khi lưu thì đổi bằng <code>Number()</code>. (2) Select có option đầu <code>value=""</code> sẽ bắt đầu ở trạng thái rỗng — đó là cách đề nói "category mặc định rỗng". (3) Checkbox có <code>checked</code> mà thiếu <code>onChange</code> thì bị "đơ", không tích được.</div>`,
    ),

    bi(
      `<h3>2. A <code>validate()</code> function that returns errors</h3>
<p>Write the rules once, as a pure function: form in, <code>{ field: message }</code> out. Empty object = valid. The same function serves Add and Edit, and you can test it in isolation. These are the rules that recur across PE papers:</p>
${js(C_VALIDATE)}
<div class="pitfall"><b>Traps.</b> <code>if (!f.stock)</code> rejects <code>"0"</code> — wrong when the paper says "≥ 0"; check <code>=== ''</code> first. "At least 2 words" means splitting on spaces, not <code>length</code>. Today's date must be <strong>local</strong> — <code>new Date().toISOString().slice(0,10)</code> is UTC and returns <em>yesterday</em> before 7 a.m. in Vietnam. <code>YYYY-MM-DD</code> strings compare correctly with <code>&gt;</code> and <code>&lt;</code>.</div>`,
      `<h3>2. Hàm <code>validate()</code> trả về lỗi</h3>
<p>Viết luật một lần, thành một hàm thuần: đưa form vào, nhận <code>{ tênÔ: 'lỗi' }</code> ra. Object rỗng = hợp lệ. Cùng một hàm dùng cho cả Thêm lẫn Sửa, và kiểm riêng được. Đây là các luật lặp lại trong nhiều đề PE:</p>
${js(C_VALIDATE)}
<div class="pitfall"><b>Bẫy.</b> <code>if (!f.stock)</code> sẽ chặn cả <code>"0"</code> — sai khi đề ghi "≥ 0"; phải kiểm <code>=== ''</code> trước. "Ít nhất 2 từ" là tách theo dấu cách, không phải <code>length</code>. Ngày hôm nay phải theo <strong>giờ địa phương</strong> — <code>new Date().toISOString().slice(0,10)</code> là giờ UTC, trước 7 giờ sáng ở Việt Nam sẽ ra <em>hôm qua</em>. Chuỗi <code>YYYY-MM-DD</code> so sánh đúng bằng <code>&gt;</code> và <code>&lt;</code>.</div>`,
    ),

    bi(
      `<h3>3. Showing the errors (React-Bootstrap)</h3>
<p><code>isInvalid</code> paints the red border; <code>Form.Control.Feedback type="invalid"</code> shows the text under the field. <code>noValidate</code> on the form turns off the browser's own pop-ups so <em>your</em> messages are the ones graders see.</p>
${js(C_FEEDBACK)}
<div class="callout warn"><b>The classic mark-loser.</b> Do not make the submit button <code>disabled</code> while the form is invalid. The paper says "show the message 'X'": a disabled button can never be clicked, so the message never appears and the grader marks the rule as missing. Disable the button only when the paper explicitly says so (e.g. "if the subject is INACTIVE, disable the button") or while a request is in flight.</div>`,
      `<h3>3. Hiện lỗi (React-Bootstrap)</h3>
<p><code>isInvalid</code> tô viền đỏ; <code>Form.Control.Feedback type="invalid"</code> hiện chữ ngay dưới ô. <code>noValidate</code> trên form tắt bong bóng báo lỗi của trình duyệt, để thông báo <em>của bạn</em> mới là thứ người chấm nhìn thấy.</p>
${js(C_FEEDBACK)}
<div class="callout warn"><b>Lỗi mất điểm kinh điển.</b> Đừng <code>disabled</code> nút Submit khi form đang sai. Đề ghi "hiện thông báo 'X'": nút bị khoá thì không bấm được, thông báo không bao giờ hiện, người chấm coi như bạn thiếu luật đó. Chỉ khoá nút khi đề nói rõ (vd "môn INACTIVE thì disable nút") hoặc trong lúc đang gửi request.</div>`,
    ),

    bi(
      `<h3>4. One component for Add and Edit</h3>
<p>Two routes, one component. If the URL has an <code>:id</code> you are editing: load the record and <strong>pre-fill</strong> the form; on save send <code>PUT</code>. Otherwise send <code>POST</code> and let the server create the id. Then <code>navigate</code> back — the list re-fetches when it mounts, so it shows the new data.</p>
${js(C_ADDEDIT)}
<div class="pitfall"><b>PUT vs PATCH.</b> <code>PUT</code> <em>replaces</em> the record: any field you forget is deleted. Send the whole object (<code>{ ...payload, id }</code>). <code>PATCH</code> changes only the fields you send — ideal for "set status to CLOSED". The <code>submitting</code> flag stops a double click from creating two records.</div>`,
      `<h3>4. Một component cho cả Thêm và Sửa</h3>
<p>Hai route, một component. URL có <code>:id</code> là đang sửa: tải bản ghi rồi <strong>điền sẵn</strong> vào form, khi lưu gửi <code>PUT</code>. Không có thì gửi <code>POST</code> và để server tự tạo id. Sau đó <code>navigate</code> về danh sách — trang danh sách tải lại khi mở ra nên thấy ngay dữ liệu mới.</p>
${js(C_ADDEDIT)}
<div class="pitfall"><b>PUT khác PATCH.</b> <code>PUT</code> <em>thay cả</em> bản ghi: field nào quên gửi là mất. Gửi đủ object (<code>{ ...payload, id }</code>). <code>PATCH</code> chỉ đổi những field gửi lên — hợp với "đổi status thành CLOSED". Cờ <code>submitting</code> chặn bấm hai lần tạo ra hai bản ghi.</div>`,
    ),

    bi(
      `<h3>5. The API URL in <code>.env</code></h3>
<p>Some papers (e.g. Sneaker Collection) say a hard-coded URL scores <strong>0</strong>. Put it in <code>.env</code> next to <code>package.json</code> and read it in <strong>one</strong> file, <code>api.js</code>.</p>
${sh(C_ENV)}
${js(C_ENV_JS)}
<div class="pitfall"><b>Traps.</b> The prefix is mandatory (<code>REACT_APP_</code> / <code>VITE_</code>), otherwise the value is <code>undefined</code> and every URL becomes <code>"undefined/items"</code>. The file is read only when the dev server <strong>starts</strong>: after editing <code>.env</code>, stop <code>npm start</code> (Ctrl+C) and start it again.</div>`,
      `<h3>5. URL API nằm trong <code>.env</code></h3>
<p>Có đề (vd Sneaker Collection) ghi rõ viết cứng URL là <strong>0 điểm</strong>. Đặt nó trong <code>.env</code> cạnh <code>package.json</code> và chỉ đọc ở <strong>một</strong> file, <code>api.js</code>.</p>
${sh(C_ENV)}
${js(C_ENV_JS)}
<div class="pitfall"><b>Bẫy.</b> Tiền tố là bắt buộc (<code>REACT_APP_</code> / <code>VITE_</code>), thiếu là giá trị thành <code>undefined</code> và mọi URL thành <code>"undefined/items"</code>. File chỉ được đọc lúc server dev <strong>khởi động</strong>: sửa <code>.env</code> xong phải tắt <code>npm start</code> (Ctrl+C) rồi chạy lại.</div>`,
    ),

    bi(
      `<h3>6. Delete: confirm → request → message → reload</h3>
<p>Papers grade the four steps separately, so do all four, in this order.</p>
${js(C_DELETE)}
<p>Reload or filter? <code>load()</code> shows exactly what the server has; <code>filter</code> skips a request but can drift from the server. Either is accepted unless the paper says "reload".</p>`,
      `<h3>6. Xoá: xác nhận → gửi → thông báo → tải lại</h3>
<p>Đề chấm riêng từng bước nên làm đủ cả bốn, đúng thứ tự.</p>
${js(C_DELETE)}
<p>Tải lại hay lọc? <code>load()</code> hiện đúng những gì server đang có; <code>filter</code> đỡ một request nhưng có thể lệch với server. Cả hai đều được chấp nhận, trừ khi đề ghi rõ "reload".</p>`,
    ),

    bi(
      `<h3>7. Tick many rows, then update them all</h3>
<p>Selection is just an <strong>array of ids</strong> in state. The checkbox is <em>controlled</em>: <code>checked</code> comes from that array. Locked rows stay visible with <code>disabled</code> (papers say "render disabled, not hidden").</p>
${js(C_BULK)}
<p>Sending: papers usually say "for <em>each</em> selected item send one PATCH". Three correct shapes and one wrong one:</p>
${js(C_BULK_SEND)}
<div class="callout warn"><b>Why forEach fails.</b> <code>forEach</code> calls your async function for each id and moves on immediately — it never waits for the promises. Use <code>for…of</code> (sequential) or <code>Promise.all</code> (parallel). This exact bug shows up as "success message appears but the table still says OPEN".</div>`,
      `<h3>7. Tích nhiều dòng rồi cập nhật tất cả</h3>
<p>"Đang chọn" chỉ là một <strong>mảng id</strong> trong state. Checkbox là <em>controlled</em>: <code>checked</code> lấy từ mảng đó. Dòng bị khoá vẫn hiện, chỉ <code>disabled</code> (đề hay ghi "render disabled, không ẩn").</p>
${js(C_BULK)}
<p>Gửi đi: đề thường ghi "với <em>mỗi</em> mục đã chọn gửi một PATCH". Ba cách đúng và một cách sai:</p>
${js(C_BULK_SEND)}
<div class="callout warn"><b>Vì sao forEach hỏng.</b> <code>forEach</code> gọi hàm async cho từng id rồi đi tiếp ngay, không bao giờ chờ promise. Dùng <code>for…of</code> (lần lượt) hoặc <code>Promise.all</code> (song song). Lỗi này lộ ra đúng kiểu "thông báo thành công đã hiện mà bảng vẫn ghi OPEN".</div>`,
    ),

    bi(
      `<h3>8. <code>.find</code> — joining two collections</h3>
<p>json-server stores ids, not names: a class has <code>subjectId</code>, an order has <code>plantId</code>. The screen wants the <em>name</em>, so you look it up. <code>.filter</code> returns an array; <code>.find</code> returns one item or <code>undefined</code>.</p>
${js(C_FIND)}
<div class="pitfall"><b>Strings vs numbers.</b> <code>useParams()</code> always gives a string; json-server 1.0 creates string ids; a <code>&lt;select&gt;</code> gives a string. <code>"3" === 3</code> is <code>false</code>, so lookups silently return nothing. Compare <code>String(a) === String(b)</code> when unsure, and sort ids with <code>Number(a.id) - Number(b.id)</code> (as strings, <code>"10"</code> comes before <code>"2"</code>).</div>`,
      `<h3>8. <code>.find</code> — nối hai collection</h3>
<p>json-server lưu id chứ không lưu tên: lớp có <code>subjectId</code>, đơn hàng có <code>plantId</code>. Màn hình cần <em>tên</em>, nên phải tra. <code>.filter</code> trả về mảng; <code>.find</code> trả về một phần tử hoặc <code>undefined</code>.</p>
${js(C_FIND)}
<div class="pitfall"><b>Chuỗi với số.</b> <code>useParams()</code> luôn trả chuỗi; json-server 1.0 tạo id dạng chuỗi; <code>&lt;select&gt;</code> cũng trả chuỗi. <code>"3" === 3</code> là <code>false</code>, nên tra cứu lặng lẽ ra rỗng. Không chắc thì so <code>String(a) === String(b)</code>, và sắp xếp id bằng <code>Number(a.id) - Number(b.id)</code> (so chuỗi thì <code>"10"</code> đứng trước <code>"2"</code>).</div>`,
    ),

    bi(
      `<h3>9. 🕵️ Hacker's corner — what client-side checks do <em>not</em> protect</h3>
<ul>
<li><strong>Validation in React is a convenience, not security.</strong> Anyone can skip your form and send the request directly (DevTools → Network → "Copy as cURL", or Postman):
${sh(C_HACK)}
A real back-end (Node/Express, Spring Boot) must run the same rules again on the server and reject bad data with <code>400</code>.</li>
<li><strong><code>.env</code> in a front-end is public.</strong> Every <code>REACT_APP_*</code> / <code>VITE_*</code> value is copied into the JavaScript bundle that every visitor downloads. Use it for URLs, never for secret keys or passwords — those stay on a server. (Real incident pattern: payment and map API keys scraped from public bundles and billed to the owner.)</li>
<li><strong>Double submit.</strong> A slow network + an impatient double click = two orders. Disable the button while <code>submitting</code>, and on the server make "create order" idempotent.</li>
<li><strong>Delete without confirmation</strong> is how people lose data with one misclick — which is exactly why papers grade the confirm step.</li>
</ul>`,
      `<h3>9. 🕵️ Góc hacker — kiểm ở phía client <em>không</em> bảo vệ được gì</h3>
<ul>
<li><strong>Kiểm lỗi trong React chỉ để tiện cho người dùng, không phải bảo mật.</strong> Ai cũng có thể bỏ qua form và gửi request thẳng (DevTools → Network → "Copy as cURL", hoặc Postman):
${sh(C_HACK)}
Back-end thật (Node/Express, Spring Boot) phải chạy lại đúng các luật đó trên server và từ chối dữ liệu sai bằng <code>400</code>.</li>
<li><strong><code>.env</code> ở front-end là công khai.</strong> Mọi giá trị <code>REACT_APP_*</code> / <code>VITE_*</code> đều bị chép vào file JavaScript mà mọi người truy cập đều tải về. Chỉ dùng cho URL, không bao giờ cho khoá bí mật hay mật khẩu — những thứ đó phải nằm trên server. (Sự cố thật hay gặp: khoá API thanh toán, bản đồ bị lấy từ bundle công khai rồi bị dùng chùa, chủ web trả tiền.)</li>
<li><strong>Bấm hai lần.</strong> Mạng chậm + bấm sốt ruột hai lần = hai đơn hàng (như bấm "Đặt hàng" hai lần trên app mua sắm). Khoá nút khi <code>submitting</code>, và ở server làm thao tác tạo đơn "idempotent" (gửi lại không tạo trùng).</li>
<li><strong>Xoá không hỏi lại</strong> là cách người ta mất dữ liệu chỉ vì một cú bấm nhầm — đó cũng là lý do đề chấm riêng bước xác nhận.</li>
</ul>`,
    ),

    bi(
      `<h3>10. Practise — PE papers that use exactly this</h3>
<ul>
<li><strong>Sneaker Collection / Gadget Store</strong> — <code>.env</code>, shared Add/Edit form, per-field rules, delete with confirm.</li>
<li><strong>Plant Shop</strong> — messages must appear (do not disable submit), <code>stock ≥ 0</code>, order shows the plant <em>name</em> via <code>.find</code>.</li>
<li><strong>Company Management</strong> — nested dependents ⇒ <code>PUT</code> the whole employee; birth date before today.</li>
<li><strong>Attendance System</strong> — radios per row, local "today", one <code>POST</code> per student.</li>
<li><strong>Lecturer Workload (FA26 PE NO2)</strong> — checkbox selection, <code>disabled</code> rows, one <code>PATCH</code> per class. Line-by-line videos: <a href="${KHOA}fer202-pefa26-8-cau-2">PE Fall26 — Question 2</a>.</li>
</ul>
<div class="di-toi"><a class="link-card codelab" href="${PE_LAB}" target="_blank" rel="noopener"><span class="lc-ico">⌨️</span><span class="lc-body"><span class="lc-title">FER202 PE practice (auto-graded)</span><span class="lc-sub">Type it yourself, 85-minute timer, no peeking at the solution.</span></span><span class="lc-cta">PRACTICE →</span></a></div>
<h3>✅ Check yourself</h3>
<ol>
<li>Why does <code>if (!form.stock)</code> break the rule "stock must be ≥ 0"? Write the correct check.</li>
<li>A paper says "show 'Name is required.' when Name is empty". Why is <code>disabled={!form.name}</code> on the submit button a bad idea?</li>
<li>You send <code>PUT /items/3</code> with only <code>{ price: 10 }</code>. What happens to the item's name?</li>
<li>After editing <code>.env</code> your URL is still the old one. What did you forget?</li>
<li>Rewrite <code>selected.forEach(async id =&gt; await axios.patch(...))</code> so the success message appears only after every PATCH finished.</li>
<li><code>subjects.find(s =&gt; s.id === id)</code> returns <code>undefined</code> although the subject exists. Give two likely causes.</li>
</ol>
<details><summary>Answers</summary><ol>
<li>Input values are strings, and both an empty <code>""</code> and the number <code>0</code> are falsy, so <code>!form.stock</code> hides the intent and wrongly rejects a valid 0 once stock is stored as a number. Be explicit: <code>if (f.stock === '') …; else if (!(Number(f.stock) &gt;= 0)) …</code>.</li>
<li>The button can never be clicked, so the message never renders — the rule is marked as missing.</li>
<li>It is gone: PUT replaces the whole record. Send the full object, or use PATCH.</li>
<li>Restart the dev server; also check the <code>REACT_APP_</code>/<code>VITE_</code> prefix.</li>
<li><code>for (const id of selected) { await axios.patch(…); } setSuccess(…);</code> or <code>await Promise.all(selected.map(id =&gt; axios.patch(…)));</code></li>
<li>Type mismatch (<code>"3"</code> vs <code>3</code>) — compare with <code>String()</code>; or the data has not loaded yet (the array is still <code>[]</code>).</li>
</ol></details>`,
      `<h3>10. Luyện tập — các đề PE dùng đúng những thứ này</h3>
<ul>
<li><strong>Sneaker Collection / Gadget Store</strong> — <code>.env</code>, form Thêm/Sửa dùng chung, luật từng ô, xoá có xác nhận.</li>
<li><strong>Plant Shop</strong> — thông báo lỗi phải hiện (đừng khoá Submit), <code>stock ≥ 0</code>, danh sách đơn hiện <em>tên</em> cây nhờ <code>.find</code>.</li>
<li><strong>Company Management</strong> — người phụ thuộc lồng trong nhân viên ⇒ <code>PUT</code> cả nhân viên; ngày sinh phải trước hôm nay.</li>
<li><strong>Attendance System</strong> — radio từng dòng, "hôm nay" theo giờ địa phương, mỗi sinh viên một <code>POST</code>.</li>
<li><strong>Lecturer Workload (FA26 PE NO2)</strong> — chọn bằng checkbox, dòng bị <code>disabled</code>, mỗi lớp một <code>PATCH</code>. Video từng dòng: <a href="${KHOA}fer202-pefa26-8-cau-2">Đề PE Fall26 — Câu 2</a>.</li>
</ul>
<div class="di-toi"><a class="link-card codelab" href="${PE_LAB}" target="_blank" rel="noopener"><span class="lc-ico">⌨️</span><span class="lc-body"><span class="lc-title">Luyện đề PE FER202 (có máy chấm)</span><span class="lc-sub">Tự gõ, bấm giờ 85 phút, không mở lời giải.</span></span><span class="lc-cta">LUYỆN TẬP →</span></a></div>
<h3>✅ Tự kiểm tra</h3>
<ol>
<li>Vì sao <code>if (!form.stock)</code> làm hỏng luật "stock phải ≥ 0"? Viết lại cách kiểm đúng.</li>
<li>Đề ghi "Name rỗng thì hiện 'Name is required.'". Vì sao đặt <code>disabled={!form.name}</code> cho nút Submit là ý tồi?</li>
<li>Bạn gửi <code>PUT /items/3</code> chỉ với <code>{ price: 10 }</code>. Tên của item sẽ ra sao?</li>
<li>Sửa <code>.env</code> xong mà URL vẫn là cái cũ. Bạn quên gì?</li>
<li>Viết lại <code>selected.forEach(async id =&gt; await axios.patch(...))</code> để thông báo thành công chỉ hiện khi mọi PATCH đã xong.</li>
<li><code>subjects.find(s =&gt; s.id === id)</code> trả <code>undefined</code> dù môn có tồn tại. Nêu hai nguyên nhân hay gặp.</li>
</ol>
<details><summary>Đáp án</summary><ol>
<li>Giá trị từ ô nhập là chuỗi; ô rỗng <code>""</code> và số <code>0</code> đều "falsy", nên viết <code>!form.stock</code> thì ý đồ không rõ ràng và dễ chặn nhầm giá trị 0 hợp lệ khi stock đã là số. Viết rõ: <code>if (f.stock === '') …; else if (!(Number(f.stock) &gt;= 0)) …</code>.</li>
<li>Nút không bấm được nên thông báo không bao giờ hiện — người chấm coi là thiếu luật.</li>
<li>Mất tên: PUT thay cả bản ghi. Gửi đủ object, hoặc dùng PATCH.</li>
<li>Khởi động lại server dev; kiểm thêm tiền tố <code>REACT_APP_</code>/<code>VITE_</code>.</li>
<li><code>for (const id of selected) { await axios.patch(…); } setSuccess(…);</code> hoặc <code>await Promise.all(selected.map(id =&gt; axios.patch(…)));</code></li>
<li>Lệch kiểu (<code>"3"</code> với <code>3</code>) — so bằng <code>String()</code>; hoặc dữ liệu chưa tải xong (mảng vẫn là <code>[]</code>).</li>
</ol></details>`,
    ),

    books([
      ['reactdoc', 'Reacting to Input with State; Sharing State; You Might Not Need an Effect', 'Reacting to Input with State; Sharing State; You Might Not Need an Effect'],
      ['reactbootstrap', 'Forms → Validation (isInvalid, Feedback, noValidate)', 'Forms → Validation (isInvalid, Feedback, noValidate)'],
      ['router', 'useParams, useNavigate', 'useParams, useNavigate'],
      ['mdn', 'Array.prototype.find / for…of / Promise.all / Promise.allSettled / Window.confirm', 'Array.prototype.find / for…of / Promise.all / Promise.allSettled / Window.confirm'],
    ]),
  ].join('\n'),
};

export default FORM_PE;
