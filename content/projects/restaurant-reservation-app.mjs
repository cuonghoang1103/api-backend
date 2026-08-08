/**
 * Case-study INT608 — Restaurant Reservation & Pre-order App.
 * Semester 6 internship project #8, Flutter client + Node/Express API.
 *
 * Its place in the through-line: the customer stops NAMING the resource
 * ("seat A12") and asks for ANY suitable one ("a table for four"). That turns
 * the problem into pool allocation, where plain FOR UPDATE creates a convoy
 * on the first free row and SKIP LOCKED is what lets six free tables be
 * claimed concurrently. The compound UNIQUE stays as the durable backstop.
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(
  new URL('./restaurant-reservation-app.md', import.meta.url),
  'utf8',
);
const bodyMdxEn = fs.readFileSync(
  new URL('./restaurant-reservation-app.en.md', import.meta.url),
  'utf8',
);

export default {
  slug: 'restaurant-reservation-app',
  title: 'Restaurant Reservation App (Đồ án thực tập #8)',
  titleEn: 'Restaurant Reservation App (Internship Project #8)',
  description:
    'Đồ án #8 Kỳ 6: app Flutter + API Node/Express + PostgreSQL. Lần đầu khách KHÔNG chỉ đích danh tài nguyên — "cho tôi một bàn 4 người" nghĩa là bàn nào cũng được. FOR UPDATE thường khiến cả mười request xếp hàng sau cùng một chiếc bàn; SKIP LOCKED để sáu bàn trống được nhận đồng thời, và UNIQUE ghép vẫn làm chốt chặn.',
  descriptionEn:
    'Semester 6 project #8: a Flutter app over a Node/Express + PostgreSQL API. The first time the customer does NOT name the resource — "a table for four" means any table will do. Plain FOR UPDATE makes all ten requests queue behind one table; SKIP LOCKED lets six free tables be claimed at once, with a compound UNIQUE still behind it.',
  techStack: [
    'Flutter', 'Dart', 'Riverpod', 'flutter_secure_storage',
    'Node.js', 'Express', 'Prisma', 'PostgreSQL', 'JWT', 'Docker Compose',
  ],
  role: 'Mobile + Backend (một người)',
  roleEn: 'Mobile + backend (solo)',
  duration: '3–4 tuần',
  durationEn: '3–4 weeks',
  status: 'PLANNING',
  category: 'Mobile',
  difficulty: 'INTERMEDIATE',
  thumbnailUrl: 'https://media.cuongthai.com/images/projects/restaurant-reservation-app.webp',
  projectUrl: null,
  githubUrl: null,
  startDate: null,
  endDate: null,
  isFeatured: false,
  isPublished: true,

  schemaCode: `-- Nhà hàng RỜI RẠC HOÁ thời gian thành suất (18:00 / 19:30 / 21:00),
-- nên bất biến là "không trùng (bàn, suất)" — một UNIQUE ghép giải được,
-- không cần EXCLUDE USING gist như bài homestay. Mô hình bám theo cách
-- nghiệp vụ vận hành, không theo cách thời gian trôi.

CREATE TABLE tables (
  id            SERIAL PRIMARY KEY,
  restaurant_id INT NOT NULL REFERENCES restaurants(id),
  label         VARCHAR(16) NOT NULL,
  seats         INT NOT NULL CHECK (seats > 0),
  zone          VARCHAR(32)
);
-- Truy vấn phân bổ sắp theo seats ASC để nhóm 2 người không chiếm bàn 8 chỗ.
CREATE INDEX idx_table_capacity ON tables (restaurant_id, seats);

CREATE TABLE reservations (
  id         SERIAL PRIMARY KEY,
  table_id   INT NOT NULL REFERENCES tables(id),
  slot_id    INT NOT NULL REFERENCES slots(id),
  diner_id   INT NOT NULL REFERENCES users(id),
  party_size INT NOT NULL,
  status     VARCHAR(16) NOT NULL DEFAULT 'CONFIRMED',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- CHỐT CHẶN CUỐI. SKIP LOCKED làm việc phân bổ HIỆU QUẢ;
  -- ràng buộc này làm nó ĐÚNG, kể cả với script không đi qua API.
  CONSTRAINT uk_table_slot UNIQUE (table_id, slot_id)
);

-- Truy vấn LÕI của đồ án. Không có SKIP LOCKED thì cả 10 request cùng
-- xếp hàng sau chiếc bàn trống ĐẦU TIÊN, 9 người chờ rồi cùng thất bại,
-- trong khi 5 chiếc bàn khác ngồi không.
--
--   SELECT t.id FROM tables t
--    WHERE t.seats >= :party
--      AND NOT EXISTS (SELECT 1 FROM reservations r
--                       WHERE r.table_id = t.id AND r.slot_id = :slot
--                         AND r.status <> 'CANCELLED')
--    ORDER BY t.seats ASC
--    FOR UPDATE OF t SKIP LOCKED
--    LIMIT 1;

CREATE TABLE preorder_lines (
  id                  SERIAL PRIMARY KEY,
  reservation_id      INT NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  menu_item_id        INT NOT NULL REFERENCES menu_items(id),
  qty                 INT NOT NULL CHECK (qty > 0),
  -- CHỐT lúc đặt. Nhà hàng tăng giá tuần sau thì hoá đơn tuần này
  -- KHÔNG được đổi — cùng lý do đơn hàng lưu địa chỉ giao thay vì
  -- trỏ tới hồ sơ người dùng.
  unit_price_at_order NUMERIC(12,2) NOT NULL
);`,
  schemaCodeEn: `-- A restaurant DISCRETISES time into sittings (18:00 / 19:30 / 21:00), so
-- the invariant is "no duplicate (table, slot)" — a compound UNIQUE handles
-- it, with no need for the EXCLUDE USING gist of the homestay project. The
-- model follows how the business runs, not how time happens to flow.

CREATE TABLE tables (
  id            SERIAL PRIMARY KEY,
  restaurant_id INT NOT NULL REFERENCES restaurants(id),
  label         VARCHAR(16) NOT NULL,
  seats         INT NOT NULL CHECK (seats > 0),
  zone          VARCHAR(32)
);
-- The allocation query orders by seats ASC so a party of 2 never takes an 8-top.
CREATE INDEX idx_table_capacity ON tables (restaurant_id, seats);

CREATE TABLE reservations (
  id         SERIAL PRIMARY KEY,
  table_id   INT NOT NULL REFERENCES tables(id),
  slot_id    INT NOT NULL REFERENCES slots(id),
  diner_id   INT NOT NULL REFERENCES users(id),
  party_size INT NOT NULL,
  status     VARCHAR(16) NOT NULL DEFAULT 'CONFIRMED',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- THE FINAL BACKSTOP. SKIP LOCKED makes allocation EFFICIENT;
  -- this constraint makes it CORRECT, even for scripts bypassing the API.
  CONSTRAINT uk_table_slot UNIQUE (table_id, slot_id)
);

-- The project's CORE query. Without SKIP LOCKED all 10 requests queue behind
-- the FIRST free table, 9 wait and then all fail, while 5 other tables
-- sit idle.
--
--   SELECT t.id FROM tables t
--    WHERE t.seats >= :party
--      AND NOT EXISTS (SELECT 1 FROM reservations r
--                       WHERE r.table_id = t.id AND r.slot_id = :slot
--                         AND r.status <> 'CANCELLED')
--    ORDER BY t.seats ASC
--    FOR UPDATE OF t SKIP LOCKED
--    LIMIT 1;

CREATE TABLE preorder_lines (
  id                  SERIAL PRIMARY KEY,
  reservation_id      INT NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  menu_item_id        INT NOT NULL REFERENCES menu_items(id),
  qty                 INT NOT NULL CHECK (qty > 0),
  -- FROZEN at order time. A price rise next week must NOT rewrite this
  -- week's bill — the same reason an order stores the shipping address
  -- rather than pointing at the user profile.
  unit_price_at_order NUMERIC(12,2) NOT NULL
);`,
  schemaLang: 'sql',

  milestones: [
    {
      phase: 'DESIGN',
      title: 'Khách không chỉ đích danh tài nguyên nữa',
      titleEn: 'The customer stops naming the resource',
      description:
        'Bảy đồ án trước, khách nói "khung giờ 42", "ghế A12". Ở đây khách nói "một bàn cho 4 người" — bàn nào cũng được. Bài toán đổi từ "tài nguyên này còn trống không" sang "giao cho tôi MỘT tài nguyên trống bất kỳ". Hệ quả: kẻ thua bị từ chối trong lúc nhà hàng VẪN CÒN BÀN, tức là doanh thu bị vứt đi chứ không chỉ là lỗi đúng đắn.',
      descriptionEn:
        'In the previous seven projects the customer said "slot 42", "seat A12". Here they say "a table for four" — any table. The problem shifts from "is this resource free?" to "hand me SOME free resource". The consequence: a loser is turned away while the restaurant STILL HAS TABLES, which is revenue thrown away rather than merely a correctness bug.',
    },
    {
      phase: 'DESIGN',
      title: 'Rời rạc hoá thời gian thành suất, và vì sao đó là đúng ở đây',
      titleEn: 'Discretising time into sittings, and why that is right here',
      description:
        'Homestay cần EXCLUDE USING gist vì khách ở số đêm tuỳ ý. Nhà hàng thì đã nghĩ theo suất từ trước khi có phần mềm: 18:00, 19:30, 21:00, mỗi suất 90 phút. Bất biến trở thành "không trùng (bàn, suất)" — một UNIQUE ghép giải được, truy vấn chỗ trống thành NOT EXISTS trên khoá và đánh chỉ mục thẳng.',
      descriptionEn:
        'Homestay needed EXCLUDE USING gist because guests stay any number of nights. Restaurants have thought in sittings since long before software: 18:00, 19:30, 21:00, ninety minutes each. The invariant becomes "no duplicate (table, slot)" — a compound UNIQUE handles it, and availability becomes a NOT EXISTS on a key that indexes directly.',
    },
    {
      phase: 'BACKEND',
      title: 'FOR UPDATE SKIP LOCKED — kho tài nguyên thành hàng công việc',
      titleEn: 'FOR UPDATE SKIP LOCKED — the pool becomes a work queue',
      description:
        'FOR UPDATE thường khiến cả 10 request cùng chọn chiếc bàn trống đầu tiên rồi xếp hàng chờ nhau; 9 người chờ xong mới biết mình thất bại. SKIP LOCKED bảo transaction sau bỏ qua hàng đã bị khoá và lấy hàng kế tiếp, nên 6 bàn trống được nhận ĐỒNG THỜI. Đây là mẫu hình chạy mọi hàng đợi công việc viết trên Postgres.',
      descriptionEn:
        'Plain FOR UPDATE makes all 10 requests pick the first free table and queue behind each other; nine wait only to discover they failed. SKIP LOCKED tells later transactions to ignore locked rows and take the next, so six free tables are claimed CONCURRENTLY. This is the pattern behind every Postgres-based job queue.',
      codeBlock:
        'const [table] = await prisma.$queryRaw`\n'
        + '  SELECT t.id FROM "Table" t\n'
        + '   WHERE t.seats >= ${party}\n'
        + '     AND NOT EXISTS (\n'
        + '       SELECT 1 FROM "Reservation" r\n'
        + '        WHERE r.table_id = t.id AND r.slot_id = ${slotId})\n'
        + '   ORDER BY t.seats ASC          -- bàn nhỏ nhất còn vừa\n'
        + '   FOR UPDATE OF t SKIP LOCKED   -- bỏ qua bàn người khác đã khoá\n'
        + '   LIMIT 1`;',
      codeLang: 'javascript',
    },
    {
      phase: 'DATABASE',
      title: 'UNIQUE ghép vẫn phải có: hiệu quả khác với đúng đắn',
      titleEn: 'The compound UNIQUE stays: efficient is not the same as correct',
      description:
        'SKIP LOCKED làm việc phân bổ HIỆU QUẢ nhưng nó là cơ chế ở tầng ứng dụng — một script nhập liệu, một job dọn dữ liệu, hay một route mới ai đó viết vội đều đi vòng qua nó được. UNIQUE(table_id, slot_id) làm việc phân bổ ĐÚNG, cho mọi đường ghi, mãi mãi. Cùng cách chia vai với Redis+Postgres ở đồ án #6.',
      descriptionEn:
        'SKIP LOCKED makes allocation EFFICIENT but it is an application-layer mechanism — an import script, a cleanup job, or a hastily added route all bypass it. UNIQUE(table_id, slot_id) makes allocation CORRECT, for every write path, forever. The same division of labour as Redis + Postgres in project #6.',
    },
    {
      phase: 'BACKEND',
      title: 'Chốt giá món lúc đặt trước — lần thứ ba trong kỳ',
      titleEn: 'Freezing pre-order prices — the third time this semester',
      description:
        'Sau totalPrice ở đồ án #3 và dueAt ở đồ án #4, đây là lần thứ ba: mọi con số là một phần THOẢ THUẬN với khách hàng đều phải được sao chép vào bản ghi giao dịch, không phải trỏ tới bản ghi gốc. Nhà hàng tăng giá tuần sau thì hoá đơn tuần này không được đổi.',
      descriptionEn:
        'After totalPrice in project #3 and dueAt in project #4, this is the third instance: every number that forms part of an AGREEMENT with a customer must be copied into the transaction record, never referenced from the source row. A price rise next week must not rewrite this week\'s bill.',
    },
    {
      phase: 'MOBILE',
      title: 'Flutter so với Expo: hai triết lý, và cách nói về lựa chọn',
      titleEn: 'Flutter versus Expo: two philosophies, and how to justify the choice',
      description:
        'React Native ánh xạ sang widget GỐC của hệ điều hành; Flutter TỰ VẼ mọi pixel bằng Skia/Impeller. Hệ quả: RN trông đúng chất từng nền tảng nhưng khác nhau ít nhiều, Flutter giống hệt nhau ở mọi nơi kể cả khi hệ điều hành đổi. Dart biên dịch sang mã máy nên không có cầu nối JS. Đây là câu hỏi phỏng vấn, và câu trả lời tốt nêu đánh đổi chứ không nêu cái nào "hơn".',
      descriptionEn:
        'React Native maps to the OS\'s NATIVE widgets; Flutter DRAWS every pixel itself via Skia/Impeller. Consequence: RN feels native per platform but differs a little, Flutter is identical everywhere even when the OS changes. Dart compiles to machine code so there is no JS bridge. This is an interview question, and a good answer states the trade-off rather than a winner.',
    },
    {
      phase: 'MOBILE',
      title: 'Trạng thái bất đồng bộ có BA nhánh, không phải hai',
      titleEn: 'Async state has THREE branches, not two',
      description:
        'Màn hình đặt bàn có ba trạng thái thật: đang gửi, thành công, và HẾT BÀN — nhánh thứ ba không phải lỗi, nó là câu trả lời hợp lệ và cần giao diện riêng. Dùng AsyncValue của Riverpod hoặc sealed class của Dart để trình biên dịch BẮT bạn xử lý đủ ba. Chỉ xử lý hai nhánh là màn hình treo ở vòng quay khi hết bàn.',
      descriptionEn:
        'The booking screen has three real states: submitting, confirmed, and NO AVAILABILITY — the third is not an error, it is a valid answer that deserves its own UI. Use Riverpod\'s AsyncValue or a Dart sealed class so the compiler FORCES you to handle all three. Handle only two and the screen hangs on a spinner when the restaurant is full.',
      codeBlock:
        'sealed class BookingState {}\n'
        + 'class Submitting  extends BookingState {}\n'
        + 'class Confirmed   extends BookingState { final Reservation r; Confirmed(this.r); }\n'
        + 'class NoAvailable extends BookingState {}   // KHÔNG phải lỗi\n'
        + 'class Failed      extends BookingState { final String msg; Failed(this.msg); }\n\n'
        + '// switch trên sealed class ⇒ trình biên dịch bắt thiếu nhánh\n'
        + 'switch (state) {\n'
        + '  Submitting()  => const CircularProgressIndicator(),\n'
        + '  Confirmed(:final r) => ReservationCard(r),\n'
        + '  NoAvailable() => const FullyBookedView(),\n'
        + '  Failed(:final msg)  => ErrorView(msg),\n'
        + '}',
      codeLang: 'dart',
    },
    {
      phase: 'TESTING',
      title: 'Bài kiểm chứng minh SKIP LOCKED, không chỉ chứng minh tính đúng',
      titleEn: 'A test that proves SKIP LOCKED, not merely correctness',
      description:
        '6 bàn trống, bắn 10 request đồng thời: 6 thành công trên 6 BÀN KHÁC NHAU, 4 báo hết bàn. Rồi bỏ SKIP LOCKED và chạy lại: thông lượng tụt và thời gian chờ tăng. Bài kiểm thứ hai mới là bài dạy — nó cho bạn CON SỐ để giải thích vì sao hai từ khoá đó tồn tại.',
      descriptionEn:
        'With 6 free tables, fire 10 concurrent requests: 6 succeed on 6 DIFFERENT tables, 4 get no availability. Then remove SKIP LOCKED and re-run: throughput drops and wait time rises. The second run is the teaching one — it gives you the NUMBER that explains why those two keywords exist.',
    },
  ],

  features: [
    { title: 'Đặt bàn theo số người và suất', titleEn: 'Book by party size and sitting', description: 'Hệ thống tự chọn bàn nhỏ nhất còn vừa, không để nhóm 2 người chiếm bàn 8 chỗ.', descriptionEn: 'The system picks the smallest fitting table so a party of two never takes an 8-top.', status: 'PLANNED' },
    { title: 'Phân bổ song song bằng SKIP LOCKED', titleEn: 'Parallel allocation via SKIP LOCKED', description: 'Sáu bàn trống thì sáu nhóm được nhận đồng thời, không ai xếp hàng sau ai.', descriptionEn: 'Six free tables means six parties seated concurrently, with nobody queueing.', status: 'PLANNED' },
    { title: 'UNIQUE ghép chống đặt trùng ở mọi đường ghi', titleEn: 'A compound UNIQUE covering every write path', description: '@@unique([tableId, slotId]) chặn cả script nhập liệu không đi qua API.', descriptionEn: '@@unique([tableId, slotId]) also blocks import scripts that bypass the API.', status: 'PLANNED' },
    { title: 'Đặt món trước với giá chốt', titleEn: 'Pre-ordering with frozen prices', description: 'unitPriceAtOrder lưu vào dòng đặt món; đổi thực đơn không viết lại hoá đơn cũ.', descriptionEn: 'unitPriceAtOrder is stored on the line; menu edits never rewrite old bills.', status: 'PLANNED' },
    { title: 'Huỷ trả bàn về trống ngay', titleEn: 'Cancelling frees the table immediately', description: 'Truy vấn chỗ trống lọc theo trạng thái, nên bàn đã huỷ đặt lại được ngay.', descriptionEn: 'The availability query filters by status, so a cancelled table is instantly rebookable.', status: 'PLANNED' },
    { title: 'Ba trạng thái đặt bàn có giao diện riêng', titleEn: 'Three booking states with distinct UI', description: 'Đang gửi / thành công / hết bàn — nhánh thứ ba không phải lỗi.', descriptionEn: 'Submitting / confirmed / no availability — the third is not an error.', status: 'PLANNED' },
    { title: 'Token trong Keychain/Keystore', titleEn: 'Tokens in the Keychain/Keystore', description: 'flutter_secure_storage thay cho SharedPreferences.', descriptionEn: 'flutter_secure_storage instead of SharedPreferences.', status: 'PLANNED' },
    { title: 'Ghi nhận khách không đến', titleEn: 'No-show tracking', description: 'Trạng thái NO_SHOW riêng, làm cơ sở cho chính sách cọc giữ chỗ.', descriptionEn: 'A dedicated NO_SHOW status, the basis for any deposit policy.', status: 'PLANNED' },
  ],

  resources: [
    { title: 'INT608 trên Academy — bản dạy từng bước', titleEn: 'INT608 on the Academy — the step-by-step course', url: 'https://cuongthai.com/courses/restaurant-reservation-app', type: 'LINK', description: '9 mục, 21 bài, song ngữ, kèm quiz và đề thi cuối kỳ.', descriptionEn: '9 sections, 21 lessons, bilingual, with quizzes and a final exam.' },
    { title: 'PostgreSQL — The Locking Clause', titleEn: 'PostgreSQL — The Locking Clause', url: 'https://www.postgresql.org/docs/current/sql-select.html#SQL-FOR-UPDATE-SHARE', type: 'DOC', description: 'FOR UPDATE, SKIP LOCKED, NOWAIT — và sự khác nhau giữa chúng.', descriptionEn: 'FOR UPDATE, SKIP LOCKED, NOWAIT — and how they differ.' },
    { title: 'What is SKIP LOCKED for in PostgreSQL 9.5? (2ndQuadrant)', titleEn: 'What is SKIP LOCKED for in PostgreSQL 9.5? (2ndQuadrant)', url: 'https://www.enterprisedb.com/blog/what-skip-locked-postgresql-95', type: 'LINK', description: 'Bài viết kinh điển giải thích mẫu hình hàng đợi công việc.', descriptionEn: 'The classic write-up explaining the job-queue pattern.' },
    { title: 'Flutter — Architecture overview', titleEn: 'Flutter — Architecture overview', url: 'https://docs.flutter.dev/resources/architectural-overview', type: 'DOC', description: 'Vì sao Flutter tự vẽ pixel thay vì gọi widget gốc.', descriptionEn: 'Why Flutter draws its own pixels instead of calling native widgets.' },
    { title: 'Dart — Sealed classes & patterns', titleEn: 'Dart — Sealed classes & patterns', url: 'https://dart.dev/language/class-modifiers#sealed', type: 'DOC', description: 'Công cụ để trình biên dịch bắt bạn xử lý đủ ba nhánh trạng thái.', descriptionEn: 'The tool that makes the compiler force you to handle all three states.' },
    { title: 'flutter_secure_storage', titleEn: 'flutter_secure_storage', url: 'https://pub.dev/packages/flutter_secure_storage', type: 'LINK', description: 'Keychain/Keystore cho Flutter — đừng dùng SharedPreferences cho token.', descriptionEn: 'Keychain/Keystore for Flutter — never SharedPreferences for tokens.' },
  ],

  coreKnowledge: [
    { vi: 'Phân bổ từ một KHO tài nguyên khác hẳn giành một tài nguyên đích danh', en: 'Allocating from a POOL is a different problem from claiming a named resource' },
    { vi: 'Hiện tượng đoàn tàu chờ khi mọi request cùng khoá hàng đầu tiên', en: 'The convoy effect when every request locks the same first row' },
    { vi: 'FOR UPDATE SKIP LOCKED và mẫu hình hàng đợi công việc trên Postgres', en: 'FOR UPDATE SKIP LOCKED and the Postgres job-queue pattern' },
    { vi: 'Hiệu quả và đúng đắn là hai lớp khác nhau, cần hai cơ chế khác nhau', en: 'Efficiency and correctness are different layers needing different mechanisms' },
    { vi: 'Rời rạc hoá thời gian khi nghiệp vụ vốn đã theo suất', en: 'Discretising time when the business already runs in sittings' },
    { vi: 'ORDER BY sức chứa để không lãng phí tài nguyên lớn cho nhu cầu nhỏ', en: 'Ordering by capacity so large resources are not wasted on small needs' },
    { vi: 'Sao chép dữ liệu thoả thuận vào bản ghi giao dịch thay vì trỏ tới nguồn', en: 'Copying agreed values into the transaction record instead of referencing the source' },
    { vi: 'Flutter tự vẽ pixel so với React Native ánh xạ widget gốc', en: 'Flutter drawing its own pixels versus React Native mapping to native widgets' },
    { vi: 'Sealed class và mẫu khớp để trình biên dịch bắt thiếu nhánh trạng thái', en: 'Sealed classes and pattern matching so the compiler catches a missing state' },
    { vi: '"Hết chỗ" là một câu trả lời hợp lệ, không phải một lỗi', en: '"No availability" is a valid answer, not an error' },
  ],

  portfolioBonus: [
    { vi: 'Bảng đo thông lượng có và không có SKIP LOCKED, đặt trong README', en: 'A throughput comparison with and without SKIP LOCKED, in the README' },
    { vi: 'Sơ đồ bàn trực quan trong app, hiện bàn nào còn trống theo suất', en: 'A visual floor plan in the app showing which tables are free per sitting' },
    { vi: 'Nhắc lịch bằng thông báo đẩy trước giờ đặt hai tiếng', en: 'A push reminder two hours before the sitting' },
    { vi: 'Trang quản lý cho nhà hàng: xếp bàn, điểm danh, thống kê vắng', en: 'A restaurant console: seating, check-in, no-show statistics' },
    { vi: 'Chạy trên máy thật iOS và Android kèm ảnh chụp từ cả hai', en: 'Running on real iOS and Android devices with screenshots from both' },
    { vi: 'Cọc giữ chỗ cho khung giờ cao điểm, hoàn khi khách đến', en: 'A deposit for peak sittings, refunded on arrival' },
  ],

  completionOutcomes: [
    { vi: 'Nhận ra bài toán phân bổ từ kho và chọn đúng công cụ Postgres cho nó', en: 'Recognise a pool-allocation problem and pick the right Postgres tool for it' },
    { vi: 'Giải thích được đoàn tàu chờ bằng một phép đo, không phải bằng cảm giác', en: 'Explain the convoy effect with a measurement rather than a feeling' },
    { vi: 'Tách rạch ròi lớp làm cho nhanh và lớp làm cho đúng', en: 'Separate the layer that makes things fast from the layer that makes them correct' },
    { vi: 'Chọn giữa Flutter và React Native bằng đánh đổi, không bằng sở thích', en: 'Choose between Flutter and React Native on trade-offs rather than taste' },
    { vi: 'Mô hình hoá trạng thái bất đồng bộ đầy đủ để trình biên dịch bắt lỗi thay bạn', en: 'Model async state completely enough that the compiler catches your mistakes' },
  ],

  bodyMdx,
  bodyMdxEn,
};
