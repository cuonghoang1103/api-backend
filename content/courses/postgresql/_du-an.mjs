/**
 * PostgreSQL — "Dự án xuyên suốt khoá" (hợp đồng: docs/du-an-hop-dong.md v1, 22/11/2026).
 *
 * MỘT nguồn sự thật cho:
 *   1. `duAn` ở cấp gốc của content/courses/postgresql.mjs;
 *   2. bài mốc `postgresql-moc-N` (type EXERCISE, mocDuAn N) chèn TRƯỚC quiz của Chương N (N = 1…17) — xem coMoc() trong postgresql.mjs;
 *   3. bài `postgresql-bao-ve-du-an` (baoVeDuAn) cuối phần thi cuối khoá;
 *   4. đoạn mời đăng ký nối cuối bài 0.1 (cờ dangKyDuAn).
 *
 * Dự án của khoá này là CƠ SỞ DỮ LIỆU của một sản phẩm thật (lược đồ + dữ liệu + truy vấn + vận hành), không phải giao diện.
 * Đề tài mẫu trong phần "chạy thật" là "Sân cầu lông" — cố ý KHÔNG nằm trong danh sách gợi ý, và khác CT Shop của các lab
 * (lab giữ nguyên; mốc dự án là THÊM). Mã + output thật: ./_du-an-ma.mjs (sinh từ ./_du-an-nguon/*.sql).
 *
 * Chuỗi dữ liệu: CHỮ THUẦN 'EN|||VI', nháy đơn; tiếng Anh dùng ’ thay nháy đơn; không backtick, không gạch chéo ngược.
 */
import { DEMO } from './_du-an-ma.mjs';

const CH = [
  null,
  'Chapter 1 — Why PostgreSQL exists|||Chương 1 — Vì sao PostgreSQL tồn tại',
  'Chapter 2 — Data types|||Chương 2 — Kiểu dữ liệu',
  'Chapter 3 — Tables, constraints & schema design|||Chương 3 — Bảng, ràng buộc & thiết kế lược đồ',
  'Chapter 4 — Inserting & querying|||Chương 4 — Chèn & truy vấn',
  'Chapter 5 — JOINs|||Chương 5 — JOIN',
  'Chapter 6 — Aggregation & grouping|||Chương 6 — Tổng hợp & gom nhóm',
  'Chapter 7 — Subqueries & CTEs|||Chương 7 — Truy vấn con & CTE',
  'Chapter 8 — Window functions|||Chương 8 — Hàm cửa sổ',
  'Chapter 9 — Indexes|||Chương 9 — Chỉ mục',
  'Chapter 10 — EXPLAIN & the planner|||Chương 10 — EXPLAIN & bộ lập kế hoạch',
  'Chapter 11 — Transactions & concurrency|||Chương 11 — Giao dịch & đồng thời',
  'Chapter 12 — Functions, triggers & views|||Chương 12 — Hàm, trigger & view',
  'Chapter 13 — JSONB & full-text search|||Chương 13 — JSONB & full-text search',
  'Chapter 14 — Connections, pooling & operating|||Chương 14 — Kết nối, pool & vận hành',
  'Chapter 15 — Backup, replication & scaling|||Chương 15 — Sao lưu, nhân bản & mở rộng',
  'Chapter 16 — PostgreSQL in production|||Chương 16 — PostgreSQL trên production',
  'Chapter 17 — SQL Server · MySQL · PostgreSQL · MongoDB|||Chương 17 — SQL Server · MySQL · PostgreSQL · MongoDB',
];

/* ───────────────────────────── Đề tài gợi ý ───────────────────────────── */
// banDoChuong: đúng 17 mục, mục thứ i là mốc i.
const bd = (arr) => arr.map((dung, i) => ({ moc: i + 1, dung }));

