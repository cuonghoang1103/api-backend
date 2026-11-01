/** API Design · 12.9 — Học tiếp gì: con đường, bản đồ khoá học, hướng mở rộng LabFlow (bài định hướng cuối khoá). */
import { doiDau, KHOA, cs, q, tn, jsBai, nguon, goi } from './_api.mjs';

const E1 = cs({
  ten: 'Next 1 — Where each part goes deeper', kho: 'EASY', phut: 6,
  en: 'Lesson 12.9: the course map and three roads for the next three months.',
  vi: 'Bài 12.9: bản đồ khoá học và ba con đường cho ba tháng tới.',
  cau: [
    q('c1', ['You want PgBouncer, WAL backups and lock internals — the parts of 12.3 and 12.7 this course only touched. Which course?', 'Bạn muốn PgBouncer, sao lưu WAL và bên trong khoá — những phần 12.3 và 12.7 chỉ chạm tới. Khoá nào?'],
      ['PostgreSQL (start at 14.2, pooling with PgBouncer)', 'Redis (start at 7.3, Lua scripts)', 'Docker (start at 16.2, Compose for production)', 'Testing (start at 4.1, a real database in tests)'],
      ['Each part of LabFlow has a deeper course; the map in 12.9 lists the starting lesson for each.', 'Mỗi phần của LabFlow có một khoá sâu hơn; bản đồ ở 12.9 ghi bài bắt đầu cho từng khoá.']),
    q('c2', ['You apply for internships next month. Which road does 12.9 suggest?', 'Tháng sau bạn nộp đơn thực tập. Bài 12.9 gợi ý con đường nào?'],
      ['Interview season: Lab 11 again timed, System Design, your three STAR stories aloud', 'Operations-minded: Docker, a VPS and Observability before anything else', 'Rewrite LabFlow in another language to show more technologies', 'Start the six extensions at once to have a bigger project'],
      ['Pick the road that matches your deadline; each has a course order.', 'Chọn con đường hợp với hạn của bạn; mỗi đường có một thứ tự khoá học.']),
    q('c3', ['Before writing code for any LabFlow extension, what does 12.9 say to do first?', 'Trước khi viết mã cho một hướng mở rộng LabFlow, bài 12.9 bảo làm gì trước?'],
      ['Add the operation to openapi.yaml and run the breaking-change diff', 'Create the database table and seed it with sample data', 'Write the React page that will call the new endpoint', 'Open a pull request so the team can discuss the idea'],
      ['Contract first, then code, then one behaviour test and one measurement in the evidence sheet.', 'Hợp đồng trước, rồi mã, rồi một test hành vi và một số đo trong bảng bằng chứng.']),
  ],
  goiY: [['Match each topic to the course that owns it.', 'Ghép từng chủ đề với khoá phụ trách nó.'], ['The contract comes before the code.', 'Hợp đồng đi trước mã.']],
  loi: [['Learning everything at once.', 'Học mọi thứ cùng lúc.'], ['Coding an extension before designing its contract.', 'Viết mã mở rộng trước khi thiết kế hợp đồng.']],
  tns: [tn('learning road', 'con đường học'), tn('contract first', 'hợp đồng trước')],
  kn: ['career'],
});

const E2 = cs({
  ten: 'Next 2 — Where each extension’s rule lives', kho: 'MEDIUM', phut: 8,
  en: 'For the six LabFlow extensions of 12.9, choose the place that must enforce the rule.',
  vi: 'Với sáu hướng mở rộng LabFlow của 12.9, chọn chỗ phải thi hành luật.',
  cau: [
    q('c1', ['Several campuses: one campus must never read another’s bookings, whatever the code path.', 'Nhiều cơ sở: cơ sở này không bao giờ được đọc lượt đặt của cơ sở kia, dù mã đi đường nào.'],
      ['PostgreSQL row-level security on campus_id', 'A check in each route handler before the query', 'A filter in the React app that hides other campuses', 'A Redis set of allowed campus ids per session'],
      ['BOLA (6.2) enforced by the database: every path, every instance.', 'BOLA (6.2) do chính CSDL thi hành: mọi đường đi, mọi instance.']),
    q('c2', ['API-key plans: free 60 requests per minute, partner 600 — shared across instances.', 'Gói API key: miễn phí 60 request/phút, đối tác 600 — dùng chung qua các instance.'],
      ['The Redis Lua bucket, with capacity read from the key’s plan', 'A PostgreSQL row per key updated on every request', 'An in-memory Map per instance, multiplied by the instance count', 'The client SDK, which promises to slow itself down'],
      ['Same atomic script as 12.4; RateLimit-Policy announces the plan.', 'Cùng script nguyên tử như 12.4; RateLimit-Policy công bố gói.']),
    q('c3', ['Audit log: every change to bookings must be recorded, even if the process crashes after COMMIT.', 'Nhật ký thay đổi: mọi thay đổi lượt đặt phải được ghi, kể cả khi tiến trình sập sau COMMIT.'],
      ['An append-only table written in the same transaction as the change', 'A log line written after the response is sent', 'An event published to Redis after the change commits', 'A nightly diff between two pg_dump files'],
      ['Same idea as the outbox: in the transaction, or it can be lost.', 'Cùng ý tưởng với outbox: nằm trong transaction, không thì có thể mất.']),
  ],
  goiY: [['Ask which place every request must pass through.', 'Hỏi: chỗ nào mọi request đều phải đi qua.'], ['Shared and short-lived ⇒ Redis; truth ⇒ PostgreSQL.', 'Dùng chung, sống ngắn ⇒ Redis; sự thật ⇒ PostgreSQL.']],
  loi: [['Enforcing security in the UI.', 'Thi hành bảo mật ở giao diện.'], ['Writing the audit log outside the transaction.', 'Ghi nhật ký ngoài transaction.']],
  tns: [tn('row-level security', 'bảo mật mức dòng'), tn('append-only', 'chỉ ghi thêm')],
  kn: ['architecture', 'security'],
});

