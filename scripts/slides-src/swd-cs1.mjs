/**
 * swd-cs1.mjs — SWD392 ⭐ Chuyên sâu CS.1: LỊCH SỬ THIẾT KẾ PHẦN MỀM & BẢN ĐỒ ĐI TIẾP (deck tự dựng, 14/10/2026).
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/swd-cs1.mjs --out <dir>
 * Đề cương: flm-nguon/_repo/SWD392/CHUYEN-SAU.md mục 1. Khuôn: _cs-chung.mjs.
 * Mọi năm/tên/sự kiện đã kiểm nguồn (danh sách nguồn ở đầu flm-nguon/_repo/SWD392/gen/src/slides/cs1.txt).
 * Code trên slide 6 và 8 = rút gọn của gen/java/cs1/CouplingDemo.java, ParnasKwic.java (output là output chạy thật).
 */
import { lamDeck, code } from './_cs-chung.mjs';

export const deck = { key: 'cs1', code: 'CS1', title: 'Lịch sử thiết kế phần mềm & bản đồ đi tiếp', sub: 'SWD392 · ⭐ Chuyên sâu' };

/* ───────────── khối nhỏ ───────────── */
const o = (html, cls = '') => `<div class="o ${cls}">${html}</div>`;
const bang = (rows, head, st = '') => `<table${st ? ` style="${st}"` : ''}><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</table>`;
const out = (txt) => `<pre style="margin:0;background:#1e1e1e;color:#d4d4d4;border-radius:8px;padding:8px 12px;font:15px/1.4 Menlo,Consolas,monospace;white-space:pre">${txt}</pre>`;
const hop = (t, y, mau = '#e08a1e', nen = '#fff7ef') => `<div style="flex:1;border:2px solid ${mau};border-radius:10px;background:${nen};padding:8px 10px;text-align:center">
<div style="font-size:19px;font-weight:700;color:#262626">${t}</div><div style="font-size:15px;color:#555;margin-top:3px;line-height:1.3">${y}</div></div>`;
const mui = `<div style="align-self:center;font-size:26px;color:#e08a1e">➜</div>`;
const moc = (nam, t, y) => `<div style="flex:1;text-align:center"><div style="font-size:22px;font-weight:700;color:#b85a2b">${nam}</div>
<div style="width:16px;height:16px;border-radius:50%;background:#e08a1e;margin:4px auto"></div><div style="font-size:17px;font-weight:700;color:#262626;line-height:1.25">${t}</div><div style="font-size:14px;color:#666;line-height:1.3;margin-top:2px">${y}</div></div>`;

/* ───────────── sơ đồ C4 container LabFlow bằng HTML ───────────── */
const c4 = (t, k, y, mau) => `<div style="border:2px solid ${mau};border-radius:10px;background:#fff;padding:6px 10px;text-align:center;min-width:170px">
<div style="font-size:17px;font-weight:700;color:#262626">${t}</div><div style="font-size:13px;color:${mau};font-weight:700">${k}</div><div style="font-size:13px;color:#555;line-height:1.25">${y}</div></div>`;
const mt = (t) => `<div style="align-self:center;text-align:center;font-size:12px;color:#595959;line-height:1.1">${t}<br><span style="font-size:22px;color:#595959">→</span></div>`;
const c4LabFlow = `<div style="display:flex;align-items:center;gap:6px">
${c4('Người dùng', '[Person]', 'SV, GV, nhân viên lab', '#595959')}${mt('HTTPS')}
<div style="border:2px dashed #b85a2b;border-radius:12px;padding:20px 10px 8px;position:relative;display:flex;align-items:center;gap:6px">
<span style="position:absolute;top:2px;left:10px;font-size:13px;font-weight:700;color:#b85a2b">LabFlow AI [Software System]</span>
${c4('Web App', '[Container: React SPA]', 'màn theo vai trò, quét QR', '#2f7d4f')}${mt('JSON/HTTPS')}
${c4('API Application', '[Container: Spring Boot 3]', 'modular monolith', '#2f7d4f')}${mt('SQL')}
${c4('Database', '[Container: PostgreSQL]', '+ pgvector', '#c0392b')}</div></div>
<div style="display:flex;gap:10px;justify-content:flex-end;margin-top:6px;font-size:15px;color:#555">API → Email Service (SMTP) · AI Model Service (HTTPS) · MQTT broker → API</div>`;

