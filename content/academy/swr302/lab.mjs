/**
 * SWR302 · Section "LAB (10%)" — the on-going practical component named in the
 * official grade table: draw context / swimlane / state diagrams and other
 * requirements models (CLO5–6).
 *
 * Six lessons, each: when to use the model · notation · a worked exercise drawn
 * from assignment topic TP1 or TP2 · the mistakes that cost marks.
 *
 * Diagrams are drawn with HTML tables and <pre> boxes on purpose: the page
 * sanitizer (frontend/src/lib/utils.ts, DOMPurify allowlist) strips <svg>.
 */
import { bi } from './_slides.mjs';

/* ─────────── L.1 — overview & model selection ─────────── */
const L1 = {
  title: 'L.1 — The LAB (10%): which model answers which question|||L.1 — LAB (10%): mô hình nào trả lời câu hỏi nào',
  slug: 'swr302-lab-tong-quan',
  type: 'DOCUMENT',
  isFreePreview: true,
  description: 'LAB chiếm 10% điểm môn (CLO5–6): vẽ mô hình yêu cầu. Bảng chọn mô hình theo câu hỏi cần trả lời, năm quy tắc đúng cho MỌI sơ đồ, và cách LAB nối vào Assignment và Practical Exam.',
  content: [
    bi(
      `<span class="eyebrow">LAB · Lesson L.1 · Start here</span>
<h2>The LAB component — 10% of your grade</h2>
<p class="lead">The LAB is the <strong>drawing</strong> half of this course. Where the Assignment asks you to produce a complete requirements package, the LAB asks you to produce <em>one correct model at a time</em>, under supervision, and to explain why that model was the right one. It is assessed against <strong>CLO5 and CLO6</strong> — analyze and model requirements.</p>
<div class="callout ok"><strong>The LAB is also your Practical Exam training.</strong> The Practical Exam (25%) gives you a scenario and 85 minutes to produce a model or a set of requirements. There is no way to revise for it by reading. Every LAB session is a timed rehearsal for it, which makes the LAB worth more than its 10%.</div>

<h3>Which model answers which question</h3>
<p>The single most common LAB mistake is drawing the model you find easiest rather than the one the question needs. Wiegers's Chapter 12 makes the choice mechanical — pick by <strong>the question you must answer</strong>:</p>
<table>
  <thead><tr><th>The question</th><th>The model</th><th>Lesson</th></tr></thead>
  <tbody>
    <tr><td>What is inside our system and what is outside it?</td><td><strong>Context diagram</strong></td><td>L.2</td></tr>
    <tr><td>Which other systems surround ours, and who owns them?</td><td><strong>Ecosystem map</strong></td><td>L.2</td></tr>
    <tr><td>Who does what, in what order, and where does the work hand over?</td><td><strong>Swimlane diagram</strong></td><td>L.3</td></tr>
    <tr><td>What states can this object be in, and what moves it between them?</td><td><strong>State-transition diagram</strong> or <strong>state table</strong></td><td>L.4</td></tr>
    <tr><td>Where does data come from, where does it go, where is it stored?</td><td><strong>Data flow diagram</strong></td><td>L.5</td></tr>
    <tr><td>What things does the business deal with, and how do they relate?</td><td><strong>Entity-relationship diagram</strong></td><td>L.5</td></tr>
    <tr><td>Given these conditions, what should the system do?</td><td><strong>Decision table</strong> or <strong>decision tree</strong></td><td>L.6</td></tr>
    <tr><td>How does the user get from screen to screen?</td><td><strong>Dialog map</strong></td><td>L.6</td></tr>
    <tr><td>What does each control on this screen do?</td><td><strong>Display-Action-Response table</strong></td><td>L.6</td></tr>
  </tbody>
</table>
<div class="pitfall"><strong>The trap.</strong> A swimlane diagram and a data flow diagram look similar — boxes joined by arrows — but they answer different questions and are graded differently. A swimlane shows <em>who acts, and when</em>; a DFD shows <em>what data moves, and where it rests</em>. Drawing a DFD with actors in it, or a swimlane with data stores in it, loses marks even when the picture is otherwise correct.</div>

<h3>Five rules that apply to every model you will draw</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1 · Label everything</div><div class="lz-d">Every box, every arrow, every lane. An unlabelled arrow is the commonest single mark lost in this course, because the grader cannot tell what flows along it.</div></div>
  <div class="lz-step"><div class="lz-k">2 · One level of abstraction</div><div class="lz-d">Do not mix "Process the order" with "Click the Save button" in the same diagram. If two boxes are not comparable in size, one of them is on the wrong diagram.</div></div>
  <div class="lz-step"><div class="lz-k">3 · Draw the boundary</div><div class="lz-d">Say explicitly what is inside your system and what is outside. A diagram with no boundary says the author never decided the scope.</div></div>
  <div class="lz-step"><div class="lz-k">4 · Show the unhappy path</div><div class="lz-d">A model with only the success path models a world that does not exist. Every diagram in this course should contain at least one failure, rejection or exception branch.</div></div>
  <div class="lz-step"><div class="lz-k">5 · Add a legend when you invent a symbol</div><div class="lz-d">You may deviate from standard notation if you say so. You may not deviate silently.</div></div>
</div>

<h3>Tools</h3>
<p>Any of <strong>draw.io</strong> (free, browser-based, recommended), <strong>Visual Paradigm Community</strong> or <strong>BOUML</strong>. Submit both the exported image <em>and</em> the editable source file — you will be asked to change a diagram live, and a flattened image cannot be changed.</p>
<div class="note-ct">Every exercise in lessons L.2–L.6 uses <strong>assignment topic TP1 or TP2</strong>. That is deliberate: the models you draw in the LAB are the same models your team needs in the Assignment, so the two components feed each other instead of competing for your time.</div>`,
      `<span class="eyebrow">LAB · Bài L.1 · Bắt đầu ở đây</span>
<h2>Phần LAB — 10% điểm môn</h2>
<p class="lead">LAB là nửa <strong>vẽ</strong> của môn học. Trong khi Assignment bắt bạn làm ra một bộ tài liệu yêu cầu hoàn chỉnh, LAB bắt bạn làm ra <em>một mô hình đúng, mỗi lần một cái</em>, có giám sát, và giải thích được vì sao đó là mô hình phù hợp. Nó chấm theo <strong>CLO5 và CLO6</strong> — phân tích và mô hình hoá yêu cầu.</p>
<div class="callout ok"><strong>LAB cũng chính là luyện thi Practical Exam.</strong> Practical Exam (25%) cho bạn một tình huống và 85 phút để tạo ra một mô hình hoặc một bộ yêu cầu. Không có cách nào ôn nó bằng cách đọc. Mỗi buổi LAB là một lượt tổng duyệt có tính giờ cho nó, nên LAB đáng giá hơn con số 10% của nó.</div>

<h3>Mô hình nào trả lời câu hỏi nào</h3>
<p>Lỗi LAB phổ biến nhất là vẽ cái mô hình mình thấy dễ nhất thay vì cái câu hỏi đang cần. Chương 12 của Wiegers biến lựa chọn này thành máy móc — chọn theo <strong>câu hỏi bạn phải trả lời</strong>:</p>
<table>
  <thead><tr><th>Câu hỏi</th><th>Mô hình</th><th>Bài</th></tr></thead>
  <tbody>
    <tr><td>Cái gì nằm trong hệ thống của ta, cái gì nằm ngoài?</td><td><strong>Context diagram</strong></td><td>L.2</td></tr>
    <tr><td>Những hệ thống nào vây quanh ta, ai sở hữu chúng?</td><td><strong>Ecosystem map</strong></td><td>L.2</td></tr>
    <tr><td>Ai làm gì, theo thứ tự nào, bàn giao ở đâu?</td><td><strong>Swimlane diagram</strong></td><td>L.3</td></tr>
    <tr><td>Đối tượng này có thể ở những trạng thái nào, cái gì chuyển nó?</td><td><strong>State-transition diagram</strong> hoặc <strong>state table</strong></td><td>L.4</td></tr>
    <tr><td>Dữ liệu từ đâu tới, đi đâu, nằm ở đâu?</td><td><strong>Data flow diagram</strong></td><td>L.5</td></tr>
    <tr><td>Nghiệp vụ làm việc với những thứ gì, quan hệ ra sao?</td><td><strong>Entity-relationship diagram</strong></td><td>L.5</td></tr>
    <tr><td>Với các điều kiện này thì hệ thống phải làm gì?</td><td><strong>Decision table</strong> hoặc <strong>decision tree</strong></td><td>L.6</td></tr>
    <tr><td>Người dùng đi từ màn hình này sang màn hình kia thế nào?</td><td><strong>Dialog map</strong></td><td>L.6</td></tr>
    <tr><td>Từng nút trên màn hình này làm gì?</td><td><strong>Display-Action-Response table</strong></td><td>L.6</td></tr>
  </tbody>
</table>
<div class="pitfall"><strong>Cái bẫy.</strong> Swimlane và data flow diagram trông giống nhau — hộp nối bằng mũi tên — nhưng chúng trả lời hai câu hỏi khác nhau và được chấm khác nhau. Swimlane cho thấy <em>ai hành động, lúc nào</em>; DFD cho thấy <em>dữ liệu nào di chuyển, và nằm lại ở đâu</em>. Vẽ DFD có actor trong đó, hay swimlane có data store trong đó, đều mất điểm dù bức hình còn lại đúng hết.</div>

<h3>Năm quy tắc đúng cho MỌI mô hình bạn sẽ vẽ</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1 · Ghi nhãn tất cả</div><div class="lz-d">Mọi hộp, mọi mũi tên, mọi lane. Mũi tên không nhãn là chỗ mất điểm nhiều nhất của môn này, vì người chấm không biết cái gì chảy trên đó.</div></div>
  <div class="lz-step"><div class="lz-k">2 · Một mức trừu tượng</div><div class="lz-d">Đừng để "Xử lý đơn hàng" nằm cùng sơ đồ với "Bấm nút Lưu". Nếu hai hộp không tương đương về độ lớn thì một trong hai đang ở nhầm sơ đồ.</div></div>
  <div class="lz-step"><div class="lz-k">3 · Vẽ ranh giới</div><div class="lz-d">Nói rõ cái gì trong hệ thống, cái gì ngoài. Sơ đồ không có ranh giới nghĩa là tác giả chưa từng quyết định phạm vi.</div></div>
  <div class="lz-step"><div class="lz-k">4 · Vẽ cả đường không thuận</div><div class="lz-d">Mô hình chỉ có đường thành công là mô hình của một thế giới không tồn tại. Mọi sơ đồ trong môn này nên có ít nhất một nhánh hỏng, từ chối hoặc ngoại lệ.</div></div>
  <div class="lz-step"><div class="lz-k">5 · Có chú giải khi tự chế ký hiệu</div><div class="lz-d">Bạn được phép lệch chuẩn ký pháp nếu nói ra. Bạn không được phép lệch trong im lặng.</div></div>
</div>

<h3>Công cụ</h3>
<p>Dùng <strong>draw.io</strong> (miễn phí, chạy trên trình duyệt, khuyến nghị), <strong>Visual Paradigm Community</strong> hoặc <strong>BOUML</strong>. Nộp cả ảnh xuất ra <em>và</em> file nguồn sửa được — bạn sẽ bị yêu cầu sửa sơ đồ ngay tại chỗ, mà ảnh dẹt thì không sửa được.</p>
<div class="note-ct">Mọi bài luyện trong L.2–L.6 đều dùng <strong>đề tài TP1 hoặc TP2 của Assignment</strong>. Đó là cố ý: mô hình bạn vẽ trong LAB đúng là mô hình nhóm bạn cần cho Assignment, nên hai phần nuôi nhau thay vì tranh giành thời gian của bạn.</div>`,
    ),
  ].join('\n'),
};

