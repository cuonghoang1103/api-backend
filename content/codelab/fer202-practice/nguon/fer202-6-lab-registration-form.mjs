/**
 * FER202 · Chương 6 (Event handling) — LAB 6: Workshop Registration Form.
 * Bám Exercise 16/17/18 (event handling, render & commit, state as a snapshot) nhưng sâu hơn: mọi loại ô nhập
 * controlled (text, select, radio, nhóm checkbox, textarea), sự kiện bàn phím (Enter/Backspace) trong ô kỹ năng,
 * truyền tham số cho handler, kiểm hợp lệ trực tiếp sau lần gửi đầu, preventDefault, cập nhật hàm (snapshot).
 */
import { doiDau, index, KHOA, NOP_BAI, tn } from './_chung.mjs';

const OPTIONS = `// src/data/options.js — đã cho
export const TRACKS = ['Frontend', 'Backend', 'Mobile', 'AI'];
export const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
export const TOPICS = [
  { id: 'react', label: 'React' },
  { id: 'nodejs', label: 'Node.js' },
  { id: 'testing', label: 'Testing' },
  { id: 'uiux', label: 'UI/UX' },
  { id: 'devops', label: 'DevOps' },
];
`;

const CSS = `/* src/index.css — đã cho */
* { box-sizing: border-box; }
body { margin: 0; font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; background: #f8fafc; color: #0f172a; }
.page { max-width: 980px; margin: 0 auto; padding: 20px; display: grid; grid-template-columns: 1fr 300px; gap: 20px; }
@media (max-width: 800px) { .page { grid-template-columns: 1fr; } }
form, .card { background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 18px; }
.field { display: grid; gap: 4px; margin-bottom: 12px; font-size: 14px; }
.field input[type=text], .field input[type=email], .field input[type=tel], .field select, .field textarea {
  padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 8px; font: inherit; }
.inline { display: flex; flex-wrap: wrap; gap: 12px; }
.error { color: #dc2626; font-size: 12px; }
.tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
.tag { background: #e0f2fe; color: #075985; border-radius: 999px; padding: 2px 4px 2px 10px; font-size: 13px; }
.tag-remove { border: 0; background: transparent; cursor: pointer; }
button { cursor: pointer; padding: 7px 14px; border-radius: 8px; border: 1px solid #cbd5e1; background: #fff; font: inherit; }
button[type=submit] { background: #2563eb; color: #fff; border-color: #2563eb; }
.muted { color: #64748b; font-size: 12px; }
#success { background: #ecfdf5; border-color: #6ee7b7; }
`;

// ═════════════════════════════════════ LỜI GIẢI ═════════════════════════════════════
const VALIDATE = `// src/utils/validate.js — luật kiểm thuần JS: nhận dữ liệu form, trả { tênÔ: câu lỗi }
const EMAIL_RE = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
const PHONE_RE = /^0\\d{9}$/;

export default function validate(form) {
  const errors = {};
  if (form.fullName.trim().split(/\\s+/).filter(Boolean).length < 2) errors.fullName = 'Please enter your full name';
  if (!EMAIL_RE.test(form.email.trim())) errors.email = 'Invalid email address';
  if (!PHONE_RE.test(form.phone.trim())) errors.phone = 'Phone must be 10 digits starting with 0';
  if (!form.track) errors.track = 'Please choose a track';
  if (form.topics.length === 0) errors.topics = 'Pick at least one topic';
  return errors;
}
`;

const SKILLS = `// src/components/SkillInput.js — ô "chip": Enter thêm, Backspace (ô trống) xoá chip cuối, ✕ xoá đúng chip
import { useState } from 'react';

const MAX = 5;

export default function SkillInput({ skills, onChange }) {
  const [text, setText] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Enter trong form mặc định = GỬI FORM — chặn lại
      const skill = text.trim();
      const exists = skills.some((s) => s.toLowerCase() === skill.toLowerCase());
      if (skill && !exists && skills.length < MAX) onChange([...skills, skill]);
      setText('');
    } else if (e.key === 'Backspace' && text === '' && skills.length > 0) {
      onChange(skills.slice(0, -1)); // bỏ chip cuối (mảng mới)
    }
  };

  // truyền THAM SỐ cho handler: arrow function bọc lại, không gọi ngay khi render
  const remove = (skill) => onChange(skills.filter((s) => s !== skill));

  return (
    <div>
      <input
        id="skill-input"
        type="text"
        placeholder="Type a skill and press Enter"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className="tags">
        {skills.map((s) => (
          <span key={s} className="tag">
            {s}
            <button type="button" className="tag-remove" aria-label={´Remove @{s}´} onClick={() => remove(s)}>✕</button>
          </span>
        ))}
      </div>
      <span className="muted">{skills.length}/{MAX} skills</span>
    </div>
  );
}
`;

