/**
 * SWR302 · PE luyện 4 — SkillSwap Campus Peer-Tutoring Platform (định dạng SU26: Q4 = sơ đồ chuyển trạng thái của Tutoring Session,
 * nhiều sự kiện thời gian 24 giờ / 2 giờ / 12 giờ / 15 phút / 48 giờ + quyết định của moderator). Tình huống MỚI.
 */
import { deThiPE } from './_pe.mjs';

const DU_AN = 'SkillSwap Campus Peer-Tutoring Platform';

const BOI_CANH = {
  en: `<p>Many first-year students at FPT University struggle with subjects such as PRF192 or MAE101, while senior students would happily tutor them for a small fee. The university wants <b>SkillSwap Campus Peer-Tutoring Platform</b>, a web and mobile system where <b>learners</b> book paid tutoring sessions with <b>tutors</b>. Sessions are paid in campus credits through the external <b>Campus E-wallet</b>.</p>
<p>Students sign in with their university account; the external <b>Student Information System (SIS)</b> authenticates them and provides their GPA and subject grades. A student who wants to tutor a subject applies on SkillSwap; the system checks with the SIS that the student’s GPA is at least 3.2 and that their grade in that subject is at least 8.0, and an <b>academic officer</b> then approves or rejects the application.</p>
<p>A learner searches tutors by subject and rating and requests a session for a time slot, online or in person. The tutor must accept or decline within 24 hours, otherwise the request expires. After the tutor accepts, the learner has 2 hours to pay the session price; if the payment is not made, the session is cancelled. For an in-person session SkillSwap books a study room through the external <b>Library Room Booking System</b>; for an online session it obtains a meeting link from the external <b>Video Meeting Service</b>.</p>
<p>A learner may cancel a paid session free of charge at least 12 hours before it starts and is refunded. If the tutor has not joined 15 minutes after the start time, the session is recorded as a no-show and the learner is refunded automatically. When the session ends, the learner has 48 hours to rate it or report a problem. A reported session is examined by a <b>moderator</b>, who decides either to refund the learner or to pay the tutor; if no problem is reported within 48 hours, the payment is released to the tutor minus a 10% platform commission.</p>
<p>The <b>platform administrator</b> sets the prices per subject level, the commission rate and the penalty rules, and views monthly reports (sessions, revenue, average tutor ratings). All e-mails and push notifications are delivered through the university <b>Notification Service</b>.</p>`,
  vi: `<p>Nhiều sinh viên năm nhất FPT University gặp khó với các môn như PRF192, MAE101, trong khi sinh viên khoá trên sẵn lòng kèm với phí nhỏ. Trường muốn có <b>SkillSwap Campus Peer-Tutoring Platform</b> — hệ thống web và di động để <b>người học (learner)</b> đặt buổi kèm có phí với <b>người kèm (tutor)</b>. Thanh toán bằng credit qua <b>Campus E-wallet</b> bên ngoài.</p>
<p>Sinh viên đăng nhập bằng tài khoản trường; <b>Hệ thống thông tin sinh viên (SIS)</b> bên ngoài xác thực và cung cấp GPA, điểm từng môn. Muốn làm tutor một môn, sinh viên nộp đơn; hệ thống kiểm với SIS GPA ≥ 3.2 và điểm môn đó ≥ 8.0, rồi <b>cán bộ học vụ (academic officer)</b> duyệt hoặc từ chối.</p>
<p>Learner tìm tutor theo môn và đánh giá, gửi yêu cầu cho một khung giờ (online hoặc trực tiếp). Tutor phải nhận hoặc từ chối trong 24 giờ, nếu không yêu cầu hết hạn. Sau khi tutor nhận, learner có 2 giờ để trả tiền; không trả thì buổi bị huỷ. Buổi trực tiếp: SkillSwap đặt phòng học qua <b>Library Room Booking System</b>; buổi online: lấy link họp từ <b>Video Meeting Service</b>.</p>
<p>Learner được huỷ miễn phí buổi đã trả nếu còn ít nhất 12 giờ trước giờ bắt đầu, được hoàn tiền. Tutor chưa vào sau 15 phút ⇒ ghi no-show, hoàn tiền tự động. Khi buổi kết thúc, learner có 48 giờ để đánh giá hoặc báo sự cố. Buổi bị báo sự cố do <b>moderator</b> xem xét và quyết định hoàn tiền cho learner hoặc trả cho tutor; không có sự cố trong 48 giờ ⇒ tiền được chuyển cho tutor sau khi trừ 10% phí nền tảng.</p>
<p><b>Quản trị nền tảng</b> đặt giá theo cấp độ môn, tỉ lệ phí, luật phạt, và xem báo cáo tháng. Mọi e-mail và thông báo đẩy đi qua <b>Notification Service</b> của trường.</p>`,
};

