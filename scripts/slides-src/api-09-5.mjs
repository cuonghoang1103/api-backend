/**
 * api-09-5 — API Design · Chapter 9 · Lesson 9.5 "SQL vs NoSQL from the API" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s09-du-lieu.mjs › api-9-4-nosql. Output = chạy thật docs.sql + perf/doc-vs-rel.mjs (PostgreSQL 18, JSONB).
 */
import { lamDeck, http, two, box, cards } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 9 — Data at scale', bai: '9.5' };

export const deck = { key: 'api-09-5', code: 'API 9.5', title: 'SQL vs NoSQL from the API', sub: 'Access patterns decide' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'SQL vs NoSQL<br>seen from the API', sub: 'Not a slogan: four LabFlow requests,<br>measured both ways.' },

  { t: 'The same data, two shapes', to: true, giua: true, body: two(box('Relational: 3 tables', 'labs_r 1,000 · devices_r 30,000 · issues_r 150,000 — joined by keys, indexed on lab_id, device_id, status.', 'lam'), box('Document: 1 JSONB per lab', '{ id, name, devices: [ { id, status, issues: [ … ] } ] } — 10,247 bytes of JSON, 1,685 stored after compression; GIN jsonb_path_ops.', 'lam')) + box('The question', 'Not “which database is better” but “which requests will clients send, and how often?”', 'xanh') },

  { t: 'Four requests, both ways', giua: true, body: http(`$ node perf/doc-vs-rel.mjs                                  (median)
chi tiết 1 phòng · quan hệ: JOIN + json_agg                  0.236 ms
chi tiết 1 phòng · tài liệu: một dòng theo khoá chính        0.171 ms
sửa 1 thiết bị · quan hệ: UPDATE một dòng                    0.102 ms
sửa 1 thiết bị · tài liệu: tìm vị trí trong mảng + jsonb_set 0.452 ms
mọi thiết bị đang bảo trì · quan hệ: chỉ mục status          0.248 ms
mọi thiết bị đang bảo trì · tài liệu: GIN @> rồi bóc mảng    8.290 ms
phòng có 20.000 báo hỏng · tài liệu: đọc cả tài liệu         8.904 ms
20 báo hỏng mới nhất · quan hệ: chỉ mục + LIMIT 20           0.109 ms
tài liệu phòng 9999: 1197841 byte JSON (133163 byte lưu)`, { sm: true, wrap: 'any' }) },

  { t: 'Reading the results as an API designer', to: true, giua: true, body: cards([
    ['✓ GET /labs/{id} with everything', 'Document 0.17 vs JOIN 0.24 ms: the stored shape IS the response.'],
    ['✗ PATCH /devices/{id}', 'Table 0.10 vs document 0.45 ms: find the array slot, rewrite the whole document.'],
    ['✗ Query across labs', 'Index 0.25 vs GIN + unpacking 8.3 ms — 33× slower.'],
    ['✗ Lists that keep growing', '20,000 embedded issues: an 8.9 ms, 1.2 MB read. MongoDB caps documents at 16 MB for this reason.'],
  ], 2) },

  { t: 'Decide from access patterns', to: true, giua: true, body: `<table class="t" style="font-size:20px">
<tr><th>Access pattern</th><th>Store it as</th></tr>
<tr><td>Read the whole thing by id</td><td>document / JSONB column</td></tr>
<tr><td>Small updates by many people</td><td>rows (each with its own ETag)</td></tr>
<tr><td>Queries across many parents</td><td>rows + indexes</td></tr>
<tr><td>Lists that keep growing</td><td>rows, cursor-paginated</td></tr>
</table>` + two(box('✗ API shaped by storage', 'Only <code class="i">PUT /labs/{id}</code> with the whole document ⇒ lost updates (5.4) and 10 KB per small change.', 'do2'), box('Academy link', 'SDN302 3.1 taught “embed or reference + populate”; here you measured it from the API side.', 'lam')) },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>One-lab read: document <b>0.17</b> vs JOIN <b>0.24 ms</b>; one-device update: table <b>0.10</b> vs document <b>0.45 ms</b></li>
<li>Cross-lab query: index <b>0.25</b> vs GIN + unpacking <b>8.3 ms</b>; 20,000 embedded issues: <b>1.2 MB</b> per read</li>
<li>Choose from the API’s access patterns — never shape the API around the storage</li>
</ul>
${box('Next', 'Lab 9 — a notes feed that is cacheable, consistent and ready to shard.', 'xanh')}` },
]);