/* ─────────── L.2 — context diagram & ecosystem map ─────────── */
const L2 = {
  title: 'L.2 — Context diagram & ecosystem map|||L.2 — Context diagram & ecosystem map',
  slug: 'swr302-lab-context-diagram',
  type: 'DOCUMENT',
  description: 'Sơ đồ ngữ cảnh: một vòng tròn cho cả hệ thống, các thực thể ngoài, và luồng dữ liệu CÓ NHÃN. Khác biệt với ecosystem map. Bài luyện trên TP2 kèm lời giải và bốn lỗi hay bị trừ điểm.',
  content: [
    bi(
      `<span class="eyebrow">LAB · Lesson L.2</span>
<h2>Context diagram — the system boundary in one picture</h2>
<p class="lead">A context diagram answers exactly one question: <strong>what is inside our system, and what is outside it?</strong> It is the simplest model in the course and the one most worth getting right, because every scope argument for the rest of the project is settled by it.</p>

<h3>Notation — there are only three symbols</h3>
<table>
  <thead><tr><th>Symbol</th><th>Means</th><th>How many</th></tr></thead>
  <tbody>
    <tr><td>A circle in the middle</td><td><strong>The whole system</strong>, named as a noun phrase</td><td><strong>Exactly one.</strong> Never two</td></tr>
    <tr><td>Rectangles around it</td><td><strong>External entities</strong> — user classes and other systems</td><td>As many as there are</td></tr>
    <tr><td>Labelled arrows</td><td><strong>Data flows</strong>, named for the data that moves</td><td>One per distinct flow; direction matters</td></tr>
  </tbody>
</table>
<div class="callout warn"><strong>The circle has no internals.</strong> A context diagram shows no processes, no databases and no screens inside the system. If you have drawn boxes inside the circle you have drawn a level-1 data flow diagram, which is a different exercise (L.5).</div>

<h3>Worked exercise — TP2</h3>
<p><em>Draw the context diagram for the Order Management and Fulfillment System (OMFS) in assignment topic TP2.</em></p>
<p><strong>Step 1 — list the external entities.</strong> Anything that sends data to, or receives data from, the system and is not part of it:</p>
<p>Warehouse Operator · Fulfillment Manager · Inventory Controller · Customer Service Agent · Logistics Manager · Customer · Sales Channel · 3PL Carrier · Payment Gateway · ERP / Accounting · Notification Service</p>
<p><strong>Step 2 — name the flows, from the data's point of view.</strong> Not "logs in", not "clicks" — the <em>data</em>:</p>
<pre>
                 order data                     stock quantity
  Sales Channel ───────────────▶            ◀─────────────── Sales Channel
                                 ┌─────────┐
  Payment  ── authorization ────▶│         │──── rate request ────▶ 3PL
  Gateway         status         │         │◀─── quote, label, ───  Carrier
                                 │  OMFS   │     tracking event
  Warehouse ── pick scan,  ─────▶│         │
  Operator     carton weight     │         │──── pick task ───────▶ Warehouse
                                 │         │                        Operator
  Fulfillment ─ wave request, ──▶│         │
  Manager      routing override  │         │──── shipped-order ───▶ ERP /
                                 │         │     financials         Accounting
  Customer ──── tracking ───────▶│         │
                 request         └─────────┘──── order status ────▶ Notification
                                                  message           Service
</pre>
<p><strong>Step 3 — check the boundary against the brief.</strong> TP2 says the storefront "effectively handles customer browsing". So the storefront is <strong>outside</strong>, and it appears as a Sales Channel rectangle, not inside the circle. Catalogue, pricing and checkout are therefore out of scope, and this diagram is the evidence.</p>

<h3>Ecosystem map — the other diagram, and when to draw it instead</h3>
<p>An <strong>ecosystem map</strong> shows the same neighbourhood but adds what a context diagram deliberately omits: the relationships <em>between the external systems themselves</em>, and who owns each one. Draw it when the surrounding systems talk to each other behind your back — which is exactly the situation in TP2, where a marketplace already talks to the storefront's catalogue.</p>
<table>
  <thead><tr><th></th><th>Context diagram</th><th>Ecosystem map</th></tr></thead>
  <tbody>
    <tr><td>Centre</td><td>Our system, one circle</td><td>Our system, one of several boxes</td></tr>
    <tr><td>Shows</td><td>Only flows to and from <em>us</em></td><td>Flows between <em>any</em> two systems</td></tr>
    <tr><td>Adds</td><td>—</td><td>Ownership, technology, data volume</td></tr>
    <tr><td>Answers</td><td>What is in scope?</td><td>Who else will this change affect?</td></tr>
  </tbody>
</table>

<h3>Four mistakes that cost marks</h3>
<div class="pitfall"><strong>1 · Unlabelled arrows.</strong> "Sales Channel → OMFS" tells the grader nothing. "order data" does.<br>
<strong>2 · Control flow instead of data flow.</strong> "requests report", "approves", "logs in" are actions, not data. Name what crosses the line: "report parameters", "approval decision", "credentials".<br>
<strong>3 · Two circles.</strong> Splitting the system into "OMFS Core" and "OMFS Reporting" turns a context diagram into a level-1 DFD and abandons the one job it had.<br>
<strong>4 · Missing an external system named in the brief.</strong> TP2 names 3PL carriers explicitly. A context diagram without them is incomplete no matter how neat it is.</div>`,
      `<span class="eyebrow">LAB · Bài L.2</span>
<h2>Context diagram — ranh giới hệ thống trong một bức hình</h2>
<p class="lead">Sơ đồ ngữ cảnh trả lời đúng một câu hỏi: <strong>cái gì nằm trong hệ thống của ta, cái gì nằm ngoài?</strong> Đó là mô hình đơn giản nhất môn học và là cái đáng làm đúng nhất, vì mọi tranh cãi về phạm vi suốt phần còn lại của dự án đều được nó phân xử.</p>

<h3>Ký pháp — chỉ có ba ký hiệu</h3>
<table>
  <thead><tr><th>Ký hiệu</th><th>Nghĩa</th><th>Bao nhiêu</th></tr></thead>
  <tbody>
    <tr><td>Một vòng tròn ở giữa</td><td><strong>Toàn bộ hệ thống</strong>, đặt tên bằng cụm danh từ</td><td><strong>Đúng một.</strong> Không bao giờ hai</td></tr>
    <tr><td>Các hình chữ nhật quanh nó</td><td><strong>Thực thể ngoài</strong> — lớp người dùng và hệ thống khác</td><td>Có bao nhiêu vẽ bấy nhiêu</td></tr>
    <tr><td>Mũi tên có nhãn</td><td><strong>Luồng dữ liệu</strong>, đặt tên theo dữ liệu di chuyển</td><td>Mỗi luồng riêng một mũi tên; chiều rất quan trọng</td></tr>
  </tbody>
</table>
<div class="callout warn"><strong>Vòng tròn không có ruột.</strong> Sơ đồ ngữ cảnh không thể hiện tiến trình, cơ sở dữ liệu hay màn hình bên trong hệ thống. Nếu bạn đã vẽ các hộp bên trong vòng tròn thì bạn đang vẽ data flow diagram mức 1, đó là bài khác (L.5).</div>

<h3>Bài luyện có lời giải — TP2</h3>
<p><em>Vẽ sơ đồ ngữ cảnh cho Hệ thống Quản lý Đơn hàng &amp; Hoàn tất đơn (OMFS) trong đề TP2.</em></p>
<p><strong>Bước 1 — liệt kê thực thể ngoài.</strong> Bất cứ thứ gì gửi dữ liệu tới hoặc nhận dữ liệu từ hệ thống mà không thuộc hệ thống:</p>
<p>Nhân viên kho · Quản lý hoàn tất đơn · Kiểm soát tồn kho · Nhân viên CSKH · Quản lý vận chuyển · Khách hàng · Kênh bán · Hãng 3PL · Cổng thanh toán · ERP/Kế toán · Dịch vụ thông báo</p>
<p><strong>Bước 2 — đặt tên luồng theo góc nhìn của DỮ LIỆU.</strong> Không phải "đăng nhập", không phải "bấm" — mà là <em>dữ liệu</em>:</p>
<pre>
                dữ liệu đơn hàng                  số lượng tồn
  Kênh bán ────────────────────▶            ◀──────────────── Kênh bán
                                 ┌─────────┐
  Cổng      ── trạng thái  ─────▶│         │──── yêu cầu giá ────▶ Hãng
  thanh toán   uỷ quyền          │         │◀─── báo giá, tem, ──  3PL
                                 │  OMFS   │     sự kiện theo dõi
  Nhân viên ── lượt quét,  ─────▶│         │
  kho          khối lượng kiện   │         │──── nhiệm vụ lấy ───▶ Nhân viên
                                 │         │     hàng               kho
  Quản lý  ── yêu cầu đợt, ─────▶│         │
  hoàn tất    ghi đè định tuyến  │         │──── số liệu tài ────▶ ERP /
                                 │         │     chính đơn đã giao  Kế toán
  Khách  ────── yêu cầu  ───────▶│         │
  hàng           tra cứu         └─────────┘──── tin nhắn trạng ──▶ Dịch vụ
                                                  thái đơn          thông báo
</pre>
<p><strong>Bước 3 — đối chiếu ranh giới với đề bài.</strong> TP2 nói storefront "xử lý tốt việc khách duyệt hàng". Vậy storefront nằm <strong>ngoài</strong>, và nó xuất hiện dưới dạng hình chữ nhật Kênh bán chứ không nằm trong vòng tròn. Danh mục, giá và thanh toán do đó nằm ngoài phạm vi, và sơ đồ này chính là bằng chứng.</p>

<h3>Ecosystem map — sơ đồ còn lại, và khi nào vẽ nó thay thế</h3>
<p><strong>Ecosystem map</strong> thể hiện cùng khu vực nhưng thêm vào thứ mà sơ đồ ngữ cảnh cố ý bỏ qua: quan hệ <em>giữa chính các hệ thống ngoài với nhau</em>, và ai sở hữu từng cái. Hãy vẽ nó khi các hệ thống xung quanh nói chuyện với nhau sau lưng bạn — đúng tình huống của TP2, nơi một sàn TMĐT vốn đã nói chuyện với danh mục của storefront.</p>
<table>
  <thead><tr><th></th><th>Context diagram</th><th>Ecosystem map</th></tr></thead>
  <tbody>
    <tr><td>Ở giữa</td><td>Hệ thống ta, một vòng tròn</td><td>Hệ thống ta, một trong nhiều hộp</td></tr>
    <tr><td>Thể hiện</td><td>Chỉ luồng tới và đi từ <em>ta</em></td><td>Luồng giữa <em>bất kỳ</em> hai hệ thống nào</td></tr>
    <tr><td>Thêm</td><td>—</td><td>Quyền sở hữu, công nghệ, khối lượng dữ liệu</td></tr>
    <tr><td>Trả lời</td><td>Cái gì trong phạm vi?</td><td>Thay đổi này còn ảnh hưởng ai nữa?</td></tr>
  </tbody>
</table>

<h3>Bốn lỗi hay bị trừ điểm</h3>
<div class="pitfall"><strong>1 · Mũi tên không nhãn.</strong> "Kênh bán → OMFS" chẳng nói với người chấm điều gì. "dữ liệu đơn hàng" thì có.<br>
<strong>2 · Luồng điều khiển thay vì luồng dữ liệu.</strong> "yêu cầu báo cáo", "phê duyệt", "đăng nhập" là hành động, không phải dữ liệu. Hãy gọi tên thứ đi qua vạch: "tham số báo cáo", "quyết định phê duyệt", "thông tin đăng nhập".<br>
<strong>3 · Hai vòng tròn.</strong> Tách hệ thống thành "OMFS lõi" và "OMFS báo cáo" là biến sơ đồ ngữ cảnh thành DFD mức 1 và vứt bỏ nhiệm vụ duy nhất của nó.<br>
<strong>4 · Thiếu một hệ thống ngoài mà đề có nhắc.</strong> TP2 nhắc hãng 3PL rõ ràng. Sơ đồ ngữ cảnh thiếu chúng là thiếu sót, dù vẽ có đẹp tới đâu.</div>`,
    ),
  ].join('\n'),
};