const A = {
  learner: { ten: 'Learner', khop: ['learner|student|tutee|member'] },
  tutor: { ten: 'Tutor', khop: ['tutor|mentor'] },
  officer: { ten: 'Academic Officer', khop: ['academic|officer'] },
  moderator: { ten: 'Moderator', khop: ['moderator'] },
  admin: { ten: 'Platform Administrator', khop: ['admin|administrator'] },
  sis: { ten: 'Student Information System', khop: ['student information|\\bsis\\b|information system'] },
  wallet: { ten: 'Campus E-wallet', khop: ['wallet|payment'] },
  room: { ten: 'Library Room Booking System', khop: ['library|room'] },
  video: { ten: 'Video Meeting Service', khop: ['video|meeting|zoom|meet'] },
  noti: { ten: 'Notification Service', khop: ['notif|mail|message'] },
};

const GIAI_CTX = `
flowchart LR
  S((SkillSwap Campus Peer-Tutoring Platform))
  LE[Learner]
  TU[Tutor]
  AO[Academic Officer]
  MO[Moderator]
  AD[Platform Administrator]
  SIS[Student Information System]
  EW[Campus E-wallet]
  LR[Library Room Booking System]
  VM[Video Meeting Service]
  NS[Notification Service]
  LE -->|session request, cancellation, rating, problem report| S
  S -->|session confirmation, room or meeting link, refund notice| LE
  TU -->|tutor application, accept or decline decision| S
  S -->|session requests, payout statement| TU
  AO -->|application decision| S
  S -->|tutor applications| AO
  MO -->|dispute decision| S
  S -->|dispute case| MO
  AD -->|prices, commission rate, penalty rules| S
  S -->|monthly report| AD
  S -->|sign-in request, grade query| SIS
  SIS -->|authentication result, GPA and grades| S
  S -->|payment, refund and payout requests| EW
  EW -->|transaction result| S
  S -->|room booking request| LR
  LR -->|room confirmation| S
  S -->|meeting request| VM
  VM -->|meeting link| S
  S -->|notification messages| NS
`;

const GIAI_UC = `
@startuml
left to right direction
actor Learner
actor Tutor
actor "Academic Officer" as AO
actor Moderator
actor "Platform Administrator" as AD
actor "Student Information System" as SIS
actor "Campus E-wallet" as EW
actor "Library Room Booking System" as LR
actor "Video Meeting Service" as VM
actor "Notification Service" as NS
rectangle "SkillSwap Campus Peer-Tutoring Platform" {
  usecase "Sign In" as UC1
  usecase "Apply as Tutor" as UC2
  usecase "Check Tutor Eligibility" as UC3
  usecase "Review Tutor Application" as UC4
  usecase "Search Tutors" as UC5
  usecase "Request Session" as UC6
  usecase "Respond to Session Request" as UC7
  usecase "Pay for Session" as UC8
  usecase "Book Study Room" as UC9
  usecase "Create Meeting Link" as UC10
  usecase "Cancel Session" as UC11
  usecase "Rate Session" as UC12
  usecase "Report Session Problem" as UC13
  usecase "Resolve Dispute" as UC14
  usecase "Release Tutor Payout" as UC15
  usecase "Configure Prices and Rules" as UC16
  usecase "View Monthly Report" as UC17
  usecase "Send Notification" as UC18
}
Learner --> UC1
Tutor --> UC1
AO --> UC1
Moderator --> UC1
AD --> UC1
UC1 --> SIS
Tutor --> UC2
UC2 ..> UC3 : <<include>>
UC3 --> SIS
AO --> UC4
Learner --> UC5
Learner --> UC6
Tutor --> UC7
Learner --> UC8
UC8 --> EW
UC9 ..> UC8 : <<extend>>
UC9 --> LR
UC10 ..> UC8 : <<extend>>
UC10 --> VM
Learner --> UC11
Learner --> UC12
Learner --> UC13
Moderator --> UC14
UC15 --> EW
AD --> UC16
AD --> UC17
UC7 ..> UC18 : <<include>>
UC18 --> NS
@enduml
`;

