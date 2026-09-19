/**
 * SWR302 · Section "LAB (10%)" — phần thực hành vẽ mô hình yêu cầu (CLO5–6),
 * cột điểm nêu trong bảng điểm chính thức ở bài 0.2.
 *
 * Slide do CHÍNH DỰ ÁN NÀY dựng (môn không có deck LAB gốc): nguồn ở
 * scripts/slides-src/swr302-lab{1..6}.mjs → render bằng scripts/_render-slides.mjs
 * → upload images/academy/SWR302/v1/labL{1..6}/NNN.webp.
 * Sửa slide thì phải render sang prefix MỚI (v2…) — Cloudflare giữ cache bytes
 * của key đã ghi đè.
 */
import { registerDeck, walk, bi } from './_slides.mjs';

const W = 1280, H = 720;
registerDeck('labL1', { code: 'LAB 1', en: 'Choosing the right model',      vi: 'Chọn mô hình nào',        total: 9, w: W, h: H });
registerDeck('labL2', { code: 'LAB 2', en: 'Context diagram',               vi: 'Context diagram',         total: 9, w: W, h: H });
registerDeck('labL3', { code: 'LAB 3', en: 'Swimlane diagram',              vi: 'Swimlane',                total: 9, w: W, h: H });
registerDeck('labL4', { code: 'LAB 4', en: 'State-transition diagram',      vi: 'Sơ đồ chuyển trạng thái', total: 9, w: W, h: H });
registerDeck('labL5', { code: 'LAB 5', en: 'Data flow & entity-relationship', vi: 'DFD & ERD',             total: 9, w: W, h: H });
registerDeck('labL6', { code: 'LAB 6', en: 'Decision tables & dialog maps', vi: 'Bảng quyết định',         total: 9, w: W, h: H });

/* ─────────── L.1 ─────────── */
const L1 = {
  title: 'L.1 — Which model answers which question|||L.1 — Mô hình nào trả lời câu hỏi nào',
  slug: 'swr302-lab-tong-quan',
  type: 'DOCUMENT',
  isFreePreview: true,
  description: 'LAB chiếm 10% điểm môn (CLO5–6). Bảng chọn mô hình theo câu hỏi cần trả lời, năm quy tắc đúng cho MỌI sơ đồ, và cách LAB nối vào Assignment lẫn Practical Exam. 9 slide.',
  content: [
    bi(
      `<span class="eyebrow">LAB · Lesson L.1 · Start here</span>
<h2>The LAB component — 10% of your grade</h2>
<p class="lead">The LAB is the <strong>drawing</strong> half of this course. It is assessed against CLO5 and CLO6, and it is the only preparation that works for the Practical Exam — which hands you a scenario and 85 minutes to produce a model.</p>
<p>Every exercise below is taken from assignment topic <strong>TP1</strong> or <strong>TP2</strong>, so the models you practise here are the models your team has to submit.</p>`,
      `<span class="eyebrow">LAB · Bài L.1 · Bắt đầu ở đây</span>
<h2>Phần LAB — 10% điểm môn</h2>
<p class="lead">LAB là nửa <strong>vẽ</strong> của môn học. Nó chấm theo CLO5 và CLO6, và là cách luyện duy nhất có tác dụng cho Practical Exam — bài thi đưa bạn một tình huống và 85 phút để làm ra một mô hình.</p>
<p>Mọi bài luyện dưới đây lấy từ đề <strong>TP1</strong> hoặc <strong>TP2</strong>, nên mô hình bạn tập ở đây đúng là mô hình nhóm bạn phải nộp.</p>`,
    ),
    walk('labL1', [
      [1, 'LAB — vẽ mô hình yêu cầu',
        `<p>Title slide. LAB is worth 10% and maps to CLO5–CLO6. Together with Assignment (20%) and the Practical Exam (25%), the same drawing skill carries <strong>55% of the course</strong>.</p>`,
        `<p>Slide bìa. LAB chiếm 10% và ánh xạ CLO5–CLO6. Cộng với Assignment (20%) và Practical Exam (25%), cùng một kỹ năng vẽ này gánh <strong>55% điểm môn</strong>.</p>`],
      [2, 'LAB là gì trong SWR302?',
        `<p>The Assignment asks for a whole requirements package; the LAB asks for <strong>one correct model at a time</strong> — and for you to justify the choice. That second half is what is actually being marked.</p><p>The Practical Exam cannot be revised for by reading. Each LAB session is a timed rehearsal for it.</p>`,
        `<p>Assignment đòi cả một bộ tài liệu; LAB đòi <strong>một mô hình đúng, mỗi lần một cái</strong> — và đòi bạn biện minh cho lựa chọn đó. Chính vế sau mới là thứ được chấm.</p><p>Practical Exam không ôn bằng cách đọc được. Mỗi buổi LAB là một lượt tổng duyệt có tính giờ.</p>`],
      [3, 'Chọn theo CÂU HỎI, không theo thói quen',
        `<p>The commonest LAB mistake is drawing the model you find easiest rather than the one the question needs. Chapter 12 makes the choice mechanical: pick by the question you must answer.</p><p>Memorise this table. In the Practical Exam the first mark is for choosing the right model — before you draw a single box.</p>`,
        `<p>Lỗi LAB phổ biến nhất là vẽ cái mô hình mình thấy dễ nhất thay vì cái câu hỏi đang cần. Chương 12 biến lựa chọn này thành máy móc: chọn theo câu hỏi bạn phải trả lời.</p><p>Hãy thuộc bảng này. Trong Practical Exam, điểm đầu tiên là điểm chọn đúng mô hình — trước khi vẽ cái hộp nào.</p>`],
      [4, 'Cái bẫy: Swimlane ≠ DFD',
        `<p>Both are boxes joined by arrows, so they look interchangeable. They are not. A swimlane shows <em>who acts and when</em>; a DFD shows <em>what data moves and where it rests</em>.</p><p>A DFD with actors in it, or a swimlane with data stores in it, loses marks even when the picture is otherwise correct — because it answers a question nobody asked.</p>`,
        `<p>Cả hai đều là hộp nối bằng mũi tên nên trông như thay thế được cho nhau. Không phải vậy. Swimlane cho thấy <em>ai hành động và lúc nào</em>; DFD cho thấy <em>dữ liệu nào di chuyển và nằm lại ở đâu</em>.</p><p>DFD có actor, hay swimlane có kho dữ liệu, đều mất điểm dù bức hình còn lại đúng hết — vì nó trả lời một câu hỏi không ai hỏi.</p>`],
      [5, 'Quy tắc 1 — Ghi nhãn TẤT CẢ',
        `<p>An unlabelled arrow is the single commonest mark lost in this course. The grader cannot tell what flows along it, so they cannot tell whether the model is right.</p><p>Compare the two rows on the slide: same shapes, same layout — only the second one is a requirements model.</p>`,
        `<p>Mũi tên không nhãn là chỗ mất điểm nhiều nhất của cả môn. Người chấm không biết cái gì chảy trên đó, nên cũng không biết mô hình đúng hay sai.</p><p>So hai hàng trên slide: cùng hình dạng, cùng bố cục — chỉ hàng thứ hai mới là một mô hình yêu cầu.</p>`],
      [6, 'Quy tắc 2 & 3',
        `<p><strong>One level of abstraction.</strong> If two boxes are not comparable in size, one of them belongs on a different diagram. "Process the order" and "Click Save" never share a page.</p><p><strong>Draw the boundary.</strong> A diagram with no boundary box says the author never decided the scope — and scope is what the whole first half of this course is about.</p>`,
        `<p><strong>Một mức trừu tượng.</strong> Nếu hai hộp không tương đương độ lớn thì một cái thuộc về sơ đồ khác. "Xử lý đơn hàng" và "Bấm nút Lưu" không bao giờ ở chung một trang.</p><p><strong>Vẽ ranh giới.</strong> Sơ đồ không có khung ranh giới nghĩa là tác giả chưa từng quyết định phạm vi — mà phạm vi chính là thứ cả nửa đầu môn học nói về.</p>`],
      [7, 'Quy tắc 4 & 5',
        `<p><strong>Show the unhappy path.</strong> A model with only the success path models a world that does not exist. Every diagram in this course should contain at least one failure, rejection or exception branch.</p><p><strong>Add a legend when you invent a symbol.</strong> You may deviate from standard notation; you may not deviate silently.</p>`,
        `<p><strong>Vẽ cả đường không thuận.</strong> Mô hình chỉ có đường thành công là mô hình của một thế giới không tồn tại. Mọi sơ đồ trong môn này nên có ít nhất một nhánh hỏng, từ chối hoặc ngoại lệ.</p><p><strong>Có chú giải khi tự chế ký hiệu.</strong> Bạn được phép lệch chuẩn; bạn không được phép lệch trong im lặng.</p>`],
      [8, 'Công cụ & nộp gì',
        `<p>draw.io is free and browser-based, which is why it is the recommendation. Visual Paradigm Community and BOUML both work.</p><p>Submit the exported image <strong>and</strong> the editable source file. At a check-in the lecturer often asks a group to change a diagram live — a team with only a flattened PNG cannot.</p>`,
        `<p>draw.io miễn phí và chạy trên trình duyệt, nên đó là khuyến nghị. Visual Paradigm Community và BOUML đều dùng được.</p><p>Nộp <strong>cả</strong> ảnh xuất ra <strong>và</strong> file nguồn sửa được. Ở buổi kiểm tra thầy hay bắt sửa sơ đồ ngay tại chỗ — nhóm chỉ có PNG dẹt thì chịu.</p>`],
      [9, 'LAB nuôi Assignment, và nuôi cả bài thi',
        `<p>The three components are not three separate workloads. The context diagram you draw in L.2 goes into your SRS §2.1. The state model in L.4 is the Order Status entry in your data dictionary. The decision table in L.6 is BR-11.</p><p>Doing the LAB properly means the Assignment is already half written — and the Practical Exam is a rehearsal you have already run six times.</p>`,
        `<p>Ba cột điểm không phải ba khối việc riêng. Context diagram bạn vẽ ở L.2 đi thẳng vào SRS §2.1. Mô hình trạng thái ở L.4 chính là mục Order Status trong data dictionary. Bảng quyết định ở L.6 chính là BR-11.</p><p>Làm LAB tử tế nghĩa là Assignment đã viết xong một nửa — và Practical Exam là buổi tổng duyệt bạn đã chạy sáu lần rồi.</p>`],
    ]),
  ].join('\n'),
};