/* ─────────── L.3 — swimlane / process flow ─────────── */
const L3 = {
  title: 'L.3 — Swimlane diagram: who does what, in what order|||L.3 — Swimlane: ai làm gì, theo thứ tự nào',
  slug: 'swr302-lab-swimlane',
  type: 'DOCUMENT',
  description: 'Lane theo VAI TRÒ chứ không theo phòng ban, ký pháp hộp/thoi, chỗ bàn giao giữa lane là nơi quy trình hỏng. Bài luyện trên TP1 (vượt sĩ số) kèm lời giải và bốn lỗi hay bị trừ điểm.',
  content: [
    bi(
      `<span class="eyebrow">LAB · Lesson L.3</span>
<h2>Swimlane — the diagram that finds the hand-offs</h2>
<p class="lead">A swimlane diagram answers: <strong>who does what, in what order, and where does the work pass from one person to another?</strong> Its value is almost entirely in that last part. <em>Work breaks at hand-offs</em>, and a swimlane is the only model that makes every hand-off visible as a line crossing a lane boundary.</p>

<h3>Notation</h3>
<table>
  <thead><tr><th>Symbol</th><th>Means</th><th>Rule</th></tr></thead>
  <tbody>
    <tr><td>Horizontal band (lane)</td><td>One <strong>role</strong> or one system</td><td>Label it with the role, never a person's name</td></tr>
    <tr><td>Rounded rectangle</td><td>An activity — verb + object</td><td>Sits in the lane of whoever performs it</td></tr>
    <tr><td>Diamond</td><td>A decision</td><td>Every outgoing arrow is <strong>labelled with the answer</strong></td></tr>
    <tr><td>Arrow</td><td>Flow of control</td><td>An arrow crossing a lane boundary <strong>is a hand-off</strong></td></tr>
    <tr><td>Filled circle / ringed circle</td><td>Start / end</td><td>One start; as many ends as there are real outcomes</td></tr>
  </tbody>
</table>
<div class="callout warn"><strong>Lanes are roles, not departments.</strong> "Academic Office" is a department; "Academic Office Staff" and "Registrar" are two roles inside it that do different things and hand work to each other. Drawing one lane per department hides exactly the hand-offs you are looking for.</div>

<h3>Worked exercise — TP1, the capacity override process</h3>
<p><em>Draw the current-state process by which a student obtains a place in a full section, and mark every hand-off.</em></p>
<pre>
 Student    │ (start)──▶[Email the        ]                    ┌─▶[Register ]──▶(enrolled)
            │           [ department     ]                    │  [ manually]
            │                  │                     ┌────────┘
 ───────────┼──────────────────┼─────────────────────┼──────────────────────────────
 Dept.      │                  ▼                     │
 admin      │           [Forward to the  ]           │
            │           [ academic office]           │
 ───────────┼──────────────────┼─────────────────────┼──────────────────────────────
 Academic   │                  ▼                     │
 Office     │           [Look up the     ]      [Tell the  ]
 Staff      │           [ student record ]      [ student  ]
            │                  │                     ▲
 ───────────┼──────────────────┼─────────────────────┼──────────────────────────────
 Lecturer   │                  ▼                     │
            │              ◇ Room?  ──no──▶[Decline]─┤
            │                  │yes                  │
            │                  ▼                     │
            │           [Reply by email  ]───────────┘
</pre>
<p><strong>Now count the boundary crossings: there are six.</strong> That number <em>is</em> the finding. Six hand-offs, each one an email waiting in somebody's inbox, is why the measured average decision time is six days — and it is a far more persuasive argument than "the process is slow".</p>
<p>The future-state diagram for UC-06 has <strong>two</strong> crossings: student → system, system → Department Head. Putting the two diagrams side by side is the clearest single slide in a Week-9 presentation.</p>

<h3>Four mistakes that cost marks</h3>
<div class="pitfall"><strong>1 · Unlabelled decision branches.</strong> A diamond with two bare arrows is unreadable. Label them "yes"/"no", or "approved"/"declined".<br>
<strong>2 · No failure path.</strong> Where does the process go when the lecturer never replies? If your diagram cannot answer that, it is modelling a world that does not exist.<br>
<strong>3 · Mixing the system into a human lane.</strong> If a step is performed by software, it belongs in a system lane — otherwise the automation boundary is invisible.<br>
<strong>4 · One lane per department.</strong> See the callout above. This is the mistake that makes the whole exercise pointless.</div>
<div class="note-ct">Draw the <strong>current state first</strong>, then the future state. The gap between the two diagrams is your business case, and Chapter 21 (enhancement and replacement projects) calls that gap analysis. On TP1 it is worth doing explicitly — the brief describes a legacy replacement, not a greenfield build.</div>`,
      `<span class="eyebrow">LAB · Bài L.3</span>
<h2>Swimlane — sơ đồ tìm ra các điểm bàn giao</h2>
<p class="lead">Swimlane trả lời: <strong>ai làm gì, theo thứ tự nào, và công việc chuyển từ người này sang người kia ở đâu?</strong> Giá trị của nó nằm gần như trọn vẹn ở vế cuối. <em>Công việc gãy ở chỗ bàn giao</em>, và swimlane là mô hình duy nhất làm mọi điểm bàn giao hiện ra thành một mũi tên cắt ngang ranh giới lane.</p>

<h3>Ký pháp</h3>
<table>
  <thead><tr><th>Ký hiệu</th><th>Nghĩa</th><th>Luật</th></tr></thead>
  <tbody>
    <tr><td>Dải ngang (lane)</td><td>Một <strong>vai trò</strong> hoặc một hệ thống</td><td>Đặt tên theo vai trò, không bao giờ theo tên người</td></tr>
    <tr><td>Chữ nhật bo góc</td><td>Một hoạt động — động từ + tân ngữ</td><td>Nằm trong lane của người thực hiện nó</td></tr>
    <tr><td>Hình thoi</td><td>Một quyết định</td><td>Mọi mũi tên đi ra đều <strong>ghi nhãn câu trả lời</strong></td></tr>
    <tr><td>Mũi tên</td><td>Dòng điều khiển</td><td>Mũi tên cắt ranh giới lane <strong>chính là một điểm bàn giao</strong></td></tr>
    <tr><td>Chấm tròn / tròn có viền</td><td>Bắt đầu / kết thúc</td><td>Một điểm bắt đầu; bao nhiêu kết cục thật thì bấy nhiêu điểm kết thúc</td></tr>
  </tbody>
</table>
<div class="callout warn"><strong>Lane là VAI TRÒ, không phải phòng ban.</strong> "Phòng Đào tạo" là một phòng; "Nhân viên học vụ" và "Trưởng phòng Đào tạo" là hai vai trò bên trong nó, làm những việc khác nhau và bàn giao cho nhau. Vẽ mỗi phòng một lane là giấu đi đúng những điểm bàn giao mà bạn đang đi tìm.</div>

<h3>Bài luyện có lời giải — TP1, quy trình xin vượt sĩ số</h3>
<p><em>Vẽ quy trình hiện tại để một sinh viên xin được chỗ trong lớp đã đầy, và đánh dấu mọi điểm bàn giao.</em></p>
<pre>
 Sinh viên  │ (bắt đầu)─▶[Gửi email cho  ]                    ┌─▶[Đăng ký ]──▶(đã ghi danh)
            │            [ bộ môn        ]                    │  [ thủ công]
            │                  │                     ┌────────┘
 ───────────┼──────────────────┼─────────────────────┼──────────────────────────────
 Thư ký     │                  ▼                     │
 bộ môn     │           [Chuyển tiếp cho ]           │
            │           [ phòng học vụ   ]           │
 ───────────┼──────────────────┼─────────────────────┼──────────────────────────────
 Nhân viên  │                  ▼                     │
 học vụ     │           [Tra hồ sơ      ]      [Báo lại  ]
            │           [ sinh viên     ]      [ sinh viên]
            │                  │                     ▲
 ───────────┼──────────────────┼─────────────────────┼──────────────────────────────
 Giảng viên │                  ▼                     │
            │              ◇ Còn chỗ? ─không─▶[Từ chối]┤
            │                  │còn                  │
            │                  ▼                     │
            │           [Trả lời email  ]───────────┘
</pre>
<p><strong>Giờ hãy đếm số lần cắt ranh giới: sáu.</strong> Chính con số đó <em>là</em> phát hiện. Sáu lần bàn giao, mỗi lần là một email nằm chờ trong hộp thư của ai đó, chính là lý do thời gian quyết định trung bình đo được là sáu ngày — và nó thuyết phục hơn hẳn câu "quy trình chậm".</p>
<p>Sơ đồ trạng thái tương lai cho UC-06 chỉ có <strong>hai</strong> lần cắt: sinh viên → hệ thống, hệ thống → Trưởng bộ môn. Đặt hai sơ đồ cạnh nhau là slide rõ ràng nhất trong buổi thuyết trình tuần 9.</p>

<h3>Bốn lỗi hay bị trừ điểm</h3>
<div class="pitfall"><strong>1 · Nhánh quyết định không nhãn.</strong> Một hình thoi với hai mũi tên trần thì không đọc được. Hãy ghi "có"/"không", hoặc "duyệt"/"từ chối".<br>
<strong>2 · Không có đường hỏng.</strong> Quy trình đi đâu khi giảng viên không bao giờ trả lời? Nếu sơ đồ không trả lời được, nó đang mô hình hoá một thế giới không tồn tại.<br>
<strong>3 · Nhét hệ thống vào lane của người.</strong> Nếu một bước do phần mềm làm, nó phải nằm ở lane hệ thống — nếu không thì ranh giới tự động hoá trở nên vô hình.<br>
<strong>4 · Mỗi phòng ban một lane.</strong> Xem khung cảnh báo ở trên. Đây là lỗi làm cả bài tập trở nên vô nghĩa.</div>
<div class="note-ct">Hãy vẽ <strong>trạng thái hiện tại trước</strong>, rồi mới tới trạng thái tương lai. Khoảng cách giữa hai sơ đồ chính là bài toán kinh doanh của bạn, và chương 21 (dự án nâng cấp & thay thế) gọi khoảng cách đó là gap analysis. Với TP1 thì việc này đáng làm tường minh — đề mô tả một dự án thay thế hệ cũ, không phải xây mới từ đầu.</div>`,
    ),
  ].join('\n'),
};

