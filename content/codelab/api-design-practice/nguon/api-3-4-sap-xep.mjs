/** API Design · 3.4 — sort (danh sách cho phép, khoá phụ, thứ hạng), fields (chỉ bớt), include không N+1 (số đo thật bài 3.4). */
import { doiDau, KHOA, cs, q, tn, jsBai, nguon, goi } from './_api.mjs';

/* ── 1. Tình huống ── */
const E1 = cs({
  ten: 'Sort & fields 1 — What lesson 3.4 measured', kho: 'EASY', phut: 10,
  en: 'Facts from lesson 3.4 (real LabFlow runs, PostgreSQL 18.4).',
  vi: 'Những điều từ bài 3.4 (chạy thật trên LabFlow, PostgreSQL 18.4).',
  cau: [
    q('c1', ['sort=startAt returned bk_1, bk_2, bk_3, all at 2026-11-02T00:00Z. What decides their order?', 'sort=startAt trả bk_1, bk_2, bk_3, cùng 2026-11-02T00:00Z. Điều gì quyết định thứ tự của chúng?'], ['The id’s number as tie-breaker, in the same direction', 'The order in which they were inserted', 'Random — it may change between calls', 'The lab id'], ['orderBy always appends the id in the sort direction — every row has exactly one position.', 'orderBy luôn thêm id theo chiều sắp — mỗi dòng có đúng một vị trí.']),
    q('c2', ['100 bookings: 31 026 bytes in full, 10 778 bytes with fields=startAt,status. Which members did each item carry?', '100 lượt đặt: 31 026 byte đầy đủ, 10 778 byte với fields=startAt,status. Mỗi phần tử mang những trường nào?'], ['id, startAt, status — id is always kept', 'startAt, status only', 'all nine members, values emptied', 'startAt, status and the cursor'], ['A client cannot do anything with an item it cannot identify, so id stays.', 'Client không làm được gì với phần tử không nhận diện được, nên id luôn ở lại.']),
    q('c3', ['fields=startAt,passwordHash returned …', 'fields=startAt,passwordHash trả …'], ['400 — fields is validated against the members of the view', '200 with the hash, because fields copies what was asked', '200 without the hash, dropped silently by the view', '403 Forbidden, because the field is secret'], ['fields can only remove members of the allow-list view of lesson 2.3, never add.', 'fields chỉ bớt được trường của view danh sách cho phép ở bài 2.3, không bao giờ thêm.']),
    q('c4', ['21 queries (N+1) took 2.16 ms on localhost; one JOIN took 0.25 ms. Over a real network the gap …', '21 truy vấn (N+1) mất 2,16 ms trên localhost; một JOIN mất 0,25 ms. Qua mạng thật khoảng cách đó …'], ['grows — every one of the 21 queries also pays a round trip', 'disappears — networks are faster than disks', 'stays exactly 9×', 'reverses — many small queries win'], ['Latency adds per query. ORMs produce N+1 silently through lazy loading.', 'Độ trễ cộng dồn theo từng truy vấn. ORM tạo N+1 một cách lặng lẽ qua lazy loading.']),
    q('c5', ['Why does LabFlow accept include=lab but not include=lab.devices.issues?', 'Vì sao LabFlow nhận include=lab nhưng không nhận include=lab.devices.issues?'], ['One allow-listed level keeps responses predictable; arbitrary graphs are GraphQL’s job', 'Express cannot parse dots inside query string values at all', 'Objects nested three levels deep are not valid JSON documents', 'Devices and issues have no public view that could be embedded'], ['Deep includes build trees nobody can predict or bound (Chapter 7 for GraphQL).', 'Include lồng sâu dựng những cái cây không ai đoán trước hay giới hạn được (GraphQL ở Chương 7).']),
  ],
  goiY: [['Every number was printed in lesson 3.4.', 'Mọi con số đã được in trong bài 3.4.'], ['fields and include are allow-lists.', 'fields và include là danh sách cho phép.']],
  loi: [['Sorting without a tie-breaker.', 'Sắp mà không có khoá phụ.'], ['Letting fields reach the database record.', 'Để fields chạm tới bản ghi trong cơ sở dữ liệu.']],
  tns: [tn('sparse fieldset', 'bộ trường rút gọn'), tn('N+1 problem', 'vấn đề N+1')],
  kn: ['sorting', 'N+1'],
});

