/** PostgreSQL · 12.4 — Materialized view: đổi độ tươi lấy tốc độ; REFRESH, REFRESH CONCURRENTLY cần chỉ mục unique. */
import { mod, pg, cs, q, sau, ma, tn } from './_chung.mjs';
import { O_NOTES12, NOTES12 } from './_du-lieu.mjs';

const CO_MV = `${NOTES12}
CREATE MATERIALIZED VIEW note_summary_mv AS
SELECT user_id, count(*) AS notes, sum(views) AS tong_views
FROM notes GROUP BY user_id;
-- since the view was built, the app has kept writing:
UPDATE notes SET views = views + 100 WHERE user_id = 1;`;

export default mod('postgresql-12-4-materialized-view', '12.4 Materialized views: trading freshness for speed', [
  pg({
    ...O_NOTES12, t: 'Store the summary: CREATE MATERIALIZED VIEW', k: 'EASY', p: 6, kn: ['CREATE MATERIALIZED VIEW', 'staleness'], tag: ['matview'],
    en: '<p>Create the materialized view <code>note_summary_mv (user_id, notes, tong_views)</code> — per user, number of notes and total views — so the dashboard reads 20 stored rows instead of aggregating 500.</p>',
    vi: '<p>Tạo materialized view <code>note_summary_mv (user_id, notes, tong_views)</code> — theo user, số ghi chú và tổng views — để dashboard đọc 20 dòng đã lưu thay vì tổng hợp 500 dòng.</p>',
    yc: [['<code>CREATE MATERIALIZED VIEW note_summary_mv AS SELECT … GROUP BY user_id</code>.', '<code>CREATE MATERIALIZED VIEW note_summary_mv AS SELECT … GROUP BY user_id</code>.'], ['It stores rows: later writes are NOT reflected until a refresh.', 'Nó lưu dòng: các lần ghi sau KHÔNG hiện ra cho tới khi làm mới.']],
    giai: `CREATE MATERIALIZED VIEW note_summary_mv AS
SELECT user_id, count(*) AS notes, sum(views) AS tong_views
FROM notes
GROUP BY user_id;`,
    kiem: [
      sau(['Users 1–3 in the stored summary', 'User 1–3 trong bảng tóm tắt đã lưu'], 'SELECT * FROM note_summary_mv WHERE user_id <= 3 ORDER BY user_id', { thuTu: true }),
      sau(['It goes stale: a later update is not visible', 'Nó bị cũ: lần cập nhật sau không hiện ra'], 'UPDATE notes SET views = views + 100 WHERE user_id = 1; SELECT tong_views FROM note_summary_mv WHERE user_id = 1'),
      sau(['It is a materialized view', 'Đó là materialized view'], "SELECT relkind FROM pg_class WHERE relname = 'note_summary_mv'"),
    ],
    sai: ['CREATE VIEW note_summary_mv AS SELECT user_id, count(*) AS notes, sum(views) AS tong_views FROM notes GROUP BY user_id'],
    gy: [['Same syntax as a view plus the word MATERIALIZED.', 'Cùng cú pháp view, thêm chữ MATERIALIZED.'], ['relkind m = materialized view, v = view.', 'relkind m = materialized view, v = view.']],
    lhg: [['A plain view — always fresh, but recomputed on every read (the thing you wanted to avoid).', 'View thường — luôn mới, nhưng tính lại mỗi lần đọc (đúng điều bạn muốn tránh).'], ['Forgetting that a materialized view goes stale.', 'Quên rằng materialized view sẽ cũ đi.']],
    gt: ['<p>A materialized view runs its query once and stores the result like a table (it can even be indexed). Reads are fast; the data is as old as the last REFRESH.</p>', '<p>Materialized view chạy truy vấn một lần và lưu kết quả như một bảng (đánh chỉ mục được). Đọc nhanh; dữ liệu cũ bằng lần REFRESH gần nhất.</p>'],
    tn: [tn('materialized view', 'view lưu sẵn kết quả')],
  }),

  pg({
    csdl: CO_MV, tenCsdl: 'notes12-mv', ld: { en: O_NOTES12.ld.en + '<p>This task already has <code>note_summary_mv</code>, built BEFORE user 1\'s notes gained 100 views each.</p>', vi: O_NOTES12.ld.vi + '<p>Bài này đã có sẵn <code>note_summary_mv</code>, dựng TRƯỚC khi mỗi ghi chú của user 1 được cộng 100 views.</p>' },
    t: 'Refresh without blocking the dashboard', k: 'MEDIUM', p: 8, kn: ['REFRESH MATERIALIZED VIEW CONCURRENTLY', 'unique index required'], tag: ['matview'],
    en: '<p><code>note_summary_mv</code> is stale. A plain <code>REFRESH</code> locks out readers while it runs. Make the view refreshable <b>concurrently</b> and refresh it that way.</p>',
    vi: '<p><code>note_summary_mv</code> đã cũ. <code>REFRESH</code> thường chặn người đọc trong lúc chạy. Làm cho view làm mới được <b>đồng thời</b> và làm mới theo cách đó.</p>',
    yc: [['CONCURRENTLY needs a UNIQUE index on the materialized view (here: user_id).', 'CONCURRENTLY cần một chỉ mục UNIQUE trên materialized view (ở đây: user_id).'], ['Then <code>REFRESH MATERIALIZED VIEW CONCURRENTLY note_summary_mv</code>.', 'Rồi <code>REFRESH MATERIALIZED VIEW CONCURRENTLY note_summary_mv</code>.']],
    giai: `CREATE UNIQUE INDEX note_summary_mv_user ON note_summary_mv (user_id);   -- lets PostgreSQL diff old vs new rows
REFRESH MATERIALIZED VIEW CONCURRENTLY note_summary_mv;                   -- readers keep reading the old rows meanwhile`,
    kiem: [
      sau(['User 1 now shows the new total', 'User 1 giờ hiện tổng mới'], 'SELECT user_id, tong_views FROM note_summary_mv WHERE user_id IN (1, 2) ORDER BY user_id', { thuTu: true }),
      sau(['A unique index exists on the view', 'Có chỉ mục unique trên view'], "SELECT count(*) AS unique_indexes FROM pg_index WHERE indrelid = 'note_summary_mv'::regclass AND indisunique"),
      ma(['REFRESH … CONCURRENTLY', 'REFRESH … CONCURRENTLY'], 'REFRESH\\s+MATERIALIZED\\s+VIEW\\s+CONCURRENTLY'),
    ],
    sai: ['REFRESH MATERIALIZED VIEW note_summary_mv', 'REFRESH MATERIALIZED VIEW CONCURRENTLY note_summary_mv'],
    gy: [['Without a unique index: "cannot refresh materialized view concurrently".', 'Không có chỉ mục unique: "cannot refresh materialized view concurrently".'], ['The index must cover all rows (no WHERE) and be on plain columns.', 'Chỉ mục phải phủ mọi dòng (không WHERE) và trên cột trơn.']],
    lhg: [['Plain REFRESH on a busy dashboard: every reader waits until it finishes.', 'REFRESH thường trên dashboard đông: mọi người đọc phải chờ tới khi xong.'], ['CONCURRENTLY without the unique index — it errors.', 'CONCURRENTLY mà thiếu chỉ mục unique — báo lỗi.']],
    gt: ['<p>CONCURRENTLY builds the new result aside, compares it with the old one through the unique key, and applies only the differences — readers are never blocked. It is slower overall and needs the unique index.</p>', '<p>CONCURRENTLY dựng kết quả mới ở bên cạnh, so với kết quả cũ qua khoá unique, rồi chỉ áp phần khác biệt — người đọc không bao giờ bị chặn. Tổng thể chậm hơn và cần chỉ mục unique.</p>'],
    tn: [tn('REFRESH … CONCURRENTLY', 'làm mới không chặn người đọc')],
  }),

  pg({
    t: 'A daily revenue table for the dashboard (CT Shop)', k: 'HARD', p: 12, kn: ['materialized view over joins', 'indexing a matview', 'refresh after new data'], tag: ['matview', 'ctshop'],
    en: '<p>Create <code>mv_daily_revenue (day, payments, revenue)</code>: per calendar day of <code>payment.paid_at</code> (Vietnam time), the number of payments and their sum. Give it a unique index on <code>day</code>. The check adds a payment, refreshes, and expects the new numbers.</p>',
    vi: '<p>Tạo <code>mv_daily_revenue (day, payments, revenue)</code>: theo ngày lịch của <code>payment.paid_at</code> (giờ Việt Nam), số thanh toán và tổng tiền. Thêm chỉ mục unique trên <code>day</code>. Kiểm sẽ thêm một thanh toán, làm mới, và mong thấy số mới.</p>',
    yc: [['<code>paid_at::date AS day</code> (the session is in Vietnam time).', '<code>paid_at::date AS day</code> (phiên đang ở giờ Việt Nam).'], ['<code>CREATE UNIQUE INDEX … ON mv_daily_revenue (day)</code>.', '<code>CREATE UNIQUE INDEX … ON mv_daily_revenue (day)</code>.']],
    giai: `CREATE MATERIALIZED VIEW mv_daily_revenue AS
SELECT paid_at::date AS day, count(*) AS payments, sum(amount) AS revenue
FROM payment
GROUP BY 1;
CREATE UNIQUE INDEX mv_daily_revenue_day ON mv_daily_revenue (day);`,
    kiem: [
      sau(['Ten paying days', 'Mười ngày có thanh toán'], 'SELECT * FROM mv_daily_revenue ORDER BY day', { thuTu: true }),
      sau(['After a new payment + REFRESH CONCURRENTLY the day is updated', 'Sau thanh toán mới + REFRESH CONCURRENTLY, ngày đó được cập nhật'], "INSERT INTO payment (order_id, amount, method, paid_at) VALUES (7, 95000, 'cod', '2026-09-08 20:00+07'); REFRESH MATERIALIZED VIEW CONCURRENTLY mv_daily_revenue; SELECT day, payments, revenue FROM mv_daily_revenue WHERE day = '2026-09-08'"),
      sau(['Early-morning payments stay on their Vietnam day', 'Thanh toán sáng sớm vẫn ở đúng ngày giờ VN'], "INSERT INTO payment (order_id, amount, method, paid_at) VALUES (11, 78000, 'card', '2026-10-06 06:30+07'); REFRESH MATERIALIZED VIEW mv_daily_revenue; SELECT day, payments FROM mv_daily_revenue WHERE day >= '2026-10-05' ORDER BY day", { an: true, thuTu: true }),
    ],
    sai: ['CREATE MATERIALIZED VIEW mv_daily_revenue AS SELECT paid_at::date AS day, count(*) AS payments, sum(amount) AS revenue FROM payment GROUP BY 1', "CREATE MATERIALIZED VIEW mv_daily_revenue AS SELECT (paid_at AT TIME ZONE 'UTC')::date AS day, count(*) AS payments, sum(amount) AS revenue FROM payment GROUP BY 1; CREATE UNIQUE INDEX mv_daily_revenue_day ON mv_daily_revenue (day);"],
    gy: [['Same query you would put in a view, stored.', 'Cùng truy vấn bạn sẽ đặt vào view, nhưng được lưu.'], ['The unique index serves both lookups by day and REFRESH CONCURRENTLY.', 'Chỉ mục unique phục vụ cả tra theo ngày lẫn REFRESH CONCURRENTLY.']],
    lhg: [['No unique index: the dashboard\'s nightly REFRESH CONCURRENTLY fails.', 'Không chỉ mục unique: lệnh REFRESH CONCURRENTLY hằng đêm của dashboard lỗi.'], ['Grouping by the UTC date — evening payments in Vietnam move to the previous/next day.', 'Gom theo ngày UTC — thanh toán buổi tối ở Việt Nam dời sang ngày khác.']],
    gt: ['<p>Dashboards tolerate minutes of staleness but not slow pages: a materialized view with a unique key, refreshed concurrently by a scheduled job (pg_cron, a worker), is the standard compromise.</p>', '<p>Dashboard chịu được dữ liệu cũ vài phút nhưng không chịu được trang chậm: materialized view có khoá unique, được làm mới đồng thời bởi một job định kỳ (pg_cron, worker), là thoả hiệp chuẩn.</p>'],
    tn: [tn('materialized view', 'view lưu sẵn kết quả')],
  }),

  cs({
    t: 'View or materialized view?', k: 'MEDIUM', p: 5, kn: ['freshness vs speed'], tag: ['matview', 'view'],
    en: '<p>Choose for each need.</p>', vi: '<p>Chọn cho từng nhu cầu.</p>',
    cau: [
      q('q1', ['A checkout page must show the stock that is on the shelf right now.', 'Trang thanh toán phải hiện tồn kho đang có trên kệ ngay lúc này.'], ['a plain view (or the table) — it must never be stale', 'a materialized view refreshed nightly', 'a materialized view refreshed hourly', 'a CSV export'], ['Correctness beats speed when users act on the number.', 'Khi người dùng hành động theo con số thì đúng quan trọng hơn nhanh.']),
      q('q2', ['A yearly sales report scans 50 million rows and is opened 200 times a day; yesterday\'s numbers are fine.', 'Báo cáo doanh số năm quét 50 triệu dòng và được mở 200 lần mỗi ngày; số liệu của hôm qua là đủ.'], ['a materialized view refreshed nightly', 'a plain view', 'a trigger on every insert', 'run the query 200 times'], ['Compute once, read 200 times. A REFRESH per night costs one scan.', 'Tính một lần, đọc 200 lần. Mỗi đêm một lần REFRESH tốn đúng một lượt quét.']),
      q('q3', ['What does REFRESH MATERIALIZED VIEW (without CONCURRENTLY) do to readers?', 'REFRESH MATERIALIZED VIEW (không CONCURRENTLY) làm gì với người đọc?'], ['blocks them until it finishes (exclusive lock)', 'nothing at all, readers never notice', 'shows them half-refreshed rows meanwhile', 'cancels the queries already running'], ['A plain refresh swaps in the new data under an exclusive lock; CONCURRENTLY avoids that at the price of a unique index and more work.', 'Làm mới thường tráo dữ liệu mới dưới khoá độc quyền; CONCURRENTLY tránh được điều đó với cái giá là chỉ mục unique và nhiều việc hơn.']),
    ],
    gy: [['Ask how stale the number may be.', 'Hỏi con số được phép cũ tới đâu.'], ['Ask how often it is read vs how costly it is to compute.', 'Hỏi nó được đọc thường xuyên thế nào so với chi phí tính.']],
    lhg: [['Materializing data that users act on in real time.', 'Lưu sẵn dữ liệu mà người dùng hành động theo thời gian thực.'], ['Refreshing without CONCURRENTLY on a busy system.', 'Làm mới không CONCURRENTLY trên hệ đang bận.']],
    tn: [tn('staleness', 'độ cũ của dữ liệu')],
  }),
]);
