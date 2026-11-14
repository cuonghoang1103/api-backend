/**
 * obj-06-3 — Object Storage · Chapter 6 · 3 "Orphans: rows without objects, objects without rows" (deck video + web, 14/11/2026).
 * Bài web: os-6-3-orphans. Output THẬT (scratchpad/obj/demo/n6-3.txt · MinIO RELEASE.2026-11-12 · SDK v3 3.1071.0 · node:sqlite · Node 22.23.3, Mac):
 * seed: DB 19 row, bucket 20 object + 1 tệp đang tải; reconcile.mjs (MaxKeys 8) ⇒ 3 trang LIST · 3 câu SQL · bỏ qua 1 tệp mới hơn 5 s ·
 * A (object không row) 4 · B (row không object) 3 ⇒ --that: xoá 4 object (0 lỗi) + 3 row ⇒ chạy lại 0/0; head-object chỉ có LastModified/Size/Metadata;
 * kho: PendingUpload (status PENDING/CONFIRMED/EXPIRED, expiresAt) + cron '0 *&#47;4 * * *' (take 50, kiểm keyBelongsToUser — sửa 14/11).
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n6-3:file:seed.mjs": "// seed.mjs — dựng \"ứng dụng\" thu nhỏ: SQLite (bảng attachment = DB nói có gì) + bucket kho-mc (MinIO) rồi CỐ Ý tạo lệch như đời thật:\n//   A: 4 row bị xoá trong DB nhưng lệnh xoá object \"thất bại\"  ⇒ object không có row (tính tiền âm thầm)\n//   B: 3 row được ghi nhưng PUT hỏng                           ⇒ row không có object (ảnh vỡ cho người dùng)\n//   + 1 object vừa tải lên, row CHƯA kịp ghi (đang tải dở)      ⇒ KHÔNG được coi là mồ côi\nimport { DatabaseSync } from 'node:sqlite';\nimport { S3Client, PutObjectCommand, CreateBucketCommand } from '@aws-sdk/client-s3';\nconst s3 = new S3Client({ endpoint: process.env.OBJ_ENDPOINT, region: 'us-east-1', forcePathStyle: true });\nawait s3.send(new CreateBucketCommand({ Bucket: 'kho-mc' })).catch(() => {});\nconst db = new DatabaseSync('app.db');\ndb.exec('DROP TABLE IF EXISTS attachment; CREATE TABLE attachment (id INTEGER PRIMARY KEY, user_id INT, r2_key TEXT UNIQUE)');\nconst put = (k) => s3.send(new PutObjectCommand({ Bucket: 'kho-mc', Key: k, Body: 'x'.repeat(1024) }));\nfor (let i = 1; i <= 20; i++) { const k = `attach/u${40 + (i % 3)}/1794600000${String(i).padStart(3, '0')}-a${i}.pdf`; await put(k); db.prepare('INSERT INTO attachment (user_id, r2_key) VALUES (?, ?)').run(40 + (i % 3), k); }\ndb.exec(\"DELETE FROM attachment WHERE id IN (3, 7, 11, 15)\");                                   // A\nfor (const i of [21, 22, 23]) db.prepare('INSERT INTO attachment (user_id, r2_key) VALUES (?, ?)').run(42, `attach/u42/1794600000${i}-loi${i}.pdf`); // B\nconsole.log(`DB: ${db.prepare('SELECT count(*) n FROM attachment').get().n} row · bucket: 20 object (chưa kể tệp đang tải)`);\n",
 "n6-3:file:reconcile.mjs": "// reconcile.mjs <prefix> [--that] — đối soát DB ↔ bucket theo LÔ: mỗi trang ListObjectsV2 (ở đây MaxKeys 8 để thấy phân trang) ⇒ MỘT câu SQL IN (…).\n// Mồ côi A (object không row) chỉ tính khi object CŨ hơn GRACE giây — tệp vừa tải lên có thể chưa kịp ghi row. Có --that mới xoá.\nimport { DatabaseSync } from 'node:sqlite';\nimport { S3Client, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3';\nconst s3 = new S3Client({ endpoint: process.env.OBJ_ENDPOINT, region: 'us-east-1', forcePathStyle: true });\nconst db = new DatabaseSync('app.db');\nconst [Prefix, that] = process.argv.slice(2), GRACE = Number(process.env.GRACE ?? 86400);\nconst thay = new Set(), A = [];\nlet ContinuationToken, trang = 0, moi = 0;\ndo {\n  const r = await s3.send(new ListObjectsV2Command({ Bucket: 'kho-mc', Prefix, MaxKeys: 8, ContinuationToken }));\n  const keys = (r.Contents ?? []).map((o) => o.Key); trang++;\n  const biet = new Set(db.prepare(`SELECT r2_key FROM attachment WHERE r2_key IN (${keys.map(() => '?').join(',') || \"''\"})`).all(...keys).map((x) => x.r2_key));\n  for (const o of r.Contents ?? []) {\n    thay.add(o.Key);\n    if (biet.has(o.Key)) continue;\n    if ((Date.now() - o.LastModified.getTime()) / 1000 < GRACE) { moi++; continue; }\n    A.push(o.Key);\n  }\n  ContinuationToken = r.NextContinuationToken;\n} while (ContinuationToken);\nconst B = db.prepare('SELECT r2_key FROM attachment WHERE r2_key LIKE ?').all(Prefix + '%').map((x) => x.r2_key).filter((k) => !thay.has(k));\nconsole.log(`${trang} trang LIST · ${trang} câu SQL · bỏ qua ${moi} tệp mới hơn ${GRACE} s`);\nconsole.log(`mồ côi A (object, không row): ${A.length}`); for (const k of A) console.log('  A', k);\nconsole.log(`mồ côi B (row, không object): ${B.length}`); for (const k of B) console.log('  B', k);\nif (that && A.length) { const r = await s3.send(new DeleteObjectsCommand({ Bucket: 'kho-mc', Delete: { Objects: A.map((Key) => ({ Key })) } }));\n  console.log(`đã xoá ${r.Deleted?.length ?? 0} object · lỗi ${r.Errors?.length ?? 0}`); }\nif (that && B.length) { db.prepare(`DELETE FROM attachment WHERE r2_key IN (${B.map(() => '?').join(',')})`).run(...B); console.log(`đã xoá ${B.length} row hỏng`); }\n",
 "n6-3:mo": "$ node --no-warnings seed.mjs\nDB: 19 row · bucket: 20 object (chưa kể tệp đang tải)\n$ aws s3 cp - s3://kho-mc/attach/u42/…-dang-tai.pdf      # một người dùng đang tải lên, row chưa ghi\nđang tải: attach/u42/…-dang-tai.pdf\n$ GRACE=5 node reconcile.mjs attach/        # lab: ân hạn 5 giây (thật: 24 giờ)\n3 trang LIST · 3 câu SQL · bỏ qua 1 tệp mới hơn 5 s\nmồ côi A (object, không row): 4\n  A attach/u40/1794600000003-a3.pdf\n  A attach/u40/1794600000015-a15.pdf\n  A attach/u41/1794600000007-a7.pdf\n  A attach/u42/1794600000011-a11.pdf\nmồ côi B (row, không object): 3\n  B attach/u42/179460000021-loi21.pdf\n  B attach/u42/179460000022-loi22.pdf\n  B attach/u42/179460000023-loi23.pdf\n$ GRACE=5 node reconcile.mjs attach/ --that\nđã xoá 4 object · lỗi 0\nđã xoá 3 row hỏng\n$ GRACE=5 node --no-warnings reconcile.mjs attach/ | tail -2\nmồ côi A (object, không row): 0\nmồ côi B (row, không object): 0",
 "n6-3:so": "$ # Vì sao luật lifecycle không làm được việc này: nó chỉ thấy tuổi + prefix của object, không thấy DB\n$ aws s3api head-object --bucket kho-mc --key attach/u41/…-a1.pdf --query '{LM:LastModified,Size:ContentLength,Meta:Metadata}'\n{\"LastModified\":\"2026-11-14T09:44:49+00:00\",\"Size\":1024,\"Metadata\":{}}\n$ # Mẫu của kho: bảng \"sổ chờ\" PendingUpload — ghi row TRƯỚC, hạn 24 giờ, cron 4 giờ một lần dọn row quá hạn chưa CONFIRMED\n$ grep -n \"model PendingUpload\" -A12 prisma/schema.prisma | grep -E \"status|expiresAt|PENDING|CONFIRMED|EXPIRED\"\n2193-  status    String   @default(\"PENDING\") @map(\"status\") @db.VarChar(20)\n2194-  // PENDING = uploaded to R2, waiting to be linked to a post\n2195-  // CONFIRMED = successfully linked to a SocialMedia row\n2196-  // EXPIRED = cron job marked as orphaned, R2 object deleted\n2197-  expiresAt DateTime @updatedAt @map(\"expires_at\")\n$ grep -n \"cron.schedule('0 \\*/4\" -A0 src/services/cron.service.ts; grep -n \"take: 50\\|keyBelongsToUser(upload\" src/services/cron.service.ts\n411:  cron.schedule('0 */4 * * *', async () => {\n426:        take: 50, // Process in batches to avoid overwhelming R2\n440:          if (!keyBelongsToUser(upload.r2Key, upload.userId)) {"
};
/*HET_DU_LIEU*/
import { lamDeck, tn, cmp, box, two, steps, kw, ts, seq } from './_obj-chung.mjs';

