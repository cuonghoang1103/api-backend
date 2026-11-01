/**
 * PostgreSQL · 15.1 — pg_dump/pg_restore. Hai công cụ dòng lệnh ⇒ đo ba định dạng + khôi phục một bảng là bài tay.
 * Chấm được: "bản sao lưu chỉ tính khi đã khôi phục" — truy vấn đối soát (đếm + md5 mọi dòng theo khoá) giữa CSDL thật
 * và bản khôi phục (schema restored), cùng bảng chọn định dạng và trắc nghiệm.
 */
import { mod, pg, cs, q, bang1, tay, kq, kqAn, ma, CT_SHOP, pre, tn } from './_chung.mjs';

const BA_DANG = `# formats.sh — run next to your PostgreSQL of lesson 0.3 (container pgdemo, database ctshop)
docker exec pgdemo bash -c '
  cd /tmp && rm -rf plain.sql custom.dump dir
  time pg_dump -U postgres -d ctshop -f plain.sql
  time pg_dump -U postgres -d ctshop -Fc -f custom.dump
  time pg_dump -U postgres -d ctshop -Fd -j 4 -f dir
  du -sh plain.sql custom.dump dir
  pg_restore -l custom.dump | head -20
  createdb -U postgres one_table
  pg_restore -U postgres -d one_table -t orders custom.dump          # what comes back? (schema? PK? indexes?)
  psql -U postgres -d one_table -c "\\d orders"
'`;

const DOI_SOAT = `${CT_SHOP}
-- the restore of last night's dump, loaded into schema "restored" (pg_restore + ALTER SCHEMA … RENAME)
CREATE SCHEMA restored;
CREATE TABLE restored.customer AS SELECT * FROM public.customer;
CREATE TABLE restored.product  AS SELECT * FROM public.product;
CREATE TABLE restored.orders   AS SELECT * FROM public.orders WHERE id <> 14;          -- written while the dump ran
CREATE TABLE restored.payment  AS SELECT * FROM public.payment;
UPDATE restored.product SET price = 9500 WHERE id = 10;                                -- changed after the dump`;

