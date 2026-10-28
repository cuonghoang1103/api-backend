/**
 * SWR302 · PE luyện 2 — LostLink AI-Assisted Lost & Found Platform (định dạng SU26: Q4 = sơ đồ chuyển trạng thái,
 * có chuyển do AI kích hoạt + guard theo ngưỡng — giống dạng SWR302-PE25 SU26 nhưng là tình huống MỚI).
 */
import { deThiPE } from './_pe.mjs';
import { jsLit } from './_chung.mjs';

const DU_AN = 'LostLink AI-Assisted Lost & Found Platform';

const BOI_CANH = {
  en: `<p>Every semester hundreds of items — student cards, laptops, wallets, earbuds — are lost on an FPT University campus. Today found items sit in a drawer at the security desk and owners must come and ask in person. The university wants <b>LostLink</b>, an AI-assisted lost &amp; found platform.</p>
<p>Students and staff sign in with their university account through the external <b>Campus Single Sign-On (SSO)</b> service. A <b>finder</b> logs a found item by uploading photos, the place and the time it was found, then hands the item to the security desk, where a <b>security officer</b> confirms receipt and stores it in a numbered locker. A person who has lost something (the <b>owner</b>) files a lost report with a description and the approximate place, and may attach photos if they have any.</p>
<p>Each time a found item or a lost report is added, LostLink's <b>AI matching engine</b> compares the images and descriptions and computes a similarity score. When the score is at least 0.80 the item becomes <i>match suggested</i> and the owner is notified with the matched photo; when the score is between 0.50 and 0.80 the pair is put in a review queue that a security officer checks manually. The owner confirms or rejects a suggested match. After confirming, the owner books a pick-up slot. At the desk the security officer always verifies the owner's identity (student card, or the answer to a secret question about the item) before recording the handover. If the owner does not come within 7 days, the claim expires and the item becomes available for matching again.</p>
<p>Items still unclaimed 60 days after they were received are released to the university's <b>charity partner</b>, which receives a monthly list of items to collect. High-value items (laptops, phones, wallets with cash) are never donated: after 60 days they are transferred to the <b>campus police</b>, who receive a transfer record. Perishable items (food, drinks) are disposed of 24 hours after they are received.</p>
<p>The <b>Lost &amp; Found manager</b> configures the matching thresholds, item categories and retention periods, and views monthly statistics (items found, return rate, average days to return). All e-mail and in-app notifications are delivered through the university's external <b>notification service</b>.</p>`,
  vi: `<p>Mỗi học kỳ có hàng trăm đồ vật — thẻ sinh viên, laptop, ví, tai nghe — bị đánh rơi trong khuôn viên FPT University. Hiện đồ nhặt được nằm trong ngăn kéo ở bàn bảo vệ và chủ phải tới hỏi trực tiếp. Trường muốn có <b>LostLink</b>, nền tảng tìm đồ thất lạc có hỗ trợ AI.</p>
<p>Sinh viên và cán bộ đăng nhập bằng tài khoản trường qua dịch vụ <b>đăng nhập một lần (Campus SSO)</b> bên ngoài. <b>Người nhặt được (finder)</b> ghi nhận đồ nhặt được bằng cách tải ảnh, nơi và giờ nhặt, rồi giao đồ cho bàn bảo vệ, nơi <b>nhân viên bảo vệ (security officer)</b> xác nhận đã nhận và cất vào tủ có đánh số. Người bị mất đồ (<b>chủ đồ — owner</b>) lập báo mất kèm mô tả và nơi mất ước chừng, và CÓ THỂ đính kèm ảnh nếu có.</p>
<p>Mỗi khi có đồ nhặt được hoặc báo mất mới, <b>bộ máy ghép cặp AI</b> của LostLink so ảnh và mô tả rồi tính điểm tương đồng. Điểm từ 0.80 trở lên ⇒ đồ chuyển sang <i>đã gợi ý ghép</i> và chủ đồ được báo kèm ảnh khớp; điểm từ 0.50 tới dưới 0.80 ⇒ cặp được đưa vào hàng chờ để bảo vệ xem tay. Chủ đồ xác nhận hoặc từ chối gợi ý. Sau khi xác nhận, chủ đồ đặt lịch nhận. Tại bàn, bảo vệ LUÔN kiểm tra danh tính chủ đồ (thẻ sinh viên, hoặc câu trả lời cho câu hỏi bí mật về món đồ) rồi mới ghi nhận bàn giao. Nếu chủ đồ không tới trong 7 ngày, yêu cầu nhận hết hạn và món đồ quay lại trạng thái chờ ghép.</p>
<p>Đồ không ai nhận sau 60 ngày kể từ khi bàn bảo vệ nhận sẽ được chuyển cho <b>đối tác từ thiện</b> của trường, đối tác nhận danh sách đồ cần lấy hằng tháng. Đồ giá trị cao (laptop, điện thoại, ví có tiền) không bao giờ được quyên góp: sau 60 ngày chúng được chuyển cho <b>công an khu vực (campus police)</b>, bên nhận biên bản chuyển giao. Đồ dễ hỏng (thức ăn, đồ uống) bị huỷ sau 24 giờ kể từ khi nhận.</p>
<p><b>Người quản lý phòng đồ thất lạc (Lost &amp; Found manager)</b> cấu hình ngưỡng ghép, danh mục đồ và thời hạn lưu giữ, và xem thống kê hằng tháng (số đồ nhặt được, tỉ lệ trả lại, số ngày trung bình để trả). Mọi e-mail và thông báo trong ứng dụng đi qua <b>dịch vụ thông báo</b> bên ngoài của trường.</p>`,
};

