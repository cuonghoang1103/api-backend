/**
 * Spring Boot — "Dự án xuyên suốt khoá" (hợp đồng: docs/du-an-hop-dong.md v1, soạn 22/11/2026).
 *
 * MỘT nguồn sự thật cho cả ba nơi:
 *   1. `duAn` ở cấp gốc của content/courses/spring-boot.mjs (import default từ file này);
 *   2. bài mốc `sb-moc-N` (EXERCISE, mocDuAn: N) — spring-boot.mjs chèn `baiMoc(N)` vào cuối mỗi mục/chương,
 *      ngay TRƯỚC bài quiz của chương (chương chưa có quiz ⇒ bài cuối chương);
 *   3. bài bảo vệ cuối khoá `sb-bao-ve-du-an` (EXERCISE, baoVeDuAn: true) — `baiBaoVe()`.
 * Sửa yêu cầu một mốc ⇒ sửa Ở ĐÂY. Phần "khung mẫu chạy thật" của từng mốc nằm ở ./_du-an-mau.mjs
 * (đề tài mẫu "Kho thiết bị CLB" — cố ý KHÔNG nằm trong danh sách gợi ý; mã + output chạy thật).
 *
 * Ánh xạ mốc ↔ chương: mốc 1 = Mục 0; mốc N+1 = Chương N (N = 1…21).
 *
 * ⚠️ File được course-content-check quét: không backtick trần, không gạch chéo ngược đơn.
 * Chuỗi dữ liệu là CHỮ THUẦN "EN|||VI" (được thoát HTML khi dựng bài); tiếng Anh dùng ’ thay nháy đơn.
 */
import { MAU } from './_du-an-mau.mjs';

