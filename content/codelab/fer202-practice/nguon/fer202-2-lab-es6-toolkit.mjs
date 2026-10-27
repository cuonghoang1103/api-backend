/**
 * FER202 · Chương 2 (ES6 for React) — LAB 2: Student Data Toolkit (ES6+).
 * Bám slide Slot 2–3 (let/const, arrow, template literal, destructuring, spread/rest, default params, module,
 * Promise) + Exercise 4 (array methods) nhưng ở dạng "bộ hàm thư viện": hàm thuần, không sửa dữ liệu vào,
 * reduce/groupBy, Promise.all/race/allSettled, optional chaining & nullish. Máy chấm JS gọi từng hàm.
 */
import { doiDau, KHOA, NOP_BAI, tn } from './_chung.mjs';

const DATA = `// data.js — dữ liệu mẫu (đã cho). Máy chấm nạp data.js rồi toolkit.js như script thường.
const STUDENTS = [
  { id: 1, name: 'An', gpa: 3.6, major: 'SE' },
  { id: 2, name: 'Binh', gpa: 3.2, major: 'AI' },
  { id: 3, name: 'Cuong', gpa: 3.9, major: 'SE' },
  { id: 4, name: 'Dung', gpa: 3.2, major: 'IA' },
  { id: 5, name: 'Em', gpa: 2.8, major: 'AI' },
];
`;

const GIAI = `// toolkit.js — bộ hàm ES6+ (mọi hàm THUẦN: không sửa tham số, không đọc/ghi biến ngoài trừ STUDENTS)

// ── 1. Destructuring + default + template literal ─────────────────────────────
// tham số là object: lấy name, age (mặc định 18), major.code (mặc định 'N/A'); cả object có thể vắng
function formatStudent({ name, age = 18, major: { code = 'N/A' } = {} } = {}) {
  return ´@{name} (@{age}) — @{code}´;
}

// ── 2. map + spread: bản sao đã chuẩn hoá, KHÔNG sửa mảng/object gốc ─────────
const toTitle = (s) =>
  s.trim().split(/\\s+/).map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(' ');

function normalize(students) {
  return students.map((s) => ({ ...s, fullName: toTitle(s.fullName), email: s.email.trim().toLowerCase() }));
}

// ── 3. Rest parameters + spread vào Math.min/max + reduce ─────────────────────
function stats(...scores) {
  if (scores.length === 0) return { count: 0, min: null, max: null, avg: null };
  const sum = scores.reduce((a, b) => a + b, 0);
  return {
    count: scores.length,
    min: Math.min(...scores),
    max: Math.max(...scores),
    avg: Math.round((sum / scores.length) * 100) / 100, // 2 chữ số thập phân
  };
}

// ── 4. reduce thành object nhóm ────────────────────────────────────────────────
function groupBy(list, keyFn) {
  return list.reduce((acc, item) => {
    const key = keyFn(item);
    return { ...acc, [key]: [...(acc[key] ?? []), item] };
  }, {});
}

const countBy = (list, keyFn) =>
  Object.fromEntries(Object.entries(groupBy(list, keyFn)).map(([key, items]) => [key, items.length]));

// ── 5. Default parameters + sort trên BẢN SAO ─────────────────────────────────
function topN(list, n = 3, by = 'gpa') {
  return [...list]
    .sort((a, b) => b[by] - a[by] || a.name.localeCompare(b.name))
    .slice(0, n)
    .map((s) => s.name);
}

// ── 6. Gộp object bằng spread (address gộp sâu MỘT tầng) ──────────────────────
function mergeProfiles(base, ...updates) {
  return updates.reduce((acc, u) => {
    const merged = { ...acc, ...u };
    if (acc.address || u.address) merged.address = { ...acc.address, ...u.address };
    return merged;
  }, { ...base });
}

// ── 7. Promise: song song, chạy đua, chấp nhận lỗi từng phần ─────────────────
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchGpa(id) {
  await wait(100); // giả lập gọi API 100 ms
  const s = STUDENTS.find((x) => x.id === id);
  if (!s) throw new Error(´Student @{id} not found´);
  return s.gpa;
}

// Promise.all: 3 request cùng lúc ⇒ ~100 ms (tuần tự sẽ là 300 ms)
async function loadAverageGpa(ids) {
  const gpas = await Promise.all(ids.map(fetchGpa));
  return Math.round((gpas.reduce((a, b) => a + b, 0) / gpas.length) * 100) / 100;
}

// Promise.race: lời hứa nào xong trước thắng ⇒ quá hạn thì ném 'Timeout'
function withTimeout(promise, ms) {
  return Promise.race([promise, wait(ms).then(() => { throw new Error('Timeout'); })]);
}

// Promise.allSettled: KHÔNG dừng ở lỗi đầu tiên
async function safeLoad(ids) {
  const results = await Promise.allSettled(ids.map(fetchGpa));
  return {
    ok: results.filter((r) => r.status === 'fulfilled').map((r) => r.value),
    failed: ids.filter((_, i) => results[i].status === 'rejected'),
  };
}

// ── 8. Optional chaining + nullish coalescing ────────────────────────────────
const getCity = (s) => s?.address?.city ?? 'Unknown';
// ?? chỉ thay khi null/undefined — 0 vẫn là 0 (|| sẽ biến 0 thành 15: SAI)
const getCredits = (s) => s?.credits ?? 15;
`;