const A = {
  finder: { ten: 'Finder', khop: ['finder|student|member|user|reporter'] },
  owner: { ten: 'Owner', khop: ['owner|student|member|user|loser|claimant'] },
  officer: { ten: 'Security Officer', khop: ['security|officer|guard'] },
  manager: { ten: 'Lost & Found Manager', khop: ['manager|admin'] },
  sso: { ten: 'Campus SSO', khop: ['sso|sign on|single sign|identity provider|authentication'] },
  noti: { ten: 'Notification Service', khop: ['notif|mail|message'] },
  charity: { ten: 'Charity Partner', khop: ['charity|donation|ngo'] },
  police: { ten: 'Campus Police', khop: ['police'] },
};

const GIAI_CTX = `
flowchart LR
  S((LostLink AI-Assisted Lost & Found Platform))
  FI[Finder]
  OW[Owner]
  SO[Security Officer]
  MG[Lost & Found Manager]
  SSO[Campus SSO]
  NS[Notification Service]
  CP[Charity Partner]
  PO[Campus Police]
  FI -->|found item details and photos| S
  S -->|found item receipt| FI
  OW -->|lost report, match decision, pick-up booking| S
  S -->|match suggestion, pick-up confirmation| OW
  SO -->|receipt confirmation, review decision, handover record| S
  S -->|review queue, pick-up schedule| SO
  MG -->|matching thresholds, categories, retention periods| S
  S -->|monthly statistics| MG
  S -->|sign-in request| SSO
  SSO -->|identity token| S
  S -->|notification messages| NS
  NS -->|delivery status| S
  S -->|monthly donation list| CP
  CP -->|collection confirmation| S
  S -->|police transfer record| PO
`;

