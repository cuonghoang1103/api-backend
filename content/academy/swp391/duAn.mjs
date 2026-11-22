/**
 * SWP391 · DỰ ÁN XUYÊN SUỐT KHOÁ — dự án nhóm THẬT (soạn 22/11/2026).
 * Hợp đồng dữ liệu: docs/du-an-hop-dong.md (v1) · đặc tả trải nghiệm: docs/du-an-xuyen-suot-khoa.md.
 *
 * SWP391 khác FER202: dự án là của NHÓM 4–5 người, nhưng điểm iteration chấm TỪNG NGƯỜI (Converted-LOC của màn hình
 * mình làm) — nên mỗi mốc ghi rõ phần "của bạn" (3–4 màn hình full-stack) và phần "của nhóm" (tài liệu chung, tag, gói nộp).
 * Mốc = các mốc chấm THẬT của môn: Khởi động → Iteration 1 (15%) → Iteration 2 (20%) → Iteration 3 (25%) → tổng duyệt
 * Final Presentation (40%), rồi bài bảo vệ. Rubric bảo vệ 10 điểm bám đúng 4 tiêu chí Final Presentation 20/40/20/20.
 *
 * Xuất ra:
 *   duAn       — khối `duAn` cấp gốc của SWP391.mjs
 *   mocBai     — [5 bài EXERCISE `mocDuAn: N`], slug = duAn.moc[i].slug (xếp vào mục "Dự án nhóm thật" ở CUỐI khoá)
 *   baoVeBai   — bài `swp391-bao-ve-du-an` (EXERCISE, baoVeDuAn: true)
 *   moiDangKy  — đoạn HTML song ngữ nối vào cuối bài 0.1 (bài đó mang cờ dangKyDuAn: true)
 * Không có tên/mã sinh viên thật nào trong tệp này.
 */
import { bi } from './_slides.mjs';

export const KHOA = '/courses/software-development-project/learn?lessonSlug=';
export const GIT = '/courses/git/learn?lessonSlug=';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const pre = (s, lang = 'plaintext') => `<pre><code class="language-${lang}">${esc(String(s).trim())}</code></pre>`;
const L = (s) => s.split('|||');
const ul = (arr, i) => `<ul>${arr.map((s) => `<li>${esc(L(s)[i] ?? L(s)[0])}</li>`).join('')}</ul>`;
const ol = (arr, i) => `<ol>${arr.map((s) => `<li>${esc(L(s)[i] ?? L(s)[0])}</li>`).join('')}</ol>`;

/* ═══════════════════════════════ GIỚI THIỆU ═══════════════════════════════ */
const GIOI_THIEU_EN = `<h3>🎯 The course project — your real SWP391 team project, run like a software team</h3>
<p>SWP391 <em>is</em> a project: a team of 4–5 builds one web system in three iterations and defends it in a Final Presentation. This track turns the course into a step-by-step playbook for that project — from the first meeting to the defence — so you pass with a good grade <b>and</b> leave with experience you can talk about at your OJT interview.</p>
<h4>When you finish you can</h4>
<ul>
  <li>Get a topic approved at the right size, write a team charter and set up a repository the teacher can grade (protected main, labels, milestones, tags).</li>
  <li>Own a vertical slice: take your 3–4 screens per iteration from use case → design → full-stack code → System Test, through issues and reviewed merge requests.</li>
  <li>Produce every deliverable on time: SRS/SDS or RDS, Project Tracking, System Test (Template3), AI Usage Report (Template5), Weekly Report (Template6), DB script, demo videos, the iteration tag.</li>
  <li>Run the team: planning, async stand-ups, review preparation with the teacher, retros, and a fair way to handle a member who does not deliver.</li>
  <li>Present and defend: a 15-minute run-sheet, a live demo, a live code change, and honest answers to panel questions.</li>
</ul>
<h4>How it is graded here — the same shape as the real course</h4>
<ul>
  <li><b>Five milestones</b> = Kickoff → Iteration 1 (15%) → Iteration 2 (20%) → Iteration 3 (25%) → Final Presentation rehearsal. Each has a required list, optional extras and a “Pass when” checklist; you submit your repo/tag link, your demo video and a screenshot.</li>
  <li><b>Final defence</b>: a 10-point rubric mirroring the Final Presentation (requirement 2 · design 2 · working product 2.5 · code ownership &amp; live change 1.5 · process evidence 1 · presentation &amp; Q&amp;A 1) and an AI panel that questions <em>your</em> screens.</li>
</ul>
<p>The track lives in the <b>last section</b> of the course (“Team project playbook”) but runs <b>in parallel</b> with the chapters: open it in week 1; every milestone says which chapters it needs. Pick a suggested topic below or propose your own — the AI reviewer checks the size and the coverage.</p>`;

const GIOI_THIEU_VI = `<h3>🎯 Dự án xuyên suốt khoá — chính đồ án nhóm SWP391 của bạn, làm như một team phần mềm thật</h3>
<p>SWP391 <em>là</em> một dự án: nhóm 4–5 người xây một hệ thống web qua ba iteration rồi bảo vệ ở Final Presentation. Phần này biến khoá học thành cẩm nang từng bước cho đúng dự án đó — từ buổi họp đầu tiên tới buổi bảo vệ — để bạn qua môn với điểm tốt <b>và</b> có kinh nghiệm thật để kể khi phỏng vấn OJT.</p>
<h4>Học xong bạn làm được</h4>
<ul>
  <li>Xin duyệt một đề tài đúng cỡ, viết hợp đồng nhóm, dựng repository mà giảng viên chấm được (main được bảo vệ, label, milestone, tag).</li>
  <li>Sở hữu một lát cắt dọc: đưa 3–4 màn hình của mình mỗi iteration đi từ use case → thiết kế → code full-stack → System Test, qua issue và merge request có người review.</li>
  <li>Nộp đủ mọi deliverable đúng hạn: SRS/SDS hoặc RDS, Project Tracking, System Test (Template3), AI Usage Report (Template5), Weekly Report (Template6), DB script, video demo, tag iteration.</li>
  <li>Vận hành nhóm: lập kế hoạch, stand-up không đồng bộ, chuẩn bị buổi review với giảng viên, retro, và cách công bằng để xử lý thành viên không làm.</li>
  <li>Thuyết trình và bảo vệ: kịch bản 15 phút, demo trực tiếp, sửa code tại chỗ, trả lời trung thực câu hỏi của hội đồng.</li>
</ul>
<h4>Chấm thế nào — cùng dạng với môn thật</h4>
<ul>
  <li><b>Năm mốc</b> = Khởi động → Iteration 1 (15%) → Iteration 2 (20%) → Iteration 3 (25%) → tổng duyệt Final Presentation. Mỗi mốc có phần bắt buộc, phần nâng cao và danh sách "Đạt khi"; bạn nộp link repo/tag, video demo và ảnh chụp.</li>
  <li><b>Bảo vệ cuối khoá</b>: rubric 10 điểm phản chiếu Final Presentation (yêu cầu 2 · thiết kế 2 · sản phẩm chạy được 2,5 · làm chủ code &amp; sửa tại chỗ 1,5 · bằng chứng quy trình 1 · trình bày &amp; hỏi đáp 1) và một hội đồng AI hỏi về <em>chính các màn hình của bạn</em>.</li>
</ul>
<p>Phần này nằm ở <b>mục cuối</b> của khoá ("Dự án nhóm thật") nhưng chạy <b>song song</b> với các chương: mở nó ngay tuần 1; mốc nào cũng ghi rõ cần học xong chương nào. Chọn một đề tài gợi ý bên dưới hoặc tự đề xuất — AI sẽ xét đề tài có đủ cỡ và phủ đủ kiến thức không.</p>`;

