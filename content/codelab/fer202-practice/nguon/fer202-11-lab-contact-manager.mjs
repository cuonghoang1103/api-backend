/**
 * FER202 · Chương 11 (Client-server) — LAB 11: Contact Manager (axios + json-server).
 * Bám Exercise 26 (json-server) + 27 (axios fetch & display) nhưng sâu hơn: tầng service, trạng thái tải/lỗi
 * + thử lại, Promise.all + nối bảng, CRUD đủ 4 động từ, kiểm trùng email trên máy chủ, cập nhật lạc quan
 * (optimistic) có hoàn tác khi máy chủ lỗi.
 */
import { doiDau, index, KHOA, NOP_BAI, tn } from './_chung.mjs';

const DB = {
  groups: [{ id: 1, name: 'Family' }, { id: 2, name: 'Work' }, { id: 3, name: 'Friends' }],
  contacts: [
    { id: 1, name: 'Nguyen Van An', email: 'an@example.com', phone: '0901000001', groupId: 2, favorite: false },
    { id: 2, name: 'Tran Thi Binh', email: 'binh@example.com', phone: '0901000002', groupId: 3, favorite: true },
    { id: 3, name: 'Le Hoang Cuong', email: 'cuong@example.com', phone: '0901000003', groupId: 1, favorite: false },
    { id: 4, name: 'Pham Minh Duc', email: 'duc@example.com', phone: '0901000004', groupId: 2, favorite: false },
    { id: 5, name: 'Vo Thu Em', email: 'em@example.com', phone: '0901000005', groupId: 3, favorite: false },
    { id: 6, name: 'Do Gia Huy', email: 'huy@example.com', phone: '0901000006', groupId: 2, favorite: true },
  ],
};
const DB_JSON = `${JSON.stringify(DB, null, 2)}\n`;

// ═════════════════════════════════════ LỜI GIẢI ═════════════════════════════════════
const SERVICE = `// src/services/contactService.js — TẦNG SERVICE: component không biết URL, chỉ gọi hàm
import axios from 'axios';

const api = axios.create({ baseURL: process.env.REACT_APP_API_URL });

// axios trả { data, status, headers } và TỰ ném lỗi khi status ngoài 2xx
export const getContacts = () => api.get('/contacts').then((r) => r.data);
export const getGroups = () => api.get('/groups').then((r) => r.data);
export const findByEmail = (email) => api.get('/contacts', { params: { email } }).then((r) => r.data);
export const createContact = (c) => api.post('/contacts', c).then((r) => r.data);
export const updateContact = (id, c) => api.put(´/contacts/@{id}´, c).then((r) => r.data);
export const patchContact = (id, part) => api.patch(´/contacts/@{id}´, part).then((r) => r.data);
export const deleteContact = (id) => api.delete(´/contacts/@{id}´);
`;

const FORM = `// src/components/ContactForm.js — một form cho cả THÊM và SỬA (editing = contact đang sửa hoặc null)
import { useEffect, useState } from 'react';

const EMPTY = { name: '', email: '', phone: '', groupId: '' };
const EMAIL_RE = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

export function validateContact(c) {
  if (!c.name.trim()) return 'Name is required';
  if (!EMAIL_RE.test(c.email.trim())) return 'Invalid email';
  if (!/^0\\d{9}$/.test(c.phone.trim())) return 'Phone must have 10 digits';
  if (!c.groupId) return 'Choose a group';
  return '';
}

export default function ContactForm({ groups, editing, onSave, onCancel }) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');

  // bấm Sửa ⇒ điền sẵn; huỷ/lưu xong (editing = null) ⇒ trống lại
  useEffect(() => {
    setForm(editing ? { name: editing.name, email: editing.email, phone: editing.phone, groupId: String(editing.groupId) } : EMPTY);
    setError('');
  }, [editing]);

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const msg = validateContact(form);
    if (msg) return setError(msg);
    try {
      await onSave({ name: form.name.trim(), email: form.email.trim().toLowerCase(), phone: form.phone.trim(), groupId: Number(form.groupId) });
      setForm(EMPTY);
      setError('');
    } catch (err) {
      setError(err.message); // vd "This email already exists"
    }
  };

  return (
    <form id="contact-form" onSubmit={handleSubmit} noValidate className="panel">
      <h3 id="form-title">{editing ? 'Edit contact' : 'Add contact'}</h3>
      <input id="name" name="name" placeholder="Full name" value={form.name} onChange={update} />
      <input id="email" name="email" placeholder="Email" value={form.email} onChange={update} />
      <input id="phone" name="phone" placeholder="Phone" value={form.phone} onChange={update} />
      <select id="groupId" name="groupId" value={form.groupId} onChange={update}>
        <option value="">-- Group --</option>
        {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
      </select>
      {error && <p id="form-error" className="error">{error}</p>}
      <button type="submit" id="btn-save">{editing ? 'Update' : 'Add'}</button>
      {editing && <button type="button" id="btn-cancel" onClick={onCancel}>Cancel</button>}
    </form>
  );
}
`;

