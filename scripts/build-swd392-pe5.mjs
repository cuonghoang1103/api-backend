/**
 * build-swd392-pe5.mjs — sinh content/exams/SWD392-PE5.mjs.
 *
 * Nguồn thật: "SWD392_SU25_PE_1" ("SWD392 – Software Architecture and
 * Design, Practical Exam", Summer 2025), hệ thống quản lý rạp chiếu
 * phim (cinema management). File .rar đính kèm CHÍNH folder này chỉ có
 * 1 khung mẫu .docx của môn KHÁC (SWR302) — không liên quan, không dùng.
 *
 * ⚠️ Một đoạn trả lời sinh viên tìm thấy ở nơi khác (đính kèm nhầm
 * trong .rar của folder "SU25 - PE - 1 - RE") có PHẦN khớp đúng Part
 * 1.4 của CHÍNH đề này (liệt kê trạng thái Booking: Pending/Confirmed/
 * Cancelled) — xác nhận file .doc đó thực ra là bản dán chung nhiều đề
 * khác nhau (phần đầu khớp đề flower-shop PE_2, phần Booking khớp đề
 * cinema PE_1 này). Đã tham khảo có phê phán: 3 trạng thái đó quá đơn
 * giản (thiếu bước giữ chỗ tạm thời/hết hạn giữ chỗ — một yêu cầu thực
 * tế chuẩn cho hệ thống đặt ghế), nên KHÔNG copy mà thiết kế lại đầy đủ
 * hơn (Initiated→PendingPayment→Confirmed→CheckedIn, nhánh Cancelled ở
 * 2 điểm khác nhau kèm holdExpired).
 *
 * Part 3 pseudocode là Observer pattern (Subject=ShowtimeSubject,
 * Observer=Notification/CustomerNotification) — khớp trực tiếp yêu cầu
 * "real-time notifications" của đề bài.
 *
 * Điểm gốc: Part 1: 1+1+1.5+1.5=5đ (câu 1.3 là USE CASE DIAGRAM, không
 * phải logical ERD như các đề trước — khác biệt cần lưu ý); Part 2:
 * 1.5+1.5=3đ; Part 3: 0.5+1+0.5=2đ.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/SWD392-PE5.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/SWD392-PE5.mjs');

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;
const MMD = (src) => `<pre class="mermaid">${src}</pre>`;
const CODE = (code, lang) => `<pre><code class="language-${lang}">${code
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;

const projectContext = B(
  `<div class="pe-system"><b>Problem Statement:</b><p>A cinema intends to build a comprehensive cinema management system to enhance the movie-going experience and streamline its daily operations. Through the system, customers can browse movies, check showtimes, and reserve tickets online. They may choose specific seats and view movie details such as genre, duration, rating, and description. The cinema operates several halls, each with its own seating arrangement. Customers are able to review their booking history and receive confirmation emails. Ticket prices are calculated according to seat type (regular, VIP, couple seats) and show timing (matinee, prime time, late night). Staff can manage movie schedules, keep track of seat availability, and handle payments. The system supports online bookings as well as walk-in ticket purchases made at the cinema counter.</p>
   <p><b>Customers receive real-time notifications about seat availability changes, booking confirmations, and showtime updates. Staff dashboards are refreshed live whenever tickets are booked or cancelled.</b></p>
   <p>Client-server architecture: React client; REST API server (MVC pattern); relational database (MS SQL/MySQL/PostgreSQL); JSON over HTTP.</p></div>`,
  `<div class="pe-system"><b>Đề bài:</b><p>1 rạp chiếu phim dự định xây hệ thống quản lý rạp toàn diện để nâng trải nghiệm xem phim và tinh gọn vận hành hằng ngày. Qua hệ thống, khách hàng duyệt phim, xem lịch chiếu, đặt vé online. Có thể chọn ghế cụ thể và xem chi tiết phim (thể loại, thời lượng, xếp hạng, mô tả). Rạp vận hành nhiều phòng chiếu, mỗi phòng có sơ đồ ghế riêng. Khách hàng xem lại lịch sử đặt vé và nhận email xác nhận. Giá vé tính theo loại ghế (thường, VIP, ghế đôi) và khung giờ chiếu (suất sớm, giờ vàng, suất khuya). Nhân viên quản lý lịch chiếu, theo dõi ghế còn trống, xử lý thanh toán. Hệ thống hỗ trợ cả đặt online lẫn mua vé trực tiếp tại quầy rạp.</p>
   <p><b>Khách hàng nhận thông báo thời gian thực về thay đổi ghế trống, xác nhận đặt vé, cập nhật lịch chiếu. Bảng điều khiển nhân viên cập nhật trực tiếp mỗi khi vé được đặt hoặc huỷ.</b></p>
   <p>Kiến trúc client-server: client React; server REST API (mẫu MVC); database quan hệ (MS SQL/MySQL/PostgreSQL); JSON qua HTTP.</p></div>`,
);

const instructions = ML(
  `<p><strong>SWD392 – Software Architecture and Design, Practical Exam (Summer 2025)</strong>. This is a written practical exam on data modeling, use-case modeling, REST API design, and design patterns. The original paper asks for Draw.io diagrams in a Word file — here, diagrams are rendered as Mermaid directly in the exam viewer. Each answer is graded by an AI grader against the rubric shown per question.</p>` + projectContext,
  `<p><strong>SWD392 – Kiến trúc và Thiết kế Phần mềm, Thi thực hành (Summer 2025)</strong>. Đây là bài thi thực hành về mô hình hoá dữ liệu, mô hình use case, thiết kế REST API, và design pattern dạng viết. Đề gốc yêu cầu vẽ Draw.io trong file Word — ở đây sơ đồ hiển thị dạng Mermaid trực tiếp trong trình xem đề. Mỗi câu trả lời được AI chấm theo tiêu chí ghi ở từng câu.</p>` + projectContext,
);

const q1 = {
  kind: 'WRITE', points: 1,
  prompt: B(
    `<p><strong>Part 1.1 (1 point):</strong> LIST the main entities and their key attributes described in the problem.</p>`,
    `<p><strong>Phần 1.1 (1 điểm):</strong> LIỆT KÊ các thực thể chính và thuộc tính chính, theo đề bài.</p>`,
  ),
  sampleSolution: B(
    `<ul><li><b>Movie</b>: movieId, title, genre, duration, rating, description.</li>
     <li><b>Hall</b>: hallId, hallName, seatingArrangement.</li>
     <li><b>Seat</b>: seatId, hallId, seatNumber, seatType (Regular/VIP/Couple).</li>
     <li><b>Showtime</b>: showtimeId, movieId, hallId, showDateTime, timing (Matinee/Prime/Late).</li>
     <li><b>Customer</b>: customerId, name, email, phone.</li>
     <li><b>Booking</b>: bookingId, customerId, showtimeId, bookingDate, status.</li>
     <li><b>BookingSeat</b> (resolves the many-to-many between Booking and Seat, and holds the actual per-seat price paid): bookingSeatId, bookingId, seatId, price.</li>
     <li><b>Staff</b>: staffId, name, role.</li>
     <li><b>Payment</b>: paymentId, bookingId, amount, paymentMethod, transactionId.</li>
     <li><b>Notification</b> (for the required real-time notification feature): notificationId, recipientType (Customer/Staff), message, sentDate.</li></ul>`,
    `<ul><li><b>Movie</b> (phim): movieId, title, genre, duration, rating, description.</li>
     <li><b>Hall</b> (phòng chiếu): hallId, hallName, seatingArrangement.</li>
     <li><b>Seat</b> (ghế): seatId, hallId, seatNumber, seatType (Regular/VIP/Couple).</li>
     <li><b>Showtime</b> (suất chiếu): showtimeId, movieId, hallId, showDateTime, timing (Matinee/Prime/Late).</li>
     <li><b>Customer</b> (khách hàng): customerId, name, email, phone.</li>
     <li><b>Booking</b> (đặt vé): bookingId, customerId, showtimeId, bookingDate, status.</li>
     <li><b>BookingSeat</b> (giải quyết N-N giữa Booking và Seat, giữ giá thực trả từng ghế): bookingSeatId, bookingId, seatId, price.</li>
     <li><b>Staff</b> (nhân viên): staffId, name, role.</li>
     <li><b>Payment</b> (thanh toán): paymentId, bookingId, amount, paymentMethod, transactionId.</li>
     <li><b>Notification</b> (thông báo, cho tính năng thời gian thực đề yêu cầu): notificationId, recipientType (Customer/Staff), message, sentDate.</li></ul>`,
  ),
  explanation: B(
    `<p>No official solution existed. BookingSeat is the key modeling insight: a booking can reserve several seats, a physical seat is reused across different showtimes, and the price actually charged depends on seat type — none of which fit cleanly on Booking or Seat alone.</p>`,
    `<p>Không có solution chính thức. BookingSeat là hiểu biết mô hình hoá then chốt: 1 đặt vé có thể giữ nhiều ghế, 1 ghế vật lý dùng lại qua nhiều suất chiếu khác nhau, và giá thực trả phụ thuộc loại ghế — không cái nào gắn gọn vào riêng Booking hay Seat.</p>`,
  ),
  rubric: [
    { id: 'core_entities', criterion: B('Identifies Movie, Hall, Seat, Showtime, Customer, Booking, Staff, and Payment.', 'Xác định đủ Movie, Hall, Seat, Showtime, Customer, Booking, Staff, Payment.'), weight: 1, maxScore: 0.5 },
    { id: 'junction_and_notification', criterion: B('Includes a junction entity resolving Booking-Seat M:N with a per-seat price, and a Notification entity for the real-time notification requirement.', 'Có thực thể trung gian giải quyết N-N Booking-Seat kèm giá theo ghế, và thực thể Notification cho yêu cầu thông báo thời gian thực.'), weight: 1, maxScore: 0.5 },
  ],
};

const q2 = {
  kind: 'WRITE', points: 1,
  prompt: B(
    `<p><strong>Part 1.2 (1 point):</strong> DRAW the conceptual ERD for the system.</p>`,
    `<p><strong>Phần 1.2 (1 điểm):</strong> VẼ ERD mức khái niệm cho hệ thống.</p>`,
  ),
  sampleSolution: B(
    MMD(`erDiagram
    HALL ||--o{ SEAT : contains
    MOVIE ||--o{ SHOWTIME : "scheduled as"
    HALL ||--o{ SHOWTIME : hosts
    CUSTOMER ||--o{ BOOKING : makes
    SHOWTIME ||--o{ BOOKING : "booked for"
    BOOKING }o--o{ SEAT : reserves
    BOOKING ||--o| PAYMENT : "paid by"
    STAFF ||--o{ SHOWTIME : manages
    CUSTOMER ||--o{ NOTIFICATION : receives
    STAFF ||--o{ NOTIFICATION : receives`),
    MMD(`erDiagram
    HALL ||--o{ SEAT : contains
    MOVIE ||--o{ SHOWTIME : "scheduled as"
    HALL ||--o{ SHOWTIME : hosts
    CUSTOMER ||--o{ BOOKING : makes
    SHOWTIME ||--o{ BOOKING : "booked for"
    BOOKING }o--o{ SEAT : reserves
    BOOKING ||--o| PAYMENT : "paid by"
    STAFF ||--o{ SHOWTIME : manages
    CUSTOMER ||--o{ NOTIFICATION : receives
    STAFF ||--o{ NOTIFICATION : receives`),
  ),
  rubric: [
    { id: 'entities_present', criterion: B('Includes Hall, Seat, Movie, Showtime, Customer, Booking, Staff, Payment, and Notification as distinct entities.', 'Có đủ Hall, Seat, Movie, Showtime, Customer, Booking, Staff, Payment, Notification là thực thể riêng.'), weight: 1, maxScore: 0.5 },
    { id: 'correct_cardinality', criterion: B('Correct cardinalities: Hall-Seat 1:N; Movie-Showtime 1:N; Hall-Showtime 1:N; Customer-Booking 1:N; Booking-Seat M:N; Booking-Payment 1:0..1.', 'Cardinality đúng: Hall-Seat 1:N; Movie-Showtime 1:N; Hall-Showtime 1:N; Customer-Booking 1:N; Booking-Seat N:N; Booking-Payment 1:0..1.'), weight: 1, maxScore: 0.5 },
  ],
};

const q3 = {
  kind: 'WRITE', points: 1.5,
  prompt: B(
    `<p><strong>Part 1.3 (1.5 points):</strong> DRAW the use case diagram for the cinema management system, showing the main actors and their interactions.</p>`,
    `<p><strong>Phần 1.3 (1.5 điểm):</strong> VẼ use case diagram cho hệ thống quản lý rạp, thể hiện các actor chính và tương tác của họ.</p>`,
  ),
  sampleSolution: B(
    MMD(`graph LR
    Customer((Customer))
    Staff((Staff))
    CounterStaff((Counter Staff))

    Customer --> UC1[Browse Movies]
    Customer --> UC2[Check Showtimes]
    Customer --> UC3[Reserve Ticket Online]
    Customer --> UC4[Select Seats]
    Customer --> UC5[View Booking History]
    Customer --> UC6[Receive Notifications]
    UC3 -.include.-> UC4

    Staff --> UC7[Manage Movie Schedule]
    Staff --> UC8[Track Seat Availability]
    Staff --> UC9[View Live Dashboard]

    CounterStaff --> UC10[Process Walk-in Purchase]
    CounterStaff --> UC11[Handle Payment]
    UC3 -.include.-> UC11
    UC10 -.include.-> UC4`),
    MMD(`graph LR
    Customer((Khách hàng))
    Staff((Nhân viên))
    CounterStaff((Nhân viên quầy))

    Customer --> UC1[Duyệt phim]
    Customer --> UC2[Xem lịch chiếu]
    Customer --> UC3[Đặt vé online]
    Customer --> UC4[Chọn ghế]
    Customer --> UC5[Xem lịch sử đặt vé]
    Customer --> UC6[Nhận thông báo]
    UC3 -.include.-> UC4

    Staff --> UC7[Quản lý lịch chiếu]
    Staff --> UC8[Theo dõi ghế trống]
    Staff --> UC9[Xem dashboard trực tiếp]

    CounterStaff --> UC10[Xử lý mua vé tại quầy]
    CounterStaff --> UC11[Xử lý thanh toán]
    UC3 -.include.-> UC11
    UC10 -.include.-> UC4`),
  ),
  explanation: B(
    `<p>Mermaid has no dedicated UML use-case diagram type, so a flowchart (graph LR) is used to approximate it: actors as circles, use cases as boxes, and dashed "include" edges for the shared Select-Seats and Handle-Payment sub-flows reused by both online reservation and walk-in purchase.</p>`,
    `<p>Mermaid không có kiểu use-case diagram UML riêng, nên dùng flowchart (graph LR) để mô phỏng: actor là hình tròn, use case là hộp, cạnh nét đứt "include" cho luồng con Chọn ghế và Xử lý thanh toán dùng chung bởi cả đặt online lẫn mua tại quầy.</p>`,
  ),
  rubric: [
    { id: 'actors_identified', criterion: B('Identifies at least 3 distinct actors matching the problem (customer, staff managing schedules/availability, counter staff for walk-in purchases).', 'Xác định ít nhất 3 actor khác nhau khớp đề (khách hàng, nhân viên quản lý lịch/ghế, nhân viên quầy mua trực tiếp).'), weight: 1, maxScore: 0.5 },
    { id: 'use_cases_coverage', criterion: B('Covers the main use cases from the problem statement: browse movies, check showtimes, reserve/select seats online, view booking history, receive notifications, manage schedule, track seat availability, walk-in purchase, handle payment.', 'Bao quát các use case chính theo đề: duyệt phim, xem lịch chiếu, đặt/chọn ghế online, xem lịch sử, nhận thông báo, quản lý lịch, theo dõi ghế trống, mua tại quầy, xử lý thanh toán.'), weight: 1, maxScore: 0.7 },
    { id: 'relationships', criterion: B('Shows a meaningful relationship between use cases (e.g., include) reflecting shared sub-flows between actors, not just a flat unconnected list.', 'Thể hiện quan hệ có ý nghĩa giữa các use case (VD include) phản ánh luồng con dùng chung giữa các actor, không chỉ danh sách rời rạc.'), weight: 1, maxScore: 0.3 },
  ],
};

const q4 = {
  kind: 'WRITE', points: 1.5,
  prompt: B(
    `<p><strong>Part 1.4 (1.5 points):</strong> LIST the main states of the Booking entity during the ticket booking process, and DRAW the state diagram for Booking.</p>`,
    `<p><strong>Phần 1.4 (1.5 điểm):</strong> LIỆT KÊ các trạng thái chính của Booking trong quá trình đặt vé, và VẼ sơ đồ trạng thái cho Booking.</p>`,
  ),
  sampleSolution: B(
    `<p><strong>Main states:</strong> Initiated (customer has picked seats, which are tentatively held) → PendingPayment (seats held while the customer completes payment, within a hold window) → Confirmed (payment processed, confirmation email sent) → CheckedIn (ticket used at the cinema). Alternate paths: Cancelled, reachable either from PendingPayment (the hold expires without payment, or the customer abandons the booking) or from Confirmed (a cancellation/refund after payment, e.g. a showtime is cancelled by staff).</p>
     <p><strong>State diagram:</strong></p>` +
     MMD(`stateDiagram-v2
    [*] --> Initiated : selectSeats
    Initiated --> PendingPayment : proceedToPayment
    Initiated --> Cancelled : abandonBooking
    PendingPayment --> Confirmed : confirmPayment
    PendingPayment --> Cancelled : holdExpired
    Confirmed --> CheckedIn : checkInAtCounter
    Confirmed --> Cancelled : cancelBooking
    CheckedIn --> [*]
    Cancelled --> [*]`),
    `<p><strong>Trạng thái chính:</strong> Initiated (khách đã chọn ghế, ghế được giữ tạm) → PendingPayment (ghế giữ trong lúc khách hoàn tất thanh toán, trong 1 khoảng thời gian giữ chỗ) → Confirmed (thanh toán xử lý xong, email xác nhận gửi) → CheckedIn (vé đã dùng tại rạp). Nhánh khác: Cancelled, tới được từ PendingPayment (hết thời gian giữ chỗ mà chưa thanh toán, hoặc khách bỏ đặt) hoặc từ Confirmed (huỷ/hoàn tiền sau thanh toán, VD nhân viên huỷ suất chiếu).</p>
     <p><strong>Sơ đồ trạng thái:</strong></p>` +
     MMD(`stateDiagram-v2
    [*] --> Initiated : selectSeats
    Initiated --> PendingPayment : proceedToPayment
    Initiated --> Cancelled : abandonBooking
    PendingPayment --> Confirmed : confirmPayment
    PendingPayment --> Cancelled : holdExpired
    Confirmed --> CheckedIn : checkInAtCounter
    Confirmed --> Cancelled : cancelBooking
    CheckedIn --> [*]
    Cancelled --> [*]`),
  ),
  explanation: B(
    `<p>A student answer found elsewhere for this exact question listed only 3 states (Pending/Confirmed/Cancelled) with no seat-hold/expiry step. That is too thin for a real seat-reservation system — without a hold-expiry mechanism, a customer who selects seats and never pays would block those seats indefinitely for everyone else. The richer 5-state design above (Initiated/PendingPayment/Confirmed/CheckedIn/Cancelled) fixes that gap and was designed independently rather than copying the thinner version.</p>`,
    `<p>1 bài làm sinh viên tìm thấy ở nơi khác cho đúng câu hỏi này chỉ liệt kê 3 trạng thái (Pending/Confirmed/Cancelled), không có bước giữ chỗ/hết hạn giữ chỗ. Vậy là quá mỏng cho hệ thống đặt ghế thật — không có cơ chế hết hạn giữ chỗ thì khách chọn ghế rồi không bao giờ trả tiền sẽ chặn ghế đó vô thời hạn với mọi người khác. Thiết kế 5 trạng thái đầy đủ hơn ở trên (Initiated/PendingPayment/Confirmed/CheckedIn/Cancelled) vá lỗ hổng đó, tự thiết kế độc lập chứ không copy bản mỏng hơn.</p>`,
  ),
  rubric: [
    { id: 'states_list', criterion: B('Lists a coherent, ordered sequence of Booking states covering seat selection through confirmation and use, including a seat-hold concept.', 'Liệt kê chuỗi trạng thái Booking mạch lạc, có thứ tự, bao quát từ chọn ghế tới xác nhận và sử dụng, có khái niệm giữ chỗ.'), weight: 1, maxScore: 0.7 },
    { id: 'state_diagram_valid', criterion: B('Draws a valid state diagram with a start state, at least 2 distinct paths into Cancelled (hold-expiry/abandonment before payment, and cancellation after confirmation), and a terminal state.', 'Vẽ sơ đồ trạng thái hợp lệ, có trạng thái bắt đầu, ít nhất 2 đường khác nhau vào Cancelled (hết hạn giữ chỗ/bỏ đặt trước thanh toán, và huỷ sau xác nhận), và trạng thái kết thúc.'), weight: 1, maxScore: 0.8 },
  ],
};

const q5 = {
  kind: 'WRITE', points: 1.5,
  prompt: B(
    `<p><strong>Part 2.1 (1.5 points):</strong> DRAW a class diagram (detailed design) showing the client-side and server-side classes (MVC: Controller, Service, Repository) used for the "create booking" function.</p>`,
    `<p><strong>Phần 2.1 (1.5 điểm):</strong> VẼ class diagram (thiết kế chi tiết) thể hiện class phía client và server (MVC: Controller, Service, Repository) cho chức năng "tạo đặt vé".</p>`,
  ),
  sampleSolution: B(
    MMD(`classDiagram
    class SeatSelectionPage {
        +submitBooking(seatIds) void
    }
    class BookingApiService {
        +createBooking(payload) BookingDto
    }
    class BookingController {
        +createBooking(request) BookingDto
    }
    class BookingService {
        -bookingRepository : IRepository~Booking~
        -seatRepository : IRepository~Seat~
        -showtimeRepository : IRepository~Showtime~
        +createBooking(customerId int, showtimeId int, seatIds List) Booking
    }
    class IRepository~T~ {
        <<interface>>
        +findById(id int) T
        +save(entity T) void
    }
    class BookingRepository {
        +findById(id int) Booking
        +save(entity Booking) void
    }
    class SeatRepository {
        +findById(id int) Seat
        +save(entity Seat) void
    }
    class ShowtimeRepository {
        +findById(id int) Showtime
    }
    class Booking {
        -bookingId : int
        -customerId : int
        -status : string
    }
    class Seat {
        -seatId : int
        -seatType : string
        -isAvailable : bool
    }

    SeatSelectionPage --> BookingApiService : uses
    BookingApiService --> BookingController : HTTP POST /api/bookings
    BookingController --> BookingService : delegates
    BookingService ..> IRepository : depends on
    IRepository <|.. BookingRepository
    IRepository <|.. SeatRepository
    IRepository <|.. ShowtimeRepository
    BookingService --> Booking : creates
    BookingService ..> Seat : validates availability`),
    MMD(`classDiagram
    class SeatSelectionPage {
        +submitBooking(seatIds) void
    }
    class BookingApiService {
        +createBooking(payload) BookingDto
    }
    class BookingController {
        +createBooking(request) BookingDto
    }
    class BookingService {
        -bookingRepository : IRepository~Booking~
        -seatRepository : IRepository~Seat~
        -showtimeRepository : IRepository~Showtime~
        +createBooking(customerId int, showtimeId int, seatIds List) Booking
    }
    class IRepository~T~ {
        <<interface>>
        +findById(id int) T
        +save(entity T) void
    }
    class BookingRepository {
        +findById(id int) Booking
        +save(entity Booking) void
    }
    class SeatRepository {
        +findById(id int) Seat
        +save(entity Seat) void
    }
    class ShowtimeRepository {
        +findById(id int) Showtime
    }
    class Booking {
        -bookingId : int
        -customerId : int
        -status : string
    }
    class Seat {
        -seatId : int
        -seatType : string
        -isAvailable : bool
    }

    SeatSelectionPage --> BookingApiService : dùng
    BookingApiService --> BookingController : HTTP POST /api/bookings
    BookingController --> BookingService : giao cho
    BookingService ..> IRepository : phụ thuộc
    IRepository <|.. BookingRepository
    IRepository <|.. SeatRepository
    IRepository <|.. ShowtimeRepository
    BookingService --> Booking : tạo
    BookingService ..> Seat : kiểm tra còn trống`),
  ),
  rubric: [
    { id: 'client_and_server_classes', criterion: B('Includes both a client-side class and the full server-side MVC trio (Controller, Service, Repository).', 'Có cả class phía client và đủ bộ 3 MVC phía server (Controller, Service, Repository).'), weight: 1, maxScore: 0.6 },
    { id: 'repository_interface', criterion: B('Repository classes implement a common repository interface/abstraction (Booking, Seat, Showtime repositories).', 'Lớp repository triển khai 1 interface/abstraction repository chung (repository Booking, Seat, Showtime).'), weight: 1, maxScore: 0.5 },
    { id: 'seat_validation_present', criterion: B('The service class shows a dependency on Seat for availability validation, not just blind creation of the Booking.', 'Lớp service thể hiện phụ thuộc Seat để kiểm tra còn trống, không chỉ tạo Booking mù.'), weight: 1, maxScore: 0.4 },
  ],
};

const q6 = {
  kind: 'WRITE', points: 1.5,
  prompt: B(
    `<p><strong>Part 2.2 (1.5 points):</strong> DRAW a sequence diagram for the "create booking" function between client and server (REST API), with authentication and authorization.</p>`,
    `<p><strong>Phần 2.2 (1.5 điểm):</strong> VẼ sequence diagram cho chức năng "tạo đặt vé" giữa client và server (REST API), có xác thực và phân quyền.</p>`,
  ),
  sampleSolution: B(
    MMD(`sequenceDiagram
    actor Customer
    participant Client as ReactClient
    participant Ctrl as BookingController
    participant Auth as AuthMiddleware
    participant Svc as BookingService
    participant SeatRepo as SeatRepository
    participant BookRepo as BookingRepository
    participant DB as Database

    Customer->>Client: Select seats & submit booking
    Client->>Ctrl: POST /api/bookings (JWT token, showtimeId, seatIds)
    Ctrl->>Auth: Verify JWT token
    Auth-->>Ctrl: Authenticated (customerId, role=Customer)
    Ctrl->>Auth: Check authorization (role must be Customer)
    Auth-->>Ctrl: Authorized
    Ctrl->>Svc: createBooking(customerId, showtimeId, seatIds)
    Svc->>SeatRepo: findByIds(seatIds)
    SeatRepo->>DB: SELECT * FROM Seat WHERE seatId IN (...)
    DB-->>SeatRepo: seat rows (isAvailable, seatType)
    SeatRepo-->>Svc: seat list
    Svc->>Svc: Validate all seats still available & compute price
    Svc->>BookRepo: save(new Booking(customerId, showtimeId, seatIds))
    BookRepo->>DB: INSERT INTO Booking, INSERT INTO BookingSeat
    DB-->>BookRepo: new bookingId
    BookRepo-->>Svc: created Booking
    Svc-->>Ctrl: Booking confirmation
    Ctrl-->>Client: 201 Created (booking JSON)
    Client-->>Customer: Show booking confirmation`),
    MMD(`sequenceDiagram
    actor Customer
    participant Client as ReactClient
    participant Ctrl as BookingController
    participant Auth as AuthMiddleware
    participant Svc as BookingService
    participant SeatRepo as SeatRepository
    participant BookRepo as BookingRepository
    participant DB as Database

    Customer->>Client: Chọn ghế & gửi đặt vé
    Client->>Ctrl: POST /api/bookings (JWT token, showtimeId, seatIds)
    Ctrl->>Auth: Xác thực JWT token
    Auth-->>Ctrl: Đã xác thực (customerId, role=Customer)
    Ctrl->>Auth: Kiểm tra phân quyền (role phải là Customer)
    Auth-->>Ctrl: Đã cấp quyền
    Ctrl->>Svc: createBooking(customerId, showtimeId, seatIds)
    Svc->>SeatRepo: findByIds(seatIds)
    SeatRepo->>DB: SELECT * FROM Seat WHERE seatId IN (...)
    DB-->>SeatRepo: dòng ghế (còn trống, loại ghế)
    SeatRepo-->>Svc: danh sách ghế
    Svc->>Svc: Kiểm tra ghế còn trống & tính giá
    Svc->>BookRepo: save(new Booking(customerId, showtimeId, seatIds))
    BookRepo->>DB: INSERT INTO Booking, INSERT INTO BookingSeat
    DB-->>BookRepo: bookingId mới
    BookRepo-->>Svc: Booking đã tạo
    Svc-->>Ctrl: Xác nhận đặt vé
    Ctrl-->>Client: 201 Created (JSON đặt vé)
    Client-->>Customer: Hiện xác nhận đặt vé`),
  ),
  rubric: [
    { id: 'client_server_flow', criterion: B('Shows the correct client-to-server REST call flow, and the response flowing back.', 'Thể hiện đúng luồng gọi REST client-tới-server, và phản hồi đi ngược lại.'), weight: 1, maxScore: 0.5 },
    { id: 'auth_authz_present', criterion: B('Explicitly shows BOTH an authentication step AND an authorization step, as distinct steps.', 'Thể hiện rõ CẢ bước xác thực LẪN bước phân quyền, là 2 bước riêng.'), weight: 1, maxScore: 0.6 },
    { id: 'seat_availability_check', criterion: B('Includes a seat-availability validation step before creating the booking — critical for a seat-reservation system to avoid double-booking.', 'Có bước kiểm tra ghế còn trống trước khi tạo đặt vé — thiết yếu cho hệ thống đặt ghế để tránh đặt trùng.'), weight: 1, maxScore: 0.4 },
  ],
};

const q7 = {
  kind: 'WRITE', points: 0.5,
  prompt: B(
    `<p><strong>Part 3.1 (0.5 points):</strong> examine the pseudocode below. WHAT DESIGN PATTERN does the code above apply? Identify its name and pattern family (creational, structural, or behavioral).</p>` +
    CODE(`public interface Notification {
    public void update(String movieTitle, String showTime, int availableSeat);
}

public class ShowtimeSubject {
    private List<Notification> notifications;
    private String movieTitle;
    private String showTime;
    private int availableSeat;

    public void addNotification(Notification notification) { /* ... */ }
    public void removeNotification(Notification notification) { /* ... */ }

    public void notifyNotifications() {
        for (Notification notification : notifications) {
            notification.update(movieTitle, showTime, availableSeat);
        }
    }

    public void updateShowtime(String title, String time, int seat) {
        this.movieTitle = title;
        this.showTime = time;
        this.availableSeat = seat;
        notifyNotifications();
    }
}

