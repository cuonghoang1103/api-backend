/** PostgreSQL · 2.3 — Boolean, ngày & giờ (và múi giờ). CT Shop mini: created_at timestamptz, phiên đặt Asia/Ho_Chi_Minh. */
import { mod, pg, kq, kqAn, ma, tn } from './_chung.mjs';

export default mod('postgresql-2-3-ngay-gio', '2.3 Booleans, dates & times (and timezones)', [
  pg({
    t: 'One instant, two wall clocks', k: 'EASY', p: 7, kn: ['timestamptz', 'AT TIME ZONE'], tag: ['types', 'time', 'ctshop'],
    en: '<p>The session time zone is <code>Asia/Ho_Chi_Minh</code>. The payment provider logs in UTC. For orders 1, 2 and 3 return <code>id</code>, <code>created_at</code> (as stored, shown in Vietnam time) and <code>utc_time</code> — the same instant as a UTC wall-clock time without zone. Order by id.</p>',
    vi: '<p>Múi giờ của phiên là <code>Asia/Ho_Chi_Minh</code>. Cổng thanh toán ghi nhật ký theo UTC. Với đơn 1, 2, 3 trả về <code>id</code>, <code>created_at</code> (như đã lưu, hiển thị giờ Việt Nam) và <code>utc_time</code> — cùng thời điểm đó dưới dạng giờ đồng hồ UTC không kèm múi. Sắp theo id.</p>',
    yc: [['<code>created_at AT TIME ZONE \'UTC\'</code> converts a timestamptz into a timestamp (no zone) in UTC.', '<code>created_at AT TIME ZONE \'UTC\'</code> đổi timestamptz thành timestamp (không múi) theo giờ UTC.'], ['Do not change the session time zone with SET.', 'Không đổi múi giờ phiên bằng SET.']],
    giai: `SELECT id,
       created_at,                               -- printed in the session zone (+07)
       created_at AT TIME ZONE 'UTC' AS utc_time  -- same instant, UTC wall clock, type timestamp
FROM orders
WHERE id IN (1, 2, 3)
ORDER BY id;`,
    kiem: [
      kq(['09:15+07 is 02:15 UTC', '09:15+07 là 02:15 UTC'], { thuTu: true }),
      kqAn(['An order at 06:30 in Vietnam is still the previous day in UTC', 'Đơn lúc 06:30 giờ VN vẫn là hôm trước theo UTC'], "UPDATE orders SET created_at = '2026-08-04 06:30+07' WHERE id = 1", { thuTu: true }),
      ma(['Uses AT TIME ZONE', 'Dùng AT TIME ZONE'], "AT\\s+TIME\\s+ZONE\\s+'UTC'"),
    ],
    sai: ["SELECT id, created_at, created_at - interval '7 hours' AS utc_time FROM orders WHERE id IN (1, 2, 3) ORDER BY id", "SELECT id, created_at, created_at::timestamp AS utc_time FROM orders WHERE id IN (1, 2, 3) ORDER BY id"],
    gy: [['A timestamptz is an instant; how it prints depends on the session TimeZone.', 'timestamptz là một thời điểm; nó in ra thế nào tuỳ TimeZone của phiên.'], ['<code>tstz AT TIME ZONE \'UTC\'</code> → the wall-clock reading in UTC (a plain timestamp).', '<code>tstz AT TIME ZONE \'UTC\'</code> → giờ đồng hồ ở UTC (một timestamp thường).']],
    lhg: [['Subtracting 7 hours by hand — the type stays timestamptz, so it prints as a different instant with +07.', 'Tự trừ 7 giờ — kiểu vẫn là timestamptz nên in ra một thời điểm khác kèm +07.'], ['<code>::timestamp</code> just drops the zone using the SESSION zone — you get Vietnam time, not UTC.', '<code>::timestamp</code> chỉ bỏ múi giờ theo múi của PHIÊN — ra giờ Việt Nam, không phải UTC.']],
    gt: ['<p>timestamptz stores one absolute instant (internally UTC) and prints it in the session zone. AT TIME ZONE asks "what does a clock in that zone show?" and returns a timestamp without zone.</p>', '<p>timestamptz lưu một thời điểm tuyệt đối (bên trong là UTC) và in theo múi của phiên. AT TIME ZONE hỏi "đồng hồ ở múi đó chỉ mấy giờ?" và trả một timestamp không múi.</p>'],
    tn: [tn('timestamptz', 'thời điểm có múi giờ'), tn('AT TIME ZONE', 'đổi sang giờ đồng hồ của một múi')],
  }),

  pg({
    t: 'Orders from 1 to 5 October, all day long', k: 'MEDIUM', p: 8, kn: ['half-open range', 'timestamptz vs date literal', 'BETWEEN trap'], tag: ['time', 'ctshop'],
    en: '<p>Marketing wants every order placed from <b>1 October 2026</b> to <b>5 October 2026 inclusive</b> (Vietnam time). Return <code>id, created_at</code> ordered by id.</p>',
    vi: '<p>Marketing cần mọi đơn đặt từ <b>1/10/2026</b> tới <b>hết ngày 5/10/2026</b> (giờ Việt Nam). Trả về <code>id, created_at</code> sắp theo id.</p>',
    yc: [['Use a half-open range: <code>created_at &gt;= \'2026-10-01\' AND created_at &lt; \'2026-10-06\'</code>.', 'Dùng khoảng nửa mở: <code>created_at &gt;= \'2026-10-01\' AND created_at &lt; \'2026-10-06\'</code>.'], ['Do not wrap the column in a function (it would stop an index from being used — chapter 9).', 'Đừng bọc cột trong hàm (sẽ chặn chỉ mục — chương 9).']],
    giai: `SELECT id, created_at
FROM orders
WHERE created_at >= '2026-10-01'      -- midnight 1 Oct, session zone (+07)
  AND created_at <  '2026-10-06'      -- strictly before midnight 6 Oct ⇒ all of 5 Oct
ORDER BY id;`,
    kiem: [
      kq(['Orders 7, 11, 12, 13 and 14', 'Đơn 7, 11, 12, 13 và 14'], { thuTu: true }),
      kqAn(['An order at 23:59 on 5 October is included; one at 00:00 on 6 October is not', 'Đơn 23:59 ngày 5/10 được tính; đơn 00:00 ngày 6/10 thì không'], "UPDATE orders SET created_at = '2026-10-05 23:59:30+07' WHERE id = 1; UPDATE orders SET created_at = '2026-10-06 00:00+07' WHERE id = 2", { thuTu: true }),
      ma(['No function around created_at', 'Không bọc created_at trong hàm'], '\\(\\s*created_at|created_at\\s*::', true),
    ],
    sai: ["SELECT id, created_at FROM orders WHERE created_at BETWEEN '2026-10-01' AND '2026-10-05' ORDER BY id", "SELECT id, created_at FROM orders WHERE created_at::date BETWEEN '2026-10-01' AND '2026-10-05' ORDER BY id"],
    gy: [['A date literal compared with a timestamptz means MIDNIGHT of that day.', 'Ngày so với timestamptz nghĩa là NỬA ĐÊM đầu ngày đó.'], ['"Up to and including 5 Oct" = "before 6 Oct".', '"Tới hết 5/10" = "trước 6/10".']],
    lhg: [['<code>BETWEEN \'2026-10-01\' AND \'2026-10-05\'</code> stops at 5 Oct 00:00 — the whole last day is lost (orders 13 and 14 vanish).', '<code>BETWEEN \'2026-10-01\' AND \'2026-10-05\'</code> dừng ở 00:00 ngày 5/10 — mất trọn ngày cuối (đơn 13, 14 biến mất).'], ['<code>created_at::date BETWEEN …</code> gives the right rows but hides the column inside a cast, so an index on created_at cannot be used.', '<code>created_at::date BETWEEN …</code> ra đúng dòng nhưng giấu cột trong phép ép kiểu, chỉ mục trên created_at không dùng được.']],
    gt: ['<p>The half-open interval [start, next day) is the one pattern that is correct for any precision of time and keeps the column bare, so it stays index-friendly.</p>', '<p>Khoảng nửa mở [đầu, ngày hôm sau) là mẫu duy nhất đúng với mọi độ chính xác thời gian và giữ nguyên cột, nên vẫn dùng được chỉ mục.</p>'],
    tn: [tn('half-open interval', 'khoảng nửa mở', '[a, b): gồm a, không gồm b')],
  }),

  pg({
    t: 'Delivery promise and age of an order', k: 'MEDIUM', p: 8, kn: ['interval arithmetic', 'date − date', '::date'], tag: ['time', 'ctshop'],
    en: '<p>For every <b>shipped</b> order return <code>id</code>, <code>order_date</code> (the Vietnam calendar date), <code>promised</code> = order date + 3 days (a date), and <code>days_ago</code> = number of days from the order date to <b>2026-10-10</b> (an integer). Order by id.</p>',
    vi: '<p>Với mọi đơn <b>đã giao</b> trả về <code>id</code>, <code>order_date</code> (ngày theo lịch Việt Nam), <code>promised</code> = ngày đặt + 3 ngày (kiểu date), và <code>days_ago</code> = số ngày từ ngày đặt tới <b>2026-10-10</b> (số nguyên). Sắp theo id.</p>',
    yc: [['<code>created_at::date</code> uses the session zone (Vietnam).', '<code>created_at::date</code> dùng múi của phiên (Việt Nam).'], ['date + integer = date; date − date = integer (days).', 'date + số nguyên = date; date − date = số nguyên (ngày).']],
    giai: `SELECT id,
       created_at::date                         AS order_date,
       created_at::date + 3                     AS promised,    -- date + int ⇒ date
       DATE '2026-10-10' - created_at::date     AS days_ago     -- date − date ⇒ int
FROM orders
WHERE status = 'shipped'
ORDER BY id;`,
    kiem: [
      kq(['Five shipped orders', 'Năm đơn đã giao'], { thuTu: true }),
      kqAn(['An early-morning order (06:30 Vietnam = 23:30 UTC the day before) keeps its Vietnam date', 'Đơn sáng sớm (06:30 giờ VN = 23:30 UTC hôm trước) giữ ngày theo giờ VN'], "UPDATE orders SET created_at = '2026-09-30 06:30+07', status = 'shipped' WHERE id = 11", { thuTu: true }),
      ma(['Filters shipped orders', 'Lọc đơn đã giao'], "status\\s*=\\s*'shipped'"),
    ],
    sai: ["SELECT id, created_at::date AS order_date, created_at + interval '3 days' AS promised, DATE '2026-10-10' - created_at::date AS days_ago FROM orders WHERE status = 'shipped' ORDER BY id", "SELECT id, (created_at AT TIME ZONE 'UTC')::date AS order_date, (created_at AT TIME ZONE 'UTC')::date + 3 AS promised, DATE '2026-10-10' - (created_at AT TIME ZONE 'UTC')::date AS days_ago FROM orders WHERE status = 'shipped' ORDER BY id"],
    gy: [['Convert once: <code>created_at::date</code>.', 'Đổi một lần: <code>created_at::date</code>.'], ['<code>DATE \'2026-10-10\' - order_date</code> is already an integer.', '<code>DATE \'2026-10-10\' - order_date</code> đã là số nguyên.']],
    lhg: [['<code>created_at + interval \'3 days\'</code> — still a timestamptz with a time of day, not a date.', '<code>created_at + interval \'3 days\'</code> — vẫn là timestamptz có giờ, không phải date.'], ['Taking the date in UTC: every order placed between 00:00 and 07:00 Vietnam time lands on the previous day.', 'Lấy ngày theo UTC: mọi đơn đặt từ 00:00 tới 07:00 giờ VN rơi về hôm trước.']],
    gt: ['<p>Pick the type you mean: a calendar date is <code>date</code>, an instant is <code>timestamptz</code>, a length of time is <code>interval</code>. With dates, + and − work in whole days.</p>', '<p>Chọn đúng kiểu bạn muốn nói: ngày lịch là <code>date</code>, thời điểm là <code>timestamptz</code>, khoảng thời gian là <code>interval</code>. Với date, + và − tính theo ngày trọn.</p>'],
    tn: [tn('interval', 'khoảng thời gian'), tn('date', 'ngày lịch')],
  }),

  pg({
    t: 'Orders per month in Vietnam time', k: 'HARD', p: 10, kn: ['date_trunc', 'GROUP BY month', 'boolean aggregates'], tag: ['time', 'ctshop', 'aggregate'],
    en: '<p>Monthly dashboard: for each calendar month (Vietnam time) return <code>month</code> (a <code>date</code>, first day of the month), <code>orders</code> (count), <code>cancelled</code> (how many were cancelled) and <code>all_paid</code> — <code>true</code> when no order of that month is still <code>pending</code>. Oldest month first.</p>',
    vi: '<p>Bảng tháng: với mỗi tháng lịch (giờ Việt Nam) trả về <code>month</code> (kiểu <code>date</code>, ngày đầu tháng), <code>orders</code> (số đơn), <code>cancelled</code> (số đơn bị huỷ) và <code>all_paid</code> — <code>true</code> khi không còn đơn nào của tháng đó đang <code>pending</code>. Tháng cũ trước.</p>',
    yc: [['<code>date_trunc(\'month\', created_at)::date</code> — in the session zone.', '<code>date_trunc(\'month\', created_at)::date</code> — theo múi của phiên.'], ['<code>count(*) FILTER (WHERE …)</code> and <code>bool_and(…)</code> are allowed (chapter 6 explains them).', 'Được dùng <code>count(*) FILTER (WHERE …)</code> và <code>bool_and(…)</code> (chương 6 giảng kỹ).']],
    giai: `SELECT date_trunc('month', created_at)::date            AS month,
       count(*)                                         AS orders,
       count(*) FILTER (WHERE status = 'cancelled')     AS cancelled,
       bool_and(status <> 'pending')                    AS all_paid
FROM orders
GROUP BY 1
ORDER BY 1;`,
    kiem: [
      kq(['August, September, October 2026', 'Tháng 8, 9, 10 năm 2026'], { thuTu: true }),
      kqAn(['00:30 on 1 November in Vietnam belongs to November', '00:30 ngày 1/11 giờ VN thuộc tháng 11'], "UPDATE orders SET created_at = '2026-11-01 00:30+07' WHERE id = 7", { thuTu: true }),
      ma(['Uses date_trunc', 'Dùng date_trunc'], "date_trunc\\s*\\(\\s*'month'"),
    ],
    sai: ["SELECT date_trunc('month', created_at AT TIME ZONE 'UTC')::date AS month, count(*) AS orders, count(*) FILTER (WHERE status = 'cancelled') AS cancelled, bool_and(status <> 'pending') AS all_paid FROM orders GROUP BY 1 ORDER BY 1", "SELECT date_trunc('month', created_at)::date AS month, count(*) AS orders, count(*) FILTER (WHERE status = 'cancelled') AS cancelled, bool_or(status <> 'pending') AS all_paid FROM orders GROUP BY 1 ORDER BY 1"],
    gy: [['Truncating to the month gives the first instant of the month; <code>::date</code> keeps just the date.', 'Cắt về tháng cho thời điểm đầu tháng; <code>::date</code> chỉ giữ ngày.'], ['<code>bool_and(x)</code> is true only when x is true for every row of the group.', '<code>bool_and(x)</code> chỉ true khi x đúng với mọi dòng trong nhóm.']],
    lhg: [['Grouping in UTC: an order at 00:30 on 1 Nov (Vietnam) is counted in October.', 'Gom theo UTC: đơn 00:30 ngày 1/11 (giờ VN) bị tính vào tháng 10.'], ['<code>bool_or</code> instead of <code>bool_and</code>: one paid order makes the whole month look done.', '<code>bool_or</code> thay vì <code>bool_and</code>: một đơn đã trả làm cả tháng trông như xong.']],
    gt: ['<p><code>date_trunc</code> on a timestamptz works in the session time zone, which is exactly the "Vietnam calendar" the business means. Boolean aggregates and FILTER let one pass compute several numbers per group.</p>', '<p><code>date_trunc</code> trên timestamptz chạy theo múi giờ của phiên — đúng "lịch Việt Nam" mà nghiệp vụ muốn. Hàm tổng hợp boolean và FILTER cho phép một lượt đọc tính nhiều con số mỗi nhóm.</p>'],
    tn: [tn('date_trunc', 'cắt thời gian về đầu kỳ'), tn('bool_and / bool_or', 'VÀ / HOẶC trên cả nhóm')],
  }),
]);