/* ─────────── L.2 ─────────── */
const L2 = {
  title: 'L.2 — Context diagram & ecosystem map|||L.2 — Context diagram & ecosystem map',
  slug: 'swr302-lab-context-diagram',
  type: 'DOCUMENT',
  description: 'Ba ký hiệu, luật "vòng tròn không có ruột", bài luyện đầy đủ trên đề TP2 (OMFS) và bốn lỗi mất điểm. Kèm so sánh context diagram với ecosystem map. 9 slide.',
  content: [
    bi(
      `<span class="eyebrow">LAB · Lesson L.2</span>
<h2>Context diagram — the system boundary in one picture</h2>
<p class="lead">The simplest model in the course, and the one most worth getting right: every scope argument for the rest of the project is settled by it.</p>`,
      `<span class="eyebrow">LAB · Bài L.2</span>
<h2>Context diagram — ranh giới hệ thống trong một bức hình</h2>
<p class="lead">Mô hình đơn giản nhất môn học, và là cái đáng làm đúng nhất: mọi tranh cãi về phạm vi suốt phần còn lại của dự án đều được nó phân xử.</p>`,
    ),
    walk('labL2', [
      [1, 'Context diagram',
        `<p>Title slide. The worked exercise uses assignment topic TP2 — the Order Management and Fulfillment System.</p>`,
        `<p>Slide bìa. Bài luyện dùng đề TP2 — Hệ thống Quản lý Đơn hàng &amp; Hoàn tất đơn.</p>`],
      [2, 'Nó trả lời ĐÚNG MỘT câu hỏi',
        `<p>What is inside our system, and what is outside it. That is the whole job.</p><p>The grader opens "Limitations and Exclusions" in your Vision &amp; Scope, then checks it against this diagram. If the document says the storefront is out of scope but the diagram puts it inside the circle, one of them is wrong and both lose marks.</p>`,
        `<p>Cái gì nằm trong hệ thống, cái gì nằm ngoài. Đó là toàn bộ nhiệm vụ của nó.</p><p>Người chấm mở mục "Limitations and Exclusions" trong Vision &amp; Scope của bạn rồi đối chiếu với sơ đồ này. Nếu tài liệu nói storefront ngoài phạm vi mà sơ đồ lại đặt nó trong vòng tròn thì một trong hai sai, và cả hai cùng mất điểm.</p>`],
      [3, 'Chỉ có BA ký hiệu',
        `<p>One circle, rectangles around it, labelled arrows between them. Nothing else.</p><p>The arrow label is the part people get wrong: name <strong>the data</strong>, not the action. "order data" is a flow; "places an order" is not.</p>`,
        `<p>Một vòng tròn, các hình chữ nhật quanh nó, mũi tên có nhãn nối chúng. Không gì khác.</p><p>Nhãn mũi tên là chỗ người ta hay sai: gọi tên <strong>dữ liệu</strong>, không phải hành động. "dữ liệu đơn hàng" là một luồng; "đặt hàng" thì không.</p>`],
      [4, 'Vòng tròn KHÔNG có ruột',
        `<p>No processes, no databases, no screens inside the circle. If you have drawn boxes in there, you have drawn a level-1 data flow diagram — a different exercise, covered in L.5.</p><p>Splitting the system into "OMFS core" and "OMFS reporting" is the usual way this goes wrong. It abandons the one job the diagram had.</p>`,
        `<p>Không tiến trình, không cơ sở dữ liệu, không màn hình bên trong vòng tròn. Nếu bạn đã vẽ hộp trong đó thì bạn đang vẽ data flow diagram mức 1 — bài khác, nằm ở L.5.</p><p>Tách hệ thống thành "OMFS lõi" và "OMFS báo cáo" là cách hỏng thường gặp. Nó vứt bỏ nhiệm vụ duy nhất của sơ đồ.</p>`],
      [5, 'Bài luyện TP2 · Bước 1 — liệt kê thực thể ngoài',
        `<p>Anything that sends data to, or receives data from, the system and is not part of it. Ten of them for OMFS: six human roles and four systems.</p><p>Work from the brief, not from memory. TP2 names the marketplaces, the 3PL carriers and the payment gateway explicitly — an entity named in the brief and missing from your diagram is an automatic deduction.</p>`,
        `<p>Bất cứ thứ gì gửi dữ liệu tới hoặc nhận dữ liệu từ hệ thống mà không thuộc hệ thống. OMFS có mười: sáu vai người và bốn hệ thống.</p><p>Làm từ đề bài, đừng làm từ trí nhớ. TP2 gọi tên sàn TMĐT, hãng 3PL và cổng thanh toán rất rõ — một thực thể có trong đề mà thiếu trong sơ đồ là mất điểm hiển nhiên.</p>`],
      [6, 'Bài luyện TP2 · Bước 2 — đặt tên theo DỮ LIỆU',
        `<p>Read each arrow aloud as a noun phrase: "order data", "authorization status", "rate request", "sellable quantity". If it reads as a verb, rewrite it.</p><p>Direction matters as much as the label. The sales channel both sends orders <em>in</em> and receives stock quantities <em>out</em> — two arrows, not one double-headed one.</p>`,
        `<p>Đọc to từng mũi tên như một cụm danh từ: "dữ liệu đơn hàng", "trạng thái uỷ quyền", "yêu cầu báo giá", "số lượng bán được". Nếu đọc ra thành động từ thì viết lại.</p><p>Chiều mũi tên quan trọng ngang cái nhãn. Kênh bán vừa gửi đơn <em>vào</em> vừa nhận số tồn <em>ra</em> — hai mũi tên, không phải một mũi tên hai đầu.</p>`],
      [7, 'Bước 3 — đối chiếu ranh giới với ĐỀ BÀI',
        `<p>TP2 says the storefront "effectively handles customer browsing". That sentence is the lecturer telling you not to specify it.</p><p>So the storefront is a rectangle outside the circle, and catalogue, pricing, promotions and checkout are all out of scope. Putting any of them inside is the single most common TP2 scope error — and this diagram is where it becomes visible.</p>`,
        `<p>TP2 nói storefront "xử lý tốt việc khách duyệt hàng". Câu đó là thầy đang bảo bạn đừng đặc tả nó.</p><p>Vậy storefront là hình chữ nhật ngoài vòng tròn, và danh mục, giá, khuyến mãi, thanh toán đều ngoài phạm vi. Đưa bất kỳ cái nào vào trong là lỗi phạm vi phổ biến nhất của TP2 — và sơ đồ này chính là chỗ nó lộ ra.</p>`],
      [8, 'Ecosystem map — khi nào vẽ nó thay thế',
        `<p>A context diagram only shows flows to and from <em>you</em>. An ecosystem map shows flows between <em>any</em> two systems, plus who owns each one.</p><p>Draw it when the surrounding systems talk to each other behind your back — exactly the TP2 situation, where a marketplace already syncs with the storefront's catalogue. That hidden link is why a stock change can reach a customer by a path OMFS does not control.</p>`,
        `<p>Context diagram chỉ thể hiện luồng tới và đi từ <em>bạn</em>. Ecosystem map thể hiện luồng giữa <em>bất kỳ</em> hai hệ thống nào, kèm ai sở hữu từng cái.</p><p>Vẽ nó khi các hệ thống xung quanh nói chuyện với nhau sau lưng bạn — đúng tình huống TP2, nơi một sàn TMĐT vốn đã đồng bộ với danh mục của storefront. Chính mắt xích ẩn đó khiến một thay đổi tồn kho có thể tới khách theo con đường OMFS không kiểm soát.</p>`],
      [9, 'Bốn lỗi mất điểm',
        `<p>Unlabelled arrows · control flow instead of data flow · two circles · a system named in the brief but missing from the diagram.</p><p>All four are checked mechanically and none of them requires domain knowledge to avoid. Run your own diagram against this list before you submit.</p>`,
        `<p>Mũi tên không nhãn · luồng điều khiển thay vì luồng dữ liệu · hai vòng tròn · một hệ thống có trong đề mà thiếu trong sơ đồ.</p><p>Cả bốn đều được kiểm một cách máy móc và không cái nào đòi kiến thức chuyên ngành để tránh. Hãy tự soi sơ đồ của mình theo danh sách này trước khi nộp.</p>`],
    ]),
  ].join('\n'),
};

