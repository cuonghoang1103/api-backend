/**
 * Đọc code cũ và refactor — Chương 9: Dự án cuối khoá — một sprint bảo trì ứng dụng web Java cũ (soạn 24/11/2026, agent rfc, máy nhà Linux).
 * 9.1 Đề bài: gói bàn giao (repo ch8, README, ADR, Q&A list, NANG-CAP.md), backlog 8 ticket viết theo lời khách (lỗi, tính năng nhỏ,
 *     nâng Java, refactor một module, vá bảo mật), ước lượng ba điểm + phân tích ảnh hưởng trước khi nhận, luật chơi, thang chấm 100,
 *     bản "thi thực hành 3 giờ" (PE) 3 ticket.
 * 9.2 Thực hiện sprint (làm THẬT trên bản của khoá, nhánh ch9 từ ch8): nhật ký 10 ngày; mỗi ticket đỏ trước → xanh sau (chạy gộp
 *     bằng worktree, giữ khoá nặng một lần), cherry-pick nhánh cũ 4 chương, phân tích ảnh hưởng bắt được API Node của TV-95,
 *     tiêm lỗi bằng trigger MySQL cho TV-113, golden master đổi CÓ CHỦ ĐÍCH ở TV-117 (và đổi NGOÀI DỰ KIẾN ở TV-95), JDK 17 bị enforcer chặn sau TV-121.
 * 9.3 Bàn giao: README viết lại, docs/ban-do.md (Mermaid), NANG-CAP.md mốc 4, RUI-RO.md (nợ kỹ thuật xếp ưu tiên), thử "người kế tiếp chạy
 *     được trong 30 phút" bằng một bản clone sạch.
 * 9.4 Câu hỏi phỏng vấn (song ngữ, trả lời bằng số đo của chính khoá).
 * 9.5 Kiểm tra tổng kết 20 câu trộn cả khoá + checklist "trước khi sửa code người khác".
 * Repo: legacy-thu-vien nhánh ch9 (+ tv-41, tv-110, tv-111, tv-113, tv-117, tv-95, tv-122, tv-121); legacy-express nhánh ch9 (+ tv-95).
 * Lời giải: lab/loi-giai/ch9/. KHÔNG dạy lại: ước lượng man-day (agile-teamwork 9.6), báo cáo ngày/hourensou (agile-teamwork 9.7),
 * kể dự án khi phỏng vấn (interview-prep 1.2, 8.2; thuc-tap-cung-claude 7.2), phỏng vấn testing (testing 10.4).
 */
import { java, xml, bash, js, out, tl, giai, ml, lk, bai, thuatNgu, Q, MOI_TRUONG_3, ZIP_LAB, ZIP_EXPRESS } from './_chung.mjs';

const moiTruong = (en) => `<p><em>${en ? 'Outputs run for real on:' : 'Output chạy thật trên:'} ${MOI_TRUONG_3} · Temurin JDK 17.0.19 và 21 (Maven 3.9 trong container) · Tomcat 10.1 (ảnh tomcat:10.1-jdk21-temurin) · MySQL 8.0.46 · Node 24 · Git 2.55.0.</em></p>`;

/* ═══════════════════ 9.1 — Đề bài ═══════════════════ */
const O91_GOI = out(`
Gói bàn giao — sprint 9 (2 tuần, 1 người, bắt đầu thứ Hai)
├── legacy-thu-vien/          nhánh ch8 = "main" của khách (50 test JDK 17, e2e 3/3, golden master 3 trang, Checkstyle dự án 0)
│   ├── README.md             VẪN là README gốc 6 dòng của 2016 (README bài 1.5 nằm ở nhánh của bạn — bài 9.3 viết lại)
│   ├── NANG-CAP.md           3 mốc nâng cấp của Chương 7
│   ├── docs/adr/0001, 0002   quyết định phí trễ hạn, hàng đợi TV-98 (bài 8.4)
│   └── .github/pull_request_template.md   mẫu PR 4 mục (bài 8.3)
├── legacy-express/           nhánh ch8 (API mobile, 24 test Node 24)
├── backlog-sprint9.csv       8 ticket (dưới đây)
├── QA-list.xlsx              câu hỏi đã hỏi khách #1–#16 (bài 8.4)
└── lien-he.txt               PO phía khách: chị Hà (thư viện); BA: anh Tùng; tester: Linh; vận hành: anh Phong
`);
const O91_BACKLOG = out(`
ID      Loại        Ưu tiên  Người báo        Nội dung (nguyên văn ticket)
TV-110  Bảo mật     Cao      Pentest (8.5)    "Cookie 'Ghi nhớ đăng nhập' giả được cho bất kỳ tài khoản nào, kể cả admin, nếu biết mã nguồn."
TV-111  Bảo mật     Cao      Công cụ quét     "Mở thẳng /thuvien/books.jsp, /report.jsp không cần đăng nhập; report.jsp trả 200."
TV-113  Lỗi         TB       Chị Hà           "Thỉnh thoảng phiếu đã trả mà số sách trong kho không tăng. Hay gặp hôm máy chủ CSDL khởi động lại."
TV-41   Lỗi         TB       Phòng CTSV       "Quy định SV mượn tối đa 3 cuốn nhưng hệ thống cho mượn cuốn thứ 4 (khách: 2 thay vì 1)."
TV-117  Lỗi         Thấp     Chị Hà           "Thanh menu trên cùng lỗi font từ hồi mới dùng (THÆ¯ VIá»N)."
TV-95   Tính năng   TB       Chị Hà           "Thêm loại độc giả Nghiên cứu sinh: 5 cuốn, 21 ngày, 1.500 đ/ngày trễ, không trần; quá hạn thì chặn như SV."
TV-122  Nợ kỹ thuật TB       Trưởng nhóm      "Tách SQL khỏi ReaderServlet (như BookServlet ở Ch5) trước khi làm TV-125 'xoá độc giả an toàn'."
TV-121  Nâng cấp    TB       Anh Phong        "Máy chủ mới chuẩn hoá JDK 21 LTS từ tháng 12. Ứng dụng phải dựng và chạy trên 21."
`);
const O91_UOC = out(`
Ước lượng ba điểm (giờ) — E = (lạc quan + 4 × khả dĩ + bi quan) / 6     [bài agile-teamwork 9.6]
ID      Lạc quan  Khả dĩ  Bi quan   E     Vì sao bi quan cao
TV-110     3        6       12     6,5   đổi cơ chế token ⇒ mọi cookie cũ mất hiệu lực; cần cấu hình khoá ở máy chủ (anh Phong)
TV-111     2        4       10     4,7   chạm lệnh forward của mọi servlet; bản đồ Ch2 có thể sót trang
TV-113     2        4        8     4,3   phải tái hiện lỗi "giữa hai câu UPDATE" — chưa biết cách
TV-41      0,5      1        3     1,3   đã có nhánh ch5-tv41 (4 chương trước) — có thể xung đột
TV-117     0,5      1        2     1,1   golden master sẽ đổi — phải duyệt lại
TV-95      2        4        8     4,3   luật nằm ở Java VÀ Node (bài 2.2) — dễ sót một bên
TV-122     3        6       12     6,5   ReaderServlet chưa có characterization test
TV-121     1        3        8     3,5   thư viện test cũ (Mockito 4.11) trên JDK mới
Cộng                                 32,2 giờ ≈ 4 ngày công thuần code; sprint 10 ngày còn họp, review, viết tài liệu bàn giao (bài 9.3), dự phòng
`);
const O91_ANHHUONG = out(`
Phân tích ảnh hưởng TRƯỚC khi nhận ticket (30 phút / ticket, chỉ đọc — Chương 2)
ID      Lệnh đã chạy                                          Thấy gì
TV-110  git grep -n makeToken                                 LoginServlet (tạo + kiểm), 2 test — không ai khác
TV-111  git grep -n '\\.jsp' -- src e2e tools                   5 forward trong 4 servlet, web.xml error-page, 3 include header.jsp, 1 test e2e
TV-113  git grep -n 'ghiTra\\|congLaiSach'                      MuonTraService.tra, 2 test mock — hai câu UPDATE, autocommit
TV-41   git log --oneline ch5-tv41 -1                         e83042f "fix(TV-41) …" — 2 tệp, 6 dòng
TV-117  git grep -c pageEncoding -- src/main/webapp            5/7 JSP có; thiếu header.jsp (include ở cả 3 trang) và index.jsp (chỉ redirect)
TV-95   git grep -ln KHACH -- src; grep -ln KHACH ../legacy-express/lib/*.js
                                                              LoaiDocGia.java, Reader.java, readers.jsp VÀ lib/luat.js (Node) ⇒ 2 repo
TV-122  git grep -ln ReaderServlet -- src/test                 chỉ TimKiemVaDocGiaTest (2 test lab 6.4: thêm/xoá); danh sách (doGet) CHƯA có test nào
TV-121  grep -n "17" pom.xml Dockerfile                        release 17, enforcer [17,), PMD targetJdk 17, 2 ảnh Docker
`);

