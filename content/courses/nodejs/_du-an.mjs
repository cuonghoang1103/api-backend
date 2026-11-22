/**
 * Node.js — "Dự án xuyên suốt khoá" (hợp đồng: docs/du-an-hop-dong.md v1, soạn 22/11/2026).
 *
 * MỘT nguồn sự thật:
 *   1. `duAn` ở cấp gốc của content/courses/nodejs.mjs (import { DU_AN });
 *   2. bài mốc `nodejs-moc-N` (N = 1..18, một mốc sau mỗi chương, đặt TRƯỚC quiz chương) dựng bằng baiMoc(N);
 *   3. bài `nodejs-bao-ve-du-an` cuối khoá (baoVeDuAn) dựng bằng baiBaoVe().
 * Sửa yêu cầu một mốc ⇒ sửa Ở ĐÂY; bài trong chương tự đổi theo.
 *
 * Khung mẫu chạy thật của từng mốc nằm ở ./_du-an-ma.mjs (SINH TỰ ĐỘNG từ tệp đã chạy thật — đề tài mẫu "Plant-care log",
 * cố ý KHÔNG nằm trong danh sách đề tài gợi ý, để nó là bộ khung khởi đầu chứ không phải lời giải để chép).
 *
 * Quy ước chuỗi: dữ liệu viết bằng nháy kép, CHỮ THUẦN "EN|||VI" (không thẻ HTML), không backtick, không gạch chéo ngược.
 * Bài học Notes API (bài 0.4) vẫn là ví dụ của THẦY xuyên khoá; dự án này là của NGƯỜI HỌC, đề tài người học chọn.
 */
import { MA } from './_du-an-ma.mjs';

const L = (chuong, slug) => ({ chuong, slug }); // liên kết bài trong khoá