const APP = `// src/App.js — tải song song, trạng thái tải/lỗi/thử lại, CRUD, cập nhật lạc quan
import { useCallback, useEffect, useMemo, useState } from 'react';
import ContactForm from './components/ContactForm';
import * as service from './services/contactService';

export default function App() {
  const [contacts, setContacts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [status, setStatus] = useState('loading'); // 'loading' | 'error' | 'ready'
  const [search, setSearch] = useState('');
  const [groupFilter, setGroupFilter] = useState('all');
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState('');

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      // hai request ĐỘC LẬP ⇒ chạy song song; một cái hỏng là cả Promise.all hỏng
      const [c, g] = await Promise.all([service.getContacts(), service.getGroups()]);
      setContacts(c);
      setGroups(g);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const groupName = useMemo(() => new Map(groups.map((g) => [String(g.id), g.name])), [groups]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return contacts
      .filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q))
      .filter((c) => groupFilter === 'all' || String(c.groupId) === groupFilter)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [contacts, search, groupFilter]);

  // THÊM / SỬA — kiểm trùng email TRÊN MÁY CHỦ (GET /contacts?email=) rồi POST hoặc PUT
  const save = async (data) => {
    const same = await service.findByEmail(data.email);
    if (same.some((c) => !editing || c.id !== editing.id)) throw new Error('This email already exists');
    if (editing) {
      const saved = await service.updateContact(editing.id, { ...data, favorite: editing.favorite });
      setContacts((list) => list.map((c) => (c.id === saved.id ? saved : c)));
      setEditing(null);
    } else {
      const saved = await service.createContact({ ...data, favorite: false });
      setContacts((list) => [...list, saved]);
    }
  };

  const remove = async (c) => {
    if (!window.confirm(´Delete @{c.name}?´)) return;
    await service.deleteContact(c.id);
    setContacts((list) => list.filter((x) => x.id !== c.id)); // không cần tải lại cả danh sách
  };

  // LẠC QUAN: đổi giao diện NGAY, gọi máy chủ sau; máy chủ lỗi ⇒ trả lại như cũ + báo
  const toggleFavorite = async (c) => {
    const flip = (v) => setContacts((list) => list.map((x) => (x.id === c.id ? { ...x, favorite: v } : x)));
    flip(!c.favorite);
    try {
      await service.patchContact(c.id, { favorite: !c.favorite });
    } catch {
      flip(c.favorite);
      setToast('Could not update favorite');
    }
  };

  if (status === 'loading') return <p id="loading" className="page">Loading contacts...</p>;
  if (status === 'error') {
    return (
      <div className="page">
        <p id="error" className="error">Failed to load contacts.</p>
        <button type="button" id="btn-retry" onClick={load}>Retry</button>
      </div>
    );
  }

  return (
    <main className="page">
      <h1>Contacts</h1>
      {toast && <p id="toast" className="error">{toast}</p>}
      <div className="toolbar">
        <input id="search" placeholder="Search name or email..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select id="group-filter" value={groupFilter} onChange={(e) => setGroupFilter(e.target.value)}>
          <option value="all">All groups</option>
          {groups.map((g) => <option key={g.id} value={String(g.id)}>{g.name}</option>)}
        </select>
        <button type="button" id="btn-refresh" onClick={load}>Refresh</button>
      </div>
      <p id="contact-count">{visible.length} of {contacts.length} contacts</p>
      <table id="contact-table">
        <thead>
          <tr><th>★</th><th>Name</th><th>Email</th><th>Phone</th><th>Group</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {visible.map((c) => (
            <tr key={c.id} id={´contact-row-@{c.id}´}>
              <td><button type="button" className="btn-fav" aria-pressed={c.favorite} onClick={() => toggleFavorite(c)}>{c.favorite ? '★' : '☆'}</button></td>
              <td className="c-name">{c.name}</td>
              <td className="c-email">{c.email}</td>
              <td className="c-phone">{c.phone}</td>
              <td className="c-group">{groupName.get(String(c.groupId)) ?? '—'}</td>
              <td>
                <button type="button" className="btn-edit" onClick={() => setEditing(c)}>Edit</button>{' '}
                <button type="button" className="btn-delete" onClick={() => remove(c)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ContactForm groups={groups} editing={editing} onSave={save} onCancel={() => setEditing(null)} />
    </main>
  );
}
`;

const CSS = `/* src/index.css — đã cho */
body { margin: 0; font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; color: #0f172a; }
.page { max-width: 960px; margin: 0 auto; padding: 20px; }
.toolbar { display: flex; gap: 8px; margin-bottom: 10px; }
.toolbar input { flex: 1; }
input, select { padding: 7px 9px; border: 1px solid #cbd5e1; border-radius: 8px; font: inherit; }
button { padding: 6px 12px; border: 1px solid #cbd5e1; border-radius: 8px; background: #fff; cursor: pointer; font: inherit; }
table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
th, td { text-align: left; padding: 8px; border-bottom: 1px solid #e2e8f0; }
.btn-fav { border: 0; font-size: 18px; color: #f59e0b; background: transparent; }
.panel { display: grid; gap: 8px; max-width: 420px; padding: 16px; border: 1px solid #e2e8f0; border-radius: 12px; }
.error { color: #dc2626; }
`;