const DE_TAI = [
  {
    slug: 'thu-vien-truong',
    ten: 'University library|||Thư viện trường',
    moTa: 'The database behind a campus library: books and their physical copies, students and lecturers who borrow them, loans with due dates, reservations and late fines. Librarians use the reports; students search the catalogue.|||Cơ sở dữ liệu phía sau thư viện trường: đầu sách và từng bản sao vật lý, sinh viên và giảng viên mượn sách, phiếu mượn có hạn trả, đặt trước và tiền phạt trả muộn. Thủ thư dùng báo cáo; sinh viên tra cứu danh mục.',
    doKho: 1,
    tinhNang: [
      'Catalogue: titles, authors (many-to-many), categories, ISBN unique|||Danh mục: đầu sách, tác giả (nhiều-nhiều), thể loại, ISBN duy nhất',
      'Physical copies with barcode and shelf location|||Bản sao vật lý có mã vạch và vị trí kệ',
      'Readers with role (student / lecturer) and borrowing limits|||Bạn đọc có vai trò (sinh viên / giảng viên) và hạn mức mượn',
      'Loans and returns; a copy cannot be lent twice at once|||Mượn và trả; một bản sao không thể cho mượn hai lần cùng lúc',
      'Reservations queue for a title that is fully lent out|||Hàng đợi đặt trước cho đầu sách đã hết bản',
      'Late fines computed from due date, paid or waived|||Tiền phạt trả muộn tính từ hạn trả, đã nộp hoặc được miễn',
      'Reports: most borrowed titles per month, overdue list|||Báo cáo: sách mượn nhiều nhất theo tháng, danh sách quá hạn',
      'Full-text search on title and author without accents|||Tìm toàn văn theo tên sách và tác giả, gõ không dấu vẫn ra',
    ],
    banDoChuong: bd([
      'List entities (title, copy, reader, loan, fine) and the 5 questions librarians ask|||Liệt kê thực thể (đầu sách, bản sao, bạn đọc, phiếu mượn, phạt) và 5 câu thủ thư hay hỏi',
      'ISBN as text, due dates as date, fines as integer VND, reader role as enum|||ISBN là text, hạn trả là date, tiền phạt là số nguyên VND, vai trò bạn đọc là enum',
      'Tables with FKs title–copy–loan, UNIQUE barcode, CHECK due_date after borrowed_at|||Bảng có FK đầu sách–bản sao–phiếu mượn, UNIQUE mã vạch, CHECK hạn trả sau ngày mượn',
      'Seed 300 titles, 900 copies, 500 readers, 3,000 loans; upsert a reader by student code|||Nạp 300 đầu sách, 900 bản sao, 500 bạn đọc, 3.000 phiếu mượn; upsert bạn đọc theo mã sinh viên',
      'Catalogue page query with authors; readers who never borrowed (anti-join)|||Truy vấn trang danh mục kèm tác giả; bạn đọc chưa từng mượn (anti-join)',
      'Loans per category per month; fines collected vs waived with FILTER|||Lượt mượn theo thể loại theo tháng; tiền phạt thu vs miễn bằng FILTER',
      'CTE for the overdue list; recursive CTE for the category tree|||CTE cho danh sách quá hạn; CTE đệ quy cho cây thể loại',
      'Top 3 titles per category with ROW_NUMBER; days between two loans of one reader|||Top 3 sách mỗi thể loại bằng ROW_NUMBER; số ngày giữa hai lần mượn của một bạn đọc',
      'Index for "my current loans" and a partial index on open loans|||Chỉ mục cho "sách tôi đang mượn" và chỉ mục một phần cho phiếu chưa trả',
      'EXPLAIN ANALYZE of the overdue report before/after your fix|||EXPLAIN ANALYZE báo cáo quá hạn trước/sau khi sửa',
      'Lend a copy safely: two librarians scanning the same copy cannot both succeed|||Cho mượn an toàn: hai thủ thư quét cùng một bản sao không thể cùng thành công',
      'Trigger that computes the fine on return; view "available copies"|||Trigger tính tiền phạt khi trả; view "bản sao còn trên kệ"',
      'jsonb for edition details; Vietnamese search with unaccent|||jsonb cho chi tiết ấn bản; tìm tiếng Việt bằng unaccent',
      'Role for the circulation app without DROP/DELETE; pool size reasoning|||Role cho app mượn-trả không có DROP/DELETE; lập luận kích thước pool',
      'Nightly pg_dump + a restore drill; partition loans by year (stretch)|||pg_dump hằng đêm + diễn tập khôi phục; phân vùng phiếu mượn theo năm (nâng cao)',
      'Production checklist run on your schema; migrations from the app side|||Chạy checklist production trên lược đồ của bạn; migration từ phía app',
      'ADR: would the catalogue fit MongoDB better? Answer with your own queries|||ADR: danh mục có hợp MongoDB hơn không? Trả lời bằng chính truy vấn của bạn',
    ]),
    thamKhaoThat: [
      'Koha — open-source library system used by many libraries, stores its catalogue in a relational database|||Koha — hệ thống thư viện mã nguồn mở nhiều thư viện dùng, lưu danh mục trong cơ sở dữ liệu quan hệ',
      'The circulation desk of your own university library|||Quầy mượn trả của chính thư viện trường bạn',
    ],
    anh: null,
  },
  {
    slug: 'phong-kham',
    ten: 'Clinic appointment booking|||Đặt lịch phòng khám',
    moTa: 'A multi-doctor clinic: doctors with weekly working hours, patients, appointments that must never overlap for the same doctor, visit notes and invoices. The receptionist books, doctors see their day, the owner reads revenue.|||Phòng khám nhiều bác sĩ: bác sĩ có giờ làm theo tuần, bệnh nhân, lịch hẹn không bao giờ được trùng giờ của cùng một bác sĩ, ghi chú khám và hoá đơn. Lễ tân đặt lịch, bác sĩ xem lịch trong ngày, chủ phòng khám xem doanh thu.',
    doKho: 2,
    tinhNang: [
      'Doctors, specialties, weekly schedules|||Bác sĩ, chuyên khoa, lịch làm theo tuần',
      'Patients with phone unique and date of birth|||Bệnh nhân có số điện thoại duy nhất và ngày sinh',
      'Appointments as time ranges; no overlap per doctor (exclusion constraint)|||Lịch hẹn là khoảng thời gian; không trùng theo bác sĩ (ràng buộc exclusion)',
      'Status flow: booked → checked-in → done / no-show / cancelled|||Luồng trạng thái: đã đặt → đã đến → xong / không đến / huỷ',
      'Free slots of a doctor for a day|||Khung giờ trống của một bác sĩ trong ngày',
      'Visit notes and prescriptions (jsonb)|||Ghi chú khám và đơn thuốc (jsonb)',
      'Invoices and revenue per doctor per month|||Hoá đơn và doanh thu theo bác sĩ theo tháng',
      'No-show rate report|||Báo cáo tỉ lệ bệnh nhân không đến',
    ],
    banDoChuong: bd([
      'Entities: doctor, specialty, schedule, patient, appointment, invoice; 5 key questions|||Thực thể: bác sĩ, chuyên khoa, lịch làm, bệnh nhân, lịch hẹn, hoá đơn; 5 câu hỏi chính',
      'timestamptz in Asia/Ho_Chi_Minh, status enum, money as integer VND|||timestamptz theo Asia/Ho_Chi_Minh, trạng thái enum, tiền là số nguyên VND',
      'FKs, UNIQUE phone, CHECK ends_at after starts_at|||FK, UNIQUE số điện thoại, CHECK giờ kết thúc sau giờ bắt đầu',
      'Seed 10 doctors, 2,000 patients, 8,000 appointments over 3 months|||Nạp 10 bác sĩ, 2.000 bệnh nhân, 8.000 lịch hẹn trong 3 tháng',
      'Day view of a doctor with patient names; patients with no visit this year|||Lịch trong ngày của bác sĩ kèm tên bệnh nhân; bệnh nhân năm nay chưa khám',
      'Revenue per doctor per month; no-show count with FILTER|||Doanh thu theo bác sĩ theo tháng; số lượt không đến bằng FILTER',
      'Recursive CTE that generates the day’s slots, anti-join for free ones|||CTE đệ quy sinh khung giờ trong ngày, anti-join lấy khung trống',
      'Running revenue per day; LAG for "days since last visit"|||Doanh thu cộng dồn theo ngày; LAG cho "số ngày từ lần khám trước"',
      'Composite index (doctor_id, starts_at) for the day view|||Chỉ mục ghép (doctor_id, starts_at) cho lịch trong ngày',
      'EXPLAIN ANALYZE of the free-slot query|||EXPLAIN ANALYZE truy vấn khung trống',
      'Exclusion constraint stops two receptionists booking the same slot|||Ràng buộc exclusion chặn hai lễ tân đặt cùng một khung giờ',
      'Trigger for updated_at and status history; view "today’s queue"|||Trigger cho updated_at và lịch sử trạng thái; view "hàng chờ hôm nay"',
      'Prescription as jsonb with GIN; search notes by symptom|||Đơn thuốc dạng jsonb có GIN; tìm ghi chú theo triệu chứng',
      'Separate roles for receptionist app and reporting; least privilege|||Role riêng cho app lễ tân và báo cáo; quyền tối thiểu',
      'Backup + restore drill; read replica for reports (stretch)|||Sao lưu + diễn tập khôi phục; bản sao đọc cho báo cáo (nâng cao)',
      'Checklist: FK indexes, timezone, slow-query logging|||Checklist: chỉ mục cho FK, múi giờ, log truy vấn chậm',
      'ADR comparing your schema with a document model for visit notes|||ADR so lược đồ của bạn với mô hình tài liệu cho ghi chú khám',
    ]),
    thamKhaoThat: [
      'Online appointment booking pages of hospitals and private clinics in Vietnam|||Trang đặt lịch khám trực tuyến của bệnh viện và phòng khám tư ở Việt Nam',
      'OpenEMR — open-source medical records system with appointments|||OpenEMR — hệ thống hồ sơ y tế mã nguồn mở có đặt lịch hẹn',
    ],
    anh: null,
  },
  {
    slug: 'nha-tro',
    ten: 'Boarding house / dormitory management|||Quản lý nhà trọ / ký túc xá',
    moTa: 'A landlord with several buildings near campus: rooms, tenants, contracts, monthly electricity and water readings, invoices and payments. The landlord sees who owes what; tenants see their own bills.|||Một chủ trọ có vài dãy nhà gần trường: phòng, người thuê, hợp đồng, chỉ số điện nước hằng tháng, hoá đơn và thanh toán. Chủ trọ thấy ai đang nợ bao nhiêu; người thuê xem hoá đơn của mình.',
    doKho: 2,
    tinhNang: [
      'Buildings, rooms, capacity and monthly price|||Dãy nhà, phòng, sức chứa và giá thuê tháng',
      'Tenants and contracts with start/end; one active contract per bed|||Người thuê và hợp đồng có ngày bắt đầu/kết thúc; mỗi giường một hợp đồng hiệu lực',
      'Monthly meter readings; reading must not go down|||Chỉ số công tơ hằng tháng; chỉ số không được giảm',
      'Invoices generated per month: rent + electricity + water + services|||Hoá đơn sinh theo tháng: tiền phòng + điện + nước + dịch vụ',
      'Partial payments and outstanding balance|||Thanh toán từng phần và số còn nợ',
      'Occupancy report per building|||Báo cáo tỉ lệ lấp đầy theo dãy',
      'Maintenance requests with status|||Yêu cầu sửa chữa có trạng thái',
      'Search tenants by name without accents|||Tìm người thuê theo tên không dấu',
    ],
    banDoChuong: bd([
      'Entities: building, room, tenant, contract, reading, invoice, payment|||Thực thể: dãy nhà, phòng, người thuê, hợp đồng, chỉ số, hoá đơn, thanh toán',
      'daterange for contracts, numeric for meter readings, integer VND|||daterange cho hợp đồng, numeric cho chỉ số công tơ, số nguyên VND',
      'FKs, CHECK reading >= 0, UNIQUE (room, month) for readings|||FK, CHECK chỉ số >= 0, UNIQUE (phòng, tháng) cho chỉ số',
      'Seed 3 buildings, 60 rooms, 150 tenants, 12 months of readings|||Nạp 3 dãy, 60 phòng, 150 người thuê, 12 tháng chỉ số',
      'Room list with current tenants; empty rooms (anti-join)|||Danh sách phòng kèm người đang thuê; phòng trống (anti-join)',
      'Revenue and debt per building per month|||Doanh thu và nợ theo dãy theo tháng',
      'CTE that builds this month’s invoice lines step by step|||CTE dựng từng dòng hoá đơn tháng này qua từng bước',
      'LAG to compute consumption from consecutive readings|||LAG để tính lượng tiêu thụ từ hai chỉ số liên tiếp',
      'Index for "my invoices" and unpaid invoices (partial)|||Chỉ mục cho "hoá đơn của tôi" và hoá đơn chưa trả (một phần)',
      'EXPLAIN ANALYZE of the debt report|||EXPLAIN ANALYZE báo cáo công nợ',
      'Payment and invoice balance updated in one transaction; no double contract per bed|||Thanh toán và số dư hoá đơn cập nhật trong một giao dịch; không hai hợp đồng cho một giường',
      'Trigger rejecting a reading lower than last month; view "current occupancy"|||Trigger từ chối chỉ số thấp hơn tháng trước; view "đang ở hiện tại"',
      'jsonb for room amenities; search tenants by name|||jsonb cho tiện nghi phòng; tìm người thuê theo tên',
      'App role vs landlord role; pool settings for a small VPS|||Role app vs role chủ trọ; cấu hình pool cho VPS nhỏ',
      'Backup before each month-end run; restore drill|||Sao lưu trước mỗi lần chốt tháng; diễn tập khôi phục',
      'Checklist + migration plan for adding a new service fee|||Checklist + kế hoạch migration khi thêm một loại phí mới',
      'ADR: SQL Server (as in PRJ301) vs PostgreSQL for this app|||ADR: SQL Server (như PRJ301) vs PostgreSQL cho app này',
    ]),
    thamKhaoThat: [
      'Rental management apps used by Vietnamese landlords (room lists, meter readings, monthly bills)|||Các app quản lý nhà trọ chủ trọ Việt Nam đang dùng (danh sách phòng, chỉ số điện nước, hoá đơn tháng)',
      'Your university dormitory office|||Ban quản lý ký túc xá của trường bạn',
    ],
    anh: null,
  },
  {
    slug: 'khoa-hoc-online',
    ten: 'Online course platform|||Nền tảng khoá học online',
    moTa: 'A small Udemy-like site: instructors publish courses made of sections and lessons, students enrol, track progress, take quizzes and leave reviews. The instructor reads completion and revenue reports.|||Một trang kiểu Udemy thu nhỏ: giảng viên đăng khoá học gồm chương và bài, học viên ghi danh, theo dõi tiến độ, làm quiz và để lại đánh giá. Giảng viên xem báo cáo hoàn thành và doanh thu.',
    doKho: 2,
    tinhNang: [
      'Courses, sections, lessons with ordering|||Khoá học, chương, bài có thứ tự',
      'Enrolments (one per student per course) with price paid|||Ghi danh (mỗi học viên một lần mỗi khoá) kèm số tiền đã trả',
      'Lesson progress and course completion percentage|||Tiến độ từng bài và phần trăm hoàn thành khoá',
      'Quizzes, attempts and best score|||Quiz, lượt làm và điểm cao nhất',
      'Reviews with rating 1–5, one per enrolment|||Đánh giá 1–5 sao, mỗi ghi danh một lần',
      'Instructor revenue per month|||Doanh thu giảng viên theo tháng',
      'Course search by title and description|||Tìm khoá học theo tiêu đề và mô tả',
      'Leaderboard of top learners|||Bảng xếp hạng học viên chăm nhất',
    ],
    banDoChuong: bd([
      'Entities: user, course, section, lesson, enrolment, progress, quiz, review|||Thực thể: người dùng, khoá, chương, bài, ghi danh, tiến độ, quiz, đánh giá',
      'smallint rating with CHECK, integer VND price, timestamptz completed_at|||rating smallint có CHECK, giá số nguyên VND, completed_at timestamptz',
      'UNIQUE (student, course) enrolment, UNIQUE (section, position)|||UNIQUE (học viên, khoá) cho ghi danh, UNIQUE (chương, vị trí)',
      'Seed 50 courses, 1,500 lessons, 3,000 students, 20,000 progress rows|||Nạp 50 khoá, 1.500 bài, 3.000 học viên, 20.000 dòng tiến độ',
      'Course page with instructor and lesson count; students with no progress|||Trang khoá học kèm giảng viên và số bài; học viên chưa học bài nào',
      'Completion % per course; average rating with HAVING count >= 5|||% hoàn thành theo khoá; điểm đánh giá trung bình với HAVING count >= 5',
      'CTE for "next lesson to study"; recursive for prerequisites (stretch)|||CTE cho "bài tiếp theo cần học"; đệ quy cho khoá tiên quyết (nâng cao)',
      'Leaderboard with RANK; running enrolments per day|||Bảng xếp hạng bằng RANK; số ghi danh cộng dồn theo ngày',
      'Indexes for "my courses" and lesson ordering|||Chỉ mục cho "khoá của tôi" và thứ tự bài',
      'EXPLAIN ANALYZE of the course page query|||EXPLAIN ANALYZE truy vấn trang khoá học',
      'Enrol + payment in one transaction; double-click does not enrol twice|||Ghi danh + thanh toán trong một giao dịch; bấm đúp không ghi danh hai lần',
      'Trigger updating completion %; materialized view for instructor stats|||Trigger cập nhật % hoàn thành; materialized view cho thống kê giảng viên',
      'Quiz questions as jsonb; full-text search on courses|||Câu hỏi quiz dạng jsonb; tìm toàn văn trên khoá học',
      'Read-only role for the analytics dashboard|||Role chỉ đọc cho bảng phân tích',
      'Backup + restore; partition progress by month (stretch)|||Sao lưu + khôi phục; phân vùng tiến độ theo tháng (nâng cao)',
      'Checklist and Prisma (or another ORM) migration of one change|||Checklist và migration một thay đổi bằng Prisma (hoặc ORM khác)',
      'ADR: store lesson content in jsonb or in tables?|||ADR: lưu nội dung bài trong jsonb hay trong bảng?',
    ]),
    thamKhaoThat: [
      'Udemy and Coursera course pages (courses, sections, lessons, reviews)|||Trang khoá học Udemy và Coursera (khoá, chương, bài, đánh giá)',
      'Moodle — open-source LMS that runs on PostgreSQL or MySQL|||Moodle — LMS mã nguồn mở chạy trên PostgreSQL hoặc MySQL',
    ],
    anh: null,
  },
  {
    slug: 'giao-do-an',
    ten: 'Food delivery for several restaurants|||Đặt đồ ăn nhiều quán',
    moTa: 'A small GrabFood-like marketplace for one district: restaurants with menus and opening hours, customers place orders with several items, shippers pick them up, statuses change in real time. Money and stock must never go wrong.|||Một sàn đặt đồ ăn kiểu GrabFood thu nhỏ cho một quận: quán có thực đơn và giờ mở cửa, khách đặt đơn nhiều món, shipper nhận đơn, trạng thái đổi liên tục. Tiền và số lượng không bao giờ được sai.',
    doKho: 3,
    tinhNang: [
      'Restaurants, menu items, options (size, topping) and opening hours|||Quán, món, tuỳ chọn (size, topping) và giờ mở cửa',
      'Orders with lines; price copied at order time|||Đơn hàng có nhiều dòng; giá được chép lại lúc đặt',
      'Order status flow and history|||Luồng trạng thái đơn và lịch sử',
      'Shippers assigned to orders; one active order per shipper|||Shipper được giao đơn; mỗi shipper một đơn đang chạy',
      'Daily limited dishes (stock) that cannot go negative|||Món giới hạn số suất trong ngày không được âm',
      'Vouchers with usage limits|||Mã giảm giá có giới hạn lượt dùng',
      'Revenue and commission per restaurant|||Doanh thu và hoa hồng theo quán',
      'Dish search without accents|||Tìm món không dấu',
    ],
    banDoChuong: bd([
      'Entities: restaurant, item, option, order, order_line, shipper, voucher|||Thực thể: quán, món, tuỳ chọn, đơn, dòng đơn, shipper, voucher',
      'Integer VND everywhere, status enum, time for opening hours|||Số nguyên VND ở mọi chỗ, trạng thái enum, time cho giờ mở cửa',
      'FKs, CHECK quantity > 0, CHECK stock >= 0|||FK, CHECK số lượng > 0, CHECK tồn >= 0',
      'Seed 40 restaurants, 800 items, 5,000 customers, 30,000 orders|||Nạp 40 quán, 800 món, 5.000 khách, 30.000 đơn',
      'Order detail with lines, items and restaurant; items never ordered|||Chi tiết đơn kèm dòng, món và quán; món chưa ai đặt',
      'Revenue per restaurant per day; cancellation rate with FILTER|||Doanh thu theo quán theo ngày; tỉ lệ huỷ bằng FILTER',
      'CTE computing the order total with voucher|||CTE tính tổng đơn có áp voucher',
      'Best-selling item per restaurant (ROW_NUMBER); hourly peaks|||Món bán chạy nhất mỗi quán (ROW_NUMBER); giờ cao điểm',
      'Indexes for "orders of a restaurant today" and open orders|||Chỉ mục cho "đơn của quán hôm nay" và đơn đang mở',
      'EXPLAIN ANALYZE of the restaurant dashboard|||EXPLAIN ANALYZE bảng điều khiển của quán',
      'Place order: stock decrement + voucher use + order insert atomically; two buyers, last portion|||Đặt đơn: trừ suất + dùng voucher + tạo đơn nguyên tử; hai người mua suất cuối cùng',
      'Trigger writing status history; view "orders waiting for a shipper"|||Trigger ghi lịch sử trạng thái; view "đơn chờ shipper"',
      'Options as jsonb; search dishes in Vietnamese|||Tuỳ chọn món dạng jsonb; tìm món tiếng Việt',
      'Pool sizing for lunch peak; roles for restaurant app and admin|||Kích thước pool cho giờ trưa; role cho app quán và admin',
      'Backup + restore; partition orders by month|||Sao lưu + khôi phục; phân vùng đơn theo tháng',
      'Checklist + one zero-downtime migration (add a column with default)|||Checklist + một migration không gián đoạn (thêm cột có mặc định)',
      'ADR: MongoDB for menus, PostgreSQL for orders — or one database?|||ADR: MongoDB cho thực đơn, PostgreSQL cho đơn — hay một cơ sở dữ liệu?',
    ]),
    thamKhaoThat: [
      'GrabFood, ShopeeFood — ordering, statuses and shipper assignment you can observe as a user|||GrabFood, ShopeeFood — đặt món, trạng thái và giao shipper mà bạn quan sát được khi là người dùng',
    ],
    anh: null,
  },
  {
    slug: 'rap-phim',
    ten: 'Cinema ticket booking|||Đặt vé rạp chiếu phim',
    moTa: 'A cinema chain: movies, halls with seat maps, showtimes, seat holds that expire, tickets, combos and loyalty points. The one rule that must never break: a seat in a showtime is sold at most once.|||Một chuỗi rạp: phim, phòng chiếu có sơ đồ ghế, suất chiếu, giữ ghế có hạn, vé, combo và điểm thành viên. Luật không bao giờ được vỡ: một ghế trong một suất chỉ bán tối đa một lần.',
    doKho: 3,
    tinhNang: [
      'Movies, halls, seats (row, number, type)|||Phim, phòng chiếu, ghế (hàng, số, loại)',
      'Showtimes that do not overlap in the same hall|||Suất chiếu không trùng giờ trong cùng phòng',
      'Seat holds for 10 minutes, then released|||Giữ ghế 10 phút rồi tự nhả',
      'Tickets: one seat per showtime at most|||Vé: mỗi ghế mỗi suất tối đa một vé',
      'Combos and order total|||Combo bắp nước và tổng tiền',
      'Loyalty points earned and spent|||Điểm thành viên tích và tiêu',
      'Occupancy per showtime and revenue per movie|||Tỉ lệ lấp đầy theo suất và doanh thu theo phim',
      'Movie search by title and actors|||Tìm phim theo tên và diễn viên',
    ],
    banDoChuong: bd([
      'Entities: movie, hall, seat, showtime, hold, ticket, combo, member|||Thực thể: phim, phòng, ghế, suất chiếu, giữ ghế, vé, combo, thành viên',
      'tstzrange for showtimes, seat type enum, integer VND|||tstzrange cho suất chiếu, loại ghế enum, số nguyên VND',
      'UNIQUE (hall, row, number); UNIQUE (showtime, seat) on tickets|||UNIQUE (phòng, hàng, số); UNIQUE (suất, ghế) trên vé',
      'Seed 5 halls, 600 seats, 300 showtimes, 40,000 tickets|||Nạp 5 phòng, 600 ghế, 300 suất, 40.000 vé',
      'Seat map of a showtime: every seat LEFT JOIN its ticket|||Sơ đồ ghế của một suất: mọi ghế LEFT JOIN vé của nó',
      'Occupancy % per showtime; revenue per movie per week|||% lấp đầy theo suất; doanh thu theo phim theo tuần',
      'CTE for the booking summary; finding blocks of 2 adjacent free seats|||CTE cho tóm tắt đặt vé; tìm 2 ghế trống liền nhau',
      'Rank movies by weekly revenue; LEAD to find gaps between showtimes|||Xếp hạng phim theo doanh thu tuần; LEAD tìm khoảng trống giữa các suất',
      'Indexes for the seat map and "my tickets"|||Chỉ mục cho sơ đồ ghế và "vé của tôi"',
      'EXPLAIN ANALYZE of the seat map query|||EXPLAIN ANALYZE truy vấn sơ đồ ghế',
      'Two buyers, one seat: UNIQUE + transaction; exclusion for hall overlap|||Hai người mua, một ghế: UNIQUE + giao dịch; exclusion cho trùng giờ phòng chiếu',
      'Function that releases expired holds; view "today’s showtimes"|||Hàm nhả ghế giữ quá hạn; view "suất chiếu hôm nay"',
      'Cast and metadata in jsonb; full-text search on movies|||Diễn viên và thông tin phụ dạng jsonb; tìm toàn văn trên phim',
      'Pool and timeouts for a ticket-opening rush; app role|||Pool và timeout cho lúc mở bán vé; role cho app',
      'Backup + restore; read replica for reports (stretch)|||Sao lưu + khôi phục; bản sao đọc cho báo cáo (nâng cao)',
      'Checklist + load-test note: how many bookings per second before errors|||Checklist + ghi chú đo tải: bao nhiêu lượt đặt mỗi giây thì bắt đầu lỗi',
      'ADR: why a relational database for seat inventory|||ADR: vì sao dùng cơ sở dữ liệu quan hệ cho kho ghế',
    ]),
    thamKhaoThat: [
      'CGV, Lotte Cinema, Galaxy — booking pages with seat maps and timed holds|||CGV, Lotte Cinema, Galaxy — trang đặt vé có sơ đồ ghế và giữ ghế có hạn',
    ],
    anh: null,
  },
];

