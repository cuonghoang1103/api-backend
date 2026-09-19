/**
 * SWR302 · Assignment (20%) — slide walkthroughs.
 *
 * Ten decks (A.1…A.10, nine slides each) rendered by
 * `scripts/slides-src/swr302-asg{1..10}.mjs` and published under
 * `images/academy/SWR302/v1/asg{N}/`.
 *
 * Exported as a slug → HTML map, prepended to each Assignment lesson by
 * `assignment.mjs`, so the visual walkthrough opens the lesson and the existing
 * long-form reference text follows underneath.
 */
import { registerDeck, walk, bi } from './_slides.mjs';

const W = 1280, H = 720;
registerDeck('asg1',  { code: 'A.1',  en: 'The brief',            vi: 'Đề bài',                total: 9, w: W, h: H });
registerDeck('asg2',  { code: 'A.2',  en: 'Topic TP1 — CARS',     vi: 'Đề TP1 — CARS',         total: 9, w: W, h: H });
registerDeck('asg3',  { code: 'A.3',  en: 'Topic TP2 — OMFS',     vi: 'Đề TP2 — OMFS',         total: 9, w: W, h: H });
registerDeck('asg4',  { code: 'A.4',  en: 'Team of five',         vi: 'Phân công 5 người',     total: 9, w: W, h: H });
registerDeck('asg5',  { code: 'A.5',  en: 'Week 2 → week 9',      vi: 'Kế hoạch tuần 2→9',     total: 9, w: W, h: H });
registerDeck('asg6',  { code: 'A.6',  en: 'Deliverables 1–2',     vi: 'Tài liệu 1–2',          total: 9, w: W, h: H });
registerDeck('asg7',  { code: 'A.7',  en: 'Deliverables 3–5',     vi: 'Tài liệu 3–5',          total: 9, w: W, h: H });
registerDeck('asg8',  { code: 'A.8',  en: 'Deliverables 6–8',     vi: 'Tài liệu 6–8',          total: 9, w: W, h: H });
registerDeck('asg9',  { code: 'A.9',  en: 'The worked example',   vi: 'Bài mẫu hoàn chỉnh',    total: 9, w: W, h: H });
registerDeck('asg10', { code: 'A.10', en: 'Presentation & check', vi: 'Thuyết trình & tự kiểm', total: 9, w: W, h: H });

const head = (en, vi) => bi(
  `<h2>📖 Slide by slide</h2><p>${en} The full written reference follows underneath this walkthrough.</p>`,
  `<h2>📖 Học theo từng slide</h2><p>${vi} Phần tham khảo đầy đủ bằng chữ nằm ngay dưới loạt slide này.</p>`,
);

/* ─────────── A.1 ─────────── */
const asg1 = [
  head('Nine slides covering what the assignment is, what it is graded on, and what to do this week.',
       'Chín slide nói assignment là gì, chấm cái gì, và tuần này phải làm gì.'),
  walk('asg1', [
    [1, 'Assignment nhóm — 20%',
      `<p>Five people, eight deliverables, eight weeks. The topic arrives at the start of week 2 and the presentation is week 9.</p>`,
      `<p>Năm người, tám tài liệu, tám tuần. Đề về đầu tuần 2, thuyết trình tuần 9.</p>`],
    [2, 'Tám tài liệu phải nộp',
      `<p>Each deliverable maps to one chapter of Wiegers &amp; Beatty, and to one template the lecturer distributes. Use the template — a document in your own layout costs marks for no reason.</p>`,
      `<p>Mỗi tài liệu ứng với một chương của Wiegers &amp; Beatty và một template thầy phát. Hãy dùng template — tài liệu tự bày bố cục riêng mất điểm mà không được gì.</p>`],
    [3, 'Tám tài liệu KHÔNG phải tám bài rời',
      `<p>The chain is the reason the naive division of labour fails. Change the scope in deliverable 1 in week 6 and seven documents need editing.</p><p>It is also why the schedule in A.5 puts a week of slack between each link.</p>`,
      `<p>Chuỗi phụ thuộc này là lý do cách chia việc ngây thơ thất bại. Đổi phạm vi ở tài liệu 1 vào tuần 6 là bảy tài liệu phải sửa theo.</p><p>Nó cũng là lý do kế hoạch ở bài A.5 chừa một tuần dư giữa mỗi mắt xích.</p>`],
    [4, 'Hai đề tài, chọn MỘT',
      `<p>Both topics carry enough depth for all eight deliverables. Pick by which domain your team understands, not by which looks easier — they are deliberately balanced.</p>`,
      `<p>Cả hai đề đều đủ chiều sâu cho tám tài liệu. Chọn theo lĩnh vực nhóm bạn hiểu, đừng chọn theo cái trông dễ hơn — hai đề được cân bằng có chủ ý.</p>`],
    [5, 'Tuần 2 → tuần 9',
      `<p>The milestone for each week is one concrete artifact, not "continue working". A week whose deliverable cannot be named is a week that will slip.</p>`,
      `<p>Mốc của mỗi tuần là một sản phẩm cụ thể, không phải "tiếp tục làm". Tuần nào không gọi tên được sản phẩm là tuần sẽ trễ.</p>`],
    [6, 'Thầy gọi kiểm tra BẤT CHỢT',
      `<p>The check-in is not a progress report — it is a test of whether the person speaking understands the work. That is a different thing to prepare for, and A.5 has the question bank.</p>`,
      `<p>Buổi kiểm tra không phải báo cáo tiến độ — nó kiểm xem người đang nói có hiểu việc không. Đó là thứ phải chuẩn bị theo cách khác, và ngân hàng câu hỏi nằm ở bài A.5.</p>`],
    [7, 'Ba thứ làm rớt điểm cả nhóm',
      `<p>All three are checkable before you submit, and two of them are checkable by a script. The self-check table in A.10 is the list.</p>`,
      `<p>Cả ba đều kiểm được trước khi nộp, và hai trong ba kiểm được bằng script. Bảng tự kiểm ở bài A.10 chính là danh sách đó.</p>`],
    [8, 'Điểm 20% này chấm cái gì',
      `<p>Consistency carries the most weight and is the cheapest to earn — it costs one hour of cross-reading, not one more document.</p>`,
      `<p>Tính nhất quán chiếm trọng số lớn nhất và là thứ rẻ nhất để đạt — nó tốn một giờ đọc chéo, không tốn thêm một tài liệu nào.</p>`],
    [9, 'Tuần này làm gì',
      `<p>Four concrete actions. If your team does only these four this week, week 3 starts from a real position instead of from a conversation about what to do.</p>`,
      `<p>Bốn việc cụ thể. Nếu tuần này nhóm bạn chỉ làm bốn việc đó, tuần 3 bắt đầu từ một vị trí thật thay vì từ một cuộc bàn xem nên làm gì.</p>`],
  ]),
].join('\n');