const L91 = ml((en) => `
<span class="eyebrow">${en ? 'Chapter 9 · Capstone' : 'Chương 9 · Dự án cuối khoá'}</span>
<h2>${en ? '9.1 — The brief: handover pack, backlog of 8 tickets, rules' : '9.1 — Đề bài: gói bàn giao, backlog 8 ticket, luật chơi'}</h2>
<p class="lead">${en
  ? 'Monday, 9:00. The previous developer has moved to another project. You inherit the library app you have been learning on all course, a two-week sprint and eight tickets written the way customers write them: vague, mixed priorities, one of them hiding a second repository. This chapter is the final project: you do the sprint yourself (9.2), hand the project over (9.3), then rehearse the interview where you tell this story (9.4). Everything below was also done for real on the course’s copy, so you can compare your result with an actual one.'
  : 'Thứ Hai, 9:00. Người làm trước đã chuyển sang dự án khác. Bạn nhận lại chính ứng dụng thư viện đã học suốt khoá, một sprint hai tuần và tám ticket viết đúng kiểu khách hàng hay viết: mơ hồ, ưu tiên lẫn lộn, một ticket còn giấu cả một repo thứ hai. Chương này là dự án cuối khoá: bạn tự làm sprint (9.2), bàn giao dự án (9.3), rồi tập buổi phỏng vấn nơi bạn kể lại câu chuyện này (9.4). Mọi thứ dưới đây cũng đã được làm thật trên bản của khoá, để bạn so kết quả của mình với một kết quả có thật.'}</p>
${moiTruong(en)}

<h3>${en ? 'What a maintenance sprint is (and why it is the real exam)' : 'Sprint bảo trì là gì (và vì sao đó là bài thi thật)'}</h3>
<p>${en
  ? 'A <strong>sprint</strong> is a fixed time box (here two weeks) in which a team commits to a list of work items from the <strong>backlog</strong> — the ordered to-do list of the product. In a maintenance contract, typical for outsourcing companies, almost every item is a ticket on an existing system: bugs, small features, upgrades, security findings, and the occasional “please clean this up before we build on it”. Nobody grades how elegant your new code is. The customer judges three things: did the problems go away, did anything else break, and can the next person continue without you. Those three are what Chapters 1–8 trained, one by one; this chapter uses all of them at once.'
  : '<strong>Sprint</strong> là một khung thời gian cố định (ở đây hai tuần) trong đó đội cam kết làm một danh sách việc lấy từ <strong>backlog</strong> — danh sách việc cần làm đã xếp thứ tự của sản phẩm. Trong hợp đồng bảo trì, kiểu rất phổ biến ở công ty outsourcing, gần như mọi việc đều là ticket trên một hệ thống có sẵn: lỗi, tính năng nhỏ, nâng cấp, phát hiện bảo mật, và thỉnh thoảng "dọn chỗ này giúp trước khi xây tiếp". Không ai chấm code mới của bạn đẹp cỡ nào. Khách đánh giá ba điều: vấn đề có hết không, có gì khác vỡ không, và người sau có làm tiếp được khi không có bạn không. Chương 1–8 đã luyện từng điều một; chương này dùng tất cả cùng lúc.'}</p>
<p>${en
  ? 'Everyday analogy: a car service. You do not get a new car; you get the same car back with the faults fixed, a list of what was done, the parts that were replaced, and a note “rear tyres will need replacing within 5,000 km”. Lesson 9.3 is that note.'
  : 'Liên tưởng đời thường: mang xe đi bảo dưỡng. Bạn không nhận xe mới; bạn nhận lại đúng chiếc xe đã hết lỗi, kèm danh sách việc đã làm, phụ tùng đã thay, và một dòng ghi chú "lốp sau cần thay trong 5.000 km tới". Bài 9.3 chính là dòng ghi chú đó.'}</p>

<h3>${en ? 'The handover pack' : 'Gói bàn giao'}</h3>
${O91_GOI}
<p>${en
  ? 'Download the starting point: <a href="' + ZIP_LAB + '">legacy-thu-vien</a> and <a href="' + ZIP_EXPRESS + '">legacy-express</a>, then apply the Chapter 3–8 solution patches (<code>lab/loi-giai/ch3…ch8</code>, <code>git am</code>) — or continue from your own branch if you did every lab. Either way, the base must be green before you start: run the 50 Java tests, the e2e module and the golden master, and write the numbers in your day-1 log. A base you have not measured cannot prove that you did not break it.'
  : 'Tải điểm xuất phát: <a href="' + ZIP_LAB + '">legacy-thu-vien</a> và <a href="' + ZIP_EXPRESS + '">legacy-express</a>, rồi áp các patch lời giải Chương 3–8 (<code>lab/loi-giai/ch3…ch8</code>, bằng <code>git am</code>) — hoặc làm tiếp trên nhánh của chính bạn nếu đã làm hết các lab. Cách nào cũng vậy, nền phải xanh trước khi bắt đầu: chạy 50 test Java, module e2e và golden master, ghi số vào nhật ký ngày 1. Một cái nền chưa đo thì không chứng minh được là mình không làm vỡ nó.'}</p>

<h3>${en ? 'The backlog — eight tickets, in the customer’s words' : 'Backlog — tám ticket, đúng lời khách'}</h3>
${O91_BACKLOG}
<p>${en
  ? 'The mix is deliberate and typical: two security findings (one from the pentest of lesson 8.5, one from a scanner), two bugs that cost the library real books and real rules, one cosmetic bug that has annoyed users for ten years, one small feature, one refactoring requested by the lead, one runtime upgrade requested by operations. Notice what the tickets do <em>not</em> say: TV-113 does not say why, TV-95 does not mention the mobile API, TV-121 does not mention tests.'
  : 'Sự pha trộn này là cố ý và rất điển hình: hai phát hiện bảo mật (một từ đợt pentest ở bài 8.5, một từ công cụ quét), hai lỗi làm thư viện thiệt hại thật (mất sách, sai luật), một lỗi giao diện đã làm người dùng khó chịu mười năm, một tính năng nhỏ, một việc refactor do trưởng nhóm yêu cầu, một việc nâng phiên bản do vận hành yêu cầu. Để ý những gì ticket <em>không</em> nói: TV-113 không nói vì sao, TV-95 không nhắc tới API mobile, TV-121 không nhắc tới test.'}</p>

<h3>${en ? 'Before you accept: impact analysis and estimates' : 'Trước khi nhận việc: phân tích ảnh hưởng và ước lượng'}</h3>
<p>${en
  ? 'In outsourcing, the first deliverable of a sprint is not code; it is the <strong>estimate</strong> you give the lead on day 1, which becomes the customer’s plan. An estimate without reading the code is a guess. So spend 30 minutes per ticket, read-only, with the tools of Chapter 2 — <strong>impact analysis</strong> means listing everything a change could touch (code, data, other systems, people) before you make it:'
  : 'Ở công ty outsourcing, sản phẩm đầu tiên của sprint không phải code; đó là <strong>ước lượng</strong> bạn đưa trưởng nhóm ngày 1, thứ sẽ thành kế hoạch của khách. Ước lượng mà chưa đọc code là đoán mò. Vậy hãy dành 30 phút cho mỗi ticket, chỉ đọc, bằng công cụ của Chương 2 — <strong>phân tích ảnh hưởng</strong> (impact analysis) là liệt kê mọi thứ một thay đổi có thể chạm tới (code, dữ liệu, hệ thống khác, con người) trước khi thay đổi:'}</p>
${O91_ANHHUONG}
<p>${en
  ? 'Two of those lines change the estimate immediately: TV-95 touches two repositories (lesson 2.2 showed the rules live in Java <em>and</em> Node), and TV-122 has no test for the page it refactors — so Feathers’ rule from Chapter 3 applies: characterization tests first, and they go into the estimate. Then estimate with three points (optimistic, most likely, pessimistic) — the method is taught in agile-teamwork 9.6; here is the sheet for this sprint:'
  : 'Hai dòng trong đó đổi ngay ước lượng: TV-95 chạm hai repo (bài 2.2 cho thấy luật nằm ở cả Java <em>và</em> Node), và TV-122 không có test nào cho trang sắp refactor — vậy luật của Feathers ở Chương 3 áp dụng: viết characterization test trước, và nó phải có trong ước lượng. Sau đó ước lượng ba điểm (lạc quan, khả dĩ, bi quan) — phương pháp dạy ở agile-teamwork 9.6; đây là bảng của sprint này:'}</p>
${O91_UOC}
<div class="callout"><p>${en
  ? '<strong>The pessimistic column is the useful one.</strong> It is where you write the risk you have found (“every existing cookie will stop working”, “golden master will change”). Read aloud at planning, it turns into questions for the right person on day 1 instead of surprises on day 9. Note also that 32 hours of coding is less than half of a ten-day sprint: meetings, reviews, documentation and buffer are real work, and a junior who commits 80 hours of code in a 10-day sprint is about to miss the deadline.'
  : '<strong>Cột bi quan mới là cột có ích.</strong> Đó là chỗ bạn ghi rủi ro đã tìm thấy ("mọi cookie đang có sẽ mất hiệu lực", "golden master sẽ đổi"). Đọc to ở buổi planning, nó thành câu hỏi gửi đúng người ngay ngày 1 thay vì thành bất ngờ ở ngày 9. Để ý thêm: 32 giờ code chưa bằng một nửa sprint mười ngày — họp, review, viết tài liệu và dự phòng đều là việc thật, và một bạn junior cam kết 80 giờ code trong sprint 10 ngày là sắp trễ hạn.'}</p></div>

<h3>${en ? 'Rules of the sprint' : 'Luật chơi của sprint'}</h3>
<ol>
<li>${en ? '<strong>No rewrite.</strong> No new framework, no “let’s move it to Spring Boot”. The customer pays for these eight tickets on this codebase (Mục 0: why rewrites fail).' : '<strong>Không viết lại.</strong> Không framework mới, không "chuyển hết sang Spring Boot cho gọn". Khách trả tiền cho tám ticket này trên codebase này (Mục 0: vì sao viết lại hay thất bại).'}</li>
<li>${en ? '<strong>One ticket = one branch = one PR</strong>, branched from the current main (<code>ch9</code>), each &lt; 200 changed lines (moved files count as renames, not lines), four-section description (8.3), merged with <code>--no-ff</code>.' : '<strong>Một ticket = một nhánh = một PR</strong>, tách từ main hiện tại (<code>ch9</code>), mỗi PR &lt; 200 dòng thay đổi (tệp dời chỗ tính là đổi tên, không tính dòng), mô tả bốn mục (8.3), merge bằng <code>--no-ff</code>.'}</li>
<li>${en ? '<strong>Red before green.</strong> Every behaviour change has a test you have <em>seen</em> fail without the fix. Every refactoring starts with characterization tests that pass on the old code.' : '<strong>Đỏ trước, xanh sau.</strong> Thay đổi hành vi nào cũng có test bạn đã <em>thấy</em> đỏ khi chưa sửa. Refactor nào cũng bắt đầu bằng characterization test xanh trên code cũ.'}</li>
<li>${en ? '<strong>Prove no regression at the end:</strong> all unit tests, e2e, golden master (only the differences you approved), project Checkstyle 0.' : '<strong>Chứng minh không hồi quy ở cuối sprint:</strong> toàn bộ test đơn vị, e2e, golden master (chỉ còn khác biệt bạn đã duyệt), Checkstyle dự án bằng 0.'}</li>
<li>${en ? '<strong>Out of scope ⇒ new ticket</strong>, never a silent extra. Anything you find and do not fix goes into the risk register of 9.3.' : '<strong>Ngoài phạm vi ⇒ ticket mới</strong>, không bao giờ "tiện tay". Thứ gì phát hiện mà không sửa thì vào danh sách rủi ro ở bài 9.3.'}</li>
<li>${en ? '<strong>A daily log</strong> (three lines: done, next, blocked/risk) — the habit of agile-teamwork 9.7 (hourensou).' : '<strong>Nhật ký mỗi ngày</strong> (ba dòng: đã làm, sẽ làm, vướng/rủi ro) — thói quen ở agile-teamwork 9.7 (hourensou).'}</li>
<li>${en ? 'Use only the lab copy and the lab data. Do not publish customer code — here the “customer” is the course, so you <em>may</em> put your result on GitHub for your CV (agile-teamwork 10.1 explains why you could not with real customer code).' : 'Chỉ dùng bản lab và dữ liệu lab. Không công khai code của khách — ở đây "khách" là khoá học, nên bạn <em>được</em> đưa kết quả lên GitHub làm CV (agile-teamwork 10.1 giải thích vì sao với code khách thật thì không được).'}</li>
</ol>

<h3>${en ? 'Grading — 100 points' : 'Thang chấm — 100 điểm'}</h3>
<table>
<tr><th>${en ? 'Criterion' : 'Tiêu chí'}</th><th>${en ? 'Points' : 'Điểm'}</th><th>${en ? 'How it is checked' : 'Kiểm bằng gì'}</th></tr>
<tr><td>${en ? 'Eight tickets done as asked (5 each)' : 'Tám ticket làm đúng yêu cầu (5 điểm mỗi ticket)'}</td><td>40</td><td>${en ? 'The “done when” of each ticket in 9.2; red run shown before the fix' : '"Đạt khi" của từng ticket ở 9.2; có lượt đỏ trước khi sửa'}</td></tr>
<tr><td>${en ? 'No regression' : 'Không hồi quy'}</td><td>15</td><td>${en ? 'Final run: all tests, e2e, golden master with only approved differences, Checkstyle 0' : 'Lượt chạy cuối: toàn bộ test, e2e, golden master chỉ còn khác biệt đã duyệt, Checkstyle 0'}</td></tr>
<tr><td>${en ? 'PR quality' : 'Chất lượng PR'}</td><td>15</td><td>${en ? 'Size &lt; 200, one purpose, four sections with real numbers, conventions of 8.1' : 'Kích thước &lt; 200, một mục đích, bốn mục có số thật, đúng quy ước 8.1'}</td></tr>
<tr><td>${en ? 'Scope discipline' : 'Kỷ luật phạm vi'}</td><td>10</td><td>${en ? 'Findings recorded as tickets, none fixed silently' : 'Phát hiện được ghi thành ticket, không cái nào "tiện tay sửa"'}</td></tr>
<tr><td>${en ? 'Handover (9.3)' : 'Bàn giao (9.3)'}</td><td>15</td><td>${en ? 'A fresh clone runs in 30 minutes from your README; map and risk register updated' : 'Một bản clone sạch chạy được trong 30 phút theo README của bạn; bản đồ và danh sách rủi ro được cập nhật'}</td></tr>
<tr><td>${en ? 'Estimates and daily log' : 'Ước lượng và nhật ký'}</td><td>5</td><td>${en ? 'Three-point sheet on day 1, estimate vs actual on day 10, ten daily entries' : 'Bảng ba điểm ngày 1, so ước lượng với thực tế ngày 10, mười dòng nhật ký'}</td></tr>
</table>
<p>${en ? '85+ : ready for a maintenance team. 70–84 : solid, one habit to fix. Under 70 : redo the chapter whose criterion lost the most points.' : '85+ : sẵn sàng vào đội bảo trì. 70–84 : vững, còn một thói quen cần sửa. Dưới 70 : làm lại chương ứng với tiêu chí mất nhiều điểm nhất.'}</p>

<h3>${en ? 'Timed version (like a PE exam): 3 hours, 3 tickets' : 'Bản thi có giờ (kiểu PE): 3 giờ, 3 ticket'}</h3>
<p>${en
  ? 'If you want a practical exam instead of a sprint: start from a clean <code>ch8</code>, set a timer for 3 hours, do TV-41, TV-117 and TV-113 (one-line bug, cosmetic bug with an approved golden master, data-integrity bug that needs a fault you inject yourself). Pass mark: three PRs, each with a red run, all tests green at the end, golden master difference limited to the menu. Then grade yourself with the solution in 9.2.'
  : 'Nếu muốn một bài thi thực hành thay cho cả sprint: bắt đầu từ <code>ch8</code> sạch, bấm giờ 3 tiếng, làm TV-41, TV-117 và TV-113 (lỗi một dòng, lỗi giao diện cần duyệt lại golden master, lỗi toàn vẹn dữ liệu cần tự tiêm lỗi để tái hiện). Đạt khi: ba PR, mỗi PR có lượt đỏ, cuối giờ toàn bộ test xanh, golden master chỉ khác ở thanh menu. Sau đó tự chấm bằng lời giải ở bài 9.2.'}</p>

<h3>💼 ${en ? 'OJT situation: “can you start with the security ones?”' : 'Tình huống OJT: "em làm mấy cái bảo mật trước được không?"'}</h3>
<p>${en
  ? 'At planning the customer’s PO asks you to do TV-110 and TV-111 first, but also wants TV-95 demoed on Friday of week 1 because the new academic year starts. You have estimated 6.5 + 4.7 + 4.3 hours — it fits. Say so, and say the condition: TV-110 needs operations to put a secret key on the server before release (pessimistic column), so ask anh Phong today. That one sentence at planning is worth more than a perfect PR on day 9 that cannot be deployed.'
  : 'Ở buổi planning, PO phía khách nhờ làm TV-110 và TV-111 trước, nhưng cũng muốn demo TV-95 vào thứ Sáu tuần 1 vì năm học mới bắt đầu. Bạn đã ước lượng 6,5 + 4,7 + 4,3 giờ — vừa. Hãy nói vậy, kèm điều kiện: TV-110 cần vận hành đặt một khoá bí mật trên máy chủ trước khi phát hành (cột bi quan), nên hỏi anh Phong ngay hôm nay. Một câu đó ở buổi planning đáng giá hơn một PR hoàn hảo ở ngày 9 mà không triển khai được.'}</p>

<h3>🎤 ${en ? 'What interviewers ask about this' : 'Phỏng vấn viên sẽ hỏi'}</h3>
<ul>
<li>${en ? '“How do you estimate a ticket in a codebase you don’t know?” — read-only impact analysis first (grep, call hierarchy, git log), then three-point estimate; the pessimistic number carries the risks.' : '"Em ước lượng ticket thế nào khi chưa biết codebase?" — phân tích ảnh hưởng chỉ đọc trước (grep, call hierarchy, git log), rồi ước lượng ba điểm; con số bi quan mang theo rủi ro.'}</li>
<li>${en ? '“What is impact analysis?” — listing what a change can affect: callers, data already stored, other systems (here the Node API), people who must act (operations).' : '"Impact analysis là gì?" — liệt kê những gì một thay đổi có thể ảnh hưởng: nơi gọi, dữ liệu đã lưu, hệ thống khác (ở đây là API Node), người phải hành động (vận hành).'}</li>
<li>${en ? '“The customer wants everything first. What do you do?” — order by harm, show the estimate, state the conditions, let the PO choose; write the decision down.' : '"Khách muốn mọi thứ đều làm trước. Em làm gì?" — xếp theo mức hại, đưa ước lượng, nói rõ điều kiện, để PO chọn; ghi quyết định lại.'}</li>
</ul>

<h3>🗂 ${en ? 'Key terms' : 'Thuật ngữ trong bài'}</h3>
${thuatNgu(en, [
  ['Sprint', 'chặng làm việc', 'Khung thời gian cố định (thường 1–4 tuần) để làm một danh sách việc đã cam kết.', 'A fixed time box (usually 1–4 weeks) to deliver an agreed list of work.'],
  ['Backlog', 'danh sách việc', 'Danh sách việc đã xếp thứ tự của sản phẩm; mỗi dòng thường là một ticket.', 'The ordered list of work for a product; each item is usually a ticket.'],
  ['Impact analysis', 'phân tích ảnh hưởng', 'Liệt kê mọi thứ một thay đổi có thể chạm tới trước khi làm: code, dữ liệu, hệ thống khác, con người.', 'Listing everything a change could touch before making it: code, data, other systems, people.'],
  ['Three-point estimate', 'ước lượng ba điểm', 'Lạc quan, khả dĩ, bi quan; E = (a + 4m + b) / 6. Cột bi quan ghi rủi ro.', 'Optimistic, most likely, pessimistic; E = (a + 4m + b) / 6. The pessimistic column records risks.'],
  ['Rubric', 'thang chấm', 'Bảng tiêu chí và điểm, công bố trước khi làm.', 'A table of criteria and points, published before the work starts.'],
])}

<h3>📌 ${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'The capstone is a real-shaped maintenance sprint: 8 tickets, 2 repos, 2 weeks, judged on “fixed, nothing else broke, next person can continue”.' : 'Dự án cuối khoá là một sprint bảo trì đúng hình dạng thật: 8 ticket, 2 repo, 2 tuần, chấm theo "đã hết lỗi, không gì khác vỡ, người sau làm tiếp được".'}</li>
<li>${en ? 'Measure the base, read before estimating, estimate with three points, say the risks at planning.' : 'Đo cái nền, đọc trước khi ước lượng, ước lượng ba điểm, nói rủi ro ngay ở buổi planning.'}</li>
<li>${en ? 'Rules: no rewrite, one ticket one PR, red before green, out of scope becomes a ticket.' : 'Luật: không viết lại, một ticket một PR, đỏ trước xanh sau, ngoài phạm vi thành ticket.'}</li>
</ul>
${lk(bai('agile-teamwork', 'agl-9-6-uoc-luong-man-day'), '📐', en ? 'Agile & teamwork 9.6 — Estimating in man-days: WBS, buffer, three-point estimates' : 'Agile & làm việc nhóm 9.6 — Ước lượng bằng man-day: WBS, dự phòng, ước lượng ba điểm', en ? 'The estimation method used here' : 'Phương pháp ước lượng dùng ở đây')}
${lk(bai('thuc-tap-cung-claude', 'thuc-tap-cung-claude-6-1-planning'), '🧑‍💻', en ? 'Internship with Claude 6.1 — Sprint planning and estimates' : 'Thực tập cùng Claude 6.1 — Lập kế hoạch sprint và ước lượng', en ? 'Another sprint, on a newer codebase' : 'Một sprint khác, trên codebase mới hơn')}
`);