/* ── 2. Tự viết: orderBy có thứ hạng ── */
function orderBy(sort, ranks) {
  const idNum = (id) => Number(id.slice(id.indexOf('_') + 1));
  const desc = sort.startsWith('-'), key = sort.replace('-', '');
  const dir = desc ? -1 : 1;
  const r = ranks || {};
  const val = (row) => (r[key] ? r[key][row[key]] : row[key]);
  return (a, b) => {
    const x = val(a), y = val(b);
    return dir * ((typeof x === 'number' ? x - y : String(x).localeCompare(String(y))) || idNum(a.id) - idNum(b.id));
  };
}
const ISS = [
  { id: 'iss_60', severity: 'HIGH', createdAt: '2026-10-07T12:00:00.000Z' },
  { id: 'iss_59', severity: 'LOW', createdAt: '2026-10-07T11:00:00.000Z' },
  { id: 'iss_58', severity: 'HIGH', createdAt: '2026-10-07T10:00:00.000Z' },
  { id: 'iss_57', severity: 'MEDIUM', createdAt: '2026-10-07T09:00:00.000Z' },
  { id: 'iss_9', severity: 'MEDIUM', createdAt: '2026-10-07T09:00:00.000Z' },
];
const RANK = { severity: { LOW: 1, MEDIUM: 2, HIGH: 3 } };
const sx = (sort, ranks) => `(function () { var rows = ${JSON.stringify(ISS)}; return rows.slice().sort(orderBy(${JSON.stringify(sort)}${ranks ? `, ${JSON.stringify(ranks)}` : ''})).map(function (x) { return x.id; }); })()`;
const E2 = jsBai({
  ten: 'Sort & fields 2 — Write orderBy(sort, ranks): one comparator for every order', kho: 'MEDIUM', phut: 15,
  en: `<p>Return a <b>comparator</b> for <code>Array.prototype.sort</code>:</p><ul>
<li><code>sort</code> is a field name, with a leading <code>-</code> for descending (<code>"-createdAt"</code>, <code>"startAt"</code>, <code>"-severity"</code>)</li>
<li>if <code>ranks</code> has an entry for that field (e.g. <code>{ severity: { LOW: 1, MEDIUM: 2, HIGH: 3 } }</code>), compare the <b>ranks</b> as numbers; otherwise compare the values as strings</li>
<li>ties are broken by the id’s number, <b>in the same direction</b></li></ul>
<p><code>ranks</code> may be missing. The tests sort five real Lab 3 issues and print their ids.</p>`,
  vi: `<p>Trả một <b>hàm so sánh</b> cho <code>Array.prototype.sort</code>:</p><ul>
<li><code>sort</code> là tên trường, có <code>-</code> ở đầu nếu giảm dần (<code>"-createdAt"</code>, <code>"startAt"</code>, <code>"-severity"</code>)</li>
<li>nếu <code>ranks</code> có mục cho trường đó (ví dụ <code>{ severity: { LOW: 1, MEDIUM: 2, HIGH: 3 } }</code>), so <b>thứ hạng</b> như số; ngược lại so giá trị như chuỗi</li>
<li>bằng nhau thì phân xử bằng con số của id, <b>cùng chiều</b></li></ul>
<p><code>ranks</code> có thể vắng. Các kiểm sắp năm báo hỏng thật của Lab 3 rồi in id.</p>`,
  dauVao: ['sort — string; ranks — { field: { VALUE: number } } | undefined', 'sort — chuỗi; ranks — { trường: { GIÁ_TRỊ: số } } | undefined'],
  dauRa: ['(a, b) =&gt; number', '(a, b) =&gt; số'],
  goiY: [['Multiply the whole comparison, tie-breaker included, by dir (1 or -1).', 'Nhân cả phép so sánh, kể cả khoá phụ, với dir (1 hoặc -1).'], ['Map a row to its comparable value first: ranks[key] ? ranks[key][row[key]] : row[key].', 'Đổi mỗi dòng ra giá trị so được trước: ranks[key] ? ranks[key][row[key]] : row[key].']],
  loi: [['Comparing "HIGH", "LOW", "MEDIUM" as text — descending gives MEDIUM first.', 'So "HIGH", "LOW", "MEDIUM" như chữ — giảm dần ra MEDIUM trước.'], ['Breaking ties ascending in a descending list.', 'Phân xử tăng dần trong một danh sách giảm dần.']],
  gt: ['This is Lab 3’s orderBy: one comparator per sort value, used both to sort and (in the handler) to decide what comes “after” a cursor.', 'Đây là orderBy của Lab 3: mỗi giá trị sort một hàm so sánh, dùng cả để sắp lẫn (trong handler) để quyết định cái gì đứng "sau" một con trỏ.'],
  kn: ['sorting', 'comparator'],
  tns: [tn('business rank', 'thứ hạng nghiệp vụ'), tn('comparator', 'hàm so sánh')],
  dau: `/** sort value (+ optional ranks) ⇒ comparator */
function orderBy(sort, ranks) {
  // Write your solution here
  const desc = sort.startsWith('-'), key = sort.replace('-', '');
  return (a, b) => (desc ? -1 : 1) * String(a[key]).localeCompare(String(b[key]));
}
`,
  giai: '// Reference solution\n' + nguon(orderBy),
  cases: [
    { goi: sx('-createdAt'), moTa: ['-createdAt (ties at 09:00)', '-createdAt (bằng nhau lúc 09:00)'] },
    { goi: sx('-severity', RANK), moTa: ['-severity with business ranks', '-severity theo thứ hạng nghiệp vụ'] },
    { goi: sx('createdAt'), an: true },
    { goi: sx('severity', RANK), an: true },
    { goi: sx('-severity'), an: true, moTa: ['Without ranks: plain text order', 'Không có thứ hạng: thứ tự chữ thường'] },
  ],
});