/* ─────────── A.2 ─────────── */
const asg2 = [
  head('Nine slides on topic TP1 — the context, the four numbers that drive every goal, the scope boundary and the trap.',
       'Chín slide về đề TP1 — bối cảnh, bốn con số chi phối mọi mục tiêu, ranh giới phạm vi và cái bẫy.'),
  walk('asg2', [
    [1, 'TP1 — Học vụ &amp; Đăng ký môn',
      `<p>A replacement project: a 14-year-old registration system serving 12,000 students. "Replacement" changes what you must model — see slide 2.</p>`,
      `<p>Một dự án thay thế: hệ đăng ký 14 năm tuổi phục vụ 12.000 sinh viên. Chữ "thay thế" đổi thứ bạn buộc phải mô hình hoá — xem slide 2.</p>`],
    [2, 'Bối cảnh',
      `<p>Because it is a replacement, you must model the <em>current</em> process as well as the future one. The gap between the two swimlanes is your business case (LAB L.3).</p>`,
      `<p>Vì là thay thế, bạn phải mô hình hoá cả quy trình <em>hiện tại</em> lẫn quy trình tương lai. Khoảng cách giữa hai swimlane chính là bài toán kinh doanh (LAB L.3).</p>`],
    [3, 'Bốn con số là cả bài toán',
      `<p>Every business goal in your Vision &amp; Scope must anchor to one of these four. A goal with no number behind it is a goal you invented.</p>`,
      `<p>Mọi mục tiêu kinh doanh trong Vision &amp; Scope phải neo vào một trong bốn con số này. Mục tiêu không có số phía sau là mục tiêu bạn tự nghĩ ra.</p>`],
    [4, 'Trong phạm vi / Ngoài phạm vi',
      `<p>The out-of-scope list must match the rectangles outside the circle in your context diagram — that is the first pair of documents a grader cross-reads.</p>`,
      `<p>Danh sách ngoài phạm vi phải khớp các hình chữ nhật ngoài vòng tròn trong context diagram — đó là cặp tài liệu đầu tiên người chấm đọc chéo.</p>`],
    [5, 'Bên liên quan',
      `<p>These six roles reappear as the Actor column of your use case table. A name spelled differently in the two documents is a consistency deduction.</p>`,
      `<p>Sáu vai này xuất hiện lại thành cột Actor của bảng use case. Một cái tên viết khác nhau giữa hai tài liệu là một lần trừ điểm nhất quán.</p>`],
    [6, '14 use case — bộ khung',
      `<p>Seven of the fourteen are shown. The complete table with main and exception flows is in the TP1 worked package, deliverable 2.</p>`,
      `<p>Bảy trên mười bốn use case được hiện ra. Bảng đầy đủ kèm luồng chính và luồng ngoại lệ nằm ở bộ tài liệu mẫu TP1, tài liệu 2.</p>`],
    [7, 'Chỗ khó nhất của TP1',
      `<p>Three independent rules firing on one button press. Three conditions is eight combinations — write them as a decision table, not as prose (LAB L.6).</p>`,
      `<p>Ba luật độc lập cùng nổ khi bấm một nút. Ba điều kiện là tám tổ hợp — viết thành bảng quyết định, đừng viết văn xuôi (LAB L.6).</p>`],
    [8, 'Cái bẫy phạm vi của TP1',
      `<p>The boundary is set by who <em>writes</em> the data, not who reads it. Reading another system's data never pulls that system into scope.</p>`,
      `<p>Ranh giới được đặt bởi ai <em>ghi</em> dữ liệu, không phải ai đọc. Đọc dữ liệu của hệ khác không bao giờ kéo hệ đó vào phạm vi.</p>`],
    [9, 'Bảng tự kiểm TP1',
      `<p>Run this table before your week-8 packaging, not on submission day — two of the five rows need editing across several documents when they fail.</p>`,
      `<p>Chạy bảng này trước lúc đóng gói tuần 8, đừng để tới ngày nộp — hai trong năm dòng khi hỏng thì phải sửa ở nhiều tài liệu cùng lúc.</p>`],
  ]),
].join('\n');