/* ─────────── L.4 — state diagram & state table ─────────── */
const L4 = {
  title: 'L.4 — State-transition diagram & state table|||L.4 — Sơ đồ chuyển trạng thái & bảng trạng thái',
  slug: 'swr302-lab-state-diagram',
  type: 'DOCUMENT',
  description: 'Phân biệt TRẠNG THÁI với hành động, ký pháp sự kiện[điều kiện]/hành động, khi nào dùng bảng thay sơ đồ, bài luyện trên Order Status của TP2 và bốn lỗi kinh điển.',
  content: [
    bi(
      `<span class="eyebrow">LAB · Lesson L.4</span>
<h2>State-transition diagram — what can this object be, and what moves it?</h2>
<p class="lead">Draw one whenever an object has a <strong>life</strong>: an order, an enrollment, a return, a request. The question it answers is "what states can this be in, and what event moves it from one to another?" — and answering it usually exposes states nobody had named.</p>

<h3>Notation</h3>
<table>
  <thead><tr><th>Symbol</th><th>Means</th></tr></thead>
  <tbody>
    <tr><td>Rounded rectangle</td><td>A <strong>state</strong> — a condition the object <em>rests in</em>, named with an adjective or past participle: <em>Reserved</em>, <em>Backordered</em>, <em>Cancelled</em></td></tr>
    <tr><td>Arrow</td><td>A transition, labelled <code>event [guard] / action</code></td></tr>
    <tr><td>Filled circle</td><td>The initial state</td></tr>
    <tr><td>Ringed circle</td><td>A terminal state — the object's life ends</td></tr>
  </tbody>
</table>
<div class="callout warn"><strong>The mistake that defines this exercise: a state is not an action.</strong> "Reserving stock" is an activity — it belongs on a swimlane. "Reserved" is a state — the object sits there until something happens. If your box name ends in <em>-ing</em>, you have drawn the wrong model.</div>

<h3>Worked exercise — TP2, the life of an order</h3>
<p><em>Draw the state model for Order Status in the OMFS data dictionary.</em></p>
<pre>
  ●
  │ order ingested
  ▼
 [Pending] ──payment not authorized in 30 min [BR-04]──▶ [Pending]   (self-loop: reservation released)
  │ validated
  ▼
 [Validated] ──ATP < ordered qty [BR-02]──▶ [Backordered] ──stock arrives──▶ [Validated]
  │ reserved                                      │
  ▼                                               │ cancelled by agent
 [Reserved] ──routed──▶ [Routed] ──wave released──▶ [Picking]
  │                        │                          │ packed
  │ cancelled              │ re-route                 ▼
  ▼                        └──────────────────▶   [Packed] ──label bought──▶ [Labelled]
 [Cancelled] ◎                                                                   │ collected
                                                                                 ▼
                                                                            [Shipped]
                                                                                 │ delivered
                                                                                 ▼
                                                                            [Delivered] ◎
</pre>
<p><strong>What drawing this exposes.</strong> Three things that prose had hidden:</p>
<ul>
<li><strong>Cancelled is reachable from five states but not from Labelled</strong> — which is BR-05 made visible. The diagram is where that rule stops being a sentence and becomes a shape.</li>
<li><strong>Backordered is not terminal.</strong> It returns to Validated when stock arrives. A team that drew it as an end state has designed a system that strands customers.</li>
<li><strong>The self-loop on Pending</strong> (reservation expiry, BR-04) is easy to miss entirely, because nothing in the use case narrative describes it as a state change.</li>
</ul>

<h3>When to use a state TABLE instead</h3>
<p>Past roughly seven states the diagram becomes spaghetti. A <strong>state table</strong> says the same thing and has one advantage the diagram does not: <strong>the empty cells are visible</strong>, so you can see which transitions you have not thought about.</p>
<table>
  <thead><tr><th>State ↓ &nbsp; Event →</th><th>validated</th><th>reserve fails</th><th>cancel</th><th>label bought</th></tr></thead>
  <tbody>
    <tr><th>Pending</th><td>Validated</td><td>—</td><td>Cancelled</td><td>—</td></tr>
    <tr><th>Validated</th><td>—</td><td>Backordered</td><td>Cancelled</td><td>—</td></tr>
    <tr><th>Reserved</th><td>—</td><td>—</td><td>Cancelled</td><td>—</td></tr>
    <tr><th>Labelled</th><td>—</td><td>—</td><td><strong>refused (BR-05)</strong></td><td>—</td></tr>
  </tbody>
</table>
<p>Note the last row: the answer is not "—" but "refused". A cell that says <em>nothing happens</em> and a cell that says <em>the system actively refuses and explains why</em> are different requirements, and only the table makes you write both down.</p>

<h3>Four mistakes that cost marks</h3>
<div class="pitfall"><strong>1 · States named as activities</strong> ("Processing", "Validating"). See the callout.<br>
<strong>2 · No terminal state.</strong> Every object's life ends somewhere — Delivered, Cancelled, Returned. A diagram with no ringed circle is incomplete.<br>
<strong>3 · Unlabelled transitions.</strong> <code>event [guard] / action</code>, not a bare arrow. The guard is usually a business rule ID.<br>
<strong>4 · Missing the failure transitions.</strong> Expiry, timeout, cancellation. These are exactly the transitions that never appear in a happy-path narrative, which is why the model is worth drawing at all.</div>`,
      `<span class="eyebrow">LAB · Bài L.4</span>
<h2>Sơ đồ chuyển trạng thái — vật này có thể ở đâu, và cái gì làm nó chuyển?</h2>
<p class="lead">Hãy vẽ một cái mỗi khi một đối tượng có <strong>đời sống</strong>: một đơn hàng, một lượt ghi danh, một lượt trả hàng, một yêu cầu. Câu hỏi nó trả lời là "cái này có thể ở những trạng thái nào, và sự kiện nào đưa nó từ trạng thái này sang trạng thái kia?" — và việc trả lời thường phơi ra những trạng thái chưa ai đặt tên.</p>

<h3>Ký pháp</h3>
<table>
  <thead><tr><th>Ký hiệu</th><th>Nghĩa</th></tr></thead>
  <tbody>
    <tr><td>Chữ nhật bo góc</td><td>Một <strong>trạng thái</strong> — tình trạng mà đối tượng <em>nằm yên trong đó</em>, đặt tên bằng tính từ hoặc quá khứ phân từ: <em>Reserved</em>, <em>Backordered</em>, <em>Cancelled</em></td></tr>
    <tr><td>Mũi tên</td><td>Một chuyển tiếp, ghi nhãn <code>sự kiện [điều kiện] / hành động</code></td></tr>
    <tr><td>Chấm tròn đặc</td><td>Trạng thái khởi đầu</td></tr>
    <tr><td>Tròn có viền</td><td>Trạng thái kết thúc — đời sống đối tượng chấm dứt</td></tr>
  </tbody>
</table>
<div class="callout warn"><strong>Lỗi định nghĩa cả bài tập này: trạng thái KHÔNG phải hành động.</strong> "Đang giữ chỗ tồn kho" là một hoạt động — nó thuộc về swimlane. "Đã giữ chỗ" là một trạng thái — đối tượng nằm đó tới khi có gì đó xảy ra. Nếu tên hộp của bạn kết thúc bằng "đang…", bạn đã vẽ nhầm mô hình.</div>

<h3>Bài luyện có lời giải — TP2, đời sống một đơn hàng</h3>
<p><em>Vẽ mô hình trạng thái cho Order Status trong data dictionary của OMFS.</em></p>
<pre>
  ●
  │ nhận đơn
  ▼
 [Pending] ──không duyệt thanh toán trong 30' [BR-04]──▶ [Pending]  (vòng lại: nhả chỗ đã giữ)
  │ đã kiểm hợp lệ
  ▼
 [Validated] ──ATP < số lượng [BR-02]──▶ [Backordered] ──có hàng về──▶ [Validated]
  │ đã giữ chỗ                                  │
  ▼                                             │ CSKH huỷ
 [Reserved] ──đã định tuyến──▶ [Routed] ──phát đợt──▶ [Picking]
  │                              │                      │ đóng gói xong
  │ huỷ                          │ định tuyến lại       ▼
  ▼                              └──────────────▶   [Packed] ──mua tem──▶ [Labelled]
 [Cancelled] ◎                                                                │ hãng lấy hàng
                                                                              ▼
                                                                          [Shipped]
                                                                              │ đã giao
                                                                              ▼
                                                                         [Delivered] ◎
</pre>
<p><strong>Vẽ ra thì lộ những gì.</strong> Ba thứ mà văn xuôi đã giấu:</p>
<ul>
<li><strong>Cancelled tới được từ năm trạng thái nhưng KHÔNG từ Labelled</strong> — đó chính là BR-05 hiện hình. Sơ đồ là nơi luật đó thôi là một câu chữ và trở thành một hình dạng.</li>
<li><strong>Backordered không phải trạng thái cuối.</strong> Nó quay về Validated khi hàng về. Nhóm vẽ nó thành trạng thái kết thúc là đã thiết kế một hệ thống bỏ rơi khách hàng.</li>
<li><strong>Vòng tự lặp ở Pending</strong> (hết hạn giữ chỗ, BR-04) rất dễ bỏ sót hoàn toàn, vì không có gì trong lời kể use case mô tả nó như một lần đổi trạng thái.</li>
</ul>

<h3>Khi nào dùng BẢNG trạng thái thay vì sơ đồ</h3>
<p>Quá khoảng bảy trạng thái thì sơ đồ thành mớ bòng bong. <strong>Bảng trạng thái</strong> nói cùng một điều và có một lợi thế mà sơ đồ không có: <strong>các ô trống hiện ra</strong>, nên bạn thấy được những chuyển tiếp mình chưa nghĩ tới.</p>
<table>
  <thead><tr><th>Trạng thái ↓ &nbsp; Sự kiện →</th><th>kiểm hợp lệ</th><th>giữ chỗ thất bại</th><th>huỷ</th><th>mua tem</th></tr></thead>
  <tbody>
    <tr><th>Pending</th><td>Validated</td><td>—</td><td>Cancelled</td><td>—</td></tr>
    <tr><th>Validated</th><td>—</td><td>Backordered</td><td>Cancelled</td><td>—</td></tr>
    <tr><th>Reserved</th><td>—</td><td>—</td><td>Cancelled</td><td>—</td></tr>
    <tr><th>Labelled</th><td>—</td><td>—</td><td><strong>từ chối (BR-05)</strong></td><td>—</td></tr>
  </tbody>
</table>
<p>Để ý dòng cuối: câu trả lời không phải "—" mà là "từ chối". Một ô nói <em>không có gì xảy ra</em> và một ô nói <em>hệ thống chủ động từ chối và giải thích vì sao</em> là hai yêu cầu khác nhau, và chỉ cái bảng mới buộc bạn viết ra cả hai.</p>

<h3>Bốn lỗi hay bị trừ điểm</h3>
<div class="pitfall"><strong>1 · Đặt tên trạng thái như hành động</strong> ("Đang xử lý", "Đang kiểm tra"). Xem khung cảnh báo.<br>
<strong>2 · Không có trạng thái kết thúc.</strong> Đời sống mọi đối tượng đều kết thúc ở đâu đó — Delivered, Cancelled, Returned. Sơ đồ không có vòng tròn viền là chưa xong.<br>
<strong>3 · Chuyển tiếp không nhãn.</strong> Phải là <code>sự kiện [điều kiện] / hành động</code>, không phải mũi tên trần. Điều kiện thường chính là một mã business rule.<br>
<strong>4 · Thiếu các chuyển tiếp hỏng.</strong> Hết hạn, quá giờ, huỷ. Đó đúng là những chuyển tiếp không bao giờ xuất hiện trong lời kể luồng thuận, và cũng chính vì thế mà mô hình này mới đáng vẽ.</div>`,
    ),
  ].join('\n'),
};