/* ─────────────────────────────── Đề tài gợi ý ─────────────────────────────── */
const DE_TAI = [
  {
    slug: 'labflow',
    ten: 'LabFlow — booking computer labs and devices|||LabFlow — đặt lịch phòng máy và thiết bị',
    moTa: 'Students book computer labs and devices by time slot; lab managers approve bookings and keep devices working. It is the project the lessons themselves build, so every chapter has a worked example — choose it if you want to follow the course closely, then make it yours with one extra feature of your own design.|||Sinh viên đặt phòng máy và thiết bị theo khung giờ; quản lý lab duyệt lượt đặt và giữ thiết bị hoạt động. Đây chính là dự án các bài học dựng, nên chương nào cũng có ví dụ mẫu — chọn nó nếu muốn bám sát khoá, rồi biến nó thành của bạn bằng một tính năng tự thiết kế.',
    doKho: 2,
    tinhNang: [
      'Labs, devices and time slots with opening hours|||Phòng lab, thiết bị và khung giờ theo giờ mở cửa',
      'Booking that refuses overlapping slots (409)|||Đặt lịch, từ chối khung giờ chồng nhau (409)',
      'Manager approves or rejects; student cancels own booking|||Quản lý duyệt hoặc từ chối; sinh viên huỷ lượt của chính mình',
      'Device fault reports and maintenance status|||Báo hỏng thiết bị và trạng thái bảo trì',
      'Search labs by building, capacity and free time|||Tìm phòng theo toà, sức chứa và giờ trống',
      'No-show rule: unused bookings auto-expire|||Luật vắng mặt: lượt đặt không dùng tự hết hạn',
      'Usage report per lab per week|||Báo cáo mức dùng từng phòng theo tuần',
      'Staff back-office pages for managers|||Trang quản trị cho quản lý',
    ],
    banDoChuong: [
      { moc: 1, dung: 'Project labflow from Initializr, packages lab/booking/user, README with the pitch|||Dự án labflow từ Initializr, package lab/booking/user, README có câu giới thiệu' },
      { moc: 2, dung: 'Records Lab, Device, Slot; sealed BookingState (Pending/Approved/Rejected/Cancelled)|||Record Lab, Device, Slot; sealed BookingState (Pending/Approved/Rejected/Cancelled)' },
      { moc: 3, dung: 'Weekly usage per lab with Collectors.groupingBy; concurrent booking simulation|||Mức dùng từng phòng theo tuần bằng groupingBy; mô phỏng đặt đồng thời' },
      { moc: 4, dung: 'BookingService with constructor injection; opening hours in @ConfigurationProperties|||BookingService tiêm qua constructor; giờ mở cửa trong @ConfigurationProperties' },
      { moc: 5, dung: 'CRUD /labs and POST /bookings with DTOs, 201 + Location, paging|||CRUD /labs và POST /bookings với DTO, 201 + Location, phân trang' },
      { moc: 6, dung: 'End after start, slot inside opening hours, ProblemDetail errors|||Giờ kết thúc sau giờ bắt đầu, khung giờ trong giờ mở cửa, lỗi ProblemDetail' },
      { moc: 7, dung: 'Entities Lab, Device, Booking, User with relations; booking in one transaction|||Entity Lab, Device, Booking, User có quan hệ; đặt lịch trong một transaction' },
      { moc: 8, dung: 'Booking list without N+1; two students booking the same slot ⇒ one 409|||Danh sách lượt đặt không N+1; hai sinh viên đặt cùng khung ⇒ một người 409' },
      { moc: 9, dung: 'V1 schema, V2 seed labs, an exclusion or unique constraint against overlaps|||V1 schema, V2 nạp phòng lab, ràng buộc exclusion/unique chống trùng giờ' },
      { moc: 10, dung: 'Roles STUDENT/MANAGER; only managers approve; only the owner cancels|||Vai trò STUDENT/MANAGER; chỉ quản lý duyệt; chỉ chủ lượt đặt được huỷ' },
      { moc: 11, dung: 'Try IDOR on /bookings/{id}, mass-assign "status":"APPROVED", fix both|||Thử IDOR ở /bookings/{id}, mass-assign "status":"APPROVED", vá cả hai' },
      { moc: 12, dung: 'Tests for overlap rule, approval permissions, repository with Testcontainers|||Test luật trùng giờ, quyền duyệt, repository với Testcontainers' },
      { moc: 13, dung: 'OpenAPI for all routes; a small page listing free slots|||OpenAPI cho mọi tuyến; một trang nhỏ liệt kê giờ trống' },
      { moc: 14, dung: 'Cache the lab list; evict on lab change; rate-limit booking attempts|||Cache danh sách phòng; xoá cache khi đổi phòng; giới hạn tần suất đặt' },
      { moc: 15, dung: 'Email on approval after commit; job that expires no-shows|||Gửi email khi duyệt sau commit; job làm hết hạn lượt vắng mặt' },
      { moc: 16, dung: 'Readiness with DB, metric bookings.created, request id in logs|||Readiness có DB, số đo bookings.created, mã request trong log' },
      { moc: 17, dung: 'Load-test the free-slot search; add an index; compare p95|||Đo tải tìm giờ trống; thêm chỉ mục; so p95' },
      { moc: 18, dung: 'Dockerfile, compose with PostgreSQL + Redis, CI with tests|||Dockerfile, compose có PostgreSQL + Redis, CI chạy test' },
      { moc: 19, dung: 'v1.0.0 with README, demo accounts, smoke test|||v1.0.0 với README, tài khoản demo, smoke test' },
      { moc: 20, dung: 'Thymeleaf pages for managers: pending bookings, approve with one click|||Trang Thymeleaf cho quản lý: lượt chờ duyệt, duyệt một cú bấm' },
      { moc: 21, dung: 'Device maintenance history as documents in MongoDB|||Lịch sử bảo trì thiết bị dạng document trong MongoDB' },
      { moc: 22, dung: 'React booking page with login, token refresh and deploy next to the API|||Trang đặt lịch React có đăng nhập, làm mới token, deploy cạnh API' },
    ],
    thamKhaoThat: [
      'Room and resource booking systems that universities run for labs and meeting rooms|||Hệ thống đặt phòng, tài nguyên mà các trường đại học dùng cho phòng lab và phòng họp',
      'The LabFlow capstone of this course (Chapter 18) and of the Node.js course|||Dự án cuối khoá LabFlow của chính khoá này (Chương 18) và của khoá Node.js',
    ],
    anh: null,
  },
  {
    slug: 'thu-vien',
    ten: 'University library: loans, holds and late fees|||Thư viện trường: mượn, đặt trước và phạt trễ hạn',
    moTa: 'Librarians manage titles and physical copies; students search, borrow, renew and place holds; the system computes due dates and late fees. Clear rules (max loans, renew limits, holds queue) make it a great fit for validation, transactions and scheduled jobs.|||Thủ thư quản lý đầu sách và bản sao; sinh viên tìm, mượn, gia hạn và đặt trước; hệ thống tính hạn trả và tiền phạt. Luật rõ ràng (số lượt mượn tối đa, giới hạn gia hạn, hàng đợi đặt trước) rất hợp để luyện validation, giao dịch và job hẹn giờ.',
    doKho: 2,
    tinhNang: [
      'Titles, authors, categories and physical copies with barcodes|||Đầu sách, tác giả, thể loại và bản sao có mã vạch',
      'Search by title, author, ISBN with paging|||Tìm theo tên, tác giả, ISBN có phân trang',
      'Borrow and return with a maximum number of loans|||Mượn và trả với số lượt mượn tối đa',
      'Renew at most twice if nobody holds the title|||Gia hạn tối đa hai lần nếu không ai đặt trước',
      'Holds queue: first in line is notified when a copy returns|||Hàng đợi đặt trước: người đầu hàng được báo khi có bản trả về',
      'Late fees computed per day, paid at the desk|||Tiền phạt tính theo ngày, nộp tại quầy',
      'Librarian back office and monthly report|||Trang quản trị cho thủ thư và báo cáo tháng',
      'Reading history and reviews per title|||Lịch sử đọc và đánh giá từng đầu sách',
    ],
    banDoChuong: [
      { moc: 1, dung: 'Project library, packages catalog/loan/member|||Dự án library, package catalog/loan/member' },
      { moc: 2, dung: 'Records Title, Copy; sealed LoanState (OnLoan/Overdue/Returned/Lost)|||Record Title, Copy; sealed LoanState (OnLoan/Overdue/Returned/Lost)' },
      { moc: 3, dung: 'Most borrowed titles per month with Streams; fee computation|||Đầu sách mượn nhiều nhất theo tháng bằng Stream; tính tiền phạt' },
      { moc: 4, dung: 'Loan rules (max loans, renewals, fee per day) in @ConfigurationProperties|||Luật mượn (số lượt, số lần gia hạn, phạt/ngày) trong @ConfigurationProperties' },
      { moc: 5, dung: 'GET /titles with search and paging, POST /loans, POST /loans/{id}/renew|||GET /titles có tìm và phân trang, POST /loans, POST /loans/{id}/renew' },
      { moc: 6, dung: 'ISBN format validator; renew refused with 422 and a clear reason|||Validator định dạng ISBN; gia hạn bị từ chối 422 kèm lý do rõ' },
      { moc: 7, dung: 'Title 1–n Copy, Copy 1–n Loan, Member 1–n Loan, Hold queue table|||Title 1–n Copy, Copy 1–n Loan, Member 1–n Loan, bảng hàng đợi Hold' },
      { moc: 8, dung: 'Catalog page without N+1; last copy borrowed by two people ⇒ one 409|||Trang danh mục không N+1; bản cuối bị hai người mượn ⇒ một người 409' },
      { moc: 9, dung: 'Flyway V1 schema, V2 categories, V3 add fee column (expand)|||Flyway V1 schema, V2 thể loại, V3 thêm cột phạt (expand)' },
      { moc: 10, dung: 'Roles STUDENT/LIBRARIAN; students see only their own loans|||Vai trò STUDENT/LIBRARIAN; sinh viên chỉ thấy lượt mượn của mình' },
      { moc: 11, dung: 'Attack: read another student’s history, set your own fee to 0|||Tấn công: đọc lịch sử người khác, tự đặt tiền phạt về 0' },
      { moc: 12, dung: 'Tests for renew rules and fees; holds queue with a real database|||Test luật gia hạn và tiền phạt; hàng đợi đặt trước với CSDL thật' },
      { moc: 13, dung: 'OpenAPI; a search page calling the API|||OpenAPI; một trang tìm sách gọi API' },
      { moc: 14, dung: 'Cache popular searches; evict when a title changes|||Cache các lượt tìm phổ biến; xoá khi đầu sách đổi' },
      { moc: 15, dung: 'Nightly overdue job; notify the next person in the holds queue|||Job ban đêm đánh dấu quá hạn; báo người kế tiếp trong hàng đợi' },
      { moc: 16, dung: 'Metric loans.overdue, health with DB, structured logs|||Số đo loans.overdue, health có DB, log có cấu trúc' },
      { moc: 17, dung: 'Load-test search; add a trigram or B-tree index; compare|||Đo tải tìm kiếm; thêm chỉ mục trigram hoặc B-tree; so sánh' },
      { moc: 18, dung: 'Image + compose + CI|||Image + compose + CI' },
      { moc: 19, dung: 'v1.0.0, README with librarian and student demo accounts|||v1.0.0, README có tài khoản demo thủ thư và sinh viên' },
      { moc: 20, dung: 'Thymeleaf desk pages: check-in by barcode, collect fees|||Trang Thymeleaf tại quầy: trả sách theo mã vạch, thu phạt' },
      { moc: 21, dung: 'Reviews and reading notes as MongoDB documents|||Đánh giá và ghi chú đọc dạng document MongoDB' },
      { moc: 22, dung: 'React catalog with login, holds and my-loans page|||Danh mục React có đăng nhập, đặt trước và trang sách đang mượn' },
    ],
    thamKhaoThat: [
      'Koha and Evergreen — open-source integrated library systems used by real libraries|||Koha và Evergreen — hệ thống thư viện mã nguồn mở được thư viện thật sử dụng',
      'The OPAC (online catalogue) of your own university library|||Trang tra cứu (OPAC) của chính thư viện trường bạn',
    ],
    anh: null,
  },
  {
    slug: 'phong-kham',
    ten: 'Clinic appointments: doctors, shifts and visit records|||Phòng khám: bác sĩ, ca khám và hồ sơ khám',
    moTa: 'Patients book an appointment with a doctor in a free shift slot; receptionists confirm and check patients in; doctors write the visit record and prescription. Double booking, cancellations close to the time and private medical data make it a demanding but very realistic API.|||Bệnh nhân đặt lịch với bác sĩ vào khung trống của ca khám; lễ tân xác nhận và tiếp đón; bác sĩ ghi hồ sơ khám và đơn thuốc. Đặt trùng, huỷ sát giờ và dữ liệu y tế riêng tư làm đây là một API khó nhưng rất sát thực tế.',
    doKho: 3,
    tinhNang: [
      'Doctors, specialties and weekly shifts split into slots|||Bác sĩ, chuyên khoa và ca làm hằng tuần chia thành khung giờ',
      'Book a free slot; never two patients in one slot|||Đặt khung trống; không bao giờ hai bệnh nhân một khung',
      'Cancel up to 2 hours before; late cancels are recorded|||Huỷ trước tối thiểu 2 giờ; huỷ muộn bị ghi nhận',
      'Receptionist check-in and waiting list for the day|||Lễ tân tiếp đón và danh sách chờ trong ngày',
      'Visit record and prescription written by the doctor only|||Hồ sơ khám và đơn thuốc chỉ bác sĩ được ghi',
      'Patients see only their own records|||Bệnh nhân chỉ xem được hồ sơ của mình',
      'Reminder the day before the appointment|||Nhắc lịch trước một ngày',
      'Report: visits per doctor per week|||Báo cáo: số lượt khám mỗi bác sĩ theo tuần',
    ],
    banDoChuong: [
      { moc: 1, dung: 'Project clinic, packages doctor/appointment/visit|||Dự án clinic, package doctor/appointment/visit' },
      { moc: 2, dung: 'Records Doctor, Slot; sealed AppointmentState; LocalDateTime vs Instant decided|||Record Doctor, Slot; sealed AppointmentState; chốt LocalDateTime hay Instant' },
      { moc: 3, dung: 'Free slots per doctor computed with Streams; parallel booking simulation|||Tính khung trống từng bác sĩ bằng Stream; mô phỏng đặt song song' },
      { moc: 4, dung: 'Cancellation window and slot length in configuration; dev/prod profiles|||Hạn huỷ và độ dài khung giờ trong cấu hình; profile dev/prod' },
      { moc: 5, dung: 'GET /doctors/{id}/slots?date=, POST /appointments, DELETE = cancel|||GET /doctors/{id}/slots?date=, POST /appointments, DELETE = huỷ' },
      { moc: 6, dung: 'Slot must be in the future and inside a shift; 422 for late cancels|||Khung phải ở tương lai và trong ca; huỷ muộn trả 422' },
      { moc: 7, dung: 'Doctor, Shift, Appointment, Patient, VisitRecord with relations|||Doctor, Shift, Appointment, Patient, VisitRecord có quan hệ' },
      { moc: 8, dung: 'Day schedule without N+1; same slot booked twice ⇒ one 409|||Lịch trong ngày không N+1; một khung đặt hai lần ⇒ một người 409' },
      { moc: 9, dung: 'Flyway with a unique (doctor, start) constraint and seed specialties|||Flyway có ràng buộc unique (bác sĩ, giờ bắt đầu) và nạp chuyên khoa' },
      { moc: 10, dung: 'Roles PATIENT/RECEPTION/DOCTOR; doctor-only visit records|||Vai trò PATIENT/RECEPTION/DOCTOR; chỉ bác sĩ ghi hồ sơ' },
      { moc: 11, dung: 'Attack: read another patient’s record by id; leak data in error messages|||Tấn công: đọc hồ sơ người khác bằng id; lộ dữ liệu qua thông báo lỗi' },
      { moc: 12, dung: 'Tests for slot rules, permissions per role, a real-DB booking race|||Test luật khung giờ, quyền theo vai trò, tranh chấp đặt lịch trên CSDL thật' },
      { moc: 13, dung: 'OpenAPI; a page that shows a doctor’s free slots|||OpenAPI; một trang hiện khung trống của bác sĩ' },
      { moc: 14, dung: 'Cache the doctor directory; never cache medical records|||Cache danh bạ bác sĩ; không bao giờ cache hồ sơ y tế' },
      { moc: 15, dung: 'Reminder job the day before; event after booking is committed|||Job nhắc lịch trước một ngày; sự kiện sau khi đặt lịch đã commit' },
      { moc: 16, dung: 'Metric appointments.booked, logs without personal data|||Số đo appointments.booked, log không chứa dữ liệu cá nhân' },
      { moc: 17, dung: 'Load-test the slots endpoint for 50 doctors; fix the slowest query|||Đo tải endpoint khung giờ cho 50 bác sĩ; sửa truy vấn chậm nhất' },
      { moc: 18, dung: 'Image + compose + CI|||Image + compose + CI' },
      { moc: 19, dung: 'v1.0.0, README with three demo roles|||v1.0.0, README có ba vai trò demo' },
      { moc: 20, dung: 'Thymeleaf reception desk: today’s list, check-in, walk-in booking|||Quầy lễ tân bằng Thymeleaf: danh sách hôm nay, tiếp đón, đặt tại chỗ' },
      { moc: 21, dung: 'Flexible visit notes and attachments metadata in MongoDB|||Ghi chú khám linh hoạt và thông tin tệp đính kèm trong MongoDB' },
      { moc: 22, dung: 'React patient portal: book, cancel, see my visits|||Cổng bệnh nhân React: đặt, huỷ, xem lượt khám của tôi' },
    ],
    thamKhaoThat: [
      'Online doctor-booking platforms (for example BookingCare in Vietnam, Doctolib in Europe)|||Nền tảng đặt lịch khám trực tuyến (ví dụ BookingCare ở Việt Nam, Doctolib ở châu Âu)',
      'Hospital information systems (HIS) and their outpatient modules|||Hệ thống thông tin bệnh viện (HIS) và phân hệ khám ngoại trú',
    ],
    anh: null,
  },
  {
    slug: 'ban-hang',
    ten: 'Online shop orders: stock, cart and checkout|||Đơn hàng cửa hàng online: tồn kho, giỏ và thanh toán',
    moTa: 'A small shop sells products with variants (size, colour). Customers fill a cart and check out; staff confirm, ship and refund. Stock must never go negative even when a flash sale sends a hundred orders per second — the classic test of transactions and locking.|||Một cửa hàng nhỏ bán sản phẩm có biến thể (size, màu). Khách bỏ vào giỏ và thanh toán; nhân viên xác nhận, giao và hoàn tiền. Tồn kho không bao giờ được âm kể cả khi flash sale dồn một trăm đơn mỗi giây — bài kiểm tra kinh điển cho giao dịch và khoá.',
    doKho: 3,
    tinhNang: [
      'Products, variants and stock per variant|||Sản phẩm, biến thể và tồn kho theo biến thể',
      'Cart that survives log-out; prices locked at checkout|||Giỏ hàng còn sau khi đăng xuất; giá chốt lúc thanh toán',
      'Checkout that reserves stock in one transaction|||Thanh toán giữ tồn kho trong một transaction',
      'Order states: placed, paid, shipped, delivered, refunded|||Trạng thái đơn: đã đặt, đã trả, đang giao, đã giao, đã hoàn',
      'Simulated payment with an idempotency key|||Thanh toán giả lập có idempotency key',
      'Discount codes with usage limits|||Mã giảm giá có giới hạn lượt dùng',
      'Staff order board and refunds|||Bảng đơn cho nhân viên và hoàn tiền',
      'Sales report per day and best sellers|||Báo cáo doanh thu theo ngày và hàng bán chạy',
    ],
    banDoChuong: [
      { moc: 1, dung: 'Project shop, packages catalog/cart/order|||Dự án shop, package catalog/cart/order' },
      { moc: 2, dung: 'Records Product, Variant; money as long in đồng (never double); sealed OrderState|||Record Product, Variant; tiền là long theo đồng (không bao giờ double); sealed OrderState' },
      { moc: 3, dung: 'Best sellers with Streams; 1.000 concurrent “buy last item” attempts|||Hàng bán chạy bằng Stream; 1.000 lượt “mua món cuối” đồng thời' },
      { moc: 4, dung: 'Shipping fee and max cart size in configuration; PaymentGateway interface with a fake bean|||Phí ship và số món tối đa trong cấu hình; interface PaymentGateway với bean giả' },
      { moc: 5, dung: 'GET /products with filters, POST /cart/items, POST /orders|||GET /products có lọc, POST /cart/items, POST /orders' },
      { moc: 6, dung: 'Quantity ≥ 1, valid variant, 422 when out of stock|||Số lượng ≥ 1, biến thể hợp lệ, 422 khi hết hàng' },
      { moc: 7, dung: 'Product, Variant, Cart, Order, OrderLine; checkout in one transaction|||Product, Variant, Cart, Order, OrderLine; thanh toán trong một transaction' },
      { moc: 8, dung: 'Order list without N+1; flash sale never oversells (lock or conditional update)|||Danh sách đơn không N+1; flash sale không bán vượt (khoá hoặc update có điều kiện)' },
      { moc: 9, dung: 'Flyway with CHECK (stock >= 0) and seed products|||Flyway có CHECK (stock >= 0) và nạp sản phẩm' },
      { moc: 10, dung: 'Roles CUSTOMER/STAFF; customers see only their orders|||Vai trò CUSTOMER/STAFF; khách chỉ thấy đơn của mình' },
      { moc: 11, dung: 'Attack: send your own price in the order body; read others’ orders|||Tấn công: tự gửi giá trong body đơn hàng; đọc đơn người khác' },
      { moc: 12, dung: 'Tests for totals and discounts; oversell race with a real DB|||Test tổng tiền và giảm giá; tranh chấp bán vượt với CSDL thật' },
      { moc: 13, dung: 'OpenAPI; product page that calls the API|||OpenAPI; trang sản phẩm gọi API' },
      { moc: 14, dung: 'Cache product pages; evict on price or stock change|||Cache trang sản phẩm; xoá khi giá hoặc tồn kho đổi' },
      { moc: 15, dung: 'Order-confirmed email after commit; cancel unpaid orders after 30 minutes|||Email xác nhận sau commit; huỷ đơn chưa trả sau 30 phút' },
      { moc: 16, dung: 'Metrics orders.placed and revenue; trace one checkout in logs|||Số đo orders.placed và doanh thu; lần theo một lượt thanh toán trong log' },
      { moc: 17, dung: 'Load-test checkout; measure lock wait; pick the faster correct design|||Đo tải thanh toán; đo thời gian chờ khoá; chọn thiết kế đúng mà nhanh hơn' },
      { moc: 18, dung: 'Image + compose + CI|||Image + compose + CI' },
      { moc: 19, dung: 'v1.0.0, README, demo customer and staff|||v1.0.0, README, tài khoản demo khách và nhân viên' },
      { moc: 20, dung: 'Thymeleaf staff board: orders by state, ship, refund|||Bảng nhân viên bằng Thymeleaf: đơn theo trạng thái, giao, hoàn' },
      { moc: 21, dung: 'Product reviews with photos metadata in MongoDB|||Đánh giá sản phẩm kèm thông tin ảnh trong MongoDB' },
      { moc: 22, dung: 'React storefront with cart, login and checkout|||Cửa hàng React có giỏ, đăng nhập và thanh toán' },
    ],
    thamKhaoThat: [
      'Order flows of large Vietnamese marketplaces (Shopee, Tiki, Lazada) — cart, order states, refunds|||Luồng đơn của các sàn lớn ở Việt Nam (Shopee, Tiki, Lazada) — giỏ, trạng thái đơn, hoàn tiền',
      'Open-source e-commerce back ends such as Broadleaf Commerce (Java/Spring)|||Backend thương mại điện tử mã nguồn mở như Broadleaf Commerce (Java/Spring)',
    ],
    anh: null,
  },
  {
    slug: 'nha-tro',
    ten: 'Student boarding house: rooms, contracts and monthly bills|||Nhà trọ sinh viên: phòng, hợp đồng và hoá đơn hằng tháng',
    moTa: 'A landlord manages rooms, tenants and contracts; each month the system creates bills from electricity and water readings; tenants pay and report broken things. Money, dates and monthly jobs are everywhere, so it rewards getting time zones and integer amounts right.|||Chủ trọ quản lý phòng, người thuê và hợp đồng; mỗi tháng hệ thống lập hoá đơn từ chỉ số điện nước; người thuê thanh toán và báo hỏng. Tiền, ngày tháng và job hằng tháng ở khắp nơi, nên dự án thưởng cho người làm đúng múi giờ và số tiền nguyên.',
    doKho: 2,
    tinhNang: [
      'Rooms with price, capacity and status|||Phòng có giá, sức chứa và trạng thái',
      'Contracts with start, end, deposit and tenants|||Hợp đồng có ngày bắt đầu, kết thúc, tiền cọc và người thuê',
      'Monthly meter readings for electricity and water|||Chỉ số điện nước hằng tháng',
      'Bills generated per room per month, never twice|||Hoá đơn sinh cho từng phòng mỗi tháng, không bao giờ hai lần',
      'Payments and remaining debt per tenant|||Thanh toán và công nợ còn lại của từng người thuê',
      'Maintenance requests with status|||Yêu cầu sửa chữa có trạng thái',
      'Landlord dashboard: empty rooms, unpaid bills|||Bảng điều khiển chủ trọ: phòng trống, hoá đơn chưa trả',
      'Contract-ending reminders|||Nhắc hợp đồng sắp hết hạn',
    ],
    banDoChuong: [
      { moc: 1, dung: 'Project boarding, packages room/contract/billing|||Dự án boarding, package room/contract/billing' },
      { moc: 2, dung: 'Records Room, Reading; money as long; YearMonth for billing periods|||Record Room, Reading; tiền là long; YearMonth cho kỳ hoá đơn' },
      { moc: 3, dung: 'Debt per tenant with Streams; bill totals from readings|||Công nợ từng người thuê bằng Stream; tổng hoá đơn từ chỉ số' },
      { moc: 4, dung: 'Unit prices for electricity/water in configuration; BillingService bean|||Đơn giá điện/nước trong cấu hình; bean BillingService' },
      { moc: 5, dung: 'CRUD /rooms, POST /contracts, POST /readings, GET /bills?month=|||CRUD /rooms, POST /contracts, POST /readings, GET /bills?month=' },
      { moc: 6, dung: 'New reading must be ≥ previous; contract end after start|||Chỉ số mới phải ≥ chỉ số cũ; ngày kết thúc sau ngày bắt đầu' },
      { moc: 7, dung: 'Room, Tenant, Contract, Reading, Bill, Payment with relations|||Room, Tenant, Contract, Reading, Bill, Payment có quan hệ' },
      { moc: 8, dung: 'Bill list without N+1; two payments at once never over-credit a bill|||Danh sách hoá đơn không N+1; hai lần trả cùng lúc không làm dư công nợ' },
      { moc: 9, dung: 'Flyway with unique (room, month) on bills|||Flyway có unique (phòng, tháng) cho hoá đơn' },
      { moc: 10, dung: 'Roles LANDLORD/TENANT; tenants see their own room only|||Vai trò LANDLORD/TENANT; người thuê chỉ thấy phòng mình' },
      { moc: 11, dung: 'Attack: pay someone else’s bill id; change your own debt|||Tấn công: trả hoá đơn id của người khác; tự sửa công nợ' },
      { moc: 12, dung: 'Tests for bill computation and month boundaries in Asia/Ho_Chi_Minh|||Test tính hoá đơn và ranh giới tháng ở múi giờ Asia/Ho_Chi_Minh' },
      { moc: 13, dung: 'OpenAPI; a tenant page showing this month’s bill|||OpenAPI; trang người thuê xem hoá đơn tháng này' },
      { moc: 14, dung: 'Cache the empty-rooms list; evict on contract change|||Cache danh sách phòng trống; xoá khi hợp đồng đổi' },
      { moc: 15, dung: 'Monthly billing job (idempotent); contract-ending reminder|||Job lập hoá đơn hằng tháng (idempotent); nhắc hợp đồng hết hạn' },
      { moc: 16, dung: 'Metric bills.unpaid; health; logs of the billing job|||Số đo bills.unpaid; health; log của job lập hoá đơn' },
      { moc: 17, dung: 'Generate bills for 2.000 rooms; measure and batch it|||Lập hoá đơn cho 2.000 phòng; đo và chạy theo lô' },
      { moc: 18, dung: 'Image + compose + CI|||Image + compose + CI' },
      { moc: 19, dung: 'v1.0.0, README, demo landlord and tenant|||v1.0.0, README, tài khoản demo chủ trọ và người thuê' },
      { moc: 20, dung: 'Thymeleaf landlord pages: enter readings for all rooms in one form|||Trang chủ trọ bằng Thymeleaf: nhập chỉ số mọi phòng trong một form' },
      { moc: 21, dung: 'Maintenance requests with photos and comments in MongoDB|||Yêu cầu sửa chữa có ảnh và bình luận trong MongoDB' },
      { moc: 22, dung: 'React tenant app: bills, pay, report a problem|||App người thuê bằng React: hoá đơn, trả tiền, báo sự cố' },
    ],
    thamKhaoThat: [
      'Rental-management apps for small landlords on Google Play and the App Store|||Các app quản lý nhà trọ cho chủ trọ nhỏ trên Google Play và App Store',
      'The PRJ301 boarding-house topic many FPT University teams choose|||Đề tài nhà trọ ở PRJ301 mà nhiều nhóm Đại học FPT chọn',
    ],
    anh: null,
  },
  {
    slug: 'su-kien',
    ten: 'Club event ticketing: seats, holds and check-in|||Bán vé sự kiện CLB: chỗ ngồi, giữ chỗ và check-in',
    moTa: 'Student clubs publish events with ticket types and limited seats; students hold a ticket for 10 minutes, pay (simulated) and receive a QR code; organisers check people in at the door. Hold expiry and “never sell seat 101 twice” make it the hardest — and most fun — concurrency topic.|||CLB đăng sự kiện có loại vé và số chỗ giới hạn; sinh viên giữ vé 10 phút, thanh toán (giả lập) rồi nhận mã QR; ban tổ chức check-in ở cửa. Giữ chỗ hết hạn và “không bao giờ bán ghế 101 hai lần” làm đây là đề tài đồng thời khó nhất — và vui nhất.',
    doKho: 3,
    tinhNang: [
      'Events, ticket types, prices and seat limits|||Sự kiện, loại vé, giá và giới hạn chỗ',
      'Hold a ticket for 10 minutes, then release automatically|||Giữ vé 10 phút rồi tự nhả',
      'Simulated payment with an idempotency key|||Thanh toán giả lập có idempotency key',
      'Ticket with a signed QR code|||Vé có mã QR được ký',
      'Check-in at the door: a ticket works only once|||Check-in ở cửa: mỗi vé chỉ dùng một lần',
      'Organiser roles per club|||Vai trò ban tổ chức theo từng CLB',
      'Waiting list when sold out|||Danh sách chờ khi hết vé',
      'Attendance report after the event|||Báo cáo người tham dự sau sự kiện',
    ],
    banDoChuong: [
      { moc: 1, dung: 'Project tickets, packages event/ticket/checkin|||Dự án tickets, package event/ticket/checkin' },
      { moc: 2, dung: 'Records Event, TicketType; sealed TicketState (Held/Paid/Used/Expired)|||Record Event, TicketType; sealed TicketState (Held/Paid/Used/Expired)' },
      { moc: 3, dung: '500 virtual threads try to buy the last 10 seats — count the oversell|||500 virtual thread tranh 10 chỗ cuối — đếm số vé bán vượt' },
      { moc: 4, dung: 'Hold duration in configuration; QrSigner bean behind an interface|||Thời gian giữ chỗ trong cấu hình; bean QrSigner sau một interface' },
      { moc: 5, dung: 'GET /events, POST /events/{id}/holds, POST /holds/{id}/pay|||GET /events, POST /events/{id}/holds, POST /holds/{id}/pay' },
      { moc: 6, dung: 'Quantity limits per person; 409 when sold out; 410 when a hold expired|||Giới hạn số vé mỗi người; 409 khi hết vé; 410 khi giữ chỗ đã hết hạn' },
      { moc: 7, dung: 'Club, Event, TicketType, Ticket, CheckIn with relations|||Club, Event, TicketType, Ticket, CheckIn có quan hệ' },
      { moc: 8, dung: 'No oversell under concurrency (conditional update or lock), proven by a race|||Không bán vượt khi đồng thời (update có điều kiện hoặc khoá), chứng minh bằng tranh chấp thật' },
      { moc: 9, dung: 'Flyway with CHECK (sold <= capacity) and unique ticket codes|||Flyway có CHECK (sold <= capacity) và mã vé unique' },
      { moc: 10, dung: 'Roles STUDENT/ORGANISER per club; organisers manage only their club|||Vai trò STUDENT/ORGANISER theo CLB; ban tổ chức chỉ quản lý CLB mình' },
      { moc: 11, dung: 'Attack: forge a QR code, replay a check-in, mass-assign price 0|||Tấn công: giả mã QR, check-in lại lần hai, mass-assign giá 0' },
      { moc: 12, dung: 'Tests for hold expiry with a fixed Clock; race test with a real DB|||Test hết hạn giữ chỗ với Clock cố định; test tranh chấp với CSDL thật' },
      { moc: 13, dung: 'OpenAPI; an event page with live seats left|||OpenAPI; trang sự kiện hiện số chỗ còn lại' },
      { moc: 14, dung: 'Seats-left counter in Redis; rate-limit hold attempts|||Bộ đếm chỗ còn lại bằng Redis; giới hạn tần suất giữ chỗ' },
      { moc: 15, dung: 'Job releasing expired holds; ticket email after payment commit|||Job nhả giữ chỗ hết hạn; email vé sau khi thanh toán commit' },
      { moc: 16, dung: 'Metrics tickets.sold and holds.expired; check-in logs|||Số đo tickets.sold và holds.expired; log check-in' },
      { moc: 17, dung: 'Load-test 200 users buying at once; measure errors and p99|||Đo tải 200 người cùng mua; đo lỗi và p99' },
      { moc: 18, dung: 'Image + compose (PostgreSQL + Redis) + CI|||Image + compose (PostgreSQL + Redis) + CI' },
      { moc: 19, dung: 'v1.0.0, README, demo organiser and student|||v1.0.0, README, tài khoản demo ban tổ chức và sinh viên' },
      { moc: 20, dung: 'Thymeleaf organiser pages: create event, door check-in screen|||Trang ban tổ chức bằng Thymeleaf: tạo sự kiện, màn hình check-in ở cửa' },
      { moc: 21, dung: 'Event feedback forms with varying questions in MongoDB|||Phiếu góp ý sự kiện với câu hỏi thay đổi theo từng sự kiện trong MongoDB' },
      { moc: 22, dung: 'React event page: hold, countdown, pay, show QR|||Trang sự kiện React: giữ chỗ, đếm ngược, thanh toán, hiện QR' },
    ],
    thamKhaoThat: [
      'Ticketing platforms such as Ticketbox (Vietnam) and Eventbrite|||Nền tảng bán vé như Ticketbox (Việt Nam) và Eventbrite',
      'Concert and cinema seat reservation flows (hold → pay → ticket)|||Luồng giữ ghế xem phim, ca nhạc (giữ → trả → vé)',
    ],
    anh: null,
  },
];