/* ─────────── A.3 ─────────── */
const asg3 = [
  head('Nine slides on topic TP2 — the context, the one number the whole topic turns on, the scope boundary and the hidden integration.',
       'Chín slide về đề TP2 — bối cảnh, con số mà cả đề xoay quanh, ranh giới phạm vi và mắt xích tích hợp ẩn.'),
  walk('asg3', [
    [1, 'TP2 — Quản lý đơn hàng TMĐT',
      `<p>A greenfield build across several sales channels, three warehouses and multiple carriers.</p>`,
      `<p>Một dự án xây mới, trải qua nhiều kênh bán, ba kho và nhiều hãng vận chuyển.</p>`],
    [2, 'Bối cảnh',
      `<p>Greenfield does not excuse you from modelling the current state: "printed by hand and sorted manually" is a state, and it is where your value argument comes from.</p>`,
      `<p>Xây mới không miễn cho bạn việc mô hình hoá hiện trạng: "in tay rồi chia thủ công" vẫn là một trạng thái, và lý lẽ về giá trị của bạn ra từ đó.</p>`],
    [3, 'Vấn đề trung tâm: MỘT con số tồn kho',
      `<p>Sellable quantity is a computed value, so its dictionary entry needs a formula, not a description. Get this wrong and all eight documents are wrong with it.</p>`,
      `<p>Sellable quantity là giá trị tính ra, nên mục từ điển của nó cần một công thức chứ không phải một lời mô tả. Sai chỗ này là cả tám tài liệu sai theo.</p>`],
    [4, 'Trong phạm vi / Ngoài phạm vi',
      `<p>The brief saying the storefront "effectively handles customer browsing" is the lecturer telling you not to specify it. Specifying it anyway is the commonest TP2 error.</p>`,
      `<p>Câu đề nói storefront "xử lý tốt việc khách duyệt hàng" là thầy đang bảo bạn đừng đặc tả nó. Vẫn đặc tả là lỗi phổ biến nhất của TP2.</p>`],
    [5, 'Bên liên quan',
      `<p>Six human roles plus four external systems gives exactly the ten entities your context diagram needs (LAB L.2).</p>`,
      `<p>Sáu vai người cộng bốn hệ thống ngoài cho ra đúng mười thực thể mà context diagram của bạn cần (LAB L.2).</p>`],
    [6, '14 use case — bộ khung',
      `<p>Note that several use cases have the system itself as primary actor — a scheduled or event-driven use case is legitimate and TP2 needs three of them.</p>`,
      `<p>Chú ý vài use case có actor chính là chính hệ thống — một use case chạy theo lịch hoặc theo sự kiện là hợp lệ, và TP2 cần ba cái như vậy.</p>`],
    [7, 'Chỗ khó nhất của TP2',
      `<p>Order splitting is the consequence most teams miss: one order can become several shipments, and that has to be in the ERD from the start, not patched in at week 7.</p>`,
      `<p>Chia đơn là hệ quả mà hầu hết các nhóm bỏ sót: một đơn có thể thành nhiều lô giao, và điều đó phải nằm trong ERD ngay từ đầu, không phải vá vào tuần 7.</p>`],
    [8, 'Cái bẫy đồng bộ của TP2',
      `<p>A context diagram cannot show this link, because it only draws flows touching your system. This is exactly the case where an ecosystem map earns its keep.</p>`,
      `<p>Context diagram không thể hiện được mắt xích này, vì nó chỉ vẽ luồng chạm vào hệ thống của bạn. Đây đúng là trường hợp ecosystem map tỏ ra đáng giá.</p>`],
    [9, 'Bảng tự kiểm TP2',
      `<p>The first row is the one that fails most often, and it fails silently: a dictionary entry that describes sellable quantity instead of defining it.</p>`,
      `<p>Dòng đầu tiên là dòng hỏng nhiều nhất, và nó hỏng âm thầm: một mục từ điển mô tả sellable quantity thay vì định nghĩa nó.</p>`],
  ]),
].join('\n');

/* ─────────── A.4 ─────────── */
const asg4 = [
  head('Nine slides on dividing the work five ways, the RACI table, the weekly rhythm and what to do when somebody stops contributing.',
       'Chín slide về chia việc cho năm người, bảng RACI, nhịp làm việc mỗi tuần và cách xử lý khi có người ngừng đóng góp.'),
  walk('asg4', [
    [1, 'Năm người, tám tài liệu',
      `<p>The division of labour is graded indirectly: it decides whether the person the lecturer calls on can answer.</p>`,
      `<p>Cách chia việc được chấm gián tiếp: nó quyết định người bị thầy gọi có trả lời được không.</p>`],
    [2, 'Cách chia SAI mà nhóm nào cũng thử',
      `<p>One document per person fails on the dependency chain from A.1 slide 3 — half the team is blocked for three weeks, then everyone is blocked at once.</p>`,
      `<p>Mỗi người một tài liệu thất bại vì chuỗi phụ thuộc ở A.1 slide 3 — nửa nhóm bị chặn suốt ba tuần, rồi cả nhóm cùng bị chặn một lúc.</p>`],
    [3, 'Chia theo VAI, không theo tài liệu',
      `<p>Roles cut across documents, so everybody has work every week and nobody owns a document alone.</p>`,
      `<p>Vai trò cắt ngang các tài liệu, nên ai cũng có việc mỗi tuần và không ai sở hữu một tài liệu một mình.</p>`],
    [4, 'Bảng RACI',
      `<p>Copy this table into your shared document in week 2 and put real names in the header. One A per row, and the A is who answers for it when the lecturer asks.</p>`,
      `<p>Chép bảng này vào tài liệu chung từ tuần 2 và điền tên thật vào hàng tiêu đề. Mỗi dòng một chữ A, và chữ A là người chịu trách nhiệm trả lời khi thầy hỏi.</p>`],
    [5, 'Luật "mỗi người chạm vào SRS"',
      `<p>Four R's on the SRS row is the single most important design decision in this whole page — it is what makes an unannounced check-in survivable.</p>`,
      `<p>Bốn chữ R trên dòng SRS là quyết định quan trọng nhất của cả trang này — chính nó làm cho một lần bị gọi bất chợt trở nên sống sót được.</p>`],
    [6, 'Nhịp làm việc mỗi tuần',
      `<p>The Saturday cross-read is the step teams drop first and the step that catches inconsistency — the highest-weight item on the rubric.</p>`,
      `<p>Buổi đọc chéo thứ 7 là bước các nhóm bỏ đầu tiên và là bước bắt được lỗi lệch — mục có trọng số cao nhất trên thang chấm.</p>`],
    [7, 'Nhật ký đóng góp',
      `<p>Three columns, updated weekly, submitted with the work. It is evidence, and evidence only exists if it was written down at the time.</p>`,
      `<p>Ba cột, cập nhật mỗi tuần, nộp kèm bài. Nó là bằng chứng, và bằng chứng chỉ tồn tại nếu được ghi lại ngay lúc đó.</p>`],
    [8, 'Khi có người không làm',
      `<p>Escalate on a schedule, in writing, early. Carrying somebody quietly until week 9 leaves you with no evidence and the largest loss.</p>`,
      `<p>Leo thang theo lịch, bằng văn bản, từ sớm. Lặng lẽ gánh cho ai đó tới tuần 9 thì bạn không còn bằng chứng nào và là người mất nhiều nhất.</p>`],
    [9, 'Việc của nhóm trưởng thật ra là gì',
      `<p>Not writing the most. Being the only person who reads all eight documents — and therefore the only person who can see where they contradict each other.</p>`,
      `<p>Không phải viết nhiều nhất. Là người duy nhất đọc hết cả tám tài liệu — và vì thế là người duy nhất thấy chỗ chúng mâu thuẫn nhau.</p>`],
  ]),
].join('\n');

