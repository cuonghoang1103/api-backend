/** API Design · Lab 3 — Danh sách bảo trì GET /issues: thiết kế mã lỗi, issuesPage (lọc + sort thứ hạng + con trỏ), walkAll (output thật Lab 3). */
import { doiDau, KHOA, cs, bang1, tn, jsBai, nguon } from './_api.mjs';

/* ── 1. Thiết kế (Phần A) ── */
const ST = ['200', '400'];
const CODE = ['—', 'INVALID_QUERY', 'INVALID_CURSOR', 'CURSOR_MISMATCH'];
const E1 = cs({
  ten: 'Lab 3 · 1 — Part A: the answers before the code', kho: 'EASY', phut: 8, loai: 'table',
  en: 'Fill Part A of Lab 3: status and code for each request to GET /issues (— for success).',
  vi: 'Điền Phần A của Lab 3: mã trạng thái và code cho từng request tới GET /issues (— nếu thành công).',
  bang: [bang1('b1', ['GET /issues… → status + code', 'GET /issues… → mã + code'], [{ ma: 'x', ten: 'Request' }, { ma: 's', ten: 'Status', luaChon: ST }, { ma: 'c', ten: 'code', luaChon: CODE }], [
    { o: { x: '?limit=0' }, a: { s: '400', c: 'INVALID_QUERY' } },
    { o: { x: '?sort=title' }, a: { s: '400', c: 'INVALID_QUERY' } },
    { o: { x: '?cursor=<a page.next with one letter changed>' }, a: { s: '400', c: ['INVALID_CURSOR', 'CURSOR_MISMATCH'] } },
    { o: { x: '?deviceId=dev_2&cursor=<page.next of ?limit=3>' }, a: { s: '400', c: 'CURSOR_MISMATCH' } },
    { o: { x: '?sort=-severity&status=OPEN&limit=5' }, a: { s: '200', c: '—' } },
  ], ['An edited cursor is either unreadable (INVALID_CURSOR) or decodes to another fingerprint (CURSOR_MISMATCH) — both are 400; the HMAC stretch goal makes it always INVALID_CURSOR. The real transcript: limit=0&sort=title listed both parameters; the step-1 cursor with deviceId=dev_2 gave CURSOR_MISMATCH.', 'Con trỏ bị sửa hoặc không đọc được (INVALID_CURSOR) hoặc giải ra dấu vân tay khác (CURSOR_MISMATCH) — cả hai đều 400; mục tiêu nâng cao HMAC làm nó luôn là INVALID_CURSOR. Transcript thật: limit=0&sort=title liệt kê cả hai tham số; con trỏ của bước 1 với deviceId=dev_2 cho CURSOR_MISMATCH.'])],
  goiY: [['Query values ⇒ INVALID_QUERY; the cursor ⇒ one of the two cursor codes.', 'Giá trị query ⇒ INVALID_QUERY; con trỏ ⇒ một trong hai mã con trỏ.'], ['The step-1 cursor was made for “no filter”.', 'Con trỏ bước 1 được làm cho "không lọc".']],
  loi: [['Answering 200 with the first page when the cursor does not fit.', 'Trả 200 với trang đầu khi con trỏ không khớp.'], ['Using 422 for a bad query parameter — LabFlow’s query errors are 400.', 'Dùng 422 cho tham số query sai — lỗi query của LabFlow là 400.']],
  tns: [tn('query contract', 'hợp đồng query'), tn('fingerprint', 'dấu vân tay')],
  kn: ['error codes'],
});