/* ═══════════════════════════════ ĐỀ TÀI ═══════════════════════════════ */
// banDoChuong: moc 1…5 → phần của ĐỀ TÀI NÀY mà mốc đó xây. Số màn hình là ước lượng cho nhóm 5 — đếm lại theo bài 0.7.
const deTai = [
  {
    slug: 'dat-san-the-thao',
    ten: 'Sports court booking (badminton / mini football)|||Đặt sân thể thao (cầu lông / bóng đá mini)',
    moTa: 'Customers find a free court and time slot, book and pay a deposit; staff check them in; owners manage courts, prices by time band and see revenue; an admin approves new owners. About 45 screens for 5 members. Suggested stack: Java Servlet/JSP or Spring Boot + MySQL, or React + Spring Boot/Node REST API — confirm with your teacher.|||Khách tìm sân và khung giờ còn trống, đặt sân và đặt cọc; nhân viên check-in; chủ sân quản lý sân, bảng giá theo khung giờ và xem doanh thu; admin duyệt chủ sân mới. Khoảng 45 màn hình cho nhóm 5. Stack gợi ý: Java Servlet/JSP hoặc Spring Boot + MySQL, hoặc React + REST API Spring Boot/Node — xác nhận với giảng viên.',
    doKho: 2,
    tinhNang: [
      'Search courts by area, sport, date; a slot grid showing free/booked/blocked|||Tìm sân theo khu vực, môn, ngày; lưới khung giờ trống/đã đặt/đang khoá',
      'Book a slot with rules: no overlap, price by peak/off-peak band, cancel at least 2 hours before|||Đặt sân theo luật: không trùng giờ, giá theo giờ cao điểm/thấp điểm, huỷ trước ít nhất 2 giờ',
      'Weekly recurring booking for a fixed group (one request creates many bookings)|||Đặt cố định hằng tuần cho một nhóm (một yêu cầu sinh nhiều lượt đặt)',
      'Simulated deposit/payment and a booking status flow Pending → Confirmed → Checked-in → Completed/Cancelled|||Đặt cọc/thanh toán giả lập và luồng trạng thái Chờ → Đã xác nhận → Đã check-in → Hoàn tất/Huỷ',
      'Staff: check-in by booking code, walk-in booking at the counter|||Nhân viên: check-in bằng mã đặt, đặt tại quầy cho khách vãng lai',
      'Owner: manage courts, opening hours, price table, block slots for maintenance|||Chủ sân: quản lý sân, giờ mở cửa, bảng giá, khoá khung giờ để bảo trì',
      'Reviews after a completed booking; owner replies|||Đánh giá sau khi chơi xong; chủ sân phản hồi',
      'Dashboard: revenue by day and court, occupancy rate, top customers|||Thống kê: doanh thu theo ngày và sân, tỉ lệ lấp đầy, khách quen',
      'Admin: approve court owners, manage accounts and roles; e-mail notifications via MailTrap|||Admin: duyệt chủ sân, quản lý tài khoản và vai trò; thông báo e-mail qua MailTrap',
    ],
    banDoChuong: [
      { moc: 1, dung: 'Topic approved; actors Guest/Customer/Staff/Owner/Admin × use cases; ~45 screens split by actor; repo with login stub and court list skeleton|||Duyệt đề tài; actor Khách/Khách hàng/Nhân viên/Chủ sân/Admin × use case; ~45 màn hình chia theo actor; repo có khung đăng nhập và danh sách sân' },
      { moc: 2, dung: 'Iteration 1: register/login/roles, court list + search, court detail with slot grid, owner court CRUD, price table|||Iteration 1: đăng ký/đăng nhập/phân quyền, danh sách + tìm sân, chi tiết sân có lưới khung giờ, chủ sân CRUD sân, bảng giá' },
      { moc: 3, dung: 'Iteration 2: booking with the no-overlap rule (transaction), cancel rule, recurring booking, staff check-in, simulated payment|||Iteration 2: đặt sân với luật không trùng giờ (transaction), luật huỷ, đặt cố định, nhân viên check-in, thanh toán giả lập' },
      { moc: 4, dung: 'Iteration 3: reviews, revenue/occupancy dashboard, owner approval, e-mail notifications; regression of every screen; final package|||Iteration 3: đánh giá, thống kê doanh thu/lấp đầy, duyệt chủ sân, thông báo e-mail; kiểm thử hồi quy mọi màn hình; gói nộp cuối' },
      { moc: 5, dung: 'Demo: guest searches → books → staff checks in → owner sees revenue; be ready to explain the overlap check under two simultaneous bookings|||Demo: khách tìm → đặt → nhân viên check-in → chủ sân xem doanh thu; sẵn sàng giải thích kiểm tra trùng giờ khi hai người đặt cùng lúc' },
    ],
    thamKhaoThat: [
      'Playtomic — a real court-booking app for padel and tennis clubs|||Playtomic — app đặt sân thật cho câu lạc bộ padel và tennis',
      'Most courts in Vietnam still take bookings by phone, Zalo or Facebook — that manual process is the "as-is" system you analyse|||Đa số sân ở Việt Nam vẫn nhận đặt qua điện thoại, Zalo, Facebook — quy trình thủ công đó chính là "hệ thống hiện tại" để bạn phân tích',
    ],
    anh: null,
  },
  {
    slug: 'dat-lich-phong-kham',
    ten: 'Clinic appointments & medical records|||Đặt lịch phòng khám & hồ sơ bệnh án',
    moTa: 'Patients book an appointment by specialty or doctor; receptionists confirm and reschedule; doctors record the visit and prescription; patients see their history and invoices. About 46 screens for 5 members. Suggested stack: Java web or Spring Boot + MySQL, or React + REST API.|||Bệnh nhân đặt lịch theo chuyên khoa hoặc bác sĩ; lễ tân xác nhận và dời lịch; bác sĩ ghi khám và kê đơn; bệnh nhân xem lịch sử và hoá đơn. Khoảng 46 màn hình cho nhóm 5. Stack gợi ý: Java web hoặc Spring Boot + MySQL, hoặc React + REST API.',
    doKho: 2,
    tinhNang: [
      'Doctor work shifts and bookable time slots per specialty|||Ca làm của bác sĩ và khung giờ đặt được theo chuyên khoa',
      'Patient books, cancels, reschedules; one doctor cannot have two patients in one slot|||Bệnh nhân đặt, huỷ, dời lịch; một bác sĩ không nhận hai bệnh nhân trong cùng khung giờ',
      'Receptionist: confirm, check-in, walk-in registration, queue of the day|||Lễ tân: xác nhận, check-in, đăng ký khám vãng lai, hàng chờ trong ngày',
      'Doctor: visit record (symptoms, diagnosis), prescription from a medicine catalogue; editable only by its doctor within 24 hours|||Bác sĩ: phiếu khám (triệu chứng, chẩn đoán), kê đơn từ danh mục thuốc; chỉ bác sĩ đó sửa được trong 24 giờ',
      'Patient medical history and prescriptions, printable|||Lịch sử khám và đơn thuốc của bệnh nhân, in được',
      'Invoice per visit with simulated payment|||Hoá đơn mỗi lượt khám, thanh toán giả lập',
      'E-mail reminders the day before (MailTrap)|||Nhắc lịch qua e-mail trước một ngày (MailTrap)',
      'Manager dashboard: visits per specialty, no-show rate, revenue|||Thống kê cho quản lý: lượt khám theo chuyên khoa, tỉ lệ không đến, doanh thu',
      'Admin: staff accounts, specialties, medicine catalogue|||Admin: tài khoản nhân viên, chuyên khoa, danh mục thuốc',
    ],
    banDoChuong: [
      { moc: 1, dung: 'Actors Patient/Receptionist/Doctor/Manager/Admin; core flow book → confirm → visit → prescribe → pay; screen list split by actor|||Actor Bệnh nhân/Lễ tân/Bác sĩ/Quản lý/Admin; luồng lõi đặt → xác nhận → khám → kê đơn → thanh toán; danh sách màn hình chia theo actor' },
      { moc: 2, dung: 'Iteration 1: accounts and roles, specialty/doctor list, doctor shifts, medicine catalogue CRUD, patient profile|||Iteration 1: tài khoản và vai trò, danh sách chuyên khoa/bác sĩ, ca làm bác sĩ, CRUD danh mục thuốc, hồ sơ bệnh nhân' },
      { moc: 3, dung: 'Iteration 2: booking with slot rules, confirm/reschedule, check-in queue, visit record + prescription (transaction over two tables)|||Iteration 2: đặt lịch theo luật khung giờ, xác nhận/dời lịch, hàng chờ check-in, phiếu khám + đơn thuốc (transaction trên hai bảng)' },
      { moc: 4, dung: 'Iteration 3: invoices, history, reminders, dashboard; regression; final package|||Iteration 3: hoá đơn, lịch sử, nhắc lịch, thống kê; hồi quy; gói nộp cuối' },
      { moc: 5, dung: 'Demo one patient journey end to end; be ready for "who may edit a visit record, and how do you enforce the 24-hour rule?"|||Demo trọn hành trình một bệnh nhân; sẵn sàng cho câu "ai được sửa phiếu khám, và luật 24 giờ được chặn ở đâu?"' },
    ],
    thamKhaoThat: [
      'BookingCare — a Vietnamese platform for booking doctors and clinics|||BookingCare — nền tảng đặt lịch bác sĩ, phòng khám ở Việt Nam',
      'Zocdoc — doctor appointment booking in the United States|||Zocdoc — đặt lịch bác sĩ ở Mỹ',
    ],
    anh: null,
  },
  {
    slug: 'theo-doi-tiem-chung',
    ten: 'Child vaccination tracking & booking|||Theo dõi & đặt lịch tiêm chủng cho trẻ',
    moTa: 'Parents keep profiles of their children; the system builds each child’s recommended schedule from the vaccine catalogue (doses, minimum intervals, age ranges); parents book at a centre; staff screen, inject and record the vaccine lot; reactions are reported afterwards. Hard rules make it level 3. About 50 screens for 5 members. Suggested stack: Spring Boot + MySQL or React + REST API.|||Phụ huynh quản lý hồ sơ các con; hệ thống dựng lịch tiêm khuyến nghị cho từng trẻ từ danh mục vắc-xin (số mũi, khoảng cách tối thiểu, độ tuổi); phụ huynh đặt lịch tại trung tâm; nhân viên khám sàng lọc, tiêm và ghi lô vắc-xin; sau tiêm báo phản ứng. Luật nghiệp vụ khó nên độ khó 3. Khoảng 50 màn hình cho nhóm 5. Stack gợi ý: Spring Boot + MySQL hoặc React + REST API.',
    doKho: 3,
    tinhNang: [
      'Parent account with several child profiles|||Tài khoản phụ huynh với nhiều hồ sơ trẻ',
      'Vaccine catalogue: doses, minimum interval between doses, age range, price|||Danh mục vắc-xin: số mũi, khoảng cách tối thiểu giữa các mũi, độ tuổi, giá',
      'Recommended schedule generated per child; overdue and next doses highlighted|||Lịch tiêm khuyến nghị sinh cho từng trẻ; tô đậm mũi quá hạn và mũi kế tiếp',
      'Booking at a centre, refused when the interval or age rule is violated|||Đặt lịch tại trung tâm, bị từ chối khi vi phạm luật khoảng cách hoặc độ tuổi',
      'Staff: pre-injection screening checklist, record injection with lot number|||Nhân viên: phiếu khám sàng lọc trước tiêm, ghi nhận mũi tiêm kèm số lô',
      'Vaccine lot stock with expiry; an expired lot can never be selected|||Kho lô vắc-xin có hạn dùng; lô hết hạn không bao giờ được chọn',
      'Post-injection reaction report and follow-up by staff|||Báo phản ứng sau tiêm và nhân viên theo dõi',
      'Reminders before the next dose (MailTrap)|||Nhắc mũi tiếp theo qua e-mail (MailTrap)',
      'Reports: doses per vaccine, coverage by age group, stock running low|||Báo cáo: số mũi theo vắc-xin, độ phủ theo nhóm tuổi, kho sắp hết',
      'Admin: centres, staff, catalogue|||Admin: trung tâm, nhân viên, danh mục',
    ],
    banDoChuong: [
      { moc: 1, dung: 'Actors Parent/Staff/Doctor/Manager/Admin; list the scheduling rules as BR-01…BR-10 before anything else; screen list|||Actor Phụ huynh/Nhân viên/Bác sĩ/Quản lý/Admin; liệt kê luật lịch tiêm thành BR-01…BR-10 trước tiên; danh sách màn hình' },
      { moc: 2, dung: 'Iteration 1: accounts, child profiles, vaccine catalogue CRUD, centre list, lot stock CRUD|||Iteration 1: tài khoản, hồ sơ trẻ, CRUD danh mục vắc-xin, danh sách trung tâm, CRUD kho lô' },
      { moc: 3, dung: 'Iteration 2: schedule generation, booking with interval/age checks, screening + injection record (decrements stock in one transaction)|||Iteration 2: sinh lịch tiêm, đặt lịch có kiểm khoảng cách/độ tuổi, sàng lọc + ghi mũi tiêm (trừ kho trong một transaction)' },
      { moc: 4, dung: 'Iteration 3: reactions, reminders, reports; regression with boundary tests on the date rules; final package|||Iteration 3: phản ứng sau tiêm, nhắc lịch, báo cáo; hồi quy có test biên cho luật ngày; gói nộp cuối' },
      { moc: 5, dung: 'Demo a booking refused because the interval is too short, then a valid one; explain how dates are compared and tested|||Demo một lượt đặt bị từ chối vì khoảng cách quá ngắn, rồi một lượt hợp lệ; giải thích cách so ngày và cách test' },
    ],
    thamKhaoThat: [
      'VNVC — a Vietnamese vaccination centre chain with online booking|||VNVC — chuỗi trung tâm tiêm chủng ở Việt Nam có đặt lịch trực tuyến',
      'The national immunisation schedule published by the health authority is the real source of your business rules|||Lịch tiêm chủng do cơ quan y tế công bố chính là nguồn thật của business rule',
    ],
    anh: null,
  },
  {
    slug: 'quan-ly-thu-vien',
    ten: 'Library management|||Quản lý thư viện',
    moTa: 'Members search the catalogue, reserve and borrow book copies; librarians lend, take returns, renew and collect overdue fines; managers see statistics. The smallest topic here — good for a 4-member team or a team new to Java web; add a module if you are 5. About 40 screens. Suggested stack: Java Servlet/JSP + MySQL.|||Bạn đọc tra cứu, đặt trước và mượn bản sách; thủ thư cho mượn, nhận trả, gia hạn và thu phạt quá hạn; quản lý xem thống kê. Đề tài nhỏ nhất ở đây — hợp nhóm 4 người hoặc nhóm mới làm Java web; nhóm 5 thì thêm một module. Khoảng 40 màn hình. Stack gợi ý: Java Servlet/JSP + MySQL.',
    doKho: 1,
    tinhNang: [
      'Catalogue: title vs physical copy, categories, authors, search and filters|||Danh mục: đầu sách và bản sách vật lý, thể loại, tác giả, tìm và lọc',
      'Member registration and library card status|||Đăng ký bạn đọc và trạng thái thẻ thư viện',
      'Reserve a title; queue when all copies are out|||Đặt trước một đầu sách; xếp hàng khi hết bản',
      'Borrow/return at the counter with limits (max 5 copies, 14 days)|||Mượn/trả tại quầy có giới hạn (tối đa 5 bản, 14 ngày)',
      'Renew at most twice, refused when someone reserved it|||Gia hạn tối đa hai lần, bị từ chối khi có người đặt trước',
      'Overdue fines computed per day; pay and clear|||Phạt quá hạn tính theo ngày; thanh toán và xoá nợ',
      'Import books from a CSV file with validation report|||Nhập sách từ file CSV kèm báo cáo lỗi',
      'Statistics: most borrowed, overdue list, active members|||Thống kê: sách mượn nhiều, danh sách quá hạn, bạn đọc hoạt động',
      'Admin: librarians, roles, policies (limits, fine rate)|||Admin: thủ thư, vai trò, chính sách (giới hạn, mức phạt)',
    ],
    banDoChuong: [
      { moc: 1, dung: 'Actors Guest/Member/Librarian/Manager/Admin; decide title vs copy in the ERD on day one; screen list|||Actor Khách/Bạn đọc/Thủ thư/Quản lý/Admin; chốt đầu sách và bản sách trong ERD ngay ngày đầu; danh sách màn hình' },
      { moc: 2, dung: 'Iteration 1: accounts, catalogue CRUD, search, member cards, category/author management|||Iteration 1: tài khoản, CRUD danh mục, tìm kiếm, thẻ bạn đọc, quản lý thể loại/tác giả' },
      { moc: 3, dung: 'Iteration 2: reserve queue, borrow/return with limits, renew rule, fines|||Iteration 2: hàng đặt trước, mượn/trả có giới hạn, luật gia hạn, phạt' },
      { moc: 4, dung: 'Iteration 3: CSV import, statistics, policies screen, e-mail overdue notices; regression; final package|||Iteration 3: nhập CSV, thống kê, màn hình chính sách, e-mail báo quá hạn; hồi quy; gói nộp cuối' },
      { moc: 5, dung: 'Demo reserve → borrow → overdue → fine; be ready for "why is a copy a separate table?"|||Demo đặt trước → mượn → quá hạn → phạt; sẵn sàng cho câu "vì sao bản sách là một bảng riêng?"' },
    ],
    thamKhaoThat: [
      'Koha — an open-source library system used by many real libraries|||Koha — hệ thống thư viện mã nguồn mở được nhiều thư viện thật sử dụng',
      'Your own university library — interview a librarian for the as-is process|||Thư viện trường bạn — phỏng vấn thủ thư để lấy quy trình hiện tại',
    ],
    anh: null,
  },
  {
    slug: 'dat-phong-homestay',
    ten: 'Homestay booking|||Đặt phòng homestay',
    moTa: 'Guests search homestays by place, dates and number of guests, book and pay; hosts manage listings, availability calendars and seasonal prices; refunds follow the listing’s cancellation policy; admins approve listings and handle complaints. About 45 screens for 5 members. Suggested stack: React + Spring Boot/Node REST API + MySQL, or Java web.|||Khách tìm homestay theo nơi, ngày và số khách, đặt và thanh toán; chủ nhà quản lý tin, lịch trống và giá theo mùa; hoàn tiền theo chính sách huỷ của từng tin; admin duyệt tin và xử lý khiếu nại. Khoảng 45 màn hình cho nhóm 5. Stack gợi ý: React + REST API Spring Boot/Node + MySQL, hoặc Java web.',
    doKho: 2,
    tinhNang: [
      'Search by location, dates, guests, price range; sort and paging|||Tìm theo địa điểm, ngày, số khách, khoảng giá; sắp xếp và phân trang',
      'Listing detail with photos, amenities, house rules, reviews|||Chi tiết tin với ảnh, tiện nghi, nội quy, đánh giá',
      'Host: listings CRUD, availability calendar, seasonal and weekend prices|||Chủ nhà: CRUD tin, lịch trống, giá theo mùa và cuối tuần',
      'Booking with no overlapping dates, minimum nights, maximum guests|||Đặt phòng không trùng ngày, số đêm tối thiểu, số khách tối đa',
      'Cancellation policy (flexible / moderate / strict) computes the refund|||Chính sách huỷ (linh hoạt / vừa / nghiêm) tính số tiền hoàn',
      'Simulated payment, invoice, booking history|||Thanh toán giả lập, hoá đơn, lịch sử đặt',
      'Reviews allowed only after check-out|||Chỉ được đánh giá sau khi trả phòng',
      'Host earnings and occupancy report|||Báo cáo thu nhập và tỉ lệ lấp đầy của chủ nhà',
      'Admin: approve listings, complaints, accounts|||Admin: duyệt tin, khiếu nại, tài khoản',
    ],
    banDoChuong: [
      { moc: 1, dung: 'Actors Guest/Customer/Host/Staff/Admin; booking states; screen list; repo + image upload decision (local folder vs cloud)|||Actor Khách/Khách hàng/Chủ nhà/Nhân viên/Admin; trạng thái lượt đặt; danh sách màn hình; repo + quyết định lưu ảnh (thư mục cục bộ hay cloud)' },
      { moc: 2, dung: 'Iteration 1: accounts, listing CRUD with photos, search with filters, listing detail, amenities|||Iteration 1: tài khoản, CRUD tin có ảnh, tìm có bộ lọc, chi tiết tin, tiện nghi' },
      { moc: 3, dung: 'Iteration 2: availability calendar, seasonal prices, booking with date-overlap rule, cancellation + refund|||Iteration 2: lịch trống, giá theo mùa, đặt phòng với luật trùng ngày, huỷ + hoàn tiền' },
      { moc: 4, dung: 'Iteration 3: reviews, host report, admin approval and complaints; regression; final package|||Iteration 3: đánh giá, báo cáo chủ nhà, admin duyệt tin và khiếu nại; hồi quy; gói nộp cuối' },
      { moc: 5, dung: 'Demo search → book → cancel with refund; be ready to explain the overlap query on date ranges|||Demo tìm → đặt → huỷ có hoàn tiền; sẵn sàng giải thích câu truy vấn kiểm trùng khoảng ngày' },
    ],
    thamKhaoThat: [
      'Airbnb — listings, host calendars and cancellation policies|||Airbnb — tin đăng, lịch của chủ nhà và chính sách huỷ',
      'Booking.com — search filters and booking flow|||Booking.com — bộ lọc tìm kiếm và luồng đặt phòng',
    ],
    anh: null,
  },
  {
    slug: 'trung-tam-khoa-hoc',
    ten: 'Online course centre (mini LMS)|||Trung tâm khoá học trực tuyến (LMS mini)',
    moTa: 'Learners browse and enrol in courses, follow lessons, take timed quizzes and earn a certificate; instructors create courses, lessons and question banks; staff approve courses before publishing. Many interacting rules (progress, grading, certificates) make it level 3. About 50 screens for 5 members. Suggested stack: React + Spring Boot/Node + MySQL.|||Học viên xem và ghi danh khoá học, học bài, làm quiz có giờ và nhận chứng chỉ; giảng viên tạo khoá, bài học và ngân hàng câu hỏi; nhân viên duyệt khoá trước khi xuất bản. Nhiều luật đan xen (tiến độ, chấm điểm, chứng chỉ) nên độ khó 3. Khoảng 50 màn hình cho nhóm 5. Stack gợi ý: React + Spring Boot/Node + MySQL.',
    doKho: 3,
    tinhNang: [
      'Course catalogue with categories, search, ratings|||Danh mục khoá học theo chủ đề, tìm kiếm, đánh giá',
      'Enrolment (free or simulated payment) and coupon codes|||Ghi danh (miễn phí hoặc thanh toán giả lập) và mã giảm giá',
      'Lesson page with progress tracking|||Trang bài học có theo dõi tiến độ',
      'Quiz from a question bank: random questions, timer, auto-grading, attempt limit|||Quiz từ ngân hàng câu hỏi: câu ngẫu nhiên, bấm giờ, tự chấm, giới hạn số lần làm',
      'Certificate when at least 80% of lessons are done and the final quiz is passed|||Chứng chỉ khi xong ít nhất 80% bài và qua quiz cuối',
      'Instructor: course, lesson and question CRUD; submit for review|||Giảng viên: CRUD khoá, bài, câu hỏi; gửi duyệt',
      'Staff: approve/reject with comments before publishing|||Nhân viên: duyệt/từ chối kèm nhận xét trước khi xuất bản',
      'Q&A thread per lesson|||Hỏi đáp theo từng bài',
      'Reports: revenue, completion rate, hardest questions|||Báo cáo: doanh thu, tỉ lệ hoàn thành, câu hỏi khó nhất',
      'Admin: accounts, roles, categories|||Admin: tài khoản, vai trò, chủ đề',
    ],
    banDoChuong: [
      { moc: 1, dung: 'Actors Guest/Learner/Instructor/Staff/Admin; course states Draft → Pending → Published → Hidden; screen list|||Actor Khách/Học viên/Giảng viên/Nhân viên/Admin; trạng thái khoá Nháp → Chờ duyệt → Xuất bản → Ẩn; danh sách màn hình' },
      { moc: 2, dung: 'Iteration 1: accounts, catalogue + search, course detail, instructor course/lesson CRUD, categories|||Iteration 1: tài khoản, danh mục + tìm kiếm, chi tiết khoá, giảng viên CRUD khoá/bài, chủ đề' },
      { moc: 3, dung: 'Iteration 2: enrolment + coupons, lesson progress, question bank, quiz taking with timer and grading|||Iteration 2: ghi danh + mã giảm giá, tiến độ bài học, ngân hàng câu hỏi, làm quiz có giờ và chấm' },
      { moc: 4, dung: 'Iteration 3: approval workflow, certificates, Q&A, reports; regression; final package|||Iteration 3: luồng duyệt, chứng chỉ, hỏi đáp, báo cáo; hồi quy; gói nộp cuối' },
      { moc: 5, dung: 'Demo instructor submits → staff approves → learner enrols, passes quiz, gets certificate; explain how grading is protected from cheating via the browser|||Demo giảng viên gửi → nhân viên duyệt → học viên ghi danh, qua quiz, nhận chứng chỉ; giải thích việc chấm được bảo vệ khỏi gian lận qua trình duyệt thế nào' },
    ],
    thamKhaoThat: [
      'Moodle — the open-source LMS many universities run|||Moodle — LMS mã nguồn mở nhiều trường đại học dùng',
      'Coursera, and the Courses/Academy section of cuongthai.com|||Coursera, và phần Courses/Academy của cuongthai.com',
    ],
    anh: null,
  },
  {
    slug: 'goi-mon-nha-hang-qr',
    ten: 'Restaurant QR ordering & kitchen display|||Gọi món nhà hàng bằng QR & màn hình bếp',
    moTa: 'Customers scan the table’s QR code, order from the menu and call staff; the kitchen sees items move New → Cooking → Ready; waiters serve, split or merge bills and take payment; managers manage the menu and see shift reports. About 45 screens for 5 members. Suggested stack: React + Node/Spring Boot REST API + MySQL, or Java web.|||Khách quét mã QR ở bàn, gọi món từ thực đơn và gọi nhân viên; bếp thấy món chuyển Mới → Đang nấu → Xong; phục vụ mang món, tách/gộp hoá đơn và thu tiền; quản lý cập nhật thực đơn và xem báo cáo ca. Khoảng 45 màn hình cho nhóm 5. Stack gợi ý: React + REST API Node/Spring Boot + MySQL, hoặc Java web.',
    doKho: 2,
    tinhNang: [
      'Table QR opens that table’s menu; categories, options (size, toppings)|||QR bàn mở thực đơn của đúng bàn đó; danh mục, tuỳ chọn (cỡ, topping)',
      'Cart and order per table; add more items to an open order|||Giỏ và đơn theo bàn; gọi thêm vào đơn đang mở',
      'Kitchen display: item status New → Cooking → Ready → Served|||Màn hình bếp: trạng thái món Mới → Đang nấu → Xong → Đã phục vụ',
      'Waiter view: tables, calls, serve items|||Màn hình phục vụ: bàn, lượt gọi, mang món',
      'Split or merge bills; simulated payment and invoice|||Tách hoặc gộp hoá đơn; thanh toán giả lập và hoá đơn',
      'Menu management with a sold-out switch|||Quản lý thực đơn có công tắc hết món',
      'Table reservations|||Đặt bàn trước',
      'Shift report: revenue by dish and by hour|||Báo cáo ca: doanh thu theo món và theo giờ',
      'Admin: staff, roles, tables and QR codes|||Admin: nhân viên, vai trò, bàn và mã QR',
    ],
    banDoChuong: [
      { moc: 1, dung: 'Actors Customer/Waiter/Kitchen/Cashier/Manager/Admin; order and item states; screen list; decide polling vs WebSocket for the kitchen screen|||Actor Khách/Phục vụ/Bếp/Thu ngân/Quản lý/Admin; trạng thái đơn và món; danh sách màn hình; chọn polling hay WebSocket cho màn hình bếp' },
      { moc: 2, dung: 'Iteration 1: accounts, tables + QR, menu/category CRUD, menu page by table|||Iteration 1: tài khoản, bàn + QR, CRUD thực đơn/danh mục, trang thực đơn theo bàn' },
      { moc: 3, dung: 'Iteration 2: cart and order, kitchen display, waiter view, sold-out rule (cannot order a sold-out dish)|||Iteration 2: giỏ và đơn, màn hình bếp, màn hình phục vụ, luật hết món (không gọi được món đã hết)' },
      { moc: 4, dung: 'Iteration 3: bills split/merge, payment, reservations, shift report; regression; final package|||Iteration 3: tách/gộp hoá đơn, thanh toán, đặt bàn, báo cáo ca; hồi quy; gói nộp cuối' },
      { moc: 5, dung: 'Demo two browsers side by side — customer orders, kitchen updates, cashier closes the bill; explain how the kitchen screen refreshes|||Demo hai trình duyệt cạnh nhau — khách gọi món, bếp cập nhật, thu ngân đóng hoá đơn; giải thích màn hình bếp làm mới thế nào' },
    ],
    thamKhaoThat: [
      'KiotViet and iPOS — point-of-sale systems widely used by Vietnamese restaurants and cafés|||KiotViet và iPOS — hệ thống bán hàng nhiều nhà hàng, quán cà phê ở Việt Nam dùng',
      'Toast — restaurant ordering and kitchen display system in the United States|||Toast — hệ thống gọi món và màn hình bếp cho nhà hàng ở Mỹ',
    ],
    anh: null,
  },
];