/* ─────────────────────────────── Mốc ─────────────────────────────── */
const MOC = [
  {
    so: 1, slug: 'sb-moc-1', chuong: 0, sauChuong: 'Section 0|||Mục 0',
    ten: 'Day 0: a skeleton that starts, in a Git repository|||Ngày 0: bộ khung khởi động được, nằm trong một repo Git',
    lead: 'Turn the topic you registered into a real Spring Boot project. Every later milestone grows THIS project, so set up the structure and the repository properly today.|||Biến đề tài bạn đã đăng ký thành một dự án Spring Boot thật. Mọi mốc sau đều phát triển CHÍNH dự án này, nên hôm nay dựng cấu trúc và repo cho đúng.',
    yeuCau: [
      'Generate the project with Spring Initializr: Java 21, Maven, Spring Web, Validation; group and artifact named after your topic|||Sinh dự án bằng Spring Initializr: Java 21, Maven, Spring Web, Validation; group và artifact đặt theo đề tài',
      'One package per business feature (e.g. lab, booking, user), not one package per layer for the whole app|||Mỗi tính năng nghiệp vụ một package (vd lab, booking, user), không phải một package cho mỗi tầng của cả app',
      'One GET endpoint that answers 200 with a small JSON, written as controller → service (no database yet)|||Một endpoint GET trả 200 với JSON nhỏ, viết theo controller → service (chưa có CSDL)',
      'A Git repository with a .gitignore for target/ and IDE files, pushed to GitHub|||Repo Git có .gitignore cho target/ và file IDE, đã push lên GitHub',
      'README.md: topic name, one-sentence pitch, the 6–12 features you plan, how to run (./mvnw spring-boot:run)|||README.md: tên đề tài, câu giới thiệu một dòng, 6–12 tính năng dự kiến, cách chạy (./mvnw spring-boot:run)',
    ],
    nangCao: [
      'Add the Maven Wrapper to the repository so a fresh clone runs without installing Maven|||Thêm Maven Wrapper vào repo để bản clone mới chạy được mà không cài Maven',
      'Run with --debug once and note three auto-configurations that matched|||Chạy với --debug một lần, ghi lại ba auto-configuration đã khớp',
    ],
    datKhi: [
      'A fresh clone starts with ./mvnw spring-boot:run and the log shows “Started … in … seconds”|||Một bản clone mới khởi động bằng ./mvnw spring-boot:run và log có dòng “Started … in … seconds”',
      'curl on your endpoint returns 200 and JSON|||curl vào endpoint của bạn trả 200 và JSON',
      'git status is clean and target/ is not in the repository|||git status sạch và target/ không có trong repo',
    ],
    goiY: [
      'Port 8080 already in use? Another app is running — set server.port in application.yml or stop it (lesson 0.1)|||Cổng 8080 đã bị chiếm? Có app khác đang chạy — đặt server.port trong application.yml hoặc tắt nó (bài 0.1)',
      'Controller in a package outside the main class’s package is never scanned — move it under the root package (lesson 0.2)|||Controller ở package nằm ngoài package của lớp main sẽ không được quét — chuyển nó vào dưới package gốc (bài 0.2)',
      'Write the README pitch as “X lets Y do Z” — if you cannot, the topic is still too vague|||Viết câu giới thiệu theo mẫu “X giúp Y làm Z” — chưa viết được tức là đề tài còn mơ hồ',
    ],
    nop: ['repo', 'anh'],
    bangChung: [
      'Link to the repository and the commit of this milestone|||Link repo và commit của mốc này',
      'Screenshot or pasted log line “Started … in … seconds” and the curl output|||Ảnh hoặc dòng log “Started … in … seconds” và output của curl',
    ],
  },
  {
    so: 2, slug: 'sb-moc-2', chuong: 1, sauChuong: 'Chapter 1|||Chương 1',
    ten: 'The domain in modern Java: records, sealed states, the right collections|||Domain bằng Java hiện đại: record, trạng thái sealed, đúng collection',
    lead: 'Before Spring touches anything, model your topic in plain Java 21. A good model makes illegal states impossible to write.|||Trước khi Spring chạm vào thứ gì, hãy mô hình hoá đề tài bằng Java 21 thuần. Một mô hình tốt làm trạng thái sai không viết ra được.',
    yeuCau: [
      'At least 3 records for the main things of your topic (no setters, validated in the compact constructor)|||Ít nhất 3 record cho các thực thể chính của đề tài (không setter, kiểm hợp lệ trong compact constructor)',
      'A sealed interface for the life cycle of your main object (booking, loan, order, ticket…) with one record per state|||Một sealed interface cho vòng đời đối tượng chính (lượt đặt, lượt mượn, đơn, vé…) với mỗi trạng thái một record',
      'One switch expression over that sealed type with no default branch|||Một switch expression trên kiểu sealed đó, không có nhánh default',
      'Choose List, Set or Map on purpose for 3 places and write why in a comment|||Chọn List, Set hay Map có chủ đích ở 3 chỗ và ghi lý do trong chú thích',
      'A main method or JUnit test that prints a realistic example of your data|||Một hàm main hoặc test JUnit in ra ví dụ dữ liệu sát thực tế',
    ],
    nangCao: [
      'A record pattern with a guard (case X(var a, var b) when …)|||Một record pattern có guard (case X(var a, var b) when …)',
      'Money as long in the smallest unit, never double — show 0.1 + 0.2 to explain why|||Tiền là long ở đơn vị nhỏ nhất, không bao giờ double — in 0.1 + 0.2 để giải thích vì sao',
    ],
    datKhi: [
      'Removing one case from your switch makes the code fail to compile|||Xoá một case trong switch thì mã không biên dịch được',
      'Two records with the same values are equal and a HashSet keeps only one|||Hai record cùng giá trị thì bằng nhau và HashSet chỉ giữ một',
      'No class in your model has a public setter|||Không lớp nào trong mô hình có setter public',
    ],
    goiY: [
      'States that carry different data (Overdue has daysLate, Returned has a date) are exactly what sealed + records are for (lesson 1.2)|||Các trạng thái mang dữ liệu khác nhau (Quá hạn có số ngày trễ, Đã trả có ngày trả) đúng là chỗ dùng sealed + record (bài 1.2)',
      'Entities for JPA come later (Chapter 6) — today records are fine because nothing is saved yet|||Entity cho JPA để sau (Chương 6) — hôm nay record là đủ vì chưa lưu gì',
      'Pick a Map when you look things up by a key more than you iterate (lesson 1.5)|||Chọn Map khi bạn tra theo khoá nhiều hơn là duyệt (bài 1.5)',
    ],
    nop: ['repo'],
    bangChung: [
      'Link to the commit with the model package|||Link commit chứa package mô hình',
      'Output of your main method or test|||Output của hàm main hoặc test',
    ],
  },
  {
    so: 3, slug: 'sb-moc-3', chuong: 2, sauChuong: 'Chapter 2|||Chương 2',
    ten: 'Reports with Streams, and a race you can see|||Báo cáo bằng Stream, và một cuộc tranh chấp nhìn thấy được',
    lead: 'Your users will ask “how many, per what?” and they will click at the same time. Answer the first with Streams and make the second visible before Spring and the database hide it.|||Người dùng sẽ hỏi “bao nhiêu, theo cái gì?” và sẽ bấm cùng lúc. Trả lời câu đầu bằng Stream và làm câu sau hiện rõ trước khi Spring và CSDL che nó đi.',
    yeuCau: [
      'Two reports of your topic with Collectors.groupingBy (count per category, total per member, top 3…)|||Hai báo cáo của đề tài bằng Collectors.groupingBy (đếm theo loại, tổng theo người, top 3…)',
      'One method returning Optional instead of null, used with orElseThrow|||Một hàm trả Optional thay cho null, dùng với orElseThrow',
      'A simulation: thousands of tasks on virtual threads change one shared counter — print the wrong result, then fix it with an atomic type or a lock|||Mô phỏng: hàng nghìn tác vụ trên virtual thread cùng sửa một bộ đếm chung — in kết quả sai, rồi sửa bằng kiểu atomic hoặc khoá',
      'A note in README: which action of your topic is the real-world version of that race|||Một ghi chú trong README: thao tác nào của đề tài là phiên bản đời thật của cuộc tranh chấp đó',
    ],
    nangCao: [
      'Run the race 3 times and record how much the wrong result varies|||Chạy tranh chấp 3 lần và ghi kết quả sai dao động bao nhiêu',
      'Measure one report with a plain for loop vs a stream and say which you keep|||Đo một báo cáo bằng vòng for thường và bằng stream, nói bạn giữ cách nào',
    ],
    datKhi: [
      'The unsafe counter prints a number lower than expected at least once; the fixed one is always exact|||Bộ đếm không an toàn in ra số nhỏ hơn kỳ vọng ít nhất một lần; bản đã sửa luôn chính xác',
      'Both reports print correct numbers for a dataset you can check by hand|||Cả hai báo cáo in đúng số với một bộ dữ liệu bạn kiểm tay được',
      'No method in your code returns null for “not found”|||Không hàm nào trả null cho “không tìm thấy”',
    ],
    goiY: [
      'count++ is three steps (read, add, write); two threads can read the same value (lesson 2.4)|||count++ là ba bước (đọc, cộng, ghi); hai luồng có thể đọc cùng một giá trị (bài 2.4)',
      'Executors.newVirtualThreadPerTaskExecutor() in try-with-resources waits for all tasks (lesson 2.5)|||Executors.newVirtualThreadPerTaskExecutor() trong try-with-resources sẽ chờ mọi tác vụ (bài 2.5)',
      'groupingBy with a TreeMap supplier gives sorted keys — easier to compare outputs|||groupingBy với TreeMap cho khoá đã sắp xếp — dễ so output hơn',
    ],
    nop: ['repo'],
    bangChung: [
      'Link to the commit with the reports and the race|||Link commit chứa báo cáo và tranh chấp',
      'Output of two runs of the race (wrong and fixed)|||Output hai lượt chạy tranh chấp (sai và đã sửa)',
    ],
  },
  {
    so: 4, slug: 'sb-moc-4', chuong: 3, sauChuong: 'Chapter 3|||Chương 3',
    ten: 'Let Spring wire it: layers, injection and rules in configuration|||Để Spring nối dây: tầng, tiêm phụ thuộc và luật trong cấu hình',
    lead: 'Move your model into Spring: services and repositories as beans connected by constructors, and the numbers of your business rules in application.yml instead of the code.|||Đưa mô hình vào Spring: service và repository là bean nối với nhau qua constructor, còn các con số của luật nghiệp vụ nằm trong application.yml thay vì trong mã.',
    yeuCau: [
      'A service per feature with constructor injection only (no @Autowired on fields)|||Mỗi tính năng một service, chỉ tiêm qua constructor (không @Autowired trên field)',
      'A repository interface with an in-memory implementation (the database comes in milestone 7)|||Một interface repository với bản cài đặt trong bộ nhớ (CSDL đến ở mốc 7)',
      'A record annotated @ConfigurationProperties + @Validated holding at least 2 business limits of your topic|||Một record @ConfigurationProperties + @Validated chứa ít nhất 2 giới hạn nghiệp vụ của đề tài',
      'Profiles dev and prod: dev has sample data, prod refuses to start without required settings|||Profile dev và prod: dev có dữ liệu mẫu, prod từ chối khởi động khi thiếu cấu hình bắt buộc',
    ],
    nangCao: [
      'One interface with two implementations chosen by profile (e.g. a fake email sender in dev)|||Một interface có hai bản cài đặt chọn theo profile (vd bộ gửi email giả ở dev)',
      'An @Aspect that logs how long each service method takes|||Một @Aspect ghi thời gian chạy của từng hàm service',
    ],
    datKhi: [
      'Setting a limit to an invalid value makes the app fail at startup with a message naming the property|||Đặt một giới hạn sai làm app hỏng ngay lúc khởi động với thông báo nêu đúng tên thuộc tính',
      'Changing a limit in application.yml changes behaviour without editing Java|||Đổi một giới hạn trong application.yml thì hành vi đổi mà không sửa Java',
      'No new keyword creates a service or repository inside another bean|||Không có từ khoá new tạo service hay repository bên trong bean khác',
    ],
    goiY: [
      'Constructor injection makes the dependency visible and the class testable with plain new in tests (lesson 3.2)|||Tiêm qua constructor làm phụ thuộc hiện rõ và lớp test được bằng new thường trong test (bài 3.2)',
      'Add @ConfigurationPropertiesScan on the main class or @EnableConfigurationProperties on a config class (lesson 3.7)|||Thêm @ConfigurationPropertiesScan ở lớp main hoặc @EnableConfigurationProperties ở lớp cấu hình (bài 3.7)',
      'Fail fast: a wrong setting found at startup costs a minute; found by a customer it costs a weekend|||Hỏng sớm: cấu hình sai lộ ra lúc khởi động mất một phút; khách hàng phát hiện thì mất cả cuối tuần',
    ],
    nop: ['repo', 'anh'],
    bangChung: [
      'Link to the commit|||Link commit',
      'The “APPLICATION FAILED TO START” output for one invalid setting|||Output “APPLICATION FAILED TO START” khi một cấu hình sai',
    ],
  },
  {
    so: 5, slug: 'sb-moc-5', chuong: 4, sauChuong: 'Chapter 4|||Chương 4',
    ten: 'The REST API of your main resource|||REST API cho tài nguyên chính',
    lead: 'Give your topic a real HTTP face: resources, methods and status codes that a front-end developer can use without asking you.|||Cho đề tài một gương mặt HTTP thật: tài nguyên, method và mã trạng thái mà lập trình viên frontend dùng được mà không phải hỏi bạn.',
    yeuCau: [
      'Full CRUD for your main resource, plus one action endpoint (approve, return, pay, cancel…)|||CRUD đầy đủ cho tài nguyên chính, thêm một endpoint hành động (duyệt, trả, thanh toán, huỷ…)',
      'Request and response DTOs as records — no entity or internal model returned directly|||DTO request và response là record — không trả thẳng entity hay mô hình nội bộ',
      'POST returns 201 with a Location header; DELETE returns 204; unknown id returns 404|||POST trả 201 kèm header Location; DELETE trả 204; id không có trả 404',
      'A list endpoint with paging and one filter|||Một endpoint danh sách có phân trang và một bộ lọc',
      'A table of all routes (method, path, status codes) in README|||Bảng mọi tuyến (method, đường dẫn, mã trạng thái) trong README',
    ],
    nangCao: [
      'An Idempotency-Key header on the POST that creates money or bookings|||Header Idempotency-Key cho POST tạo ra tiền hoặc lượt đặt',
      'A filter or interceptor that adds a request id to every response|||Một filter hoặc interceptor thêm mã request vào mọi phản hồi',
    ],
    datKhi: [
      'Every route in the README table answers with the documented status code when called with curl|||Mọi tuyến trong bảng README trả đúng mã trạng thái đã ghi khi gọi bằng curl',
      'A field that exists only inside your model never appears in any JSON response|||Một trường chỉ có trong mô hình nội bộ không bao giờ xuất hiện trong JSON trả về',
      'Page 2 of the list returns different items than page 1|||Trang 2 của danh sách trả các mục khác trang 1',
    ],
    goiY: [
      'ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}") builds the Location URI (lesson 4.5)|||ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}") dựng URI cho Location (bài 4.5)',
      'An action like “return” is a POST to a sub-resource, not a PUT that rewrites everything|||Hành động như “trả” là POST tới tài nguyên con, không phải PUT ghi đè mọi thứ',
      'Map DTOs by hand at first — it shows exactly which fields cross the boundary (lesson 4.2)|||Lúc đầu ánh xạ DTO bằng tay — nó cho thấy chính xác trường nào đi qua ranh giới (bài 4.2)',
    ],
    nop: ['repo'],
    bangChung: [
      'Link to the commit|||Link commit',
      'curl output for create (with Location), read, list page 2, delete and one 404|||Output curl cho tạo (có Location), đọc, danh sách trang 2, xoá và một lỗi 404',
    ],
  },
  {
    so: 6, slug: 'sb-moc-6', chuong: 5, sauChuong: 'Chapter 5|||Chương 5',
    ten: 'Refuse bad input politely: validation and one error format|||Từ chối dữ liệu xấu một cách lịch sự: validation và một định dạng lỗi',
    lead: 'Every input of your API is now checked, and every error — wrong field, broken rule, missing thing — comes back in the same RFC 9457 shape.|||Mọi dữ liệu vào API giờ đều được kiểm, và mọi lỗi — sai trường, phạm luật, không tồn tại — đều trả về cùng một hình dạng RFC 9457.',
    yeuCau: [
      'Bean Validation on every request DTO, with @Valid in the controller|||Bean Validation trên mọi DTO request, có @Valid ở controller',
      'One cross-field or custom validator from your topic (end after start, reading ≥ previous…)|||Một validator liên trường hoặc tuỳ biến từ đề tài (kết thúc sau bắt đầu, chỉ số ≥ chỉ số cũ…)',
      'A @RestControllerAdvice returning ProblemDetail: 400 with a per-field errors map, 404, 409 and 422 for business rules|||Một @RestControllerAdvice trả ProblemDetail: 400 có bảng lỗi từng trường, 404, 409 và 422 cho luật nghiệp vụ',
      'No stack trace and no SQL text ever reaches the client|||Không stack trace và không câu SQL nào tới được client',
    ],
    nangCao: [
      'Separate DTOs (or validation groups) for create and update|||DTO riêng (hoặc validation group) cho tạo mới và cập nhật',
      'Error messages in Vietnamese through messages.properties|||Thông báo lỗi tiếng Việt qua messages.properties',
    ],
    datKhi: [
      'An empty JSON body returns 400 listing every missing field at once|||Body JSON rỗng trả 400 liệt kê mọi trường thiếu cùng lúc',
      'Breaking one business rule returns 422 (or 409) with a sentence a user understands|||Phạm một luật nghiệp vụ trả 422 (hoặc 409) với câu người dùng đọc hiểu',
      'All error responses have the content type application/problem+json|||Mọi phản hồi lỗi có content type application/problem+json',
    ],
    goiY: [
      'MethodArgumentNotValidException carries every field error — collect them into a map (lesson 5.2)|||MethodArgumentNotValidException mang mọi lỗi trường — gom chúng vào một map (bài 5.2)',
      'Rules that need the database (is this slot free?) belong in the service, not in an annotation (lesson 5.3)|||Luật cần CSDL (khung này còn trống không?) thuộc về service, không phải annotation (bài 5.3)',
      '400 = the request is malformed; 422 = well-formed but breaks a rule; 409 = conflicts with the current state|||400 = request sai dạng; 422 = đúng dạng nhưng phạm luật; 409 = xung đột với trạng thái hiện tại',
    ],
    nop: ['repo'],
    bangChung: [
      'Link to the commit|||Link commit',
      'curl output of one 400, one 422 (or 409) and one 404|||Output curl của một lỗi 400, một 422 (hoặc 409) và một 404',
    ],
  },
  {
    so: 7, slug: 'sb-moc-7', chuong: 6, sauChuong: 'Chapter 6|||Chương 6',
    ten: 'Real data: JPA entities, relations and transactions on PostgreSQL|||Dữ liệu thật: entity JPA, quan hệ và giao dịch trên PostgreSQL',
    lead: 'Replace the in-memory repository with PostgreSQL through Spring Data JPA. The controllers and DTOs from milestones 5–6 should not change at all.|||Thay repository trong bộ nhớ bằng PostgreSQL qua Spring Data JPA. Controller và DTO của mốc 5–6 lẽ ra không phải đổi gì.',
    yeuCau: [
      'At least 3 entities with relations (@ManyToOne, @OneToMany) and LAZY fetching|||Ít nhất 3 entity có quan hệ (@ManyToOne, @OneToMany) và fetch LAZY',
      'Spring Data repositories with at least one derived query and one @Query|||Repository Spring Data có ít nhất một derived query và một @Query',
      'The main action of your topic runs in one @Transactional service method that changes 2+ tables|||Thao tác chính của đề tài chạy trong một hàm service @Transactional đổi 2+ bảng',
      'PostgreSQL in Docker; connection settings from environment variables, password not in Git|||PostgreSQL trong Docker; thông số kết nối từ biến môi trường, mật khẩu không nằm trong Git',
    ],
    nangCao: [
      'A projection (record) for a list screen instead of whole entities|||Một projection (record) cho màn danh sách thay vì cả entity',
      'Show that an exception in the middle rolls back both tables|||Cho thấy một exception ở giữa làm rollback cả hai bảng',
    ],
    datKhi: [
      'Restarting the app keeps the data|||Khởi động lại app thì dữ liệu vẫn còn',
      'A failure in the middle of the main action leaves no half-written rows (shown with psql)|||Một lỗi ở giữa thao tác chính không để lại dòng ghi dở (chứng minh bằng psql)',
      'The API contract (README table) is unchanged and still passes your curl checks|||Hợp đồng API (bảng README) không đổi và vẫn qua các lệnh curl kiểm tra',
    ],
    goiY: [
      'Turn on spring.jpa.show-sql (or the org.hibernate.SQL logger) and read every query Hibernate sends (lesson 6.1)|||Bật spring.jpa.show-sql (hoặc logger org.hibernate.SQL) và đọc mọi câu Hibernate gửi (bài 6.1)',
      'Dirty checking saves changes of a managed entity at commit — you do not need save() after changing fields (lesson 6.2)|||Dirty checking tự lưu thay đổi của entity được quản lý lúc commit — không cần save() sau khi đổi field (bài 6.2)',
      'Put @Transactional on the service, not on the controller or the repository (lesson 6.5)|||Đặt @Transactional ở service, không ở controller hay repository (bài 6.5)',
    ],
    nop: ['repo'],
    bangChung: [
      'Link to the commit|||Link commit',
      'psql output of your tables with a few rows, and the log of one transaction|||Output psql các bảng với vài dòng, và log của một giao dịch',
    ],
  },
  {
    so: 8, slug: 'sb-moc-8', chuong: 7, sauChuong: 'Chapter 7|||Chương 7',
    ten: 'Fast and correct under pressure: no N+1, no double booking|||Nhanh và đúng khi bị dồn: không N+1, không đặt trùng',
    lead: 'Count the SQL your list screen really sends, then make two users fight over the same thing and prove only one wins — with a 409, not a 500.|||Đếm số câu SQL màn danh sách thật sự gửi, rồi cho hai người tranh nhau cùng một thứ và chứng minh chỉ một người thắng — bằng 409, không phải 500.',
    yeuCau: [
      'Find one N+1 in your list endpoints, show the query count, fix it with JOIN FETCH, @EntityGraph or a projection|||Tìm một N+1 trong các endpoint danh sách, cho thấy số câu truy vấn, sửa bằng JOIN FETCH, @EntityGraph hoặc projection',
      'Protect the scarce resource of your topic (slot, copy, stock, seat) with @Version, a lock, or a database constraint|||Bảo vệ tài nguyên khan hiếm của đề tài (khung giờ, bản sách, tồn kho, ghế) bằng @Version, khoá, hoặc ràng buộc CSDL',
      'Fire two (or more) concurrent requests for it and show exactly one success|||Bắn hai (hoặc nhiều) request đồng thời vào nó và cho thấy đúng một lần thành công',
      'Every conflict ends as 409 ProblemDetail, never 500|||Mọi xung đột kết thúc bằng 409 ProblemDetail, không bao giờ 500',
    ],
    nangCao: [
      'Turn off open-in-view and fix the LazyInitializationException that appears|||Tắt open-in-view và sửa LazyInitializationException xuất hiện',
      'Write in README which isolation level you rely on and why|||Ghi trong README bạn dựa vào mức cô lập nào và vì sao',
    ],
    datKhi: [
      'The list endpoint sends a constant number of queries whatever the number of rows (shown in the log)|||Endpoint danh sách gửi số câu truy vấn cố định dù có bao nhiêu dòng (thấy trong log)',
      'Concurrent attempts: one 201/200, the others 409, and the database holds no duplicate|||Lượt thử đồng thời: một 201/200, các lượt khác 409, và CSDL không có bản trùng',
      'No 500 appears in the log during the race|||Không có lỗi 500 nào trong log trong lúc tranh chấp',
    ],
    goiY: [
      'Run the two curl commands with & and wait so they really overlap|||Chạy hai lệnh curl với & và wait để chúng thật sự chồng nhau',
      'A unique or partial unique index is the last net: even if the Java check races, the database refuses the second row — map DataIntegrityViolationException to 409 (lesson 7.5)|||Unique hoặc partial unique index là lưới cuối: dù kiểm tra ở Java bị chạy đua, CSDL vẫn từ chối dòng thứ hai — ánh xạ DataIntegrityViolationException sang 409 (bài 7.5)',
      'ObjectOptimisticLockingFailureException means someone else changed the row first — 409 with “reload and retry” (lesson 7.5)|||ObjectOptimisticLockingFailureException nghĩa là người khác đã sửa dòng trước — 409 kèm “tải lại và thử lại” (bài 7.5)',
    ],
    nop: ['repo', 'anh'],
    bangChung: [
      'Link to the commit|||Link commit',
      'SQL log before/after the N+1 fix and the output of the concurrent requests|||Log SQL trước/sau khi sửa N+1 và output của các request đồng thời',
    ],
  },
  {
    so: 9, slug: 'sb-moc-9', chuong: 8, sauChuong: 'Chapter 8|||Chương 8',
    ten: 'A schema with history: Flyway migrations|||Schema có lịch sử: migration với Flyway',
    lead: 'Stop letting Hibernate guess your schema. From now on every change is a numbered SQL file that your teammates, CI and production all apply in the same order.|||Thôi để Hibernate đoán schema. Từ giờ mọi thay đổi là một file SQL có số thứ tự mà đồng đội, CI và production đều chạy theo cùng một thứ tự.',
    yeuCau: [
      'V1__init.sql creates all tables with primary keys, foreign keys, NOT NULL and CHECK constraints of your rules|||V1__init.sql tạo mọi bảng với khoá chính, khoá ngoại, NOT NULL và các CHECK theo luật của bạn',
      'A migration that seeds reference data (categories, specialties, room types…)|||Một migration nạp dữ liệu tham chiếu (thể loại, chuyên khoa, loại phòng…)',
      'spring.jpa.hibernate.ddl-auto=validate|||spring.jpa.hibernate.ddl-auto=validate',
      'One later migration that adds a column the safe way (nullable first, “expand”)|||Một migration về sau thêm cột theo cách an toàn (cho phép NULL trước, “expand”)',
    ],
    nangCao: [
      'An index chosen from a real query of your app, with EXPLAIN before and after|||Một chỉ mục chọn từ truy vấn thật của app, có EXPLAIN trước và sau',
      'Run flyway validate in CI (milestone 18) so an edited migration breaks the build|||Chạy flyway validate trong CI (mốc 18) để migration bị sửa làm vỡ build',
    ],
    datKhi: [
      'An empty database reaches the current schema by starting the app once|||Một CSDL trống đạt schema hiện tại chỉ bằng một lần khởi động app',
      'flyway_schema_history lists every migration with success = true|||flyway_schema_history liệt kê mọi migration với success = true',
      'Editing an applied migration makes startup fail with “checksum mismatch” — you have seen it once|||Sửa một migration đã chạy làm khởi động hỏng với “checksum mismatch” — bạn đã tự thấy một lần',
    ],
    goiY: [
      'Never edit a migration that already ran anywhere — write a new one (lesson 8.2)|||Không bao giờ sửa migration đã chạy ở bất kỳ đâu — viết migration mới (bài 8.2)',
      'Constraints in the database protect you from every client, not only from your Java code|||Ràng buộc trong CSDL bảo vệ bạn khỏi mọi client, không chỉ khỏi mã Java của bạn',
      'Renaming a column: add new → copy → switch code → drop old in a later release (lesson 8.4)|||Đổi tên cột: thêm cột mới → chép dữ liệu → đổi mã → xoá cột cũ ở bản phát hành sau (bài 8.4)',
    ],
    nop: ['repo'],
    bangChung: [
      'Link to the db/migration folder at this commit|||Link thư mục db/migration ở commit này',
      'Output of select * from flyway_schema_history|||Output của select * from flyway_schema_history',
    ],
  },
  {
    so: 10, slug: 'sb-moc-10', chuong: 9, sauChuong: 'Chapter 9|||Chương 9',
    ten: 'Who are you, and may you do that? Spring Security + JWT|||Bạn là ai, và bạn có được làm thế không? Spring Security + JWT',
    lead: 'Register and log in with hashed passwords, carry identity in a signed JWT, and enforce the roles and ownership rules of your topic on the server.|||Đăng ký và đăng nhập với mật khẩu được băm, mang danh tính trong JWT có chữ ký, và thực thi luật vai trò và sở hữu của đề tài ở phía server.',
    yeuCau: [
      'Register and login endpoints; passwords hashed with a PasswordEncoder (BCrypt via the delegating encoder)|||Endpoint đăng ký và đăng nhập; mật khẩu băm bằng PasswordEncoder (BCrypt qua delegating encoder)',
      'Short-lived JWT access token; the signing secret comes from an environment variable and is at least 32 characters|||Access token JWT hạn ngắn; khoá ký lấy từ biến môi trường và dài ít nhất 32 ký tự',
      'At least two roles from your topic and @PreAuthorize on the actions that need them|||Ít nhất hai vai trò từ đề tài và @PreAuthorize trên các thao tác cần chúng',
      'One ownership rule checked in the service (only the owner may cancel/return/see…)|||Một luật sở hữu kiểm ở service (chỉ chủ mới được huỷ/trả/xem…)',
      'Correct codes: 401 without or with a broken token, 403 when the role or owner is wrong|||Mã đúng: 401 khi thiếu hoặc hỏng token, 403 khi sai vai trò hoặc không phải chủ',
    ],
    nangCao: [
      'Refresh tokens with rotation stored server-side; logout revokes them|||Refresh token có xoay vòng lưu ở server; đăng xuất thu hồi chúng',
      'Lock an account for 15 minutes after 5 wrong passwords|||Khoá tài khoản 15 phút sau 5 lần sai mật khẩu',
    ],
    datKhi: [
      'The users table contains no plain-text password|||Bảng người dùng không chứa mật khẩu dạng chữ thường',
      'Changing one character of a token gives 401|||Đổi một ký tự của token thì nhận 401',
      'A normal user calling a staff action gets 403; another user’s object gets 403 or 404|||Người dùng thường gọi thao tác của nhân viên nhận 403; đối tượng của người khác nhận 403 hoặc 404',
    ],
    goiY: [
      'Stateless API: disable sessions and CSRF for /api/** because no cookie authenticates it (lesson 9.1, 10.4)|||API stateless: tắt session và CSRF cho /api/** vì không có cookie nào dùng để xác thực (bài 9.1, 10.4)',
      'Put the role in a claim and map it to ROLE_X authorities in the JWT converter (lesson 9.4)|||Đặt vai trò vào một claim và ánh xạ thành quyền ROLE_X trong JWT converter (bài 9.4)',
      'Read the user id from the token (jwt.getSubject()), never from the request body|||Lấy id người dùng từ token (jwt.getSubject()), không bao giờ từ body request',
    ],
    nop: ['repo'],
    bangChung: [
      'Link to the commit|||Link commit',
      'curl output: login, a 401, a 403, and a successful call with the token|||Output curl: đăng nhập, một lỗi 401, một lỗi 403, và một lần gọi thành công với token',
    ],
  },
  {
    so: 11, slug: 'sb-moc-11', chuong: 10, sauChuong: 'Chapter 10|||Chương 10',
    ten: 'Attack your own API, then fix it|||Tấn công chính API của mình, rồi vá',
    lead: 'Play the hacker for an afternoon. Use the checklist of Chapter 10 against your own project, write down what worked, fix it, and prove the fix.|||Đóng vai hacker một buổi chiều. Dùng danh sách của Chương 10 tấn công chính dự án của bạn, ghi lại cái gì lọt, vá nó, và chứng minh đã vá.',
    yeuCau: [
      'Try mass assignment: send a field you must not control (role, price, status, ownerId)|||Thử mass assignment: gửi một trường bạn không được điều khiển (role, price, status, ownerId)',
      'Try IDOR: read and modify another user’s object by changing the id|||Thử IDOR: đọc và sửa đối tượng của người khác bằng cách đổi id',
      'Try injection in every search, sort and filter parameter|||Thử injection ở mọi tham số tìm kiếm, sắp xếp, lọc',
      'Check CORS (a foreign origin is refused), Actuator exposure and secrets in Git history|||Kiểm CORS (origin lạ bị từ chối), Actuator có lộ không, và bí mật trong lịch sử Git',
      'SECURITY.md: each attack, the result before, the fix, the result after|||SECURITY.md: từng đòn tấn công, kết quả trước, cách vá, kết quả sau',
    ],
    nangCao: [
      'Rate-limit login and the main write action|||Giới hạn tần suất đăng nhập và thao tác ghi chính',
      'Run a dependency scan and upgrade one vulnerable library|||Chạy quét thư viện phụ thuộc và nâng một thư viện có lỗ hổng',
    ],
    datKhi: [
      'Every attack in SECURITY.md is blocked now, shown with the same curl command|||Mọi đòn tấn công trong SECURITY.md giờ đã bị chặn, chứng minh bằng đúng lệnh curl đó',
      'GET /actuator/env (or heapdump) is not reachable without staff rights|||GET /actuator/env (hoặc heapdump) không với tới được nếu không có quyền nhân viên',
      'gitleaks (or git log -p | grep) finds no secret in the history|||gitleaks (hoặc git log -p | grep) không tìm thấy bí mật nào trong lịch sử',
    ],
    goiY: [
      'A DTO without the dangerous field is the strongest fix for mass assignment (lesson 10.1)|||DTO không có trường nguy hiểm là cách vá mạnh nhất cho mass assignment (bài 10.1)',
      'For IDOR, return 404 instead of 403 if you do not want to reveal that the object exists (lesson 10.2)|||Với IDOR, trả 404 thay vì 403 nếu không muốn lộ rằng đối tượng có tồn tại (bài 10.2)',
      'ORDER BY cannot be a bind parameter — use an allow-list of column names (lesson 10.3)|||ORDER BY không dùng được tham số bind — dùng danh sách cột cho phép (bài 10.3)',
    ],
    nop: ['repo'],
    bangChung: [
      'Link to SECURITY.md|||Link tới SECURITY.md',
      'Before/after curl output for at least three attacks|||Output curl trước/sau cho ít nhất ba đòn tấn công',
    ],
  },
  {
    so: 12, slug: 'sb-moc-12', chuong: 11, sauChuong: 'Chapter 11|||Chương 11',
    ten: 'A test suite you trust: unit, slice and real database|||Bộ test đáng tin: unit, lát cắt và CSDL thật',
    lead: 'Write the tests that would have caught the bugs of milestones 6–11. From now on a change that breaks a rule turns the build red before anyone sees it.|||Viết những test lẽ ra đã bắt được lỗi của mốc 6–11. Từ giờ một thay đổi phá luật sẽ làm build đỏ trước khi ai kịp thấy.',
    yeuCau: [
      'Unit tests for the business rules of your topic (limits, state changes, money) with JUnit 5 + AssertJ|||Unit test cho luật nghiệp vụ của đề tài (giới hạn, đổi trạng thái, tiền) bằng JUnit 5 + AssertJ',
      'Service tests with Mockito where a collaborator is slow or external|||Test service với Mockito khi một cộng tác viên chậm hoặc ở bên ngoài',
      'At least one @WebMvcTest checking status codes and the ProblemDetail body|||Ít nhất một @WebMvcTest kiểm mã trạng thái và body ProblemDetail',
      'At least one repository or integration test on real PostgreSQL with Testcontainers (Flyway runs in the test)|||Ít nhất một test repository hoặc tích hợp trên PostgreSQL thật bằng Testcontainers (Flyway chạy trong test)',
      'At least 15 tests in total; ./mvnw test is green|||Tổng cộng ít nhất 15 test; ./mvnw test xanh',
    ],
    nangCao: [
      'A test for a secured endpoint with a real JWT (401, 403, 200)|||Test endpoint có bảo mật với JWT thật (401, 403, 200)',
      'A fixed Clock bean so time-dependent rules are tested exactly|||Bean Clock cố định để luật phụ thuộc thời gian được test chính xác',
    ],
    datKhi: [
      'Breaking one rule on purpose turns at least one test red; restoring it turns it green|||Cố ý phá một luật thì ít nhất một test đỏ; sửa lại thì xanh',
      'The Testcontainers test starts its own PostgreSQL and passes on a machine without a local database|||Test Testcontainers tự khởi động PostgreSQL và qua được trên máy không cài CSDL',
      'Surefire reports the expected number of tests — none silently skipped|||Surefire báo đúng số test kỳ vọng — không test nào bị bỏ qua câm lặng',
    ],
    goiY: [
      'Surefire runs only classes named *Test by default; *IT needs the failsafe plugin — count the tests in the report (lesson 11.4)|||Surefire mặc định chỉ chạy lớp tên *Test; *IT cần plugin failsafe — đếm số test trong báo cáo (bài 11.4)',
      '@EnableCaching/@EnableScheduling on the main class leak into every slice test — put them on @Configuration classes|||@EnableCaching/@EnableScheduling đặt ở lớp main sẽ tràn vào mọi test lát cắt — đặt chúng ở lớp @Configuration',
      'Do not mock what you own and can run for real (the repository on Testcontainers is cheap) (lesson 11.2)|||Đừng mock thứ bạn sở hữu và chạy thật được (repository trên Testcontainers rẻ thôi) (bài 11.2)',
    ],
    nop: ['repo', 'anh'],
    bangChung: [
      'Link to the test folder at this commit|||Link thư mục test ở commit này',
      'The “Tests run: …, Failures: 0” summary|||Dòng tổng kết “Tests run: …, Failures: 0”',
    ],
  },
  {
    so: 13, slug: 'sb-moc-13', chuong: 12, sauChuong: 'Chapter 12|||Chương 12',
    ten: 'An API front-end developers enjoy: OpenAPI, CORS and a first page|||API mà frontend thích dùng: OpenAPI, CORS và trang đầu tiên',
    lead: 'Publish a contract your front end can read, allow exactly the origins that may call you, and build one small page that uses the API for real.|||Công bố một hợp đồng frontend đọc được, cho phép đúng những origin được gọi bạn, và dựng một trang nhỏ dùng API thật.',
    yeuCau: [
      'springdoc OpenAPI: every route documented, with the bearer security scheme and error responses|||springdoc OpenAPI: mọi tuyến có tài liệu, kèm bảo mật bearer và các phản hồi lỗi',
      'CORS for a specific list of origins from configuration — never * with credentials|||CORS cho danh sách origin cụ thể lấy từ cấu hình — không bao giờ * khi có credentials',
      'One front-end page (React, or plain HTML + fetch) that logs in and shows data from your API|||Một trang frontend (React, hoặc HTML + fetch thuần) đăng nhập và hiển thị dữ liệu từ API của bạn',
      'The page handles 401 (back to login) and shows ProblemDetail field errors next to inputs|||Trang xử lý 401 (về trang đăng nhập) và hiện lỗi từng trường của ProblemDetail cạnh ô nhập',
    ],
    nangCao: [
      'Generate a TypeScript client from the OpenAPI document|||Sinh client TypeScript từ tài liệu OpenAPI',
      'Consistent list responses: items + page info everywhere|||Phản hồi danh sách nhất quán: items + thông tin trang ở mọi nơi',
    ],
    datKhi: [
      '/v3/api-docs lists every route of your README table|||/v3/api-docs liệt kê mọi tuyến trong bảng README',
      'A preflight from your front-end origin gets Access-Control-Allow-Origin; a foreign origin gets 403|||Preflight từ origin của frontend nhận Access-Control-Allow-Origin; origin lạ nhận 403',
      'The page works end to end in a browser without CORS errors in the console|||Trang chạy trọn trong trình duyệt, không lỗi CORS trong console',
    ],
    goiY: [
      'cors(Customizer.withDefaults()) looks for a bean named corsConfigurationSource — name the bean method exactly that, then test with curl -X OPTIONS (lesson 12.3)|||cors(Customizer.withDefaults()) tìm bean tên corsConfigurationSource — đặt đúng tên hàm @Bean như vậy, rồi kiểm bằng curl -X OPTIONS (bài 12.3)',
      'CORS is a browser rule; curl and Postman ignore it — so test the preflight explicitly|||CORS là luật của trình duyệt; curl và Postman bỏ qua nó — nên phải tự kiểm preflight',
      'Keep the access token in memory in the page, not in localStorage, if you can|||Nếu được, giữ access token trong bộ nhớ của trang, không trong localStorage',
    ],
    nop: ['repo', 'demo', 'anh'],
    bangChung: [
      'Link to the commit and to the Swagger UI screenshot|||Link commit và ảnh Swagger UI',
      'Screenshot of the page with data, and the preflight output|||Ảnh trang có dữ liệu, và output preflight',
    ],
  },
  {
    so: 14, slug: 'sb-moc-14', chuong: 13, sauChuong: 'Chapter 13|||Chương 13',
    ten: 'Cache one hot read path with Redis — and keep it honest|||Cache một đường đọc nóng bằng Redis — và giữ cho nó trung thực',
    lead: 'Pick the endpoint your users hit most, cache it in Redis with a TTL, and then find the moment it lies — the update that does not evict.|||Chọn endpoint người dùng gọi nhiều nhất, cache nó trong Redis có TTL, rồi tìm ra lúc nó nói dối — lần cập nhật không xoá cache.',
    yeuCau: [
      'Spring Cache with Redis on one read path; values stored as JSON with a TTL|||Spring Cache với Redis cho một đường đọc; giá trị lưu dạng JSON có TTL',
      'Every write that changes that data evicts the right entries|||Mọi thao tác ghi làm đổi dữ liệu đó đều xoá đúng các mục cache',
      'A written decision: what you never cache in your topic (personal data, stock at checkout…)|||Một quyết định viết ra: thứ bạn không bao giờ cache trong đề tài (dữ liệu cá nhân, tồn kho lúc thanh toán…)',
      'Rate-limit one write action with Redis (fixed window or token bucket)|||Giới hạn tần suất một thao tác ghi bằng Redis (cửa sổ cố định hoặc token bucket)',
    ],
    nangCao: [
      'Measure the endpoint with and without cache under load (milestone 17 style)|||Đo endpoint có và không có cache dưới tải (kiểu mốc 17)',
      'Protect against a stampede when the key expires|||Chống bùng tải khi khoá hết hạn',
    ],
    datKhi: [
      'redis-cli shows your keys with a TTL that counts down|||redis-cli hiện các khoá của bạn với TTL đang đếm ngược',
      'After a write, the next read returns fresh data (you demonstrated the stale case first)|||Sau một lần ghi, lần đọc tiếp theo trả dữ liệu mới (bạn đã cho thấy trường hợp cũ trước)',
      'Exceeding the rate limit returns 429 with Retry-After|||Vượt giới hạn tần suất trả 429 kèm Retry-After',
    ],
    goiY: [
      '“Cannot serialize” means the default JDK serializer met a class that is not Serializable — use a JSON serializer for that cache (lesson 13.2)|||“Cannot serialize” nghĩa là bộ tuần tự JDK mặc định gặp lớp không Serializable — dùng bộ tuần tự JSON cho cache đó (bài 13.2)',
      '@Cacheable on a method called from the same class is skipped — the proxy is bypassed (lesson 3.5, 13.1)|||@Cacheable trên hàm gọi từ chính lớp đó bị bỏ qua — proxy bị đi vòng (bài 3.5, 13.1)',
      'List every write path that touches the cached data before you choose where to evict (lesson 13.3)|||Liệt kê mọi đường ghi chạm vào dữ liệu được cache trước khi chọn chỗ xoá (bài 13.3)',
    ],
    nop: ['repo'],
    bangChung: [
      'Link to the commit|||Link commit',
      'redis-cli output and the stale → fresh demonstration|||Output redis-cli và minh hoạ dữ liệu cũ → mới',
    ],
  },
  {
    so: 15, slug: 'sb-moc-15', chuong: 14, sauChuong: 'Chapter 14|||Chương 14',
    ten: 'Work that should not block the request: events, async and schedules|||Việc không nên chặn request: sự kiện, async và hẹn giờ',
    lead: 'Move the slow and the periodic work of your topic out of the request: notify after commit, run the nightly job, and never lose an event to a rollback.|||Đưa phần việc chậm và định kỳ của đề tài ra khỏi request: thông báo sau commit, chạy job ban đêm, và không bao giờ mất sự kiện vì rollback.',
    yeuCau: [
      'Publish a domain event from the main action; handle it with @TransactionalEventListener (after commit) + @Async|||Phát một sự kiện domain từ thao tác chính; xử lý bằng @TransactionalEventListener (sau commit) + @Async',
      'One @Scheduled job from your topic (expire, remind, bill, release) with the cron in configuration|||Một job @Scheduled từ đề tài (hết hạn, nhắc, lập hoá đơn, nhả chỗ) với cron lấy từ cấu hình',
      'The job is idempotent: running it twice does not double the effect|||Job idempotent: chạy hai lần không nhân đôi tác dụng',
      'Logs show the handler and the job running on their own threads|||Log cho thấy handler và job chạy trên luồng riêng',
    ],
    nangCao: [
      'A transactional outbox table instead of firing the event directly|||Bảng transactional outbox thay vì phát sự kiện trực tiếp',
      'ShedLock (or a DB lock) so the job runs once with two instances|||ShedLock (hoặc khoá CSDL) để job chỉ chạy một lần khi có hai instance',
    ],
    datKhi: [
      'A request that fails and rolls back produces no notification|||Request lỗi và rollback thì không sinh thông báo nào',
      'The response time of the main action does not include the slow work|||Thời gian phản hồi của thao tác chính không gồm phần việc chậm',
      'After the job runs, the database shows the expected state change; a second run changes nothing|||Sau khi job chạy, CSDL thể hiện đúng thay đổi trạng thái; lần chạy thứ hai không đổi gì',
    ],
    goiY: [
      'For a demo, override the cron to every 10 seconds from the command line instead of waiting for midnight|||Để demo, ghi đè cron thành mỗi 10 giây từ dòng lệnh thay vì chờ tới nửa đêm',
      'An exception inside @Async disappears unless you log it or set an AsyncUncaughtExceptionHandler (lesson 14.1)|||Exception trong @Async biến mất nếu bạn không log hoặc đặt AsyncUncaughtExceptionHandler (bài 14.1)',
      'Your database CHECK constraints still apply to the job — they may refuse a bad update, which is good|||Ràng buộc CHECK của CSDL vẫn áp lên job — nó có thể từ chối một lệnh sửa sai, và đó là điều tốt',
    ],
    nop: ['repo'],
    bangChung: [
      'Link to the commit|||Link commit',
      'Log lines of the async handler and two runs of the job|||Các dòng log của handler async và hai lượt chạy job',
    ],
  },
  {
    so: 16, slug: 'sb-moc-16', chuong: 15, sauChuong: 'Chapter 15|||Chương 15',
    ten: 'See it running: health, metrics and logs|||Nhìn thấy nó đang chạy: health, số đo và log',
    lead: 'Make your app answer three questions without SSH: is it alive and ready, how many of the important things happen per minute, and what happened in request X.|||Làm app trả lời được ba câu mà không cần SSH: còn sống và sẵn sàng không, việc quan trọng xảy ra bao nhiêu lần mỗi phút, và request X đã xảy ra chuyện gì.',
    yeuCau: [
      'Actuator health with liveness/readiness probes; only health and prometheus exposed publicly|||Actuator health có probe liveness/readiness; chỉ health và prometheus mở công khai',
      'One business metric with Micrometer (bookings created, loans overdue, tickets sold…)|||Một số đo nghiệp vụ bằng Micrometer (lượt đặt tạo ra, lượt mượn quá hạn, vé bán ra…)',
      'Logs with a request id (MDC) so one request can be followed through every line|||Log có mã request (MDC) để lần theo một request qua mọi dòng',
      'A short RUNBOOK.md: what to check first when users say “it is slow”|||Một RUNBOOK.md ngắn: kiểm tra gì đầu tiên khi người dùng kêu “chậm”',
    ],
    nangCao: [
      'Structured JSON logs (logging.structured.format.console)|||Log JSON có cấu trúc (logging.structured.format.console)',
      'A Grafana panel for p95 of your main endpoint|||Một panel Grafana cho p95 của endpoint chính',
    ],
    datKhi: [
      '/actuator/health returns UP; stopping the database makes readiness DOWN|||/actuator/health trả UP; tắt CSDL thì readiness thành DOWN',
      '/actuator/prometheus shows your business metric increasing after you use the feature|||/actuator/prometheus cho thấy số đo nghiệp vụ tăng sau khi bạn dùng tính năng',
      '/actuator/env and /actuator/heapdump are not public|||/actuator/env và /actuator/heapdump không công khai',
    ],
    goiY: [
      'Check the exported name with grep instead of guessing: a meter named x.created is published as x_total, because the _created suffix has its own meaning in the OpenMetrics format|||Kiểm tên đã xuất bằng grep thay vì đoán: meter tên x.created được xuất thành x_total, vì hậu tố _created có nghĩa riêng trong định dạng OpenMetrics',
      'Counters reset to 0 on restart — Prometheus rate() handles that; your eyes do not|||Bộ đếm về 0 khi khởi động lại — rate() của Prometheus xử lý được; mắt bạn thì không',
      'High-cardinality labels (user id, raw URL) explode memory — label by route template only (lesson 15.2)|||Nhãn có quá nhiều giá trị (id người dùng, URL thô) làm phình bộ nhớ — chỉ gắn nhãn theo mẫu tuyến (bài 15.2)',
    ],
    nop: ['repo', 'anh'],
    bangChung: [
      'Link to the commit and RUNBOOK.md|||Link commit và RUNBOOK.md',
      'Output of health and of your metric before/after using the feature|||Output health và số đo của bạn trước/sau khi dùng tính năng',
    ],
  },
  {
    so: 17, slug: 'sb-moc-17', chuong: 16, sauChuong: 'Chapter 16|||Chương 16',
    ten: 'Measure before you optimise: one load test, one improvement|||Đo trước khi tối ưu: một lần đo tải, một cải tiến',
    lead: 'Load-test the endpoint that matters most for your topic, find where the time goes, change one thing, and keep it only if the numbers say so.|||Đo tải endpoint quan trọng nhất của đề tài, tìm thời gian đi đâu, đổi một thứ, và chỉ giữ nếu con số nói vậy.',
    yeuCau: [
      'A repeatable load test (ab, k6 or wrk) with the exact command in README|||Một bài đo tải chạy lại được (ab, k6 hoặc wrk) có đúng lệnh trong README',
      'Report requests per second, p95 and p99, and errors|||Báo cáo số request mỗi giây, p95 và p99, và số lỗi',
      'One change aimed at the bottleneck (index, query, pool size, cache, virtual threads…) measured before and after|||Một thay đổi nhắm vào điểm nghẽn (chỉ mục, truy vấn, kích thước pool, cache, virtual thread…) đo trước và sau',
      'A PERFORMANCE.md table with both runs and your decision|||Bảng PERFORMANCE.md có cả hai lượt đo và quyết định của bạn',
    ],
    nangCao: [
      'A JFR recording and a flame graph of the slow path|||Một bản ghi JFR và flame graph của đường chậm',
      'The same endpoint in the Node.js course project, same machine, compared|||Cùng endpoint đó ở dự án khoá Node.js, cùng máy, so sánh',
    ],
    datKhi: [
      'Both runs use the same data, the same command and a warm-up|||Hai lượt đo dùng cùng dữ liệu, cùng lệnh và có làm nóng',
      'Your decision follows the numbers, even when the “optimisation” did not help|||Quyết định của bạn theo con số, kể cả khi “tối ưu” không giúp gì',
      'No failed requests in the final run|||Lượt đo cuối không có request lỗi',
    ],
    goiY: [
      'Always warm the JVM up first — the first seconds measure the JIT, not your code (lesson 16.3)|||Luôn làm nóng JVM trước — những giây đầu đo JIT chứ không đo mã của bạn (bài 16.3)',
      'Virtual threads help when threads wait for I/O and the pool is the limit; on a fast endpoint they may change nothing (lesson 16.2)|||Virtual thread giúp khi luồng chờ I/O và pool là giới hạn; ở endpoint nhanh có thể không đổi gì (bài 16.2)',
      'Watch hikaricp_connections_pending: if it grows, the pool — not the CPU — is your bottleneck (lesson 16.1)|||Theo dõi hikaricp_connections_pending: nếu nó tăng, pool — không phải CPU — là điểm nghẽn (bài 16.1)',
    ],
    nop: ['repo'],
    bangChung: [
      'Link to PERFORMANCE.md|||Link tới PERFORMANCE.md',
      'The raw output of both load-test runs|||Output thô của cả hai lượt đo tải',
    ],
  },
  {
    so: 18, slug: 'sb-moc-18', chuong: 17, sauChuong: 'Chapter 17|||Chương 17',
    ten: 'Ship it in a box: Docker image, compose and CI|||Đóng hộp để giao: image Docker, compose và CI',
    lead: 'Anyone — your teammate, your lecturer, a server — should be able to run the whole system with one command, and every push should be checked automatically.|||Bất kỳ ai — đồng đội, giảng viên, một máy chủ — cũng phải chạy được cả hệ thống bằng một lệnh, và mọi lần push đều được kiểm tự động.',
    yeuCau: [
      'Multi-stage Dockerfile: build with JDK, run on a JRE image as a non-root user, layered jar|||Dockerfile nhiều giai đoạn: build bằng JDK, chạy trên image JRE với user không phải root, jar phân tầng',
      'docker compose up starts your app + PostgreSQL (+ Redis/Mongo if you use them) with healthchecks|||docker compose up khởi động app + PostgreSQL (+ Redis/Mongo nếu dùng) có healthcheck',
      'All settings and secrets through environment variables; .env.example committed, .env ignored|||Mọi cấu hình và bí mật qua biến môi trường; commit .env.example, bỏ qua .env',
      'GitHub Actions: build + tests (with Testcontainers) on every push and pull request|||GitHub Actions: build + test (có Testcontainers) cho mọi push và pull request',
    ],
    nangCao: [
      'Push the image to GHCR with the commit SHA as the tag|||Đẩy image lên GHCR với tag là SHA của commit',
      'Dependabot for Maven and GitHub Actions|||Dependabot cho Maven và GitHub Actions',
    ],
    datKhi: [
      'On a fresh machine: git clone + cp .env.example .env + docker compose up gives a healthy app|||Trên máy mới: git clone + cp .env.example .env + docker compose up cho ra app khoẻ',
      'docker images shows a runtime image without the JDK and without the source code|||docker images cho thấy image chạy không có JDK và không có mã nguồn',
      'The latest commit has a green CI check|||Commit mới nhất có dấu CI xanh',
    ],
    goiY: [
      'Copy pom.xml and resolve dependencies BEFORE copying src — then a code change does not re-download the internet (lesson 17.1)|||Chép pom.xml và tải phụ thuộc TRƯỚC khi chép src — để đổi mã không phải tải lại cả thế giới (bài 17.1)',
      'Inside a container, localhost is the container itself — use the compose service name for the database (lesson 17.2)|||Trong container, localhost là chính container — dùng tên service của compose cho CSDL (bài 17.2)',
      'Limit the heap with -XX:MaxRAMPercentage so the JVM respects the container memory limit (lesson 17.2)|||Giới hạn heap bằng -XX:MaxRAMPercentage để JVM tôn trọng giới hạn bộ nhớ của container (bài 17.2)',
    ],
    nop: ['repo', 'anh'],
    bangChung: [
      'Link to the Dockerfile, compose file and the green CI run|||Link Dockerfile, file compose và lượt CI xanh',
      'Output of docker compose ps showing healthy services|||Output docker compose ps cho thấy các service khoẻ',
    ],
  },
  {
    so: 19, slug: 'sb-moc-19', chuong: 18, sauChuong: 'Chapter 18|||Chương 18',
    ten: 'Release 1.0: the product a stranger can run and judge|||Phát hành 1.0: sản phẩm người lạ chạy và đánh giá được',
    lead: 'Use the capstone chapter as your checklist: close the gaps, write the documents a reviewer reads, tag v1.0.0, and prove it works with a smoke test.|||Dùng chương dự án cuối khoá làm danh sách kiểm: lấp chỗ hổng, viết tài liệu người chấm sẽ đọc, gắn tag v1.0.0, và chứng minh nó chạy bằng smoke test.',
    yeuCau: [
      'Every feature in your README list is either done and ticked, or moved to “future work” with a reason|||Mọi tính năng trong README hoặc đã xong và đánh dấu, hoặc chuyển sang “hướng phát triển” kèm lý do',
      'README: pitch, screenshots, how to run, environment variables, route table, schema diagram, demo accounts|||README: câu giới thiệu, ảnh chụp, cách chạy, biến môi trường, bảng tuyến, sơ đồ schema, tài khoản demo',
      'A smoke-test script that checks health, one public route, one protected route (401), and login|||Một script smoke test kiểm health, một tuyến công khai, một tuyến bảo vệ (401) và đăng nhập',
      'Tag v1.0.0 with release notes|||Gắn tag v1.0.0 kèm ghi chú phát hành',
    ],
    nangCao: [
      'Deploy to a VPS or a cloud free tier with HTTPS|||Deploy lên VPS hoặc gói miễn phí của cloud có HTTPS',
      'Do the timed practical exam of lesson 18.5 on your own topic|||Làm bài thi thực hành tính giờ của bài 18.5 trên chính đề tài của bạn',
    ],
    datKhi: [
      'The smoke test prints all PASS against the compose stack|||Smoke test in toàn PASS với cụm compose',
      'Someone else ran your project from the README alone and wrote down nothing missing|||Một người khác chạy được dự án chỉ nhờ README và không ghi nhận thiếu gì',
      'v1.0.0 appears on the Releases page|||v1.0.0 có trên trang Releases',
    ],
    goiY: [
      'A smoke test checks that the right things are mounted and reachable, not every rule — keep it under 30 seconds|||Smoke test kiểm đúng các thứ đã gắn và với tới được, không phải mọi luật — giữ dưới 30 giây',
      'Write “known limitations” honestly; reviewers trust a project more when it states its edges|||Viết “giới hạn đã biết” thật thà; người chấm tin dự án hơn khi nó nói rõ ranh giới của mình',
      'Compare your design with the Node.js LabFlow of the Node.js course if you took it — that paragraph is great in an interview|||So thiết kế của bạn với LabFlow ở khoá Node.js nếu đã học — đoạn đó rất đắt giá khi phỏng vấn',
    ],
    nop: ['repo', 'demo', 'anh'],
    bangChung: [
      'Link to the v1.0.0 release|||Link tới bản phát hành v1.0.0',
      'Output of the smoke test|||Output của smoke test',
    ],
  },
  {
    so: 20, slug: 'sb-moc-20', chuong: 19, sauChuong: 'Chapter 19|||Chương 19',
    ten: 'A back office in Thymeleaf: server-rendered pages for staff|||Trang quản trị bằng Thymeleaf: trang dựng ở server cho nhân viên',
    lead: 'Not every screen needs a SPA. Give the staff of your topic a few server-rendered pages — the HSF302 way — protected by form login and CSRF, sharing the same services as your API.|||Không phải màn hình nào cũng cần SPA. Cho nhân viên của đề tài vài trang dựng ở server — theo cách HSF302 — bảo vệ bằng form đăng nhập và CSRF, dùng chung service với API.',
    yeuCau: [
      'A second SecurityFilterChain for /admin/**: session, form login page, CSRF on; the /api/** chain stays stateless JWT|||SecurityFilterChain thứ hai cho /admin/**: session, trang form đăng nhập, bật CSRF; chuỗi /api/** vẫn là JWT stateless',
      'A list page and a create/edit form for your main resource with th:each, th:object and th:field|||Trang danh sách và form tạo/sửa cho tài nguyên chính với th:each, th:object và th:field',
      'Validation errors shown next to each input with th:errors; the form keeps what the user typed|||Lỗi validation hiện cạnh từng ô bằng th:errors; form giữ lại những gì người dùng đã gõ',
      'Post/Redirect/Get with a flash message after a successful save|||Post/Redirect/Get kèm flash message sau khi lưu thành công',
      'The controllers call the SAME service as the REST API — no copied business rules|||Controller gọi CÙNG service với REST API — không chép lại luật nghiệp vụ',
    ],
    nangCao: [
      'A shared layout (header, menu) with th:replace fragments|||Layout dùng chung (header, menu) bằng fragment th:replace',
      'Show or hide buttons by role with sec:authorize|||Hiện hoặc ẩn nút theo vai trò bằng sec:authorize',
    ],
    datKhi: [
      'Opening /admin without logging in redirects to /login|||Mở /admin khi chưa đăng nhập thì chuyển về /login',
      'Submitting an invalid form shows the error beside the field and keeps the other values|||Gửi form sai thì lỗi hiện cạnh ô nhập và giữ các giá trị khác',
      'The same POST without the _csrf field is refused with 403|||Cùng lệnh POST đó nhưng thiếu trường _csrf bị từ chối 403',
      'Refreshing the page after saving does not create a duplicate|||Tải lại trang sau khi lưu không tạo bản trùng',
    ],
    goiY: [
      'Two filter chains need @Order and securityMatcher, or the first one swallows every request (lesson 19.3)|||Hai chuỗi filter cần @Order và securityMatcher, nếu không chuỗi đầu nuốt mọi request (bài 19.3)',
      'BindingResult must come right after the @ModelAttribute parameter, or Spring throws instead of letting you show the errors (lesson 19.2)|||BindingResult phải đứng ngay sau tham số @ModelAttribute, nếu không Spring ném lỗi thay vì để bạn hiện lỗi (bài 19.2)',
      'th:action adds the hidden _csrf input for you; a hand-written action does not|||th:action tự thêm ô ẩn _csrf; action viết tay thì không',
    ],
    nop: ['repo', 'anh'],
    bangChung: [
      'Link to the commit with templates/ and the admin controllers|||Link commit có templates/ và controller quản trị',
      'Screenshots: login, list, a form with errors|||Ảnh: đăng nhập, danh sách, form có lỗi',
    ],
  },
  {
    so: 21, slug: 'sb-moc-21', chuong: 20, sauChuong: 'Chapter 20|||Chương 20',
    ten: 'One document-shaped feature in MongoDB|||Một tính năng dạng document bằng MongoDB',
    lead: 'Keep PostgreSQL for the data that needs constraints and transactions. Put ONE feature whose shape varies — an audit log, reviews, notes, feedback forms — into MongoDB with Spring Data MongoDB, and explain the choice.|||Giữ PostgreSQL cho dữ liệu cần ràng buộc và giao dịch. Đưa MỘT tính năng có hình dạng thay đổi — nhật ký, đánh giá, ghi chú, phiếu góp ý — vào MongoDB bằng Spring Data MongoDB, và giải thích lựa chọn.',
    yeuCau: [
      'A @Document record and a MongoRepository with one derived query|||Một record @Document và một MongoRepository có một derived query',
      'Documents written from an event of your main action (after commit), not inside the SQL transaction|||Document được ghi từ sự kiện của thao tác chính (sau commit), không nằm trong giao dịch SQL',
      'An index for the query you actually run (created in code or a script)|||Một chỉ mục cho truy vấn bạn thật sự chạy (tạo bằng mã hoặc script)',
      'A paragraph in README: why this feature is in MongoDB and what you would lose if the main data were there|||Một đoạn trong README: vì sao tính năng này nằm ở MongoDB và sẽ mất gì nếu dữ liệu chính nằm ở đó',
    ],
    nangCao: [
      'An aggregation pipeline for a small report (count per type per day)|||Một aggregation pipeline cho báo cáo nhỏ (đếm theo loại theo ngày)',
      'A Testcontainers test with a real MongoDB|||Một test Testcontainers với MongoDB thật',
    ],
    datKhi: [
      'mongosh shows your documents with the fields you expect|||mongosh hiện document của bạn với đúng các trường kỳ vọng',
      'A rolled-back action writes no document|||Một thao tác bị rollback không ghi document nào',
      'Stopping MongoDB does not break the main action of your API|||Tắt MongoDB không làm hỏng thao tác chính của API',
    ],
    goiY: [
      'Spring Boot 4 reads the connection string from spring.mongodb.uri (no longer spring.data.mongodb.uri) — if the log says localhost:27017, your setting was ignored (lesson 20.2)|||Spring Boot 4 đọc chuỗi kết nối từ spring.mongodb.uri (không còn spring.data.mongodb.uri) — log mà ghi localhost:27017 tức cấu hình của bạn bị bỏ qua (bài 20.2)',
      'Use Long ids from PostgreSQL inside documents as plain references — there are no foreign keys here|||Dùng id Long từ PostgreSQL trong document như tham chiếu thường — ở đây không có khoá ngoại',
      'If the MongoDB 8 image refuses to start on your Docker host, read the first fatal log line — it names the reason; mongo:7 is a fine fallback for learning|||Nếu image MongoDB 8 không khởi động trên máy Docker của bạn, đọc dòng log fatal đầu tiên — nó nêu lý do; mongo:7 là phương án dự phòng ổn khi học',
    ],
    nop: ['repo'],
    bangChung: [
      'Link to the commit|||Link commit',
      'mongosh output of a few documents and the README paragraph|||Output mongosh vài document và đoạn README',
    ],
  },
  {
    so: 22, slug: 'sb-moc-22', chuong: 21, sauChuong: 'Chapter 21|||Chương 21',
    ten: 'React ↔ Spring, end to end: login, refresh, errors and deployment|||React ↔ Spring trọn vẹn: đăng nhập, làm mới, lỗi và triển khai',
    lead: 'Finish the SBA301 picture: a React front end that logs in, keeps the session alive with a refresh token, shows server errors in the right place, and is deployed together with your API.|||Hoàn thiện bức tranh SBA301: frontend React đăng nhập, giữ phiên bằng refresh token, hiện lỗi server đúng chỗ, và được deploy cùng API.',
    yeuCau: [
      'One API client module in React: base URL from env, Authorization header, 401 handling in one place|||Một module API client trong React: base URL từ env, header Authorization, xử lý 401 ở một chỗ',
      'Access token in memory; refresh token in an HttpOnly, Secure, SameSite cookie with rotation on the server|||Access token trong bộ nhớ; refresh token trong cookie HttpOnly, Secure, SameSite và xoay vòng ở server',
      'At least 3 screens of your topic using the API (list, detail, form) with loading and error states|||Ít nhất 3 màn hình của đề tài dùng API (danh sách, chi tiết, form) có trạng thái đang tải và lỗi',
      'Deployed: either same origin behind a reverse proxy, or two origins with exact CORS — written in README|||Đã deploy: cùng origin sau reverse proxy, hoặc hai origin với CORS chính xác — ghi trong README',
    ],
    nangCao: [
      'Types generated from your OpenAPI document|||Kiểu sinh từ tài liệu OpenAPI',
      'A Playwright test for the login → main action flow|||Một test Playwright cho luồng đăng nhập → thao tác chính',
    ],
    datKhi: [
      'Reloading the page keeps you logged in (refresh works); logout really ends the session|||Tải lại trang vẫn còn đăng nhập (refresh chạy); đăng xuất thật sự kết thúc phiên',
      'A ProblemDetail field error appears next to the right input|||Lỗi trường của ProblemDetail hiện cạnh đúng ô nhập',
      'The browser console shows no CORS or mixed-content error on the deployed site|||Console trình duyệt không có lỗi CORS hay mixed-content trên trang đã deploy',
    ],
    goiY: [
      'A cookie-based refresh endpoint needs CSRF protection (SameSite + a custom header check) — the bearer API does not (lesson 21.2)|||Endpoint refresh dùng cookie cần chống CSRF (SameSite + kiểm header tuỳ biến) — API bearer thì không (bài 21.2)',
      'With credentials, Access-Control-Allow-Origin must be the exact origin, never * (lesson 21.3)|||Có credentials thì Access-Control-Allow-Origin phải là origin chính xác, không bao giờ * (bài 21.3)',
      'Same origin through nginx removes CORS entirely — often the simplest production setup (lesson 21.4)|||Cùng origin qua nginx là bỏ hẳn CORS — thường là cách triển khai production đơn giản nhất (bài 21.4)',
    ],
    nop: ['repo', 'demo', 'anh'],
    bangChung: [
      'Link to the front-end repository (or folder) and the deployed URL|||Link repo (hoặc thư mục) frontend và URL đã deploy',
      'Screenshots of the three screens and of the Network tab during a refresh|||Ảnh ba màn hình và tab Network lúc làm mới token',
    ],
  },
];

