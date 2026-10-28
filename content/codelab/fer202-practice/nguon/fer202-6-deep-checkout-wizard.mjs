/**
 * FER202 · Chương 6 — DEEP LAB: Multi-step Checkout Wizard (sự kiện & form chuyên sâu).
 * Sâu hơn Lab 6: form nhiều bước có kiểm hợp lệ theo bước, lỗi hiện sau blur hoặc sau khi bấm Next, một state object
 * + một handler cho mọi loại ô (text/select/radio/checkbox), mảng trường động (thêm/xoá dòng), Enter = Next,
 * trang xem lại, gửi + làm lại. Hàm kiểm hợp lệ tách riêng, thuần.
 */
import { doiDau, index, KHOA, NOP_BAI, tn } from './_chung.mjs';

const click = (selector, lan = 1) => ({ hanhDong: 'click', selector, lan });
const nhap = (selector, giaTri) => ({ hanhDong: 'nhap', selector, giaTri });
const gui = { hanhDong: 'gui', selector: '#wizard' };

const CSS = `/* src/index.css (đã cho) */
body { font-family: system-ui, sans-serif; background: #f1f5f9; margin: 0; padding: 24px; color: #0f172a; }
.wizard { max-width: 560px; margin: auto; background: #fff; border-radius: 12px; padding: 20px 24px; box-shadow: 0 1px 3px rgba(0,0,0,.1); }
#steps { display: flex; gap: 8px; list-style: none; padding: 0; margin: 0 0 12px; }
.step { flex: 1; text-align: center; padding: 6px; border-radius: 6px; background: #e2e8f0; font-size: 13px; }
.step.done { background: #bbf7d0; } .step.active { background: #2563eb; color: #fff; font-weight: 600; }
label { display: block; margin: 10px 0 4px; font-weight: 500; }
input[type=text], input[type=email], input[type=password], input[type=number], select { width: 100%; padding: 7px 9px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; }
.error { color: #dc2626; font-size: 13px; margin: 4px 0 0; }
.item-row { display: flex; gap: 6px; margin-bottom: 6px; } .item-row .item-qty { width: 80px; }
.actions { display: flex; justify-content: space-between; margin-top: 16px; }
button { padding: 7px 16px; border-radius: 6px; border: 0; background: #2563eb; color: #fff; cursor: pointer; }
button.secondary { background: #e2e8f0; color: #0f172a; }
.review dt { font-weight: 600; } .review dd { margin: 0 0 8px; }
`;

const VALIDATION = `// src/validation.js — hàm THUẦN: (bước, dữ liệu) ⇒ object lỗi. Dễ test, dùng chung cho Next và blur
export const STEP_FIELDS = {
  1: ['email', 'password', 'confirm'],
  2: ['fullName', 'phone', 'address', 'city'],
  3: ['items', 'terms'],
  4: [],
};

export function validateStep(step, d) {
  const e = {};
  if (step === 1) {
    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(d.email.trim())) e.email = 'Enter a valid email';
    if (d.password.length < 8 || !/\\d/.test(d.password)) e.password = 'At least 8 characters with a number';
    if (d.confirm !== d.password || !d.confirm) e.confirm = 'Passwords do not match';
  }
  if (step === 2) {
    if (d.fullName.trim().length < 2) e.fullName = 'Full name is required';
    if (!/^0\\d{9}$/.test(d.phone)) e.phone = 'Phone must be 10 digits starting with 0';
    if (d.address.trim().length < 5) e.address = 'Address is too short';
    if (!d.city) e.city = 'Choose a city';
  }
  if (step === 3) {
    const bad = d.items.length === 0 || d.items.some((it) => !it.name.trim() || !(Number(it.qty) >= 1));
    if (bad) e.items = 'Every item needs a name and a quantity of at least 1';
    if (!d.terms) e.terms = 'You must accept the terms';
  }
  return e;
}

export const DELIVERY = { standard: { label: 'Standard', fee: 30000 }, express: { label: 'Express', fee: 60000 } };
export const vnd = (n) => n.toLocaleString('en-US') + ' ₫';
`;

const FIELD = `// src/components/Field.js — nhãn + ô + lỗi (lỗi chỉ hiện khi được phép)
export default function Field({ label, name, error, children }) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      {children}
      {error && <p className="error" id={´err-@{name}´}>{error}</p>}
    </div>
  );
}
`;