const GIAI_ACTORS = [
  ['Learner', 'A student who searches tutors, requests and pays for sessions, cancels, rates them or reports problems.'],
  ['Tutor', 'A senior student approved to tutor a subject who accepts or declines session requests and is paid after sessions.'],
  ['Academic Officer', 'University staff who review tutor applications after the system has checked GPA and subject grade.'],
  ['Moderator', 'Platform staff who examine reported sessions and decide to refund the learner or pay the tutor.'],
  ['Platform Administrator', 'Sets prices per subject level, the commission rate and penalty rules, and reads monthly reports.'],
  ['Student Information System', 'External university system that authenticates students and provides their GPA and subject grades.'],
  ['Campus E-wallet', 'External payment service that executes session payments, refunds and tutor payouts in campus credits.'],
  ['Library Room Booking System', 'External library system that reserves a study room for in-person sessions.'],
  ['Video Meeting Service', 'External service that creates the meeting link for online sessions.'],
  ['Notification Service', 'External university service that delivers the e-mails and push notifications sent by SkillSwap.'],
].map(([name, description]) => ({ name, description }));

const GIAI_UCS = [
  ['UC-01', 'Sign In', ['Learner', 'Tutor', 'Academic Officer', 'Moderator', 'Platform Administrator', 'Student Information System'], 'A user signs in with the university account; the SIS authenticates the user.'],
  ['UC-02', 'Apply as Tutor', ['Tutor'], 'A student applies to tutor a subject on SkillSwap.'],
  ['UC-03', 'Check Tutor Eligibility', ['Student Information System'], 'Included in every application: GPA ≥ 3.2 and subject grade ≥ 8.0 are checked with the SIS.'],
  ['UC-04', 'Review Tutor Application', ['Academic Officer'], 'The academic officer approves or rejects an eligible tutor application.'],
  ['UC-05', 'Search Tutors', ['Learner'], 'The learner finds tutors by subject, rating and available time slots.'],
  ['UC-06', 'Request Session', ['Learner'], 'The learner requests a session with a tutor for a time slot, online or in person.'],
  ['UC-07', 'Respond to Session Request', ['Tutor'], 'The tutor accepts or declines a request within 24 hours.'],
  ['UC-08', 'Pay for Session', ['Learner', 'Campus E-wallet'], 'The learner pays the session price in credits within 2 hours of acceptance.'],
  ['UC-09', 'Book Study Room', ['Library Room Booking System'], 'Extension of paying for an in-person session: a study room is reserved in the library system.'],
  ['UC-10', 'Create Meeting Link', ['Video Meeting Service'], 'Extension of paying for an online session: a meeting link is obtained from the video service.'],
  ['UC-11', 'Cancel Session', ['Learner'], 'The learner cancels a paid session at least 12 hours before it starts and is refunded.'],
  ['UC-12', 'Rate Session', ['Learner'], 'Within 48 hours after the session, the learner rates the tutor.'],
  ['UC-13', 'Report Session Problem', ['Learner'], 'Within 48 hours after the session, the learner reports a problem for the moderator to examine.'],
  ['UC-14', 'Resolve Dispute', ['Moderator'], 'The moderator decides to refund the learner or to pay the tutor for a reported session.'],
  ['UC-15', 'Release Tutor Payout', ['Campus E-wallet'], '48 hours after an undisputed session, the price minus 10% commission is paid to the tutor.'],
  ['UC-16', 'Configure Prices and Rules', ['Platform Administrator'], 'The administrator sets prices per level, the commission rate and penalty rules.'],
  ['UC-17', 'View Monthly Report', ['Platform Administrator'], 'The administrator reads sessions, revenue and average tutor ratings per month.'],
  ['UC-18', 'Send Notification', ['Notification Service'], 'Included whenever a user must be informed: the notification service delivers the message.'],
].map(([id, name, actors, description]) => ({ id, name, actors, description }));