// ═════════════════════════════════════ STARTER ═════════════════════════════════════
const S_SERVICE = `// src/services/contactService.js — STARTER
import axios from 'axios';

// TODO: axios.create({ baseURL: process.env.REACT_APP_API_URL }) và các hàm getContacts, getGroups,
//       findByEmail(email), createContact, updateContact, patchContact, deleteContact
export const getContacts = () => axios.get('http://localhost:9999/contacts').then((r) => r.data);
`;
const S_APP = `// src/App.js — STARTER: chỉ tải danh sách, chưa có trạng thái tải/lỗi, chưa CRUD
import { useEffect, useState } from 'react';
import { getContacts } from './services/contactService';

export default function App() {
  const [contacts, setContacts] = useState([]);
  useEffect(() => {
    getContacts().then(setContacts);
  }, []);
  return (
    <main className="page">
      <h1>Contacts</h1>
      <ul>
        {contacts.map((c) => <li key={c.id}>{c.name}</li>)}
      </ul>
    </main>
  );
}
`;
const S_FORM = `// src/components/ContactForm.js — STARTER
export function validateContact(c) {
  // TODO: 'Name is required' · 'Invalid email' · 'Phone must have 10 digits' · 'Choose a group'
  return '';
}

export default function ContactForm({ groups, editing, onSave, onCancel }) {
  // TODO: form #contact-form (#name #email #phone #groupId, #btn-save, #btn-cancel khi sửa), #form-title, #form-error
  return null;
}
`;

const INDEX = index().replace("import App from './App';", "import './index.css';\nimport App from './App';");
const CHUNG = { 'src/index.js': INDEX, 'src/index.css': CSS, '.env': 'REACT_APP_API_URL=http://localhost:9999\n', 'database.json': DB_JSON };
const LOI_GIAI = { 'src/App.js': APP, 'src/components/ContactForm.js': FORM, 'src/services/contactService.js': SERVICE, ...CHUNG };
const KHOI_DAU = { 'src/App.js': S_APP, 'src/components/ContactForm.js': S_FORM, 'src/services/contactService.js': S_SERVICE, ...CHUNG };