/* ═══════════════════ 9.4 — Phỏng vấn ═══════════════════ */
// [câu hỏi EN, câu hỏi VI, ý chính EN, ý chính VI, bằng chứng trong khoá]
const PV = [
  ['How do you approach an unfamiliar codebase?', 'Em tiếp cận một codebase lạ thế nào?',
    'Run it first (Chapter 1), then find entry points (web.xml, @Controller, Express routes), trace one real request end to end, read the schema and the git history for the “why”, and draw a one-page map. I do not read every file; I read with a question.',
    'Chạy được nó trước (Chương 1), rồi tìm điểm vào (web.xml, @Controller, route Express), lần một request thật từ đầu tới cuối, đọc schema và lịch sử git để hiểu "vì sao", rồi vẽ bản đồ một trang. Em không đọc từng tệp; em đọc với một câu hỏi.',
    'Bài 2.1–2.6; bản đồ một trang ở lab 2.6 và docs/ban-do.md (9.3).'],
  ['What is legacy code?', 'Legacy code là gì?',
    'Michael Feathers’ working definition: code without tests. Age is not the point; the point is that you cannot change it and know whether you broke something.',
    'Định nghĩa làm việc của Michael Feathers: code không có test. Tuổi không phải vấn đề; vấn đề là sửa nó mà không biết mình có làm vỡ gì không.',
    'Mục 0; Feathers 2004.'],
  ['How do you change code that has no tests?', 'Sửa code không có test thế nào?',
    'Pin current behaviour first with characterization tests — including bugs, named _BUG with a ticket — then change. If nothing can be isolated, test through HTTP with a real database (Testcontainers), or golden-master the output. Break dependencies with seams only as much as needed.',
    'Khoá hành vi hiện tại trước bằng characterization test — kể cả bug, đặt tên _BUG kèm mã ticket — rồi mới sửa. Không tách được gì thì test qua HTTP với CSDL thật (Testcontainers), hoặc golden master cho output. Cắt phụ thuộc bằng seam vừa đủ dùng.',
    'Ch3: 8 → 21 test; TV-122 ở 9.2 viết 4 test đặc tả xanh trên code cũ trước khi tách DAO.'],
  ['Refactoring vs rewriting — where is the line?', 'Refactor khác viết lại ở đâu?',
    'Refactoring changes structure in small steps that keep behaviour, tests green after each step; it can stop any day and still ship. A rewrite replaces behaviour wholesale and only pays off at the end — and the old system’s undocumented rules (like the flat 2,000 VND fee in the stored procedure) get lost.',
    'Refactor đổi cấu trúc bằng bước nhỏ giữ nguyên hành vi, test xanh sau mỗi bước; dừng ngày nào cũng giao được. Viết lại thay toàn bộ hành vi và chỉ có lợi ở cuối — và các luật không ai ghi của hệ cũ (như phí đồng giá 2.000 đ trong stored procedure) bị mất.',
    'Ch5: 18 commit, commit nào cũng xanh; ADR 0001 (8.4).'],
  ['Name a code smell and how you fixed it.', 'Kể một code smell và cách em sửa.',
    'A God Servlet: BookServlet did SQL, HTML and business rules, doPost cyclomatic 20 / cognitive 36 (PMD). Extract Class into a service and a DAO, guard clauses, enum with polymorphism for reader types: 7/7 after, every commit green.',
    'God Servlet: BookServlet làm cả SQL, HTML lẫn nghiệp vụ, doPost cyclomatic 20 / cognitive 36 (PMD). Extract Class thành service và DAO, guard clause, enum đa hình cho loại độc giả: còn 7/7, commit nào cũng xanh.',
    'Bài 4.2, 5.2, 5.3.'],
  ['How do you keep a refactoring safe?', 'Làm sao refactor an toàn?',
    'Tests first; automated IDE refactorings where possible; one kind of change per commit; never mix refactoring with behaviour change; run tests after every step (or TCR). If a step goes red, revert instead of debugging.',
    'Test trước; dùng refactor tự động của IDE khi có thể; mỗi commit một loại thay đổi; không trộn refactor với đổi hành vi; chạy test sau mỗi bước (hoặc TCR). Bước nào đỏ thì quay lại thay vì ngồi gỡ.',
    'Bài 5.5; vòng kiểm từng commit ở 5.6.'],
  ['How do you upgrade Java or Spring Boot on an old project?', 'Nâng Java hay Spring Boot cho dự án cũ thế nào?',
    'One LTS step at a time with green tests at each step; build plugins first; jdeps for removed APIs; Boot 2.7 before 3; javax → jakarta with OpenRewrite but read the diff — in the lab the recipe left the servlet API in compile scope and missed JSTL, which only the golden master caught.',
    'Mỗi lần một mốc LTS, test xanh ở mỗi mốc; plugin build trước; jdeps tìm API bị gỡ; Boot 2.7 trước rồi mới 3; javax → jakarta bằng OpenRewrite nhưng phải đọc diff — ở lab recipe để servlet API scope compile và bỏ sót JSTL, chỉ golden master bắt được.',
    'Ch7; TV-121 (17 → 21) ở 9.2.'],
  ['You find a serious security problem outside your ticket. What do you do?', 'Em thấy một lỗ hổng nghiêm trọng ngoài phạm vi ticket. Em làm gì?',
    'Prove it on the lab or staging copy, write a separate ticket with severity and the evidence, tell the lead the same day. I do not quietly fix it inside an unrelated PR — it needs its own review, its own deployment notes (TV-110 needed a key on the server and logged everyone out).',
    'Chứng minh trên bản lab hoặc staging, viết ticket riêng có mức độ và bằng chứng, báo trưởng nhóm ngay trong ngày. Em không lặng lẽ sửa nó trong một PR không liên quan — nó cần review riêng, ghi chú triển khai riêng (TV-110 cần khoá trên máy chủ và làm mọi người phải đăng nhập lại).',
    'Bài 8.5 (giả cookie admin) → TV-110 ở 9.2.'],
  ['What goes into a good maintenance PR description?', 'Mô tả PR bảo trì tốt gồm gì?',
    'Root cause (a line and a condition), impact (code, data already stored, other systems, users), how it was tested (red before, green after, numbers), risks and the way back. Out-of-scope findings listed with new ticket IDs.',
    'Nguyên nhân gốc (một dòng và một điều kiện), phạm vi ảnh hưởng (code, dữ liệu đã lưu, hệ thống khác, người dùng), cách kiểm (đỏ trước, xanh sau, có số), rủi ro và đường lùi. Phát hiện ngoài phạm vi liệt kê kèm mã ticket mới.',
    'Bài 8.3; mẫu .github/pull_request_template.md.'],
  ['The original author has left. How do you find out why the code does X?', 'Người viết đã nghỉ. Làm sao biết vì sao code làm X?',
    'git log -S / blame for when and with which ticket; the ticket and PR if they exist; then ask the people who know what it should do — BA/PO, tester, users, operations — with a concrete question and a proposed default; write the answer down (Q&A list, comment, ADR).',
    'git log -S / blame để biết lúc nào và ticket nào; đọc ticket và PR nếu còn; rồi hỏi người biết nó phải làm gì — BA/PO, tester, người dùng, vận hành — bằng câu hỏi cụ thể kèm phương án mặc định; ghi câu trả lời lại (Q&A list, comment, ADR).',
    'Bài 8.4: 14/16 tệp hệ số xe buýt 1.'],
  ['How do you estimate a maintenance ticket?', 'Em ước lượng ticket bảo trì thế nào?',
    'Thirty minutes of read-only impact analysis, then three points. The pessimistic number carries the risks I found — two repositories, missing tests, a deployment step for operations — and I say them at planning.',
    'Ba mươi phút phân tích ảnh hưởng chỉ đọc, rồi ước lượng ba điểm. Con số bi quan mang theo rủi ro em tìm thấy — hai repo, thiếu test, một bước triển khai cho vận hành — và em nói chúng ở buổi planning.',
    'Bài 9.1.'],
  ['A test you wrote fails before your fix. Is that enough?', 'Test em viết đỏ trước khi sửa. Vậy đủ chưa?',
    'Only if it fails for the right reason. In my sprint the transaction test first failed with a NullPointerException from the test harness — before and after the fix. Read the failure message; a red that does not show the bug proves nothing.',
    'Chỉ đủ nếu nó đỏ đúng lý do. Trong sprint của em, test giao dịch lúc đầu đỏ vì NullPointerException của chính bộ khung test — cả trước lẫn sau khi sửa. Phải đọc câu báo lỗi; một lượt đỏ không cho thấy bug thì không chứng minh gì.',
    'TV-113 ở 9.2.'],
  ['How would you remove dead code safely?', 'Xoá code chết an toàn thế nào?',
    'Evidence from several sources — static (unused declarations, grep including JSP and config), runtime (access logs, coverage agent on a running server, a counter for a while), history — then delete in a small PR that can be reverted. Knight Capital (2012) shows why old code paths and flags must not linger.',
    'Bằng chứng từ nhiều nguồn — tĩnh (khai báo không dùng, grep cả JSP và cấu hình), lúc chạy (access log, agent đo độ phủ trên máy chủ đang chạy, đếm lượt gọi một thời gian), lịch sử — rồi xoá trong một PR nhỏ revert được. Knight Capital (2012) cho thấy vì sao nhánh code cũ và cờ không được nằm lại.',
    'Bài 6.1.'],
  ['What would you do in your first week on a legacy project?', 'Tuần đầu ở một dự án cũ em sẽ làm gì?',
    'Get it running and fix the README as I go (my first PR), map it, measure the test baseline, ask for the ticket history, take one small bug end to end. I would not propose a rewrite or a big refactoring before I understand it.',
    'Chạy được nó và sửa README trong lúc làm (PR đầu tiên của em), vẽ bản đồ, đo mốc test, xin lịch sử ticket, làm trọn một lỗi nhỏ từ đầu tới cuối. Em sẽ không đề xuất viết lại hay refactor lớn trước khi hiểu nó.',
    'Bài 1.5, 2.6, 8.2.'],
];
const L94 = ml((en) => `
<span class="eyebrow">${en ? 'Chapter 9 · Interview' : 'Chương 9 · Phỏng vấn'}</span>
<h2>${en ? '9.4 — Interview questions on legacy code and refactoring' : '9.4 — Câu hỏi phỏng vấn về code cũ và refactor'}</h2>
<p class="lead">${en
  ? 'Interviews for maintenance-heavy roles — and most intern and fresher roles at outsourcing companies are — rarely ask you to define refactoring. They ask what you <em>did</em>, and they push on details until they find out whether you did it. This lesson gives fourteen common questions with the key points of a good answer, and for each one the place in this course where you produced the evidence. Answer with your numbers, not with textbook sentences.'
  : 'Phỏng vấn cho vị trí làm nhiều bảo trì — mà phần lớn vị trí intern và fresher ở công ty outsourcing là vậy — hiếm khi hỏi định nghĩa refactor. Người ta hỏi bạn đã <em>làm</em> gì, rồi hỏi dồn vào chi tiết tới khi biết bạn làm thật hay không. Bài này cho mười bốn câu hay gặp kèm các ý chính của một câu trả lời tốt, và với mỗi câu là chỗ trong khoá học nơi bạn đã tạo ra bằng chứng. Trả lời bằng số của bạn, không bằng câu trong sách.'}</p>

<h3>${en ? 'How to use this lesson' : 'Cách dùng bài này'}</h3>
<ol>
<li>${en ? 'Read a question, close the page, answer aloud in under 90 seconds — in Vietnamese first, then in English (FPT Software’s panel interview usually includes English, see interview-prep 8.2).' : 'Đọc một câu, che trang, trả lời thành tiếng dưới 90 giây — tiếng Việt trước, rồi tiếng Anh (phỏng vấn hội đồng ở FPT Software thường có phần tiếng Anh, xem interview-prep 8.2).'}</li>
<li>${en ? 'Open the key points and check: did you say a <em>number</em> or a <em>name</em> from your own work?' : 'Mở ý chính và tự soát: bạn có nói được một <em>con số</em> hay một <em>cái tên</em> từ chính việc của mình không?'}</li>
<li>${en ? 'Expect the follow-up “why?” twice. The evidence column tells you what to reopen.' : 'Chờ sẵn câu hỏi dồn "vì sao?" hai lần. Cột bằng chứng cho biết cần mở lại bài nào.'}</li>
</ol>

${PV.map(([qe, qv, ae, av, bc], i) => `<h3>${i + 1}. ${en ? qe : qv}</h3>
${giai(en ? 'Key points' : 'Ý chính', `<p>${en ? ae : av}</p><p><em>${en ? 'Evidence in this course: ' : 'Bằng chứng trong khoá: '}${bc}</em></p>`)}`).join('\n')}

<h3>${en ? 'The capstone as a STAR story (two minutes)' : 'Dự án cuối khoá thành câu chuyện STAR (hai phút)'}</h3>
<p>${en
  ? '<strong>STAR</strong> = Situation, Task, Action, Result — the shape interviewers expect for “tell me about a project”. Fill it with your sprint, not with the course’s:'
  : '<strong>STAR</strong> = Situation (bối cảnh), Task (nhiệm vụ), Action (hành động), Result (kết quả) — hình dạng phỏng vấn viên chờ đợi khi hỏi "kể về một dự án". Điền bằng sprint của bạn, không phải của khoá:'}</p>
${out(`
S  Ứng dụng quản lý thư viện Servlet/JSP từ 2016, không tài liệu, người viết đã nghỉ; một API Node đi kèm cho app mobile.
T  Một sprint hai tuần: 8 ticket — 2 bảo mật, 3 lỗi, 1 tính năng, 1 refactor, nâng Java 17 → 21.
A  Phân tích ảnh hưởng và ước lượng ba điểm trước khi nhận; characterization test trước mỗi thay đổi; mỗi ticket một PR nhỏ
   có test đỏ trước; bắt được TV-95 phải sửa cả API Node; tiêm lỗi bằng trigger MySQL để chứng minh lỗi giao dịch TV-113.
R  <điền số thật của bạn: số test trước → sau, kích thước PR, e2e, golden master, thời gian người mới dựng được dự án>
   + bài học: một lượt đỏ phải đỏ ĐÚNG lý do.
`)}
<p>${en
  ? 'In English, the same story opens with one sentence of context and ends with one lesson: “I took over a 2016 Java web app with no documentation and ran a two-week maintenance sprint of eight tickets… The lesson I took away is that a failing test only counts if it fails for the right reason.” Interview-prep 1.2 shows how to put it in a CV line.'
  : 'Bằng tiếng Anh, cùng câu chuyện mở bằng một câu bối cảnh và kết bằng một bài học: “I took over a 2016 Java web app with no documentation and ran a two-week maintenance sprint of eight tickets… The lesson I took away is that a failing test only counts if it fails for the right reason.” Interview-prep 1.2 chỉ cách viết nó thành một dòng trong CV.'}</p>

<h3>${en ? 'Traps interviewers set' : 'Những cái bẫy phỏng vấn viên hay đặt'}</h3>
<ul>
<li>${en ? '“Wouldn’t it be faster to rewrite it in Spring Boot?” — the trap is saying yes. Say what you would lose (undocumented rules, running data, the customer’s budget) and what you would do instead (strangler fig, see software-architecture 10.4).' : '"Viết lại bằng Spring Boot chẳng nhanh hơn sao?" — bẫy là trả lời "có". Hãy nói mình sẽ mất gì (luật không ai ghi, dữ liệu đang chạy, ngân sách của khách) và mình sẽ làm gì thay thế (strangler fig, xem software-architecture 10.4).'}</li>
<li>${en ? '“Did you fix all the SonarLint warnings?” — no, and that is the right answer: you fixed hotspots (churn × complexity) and set a gate for new code.' : '"Em có sửa hết cảnh báo SonarLint không?" — không, và đó là câu trả lời đúng: bạn sửa chỗ nóng (số lần sửa × độ phức tạp) và đặt cổng chặn cho code mới.'}</li>
<li>${en ? '“So the tests passed and you shipped?” — passing unit tests did not catch the missing JSTL in Chapter 7 or the readers page change in this sprint; name the other nets (e2e, golden master, a manual check on the running app).' : '"Vậy test xanh là em giao?" — test đơn vị xanh đã không bắt được JSTL bị thiếu ở Chương 7 hay thay đổi ở trang độc giả trong sprint này; hãy kể các tấm lưới khác (e2e, golden master, kiểm tay trên ứng dụng đang chạy).'}</li>
</ul>

<h3>📌 ${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'Answer with numbers and names from your own work; every answer above points to where you produced them.' : 'Trả lời bằng số và tên từ chính việc của bạn; câu nào ở trên cũng chỉ ra chỗ bạn đã tạo ra chúng.'}</li>
<li>${en ? 'Practise aloud, in Vietnamese then English, under 90 seconds per answer.' : 'Tập nói thành tiếng, tiếng Việt rồi tiếng Anh, dưới 90 giây mỗi câu.'}</li>
<li>${en ? 'The capstone becomes your STAR story and one CV line.' : 'Dự án cuối khoá thành câu chuyện STAR và một dòng CV của bạn.'}</li>
</ul>
${lk(bai('interview-prep', 'pv-1-2-du-an-cv'), '📄', en ? 'Interview prep 1.2 — Writing a project in your CV' : 'Chuẩn bị phỏng vấn 1.2 — Viết dự án trong CV: vai trò, quyết định, sự cố, kết quả', en ? 'Turn the sprint into a CV line' : 'Biến sprint thành một dòng CV')}
${lk(bai('interview-prep', 'pv-8-2-du-an'), '🗣️', en ? 'Interview prep 8.2 — Explaining a project in English' : 'Chuẩn bị phỏng vấn 8.2 — Giải thích dự án bằng tiếng Anh', en ? 'The English half of the panel interview' : 'Nửa tiếng Anh của buổi phỏng vấn hội đồng')}
${lk(bai('testing', 'tst-10-4-phong-van'), '🧪', en ? 'Testing 10.4 — Interview questions on testing' : 'Testing 10.4 — Câu hỏi phỏng vấn về testing', en ? 'Questions on tests themselves' : 'Câu hỏi về chính việc test')}
${lk(bai('thuc-tap-cung-claude', 'thuc-tap-cung-claude-7-2-phong-van'), '🧑‍💻', en ? 'Internship with Claude 7.2 — Telling the story in an interview' : 'Thực tập cùng Claude 7.2 — Kể câu chuyện khi phỏng vấn', en ? 'Another example of the same skill' : 'Thêm một ví dụ cho cùng kỹ năng')}
`);

/* ═══════════════════ 9.5 — Kiểm tra tổng kết + checklist ═══════════════════ */
const dat = (q, viTri) => { const o = [...q.options]; const [d] = o.splice(q.correctIndex, 1); o.splice(viTri, 0, d); return { ...q, options: o, correctIndex: viTri }; };

