/**
 * SWR302 · PE luyện 5 — GreenRide Campus E-Scooter Sharing (định dạng SP26/FA25: Q4 = ERD khái niệm + bảng thực thể).
 * Điểm khó: hai quan hệ giữa STATION và RIDE (trạm bắt đầu / trạm kết thúc), vé tháng phủ một phần chuyến đi, giá theo khu.
 */
import { deThiPE } from './_pe.mjs';
import { kiemTuy, jsLit } from './_chung.mjs';

const DU_AN = 'GreenRide Campus E-Scooter Sharing';

const BOI_CANH = {
  en: `<p>The Hoa Lac campus of FPT University is large, and walking between the dormitories, the academic buildings and the sports area takes a long time. The university wants <b>GreenRide Campus E-Scooter Sharing</b>, a mobile system that lets students and staff (<b>riders</b>) rent electric scooters between docking stations. Riders pay per ride or buy monthly passes through the external <b>Campus E-wallet</b>.</p>
<p>Riders sign in with their university account through the external <b>Campus SSO</b>. Before their first ride, a rider must accept the safety rules; the system records the date of acceptance. Each docking station has a code, a name, a location and a number of docks, and belongs to one zone (for example the Academic zone or the Dormitory zone). Each zone has its own price per minute.</p>
<p>Each scooter has a serial number, a model, a battery level and a status. At any time a scooter is docked at no more than one station. A ride starts when a rider unlocks a scooter at a station — the scooter’s smart lock talks to GreenRide through the external <b>Scooter Fleet Gateway</b> — and ends when the scooter is docked at a station, which may be a different one. For each ride the system records the start and end time, the start station, the end station, the distance and the cost.</p>
<p>A rider may buy monthly passes; a pass has a type, a start date, an end date and a number of included minutes. A ride taken while one of the rider’s passes is valid is covered by that pass up to its included minutes; any other ride is paid individually. Each payment pays for exactly one ride or one pass; a ride has at most one payment.</p>
<p>Riders can report a problem with a scooter (brakes, battery, lock). <b>Maintenance technicians</b> work on maintenance tickets: each ticket concerns one scooter, is reported by a rider or opened by a technician, is handled by one technician, and records the problem, the actions taken and when it was closed. The <b>fleet manager</b> manages stations, zones and prices and views monthly usage reports. Receipts and pass-expiry reminders are e-mailed through the university <b>Notification Service</b>.</p>`,
  vi: `<p>Khuôn viên Hoà Lạc rất rộng. Trường muốn có <b>GreenRide Campus E-Scooter Sharing</b> — app cho sinh viên và cán bộ (<b>rider</b>) thuê xe scooter điện giữa các trạm đỗ. Rider trả theo chuyến hoặc mua vé tháng qua <b>Campus E-wallet</b> bên ngoài.</p>
<p>Rider đăng nhập bằng tài khoản trường qua <b>Campus SSO</b>. Trước chuyến đầu tiên phải chấp nhận nội quy an toàn (ghi ngày chấp nhận). Mỗi trạm có mã, tên, vị trí, số chỗ đỗ và thuộc một khu (khu Học tập, khu Ký túc xá…); mỗi khu có giá theo phút riêng.</p>
<p>Mỗi xe có số serial, mẫu xe, mức pin, trạng thái; tại mỗi thời điểm xe đỗ ở tối đa một trạm. Chuyến đi bắt đầu khi rider mở khoá xe ở một trạm — khoá thông minh liên lạc với GreenRide qua <b>Scooter Fleet Gateway</b> bên ngoài — và kết thúc khi xe được đỗ ở một trạm (có thể khác trạm đầu). Mỗi chuyến ghi giờ bắt đầu/kết thúc, trạm bắt đầu, trạm kết thúc, quãng đường, chi phí.</p>
<p>Rider có thể mua vé tháng (loại vé, ngày bắt đầu, ngày kết thúc, số phút bao gồm). Chuyến đi trong thời gian một vé của rider còn hiệu lực được vé đó chi trả tới số phút bao gồm; chuyến khác trả riêng. Mỗi khoản thanh toán trả cho đúng một chuyến hoặc một vé; một chuyến có tối đa một khoản thanh toán.</p>
<p>Rider có thể báo sự cố xe. <b>Kỹ thuật viên bảo trì</b> xử lý phiếu bảo trì: mỗi phiếu về một xe, do rider báo hoặc kỹ thuật viên mở, do một kỹ thuật viên xử lý, ghi sự cố, việc đã làm, thời điểm đóng. <b>Quản lý đội xe</b> quản lý trạm, khu, giá và xem báo cáo sử dụng tháng. Biên lai và nhắc hết hạn vé gửi qua <b>Notification Service</b> của trường.</p>`,
};