export const slides = lamDeck('LỊCH SỬ THIẾT KẾ PHẦN MỀM', [
  /* 1 */
  { cover: true, t: 'Lịch sử thiết kế phần mềm<br>&amp; bản đồ đi tiếp', sub: 'Từ “khủng hoảng phần mềm” 1968 tới coupling/cohesion, che giấu thông tin, UML, GoF, COMET,<br>Agile, sơ đồ dạng code, C4 và ADR — và học gì tiếp sau SWD392' },

  /* 2 */
  { t: 'Vì sao cần biết lịch sử thiết kế phần mềm?', body: `
<ul>
<li>Mỗi khái niệm trong SWD392 là <b>lời đáp cho một sự cố có thật</b> — biết sự cố thì nhớ khái niệm lâu hơn.</li>
<li>Phỏng vấn &amp; bảo vệ đồ án hay hỏi <span class="do">“vì sao”</span>: vì sao coupling thấp, vì sao UML, vì sao không vẽ hết 14 loại sơ đồ.</li>
</ul>
${bang([
    ['1968–1975', 'Phần mềm lớn trễ hạn, nhiều lỗi', 'kỹ nghệ phần mềm, lập trình cấu trúc, coupling/cohesion'],
    ['1972–1990', 'Chia module theo tiêu chí gì?', 'che giấu thông tin, hướng đối tượng'],
    ['1990–1997', 'Mỗi phương pháp một ký pháp', 'UML — chuẩn OMG năm 1997'],
    ['1994–2011', 'Lời giải lặp lại, quy trình, phương pháp', 'GoF, RUP, COMET'],
    ['2001–nay', 'Tài liệu nặng, nhanh lỗi thời', 'Agile, sơ đồ dạng code, C4, ADR'],
  ], ['Thời kỳ', 'Câu hỏi lớn', 'Câu trả lời ra đời'], 'font-size:19px')}` },

  /* 3 */
  { t: '1968: hội nghị NATO và “khủng hoảng phần mềm”', body: `
<ul>
<li><b>7–11/10/1968</b>, Garmisch (Tây Đức): Ủy ban Khoa học NATO họp về <b>Software Engineering</b> (kỹ nghệ phần mềm).</li>
<li>Cái tên được chọn <b>để gây chú ý</b> — Brian Randell sau này viết: nó tả <span class="do">một yêu cầu, chưa phải thực tế</span>.</li>
<li>Báo cáo do <b>Peter Naur</b> và <b>Brian Randell</b> biên tập (1/1969); hội nghị thứ hai: Rome, 1969.</li>
<li>Người dự bàn tới cái mà vài người gọi là <b>“khủng hoảng phần mềm” (software crisis)</b>: dự án lớn trễ hạn, vượt chi phí, lỗi nhiều.</li>
</ul>
${o('Bài học rút ra: viết được code chưa đủ — phần mềm lớn cần <b>cách thiết kế có hệ thống</b>. Cả môn SWD392 là hậu duệ của câu hỏi đó.')}` },

  /* 4 */
  { t: 'Lập trình cấu trúc: lá thư GOTO của Dijkstra (1968)', body: `
<ul>
<li><b>3/1968</b>, tạp chí <i>Communications of the ACM</i> 11(3): lá thư của <b>Edsger Dijkstra</b>, ban biên tập đặt tựa <span class="do">“Go To Statement Considered Harmful”</span> (tựa gốc: “A Case Against the Goto Statement”).</li>
<li>Ý chính: dùng <b>tuần tự – rẽ nhánh – lặp</b> thay cho nhảy lung tung ⇒ đọc code từ trên xuống là hiểu.</li>
<li>Đầu thập niên 1970: <b>thiết kế từ trên xuống</b> (top-down) và <b>tinh chỉnh từng bước</b> (stepwise refinement).</li>
<li>Dijkstra thiết kế hệ điều hành <b>T.H.E.</b> (1968) theo <b>các tầng</b> — Gomaa xếp nó vào nhóm phương pháp thiết kế đầu tiên.</li>
</ul>
${o('Từ đây trở đi, câu hỏi chuyển từ “viết từng lệnh thế nào” sang <b>“chia chương trình thành các phần thế nào”</b> — đó là thiết kế.', 'xanh')}` },

  /* 5 */
  { t: 'Structured Design (1974): coupling và cohesion ra đời', body: `
<ul>
<li><b>Stevens, Myers, Constantine</b> — bài “Structured Design”, <i>IBM Systems Journal</i>, <b>1974</b>; Larry Constantine nghĩ ra hai thước đo từ cuối thập niên 1960.</li>
<li>Sách <b>Yourdon &amp; Constantine</b> “Structured Design” (1975, bản Prentice Hall 1979) làm các thuật ngữ thành chuẩn chung.</li>
</ul>
<div class="hai">
${bang([['Content — thò vào ruột module khác'], ['Common — dùng chung biến toàn cục'], ['External — chung định dạng bên ngoài'], ['Control — truyền cờ điều khiển'], ['Stamp — truyền cả cấu trúc'], ['Data — chỉ truyền dữ liệu cần ✓']], ['Coupling (xấu → tốt)'], 'font-size:18px')}
${bang([['Coincidental — gom ngẫu nhiên'], ['Logical · Temporal'], ['Procedural'], ['Communicational'], ['Sequential'], ['Functional — một việc duy nhất ✓']], ['Cohesion (xấu → tốt)'], 'font-size:18px')}
</div>
<p class="do" style="text-align:center">Mục tiêu từ 1974 tới nay không đổi: coupling THẤP, cohesion CAO.</p>` },

  /* 6 */
  { t: 'Coupling cao vs thấp — đọc bằng Java', body: `<div class="hai" style="grid-template-columns:1fr 1fr;gap:16px">
<div>${code(`// Coupling CAO: chép luật, tự ghi trường
class TightReservationService {
  String reserve(Lab lab) {
    if (lab.booked < lab.capacity) {
      lab.booked++;
      return "booked " + lab.code;
    }
    return "full " + lab.code;
  }
}`, 'java')}</div>
<div>${code(`// Coupling THẤP: chỉ gọi một thao tác
class LooseReservationService {
  String reserve(Lab lab) {
    return lab.tryBook()
        ? "booked " + lab.code
        : "rejected " + lab.code;
  }
}
// Lab.tryBook() kiểm underMaintenance
// và capacity — luật nằm MỘT chỗ`, 'java')}</div></div>
${out(`tight: booked LAB-1 (booked=1)     ← phòng đang bảo trì mà vẫn đặt được: SAI
loose: rejected LAB-1 (booked=0)   ← luật mới thêm vào Lab tự có hiệu lực`)}
<p class="nho">Sprint 5 thêm luật “phòng đang bảo trì thì không cho đặt” vào Lab. Service coupling cao không biết, nên sai im lặng.</p>` },

  /* 7 */
  { t: 'Parnas 1972: che giấu thông tin (information hiding)', body: `
<ul>
<li><b>David Parnas</b>, “On the Criteria To Be Used in Decomposing Systems into Modules”, <i>CACM</i> 15(12), <b>12/1972</b>, tr. 1053–1058.</li>
<li>Ví dụ: hệ <b>chỉ mục KWIC</b> (xoay vòng các từ của mỗi dòng rồi xếp chữ cái) — chia module theo <b>hai cách</b>.</li>
</ul>
${bang([
    ['Cách 1 (thường gặp)', 'mỗi <b>bước xử lý</b> là một module: Input → Circular Shift → Alphabetizing → Output', 'đổi cách lưu dữ liệu ⇒ sửa <span class="do">nhiều</span> module'],
    ['Cách 2 (Parnas)', 'mỗi module <b>giấu một quyết định thiết kế</b> dễ đổi: Line Storage giấu cách lưu dòng', 'đổi cách lưu ⇒ chỉ sửa <b>Line Storage</b>'],
  ], ['', 'Tiêu chí chia', 'Khi yêu cầu đổi'], 'font-size:19px')}
${o('Câu cần thuộc: <b>chia module theo những gì có thể THAY ĐỔI</b>, không theo các bước của lưu đồ. Đây là gốc của <b>đóng gói</b> (encapsulation), <b>interface</b> và chữ “private” trong Java.', 'xanh')}` },

  /* 8 */
  { t: 'Che giấu thông tin bằng Java: interface giữ bí mật', body: `<div class="hai" style="grid-template-columns:1.15fr 1fr;gap:16px">
<div>${code(`interface LineStorage {      // bí mật: cách cất từ
  void addLine(String line);
  int lineCount();
  int wordCount(int line);
  String word(int line, int w);
}
class PackedStorage implements LineStorage {
  // một mảng ký tự lớn + vị trí đầu/cuối
}
class ListStorage implements LineStorage {
  // danh sách các danh sách từ
}
class CircularShifter {      // chỉ biết interface
  CircularShifter(LineStorage s) { ... }
}`, 'java')}</div>
<div>${out(`PackedStorage:
  Equipment Reserve Lab
  Join Waitlist
  Lab Equipment Reserve
  Reserve Lab Equipment
  Waitlist Join
ListStorage:
  Equipment Reserve Lab
  Join Waitlist
  Lab Equipment Reserve
  Reserve Lab Equipment
  Waitlist Join`)}
<p class="nho" style="margin-top:8px">Đổi hẳn cách lưu, <b>CircularShifter không sửa một dòng</b>, kết quả giống hệt.</p></div></div>` },

  /* 9 */
  { t: 'Hướng đối tượng: từ Simula 67 tới Java', body: `
<div style="display:flex;gap:8px;border-top:3px solid #e08a1e;padding-top:10px">
${moc('1962–67', 'Simula I → Simula 67', 'Dahl &amp; Nygaard, Trung tâm Tính toán Na Uy; lớp, đối tượng, kế thừa')}
${moc('1970s–80', 'Smalltalk', 'Alan Kay và nhóm ở Xerox PARC; Smalltalk-80 ra công chúng')}
${moc('1985', 'C++', 'Bjarne Stroustrup; bản thương mại đầu (Cfront 1.0) tháng 10/1985')}
${moc('1995', 'Java', 'Sun công bố 23/5/1995 — ngôn ngữ của LabFlow')}
</div>
<ul style="margin-top:6px">
<li>Giải Turing: <b>Dahl &amp; Nygaard</b> (2001), <b>Alan Kay</b> (2003) — vì các ý tưởng gốc của lập trình hướng đối tượng.</li>
<li>Thiết kế đi theo: Booch đưa ý tưởng đối tượng vào thiết kế (ban đầu cho hệ viết bằng Ada) — <b>che giấu thông tin + lớp + kế thừa</b>.</li>
</ul>
${o('Hướng đối tượng không thay Parnas mà <b>cài sẵn</b> ý tưởng của Parnas vào ngôn ngữ: <code>class</code> + <code>private</code> = một module giấu bí mật.')}` },

  /* 10 */
  { t: '“Chiến tranh phương pháp” đầu thập niên 1990', body: `
<p>Cuối 1980 – đầu 1990 có <b>hàng chục</b> phương pháp hướng đối tượng, mỗi cái một ký pháp ⇒ người dùng không biết chọn cái nào.</p>
${bang([
    ['Booch method', 'Grady Booch, 1991', 'thiết kế hướng đối tượng, sơ đồ đối tượng'],
    ['OMT', 'James Rumbaugh và cộng sự, 1991', 'ký pháp class diagram phổ biến nhất trước UML; mô hình động bằng statechart + sequence'],
    ['OOSE / Objectory', 'Ivar Jacobson, 1992', '<b>use case</b> — xương sống của COMET và Report 3'],
    ['Shlaer–Mellor · Coad–Yourdon', '1988–1992', 'phân tích hướng đối tượng, sơ đồ chuyển trạng thái'],
    ['Statechart', 'David Harel, 1987', 'máy trạng thái phân cấp — UML lấy nguyên ý tưởng'],
  ], ['Phương pháp', 'Tác giả, năm', 'Góp gì cho UML'], 'font-size:19px')}
<p class="nho">Nguồn: Gomaa, Software Modeling and Design, mục 1.9 (giáo trình môn này).</p>` },

  /* 11 */
  { t: 'UML ra đời tại Rational (1994–1997)', body: `
<div style="display:flex;gap:6px">
${hop('10/1994', 'Rumbaugh rời GE, về Rational cùng Booch')}${mui}
${hop('1995', 'Jacobson và công ty Objectory về Rational')}${mui}
${hop('6/1996', 'UML 0.9')}${mui}
${hop('1/1997', 'đề xuất UML 1.0 nộp OMG')}${mui}
${hop('11/1997', '<b>OMG thông qua UML 1.1</b>', '#2f7d4f', '#f1f9f4')}
</div>
<ul>
<li>Ba người được gọi vui là <b>“Three Amigos”</b>; ngoài họ còn nhiều hãng phần mềm cùng tham gia chuẩn hoá.</li>
<li>UML là <b>ký pháp</b> (notation), <span class="do">không phải phương pháp</span>: nó nói vẽ thế nào, không nói vẽ cái gì trước. Phương pháp là RUP, COMET…</li>
<li>Từ đây OMG (Object Management Group) giữ chuẩn UML.</li>
</ul>` },

  /* 12 */
  { t: 'UML 2 và 14 loại sơ đồ', body: `
<ul>
<li><b>UML 2.0</b>: thay đổi lớn về ký pháp (OMG thông qua 2003, phát hành chính thức 2005). Bản hiện hành: <b>UML 2.5.1 (12/2017)</b>.</li>
<li>Cũng là chuẩn ISO: ISO/IEC 19501:2005 (UML 1.x) và ISO/IEC 19505:2012 (UML 2).</li>
</ul>
<div class="hai">
${bang([['Class ★ · Object'], ['Package ★ · Component ★'], ['Composite Structure'], ['Deployment ★ · Profile']], ['7 sơ đồ CẤU TRÚC (structure)'], 'font-size:19px')}
${bang([['Use Case ★ · Activity ★'], ['State Machine ★'], ['Tương tác: Sequence ★ · Communication ★'], ['Timing · Interaction Overview']], ['7 sơ đồ HÀNH VI (behavior)'], 'font-size:19px')}
</div>
${o('★ = loại SWD392 và Report 3/4 dùng. <b>Hiếm dự án vẽ đủ 14 loại</b> — chọn sơ đồ trả lời đúng câu hỏi người đọc đang có.')}` },

  /* 13 */
  { t: 'RUP và Unified Process (1998)', body: `
<ul>
<li>Objectory (Jacobson) → Rational Objectory Process 4.0 (1996) → <b>Rational Unified Process 5.0 (6/1998)</b>; Philippe Kruchten dẫn nhóm RUP.</li>
<li>Sách <b>The Unified Software Development Process</b> (Jacobson, Booch, Rumbaugh, 1999) — Gomaa gọi là USDP.</li>
<li>Bốn pha: <b>Inception → Elaboration → Construction → Transition</b>; lặp (iterative), lấy use case dẫn dắt, lấy kiến trúc làm trung tâm.</li>
<li>Kruchten, “The 4+1 View Model of Architecture”, <i>IEEE Software</i>, 11/1995 — bốn góc nhìn + kịch bản.</li>
<li>2/2003: <b>IBM mua Rational</b>.</li>
</ul>
${o('Đã học ở slide trường: bài <b>1.E</b> (Unified Process) và <b>1.A</b> (góc nhìn 4+1). COMET của Gomaa dùng lại vòng đời USDP.', 'xanh')}` },

  /* 14 */
  { t: 'GoF 1994: 23 mẫu thiết kế', body: `
<ul>
<li><b>Gamma, Helm, Johnson, Vlissides</b> — “Design Patterns: Elements of Reusable Object-Oriented Software”, ra mắt <b>21/10/1994</b> tại hội nghị OOPSLA (sách ghi bản quyền 1995).</li>
<li><b>23 mẫu</b>, 3 nhóm: khởi tạo (creational) · cấu trúc (structural) · hành vi (behavioral).</li>
<li>Ý tưởng “mẫu” mượn từ kiến trúc sư <b>Christopher Alexander</b> (<i>A Pattern Language</i>, 1977) — chính sách GoF trích ông ở chương 1.</li>
<li>2005: giải <b>ACM SIGPLAN Programming Languages Achievement Award</b>.</li>
</ul>
${o('Không học lại ở đây: Chương 4 (bài <b>4.A–4.F</b>) đã có từng pattern + SOLID + Java chạy thật + chỗ Spring dùng. Deck này chỉ đặt GoF vào đúng chỗ trên dòng thời gian.')}` },

  /* 15 */
  { t: 'Gomaa và COMET: phương pháp của môn SWD392', body: `
<div style="display:flex;gap:6px">
${hop('1984', 'DARTS — thiết kế hệ thời gian thực')}${mui}
${hop('1993', 'CODARTS — thêm module che giấu thông tin + task đồng thời')}${mui}
${hop('2000', 'COMET bản đầu, dựa UML 1.3')}${mui}
${hop('2011', '<b>Software Modeling and Design</b> — COMET trên UML 2', '#2f7d4f', '#f1f9f4')}
</div>
<ul>
<li><b>Hassan Gomaa</b>, Đại học George Mason. COMET = <b>Collaborative Object Modeling and Architectural Design Method</b>.</li>
<li>COMET ghép mọi thứ ở các slide trước: use case (Jacobson), mô hình tĩnh (OMT), statechart (Harel), che giấu thông tin (Parnas), vòng đời USDP.</li>
<li>Ba mô hình: <b>yêu cầu</b> (use case) → <b>phân tích</b> (lớp, tương tác, trạng thái) → <b>thiết kế</b> (kiến trúc).</li>
</ul>` },

  /* 16 */
  { t: 'Agile 2001 và “UML làm bản phác” (Fowler)', body: `
<ul>
<li><b>11–13/2/2001</b>, Snowbird (Utah, Mỹ): <b>17 người</b> viết Tuyên ngôn Agile — “phần mềm chạy được hơn tài liệu toàn diện”.</li>
<li>Agile không bỏ thiết kế; nó bỏ <span class="do">tài liệu không ai đọc</span>. Martin Fowler (một người ký) chia ba cách dùng UML:</li>
</ul>
${bang([
    ['Bản phác (sketch)', 'vẽ chọn lọc để trao đổi ý tưởng, bảng trắng, vẽ xong có thể bỏ', 'phổ biến nhất (theo Fowler)'],
    ['Bản thiết kế (blueprint)', 'đầy đủ, chi tiết, người khác cầm vào code theo', 'đồ án, hợp đồng, hệ an toàn'],
    ['Ngôn ngữ lập trình', 'sinh code thẳng từ mô hình (MDA)', 'hiếm'],
  ], ['Chế độ', 'Nghĩa là', 'Gặp ở đâu'], 'font-size:19px')}
<p class="nho">Fowler &amp; Steve Mellor nêu ba chế độ này trong <i>UML Distilled</i> (ch.1); bliki “UmlMode”, 28/5/2003.</p>` },

  /* 17 */
  { t: 'Sơ đồ dạng code: PlantUML và Mermaid', body: `<div class="hai" style="grid-template-columns:1fr 1fr;gap:18px">
<div><ul>
<li><b>PlantUML</b> — Arnaud Roques, 2009, viết bằng Java: chữ → ảnh UML.</li>
<li><b>Mermaid</b> — Knut Sveidqvist, JavaScript, vẽ ngay trong trình duyệt.</li>
<li><b>14/2/2022</b>: GitHub hiển thị khối <code>mermaid</code> trong Markdown.</li>
<li>Lợi ích: nằm trong Git, <b>diff/review như code</b>, đổi tên lớp một chỗ.</li>
</ul></div>
<div>${code(`@startuml
actor Member
participant ReservationController
participant ReservationService
Member -> ReservationController : POST /reservations
ReservationController -> ReservationService : reserve(cmd)
ReservationService --> ReservationController : 201 Created
@enduml`, 'plaintext')}</div></div>
${o('Hướng dẫn Report 4 của LabFlow: lưu sơ đồ ở <code>docs/diagrams/sds/*.puml</code>; mọi sơ đồ trong bài giảng SWD392 cũng là PlantUML dựng thật.', 'xanh')}` },

  /* 18 */
  { t: 'Mô hình C4 (Simon Brown): bốn mức phóng to', body: `
${bang([
    ['1 · Context', 'hệ thống + người dùng + hệ bên ngoài', 'mọi người, cả khách hàng'],
    ['2 · Container', 'các phần chạy được: web app, API, CSDL', 'lập trình viên, vận hành'],
    ['3 · Component', 'khối bên trong một container', 'lập trình viên'],
    ['4 · Code', 'class diagram (thường để IDE sinh)', 'khi thật cần'],
  ], ['Mức', 'Cho thấy', 'Ai đọc'], 'font-size:18px')}
${c4LabFlow}
<p class="nho">Gốc ~2006–2009, đặt tên các loại sơ đồ đầu 2010, tên “C4” đầu 2011 (FAQ c4model.com). Học sâu: software-architecture bài 2.1–2.2.</p>` },

  /* 19 */
  { t: 'ADR (Michael Nygard, 2011): ghi lại vì sao chọn', body: `<div class="hai" style="grid-template-columns:1.05fr 1fr;gap:18px">
<div><ul>
<li>Bài blog <b>15/11/2011</b> “Documenting Architecture Decisions”.</li>
<li>Mỗi quyết định một file ngắn, <b>đánh số tăng dần, không dùng lại số</b>, cất trong repo.</li>
<li>Năm phần: <b>Title · Context · Decision · Status · Consequences</b>.</li>
<li>Trạng thái: proposed → accepted → deprecated / superseded (bị thay vẫn giữ file).</li>
<li>Thoughtworks Radar: ADR nhẹ ở mức <b>Adopt</b> từ 11/2017.</li>
</ul></div>
<div>${code(`# ADR-001: Một khối Spring Boot (modular monolith)
Status: Accepted
Context: SEP490 chỉ 10 tuần; đặt chỗ cần
  transaction chặt giữa Reservation và Waitlist.
Decision: một ứng dụng Spring Boot, chia module
  theo nghiệp vụ, gọi nhau qua interface.
Consequences: (+) transaction đơn giản, deploy 1 lần
  (-) phải tự giữ ranh giới module`, 'markdown')}</div></div>
${o('Hội đồng hỏi “vì sao em chọn X?” — ADR chính là câu trả lời viết sẵn. Học sâu: software-architecture bài 2.3.')}` },

  /* 20 */
  { t: 'Công ty thật vẽ sơ đồ gì, khi nào?', body: `<div class="hai" style="grid-template-columns:1fr 1.15fr;gap:18px">
<div>
<p><b>Marian Petre, ICSE 2013</b> — phỏng vấn 50 kỹ sư ở 50 công ty:</p>
${bang([['Không dùng UML', '35'], ['Dùng chọn lọc', '11'], ['Sinh code tự động', '3'], ['Vẽ bù sau khi xong', '1'], ['Dùng trọn vẹn', '0']], ['Cách dùng UML', 'Số người'], 'font-size:18px')}
<p class="nho">11 người chọn lọc dùng: class 7 · sequence 6 · activity 6 · state 3 · use case 1. Mẫu nhỏ, năm 2013 — <b>không có số liệu tin cậy cho cả ngành</b>.</p></div>
<div>${bang([
    ['Bảng trắng / buổi họp', 'phác sequence, class (sketch)'],
    ['README / wiki dự án', 'C4 context + container'],
    ['Luồng khó (thanh toán, đặt chỗ)', 'sequence, state machine'],
    ['Thiết kế CSDL', 'ERD'],
    ['Quyết định lớn', 'ADR'],
    ['Đồ án, hợp đồng', 'đủ bộ UML (blueprint)'],
  ], ['Tình huống (kinh nghiệm thực hành)', 'Hay vẽ'], 'font-size:18px')}</div></div>` },

  /* 21 */
  { t: 'Bản đồ đi tiếp sau SWD392', body: `
${bang([
    ['<b>SWD392</b> (môn này)', 'vẽ gì, mô hình hoá thế nào', 'UML, COMET, GoF, SOLID'],
    ['<b>software-architecture</b>', 'quyết định cấu trúc thế nào, ghi lại ra sao', 'C4, ADR, phong cách kiến trúc, clean/hexagonal, DDD, sự kiện, ATAM'],
    ['<b>spring-boot</b>', 'biến sơ đồ thành code Java', 'IoC/DI, JPA, REST, bảo mật'],
    ['<b>system-design</b>', 'phục vụ nhiều người dùng thế nào', 'ước lượng, cache, hàng đợi, mở rộng'],
    ['<b>distributed-systems</b>', 'vì sao nhiều máy lại khó', 'lỗi mạng, đồng hồ, đồng thuận'],
  ], ['Khoá trên cuongthai.com', 'Trả lời câu hỏi', 'Nội dung chính'], 'font-size:19px')}
${o('Thứ tự gợi ý cho người làm LabFlow: xong SWD392 → <b>spring-boot</b> (code đồ án) song song <b>software-architecture</b> Ch.2 (C4 + ADR cho Report 4) → system-design → distributed-systems.', 'xanh')}` },

  /* 22 */
  { t: 'Tổng kết: gần 60 năm trong một trang', body: `
${bang([
    ['1967', 'Simula 67 — lớp, đối tượng', '1994', 'GoF — 23 mẫu'],
    ['1968', 'NATO Garmisch · thư GOTO', '1997', 'OMG thông qua UML 1.1'],
    ['1972', 'Parnas — che giấu thông tin', '1998', 'RUP 5.0'],
    ['1974', 'Structured Design — coupling/cohesion', '2001', 'Tuyên ngôn Agile'],
    ['1987', 'Harel — statechart', '2005 / 2011', 'UML 2.0 / COMET trên UML 2'],
    ['1991–92', 'Booch, OMT, OOSE', '2009 · 2011', 'PlantUML · ADR (Nygard), tên C4'],
  ], ['Năm', 'Sự kiện', 'Năm', 'Sự kiện'], 'font-size:18px')}
<p><b>Ba câu phỏng vấn nên trả lời được:</b> vì sao coupling thấp + cohesion cao? · information hiding khác encapsulation thế nào? · UML là phương pháp hay ký pháp — và công ty thật dùng nó ra sao?</p>` },
]);