const QUIZ9_GOC = [
  Q('A WAR built for Tomcat 9 is dropped into Tomcat 10.1. The log says “Deployment … finished”. What happens on the first request?|||WAR dựng cho Tomcat 9 được thả vào Tomcat 10.1. Log báo "Deployment … finished". Request đầu tiên sẽ ra sao?', [
    '500: the servlets extend javax.servlet.http.HttpServlet, which Tomcat 10 (jakarta) does not have|||500: servlet kế thừa javax.servlet.http.HttpServlet, thứ Tomcat 10 (jakarta) không có',
    'It works: Tomcat 10 is backward compatible|||Chạy bình thường: Tomcat 10 tương thích ngược',
    'Tomcat refuses to deploy it|||Tomcat từ chối deploy',
    'Only JSPs fail|||Chỉ JSP lỗi',
  ], 0, 'EN: Chapter 1/7: the namespace changed; webapps-javaee can convert it.|||VI: Chương 1/7: namespace đã đổi; thư mục webapps-javaee có thể tự chuyển.'),
  Q('“Unsupported class file major version 61” means…|||"Unsupported class file major version 61" nghĩa là…', [
    'The JAR is corrupted|||Tệp JAR bị hỏng',
    'Code compiled for Java 17 is being read by an older JDK or tool|||Code biên dịch cho Java 17 đang được một JDK hay công cụ cũ hơn đọc',
    'Maven is too new|||Maven quá mới',
    'The database driver is wrong|||Driver CSDL sai',
  ], 1, 'EN: 52 = Java 8, 55 = 11, 61 = 17, 65 = 21.|||VI: 52 = Java 8, 55 = 11, 61 = 17, 65 = 21.'),
  Q('Two libraries need different versions of the same dependency. Which one does Maven pick by default?|||Hai thư viện cần hai phiên bản khác nhau của cùng một phụ thuộc. Mặc định Maven chọn bản nào?', [
    'The newest|||Bản mới nhất',
    'The oldest|||Bản cũ nhất',
    'The one nearest to your project in the dependency tree (nearest wins)|||Bản gần dự án nhất trong cây phụ thuộc (gần nhất thắng)',
    'It fails the build|||Báo lỗi build',
  ], 2, 'EN: mvn dependency:tree -Dverbose shows the losers.|||VI: mvn dependency:tree -Dverbose cho thấy bản bị loại.'),
  Q('You need to know why the late fee is a flat 2,000 VND in the report. Fastest first step?|||Cần biết vì sao phí trễ hạn trong báo cáo là đồng giá 2.000 đ. Bước đầu nhanh nhất?', [
    'Ask in the team chat who wrote it|||Hỏi trong nhóm chat ai viết',
    'Rewrite the stored procedure|||Viết lại stored procedure',
    'Read every Java class|||Đọc mọi lớp Java',
    'git log -S finds the commit (and ticket) that introduced the string|||git log -S tìm commit (và ticket) đã đưa chuỗi đó vào',
  ], 3, 'EN: Pickaxe — lesson 2.4 and 8.4 (TV-77).|||VI: Pickaxe — bài 2.4 và 8.4 (TV-77).'),
  Q('A characterization test finds the system lets a student borrow a 4th book (rule says 3). In the test you…|||Characterization test thấy hệ thống cho SV mượn cuốn thứ 4 (luật là 3). Trong test bạn…', [
    'assert today’s behaviour and name it _BUG_TV41; fixing is a separate ticket|||khẳng định hành vi hiện tại và đặt tên _BUG_TV41; sửa là ticket riêng',
    'assert the correct rule so the test is red|||khẳng định luật đúng để test đỏ',
    'skip the case|||bỏ qua trường hợp này',
    'fix the code in the same commit|||sửa code trong cùng commit',
  ], 0, 'EN: Pin first, change later — the fix in 9.2 flips exactly these two tests.|||VI: Khoá trước, đổi sau — bản sửa ở 9.2 đảo đúng hai test này.'),
  Q('Golden-master output contains today’s date. What do you do?|||Output golden master chứa ngày hôm nay. Bạn làm gì?', [
    'Re-approve it every day|||Duyệt lại mỗi ngày',
    'Replace the volatile parts (dates, ids) with placeholders before comparing|||Thay phần hay đổi (ngày, id) bằng chỗ giữ trước khi so',
    'Stop using golden master|||Bỏ golden master',
    'Freeze the server clock|||Đóng băng đồng hồ máy chủ',
  ], 1, 'EN: tools/golden.sh replaces dd/MM/yyyy with <NGAY>.|||VI: tools/golden.sh thay dd/MM/yyyy bằng <NGAY>.'),
  Q('Code calls new Date() deep inside a servlet, so tests depend on the day they run. Smallest seam?|||Code gọi new Date() sâu trong servlet nên test phụ thuộc ngày chạy. Seam nhỏ nhất?', [
    'Mock the JVM clock with a Java agent|||Giả đồng hồ JVM bằng Java agent',
    'Run tests only on Mondays|||Chỉ chạy test vào thứ Hai',
    'A protected bayGio() method the test subclass overrides|||Một hàm protected bayGio() mà lớp con trong test ghi đè',
    'Rewrite the servlet in Spring|||Viết lại servlet bằng Spring',
  ], 2, 'EN: Subclass and override method — Feathers, lesson 3.3.|||VI: Subclass and override method — Feathers, bài 3.3.'),
  Q('Which pair is a hotspot worth refactoring first?|||Cặp nào là chỗ nóng đáng refactor trước?', [
    'A complex file nobody has changed since 2017|||Một tệp phức tạp không ai sửa từ 2017',
    'A simple file changed every week|||Một tệp đơn giản tuần nào cũng sửa',
    'The file with most PMD warnings|||Tệp có nhiều cảnh báo PMD nhất',
    'A complex file that is also changed often|||Một tệp phức tạp mà cũng hay bị sửa',
  ], 3, 'EN: Churn × complexity — BookServlet scored 150 in lesson 4.4.|||VI: Số lần sửa × độ phức tạp — BookServlet được 150 điểm ở bài 4.4.'),
  Q('Adding the reader type NCS required editing 9 places in 6 files. Which smell?|||Thêm loại độc giả NCS phải sửa 9 chỗ trong 6 tệp. Smell nào?', [
    'Shotgun Surgery|||Shotgun Surgery',
    'Long Method|||Long Method',
    'Feature Envy|||Feature Envy',
    'Speculative Generality|||Speculative Generality',
  ], 0, 'EN: After the enum refactoring (5.2) the same feature took one constant (TV-95 in 9.2).|||VI: Sau khi refactor sang enum (5.2), cùng tính năng chỉ còn một hằng (TV-95 ở 9.2).'),
  Q('Why prefer the IDE’s Rename over search-and-replace?|||Vì sao nên dùng Rename của IDE thay vì tìm-và-thay?', [
    'It is faster to type|||Gõ nhanh hơn',
    'It resolves symbols, so it renames this method and not a same-named one elsewhere — and refuses when it cannot be sure|||Nó hiểu ký hiệu, nên đổi đúng hàm này chứ không phải hàm trùng tên ở chỗ khác — và từ chối khi không chắc',
    'It also formats the file|||Nó còn format tệp',
    'It commits automatically|||Nó tự commit',
  ], 1, 'EN: Lesson 5.1 ran the TypeScript Language Service headless to show the refusal.|||VI: Bài 5.1 chạy TypeScript Language Service không giao diện để xem nó từ chối.'),
  Q('“Make the change easy, then make the easy change.” In commits, that means…|||"Làm cho thay đổi trở nên dễ, rồi làm thay đổi dễ." Trong commit, điều đó nghĩa là…', [
    'one big commit with both|||một commit lớn gồm cả hai',
    'change behaviour first, tidy later|||đổi hành vi trước, dọn sau',
    'preparatory refactoring commits (tests unchanged and green), then a separate behaviour commit|||các commit refactor dọn đường (test không đổi và xanh), rồi một commit đổi hành vi riêng',
    'no tests until the end|||không test tới cuối',
  ], 2, 'EN: Kent Beck, 2012 — lesson 5.5.|||VI: Kent Beck, 2012 — bài 5.5.'),
  Q('npm audit reports a critical CVE in a dev-only package. Most correct reading?|||npm audit báo một CVE nghiêm trọng trong gói chỉ dùng khi dev. Cách đọc đúng nhất?', [
    'Production is compromised|||Production đã bị chiếm',
    'Ignore all dev CVEs forever|||Bỏ qua mọi CVE dev mãi mãi',
    'Delete package-lock.json|||Xoá package-lock.json',
    'Check reachability: is it shipped and can attacker input reach it? Prioritise production paths, still plan the dev upgrade|||Kiểm khả năng chạm tới: có được đóng gói và đầu vào kẻ tấn công có chạm tới không? Ưu tiên đường production, vẫn lên kế hoạch nâng gói dev',
  ], 3, 'EN: Lesson 6.2: --production 24 → 0; dev remained for Chapter 7.|||VI: Bài 6.2: --production 24 → 0; phần dev để Chương 7.'),
  Q('The fix for SQL built by string concatenation is…|||Cách sửa SQL ghép chuỗi là…', [
    'PreparedStatement with parameters — input stays data, never SQL|||PreparedStatement có tham số — đầu vào luôn là dữ liệu, không bao giờ thành SQL',
    'escaping single quotes|||thoát dấu nháy đơn',
    'a WAF in front of Tomcat|||đặt WAF trước Tomcat',
    'hiding error messages|||giấu câu báo lỗi',
  ], 0, 'EN: Lesson 6.3 (TV-102); hiding errors (CWE-209) is a separate, additional fix.|||VI: Bài 6.3 (TV-102); giấu lỗi (CWE-209) là bản sửa riêng, bổ sung.'),
  Q('Upgrading Spring Boot 2.5 to 3.x. Recommended path?|||Nâng Spring Boot 2.5 lên 3.x. Lộ trình khuyến nghị?', [
    'Directly to the latest 3.x|||Thẳng lên 3.x mới nhất',
    '2.7 first (fix deprecations, Security 5.8), Java 17, then 3.0, then later 3.x — green at each step|||2.7 trước (xử lý deprecated, Security 5.8), Java 17, rồi 3.0, rồi 3.x sau — xanh ở mỗi bước',
    'Rewrite on 3.x|||Viết lại trên 3.x',
    'Only change the parent version|||Chỉ đổi phiên bản parent',
  ], 1, 'EN: Lesson 7.2; the OpenRewrite recipe lost in-memory users (8/8 tests red) — read the diff.|||VI: Bài 7.2; recipe OpenRewrite làm mất người dùng in-memory (8/8 test đỏ) — phải đọc diff.'),
  Q('You open a file to fix one line and your formatter rewrites 200 lines. Best move?|||Bạn mở tệp để sửa một dòng và formatter viết lại 200 dòng. Làm gì là tốt nhất?', [
    'Commit it — it is cleaner|||Commit luôn — gọn hơn',
    'Ask the reviewer to ignore whitespace|||Nhờ người review bỏ qua khoảng trắng',
    'Undo the formatting; follow the project’s conventions; propose formatting as its own PR with .git-blame-ignore-revs|||Bỏ phần format; theo quy ước dự án; đề xuất format thành PR riêng kèm .git-blame-ignore-revs',
    'Disable Checkstyle|||Tắt Checkstyle',
  ], 2, 'EN: Lesson 8.1.|||VI: Bài 8.1.'),
  Q('A PR description’s “impact” section should cover…|||Mục "phạm vi ảnh hưởng" của mô tả PR nên gồm…', [
    'the developer’s name|||tên người làm',
    'how long it took|||mất bao lâu',
    'the list of files only|||chỉ danh sách tệp',
    'callers in code, data already stored, other systems, and users|||nơi gọi trong code, dữ liệu đã lưu, hệ thống khác, và người dùng',
  ], 3, 'EN: Lesson 8.3; in 9.2 “other systems” was the Node API (TV-95).|||VI: Bài 8.3; ở 9.2 "hệ thống khác" chính là API Node (TV-95).'),
  Q('Your new test for TV-113 is red before the fix — with a NullPointerException in the test helper. What does that prove?|||Test mới cho TV-113 đỏ trước khi sửa — với NullPointerException trong hàm phụ của test. Điều đó chứng minh gì?', [
    'Nothing yet: it must fail for the reason of the bug (return recorded, book not back)|||Chưa chứng minh gì: nó phải đỏ vì đúng lý do của bug (phiếu đã ghi trả, sách chưa về)',
    'The bug exists|||Bug có thật',
    'The fix works|||Bản sửa đúng',
    'The database is down|||CSDL đang sập',
  ], 0, 'EN: It happened in this sprint (9.2) — the same NPE appeared after the fix too.|||VI: Chuyện đã xảy ra trong sprint này (9.2) — cùng NPE đó xuất hiện cả sau khi sửa.'),
  Q('Why is the TV-113 fault injected with a MySQL trigger instead of a Mockito mock?|||Vì sao lỗi TV-113 được tiêm bằng trigger MySQL thay vì mock Mockito?', [
    'Mockito cannot throw exceptions|||Mockito không ném được exception',
    'The bug is about what the real database keeps after a failure (autocommit, rollback); only a real database shows it|||Bug nằm ở chỗ CSDL thật giữ lại gì sau lỗi (autocommit, rollback); chỉ CSDL thật mới cho thấy',
    'Triggers are faster|||Trigger nhanh hơn',
    'It is the project convention|||Đó là quy ước dự án',
  ], 1, 'EN: A mock DAO would have “passed” with or without the transaction.|||VI: Một DAO giả sẽ "xanh" dù có hay không có giao dịch.'),
  Q('After moving JSPs under WEB-INF/, what can a browser no longer do?|||Sau khi dời JSP vào WEB-INF/, trình duyệt không còn làm được gì?', [
    'Load CSS|||Tải CSS',
    'Submit forms to servlets|||Gửi form tới servlet',
    'Request a JSP directly; only a servlet forward (after its login check) can render it|||Gọi thẳng một JSP; chỉ lệnh forward của servlet (sau khi kiểm đăng nhập) mới hiện được nó',
    'Use sessions|||Dùng session',
  ], 2, 'EN: The container never serves WEB-INF/ to clients — TV-111, e2e expects 404.|||VI: Container không bao giờ phục vụ WEB-INF/ cho máy khách — TV-111, e2e chờ 404.'),
  Q('Which is the best handover artefact for “the next person runs it in 30 minutes”?|||Thứ bàn giao tốt nhất cho mục tiêu "người sau chạy được trong 30 phút"?', [
    'A long wiki page about the architecture|||Một trang wiki dài về kiến trúc',
    'A video call with the next developer|||Một cuộc gọi video với người sau',
    'The source code is the documentation|||Code chính là tài liệu',
    'A README tested by doing a fresh clone and following it literally, with the time measured|||Một README đã được thử bằng cách clone sạch và làm đúng từng chữ, có đo thời gian',
  ], 3, 'EN: Lesson 9.3 measured it on a clean clone.|||VI: Bài 9.3 đã đo trên một bản clone sạch.'),
];
const VI_TRI9 = [2, 0, 1, 3, 1, 0, 3, 2, 0, 3, 1, 2, 3, 0, 2, 1, 3, 0, 1, 2];
const QUIZ9 = QUIZ9_GOC.map((q, i) => dat(q, VI_TRI9[i]));

const CHECKLIST = [
  ['Chạy được bản gốc chưa sửa gì? Ghi lại lệnh, phiên bản JDK/Node, cổng, tài khoản thử.', 'Can you run the untouched original? Write down commands, JDK/Node versions, ports, test accounts.', '1.1–1.5'],
  ['Đo mốc: bao nhiêu test, xanh/đỏ, e2e, golden master — trước khi gõ dòng đầu tiên.', 'Measure the baseline: number of tests, red/green, e2e, golden master — before the first keystroke.', '3.x, 9.1'],
  ['Tìm điểm vào và lần một request đi qua chỗ mình sắp sửa.', 'Find the entry point and trace one request through the place you will change.', '2.1–2.2'],
  ['Logic có nằm ở chỗ khác không: stored procedure, trigger, repo thứ hai, JSP?', 'Does the logic live elsewhere too: stored procedure, trigger, a second repository, JSP?', '2.3, 9.2 (TV-95)'],
  ['Đọc lịch sử: git log -S / blame, ticket cũ — vì sao code như vậy.', 'Read the history: git log -S / blame, old tickets — why the code is like this.', '2.4, 8.4'],
  ['Phân tích ảnh hưởng: nơi gọi, dữ liệu đã lưu, hệ thống khác, người phải hành động.', 'Impact analysis: callers, stored data, other systems, people who must act.', '8.3, 9.1'],
  ['Có characterization test cho hành vi sắp chạm chưa? Không có ⇒ viết trước, xanh trên code cũ.', 'Are there characterization tests for the behaviour you will touch? If not, write them first, green on the old code.', '3.1–3.4'],
  ['Test cho bản sửa đã đỏ ĐÚNG lý do chưa (đọc câu báo lỗi)?', 'Has the test for the fix failed for the RIGHT reason (read the message)?', '9.2 (TV-113)'],
  ['Refactor và đổi hành vi nằm ở các commit khác nhau.', 'Refactoring and behaviour change are in separate commits.', '5.5'],
  ['Theo quy ước dự án; không format lại cả tệp.', 'Follow the project’s conventions; do not reformat whole files.', '8.1'],
  ['PR nhỏ (&lt; 200 dòng), một mục đích, bốn mục mô tả có số thật.', 'Small PR (&lt; 200 lines), one purpose, four-section description with real numbers.', '8.2–8.3'],
  ['Phát hiện ngoài phạm vi ⇒ ticket mới, báo trưởng nhóm; bảo mật thì báo trong ngày.', 'Out-of-scope findings ⇒ new ticket, tell the lead; security findings the same day.', '8.5, 9.2'],
  ['Thay đổi cần người khác làm gì khi triển khai (khoá, cấu hình, JDK)? Ghi vào PR và NANG-CAP.md.', 'Does the change require someone to act at deployment (keys, config, JDK)? Write it in the PR and NANG-CAP.md.', '7.5, 9.2 (TV-110, TV-121)'],
  ['Kiểm trên ứng dụng đang chạy, không chỉ test đơn vị (curl trước/sau, golden master).', 'Check on the running app, not only unit tests (curl before/after, golden master).', '8.5, 9.2'],
  ['Cập nhật tài liệu bàn giao: README, bản đồ, rủi ro còn lại.', 'Update the handover docs: README, map, remaining risks.', '9.3'],
];
const QUIZ_CONTENT = ml((en) => `
<span class="eyebrow">${en ? 'Chapter 9 · Final quiz' : 'Chương 9 · Kiểm tra tổng kết'}</span>
<h2>${en ? '9.5 — Final quiz and maintenance checklist' : '9.5 — Kiểm tra tổng kết và checklist bảo trì'}</h2>
<p>${en
  ? 'Twenty questions mixing the whole course — running old projects, mapping, safety nets, smells, refactoring, dead code and security, upgrades, fixing other people’s code and the capstone sprint. 30 minutes. Every question comes from something that actually happened in this course’s labs. Below the quiz: the checklist to keep next to you before you change anyone else’s code.'
  : 'Hai mươi câu trộn cả khoá — dựng chạy dự án cũ, vẽ bản đồ, lưới an toàn, smell, refactor, code chết và bảo mật, nâng cấp, sửa code người khác và sprint cuối khoá. 30 phút. Câu nào cũng lấy từ một chuyện đã thật sự xảy ra trong các lab của khoá. Dưới bài kiểm tra: checklist để cạnh bàn mỗi lần sắp sửa code của người khác.'}</p>
<h3>✅ ${en ? 'Checklist — before you change someone else’s code' : 'Checklist — trước khi sửa code của người khác'}</h3>
<table>
<tr><th>#</th><th>${en ? 'Check' : 'Mục kiểm'}</th><th>${en ? 'Lesson' : 'Bài'}</th></tr>
${CHECKLIST.map(([vi, eng, b], i) => `<tr><td>${i + 1}</td><td>${en ? eng : vi}</td><td>${b}</td></tr>`).join('\n')}
</table>
<p>${en
  ? 'Print it, or copy it into your team’s PR template. Fifteen lines, and each one is a mistake this course made you see happen.'
  : 'In ra, hoặc chép vào mẫu PR của đội. Mười lăm dòng, và dòng nào cũng là một lỗi khoá học đã cho bạn tận mắt thấy xảy ra.'}</p>
<h3>🎓 ${en ? 'After this course' : 'Học xong khoá này'}</h3>
<p>${en
  ? 'You can take over an old Java web or Node project, get it running, map it, pin its behaviour, clean it in small safe steps, upgrade its runtime, fix bugs in reviewable PRs and hand it over. Next steps that build on it: Testing (deeper test design), Software architecture 10–11 (strangler fig and migrations at system scale), Spring Boot (the modern target of these upgrades), and Interview prep (turning the capstone into your CV and your story).'
  : 'Bạn nhận được một dự án Java web hay Node cũ, dựng chạy, vẽ bản đồ, khoá hành vi, dọn dần bằng bước nhỏ an toàn, nâng runtime, sửa lỗi bằng PR dễ review và bàn giao lại. Học tiếp trên nền này: Testing (thiết kế test sâu hơn), Kiến trúc phần mềm chương 10–11 (strangler fig và di trú ở tầm hệ thống), Spring Boot (đích hiện đại của các đợt nâng cấp), và Chuẩn bị phỏng vấn (biến dự án cuối khoá thành CV và câu chuyện của bạn).'}</p>
`);