/* ─────────────────────────────── Giới thiệu + bảo vệ ─────────────────────────────── */
const GIOI_THIEU = [
  '<p><strong>After this course you will have built one production-style Spring Boot application of your own</strong> — a REST API on Java 21 with validation and standard errors, PostgreSQL through JPA without N+1, a Flyway schema history, JWT security with roles and ownership rules, tests on a real database, a Redis cache, background jobs, metrics, a Docker image with CI, a Thymeleaf back office, one MongoDB feature and a React front end. Not a copy of the lessons: a product on a topic you chose and can defend.</p>',
  '<p><strong>Why one project through the whole course?</strong> Each chapter teaches one layer; a project forces the layers to work together — the validation of Chapter 5 protects the entities of Chapter 6, which are guarded by the security of Chapter 9 and tested in Chapter 11. That is where real understanding and real bugs come from. After Section 0 and after every chapter there is a milestone that applies exactly that chapter to your topic, so the project grows every week instead of being a panic at the end.</p>',
  '<p><strong>How it is graded.</strong> 22 milestones, each with “Done when” criteria you check yourself and evidence to submit (commit links, curl output, screenshots). At the end you finish the project and defend it in front of an AI committee that asks questions like a real panel — why this transaction boundary, what happens when two users click at once, where the role is checked — scored on a 10-point rubric.</p>',
  '|||',
  '<p><strong>Học xong khoá này bạn sẽ tự dựng được một ứng dụng Spring Boot kiểu production của riêng mình</strong> — REST API trên Java 21 có validation và lỗi chuẩn, PostgreSQL qua JPA không N+1, lịch sử schema bằng Flyway, bảo mật JWT với vai trò và luật sở hữu, test trên CSDL thật, cache Redis, việc chạy nền, số đo, image Docker kèm CI, trang quản trị Thymeleaf, một tính năng MongoDB và giao diện React. Không phải bản chép bài học: một sản phẩm theo đề tài bạn tự chọn và bảo vệ được.</p>',
  '<p><strong>Vì sao làm một dự án xuyên suốt khoá?</strong> Mỗi chương dạy một tầng; dự án buộc các tầng chạy cùng nhau — validation của Chương 5 bảo vệ entity của Chương 6, entity được bảo mật của Chương 9 canh giữ và được Chương 11 kiểm thử. Hiểu thật và lỗi thật đến từ đó. Sau Mục 0 và sau mỗi chương có một mốc áp đúng kiến thức chương ấy vào đề tài của bạn, nên dự án lớn dần mỗi tuần thay vì dồn hết vào cuối khoá.</p>',
  '<p><strong>Cách chấm.</strong> 22 mốc, mỗi mốc có tiêu chí “Đạt khi” tự kiểm được và bằng chứng cần nộp (link commit, output curl, ảnh chụp). Cuối khoá bạn hoàn thiện dự án và bảo vệ trước hội đồng AI hỏi như hội đồng thật — vì sao đặt ranh giới giao dịch ở đây, hai người bấm cùng lúc thì sao, vai trò được kiểm ở đâu — chấm theo rubric 10 điểm.</p>',
].join('');

