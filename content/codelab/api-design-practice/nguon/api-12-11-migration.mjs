/** API Design · 12.2 — Migration, ràng buộc, seed: bộ chạy có checksum + advisory lock, DDL khoá bảng (output thật bài 12.2: src/migrate.js, perf/migration-locks.mjs). */
import { doiDau, KHOA, cs, q, tn, jsBai, nguon, goi } from './_api.mjs';

const E1 = cs({
  ten: 'Migrations 1 — What the runner refuses, measured', kho: 'EASY', phut: 8,
  en: 'Facts from lesson 12.2: LabFlow’s 60-line migration runner and the lock test on 1,000,000 rows.',
  vi: 'Những điều từ bài 12.2: bộ chạy migration 60 dòng của LabFlow và phép thử khoá trên 1.000.000 dòng.',
  cau: [
    q('c1', ['Someone adds a comment line to 002_outbox.sql after it was applied. What does npm run db:migrate do?', 'Ai đó thêm một dòng chú thích vào 002_outbox.sql sau khi nó đã áp. npm run db:migrate làm gì?'],
      ['Stops with “checksum b0c90a7db3f1 ⇒ 302e7ffe0ea0” and exit code 1', 'Re-applies 002 inside a transaction, since a comment cannot change the schema', 'Ignores the edit, because only new files are ever read by the runner', 'Rolls back 002 and 003 automatically, then applies the edited version'],
      ['Applied history is immutable: revert the edit and write 005_…sql.', 'Lịch sử đã áp là bất biến: hoàn tác chỗ sửa và viết 005_…sql.']),
    q('c2', ['Two instances start at the same moment and both run the migrations. What happened in the measured run?', 'Hai instance khởi động cùng lúc và cả hai chạy migration. Lần đo cho kết quả gì?'],
      ['A applied all four files; B waited 62 ms on the advisory lock, then found nothing to do', 'Both applied 001 at once and the second failed with “relation already exists”', 'B applied the files A had not reached yet, splitting the work between them', 'PostgreSQL rejected the second connection because of max_connections'],
      ['pg_advisory_lock serialises runners across machines; the history table makes the second run a no-op.', 'pg_advisory_lock xếp hàng các bộ chạy kể cả khác máy; bảng lịch sử biến lần chạy thứ hai thành không làm gì.']),
    q('c3', ['On 1,000,000 rows, which statement kept an ordinary INSERT waiting for over 3 seconds?', 'Trên 1.000.000 dòng, câu lệnh nào giữ một INSERT bình thường chờ hơn 3 giây?'],
      ['ADD COLUMN token text DEFAULT md5(random()::text) — a volatile default rewrites the table', 'ADD COLUMN seats int NOT NULL DEFAULT 1 — every row has to be updated', 'CREATE INDEX CONCURRENTLY on (user_id, start_at) — it locks the whole table', 'ADD CONSTRAINT … NOT VALID — the constraint is checked on every existing row'],
      ['Constant default: 1 ms (catalogue only). Volatile default and plain CREATE INDEX: ~3 s of blocked writes. CONCURRENTLY: 1 ms.', 'Mặc định hằng số: 1 ms (chỉ catalogue). Mặc định thay đổi và CREATE INDEX thường: ~3 s chặn ghi. CONCURRENTLY: 1 ms.']),
    q('c4', ['You need to rename a column used by every instance. What is the safe plan during a rolling deploy?', 'Bạn cần đổi tên một cột mọi instance đang dùng. Kế hoạch an toàn khi triển khai cuốn chiếu là gì?'],
      ['Add the new column, write both, backfill, read the new one, drop the old one in a later release', 'ALTER TABLE … RENAME COLUMN in the same migration as the new code', 'Stop all instances, rename, then start the new version as fast as possible', 'Rename the column and add a view with the old name for one release'],
      ['Old and new code run together during a deploy — expand, then contract.', 'Mã cũ và mới chạy cùng lúc khi triển khai — mở rộng trước, thu gọn sau.']),
  ],
  goiY: [['Think of the history table as an append-only log.', 'Coi bảng lịch sử là nhật ký chỉ ghi thêm.'], ['Ask whether the statement must touch every row.', 'Hỏi: câu lệnh có phải đụng vào mọi dòng không?']],
  loi: [['Editing an applied migration and forcing it through.', 'Sửa migration đã áp rồi ép chạy.'], ['Testing DDL only on an empty laptop database.', 'Chỉ thử DDL trên CSDL rỗng ở máy mình.']],
  tns: [tn('checksum', 'mã kiểm'), tn('advisory lock', 'khoá tư vấn'), tn('expand/contract', 'mở rộng/thu gọn')],
  kn: ['databases', 'deployment'],
});