/* ─────────────────────────────── Mốc ─────────────────────────────── */

const MOC = [
  {
    so: 1, lead: 'Turn the topic you registered into a written plan for its database. Every later milestone builds on THIS plan, so the time spent here is the cheapest time of the whole project.|||Biến đề tài bạn đã đăng ký thành bản kế hoạch bằng chữ cho cơ sở dữ liệu của nó. Mọi mốc sau xây trên CHÍNH bản này, nên thời gian bỏ ra ở đây là rẻ nhất của cả dự án.',
    ten: 'The data plan: entities, questions and a running server|||Kế hoạch dữ liệu: thực thể, câu hỏi và một máy chủ đang chạy',
    yeuCau: [
      'Create a Git repository with README.md: topic, one-paragraph goal, who uses the data|||Tạo repo Git có README.md: đề tài, một đoạn mục tiêu, ai dùng dữ liệu',
      'List at least 5 entities with 3–6 attributes each and how they relate (1–n, n–n)|||Liệt kê ít nhất 5 thực thể, mỗi thực thể 3–6 thuộc tính, và quan hệ giữa chúng (1–n, n–n)',
      'Write the 5 most important questions users will ask the data (they become queries in later milestones)|||Viết 5 câu hỏi quan trọng nhất người dùng sẽ hỏi dữ liệu (chúng thành truy vấn ở các mốc sau)',
      'Run PostgreSQL (Docker or local), create the project database and connect with psql|||Chạy PostgreSQL (Docker hoặc cài máy), tạo cơ sở dữ liệu dự án và kết nối bằng psql',
    ],
    nangCao: ['Draw the ERD with a tool (dbdiagram.io, draw.io) and commit the image|||Vẽ ERD bằng công cụ (dbdiagram.io, draw.io) và commit ảnh'],
    datKhi: [
      'README lists ≥ 5 entities, their relations and 5 questions|||README liệt kê ≥ 5 thực thể, quan hệ và 5 câu hỏi',
      'psql shows your database name and server version (screenshot or pasted output)|||psql hiện tên cơ sở dữ liệu và phiên bản máy chủ (ảnh chụp hoặc output dán)',
    ],
    goiY: [
      'Nouns in your user stories are entities; verbs between two nouns are relations|||Danh từ trong câu chuyện người dùng là thực thể; động từ giữa hai danh từ là quan hệ',
      'If an attribute can have several values (authors of a book), it is a new table, not a column|||Thuộc tính có thể có nhiều giá trị (tác giả của sách) là một bảng mới, không phải một cột',
      'Write questions as a user would say them: "which rooms are empty this month?"|||Viết câu hỏi đúng như người dùng nói: "tháng này phòng nào còn trống?"',
    ],
    nop: ['repo', 'anh'],
    demoGiai: 'Connected, and the database is still empty — that is the starting point.|||Đã kết nối, và cơ sở dữ liệu vẫn trống — đó là điểm xuất phát.',
  },
  {
    so: 2, lead: 'Decide the type of every column before you write a single CREATE TABLE. Wrong types are the bugs that hide for months: money that does not add up, times that shift by 7 hours.|||Chọn kiểu cho từng cột trước khi viết CREATE TABLE nào. Sai kiểu là loại lỗi ẩn hàng tháng: tiền cộng không khớp, giờ lệch 7 tiếng.',
    ten: 'Types for every column, with a reason|||Kiểu dữ liệu cho từng cột, kèm lý do',
    yeuCau: [
      'A table in docs/types.md: every column of every entity, its PostgreSQL type and one-line reason|||Bảng trong docs/types.md: mọi cột của mọi thực thể, kiểu PostgreSQL và lý do một dòng',
      'Money stored as integer (VND) or numeric — never float|||Tiền lưu bằng số nguyên (VND) hoặc numeric — không bao giờ float',
      'Every point in time is timestamptz; pure dates are date|||Mọi thời điểm là timestamptz; ngày thuần là date',
      'At least one enum or a text column with a documented set of values; one identity or uuid key choice explained|||Ít nhất một enum hoặc cột text có tập giá trị ghi rõ; giải thích chọn identity hay uuid cho khoá',
    ],
    nangCao: ['Use a range type (daterange / tstzrange) where your topic has periods|||Dùng kiểu khoảng (daterange / tstzrange) ở chỗ đề tài có khoảng thời gian'],
    datKhi: [
      'docs/types.md covers every column from milestone 1|||docs/types.md phủ mọi cột từ mốc 1',
      'No float/real/double precision for money; no timestamp without time zone for events|||Không float/real/double precision cho tiền; không timestamp không múi giờ cho sự kiện',
    ],
    goiY: [
      'Ask of each column: what operations will I do on it (sum, compare, search)?|||Hỏi mỗi cột: mình sẽ làm gì với nó (cộng, so sánh, tìm kiếm)?',
      'Phone numbers and ISBNs are text — you never add them, and leading zeros matter|||Số điện thoại và ISBN là text — không bao giờ cộng chúng, và số 0 đầu có nghĩa',
      'Enum is great for a small fixed set; if users can add values, use a lookup table|||Enum hợp tập nhỏ cố định; nếu người dùng thêm được giá trị thì dùng bảng tra cứu',
    ],
    nop: ['repo'],
    demoGiai: 'float8 cannot represent 0.1 exactly, numeric can; the time typed in Hanoi is stored as an absolute instant; the enum rejects a value outside its list.|||float8 không biểu diễn chính xác 0.1, numeric thì được; giờ gõ ở Hà Nội được lưu thành một thời điểm tuyệt đối; enum từ chối giá trị ngoài danh sách.',
  },
  {
    so: 3, lead: 'Write the schema as a migration file and let PostgreSQL defend your data: every rule that can be a constraint becomes one.|||Viết lược đồ thành tệp migration và để PostgreSQL bảo vệ dữ liệu: luật nào làm được thành ràng buộc thì làm thành ràng buộc.',
    ten: 'The schema: tables and constraints that refuse bad data|||Lược đồ: bảng và ràng buộc từ chối dữ liệu sai',
    yeuCau: [
      'migrations/001_schema.sql creates ≥ 5 tables with primary keys and foreign keys|||migrations/001_schema.sql tạo ≥ 5 bảng có khoá chính và khoá ngoại',
      'NOT NULL on every column that must have a value; at least 2 UNIQUE and 2 CHECK constraints from your business rules|||NOT NULL trên mọi cột bắt buộc; ít nhất 2 UNIQUE và 2 CHECK lấy từ luật nghiệp vụ',
      'The file runs on an empty database without errors (psql -v ON_ERROR_STOP=1 -f)|||Tệp chạy trên cơ sở dữ liệu trống không lỗi (psql -v ON_ERROR_STOP=1 -f)',
      'Show 3 bad inserts being rejected (CHECK, UNIQUE, FK) and paste the errors|||Cho thấy 3 lệnh insert sai bị từ chối (CHECK, UNIQUE, FK) và dán thông báo lỗi',
    ],
    nangCao: ['Choose ON DELETE behaviour (RESTRICT / CASCADE / SET NULL) for each FK and justify it|||Chọn hành vi ON DELETE (RESTRICT / CASCADE / SET NULL) cho từng FK và giải thích'],
    datKhi: [
      'Fresh database + 001_schema.sql = no error|||Cơ sở dữ liệu mới + 001_schema.sql = không lỗi',
      'Three rejected inserts with the real error text in docs/constraints.md|||Ba lệnh insert bị từ chối kèm thông báo lỗi thật trong docs/constraints.md',
    ],
    goiY: [
      'A rule written only in the app is a suggestion; a constraint is a guarantee|||Luật chỉ viết trong app là lời khuyên; ràng buộc mới là bảo đảm',
      'Many-to-many needs a junction table with a composite primary key|||Nhiều-nhiều cần bảng nối với khoá chính ghép',
      'Name constraints yourself (CONSTRAINT x_y_check) so error messages tell the user what went wrong|||Tự đặt tên ràng buộc (CONSTRAINT x_y_check) để thông báo lỗi nói rõ sai gì',
    ],
    nop: ['repo'],
    demoGiai: 'Two inserts that the application might have let through are stopped by the database itself: a price of 0 and a booking for a member who does not exist.|||Hai lệnh insert mà app có thể để lọt bị chính cơ sở dữ liệu chặn: giá 0 và lượt đặt của một hội viên không tồn tại.',
  },
  {
    so: 4, lead: 'An empty schema proves nothing. Fill it with enough realistic data that slow queries are slow and edge cases exist.|||Lược đồ trống không chứng minh được gì. Nạp đủ dữ liệu giống thật để truy vấn chậm thì lộ chậm và ca biên có mặt.',
    ten: 'Seed data and the first queries|||Dữ liệu mẫu và những truy vấn đầu tiên',
    yeuCau: [
      'seed.sql generates data with generate_series: main table ≥ 1,000 rows, others in realistic proportion|||seed.sql sinh dữ liệu bằng generate_series: bảng chính ≥ 1.000 dòng, các bảng khác theo tỉ lệ giống thật',
      'Include edge cases: a user with no activity, cancelled records, values at the CHECK limits|||Có ca biên: người dùng không hoạt động, bản ghi bị huỷ, giá trị sát giới hạn CHECK',
      'queries/04-basic.sql: 6 queries with WHERE, ORDER BY, LIMIT/OFFSET, DISTINCT answering your questions|||queries/04-basic.sql: 6 truy vấn có WHERE, ORDER BY, LIMIT/OFFSET, DISTINCT trả lời câu hỏi của bạn',
      'One UPSERT (INSERT … ON CONFLICT) that a real screen needs|||Một UPSERT (INSERT … ON CONFLICT) mà một màn hình thật cần',
    ],
    nangCao: ['Make the seed deterministic (same rows every run) so your outputs are reproducible|||Làm seed tất định (lần nào chạy cũng ra cùng dữ liệu) để output tái hiện được'],
    datKhi: [
      'schema + seed run from zero in one command; row counts pasted in README|||schema + seed chạy từ số 0 bằng một lệnh; số dòng dán trong README',
      'Each basic query has its output pasted under it|||Mỗi truy vấn cơ bản có output dán ngay dưới',
    ],
    goiY: [
      'Use i % n tricks inside generate_series to spread values evenly|||Dùng mẹo i % n trong generate_series để rải giá trị đều',
      'Insert parents before children, or the FKs will stop you|||Chèn bảng cha trước bảng con, không thì FK chặn',
      'ON CONFLICT needs a UNIQUE constraint on the conflict target|||ON CONFLICT cần ràng buộc UNIQUE trên cột xung đột',
    ],
    nop: ['repo'],
    demoGiai: '1,260 bookings for 200 members generated in one statement, then an upsert renames member 1 instead of failing on the duplicate email.|||1.260 lượt đặt cho 200 hội viên sinh bằng một câu lệnh, rồi upsert đổi tên hội viên 1 thay vì lỗi vì trùng email.',
  },
  {
    so: 5, lead: 'Real screens show data from several tables at once. This milestone writes the queries behind your main screens.|||Màn hình thật hiện dữ liệu từ nhiều bảng cùng lúc. Mốc này viết các truy vấn phía sau những màn hình chính.',
    ten: 'Joins for every main screen|||JOIN cho từng màn hình chính',
    yeuCau: [
      'queries/05-joins.sql: one query per main screen (list + detail), joining 2–4 tables|||queries/05-joins.sql: mỗi màn hình chính một truy vấn (danh sách + chi tiết), JOIN 2–4 bảng',
      'At least one LEFT JOIN where "zero" must still appear (a user with 0 orders)|||Ít nhất một LEFT JOIN ở chỗ "số 0" vẫn phải hiện (người dùng có 0 đơn)',
      'One anti-join (NOT EXISTS or LEFT JOIN … IS NULL) answering a "never" question|||Một anti-join (NOT EXISTS hoặc LEFT JOIN … IS NULL) trả lời câu hỏi "chưa bao giờ"',
      'Explain in a comment why each join is INNER or LEFT|||Giải thích bằng chú thích vì sao mỗi JOIN là INNER hay LEFT',
    ],
    nangCao: ['A LATERAL join for "latest 3 items per parent"|||Một LATERAL join cho "3 mục mới nhất của mỗi cha"'],
    datKhi: [
      'Every main screen from milestone 1 has its query and pasted output|||Mọi màn hình chính từ mốc 1 có truy vấn và output dán',
      'The LEFT JOIN query shows at least one row with count 0|||Truy vấn LEFT JOIN cho thấy ít nhất một dòng có count 0',
    ],
    goiY: [
      'count(*) after a LEFT JOIN counts the NULL row as 1 — count the child’s id instead|||count(*) sau LEFT JOIN đếm dòng NULL là 1 — hãy đếm id của bảng con',
      'A condition on the right table in WHERE turns a LEFT JOIN into an INNER JOIN; move it into ON|||Điều kiện trên bảng phải đặt ở WHERE biến LEFT JOIN thành INNER JOIN; chuyển nó vào ON',
      'Check row counts: a join that multiplies rows usually joined on the wrong key|||Kiểm số dòng: JOIN làm số dòng nhân lên thường là nối sai khoá',
    ],
    nop: ['repo'],
    demoGiai: 'The member who never booked appears with 0 because of LEFT JOIN + count(b.id); the second query is the "upcoming bookings" screen.|||Hội viên chưa đặt lần nào vẫn hiện với 0 nhờ LEFT JOIN + count(b.id); truy vấn thứ hai là màn hình "lượt đặt sắp tới".',
  },
  {
    so: 6, lead: 'Owners and managers do not read rows, they read numbers. Build the reports your topic’s owner would open every Monday.|||Chủ và quản lý không đọc từng dòng, họ đọc con số. Dựng các báo cáo mà chủ đề tài của bạn mở mỗi sáng thứ Hai.',
    ten: 'Reports: aggregation and grouping|||Báo cáo: tổng hợp và gom nhóm',
    yeuCau: [
      'queries/06-reports.sql: ≥ 4 reports with GROUP BY (per day/month, per category/owner)|||queries/06-reports.sql: ≥ 4 báo cáo có GROUP BY (theo ngày/tháng, theo danh mục/chủ sở hữu)',
      'At least one report uses FILTER to split counts in the same row|||Ít nhất một báo cáo dùng FILTER để tách số đếm trên cùng một dòng',
      'At least one HAVING that removes small or noisy groups|||Ít nhất một HAVING loại nhóm quá nhỏ hoặc nhiễu',
      'Money totals checked by hand for one group|||Tổng tiền được kiểm tay cho một nhóm',
    ],
    nangCao: ['GROUPING SETS or ROLLUP to add subtotals and a grand total|||GROUPING SETS hoặc ROLLUP để thêm tổng phụ và tổng chung'],
    datKhi: [
      'Four reports with outputs pasted; one group recomputed by hand matches|||Bốn báo cáo có output dán; một nhóm tính tay khớp',
      'Months are grouped with date_trunc in your time zone|||Tháng được gom bằng date_trunc theo múi giờ của bạn',
    ],
    goiY: [
      'Every non-aggregated column in SELECT must be in GROUP BY|||Mọi cột không gộp trong SELECT phải có trong GROUP BY',
      'WHERE filters rows before grouping, HAVING filters groups after|||WHERE lọc dòng trước khi gom, HAVING lọc nhóm sau khi gom',
      'date_trunc on timestamptz uses the session time zone — set it explicitly|||date_trunc trên timestamptz dùng múi giờ của phiên — hãy đặt rõ',
    ],
    nop: ['repo'],
    demoGiai: 'One row per court and month: FILTER splits played vs cancelled, and revenue ignores cancelled bookings.|||Mỗi sân mỗi tháng một dòng: FILTER tách lượt chơi và lượt huỷ, doanh thu bỏ qua lượt bị huỷ.',
  },
  {
    so: 7, lead: 'Some questions need several steps. CTEs let you write those steps in order, and recursion answers questions about trees and sequences.|||Có những câu hỏi cần nhiều bước. CTE cho bạn viết các bước theo thứ tự, còn đệ quy trả lời câu hỏi về cây và dãy.',
    ten: 'Multi-step questions with subqueries and CTEs|||Câu hỏi nhiều bước với truy vấn con và CTE',
    yeuCau: [
      'queries/07-cte.sql: one question rewritten from a nested subquery into a readable WITH pipeline|||queries/07-cte.sql: một câu hỏi viết lại từ truy vấn con lồng nhau thành chuỗi WITH dễ đọc',
      'One correlated subquery or EXISTS used on purpose (explain why)|||Một truy vấn con tương quan hoặc EXISTS dùng có chủ đích (giải thích vì sao)',
      'One recursive CTE: a tree in your data (categories, comments) or a generated sequence (slots, days)|||Một CTE đệ quy: cây trong dữ liệu (danh mục, bình luận) hoặc dãy sinh ra (khung giờ, ngày)',
    ],
    nangCao: ['A data-modifying CTE (WITH … UPDATE … RETURNING) for a real operation|||Một CTE sửa dữ liệu (WITH … UPDATE … RETURNING) cho một thao tác thật'],
    datKhi: [
      'The CTE version returns exactly the same rows as the nested version (show both counts)|||Bản CTE trả đúng cùng các dòng như bản lồng (cho thấy hai số đếm)',
      'The recursive CTE stops (has a termination condition) and its output is pasted|||CTE đệ quy có điểm dừng và output được dán',
    ],
    goiY: [
      'Name each CTE after what it holds: open_orders, paid_totals|||Đặt tên mỗi CTE theo thứ nó chứa: open_orders, paid_totals',
      'A recursive CTE = an anchor SELECT, UNION ALL, and a step that refers to itself|||CTE đệ quy = một SELECT neo, UNION ALL, và một bước tham chiếu chính nó',
      'Always put the stop condition in the recursive step’s WHERE|||Luôn đặt điều kiện dừng trong WHERE của bước đệ quy',
    ],
    nop: ['repo'],
    demoGiai: 'The recursive CTE generates the 16 hourly slots of a day; NOT EXISTS removes the ones already booked, leaving the free slots a booking screen would show.|||CTE đệ quy sinh 16 khung giờ trong ngày; NOT EXISTS bỏ khung đã có người đặt, còn lại đúng các khung trống màn hình đặt sân sẽ hiện.',
  },
  {
    so: 8, lead: 'Rankings, running totals and "compared with last time" are the questions GROUP BY cannot answer without losing the rows. Window functions can.|||Xếp hạng, cộng dồn và "so với lần trước" là những câu GROUP BY không trả lời được mà không làm mất dòng. Hàm cửa sổ thì được.',
    ten: 'Rankings, running totals and comparisons with window functions|||Xếp hạng, cộng dồn và so sánh bằng hàm cửa sổ',
    yeuCau: [
      'queries/08-window.sql: top-N per group with ROW_NUMBER or RANK (explain which and why)|||queries/08-window.sql: top-N mỗi nhóm bằng ROW_NUMBER hoặc RANK (giải thích chọn cái nào, vì sao)',
      'A running total over time with SUM() OVER (ORDER BY …)|||Một tổng cộng dồn theo thời gian bằng SUM() OVER (ORDER BY …)',
      'LAG or LEAD to compare a row with the previous/next one|||LAG hoặc LEAD để so một dòng với dòng trước/sau',
    ],
    nangCao: ['A moving average with a ROWS BETWEEN frame|||Trung bình trượt với khung ROWS BETWEEN'],
    datKhi: [
      'Three window queries with outputs; ties handled deliberately|||Ba truy vấn cửa sổ có output; trường hợp bằng nhau được xử lý có chủ đích',
      'The running total of the last row equals the plain SUM of the same rows|||Tổng cộng dồn ở dòng cuối bằng SUM thường của cùng các dòng',
    ],
    goiY: [
      'Window functions run after WHERE and GROUP BY — filter on their result in an outer query|||Hàm cửa sổ chạy sau WHERE và GROUP BY — lọc theo kết quả của chúng ở truy vấn ngoài',
      'ROW_NUMBER never ties, RANK leaves gaps, DENSE_RANK does not|||ROW_NUMBER không bao giờ bằng nhau, RANK để lại khoảng trống, DENSE_RANK thì không',
      'PARTITION BY restarts the window for each group|||PARTITION BY khởi động lại cửa sổ cho từng nhóm',
    ],
    nop: ['repo'],
    demoGiai: 'Running revenue for Court 1 day by day, with two days tied for best (rank 1, 1, then 3); LAG shows how many days a member waits between visits.|||Doanh thu cộng dồn của Sân 1 từng ngày, hai ngày cùng hạng nhất (hạng 1, 1, rồi 3); LAG cho thấy một hội viên cách bao nhiêu ngày mới quay lại.',
  },
  {
    so: 9, lead: 'Now make the queries of your main screens fast. Every index you add must be justified by a query that uses it.|||Giờ làm cho truy vấn của các màn hình chính chạy nhanh. Mỗi chỉ mục thêm vào phải có một truy vấn dùng nó làm lý do.',
    ten: 'An index plan driven by your queries|||Kế hoạch chỉ mục xuất phát từ truy vấn của bạn',
    yeuCau: [
      'migrations/002_indexes.sql with each index above the query that needs it (as a comment)|||migrations/002_indexes.sql với mỗi chỉ mục đặt dưới chú thích truy vấn cần nó',
      'At least one composite index with the column order explained|||Ít nhất một chỉ mục ghép có giải thích thứ tự cột',
      'At least one partial or unique index that encodes a business rule|||Ít nhất một chỉ mục một phần hoặc unique thể hiện một luật nghiệp vụ',
      'EXPLAIN before and after for 2 queries, pasted|||EXPLAIN trước và sau cho 2 truy vấn, dán vào',
    ],
    nangCao: ['A GIN or BRIN index where the data fits it, with measurement|||Một chỉ mục GIN hoặc BRIN ở chỗ dữ liệu hợp, có số đo'],
    datKhi: [
      'Both queries change from Seq Scan to an index-based plan|||Cả hai truy vấn đổi từ Seq Scan sang kế hoạch dùng chỉ mục',
      'No index without a query that uses it|||Không chỉ mục nào thiếu truy vấn dùng nó',
    ],
    goiY: [
      'Equality columns first, range column last in a composite index|||Cột so bằng đứng trước, cột so khoảng đứng sau trong chỉ mục ghép',
      'Run ANALYZE after loading data, or the planner guesses with old statistics|||Chạy ANALYZE sau khi nạp dữ liệu, không thì bộ lập kế hoạch đoán bằng thống kê cũ',
      'Foreign key columns are not indexed automatically in PostgreSQL|||Cột khoá ngoại KHÔNG tự có chỉ mục trong PostgreSQL',
    ],
    nop: ['repo'],
    demoGiai: 'Before: the whole table is scanned and filtered. After the composite index (member_id, starts_at): a Bitmap Index Scan reads only that member’s rows.|||Trước: quét cả bảng rồi lọc. Sau khi có chỉ mục ghép (member_id, starts_at): Bitmap Index Scan chỉ đọc các dòng của hội viên đó.',
  },
  {
    so: 10, lead: 'Measure instead of guessing. Find the slowest query of your project with real numbers and fix it.|||Đo thay vì đoán. Tìm truy vấn chậm nhất của dự án bằng số thật và sửa nó.',
    ten: 'Find and fix your slowest query with EXPLAIN ANALYZE|||Tìm và sửa truy vấn chậm nhất bằng EXPLAIN ANALYZE',
    yeuCau: [
      'docs/performance.md: EXPLAIN (ANALYZE, BUFFERS) of your 3 heaviest queries|||docs/performance.md: EXPLAIN (ANALYZE, BUFFERS) của 3 truy vấn nặng nhất',
      'For each: the node that takes the most time and estimated vs actual rows|||Với mỗi câu: nút tốn thời gian nhất và số dòng ước lượng vs thực tế',
      'Fix one (index, rewrite, statistics) and show before/after timing|||Sửa một câu (chỉ mục, viết lại, thống kê) và cho thấy thời gian trước/sau',
    ],
    nangCao: ['Enable pg_stat_statements and list your top 5 queries by total time|||Bật pg_stat_statements và liệt kê 5 truy vấn tốn tổng thời gian nhất'],
    datKhi: [
      'Three plans pasted with the slow node named|||Ba kế hoạch được dán kèm tên nút chậm',
      'One query measurably faster, with numbers from the same data|||Một truy vấn nhanh hơn có số đo, trên cùng dữ liệu',
    ],
    goiY: [
      'Read the plan from the innermost node outwards|||Đọc kế hoạch từ nút trong cùng ra ngoài',
      'A big gap between estimated and actual rows usually means stale or missing statistics|||Chênh lệch lớn giữa số dòng ước lượng và thực tế thường do thống kê cũ hoặc thiếu',
      'Run each measurement 3 times and keep the median — the first run warms the cache|||Đo mỗi lần 3 lượt và lấy trung vị — lượt đầu chỉ làm nóng bộ đệm',
    ],
    nop: ['repo'],
    demoGiai: 'The plan shows what really happened: 284 of 1,260 rows survive the status filter, then a hash join with 4 courts and a hash aggregate. (TIMING OFF keeps the sample reproducible; use timing in your own report.)|||Kế hoạch cho thấy chuyện thật đã xảy ra: 284 trên 1.260 dòng qua được bộ lọc trạng thái, rồi hash join với 4 sân và hash aggregate. (TIMING OFF để mẫu tái hiện được; báo cáo của bạn thì bật đo thời gian.)',
  },
  {
    so: 11, lead: 'Find the operation in your topic where two people at the same moment could break the data — the last seat, the last book copy, the same time slot — and make it impossible.|||Tìm thao tác trong đề tài mà hai người cùng lúc có thể làm hỏng dữ liệu — ghế cuối, bản sách cuối, cùng khung giờ — và làm cho nó không thể xảy ra.',
    ten: 'The critical operation, safe under concurrency|||Thao tác then chốt, an toàn khi đồng thời',
    yeuCau: [
      'Identify your critical operation and write it as one transaction (BEGIN … COMMIT)|||Xác định thao tác then chốt và viết nó thành một giao dịch (BEGIN … COMMIT)',
      'Reproduce the race with two psql sessions WITHOUT protection; paste what went wrong|||Tái hiện tranh chấp bằng hai phiên psql KHI CHƯA bảo vệ; dán chỗ hỏng',
      'Protect it (UNIQUE/exclusion constraint, SELECT … FOR UPDATE, or SERIALIZABLE + retry) and repeat the two-session test|||Bảo vệ nó (ràng buộc UNIQUE/exclusion, SELECT … FOR UPDATE, hoặc SERIALIZABLE + thử lại) và lặp lại phép thử hai phiên',
      'docs/concurrency.md explains your choice and its cost|||docs/concurrency.md giải thích lựa chọn và cái giá của nó',
    ],
    nangCao: ['Cause and explain a deadlock between two transactions of your own app|||Gây ra và giải thích một deadlock giữa hai giao dịch của chính app bạn'],
    datKhi: [
      'The unprotected run shows a broken result; the protected run shows one success and one clear error/wait|||Lần chạy chưa bảo vệ cho kết quả hỏng; lần đã bảo vệ cho một thành công và một lỗi/chờ rõ ràng',
      'A failed step leaves no partial changes (ROLLBACK verified)|||Một bước lỗi không để lại thay đổi dở dang (đã kiểm ROLLBACK)',
    ],
    goiY: [
      'Check-then-insert in the application is the classic race; a constraint closes it|||Kiểm-rồi-chèn ở tầng app là tranh chấp kinh điển; một ràng buộc đóng nó lại',
      'Lock rows in a fixed order to avoid deadlocks|||Khoá các dòng theo một thứ tự cố định để tránh deadlock',
      'SERIALIZABLE is correct only if the app retries on error 40001|||SERIALIZABLE chỉ đúng nếu app thử lại khi gặp lỗi 40001',
    ],
    nop: ['repo', 'anh'],
    demoGiai: 'An exclusion constraint makes overlapping bookings of the same court impossible at the database level — whatever the application does, and however many requests arrive at once.|||Ràng buộc exclusion làm cho hai lượt đặt trùng giờ cùng một sân không thể tồn tại ở tầng cơ sở dữ liệu — bất kể app làm gì, bao nhiêu request tới cùng lúc.',
  },
  {
    so: 12, lead: 'Move the rules that must always run into the database itself, and give the application simple names for complicated queries.|||Đưa những luật lúc nào cũng phải chạy vào chính cơ sở dữ liệu, và cho app những cái tên đơn giản cho các truy vấn phức tạp.',
    ten: 'Triggers, functions and views|||Trigger, hàm và view',
    yeuCau: [
      'A trigger that maintains updated_at (or an audit/history table) on your main table|||Một trigger duy trì updated_at (hoặc bảng lịch sử/kiểm toán) trên bảng chính',
      'One PL/pgSQL function or trigger enforcing a rule a CHECK cannot express|||Một hàm PL/pgSQL hoặc trigger thực thi luật mà CHECK không diễn đạt được',
      'One view used by a screen, and the screen’s query rewritten to use it|||Một view dùng cho một màn hình, và truy vấn của màn hình đó viết lại dùng view',
    ],
    nangCao: ['A materialized view for a heavy report, with a refresh strategy|||Một materialized view cho báo cáo nặng, kèm chiến lược làm mới'],
    datKhi: [
      'The trigger fires: a test UPDATE shows the column changed by the trigger|||Trigger chạy: một UPDATE thử cho thấy cột được trigger đổi',
      'The rule-enforcing function rejects one bad change (error pasted)|||Hàm thực thi luật từ chối một thay đổi sai (dán lỗi)',
    ],
    goiY: [
      'BEFORE triggers can change NEW; AFTER triggers are for side effects like history rows|||Trigger BEFORE sửa được NEW; trigger AFTER dành cho tác dụng phụ như ghi lịch sử',
      'Keep triggers short and boring — business logic hidden in triggers surprises teammates|||Giữ trigger ngắn và nhàm chán — logic nghiệp vụ giấu trong trigger làm đồng đội bất ngờ',
      'A view is just a saved query: it does not store data, so it is always fresh|||View chỉ là truy vấn được lưu: nó không chứa dữ liệu, nên luôn mới',
    ],
    nop: ['repo'],
    demoGiai: 'The UPDATE tried to set updated_at to the year 2000; the BEFORE trigger overwrote it with now(). The view gives the "upcoming" screen a one-line query.|||Lệnh UPDATE cố đặt updated_at về năm 2000; trigger BEFORE ghi đè bằng now(). View cho màn hình "sắp tới" một truy vấn một dòng.',
  },
  {
    so: 13, lead: 'Some data really is flexible, and users search with words, not ids. Add both — without giving up the relational core.|||Có những dữ liệu thật sự linh hoạt, và người dùng tìm bằng chữ chứ không bằng id. Thêm cả hai — mà không bỏ phần lõi quan hệ.',
    ten: 'Flexible attributes with JSONB and search with full-text|||Thuộc tính linh hoạt bằng JSONB và tìm kiếm toàn văn',
    yeuCau: [
      'One jsonb column for data whose shape varies (options, metadata) — explain why not separate columns|||Một cột jsonb cho dữ liệu có hình dạng thay đổi (tuỳ chọn, thông tin phụ) — giải thích vì sao không tách cột',
      'A GIN index and a containment query (@>) that uses it|||Một chỉ mục GIN và truy vấn chứa (@>) dùng nó',
      'Full-text search on a text column that finds Vietnamese words typed without accents (unaccent)|||Tìm kiếm toàn văn trên một cột text, gõ tiếng Việt không dấu vẫn tìm ra (unaccent)',
    ],
    nangCao: ['Rank search results with ts_rank and highlight with ts_headline|||Xếp hạng kết quả bằng ts_rank và tô đậm bằng ts_headline'],
    datKhi: [
      'The @> query and the search query return correct rows (outputs pasted)|||Truy vấn @> và truy vấn tìm kiếm trả đúng dòng (dán output)',
      'Nothing that you filter or join on every day lives only inside jsonb|||Không thứ gì bạn lọc hoặc JOIN hằng ngày chỉ nằm trong jsonb',
    ],
    goiY: [
      'jsonb is for the edges of your model, not for its core entities|||jsonb dành cho phần rìa mô hình, không cho các thực thể lõi',
      'The simple text search configuration plus unaccent works well for Vietnamese without a dictionary|||Cấu hình tìm kiếm simple cộng unaccent chạy tốt cho tiếng Việt mà không cần từ điển',
      'Index the same expression you query, or the index is ignored|||Đánh chỉ mục đúng biểu thức bạn truy vấn, không thì chỉ mục bị bỏ qua',
    ],
    nop: ['repo'],
    demoGiai: 'Amenities live in jsonb and are found with @>; typing "mai che" without accents still finds both courts described with "mái che".|||Tiện nghi nằm trong jsonb và được tìm bằng @>; gõ "mai che" không dấu vẫn ra cả hai sân có mô tả "mái che".',
  },
  {
    so: 14, lead: 'Connect a real program to your database the way production does: a pool, parameters, and a role that can do only what the app needs.|||Nối một chương trình thật vào cơ sở dữ liệu theo đúng cách production làm: pool, tham số, và một role chỉ làm được đúng những gì app cần.',
    ten: 'An application connection with a pool and least privilege|||Kết nối từ ứng dụng với pool và quyền tối thiểu',
    yeuCau: [
      'A small script or API (Node.js pg, or your stack) that runs 3 of your queries through a connection pool|||Một script hoặc API nhỏ (Node.js pg, hoặc stack của bạn) chạy 3 truy vấn của bạn qua pool kết nối',
      'Every query uses parameters ($1, $2) — no string concatenation|||Mọi truy vấn dùng tham số ($1, $2) — không nối chuỗi',
      'A database role for the app with only the grants it needs; show one forbidden action failing|||Một role cơ sở dữ liệu cho app chỉ có quyền cần thiết; cho thấy một thao tác bị cấm thất bại',
      'Credentials from environment variables; .env in .gitignore|||Thông tin đăng nhập lấy từ biến môi trường; .env nằm trong .gitignore',
    ],
    nangCao: ['Compute a pool size for your expected load and explain it against max_connections|||Tính kích thước pool cho tải dự kiến và giải thích so với max_connections'],
    datKhi: [
      'The app runs the queries and prints results; a search for your password in the repo finds nothing|||App chạy truy vấn và in kết quả; dò mật khẩu trong repo không thấy',
      'The app role gets "permission denied" for at least one dangerous action|||Role của app nhận "permission denied" cho ít nhất một thao tác nguy hiểm',
    ],
    goiY: [
      'One pool per process, created once at start-up, not per request|||Mỗi tiến trình một pool, tạo một lần lúc khởi động, không tạo theo request',
      'The owner of the tables should not be the role the app logs in with|||Chủ sở hữu bảng không nên là role mà app đăng nhập',
      'Always release a client back to the pool, even on error (try/finally)|||Luôn trả client về pool, kể cả khi lỗi (try/finally)',
    ],
    nop: ['repo'],
    demoGiai: 'The application role can read and write bookings, but DELETE and DROP fail: a bug or an attacker using the app’s connection cannot wipe the table.|||Role của app đọc và ghi được lượt đặt, nhưng DELETE và DROP thất bại: lỗi code hay kẻ tấn công dùng kết nối của app cũng không xoá được bảng.',
  },
  {
    so: 15, lead: 'A backup you have never restored is a hope, not a backup. Prove you can get your data back.|||Bản sao lưu chưa từng khôi phục chỉ là hy vọng, không phải sao lưu. Chứng minh bạn lấy lại được dữ liệu.',
    ten: 'Backup and a restore drill|||Sao lưu và diễn tập khôi phục',
    yeuCau: [
      'scripts/backup.sh producing a pg_dump in custom format with a dated file name|||scripts/backup.sh tạo bản pg_dump định dạng custom có ngày trong tên tệp',
      'Restore it into a NEW database and compare row counts of every table|||Khôi phục vào một cơ sở dữ liệu MỚI và so số dòng của mọi bảng',
      'docs/runbook.md: how long the restore took and the exact commands|||docs/runbook.md: khôi phục mất bao lâu và đúng các lệnh',
    ],
    nangCao: ['Partition your largest table by time, or set up a streaming replica in Docker|||Phân vùng bảng lớn nhất theo thời gian, hoặc dựng bản sao streaming bằng Docker'],
    datKhi: [
      'Row counts of the original and restored databases match for every table|||Số dòng của cơ sở dữ liệu gốc và bản khôi phục khớp ở mọi bảng',
      'The runbook can be followed by a teammate without asking you|||Đồng đội làm theo runbook được mà không cần hỏi bạn',
    ],
    goiY: [
      'pg_dump -Fc lets pg_restore choose tables and run in parallel later|||pg_dump -Fc cho pg_restore chọn bảng và chạy song song về sau',
      'Never restore over the live database during a drill|||Không bao giờ khôi phục đè lên cơ sở dữ liệu đang chạy khi diễn tập',
      'Roles are not in pg_dump of one database — use pg_dumpall --roles-only|||Role không nằm trong pg_dump của một cơ sở dữ liệu — dùng pg_dumpall --roles-only',
    ],
    nop: ['repo'],
    demoGiai: 'Dump, restore into a fresh database, compare: 1,260 rows on both sides. Your drill compares every table, not just one.|||Dump, khôi phục vào cơ sở dữ liệu mới, so sánh: hai bên đều 1.260 dòng. Bài diễn tập của bạn so mọi bảng, không chỉ một.',
  },
  {
    so: 16, lead: 'Review your database the way a senior engineer would before launch, and wire migrations into the application.|||Soát cơ sở dữ liệu như một kỹ sư senior trước ngày ra mắt, và nối migration vào ứng dụng.',
    ten: 'Production readiness: checklist and migrations|||Sẵn sàng production: checklist và migration',
    yeuCau: [
      'Run the chapter’s production checklist on your schema; fix or justify every finding|||Chạy checklist production của chương trên lược đồ của bạn; sửa hoặc giải thích từng phát hiện',
      'Catalog queries: foreign keys without an index, tables without a primary key, unused indexes|||Truy vấn catalog: khoá ngoại thiếu chỉ mục, bảng thiếu khoá chính, chỉ mục không ai dùng',
      'Migrations applied by a tool (Prisma Migrate, Flyway, node-pg-migrate…) from the app repo, in order|||Migration được một công cụ (Prisma Migrate, Flyway, node-pg-migrate…) áp từ repo app, theo thứ tự',
      'One schema change done expand-then-contract (no breaking step)|||Một thay đổi lược đồ làm theo kiểu mở rộng rồi thu gọn (không có bước phá vỡ)',
    ],
    nangCao: ['Slow-query logging (log_min_duration_statement) turned on and one logged query explained|||Bật log truy vấn chậm (log_min_duration_statement) và giải thích một truy vấn bị ghi'],
    datKhi: [
      'Checklist results pasted with a decision per line|||Kết quả checklist được dán kèm quyết định cho từng dòng',
      'A fresh database reaches the current schema with one migrate command|||Một cơ sở dữ liệu mới đạt lược đồ hiện tại bằng một lệnh migrate',
    ],
    goiY: [
      'Never edit a migration that already ran somewhere else — add a new one|||Không bao giờ sửa migration đã chạy ở nơi khác — thêm migration mới',
      'Adding a NOT NULL column to a big table: add nullable, backfill, then set NOT NULL|||Thêm cột NOT NULL vào bảng lớn: thêm cột cho phép null, điền dữ liệu, rồi mới đặt NOT NULL',
      'The catalog (pg_constraint, pg_index, pg_stat_user_indexes) answers most checklist questions|||Catalog (pg_constraint, pg_index, pg_stat_user_indexes) trả lời phần lớn câu hỏi checklist',
    ],
    nop: ['repo'],
    demoGiai: 'A table added in a hurry is caught by two catalog queries: its foreign key has no index and it has no primary key — exactly the findings a review should produce.|||Một bảng thêm vội bị hai truy vấn catalog bắt: khoá ngoại không có chỉ mục và bảng không có khoá chính — đúng loại phát hiện một buổi soát phải ra.',
  },
  {
    so: 17, lead: 'Step back and defend the choice of database itself. Interviewers and committees always ask: why PostgreSQL and not MongoDB or SQL Server?|||Lùi lại và bảo vệ chính lựa chọn cơ sở dữ liệu. Người phỏng vấn và hội đồng luôn hỏi: vì sao PostgreSQL mà không MongoDB hay SQL Server?',
    ten: 'Architecture decision record: why this database|||Bản ghi quyết định kiến trúc: vì sao chọn cơ sở dữ liệu này',
    yeuCau: [
      'docs/adr-001-database.md: context, options (PostgreSQL, MongoDB, SQL Server/MySQL), decision, consequences|||docs/adr-001-database.md: bối cảnh, phương án (PostgreSQL, MongoDB, SQL Server/MySQL), quyết định, hệ quả',
      'Show one of your screens as a document (jsonb_build_object) and as rows; discuss which fits each access pattern|||Trình bày một màn hình dưới dạng tài liệu (jsonb_build_object) và dạng dòng; bàn cái nào hợp với từng kiểu truy cập',
      'Port 3 of your queries to another SQL dialect (T-SQL or MySQL) and note the differences|||Chuyển 3 truy vấn của bạn sang phương ngữ SQL khác (T-SQL hoặc MySQL) và ghi điểm khác',
    ],
    nangCao: ['Model the same screen in MongoDB and run it, then compare effort and guarantees|||Mô hình cùng màn hình trong MongoDB và chạy thử, rồi so công sức và mức bảo đảm'],
    datKhi: [
      'The ADR names at least 2 concrete consequences of the decision (what becomes harder)|||ADR nêu ít nhất 2 hệ quả cụ thể của quyết định (cái gì trở nên khó hơn)',
      'The three ported queries are written out with differences listed|||Ba truy vấn đã chuyển được viết ra kèm danh sách điểm khác',
    ],
    goiY: [
      'Decide from your access patterns and invariants, not from popularity|||Quyết định theo kiểu truy cập và bất biến của bạn, không theo độ phổ biến',
      'Where you need transactions across several entities, the relational side usually wins|||Chỗ cần giao dịch qua nhiều thực thể thì phía quan hệ thường thắng',
      'An honest ADR lists what you give up|||Một ADR trung thực liệt kê những gì bạn từ bỏ',
    ],
    nop: ['repo'],
    demoGiai: 'One member’s screen built as a document straight from the relational tables — what MongoDB would store, produced on demand without duplicating data.|||Màn hình của một hội viên dựng thành tài liệu ngay từ các bảng quan hệ — thứ MongoDB sẽ lưu, tạo khi cần mà không nhân bản dữ liệu.',
  },
];
MOC.forEach((m) => { m.slug = 'postgresql-moc-' + m.so; m.sauChuong = CH[m.so]; });