const BAO_VE = {
  rubric: [
    { tieuChi: 'Working features and business rules|||Tính năng chạy đúng và luật nghiệp vụ', diem: 2, moTa: 'The core features of your topic work end to end, including empty, error, limit and permission cases; rules live in services, not in controllers.|||Tính năng lõi của đề tài chạy trọn, kể cả ca rỗng, lỗi, chạm giới hạn và phân quyền; luật nằm ở service, không ở controller.' },
    { tieuChi: 'API design and error handling|||Thiết kế API và xử lý lỗi', diem: 1.5, moTa: 'Resources and methods that make sense, correct status codes, DTOs at the boundary, validation, one ProblemDetail error format, OpenAPI that matches reality.|||Tài nguyên và method hợp lý, mã trạng thái đúng, DTO ở ranh giới, validation, một định dạng lỗi ProblemDetail, OpenAPI khớp thực tế.' },
    { tieuChi: 'Data layer: JPA, transactions, Flyway|||Tầng dữ liệu: JPA, giao dịch, Flyway', diem: 2, moTa: 'Relations and fetching chosen on purpose, no N+1 on list screens, transaction boundaries in services, concurrency protected (409 not 500), constraints in Flyway migrations.|||Quan hệ và cách fetch chọn có chủ đích, không N+1 ở màn danh sách, ranh giới giao dịch ở service, đồng thời được bảo vệ (409 chứ không 500), ràng buộc nằm trong migration Flyway.' },
    { tieuChi: 'Security|||Bảo mật', diem: 1.5, moTa: 'Hashed passwords, signed short-lived tokens, roles and ownership enforced on the server, the Chapter 10 attacks blocked, exact CORS, no secrets in Git, Actuator not exposed.|||Mật khẩu được băm, token có chữ ký hạn ngắn, vai trò và sở hữu thực thi ở server, các đòn của Chương 10 bị chặn, CORS chính xác, không bí mật trong Git, Actuator không lộ.' },
    { tieuChi: 'Tests|||Kiểm thử', diem: 1, moTa: 'Meaningful unit tests for the rules, at least one web slice test, at least one Testcontainers test on real PostgreSQL, a green run you can show.|||Unit test có ý nghĩa cho các luật, ít nhất một test lát cắt web, ít nhất một test Testcontainers trên PostgreSQL thật, một lượt chạy xanh cho xem được.' },
    { tieuChi: 'Operations: Docker, CI, observability|||Vận hành: Docker, CI, quan sát', diem: 1, moTa: 'One-command start with compose, green CI, health and one business metric, logs you can follow, a measured performance decision.|||Khởi động một lệnh bằng compose, CI xanh, health và một số đo nghiệp vụ, log lần theo được, một quyết định hiệu năng có số đo.' },
    { tieuChi: 'Presentation and answers|||Trình bày và trả lời', diem: 1, moTa: 'A 5-minute demo that follows one user story; answers that explain why, open the right file, and admit trade-offs honestly.|||Demo 5 phút đi theo một câu chuyện người dùng; câu trả lời giải thích được vì sao, mở đúng tệp, và thật thà về đánh đổi.' },
  ],
  cauHoiMau: [
    'Walk us through one request of your main action: which filter, controller, service, repository and SQL does it pass?|||Dẫn chúng tôi qua một request của thao tác chính: nó đi qua filter, controller, service, repository và câu SQL nào?',
    'Why is @Transactional on this method and not on the controller? What happens if an exception is thrown halfway?|||Vì sao @Transactional đặt ở hàm này mà không ở controller? Nếu exception ném ra giữa chừng thì sao?',
    'Two users click “book/borrow/buy” on the last item at the same moment. Show what stops the second one, and what status code they get.|||Hai người cùng bấm “đặt/mượn/mua” món cuối cùng một lúc. Chỉ ra cái gì chặn người thứ hai, và họ nhận mã trạng thái gì.',
    'Open your list endpoint with SQL logging on. How many queries does it send for 50 rows? Why that number?|||Mở endpoint danh sách với log SQL bật. Với 50 dòng nó gửi bao nhiêu câu truy vấn? Vì sao là con số đó?',
    'Why did you choose LAZY here? Where did you meet LazyInitializationException and how did you fix it?|||Vì sao chọn LAZY ở đây? Bạn gặp LazyInitializationException ở đâu và sửa thế nào?',
    'Why do you return DTOs instead of entities? Show one field that would leak if you returned the entity.|||Vì sao trả DTO thay cho entity? Chỉ ra một trường sẽ bị lộ nếu trả entity.',
    'What is the difference between 400, 409 and 422 in your API? Give one real example of each.|||Trong API của bạn 400, 409 và 422 khác nhau thế nào? Cho một ví dụ thật của từng mã.',
    'I send "role":"ADMIN" (or a price of 0) in the body. What happens and which line makes it safe?|||Tôi gửi "role":"ADMIN" (hoặc giá 0) trong body. Chuyện gì xảy ra và dòng mã nào làm nó an toàn?',
    'I change the id in the URL to someone else’s. What do I get, and where is that checked?|||Tôi đổi id trên URL thành của người khác. Tôi nhận được gì, và chỗ nào kiểm việc đó?',
    'How is the password stored? What would an attacker get if the database leaked tomorrow?|||Mật khẩu được lưu thế nào? Nếu mai CSDL bị lộ thì kẻ tấn công lấy được gì?',
    'What is inside your JWT? Why can a user not just edit the role claim? What happens when the token expires?|||Trong JWT của bạn có gì? Vì sao người dùng không tự sửa được claim vai trò? Token hết hạn thì sao?',
    'Why is CSRF disabled for /api/** but enabled for your Thymeleaf pages?|||Vì sao CSRF tắt cho /api/** nhưng bật cho các trang Thymeleaf?',
    'Show your Flyway history. What would happen if you edited V1 now? How would you rename a column without downtime?|||Cho xem lịch sử Flyway. Nếu bây giờ sửa V1 thì sao? Bạn đổi tên một cột mà không downtime thế nào?',
    'Which constraint in your schema prevents a bug that your Java code alone could not prevent?|||Ràng buộc nào trong schema chặn được một lỗi mà riêng mã Java không chặn nổi?',
    'Pick one test. What bug does it catch? Break the code on purpose and show it failing.|||Chọn một test. Nó bắt lỗi gì? Cố ý làm hỏng mã và cho thấy nó đỏ.',
    'Why does your integration test use Testcontainers instead of H2?|||Vì sao test tích hợp dùng Testcontainers thay vì H2?',
    'What do you cache, for how long, and when is the cache wrong? Show the eviction.|||Bạn cache cái gì, trong bao lâu, và lúc nào cache sai? Cho xem chỗ xoá cache.',
    'Your event handler sends a notification. What happens to it if the transaction rolls back?|||Handler sự kiện của bạn gửi thông báo. Nếu giao dịch rollback thì thông báo đó ra sao?',
    'Your scheduled job runs on two instances. What goes wrong, and how do you stop it?|||Job hẹn giờ chạy trên hai instance. Cái gì hỏng, và bạn chặn thế nào?',
    'Users say the app is slow. What do you open first, and which metric tells you whether it is the database pool?|||Người dùng kêu app chậm. Bạn mở gì đầu tiên, và số đo nào cho biết có phải do pool CSDL?',
    'Show your load-test numbers. What did you change, and did it really help?|||Cho xem số đo tải. Bạn đã đổi gì, và nó có thật sự giúp không?',
    'Explain your Dockerfile stage by stage. Why does the runtime image have no JDK? Which user runs the app?|||Giải thích Dockerfile từng giai đoạn. Vì sao image chạy không có JDK? User nào chạy app?',
    'Why is this feature in MongoDB and the rest in PostgreSQL? What would you lose if you moved the main data to MongoDB?|||Vì sao tính năng này ở MongoDB còn phần còn lại ở PostgreSQL? Nếu chuyển dữ liệu chính sang MongoDB thì bạn mất gì?',
    'How does your React app stay logged in after a page reload? Where is each token stored, and why?|||App React của bạn giữ đăng nhập sau khi tải lại trang thế nào? Mỗi token nằm ở đâu, vì sao?',
    'Spring Boot or Node.js for this project — and why? Answer with something you measured or built, not a slogan.|||Spring Boot hay Node.js cho dự án này — vì sao? Trả lời bằng thứ bạn đã đo hoặc đã dựng, không phải khẩu hiệu.',
    'The requirement changes: each item now needs an approval step by a second role. Which classes, tables and tests change?|||Yêu cầu đổi: mỗi mục giờ cần thêm bước duyệt của vai trò thứ hai. Những lớp, bảng và test nào phải đổi?',
  ],
  chuanBi: [
    'All 22 milestones submitted, or a note explaining the missing ones|||Đã nộp đủ 22 mốc, hoặc có ghi chú giải thích mốc còn thiếu',
    'A fresh clone runs with cp .env.example .env and docker compose up; the smoke test prints all PASS|||Một bản clone mới chạy được với cp .env.example .env và docker compose up; smoke test in toàn PASS',
    'README complete: pitch, features ticked, screenshots, how to run, environment variables, route table, schema diagram, demo accounts, known limitations|||README đầy đủ: câu giới thiệu, tính năng đã đánh dấu, ảnh, cách chạy, biến môi trường, bảng tuyến, sơ đồ schema, tài khoản demo, giới hạn đã biết',
    'SECURITY.md, PERFORMANCE.md and RUNBOOK.md present and up to date|||Có SECURITY.md, PERFORMANCE.md và RUNBOOK.md, cập nhật mới nhất',
    'CI green on the final commit; tag v1.0.0 (or later) with release notes|||CI xanh ở commit cuối; tag v1.0.0 (hoặc mới hơn) kèm ghi chú phát hành',
    'Demo accounts for every role with sample data — never your real password|||Tài khoản demo cho mọi vai trò có dữ liệu mẫu — không bao giờ là mật khẩu thật của bạn',
    'You can open without searching: the main service, the security config, the error handler, V1 migration, one test|||Bạn mở được ngay không cần tìm: service chính, cấu hình bảo mật, bộ xử lý lỗi, migration V1, một test',
    'Two terminals ready: one with SQL logging on, one with curl commands for the concurrency demo|||Sẵn hai terminal: một có log SQL bật, một có các lệnh curl để demo đồng thời',
    'gitleaks (or git log -p | grep) run one last time over the history|||Chạy gitleaks (hoặc git log -p | grep) lần cuối trên toàn lịch sử',
  ],
};