const DE_TAI = [
  {
    slug: "clinic-booking",
    ten: "Clinic appointment booking API|||API đặt lịch phòng khám",
    moTa: "Patients find a doctor by specialty, pick a free time slot and book or cancel it; doctors manage their schedule; the clinic admin sees the day at a glance. The hard part is real: two patients must never get the same slot.|||Bệnh nhân tìm bác sĩ theo chuyên khoa, chọn khung giờ trống rồi đặt hoặc huỷ; bác sĩ quản lý lịch của mình; quản trị phòng khám xem lịch cả ngày. Phần khó là có thật: hai bệnh nhân không bao giờ được giữ cùng một khung giờ.",
    doKho: 2,
    tinhNang: [
      "Doctors, specialties and weekly schedules|||Bác sĩ, chuyên khoa và lịch làm việc theo tuần",
      "Free-slot search with pagination and filters|||Tìm khung giờ trống có phân trang và bộ lọc",
      "Book / cancel with no double booking (transaction + unique constraint)|||Đặt / huỷ lịch không trùng (transaction + ràng buộc unique)",
      "Roles: patient, doctor, admin; a patient only sees own appointments|||Vai trò: bệnh nhân, bác sĩ, admin; bệnh nhân chỉ xem lịch của mình",
      "Upload of test results (PDF/image) with type checking|||Tải lên kết quả xét nghiệm (PDF/ảnh) có kiểm kiểu tệp",
      "Live schedule updates for the doctor’s screen|||Lịch cập nhật trực tiếp trên màn hình bác sĩ",
      "Reminder email the day before (background job)|||Email nhắc lịch hôm trước (tác vụ nền)",
      "Cached doctor list and rate-limited booking|||Danh sách bác sĩ có cache và đặt lịch có giới hạn tần suất",
    ],
    banDoChuong: [
      { moc: 1, dung: "Doctor, Slot, Appointment objects; isSlotFree(), canCancel() (≥ 2 h before)|||Đối tượng Doctor, Slot, Appointment; isSlotFree(), canCancel() (trước ≥ 2 giờ)" },
      { moc: 2, dung: "Generating a month of slots for 50 doctors moved to a worker|||Sinh lịch một tháng cho 50 bác sĩ chuyển sang worker" },
      { moc: 3, dung: "Raw http: GET /doctors, POST /appointments saved to a JSON file, event appointment.booked|||http thuần: GET /doctors, POST /appointments lưu tệp JSON, sự kiện appointment.booked" },
      { moc: 4, dung: "Scripts, lockfile, .env.example with DATABASE_URL and SMTP settings|||Script, lockfile, .env.example có DATABASE_URL và cấu hình SMTP" },
      { moc: 5, dung: "Routers doctors / slots / appointments, one error shape|||Router doctors / slots / appointments, một dạng lỗi" },
      { moc: 6, dung: "CRUD appointments, 409 when the slot is taken, GET /slots?doctorId&date&page|||CRUD lịch hẹn, 409 khi slot đã có người, GET /slots?doctorId&date&page" },
      { moc: 7, dung: "Tables doctors, slots, appointments, users; booking in one transaction|||Bảng doctors, slots, appointments, users; đặt lịch trong một transaction" },
      { moc: 8, dung: "Patient / doctor / admin roles; patient cancels only own booking|||Vai trò bệnh nhân / bác sĩ / admin; bệnh nhân chỉ huỷ lịch của mình" },
      { moc: 9, dung: "Rate limit on login and booking; doctor notes escaped on output|||Giới hạn tần suất đăng nhập và đặt lịch; ghi chú bác sĩ được thoát khi xuất" },
      { moc: 10, dung: "Test-result upload: presigned PUT, PDF/JPEG/PNG only, 5 MB|||Tải kết quả xét nghiệm: presigned PUT, chỉ PDF/JPEG/PNG, 5 MB" },
      { moc: 11, dung: "Doctor’s day view updates live when a patient books or cancels|||Màn hình lịch ngày của bác sĩ tự cập nhật khi bệnh nhân đặt/huỷ" },
      { moc: 12, dung: "Cache doctor list per specialty; Redis lock while a slot is being booked|||Cache danh sách bác sĩ theo chuyên khoa; khoá Redis khi đang đặt một slot" },
      { moc: 13, dung: "Reminder job 24 h before; nightly job frees unconfirmed slots|||Job nhắc trước 24 giờ; job ban đêm giải phóng slot chưa xác nhận" },
      { moc: 14, dung: "Tests: double booking under concurrency, cancel window, 403 on others’ bookings|||Test: đặt trùng khi đồng thời, hạn huỷ, 403 với lịch người khác" },
      { moc: 15, dung: "Request id from booking to reminder job; metric bookings_total by status|||Request id từ lúc đặt tới job nhắc; metric bookings_total theo trạng thái" },
      { moc: 16, dung: "Load test the free-slot search; add the right composite index|||Đo tải tìm slot trống; thêm đúng chỉ mục ghép" },
      { moc: 17, dung: "Compose api + postgres + redis + worker; deploy with HTTPS|||Compose api + postgres + redis + worker; deploy có HTTPS" },
      { moc: 18, dung: "Features scheduling / booking / notification; ADR on preventing double booking|||Feature scheduling / booking / notification; ADR chống đặt trùng" },
    ],
    thamKhaoThat: [
      "Online booking of hospital appointments in Vietnam (e.g. the booking pages of large private hospitals)|||Đặt khám trực tuyến ở các bệnh viện tư lớn tại Việt Nam",
      "Calendly-style scheduling products (free slots, booking, reminders)|||Các sản phẩm đặt lịch kiểu Calendly (slot trống, đặt chỗ, nhắc lịch)",
    ],
    anh: null,
  },
  {
    slug: "canteen-ordering",
    ten: "Campus canteen ordering API|||API đặt món căng tin trường",
    moTa: "Students order from the campus canteen on their phone and pick the food up when it is ready; the kitchen screen sees new orders instantly; staff manage the menu and stock. Money and stock must stay exact even when 200 students order at 11:55.|||Sinh viên đặt món căng tin trên điện thoại và tới lấy khi món xong; màn hình bếp thấy đơn mới ngay lập tức; nhân viên quản lý thực đơn và tồn kho. Tiền và tồn kho phải luôn đúng kể cả khi 200 sinh viên cùng đặt lúc 11:55.",
    doKho: 2,
    tinhNang: [
      "Menu with categories, photos and availability|||Thực đơn có danh mục, ảnh và trạng thái còn/hết",
      "Order with several items; total computed on the server in integer VND|||Đơn nhiều món; tổng tiền tính ở máy chủ bằng số nguyên VND",
      "Stock decremented in the same transaction as the order|||Trừ tồn kho trong cùng transaction với đơn",
      "Order status flow: placed → cooking → ready → picked up|||Luồng trạng thái đơn: đã đặt → đang nấu → xong → đã lấy",
      "Kitchen screen with live new orders|||Màn hình bếp nhận đơn mới trực tiếp",
      "Roles: student, kitchen staff, manager|||Vai trò: sinh viên, nhân viên bếp, quản lý",
      "Daily sales report generated in the background|||Báo cáo doanh thu ngày sinh ở nền",
      "Rate limit on ordering; cached menu|||Giới hạn tần suất đặt đơn; thực đơn có cache",
    ],
    banDoChuong: [
      { moc: 1, dung: "MenuItem, Order, OrderLine; orderTotal() in integer VND; canTransition()|||MenuItem, Order, OrderLine; orderTotal() bằng số nguyên VND; canTransition()" },
      { moc: 2, dung: "The end-of-day sales report over 30 000 lines runs in a worker|||Báo cáo doanh thu cuối ngày trên 30 000 dòng chạy trong worker" },
      { moc: 3, dung: "Raw http: GET /menu, POST /orders to a JSON file, event order.placed|||http thuần: GET /menu, POST /orders vào tệp JSON, sự kiện order.placed" },
      { moc: 4, dung: "Scripts, lockfile, .env.example (DATABASE_URL, REDIS_URL)|||Script, lockfile, .env.example (DATABASE_URL, REDIS_URL)" },
      { moc: 5, dung: "Routers menu / orders / kitchen, central errors|||Router menu / orders / kitchen, lỗi tập trung" },
      { moc: 6, dung: "POST /orders validated line by line; PATCH status; 409 when sold out|||POST /orders kiểm từng dòng; PATCH trạng thái; 409 khi hết món" },
      { moc: 7, dung: "Tables menu_items, orders, order_lines, users; order + stock in one transaction|||Bảng menu_items, orders, order_lines, users; đơn + tồn kho trong một transaction" },
      { moc: 8, dung: "Students see only their orders; only kitchen staff change status|||Sinh viên chỉ thấy đơn của mình; chỉ nhân viên bếp đổi trạng thái" },
      { moc: 9, dung: "Price never trusted from the client; order notes escaped|||Không bao giờ tin giá từ client; ghi chú đơn được thoát" },
      { moc: 10, dung: "Dish photos: presigned upload, WebP thumbnails, long cache|||Ảnh món: tải presigned, ảnh thu nhỏ WebP, cache dài" },
      { moc: 11, dung: "Kitchen room gets order.placed; the student gets order.ready|||Phòng bếp nhận order.placed; sinh viên nhận order.ready" },
      { moc: 12, dung: "Cache the menu; Redis rate limit 3 orders/min per student|||Cache thực đơn; Redis giới hạn 3 đơn/phút mỗi sinh viên" },
      { moc: 13, dung: "Daily report job at 21:00; cancel orders not picked up after 2 h|||Job báo cáo 21:00; huỷ đơn không đến lấy sau 2 giờ" },
      { moc: 14, dung: "Tests: total, stock never negative under concurrency, status rules|||Test: tổng tiền, tồn kho không âm khi đồng thời, luật trạng thái" },
      { moc: 15, dung: "Metric orders_total by status; slow-query log for the order route|||Metric orders_total theo trạng thái; log truy vấn chậm của tuyến đặt đơn" },
      { moc: 16, dung: "Simulate the 11:55 rush with autocannon; fix the slowest step|||Mô phỏng giờ cao điểm 11:55 bằng autocannon; sửa bước chậm nhất" },
      { moc: 17, dung: "Compose api + worker + postgres + redis; zero-downtime redeploy|||Compose api + worker + postgres + redis; deploy lại không gián đoạn" },
      { moc: 18, dung: "Features menu / ordering / kitchen / reporting; ADR on money as integers|||Feature menu / ordering / kitchen / reporting; ADR về tiền dạng số nguyên" },
    ],
    thamKhaoThat: [
      "Food-ordering apps such as ShopeeFood or GrabFood (menu, cart, order status)|||Ứng dụng đặt đồ ăn như ShopeeFood, GrabFood (thực đơn, giỏ, trạng thái đơn)",
      "Kitchen display systems used by fast-food chains|||Màn hình bếp (kitchen display) của các chuỗi đồ ăn nhanh",
    ],
    anh: null,
  },
  {
    slug: "team-task-board",
    ten: "Team task board API (a small Jira)|||API bảng công việc nhóm (Jira thu nhỏ)",
    moTa: "A team creates a project, adds members with roles and moves issues across a board; comments, attachments and an activity log keep everyone in sync; the board updates live for everyone looking at it. Ideal for students who will run an SWP391 team.|||Một nhóm tạo dự án, thêm thành viên theo vai trò và kéo issue qua các cột của bảng; bình luận, tệp đính kèm và nhật ký hoạt động giữ mọi người cùng nhịp; bảng tự cập nhật cho mọi người đang xem. Hợp với bạn sắp chạy nhóm SWP391.",
    doKho: 3,
    tinhNang: [
      "Projects and members with roles (owner, member, viewer)|||Dự án và thành viên theo vai trò (owner, member, viewer)",
      "Issues with status, assignee, priority, due date and key (PRJ-12)|||Issue có trạng thái, người nhận, độ ưu tiên, hạn và mã (PRJ-12)",
      "Board with ordered columns; moving an issue keeps order consistent|||Bảng có cột theo thứ tự; kéo issue giữ thứ tự nhất quán",
      "Comments with mentions; attachments on issues|||Bình luận có nhắc tên; tệp đính kèm trên issue",
      "Search and filter (assignee, status, text) with pagination|||Tìm và lọc (người nhận, trạng thái, chữ) có phân trang",
      "Activity log of every change|||Nhật ký hoạt động mọi thay đổi",
      "Live board updates per project room|||Bảng cập nhật trực tiếp theo phòng dự án",
      "Due-date reminder digest every morning|||Thư tóm tắt việc sắp tới hạn mỗi sáng",
    ],
    banDoChuong: [
      { moc: 1, dung: "Project, Member, Issue; nextKey(), canMove(role, from, to)|||Project, Member, Issue; nextKey(), canMove(role, from, to)" },
      { moc: 2, dung: "Exporting 20 000 issues to CSV runs in a worker|||Xuất 20 000 issue ra CSV chạy trong worker" },
      { moc: 3, dung: "Raw http: GET /projects/:key/issues, POST issue, event issue.moved; CSV export as a stream|||http thuần: GET /projects/:key/issues, POST issue, sự kiện issue.moved; xuất CSV bằng stream" },
      { moc: 4, dung: "Scripts, lockfile, .env.example; audit before adding a markdown library|||Script, lockfile, .env.example; audit trước khi thêm thư viện markdown" },
      { moc: 5, dung: "Nested routers /projects/:key/issues/:n/comments|||Router lồng /projects/:key/issues/:n/comments" },
      { moc: 6, dung: "Full CRUD issues, PATCH for move, filter + sort + cursor pagination|||CRUD issue đủ, PATCH để kéo cột, lọc + sắp xếp + phân trang cursor" },
      { moc: 7, dung: "Tables projects, members, issues, comments, activity; issue key unique per project|||Bảng projects, members, issues, comments, activity; mã issue unique theo dự án" },
      { moc: 8, dung: "Membership + role checked on every project route; viewer cannot write|||Kiểm thành viên + vai trò ở mọi tuyến dự án; viewer không được ghi" },
      { moc: 9, dung: "Markdown in comments sanitised; IDOR test across projects|||Markdown trong bình luận được làm sạch; thử IDOR giữa các dự án" },
      { moc: 10, dung: "Attachments: presigned upload, sniffed type, 10 MB, private bucket|||Đính kèm: tải presigned, kiểm kiểu thật, 10 MB, bucket riêng tư" },
      { moc: 11, dung: "Room per project: issue.created / issue.moved / comment.added|||Phòng theo dự án: issue.created / issue.moved / comment.added" },
      { moc: 12, dung: "Cache board columns; invalidate on move; Redis counter for issue keys|||Cache cột bảng; xoá cache khi kéo; bộ đếm Redis cho mã issue" },
      { moc: 13, dung: "Morning digest job per member; activity fan-out in the background|||Job tóm tắt buổi sáng cho từng thành viên; ghi hoạt động ở nền" },
      { moc: 14, dung: "Tests: role matrix, ordering after concurrent moves, IDOR|||Test: ma trận vai trò, thứ tự sau khi kéo đồng thời, IDOR" },
      { moc: 15, dung: "Trace one issue move through API, DB and socket broadcast|||Lần một lần kéo issue qua API, DB và phát socket" },
      { moc: 16, dung: "Load test board listing for a 5 000-issue project; fix N+1 on assignees|||Đo tải danh sách bảng cho dự án 5 000 issue; sửa N+1 ở người nhận" },
      { moc: 17, dung: "Compose with sticky sessions or the Redis adapter for sockets; deploy|||Compose có sticky session hoặc Redis adapter cho socket; deploy" },
      { moc: 18, dung: "Features projects / issues / comments / activity; ADR on ordering columns|||Feature projects / issues / comments / activity; ADR về thứ tự trong cột" },
    ],
    thamKhaoThat: [
      "Jira, Linear, Trello (boards, issues, roles)|||Jira, Linear, Trello (bảng, issue, vai trò)",
      "CT Work on this website (Projects → board)|||CT Work trên chính website này (Dự án → bảng)",
    ],
    anh: null,
  },
  {
    slug: "boarding-house",
    ten: "Student boarding-house manager|||Quản lý nhà trọ sinh viên",
    moTa: "A landlord manages rooms, tenants and contracts; every month the system turns electricity and water meter readings into invoices; tenants see and confirm their bills and get reminders when a payment is late. Small enough for one person, real enough to sell.|||Chủ trọ quản lý phòng, người thuê và hợp đồng; mỗi tháng hệ thống biến chỉ số điện nước thành hoá đơn; người thuê xem và xác nhận hoá đơn, được nhắc khi trễ hạn. Vừa sức một người, đủ thật để bán được.",
    doKho: 2,
    tinhNang: [
      "Rooms, tenants and contracts (start, end, deposit)|||Phòng, người thuê và hợp đồng (bắt đầu, kết thúc, tiền cọc)",
      "Monthly meter readings with photo evidence|||Chỉ số điện nước hằng tháng kèm ảnh làm bằng chứng",
      "Invoice generation: rent + electricity + water + services, integer VND|||Sinh hoá đơn: tiền phòng + điện + nước + dịch vụ, số nguyên VND",
      "Payments recorded; invoice status unpaid / partial / paid|||Ghi nhận thanh toán; trạng thái hoá đơn chưa trả / trả một phần / đã trả",
      "Landlord and tenant roles; a tenant sees only own room|||Vai trò chủ trọ và người thuê; người thuê chỉ thấy phòng mình",
      "Late-payment reminders|||Nhắc thanh toán trễ hạn",
      "Occupancy and revenue report|||Báo cáo tỉ lệ lấp đầy và doanh thu",
      "Live notice when a new invoice is issued|||Thông báo trực tiếp khi có hoá đơn mới",
    ],
    banDoChuong: [
      { moc: 1, dung: "Room, Contract, Reading, Invoice; invoiceTotal(), isOverdue()|||Room, Contract, Reading, Invoice; invoiceTotal(), isOverdue()" },
      { moc: 2, dung: "Yearly revenue report across all rooms in a worker|||Báo cáo doanh thu cả năm mọi phòng chạy trong worker" },
      { moc: 3, dung: "Raw http: GET /rooms, POST /readings to a JSON file, event invoice.issued|||http thuần: GET /rooms, POST /readings vào tệp JSON, sự kiện invoice.issued" },
      { moc: 4, dung: "Scripts, lockfile, .env.example with price settings|||Script, lockfile, .env.example có cấu hình đơn giá" },
      { moc: 5, dung: "Routers rooms / contracts / readings / invoices|||Router rooms / contracts / readings / invoices" },
      { moc: 6, dung: "Reading must be ≥ last month (400); 409 for a second invoice of a month|||Chỉ số phải ≥ tháng trước (400); 409 khi lập hoá đơn thứ hai cùng tháng" },
      { moc: 7, dung: "Tables rooms, contracts, readings, invoices, payments; unique (room, month)|||Bảng rooms, contracts, readings, invoices, payments; unique (phòng, tháng)" },
      { moc: 8, dung: "Landlord vs tenant; tenant reads only own invoices|||Chủ trọ và người thuê; người thuê chỉ đọc hoá đơn của mình" },
      { moc: 9, dung: "Rate-limited login; national-ID numbers never in logs or errors|||Đăng nhập có giới hạn tần suất; số CCCD không bao giờ vào log hay lỗi" },
      { moc: 10, dung: "Meter photo upload: presigned, image types only, 3 MB|||Tải ảnh đồng hồ: presigned, chỉ ảnh, 3 MB" },
      { moc: 11, dung: "Tenant room gets invoice.issued; landlord gets payment.recorded|||Phòng người thuê nhận invoice.issued; chủ trọ nhận payment.recorded" },
      { moc: 12, dung: "Cache the occupancy dashboard; invalidate on contract changes|||Cache bảng lấp đầy; xoá cache khi hợp đồng đổi" },
      { moc: 13, dung: "Monthly invoice job on the 1st; reminder job for overdue invoices|||Job lập hoá đơn ngày 1; job nhắc hoá đơn quá hạn" },
      { moc: 14, dung: "Tests: invoice arithmetic, month boundaries, tenant isolation|||Test: phép tính hoá đơn, ranh giới tháng, cô lập người thuê" },
      { moc: 15, dung: "Logs and a metric for invoices generated / failed per run|||Log và metric số hoá đơn sinh được / lỗi mỗi lượt" },
      { moc: 16, dung: "Measure the monthly job for 1 000 rooms; batch the inserts|||Đo job hằng tháng cho 1 000 phòng; gộp lệnh insert" },
      { moc: 17, dung: "Compose + deploy; backups of the database scheduled|||Compose + deploy; lịch sao lưu cơ sở dữ liệu" },
      { moc: 18, dung: "Features rooms / billing / payments; ADR on monthly job idempotency|||Feature rooms / billing / payments; ADR về job hằng tháng idempotent" },
    ],
    thamKhaoThat: [
      "Rental-management apps for landlords in Vietnam (rooms, electricity/water invoices)|||Các app quản lý nhà trọ cho chủ trọ ở Việt Nam (phòng, hoá đơn điện nước)",
      "Property-management software for apartments|||Phần mềm quản lý toà nhà / căn hộ",
    ],
    anh: null,
  },
  {
    slug: "event-tickets",
    ten: "Event ticketing with seat holds|||Bán vé sự kiện có giữ chỗ",
    moTa: "Organisers publish an event with a seat map; buyers hold seats for 10 minutes while they pay; a paid order becomes QR tickets checked at the door. The classic hard problems — holds that expire, retries that must not charge twice, bots — are the point of the project.|||Ban tổ chức đăng sự kiện có sơ đồ ghế; người mua giữ ghế 10 phút trong lúc thanh toán; đơn đã trả thành vé QR được soát ở cửa. Chính các bài toán khó kinh điển — giữ chỗ hết hạn, thử lại không được trừ tiền hai lần, bot — là cốt lõi của dự án.",
    doKho: 3,
    tinhNang: [
      "Events with seat maps and price zones|||Sự kiện có sơ đồ ghế và khu giá",
      "Seat hold with a 10-minute expiry|||Giữ ghế có hạn 10 phút",
      "Checkout with an Idempotency-Key (simulated payment)|||Thanh toán có Idempotency-Key (thanh toán giả lập)",
      "QR ticket and door check-in that works once|||Vé QR và soát vé ở cửa chỉ dùng được một lần",
      "Live seat availability on the seat map|||Ghế trống cập nhật trực tiếp trên sơ đồ",
      "Organiser dashboard: sold, held, checked in|||Bảng điều khiển ban tổ chức: đã bán, đang giữ, đã vào cửa",
      "Rate limit and bot protection on holds|||Giới hạn tần suất và chống bot khi giữ ghế",
      "Background job releases expired holds and emails tickets|||Job nền nhả ghế hết hạn và gửi vé qua email",
    ],
    banDoChuong: [
      { moc: 1, dung: "Event, Seat, Hold, Order, Ticket; holdExpired(), canCheckIn()|||Event, Seat, Hold, Order, Ticket; holdExpired(), canCheckIn()" },
      { moc: 2, dung: "Generating 5 000 signed QR codes in a worker|||Sinh 5 000 mã QR có chữ ký trong worker" },
      { moc: 3, dung: "Raw http: GET /events/:id/seats, POST /holds, event seat.held|||http thuần: GET /events/:id/seats, POST /holds, sự kiện seat.held" },
      { moc: 4, dung: "Scripts, lockfile, .env.example; signing secret only in env|||Script, lockfile, .env.example; khoá ký chỉ trong env" },
      { moc: 5, dung: "Routers events / holds / orders / checkin|||Router events / holds / orders / checkin" },
      { moc: 6, dung: "409 for a taken seat, 410 for an expired hold, idempotent POST /orders|||409 khi ghế đã có người, 410 khi giữ chỗ hết hạn, POST /orders idempotent" },
      { moc: 7, dung: "Tables events, seats, holds, orders, tickets; unique (event, seat) on tickets|||Bảng events, seats, holds, orders, tickets; unique (sự kiện, ghế) trên vé" },
      { moc: 8, dung: "Buyer, organiser, door staff; staff only check in their event|||Người mua, ban tổ chức, nhân viên cửa; nhân viên chỉ soát vé sự kiện của mình" },
      { moc: 9, dung: "Rate limit holds per user and IP; QR payload signed, not guessable|||Giới hạn giữ chỗ theo người và IP; dữ liệu QR có chữ ký, không đoán được" },
      { moc: 10, dung: "Event poster upload; posters served through the CDN with long cache|||Tải poster sự kiện; poster phục vụ qua CDN có cache dài" },
      { moc: 11, dung: "Room per event: seat.held / seat.released / seat.sold|||Phòng theo sự kiện: seat.held / seat.released / seat.sold" },
      { moc: 12, dung: "Holds as Redis keys with TTL (SET NX EX); seat map cached|||Giữ chỗ là khoá Redis có TTL (SET NX EX); sơ đồ ghế có cache" },
      { moc: 13, dung: "Job releases expired holds; ticket email job with retries, idempotent|||Job nhả ghế hết hạn; job gửi vé có thử lại, idempotent" },
      { moc: 14, dung: "Tests: two buyers one seat, double checkout, double check-in|||Test: hai người một ghế, thanh toán hai lần, soát vé hai lần" },
      { moc: 15, dung: "Metrics holds_active, orders_total; alert when holds fail|||Metric holds_active, orders_total; cảnh báo khi giữ chỗ lỗi" },
      { moc: 16, dung: "Simulate 1 000 buyers at sale opening; measure p99 of POST /holds|||Mô phỏng 1 000 người lúc mở bán; đo p99 của POST /holds" },
      { moc: 17, dung: "Compose with 2 API replicas behind a proxy; deploy|||Compose có 2 bản API sau proxy; deploy" },
      { moc: 18, dung: "Features catalog / holds / checkout / checkin; ADR on Redis vs DB for holds|||Feature catalog / holds / checkout / checkin; ADR Redis hay DB cho giữ chỗ" },
    ],
    thamKhaoThat: [
      "Ticketbox and Ticketmaster (seat maps, timed holds, QR tickets)|||Ticketbox, Ticketmaster (sơ đồ ghế, giữ chỗ có hạn, vé QR)",
      "Idempotency keys as documented by payment APIs such as Stripe|||Idempotency key như tài liệu của các API thanh toán (vd Stripe)",
    ],
    anh: null,
  },
  {
    slug: "campus-library",
    ten: "Campus library loans API|||API mượn trả thư viện trường",
    moTa: "Students search the catalogue, reserve a book that is out and borrow copies; librarians handle loans, returns and fines; everyone gets a reminder before the due date. The gentlest topic in the list — a good choice if this is your first backend.|||Sinh viên tra cứu, đặt trước sách đang có người mượn và mượn bản sao; thủ thư xử lý mượn, trả và phạt; ai cũng được nhắc trước hạn trả. Đề tài nhẹ nhàng nhất danh sách — hợp nếu đây là backend đầu tiên của bạn.",
    doKho: 1,
    tinhNang: [
      "Books, authors and physical copies|||Sách, tác giả và bản sao vật lý",
      "Catalogue search with filters and pagination|||Tra cứu có bộ lọc và phân trang",
      "Borrow / return a copy; max 3 loans per student|||Mượn / trả bản sao; tối đa 3 cuốn mỗi sinh viên",
      "Reservation queue for books that are out|||Hàng đợi đặt trước cho sách đang hết",
      "Overdue fines computed per day|||Tiền phạt quá hạn tính theo ngày",
      "Student and librarian roles|||Vai trò sinh viên và thủ thư",
      "Cover image upload|||Tải ảnh bìa",
      "Due-date reminder emails|||Email nhắc hạn trả",
    ],
    banDoChuong: [
      { moc: 1, dung: "Book, Copy, Loan; canBorrow(student), fineFor(loan, today)|||Book, Copy, Loan; canBorrow(student), fineFor(loan, today)" },
      { moc: 2, dung: "Importing a 100 000-row catalogue CSV without blocking (worker or stream)|||Nhập CSV 100 000 dòng không chặn (worker hoặc stream)" },
      { moc: 3, dung: "Raw http: GET /books, POST /loans to a JSON file, event loan.created|||http thuần: GET /books, POST /loans vào tệp JSON, sự kiện loan.created" },
      { moc: 4, dung: "Scripts, lockfile, .env.example|||Script, lockfile, .env.example" },
      { moc: 5, dung: "Routers books / copies / loans / reservations|||Router books / copies / loans / reservations" },
      { moc: 6, dung: "409 when the copy is out or the student has 3 loans; search with ?q&page|||409 khi bản sao đã được mượn hoặc sinh viên đủ 3 cuốn; tìm ?q&page" },
      { moc: 7, dung: "Tables books, copies, loans, reservations, users; borrow in one transaction|||Bảng books, copies, loans, reservations, users; mượn trong một transaction" },
      { moc: 8, dung: "Only librarians create books and record returns|||Chỉ thủ thư tạo sách và ghi nhận trả" },
      { moc: 9, dung: "Search text never concatenated into SQL; login rate limit|||Chữ tìm kiếm không bao giờ nối vào SQL; giới hạn tần suất đăng nhập" },
      { moc: 10, dung: "Cover upload with type check and thumbnails|||Tải ảnh bìa có kiểm kiểu và ảnh thu nhỏ" },
      { moc: 11, dung: "A reserving student is told live when the book comes back|||Sinh viên đặt trước được báo trực tiếp khi sách được trả" },
      { moc: 12, dung: "Cache popular searches; invalidate when copies change|||Cache tìm kiếm phổ biến; xoá cache khi bản sao thay đổi" },
      { moc: 13, dung: "Reminder 2 days before due; nightly fine calculation job|||Nhắc trước hạn 2 ngày; job tính phạt ban đêm" },
      { moc: 14, dung: "Tests: 3-loan limit, fine on boundaries, reservation order|||Test: giới hạn 3 cuốn, tiền phạt ở biên, thứ tự đặt trước" },
      { moc: 15, dung: "Logs with request id; metric loans_active|||Log có request id; metric loans_active" },
      { moc: 16, dung: "Load test search; add a trigram or full-text index|||Đo tải tìm kiếm; thêm chỉ mục trigram hoặc full-text" },
      { moc: 17, dung: "Compose + deploy with HTTPS|||Compose + deploy có HTTPS" },
      { moc: 18, dung: "Features catalog / loans / reservations; ADR on fine calculation|||Feature catalog / loans / reservations; ADR về cách tính phạt" },
    ],
    thamKhaoThat: [
      "Library systems such as Koha (open-source integrated library system)|||Hệ thống thư viện như Koha (phần mềm thư viện mã nguồn mở)",
      "University library portals (search, loans, reservations)|||Cổng thư viện của các trường đại học (tra cứu, mượn, đặt trước)",
    ],
    anh: null,
  },
];

