/**
 * PRO192 · 🏁 Dự án cuối khoá — CT Library 1.0 (đặc tả + làm mẫu + rubric; thi DA1 + DA-FE1).
 * Bài 🏗️ LAB CT Library (chuẩn LAB211, deck tự dựng): pro192-du-an-ct-library.
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/PRO192/gen/gen.mjs từ gen/src/**, gen/java/** và gen/uml/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node PRO192/gen/gen.mjs`.
 */

import { registerDeck, walk, bi } from './_slides.mjs';

registerDeck('da', { code: 'PRO192 Final project', en: 'Final project — CT Library 1.0', vi: 'Dự án cuối khoá — CT Library 1.0', total: 18, w: 1280, h: 720 });

/* ───────── 🏁 Final project — CT Library 1.0: spec, data, architecture, worked samples, rubric, timed paper ───────── */
const L_da = {
  title: '🏁 Final project — CT Library 1.0: spec, data, architecture, worked samples, rubric, timed paper|||🏁 Dự án cuối khoá — CT Library 1.0: đặc tả, dữ liệu, kiến trúc, làm mẫu, rubric, bản thi có giờ',
  slug: 'pro192-du-an-ct-library',
  type: 'VIDEO',
  description: 'Dự án cuối khoá PRO192: ghép 9 lab CT Library thành một ứng dụng thật cho câu lạc bộ đọc sách. Đặc tả như việc thật — user story của thủ thư, thành viên và trưởng CLB; quy tắc nghiệp vụ (sinh viên mượn tối đa 3, cán bộ 5; sách 14 ngày, tạp chí 7, DVD 3; phạt theo ngày, sinh viên giảm 50%, cán bộ miễn 2 ngày đầu; khoá thẻ khi nợ trên 50.000đ); dữ liệu mẫu tất định 200 tài liệu, 300 thành viên, 2.000 lượt mượn (mỗi tệp cố ý có một dòng hỏng); ba báo cáo (top mượn, quá hạn, doanh thu phạt theo tháng). Kiến trúc theo chuẩn review LAB211 với sơ đồ lớp, làm mẫu ba phần khó (chính sách phí kiểu Strategy, LoanService và ngoại lệ, kho trên tệp CSV), tám TODO chấm điểm có gợi ý từng bậc, bộ chấm hai lần chạy 557 dòng, rubric 100 điểm. Sau đó: bản thi có giờ 90 phút kiểu PE và trắc nghiệm tổng 50 câu trong Phòng thi, và chặng tiếp — PostgreSQL, cấu trúc dữ liệu tự viết, Spring Boot — trên cùng các interface.',
  content: [
    bi(`<span class="eyebrow">🏁 Final project · CT Library 1.0</span>
<h2>Final project — CT Library 1.0</h2>
<p class="lead">Nine labs built CT Library one piece at a time: a book list, real classes, encapsulation, inheritance, interfaces, business exceptions, arrays, collections, a CSV file. The final project puts all of it into ONE application the reading club can actually use: three data files, members with cards, loans with due dates, fines, a card that locks itself, and the three reports the club asked for. It is graded like a real hand-over — a spec, acceptance criteria, an automatic grader and a 100-point rubric — and then you sit a 90-minute timed paper on the same domain.</p>
<p>How this lesson works: section 1 is the spec as the club would write it; sections 2–4 are the data and the design (read them before you open NetBeans); section 5 works through the three hard parts with real code — the starter GIVES you those; section 6 lists the eight graded TODOs with hints step by step, but no solution; sections 7–9 are the grader, the rubric and the exam room. Plan <strong>12–15 hours</strong> over a week, in small Git commits.</p>`,
    `<span class="eyebrow">🏁 Dự án cuối khoá · CT Library 1.0</span>
<h2>Dự án cuối khoá — CT Library 1.0</h2>
<p class="lead">Chín lab đã dựng CT Library từng mảnh: danh sách sách, lớp thật, đóng gói, kế thừa, interface, ngoại lệ nghiệp vụ, mảng, collections, tệp CSV. Dự án cuối khoá đặt tất cả vào MỘT ứng dụng mà câu lạc bộ đọc sách dùng được thật: ba tệp dữ liệu, thành viên có thẻ, lượt mượn có hạn trả, tiền phạt, thẻ tự khoá, và ba báo cáo CLB cần. Bài được chấm như một lần bàn giao thật — có đặc tả, tiêu chí nghiệm thu, bộ chấm tự động và rubric 100 điểm — rồi bạn làm một bản thi có giờ 90 phút trên đúng domain đó.</p>
<p>Bài học này đi như sau: mục 1 là đặc tả đúng như CLB sẽ viết; mục 2–4 là dữ liệu và thiết kế (đọc trước khi mở NetBeans); mục 5 làm mẫu ba phần khó bằng code thật — starter CHO SẴN các phần đó; mục 6 liệt kê tám TODO được chấm điểm kèm gợi ý từng bậc, nhưng không có lời giải; mục 7–9 là bộ chấm, rubric và Phòng thi. Dành khoảng <strong>12–15 giờ</strong> trong một tuần, commit Git từng bước nhỏ.</p>`),
    bi(`<h2>📑 Slide by slide — PRO192 Final project (18 slides)</h2>
<p>The deck of the final project, made for CT Library 1.0 (it is not a school deck). Each slide is followed by its key idea and the explanation. Every piece of code and every output comes from the real project — <code>lint.py</code> clean, compiled with <code>javac --release 8</code>, run on a real JDK 8 — but the slides show only what the starter GIVES you and the worked samples: the graded parts (TODO DA.1–DA.8) are yours to write.</p>`,
    `<h2>📑 Học theo từng slide — PRO192 Final project (18 slide)</h2>
<p>Bộ slide của dự án cuối khoá, dựng riêng cho CT Library 1.0 (không phải slide của trường). Dưới mỗi slide là ý chính và lời giảng. Mọi đoạn code, mọi output đều lấy từ dự án thật — <code>lint.py</code> sạch, biên dịch <code>javac --release 8</code>, chạy trên JDK 8 thật — nhưng slide chỉ hiện phần starter CHO SẴN và các phần làm mẫu: phần chấm điểm (TODO DA.1–DA.8) là việc của bạn.</p>`),
    walk('da', [
      [1, 'Final project — CT Library 1.0',
        `<p class="y-chinh">🎯 CT Library 1.0 = the nine labs in one app: three CSV files, loan rules, late fees, a card that locks, three reports — then a 90-minute timed paper.</p>
<p>The project is not a new topic. It is the course's topics working together on real-size data (200 items, 300 members, 2,000 loans) — which is exactly where small design mistakes start to hurt.</p>`,
        `<p class="y-chinh">🎯 CT Library 1.0 = chín lab trong một ứng dụng: ba tệp CSV, luật mượn, phí trễ, thẻ tự khoá, ba báo cáo — rồi một bản thi có giờ 90 phút.</p>
<p>Dự án không phải chủ đề mới. Nó là các chủ đề của khoá cùng làm việc trên dữ liệu cỡ thật (200 tài liệu, 300 thành viên, 2.000 lượt mượn) — đúng chỗ mà những lỗi thiết kế nhỏ bắt đầu gây đau.</p>`],
      [2, 'The brief from the reading club',
        `<p class="y-chinh">🎯 The club gives the numbers and the rules in its own words; "done" is measured: PASS 557/557 after a reopen, lint.py clean, 8 TODOs, no crash on broken lines, at least 10 commits.</p>
<p>Read a brief twice: once for what the users want, once for what can be CHECKED. Every sentence of the club becomes either a rule in code (a constant, a method, an exception) or a line in the grader's expected output.</p>`,
        `<p class="y-chinh">🎯 CLB đưa con số và luật bằng lời của họ; "xong" thì đo được: PASS 557/557 sau khi mở lại, lint.py sạch, 8 TODO, không sập vì dòng hỏng, ít nhất 10 commit.</p>
<p>Đọc một bản yêu cầu hai lần: một lần xem người dùng muốn gì, một lần xem cái gì KIỂM được. Mỗi câu của CLB thành hoặc một luật trong code (một hằng, một phương thức, một ngoại lệ), hoặc một dòng trong output mong đợi của bộ chấm.</p>`],
      [3, 'User stories — who needs what',
        `<p class="y-chinh">🎯 Seven user stories in the form "As a … I want … so that …" — each one is a menu item or a report you can demonstrate.</p>
<p>The "so that" part is the reason the feature exists, and it tells you what to test: a return must show the fine at once because the member pays at the desk; the data must survive a closed laptop because nothing typed on Saturday may be lost on Monday.</p>`,
        `<p class="y-chinh">🎯 Bảy user story dạng "Là … tôi muốn … để …" — mỗi story là một mục menu hoặc một báo cáo bạn trình diễn được.</p>
<p>Vế "để …" là lý do tính năng tồn tại, và nó nói bạn phải kiểm cái gì: trả sách phải hiện tiền phạt ngay vì thành viên nộp tại quầy; dữ liệu phải sống qua lần gập máy vì thứ gõ vào thứ bảy không được mất vào thứ hai.</p>`],
      [4, 'Business rules — one place each',
        `<p class="y-chinh">🎯 Every business rule lives in exactly ONE place — a polymorphic method, a fee policy, a check in LoanService — and every number is a constant.</p>
<p>When the club changes "3 items" to "4 items", one constant changes. When a new card type appears, one class is added. If a rule is written in two places, the two copies will drift apart; the lecturer's "no hard-coding" rule is the same idea seen from the review side.</p>`,
        `<p class="y-chinh">🎯 Mỗi quy tắc nghiệp vụ nằm ở đúng MỘT chỗ — một phương thức đa hình, một chính sách phí, một phép kiểm trong LoanService — và mọi con số là một hằng.</p>
<p>CLB đổi "3 tài liệu" thành "4 tài liệu" thì đổi một hằng. Có loại thẻ mới thì thêm một lớp. Luật viết ở hai chỗ thì hai bản sẽ lệch nhau; luật "không hardcode" của thầy là cùng ý đó nhìn từ phía review.</p>`],
      [5, 'The fine: type of item × type of card',
        `<p class="y-chinh">🎯 Fine = policy of the CARD applied to (days late, fee per day of the ITEM): a student returning a book 14 days late pays 14 × 2,000 × 50% = 14,000đ; a staff member 11 days late pays (11 − 2) × 2,000 = 18,000đ.</p>
<p>Two independent hierarchies meet in one line of code. The item answers "how long, how much per day" by polymorphism (Lab 4); the card picks a fee policy (Lab 5, Strategy). Keeping them apart is what lets either side change without touching the other.</p>`,
        `<p class="y-chinh">🎯 Tiền phạt = chính sách của THẺ áp lên (số ngày trễ, phí mỗi ngày của TÀI LIỆU): sinh viên trả sách trễ 14 ngày nộp 14 × 2.000 × 50% = 14.000đ; cán bộ trễ 11 ngày nộp (11 − 2) × 2.000 = 18.000đ.</p>
<p>Hai cây kế thừa độc lập gặp nhau trong một dòng code. Tài liệu trả lời "mượn bao lâu, mỗi ngày trễ bao nhiêu" bằng đa hình (Lab 4); thẻ chọn chính sách phí (Lab 5, Strategy). Giữ hai bên tách nhau thì bên nào đổi cũng không đụng bên kia.</p>`],
      [6, 'Borrowing: three rules, checked in order',
        `<p class="y-chinh">🎯 A borrow is refused for the FIRST rule it breaks, in this order: card locked, limit reached, no copy left — each with its own checked exception and its own message.</p>
<p>The order is part of the spec. A locked member who is also at the limit must hear "pay first", because paying is the only thing that helps. The four real lines on the slide are the four outcomes from the grader's run.</p>`,
        `<p class="y-chinh">🎯 Lượt mượn bị từ chối theo luật ĐẦU TIÊN nó vi phạm, theo thứ tự: thẻ khoá, hết hạn mức, hết bản — mỗi luật một ngoại lệ checked riêng và một câu báo riêng.</p>
<p>Thứ tự là một phần của đặc tả. Thành viên vừa bị khoá vừa hết hạn mức phải nghe "nộp phạt trước", vì nộp phạt là việc duy nhất giúp được. Bốn dòng thật trên slide là bốn kết cục trong lần chạy của bộ chấm.</p>`],
      [7, 'Sample data: deterministic, with one trap per file',
        `<p class="y-chinh">🎯 Three CSV files generated by a script with a fixed seed — run it again, get the same bytes — and each file hides exactly one broken line.</p>
<p>Deterministic data is what makes an automatic grader possible: the reports have one correct answer. The broken lines are the test of section 4's rule "a broken line is a message, never a crash".</p>`,
        `<p class="y-chinh">🎯 Ba tệp CSV do một script sinh với hạt giống cố định — chạy lại ra đúng từng byte — và mỗi tệp giấu đúng một dòng hỏng.</p>
<p>Dữ liệu tất định là thứ làm bộ chấm tự động khả thi: báo cáo có đúng một đáp án. Các dòng hỏng là phép thử cho luật ở mục 4: "dòng hỏng là một câu báo, không bao giờ làm sập".</p>`],
      [8, "Architecture — the lecturer's layers",
        `<p class="y-chinh">🎯 Main → controller (holds the repositories, does the CRUD) → service (rules only, on the data it is given) → view (prints); dto travels between layers, constants are read by everyone.</p>
<p>The two red "✗" are what the review checks first: a controller never imports a model class, a service never holds a repository. Main never sees a repository either — it only talks to controllers.</p>`,
        `<p class="y-chinh">🎯 Main → controller (giữ repository, làm CRUD) → service (chỉ luật, trên dữ liệu được đưa vào) → view (in); dto đi giữa các tầng, constants ai cũng đọc.</p>
<p>Hai dấu "✗" đỏ là thứ review kiểm đầu tiên: controller không import lớp model, service không giữ repository. Main cũng không thấy repository nào — nó chỉ nói chuyện với controller.</p>`],
      [9, 'Class diagram — the core',
        `<p class="y-chinh">🎯 Three abstractions carry the design: LibraryItem (abstract, 3 subclasses), Member (abstract, 2 subclasses), IFeePolicy (interface, 2 strategies) — LoanService holds the strategies in a HashMap.</p>
<p>Count the "if (type == …)" this removes: none in the loan rules, none in the fee formula, none in the reports. The only places that ask "which type?" are the two factories that turn a CSV line or a form into an object.</p>`,
        `<p class="y-chinh">🎯 Ba trừu tượng gánh thiết kế: LibraryItem (abstract, 3 lớp con), Member (abstract, 2 lớp con), IFeePolicy (interface, 2 chiến lược) — LoanService giữ các chiến lược trong một HashMap.</p>
<p>Đếm số câu "if (type == …)" mà thiết kế này bỏ được: không câu nào trong luật mượn, không câu nào trong công thức phí, không câu nào trong báo cáo. Chỗ duy nhất hỏi "loại nào?" là hai nhà máy biến một dòng CSV hay một phiếu nhập thành đối tượng.</p>`],
      [10, 'Three repositories, one way of saving',
        `<p class="y-chinh">🎯 Three repository interfaces, three file implementations, ONE CsvUtils that every load and save goes through: UTF-8 named, BOM removed, broken lines reported, temp file then move, .bak before the first save after a broken line.</p>
<p>Lab 9 solved the file problem for books; the project generalises it. The starter gives FileLoanRepository complete as the model to copy; FileMemberRepository's load and save are two of your TODOs.</p>`,
        `<p class="y-chinh">🎯 Ba interface kho, ba bản cài trên tệp, MỘT CsvUtils mà mọi lần nạp và lưu đều đi qua: gọi tên UTF-8, bỏ BOM, báo dòng hỏng, ghi tệp tạm rồi move, giữ .bak trước lần lưu đầu sau khi gặp dòng hỏng.</p>
<p>Lab 9 giải bài toán tệp cho sách; dự án tổng quát hoá nó. Starter cho sẵn FileLoanRepository đầy đủ làm khuôn để chép; nạp và lưu của FileMemberRepository là hai TODO của bạn.</p>`],
      [11, 'One borrow, through the layers (given)',
        `<p class="y-chinh">🎯 Main builds a LoanRequestDTO; LoanController fetches member and item, asks LoanService for a loan, writes the loan BEFORE removing a copy, then hands one line to LoanView — one try, one catch.</p>
<p>The order of the two writes matters: if the loan is refused (already borrowing that item), no copy has left the shelf. In a database this pair becomes a transaction — the "next leg" slide comes back to it.</p>`,
        `<p class="y-chinh">🎯 Main dựng LoanRequestDTO; LoanController lấy thành viên và tài liệu, nhờ LoanService lập lượt mượn, ghi lượt TRƯỚC rồi mới trừ một bản, cuối cùng đưa một dòng cho LoanView — một try, một catch.</p>
<p>Thứ tự hai lần ghi là quan trọng: lượt mượn bị từ chối (đang mượn tài liệu đó rồi) thì chưa bản nào rời kệ. Trong cơ sở dữ liệu, cặp này thành một transaction — slide "chặng tiếp" quay lại chuyện đó.</p>`],
      [12, 'LoanService.createLoan — the worked sample',
        `<p class="y-chinh">🎯 Three ifs, three throws, then the loan: borrow date = working date, due date = working date + the item's loan days. The service throws — it never prints and never catches.</p>
<p>This is the method the starter gives you as the model for every business rule. Its sibling closeLoan (TODO DA.1) follows the same shape: one check that throws, then fill the record.</p>`,
        `<p class="y-chinh">🎯 Ba lệnh if, ba lệnh throw, rồi lập lượt mượn: ngày mượn = ngày làm việc, hạn trả = ngày làm việc + số ngày mượn của tài liệu. Service ném — không bao giờ in, không bao giờ bắt.</p>
<p>Đây là phương thức starter cho sẵn làm khuôn cho mọi luật nghiệp vụ. Anh em của nó, closeLoan (TODO DA.1), đi đúng dáng đó: một phép kiểm có throw, rồi điền bản ghi.</p>`],
      [13, 'Fee policies — Strategy in a HashMap',
        `<p class="y-chinh">🎯 LoanService keeps HashMap&lt;Integer, IFeePolicy&gt;; findPolicy(memberType) returns the strategy, and one line computes the fee for any card type.</p>
<p>A new card type is a new class plus one put — no formula that already works is touched (open/closed). And because the fine is stored at return time, changing a policy never rewrites last month's revenue.</p>`,
        `<p class="y-chinh">🎯 LoanService giữ HashMap&lt;Integer, IFeePolicy&gt;; findPolicy(memberType) trả về chiến lược, và một dòng tính phí cho mọi loại thẻ.</p>
<p>Loại thẻ mới là một lớp mới cộng một lệnh put — không công thức nào đang chạy đúng bị đụng tới (mở/đóng). Và vì tiền phạt được lưu lúc trả, đổi chính sách không bao giờ viết lại doanh thu tháng trước.</p>`],
      [14, 'Three reports, from one bundle of data',
        `<p class="y-chinh">🎯 The controller copies the three repositories into ONE LibraryDataDTO; ReportService counts loans per item (HashMap), indexes members and items by id (HashMap) and groups fines by month (TreeMap&lt;YearMonth, …&gt;).</p>
<p>The outputs on the slide are the real first rows on the working date 15/10/2026. Ties are broken by id so the result is deterministic — the grader compares character by character.</p>`,
        `<p class="y-chinh">🎯 Controller chép ba kho thành MỘT LibraryDataDTO; ReportService đếm lượt theo tài liệu (HashMap), lập chỉ mục thành viên và tài liệu theo mã (HashMap) và gom tiền phạt theo tháng (TreeMap&lt;YearMonth, …&gt;).</p>
<p>Output trên slide là các dòng đầu thật ở ngày làm việc 15/10/2026. Bằng nhau thì xếp theo mã để kết quả tất định — bộ chấm so từng ký tự.</p>`],
      [15, 'The grader: run, reopen, compare 557 lines',
        `<p class="y-chinh">🎯 check.sh runs the program with 75 typed lines, then REOPENS it in the same folder with 9 more, and compares 557 lines: the solution passes, the starter fails at line 1.</p>
<p>The reopen is the test of saving. A program that keeps everything in memory can pass the first half and still lose every change in the second.</p>`,
        `<p class="y-chinh">🎯 check.sh chạy chương trình với 75 dòng gõ vào, rồi MỞ LẠI nó trong cùng thư mục với 9 dòng nữa, và so 557 dòng: lời giải qua, starter trượt ngay dòng 1.</p>
<p>Lần mở lại là phép thử của việc lưu. Chương trình giữ mọi thứ trong bộ nhớ có thể qua nửa đầu mà vẫn mất mọi thay đổi ở nửa sau.</p>`],
      [16, 'Rubric — 100 points',
        `<p class="y-chinh">🎯 Functions 50 · OOP and design 25 · exceptions and files 15 · clean code and Git 10 — the grader only covers part of the 50.</p>
<p>Half the points are earned by reading your code: layers, polymorphism without type checks, the exception family caught once, files written safely, commits that tell a story. Two oral questions close the review.</p>`,
        `<p class="y-chinh">🎯 Chức năng 50 · OOP và thiết kế 25 · ngoại lệ và tệp 15 · code sạch và Git 10 — bộ chấm chỉ phủ một phần của 50 điểm.</p>
<p>Một nửa số điểm đến từ việc đọc code của bạn: các tầng, đa hình không cần kiểm kiểu, họ ngoại lệ bắt một lần, tệp ghi an toàn, các commit kể được câu chuyện. Hai câu vấn đáp khép lại buổi review.</p>`],
      [17, 'Then: the 90-minute timed paper',
        `<p class="y-chinh">🎯 PRO192-DA1: four PE-style questions on the same domain in 90 minutes; PRO192-DA-FE1: 50 questions over the nine chapters — both in the Exam room.</p>
<p>The timed paper uses NEW small classes (Book/SpecBook, LoanList, ICode, CommandProcessor), not the project's code: it checks that the ideas are in your hands, under time, in the exam format.</p>`,
        `<p class="y-chinh">🎯 PRO192-DA1: bốn câu kiểu PE trên cùng domain trong 90 phút; PRO192-DA-FE1: 50 câu trắc nghiệm qua chín chương — cả hai trong Phòng thi.</p>
<p>Bản thi có giờ dùng các lớp nhỏ MỚI (Book/SpecBook, LoanList, ICode, CommandProcessor), không dùng code của dự án: nó kiểm rằng các ý tưởng đã nằm trong tay bạn, dưới áp lực thời gian, đúng hình thức phòng thi.</p>`],
      [18, 'The next legs keep the same interfaces',
        `<p class="y-chinh">🎯 PostgreSQL (JdbcXxxRepository), CSD201 (MyHashMap, MyLinkedList, BST behind the repositories) and Spring Boot (the container replaces AppController) are swaps behind the same interfaces — not rewrites.</p>
<p>That is the real payoff of the design: the next three courses reuse CT Library 1.0, and the parts you change are exactly the parts the interfaces isolate.</p>`,
        `<p class="y-chinh">🎯 PostgreSQL (JdbcXxxRepository), CSD201 (MyHashMap, MyLinkedList, BST đứng sau các kho) và Spring Boot (container thay AppController) là những lần thay sau cùng các interface — không phải viết lại.</p>
<p>Đó là phần thưởng thật của thiết kế: ba môn tiếp theo dùng lại CT Library 1.0, và những phần bạn thay đúng là những phần mà interface đã cô lập.</p>`],
    ]),
    bi(`<h2>1. The spec — as the club wrote it</h2>
<div class="callout"><p><strong>CT Library 1.0 · reading club CuongThai · hand-over in one week.</strong> "We have about 200 items (books, magazines, DVDs), 300 members and a year of loans in Excel. Students may hold 3 items at once, staff 5. A book is lent for 14 days, a magazine for 7, a DVD for 3. Every late day costs money — 2,000đ for a book, 1,000đ for a magazine, 5,000đ for a DVD — students pay half, staff get the first two late days free. Anyone who owes more than 50,000đ cannot borrow until they pay. Every month we want to know what is popular, who is late, and how much we collected in fines. And please: nothing typed in may be lost when the laptop is closed." — the club leader</p></div>
<h3>User stories</h3>
<table>
<thead><tr><th>#</th><th>As a…</th><th>I want to…</th><th>so that…</th></tr></thead>
<tbody>
<tr><td>1</td><td>librarian</td><td>find an item by part of its title</td><td>I can tell a member at once if it is on the shelf</td></tr>
<tr><td>2</td><td>librarian</td><td>add a new item or a new member</td><td>the catalogue grows without editing files by hand</td></tr>
<tr><td>3</td><td>librarian</td><td>lend an item in one step (member id + item id)</td><td>the rules are checked for me, not by memory</td></tr>
<tr><td>4</td><td>librarian</td><td>take a return and see the fine immediately</td><td>the member pays at the desk</td></tr>
<tr><td>5</td><td>librarian</td><td>take a payment that unlocks the card</td><td>the member can borrow again the same day</td></tr>
<tr><td>6</td><td>member</td><td>see my loans, due dates, days late and debt on my card</td><td>I know what to bring back first</td></tr>
<tr><td>7</td><td>club leader</td><td>see top items, overdue loans and fines per month</td><td>we buy the right books and chase late ones</td></tr>
<tr><td>8</td><td>club leader</td><td>keep every change in files</td><td>nothing typed on Saturday is lost on Monday</td></tr>
</tbody>
</table>
<h3>Business rules</h3>
<table>
<thead><tr><th>Rule</th><th>Value</th><th>Acceptance check</th></tr></thead>
<tbody>
<tr><td>loan limit</td><td>Student 3 · Staff 5 open loans</td><td>the 4th (6th) borrow prints the limit message, nothing is written</td></tr>
<tr><td>loan period</td><td>Book 14 · Magazine 7 · DVD 3 days</td><td>due date = working date + days of the item's type</td></tr>
<tr><td>late fee per day</td><td>Book 2,000 · Magazine 1,000 · DVD 5,000đ</td><td>fine at return = policy(days late, fee per day)</td></tr>
<tr><td>fee policy</td><td>Student: × 50% · Staff: first 2 late days free</td><td>14 days late (book, student) = 14,000đ · 11 days (book, staff) = 18,000đ</td></tr>
<tr><td>card lock</td><td>debt <strong>&gt;</strong> 50,000đ</td><td>a locked member cannot borrow; exactly 50,000đ still can</td></tr>
<tr><td>order of checks</td><td>locked → limit → no copy left</td><td>the message is the one of the first broken rule</td></tr>
<tr><td>fine is stored</td><td>written once at return</td><td>changing a policy does not change past revenue</td></tr>
<tr><td>working date</td><td>asked at start (Enter = today), menu 11 changes it</td><td>every date in the run comes from it — no hidden <code>now()</code> in the rules</td></tr>
</tbody>
</table>
<h3>Reports</h3>
<ul>
<li><strong>Top 10</strong> items by number of loans (returned and still out); ties by item id.</li>
<li><strong>Overdue</strong>: open loans whose due date is before the working date, most days late first, with the fee the member would pay if returning today (by their card's policy).</li>
<li><strong>Fine revenue per month</strong>: returned loans with a fine, grouped by the month of the RETURN date, oldest month first, with a total line.</li>
</ul>
<div class="callout ok"><p><strong>Done means:</strong> <code>check.sh</code> prints <code>PASS: 557/557 dong khop expected.txt</code> (two runs: work, then reopen) · <code>lint.py</code> 0 violations · <code>javac --release 8</code> compiles · the 8 <code>TODO DA.x</code> are done and nothing given was rewritten · at least 10 commits in Git with messages a reviewer can read · you can answer the two oral questions of section 8.</p></div>`,
    `<h2>1. Đặc tả — đúng như CLB viết</h2>
<div class="callout"><p><strong>CT Library 1.0 · câu lạc bộ đọc sách CuongThai · bàn giao sau một tuần.</strong> "Chúng tôi có khoảng 200 tài liệu (sách, tạp chí, DVD), 300 thành viên và một năm lượt mượn trong Excel. Sinh viên được giữ 3 tài liệu cùng lúc, cán bộ 5. Sách cho mượn 14 ngày, tạp chí 7, DVD 3. Mỗi ngày trễ mất tiền — sách 2.000đ, tạp chí 1.000đ, DVD 5.000đ — sinh viên trả một nửa, cán bộ được miễn hai ngày trễ đầu. Ai nợ quá 50.000đ thì không được mượn cho tới khi nộp. Mỗi tháng chúng tôi muốn biết cái gì được mượn nhiều, ai đang trễ, và thu được bao nhiêu tiền phạt. Và làm ơn: thứ gì đã gõ vào thì không được mất khi gập máy." — trưởng CLB</p></div>
<h3>User story</h3>
<table>
<thead><tr><th>#</th><th>Là…</th><th>tôi muốn…</th><th>để…</th></tr></thead>
<tbody>
<tr><td>1</td><td>thủ thư</td><td>tìm tài liệu theo một phần của tên</td><td>trả lời thành viên ngay là còn trên kệ hay không</td></tr>
<tr><td>2</td><td>thủ thư</td><td>thêm tài liệu mới, thành viên mới</td><td>danh mục lớn lên mà không phải sửa tệp bằng tay</td></tr>
<tr><td>3</td><td>thủ thư</td><td>cho mượn trong một bước (mã thành viên + mã tài liệu)</td><td>luật được máy kiểm, không phải nhớ</td></tr>
<tr><td>4</td><td>thủ thư</td><td>nhận trả và thấy ngay tiền phạt</td><td>thành viên nộp luôn tại quầy</td></tr>
<tr><td>5</td><td>thủ thư</td><td>nhận tiền phạt để mở khoá thẻ</td><td>thành viên mượn tiếp được ngay trong ngày</td></tr>
<tr><td>6</td><td>thành viên</td><td>xem trên thẻ: các lượt đang mượn, hạn trả, số ngày trễ, tiền nợ</td><td>biết nên mang trả cuốn nào trước</td></tr>
<tr><td>7</td><td>trưởng CLB</td><td>xem top tài liệu, lượt quá hạn, tiền phạt theo tháng</td><td>mua đúng sách và đi đòi đúng người</td></tr>
<tr><td>8</td><td>trưởng CLB</td><td>mọi thay đổi được giữ trong tệp</td><td>thứ gõ vào thứ bảy không mất vào thứ hai</td></tr>
</tbody>
</table>
<h3>Quy tắc nghiệp vụ</h3>
<table>
<thead><tr><th>Quy tắc</th><th>Giá trị</th><th>Kiểm nghiệm thu</th></tr></thead>
<tbody>
<tr><td>hạn mức mượn</td><td>Sinh viên 3 · Cán bộ 5 lượt đang mở</td><td>lần mượn thứ 4 (thứ 6) in câu báo hạn mức, không ghi gì</td></tr>
<tr><td>thời hạn mượn</td><td>Sách 14 · Tạp chí 7 · DVD 3 ngày</td><td>hạn trả = ngày làm việc + số ngày của loại tài liệu</td></tr>
<tr><td>phí trễ mỗi ngày</td><td>Sách 2.000 · Tạp chí 1.000 · DVD 5.000đ</td><td>tiền phạt lúc trả = chính sách(số ngày trễ, phí mỗi ngày)</td></tr>
<tr><td>chính sách phí</td><td>Sinh viên: × 50% · Cán bộ: miễn 2 ngày trễ đầu</td><td>trễ 14 ngày (sách, sinh viên) = 14.000đ · trễ 11 ngày (sách, cán bộ) = 18.000đ</td></tr>
<tr><td>khoá thẻ</td><td>nợ <strong>&gt;</strong> 50.000đ</td><td>thành viên bị khoá không mượn được; nợ đúng 50.000đ vẫn mượn được</td></tr>
<tr><td>thứ tự kiểm</td><td>khoá → hạn mức → hết bản</td><td>câu báo là câu của luật bị vi phạm đầu tiên</td></tr>
<tr><td>tiền phạt được lưu</td><td>ghi một lần lúc trả</td><td>đổi chính sách không làm đổi doanh thu đã qua</td></tr>
<tr><td>ngày làm việc</td><td>hỏi lúc mở (Enter = hôm nay), menu 11 đổi được</td><td>mọi ngày trong lần chạy lấy từ đó — luật không giấu <code>now()</code> bên trong</td></tr>
</tbody>
</table>
<h3>Báo cáo</h3>
<ul>
<li><strong>Top 10</strong> tài liệu theo số lượt mượn (cả đã trả lẫn đang mượn); bằng nhau thì theo mã.</li>
<li><strong>Quá hạn</strong>: lượt đang mở có hạn trả trước ngày làm việc, trễ nhiều nhất lên đầu, kèm số tiền thành viên sẽ nộp nếu trả hôm nay (theo chính sách của thẻ).</li>
<li><strong>Doanh thu phạt theo tháng</strong>: các lượt đã trả có phạt, gom theo tháng của ngày TRẢ, tháng cũ trước, có dòng tổng.</li>
</ul>
<div class="callout ok"><p><strong>Xong nghĩa là:</strong> <code>check.sh</code> in <code>PASS: 557/557 dong khop expected.txt</code> (hai lần chạy: làm việc, rồi mở lại) · <code>lint.py</code> 0 vi phạm · <code>javac --release 8</code> biên dịch được · 8 <code>TODO DA.x</code> làm xong và không viết lại phần cho sẵn · ít nhất 10 commit Git với thông điệp người review đọc hiểu · trả lời được hai câu vấn đáp ở mục 8.</p></div>`),
    bi(`<h2>2. The sample data — three files, one seed</h2>
<p>The data is not typed: <code>sinh-du-lieu.mjs</code> simulates January → October 2026 day by day with the SAME rules as the spec — members borrow within their limit, nobody borrows with a locked card, most items come back on time, some late, some very late, fines are added to the debt at return, and members pay now and then. The random generator has a fixed seed (192), so running it again produces the same files byte for byte. That is what lets the grader expect one exact top-10, one exact overdue list and one exact revenue table.</p>
<table>
<thead><tr><th>File</th><th>Columns</th><th>Rows</th></tr></thead>
<tbody>
<tr><td><code>data/books.csv</code></td><td><code>loai,ma,ten,nam,so_ban,rieng_1,rieng_2</code> (Lab 9 format: book = ISBN + author, magazine = issue, DVD = minutes)</td><td>200 items: B001–B150, T151–T180, D181–D200 · UTF-8 with a BOM</td></tr>
<tr><td><code>data/members.csv</code></td><td><code>loai,ma,ho_ten,email,no</code> (1 = student, 2 = staff, last column = debt in đồng)</td><td>300 members, 49 of them staff</td></tr>
<tr><td><code>data/loans.csv</code></td><td><code>ma,ma_tv,ma_tl,ngay_muon,han_tra,ngay_tra,tien_phat</code> (dates yyyy-MM-dd, empty return date = still out)</td><td>2,000 loans, 79 still out on 14/10/2026</td></tr>
</tbody>
</table>
<p>Each file also hides <strong>one broken line</strong>, the kind a real export from Excel contains: a book whose ISBN check digit is wrong, a member whose e-mail has no domain, a loan dated 30 February. The program must load the 200 / 300 / 2,000 good rows and report the three bad ones with file and line number:</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ mkdir -p data &amp;&amp; cp harness/data/* data/        # du lieu mau, nhu bo cham
$ java -cp build main.Main &lt; harness/input.txt
$ java -cp build main.Main &lt; harness/input-2.txt   # MO LAI chuong trinh (lan 2)</code></pre>
<div class="out">Da nap: 200 tai lieu, 300 thanh vien, 2000 luot muon.<br>
Bo qua 3 dong hong (ban goc giu o tep .bak khi luu lan dau):<br>
&nbsp;&nbsp;- data/books.csv dong 62: ISBN sai chu so kiem tra: chu so cuoi phai la 2, ban nhap 0. Xem lai so in tren bia sach roi nhap lai.<br>
&nbsp;&nbsp;- data/members.csv dong 122: Email phai co dang ten@ten-mien.duoi, chi gom chu khong dau, chu so va . _ - (vi du an.nguyen@ctlibrary.example), ban nhap "tran.loi@ctlibrary". Moi nhap lai.<br>
&nbsp;&nbsp;- data/loans.csv dong 1002: Ngay "2026-02-30" khong hop le (dung dang yyyy-MM-dd, vi du 2026-10-15, ngay phai co that tren lich). Moi nhap lai.<br>
…</div>
<p>When the first save happens, the original file is kept as <code>.bak</code> (the bad line is still in it, for a human to fix) and the new file contains only valid rows — which is why the second run of the grader loads 201 / 301 / 2,004 rows and reports no broken line.</p>`,
    `<h2>2. Dữ liệu mẫu — ba tệp, một hạt giống</h2>
<p>Dữ liệu không gõ tay: <code>sinh-du-lieu.mjs</code> mô phỏng từ tháng 1 tới tháng 10/2026 từng ngày với ĐÚNG luật của đặc tả — thành viên mượn trong hạn mức, không ai mượn khi thẻ bị khoá, phần lớn tài liệu trả đúng hạn, một số trễ, một số trễ rất lâu, tiền phạt cộng vào nợ lúc trả, và thỉnh thoảng thành viên nộp tiền. Bộ sinh ngẫu nhiên có hạt giống cố định (192), nên chạy lại ra đúng các tệp đó, từng byte. Nhờ vậy bộ chấm mới chờ được đúng một top 10, đúng một danh sách quá hạn và đúng một bảng doanh thu.</p>
<table>
<thead><tr><th>Tệp</th><th>Các cột</th><th>Số dòng</th></tr></thead>
<tbody>
<tr><td><code>data/books.csv</code></td><td><code>loai,ma,ten,nam,so_ban,rieng_1,rieng_2</code> (định dạng Lab 9: sách = ISBN + tác giả, tạp chí = kỳ số, DVD = số phút)</td><td>200 tài liệu: B001–B150, T151–T180, D181–D200 · UTF-8 có BOM</td></tr>
<tr><td><code>data/members.csv</code></td><td><code>loai,ma,ho_ten,email,no</code> (1 = sinh viên, 2 = cán bộ, cột cuối = nợ tính bằng đồng)</td><td>300 thành viên, 49 cán bộ</td></tr>
<tr><td><code>data/loans.csv</code></td><td><code>ma,ma_tv,ma_tl,ngay_muon,han_tra,ngay_tra,tien_phat</code> (ngày yyyy-MM-dd, ngày trả trống = còn đang mượn)</td><td>2.000 lượt, 79 lượt còn đang mượn ngày 14/10/2026</td></tr>
</tbody>
</table>
<p>Mỗi tệp còn giấu <strong>một dòng hỏng</strong>, đúng loại mà tệp xuất từ Excel ngoài đời hay có: một cuốn sách sai chữ số kiểm tra ISBN, một thành viên có email thiếu tên miền, một lượt mượn ngày 30 tháng 2. Chương trình phải nạp đủ 200 / 300 / 2.000 dòng tốt và báo ba dòng xấu kèm tên tệp và số dòng:</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ mkdir -p data &amp;&amp; cp harness/data/* data/        # du lieu mau, nhu bo cham
$ java -cp build main.Main &lt; harness/input.txt
$ java -cp build main.Main &lt; harness/input-2.txt   # MO LAI chuong trinh (lan 2)</code></pre>
<div class="out">Da nap: 200 tai lieu, 300 thanh vien, 2000 luot muon.<br>
Bo qua 3 dong hong (ban goc giu o tep .bak khi luu lan dau):<br>
&nbsp;&nbsp;- data/books.csv dong 62: ISBN sai chu so kiem tra: chu so cuoi phai la 2, ban nhap 0. Xem lai so in tren bia sach roi nhap lai.<br>
&nbsp;&nbsp;- data/members.csv dong 122: Email phai co dang ten@ten-mien.duoi, chi gom chu khong dau, chu so va . _ - (vi du an.nguyen@ctlibrary.example), ban nhap "tran.loi@ctlibrary". Moi nhap lai.<br>
&nbsp;&nbsp;- data/loans.csv dong 1002: Ngay "2026-02-30" khong hop le (dung dang yyyy-MM-dd, vi du 2026-10-15, ngay phai co that tren lich). Moi nhap lai.<br>
…</div>
<p>Lần lưu đầu tiên giữ tệp gốc thành <code>.bak</code> (dòng hỏng vẫn còn trong đó để người sửa tay) và tệp mới chỉ còn dòng hợp lệ — vì thế lần chạy thứ hai của bộ chấm nạp 201 / 301 / 2.004 dòng và không báo dòng hỏng nào.</p>`),
    bi(`<h2>3. Architecture and class diagram</h2>
<p>The layers are the ones the LAB211 lecturer reviews, exactly as in Labs 1–9: <code>constants · model · dto · repository · service · controller · view · utils · exceptions · main</code>. Two rules decide most review comments: <strong>the controller holds the repositories and does the CRUD</strong>, and <strong>the service holds no repository</strong> — it only applies rules to the data the controller passes in. The controller never imports a model class (it works with DTOs); interfaces start with <code>I</code>; collections are declared as <code>ArrayList</code> / <code>HashMap</code>; no method takes more than two parameters (utils three).</p>
<table>
<thead><tr><th>Package</th><th>Classes</th><th>Job</th></tr></thead>
<tbody>
<tr><td><code>main</code></td><td><code>Main</code></td><td>Scanner, menu, reads and checks every input (through utils), one controller call per choice</td></tr>
<tr><td><code>controller</code></td><td><code>AppController</code>, <code>BookController</code>, <code>MemberController</code>, <code>LoanController</code>, <code>ReportController</code></td><td>AppController builds ONE instance of each repository and hands them to the controllers (dependency injection by hand); the others coordinate</td></tr>
<tr><td><code>service</code></td><td><code>LoanService</code>, <code>ReportService</code>, <code>BookService</code>, <code>IFeePolicy</code> + 2 policies</td><td>rules: borrow, return, pay, fee, lock; reports; search</td></tr>
<tr><td><code>repository</code></td><td><code>IBookRepository</code>, <code>IMemberRepository</code>, <code>ILoanRepository</code> + <code>File…</code> implementations</td><td>keep the data, load and save the three CSV files</td></tr>
<tr><td><code>model</code></td><td><code>LibraryItem</code> → <code>Book</code>, <code>Magazine</code>, <code>Dvd</code> · <code>Member</code> → <code>StudentMember</code>, <code>StaffMember</code> · <code>Loan</code></td><td>JavaBeans; the polymorphic answers (loan days, fee per day, max loans)</td></tr>
<tr><td><code>dto</code></td><td>13 classes (requests, responses, report rows, <code>LibraryDataDTO</code>, <code>CsvRowDTO</code>)</td><td>data between layers</td></tr>
<tr><td><code>exceptions</code></td><td><code>LibraryException</code> (abstract, checked) + 9 subclasses</td><td>one family, caught once per operation in the controller</td></tr>
<tr><td><code>utils</code></td><td><code>Validation</code>, <code>CsvUtils</code>, <code>FormatUtils</code></td><td>static helpers: input rules, CSV read/write, money and date formats</td></tr>
<tr><td><code>view</code></td><td><code>BookView</code>, <code>LoanView</code>, <code>ReportView</code></td><td>printing only</td></tr>
</tbody>
</table>
<p>The class diagram of slide 9 is the heart of the design. Three abstractions do the work that would otherwise be <code>if (type == …)</code> chains: <code>LibraryItem</code> answers "how many days, how much per late day", <code>Member</code> answers "how many items at once", <code>IFeePolicy</code> answers "what does this card pay for so many late days". The only two places that still ask "which type?" are the factories that turn a CSV row or a form into an object (<code>createItem</code>, <code>createMember</code> in the repositories) — exactly the "one place to change" a reviewer wants to see.</p>
<details><summary>Why is AppController a controller and not part of Main?</summary><p>Main may not import <code>repository</code> (Guide.xlsx). Something still has to choose <code>FileBookRepository</code> and give the SAME object to BookController, LoanController and ReportController — two different <code>new FileBookRepository(...)</code> would load the file twice and the reports would not see a loan made a second earlier. AppController is that one place: the "composition root". Spring Boot does exactly this job for you; the next leg changes three <code>new</code> lines there and nothing else.</p></details>`,
    `<h2>3. Kiến trúc và sơ đồ lớp</h2>
<p>Các tầng đúng là các tầng mà thầy LAB211 review, y như Lab 1–9: <code>constants · model · dto · repository · service · controller · view · utils · exceptions · main</code>. Hai luật quyết định phần lớn nhận xét review: <strong>controller giữ repository và làm CRUD</strong>, và <strong>service không giữ repository nào</strong> — nó chỉ áp luật lên dữ liệu controller đưa vào. Controller không import lớp model (nó làm việc với DTO); interface bắt đầu bằng <code>I</code>; collection khai báo kiểu <code>ArrayList</code> / <code>HashMap</code>; không phương thức nào quá hai tham số (utils ba).</p>
<table>
<thead><tr><th>Package</th><th>Lớp</th><th>Việc</th></tr></thead>
<tbody>
<tr><td><code>main</code></td><td><code>Main</code></td><td>Scanner, menu, đọc và kiểm mọi ô nhập (qua utils), mỗi lựa chọn gọi controller đúng một lần</td></tr>
<tr><td><code>controller</code></td><td><code>AppController</code>, <code>BookController</code>, <code>MemberController</code>, <code>LoanController</code>, <code>ReportController</code></td><td>AppController dựng MỘT bản mỗi kho rồi trao cho các controller (tiêm phụ thuộc bằng tay); các lớp còn lại điều phối</td></tr>
<tr><td><code>service</code></td><td><code>LoanService</code>, <code>ReportService</code>, <code>BookService</code>, <code>IFeePolicy</code> + 2 chính sách</td><td>luật: mượn, trả, nộp, phí, khoá; báo cáo; tìm kiếm</td></tr>
<tr><td><code>repository</code></td><td><code>IBookRepository</code>, <code>IMemberRepository</code>, <code>ILoanRepository</code> + các bản <code>File…</code></td><td>giữ dữ liệu, nạp và lưu ba tệp CSV</td></tr>
<tr><td><code>model</code></td><td><code>LibraryItem</code> → <code>Book</code>, <code>Magazine</code>, <code>Dvd</code> · <code>Member</code> → <code>StudentMember</code>, <code>StaffMember</code> · <code>Loan</code></td><td>JavaBean; các câu trả lời đa hình (số ngày mượn, phí mỗi ngày, hạn mức)</td></tr>
<tr><td><code>dto</code></td><td>13 lớp (phiếu yêu cầu, bản trả về, dòng báo cáo, <code>LibraryDataDTO</code>, <code>CsvRowDTO</code>)</td><td>dữ liệu đi giữa các tầng</td></tr>
<tr><td><code>exceptions</code></td><td><code>LibraryException</code> (abstract, checked) + 9 lớp con</td><td>một họ, mỗi thao tác bắt một lần ở controller</td></tr>
<tr><td><code>utils</code></td><td><code>Validation</code>, <code>CsvUtils</code>, <code>FormatUtils</code></td><td>hàm static: luật nhập, đọc/ghi CSV, định dạng tiền và ngày</td></tr>
<tr><td><code>view</code></td><td><code>BookView</code>, <code>LoanView</code>, <code>ReportView</code></td><td>chỉ in</td></tr>
</tbody>
</table>
<p>Sơ đồ lớp ở slide 9 là trái tim của thiết kế. Ba trừu tượng làm thay việc mà lẽ ra là những chuỗi <code>if (type == …)</code>: <code>LibraryItem</code> trả lời "mượn bao nhiêu ngày, mỗi ngày trễ bao nhiêu tiền", <code>Member</code> trả lời "giữ được mấy tài liệu cùng lúc", <code>IFeePolicy</code> trả lời "thẻ này trễ bấy nhiêu ngày thì trả bao nhiêu". Chỉ còn hai chỗ hỏi "loại nào?" là hai nhà máy biến một dòng CSV hay một phiếu nhập thành đối tượng (<code>createItem</code>, <code>createMember</code> trong các kho) — đúng "một chỗ để sửa" mà người review muốn thấy.</p>
<details><summary>Vì sao AppController là controller chứ không nằm trong Main?</summary><p>Main không được import <code>repository</code> (Guide.xlsx). Nhưng vẫn phải có chỗ chọn <code>FileBookRepository</code> và đưa CÙNG một đối tượng cho BookController, LoanController và ReportController — hai lần <code>new FileBookRepository(...)</code> sẽ nạp tệp hai lần và báo cáo không thấy lượt mượn vừa tạo một giây trước. AppController là chỗ duy nhất đó: "composition root". Spring Boot làm đúng việc này thay bạn; chặng sau chỉ đổi ba dòng <code>new</code> ở đây.</p></details>`),
    bi(`<h2>4. The files to download</h2>
<a class="link-card" href="https://media.cuongthai.com/files/academy/PRO192/labs/v1/CTLibrary-1.0-starter.zip" target="_blank" rel="noopener">
<span class="lc-ico">🧰</span>
<span class="lc-body"><span class="lc-title">CTLibrary-1.0-starter.zip</span><span class="lc-sub">the whole project (NetBeans, Java 8) with 8 TODO DA.x · data/ 200 · 300 · 2,000 · harness: 2 runs, 557 lines · check.sh / check.bat</span></span>
<span class="lc-cta">Download</span>
</a>
<pre><code class="language-plaintext">CTLibrary-1.0/
  data/books.csv  members.csv  loans.csv     the sample data (NetBeans Run reads data/)
  harness/input.txt  input-2.txt  data/      the grader: 75 typed lines, then a reopen with 9 more
  harness/expected.txt                       557 lines the program must print
  src/constants   Constants, Message         every number and every sentence
  src/model       LibraryItem Book Magazine Dvd Member StudentMember StaffMember Loan
  src/dto         13 DTO classes
  src/exceptions  LibraryException + 9 subclasses
  src/repository  IBook/IMember/ILoanRepository + FileBook/FileMember/FileLoanRepository
  src/service     IFeePolicy StudentFeePolicy StaffFeePolicy LoanService ReportService BookService
  src/controller  AppController BookController MemberController LoanController ReportController
  src/view        BookView LoanView ReportView
  src/utils       Validation CsvUtils FormatUtils
  src/main        Main
  test/harness/CheckHarness.java   check.sh   check.bat   README.txt</code></pre>
<p>The solution is not published: this is the graded project of the course. The starter compiles, already passes <code>lint.py</code>, and runs — it simply does not load members yet, cannot take a return or a payment, and prints empty reports:</p>
<pre><code class="language-bash">$ python3 lint.py CTLibrary-1.0</code></pre>
<div class="out">✓ CTLibrary-1.0 — sạch</div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ mkdir -p data &amp;&amp; cp harness/data/* data/        # du lieu mau, nhu bo cham
$ java -cp build main.Main &lt; harness/input.txt
$ java -cp build main.Main &lt; harness/input-2.txt   # MO LAI chuong trinh (lan 2)</code></pre>
<div class="out">Da nap: 200 tai lieu, 0 thanh vien, 2000 luot muon.<br>
Bo qua 2 dong hong (ban goc giu o tep .bak khi luu lan dau):<br>
&nbsp;&nbsp;- data/books.csv dong 62: ISBN sai chu so kiem tra: chu so cuoi phai la 2, ban nhap 0. Xem lai so in tren bia sach roi nhap lai.<br>
&nbsp;&nbsp;- data/loans.csv dong 1002: Ngay "2026-02-30" khong hop le (dung dang yyyy-MM-dd, vi du 2026-10-15, ngay phai co that tren lich). Moi nhap lai.<br>
…</div>`,
    `<h2>4. Tệp tải về</h2>
<a class="link-card" href="https://media.cuongthai.com/files/academy/PRO192/labs/v1/CTLibrary-1.0-starter.zip" target="_blank" rel="noopener">
<span class="lc-ico">🧰</span>
<span class="lc-body"><span class="lc-title">CTLibrary-1.0-starter.zip</span><span class="lc-sub">trọn dự án (NetBeans, Java 8) với 8 TODO DA.x · data/ 200 · 300 · 2.000 · bộ chấm: 2 lần chạy, 557 dòng · check.sh / check.bat</span></span>
<span class="lc-cta">Tải về</span>
</a>
<pre><code class="language-plaintext">CTLibrary-1.0/
  data/books.csv  members.csv  loans.csv     dữ liệu mẫu (NetBeans Run đọc data/)
  harness/input.txt  input-2.txt  data/      bộ chấm: 75 dòng gõ vào, rồi mở lại với 9 dòng nữa
  harness/expected.txt                       557 dòng chương trình phải in
  src/constants   Constants, Message         mọi con số và mọi câu chữ
  src/model       LibraryItem Book Magazine Dvd Member StudentMember StaffMember Loan
  src/dto         13 lớp DTO
  src/exceptions  LibraryException + 9 lớp con
  src/repository  IBook/IMember/ILoanRepository + FileBook/FileMember/FileLoanRepository
  src/service     IFeePolicy StudentFeePolicy StaffFeePolicy LoanService ReportService BookService
  src/controller  AppController BookController MemberController LoanController ReportController
  src/view        BookView LoanView ReportView
  src/utils       Validation CsvUtils FormatUtils
  src/main        Main
  test/harness/CheckHarness.java   check.sh   check.bat   README.txt</code></pre>
<p>Lời giải không công bố: đây là dự án được chấm điểm của khoá. Starter biên dịch được, đã qua <code>lint.py</code>, và chạy được — chỉ là nó chưa nạp thành viên, chưa nhận trả hay nhận tiền phạt, và in báo cáo rỗng:</p>
<pre><code class="language-bash">$ python3 lint.py CTLibrary-1.0</code></pre>
<div class="out">✓ CTLibrary-1.0 — sạch</div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ mkdir -p data &amp;&amp; cp harness/data/* data/        # du lieu mau, nhu bo cham
$ java -cp build main.Main &lt; harness/input.txt
$ java -cp build main.Main &lt; harness/input-2.txt   # MO LAI chuong trinh (lan 2)</code></pre>
<div class="out">Da nap: 200 tai lieu, 0 thanh vien, 2000 luot muon.<br>
Bo qua 2 dong hong (ban goc giu o tep .bak khi luu lan dau):<br>
&nbsp;&nbsp;- data/books.csv dong 62: ISBN sai chu so kiem tra: chu so cuoi phai la 2, ban nhap 0. Xem lai so in tren bia sach roi nhap lai.<br>
&nbsp;&nbsp;- data/loans.csv dong 1002: Ngay "2026-02-30" khong hop le (dung dang yyyy-MM-dd, vi du 2026-10-15, ngay phai co that tren lich). Moi nhap lai.<br>
…</div>`),
    bi(`<h2>5. Worked samples — the three hard parts (given in the starter)</h2>
<h3>5.1 Fee policy: a Strategy behind an interface</h3>
<p>The question "how much does this card pay for so many late days of this item?" has two answers today and maybe a third next year. Each answer is a class implementing <code>IFeePolicy</code>; <code>LoanService</code> keeps them in a <code>HashMap</code> keyed by the card type and looks one up — no <code>if</code> on the card type anywhere in the formula:</p>
<pre class="trich"><code class="language-java">public interface IFeePolicy {

    // Ten chinh sach de in ra (vi du "Sinh vien - giam 50%")
    String getPolicyName();

    // Phi phai tra khi tre daysLate ngay voi muc phi lateFeePerDay dong/ngay
    int calculateFee(int daysLate, int lateFeePerDay);
}</code></pre>
<pre class="trich"><code class="language-java">// Bo di STAFF_FREE_DAYS ngay tre dau (khong am), phan con lai tinh du phi
@Override
public int calculateFee(int daysLate, int lateFeePerDay) {
    // So ngay tre con phai tra tien
    int chargedDays = Math.max(0, daysLate - Constants.STAFF_FREE_DAYS);

    return chargedDays * lateFeePerDay;
}</code></pre>
<pre class="trich"><code class="language-java">// Tao service voi 2 chinh sach phi; ngay lam viec mac dinh la hom nay cua may
public LoanService() {
    feePolicyMap = new HashMap&lt;&gt;();
    feePolicyMap.put(Constants.MEMBER_STUDENT, new StudentFeePolicy());
    feePolicyMap.put(Constants.MEMBER_STAFF, new StaffFeePolicy());
    workingDate = LocalDate.now();
}</code></pre>
<pre class="trich"><code class="language-java">// Chinh sach cua loai the (loai la thi dung chinh sach sinh vien — khong bao gio null)
private IFeePolicy findPolicy(int memberType) {
    // Chinh sach theo loai the
    IFeePolicy policy = feePolicyMap.get(memberType);

    // Loai the chua co chinh sach rieng
    if (policy == null) {
        return feePolicyMap.get(Constants.MEMBER_STUDENT);
    }
    return policy;
}</code></pre>
<p>Two details worth copying. <code>Math.max(0, …)</code> keeps a staff member who is one day late from getting a negative fine. And <code>findPolicy</code> never returns <code>null</code>: an unknown card type falls back to the student policy, so a bad value in a file cannot crash a return.</p>
<h3>5.2 LoanService.createLoan and the exception family</h3>
<p>Every business rule follows this shape: check, and if the rule is broken THROW a named, checked exception whose message already says what is wrong and what to do; if every check passes, build the result. The service never prints and never catches:</p>
<pre class="trich"><code class="language-java">// Kiem 3 luat roi lap luot muon moi (chua co ma — kho cap): ngay muon = ngay lam viec,
// han tra = ngay muon + so ngay muon cua LOAI tai lieu (da hinh: 14 / 7 / 3)
public LoanRecordDTO createLoan(MemberResponseDTO member, BookResponseDTO item)
        throws MemberLockedException, LoanLimitException, ItemNotAvailableException {
    // Luat 1: no phat qua muc thi khoa the
    if (isLocked(member)) {
        throw new MemberLockedException(String.format(Message.ERROR_MEMBER_LOCKED,
                member.getId(), FormatUtils.formatMoney(member.getDebt()),
                FormatUtils.formatMoney(Constants.LOCK_DEBT_LIMIT)));
    }

    // Luat 2: dang muon du so toi da cua loai the
    if (member.getOpenLoanCount() &gt;= member.getMaxLoans()) {
        throw new LoanLimitException(String.format(Message.ERROR_LOAN_LIMIT, member.getId(),
                member.getOpenLoanCount(), member.getMaxLoans(), member.getTypeName()));
    }

    // Luat 3: het ban tren ke
    if (item.getCopies() &lt;= 0) {
        throw new ItemNotAvailableException(String.format(Message.ERROR_NO_COPY,
                item.getId(), item.getTitle()));
    }

    // Du luat: lap luot muon
    LoanRecordDTO loan = new LoanRecordDTO();
    loan.setMemberId(member.getId());
    loan.setItemId(item.getId());
    loan.setItemTitle(item.getTitle());
    loan.setBorrowDate(workingDate);
    loan.setDueDate(workingDate.plusDays(item.getLoanDays()));
    return loan;
}</code></pre>
<p>The exceptions form one family: <code>LibraryException</code> is abstract and extends <code>Exception</code> (checked, so the compiler forces the controller to deal with it), and each rule has its own subclass — <code>MemberLockedException</code>, <code>LoanLimitException</code>, <code>ItemNotAvailableException</code>, <code>LoanNotFoundException</code>, <code>DuplicateKeyException</code>, <code>StorageException</code> (which keeps the <code>IOException</code> as its cause)… The controller runs all steps of one operation inside ONE <code>try</code> and catches the parent type ONCE:</p>
<pre class="trich"><code class="language-java">// Muon: lay thanh vien + tai lieu, Service kiem 3 luat, kho ghi luot TRUOC roi moi tru ban
public void borrowItem(LoanRequestDTO loanRequestDTO) {
    // Buoc nao nem loi thi dung, cac buoc sau khong chay
    try {
        MemberResponseDTO member = findMemberWithLoans(loanRequestDTO.getMemberId());
        BookResponseDTO item = bookRepository.findById(loanRequestDTO.getItemId());
        LoanRecordDTO loan = loanService.createLoan(member, item);

        // Dang muon dung tai lieu nay thi kho nem loi trung — chua tru ban nao
        String loanId = loanRepository.addLoan(loan);
        bookRepository.updateCopies(item.getId(), item.getCopies() - 1);
        loanView.showMessage(String.format(Message.SUCCESS_BORROW, loanId, member.getId(),
                item.getId(), item.getTitle(), FormatUtils.formatDate(loan.getDueDate()),
                item.getLoanDays(), member.getOpenLoanCount() + 1, member.getMaxLoans(),
                item.getCopies() - 1));
    } catch (LibraryException e) {
        // Khong co ma, khoa the, qua han muc, het ban, dang muon roi, loi ghi tep
        loanView.showMessage(e.getMessage());
    }
}</code></pre>
<p>A refused step stops the later ones — the loan is written before the copy is taken off the shelf, so a refusal never costs a copy. The four possible outcomes, from the real run:</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ mkdir -p data &amp;&amp; cp harness/data/* data/        # du lieu mau, nhu bo cham
$ java -cp build main.Main &lt; harness/input.txt
$ java -cp build main.Main &lt; harness/input-2.txt   # MO LAI chuong trinh (lan 2)</code></pre>
<div class="out">…<br>
Ma thanh vien (vi du M001): Ma tai lieu (vi du B001, T151, D181): The cua M014 dang bi KHOA: no phat 72.500d, lon hon muc 50.000d. Dong phat (lua chon 7) roi moi muon tiep.<br>
…</div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ mkdir -p data &amp;&amp; cp harness/data/* data/        # du lieu mau, nhu bo cham
$ java -cp build main.Main &lt; harness/input.txt
$ java -cp build main.Main &lt; harness/input-2.txt   # MO LAI chuong trinh (lan 2)</code></pre>
<div class="out">…<br>
Ma thanh vien (vi du M001): Ma tai lieu (vi du B001, T151, D181): M060 dang muon 3/3 tai lieu - muc toi da cua the Sinh vien. Tra bot roi moi muon them.<br>
…</div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ mkdir -p data &amp;&amp; cp harness/data/* data/        # du lieu mau, nhu bo cham
$ java -cp build main.Main &lt; harness/input.txt
$ java -cp build main.Main &lt; harness/input-2.txt   # MO LAI chuong trinh (lan 2)</code></pre>
<div class="out">…<br>
Ma thanh vien (vi du M001): Ma tai lieu (vi du B001, T151, D181): Tai lieu B001 "Nhập Môn Lập Trình Java" da het ban tren ke: moi ban dang duoc muon.<br>
…</div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ mkdir -p data &amp;&amp; cp harness/data/* data/        # du lieu mau, nhu bo cham
$ java -cp build main.Main &lt; harness/input.txt
$ java -cp build main.Main &lt; harness/input-2.txt   # MO LAI chuong trinh (lan 2)</code></pre>
<div class="out">…<br>
Ma thanh vien (vi du M001): Ma tai lieu (vi du B001, T151, D181): Muon thanh cong L2001: M027 muon B002 "Cấu Trúc Dữ Liệu Và Giải Thuật" | han tra 29/10/2026 (14 ngay) | dang muon 2/5 | con 2 ban tren ke.<br>
…</div>
<h3>5.3 One way of reading and writing CSV for three repositories</h3>
<p>Lab 9 wrote the file logic inside FileBookRepository. With three files, the parts that are the same move to <code>CsvUtils</code> — read every line with a named encoding, drop the BOM, skip the header and blank lines, split quoted values, keep the line number; write a temporary file, check <code>PrintWriter.checkError()</code>, then <code>Files.move</code> over the real file:</p>
<pre class="trich"><code class="language-java">// Doc ca tep: moi dong du lieu thanh 1 CsvRowDTO (so dong + gia tri). Tep chua co thi
// ghi cau bao vao errorList va tra danh sach rong; dong ngoac kep hong cung la 1 cau bao.
// Loi doc that (IOException) thi nem StorageException kem ten tep.
public static ArrayList&lt;CsvRowDTO&gt; readRows(String filePath, ArrayList&lt;String&gt; errorList)
        throws StorageException {
    // Cac dong da doc, tep can doc
    ArrayList&lt;CsvRowDTO&gt; rowList = new ArrayList&lt;&gt;();
    File file = new File(filePath);

    // Lan chay dau tien: chua co tep thi kho rong, khong phai loi
    if (!file.exists()) {
        errorList.add(String.format(Message.FILE_NOT_FOUND, filePath));
        return rowList;
    }

    // Mo bang try-with-resources: luon duoc dong, ke ca khi nem loi giua chung
    try (BufferedReader reader = new BufferedReader(new InputStreamReader(
            new FileInputStream(file), StandardCharsets.UTF_8))) {
        // Dong vua doc va so dong (dem tu 1)
        String line = reader.readLine();
        int lineNumber = 0;

        // readLine tra null = het tep
        while (line != null) {
            lineNumber++;
            // Dong 1: bo BOM (Excel hay them) truoc khi so voi dong tieu de
            if (lineNumber == Constants.CSV_HEADER_LINE) {
                line = line.replace(Constants.BOM, Constants.EMPTY);
            }
            // Dong tieu de va dong trong thi bo qua, khong bao
            if ((lineNumber != Constants.CSV_HEADER_LINE) &amp;&amp; (!line.trim().isEmpty())) {
                // Tach dong; ngoac kep hong thi chi la 1 cau bao, cac dong sau doc tiep
                try {
                    CsvRowDTO row = new CsvRowDTO();
                    row.setLineNumber(lineNumber);
                    row.setValueList(splitLine(line));
                    rowList.add(row);
                } catch (InvalidInputException e) {
                    // Mot dong hong khong lam hong ca tep
                    errorList.add(String.format(Message.ERROR_CSV_LINE, filePath, lineNumber,
                            e.getMessage()));
                }
            }
            line = reader.readLine();
        }
    } catch (IOException e) {
        // Loi doc that: boc thanh loi luu tru, giu e lam nguyen nhan goc
        throw new StorageException(String.format(Message.ERROR_FILE_READ, filePath,
                e.getMessage()), e);
    }

    return rowList;
}</code></pre>
<pre class="trich"><code class="language-java">// Ghi ca tep: dong tieu de + moi dong du lieu (da la chuoi CSV), qua tep .tmp roi
// Files.move de thay tep that. Bat ky buoc nao hong thi nem StorageException.
public static void writeRows(String filePath, String header, ArrayList&lt;String&gt; lineList)
        throws StorageException {
    // Tep that, tep tam ben canh no
    File file = new File(filePath);
    File tempFile = new File(filePath + Constants.TEMP_SUFFIX);

    // Thu muc cha chua co (vd data/) thi tao
    if ((file.getParentFile() != null) &amp;&amp; (!file.getParentFile().exists())) {
        file.getParentFile().mkdirs();
    }

    // Ghi tep tam bang UTF-8 (GOI TEN bang ma, khong dung mac dinh cua may)
    try (PrintWriter writer = new PrintWriter(new OutputStreamWriter(
            new FileOutputStream(tempFile), StandardCharsets.UTF_8))) {
        writer.println(header);
        // Moi dong du lieu mot dong tep
        for (String line : lineList) {
            writer.println(line);
        }
        // PrintWriter KHONG nem IOException: phai tu hoi no co loi khong
        if (writer.checkError()) {
            throw new StorageException(String.format(Message.ERROR_FILE_WRITE, filePath,
                    Message.WRITER_ERROR), null);
        }
    } catch (IOException e) {
        // Khong mo duoc tep tam (thu muc khong co quyen ghi...)
        throw new StorageException(String.format(Message.ERROR_FILE_WRITE, filePath,
                e.getMessage()), e);
    }

    // Tep tam da du: thay tep that bang 1 buoc doi ten
    try {
        Files.move(tempFile.toPath(), file.toPath(), StandardCopyOption.REPLACE_EXISTING);
    } catch (IOException e) {
        // Doi ten that bai: tep cu van nguyen, bao loi
        throw new StorageException(String.format(Message.ERROR_FILE_WRITE, filePath,
                e.getMessage()), e);
    }
}</code></pre>
<p>Each repository keeps only what is specific: how one row becomes an object, and how an object becomes a row. FileLoanRepository is given complete as the model; its <code>loadRow</code> shows the pattern for every repository — the column count first, then every column through the SAME <code>Validation</code> methods as the keyboard, then the checks between columns (a due date before the borrow date, two open loans of the same item):</p>
<pre class="trich"><code class="language-java">// Doi 1 dong tep thanh model: kiem ma, ngay (dung lich, dung thu tu), tien phat
private void loadRow(CsvRowDTO row) throws InvalidInputException, DuplicateKeyException {
    // Cac gia tri cua dong
    ArrayList&lt;String&gt; valueList = row.getValueList();

    // Dung so cot
    if (valueList.size() != Constants.LOAN_CSV_COLUMNS) {
        throw new InvalidInputException(String.format(Message.ERROR_CSV_COLUMNS,
                Constants.LOAN_CSV_COLUMNS, valueList.size()));
    }

    // Ma luot: L + 4 chu so
    String id = valueList.get(Constants.LOAN_CSV_ID_INDEX).trim();
    if (!id.matches(Constants.REGEX_LOAN_ID)) {
        // Kiem ma luot truoc khi doc cac cot khac
        throw new InvalidInputException(String.format(Message.ERROR_LOAN_ID, id));
    }

    // Ma thanh vien, ma tai lieu, ngay muon, han tra qua bo kiem chung
    Loan loan = new Loan(id,
            Validation.getMemberId(valueList.get(Constants.LOAN_CSV_MEMBER_INDEX)),
            Validation.getItemId(valueList.get(Constants.LOAN_CSV_ITEM_INDEX)));
    loan.setBorrowDate(Validation.getFileDate(valueList.get(Constants.LOAN_CSV_BORROW_INDEX)));
    loan.setDueDate(Validation.getFileDate(valueList.get(Constants.LOAN_CSV_DUE_INDEX)));
    loan.setReturnDate(readReturnDate(valueList.get(Constants.LOAN_CSV_RETURN_INDEX)));
    loan.setFine(Validation.getNonNegative(valueList.get(Constants.LOAN_CSV_FINE_INDEX),
            Message.FIELD_FINE));
    checkLoadedLoan(loan);
    loanMap.put(id, loan);

    // Luot dang mo thi giu khoa chong muon trung
    if (loan.isOpen()) {
        openKeySet.add(toOpenKey(loan.getMemberId(), loan.getItemId()));
    }
    lastNumber = Math.max(lastNumber, Integer.parseInt(id.substring(
            Constants.ID_PREFIX_LENGTH)));
}</code></pre>
<pre class="trich"><code class="language-java">// Ghi lai ca tep
private void saveToFile() throws StorageException {
    // Lan ghi dau sau khi nap thay dong hong: giu tep goc
    if (isBackupNeeded) {
        CsvUtils.backupFile(filePath);
        isBackupNeeded = false;
    }

    // Moi luot thanh 1 dong CSV (ngay ghi dang yyyy-MM-dd)
    ArrayList&lt;String&gt; lineList = new ArrayList&lt;&gt;();
    for (Loan loan : loanMap.values()) {
        // Gia tri cac cot theo dong tieu de
        ArrayList&lt;String&gt; valueList = new ArrayList&lt;&gt;();
        valueList.add(loan.getId());
        valueList.add(loan.getMemberId());
        valueList.add(loan.getItemId());
        valueList.add(FormatUtils.formatFileDate(loan.getBorrowDate()));
        valueList.add(FormatUtils.formatFileDate(loan.getDueDate()));
        valueList.add(FormatUtils.formatFileDate(loan.getReturnDate()));
        valueList.add(String.valueOf(loan.getFine()));
        lineList.add(CsvUtils.joinLine(valueList));
    }
    CsvUtils.writeRows(filePath, Constants.LOAN_CSV_HEADER, lineList);
}</code></pre>`,
    `<h2>5. Làm mẫu — ba phần khó (starter cho sẵn)</h2>
<h3>5.1 Chính sách phí: một Strategy sau interface</h3>
<p>Câu hỏi "thẻ này trễ bấy nhiêu ngày với tài liệu này thì trả bao nhiêu?" hôm nay có hai câu trả lời và năm sau có thể có câu thứ ba. Mỗi câu trả lời là một lớp cài <code>IFeePolicy</code>; <code>LoanService</code> giữ chúng trong một <code>HashMap</code> với khoá là loại thẻ và tra ra một cái — không có <code>if</code> theo loại thẻ ở bất kỳ đâu trong công thức:</p>
<pre class="trich"><code class="language-java">public interface IFeePolicy {

    // Ten chinh sach de in ra (vi du "Sinh vien - giam 50%")
    String getPolicyName();

    // Phi phai tra khi tre daysLate ngay voi muc phi lateFeePerDay dong/ngay
    int calculateFee(int daysLate, int lateFeePerDay);
}</code></pre>
<pre class="trich"><code class="language-java">// Bo di STAFF_FREE_DAYS ngay tre dau (khong am), phan con lai tinh du phi
@Override
public int calculateFee(int daysLate, int lateFeePerDay) {
    // So ngay tre con phai tra tien
    int chargedDays = Math.max(0, daysLate - Constants.STAFF_FREE_DAYS);

    return chargedDays * lateFeePerDay;
}</code></pre>
<pre class="trich"><code class="language-java">// Tao service voi 2 chinh sach phi; ngay lam viec mac dinh la hom nay cua may
public LoanService() {
    feePolicyMap = new HashMap&lt;&gt;();
    feePolicyMap.put(Constants.MEMBER_STUDENT, new StudentFeePolicy());
    feePolicyMap.put(Constants.MEMBER_STAFF, new StaffFeePolicy());
    workingDate = LocalDate.now();
}</code></pre>
<pre class="trich"><code class="language-java">// Chinh sach cua loai the (loai la thi dung chinh sach sinh vien — khong bao gio null)
private IFeePolicy findPolicy(int memberType) {
    // Chinh sach theo loai the
    IFeePolicy policy = feePolicyMap.get(memberType);

    // Loai the chua co chinh sach rieng
    if (policy == null) {
        return feePolicyMap.get(Constants.MEMBER_STUDENT);
    }
    return policy;
}</code></pre>
<p>Hai chi tiết nên chép theo. <code>Math.max(0, …)</code> giữ cho cán bộ trễ một ngày không bị phạt số âm. Và <code>findPolicy</code> không bao giờ trả <code>null</code>: loại thẻ lạ thì lùi về chính sách sinh viên, nên một giá trị sai trong tệp không làm sập lần trả sách.</p>
<h3>5.2 LoanService.createLoan và họ ngoại lệ</h3>
<p>Mọi luật nghiệp vụ đi theo dáng này: kiểm, và nếu luật bị vi phạm thì NÉM một ngoại lệ checked có tên, câu báo của nó đã nói sai gì và phải làm gì; qua hết các phép kiểm thì dựng kết quả. Service không bao giờ in, không bao giờ bắt:</p>
<pre class="trich"><code class="language-java">// Kiem 3 luat roi lap luot muon moi (chua co ma — kho cap): ngay muon = ngay lam viec,
// han tra = ngay muon + so ngay muon cua LOAI tai lieu (da hinh: 14 / 7 / 3)
public LoanRecordDTO createLoan(MemberResponseDTO member, BookResponseDTO item)
        throws MemberLockedException, LoanLimitException, ItemNotAvailableException {
    // Luat 1: no phat qua muc thi khoa the
    if (isLocked(member)) {
        throw new MemberLockedException(String.format(Message.ERROR_MEMBER_LOCKED,
                member.getId(), FormatUtils.formatMoney(member.getDebt()),
                FormatUtils.formatMoney(Constants.LOCK_DEBT_LIMIT)));
    }

    // Luat 2: dang muon du so toi da cua loai the
    if (member.getOpenLoanCount() &gt;= member.getMaxLoans()) {
        throw new LoanLimitException(String.format(Message.ERROR_LOAN_LIMIT, member.getId(),
                member.getOpenLoanCount(), member.getMaxLoans(), member.getTypeName()));
    }

    // Luat 3: het ban tren ke
    if (item.getCopies() &lt;= 0) {
        throw new ItemNotAvailableException(String.format(Message.ERROR_NO_COPY,
                item.getId(), item.getTitle()));
    }

    // Du luat: lap luot muon
    LoanRecordDTO loan = new LoanRecordDTO();
    loan.setMemberId(member.getId());
    loan.setItemId(item.getId());
    loan.setItemTitle(item.getTitle());
    loan.setBorrowDate(workingDate);
    loan.setDueDate(workingDate.plusDays(item.getLoanDays()));
    return loan;
}</code></pre>
<p>Các ngoại lệ là một họ: <code>LibraryException</code> là abstract và kế thừa <code>Exception</code> (checked, nên trình biên dịch buộc controller phải xử lý), mỗi luật có lớp con riêng — <code>MemberLockedException</code>, <code>LoanLimitException</code>, <code>ItemNotAvailableException</code>, <code>LoanNotFoundException</code>, <code>DuplicateKeyException</code>, <code>StorageException</code> (giữ <code>IOException</code> làm nguyên nhân gốc)… Controller chạy mọi bước của một thao tác trong MỘT <code>try</code> và bắt kiểu cha MỘT lần:</p>
<pre class="trich"><code class="language-java">// Muon: lay thanh vien + tai lieu, Service kiem 3 luat, kho ghi luot TRUOC roi moi tru ban
public void borrowItem(LoanRequestDTO loanRequestDTO) {
    // Buoc nao nem loi thi dung, cac buoc sau khong chay
    try {
        MemberResponseDTO member = findMemberWithLoans(loanRequestDTO.getMemberId());
        BookResponseDTO item = bookRepository.findById(loanRequestDTO.getItemId());
        LoanRecordDTO loan = loanService.createLoan(member, item);

        // Dang muon dung tai lieu nay thi kho nem loi trung — chua tru ban nao
        String loanId = loanRepository.addLoan(loan);
        bookRepository.updateCopies(item.getId(), item.getCopies() - 1);
        loanView.showMessage(String.format(Message.SUCCESS_BORROW, loanId, member.getId(),
                item.getId(), item.getTitle(), FormatUtils.formatDate(loan.getDueDate()),
                item.getLoanDays(), member.getOpenLoanCount() + 1, member.getMaxLoans(),
                item.getCopies() - 1));
    } catch (LibraryException e) {
        // Khong co ma, khoa the, qua han muc, het ban, dang muon roi, loi ghi tep
        loanView.showMessage(e.getMessage());
    }
}</code></pre>
<p>Bước bị từ chối thì các bước sau không chạy — lượt mượn được ghi trước khi trừ bản trên kệ, nên lời từ chối không bao giờ làm mất một bản. Bốn kết cục có thể có, từ lần chạy thật:</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ mkdir -p data &amp;&amp; cp harness/data/* data/        # du lieu mau, nhu bo cham
$ java -cp build main.Main &lt; harness/input.txt
$ java -cp build main.Main &lt; harness/input-2.txt   # MO LAI chuong trinh (lan 2)</code></pre>
<div class="out">…<br>
Ma thanh vien (vi du M001): Ma tai lieu (vi du B001, T151, D181): The cua M014 dang bi KHOA: no phat 72.500d, lon hon muc 50.000d. Dong phat (lua chon 7) roi moi muon tiep.<br>
…</div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ mkdir -p data &amp;&amp; cp harness/data/* data/        # du lieu mau, nhu bo cham
$ java -cp build main.Main &lt; harness/input.txt
$ java -cp build main.Main &lt; harness/input-2.txt   # MO LAI chuong trinh (lan 2)</code></pre>
<div class="out">…<br>
Ma thanh vien (vi du M001): Ma tai lieu (vi du B001, T151, D181): M060 dang muon 3/3 tai lieu - muc toi da cua the Sinh vien. Tra bot roi moi muon them.<br>
…</div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ mkdir -p data &amp;&amp; cp harness/data/* data/        # du lieu mau, nhu bo cham
$ java -cp build main.Main &lt; harness/input.txt
$ java -cp build main.Main &lt; harness/input-2.txt   # MO LAI chuong trinh (lan 2)</code></pre>
<div class="out">…<br>
Ma thanh vien (vi du M001): Ma tai lieu (vi du B001, T151, D181): Tai lieu B001 "Nhập Môn Lập Trình Java" da het ban tren ke: moi ban dang duoc muon.<br>
…</div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ mkdir -p data &amp;&amp; cp harness/data/* data/        # du lieu mau, nhu bo cham
$ java -cp build main.Main &lt; harness/input.txt
$ java -cp build main.Main &lt; harness/input-2.txt   # MO LAI chuong trinh (lan 2)</code></pre>
<div class="out">…<br>
Ma thanh vien (vi du M001): Ma tai lieu (vi du B001, T151, D181): Muon thanh cong L2001: M027 muon B002 "Cấu Trúc Dữ Liệu Và Giải Thuật" | han tra 29/10/2026 (14 ngay) | dang muon 2/5 | con 2 ban tren ke.<br>
…</div>
<h3>5.3 Một cách đọc và ghi CSV cho ba kho</h3>
<p>Lab 9 viết logic tệp ngay trong FileBookRepository. Có ba tệp thì những phần giống nhau chuyển về <code>CsvUtils</code> — đọc từng dòng bằng bảng mã gọi tên, bỏ BOM, bỏ dòng tiêu đề và dòng trống, tách giá trị có ngoặc kép, giữ số dòng; ghi một tệp tạm, kiểm <code>PrintWriter.checkError()</code>, rồi <code>Files.move</code> đè lên tệp thật:</p>
<pre class="trich"><code class="language-java">// Doc ca tep: moi dong du lieu thanh 1 CsvRowDTO (so dong + gia tri). Tep chua co thi
// ghi cau bao vao errorList va tra danh sach rong; dong ngoac kep hong cung la 1 cau bao.
// Loi doc that (IOException) thi nem StorageException kem ten tep.
public static ArrayList&lt;CsvRowDTO&gt; readRows(String filePath, ArrayList&lt;String&gt; errorList)
        throws StorageException {
    // Cac dong da doc, tep can doc
    ArrayList&lt;CsvRowDTO&gt; rowList = new ArrayList&lt;&gt;();
    File file = new File(filePath);

    // Lan chay dau tien: chua co tep thi kho rong, khong phai loi
    if (!file.exists()) {
        errorList.add(String.format(Message.FILE_NOT_FOUND, filePath));
        return rowList;
    }

    // Mo bang try-with-resources: luon duoc dong, ke ca khi nem loi giua chung
    try (BufferedReader reader = new BufferedReader(new InputStreamReader(
            new FileInputStream(file), StandardCharsets.UTF_8))) {
        // Dong vua doc va so dong (dem tu 1)
        String line = reader.readLine();
        int lineNumber = 0;

        // readLine tra null = het tep
        while (line != null) {
            lineNumber++;
            // Dong 1: bo BOM (Excel hay them) truoc khi so voi dong tieu de
            if (lineNumber == Constants.CSV_HEADER_LINE) {
                line = line.replace(Constants.BOM, Constants.EMPTY);
            }
            // Dong tieu de va dong trong thi bo qua, khong bao
            if ((lineNumber != Constants.CSV_HEADER_LINE) &amp;&amp; (!line.trim().isEmpty())) {
                // Tach dong; ngoac kep hong thi chi la 1 cau bao, cac dong sau doc tiep
                try {
                    CsvRowDTO row = new CsvRowDTO();
                    row.setLineNumber(lineNumber);
                    row.setValueList(splitLine(line));
                    rowList.add(row);
                } catch (InvalidInputException e) {
                    // Mot dong hong khong lam hong ca tep
                    errorList.add(String.format(Message.ERROR_CSV_LINE, filePath, lineNumber,
                            e.getMessage()));
                }
            }
            line = reader.readLine();
        }
    } catch (IOException e) {
        // Loi doc that: boc thanh loi luu tru, giu e lam nguyen nhan goc
        throw new StorageException(String.format(Message.ERROR_FILE_READ, filePath,
                e.getMessage()), e);
    }

    return rowList;
}</code></pre>
<pre class="trich"><code class="language-java">// Ghi ca tep: dong tieu de + moi dong du lieu (da la chuoi CSV), qua tep .tmp roi
// Files.move de thay tep that. Bat ky buoc nao hong thi nem StorageException.
public static void writeRows(String filePath, String header, ArrayList&lt;String&gt; lineList)
        throws StorageException {
    // Tep that, tep tam ben canh no
    File file = new File(filePath);
    File tempFile = new File(filePath + Constants.TEMP_SUFFIX);

    // Thu muc cha chua co (vd data/) thi tao
    if ((file.getParentFile() != null) &amp;&amp; (!file.getParentFile().exists())) {
        file.getParentFile().mkdirs();
    }

    // Ghi tep tam bang UTF-8 (GOI TEN bang ma, khong dung mac dinh cua may)
    try (PrintWriter writer = new PrintWriter(new OutputStreamWriter(
            new FileOutputStream(tempFile), StandardCharsets.UTF_8))) {
        writer.println(header);
        // Moi dong du lieu mot dong tep
        for (String line : lineList) {
            writer.println(line);
        }
        // PrintWriter KHONG nem IOException: phai tu hoi no co loi khong
        if (writer.checkError()) {
            throw new StorageException(String.format(Message.ERROR_FILE_WRITE, filePath,
                    Message.WRITER_ERROR), null);
        }
    } catch (IOException e) {
        // Khong mo duoc tep tam (thu muc khong co quyen ghi...)
        throw new StorageException(String.format(Message.ERROR_FILE_WRITE, filePath,
                e.getMessage()), e);
    }

    // Tep tam da du: thay tep that bang 1 buoc doi ten
    try {
        Files.move(tempFile.toPath(), file.toPath(), StandardCopyOption.REPLACE_EXISTING);
    } catch (IOException e) {
        // Doi ten that bai: tep cu van nguyen, bao loi
        throw new StorageException(String.format(Message.ERROR_FILE_WRITE, filePath,
                e.getMessage()), e);
    }
}</code></pre>
<p>Mỗi kho chỉ giữ phần riêng của nó: một dòng thành đối tượng thế nào, và một đối tượng thành dòng thế nào. FileLoanRepository được cho trọn làm khuôn; <code>loadRow</code> của nó là mẫu cho mọi kho — số cột trước, rồi mỗi cột qua CÙNG các hàm <code>Validation</code> như bàn phím, rồi các phép kiểm giữa các cột (hạn trả trước ngày mượn, hai lượt đang mở cùng một tài liệu):</p>
<pre class="trich"><code class="language-java">// Doi 1 dong tep thanh model: kiem ma, ngay (dung lich, dung thu tu), tien phat
private void loadRow(CsvRowDTO row) throws InvalidInputException, DuplicateKeyException {
    // Cac gia tri cua dong
    ArrayList&lt;String&gt; valueList = row.getValueList();

    // Dung so cot
    if (valueList.size() != Constants.LOAN_CSV_COLUMNS) {
        throw new InvalidInputException(String.format(Message.ERROR_CSV_COLUMNS,
                Constants.LOAN_CSV_COLUMNS, valueList.size()));
    }

    // Ma luot: L + 4 chu so
    String id = valueList.get(Constants.LOAN_CSV_ID_INDEX).trim();
    if (!id.matches(Constants.REGEX_LOAN_ID)) {
        // Kiem ma luot truoc khi doc cac cot khac
        throw new InvalidInputException(String.format(Message.ERROR_LOAN_ID, id));
    }

    // Ma thanh vien, ma tai lieu, ngay muon, han tra qua bo kiem chung
    Loan loan = new Loan(id,
            Validation.getMemberId(valueList.get(Constants.LOAN_CSV_MEMBER_INDEX)),
            Validation.getItemId(valueList.get(Constants.LOAN_CSV_ITEM_INDEX)));
    loan.setBorrowDate(Validation.getFileDate(valueList.get(Constants.LOAN_CSV_BORROW_INDEX)));
    loan.setDueDate(Validation.getFileDate(valueList.get(Constants.LOAN_CSV_DUE_INDEX)));
    loan.setReturnDate(readReturnDate(valueList.get(Constants.LOAN_CSV_RETURN_INDEX)));
    loan.setFine(Validation.getNonNegative(valueList.get(Constants.LOAN_CSV_FINE_INDEX),
            Message.FIELD_FINE));
    checkLoadedLoan(loan);
    loanMap.put(id, loan);

    // Luot dang mo thi giu khoa chong muon trung
    if (loan.isOpen()) {
        openKeySet.add(toOpenKey(loan.getMemberId(), loan.getItemId()));
    }
    lastNumber = Math.max(lastNumber, Integer.parseInt(id.substring(
            Constants.ID_PREFIX_LENGTH)));
}</code></pre>
<pre class="trich"><code class="language-java">// Ghi lai ca tep
private void saveToFile() throws StorageException {
    // Lan ghi dau sau khi nap thay dong hong: giu tep goc
    if (isBackupNeeded) {
        CsvUtils.backupFile(filePath);
        isBackupNeeded = false;
    }

    // Moi luot thanh 1 dong CSV (ngay ghi dang yyyy-MM-dd)
    ArrayList&lt;String&gt; lineList = new ArrayList&lt;&gt;();
    for (Loan loan : loanMap.values()) {
        // Gia tri cac cot theo dong tieu de
        ArrayList&lt;String&gt; valueList = new ArrayList&lt;&gt;();
        valueList.add(loan.getId());
        valueList.add(loan.getMemberId());
        valueList.add(loan.getItemId());
        valueList.add(FormatUtils.formatFileDate(loan.getBorrowDate()));
        valueList.add(FormatUtils.formatFileDate(loan.getDueDate()));
        valueList.add(FormatUtils.formatFileDate(loan.getReturnDate()));
        valueList.add(String.valueOf(loan.getFine()));
        lineList.add(CsvUtils.joinLine(valueList));
    }
    CsvUtils.writeRows(filePath, Constants.LOAN_CSV_HEADER, lineList);
}</code></pre>`),
    bi(`<h2>6. Your part — eight graded TODOs, hints step by step</h2>
<p>Search NetBeans for <code>TODO DA</code> (Window → Action Items). Each TODO says what to produce; the hints below go one level deeper. Open a hint only after trying, and the next one only if still stuck. Commit after each TODO.</p>
<ol>
<li><strong>DA.1 <code>LoanService.closeLoan</code></strong> — the return date, the days late and the fine of one open loan.
<details><summary>Hint 1</summary><p>Same shape as <code>createLoan</code>: one check that throws (the working date may not be before the borrow date), then fill three fields of the record you received and return it.</p></details>
<details><summary>Hint 2</summary><p>Days late already has a method (<code>countDaysLate</code>, never negative). The fee is ONE line: the policy of the member's card, applied to (days late, the item's fee per day that the controller put into the loan).</p></details></li>
<li><strong>DA.2 <code>LoanService.payFine</code></strong> — the new debt after a payment.
<details><summary>Hint</summary><p>Two refusals, each its own message already in <code>Message</code>: nothing owed; paying more than owed (the desk does not give change back). Otherwise subtract.</p></details></li>
<li><strong>DA.3 <code>LoanController.returnItem</code></strong> — coordinate a return.
<details><summary>Hint 1</summary><p>Copy the structure of <code>borrowItem</code>: one <code>try</code>, one <code>catch (LibraryException e)</code>. Reads first (member, item, the open loan of that pair), then the service, then the writes.</p></details>
<details><summary>Hint 2</summary><p>The service needs the item's fee per day: put it into the loan record before calling <code>closeLoan</code>. Then three writes: close the loan, put the copy back (+1), store the new debt. Print with <code>Message.SUCCESS_RETURN</code> — its arguments are in the order of the grader's line 122.</p></details></li>
<li><strong>DA.4 <code>FileMemberRepository.loadRow</code></strong> and <strong>DA.5 <code>saveToFile</code></strong> — the member file.
<details><summary>Hint</summary><p>Put <code>FileLoanRepository</code> next to it and follow it line by line: column count, every column through <code>Validation</code> (type → <code>createMember</code>, id, name, e-mail, debt with <code>getNonNegative</code>), duplicate id and duplicate e-mail are <code>DuplicateKeyException</code>; save = backup if needed, one CSV line per member through <code>CsvUtils.joinLine</code>, <code>writeRows</code> with the member header.</p></details></li>
<li><strong>DA.6 <code>ReportService.findTopBorrowed</code></strong>.
<details><summary>Hint</summary><p>Count with <code>HashMap&lt;String, Integer&gt;</code> and <code>getOrDefault(id, 0) + 1</code> (Lab 8). Build one row per item that has loans, sort with a <code>Comparator</code> on the count reversed, then the id; keep the first <code>TOP_LIMIT</code>, number them.</p></details></li>
<li><strong>DA.7 <code>ReportService.findOverdue</code></strong>.
<details><summary>Hint</summary><p>Index members and items by id in two HashMaps first — a loop inside a loop over 2,000 loans × 300 members works, but is the slow design a reviewer asks about. Keep loans with no return date and a due date before the working date; <code>toOverdueRow</code> (given) needs the item's title and fee per day in the loan. Sort by days late reversed, then loan id.</p></details></li>
<li><strong>DA.8 <code>ReportService.findRevenueByMonth</code></strong>.
<details><summary>Hint</summary><p>A <code>TreeMap&lt;YearMonth, RevenueRowDTO&gt;</code> keeps months in calendar order by itself (a <code>TreeMap&lt;String, …&gt;</code> keyed by "10/2026" would put October before February). Only returned loans with a fine count, by the month of the RETURN date.</p></details></li>
</ol>
<p>How to know a TODO is right before the end: run the program in NetBeans with the menu, compare with the matching lines of <code>harness/expected.txt</code> (each report has a title line you can search for), then run <code>check.sh</code> — the first different line tells you where to look.</p>`,
    `<h2>6. Phần của bạn — tám TODO được chấm, gợi ý từng bậc</h2>
<p>Tìm trong NetBeans chữ <code>TODO DA</code> (Window → Action Items). Mỗi TODO nói cần làm ra gì; gợi ý dưới đây đi sâu thêm một bậc. Thử trước rồi mới mở gợi ý, kẹt tiếp mới mở gợi ý sau. Xong mỗi TODO thì commit.</p>
<ol>
<li><strong>DA.1 <code>LoanService.closeLoan</code></strong> — ngày trả, số ngày trễ và tiền phạt của một lượt đang mở.
<details><summary>Gợi ý 1</summary><p>Cùng dáng với <code>createLoan</code>: một phép kiểm có throw (ngày làm việc không được trước ngày mượn), rồi điền ba trường của bản ghi nhận được và trả nó về.</p></details>
<details><summary>Gợi ý 2</summary><p>Số ngày trễ đã có hàm (<code>countDaysLate</code>, không bao giờ âm). Tiền phạt là MỘT dòng: chính sách của thẻ thành viên, áp lên (số ngày trễ, phí mỗi ngày của tài liệu mà controller đã đặt vào lượt mượn).</p></details></li>
<li><strong>DA.2 <code>LoanService.payFine</code></strong> — nợ mới sau khi nộp tiền.
<details><summary>Gợi ý</summary><p>Hai lời từ chối, mỗi lời một câu báo đã có sẵn trong <code>Message</code>: không nợ đồng nào; nộp nhiều hơn số nợ (quầy không thối lại). Còn lại thì trừ.</p></details></li>
<li><strong>DA.3 <code>LoanController.returnItem</code></strong> — điều phối một lần trả.
<details><summary>Gợi ý 1</summary><p>Chép cấu trúc của <code>borrowItem</code>: một <code>try</code>, một <code>catch (LibraryException e)</code>. Đọc trước (thành viên, tài liệu, lượt đang mở của cặp đó), rồi service, rồi các lần ghi.</p></details>
<details><summary>Gợi ý 2</summary><p>Service cần phí mỗi ngày của tài liệu: đặt nó vào bản ghi lượt mượn trước khi gọi <code>closeLoan</code>. Rồi ba lần ghi: đóng lượt, trả bản lên kệ (+1), lưu nợ mới. In bằng <code>Message.SUCCESS_RETURN</code> — thứ tự đối số theo đúng dòng 122 của bộ chấm.</p></details></li>
<li><strong>DA.4 <code>FileMemberRepository.loadRow</code></strong> và <strong>DA.5 <code>saveToFile</code></strong> — tệp thành viên.
<details><summary>Gợi ý</summary><p>Đặt <code>FileLoanRepository</code> cạnh bên và theo từng dòng: số cột, mỗi cột qua <code>Validation</code> (loại → <code>createMember</code>, mã, họ tên, email, nợ bằng <code>getNonNegative</code>), trùng mã và trùng email là <code>DuplicateKeyException</code>; lưu = sao lưu nếu cần, mỗi thành viên một dòng CSV qua <code>CsvUtils.joinLine</code>, <code>writeRows</code> với dòng tiêu đề của thành viên.</p></details></li>
<li><strong>DA.6 <code>ReportService.findTopBorrowed</code></strong>.
<details><summary>Gợi ý</summary><p>Đếm bằng <code>HashMap&lt;String, Integer&gt;</code> và <code>getOrDefault(id, 0) + 1</code> (Lab 8). Mỗi tài liệu có lượt mượn thành một dòng, sắp bằng <code>Comparator</code> theo số lượt đảo ngược rồi theo mã; giữ <code>TOP_LIMIT</code> dòng đầu, đánh hạng.</p></details></li>
<li><strong>DA.7 <code>ReportService.findOverdue</code></strong>.
<details><summary>Gợi ý</summary><p>Lập chỉ mục thành viên và tài liệu theo mã trong hai HashMap trước — vòng lặp lồng 2.000 lượt × 300 thành viên vẫn chạy, nhưng đó là thiết kế chậm mà người review sẽ hỏi. Giữ các lượt chưa có ngày trả và hạn trả trước ngày làm việc; <code>toOverdueRow</code> (cho sẵn) cần tên và phí mỗi ngày của tài liệu trong lượt mượn. Sắp theo số ngày trễ đảo ngược, rồi mã lượt.</p></details></li>
<li><strong>DA.8 <code>ReportService.findRevenueByMonth</code></strong>.
<details><summary>Gợi ý</summary><p><code>TreeMap&lt;YearMonth, RevenueRowDTO&gt;</code> tự giữ các tháng theo thứ tự lịch (một <code>TreeMap&lt;String, …&gt;</code> với khoá "10/2026" sẽ đặt tháng 10 trước tháng 2). Chỉ tính lượt đã trả có phạt, theo tháng của ngày TRẢ.</p></details></li>
</ol>
<p>Cách biết một TODO đúng trước khi làm xong hết: chạy chương trình trong NetBeans bằng menu, so với các dòng tương ứng trong <code>harness/expected.txt</code> (mỗi báo cáo có một dòng tiêu đề để tìm), rồi chạy <code>check.sh</code> — dòng khác đầu tiên chỉ cho bạn chỗ cần xem.</p>`),
    bi(`<h2>7. The grader — two runs, 557 lines</h2>
<p><code>check.sh</code> (or <code>check.bat</code>, or Run File on <code>test/harness/CheckHarness.java</code>) copies <code>harness/data</code> into <code>data/</code>, runs the program with the 75 lines of <code>input.txt</code> (working date 15/10/2026: a search, a locked card, a refused borrow, two payments, three returns with fines, the limit for a student and for a staff member, a new member and a new book, the three reports, a wrong date, a member card on 01/11/2026), then runs it AGAIN in the same folder with <code>input-2.txt</code> and compares everything with <code>expected.txt</code>:</p>
<pre><code class="language-bash">$ ./check.sh        # Windows: check.bat · NetBeans: Run File on test/harness/CheckHarness.java</code></pre>
<div class="out">PASS: 557/557 dong khop expected.txt</div>
<p>The second run is where saving is tested. The reopened program must find the new member, the new book, the four new loans and the fines — here is the member whose card was locked at the start, after paying 72,500đ and returning a book 14 days late:</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ mkdir -p data &amp;&amp; cp harness/data/* data/        # du lieu mau, nhu bo cham
$ java -cp build main.Main &lt; harness/input.txt
$ java -cp build main.Main &lt; harness/input-2.txt   # MO LAI chuong trinh (lan 2)</code></pre>
<div class="out">…<br>
===== MO LAI CHUONG TRINH (harness/input-2.txt) =====<br>
Da nap: 201 tai lieu, 301 thanh vien, 2004 luot muon.<br>
Ngay lam viec (dd/MM/yyyy, Enter = hom nay): Ngay lam viec: 15/10/2026<br>
…</div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ mkdir -p data &amp;&amp; cp harness/data/* data/        # du lieu mau, nhu bo cham
$ java -cp build main.Main &lt; harness/input.txt
$ java -cp build main.Main &lt; harness/input-2.txt   # MO LAI chuong trinh (lan 2)</code></pre>
<div class="out">…<br>
Ma thanh vien (vi du M001): --- The thanh vien ---<br>
M014 | Sinh vien | Pham Thi An | an.pham014@ctlibrary.example<br>
Dang muon: 0/3 | No phat: 14.000d | The: MO<br>
(Khong dang muon tai lieu nao.)<br>
========== CT LIBRARY 1.0 ==========<br>
…</div>
<p>And the third report on the reopened data — the two fines of 15/10/2026 are in October:</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ mkdir -p data &amp;&amp; cp harness/data/* data/        # du lieu mau, nhu bo cham
$ java -cp build main.Main &lt; harness/input.txt
$ java -cp build main.Main &lt; harness/input-2.txt   # MO LAI chuong trinh (lan 2)</code></pre>
<div class="out">…<br>
Lua chon: --- Doanh thu phat theo thang (thang cua ngay tra) ---<br>
Thang &nbsp;&nbsp;&nbsp;So luot Tien phat<br>
01/2026 &nbsp;12 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;95.500d<br>
02/2026 &nbsp;60 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;638.000d<br>
03/2026 &nbsp;80 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;976.500d<br>
04/2026 &nbsp;70 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;623.500d<br>
05/2026 &nbsp;77 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1.018.000d<br>
06/2026 &nbsp;85 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1.086.000d<br>
07/2026 &nbsp;54 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;653.500d<br>
08/2026 &nbsp;84 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1.023.000d<br>
09/2026 &nbsp;71 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;864.000d<br>
10/2026 &nbsp;33 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;589.000d<br>
Tong cong: 626 luot co phat | 7.567.000d<br>
…</div>`,
    `<h2>7. Bộ chấm — hai lần chạy, 557 dòng</h2>
<p><code>check.sh</code> (hoặc <code>check.bat</code>, hoặc Run File trên <code>test/harness/CheckHarness.java</code>) chép <code>harness/data</code> vào <code>data/</code>, chạy chương trình với 75 dòng của <code>input.txt</code> (ngày làm việc 15/10/2026: một lần tìm, một thẻ bị khoá, một lần mượn bị từ chối, hai lần nộp tiền, ba lần trả có phạt, hạn mức của sinh viên và của cán bộ, một thành viên mới và một cuốn sách mới, ba báo cáo, một ngày sai, một thẻ thành viên ngày 01/11/2026), rồi chạy LẠI trong cùng thư mục với <code>input-2.txt</code> và so tất cả với <code>expected.txt</code>:</p>
<pre><code class="language-bash">$ ./check.sh        # Windows: check.bat · NetBeans: Run File on test/harness/CheckHarness.java</code></pre>
<div class="out">PASS: 557/557 dong khop expected.txt</div>
<p>Lần chạy thứ hai là chỗ việc lưu bị thử. Chương trình mở lại phải thấy thành viên mới, cuốn sách mới, bốn lượt mượn mới và tiền phạt — đây là thành viên bị khoá thẻ lúc đầu, sau khi nộp 72.500đ và trả một cuốn trễ 14 ngày:</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ mkdir -p data &amp;&amp; cp harness/data/* data/        # du lieu mau, nhu bo cham
$ java -cp build main.Main &lt; harness/input.txt
$ java -cp build main.Main &lt; harness/input-2.txt   # MO LAI chuong trinh (lan 2)</code></pre>
<div class="out">…<br>
===== MO LAI CHUONG TRINH (harness/input-2.txt) =====<br>
Da nap: 201 tai lieu, 301 thanh vien, 2004 luot muon.<br>
Ngay lam viec (dd/MM/yyyy, Enter = hom nay): Ngay lam viec: 15/10/2026<br>
…</div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ mkdir -p data &amp;&amp; cp harness/data/* data/        # du lieu mau, nhu bo cham
$ java -cp build main.Main &lt; harness/input.txt
$ java -cp build main.Main &lt; harness/input-2.txt   # MO LAI chuong trinh (lan 2)</code></pre>
<div class="out">…<br>
Ma thanh vien (vi du M001): --- The thanh vien ---<br>
M014 | Sinh vien | Pham Thi An | an.pham014@ctlibrary.example<br>
Dang muon: 0/3 | No phat: 14.000d | The: MO<br>
(Khong dang muon tai lieu nao.)<br>
========== CT LIBRARY 1.0 ==========<br>
…</div>
<p>Và báo cáo thứ ba trên dữ liệu đã mở lại — hai khoản phạt ngày 15/10/2026 nằm trong tháng 10:</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ mkdir -p data &amp;&amp; cp harness/data/* data/        # du lieu mau, nhu bo cham
$ java -cp build main.Main &lt; harness/input.txt
$ java -cp build main.Main &lt; harness/input-2.txt   # MO LAI chuong trinh (lan 2)</code></pre>
<div class="out">…<br>
Lua chon: --- Doanh thu phat theo thang (thang cua ngay tra) ---<br>
Thang &nbsp;&nbsp;&nbsp;So luot Tien phat<br>
01/2026 &nbsp;12 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;95.500d<br>
02/2026 &nbsp;60 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;638.000d<br>
03/2026 &nbsp;80 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;976.500d<br>
04/2026 &nbsp;70 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;623.500d<br>
05/2026 &nbsp;77 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1.018.000d<br>
06/2026 &nbsp;85 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1.086.000d<br>
07/2026 &nbsp;54 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;653.500d<br>
08/2026 &nbsp;84 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1.023.000d<br>
09/2026 &nbsp;71 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;864.000d<br>
10/2026 &nbsp;33 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;589.000d<br>
Tong cong: 626 luot co phat | 7.567.000d<br>
…</div>`),
    bi(`<h2>8. Rubric — 100 points</h2>
<table>
<thead><tr><th>Part</th><th>Points</th><th>What earns them</th></tr></thead>
<tbody>
<tr><td>Functions</td><td>50</td><td>grader PASS 557/557 (30) · borrow / return / pay / card shown by hand on data you add yourself (10) · the three reports correct on a different working date (10)</td></tr>
<tr><td>OOP and design</td><td>25</td><td>layers as reviewed in LAB211: controller holds repositories, service holds none, controller imports no model (8) · polymorphism instead of type checks in rules and reports (7) · Strategy + interfaces used, not just declared (5) · JavaBeans, private fields, no static outside constants/utils/Main methods (5)</td></tr>
<tr><td>Exceptions and files</td><td>15</td><td>the checked LibraryException family, thrown in services, caught once per operation, no empty catch (5) · broken lines reported with file and line, never a crash (5) · UTF-8 named on read and write, temp file + move, .bak, checkError (5)</td></tr>
<tr><td>Clean code and Git</td><td>10</td><td>lint.py clean, javac --release 8, lines ≤ 100, Javadoc on every class (5) · at least 10 commits with clear messages, one feature per commit, no data/ build/ dist/ in Git (5)</td></tr>
</tbody>
</table>
<p><strong>Two oral questions</strong> close the review (be ready to answer in two sentences each): <em>"Why does the controller, not the service, hold the repositories?"</em> — because the service must stay a set of rules that can be tested with plain data and reused with any storage; <em>"What changes when we move to PostgreSQL?"</em> — three <code>new</code> lines in AppController and three new classes behind the same interfaces; nothing above the repositories.</p>
<h3>Hand-in checklist</h3>
<ul>
<li><code>check.sh</code> PASS, <code>lint.py</code> clean, <code>javac --release 8</code> clean.</li>
<li><code>git log --oneline</code> shows at least 10 commits; <code>.gitignore</code> excludes <code>build/</code>, <code>dist/</code>, <code>data/</code> (your local data changes every run).</li>
<li>A <code>README.md</code> in your repository: how to run, the menu, which TODO is where, one paragraph on a design decision you made.</li>
<li>Nothing outside the TODOs changed — if you improved something, say where and why in the README.</li>
</ul>`,
    `<h2>8. Rubric — 100 điểm</h2>
<table>
<thead><tr><th>Phần</th><th>Điểm</th><th>Cái gì được điểm</th></tr></thead>
<tbody>
<tr><td>Chức năng</td><td>50</td><td>bộ chấm PASS 557/557 (30) · mượn / trả / nộp / thẻ trình diễn bằng tay trên dữ liệu bạn tự thêm (10) · ba báo cáo đúng ở một ngày làm việc khác (10)</td></tr>
<tr><td>OOP và thiết kế</td><td>25</td><td>các tầng đúng như review LAB211: controller giữ repository, service không giữ, controller không import model (8) · đa hình thay cho kiểm kiểu trong luật và báo cáo (7) · Strategy + interface được DÙNG, không chỉ khai báo (5) · JavaBean, trường private, không static ngoài constants/utils/phương thức của Main (5)</td></tr>
<tr><td>Ngoại lệ và tệp</td><td>15</td><td>họ LibraryException checked, ném ở service, mỗi thao tác bắt một lần, không catch rỗng (5) · dòng hỏng được báo kèm tệp và số dòng, không bao giờ sập (5) · gọi tên UTF-8 khi đọc và ghi, tệp tạm + move, .bak, checkError (5)</td></tr>
<tr><td>Code sạch và Git</td><td>10</td><td>lint.py sạch, javac --release 8, dòng ≤ 100, Javadoc mọi lớp (5) · ít nhất 10 commit có thông điệp rõ, mỗi commit một tính năng, không có data/ build/ dist/ trong Git (5)</td></tr>
</tbody>
</table>
<p><strong>Hai câu vấn đáp</strong> khép lại buổi review (chuẩn bị trả lời mỗi câu trong hai câu): <em>"Vì sao controller, chứ không phải service, giữ repository?"</em> — vì service phải là tập luật kiểm thử được bằng dữ liệu trơn và dùng lại được với mọi nơi lưu; <em>"Chuyển sang PostgreSQL thì đổi gì?"</em> — ba dòng <code>new</code> trong AppController và ba lớp mới đứng sau đúng các interface đó; không gì ở phía trên repository.</p>
<h3>Danh sách kiểm trước khi nộp</h3>
<ul>
<li><code>check.sh</code> PASS, <code>lint.py</code> sạch, <code>javac --release 8</code> sạch.</li>
<li><code>git log --oneline</code> có ít nhất 10 commit; <code>.gitignore</code> loại <code>build/</code>, <code>dist/</code>, <code>data/</code> (dữ liệu cục bộ đổi mỗi lần chạy).</li>
<li>Một <code>README.md</code> trong repository: cách chạy, menu, TODO nào ở đâu, một đoạn về một quyết định thiết kế bạn đã đưa ra.</li>
<li>Không đổi gì ngoài các TODO — nếu bạn cải tiến chỗ nào, ghi rõ ở đâu và vì sao trong README.</li>
</ul>`),
    bi(`<h2>9. The exam room — a timed paper and a 50-question test</h2>
<p>The project shows that you can build CT Library with time and help. The exam room checks that you can do it alone, under time, in the exam format:</p>
<table>
<thead><tr><th>Paper</th><th>Format</th><th>What it covers</th></tr></thead>
<tbody>
<tr><td><a href="/exam?course=PRO192&amp;kind=PE">PRO192-DA1</a></td><td>PE style, 90 minutes, 4 questions, 10 marks, real NetBeans given materials with a compiled harness</td><td>Q1 Book + SpecBook (inheritance through private fields) · Q2 LoanList extends ArrayList&lt;Loan&gt; (tie, ignore case, safe removal) · Q3 MyCode implements the given ICode (item codes) · Q4 CommandProcessor (read a command file, write a result file)</td></tr>
<tr><td><a href="/exam?course=PRO192&amp;kind=FE">PRO192-DA-FE1</a></td><td>FE style, 60 minutes, 50 questions</td><td>the nine chapters, mostly on the CT Library domain; every code question was compiled and run, every answer is explained</td></tr>
</tbody>
</table>
<p>Both papers are self-authored (they are not school papers). The marking tool of DA1 gives the sample solution 10/10 and an empty skeleton 0/10; each test case is all-or-nothing, as in the real PE.</p>`,
    `<h2>9. Phòng thi — bản thi có giờ và trắc nghiệm 50 câu</h2>
<p>Dự án cho thấy bạn dựng được CT Library khi có thời gian và có gợi ý. Phòng thi kiểm rằng bạn làm được một mình, có giờ, đúng hình thức thi:</p>
<table>
<thead><tr><th>Đề</th><th>Hình thức</th><th>Nội dung</th></tr></thead>
<tbody>
<tr><td><a href="/exam?course=PRO192&amp;kind=PE">PRO192-DA1</a></td><td>kiểu PE, 90 phút, 4 câu, 10 điểm, given NetBeans thật kèm harness đã biên dịch</td><td>Q1 Book + SpecBook (kế thừa qua trường private) · Q2 LoanList extends ArrayList&lt;Loan&gt; (bằng nhau, không phân biệt hoa thường, xoá an toàn) · Q3 MyCode cài ICode cho sẵn (mã tài liệu) · Q4 CommandProcessor (đọc tệp lệnh, ghi tệp kết quả)</td></tr>
<tr><td><a href="/exam?course=PRO192&amp;kind=FE">PRO192-DA-FE1</a></td><td>kiểu FE, 60 phút, 50 câu</td><td>chín chương, phần lớn trên domain CT Library; mọi câu có code đều đã biên dịch và chạy, mọi đáp án đều có giải thích</td></tr>
</tbody>
</table>
<p>Cả hai đề đều tự soạn (không phải đề của trường). Bộ chấm của DA1 cho lời giải mẫu 10/10 và khung rỗng 0/10; mỗi test case ăn cả hoặc mất cả, như PE thật.</p>`),
    bi(`<h2>10. The next legs — same interfaces, new storage</h2>
<ul>
<li><strong>PostgreSQL</strong> (the PostgreSQL course, then LAB211): <code>JdbcBookRepository implements IBookRepository</code>, and the same for members and loans — <code>PreparedStatement</code> instead of CSV lines, and a <strong>transaction</strong> around "add the loan + take one copy off the shelf", the pair that section 5.2 ordered by hand. AppController changes three <code>new</code> lines.</li>
<li><strong>CSD201</strong>: your own <code>MyHashMap</code> replaces the id index, <code>MyLinkedList</code> keeps the loan history, a <code>BST</code> (later a balanced one) answers the title search — behind the repository contract, measured on the same 2,000 loans.</li>
<li><strong>Spring Boot</strong>: AppController becomes the Spring container, constructor injection becomes <code>@Autowired</code> (or just a constructor), <code>ILoanRepository</code> becomes a <code>JpaRepository</code>, and the "catch LibraryException once" rule becomes one <code>@ControllerAdvice</code>.</li>
</ul>
<h3>Self-check</h3>
<ol>
<li>A student owes exactly 50,000đ. Can she borrow? <details><summary>Answer</summary><p>Yes: the card locks only when the debt is GREATER than 50,000đ (<code>&gt;</code>, not <code>&gt;=</code>).</p></details></li>
<li>Why is the fine stored in <code>loans.csv</code> instead of being computed again for the revenue report? <details><summary>Answer</summary><p>Because the policy may change; revenue is what was charged at the time of the return. Recomputing would rewrite history.</p></details></li>
<li>Where is the only place that knows the data lives in CSV files? <details><summary>Answer</summary><p>AppController (the three <code>new File…Repository</code> lines). Everything else talks to the interfaces.</p></details></li>
</ol>`,
    `<h2>10. Chặng tiếp — cùng interface, đổi nơi lưu</h2>
<ul>
<li><strong>PostgreSQL</strong> (khoá PostgreSQL, rồi LAB211): <code>JdbcBookRepository implements IBookRepository</code>, và tương tự cho thành viên, lượt mượn — <code>PreparedStatement</code> thay cho dòng CSV, và một <strong>transaction</strong> bọc "ghi lượt mượn + trừ một bản trên kệ", đúng cặp mà mục 5.2 sắp thứ tự bằng tay. AppController đổi ba dòng <code>new</code>.</li>
<li><strong>CSD201</strong>: <code>MyHashMap</code> tự viết thay chỉ mục theo mã, <code>MyLinkedList</code> giữ lịch sử mượn, một <code>BST</code> (sau là cây cân bằng) trả lời tìm theo tên — đứng sau hợp đồng của kho, đo trên đúng 2.000 lượt mượn.</li>
<li><strong>Spring Boot</strong>: AppController thành container của Spring, tiêm qua constructor thành <code>@Autowired</code> (hoặc chỉ một constructor), <code>ILoanRepository</code> thành một <code>JpaRepository</code>, và luật "bắt LibraryException một lần" thành một <code>@ControllerAdvice</code>.</li>
</ul>
<h3>Tự kiểm</h3>
<ol>
<li>Một sinh viên nợ đúng 50.000đ. Bạn ấy có mượn được không? <details><summary>Đáp án</summary><p>Được: thẻ chỉ khoá khi nợ LỚN HƠN 50.000đ (<code>&gt;</code>, không phải <code>&gt;=</code>).</p></details></li>
<li>Vì sao tiền phạt được lưu trong <code>loans.csv</code> thay vì tính lại cho báo cáo doanh thu? <details><summary>Đáp án</summary><p>Vì chính sách có thể đổi; doanh thu là số tiền đã tính lúc trả. Tính lại là viết lại lịch sử.</p></details></li>
<li>Chỗ duy nhất biết dữ liệu nằm trong tệp CSV là đâu? <details><summary>Đáp án</summary><p>AppController (ba dòng <code>new File…Repository</code>). Mọi chỗ khác chỉ nói chuyện với interface.</p></details></li>
</ol>`),
  ].join('\n'),
};

export default {
  lessons: [L_da],
};