export const deck = { key: 'obj-06-3', code: 'OBJ 6.3', title: '6.3 — Orphans: rows without objects, objects without rows', sub: 'Chapter 6 · Lesson 6.3' };
const O = (k) => { const v = DU_LIEU[`n6-3:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const bo = (s) => s.split('\n').filter((l) => !/^\$ #/.test(l)).join('\n');
const MO = bo(O('mo')), SO = bo(O('so'));
const [MO1, MO2] = [MO.split('\n$ GRACE=5 node reconcile.mjs attach/ --that')[0], '$ GRACE=5 node reconcile.mjs attach/ --that' + MO.split('\n$ GRACE=5 node reconcile.mjs attach/ --that')[1]];
const [SO1, SO2] = [SO.split('\n$ grep')[0], '$ grep' + SO.split('\n$ grep').slice(1).join('\n$ grep')];

export const S = [
  { cover: true, nhan: 'Chapter 6 · Lesson 6.3', t: 'Orphans: rows without objects,<br>objects without rows', sub: 'Two systems, no transaction — find the drift in batches, leave in-flight uploads alone, and prevent it with a ledger',
    en: 'Chapter six, lesson three: orphans. Rows without objects, objects without rows. Two systems and no transaction: find the drift in batches, leave in-flight uploads alone, and prevent it with a ledger.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The two kinds of orphan — one silent, one loud</li>
    <li>Why no lifecycle rule can find them</li>
    <li>A reconcile job: one SQL query per page of objects</li>
    <li>The grace period that protects uploads in flight</li>
    <li>Prevention: the pending-upload ledger this repo uses</li></ul>`,
    en: 'Takeaways: the two kinds of orphan; why lifecycle cannot find them; a reconcile job with one query per page; the grace period for uploads in flight; and the pending-upload ledger this repo uses.' },
  { t: 'Two directions of drift', body: cmp(['', 'A — object without a row', 'B — row without an object'], [
      ['how it happens', 'DB delete succeeded, bucket delete failed or was never called', 'row written first, the PUT failed'],
      ['what it costs', 'storage nobody can reach — <b>silent</b>', 'broken images, 404s, tickets — <b>loud</b>'],
      ['how to find it', 'list the bucket, ask the DB "do you know this key?"', 'list the DB, ask the bucket "do you have this key?"'],
      ['usual fix', 'delete the object (after a grace period)', 'delete or repair the row'],
    ], { fs: 17 }) + box('Same root', 'Writing to two systems (database + bucket) is not atomic. Any crash between the two writes leaves one of these behind.', 'lam'),
    en: 'Two directions of drift. A: the object exists, the row does not; it costs storage silently. B: the row exists, the object does not; users see broken images. Same root: writing to a database and a bucket is not atomic.' },
  { t: 'Why a lifecycle rule cannot do this', body: tn(SO1, { fs: 15, wrap: 120 }) + two(box('What a rule can see', 'Per object: key, prefix, age, size, storage class. Measured: HEAD returns <code>LastModified</code>, <code>ContentLength</code>, <code>Metadata</code> — nothing about who uses it.', 'lam'),
      box('What it cannot', '"Is this key still referenced?", "was the user deleted?", "is this the current avatar?" — only your database knows. When a user is deleted, your code must delete the objects.', 'do2')),
    en: 'Why a lifecycle rule cannot do this. A rule only sees what HEAD shows: last modified, size, metadata. It cannot ask whether a key is still referenced. Only your database knows that.' },
  { t: 'The lab: an app that drifted', body: seq(['app', 'SQLite (DB)', 'MinIO (bucket)'], [
      [0, 1, 'INSERT 20 rows'], [0, 2, 'PUT 20 objects', '#2563eb'],
      [0, 1, 'DELETE 4 rows', '#c0392b'], [0, 2, '(delete objects "failed")  ⇒ A × 4', '#c2410c', true],
      [0, 1, 'INSERT 3 rows', '#c0392b'], [0, 2, '(PUT failed)  ⇒ B × 3', '#c2410c', true],
      [0, 2, 'PUT 1 object — row not written yet (upload in flight)', '#1f8a3b'],
    ], { w: 1110, rh: 42, fs: 17 }) + box('Seeded on purpose', '<code>seed.mjs</code> creates exactly the failures real apps produce, plus one upload that is still in progress — the one a careless job would delete.', 'lam'),
    en: 'The lab: an app that drifted. Twenty rows and twenty objects; four rows deleted while their objects stayed; three rows whose upload failed; and one object uploaded just now whose row is not written yet.' },
  { t: 'Reconcile in batches — one query per page', body: ts(`do {   // reconcile.mjs (core) — full file in the web lesson
  const r = await s3.send(new ListObjectsV2Command({
    Bucket, Prefix, MaxKeys: 8, ContinuationToken }));
  const keys = (r.Contents ?? []).map((o) => o.Key);
  const qs = keys.map(() => '?').join(',');                       // ONE query per page
  const known = new Set(db.prepare(\`SELECT r2_key FROM attachment WHERE r2_key IN (\${qs})\`)
    .all(...keys).map((x) => x.r2_key));
  for (const o of r.Contents ?? []) {
    seen.add(o.Key);
    if (known.has(o.Key)) continue;
    if (ageSeconds(o) < GRACE) { young++; continue; }   // mid-upload?
    A.push(o.Key);                                       // object, no row
  }
  ContinuationToken = r.NextContinuationToken;
} while (ContinuationToken);
const B = rowsUnder(Prefix).filter((k) => !seen.has(k));   // row, no object`, { fs: 13 }) +
      box('', '<b>One query per page</b> (≤ 1,000 keys on S3/R2), never one per object. MaxKeys 8 here: 21 objects ⇒ 3 pages ⇒ 3 queries.', 'lam'),
    en: 'Reconcile in batches. List a page of objects, ask the database about the whole page in one query, skip anything younger than the grace period, and collect the rest as orphans A. Rows whose keys never appeared in the listing are orphans B.' },
  { t: 'Measured: dry run, then fix, then zero', body: tn(MO1, { fs: 14, wrap: 130 }) + tn(MO2, { fs: 14, wrap: 130 }),
    en: 'Measured. The dry run: three pages, three queries, one fresh file skipped, four orphans A, three orphans B. With the flag: four objects deleted with zero errors, three broken rows removed. Run again: zero and zero.' },
  { t: 'The grace period, and the two-run rule', body: two(box('The race', 'An upload in progress has its object <b>before</b> its row. A reconcile that runs in that moment sees "object without a row". Measured: the 1-second-old file was skipped only because of <code>GRACE</code>.', 'do2'),
      box('Rules for real jobs', '<ul><li>Grace of 24–48 h on <code>LastModified</code></li><li>Run 1 only <b>logs</b> candidates; run 2 the next day deletes keys found <b>both</b> times</li><li>Cap deletions per run; abort if the count looks absurd</li></ul>', 'lam')) +
      box('Why the cap', 'If the database query silently returns nothing (wrong schema, wrong environment), <b>every</b> object looks orphaned. A cap turns that bug into an alert instead of an empty bucket.', ''),
    en: 'The grace period and the two-run rule. An upload in progress has its object before its row; without the grace period the fresh file would have been deleted. Real jobs: grace of a day or two, log on the first run, delete on the second, and cap deletions so a broken query cannot empty the bucket.' },
  { t: 'Prevention: the pending-upload ledger', body: tn(SO2, { fs: 15, wrap: 120 }) + two(box('How this repo does it', 'A row in <code>PendingUpload</code> is written with the upload and an <code>expiresAt</code>; <code>PENDING</code> becomes <code>CONFIRMED</code> when the post is saved. A cron every 4 hours takes 50 expired PENDING rows, deletes their objects, marks them <code>EXPIRED</code>.', 'lam'),
      box('Why it works', 'The ledger turns "object without a row" into "row with a status". Cleanup asks the database, not the bucket — no full listing needed.', '')),
    en: 'Prevention: a ledger. This repo writes a pending-upload row with an expiry; it becomes confirmed when the post is saved, and a cron every four hours cleans fifty expired pending rows at a time. The database now knows about every object.' },
  { t: 'Real life, what-if, and the attacker\'s view', body: two(box('Real life', '<ul><li>A user deletes their account: rows go, but avatars and attachments stay unless the code deletes them.</li><li>A post editor uploads a video, the user closes the tab before posting: the ledger expires it.</li></ul>', 'lam'),
      box('What if the reconcile deletes by row?', 'Fixing orphans B by re-uploading or deleting rows is safe; deleting <b>objects</b> named in rows is not, unless the row is proven to own that key.', '')) +
      box('The attacker\'s view', 'A cleanup job that deletes whatever key a row names will delete <b>someone else\'s</b> file if a user can get that key into their own row. Check ownership before deleting (key prefix = owner, as in <code>buildKey</code>) — this repo added exactly that check to its cleanup cron on 14/11/2026.', 'do2'),
    en: 'Real life: deleted accounts leave avatars behind; abandoned post drafts leave videos. The attacker\'s view: a cleanup job that deletes whatever key a row names will delete someone else\'s file if a user can put that key in their row. Check ownership first; this repo added that check on the fourteenth of November.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Orphan A', 'object without a row — silent'), kw('Orphan B', 'row without an object — loud'), kw('Reconcile', 'compare DB and bucket'),
      kw('Batch query', 'one SQL per listed page'), kw('Grace period', 'skip young objects'), kw('Two-run rule', 'log, then delete'),
      kw('Deletion cap', 'a broken query must not empty the bucket'), kw('Ledger', 'PendingUpload: PENDING → CONFIRMED / EXPIRED'), kw('Ownership check', 'key belongs to the row\'s user'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: orphan A, orphan B, reconcile, batch query, grace period, the two-run rule, a deletion cap, the ledger, and the ownership check.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Seed a DB and a bucket, then break them both ways on purpose',
      'Write the reconcile: list pages, one query per page',
      'Add a grace period; upload a file during the run',
      'Make deletion a second, flagged step with a cap',
      'Sketch a ledger table for your own uploads',
    ]), box('Keep these', '<ul><li>Two systems, no transaction</li><li>Lifecycle cannot see the DB</li><li>Batch the queries</li><li>Grace + two runs + cap</li><li>Check ownership before deleting</li></ul>', 'lam'), ''),
    en: 'Your turn: seed and break a database and a bucket, write the batched reconcile, add a grace period, make deletion a capped second step, and sketch a ledger for your own uploads.' },
];
export const slides = lamDeck({ chuong: 'Chapter 6 — Lifecycle rules and cleanup', bai: '6.3 Orphans' }, S);