const A = {
  rider: { ten: 'Rider', khop: ['rider|student|user|member'] },
  tech: { ten: 'Maintenance Technician', khop: ['technician|maintenance'] },
  manager: { ten: 'Fleet Manager', khop: ['manager|admin'] },
  sso: { ten: 'Campus SSO', khop: ['sso|sign on|single sign|identity|authentication'] },
  wallet: { ten: 'Campus E-wallet', khop: ['wallet|payment'] },
  gateway: { ten: 'Scooter Fleet Gateway', khop: ['gateway|iot|smart lock'] },
  noti: { ten: 'Notification Service', khop: ['notif|mail|message'] },
};

const GIAI_CTX = `
flowchart LR
  S((GreenRide Campus E-Scooter Sharing))
  RI[Rider]
  TE[Maintenance Technician]
  FM[Fleet Manager]
  SSO[Campus SSO]
  EW[Campus E-wallet]
  FG[Scooter Fleet Gateway]
  NS[Notification Service]
  RI -->|unlock request, pass order, problem report| S
  S -->|station availability, ride receipt, pass confirmation| RI
  TE -->|ticket updates| S
  S -->|assigned tickets| TE
  FM -->|stations, zones and prices| S
  S -->|monthly usage report| FM
  S -->|sign-in request| SSO
  SSO -->|identity token| S
  S -->|payment request| EW
  EW -->|payment result| S
  S -->|unlock command| FG
  FG -->|scooter status and dock events| S
  S -->|receipts and reminders| NS
`;

const GIAI_UC = `
@startuml
left to right direction
actor Rider
actor "Maintenance Technician" as TE
actor "Fleet Manager" as FM
actor "Campus SSO" as SSO
actor "Campus E-wallet" as EW
actor "Scooter Fleet Gateway" as FG
actor "Notification Service" as NS
rectangle "GreenRide Campus E-Scooter Sharing" {
  usecase "Sign In" as UC1
  usecase "Accept Safety Rules" as UC2
  usecase "Find Available Scooter" as UC3
  usecase "Start Ride" as UC4
  usecase "End Ride" as UC5
  usecase "Calculate Ride Cost" as UC6
  usecase "Pay for Ride" as UC7
  usecase "Buy Monthly Pass" as UC8
  usecase "Report Scooter Problem" as UC9
  usecase "Handle Maintenance Ticket" as UC10
  usecase "Manage Stations and Zones" as UC11
  usecase "Set Zone Prices" as UC12
  usecase "View Usage Report" as UC13
  usecase "Send Notification" as UC14
}
Rider --> UC1
TE --> UC1
FM --> UC1
UC1 --> SSO
UC2 ..> UC4 : <<extend>>
Rider --> UC3
Rider --> UC4
UC4 --> FG
Rider --> UC5
UC5 --> FG
UC5 ..> UC6 : <<include>>
UC7 ..> UC5 : <<extend>>
UC7 --> EW
Rider --> UC8
UC8 --> EW
Rider --> UC9
TE --> UC10
FM --> UC11
FM --> UC12
FM --> UC13
UC8 ..> UC14 : <<include>>
UC14 --> NS
@enduml
`;

const GIAI_ACTORS = [
  ['Rider', 'A student or staff member who finds a scooter, starts and ends rides, buys passes and reports scooter problems.'],
  ['Maintenance Technician', 'Staff who handle maintenance tickets for scooters and record the actions taken.'],
  ['Fleet Manager', 'Manages docking stations, zones and per-minute prices and reads the monthly usage reports.'],
  ['Campus SSO', 'External university sign-on service that authenticates users and returns an identity token.'],
  ['Campus E-wallet', 'External payment service that charges riders for single rides and monthly passes.'],
  ['Scooter Fleet Gateway', 'External gateway that relays unlock commands to scooters and reports their status and dock events.'],
  ['Notification Service', 'External university service that e-mails receipts and pass-expiry reminders.'],
].map(([name, description]) => ({ name, description }));