const GIAI_UC = `
@startuml
left to right direction
actor Finder
actor Owner
actor "Security Officer" as SO
actor "Lost & Found Manager" as MG
actor "Campus SSO" as SSO
actor "Notification Service" as NS
actor "Charity Partner" as CP
actor "Campus Police" as PO
rectangle "LostLink AI-Assisted Lost & Found Platform" {
  usecase "Sign In" as UC1
  usecase "Log Found Item" as UC2
  usecase "File Lost Report" as UC3
  usecase "Attach Item Photos" as UC4
  usecase "Respond to Match Suggestion" as UC5
  usecase "Book Pick-up Slot" as UC6
  usecase "Confirm Item Receipt" as UC7
  usecase "Review Uncertain Match" as UC8
  usecase "Record Handover" as UC9
  usecase "Verify Owner Identity" as UC10
  usecase "Release Unclaimed Items" as UC11
  usecase "Transfer High-Value Items" as UC12
  usecase "Dispose Perishable Items" as UC13
  usecase "Configure Matching Rules" as UC14
  usecase "View Monthly Statistics" as UC15
  usecase "Send Notification" as UC16
}
Finder --> UC1
Owner --> UC1
SO --> UC1
MG --> UC1
UC1 --> SSO
Finder --> UC2
Owner --> UC3
UC4 ..> UC3 : <<extend>>
Owner --> UC5
Owner --> UC6
SO --> UC7
SO --> UC8
SO --> UC9
UC9 ..> UC10 : <<include>>
SO --> UC11
UC11 --> CP
SO --> UC12
UC12 --> PO
SO --> UC13
MG --> UC14
MG --> UC15
UC5 ..> UC16 : <<include>>
UC16 --> NS
@enduml
`;

const GIAI_ACTORS = [
  ['Finder', 'A student or staff member who finds an item on campus, logs it with photos and hands it to the security desk.'],
  ['Owner', 'A student or staff member who lost an item, files a lost report, answers match suggestions and picks the item up.'],
  ['Security Officer', 'Staff at the security desk who receive items, review uncertain matches, verify owners and record handovers.'],
  ['Lost & Found Manager', 'Configures matching thresholds, item categories and retention periods and reads the monthly statistics.'],
  ['Campus SSO', 'External university sign-on service that authenticates every user and returns an identity token.'],
  ['Notification Service', 'External university service that delivers the e-mails and in-app notifications sent by LostLink.'],
  ['Charity Partner', 'External charity organisation that receives the monthly list of unclaimed items and collects them.'],
  ['Campus Police', 'External police unit that receives the transfer record of high-value items left unclaimed for 60 days.'],
].map(([name, description]) => ({ name, description }));

const GIAI_UCS = [
  ['UC-01', 'Sign In', ['Finder', 'Owner', 'Security Officer', 'Lost & Found Manager', 'Campus SSO'], 'Any user signs in with the university account; Campus SSO authenticates the user and returns an identity token.'],
  ['UC-02', 'Log Found Item', ['Finder'], 'The finder records a found item with photos, the place and the time it was found.'],
  ['UC-03', 'File Lost Report', ['Owner'], 'The owner describes the lost item and the approximate place so the AI engine can search for it.'],
  ['UC-04', 'Attach Item Photos', [], 'Optional extension of filing a lost report: the owner adds photos of the lost item when available.'],
  ['UC-05', 'Respond to Match Suggestion', ['Owner'], 'The owner views a suggested match with its photo and confirms or rejects that the item is theirs.'],
  ['UC-06', 'Book Pick-up Slot', ['Owner'], 'After confirming a match the owner books a time to collect the item at the security desk.'],
  ['UC-07', 'Confirm Item Receipt', ['Security Officer'], 'The officer confirms that a logged item has arrived at the desk and assigns it a locker number.'],
  ['UC-08', 'Review Uncertain Match', ['Security Officer'], 'The officer checks a pair with a similarity score between 0.50 and 0.80 and approves or rejects it.'],
  ['UC-09', 'Record Handover', ['Security Officer'], 'The officer records that the item was returned to its owner after verifying the owner identity.'],
  ['UC-10', 'Verify Owner Identity', [], 'Included in every handover: the officer checks the student card or the answer to the secret question.'],
  ['UC-11', 'Release Unclaimed Items', ['Security Officer', 'Charity Partner'], 'Items unclaimed for 60 days that are not high value are listed monthly for the charity partner to collect.'],
  ['UC-12', 'Transfer High-Value Items', ['Security Officer', 'Campus Police'], 'High-value items unclaimed for 60 days are handed to the campus police with a transfer record.'],
  ['UC-13', 'Dispose Perishable Items', ['Security Officer'], 'Food and drinks are disposed of 24 hours after they were received and the disposal is recorded.'],
  ['UC-14', 'Configure Matching Rules', ['Lost & Found Manager'], 'The manager sets the similarity thresholds, item categories and retention periods used by the platform.'],
  ['UC-15', 'View Monthly Statistics', ['Lost & Found Manager'], 'The manager reads items found, return rate and average days to return for each month.'],
  ['UC-16', 'Send Notification', ['Notification Service'], 'Included whenever a user must be told something: the message is delivered by the notification service.'],
].map(([id, name, actors, description]) => ({ id, name, actors, description }));