const FORM = `// src/components/RegistrationForm.js — MỘT state object cho cả form + một handleChange dùng chung
import { useState } from 'react';
import SkillInput from './SkillInput';
import validate from '../utils/validate';
import { LEVELS, TOPICS, TRACKS } from '../data/options';

export const INITIAL = { fullName: '', email: '', phone: '', track: '', level: 'Beginner', topics: [], skills: [], bio: '' };
const BIO_MAX = 200;

export default function RegistrationForm({ onRegister }) {
  const [form, setForm] = useState(INITIAL);
  const [submitted, setSubmitted] = useState(false); // chỉ hiện lỗi SAU lần gửi đầu
  const [guests, setGuests] = useState(0);

  // lỗi là giá trị suy ra từ form ⇒ sửa ô nào là lỗi ô đó tự mất (không cần state lỗi riêng)
  const errors = submitted ? validate(form) : {};

  // text / email / tel / select / radio / textarea: cùng một handler nhờ thuộc tính name
  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  // nhóm checkbox ⇒ mảng: bật thì thêm, tắt thì bỏ; giữ thứ tự của TOPICS
  const toggleTopic = (id) =>
    setForm((f) => {
      const on = f.topics.includes(id) ? f.topics.filter((t) => t !== id) : [...f.topics, id];
      return { ...f, topics: TOPICS.map((t) => t.id).filter((t) => on.includes(t)) };
    });

  // "state as a snapshot": ba lần setGuests(guests + 1) chỉ +1. Dùng hàm cập nhật ⇒ +3 thật
  const addThree = () => {
    setGuests((g) => g + 1);
    setGuests((g) => g + 1);
    setGuests((g) => g + 1);
  };

  const reset = () => {
    setForm(INITIAL);
    setSubmitted(false);
    setGuests(0);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // không có dòng này trình duyệt tải lại trang
    setSubmitted(true);
    if (Object.keys(validate(form)).length > 0) return;
    onRegister({ ...form, fullName: form.fullName.trim(), email: form.email.trim(), guests });
    reset();
  };

  const err = (name) => errors[name] && <span id={´err-@{name}´} className="error">{errors[name]}</span>;
  const topicLabels = TOPICS.filter((t) => form.topics.includes(t.id)).map((t) => t.label);

  return (
    <>
      <form id="reg-form" onSubmit={handleSubmit} noValidate>
        <h2>Register for the workshop</h2>
        <label className="field">Full name
          <input id="fullName" name="fullName" type="text" value={form.fullName} onChange={handleChange} />
          {err('fullName')}
        </label>
        <label className="field">Email
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
          {err('email')}
        </label>
        <label className="field">Phone
          <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} />
          {err('phone')}
        </label>
        <label className="field">Track
          <select id="track" name="track" value={form.track} onChange={handleChange}>
            <option value="">-- Choose a track --</option>
            {TRACKS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          {err('track')}
        </label>
        <div className="field">Level
          <div className="inline">
            {LEVELS.map((lv) => (
              <label key={lv}>
                <input type="radio" id={´level-@{lv}´} name="level" value={lv} checked={form.level === lv} onChange={handleChange} /> {lv}
              </label>
            ))}
          </div>
        </div>
        <div className="field">Topics
          <div className="inline">
            {TOPICS.map((t) => (
              <label key={t.id}>
                <input type="checkbox" id={´topic-@{t.id}´} checked={form.topics.includes(t.id)} onChange={() => toggleTopic(t.id)} /> {t.label}
              </label>
            ))}
          </div>
          {err('topics')}
        </div>
        <div className="field">Skills
          <SkillInput skills={form.skills} onChange={(skills) => setForm((f) => ({ ...f, skills }))} />
        </div>
        <label className="field">Short bio
          <textarea id="bio" name="bio" rows={3} maxLength={BIO_MAX} value={form.bio} onChange={handleChange} />
          <span id="bio-count" className="muted">{BIO_MAX - form.bio.length} characters left</span>
        </label>
        <div className="field">Guests
          <div className="inline">
            <button type="button" id="minus-one" onClick={() => setGuests((g) => Math.max(0, g - 1))}>−1</button>
            <b id="guests">{guests}</b>
            <button type="button" id="plus-one" onClick={() => setGuests((g) => g + 1)}>+1</button>
            <button type="button" id="plus-three" onClick={addThree}>+3</button>
          </div>
        </div>
        <div className="inline">
          <button type="submit" id="btn-submit">Register</button>
          {/* type="button": nút trong form MẶC ĐỊNH là submit */}
          <button type="button" id="btn-reset" onClick={reset}>Reset</button>
        </div>
      </form>

      <aside className="card" id="preview">
        <h3 id="preview-name">Hello, {form.fullName.trim() || 'guest'}!</h3>
        <p id="preview-track">Track: {form.track || '—'}</p>
        <p id="preview-level">Level: {form.level}</p>
        <p id="preview-topics">Topics: {topicLabels.length ? topicLabels.join(', ') : '—'}</p>
      </aside>
    </>
  );
}
`;