/* ─────────── L.3 ─────────── */
const L3 = {
  title: 'L.3 — Swimlane: who does what, in what order|||L.3 — Swimlane: ai làm gì, theo thứ tự nào',
  slug: 'swr302-lab-swimlane',
  type: 'DOCUMENT',
  description: 'Lane theo VAI TRÒ chứ không theo phòng ban; đếm điểm bàn giao là cách biến "quy trình chậm" thành bằng chứng. Bài luyện TP1 hiện tại vs tương lai, và gap analysis. 9 slide.',
  content: [
    bi(
      `<span class="eyebrow">LAB · Lesson L.3</span>
<h2>Swimlane — the diagram that finds the hand-offs</h2>
<p class="lead">Work breaks at hand-offs, and a swimlane is the only model that makes every hand-off visible as a line crossing a lane boundary.</p>`,
      `<span class="eyebrow">LAB · Bài L.3</span>
<h2>Swimlane — sơ đồ tìm ra các điểm bàn giao</h2>
<p class="lead">Công việc gãy ở chỗ bàn giao, và swimlane là mô hình duy nhất làm mọi điểm bàn giao hiện ra thành một mũi tên cắt ngang ranh giới lane.</p>`,
    ),
    walk('labL3', [
      [1, 'Swimlane diagram',
        `<p>Title slide. The worked exercise is the capacity-override process from assignment topic TP1.</p>`,
        `<p>Slide bìa. Bài luyện là quy trình xin vượt sĩ số trong đề TP1.</p>`],
      [2, 'Giá trị nằm ở chỗ BÀN GIAO',
        `<p>Who does what, in what order, and where does the work pass from one person to another. The value is almost entirely in that last part.</p><p>A flowchart shows the steps. A swimlane shows the steps <em>and</em> the boundaries they cross — and the boundaries are where days disappear.</p>`,
        `<p>Ai làm gì, theo thứ tự nào, và công việc chuyển từ người này sang người kia ở đâu. Giá trị nằm gần như trọn vẹn ở vế cuối.</p><p>Lưu đồ cho thấy các bước. Swimlane cho thấy các bước <em>và</em> những ranh giới chúng cắt qua — mà ranh giới mới là chỗ ngày công biến mất.</p>`],
      [3, 'Ký pháp',
        `<p>Lanes are roles. Rounded rectangles are activities, sitting in the lane of whoever performs them. Diamonds are decisions, and every outgoing arrow carries the answer.</p><p>The fifth symbol has no shape: an arrow crossing a lane boundary <strong>is</strong> a hand-off. Counting those crossings is the point of the whole exercise.</p>`,
        `<p>Lane là vai trò. Chữ nhật bo góc là hoạt động, nằm trong lane của người thực hiện. Hình thoi là quyết định, và mọi mũi tên đi ra đều mang câu trả lời.</p><p>Ký hiệu thứ năm không có hình dạng: một mũi tên cắt ranh giới lane <strong>chính là</strong> một điểm bàn giao. Đếm những lần cắt đó là mục đích của cả bài tập.</p>`],
      [4, 'Lane là VAI TRÒ, không phải PHÒNG BAN',
        `<p>"Academic Office" is a department. "Academic Office Staff" and "Registrar" are two roles inside it that do different things and hand work to each other.</p><p>One lane per department hides exactly the hand-offs you are looking for. The diagram still looks tidy — which is why this mistake survives review and makes the whole exercise pointless.</p>`,
        `<p>"Phòng Đào tạo" là một phòng. "Nhân viên học vụ" và "Trưởng phòng" là hai vai trò bên trong nó, làm việc khác nhau và bàn giao cho nhau.</p><p>Mỗi phòng một lane là giấu đi đúng những điểm bàn giao bạn đang tìm. Sơ đồ vẫn trông gọn gàng — chính vì vậy lỗi này sống sót qua review và làm cả bài tập trở nên vô nghĩa.</p>`],
      [5, 'Bài luyện TP1 · Quy trình HIỆN TẠI',
        `<p>Four lanes: Student, department admin, Academic Office Staff, Lecturer. The student emails the department, which forwards to the office, which consults the lecturer, whose answer comes back down the same chain.</p><p>Draw it before you count. The shape of the picture is what makes the next slide's number believable.</p>`,
        `<p>Bốn lane: Sinh viên, thư ký bộ môn, nhân viên học vụ, giảng viên. Sinh viên gửi email cho bộ môn, bộ môn chuyển phòng học vụ, phòng hỏi giảng viên, câu trả lời đi ngược lại theo đúng chuỗi đó.</p><p>Hãy vẽ trước rồi mới đếm. Chính hình dạng bức tranh làm con số ở slide sau trở nên đáng tin.</p>`],
      [6, 'Con số ĐÓ là phát hiện',
        `<p>Six boundary crossings. Each one is an email sitting in somebody's inbox, and that is <em>why</em> the measured average decision time is six days across 2,300 requests a semester.</p><p>"The process is slow" is an opinion. "Six hand-offs, six days, 2,300 times a semester" is a business case — and it came out of a drawing, not an interview.</p>`,
        `<p>Sáu lần cắt ranh giới. Mỗi lần là một email nằm chờ trong hộp thư ai đó, và đó là <em>lý do</em> thời gian quyết định trung bình đo được là sáu ngày, trên 2.300 yêu cầu mỗi kỳ.</p><p>"Quy trình chậm" là một ý kiến. "Sáu lần bàn giao, sáu ngày, 2.300 lần mỗi kỳ" là một bài toán kinh doanh — và nó ra từ một bức vẽ, không phải từ một buổi phỏng vấn.</p>`],
      [7, 'Quy trình TƯƠNG LAI — UC-06',
        `<p>Three lanes and two crossings: student to system, system to Department Head. The system holds the request, routes it, counts the 48-hour SLA and enrols the student — none of which is a hand-off between people.</p><p>Put the two diagrams side by side and you have the clearest single slide in a Week-9 presentation.</p>`,
        `<p>Ba lane và hai lần cắt: sinh viên tới hệ thống, hệ thống tới Trưởng bộ môn. Hệ thống giữ yêu cầu, định tuyến, đếm giờ SLA 48 tiếng và ghi danh — không cái nào là bàn giao giữa người với người.</p><p>Đặt hai sơ đồ cạnh nhau là bạn có slide rõ ràng nhất của buổi thuyết trình tuần 9.</p>`],
      [8, 'Bốn lỗi mất điểm',
        `<p>Unlabelled decision branches · no failure path · the system mixed into a human lane · one lane per department.</p><p>The second one matters most here: where does the process go when the lecturer never replies? The current-state diagram has no answer, and that absence is itself a finding worth writing down.</p>`,
        `<p>Nhánh quyết định không nhãn · không có đường hỏng · nhét hệ thống vào lane của người · mỗi phòng ban một lane.</p><p>Cái thứ hai quan trọng nhất ở đây: quy trình đi đâu khi giảng viên không bao giờ trả lời? Sơ đồ hiện tại không có câu trả lời, và chính sự thiếu vắng đó là một phát hiện đáng ghi lại.</p>`],
      [9, 'Vẽ HIỆN TẠI trước, TƯƠNG LAI sau',
        `<p>The gap between the two diagrams is your business case, and Chapter 21 calls that gap analysis. On TP1 it is mandatory — the brief describes a legacy replacement, not a greenfield build.</p><p>TP2 needs it too: printing and sorting slips by hand is the current state; UC-04 automated routing is the future state. Same technique, different domain.</p>`,
        `<p>Khoảng cách giữa hai sơ đồ chính là bài toán kinh doanh của bạn, và chương 21 gọi đó là gap analysis. Với TP1 nó bắt buộc — đề mô tả một dự án thay thế hệ cũ, không phải xây mới từ đầu.</p><p>TP2 cũng cần: in và chia phiếu bằng tay là trạng thái hiện tại; UC-04 định tuyến tự động là trạng thái tương lai. Cùng một kỹ thuật, khác lĩnh vực.</p>`],
    ]),
  ].join('\n'),
};