/* ─────────── L.5 — DFD & ERD ─────────── */
const L5 = {
  title: 'L.5 — Data flow diagram & entity-relationship diagram|||L.5 — Data flow diagram & sơ đồ thực thể–quan hệ',
  slug: 'swr302-lab-dfd-erd',
  type: 'DOCUMENT',
  description: 'DFD: bốn ký hiệu, luật cân bằng giữa các mức, và hai lỗi kinh điển (hố đen, phép màu). ERD: thực thể, quan hệ, bản số. Bài luyện trên TP2 và TP1 kèm lời giải.',
  content: [
    bi(
      `<span class="eyebrow">LAB · Lesson L.5</span>
<h2>Data flow diagram — where data comes from, goes and rests</h2>
<p class="lead">A DFD answers a question no other model answers: <strong>where does each piece of data originate, what transforms it, and where does it sit between transformations?</strong> It shows no sequence and no actors performing steps — that is a swimlane's job, and confusing the two is the commonest error in this LAB.</p>

<h3>Notation — four symbols</h3>
<table>
  <thead><tr><th>Symbol</th><th>Means</th><th>Named with</th></tr></thead>
  <tbody>
    <tr><td>Circle / rounded box</td><td><strong>Process</strong> — transforms data</td><td>A verb phrase: "Validate order"</td></tr>
    <tr><td>Open-ended rectangle</td><td><strong>Data store</strong> — data at rest</td><td>A noun: "Inventory records"</td></tr>
    <tr><td>Square</td><td><strong>External entity</strong> — a source or sink outside the system</td><td>A noun: "3PL carrier"</td></tr>
    <tr><td>Labelled arrow</td><td><strong>Data flow</strong></td><td>The data itself: "tracking event", never "sends"</td></tr>
  </tbody>
</table>

<h3>The two errors every grader looks for</h3>
<div class="pitfall"><strong>The black hole.</strong> A process with inputs and no outputs. Data goes in and nothing comes out — either you forgot a flow, or the process does nothing.<br>
<strong>The miracle.</strong> A process with outputs and no inputs, or one whose outputs contain data its inputs never carried. Where did the extra data come from? These two are checked mechanically, and they are free marks lost.</div>

<h3>Level balancing</h3>
<p>A level-0 DFD has one process — the whole system — and is identical to the context diagram. A level-1 DFD explodes that one process into several. <strong>The rule: every flow crossing the boundary at level 0 must appear at level 1, and no new boundary flow may appear.</strong> Adding a flow at level 1 that the context diagram does not have means one of the two diagrams is wrong.</p>

<h3>Worked exercise — TP2, level-1 DFD for order acceptance</h3>
<pre>
  Sales        order data      ┌──────────────┐  validated order   ┌──────────────┐
  Channel ─────────────────────▶│ 1. Screen &  │───────────────────▶│ 2. Reserve   │
  (external)                    │    validate  │                    │    inventory │
                                └──────┬───────┘                    └───┬──────┬───┘
                                       │ auth request                   │      │
  Payment      auth status      ┌──────▼───────┐        reservation      │      │ ATP query
  Gateway ◀────────────────────▶│  (external)  │      ┌─────────────────▶│      ▼
  (external)                    └──────────────┘      │             ╔════════════════╗
                                                      │             ║ D1 Inventory   ║
                                ┌──────────────┐      │             ║    records     ║
                                │ 3. Publish   │◀─────┘             ╚════════════════╝
                                │    stock     │  stock-changed event        ▲
                                └──────┬───────┘                             │ on-hand update
                                       │ sellable quantity          ╔════════════════╗
                                       ▼                            ║ D2 Orders      ║
                                  Sales Channel                     ╚════════════════╝
</pre>
<p><strong>Check it yourself against the two errors.</strong> Process 1 has an input (order data) and outputs (auth request, validated order) — not a black hole. Process 3 outputs <em>sellable quantity</em>, which it could not invent: it reads D1. Had the diagram shown process 3 with only the stock-changed event as input, it would have been a miracle, because a change notification does not contain the quantity.</p>

<h2>Entity-relationship diagram — what things exist, and how they relate</h2>
<p>An ERD is a <strong>logical</strong> model in this course: the things the business deals with, not tables. No primary keys, no foreign keys, no data types — those are design.</p>
<table>
  <thead><tr><th>Element</th><th>Notation</th><th>Rule</th></tr></thead>
  <tbody>
    <tr><td>Entity</td><td>Rectangle, <strong>singular noun</strong></td><td>"Student", not "Students"</td></tr>
    <tr><td>Relationship</td><td>Line, labelled with a verb</td><td>Readable in both directions: a Student <em>enrolls in</em> a Section</td></tr>
    <tr><td>Cardinality</td><td>1, n, or crow's foot at each end</td><td>State it at <strong>both</strong> ends, always</td></tr>
    <tr><td>Optionality</td><td>0..1, 0..n</td><td>"May have none" is different from "has at least one"</td></tr>
  </tbody>
</table>

<h3>Worked exercise — TP1, the registration core</h3>
<pre>
  [Programme] ──1───has───n──▶ [Requirement Group] ──n───includes───n──▶ [Course]
       │1                                                                    │1
       │ enrolls                                                             │ is offered as
       │n                                                                    │n
  [Student] ──1───holds───n──▶ [Enrollment] ──n───is for───1──▶ [Section]
       │1                            0..n                            │1
       │ has                                                         │ meets at
       │0..n                                                         │n
  [Advising Hold]                                          [Meeting Pattern]
</pre>
<p><strong>The cardinality that matters most here is Course ↔ Course.</strong> A course may have prerequisites, and those prerequisites are courses — a <em>recursive</em> relationship, n:n, and it is where the whole prerequisite engine lives. Teams that omit it have drawn a diagram in which BR-02 cannot be expressed.</p>
<div class="callout ok"><strong>The second one worth arguing about: Student ↔ Programme is 1:1 in this model but the real world is 1:n</strong> (double majors, programme changes). Recording that you noticed, and that NRU's regulations make it 1:1 for now, is worth more than silently drawing either one.</div>

<h3>Four mistakes that cost marks</h3>
<div class="pitfall"><strong>1 · Drawing a database schema.</strong> Foreign keys and varchar lengths belong in design, not in a logical ERD.<br>
<strong>2 · Cardinality on one end only.</strong> "1" on the left and nothing on the right says half a fact.<br>
<strong>3 · Plural entity names.</strong> One rectangle describes one thing; the cardinality says how many.<br>
<strong>4 · Mixing DFD and ERD symbols.</strong> A data store is not an entity. They look similar and answer different questions.</div>`,
      `<span class="eyebrow">LAB · Bài L.5</span>
<h2>Data flow diagram — dữ liệu từ đâu tới, đi đâu, nằm lại ở đâu</h2>
<p class="lead">DFD trả lời một câu hỏi mà không mô hình nào khác trả lời: <strong>mỗi mẩu dữ liệu bắt nguồn từ đâu, cái gì biến đổi nó, và giữa các lần biến đổi nó nằm ở đâu?</strong> Nó không thể hiện trình tự và không thể hiện actor thực hiện các bước — đó là việc của swimlane, và lẫn lộn hai thứ là lỗi phổ biến nhất trong LAB này.</p>

<h3>Ký pháp — bốn ký hiệu</h3>
<table>
  <thead><tr><th>Ký hiệu</th><th>Nghĩa</th><th>Đặt tên bằng</th></tr></thead>
  <tbody>
    <tr><td>Hình tròn / hộp bo góc</td><td><strong>Tiến trình</strong> — biến đổi dữ liệu</td><td>Cụm động từ: "Kiểm tra hợp lệ đơn hàng"</td></tr>
    <tr><td>Chữ nhật hở đầu</td><td><strong>Kho dữ liệu</strong> — dữ liệu nằm yên</td><td>Danh từ: "Bản ghi tồn kho"</td></tr>
    <tr><td>Hình vuông</td><td><strong>Thực thể ngoài</strong> — nguồn hoặc đích ngoài hệ thống</td><td>Danh từ: "Hãng 3PL"</td></tr>
    <tr><td>Mũi tên có nhãn</td><td><strong>Luồng dữ liệu</strong></td><td>Chính dữ liệu đó: "sự kiện theo dõi", không bao giờ là "gửi"</td></tr>
  </tbody>
</table>

<h3>Hai lỗi mà người chấm nào cũng soi</h3>
<div class="pitfall"><strong>Hố đen.</strong> Một tiến trình có đầu vào mà không có đầu ra. Dữ liệu đi vào và chẳng có gì đi ra — hoặc bạn quên một luồng, hoặc tiến trình đó chẳng làm gì.<br>
<strong>Phép màu.</strong> Một tiến trình có đầu ra mà không có đầu vào, hoặc đầu ra chứa dữ liệu mà đầu vào chưa từng mang tới. Dữ liệu dư đó ở đâu ra? Hai lỗi này được kiểm một cách máy móc, và để mất điểm vì chúng là mất không.</div>

<h3>Cân bằng giữa các mức</h3>
<p>DFD mức 0 có một tiến trình duy nhất — cả hệ thống — và trùng với context diagram. DFD mức 1 nổ tung tiến trình đó thành nhiều cái. <strong>Luật: mọi luồng cắt ranh giới ở mức 0 đều phải xuất hiện ở mức 1, và không được sinh thêm luồng ranh giới mới.</strong> Thêm một luồng ở mức 1 mà context diagram không có nghĩa là một trong hai sơ đồ sai.</p>

<h3>Bài luyện có lời giải — TP2, DFD mức 1 cho việc tiếp nhận đơn</h3>
<pre>
  Kênh bán    dữ liệu đơn     ┌──────────────┐  đơn đã hợp lệ    ┌──────────────┐
  (ngoài) ─────────────────────▶│ 1. Sàng lọc  │───────────────────▶│ 2. Giữ chỗ   │
                                │    & kiểm tra│                    │    tồn kho   │
                                └──────┬───────┘                    └───┬──────┬───┘
                                       │ yêu cầu duyệt                  │      │
  Cổng        trạng thái duyệt  ┌──────▼───────┐       bản ghi giữ chỗ   │      │ truy vấn ATP
  thanh toán ◀─────────────────▶│   (ngoài)    │      ┌─────────────────▶│      ▼
  (ngoài)                       └──────────────┘      │             ╔════════════════╗
                                                      │             ║ D1 Bản ghi     ║
                                ┌──────────────┐      │             ║    tồn kho     ║
                                │ 3. Đẩy tồn   │◀─────┘             ╚════════════════╝
                                │    về kênh   │  sự kiện đổi tồn            ▲
                                └──────┬───────┘                             │ cập nhật tồn thực
                                       │ số lượng bán được          ╔════════════════╗
                                       ▼                            ║ D2 Đơn hàng    ║
                                    Kênh bán                        ╚════════════════╝
</pre>
<p><strong>Hãy tự kiểm nó bằng hai lỗi trên.</strong> Tiến trình 1 có đầu vào (dữ liệu đơn) và đầu ra (yêu cầu duyệt, đơn đã hợp lệ) — không phải hố đen. Tiến trình 3 xuất ra <em>số lượng bán được</em>, thứ nó không thể tự bịa: nó đọc D1. Nếu sơ đồ vẽ tiến trình 3 chỉ có đầu vào là sự kiện đổi tồn thôi thì đó là phép màu, vì một thông báo thay đổi không chứa số lượng.</p>

<h2>Sơ đồ thực thể–quan hệ — có những thứ gì, và chúng liên hệ ra sao</h2>
<p>Trong môn này, ERD là mô hình <strong>logic</strong>: những thứ nghiệp vụ làm việc cùng, không phải các bảng. Không khoá chính, không khoá ngoại, không kiểu dữ liệu — đó là thiết kế.</p>
<table>
  <thead><tr><th>Thành phần</th><th>Ký pháp</th><th>Luật</th></tr></thead>
  <tbody>
    <tr><td>Thực thể</td><td>Chữ nhật, <strong>danh từ số ít</strong></td><td>"Sinh viên", không phải "Các sinh viên"</td></tr>
    <tr><td>Quan hệ</td><td>Đường nối, ghi nhãn bằng động từ</td><td>Đọc được cả hai chiều: một Sinh viên <em>ghi danh vào</em> một Lớp</td></tr>
    <tr><td>Bản số</td><td>1, n, hoặc chân quạ ở mỗi đầu</td><td>Ghi ở <strong>cả hai</strong> đầu, luôn luôn</td></tr>
    <tr><td>Tính tuỳ chọn</td><td>0..1, 0..n</td><td>"Có thể không có cái nào" khác với "có ít nhất một"</td></tr>
  </tbody>
</table>

<h3>Bài luyện có lời giải — TP1, lõi đăng ký môn</h3>
<pre>
  [Chương trình] ─1──có──n─▶ [Nhóm yêu cầu] ─n──gồm──n─▶ [Môn học]
       │1                                                     │1
       │ theo học                                             │ được mở thành
       │n                                                     │n
  [Sinh viên] ─1──giữ──n─▶ [Lượt ghi danh] ─n──thuộc về──1─▶ [Lớp học phần]
       │1                        0..n                             │1
       │ có                                                       │ học vào
       │0..n                                                      │n
  [Khoá cố vấn]                                           [Lịch học]
</pre>
<p><strong>Bản số quan trọng nhất ở đây là Môn học ↔ Môn học.</strong> Một môn có thể có môn tiên quyết, mà môn tiên quyết cũng là môn học — một quan hệ <em>đệ quy</em>, n:n, và đó chính là nơi cả bộ máy kiểm tiên quyết sống. Nhóm bỏ sót nó là đã vẽ một sơ đồ mà BR-02 không diễn đạt được.</p>
<div class="callout ok"><strong>Cái thứ hai đáng tranh luận: Sinh viên ↔ Chương trình ở mô hình này là 1:1 nhưng đời thật là 1:n</strong> (học song bằng, đổi ngành). Ghi lại rằng bạn đã nhận ra điều đó, và rằng quy chế của NRU hiện đặt nó là 1:1, đáng giá hơn là lẳng lặng vẽ một trong hai.</div>

<h3>Bốn lỗi hay bị trừ điểm</h3>
<div class="pitfall"><strong>1 · Vẽ schema cơ sở dữ liệu.</strong> Khoá ngoại và độ dài varchar thuộc về thiết kế, không thuộc ERD logic.<br>
<strong>2 · Bản số chỉ ghi một đầu.</strong> Ghi "1" bên trái mà bên phải để trống là nói được nửa sự thật.<br>
<strong>3 · Đặt tên thực thể số nhiều.</strong> Một chữ nhật mô tả một thứ; bản số mới nói có bao nhiêu.<br>
<strong>4 · Trộn ký hiệu DFD với ERD.</strong> Kho dữ liệu không phải thực thể. Chúng trông giống nhau và trả lời hai câu hỏi khác nhau.</div>`,
    ),
  ].join('\n'),
};