const APP = `// src/App.js — giữ danh sách đăng ký; form báo lên qua onRegister
import { useState } from 'react';
import RegistrationForm from './components/RegistrationForm';

export default function App() {
  const [registrations, setRegistrations] = useState([]);
  const last = registrations[registrations.length - 1];

  return (
    <main className="page">
      <RegistrationForm onRegister={(r) => setRegistrations((list) => [...list, r])} />
      <section>
        {last && (
          <div id="success" className="card">
            <b>Registered!</b> {last.fullName} ({last.email}) joined the {last.track} track as {last.level}
            {last.skills.length > 0 && <> — skills: {last.skills.join(', ')}</>}.
          </div>
        )}
        <h3>Registrations ({registrations.length})</h3>
        <ul id="registrations">
          {registrations.map((r) => (
            <li key={r.email + r.fullName}>{r.fullName} — {r.track} ({r.level})</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
`;

// ═════════════════════════════════════ STARTER ═════════════════════════════════════
const S_FORM = `// src/components/RegistrationForm.js — STARTER: ô nhập chưa nối state, chưa kiểm, chưa chặn gửi
import { LEVELS, TOPICS, TRACKS } from '../data/options';

export default function RegistrationForm({ onRegister }) {
  // TODO: state form + handleChange, lỗi #err-<ô> sau lần gửi đầu, topics/skills/bio/guests, submit + reset
  return (
    <>
      <form id="reg-form">
        <h2>Register for the workshop</h2>
        <label className="field">Full name <input id="fullName" name="fullName" type="text" /></label>
        <label className="field">Email <input id="email" name="email" type="email" /></label>
        <label className="field">Phone <input id="phone" name="phone" type="tel" /></label>
        <label className="field">Track
          <select id="track" name="track">
            <option value="">-- Choose a track --</option>
            {TRACKS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
        <div className="field">Level
          {LEVELS.map((lv) => <label key={lv}><input type="radio" id={´level-@{lv}´} name="level" value={lv} /> {lv}</label>)}
        </div>
        <div className="field">Topics
          {TOPICS.map((t) => <label key={t.id}><input type="checkbox" id={´topic-@{t.id}´} /> {t.label}</label>)}
        </div>
        <button id="btn-submit">Register</button>
      </form>
      <aside className="card" id="preview">
        <h3 id="preview-name">Hello, guest!</h3>
      </aside>
    </>
  );
}
`;
const S_SKILLS = `// src/components/SkillInput.js — STARTER
export default function SkillInput({ skills, onChange }) {
  // TODO: Enter thêm chip .tag (không trùng, tối đa 5), Backspace khi ô trống xoá chip cuối, .tag-remove xoá chip đó
  return <input id="skill-input" type="text" placeholder="Type a skill and press Enter" />;
}
`;
const S_VALIDATE = `// src/utils/validate.js — STARTER
export default function validate(form) {
  // TODO: fullName (≥ 2 từ) · email · phone (0 + 9 chữ số) · track · topics (≥ 1)
  return {};
}
`;

const INDEX = index().replace("import App from './App';", "import './index.css';\nimport App from './App';");
const CHUNG = { 'src/App.js': APP, 'src/index.js': INDEX, 'src/index.css': CSS, 'src/data/options.js': OPTIONS };
const LOI_GIAI = { 'src/components/RegistrationForm.js': FORM, 'src/components/SkillInput.js': SKILLS, 'src/utils/validate.js': VALIDATE, ...CHUNG };
const KHOI_DAU = { 'src/components/RegistrationForm.js': S_FORM, 'src/components/SkillInput.js': S_SKILLS, 'src/utils/validate.js': S_VALIDATE, ...CHUNG };