const STEPS = `// src/components/Steps.js — các bước của wizard (component trình bày, nhận dữ liệu + handler từ App)
import Field from './Field';
import { DELIVERY, vnd } from '../validation';

export function AccountStep({ data, onChange, onBlur, err }) {
  return (
    <>
      <Field label="Email" name="email" error={err('email')}>
        <input id="email" name="email" type="email" value={data.email} onChange={onChange} onBlur={onBlur} />
      </Field>
      <Field label="Password" name="password" error={err('password')}>
        <input id="password" name="password" type="password" value={data.password} onChange={onChange} onBlur={onBlur} />
      </Field>
      <Field label="Confirm password" name="confirm" error={err('confirm')}>
        <input id="confirm" name="confirm" type="password" value={data.confirm} onChange={onChange} onBlur={onBlur} />
      </Field>
    </>
  );
}

export function ShippingStep({ data, onChange, onBlur, err }) {
  return (
    <>
      <Field label="Full name" name="fullName" error={err('fullName')}>
        <input id="fullName" name="fullName" type="text" value={data.fullName} onChange={onChange} onBlur={onBlur} />
      </Field>
      <Field label="Phone" name="phone" error={err('phone')}>
        <input id="phone" name="phone" type="text" value={data.phone} onChange={onChange} onBlur={onBlur} />
      </Field>
      <Field label="Address" name="address" error={err('address')}>
        <input id="address" name="address" type="text" value={data.address} onChange={onChange} onBlur={onBlur} />
      </Field>
      <Field label="City" name="city" error={err('city')}>
        <select id="city" name="city" value={data.city} onChange={onChange} onBlur={onBlur}>
          <option value="">-- choose --</option>
          <option value="Ha Noi">Ha Noi</option>
          <option value="Hue">Hue</option>
          <option value="Da Nang">Da Nang</option>
          <option value="Ho Chi Minh City">Ho Chi Minh City</option>
        </select>
      </Field>
      <fieldset>
        <legend>Delivery</legend>
        {Object.entries(DELIVERY).map(([key, opt]) => (
          <label key={key}>
            <input type="radio" id={´delivery-@{key}´} name="delivery" value={key} checked={data.delivery === key} onChange={onChange} /> {opt.label}
          </label>
        ))}
      </fieldset>
      <p id="delivery-fee">Delivery: {vnd(DELIVERY[data.delivery].fee)}</p>
    </>
  );
}

export function ItemsStep({ data, onItemChange, onAddItem, onRemoveItem, onChange, err }) {
  return (
    <>
      <div id="items">
        {data.items.map((it) => (
          <div key={it.id} className="item-row">
            <input className="item-name" placeholder="Item" value={it.name} onChange={(e) => onItemChange(it.id, 'name', e.target.value)} />
            <input className="item-qty" type="number" min="1" value={it.qty} onChange={(e) => onItemChange(it.id, 'qty', e.target.value)} />
            <button type="button" className="remove-item secondary" disabled={data.items.length === 1} onClick={() => onRemoveItem(it.id)}>×</button>
          </div>
        ))}
      </div>
      <button type="button" id="add-item" className="secondary" onClick={onAddItem}>+ Add item</button>
      {err('items') && <p className="error" id="err-items">{err('items')}</p>}
      <label>
        <input type="checkbox" id="terms" name="terms" checked={data.terms} onChange={onChange} /> I accept the terms
      </label>
      {err('terms') && <p className="error" id="err-terms">{err('terms')}</p>}
    </>
  );
}

export function ReviewStep({ data }) {
  const d = DELIVERY[data.delivery];
  return (
    <dl className="review">
      <dt>Account</dt><dd id="review-email">{data.email}</dd>
      <dt>Recipient</dt><dd id="review-name">{data.fullName} · {data.phone}</dd>
      <dt>Address</dt><dd id="review-address">{data.address}, {data.city}</dd>
      <dt>Delivery</dt><dd id="review-delivery">{d.label} — {vnd(d.fee)}</dd>
      <dt>Items</dt><dd id="review-items">{data.items.map((it) => ´@{it.name.trim()} ×@{Number(it.qty)}´).join(', ')}</dd>
    </dl>
  );
}
`;