// ═════════════════════════════════════ BỘ KIỂM ═════════════════════════════════════
const B = 'http://localhost:9999';
const nhap = (selector, giaTri) => ({ hanhDong: 'nhap', selector, giaTri });
const click = (selector) => ({ hanhDong: 'click', selector });
const cho = (ms = 250) => ({ hanhDong: 'cho', ms });
const gui = { hanhDong: 'gui', selector: '#contact-form' };
const dien = (o) => [cho(120), nhap('#name', o.name ?? ''), nhap('#email', o.email ?? ''), nhap('#phone', o.phone ?? ''), ...(o.group ? [{ hanhDong: 'doi', selector: '#groupId', giaTri: o.group }] : []), gui, cho()];
const MOI = { name: 'Bui Lan Khanh', email: 'khanh@example.com', phone: '0901000007', group: '1' };
const SORTED = ['Do Gia Huy', 'Le Hoang Cuong', 'Nguyen Van An', 'Pham Minh Duc', 'Tran Thi Binh', 'Vo Thu Em'];
const SUA = [cho(120), click('#contact-row-1 .btn-edit'), cho(80), nhap('#phone', '0988777666'), gui, cho()];
const KIEM = [
  // f1 — service layer
  { nhom: 'f1', moTa: 'axios instance with baseURL from .env', kiem: 'ma-nguon', tep: 'src/services/contactService.js', khop: 'axios\\.create\\(\\s*\\{\\s*baseURL:\\s*process\\.env\\.REACT_APP_API_URL' },
  { nhom: 'f1', moTa: 'App does not contain the API URL', kiem: 'ma-nguon', tep: 'src/App.js', khop: 'localhost:9999', phuDinh: true },
  { nhom: 'f1', an: true, moTa: 'Service exports the CRUD functions', kiem: 'ma-nguon', tep: 'src/services/contactService.js', khop: 'export const (createContact|updateContact|deleteContact)[\\s\\S]*export const (createContact|updateContact|deleteContact)[\\s\\S]*export const (createContact|updateContact|deleteContact)' },
  // f2 — loading / error / retry
  { nhom: 'f2', moTa: '#loading shows while the request is pending', jsonServer: { base: B, db: DB, treMs: 1500 }, kiem: 'text', selector: '#loading', khop: 'Loading' },
  { nhom: 'f2', moTa: 'Data loaded ⇒ 6 rows', kiem: 'so-luong', selector: '#contact-table tbody tr', giaTri: 6 },
  { nhom: 'f2', moTa: 'Server error ⇒ #error + #btn-retry', jsonServer: { base: B, db: { groups: DB.groups } }, kiem: 'so-luong', selector: '#error, #btn-retry', giaTri: 2 },
  { nhom: 'f2', an: true, moTa: 'Retry sends the request again', jsonServer: { base: B, db: { groups: DB.groups } }, kiem: 'goi-fetch', khop: `^GET ${B}/contacts$`, min: 2, truoc: [cho(120), click('#btn-retry'), cho()] },
  { nhom: 'f2', an: true, moTa: 'Contacts and groups are requested in parallel (Promise.all)', kiem: 'ma-nguon', tep: 'src/App.js', khop: 'Promise\\.all\\(' },
  // f3 — search, group filter, join
  { nhom: 'f3', moTa: 'Rows sorted by name with the group name joined', kiem: 'danh-sach-text', selector: '.c-name', mongDoi: SORTED },
  { nhom: 'f3', moTa: 'Group column shows names (not ids)', kiem: 'danh-sach-text', selector: '#contact-row-3 .c-group, #contact-row-1 .c-group', mongDoi: ['Family', 'Work'] },
  { nhom: 'f3', moTa: 'Search matches name OR email', kiem: 'danh-sach-text', selector: '.c-name', mongDoi: ['Vo Thu Em'], truoc: [cho(120), nhap('#search', 'em@')] },
  { nhom: 'f3', moTa: 'Group filter "Work"', kiem: 'text', selector: '#contact-count', giaTri: '3 of 6 contacts', truoc: [cho(120), { hanhDong: 'doi', selector: '#group-filter', giaTri: '2' }] },
  // f4 — add
  { nhom: 'f4', moTa: 'Valid contact is POSTed and listed', kiem: 'du-lieu-server', bang: 'contacts', chua: { name: 'Bui Lan Khanh', email: 'khanh@example.com', groupId: 1, favorite: false }, truoc: dien(MOI) },
  { nhom: 'f4', moTa: 'New row appears without reloading the page', kiem: 'text', selector: '#contact-count', giaTri: '7 of 7 contacts', truoc: dien(MOI) },
  { nhom: 'f4', moTa: 'Empty form ⇒ "Name is required"', kiem: 'text', selector: '#form-error', giaTri: 'Name is required', truoc: dien({}) },
  { nhom: 'f4', moTa: 'Existing email ⇒ "This email already exists"', kiem: 'text', selector: '#form-error', giaTri: 'This email already exists', truoc: dien({ ...MOI, email: 'binh@example.com' }) },
  { nhom: 'f4', an: true, moTa: 'Duplicate check asks the server (?email=)', kiem: 'goi-fetch', khop: `^GET ${B}/contacts\\?email=`, truoc: dien(MOI) },
  { nhom: 'f4', an: true, moTa: 'Bad phone and missing group messages', kiem: 'text', selector: '#form-error', giaTri: 'Phone must have 10 digits', truoc: dien({ ...MOI, phone: '12345' }) },
  { nhom: 'f4', an: true, moTa: 'groupId is sent as a number', kiem: 'goi-fetch', khop: `^POST ${B}/contacts$`, than: { groupId: 1 }, chat: true, truoc: dien(MOI) },
  // f5 — edit
  { nhom: 'f5', moTa: 'Edit pre-fills the form ("Edit contact")', kiem: 'danh-sach-text', selector: '#form-title', mongDoi: ['Edit contact'], truoc: [cho(120), click('#contact-row-1 .btn-edit'), cho(80)] },
  { nhom: 'f5', moTa: 'Pre-filled name', kiem: 'thuoc-tinh-js', selector: '#name', thuocTinh: 'value', giaTri: 'Nguyen Van An', truoc: [cho(120), click('#contact-row-1 .btn-edit'), cho(80)] },
  { nhom: 'f5', moTa: 'Update ⇒ PUT /contacts/1 and the row changes', kiem: 'text', selector: '#contact-row-1 .c-phone', giaTri: '0988777666', truoc: SUA },
  { nhom: 'f5', an: true, moTa: 'Server keeps the new phone (and the same email is not a duplicate of itself)', kiem: 'du-lieu-server', bang: 'contacts', chua: { id: 1, phone: '0988777666', email: 'an@example.com' }, truoc: SUA },
  { nhom: 'f5', an: true, moTa: 'After saving, the form is back to "Add contact"', kiem: 'text', selector: '#form-title', giaTri: 'Add contact', truoc: SUA },
  { nhom: 'f5', an: true, moTa: 'Cancel leaves edit mode', kiem: 'text', selector: '#form-title', giaTri: 'Add contact', truoc: [cho(120), click('#contact-row-1 .btn-edit'), cho(80), click('#btn-cancel'), cho(80)] },
  // f6 — delete
  { nhom: 'f6', moTa: 'Delete (confirmed) removes the row and the record', kiem: 'du-lieu-server', bang: 'contacts', khongChua: { id: 4 }, truoc: [cho(120), click('#contact-row-4 .btn-delete'), cho()] },
  { nhom: 'f6', moTa: 'Row disappears without a full reload', kiem: 'so-luong', selector: '#contact-row-4', giaTri: 0, truoc: [cho(120), click('#contact-row-4 .btn-delete'), cho()] },
  { nhom: 'f6', an: true, moTa: 'Cancel ⇒ no DELETE request', confirm: false, kiem: 'goi-fetch', khop: '^DELETE', min: 0, max: 0, truoc: [cho(120), click('#contact-row-4 .btn-delete'), cho()] },
  // f7 — optimistic favorite
  { nhom: 'f7', moTa: '☆ ⇒ ★ and PATCH { favorite: true }', kiem: 'du-lieu-server', bang: 'contacts', chua: { id: 1, favorite: true }, truoc: [cho(120), click('#contact-row-1 .btn-fav'), cho()] },
  { nhom: 'f7', moTa: 'The star changes immediately (optimistic)', jsonServer: { base: B, db: DB, treMs: 1500 }, kiem: 'text', selector: '#contact-row-1 .btn-fav', giaTri: '★', truoc: [cho(3300), click('#contact-row-1 .btn-fav')] },
  { nhom: 'f7', moTa: 'Server error ⇒ star reverts + #toast', fetchGia: { [`PATCH ${B}/contacts/1`]: { status: 500, json: {} } }, kiem: 'danh-sach-text', selector: '#toast, #contact-row-1 .btn-fav', mongDoi: ['Could not update favorite', '☆'], truoc: [cho(120), click('#contact-row-1 .btn-fav'), cho()] },
  // f8 — refresh
  { nhom: 'f8', moTa: '#btn-refresh reloads both resources', kiem: 'goi-fetch', khop: `^GET ${B}/(contacts|groups)$`, min: 4, truoc: [cho(120), click('#btn-refresh'), cho()] },
  { nhom: 'f8', moTa: 'Refresh keeps the search text', kiem: 'thuoc-tinh-js', selector: '#search', thuocTinh: 'value', giaTri: 'an', truoc: [cho(120), nhap('#search', 'an'), click('#btn-refresh'), cho()] },
  { nhom: 'f8', an: true, moTa: 'Async functions use try/catch (no unhandled rejection)', kiem: 'khong-loi-js', fetchGia: { [`PATCH ${B}/contacts/1`]: { status: 500, json: {} } }, truoc: [cho(120), click('#contact-row-1 .btn-fav'), cho()] },
];