/* ═══════════════════════════════ ĐỀ TÀI TỰ CHỌN ═══════════════════════════════ */
const tuChon = {
  yeuCauToiThieu: [
    'A management web system (not a game, not a static site, not a mobile-only app) with at least 3 roles besides the guest|||Một hệ thống web quản lý (không phải game, không phải web tĩnh, không chỉ là app di động) có ít nhất 3 vai trò ngoài khách',
    'Enough screens for every member: about 3–4 screens × members × 3 iterations, counted the way the Product sheet of Project Tracking counts|||Đủ màn hình cho mọi thành viên: khoảng 3–4 màn hình × số người × 3 iteration, đếm theo cách sheet Product của Project Tracking đếm',
    'At least one core business flow with states (request → approve → done) and at least 5 testable business rules|||Ít nhất một luồng nghiệp vụ lõi có trạng thái (gửi → duyệt → xong) và ít nhất 5 business rule kiểm thử được',
    'A relational database of at least 10 tables with real 1:N and M:N relationships|||Cơ sở dữ liệu quan hệ ít nhất 10 bảng với quan hệ 1:N và M:N thật',
    'Login with role-based authorization; list screens with search, sort and paging|||Đăng nhập và phân quyền theo vai trò; màn hình danh sách có tìm, sắp xếp, phân trang',
    'The core does not depend on what cannot be demonstrated in class (real payment gateway, real SMS, map routing, an AI engine) — those are simulated|||Phần lõi không phụ thuộc thứ không demo được trên lớp (cổng thanh toán thật, SMS thật, định tuyến bản đồ, AI làm lõi) — các thứ đó được giả lập',
    'Every member can own a vertical slice end to end: requirement → design → code → test|||Mỗi thành viên sở hữu được một lát cắt dọc trọn vẹn: yêu cầu → thiết kế → code → test',
  ],
  goiYQuyMo: 'Five members: 40–55 screens/functions; four members: 32–45. Fewer ⇒ add a module (reports, notifications, a second workflow). More than about 60 ⇒ cut, and confirm the cut with your teacher in a Q&A issue. The teacher (as PO) always has the last word on scope.|||Nhóm 5: 40–55 màn hình/chức năng; nhóm 4: 32–45. Ít hơn ⇒ thêm một module (báo cáo, thông báo, luồng thứ hai). Hơn khoảng 60 ⇒ cắt bớt, và xác nhận phần cắt với giảng viên trong một issue Q&A. Giảng viên (vai PO) luôn chốt phạm vi cuối cùng.',
};

