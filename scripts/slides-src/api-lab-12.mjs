/**
 * api-lab-12 — API Design · Chapter 12 · Lab 12 "Move device issues to PostgreSQL" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: s12-du-an-cuoi-khoa.mjs › api-12-9-lab. Output = chạy thật lab/grade-lab12.mjs trên hai instance (bản khởi đầu, rồi lời giải).
 */
import { lamDeck, sql, http, two, box, cards } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 12 — Capstone', bai: 'Lab 12' };

export const deck = { key: 'api-lab-12', code: 'API Lab 12', title: 'Lab 12 — Issues on PostgreSQL', sub: 'Migration, store, proof on two instances' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'Lab 12: issues on PostgreSQL', sub: 'The resource left behind on purpose —<br>graded on two instances.' },

  { t: 'The starter scores 0', giua: true, body: http(`$ node lab/grade-lab12.mjs                         # starter: issues still in each instance's RAM
✗ 0/1  bảng issues + index duy nhất có điều kiện … — chưa có bảng issues (đã chạy npm run db:migrate?)
✗ 0/2  báo hỏng tạo ở A đọc được ở B (cùng nội dung) — GET iss_1 ở B: 404
✗ 0/2  6 báo hỏng CÙNG tiêu đề gửi đồng thời vào A và B … — nhận 201,201,409,409,409,409
✗ 0/1  báo hỏng HIGH ở A ⇒ thiết bị MAINTENANCE khi đọc ở B — dev_3 ở B: AVAILABLE
✗ 0/2  hai quản lý cùng resolve với cùng If-Match (một ở A, một ở B) … — nhận 200,200
✗ 0/1  dữ liệu nằm trong PostgreSQL … — relation "issues" does not exist
✗ 0/1  GET /v2/issues phân trang con trỏ xen kẽ A/B … — relation "issues" does not exist
TỔNG: 0/10`, { sm: true, wrap: true }) + box('Every failure is a lesson of this chapter', 'no table (12.1–12.2) · invisible on the other instance and two winners (12.3) · device status in one process’s memory (12.3) · two managers both “win” (12.4).', 'do2') },

  { t: 'Three tasks', giua: true, body: cards([
    ['A · migrations/004_issues.sql', 'seq + generated id (iss_1…), version, timestamptz(3), FK to devices and users'],
    ['B · src/store/issues-pg.js', 'same 5 functions as issues-memory.js; the routes do not change'],
    ['C · prove it', 'npm run test:pg green, then node lab/grade-lab12.mjs: 10/10'],
  ]) + two(box('Rule in the database', '“One OPEN issue per device and title, compared like a reader” ⇒ <code class="i">UNIQUE (device_id, title_key) WHERE status = \'OPEN\'</code>. title_key = fold(title) from the app — unaccent() is not IMMUTABLE.', 'lam'), box('Rules in the code', 'HIGH ⇒ device MAINTENANCE in the <b>same transaction</b> · resolve = one <code class="i">UPDATE … WHERE status = \'OPEN\' AND version = $n</code> · keyset on (severity_rank, seq).', 'lam')) },

  { t: 'Rubric — 10 points', giua: true, body: `<table class="t lon"><tr><th>Pts</th><th>The grader checks</th></tr>
<tr><td>1</td><td><code class="i">issues</code> exists with a UNIQUE index whose predicate mentions OPEN</td></tr>
<tr><td>2</td><td>an issue created on A reads back on B, same content</td></tr>
<tr><td>2</td><td>6 reports, one title, sent at once to A and B ⇒ one 201, five 409 DUPLICATE_ISSUE + existing</td></tr>
<tr><td>1</td><td>a HIGH report on A ⇒ the device is MAINTENANCE when read on B</td></tr>
<tr><td>2</td><td>two managers resolve with the same If-Match, A and B ⇒ one 200, one 412</td></tr>
<tr><td>1</td><td>the row is in PostgreSQL (the grader SELECTs it)</td></tr>
<tr><td>1</td><td>GET /v2/issues, 5 per page, alternating A and B ⇒ every row once</td></tr></table>` },

  { t: 'Reference solution: 10/10', giua: true, body: two(sql(`CREATE UNIQUE INDEX issues_open_title
  ON issues (device_id, title_key) WHERE status = 'OPEN';
-- severity_rank smallint GENERATED ALWAYS AS
--   (CASE severity WHEN 'LOW' THEN 1 WHEN 'MEDIUM' THEN 2 ELSE 3 END) STORED

return await tx(async (c) => {
  const row = …INSERT INTO issues … RETURNING *…;
  if (severity === 'HIGH') await c.query("UPDATE devices
    SET status = 'MAINTENANCE', version = version + 1 WHERE id = $1", [deviceId]);
  return toIssue(row);
});  // 23505 on issues_open_title ⇒ 409 + existing`, { lang: 'plaintext', sm: true }), http(`$ npm run -s db:migrate && SEED_ISSUES=60 npm run -s db:seed
  áp 004_issues.sql (5 ms)
seed labflow_lab12: … issues 60 (24 ms)
$ node lab/grade-lab12.mjs
✓ 1/1  … — issues_open_title
✓ 2/2  … — iss_61
✓ 2/2  … — 201,409,409,409,409,409
✓ 1/1  … — dev_3 MAINTENANCE
✓ 2/2  … — ETag "iss_61-v1": 200,412
✓ 1/1  … — iss_61: RESOLVED, version 2
✓ 1/1  … — 63 báo hỏng / 13 trang
TỔNG: 10/10`, { sm: true, wrap: true }), 'r46') },

  { t: 'Hand-in and the traps', giua: true, to: true, body: two(box('Hand in', '004_issues.sql · issues-pg.js · the grader output (10/10) · npm run test:pg output · three sentences: which rule lives in the database, which in a transaction, which in a WHERE clause — and why.', 'xanh'), box('Traps', 'unaccent() in an index ⇒ refused (not IMMUTABLE) · forgetting <code class="i">version = version + 1</code> on the device ⇒ a stale ETag overwrites MAINTENANCE · comparing severity by name ⇒ HIGH &lt; LOW &lt; MEDIUM.', 'do2')) },
]);