const GIAI_STATE = `
stateDiagram-v2
  [*] --> Logged : item logged by finder
  state "In Custody" as InCustody
  state "Under Review" as UnderReview
  state "Match Suggested" as MatchSuggested
  state "Claim Pending" as ClaimPending
  state "Transferred to Police" as Transferred
  Logged --> InCustody : receipt confirmed by officer / assign locker
  Logged --> Disposed : 24 hours elapsed [perishable item]
  InCustody --> MatchSuggested : AI match found [similarity >= 0.80] / notify owner
  InCustody --> UnderReview : AI match found [0.50 <= similarity < 0.80]
  UnderReview --> MatchSuggested : officer approves match / notify owner
  UnderReview --> InCustody : officer rejects match
  MatchSuggested --> ClaimPending : owner confirms match
  MatchSuggested --> InCustody : owner rejects match
  ClaimPending --> Returned : handover recorded [identity verified]
  ClaimPending --> InCustody : claim expires [7 days without pick-up]
  InCustody --> Donated : monthly release [unclaimed 60 days and not high value] / add to donation list
  InCustody --> Transferred : retention ends [unclaimed 60 days and high value] / create transfer record
  InCustody --> Disposed : 24 hours elapsed [perishable item]
  Returned --> [*]
  Donated --> [*]
  Transferred --> [*]
  Disposed --> [*]
`;

const GIAI_STATES = [
  ['Logged', 'The finder has recorded the item in LostLink but the security desk has not received it yet.'],
  ['In Custody', 'The item is stored in a numbered locker at the security desk and is available for AI matching.'],
  ['Under Review', 'The AI found a possible owner with a medium similarity score and a security officer must decide.'],
  ['Match Suggested', 'A likely owner has been notified with the matched photo and must confirm or reject the match.'],
  ['Claim Pending', 'The owner confirmed the match and has seven days to pick the item up at the desk.'],
  ['Returned', 'The owner identity was verified and the handover was recorded; the case is closed successfully.'],
  ['Donated', 'An ordinary item stayed unclaimed for sixty days and was released to the charity partner.'],
  ['Transferred to Police', 'A high-value item stayed unclaimed for sixty days and was handed to the campus police.'],
  ['Disposed', 'A perishable item was thrown away twenty-four hours after it was received, as the policy requires.'],
].map(([name, description]) => ({ name, description }));