export const DU_AN = {
  version: 1,
  gioiThieu: GIOI_THIEU,
  deTai: DE_TAI,
  tuChon: {
    yeuCauToiThieu: [
      'A REST API with at least one main resource with full CRUD and one action beyond CRUD (approve, return, pay, check in…)|||REST API có ít nhất một tài nguyên chính đủ CRUD và một hành động ngoài CRUD (duyệt, trả, thanh toán, check-in…)',
      'At least 3 related tables in PostgreSQL managed by Flyway|||Ít nhất 3 bảng có quan hệ trong PostgreSQL do Flyway quản lý',
      'At least two roles and one ownership rule (only the owner may …)|||Ít nhất hai vai trò và một luật sở hữu (chỉ chủ mới được …)',
      'A scarce resource that two users can fight over (slot, copy, stock, seat, room) — needed for the concurrency milestone|||Một tài nguyên khan hiếm mà hai người có thể tranh nhau (khung giờ, bản sách, tồn kho, ghế, phòng) — cần cho mốc đồng thời',
      'At least one rule that depends on time or money (due dates, fees, expiry, totals)|||Ít nhất một luật phụ thuộc thời gian hoặc tiền (hạn trả, phí, hết hạn, tổng tiền)',
      'Some periodic work (expire, remind, bill) and one feature whose data shape varies (log, reviews, notes) for MongoDB|||Có việc định kỳ (hết hạn, nhắc, lập hoá đơn) và một tính năng có hình dạng dữ liệu thay đổi (nhật ký, đánh giá, ghi chú) cho MongoDB',
      'No real personal, medical or payment data; payments are simulated|||Không dùng dữ liệu cá nhân, y tế hay thanh toán thật; thanh toán là giả lập',
    ],
    goiYQuyMo: 'Aim for a one-sentence pitch, 6–12 features, 2–4 roles and 5–10 tables, roughly 70–120 hours over the course. Too small: a single CRUD table with no rules and no roles. Too big: real payment gateways, microservices, real-time chat, video, AI features, or more than three kinds of users — cut it to a core you can finish and defend, and keep the rest as “future work” in the README.|||Nhắm tới một câu giới thiệu, 6–12 tính năng, 2–4 vai trò và 5–10 bảng, khoảng 70–120 giờ làm rải theo khoá. Quá nhỏ: một bảng CRUD duy nhất, không luật, không vai trò. Quá to: cổng thanh toán thật, microservice, chat thời gian thực, video, tính năng AI, hoặc nhiều hơn ba kiểu người dùng — hãy cắt về phần lõi bạn làm xong và bảo vệ được, phần còn lại ghi “hướng phát triển” trong README.',
  },
  moc: MOC.map(({ so, slug, ten, sauChuong, yeuCau, nangCao, datKhi, goiY, nop }) => ({ so, slug, ten, sauChuong, yeuCau, nangCao, datKhi, goiY, nop })),
  baoVe: BAO_VE,
};