/* ── 3. Tự viết: pickFields ── */
function pickFields(view, fields, allowed) {
  const bad = fields.filter((f) => !allowed.includes(f));
  if (bad.length) throw new RangeError(`fields: ${bad.join(', ')}`);
  const keep = ['id', ...fields.filter((f) => f !== 'id')].filter((f, i, a) => a.indexOf(f) === i);
  const out = {};
  for (const k of keep) out[k] = view[k];
  return out;
}
const ALLOWED = ['id', 'labId', 'userId', 'startAt', 'endAt', 'purpose', 'status', 'createdAt', 'cancelledAt'];
const VIEW = { id: 'bk_200', labId: 'lab_2', userId: 'usr_2', startAt: '2026-11-15T02:00:00.000Z', endAt: '2026-11-15T04:00:00.000Z', purpose: 'CLB IoT', status: 'PENDING', createdAt: '2026-10-01T03:20:00.000Z', cancelledAt: null };
const E3 = jsBai({
  ten: 'Sort & fields 3 — Write pickFields(view, fields, allowed): a sparse fieldset', kho: 'EASY', phut: 10,
  en: `<p>Return a new object with <code>id</code> first, then the requested <code>fields</code> in the order asked, each once. If any requested field is not in <code>allowed</code> (the members of the view), throw a <code>RangeError</code> — LabFlow answers that with 400. Fields whose value is <code>null</code> are kept as <code>null</code>.</p>`,
  vi: `<p>Trả object mới có <code>id</code> đứng đầu, rồi các <code>fields</code> được xin theo đúng thứ tự, mỗi trường một lần. Nếu có trường nào không nằm trong <code>allowed</code> (các trường của view), ném <code>RangeError</code> — LabFlow trả lỗi đó bằng 400. Trường có giá trị <code>null</code> được giữ là <code>null</code>.</p>`,
  dauVao: ['view — the public view; fields — string[] (from fields=a,b); allowed — the view’s members', 'view — view công khai; fields — mảng chuỗi (từ fields=a,b); allowed — các trường của view'],
  dauRa: ['a new object, or throw RangeError', 'object mới, hoặc ném RangeError'],
  goiY: [['Check first, build second.', 'Kiểm trước, dựng sau.'], ['A list without duplicates: filter((f, i, a) =&gt; a.indexOf(f) === i).', 'Danh sách không trùng: filter((f, i, a) =&gt; a.indexOf(f) === i).']],
  loi: [['Copying view[k] for any k — fields becomes a way into the record.', 'Chép view[k] với mọi k — fields thành cửa vào bản ghi.'], ['Dropping id when it was not requested.', 'Bỏ id khi nó không được xin.']],
  gt: ['fields sits on top of the allow-list view: it can only remove. id is always kept so the client can still identify the item.', 'fields nằm trên view danh sách cho phép: nó chỉ bớt được. id luôn được giữ để client vẫn nhận diện được phần tử.'],
  kn: ['sparse fieldsets'],
  tns: [tn('sparse fieldset', 'bộ trường rút gọn'), tn('allow-list', 'danh sách cho phép')],
  dau: `/** view + requested fields ⇒ smaller view (or RangeError) */
function pickFields(view, fields, allowed) {
  // Write your solution here
  const out = {};
  for (const k of fields) out[k] = view[k];
  return out;
}
`,
  giai: '// Reference solution\n' + nguon(pickFields),
  cases: [
    { goi: goi('pickFields', VIEW, ['startAt', 'status'], ALLOWED), moTa: ['fields=startAt,status (lesson 3.4)', 'fields=startAt,status (bài 3.4)'] },
    { goi: goi('pickFields', VIEW, ['startAt', 'passwordHash'], ALLOWED), nem: 'RangeError', moTa: ['fields=startAt,passwordHash', 'fields=startAt,passwordHash'] },
    { goi: goi('pickFields', VIEW, ['status', 'id', 'status', 'cancelledAt'], ALLOWED), an: true },
    { goi: goi('pickFields', VIEW, ['id'], ALLOWED), an: true },
    { goi: goi('pickFields', VIEW, ['purpose', 'secret', 'version'], ALLOWED), nem: 'RangeError', an: true },
  ],
});