const APP = `// src/App.js — MỘT state object + MỘT handler; kiểm theo bước; lỗi hiện sau blur hoặc sau Next
import { useState } from 'react';
import { AccountStep, ItemsStep, ReviewStep, ShippingStep } from './components/Steps';
import { STEP_FIELDS, validateStep } from './validation';

const TITLES = ['Account', 'Shipping', 'Items', 'Review'];
let nextItemId = 2;
const initial = () => ({
  email: '', password: '', confirm: '',
  fullName: '', phone: '', address: '', city: '', delivery: 'standard',
  items: [{ id: 1, name: '', qty: 1 }], terms: false,
});

export default function App() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(initial);
  const [touched, setTouched] = useState({});
  const [done, setDone] = useState(false);

  const errors = validateStep(step, data);
  const err = (field) => (touched[field] ? errors[field] : undefined);

  // một handler cho text/select/radio/checkbox: đọc name + value/checked
  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setData((d) => ({ ...d, [name]: type === 'checkbox' ? checked : value }));
  };
  const handleBlur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }));

  const changeItem = (id, key, value) =>
    setData((d) => ({ ...d, items: d.items.map((it) => (it.id === id ? { ...it, [key]: value } : it)) }));
  const addItem = () => {
    setData((d) => ({ ...d, items: [...d.items, { id: nextItemId++, name: '', qty: 1 }] }));
    setTouched((t) => ({ ...t, items: false }));
  };
  const removeItem = (id) => setData((d) => ({ ...d, items: d.items.filter((it) => it.id !== id) }));

  const handleSubmit = (e) => {
    e.preventDefault(); // Enter trong một ô cũng gửi form ⇒ đi tiếp
    if (step === 4) {
      setDone(true);
      return;
    }
    const fields = STEP_FIELDS[step];
    if (Object.keys(errors).length > 0) {
      setTouched((t) => ({ ...t, ...Object.fromEntries(fields.map((f) => [f, true])) }));
      return;
    }
    setStep((s) => s + 1);
  };

  const restart = () => {
    setData(initial());
    setTouched({});
    setStep(1);
    setDone(false);
  };

  if (done) {
    return (
      <div className="wizard">
        <h2 id="success">Order placed for {data.fullName.trim()}</h2>
        <button id="btn-restart" type="button" onClick={restart}>Place another order</button>
      </div>
    );
  }

  const props = { data, onChange: handleChange, onBlur: handleBlur, err };

  return (
    <form id="wizard" className="wizard" onSubmit={handleSubmit} noValidate>
      <ol id="steps">
        {TITLES.map((t, i) => (
          <li key={t} className={['step', i + 1 === step ? 'active' : '', i + 1 < step ? 'done' : ''].filter(Boolean).join(' ')}>{t}</li>
        ))}
      </ol>
      <p id="step-label">Step {step} of 4 — {TITLES[step - 1]}</p>

      {step === 1 && <AccountStep {...props} />}
      {step === 2 && <ShippingStep {...props} />}
      {step === 3 && <ItemsStep {...props} onItemChange={changeItem} onAddItem={addItem} onRemoveItem={removeItem} />}
      {step === 4 && <ReviewStep data={data} />}

      <div className="actions">
        {step > 1 ? <button id="btn-back" type="button" className="secondary" onClick={() => setStep((s) => s - 1)}>Back</button> : <span />}
        {step < 4 ? <button id="btn-next" type="submit">Next</button> : <button id="btn-submit" type="submit">Place order</button>}
      </div>
    </form>
  );
}
`;

const S_APP = `// src/App.js — STARTER: một form dài, không chia bước, không kiểm hợp lệ, mỗi ô một useState
import { useState } from 'react';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <form id="wizard" onSubmit={() => alert('Order placed')}>
      <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button id="btn-next" type="submit">Next</button>
    </form>
  );
}
`;

const INDEX = index().replace("import App from './App';", "import './index.css';\nimport App from './App';");
const CHUNG = { 'src/index.js': INDEX, 'src/index.css': CSS };
const LOI_GIAI = { 'src/App.js': APP, 'src/validation.js': VALIDATION, 'src/components/Field.js': FIELD, 'src/components/Steps.js': STEPS, ...CHUNG };
const KHOI_DAU = {
  'src/App.js': S_APP,
  'src/validation.js': `// src/validation.js — STARTER: viết validateStep(step, data) THUẦN, trả object lỗi
export const STEP_FIELDS = { 1: [], 2: [], 3: [], 4: [] };
export function validateStep() {
  return {};
}
export const DELIVERY = { standard: { label: 'Standard', fee: 30000 }, express: { label: 'Express', fee: 60000 } };
export const vnd = (n) => n.toLocaleString('en-US') + ' ₫';
`,
  'src/components/Field.js': `// src/components/Field.js — STARTER
export default function Field({ children }) {
  return children;
}
`,
  'src/components/Steps.js': `// src/components/Steps.js — STARTER: AccountStep · ShippingStep · ItemsStep · ReviewStep
export function AccountStep() { return null; }
export function ShippingStep() { return null; }
export function ItemsStep() { return null; }
export function ReviewStep() { return null; }
`,
  ...CHUNG,
};

// các bước điền mẫu
const B1 = [nhap('#email', 'lan@fpt.edu.vn'), nhap('#password', 'secret123'), nhap('#confirm', 'secret123'), gui];
const B2 = [nhap('#fullName', 'Lan Nguyen'), nhap('#phone', '0912345678'), nhap('#address', '12 Tran Phu'), { hanhDong: 'doi', selector: '#city', giaTri: 'Hue' }, click('#delivery-express'), gui];
const B3 = [nhap('.item-row:nth-child(1) .item-name', 'Pen'), nhap('.item-row:nth-child(1) .item-qty', '2'), click('#add-item'), nhap('.item-row:nth-child(2) .item-name', 'Book'), { hanhDong: 'chon-o', selector: '#terms' }, gui];