export default DU_AN;

/** Số chương (0 = Mục 0) ⇒ số mốc, để spring-boot.mjs chèn đúng bài. */
export const MOC_THEO_CHUONG = Object.fromEntries(MOC.map((m) => [m.chuong, m.so]));

/* ───────────────────── Dựng bài mốc & bài bảo vệ ───────────────────── */

const tach = (s, i) => {
  const p = String(s).split('|||');
  return (p[i] ?? p[0]).trim();
};
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const li = (arr, i) => arr.map((x) => '<li>' + esc(tach(x, i)) + '</li>').join('');

const NHAN = [
  {
    eyebrow: (m) => 'Course project · Milestone ' + m.so + ' of ' + MOC.length + ' · after ' + tach(m.sauChuong, 0),
    topic: 'This milestone applies to the topic you registered at the start of the course. The table says what it means for each suggested topic; a self-chosen topic follows the same requirements — if one makes no sense for your topic, write in the README which feature practises that skill instead.',
    req: '✅ Required', stretch: '⭐ Stretch (optional)', map: '🧭 What this milestone means for each topic',
    hints: '💡 Hints — open one layer at a time', hintNote: 'Try the task first. Read hint 1 only when stuck, then hint 2, then hint 3.',
    demo: '🧪 Minimal working example — sample topic “Club gear lending”',
    demoNote: 'The sample topic (a club lends cameras, microphones and drones to its members) is deliberately not one of the suggested topics, so this is a starting skeleton, not a solution to copy. The code was run for real on Spring Boot 4.1.2 + Java 21 with PostgreSQL 16, Redis 7 and MongoDB 7 in Docker; the output is pasted unchanged (times, ids and hashes will differ on your machine).',
    done: '🎯 Done when', submit: '📤 What to submit',
    submitNote: 'Paste the links and notes into the submission box below this lesson, then mark the milestone as done. The progress bar of the course project counts it, and the defence committee will open exactly these links.',
  },
  {
    eyebrow: (m) => 'Dự án cuối khoá · Mốc ' + m.so + '/' + MOC.length + ' · sau ' + tach(m.sauChuong, 1),
    topic: 'Mốc này áp vào đề tài bạn đã đăng ký đầu khoá. Bảng cho biết với từng đề tài gợi ý thì mốc này nghĩa là gì; đề tài tự chọn làm theo đúng các yêu cầu chung — yêu cầu nào không hợp với đề tài thì ghi trong README tính năng nào luyện kỹ năng đó thay thế.',
    req: '✅ Yêu cầu bắt buộc', stretch: '⭐ Nâng cao (tuỳ chọn)', map: '🧭 Mốc này nghĩa là gì với từng đề tài',
    hints: '💡 Gợi ý — mở từng tầng một', hintNote: 'Tự làm trước. Kẹt mới đọc gợi ý 1, rồi gợi ý 2, rồi gợi ý 3.',
    demo: '🧪 Ví dụ tối thiểu chạy được — đề tài mẫu “Kho thiết bị CLB”',
    demoNote: 'Đề tài mẫu (CLB cho thành viên mượn máy ảnh, micro, flycam) cố ý không nằm trong danh sách gợi ý, nên đây là bộ khung khởi đầu, không phải lời giải để chép. Mã đã chạy thật trên Spring Boot 4.1.2 + Java 21 với PostgreSQL 16, Redis 7 và MongoDB 7 trong Docker; output dán nguyên văn (thời gian, id và mã băm trên máy bạn sẽ khác).',
    done: '🎯 Đạt khi', submit: '📤 Nộp gì',
    submitNote: 'Dán link và ghi chú vào khung nộp bài bên dưới bài này, rồi đánh dấu mốc đã xong. Thanh tiến độ dự án của khoá sẽ tính nó, và hội đồng bảo vệ sẽ mở đúng những link này.',
  },
];