/* ═══════════════════════════════ MỐC ═══════════════════════════════ */
const moc = [
  {
    so: 1, slug: 'swp391-moc-1',
    ten: 'Kickoff — approved topic, team charter, repository and tracking ready|||Khởi động — đề tài được duyệt, hợp đồng nhóm, repository và tracking sẵn sàng',
    sauChuong: 'Section 0 + Chapter 1 — Kickoff, GitLab & tracking|||Mục 0 + Chương 1 — Khởi động, GitLab & theo dõi tiến độ',
    yeuCau: [
      'Get the topic approved by the teacher (PO): post a one-page proposal (problem, actors, core flow, estimated screens) in a Q&A issue and get a written reply|||Xin giảng viên (PO) duyệt đề tài: đăng đề xuất một trang (vấn đề, actor, luồng lõi, ước số màn hình) vào một issue Q&A và nhận trả lời bằng văn bản',
      'Write docs/team-charter.md (roles, meeting times, channels, Definition of Done, late-work rule, escalation ladder); every member commits their agreement with their own account|||Viết docs/team-charter.md (vai trò, giờ họp, kênh liên lạc, Definition of Done, luật trễ hạn, thang leo thang); mọi thành viên commit lời đồng ý bằng tài khoản của chính mình',
      'Set up the repository the course way: teacher added, main protected, labels Req/Task/Defect/Leakage/Q&A, milestones Iter1–Iter3, issue and merge-request templates|||Dựng repository đúng kiểu môn: thêm giảng viên, bảo vệ main, label Req/Task/Defect/Leakage/Q&A, milestone Iter1–Iter3, template issue và merge request',
      'Draft Project Tracking: Use Cases sheet (actor × use case) and Product sheet (every screen with complexity, owner, planned iteration), balanced across members|||Nháp Project Tracking: sheet Use Cases (actor × use case) và sheet Product (mọi màn hình kèm độ phức tạp, người làm, iteration dự kiến), chia đều giữa các thành viên',
      'A walking skeleton: the project runs on every member’s machine from the README (same JDK/Node, same DB script), with the shared layout and a login stub; each member merges at least one MR|||Bộ khung chạy được: dự án chạy trên máy mọi thành viên theo README (cùng JDK/Node, cùng DB script), có layout chung và khung đăng nhập; mỗi thành viên merge ít nhất một MR',
    ],
    nangCao: [
      'CI that builds and runs tests on every push (Chapter 9)|||CI build và chạy test mỗi lần push (Chương 9)',
      'Context diagram and glossary started in docs/|||Bắt đầu context diagram và glossary trong docs/',
      'Shared .editorconfig / formatter so diffs only show real changes|||.editorconfig / formatter dùng chung để diff chỉ hiện thay đổi thật',
    ],
    datKhi: [
      'The Q&A issue with the teacher’s approval exists and is linked from the README|||Issue Q&A có lời duyệt của giảng viên tồn tại và được link từ README',
      'docs/team-charter.md has a commit from every member|||docs/team-charter.md có commit của mọi thành viên',
      'A direct push to main is rejected (you tried it), and the repo has the 5 labels and 3 milestones|||Push thẳng vào main bị từ chối (bạn đã thử), repo có đủ 5 label và 3 milestone',
      'In the Product sheet every screen has an owner and an iteration, and each member’s planned Converted-LOC is within 25% of the team average|||Trong sheet Product mọi màn hình có người làm và iteration, Converted-LOC dự kiến của mỗi người lệch không quá 25% so với trung bình nhóm',
      'A fresh clone + the README steps starts the app on another machine in 15 minutes or less|||Clone mới + làm theo README chạy được app trên máy khác trong tối đa 15 phút',
      'Every member has at least one merged MR made with their own account|||Mỗi thành viên có ít nhất một MR đã merge bằng tài khoản của chính mình',
    ],
    goiY: [
      'Tier 1: Start from the topic bank in lesson 0.7 and count screens with the Product-sheet rules before arguing about the idea.|||Tầng 1: Bắt đầu từ ngân hàng đề tài ở bài 0.7 và đếm màn hình theo luật sheet Product trước khi tranh luận ý tưởng.',
      'Tier 2: Split by actor or module (vertical slices), never "A does the database, B does the UI" — each member is graded on full-stack screens.|||Tầng 2: Chia theo actor hoặc module (lát cắt dọc), đừng bao giờ "A làm CSDL, B làm giao diện" — mỗi người được chấm theo màn hình full-stack.',
      'Tier 3: Copy the charter, issue and MR templates from lessons P.2 and P.4; for repository setup follow lessons 1.3 and Git KĐ.4–KĐ.7.|||Tầng 3: Chép template hợp đồng nhóm, issue, MR ở bài P.2 và P.4; dựng repo theo bài 1.3 và Git KĐ.4–KĐ.7.',
    ],
    nop: ['repo', 'anh'],
  },
  {
    so: 2, slug: 'swp391-moc-2',
    ten: 'Iteration 1 (15%) — your first 3–4 screens, specified, designed, coded and tagged|||Iteration 1 (15%) — 3–4 màn hình đầu tiên của bạn: đặc tả, thiết kế, code và gắn tag',
    sauChuong: 'Chapters 2–3 — Requirements & SRS, system & database design|||Chương 2–3 — Yêu cầu & SRS, thiết kế hệ thống & CSDL',
    yeuCau: [
      'For each of your Iteration-1 screens: a use-case specification (main, alternative and exception flows), business rules by ID, and a screen specification (fields, validation, actions)|||Với mỗi màn hình Iteration 1 của bạn: đặc tả use case (luồng chính, thay thế, ngoại lệ), business rule theo mã, và đặc tả màn hình (trường, kiểm lỗi, thao tác)',
      'Design for your screens: a class diagram and a sequence diagram of the main flow; your tables in the shared ERD and DB script|||Thiết kế cho màn hình của bạn: class diagram và sequence diagram của luồng chính; các bảng của bạn trong ERD chung và DB script',
      'Code every screen full-stack: server-side validation, parameterised SQL or ORM (never string-concatenated input), search/sort/paging on lists, role check|||Code mọi màn hình full-stack: kiểm lỗi phía server, SQL có tham số hoặc ORM (không bao giờ nối chuỗi dữ liệu nhập), tìm/sắp xếp/phân trang ở danh sách, kiểm vai trò',
      'Work through the flow: one Req issue per screen → a branch → an MR reviewed by a teammate → merge|||Làm đúng luồng: mỗi màn hình một issue Req → một nhánh → một MR có đồng đội review → merge',
      'Team: SRS/RDS v1 (overview, actors, use-case diagram, BR list, screen flow), Project Tracking updated, tag iter1, a 3–5 minute demo video per member, Weekly and AI Usage reports|||Nhóm: SRS/RDS v1 (tổng quan, actor, use case diagram, danh sách BR, screen flow), cập nhật Project Tracking, tag iter1, mỗi người một video demo 3–5 phút, Weekly Report và AI Usage Report',
    ],
    nangCao: [
      'Unit tests for the rules in your service layer (lesson 5.3)|||Unit test cho các luật ở tầng service của bạn (bài 5.3)',
      'A clickable prototype confirmed by the teacher before coding|||Prototype bấm được, giảng viên xác nhận trước khi code',
      'A staging deployment the teacher can open (lesson 6.3)|||Một bản staging giảng viên mở được (bài 6.3)',
    ],
    datKhi: [
      'Every Iteration-1 row of yours in the Product sheet is Done and links to its issue and MR|||Mọi dòng Iteration 1 của bạn trong sheet Product ở trạng thái Done và link tới issue, MR',
      'Each of your screens opens from the menu (no typed URLs), rejects invalid input with a message, and keeps working after a refresh|||Mỗi màn hình của bạn mở được từ menu (không gõ URL), từ chối dữ liệu sai kèm thông báo, và vẫn chạy sau khi tải lại trang',
      'A search in your data-access code finds no SQL built by concatenating user input|||Tìm trong code truy cập dữ liệu của bạn không thấy câu SQL nào nối chuỗi dữ liệu người dùng',
      'Tag iter1 exists; checking it out and running database/iter1/ on an empty schema works|||Tag iter1 tồn tại; checkout tag và chạy database/iter1/ trên schema trống thì chạy được',
      'Your demo video shows each of your screens: the happy path and at least one rule violation|||Video demo của bạn cho thấy từng màn hình: luồng đúng và ít nhất một lần vi phạm luật',
      'SRS/RDS v1 is in the repo and its Record of Changes has a row from you|||SRS/RDS v1 nằm trong repo và Record of Changes có một dòng của bạn',
    ],
    goiY: [
      'Tier 1: Run the Iteration 1 checklist (end of Chapter 2) three days before the deadline, not the night before.|||Tầng 1: Chạy checklist Iteration 1 (cuối Chương 2) trước hạn ba ngày, không phải đêm cuối.',
      'Tier 2: Freeze the shared core (login, layout, base DAO, DB connection) in the first slots, then everyone works only in their own slice.|||Tầng 2: Chốt lõi dùng chung (đăng nhập, layout, DAO gốc, kết nối CSDL) trong mấy slot đầu, rồi ai làm lát cắt nấy.',
      'Tier 3: If a teammate’s screen blocks yours, seed the data you need with a small SQL script and keep going; integrate when their MR lands.|||Tầng 3: Nếu màn hình của bạn chờ màn hình của đồng đội, tạo dữ liệu cần bằng một script SQL nhỏ và làm tiếp; tích hợp khi MR của họ vào.',
    ],
    nop: ['repo', 'demo', 'anh'],
  },
  {
    so: 3, slug: 'swp391-moc-3',
    ten: 'Iteration 2 (20%) — the core workflow, real tests and real code review|||Iteration 2 (20%) — luồng nghiệp vụ lõi, test thật và review code thật',
    sauChuong: 'Chapters 4–5 — Iterations, Project Tracking, LOC grading, testing|||Chương 4–5 — Iteration, Project Tracking, chấm LOC, kiểm thử',
    yeuCau: [
      'First close every Defect/Leakage from the Iteration-1 feedback (labelled issues closed with an MR link)|||Trước tiên đóng mọi Defect/Leakage từ nhận xét Iteration 1 (issue có label, đóng kèm link MR)',
      '3–4 new screens per member, aiming at higher complexity: the core workflow with states, rules and a transaction|||Mỗi người 3–4 màn hình mới, nhắm độ phức tạp cao hơn: luồng lõi có trạng thái, luật và transaction',
      'System Test (Template3): a sheet for each of your screens with normal, abnormal and boundary cases, run in at least 2 rounds, defects logged as issues|||System Test (Template3): mỗi màn hình của bạn một sheet có case bình thường, bất thường và biên, chạy ít nhất 2 vòng, lỗi ghi thành issue',
      'Real code review: each MR gets a checklist comment from a reviewer; nobody merges their own MR|||Review code thật: mỗi MR có bình luận theo checklist của người review; không ai tự merge MR của mình',
      'Weekly Reports and the AI Usage log are current; Project Tracking agrees with the issue board; tag iter2, database/iter2/, demo videos|||Weekly Report và nhật ký AI Usage cập nhật; Project Tracking khớp với bảng issue; tag iter2, database/iter2/, video demo',
    ],
    nangCao: [
      'JUnit/Jest tests for every business rule of the workflow|||Test JUnit/Jest cho mọi business rule của luồng',
      'Docker Compose so the whole team runs the same database (Chapter 9)|||Docker Compose để cả nhóm chạy cùng một cơ sở dữ liệu (Chương 9)',
      'An integration test that crosses screens owned by different members|||Một test tích hợp đi qua màn hình của nhiều thành viên',
    ],
    datKhi: [
      'Zero open Defect/Leakage issues left from Iteration 1|||Không còn issue Defect/Leakage nào của Iteration 1 đang mở',
      'Each of your screens has at least 8 test cases including 2 abnormal and 1 boundary, with a result and date for every round|||Mỗi màn hình của bạn có ít nhất 8 test case, trong đó 2 case bất thường và 1 case biên, có kết quả và ngày cho từng vòng',
      'Every MR merged in Iteration 2 shows a review comment or approval from another member|||Mọi MR đã merge trong Iteration 2 có bình luận review hoặc approval của thành viên khác',
      'On the iter2 tag the core workflow runs end to end across screens of at least two members|||Trên tag iter2, luồng lõi chạy trọn qua màn hình của ít nhất hai thành viên',
      'For every row, the Product-sheet status equals the status of its issue|||Với mọi dòng, trạng thái trong sheet Product bằng trạng thái của issue tương ứng',
    ],
    goiY: [
      'Tier 1: Start with a 15-minute retro of Iteration 1 (keep / drop / try) and write it into the Weekly Report.|||Tầng 1: Bắt đầu bằng 15 phút retro Iteration 1 (giữ / bỏ / thử) và ghi vào Weekly Report.',
      'Tier 2: Choose screens that raise your Converted-LOC: one Complex screen (workflow + transaction) is worth four Simple CRUD screens.|||Tầng 2: Chọn màn hình nâng Converted-LOC: một màn hình Complex (luồng + transaction) bằng bốn màn hình CRUD Simple.',
      'Tier 3: Draft test cases with prompt #9 (lesson 5.4), check each against your BR list, and log it in Template5.|||Tầng 3: Nháp test case bằng prompt #9 (bài 5.4), soát từng case với danh sách BR, rồi ghi vào Template5.',
    ],
    nop: ['repo', 'demo', 'anh'],
  },
  {
    so: 4, slug: 'swp391-moc-4',
    ten: 'Iteration 3 (25%) — finish, regress everything, ship the final package|||Iteration 3 (25%) — hoàn tất, test hồi quy mọi thứ, nộp gói cuối',
    sauChuong: 'Chapter 6 — Iteration releases, packages & deployment|||Chương 6 — Phát hành iteration, gói nộp & triển khai',
    yeuCau: [
      'Finish the remaining screens; freeze the scope with the teacher in a Q&A issue — what is out goes into Limitations|||Làm xong các màn hình còn lại; chốt phạm vi với giảng viên trong issue Q&A — phần không làm ghi vào Limitations',
      'Regression: rerun the System Test of ALL completed screens (Iteration 3 re-grades every screen) and fix what it finds|||Hồi quy: chạy lại System Test của TẤT CẢ màn hình đã xong (Iteration 3 chấm lại mọi màn hình) và sửa lỗi tìm thấy',
      'Complete and consistent package: SRS+SDS or RDS, final Project Tracking, Template3, Template5, Template6, a DB script that restores on an empty schema with demo data|||Gói nộp đầy đủ và khớp nhau: SRS+SDS hoặc RDS, Project Tracking cuối, Template3, Template5, Template6, DB script khôi phục được lên schema trống kèm dữ liệu demo',
      'The build runs outside the IDE (WAR on Tomcat or Docker Compose); README with run steps and one demo account per role|||Bản build chạy ngoài IDE (WAR trên Tomcat hoặc Docker Compose); README có các bước chạy và mỗi vai trò một tài khoản demo',
      'Tag iter3 on exactly the commit you submit; demo videos; all links checked|||Gắn tag iter3 đúng commit nộp; video demo; kiểm mọi link',
    ],
    nangCao: [
      'A public deployment on a free tier|||Một bản triển khai công khai trên gói miễn phí',
      'CI green on the iter3 tag|||CI xanh trên tag iter3',
      'A paging index on the heaviest list, checked with EXPLAIN|||Index cho danh sách nặng nhất, kiểm bằng EXPLAIN',
    ],
    datKhi: [
      'A teammate who did not write the README runs the iter3 tag from scratch on another machine|||Một đồng đội không viết README chạy được tag iter3 từ đầu trên máy khác',
      'Every use case in the diagram is either Done in tracking or listed in Limitations|||Mọi use case trong sơ đồ hoặc Done trong tracking, hoặc có trong Limitations',
      'Regression results are recorded for 100% of completed screens, with no Critical or High defect open|||Kết quả hồi quy được ghi cho 100% màn hình đã xong, không còn lỗi Critical hoặc High đang mở',
      'Screen, table and actor names are the same in the documents, the tracking file and the code|||Tên màn hình, bảng và actor giống nhau trong tài liệu, file tracking và code',
      'Every package link opens in a private browser window (no "request access")|||Mọi link trong gói mở được ở cửa sổ ẩn danh (không bị "yêu cầu quyền truy cập")',
    ],
    goiY: [
      'Tier 1: Stop new features 4–5 days before the deadline; the last days are for regression and documents.|||Tầng 1: Dừng tính năng mới trước hạn 4–5 ngày; mấy ngày cuối dành cho hồi quy và tài liệu.',
      'Tier 2: Do the consistency check of lesson P.5 in pairs — one reads aloud, one checks.|||Tầng 2: Làm phép soát khớp ở bài P.5 theo cặp — một người đọc to, một người kiểm.',
      'Tier 3: If it only runs inside NetBeans, follow lesson 6.3 (WAR) or 9.1 (Docker).|||Tầng 3: Nếu chỉ chạy được trong NetBeans, làm theo bài 6.3 (WAR) hoặc 9.1 (Docker).',
    ],
    nop: ['repo', 'demo', 'anh'],
  },
  {
    so: 5, slug: 'swp391-moc-5',
    ten: 'Final Presentation rehearsal (40%) — slides, demo script, live change, Q&A drill|||Tổng duyệt Final Presentation (40%) — slide, kịch bản demo, sửa code tại chỗ, luyện hỏi đáp',
    sauChuong: 'Chapter 7 — Teamwork, RDS/final report & final presentation|||Chương 7 — Làm việc nhóm, RDS/báo cáo cuối & thuyết trình cuối kỳ',
    yeuCau: [
      'Slides from Template7 built only from what you submitted: overview, use cases per actor, screen flow, database, packages, main screens, demo, team process|||Slide từ Template7, chỉ dựng từ những gì đã nộp: tổng quan, use case theo actor, screen flow, CSDL, package, màn hình chính, demo, quy trình nhóm',
      'A written demo script: 2–3 main workflows end to end on clean demo data, including one rule violation; a backup video in case the live demo fails|||Kịch bản demo viết ra: 2–3 luồng chính chạy trọn trên dữ liệu demo sạch, có một lần vi phạm luật; video dự phòng nếu demo trực tiếp hỏng',
      'Each member: a 2-minute code walkthrough of one of their screens (controller → service → DAO → SQL) and one small live change|||Mỗi thành viên: 2 phút đi qua code một màn hình của mình (controller → service → DAO → SQL) và một thay đổi nhỏ tại chỗ',
      'Two timed 15-minute rehearsals with questions from lesson P.6; record them and fix the weakest answers|||Hai lần tổng duyệt 15 phút có bấm giờ với câu hỏi từ bài P.6; quay lại và sửa các câu trả lời yếu nhất',
      'Contribution evidence ready: Converted-LOC per member in tracking, issues and MRs per member, the AI Usage log|||Bằng chứng đóng góp sẵn sàng: Converted-LOC từng người trong tracking, issue và MR theo từng người, nhật ký AI Usage',
    ],
    nangCao: [
      'Rehearse with a student from another team acting as the examiner|||Tổng duyệt với một bạn nhóm khác đóng vai giám khảo',
      'An English version of the slides — useful again at your OJT interview|||Một bản slide tiếng Anh — dùng lại được khi phỏng vấn OJT',
      'A one-page architecture diagram for the Q&A|||Một sơ đồ kiến trúc một trang cho phần hỏi đáp',
    ],
    datKhi: [
      'The rehearsal fits in 15 minutes, every member speaks, and the demo does not crash on fresh data|||Buổi tổng duyệt vừa 15 phút, mọi thành viên đều nói, và demo không lỗi trên dữ liệu mới',
      'Each member answered at least 5 questions from P.6 without notes, pointing at the file and line|||Mỗi thành viên trả lời được ít nhất 5 câu ở P.6 không cần ghi chú, chỉ đúng tệp và dòng',
      'Each member made one live change (label, validation, sort order) in 3 minutes or less|||Mỗi thành viên sửa được một chỗ tại chỗ (nhãn, kiểm lỗi, thứ tự sắp xếp) trong tối đa 3 phút',
      'The slides show no feature that is not in the product, and every use case shown is Done|||Slide không có tính năng nào không có trong sản phẩm, và mọi use case trình bày đều Done',
    ],
    goiY: [
      'Tier 1: Build the slides from the documents, never the other way round — examiners compare them.|||Tầng 1: Dựng slide từ tài liệu, đừng làm ngược lại — giám khảo đối chiếu hai thứ đó.',
      'Tier 2: Give each member the workflow that runs through their own screens, so the demo and the code walkthrough tell one story.|||Tầng 2: Giao cho mỗi người luồng đi qua chính màn hình của họ, để demo và phần đi qua code kể cùng một câu chuyện.',
      'Tier 3: Use the run-sheet and rehearsal checklist in lesson 7.3 and the answer frames in P.6.|||Tầng 3: Dùng bảng phân thời gian và checklist tập dượt ở bài 7.3 cùng khung trả lời ở P.6.',
    ],
    nop: ['repo', 'demo', 'anh'],
  },
];