/* ── 4. Tự viết: includeLab ── */
function includeLab(page, labs) {
  const byId = new Map(labs.map((l) => [l.id, l]));
  return page.map((b) => {
    const l = byId.get(b.labId);
    return { ...b, lab: l ? { id: l.id, code: l.code, name: l.name } : null };
  });
}
const LABS = [
  { id: 'lab_1', code: 'AL-201', name: 'Phòng Lab Mạng máy tính', building: 'Alpha', capacity: 30, internalNote: 'khoá tủ số 3' },
  { id: 'lab_2', code: 'AL-305', name: 'Phòng Lab IoT', building: 'Alpha', capacity: 24, internalNote: null },
];
const PAGE = [{ id: 'bk_200', labId: 'lab_2' }, { id: 'bk_199', labId: 'lab_1' }, { id: 'bk_198', labId: 'lab_2' }];
const E4 = jsBai({
  ten: 'Sort & fields 4 — Write includeLab(page, labs) without N+1', kho: 'MEDIUM', phut: 12,
  en: `<p>For <code>include=lab</code>, return a new array where every booking of <code>page</code> gets a member <code>lab</code> = the lab’s <b>view</b> <code>{ id, code, name }</code> (nothing else from the lab record), or <code>null</code> if the lab does not exist. Build <b>one</b> lookup structure for the whole page (a <code>Map</code>) — no search through <code>labs</code> per booking. Do not modify <code>page</code>.</p>`,
  vi: `<p>Với <code>include=lab</code>, trả một mảng mới trong đó mỗi lượt đặt của <code>page</code> có thêm trường <code>lab</code> = <b>view</b> của phòng <code>{ id, code, name }</code> (không gì khác từ bản ghi phòng), hoặc <code>null</code> nếu phòng không tồn tại. Dựng <b>một</b> cấu trúc tra cứu cho cả trang (một <code>Map</code>) — không tìm trong <code>labs</code> cho từng lượt đặt. Không sửa <code>page</code>.</p>`,
  dauVao: ['page — [{ id, labId, … }]; labs — lab records', 'page — [{ id, labId, … }]; labs — bản ghi phòng'],
  dauRa: ['a new array of bookings, each with lab', 'mảng lượt đặt mới, mỗi lượt có lab'],
  goiY: [['new Map(labs.map((l) =&gt; [l.id, l])) once, then byId.get(b.labId).', 'new Map(labs.map((l) =&gt; [l.id, l])) một lần, rồi byId.get(b.labId).'], ['{ ...b, lab } creates a new object and leaves b alone.', '{ ...b, lab } tạo object mới và để yên b.']],
  loi: [['lab: labs.find(…) — the full record leaks internalNote, and it is one search per row.', 'lab: labs.find(…) — cả bản ghi làm lộ internalNote, và mỗi dòng một lần tìm.'], ['b.lab = … — modifies the caller’s page.', 'b.lab = … — sửa trang của người gọi.']],
  gt: ['In memory a Map per page is the equivalent of one JOIN (or WHERE id = ANY(…)) in SQL; embedding the lab’s view keeps the allow-list rule of lesson 2.3 for related data too.', 'Trong bộ nhớ, một Map cho mỗi trang tương đương một JOIN (hoặc WHERE id = ANY(…)) trong SQL; nhúng view của phòng giữ luật danh sách cho phép của bài 2.3 cho cả dữ liệu liên quan.'],
  kn: ['N+1', 'include'],
  tns: [tn('include / embedding', 'nhúng tài nguyên liên quan'), tn('lookup map', 'bảng tra cứu')],
  dau: `/** page + labs ⇒ bookings with their lab's view */
function includeLab(page, labs) {
  // Write your solution here
  return page.map((b) => ({ ...b, lab: labs.find((l) => l.id === b.labId) }));
}
`,
  giai: '// Reference solution\n' + nguon(includeLab),
  cases: [
    { goi: goi('includeLab', PAGE, LABS), moTa: ['include=lab on three bookings', 'include=lab với ba lượt đặt'] },
    { goi: goi('includeLab', [{ id: 'bk_1', labId: 'lab_9' }], LABS), moTa: ['Unknown lab ⇒ null', 'Phòng không tồn tại ⇒ null'] },
    { goi: goi('includeLab', [], LABS), an: true },
    { goi: `(function () { var p = ${JSON.stringify(PAGE)}; includeLab(p, ${JSON.stringify(LABS)}); return p; })()`, an: true, moTa: ['The page is not modified', 'Trang không bị sửa'] },
  ],
});

export default doiDau({ slug: 'api-3-4-sap-xep', ten: '3.4 Sorting, sparse fields and includes', khoa: KHOA, baiHoc: 'api-3-4-sap-xep', de: [E1, E2, E3, E4] });
