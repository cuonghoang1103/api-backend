/**
 * Case-study INT603 — Homestay Booking API.
 * Semester 6 internship project #3, and the semester's first API-only build.
 *
 * Its place in the through-line: the reserved thing stops being a POINT and
 * becomes an INTERVAL, so UNIQUE (and the partial index of #2) cannot express
 * the invariant at all. The answer is half-open date ranges plus a Postgres
 * EXCLUDE ... USING gist constraint.
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(
  new URL('./homestay-booking-api.md', import.meta.url),
  'utf8',
);
const bodyMdxEn = fs.readFileSync(
  new URL('./homestay-booking-api.en.md', import.meta.url),
  'utf8',
);

export default {
  slug: 'homestay-booking-api',
  title: 'Homestay Booking API (Đồ án thực tập #3)',
  titleEn: 'Homestay Booking API (Internship Project #3)',
  description:
    'Đồ án API-only đầu tiên của Kỳ 6: Node + Express + Prisma + PostgreSQL. Thứ được đặt không còn là một điểm mà là một KHOẢNG — 10→13 và 11→14 không có giá trị nào trùng nhau nên không ràng buộc UNIQUE nào bắt được. Giải bằng khoảng nửa mở [) và ràng buộc EXCLUDE USING gist của Postgres.',
  descriptionEn:
    'The first API-only Semester 6 project: Node + Express + Prisma + PostgreSQL. What gets reserved is no longer a point but an INTERVAL — 10→13 and 11→14 share no equal value, so no UNIQUE constraint can catch the clash. Solved with half-open ranges and a Postgres EXCLUDE USING gist constraint.',
  techStack: [
    'Node.js', 'Express', 'TypeScript', 'Prisma', 'PostgreSQL', 'btree_gist',
    'zod', 'JWT', 'bcrypt', 'OpenAPI / Swagger UI', 'Vitest', 'Docker Compose',
  ],
  role: 'Backend (một người)',
  roleEn: 'Backend (solo)',
  duration: '3 tuần',
  durationEn: '3 weeks',
  status: 'PLANNING',
  category: 'Backend',
  difficulty: 'INTERMEDIATE',
  thumbnailUrl: 'https://media.cuongthai.com/images/projects/homestay-booking-api.webp',
  projectUrl: null,
  githubUrl: null,
  startDate: null,
  endDate: null,
  isFeatured: false,
  isPublished: true,

  schemaCode: `-- Prisma KHÔNG có cú pháp cho EXCLUDE, nên ràng buộc phải nằm trong
-- một migration SQL viết tay. Và đừng dùng \`prisma db push\` với schema
-- này: nó bỏ qua migration thủ công và ràng buộc sẽ biến mất im lặng.

CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE "Booking" (
  id          SERIAL PRIMARY KEY,
  "roomId"    INT  NOT NULL REFERENCES "Room"(id),
  "guestId"   INT  NOT NULL REFERENCES "User"(id),
  -- Kiểu date THUẦN, không phải timestamp: đêm nghỉ không có múi giờ.
  "checkIn"   DATE NOT NULL,           -- BAO GỒM
  "checkOut"  DATE NOT NULL,           -- KHÔNG bao gồm — nửa mở [)
  status      VARCHAR(16) NOT NULL DEFAULT 'CONFIRMED',
  -- Giá CHỐT lúc đặt. Tính lại lúc hiển thị là hoá đơn cũ đổi theo
  -- bảng giá mới của chủ nhà.
  "totalPrice" NUMERIC(12,2) NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT stay_at_least_one_night CHECK ("checkOut" > "checkIn")
);

-- BẤT BIẾN CỦA CẢ HỆ THỐNG, một câu duy nhất:
-- không tồn tại hai lượt đặt CONFIRMED cùng phòng mà khoảng ngày chồng nhau.
-- UNIQUE không làm được việc này: 10→13 và 11→14 không bằng nhau ở cột nào.
ALTER TABLE "Booking"
  ADD CONSTRAINT no_overlap
  EXCLUDE USING gist (
    "roomId" WITH =,                                 -- cùng MỘT phòng
    daterange("checkIn", "checkOut", '[)') WITH &&   -- và khoảng CHỒNG nhau
  )
  WHERE (status = 'CONFIRMED');                      -- huỷ rồi thì không chặn ai

-- "Lịch kín của phòng X" và "chuyến của tôi".
CREATE INDEX idx_booking_room ON "Booking" ("roomId", "checkIn");
CREATE INDEX idx_booking_guest ON "Booking" ("guestId", "createdAt" DESC);`,
  schemaCodeEn: `-- Prisma has NO syntax for EXCLUDE, so the constraint must live in a
-- hand-written SQL migration. And never use \`prisma db push\` with this
-- schema: it skips hand-written migrations and the constraint silently
-- disappears.

CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE "Booking" (
  id          SERIAL PRIMARY KEY,
  "roomId"    INT  NOT NULL REFERENCES "Room"(id),
  "guestId"   INT  NOT NULL REFERENCES "User"(id),
  -- A PLAIN date type, not a timestamp: a night has no time zone.
  "checkIn"   DATE NOT NULL,           -- INCLUSIVE
  "checkOut"  DATE NOT NULL,           -- EXCLUSIVE — half-open [)
  status      VARCHAR(16) NOT NULL DEFAULT 'CONFIRMED',
  -- Price FROZEN at booking time. Recomputing it at render time means a
  -- host editing their price list rewrites old invoices.
  "totalPrice" NUMERIC(12,2) NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT stay_at_least_one_night CHECK ("checkOut" > "checkIn")
);

-- THE SYSTEM INVARIANT, in a single sentence:
-- no two CONFIRMED bookings for one room may have overlapping ranges.
-- UNIQUE cannot do this: 10→13 and 11→14 are equal on no column.
ALTER TABLE "Booking"
  ADD CONSTRAINT no_overlap
  EXCLUDE USING gist (
    "roomId" WITH =,                                 -- the SAME room
    daterange("checkIn", "checkOut", '[)') WITH &&   -- and OVERLAPPING ranges
  )
  WHERE (status = 'CONFIRMED');                      -- cancelled blocks nobody

-- "Room X's occupancy calendar" and "my trips".
CREATE INDEX idx_booking_room ON "Booking" ("roomId", "checkIn");
CREATE INDEX idx_booking_guest ON "Booking" ("guestId", "createdAt" DESC);`,
  schemaLang: 'sql',

  milestones: [
    {
      phase: 'DESIGN',
      title: 'Chốt quy ước khoảng nửa mở trước khi viết dòng SQL nào',
      titleEn: 'Fix the half-open convention before writing any SQL',
      description:
        'Khoảng đặt phòng là [check_in, check_out): bao gồm ngày nhận, KHÔNG bao gồm ngày trả. Quy ước này phải giữ ở mọi nơi — zod, service, SQL, tài liệu. Dùng khoảng đóng và so sánh <=/>= là từ chối lượt đặt nối tiếp hợp lệ và mất một đêm doanh thu mỗi lần có khách nối tiếp. Bạn đang mô hình hoá ĐÊM, không phải NGÀY.',
      descriptionEn:
        'A stay is [check_in, check_out): check-in included, check-out excluded. Hold that convention everywhere — zod, service, SQL, docs. Closed ranges with <=/>= reject valid back-to-back stays and cost a night of revenue each time. You are modelling NIGHTS, not DAYS.',
      codeBlock:
        '// A = [in_A, out_A)  chồng  B = [in_B, out_B)  ⟺\n'
        + 'in_A < out_B  &&  out_A > in_B\n\n'
        + '// Phòng 7 đã có 10/8 → 13/8 (đêm 10, 11, 12):\n'
        + '//   13/8 → 15/8   13 < 13? KHÔNG        → hợp lệ ✅\n'
        + '//   12/8 → 14/8   12<13 ✓ và 14>10 ✓    → chồng ✗\n'
        + '//   05/8 → 10/8   05<13 ✓ nhưng 10>10? KHÔNG → hợp lệ ✅',
      codeLang: 'javascript',
    },
    {
      phase: 'DATABASE',
      title: 'EXCLUDE USING gist — bất biến mà UNIQUE không nói được',
      titleEn: 'EXCLUDE USING gist — the invariant UNIQUE cannot express',
      description:
        'UNIQUE nói "không hai hàng nào BẰNG NHAU". EXCLUDE nói "không hai hàng nào THOẢ TOÁN TỬ NÀY" — và toán tử có thể là && (chồng nhau). btree_gist là thứ cho phép cột thường (=) đứng chung chỉ mục GiST với cột khoảng (&&). Mệnh đề WHERE biến nó thành ràng buộc bộ phận, để lượt đã huỷ không chặn ai.',
      descriptionEn:
        'UNIQUE says "no two rows are EQUAL". EXCLUDE says "no two rows SATISFY THIS OPERATOR" — and the operator can be && (overlaps). btree_gist is what lets a plain-equality column share a GiST index with a range column. The WHERE clause makes it partial, so cancelled stays block nobody.',
      codeBlock:
        'CREATE EXTENSION IF NOT EXISTS btree_gist;\n\n'
        + 'ALTER TABLE "Booking"\n'
        + '  ADD CONSTRAINT no_overlap\n'
        + '  EXCLUDE USING gist (\n'
        + '    "roomId" WITH =,\n'
        + "    daterange(\"checkIn\", \"checkOut\", '[)') WITH &&\n"
        + '  )\n'
        + "  WHERE (status = 'CONFIRMED');",
      codeLang: 'sql',
    },
    {
      phase: 'BACKEND',
      title: 'Express phân lớp và zod ở đúng một chỗ',
      titleEn: 'Layered Express with zod in exactly one place',
      description:
        'router → controller → service → prisma. Mọi dữ liệu vào đi qua một middleware validate dùng schema zod, và CHÍNH schema đó sinh ra tài liệu OpenAPI — một nguồn sự thật cho cả kiểm tra lúc chạy, kiểu TypeScript, lẫn tài liệu. Viết validate ở hai nơi là bảo đảm chúng sẽ lệch nhau.',
      descriptionEn:
        'router → controller → service → prisma. All input passes one validation middleware built from zod schemas, and those same schemas generate the OpenAPI document — one source of truth for runtime checks, TypeScript types and docs. Validating in two places guarantees they drift.',
    },
    {
      phase: 'BACKEND',
      title: 'Bắt 23P01 và biến nó thành 409 tử tế',
      titleEn: 'Catching 23P01 and turning it into a clean 409',
      description:
        'Vẫn giữ phép kiểm findFirst để có thông báo thân thiện và tránh một vòng ghi vô ích — nhưng nguồn sự thật là ràng buộc. Khi cuộc đua thật xảy ra, Postgres ném exclusion_violation mã 23P01; không bắt là người dùng nhận 500 cho một tình huống hoàn toàn bình thường.',
      descriptionEn:
        'Keep the findFirst check for a friendly message and to avoid a pointless write — but the constraint is the source of truth. When a real race happens Postgres raises exclusion_violation, code 23P01; leave it uncaught and users get a 500 for an entirely normal outcome.',
      codeBlock:
        'try {\n'
        + '  return await prisma.booking.create({ data: { ... } });\n'
        + '} catch (e) {\n'
        + "  if (e.code === 'P2010' || e.meta?.code === '23P01')\n"
        + "    throw new ConflictError('Phòng không còn trống trong khoảng ngày này');\n"
        + '  throw e;\n'
        + '}',
      codeLang: 'javascript',
    },
    {
      phase: 'BACKEND',
      title: 'Chốt giá lúc đặt, không tính lại lúc hiển thị',
      titleEn: 'Freeze the price at booking, never recompute at render',
      description:
        'Giá mỗi đêm có thể theo mùa và chủ nhà sửa được bất cứ lúc nào. Nếu totalPrice được tính lại mỗi lần đọc, hoá đơn của tháng trước đổi theo bảng giá hôm nay. Giá là THOẢ THUẬN TẠI THỜI ĐIỂM ĐẶT — nó phải được lưu. Đây là cùng loại quyết định với việc lưu địa chỉ giao hàng vào đơn thay vì trỏ tới hồ sơ người dùng.',
      descriptionEn:
        'Nightly prices vary by season and the host can edit them at any time. Recompute totalPrice on every read and last month\'s invoice follows today\'s price list. A price is THE AGREEMENT AT BOOKING TIME — it must be stored. Same class of decision as copying the shipping address into an order rather than pointing at the user profile.',
    },
    {
      phase: 'TESTING',
      title: 'Chứng minh bằng 30 request bung ra cùng lúc',
      titleEn: 'Proving it with 30 simultaneous requests',
      description:
        'Vòng lặp curl có & ở cuối, gom kết quả bằng sort | uniq -c, và kết quả phải là đúng 1 dòng 201 với 29 dòng 409. Sau đó xoá tạm phép kiểm findFirst rồi chạy lại — vẫn 1/29, đó là bằng chứng ràng buộc thật sự đang gánh chứ không phải câu if.',
      descriptionEn:
        'A curl loop with a trailing &, results aggregated by sort | uniq -c, and the output must be exactly one 201 with twenty-nine 409s. Then temporarily delete the findFirst check and re-run — still 1/29, which proves the constraint is carrying the weight rather than the if statement.',
      codeBlock:
        'for i in $(seq 1 30); do\n'
        + '  curl -s -o /dev/null -w "%{http_code}\\n" \\\n'
        + '    -X POST localhost:3000/bookings \\\n'
        + '    -H "Authorization: Bearer $TOKEN" \\\n'
        + "    -d '{\"roomId\":7,\"checkIn\":\"2026-08-10\",\"checkOut\":\"2026-08-13\"}' &\n"
        + 'done | sort | uniq -c\n\n'
        + '#   1 201\n'
        + '#  29 409',
      codeLang: 'bash',
    },
    {
      phase: 'DEVOPS',
      title: 'OpenAPI là giao diện của một dự án không có giao diện',
      titleEn: 'OpenAPI is the UI of a project with no UI',
      description:
        'Sinh tài liệu từ chính schema zod bằng zod-to-openapi, phục vụ Swagger UI ở /docs. Người chấm mở một URL là bấm thử được mọi endpoint mà không cần Postman và không cần bạn ngồi cạnh. Kèm một bộ sưu tập request chạy được trong repo: đăng ký → đăng nhập → đặt → đặt chồng → 409.',
      descriptionEn:
        'Generate the document from the zod schemas with zod-to-openapi and serve Swagger UI at /docs. A grader opens one URL and can exercise every endpoint without Postman and without you next to them. Ship a runnable request collection in the repo too: register → sign in → book → overlap → 409.',
    },
    {
      phase: 'DEVOPS',
      title: 'Docker Compose và cái bẫy prisma db push',
      titleEn: 'Docker Compose and the prisma db push trap',
      description:
        'Hai service: api và db. Bẫy riêng của đồ án này: ràng buộc EXCLUDE không có cú pháp trong schema.prisma, nên nó chỉ tồn tại trong migration SQL viết tay. Chạy prisma db push là bỏ qua migration và ràng buộc biến mất im lặng — hệ thống trông vẫn chạy cho tới lần đặt chồng đầu tiên.',
      descriptionEn:
        'Two services: api and db. This project\'s own trap: the EXCLUDE constraint has no schema.prisma syntax, so it exists only in a hand-written SQL migration. Running prisma db push skips migrations and the constraint silently vanishes — everything still looks fine until the first overlapping booking.',
    },
  ],

  features: [
    { title: 'Chủ nhà đăng phòng và bảng giá theo mùa', titleEn: 'Hosts list rooms with seasonal pricing', description: 'Phòng có giá mặc định và các khoảng giá riêng theo ngày.', descriptionEn: 'Rooms carry a base price plus date-scoped price rules.', status: 'PLANNED' },
    { title: 'Tìm phòng trống theo khoảng ngày', titleEn: 'Availability search by date range', description: 'Loại bỏ phòng có lượt đặt chồng khoảng ngày, dùng đúng logic nửa mở.', descriptionEn: 'Excludes rooms with overlapping stays, using the same half-open logic.', status: 'PLANNED' },
    { title: 'Đặt phòng không thể chồng ngày', titleEn: 'Bookings that cannot overlap', description: 'EXCLUDE USING gist thực thi ở tầng lưu trữ; mọi đường ghi đều bị chặn.', descriptionEn: 'EXCLUDE USING gist enforced at the storage layer; every write path is covered.', status: 'PLANNED' },
    { title: 'Huỷ trả phòng về trống ngay', titleEn: 'Cancelling frees the room immediately', description: 'Ràng buộc bộ phận chỉ áp cho CONFIRMED nên lượt huỷ không chặn ai.', descriptionEn: 'The partial constraint only covers CONFIRMED, so cancelled stays block nobody.', status: 'PLANNED' },
    { title: 'Giá chốt tại thời điểm đặt', titleEn: 'Price frozen at booking time', description: 'totalPrice lưu vào hàng booking; sửa bảng giá không đổi hoá đơn cũ.', descriptionEn: 'totalPrice is stored on the booking row; editing the price list leaves old invoices alone.', status: 'PLANNED' },
    { title: 'Lịch kín của phòng cho chủ nhà', titleEn: 'Occupancy calendar for hosts', description: 'Xem theo tháng, các đêm đã kín và lượt đặt tương ứng.', descriptionEn: 'A month view showing occupied nights and the stays behind them.', status: 'PLANNED' },
    { title: 'Tài liệu OpenAPI sinh từ schema zod', titleEn: 'OpenAPI generated from the zod schemas', description: 'Một nguồn sự thật cho validate lúc chạy, kiểu TypeScript và tài liệu.', descriptionEn: 'One source of truth for runtime validation, TypeScript types and docs.', status: 'PLANNED' },
    { title: 'Kịch bản đua bằng shell trong repo', titleEn: 'A shell race script in the repo', description: '30 request đồng thời, gom kết quả bằng uniq -c, kỳ vọng 1×201 và 29×409.', descriptionEn: '30 simultaneous requests aggregated with uniq -c, expecting 1×201 and 29×409.', status: 'PLANNED' },
  ],

  resources: [
    { title: 'INT603 trên Academy — bản dạy từng bước', titleEn: 'INT603 on the Academy — the step-by-step course', url: 'https://cuongthai.com/courses/homestay-booking-api', type: 'LINK', description: '9 mục, 22 bài, song ngữ, kèm quiz và đề thi cuối kỳ.', descriptionEn: '9 sections, 22 lessons, bilingual, with quizzes and a final exam.' },
    { title: 'PostgreSQL — Exclusion Constraints', titleEn: 'PostgreSQL — Exclusion Constraints', url: 'https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-EXCLUSION', type: 'DOC', description: 'Ví dụ chính thức trong tài liệu là bài toán đặt phòng — đúng đồ án này.', descriptionEn: 'The official example in the docs is a room-booking problem — exactly this project.' },
    { title: 'PostgreSQL — Range Types', titleEn: 'PostgreSQL — Range Types', url: 'https://www.postgresql.org/docs/current/rangetypes.html', type: 'DOC', description: 'daterange, ký hiệu biên [) và toán tử chồng nhau &&.', descriptionEn: 'daterange, the [) bound notation, and the && overlap operator.' },
    { title: 'Prisma — Customizing migrations', titleEn: 'Prisma — Customizing migrations', url: 'https://www.prisma.io/docs/orm/prisma-migrate/workflows/customizing-migrations', type: 'DOC', description: 'Cách nhét SQL thủ công vào migration mà lần chạy sau không mất.', descriptionEn: 'How to add hand-written SQL to a migration so later runs do not lose it.' },
    { title: 'zod-to-openapi', titleEn: 'zod-to-openapi', url: 'https://github.com/asteasolutions/zod-to-openapi', type: 'REPO', description: 'Biến schema zod thành tài liệu OpenAPI — một nguồn sự thật.', descriptionEn: 'Turns zod schemas into an OpenAPI document — one source of truth.' },
    { title: 'Allen\'s interval algebra', titleEn: 'Allen\'s interval algebra', url: 'https://en.wikipedia.org/wiki/Allen%27s_interval_algebra', type: 'LINK', description: '13 quan hệ có thể có giữa hai khoảng. Đọc để hiểu vì sao chỉ cần hai phép so sánh.', descriptionEn: 'The 13 possible relations between two intervals. Read it to see why two comparisons suffice.' },
  ],

  coreKnowledge: [
    { vi: 'Khoảng nửa mở [start, end) và vì sao nó xoá sổ cả lớp lỗi lệch một đơn vị', en: 'Half-open intervals [start, end) and why they erase a whole class of off-by-one bugs' },
    { vi: 'Điều kiện chồng khoảng: in_A < out_B AND out_A > in_B, và cách tự kiểm bằng bảng', en: 'The overlap condition in_A < out_B AND out_A > in_B, and checking it with a truth table' },
    { vi: 'Ràng buộc EXCLUDE: tổng quát hoá của UNIQUE sang toán tử bất kỳ', en: 'EXCLUDE constraints: UNIQUE generalised to an arbitrary operator' },
    { vi: 'Chỉ mục GiST và vai trò của btree_gist khi trộn cột thường với cột khoảng', en: 'GiST indexes and what btree_gist does when mixing scalar and range columns' },
    { vi: 'So sánh EXCLUDE với SERIALIZABLE-rồi-thử-lại: khai báo một lần so với gánh nặng cho mọi caller', en: 'EXCLUDE versus SERIALIZABLE-and-retry: declare once versus burden every caller' },
    { vi: 'Kiểu date thuần so với timestamp, và vì sao đêm nghỉ không có múi giờ', en: 'Plain date versus timestamp, and why a night has no time zone' },
    { vi: 'Dữ liệu chốt tại thời điểm giao dịch: giá, địa chỉ, điều khoản', en: 'Data frozen at transaction time: prices, addresses, terms' },
    { vi: 'zod làm một nguồn sự thật cho validate, kiểu TypeScript và tài liệu OpenAPI', en: 'zod as one source of truth for validation, TypeScript types and OpenAPI docs' },
    { vi: 'Migration SQL viết tay trong Prisma, và vì sao db push phá hỏng chúng', en: 'Hand-written SQL migrations in Prisma, and why db push destroys them' },
    { vi: 'Chứng minh tính đúng đắn của API mà không có giao diện: OpenAPI, bộ sưu tập request, kịch bản đua', en: 'Proving an API correct without a UI: OpenAPI, request collections, race scripts' },
  ],

  portfolioBonus: [
    { vi: 'Ảnh chụp đầu ra `sort | uniq -c` trong README: 1×201, 29×409', en: 'A screenshot of the `sort | uniq -c` output in the README: 1×201, 29×409' },
    { vi: 'Swagger UI công khai, có sẵn tài khoản demo để bấm thử ngay', en: 'A public Swagger UI with demo credentials so anyone can try it immediately' },
    { vi: 'Bài test chèn thẳng bằng psql chứng minh ràng buộc chặn cả đường ngoài API', en: 'A psql-level test proving the constraint blocks writes that bypass the API' },
    { vi: 'Endpoint lịch kín trả về theo tháng, vẽ được thành lịch ngay', en: 'A calendar endpoint returning a month at a time, renderable as-is' },
    { vi: 'Giới hạn tần suất theo IP cho các route đặt phòng', en: 'Per-IP rate limiting on the booking routes' },
    { vi: 'Bộ sưu tập request có kịch bản đầy đủ đi kèm repo', en: 'A full-scenario request collection committed alongside the code' },
  ],

  completionOutcomes: [
    { vi: 'Nhận ra khi nào bài toán là KHOẢNG chứ không phải điểm, và ràng buộc bằng-nhau bó tay', en: 'Recognise when a problem is about INTERVALS and equality constraints cannot help' },
    { vi: 'Viết được ràng buộc loại trừ và giải thích được vì sao nó mạnh hơn kiểm trong mã', en: 'Write an exclusion constraint and explain why it beats checking in code' },
    { vi: 'Thiết kế API sạch, có kiểm dữ liệu vào và tài liệu sinh tự động', en: 'Design a clean API with validated input and generated documentation' },
    { vi: 'Chứng minh phần mềm chạy đúng khi không có gì để chỉ tay vào', en: 'Prove software works when there is nothing to point at' },
    { vi: 'Biết khi nào dữ liệu phải chốt lại thay vì tính lại', en: 'Know when data must be frozen rather than recomputed' },
  ],

  bodyMdx,
  bodyMdxEn,
};