/* ═══════════════════════════════ BẢO VỆ ═══════════════════════════════ */
const baoVe = {
  rubric: [
    { tieuChi: 'Requirement analysis|||Phân tích yêu cầu', diem: 2, moTa: 'Actors and use cases traced to real screens; business rules confirmed with the PO; alternative and exception flows; honest Limitations. (20% of the Final Presentation)|||Actor và use case truy được tới màn hình thật; business rule đã xác nhận với PO; luồng thay thế và ngoại lệ; Limitations trung thực. (20% của Final Presentation)' },
    { tieuChi: 'Software design|||Thiết kế phần mềm', diem: 2, moTa: 'The database and packages/layers match the code; keys and relationships justified; at least one design decision explained with its trade-off. (20%)|||CSDL và package/tầng khớp với code; khoá và quan hệ có lý do; giải thích được ít nhất một quyết định thiết kế cùng cái giá của nó. (20%)' },
    { tieuChi: 'Working product|||Sản phẩm chạy được', diem: 2.5, moTa: 'The main workflows run end to end on clean data; validation, roles and error messages work; no crash. (part of the 40% product criterion)|||Luồng chính chạy trọn trên dữ liệu sạch; kiểm lỗi, phân quyền và thông báo lỗi hoạt động; không lỗi văng. (một phần tiêu chí sản phẩm 40%)' },
    { tieuChi: 'Code ownership & live change|||Làm chủ code & sửa tại chỗ', diem: 1.5, moTa: 'Each member explains their own screens down to the SQL and makes a small change live; AI-generated parts are understood. (rest of the 40%)|||Mỗi thành viên giải thích màn hình của mình tới tận câu SQL và sửa một chỗ nhỏ tại chỗ; phần AI sinh ra cũng hiểu được. (phần còn lại của 40%)' },
    { tieuChi: 'Process & quality evidence|||Bằng chứng quy trình & chất lượng', diem: 1, moTa: 'Issues, reviewed MRs and iteration tags; tracking consistent with the board; System Test rounds and defects recorded. (team working 20%)|||Issue, MR có review và tag từng iteration; tracking khớp với bảng việc; vòng System Test và lỗi được ghi lại. (làm việc nhóm 20%)' },
    { tieuChi: 'Presentation & Q&A|||Trình bày & hỏi đáp', diem: 1, moTa: 'On time, every member presents and answers, answers are direct and honest (including AI usage and what went wrong). (team working 20%)|||Đúng giờ, mọi thành viên trình bày và trả lời, câu trả lời thẳng và trung thực (kể cả việc dùng AI và điều chưa ổn). (làm việc nhóm 20%)' },
  ],
  cauHoiMau: [
    'Walk us through one request of your main workflow, from the click to the database and back. Which files does it pass through?|||Đi qua một request của luồng chính, từ cú bấm tới CSDL rồi quay lại. Nó đi qua những tệp nào?',
    'What is the hardest business rule in your system? Where is it enforced — UI, server or database constraint — and what happens if two users trigger it at the same time?|||Business rule khó nhất của hệ thống là gì? Nó được chặn ở đâu — giao diện, server hay ràng buộc CSDL — và chuyện gì xảy ra nếu hai người cùng kích hoạt nó một lúc?',
    'Show the requirement that changed most during the project. Who asked for the change, where is it recorded, and what did you update because of it?|||Cho xem yêu cầu thay đổi nhiều nhất trong dự án. Ai yêu cầu thay đổi, ghi ở đâu, và nhóm đã cập nhật những gì vì nó?',
    'Your use-case diagram has this many use cases. Which are not done, and why is that acceptable?|||Use case diagram có chừng này use case. Cái nào chưa làm, và vì sao điều đó chấp nhận được?',
    'Why is this relationship many-to-many? Show the junction table and the constraint that stops duplicates.|||Vì sao quan hệ này là nhiều-nhiều? Cho xem bảng trung gian và ràng buộc chặn bản ghi trùng.',
    'We add a new role that may only read reports. What do you change — filter, menu, database, tests?|||Thêm một vai trò chỉ được xem báo cáo. Nhóm sửa những gì — filter, menu, CSDL, test?',
    'Where do you validate input on this screen, and why is client-side validation not enough?|||Màn hình này kiểm lỗi dữ liệu nhập ở đâu, và vì sao kiểm ở phía client là chưa đủ?',
    'How is this screen protected from SQL injection and from script injection in the output? Show the code.|||Màn hình này được bảo vệ khỏi SQL injection và chèn script ở đầu ra thế nào? Cho xem code.',
    'How are passwords stored, and what happens when a user forgets one?|||Mật khẩu được lưu thế nào, và chuyện gì xảy ra khi người dùng quên mật khẩu?',
    'This list grows to 10,000 rows. What happens to the page? Show the paging query.|||Danh sách này lên tới 10.000 dòng. Trang sẽ ra sao? Cho xem câu truy vấn phân trang.',
    'Which action writes to two tables? What happens if the second write fails? Show the transaction.|||Thao tác nào ghi vào hai bảng? Nếu lần ghi thứ hai lỗi thì sao? Cho xem transaction.',
    'Open your System Test sheet. Show an abnormal test case and the defect it found. How was it fixed and retested?|||Mở sheet System Test của em. Cho xem một test case bất thường và lỗi nó tìm ra. Lỗi được sửa và test lại thế nào?',
    'What is the difference between a Defect and a Leakage in your tracking, and how many Leakages did your team have?|||Defect và Leakage trong tracking của nhóm khác nhau thế nào, và nhóm có bao nhiêu Leakage?',
    'How did your team split the work, and how can we verify who wrote this screen?|||Nhóm chia việc thế nào, và làm sao chúng tôi kiểm được ai viết màn hình này?',
    'Show a merge request that was reviewed. What did the reviewer ask you to change?|||Cho xem một merge request đã được review. Người review yêu cầu em sửa gì?',
    'Tell us about a real merge conflict: which file, why it happened, how you resolved it.|||Kể về một xung đột merge thật: tệp nào, vì sao xảy ra, giải quyết thế nào.',
    'Which parts did AI help with? Show one AI output you rejected or corrected, and why.|||AI giúp ở phần nào? Cho xem một đầu ra AI mà em đã bỏ hoặc sửa, và vì sao.',
    'Which of your screens is Complex in the tracking file, and what makes it Complex rather than Medium?|||Màn hình nào của em là Complex trong file tracking, và điều gì làm nó Complex chứ không phải Medium?',
    'Change it now: add a filter by status to this list, or change this field’s maximum length to 100.|||Sửa ngay: thêm bộ lọc theo trạng thái cho danh sách này, hoặc đổi độ dài tối đa của trường này thành 100.',
    'If the deadline had been one week earlier, which feature would you have cut, and why that one?|||Nếu hạn nộp sớm hơn một tuần, em sẽ cắt tính năng nào, và vì sao là nó?',
    'What happens if a logged-in user types the URL of a screen their role may not see?|||Chuyện gì xảy ra nếu người dùng đã đăng nhập gõ URL của màn hình mà vai trò của họ không được xem?',
    'How do you run this on another machine? Which configuration lives outside the code?|||Làm sao chạy hệ thống này trên máy khác? Cấu hình nào nằm ngoài code?',
    'Explain the status flow of your main entity. Who may move it from one state to the next, and where is that checked?|||Giải thích luồng trạng thái của thực thể chính. Ai được chuyển nó từ trạng thái này sang trạng thái kế, và điều đó được kiểm ở đâu?',
    'Which non-functional requirement did you consider — performance, security, usability — and how did you test it?|||Nhóm đã tính tới yêu cầu phi chức năng nào — hiệu năng, bảo mật, khả năng dùng — và đã test nó thế nào?',
    'What would you redesign in the database if you had one more iteration?|||Nếu có thêm một iteration, em sẽ thiết kế lại gì trong CSDL?',
    'What went wrong in your team, and what will you do differently in your next project or at your internship?|||Điều gì đã không ổn trong nhóm, và em sẽ làm khác đi thế nào ở dự án sau hoặc khi đi thực tập?',
  ],
  chuanBi: [
    'The iter3 tag runs from a clean clone on the presentation laptop (or via Docker); the database is restored with demo data; one demo account per role is ready (no real passwords)|||Tag iter3 chạy được từ một bản clone sạch trên laptop thuyết trình (hoặc qua Docker); CSDL đã khôi phục kèm dữ liệu demo; mỗi vai trò sẵn một tài khoản demo (không dùng mật khẩu thật)',
    'Slides (Template7) agree with the documents; every use case shown is Done; Limitations are listed honestly|||Slide (Template7) khớp với tài liệu; mọi use case trình bày đều Done; Limitations ghi trung thực',
    'Demo script printed; backup demo video stored offline on the laptop|||Kịch bản demo in sẵn; video demo dự phòng lưu offline trên laptop',
    'Each member knows their own screens’ files, SQL and rules, and has rehearsed one live change|||Mỗi thành viên nắm tệp, câu SQL và luật của màn hình mình, và đã tập một lần sửa tại chỗ',
    'Evidence open in tabs: issue board, merged MR list, Product sheet, Template3, Template5|||Bằng chứng mở sẵn trong các tab: bảng issue, danh sách MR đã merge, sheet Product, Template3, Template5',
    'Two timed rehearsals done; the Q&A drill of lesson P.6 done by every member|||Đã tổng duyệt hai lần có bấm giờ; mọi thành viên đã luyện hỏi đáp ở bài P.6',
    'Arrive early: test projector/HDMI, run everything locally, keep a phone hotspot as a network fallback|||Đến sớm: thử máy chiếu/HDMI, chạy mọi thứ cục bộ, sẵn hotspot điện thoại phòng mất mạng',
    'An honest one-line answer ready for "what did AI do?" and "what is not finished?"|||Sẵn một câu trả lời trung thực cho "AI đã làm gì?" và "phần nào chưa xong?"',
  ],
};