/* ─────────────────────────────── Bảo vệ ─────────────────────────────── */

const BAO_VE = {
  rubric: [
    { tieuChi: 'Schema and constraints|||Lược đồ và ràng buộc', diem: 2, moTa: 'Normalised tables, right types, PK/FK/UNIQUE/CHECK/NOT NULL that encode the business rules; a fresh database builds from migrations in one command.|||Bảng chuẩn hoá, kiểu đúng, PK/FK/UNIQUE/CHECK/NOT NULL thể hiện luật nghiệp vụ; cơ sở dữ liệu mới dựng từ migration bằng một lệnh.' },
    { tieuChi: 'Queries that answer the questions|||Truy vấn trả lời đúng câu hỏi', diem: 2, moTa: 'Joins, reports, CTEs and window functions for every main screen and report, correct on edge cases (zero, ties, time zones).|||JOIN, báo cáo, CTE và hàm cửa sổ cho mọi màn hình và báo cáo chính, đúng ở ca biên (số 0, bằng nhau, múi giờ).' },
    { tieuChi: 'Performance with evidence|||Hiệu năng có bằng chứng', diem: 1.5, moTa: 'An index plan justified by queries, EXPLAIN ANALYZE read correctly, one measured improvement.|||Kế hoạch chỉ mục có truy vấn làm lý do, đọc EXPLAIN ANALYZE đúng, một cải thiện có số đo.' },
    { tieuChi: 'Correctness under concurrency|||Đúng khi đồng thời', diem: 1.5, moTa: 'The critical operation is safe for two simultaneous users, proven with a two-session test; transactions leave no partial state.|||Thao tác then chốt an toàn khi hai người dùng cùng lúc, chứng minh bằng phép thử hai phiên; giao dịch không để lại trạng thái dở dang.' },
    { tieuChi: 'Operations and security|||Vận hành và bảo mật', diem: 1, moTa: 'App role with least privilege, parameterised queries, no secrets in Git, a backup that has been restored, the production checklist applied.|||Role app quyền tối thiểu, truy vấn có tham số, không bí mật trong Git, bản sao lưu đã khôi phục thử, đã áp checklist production.' },
    { tieuChi: 'Answers to the committee|||Trả lời hội đồng', diem: 2, moTa: 'Explains why each design choice was made, predicts a plan or a result before running it, admits trade-offs, changes the schema live when the requirement changes.|||Giải thích vì sao chọn từng thiết kế, đoán trước kế hoạch hay kết quả trước khi chạy, thừa nhận đánh đổi, sửa lược đồ trực tiếp khi yêu cầu đổi.' },
  ],
  cauHoiMau: [
    'Draw your schema from memory. Which relation is many-to-many and how did you model it?|||Vẽ lược đồ từ trí nhớ. Quan hệ nào là nhiều-nhiều và bạn mô hình nó thế nào?',
    'Why is this column integer and not numeric or float? What would go wrong with float?|||Vì sao cột này là integer mà không phải numeric hay float? Dùng float thì hỏng gì?',
    'A user in Hanoi creates a record at 23:30. What is stored, and which month does your report put it in?|||Người dùng ở Hà Nội tạo bản ghi lúc 23:30. Cái gì được lưu, và báo cáo của bạn xếp nó vào tháng nào?',
    'Which business rule is a CHECK constraint, and which one could not be? Where does that one live?|||Luật nghiệp vụ nào là ràng buộc CHECK, luật nào không thể? Luật đó nằm ở đâu?',
    'Show the LEFT JOIN that keeps zeros. What changes if I move its condition into WHERE?|||Cho xem LEFT JOIN giữ số 0. Nếu chuyển điều kiện của nó vào WHERE thì đổi gì?',
    'Why ROW_NUMBER and not RANK in your top-N query? What happens on a tie?|||Vì sao dùng ROW_NUMBER mà không RANK trong truy vấn top-N? Khi bằng nhau thì sao?',
    'Before I run this query, tell me which plan PostgreSQL will choose and why.|||Trước khi tôi chạy truy vấn này, hãy nói PostgreSQL sẽ chọn kế hoạch nào và vì sao.',
    'Why is your composite index in this column order? Which query would not use it?|||Vì sao chỉ mục ghép theo thứ tự cột này? Truy vấn nào sẽ không dùng được nó?',
    'Show me an index you decided NOT to create. Why not?|||Cho xem một chỉ mục bạn quyết định KHÔNG tạo. Vì sao?',
    'In your EXPLAIN ANALYZE, estimated rows are far from actual. What causes that and how do you fix it?|||Trong EXPLAIN ANALYZE, số dòng ước lượng lệch xa thực tế. Do đâu và sửa thế nào?',
    'Two users perform your critical operation at the same millisecond. Walk me through exactly what happens.|||Hai người thực hiện thao tác then chốt cùng một mili-giây. Kể chính xác chuyện gì xảy ra.',
    'Why did you choose a constraint (or a row lock, or SERIALIZABLE) for that? What does it cost?|||Vì sao chọn ràng buộc (hay khoá dòng, hay SERIALIZABLE) cho việc đó? Cái giá là gì?',
    'What is MVCC, and how does it explain why readers do not block writers in your app?|||MVCC là gì, và nó giải thích thế nào việc người đọc không chặn người ghi trong app của bạn?',
    'Your trigger fires on UPDATE. What happens on a bulk update of 100,000 rows?|||Trigger của bạn chạy khi UPDATE. Một lệnh update hàng loạt 100.000 dòng thì sao?',
    'Why is this field inside jsonb and not a column? When would you move it out?|||Vì sao trường này nằm trong jsonb mà không là cột? Khi nào bạn chuyển nó ra?',
    'Type a search with and without Vietnamese accents now. Why do both work?|||Gõ một tìm kiếm có dấu và không dấu ngay bây giờ. Vì sao cả hai đều ra?',
    'What can your application’s database role NOT do? Prove it.|||Role cơ sở dữ liệu của app KHÔNG làm được gì? Chứng minh.',
    'How many connections does your app open under load, and what happens at max_connections?|||App mở bao nhiêu kết nối khi có tải, và chuyện gì xảy ra khi chạm max_connections?',
    'Your database server died one hour ago. Restore it in front of us — how long will it take?|||Máy chủ cơ sở dữ liệu chết một giờ trước. Khôi phục ngay trước mặt chúng tôi — mất bao lâu?',
    'The requirement changes: a record can now belong to two categories. Change the schema and the queries live.|||Yêu cầu đổi: một bản ghi giờ thuộc được hai danh mục. Sửa lược đồ và truy vấn ngay tại chỗ.',
    'You must rename a column used by the running app. How do you do it without downtime?|||Bạn phải đổi tên một cột app đang dùng. Làm sao không gián đoạn?',
    'Why PostgreSQL and not MongoDB for your topic? What would MongoDB have made easier?|||Vì sao PostgreSQL mà không MongoDB cho đề tài của bạn? MongoDB sẽ làm việc gì dễ hơn?',
    'Which query in your project are you least sure is correct, and how would you test it?|||Truy vấn nào trong dự án bạn ít chắc nhất là đúng, và bạn sẽ kiểm nó thế nào?',
    'Which part did an AI assistant help with, and how did you verify it?|||Phần nào có trợ lý AI giúp, và bạn kiểm chứng nó thế nào?',
  ],
  chuanBi: [
    'All 17 milestones submitted, or a note explaining any missing one|||Đã nộp đủ 17 mốc, hoặc có ghi chú giải thích mốc còn thiếu',
    'A fresh clone builds the database from zero: migrate + seed in one or two commands written in README|||Một bản clone mới dựng cơ sở dữ liệu từ số 0: migrate + seed bằng một hai lệnh ghi trong README',
    'README: topic, ERD image, how to run, the 5 questions with links to their queries, known limitations|||README: đề tài, ảnh ERD, cách chạy, 5 câu hỏi kèm link tới truy vấn, giới hạn đã biết',
    'docs/: types.md, constraints.md, performance.md, concurrency.md, runbook.md, adr-001-database.md present and current|||docs/: types.md, constraints.md, performance.md, concurrency.md, runbook.md, adr-001-database.md có mặt và cập nhật',
    'Two psql windows ready for the live concurrency question; a throw-away copy of the database for live schema changes|||Hai cửa sổ psql sẵn cho câu hỏi đồng thời trực tiếp; một bản sao cơ sở dữ liệu nháp để sửa lược đồ trực tiếp',
    'Your latest backup file and the restore commands at hand|||Bản sao lưu mới nhất và các lệnh khôi phục sẵn trong tay',
    'No passwords or connection strings with secrets anywhere in the Git history|||Không mật khẩu hay chuỗi kết nối chứa bí mật ở bất kỳ đâu trong lịch sử Git',
    'You can open, without searching, the file for: the schema, the critical transaction, the slowest query, the app role grants|||Bạn mở được ngay, không cần tìm, tệp chứa: lược đồ, giao dịch then chốt, truy vấn chậm nhất, quyền của role app',
  ],
};