const GIAI_UCS = [
  ['UC-01', 'Sign In', ['Rider', 'Maintenance Technician', 'Fleet Manager', 'Campus SSO'], 'A user signs in with the university account through Campus SSO.'],
  ['UC-02', 'Accept Safety Rules', [], 'Extension of starting a ride: before the first ride only, the rider accepts the safety rules.'],
  ['UC-03', 'Find Available Scooter', ['Rider'], 'The rider sees stations with available scooters and their battery levels.'],
  ['UC-04', 'Start Ride', ['Rider', 'Scooter Fleet Gateway'], 'The rider unlocks a scooter at a station; the gateway opens the lock.'],
  ['UC-05', 'End Ride', ['Rider', 'Scooter Fleet Gateway'], 'The rider docks the scooter at a station; the gateway reports the dock event.'],
  ['UC-06', 'Calculate Ride Cost', [], 'Included in ending every ride: the cost is computed from the minutes, the zone price and any valid pass.'],
  ['UC-07', 'Pay for Ride', ['Campus E-wallet'], 'Extension of ending a ride that no valid pass covers: the cost is charged to the e-wallet.'],
  ['UC-08', 'Buy Monthly Pass', ['Rider', 'Campus E-wallet'], 'The rider buys a monthly pass and pays through the e-wallet.'],
  ['UC-09', 'Report Scooter Problem', ['Rider'], 'The rider reports a problem with a scooter, which opens a maintenance ticket.'],
  ['UC-10', 'Handle Maintenance Ticket', ['Maintenance Technician'], 'The technician works on a ticket, records actions and closes it.'],
  ['UC-11', 'Manage Stations and Zones', ['Fleet Manager'], 'The fleet manager adds or changes docking stations and the zones they belong to.'],
  ['UC-12', 'Set Zone Prices', ['Fleet Manager'], 'The fleet manager sets the price per minute of each zone.'],
  ['UC-13', 'View Usage Report', ['Fleet Manager'], 'The fleet manager reads monthly rides, minutes, revenue and scooter availability.'],
  ['UC-14', 'Send Notification', ['Notification Service'], 'Included when a receipt or reminder must be e-mailed through the notification service.'],
].map(([id, name, actors, description]) => ({ id, name, actors, description }));

const GIAI_ERD = `
erDiagram
  RIDER ||--o{ RIDE : takes
  SCOOTER ||--o{ RIDE : "is used in"
  STATION ||--o{ RIDE : "is start of"
  STATION ||--o{ RIDE : "is end of"
  ZONE ||--o{ STATION : contains
  STATION |o--o{ SCOOTER : docks
  RIDER ||--o{ PASS : buys
  PASS |o--o{ RIDE : covers
  RIDE ||--o| PAYMENT : "is paid by"
  PASS ||--|| PAYMENT : "is paid by"
  SCOOTER ||--o{ MAINTENANCE_TICKET : "is subject of"
  TECHNICIAN ||--o{ MAINTENANCE_TICKET : handles
  RIDER |o--o{ MAINTENANCE_TICKET : reports
  RIDER {
    string riderId PK
    string fullName
    date safetyAcceptedOn
  }
  SCOOTER {
    string serialNumber PK
    string model
    int batteryLevel
    string status
  }
  STATION {
    string stationCode PK
    string name
    string location
    int docks
  }
  ZONE {
    string zoneCode PK
    string name
    decimal pricePerMinute
  }
  RIDE {
    string rideId PK
    datetime startTime
    datetime endTime
    decimal distanceKm
    decimal cost
  }
  PASS {
    string passId PK
    string passType
    date startDate
    date endDate
    int includedMinutes
  }
  PAYMENT {
    string paymentId PK
    decimal amount
    datetime paidAt
  }
  MAINTENANCE_TICKET {
    string ticketId PK
    string problem
    string actions
    datetime closedAt
  }
  TECHNICIAN {
    string technicianId PK
    string fullName
  }
`;

