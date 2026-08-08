/**
 * Case-study INT606 — Event Ticketing System.
 * Semester 6 internship project #6.
 *
 * Its place in the through-line: the first project where "let Postgres
 * arbitrate" is still CORRECT but no longer AFFORDABLE. 10,000 losers each
 * burning a pool connection to receive a constraint error is what takes the
 * system down. The answer is a Redis SET NX PX hold in front (a distributed
 * lock with a lease) with the Postgres UNIQUE still behind it as the durable
 * backstop — plus the Lua compare-and-delete that safe release requires.
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(
  new URL('./event-ticketing-system.md', import.meta.url),
  'utf8',
);
const bodyMdxEn = fs.readFileSync(
  new URL('./event-ticketing-system.en.md', import.meta.url),
  'utf8',
);

export default {
  slug: 'event-ticketing-system',
  title: 'Event Ticketing System (Đồ án thực tập #6)',
  titleEn: 'Event Ticketing System (Internship Project #6)',
  description:
    'Đồ án #6 Kỳ 6: Node + Express + PostgreSQL + Redis. Nơi chiến lược "để Postgres phân xử" vẫn ĐÚNG nhưng không còn ĐỦ — 10.000 người thua mà mỗi người đốt một kết nối DB chỉ để nhận lỗi ràng buộc là thứ làm sập hệ thống. Thêm lớp giữ ghế nguyên tử bằng Redis SET NX PX, giải phóng bằng Lua so-sánh-rồi-xoá, UNIQUE của Postgres vẫn làm chốt chặn bền.',
  descriptionEn:
    'Semester 6 project #6: Node + Express + PostgreSQL + Redis. Where "let Postgres arbitrate" is still CORRECT but no longer AFFORDABLE — 10,000 losers each burning a pool connection to receive a constraint error is what takes the system down. Add an atomic Redis SET NX PX hold, release it with a Lua compare-and-delete, and keep the Postgres UNIQUE as the durable backstop.',
  techStack: [
    'Node.js', 'Express', 'TypeScript', 'PostgreSQL', 'node-postgres (pg)',
    'Redis', 'node-redis', 'Lua scripting', 'JWT', 'Vitest', 'k6', 'Docker Compose',
  ],
  role: 'Backend (một người)',
  roleEn: 'Backend (solo)',
  duration: '3–4 tuần',
  durationEn: '3–4 weeks',
  status: 'PLANNING',
  category: 'Backend',
  difficulty: 'INTERMEDIATE',
  thumbnailUrl: 'https://media.cuongthai.com/images/projects/event-ticketing-system.webp',
  projectUrl: null,
  githubUrl: null,
  startDate: null,
  endDate: null,
  isFeatured: false,
  isPublished: true,

  schemaCode: `-- Hai kho dữ liệu, hai vai trò rõ ràng.
-- Redis: nhanh, tạm thời, tự hết hạn, CHẶN ĐÁM ĐÔNG.
-- Postgres: bền, chậm hơn, GIỮ SỰ THẬT.

-- ── Redis (không có schema, nhưng có QUY ƯỚC KHOÁ) ──────────────────
-- hold:event:{eventId}:seat:{seatId}  →  giá trị = userId, TTL 120s
--
--   SET hold:event:42:seat:A12 <userId> NX PX 120000
--     NX  ⇒ kiểm-và-đặt nguyên tử (Redis đơn luồng ⇒ đúng 1 người thắng)
--     PX  ⇒ người mua bỏ ngang thì ghế TỰ giải phóng, không cần job dọn
--     giá trị = userId ⇒ định danh chủ sở hữu, bắt buộc cho việc giải phóng
--
-- Giải phóng KHÔNG BAO GIỜ dùng DEL trần — phải so-sánh-rồi-xoá bằng Lua,
-- nếu không một request đến muộn sẽ xoá mất chỗ giữ của người mua khác.

-- ── PostgreSQL ─────────────────────────────────────────────────────
CREATE TABLE tickets (
  id          SERIAL PRIMARY KEY,
  event_id    INT NOT NULL REFERENCES events(id),
  seat_id     INT NOT NULL REFERENCES seats(id),
  user_id     INT NOT NULL REFERENCES users(id),
  -- CHỐT lúc mua: giá đổi sau đó không được viết lại hoá đơn cũ.
  price_paid  NUMERIC(12,2) NOT NULL,
  status      VARCHAR(16) NOT NULL DEFAULT 'SOLD',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- CHỐT CHẶN CUỐI. Đúng KỂ CẢ khi Redis mất sạch dữ liệu, kể cả khi
  -- ai đó viết một script nhập vé không đi qua API. Redis chỉ làm cho
  -- việc THUA trở nên rẻ; nó không bao giờ là nguồn sự thật.
  CONSTRAINT uq_seat_per_event UNIQUE (event_id, seat_id)
);

-- KHÔNG có bảng "holds" trong Postgres — có chủ ý. Chỗ giữ là dữ liệu
-- tạm thời, tự hết hạn, ghi rất nhiều: đúng hình dạng Redis làm tốt.
-- Đưa vào Postgres là tự nhận việc chạy job dọn chỗ giữ quá hạn.
CREATE INDEX idx_ticket_user ON tickets (user_id, created_at DESC);`,
  schemaCodeEn: `-- Two stores, two clearly separated jobs.
-- Redis: fast, ephemeral, self-expiring, ABSORBS THE CROWD.
-- Postgres: durable, slower, KEEPS THE TRUTH.

-- ── Redis (no schema, but a KEY CONVENTION) ────────────────────────
-- hold:event:{eventId}:seat:{seatId}  →  value = userId, TTL 120s
--
--   SET hold:event:42:seat:A12 <userId> NX PX 120000
--     NX  ⇒ atomic test-and-set (Redis is single-threaded ⇒ exactly 1 wins)
--     PX  ⇒ an abandoned checkout frees the seat itself, no sweeper job
--     value = userId ⇒ identifies the owner, required for safe release
--
-- Release NEVER uses a bare DEL — it must be a Lua compare-and-delete,
-- or a late-arriving request will delete another buyer's hold.

-- ── PostgreSQL ─────────────────────────────────────────────────────
CREATE TABLE tickets (
  id          SERIAL PRIMARY KEY,
  event_id    INT NOT NULL REFERENCES events(id),
  seat_id     INT NOT NULL REFERENCES seats(id),
  user_id     INT NOT NULL REFERENCES users(id),
  -- FROZEN at purchase: a later price change must not rewrite old receipts.
  price_paid  NUMERIC(12,2) NOT NULL,
  status      VARCHAR(16) NOT NULL DEFAULT 'SOLD',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- THE FINAL BACKSTOP. Correct EVEN IF Redis loses everything, and even if
  -- somebody writes an import script that bypasses the API. Redis only makes
  -- LOSING cheap; it is never the source of truth.
  CONSTRAINT uq_seat_per_event UNIQUE (event_id, seat_id)
);

-- There is deliberately NO "holds" table in Postgres. A hold is ephemeral,
-- self-expiring, write-heavy data — exactly Redis's shape. Putting it in
-- Postgres signs you up to run an expiry-sweeper job forever.
CREATE INDEX idx_ticket_user ON tickets (user_id, created_at DESC);`,
  schemaLang: 'sql',

  milestones: [
    {
      phase: 'DESIGN',
      title: 'Vì sao thêm Redis, khi Postgres đã đúng rồi',
      titleEn: 'Why add Redis when Postgres is already correct',
      description:
        'UNIQUE(event_id, seat_id) ngăn được mọi trường hợp bán trùng — vấn đề không phải tính đúng đắn mà là CÁI GIÁ CỦA VIỆC THUA. 9.999 người thua mà mỗi người chiếm một kết nối pool và đi trọn một vòng khứ hồi sẽ làm cạn pool, và những request KHÔNG liên quan (đăng nhập, xem sự kiện) chết theo. Nguyên tắc: đẩy phép từ chối ra càng sớm và càng rẻ càng tốt.',
      descriptionEn:
        'UNIQUE(event_id, seat_id) prevents every double sale — the issue is not correctness but THE COST OF LOSING. 9,999 losers each taking a pool connection and making a full round trip drains the pool, and UNRELATED requests (sign-in, browsing) die with it. The principle: push rejection as early and as cheaply as possible.',
    },
    {
      phase: 'BACKEND',
      title: 'SET NX PX — một lệnh làm ba việc',
      titleEn: 'SET NX PX — one command doing three jobs',
      description:
        'NX cho kiểm-và-đặt nguyên tử (Redis đơn luồng nên 10.000 lệnh xếp hàng và đúng một lệnh thấy khoá trống). PX cho chỗ giữ tự hết hạn khi người mua đóng tab — thiếu nó thì ghế kẹt vĩnh viễn. Và giá trị đặt bằng userId để định danh chủ sở hữu, thứ mà bước giải phóng bắt buộc phải có.',
      descriptionEn:
        'NX gives atomic test-and-set (Redis is single-threaded, so 10,000 commands queue and exactly one finds the key absent). PX makes the hold self-expire when a buyer closes the tab — without it the seat is stuck forever. And the value is the userId, identifying the owner, which safe release absolutely requires.',
      codeBlock:
        'const key = `hold:event:42:seat:A12`;\n'
        + 'const ok = await redis.set(key, userId, { NX: true, PX: 120_000 });\n'
        + '//   NX  = chỉ đặt nếu khoá CHƯA tồn tại → kiểm-và-đặt nguyên tử\n'
        + '//   PX  = tự hết hạn sau 120 giây      → chỗ giữ bị bỏ tự giải phóng\n'
        + 'if (ok === null)\n'
        + "  throw new ConflictError('Ghế này đang có người khác giữ');  // 409",
      codeLang: 'javascript',
    },
    {
      phase: 'BACKEND',
      title: 'Giải phóng bằng Lua so-sánh-rồi-xoá, không bao giờ DEL trần',
      titleEn: 'Release with a Lua compare-and-delete, never a bare DEL',
      description:
        'Kịch bản hỏng: An bấm Huỷ nhưng request nghẽn ba phút; TTL hết, Bình giữ ghế hợp lệ; rồi DEL của An mới tới và xoá mất chỗ giữ của Bình. Phép so sánh phải nguyên tử với phép xoá, nên nó phải là script Lua — Redis chạy trọn một script như một lệnh. Bài học sống lâu nhất của đồ án: giải phóng khoá phải kiểm quyền sở hữu, đúng như chiếm khoá phải kiểm chỗ trống.',
      descriptionEn:
        'The failure: An clicks Cancel but the request stalls for three minutes; the TTL expires, Binh legitimately takes the seat, and then An\'s DEL finally lands and deletes Binh\'s hold. The comparison must be atomic with the deletion, so it must be a Lua script — Redis runs a whole script as one command. The longest-lived lesson here: releasing a lock must check ownership, just as acquiring it checks availability.',
      codeBlock:
        "const RELEASE = `\n"
        + "  if redis.call('get', KEYS[1]) == ARGV[1] then\n"
        + "    return redis.call('del', KEYS[1])\n"
        + '  else\n'
        + '    return 0\n'
        + "  end`;\n"
        + 'await redis.eval(RELEASE, { keys: [key], arguments: [String(userId)] });',
      codeLang: 'javascript',
    },
    {
      phase: 'BACKEND',
      title: 'Xác nhận mua: Postgres vẫn là nguồn sự thật',
      titleEn: 'Confirming the sale: Postgres remains the source of truth',
      description:
        'Kiểm khoá vẫn còn và vẫn là của mình, rồi INSERT trong transaction với UNIQUE(event_id, seat_id) làm chốt chặn. Nếu Redis khởi động lại và mất hết chỗ giữ, hệ thống VẪN không bán trùng — chỉ là vài người bị từ chối muộn hơn. Đó là câu trả lời cho "sao không dùng mỗi Redis?": tiền của khách không nên phụ thuộc vào một kho dữ liệu trong bộ nhớ.',
      descriptionEn:
        'Verify the key still exists and is still yours, then INSERT inside a transaction with UNIQUE(event_id, seat_id) behind it. If Redis restarts and forgets every hold, the system STILL never double-sells — a few buyers are simply rejected later. That is the answer to "why not just Redis?": customers\' money should not depend on an in-memory store.',
    },
    {
      phase: 'DESIGN',
      title: 'Chỗ giữ cố ý KHÔNG có bảng trong Postgres',
      titleEn: 'Holds deliberately have NO Postgres table',
      description:
        'Chỗ giữ là dữ liệu tạm thời, tự hết hạn, ghi rất nhiều — đúng hình dạng Redis làm tốt và Postgres làm dở. Đưa nó vào Postgres là tự nhận việc dọn chỗ giữ quá hạn bằng job nền, và job đó sẽ có ngày không chạy. Cùng lý lẽ với "quá hạn là trạng thái suy ra" ở đồ án #2.',
      descriptionEn:
        'A hold is ephemeral, self-expiring, write-heavy data — exactly Redis\'s shape and exactly not Postgres\'s. Storing it there signs you up for an expiry sweeper, and one day that sweeper will not run. The same reasoning as "overdue is a derived state" in project #2.',
    },
    {
      phase: 'SECURITY',
      title: 'Giờ mở bán và giới hạn ghế mỗi tài khoản',
      titleEn: 'Sales windows and a per-account seat cap',
      description:
        'salesOpenAt phải chặn ở tầng route chứ không phải ẩn nút — đợt mở bán là đúng lúc người ta viết script. Và không có giới hạn số ghế mỗi tài khoản thì một người quét sạch cả sự kiện: đếm số chỗ giữ đang hoạt động theo userId bằng một khoá Redis riêng.',
      descriptionEn:
        'salesOpenAt must be enforced at the route layer, not by hiding a button — a drop is precisely when people write scripts. And without a per-account cap one person sweeps the whole event: count active holds per userId with a separate Redis key.',
    },
    {
      phase: 'TESTING',
      title: 'Bài kiểm tải 1.000 người mua, và ba con số đáng ghi',
      titleEn: 'A 1,000-buyer load test, and three numbers worth recording',
      description:
        'Promise.all chứ không phải vòng for có await — vòng for chạy tuần tự và bài kiểm luôn xanh mà không chứng minh gì. Kỳ vọng { 201: 1, 409: 999 } và đúng một hàng trong bảng tickets. Ba con số đo trước/sau khi thêm Redis: số kết nối Postgres cao nhất, phân vị 95 của các request THUA, và độ trễ của một endpoint KHÔNG liên quan trong lúc bắn.',
      descriptionEn:
        'Promise.all, not a for loop with await — a for loop runs sequentially and the test is always green while proving nothing. Expect { 201: 1, 409: 999 } and exactly one tickets row. Three numbers measured before and after adding Redis: peak Postgres connections, p95 latency of the LOSING requests, and the latency of an UNRELATED endpoint during the burst.',
      codeBlock:
        'const results = await Promise.all(\n'
        + '  Array.from({ length: 1000 }, (_, i) =>\n'
        + '    fetch(`${API}/holds`, { method: "POST", /* ... */ })\n'
        + '      .then(r => r.status)),\n'
        + ');\n'
        + 'const tally = results.reduce((m, s) => ({ ...m, [s]: (m[s] ?? 0) + 1 }), {});\n'
        + "console.log(tally);   // kỳ vọng: { '201': 1, '409': 999 }",
      codeLang: 'javascript',
    },
    {
      phase: 'DEVOPS',
      title: 'Docker Compose ba service và bài kiểm khả năng chịu lỗi',
      titleEn: 'A three-service Compose and a resilience drill',
      description:
        'api + db + redis. Bài kiểm quan trọng nhất không phải là hệ thống chạy được, mà là FLUSHALL Redis giữa đợt bắn 1.000 request rồi kiểm lại: không vé nào bán trùng. Đó là bằng chứng rằng bạn hiểu vai trò của từng lớp chứ không chỉ ghép hai công nghệ lại.',
      descriptionEn:
        'api + db + redis. The most important drill is not that it boots, but FLUSHALL on Redis mid-burst and then checking: no seat is double-sold. That is the evidence you understand each layer\'s job rather than merely wiring two technologies together.',
    },
  ],

  features: [
    { title: 'Ban tổ chức tạo sự kiện và sơ đồ ghế', titleEn: 'Organisers create events and seat maps', description: 'Khu vực, nhãn ghế, giá theo khu, và thời điểm mở bán.', descriptionEn: 'Zones, seat labels, per-zone pricing and a sales-open time.', status: 'PLANNED' },
    { title: 'Giữ ghế nguyên tử trong Redis', titleEn: 'Atomic seat holds in Redis', description: 'SET NX PX — đúng một người thắng trong vài micro giây, 9.999 người kia không chạm DB.', descriptionEn: 'SET NX PX — exactly one winner in microseconds, and 9,999 losers never touch the database.', status: 'PLANNED' },
    { title: 'Chỗ giữ tự hết hạn sau 2 phút', titleEn: 'Holds self-expire after 2 minutes', description: 'Người mua bỏ ngang thì ghế tự giải phóng, không cần job dọn nào.', descriptionEn: 'An abandoned checkout frees the seat with no sweeper job at all.', status: 'PLANNED' },
    { title: 'Giải phóng an toàn bằng Lua', titleEn: 'Safe release through Lua', description: 'So-sánh-rồi-xoá, chống việc request đến muộn xoá mất chỗ giữ của người khác.', descriptionEn: 'Compare-and-delete, so a late request cannot destroy someone else\'s hold.', status: 'PLANNED' },
    { title: 'Mua vé trong transaction có UNIQUE chốt chặn', titleEn: 'Purchase in a transaction with a UNIQUE backstop', description: 'Đúng kể cả khi Redis mất sạch dữ liệu hoặc có script ghi thẳng vào DB.', descriptionEn: 'Correct even if Redis loses everything, or a script writes straight to the database.', status: 'PLANNED' },
    { title: 'Giới hạn số ghế mỗi tài khoản', titleEn: 'Per-account seat cap', description: 'Đếm chỗ giữ đang hoạt động theo userId, chặn việc một người quét sạch sự kiện.', descriptionEn: 'Counts active holds per userId, stopping one person sweeping the event.', status: 'PLANNED' },
    { title: 'Chặn mua trước giờ mở bán', titleEn: 'Sales window enforced server-side', description: 'salesOpenAt kiểm ở tầng route, không phải ẩn nút ở client.', descriptionEn: 'salesOpenAt checked at the route layer, not by hiding a client button.', status: 'PLANNED' },
    { title: 'Bài kiểm tải 1.000 người mua', titleEn: 'A 1,000-buyer load test', description: 'Promise.all, đếm mã trạng thái, và đo số kết nối Postgres cao nhất.', descriptionEn: 'Promise.all, a status-code tally, and a peak-Postgres-connections measurement.', status: 'PLANNED' },
  ],

  resources: [
    { title: 'INT606 trên Academy — bản dạy từng bước', titleEn: 'INT606 on the Academy — the step-by-step course', url: 'https://cuongthai.com/courses/event-ticketing-system', type: 'LINK', description: '9 mục, 21 bài, song ngữ, kèm quiz và đề thi cuối kỳ.', descriptionEn: '9 sections, 21 lessons, bilingual, with quizzes and a final exam.' },
    { title: 'Redis — Distributed Locks', titleEn: 'Redis — Distributed Locks', url: 'https://redis.io/docs/latest/develop/use-cases/distributed-locking/', type: 'DOC', description: 'Công thức chính thức: SET NX PX, giá trị định danh chủ sở hữu, giải phóng bằng Lua.', descriptionEn: 'The official recipe: SET NX PX, an owner token as the value, release via Lua.' },
    { title: 'Redis — EVAL và scripting', titleEn: 'Redis — EVAL and scripting', url: 'https://redis.io/docs/latest/commands/eval/', type: 'DOC', description: 'Vì sao một script chạy nguyên tử, và khi nào cần điều đó.', descriptionEn: 'Why a script runs atomically, and when you need that.' },
    { title: 'Martin Kleppmann — How to do distributed locking', titleEn: 'Martin Kleppmann — How to do distributed locking', url: 'https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html', type: 'LINK', description: 'Đọc để hiểu giới hạn của khoá Redis — và vì sao chốt chặn ở Postgres là bắt buộc.', descriptionEn: 'Read it to understand the limits of a Redis lock — and why the Postgres backstop is mandatory.' },
    { title: 'k6 — công cụ kiểm tải', titleEn: 'k6 — load testing tool', url: 'https://k6.io/docs/', type: 'LINK', description: 'Khi Promise.all không đủ: mô phỏng người dùng thật với thời gian nghĩ và tăng tải dần.', descriptionEn: 'When Promise.all is not enough: real user simulation with think time and ramp-up.' },
    { title: 'PostgreSQL — Connection pooling & pgbouncer', titleEn: 'PostgreSQL — Connection pooling & pgbouncer', url: 'https://www.pgbouncer.org/usage.html', type: 'LINK', description: 'Bối cảnh cho con số quan trọng nhất của đồ án: số kết nối cao nhất lúc mở bán.', descriptionEn: 'Context for this project\'s most important number: peak connections during a drop.' },
  ],

  coreKnowledge: [
    { vi: 'Tính đúng đắn và cái giá của việc thua là hai câu hỏi khác nhau', en: 'Correctness and the cost of losing are two different questions' },
    { vi: 'Khoá phân tán: SET NX PX, giá trị định danh chủ sở hữu, và TTL như một hợp đồng thuê', en: 'Distributed locks: SET NX PX, an owner token, and a TTL as a lease' },
    { vi: 'Vì sao Redis đơn luồng khiến SET NX trở thành kiểm-và-đặt nguyên tử', en: 'Why Redis being single-threaded makes SET NX an atomic test-and-set' },
    { vi: 'So-sánh-rồi-xoá bằng Lua, và vì sao DEL trần là bug chỉ hiện khi chậm', en: 'Lua compare-and-delete, and why a bare DEL is a bug that only appears under latency' },
    { vi: 'Kiến trúc hai lớp: kho nhanh chặn đám đông, kho bền giữ sự thật', en: 'Two-layer architecture: a fast store absorbs the crowd, a durable store keeps the truth' },
    { vi: 'Chọn kho dữ liệu theo HÌNH DẠNG dữ liệu (tạm thời, tự hết hạn, ghi nhiều)', en: 'Choosing a store by the SHAPE of the data (ephemeral, self-expiring, write-heavy)' },
    { vi: 'Kết nối cơ sở dữ liệu là tài nguyên khan hiếm nhất trong một đợt tải đột biến', en: 'Database connections are the scarcest resource during a traffic spike' },
    { vi: 'Viết bài kiểm tải thật: Promise.all thay vì vòng for có await', en: 'Writing a real load test: Promise.all instead of a for loop with await' },
    { vi: 'Đo tác động lên các endpoint KHÔNG liên quan để phát hiện pool đang cạn', en: 'Measuring impact on UNRELATED endpoints to detect pool exhaustion' },
    { vi: 'Kiểm khả năng chịu lỗi bằng cách chủ động phá: FLUSHALL giữa đợt bắn', en: 'Testing resilience by deliberately breaking things: FLUSHALL mid-burst' },
  ],

  portfolioBonus: [
    { vi: 'Biểu đồ số kết nối Postgres trước/sau khi thêm Redis, trong README', en: 'A Postgres-connections chart before and after adding Redis, in the README' },
    { vi: 'Sơ đồ ghế tương tác, cập nhật trạng thái giữ theo thời gian thực bằng SSE', en: 'An interactive seat map with hold status streamed live over SSE' },
    { vi: 'Hàng đợi chờ (virtual waiting room) khi số người vượt ngưỡng', en: 'A virtual waiting room once concurrent users pass a threshold' },
    { vi: 'Vé có mã QR ký số, quét được ở cửa và chống nhân bản', en: 'QR tickets with a digital signature, scannable at the door and clone-resistant' },
    { vi: 'Kịch bản k6 có tăng tải dần và thời gian nghĩ, gần với người dùng thật hơn', en: 'A k6 scenario with ramp-up and think time, closer to real users' },
    { vi: 'Bảng điều khiển cho ban tổ chức: tỉ lệ chuyển đổi từ giữ ghế sang mua', en: 'An organiser dashboard showing hold-to-purchase conversion' },
  ],

  completionOutcomes: [
    { vi: 'Nhận ra khi nào một lời giải đúng vẫn cần thêm lớp vì quá đắt', en: 'Recognise when a correct solution still needs another layer because it is too expensive' },
    { vi: 'Dùng khoá phân tán đúng cách, kể cả phần giải phóng mà đa số làm sai', en: 'Use a distributed lock correctly, including the release step most people get wrong' },
    { vi: 'Chọn kho dữ liệu theo hình dạng dữ liệu thay vì theo thói quen', en: 'Choose a data store by the shape of the data rather than by habit' },
    { vi: 'Viết và đọc được một bài kiểm tải có ý nghĩa', en: 'Write and interpret a load test that actually means something' },
    { vi: 'Giải thích được vì sao vẫn cần ràng buộc ở Postgres khi đã có Redis', en: 'Explain why the Postgres constraint is still required once Redis is in front' },
  ],

  bodyMdx,
  bodyMdxEn,
};