/* ── 2. Tự viết: issuesPage ── */
function issuesPage(issues, query) {
  const RANK = { LOW: 1, MEDIUM: 2, HIGH: 3 };
  const idNum = (id) => Number(id.slice(id.indexOf('_') + 1));
  const { limit, sort, status, severity, deviceId, after } = query;
  const desc = sort.startsWith('-'), key = sort.replace('-', '');
  const val = (r) => (key === 'severity' ? RANK[r.severity] : r[key]);
  const cmp = (a, b) => {
    const x = val(a), y = val(b);
    return (desc ? -1 : 1) * ((typeof x === 'number' ? x - y : x.localeCompare(y)) || idNum(a.id) - idNum(b.id));
  };
  let rows = issues.filter((i) => (!status || i.status === status)
    && (!severity || i.severity === severity) && (!deviceId || i.deviceId === deviceId));
  rows.sort(cmp);
  if (after) rows = rows.filter((i) => cmp({ id: after.id, [key]: after.v }, i) < 0);
  const page = rows.slice(0, limit);
  const last = page[page.length - 1];
  return { ids: page.map((i) => i.id), next: rows.length > limit ? { v: last[key], id: last.id } : null };
}
const SEV = ['LOW', 'MEDIUM', 'HIGH'];
const ISS = Array.from({ length: 12 }, (_, k) => {
  const i = k + 49;
  return { id: `iss_${i}`, deviceId: `dev_${(i % 3) + 1}`, severity: SEV[(i + Math.floor(i / 3)) % 3], status: i % 4 === 0 ? 'RESOLVED' : 'OPEN', createdAt: new Date(Date.UTC(2026, 9, 5, 0) + i * 3600000).toISOString() };
});
const call = (q) => `issuesPage(${JSON.stringify(ISS)}, ${JSON.stringify(q)})`;
const E2 = jsBai({
  ten: 'Lab 3 · 2 — Write issuesPage(issues, query): filter, rank, page', kho: 'HARD', phut: 25,
  en: `<p>The core of <code>GET /issues</code> without HTTP. <code>query</code> is already validated: <code>{ limit, sort, status?, severity?, deviceId?, after? }</code> with <code>sort</code> ∈ <code>-createdAt</code>, <code>createdAt</code>, <code>-severity</code>, and <code>after</code> = a decoded cursor <code>{ v, id }</code> (the sort-key value and id of the last item seen) or <code>null</code>.</p><ol>
<li>keep issues matching every filter present (AND)</li>
<li>sort: severity by <b>business rank</b> LOW 1 · MEDIUM 2 · HIGH 3; createdAt as ISO text; ties by the id’s number, same direction</li>
<li>if <code>after</code>: only issues that come after that position</li>
<li>return <code>{ ids, next }</code> — <code>next = { v, id }</code> of the last returned issue (<code>v</code> = its value of the sort key) when more remain, else <code>null</code></li></ol>`,
  vi: `<p>Lõi của <code>GET /issues</code> không có HTTP. <code>query</code> đã được kiểm: <code>{ limit, sort, status?, severity?, deviceId?, after? }</code> với <code>sort</code> ∈ <code>-createdAt</code>, <code>createdAt</code>, <code>-severity</code>, và <code>after</code> = con trỏ đã giải <code>{ v, id }</code> (giá trị khoá sắp và id của phần tử cuối đã thấy) hoặc <code>null</code>.</p><ol>
<li>giữ các báo hỏng khớp mọi bộ lọc có mặt (AND)</li>
<li>sắp: severity theo <b>thứ hạng nghiệp vụ</b> LOW 1 · MEDIUM 2 · HIGH 3; createdAt như chuỗi ISO; bằng nhau thì theo con số của id, cùng chiều</li>
<li>nếu có <code>after</code>: chỉ các báo hỏng đứng sau vị trí đó</li>
<li>trả <code>{ ids, next }</code> — <code>next = { v, id }</code> của báo hỏng cuối được trả (<code>v</code> = giá trị khoá sắp của nó) khi còn, ngược lại <code>null</code></li></ol>`,
  dauVao: ['issues — [{ id, deviceId, severity, status, createdAt }]; query — see above', 'issues — [{ id, deviceId, severity, status, createdAt }]; query — xem trên'],
  dauRa: ['{ ids: string[], next: { v, id } | null }', '{ ids: mảng chuỗi, next: { v, id } | null }'],
  goiY: [['Turn the cursor back into a “fake row” { id, [key]: v } and compare it with the same comparator.', 'Biến con trỏ thành "dòng giả" { id, [key]: v } rồi so bằng cùng hàm so sánh.'], ['Filter first, sort second, cut after the cursor, slice last.', 'Lọc trước, sắp sau, cắt sau con trỏ, slice cuối cùng.']],
  loi: [['Comparing severities as strings: MEDIUM, LOW, HIGH.', 'So severity như chuỗi: MEDIUM, LOW, HIGH.'], ['Putting createdAt into v for a severity list — the cursor must hold the current sort key.', 'Đưa createdAt vào v cho danh sách sắp theo severity — con trỏ phải giữ khoá sắp hiện tại.']],
  gt: ['Exactly the reference route of Lab 3: one comparator built from the sort value and the ranks, used to sort and to decide “after”; the cursor carries the current key, so -severity pages stay correct across equal ranks.', 'Đúng route tham chiếu của Lab 3: một hàm so sánh dựng từ giá trị sort và thứ hạng, dùng để sắp và để quyết định "sau"; con trỏ mang khoá hiện tại nên các trang -severity vẫn đúng qua những thứ hạng bằng nhau.'],
  kn: ['cursor pagination', 'sorting', 'filtering'],
  tns: [tn('business rank', 'thứ hạng nghiệp vụ'), tn('decoded cursor', 'con trỏ đã giải mã')],
  dau: `/** validated query ⇒ one page of issues + next cursor */
function issuesPage(issues, query) {
  // Write your solution here
  const key = query.sort.replace('-', ''), desc = query.sort.startsWith('-');
  let rows = issues.filter((i) => !query.status || i.status === query.status);
  rows.sort((a, b) => (desc ? -1 : 1) * String(a[key]).localeCompare(String(b[key])));
  const page = rows.slice(0, query.limit), last = page[page.length - 1];
  return { ids: page.map((i) => i.id), next: rows.length > query.limit ? { v: last[key], id: last.id } : null };
}
`,
  giai: '// Reference solution\n' + nguon(issuesPage),
  cases: [
    { goi: call({ limit: 3, sort: '-createdAt', after: null }), moTa: ['First page, newest first', 'Trang đầu, mới nhất trước'] },
    { goi: call({ limit: 4, sort: '-severity', status: 'OPEN', after: null }), moTa: ['-severity, OPEN only', '-severity, chỉ OPEN'] },
    { goi: call({ limit: 4, sort: '-severity', status: 'OPEN', after: { v: 'HIGH', id: 'iss_50' } }), an: true, moTa: ['Page 2 of -severity across equal ranks', 'Trang 2 của -severity qua thứ hạng bằng nhau'] },
    { goi: call({ limit: 5, sort: 'createdAt', deviceId: 'dev_2', after: null }), an: true },
    { goi: call({ limit: 2, sort: '-createdAt', severity: 'HIGH', deviceId: 'dev_3', after: { v: '2026-10-07T06:00:00.000Z', id: 'iss_54' } }), an: true },
    { goi: call({ limit: 20, sort: '-severity', after: null }), an: true, moTa: ['Everything on one page ⇒ next null', 'Tất cả trên một trang ⇒ next null'] },
  ],
});