const GIOI_THIEU_EN = '<p><strong>After this course you can design, query, tune and operate the database of a real product on your own.</strong> Not just write SELECT: you will choose types that keep money and time correct, write a schema whose constraints refuse bad data, answer every question your users ask with joins, reports, CTEs and window functions, make the important queries fast with indexes you can justify from EXPLAIN ANALYZE, keep the critical operation correct when two people do it at once, and back up, restore and secure the whole thing.</p>' +
  '<p><strong>Why one project through the whole course?</strong> SQL is learned by living with one schema as it grows — the type you chose in Chapter 2 decides whether the report of Chapter 6 is right, and the index of Chapter 9 decides whether the screen of Chapter 5 is fast. So at the start you register one topic (a library, a clinic, a boarding house, a course platform, food delivery, cinema tickets — or your own) and after every chapter a milestone applies exactly that chapter to its database.</p>' +
  '<p><strong>How it is graded.</strong> 17 milestones (one after each chapter, before the chapter quiz), each with “Done when” criteria you can check yourself and a repository to submit. The course ends with a defence: an AI committee asks about YOUR schema and queries — predict a plan, survive a concurrency question, change the schema live — scored on a 10-point rubric.</p>';
const GIOI_THIEU_VI = '<p><strong>Học xong khoá này bạn tự thiết kế, truy vấn, tối ưu và vận hành được cơ sở dữ liệu của một sản phẩm thật.</strong> Không chỉ viết SELECT: bạn chọn kiểu giữ cho tiền và thời gian luôn đúng, viết lược đồ có ràng buộc từ chối dữ liệu sai, trả lời mọi câu hỏi của người dùng bằng JOIN, báo cáo, CTE và hàm cửa sổ, làm truy vấn quan trọng chạy nhanh bằng chỉ mục có lý do từ EXPLAIN ANALYZE, giữ thao tác then chốt đúng khi hai người cùng làm một lúc, và sao lưu, khôi phục, bảo vệ toàn bộ hệ thống.</p>' +
  '<p><strong>Vì sao làm một dự án xuyên suốt khoá?</strong> SQL học bằng cách sống cùng một lược đồ khi nó lớn dần — kiểu bạn chọn ở Chương 2 quyết định báo cáo Chương 6 có đúng không, chỉ mục ở Chương 9 quyết định màn hình Chương 5 có nhanh không. Vì vậy ngay từ đầu bạn đăng ký một đề tài (thư viện, phòng khám, nhà trọ, nền tảng khoá học, đặt đồ ăn, vé rạp phim — hoặc đề tài tự chọn) và sau mỗi chương có một mốc áp đúng kiến thức chương đó vào cơ sở dữ liệu của đề tài.</p>' +
  '<p><strong>Cách chấm.</strong> 17 mốc (sau mỗi chương, trước quiz chương), mỗi mốc có tiêu chí “Đạt khi” tự kiểm được và một repo để nộp. Khoá kết thúc bằng buổi bảo vệ: hội đồng AI hỏi về lược đồ và truy vấn CỦA BẠN — đoán trước kế hoạch truy vấn, xử lý câu hỏi đồng thời, sửa lược đồ trực tiếp — chấm theo rubric 10 điểm.</p>';