function planMigrations(files, applied) {
  const done = new Map(applied.map((a) => [a.version, a.checksum]));
  const ok = files.filter((f) => /^\d{3}_[a-z0-9_]+\.sql$/.test(f.name)).sort((a, b) => (a.name < b.name ? -1 : 1));
  const edited = ok.filter((f) => done.has(f.name) && done.get(f.name) !== f.sum).map((f) => f.name);
  if (edited.length) return { error: `EDITED: ${edited.join(', ')}`, toApply: [] };
  return { error: null, toApply: ok.filter((f) => !done.has(f.name)).map((f) => f.name) };
}
const FILES = [{ name: '002_outbox.sql', sum: 'b0c9' }, { name: '001_core.sql', sum: 'ed7a' }, { name: '003_shared_state.sql', sum: 'c47e' }, { name: 'notes.txt', sum: '0000' }];
const E2 = jsBai({
  ten: 'Migrations 2 — Write planMigrations(files, applied): what will run', kho: 'MEDIUM', phut: 15,
  en: `<p>Model the runner’s plan. <code>files</code> are <code>{ name, sum }</code> found in <code>migrations/</code>; only names like <code>001_core.sql</code> (three digits, underscore, lowercase letters/digits/underscores, <code>.sql</code>) count. <code>applied</code> are <code>{ version, checksum }</code> rows of <code>schema_migrations</code>. If any applied file’s sum differs, return <code>{ error: 'EDITED: a.sql, b.sql', toApply: [] }</code> (names in order). Otherwise <code>{ error: null, toApply: [names not yet applied, in order] }</code>.</p>`,
  vi: `<p>Mô phỏng kế hoạch của bộ chạy. <code>files</code> là <code>{ name, sum }</code> trong <code>migrations/</code>; chỉ tính tên dạng <code>001_core.sql</code> (ba chữ số, gạch dưới, chữ thường/số/gạch dưới, <code>.sql</code>). <code>applied</code> là các dòng <code>{ version, checksum }</code> của <code>schema_migrations</code>. Tệp đã áp nào có sum khác ⇒ trả <code>{ error: 'EDITED: a.sql, b.sql', toApply: [] }</code> (tên theo thứ tự). Ngược lại <code>{ error: null, toApply: [tên chưa áp, theo thứ tự] }</code>.</p>`,
  dauVao: ['files — {name, sum}[]; applied — {version, checksum}[]', 'files — {name, sum}[]; applied — {version, checksum}[]'], dauRa: ['{ error, toApply }', '{ error, toApply }'],
  goiY: [['Sort by name: zero-padded numbers sort correctly as strings.', 'Sắp theo tên: số có đệm 0 sắp đúng như chuỗi.'], ['Check edits before planning anything.', 'Kiểm chỗ sửa trước khi lập kế hoạch.']],
  loi: [['Running files in directory order instead of name order.', 'Chạy theo thứ tự thư mục thay vì thứ tự tên.'], ['Applying new files although an old one was edited.', 'Vẫn áp tệp mới dù một tệp cũ đã bị sửa.']],
  gt: ['Same rules as src/migrate.js (and Flyway): an edited history stops everything, otherwise only the missing files run, in order — so running twice does nothing.', 'Cùng luật với src/migrate.js (và Flyway): lịch sử bị sửa thì dừng tất cả, ngược lại chỉ chạy các tệp còn thiếu, theo thứ tự — nên chạy hai lần không làm gì.'],
  kn: ['databases'], tns: [tn('schema_migrations', 'bảng lịch sử migration')],
  dau: `/** which migrations will run? */
function planMigrations(files, applied) {
  // Write your solution here
  const done = applied.map((a) => a.version);
  return { error: null, toApply: files.map((f) => f.name).filter((n) => !done.includes(n)) };
}
`,
  giai: '// Reference solution\n' + nguon(planMigrations),
  cases: [
    { goi: goi('planMigrations', FILES, []), moTa: ['Fresh database', 'CSDL mới'] },
    { goi: goi('planMigrations', FILES, [{ version: '001_core.sql', checksum: 'ed7a' }]), moTa: ['One already applied', 'Đã áp một tệp'] },
    { goi: goi('planMigrations', FILES, [{ version: '001_core.sql', checksum: 'ed7a' }, { version: '002_outbox.sql', checksum: '302e' }]), an: true },
    { goi: goi('planMigrations', FILES, [{ version: '001_core.sql', checksum: 'ed7a' }, { version: '002_outbox.sql', checksum: 'b0c9' }, { version: '003_shared_state.sql', checksum: 'c47e' }]), an: true },
  ],
});