/* ─────────── A.5 ─────────── */
const asg5 = [
  head('Nine slides on the eight-week schedule, what is due each week, and how to survive the unannounced check-ins.',
       'Chín slide về lịch tám tuần, mỗi tuần phải giao gì, và cách sống sót qua các lần bị gọi kiểm tra bất chợt.'),
  walk('asg5', [
    [1, 'Tuần 2 → tuần 9',
      `<p>Eight weeks, eight deliverables, and a check-in that can land on any of them.</p>`,
      `<p>Tám tuần, tám tài liệu, và một lần kiểm tra có thể rơi vào bất kỳ tuần nào.</p>`],
    [2, 'Nguyên tắc xếp lịch',
      `<p>Schedule backwards from week 9 and leave a week of slack per dependency. The chain is four weeks long, which is why week 2 is already tight.</p>`,
      `<p>Xếp ngược từ tuần 9 và chừa một tuần dư cho mỗi mắt xích phụ thuộc. Chuỗi dài bốn tuần, nên tuần 2 đã là chặt rồi.</p>`],
    [3, 'Tuần 2–3 · Nền móng',
      `<p>The context diagram is drawable in week 2 because it needs only the scope boundary. Drawing it early forces the scope argument to happen early too.</p>`,
      `<p>Context diagram vẽ được từ tuần 2 vì nó chỉ cần ranh giới phạm vi. Vẽ sớm buộc cuộc tranh cãi về phạm vi cũng xảy ra sớm.</p>`],
    [4, 'Tuần 4–5 · Phần thịt',
      `<p>Week 4 is where schedules break: exception flows cost about twice what the happy path costs, and teams budget for one.</p>`,
      `<p>Tuần 4 là chỗ lịch vỡ: luồng ngoại lệ tốn gấp đôi luồng vui vẻ, mà các nhóm thường chỉ tính cho một cái.</p>`],
    [5, 'Tuần 6–7 · Chất lượng &amp; hình ảnh',
      `<p>"The list of inconsistencies found during cross-review" is a deliverable in its own right — it is the evidence that the review happened.</p>`,
      `<p>"Danh sách lỗi lệch tìm được khi rà chéo" tự nó là một sản phẩm — nó là bằng chứng buổi rà soát đã thật sự diễn ra.</p>`],
    [6, 'Tuần 8–9 · Đóng gói',
      `<p>Week 8 is not for writing new content. A team still writing use cases in week 8 had a plan that broke in week 4.</p>`,
      `<p>Tuần 8 không dành để viết nội dung mới. Nhóm nào tuần 8 còn viết use case thì kế hoạch đã vỡ từ tuần 4.</p>`],
    [7, 'Lần gọi kiểm tra trông như thế nào',
      `<p>The third layer — "where did this number come from" — is where people fail, and it is the only layer you cannot bluff.</p>`,
      `<p>Lớp thứ ba — "con số này ở đâu ra" — là chỗ người ta trượt, và là lớp duy nhất không thể nói vòng vo.</p>`],
    [8, 'Ngân hàng câu hỏi — trích',
      `<p>Five of the forty. The full bank, with model answers, is in the written section below this walkthrough.</p>`,
      `<p>Năm trên bốn mươi câu. Ngân hàng đầy đủ kèm câu trả lời mẫu nằm ở phần chữ ngay dưới loạt slide này.</p>`],
    [9, 'Chuẩn bị cho lần bị gọi',
      `<p>Twenty minutes a week. It is the highest-return preparation in the whole assignment because it protects marks the documents alone cannot earn.</p>`,
      `<p>Hai mươi phút mỗi tuần. Đây là phần chuẩn bị có tỉ suất cao nhất của cả bài vì nó giữ phần điểm mà riêng tài liệu không kiếm được.</p>`],
  ]),
].join('\n');