const KIEM = [
  // f1 navigation
  { nhom: 'f1', moTa: 'Starts on step 1 of 4', kiem: 'danh-sach-text', selector: '#step-label, #steps .step.active', mongDoi: ['Account', 'Step 1 of 4 — Account'] },
  { nhom: 'f1', moTa: 'Cannot leave step 1 while invalid', kiem: 'text', selector: '#step-label', giaTri: 'Step 1 of 4 — Account', truoc: [click('#btn-next')] },
  { nhom: 'f1', moTa: 'Valid step goes to step 2; previous step marked done', kiem: 'danh-sach-text', selector: '#steps .step.done, #step-label', mongDoi: ['Account', 'Step 2 of 4 — Shipping'], truoc: B1 },
  { nhom: 'f1', moTa: 'Back returns and keeps the values', kiem: 'thuoc-tinh-js', selector: '#email', thuocTinh: 'value', giaTri: 'lan@fpt.edu.vn', truoc: [...B1, click('#btn-back')] },
  { nhom: 'f1', an: true, moTa: 'No Back button on step 1', kiem: 'khong-ton-tai', selector: '#btn-back' },
  // f2 validation timing + messages
  { nhom: 'f2', moTa: 'No errors before interaction', kiem: 'so-luong', selector: '.error', giaTri: 0 },
  { nhom: 'f2', moTa: 'Error appears after leaving the field (blur)', kiem: 'danh-sach-text', selector: '.error', mongDoi: ['Enter a valid email'], truoc: [nhap('#email', 'lan@'), { hanhDong: 'focus', selector: '#password' }] },
  { nhom: 'f2', moTa: 'Next shows every error of the step', kiem: 'danh-sach-text', selector: '.error', mongDoi: ['Enter a valid email', 'At least 8 characters with a number', 'Passwords do not match'], truoc: [click('#btn-next')] },
  { nhom: 'f2', moTa: 'Step 2 rules', kiem: 'danh-sach-text', selector: '.error', mongDoi: ['Full name is required', 'Phone must be 10 digits starting with 0', 'Address is too short', 'Choose a city'], truoc: [...B1, nhap('#phone', '12345'), click('#btn-next')] },
  { nhom: 'f2', an: true, moTa: 'Password needs a digit', kiem: 'text', selector: '#err-password', giaTri: 'At least 8 characters with a number', truoc: [nhap('#password', 'abcdefghij'), click('#btn-next')] },
  { nhom: 'f2', an: true, moTa: 'Fixing a field removes its error', kiem: 'khong-ton-tai', selector: '#err-email', truoc: [click('#btn-next'), nhap('#email', 'lan@fpt.edu.vn')] },
  { nhom: 'f2', an: true, moTa: 'validateStep is a pure function in validation.js', kiem: 'ma-nguon', tep: 'src/validation.js', khop: 'export\\s+function\\s+validateStep\\s*\\(\\s*step\\s*,' },
  // f3 controlled select/radio/checkbox
  { nhom: 'f3', moTa: 'Radio changes the delivery fee', kiem: 'text', selector: '#delivery-fee', giaTri: 'Delivery: 60,000 ₫', truoc: [...B1, click('#delivery-express')] },
  { nhom: 'f3', moTa: 'Select is controlled', kiem: 'thuoc-tinh-js', selector: '#city', thuocTinh: 'value', giaTri: 'Da Nang', truoc: [...B1, { hanhDong: 'doi', selector: '#city', giaTri: 'Da Nang' }, nhap('#fullName', 'X'), click('#btn-next')] },
  { nhom: 'f3', an: true, moTa: 'Standard by default', kiem: 'thuoc-tinh-js', selector: '#delivery-standard', thuocTinh: 'checked', giaTri: true, truoc: B1 },
  // f4 dynamic items
  { nhom: 'f4', moTa: 'Add item adds a row', kiem: 'so-luong', selector: '.item-row', giaTri: 3, truoc: [...B1, ...B2, click('#add-item', 2)] },
  { nhom: 'f4', moTa: 'Remove deletes that row only', kiem: 'so-luong', selector: '.item-row', giaTri: 1, truoc: [...B1, ...B2, nhap('.item-row:nth-child(1) .item-name', 'Pen'), click('#add-item'), nhap('.item-row:nth-child(2) .item-name', 'Book'), click('.item-row:nth-child(1) .remove-item')] },
  { nhom: 'f4', moTa: 'Item rule and terms rule', kiem: 'danh-sach-text', selector: '#err-items, #err-terms', mongDoi: ['Every item needs a name and a quantity of at least 1', 'You must accept the terms'], truoc: [...B1, ...B2, click('#btn-next')] },
  { nhom: 'f4', an: true, moTa: 'Remaining row keeps its own value (stable keys)', kiem: 'thuoc-tinh-js', selector: '.item-row:nth-child(1) .item-name', thuocTinh: 'value', giaTri: 'Book', truoc: [...B1, ...B2, nhap('.item-row:nth-child(1) .item-name', 'Pen'), click('#add-item'), nhap('.item-row:nth-child(2) .item-name', 'Book'), click('.item-row:nth-child(1) .remove-item')] },
  { nhom: 'f4', an: true, moTa: 'The last row cannot be removed', kiem: 'thuoc-tinh-js', selector: '.item-row .remove-item', thuocTinh: 'disabled', giaTri: true, truoc: [...B1, ...B2] },
  // f5 keyboard / submit semantics
  { nhom: 'f5', moTa: 'Submitting the form (Enter) moves to the next step', kiem: 'text', selector: '#step-label', giaTri: 'Step 3 of 4 — Items', truoc: [...B1, ...B2] },
  { nhom: 'f5', moTa: 'No page reload', kiem: 'khong-tai-lai', truoc: [...B1, ...B2, ...B3] },
  { nhom: 'f5', an: true, moTa: 'Add/remove buttons are type="button" (do not submit)', kiem: 'text', selector: '#step-label', giaTri: 'Step 3 of 4 — Items', truoc: [...B1, ...B2, click('#add-item')] },
  // f6 review
  { nhom: 'f6', moTa: 'Review shows every answer', kiem: 'danh-sach-text', selector: '.review dd', mongDoi: ['lan@fpt.edu.vn', 'Lan Nguyen · 0912345678', '12 Tran Phu, Hue', 'Express — 60,000 ₫', 'Pen ×2, Book ×1'], truoc: [...B1, ...B2, ...B3] },
  { nhom: 'f6', an: true, moTa: 'Step indicator on review', kiem: 'so-luong', selector: '#steps .step.done', giaTri: 3, truoc: [...B1, ...B2, ...B3] },
  // f7 submit & restart
  { nhom: 'f7', moTa: 'Place order shows success', kiem: 'text', selector: '#success', giaTri: 'Order placed for Lan Nguyen', truoc: [...B1, ...B2, ...B3, click('#btn-submit')] },
  { nhom: 'f7', moTa: 'Restart resets everything to step 1', kiem: 'danh-sach-text', selector: '#step-label, .error', mongDoi: ['Step 1 of 4 — Account'], truoc: [...B1, ...B2, ...B3, click('#btn-submit'), click('#btn-restart')] },
  { nhom: 'f7', an: true, moTa: 'Fields empty after restart', kiem: 'thuoc-tinh-js', selector: '#email', thuocTinh: 'value', giaTri: '', truoc: [...B1, ...B2, ...B3, click('#btn-submit'), click('#btn-restart')] },
  // f8 one state + one handler
  { nhom: 'f8', moTa: 'One change handler using the input name', kiem: 'ma-nguon', tep: 'src/App.js', khop: '\\[\\s*name\\s*\\]\\s*:\\s*type\\s*===\\s*[\'"]checkbox[\'"]' },
  { nhom: 'f8', an: true, moTa: 'A single data object in state', kiem: 'ma-nguon', tep: 'src/App.js', khop: 'useState\\(\\s*initial\\s*\\)' },
];