const GIAI_ENTITIES = [
  ['RIDER', 'A student or staff member who rents scooters; keeps the date the safety rules were accepted.', ['riderId', 'fullName', 'safetyAcceptedOn']],
  ['SCOOTER', 'One physical e-scooter identified by its serial number, with model, battery level and status.', ['serialNumber', 'model', 'batteryLevel', 'status']],
  ['STATION', 'A docking station with a code, name, location and number of docks; belongs to one zone.', ['stationCode', 'name', 'location', 'docks']],
  ['ZONE', 'An area of the campus with its own price per minute; contains several stations.', ['zoneCode', 'name', 'pricePerMinute']],
  ['RIDE', 'One rental of one scooter by one rider, from a start station to an end station, with times, distance and cost.', ['rideId', 'startTime', 'endTime', 'distanceKm', 'cost']],
  ['PASS', 'A monthly pass bought by a rider, with type, validity dates and included minutes; may cover several rides.', ['passId', 'passType', 'startDate', 'endDate', 'includedMinutes']],
  ['PAYMENT', 'A charge through the e-wallet that pays for exactly one ride or one pass.', ['paymentId', 'amount', 'paidAt']],
  ['MAINTENANCE_TICKET', 'A record of a problem with one scooter, reported by a rider or opened by a technician, and its resolution.', ['ticketId', 'problem', 'actions', 'closedAt']],
  ['TECHNICIAN', 'A maintenance technician who handles maintenance tickets.', ['technicianId', 'fullName']],
].map(([name, description, attributes]) => ({ name, description, attributes }));

const P = { rider: ['rider|member|customer|user'], scooter: ['scooter|vehicle|bike'], station: ['station|dock'], zone: ['zone|area|region'], ride: ['^ride$|^trip$|^rental$|^journey$|ride record'], pass: ['pass|subscription|membership plan'], pay: ['payment|transaction|charge'], ticket: ['ticket|maint|repair|issue'], tech: ['technician|mechanic|staff'] };

const kiemHaiTram = kiemTuy({ en: 'Q4 — a ride has TWO relationships with STATION (start station and end station)', vi: 'Câu 4 — chuyến đi có HAI quan hệ với STATION (trạm bắt đầu và trạm kết thúc)' }, function () {
  if (typeof ERD !== 'string') return 'ERD is missing';
  var n = ERD.split(/\n/).filter(function (l) { return /--/.test(l) && /\b\w*station\w*\b/i.test(l) && /\b(ride|trip|rental|journey)\b/i.test(l); }).length;
  return n >= 2 ? 'OK' : 'the paper records a start station AND an end station for each ride — draw two relationships between STATION and RIDE (e.g. "is start of", "is end of")';
}, { nhom: 'f10' });

