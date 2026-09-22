/**
 * SWT301 · Lab 2.5.6 — Sample slides: the finished Lab 2.5 deliverable for the Library Management System.
 *
 * 68 slides, English, plain PowerPoint style; every screenshot comes from a real run on the
 * public repository (JUnit/Maven output, SonarQube Web API data, the code before and after the fix).
 * Slide pictures: images/academy/SWT301/v1/lab25-sample/NNN.webp (scripts/upload-academy-slides.mjs).
 * Files: https://media.cuongthai.com/files/academy/SWT301/v1/ (.pptx + .pdf, scripts/upload-academy-file.mjs).
 * Generated from the deck's slide manifest, so the text under each picture matches the rendered deck.
 */
import { bi, walk, registerDeck } from './_slides.mjs';

registerDeck('lab25-sample', { code: 'Sample deck', en: 'Lab 2.5 — sample slides', vi: 'Lab 2.5 — slide bài mẫu', total: 68, w: 1920, h: 1080 });

export default {
  title: 'Lab 2.5.6 — Sample slides: the finished report, slide by slide|||Lab 2.5.6 — Slide bài mẫu: bản báo cáo hoàn chỉnh, từng slide',
  slug: 'swt301-lab25-slide-bai-mau',
  type: 'DOCUMENT',
  description: "Bộ slide mẫu 68 trang (tiếng Anh, kiểu PowerPoint chuẩn) cho Lab 2.5: Library Management System, 5 thành viên × 3 defect, mỗi defect đủ 4 mục của form — ảnh công cụ báo lỗi, ảnh code lỗi, công cụ, mức độ, cách sửa và ảnh sau khi sửa. Tải được file .pptx và .pdf.",
  content: [
    bi("<span class=\"eyebrow\">Lab 2.5 · Lesson 6 · Sample deliverable</span>\n<h2>A finished sample deck</h2>\n<p class=\"lead\">This is a complete sample of the Lab 2.5 deliverable for the <strong>Library Management System</strong>: <strong>68 slides</strong> that follow the lecturer's form exactly — five members, three defects each, and the four required items for every defect. Nothing in it is invented: every screenshot comes from a real run of the tools on the public repository, and every defect was fixed and tested again.</p>\n<a class=\"link-card dl\" href=\"https://media.cuongthai.com/files/academy/SWT301/v1/SWT301-Lab2.5-Sample-Slides-Library-Management-System.pptx\" target=\"_blank\" rel=\"noopener\">\n  <span class=\"lc-ico\">📊</span>\n  <span class=\"lc-body\"><span class=\"lc-title\">Download the slides (.pptx, editable)</span><span class=\"lc-sub\">PowerPoint · 68 slides · speaker notes in simple English under every slide</span></span>\n  <span class=\"lc-cta\">DOWNLOAD →</span>\n</a>\n<a class=\"link-card dl\" href=\"https://media.cuongthai.com/files/academy/SWT301/v1/SWT301-Lab2.5-Sample-Slides-Library-Management-System.pdf\" target=\"_blank\" rel=\"noopener\">\n  <span class=\"lc-ico\">📄</span>\n  <span class=\"lc-body\"><span class=\"lc-title\">Open the slides as PDF</span><span class=\"lc-sub\">Read on a phone or an iPad without PowerPoint</span></span>\n  <span class=\"lc-cta\">OPEN →</span>\n</a>\n<h3>What each defect gets: three slides</h3>\n<div class=\"table-wrap\"><table>\n<thead><tr><th>Slide</th><th>Content</th><th>Form item</th></tr></thead>\n<tbody>\n<tr><td><strong>1 · Name and tool</strong></td><td>Defect name, location, tool, severity and priority, and the screenshot of the tool reporting it</td><td>1, 2, 3</td></tr>\n<tr><td><strong>2 · Defective code</strong></td><td>Screenshot of the defective lines (line numbers visible), steps to reproduce, expected and actual result</td><td>1</td></tr>\n<tr><td><strong>3 · Fix</strong></td><td>What was changed, the code after the fix, and the tool result after the fix</td><td>4</td></tr>\n</tbody>\n</table></div>\n<h3>How to use it</h3>\n<ol>\n<li>Download the <strong>.pptx</strong> and fill in the blanks: class, lecturer, group, full names and student IDs.</li>\n<li>Keep the structure. If your group tests another project, replace the defects with your own — but keep the three slides per defect.</li>\n<li>Read the speaker notes: every slide has a short script in simple English that you can say in class.</li>\n</ol>\n<div class=\"pitfall\">This deck is a <strong>model</strong>, not something to hand in under your name. The grade comes from defects that <em>you</em> found and can explain — the lecturer will ask how you found them.</div>\n<h2>📑 The deck, slide by slide</h2>\n<p>Each slide is shown exactly as it is in the file, followed by what it is for.</p>", "<span class=\"eyebrow\">Lab 2.5 · Bài 6 · Sản phẩm mẫu</span>\n<h2>Bộ slide mẫu hoàn chỉnh</h2>\n<p class=\"lead\">Đây là bản mẫu hoàn chỉnh của sản phẩm nộp Lab 2.5 cho <strong>Library Management System</strong>: <strong>68 slide</strong> theo đúng form của giảng viên — 5 thành viên, mỗi người 3 defect, mỗi defect đủ 4 mục bắt buộc. Không có gì bịa: mọi ảnh chụp đều từ lần chạy thật các công cụ trên kho mã công khai, và mọi defect đều đã được sửa và kiểm lại.</p>\n<a class=\"link-card dl\" href=\"https://media.cuongthai.com/files/academy/SWT301/v1/SWT301-Lab2.5-Sample-Slides-Library-Management-System.pptx\" target=\"_blank\" rel=\"noopener\">\n  <span class=\"lc-ico\">📊</span>\n  <span class=\"lc-body\"><span class=\"lc-title\">Tải slide (.pptx, sửa được)</span><span class=\"lc-sub\">PowerPoint · 68 slide · dưới mỗi slide có speaker notes bằng tiếng Anh đơn giản</span></span>\n  <span class=\"lc-cta\">TẢI VỀ →</span>\n</a>\n<a class=\"link-card dl\" href=\"https://media.cuongthai.com/files/academy/SWT301/v1/SWT301-Lab2.5-Sample-Slides-Library-Management-System.pdf\" target=\"_blank\" rel=\"noopener\">\n  <span class=\"lc-ico\">📄</span>\n  <span class=\"lc-body\"><span class=\"lc-title\">Mở slide dạng PDF</span><span class=\"lc-sub\">Xem trên điện thoại hoặc iPad, không cần PowerPoint</span></span>\n  <span class=\"lc-cta\">MỞ →</span>\n</a>\n<h3>Mỗi defect có ba slide</h3>\n<div class=\"table-wrap\"><table>\n<thead><tr><th>Slide</th><th>Nội dung</th><th>Mục của form</th></tr></thead>\n<tbody>\n<tr><td><strong>1 · Tên và công cụ</strong></td><td>Tên defect, vị trí, công cụ, severity và priority, ảnh công cụ báo lỗi</td><td>1, 2, 3</td></tr>\n<tr><td><strong>2 · Code lỗi</strong></td><td>Ảnh dòng code lỗi (thấy số dòng), các bước tái hiện, kết quả mong đợi và thực tế</td><td>1</td></tr>\n<tr><td><strong>3 · Cách sửa</strong></td><td>Đã sửa gì, code sau khi sửa, và kết quả công cụ sau khi sửa</td><td>4</td></tr>\n</tbody>\n</table></div>\n<h3>Cách dùng</h3>\n<ol>\n<li>Tải file <strong>.pptx</strong> về, điền chỗ trống: lớp, giảng viên, nhóm, họ tên và MSSV.</li>\n<li>Giữ nguyên bố cục. Nhóm làm project khác thì thay defect bằng defect của nhóm — nhưng vẫn giữ ba slide cho mỗi defect.</li>\n<li>Đọc speaker notes: slide nào cũng có một đoạn thoại ngắn bằng tiếng Anh đơn giản để nói trên lớp.</li>\n</ol>\n<div class=\"pitfall\">Bộ slide này là <strong>mẫu để học bố cục</strong>, không phải để nộp dưới tên mình. Điểm đến từ những defect <em>chính bạn</em> tìm ra và giải thích được — giảng viên sẽ hỏi bạn tìm ra bằng cách nào.</div>\n<h2>📑 Xem từng slide</h2>\n<p>Mỗi slide giữ nguyên như trong file, ngay dưới là giải thích slide đó dùng để làm gì.</p>"),
    walk('lab25-sample', [
      [
        1,
        "The cover: project name, course and lab",
        "<p class=\"y-chinh\">🎯 The cover: the project name, the course and the lab. Fill in the class, the lecturer and the group before you submit.</p>",
        "<p class=\"y-chinh\">🎯 Trang bìa: tên project, tên môn, tên bài lab. Điền lớp, giảng viên và nhóm trước khi nộp.</p>"
      ],
      [
        2,
        "Team members and tasks",
        "<p class=\"y-chinh\">🎯 The work assignment: one module per member, so no two members report the same defect. The Defects column shows the three defects each member owns.</p>\n<p class=\"meo\">🧠 The lecturer's form does not ask for this table, but graders look for it: it shows who did what.</p>",
        "<p class=\"y-chinh\">🎯 Bảng phân công: mỗi người một module nên không ai báo trùng defect của người khác. Cột Defects là ba defect mỗi người phụ trách.</p>\n<p class=\"meo\">🧠 Form của giảng viên không ghi bảng này, nhưng người chấm luôn tìm nó: nó cho thấy ai làm phần nào.</p>"
      ],
      [
        3,
        "Contents",
        "<p class=\"y-chinh\">🎯 Table of contents: the three sections of the form (I, II, III), plus what a professional report adds: regression testing, conclusion, references and an appendix.</p>",
        "<p class=\"y-chinh\">🎯 Mục lục: ba mục của form (I, II, III), cộng thêm những phần một báo cáo chuyên nghiệp nên có: regression test, kết luận, tài liệu tham khảo và phụ lục.</p>"
      ],
      [
        4,
        "I. Introduction – Project",
        "<p class=\"y-chinh\">🎯 I. Introduction — Project: what the system does, its main features and its technology. One slide is enough: the grade is in section III.</p>",
        "<p class=\"y-chinh\">🎯 I. Giới thiệu project: hệ thống làm gì, chức năng chính và công nghệ. Một slide là đủ: điểm nằm ở mục III.</p>"
      ],
      [
        5,
        "Modules and owners",
        "<p class=\"y-chinh\">🎯 The module map: eleven modules split across five members. This is how the group makes sure that nobody reports the same defect twice.</p>",
        "<p class=\"y-chinh\">🎯 Sơ đồ module: 11 module chia cho 5 thành viên. Nhờ vậy nhóm chắc chắn không ai báo trùng một defect.</p>"
      ],
      [
        6,
        "II. Introduction – Tool",
        "<p class=\"y-chinh\">🎯 II. Introduction — Tool: four tools and the type of testing each one does. Static testing reads the code without running it; dynamic testing runs it (vocabulary from Chapters 1 and 3).</p>",
        "<p class=\"y-chinh\">🎯 II. Giới thiệu công cụ: bốn công cụ và loại kiểm thử mỗi công cụ làm. Kiểm thử tĩnh đọc code mà không chạy; kiểm thử động thì chạy code (thuật ngữ Chương 1 và 3).</p>"
      ],
      [
        7,
        "Test environment",
        "<p class=\"y-chinh\">🎯 The test environment. Versions matter: running Maven on JDK 25 instead of 21 produced 60 false errors, so always write the exact versions.</p>",
        "<p class=\"y-chinh\">🎯 Môi trường kiểm thử. Phiên bản rất quan trọng: chạy Maven bằng JDK 25 thay vì 21 sinh ra 60 lỗi giả, nên luôn ghi đúng phiên bản.</p>"
      ],
      [
        8,
        "Tool result – SonarQube",
        "<p class=\"y-chinh\">🎯 The SonarQube dashboard for the whole project: 38 issues, 8 of them Blocker. The Quality Gate still says \"Passed\", because the default gate only checks new code.</p>",
        "<p class=\"y-chinh\">🎯 Dashboard SonarQube của cả project: 38 issue, 8 cái mức Blocker. Quality Gate vẫn báo \"Passed\", vì cổng mặc định chỉ xét code mới.</p>"
      ],
      [
        9,
        "Tool result – JUnit 5 + Maven",
        "<p class=\"y-chinh\">🎯 The 112 existing tests all pass, and yet 15 defects are still there. The right side is the method used for every defect: write a test of the correct behaviour → it fails before the fix → it passes after the fix → run everything again.</p>",
        "<p class=\"y-chinh\">🎯 112 test có sẵn đều xanh, vậy mà vẫn còn 15 defect. Bên phải là phương pháp dùng cho mọi defect: viết test theo hành vi đúng → trước khi sửa thì đỏ → sửa xong thì xanh → chạy lại toàn bộ.</p>"
      ],
      [
        10,
        "Find defects – overview",
        "<p class=\"y-chinh\">🎯 All 15 defects on one slide: who found each one, with which tool, and its severity and priority.</p>",
        "<p class=\"y-chinh\">🎯 Cả 15 defect trong một slide: ai tìm ra, bằng công cụ nào, severity và priority.</p>"
      ],
      [
        11,
        "3.1 Member 1 – Loan + Fee",
        "<p class=\"y-chinh\">🎯 Section 3.1: Member 1 presents the module Loan + Fee — three defects, three slides each.</p>",
        "<p class=\"y-chinh\">🎯 Mục 3.1: Thành viên 1 trình bày module Loan + Fee — ba defect, mỗi defect ba slide.</p>"
      ],
      [
        12,
        "BUG-01 · A late-returned copy can never be borrowed again",
        "<p class=\"y-chinh\">🎯 BUG-01, form items 1–3: the name, the tool report, the tool and the level. Found by Member 1 (Loan + Fee).</p>\n<ul>\n<li><strong>Tool:</strong> JUnit 5 + Maven (command line). Our test of the correct behaviour fails (red). SonarQube does not detect this defect.</li>\n<li><strong>Level:</strong> severity Critical, priority High — The copy is blocked forever, while the screen still shows it as available.</li>\n</ul>",
        "<p class=\"y-chinh\">🎯 BUG-01, mục 1–3 của form: tên defect, ảnh công cụ báo lỗi, công cụ và mức độ. Người tìm: Thành viên 1 (Loan + Fee).</p>\n<ul>\n<li><strong>Tên tiếng Việt:</strong> Trả sách muộn xong, bản sao đó không bao giờ mượn lại được.</li>\n<li><strong>Công cụ:</strong> JUnit 5 + Maven (dòng lệnh).</li>\n<li><strong>Mức độ:</strong> severity Critical, priority High — bản sao bị khoá vĩnh viễn, trong khi giao diện vẫn báo còn trên kệ.</li>\n</ul>"
      ],
      [
        13,
        "BUG-01 · Defective code and steps to reproduce",
        "<p class=\"y-chinh\">🎯 BUG-01: the defective code (item 1 — the line numbers must be visible), then how to reproduce the failure.</p>\n<ul>\n<li><strong>Expected:</strong> The old loan is CLOSED and the copy can be borrowed again.</li>\n<li><strong>Actual:</strong> The loan stays OVERDUE → error \"Copy is already on loan\".</li>\n</ul>",
        "<p class=\"y-chinh\">🎯 BUG-01: dòng code lỗi (mục 1 — phải thấy số dòng), rồi cách tái hiện lỗi.</p>\n<ul>\n<li><strong>Mong đợi:</strong> Phiếu cũ được đóng (CLOSED), bản sao mượn lại được.</li>\n<li><strong>Thực tế:</strong> Phiếu kẹt ở OVERDUE → lỗi \"Copy is already on loan\".</li>\n</ul>"
      ],
      [
        14,
        "BUG-01 · Fix and result after the fix",
        "<p class=\"y-chinh\">🎯 BUG-01, form item 4: the fix and the proof after the fix.</p>\n<ul>\n<li>When a book is returned, always set the loan to CLOSED, even if it is late.</li>\n<li>\"Returned late\" is worked out from returnedDate &gt; dueDate.</li>\n</ul>\n<p class=\"nhan\">Proof</p>\n<p>The same test now passes — this is confirmation testing.</p>",
        "<p class=\"y-chinh\">🎯 BUG-01, mục 4 của form: cách sửa và bằng chứng sau khi sửa.</p>\n<ul>\n<li>Khi trả sách, phiếu mượn luôn chuyển sang CLOSED, kể cả khi trả muộn.</li>\n<li>\"Trả muộn\" được suy ra từ returnedDate &gt; dueDate.</li>\n</ul>\n<p class=\"nhan\">Bằng chứng</p>\n<p>Chính test đó giờ đã xanh — đây là confirmation testing.</p>"
      ],
      [
        15,
        "BUG-02 · Overdue fees are never charged",
        "<p class=\"y-chinh\">🎯 BUG-02, form items 1–3: the name, the tool report, the tool and the level. Found by Member 1 (Loan + Fee).</p>\n<ul>\n<li><strong>Tool:</strong> SonarQube 9.9.8 (+ JUnit 5). SonarQube reports java:S1854 (Major) and java:S1481 (Minor), \"unused variable\". We rate it Major: the library loses the fine money.</li>\n<li><strong>Level:</strong> severity Major, priority High — A business rule is missing: the library never collects any late fee.</li>\n</ul>",
        "<p class=\"y-chinh\">🎯 BUG-02, mục 1–3 của form: tên defect, ảnh công cụ báo lỗi, công cụ và mức độ. Người tìm: Thành viên 1 (Loan + Fee).</p>\n<ul>\n<li><strong>Tên tiếng Việt:</strong> Phí quá hạn không bao giờ được thu.</li>\n<li><strong>Công cụ:</strong> SonarQube 9.9.8 (+ JUnit 5).</li>\n<li><strong>Mức độ:</strong> severity Major, priority High — quy tắc nghiệp vụ bị bỏ quên, thư viện không thu được đồng phạt nào.</li>\n</ul>"
      ],
      [
        16,
        "BUG-02 · Defective code and steps to reproduce",
        "<p class=\"y-chinh\">🎯 BUG-02: the defective code (item 1 — the line numbers must be visible), then how to reproduce the failure.</p>\n<ul>\n<li><strong>Expected:</strong> A fee of 3 × 1,000 = 3,000 VND is created.</li>\n<li><strong>Actual:</strong> No fee is created.</li>\n</ul>",
        "<p class=\"y-chinh\">🎯 BUG-02: dòng code lỗi (mục 1 — phải thấy số dòng), rồi cách tái hiện lỗi.</p>\n<ul>\n<li><strong>Mong đợi:</strong> Có khoản phí 3 × 1.000 = 3.000 đ.</li>\n<li><strong>Thực tế:</strong> Không có khoản phí nào.</li>\n</ul>"
      ],
      [
        17,
        "BUG-02 · Fix and result after the fix",
        "<p class=\"y-chinh\">🎯 BUG-02, form item 4: the fix and the proof after the fix.</p>\n<ul>\n<li>On a late return, create an OVERDUE fee = days overdue × 1,000 VND, linked to the loan.</li>\n<li>FeeService.createFee now also keeps the loanId it receives (backup defect B1).</li>\n</ul>\n<p class=\"nhan\">Proof</p>\n<p>The same test now passes, and a SonarQube re-scan reports 0 issues for these rules.</p>",
        "<p class=\"y-chinh\">🎯 BUG-02, mục 4 của form: cách sửa và bằng chứng sau khi sửa.</p>\n<ul>\n<li>Trả muộn thì tạo khoản phí OVERDUE = số ngày trễ × 1.000 đ.</li>\n<li>Khoản phí được gắn với phiếu mượn (qua FeeService).</li>\n</ul>\n<p class=\"nhan\">Bằng chứng</p>\n<p>Chính test đó giờ đã xanh, và quét lại SonarQube không còn issue nào của các rule này.</p>"
      ],
      [
        18,
        "BUG-03 · The borrow limit is never enforced",
        "<p class=\"y-chinh\">🎯 BUG-03, form items 1–3: the name, the tool report, the tool and the level. Found by Member 1 (Loan + Fee).</p>\n<ul>\n<li><strong>Tool:</strong> Code review (find usages) + JUnit 5. grep shows that countActiveLoansByUserId is never called. SonarQube does not detect it.</li>\n<li><strong>Level:</strong> severity Major, priority Medium — One member can borrow every book in the library.</li>\n</ul>",
        "<p class=\"y-chinh\">🎯 BUG-03, mục 1–3 của form: tên defect, ảnh công cụ báo lỗi, công cụ và mức độ. Người tìm: Thành viên 1 (Loan + Fee).</p>\n<ul>\n<li><strong>Tên tiếng Việt:</strong> Giới hạn số sách được mượn không được áp dụng.</li>\n<li><strong>Công cụ:</strong> Code review (tìm nơi gọi) + JUnit 5.</li>\n<li><strong>Mức độ:</strong> severity Major, priority Medium — một người có thể mượn hết sách trong kho.</li>\n</ul>"
      ],
      [
        19,
        "BUG-03 · Defective code and steps to reproduce",
        "<p class=\"y-chinh\">🎯 BUG-03: the defective code (item 1 — the line numbers must be visible), then how to reproduce the failure.</p>\n<ul>\n<li><strong>Expected:</strong> Rejected: the borrow limit is reached.</li>\n<li><strong>Actual:</strong> Allowed, with no error at all.</li>\n</ul>",
        "<p class=\"y-chinh\">🎯 BUG-03: dòng code lỗi (mục 1 — phải thấy số dòng), rồi cách tái hiện lỗi.</p>\n<ul>\n<li><strong>Mong đợi:</strong> Bị từ chối: đã chạm giới hạn số sách.</li>\n<li><strong>Thực tế:</strong> Vẫn mượn được, không có lỗi nào.</li>\n</ul>"
      ],
      [
        20,
        "BUG-03 · Fix and result after the fix",
        "<p class=\"y-chinh\">🎯 BUG-03, form item 4: the fix and the proof after the fix.</p>\n<ul>\n<li>Both borrow paths count the open loans of the member first.</li>\n<li>At the limit (Settings: max_loans_per_user, default 5) → HTTP 400 \"Borrow limit reached\".</li>\n</ul>\n<p class=\"nhan\">Proof</p>\n<p>The same test now passes — this is confirmation testing.</p>",
        "<p class=\"y-chinh\">🎯 BUG-03, mục 4 của form: cách sửa và bằng chứng sau khi sửa.</p>\n<ul>\n<li>Đếm số phiếu mượn đang mở của thành viên trước khi cho mượn thêm.</li>\n<li>Chạm giới hạn (lấy từ Settings) → HTTP 400 \"Borrow limit reached\".</li>\n</ul>\n<p class=\"nhan\">Bằng chứng</p>\n<p>Chính test đó giờ đã xanh — đây là confirmation testing.</p>"
      ],
      [
        21,
        "3.2 Member 2 – Book + Copy",
        "<p class=\"y-chinh\">🎯 Section 3.2: Member 2 presents the module Book + Copy — three defects, three slides each.</p>",
        "<p class=\"y-chinh\">🎯 Mục 3.2: Thành viên 2 trình bày module Book + Copy — ba defect, mỗi defect ba slide.</p>"
      ],
      [
        22,
        "BUG-04 · Searching by ISBN returns nothing",
        "<p class=\"y-chinh\">🎯 BUG-04, form items 1–3: the name, the tool report, the tool and the level. Found by Member 2 (Book + Copy).</p>\n<ul>\n<li><strong>Tool:</strong> JUnit 5 + H2 database (@DataJpaTest). We compared the promise on the screen with the real query. SonarQube does not detect it.</li>\n<li><strong>Level:</strong> severity Major, priority Medium — A feature that is written on the screen does not work.</li>\n</ul>",
        "<p class=\"y-chinh\">🎯 BUG-04, mục 1–3 của form: tên defect, ảnh công cụ báo lỗi, công cụ và mức độ. Người tìm: Thành viên 2 (Book + Copy).</p>\n<ul>\n<li><strong>Tên tiếng Việt:</strong> Ô tìm kiếm hứa \"tìm theo ISBN\" nhưng tìm ISBN không ra sách.</li>\n<li><strong>Công cụ:</strong> JUnit 5 + CSDL H2 (@DataJpaTest).</li>\n<li><strong>Mức độ:</strong> severity Major, priority Medium — chức năng ghi ngay trên giao diện nhưng không hoạt động.</li>\n</ul>"
      ],
      [
        23,
        "BUG-04 · Defective code and steps to reproduce",
        "<p class=\"y-chinh\">🎯 BUG-04: the defective code (item 1 — the line numbers must be visible), then how to reproduce the failure.</p>\n<ul>\n<li><strong>Expected:</strong> The book \"Clean Code\" is found.</li>\n<li><strong>Actual:</strong> \"No books found\": 0 results.</li>\n</ul>",
        "<p class=\"y-chinh\">🎯 BUG-04: dòng code lỗi (mục 1 — phải thấy số dòng), rồi cách tái hiện lỗi.</p>\n<ul>\n<li><strong>Mong đợi:</strong> Ra cuốn \"Clean Code\".</li>\n<li><strong>Thực tế:</strong> \"Không tìm thấy sách\": 0 kết quả.</li>\n</ul>"
      ],
      [
        24,
        "BUG-04 · Fix and result after the fix",
        "<p class=\"y-chinh\">🎯 BUG-04, form item 4: the fix and the proof after the fix.</p>\n<ul>\n<li>Add b.isbn to the keyword search (JPQL) and to the full-text search.</li>\n</ul>\n<p class=\"nhan\">Proof</p>\n<p>The same test now passes — this is confirmation testing.</p>",
        "<p class=\"y-chinh\">🎯 BUG-04, mục 4 của form: cách sửa và bằng chứng sau khi sửa.</p>\n<ul>\n<li>Thêm b.isbn vào điều kiện tìm kiếm của câu truy vấn.</li>\n</ul>\n<p class=\"nhan\">Bằng chứng</p>\n<p>Chính test đó giờ đã xanh — đây là confirmation testing.</p>"
      ],
      [
        25,
        "BUG-05 · Deleting a book also deletes its loans, even active ones",
        "<p class=\"y-chinh\">🎯 BUG-05, form items 1–3: the name, the tool report, the tool and the level. Found by Member 2 (Book + Copy).</p>\n<ul>\n<li><strong>Tool:</strong> JUnit 5 + H2 database (@DataJpaTest). A real delete on the database; we count the loans before and after the delete.</li>\n<li><strong>Level:</strong> severity Critical, priority High — Data loss: the person who has the book no longer has a loan record.</li>\n</ul>",
        "<p class=\"y-chinh\">🎯 BUG-05, mục 1–3 của form: tên defect, ảnh công cụ báo lỗi, công cụ và mức độ. Người tìm: Thành viên 2 (Book + Copy).</p>\n<ul>\n<li><strong>Tên tiếng Việt:</strong> Xoá một đầu sách xoá luôn cả phiếu mượn đang mở.</li>\n<li><strong>Công cụ:</strong> JUnit 5 + CSDL H2 (@DataJpaTest).</li>\n<li><strong>Mức độ:</strong> severity Critical, priority High — mất dữ liệu: người đang giữ sách không còn phiếu mượn.</li>\n</ul>"
      ],
      [
        26,
        "BUG-05 · Defective code and steps to reproduce",
        "<p class=\"y-chinh\">🎯 BUG-05: the defective code (item 1 — the line numbers must be visible), then how to reproduce the failure.</p>\n<ul>\n<li><strong>Expected:</strong> Blocked: the book is on loan.</li>\n<li><strong>Actual:</strong> Deleted, and the loan disappears (1 → 0).</li>\n</ul>",
        "<p class=\"y-chinh\">🎯 BUG-05: dòng code lỗi (mục 1 — phải thấy số dòng), rồi cách tái hiện lỗi.</p>\n<ul>\n<li><strong>Mong đợi:</strong> Bị chặn: sách đang có người mượn.</li>\n<li><strong>Thực tế:</strong> Xoá được, phiếu mượn biến mất (1 → 0).</li>\n</ul>"
      ],
      [
        27,
        "BUG-05 · Fix and result after the fix",
        "<p class=\"y-chinh\">🎯 BUG-05, form item 4: the fix and the proof after the fix.</p>\n<ul>\n<li>deleteBook first checks every copy: LOANED, or an ACTIVE/OVERDUE loan → HTTP 400, nothing is deleted.</li>\n<li>Follow-up: use a soft delete instead of cascade ALL, to keep the loan history.</li>\n</ul>\n<p class=\"nhan\">Proof</p>\n<p>The same test now passes — this is confirmation testing.</p>",
        "<p class=\"y-chinh\">🎯 BUG-05, mục 4 của form: cách sửa và bằng chứng sau khi sửa.</p>\n<ul>\n<li>Trước khi xoá, kiểm tra các bản sao của đầu sách.</li>\n<li>Còn bản sao đang cho mượn → HTTP 400, không xoá gì cả.</li>\n</ul>\n<p class=\"nhan\">Bằng chứng</p>\n<p>Chính test đó giờ đã xanh — đây là confirmation testing.</p>"
      ],
      [
        28,
        "BUG-06 · A duplicate ISBN returns HTTP 500 and leaks SQL details",
        "<p class=\"y-chinh\">🎯 BUG-06, form items 1–3: the name, the tool report, the tool and the level. Found by Member 2 (Book + Copy).</p>\n<ul>\n<li><strong>Tool:</strong> JUnit 5 + Mockito. We simulate the UNIQUE constraint error and check which exception comes back.</li>\n<li><strong>Level:</strong> severity Major, priority Medium — Wrong status code (500, not 400), and table and constraint names are shown to the user.</li>\n</ul>",
        "<p class=\"y-chinh\">🎯 BUG-06, mục 1–3 của form: tên defect, ảnh công cụ báo lỗi, công cụ và mức độ. Người tìm: Thành viên 2 (Book + Copy).</p>\n<ul>\n<li><strong>Tên tiếng Việt:</strong> Thêm sách trùng ISBN: lỗi 500 kèm thông điệp CSDL nội bộ.</li>\n<li><strong>Công cụ:</strong> JUnit 5 + Mockito.</li>\n<li><strong>Mức độ:</strong> severity Major, priority Medium — sai mã lỗi (500 thay vì 400) và lộ tên bảng, tên ràng buộc.</li>\n</ul>"
      ],
      [
        29,
        "BUG-06 · Defective code and steps to reproduce",
        "<p class=\"y-chinh\">🎯 BUG-06: the defective code (item 1 — the line numbers must be visible), then how to reproduce the failure.</p>\n<ul>\n<li><strong>Expected:</strong> HTTP 400 \"ISBN already exists\".</li>\n<li><strong>Actual:</strong> HTTP 500 \"An error occurred: …PUBLIC.BOOKS(ISBN)…\".</li>\n</ul>",
        "<p class=\"y-chinh\">🎯 BUG-06: dòng code lỗi (mục 1 — phải thấy số dòng), rồi cách tái hiện lỗi.</p>\n<ul>\n<li><strong>Mong đợi:</strong> HTTP 400 \"ISBN already exists\".</li>\n<li><strong>Thực tế:</strong> HTTP 500 \"An error occurred: …PUBLIC.BOOKS(ISBN)…\".</li>\n</ul>"
      ],
      [
        30,
        "BUG-06 · Fix and result after the fix",
        "<p class=\"y-chinh\">🎯 BUG-06, form item 4: the fix and the proof after the fix.</p>\n<ul>\n<li>Check the ISBN before saving (create and update) → HTTP 400 \"ISBN already exists\".</li>\n<li>The error handler logs the details and returns a generic message: no SQL is shown.</li>\n</ul>\n<p class=\"nhan\">Proof</p>\n<p>The same test now passes — this is confirmation testing.</p>",
        "<p class=\"y-chinh\">🎯 BUG-06, mục 4 của form: cách sửa và bằng chứng sau khi sửa.</p>\n<ul>\n<li>Kiểm tra ISBN trước khi lưu → HTTP 400 \"ISBN already exists\".</li>\n<li>Bộ xử lý lỗi không còn trả thông điệp của CSDL ra ngoài.</li>\n</ul>\n<p class=\"nhan\">Bằng chứng</p>\n<p>Chính test đó giờ đã xanh — đây là confirmation testing.</p>"
      ],
      [
        31,
        "3.3 Member 3 – Auth + User + Security",
        "<p class=\"y-chinh\">🎯 Section 3.3: Member 3 presents the module Auth + User + Security — three defects, three slides each.</p>",
        "<p class=\"y-chinh\">🎯 Mục 3.3: Thành viên 3 trình bày module Auth + User + Security — ba defect, mỗi defect ba slide.</p>"
      ],
      [
        32,
        "BUG-07 · A locked account keeps working with its old token",
        "<p class=\"y-chinh\">🎯 BUG-07, form items 1–3: the name, the tool report, the tool and the level. Found by Member 3 (Auth + User + Security).</p>\n<ul>\n<li><strong>Tool:</strong> JUnit 5 + Mockito. We run the JWT filter directly with a user whose active = false.</li>\n<li><strong>Level:</strong> severity Critical, priority High — Locking an account does nothing until the token expires (24 hours).</li>\n</ul>",
        "<p class=\"y-chinh\">🎯 BUG-07, mục 1–3 của form: tên defect, ảnh công cụ báo lỗi, công cụ và mức độ. Người tìm: Thành viên 3 (Auth + User + Security).</p>\n<ul>\n<li><strong>Tên tiếng Việt:</strong> Tài khoản đã bị khoá vẫn dùng được token cũ.</li>\n<li><strong>Công cụ:</strong> JUnit 5 + Mockito.</li>\n<li><strong>Mức độ:</strong> severity Critical, priority High — khoá tài khoản không có tác dụng tới khi token hết hạn (24 giờ).</li>\n</ul>"
      ],
      [
        33,
        "BUG-07 · Defective code and steps to reproduce",
        "<p class=\"y-chinh\">🎯 BUG-07: the defective code (item 1 — the line numbers must be visible), then how to reproduce the failure.</p>\n<ul>\n<li><strong>Expected:</strong> Rejected (HTTP 401).</li>\n<li><strong>Actual:</strong> Still authenticated, everything works.</li>\n</ul>",
        "<p class=\"y-chinh\">🎯 BUG-07: dòng code lỗi (mục 1 — phải thấy số dòng), rồi cách tái hiện lỗi.</p>\n<ul>\n<li><strong>Mong đợi:</strong> Bị từ chối (HTTP 401).</li>\n<li><strong>Thực tế:</strong> Vẫn được xác thực, dùng bình thường.</li>\n</ul>"
      ],
      [
        34,
        "BUG-07 · Fix and result after the fix",
        "<p class=\"y-chinh\">🎯 BUG-07, form item 4: the fix and the proof after the fix.</p>\n<ul>\n<li>Authenticate only when the account is enabled and not locked.</li>\n</ul>\n<p class=\"nhan\">Proof</p>\n<p>The same test now passes — this is confirmation testing.</p>",
        "<p class=\"y-chinh\">🎯 BUG-07, mục 4 của form: cách sửa và bằng chứng sau khi sửa.</p>\n<ul>\n<li>Chỉ xác thực khi tài khoản đang bật và không bị khoá.</li>\n</ul>\n<p class=\"nhan\">Bằng chứng</p>\n<p>Chính test đó giờ đã xanh — đây là confirmation testing.</p>"
      ],
      [
        35,
        "BUG-08 · Accounts created without a password get \"password123\"",
        "<p class=\"y-chinh\">🎯 BUG-08, form items 1–3: the name, the tool report, the tool and the level. Found by Member 3 (Auth + User + Security).</p>\n<ul>\n<li><strong>Tool:</strong> Code review + JUnit 5. We create a user without a password: the account is still created.</li>\n<li><strong>Level:</strong> severity Major, priority High — Anyone who knows the default password can log in to new accounts.</li>\n</ul>",
        "<p class=\"y-chinh\">🎯 BUG-08, mục 1–3 của form: tên defect, ảnh công cụ báo lỗi, công cụ và mức độ. Người tìm: Thành viên 3 (Auth + User + Security).</p>\n<ul>\n<li><strong>Tên tiếng Việt:</strong> Tạo tài khoản không nhập mật khẩu thì nhận mật khẩu mặc định \"password123\".</li>\n<li><strong>Công cụ:</strong> Code review + JUnit 5.</li>\n<li><strong>Mức độ:</strong> severity Major, priority High — ai biết mật khẩu mặc định đều đăng nhập được tài khoản mới.</li>\n</ul>"
      ],
      [
        36,
        "BUG-08 · Defective code and steps to reproduce",
        "<p class=\"y-chinh\">🎯 BUG-08: the defective code (item 1 — the line numbers must be visible), then how to reproduce the failure.</p>\n<ul>\n<li><strong>Expected:</strong> The account is not created: the password is required.</li>\n<li><strong>Actual:</strong> Created, and login with password123 works.</li>\n</ul>",
        "<p class=\"y-chinh\">🎯 BUG-08: dòng code lỗi (mục 1 — phải thấy số dòng), rồi cách tái hiện lỗi.</p>\n<ul>\n<li><strong>Mong đợi:</strong> Không tạo tài khoản: bắt buộc có mật khẩu.</li>\n<li><strong>Thực tế:</strong> Tạo được, đăng nhập bằng password123 được.</li>\n</ul>"
      ],
      [
        37,
        "BUG-08 · Fix and result after the fix",
        "<p class=\"y-chinh\">🎯 BUG-08, form item 4: the fix and the proof after the fix.</p>\n<ul>\n<li>Empty password → HTTP 400 \"Password is required\".</li>\n<li>The \"password123\" default is removed here and in registration (AuthService).</li>\n</ul>\n<p class=\"nhan\">Proof</p>\n<p>The same test now passes — this is confirmation testing.</p>",
        "<p class=\"y-chinh\">🎯 BUG-08, mục 4 của form: cách sửa và bằng chứng sau khi sửa.</p>\n<ul>\n<li>Bỏ trống mật khẩu → HTTP 400 \"Password is required\".</li>\n<li>Bỏ mật khẩu mặc định \"password123\".</li>\n</ul>\n<p class=\"nhan\">Bằng chứng</p>\n<p>Chính test đó giờ đã xanh — đây là confirmation testing.</p>"
      ],
      [
        38,
        "BUG-09 · Hard-coded passwords in the source code",
        "<p class=\"y-chinh\">🎯 BUG-09, form items 1–3: the name, the tool report, the tool and the level. Found by Member 3 (Auth + User + Security).</p>\n<ul>\n<li><strong>Tool:</strong> SonarQube 9.9.8. Vulnerability · Blocker · rule java:S6437, 2 issues.</li>\n<li><strong>Level:</strong> severity Critical, priority High — The repository is public on GitHub, so everyone knows the default librarian password.</li>\n</ul>",
        "<p class=\"y-chinh\">🎯 BUG-09, mục 1–3 của form: tên defect, ảnh công cụ báo lỗi, công cụ và mức độ. Người tìm: Thành viên 3 (Auth + User + Security).</p>\n<ul>\n<li><strong>Tên tiếng Việt:</strong> Mật khẩu viết cứng trong mã nguồn (DataLoader).</li>\n<li><strong>Công cụ:</strong> SonarQube 9.9.8.</li>\n<li><strong>Mức độ:</strong> severity Critical, priority High — repo công khai trên GitHub nên ai cũng biết mật khẩu thủ thư mặc định.</li>\n</ul>"
      ],
      [
        39,
        "BUG-09 · Defective code and steps to reproduce",
        "<p class=\"y-chinh\">🎯 BUG-09: the defective code (item 1 — the line numbers must be visible), then how to reproduce the failure.</p>\n<ul>\n<li><strong>Expected:</strong> No real password in the source code.</li>\n<li><strong>Actual:</strong> Login works, with librarian rights.</li>\n</ul>",
        "<p class=\"y-chinh\">🎯 BUG-09: dòng code lỗi (mục 1 — phải thấy số dòng), rồi cách tái hiện lỗi.</p>\n<ul>\n<li><strong>Mong đợi:</strong> Không có mật khẩu thật trong mã nguồn.</li>\n<li><strong>Thực tế:</strong> Đăng nhập được với quyền thủ thư.</li>\n</ul>"
      ],
      [
        40,
        "BUG-09 · Fix and result after the fix",
        "<p class=\"y-chinh\">🎯 BUG-09, form item 4: the fix and the proof after the fix.</p>\n<ul>\n<li>Seed passwords come from environment variables (SEED_LIBRARIAN_PASSWORD, SEED_MEMBER_PASSWORD).</li>\n<li>If none is set, a random password is generated (SecureRandom).</li>\n</ul>\n<p class=\"nhan\">Proof</p>\n<p>A SonarQube re-scan reports 0 issues for this rule.</p>",
        "<p class=\"y-chinh\">🎯 BUG-09, mục 4 của form: cách sửa và bằng chứng sau khi sửa.</p>\n<ul>\n<li>Mật khẩu seed đọc từ biến môi trường, không viết trong code.</li>\n<li>Không cấu hình thì sinh mật khẩu ngẫu nhiên.</li>\n</ul>\n<p class=\"nhan\">Bằng chứng</p>\n<p>Quét lại SonarQube không còn issue nào của rule này.</p>"
      ],
      [
        41,
        "3.4 Member 4 – Reservation + Review",
        "<p class=\"y-chinh\">🎯 Section 3.4: Member 4 presents the module Reservation + Review — three defects, three slides each.</p>",
        "<p class=\"y-chinh\">🎯 Mục 3.4: Thành viên 4 trình bày module Reservation + Review — ba defect, mỗi defect ba slide.</p>"
      ],
      [
        42,
        "BUG-10 · The reservation queue never moves",
        "<p class=\"y-chinh\">🎯 BUG-10, form items 1–3: the name, the tool report, the tool and the level. Found by Member 4 (Reservation + Review).</p>\n<ul>\n<li><strong>Tool:</strong> Code review (find usages) + JUnit 5. grep: checkAndNotifyReadyReservations has only its definition; nobody calls it.</li>\n<li><strong>Level:</strong> severity Critical, priority High — The reservation feature is useless: nobody is told, and \"Fulfill\" always fails.</li>\n</ul>",
        "<p class=\"y-chinh\">🎯 BUG-10, mục 1–3 của form: tên defect, ảnh công cụ báo lỗi, công cụ và mức độ. Người tìm: Thành viên 4 (Reservation + Review).</p>\n<ul>\n<li><strong>Tên tiếng Việt:</strong> Hàng đợi đặt trước không bao giờ tới lượt ai.</li>\n<li><strong>Công cụ:</strong> Code review (tìm nơi gọi) + JUnit 5.</li>\n<li><strong>Mức độ:</strong> severity Critical, priority High — cả chức năng đặt trước vô dụng: không ai được báo, \"Fulfill\" luôn lỗi.</li>\n</ul>"
      ],
      [
        43,
        "BUG-10 · Defective code and steps to reproduce",
        "<p class=\"y-chinh\">🎯 BUG-10: the defective code (item 1 — the line numbers must be visible), then how to reproduce the failure.</p>\n<ul>\n<li><strong>Expected:</strong> The reservation of A becomes READY and can be fulfilled.</li>\n<li><strong>Actual:</strong> It stays WAITING: \"Reservation is not in READY status\".</li>\n</ul>",
        "<p class=\"y-chinh\">🎯 BUG-10: dòng code lỗi (mục 1 — phải thấy số dòng), rồi cách tái hiện lỗi.</p>\n<ul>\n<li><strong>Mong đợi:</strong> Đặt chỗ của A chuyển sang READY, giao được.</li>\n<li><strong>Thực tế:</strong> Mãi WAITING: \"Reservation is not in READY status\".</li>\n</ul>"
      ],
      [
        44,
        "BUG-10 · Fix and result after the fix",
        "<p class=\"y-chinh\">🎯 BUG-10, form item 4: the fix and the proof after the fix.</p>\n<ul>\n<li>When a copy is returned, LoanService calls checkAndNotifyReadyReservations().</li>\n<li>The first waiting reservation becomes READY.</li>\n</ul>\n<p class=\"nhan\">Proof</p>\n<p>The same test now passes — this is confirmation testing.</p>",
        "<p class=\"y-chinh\">🎯 BUG-10, mục 4 của form: cách sửa và bằng chứng sau khi sửa.</p>\n<ul>\n<li>Khi bản sao được trả, LoanService gọi checkAndNotifyReadyReservations().</li>\n<li>Đặt chỗ đang chờ đầu tiên chuyển sang READY.</li>\n</ul>\n<p class=\"nhan\">Bằng chứng</p>\n<p>Chính test đó giờ đã xanh — đây là confirmation testing.</p>"
      ],
      [
        45,
        "BUG-11 · Librarians cannot cancel a member's reservation",
        "<p class=\"y-chinh\">🎯 BUG-11, form items 1–3: the name, the tool report, the tool and the level. Found by Member 4 (Reservation + Review).</p>\n<ul>\n<li><strong>Tool:</strong> Code review + JUnit 5 + Mockito. The code checks the role of the reservation OWNER, not the role of the user who clicks.</li>\n<li><strong>Level:</strong> severity Major, priority Medium — The librarian cannot clean up wrong or stuck reservations.</li>\n</ul>",
        "<p class=\"y-chinh\">🎯 BUG-11, mục 1–3 của form: tên defect, ảnh công cụ báo lỗi, công cụ và mức độ. Người tìm: Thành viên 4 (Reservation + Review).</p>\n<ul>\n<li><strong>Tên tiếng Việt:</strong> Thủ thư không huỷ được đặt chỗ của thành viên.</li>\n<li><strong>Công cụ:</strong> Code review + JUnit 5 + Mockito.</li>\n<li><strong>Mức độ:</strong> severity Major, priority Medium — thủ thư không dọn được đặt chỗ sai hoặc bị treo.</li>\n</ul>"
      ],
      [
        46,
        "BUG-11 · Defective code and steps to reproduce",
        "<p class=\"y-chinh\">🎯 BUG-11: the defective code (item 1 — the line numbers must be visible), then how to reproduce the failure.</p>\n<ul>\n<li><strong>Expected:</strong> The reservation is cancelled.</li>\n<li><strong>Actual:</strong> Error: \"You can only cancel your own reservations\".</li>\n</ul>",
        "<p class=\"y-chinh\">🎯 BUG-11: dòng code lỗi (mục 1 — phải thấy số dòng), rồi cách tái hiện lỗi.</p>\n<ul>\n<li><strong>Mong đợi:</strong> Huỷ thành công.</li>\n<li><strong>Thực tế:</strong> Lỗi \"You can only cancel your own reservations\".</li>\n</ul>"
      ],
      [
        47,
        "BUG-11 · Fix and result after the fix",
        "<p class=\"y-chinh\">🎯 BUG-11, form item 4: the fix and the proof after the fix.</p>\n<ul>\n<li>Load the caller and check the caller's role, not the owner's.</li>\n<li>The owner or a librarian can cancel.</li>\n</ul>\n<p class=\"nhan\">Proof</p>\n<p>The same test now passes — this is confirmation testing.</p>",
        "<p class=\"y-chinh\">🎯 BUG-11, mục 4 của form: cách sửa và bằng chứng sau khi sửa.</p>\n<ul>\n<li>Kiểm tra vai trò của người đang huỷ (người gọi).</li>\n<li>Chủ đặt chỗ hoặc thủ thư đều huỷ được.</li>\n</ul>\n<p class=\"nhan\">Bằng chứng</p>\n<p>Chính test đó giờ đã xanh — đây là confirmation testing.</p>"
      ],
      [
        48,
        "BUG-12 · A review without a rating crashes with HTTP 500",
        "<p class=\"y-chinh\">🎯 BUG-12, form items 1–3: the name, the tool report, the tool and the level. Found by Member 4 (Reservation + Review).</p>\n<ul>\n<li><strong>Tool:</strong> JUnit 5 (+ Postman). rating = null → NullPointerException instead of a 400 error.</li>\n<li><strong>Level:</strong> severity Minor, priority Medium — No data is damaged, but the status code is wrong and an internal message is shown.</li>\n</ul>",
        "<p class=\"y-chinh\">🎯 BUG-12, mục 1–3 của form: tên defect, ảnh công cụ báo lỗi, công cụ và mức độ. Người tìm: Thành viên 4 (Reservation + Review).</p>\n<ul>\n<li><strong>Tên tiếng Việt:</strong> Gửi đánh giá thiếu số sao làm server lỗi 500.</li>\n<li><strong>Công cụ:</strong> JUnit 5 (+ Postman).</li>\n<li><strong>Mức độ:</strong> severity Minor, priority Medium — không hỏng dữ liệu, nhưng sai mã lỗi và lộ thông điệp nội bộ.</li>\n</ul>"
      ],
      [
        49,
        "BUG-12 · Defective code and steps to reproduce",
        "<p class=\"y-chinh\">🎯 BUG-12: the defective code (item 1 — the line numbers must be visible), then how to reproduce the failure.</p>\n<ul>\n<li><strong>Expected:</strong> HTTP 400 \"Rating must be between 1 and 5\".</li>\n<li><strong>Actual:</strong> HTTP 500 \"…Integer.intValue() because rating is null\".</li>\n</ul>",
        "<p class=\"y-chinh\">🎯 BUG-12: dòng code lỗi (mục 1 — phải thấy số dòng), rồi cách tái hiện lỗi.</p>\n<ul>\n<li><strong>Mong đợi:</strong> HTTP 400 \"Rating must be between 1 and 5\".</li>\n<li><strong>Thực tế:</strong> HTTP 500 \"…Integer.intValue() because rating is null\".</li>\n</ul>"
      ],
      [
        50,
        "BUG-12 · Fix and result after the fix",
        "<p class=\"y-chinh\">🎯 BUG-12, form item 4: the fix and the proof after the fix.</p>\n<ul>\n<li>The service rejects a missing or wrong rating → HTTP 400; the request is validated with @Valid, @NotNull, @Min(1), @Max(5).</li>\n<li>Found while fixing: extractUserId() always returns null, so even a valid review fails (appendix B10).</li>\n</ul>\n<p class=\"nhan\">Proof</p>\n<p>The same test now passes — this is confirmation testing.</p>",
        "<p class=\"y-chinh\">🎯 BUG-12, mục 4 của form: cách sửa và bằng chứng sau khi sửa.</p>\n<ul>\n<li>Service từ chối rating thiếu hoặc sai → HTTP 400.</li>\n<li>Request được kiểm tra bằng @Valid, @NotNull, @Min(1), @Max(5).</li>\n</ul>\n<p class=\"nhan\">Bằng chứng</p>\n<p>Chính test đó giờ đã xanh — đây là confirmation testing.</p>"
      ],
      [
        51,
        "3.5 Member 5 – Notification + Settings",
        "<p class=\"y-chinh\">🎯 Section 3.5: Member 5 presents the module Notification + Settings — three defects, three slides each.</p>",
        "<p class=\"y-chinh\">🎯 Mục 3.5: Thành viên 5 trình bày module Notification + Settings — ba defect, mỗi defect ba slide.</p>"
      ],
      [
        52,
        "BUG-13 · The system never creates a notification",
        "<p class=\"y-chinh\">🎯 BUG-13, form items 1–3: the name, the tool report, the tool and the level. Found by Member 5 (Notification + Settings).</p>\n<ul>\n<li><strong>Tool:</strong> Code review (find usages) + JUnit 5. grep: every notify…() method is called only inside NotificationService itself.</li>\n<li><strong>Level:</strong> severity Major, priority Medium — Members are never reminded of due dates or told that a reserved book is ready.</li>\n</ul>",
        "<p class=\"y-chinh\">🎯 BUG-13, mục 1–3 của form: tên defect, ảnh công cụ báo lỗi, công cụ và mức độ. Người tìm: Thành viên 5 (Notification + Settings).</p>\n<ul>\n<li><strong>Tên tiếng Việt:</strong> Hệ thống không bao giờ tạo thông báo nào.</li>\n<li><strong>Công cụ:</strong> Code review (tìm nơi gọi) + JUnit 5.</li>\n<li><strong>Mức độ:</strong> severity Major, priority Medium — không bao giờ nhắc hạn trả hay báo sách đặt trước đã sẵn sàng.</li>\n</ul>"
      ],
      [
        53,
        "BUG-13 · Defective code and steps to reproduce",
        "<p class=\"y-chinh\">🎯 BUG-13: the defective code (item 1 — the line numbers must be visible), then how to reproduce the failure.</p>\n<ul>\n<li><strong>Expected:</strong> A \"Book Borrowed\" notification is shown.</li>\n<li><strong>Actual:</strong> The bell always shows 0 notifications.</li>\n</ul>",
        "<p class=\"y-chinh\">🎯 BUG-13: dòng code lỗi (mục 1 — phải thấy số dòng), rồi cách tái hiện lỗi.</p>\n<ul>\n<li><strong>Mong đợi:</strong> Có thông báo \"Book Borrowed\".</li>\n<li><strong>Thực tế:</strong> Chuông luôn 0 thông báo.</li>\n</ul>"
      ],
      [
        54,
        "BUG-13 · Fix and result after the fix",
        "<p class=\"y-chinh\">🎯 BUG-13, form item 4: the fix and the proof after the fix.</p>\n<ul>\n<li>Borrow (both paths), return and \"reservation ready\" now call the notify…() methods.</li>\n</ul>\n<p class=\"nhan\">Proof</p>\n<p>The same test now passes — this is confirmation testing.</p>",
        "<p class=\"y-chinh\">🎯 BUG-13, mục 4 của form: cách sửa và bằng chứng sau khi sửa.</p>\n<ul>\n<li>Mượn, trả sách và \"đặt chỗ sẵn sàng\" giờ đều gọi các hàm notify…().</li>\n</ul>\n<p class=\"nhan\">Bằng chứng</p>\n<p>Chính test đó giờ đã xanh — đây là confirmation testing.</p>"
      ],
      [
        55,
        "BUG-14 · @Transactional is ignored on self-invocation",
        "<p class=\"y-chinh\">🎯 BUG-14, form items 1–3: the name, the tool report, the tool and the level. Found by Member 5 (Notification + Settings).</p>\n<ul>\n<li><strong>Tool:</strong> SonarQube 9.9.8. Bug · Blocker · rule java:S2229, 6 issues of the same kind.</li>\n<li><strong>Level:</strong> severity Minor, priority Low — SonarQube says Blocker; we say Minor: today each save() has its own transaction, so it is only a hidden risk.</li>\n</ul>",
        "<p class=\"y-chinh\">🎯 BUG-14, mục 1–3 của form: tên defect, ảnh công cụ báo lỗi, công cụ và mức độ. Người tìm: Thành viên 5 (Notification + Settings).</p>\n<ul>\n<li><strong>Tên tiếng Việt:</strong> @Transactional bị Spring bỏ qua khi gọi nội bộ trong cùng lớp.</li>\n<li><strong>Công cụ:</strong> SonarQube 9.9.8.</li>\n<li><strong>Mức độ:</strong> severity Minor, priority Low — SonarQube xếp Blocker; nhóm hạ xuống Minor vì hiện mỗi save() đã có transaction riêng, chỉ là rủi ro tiềm ẩn.</li>\n</ul>"
      ],
      [
        56,
        "BUG-14 · Defective code and steps to reproduce",
        "<p class=\"y-chinh\">🎯 BUG-14: the defective code (item 1 — the line numbers must be visible), then how to reproduce the failure.</p>\n<ul>\n<li><strong>Expected:</strong> createNotification runs inside a transaction.</li>\n<li><strong>Actual:</strong> There is no surrounding transaction.</li>\n</ul>",
        "<p class=\"y-chinh\">🎯 BUG-14: dòng code lỗi (mục 1 — phải thấy số dòng), rồi cách tái hiện lỗi.</p>\n<ul>\n<li><strong>Mong đợi:</strong> createNotification chạy trong transaction.</li>\n<li><strong>Thực tế:</strong> Không có transaction bao ngoài.</li>\n</ul>"
      ],
      [
        57,
        "BUG-14 · Fix and result after the fix",
        "<p class=\"y-chinh\">🎯 BUG-14, form item 4: the fix and the proof after the fix.</p>\n<ul>\n<li>@Transactional is moved to the class, so every public method runs through the Spring proxy.</li>\n<li>The redundant method-level annotations are removed.</li>\n</ul>\n<p class=\"nhan\">Proof</p>\n<p>A SonarQube re-scan reports 0 issues for this rule.</p>",
        "<p class=\"y-chinh\">🎯 BUG-14, mục 4 của form: cách sửa và bằng chứng sau khi sửa.</p>\n<ul>\n<li>Chuyển @Transactional lên mức lớp, để mọi hàm public đều đi qua proxy.</li>\n</ul>\n<p class=\"nhan\">Bằng chứng</p>\n<p>Quét lại SonarQube không còn issue nào của rule này.</p>"
      ],
      [
        58,
        "BUG-15 · Changing \"default loan days\" in Settings has no effect",
        "<p class=\"y-chinh\">🎯 BUG-15, form items 1–3: the name, the tool report, the tool and the level. Found by Member 5 (Notification + Settings).</p>\n<ul>\n<li><strong>Tool:</strong> Code review + JUnit 5 + Mockito. grep: the setting is read only to display it; LoanService uses fixed numbers.</li>\n<li><strong>Level:</strong> severity Major, priority Medium — The screen says 21 days, but the system uses 14 days → members pay fines they should not pay.</li>\n</ul>",
        "<p class=\"y-chinh\">🎯 BUG-15, mục 1–3 của form: tên defect, ảnh công cụ báo lỗi, công cụ và mức độ. Người tìm: Thành viên 5 (Notification + Settings).</p>\n<ul>\n<li><strong>Tên tiếng Việt:</strong> Đổi \"số ngày mượn mặc định\" trong Settings không có tác dụng.</li>\n<li><strong>Công cụ:</strong> Code review + JUnit 5 + Mockito.</li>\n<li><strong>Mức độ:</strong> severity Major, priority Medium — giao diện báo hạn 21 ngày nhưng hệ thống tính 14 ngày, thành viên bị phạt oan.</li>\n</ul>"
      ],
      [
        59,
        "BUG-15 · Defective code and steps to reproduce",
        "<p class=\"y-chinh\">🎯 BUG-15: the defective code (item 1 — the line numbers must be visible), then how to reproduce the failure.</p>\n<ul>\n<li><strong>Expected:</strong> Due date = today + 21 days.</li>\n<li><strong>Actual:</strong> Due date = today + 14 days.</li>\n</ul>",
        "<p class=\"y-chinh\">🎯 BUG-15: dòng code lỗi (mục 1 — phải thấy số dòng), rồi cách tái hiện lỗi.</p>\n<ul>\n<li><strong>Mong đợi:</strong> Hạn trả = hôm nay + 21 ngày.</li>\n<li><strong>Thực tế:</strong> Hạn trả = hôm nay + 14 ngày.</li>\n</ul>"
      ],
      [
        60,
        "BUG-15 · Fix and result after the fix",
        "<p class=\"y-chinh\">🎯 BUG-15, form item 4: the fix and the proof after the fix.</p>\n<ul>\n<li>LoanService reads the loan days and the renewal limit from LibrarySettingsService.</li>\n<li>The hard-coded 14 and 2 are removed.</li>\n</ul>\n<p class=\"nhan\">Proof</p>\n<p>The same test now passes — this is confirmation testing.</p>",
        "<p class=\"y-chinh\">🎯 BUG-15, mục 4 của form: cách sửa và bằng chứng sau khi sửa.</p>\n<ul>\n<li>LoanService đọc số ngày mượn và giới hạn gia hạn từ LibrarySettingsService.</li>\n<li>Bỏ hằng số cứng 14 và 2.</li>\n</ul>\n<p class=\"nhan\">Bằng chứng</p>\n<p>Chính test đó giờ đã xanh — đây là confirmation testing.</p>"
      ],
      [
        61,
        "IV. Regression testing after all fixes",
        "<p class=\"y-chinh\">🎯 IV. After all fixes: confirmation testing (each failed test run again → it passes) and regression testing (the whole suite run again: 125 tests, 0 failures, 3 skipped on purpose).</p>",
        "<p class=\"y-chinh\">🎯 IV. Sau khi sửa hết: confirmation testing (chạy lại từng test đã đỏ → xanh) và regression testing (chạy lại cả bộ test: 125 test, 0 lỗi, 3 test cố ý bỏ qua).</p>"
      ],
      [
        62,
        "Regression testing – SonarQube scan after the fixes",
        "<p class=\"y-chinh\">🎯 The fixed code scanned again with SonarQube and compared with the first scan.</p>",
        "<p class=\"y-chinh\">🎯 Code đã sửa được quét lại bằng SonarQube và so sánh với lần quét đầu.</p>"
      ],
      [
        63,
        "V. Conclusion",
        "<p class=\"y-chinh\">🎯 V. Conclusion: tools find patterns, people find problems against the requirements. SonarQube pointed to only 3 of the 15 defects.</p>",
        "<p class=\"y-chinh\">🎯 V. Kết luận: công cụ tìm theo mẫu, con người tìm theo yêu cầu. SonarQube chỉ chỉ ra được 3 trong 15 defect.</p>"
      ],
      [
        64,
        "V. Lessons learned",
        "<p class=\"y-chinh\">🎯 Six lessons learned — the part of the report that shows what the group understood, not only what it did.</p>",
        "<p class=\"y-chinh\">🎯 Sáu bài học rút ra — phần cho thấy nhóm hiểu được gì, không chỉ đã làm gì.</p>"
      ],
      [
        65,
        "VI. References",
        "<p class=\"y-chinh\">🎯 VI. References, plus the commands that re-run every piece of evidence in the report.</p>",
        "<p class=\"y-chinh\">🎯 VI. Tài liệu tham khảo, kèm các lệnh chạy lại mọi bằng chứng trong báo cáo.</p>"
      ],
      [
        66,
        "Appendix – Backup defects (1/2)",
        "<p class=\"y-chinh\">🎯 Appendix (1/2): backup defects B1–B6 — real defects that were found but not assigned, useful if the lecturer does not accept one of the fifteen.</p>",
        "<p class=\"y-chinh\">🎯 Phụ lục (1/2): defect dự phòng B1–B6 — defect thật tìm được nhưng chưa phân công, dùng khi giảng viên không chấp nhận một trong 15 defect.</p>"
      ],
      [
        67,
        "Appendix – Backup defects (2/2)",
        "<p class=\"y-chinh\">🎯 Appendix (2/2): B7–B11. B10 and B11 were found while fixing BUG-12 — the review feature does not work at all, even with a valid rating.</p>",
        "<p class=\"y-chinh\">🎯 Phụ lục (2/2): B7–B11. B10 và B11 được phát hiện trong lúc sửa BUG-12 — chức năng đánh giá sách hoàn toàn không dùng được, kể cả khi có số sao hợp lệ.</p>"
      ],
      [
        68,
        "Thank you",
        "<p class=\"y-chinh\">🎯 The closing slide.</p>",
        "<p class=\"y-chinh\">🎯 Slide kết thúc.</p>"
      ]
    ]),
  ].join('\n'),
};