function ddlRisk(sql) {
  const s = sql.trim().replace(/\s+/g, ' ').toUpperCase();
  if (/^CREATE (UNIQUE )?INDEX CONCURRENTLY/.test(s)) return 'no-transaction';
  if (/^CREATE (UNIQUE )?INDEX/.test(s)) return 'blocks-writes';
  const m = /^ALTER TABLE \S+ ADD COLUMN .* DEFAULT (.+)$/.exec(s);
  if (m) return /\(/.test(m[1]) ? 'rewrite' : 'safe';
  return 'review';
}
const E3 = jsBai({
  ten: 'Migrations 3 — Write ddlRisk(sql): will this lock production?', kho: 'HARD', phut: 15,
  en: `<p>A tiny reviewer for migration lines (case-insensitive, extra spaces allowed). Return <code>'no-transaction'</code> for <code>CREATE [UNIQUE] INDEX CONCURRENTLY</code>; <code>'blocks-writes'</code> for any other <code>CREATE [UNIQUE] INDEX</code>; for <code>ALTER TABLE … ADD COLUMN … DEFAULT x</code> return <code>'rewrite'</code> when the default contains a function call (a <code>(</code>), else <code>'safe'</code>; anything else <code>'review'</code>.</p>`,
  vi: `<p>Một người duyệt nhỏ cho từng dòng migration (không phân biệt hoa thường, cho phép thừa dấu cách). Trả <code>'no-transaction'</code> cho <code>CREATE [UNIQUE] INDEX CONCURRENTLY</code>; <code>'blocks-writes'</code> cho mọi <code>CREATE [UNIQUE] INDEX</code> khác; với <code>ALTER TABLE … ADD COLUMN … DEFAULT x</code> trả <code>'rewrite'</code> khi mặc định có lời gọi hàm (có <code>(</code>), ngược lại <code>'safe'</code>; còn lại <code>'review'</code>.</p>`,
  dauVao: ['sql — string', 'sql — chuỗi'], dauRa: ['string', 'chuỗi'],
  goiY: [['Normalise case and spaces first.', 'Chuẩn hoá hoa thường và dấu cách trước.'], ['Check CONCURRENTLY before the generic CREATE INDEX.', 'Kiểm CONCURRENTLY trước CREATE INDEX chung.']],
  loi: [['Calling every ADD COLUMN with a default a rewrite.', 'Coi mọi ADD COLUMN có mặc định là viết lại bảng.'], ['Matching CREATE INDEX first, so CONCURRENTLY is never seen.', 'Bắt CREATE INDEX trước nên không bao giờ thấy CONCURRENTLY.']],
  gt: ['Measured in 12.2 on 1,000,000 rows: DEFAULT 1 took 1 ms; DEFAULT md5(random()::text) and a plain CREATE INDEX each held an INSERT for over 3 s; CONCURRENTLY kept it at 1 ms but cannot run inside the runner’s transaction (-- migrate:no-transaction).', 'Đo ở 12.2 trên 1.000.000 dòng: DEFAULT 1 mất 1 ms; DEFAULT md5(random()::text) và CREATE INDEX thường mỗi cái giữ một INSERT hơn 3 s; CONCURRENTLY giữ ở 1 ms nhưng không chạy được trong transaction của bộ chạy (-- migrate:no-transaction).'],
  kn: ['databases', 'deployment'], tns: [tn('table rewrite', 'viết lại bảng'), tn('CONCURRENTLY', 'không chặn ghi')],
  dau: `/** risk of one DDL line */
function ddlRisk(sql) {
  // Write your solution here
  if (/CREATE INDEX/i.test(sql)) return 'blocks-writes';
  return 'safe';
}
`,
  giai: '// Reference solution\n' + nguon(ddlRisk),
  cases: [
    { goi: goi('ddlRisk', 'ALTER TABLE bookings ADD COLUMN seats int NOT NULL DEFAULT 1'), moTa: ['Constant default', 'Mặc định hằng số'] },
    { goi: goi('ddlRisk', 'create index concurrently bk_user on bookings (user_id, start_at)'), moTa: ['Lower case, concurrently', 'Chữ thường, concurrently'] },
    { goi: goi('ddlRisk', 'ALTER TABLE bookings ADD COLUMN token text DEFAULT md5(random()::text)'), an: true },
    { goi: goi('ddlRisk', 'CREATE UNIQUE INDEX  bk_x ON bookings (lab_id, start_at)'), an: true },
    { goi: goi('ddlRisk', 'ALTER TABLE bookings DROP COLUMN purpose'), an: true },
  ],
});

export default doiDau({ slug: 'api-12-11-migration', ten: '12.2 Migrations, constraints and seed data', khoa: KHOA, baiHoc: 'api-12-11-migration', de: [E1, E2, E3] });