export const duAn = { version: 1, gioiThieu: `${GIOI_THIEU_EN}|||${GIOI_THIEU_VI}`, deTai, tuChon, moc, baoVe };

/* ═══════════════════ AI LÀM GÌ + KHUNG MẪU CHO TỪNG MỐC (chỉ để hiển thị, không vào duAn) ═══════════════════ */
// [vai trò, EN, VI]
const AI_LAM = {
  1: [
    ['Leader', 'Books the topic Q&A with the teacher, drafts the charter, runs the first planning meeting', 'Đặt lịch hỏi duyệt đề tài với giảng viên, nháp hợp đồng nhóm, chủ trì buổi lập kế hoạch đầu'],
    ['Release keeper', 'Creates the repo, protects main, adds labels/milestones/templates, writes the README run steps', 'Tạo repo, bảo vệ main, thêm label/milestone/template, viết các bước chạy trong README'],
    ['Doc keeper', 'Creates the Project Tracking file and docs/ skeleton; owns the glossary', 'Tạo file Project Tracking và khung docs/; giữ glossary'],
    ['QA keeper', 'Writes the Definition of Done and the review checklist in the charter', 'Viết Definition of Done và checklist review trong hợp đồng nhóm'],
    ['Every member', 'Counts and claims their screens in the Product sheet; clones, runs, merges one MR', 'Đếm và nhận màn hình của mình trong sheet Product; clone, chạy, merge một MR'],
  ],
  2: [
    ['Every member', 'Specs, designs, codes and tests their own 3–4 screens; records their demo video', 'Đặc tả, thiết kế, code và test 3–4 màn hình của mình; quay video demo'],
    ['Leader', 'Freezes the shared core early; checks progress against the Product sheet twice a week', 'Chốt sớm phần lõi dùng chung; soát tiến độ với sheet Product hai lần mỗi tuần'],
    ['Doc keeper', 'Merges everyone’s sections into SRS/RDS v1; keeps names consistent', 'Gộp phần của mọi người vào SRS/RDS v1; giữ tên gọi thống nhất'],
    ['Release keeper', 'Exports database/iter1/, tags iter1, checks every link in a private window', 'Xuất database/iter1/, gắn tag iter1, kiểm mọi link ở cửa sổ ẩn danh'],
  ],
  3: [
    ['Every member', 'Fixes their Iter1 defects first, then builds the workflow screens and their Template3 sheets', 'Sửa lỗi Iter1 của mình trước, rồi xây màn hình của luồng và sheet Template3 tương ứng'],
    ['QA keeper', 'Runs round 2 of the tests across members, logs defects, watches Defect vs Leakage', 'Chạy vòng test thứ 2 chéo giữa các thành viên, ghi lỗi, theo dõi Defect và Leakage'],
    ['Reviewer of the week', 'Reviews MRs with the checklist within 24 hours', 'Review MR theo checklist trong vòng 24 giờ'],
    ['Leader', 'Runs the retro, updates the Weekly Report, raises blockers with the teacher', 'Chủ trì retro, cập nhật Weekly Report, báo vướng mắc với giảng viên'],
  ],
  4: [
    ['Leader', 'Freezes scope with the teacher; schedules feature stop and regression days', 'Chốt phạm vi với giảng viên; xếp ngày dừng tính năng và ngày hồi quy'],
    ['QA keeper', 'Owns the regression round for every completed screen', 'Phụ trách vòng hồi quy cho mọi màn hình đã xong'],
    ['Doc keeper', 'Final RDS / SRS+SDS, consistency check with code and tracking', 'RDS / SRS+SDS cuối, soát khớp với code và tracking'],
    ['Release keeper', 'WAR/Docker build, DB restore test, tag iter3, package links', 'Build WAR/Docker, thử khôi phục CSDL, tag iter3, link gói nộp'],
  ],
  5: [
    ['Leader', 'Run-sheet and timing; opens and closes the presentation', 'Bảng phân thời gian và bấm giờ; mở đầu và kết thúc bài thuyết trình'],
    ['Every member', 'Presents their part, walks through one screen’s code, makes one live change', 'Trình bày phần của mình, đi qua code một màn hình, sửa một chỗ tại chỗ'],
    ['Doc keeper', 'Builds slides from the submitted documents', 'Dựng slide từ tài liệu đã nộp'],
    ['QA keeper', 'Prepares clean demo data and the backup video', 'Chuẩn bị dữ liệu demo sạch và video dự phòng'],
  ],
};