/* ───────────────────────── 18 mốc — một mốc sau mỗi chương ───────────────────────── */

const MOC = [
  {
    so: 1, slug: "nodejs-moc-1", sauChuong: "Chapter 1 — JavaScript for the backend|||Chương 1 — JavaScript cho backend",
    ten: "Your domain in plain JavaScript|||Miền nghiệp vụ của bạn bằng JavaScript thuần",
    lead: "Before any server exists, write the heart of your topic as plain JavaScript modules: the objects, the rules, and one async read. Everything later — routes, database, tests — wraps around this code.|||Trước khi có server, hãy viết trái tim đề tài bằng module JavaScript thuần: các đối tượng, các luật, và một lần đọc bất đồng bộ. Mọi thứ sau này — tuyến, cơ sở dữ liệu, test — đều bọc quanh đoạn mã này.",
    yeuCau: [
      "Create the project repository; README.md with a one-sentence pitch, the 6–12 features of your topic and its main entities|||Tạo repo dự án; README.md có câu giới thiệu, 6–12 tính năng của đề tài và các thực thể chính",
      "One ES module per entity (src/domain/*.js) with a factory that validates input and throws an Error with a clear message|||Mỗi thực thể một ES module (src/domain/*.js) có hàm tạo kiểm đầu vào và ném Error với thông điệp rõ ràng",
      "At least 3 pure business-rule functions of your topic (e.g. is the slot free, order total, is the loan overdue)|||Ít nhất 3 hàm thuần cho luật nghiệp vụ của đề tài (vd slot còn trống, tổng tiền đơn, mượn đã quá hạn)",
      "One async function that reads seed data from a JSON file with await and handles a failure with try/catch|||Một hàm async đọc dữ liệu mẫu từ tệp JSON bằng await và xử lý lỗi bằng try/catch",
      "const by default, let only when reassigned, no var; no global mutable state|||Mặc định const, chỉ let khi gán lại, không var; không có trạng thái toàn cục thay đổi được",
    ],
    nangCao: [
      "Freeze returned objects (Object.freeze) and explain in the README why immutability helps later|||Đóng băng đối tượng trả về (Object.freeze) và giải thích trong README vì sao tính bất biến có ích về sau",
      "Model one money or date rule correctly (integer VND, or UTC timestamps)|||Mô hình hoá đúng một luật về tiền hoặc ngày (VND số nguyên, hoặc mốc thời gian UTC)",
    ],
    datKhi: [
      "node scripts/try-model.js prints both accepted and rejected sample rows with readable messages|||node scripts/try-model.js in ra cả dòng được nhận và dòng bị từ chối với thông điệp dễ đọc",
      "At least 2 invalid inputs are rejected by the factories|||Ít nhất 2 đầu vào sai bị hàm tạo từ chối",
      "README lists the entities and the business rules you implemented|||README liệt kê các thực thể và luật nghiệp vụ đã cài",
    ],
    goiY: [
      "Start from the nouns of your feature list: each noun that has its own data is a candidate entity|||Bắt đầu từ danh từ trong danh sách tính năng: danh từ nào có dữ liệu riêng là ứng viên thực thể",
      "A business rule is a sentence with “must” or “cannot” in your feature list — turn each one into a function that returns true/false or throws|||Luật nghiệp vụ là câu có chữ “phải” hoặc “không được” trong danh sách tính năng — biến mỗi câu thành một hàm trả true/false hoặc ném lỗi",
      "Pass “now” as a parameter instead of calling new Date() inside the rule: the function becomes testable in Chapter 14|||Truyền “now” làm tham số thay vì gọi new Date() trong luật: hàm sẽ test được ở Chương 14",
    ],
    nop: ["repo"],
    bai: [L(1, "nodejs-1-3-object-tham-chieu"), L(1, "nodejs-1-4-bat-dong-bo"), L(1, "nodejs-1-5-module")],
  },
  {
    so: 2, slug: "nodejs-moc-2", sauChuong: "Chapter 2 — Inside the runtime|||Chương 2 — Bên trong runtime",
    ten: "Find what would block your event loop — and move it off|||Tìm thứ sẽ chặn event loop của bạn — và dời nó đi",
    lead: "Every topic has one heavy job: a report, an export, a big import, generating codes. Find yours, measure how long it freezes the loop, and move it to a worker thread.|||Đề tài nào cũng có một việc nặng: báo cáo, xuất tệp, nhập dữ liệu lớn, sinh mã. Tìm việc của bạn, đo nó đóng băng loop bao lâu, rồi dời nó sang worker thread.",
    yeuCau: [
      "Name the CPU-heavy job of your topic in the README and write a function for it over realistic data size|||Ghi tên việc nặng CPU của đề tài trong README và viết hàm cho nó với cỡ dữ liệu sát thực tế",
      "A script that measures how many timer ticks the loop misses while the job runs inline|||Một script đo số nhịp timer mà loop bỏ lỡ khi việc chạy trực tiếp",
      "The same job run in a worker_threads Worker, measured the same way|||Cùng việc đó chạy trong Worker của worker_threads, đo cùng cách",
      "A short paragraph: which other features of your app would freeze if the job stayed inline|||Một đoạn ngắn: tính năng nào khác trong app sẽ đứng hình nếu việc đó chạy trực tiếp",
    ],
    nangCao: [
      "Use perf_hooks.monitorEventLoopDelay and report p99 delay|||Dùng perf_hooks.monitorEventLoopDelay và báo độ trễ p99",
      "Show one case where splitting with setImmediate is enough and a worker is overkill|||Cho một trường hợp chia nhỏ bằng setImmediate là đủ, worker là thừa",
    ],
    datKhi: [
      "The inline run shows (almost) zero ticks; the worker run shows ticks continuing|||Bản chạy trực tiếp gần như 0 nhịp; bản chạy worker thấy nhịp vẫn chạy",
      "Both numbers are pasted in the README with the data size used|||Cả hai số được dán trong README kèm cỡ dữ liệu đã dùng",
    ],
    goiY: [
      "If nothing in your topic looks heavy, make the data realistic: a year of orders, every slot for every doctor, 100 000 books|||Nếu đề tài có vẻ không có gì nặng, làm dữ liệu sát thật: một năm đơn hàng, mọi slot của mọi bác sĩ, 100 000 cuốn sách",
      "A setInterval of 10 ms is a cheap stand-in for “other users’ requests”|||Một setInterval 10 ms là cách rẻ để đóng vai “request của người dùng khác”",
      "The worker receives input with workerData and answers with parentPort.postMessage — keep the function itself in a shared module|||Worker nhận đầu vào qua workerData và trả lời bằng parentPort.postMessage — giữ hàm ở một module dùng chung",
    ],
    nop: ["repo"],
    bai: [L(2, "nodejs-2-2-event-loop"), L(2, "nodejs-2-4-chan-event-loop"), L(2, "nodejs-2-5-worker-threads")],
  },
  {
    so: 3, slug: "nodejs-moc-3", sauChuong: "Chapter 3 — Core modules|||Chương 3 — Module lõi",
    ten: "A first server with no framework|||Server đầu tiên không framework",
    lead: "Serve your main resource with node:http only. It will feel clumsy on purpose: after this you will know exactly what Express does for you.|||Phục vụ tài nguyên chính chỉ bằng node:http. Nó sẽ hơi vụng về — cố ý thế: làm xong bạn biết chính xác Express làm gì cho mình.",
    yeuCau: [
      "node:http server with GET (list) and POST (create) for the main resource of your topic, JSON in and out|||Server node:http có GET (danh sách) và POST (tạo) cho tài nguyên chính của đề tài, nhận và trả JSON",
      "The request body read as a stream (for await over req), parsed safely|||Đọc body của request như một stream (for await trên req), phân tích an toàn",
      "Data persisted to a JSON file with fs/promises, surviving a restart|||Dữ liệu lưu vào tệp JSON bằng fs/promises, còn nguyên sau khi khởi động lại",
      "A JSON 404 for unknown routes and a 400 for invalid JSON|||Trả 404 dạng JSON cho tuyến lạ và 400 cho JSON hỏng",
      "One domain event emitted with EventEmitter and logged by a listener|||Một sự kiện nghiệp vụ phát bằng EventEmitter và được listener ghi log",
    ],
    nangCao: [
      "A streaming CSV export of the resource with pipeline()|||Xuất CSV dạng stream của tài nguyên bằng pipeline()",
      "Reject bodies larger than 100 KB with 413|||Từ chối body lớn hơn 100 KB bằng 413",
    ],
    datKhi: [
      "curl -i output for create, list, 404 and bad JSON is pasted in the README|||Output curl -i cho tạo, danh sách, 404 và JSON hỏng được dán trong README",
      "Restart the server: the data created before is still listed|||Khởi động lại server: dữ liệu tạo trước đó vẫn còn trong danh sách",
    ],
    goiY: [
      "Wrap JSON.parse in try/catch — one bad body must not crash the process|||Bọc JSON.parse trong try/catch — một body hỏng không được làm sập tiến trình",
      "A tiny send(res, status, data) helper removes most of the repetition|||Một hàm nhỏ send(res, status, data) bỏ được phần lớn sự lặp lại",
      "Concurrent writes to one JSON file can lose data — write it down as a known limitation; Chapter 7 fixes it with a database|||Ghi đồng thời vào một tệp JSON có thể mất dữ liệu — ghi lại như một giới hạn đã biết; Chương 7 sửa bằng cơ sở dữ liệu",
    ],
    nop: ["repo"],
    bai: [L(3, "nodejs-3-1-path-fs"), L(3, "nodejs-3-3-stream"), L(3, "nodejs-3-4-eventemitter"), L(3, "nodejs-3-5-http-server")],
  },
  {
    so: 4, slug: "nodejs-moc-4", sauChuong: "Chapter 4 — npm and project hygiene|||Chương 4 — npm và vệ sinh dự án",
    ten: "A project anyone can clone and run|||Dự án ai clone về cũng chạy được",
    lead: "Turn the folder into a real Node project: scripts, a lockfile, ignored secrets and a reviewed dependency list. From now on every milestone must pass npm run check.|||Biến thư mục thành một dự án Node thật: script, lockfile, bí mật được bỏ qua và danh sách phụ thuộc đã soát. Từ giờ mọi mốc phải qua npm run check.",
    yeuCau: [
      "package.json with type module, engines node ≥ 22, scripts dev / start / test / check|||package.json có type module, engines node ≥ 22, script dev / start / test / check",
      "package-lock.json committed; installs done with npm ci in instructions|||Commit package-lock.json; hướng dẫn cài bằng npm ci",
      ".gitignore covers node_modules and .env; .env.example documents every variable|||.gitignore che node_modules và .env; .env.example ghi đủ mọi biến",
      "npm audit run and its result noted; every dependency justified in one line in the README|||Chạy npm audit và ghi kết quả; mỗi phụ thuộc có một dòng lý do trong README",
    ],
    nangCao: [
      "A pre-commit check (husky or a simple git hook) that runs npm run check|||Một bước kiểm trước commit (husky hoặc git hook đơn giản) chạy npm run check",
      "Explain one caret range in your package.json and what npm ci does with it|||Giải thích một khoảng ^ trong package.json và npm ci làm gì với nó",
    ],
    datKhi: [
      "A fresh clone runs npm ci && npm run check without errors|||Một bản clone mới chạy npm ci && npm run check không lỗi",
      "git check-ignore -v .env prints the .gitignore rule; git log has never contained .env|||git check-ignore -v .env in ra luật trong .gitignore; lịch sử git chưa từng chứa .env",
    ],
    goiY: [
      "node --env-file=.env loads variables without any dotenv package on Node 22|||node --env-file=.env nạp biến mà không cần gói dotenv trên Node 22",
      "If .env was ever committed, removing it is not enough: rotate the values|||Nếu .env từng bị commit, xoá đi là chưa đủ: phải đổi giá trị",
      "Fewer dependencies = fewer things to audit; Node 22 has fetch, test runner and watch mode built in|||Ít phụ thuộc = ít thứ phải soát; Node 22 có sẵn fetch, test runner và chế độ watch",
    ],
    nop: ["repo"],
    bai: [L(4, "nodejs-4-1-package-json"), L(4, "nodejs-4-2-semver-lockfile"), L(4, "nodejs-4-3-bao-mat-npm")],
  },
  {
    so: 5, slug: "nodejs-moc-5", sauChuong: "Chapter 5 — Express|||Chương 5 — Express",
    ten: "Port to Express: routers, middleware, one error shape|||Chuyển sang Express: router, middleware, một dạng lỗi",
    lead: "Rewrite the server of milestone 3 in Express 5 and organise it the way it will stay: one router per resource, a logging middleware, and a single place that turns every error into the same JSON.|||Viết lại server của mốc 3 bằng Express 5 và tổ chức theo cách nó sẽ giữ mãi: mỗi tài nguyên một router, một middleware ghi log, và một chỗ duy nhất biến mọi lỗi thành cùng một dạng JSON.",
    yeuCau: [
      "Express 5 app built in src/app.js, started in src/server.js|||App Express 5 dựng trong src/app.js, chạy trong src/server.js",
      "One express.Router per resource of your topic (at least 2 resources)|||Mỗi tài nguyên của đề tài một express.Router (ít nhất 2 tài nguyên)",
      "Logging middleware: method, original URL, status, duration|||Middleware ghi log: method, URL gốc, mã trạng thái, thời gian",
      "404 handler and one error middleware: every error is { error: { code, message } }, 500s never leak internals|||Handler 404 và một middleware lỗi: mọi lỗi có dạng { error: { code, message } }, lỗi 500 không lộ chi tiết bên trong",
      "An async handler that throws reaches the error middleware (no hanging request)|||Một handler async ném lỗi đi tới middleware lỗi (không treo request)",
    ],
    nangCao: [
      "A small HttpError class with status and code used by every route|||Một lớp HttpError nhỏ có status và code dùng ở mọi tuyến",
      "Middleware that adds an x-response-time header|||Middleware thêm header x-response-time",
    ],
    datKhi: [
      "curl shows the same error shape for 404 of a route, 404 of a record and a thrown 500|||curl cho thấy cùng một dạng lỗi cho 404 tuyến, 404 bản ghi và 500 bị ném",
      "The log line shows the full path (/plants/1, not /1) for routes inside routers|||Dòng log hiện đủ đường dẫn (/plants/1, không phải /1) với tuyến nằm trong router",
    ],
    goiY: [
      "Inside a router req.url is relative to the mount point — log req.originalUrl|||Trong router req.url là tương đối với chỗ gắn — hãy log req.originalUrl",
      "The error middleware must have 4 parameters (err, req, res, next) or Express will not treat it as one|||Middleware lỗi phải có đủ 4 tham số (err, req, res, next), không thì Express không coi nó là middleware lỗi",
      "Export the app without calling listen: Chapter 14 tests will import it directly|||Export app mà không gọi listen: test ở Chương 14 sẽ import thẳng nó",
    ],
    nop: ["repo"],
    bai: [L(5, "nodejs-5-2-dinh-tuyen"), L(5, "nodejs-5-3-middleware"), L(5, "nodejs-5-4-xu-ly-loi")],
  },
  {
    so: 6, slug: "nodejs-moc-6", sauChuong: "Chapter 6 — Designing a REST API|||Chương 6 — Thiết kế REST API",
    ten: "A real REST contract: CRUD, status codes, validation, paging|||Một hợp đồng REST thật: CRUD, mã trạng thái, kiểm dữ liệu, phân trang",
    lead: "Design the API of your topic as if a frontend team were waiting for it: every route, every status code and every error documented, every input validated by a schema.|||Thiết kế API của đề tài như thể một nhóm frontend đang chờ: mọi tuyến, mọi mã trạng thái, mọi lỗi đều được ghi lại, mọi đầu vào được kiểm bằng schema.",
    yeuCau: [
      "Full CRUD for the main resource plus one sub-resource (e.g. /doctors/:id/slots)|||CRUD đầy đủ cho tài nguyên chính và một tài nguyên con (vd /doctors/:id/slots)",
      "Correct codes: 201 + Location on create, 204 on delete, 400 validation, 404, 409 for a business conflict of your topic|||Mã đúng: 201 + Location khi tạo, 204 khi xoá, 400 khi sai dữ liệu, 404, 409 cho một xung đột nghiệp vụ của đề tài",
      "Every body and query validated with a schema (zod or similar); validation errors list the failing fields|||Mọi body và query được kiểm bằng schema (zod hoặc tương tự); lỗi kiểm liệt kê các trường sai",
      "List endpoint with pagination, one filter and sorting; response has items + meta|||Tuyến danh sách có phân trang, một bộ lọc và sắp xếp; phản hồi có items + meta",
      "API table in the README (method, path, body, success code, error codes)|||Bảng API trong README (method, đường dẫn, body, mã thành công, mã lỗi)",
    ],
    nangCao: [
      "Idempotency-Key on the one POST that must not run twice in your topic|||Idempotency-Key cho POST duy nhất không được chạy hai lần trong đề tài",
      "An OpenAPI file and a Swagger UI page|||Một tệp OpenAPI và trang Swagger UI",
    ],
    datKhi: [
      "A curl or HTTP-file session in the repo exercises every route including each error code|||Một phiên curl hoặc tệp .http trong repo gọi mọi tuyến kể cả từng mã lỗi",
      "An invalid body returns 400 listing every wrong field at once|||Body sai trả 400 liệt kê mọi trường sai cùng lúc",
      "page beyond the end returns an empty list, not an error|||page vượt quá cuối trả danh sách rỗng, không phải lỗi",
    ],
    goiY: [
      "Decide the conflict of your topic first (slot taken, sold out, copy on loan) — that is your 409|||Chốt xung đột của đề tài trước (slot đã có người, hết món, sách đang mượn) — đó là mã 409",
      "z.coerce.number() turns ?page=2 (a string) into a number; set defaults and a max limit|||z.coerce.number() đổi ?page=2 (chuỗi) thành số; đặt mặc định và giới hạn tối đa",
      "Never return the internal object as is; shape the response so you can change the database later|||Đừng trả thẳng đối tượng bên trong; định hình phản hồi để sau này đổi cơ sở dữ liệu được",
    ],
    nop: ["repo"],
    bai: [L(6, "nodejs-6-2-ma-trang-thai"), L(6, "nodejs-6-3-validate-schema"), L(6, "nodejs-6-4-phan-trang"), L(6, "nodejs-6-5-hop-dong-api")],
  },
  {
    so: 7, slug: "nodejs-moc-7", sauChuong: "Chapter 7 — PostgreSQL and Prisma|||Chương 7 — PostgreSQL và Prisma",
    ten: "A real database: schema, migrations, one transaction|||Cơ sở dữ liệu thật: schema, migration, một transaction",
    lead: "Replace the JSON file with PostgreSQL through Prisma, keeping the API contract of milestone 6 unchanged. The database now enforces the rules your code used to hope for.|||Thay tệp JSON bằng PostgreSQL qua Prisma, giữ nguyên hợp đồng API của mốc 6. Giờ cơ sở dữ liệu ép các luật mà trước đây mã chỉ mong là đúng.",
    yeuCau: [
      "At least 3 related models with foreign keys and the right onDelete behaviour|||Ít nhất 3 model có quan hệ với khoá ngoại và hành vi onDelete phù hợp",
      "Constraints that encode your rules: unique where duplicates are a bug (e.g. one ticket per seat)|||Ràng buộc mã hoá luật của bạn: unique ở chỗ trùng lặp là lỗi (vd một vé cho một ghế)",
      "Migrations committed in prisma/migrations; a seed script with realistic sample data|||Migration được commit trong prisma/migrations; script seed có dữ liệu mẫu sát thật",
      "The key business action of your topic runs in one transaction|||Hành động nghiệp vụ chính của đề tài chạy trong một transaction",
      "The main list query uses an index; EXPLAIN ANALYZE before/after pasted in the README|||Truy vấn danh sách chính dùng chỉ mục; EXPLAIN ANALYZE trước/sau dán trong README",
    ],
    nangCao: [
      "Show and fix one N+1 query with include/select|||Chỉ ra và sửa một truy vấn N+1 bằng include/select",
      "Map a unique-constraint error (P2002) to your 409|||Ánh xạ lỗi ràng buộc unique (P2002) thành mã 409 của bạn",
    ],
    datKhi: [
      "npx prisma migrate deploy on an empty database + seed gives a working API|||npx prisma migrate deploy trên cơ sở dữ liệu trống + seed cho ra API chạy được",
      "Two parallel requests cannot break your key rule (shown with a small script)|||Hai request song song không phá được luật chính (chứng minh bằng script nhỏ)",
      "The milestone 6 curl session still passes unchanged|||Phiên curl của mốc 6 vẫn qua mà không sửa",
    ],
    goiY: [
      "Draw the tables on paper first; every “has many” in your feature list is a foreign key|||Vẽ các bảng ra giấy trước; mỗi chữ “có nhiều” trong danh sách tính năng là một khoá ngoại",
      "A unique constraint beats a check in code: the database wins every race|||Ràng buộc unique thắng phép kiểm trong mã: cơ sở dữ liệu thắng mọi cuộc đua",
      "Run Postgres locally with docker compose up -d postgres or a local install — never the production database|||Chạy Postgres cục bộ bằng docker compose up -d postgres hoặc cài trên máy — không bao giờ dùng cơ sở dữ liệu production",
    ],
    nop: ["repo", "anh"],
    bai: [L(7, "nodejs-7-2-luoc-do-va-migration"), L(7, "nodejs-7-3-crud-transaction"), L(7, "nodejs-7-4-quan-he-va-n-plus-1"), L(7, "nodejs-7-5-chi-muc-va-explain")],
  },
  {
    so: 8, slug: "nodejs-moc-8", sauChuong: "Chapter 8 — Authentication and authorization|||Chương 8 — Xác thực và phân quyền",
    ten: "Accounts, sessions and who may do what|||Tài khoản, phiên đăng nhập và ai được làm gì",
    lead: "Add real users to your topic: hashed passwords, short-lived access tokens with rotating refresh tokens, roles, and — the part most student projects forget — ownership checked on the server for every record.|||Thêm người dùng thật vào đề tài: mật khẩu băm, access token ngắn hạn cùng refresh token xoay vòng, vai trò, và — phần đồ án sinh viên hay quên nhất — kiểm quyền sở hữu ở máy chủ cho từng bản ghi.",
    yeuCau: [
      "Register and login; passwords hashed with bcrypt (cost ≥ 12) or argon2|||Đăng ký và đăng nhập; mật khẩu băm bằng bcrypt (cost ≥ 12) hoặc argon2",
      "Access token ≤ 15 min; refresh token in an HttpOnly cookie, rotated on use, revoked on logout|||Access token ≤ 15 phút; refresh token trong cookie HttpOnly, xoay vòng khi dùng, thu hồi khi đăng xuất",
      "requireAuth middleware → 401; at least 2 roles of your topic → 403|||Middleware requireAuth → 401; ít nhất 2 vai trò của đề tài → 403",
      "Every route that reads or changes one record checks that the record belongs to (or is visible to) the caller|||Mọi tuyến đọc hoặc sửa một bản ghi đều kiểm bản ghi thuộc về (hoặc được phép thấy bởi) người gọi",
    ],
    nangCao: [
      "Detect refresh-token reuse and revoke the whole family|||Phát hiện refresh token bị dùng lại và thu hồi cả họ token",
      "Email verification or password reset with a single-use token|||Xác thực email hoặc đặt lại mật khẩu bằng token dùng một lần",
    ],
    datKhi: [
      "No token → 401, wrong role → 403, someone else’s record → 403 or 404, own record → 2xx (curl output pasted)|||Không token → 401, sai vai trò → 403, bản ghi của người khác → 403 hoặc 404, bản ghi của mình → 2xx (dán output curl)",
      "The users table shows only hashes; the JWT secret comes from the environment|||Bảng users chỉ có giá trị băm; khoá JWT lấy từ biến môi trường",
      "A used refresh token cannot be used again|||Refresh token đã dùng không dùng lại được",
    ],
    goiY: [
      "Put the user id in the token (sub) and read the owner from the DATABASE, never from the request body|||Đặt id người dùng trong token (sub) và đọc chủ sở hữu từ CƠ SỞ DỮ LIỆU, không bao giờ từ body request",
      "404 instead of 403 for others’ records hides that the record exists — choose one and be consistent|||Trả 404 thay vì 403 cho bản ghi người khác giấu việc bản ghi tồn tại — chọn một và nhất quán",
      "Store a hash of the refresh token, not the token itself|||Lưu giá trị băm của refresh token, không lưu chính token",
    ],
    nop: ["repo"],
    bai: [L(8, "nodejs-8-1-mat-khau-va-bam"), L(8, "nodejs-8-2-jwt-access-refresh"), L(8, "nodejs-8-3-requireauth-phan-quyen"), L(8, "nodejs-8-4-cookie-csrf-thu-hoi")],
  },
  {
    so: 9, slug: "nodejs-moc-9", sauChuong: "Chapter 9 — Application security|||Chương 9 — Bảo mật ứng dụng",
    ten: "Attack your own API, then close the holes|||Tự tấn công API của mình, rồi bịt lỗ",
    lead: "Play the attacker against your project for an hour with a checklist, write down what worked, then fix it. A security section in the README with real findings is worth more than any badge.|||Đóng vai kẻ tấn công dự án của mình một giờ theo danh sách, ghi lại thứ gì lọt, rồi sửa. Một mục bảo mật trong README với phát hiện thật đáng giá hơn mọi huy hiệu.",
    yeuCau: [
      "helmet (or equivalent headers) and a CORS allow-list — never * with credentials|||helmet (hoặc header tương đương) và danh sách CORS cho phép — không bao giờ * khi có credentials",
      "Rate limits on login and on the most expensive route of your topic; body size limit|||Giới hạn tần suất ở đăng nhập và tuyến tốn kém nhất của đề tài; giới hạn cỡ body",
      "User-written text is never rendered as HTML unescaped; any rich text is sanitised|||Chữ người dùng viết không bao giờ hiện như HTML chưa thoát; mọi văn bản định dạng đều được làm sạch",
      "Configuration validated at start-up (missing secret ⇒ refuse to start); errors and logs never contain secrets or stack traces for clients|||Kiểm cấu hình lúc khởi động (thiếu khoá ⇒ không chạy); lỗi và log không bao giờ chứa bí mật hay stack trace cho client",
      "SECURITY.md: what you tried (IDOR, mass assignment, injection, XSS, brute force) and the result|||SECURITY.md: những gì bạn đã thử (IDOR, mass assignment, injection, XSS, dò mật khẩu) và kết quả",
    ],
    nangCao: [
      "A Content-Security-Policy that you tested with a real injected script|||Một Content-Security-Policy đã thử bằng một script chèn thật",
      "gitleaks or a similar scan in CI|||gitleaks hoặc công cụ quét tương tự trong CI",
    ],
    datKhi: [
      "The 6th login attempt within the window gets 429; a 1 MB body gets 413|||Lần đăng nhập thứ 6 trong cửa sổ nhận 429; body 1 MB nhận 413",
      "Sending role or ownerId in a create/update body changes nothing (mass assignment blocked)|||Gửi role hoặc ownerId trong body tạo/sửa không đổi được gì (chặn mass assignment)",
      "SECURITY.md lists at least 5 attacks tried, with result and fix|||SECURITY.md liệt kê ít nhất 5 kiểu tấn công đã thử, kết quả và cách sửa",
    ],
    goiY: [
      "Validation schemas are allow-lists: fields not in the schema are dropped — that is your mass-assignment defence|||Schema kiểm dữ liệu là danh sách cho phép: trường ngoài schema bị bỏ — đó là phòng tuyến chống mass assignment",
      "Log in with a second account and replay requests of the first with its ids — that is the IDOR test|||Đăng nhập tài khoản thứ hai rồi gửi lại request của tài khoản đầu với id của nó — đó là phép thử IDOR",
      "Rate limit by account AND by IP for login; by user for business routes|||Giới hạn đăng nhập theo tài khoản VÀ theo IP; tuyến nghiệp vụ theo người dùng",
    ],
    nop: ["repo"],
    bai: [L(9, "nodejs-9-1-header-csp-cors"), L(9, "nodejs-9-2-xss-va-sanitize"), L(9, "nodejs-9-3-dau-vao-doc-hai"), L(9, "nodejs-9-4-bi-mat-va-phu-thuoc")],
  },
  {
    so: 10, slug: "nodejs-moc-10", sauChuong: "Chapter 10 — File upload and object storage|||Chương 10 — Upload file và object storage",
    ten: "One upload feature, done safely|||Một tính năng upload, làm an toàn",
    lead: "Add the one file your topic needs — a photo, a document, a poster — through presigned URLs to S3-compatible storage, checking what the file really is rather than what it claims to be.|||Thêm đúng loại tệp đề tài cần — ảnh, tài liệu, poster — qua presigned URL lên kho tương thích S3, kiểm tệp thật sự là gì thay vì nó tự nhận là gì.",
    yeuCau: [
      "An endpoint that issues a short-lived presigned upload URL only to an authorised user|||Một tuyến cấp presigned URL tải lên ngắn hạn chỉ cho người dùng có quyền",
      "Local development against MinIO or a sandbox, never the production bucket|||Phát triển cục bộ với MinIO hoặc sandbox, không bao giờ với bucket production",
      "Allowed types decided by magic bytes, a size limit, and a server-generated object key|||Kiểu tệp cho phép quyết định bằng magic bytes, có giới hạn cỡ, và key đối tượng do máy chủ sinh",
      "The database stores the object key and metadata, not a full URL|||Cơ sở dữ liệu lưu key và metadata, không lưu URL đầy đủ",
      "Private files served through short-lived signed GET URLs; public ones with long cache headers|||Tệp riêng tư phục vụ qua URL GET ký ngắn hạn; tệp công khai có header cache dài",
    ],
    nangCao: [
      "Generate a WebP thumbnail in a background step|||Sinh ảnh thu nhỏ WebP ở bước nền",
      "Delete orphaned objects when the record is deleted|||Xoá đối tượng mồ côi khi bản ghi bị xoá",
    ],
    datKhi: [
      "A script renamed to .png is rejected; a real image is accepted|||Một script đổi tên thành .png bị từ chối; ảnh thật được nhận",
      "Another user cannot get a URL for your private file|||Người dùng khác không lấy được URL cho tệp riêng tư của bạn",
    ],
    goiY: [
      "With presigned URLs the bytes never pass through your Node process — your RAM stays flat|||Với presigned URL các byte không đi qua tiến trình Node — RAM của bạn đứng yên",
      "Never build the key from the original file name: random id + extension from the detected type|||Đừng dựng key từ tên tệp gốc: id ngẫu nhiên + đuôi lấy từ kiểu đã phát hiện",
      "Check the object after upload (HEAD + first bytes) before marking it ready|||Kiểm đối tượng sau khi tải lên (HEAD + vài byte đầu) trước khi đánh dấu sẵn sàng",
    ],
    nop: ["repo", "anh"],
    bai: [L(10, "nodejs-10-1-nhan-file-multipart"), L(10, "nodejs-10-2-object-storage-presigned"), L(10, "nodejs-10-3-kiem-file-that"), L(10, "nodejs-10-4-phuc-vu-media-cache")],
  },
  {
    so: 11, slug: "nodejs-moc-11", sauChuong: "Chapter 11 — Realtime|||Chương 11 — Realtime",
    ten: "One realtime feature, authorised|||Một tính năng realtime, có phân quyền",
    lead: "Pick the one moment in your topic where waiting for a refresh hurts — a new order in the kitchen, a seat taken, an issue moved — and push it live with Socket.IO, authenticated once and authorised on every action.|||Chọn đúng khoảnh khắc trong đề tài mà chờ tải lại là khó chịu — đơn mới vào bếp, ghế bị giữ, issue bị kéo — và đẩy nó trực tiếp bằng Socket.IO, xác thực một lần và phân quyền ở mọi hành động.",
    yeuCau: [
      "Socket.IO server sharing the HTTP server of the API|||Server Socket.IO dùng chung HTTP server của API",
      "Handshake authentication with the same tokens as the REST API; bad token ⇒ connection refused|||Xác thực lúc bắt tay bằng chính token của REST API; token sai ⇒ từ chối kết nối",
      "Rooms per entity of your topic; joining a room checks permission on the server|||Phòng theo thực thể của đề tài; vào phòng phải qua kiểm quyền ở máy chủ",
      "Events emitted only after the database change commits|||Sự kiện chỉ được phát sau khi thay đổi trong cơ sở dữ liệu đã commit",
      "The client re-fetches state after a reconnect (no missed updates)|||Client tải lại trạng thái sau khi kết nối lại (không lỡ cập nhật)",
    ],
    nangCao: [
      "Redis adapter so two API processes broadcast to each other|||Redis adapter để hai tiến trình API phát cho nhau",
      "Throttle a chatty event (e.g. typing or live counters)|||Giảm nhịp một sự kiện ồn (vd đang gõ hoặc bộ đếm trực tiếp)",
    ],
    datKhi: [
      "A forged token is refused; a user without access cannot join the room|||Token giả bị từ chối; người không có quyền không vào được phòng",
      "Two browser windows: the change in one appears in the other within a second|||Hai cửa sổ trình duyệt: thay đổi ở một bên hiện ở bên kia trong vòng một giây",
    ],
    goiY: [
      "Authentication happens once in io.use; authorisation happens in every handler|||Xác thực làm một lần trong io.use; phân quyền làm ở mọi handler",
      "Use acknowledgements (emitWithAck) so the client knows a join was refused|||Dùng acknowledgement (emitWithAck) để client biết việc vào phòng bị từ chối",
      "Treat the socket as a hint to refresh, the REST API as the source of truth|||Coi socket là tín hiệu để tải lại, REST API là nguồn sự thật",
    ],
    nop: ["repo", "demo"],
    bai: [L(11, "nodejs-11-1-websocket-co-ban"), L(11, "nodejs-11-2-ws-vs-socketio-rooms"), L(11, "nodejs-11-3-xac-thuc-phan-quyen-socket"), L(11, "nodejs-11-4-scale-adapter-backpressure")],
  },
  {
    so: 12, slug: "nodejs-moc-12", sauChuong: "Chapter 12 — Redis|||Chương 12 — Redis",
    ten: "Cache one hot read and guard one rule with Redis|||Cache một lượt đọc nóng và giữ một luật bằng Redis",
    lead: "Measure the read your users hit most, cache it with a TTL and correct invalidation, then use Redis’s atomic commands for one rule of your topic: a rate limit, a lock, or a timed hold.|||Đo lượt đọc người dùng gọi nhiều nhất, cache nó có TTL và xoá cache đúng lúc, rồi dùng lệnh nguyên tử của Redis cho một luật của đề tài: giới hạn tần suất, khoá, hoặc giữ chỗ có hạn.",
    yeuCau: [
      "Cache-aside on one read endpoint with a TTL on every key|||Cache-aside cho một tuyến đọc, mọi khoá đều có TTL",
      "Invalidation on every write that changes that data (list them in the README)|||Xoá cache ở mọi thao tác ghi làm đổi dữ liệu đó (liệt kê trong README)",
      "One business rule enforced atomically in Redis (INCR+EXPIRE, SET NX EX, or a Lua script)|||Một luật nghiệp vụ được ép nguyên tử trong Redis (INCR+EXPIRE, SET NX EX, hoặc script Lua)",
      "Latency before/after the cache measured and pasted|||Đo độ trễ trước/sau khi có cache và dán kết quả",
      "The API still works (slower) when Redis is down|||API vẫn chạy (chậm hơn) khi Redis sập",
    ],
    nangCao: [
      "Protect against a stampede when a popular key expires|||Chống bùng tải khi một khoá phổ biến hết hạn",
      "Keys named with a prefix and version (app:v1:...)|||Đặt tên khoá có tiền tố và phiên bản (app:v1:...)",
    ],
    datKhi: [
      "Second read is served from Redis (database call counter does not move)|||Lượt đọc thứ hai lấy từ Redis (bộ đếm gọi cơ sở dữ liệu không tăng)",
      "After an update the next read shows the new value|||Sau khi cập nhật, lượt đọc kế tiếp hiện giá trị mới",
      "The atomic rule holds when 20 requests arrive at once|||Luật nguyên tử vẫn đúng khi 20 request tới cùng lúc",
    ],
    goiY: [
      "Cache what is read often and changed rarely; do not cache per-user data you cannot invalidate|||Cache thứ được đọc nhiều và ít đổi; đừng cache dữ liệu theo người dùng mà bạn không xoá được",
      "GET then SET is two commands — another request can sneak in between; use one atomic command|||GET rồi SET là hai lệnh — request khác có thể chen vào giữa; dùng một lệnh nguyên tử",
      "Wrap Redis calls so an error falls back to the database instead of failing the request|||Bọc lệnh Redis để khi lỗi thì rơi về cơ sở dữ liệu thay vì làm hỏng request",
    ],
    nop: ["repo"],
    bai: [L(12, "nodejs-12-2-cache-aside"), L(12, "nodejs-12-3-cau-truc-du-lieu"), L(12, "nodejs-12-4-nguyen-tu-rate-limit-lock")],
  },
  {
    so: 13, slug: "nodejs-moc-13", sauChuong: "Chapter 13 — Background jobs and queues|||Chương 13 — Tác vụ nền và hàng đợi",
    ten: "Move slow work to a queue that survives failure|||Dời việc chậm sang hàng đợi chịu được lỗi",
    lead: "Emails, reports, reminders and clean-ups do not belong in a request. Put them in a BullMQ queue with retries, make them idempotent so a retry never repeats the effect, and schedule the recurring one.|||Email, báo cáo, nhắc nhở và dọn dẹp không thuộc về một request. Đưa chúng vào hàng đợi BullMQ có thử lại, làm chúng idempotent để thử lại không bao giờ lặp tác dụng, và lên lịch việc định kỳ.",
    yeuCau: [
      "At least one job of your topic enqueued from an API action, processed by a separate worker process|||Ít nhất một job của đề tài được đẩy vào hàng đợi từ một hành động API, xử lý bởi tiến trình worker riêng",
      "attempts + exponential backoff; failed jobs kept and visible|||attempts + backoff luỹ thừa; job lỗi được giữ lại và xem được",
      "Idempotency: a deterministic jobId or a unique record so a retry cannot send/charge twice|||Idempotent: jobId cố định hoặc bản ghi unique để thử lại không gửi/trừ hai lần",
      "One repeatable (cron) job of your topic, e.g. nightly clean-up or morning digest|||Một job lặp lại (cron) của đề tài, vd dọn dẹp ban đêm hoặc tóm tắt buổi sáng",
      "The worker shuts down gracefully (finishes the current job)|||Worker tắt êm (làm xong job đang chạy)",
    ],
    nangCao: [
      "A dashboard (Bull Board) behind admin auth|||Một bảng theo dõi (Bull Board) sau lớp xác thực admin",
      "Transactional outbox so a job is never lost when the request commits|||Transactional outbox để job không bao giờ mất khi request đã commit",
    ],
    datKhi: [
      "Kill the worker in the middle of a job: after restart the job completes exactly once|||Giết worker giữa chừng một job: khởi động lại thì job hoàn thành đúng một lần",
      "The API answers in milliseconds while the job takes seconds|||API trả lời trong vài mili giây dù job mất vài giây",
    ],
    goiY: [
      "Put only ids in the job data and read fresh data in the worker|||Chỉ đặt id trong dữ liệu job và đọc dữ liệu mới trong worker",
      "Build the jobId from what makes the effect unique: remind-<appointmentId>-<date>|||Dựng jobId từ thứ làm tác dụng là duy nhất: remind-<appointmentId>-<date>",
      "Test the failure path on purpose: throw on the first two attempts|||Cố ý thử nhánh lỗi: ném lỗi ở hai lần đầu",
    ],
    nop: ["repo"],
    bai: [L(13, "nodejs-13-2-bullmq-co-ban"), L(13, "nodejs-13-3-thu-lai-va-idempotent"), L(13, "nodejs-13-4-lich-trinh"), L(13, "nodejs-13-5-worker-chet-va-van-hanh")],
  },
  {
    so: 14, slug: "nodejs-moc-14", sauChuong: "Chapter 14 — Testing|||Chương 14 — Kiểm thử",
    ten: "Tests that would catch your real bugs, running in CI|||Test bắt được lỗi thật của bạn, chạy trong CI",
    lead: "Write the tests that protect the rules of your topic and the security checks of milestone 8 — the things that would hurt users if they broke — and make GitHub Actions run them on every push.|||Viết test bảo vệ luật của đề tài và các phép kiểm quyền của mốc 8 — những thứ hỏng là người dùng chịu thiệt — và cho GitHub Actions chạy chúng ở mỗi lần push.",
    yeuCau: [
      "At least 15 tests in total with node:test (or Vitest/Jest)|||Tổng cộng ít nhất 15 test bằng node:test (hoặc Vitest/Jest)",
      "Unit tests for every business rule of milestone 1, including the edge cases (exact boundary, empty, maximum)|||Unit test cho mọi luật nghiệp vụ của mốc 1, kể cả ca biên (đúng biên, rỗng, tối đa)",
      "HTTP tests with supertest for 201/400/401/403/404/409 of your main routes|||Test HTTP bằng supertest cho 201/400/401/403/404/409 của các tuyến chính",
      "At least 3 tests against a real test database (reset between tests)|||Ít nhất 3 test chạy trên cơ sở dữ liệu test thật (làm sạch giữa các test)",
      "A GitHub Actions workflow running lint + tests with a Postgres service; badge in README|||Workflow GitHub Actions chạy lint + test với service Postgres; huy hiệu trong README",
    ],
    nangCao: [
      "A concurrency test for your key rule (two requests at once)|||Một test đồng thời cho luật chính (hai request cùng lúc)",
      "Coverage report and an explanation of one uncovered branch|||Báo cáo độ phủ và giải thích một nhánh chưa phủ",
    ],
    datKhi: [
      "CI is green on main; breaking one rule on purpose turns it red|||CI xanh trên main; cố ý làm hỏng một luật thì CI đỏ",
      "No test depends on another test’s data or on the order they run in|||Không test nào phụ thuộc dữ liệu của test khác hay thứ tự chạy",
    ],
    goiY: [
      "Export a buildApp() function: each test gets a fresh app and fresh fakes|||Export một hàm buildApp(): mỗi test có app mới và đồ giả mới",
      "Pass the clock in (now) instead of mocking Date globally|||Truyền đồng hồ vào (now) thay vì giả lập Date toàn cục",
      "A test that never fails is not a test — watch each new test fail once|||Test không bao giờ đỏ thì không phải test — nhìn mỗi test mới đỏ một lần",
    ],
    nop: ["repo"],
    bai: [L(14, "nodejs-14-2-unit-test"), L(14, "nodejs-14-3-supertest"), L(14, "nodejs-14-4-db-that"), L(14, "nodejs-14-5-do-phu-flaky-ci")],
  },
  {
    so: 15, slug: "nodejs-moc-15", sauChuong: "Chapter 15 — Logging and observability|||Chương 15 — Log và quan sát hệ thống",
    ten: "See inside your running app|||Nhìn được bên trong app đang chạy",
    lead: "When something breaks after the demo you will not have a debugger — only logs, metrics and health checks. Add them now, with one request id that follows a user action through every layer.|||Khi có gì hỏng sau buổi demo bạn sẽ không có debugger — chỉ có log, metric và health check. Thêm chúng ngay bây giờ, với một request id đi theo hành động của người dùng qua mọi tầng.",
    yeuCau: [
      "Structured JSON logs (pino) with level, time, request id; no passwords, tokens or personal IDs|||Log JSON có cấu trúc (pino) có level, thời gian, request id; không mật khẩu, token hay số định danh cá nhân",
      "The request id is returned in a response header and passed into jobs|||Request id được trả trong header phản hồi và truyền vào job",
      "/metrics with an HTTP latency histogram labelled by route TEMPLATE and one business metric of your topic|||/metrics có histogram độ trễ HTTP gắn nhãn theo MẪU tuyến và một metric nghiệp vụ của đề tài",
      "/healthz (process alive) and /readyz (database and Redis reachable)|||/healthz (tiến trình sống) và /readyz (cơ sở dữ liệu và Redis kết nối được)",
      "One alert rule written down: what number, which threshold, who is woken|||Một luật cảnh báo viết rõ: con số nào, ngưỡng nào, ai bị đánh thức",
    ],
    nangCao: [
      "OpenTelemetry tracing for one slow route|||Tracing OpenTelemetry cho một tuyến chậm",
      "A Grafana dashboard screenshot from your own metrics|||Ảnh dashboard Grafana từ chính metric của bạn",
    ],
    datKhi: [
      "Given a request id from a response header you can find every log line of that request|||Có request id từ header phản hồi, bạn tìm được mọi dòng log của request đó",
      "/readyz turns 503 when the database is stopped|||/readyz chuyển 503 khi tắt cơ sở dữ liệu",
    ],
    goiY: [
      "Label with req.route.path (/plants/:id), never the raw URL — every id would create a new time series|||Gắn nhãn bằng req.route.path (/plants/:id), không bao giờ URL thô — mỗi id sẽ tạo ra một chuỗi thời gian mới",
      "Use pino redact paths for authorization headers and password fields|||Dùng redact của pino cho header authorization và trường mật khẩu",
      "Health checks must be cheap; readiness may touch dependencies, liveness must not|||Health check phải rẻ; readiness được chạm vào phụ thuộc, liveness thì không",
    ],
    nop: ["repo", "anh"],
    bai: [L(15, "nodejs-15-1-log-co-cau-truc"), L(15, "nodejs-15-2-request-id"), L(15, "nodejs-15-4-metrics-prometheus"), L(15, "nodejs-15-6-health-check-canh-bao")],
  },
  {
    so: 16, slug: "nodejs-moc-16", sauChuong: "Chapter 16 — Performance|||Chương 16 — Hiệu năng",
    ten: "Measure, find the bottleneck, fix one thing|||Đo, tìm nút thắt, sửa một chỗ",
    lead: "Load-test the two routes that matter most in your topic, profile the slower one, and make exactly one change backed by before/after numbers. Guessing is not allowed.|||Đo tải hai tuyến quan trọng nhất của đề tài, profile tuyến chậm hơn, và làm đúng một thay đổi có số đo trước/sau. Không được đoán.",
    yeuCau: [
      "Load test (autocannon or k6) of 2 key routes with realistic data volume; req/s, p50, p99 recorded|||Đo tải (autocannon hoặc k6) 2 tuyến chính với lượng dữ liệu sát thật; ghi req/s, p50, p99",
      "A profile (--cpu-prof, clinic or EXPLAIN ANALYZE) that identifies the bottleneck|||Một profile (--cpu-prof, clinic hoặc EXPLAIN ANALYZE) chỉ ra nút thắt",
      "One optimisation with before/after numbers measured the same way|||Một tối ưu có số đo trước/sau đo cùng cách",
      "PERFORMANCE.md: setup, numbers, what you changed, what you decided NOT to optimise|||PERFORMANCE.md: cách đo, các số, thứ đã đổi, thứ quyết định KHÔNG tối ưu",
    ],
    nangCao: [
      "Compare 1 process vs cluster/2 replicas for the same route and explain the difference|||So 1 tiến trình với cluster/2 bản cho cùng tuyến và giải thích khác biệt",
      "Find and fix one memory leak (heap snapshot before/after)|||Tìm và sửa một rò rỉ bộ nhớ (heap snapshot trước/sau)",
    ],
    datKhi: [
      "Numbers before and after are in PERFORMANCE.md with the exact command used|||Số trước và sau nằm trong PERFORMANCE.md kèm đúng lệnh đã dùng",
      "Error count during the load test is 0, or explained|||Số lỗi trong lúc đo tải là 0, hoặc có giải thích",
    ],
    goiY: [
      "Seed enough data first — every query is fast on 50 rows|||Seed đủ dữ liệu trước — truy vấn nào cũng nhanh với 50 dòng",
      "Most student APIs are slow because of the database (missing index, N+1), not JavaScript|||Hầu hết API sinh viên chậm vì cơ sở dữ liệu (thiếu chỉ mục, N+1), không phải vì JavaScript",
      "Run the load generator on the same machine for both runs, and close other heavy apps|||Chạy công cụ đo tải trên cùng một máy cho cả hai lần, tắt các app nặng khác",
    ],
    nop: ["repo"],
    bai: [L(16, "nodejs-16-1-do-truoc-khi-doan"), L(16, "nodejs-16-2-nut-that-that-su"), L(16, "nodejs-16-4-cluster-mo-rong"), L(16, "nodejs-16-6-toi-uu-vo-ich")],
  },
  {
    so: 17, slug: "nodejs-moc-17", sauChuong: "Chapter 17 — Docker and deployment|||Chương 17 — Docker và triển khai",
    ten: "Ship it: one command locally, HTTPS in production|||Đưa lên mạng: một lệnh ở máy, HTTPS ở production",
    lead: "Package the API and the worker into an image, run the whole stack with one docker compose command, and deploy it to a real server with HTTPS, migrations and a smoke test — so the committee can open it on a phone.|||Đóng gói API và worker thành image, chạy cả hệ thống bằng một lệnh docker compose, và deploy lên server thật có HTTPS, migration và smoke test — để hội đồng mở được trên điện thoại.",
    yeuCau: [
      "Multi-stage Dockerfile, production dependencies only, non-root user, .dockerignore excludes .env|||Dockerfile nhiều tầng, chỉ phụ thuộc production, user không phải root, .dockerignore loại .env",
      "docker compose up starts api + worker + postgres + redis from zero, with healthchecks|||docker compose up dựng api + worker + postgres + redis từ số 0, có healthcheck",
      "SIGTERM handled: in-flight requests finish, connections close, exit 0|||Xử lý SIGTERM: request đang chạy xong, đóng kết nối, thoát 0",
      "Migrations applied on deploy (prisma migrate deploy), never db push|||Migration áp khi deploy (prisma migrate deploy), không bao giờ db push",
      "Deployed to a VPS or cloud with HTTPS; a smoke-test script checks 3 routes after each deploy|||Deploy lên VPS hoặc cloud có HTTPS; script smoke test kiểm 3 tuyến sau mỗi lần deploy",
    ],
    nangCao: [
      "Zero-downtime redeploy (two replicas or blue-green) measured with a load test running|||Deploy lại không gián đoạn (hai bản hoặc blue-green) đo trong lúc chạy đo tải",
      "CI builds and pushes the image on tag|||CI build và đẩy image khi gắn tag",
    ],
    datKhi: [
      "The live HTTPS URL answers /healthz from a phone on mobile data|||URL HTTPS thật trả lời /healthz từ điện thoại dùng 4G",
      "docker stop during a slow request: the request still returns 200|||docker stop giữa một request chậm: request vẫn trả 200",
      "docker history shows no secret in any layer|||docker history không cho thấy bí mật ở tầng nào",
    ],
    goiY: [
      "CMD [“node”, “src/server.js”] (exec form) lets Node receive SIGTERM; npm start in shell form may swallow it|||CMD [“node”, “src/server.js”] (dạng exec) để Node nhận SIGTERM; npm start dạng shell có thể nuốt mất",
      "Copy package files and run npm ci BEFORE copying the source, so code changes reuse the dependency layer|||Copy tệp package và chạy npm ci TRƯỚC khi copy mã nguồn, để đổi mã vẫn dùng lại tầng phụ thuộc",
      "Free hosting sleeps: the first request may take 30 s — say so in the README|||Hosting miễn phí hay ngủ: request đầu có thể mất 30 giây — ghi rõ trong README",
    ],
    nop: ["repo", "demo"],
    bai: [L(17, "nodejs-17-1-anh-docker"), L(17, "nodejs-17-3-pid-1-tat-em"), L(17, "nodejs-17-4-bi-mat-cau-hinh"), L(17, "nodejs-17-6-deploy-hong-quay-lui")],
  },
  {
    so: 18, slug: "nodejs-moc-18", sauChuong: "Chapter 18 — Architecture|||Chương 18 — Kiến trúc",
    ten: "Clean structure, written decisions, a README for a stranger|||Cấu trúc sạch, quyết định được ghi lại, README cho người lạ",
    lead: "Reorganise the code by feature with clear layers, make the layer rules a check that CI runs, and write down the decisions you could not easily take back. Then the project is ready to defend.|||Sắp xếp lại mã theo feature với các tầng rõ ràng, biến luật về tầng thành phép kiểm CI chạy, và ghi lại những quyết định khó đảo ngược. Khi đó dự án sẵn sàng để bảo vệ.",
    yeuCau: [
      "Code organised by feature (src/features/<name>/routes, service, repo) with a short layer rule in the README|||Mã sắp theo feature (src/features/<tên>/routes, service, repo) có luật tầng ngắn trong README",
      "A script or lint rule in CI that fails when a route imports the database directly|||Một script hoặc luật lint trong CI báo lỗi khi tuyến import thẳng cơ sở dữ liệu",
      "2–3 ADRs (docs/adr/*.md) for the decisions of your topic (e.g. how double booking is prevented)|||2–3 ADR (docs/adr/*.md) cho quyết định của đề tài (vd cách chống đặt trùng)",
      "Final README: pitch, architecture diagram, how to run, environment variables, API table, live URL, known limitations|||README cuối: câu giới thiệu, sơ đồ kiến trúc, cách chạy, biến môi trường, bảng API, URL thật, giới hạn đã biết",
      "Tag v1.0.0 on the commit you will defend|||Gắn tag v1.0.0 lên commit bạn sẽ bảo vệ",
    ],
    nangCao: [
      "A dependency graph generated from the code (madge or similar)|||Một đồ thị phụ thuộc sinh từ mã (madge hoặc tương tự)",
      "One “if we had 100× users” section with what you would split first and why|||Một mục “nếu có gấp 100 lần người dùng” nói bạn tách gì trước và vì sao",
    ],
    datKhi: [
      "The layer check passes in CI, and fails when you add a forbidden import on purpose|||Phép kiểm tầng qua trong CI, và đỏ khi bạn cố ý thêm một import bị cấm",
      "A classmate can clone, run and call the API using only the README|||Một bạn cùng lớp clone, chạy và gọi API chỉ nhờ README",
    ],
    goiY: [
      "An ADR is short: context, decision, consequences, alternatives rejected|||ADR ngắn thôi: bối cảnh, quyết định, hệ quả, phương án đã loại",
      "Move code in small commits with tests green after each one|||Chuyển mã bằng các commit nhỏ, test xanh sau mỗi commit",
      "A monolith with clean feature boundaries is the right answer for this project size — say why|||Một monolith có ranh giới feature sạch là câu trả lời đúng cho cỡ dự án này — hãy nói vì sao",
    ],
    nop: ["repo", "demo"],
    bai: [L(18, "nodejs-18-1-tang-va-trach-nhiem"), L(18, "nodejs-18-2-to-chuc-ma-nguon"), L(18, "nodejs-18-4-monolith-hay-tach"), L(18, "nodejs-18-5-quyet-dinh-kho-dao-nguoc")],
  },
];