public class CustomerNotification implements Notification {
    public void update(String movieTitle, String showTime, int availableSeat) {
        /* Send notification to customer */
    }
}`, 'java'),
    `<p><strong>Phần 3.1 (0.5 điểm):</strong> xem pseudocode dưới. ĐÂY LÀ design pattern nào? Nêu tên và họ pattern (creational, structural, hay behavioral).</p>` +
    CODE(`public interface Notification {
    public void update(String movieTitle, String showTime, int availableSeat);
}

public class ShowtimeSubject {
    private List<Notification> notifications;
    private String movieTitle;
    private String showTime;
    private int availableSeat;

    public void addNotification(Notification notification) { /* ... */ }
    public void removeNotification(Notification notification) { /* ... */ }

    public void notifyNotifications() {
        for (Notification notification : notifications) {
            notification.update(movieTitle, showTime, availableSeat);
        }
    }

    public void updateShowtime(String title, String time, int seat) {
        this.movieTitle = title;
        this.showTime = time;
        this.availableSeat = seat;
        notifyNotifications();
    }
}

public class CustomerNotification implements Notification {
    public void update(String movieTitle, String showTime, int availableSeat) {
        /* Gửi thông báo cho khách hàng */
    }
}`, 'java'),
  ),
  sampleSolution: B(
    `<p><strong>Pattern:</strong> Observer. <strong>Family:</strong> Behavioral.</p>
     <p>The giveaway: <code>ShowtimeSubject</code> (the subject) keeps a list of <code>Notification</code> observers and calls <code>update()</code> on every one of them whenever its own state changes (<code>updateShowtime()</code> → <code>notifyNotifications()</code>) — the one-to-many "subject changes, all observers get notified" relationship is exactly Observer's defining structure, and it maps directly onto the problem's own "real-time notifications... staff dashboards refreshed live" requirement.</p>`,
    `<p><strong>Pattern:</strong> Observer. <strong>Họ:</strong> Behavioral (hành vi).</p>
     <p>Dấu hiệu: <code>ShowtimeSubject</code> (subject) giữ danh sách observer <code>Notification</code> và gọi <code>update()</code> trên từng cái mỗi khi trạng thái của chính nó đổi (<code>updateShowtime()</code> → <code>notifyNotifications()</code>) — quan hệ 1-nhiều "subject đổi, mọi observer được báo" đúng cấu trúc đặc trưng của Observer, và khớp trực tiếp với chính yêu cầu "thông báo thời gian thực... bảng điều khiển nhân viên cập nhật trực tiếp" của đề bài.</p>`,
  ),
  rubric: [
    { id: 'correct_pattern_and_family', criterion: B('Correctly identifies Observer as the pattern and Behavioral as its family.', 'Xác định đúng Observer là pattern và Behavioral là họ của nó.'), weight: 1, maxScore: 1 },
  ],
};

const q8 = {
  kind: 'WRITE', points: 1,
  prompt: B(
    `<p><strong>Part 3.2 (1 point):</strong> DRAW the class diagram for this pattern.</p>`,
    `<p><strong>Phần 3.2 (1 điểm):</strong> VẼ class diagram cho pattern này.</p>`,
  ),
  sampleSolution: B(
    MMD(`classDiagram
    class Notification {
        <<interface>>
        +update(movieTitle String, showTime String, availableSeat int) void
    }
    class ShowtimeSubject {
        -notifications : List~Notification~
        -movieTitle : String
        -showTime : String
        -availableSeat : int
        +addNotification(notification Notification) void
        +removeNotification(notification Notification) void
        +notifyNotifications() void
        +updateShowtime(title String, time String, seat int) void
    }
    class CustomerNotification {
        +update(movieTitle String, showTime String, availableSeat int) void
    }
    class StaffDashboardNotification {
        +update(movieTitle String, showTime String, availableSeat int) void
    }
    Notification <|.. CustomerNotification
    Notification <|.. StaffDashboardNotification
    ShowtimeSubject o-- Notification : notifications`),
    MMD(`classDiagram
    class Notification {
        <<interface>>
        +update(movieTitle String, showTime String, availableSeat int) void
    }
    class ShowtimeSubject {
        -notifications : List~Notification~
        -movieTitle : String
        -showTime : String
        -availableSeat : int
        +addNotification(notification Notification) void
        +removeNotification(notification Notification) void
        +notifyNotifications() void
        +updateShowtime(title String, time String, seat int) void
    }
    class CustomerNotification {
        +update(movieTitle String, showTime String, availableSeat int) void
    }
    class StaffDashboardNotification {
        +update(movieTitle String, showTime String, availableSeat int) void
    }
    Notification <|.. CustomerNotification
    Notification <|.. StaffDashboardNotification
    ShowtimeSubject o-- Notification : notifications`),
  ),
  explanation: B(
    `<p>Added a second concrete observer, StaffDashboardNotification, beyond what the given pseudocode showed (only CustomerNotification) — a reasonable, clearly-marked extension that demonstrates the pattern's extensibility and directly reflects the problem statement's separate mention of live staff dashboards.</p>`,
    `<p>Thêm 1 observer cụ thể thứ 2, StaffDashboardNotification, ngoài pseudocode gốc chỉ cho (chỉ CustomerNotification) — mở rộng hợp lý, đánh dấu rõ, minh hoạ khả năng mở rộng của pattern và phản ánh trực tiếp phần đề riêng nhắc tới bảng điều khiển nhân viên trực tiếp.</p>`,
  ),
  rubric: [
    { id: 'all_classes_present', criterion: B('Includes Notification (interface), ShowtimeSubject (subject), and at least one concrete observer (CustomerNotification).', 'Có đủ Notification (interface), ShowtimeSubject (subject), và ít nhất 1 observer cụ thể (CustomerNotification).'), weight: 1, maxScore: 0.5 },
    { id: 'correct_relationships', criterion: B('Correctly shows the concrete observer(s) implementing Notification, and ShowtimeSubject holding a composition/aggregation reference to a list of Notification.', 'Thể hiện đúng observer cụ thể triển khai Notification, và ShowtimeSubject giữ tham chiếu composition/aggregation tới danh sách Notification.'), weight: 1, maxScore: 0.5 },
  ],
};

const q9 = {
  kind: 'WRITE', points: 0.5,
  prompt: B(
    `<p><strong>Part 3.3 (0.5 points):</strong> DESCRIBE a practical situation in software development where this pattern would be appropriate.</p>`,
    `<p><strong>Phần 3.3 (0.5 điểm):</strong> MÔ TẢ 1 tình huống thực tế trong phát triển phần mềm mà pattern này phù hợp.</p>`,
  ),
  sampleSolution: B(
    `<p><strong>Within this exact system:</strong> when a seat's availability changes (someone books or cancels), every customer currently viewing that showtime's seat map AND the staff live dashboard need to be updated at the same time, without the seat-update code needing to know how many viewers exist or what kind of client each one is — exactly what the pseudocode already demonstrates.</p>
     <p><strong>A different general example:</strong> a stock-trading app where a stock's price ticker (the subject) notifies multiple independent parts of the UI (a price-chart widget, a portfolio-value widget, a price-alert notifier) whenever the price changes, without the ticker needing to know about any specific widget.</p>`,
    `<p><strong>Ngay trong hệ thống này:</strong> khi ghế trống thay đổi (ai đó đặt hoặc huỷ), mọi khách đang xem sơ đồ ghế của suất chiếu đó VÀ bảng điều khiển nhân viên trực tiếp cần được cập nhật cùng lúc, mà mã cập nhật ghế không cần biết có bao nhiêu người xem hay mỗi người dùng loại client nào — đúng như pseudocode đã minh hoạ.</p>
     <p><strong>Một ví dụ tổng quát khác:</strong> app giao dịch chứng khoán, nơi bảng giá cổ phiếu (subject) báo cho nhiều phần độc lập của UI (widget biểu đồ giá, widget giá trị danh mục, cảnh báo giá) mỗi khi giá đổi, mà bảng giá không cần biết về bất kỳ widget cụ thể nào.</p>`,
  ),
  rubric: [
    { id: 'valid_situation', criterion: B('Describes a genuine one-to-many "state change → automatic notification of dependents" situation without tight coupling between the subject and its observers — the defining use case for Observer.', 'Mô tả tình huống thật "thay đổi trạng thái → tự động báo cho các bên phụ thuộc" theo kiểu 1-nhiều, không gắn chặt giữa subject và observer — đúng trường hợp dùng đặc trưng của Observer.'), weight: 1, maxScore: 1 },
  ],
};

const spec = {
  course: { courseCode: 'SWD392' },
  exams: [{
    kind: 'PE',
    peType: 'WRITE',
    code: 'PE5',
    title: 'SWD392 – Practical Exam (Summer 2025), Cinema Management System|||SWD392 – Thi thực hành (Summer 2025), Hệ thống quản lý rạp chiếu phim',
    description: 'SWD392 PE (WRITE): ERD (conceptual/logical), use case diagram, Booking state diagram, detailed class diagram (Repository Pattern), sequence diagram, and Observer design-pattern analysis — diagrams rendered as Mermaid, AI-graded.|||PE SWD392 (viết): ERD (khái niệm/logic), use case diagram, state diagram Booking, class diagram chi tiết (Repository Pattern), sequence diagram, và phân tích design pattern Observer — sơ đồ hiển thị dạng Mermaid, chấm AI.',
    durationMinutes: 90,
    totalPoints: 10,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: null,
    attachmentName: null,
    instructions,
    isPublished: true,
    questions: [q1, q2, q3, q4, q5, q6, q7, q8, q9],
  }],
};

fs.writeFileSync(OUT, `export default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/WRITE ${spec.exams[0].questions.length} câu, ${spec.exams[0].totalPoints} điểm`);