const KHUNG = {
  1: { en: 'What your repository looks like at the end of the kickoff', vi: 'Repository của bạn trông thế nào khi xong khởi động', code: `
<team-repo>/
├── README.md                 # what it is, how to run (JDK/Node + DB), demo accounts, link to the approved Q&A issue
├── docs/
│   ├── team-charter.md       # P.2 template — one commit from every member
│   ├── proposal.md           # one-page proposal sent to the teacher
│   └── Project_Tracking.xlsx # Use Cases + Product sheets (draft)
├── database/
│   └── iter1/                # schema.sql, data.sql (empty for now)
├── src/ …                    # walking skeleton: layout + login stub
└── .gitlab/                  # (or .github/)
    ├── issue_templates/Req.md, Defect.md
    └── merge_request_templates/Default.md` },
  2: { en: 'One screen, end to end — the trail the teacher follows', vi: 'Một màn hình, trọn đường — dấu vết giảng viên lần theo', code: `
Product sheet row  "Court list & search · Medium · owner: you · ITER1"
  └─ Req issue #12  [Req] Court list & search         milestone Iter1, label Req, assignee: you
       ├─ docs: UC-04 spec (main / alternative / exception) + BR-02 + screen spec table (fields, filters, paging)
       ├─ design: class + sequence diagram of the search flow
       ├─ branch  feature/12-court-list
       ├─ MR !18  "Req #12: court list & search"   reviewer: teammate, checklist ticked
       ├─ test:  Template3 sheet "Court list" — 8+ cases, round 1 results
       └─ release: tag iter1 → database/iter1/ → your demo video (3–5 min)` },
  3: { en: 'A minimal System Test sheet for one screen (Template3 columns)', vi: 'Một sheet System Test tối thiểu cho một màn hình (cột theo Template3)', code: `
ID     | Description                         | Procedure                         | Expected                          | R1   | R2   | Date  | Note
BK-01  | Book a free slot (normal)           | login customer → court 1 → 18:00  | booking Pending, slot shows booked| Pass | Pass | 21/11 |
BK-02  | Book an already booked slot         | second customer → same slot       | "Slot is no longer available"     | Fail | Pass | 21/11 | Defect #41
BK-03  | Cancel 1h59m before start (boundary)| cancel at 16:01 for 18:00         | refused, BR-04 message            | Pass | Pass | 22/11 |
BK-04  | Guest tries to book                 | open /booking without login       | redirected to login               | Pass | Pass | 22/11 |
…      | ≥ 8 per screen: ≥ 2 abnormal, ≥ 1 boundary, every BR of the screen at least once` },
  4: { en: 'Final package — check every line before you tag iter3', vi: 'Gói nộp cuối — soát từng dòng trước khi gắn tag iter3', code: `
[ ] tag iter3 = the commit you submit          git tag -a iter3 -m "Iteration 3 final" && git push origin iter3
[ ] database/iter3/schema.sql + data.sql        restore on an EMPTY schema, then log in with every demo account
[ ] README: run steps, demo accounts per role, known limitations
[ ] docs/: RDS (or SRS + SDS), Project_Tracking.xlsx, SystemTest.xlsx, AI_Usage.xlsx, Weekly_Report.xlsx
[ ] demo videos: one per member, 3–5 min, names = what the teacher asked for
[ ] runs outside the IDE: WAR on Tomcat or docker compose up
[ ] every link opened in a private window` },
  5: { en: 'A 15-minute run-sheet for a 5-member team', vi: 'Bảng phân thời gian 15 phút cho nhóm 5 người', code: `
00:00  Leader     problem, actors, scope, what is NOT done (1.5')
01:30  Member B   use cases per actor + screen flow (2')
03:30  Member C   database + packages, one design decision (2')
05:30  Members    live demo of 2–3 workflows, each on own screens (6')
11:30  Member D   process evidence: board, MRs, tags, tests, AI usage (1.5')
13:00  Leader     lessons learned, thanks — then Q&A (examiners pick who answers)
Backup: offline demo video at 05:30 if the live system fails` },
};

const TXT = {
  en: { eyebrow: (n, c) => `Team project · Milestone ${n} of ${moc.length} · after ${c}`, who: '👥 Who does what in this milestone', req: '📌 Required', adv: '⭐ Optional extras', pass: '✅ Pass when', hint: '💡 Hints (open tier by tier)', map: '🗺 What it means for each suggested topic', demo: '🧩 Skeleton (a frame to start from — not a solution)', submit: '📤 Submit', submitTxt: (nop) => `Submit ${nop.map((x) => ({ repo: 'the link to your team repo and tag (or your MR list)', demo: 'your demo video link', anh: 'a screenshot (board, Product sheet or screen)' }[x])).join(', ')} in the box below, add a short note (what was hard, what you skipped), then mark the milestone done.`, own: 'Own topic? Apply each requirement to your own screens — the AI reviewer already checked that your topic fits these milestones.', tier: 'Tier', role: 'Role', task: 'Task', note: 'Hats are extra jobs, not exemptions: the leader and every keeper still own 3–4 screens per iteration.' },
  vi: { eyebrow: (n, c) => `Dự án nhóm · Mốc ${n}/${moc.length} · sau ${c}`, who: '👥 Ai làm gì trong mốc này', req: '📌 Bắt buộc', adv: '⭐ Nâng cao (tuỳ chọn)', pass: '✅ Đạt khi', hint: '💡 Gợi ý (mở dần từng tầng)', map: '🗺 Mốc này với từng đề tài gợi ý', demo: '🧩 Khung mẫu (khung để bắt đầu — không phải lời giải)', submit: '📤 Nộp bài', submitTxt: (nop) => `Nộp ${nop.map((x) => ({ repo: 'link repo nhóm và tag (hoặc danh sách MR của bạn)', demo: 'link video demo của bạn', anh: 'ảnh chụp (bảng issue, sheet Product hoặc màn hình)' }[x])).join(', ')} ở ô bên dưới, ghi chú ngắn (chỗ khó, phần bỏ qua), rồi đánh dấu xong mốc.`, own: 'Đề tài tự chọn? Áp từng yêu cầu vào màn hình của bạn — AI đã xét đề tài của bạn phủ đủ các mốc này.', tier: 'Tầng', role: 'Vai', task: 'Việc', note: 'Vai là việc thêm, không phải miễn: trưởng nhóm và mọi "keeper" vẫn làm 3–4 màn hình mỗi iteration.' },
};