// ═════════════════════════════════════ BỘ KIỂM ═════════════════════════════════════
const nhap = (selector, giaTri) => ({ hanhDong: 'nhap', selector, giaTri });
const click = (selector) => ({ hanhDong: 'click', selector });
const chon = (selector) => ({ hanhDong: 'chon-o', selector });
const phim = (selector, p) => ({ hanhDong: 'phim', selector, phim: p });
const gui = { hanhDong: 'gui', selector: '#reg-form' };
const skill = (s) => [nhap('#skill-input', s), phim('#skill-input', 'Enter')];
const HOP_LE = [
  nhap('#fullName', 'Nguyen Van An'), nhap('#email', 'an@example.com'), nhap('#phone', '0912345678'),
  { hanhDong: 'doi', selector: '#track', giaTri: 'Backend' }, chon('#level-Advanced'), chon('#topic-react'), chon('#topic-testing'),
];
const KIEM = [
  // f1
  { nhom: 'f1', moTa: 'Preview greets a guest at first', kiem: 'text', selector: '#preview-name', giaTri: 'Hello, guest!' },
  { nhom: 'f1', moTa: 'Preview updates while typing the name', kiem: 'text', selector: '#preview-name', giaTri: 'Hello, Nguyen Van An!', truoc: [nhap('#fullName', 'Nguyen Van An')] },
  { nhom: 'f1', moTa: 'Inputs are controlled (value + onChange)', kiem: 'ma-nguon', tep: 'src/components/RegistrationForm.js', khop: 'value=\\{form\\.fullName\\}|value=\\{fullName\\}' },
  // f2
  { nhom: 'f2', moTa: 'Select #track updates the preview', kiem: 'text', selector: '#preview-track', giaTri: 'Track: Backend', truoc: [{ hanhDong: 'doi', selector: '#track', giaTri: 'Backend' }] },
  { nhom: 'f2', moTa: 'Level defaults to Beginner; radio changes it', kiem: 'text', selector: '#preview-level', giaTri: 'Level: Advanced', truoc: [chon('#level-Advanced')] },
  { nhom: 'f2', moTa: 'Checked topics listed in TOPICS order', kiem: 'text', selector: '#preview-topics', giaTri: 'Topics: React, Testing', truoc: [chon('#topic-testing'), chon('#topic-react')] },
  { nhom: 'f2', an: true, moTa: 'Unchecking removes the topic', kiem: 'text', selector: '#preview-topics', giaTri: 'Topics: Testing', truoc: [chon('#topic-testing'), chon('#topic-react'), { hanhDong: 'chon-o', selector: '#topic-react', giaTri: false }] },
  { nhom: 'f2', an: true, moTa: '#level-Beginner is checked initially', kiem: 'thuoc-tinh-js', selector: '#level-Beginner', thuocTinh: 'checked', giaTri: true },
  // f3
  { nhom: 'f3', moTa: 'No error is shown before the first submit', kiem: 'so-luong', selector: '.error', giaTri: 0, truoc: [nhap('#email', 'abc')] },
  { nhom: 'f3', moTa: 'Empty submit ⇒ 5 errors', kiem: 'so-luong', selector: '.error', giaTri: 5, truoc: [gui] },
  { nhom: 'f3', moTa: 'Exact messages for email and phone', kiem: 'danh-sach-text', selector: '#err-email, #err-phone', mongDoi: ['Invalid email address', 'Phone must be 10 digits starting with 0'], truoc: [nhap('#email', 'an@'), nhap('#phone', '12345'), gui] },
  { nhom: 'f3', moTa: 'After submitting, fixing a field clears its error live', kiem: 'khong-ton-tai', selector: '#err-fullName', truoc: [gui, nhap('#fullName', 'Tran Binh')] },
  { nhom: 'f3', an: true, moTa: 'One-word name is rejected', kiem: 'text', selector: '#err-fullName', giaTri: 'Please enter your full name', truoc: [nhap('#fullName', 'An'), gui] },
  { nhom: 'f3', an: true, moTa: 'Track and topics messages', kiem: 'danh-sach-text', selector: '#err-track, #err-topics', mongDoi: ['Please choose a track', 'Pick at least one topic'], truoc: [gui] },
  { nhom: 'f3', an: true, moTa: 'Phone starting with 1 is rejected', kiem: 'ton-tai', selector: '#err-phone', truoc: [...HOP_LE, nhap('#phone', '1912345678'), gui] },
  // f4
  { nhom: 'f4', moTa: 'Enter adds a skill chip', kiem: 'danh-sach-text', selector: '.tag', mongDoi: ['React✕', 'Docker✕'], truoc: [...skill('React'), ...skill('Docker')] },
  { nhom: 'f4', moTa: 'Duplicates (any case) are ignored', kiem: 'so-luong', selector: '.tag', giaTri: 1, truoc: [...skill('React'), ...skill('react')] },
  { nhom: 'f4', moTa: 'Enter is handled in onKeyDown with preventDefault (so it cannot submit the form)', kiem: 'ma-nguon', tep: 'src/components/SkillInput.js', khop: "key\\s*===\\s*['\"]Enter['\"][\\s\\S]{0,200}preventDefault\\(\\)" },
  { nhom: 'f4', moTa: '✕ removes exactly that chip', kiem: 'danh-sach-text', selector: '.tag', mongDoi: ['Docker✕'], truoc: [...skill('React'), ...skill('Docker'), click('.tag-remove')] },
  { nhom: 'f4', an: true, moTa: 'Backspace on an empty box removes the last chip', kiem: 'danh-sach-text', selector: '.tag', mongDoi: ['React✕'], truoc: [...skill('React'), ...skill('Docker'), phim('#skill-input', 'Backspace')] },
  { nhom: 'f4', an: true, moTa: 'At most 5 skills', kiem: 'so-luong', selector: '.tag', giaTri: 5, truoc: ['A1', 'B2', 'C3', 'D4', 'E5', 'F6'].flatMap(skill) },
  { nhom: 'f4', an: true, moTa: 'The skill box is cleared after Enter', kiem: 'thuoc-tinh-js', selector: '#skill-input', thuocTinh: 'value', giaTri: '', truoc: skill('React') },
  // f5
  { nhom: 'f5', moTa: '#bio-count starts at 200', kiem: 'text', selector: '#bio-count', giaTri: '200 characters left' },
  { nhom: 'f5', moTa: 'Counter decreases while typing', kiem: 'text', selector: '#bio-count', giaTri: '195 characters left', truoc: [nhap('#bio', 'Hello')] },
  { nhom: 'f5', an: true, moTa: '#bio has maxLength 200', kiem: 'thuoc-tinh-js', selector: '#bio', thuocTinh: 'maxLength', giaTri: 200 },
  // f6
  { nhom: 'f6', moTa: 'Valid submit shows #success', kiem: 'text', selector: '#success', khop: 'Nguyen Van An[\\s\\S]*Backend[\\s\\S]*Advanced', truoc: [...HOP_LE, gui] },
  { nhom: 'f6', moTa: 'Registration is listed', kiem: 'danh-sach-text', selector: '#registrations li', mongDoi: ['Nguyen Van An — Backend (Advanced)'], truoc: [...HOP_LE, gui] },
  { nhom: 'f6', moTa: 'Form resets after a successful submit', kiem: 'thuoc-tinh-js', selector: '#fullName', thuocTinh: 'value', giaTri: '', truoc: [...HOP_LE, gui] },
  { nhom: 'f6', moTa: 'Submitting does not reload the page', kiem: 'khong-tai-lai', truoc: [...HOP_LE, gui] },
  { nhom: 'f6', an: true, moTa: 'Skills are included in the success message', kiem: 'text', selector: '#success', khop: 'skills: React, Jest', truoc: [...HOP_LE, ...skill('React'), ...skill('Jest'), gui] },
  { nhom: 'f6', an: true, moTa: 'No error shown right after a successful reset', kiem: 'so-luong', selector: '.error', giaTri: 0, truoc: [...HOP_LE, gui] },
  // f7
  { nhom: 'f7', moTa: '+3 adds three (functional updates)', kiem: 'text', selector: '#guests', giaTri: '3', truoc: [click('#plus-three')] },
  { nhom: 'f7', an: true, moTa: '+3 twice ⇒ 6, −1 ⇒ 5, never below 0', kiem: 'text', selector: '#guests', giaTri: '5', truoc: [click('#plus-three'), click('#plus-three'), click('#minus-one')] },
  { nhom: 'f7', an: true, moTa: 'Guests never go below 0', kiem: 'text', selector: '#guests', giaTri: '0', truoc: [click('#minus-one')] },
  // f8
  { nhom: 'f8', moTa: 'Reset clears the fields', kiem: 'thuoc-tinh-js', selector: '#fullName', thuocTinh: 'value', giaTri: '', truoc: [nhap('#fullName', 'Le Hoa'), click('#btn-reset')] },
  { nhom: 'f8', moTa: 'Reset is not a submit (no error, nothing registered)', kiem: 'so-luong', selector: '.error, #registrations li', giaTri: 0, truoc: [nhap('#fullName', 'Le Hoa'), click('#btn-reset')] },
  { nhom: 'f8', an: true, moTa: 'Reset also hides errors shown after a failed submit', kiem: 'so-luong', selector: '.error', giaTri: 0, truoc: [gui, click('#btn-reset')] },
];