/* ─────────── L.4 ─────────── */
const L4 = {
  title: 'L.4 — State-transition: the life of one object|||L.4 — Chuyển trạng thái: đời sống của một đối tượng',
  slug: 'swr302-lab-state-diagram',
  type: 'DOCUMENT',
  description: 'Trạng thái là chỗ đối tượng NẰM YÊN, không phải việc đang làm. Bài luyện đời sống một đơn hàng TP2, bảng trạng thái khi quá 7 trạng thái, và khác biệt giữa ô "—" với ô "TỪ CHỐI". 9 slide.',
  content: [
    bi(
      `<span class="eyebrow">LAB · Lesson L.4</span>
<h2>State-transition — the model that finds states nobody named</h2>
<p class="lead">Draw the life of one object and you routinely discover two or three states the business has been living with but never wrote down. That discovery is the point.</p>`,
      `<span class="eyebrow">LAB · Bài L.4</span>
<h2>Chuyển trạng thái — mô hình tìm ra những trạng thái chưa ai đặt tên</h2>
<p class="lead">Vẽ đời sống của một đối tượng và bạn thường phát hiện hai ba trạng thái mà doanh nghiệp vẫn đang sống chung nhưng chưa bao giờ ghi ra. Chính phát hiện đó là mục đích.</p>`,
    ),
    walk('labL4', [
      [1, 'Sơ đồ chuyển trạng thái',
        `<p>Title slide. The worked exercise follows one order through the TP2 system, from reservation to delivery.</p>`,
        `<p>Slide bìa. Bài luyện đi theo một đơn hàng qua hệ thống TP2, từ lúc giữ tồn tới khi giao xong.</p>`],
      [2, 'Khi nào vẽ nó?',
        `<p>Draw one whenever an object has a <strong>life</strong>: an order, an enrolment, a return, an override request.</p><p>If the object is only ever created and read, there is nothing to draw. If people in interviews say "it's waiting for…" or "it's stuck in…", that sentence is naming a state, and the model is worth drawing.</p>`,
        `<p>Vẽ mỗi khi một đối tượng có <strong>đời sống</strong>: một đơn hàng, một lượt ghi danh, một lượt trả hàng, một yêu cầu vượt sĩ số.</p><p>Nếu đối tượng chỉ được tạo rồi đọc thì không có gì để vẽ. Nếu trong phỏng vấn người ta nói "nó đang chờ…" hay "nó đang kẹt ở…" thì câu đó đang gọi tên một trạng thái, và mô hình này đáng vẽ.</p>`],
      [3, 'Ký pháp',
        `<p>Rounded rectangles are states. Arrows carry <code>event [guard] / action</code>. A filled dot starts, a ringed circle ends.</p><p>The guard in square brackets is what separates two arrows leaving the same state — and it is almost always a business rule you can cite by ID.</p>`,
        `<p>Chữ nhật bo tròn là trạng thái. Mũi tên mang <code>sự kiện [điều kiện] / hành động</code>. Chấm đặc là bắt đầu, vòng tròn viền là kết thúc.</p><p>Điều kiện trong ngoặc vuông là thứ phân biệt hai mũi tên cùng đi ra từ một trạng thái — và nó gần như luôn là một business rule bạn trích được theo mã số.</p>`],
      [4, 'Trạng thái ≠ hành động',
        `<p>A state is where the object <em>sits still</em>. Name it with an adjective or a past participle: Reserved, Routed, Picked, Packed, Shipped.</p><p>"Picking" and "Validating order" are activities — they belong on a swimlane, not here. This one mistake invalidates more student diagrams than every other error combined, because a diagram of activities cannot answer the question the model exists to answer.</p>`,
        `<p>Trạng thái là chỗ đối tượng <em>nằm yên</em>. Đặt tên bằng tính từ hoặc quá khứ phân từ: Reserved, Routed, Picked, Packed, Shipped.</p><p>"Đang nhặt hàng", "Đang kiểm đơn" là hoạt động — chúng thuộc về swimlane, không thuộc về đây. Riêng lỗi này làm hỏng nhiều sơ đồ sinh viên hơn tất cả các lỗi khác cộng lại, vì một sơ đồ toàn hoạt động không trả lời nổi câu hỏi mà mô hình này sinh ra để trả lời.</p>`],
      [5, 'Bài luyện TP2 · Đời sống một đơn hàng',
        `<p>Reserved → Routed → Picking → Packed → Shipped → Delivered, with Cancelled and Exception reachable from several points.</p><p>Build it from the use cases you already wrote, not from imagination: UC-02 produces Reserved, UC-04 produces Routed, UC-05 moves it to Packed. If a state has no use case that creates it, either the state is wrong or a use case is missing.</p>`,
        `<p>Reserved → Routed → Picking → Packed → Shipped → Delivered, với Cancelled và Exception đi tới được từ nhiều điểm.</p><p>Dựng nó từ các use case bạn đã viết, đừng dựng từ tưởng tượng: UC-02 sinh ra Reserved, UC-04 sinh ra Routed, UC-05 đưa nó sang Packed. Nếu một trạng thái không có use case nào tạo ra nó thì hoặc trạng thái đó sai, hoặc thiếu một use case.</p>`],
      [6, 'Vẽ ra thì LỘ điều gì?',
        `<p>Two things that were never in anyone's requirements list: what happens when a pick fails halfway, and whether a Packed order can still be cancelled.</p><p>Nobody could answer those from the brief. That is the finding — and the answer belongs in a business rule, which is why this lab feeds directly into your BR document.</p>`,
        `<p>Hai điều chưa từng có trong danh sách yêu cầu của ai: chuyện gì xảy ra khi nhặt hàng hỏng giữa chừng, và một đơn đã đóng gói còn huỷ được không.</p><p>Không ai trả lời được hai câu đó từ đề bài. Đó chính là phát hiện — và câu trả lời thuộc về một business rule, nên lab này chảy thẳng vào tài liệu BR của bạn.</p>`],
      [7, 'Quá 7 trạng thái? Dùng BẢNG',
        `<p>A state table has one row per state and one column per event. Past roughly seven states the diagram becomes unreadable while the table stays completely readable.</p><p>The table also forces you to fill every cell, which is exactly the property the diagram lacks: an arrow you forgot to draw looks like nothing, but an empty cell looks like an empty cell.</p>`,
        `<p>Bảng trạng thái có mỗi trạng thái một dòng, mỗi sự kiện một cột. Quá khoảng bảy trạng thái thì sơ đồ trở nên không đọc nổi trong khi bảng vẫn đọc tốt nguyên vẹn.</p><p>Bảng còn buộc bạn điền mọi ô — đúng cái tính chất mà sơ đồ thiếu: một mũi tên bạn quên vẽ trông như không có gì, còn một ô trống thì trông đúng là một ô trống.</p>`],
      [8, 'Ô “—” và ô “TỪ CHỐI” là HAI yêu cầu khác nhau',
        `<p>"—" means the event cannot physically occur in that state. "Reject" means it can occur and the system must refuse it, with a message.</p><p>The second one is a functional requirement and needs an error message specified. Collapsing the two is how a system ends up silently ignoring a cancel request instead of telling the customer why it was refused.</p>`,
        `<p>"—" nghĩa là sự kiện đó không thể xảy ra ở trạng thái đó. "Từ chối" nghĩa là nó xảy ra được và hệ thống phải chối, kèm thông báo.</p><p>Cái thứ hai là một functional requirement và cần đặc tả thông báo lỗi. Gộp hai cái làm một là cách một hệ thống đi tới chỗ âm thầm bỏ qua lệnh huỷ thay vì nói cho khách biết vì sao bị từ chối.</p>`],
      [9, 'Bốn lỗi mất điểm',
        `<p>Activities as states · unlabelled transitions · no terminal state · a state no arrow can reach.</p><p>The last one is worth a deliberate check: trace every state backwards to the start. An unreachable state means either a missing transition or a state that should not exist.</p>`,
        `<p>Hoạt động làm trạng thái · chuyển tiếp không nhãn · không có trạng thái kết thúc · một trạng thái không mũi tên nào tới được.</p><p>Cái cuối đáng kiểm có chủ đích: lần ngược từng trạng thái về điểm bắt đầu. Một trạng thái không tới được nghĩa là hoặc thiếu chuyển tiếp, hoặc trạng thái đó không nên tồn tại.</p>`],
    ]),
  ].join('\n'),
};