export const DU_AN = {
  version: 1,
  gioiThieu: GIOI_THIEU_EN + '|||' + GIOI_THIEU_VI,
  deTai: DE_TAI,
  tuChon: {
    yeuCauToiThieu: [
      'At least 5 entities with at least one many-to-many relation|||Ít nhất 5 thực thể, có ít nhất một quan hệ nhiều-nhiều',
      'Money or time handled somewhere (prices, bookings, due dates)|||Có xử lý tiền hoặc thời gian ở đâu đó (giá, lượt đặt, hạn trả)',
      'A critical operation two users can do at the same time (last seat, same slot, stock)|||Có một thao tác then chốt hai người có thể làm cùng lúc (ghế cuối, cùng khung giờ, tồn kho)',
      'Reports an owner would read (per day/month, per category)|||Có báo cáo mà chủ sẽ đọc (theo ngày/tháng, theo danh mục)',
      'Enough realistic data can be generated: main table ≥ 1,000 rows|||Sinh được đủ dữ liệu giống thật: bảng chính ≥ 1.000 dòng',
      'Some text users search and some flexible attributes (for JSONB and full-text milestones)|||Có chữ người dùng tìm kiếm và vài thuộc tính linh hoạt (cho mốc JSONB và full-text)',
      'No real personal data — generate fake names and phone numbers|||Không dùng dữ liệu cá nhân thật — tự sinh tên và số điện thoại giả',
    ],
    goiYQuyMo: 'Right size: 6–10 tables, one critical concurrent operation, 5 user questions and 4 reports, about 40–60 hours over the course. Too small: 2–3 tables with no relation worth joining (a to-do list). Too big: a whole ERP or a social network with feeds, chat and payments — cut to one core flow and keep the rest as “future work”.|||Vừa sức: 6–10 bảng, một thao tác đồng thời then chốt, 5 câu hỏi người dùng và 4 báo cáo, khoảng 40–60 giờ rải theo khoá. Quá nhỏ: 2–3 bảng không có quan hệ đáng JOIN (danh sách việc cần làm). Quá to: cả một ERP hay mạng xã hội có feed, chat và thanh toán — cắt về một luồng lõi, phần còn lại ghi “hướng phát triển”.',
  },
  moc: MOC.map(({ so, slug, ten, sauChuong, yeuCau, nangCao, datKhi, goiY, nop }) => ({ so, slug, ten, sauChuong, yeuCau, nangCao, datKhi, goiY, nop })),
  baoVe: BAO_VE,
};