/* ─────────── A.6 ─────────── */
const asg6 = [
  head('Nine slides on the first two deliverables — Vision &amp; Scope and Use Cases — and the two places they lose marks.',
       'Chín slide về hai tài liệu đầu — Vision &amp; Scope và Use Cases — cùng hai chỗ chúng hay mất điểm.'),
  walk('asg6', [
    [1, 'Vision &amp; Scope · Use Cases',
      `<p>Wiegers chapters 5 and 8. Everything in the other six deliverables flows out of these two.</p>`,
      `<p>Chương 5 và 8 của Wiegers. Mọi thứ trong sáu tài liệu còn lại đều chảy ra từ hai cái này.</p>`],
    [2, 'Vision &amp; Scope — khuôn 5 phần',
      `<p>Use the template section numbering exactly. A grader looking for section 3 should find section 3, not have to hunt for your equivalent of it.</p>`,
      `<p>Dùng đúng cách đánh số mục của template. Người chấm tìm mục 3 thì phải thấy mục 3, không phải đi lùng xem mục tương đương của bạn nằm đâu.</p>`],
    [3, 'Mục tiêu kinh doanh phải ĐO ĐƯỢC',
      `<p>Metric, baseline, target, deadline. Missing the baseline is the commonest version of this mistake — without it nobody can tell whether the target is ambitious or trivial.</p>`,
      `<p>Chỉ số, mốc hiện tại, mốc đích, thời hạn. Thiếu mốc hiện tại là biến thể phổ biến nhất của lỗi này — không có nó thì không ai biết mốc đích là tham vọng hay tầm thường.</p>`],
    [4, 'Mục "KHÔNG làm" quan trọng ngang mục "làm"',
      `<p>Name things specifically. "Other features" is not an exclusion, it is a blank — and blanks are where scope creep enters in week 6.</p>`,
      `<p>Gọi tên cụ thể. "Các chức năng khác" không phải một loại trừ, nó là một chỗ trống — và chỗ trống là nơi phạm vi phình ra vào tuần 6.</p>`],
    [5, 'Use case — khuôn đầy đủ',
      `<p>Preconditions must be checkable. "The student is ready to register" is a wish; "the student has an active enrolment record for the current term" is a precondition.</p>`,
      `<p>Tiền điều kiện phải kiểm được. "Sinh viên sẵn sàng đăng ký" là một mong muốn; "sinh viên có bản ghi nhập học đang hiệu lực cho kỳ hiện tại" mới là tiền điều kiện.</p>`],
    [6, 'Luồng ngoại lệ là chỗ phân loại nhóm',
      `<p>Four questions per step. Answer them for the two named cases at the bottom of the slide and you have already outperformed most submissions.</p>`,
      `<p>Bốn câu hỏi cho mỗi bước. Trả lời chúng cho hai trường hợp nêu ở cuối slide là bạn đã hơn phần lớn bài nộp.</p>`],
    [7, 'Đặt tên use case',
      `<p>The test at the bottom is mechanical: can the actor achieve something and walk away? If not, you have named a step.</p>`,
      `<p>Phép thử ở cuối slide là máy móc: actor có đạt được gì đó rồi đi được không? Không thì bạn đang đặt tên cho một bước.</p>`],
    [8, 'Bao nhiêu use case là đủ?',
      `<p>Twelve to sixteen for these topics. The two columns give you symptoms rather than a rule, because the right number depends on how you drew the boundary.</p>`,
      `<p>Mười hai tới mười sáu cho hai đề này. Hai cột cho bạn triệu chứng chứ không cho một luật, vì con số đúng phụ thuộc vào cách bạn vạch ranh giới.</p>`],
    [9, 'Trước khi chuyển sang tài liệu 3',
      `<p>Four cross-checks, all between documents rather than inside one. That is deliberate — inconsistency is what costs the most.</p>`,
      `<p>Bốn phép kiểm chéo, đều nằm giữa các tài liệu chứ không nằm trong một tài liệu. Đó là có chủ ý — lỗi lệch mới là thứ mất điểm nhiều nhất.</p>`],
  ]),
].join('\n');

/* ─────────── A.7 ─────────── */
const asg7 = [
  head('Nine slides on business rules, the SRS and the data dictionary — the three documents that keep the package coherent.',
       'Chín slide về business rules, SRS và từ điển dữ liệu — ba tài liệu giữ cho cả bộ ăn khớp.'),
  walk('asg7', [
    [1, 'Business Rules · SRS · Data Dictionary',
      `<p>Wiegers chapters 9, 10 and 13. The SRS is the centre; the other two are what stop it drifting.</p>`,
      `<p>Chương 9, 10 và 13 của Wiegers. SRS là trung tâm; hai cái kia là thứ giữ nó khỏi trôi dạt.</p>`],
    [2, 'Business rule ≠ requirement',
      `<p>The test is at the bottom: remove all software — is the sentence still true? Teams that skip this test end up with rules written as requirements and no BR document worth grading.</p>`,
      `<p>Phép thử nằm ở cuối: bỏ hết phần mềm đi — câu đó còn đúng không? Nhóm nào bỏ qua phép thử này sẽ viết luật thành yêu cầu, và tài liệu BR không còn gì để chấm.</p>`],
    [3, 'Năm loại business rule',
      `<p>Classify each rule, because the class determines what kind of requirement it produces: a constraint produces a check, a computation produces a formula in the dictionary.</p>`,
      `<p>Phân loại từng luật, vì loại quyết định nó sinh ra kiểu yêu cầu nào: constraint sinh ra một phép kiểm, computation sinh ra một công thức trong từ điển.</p>`],
    [4, 'SRS — tài liệu trung tâm',
      `<p>Sections 3 and 5 carry the weight. Section 5 is the one students under-write, and it is where Planguage belongs.</p>`,
      `<p>Mục 3 và mục 5 mang trọng số. Mục 5 là chỗ sinh viên viết non nhất, và là nơi Planguage thuộc về.</p>`],
    [5, 'Viết một yêu cầu chức năng',
      `<p>Four properties: an ID, "shall", something measurable, and a link back to a rule or use case. A requirement missing the fourth is one you invented.</p>`,
      `<p>Bốn tính chất: có mã, dùng "phải", có thứ đo được, và có liên kết ngược về một luật hoặc use case. Yêu cầu thiếu tính chất thứ tư là yêu cầu bạn tự nghĩ ra.</p>`],
    [6, 'Planguage cho yêu cầu chất lượng',
      `<p>SCALE and METER are the two lines that turn an adjective into a test. MUST/PLAN/WISH then say what failure, success and delight look like.</p>`,
      `<p>SCALE và METER là hai dòng biến một tính từ thành một phép kiểm. MUST/PLAN/WISH sau đó nói thất bại, thành công và tuyệt vời trông như thế nào.</p>`],
    [7, 'Từ điển dữ liệu — một tên, một nghĩa',
      `<p>The Constraint column does the work: a regex, a range, or a formula. An entry with only a prose description has not defined anything.</p>`,
      `<p>Cột ràng buộc mới là phần làm việc: một regex, một khoảng, hoặc một công thức. Mục chỉ có lời mô tả là chưa định nghĩa gì cả.</p>`],
    [8, 'Từ điển bắt lỗi thật như thế nào',
      `<p>These three defects came out of building the worked packages in this course — found by a cross-check script, not by reading. None of them was visible to the eye.</p>`,
      `<p>Ba lỗi này ra từ chính quá trình dựng bộ tài liệu mẫu của khoá — tìm bằng script đối chiếu chéo, không phải bằng đọc. Không lỗi nào nhìn bằng mắt mà thấy.</p>`],
    [9, 'Ma trận truy vết',
      `<p>Keep it in a separate file so it is easy to open during a check-in. It is the artifact lecturers ask to see most often.</p>`,
      `<p>Giữ nó thành file riêng để mở nhanh khi bị gọi kiểm tra. Đây là tài liệu thầy hay xin xem nhất.</p>`],
  ]),
].join('\n');