const BAN_IN = {
  tieuDe: { en: 'DEEP LAB 6: Multi-step Checkout Wizard — events & forms in depth', vi: 'DEEP LAB 6: Wizard thanh toán nhiều bước — sự kiện & form chuyên sâu' },
  phu: { en: 'FER202 · Chapter 6 (deep) · Suggested time: 120 minutes · Total: 10 marks', vi: 'FER202 · Chương 6 (chuyên sâu) · Thời gian gợi ý: 120 phút · Tổng: 10 điểm' },
  moTa: {
    en: '<p>A four-step checkout: <b>Account → Shipping → Items → Review</b>. Each step is validated before moving on; errors appear when the user leaves a field or presses Next — never before. All fields (text, select, radio, checkbox) live in <b>one state object</b> updated by <b>one handler</b>; the item list is a <b>dynamic field array</b>. Pressing Enter submits the form and acts as Next.</p>',
    vi: '<p>Thanh toán bốn bước: <b>Account → Shipping → Items → Review</b>. Mỗi bước được kiểm trước khi đi tiếp; lỗi hiện khi người dùng rời ô hoặc bấm Next — không bao giờ hiện trước. Mọi ô (text, select, radio, checkbox) nằm trong <b>một state object</b> cập nhật bằng <b>một handler</b>; danh sách mặt hàng là <b>mảng trường động</b>. Nhấn Enter gửi form và có tác dụng như Next.</p>',
  },
  chucNangChinh: [{ en: 'Step navigation · per-step validation with blur/next timing · controlled select/radio/checkbox · dynamic item rows · Enter = Next · review · submit & restart.', vi: 'Điều hướng bước · kiểm theo bước với thời điểm blur/next · select/radio/checkbox điều khiển · dòng mặt hàng động · Enter = Next · xem lại · gửi & làm lại.' }],
  yeuCauChung: [
    { en: 'The wizard is one <code>&lt;form id="wizard" noValidate&gt;</code>; Next/Place order are <code>type="submit"</code>, every other button <code>type="button"</code>; always <code>preventDefault</code>.', vi: 'Wizard là một <code>&lt;form id="wizard" noValidate&gt;</code>; Next/Place order là <code>type="submit"</code>, mọi nút khác <code>type="button"</code>; luôn <code>preventDefault</code>.' },
    { en: 'Validation in a pure <code>validateStep(step, data)</code> in <code>src/validation.js</code> (exact messages below).', vi: 'Kiểm hợp lệ bằng hàm thuần <code>validateStep(step, data)</code> trong <code>src/validation.js</code> (thông điệp đúng như dưới).' },
  ],
  cayThuMuc: `
src/
├── validation.js            # STEP_FIELDS · validateStep · DELIVERY · vnd
├── components/
│   ├── Field.js             # label + control + #err-<name>
│   └── Steps.js             # AccountStep · ShippingStep · ItemsStep · ReviewStep
├── App.js                   # one state object, one handler, step logic
└── index.css (given)`,
  wireframe: `
+-----------------------------------------------------------+
| [Account✓] [Shipping] [ Items ] [ Review ]                |
| Step 2 of 4 — Shipping                                    |
| Full name [Lan Nguyen        ]                            |
| Phone     [0912…             ]                            |
|           Phone must be 10 digits starting with 0         |
| Address   [12 Tran Phu       ]   City [Hue           v]   |
| Delivery  (•) Standard  ( ) Express   Delivery: 30,000 ₫  |
|                                       [Back]      [Next]  |
+-----------------------------------------------------------+`,
  moHinh: {
    ten: 'Wizard state',
    truong: [
      ['email · password · confirm', 'string', { en: 'step 1', vi: 'bước 1' }],
      ['fullName · phone · address · city · delivery', "string · 'standard' | 'express'", { en: 'step 2', vi: 'bước 2' }],
      ['items', '{ id, name, qty }[]', { en: 'step 3, at least one row', vi: 'bước 3, ít nhất một dòng' }],
      ['terms', 'boolean', { en: 'step 3', vi: 'bước 3' }],
      ['touched', '{ [field]: boolean }', { en: 'controls when errors are shown', vi: 'quyết định khi nào hiện lỗi' }],
    ],
  },
  chucNang: [
    { ten: { en: 'Step navigation', vi: 'Điều hướng bước' }, diem: 1.5, yeuCau: [{ en: '<code>ol#steps</code> with four <code>li.step</code> (<code>.active</code> current, <code>.done</code> before it), <code>#step-label</code> <code>Step 2 of 4 — Shipping</code>. Next only when the step is valid; <code>#btn-back</code> (not on step 1) keeps the values.', vi: '<code>ol#steps</code> có bốn <code>li.step</code> (<code>.active</code> bước hiện tại, <code>.done</code> các bước trước), <code>#step-label</code> <code>Step 2 of 4 — Shipping</code>. Chỉ đi tiếp khi bước hợp lệ; <code>#btn-back</code> (không có ở bước 1) giữ nguyên giá trị.' }] },
    { ten: { en: 'Validation & error timing', vi: 'Kiểm hợp lệ & thời điểm hiện lỗi' }, diem: 2, yeuCau: [
      { en: 'Errors <code>#err-&lt;field&gt;</code> appear only after the field is blurred or after pressing Next on that step, and disappear as soon as the value is valid.', vi: 'Lỗi <code>#err-&lt;field&gt;</code> chỉ hiện sau khi rời ô hoặc sau khi bấm Next ở bước đó, và biến mất ngay khi giá trị hợp lệ.' },
      { en: 'Messages: <code>Enter a valid email</code> · <code>At least 8 characters with a number</code> · <code>Passwords do not match</code> · <code>Full name is required</code> · <code>Phone must be 10 digits starting with 0</code> · <code>Address is too short</code> (≥ 5) · <code>Choose a city</code>.', vi: 'Thông điệp: <code>Enter a valid email</code> · <code>At least 8 characters with a number</code> · <code>Passwords do not match</code> · <code>Full name is required</code> · <code>Phone must be 10 digits starting with 0</code> · <code>Address is too short</code> (≥ 5) · <code>Choose a city</code>.' },
    ], viDu: { en: 'type "lan@" then move to Password ⇒ "Enter a valid email" appears', vi: 'gõ "lan@" rồi chuyển sang Password ⇒ hiện "Enter a valid email"' } },
    { ten: { en: 'Select, radio, checkbox', vi: 'Select, radio, checkbox' }, diem: 1, yeuCau: [{ en: '<code>#city</code> select; radios <code>#delivery-standard</code>/<code>#delivery-express</code> (name <code>delivery</code>) update <code>#delivery-fee</code> <code>Delivery: 60,000 ₫</code>; <code>#terms</code> checkbox.', vi: 'Select <code>#city</code>; radio <code>#delivery-standard</code>/<code>#delivery-express</code> (name <code>delivery</code>) đổi <code>#delivery-fee</code> <code>Delivery: 60,000 ₫</code>; checkbox <code>#terms</code>.' }] },
    { ten: { en: 'Dynamic item rows', vi: 'Dòng mặt hàng động' }, diem: 1.5, yeuCau: [{ en: '<code>.item-row</code> with <code>.item-name</code>, <code>.item-qty</code>, <code>.remove-item</code> (disabled when one row left); <code>#add-item</code>. Rows keyed by a stable id. Errors <code>#err-items</code> <code>Every item needs a name and a quantity of at least 1</code>, <code>#err-terms</code> <code>You must accept the terms</code>.', vi: '<code>.item-row</code> có <code>.item-name</code>, <code>.item-qty</code>, <code>.remove-item</code> (vô hiệu khi còn một dòng); <code>#add-item</code>. Dòng có key là id ổn định. Lỗi <code>#err-items</code> <code>Every item needs a name and a quantity of at least 1</code>, <code>#err-terms</code> <code>You must accept the terms</code>.' }] },
    { ten: { en: 'Form submit semantics', vi: 'Ngữ nghĩa gửi form' }, diem: 1, yeuCau: [{ en: 'Enter in any input submits the form ⇒ same as Next; add/remove buttons never submit; the page never reloads.', vi: 'Enter trong ô bất kỳ gửi form ⇒ như Next; nút thêm/xoá không bao giờ gửi form; trang không tải lại.' }] },
    { ten: { en: 'Review step', vi: 'Bước xem lại' }, diem: 1, yeuCau: [{ en: '<code>dl.review</code>: <code>#review-email</code>, <code>#review-name</code> <code>Lan Nguyen · 0912345678</code>, <code>#review-address</code> <code>12 Tran Phu, Hue</code>, <code>#review-delivery</code> <code>Express — 60,000 ₫</code>, <code>#review-items</code> <code>Pen ×2, Book ×1</code>.', vi: '<code>dl.review</code>: <code>#review-email</code>, <code>#review-name</code> <code>Lan Nguyen · 0912345678</code>, <code>#review-address</code> <code>12 Tran Phu, Hue</code>, <code>#review-delivery</code> <code>Express — 60,000 ₫</code>, <code>#review-items</code> <code>Pen ×2, Book ×1</code>.' }] },
    { ten: { en: 'Submit & restart', vi: 'Gửi & làm lại' }, diem: 1, yeuCau: [{ en: '<code>#btn-submit</code> ⇒ <code>#success</code> <code>Order placed for Lan Nguyen</code>; <code>#btn-restart</code> resets data, touched and step.', vi: '<code>#btn-submit</code> ⇒ <code>#success</code> <code>Order placed for Lan Nguyen</code>; <code>#btn-restart</code> đặt lại dữ liệu, touched và bước.' }] },
    { ten: { en: 'One state, one handler', vi: 'Một state, một handler' }, diem: 1, yeuCau: [{ en: '<code>useState(initial)</code> holds every field; <code>handleChange</code> uses <code>e.target.name</code> and <code>checked</code> for checkboxes.', vi: '<code>useState(initial)</code> giữ mọi trường; <code>handleChange</code> dùng <code>e.target.name</code> và <code>checked</code> cho checkbox.' }] },
  ],
  idBatBuoc: [
    ['#wizard · #steps .step(.active/.done) · #step-label · #btn-back · #btn-next · #btn-submit', { en: 'wizard', vi: 'wizard' }],
    ['#email #password #confirm · #fullName #phone #address #city · #delivery-standard #delivery-express · #delivery-fee', { en: 'fields', vi: 'các ô' }],
    ['.item-row .item-name .item-qty .remove-item · #add-item · #terms', { en: 'items', vi: 'mặt hàng' }],
    ['#err-<field> · #err-items · #err-terms', { en: 'errors', vi: 'lỗi' }],
    ['.review dd#review-* · #success · #btn-restart', { en: 'review & result', vi: 'xem lại & kết quả' }],
  ],
  truDiem: [
    { en: 'All errors shown the moment the page opens.', vi: 'Hiện mọi lỗi ngay khi vừa mở trang.' },
    { en: 'A button without <code>type="button"</code> inside the form — adding an item jumps to the next step.', vi: 'Nút trong form thiếu <code>type="button"</code> — thêm mặt hàng lại nhảy sang bước kế.' },
    { en: '<code>key={index}</code> on item rows — removing a row shows the wrong text.', vi: '<code>key={index}</code> cho dòng mặt hàng — xoá một dòng thì chữ hiện sai.' },
    { en: 'Ten separate <code>useState</code> + ten handlers.', vi: 'Mười <code>useState</code> riêng + mười handler.' },
  ],
  nopBai: NOP_BAI,
};