const GIAI_STATE = `
stateDiagram-v2
  [*] --> Requested : learner requests a session
  state "In Progress" as InProgress
  state "Awaiting Feedback" as AwaitingFeedback
  state "No-show" as NoShow
  Requested --> Accepted : tutor accepts / notify learner
  Requested --> Declined : tutor declines / notify learner
  Requested --> Expired : 24 hours elapsed [no response from tutor]
  Accepted --> Confirmed : payment succeeded / book room or link
  Accepted --> Cancelled : 2 hours elapsed [not paid]
  Confirmed --> Cancelled : learner cancels [12+ hours before start] / refund
  Confirmed --> InProgress : start time [tutor joined]
  Confirmed --> NoShow : 15 min after start [tutor absent] / refund
  InProgress --> AwaitingFeedback : session ends
  AwaitingFeedback --> Disputed : problem reported [within 48 hours]
  AwaitingFeedback --> Completed : 48 hours elapsed [no problem] / pay tutor
  Disputed --> Completed : moderator rules for tutor / pay tutor
  Disputed --> Refunded : moderator rules for learner / refund
  Declined --> [*]
  Expired --> [*]
  Cancelled --> [*]
  NoShow --> [*]
  Completed --> [*]
  Refunded --> [*]
`;

const GIAI_STATES = [
  ['Requested', 'The learner has requested a time slot and is waiting for the tutor’s answer (at most 24 hours).'],
  ['Accepted', 'The tutor accepted; the learner must pay within 2 hours to keep the slot.'],
  ['Declined', 'The tutor declined the request; the learner may request another tutor.'],
  ['Expired', 'The tutor did not answer within 24 hours, so the request lapsed.'],
  ['Confirmed', 'The session is paid and a room or meeting link is reserved; it waits for its start time.'],
  ['Cancelled', 'The session was not paid in time or the learner cancelled at least 12 hours before it.'],
  ['In Progress', 'The start time has come and the tutor has joined; tutoring is taking place.'],
  ['No-show', 'The tutor had not joined 15 minutes after the start; the learner has been refunded.'],
  ['Awaiting Feedback', 'The session has ended; the learner has 48 hours to rate it or report a problem.'],
  ['Disputed', 'The learner reported a problem and a moderator must decide who receives the money.'],
  ['Completed', 'The session closed without a problem or the moderator ruled for the tutor; the tutor is paid.'],
  ['Refunded', 'The moderator ruled for the learner and the price has been returned in credits.'],
].map(([name, description]) => ({ name, description }));

const ST = {
  requested: ['request|pending approval|new request'],
  accepted: ['accept|approved by tutor|awaiting pay|unpaid'],
  confirmed: ['confirm|paid|booked|scheduled|upcoming'],
  progress: ['progress|ongoing|in session|running|started'],
  feedback: ['feedback|awaiting rating|ended|finished|review period|rating'],
  disputed: ['disput|reported|problem|under review|investigat'],
  completed: ['complet|closed|paid out|settled|done'],
  cancelled: ['cancel'],
  expired: ['expir|timed out|lapsed'],
  noshow: ['no ?show|missed|absent'],
  refunded: ['refund'],
};