const BAN_IN = {
  tieuDe: { en: 'LAB 6: Workshop Registration Form — events & controlled forms', vi: 'LAB 6: Form đăng ký workshop — sự kiện & form controlled' },
  phu: { en: 'FER202 · Chapter 6 — Event Handling · Suggested time: 100 minutes · Total: 10 marks', vi: 'FER202 · Chương 6 — Xử lý sự kiện · Thời gian gợi ý: 100 phút · Tổng: 10 điểm' },
  moTa: {
    en: '<p>Build the registration form of a coding workshop. Every input is a <b>controlled component</b>; one <code>handleChange</code> serves many inputs through their <code>name</code>; keyboard events drive a "skills" chip input; validation messages appear after the first submit and update live; a live preview shows what the user typed. You will also meet the classic <b>state-as-a-snapshot</b> trap.</p>',
    vi: '<p>Làm form đăng ký một workshop lập trình. Mọi ô nhập là <b>controlled component</b>; một <code>handleChange</code> phục vụ nhiều ô qua thuộc tính <code>name</code>; sự kiện bàn phím điều khiển ô "kỹ năng" dạng chip; câu lỗi hiện sau lần gửi đầu và cập nhật trực tiếp; khung xem trước hiện ngay những gì người dùng gõ. Bạn cũng gặp bẫy kinh điển <b>state là ảnh chụp (snapshot)</b>.</p>',
  },
  chucNangChinh: [
    { en: 'Text, email, tel, select, radio, checkbox group and textarea — all controlled.', vi: 'Text, email, tel, select, radio, nhóm checkbox và textarea — đều controlled.' },
    { en: 'Keyboard-driven skill chips, live validation, submit without reload, reset.', vi: 'Chip kỹ năng điều khiển bằng bàn phím, kiểm hợp lệ trực tiếp, gửi không tải lại, nút làm lại.' },
  ],
  yeuCauChung: [
    { en: 'Function components + <code>useState</code> only. No form library.', vi: 'Chỉ function component + <code>useState</code>. Không dùng thư viện form.' },
    { en: 'The whole form state is ONE object; one <code>handleChange</code> uses <code>e.target.name</code>.', vi: 'Toàn bộ state form là MỘT object; một <code>handleChange</code> dùng <code>e.target.name</code>.' },
    { en: 'Errors are derived from the form data (no separate error state needed).', vi: 'Lỗi là giá trị suy ra từ dữ liệu form (không cần state lỗi riêng).' },
  ],
  cayThuMuc: `
src/
├── components/
│   ├── RegistrationForm.js   # form + preview + guests
│   └── SkillInput.js         # chip input (keyboard events)
├── utils/
│   └── validate.js           # rules → { field: message }
├── data/
│   └── options.js            # TRACKS, LEVELS, TOPICS (given)
├── App.js                    # registrations list (given)
├── index.css                 # given
└── index.js                  # given`,
  wireframe: `
+--------------------------------------------------------+-----------------------+
| Register for the workshop                              | Hello, Nguyen Van An! |
| Full name [Nguyen Van An              ]                | Track: Backend        |
| Email     [an@example.com             ]                | Level: Advanced       |
| Phone     [0912345678                 ]                | Topics: React, Testing|
| Track     [Backend                  v]                 +-----------------------+
| Level     (o) Beginner ( ) Intermediate ( ) Advanced   | Registered! ...       |
| Topics    [x] React [ ] Node.js [x] Testing ...        | Registrations (1)     |
| Skills    [Type a skill and press Enter]               | - Nguyen Van An —     |
|           (React x) (Docker x)   2/5 skills            |   Backend (Advanced)  |
| Short bio [                         ] 200 characters left                       |
| Guests    [-1]  0  [+1] [+3]                           |                       |
| [Register] [Reset]                                     |                       |
+--------------------------------------------------------+-----------------------+`,
  moHinh: {
    ten: 'Registration (form state)',
    truong: [
      ['fullName / email / phone', 'string', { en: 'text inputs', vi: 'ô chữ' }],
      ['track', "'' | 'Frontend' | 'Backend' | 'Mobile' | 'AI'", { en: 'select, empty by default', vi: 'select, mặc định rỗng' }],
      ['level', "'Beginner' | 'Intermediate' | 'Advanced'", { en: 'radio, default Beginner', vi: 'radio, mặc định Beginner' }],
      ['topics', 'string[] (topic ids)', { en: 'checkbox group, kept in TOPICS order', vi: 'nhóm checkbox, giữ thứ tự TOPICS' }],
      ['skills', 'string[]', { en: 'chips, ≤ 5, unique (case-insensitive)', vi: 'chip, ≤ 5, không trùng (không phân biệt hoa/thường)' }],
      ['bio', 'string', { en: '≤ 200 characters', vi: '≤ 200 ký tự' }],
    ],
  },
  chucNang: [
    {
      ten: { en: 'Controlled text inputs + live preview', vi: 'Ô chữ controlled + xem trước' }, diem: 1,
      yeuCau: [
        { en: '<code>#fullName</code>, <code>#email</code>, <code>#phone</code> with <code>value</code> + <code>onChange</code>.', vi: '<code>#fullName</code>, <code>#email</code>, <code>#phone</code> có <code>value</code> + <code>onChange</code>.' },
        { en: '<code>#preview-name</code> reads <code>Hello, {name}!</code> while typing (<code>Hello, guest!</code> when empty).', vi: '<code>#preview-name</code> ghi <code>Hello, {tên}!</code> ngay khi gõ (<code>Hello, guest!</code> khi trống).' },
      ],
      hook: ['useState', 'onChange'],
    },
    {
      ten: { en: 'Select, radio & checkbox group', vi: 'Select, radio & nhóm checkbox' }, diem: 1.5,
      yeuCau: [
        { en: '<code>#track</code> (empty option first), radios <code>#level-{Level}</code> (<code>name="level"</code>, default Beginner), checkboxes <code>#topic-{id}</code> stored as an array.', vi: '<code>#track</code> (lựa chọn rỗng đầu tiên), radio <code>#level-{Level}</code> (<code>name="level"</code>, mặc định Beginner), checkbox <code>#topic-{id}</code> lưu thành mảng.' },
        { en: 'Preview: <code>#preview-track</code> <code>Track: X</code>, <code>#preview-level</code> <code>Level: X</code>, <code>#preview-topics</code> <code>Topics: React, Testing</code> (TOPICS order).', vi: 'Xem trước: <code>#preview-track</code> <code>Track: X</code>, <code>#preview-level</code> <code>Level: X</code>, <code>#preview-topics</code> <code>Topics: React, Testing</code> (thứ tự TOPICS).' },
      ],
      hook: ['checked + onChange'],
    },
    {
      ten: { en: 'Validation', vi: 'Kiểm hợp lệ' }, diem: 2,
      moTa: { en: 'Nothing is shown before the first submit. After it, every error is shown in <code>#err-{field}.error</code> and disappears as soon as the field becomes valid.', vi: 'Trước lần gửi đầu không hiện gì. Sau đó mọi lỗi hiện trong <code>#err-{ô}.error</code> và biến mất ngay khi ô hợp lệ.' },
      yeuCau: [
        { en: 'fullName ≥ 2 words ⇒ <code>Please enter your full name</code>', vi: 'fullName ≥ 2 từ ⇒ <code>Please enter your full name</code>' },
        { en: 'email ⇒ <code>Invalid email address</code> · phone <code>0</code> + 9 digits ⇒ <code>Phone must be 10 digits starting with 0</code>', vi: 'email ⇒ <code>Invalid email address</code> · phone <code>0</code> + 9 chữ số ⇒ <code>Phone must be 10 digits starting with 0</code>' },
        { en: 'track ⇒ <code>Please choose a track</code> · topics ≥ 1 ⇒ <code>Pick at least one topic</code>', vi: 'track ⇒ <code>Please choose a track</code> · topics ≥ 1 ⇒ <code>Pick at least one topic</code>' },
      ],
    },
    {
      ten: { en: 'Skill chips (keyboard events)', vi: 'Chip kỹ năng (sự kiện bàn phím)' }, diem: 1.5,
      yeuCau: [
        { en: '<code>#skill-input</code>: <b>Enter</b> adds a <code>.tag</code> (trimmed, unique ignoring case, max 5) and clears the box — it must <b>not</b> submit the form.', vi: '<code>#skill-input</code>: <b>Enter</b> thêm một <code>.tag</code> (bỏ khoảng trắng, không trùng bất kể hoa/thường, tối đa 5) và xoá ô — <b>không</b> được gửi form.' },
        { en: '<b>Backspace</b> on an empty box removes the last chip; each chip has a <code>.tag-remove</code> (✕) button that removes that chip.', vi: '<b>Backspace</b> khi ô trống xoá chip cuối; mỗi chip có nút <code>.tag-remove</code> (✕) xoá đúng chip đó.' },
      ],
      hook: ['onKeyDown', 'e.key', 'e.preventDefault()'],
      viDu: { en: 'React + Enter, react + Enter, Docker + Enter  ⇒  (React ✕) (Docker ✕)  ·  Backspace on empty box  ⇒  (React ✕)', vi: 'React + Enter, react + Enter, Docker + Enter  ⇒  (React ✕) (Docker ✕)  ·  Backspace khi ô trống  ⇒  (React ✕)' },
    },
    {
      ten: { en: 'Bio counter', vi: 'Đếm ký tự bio' }, diem: 1,
      yeuCau: [{ en: '<code>#bio</code> textarea, <code>maxLength</code> 200; <code>#bio-count</code> reads <code>N characters left</code>.', vi: 'Textarea <code>#bio</code>, <code>maxLength</code> 200; <code>#bio-count</code> ghi <code>N characters left</code>.' }],
    },
    {
      ten: { en: 'Submit', vi: 'Gửi form' }, diem: 1.5,
      yeuCau: [
        { en: '<code>#reg-form</code> submit: <code>e.preventDefault()</code>; if valid, add the registration (App shows <code>#success</code> and a line <code>Name — Track (Level)</code> in <code>#registrations</code>), then reset the form.', vi: 'Gửi <code>#reg-form</code>: <code>e.preventDefault()</code>; hợp lệ thì thêm đăng ký (App hiện <code>#success</code> và dòng <code>Tên — Track (Level)</code> trong <code>#registrations</code>), rồi làm trống form.' },
      ],
      hook: ['onSubmit', 'callback props'],
    },
    {
      ten: { en: 'Guests (state as a snapshot)', vi: 'Khách đi kèm (state là ảnh chụp)' }, diem: 0.5,
      yeuCau: [{ en: '<code>#guests</code> with <code>#minus-one</code> (not below 0), <code>#plus-one</code>, <code>#plus-three</code>. +3 must add three — use updater functions.', vi: '<code>#guests</code> với <code>#minus-one</code> (không dưới 0), <code>#plus-one</code>, <code>#plus-three</code>. +3 phải cộng đủ ba — dùng hàm cập nhật.' }],
      hook: ['setState(prev => …)'],
    },
    {
      ten: { en: 'Reset button', vi: 'Nút làm lại' }, diem: 1,
      yeuCau: [{ en: '<code>#btn-reset</code> (<code>type="button"</code>) restores the initial form, hides errors and sets guests to 0 — without submitting.', vi: '<code>#btn-reset</code> (<code>type="button"</code>) trả form về ban đầu, ẩn lỗi và đặt khách về 0 — không gửi form.' }],
    },
  ],
  idBatBuoc: [
    ['#reg-form · #fullName · #email · #phone · #track · #level-{Level} · #topic-{id} · #bio · #btn-submit · #btn-reset', { en: 'form', vi: 'form' }],
    ['#err-{field}.error', { en: 'error messages', vi: 'câu lỗi' }],
    ['#skill-input · .tag · .tag-remove', { en: 'skill chips', vi: 'chip kỹ năng' }],
    ['#bio-count · #guests · #minus-one · #plus-one · #plus-three', { en: 'counters', vi: 'bộ đếm' }],
    ['#preview-name · #preview-track · #preview-level · #preview-topics · #success · #registrations', { en: 'preview / result', vi: 'xem trước / kết quả' }],
  ],
  truDiem: [
    { en: 'Enter in the skill box submits the whole form (missing <code>preventDefault</code> on keydown).', vi: 'Enter trong ô kỹ năng gửi luôn cả form (thiếu <code>preventDefault</code> ở keydown).' },
    { en: '<code>onClick={remove(skill)}</code> — the function runs during render and deletes everything.', vi: '<code>onClick={remove(skill)}</code> — hàm chạy ngay khi render và xoá sạch.' },
    { en: 'Reset button without <code>type="button"</code> — it submits the form.', vi: 'Nút Reset thiếu <code>type="button"</code> — nó gửi form.' },
    { en: '<code>setGuests(guests + 1)</code> three times adds only 1.', vi: '<code>setGuests(guests + 1)</code> ba lần chỉ cộng 1.' },
    { en: 'Pushing into <code>form.topics</code> directly — the checkbox does not update.', vi: 'Push thẳng vào <code>form.topics</code> — checkbox không cập nhật.' },
  ],
  nopBai: NOP_BAI,
};

