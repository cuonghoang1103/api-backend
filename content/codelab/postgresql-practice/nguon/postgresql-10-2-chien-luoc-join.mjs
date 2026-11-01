/** PostgreSQL · 10.2 — Chiến lược JOIN: Nested Loop, Hash, Merge; chẩn đoán bằng enable_* (SET LOCAL). */
import { mod, pg, cs, bang1, ord, kq, sau, ma, tn } from './_chung.mjs';
import { O_EVENT } from './_du-lieu.mjs';

const lit = (s) => s.replace(/'/g, "''");
const Q_ONE = "SELECT u.name FROM event e JOIN users u ON u.id = e.user_id WHERE e.email = 'user5@example.com'";
const Q_ALL = 'SELECT u.country, count(*) FROM event e JOIN users u ON u.id = e.user_id GROUP BY u.country';
const JOIN = ['Nested Loop', 'Hash Join', 'Merge Join'];

export default mod('postgresql-10-2-chien-luoc-join', '10.2 Join strategies: Nested Loop, Hash & Merge', [
  cs({
    t: 'Which join strategy fits?', k: 'EASY', p: 5, loai: 'table', kn: ['Nested Loop', 'Hash Join', 'Merge Join'], tag: ['explain', 'join'],
    en: '<p>For each situation pick the strategy the planner would normally choose.</p>', vi: '<p>Với mỗi tình huống chọn chiến lược mà planner thường chọn.</p>',
    bang: [bang1('b1', ['Situation → strategy', 'Tình huống → chiến lược'], [{ ma: 'th', ten: 'Situation / Tình huống' }, { ma: 'cl', ten: 'Strategy', luaChon: JOIN }], [
      { o: { th: 'one event found by email, then its user by primary key / một sự kiện tìm theo email, rồi user của nó theo khoá chính' }, a: { cl: 'Nested Loop' } },
      { o: { th: 'all 20 000 events joined to all 2 000 users for a report, no useful order / mọi sự kiện nối với mọi user cho báo cáo, không có thứ tự sẵn' }, a: { cl: 'Hash Join' } },
      { o: { th: 'two big inputs both already sorted on the join key (e.g. read through indexes) / hai đầu vào lớn đều đã sắp theo khoá nối' }, a: { cl: 'Merge Join' } },
      { o: { th: 'a join condition that is not equality (e.g. a.x &lt; b.y) / điều kiện nối không phải phép bằng' }, a: { cl: 'Nested Loop' } },
    ], ['Nested Loop: few outer rows, cheap lookup on the inner side (an index), and the only strategy for non-equality joins. Hash Join: equality, big unsorted inputs; builds a hash of the smaller side. Merge Join: equality, both inputs sorted on the key.', 'Nested Loop: ít dòng ngoài, tra phía trong rẻ (có chỉ mục), và là chiến lược duy nhất cho phép nối không phải bằng. Hash Join: phép bằng, đầu vào lớn chưa sắp; dựng bảng băm cho phía nhỏ hơn. Merge Join: phép bằng, cả hai đầu vào đã sắp theo khoá.'])],
    gy: [['How many outer rows? Is there an index on the inner join key?', 'Bao nhiêu dòng ngoài? Phía trong có chỉ mục trên khoá nối không?'], ['Hash and Merge need an equality condition.', 'Hash và Merge cần điều kiện bằng.']],
    lhg: [['Believing Nested Loop is always bad — it is the best plan for a handful of rows.', 'Tin rằng Nested Loop luôn tệ — nó là kế hoạch tốt nhất cho vài dòng.'], ['Expecting a Hash Join on a &lt; condition.', 'Mong Hash Join cho điều kiện &lt;.']],
    tn: [tn('Nested Loop', 'vòng lặp lồng'), tn('Hash Join', 'nối băm'), tn('Merge Join', 'nối trộn')],
  }),

  pg({
    ...O_EVENT, t: 'A selective join: index lookups on both sides', k: 'MEDIUM', p: 8, kn: ['Nested Loop with Index Scans'], tag: ['explain', 'join', 'index'],
    en: `<p>The support tool runs <code>${Q_ONE}</code>. Today the outer side is a Seq Scan of 20 000 events. Create one index so that <b>both</b> sides of the Nested Loop are index lookups.</p>`,
    vi: `<p>Công cụ hỗ trợ chạy <code>${Q_ONE}</code>. Hôm nay phía ngoài là Seq Scan 20 000 sự kiện. Tạo một chỉ mục để <b>cả hai</b> phía của Nested Loop đều là tra chỉ mục.</p>`,
    yc: [['users already has its primary-key index; event needs one on the filtered column.', 'users đã có chỉ mục khoá chính; event cần chỉ mục trên cột được lọc.'], ['The plan must contain a Nested Loop and no Seq Scan.', 'Kế hoạch phải có Nested Loop và không có Seq Scan.']],
    giai: `CREATE INDEX idx_event_email ON event (email);
-- Nested Loop
--   ->  Index Scan using idx_event_email on event e      (1 row)
--   ->  Index Scan using users_pkey on users u            (1 lookup per outer row)`,
    kiem: [
      sau(['Nested Loop with no Seq Scan', 'Nested Loop không còn Seq Scan'], `SELECT plan_text('${lit(Q_ONE)}') ~ 'Nested Loop' AS nested_loop, plan_text('${lit(Q_ONE)}') !~ 'Seq Scan' AS no_seq_scan`),
      sau(['Same answer', 'Cùng kết quả'], "SELECT u.name FROM event e JOIN users u ON u.id = e.user_id WHERE e.email = 'user5@example.com'"),
      ma(['Index on email', 'Chỉ mục trên email'], '\\(\\s*email\\s*\\)'),
    ],
    sai: ['CREATE INDEX idx_event_user ON event (user_id)'],
    gy: [['Find the Seq Scan node in the current plan: its Filter tells you the column.', 'Tìm nút Seq Scan trong kế hoạch hiện tại: Filter của nó chỉ ra cột.'], ['An index on the join column of event does not help this direction.', 'Chỉ mục trên cột nối của event không giúp chiều này.']],
    lhg: [['Indexing event.user_id: the planner still has to find the event by email first.', 'Đánh chỉ mục event.user_id: planner vẫn phải tìm sự kiện theo email trước.'], ['Forcing a Hash Join "because joins should be hashed".', 'Ép Hash Join "vì nối thì phải băm".']],
    gt: ['<p>For a single-row lookup the ideal plan is index → nested loop → index: a handful of page reads in total. Nested Loop is only slow when the outer side is large or the inner side has no index.</p>', '<p>Với tra cứu một dòng, kế hoạch lý tưởng là chỉ mục → vòng lặp lồng → chỉ mục: tổng cộng vài lần đọc trang. Nested Loop chỉ chậm khi phía ngoài lớn hoặc phía trong không có chỉ mục.</p>'],
    tn: [tn('Nested Loop', 'vòng lặp lồng')],
  }),

  pg({
    ...O_EVENT, t: 'Diagnose with enable_hashjoin = off (this transaction only)', k: 'HARD', p: 10, kn: ['SET LOCAL', 'enable_hashjoin', 'Memoize'], tag: ['explain', 'join', 'planner'],
    en: `<p>The report <code>${Q_ALL}</code> uses a Hash Join. To see what the planner would do otherwise, switch hash joins off <b>for this transaction only</b> and print the plan with <code>EXPLAIN (COSTS OFF)</code>. Your last statement is that EXPLAIN.</p>`,
    vi: `<p>Báo cáo <code>${Q_ALL}</code> dùng Hash Join. Để xem planner sẽ làm gì nếu không có nó, tắt hash join <b>chỉ cho giao dịch này</b> rồi in kế hoạch bằng <code>EXPLAIN (COSTS OFF)</code>. Câu cuối của bạn là lệnh EXPLAIN đó.</p>`,
    yc: [['<code>SET LOCAL enable_hashjoin = off;</code> — never a plain SET, never ALTER SYSTEM.', '<code>SET LOCAL enable_hashjoin = off;</code> — không bao giờ SET thường, không bao giờ ALTER SYSTEM.'], ['Then <code>EXPLAIN (COSTS OFF)</code> of the report.', 'Rồi <code>EXPLAIN (COSTS OFF)</code> của báo cáo.']],
    giai: `SET LOCAL enable_hashjoin = off;     -- diagnosis only, and only until the end of this transaction
EXPLAIN (COSTS OFF)
SELECT u.country, count(*) FROM event e JOIN users u ON u.id = e.user_id GROUP BY u.country;
-- HashAggregate → Nested Loop → Seq Scan on event + Memoize → Index Scan using users_pkey`,
    kiem: [
      kq(['The fallback plan: Nested Loop with Memoize', 'Kế hoạch thay thế: Nested Loop với Memoize'], { thuTu: true }),
      ma(['SET LOCAL (not SET)', 'SET LOCAL (không phải SET)'], 'SET\\s+LOCAL\\s+enable_hashjoin'),
      ma(['EXPLAIN without ANALYZE', 'EXPLAIN không ANALYZE'], '^(?![\\s\\S]*\\bANALY[SZ]E\\b)[\\s\\S]*\\bEXPLAIN\\b'),
    ],
    sai: [`EXPLAIN (COSTS OFF) ${Q_ALL}`, `SET LOCAL enable_nestloop = off; EXPLAIN (COSTS OFF) ${Q_ALL}`],
    gy: [['SET LOCAL lasts until COMMIT/ROLLBACK; the grader rolls back after every check.', 'SET LOCAL kéo dài tới COMMIT/ROLLBACK; máy chấm huỷ giao dịch sau mỗi kiểm.'], ['enable_* settings only make a strategy "very expensive" for the planner — they are a diagnostic, not a fix.', 'Các thiết lập enable_* chỉ làm chiến lược "rất đắt" với planner — chúng là công cụ chẩn đoán, không phải cách sửa.']],
    lhg: [['A plain <code>SET</code> in a pooled connection: the next request on that connection inherits the switch.', '<code>SET</code> thường trên kết nối trong pool: yêu cầu kế tiếp trên kết nối đó thừa hưởng công tắc.'], ['Leaving enable_* = off in postgresql.conf "because it made one query faster".', 'Để enable_* = off trong postgresql.conf "vì nó làm một truy vấn nhanh hơn".']],
    gt: ['<p>With hash joins disabled the planner falls back to a Nested Loop over event with a Memoize cache in front of the users lookup (each user_id repeats ten times). Comparing the two plans with EXPLAIN ANALYZE is how lesson 10.2 confirms the planner\'s choice.</p>', '<p>Khi tắt hash join, planner lùi về Nested Loop trên event với bộ nhớ đệm Memoize trước lượt tra users (mỗi user_id lặp mười lần). So hai kế hoạch bằng EXPLAIN ANALYZE là cách bài 10.2 xác nhận lựa chọn của planner.</p>'],
    tn: [tn('SET LOCAL', 'đặt tham số cho riêng giao dịch'), tn('Memoize', 'nút đệm kết quả tra cứu lặp lại')],
  }),

  cs({
    t: 'How a Hash Join runs', k: 'MEDIUM', p: 4, loai: 'order', kn: ['build', 'probe'], tag: ['join'],
    en: '<p>Order the phases of a Hash Join of event (20 000 rows) with users (2 000 rows).</p>', vi: '<p>Sắp các pha của Hash Join giữa event (20 000 dòng) và users (2 000 dòng).</p>',
    cau: [ord('o1', ['Hash Join, step by step', 'Hash Join, từng bước'], [
      'Read the smaller input (users) / đọc đầu vào nhỏ hơn (users)',
      'Build an in-memory hash table on users.id / dựng bảng băm trong bộ nhớ trên users.id',
      'Stream the bigger input (event) row by row / cho đầu vào lớn hơn (event) chảy từng dòng',
      'Probe the hash table with each event.user_id / dò bảng băm bằng từng event.user_id',
      'Emit every matching pair to the parent node / phát mọi cặp khớp lên nút cha',
    ], ['The planner hashes the smaller side so the table fits in work_mem; if it does not, the join runs in batches on disk.', 'Planner băm phía nhỏ hơn để bảng vừa work_mem; nếu không vừa, phép nối chạy theo đợt trên đĩa.'])],
    gy: [['Build first, probe second.', 'Dựng trước, dò sau.'], ['The hashed side is the one under the "Hash" node.', 'Phía được băm là phía nằm dưới nút "Hash".']],
    lhg: [['Hashing the bigger table.', 'Băm bảng lớn hơn.'], ['Thinking rows are emitted before the build finishes.', 'Nghĩ rằng dòng được phát trước khi dựng xong.']],
    tn: [tn('build / probe', 'dựng / dò')],
  }),
]);