function mapTable(so, i) {
  const rows = deTai.map((d) => {
    const x = (d.banDoChuong || []).find((b) => b.moc === so);
    return `<tr><td><b>${esc(L(d.ten)[i])}</b></td><td>${x ? esc(L(x.dung)[i]) : '—'}</td></tr>`;
  }).join('');
  return `<div style="overflow-x:auto"><table><thead><tr><th>${i === 0 ? 'Topic' : 'Đề tài'}</th><th>${i === 0 ? 'This milestone builds' : 'Mốc này xây'}</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

function whoTable(so, i) {
  const t = TXT[i === 0 ? 'en' : 'vi'];
  const rows = (AI_LAM[so] || []).map(([r, en, vi]) => `<tr><td><b>${esc(r)}</b></td><td>${esc(i === 0 ? en : vi)}</td></tr>`).join('');
  return `<div style="overflow-x:auto"><table><thead><tr><th>${t.role}</th><th>${t.task}</th></tr></thead><tbody>${rows}</tbody></table></div><p class="ghi-chu">${t.note}</p>`;
}

function mocContent(m) {
  const side = (i) => {
    const k = i === 0 ? 'en' : 'vi';
    const t = TXT[k];
    const kh = KHUNG[m.so];
    const hints = m.goiY.map((g, j) => `<details><summary>${t.tier} ${j + 1}</summary><p>${esc(L(g)[i].replace(/^Tier \d+: |^Tầng \d+: /, ''))}</p></details>`).join('\n');
    return [
      `<span class="eyebrow">${esc(t.eyebrow(m.so, L(m.sauChuong)[i]))}</span>`,
      `<h2>${esc(L(m.ten)[i])}</h2>`,
      `<p class="lead">${i === 0 ? 'This milestone is a real SWP391 deadline. "Your" means your own screens — you are graded on them one by one; "team" means the shared package everybody is judged on.' : 'Mốc này là một hạn nộp thật của SWP391. "Của bạn" là các màn hình của chính bạn — bạn được chấm theo từng màn hình đó; "của nhóm" là gói nộp chung mà cả nhóm cùng bị đánh giá.'}</p>`,
      `<h3>${t.who}</h3>`, whoTable(m.so, i),
      `<h3>${t.req}</h3>`, ol(m.yeuCau, i),
      m.nangCao?.length ? `<h3>${t.adv}</h3>${ul(m.nangCao, i)}` : '',
      `<h3>${t.pass}</h3>`, ul(m.datKhi, i),
      kh ? `<h3>${t.demo}</h3><p>${esc(kh[k])}</p>${pre(kh.code)}` : '',
      `<h3>${t.hint}</h3>`, hints,
      `<h3>${t.map}</h3>`, mapTable(m.so, i), `<p><i>${t.own}</i></p>`,
      `<h3>${t.submit}</h3>`, `<p>${t.submitTxt(m.nop)}</p>`,
    ].filter(Boolean).join('\n');
  };
  return bi(side(0), side(1));
}

export const mocBai = moc.map((m) => ({
  title: `🛠 Project milestone ${m.so} — ${L(m.ten)[0]}|||🛠 Mốc dự án ${m.so} — ${L(m.ten)[1]}`,
  slug: m.slug,
  type: 'EXERCISE',
  mocDuAn: m.so,
  description: `Mốc dự án ${m.so}/${moc.length}: ${L(m.ten)[1]}. Sau ${L(m.sauChuong)[1]} — ai làm gì, bắt buộc, nâng cao, "Đạt khi", khung mẫu, gợi ý theo tầng, nộp link repo/tag + video + ảnh.`,
  content: mocContent(m),
}));

/* ═══════════════════════════════ BÀI BẢO VỆ ═══════════════════════════════ */
function baoVeContent() {
  const side = (i) => {
    const so = (x) => String(x).replace('.', i === 0 ? '.' : ',');
    const rubric = `<div style="overflow-x:auto"><table><thead><tr><th>${i === 0 ? 'Criterion' : 'Tiêu chí'}</th><th>${i === 0 ? 'Points' : 'Điểm'}</th><th>${i === 0 ? 'What the panel looks for' : 'Hội đồng nhìn vào'}</th></tr></thead><tbody>${baoVe.rubric.map((r) => `<tr><td>${esc(L(r.tieuChi)[i])}</td><td>${so(r.diem)}</td><td>${esc(L(r.moTa)[i])}</td></tr>`).join('')}<tr><td><b>${i === 0 ? 'Total' : 'Tổng'}</b></td><td><b>10</b></td><td></td></tr></tbody></table></div>`;
    return [
      `<span class="eyebrow">${i === 0 ? 'Team project · Final step' : 'Dự án nhóm · Bước cuối'}</span>`,
      `<h2>${i === 0 ? '🎓 Finish & defend your SWP391 project' : '🎓 Hoàn thiện & bảo vệ đồ án SWP391'}</h2>`,
      `<p class="lead">${i === 0 ? 'Five milestones later your package is in and the Final Presentation (40%) is ahead — judged by two teachers who are not your class teacher, and you must score at least 5 to pass. This lesson is the last mile: close the gaps, rehearse, then practise the oral defence about <b>your own screens</b> in the AI defence room.' : 'Sau năm mốc, gói nộp đã xong và trước mặt là Final Presentation (40%) — do hai giảng viên không phải giảng viên lớp chấm, và phải đạt ít nhất 5 mới qua môn. Bài này là chặng cuối: lấp chỗ thiếu, tập dượt, rồi luyện vấn đáp về <b>chính các màn hình của bạn</b> trong phòng bảo vệ AI.'}</p>`,
      `<h3>${i === 0 ? '1 · Finish — the checklist before the day' : '1 · Hoàn thiện — checklist trước ngày bảo vệ'}</h3>`,
      ul(baoVe.chuanBi, i),
      `<h3>${i === 0 ? '2 · How you are graded here (10 points, mirroring 20/40/20/20)' : '2 · Chấm thế nào ở đây (10 điểm, phản chiếu 20/40/20/20)'}</h3>`, rubric,
      `<div class="callout">${i === 0 ? 'The real course checks the presentation separately from the iterations: OG ≥ 5 <b>and</b> Final Presentation ≥ 5 (lesson 0.2). A member who cannot explain their own screen loses the product marks for it, whatever the team’s slides look like.' : 'Môn thật xét buổi thuyết trình tách riêng khỏi các iteration: OG ≥ 5 <b>và</b> Final Presentation ≥ 5 (bài 0.2). Thành viên không giải thích được màn hình của mình thì mất điểm sản phẩm của màn hình đó, slide của nhóm đẹp tới đâu cũng vậy.'}</div>`,
      `<h3>${i === 0 ? `3 · Questions the panel often asks (${baoVe.cauHoiMau.length})` : `3 · Câu hội đồng hay hỏi (${baoVe.cauHoiMau.length})`}</h3>`,
      `<p>${i === 0 ? 'Answer each out loud, pointing at the exact file, line, table or sheet row. Lesson P.6 shows how to answer (Point → Show → Why → Limit) with weak and strong examples; lessons 7.3 and the PE page hold the shorter lists of the course.' : 'Trả lời to từng câu, chỉ đúng tệp, dòng, bảng hay dòng trong sheet. Bài P.6 chỉ cách trả lời (Ý chính → Cho xem → Vì sao → Giới hạn) với ví dụ yếu và mạnh; bài 7.3 và trang PE có các danh sách ngắn của khoá.'}</p>`,
      ol(baoVe.cauHoiMau, i),
      `<h3>${i === 0 ? '4 · The AI defence room' : '4 · Phòng bảo vệ AI'}</h3>`,
      `<p>${i === 0 ? 'Below this lesson: submit your iter3 tag + demo video, then start a defence session. The AI panel reads your topic, your milestone notes and your README, asks questions like the ones above (including one live change on your own screen), scores you on the rubric and gives concrete feedback. Practise individually — the real panel questions each member separately.' : 'Dưới bài này: nộp tag iter3 + video demo, rồi bắt đầu một phiên bảo vệ. Hội đồng AI đọc đề tài, ghi chú các mốc và README của bạn, hỏi những câu giống ở trên (có một yêu cầu sửa tại chỗ trên chính màn hình của bạn), chấm theo rubric và trả nhận xét cụ thể. Luyện từng người — hội đồng thật hỏi riêng từng thành viên.'}</p>`,
      `<div class="callout ok">${i === 0 ? 'Honesty rule: say which parts came from a teammate, a tutorial or an AI assistant (it is in your Template5 anyway). Help is allowed; submitting code you cannot explain is what the "no cheating" condition is about.' : 'Luật trung thực: nói rõ phần nào từ đồng đội, từ hướng dẫn hay từ trợ lý AI (dù sao nó cũng có trong Template5). Được phép nhờ giúp; nộp code mình không giải thích được mới là chỗ điều kiện "không gian lận" nhắm tới.'}</div>`,
      `<div class="di-toi"><a class="link-card" href="${KHOA}swp391-final-exam-pe"><span class="lc-ico">🎙️</span><span class="lc-body"><span class="lc-title">${i === 0 ? 'Final Exam · PE — the Final Presentation and how it is graded' : 'Thi cuối kỳ · PE — Final Presentation và cách chấm'}</span><span class="lc-sub">${i === 0 ? 'Preparation plan, demo script and the day-of checklist.' : 'Kế hoạch chuẩn bị, kịch bản demo và checklist ngày thuyết trình.'}</span></span><span class="lc-cta">${i === 0 ? 'OPEN →' : 'MỞ →'}</span></a></div>`,
    ].join('\n');
  };
  return bi(side(0), side(1));
}

export const baoVeBai = {
  title: '🎓 Team project — finish & defend (rubric, panel questions, AI defence room)|||🎓 Dự án nhóm — hoàn thiện & bảo vệ (rubric, câu hội đồng, phòng bảo vệ AI)',
  slug: 'swp391-bao-ve-du-an',
  type: 'EXERCISE',
  baoVeDuAn: true,
  description: 'Bước cuối của dự án nhóm SWP391: checklist trước ngày bảo vệ, rubric 10 điểm phản chiếu Final Presentation 20/40/20/20, 26 câu hội đồng hay hỏi, và phòng bảo vệ AI hỏi về chính màn hình của bạn.',
  content: baoVeContent(),
};

/* ═════════════════════ LỜI MỜI ĐĂNG KÝ (nối vào cuối bài 0.1) ═════════════════════ */
export const moiDangKy = '\n' + bi(
  `<h3>🎯 Your team project starts today — and this course walks it with you</h3>
<p>SWP391 is graded on one real team project, so this course gives you a <b>step-by-step playbook</b> for it in the last section, <b>“Team project playbook”</b>: the semester week by week, a team charter, the team Git flow, starter templates for every deliverable, a review checklist, the mistakes that cost marks, and panel questions with answer frames. Five <b>🛠 Project milestone</b> lessons follow the real deadlines — Kickoff, Iteration 1, 2, 3 and the Final Presentation rehearsal — and you finish with a <b>defence</b> in the AI defence room. Open that section in week 1 and keep it next to the chapters.</p>
<p>Suggested topics: sports court booking, clinic appointments, child vaccination tracking, library management, homestay booking, an online course centre, restaurant QR ordering — or your own idea, reviewed by AI for size and coverage.</p>
<p><b>Register your course project topic below.</b></p>`,
  `<h3>🎯 Dự án nhóm bắt đầu từ hôm nay — và khoá học đi cùng bạn suốt dự án</h3>
<p>SWP391 chấm điểm trên một dự án nhóm thật, nên khoá học này có sẵn <b>cẩm nang từng bước</b> cho nó ở mục cuối, <b>"Dự án nhóm thật"</b>: cả kỳ theo từng tuần, hợp đồng nhóm, Git flow của nhóm, bộ mẫu cho mọi deliverable, checklist trước buổi review, những lỗi hay mất điểm, và câu hỏi hội đồng kèm khung trả lời. Năm bài <b>🛠 Mốc dự án</b> đi theo đúng các hạn nộp thật — Khởi động, Iteration 1, 2, 3 và tổng duyệt Final Presentation — rồi kết thúc bằng buổi <b>bảo vệ</b> trong phòng bảo vệ AI. Mở mục đó ngay tuần 1 và để nó cạnh các chương.</p>
<p>Đề tài gợi ý: đặt sân thể thao, đặt lịch phòng khám, theo dõi tiêm chủng cho trẻ, quản lý thư viện, đặt phòng homestay, trung tâm khoá học trực tuyến, gọi món nhà hàng bằng QR — hoặc ý tưởng của riêng bạn, được AI xét cỡ và độ phủ.</p>
<p><b>Hãy đăng ký đề tài dự án cuối khoá của bạn ở bên dưới.</b></p>`,
) + '\n';