/* ═══════════════════ 9.3 — Bàn giao ═══════════════════ */
const O93_README_CU = out(`
$ git show ch8:README.md
# Thu vien

Phan mem quan ly thu vien.

Chay bang Tomcat. DB: xem file sql trong thu muc db.

Lien he: Tuan
`);
const O93_CLONE = out(`
$ git clone -q -b ch9 legacy-thu-vien clone-sach && cd clone-sach
$ cp .env.example .env
$ sed -i "s/^THUVIEN_REMEMBER_KEY=.*/THUVIEN_REMEMBER_KEY=$(openssl rand -hex 32)/" .env
$ docker compose up -d --build
[exit 0] 29 s
$ docker compose ps --format '{{.Service}} {{.Status}}'
db Up 26 seconds (healthy)
web Up Less than a second
$ curl -s -o /dev/null -w '%{http_code} %{redirect_url}' -c cj -d 'username=thuthu&password=123456&remember=on' http://localhost:18080/thuvien/login
302 http://127.0.0.1:18080/thuvien/books
$ grep -i set-cookie <header của lượt đăng nhập>
Set-Cookie: JSESSIONID=…; Path=/thuvien; HttpOnly
Set-Cookie: remember=thuthu:…; Max-Age=2592000; Expires=Thu, 24 Dec 2026 02:23:11 GMT; HttpOnly
$ curl -s -b cj http://localhost:18080/thuvien/books | grep -o 'THƯ VIỆN\\|Sách - Thư viện' | sort | uniq -c
      1 Sách - Thư viện
      1 THƯ VIỆN
$ curl -s -o /dev/null -w '%{http_code}' http://localhost:18080/thuvien/books.jsp
404
$ curl -s http://localhost:18080/thuvien/khong-co | grep -o 'Apache Tomcat/[0-9.]*'
Apache Tomcat/10.1.62
Tổng từ clone tới trang sách: 31 s
(thêm duy nhất một tệp ghi đè cổng về 127.0.0.1:18080/18306 — máy soạn dùng chung mạng; README không đổi)
`);
const O93_RUIRO = out(`
RUI-RO.md — xếp theo mức hại × khả năng xảy ra (trích; bản đủ 14 dòng trong lab/loi-giai/ch9/)
Ưu tiên  Ticket  Rủi ro                                                         Bằng chứng
P1       TV-124  Không phân quyền: role lưu vào session nhưng không nơi nào kiểm   git grep -n role -- src/main ⇒ 1 dòng (chỗ ghi)
P1       TV-125  Xoá độc giả xoá luôn phiếu đang mượn (FK ON DELETE CASCADE)       test xoaDocGiaDangMuon_…_BUG_TV125
P1       TV-123  Cookie Ghi nhớ không hạn, không thu hồi theo người               TokenUtil chỉ ký tên người dùng
P2       TV-114  Phiếu ở hai nơi: bảng loans và data/phieu.json                   ADR 0002
P2       TV-116  Node làm tròn ngày trễ LÊN, Java CẮT xuống (20.000 ≠ 18.000 đ)    test bài 3.1
P2       TV-106  Dò tên đăng nhập qua thời gian (0,7 s ≠ 3 ms)                    đo bài 6.3
P2       TV-115/97 Báo cáo đồng giá như phí thật; thông báo in "18000.0"           ADR 0001
P3       —       Lỗi bị nuốt ở ReaderServlet/ReportServlet; DBUtil không pool; commons-lang 2.6 chỉ còn 1 chỗ;
                 Express 4; JDK 25 mốc kế; cột fine DOUBLE;
                 trang 404 của Tomcat in phiên bản 10.1.62 (thấy khi thử clone sạch)
+ "Đã đóng trong sprint 9" (8 ticket) + "Việc của vận hành khi triển khai" (JDK 21, THUVIEN_REMEMBER_KEY)
`);
const C93_MERMAID = out(`
\`\`\`mermaid
flowchart LR
  TT([Thủ thư — trình duyệt]) -->|HTTP, phiên JSESSIONID| WEB[thuvien.war<br/>Tomcat 10.1 · Java 21]
  SV([Độc giả — app mobile]) -->|HTTP JSON| API[legacy-express<br/>Node 24 · Express 4]
  WEB -->|JDBC| DB[(MySQL 8.0<br/>schema thuvien)]
  API -->|đọc/ghi tệp| JSON[(data/phieu.json)]
  KT([Kế toán]) -.->|xuất CSV — ĐÃ GỠ ở 6.1| WEB
\`\`\`
`);

const L93 = ml((en) => `
<span class="eyebrow">${en ? 'Chapter 9 · Capstone' : 'Chương 9 · Dự án cuối khoá'}</span>
<h2>${en ? '9.3 — Handover: updated README, map, upgrade notes, known risks' : '9.3 — Bàn giao: README mới, bản đồ, ghi chú nâng cấp, rủi ro còn lại'}</h2>
<p class="lead">${en
  ? 'You inherited this project with a six-line README and a name to call. The last deliverable of your sprint is to make sure the next person does not. A handover is not a meeting; it is a set of files in the repository that let a stranger run, understand and safely change the system without you — and a test that proves they do.'
  : 'Bạn nhận dự án này với một README sáu dòng và một cái tên để gọi. Sản phẩm cuối của sprint là bảo đảm người sau không phải nhận như vậy. Bàn giao không phải một buổi họp; đó là một bộ tệp trong repo giúp một người lạ chạy, hiểu và sửa an toàn hệ thống khi không có bạn — kèm một phép thử chứng minh điều đó.'}</p>
${moiTruong(en)}

<h3>${en ? 'What you received' : 'Thứ bạn đã nhận'}</h3>
${O93_README_CU}
<p>${en
  ? '“Run with Tomcat” — which Tomcat? “See the sql file” — and then? “Contact: Tuan” — Tuan left in 2018 (lesson 8.4). Every line is true and none is usable. That is normal for legacy projects, and it is why lesson 1.5 called the README the most valuable first PR of an intern. Now you write the full one, plus three more documents, in one PR at the end of the sprint.'
  : '"Chạy bằng Tomcat" — Tomcat nào? "Xem file sql" — rồi sao nữa? "Liên hệ: Tuấn" — anh Tuấn nghỉ từ 2018 (bài 8.4). Dòng nào cũng đúng và không dòng nào dùng được. Với dự án cũ đó là chuyện thường, và là lý do bài 1.5 gọi README là PR đầu tiên có giá trị nhất của một intern. Giờ bạn viết bản đầy đủ, cộng thêm ba tài liệu nữa, trong một PR ở cuối sprint.'}</p>

<h3>${en ? 'The four handover documents' : 'Bốn tài liệu bàn giao'}</h3>
<table>
<tr><th>${en ? 'File' : 'Tệp'}</th><th>${en ? 'Question it answers' : 'Trả lời câu hỏi'}</th><th>${en ? 'Who reads it' : 'Ai đọc'}</th></tr>
<tr><td><code>README.md</code></td><td>${en ? 'How do I run it, test it, configure it; what usually goes wrong?' : 'Chạy, test, cấu hình thế nào; hay hỏng ở đâu?'}</td><td>${en ? 'The next developer, day 1' : 'Lập trình viên kế tiếp, ngày 1'}</td></tr>
<tr><td><code>docs/ban-do.md</code></td><td>${en ? 'What is where; which flows matter; where are the traps?' : 'Cái gì nằm đâu; luồng nào quan trọng; bẫy ở đâu?'}</td><td>${en ? 'The next developer, week 1; the reviewer' : 'Lập trình viên kế tiếp, tuần 1; người review'}</td></tr>
<tr><td><code>NANG-CAP.md</code></td><td>${en ? 'Which versions, what changed, what operations must do' : 'Phiên bản nào, đã đổi gì, vận hành phải làm gì'}</td><td>${en ? 'Operations, the lead' : 'Vận hành, trưởng nhóm'}</td></tr>
<tr><td><code>RUI-RO.md</code></td><td>${en ? 'What is still wrong, how bad, what to do next' : 'Còn gì sai, nặng cỡ nào, nên làm gì tiếp'}</td><td>${en ? 'The PO and the lead, at the next planning' : 'PO và trưởng nhóm, ở buổi planning kế tiếp'}</td></tr>
</table>
<p>${en
  ? 'Rules that make them useful: (1) every command is copy-pasteable and was run; (2) every claim of danger points to evidence — a test name, a command, a lesson — so the reader can check instead of trust; (3) no history novel: what is, not how it came to be (that is what git log and the ADRs are for); (4) Vietnamese with diacritics, as the ADRs of Chapter 8 already are.'
  : 'Luật để chúng có ích: (1) lệnh nào cũng chép-dán chạy được và đã được chạy; (2) cảnh báo nào cũng trỏ tới bằng chứng — tên test, một lệnh, một bài — để người đọc tự kiểm thay vì phải tin; (3) không kể tiểu thuyết lịch sử: viết hiện trạng, không viết vì sao ra nông nỗi (việc đó của git log và ADR); (4) tiếng Việt có dấu, như các ADR của Chương 8 đã viết.'}</p>

<h3>1. README</h3>
<p>${en
  ? 'Sections, in the order a newcomer needs them: what it is (one table: language, server, database, build), run with Docker, run the tests (unit, e2e, golden master — with the baseline numbers), configuration (every environment variable, including the new key of TV-110), common errors (a table: symptom, cause, fix — every row is something that actually happened in this course), where the other documents are, how to contribute (branch, PR template, Checkstyle gate, commit style). The full file is in <code>lab/loi-giai/ch9/</code>; its “common errors” table alone saves the next person a day.'
  : 'Các mục, đúng thứ tự người mới cần: là gì (một bảng: ngôn ngữ, máy chủ, CSDL, build), chạy bằng Docker, chạy test (đơn vị, e2e, golden master — kèm số mốc), cấu hình (mọi biến môi trường, kể cả khoá mới của TV-110), lỗi hay gặp (một bảng: triệu chứng, nguyên nhân, cách xử lý — dòng nào cũng là chuyện đã thật sự xảy ra trong khoá), các tài liệu khác ở đâu, cách đóng góp (nhánh, mẫu PR, cổng Checkstyle, kiểu commit). Bản đầy đủ ở <code>lab/loi-giai/ch9/</code>; riêng bảng "lỗi hay gặp" đã tiết kiệm cho người sau một ngày.'}</p>

<h3>${en ? '2. The map, updated' : '2. Bản đồ, cập nhật'}</h3>
<p>${en
  ? 'Start from your one-page map of lab 2.6 and update what the sprint changed: JSPs now under <code>WEB-INF/jsp</code>, <code>DocGiaDAO</code>, the transaction in <code>traPhieu</code>, the second place the rules live. Write it in Mermaid so it lives next to the code and is reviewed in PRs like code (lesson 2.5). The container view:'
  : 'Bắt đầu từ bản đồ một trang ở lab 2.6 và cập nhật những gì sprint đã đổi: JSP giờ ở <code>WEB-INF/jsp</code>, <code>DocGiaDAO</code>, giao dịch trong <code>traPhieu</code>, nơi thứ hai chứa luật. Viết bằng Mermaid để nó sống cạnh code và được review trong PR như code (bài 2.5). Góc nhìn container:'}</p>
${C93_MERMAID}
<p>${en
  ? 'The most valuable part of the map is the last section, “danger zones”: five sentences, each pointing to a ticket. A newcomer who reads only that section will not delete a reader with open loans.'
  : 'Phần đáng giá nhất của bản đồ là mục cuối, "chỗ nguy hiểm": năm câu, câu nào cũng trỏ tới một ticket. Người mới chỉ đọc mục đó thôi cũng sẽ không xoá một độc giả đang còn phiếu mượn.'}</p>

<h3>${en ? '3. Upgrade notes' : '3. Ghi chú nâng cấp'}</h3>
<p>${en
  ? '<code>NANG-CAP.md</code> from lesson 7.5 gets milestone 4 (TV-121, Java 21): what changed in the build, what the server needs, what a developer’s machine needs, and what is next (JDK 25 LTS, with the Locale data change to re-test). Operations reads this file, not your PRs — so “set <code>THUVIEN_REMEMBER_KEY</code> or remember-me is off, and everyone is logged out once” belongs here too.'
  : '<code>NANG-CAP.md</code> của bài 7.5 thêm mốc 4 (TV-121, Java 21): build đổi gì, máy chủ cần gì, máy lập trình viên cần gì, và mốc kế (JDK 25 LTS, cần thử lại phần dữ liệu Locale). Vận hành đọc tệp này, không đọc PR của bạn — nên "đặt <code>THUVIEN_REMEMBER_KEY</code>, không thì Ghi nhớ tắt, và mọi người bị đăng xuất một lần" cũng phải nằm ở đây.'}</p>

<h3>${en ? '4. The risk register: technical debt, ranked' : '4. Danh sách rủi ro: nợ kỹ thuật, xếp ưu tiên'}</h3>
<p>${en
  ? '<strong>Technical debt</strong> is the extra cost every future change pays because of a shortcut taken earlier — like interest on a loan. A list of it is useless unless it is <em>ranked</em> and <em>evidenced</em>. Rank by harm × likelihood, not by how easy it is; every row says how to see the problem for yourself. Everything you found during the sprint and did not fix goes here — this is where your scope discipline pays off:'
  : '<strong>Nợ kỹ thuật</strong> (technical debt) là chi phí thêm mà mọi thay đổi sau này phải trả vì một lối tắt đã đi trước đó — như tiền lãi của một khoản vay. Danh sách nợ vô dụng nếu không được <em>xếp hạng</em> và không có <em>bằng chứng</em>. Xếp theo mức hại × khả năng xảy ra, không theo độ dễ; dòng nào cũng nói cách tự nhìn thấy vấn đề. Mọi thứ bạn phát hiện trong sprint mà không sửa đều vào đây — đây là chỗ kỷ luật phạm vi được đền đáp:'}</p>
${O93_RUIRO}
<div class="callout"><p>${en
  ? '<strong>Two of these were found by reading, not by testing.</strong> TV-124: <code>git grep role</code> returns one line — the place that <em>stores</em> the role. Nothing checks it, so any librarian account can do what admin does, and the remember-me login does not even set it. TV-125 was pinned by the characterization test written before refactoring <code>ReaderServlet</code>: deleting a reader silently deletes their open loans. Neither was in the backlog. Both are now P1 for the next sprint — that is a handover doing its job.'
  : '<strong>Hai dòng trong đó được phát hiện nhờ đọc, không nhờ test.</strong> TV-124: <code>git grep role</code> chỉ ra đúng một dòng — chỗ <em>lưu</em> vai trò. Không nơi nào kiểm, nên tài khoản thủ thư nào cũng làm được việc của admin, và đăng nhập bằng cookie còn không đặt vai trò. TV-125 được khoá bởi characterization test viết trước khi refactor <code>ReaderServlet</code>: xoá một độc giả là lặng lẽ xoá luôn các phiếu đang mượn. Cả hai đều không có trong backlog. Giờ cả hai là P1 cho sprint kế — đó là bàn giao làm đúng việc của nó.'}</p></div>

<h3>${en ? 'The test: a stranger, a clean clone, 30 minutes' : 'Phép thử: một người lạ, một bản clone sạch, 30 phút'}</h3>
<p>${en
  ? 'A README is code that nobody runs — until you run it. Clone into an empty folder (no build cache, no <code>.env</code>, nothing from your working copy) and follow the README <em>literally</em>, with a stopwatch. Better: ask a classmate who has never seen the project. Done on this course’s copy:'
  : 'README là thứ code không ai chạy — cho tới khi bạn chạy nó. Clone vào một thư mục rỗng (không bộ nhớ đệm build, không <code>.env</code>, không gì từ bản làm việc của bạn) và làm <em>đúng từng chữ</em> README, bấm giờ. Tốt hơn nữa: nhờ một bạn cùng lớp chưa từng thấy dự án. Làm trên bản của khoá:'}</p>
${O93_CLONE}
<p>${en ? 'Thirty-one seconds from clone to the books page, the menu in proper Vietnamese, the remember-me cookie <code>HttpOnly</code> and signed with the new key, <code>books.jsp</code> 404. Be honest about the number: this machine already had the base images and the Maven layer in Docker’s cache. On a machine that has never built the project, the first <code>up --build</code> downloads the images and every library — minutes, depending on the network — which is exactly why the README now says so instead of promising “5 minutes”. And the test found one new thing: the default Tomcat error page prints <code>Apache Tomcat/10.1.62</code>, a free hint for an attacker looking up CVEs. Nobody had looked at a 404 page before. It went into the risk register as P3, not into a last-minute PR.' : 'Ba mươi mốt giây từ clone tới trang sách, menu tiếng Việt đúng, cookie Ghi nhớ <code>HttpOnly</code> và ký bằng khoá mới, <code>books.jsp</code> trả 404. Thành thật về con số: máy này đã có sẵn ảnh nền và lớp thư viện Maven trong bộ đệm Docker. Trên máy chưa từng dựng dự án, lần <code>up --build</code> đầu tiên phải tải ảnh và mọi thư viện — vài phút tuỳ mạng — nên README giờ ghi đúng như vậy thay vì hứa "5 phút". Và phép thử tìm ra thêm một chuyện: trang lỗi mặc định của Tomcat in <code>Apache Tomcat/10.1.62</code>, gợi ý miễn phí cho kẻ tấn công đi tra CVE. Trước đó chưa ai nhìn trang 404. Nó vào danh sách rủi ro mức P3, không thành một PR phút chót.'}</p>

<h3>${en ? 'The handover message' : 'Lời nhắn bàn giao'}</h3>
${out(`
Gửi anh/chị nhận tiếp thuvien — bàn giao sprint 9 (24/11/2026)
1. Trạng thái: main = ch9, 8/8 ticket đã merge (danh sách cuối RUI-RO.md). Mốc kiểm cuối README.
2. Bắt đầu từ: README.md (clone sạch tới trang sách: 31 s khi đã có đệm Docker; máy mới cộng thời gian tải ảnh), rồi docs/ban-do.md mục "Chỗ nguy hiểm".
3. Việc gấp nhất: TV-124 (không phân quyền) và TV-125 (xoá độc giả xoá phiếu) — P1, chưa ai nhận.
4. Việc của vận hành khi phát hành: JDK 21; đặt THUVIEN_REMEMBER_KEY (mọi người phải đăng nhập lại một lần).
5. Câu hỏi còn mở với khách: Q&A #14–16 (bài 8.4) + ma trận quyền cho TV-124.
6. Em vẫn trả lời tin nhắn tới hết tuần sau; sau đó mọi thứ cần biết đã nằm trong repo.
`)}
<p>${en
  ? 'Six lines, in the team channel and in the PR of the handover. Point 6 matters in outsourcing: you will be moved to another project, and the honest promise is a short, dated one.'
  : 'Sáu dòng, gửi trong kênh của đội và trong PR bàn giao. Ý 6 quan trọng ở outsourcing: bạn sẽ bị chuyển sang dự án khác, và lời hứa thật lòng là một lời hứa ngắn, có hạn.'}</p>

<h3>💼 ${en ? 'OJT situation: “just explain it to the new guy in a call”' : 'Tình huống OJT: "em gọi điện giải thích cho bạn mới là được"'}</h3>
<p>${en
  ? 'Your lead suggests skipping the documents and doing a one-hour call. Do the call — and record what the newcomer asks. Each question that the README did not answer is a missing line; add it before you leave. The call is gone tomorrow; the README is still there when the next newcomer arrives in a year, the way you arrived.'
  : 'Trưởng nhóm gợi ý bỏ qua tài liệu, gọi một tiếng là xong. Cứ gọi — và ghi lại người mới hỏi gì. Mỗi câu README không trả lời được là một dòng còn thiếu; thêm nó vào trước khi đi. Cuộc gọi mai là mất; README thì vẫn còn khi người mới tiếp theo tới vào năm sau, giống như bạn đã tới.'}</p>

<h3>🎤 ${en ? 'What interviewers ask about this' : 'Phỏng vấn viên sẽ hỏi'}</h3>
<ul>
<li>${en ? '“What do you leave behind when you move to another project?” — README tested on a clean clone, updated map, upgrade notes for operations, ranked risk register with evidence, a six-line message.' : '"Khi chuyển dự án em để lại gì?" — README đã thử trên bản clone sạch, bản đồ cập nhật, ghi chú nâng cấp cho vận hành, danh sách rủi ro xếp hạng có bằng chứng, một lời nhắn sáu dòng.'}</li>
<li>${en ? '“How do you prioritise technical debt?” — harm × likelihood, with evidence; not by ease. Hotspots (4.4) tell you where it costs most.' : '"Em xếp ưu tiên nợ kỹ thuật thế nào?" — mức hại × khả năng xảy ra, có bằng chứng; không theo độ dễ. Chỗ nóng (4.4) cho biết chỗ nào tốn kém nhất.'}</li>
<li>${en ? '“How do you know your documentation works?” — someone else follows it on a clean machine, timed; their questions become new lines.' : '"Làm sao biết tài liệu của em dùng được?" — một người khác làm theo trên máy sạch, có bấm giờ; câu họ hỏi thành dòng mới.'}</li>
</ul>

<h3>🗂 ${en ? 'Key terms' : 'Thuật ngữ trong bài'}</h3>
${thuatNgu(en, [
  ['Handover', 'bàn giao', 'Chuyển dự án cho người khác sao cho họ làm tiếp được khi không có mình — bằng tệp trong repo, không bằng trí nhớ.', 'Passing a project on so others can continue without you — through files in the repo, not memory.'],
  ['Technical debt', 'nợ kỹ thuật', 'Chi phí thêm mọi thay đổi sau phải trả vì một lối tắt trước đó.', 'Extra cost future changes pay because of an earlier shortcut.'],
  ['Risk register', 'danh sách rủi ro', 'Bảng rủi ro còn lại, xếp ưu tiên, có bằng chứng và đề xuất.', 'A ranked table of remaining risks with evidence and proposals.'],
  ['Clean clone test', 'thử trên bản clone sạch', 'Làm theo README trên thư mục mới, không bộ đệm, có bấm giờ.', 'Following the README in a fresh folder, no caches, timed.'],
])}

<h3>📌 ${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'Four documents: README (run/test/configure/errors), map (Mermaid, danger zones), upgrade notes (for operations), ranked risk register (with evidence).' : 'Bốn tài liệu: README (chạy/test/cấu hình/lỗi), bản đồ (Mermaid, chỗ nguy hiểm), ghi chú nâng cấp (cho vận hành), danh sách rủi ro xếp hạng (có bằng chứng).'}</li>
<li>${en ? 'Prove the README with a clean clone and a stopwatch; every gap found becomes a line.' : 'Chứng minh README bằng bản clone sạch và đồng hồ bấm giờ; chỗ hổng nào tìm ra cũng thành một dòng.'}</li>
<li>${en ? 'Findings you did not fix are not lost: they are the next sprint’s P1s.' : 'Phát hiện chưa sửa không mất đi: chúng là P1 của sprint kế.'}</li>
</ul>
${lk(bai('agile-teamwork', 'agl-6-3-bao-cao'), '📊', en ? 'Agile & teamwork 6.3 — Reporting progress and risks' : 'Agile & làm việc nhóm 6.3 — Báo cáo tiến độ và rủi ro', en ? 'How risks are reported upward' : 'Cách báo rủi ro lên trên')}
${lk(bai('software-architecture', 'swarch-11-4-no-ky-thuat'), '🏛️', en ? 'Software architecture 11.4 — Technical debt' : 'Kiến trúc phần mềm 11.4 — Nợ kỹ thuật', en ? 'Debt at system scale' : 'Nợ ở tầm hệ thống')}
`);