/* ─────────── A.8 ─────────── */
const asg8 = [
  head('Nine slides on mockups, prioritization and estimation — the three deliverables that turn analysis into a decision.',
       'Chín slide về mockup, ưu tiên và ước lượng — ba tài liệu biến phần phân tích thành một quyết định.'),
  walk('asg8', [
    [1, 'Mockup · Ưu tiên · Ước lượng',
      `<p>Wiegers chapters 15, 16 and 19. These three are where the package stops describing and starts recommending.</p>`,
      `<p>Chương 15, 16 và 19 của Wiegers. Ba cái này là chỗ bộ tài liệu thôi mô tả và bắt đầu đề xuất.</p>`],
    [2, 'Mockup để HỎI, không phải để đẹp',
      `<p>Deliberately rough. A polished mockup makes reviewers discuss colours; a rough one makes them discuss rules — which is what you needed from them.</p>`,
      `<p>Cố ý vẽ thô. Mockup bóng bẩy làm người xem bàn về màu sắc; mockup thô làm họ bàn về luật — đúng thứ bạn cần ở họ.</p>`],
    [3, 'Vẽ màn hình nào',
      `<p>Three to six. Drawing all fourteen is a sign the team is filling pages rather than asking questions.</p>`,
      `<p>Ba tới sáu cái. Vẽ đủ mười bốn là dấu hiệu nhóm đang lấp trang chứ không đang đặt câu hỏi.</p>`],
    [4, 'Ưu tiên phải có SỐ',
      `<p>The formula divides value by weighted cost and risk. Look at FE-4: the highest value in the table, ranked ninth. That inversion is the output you are after.</p>`,
      `<p>Công thức chia giá trị cho chi phí và rủi ro đã có trọng số. Nhìn FE-4: giá trị cao nhất bảng, xếp hạng chín. Chính sự đảo ngược đó là kết quả bạn cần.</p>`],
    [5, 'Phần đáng viết nhất của tài liệu 7',
      `<p>The paragraph, not the table. Anybody can fill a spreadsheet; explaining what it changed about your plan is what shows you used the method.</p>`,
      `<p>Đoạn văn, không phải cái bảng. Ai cũng điền được bảng tính; giải thích nó đã đổi kế hoạch của bạn ra sao mới cho thấy bạn thật sự dùng phương pháp.</p>`],
    [6, 'Ước lượng — làm BA cách',
      `<p>Three methods, three numbers. Reporting one number means you either did one method or hid the disagreement.</p>`,
      `<p>Ba phương pháp, ba con số. Báo một con số nghĩa là bạn hoặc chỉ làm một cách, hoặc đã giấu chỗ chúng không đồng ý với nhau.</p>`],
    [7, 'Ba con số lệch nhau nói điều gì',
      `<p>These are the real figures from the two worked packages. The most detailed method gives the lowest number — because adding up tasks only adds up the tasks you thought of.</p>`,
      `<p>Đây là số thật từ hai bộ tài liệu mẫu. Cách chi tiết nhất cho con số thấp nhất — vì cộng từng việc thì chỉ cộng được những việc bạn nghĩ ra.</p>`],
    [8, 'Luôn ghi khoảng, đừng ghi một số',
      `<p>A single number is a promise. A range with stated assumptions is an estimate, and this subject grades the second one.</p>`,
      `<p>Một con số duy nhất là một lời hứa. Một khoảng kèm giả định được nêu rõ là một ước lượng, và môn này chấm cái thứ hai.</p>`],
    [9, 'Trước khi đóng gói',
      `<p>Four final cross-checks. The last one — no empty cells in the traceability matrix — is the cheapest mark in the assignment.</p>`,
      `<p>Bốn phép kiểm chéo cuối. Cái cuối cùng — ma trận truy vết không còn ô trống — là điểm rẻ nhất của cả bài.</p>`],
  ]),
].join('\n');