/* ───────────────────── Dựng bài mốc / bảo vệ / lời mời ───────────────────── */

const tach = (s, i) => { const p = String(s).split('|||'); return (p[i] ?? p[0]).trim(); };
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const li = (arr, i) => arr.map((x) => '<li>' + esc(tach(x, i)) + '</li>').join('');

const NHAN = [
  {
    eyebrow: (m) => 'Course project · Milestone ' + m.so + ' of ' + MOC.length + ' · after ' + tach(m.sauChuong, 0),
    topic: 'This milestone applies to the topic you registered in lesson 0.1. The table says what it means for each suggested topic; a self-chosen topic follows the same requirements — if one does not fit, write in the README which part of your topic practises that skill instead.',
    req: '✅ Required', stretch: '⭐ Stretch (optional)', map: '🧭 What this milestone means for each topic', th: '<tr><th>Topic</th><th>What you build now</th></tr>',
    hints: '💡 Hints — open one layer at a time', hintNote: 'Try first. Open hint 1 only when stuck, then 2, then 3.',
    demo: '▶️ Minimal working example — sample topic “Badminton court booking”',
    demoNote: 'The sample topic is deliberately not one of the suggested topics: it shows the moves, not the answer for yours. The SQL below was run for real on PostgreSQL 17.12 (Docker postgres:17, session time zone Asia/Ho_Chi_Minh), milestone after milestone on the same database; the output is pasted unchanged, error lines included.',
    hl: ['Hint 1', 'Hint 2', 'Hint 3'],
    done: '🎯 Done when', submit: '📤 Submit',
    submitNote: 'Paste the repository link (and the commit or tag that completes this milestone) into the submission box below this lesson, tick the “Done when” items, then mark the milestone as done.',
    nop: { repo: 'repository link + commit/tag of this milestone', demo: 'link to a running demo', anh: 'screenshot of the result (psql output or diagram)' },
  },
  {
    eyebrow: (m) => 'Dự án cuối khoá · Mốc ' + m.so + '/' + MOC.length + ' · sau ' + tach(m.sauChuong, 1),
    topic: 'Mốc này áp vào đề tài bạn đã đăng ký ở bài 0.1. Bảng bên dưới cho biết với từng đề tài gợi ý thì mốc này nghĩa là gì; đề tài tự chọn làm theo đúng các yêu cầu chung — yêu cầu nào không hợp thì ghi trong README phần nào của đề tài luyện kỹ năng đó thay thế.',
    req: '✅ Yêu cầu bắt buộc', stretch: '⭐ Nâng cao (tuỳ chọn)', map: '🧭 Mốc này nghĩa là gì với từng đề tài', th: '<tr><th>Đề tài</th><th>Phần bạn làm ở mốc này</th></tr>',
    hints: '💡 Gợi ý — mở từng tầng một', hintNote: 'Tự làm trước. Kẹt mới mở gợi ý 1, rồi 2, rồi 3.',
    demo: '▶️ Ví dụ tối thiểu chạy được — đề tài mẫu “Đặt sân cầu lông”',
    demoNote: 'Đề tài mẫu cố ý không nằm trong danh sách gợi ý: nó cho thấy các bước đi, không phải lời giải cho đề tài của bạn. Đoạn SQL dưới đây đã chạy THẬT trên PostgreSQL 17.12 (Docker postgres:17, múi giờ phiên Asia/Ho_Chi_Minh), mốc nối mốc trên cùng một cơ sở dữ liệu; output dán nguyên văn, kể cả dòng lỗi.',
    hl: ['Gợi ý 1', 'Gợi ý 2', 'Gợi ý 3'],
    done: '🎯 Đạt khi', submit: '📤 Nộp bài',
    submitNote: 'Dán link repo (và commit hoặc tag hoàn thành mốc này) vào khung nộp bài bên dưới bài này, tick các mục “Đạt khi”, rồi đánh dấu mốc đã xong.',
    nop: { repo: 'link repo + commit/tag của mốc này', demo: 'link demo đang chạy', anh: 'ảnh chụp kết quả (output psql hoặc sơ đồ)' },
  },
];