const BAN_IN = {
  tieuDe: { en: 'LAB 11: Contact Manager — axios, json-server & async UI states', vi: 'LAB 11: Quản lý danh bạ — axios, json-server & trạng thái bất đồng bộ' },
  phu: { en: 'FER202 · Chapter 11 — Client-Server Communication · Suggested time: 110 minutes · Total: 10 marks', vi: 'FER202 · Chương 11 — Giao tiếp client-server · Thời gian gợi ý: 110 phút · Tổng: 10 điểm' },
  moTa: {
    en: '<p>Build a contact manager on top of a json-server REST API (<code>contacts</code>, <code>groups</code>). Real network code is more than "fetch and show": you will build a <b>service layer</b>, handle <b>loading / error / retry</b>, load two resources in <b>parallel</b>, use all four verbs (<b>GET · POST · PUT · PATCH · DELETE</b>), validate against the server (duplicate email) and implement an <b>optimistic update</b> that rolls back when the server fails.</p>',
    vi: '<p>Làm ứng dụng danh bạ trên API REST của json-server (<code>contacts</code>, <code>groups</code>). Mã mạng thật không chỉ "lấy rồi hiện": bạn sẽ dựng <b>tầng service</b>, xử lý <b>đang tải / lỗi / thử lại</b>, tải hai tài nguyên <b>song song</b>, dùng đủ các động từ (<b>GET · POST · PUT · PATCH · DELETE</b>), kiểm với máy chủ (trùng email) và làm <b>cập nhật lạc quan</b> có hoàn tác khi máy chủ lỗi.</p>',
  },
  chucNangChinh: [
    { en: 'List + search + group filter; add, edit, delete; favourite star.', vi: 'Danh sách + tìm + lọc nhóm; thêm, sửa, xoá; đánh dấu sao.' },
  ],
  yeuCauChung: [
    { en: 'All HTTP calls live in <code>src/services/contactService.js</code> (axios instance, <code>baseURL</code> from <code>.env</code>).', vi: 'Mọi lời gọi HTTP nằm trong <code>src/services/contactService.js</code> (axios instance, <code>baseURL</code> lấy từ <code>.env</code>).' },
    { en: 'Every async handler has <code>try/catch</code> — no unhandled promise rejection.', vi: 'Mọi handler bất đồng bộ có <code>try/catch</code> — không để promise bị reject mà không bắt.' },
    { en: 'After add / edit / delete, update local state from the server response — do not reload the page.', vi: 'Sau thêm / sửa / xoá, cập nhật state từ phản hồi máy chủ — không tải lại trang.' },
  ],
  cayThuMuc: `
database.json                 # contacts (6), groups (3)
.env                          # REACT_APP_API_URL=http://localhost:9999
src/
├── services/
│   └── contactService.js     # axios instance + 7 functions
├── components/
│   └── ContactForm.js        # add + edit form, validateContact
├── App.js                    # load, states, CRUD, optimistic favourite
├── index.css                 # given
└── index.js                  # given`,
  wireframe: `
+-------------------------------------------------------------------------+
| Contacts                                                                |
| [Search name or email...          ] [All groups v] [Refresh]           |
| 6 of 6 contacts                                                         |
| ★ | Name            | Email            | Phone      | Group   | Actions |
| ★ | Do Gia Huy      | huy@example.com  | 0901000006 | Work    | Edit Delete
| ☆ | Le Hoang Cuong  | cuong@example.com| 0901000003 | Family  | Edit Delete
| +- Add contact ------------------+                                      |
| | [Full name ] [Email ] [Phone ] |                                      |
| | [-- Group -- v]       [Add]    |                                      |
| +--------------------------------+                                      |
+-------------------------------------------------------------------------+`,
  moHinh: {
    ten: 'contacts · groups',
    truong: [
      ['contacts.id', 'number', ''],
      ['contacts.name / email / phone', 'string', { en: 'email unique (lower-case); phone = 0 + 9 digits', vi: 'email duy nhất (chữ thường); phone = 0 + 9 chữ số' }],
      ['contacts.groupId', 'number', { en: 'FK to groups.id', vi: 'khoá ngoại tới groups.id' }],
      ['contacts.favorite', 'boolean', ''],
      ['groups.id / name', 'number / string', ''],
    ],
  },
  chucNang: [
    {
      ten: { en: 'Service layer', vi: 'Tầng service' }, diem: 1,
      yeuCau: [{ en: '<code>axios.create({ baseURL: process.env.REACT_APP_API_URL })</code>; export <code>getContacts</code>, <code>getGroups</code>, <code>findByEmail</code>, <code>createContact</code>, <code>updateContact</code>, <code>patchContact</code>, <code>deleteContact</code>. No URL inside components.', vi: '<code>axios.create({ baseURL: process.env.REACT_APP_API_URL })</code>; xuất <code>getContacts</code>, <code>getGroups</code>, <code>findByEmail</code>, <code>createContact</code>, <code>updateContact</code>, <code>patchContact</code>, <code>deleteContact</code>. Không có URL trong component.' }],
      hook: ['axios.create'],
    },
    {
      ten: { en: 'Loading, error & retry', vi: 'Đang tải, lỗi & thử lại' }, diem: 1.5,
      yeuCau: [
        { en: 'Load <code>/contacts</code> and <code>/groups</code> with <code>Promise.all</code>. While pending show <code>#loading</code> (<code>Loading contacts...</code>).', vi: 'Tải <code>/contacts</code> và <code>/groups</code> bằng <code>Promise.all</code>. Đang chờ thì hiện <code>#loading</code> (<code>Loading contacts...</code>).' },
        { en: 'On failure show <code>#error</code> and a <code>#btn-retry</code> button that loads again.', vi: 'Lỗi thì hiện <code>#error</code> và nút <code>#btn-retry</code> để tải lại.' },
      ],
      hook: ['useCallback', 'useEffect', 'Promise.all'],
    },
    {
      ten: { en: 'Table, search & group filter', vi: 'Bảng, tìm & lọc nhóm' }, diem: 1,
      yeuCau: [
        { en: '<code>#contact-table</code>, rows <code>#contact-row-{id}</code> sorted by name: <code>.btn-fav</code>, <code>.c-name</code>, <code>.c-email</code>, <code>.c-phone</code>, <code>.c-group</code> (group <b>name</b>), <code>.btn-edit</code>, <code>.btn-delete</code>.', vi: '<code>#contact-table</code>, hàng <code>#contact-row-{id}</code> sắp theo tên: <code>.btn-fav</code>, <code>.c-name</code>, <code>.c-email</code>, <code>.c-phone</code>, <code>.c-group</code> (<b>tên</b> nhóm), <code>.btn-edit</code>, <code>.btn-delete</code>.' },
        { en: '<code>#search</code> (name or email, case-insensitive), <code>#group-filter</code> (value = group id), <code>#contact-count</code> <code>X of Y contacts</code>.', vi: '<code>#search</code> (tên hoặc email, không phân biệt hoa/thường), <code>#group-filter</code> (value = id nhóm), <code>#contact-count</code> <code>X of Y contacts</code>.' },
      ],
      viDu: { en: 'Group "Work" ⇒ 3 of 6 contacts · search "em@" ⇒ Vo Thu Em', vi: 'Nhóm "Work" ⇒ 3 of 6 contacts · tìm "em@" ⇒ Vo Thu Em' },
    },
    {
      ten: { en: 'Add a contact', vi: 'Thêm liên hệ' }, diem: 1.5,
      yeuCau: [
        { en: 'Form <code>#contact-form</code> (<code>#name</code>, <code>#email</code>, <code>#phone</code>, <code>#groupId</code>, <code>#btn-save</code>), title <code>#form-title</code> <code>Add contact</code>, message <code>#form-error</code>.', vi: 'Form <code>#contact-form</code> (<code>#name</code>, <code>#email</code>, <code>#phone</code>, <code>#groupId</code>, <code>#btn-save</code>), tiêu đề <code>#form-title</code> <code>Add contact</code>, câu lỗi <code>#form-error</code>.' },
        { en: 'Rules: <code>Name is required</code> · <code>Invalid email</code> · <code>Phone must have 10 digits</code> · <code>Choose a group</code>; then ask the server <code>GET /contacts?email=…</code> ⇒ <code>This email already exists</code>.', vi: 'Luật: <code>Name is required</code> · <code>Invalid email</code> · <code>Phone must have 10 digits</code> · <code>Choose a group</code>; rồi hỏi máy chủ <code>GET /contacts?email=…</code> ⇒ <code>This email already exists</code>.' },
        { en: '<code>POST /contacts</code> (<code>groupId</code> number, <code>favorite: false</code>); append the saved record.', vi: '<code>POST /contacts</code> (<code>groupId</code> là số, <code>favorite: false</code>); thêm bản ghi máy chủ trả về.' },
      ],
    },
    {
      ten: { en: 'Edit a contact', vi: 'Sửa liên hệ' }, diem: 1.5,
      yeuCau: [
        { en: '<code>.btn-edit</code> switches the SAME form to edit mode (<code>Edit contact</code>, pre-filled, <code>#btn-cancel</code>).', vi: '<code>.btn-edit</code> chuyển CÙNG form sang chế độ sửa (<code>Edit contact</code>, điền sẵn, <code>#btn-cancel</code>).' },
        { en: 'Same rules (its own email is not a duplicate); <code>PUT /contacts/:id</code>; replace the row; back to add mode.', vi: 'Cùng luật (email của chính nó không tính là trùng); <code>PUT /contacts/:id</code>; thay hàng; trở lại chế độ thêm.' },
      ],
      hook: ['useEffect (sync form with editing)'],
    },
    {
      ten: { en: 'Delete', vi: 'Xoá' }, diem: 1,
      yeuCau: [{ en: '<code>window.confirm</code> ⇒ <code>DELETE /contacts/:id</code> ⇒ remove the row from state (no refetch).', vi: '<code>window.confirm</code> ⇒ <code>DELETE /contacts/:id</code> ⇒ bỏ hàng khỏi state (không tải lại).' }],
    },
    {
      ten: { en: 'Optimistic favourite', vi: 'Đánh dấu sao lạc quan' }, diem: 1,
      yeuCau: [
        { en: '<code>.btn-fav</code> flips ☆/★ <b>immediately</b>, then <code>PATCH /contacts/:id { favorite }</code>.', vi: '<code>.btn-fav</code> đổi ☆/★ <b>ngay lập tức</b>, rồi <code>PATCH /contacts/:id { favorite }</code>.' },
        { en: 'If the request fails: flip back and show <code>#toast</code> <code>Could not update favorite</code>.', vi: 'Nếu request lỗi: đổi lại như cũ và hiện <code>#toast</code> <code>Could not update favorite</code>.' },
      ],
    },
    {
      ten: { en: 'Refresh', vi: 'Làm mới' }, diem: 1,
      yeuCau: [{ en: '<code>#btn-refresh</code> reloads both resources (same function as the first load) and keeps the search text.', vi: '<code>#btn-refresh</code> tải lại cả hai tài nguyên (cùng hàm với lần tải đầu) và giữ nguyên chữ tìm kiếm.' }],
    },
  ],
  idBatBuoc: [
    ['#loading · #error · #btn-retry · #toast', { en: 'async states', vi: 'trạng thái bất đồng bộ' }],
    ['#search · #group-filter · #btn-refresh · #contact-count', { en: 'toolbar', vi: 'thanh công cụ' }],
    ['#contact-table · #contact-row-{id} · .btn-fav · .c-name · .c-email · .c-phone · .c-group · .btn-edit · .btn-delete', { en: 'table', vi: 'bảng' }],
    ['#contact-form · #form-title · #name · #email · #phone · #groupId · #btn-save · #btn-cancel · #form-error', { en: 'form', vi: 'form' }],
  ],
  truDiem: [
    { en: '<code>async</code> inside <code>useEffect(async () => …)</code> directly — the effect must not return a promise.', vi: '<code>useEffect(async () => …)</code> — effect không được trả về promise.' },
    { en: 'No loading/error state: blank screen when json-server is down.', vi: 'Không có trạng thái tải/lỗi: màn hình trống khi json-server tắt.' },
    { en: 'Two <code>await</code> in a row for independent requests (slower than <code>Promise.all</code>).', vi: 'Hai <code>await</code> nối tiếp cho hai request độc lập (chậm hơn <code>Promise.all</code>).' },
    { en: 'Reloading the whole list (or the page) after every change.', vi: 'Tải lại cả danh sách (hoặc cả trang) sau mỗi thay đổi.' },
    { en: 'Optimistic update without rollback — the UI lies when the server fails.', vi: 'Cập nhật lạc quan mà không hoàn tác — giao diện "nói dối" khi máy chủ lỗi.' },
  ],
  nopBai: NOP_BAI,
};