export default doiDau({
  slug: 'fer202-6-deep-checkout-wizard',
  ten: 'Deep Lab 6 — Multi-step Checkout Wizard (events & forms)',
  khoa: KHOA,
  baiHoc: 'fer202-6-1-events-forms',
  de: [
    {
      dangBai: 'deep-lab',
      tieuDe: { en: 'Deep Lab 6 — Multi-step Checkout Wizard (step validation · field arrays · Enter = Next)', vi: 'Deep Lab 6 — Wizard thanh toán nhiều bước (kiểm theo bước · mảng trường · Enter = Next)' },
      doKho: 'HARD',
      phut: 120,
      diem: 100,
      khaiNiem: ['multi-step forms', 'touched / blur validation', 'single state object', 'generic change handler', 'dynamic field arrays', 'form submit semantics', 'pure validation'],
      tienQuyet: ['Lab 6 — Registration form'],
      the: ['fer202', 'deep-lab', 'forms', 'events'],
      banIn: BAN_IN,
      thuatNgu: [
        { en: 'wizard', vi: 'form chia nhiều bước nối tiếp' },
        { en: 'touched', vi: 'ô đã được người dùng chạm/rời khỏi' },
        { en: 'field array', vi: 'danh sách ô có thể thêm/xoá dòng' },
        { en: 'blur', vi: 'sự kiện rời khỏi ô (mất focus)' },
        { en: 'implicit submission', vi: 'Enter trong ô tự gửi form' },
        ...tn('rubric'),
      ],
      goiY: [
        'errors = validateStep(step, data) tính mỗi lần render; lỗi một ô chỉ hiện khi touched[ô] = true.',
        'Next (onSubmit): có lỗi ⇒ đánh dấu touched mọi ô của bước (STEP_FIELDS[step]) và dừng; không lỗi ⇒ setStep(s => s + 1).',
        'Một handler: const { name, type, value, checked } = e.target; setData(d => ({ ...d, [name]: type === "checkbox" ? checked : value })).',
        'Mảng mặt hàng: id tăng dần cho key; sửa bằng map, xoá bằng filter, thêm bằng spread.',
      ],
      loiHayGap: [
        'Kiểm hợp lệ trong onChange và lưu lỗi vào state ⇒ lỗi "trễ một nhịp" và dễ lệch với dữ liệu.',
        'Đặt <code>onClick</code> cho nút Next thay vì <code>onSubmit</code> của form ⇒ Enter không hoạt động.',
        'Radio thiếu cùng <code>name</code> ⇒ chọn được cả hai.',
        'Checkbox đọc <code>e.target.value</code> ⇒ luôn là chuỗi "on".',
      ],
      moTaNgan: 'Deep lab chương 6: wizard thanh toán bốn bước — kiểm theo bước, lỗi sau blur/Next, một state + một handler cho mọi loại ô, mảng mặt hàng động, Enter = Next, xem lại, gửi & làm lại. Thang 10.',
      giaiThich: '<p>Lỗi là <b>dữ liệu suy ra</b> từ <code>validateStep(step, data)</code>; state <code>touched</code> chỉ quyết định KHI NÀO được hiện. Nhờ vậy lỗi luôn khớp dữ liệu và tự biến mất khi sửa đúng. Cả wizard là một form: nút Next là <code>submit</code> nên Enter trong ô nào cũng đi tiếp, còn các nút khác là <code>type="button"</code>. Một handler đọc <code>name</code>/<code>type</code> của ô nên thêm trường mới không cần thêm hàm. Mảng mặt hàng dùng id ổn định làm key để xoá một dòng không làm chữ của dòng khác nhảy chỗ.</p>',
      tests: { loai: 'react', phienBan: 1, tepChinh: 'src/index.js', kiem: KIEM },
      khoiDau: KHOI_DAU,
      loiGiai: LOI_GIAI,
      demo: { tepChinh: 'src/index.js' },
      thamKhao: 'https://react.dev/reference/react-dom/components/input',
    },
  ],
});