/* ── 3. Tự viết: walkAll ── */
function walkAll(fetchPage) {
  const seen = new Set();
  const duplicates = [];
  let cursor = null, pages = 0;
  do {
    const res = fetchPage(cursor);
    pages++;
    for (const item of res.data) {
      if (seen.has(item.id)) duplicates.push(item.id);
      else seen.add(item.id);
    }
    cursor = res.next;
  } while (cursor && pages < 50);
  return { pages, count: seen.size, duplicates };
}
const fake = (pages) => `(function () { var P = ${JSON.stringify(pages)}; return walkAll(function (c) { return P[c === null ? 'start' : c]; }); })()`;
const E3 = jsBai({
  ten: 'Lab 3 · 3 — Write walkAll(fetchPage): the walk.mjs check', kho: 'MEDIUM', phut: 15,
  en: `<p><code>fetchPage(cursor)</code> returns one page <code>{ data: [{ id }], next }</code> — call it with <code>null</code> first, then with each <code>next</code> until <code>next</code> is <code>null</code>. Return <code>{ pages, count, duplicates }</code>: how many pages were fetched, how many <b>distinct</b> ids were seen, and every id seen again (in the order the repeats occurred). Stop after 50 pages in any case, so a broken server cannot loop you forever.</p><p>Real Lab 3 output: <code>2 trang, 45 báo hỏng OPEN, không trùng</code>.</p>`,
  vi: `<p><code>fetchPage(cursor)</code> trả một trang <code>{ data: [{ id }], next }</code> — gọi với <code>null</code> trước, rồi với từng <code>next</code> cho tới khi <code>next</code> là <code>null</code>. Trả <code>{ pages, count, duplicates }</code>: đã lấy bao nhiêu trang, thấy bao nhiêu id <b>khác nhau</b>, và mọi id bị thấy lại (theo thứ tự lần lặp xảy ra). Dừng sau 50 trang trong mọi trường hợp, để một server hỏng không bắt bạn lặp mãi.</p><p>Output thật của Lab 3: <code>2 trang, 45 báo hỏng OPEN, không trùng</code>.</p>`,
  dauVao: ['fetchPage — (cursor | null) =&gt; { data: [{ id }], next: string | null }', 'fetchPage — (cursor | null) =&gt; { data: [{ id }], next: chuỗi | null }'],
  dauRa: ['{ pages, count, duplicates }', '{ pages, count, duplicates }'],
  goiY: [['A Set remembers ids already seen.', 'Một Set nhớ các id đã thấy.'], ['do … while (cursor &amp;&amp; pages &lt; 50) fetches the first page unconditionally.', 'do … while (cursor &amp;&amp; pages &lt; 50) lấy trang đầu vô điều kiện.']],
  loi: [['Counting every item instead of distinct ids.', 'Đếm mọi phần tử thay vì số id khác nhau.'], ['while (true) — a server that returns the same next forever hangs the script.', 'while (true) — server trả mãi cùng một next làm script treo.']],
  gt: ['This is the proof of rubric line 5: with cursor paging the walk sees every issue exactly once, also when someone reports in the middle. Run the same walk against an offset API with an insert halfway and duplicates appears.', 'Đây là bằng chứng cho dòng 5 của rubric: với phân trang con trỏ, lượt đi thấy mọi báo hỏng đúng một lần, kể cả khi có người báo giữa chừng. Chạy cùng lượt đi với API offset có một lần chèn giữa chừng thì duplicates xuất hiện.'],
  kn: ['cursor pagination', 'testing'],
  tns: [tn('walk', 'đi hết danh sách theo next'), tn('guard', 'chốt chặn (giới hạn số vòng)')],
  dau: `/** follow next to the end ⇒ { pages, count, duplicates } */
function walkAll(fetchPage) {
  // Write your solution here
  let cursor = null, pages = 0, count = 0;
  while (true) {
    const res = fetchPage(cursor);
    pages++; count += res.data.length;
    if (!res.next) break;
    cursor = res.next;
  }
  return { pages, count, duplicates: [] };
}
`,
  giai: '// Reference solution\n' + nguon(walkAll),
  cases: [
    { goi: fake({ start: { data: [{ id: 'iss_60' }, { id: 'iss_59' }], next: 'c1' }, c1: { data: [{ id: 'iss_58' }], next: null } }), moTa: ['Two pages, no repeats', 'Hai trang, không lặp'] },
    { goi: fake({ start: { data: [{ id: 'bk_200' }, { id: 'bk_199' }, { id: 'bk_198' }, { id: 'bk_197' }, { id: 'bk_196' }], next: 'o5' }, o5: { data: [{ id: 'bk_196' }, { id: 'bk_195' }, { id: 'bk_194' }, { id: 'bk_193' }, { id: 'bk_192' }], next: null } }), moTa: ['The offset walk of lesson 3.1', 'Lượt đi offset của bài 3.1'] },
    { goi: fake({ start: { data: [], next: null } }), an: true },
    { goi: fake({ start: { data: [{ id: 'a_1' }], next: 'x' }, x: { data: [{ id: 'a_1' }, { id: 'a_2' }], next: 'x' } }), an: true, moTa: ['A broken server returns the same next forever', 'Server hỏng trả mãi cùng một next'] },
  ],
});

export default doiDau({ slug: 'api-3-5-lab', ten: 'Lab 3 — The maintenance list', khoa: KHOA, baiHoc: 'api-3-5-lab', de: [E1, E2, E3] });