const DAU = `// toolkit.js — STARTER: viết từng hàm theo đề (giữ đúng TÊN hàm — máy chấm gọi theo tên)
function formatStudent(student) {
  // TODO: "An (20) — SE" — destructuring + giá trị mặc định
}

function normalize(students) {
  // TODO: bản sao chuẩn hoá fullName (Title Case) + email (chữ thường)
}

function stats(scores) {
  // TODO: rest parameters ⇒ { count, min, max, avg }
}

function groupBy(list, keyFn) {
  // TODO: reduce ⇒ { key: [items] }
}

function countBy(list, keyFn) {
  // TODO
}

function topN(list, n, by) {
  // TODO: tham số mặc định n = 3, by = 'gpa'; sort trên bản sao
}

function mergeProfiles(base, updates) {
  // TODO: rest + spread, address gộp một tầng
}

function fetchGpa(id) {
  // TODO: async, chờ 100 ms, lỗi "Student 9 not found"
}

function loadAverageGpa(ids) {}
function withTimeout(promise, ms) {}
function safeLoad(ids) {}
function getCity(s) {}
function getCredits(s) {}
`;

const KIEM = [
  // f1
  { nhom: 'f1', moTa: 'formatStudent with every field', goi: "formatStudent({ name: 'An', age: 20, major: { code: 'SE' } })", mongDoi: 'An (20) — SE' },
  { nhom: 'f1', moTa: 'Defaults: age 18, code N/A', goi: "formatStudent({ name: 'Binh' })", mongDoi: 'Binh (18) — N/A' },
  { nhom: 'f1', an: true, moTa: 'Works with no argument at all', goi: 'formatStudent()', mongDoi: 'undefined (18) — N/A' },
  { nhom: 'f1', an: true, moTa: 'Uses a template literal', kiem: 'ma-nguon', tep: 'toolkit.js', khop: '´[^´]*\\$\\{' },
  // f2
  { nhom: 'f2', moTa: 'normalize returns cleaned copies', goi: "normalize([{ id: 1, fullName: '  nGUYEN   van an ', email: ' An@FPT.edu.VN ' }])", mongDoi: [{ id: 1, fullName: 'Nguyen Van An', email: 'an@fpt.edu.vn' }] },
  { nhom: 'f2', moTa: 'Input array and objects are NOT mutated', chuanBi: "const input = [{ id: 1, fullName: 'le lan', email: 'X@Y.COM' }]; const out = normalize(input);", goi: '[input[0].fullName, input[0].email, out !== input, out[0] !== input[0]]', mongDoi: ['le lan', 'X@Y.COM', true, true] },
  { nhom: 'f2', an: true, moTa: 'Other fields are kept', goi: "normalize([{ id: 7, fullName: 'a b', email: 'A@B.C', gpa: 3 }])[0].gpa", mongDoi: 3 },
  // f3
  { nhom: 'f3', moTa: 'stats(8, 6, 10) ⇒ count/min/max/avg', goi: 'stats(8, 6, 10)', mongDoi: { count: 3, min: 6, max: 10, avg: 8 } },
  { nhom: 'f3', moTa: 'avg rounded to 2 decimals', goi: 'stats(7, 8, 8)', mongDoi: { count: 3, min: 7, max: 8, avg: 7.67 } },
  { nhom: 'f3', moTa: 'No scores ⇒ nulls', goi: 'stats()', mongDoi: { count: 0, min: null, max: null, avg: null } },
  { nhom: 'f3', an: true, moTa: 'Spread an array into it', goi: 'stats(...[5, 9])', mongDoi: { count: 2, min: 5, max: 9, avg: 7 } },
  // f4
  { nhom: 'f4', moTa: 'groupBy major', goi: 'groupBy(STUDENTS, (s) => s.major)', mongDoi: { SE: [{ id: 1, name: 'An', gpa: 3.6, major: 'SE' }, { id: 3, name: 'Cuong', gpa: 3.9, major: 'SE' }], AI: [{ id: 2, name: 'Binh', gpa: 3.2, major: 'AI' }, { id: 5, name: 'Em', gpa: 2.8, major: 'AI' }], IA: [{ id: 4, name: 'Dung', gpa: 3.2, major: 'IA' }] } },
  { nhom: 'f4', moTa: 'countBy major', goi: 'countBy(STUDENTS, (s) => s.major)', mongDoi: { SE: 2, AI: 2, IA: 1 } },
  { nhom: 'f4', an: true, moTa: 'groupBy by a computed key', goi: "countBy(STUDENTS, (s) => (s.gpa >= 3.5 ? 'honors' : 'regular'))", mongDoi: { honors: 2, regular: 3 } },
  { nhom: 'f4', an: true, moTa: 'groupBy uses reduce', kiem: 'ma-nguon', tep: 'toolkit.js', khop: 'reduce\\(' },
  // f5
  { nhom: 'f5', moTa: 'topN defaults: 3 best GPAs, ties by name', goi: 'topN(STUDENTS)', mongDoi: ['Cuong', 'An', 'Binh'] },
  { nhom: 'f5', moTa: 'topN(list, 2, "id")', goi: "topN(STUDENTS, 2, 'id')", mongDoi: ['Em', 'Dung'] },
  { nhom: 'f5', moTa: 'STUDENTS keeps its order (sorted a copy)', chuanBi: 'topN(STUDENTS);', goi: 'STUDENTS.map((s) => s.id)', mongDoi: [1, 2, 3, 4, 5] },
  // f6
  { nhom: 'f6', moTa: 'Later updates win', goi: "mergeProfiles({ name: 'An', age: 19 }, { age: 20 }, { major: 'SE' })", mongDoi: { name: 'An', age: 20, major: 'SE' } },
  { nhom: 'f6', moTa: 'address merged one level deep', goi: "mergeProfiles({ address: { city: 'Hanoi', street: 'Tran Phu' } }, { address: { street: 'Le Loi' } })", mongDoi: { address: { city: 'Hanoi', street: 'Le Loi' } } },
  { nhom: 'f6', an: true, moTa: 'base is not mutated', chuanBi: "const base = { name: 'An', address: { city: 'Hue' } }; mergeProfiles(base, { address: { city: 'Hanoi' } });", goi: 'base.address.city', mongDoi: 'Hue' },
  { nhom: 'f6', an: true, moTa: 'No address anywhere ⇒ no address key', goi: "Object.keys(mergeProfiles({ a: 1 }, { b: 2 }))", mongDoi: ['a', 'b'] },
  // f7
  { nhom: 'f7', moTa: 'fetchGpa resolves after 100 ms', goi: 'await fetchGpa(3)', mongDoi: 3.9 },
  { nhom: 'f7', moTa: 'Unknown id rejects', goi: 'await fetchGpa(9)', mongDoi: { loi: 'Error', thongDiep: 'Student 9 not found' } },
  { nhom: 'f7', moTa: 'loadAverageGpa runs requests in PARALLEL (~100 ms)', chuanBi: 'const t0 = Date.now();', goi: 'await loadAverageGpa([1, 2, 3]).then((v) => [v, Date.now() - t0])', mongDoi: [3.57, 100] },
  { nhom: 'f7', moTa: 'withTimeout rejects with "Timeout"', goi: "await withTimeout(wait(500).then(() => 'late'), 200)", mongDoi: { loi: 'Error', thongDiep: '^Timeout$' } },
  { nhom: 'f7', an: true, moTa: 'withTimeout lets a fast promise through', goi: "await withTimeout(wait(50).then(() => 'fast'), 200)", mongDoi: 'fast' },
  { nhom: 'f7', an: true, moTa: 'safeLoad keeps going after a failure', goi: 'await safeLoad([1, 9, 3, 8])', mongDoi: { ok: [3.6, 3.9], failed: [9, 8] } },
  // f8
  { nhom: 'f8', moTa: 'getCity with optional chaining', goi: "[getCity({ address: { city: 'Hue' } }), getCity({}), getCity(null)]", mongDoi: ['Hue', 'Unknown', 'Unknown'] },
  { nhom: 'f8', moTa: '0 credits stays 0 (?? not ||)', goi: '[getCredits({ credits: 0 }), getCredits({}), getCredits(undefined)]', mongDoi: [0, 15, 15] },
  { nhom: 'f8', an: true, moTa: 'No var declarations', kiem: 'ma-nguon', tep: 'toolkit.js', khop: '\\bvar\\s', phuDinh: true },
];