/* ─────────── L.5 ─────────── */
const L5 = {
  title: 'L.5 — Data flow & entity-relationship|||L.5 — DFD & ERD',
  slug: 'swr302-lab-dfd-erd',
  type: 'DOCUMENT',
  description: 'DFD tìm ra dữ liệu bị đọc mà không ai ghi; luật cân bằng giữa các mức; ERD là mô hình LOGIC chứ không phải schema. Bài luyện DFD mức 1 (TP2) và lõi đăng ký môn (TP1). 9 slide.',
  content: [
    bi(
      `<span class="eyebrow">LAB · Lesson L.5</span>
<h2>DFD and ERD — the two models that audit each other</h2>
<p class="lead">A data flow diagram finds data that is read but never written. An entity-relationship diagram finds the thing the data is <em>about</em>. Together they catch gaps no use case review ever finds.</p>`,
      `<span class="eyebrow">LAB · Bài L.5</span>
<h2>DFD và ERD — hai mô hình soi lẫn nhau</h2>
<p class="lead">Data flow diagram tìm ra dữ liệu bị đọc mà chưa ai ghi. Entity-relationship diagram tìm ra <em>cái</em> mà dữ liệu nói về. Đi cùng nhau, chúng bắt được những lỗ hổng mà không buổi review use case nào tìm ra.</p>`,
    ),
    walk('labL5', [
      [1, 'DFD & ERD',
        `<p>Title slide. Two models in one lab because they check each other: every DFD data store should appear as an ERD entity, and every ERD entity should be written by some DFD process.</p>`,
        `<p>Slide bìa. Hai mô hình trong một lab vì chúng kiểm lẫn nhau: mọi kho dữ liệu trong DFD nên xuất hiện thành một thực thể trong ERD, và mọi thực thể trong ERD phải được một tiến trình nào đó của DFD ghi vào.</p>`],
      [2, 'DFD trả lời câu hỏi không mô hình nào khác trả lời',
        `<p>Where does each piece of data come from, and where does it go. Use cases show interactions; DFDs show the data underneath them.</p><p>That is why a DFD catches "we display the customer's loyalty tier" when no process anywhere sets it — the use cases all looked fine individually.</p>`,
        `<p>Mỗi mẩu dữ liệu từ đâu tới và đi đâu. Use case cho thấy tương tác; DFD cho thấy dữ liệu nằm dưới những tương tác đó.</p><p>Vì vậy DFD bắt được tình huống "màn hình hiện hạng thành viên của khách" trong khi không tiến trình nào đặt giá trị đó — từng use case riêng lẻ vẫn trông ổn cả.</p>`],
      [3, 'Bốn ký hiệu',
        `<p>Process (circle, verb phrase), data store (open rectangle, plural noun), external entity (rectangle), data flow (labelled arrow).</p><p>Numbering matters: process 3 on the level-1 diagram decomposes into 3.1, 3.2, 3.3 on its own level-2 diagram. Without that numbering nobody can tell which diagram explains which.</p>`,
        `<p>Tiến trình (vòng tròn, cụm động từ), kho dữ liệu (chữ nhật hở, danh từ số nhiều), thực thể ngoài (chữ nhật), luồng dữ liệu (mũi tên có nhãn).</p><p>Đánh số rất quan trọng: tiến trình 3 ở mức 1 tách ra thành 3.1, 3.2, 3.3 ở sơ đồ mức 2 của chính nó. Không có cách đánh số đó thì không ai biết sơ đồ nào giải thích sơ đồ nào.</p>`],
      [4, 'Hai lỗi mà người chấm nào cũng soi',
        `<p>A <strong>black hole</strong> is a process with inputs and no outputs. A <strong>miracle</strong> is a process with outputs and no inputs.</p><p>Both are mechanical to find and mechanical to grade, so check for them yourself: read every circle and ask what goes in and what comes out. Neither answer may be "nothing".</p>`,
        `<p><strong>Hố đen</strong> là tiến trình có đầu vào mà không có đầu ra. <strong>Phép màu</strong> là tiến trình có đầu ra mà không có đầu vào.</p><p>Cả hai đều tìm được và chấm được một cách máy móc, nên hãy tự kiểm: đọc từng vòng tròn rồi hỏi cái gì vào và cái gì ra. Không câu trả lời nào được phép là "không có gì".</p>`],
      [5, 'Luật cân bằng giữa các mức',
        `<p>Every flow into and out of process 3 on the level-1 diagram must appear on the level-2 diagram that decomposes it — same names, same directions, nothing added, nothing dropped.</p><p>This is the only formal consistency rule in the whole modelling toolkit, and it is checked by reading two diagrams side by side. Do that check before you submit.</p>`,
        `<p>Mọi luồng vào và ra tiến trình 3 ở mức 1 phải xuất hiện ở sơ đồ mức 2 tách nó ra — cùng tên, cùng chiều, không thêm, không bớt.</p><p>Đây là luật nhất quán hình thức duy nhất trong cả bộ công cụ mô hình hoá, và nó được kiểm bằng cách đặt hai sơ đồ cạnh nhau mà đọc. Hãy làm phép kiểm đó trước khi nộp.</p>`],
      [6, 'Bài luyện TP2 · DFD mức 1',
        `<p>Five processes — ingest orders, reserve stock, route, pick and pack, ship — over four stores: Orders, Inventory, Shipments, Carriers.</p><p>Name the flows with the same words your data dictionary uses. When the dictionary says <code>sellable quantity</code>, the arrow says "sellable quantity", not "stock". Two names for one thing is how a team ends up building two different fields.</p>`,
        `<p>Năm tiến trình — nhận đơn, giữ tồn, định tuyến, nhặt và đóng gói, giao — trên bốn kho: Orders, Inventory, Shipments, Carriers.</p><p>Đặt tên luồng bằng đúng những từ trong data dictionary của bạn. Khi từ điển ghi <code>sellable quantity</code> thì mũi tên ghi "sellable quantity", không ghi "tồn kho". Hai tên cho một thứ là cách một nhóm đi tới chỗ dựng ra hai trường dữ liệu khác nhau.</p>`],
      [7, 'ERD — mô hình LOGIC, không phải schema',
        `<p>Entities, relationships, cardinality. No foreign keys, no data types, no index decisions — those are design, and design is not yours to specify in an SRS.</p><p>A many-to-many relationship is a legitimate answer at this level. Resolving it into a junction table is a database designer's job, done later, and doing it here just hides the business fact you were trying to record.</p>`,
        `<p>Thực thể, quan hệ, lực lượng. Không khoá ngoại, không kiểu dữ liệu, không quyết định chỉ mục — đó là thiết kế, mà thiết kế không phải việc bạn đặc tả trong SRS.</p><p>Quan hệ nhiều-nhiều là câu trả lời hợp lệ ở mức này. Tách nó thành bảng trung gian là việc của người thiết kế CSDL, làm sau, và làm ở đây chỉ che mất cái sự thật nghiệp vụ bạn đang cố ghi lại.</p>`],
      [8, 'Bài luyện TP1 · Lõi đăng ký môn',
        `<p>Student, Section, Course, Enrollment, Waitlist Entry, Prerequisite. Read each relationship out loud in both directions — "a student enrols in many sections; a section holds many students" — and the cardinality writes itself.</p><p>Prerequisite is the interesting one: a course relates to other courses, so the relationship loops back to the same entity. Students often miss it because it does not look like a relationship between two boxes.</p>`,
        `<p>Student, Section, Course, Enrollment, Waitlist Entry, Prerequisite. Đọc to từng quan hệ theo cả hai chiều — "một sinh viên ghi danh nhiều lớp; một lớp chứa nhiều sinh viên" — và lực lượng tự nó viết ra.</p><p>Prerequisite là cái thú vị: một môn liên hệ với các môn khác, nên quan hệ vòng lại chính thực thể đó. Sinh viên hay bỏ sót vì nó không trông giống quan hệ giữa hai cái hộp.</p>`],
      [9, 'Bốn lỗi mất điểm',
        `<p>Black holes and miracles · unnumbered processes · unbalanced levels · an ERD with foreign keys and data types in it.</p><p>Run the cross-check too: every data store in the DFD should be an entity in the ERD. A store with no matching entity usually means you invented a store the business does not actually keep.</p>`,
        `<p>Hố đen và phép màu · tiến trình không đánh số · các mức không cân bằng · ERD có khoá ngoại và kiểu dữ liệu trong đó.</p><p>Chạy cả phép đối chiếu chéo: mọi kho dữ liệu trong DFD nên là một thực thể trong ERD. Một kho không có thực thể tương ứng thường nghĩa là bạn đã bịa ra một kho mà doanh nghiệp không thật sự lưu.</p>`],
    ]),
  ].join('\n'),
};