const GIOI_THIEU = [
  "<p><strong>After this course you will have built, tested and deployed one real backend of your own in Node.js.</strong> Not a copy of the Notes API we build together in the lessons, but an API for a topic you chose: a REST contract with validation, a PostgreSQL schema with migrations and transactions, accounts with hashed passwords, roles and ownership checks, one upload feature, one realtime feature, Redis caching, background jobs, tests in CI, logs and metrics, a Docker image and a live HTTPS address you can put on your CV.</p>",
  "<p><strong>Why one project through the whole course?</strong> A lesson teaches one idea; a project makes the ideas collide. The validation of Chapter 6 meets the transaction of Chapter 7, the token of Chapter 8 must reach the socket of Chapter 11, the job of Chapter 13 must not mail twice when it retries. That is where understanding — and the questions an interviewer asks — come from. After each of the 18 chapters there is a milestone that applies exactly that chapter to your topic, with a minimal example that was really run.</p>",
  "<p><strong>How it is graded.</strong> Every milestone has “Done when” criteria you can check yourself and a submission box (repository link, optionally a demo or screenshots). At the end you defend the project in front of an AI committee that asks about YOUR code — where the permission check lives, what happens when two requests race, what breaks if Redis dies — scored on a 10-point rubric.</p>",
  "|||",
  "<p><strong>Học xong khoá này bạn sẽ tự dựng, kiểm thử và đưa lên mạng một backend Node.js thật của riêng mình.</strong> Không phải bản chép Notes API mà ta cùng xây trong bài học, mà là API cho đề tài bạn tự chọn: hợp đồng REST có kiểm dữ liệu, schema PostgreSQL có migration và transaction, tài khoản với mật khẩu băm, vai trò và kiểm quyền sở hữu, một tính năng upload, một tính năng realtime, cache Redis, tác vụ nền, test chạy trong CI, log và metric, image Docker và một địa chỉ HTTPS thật để ghi vào CV.</p>",
  "<p><strong>Vì sao làm MỘT dự án xuyên suốt khoá?</strong> Bài học dạy từng ý; dự án bắt các ý va vào nhau. Phần kiểm dữ liệu của Chương 6 gặp transaction của Chương 7, token của Chương 8 phải tới được socket của Chương 11, job của Chương 13 thử lại mà không được gửi thư hai lần. Hiểu thật — và những câu nhà tuyển dụng hay hỏi — đến từ chỗ đó. Sau mỗi chương trong 18 chương có một mốc áp đúng kiến thức chương ấy vào đề tài của bạn, kèm một ví dụ tối thiểu đã chạy thật.</p>",
  "<p><strong>Chấm thế nào.</strong> Mỗi mốc có tiêu chí “Đạt khi” để tự kiểm và một ô nộp bài (link repo, có thể kèm demo hoặc ảnh). Cuối khoá bạn bảo vệ dự án trước một hội đồng AI hỏi về CHÍNH mã của bạn — chỗ kiểm quyền nằm đâu, hai request tranh nhau thì sao, Redis chết thì hỏng gì — chấm theo thang 10 điểm.</p>",
].join("");