const BAN_IN = {
  tieuDe: { en: 'LAB 2: Student Data Toolkit — modern JavaScript (ES6+)', vi: 'LAB 2: Bộ hàm xử lý dữ liệu sinh viên — JavaScript hiện đại (ES6+)' },
  phu: { en: 'FER202 · Chapter 2 — ES6 for React · Suggested time: 75 minutes · Total: 10 marks', vi: 'FER202 · Chương 2 — ES6 cho React · Thời gian gợi ý: 75 phút · Tổng: 10 điểm' },
  moTa: {
    en: '<p>Before React, master the JavaScript React is written in. Implement a small library of <b>pure functions</b> for student data. Every function must return new values and never change its arguments — exactly the discipline React state needs. The auto-grader calls each function by name.</p>',
    vi: '<p>Trước khi vào React, hãy nắm chắc JavaScript mà React dùng. Viết một thư viện nhỏ các <b>hàm thuần</b> xử lý dữ liệu sinh viên. Mọi hàm phải trả về giá trị mới và không bao giờ sửa tham số — đúng kỷ luật mà state của React cần. Máy chấm gọi từng hàm theo tên.</p>',
  },
  chucNangChinh: [{ en: '13 functions in <code>toolkit.js</code>, grouped in 8 graded features.', vi: '13 hàm trong <code>toolkit.js</code>, chia 8 chức năng chấm điểm.' }],
  yeuCauChung: [
    { en: 'Use <code>const</code>/<code>let</code> only (no <code>var</code>), arrow functions where natural, template literals.', vi: 'Chỉ dùng <code>const</code>/<code>let</code> (không <code>var</code>), arrow function khi hợp, template literal.' },
    { en: 'Pure functions: never mutate arguments; sort a copy.', vi: 'Hàm thuần: không sửa tham số; sắp xếp trên bản sao.' },
    { en: 'Keep the function names — the grader loads <code>data.js</code> then <code>toolkit.js</code> as plain scripts and calls them.', vi: 'Giữ đúng tên hàm — máy chấm nạp <code>data.js</code> rồi <code>toolkit.js</code> như script thường và gọi chúng.' },
  ],
  cayThuMuc: `
data.js       # STUDENTS (given)
toolkit.js    # your 13 functions`,
  moHinh: {
    ten: 'Student (data.js)',
    truong: [
      ['id', 'number', ''],
      ['name', 'string', ''],
      ['gpa', 'number', ''],
      ['major', "'SE' | 'AI' | 'IA'", ''],
    ],
  },
  duLieuMau: `
STUDENTS = [ { id: 1, name: 'An', gpa: 3.6, major: 'SE' }, { id: 2, name: 'Binh', gpa: 3.2, major: 'AI' },
             { id: 3, name: 'Cuong', gpa: 3.9, major: 'SE' }, { id: 4, name: 'Dung', gpa: 3.2, major: 'IA' },
             { id: 5, name: 'Em', gpa: 2.8, major: 'AI' } ]`,
  chucNang: [
    {
      ten: { en: 'Destructuring & defaults', vi: 'Destructuring & mặc định' }, diem: 1,
      yeuCau: [{ en: '<code>formatStudent({ name, age, major: { code } })</code> ⇒ <code>"An (20) — SE"</code>; defaults <code>age = 18</code>, <code>code = \'N/A\'</code>, and the whole argument may be missing.', vi: '<code>formatStudent({ name, age, major: { code } })</code> ⇒ <code>"An (20) — SE"</code>; mặc định <code>age = 18</code>, <code>code = \'N/A\'</code>, và cả tham số có thể vắng.' }],
      viDu: 'formatStudent({ name: "Binh" })  ⇒  "Binh (18) — N/A"',
    },
    {
      ten: { en: 'map + spread (immutable)', vi: 'map + spread (bất biến)' }, diem: 1.5,
      yeuCau: [{ en: '<code>normalize(students)</code>: new array of new objects — <code>fullName</code> in Title Case with single spaces, <code>email</code> trimmed + lower case, other fields kept.', vi: '<code>normalize(students)</code>: mảng mới gồm object mới — <code>fullName</code> dạng Title Case một dấu cách, <code>email</code> bỏ khoảng trắng + chữ thường, giữ các trường khác.' }],
    },
    {
      ten: { en: 'Rest parameters', vi: 'Rest parameters' }, diem: 1.5,
      yeuCau: [{ en: '<code>stats(...scores)</code> ⇒ <code>{ count, min, max, avg }</code> (avg 2 decimals); no scores ⇒ <code>{ count: 0, min: null, max: null, avg: null }</code>.', vi: '<code>stats(...scores)</code> ⇒ <code>{ count, min, max, avg }</code> (avg 2 chữ số); không có điểm ⇒ <code>{ count: 0, min: null, max: null, avg: null }</code>.' }],
    },
    {
      ten: { en: 'reduce: groupBy / countBy', vi: 'reduce: groupBy / countBy' }, diem: 1.5,
      yeuCau: [{ en: '<code>groupBy(list, keyFn)</code> ⇒ <code>{ key: [items in original order] }</code>; <code>countBy(list, keyFn)</code> ⇒ <code>{ key: count }</code>.', vi: '<code>groupBy(list, keyFn)</code> ⇒ <code>{ key: [các phần tử theo thứ tự gốc] }</code>; <code>countBy(list, keyFn)</code> ⇒ <code>{ key: số lượng }</code>.' }],
    },
    {
      ten: { en: 'Default params & sorting a copy', vi: 'Tham số mặc định & sắp xếp bản sao' }, diem: 1,
      yeuCau: [{ en: '<code>topN(list, n = 3, by = \'gpa\')</code> ⇒ names of the n highest by <code>by</code>, ties by name A → Z; the input keeps its order.', vi: '<code>topN(list, n = 3, by = \'gpa\')</code> ⇒ tên của n người cao nhất theo <code>by</code>, bằng nhau theo tên A → Z; mảng vào giữ nguyên thứ tự.' }],
    },
    {
      ten: { en: 'Object spread merge', vi: 'Gộp object bằng spread' }, diem: 1,
      yeuCau: [{ en: '<code>mergeProfiles(base, ...updates)</code>: later wins; <code>address</code> merged one level deep (only if present); <code>base</code> untouched.', vi: '<code>mergeProfiles(base, ...updates)</code>: cái sau thắng; <code>address</code> gộp sâu một tầng (chỉ khi có); không đụng <code>base</code>.' }],
    },
    {
      ten: { en: 'Promises & async/await', vi: 'Promise & async/await' }, diem: 1.5,
      yeuCau: [
        { en: '<code>wait(ms)</code>; <code>fetchGpa(id)</code> waits 100 ms then resolves the GPA or rejects <code>Student {id} not found</code>.', vi: '<code>wait(ms)</code>; <code>fetchGpa(id)</code> chờ 100 ms rồi trả GPA hoặc reject <code>Student {id} not found</code>.' },
        { en: '<code>loadAverageGpa(ids)</code> in parallel (<code>Promise.all</code>, ~100 ms total), <code>withTimeout(promise, ms)</code> (<code>Promise.race</code> ⇒ <code>Error(\'Timeout\')</code>), <code>safeLoad(ids)</code> (<code>Promise.allSettled</code> ⇒ <code>{ ok, failed }</code>).', vi: '<code>loadAverageGpa(ids)</code> chạy song song (<code>Promise.all</code>, tổng ~100 ms), <code>withTimeout(promise, ms)</code> (<code>Promise.race</code> ⇒ <code>Error(\'Timeout\')</code>), <code>safeLoad(ids)</code> (<code>Promise.allSettled</code> ⇒ <code>{ ok, failed }</code>).' },
      ],
      viDu: 'safeLoad([1, 9, 3, 8])  ⇒  { ok: [3.6, 3.9], failed: [9, 8] }',
    },
    {
      ten: { en: 'Optional chaining & ??', vi: 'Optional chaining & ??' }, diem: 1,
      yeuCau: [{ en: '<code>getCity(s)</code> ⇒ <code>s.address.city</code> or <code>\'Unknown\'</code> (s may be null); <code>getCredits(s)</code> ⇒ <code>s.credits</code> or 15 — but 0 stays 0.', vi: '<code>getCity(s)</code> ⇒ <code>s.address.city</code> hoặc <code>\'Unknown\'</code> (s có thể null); <code>getCredits(s)</code> ⇒ <code>s.credits</code> hoặc 15 — nhưng 0 vẫn là 0.' }],
    },
  ],
  truDiem: [
    { en: '<code>students.forEach(s =&gt; s.email = …)</code> — mutates the caller\'s data.', vi: '<code>students.forEach(s =&gt; s.email = …)</code> — sửa dữ liệu của nơi gọi.' },
    { en: '<code>for … await</code> one by one instead of <code>Promise.all</code> — 3× slower.', vi: '<code>await</code> lần lượt từng cái thay vì <code>Promise.all</code> — chậm gấp 3.' },
    { en: '<code>s.credits || 15</code> — turns a real 0 into 15.', vi: '<code>s.credits || 15</code> — biến số 0 thật thành 15.' },
    { en: '<code>list.sort()</code> on the argument — the caller\'s array is reordered.', vi: '<code>list.sort()</code> trên tham số — mảng của nơi gọi bị đảo thứ tự.' },
  ],
  nopBai: {
    en: 'Write <code>toolkit.js</code> in the editor. <b>Run</b> = sample checks, <b>Submit</b> = all checks (timers are virtual: 100 ms is measured exactly).',
    vi: 'Viết <code>toolkit.js</code> trong editor. <b>Chạy thử</b> = kiểm mẫu, <b>Nộp</b> = mọi kiểm (đồng hồ là ẢO: 100 ms được đo chính xác).',
  },
};
void NOP_BAI;