export default deThiPE({
  so: 2,
  slug: 'swr302-11-pe-2-lostlink-ai-lost-found',
  ten: 'PE Practice 2 — LostLink AI Lost & Found (context · use case · state machine)',
  tieuDe: 'PE Practice 2 — LostLink AI-Assisted Lost & Found Platform',
  maDe: 'SWR302_PE_Practice_2',
  duAn: DU_AN,
  phu: { en: 'SU26 format · 90 minutes · 10 points · Q4 = state transition diagram with AI-triggered transitions', vi: 'Định dạng SU26 · 90 phút · 10 điểm · Câu 4 = sơ đồ chuyển trạng thái có chuyển do AI kích hoạt' },
  boiCanh: BOI_CANH,
  moTaNgan: 'PE luyện 2 (SU26): LostLink — context, use case + 2 bảng, máy trạng thái của Found Item.',
  q2: {
    giai: GIAI_CTX,
    cfg: {
      ngoai: [
        { ...A.finder, can: ['vao'], luong: [{ huong: 'vao', ten: 'found item details / photos', khop: ['found|item|photo'] }] },
        { ...A.owner, can: ['vao', 'ra'], luong: [{ huong: 'vao', ten: 'lost report', khop: ['lost|report'] }, { huong: 'ra', ten: 'match suggestion', khop: ['match|suggest'] }] },
        { ...A.officer, can: ['vao', 'ra'], luong: [{ huong: 'vao', ten: 'receipt / handover record', khop: ['receipt|handover|confirm|decision'] }] },
        { ...A.manager, can: ['vao', 'ra'], luong: [{ huong: 'vao', ten: 'thresholds / categories / retention settings', khop: ['threshold|categor|retention|rule|setting|config'] }, { huong: 'ra', ten: 'monthly statistics', khop: ['statistic|report'] }] },
        { ...A.sso, can: ['vao', 'ra'], luong: [{ huong: 'vao', ten: 'identity token / authentication result', khop: ['token|identity|auth|result|profile'] }] },
        { ...A.noti, can: ['ra'] },
        { ...A.charity, can: ['ra'], luong: [{ huong: 'ra', ten: 'donation list', khop: ['donat|list|unclaimed|release'] }] },
        { ...A.police, can: ['ra'], luong: [{ huong: 'ra', ten: 'transfer record', khop: ['transfer|record|high value|list'] }] },
      ],
      cam: [
        { ten: 'AI matching engine', khop: ['\\bai\\b|matching|engine|model|algorithm'], lyDo: 'the AI matching engine is a part of LostLink, inside the circle', lyDoVi: 'bộ máy ghép cặp AI là một phần của LostLink, nằm trong vòng tròn' },
        { ten: 'Database / Locker / Item', khop: ['database|\\bdb\\b|locker|^item|found item|lost report|drawer'], lyDo: 'that is data or a place, not someone exchanging data with the system', lyDoVi: 'đó là dữ liệu hoặc nơi chốn, không phải ai đó trao đổi dữ liệu với hệ thống' },
      ],
      toiThieuLuong: 12,
    },
  },
  q3: {
    giaiUC: GIAI_UC, giaiActors: GIAI_ACTORS, giaiUCs: GIAI_UCS,
    cfg: {
      actors: [A.finder, A.owner, A.officer, A.manager, A.sso, A.noti, A.charity, A.police],
      camActor: [
        { ten: 'AI matching engine', khop: ['\\bai\\b|matching|engine|model'], lyDo: 'the AI engine is inside the system — its work appears as use cases or as transitions of the state machine', lyDoVi: 'bộ máy AI nằm trong hệ thống — việc của nó là use case hoặc chuyển trạng thái' },
        { ten: 'Timer / Scheduler', khop: ['timer|scheduler|cron|clock|time'], lyDo: 'the 24-hour / 7-day / 60-day rules are temporal events inside the system', lyDoVi: 'các luật 24 giờ / 7 ngày / 60 ngày là sự kiện thời gian bên trong hệ thống' },
      ],
      ucs: [
        { ten: 'Sign in through Campus SSO', khop: ['sign in|log ?in|authenticat'], actor: [A.sso] },
        { ten: 'Log a found item', khop: ['found item|log found|report found|register found'], actor: [A.finder] },
        { ten: 'File a lost report', khop: ['lost report|report lost|file lost|lost item'], actor: [A.owner] },
        { ten: 'Confirm / reject a match suggestion', khop: ['match suggest|respond|confirm match|accept match|review suggest|reject match'], actor: [A.owner] },
        { ten: 'Book a pick-up slot', khop: ['pick ?up|book|slot|appointment'], actor: [A.owner] },
        { ten: 'Confirm item receipt at the desk', khop: ['receipt|receive|store|intake'], actor: [A.officer] },
        { ten: 'Review an uncertain (medium-score) match', khop: ['uncertain|review match|manual|review queue|verify match'], actor: [A.officer] },
        { ten: 'Record the handover', khop: ['handover|hand over|return item|release to owner'], actor: [A.officer] },
        { ten: 'Release unclaimed items to the charity partner', khop: ['donat|charity|unclaimed|release'], actor: [A.charity] },
        { ten: 'Transfer high-value items to the campus police', khop: ['police|high value|transfer'], actor: [A.police] },
        { ten: 'Configure matching thresholds / categories / retention', khop: ['config|threshold|categor|retention|rule|setting'], actor: [A.manager] },
        { ten: 'View monthly statistics', khop: ['statistic|report|dashboard'], actor: [A.manager] },
      ],
      quanHe: [
        { loai: 'include', ten: 'Record Handover «include» Verify Owner Identity', tu: ['handover|hand over|return item'], den: ['identity|verify owner|verify claimant'], lyDo: 'the officer ALWAYS verifies identity before every handover', lyDoVi: 'bảo vệ LUÔN kiểm danh tính trước mọi lần bàn giao' },
        { loai: 'extend', ten: 'Attach Item Photos «extend» File Lost Report', tu: ['photo|image|picture'], den: ['lost report|report lost|file lost'], lyDo: 'the owner MAY attach photos if they have any — optional behaviour', lyDoVi: 'chủ đồ CÓ THỂ đính ảnh nếu có — hành vi tuỳ chọn' },
      ],
      toiThieuUC: 12,
    },
  },
  q4: {
    loai: 'state',
    tieuDeHinh: 'State machine — Found Item',
    viTri: { __dau: [60, 150], Logged: [190, 270], InCustody: [420, 270], UnderReview: [420, 80], MatchSuggested: [700, 80], ClaimPending: [700, 270], Returned: [900, 270], Donated: [560, 470], Transferred: [820, 470], Disposed: [230, 470], __cuoi_Returned: [900, 360], __cuoi_Donated: [560, 560], __cuoi_Transferred: [820, 560], __cuoi_Disposed: [230, 560] },
    de: { en: 'draw a <b>State Transition Diagram</b> for a <b>Found Item</b> — the core object the AI monitors — from the moment it is logged until it leaves the platform (returned, donated, transferred or disposed). Include at least six distinct states, the AI-triggered transitions with their guard conditions on the similarity score, the user and officer actions, and the time-based transitions. Describe every state and its business meaning in the state table.', vi: 'vẽ <b>Sơ đồ chuyển trạng thái</b> cho <b>Found Item</b> (đồ nhặt được) — đối tượng cốt lõi được AI theo dõi — từ lúc được ghi nhận tới khi rời nền tảng (trả lại, quyên góp, chuyển công an hoặc huỷ). Phải có ít nhất sáu trạng thái phân biệt, các chuyển do AI kích hoạt kèm guard theo điểm tương đồng, hành động của người dùng và bảo vệ, và các chuyển theo thời gian. Mô tả mọi trạng thái và ý nghĩa nghiệp vụ trong bảng trạng thái.' },
    giai: GIAI_STATE, giaiBang: GIAI_STATES,
    cfg: {
      tenDoiTuong: 'the found item',
      toiThieu: 6,
      guardToiThieu: 4,
      st: [
        { ten: 'In custody / available at the desk', tenVi: 'đang được giữ ở bàn bảo vệ', khop: ['custody|stored|available|received|unclaimed|at desk|in locker'] },
        { ten: 'Match suggested', tenVi: 'đã gợi ý ghép', khop: ['suggest|matched|match found|potential match'] },
        { ten: 'Claim pending (awaiting pick-up)', tenVi: 'chờ nhận', khop: ['claim|pick ?up|awaiting|confirmed'] },
        { ten: 'Returned to owner', tenVi: 'đã trả chủ', khop: ['returned|handed|collected|closed'] },
        { ten: 'Donated', tenVi: 'đã quyên góp', khop: ['donat|released|charity'] },
        { ten: 'Disposed', tenVi: 'đã huỷ', khop: ['dispos|discard|destroy'] },
      ],
      ch: [
        { ten: 'custody → match suggested when the AI score is at least 0.80 (guard)', tenVi: 'đang giữ → gợi ý ghép khi điểm AI ≥ 0.80 (guard)', tu: ['custody|stored|available|received|unclaimed|logged'], den: ['suggest|matched|match found'], guard: true, lyDo: 'the AI transition fires only above the threshold — write [similarity >= 0.80]', lyDoVi: 'chuyển do AI chỉ xảy ra khi vượt ngưỡng — ghi [similarity >= 0.80]' },
        { ten: 'a medium score (0.50–0.80) goes to manual review (guard)', tenVi: 'điểm trung bình (0.50–0.80) chuyển sang xem tay (guard)', tu: ['custody|stored|available|received|unclaimed|logged'], den: ['review|pending review|manual|uncertain'], guard: true, lyDo: 'the grey zone needs its own guard', lyDoVi: 'vùng xám cần guard riêng' },
        { ten: 'match suggested → claim pending when the owner confirms', tenVi: 'gợi ý ghép → chờ nhận khi chủ xác nhận', tu: ['suggest|matched|match found'], den: ['claim|pick ?up|awaiting|confirmed'], suKien: ['confirm|accept|claim'] },
        { ten: 'claim pending → back to custody when 7 days pass without pick-up', tenVi: 'chờ nhận → quay lại đang giữ khi quá 7 ngày không tới nhận', tu: ['claim|pick ?up|awaiting|confirmed'], den: ['custody|stored|available|received|unclaimed'], suKien: ['expir|7|days|no show|timeout|time'] },
        { ten: 'custody → donated after 60 days for ordinary items (guard)', tenVi: 'đang giữ → quyên góp sau 60 ngày với đồ thường (guard)', tu: ['custody|stored|available|received|unclaimed'], den: ['donat|released|charity'], guard: true, lyDo: 'only items unclaimed for 60 days that are NOT high value are donated', lyDoVi: 'chỉ đồ quá 60 ngày và KHÔNG giá trị cao mới quyên góp' },
      ],
    },
  },
  truDiem: [
    { en: 'Drawing the AI matching engine as an actor or an external entity — it is part of LostLink.', vi: 'Vẽ bộ máy ghép cặp AI thành actor hay thực thể ngoài — nó là một phần của LostLink.' },
    { en: 'Forgetting the charity partner and the campus police: they receive data from the system, so they are external entities.', vi: 'Quên đối tác từ thiện và công an: họ nhận dữ liệu từ hệ thống nên là thực thể ngoài.' },
    { en: 'States named as activities ("Matching", "Verifying identity") instead of conditions ("Match Suggested", "Claim Pending").', vi: 'Đặt tên trạng thái bằng hoạt động ("Matching", "Verifying identity") thay vì tình trạng ("Match Suggested", "Claim Pending").' },
    { en: 'AI transitions without guards: two arrows leave In Custody on the same event "AI match found" — only the guard on the score tells them apart.', vi: 'Chuyển do AI không có guard: hai mũi tên rời In Custody cùng sự kiện "AI match found" — chỉ guard theo điểm mới phân biệt được.' },
    { en: 'No way back: a rejected match or an expired claim must return the item to In Custody.', vi: 'Không có đường quay lại: gợi ý bị từ chối hay yêu cầu hết hạn phải đưa món đồ về In Custody.' },
  ],
  goiY: [
    'Người dùng chia hai VAI: Finder và Owner (cùng là sinh viên/cán bộ nhưng mục tiêu khác). Vẽ hai actor, hoặc một actor "Campus Member" — máy chấm chấp nhận cả hai.',
    'Ba hệ thống/tổ chức ngoài ít ai thấy: Charity Partner (nhận danh sách tháng), Campus Police (nhận biên bản), Notification Service. Campus SSO là hệ thống ngoài thứ tư.',
    'Câu 4: liệt kê mọi câu "khi … thì món đồ …" trong đề: ≥0.80 ⇒ gợi ý; 0.50–0.80 ⇒ chờ xem tay; xác nhận ⇒ chờ nhận; 7 ngày ⇒ quay lại; 60 ngày ⇒ quyên góp HOẶC chuyển công an (guard giá trị cao); 24 giờ ⇒ huỷ (guard đồ dễ hỏng).',
  ],
  loiHayGap: [
    '«include» cho "attach photos" — đề nói "may attach photos if they have any" ⇒ tuỳ chọn ⇒ «extend», mũi tên từ Attach Item Photos tới File Lost Report.',
    'Ba luật 24 giờ / 7 ngày / 60 ngày vẽ thành actor "Timer" — đó là sự kiện thời gian bên trong hệ thống.',
    'Thiếu trạng thái kết thúc, hoặc trạng thái Disposed/Donated không có lối ra [*].',
    'Hai trạng thái "Matched" và "Match Suggested" trùng nghĩa — một tình trạng một tên.',
  ],
  giaiThich: {
    en: '<p><b>How to read the paper.</b> Eight parties exchange data with LostLink: the two roles of a campus member (finder, owner), the security officer, the manager, and four external systems/organisations (Campus SSO, the notification service, the charity partner, the campus police). The AI matching engine and the timers are inside. For the state machine, every sentence of the form "when …, the item …" is a transition; the AI decides between two targets on the SAME event, so the similarity score must appear as guards; the 60-day rule splits on "high value", which is a second pair of guarded transitions.</p>',
    vi: '<p><b>Cách đọc đề.</b> Tám bên trao đổi dữ liệu với LostLink: hai vai của thành viên trường (finder, owner), bảo vệ, quản lý, và bốn hệ thống/tổ chức ngoài (Campus SSO, dịch vụ thông báo, đối tác từ thiện, công an). Bộ máy AI và các bộ đếm giờ nằm bên trong. Với máy trạng thái, mọi câu dạng "khi …, món đồ …" là một chuyển trạng thái; AI chọn giữa hai đích trên CÙNG một sự kiện nên điểm tương đồng phải nằm trong guard; luật 60 ngày rẽ theo "giá trị cao" — thêm một cặp chuyển có guard nữa.</p>',
  },
  boYeu: [
    { ten: 'AI engine là actor + extend/include đảo', tep: { 'answers/q3-usecases.js': `const USE_CASE_DIAGRAM = \`${GIAI_UC.replace('UC4 ..> UC3 : <<extend>>', 'UC3 ..> UC4 : <<include>>').replace('actor Finder', 'actor Finder\nactor "AI Matching Engine" as AI\nAI --> UC8')}\`;\nconst ACTORS = ${jsLit(GIAI_ACTORS)};\nconst USE_CASES = ${jsLit(GIAI_UCS)};\n` }, phaiTruot: ['no internal component modelled as an actor', 'Attach Item Photos «extend»'] },
    { ten: 'state đặt tên hoạt động, không guard, không lối quay lại', tep: { 'answers/q4-state.js': `const STATE_DIAGRAM = \`
stateDiagram-v2
  [*] --> Logged
  Logged --> Matching : officer confirms
  Matching --> MatchSuggested : AI match found
  Matching --> Reviewing : AI match found
  MatchSuggested --> ClaimPending : owner confirms
  ClaimPending --> Returned : handover
  Matching --> Donated : 60 days
  Returned --> [*]
  Donated --> [*]
  Reviewing --> MatchSuggested : approve
\`;
const STATES = [];
` }, phaiTruot: ['states are conditions', 'at least 4 guarded transitions', 'claim pending → back to custody'] },
  ],
});