/* ─────────── A.9 ─────────── */
const asg9 = [
  head('Nine slides on the two complete worked packages that ship with this course — what is in them, how to use them without copying, and how to measure your own work against them.',
       'Chín slide về hai bộ tài liệu mẫu hoàn chỉnh đi kèm khoá này — trong đó có gì, dùng sao cho khỏi thành chép, và tự đo bài mình theo chúng thế nào.'),
  walk('asg9', [
    [1, 'Bài mẫu — đích đến trông thế nào',
      `<p>Two complete packages, one per topic, written to the same standard the assignment asks for.</p>`,
      `<p>Hai bộ tài liệu hoàn chỉnh, mỗi đề một bộ, viết theo đúng chuẩn mà assignment đòi hỏi.</p>`],
    [2, 'Có gì trong bộ mẫu',
      `<p>Use the functional requirement counts as a calibration: about 6–9 requirements per use case is the density this subject expects.</p>`,
      `<p>Dùng số lượng yêu cầu chức năng làm thước hiệu chuẩn: khoảng 6–9 yêu cầu cho mỗi use case là mật độ môn này mong đợi.</p>`],
    [3, 'Dùng bộ mẫu thế nào cho ĐÚNG',
      `<p>The unannounced check-in is what makes copying unworkable: a copied package cannot answer "where did this come from".</p>`,
      `<p>Chính các lần kiểm tra bất chợt làm việc chép trở nên bất khả thi: bài chép không trả lời nổi câu "cái này ở đâu ra".</p>`],
    [4, 'Lát cắt dọc — theo một yêu cầu đi hết tám tài liệu',
      `<p>Rehearse this. Being able to walk one requirement from a number in the brief through to a slice of the estimate is the single most convincing thing you can do in a check-in.</p>`,
      `<p>Hãy tập nói đoạn này. Đưa được một yêu cầu đi từ một con số trong đề tới một phần công trong ước lượng là thứ thuyết phục nhất bạn làm được khi bị gọi.</p>`],
    [5, 'Chỗ bộ mẫu CỐ Ý để hở',
      `<p>Open questions are correct output, not a gap. Inventing an answer hides a decision nobody has made — and that is the defect, not the blank.</p>`,
      `<p>Câu hỏi còn treo là kết quả đúng, không phải lỗ hổng. Bịa ra câu trả lời là giấu đi một quyết định chưa ai làm — và đó mới là lỗi, không phải chỗ trống.</p>`],
    [6, 'Bộ kiểm chéo tự động',
      `<p>Eight checks that read all eight documents. Nothing here needs domain knowledge, which is exactly why a script can do it and a reader usually cannot.</p>`,
      `<p>Tám phép kiểm đọc cả tám tài liệu. Không phép nào cần kiến thức chuyên ngành, và đó đúng là lý do script làm được còn người đọc thường không.</p>`],
    [7, 'Nó bắt được ba lỗi thật',
      `<p>All three survived a careful human read. If your team writes a similar script, put it on a slide in week 9 — it demonstrates method, not just output.</p>`,
      `<p>Cả ba đều sống sót qua một lượt đọc kỹ của người. Nếu nhóm bạn viết được script tương tự, hãy đưa nó lên slide tuần 9 — nó chứng minh cách làm, không chỉ kết quả.</p>`],
    [8, 'Tự đo bài của mình',
      `<p>Five thresholds. The last one is the one to take seriously: a package with no open questions is a package that guessed somewhere.</p>`,
      `<p>Năm ngưỡng. Cái cuối đáng coi trọng nhất: một bộ tài liệu không có câu hỏi treo nào là bộ tài liệu đã đoán ở đâu đó.</p>`],
    [9, 'Đọc theo thứ tự này',
      `<p>Read the <em>other</em> topic's package first. You get the shape without getting the answers — which is the whole point.</p>`,
      `<p>Đọc bộ mẫu của đề <em>bạn không chọn</em> trước. Bạn lấy được cái khuôn mà không lấy mất phần đáp án — đó chính là mục đích.</p>`],
  ]),
].join('\n');

/* ─────────── A.10 ─────────── */
const asg10 = [
  head('Nine slides on the week-9 presentation and the two self-check tables to run before you submit.',
       'Chín slide về buổi thuyết trình tuần 9 và hai bảng tự kiểm phải chạy trước khi nộp.'),
  walk('asg10', [
    [1, 'Tuần 9 — thuyết trình',
      `<p>Twenty minutes, five speakers, and a question round that is graded as heavily as the talk.</p>`,
      `<p>Hai mươi phút, năm người nói, và phần hỏi đáp được chấm nặng ngang phần trình bày.</p>`],
    [2, 'Bố cục 20 phút',
      `<p>Five of the twenty minutes go to one vertical slice. That allocation is the recommendation — everything else is context around it.</p>`,
      `<p>Năm trên hai mươi phút dành cho một lát cắt dọc. Cách chia đó chính là lời khuyên — mọi phần khác là bối cảnh quanh nó.</p>`],
    [3, 'Lát cắt dọc ăn điểm hơn đi lướt cả tám',
      `<p>Twenty minutes cannot cover 109 requirements, but it can take one requirement through all eight documents — which proves the package holds together.</p>`,
      `<p>Hai mươi phút không phủ nổi 109 yêu cầu, nhưng đủ để đưa một yêu cầu đi qua cả tám tài liệu — và điều đó chứng minh bộ tài liệu ăn khớp.</p>`],
    [4, 'Năm người nói phần nào',
      `<p>Assign the parts in week 8. Whoever does not speak will be asked a question anyway, so choosing beforehand is strictly better.</p>`,
      `<p>Chia phần nói từ tuần 8. Ai không nói thì kiểu gì cũng bị hỏi, nên chọn trước luôn luôn tốt hơn.</p>`],
    [5, 'Slide nên trông thế nào',
      `<p>The documents are already submitted. Slides exist to explain them, not to display them at 40% zoom.</p>`,
      `<p>Tài liệu đã nộp rồi. Slide tồn tại để giải thích tài liệu, không phải để chiếu lại nó ở mức thu nhỏ 40%.</p>`],
    [6, 'Câu hỏi sau thuyết trình',
      `<p>"We have not settled that — here is the open question and who owns it" is a scoring answer. Defending a guess is not.</p>`,
      `<p>"Chỗ đó nhóm em chưa chốt — đây là câu hỏi treo và ai phải trả lời" là câu được điểm. Bảo vệ một phỏng đoán thì không.</p>`],
    [7, 'Bảng tự kiểm — tính đầy đủ',
      `<p>Six rows, each checkable in a couple of minutes. Run it in week 8, not on submission day.</p>`,
      `<p>Sáu dòng, mỗi dòng kiểm trong vài phút. Chạy nó ở tuần 8, đừng để tới ngày nộp.</p>`],
    [8, 'Bảng tự kiểm — tính nhất quán',
      `<p>Six cross-document checks. This is the table that protects the heaviest part of the rubric, and every row is mechanical.</p>`,
      `<p>Sáu phép kiểm giữa các tài liệu. Đây là bảng giữ phần nặng nhất của thang chấm, và mọi dòng đều máy móc.</p>`],
    [9, 'Nộp cái gì',
      `<p>Five items, one of them a plain text file explaining the other four. It costs five minutes and makes the grader find what they are looking for.</p>`,
      `<p>Năm mục, trong đó một file văn bản thuần giải thích bốn mục kia. Nó tốn năm phút và làm người chấm tìm được thứ họ cần.</p>`],
  ]),
].join('\n');

