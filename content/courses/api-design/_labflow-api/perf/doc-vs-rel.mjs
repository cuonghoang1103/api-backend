// perf/doc-vs-rel.mjs — bài 9.5: cùng câu hỏi của API, hỏi kho quan hệ và kho tài liệu (JSONB) — đo trên PostgreSQL 18
import pg from 'pg';
const db = new pg.Client(process.env.PGURL ?? 'postgres://labflow@localhost:55432/labflow');
await db.connect();
const median = (a) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)];
async function bench(label, n, fn) {
  const t = [];
  for (let i = 0; i < n; i++) { const a = performance.now(); await fn(i); t.push(performance.now() - a); }
  console.log(`${label.padEnd(58)} median ${median(t).toFixed(3).padStart(7)} ms`);
}
const lab = (i) => 1 + ((i * 7919) % 1000);
// 1) GET /labs/{id}?include=devices,openIssues — màn hình chi tiết một phòng
await bench('chi tiết 1 phòng · quan hệ: JOIN + json_agg', 500, (i) => db.query(`
  SELECT l.id, l.name, json_agg(json_build_object('id', d.id, 'status', d.status, 'openIssues',
    (SELECT count(*) FROM issues_r x WHERE x.device_id = d.id AND x.status = 'OPEN')) ORDER BY d.id) AS devices
  FROM labs_r l JOIN devices_r d ON d.lab_id = l.id WHERE l.id = $1 GROUP BY l.id`, [lab(i)]));
await bench('chi tiết 1 phòng · tài liệu: một dòng theo khoá chính', 500, (i) => db.query('SELECT doc FROM labs_d WHERE id = $1', [lab(i)]));
// 2) PATCH /devices/{id} {status} — sửa MỘT thiết bị
await bench('sửa 1 thiết bị · quan hệ: UPDATE một dòng', 300, (i) => db.query(`UPDATE devices_r SET status = 'AVAILABLE' WHERE id = $1`, [i * 97 + 5]));
await bench('sửa 1 thiết bị · tài liệu: tìm vị trí trong mảng + jsonb_set', 300, (i) => db.query(`
  UPDATE labs_d SET doc = jsonb_set(doc, ARRAY['devices', (SELECT (ord - 1)::text FROM jsonb_array_elements(doc->'devices') WITH ORDINALITY e(v, ord)
    WHERE (v->>'id')::int = $2), 'status'], '"AVAILABLE"') WHERE id = $1`, [Math.floor((i * 97 + 4) / 30) + 1, i * 97 + 5]));
// 3) GET /devices?status=MAINTENANCE — câu hỏi XUYÊN mọi phòng
await bench('mọi thiết bị đang bảo trì · quan hệ: chỉ mục status', 50, () => db.query(`SELECT id, lab_id FROM devices_r WHERE status = 'MAINTENANCE'`));
await bench('mọi thiết bị đang bảo trì · tài liệu: GIN @> rồi bóc mảng', 50, () => db.query(`
  SELECT d.id, (e.v->>'id')::int AS device FROM labs_d d, jsonb_array_elements(d.doc->'devices') e(v)
  WHERE d.doc @> '{"devices":[{"status":"MAINTENANCE"}]}' AND e.v->>'status' = 'MAINTENANCE'`));
// 4) Một phòng lab có lịch sử báo hỏng KHÔNG GIỚI HẠN — 20.000 báo hỏng nhúng trong tài liệu
await db.query(`DELETE FROM labs_d WHERE id = 9999`);
await db.query(`INSERT INTO labs_d VALUES (9999, jsonb_build_object('id', 9999, 'devices', jsonb_build_array(jsonb_build_object('id', 999999, 'issues',
  (SELECT jsonb_agg(jsonb_build_object('id', g, 'title', 'Issue ' || g, 'status', 'RESOLVED')) FROM generate_series(1, 20000) g)))))`);
await bench('phòng có 20.000 báo hỏng · tài liệu: đọc cả tài liệu', 50, () => db.query('SELECT doc FROM labs_d WHERE id = 9999'));
await bench('20 báo hỏng mới nhất · quan hệ: chỉ mục + LIMIT 20', 50, () => db.query('SELECT * FROM issues_r WHERE device_id = 7 ORDER BY id DESC LIMIT 20'));
const { rows: [big] } = await db.query('SELECT length(doc::text) AS json, pg_column_size(doc) AS stored FROM labs_d WHERE id = 9999');
console.log(`tài liệu phòng 9999: ${big.json} byte JSON (${big.stored} byte lưu) — mọi lần đọc/sửa đều kéo cả khối`);
const { rows: [s] } = await db.query(`SELECT pg_column_size(doc) AS stored, length(doc::text) AS json FROM labs_d WHERE id = 1`);
console.log(`một tài liệu phòng lab: ${s.json} byte JSON, lưu ${s.stored} byte sau nén — sửa 1 thiết bị là ghi lại CẢ tài liệu`);
await db.end();