/** baiMoc(so) → bài EXERCISE của mốc `so` (chèn trước quiz Chương so). */
export function baiMoc(so) {
  const m = MOC.find((x) => x.so === so);
  if (!m) throw new Error('postgresql _du-an: không có mốc ' + so);
  const d = DEMO[so];
  if (!d) throw new Error('postgresql _du-an: thiếu DEMO[' + so + '] — chạy lại _du-an-nguon');
  const khoi = (i) => {
    const N = NHAN[i];
    const bang = DE_TAI.map((t) => {
      const b = t.banDoChuong.find((x) => x.moc === so);
      return '<tr><td>' + esc(tach(t.ten, i)) + '</td><td>' + esc(b ? tach(b.dung, i) : '—') + '</td></tr>';
    }).join('');
    const hints = m.goiY.map((g, k) => '<details class="tu-kiem"><summary>' + N.hl[k] + '</summary><p>' + esc(tach(g, i)) + '</p></details>').join('\n');
    return [
      '<div class="' + (i === 0 ? 'ml-en' : 'ml-vi') + '">',
      '<span class="eyebrow">' + esc(N.eyebrow(m)) + '</span>',
      '<h2>' + esc(tach(m.ten, i)) + '</h2>',
      '<p class="lead">' + esc(tach(m.lead, i)) + '</p>',
      '<p>' + N.topic + '</p>',
      '<h3>' + N.req + '</h3>',
      '<ol>' + li(m.yeuCau, i) + '</ol>',
      '<h3>' + N.stretch + '</h3>',
      '<ul>' + li(m.nangCao, i) + '</ul>',
      '<h3>' + N.map + '</h3>',
      '<table><thead>' + N.th + '</thead><tbody>' + bang + '</tbody></table>',
      '<h3>' + N.demo + '</h3>',
      '<p class="note-ct">' + N.demoNote + '</p>',
      '<pre><code class="language-' + d.lang + '">' + esc(d.code) + '</code></pre>',
      '<div class="out">' + esc(d.out) + '</div>',
      '<p>' + esc(tach(m.demoGiai, i)) + '</p>',
      '<h3>' + N.hints + '</h3>',
      '<p>' + N.hintNote + '</p>',
      hints,
      '<div class="callout ok"><p><strong>' + N.done + '</strong></p><ul>' + li(m.datKhi, i) + '</ul></div>',
      '<h3>' + N.submit + '</h3>',
      '<ul>' + m.nop.map((k) => '<li>' + N.nop[k] + '</li>').join('') + '</ul>',
      '<p>' + N.submitNote + '</p>',
      '</div>',
    ].join('\n');
  };
  return {
    title: '🛠 Project milestone ' + so + ' — ' + tach(m.ten, 0) + '|||🛠 Mốc dự án ' + so + ' — ' + tach(m.ten, 1),
    slug: m.slug,
    type: 'EXERCISE',
    mocDuAn: so,
    isFreePreview: true,
    description: 'Mốc dự án ' + so + '/' + MOC.length + ' (sau ' + tach(m.sauChuong, 1) + '): ' + tach(m.ten, 1) + ' — yêu cầu, đạt khi, gợi ý theo tầng và ví dụ SQL chạy thật.',
    content: '\n' + khoi(0) + '\n' + khoi(1) + '\n',
  };
}

/** baiBaoVe() → bài EXERCISE cuối khoá { baoVeDuAn: true }. */
export function baiBaoVe() {
  const tong = BAO_VE.rubric.reduce((a, r) => a + r.diem, 0);
  const khoi = (i) => {
    const en = i === 0;
    const so = (x) => (en ? String(x) : String(x).replace('.', ','));
    const rub = BAO_VE.rubric.map((r) => '<tr><td>' + esc(tach(r.tieuChi, i)) + '</td><td>' + so(r.diem) + '</td><td>' + esc(tach(r.moTa, i)) + '</td></tr>').join('');
    return [
      '<div class="' + (en ? 'ml-en' : 'ml-vi') + '">',
      '<span class="eyebrow">' + (en ? 'Course project · Finish & defend' : 'Dự án cuối khoá · Hoàn thiện & bảo vệ') + '</span>',
      '<h2>' + (en ? 'Finish your database project and defend it' : 'Hoàn thiện dự án cơ sở dữ liệu và bảo vệ nó') + '</h2>',
      '<p class="lead">' + (en
        ? 'Seventeen milestones turned your registered topic into a real database: schema, data, queries, indexes, a concurrency-safe critical operation, roles, backups and a decision record. This last step is how an assignment or a technical interview ends: you hand in something that runs from zero, then you explain it. The AI defence room below plays the committee.'
        : 'Mười bảy mốc đã biến đề tài bạn đăng ký thành một cơ sở dữ liệu thật: lược đồ, dữ liệu, truy vấn, chỉ mục, thao tác then chốt an toàn khi đồng thời, role, sao lưu và bản ghi quyết định. Bước cuối giống cách một assignment hay một buổi phỏng vấn kỹ thuật kết thúc: bạn nộp thứ chạy được từ số 0, rồi giải thích nó. Phòng bảo vệ AI bên dưới đóng vai hội đồng.') + '</p>',
      '<h3>' + (en ? '☑️ Checklist before you enter the room' : '☑️ Danh sách kiểm trước khi vào phòng') + '</h3>',
      '<div class="callout ok"><ul>' + li(BAO_VE.chuanBi, i) + '</ul></div>',
      '<h3>' + (en ? '🧮 Rubric (' + tong + ' points)' : '🧮 Rubric (' + tong + ' điểm)') + '</h3>',
      '<table><thead>' + (en ? '<tr><th>Criterion</th><th>Points</th><th>What the committee looks for</th></tr>' : '<tr><th>Tiêu chí</th><th>Điểm</th><th>Hội đồng tìm gì</th></tr>') + '</thead><tbody>' + rub + '</tbody></table>',
      '<h3>' + (en ? '🎤 Questions committees really ask' : '🎤 Những câu hội đồng hay hỏi thật') + '</h3>',
      '<p>' + (en ? 'Practise each answer with psql open: run the query, show the plan, point to the migration. A good answer says what the database does, why you chose it, and what you would change if the requirement changed.' : 'Tập trả lời mỗi câu với psql mở sẵn: chạy truy vấn, cho xem kế hoạch, chỉ đúng migration. Câu trả lời tốt nói được cơ sở dữ liệu làm gì, vì sao bạn chọn vậy, và nếu yêu cầu đổi thì bạn sửa gì.') + '</p>',
      '<ol>' + li(BAO_VE.cauHoiMau, i) + '</ol>',
      '<div class="pitfall co-tieu-de"><p><strong>' + (en ? 'Trap — a schema you cannot rebuild.' : 'Bẫy — một lược đồ bạn không dựng lại được.') + '</strong> ' + (en
        ? 'If your database only exists because you typed commands by hand over weeks, the first live question (“drop it and rebuild”) fails. Everything must come from migrations and the seed script in the repository.'
        : 'Nếu cơ sở dữ liệu chỉ tồn tại vì bạn gõ tay từng lệnh suốt mấy tuần, câu hỏi trực tiếp đầu tiên (“xoá đi và dựng lại”) sẽ trượt. Mọi thứ phải đến từ migration và script seed trong repo.') + '</p></div>',
      '<div class="callout ok"><p><strong>' + (en ? '🎯 Done when' : '🎯 Đạt khi') + '</strong></p><ul>' + (en
        ? '<li>Every checklist item above is ticked.</li><li>You submitted the repository and the final tag in the box below.</li><li>You finished one session in the AI defence room and read its feedback.</li><li>You fixed what the feedback found (or wrote why not) and, if you want a better score, defended again.</li>'
        : '<li>Mọi mục trong danh sách kiểm ở trên đã đánh dấu.</li><li>Bạn đã nộp repo và tag cuối ở khung bên dưới.</li><li>Bạn đã xong một phiên trong phòng bảo vệ AI và đọc nhận xét.</li><li>Bạn đã sửa những gì nhận xét chỉ ra (hoặc ghi lý do không sửa) và, nếu muốn điểm cao hơn, bảo vệ lại.</li>') + '</ul></div>',
      '<p class="note-ct">' + (en ? 'When you are ready, open the defence room below. It asks one question at a time about YOUR project and scores you on the rubric with written feedback.' : 'Khi đã sẵn sàng, mở phòng bảo vệ bên dưới. Nó hỏi từng câu một về dự án CỦA BẠN và chấm theo rubric kèm nhận xét viết.') + '</p>',
      '</div>',
    ].join('\n');
  };
  return {
    title: '🎓 Finish & defend your course project|||🎓 Hoàn thiện & bảo vệ dự án cuối khoá',
    slug: 'postgresql-bao-ve-du-an',
    type: 'EXERCISE',
    baoVeDuAn: true,
    isFreePreview: true,
    description: 'Bài cuối khoá: checklist hoàn thiện dự án cơ sở dữ liệu, rubric 10 điểm, câu hội đồng hay hỏi về lược đồ và truy vấn của chính bạn, và phòng bảo vệ AI.',
    content: '\n' + khoi(0) + '\n' + khoi(1) + '\n',
  };
}

/** Đoạn nối cuối bài 0.1: học xong làm được gì + danh sách đề tài + lời mời đăng ký (EN/VI). */
export function moiDangKy(lang) {
  const i = lang === 'en' ? 0 : 1;
  const ds = DE_TAI.map((d) => '<li><strong>' + esc(tach(d.ten, i)) + '</strong> — ' + esc(tach(d.moTa, i)) + '</li>').join('');
  return [
    '<h3>' + (i === 0 ? '🎯 Your course project' : '🎯 Dự án cuối khoá của bạn') + '</h3>',
    i === 0 ? GIOI_THIEU_EN : GIOI_THIEU_VI,
    '<p>' + (i === 0 ? 'Suggested topics (or propose your own — an AI reviewer checks that it covers the course and is the right size):' : 'Đề tài gợi ý (hoặc tự đề xuất — AI sẽ duyệt xem đề tài có phủ kiến thức khoá và vừa sức không):') + '</p>',
    '<ul>' + ds + '</ul>',
    '<p><strong>' + (i === 0 ? 'Register your course project topic below.' : 'Hãy đăng ký đề tài dự án cuối khoá của bạn ở bên dưới.') + '</strong></p>',
  ].join('\n');
}

export default DU_AN;