/** slug → slide walkthrough, prepended to each Assignment lesson. */
export const WALKS = {
  'swr302-assignment-de-bai': asg1,
  'swr302-assignment-tp1': asg2,
  'swr302-assignment-tp2': asg3,
  'swr302-assignment-phan-cong-nhom': asg4,
  'swr302-assignment-ke-hoach-tuan': asg5,
  'swr302-assignment-huong-dan-1-2': asg6,
  'swr302-assignment-huong-dan-3-5': asg7,
  'swr302-assignment-huong-dan-6-8': asg8,
  'swr302-assignment-bai-mau': asg9,
  'swr302-assignment-thuyet-trinh-va-tu-kiem': asg10,
};

export default WALKS;

/* ─────────────────────────────────────────────────────────────────────────
 * Diagrams and mockups drawn for the two worked packages.
 * They live in the package lessons too; they are repeated here because the
 * topic lessons are where a team reads about TP1/TP2 and asks "what does the
 * finished thing look like?".
 * ───────────────────────────────────────────────────────────────────────── */
const CDN = 'https://media.cuongthai.com/images/academy/SWR302/v1';
const fig = (src, capEn, capVi) =>
  `<div class="anh-slide"><img src="${CDN}/${src}" alt="${capEn.replace(/"/g, '&quot;')}" loading="lazy" width="1280" height="720" />` +
  `<p class="chu-thich ml-en">${capEn}</p><p class="chu-thich ml-vi">${capVi}</p></div>`;

const gallery = (titleEn, titleVi, leadEn, leadVi, figs) =>
  [bi(`<h2>${titleEn}</h2><p>${leadEn}</p>`, `<h2>${titleVi}</h2><p>${leadVi}</p>`), ...figs].join('\n');

const tp1Figs = gallery(
  '📐 The finished diagrams for TP1',
  '📐 Sơ đồ &amp; bản vẽ hoàn chỉnh của TP1',
  'This is what the modelling work on TP1 produces: one use case diagram covering all fourteen use cases, and three mockups drawn at the moment each screen has to show an <em>exception</em> — because that is the state a mockup is worth drawing for.',
  'Đây là thứ phần mô hình hoá của TP1 sinh ra: một use case diagram phủ đủ mười bốn use case, và ba mockup được vẽ đúng lúc màn hình phải hiện một <em>ngoại lệ</em> — vì đó mới là trạng thái đáng vẽ mockup.',
  [
    fig('assignment-tp1/001.webp',
      '📐 Figure B-3 — CARS use case diagram · 14 use cases · 12 actors · 5 «include» · 3 «extend»',
      '📐 Hình B-3 — Use case diagram của CARS · 14 use case · 12 actor · 5 «include» · 3 «extend»'),
    fig('assignment-tp1/002.webp',
      '🖥️ M1 — UC-03 Register for a section, exception 3.0.E1 (prerequisite not met)',
      '🖥️ M1 — UC-03 Đăng ký lớp, ngoại lệ 3.0.E1 (chưa đạt môn tiên quyết)'),
    fig('assignment-tp1/003.webp',
      '🖥️ M2 — UC-06 Override decision, exception 6.0.E1 (48-hour deadline breached)',
      '🖥️ M2 — UC-06 Quyết định vượt sĩ số, ngoại lệ 6.0.E1 (quá hạn 48 giờ)'),
    fig('assignment-tp1/004.webp',
      '🖥️ M3 — UC-09 Degree audit, exception 9.0.E1 (a requirement group it cannot evaluate)',
      '🖥️ M3 — UC-09 Kiểm tra tiến độ tốt nghiệp, ngoại lệ 9.0.E1 (nhóm điều kiện không đánh giá được)'),
  ],
);

const tp2Figs = gallery(
  '📐 The finished diagrams for TP2',
  '📐 Sơ đồ &amp; bản vẽ hoàn chỉnh của TP2',
  'TP2 needs more screens than TP1 because the hard rules live in the interface: the routing workbench has to show <em>why</em> it picked a warehouse, and the exception console has to offer a different resolution per exception type.',
  'TP2 cần nhiều màn hình hơn TP1 vì các luật khó nằm ngay trong giao diện: bàn định tuyến phải cho thấy <em>vì sao</em> nó chọn kho đó, và bảng xử lý ngoại lệ phải đưa ra cách giải khác nhau cho từng loại ngoại lệ.',
  [
    fig('assignment-tp2/001.webp',
      '📐 Figure B-3 — OMFS use case diagram · 14 use cases · 12 actors · 8 «include» · 4 «extend»',
      '📐 Hình B-3 — Use case diagram của OMFS · 14 use case · 12 actor · 8 «include» · 4 «extend»'),
    fig('assignment-tp2/002.webp',
      '🖥️ M1 — UC-04 Routing workbench, normal flow 4.0 with the full score table',
      '🖥️ M1 — UC-04 Bàn định tuyến, luồng chính 4.0 kèm bảng điểm đầy đủ'),
    fig('assignment-tp2/003.webp',
      '🖥️ M1b — UC-04 exception 4.0.E2 (split limit exceeded, nothing created)',
      '🖥️ M1b — UC-04 ngoại lệ 4.0.E2 (vượt giới hạn tách đơn, không tạo gì cả)'),
    fig('assignment-tp2/004.webp',
      '🖥️ M2 — UC-07 Carrier rate shopping, with one ineligible carrier and its reason',
      '🖥️ M2 — UC-07 So giá vận chuyển, có một hãng không đủ điều kiện kèm lý do'),
    fig('assignment-tp2/005.webp',
      '🖥️ M3 — UC-10 Exception console, type-specific resolutions',
      '🖥️ M3 — UC-10 Bảng xử lý ngoại lệ, mỗi loại một cách giải'),
    fig('assignment-tp2/006.webp',
      '🖥️ M4 — UC-09 Customer tracking, split order + stale carrier status',
      '🖥️ M4 — UC-09 Trang theo dõi cho khách, đơn bị tách + trạng thái hãng vận chuyển đã cũ'),
  ],
);

/** slug → figure gallery appended after the lesson text. */
export const TAILS = {
  'swr302-assignment-tp1': tp1Figs,
  'swr302-assignment-tp2': tp2Figs,
  'swr302-assignment-bai-mau': [tp1Figs, tp2Figs].join('\n'),
};