/* ═══════════════════ 9.2 — Thực hiện sprint ═══════════════════ */
const O92_MOC = out(`
$ git switch -c ch9 ch8
$ mvn -B -o test                         # JDK 17, MySQL lab (docker compose up -d db)
[INFO] Tests run: 50, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
Mốc ngày 1: 50 test xanh · e2e 3/3 (bài 8.5) · golden master 3 trang giống hệt · Checkstyle dự án 0 · Node 24 test
`);
const B92_DO = bash(`
# "Đỏ trước" mà commit nào cũng xanh: chạy test MỚI trên code CŨ trong một worktree tạm (không đụng nhánh đang làm)
git worktree add --detach /tmp/do tv-113^             # code trước bản sửa
git -C /tmp/do checkout tv-113 -- src/test/java/com/thuvien/servlet/BookServletTraSachTest.java   # chỉ lấy test mới
(cd /tmp/do && mvn -B -o test -Dtest=BookServletTraSachTest)   # phải ĐỎ — và đỏ đúng lý do
git worktree remove --force /tmp/do
`);
const O92_41_CHERRY = out(`
$ git switch -c tv-41 ch9
$ git cherry-pick e83042f               # nhánh ch5-tv41 — viết từ Chương 5, bốn chương trước
Auto-merging src/main/java/com/thuvien/service/MuonTraService.java
Auto-merging src/test/java/com/thuvien/servlet/BookServletMuonSachTest.java
[tv-41 3f5a8f1] fix(TV-41): toi da N cuon nghia la N (> thanh >=) — cap nhat 2 test dac ta co chu dich
 2 files changed, 6 insertions(+), 6 deletions(-)
`);
const O92_41_DO = out(`
$ mvn -B -o test -Dtest=BookServletMuonSachTest        # test của tv-41, code của ch9 (chưa sửa)
[ERROR]   BookServletMuonSachTest.khachDangMuon1_biTuChoiCuonThu2_TV41:86 expected: <books?msg=Vượt quá số sách được mượn> but was: <books?msg=Mượn thành công>
[ERROR]   BookServletMuonSachTest.sinhVienDangMuon3_biTuChoiCuonThu4_TV41:74 expected: <books?msg=Vượt quá số sách được mượn> but was: <books?msg=Mượn thành công>
[ERROR] Tests run: 15, Failures: 2, Errors: 0, Skipped: 0
$ mvn -B -o test                                       # nhánh tv-41
[INFO] Tests run: 50, Failures: 0, Errors: 0, Skipped: 0
`);
const J92_110 = java(`
/** TV-110: token = HMAC-SHA256(khoá, username); khoá từ biến môi trường THUVIEN_REMEMBER_KEY (≥ 32 ký tự). Không có khoá ⇒ tắt "Ghi nhớ". */
public static String makeToken(String username) {
    String k = khoa();
    if (k == null) return null;
    try {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(k.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
        return HexFormat.of().formatHex(mac.doFinal(username.getBytes(StandardCharsets.UTF_8)));
    } catch (Exception e) {
        throw new IllegalStateException("khong tao duoc HMAC-SHA256", e);
    }
}

/** So trong thời gian không đổi — không lộ số ký tự đúng qua thời gian trả lời. */
public static boolean khop(String username, String token) {
    String dung = makeToken(username);
    return dung != null && token != null
            && MessageDigest.isEqual(dung.getBytes(StandardCharsets.US_ASCII), token.getBytes(StandardCharsets.US_ASCII));
}
`);
const O92_110_DO = out(`
$ printf 'admin' | openssl dgst -sha256 -hmac 'khoa-thu-chi-dung-cho-test-0123456789abcdef'
SHA2-256(stdin)= 8300c6842be45044399efd0b703567fb317e6e90539c193fa9d5cfeb54cbc6a0      ← giá trị mong đợi tính bằng công cụ KHÁC
$ mvn -B -o test -Dtest='LoginServletCookieTest,TokenUtilDacTaTest,TokenUtilTest'   # test mới, code cũ
[ERROR]   LoginServletCookieTest.cookieDucTuBiMatCu_khongConDangNhap_TV110:103
Wanted but not invoked:
requestDispatcher.forward(…);
Actually, there were zero interactions with this mock.                  ← cookie md5("admin"+"thuvien2016") VẪN đăng nhập được
[ERROR]   TokenUtilDacTaTest.tokenCuaAdmin_laHmacSha256_TV110:24 expected: <8300c684…cbc6a0> but was: <a316eabce65f3759e1ce2d96db99486c>
[ERROR]   TokenUtilDacTaTest.khoaNganHon32KyTu_tatGhiNho_TV110:36 expected: <null> but was: <a316eabce65f3759e1ce2d96db99486c>
[ERROR]   TokenUtilTest.tokenCoDinh:18 expected:<64> but was:<32>
[ERROR] Tests run: 13, Failures: 6, Errors: 0, Skipped: 0
$ mvn -B -o test                                       # nhánh tv-110
[INFO] Tests run: 54, Failures: 0, Errors: 0, Skipped: 0
`);
const O92_111_DO = out(`
$ mvn -B -f e2e/pom.xml test        # test e2e mới (Testcontainers: MySQL + Tomcat thật), code cũ — 46,6 s
[ERROR]   MuonSachQuaHttpTest.moThangJsp_khongConMoDuoc_TV111:119 books.jsp ==> expected: <404> but was: <500>
[ERROR] Tests run: 4, Failures: 1, Errors: 0, Skipped: 0
$ git diff --stat -M ch9 tv-111 | tail -1
 14 files changed, 22 insertions(+), 14 deletions(-)       ← 6 JSP chỉ đổi chỗ (rename 100%), không tính dòng
`);
const J92_113 = java(`
/** TV-113: ghi trả + cộng lại sách trong MỘT giao dịch. Lỗi giữa hai câu ⇒ rollback cả hai rồi ném lại. */
public int traPhieu(int loanId, int bookId, Timestamp ngayTra, Tien phi) throws SQLException {
    boolean tuDongCu = con.getAutoCommit();
    con.setAutoCommit(false);
    try {
        int soDong = ghiTra(loanId, ngayTra, phi);
        if (soDong == 1) congLaiSach(bookId);
        con.commit();
        return soDong;
    } catch (SQLException | RuntimeException e) {
        con.rollback();
        throw e;
    } finally {
        con.setAutoCommit(tuDongCu);
    }
}
`);
const J92_113_TEST = java(`
@Test
void congSachLoi_phieuKhongBiGhiTra_TV113() throws Exception {
    // Tiêm lỗi THẬT ở MySQL: trigger chặn câu UPDATE thứ hai (cộng sách 1) — như mất kết nối/khoá chờ quá hạn giữa hai câu
    DuLieuTest.chay("CREATE TRIGGER t_loi_tv113 BEFORE UPDATE ON books FOR EACH ROW BEGIN "
            + "IF NEW.id = 1 THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'mo phong loi giua hai cau'; END IF; END");
    StringWriter body = new StringWriter();
    when(res.getWriter()).thenReturn(new PrintWriter(body, true));   // nhánh lỗi của doPost in trang lỗi, không redirect
    try {
        int truoc = DuLieuTest.so("SELECT available FROM books WHERE id = 1");
        assertEquals("", tra("2"));                                  // phiếu 2: sách 1 — không redirect
        assertTrue(body.toString().contains("(ma loi "), body.toString());
        assertEquals(truoc, DuLieuTest.so("SELECT available FROM books WHERE id = 1"));
        assertEquals(0, DuLieuTest.so("SELECT COUNT(*) FROM loans WHERE id = 2 AND return_date IS NOT NULL"));
    } finally {
        DuLieuTest.chay("DROP TRIGGER IF EXISTS t_loi_tv113");
    }
    assertEquals("readers?msg=Trả sách thành công", tra("2"));     // hết lỗi thì trả lại được bình thường
}
`);
const O92_113_SAI = out(`
Lượt 1 (test chưa có 2 dòng getWriter):
$ mvn -B -o test -Dtest=BookServletTraSachTest        # CODE CŨ
[ERROR]   BookServletTraSachTest.congSachLoi_phieuKhongBiGhiTra_TV113:95->tra:47 » NullPointer Cannot invoke "java.io.PrintWriter.println(String)" because "out" is null
$ mvn -B -o test                                      # CODE ĐÃ SỬA (tv-113)
[ERROR]   BookServletTraSachTest.congSachLoi_phieuKhongBiGhiTra_TV113:95->tra:47 » NullPointer Cannot invoke "java.io.PrintWriter.println(String)" because "out" is null
[ERROR] Tests run: 55, Failures: 0, Errors: 1, Skipped: 0
`);
const O92_113_DUNG = out(`
Lượt 2 (đã thêm 2 dòng getWriter):
$ mvn -B -o test -Dtest=BookServletTraSachTest        # CODE CŨ
[ERROR]   BookServletTraSachTest.congSachLoi_phieuKhongBiGhiTra_TV113:104 expected: <0> but was: <1>
[ERROR] Tests run: 7, Failures: 1, Errors: 0, Skipped: 0
                                                      ← dòng 104: phiếu 2 ĐÃ ghi trả (1) dù sách không về kho — đúng bug
$ mvn -B -o test                                      # CODE ĐÃ SỬA (tv-113)
[INFO] Tests run: 55, Failures: 0, Errors: 0, Skipped: 0
`);
const O92_117 = out(`
$ bash tools/golden.sh /tmp/gm && diff -r golden /tmp/gm | grep -c '^[<>]'      # lượt 1: directive đứng riêng dòng đầu
39
$ diff golden/books.html /tmp/gm/books.html | head -2
7a8
>                                                     ← THỪA một dòng trống mỗi trang: chính dòng directive mới sinh ra
$ # sửa: gộp pageEncoding vào directive import đang có ở dòng 1 — không thêm dòng nào
$ bash tools/golden.sh /tmp/gm && diff -r golden /tmp/gm | grep -c '^[<>]'      # lượt 2
36                                                    ← 3 trang × 6 dòng cũ + 6 dòng mới: chỉ thanh menu
$ diff golden/books.html /tmp/gm/books.html
9,14c9,14
<   <b>THÆ¯ VIá»N</b> |
<   <a style="color:#fff" href="books">SÃ¡ch</a> |
<   <a style="color:#fff" href="readers">Äá»c giáº£</a> |
<   <a style="color:#fff" href="report">QuÃ¡ háº¡n (3)</a> |
<   Xin chÃ o thuthu |
<   <a style="color:#fff" href="login?action=logout">ThoÃ¡t</a>
---
>   <b>THƯ VIỆN</b> |
>   <a style="color:#fff" href="books">Sách</a> |
>   <a style="color:#fff" href="readers">Độc giả</a> |
>   <a style="color:#fff" href="report">Quá hạn (3)</a> |
>   Xin chào thuthu |
>   <a style="color:#fff" href="login?action=logout">Thoát</a>
$ cp /tmp/gm/*.html golden/ && git commit -am "test(TV-117): duyet golden master moi — chi thanh menu doi chu (6 dong/trang)"
`);
const O92_95_DO = out(`
$ git switch -c tv-95 ch9 && git cherry-pick 7afac6a    # nhánh ch5-ncs — readers.jsp đã bị dời vào WEB-INF/jsp ở TV-111
Auto-merging src/main/webapp/WEB-INF/jsp/readers.jsp      ← git nhận ra tệp đổi chỗ, áp đúng
[tv-95 9ed3336] feat(TV-95): them loai doc gia NCS
 4 files changed, 18 insertions(+), 3 deletions(-)
$ mvn -B -o test -Dtest=BookServletMuonSachTest         # test đi hết đường CSDL, code chưa có NCS
[ERROR]   BookServletMuonSachTest.nghienCuuSinh_muonToiDa5Cuon_han21Ngay_TV95:156 sách 2 ==> expected: <books?msg=Mượn thành công> but was: <books?msg=Vượt quá số sách được mượn>
                                                          ← "NCS" rơi vào nhánh else ⇒ tính như KHACH (tối đa 1)
$ cd ../legacy-express && git switch -c tv-95 ch8 && git cherry-pick ef6e54f && npx jest --runInBand     # Node 24
Tests:       24 passed, 24 total
`);
const O92_95_GOLDEN = out(`
$ diff -r golden /tmp/gm            # golden master trên ch9 SAU khi merge TV-95 — mọi test đơn vị đều xanh
diff -r golden/readers.html /tmp/gm/readers.html
121c121
<   Tên <input name="name"> Loại <select name="type"><option>SV</option><option>GV</option><option>KHACH</option></select>
---
>   Tên <input name="name"> Loại <select name="type"><option>SV</option><option>GV</option><option>NCS</option><option>KHACH</option></select>
`);
const O92_122 = out(`
$ mvn -B -o test -Dtest=ReaderServletDacTaTest         # bước 0: 4 test đặc tả trên CODE CŨ — phải XANH
[INFO] Tests run: 4, Failures: 0, Errors: 0, Skipped: 0
$ git diff --shortstat ch9 tv-122                      # cả ticket
 3 files changed, 179 insertions(+), 40 deletions(-)   ← 219 dòng > 200: vượt luật chính mình đặt ở 9.1
$ git diff --shortstat ch9 tv-122~1                    # ⇒ tách: PR 1 = test đặc tả
 1 file changed, 93 insertions(+)
$ git diff --shortstat tv-122~1 tv-122                 #       PR 2 = Extract Class
 2 files changed, 86 insertions(+), 40 deletions(-)
`);
const O92_121 = out(`
$ mvn -B -o test                                       # nhánh tv-121, máy còn JDK 17
[ERROR] Rule 0: org.apache.maven.enforcer.rules.version.RequireJavaVersion failed with message:
[ERROR] Detected JDK version 17.0.20-1 (JAVA_HOME=/opt/java/openjdk) is not in the allowed range [21,).
[INFO] BUILD FAILURE                                   ← đúng ý muốn: chặn ngay, không biên dịch nửa vời
$ mvn -B -o test                                       # JDK 21
[INFO] Tests run: 61, Failures: 0, Errors: 0, Skipped: 0
`);
const O92_CUOI = out(`
$ git log --oneline --first-parent ch8..ch9 | wc -l
10                                                    ← 10 PR: 8 ticket (TV-122 tách đôi) + bàn giao
$ mvn -B -o test                                      # JDK 21
[INFO] Tests run: 61, Failures: 0, Errors: 0, Skipped: 0          ← 50 → 61
$ mvn -B -f e2e/pom.xml test                          # Testcontainers: MySQL 8.0 + Tomcat 10.1/JDK 21 dựng từ Dockerfile — 113 s
[INFO] Tests run: 4, Failures: 0, Errors: 0, Skipped: 0           ← 3 → 4
$ bash tools/golden.sh /tmp/gm && diff -r golden /tmp/gm && echo GIONG HET
GIONG HET                                             ← với golden ĐÃ duyệt ở TV-117 và TV-95
$ mvn -q checkstyle:checkstyle -Dcheckstyle.config.location=tools/checkstyle-du-an.xml …; grep -c '<error' target/checkstyle-result.xml
0
$ mvn -q pmd:pmd …; grep -c '<violation' target/pmd.xml
8                                                     ← bộ luật smell-pmd của bài 4.4 (sau Chương 5 đo được 8; giữa Ch6–8 không đo lại)
$ cd ../legacy-express && npx jest --runInBand        # Node 24, nhánh ch9 (+ TV-95)
Tests:       24 passed, 24 total
`);
const O92_PR = out(`
$ for m in \$(git rev-list --first-parent --reverse ch8..ch9); do … git diff --shortstat -M $m^1 $m; done
tv-41           2 files changed, 6 insertions(+), 6 deletions(-)
tv-110          8 files changed, 109 insertions(+), 12 deletions(-)
tv-111          14 files changed, 22 insertions(+), 14 deletions(-)
tv-113          4 files changed, 50 insertions(+), 7 deletions(-)
tv-117          4 files changed, 19 insertions(+), 19 deletions(-)
tv-95           6 files changed, 31 insertions(+), 4 deletions(-)
tv-122-dac-ta   1 file changed, 93 insertions(+)
tv-122          2 files changed, 86 insertions(+), 40 deletions(-)
tv-121          3 files changed, 11 insertions(+), 9 deletions(-)
ban-giao        3 files changed, 140 insertions(+), 4 deletions(-)
                ← 10 PR, lớn nhất 140 dòng thêm (tài liệu); không PR code nào chạm 200
`);