const TU_CHON = {
  yeuCauToiThieu: [
    "A backend API (the frontend is optional): at least 2 resources with full CRUD over REST|||Một API backend (frontend không bắt buộc): ít nhất 2 tài nguyên có CRUD đầy đủ qua REST",
    "At least 3 related tables in PostgreSQL and one business rule that needs a transaction or a unique constraint|||Ít nhất 3 bảng có quan hệ trong PostgreSQL và một luật nghiệp vụ cần transaction hoặc ràng buộc unique",
    "Accounts with at least 2 roles and records that belong to a user (so ownership checks matter)|||Tài khoản với ít nhất 2 vai trò và bản ghi thuộc về một người dùng (để kiểm quyền sở hữu có ý nghĩa)",
    "A natural place for one file upload, one realtime update and one background job|||Có chỗ tự nhiên cho một tính năng tải tệp, một cập nhật realtime và một tác vụ nền",
    "A read that is worth caching and a route worth load-testing|||Có một lượt đọc đáng cache và một tuyến đáng đo tải",
    "No real payments, no real personal data, no scraping of other websites|||Không thanh toán thật, không dữ liệu cá nhân thật, không cào dữ liệu website khác",
  ],
  goiYQuyMo: "Right size: one sentence pitch, 6–12 features, 4–8 tables, roughly 60–100 hours spread over the 18 chapters. Too small: a to-do list with one table and no roles. Too big: a marketplace with buyers, sellers, shippers, chat, payments and recommendations — cut it to the core you can finish and defend, and list the rest as future work in the README.|||Vừa sức: một câu giới thiệu, 6–12 tính năng, 4–8 bảng, khoảng 60–100 giờ rải qua 18 chương. Quá nhỏ: một danh sách việc cần làm với một bảng và không có vai trò. Quá to: một sàn thương mại có người mua, người bán, shipper, chat, thanh toán và gợi ý — hãy cắt về phần lõi làm xong và bảo vệ được, phần còn lại ghi “hướng phát triển” trong README.",
};