export default doiDau({
  slug: 'fer202-2-lab-es6-toolkit',
  ten: 'Lab 2 — Student Data Toolkit (ES6+)',
  khoa: KHOA,
  baiHoc: 'fer202-2-2-destructuring-spread-modules',
  de: [
    {
      dangBai: 'lab',
      tieuDe: { en: 'Lab 2 — Student Data Toolkit (destructuring · spread/rest · reduce · Promises)', vi: 'Lab 2 — Bộ hàm dữ liệu sinh viên (destructuring · spread/rest · reduce · Promise)' },
      doKho: 'MEDIUM',
      phut: 75,
      diem: 100,
      khaiNiem: ['destructuring', 'default parameters', 'template literals', 'spread / rest', 'map / reduce / sort', 'Promise.all / race / allSettled', 'optional chaining', 'nullish coalescing'],
      tienQuyet: ['JavaScript functions & arrays'],
      the: ['fer202', 'lab', 'es6', 'javascript'],
      banIn: BAN_IN,
      thuatNgu: [
        { en: 'pure function', vi: 'hàm thuần — không tác dụng phụ, không sửa tham số' },
        { en: 'destructuring', vi: 'tách giá trị từ object/mảng ra biến' },
        { en: 'rest / spread', vi: 'gom phần còn lại / trải phần tử ra' },
        { en: 'template literal', vi: 'chuỗi trong dấu huyền có ${…}' },
        { en: 'nullish coalescing (??)', vi: 'lấy giá trị dự phòng chỉ khi null/undefined' },
        { en: 'optional chaining (?.)', vi: 'đọc thuộc tính an toàn khi có thể null' },
        { en: 'settled', vi: 'đã kết thúc (thành công hoặc thất bại)' },
        ...tn('immutable', 'mutate'),
      ],
      goiY: [
        'formatStudent({ name, age = 18, major: { code = "N/A" } = {} } = {}) — mặc định cho cả object lồng và cả tham số.',
        'normalize: students.map(s => ({ ...s, fullName: …, email: … })). Title Case: trim().split(/\\s+/) rồi viết hoa chữ đầu từng từ.',
        'groupBy: list.reduce((acc, x) => ({ ...acc, [k]: [...(acc[k] ?? []), x] }), {}); countBy dùng Object.entries + Object.fromEntries.',
        'loadAverageGpa: await Promise.all(ids.map(fetchGpa)); withTimeout: Promise.race([p, wait(ms).then(() => { throw new Error("Timeout"); })]).',
      ],
      loiHayGap: [
        '<code>function stats(scores)</code> thay vì <code>stats(...scores)</code> ⇒ nhận số đầu tiên chứ không phải mảng.',
        'Destructuring <code>major: { code }</code> mà không có <code>= {}</code> ⇒ lỗi "Cannot read properties of undefined" khi thiếu major.',
        'Sửa trực tiếp <code>s.fullName = …</code> trong map ⇒ dữ liệu gốc bị đổi.',
        '<code>Math.max(scores)</code> (truyền mảng) ⇒ NaN; phải trải: <code>Math.max(...scores)</code>.',
        'Ghép object lồng bằng <code>{ ...a, ...b }</code> ⇒ <code>address</code> của b ghi đè TOÀN BỘ address của a.',
        'Dùng <code>||</code> cho giá trị mặc định của số ⇒ 0 bị thay.',
      ],
      moTaNgan: 'Lab chương 2: 13 hàm thuần ES6+ — destructuring/mặc định, map+spread bất biến, rest, groupBy bằng reduce, sort bản sao, gộp object, Promise.all/race/allSettled, ?. và ??.',
      giaiThich: '<p>Mọi hàm đều <b>thuần</b>: trả về giá trị mới (map + spread, sort trên <code>[...list]</code>, reduce tạo object mới) nên dữ liệu vào không đổi — đúng kỷ luật state của React. Tham số dạng object dùng destructuring với giá trị mặc định ở mọi tầng. Phần bất đồng bộ dùng ba công cụ khác nhau: <code>Promise.all</code> (song song, hỏng một là hỏng hết), <code>Promise.race</code> (quá hạn), <code>Promise.allSettled</code> (chấp nhận lỗi từng phần). <code>??</code> khác <code>||</code> ở chỗ chỉ thay <code>null</code>/<code>undefined</code>.</p>',
      tests: { loai: 'js', phienBan: 1, tepChinh: 'toolkit.js', tepNap: ['data.js', 'toolkit.js'], kiem: KIEM },
      khoiDau: { 'toolkit.js': DAU, 'data.js': DATA },
      loiGiai: { 'toolkit.js': GIAI, 'data.js': DATA },
      thamKhao: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment',
    },
  ],
});