const L92 = ml((en) => `
<span class="eyebrow">${en ? 'Chapter 9 · Capstone' : 'Chương 9 · Dự án cuối khoá'}</span>
<h2>${en ? '9.2 — Doing the sprint: map, pin, change, prove' : '9.2 — Thực hiện sprint: vẽ bản đồ, khoá hành vi, thay đổi, chứng minh'}</h2>
<p class="lead">${en
  ? 'Do the sprint yourself first — the brief of 9.1 is all you need. Then open this lesson: it is the logbook of the same sprint done for real on the course’s copy, including the three times it went wrong. Those three are the most useful part: a test that was red for the wrong reason, a page that changed without any unit test noticing, and a PR that broke the size rule we wrote ourselves.'
  : 'Hãy tự làm sprint trước — đề ở bài 9.1 là đủ. Sau đó mới mở bài này: đây là nhật ký của chính sprint đó làm thật trên bản của khoá, kể cả ba lần nó đi sai. Ba lần đó là phần có ích nhất: một test đỏ vì lý do sai, một trang thay đổi mà không test đơn vị nào nhận ra, và một PR phạm luật kích thước do chính mình đặt ra.'}</p>
${moiTruong(en)}

<h3>${en ? 'The loop, for every ticket' : 'Vòng lặp, cho mọi ticket'}</h3>
<ol>
<li>${en ? '<strong>Map</strong> — the impact analysis of 9.1, refreshed on the current main.' : '<strong>Vẽ bản đồ</strong> — phân tích ảnh hưởng của 9.1, làm lại trên main hiện tại.'}</li>
<li>${en ? '<strong>Pin</strong> — characterization tests for what you will touch, green on the old code.' : '<strong>Khoá hành vi</strong> — characterization test cho phần sắp chạm, xanh trên code cũ.'}</li>
<li>${en ? '<strong>Change</strong> — new test red (for the right reason), smallest fix, green.' : '<strong>Thay đổi</strong> — test mới đỏ (đúng lý do), bản sửa nhỏ nhất, xanh.'}</li>
<li>${en ? '<strong>Prove</strong> — whole suite, e2e, golden master, size of the diff, PR description.' : '<strong>Chứng minh</strong> — cả bộ test, e2e, golden master, kích thước diff, mô tả PR.'}</li>
</ol>
<p>${en
  ? 'How to show “red before” while keeping every commit green: run the <em>new</em> test against the <em>old</em> code in a throw-away worktree. Nothing is committed red, and the red run is reproducible by anyone reviewing the PR:'
  : 'Cách cho thấy "đỏ trước" mà commit nào vẫn xanh: chạy test <em>mới</em> trên code <em>cũ</em> trong một worktree dùng-xong-bỏ. Không commit nào đỏ, và lượt đỏ thì người review nào cũng tự chạy lại được:'}</p>
${B92_DO}

<h3>${en ? 'Day 1 — baseline' : 'Ngày 1 — đo mốc'}</h3>
${O92_MOC}
<p>${en
  ? 'Log entry: <em>“Done: baseline 50/3/3/0/24. Next: TV-110, TV-111 (security, PO’s order). Risk: TV-110 needs a key on the server — asked anh Phong.”</em> Three lines, every day; the whole log is in <code>lab/loi-giai/ch9/NHAT-KY.md</code>.'
  : 'Nhật ký: <em>"Đã làm: mốc 50/3/3/0/24. Sẽ làm: TV-110, TV-111 (bảo mật, theo thứ tự PO chọn). Rủi ro: TV-110 cần khoá trên máy chủ — đã hỏi anh Phong."</em> Ba dòng, mỗi ngày; cả nhật ký ở <code>lab/loi-giai/ch9/NHAT-KY.md</code>.'}</p>

<h3>TV-41 — ${en ? 'an old branch, four chapters later' : 'một nhánh cũ, bốn chương sau'}</h3>
<p>${en
  ? 'The fix already exists on branch <code>ch5-tv41</code>, written before Chapters 6–8 moved code around. Do not retype it — cherry-pick it, and let git tell you whether it still applies:'
  : 'Bản sửa đã có sẵn trên nhánh <code>ch5-tv41</code>, viết trước khi Chương 6–8 dời code đi khắp nơi. Đừng gõ lại — cherry-pick nó, và để git cho biết nó còn áp được không:'}</p>
${O92_41_CHERRY}
${O92_41_DO}
<p>${en
  ? 'It applied cleanly because the Extract Class of lesson 5.3 put the rule on one line in <code>MuonTraService</code>, and later chapters did not touch that line. The two tests that were named <code>_BUG_TV41</code> since Chapter 3 flip to the correct rule — exactly what a characterization test promised: when you decide to fix the bug, the test tells you where, and becomes the regression test. Reality check on the Node side: <code>lib/luat.js</code> already used <code>&gt;=</code> (lesson 4.2), so this PR is Java-only — say so in the impact section.'
  : 'Nó áp sạch vì Extract Class ở bài 5.3 đã đưa luật về một dòng trong <code>MuonTraService</code>, và các chương sau không chạm dòng đó. Hai test mang tên <code>_BUG_TV41</code> từ Chương 3 đảo sang luật đúng — đúng điều characterization test đã hứa: khi quyết định sửa bug, test chỉ chỗ, rồi thành test hồi quy. Soát phía Node: <code>lib/luat.js</code> vốn đã dùng <code>&gt;=</code> (bài 4.2), nên PR này chỉ có Java — ghi rõ điều đó ở mục phạm vi ảnh hưởng.'}</p>

<h3>TV-110 — ${en ? 'replacing a hard-coded secret' : 'thay một bí mật viết cứng'}</h3>
<p>${en
  ? 'Lesson 8.5 proved the attack: <code>md5(username + "thuvien2016")</code> is computable by anyone who has seen the source. The fix replaces it with an <strong>HMAC</strong> (a hash keyed with a secret: without the key you cannot compute it, even knowing the algorithm), with the key read from an environment variable that lives only on the server, compared in constant time:'
  : 'Bài 8.5 đã chứng minh đòn tấn công: <code>md5(tên + "thuvien2016")</code> thì ai từng thấy mã nguồn cũng tính được. Bản sửa thay bằng <strong>HMAC</strong> (hàm băm có khoá bí mật: không có khoá thì không tính được, dù biết thuật toán), khoá đọc từ biến môi trường chỉ nằm trên máy chủ, so sánh trong thời gian không đổi:'}</p>
${J92_110}
<p>${en
  ? 'Expected values in tests are computed with a <em>different</em> tool (openssl), not copied from the code’s own output — otherwise the test only proves the code equals itself:'
  : 'Giá trị mong đợi trong test được tính bằng một công cụ <em>khác</em> (openssl), không chép từ output của chính code — nếu không, test chỉ chứng minh code bằng chính nó:'}</p>
${O92_110_DO}
<p>${en
  ? 'Scope decisions written in the PR: the cookie also becomes <code>HttpOnly</code> (same cookie, one line, same risk); the token still has no expiry and cannot be revoked per user — that is a design change (a server-side token table) and becomes <strong>TV-123</strong>. Deployment note for operations: set <code>THUVIEN_REMEMBER_KEY</code> (<code>openssl rand -hex 32</code>) via <code>.env</code>, never committed; every existing cookie stops working, users log in once. The same mistake at scale: Toyota disclosed in October 2022 that an access key to a customer-data server had sat in a public GitHub repository for almost five years (296,019 email addresses possibly accessed) — secrets in source code leak eventually.'
  : 'Quyết định phạm vi ghi trong PR: cookie đồng thời thành <code>HttpOnly</code> (cùng cookie, một dòng, cùng rủi ro); token vẫn không có hạn và không thu hồi được theo từng người — đó là đổi thiết kế (bảng token phía máy chủ) và thành <strong>TV-123</strong>. Ghi chú triển khai cho vận hành: đặt <code>THUVIEN_REMEMBER_KEY</code> (<code>openssl rand -hex 32</code>) qua tệp <code>.env</code>, không bao giờ commit; mọi cookie đang có mất hiệu lực, người dùng đăng nhập lại một lần. Cùng lỗi ở quy mô lớn: tháng 10/2022 Toyota công bố một khoá truy cập máy chủ dữ liệu khách hàng đã nằm trong một repo GitHub công khai gần năm năm (296.019 địa chỉ email có thể đã bị truy cập) — bí mật trong mã nguồn sớm muộn cũng lộ.'}</p>

<h3>TV-111 — ${en ? 'JSPs behind the servlets' : 'giấu JSP sau servlet'}</h3>
<p>${en
  ? 'Servlet containers never serve anything under <code>WEB-INF/</code> directly. Move the six JSPs to <code>WEB-INF/jsp/</code>, change the five forwards and the error page in <code>web.xml</code>; <code>index.jsp</code> stays public (it only redirects). The test is end to end, because the bug only exists over HTTP — flip the e2e test of lesson 3.4 first:'
  : 'Servlet container không bao giờ phục vụ thẳng thứ gì nằm dưới <code>WEB-INF/</code>. Dời sáu JSP vào <code>WEB-INF/jsp/</code>, đổi năm lệnh forward và trang lỗi trong <code>web.xml</code>; <code>index.jsp</code> để ngoài (nó chỉ redirect). Test phải là đầu-cuối, vì lỗi chỉ tồn tại qua HTTP — đảo test e2e của bài 3.4 trước:'}</p>
${O92_111_DO}
<p>${en
  ? 'A second e2e test keeps the TV-109 guarantee alive after the move: <code>report?days=abc</code> throws an uncaught <code>NumberFormatException</code>, Tomcat sends the error page from its new location, the body shows only the error code. Real-world weight of “a page reachable by URL without authorisation”: in 2019 First American Financial exposed some 885 million mortgage documents simply by sequential URLs; the SEC later fined the company. Forced browsing is CWE-425.'
  : 'Một test e2e thứ hai giữ cam kết của TV-109 sau khi dời: <code>report?days=abc</code> ném <code>NumberFormatException</code> không ai bắt, Tomcat trả trang lỗi từ chỗ mới, thân trang chỉ có mã lỗi. Sức nặng ngoài đời của "một trang mở được bằng URL mà không cần quyền": năm 2019 First American Financial để lộ khoảng 885 triệu tài liệu thế chấp chỉ vì URL đánh số tuần tự; SEC sau đó phạt công ty. Lỗi truy cập thẳng (forced browsing) là CWE-425.'}</p>

<h3>TV-113 — ${en ? 'a transaction, and a test that lied' : 'một giao dịch, và một test nói dối'}</h3>
<p>${en
  ? 'Returning a book is two <code>UPDATE</code>s in autocommit mode. If the second fails (the database restarts, a lock wait times out), the loan is recorded as returned but the copy never comes back — the ticket’s “often after a database restart”. The fix puts both in one transaction:'
  : 'Trả sách là hai câu <code>UPDATE</code> ở chế độ autocommit. Câu thứ hai lỗi (CSDL khởi động lại, chờ khoá quá hạn) thì phiếu đã ghi là trả mà bản sách không bao giờ về kho — đúng câu "hay gặp hôm máy chủ CSDL khởi động lại" của ticket. Bản sửa gộp hai câu vào một giao dịch:'}</p>
${J92_113}
<p>${en
  ? 'How do you make the <em>second</em> statement fail on demand? Not with a mock — the bug is about what the real database keeps after a failure, and a mocked DAO would pass with or without the transaction. Inject the fault in MySQL itself with a trigger that refuses that one update:'
  : 'Làm sao cho câu <em>thứ hai</em> lỗi theo ý mình? Không dùng mock — bug nằm ở chỗ CSDL thật giữ lại gì sau lỗi, và một DAO giả sẽ xanh dù có hay không có giao dịch. Tiêm lỗi ngay trong MySQL bằng một trigger từ chối đúng câu cập nhật đó:'}</p>
${J92_113_TEST}
<p><strong>${en ? 'What actually happened first.' : 'Chuyện thật sự xảy ra lúc đầu.'}</strong> ${en
  ? 'The first version of the test did not have the two <code>getWriter</code> lines. Its red run looked perfect — until the green run:'
  : 'Bản đầu của test không có hai dòng <code>getWriter</code>. Lượt đỏ trông hoàn hảo — cho tới lượt xanh:'}</p>
${O92_113_SAI}
<p>${en
  ? 'Same error before and after the fix: the test was failing inside its own harness (the error branch of <code>doPost</code> writes an error page, and the mocked response had no writer), so it never reached the assertions about the database. The red run proved nothing. <strong>Always read the failure message of the red run</strong> and check it describes the bug. After stubbing the writer:'
  : 'Cùng một lỗi trước và sau khi sửa: test hỏng ngay trong bộ khung của nó (nhánh lỗi của <code>doPost</code> in trang lỗi, mà response giả không có writer), nên chưa bao giờ tới được các khẳng định về CSDL. Lượt đỏ không chứng minh gì. <strong>Luôn đọc câu báo lỗi của lượt đỏ</strong> và kiểm nó có mô tả đúng bug không. Sau khi giả lập writer:'}</p>
${O92_113_DUNG}

<h3>TV-117 — ${en ? 'a one-line fix that changes the golden master' : 'bản sửa một dòng làm đổi golden master'}</h3>
<p>${en
  ? '<code>header.jsp</code> is included statically by the three pages but never declared its own encoding, so Jasper read it as ISO-8859-1 (lesson 1.5). The fix is one directive — and this time the golden master <em>must</em> change. Changing approved output on purpose is a review step, not a formality:'
  : '<code>header.jsp</code> được include tĩnh vào ba trang nhưng không khai báo mã hoá của chính nó, nên Jasper đọc nó theo ISO-8859-1 (bài 1.5). Bản sửa là một dòng directive — và lần này golden master <em>phải</em> đổi. Cố ý đổi output đã duyệt là một bước review, không phải thủ tục:'}</p>
${O92_117}

<h3>TV-95 — ${en ? 'a feature in two repositories, and a page nobody tested' : 'một tính năng ở hai repo, và một trang không ai test'}</h3>
<p>${en
  ? 'Thanks to the enum of lesson 5.2 the feature is one constant (in Chapter 4 the same ticket meant 9 edits in 6 files). The branch <code>ch5-ncs</code> already has it, and impact analysis says the Node API needs it too:'
  : 'Nhờ enum của bài 5.2, tính năng chỉ là một hằng (ở Chương 4 cùng ticket này nghĩa là 9 chỗ sửa trong 6 tệp). Nhánh <code>ch5-ncs</code> đã có sẵn, và phân tích ảnh hưởng nói API Node cũng phải có:'}</p>
${O92_95_DO}
<p>${en
  ? 'The old branch only had enum-level unit tests, so the PR adds a test that goes the whole way through the database (insert an NCS reader, borrow 5, the 6th refused, due in 21 days). Without the Node change, a PhD student would be limited to 1 book in the mobile app and 5 at the desk. Then the end-of-sprint golden master run found what no unit test looks at:'
  : 'Nhánh cũ chỉ có test đơn vị ở mức enum, nên PR thêm một test đi hết đường qua CSDL (thêm độc giả NCS, mượn 5, cuốn thứ 6 bị từ chối, hạn 21 ngày). Không sửa phía Node thì một nghiên cứu sinh chỉ được mượn 1 cuốn trên app mobile mà 5 cuốn ở quầy. Rồi lượt golden master cuối sprint tìm ra thứ không test đơn vị nào nhìn:'}</p>
${O92_95_GOLDEN}
<p>${en
  ? 'The new option in the “add reader” form is correct — but it is a change of the page, and the PR did not mention it. The net worked: the difference is approved in its own commit inside the TV-95 PR, with a line in the description. That is why the golden master runs at the end of every ticket, not only for refactorings.'
  : 'Lựa chọn mới trong form "thêm độc giả" là đúng — nhưng nó là một thay đổi của trang, và PR chưa nhắc tới. Tấm lưới đã làm việc: khác biệt được duyệt trong một commit riêng nằm trong PR TV-95, kèm một dòng trong mô tả. Đó là lý do golden master chạy sau mọi ticket, không chỉ sau refactor.'}</p>

<h3>TV-122 — ${en ? 'refactor one module: characterization tests, then Extract Class' : 'refactor một module: characterization test, rồi Extract Class'}</h3>
<p>${en
  ? '<code>ReaderServlet</code> had SQL, mapping and HTTP in two long methods and no test for its list page. Step 0: four characterization tests on the old code — the list order, the redirect when not logged in, a swallowed error, and a real data-loss bug pinned as <code>_BUG_TV125</code> (deleting a reader cascades to their open loans; the copy never returns). Step 1: move the SQL verbatim into <code>dao/DocGiaDAO</code>, like <code>PhieuMuonDAO</code> in lesson 5.3. Then count:'
  : '<code>ReaderServlet</code> chứa SQL, ánh xạ dữ liệu và HTTP trong hai hàm dài, và trang danh sách chưa có test nào. Bước 0: bốn characterization test trên code cũ — thứ tự danh sách, chuyển hướng khi chưa đăng nhập, một lỗi bị nuốt, và một bug mất dữ liệu thật được khoá với tên <code>_BUG_TV125</code> (xoá độc giả kéo theo xoá phiếu đang mượn; bản sách không bao giờ về). Bước 1: chuyển nguyên văn SQL sang <code>dao/DocGiaDAO</code>, như <code>PhieuMuonDAO</code> ở bài 5.3. Rồi đếm:'}</p>
${O92_122}
<p>${en
  ? 'The ticket breaks rule 2 of our own brief. Splitting it is easy and common: PR 1 contains only the characterization tests (reviewers check “does this describe today’s behaviour?”, nothing else); PR 2 is the pure refactoring, reviewed against tests that already sit on main. One behaviour nuance goes into PR 2’s risk section: if the first query fails half-way, the old code showed a partial list, the new code an empty one — both log the error; nobody relies on a partial list.'
  : 'Ticket phạm luật số 2 trong chính đề của ta. Tách ra vừa dễ vừa phổ biến: PR 1 chỉ có characterization test (người review chỉ kiểm "cái này có mô tả đúng hành vi hôm nay không?"); PR 2 là refactor thuần, được review dựa trên các test đã nằm sẵn trên main. Một sắc thái hành vi ghi vào mục rủi ro của PR 2: nếu câu truy vấn đầu lỗi giữa chừng, code cũ hiện danh sách dở dang, code mới hiện danh sách rỗng — cả hai đều ghi log; không ai dựa vào một danh sách dở dang.'}</p>

<h3>TV-121 — Java 17 → 21</h3>
<p>${en
  ? 'Same discipline as Chapter 7, one LTS step: <code>maven.compiler.release</code> 21, enforcer <code>[21,)</code>, PMD <code>targetJdk</code> 21, both Docker images to JDK 21, milestone 4 in <code>NANG-CAP.md</code>. 11 lines added, 9 removed. The enforcer doing its job on a machine that still has JDK 17:'
  : 'Cùng kỷ luật của Chương 7, một mốc LTS: <code>maven.compiler.release</code> 21, enforcer <code>[21,)</code>, PMD <code>targetJdk</code> 21, cả hai ảnh Docker lên JDK 21, mốc 4 trong <code>NANG-CAP.md</code>. Thêm 11 dòng, bớt 9. Enforcer làm đúng việc trên một máy còn JDK 17:'}</p>
${O92_121}
<p>${en
  ? 'Why 21 and not 25 (the newest LTS since September 2025)? Because the ticket says the customer’s new servers standardise on 21 — the target is the customer’s decision, written in the ticket; the next step and its known risk (Locale data, lesson 7.1) go into the upgrade notes.'
  : 'Vì sao 21 mà không phải 25 (LTS mới nhất từ tháng 9/2025)? Vì ticket ghi máy chủ mới của khách chuẩn hoá 21 — đích là quyết định của khách, đã ghi trong ticket; mốc kế và rủi ro đã biết của nó (dữ liệu Locale, bài 7.1) vào ghi chú nâng cấp.'}</p>

<h3>${en ? 'Day 10 — prove it' : 'Ngày 10 — chứng minh'}</h3>
<p>${en ? 'Main after nine merged PRs, on JDK 21, everything at once:' : 'Main sau chín PR đã merge, trên JDK 21, chạy tất cả một lượt:'}</p>
${O92_CUOI}
${O92_PR}

${giai(en ? '🔑 Model solution: patches, daily log, PR descriptions' : '🔑 Lời giải mẫu: patch, nhật ký, mô tả PR', `
<p>${en
  ? '<code>lab/loi-giai/ch9/java/</code> — one folder per PR (<code>git am</code> in merge order onto <code>ch8</code>, the README there lists the order and the <code>--no-ff</code> merges); <code>lab/loi-giai/ch9/node/tv-95/</code>; <code>NHAT-KY.md</code> (ten days, three lines each); <code>PR/*.md</code> (ten descriptions, four sections each); <code>tools/chay9.sh</code> (the batch runner used here: worktrees, red-before runs, golden master, e2e).'
  : '<code>lab/loi-giai/ch9/java/</code> — mỗi PR một thư mục (<code>git am</code> theo thứ tự merge lên <code>ch8</code>, README trong đó ghi thứ tự và các lệnh merge <code>--no-ff</code>); <code>lab/loi-giai/ch9/node/tv-95/</code>; <code>NHAT-KY.md</code> (mười ngày, mỗi ngày ba dòng); <code>PR/*.md</code> (mười mô tả, mỗi mô tả bốn mục); <code>tools/chay9.sh</code> (script chạy gộp dùng ở đây: worktree, lượt đỏ-trước, golden master, e2e).'}</p>
`)}

<h3>💼 ${en ? 'OJT situation: CI is red on main at 17:30' : 'Tình huống OJT: CI đỏ trên main lúc 17:30'}</h3>
<p>${en
  ? 'If TV-113 had been merged with its lying test, main would be red for everyone the next morning. The rule in most teams: whoever broke main fixes it first, before any new work — revert if the fix is not obvious within minutes, then redo the PR. Tell the channel “main is red because of my TV-113, reverting now”. Nobody remembers who broke main; everybody remembers who left it broken overnight.'
  : 'Nếu TV-113 được merge cùng cái test nói dối, sáng hôm sau main sẽ đỏ với tất cả mọi người. Luật của hầu hết các đội: ai làm đỏ main thì sửa trước, trước mọi việc mới — chưa thấy cách sửa trong vài phút thì revert, rồi làm lại PR. Báo trong kênh "main đỏ do TV-113 của em, em đang revert". Không ai nhớ ai làm vỡ main; ai cũng nhớ ai để nó vỡ qua đêm.'}</p>

<h3>🎤 ${en ? 'What interviewers ask about this' : 'Phỏng vấn viên sẽ hỏi'}</h3>
<ul>
<li>${en ? '“How do you prove a test catches the bug?” — run it on the code before the fix (a worktree is enough) and read the failure: it must describe the bug. Our first TV-113 test failed with an NPE both before and after.' : '"Làm sao chứng minh test bắt được bug?" — chạy nó trên code trước khi sửa (một worktree là đủ) và đọc câu báo lỗi: nó phải mô tả bug. Test TV-113 đầu tiên của ta đỏ vì NPE cả trước lẫn sau.'}</li>
<li>${en ? '“How do you test a failure in the middle of two database operations?” — inject it in the real database (a trigger, a killed connection, Testcontainers pause), not with a mock.' : '"Test một lỗi xảy ra giữa hai thao tác CSDL thế nào?" — tiêm lỗi ở CSDL thật (trigger, cắt kết nối, tạm dừng container Testcontainers), không dùng mock.'}</li>
<li>${en ? '“Your PR is 219 lines and the limit is 200. What now?” — split by reviewable purpose: tests that describe today’s behaviour first, the refactoring second.' : '"PR của em 219 dòng mà giới hạn 200. Giờ sao?" — tách theo mục đích review: test mô tả hành vi hôm nay trước, refactor sau.'}</li>
<li>${en ? '“Why do you need a golden master if unit tests pass?” — TV-95: the form changed and no unit test looks at HTML.' : '"Test đơn vị xanh rồi cần golden master làm gì?" — TV-95: form đã đổi mà không test đơn vị nào nhìn HTML.'}</li>
</ul>

<h3>🗂 ${en ? 'Key terms' : 'Thuật ngữ trong bài'}</h3>
${thuatNgu(en, [
  ['HMAC', 'mã xác thực thông điệp có khoá', 'Hàm băm kết hợp một khoá bí mật: không có khoá thì không tính được, dù biết thuật toán.', 'A hash combined with a secret key: cannot be computed without the key, even knowing the algorithm.'],
  ['Fault injection', 'tiêm lỗi', 'Cố ý gây lỗi đúng chỗ (trigger, cắt mạng) để xem hệ thống xử lý ra sao.', 'Deliberately causing a failure at a chosen point to see how the system copes.'],
  ['Transaction', 'giao dịch', 'Nhóm thao tác CSDL hoặc cùng thành công (commit) hoặc cùng huỷ (rollback).', 'A group of database operations that all succeed (commit) or are all undone (rollback).'],
  ['Cherry-pick', 'nhặt commit', 'Áp lại một commit có sẵn từ nhánh khác lên nhánh hiện tại.', 'Re-applying an existing commit from another branch onto the current one.'],
  ['Git worktree', 'thư mục làm việc phụ', 'Thêm một thư mục checkout ở commit khác của cùng repo, không đụng nhánh đang làm.', 'An extra checkout of another commit of the same repo, without touching your current branch.'],
])}

<h3>📌 ${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'Every ticket: map, pin, change, prove — red before (for the right reason), green after, golden master and e2e at the end.' : 'Ticket nào cũng: vẽ bản đồ, khoá hành vi, thay đổi, chứng minh — đỏ trước (đúng lý do), xanh sau, golden master và e2e ở cuối.'}</li>
<li>${en ? 'Old branches can be cherry-picked; impact analysis finds the second repository; real databases reveal transaction bugs that mocks hide.' : 'Nhánh cũ có thể cherry-pick; phân tích ảnh hưởng tìm ra repo thứ hai; CSDL thật lộ ra lỗi giao dịch mà mock che mất.'}</li>
<li>${en ? 'Breaking your own rule is information: split the PR, record the finding, move on.' : 'Phạm luật của chính mình là một thông tin: tách PR, ghi lại phát hiện, đi tiếp.'}</li>
</ul>
${tl('https://www.theregister.com/2022/10/11/toyota_source_code_email_leak/', '🛡️', 'The Register — Toyota: 296,019 customer email addresses exposed via a key on GitHub (10/2022)', en ? 'Access key in a public repository for ~5 years' : 'Khoá truy cập nằm trong repo công khai ~5 năm')}
${tl('https://krebsonsecurity.com/2019/05/first-american-financial-corp-leaked-hundreds-of-millions-of-title-insurance-records/', '🛡️', 'KrebsOnSecurity — First American Financial leaked 885 million records (2019)', en ? 'Documents reachable by URL without authorisation' : 'Tài liệu mở được bằng URL không cần quyền')}
${tl('https://cwe.mitre.org/data/definitions/425.html', '🛡️', 'CWE-425 — Direct Request (Forced Browsing)', en ? 'What TV-111 is' : 'TV-111 là gì')}
`);