const BAO_VE = {
  rubric: [
    { tieuChi: "Working features|||Tính năng chạy đúng", diem: 2, moTa: "The core features of the topic work end to end on the live URL, including empty, error and permission cases.|||Các tính năng lõi của đề tài chạy trọn trên URL thật, kể cả ca rỗng, lỗi và phân quyền." },
    { tieuChi: "API design and data|||Thiết kế API và dữ liệu", diem: 2, moTa: "Consistent REST contract with correct status codes and validation; normalised schema with constraints that encode the rules; migrations; a transaction where it matters; no N+1 on main lists.|||Hợp đồng REST nhất quán, mã trạng thái và kiểm dữ liệu đúng; schema chuẩn hoá có ràng buộc mã hoá luật; migration; transaction ở chỗ cần; không N+1 ở danh sách chính." },
    { tieuChi: "Security and authentication|||Bảo mật và xác thực", diem: 1.5, moTa: "Hashed passwords, short-lived tokens with rotation, ownership checked on the server, rate limits, no secrets in the repository or logs, safe uploads.|||Mật khẩu băm, token ngắn hạn có xoay vòng, kiểm sở hữu ở máy chủ, giới hạn tần suất, không bí mật trong repo hay log, tải tệp an toàn." },
    { tieuChi: "Reliability of async parts|||Độ tin cậy của phần bất đồng bộ", diem: 1, moTa: "Jobs retry and are idempotent, cache is invalidated correctly, realtime events are authorised and emitted after commit, the app survives Redis being down.|||Job thử lại và idempotent, cache được xoá đúng lúc, sự kiện realtime có phân quyền và phát sau commit, app sống sót khi Redis sập." },
    { tieuChi: "Tests and CI|||Kiểm thử và CI", diem: 1.5, moTa: "Meaningful unit and HTTP tests including edge and permission cases, some against a real database, green CI on the defended commit.|||Unit test và test HTTP có ý nghĩa, kể cả ca biên và phân quyền, một phần chạy trên cơ sở dữ liệu thật, CI xanh ở commit bảo vệ." },
    { tieuChi: "Operations|||Vận hành", diem: 1, moTa: "Structured logs with request id, metrics and health checks, a Docker image and compose file that start from zero, graceful shutdown, measured performance.|||Log có cấu trúc kèm request id, metric và health check, image Docker và tệp compose dựng được từ số 0, tắt êm, hiệu năng có số đo." },
    { tieuChi: "Presentation and answers|||Trình bày và trả lời", diem: 1, moTa: "A 5-minute demo that follows one user story; answers that point to the right file, explain why, and admit trade-offs honestly.|||Demo 5 phút đi theo một câu chuyện người dùng; câu trả lời chỉ đúng tệp, giải thích được vì sao, và thật thà về đánh đổi." },
  ],
  cauHoiMau: [
    "Walk us through one request of your main feature, from the TCP connection to the database row and back. Which middleware runs, in which order?|||Dẫn chúng tôi qua một request của tính năng chính, từ kết nối TCP tới dòng trong cơ sở dữ liệu rồi quay về. Middleware nào chạy, theo thứ tự nào?",
    "Which job in your app would block the event loop if you ran it inside a request? How did you measure it?|||Việc nào trong app sẽ chặn event loop nếu chạy trong request? Bạn đo nó thế nào?",
    "Two users submit the same slot / seat / last item at the same millisecond. Show the line of code or the constraint that makes exactly one of them win.|||Hai người cùng gửi một slot / ghế / món cuối cùng trong cùng một mili giây. Chỉ dòng mã hoặc ràng buộc làm cho đúng một người thắng.",
    "Why is this route a PATCH and not a PUT? What does it return when the id does not exist, and when the body is invalid?|||Vì sao tuyến này là PATCH mà không phải PUT? Nó trả gì khi id không tồn tại, và khi body sai?",
    "Show where you check that a record belongs to the caller. If I call your API with curl using my token and your record id, what happens?|||Chỉ chỗ bạn kiểm bản ghi thuộc về người gọi. Nếu tôi gọi API bằng curl với token của tôi và id bản ghi của bạn thì sao?",
    "Your database leaks tomorrow. What exactly does the attacker get — passwords, refresh tokens, files?|||Mai cơ sở dữ liệu bị lộ. Kẻ tấn công lấy được chính xác gì — mật khẩu, refresh token, tệp?",
    "Explain your access and refresh tokens: lifetimes, where each is stored, what happens when a refresh token is stolen and used twice.|||Giải thích access token và refresh token của bạn: thời hạn, mỗi cái lưu ở đâu, chuyện gì xảy ra khi refresh token bị trộm và dùng hai lần.",
    "I send role: ADMIN in the body of your register request. What happens, and which line decides it?|||Tôi gửi role: ADMIN trong body đăng ký. Chuyện gì xảy ra, dòng nào quyết định?",
    "Draw your tables. Which constraints did you add, and which bug does each one prevent?|||Vẽ các bảng. Bạn đã thêm ràng buộc nào, mỗi cái chặn lỗi gì?",
    "Your main list was slow. How did you find out why, and what does the EXPLAIN ANALYZE say now?|||Danh sách chính từng chậm. Bạn tìm ra lý do thế nào, và giờ EXPLAIN ANALYZE nói gì?",
    "A user uploads a PHP script named photo.png. Follow it through your upload flow and show where it is stopped.|||Một người tải lên script PHP tên photo.png. Đi theo nó qua luồng upload và chỉ chỗ nó bị chặn.",
    "Why do uploaded bytes not go through your Node process? What would happen to memory if they did, with 50 uploads at once?|||Vì sao byte tải lên không đi qua tiến trình Node? Nếu đi qua thì bộ nhớ ra sao khi có 50 lượt tải cùng lúc?",
    "How does a socket client prove who it is, and what stops it from joining the room of a project it is not a member of?|||Client socket chứng minh nó là ai thế nào, và cái gì ngăn nó vào phòng của dự án mà nó không phải thành viên?",
    "You run two API processes. A change made through process A must reach a user connected to process B. How?|||Bạn chạy hai tiến trình API. Thay đổi qua tiến trình A phải tới người dùng đang nối với tiến trình B. Bằng cách nào?",
    "What is cached, for how long, and which writes clear it? Show a case where a user could see stale data and why it is acceptable.|||Cái gì được cache, bao lâu, thao tác ghi nào xoá nó? Cho một trường hợp người dùng có thể thấy dữ liệu cũ và vì sao chấp nhận được.",
    "Redis goes down during the demo. Which features break, which slow down, and which keep working?|||Redis sập giữa buổi demo. Tính năng nào hỏng, tính năng nào chậm đi, tính năng nào vẫn chạy?",
    "Your reminder job fails twice and succeeds on the third try. How many emails does the user receive, and how do you know?|||Job nhắc lịch lỗi hai lần và thành công lần thứ ba. Người dùng nhận mấy email, và sao bạn biết?",
    "Pick one test and break the code it protects. Show it turning red, then explain what real bug it would catch.|||Chọn một test và làm hỏng đoạn mã nó bảo vệ. Cho thấy nó đỏ, rồi giải thích nó bắt được lỗi thật nào.",
    "A user reports “it failed at 10:42”. With only your logs and metrics, how do you find what happened to their request?|||Một người báo “lúc 10:42 bị lỗi”. Chỉ với log và metric, bạn tìm chuyện gì đã xảy ra với request của họ thế nào?",
    "Why is your metric labelled /appointments/:id and not the real URL? What would happen otherwise?|||Vì sao metric gắn nhãn /appointments/:id mà không phải URL thật? Nếu không thì chuyện gì xảy ra?",
    "Show your PERFORMANCE.md. What did you change, by how much did it help, and what did you decide not to optimise?|||Cho xem PERFORMANCE.md. Bạn đã đổi gì, đỡ được bao nhiêu, và quyết định không tối ưu chỗ nào?",
    "docker stop hits your container during a request. Walk us through what happens until the process exits.|||docker stop chạm vào container giữa một request. Kể chuyện gì xảy ra cho tới khi tiến trình thoát.",
    "Which values come from environment variables, and what does your app do at start-up if one is missing?|||Những giá trị nào lấy từ biến môi trường, và lúc khởi động app làm gì nếu thiếu một cái?",
    "The requirement changes: each appointment / order / loan can now involve two staff members. Which files, tables, migrations and tests do you change?|||Yêu cầu đổi: mỗi lịch hẹn / đơn / lượt mượn giờ có thể có hai nhân viên. Bạn sửa những tệp, bảng, migration và test nào?",
    "Why Node.js for this project rather than Spring Boot or Django? Name one thing that would be easier and one harder.|||Vì sao chọn Node.js cho dự án này mà không phải Spring Boot hay Django? Nêu một thứ sẽ dễ hơn và một thứ khó hơn.",
    "Which part did an AI assistant help with, and how did you check that it was correct and safe?|||Phần nào có trợ lý AI giúp, và bạn kiểm nó đúng và an toàn thế nào?",
  ],
  chuanBi: [
    "All 18 milestones submitted (or a note explaining any missing one), each with the commit or tag that delivered it|||Đã nộp đủ 18 mốc (hoặc ghi chú giải thích mốc thiếu), mỗi mốc kèm commit hoặc tag đã giao nó",
    "The live HTTPS URL works from a phone on mobile data; the smoke test passes against it|||URL HTTPS thật mở được trên điện thoại dùng 4G; smoke test chạy qua với nó",
    "A fresh clone starts with docker compose up (or npm ci + migrate + seed) using only the README|||Một bản clone mới chạy được bằng docker compose up (hoặc npm ci + migrate + seed) chỉ nhờ README",
    "CI green on the tagged commit v1.0.0|||CI xanh ở commit gắn tag v1.0.0",
    "Two demo accounts with different roles and realistic seed data — written in the README, not your real password|||Hai tài khoản demo khác vai trò với dữ liệu mẫu sát thật — ghi trong README, không phải mật khẩu thật của bạn",
    "README: pitch, architecture diagram, API table, environment variables, SECURITY.md, PERFORMANCE.md, ADRs, known limitations|||README: câu giới thiệu, sơ đồ kiến trúc, bảng API, biến môi trường, SECURITY.md, PERFORMANCE.md, ADR, giới hạn đã biết",
    "You can open without searching: the permission check, the key transaction, one job, the socket auth, one test|||Bạn mở được ngay không cần tìm: chỗ kiểm quyền, transaction chính, một job, chỗ xác thực socket, một test",
    "Repository history scanned for secrets one last time (gitleaks or git log -p)|||Đã quét lịch sử repo tìm bí mật lần cuối (gitleaks hoặc git log -p)",
    "A 5-minute demo script that follows one user story, and a screen recording as backup|||Kịch bản demo 5 phút theo một câu chuyện người dùng, và một đoạn quay màn hình dự phòng",
  ],
};