/** baiMoc(so) → bài EXERCISE của mốc `so`, kèm khung mẫu chạy thật lấy từ ./_du-an-mau.mjs. */
export function baiMoc(so) {
  const m = MOC.find((x) => x.so === so);
  if (!m) throw new Error('spring-boot _du-an: không có mốc ' + so);
  const mau = MAU[so];
  if (!mau) throw new Error('spring-boot _du-an: thiếu khung mẫu cho mốc ' + so + ' trong _du-an-mau.mjs');
  const khoi = (i) => {
    const N = NHAN[i];
    const ban = DE_TAI.map((d) => {
      const b = d.banDoChuong.find((x) => x.moc === so);
      return '<tr><td>' + esc(tach(d.ten, i)) + '</td><td>' + esc(b ? tach(b.dung, i) : '—') + '</td></tr>';
    }).join('');
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
      '<table><thead><tr><th>' + (i === 0 ? 'Topic' : 'Đề tài') + '</th><th>' + (i === 0 ? 'What you build now' : 'Phần bạn làm ở mốc này') + '</th></tr></thead><tbody>' + ban + '</tbody></table>',
      '<h3>' + N.demo + '</h3>',
      '<p class="note-ct">' + N.demoNote + '</p>',
      i === 0 ? mau.en : mau.vi,
      '<h3>' + N.hints + '</h3>',
      '<div class="callout warn"><ol>' + li(m.goiY, i) + '</ol><p>' + N.hintNote + '</p></div>',
      '<h3>' + N.done + '</h3>',
      '<div class="callout ok"><ul>' + li(m.datKhi, i) + '</ul></div>',
      '<h3>' + N.submit + '</h3>',
      '<ul>' + li(m.bangChung, i) + '</ul>',
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
    description: 'Mốc dự án ' + so + '/' + MOC.length + ' (sau ' + tach(m.sauChuong, 1) + '): ' + tach(m.ten, 1) + ' — yêu cầu, bảng theo đề tài, ví dụ chạy thật, gợi ý theo tầng, đạt khi, nộp gì.',
    content: '\n' + khoi(0) + '\n' + khoi(1) + '\n',
  };
}

/** baiBaoVe() → bài EXERCISE cuối khoá { baoVeDuAn: true } dựng từ DU_AN.baoVe. */
export function baiBaoVe() {
  const tong = BAO_VE.rubric.reduce((a, r) => a + r.diem, 0);
  const khoi = (i) => {
    const so = (x) => (i === 0 ? String(x) : String(x).replace('.', ','));
    const rub = BAO_VE.rubric.map((r) => '<tr><td>' + esc(tach(r.tieuChi, i)) + '</td><td>' + so(r.diem) + '</td><td>' + esc(tach(r.moTa, i)) + '</td></tr>').join('');
    const t = i === 0
      ? { eb: 'Course project · Finish & defend', h2: 'Finish your Spring Boot project and defend it', lead: 'Twenty-two milestones turned the topic you registered into a tested, secured, containerised application. This last step is how an assignment or a job interview ends: you hand in something that runs, then you explain it — why each boundary, where each rule lives, what you would change. The AI defence room below plays the committee: it reads what you submit and asks follow-up questions until it is sure you built and understand the project.', c: '☑️ Before the defence — checklist', r: '🧮 Rubric (' + tong + ' points)', th: '<tr><th>Criterion</th><th>Points</th><th>What earns the points</th></tr>', q: '🎤 Questions committees really ask', qn: 'Practise answering out loud with the file open. A good answer has three parts: what the code does, why you chose it, and what you would change if the requirement changed. Expect at least one live demonstration: SQL log of a list, two concurrent requests, a token with one character changed.', trap1: '<strong>Trap — defending code you cannot explain.</strong> Using an AI assistant or a tutorial is allowed; not understanding the result is what fails a defence. Read every file once before you submit and be ready to say why each part exists.', trap2: '<strong>Trap — a demo that depends on luck.</strong> Start the compose stack before the session, keep a short screen recording as backup, and never demo with your real password or real personal data.', f: 'When you are ready, open the defence room below. It asks one question at a time, scores you on the rubric and writes feedback; fix what it finds and you may defend again.', next: 'Where to go next', nextP: 'Rebuild the same topic in the Node.js course (Express + Prisma) and compare — or take the React course to finish the front end properly.' }
      : { eb: 'Dự án cuối khoá · Hoàn thiện & bảo vệ', h2: 'Hoàn thiện dự án Spring Boot và bảo vệ nó', lead: 'Hai mươi hai mốc đã biến đề tài bạn đăng ký thành một ứng dụng có test, có bảo mật, chạy trong container. Bước cuối này giống cách một assignment hay một buổi phỏng vấn kết thúc: bạn nộp thứ chạy được, rồi giải thích nó — vì sao đặt ranh giới ở đó, luật nằm ở đâu, muốn đổi thì sửa chỗ nào. Phòng bảo vệ AI bên dưới đóng vai hội đồng: nó đọc thứ bạn nộp và hỏi vặn tới khi chắc rằng bạn tự làm và hiểu dự án.', c: '☑️ Trước buổi bảo vệ — checklist', r: '🧮 Rubric (' + tong + ' điểm)', th: '<tr><th>Tiêu chí</th><th>Điểm</th><th>Thế nào thì được điểm</th></tr>', q: '🎤 Những câu hội đồng hay hỏi thật', qn: 'Tập trả lời thành tiếng, mở sẵn tệp liên quan. Câu trả lời tốt có ba phần: mã làm gì, vì sao bạn chọn cách đó, và nếu yêu cầu đổi thì bạn sửa gì. Chuẩn bị ít nhất một màn chứng minh trực tiếp: log SQL của một danh sách, hai request đồng thời, một token bị đổi một ký tự.', trap1: '<strong>Bẫy — bảo vệ đoạn mã mình không giải thích được.</strong> Dùng trợ lý AI hay hướng dẫn trên mạng là được phép; không hiểu kết quả mới là thứ làm trượt buổi bảo vệ. Đọc lại mọi tệp một lượt trước khi nộp và sẵn sàng nói vì sao từng phần tồn tại.', trap2: '<strong>Bẫy — buổi demo trông vào may rủi.</strong> Khởi động cụm compose trước buổi bảo vệ, giữ sẵn một đoạn quay màn hình dự phòng, và không bao giờ demo bằng mật khẩu thật hay dữ liệu cá nhân thật.', f: 'Khi đã sẵn sàng, mở phòng bảo vệ bên dưới. Nó hỏi từng câu một, chấm theo rubric và viết nhận xét; sửa xong những gì nó chỉ ra thì được bảo vệ lại.', next: 'Đi tiếp đâu', nextP: 'Dựng lại cùng đề tài ở khoá Node.js (Express + Prisma) rồi so sánh — hoặc học khoá React để hoàn thiện giao diện cho đúng nghề.' };
    return [
      '<div class="' + (i === 0 ? 'ml-en' : 'ml-vi') + '">',
      '<span class="eyebrow">' + t.eb + '</span>',
      '<h2>' + t.h2 + '</h2>',
      '<p class="lead">' + t.lead + '</p>',
      '<h3>' + t.c + '</h3>',
      '<div class="callout ok"><ul>' + li(BAO_VE.chuanBi, i) + '</ul></div>',
      '<h3>' + t.r + '</h3>',
      '<table><thead>' + t.th + '</thead><tbody>' + rub + '<tr><td><strong>' + (i === 0 ? 'Total' : 'Tổng') + '</strong></td><td><strong>' + so(tong) + '</strong></td><td></td></tr></tbody></table>',
      '<h3>' + t.q + '</h3>',
      '<p>' + t.qn + '</p>',
      '<ol>' + li(BAO_VE.cauHoiMau, i) + '</ol>',
      '<div class="pitfall co-tieu-de"><p>' + t.trap1 + '</p></div>',
      '<div class="pitfall co-tieu-de"><p>' + t.trap2 + '</p></div>',
      '<p class="note-ct">' + t.f + '</p>',
      '<h3>' + t.next + '</h3>',
      '<p>' + t.nextP + ' <a href="/courses/nodejs">Node.js</a> · <a href="/courses/react">React</a> · <a href="/courses/interview-prep">IT Interview Prep</a></p>',
      '</div>',
    ].join('\n');
  };
  return {
    title: '🎓 Finish & defend your course project|||🎓 Hoàn thiện & bảo vệ dự án cuối khoá',
    slug: 'sb-bao-ve-du-an',
    type: 'EXERCISE',
    baoVeDuAn: true,
    isFreePreview: true,
    description: 'Bài cuối khoá: checklist hoàn thiện dự án Spring Boot, rubric 10 điểm, 26 câu hội đồng hay hỏi, và phòng bảo vệ AI.',
    content: '\n' + khoi(0) + '\n' + khoi(1) + '\n',
  };
}