export default {
  title: 'Chapter 9 — Capstone: a maintenance sprint on an old Java web app|||Chương 9 — Dự án cuối khoá: một sprint bảo trì ứng dụng web Java cũ',
  lessons: [
    { title: '9.1 — The brief: handover pack, backlog of 8 tickets, rules|||9.1 — Đề bài: gói bàn giao, backlog 8 ticket, luật chơi', slug: 'lgc-9-1-de-bai', type: 'LESSON', isFreePreview: true, description: 'Gói bàn giao (repo ch8, ADR, Q&A list), backlog 8 ticket viết theo lời khách — 2 bảo mật, 3 lỗi, 1 tính năng ở hai repo, 1 refactor, nâng Java 21; phân tích ảnh hưởng chỉ đọc và ước lượng ba điểm trước khi nhận; luật chơi, thang chấm 100 điểm, bản thi có giờ 3 ticket kiểu PE.', content: L91 },
    { title: '9.2 — Doing the sprint: map, pin, change, prove|||9.2 — Thực hiện sprint: vẽ bản đồ, khoá hành vi, thay đổi, chứng minh', slug: 'lgc-9-2-thuc-hien', type: 'LESSON', isFreePreview: true, description: 'Nhật ký sprint làm thật: đỏ-trước bằng worktree, cherry-pick nhánh cũ bốn chương, HMAC thay bí mật viết cứng (Toyota 2022), JSP vào WEB-INF (First American 2019), tiêm lỗi bằng trigger MySQL cho giao dịch — và test đỏ sai lý do, golden master bắt thay đổi không test đơn vị nào thấy, PR 219 dòng phải tách.', content: L92 },
    { title: '9.3 — Handover: updated README, map, upgrade notes, known risks|||9.3 — Bàn giao: README mới, bản đồ, ghi chú nâng cấp, rủi ro còn lại', slug: 'lgc-9-3-ban-giao', type: 'LESSON', isFreePreview: true, description: 'Bốn tài liệu bàn giao: README (chạy, test, cấu hình, lỗi hay gặp), bản đồ Mermaid có chỗ nguy hiểm, NANG-CAP.md mốc Java 21, danh sách nợ kỹ thuật xếp theo mức hại có bằng chứng (phân quyền bị bỏ trống, xoá độc giả xoá phiếu); thử bằng bản clone sạch có bấm giờ; lời nhắn bàn giao sáu dòng.', content: L93 },
    { title: '9.4 — Interview questions on legacy code and refactoring|||9.4 — Câu hỏi phỏng vấn về code cũ và refactor', slug: 'lgc-9-4-phong-van', type: 'LESSON', isFreePreview: true, description: 'Mười bốn câu hỏi hay gặp (codebase lạ, code không test, refactor và viết lại, smell, nâng cấp, lỗ hổng ngoài phạm vi, PR bảo trì, ước lượng, test đỏ sai lý do) kèm ý chính và chỗ bằng chứng trong khoá; dự án cuối khoá thành câu chuyện STAR song ngữ; các cái bẫy phỏng vấn viên hay đặt.', content: L94 },
    { title: '9.5 — Final quiz and maintenance checklist|||9.5 — Kiểm tra tổng kết và checklist bảo trì', slug: 'lgc-9-5-tong-ket', type: 'QUIZ', isFreePreview: true, description: 'Hai mươi câu trộn cả khoá, câu nào cũng lấy từ một chuyện đã xảy ra trong lab; checklist 15 dòng "trước khi sửa code của người khác"; học tiếp gì sau khoá.', content: QUIZ_CONTENT, quiz: { timeLimitSeconds: 1800, questions: QUIZ9 } },
  ],
};