export default mod('postgresql-15-1-pg-dump', '15.1 pg_dump and pg_restore: the backup you can read', [
  tay({
    t: 'Dump in three formats, then restore a single table', k: 'MEDIUM', p: 15, kn: ['pg_dump -Fc / -Fd -j', 'pg_restore -l / -t', 'what -t does not bring back'], tag: ['backup', 'pg_dump', 'docker'],
    en: `<p>On your PostgreSQL of lesson 0.3 (CT Shop loaded):</p>${pre(BA_DANG)}`,
    vi: `<p>Trên PostgreSQL của bài 0.3 (đã nạp CT Shop):</p>${pre(BA_DANG)}`,
    yc: [['custom and directory are about 4× smaller than plain; plain is the fastest to write.', 'custom và directory nhỏ hơn plain khoảng 4 lần; plain ghi nhanh nhất.'], ['<code>pg_restore -l</code> lists the table of contents (TABLE, TABLE DATA, CONSTRAINT, INDEX…).', '<code>pg_restore -l</code> liệt kê mục lục (TABLE, TABLE DATA, CONSTRAINT, INDEX…).'], ['<code>-t orders</code> brings back the table and its rows but NOT its primary key, identity or indexes — note what \\d shows.', '<code>-t orders</code> trả lại bảng và các dòng nhưng KHÔNG có khoá chính, identity hay chỉ mục — ghi lại \\d hiện gì.']],
    lenh: 'bash formats.sh',
    lyDo: ['pg_dump and pg_restore are client programs working on a real server and real files; the browser grader has neither.', 'pg_dump và pg_restore là chương trình phía client làm việc với máy chủ và tệp thật; máy chấm trình duyệt không có cả hai.'],
    tep: { 'formats.sh': BA_DANG + '\n' },
    giaiTep: { 'formats.sh': `${BA_DANG}

# Expected (49 MB ctshop of the slides, PostgreSQL 17.11):
# real 0.264s / 0.595s / 0.655s
# 16M plain.sql · 3.9M custom.dump · 3.9M dir
# \\d orders in one_table: the columns are there, but no "Indexes:" section, no PRIMARY KEY, no identity —
# -t restores TABLE + TABLE DATA only. To get a usable copy restore the whole dump, or add the schema first.
` },
    viDu: [{ input: ['du -sh plain.sql custom.dump dir', 'du -sh plain.sql custom.dump dir'], output: ['16M · 3.9M · 3.9M', '16M · 3.9M · 3.9M'], explanation: ['custom and directory compress.', 'custom và directory có nén.'] }],
    gy: [['Use the newest pg_dump (version ≥ the server).', 'Dùng pg_dump mới nhất (phiên bản ≥ máy chủ).'], ['A plain dump is restored with psql, the others with pg_restore.', 'Dump plain khôi phục bằng psql, các dạng kia bằng pg_restore.']],
    lhg: [['Feeding a custom dump to psql — it is binary.', 'Đưa dump custom cho psql — nó là nhị phân.'], ['Trusting -t to give back a production-ready table.', 'Tin rằng -t trả lại một bảng sẵn sàng cho production.']],
    gt: ['<p>Custom is the default to use: compressed, with a table of contents that allows selective and parallel restores. Directory is the only format that dumps in parallel.</p>', '<p>Custom là mặc định nên dùng: có nén, có mục lục cho phép khôi phục chọn lọc và song song. Directory là định dạng duy nhất dump song song.</p>'],
    tn: [tn('logical backup', 'sao lưu logic'), tn('table of contents', 'mục lục bản dump')],
  }),

  pg({
    csdl: DOI_SOAT, tenCsdl: 'ctshop',
    ld: { en: `<h4>Schemas</h4>${pre(`public.*   -- the live CT Shop
restored.customer · restored.product · restored.orders · restored.payment   -- last night's dump, restored`)}`, vi: `<h4>Schema</h4>${pre(`public.*   -- CT Shop đang chạy
restored.customer · restored.product · restored.orders · restored.payment   -- bản dump đêm qua, đã khôi phục`)}` },
    t: 'A backup counts only after a restore: reconcile it', k: 'HARD', p: 15, kn: ['row fingerprint: count + md5(string_agg(row ORDER BY key))', 'comparing two schemas', 'UNION ALL per table'], tag: ['backup', 'restore', 'ctshop'],
    en: '<p>Compare the restored copy with the live database, table by table: return <code>table_name, live_rows, restored_rows, same</code> for customer, orders, payment and product (alphabetical), where <code>same</code> is true only when both the row count and <code>md5(string_agg(t::text, E\'\\n\' ORDER BY t.id))</code> match.</p>',
    vi: '<p>So bản khôi phục với CSDL đang chạy, từng bảng một: trả về <code>table_name, live_rows, restored_rows, same</code> cho customer, orders, payment và product (theo chữ cái), trong đó <code>same</code> chỉ đúng khi cả số dòng lẫn <code>md5(string_agg(t::text, E\'\\n\' ORDER BY t.id))</code> khớp nhau.</p>',
    yc: [['A row cast to text (<code>t::text</code>) contains every column — one changed price changes the hash.', 'Một dòng ép sang chữ (<code>t::text</code>) chứa mọi cột — đổi một giá là đổi mã băm.'], ['ORDER BY the key inside string_agg, or the same rows in a different order give a different hash.', 'ORDER BY khoá bên trong string_agg, nếu không cùng các dòng mà khác thứ tự sẽ ra mã băm khác.']],
    giai: `WITH fp AS (
  SELECT 'customer' AS table_name, 'live' AS side, count(*) AS n, md5(string_agg(t::text, E'\\n' ORDER BY t.id)) AS h FROM public.customer t
  UNION ALL SELECT 'customer', 'restored', count(*), md5(string_agg(t::text, E'\\n' ORDER BY t.id)) FROM restored.customer t
  UNION ALL SELECT 'orders',   'live',     count(*), md5(string_agg(t::text, E'\\n' ORDER BY t.id)) FROM public.orders t
  UNION ALL SELECT 'orders',   'restored', count(*), md5(string_agg(t::text, E'\\n' ORDER BY t.id)) FROM restored.orders t
  UNION ALL SELECT 'payment',  'live',     count(*), md5(string_agg(t::text, E'\\n' ORDER BY t.id)) FROM public.payment t
  UNION ALL SELECT 'payment',  'restored', count(*), md5(string_agg(t::text, E'\\n' ORDER BY t.id)) FROM restored.payment t
  UNION ALL SELECT 'product',  'live',     count(*), md5(string_agg(t::text, E'\\n' ORDER BY t.id)) FROM public.product t
  UNION ALL SELECT 'product',  'restored', count(*), md5(string_agg(t::text, E'\\n' ORDER BY t.id)) FROM restored.product t
)
SELECT l.table_name, l.n AS live_rows, r.n AS restored_rows,
       l.n = r.n AND l.h IS NOT DISTINCT FROM r.h AS same
FROM fp l JOIN fp r ON r.table_name = l.table_name AND r.side = 'restored'
WHERE l.side = 'live'
ORDER BY l.table_name;`,
    kiem: [
      kq(['orders lost a row, product has a changed price', 'orders thiếu một dòng, product có một giá bị đổi'], { thuTu: true }),
      kqAn(['A customer renamed after the dump', 'Một khách đổi tên sau bản dump'], "UPDATE public.customer SET full_name = 'Trần Thị Bình An' WHERE id = 1; UPDATE restored.product SET price = 9000 WHERE id = 10", { thuTu: true }),
      ma(['Fingerprints rows with md5', 'Lấy dấu vân tay dòng bằng md5'], 'md5\\s*\\('),
    ],
    sai: [
      "SELECT 'customer' AS table_name, (SELECT count(*) FROM public.customer) AS live_rows, (SELECT count(*) FROM restored.customer) AS restored_rows, (SELECT count(*) FROM public.customer) = (SELECT count(*) FROM restored.customer) AS same UNION ALL SELECT 'orders', (SELECT count(*) FROM public.orders), (SELECT count(*) FROM restored.orders), (SELECT count(*) FROM public.orders) = (SELECT count(*) FROM restored.orders) UNION ALL SELECT 'payment', (SELECT count(*) FROM public.payment), (SELECT count(*) FROM restored.payment), (SELECT count(*) FROM public.payment) = (SELECT count(*) FROM restored.payment) UNION ALL SELECT 'product', (SELECT count(*) FROM public.product), (SELECT count(*) FROM restored.product), (SELECT count(*) FROM public.product) = (SELECT count(*) FROM restored.product) ORDER BY 1",
    ],
    gy: [['Build one fingerprint row per (table, side), then join live to restored.', 'Dựng một dòng dấu vân tay cho mỗi (bảng, phía), rồi nối phía live với phía restored.'], ['This is exactly what lab8-check.sql does, so that diff can compare two servers.', 'Đây đúng là việc lab8-check.sql làm, để diff so được hai máy chủ.']],
    lhg: [['Comparing counts only — a changed price or a swapped row passes.', 'Chỉ so số dòng — giá bị đổi hay dòng bị tráo vẫn lọt.'], ['Forgetting ORDER BY inside string_agg — the hash depends on the physical order.', 'Quên ORDER BY trong string_agg — mã băm phụ thuộc thứ tự vật lý.']],
    gt: ['<p>Restore, then reconcile: equal counts prove little, an equal fingerprint of every row proves the copy. Here the differences are expected (a row written during the dump, a price changed after it) — the point is that the check SEES them.</p>', '<p>Khôi phục rồi đối soát: số dòng bằng nhau chứng minh rất ít, dấu vân tay của mọi dòng bằng nhau mới chứng minh bản sao. Ở đây khác biệt là dự kiến (một dòng ghi trong lúc dump, một giá đổi sau đó) — điều quan trọng là phép kiểm NHÌN THẤY chúng.</p>'],
    tn: [tn('fingerprint', 'dấu vân tay dữ liệu'), tn('reconciliation', 'đối soát')],
  }),

  cs({
    t: 'Which format — or is pg_dump the wrong tool?', k: 'MEDIUM', p: 8, kn: ['plain / custom / directory', 'logical vs physical backup', 'RPO'], tag: ['backup'], loai: 'table',
    en: '<p>For each need, pick the dump format — or say that no dump can do it.</p>', vi: '<p>Với mỗi nhu cầu, chọn định dạng dump — hoặc nói rằng không bản dump nào làm được.</p>',
    bang: [bang1('b1', ['Need → format', 'Nhu cầu → định dạng'], [{ ma: 'n', ten: 'Need / Nhu cầu' }, { ma: 'f', ten: 'Format / Định dạng', luaChon: ['plain', 'custom', 'directory', 'no dump — PITR'] }], [
      { o: { n: 'Restore only the review table from last night\'s backup / Chỉ khôi phục bảng review từ bản sao lưu đêm qua' }, a: { f: 'custom' } },
      { o: { n: 'Keep the schema in git and read diffs between versions / Giữ lược đồ trong git và đọc diff giữa các phiên bản' }, a: { f: 'plain' } },
      { o: { n: 'Dump a 400 GB database with 8 parallel jobs / Dump CSDL 400 GB với 8 tiến trình song song' }, a: { f: 'directory' } },
      { o: { n: 'Undo a DELETE without WHERE run at 14:32, losing at most a minute / Huỷ một DELETE thiếu WHERE lúc 14:32, mất tối đa một phút' }, a: { f: 'no dump — PITR' } },
      { o: { n: 'Default for a nightly backup of a small app / Mặc định cho bản sao lưu hằng đêm của một app nhỏ' }, a: { f: 'custom' } },
    ], ['custom = compressed + table of contents (selective, parallel restore); plain = readable SQL; directory = the only parallel dump. A dump is one moment in time: going back to 14:31:59 needs a base backup + WAL (15.2).', 'custom = nén + mục lục (khôi phục chọn lọc, song song); plain = SQL đọc được; directory = dạng duy nhất dump song song. Bản dump là MỘT thời điểm: quay về 14:31:59 cần base backup + WAL (15.2).'])],
    gy: [['Selective restore needs a table of contents.', 'Khôi phục chọn lọc cần mục lục.'], ['Ask "which moment can I go back to?"', 'Tự hỏi "tôi quay về được thời điểm nào?"']],
    lhg: [['Thinking a more frequent dump replaces PITR.', 'Tưởng dump dày hơn thay được PITR.'], ['Using plain for a large production database — no selective or parallel restore.', 'Dùng plain cho CSDL production lớn — không khôi phục chọn lọc hay song song được.']],
    tn: [tn('RPO', 'lượng dữ liệu chấp nhận mất')],
  }),

  cs({
    t: 'What a dump is, and what it is not', k: 'EASY', p: 6, kn: ['snapshot consistency', 'RPO of a nightly dump', 'pg_dump and VACUUM'], tag: ['backup'],
    en: '<p>Lesson 15.1 in four questions.</p>', vi: '<p>Bài 15.1 trong bốn câu.</p>',
    cau: [
      q('q1', ['A row is inserted while pg_dump is running. Is it in the dump?', 'Một dòng được chèn trong lúc pg_dump đang chạy. Nó có trong bản dump không?'], ['no — the dump is the snapshot taken when it started', 'yes — pg_dump waits for running writes', 'only with the custom format', 'only if the row was committed before the dump ended'], ['pg_dump reads one MVCC snapshot from its start; later commits are invisible to it.', 'pg_dump đọc một snapshot MVCC từ lúc bắt đầu; các commit sau đó vô hình với nó.']),
      q('q2', ['Nightly dump at 02:00, disk dies at 01:59. How much data is lost?', 'Dump hằng đêm lúc 02:00, đĩa hỏng lúc 01:59. Mất bao nhiêu dữ liệu?'], ['23 hours 59 minutes', 'nothing — the dump is recent', 'one minute', 'only the rows of the last transaction'], ['The recovery point is the last dump. Less loss needs WAL archiving.', 'Điểm khôi phục là bản dump gần nhất. Mất ít hơn thì cần lưu trữ WAL.']),
      q('q3', ['A 3-hour pg_dump runs on a busy primary. What side effect does it have?', 'Một pg_dump 3 giờ chạy trên primary bận. Nó có tác dụng phụ gì?'], ['its open snapshot stops VACUUM cleaning newer dead rows for 3 hours', 'it blocks every INSERT on every table for 3 hours', 'it switches WAL writing off until the dump ends', 'none at all — a dump only reads, so it is free'], ['Like any long transaction (11.1, 14.3). Run long dumps on a replica.', 'Như mọi giao dịch dài (11.1, 14.3). Hãy chạy dump dài trên bản sao.']),
      q('q4', ['Why is "we have nightly dump files" not yet a backup?', 'Vì sao "có tệp dump mỗi đêm" vẫn chưa phải là sao lưu?'], ['until a restore is tested, the files may be empty, partial or unusable', 'dump files must be signed by a DBA before they count', 'only physical backups count as backups in PostgreSQL', 'dump files older than one week expire automatically'], ['Zero-byte files after a password change, a missing schema… are silent until you restore.', 'Tệp 0 byte sau khi đổi mật khẩu, thiếu một schema… im lặng cho tới khi bạn khôi phục.']),
    ],
    gy: [['A dump = one consistent moment.', 'Bản dump = một thời điểm nhất quán.'], ['Test the restore, not the file size.', 'Kiểm việc khôi phục, không kiểm cỡ tệp.']],
    lhg: [['Assuming rows written during the dump are included.', 'Tưởng các dòng ghi trong lúc dump được tính vào.'], ['Measuring backups by "the cron job is green".', 'Đánh giá sao lưu bằng "cron chạy xanh".']],
    tn: [tn('snapshot', 'ảnh chụp nhất quán')],
  }),
]);