export default deThiPE({
  so: 4,
  slug: 'swr302-11-pe-4-skillswap-peer-tutoring',
  ten: 'PE Practice 4 — SkillSwap peer tutoring (context · use case · state machine)',
  tieuDe: 'PE Practice 4 — SkillSwap Campus Peer-Tutoring Platform',
  moTaModule: 'PE luyện định dạng SU26: trang bìa SRS, context diagram 10 thực thể, use case + hai bảng (include kiểm điều kiện tutor, extend đặt phòng / tạo link họp), sơ đồ chuyển trạng thái của Tutoring Session với năm sự kiện thời gian có guard và quyết định của moderator — tình huống mới, chấm sâu hơn đề thật.',
  maDe: 'SWR302_PE_Practice_4',
  duAn: DU_AN,
  phu: { en: 'SU26 format · 90 minutes · 10 points · Q4 = state transition diagram with time events and a dispute path', vi: 'Định dạng SU26 · 90 phút · 10 điểm · Câu 4 = sơ đồ chuyển trạng thái có sự kiện thời gian và nhánh tranh chấp' },
  boiCanh: BOI_CANH,
  moTaNgan: 'PE luyện 4 (SU26): SkillSwap — context, use case + 2 bảng, máy trạng thái của Tutoring Session.',
  q2: {
    giai: GIAI_CTX,
    cfg: {
      ngoai: [
        { ...A.learner, can: ['vao', 'ra'], luong: [{ huong: 'vao', ten: 'session request', khop: ['request|booking'] }, { huong: 'ra', ten: 'session confirmation', khop: ['confirm|link|room'] }] },
        { ...A.tutor, can: ['vao', 'ra'], luong: [{ huong: 'vao', ten: 'tutor application / accept decision', khop: ['application|accept|decision|respon'] }] },
        { ...A.officer, can: ['vao', 'ra'], luong: [{ huong: 'vao', ten: 'application decision', khop: ['decision|approv|review'] }] },
        { ...A.moderator, can: ['vao', 'ra'], luong: [{ huong: 'vao', ten: 'dispute decision', khop: ['decision|ruling|resolution|verdict'] }] },
        { ...A.admin, can: ['vao', 'ra'], luong: [{ huong: 'vao', ten: 'prices / commission / penalty rules', khop: ['price|commission|rule|setting|config|penalt'] }, { huong: 'ra', ten: 'monthly report', khop: ['report|statistic'] }] },
        { ...A.sis, can: ['vao', 'ra'], luong: [{ huong: 'vao', ten: 'GPA and grades / authentication result', khop: ['gpa|grade|auth|result|identity|profile'] }] },
        { ...A.wallet, can: ['vao', 'ra'], luong: [{ huong: 'vao', ten: 'transaction / payment result', khop: ['result|status|confirm|receipt|transaction'] }] },
        { ...A.room, can: ['vao', 'ra'] },
        { ...A.video, can: ['vao', 'ra'], luong: [{ huong: 'vao', ten: 'meeting link', khop: ['link|url|meeting'] }] },
        { ...A.noti, can: ['ra'] },
      ],
      cam: [
        { ten: 'Payment module / Matching engine / Scheduler', khop: ['module|engine|scheduler|timer|database|\\bdb\\b'], lyDo: 'that is a part of SkillSwap, inside the circle', lyDoVi: 'đó là một phần của SkillSwap, nằm trong vòng tròn' },
        { ten: 'Session / Credit / Rating', khop: ['^session|^credit|^rating|^review$'], lyDo: 'that is data inside the system, not a party exchanging data', lyDoVi: 'đó là dữ liệu bên trong hệ thống, không phải một bên trao đổi dữ liệu' },
      ],
      toiThieuLuong: 16,
    },
  },
  q3: {
    giaiUC: GIAI_UC, giaiActors: GIAI_ACTORS, giaiUCs: GIAI_UCS,
    cfg: {
      actors: [A.learner, A.tutor, A.officer, A.moderator, A.admin, A.sis, A.wallet, A.room, A.video, A.noti],
      camActor: [
        { ten: 'Timer / Scheduler', khop: ['timer|scheduler|cron|clock|time'], lyDo: 'the 24-hour, 2-hour, 15-minute and 48-hour rules are temporal events inside SkillSwap', lyDoVi: 'các luật 24 giờ, 2 giờ, 15 phút, 48 giờ là sự kiện thời gian bên trong SkillSwap' },
        { ten: 'Payment module', khop: ['payment module|matching|engine'], lyDo: 'internal components are not actors', lyDoVi: 'thành phần bên trong không phải actor' },
      ],
      ucs: [
        { ten: 'Sign in through the SIS', khop: ['sign in|log ?in|authenticat'], actor: [A.sis] },
        { ten: 'Apply as a tutor', khop: ['^apply|register as tutor|become tutor'], actor: [A.tutor] },
        { ten: 'Review a tutor application', khop: ['review (tutor )?application|approve (tutor|application)|evaluate application'], actor: [A.officer] },
        { ten: 'Search tutors', khop: ['search|find|browse'], actor: [A.learner] },
        { ten: 'Request a session', khop: ['request session|book session|request tutoring|request a session'], actor: [A.learner] },
        { ten: 'Accept / decline a session request', khop: ['respond|accept|decline'], actor: [A.tutor] },
        { ten: 'Pay for a session', khop: ['^pay|pay for|pay session'], actor: [A.learner, A.wallet] },
        { ten: 'Cancel a session', khop: ['cancel'], actor: [A.learner] },
        { ten: 'Rate a session', khop: ['rate|rating|feedback'], actor: [A.learner] },
        { ten: 'Report a session problem', khop: ['report (session )?problem|report issue|complain|raise dispute'], actor: [A.learner] },
        { ten: 'Resolve a dispute', khop: ['resolve|dispute|ruling'], actor: [A.moderator] },
        { ten: 'Configure prices and rules', khop: ['config|price|commission|rule'], actor: [A.admin] },
        { ten: 'View the monthly report', khop: ['monthly report|view report|statistic'], actor: [A.admin] },
      ],
      quanHe: [
        { loai: 'include', ten: 'Apply as Tutor «include» Check Tutor Eligibility', tu: ['^apply|become tutor'], den: ['eligib|check gpa|verify grade|check grade'], lyDo: 'GPA and grade are checked for EVERY application', lyDoVi: 'GPA và điểm được kiểm cho MỌI đơn' },
        { loai: 'extend', ten: 'Book Study Room «extend» Pay for Session', tu: ['room'], den: ['^pay|pay for'], lyDo: 'a room is booked ONLY for in-person sessions', lyDoVi: 'chỉ buổi trực tiếp mới đặt phòng' },
      ],
      toiThieuUC: 14,
    },
  },
  q4: {
    loai: 'state',
    tieuDeHinh: 'State machine — Tutoring Session',
    viTri: { __dau: [30, 400], Declined: [130, 100], __cuoi_Declined: [270, 100], Requested: [130, 280], Accepted: [380, 280], Confirmed: [630, 280], InProgress: [880, 280], Expired: [130, 470], Cancelled: [440, 470], NoShow: [690, 470], AwaitingFeedback: [880, 470], Disputed: [620, 660], Completed: [880, 660], Refunded: [620, 850] },
    de: { en: 'draw a <b>State Transition Diagram</b> for a <b>Tutoring Session</b> from the moment a learner requests it until it ends (declined, expired, cancelled, no-show, completed or refunded). Include at least eight distinct states, every time-based transition of the paper (24 hours, 2 hours, 12 hours, 15 minutes, 48 hours) with its guard, the moderator’s decisions, and the actions the system performs (refunds, payouts, room or link). Describe every state and its business meaning in the state table.', vi: 'vẽ <b>Sơ đồ chuyển trạng thái</b> cho một <b>Tutoring Session</b> từ lúc learner yêu cầu tới khi kết thúc (bị từ chối, hết hạn, huỷ, no-show, hoàn tất hoặc hoàn tiền). Ít nhất tám trạng thái, mọi chuyển theo thời gian của đề (24 giờ, 2 giờ, 12 giờ, 15 phút, 48 giờ) kèm guard, quyết định của moderator, và hành động của hệ thống (hoàn tiền, trả tutor, phòng hoặc link). Mô tả mọi trạng thái trong bảng trạng thái.' },
    giai: GIAI_STATE, giaiBang: GIAI_STATES,
    cfg: {
      tenDoiTuong: 'the tutoring session',
      toiThieu: 8,
      guardToiThieu: 4,
      st: [
        { ten: 'Requested', tenVi: 'đã yêu cầu', khop: ST.requested },
        { ten: 'Confirmed (paid)', tenVi: 'đã xác nhận (đã trả)', khop: ST.confirmed },
        { ten: 'In progress', tenVi: 'đang diễn ra', khop: ST.progress },
        { ten: 'Disputed', tenVi: 'đang tranh chấp', khop: ST.disputed },
        { ten: 'Completed', tenVi: 'hoàn tất', khop: ST.completed },
        { ten: 'Cancelled', tenVi: 'đã huỷ', khop: ST.cancelled },
        { ten: 'Expired', tenVi: 'hết hạn', khop: ST.expired },
        { ten: 'No-show', tenVi: 'tutor vắng', khop: ST.noshow },
      ],
      ch: [
        { ten: 'requested → expired after 24 hours without an answer', tenVi: 'đã yêu cầu → hết hạn sau 24 giờ không trả lời', tu: ST.requested, den: ST.expired, suKien: ['24|hour|elapse|timeout|expire|no response'] },
        { ten: 'accepted (unpaid) → cancelled after 2 hours', tenVi: 'đã nhận (chưa trả) → huỷ sau 2 giờ', tu: ST.accepted, den: ST.cancelled, suKien: ['2 hour|two hour|elapse|timeout|not paid|unpaid'] },
        { ten: 'confirmed → cancelled only at least 12 hours before (guard)', tenVi: 'đã xác nhận → huỷ chỉ khi còn ≥ 12 giờ (guard)', tu: ST.confirmed, den: ST.cancelled, guard: true, lyDo: 'the free cancellation rule is a guard on the learner’s cancel event', lyDoVi: 'luật huỷ miễn phí là guard trên sự kiện huỷ của learner' },
        { ten: 'confirmed → no-show 15 minutes after start when the tutor has not joined (guard)', tenVi: 'đã xác nhận → no-show sau 15 phút khi tutor chưa vào (guard)', tu: ST.confirmed, den: ST.noshow, guard: true, lyDo: 'the same time event leads to In Progress or No-show depending on whether the tutor joined', lyDoVi: 'cùng một mốc thời gian dẫn tới In Progress hay No-show tuỳ tutor đã vào chưa' },
        { ten: 'after the session → disputed when the learner reports a problem within 48 hours', tenVi: 'sau buổi → tranh chấp khi learner báo sự cố trong 48 giờ', tu: ST.feedback.concat(ST.progress), den: ST.disputed, suKien: ['report|problem|complain|dispute'] },
        { ten: 'disputed → refunded by the moderator’s decision', tenVi: 'tranh chấp → hoàn tiền theo quyết định của moderator', tu: ST.disputed, den: ST.refunded, suKien: ['moderator|rul|decid|resolv'] },
      ],
    },
  },
  truDiem: [
    { en: 'States named as activities ("Paying", "Tutoring") instead of conditions ("Accepted", "In Progress").', vi: 'Đặt tên trạng thái là hoạt động ("Paying", "Tutoring") thay vì tình trạng ("Accepted", "In Progress").' },
    { en: 'One "Cancelled" arrow from Confirmed without the 12-hour guard: the learner could then cancel 5 minutes before for free.', vi: 'Mũi tên huỷ từ Confirmed không có guard 12 giờ: learner huỷ trước 5 phút vẫn miễn phí.' },
    { en: 'Drawing the Student Information System only for sign-in and forgetting that it supplies GPA and grades for eligibility.', vi: 'Vẽ SIS chỉ để đăng nhập mà quên nó cung cấp GPA và điểm để xét điều kiện tutor.' },
    { en: '«include» for the study room: only in-person sessions need a room ⇒ «extend».', vi: '«include» cho đặt phòng: chỉ buổi trực tiếp mới cần phòng ⇒ «extend».' },
  ],
  goiY: [
    'Năm thực thể ngoài là hệ thống: SIS, Campus E-wallet, Library Room Booking, Video Meeting, Notification Service; năm vai người dùng: Learner, Tutor, Academic Officer, Moderator, Platform Administrator.',
    'Câu 4: gạch chân mọi mốc thời gian (24 giờ, 2 giờ, 12 giờ, 15 phút, 48 giờ) — mỗi mốc là một sự kiện thời gian, thường kèm guard.',
    'Hai đường kết thúc của tranh chấp: moderator xử cho tutor ⇒ Completed (trả tutor), xử cho learner ⇒ Refunded.',
  ],
  loiHayGap: [
    'Vẽ "Timer" thành actor.',
    'Thiếu trạng thái Accepted (chờ thanh toán) — nhảy thẳng từ Requested sang Confirmed.',
    'Thiếu đường hết hạn 24 giờ của yêu cầu.',
    'Moderator không có mặt trong sơ đồ ngữ cảnh.',
  ],
  giaiThich: {
    en: '<p><b>How to read the paper.</b> Ten parties exchange data with SkillSwap: five user roles and five external systems; the SIS appears twice in the story (sign-in, then GPA and grades) but is one external entity. In the use case model, the eligibility check is always part of an application («include») while the room and the meeting link each happen only for one kind of session («extend» on payment). The session’s life is driven mostly by time: each deadline in the paper becomes a time event with a guard — and the dispute path ends in two different final states.</p>',
    vi: '<p><b>Cách đọc đề.</b> Mười bên trao đổi dữ liệu với SkillSwap: năm vai người dùng và năm hệ thống ngoài; SIS xuất hiện hai lần trong đề (đăng nhập, rồi GPA và điểm) nhưng chỉ là MỘT thực thể ngoài. Trong mô hình use case, kiểm điều kiện luôn là một phần của đơn («include»), còn đặt phòng và tạo link mỗi cái chỉ cho một loại buổi («extend» vào thanh toán). Vòng đời của buổi kèm chủ yếu do thời gian điều khiển: mỗi hạn chót trong đề là một sự kiện thời gian kèm guard — và nhánh tranh chấp kết thúc ở hai trạng thái cuối khác nhau.</p>',
  },
  boYeu: [
    { ten: 'state thiếu Accepted, không guard, timer là trạng thái', tep: { 'answers/q4-state.js': `const STATE_DIAGRAM = \`
stateDiagram-v2
  [*] --> Requested
  Requested --> Confirmed : tutor accepts
  Confirmed --> Cancelled : cancel
  Confirmed --> Tutoring : start
  Tutoring --> Completed : end
  Completed --> [*]
  Cancelled --> [*]
\`;
const STATES = [];
` } },
    { ten: 'context thiếu hệ thống ngoài, có module bên trong', tep: { 'answers/q2-context.js': `const CONTEXT_DIAGRAM = \`
flowchart LR
  S((SkillSwap Campus Peer-Tutoring Platform))
  PM((Payment module))
  LE[Learner] -->|session request| S
  S -->|confirmation| LE
  TU[Tutor] -->|accept decision| S
  S -->|payment| PM
\`;
` } },
  ],
});