export default doiDau({
  slug: 'fer202-6-lab-registration-form',
  ten: 'Lab 6 — Workshop Registration Form (events & forms)',
  khoa: KHOA,
  baiHoc: 'fer202-6-1-events-forms',
  de: [
    {
      dangBai: 'lab',
      tieuDe: { en: 'Lab 6 — Workshop Registration Form (controlled inputs · keyboard events · validation)', vi: 'Lab 6 — Form đăng ký workshop (ô controlled · sự kiện bàn phím · kiểm hợp lệ)' },
      doKho: 'HARD',
      phut: 100,
      diem: 100,
      khaiNiem: ['controlled components', 'synthetic events', 'onKeyDown', 'preventDefault', 'passing arguments to handlers', 'state as a snapshot', 'derived validation'],
      tienQuyet: ['useState', 'props & callbacks'],
      the: ['fer202', 'lab', 'events', 'forms'],
      banIn: BAN_IN,
      thuatNgu: [
        { en: 'synthetic event', vi: 'sự kiện React bọc sự kiện trình duyệt (e.target, e.key, e.preventDefault)' },
        { en: 'event handler', vi: 'hàm xử lý sự kiện' },
        { en: 'updater function', vi: 'hàm cập nhật setX(prev => …) — luôn nhận giá trị mới nhất' },
        { en: 'snapshot', vi: 'ảnh chụp: trong một lần render, state là hằng số' },
        { en: 'chip / tag', vi: 'nhãn nhỏ có nút xoá' },
        ...tn('controlled', 'validate', 'derived', 'immutable', 'rubric'),
      ],
      goiY: [
        'Một state form = { fullName, email, phone, track, level, topics: [], skills: [], bio: "" }; handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value })) dùng cho text/select/radio/textarea.',
        'Checkbox nhóm: toggleTopic(id) tạo mảng mới (filter để bỏ, [...arr, id] để thêm). Lỗi = submitted ? validate(form) : {} — không cần state lỗi.',
        'SkillInput: onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); … } }}; Backspace chỉ xoá khi ô đang trống.',
        '+3: gọi setGuests(g => g + 1) ba lần. Nút Reset: type="button" và đặt lại form, submitted, guests.',
      ],
      loiHayGap: [
        'Ô nhập có <code>value</code> mà thiếu <code>onChange</code> ⇒ gõ không được (React cảnh báo read-only).',
        'Radio cùng nhóm nhưng khác <code>name</code> ⇒ chọn được nhiều nút một lúc.',
        '<code>onClick={remove(s)}</code> thay vì <code>onClick={() => remove(s)}</code> ⇒ gọi ngay lúc render.',
        'Enter trong ô chip làm gửi form ⇒ hiện cả loạt lỗi; phải <code>e.preventDefault()</code> trong onKeyDown.',
        '<code>setGuests(guests + 1)</code> nhiều lần trong cùng một handler ⇒ chỉ +1 vì guests là ảnh chụp của lần render.',
        'Hiện lỗi ngay khi trang vừa mở (chưa ai gõ gì) — người dùng thấy cả form đỏ.',
      ],
      moTaNgan: 'Lab chương 6: form đăng ký đủ loại ô controlled, chip kỹ năng bằng phím Enter/Backspace, kiểm hợp lệ trực tiếp, gửi không tải lại, bẫy state snapshot.',
      giaiThich: '<p>Một object state cho cả form + một <code>handleChange</code> dựa trên <code>e.target.name</code> giữ mã ngắn. Lỗi là giá trị suy ra: <code>submitted ? validate(form) : {}</code> — sửa ô nào, lần render sau lỗi ô đó tự mất. <code>SkillInput</code> xử lý <code>onKeyDown</code>: Enter thêm chip và <code>preventDefault</code> để không gửi form; Backspace trên ô trống xoá chip cuối; nút ✕ dùng arrow function để truyền tham số. Nút +3 minh hoạ "state là ảnh chụp": chỉ hàm cập nhật <code>g =&gt; g + 1</code> mới cộng dồn đúng.</p>',
      tests: { loai: 'react', phienBan: 1, tepChinh: 'src/index.js', kiem: KIEM },
      khoiDau: KHOI_DAU,
      loiGiai: LOI_GIAI,
      demo: { tepChinh: 'src/index.js' },
      thamKhao: 'https://react.dev/learn/responding-to-events',
    },
  ],
});