export default doiDau({
  slug: 'fer202-11-lab-contact-manager',
  ten: 'Lab 11 — Contact Manager (axios + json-server)',
  khoa: KHOA,
  baiHoc: 'fer202-11-2-axios-json-server',
  de: [
    {
      dangBai: 'lab',
      tieuDe: { en: 'Lab 11 — Contact Manager (service layer · loading/error · CRUD · optimistic update)', vi: 'Lab 11 — Quản lý danh bạ (tầng service · tải/lỗi · CRUD · cập nhật lạc quan)' },
      doKho: 'HARD',
      phut: 110,
      diem: 100,
      khaiNiem: ['axios', 'axios.create', 'REST verbs', 'Promise.all', 'loading/error states', 'optimistic update', 'json-server filters'],
      tienQuyet: ['useEffect', 'async/await', 'controlled form'],
      the: ['fer202', 'lab', 'axios', 'json-server', 'async'],
      banIn: BAN_IN,
      thuatNgu: [
        { en: 'service layer', vi: 'tầng service — gom mọi lời gọi API về một chỗ' },
        { en: 'optimistic update', vi: 'cập nhật lạc quan: đổi giao diện trước, gọi máy chủ sau' },
        { en: 'rollback', vi: 'hoàn tác về trạng thái cũ khi thất bại' },
        { en: 'retry', vi: 'thử lại' },
        { en: 'unhandled rejection', vi: 'promise bị reject mà không ai bắt (catch)' },
        { en: 'in parallel', vi: 'song song (cùng lúc)' },
        ...tn('endpoint', 'payload', 'sideEffect', 'confirm', 'rubric'),
      ],
      goiY: [
        'contactService.js: const api = axios.create({ baseURL: process.env.REACT_APP_API_URL }); mỗi hàm trả về r.data.',
        'load = useCallback(async () => { setStatus("loading"); try { const [c, g] = await Promise.all([...]); …; setStatus("ready"); } catch { setStatus("error"); } }, []); useEffect(() => { load(); }, [load]).',
        'Form dùng chung: prop editing (object hoặc null) + useEffect([editing]) để điền sẵn / làm trống.',
        'Lạc quan: flip(!c.favorite) TRƯỚC khi await patch; catch ⇒ flip(c.favorite) + setToast(...).',
      ],
      loiHayGap: [
        '<code>useEffect(async () =&gt; {…}, [])</code> — React cảnh báo vì effect trả Promise; viết hàm async bên trong rồi gọi.',
        'Quên bắt lỗi ⇒ json-server tắt là màn hình trắng + "Uncaught (in promise)".',
        'Kiểm trùng email bằng danh sách đang hiện (đã lọc) thay vì hỏi máy chủ ⇒ lọt bản trùng.',
        'Sửa nhưng gửi POST ⇒ tạo bản ghi mới thay vì cập nhật.',
        'Giữ <code>groupId</code> là chuỗi từ <code>&lt;select&gt;</code> ⇒ so <code>groupId === 2</code> sai và dữ liệu lẫn kiểu.',
        'Cập nhật lạc quan nhưng không hoàn tác ⇒ ngôi sao sáng dù máy chủ báo lỗi.',
      ],
      moTaNgan: 'Lab chương 11: danh bạ trên json-server — tầng service axios, tải/lỗi/thử lại, Promise.all + nối bảng, CRUD, kiểm trùng trên máy chủ, cập nhật lạc quan có hoàn tác.',
      giaiThich: '<p>Mọi URL nằm trong <code>contactService.js</code>, component chỉ gọi hàm. <code>load</code> (bọc <code>useCallback</code>) chạy hai request song song bằng <code>Promise.all</code> và đặt <code>status</code> loading/error/ready — cùng hàm dùng cho lần đầu, nút Retry và Refresh. Form thêm/sửa dùng chung, đồng bộ với <code>editing</code> qua <code>useEffect</code>; trước khi lưu hỏi máy chủ <code>?email=</code> để chặn trùng (bỏ qua chính nó khi sửa). Sau mỗi thay đổi, state cập nhật từ phản hồi máy chủ (thêm vào cuối, thay một hàng, lọc bỏ một hàng). Ngôi sao dùng cập nhật lạc quan: đổi giao diện trước, lỗi thì đổi lại và báo.</p>',
      tests: { loai: 'react', phienBan: 1, tepChinh: 'src/index.js', jsonServer: { base: B, db: DB }, kiem: KIEM },
      khoiDau: KHOI_DAU,
      loiGiai: LOI_GIAI,
      demo: { tepChinh: 'src/index.js' },
      thamKhao: 'https://axios-http.com/docs/instance',
    },
  ],
});