export default deThiPE({
  so: 5,
  slug: 'swr302-11-pe-5-greenride-scooters',
  ten: 'PE Practice 5 — GreenRide e-scooter sharing (context · use case · ERD)',
  tieuDe: 'PE Practice 5 — GreenRide Campus E-Scooter Sharing',
  moTaModule: 'PE luyện định dạng SP26/FA25: trang bìa SRS, context diagram 7 thực thể, use case + hai bảng (include tính giá, extend chấp nhận nội quy / trả tiền chuyến), ERD khái niệm 9 thực thể với hai quan hệ trạm–chuyến, vé tháng phủ chuyến, giá theo khu — tình huống mới, chấm sâu hơn đề thật.',
  maDe: 'SWR302_PE_Practice_5',
  duAn: DU_AN,
  phu: { en: 'SP26 format · 90 minutes · 10 points · Q4 = conceptual ERD + entity table', vi: 'Định dạng SP26 · 90 phút · 10 điểm · Câu 4 = ERD khái niệm + bảng thực thể' },
  boiCanh: BOI_CANH,
  moTaNgan: 'PE luyện 5 (SP26): GreenRide — context, use case + 2 bảng, ERD khái niệm.',
  q2: {
    giai: GIAI_CTX,
    cfg: {
      ngoai: [
        { ...A.rider, can: ['vao', 'ra'], luong: [{ huong: 'vao', ten: 'unlock request / pass order', khop: ['unlock|ride|pass|order'] }, { huong: 'ra', ten: 'ride receipt / availability', khop: ['receipt|availab|confirm'] }] },
        { ...A.tech, can: ['vao', 'ra'], luong: [{ huong: 'ra', ten: 'assigned tickets', khop: ['ticket|task|job|assign'] }] },
        { ...A.manager, can: ['vao', 'ra'], luong: [{ huong: 'vao', ten: 'stations / zones / prices', khop: ['station|zone|price'] }, { huong: 'ra', ten: 'usage report', khop: ['report|statistic'] }] },
        { ...A.sso, can: ['vao', 'ra'] },
        { ...A.wallet, can: ['vao', 'ra'], luong: [{ huong: 'vao', ten: 'payment result', khop: ['result|status|confirm|receipt'] }] },
        { ...A.gateway, can: ['vao', 'ra'], luong: [{ huong: 'vao', ten: 'scooter status / dock events', khop: ['status|dock|event|battery|location'] }, { huong: 'ra', ten: 'unlock command', khop: ['unlock|command|lock'] }] },
        { ...A.noti, can: ['ra'] },
      ],
      cam: [
        { ten: 'Scooter / Station / Ride', khop: ['^e?-?scooters?$|^station|^ride$|^dock'], lyDo: 'scooters, stations and rides are data and things the system manages — the external party is the Scooter Fleet Gateway', lyDoVi: 'xe, trạm, chuyến là dữ liệu/đồ vật hệ thống quản lý — bên ngoài là Scooter Fleet Gateway' },
        { ten: 'Database / pricing engine', khop: ['database|\\bdb\\b|engine|module'], lyDo: 'that is inside GreenRide', lyDoVi: 'đó là bên trong GreenRide' },
      ],
      toiThieuLuong: 12,
    },
  },
  q3: {
    giaiUC: GIAI_UC, giaiActors: GIAI_ACTORS, giaiUCs: GIAI_UCS,
    cfg: {
      actors: [A.rider, A.tech, A.manager, A.sso, A.wallet, A.gateway, A.noti],
      camActor: [
        { ten: 'Scooter / Station', khop: ['^e?-?scooters?$|^station|^dock'], lyDo: 'the scooter is a managed object; its lock talks to the system through the Scooter Fleet Gateway actor', lyDoVi: 'xe là đối tượng được quản lý; khoá xe nói chuyện với hệ thống qua actor Scooter Fleet Gateway' },
      ],
      ucs: [
        { ten: 'Sign in through Campus SSO', khop: ['sign in|log ?in|authenticat'], actor: [A.sso] },
        { ten: 'Find an available scooter', khop: ['find|search|available|locate'], actor: [A.rider] },
        { ten: 'Start a ride (unlock)', khop: ['start ride|unlock|begin ride|rent scooter'], actor: [A.rider, A.gateway] },
        { ten: 'End a ride (dock)', khop: ['end ride|return scooter|dock|finish ride|lock scooter'], actor: [A.rider] },
        { ten: 'Buy a monthly pass', khop: ['pass|subscri'], actor: [A.rider, A.wallet] },
        { ten: 'Report a scooter problem', khop: ['report (scooter )?problem|report issue|report fault'], actor: [A.rider] },
        { ten: 'Handle a maintenance ticket', khop: ['ticket|maint|repair'], actor: [A.tech] },
        { ten: 'Manage stations and zones', khop: ['manage station|stations|zone'], actor: [A.manager] },
        { ten: 'Set zone prices', khop: ['price|pricing|tariff'], actor: [A.manager] },
        { ten: 'View the usage report', khop: ['usage report|view report|statistic'], actor: [A.manager] },
      ],
      quanHe: [
        { loai: 'include', ten: 'End Ride «include» Calculate Ride Cost', tu: ['end ride|return scooter|finish ride'], den: ['cost|calculat|fare'], lyDo: 'the cost is computed at the end of EVERY ride', lyDoVi: 'chi phí được tính khi kết thúc MỌI chuyến' },
        { loai: 'extend', ten: 'Pay for Ride «extend» End Ride', tu: ['^pay|pay for|charge ride'], den: ['end ride|return scooter|finish ride'], lyDo: 'only rides not covered by a valid pass are paid individually', lyDoVi: 'chỉ chuyến không có vé tháng hợp lệ mới trả riêng' },
      ],
      toiThieuUC: 11,
    },
  },
  q4: {
    loai: 'erd',
    de: { en: 'draw a <b>conceptual ERD</b> for GreenRide and briefly describe every entity (and its key attributes) in the entity table. Pay attention to how a ride relates to stations, to passes and to payments.', vi: 'vẽ <b>ERD mức khái niệm</b> cho GreenRide và mô tả ngắn mọi thực thể (và thuộc tính chính) trong bảng thực thể. Chú ý quan hệ của chuyến đi với trạm, với vé tháng và với thanh toán.' },
    giai: GIAI_ERD, giaiBang: GIAI_ENTITIES,
    viTri: { ZONE: [120, 90], PAYMENT: [480, 90], PASS: [840, 90], STATION: [120, 380], RIDE: [480, 380], RIDER: [840, 380], SCOOTER: [300, 680], MAINTENANCE_TICKET: [620, 680], TECHNICIAN: [840, 680] },
    cfg: {
      tt: [
        { ten: 'Rider', khop: P.rider }, { ten: 'Scooter', khop: P.scooter }, { ten: 'Station', khop: P.station }, { ten: 'Zone', khop: P.zone },
        { ten: 'Ride', khop: P.ride }, { ten: 'Pass', khop: P.pass }, { ten: 'Payment', khop: P.pay }, { ten: 'Maintenance ticket', khop: P.ticket },
      ],
      camTt: [
        { ten: 'Battery / Price / Location', khop: ['^battery|^price|^location|^status$|^cost$'], lyDo: 'that is an attribute', lyDoVi: 'đó là thuộc tính' },
        { ten: 'Campus SSO / E-wallet / Fleet Gateway', khop: ['sso|wallet|gateway'], lyDo: 'external systems are actors, not data the system stores', lyDoVi: 'hệ thống ngoài là actor, không phải dữ liệu cần lưu' },
      ],
      qh: [
        { ten: 'Rider 1 — N Ride', a: P.rider, b: P.ride, nhieu: 'b' },
        { ten: 'Scooter 1 — N Ride', a: P.scooter, b: P.ride, nhieu: 'b' },
        { ten: 'Station 1 — N Ride', a: P.station, b: P.ride, nhieu: 'b' },
        { ten: 'Zone 1 — N Station', a: P.zone, b: P.station, nhieu: 'b', lyDo: 'each station belongs to one zone; a zone has many stations', lyDoVi: 'mỗi trạm thuộc một khu; một khu nhiều trạm' },
        { ten: 'Station 1 — N Scooter docked (at most one station per scooter)', a: P.station, b: P.scooter, nhieu: 'b', minA: 0, lyDo: 'a scooter is docked at NO MORE than one station — zero while it is being ridden', lyDoVi: 'xe đỗ ở TỐI ĐA một trạm — không trạm nào khi đang chạy' },
        { ten: 'Rider 1 — N Pass', a: P.rider, b: P.pass, nhieu: 'b' },
        { ten: 'Pass 1 — N Ride (optional coverage)', a: P.pass, b: P.ride, nhieu: 'b', minA: 0, lyDo: 'a ride may or may not be covered by a pass', lyDoVi: 'một chuyến có thể có hoặc không có vé chi trả' },
        { ten: 'Ride 1 — 0..1 Payment', a: P.ride, b: P.pay, nhieu: 'mot' },
        { ten: 'Scooter 1 — N Maintenance ticket', a: P.scooter, b: P.ticket, nhieu: 'b' },
      ],
      khongTrucTiep: [
        { ten: 'Rider–Scooter goes through Ride', a: P.rider, b: P.scooter, lyDo: 'a rider uses a scooter through rides — no direct relationship', lyDoVi: 'rider dùng xe thông qua chuyến đi — không nối thẳng' },
      ],
    },
  },
  kiemThem: [kiemHaiTram],
  truDiem: [
    { en: 'One relationship between STATION and RIDE: the paper records both a start station and an end station.', vi: 'Chỉ một quan hệ STATION–RIDE: đề ghi cả trạm bắt đầu và trạm kết thúc.' },
    { en: 'RIDER linked directly to SCOOTER (many-to-many) instead of through RIDE.', vi: 'Nối thẳng RIDER với SCOOTER (nhiều–nhiều) thay vì qua RIDE.' },
    { en: 'Price stored on STATION or RIDE as an entity: the price per minute is an attribute of ZONE.', vi: 'Giá đặt thành thực thể ở STATION hay RIDE: giá theo phút là thuộc tính của ZONE.' },
    { en: 'Drawing the scooter as an actor: its lock communicates through the Scooter Fleet Gateway.', vi: 'Vẽ xe scooter thành actor: khoá xe giao tiếp qua Scooter Fleet Gateway.' },
  ],
  goiY: [
    'Câu 2/3: bảy bên ngoài — Rider, Maintenance Technician, Fleet Manager, Campus SSO, Campus E-wallet, Scooter Fleet Gateway, Notification Service.',
    'Câu 3: "the cost is computed for every ride" ⇒ «include»; "any other ride is paid individually" ⇒ trả tiền có điều kiện ⇒ «extend»; "before their first ride" ⇒ nội quy là «extend» của Start Ride.',
    'Câu 4: "start station … end station" ⇒ HAI quan hệ STATION–RIDE; "docked at no more than one station" ⇒ phía STATION là |o (0..1).',
  ],
  loiHayGap: [
    'Một thực thể "Transaction" chung cho chuyến và vé mà không phân biệt quan hệ.',
    'Ghi stationCode FK trong RIDE (ERD khái niệm không ghi FK).',
    'Quên ZONE vì nghĩ giá thuộc về trạm.',
    'Thiếu TECHNICIAN — người xử lý phiếu cũng là dữ liệu cần lưu.',
  ],
  giaiThich: {
    en: '<p><b>How to read the paper.</b> Seven parties exchange data with GreenRide: riders, technicians, the fleet manager and four external systems; the scooter itself is not one of them — its lock talks through the Scooter Fleet Gateway. In the ERD, the ride is the centre: one rider, one scooter, a start station and an end station (two separate relationships), at most one payment, and possibly one covering pass. Zones carry the price; stations belong to zones; scooters are docked at zero or one station.</p>',
    vi: '<p><b>Cách đọc đề.</b> Bảy bên trao đổi dữ liệu với GreenRide: rider, kỹ thuật viên, quản lý đội xe và bốn hệ thống ngoài; bản thân chiếc xe KHÔNG phải một bên — khoá xe nói chuyện qua Scooter Fleet Gateway. Trong ERD, chuyến đi là trung tâm: một rider, một xe, một trạm bắt đầu và một trạm kết thúc (hai quan hệ riêng), tối đa một thanh toán, có thể có một vé tháng chi trả. Khu mang giá; trạm thuộc khu; xe đỗ ở 0 hoặc 1 trạm.</p>',
  },
  boYeu: [
    { ten: 'một quan hệ trạm–chuyến, nối thẳng rider–scooter, có FK', tep: { 'answers/q4-erd.js': `const ERD = \`
erDiagram
  RIDER }o--o{ SCOOTER : rides
  STATION ||--o{ RIDE : has
  RIDER ||--o{ RIDE : takes
  ZONE ||--o{ STATION : contains
  RIDER {
    string riderId PK
  }
  SCOOTER {
    string serialNumber PK
  }
  STATION {
    string stationCode PK
  }
  RIDE {
    string rideId PK
    string stationCode FK
  }
  ZONE {
    string zoneCode PK
  }
\`;
const ENTITIES = [];
` }, phaiTruot: ['TWO relationships with STATION', 'Rider–Scooter goes through Ride'] },
    { ten: 'xe scooter là actor + trả tiền dùng include', tep: { 'answers/q3-usecases.js': `const USE_CASE_DIAGRAM = \`${GIAI_UC.replace('UC7 ..> UC5 : <<extend>>', 'UC5 ..> UC7 : <<include>>').replace('actor Rider', 'actor Rider\nactor Scooter\nScooter --> UC4')}\`;\nconst ACTORS = ${jsLit(GIAI_ACTORS)};\nconst USE_CASES = ${jsLit(GIAI_UCS)};\n` }, phaiTruot: ['Pay for Ride «extend» End Ride'] },
  ],
});