/* ─────────── L.6 — decision table / tree, dialog map, DAR + checklist ─────────── */
const L6 = {
  title: 'L.6 — Decision tables, dialog maps & the LAB checklist|||L.6 — Bảng quyết định, dialog map & bảng tự kiểm LAB',
  slug: 'swr302-lab-decision-table',
  type: 'DOCUMENT',
  description: 'Bảng quyết định (2ⁿ tổ hợp, rút gọn), cây quyết định, dialog map và bảng Display-Action-Response. Bài luyện trên TP2 (điều kiện chọn hãng vận chuyển) và bảng tự kiểm trước khi nộp LAB.',
  content: [
    bi(
      `<span class="eyebrow">LAB · Lesson L.6</span>
<h2>Decision table — the model that finds the case nobody thought of</h2>
<p class="lead">Use one when several conditions combine to determine what the system does. Its whole value is mechanical: <strong>n binary conditions produce 2ⁿ combinations, and the table forces you to write an outcome for every one.</strong> The combination you had not considered is the one that becomes a production defect.</p>

<h3>Worked exercise — TP2, is a carrier eligible?</h3>
<p>BR-11 says a carrier is eligible only if it is active, serves the destination postcode, and accepts the parcel's weight and dimensions. Three conditions, eight combinations:</p>
<table>
  <thead><tr><th>Rule</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th></tr></thead>
  <tbody>
    <tr><th>Carrier is active</th><td>Y</td><td>Y</td><td>Y</td><td>Y</td><td>N</td><td>N</td><td>N</td><td>N</td></tr>
    <tr><th>Serves the postcode</th><td>Y</td><td>Y</td><td>N</td><td>N</td><td>Y</td><td>Y</td><td>N</td><td>N</td></tr>
    <tr><th>Accepts weight &amp; dimensions</th><td>Y</td><td>N</td><td>Y</td><td>N</td><td>Y</td><td>N</td><td>Y</td><td>N</td></tr>
    <tr><th><strong>Eligible — request a quote</strong></th><td><strong>X</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
    <tr><th>Ineligible — show reason "parcel too large"</th><td></td><td>X</td><td></td><td>X</td><td></td><td></td><td></td><td></td></tr>
    <tr><th>Ineligible — show reason "does not serve area"</th><td></td><td></td><td>X</td><td>X</td><td></td><td></td><td></td><td></td></tr>
    <tr><th>Not shown at all — carrier inactive</th><td></td><td></td><td></td><td></td><td>X</td><td>X</td><td>X</td><td>X</td></tr>
  </tbody>
</table>
<p><strong>Rule 4 is what the table is for.</strong> Both the area and the size fail. Does the operator see one reason or both? The prose in BR-11 does not say; the table makes the gap impossible to ignore. Here the answer chosen was "both", because an operator who repacks to fix the size and re-runs will otherwise hit the second refusal and lose another cycle.</p>
<h3>Collapsing the table</h3>
<p>Rules 5–8 all produce the same outcome regardless of the other two conditions, so they collapse into one column with dashes:</p>
<table>
  <thead><tr><th>Rule</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th></tr></thead>
  <tbody>
    <tr><th>Carrier is active</th><td>Y</td><td>Y</td><td>Y</td><td>Y</td><td>N</td></tr>
    <tr><th>Serves the postcode</th><td>Y</td><td>Y</td><td>N</td><td>N</td><td>–</td></tr>
    <tr><th>Accepts weight &amp; dimensions</th><td>Y</td><td>N</td><td>Y</td><td>N</td><td>–</td></tr>
    <tr><th>Outcome</th><td>Quote</td><td>Too large</td><td>No service</td><td>Both reasons</td><td>Not shown</td></tr>
  </tbody>
</table>
<div class="callout warn"><strong>Collapse only after you have written all 2ⁿ columns.</strong> Collapsing while building is how the unconsidered combination stays unconsidered.</div>

<h3>Decision tree — same content, different reader</h3>
<p>A tree shows the same logic as a sequence of questions. Use a <strong>table</strong> for completeness checking and for handing to a developer; use a <strong>tree</strong> when a stakeholder must follow the logic in a meeting. The tree is easier to read and easier to leave incomplete — so build the table first, then draw the tree from it.</p>

<h2>Dialog map and Display-Action-Response</h2>
<p>A <strong>dialog map</strong> is a state diagram whose states are screens and whose transitions are user actions. It answers "can the user get from here to there, and can they get back?" and it exposes dead ends — a screen with no way out.</p>
<p>A <strong>Display-Action-Response table</strong> specifies one screen in detail: for each element, what is displayed, what the user can do, and how the system responds.</p>
<table>
  <thead><tr><th>Element</th><th>Display</th><th>Action</th><th>Response</th></tr></thead>
  <tbody>
    <tr><td>Accept routing</td><td>Enabled when the order status is Routed</td><td>Click</td><td>Confirm the shipments, set status Routed, release to wave planning (UC-04 step 7)</td></tr>
    <tr><td>Override…</td><td>Enabled for the Fulfillment Manager role only (BR-19)</td><td>Click</td><td>Open the centre selection with a mandatory reason field (UC-04 flow 4.2)</td></tr>
    <tr><td>Score table</td><td>One row per candidate centre, winner highlighted</td><td>Read-only</td><td>—</td></tr>
  </tbody>
</table>
<p>A DAR table is where the "Enabled when…" conditions get written down. They are requirements, and they almost never appear anywhere else.</p>

<hr />

<h2>The LAB submission checklist</h2>
<p>Run this before handing in any diagram.</p>
<h3>Every diagram</h3>
<ol>
<li>Every box, arrow and lane is <strong>labelled</strong>.</li>
<li>One level of abstraction — no "Process the order" beside "Click Save".</li>
<li>The <strong>system boundary</strong> is drawn where one is meaningful.</li>
<li>At least one <strong>failure, rejection or exception</strong> path is shown.</li>
<li>A <strong>legend</strong> exists wherever you deviated from standard notation.</li>
<li>The diagram has a <strong>title</strong> and states which system and which release it describes.</li>
<li>Exported as an image <em>and</em> kept as an editable source file.</li>
</ol>
<h3>Per model type</h3>
<table>
  <thead><tr><th>Model</th><th>The check that catches most errors</th></tr></thead>
  <tbody>
    <tr><td>Context diagram</td><td>Exactly one circle; every arrow names <em>data</em>, not an action</td></tr>
    <tr><td>Swimlane</td><td>Lanes are roles, not departments; every decision branch is labelled</td></tr>
    <tr><td>State diagram</td><td>No state name ends in "-ing"; at least one terminal state; transitions show <code>event [guard]</code></td></tr>
    <tr><td>DFD</td><td>No black holes, no miracles; levels balance against the context diagram</td></tr>
    <tr><td>ERD</td><td>Cardinality at both ends; singular entity names; recursive relationships not omitted</td></tr>
    <tr><td>Decision table</td><td>All 2ⁿ combinations written before collapsing</td></tr>
    <tr><td>Dialog map</td><td>No screen without a way back</td></tr>
  </tbody>
</table>
<div class="note-ct">One last habit from Chapter 17: before you submit, hand your diagram to someone who did not draw it and ask them to <strong>read it aloud</strong>. Every place they hesitate is a place you did not label. It takes five minutes and it finds more defects than another five minutes of drawing.</div>`,
      `<span class="eyebrow">LAB · Bài L.6</span>
<h2>Bảng quyết định — mô hình tìm ra trường hợp chưa ai nghĩ tới</h2>
<p class="lead">Dùng nó khi nhiều điều kiện kết hợp lại quyết định hệ thống làm gì. Toàn bộ giá trị của nó mang tính máy móc: <strong>n điều kiện nhị phân sinh ra 2ⁿ tổ hợp, và cái bảng buộc bạn viết kết cục cho từng cái.</strong> Tổ hợp bạn chưa nghĩ tới chính là cái sẽ thành lỗi trên production.</p>

<h3>Bài luyện có lời giải — TP2, hãng vận chuyển có đủ điều kiện không?</h3>
<p>BR-11 nói một hãng chỉ đủ điều kiện khi nó đang hoạt động, có phục vụ mã bưu chính đích, và nhận được khối lượng cùng kích thước kiện hàng. Ba điều kiện, tám tổ hợp:</p>
<table>
  <thead><tr><th>Luật</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th></tr></thead>
  <tbody>
    <tr><th>Hãng đang hoạt động</th><td>C</td><td>C</td><td>C</td><td>C</td><td>K</td><td>K</td><td>K</td><td>K</td></tr>
    <tr><th>Phục vụ mã bưu chính</th><td>C</td><td>C</td><td>K</td><td>K</td><td>C</td><td>C</td><td>K</td><td>K</td></tr>
    <tr><th>Nhận khối lượng &amp; kích thước</th><td>C</td><td>K</td><td>C</td><td>K</td><td>C</td><td>K</td><td>C</td><td>K</td></tr>
    <tr><th><strong>Đủ điều kiện — xin báo giá</strong></th><td><strong>X</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
    <tr><th>Không đủ — báo "kiện quá khổ"</th><td></td><td>X</td><td></td><td>X</td><td></td><td></td><td></td><td></td></tr>
    <tr><th>Không đủ — báo "không phục vụ khu vực"</th><td></td><td></td><td>X</td><td>X</td><td></td><td></td><td></td><td></td></tr>
    <tr><th>Không hiện ra — hãng ngừng hoạt động</th><td></td><td></td><td></td><td></td><td>X</td><td>X</td><td>X</td><td>X</td></tr>
  </tbody>
</table>
<p><strong>Luật 4 mới là lý do cái bảng tồn tại.</strong> Cả khu vực lẫn kích thước đều không đạt. Người vận hành thấy một lý do hay cả hai? Văn xuôi của BR-11 không nói; cái bảng làm khoảng trống đó không thể lờ đi. Ở đây câu trả lời được chọn là "cả hai", vì người vận hành đóng gói lại cho vừa kích thước rồi chạy lại sẽ đâm vào lời từ chối thứ hai và mất thêm một vòng.</p>
<h3>Rút gọn bảng</h3>
<p>Luật 5–8 đều cho cùng kết cục bất kể hai điều kiện kia, nên gộp lại thành một cột với dấu gạch:</p>
<table>
  <thead><tr><th>Luật</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th></tr></thead>
  <tbody>
    <tr><th>Hãng đang hoạt động</th><td>C</td><td>C</td><td>C</td><td>C</td><td>K</td></tr>
    <tr><th>Phục vụ mã bưu chính</th><td>C</td><td>C</td><td>K</td><td>K</td><td>–</td></tr>
    <tr><th>Nhận khối lượng &amp; kích thước</th><td>C</td><td>K</td><td>C</td><td>K</td><td>–</td></tr>
    <tr><th>Kết cục</th><td>Báo giá</td><td>Quá khổ</td><td>Không phục vụ</td><td>Cả hai lý do</td><td>Không hiện</td></tr>
  </tbody>
</table>
<div class="callout warn"><strong>Chỉ rút gọn SAU KHI đã viết đủ 2ⁿ cột.</strong> Vừa dựng vừa rút gọn chính là cách khiến tổ hợp chưa nghĩ tới mãi mãi không được nghĩ tới.</div>

<h3>Cây quyết định — cùng nội dung, khác người đọc</h3>
<p>Cây thể hiện cùng logic đó dưới dạng một chuỗi câu hỏi. Dùng <strong>bảng</strong> để kiểm tính đầy đủ và để đưa cho lập trình viên; dùng <strong>cây</strong> khi một stakeholder phải theo dõi logic ngay trong cuộc họp. Cây dễ đọc hơn và cũng dễ để sót hơn — nên hãy dựng bảng trước, rồi vẽ cây từ bảng.</p>

<h2>Dialog map và bảng Display-Action-Response</h2>
<p><strong>Dialog map</strong> là một sơ đồ trạng thái mà trạng thái là các màn hình còn chuyển tiếp là hành động của người dùng. Nó trả lời "người dùng đi từ đây tới kia được không, và quay lại được không?" và nó phơi ra ngõ cụt — màn hình không có lối ra.</p>
<p><strong>Bảng Display-Action-Response</strong> đặc tả chi tiết một màn hình: với mỗi thành phần, hiển thị cái gì, người dùng làm được gì, và hệ thống phản hồi ra sao.</p>
<table>
  <thead><tr><th>Thành phần</th><th>Hiển thị</th><th>Hành động</th><th>Phản hồi</th></tr></thead>
  <tbody>
    <tr><td>Chấp nhận định tuyến</td><td>Bật khi trạng thái đơn là Routed</td><td>Bấm</td><td>Chốt các shipment, đặt trạng thái Routed, chuyển sang lập đợt lấy hàng (UC-04 bước 7)</td></tr>
    <tr><td>Ghi đè…</td><td>Chỉ bật với vai Quản lý hoàn tất đơn (BR-19)</td><td>Bấm</td><td>Mở phần chọn trung tâm kèm ô lý do bắt buộc (UC-04 luồng 4.2)</td></tr>
    <tr><td>Bảng điểm</td><td>Mỗi trung tâm ứng viên một dòng, cái thắng được tô</td><td>Chỉ đọc</td><td>—</td></tr>
  </tbody>
</table>
<p>Bảng DAR là nơi những điều kiện "Bật khi…" được viết ra. Chúng là yêu cầu, và gần như không bao giờ xuất hiện ở chỗ nào khác.</p>

<hr />

<h2>Bảng tự kiểm trước khi nộp LAB</h2>
<p>Chạy bảng này trước khi nộp bất kỳ sơ đồ nào.</p>
<h3>Mọi sơ đồ</h3>
<ol>
<li>Mọi hộp, mũi tên và lane đều <strong>có nhãn</strong>.</li>
<li>Một mức trừu tượng — không để "Xử lý đơn hàng" cạnh "Bấm nút Lưu".</li>
<li><strong>Ranh giới hệ thống</strong> được vẽ ở nơi nó có nghĩa.</li>
<li>Có ít nhất một đường <strong>hỏng, từ chối hoặc ngoại lệ</strong>.</li>
<li>Có <strong>chú giải</strong> ở mọi chỗ bạn lệch khỏi ký pháp chuẩn.</li>
<li>Sơ đồ có <strong>tiêu đề</strong> và nói rõ nó mô tả hệ thống nào, bản phát hành nào.</li>
<li>Xuất ra ảnh <em>và</em> giữ lại file nguồn sửa được.</li>
</ol>
<h3>Theo từng loại mô hình</h3>
<table>
  <thead><tr><th>Mô hình</th><th>Phép kiểm bắt được nhiều lỗi nhất</th></tr></thead>
  <tbody>
    <tr><td>Context diagram</td><td>Đúng một vòng tròn; mọi mũi tên gọi tên <em>dữ liệu</em>, không phải hành động</td></tr>
    <tr><td>Swimlane</td><td>Lane là vai trò, không phải phòng ban; mọi nhánh quyết định đều có nhãn</td></tr>
    <tr><td>Sơ đồ trạng thái</td><td>Không tên trạng thái nào bắt đầu bằng "Đang"; có ít nhất một trạng thái kết thúc; chuyển tiếp ghi <code>sự kiện [điều kiện]</code></td></tr>
    <tr><td>DFD</td><td>Không hố đen, không phép màu; các mức cân bằng với context diagram</td></tr>
    <tr><td>ERD</td><td>Bản số ở cả hai đầu; tên thực thể số ít; không bỏ sót quan hệ đệ quy</td></tr>
    <tr><td>Bảng quyết định</td><td>Viết đủ 2ⁿ tổ hợp rồi mới rút gọn</td></tr>
    <tr><td>Dialog map</td><td>Không màn hình nào thiếu đường quay lại</td></tr>
  </tbody>
</table>
<div class="note-ct">Một thói quen cuối lấy từ chương 17: trước khi nộp, hãy đưa sơ đồ cho một người không vẽ nó và nhờ họ <strong>đọc to lên</strong>. Mỗi chỗ họ ngập ngừng là một chỗ bạn quên ghi nhãn. Việc đó tốn năm phút và tìm ra nhiều lỗi hơn năm phút vẽ thêm.</div>`,
    ),
  ].join('\n'),
};

export default {
  title: 'LAB (10%) — Drawing requirements models|||LAB (10%) — Vẽ mô hình yêu cầu',
  description: 'Phần thực hành chiếm 10% điểm môn (CLO5–6): vẽ context diagram, swimlane, sơ đồ trạng thái, DFD, ERD, bảng quyết định và dialog map. Mỗi bài có ký pháp, bài luyện lấy từ chính đề TP1/TP2 kèm lời giải, và những lỗi hay bị trừ điểm. Đây cũng là phần luyện trực tiếp cho Practical Exam (25%).',
  lessons: [L1, L2, L3, L4, L5, L6],
};