export const DU_AN = {
  version: 1,
  gioiThieu: GIOI_THIEU,
  deTai: DE_TAI,
  tuChon: TU_CHON,
  moc: MOC.map(({ so, slug, ten, sauChuong, yeuCau, nangCao, datKhi, goiY, nop }) => ({ so, slug, ten, sauChuong, yeuCau, nangCao, datKhi, goiY, nop })),
  baoVe: BAO_VE,
};

/* ───────────────────────── Dựng bài mốc & bài bảo vệ ───────────────────────── */

const tach = (s, i) => { const p = String(s).split("|||"); return (p[i] ?? p[0]).trim(); };
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/`/g, "&#96;");
const li = (arr, i) => arr.map((x) => "<li>" + esc(tach(x, i)) + "</li>").join("");
const TONG = MOC.length;

const NHAN = [
  {
    eyebrow: (m) => "Course project · Milestone " + m.so + " of " + TONG + " · after " + tach(m.sauChuong, 0),
    topic: "This milestone applies to the topic you registered in “Start here”. The table says what it means for each suggested topic; a self-chosen topic follows the same requirements — if one makes no sense for your topic, write in the README which feature practises that skill instead.",
    req: "✅ Required", stretch: "⭐ Stretch goals (optional)", map: "🧭 What this milestone means for each suggested topic", topicCol: "Topic", buildCol: "What you build now",
    demo: "🧪 Minimal working example — sample topic “Plant-care log”",
    demoNote: "The sample topic is deliberately not one of the suggested topics: this is a starting skeleton, not a solution to copy. Every file below was run for real on the author’s machine (Node " + "26, Express 5, local Redis 8, Docker 29); the output is pasted unchanged — numbers and ids will differ on yours.",
    hints: "💡 Hints — open one layer at a time", done: "🎯 Done when", submit: "📤 Submit",
    submitNote: "Use the submission box under this lesson, then mark the milestone as done — the course project progress bar counts it.",
    nop: { repo: "the repository link and the commit (or tag) that completes this milestone", demo: "a link to a running demo or a short screen recording", anh: "screenshots of the result (terminal output, EXPLAIN, dashboard…)" },
    lessons: "📚 Lessons this milestone uses", open: "Open lesson", file: "File", run: "Run",
    prev: (n) => (n === 1 ? "Topic registered" : "Milestone " + (n - 1)), next: (n) => (n === TONG ? "Finish & defend" : "Milestone " + (n + 1)), here: "You are here",
  },
  {
    eyebrow: (m) => "Dự án cuối khoá · Mốc " + m.so + "/" + TONG + " · sau " + tach(m.sauChuong, 1),
    topic: "Mốc này áp vào đề tài bạn đã đăng ký ở bài “Bắt đầu tại đây”. Bảng dưới cho biết với từng đề tài gợi ý thì mốc này nghĩa là gì; đề tài tự chọn làm theo đúng các yêu cầu chung — yêu cầu nào không hợp với đề tài thì ghi trong README tính năng nào luyện kỹ năng đó thay thế.",
    req: "✅ Yêu cầu bắt buộc", stretch: "⭐ Nâng cao (tuỳ chọn)", map: "🧭 Mốc này nghĩa là gì với từng đề tài gợi ý", topicCol: "Đề tài", buildCol: "Phần bạn làm ở mốc này",
    demo: "🧪 Ví dụ tối thiểu chạy được — đề tài mẫu “Sổ chăm cây” (Plant-care log)",
    demoNote: "Đề tài mẫu cố ý không nằm trong danh sách gợi ý: đây là bộ khung khởi đầu, không phải lời giải để chép. Mọi tệp dưới đây đã chạy THẬT trên máy soạn bài (Node 26, Express 5, Redis 8 cục bộ, Docker 29); output dán nguyên văn — số đo và id trên máy bạn sẽ khác.",
    hints: "💡 Gợi ý — mở từng tầng một", done: "🎯 Đạt khi", submit: "📤 Nộp bài",
    submitNote: "Dùng ô nộp bài bên dưới bài này, rồi đánh dấu mốc đã xong — thanh tiến độ dự án của khoá sẽ tính nó.",
    nop: { repo: "link repo và commit (hoặc tag) hoàn thành mốc này", demo: "link demo đang chạy hoặc một đoạn quay màn hình ngắn", anh: "ảnh chụp kết quả (output terminal, EXPLAIN, dashboard…)" },
    lessons: "📚 Bài học mốc này dùng tới", open: "Mở bài", file: "Tệp", run: "Chạy",
    prev: (n) => (n === 1 ? "Đã đăng ký đề tài" : "Mốc " + (n - 1)), next: (n) => (n === TONG ? "Hoàn thiện & bảo vệ" : "Mốc " + (n + 1)), here: "Bạn đang ở đây",
  },
];

const LANG_CLASS = { javascript: "language-javascript", json: "language-json", bash: "language-bash", prisma: "language-prisma", dockerfile: "language-dockerfile" };

function khoiDemo(so, N) {
  return (MA[so] || []).map((b) => {
    if (b.code != null) return "<p><strong>" + N.file + ":</strong> <code>" + esc(b.file) + "</code></p>\n<pre><code class=\"" + (LANG_CLASS[b.lang] || "language-javascript") + "\">" + esc(b.code) + "</code></pre>";
    return "<p><strong>" + N.run + ":</strong></p>\n<pre><code class=\"language-bash\">" + esc(b.cmd) + "</code></pre>\n<div class=\"out\">" + esc(b.out) + "</div>";
  }).join("\n");
}

/** baiMoc(so, tieuDe) → bài EXERCISE của mốc `so` (đặt trước quiz của chương `so`). */
export function baiMoc(so, tieuDe = new Map()) {
  const m = MOC.find((x) => x.so === so);
  if (!m) throw new Error("nodejs _du-an: không có mốc " + so);
  if (!MA[so]) throw new Error("nodejs _du-an: thiếu khung chạy thật MA[" + so + "] — sinh lại _du-an-ma.mjs");
  const khoi = (i) => {
    const N = NHAN[i];
    const bang = DE_TAI.map((d) => {
      const b = d.banDoChuong.find((x) => x.moc === so);
      return "<tr><td>" + esc(tach(d.ten, i)) + "</td><td>" + esc(b ? tach(b.dung, i) : "—") + "</td></tr>";
    }).join("\n");
    const goiY = m.goiY.map((g, k) => "<details class=\"tu-kiem\"><summary>" + (i === 0 ? "Hint " : "Gợi ý ") + (k + 1) + "</summary><p>" + esc(tach(g, i)) + "</p></details>").join("\n");
    const truoc = so === 1 ? tach("Start here|||Bắt đầu tại đây", i) : tach(MOC[so - 2].ten, i);
    const sau = so === TONG ? tach("Rubric, committee questions, AI defence room|||Thang điểm, câu hỏi hội đồng, phòng bảo vệ AI", i) : tach(MOC[so].ten, i);
    const bai = m.bai.map((b) => {
      if (tieuDe.size && !tieuDe.has(b.slug)) throw new Error("nodejs _du-an: mốc " + so + " trỏ tới bài không có: " + b.slug);
      const t = tieuDe.has(b.slug) ? tach(tieuDe.get(b.slug), i) : b.slug;
      return "<a class=\"link-card\" href=\"/courses/nodejs/learn?lessonSlug=" + b.slug + "\"><span class=\"lc-ico\">📘</span><span class=\"lc-body\"><span class=\"lc-title\">" + esc(t) + "</span><span class=\"lc-sub\">" + esc(tach(m.sauChuong, i)) + "</span></span><span class=\"lc-cta\">" + N.open + " →</span></a>";
    }).join("\n");
    return [
      "<div class=\"" + (i === 0 ? "ml-en" : "ml-vi") + "\">",
      "<span class=\"eyebrow\">" + esc(N.eyebrow(m)) + "</span>",
      "<h2>" + esc(tach(m.ten, i)) + "</h2>",
      "<p class=\"lead\">" + esc(tach(m.lead, i)) + "</p>",
      "<div class=\"lz-flow\">",
      "<div class=\"lz-step\"><span class=\"lz-k\">✓</span><span class=\"lz-t\">" + esc(N.prev(so)) + "</span><span class=\"lz-d\">" + esc(truoc) + "</span></div>",
      "<div class=\"lz-step\"><span class=\"lz-k\">" + so + "</span><span class=\"lz-t\">" + N.here + "</span><span class=\"lz-d\">" + esc(tach(m.sauChuong, i)) + "</span></div>",
      "<div class=\"lz-step\"><span class=\"lz-k\">→</span><span class=\"lz-t\">" + esc(N.next(so)) + "</span><span class=\"lz-d\">" + esc(sau) + "</span></div>",
      "</div>",
      "<p>" + esc(N.topic) + "</p>",
      "<h3>" + N.req + "</h3>",
      "<ol>" + li(m.yeuCau, i) + "</ol>",
      "<h3>" + N.stretch + "</h3>",
      "<ul>" + li(m.nangCao, i) + "</ul>",
      "<h3>" + N.map + "</h3>",
      "<table>\n<thead><tr><th>" + N.topicCol + "</th><th>" + N.buildCol + "</th></tr></thead>\n<tbody>\n" + bang + "\n</tbody>\n</table>",
      "<h3>" + N.demo + "</h3>",
      "<p class=\"note-ct\">" + esc(N.demoNote) + "</p>",
      khoiDemo(so, N),
      "<h3>" + N.hints + "</h3>",
      goiY,
      "<div class=\"callout ok\"><p><strong>" + N.done + "</strong></p><ul>" + li(m.datKhi, i) + "</ul></div>",
      "<h3>" + N.submit + "</h3>",
      "<ul>" + m.nop.map((k) => "<li>" + esc(N.nop[k]) + "</li>").join("") + "</ul>",
      "<p>" + esc(N.submitNote) + "</p>",
      "<h3>" + N.lessons + "</h3>",
      bai,
      "</div>",
    ].join("\n");
  };
  return {
    title: "🛠 Project milestone " + so + " — " + tach(m.ten, 0) + "|||🛠 Mốc dự án " + so + " — " + tach(m.ten, 1),
    slug: m.slug,
    type: "EXERCISE",
    mocDuAn: so,
    isFreePreview: false,
    description: "Mốc dự án " + so + "/" + TONG + " (sau " + tach(m.sauChuong, 1) + "): " + tach(m.ten, 1) + " — yêu cầu, nâng cao, đạt khi, gợi ý theo tầng, ví dụ chạy thật, nộp bài.",
    content: "\n" + khoi(0) + "\n" + khoi(1) + "\n",
  };
}

/** baiBaoVe() → bài EXERCISE cuối khoá { baoVeDuAn: true } dựng từ BAO_VE. */
export function baiBaoVe() {
  const khoi = (i) => {
    const en = i === 0;
    const tong = BAO_VE.rubric.reduce((a, r) => a + r.diem, 0);
    const so = (x) => (en ? String(x) : String(x).replace(".", ","));
    const rub = BAO_VE.rubric.map((r) => "<tr><td>" + esc(tach(r.tieuChi, i)) + "</td><td>" + so(r.diem) + "</td><td>" + esc(tach(r.moTa, i)) + "</td></tr>").join("\n");
    return [
      "<div class=\"" + (en ? "ml-en" : "ml-vi") + "\">",
      "<span class=\"eyebrow\">" + (en ? "Course project · Final step" : "Dự án cuối khoá · Bước cuối") + "</span>",
      "<h2>" + (en ? "Finish and defend your backend" : "Hoàn thiện và bảo vệ backend của bạn") + "</h2>",
      "<p class=\"lead\">" + (en
        ? "Eighteen milestones turned your registered topic into a deployed, tested Node.js API. This last step is how an assignment at university or a technical interview ends: you hand in something that runs, then you explain it — why each decision, where each rule lives, what breaks under load or failure. The AI defence room below plays the committee: it reads what you submit and keeps asking until it is sure you built and understand the project."
        : "Mười tám mốc đã biến đề tài bạn đăng ký thành một API Node.js đã kiểm thử và chạy trên mạng. Bước cuối này giống cách một assignment ở trường hay một buổi phỏng vấn kỹ thuật kết thúc: bạn nộp thứ chạy được, rồi giải thích nó — vì sao chọn như vậy, luật nằm ở đâu, chịu tải hay gặp sự cố thì hỏng chỗ nào. Phòng bảo vệ AI bên dưới đóng vai hội đồng: nó đọc thứ bạn nộp và hỏi vặn tới khi chắc rằng bạn đã tự làm và hiểu dự án.") + "</p>",
      "<div class=\"lz-flow\">",
      en
        ? "<div class=\"lz-step\"><span class=\"lz-k\">1</span><span class=\"lz-t\">Finish</span><span class=\"lz-d\">Close open milestones, tag v1.0.0, CI green, live URL works.</span></div>\n<div class=\"lz-step\"><span class=\"lz-k\">2</span><span class=\"lz-t\">Submit</span><span class=\"lz-d\">Repository, live URL, README, demo accounts.</span></div>\n<div class=\"lz-step\"><span class=\"lz-k\">3</span><span class=\"lz-t\">Present</span><span class=\"lz-d\">5 minutes: one user story end to end.</span></div>\n<div class=\"lz-step\"><span class=\"lz-k\">4</span><span class=\"lz-t\">Questions</span><span class=\"lz-d\">Data, security, concurrency, failure, your choices.</span></div>\n<div class=\"lz-step\"><span class=\"lz-k\">5</span><span class=\"lz-t\">Score</span><span class=\"lz-d\">10-point rubric + written feedback; fix and defend again.</span></div>"
        : "<div class=\"lz-step\"><span class=\"lz-k\">1</span><span class=\"lz-t\">Hoàn thiện</span><span class=\"lz-d\">Đóng mốc còn mở, gắn tag v1.0.0, CI xanh, URL thật chạy.</span></div>\n<div class=\"lz-step\"><span class=\"lz-k\">2</span><span class=\"lz-t\">Nộp</span><span class=\"lz-d\">Repo, URL thật, README, tài khoản demo.</span></div>\n<div class=\"lz-step\"><span class=\"lz-k\">3</span><span class=\"lz-t\">Trình bày</span><span class=\"lz-d\">5 phút: một câu chuyện người dùng từ đầu tới cuối.</span></div>\n<div class=\"lz-step\"><span class=\"lz-k\">4</span><span class=\"lz-t\">Hỏi đáp</span><span class=\"lz-d\">Dữ liệu, bảo mật, đồng thời, sự cố, lựa chọn của bạn.</span></div>\n<div class=\"lz-step\"><span class=\"lz-k\">5</span><span class=\"lz-t\">Chấm</span><span class=\"lz-d\">Thang 10 điểm + nhận xét viết; sửa xong được bảo vệ lại.</span></div>",
      "</div>",
      "<h3>" + (en ? "✅ Checklist before you enter the room" : "✅ Danh sách kiểm trước khi vào phòng") + "</h3>",
      "<div class=\"callout ok\"><ul>" + BAO_VE.chuanBi.map((x) => "<li>☐ " + esc(tach(x, i)) + "</li>").join("") + "</ul></div>",
      "<h3>" + (en ? "📊 Rubric (" + tong + " points)" : "📊 Thang điểm (" + tong + " điểm)") + "</h3>",
      "<table>\n<thead><tr><th>" + (en ? "Criterion" : "Tiêu chí") + "</th><th>" + (en ? "Points" : "Điểm") + "</th><th>" + (en ? "What earns the points" : "Thế nào thì được điểm") + "</th></tr></thead>\n<tbody>\n" + rub + "\n<tr><td><strong>" + (en ? "Total" : "Tổng") + "</strong></td><td><strong>" + so(tong) + "</strong></td><td></td></tr>\n</tbody>\n</table>",
      "<h3>" + (en ? "❓ Questions committees and interviewers really ask" : "❓ Những câu hội đồng và nhà tuyển dụng hay hỏi thật") + "</h3>",
      "<p>" + (en ? "Practise out loud with the file open. A good answer has three parts: what the code does, why you chose it, and what you would change if the requirement changed." : "Tập trả lời thành tiếng, mở sẵn tệp liên quan. Câu trả lời tốt có ba phần: mã làm gì, vì sao bạn chọn cách đó, và nếu yêu cầu đổi thì bạn sửa gì.") + "</p>",
      "<ol>" + li(BAO_VE.cauHoiMau, i) + "</ol>",
      "<div class=\"pitfall co-tieu-de\"><p><strong>" + (en ? "Trap — defending code you cannot explain." : "Bẫy — bảo vệ đoạn mã mình không giải thích được.") + "</strong> " + (en
        ? "Using an AI assistant or a tutorial is allowed; not understanding the result is what fails a defence. Read every file once before you submit and be ready to say why each part exists."
        : "Dùng trợ lý AI hay hướng dẫn trên mạng là được phép; không hiểu kết quả mới là thứ làm trượt buổi bảo vệ. Đọc lại mọi tệp một lượt trước khi nộp và sẵn sàng nói vì sao từng phần tồn tại.") + "</p></div>",
      "<div class=\"pitfall co-tieu-de\"><p><strong>" + (en ? "Trap — a demo that depends on luck." : "Bẫy — buổi demo trông vào may rủi.") + "</strong> " + (en
        ? "Free hosting sleeps and the first request can take 30 seconds. Open the live URL a minute before, keep a screen recording as backup, and never demo with your real password or real personal data."
        : "Hosting miễn phí hay ngủ, request đầu có thể mất 30 giây. Mở URL thật trước một phút, giữ một đoạn quay màn hình dự phòng, và không bao giờ demo bằng mật khẩu thật hay dữ liệu cá nhân thật.") + "</p></div>",
      "<div class=\"callout ok\"><p><strong>" + (en ? "🎯 Done when" : "🎯 Đạt khi") + "</strong></p><ul>" + (en
        ? "<li>Every checklist item above is ticked.</li><li>You submitted the repository, the live URL and the demo accounts in the box below.</li><li>You finished one session in the AI defence room and read its feedback.</li><li>You fixed what the feedback found (or wrote why not) and, if you want a better score, defended again.</li>"
        : "<li>Mọi mục trong danh sách kiểm ở trên đã đánh dấu.</li><li>Bạn đã nộp repo, URL thật và tài khoản demo ở khung bên dưới.</li><li>Bạn đã xong một phiên trong phòng bảo vệ AI và đọc nhận xét.</li><li>Bạn đã sửa những gì nhận xét chỉ ra (hoặc ghi lý do không sửa) và, nếu muốn điểm cao hơn, bảo vệ lại.</li>") + "</ul></div>",
      "<h3>" + (en ? "Where to go next" : "Đi tiếp đâu") + "</h3>",
      "<p>" + (en
        ? "Put this project at the top of your CV with the live URL. Then deepen what interviewers probe after a Node.js project: system design and scaling, a second backend stack for comparison, and a real frontend on top of your API."
        : "Đặt dự án này lên đầu CV kèm URL thật. Rồi đào sâu những gì nhà tuyển dụng hay hỏi tiếp sau một dự án Node.js: thiết kế hệ thống và mở rộng, một stack backend thứ hai để so sánh, và một frontend thật trên API của bạn.") + "</p>",
      "<a class=\"link-card lien-ket-cheo\" href=\"/courses/system-design\"><span class=\"lc-ico\">🗺️</span><span class=\"lc-body\"><span class=\"lc-title\">System Design</span><span class=\"lc-sub\">" + (en ? "Scaling, caching, queues and trade-offs at interview level" : "Mở rộng, cache, hàng đợi và đánh đổi ở mức phỏng vấn") + "</span></span><span class=\"lc-cta\">" + (en ? "Open course" : "Mở khoá") + " →</span></a>",
      "<a class=\"link-card lien-ket-cheo\" href=\"/courses/spring-boot\"><span class=\"lc-ico\">🍃</span><span class=\"lc-body\"><span class=\"lc-title\">Spring Boot</span><span class=\"lc-sub\">" + (en ? "The same backend ideas in Java — the stack most enterprise job posts ask for next to Node.js" : "Cùng các ý backend bằng Java — stack mà nhiều tin tuyển dụng doanh nghiệp đòi bên cạnh Node.js") + "</span></span><span class=\"lc-cta\">" + (en ? "Open course" : "Mở khoá") + " →</span></a>",
      "<a class=\"link-card lien-ket-cheo\" href=\"/courses/nextjs\"><span class=\"lc-ico\">⚛️</span><span class=\"lc-body\"><span class=\"lc-title\">Next.js</span><span class=\"lc-sub\">" + (en ? "A full-stack frontend on top of the API you just built" : "Một frontend full-stack trên chính API bạn vừa dựng") + "</span></span><span class=\"lc-cta\">" + (en ? "Open course" : "Mở khoá") + " →</span></a>",
      "</div>",
    ].join("\n");
  };
  return {
    title: "🎓 Finish and defend your course project|||🎓 Hoàn thiện và bảo vệ dự án cuối khoá",
    slug: "nodejs-bao-ve-du-an",
    type: "EXERCISE",
    baoVeDuAn: true,
    isFreePreview: false,
    description: "Bài cuối khoá: checklist hoàn thiện backend dự án, thang điểm 10, câu hội đồng hay hỏi về chính mã của bạn, và phòng bảo vệ AI.",
    content: "\n" + khoi(0) + "\n" + khoi(1) + "\n",
  };
}

export default DU_AN;