function weeklyPlan(start, items) {
  const t0 = Date.parse(`${start}T00:00:00Z`);
  return items.map((it, i) => ({ week: i + 1, due: new Date(t0 + (i + 1) * 7 * 86400000 - 86400000).toISOString().slice(0, 10), item: it }));
}
const E3 = jsBai({
  ten: 'Next 3 — Write weeklyPlan(start, items): a plan with dates', kho: 'MEDIUM', phut: 10,
  en: `<p>12.9 asks for a four-week plan with dates in your README. Given a Monday <code>start</code> (<code>YYYY-MM-DD</code>) and a list of deliverables, return <code>{ week, due, item }</code> per item: week <code>i</code> is due on its Sunday (start + 7·i − 1 days, UTC), as <code>YYYY-MM-DD</code>.</p>`,
  vi: `<p>Bài 12.9 yêu cầu kế hoạch bốn tuần có ngày tháng trong README. Cho một thứ Hai <code>start</code> (<code>YYYY-MM-DD</code>) và danh sách sản phẩm, trả <code>{ week, due, item }</code> cho mỗi mục: tuần <code>i</code> có hạn vào Chủ nhật của nó (start + 7·i − 1 ngày, UTC), dạng <code>YYYY-MM-DD</code>.</p>`,
  dauVao: ['start — string; items — string[]', 'start — chuỗi; items — mảng chuỗi'], dauRa: ['{ week, due, item }[]', '{ week, due, item }[]'],
  goiY: [['Work in UTC milliseconds: 86,400,000 per day.', 'Tính bằng mili giây UTC: 86.400.000 mỗi ngày.'], ['toISOString().slice(0, 10) gives YYYY-MM-DD.', 'toISOString().slice(0, 10) cho YYYY-MM-DD.']],
  loi: [['Using local time, which shifts the date by one in some time zones.', 'Dùng giờ địa phương, lệch một ngày ở vài múi giờ.'], ['Off by one: due on the next Monday.', 'Lệch một: hạn vào thứ Hai tuần sau.']],
  gt: ['A plan with dates is a commitment you can check; the same UTC discipline as RFC 3339 times in LabFlow (1.4).', 'Kế hoạch có ngày là cam kết kiểm được; cùng kỷ luật UTC như thời gian RFC 3339 trong LabFlow (1.4).'],
  kn: ['career', 'dates'], tns: [tn('deliverable', 'sản phẩm bàn giao')],
  dau: `/** four weeks, with dates */
function weeklyPlan(start, items) {
  // Write your solution here
  return items.map((item, i) => ({ week: i + 1, due: start, item }));
}
`,
  giai: '// Reference solution\n' + nguon(weeklyPlan),
  cases: [
    { goi: goi('weeklyPlan', '2026-11-02', ['Testing 4.1–4.4', 'Lab 12 at 10/10']), moTa: ['Two weeks', 'Hai tuần'] },
    { goi: goi('weeklyPlan', '2026-12-28', ['Deploy to a VPS 3.2', 'README evidence sheet', 'Three STAR stories', 'Mock interview']), an: true },
    { goi: goi('weeklyPlan', '2026-11-02', []), an: true },
  ],
});

export default doiDau({ slug: 'api-12-8-hoc-tiep', ten: '12.9 Where to go next', khoa: KHOA, baiHoc: 'api-12-8-hoc-tiep', de: [E1, E2, E3] });