/* ─────────── L.6 ─────────── */
const L6 = {
  title: 'L.6 — Decision tables & dialog maps|||L.6 — Bảng quyết định & Dialog map',
  slug: 'swr302-lab-decision-table',
  type: 'DOCUMENT',
  description: 'Viết đủ 2ⁿ cột RỒI mới rút gọn — cột bạn quên chính là luật chưa ai nghĩ tới. Bài luyện BR-11 của TP2, bảng vs cây, dialog map và bảng Display-Action-Response. 9 slide.',
  content: [
    bi(
      `<span class="eyebrow">LAB · Lesson L.6</span>
<h2>Decision tables — completeness you can prove by counting</h2>
<p class="lead">Three conditions means eight columns. Write all eight and the gap in the rules stops being a matter of anyone's memory.</p>`,
      `<span class="eyebrow">LAB · Bài L.6</span>
<h2>Bảng quyết định — tính đầy đủ chứng minh được bằng phép đếm</h2>
<p class="lead">Ba điều kiện nghĩa là tám cột. Viết đủ tám cột và lỗ hổng trong bộ luật thôi phụ thuộc vào trí nhớ của ai đó.</p>`,
    ),
    walk('labL6', [
      [1, 'Bảng quyết định & Dialog map',
        `<p>Title slide. The worked exercise is business rule BR-11 from TP2 — when may a reservation be released?</p>`,
        `<p>Slide bìa. Bài luyện là business rule BR-11 của TP2 — khi nào được nhả một lượt giữ tồn?</p>`],
      [2, 'Giá trị của nó mang tính MÁY MÓC',
        `<p>Other models depend on your judgement. This one does not: n conditions produce exactly 2ⁿ combinations, and you either wrote them all down or you did not.</p><p>That is why it is the right tool for any rule stated in prose with several "and"s and "or"s in it — the prose hides combinations, the table cannot.</p>`,
        `<p>Các mô hình khác phụ thuộc vào phán đoán của bạn. Cái này thì không: n điều kiện sinh ra đúng 2ⁿ tổ hợp, và bạn hoặc đã viết ra hết, hoặc chưa.</p><p>Vì vậy nó là công cụ đúng cho mọi luật được phát biểu bằng văn xuôi có vài chữ "và", "hoặc" — văn xuôi giấu tổ hợp, cái bảng thì không giấu được.</p>`],
      [3, 'Bài luyện TP2 · BR-11, ba điều kiện ⇒ tám cột',
        `<p>Payment authorized? · Stock still on hand? · Hold window expired? Eight columns, each with one action.</p><p>Fill the actions from the brief and the stakeholder interviews. Where the brief is silent, write "?" and take it to the sponsor — the blank is a question, not a gap you are allowed to fill with a guess.</p>`,
        `<p>Đã uỷ quyền thanh toán? · Hàng còn trong kho? · Hết thời gian giữ? Tám cột, mỗi cột một hành động.</p><p>Điền hành động từ đề bài và các buổi phỏng vấn bên liên quan. Chỗ nào đề im lặng thì ghi "?" rồi mang tới người tài trợ dự án — ô trống là một câu hỏi, không phải chỗ trống bạn được phép lấp bằng phỏng đoán.</p>`],
      [4, 'Luật 4 mới là lý do cái bảng tồn tại',
        `<p>Column 4 — payment authorized, stock gone, window not expired — is the case nobody thinks of, and it is the one that decides whether the customer gets refunded or waits.</p><p>Nobody would have raised it in a meeting. The table raised it by construction, which is the entire argument for using one.</p>`,
        `<p>Cột 4 — đã thanh toán, hết hàng, chưa hết hạn giữ — là trường hợp không ai nghĩ tới, và nó quyết định khách được hoàn tiền hay phải chờ.</p><p>Không ai nêu nó ra trong một cuộc họp. Cái bảng nêu ra bằng chính cấu trúc của nó, và đó là toàn bộ lý lẽ cho việc dùng bảng.</p>`],
      [5, 'Rút gọn — nhưng CHỈ SAU KHI viết đủ 2ⁿ',
        `<p>Once every column has an action, collapse the ones where a condition turns out not to matter, and mark it "—".</p><p>Reducing first is the trap: you collapse based on what you assumed, and the column you never wrote is the rule nobody ever thought about. Write eight, then reduce to five.</p>`,
        `<p>Khi mọi cột đã có hành động, gộp những cột mà một điều kiện hoá ra không ảnh hưởng, và đánh dấu "—".</p><p>Rút gọn trước là cái bẫy: bạn gộp dựa trên điều bạn giả định, và cột bạn chưa từng viết chính là luật chưa ai nghĩ tới. Viết đủ tám, rồi rút xuống năm.</p>`],
      [6, 'Bảng hay Cây?',
        `<p>Table when the conditions are independent and you need proof of completeness. Tree when they are nested — when condition B is only asked if A was true.</p><p>A tree of independent conditions duplicates whole branches and stops being checkable. A table of nested conditions fills with impossible combinations. Pick by the shape of the rule, not by preference.</p>`,
        `<p>Bảng khi các điều kiện độc lập và bạn cần bằng chứng về tính đầy đủ. Cây khi chúng lồng nhau — khi điều kiện B chỉ được hỏi nếu A đúng.</p><p>Một cái cây cho các điều kiện độc lập sẽ nhân đôi cả nhánh và mất khả năng kiểm. Một cái bảng cho các điều kiện lồng nhau sẽ đầy những tổ hợp bất khả. Chọn theo hình dạng của luật, đừng chọn theo sở thích.</p>`],
      [7, 'Dialog map — màn hình nào đi đâu',
        `<p>A state-transition diagram where the states are screens and the events are user actions. It is the one model that shows navigation dead ends.</p><p>Look for a screen with no way back. On TP1 that was the waitlist confirmation page: it confirmed, and then offered nothing — the student had to use the browser's back button, which re-posted the request.</p>`,
        `<p>Một sơ đồ chuyển trạng thái mà trạng thái là màn hình và sự kiện là thao tác người dùng. Nó là mô hình duy nhất cho thấy ngõ cụt điều hướng.</p><p>Hãy tìm màn hình không có đường quay lại. Ở TP1 đó là trang xác nhận danh sách chờ: nó xác nhận xong rồi không mời gì nữa — sinh viên phải bấm nút back của trình duyệt, và thao tác đó gửi lại yêu cầu.</p>`],
      [8, 'Bảng Display-Action-Response',
        `<p>One row per UI element: what is displayed, when it is enabled, what happens on click. It is the least glamorous artifact in the course and the one developers actually read.</p><p>Write it for the two or three screens that carry the hard rules, not for all of them. A DAR table for a static page is busywork.</p>`,
        `<p>Mỗi phần tử giao diện một dòng: hiển thị cái gì, khi nào được bật, bấm vào thì gì xảy ra. Đây là tài liệu kém hào nhoáng nhất môn học và là cái lập trình viên thật sự đọc.</p><p>Viết nó cho hai ba màn hình mang luật khó, đừng viết cho tất cả. Một bảng DAR cho trang tĩnh chỉ là việc làm cho có.</p>`],
      [9, 'Bảng tự kiểm trước khi nộp LAB',
        `<p>2ⁿ columns written before reducing · every column has an action · impossible combinations marked, not deleted · every rule traceable to a BR-xx ID.</p><p>The last item is what connects this lab to your assignment: a decision table with no BR reference is a table nobody can find when the rule changes.</p>`,
        `<p>Đã viết đủ 2ⁿ cột trước khi rút gọn · mọi cột đều có hành động · tổ hợp bất khả được đánh dấu chứ không xoá · mọi luật truy ngược được về một mã BR-xx.</p><p>Mục cuối là thứ nối lab này với bài assignment của bạn: một bảng quyết định không có tham chiếu BR là một cái bảng không ai tìm ra khi luật thay đổi.</p>`],
    ]),
  ].join('\n'),
};

export default {
  title: 'LAB — Modelling workshop (10%)|||LAB — Xưởng mô hình hoá (10%)',
  description:
    'Sáu bài lab theo đúng bộ mô hình Wiegers chương 12–13: chọn mô hình, context diagram, swimlane, chuyển trạng thái, DFD/ERD, bảng quyết định. Mỗi bài đi theo slide, luyện thẳng trên hai đề TP1/TP2, và kết bằng danh sách lỗi mất điểm.',
  lessons: [L1, L2, L3, L4, L5, L6],
};
