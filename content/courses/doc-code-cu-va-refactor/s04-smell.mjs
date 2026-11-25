/**
 * Đọc code cũ và refactor — Chương 4: Code smell — gọi tên cái cảm giác "sai sai" (soạn 24/11/2026, agent rfc trên máy nhà Linux).
 * 4.1 smell trong hàm (Long Function đo bằng PMD: NCSS 111 / cyclomatic 20 / cognitive 36; tách vội ⇒ 7 tham số + gán lại tham số mà test
 *     vẫn 16/16 xanh; số ma thuật grep ra cả số "trùng nhầm"; comment như chất khử mùi; Mysterious Name) · 4.2 smell giữa lớp (God Servlet mà
 *     PMD GodClass KHÔNG bắt vì WMC 25 < 47; Data Class ⇔ Feature Envy; Data Clumps con/st/ps/rs; Primitive Obsession "18000.0" + chuỗi "SV";
 *     Insider Trading: route POST /api/muon ghi thẳng tệp ⇒ 2 yêu cầu song song làm HỎNG tệp JSON, cả API trả 500 — đo thật) ·
 *     4.3 smell khi thay đổi (CPD + jscpd, trùng lặp tri thức Java/SQL/JS cho 3 kết quả khác nhau, Shotgun Surgery cho ticket "thêm loại NCS",
 *     Divergent Change từ git log, Repeated Switches, kiểm tra đăng nhập chép tay ⇒ goto fail 2014) · 4.4 công cụ (PMD 7 qua Maven, ESLint 8
 *     trên Node 14, jscpd, IntelliJ/SonarLint, cyclomatic vs cognitive, chốt chặn --max-warnings, Toyota 2013, hotspot) · 4.5 lab báo cáo smell
 *     xếp theo rủi ro (diem-nong.py) · 4.6 quiz 12 câu.
 * Repo lab: legacy-thu-vien (nhánh ch4 thêm maven-pmd-plugin + tools/smell-pmd.xml, tools/do-phuc-tap.xml) và legacy-express (thêm routes/muon.js
 * "Lan 05/2019" — route mượn sách cho app; CỐ Ý có smell và lỗi ghi tệp đồng thời). Lời giải: lab/loi-giai/ch4/.
 * KHÔNG dạy lại: SOLID/GoF (Academy SWD392 ch4), phím refactor IntelliJ (ide-va-do-nghe-dev 2.3), SonarLint cài đặt (ide 2.5),
 * cyclomatic lý thuyết kiểu đề thi (Academy SWT301 3.4), nợ kỹ thuật tầm kiến trúc (software-architecture 11.4) — chỉ dẫn liên kết.
 */
import { java, xml, bash, js, out, giai, ml, lk, bai, thuatNgu, Q, MOI_TRUONG_3, ZIP_EXPRESS } from './_chung.mjs';

const moiTruong = (en) => `<p><em>${en ? 'Outputs run for real on:' : 'Output chạy thật trên:'} ${MOI_TRUONG_3} · PMD 7.7.0 (maven-pmd-plugin 3.26.0) · ESLint 8.57.1 · jscpd 3.5.10.</em></p>`;
const academy = (mon, slug) => `/academy/courses/${mon}/learn?lessonSlug=${slug}`;

/* ═══════════════════ 4.1 — Smell trong hàm ═══════════════════ */
const X41_PMD = xml(`
<!-- pom.xml — (1) thêm vào <properties>: bộ luật mặc định, đổi được bằng -Dpmd.boLuat=… -->
<pmd.boLuat>tools/smell-pmd.xml</pmd.boLuat>

<!-- (2) thêm vào <build><plugins>. PMD 7 vẫn chạy trên JDK 8 của dự án -->
<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-pmd-plugin</artifactId>
  <version>3.26.0</version>
  <configuration>
    <rulesets><ruleset>\${pmd.boLuat}</ruleset></rulesets>
    <targetJdk>1.8</targetJdk>
    <linkXRef>false</linkXRef>
    <printFailingErrors>true</printFailingErrors>
  </configuration>
</plugin>
`
);
const X41_LUAT = xml(`
<?xml version="1.0"?>
<!-- tools/smell-pmd.xml — chỉ các luật đo HÌNH DÁNG code (smell), không phải luật phong cách -->
<ruleset name="smell" xmlns="http://pmd.sourceforge.net/ruleset/2.0.0">
  <description>Long Function, Complex Function, Long Parameter List, God Class, Data Class, literal lặp</description>
  <rule ref="category/java/design.xml/NcssCount"/>
  <rule ref="category/java/design.xml/CyclomaticComplexity"/>
  <rule ref="category/java/design.xml/CognitiveComplexity"/>
  <rule ref="category/java/design.xml/ExcessiveParameterList">
    <properties><property name="minimum" value="6"/></properties>   <!-- mặc định PMD là 10 -->
  </rule>
  <rule ref="category/java/bestpractices.xml/AvoidReassigningParameters"/>
  <rule ref="category/java/design.xml/GodClass"/>
  <rule ref="category/java/design.xml/DataClass"/>
  <rule ref="category/java/design.xml/AvoidDeeplyNestedIfStmts"/>
  <rule ref="category/java/errorprone.xml/AvoidDuplicateLiterals"/>
</ruleset>
`
);
const O41_PMD = out(`
$ mvn -B pmd:check
[INFO] PMD version: 7.7.0
[WARNING] PMD Failure: com.thuvien.model.Book:3 Rule:DataClass Priority:3 The class 'Book' is suspected to be a Data Class (WOC=0.000%, NOPA=0, NOAM=12, WMC=12).
[WARNING] PMD Failure: com.thuvien.model.Loan:5 Rule:DataClass Priority:3 The class 'Loan' is suspected to be a Data Class (WOC=0.000%, NOPA=9, NOAM=0, WMC=0).
[WARNING] PMD Failure: com.thuvien.model.Reader:3 Rule:DataClass Priority:3 The class 'Reader' is suspected to be a Data Class (WOC=0.000%, NOPA=0, NOAM=8, WMC=8).
[WARNING] PMD Failure: com.thuvien.servlet.BookServlet:37 Rule:AvoidDuplicateLiterals Priority:3 The String literal "UTF-8" appears 9 times in this file; the first occurrence is on line 37.
[WARNING] PMD Failure: com.thuvien.servlet.BookServlet:73 Rule:NcssCount Priority:3 The method 'doPost(HttpServletRequest, HttpServletResponse)' has a NCSS line count of 111..
[WARNING] PMD Failure: com.thuvien.servlet.BookServlet:73 Rule:CognitiveComplexity Priority:3 The method 'doPost(HttpServletRequest, HttpServletResponse)' has a cognitive complexity of 36, current threshold is 15.
[WARNING] PMD Failure: com.thuvien.servlet.BookServlet:73 Rule:CyclomaticComplexity Priority:3 The method 'doPost(HttpServletRequest, HttpServletResponse)' has a cyclomatic complexity of 20..
[WARNING] PMD Failure: com.thuvien.servlet.BookServlet:92 Rule:AvoidDuplicateLiterals Priority:3 The String literal "books?msg=" appears 5 times in this file; the first occurrence is on line 92.
[WARNING] PMD Failure: com.thuvien.servlet.LoginServlet:22 Rule:AvoidDuplicateLiterals Priority:3 The String literal "remember" appears 4 times in this file; the first occurrence is on line 22.
[WARNING] PMD Failure: com.thuvien.servlet.LoginServlet:35 Rule:AvoidDeeplyNestedIfStmts Priority:3 Deeply nested if..then statements are hard to read.
[WARNING] PMD Failure: com.thuvien.servlet.LoginServlet:48 Rule:AvoidDuplicateLiterals Priority:3 The String literal "username" appears 4 times in this file; the first occurrence is on line 48.
[WARNING] PMD Failure: com.thuvien.util.Constants:3 Rule:DataClass Priority:3 The class 'Constants' is suspected to be a Data Class (WOC=0.000%, NOPA=4, NOAM=0, WMC=0).
[INFO] BUILD FAILURE
[ERROR] Failed to execute goal org.apache.maven.plugins:maven-pmd-plugin:3.26.0:check (default-cli) on project thuvien: PMD 7.7.0 has found 12 violations.
`
);
const C41_KHUNG = java(`
// BookServlet.doPost — 120 dòng, rút gọn còn khung xương (dòng 73–192)
protected void doPost(HttpServletRequest request, HttpServletResponse response) ... {
    // (1) kiểm tra đăng nhập                         — chép ở 5 hàm doGet/doPost
    // (2) mở kết nối, khai báo con/st/ps/rs
    if (action.equals("borrow")) {
        // (3) tìm độc giả bằng SQL nối chuỗi
        // (4) đếm sách đang mượn, chọn max theo loại   — if SV / GV / khác
        // (5) kiểm tra còn sách
        // (6) tính hạn trả theo loại                   — if SV / GV / khác (lần 2)
        // (7) INSERT phiếu, ghi log, redirect
    } else if (action.equals("return")) {
        // (8) đọc phiếu + loại độc giả
        // (9) tính số ngày trễ, tính phí theo loại     — if SV / GV / khác (lần 3)
        // (10) UPDATE phiếu, cộng lại số sách, redirect
    } else if (action.equals("add")) {
        // (11) INSERT sách bằng SQL nối chuỗi
    } else if (action.equals("delete")) {
        // (12) DELETE sách
    } else { /* (13) in HTML lỗi */ }
    // (14) catch: in e.getMessage() ra trang; finally: đóng tài nguyên
}
`
);
const C41_TACH = java(`
// Nhánh ch4-tach-voi: tách khối "borrow" ra hàm riêng theo cách nhanh nhất —
// mang theo MỌI biến cục bộ mà khối code đụng tới.
if (action.equals("borrow")) {
    muonSach(con, st, rs, ps, request.getParameter("readerId"), request.getParameter("bookId"), response);
} else if (action.equals("return")) {
...
private void muonSach(Connection con, Statement st, ResultSet rs, PreparedStatement ps,
                      String readerId, String bookId, HttpServletResponse response) throws Exception {
    st = con.createStatement();
    rs = st.executeQuery("SELECT * FROM readers WHERE id = " + readerId);
    ... (nguyên văn 45 dòng cũ)
}
`
);
const O41_TACH = out(`
$ mvn -B test
[INFO] Tests run: 13, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.971 s -- in com.thuvien.servlet.BookServletMuonSachTest
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.068 s -- in com.thuvien.servlet.ExportServletDacTaTest
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.011 s -- in com.thuvien.util.TokenUtilDacTaTest
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.003 s -- in com.thuvien.util.TokenUtilTest
[INFO] Tests run: 16, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
$ mvn -B pmd:check
[WARNING] PMD Failure: com.thuvien.servlet.BookServlet:73 Rule:NcssCount Priority:3 The method 'doPost(HttpServletRequest, HttpServletResponse)' has a NCSS line count of 65..
[WARNING] PMD Failure: com.thuvien.servlet.BookServlet:73 Rule:CognitiveComplexity Priority:3 The method 'doPost(HttpServletRequest, HttpServletResponse)' has a cognitive complexity of 22, current threshold is 15.
[WARNING] PMD Failure: com.thuvien.servlet.BookServlet:73 Rule:CyclomaticComplexity Priority:3 The method 'doPost(HttpServletRequest, HttpServletResponse)' has a cyclomatic complexity of 13..
[WARNING] PMD Failure: com.thuvien.servlet.BookServlet:146 Rule:ExcessiveParameterList Priority:3 Avoid long parameter lists..
[WARNING] PMD Failure: com.thuvien.servlet.BookServlet:148 Rule:AvoidReassigningParameters Priority:2 Avoid reassigning parameters such as 'st'.
[WARNING] PMD Failure: com.thuvien.servlet.BookServlet:149 Rule:AvoidReassigningParameters Priority:2 Avoid reassigning parameters such as 'rs'.
[WARNING] PMD Failure: com.thuvien.servlet.BookServlet:188 Rule:AvoidReassigningParameters Priority:2 Avoid reassigning parameters such as 'ps'.
[ERROR] ... PMD 7.7.0 has found 16 violations.
`
);
const J41_MUON = js(`
// routes/muon.js — POST /api/muon (Lan, 05/2019). Rút gọn phần đầu và phần ghi tệp.
function taoPhieu(dsPhieu, docGiaId, tenSach, loai, ngayMuon, soNgay, nguoiTao, ghiChu) {
  var id = 0;
  for (var i = 0; i < dsPhieu.length; i++) if (dsPhieu[i].id > id) id = dsPhieu[i].id;
  return { id: id + 1, sach: tenSach, docGia: docGiaId,
    hanTra: moment(ngayMuon).add(soNgay, 'days').format(), ngayTra: null, nguoiTao: nguoiTao, ghiChu: ghiChu };
}

router.post('/', function (req, res) {
  ...
  kho.doc('doc-gia', function (err, dsDocGia) {
    ...
    kho.doc('phieu', function (err2, dsPhieu) {
      if (err2) return res.status(500).send('loi doc du lieu');
      var dangMuon = 0;
      for (var i = 0; i < dsPhieu.length; i++) {
        if (dsPhieu[i].docGia == dg.id && !dsPhieu[i].ngayTra) dangMuon++;
      }
      var toiDa;
      var soNgay;
      if (dg.loai == 'SV') {
        toiDa = 3; soNgay = 14;
      } else if (dg.loai == 'GV') {
        toiDa = 10; soNgay = 30;
      } else {
        toiDa = 1; soNgay = 7;
      }
      if (dangMuon >= toiDa) {
        return res.status(409).json({ loi: 'vuot qua so sach duoc muon', dangMuon: dangMuon, toiDa: toiDa });
      }
      // thu thu yeu cau 2019: dang co sach qua han thi khong cho muon them (tru GV)
      for (var j = 0; j < dsPhieu.length; j++) {
        if (dsPhieu[j].docGia == dg.id && !dsPhieu[j].ngayTra) {
          if (moment().diff(moment(dsPhieu[j].hanTra), 'days', true) > 0) {
            if (dg.loai != 'GV') {
              return res.status(409).json({ loi: 'dang co sach qua han', phieu: dsPhieu[j].id });
            }
          }
        }
      }
      var p = taoPhieu(dsPhieu, dg.id, tenSach, dg.loai, new Date(), soNgay, 'mobile', req.body.ghiChu || '');
      ... ghi tệp, trả 201
`
);
const O41_CURL = out(`
$ date '+%H:%M %d/%m/%Y'
03:57 24/11/2026
$ curl -s -X POST localhost:3000/api/muon -H 'Content-Type: application/json' -d '{"docGia":1,"sach":"Refactoring"}'
{"loi":"dang co sach qua han","phieu":1}  [409]
$ curl -s -X POST localhost:3000/api/muon -H 'Content-Type: application/json' -d '{"docGia":2,"sach":"Refactoring"}'
{"phieu":6,"hanTra":"08/12/2026","phi":0}  [201]
$ curl -s -X POST localhost:3000/api/muon -H 'Content-Type: application/json' -d '{"docGia":4,"sach":"Refactoring"}'
{"loi":"vuot qua so sach duoc muon","dangMuon":1,"toiDa":1}  [409]
$ curl -s -X POST localhost:3000/api/muon -H 'Content-Type: application/json' -d '{"docGia":3,"sach":"Refactoring"}'
{"phieu":7,"hanTra":"24/12/2026","phi":0}  [201]
`
);
const O41_ESLINT = out(`
$ npx eslint routes/muon.js        # .eslintrc.json: max-params 4, max-lines-per-function 30, complexity 10, max-nested-callbacks 2
/app/routes/muon.js
  11:1    warning  Function 'taoPhieu' has too many parameters (8). Maximum allowed is 4  max-params
  11:47   warning  'loai' is defined but never used                                       no-unused-vars
  21:18   warning  Function has too many lines (44). Maximum allowed is 30                max-lines-per-function
  25:22   warning  Function has too many lines (39). Maximum allowed is 30                max-lines-per-function
  27:30   warning  Too many nested callbacks (3). Maximum allowed is 2                    max-nested-callbacks
  29:22   warning  Function has too many lines (34). Maximum allowed is 30                max-lines-per-function
  29:22   warning  Too many nested callbacks (3). Maximum allowed is 2                    max-nested-callbacks
  29:22   warning  Function has a complexity of 14. Maximum allowed is 10                 complexity
  38:17   warning  No magic number: 3                                                     no-magic-numbers
  38:29   warning  No magic number: 14                                                    no-magic-numbers
  40:17   warning  No magic number: 10                                                    no-magic-numbers
  40:30   warning  No magic number: 30                                                    no-magic-numbers
  42:29   warning  No magic number: 7                                                     no-magic-numbers
  59:104  warning  Too many nested callbacks (4). Maximum allowed is 2                    max-nested-callbacks
  ... (cùng tệp còn 15 cảnh báo: 6 eqeqeq, 9 số ma thuật cho mã HTTP và độ thụt JSON — xem 4.4)
`
);
const O41_GREP = out(`
$ grep -rnwE "2000|50000|14|30" legacy-thu-vien/src/main/java legacy-thu-vien/db legacy-express/lib legacy-express/routes
legacy-thu-vien/db/thuvien.sql:101: (4,3,4,NOW() - INTERVAL 30 DAY,NOW() - INTERVAL 23 DAY,NULL,0),
legacy-thu-vien/db/thuvien.sql:123:         DATEDIFF(NOW(), l.due_date) * 2000 AS est_fine
legacy-express/lib/phi.js:10:    phi = tre * 2000;
legacy-express/lib/phi.js:11:    if (phi > 50000) phi = 50000;
legacy-thu-vien/src/main/java/com/thuvien/servlet/BookServlet.java:123:                    cal.add(Calendar.DATE, 14);
legacy-thu-vien/src/main/java/com/thuvien/servlet/BookServlet.java:125:                    cal.add(Calendar.DATE, 30);
legacy-thu-vien/src/main/java/com/thuvien/servlet/BookServlet.java:154:                        fine = days * 2000;
legacy-thu-vien/src/main/java/com/thuvien/servlet/BookServlet.java:155:                        if (fine > 50000) fine = 50000;
legacy-express/routes/muon.js:38:        toiDa = 3; soNgay = 14;
legacy-express/routes/muon.js:40:        toiDa = 10; soNgay = 30;
legacy-thu-vien/src/main/java/com/thuvien/servlet/LoginServlet.java:62:                    c.setMaxAge(60 * 60 * 24 * 30);
`
);
const C41_COMMENT = java(`
// Trước: comment giải thích khối code — đọc comment rồi vẫn phải đọc 20 dòng bên dưới
if (StringUtils.isNotBlank(q)) {
    // tim theo ten hoac tac gia
    Connection con = null; Statement st = null; ResultSet rs = null;
    ... 20 dòng ...
}

// Sau (Chương 5): tên hàm thay cho comment — comment biến mất vì không còn gì để giải thích
List<Book> books = StringUtils.isNotBlank(q) ? timTheoTenHoacTacGia(q) : new BookDAO().findAll();
`
);

const L41 = ml((en) => `
<span class="eyebrow">${en ? 'Chapter 4 · Code smells: naming what feels wrong' : 'Chương 4 · Code smell: gọi tên cái cảm giác "sai sai"'}</span>
<h2>${en ? '4.1 — Smells inside functions: Long Function, Long Parameter List, Magic Numbers' : '4.1 — Smell trong hàm: hàm dài, nhiều tham số, số ma thuật'}</h2>
<p class="lead">${en
  ? 'You open the fridge and something smells off. You do not know yet which box it is, and the smell is not the problem itself — but it tells you where to look. A code smell is exactly that: a surface sign that <em>usually</em> points to a deeper problem. This chapter gives the smells their names, so that “this feels wrong” becomes “doPost is a Long Function with three Repeated Switches” — a sentence your team can act on.'
  : 'Mở tủ lạnh thấy có mùi lạ. Bạn chưa biết hộp nào hỏng, và cái mùi chưa phải là vấn đề — nhưng nó chỉ cho bạn chỗ cần nhìn. Code smell đúng là như vậy: một dấu hiệu bề mặt <em>thường</em> chỉ tới một vấn đề sâu hơn. Chương này đặt tên cho các mùi, để câu "thấy sai sai" trở thành "doPost là một Long Function có ba Repeated Switches" — câu mà cả đội hành động được.'}</p>
${moiTruong(en)}

<h3>${en ? 'Where the word comes from — and what a smell is not' : 'Chữ "smell" từ đâu ra — và smell KHÔNG phải là gì'}</h3>
<p>${en
  ? 'Kent Beck coined “code smell” in the late 1990s while helping Martin Fowler write <em>Refactoring</em> (1999). Chapter 3 of that book, “Bad Smells in Code”, written by Beck and Fowler, is the catalogue everyone still quotes; the 2nd edition (2018, examples in JavaScript) lists 24 smells. Fowler’s own definition on his bliki: <strong>a smell is a surface indication that usually corresponds to a deeper problem in the system</strong>. Three consequences matter for maintenance work:'
  : 'Kent Beck đặt ra chữ "code smell" cuối thập niên 1990 khi giúp Martin Fowler viết <em>Refactoring</em> (1999). Chương 3 của sách, "Bad Smells in Code", do Beck và Fowler cùng viết, là danh mục mà ai cũng trích tới giờ; bản 2 (2018, ví dụ bằng JavaScript) có 24 smell. Định nghĩa của chính Fowler trên blog: <strong>smell là dấu hiệu bề mặt, thường ứng với một vấn đề sâu hơn trong hệ thống</strong>. Với việc bảo trì, có ba hệ quả quan trọng:'}</p>
<ul>
<li>${en ? '<strong>A smell is not a bug.</strong> doPost works; 16 tests from Chapter 3 prove it. The smell says the next change will be expensive and risky.' : '<strong>Smell không phải bug.</strong> doPost chạy đúng; 16 test ở Chương 3 chứng minh điều đó. Smell nói rằng lần sửa tới sẽ tốn kém và dễ hỏng.'}</li>
<li>${en ? '<strong>A smell is a hint, not a verdict.</strong> A 40-line function that maps 40 columns may be perfectly fine. You judge in context.' : '<strong>Smell là gợi ý, không phải bản án.</strong> Một hàm 40 dòng chỉ để ánh xạ 40 cột có thể hoàn toàn ổn. Bạn phán xét theo ngữ cảnh.'}</li>
<li>${en ? '<strong>Every smell has a refactoring that removes it.</strong> That is the point of naming it: Long Function → Extract Function, Magic Number → Replace with Symbolic Constant. Chapter 5 does the moves; this chapter only diagnoses.' : '<strong>Mỗi smell có một refactoring khử nó.</strong> Đặt tên chính là để biết dùng thuốc gì: Long Function → Extract Function, số ma thuật → Replace Magic Literal. Chương 5 làm các bước đó; chương này chỉ chẩn đoán.'}</li>
</ul>
<div class="callout"><p>${en
  ? '<strong>Why a shared vocabulary matters in outsourcing.</strong> On a project with a Japanese or European customer, your code review comment will be read by people who do not speak Vietnamese and did not write the code. “Feature Envy: <code>tinhPhi</code> only reads fields of <code>Loan</code> — move it there?” is understood in five seconds anywhere in the world. “This looks messy” starts an argument.'
  : '<strong>Vì sao cần chung một bộ từ vựng khi làm outsourcing.</strong> Ở dự án khách Nhật hay châu Âu, bình luận review của bạn sẽ được đọc bởi người không nói tiếng Việt và không viết đoạn code đó. "Feature Envy: <code>tinhPhi</code> chỉ đọc trường của <code>Loan</code> — chuyển vào đó nhé?" ai cũng hiểu trong năm giây. "Chỗ này trông lộn xộn" thì mở màn một cuộc cãi nhau.'}</p></div>
<p>${en
  ? 'SOLID and design patterns explain <em>why</em> some shapes are better — that theory is in Academy SWD392 (the SOLID appendix lesson) and is not repeated here. This chapter is the practitioner’s side: recognising the smell in someone else’s 2016 code, measuring it, and writing it down.'
  : 'SOLID và design pattern giải thích <em>vì sao</em> có hình dáng code tốt hơn — lý thuyết đó nằm ở Academy SWD392 (bài phụ lục SOLID), không dạy lại ở đây. Chương này là phía người làm nghề: nhận ra smell trong code năm 2016 của người khác, đo nó, và ghi nó lại.'}</p>
${lk(academy('software-architecture-and-design', 'swd392-slide-swd15-1'), '🎓', en ? 'Academy SWD392 — SOLID: five principles behind the patterns' : 'Academy SWD392 — SOLID: năm nguyên lý đứng sau các pattern', en ? 'Read if “Single Responsibility” is still fuzzy' : 'Đọc nếu "Single Responsibility" còn mơ hồ')}

<h3>${en ? 'Measure first: put a smell detector in the old POM' : 'Đo trước đã: gắn máy ngửi smell vào POM cũ'}</h3>
<p>${en
  ? '“Long” is an opinion until you count. PMD is a free static analyser for Java (since 2002) whose <em>design</em> rules measure exactly the shapes Fowler describes. It runs from Maven, so it needs nothing installed — and version 7 still runs on the project’s JDK 8. Add the plugin (the complete solution POM is in <code>lab/loi-giai/ch4/</code>):'
  : '"Dài" vẫn là cảm tính cho tới khi bạn đếm. PMD là công cụ phân tích tĩnh miễn phí cho Java (có từ 2002), nhóm luật <em>design</em> của nó đo đúng những hình dáng mà Fowler mô tả. Nó chạy từ Maven nên không phải cài gì — và bản 7 vẫn chạy trên JDK 8 của dự án. Thêm plugin (POM lời giải đầy đủ ở <code>lab/loi-giai/ch4/</code>):'}</p>
${X41_PMD}
<p>${en ? 'and a ruleset containing only shape rules — not the hundreds of style rules that would drown the signal:' : 'cùng một bộ luật chỉ chứa luật đo hình dáng — không phải hàng trăm luật phong cách làm chìm mất tín hiệu:'}</p>
${X41_LUAT}
${O41_PMD}
<p>${en
  ? 'Twelve findings in 1.5 seconds. Three lines are about the same method, and they are the subject of this lesson. <code>doPost</code> has:'
  : 'Mười hai phát hiện trong 1,5 giây. Ba dòng nói về cùng một hàm, và chúng là chủ đề của bài này. <code>doPost</code> có:'}</p>
<ul>
<li>${en ? '<strong>NCSS 111</strong> — Non-Commenting Source Statements: statements, not lines, so blank lines and comments do not count. The PMD default threshold for a method is 60.' : '<strong>NCSS 111</strong> — Non-Commenting Source Statements: đếm câu lệnh chứ không đếm dòng, nên dòng trống và comment không tính. Ngưỡng mặc định của PMD cho một hàm là 60.'}</li>
<li>${en ? '<strong>Cyclomatic complexity 20</strong> — the number of independent paths through the code (McCabe, 1976). McCabe suggested 10 as the limit. Practically: 20 paths means at least 20 test cases to touch every branch once.' : '<strong>Cyclomatic complexity 20</strong> — số đường đi độc lập qua code (McCabe, 1976). McCabe đề nghị giới hạn 10. Nói cho thực tế: 20 đường nghĩa là cần ít nhất 20 ca test để đi qua mọi nhánh một lần.'}</li>
<li>${en ? '<strong>Cognitive complexity 36</strong> — how hard it is for a <em>human</em> to follow (SonarSource, 2017): nesting is penalised more than sequence. Threshold 15. Lesson 4.4 compares the two numbers.' : '<strong>Cognitive complexity 36</strong> — độ khó để một <em>con người</em> theo dõi (SonarSource, 2017): lồng nhau bị phạt nặng hơn nối tiếp. Ngưỡng 15. Bài 4.4 so hai con số này.'}</li>
</ul>

<h3>${en ? 'Smell 1 — Long Function: what is really inside doPost' : 'Smell 1 — Long Function (hàm dài): bên trong doPost thật sự có gì'}</h3>
<p>${en
  ? 'Numbers tell you <em>that</em> it is long; reading tells you <em>why</em> it matters. Collapse doPost to a skeleton, one comment per job it does:'
  : 'Con số cho biết nó <em>có</em> dài; đọc mới cho biết <em>vì sao</em> điều đó quan trọng. Thu doPost lại thành bộ xương, mỗi việc nó làm là một dòng comment:'}</p>
${C41_KHUNG}
<p>${en
  ? 'Fourteen jobs in one function. Fowler’s test for Long Function is not a line count: <strong>whenever you feel the need to comment a block, that block wants to be a function named after the comment</strong>. Each numbered comment above is a function waiting to be extracted. The real cost shows in maintenance: to change the fine rule (step 9) you scroll past the borrow logic, share variables <code>st</code>/<code>rs</code> with it, and your diff lands in the same 120-line method that three other tickets touched (lesson 4.3 counts them).'
  : 'Mười bốn việc trong một hàm. Phép thử của Fowler cho Long Function không phải là đếm dòng: <strong>hễ bạn thấy cần viết comment cho một khối, khối đó muốn trở thành một hàm mang tên của comment</strong>. Mỗi comment đánh số ở trên là một hàm đang chờ được tách. Cái giá thật lộ ra khi bảo trì: muốn đổi luật tính phí (bước 9), bạn phải cuộn qua logic mượn, dùng chung biến <code>st</code>/<code>rs</code> với nó, và diff của bạn rơi vào đúng hàm 120 dòng mà ba ticket khác cũng đã đụng (bài 4.3 sẽ đếm).'}</p>
<p>${en
  ? 'Daily-life analogy: a single Zalo message of 40 lines containing the meeting time, the budget, a complaint and a birthday wish. Everyone answers only the first point. Long functions get reviewed the same way — reviewers read the top and skim the rest, which is exactly where the string-concatenated INSERT of the “add book” branch sits, on line 172.'
  : 'Liên tưởng đời thường: một tin nhắn Zalo 40 dòng gồm giờ họp, ngân sách, một lời phàn nàn và lời chúc sinh nhật. Ai cũng chỉ trả lời ý đầu. Hàm dài cũng bị review y như vậy — người review đọc đoạn đầu rồi lướt phần còn lại, và đó đúng là chỗ câu INSERT nối chuỗi của nhánh "thêm sách" đang nằm, ở dòng 172.'}</p>

<h3>${en ? 'Smell 2 — Long Parameter List: born from a hasty extraction' : 'Smell 2 — Long Parameter List (nhiều tham số): sinh ra từ một lần tách vội'}</h3>
<p>${en
  ? 'The old Java code has no long parameter list yet — but watch how one is born. A teammate “fixes” the Long Function in five minutes by cutting the borrow block into its own method and passing every local variable it touches (branch <code>ch4-tach-voi</code> in the lab):'
  : 'Code Java cũ chưa có hàm nhiều tham số — nhưng hãy xem một hàm như thế ra đời thế nào. Một đồng đội "sửa" Long Function trong năm phút bằng cách cắt khối mượn sách ra hàm riêng và truyền vào mọi biến cục bộ mà khối đó đụng tới (nhánh <code>ch4-tach-voi</code> trong lab):'}</p>
${C41_TACH}
${O41_TACH}
<p>${en
  ? 'This output is the whole lesson in miniature. <strong>Behaviour preserved</strong>: 16 tests, all green — the Chapter 3 net did its job. <strong>Numbers improved</strong>: doPost went from NCSS 111 / cyclomatic 20 / cognitive 36 to 65 / 13 / 22. <strong>But the smell moved instead of disappearing</strong>: a 7-parameter method, and three parameters that are immediately overwritten. Those three (<code>st</code>, <code>rs</code>, <code>ps</code>) are useless — Java passes a copy of the reference, so assigning a new statement inside <code>muonSach</code> never reaches the caller. The real fix is to declare them inside the new method. And four of the seven (<code>con, st, rs, ps</code>) always travel together: that is a <em>Data Clump</em>, lesson 4.2.'
  : 'Output này là cả bài học thu nhỏ. <strong>Hành vi được giữ</strong>: 16 test, xanh hết — tấm lưới Chương 3 làm đúng việc. <strong>Con số đẹp hơn</strong>: doPost từ NCSS 111 / cyclomatic 20 / cognitive 36 xuống 65 / 13 / 22. <strong>Nhưng smell chỉ dời chỗ chứ không mất</strong>: một hàm 7 tham số, và ba tham số bị ghi đè ngay lập tức. Ba tham số đó (<code>st</code>, <code>rs</code>, <code>ps</code>) vô dụng — Java truyền bản sao của tham chiếu, nên gán statement mới bên trong <code>muonSach</code> không bao giờ tới được hàm gọi. Cách đúng là khai báo chúng bên trong hàm mới. Còn bốn trong bảy (<code>con, st, rs, ps</code>) luôn đi cùng nhau: đó là một <em>Data Clump</em>, bài 4.2.'}</p>
<div class="callout warn"><p>${en
  ? '<strong>Thresholds differ between tools.</strong> PMD’s default for ExcessiveParameterList is 10 (we lowered it to 6); Sonar’s rule java:S107 defaults to 7; ESLint’s <code>max-params</code> defaults to 3. Fowler gives no number. Agree on one value per project and write it in the README — do not argue about it in every PR.'
  : '<strong>Mỗi công cụ một ngưỡng.</strong> Ngưỡng mặc định của PMD ExcessiveParameterList là 10 (ta hạ xuống 6); luật java:S107 của Sonar mặc định 7; <code>max-params</code> của ESLint mặc định 3. Fowler không đưa con số nào. Thống nhất một giá trị cho dự án và ghi vào README — đừng tranh cãi lại ở mỗi PR.'}</p></div>
<p>${en
  ? `On the Node side, the long parameter list already exists. The lab’s <code>legacy-express</code> (<a href="${ZIP_EXPRESS}">download</a>) got a new route in 2019: <code>POST /api/muon</code>, borrowing from the mobile app. Its helper takes eight arguments:`
  : `Phía Node thì hàm nhiều tham số có sẵn rồi. Repo <code>legacy-express</code> của lab (<a href="${ZIP_EXPRESS}">tải về</a>) được thêm một route năm 2019: <code>POST /api/muon</code>, mượn sách từ app di động. Hàm phụ của nó nhận tám đối số:`}</p>
${J41_MUON}
<p>${en ? 'Before judging, characterise it (Chapter 3 habit) — on a copy of the data, because this route writes a file:' : 'Trước khi phán xét, đặc tả nó trước (thói quen Chương 3) — trên bản sao dữ liệu, vì route này ghi tệp:'}</p>
${O41_CURL}
<p>${en
  ? 'Two surprises worth a ticket each. Reader 1 (a student with 1 book) is refused because one of her loans is overdue — a rule that exists only in Node; the Java web lets her borrow. And reader 4 (a guest, limit 1) is refused at 1 book because Node uses <code>&gt;=</code>, while Java’s <code>&gt;</code> lets a guest hold 2 (bug TV-41 from Chapter 3). Same library, two different rule books.'
  : 'Hai bất ngờ, mỗi cái đáng một ticket. Độc giả 1 (sinh viên đang giữ 1 cuốn) bị từ chối vì có phiếu quá hạn — luật này chỉ có ở Node; web Java vẫn cho mượn. Còn độc giả 4 (khách, tối đa 1) bị chặn khi đang giữ 1 cuốn vì Node dùng <code>&gt;=</code>, trong khi <code>&gt;</code> của Java cho khách giữ tới 2 (bug TV-41 ở Chương 3). Cùng một thư viện, hai cuốn luật khác nhau.'}</p>
${O41_ESLINT}
<p>${en
  ? 'ESLint confirms with numbers what your eyes felt: eight parameters, one of them (<code>loai</code>) never used — a parameter list so long that nobody noticed a dead one. Call sites are where it hurts: <code>taoPhieu(dsPhieu, dg.id, tenSach, dg.loai, new Date(), soNgay, \'mobile\', req.body.ghiChu || \'\')</code> — swap <code>soNgay</code> and <code>\'mobile\'</code> and JavaScript will not complain. The usual cures: <em>Introduce Parameter Object</em>, <em>Preserve Whole Object</em> (pass <code>dg</code> rather than <code>dg.id</code> and <code>dg.loai</code>), <em>Remove Parameter</em> — all in Chapter 5.'
  : 'ESLint xác nhận bằng con số điều mắt bạn đã cảm thấy: tám tham số, trong đó một cái (<code>loai</code>) không bao giờ dùng — danh sách dài tới mức không ai để ý một tham số chết. Chỗ đau là nơi gọi hàm: <code>taoPhieu(dsPhieu, dg.id, tenSach, dg.loai, new Date(), soNgay, \'mobile\', req.body.ghiChu || \'\')</code> — đổi chỗ <code>soNgay</code> với <code>\'mobile\'</code> thì JavaScript cũng không kêu một tiếng. Thuốc thường dùng: <em>Introduce Parameter Object</em>, <em>Preserve Whole Object</em> (truyền <code>dg</code> thay vì <code>dg.id</code> và <code>dg.loai</code>), <em>Remove Parameter</em> — đều ở Chương 5.'}</p>

<h3>${en ? 'Smell 3 — Magic numbers: 2000 means a fine, 30 means three things' : 'Smell 3 — Số ma thuật: 2000 là tiền phạt, còn 30 mang ba nghĩa'}</h3>
<p>${en
  ? 'A magic number is a literal whose meaning lives only in the author’s head. Fowler’s 2nd edition calls the cure <em>Replace Magic Literal</em>. The smell is worst when the same knowledge is spread over two repos. Try to find every place that knows the fine rate and the due-date lengths:'
  : 'Số ma thuật là một hằng số mà ý nghĩa của nó chỉ nằm trong đầu người viết. Bản 2 sách Fowler gọi thuốc chữa là <em>Replace Magic Literal</em>. Smell này tệ nhất khi cùng một tri thức rải trên hai repo. Thử tìm mọi chỗ biết mức phạt và số ngày mượn:'}</p>
${O41_GREP}
<p>${en
  ? 'Eleven hits, and you must read every one. <code>INTERVAL 30 DAY</code> in the dump and <code>setMaxAge(60 * 60 * 24 * 30)</code> (a 30-day cookie) have <em>nothing</em> to do with the 30-day loan for lecturers — but grep cannot tell. Meanwhile <code>max = 3</code> at BookServlet line 103 never appears, because “3” is too common to grep at all. A named constant <code>SO_NGAY_MUON_GV = 30</code> would make the search exact: one definition, Find Usages, done. That is the real value of naming a number — not beauty, <strong>searchability</strong>, which is what impact analysis needs (Chapter 8).'
  : 'Mười một kết quả, và bạn phải đọc từng cái. <code>INTERVAL 30 DAY</code> trong dump và <code>setMaxAge(60 * 60 * 24 * 30)</code> (cookie 30 ngày) <em>chẳng liên quan gì</em> tới hạn mượn 30 ngày của giảng viên — nhưng grep không phân biệt được. Trong khi đó <code>max = 3</code> ở BookServlet dòng 103 không hiện ra, vì số "3" quá phổ biến để grep. Một hằng có tên <code>SO_NGAY_MUON_GV = 30</code> sẽ làm việc tìm kiếm chính xác: một định nghĩa, Find Usages, xong. Đó là giá trị thật của việc đặt tên cho một con số — không phải cho đẹp, mà để <strong>tìm được</strong>, thứ mà phân tích ảnh hưởng (impact analysis, Chương 8) cần.'}</p>
<p>${en
  ? 'Not every literal is magic. <code>0</code>, <code>1</code>, an HTTP status like <code>404</code> inside <code>res.status(404)</code>, or <code>"UTF-8"</code> mean exactly what they say. Lesson 4.4 tunes ESLint so it stops flagging those — otherwise people learn to ignore the tool.'
  : 'Không phải hằng số nào cũng là "ma thuật". <code>0</code>, <code>1</code>, mã HTTP như <code>404</code> trong <code>res.status(404)</code>, hay <code>"UTF-8"</code> nói đúng điều nó nói. Bài 4.4 chỉnh ESLint để thôi báo những chỗ đó — nếu không, mọi người sẽ quen tay bỏ qua công cụ.'}</p>

<h3>${en ? 'Two more smells you meet in every old function' : 'Thêm hai smell gặp trong mọi hàm cũ'}</h3>
<p>${en
  ? '<strong>Comments (as deodorant).</strong> Fowler: comments are not bad, but they are often used to cover a bad smell. <code>// tim theo ten hoac tac gia</code> on line 41 explains a 20-line block — the block wants a name. <code>// khong ai dung</code> next to <code>PAGE_SIZE</code> and <code>// may cua anh Tuan</code> next to <code>EXPORT_DIR</code> are different: they are honest warnings (dead code, environment-specific path) that belong in a ticket, then Chapter 6 deletes them. Keep comments that say <em>why</em> (the TV-52 cap of 50,000 “by request of the student office”); turn comments that say <em>what</em> into names.'
  : '<strong>Comments (làm chất khử mùi).</strong> Fowler: comment không xấu, nhưng nó hay được dùng để che một mùi khác. <code>// tim theo ten hoac tac gia</code> ở dòng 41 giải thích một khối 20 dòng — khối đó muốn có tên. Còn <code>// khong ai dung</code> cạnh <code>PAGE_SIZE</code> và <code>// may cua anh Tuan</code> cạnh <code>EXPORT_DIR</code> thì khác: đó là lời cảnh báo thật thà (code chết, đường dẫn phụ thuộc máy) đáng thành ticket, rồi Chương 6 xoá. Giữ comment nói <em>vì sao</em> (trần 50.000 của TV-52 "theo ý kiến phòng CTSV"); biến comment nói <em>cái gì</em> thành tên.'}</p>
${C41_COMMENT}
<p>${en
  ? '<strong>Mysterious Name</strong> — the first smell in the 2nd edition’s list. <code>q</code>, <code>st</code>, <code>rs</code>, <code>f</code> (a date formatter in readers.jsp), <code>dg</code>, <code>p</code>. Short names are fine in a 3-line scope; in a 120-line method, <code>rs</code> is reused for four different queries, so “what is in <code>rs</code> at line 117?” needs a careful read. Rename is the cheapest, safest refactoring there is (IDE: <code>Shift+F6</code> / <code>F2</code>) — and in a legacy codebase, also the one you should do <em>last</em> in a shared file, because it touches many lines and creates merge conflicts for teammates.'
  : '<strong>Mysterious Name</strong> (tên bí ẩn) — smell đầu tiên trong danh sách bản 2. <code>q</code>, <code>st</code>, <code>rs</code>, <code>f</code> (bộ định dạng ngày trong readers.jsp), <code>dg</code>, <code>p</code>. Tên ngắn không sao trong phạm vi 3 dòng; trong một hàm 120 dòng, <code>rs</code> được dùng lại cho bốn câu truy vấn khác nhau, nên câu hỏi "ở dòng 117 thì <code>rs</code> đang chứa gì?" cần đọc rất kỹ. Đổi tên là refactoring rẻ và an toàn nhất (IDE: <code>Shift+F6</code> / <code>F2</code>) — và trong code cũ, cũng là việc nên làm <em>sau cùng</em> trên một tệp dùng chung, vì nó đụng nhiều dòng và gây xung đột merge cho đồng đội.'}</p>

<h3>🕵️ ${en ? 'Hacker’s corner — the magic string that was a password' : 'Góc hacker — chuỗi ma thuật hoá ra là mật khẩu'}</h3>
<p>${en
  ? 'Among the magic literals in the lab is <code>"thuvien2016"</code> in <code>TokenUtil</code> — not a business number but a <strong>secret</strong>. Chapter 3 showed that anyone who reads it can forge an admin cookie. A literal that is a secret is the most dangerous magic literal of all: it gets copied into every clone, every fork, every zip sent to an outsourcing partner. In 2016 attackers got into a private GitHub repository used by Uber engineers, found an AWS access key written in the code, and downloaded data on 57 million riders and drivers from S3 (US FTC complaint, 2018). Sonar flags this pattern as java:S2068 / “hard-coded credentials”, CWE-798. What you can do as a maintainer: when your smell scan finds a literal that looks like a password, key or token, <strong>stop and report it privately</strong> to your leader — do not paste it into a ticket, a chat or a PR description; the fix (move it to configuration, rotate it) is in Chapter 6.3.'
  : 'Trong số hằng "ma thuật" của lab có <code>"thuvien2016"</code> trong <code>TokenUtil</code> — không phải con số nghiệp vụ mà là một <strong>bí mật</strong>. Chương 3 đã cho thấy ai đọc được nó là giả được cookie admin. Hằng số là bí mật là loại số ma thuật nguy hiểm nhất: nó bị chép theo mọi bản clone, mọi fork, mọi tệp zip gửi cho đối tác outsourcing. Năm 2016, kẻ tấn công vào được một repo GitHub riêng mà kỹ sư Uber dùng, tìm thấy khoá truy cập AWS viết thẳng trong code, rồi tải dữ liệu của 57 triệu khách và tài xế từ S3 (đơn khiếu nại của FTC Mỹ, 2018). Sonar bắt mẫu này bằng luật java:S2068 / "hard-coded credentials", CWE-798. Việc bạn làm được khi bảo trì: khi quét smell gặp một hằng trông như mật khẩu, khoá hay token, <strong>dừng lại và báo riêng</strong> cho leader — đừng dán nó vào ticket, chat hay mô tả PR; cách sửa (chuyển ra cấu hình, đổi khoá) ở bài 6.3.'}</p>

<h3>💼 ${en ? 'OJT situation' : 'Tình huống OJT'}</h3>
<p>${en
  ? 'Week two. Your mentor asks you to review a teammate’s PR “refactor BookServlet: tách hàm muonSach”. The tests are green. The polite, useful review is not “LGTM” and not “this is still bad”; it is three facts: “(1) 16/16 tests green, behaviour preserved ✔ (2) <code>st</code>, <code>rs</code>, <code>ps</code> are reassigned parameters — PMD AvoidReassigningParameters; declare them inside <code>muonSach</code> instead (3) after that, the remaining <code>con</code> + readerId + bookId + response is fine for now.” Name the smell, cite the tool, propose the move.'
  : 'Tuần thứ hai. Mentor nhờ bạn review PR của một đồng đội: "refactor BookServlet: tách hàm muonSach". Test xanh. Lời review lịch sự mà hữu ích không phải "LGTM" và cũng không phải "vẫn còn tệ"; nó là ba sự thật: "(1) 16/16 test xanh, giữ nguyên hành vi ✔ (2) <code>st</code>, <code>rs</code>, <code>ps</code> là tham số bị gán lại — PMD AvoidReassigningParameters; khai báo chúng bên trong <code>muonSach</code> nhé (3) sau đó, phần còn lại <code>con</code> + readerId + bookId + response tạm ổn." Gọi tên smell, dẫn công cụ, đề xuất bước sửa.'}</p>

<h3>🧪 ${en ? 'Practice (40 minutes): score five functions' : 'Thực hành (40 phút): chấm điểm năm hàm'}</h3>
<div class="callout ok"><ol>
<li>${en ? 'Add the PMD plugin and <code>tools/smell-pmd.xml</code> to your lab copy; run <code>mvn -B pmd:check</code> and get the same 12 findings.' : 'Thêm plugin PMD và <code>tools/smell-pmd.xml</code> vào bản lab của bạn; chạy <code>mvn -B pmd:check</code> và ra đúng 12 phát hiện.'}</li>
<li>${en ? 'For each of these functions, write one line: smells (catalogue names), the evidence (a number or a line), and the refactoring you would apply: <code>BookServlet.doPost</code>, <code>LoginServlet.doGet</code>, <code>BookDAO.findById</code>, <code>lib/phi.js tinhPhi</code>, <code>routes/muon.js taoPhieu</code>.' : 'Với mỗi hàm sau, viết một dòng: smell (tên trong danh mục), bằng chứng (một con số hoặc một dòng code), và refactoring bạn sẽ dùng: <code>BookServlet.doPost</code>, <code>LoginServlet.doGet</code>, <code>BookDAO.findById</code>, <code>lib/phi.js tinhPhi</code>, <code>routes/muon.js taoPhieu</code>.'}</li>
<li>${en ? 'Reproduce the hasty extraction on a branch, check “Tests run: 16”, then fix only the reassigned parameters and re-run PMD.' : 'Làm lại lần tách vội trên một nhánh, kiểm "Tests run: 16", rồi chỉ sửa phần tham số bị gán lại và chạy lại PMD.'}</li>
</ol>
${giai(en ? 'Show a reference answer for step 2' : 'Xem đáp án tham khảo cho bước 2', `<ul>
<li><code>doPost</code> — ${en ? 'Long Function (NCSS 111), Repeated Switches (3× if SV/GV), Mysterious Name (<code>rs</code> reused 4×), Magic Numbers. ⇒ Extract Function per action, later Replace Conditional with Polymorphism.' : 'Long Function (NCSS 111), Repeated Switches (3 lần if SV/GV), Mysterious Name (<code>rs</code> dùng lại 4 lần), số ma thuật. ⇒ Extract Function theo từng action, sau đó Replace Conditional with Polymorphism.'}</li>
<li><code>LoginServlet.doGet</code> — ${en ? 'deep nesting (PMD AvoidDeeplyNestedIfStmts, cognitive 12), duplicated literal "remember" 4×, <code>split(":")</code> called twice. ⇒ Extract Function <code>dangNhapBangCookie</code> + guard clauses.' : 'lồng sâu (PMD AvoidDeeplyNestedIfStmts, cognitive 12), literal "remember" lặp 4 lần, gọi <code>split(":")</code> hai lần. ⇒ Extract Function <code>dangNhapBangCookie</code> + guard clause.'}</li>
<li><code>BookDAO.findById</code> — ${en ? 'fine as a function (cyclomatic 3). The smell is around it: swallowing exceptions with <code>printStackTrace()</code> and returning <code>null</code>. Not every finding needs a refactor.' : 'là một hàm thì ổn (cyclomatic 3). Smell nằm quanh nó: nuốt exception bằng <code>printStackTrace()</code> rồi trả <code>null</code>. Không phải phát hiện nào cũng cần refactor.'}</li>
<li><code>tinhPhi</code> — ${en ? 'Magic Numbers (2000, 50000, 1000, 5000), switch on type (copy of Java), <code>==</code>. Short, but duplicated knowledge (4.3). ⇒ Replace Magic Literal, then one shared rule table.' : 'số ma thuật (2000, 50000, 1000, 5000), switch theo loại (bản chép từ Java), <code>==</code>. Ngắn, nhưng trùng lặp tri thức (4.3). ⇒ Replace Magic Literal, rồi một bảng luật dùng chung.'}</li>
<li><code>taoPhieu</code> — ${en ? 'Long Parameter List (8), unused parameter <code>loai</code>. ⇒ Remove Parameter, Introduce Parameter Object.' : 'Long Parameter List (8), tham số <code>loai</code> không dùng. ⇒ Remove Parameter, Introduce Parameter Object.'}</li>
</ul>`)}
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? 'each of the five lines has a catalogue name, a piece of evidence and a named refactoring — no “messy”, no “bad”.' : 'mỗi dòng trong năm dòng có tên smell theo danh mục, một bằng chứng và tên một refactoring — không có chữ "lộn xộn", "tệ".'}</p></div>

<h3>🗂 ${en ? 'Key terms' : 'Thuật ngữ trong bài'}</h3>
${thuatNgu(en, [
  ['Code smell', 'mùi code', 'Dấu hiệu bề mặt thường chỉ tới vấn đề thiết kế sâu hơn; không phải bug.', 'A surface sign that usually points to a deeper design problem; not a bug.'],
  ['Long Function', 'hàm dài', 'Hàm làm nhiều việc; dấu hiệu: thấy cần comment cho từng khối.', 'A function doing many jobs; sign: you feel the need to comment each block.'],
  ['Long Parameter List', 'danh sách tham số dài', 'Hàm nhận quá nhiều đối số, dễ truyền nhầm thứ tự, hay che tham số chết.', 'Too many arguments; easy to swap, hides dead parameters.'],
  ['Magic number / literal', 'số ma thuật', 'Hằng số mà ý nghĩa chỉ nằm trong đầu người viết; không tìm kiếm chính xác được.', 'A literal whose meaning lives in the author’s head; cannot be searched exactly.'],
  ['NCSS', 'số câu lệnh không tính comment', 'Đếm câu lệnh thay vì dòng; PMD dùng để đo độ dài hàm.', 'Counts statements, not lines; PMD uses it for method length.'],
  ['Cyclomatic / cognitive complexity', 'độ phức tạp vòng / nhận thức', 'Số đường đi độc lập (McCabe 1976) / độ khó theo dõi với người đọc (SonarSource 2017).', 'Independent paths (McCabe 1976) / how hard it is for a human to follow (SonarSource 2017).'],
])}
`
);

/* ═══════════════════ 4.2 — Smell giữa các lớp ═══════════════════ */
const O42_LOP = out(`
$ mvn -B -q pmd:pmd -Dpmd.boLuat=tools/do-phuc-tap.xml -Dformat=xml     # ngưỡng 1 ⇒ in độ phức tạp của MỌI lớp
$ grep -o "The class '[A-Za-z]*' has a total cyclomatic complexity of [0-9]*" target/pmd.xml
The class 'BookDAO' has a total cyclomatic complexity of 7
The class 'Book' has a total cyclomatic complexity of 12
The class 'Reader' has a total cyclomatic complexity of 8
The class 'BookServlet' has a total cyclomatic complexity of 25
The class 'ExportServlet' has a total cyclomatic complexity of 4
The class 'LoginServlet' has a total cyclomatic complexity of 11
...
`
);
const C42_TRACH_NHIEM = java(`
// Một lớp, bao nhiêu "lý do để thay đổi"? Đánh dấu từng dòng của BookServlet theo việc nó làm:
request.getSession().getAttribute("user") == null       // [Bảo mật]   ai được vào
request.setCharacterEncoding("UTF-8")                     // [HTTP]      mã hoá
"SELECT * FROM books WHERE title LIKE '%" + q + "%'"      // [SQL]       truy vấn
b.setTitle(rs.getString("title"))                         // [Ánh xạ]    ResultSet → đối tượng
if (type.equals("SV")) max = 3; ...                       // [Nghiệp vụ] luật mượn
cal.add(Calendar.DATE, 14)                                // [Nghiệp vụ] luật hạn trả
fine = days * 2000; if (fine > 50000) ...                 // [Nghiệp vụ] luật phí
URLEncoder.encode("Mượn thành công", "UTF-8")            // [Giao diện] câu chữ cho người dùng
out.println("<html><body><h3>Loi: " + e.getMessage() ...  // [Giao diện] HTML lỗi
log.info("borrow book=" + bookId ...)                     // [Vận hành]  nhật ký
`
);
const C42_ENVY = java(`
// BookServlet.doPost, nhánh "return" (dòng 140–160): đoạn tính phí chỉ dùng dữ liệu của PHIẾU và ĐỘC GIẢ
Timestamp due = rs.getTimestamp("due_date");      // thuộc Loan
String type = rs.getString("type");               // thuộc Reader
long diff = System.currentTimeMillis() - due.getTime();
int days = (int) (diff / (1000 * 60 * 60 * 24));
double fine = 0;
if (days > 0) {
    if (type.equals("SV")) { fine = days * 2000; if (fine > 50000) fine = 50000; }
    else if (type.equals("GV")) { fine = days * 1000; }
    else { fine = days * 5000; }
}

// Trong khi đó Loan — lớp đáng lẽ "biết" về phiếu mượn — chỉ là một túi trường công khai:
public class Loan {
    public int id; public int bookId; public int readerId;
    public String bookTitle; public String readerName;
    public Date borrowDate; public Date dueDate; public Date returnDate;
    public double fine;
}
`
);
const J42_ENVY = js(`
// routes/phieu.js và routes/muon.js — bốn chỗ tự hỏi "phiếu này đã trả chưa / quá hạn chưa"
if (p.ngayTra) return res.json({ phieu: p.id, phi: 0, ghiChu: 'da tra' });            // phieu.js:17
if (p.ngayTra) continue;                                                                // phieu.js:32
if (dsPhieu[i].docGia == dg.id && !dsPhieu[i].ngayTra) dangMuon++;                      // muon.js:33
if (dsPhieu[j].docGia == dg.id && !dsPhieu[j].ngayTra) {                                // muon.js:49
  if (moment().diff(moment(dsPhieu[j].hanTra), 'days', true) > 0) { ... }               // muon.js:50
`
);
const O42_CLUMP = out(`
$ grep -rn "Connection con = null\\|DBUtil.close(" src/main/java | wc -l
18
$ grep -rn "DBUtil.close(" src/main/java
src/main/java/com/thuvien/dao/BookDAO.java:32:            DBUtil.close(rs, ps, con);
src/main/java/com/thuvien/dao/BookDAO.java:50:            DBUtil.close(rs, ps, con);
src/main/java/com/thuvien/servlet/LoginServlet.java:71:            DBUtil.close(rs, st, con);
src/main/java/com/thuvien/servlet/ExportServlet.java:39:            DBUtil.close(rs, st, con);
src/main/java/com/thuvien/servlet/BookServlet.java:64:                DBUtil.close(rs, st, con);
src/main/java/com/thuvien/servlet/BookServlet.java:190:            DBUtil.close(rs, st, ps, con);
src/main/java/com/thuvien/servlet/ReaderServlet.java:59:            DBUtil.close(rs, st, con);
src/main/java/com/thuvien/servlet/ReaderServlet.java:87:            DBUtil.close(st, con);
src/main/java/com/thuvien/servlet/ReportServlet.java:51:            DBUtil.close(rs, cs, con);
`
);
const O42_PHI_DOUBLE = out(`
# Chương 3, bài 3.3 — giá trị thật của redirect sau khi trả sách (test "?" để lỗi nói ra)
expected: <?> but was: <readers?msg=Trả sách. Phí trễ hạn: 18000.0>
expected: <?> but was: <readers?msg=Trả sách. Phí trễ hạn: 130000.0>
`
);
const O42_DIFF = out(`
$ curl -s -X POST localhost:3000/api/muon -H 'Content-Type: application/json' -d '{"docGia":2,"sach":"Refactoring"}'
{"phieu":6,"hanTra":"08/12/2026","phi":0}
$ git diff --stat data/
 data/phieu.json | 51 +++++++++++++++++++++++++++++++++++++++++++++------
 1 file changed, 45 insertions(+), 6 deletions(-)
$ git diff data/phieu.json | head -12
@@ -1,7 +1,46 @@
 [
-  { "id": 1, "sach": "Lập trình Java căn bản", "docGia": 1, "hanTra": "2026-11-15T09:00:00+07:00", "ngayTra": null },
-  { "id": 2, "sach": "Lập trình Java căn bản", "docGia": 2, "hanTra": "2026-11-30T09:00:00+07:00", "ngayTra": null },
-  { "id": 3, "sach": "Cấu trúc dữ liệu và giải thuật", "docGia": 3, "hanTra": "2026-11-11T09:00:00+07:00", "ngayTra": null },
-  { "id": 4, "sach": "Clean Code", "docGia": 4, "hanTra": "2026-10-29T09:00:00+07:00", "ngayTra": null },
-  { "id": 5, "sach": "Tiếng Nhật sơ cấp 1", "docGia": 1, "hanTra": "2026-10-06T09:00:00+07:00", "ngayTra": "2026-10-12T09:00:00+07:00" }
-]
`
);
const O42_DUA = out(`
# 5 lượt; mỗi lượt khôi phục data/ rồi bắn 2 yêu cầu mượn CÙNG LÚC (độc giả 2 và độc giả 3)
$ curl -s -X POST …/api/muon -d '{"docGia":2,"sach":"Refactoring"}' & curl -s -X POST …/api/muon -d '{"docGia":3,"sach":"Clean Architecture"}' & wait
lượt 1:  {"phieu":6,"hanTra":"24/12/2026","phi":0}   {"phieu":6,"hanTra":"08/12/2026","phi":0}
         TỆP HỎNG: Extra data — dòng 46
lượt 2:  {"phieu":6,"hanTra":"24/12/2026","phi":0}   {"phieu":6,"hanTra":"08/12/2026","phi":0}
         tệp hợp lệ, 6 phiếu; phiếu mới: [(6, 'Clean Architecture')]
lượt 3:  (như lượt 2)   lượt 4: (như lượt 2)   lượt 5: (như lượt 2)
`
);
const O42_HONG = out(`
$ tail -c 120 data/phieu.json            # một lượt khác, tệp hỏng: hai lần ghi chồng lên nhau

    "hanTra": "2026-12-08T04:01:31+07:00",
    "ngayTra": null,
    "nguoiTao": "mobile",
    "ghiChu": ""
  }
]"
  }
]
$ curl -s -w " [%{http_code}]\\n" localhost:3000/api/phieu/2/phi
loi doc du lieu [500]
$ curl -s -w " [%{http_code}]\\n" localhost:3000/api/phieu/qua-han
loi doc du lieu [500]
`
);

const L42 = ml((en) => `
<span class="eyebrow">${en ? 'Chapter 4 · Code smells: naming what feels wrong' : 'Chương 4 · Code smell: gọi tên cái cảm giác "sai sai"'}</span>
<h2>${en ? '4.2 — Smells between classes: God Servlet, Feature Envy, Data Clumps' : '4.2 — Smell giữa các lớp: God Servlet, Feature Envy, Data Clumps'}</h2>
<p class="lead">${en
  ? 'A small restaurant where one person takes orders, cooks, washes dishes and does the accounts works — until the day there are thirty customers. Nobody can help, because everything is in one head. The smells in this lesson are about <em>who does what</em>: one class doing everything, a function that lives in the wrong class, data that always travels in a bundle but has no name.'
  : 'Một quán ăn nhỏ mà một người vừa nhận order, vừa nấu, vừa rửa bát, vừa giữ sổ sách vẫn chạy được — cho tới hôm có ba mươi khách. Không ai giúp được, vì mọi thứ nằm trong một cái đầu. Các smell trong bài này nói về chuyện <em>ai làm việc gì</em>: một lớp làm tất cả, một hàm sống nhầm lớp, dữ liệu luôn đi thành bó nhưng không có tên.'}</p>
${moiTruong(en)}

<h3>${en ? 'Large Class — the “God Servlet” of every JSP project' : 'Large Class — "God Servlet" của mọi dự án JSP'}</h3>
<p>${en
  ? 'Fowler calls it Large Class; the literature also says God Class, and in Servlet/JSP projects from the 2000s–2010s it has a local name: the <strong>God Servlet</strong>. It happens naturally: a servlet is where the request arrives, so the first developer writes everything there, and every later ticket adds one more <code>else if (action.equals(…))</code>. Label each line of BookServlet with the job it does:'
  : 'Fowler gọi nó là Large Class; tài liệu khác gọi God Class, còn trong các dự án Servlet/JSP thập niên 2000–2010 nó có tên riêng: <strong>God Servlet</strong>. Nó sinh ra rất tự nhiên: servlet là nơi request tới, nên người đầu tiên viết mọi thứ ở đó, rồi ticket nào sau cũng thêm một <code>else if (action.equals(…))</code>. Gắn nhãn từng dòng của BookServlet theo việc nó làm:'}</p>
${C42_TRACH_NHIEM}
<p>${en
  ? 'Seven kinds of responsibility in one class: security, HTTP, SQL, mapping, three business rules, user-facing text and HTML, logging. In PRJ301 you learnt the cure as MVC — servlet as controller, a DAO for SQL, JSP for display. BookServlet is the “before” picture of that lesson. The test of a God Class is not size; it is <strong>how many unrelated reasons the class has to change</strong> (Single Responsibility, Robert C. Martin). Lesson 4.3 counts them from git history.'
  : 'Bảy loại trách nhiệm trong một lớp: bảo mật, HTTP, SQL, ánh xạ, ba luật nghiệp vụ, câu chữ và HTML cho người dùng, nhật ký. Ở PRJ301 bạn đã học thuốc chữa dưới tên MVC — servlet làm controller, DAO lo SQL, JSP lo hiển thị. BookServlet chính là bức ảnh "trước khi" của bài học đó. Phép thử God Class không phải độ lớn; mà là <strong>lớp có bao nhiêu lý do không liên quan nhau để phải thay đổi</strong> (Single Responsibility, Robert C. Martin). Bài 4.3 sẽ đếm chúng từ lịch sử git.'}</p>
${lk(academy('java-web-application-development', 'prj301-on-ch6'), '🎓', en ? 'Academy PRJ301 6.4 — MVC practice: god servlet, PRG, front controller' : 'Academy PRJ301 6.4 — Thực hành MVC: god servlet, PRG, front controller', en ? 'The school version of the “after” picture' : 'Phiên bản ở trường của bức ảnh "sau khi"')}
<p>${en
  ? 'Now the surprise. Our ruleset includes PMD’s <code>GodClass</code> rule, and it said <strong>nothing</strong> about BookServlet. Ask PMD for the class-level numbers:'
  : 'Giờ tới điều bất ngờ. Bộ luật của ta có luật <code>GodClass</code> của PMD, và nó <strong>không nói gì</strong> về BookServlet. Hỏi PMD các con số ở mức lớp:'}</p>
${O42_LOP}
<p>${en
  ? 'PMD’s GodClass rule implements the detection strategy of Lanza and Marinescu (<em>Object-Oriented Metrics in Practice</em>, 2006): flag a class when <strong>WMC ≥ 47</strong> (sum of method complexities) <em>and</em> it reaches into more than 5 attributes of other classes (ATFD) <em>and</em> its methods share little data (TCC &lt; 1/3). BookServlet has WMC 25 — because it has only two methods. Its complexity is concentrated in one giant method, so a class-level metric misses it; the method-level rules from 4.1 caught it instead. Lesson: <strong>a tool’s silence is not a clean bill of health</strong>. Each detector looks for one shape; you need several, plus your own reading.'
  : 'Luật GodClass của PMD cài đặt chiến lược phát hiện của Lanza và Marinescu (<em>Object-Oriented Metrics in Practice</em>, 2006): đánh dấu một lớp khi <strong>WMC ≥ 47</strong> (tổng độ phức tạp các hàm) <em>và</em> nó thò tay vào hơn 5 thuộc tính của lớp khác (ATFD) <em>và</em> các hàm của nó ít dùng chung dữ liệu (TCC &lt; 1/3). BookServlet có WMC 25 — vì nó chỉ có hai hàm. Độ phức tạp dồn hết vào một hàm khổng lồ, nên thước đo mức lớp bỏ sót; chính các luật mức hàm ở bài 4.1 mới bắt được. Bài học: <strong>công cụ im lặng không có nghĩa là code sạch</strong>. Mỗi máy dò chỉ tìm một hình dáng; bạn cần vài cái, cộng với mắt đọc của chính mình.'}</p>
<p>${en
  ? 'The view layer has its own God: <code>header.jsp</code>, included on every page, opens a JDBC connection and runs a <code>COUNT(*)</code> for the “Overdue (n)” badge. SQL in a JSP scriptlet is invisible to PMD (it only scans <code>.java</code>), invisible to “Find Usages” of DBUtil in most IDE setups, and runs on <em>every</em> page view. Keep it on your list; lesson 4.3 shows why it is also a change smell.'
  : 'Tầng giao diện cũng có "ông thần" riêng: <code>header.jsp</code>, được include vào mọi trang, mở một kết nối JDBC và chạy <code>COUNT(*)</code> cho nhãn "Quá hạn (n)". SQL trong scriptlet JSP thì PMD không thấy (nó chỉ quét <code>.java</code>), "Find Usages" của DBUtil ở đa số cấu hình IDE cũng không thấy, và nó chạy ở <em>mỗi</em> lượt xem trang. Ghi nó vào danh sách; bài 4.3 cho thấy vì sao nó còn là smell khi thay đổi.'}</p>

<h3>${en ? 'Data Class and Feature Envy — two halves of one smell' : 'Data Class và Feature Envy — hai nửa của cùng một smell'}</h3>
<p>${en
  ? 'PMD flagged <code>Book</code>, <code>Reader</code> and <code>Loan</code> as Data Classes: fields with getters/setters (or, in <code>Loan</code>’s case, nine public fields — NOPA=9) and no behaviour. A Data Class on its own is harmless — DTOs are meant to be data. The smell appears when you look for the logic that <em>should</em> be in it, and find it somewhere else, envying its data:'
  : 'PMD đánh dấu <code>Book</code>, <code>Reader</code> và <code>Loan</code> là Data Class: các trường kèm getter/setter (hoặc, với <code>Loan</code>, chín trường public — NOPA=9) và không có hành vi nào. Riêng một Data Class thì vô hại — DTO sinh ra để chứa dữ liệu. Smell xuất hiện khi bạn đi tìm logic <em>đáng lẽ</em> nằm trong nó, và thấy nó ở chỗ khác, đang thèm thuồng dữ liệu của nó:'}</p>
${C42_ENVY}
<p>${en
  ? '<strong>Feature Envy</strong>: a function more interested in the data of another class than in its own. The fine calculation uses nothing from BookServlet — only a due date (Loan) and a reader type (Reader). Fowler’s rule of thumb: put things together that change together. When the library changes the fine rule, the natural place to look is <code>Loan</code> (“how much does this loan owe on date X?”), not the servlet that handles HTTP. The refactoring is <em>Move Function</em> (Chapter 5.3), and it usually needs a small seam first — the clock, from 3.3.'
  : '<strong>Feature Envy</strong> (thèm tính năng): một hàm quan tâm tới dữ liệu của lớp khác nhiều hơn của chính lớp nó. Đoạn tính phí không dùng gì của BookServlet — chỉ một hạn trả (Loan) và một loại độc giả (Reader). Quy tắc của Fowler: đặt cạnh nhau những thứ thay đổi cùng nhau. Khi thư viện đổi luật phí, chỗ tự nhiên để tìm là <code>Loan</code> ("phiếu này nợ bao nhiêu vào ngày X?"), chứ không phải servlet lo chuyện HTTP. Refactoring tương ứng là <em>Move Function</em> (Chương 5.3), và thường cần một seam nhỏ trước — cái đồng hồ, ở bài 3.3.'}</p>
<p>${en ? 'The Node side shows the same smell in a different shape — the question “is this loan returned / overdue?” is answered by hand in four places:' : 'Phía Node có cùng smell với hình dáng khác — câu hỏi "phiếu này đã trả chưa / quá hạn chưa?" được tự trả lời bằng tay ở bốn chỗ:'}</p>
${J42_ENVY}
<p>${en
  ? 'Four copies of a rule about a loan, none of them in a “loan” module. When the library decides that a loan returned late but paid is “settled”, someone has to find all four.'
  : 'Bốn bản sao của một luật về phiếu mượn, không bản nào nằm trong module "phiếu". Hôm thư viện quyết định phiếu trả trễ nhưng đã đóng phí thì coi như "xong", ai đó phải tìm ra đủ cả bốn.'}</p>

<h3>${en ? 'Data Clumps — four variables that always arrive together' : 'Data Clumps — bốn biến lúc nào cũng đi cùng nhau'}</h3>
${O42_CLUMP}
<p>${en
  ? 'Every database method declares the same group — <code>con</code>, <code>st</code>/<code>ps</code>/<code>cs</code>, <code>rs</code> — and closes them in a <code>finally</code>. Fowler’s test for a Data Clump: <strong>delete one member; do the others still make sense?</strong> A <code>ResultSet</code> without its <code>Statement</code> and <code>Connection</code> is meaningless — so the group is really one concept that deserves a name. In modern Java the language already gave it one: try-with-resources (Java 7) or Spring’s <code>JdbcTemplate</code>, which hides the whole clump. Other clumps in the lab: <code>(readerId, bookId)</code> in the borrow flow, <code>(dsPhieu, dsDocGia)</code> loaded together by every Node route.'
  : 'Mọi hàm đụng CSDL đều khai báo cùng một nhóm — <code>con</code>, <code>st</code>/<code>ps</code>/<code>cs</code>, <code>rs</code> — rồi đóng chúng trong <code>finally</code>. Phép thử Data Clump của Fowler: <strong>xoá một thành viên; những cái còn lại còn có nghĩa không?</strong> Một <code>ResultSet</code> không có <code>Statement</code> và <code>Connection</code> của nó thì vô nghĩa — nên cả nhóm thực chất là một khái niệm đáng có tên. Java hiện đại đã đặt tên sẵn: try-with-resources (Java 7), hoặc <code>JdbcTemplate</code> của Spring giấu hẳn cả bó. Các bó khác trong lab: <code>(readerId, bookId)</code> trong luồng mượn, <code>(dsPhieu, dsDocGia)</code> mà route Node nào cũng nạp cùng nhau.'}</p>

<h3>${en ? 'Primitive Obsession — money as double, status as String' : 'Primitive Obsession — tiền bằng double, trạng thái bằng String'}</h3>
<p>${en ? 'Chapter 3 already captured the evidence, you just did not have the word for it:' : 'Chương 3 đã ghi lại bằng chứng, chỉ là lúc đó bạn chưa có tên để gọi:'}</p>
${O42_PHI_DOUBLE}
<p>${en
  ? '“18000.0” on a screen shown to a librarian is the visible tip. Underneath: money is a <code>double</code> (binary floating point cannot represent 0.1 exactly — fine for fines in whole thousands today, wrong the day someone adds a 1.5% fee), reader type is a free <code>String</code> (<code>"SV"</code>, <code>"GV"</code>, anything else falls into the “guest” branch — including a typo like <code>"sv"</code>), and a day is <code>1000 * 60 * 60 * 24</code> milliseconds. <strong>Primitive Obsession</strong> is using language primitives for domain concepts that have their own rules. The cures (Chapter 5.4): <em>Replace Primitive with Object</em> — a <code>Money</code> or <code>BigDecimal</code> with a currency, an <code>enum LoaiDocGia</code>, <code>java.time.Duration</code>.'
  : '"18000.0" trên màn hình thủ thư mới là phần nổi. Bên dưới: tiền là <code>double</code> (dấu phẩy động nhị phân không biểu diễn chính xác 0,1 — hôm nay phí toàn số nghìn chẵn thì chưa sao, hôm có ai thêm phụ phí 1,5% là sai), loại độc giả là <code>String</code> tự do (<code>"SV"</code>, <code>"GV"</code>, còn lại rơi hết vào nhánh "khách" — kể cả gõ nhầm <code>"sv"</code>), và một ngày là <code>1000 * 60 * 60 * 24</code> mili giây. <strong>Primitive Obsession</strong> (ám ảnh kiểu nguyên thuỷ) là dùng kiểu cơ bản của ngôn ngữ cho các khái niệm nghiệp vụ có luật riêng. Thuốc (Chương 5.4): <em>Replace Primitive with Object</em> — <code>Money</code> hoặc <code>BigDecimal</code> kèm đơn vị tiền, <code>enum LoaiDocGia</code>, <code>java.time.Duration</code>.'}</p>
<div class="callout warn"><p>${en
  ? '<strong>Real incident — a number without its unit.</strong> NASA’s Mars Climate Orbiter was lost on 23 September 1999. Ground software from one contractor produced thruster impulse in pound-force seconds; the navigation software expected newton-seconds — a factor of 4.45. Both sides passed a bare floating-point number, so nothing could catch the mismatch; the spacecraft flew too low into the Martian atmosphere (NASA Mishap Investigation Board, Phase I report, 10 November 1999). A type that carries its unit makes that error impossible to compile.'
  : '<strong>Sự cố thật — một con số không kèm đơn vị.</strong> Tàu Mars Climate Orbiter của NASA bị mất ngày 23/9/1999. Phần mềm mặt đất của một nhà thầu tính xung lực động cơ theo pound-force giây; phần mềm dẫn đường lại chờ newton-giây — lệch 4,45 lần. Cả hai bên chỉ truyền một số thực trần, nên không gì bắt được chỗ lệch; con tàu bay quá thấp vào khí quyển sao Hoả (Ban điều tra sự cố NASA, báo cáo pha I, 10/11/1999). Một kiểu dữ liệu mang theo đơn vị sẽ khiến lỗi đó không biên dịch nổi.'}</p></div>

<h3>${en ? 'Insider Trading — a route that writes another module’s file' : 'Insider Trading — một route ghi thẳng vào tệp của module khác'}</h3>
<p>${en
  ? 'The 1st edition called it Inappropriate Intimacy; the 2nd edition renamed it <strong>Insider Trading</strong>: modules that trade data behind each other’s backs. In <code>legacy-express</code>, <code>lib/kho.js</code> (“the store”) is the only module that knows data lives in JSON files — it exposes <code>doc()</code>. In 2019 <code>routes/muon.js</code> needed to <em>write</em>, <code>kho</code> had no <code>ghi()</code>, so the route opened <code>data/phieu.json</code> itself with <code>fs.writeFile</code>. Work on a copy, and since the zip has no git history, make one first (<code>git init &amp;&amp; git add -A &amp;&amp; git commit -qm goc</code>; restore later with <code>git checkout data/</code>). One borrow, and look at the diff:'
  : 'Bản 1 gọi là Inappropriate Intimacy; bản 2 đổi tên thành <strong>Insider Trading</strong> (giao dịch nội gián): các module trao đổi dữ liệu sau lưng nhau. Trong <code>legacy-express</code>, <code>lib/kho.js</code> ("kho") là module duy nhất biết dữ liệu nằm trong tệp JSON — nó cung cấp <code>doc()</code>. Năm 2019, <code>routes/muon.js</code> cần <em>ghi</em>, mà <code>kho</code> không có <code>ghi()</code>, nên route tự mở <code>data/phieu.json</code> bằng <code>fs.writeFile</code>. Làm trên bản sao, và vì tệp zip không kèm lịch sử git, tạo một commit trước (<code>git init &amp;&amp; git add -A &amp;&amp; git commit -qm goc</code>; khôi phục sau bằng <code>git checkout data/</code>). Mượn một lần, rồi nhìn diff:'}</p>
${O42_DIFF}
<p>${en
  ? 'One new loan rewrote all five old ones (different formatting). Annoying for code review — but it hides something worse. The route reads the file, computes <code>id = max + 1</code>, then writes the whole file back. Nothing coordinates two requests doing that at the same time. We measured it on a copy of the data:'
  : 'Một phiếu mới mà viết lại cả năm phiếu cũ (khác định dạng). Khó chịu khi review — nhưng nó che một thứ tệ hơn. Route đọc tệp, tính <code>id = max + 1</code>, rồi ghi đè cả tệp. Không có gì điều phối hai yêu cầu cùng làm việc đó một lúc. Ta đo thật trên bản sao dữ liệu:'}</p>
${O42_DUA}
${O42_HONG}
<p>${en
  ? 'Five rounds, five failures. Both requests were told “201, loan 6”. In four rounds the second write silently replaced the first — a borrow the app confirmed simply does not exist. In one round the two writes interleaved and left invalid JSON; from that moment <strong>every</strong> endpoint of the mobile API answers 500 until someone repairs the file by hand. This is a race condition, and the smell is why nobody saw it: persistence logic is split between <code>kho</code> (reads) and a route (writes), so neither module owns the rule “only one writer at a time”. Proper cures — a <code>kho.ghi()</code> that serialises writes, or a real database with transactions — come in Chapters 5 and 8. For now: pin it with a test, and file it.'
  : 'Năm lượt, năm lần hỏng. Cả hai yêu cầu đều được trả "201, phiếu 6". Bốn lượt, lần ghi thứ hai lặng lẽ đè lần ghi thứ nhất — một lượt mượn mà app đã xác nhận thì không hề tồn tại. Một lượt, hai lần ghi đan vào nhau để lại JSON hỏng; từ lúc đó <strong>mọi</strong> endpoint của API di động trả 500 cho tới khi có người sửa tay tệp. Đây là race condition (tranh chấp), và smell chính là lý do không ai thấy nó: logic lưu trữ bị chia giữa <code>kho</code> (đọc) và một route (ghi), nên không module nào chịu trách nhiệm luật "mỗi lúc chỉ một người ghi". Thuốc đúng — một <code>kho.ghi()</code> xếp hàng các lần ghi, hoặc một CSDL thật có transaction — ở Chương 5 và 8. Còn bây giờ: khoá nó bằng test, và báo lên.'}</p>

<h3>🕵️ ${en ? 'Hacker’s corner — races are found on purpose' : 'Góc hacker — race condition bị săn có chủ đích'}</h3>
<p>${en
  ? 'You triggered this race with two curls. An attacker does it with a script firing hundreds of requests in the same millisecond. In 2015 the researcher Egor Homakov showed that by sending two gift-card transfer requests to Starbucks at the same moment, a balance could be transferred twice — money created from nothing (his write-up “Hacking Starbucks for unlimited coffee”, May 2015). Our version is a denial of service: two concurrent borrows take the whole mobile API down. How to spot the risk in someone else’s code: look for <strong>read → compute → write</strong> on shared state (a file, a counter, a balance) with no lock, no transaction and no unique constraint. <code>id = max + 1</code> is the classic signature; so is <code>available - 1</code> computed in Java instead of in an <code>UPDATE … WHERE available &gt; 0</code>. Test only on your own lab copy.'
  : 'Bạn gây ra race này bằng hai lệnh curl. Kẻ tấn công làm bằng một script bắn hàng trăm request trong cùng một mili giây. Năm 2015, nhà nghiên cứu Egor Homakov cho thấy gửi hai yêu cầu chuyển tiền thẻ quà tặng Starbucks cùng một lúc thì số dư được chuyển hai lần — tiền sinh ra từ không khí (bài viết "Hacking Starbucks for unlimited coffee", 5/2015). Phiên bản của ta là từ chối dịch vụ: hai lượt mượn đồng thời làm sập cả API di động. Cách nhận ra rủi ro trong code người khác: tìm mẫu <strong>đọc → tính → ghi</strong> trên trạng thái dùng chung (tệp, bộ đếm, số dư) mà không có khoá, không transaction, không ràng buộc unique. <code>id = max + 1</code> là chữ ký kinh điển; <code>available - 1</code> tính trong Java thay vì trong <code>UPDATE … WHERE available &gt; 0</code> cũng vậy. Chỉ thử trên bản lab của chính bạn.'}</p>

<h3>${en ? 'Two smaller ones you will name in reviews' : 'Hai smell nhỏ hơn bạn sẽ gọi tên khi review'}</h3>
<ul>
<li>${en ? '<strong>Message Chains</strong> — <code>request.getSession().getAttribute("user")</code>: the caller knows the path through three objects. Harmless once; copied five times (4.3), it becomes the reason renaming the session key is a five-file change.' : '<strong>Message Chains</strong> (chuỗi lời gọi) — <code>request.getSession().getAttribute("user")</code>: nơi gọi biết đường đi qua ba đối tượng. Một lần thì vô hại; chép năm lần (4.3) thì nó là lý do đổi tên khoá session thành việc sửa năm tệp.'}</li>
<li>${en ? '<strong>Global Data / Mutable Data</strong> — <code>DBUtil.props</code> is a static, lazily-filled <code>Properties</code> shared by every request thread; <code>Constants.EXPORT_DIR</code> is global configuration baked into code. Fowler lists Global Data among the most pungent smells because anything anywhere can change it.' : '<strong>Global Data / Mutable Data</strong> (dữ liệu toàn cục / dữ liệu biến đổi) — <code>DBUtil.props</code> là một <code>Properties</code> static, nạp lười, dùng chung cho mọi luồng request; <code>Constants.EXPORT_DIR</code> là cấu hình toàn cục nướng thẳng vào code. Fowler xếp Global Data vào nhóm mùi nặng nhất vì bất cứ đâu cũng đổi được nó.'}</li>
</ul>

<h3>💼 ${en ? 'OJT situation' : 'Tình huống OJT'}</h3>
<p>${en
  ? 'The customer reports: “Sometimes the mobile app says the loan is created but the librarian cannot find it.” Your leader asks for a first answer by the end of the day. Without this lesson you would say “cannot reproduce”. With it: “Root cause candidate: <code>routes/muon.js</code> writes <code>data/phieu.json</code> directly, read-modify-write without coordination. Reproduced on a copy: 2 concurrent POSTs ⇒ same id 6 returned twice, one loan lost in 4/5 rounds, file corrupted in 1/5 (then all endpoints 500). Proposal: hot-fix — serialise writes inside <code>kho</code>; real fix — move loans to MySQL (ticket).” That is a message a leader can forward to the customer unchanged.'
  : 'Khách báo: "Thỉnh thoảng app di động báo tạo phiếu thành công nhưng thủ thư không tìm thấy phiếu." Leader cần câu trả lời đầu tiên trước cuối ngày. Không có bài này, bạn sẽ nói "không tái hiện được". Có nó: "Nguyên nhân khả nghi: <code>routes/muon.js</code> ghi thẳng <code>data/phieu.json</code>, đọc-sửa-ghi không điều phối. Đã tái hiện trên bản sao: 2 POST đồng thời ⇒ cùng trả id 6, mất một phiếu ở 4/5 lượt, hỏng tệp ở 1/5 (sau đó mọi endpoint 500). Đề xuất: sửa nóng — xếp hàng các lần ghi trong <code>kho</code>; sửa gốc — chuyển phiếu sang MySQL (ticket riêng)." Đó là tin nhắn leader chuyển nguyên văn cho khách được.'}</p>

<h3>🧪 ${en ? 'Practice (40 minutes)' : 'Thực hành (40 phút)'}</h3>
<div class="callout ok"><ol>
<li>${en ? 'Print the class-level complexity of every class with <code>tools/do-phuc-tap.xml</code>. Which class would cross WMC 47 first if you merged ReaderServlet into BookServlet?' : 'In độ phức tạp mức lớp của mọi lớp bằng <code>tools/do-phuc-tap.xml</code>. Nếu gộp ReaderServlet vào BookServlet, lớp đó đã chạm WMC 47 chưa?'}</li>
<li>${en ? 'List every place in both repos that answers “is this loan overdue?”. For each, note the rule it uses (days rounded how? from which clock?).' : 'Liệt kê mọi chỗ trong cả hai repo trả lời câu hỏi "phiếu này quá hạn chưa?". Với mỗi chỗ, ghi luật nó dùng (làm tròn ngày thế nào? lấy giờ từ đâu?).'}</li>
<li>${en ? 'Reproduce the concurrent-borrow race on a copy of <code>legacy-express</code>, then write a Jest test that pins it (hint: <code>Promise.all</code> of two <code>supertest</code> calls, then read the file).' : 'Tái hiện race mượn đồng thời trên bản sao <code>legacy-express</code>, rồi viết một test Jest khoá nó lại (gợi ý: <code>Promise.all</code> hai lời gọi <code>supertest</code>, rồi đọc tệp).'}</li>
</ol>
${giai(en ? 'Show hints' : 'Xem gợi ý', `<p>${en
  ? '(1) BookServlet 25 + ReaderServlet 10 = 35 — still below 47; the merged class would still pass the GodClass rule. (2) Java: <code>BookServlet</code> return branch (truncates days), <code>header.jsp</code> (<code>due_date &lt; NOW()</code>, by the second), <code>sp_overdue_report</code> (<code>DATEDIFF</code>, calendar days); Node: <code>lib/phi.js</code> (<code>Math.ceil</code>), <code>routes/muon.js</code> (fractional days &gt; 0). Five places, three different rules. (3) Run the test against a temporary copy of <code>data/</code>; expect it to fail <em>sometimes</em> — mark it as a known flaky characterisation and keep it out of the default suite.'
  : '(1) BookServlet 25 + ReaderServlet 10 = 35 — vẫn dưới 47; lớp gộp vẫn qua luật GodClass. (2) Java: nhánh trả sách của <code>BookServlet</code> (cắt bỏ phần lẻ ngày), <code>header.jsp</code> (<code>due_date &lt; NOW()</code>, tính tới từng giây), <code>sp_overdue_report</code> (<code>DATEDIFF</code>, theo ngày lịch); Node: <code>lib/phi.js</code> (<code>Math.ceil</code>), <code>routes/muon.js</code> (ngày lẻ &gt; 0). Năm chỗ, ba luật khác nhau. (3) Chạy test trên bản sao tạm của <code>data/</code>; chờ nó đỏ <em>thỉnh thoảng</em> — đánh dấu là đặc tả "chập chờn" đã biết và để ngoài bộ test mặc định.'}</p>`)}
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? 'you can show, with an output, one example each of Large Class, Feature Envy, Data Clumps, Primitive Obsession and Insider Trading in the lab.' : 'bạn chỉ ra được, kèm output, mỗi loại một ví dụ trong lab: Large Class, Feature Envy, Data Clumps, Primitive Obsession và Insider Trading.'}</p></div>

<h3>🗂 ${en ? 'Key terms' : 'Thuật ngữ trong bài'}</h3>
${thuatNgu(en, [
  ['Large Class / God Class', 'lớp ôm đồm', 'Lớp gánh nhiều trách nhiệm không liên quan; phép thử: số lý do để thay đổi.', 'A class with many unrelated responsibilities; test: how many reasons it has to change.'],
  ['Feature Envy', 'thèm tính năng', 'Hàm dùng dữ liệu của lớp khác nhiều hơn của lớp mình ⇒ Move Function.', 'A function using another class’s data more than its own ⇒ Move Function.'],
  ['Data Class', 'lớp chỉ chứa dữ liệu', 'Chỉ có trường và getter/setter; vô hại nếu là DTO, có mùi khi logic của nó nằm chỗ khác.', 'Only fields and accessors; fine for DTOs, smelly when its logic lives elsewhere.'],
  ['Data Clumps', 'bó dữ liệu', 'Nhóm biến luôn đi cùng nhau; xoá một cái thì cả nhóm vô nghĩa ⇒ đặt tên cho nhóm.', 'Variables that always travel together; remove one and the rest is meaningless.'],
  ['Primitive Obsession', 'ám ảnh kiểu nguyên thuỷ', 'Dùng double/String/int cho khái niệm nghiệp vụ có luật riêng (tiền, loại, khoảng thời gian).', 'Using primitives for domain concepts with their own rules (money, type, duration).'],
  ['Insider Trading', 'giao dịch nội gián', 'Module trao đổi dữ liệu sau lưng nhau, bỏ qua lớp trừu tượng (bản 1: Inappropriate Intimacy).', 'Modules trading data behind each other’s backs (1st ed.: Inappropriate Intimacy).'],
  ['Race condition', 'tranh chấp', 'Kết quả phụ thuộc thứ tự chạy của hai luồng/request; mẫu đọc → tính → ghi không khoá.', 'The result depends on timing between two threads/requests; read → compute → write without a lock.'],
])}
`
);

/* ═══════════════════ 4.3 — Smell khi thay đổi ═══════════════════ */
const O43_CPD = out(`
$ mvn -B pmd:cpd-check -DminimumTokens=60
[WARNING] CPD Failure: Found 8 lines of duplicated code at locations:
[WARNING]     /src/src/main/java/com/thuvien/dao/BookDAO.java line 55
[WARNING]     /src/src/main/java/com/thuvien/servlet/BookServlet.java line 51
[WARNING] CPD Failure: Found 12 lines of duplicated code at locations:
[WARNING]     /src/src/main/java/com/thuvien/servlet/BookServlet.java line 70
[WARNING]     /src/src/main/java/com/thuvien/servlet/ReaderServlet.java line 63
[ERROR] Failed to execute goal org.apache.maven.plugins:maven-pmd-plugin:3.26.0:cpd-check (default-cli) on project thuvien: CPD 7.7.0 has found 2 duplications.
`
);
const O43_JSCPD = out(`
$ npx jscpd --min-tokens 30 --format javascript lib routes
Found 0 clones.
$ npx jscpd --min-tokens 20 --min-lines 2 --format javascript lib routes
Clone found (javascript):
 - routes/phieu.js [24:11 - 27:4] (3 lines, 55 tokens)
   routes/phieu.js [9:11 - 12:4]
Clone found (javascript):
 - routes/phieu.js [26:18 - 29:3] (3 lines, 47 tokens)
   routes/phieu.js [13:2 - 16:3]
Clone found (javascript):
 - routes/phieu.js [32:9 - 34:4] (2 lines, 42 tokens)
   routes/phieu.js [15:2 - 17:3]
Clone found (javascript):
 - routes/muon.js [25:9 - 27:3] (2 lines, 29 tokens)
   routes/phieu.js [10:8 - 12:2]
Clone found (javascript):
 - routes/muon.js [29:8 - 31:9] (2 lines, 29 tokens)
   routes/phieu.js [14:9 - 16:3]
│ javascript │ 4 │ 141 │ 2151 │ 5 │ 12 (8.51%) │ 202 (9.39%) │
$ npx jscpd --min-tokens 15 --min-lines 2 --format javascript lib routes
 - routes/muon.js [2:1 - 4:3] (2 lines, 26 tokens)
   routes/phieu.js [1:1 - 3:4]
 - lib/kho.js [2:1 - 5:9] (3 lines, 25 tokens)
   routes/muon.js [4:1 - 6:4]
 ... 9 clones — thêm cả các dòng require ở đầu tệp
`
);
const C43_PHI_3 = java(`
// Cùng một tri thức "phí trễ hạn", ba ngôn ngữ, ba kết quả
// Java  — BookServlet.java:150   ngày = (int)(mili giây / 86 400 000)   ⇒ bỏ phần lẻ; SV 2000/ngày trần 50 000; GV 1000; khách 5000
// JS    — lib/phi.js:6           ngày = Math.ceil(diff theo ngày lẻ)    ⇒ làm tròn LÊN; cùng bảng giá, cùng trần
// SQL   — sp_overdue_report      DATEDIFF(NOW(), due_date) * 2000       ⇒ theo ngày lịch; MỌI loại 2000/ngày; KHÔNG trần
`
);
const O43_SHOTGUN = out(`
$ grep -rnE "'(SV|GV|KHACH)'|\\"(SV|GV|KHACH)\\"|>(SV|GV|KHACH)<" legacy-thu-vien/src/main legacy-thu-vien/db legacy-express/lib legacy-express/routes
legacy-thu-vien/src/main/java/com/thuvien/model/Reader.java:6:    private String type;   // "SV", "GV", "KHACH"
legacy-express/lib/phi.js:9:  if (docGia.loai == 'SV') {
legacy-express/lib/phi.js:12:  } else if (docGia.loai == 'GV') {
legacy-thu-vien/src/main/webapp/readers.jsp:46:  Tên <input name="name"> Loại <select name="type"><option>SV</option><option>GV</option><option>KHA
legacy-express/routes/muon.js:37:      if (dg.loai == 'SV') {
legacy-express/routes/muon.js:39:      } else if (dg.loai == 'GV') {
legacy-express/routes/muon.js:51:            if (dg.loai != 'GV') {
legacy-thu-vien/db/thuvien.sql:46: (1,'Nguyễn Văn An','SV','0901000001'),(2,'Trần Thị Bình','SV','0901000002'),
legacy-thu-vien/db/thuvien.sql:47: (3,'Lê Minh Châu','GV','0901000003'),(4,'Phạm Quốc Dũng','KHACH','0901000004'),
legacy-thu-vien/db/thuvien.sql:48: (5,'Hoàng Gia Huy','SV','0901000005');
legacy-thu-vien/src/main/java/com/thuvien/servlet/BookServlet.java:102:                if (type.equals("SV")) {
legacy-thu-vien/src/main/java/com/thuvien/servlet/BookServlet.java:104:                } else if (type.equals("GV")) {
legacy-thu-vien/src/main/java/com/thuvien/servlet/BookServlet.java:122:                if (type.equals("SV")) {
legacy-thu-vien/src/main/java/com/thuvien/servlet/BookServlet.java:124:                } else if (type.equals("GV")) {
legacy-thu-vien/src/main/java/com/thuvien/servlet/BookServlet.java:153:                    if (type.equals("SV")) {
legacy-thu-vien/src/main/java/com/thuvien/servlet/BookServlet.java:156:                    } else if (type.equals("GV")) {
`
);
const O43_DIVERGENT = out(`
$ git log master --format="%h %ad %an  %s" --date=short -- src/main/java/com/thuvien/servlet/BookServlet.java
4780c81 2018-06-20 Tran Quoc Hung  refactor
c4b91f7 2017-06-19 Tran Quoc Hung  TV-52 SV khieu nai phi qua cao -> tran 50k (chi ap dung SV theo y kien phong CTSV)
7b36199 2017-05-02 Tran Quoc Hung  TV-45 tinh phi tre han khi tra sach
ac4b941 2017-04-11 Tran Quoc Hung  TV-41 gioi han so sach muon theo loai doc gia (SV 3, GV 10, khach 1)
1d7ff47 2016-09-20 Nguyen Anh Tuan  fix loi so luong am (TV-23)
1133063 2016-03-02 Nguyen Anh Tuan  init project
$ git log master --format= --name-only -- src db | sort | uniq -c | sort -rn | head -5
      6 src/main/java/com/thuvien/servlet/BookServlet.java
      5 src/main/webapp/WEB-INF/web.xml
      3 db/thuvien.sql
      2 src/main/webapp/login.jsp
      2 src/main/webapp/header.jsp
`
);
const O43_AUTH = out(`
$ grep -rn "\\"user\\"\\|SESSION_USER" src/main/java src/main/webapp
src/main/java/com/thuvien/util/Constants.java:4:    public static final String SESSION_USER = "user";
src/main/java/com/thuvien/servlet/ReaderServlet.java:21:        if (request.getSession().getAttribute("user") == null) {
src/main/java/com/thuvien/servlet/ReaderServlet.java:67:        if (request.getSession().getAttribute("user") == null) {
src/main/java/com/thuvien/servlet/LoginServlet.java:36:                        request.getSession().setAttribute(Constants.SESSION_USER, u);
src/main/java/com/thuvien/servlet/LoginServlet.java:58:                request.getSession().setAttribute(Constants.SESSION_USER, rs.getString("username"));
src/main/java/com/thuvien/servlet/BookServlet.java:33:        if (request.getSession().getAttribute("user") == null) {
src/main/java/com/thuvien/servlet/BookServlet.java:74:        if (request.getSession().getAttribute("user") == null) {
src/main/webapp/header.jsp:15:  Xin chào <%= session.getAttribute("user") %> |
src/main/java/com/thuvien/servlet/ReportServlet.java:24:        if (request.getSession().getAttribute("user") == null) {
$ grep -rL 'getAttribute("user")' src/main/java/com/thuvien/servlet/*.java
src/main/java/com/thuvien/servlet/ExportServlet.java
src/main/java/com/thuvien/servlet/LoginServlet.java
`
);
const C43_GOTOFAIL = java(`
// Apple SecureTransport, sslKeyExchange.c (iOS 7.0 / OS X 10.9, sửa 2/2014) — trích đoạn công khai
if ((err = SSLHashSHA1.update(&hashCtx, &signedParams)) != 0)
    goto fail;
    goto fail;                       // ← dòng bị lặp: luôn nhảy, kể cả khi err == 0
if ((err = SSLHashSHA1.final(&hashCtx, &hashOut)) != 0)
    goto fail;
...                                  // bước kiểm chữ ký bên dưới KHÔNG BAO GIỜ chạy
fail:
    ...
    return err;                      // err == 0 ⇒ "chữ ký hợp lệ"
`
);

const L43 = ml((en) => `
<span class="eyebrow">${en ? 'Chapter 4 · Code smells: naming what feels wrong' : 'Chương 4 · Code smell: gọi tên cái cảm giác "sai sai"'}</span>
<h2>${en ? '4.3 — Smells of change: Duplicated Code, Shotgun Surgery, Divergent Change, switch on type' : '4.3 — Smell khi thay đổi: code lặp, Shotgun Surgery, Divergent Change, switch theo loại'}</h2>
<p class="lead">${en
  ? 'Some smells are invisible when you read the code and painful the moment you change it — like a house where the light switch for the kitchen is in the bedroom. You only notice when you try to turn the light on. In maintenance work you are paid to change code, so these are the smells that decide whether your estimate is two hours or two days.'
  : 'Có những smell đọc code thì không thấy, mà đụng vào sửa là đau ngay — như căn nhà có công tắc đèn bếp đặt trong phòng ngủ. Chỉ lúc định bật đèn bạn mới nhận ra. Làm bảo trì là được trả tiền để sửa code, nên chính những smell này quyết định ước lượng của bạn là hai giờ hay hai ngày.'}</p>
${moiTruong(en)}

<h3>${en ? 'Duplicated Code — what a detector finds' : 'Duplicated Code — máy dò tìm được gì'}</h3>
<p>${en
  ? 'PMD ships with CPD, the Copy/Paste Detector: it tokenises the source (so different variable names and spacing do not hide a copy) and reports sequences of at least N identical tokens. Same plugin you already added:'
  : 'PMD đi kèm CPD (Copy/Paste Detector): nó tách mã thành token (nên đổi tên biến hay khoảng trắng không che được bản chép) rồi báo các chuỗi có ít nhất N token giống nhau. Vẫn plugin bạn đã thêm:'}</p>
${O43_CPD}
<p>${en
  ? 'Two clones: the <code>ResultSet → Book</code> mapping in BookServlet’s search is a copy of <code>BookDAO.map()</code> (someone started the DAO in 2018 and never moved the search), and the seam between <code>doGet</code> and <code>doPost</code> — forward to the JSP, login check, encoding, connection variables — is copied between BookServlet and ReaderServlet. For Node, <code>jscpd</code> does the same job:'
  : 'Hai bản chép: phần ánh xạ <code>ResultSet → Book</code> trong chức năng tìm kiếm của BookServlet là bản sao của <code>BookDAO.map()</code> (có người bắt đầu tách DAO năm 2018 rồi không bao giờ chuyển phần tìm kiếm sang), còn chỗ nối giữa <code>doGet</code> và <code>doPost</code> — forward sang JSP, kiểm tra đăng nhập, mã hoá, khai báo biến kết nối — chép qua lại giữa BookServlet và ReaderServlet. Với Node, <code>jscpd</code> làm cùng việc đó:'}</p>
${O43_JSCPD}
<p>${en
  ? 'The threshold decides everything. At 30 tokens: nothing. At 20: five real clones — the “load phieu, then load doc-gia, then find by <code>==</code>” dance repeated in every route. At 15: noise, such as the three <code>require</code> lines at the top of every file. Start high, lower step by step, and stop when the new findings stop being interesting.'
  : 'Ngưỡng quyết định tất cả. 30 token: không thấy gì. 20: năm bản chép thật — điệu nhảy "nạp phieu, rồi nạp doc-gia, rồi tìm bằng <code>==</code>" lặp lại ở mọi route. 15: nhiễu, như ba dòng <code>require</code> đầu mỗi tệp. Bắt đầu từ cao, hạ dần từng bước, và dừng khi phát hiện mới không còn đáng xem.'}</p>

<h3>${en ? 'The duplication no tool finds: the same knowledge in three languages' : 'Sự trùng lặp không công cụ nào bắt được: cùng một tri thức ở ba ngôn ngữ'}</h3>
${C43_PHI_3}
<p>${en
  ? 'CPD saw nothing here, because the three copies share no tokens: one is Java, one JavaScript, one SQL. Yet this is the most expensive duplication in the lab. Hunt and Thomas named the principle in <em>The Pragmatic Programmer</em> (1999): <strong>DRY — every piece of knowledge must have a single, unambiguous, authoritative representation within a system</strong>. DRY is about knowledge, not about text. Here the knowledge “how much does a late loan cost” has three representations that already disagree: 18,000 vs 20,000 for the same loan (Chapter 3), and a report that charges a guest 2,000 a day while the counter charges 5,000. Detecting this takes a human reading for <em>rules</em>; grep for the rule’s numbers (4.1) is the best mechanical help you get.'
  : 'CPD không thấy gì ở đây, vì ba bản không có token chung: một Java, một JavaScript, một SQL. Thế nhưng đây là sự trùng lặp đắt nhất trong lab. Hunt và Thomas đặt tên cho nguyên lý này trong <em>The Pragmatic Programmer</em> (1999): <strong>DRY — mỗi mẩu tri thức phải có một biểu diễn duy nhất, rõ ràng, có thẩm quyền trong hệ thống</strong>. DRY nói về tri thức, không nói về chữ. Ở đây tri thức "trả sách trễ thì mất bao nhiêu tiền" có ba biểu diễn và chúng đã cãi nhau: 18.000 và 20.000 cho cùng một phiếu (Chương 3), và báo cáo tính khách 2.000 một ngày trong khi quầy thu 5.000. Phát hiện chuyện này cần một con người đọc để tìm <em>luật</em>; grep theo con số của luật (4.1) là trợ giúp máy móc tốt nhất bạn có.'}</p>

<h3>${en ? 'Shotgun Surgery — one ticket, many files' : 'Shotgun Surgery — một ticket, nhiều tệp'}</h3>
<p>${en
  ? 'Ticket TV-95 arrives: “Add reader type NCS (PhD student): borrow up to 5 books for 21 days, fine 1,500 per day, no cap.” A small business change. Where does the code know about reader types?'
  : 'Ticket TV-95 tới: "Thêm loại độc giả NCS (nghiên cứu sinh): mượn tối đa 5 cuốn trong 21 ngày, phí 1.500 một ngày, không trần." Một thay đổi nghiệp vụ nhỏ. Code biết về loại độc giả ở những đâu?'}</p>
${O43_SHOTGUN}
<p>${en
  ? 'Read the list as an impact analysis, not as grep output. To deliver TV-95 correctly you must touch: BookServlet ×3 (limit, due date, fine), <code>readers.jsp</code> (the dropdown), <code>lib/phi.js</code>, <code>routes/muon.js</code> ×2 (limit + due date, and the overdue exception that names <code>GV</code>), <code>Reader.java</code> (the comment that documents valid values), and <code>sp_overdue_report</code> — which does <em>not</em> appear in the grep because it ignores the type entirely. Plus tests for each. Nine places in six files — eight in code across two repositories, plus the stored procedure: that is <strong>Shotgun Surgery</strong> — one change forces many small edits scattered everywhere. The danger is not the work; it is the place you forget (the stored procedure). The cure is to bring the knowledge into one place (Move Function, Combine Functions into Class — Chapter 5.3); the estimate today must include the scatter.'
  : 'Đọc danh sách này như một bản phân tích ảnh hưởng (impact analysis), đừng đọc như output grep. Muốn giao TV-95 đúng, bạn phải sửa: BookServlet ×3 (giới hạn, hạn trả, phí), <code>readers.jsp</code> (ô chọn), <code>lib/phi.js</code>, <code>routes/muon.js</code> ×2 (giới hạn + hạn trả, và ngoại lệ quá hạn có ghi tên <code>GV</code>), <code>Reader.java</code> (comment ghi các giá trị hợp lệ), và <code>sp_overdue_report</code> — thứ <em>không</em> hiện trong grep vì nó bỏ qua loại độc giả hoàn toàn. Cộng test cho từng chỗ. Chín chỗ trong sáu tệp — tám chỗ trong code ở hai repo, cộng stored procedure: đó là <strong>Shotgun Surgery</strong> (phẫu thuật súng hoa cải) — một thay đổi bắt bạn sửa lặt vặt rải khắp nơi. Nguy hiểm không nằm ở khối lượng việc; mà ở chỗ bạn quên (stored procedure). Thuốc là gom tri thức về một chỗ (Move Function, Combine Functions into Class — Chương 5.3); còn ước lượng hôm nay phải tính cả độ rải đó.'}</p>
<div class="callout"><p>${en
  ? '<strong>Estimating with the list.</strong> A PM asks “how long for TV-95?”. A junior answer: “an hour, it is just a new type”. A useful answer: “8 code locations in 2 repos + 1 stored procedure; characterization tests exist for Java borrow only. Estimate 1.5 days: 0.5 day tests for return/fine and Node, 0.5 day change, 0.5 day check report + deploy both apps. Risk: report fine is already wrong for GV/guests — fix or keep?” Chapter 8 turns this into a PR description.'
  : '<strong>Ước lượng bằng danh sách.</strong> PM hỏi "TV-95 mất bao lâu?". Câu trả lời non: "một tiếng, chỉ thêm một loại thôi mà". Câu trả lời hữu ích: "8 chỗ code ở 2 repo + 1 stored procedure; hiện mới có characterization test cho phần mượn bên Java. Ước 1,5 ngày: 0,5 ngày viết test cho trả sách/phí và phía Node, 0,5 ngày sửa, 0,5 ngày kiểm báo cáo + deploy cả hai ứng dụng. Rủi ro: phí trên báo cáo vốn đã sai cho GV/khách — sửa luôn hay giữ?" Chương 8 biến đoạn này thành mô tả PR.'}</p></div>

<h3>${en ? 'Divergent Change — one file, many reasons' : 'Divergent Change — một tệp, nhiều lý do'}</h3>
<p>${en
  ? 'Shotgun Surgery’s mirror image: <strong>one module changes for many unrelated reasons</strong>. You do not need to guess the reasons — git remembers them (git log was taught in Chapter 2.4):'
  : 'Ảnh phản chiếu của Shotgun Surgery: <strong>một module bị sửa vì nhiều lý do không liên quan nhau</strong>. Bạn không cần đoán các lý do — git nhớ hết (git log đã học ở Chương 2.4):'}</p>
${O43_DIVERGENT}
<p>${en
  ? 'BookServlet is the most-changed source file in the project, and its six commits have five different reasons: stock quantity bug (TV-23), borrow limits (TV-41), fines (TV-45, TV-52), and a persistence refactor. Rules owned by the circulation desk, by the student office and by whoever maintains the database all live in one file. With three developers working on three such tickets in the same sprint, they edit the same method and fight merge conflicts. In 4.1 you saw that the class “should” split; this output is the <em>evidence</em> you put in a proposal, and lesson 4.4 multiplies it by complexity to rank where to start.'
  : 'BookServlet là tệp nguồn bị sửa nhiều nhất dự án, và sáu commit của nó có năm lý do khác nhau: lỗi số lượng tồn (TV-23), giới hạn mượn (TV-41), phí (TV-45, TV-52), và một lần refactor phần lưu trữ. Luật của quầy mượn trả, của phòng công tác sinh viên và của người lo CSDL đều sống trong một tệp. Ba lập trình viên làm ba ticket kiểu đó trong cùng sprint sẽ cùng sửa một hàm và đánh nhau với xung đột merge. Ở 4.1 bạn đã thấy lớp này "nên" tách; output này là <em>bằng chứng</em> để đưa vào đề xuất, và bài 4.4 nhân nó với độ phức tạp để xếp hạng chỗ nên bắt đầu.'}</p>

<h3>${en ? 'Repeated Switches — the same if-chain five times' : 'Repeated Switches — cùng một chuỗi if năm lần'}</h3>
<p>${en
  ? 'The 1st edition listed “Switch Statements” as a smell; in 2018 Fowler softened it to <strong>Repeated Switches</strong>: one switch is fine, the <em>same</em> switch in several places is the problem, because adding a case means finding all of them. The grep above already counts them: <code>if SV … else if GV … else</code> three times in BookServlet, once in <code>phi.js</code>, once in <code>muon.js</code>. Notice they are not even identical: the Java “else” means guest, the Node overdue check special-cases only GV. When the type is a String, nothing forces the five copies to agree. The cure is <em>Replace Conditional with Polymorphism</em> or at least one table of rules per type (Chapter 5.2); the OCP principle behind it is in Academy SWD392.'
  : 'Bản 1 liệt "Switch Statements" là smell; năm 2018 Fowler nói nhẹ lại thành <strong>Repeated Switches</strong> (switch lặp lại): một switch thì không sao, <em>cùng một</em> switch ở nhiều nơi mới là vấn đề, vì thêm một nhánh là phải đi tìm đủ. Grep ở trên đã đếm giúp: <code>if SV … else if GV … else</code> ba lần trong BookServlet, một lần ở <code>phi.js</code>, một lần ở <code>muon.js</code>. Để ý là chúng còn không giống hệt nhau: "else" của Java nghĩa là khách, còn kiểm tra quá hạn bên Node chỉ chừa riêng GV. Khi loại độc giả là một String, chẳng có gì bắt năm bản sao phải thống nhất. Thuốc là <em>Replace Conditional with Polymorphism</em> hoặc ít nhất một bảng luật theo loại (Chương 5.2); nguyên lý OCP phía sau đã có ở Academy SWD392.'}</p>

<h3>${en ? 'The duplicated check that matters most: who may come in' : 'Đoạn lặp đáng sợ nhất: kiểm tra ai được vào'}</h3>
${O43_AUTH}
<p>${en
  ? 'Five hand-written login checks, each reading the literal <code>"user"</code> — although <code>Constants.SESSION_USER</code> exists and the login servlet uses it to <em>write</em> the value. Rename the constant and every check silently compares against the wrong key. Worse: <code>ExportServlet</code> has no check at all (it is disabled in web.xml today; the day a ticket says “re-enable export”, the book list is public), and JSPs have none — Chapter 3.4 showed <code>report.jsp</code>, with readers’ names and overdue books, renders for a stranger. Security that must be copied by hand into every entry point will eventually be forgotten in one of them. In the Servlet world the single place is a <code>Filter</code> mapped to <code>/*</code> (PRJ301); in Spring, Spring Security’s filter chain; in Express, a middleware before the routers.'
  : 'Năm đoạn kiểm tra đăng nhập viết tay, đoạn nào cũng đọc chuỗi <code>"user"</code> — dù <code>Constants.SESSION_USER</code> có sẵn và servlet đăng nhập dùng nó để <em>ghi</em> giá trị. Đổi giá trị hằng là mọi đoạn kiểm tra lặng lẽ so với sai khoá. Tệ hơn: <code>ExportServlet</code> không kiểm tra gì cả (hôm nay nó bị tắt trong web.xml; hôm có ticket "bật lại xuất tệp", danh sách sách thành công khai), còn các JSP thì không có — bài 3.4 đã cho thấy <code>report.jsp</code>, có tên độc giả và sách quá hạn, hiện ra cho người lạ. Bảo mật mà phải chép tay vào từng cửa vào thì sớm muộn cũng có một cửa bị quên. Trong thế giới Servlet, chỗ duy nhất là một <code>Filter</code> gắn vào <code>/*</code> (PRJ301); với Spring là chuỗi filter của Spring Security; với Express là một middleware đặt trước các router.'}</p>

<h3>🕵️ ${en ? 'Hacker’s corner — goto fail (2014): one duplicated line' : 'Góc hacker — goto fail (2014): một dòng bị lặp'}</h3>
${C43_GOTOFAIL}
<p>${en
  ? 'In February 2014 Apple shipped iOS 7.0.6 to fix CVE-2014-1266. In the TLS code, a <code>goto fail;</code> had been duplicated — probably by a merge or a copy-paste. Without braces, the second <code>goto</code> always runs, skipping the signature check while <code>err</code> is still 0, i.e. “success”. Any attacker on the same Wi-Fi could impersonate any HTTPS site to iPhones and Macs. Two smells met: duplicated code and a long function (the check sat in a function with many sequential steps, so nobody read it closely). Lessons a maintainer can apply today: (1) a duplicated line is not always harmless — read every CPD finding in security code; (2) always use braces, and turn on the compiler/IDE warning for unreachable code (Clang has <code>-Wunreachable-code</code>; IntelliJ highlights it); (3) a test that sends a <em>bad</em> signature would have failed immediately — the Chapter 3 habit of testing the “no” paths.'
  : 'Tháng 2/2014, Apple phát hành iOS 7.0.6 để vá CVE-2014-1266. Trong code TLS, một dòng <code>goto fail;</code> bị lặp — có lẽ do merge hoặc copy-paste. Không có ngoặc nhọn, <code>goto</code> thứ hai luôn chạy, bỏ qua bước kiểm chữ ký trong khi <code>err</code> vẫn bằng 0, tức "thành công". Kẻ tấn công nào ngồi cùng mạng Wi-Fi cũng giả được bất kỳ trang HTTPS nào với iPhone và Mac. Hai smell gặp nhau: code lặp và hàm dài (đoạn kiểm nằm trong một hàm nhiều bước nối tiếp, nên không ai đọc kỹ). Bài học người bảo trì áp dụng được ngay: (1) một dòng lặp không phải lúc nào cũng vô hại — đọc mọi phát hiện CPD trong code bảo mật; (2) luôn dùng ngoặc nhọn, và bật cảnh báo code không chạy tới của trình biên dịch/IDE (Clang có <code>-Wunreachable-code</code>; IntelliJ tô sẵn); (3) một test gửi chữ ký <em>sai</em> sẽ đỏ ngay — thói quen ở Chương 3: test cả những nhánh "không".'}</p>
<p>${en
  ? 'The access-control version of the same smell is the number one web risk today: <strong>A01:2021 Broken Access Control</strong> in the OWASP Top 10, found in 94% of applications tested. Most of those are not clever attacks; they are one endpoint where the copied check was forgotten.'
  : 'Phiên bản kiểm soát truy cập của cùng smell này đang là rủi ro web số một: <strong>A01:2021 Broken Access Control</strong> trong OWASP Top 10, gặp ở 94% ứng dụng được kiểm. Phần lớn không phải tấn công tinh vi; mà là một endpoint bị quên đoạn kiểm tra chép tay.'}</p>

<h3>💼 ${en ? 'OJT situation' : 'Tình huống OJT'}</h3>
<p>${en
  ? 'Daily stand-up, your second ticket: “TV-95 — add NCS”. Yesterday you said “a few hours”. Today, after this grep, the honest update is: “Bigger than I said. 8 places in 2 repos plus the report procedure. I’ll post the list in the ticket and re-estimate to 1.5 days — or we limit TV-95 to the web app and open a follow-up for the mobile API.” Leaders do not punish re-estimates backed by a list; they punish surprises on the last day of the sprint.'
  : 'Họp đứng buổi sáng, ticket thứ hai của bạn: "TV-95 — thêm NCS". Hôm qua bạn nói "vài tiếng". Hôm nay, sau lệnh grep này, cập nhật trung thực là: "Lớn hơn em nói. 8 chỗ ở 2 repo cộng thủ tục báo cáo. Em dán danh sách vào ticket và ước lại 1,5 ngày — hoặc mình giới hạn TV-95 ở web, mở ticket tiếp theo cho API di động." Leader không phạt việc ước lại có kèm danh sách; họ phạt những bất ngờ vào ngày cuối sprint.'}</p>

<h3>🧪 ${en ? 'Practice (45 minutes)' : 'Thực hành (45 phút)'}</h3>
<div class="callout ok"><ol>
<li>${en ? 'Run CPD at 60, 40 and 25 tokens; run jscpd at 30, 20, 15. For each level, mark findings as real / noise.' : 'Chạy CPD ở 60, 40 và 25 token; chạy jscpd ở 30, 20, 15. Ở mỗi mức, đánh dấu phát hiện nào thật / nhiễu.'}</li>
<li>${en ? 'Write the impact list for ticket TV-96: “the overdue fine for students changes from 2,000 to 2,500 per day”. Include places that do not mention “SV”.' : 'Viết danh sách ảnh hưởng cho ticket TV-96: "phí quá hạn của sinh viên đổi từ 2.000 lên 2.500 một ngày". Tính cả những chỗ không ghi chữ "SV".'}</li>
<li>${en ? 'Run <code>git log --format= --name-only</code> on <code>header.jsp</code> and <code>login.jsp</code>: what were their reasons to change?' : 'Chạy <code>git log --format= --name-only</code> cho <code>header.jsp</code> và <code>login.jsp</code>: chúng bị sửa vì những lý do gì?'}</li>
</ol>
${giai(en ? 'Show the answer for step 2' : 'Xem đáp án bước 2', `<p>${en
  ? 'BookServlet.java:154 (<code>days * 2000</code>), <code>lib/phi.js:10</code>, <code>sp_overdue_report</code> (<code>* 2000</code>, used for every type — decide with the BA whether it should change for all), the 50,000 cap (does 25 days still hit the cap the same way? 20 days × 2,500 = 50,000 — the cap is now reached 5 days earlier), the Chapter 3 characterization tests that pin 18,000 (they <em>must</em> go red — that is the proof the change happened), and the Jest snapshot of <code>/qua-han</code>. No file contains “SV” and 2500 together — the list comes from searching the old value.'
  : 'BookServlet.java:154 (<code>days * 2000</code>), <code>lib/phi.js:10</code>, <code>sp_overdue_report</code> (<code>* 2000</code>, dùng cho mọi loại — hỏi BA xem có đổi cho tất cả không), trần 50.000 (20 ngày × 2.500 = 50.000 — giờ chạm trần sớm hơn 5 ngày), các characterization test Chương 3 đang khoá 18.000 (chúng <em>phải</em> đỏ — đó là bằng chứng thay đổi đã xảy ra), và snapshot Jest của <code>/qua-han</code>. Không tệp nào chứa cùng lúc "SV" và 2500 — danh sách đến từ việc tìm giá trị cũ.'}</p>`)}
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? 'your TV-96 list has at least 6 locations, each with file:line, and one open question for the BA.' : 'danh sách TV-96 của bạn có ít nhất 6 vị trí, mỗi vị trí có tệp:dòng, và một câu hỏi mở cho BA.'}</p></div>

<h3>🗂 ${en ? 'Key terms' : 'Thuật ngữ trong bài'}</h3>
${thuatNgu(en, [
  ['Duplicated Code', 'code lặp', 'Cùng cấu trúc ở nhiều nơi; CPD/jscpd tìm theo token.', 'The same structure in several places; CPD/jscpd find it by tokens.'],
  ['DRY', 'đừng lặp lại', 'Mỗi tri thức một biểu diễn duy nhất (Hunt & Thomas 1999) — về tri thức, không về chữ.', 'One authoritative representation per piece of knowledge — about knowledge, not text.'],
  ['Shotgun Surgery', 'phẫu thuật súng hoa cải', 'Một thay đổi bắt sửa nhiều chỗ nhỏ rải rác.', 'One change forces many small edits in many places.'],
  ['Divergent Change', 'thay đổi phân kỳ', 'Một module bị sửa vì nhiều lý do không liên quan.', 'One module changes for many unrelated reasons.'],
  ['Repeated Switches', 'switch lặp lại', 'Cùng một chuỗi điều kiện theo loại xuất hiện ở nhiều nơi.', 'The same type-based conditional in several places.'],
  ['Impact analysis', 'phân tích ảnh hưởng', 'Liệt kê mọi chỗ một thay đổi chạm tới, trước khi ước lượng.', 'Listing everything a change touches, before estimating.'],
])}
`
);

/* ═══════════════════ 4.4 — Công cụ ═══════════════════ */
const B44_CAI = bash(`
# legacy-express chạy Node 14 (.nvmrc) ⇒ ESLint 8 là dòng cuối còn chạy được (ESLint 9 cần Node ≥ 18.18)
nvm use                                # đọc .nvmrc ⇒ 14
npm i -D eslint@8.57.1 jscpd@3.5.10
`
);
const J44_RC = js(`
// .eslintrc.json — chỉ luật "hình dáng" (smell), chưa bật luật phong cách
{
  "root": true,
  "env": { "node": true, "es6": true },
  "parserOptions": { "ecmaVersion": 2018 },
  "ignorePatterns": ["node_modules/", "__tests__/"],
  "rules": {
    "complexity": ["warn", 10],
    "max-params": ["warn", 4],
    "max-lines-per-function": ["warn", { "max": 30, "skipBlankLines": true, "skipComments": true }],
    "max-depth": ["warn", 3],
    "max-nested-callbacks": ["warn", 2],
    "no-magic-numbers": ["warn", { "ignore": [0, 1, -1], "ignoreArrayIndexes": true }],
    "eqeqeq": "warn",
    "no-unused-vars": ["warn", { "args": "all" }]
  }
}
`
);
const O44_LAN1 = out(`
$ npx eslint .
/app/lib/phi.js
   9:19  warning  Expected '===' and instead saw '=='  eqeqeq
  10:17  warning  No magic number: 2000                no-magic-numbers
  ...
/app/routes/phieu.js
  11:32  warning  No magic number: 500                                 no-magic-numbers
  12:28  warning  Too many nested callbacks (3). Maximum allowed is 2  max-nested-callbacks
  ...
  24:34  warning  'req' is defined but never used                      no-unused-vars
/app/server.js
  2:32  warning  No magic number: 3000  no-magic-numbers

✖ 51 problems (0 errors, 51 warnings)
`
);
const O44_LAN2 = out(`
# sửa .eslintrc.json: "no-magic-numbers": ["warn", { "ignore": [0, 1, -1, 2, 200, 201, 400, 404, 409, 500, 3000], ... }]
$ npx eslint . -f unix | tail -1
36 problems
$ npx eslint . -f json | node -e "…đếm theo luật…"
{
  eqeqeq: 11,
  'no-magic-numbers': 10,
  'max-params': 1,
  'no-unused-vars': 2,
  'max-lines-per-function': 3,
  'max-nested-callbacks': 8,
  complexity: 1
}
`
);
const O44_PHUC_TAP = out(`
$ npx eslint --no-eslintrc --env node,es6 --parser-options ecmaVersion:2018 --rule "complexity: [warn, 1]" lib routes
/app/lib/kho.js
  6:74  warning  Function has a complexity of 3. Maximum allowed is 1  complexity
/app/lib/phi.js
  4:1  warning  Function 'tinhPhi' has a complexity of 5. Maximum allowed is 1  complexity
/app/routes/muon.js
  11:1    warning  Function 'taoPhieu' has a complexity of 3. Maximum allowed is 1  complexity
  21:18   warning  Function has a complexity of 3. Maximum allowed is 1             complexity
  25:22   warning  Function has a complexity of 3. Maximum allowed is 1             complexity
  29:22   warning  Function has a complexity of 14. Maximum allowed is 1            complexity
  59:104  warning  Function has a complexity of 2. Maximum allowed is 1             complexity
/app/routes/phieu.js
  10:20  warning  Function has a complexity of 3. Maximum allowed is 1  complexity
  14:24  warning  Function has a complexity of 3. Maximum allowed is 1  complexity
  25:20  warning  Function has a complexity of 2. Maximum allowed is 1  complexity
  27:24  warning  Function has a complexity of 5. Maximum allowed is 1  complexity
✖ 11 problems (0 errors, 11 warnings)
`
);
const J44_TINHPHI = js(`
function tinhPhi(phieu, docGia) {                  // 1  (đường thẳng)
  var tre = moment().diff(moment(phieu.hanTra), 'days', true);
  tre = Math.ceil(tre);
  if (tre <= 0) return 0;                          // +1 = 2
  var phi = 0;
  if (docGia.loai == 'SV') {                       // +1 = 3
    phi = tre * 2000;
    if (phi > 50000) phi = 50000;                  // +1 = 4
  } else if (docGia.loai == 'GV') {                // +1 = 5
    phi = tre * 1000;
  } else {                                         // else không tạo quyết định mới
    phi = tre * 5000;
  }
  return phi;
}
`
);
const O44_RATCHET = out(`
$ npx eslint . --max-warnings 36 > /dev/null; echo "exit $?"
exit 0
$ npx eslint . --max-warnings 35 > /dev/null; echo "exit $?"
ESLint found too many warnings (maximum: 35).
exit 1
$ mvn -B pmd:check -Dpmd.failOnViolation=false | tail -3
[WARNING] PMD Failure: com.thuvien.util.Constants:3 Rule:DataClass Priority:3 The class 'Constants' is suspected to be a Data Class (WOC=0.000%, NOPA=4, NOAM=0, WMC=0).
[WARNING] PMD 7.7.0 has found 12 violations. For more details see: /src/target/pmd.xml
[INFO] BUILD SUCCESS
`
);

const L44 = ml((en) => `
<span class="eyebrow">${en ? 'Chapter 4 · Code smells: naming what feels wrong' : 'Chương 4 · Code smell: gọi tên cái cảm giác "sai sai"'}</span>
<h2>${en ? '4.4 — Tools that smell for you: IDE inspections, SonarLint, ESLint, complexity' : '4.4 — Công cụ ngửi giúp bạn: inspection IDE, SonarLint, ESLint, độ phức tạp'}</h2>
<p class="lead">${en
  ? 'A smoke detector does not put out fires and it beeps at burnt toast. You still install one in every room, you learn which beeps matter, and you do not rip it off the ceiling because it is annoying. Static analysis tools are smoke detectors for code: cheap, tireless, often noisy. This lesson is about installing them on an old project without drowning, and about the one number that tells you where to look first.'
  : 'Máy báo khói không dập lửa, và nó còn kêu khi bánh mì nướng hơi khét. Bạn vẫn gắn mỗi phòng một cái, học xem tiếng kêu nào đáng quan tâm, và không giật nó khỏi trần nhà chỉ vì phiền. Công cụ phân tích tĩnh là máy báo khói cho code: rẻ, không biết mệt, hay kêu nhầm. Bài này nói về cách gắn chúng lên một dự án cũ mà không bị chìm, và về con số cho biết nên nhìn chỗ nào trước.'}</p>
${moiTruong(en)}

<h3>${en ? 'Three layers of tooling, one set of smells' : 'Ba lớp công cụ, một bộ smell'}</h3>
<table>
<tr><th>${en ? 'Layer' : 'Lớp'}</th><th>Java</th><th>Node</th><th>${en ? 'When it runs' : 'Chạy khi nào'}</th></tr>
<tr><td>${en ? 'In the editor' : 'Trong trình soạn'}</td><td>${en ? 'IntelliJ inspections; SonarLint (renamed “SonarQube for IDE” in 2024)' : 'Inspection của IntelliJ; SonarLint (đổi tên "SonarQube for IDE" từ 2024)'}</td><td>${en ? 'ESLint extension in VS Code; SonarLint' : 'Extension ESLint trong VS Code; SonarLint'}</td><td>${en ? 'as you type — only the file you have open' : 'khi bạn gõ — chỉ tệp đang mở'}</td></tr>
<tr><td>${en ? 'In the build' : 'Trong bản build'}</td><td>PMD + CPD (maven-pmd-plugin), Checkstyle, SpotBugs</td><td>ESLint CLI, jscpd</td><td>${en ? 'every <code>mvn verify</code> / <code>npm run lint</code> — the whole project' : 'mỗi lần <code>mvn verify</code> / <code>npm run lint</code> — toàn dự án'}</td></tr>
<tr><td>${en ? 'On a server' : 'Trên máy chủ'}</td><td colspan="2">${en ? 'SonarQube / SonarCloud: history, trends, “new code” quality gate' : 'SonarQube / SonarCloud: lịch sử, xu hướng, cổng chất lượng cho "code mới"'}</td><td>${en ? 'in CI on every push' : 'trong CI ở mỗi lần push'}</td></tr>
</table>
<p>${en
  ? 'They detect the same catalogue under different rule names. The mapping you need for code review:'
  : 'Chúng bắt cùng một danh mục dưới các tên luật khác nhau. Bảng đối chiếu bạn cần khi review:'}</p>
<table>
<tr><th>Smell</th><th>PMD 7</th><th>Sonar (Java)</th><th>ESLint</th><th>IntelliJ</th></tr>
<tr><td>Long Function</td><td>NcssCount</td><td>S138</td><td>max-lines-per-function</td><td>Overly long method</td></tr>
<tr><td>${en ? 'Complex function' : 'Hàm phức tạp'}</td><td>CyclomaticComplexity, CognitiveComplexity</td><td>S3776 (cognitive)</td><td>complexity</td><td>Overly complex method</td></tr>
<tr><td>Long Parameter List</td><td>ExcessiveParameterList</td><td>S107</td><td>max-params</td><td>Method with too many parameters</td></tr>
<tr><td>${en ? 'Deep nesting' : 'Lồng sâu'}</td><td>AvoidDeeplyNestedIfStmts</td><td>S134</td><td>max-depth, max-nested-callbacks</td><td>Overly nested method</td></tr>
<tr><td>${en ? 'Duplicated literal / code' : 'Literal / code lặp'}</td><td>AvoidDuplicateLiterals, CPD</td><td>S1192, ${en ? 'duplication metric' : 'chỉ số trùng lặp'}</td><td>jscpd</td><td>${en ? 'Duplicated code fragment' : 'Duplicated code fragment'}</td></tr>
<tr><td>Magic Number</td><td>${en ? '— (Checkstyle: MagicNumber)' : '— (Checkstyle: MagicNumber)'}</td><td>S109</td><td>no-magic-numbers</td><td>Magic number</td></tr>
<tr><td>${en ? 'Hard-coded secret' : 'Bí mật viết cứng'}</td><td>—</td><td>S2068, S6418</td><td>${en ? '(plugin)' : '(plugin)'}</td><td>${en ? '— (use SonarLint)' : '— (dùng SonarLint)'}</td></tr>
</table>
<p>${en
  ? 'IntelliJ’s metric inspections (Settings → Editor → Inspections → Java → Method metrics / Class metrics) are <em>off by default</em>; turn them on for a legacy project and run <em>Code → Inspect Code</em> on the whole module to get a list like PMD’s. Installing SonarLint and the IDE plugins is covered in the IDE course; this course does not screenshot IDEs — every number here comes from the command-line tools, which give the same findings and can run in CI.'
  : 'Các inspection đo chỉ số của IntelliJ (Settings → Editor → Inspections → Java → Method metrics / Class metrics) <em>tắt sẵn</em>; bật lên cho dự án cũ rồi chạy <em>Code → Inspect Code</em> trên cả module để có danh sách giống PMD. Cài SonarLint và các plugin IDE đã có ở khoá IDE; khoá này không chụp màn hình IDE — mọi con số ở đây đến từ công cụ dòng lệnh, cho cùng phát hiện và chạy được trong CI.'}</p>
${lk(bai('ide-va-do-nghe-dev', 'ide-2-5-cong-cu-kem'), '🧰', en ? 'IDE course 2.5 — SonarLint, Maven and other plugins' : 'Khoá IDE 2.5 — SonarLint, Maven và các plugin khác', en ? 'Install and configure in IntelliJ' : 'Cài đặt và cấu hình trong IntelliJ')}

<h3>${en ? 'ESLint on a Node 14 project — first run, then tune' : 'ESLint trên dự án Node 14 — chạy lần đầu, rồi chỉnh'}</h3>
${B44_CAI}
<p>${en
  ? 'Note the version constraint — an everyday legacy lesson: the newest ESLint (9) needs Node 18.18+, so on a Node 14 project you install the last 8.x. Chapter 7.4 upgrades Node; until then, tools follow the runtime. The configuration turns on only shape rules:'
  : 'Để ý ràng buộc phiên bản — bài học thường ngày của code cũ: ESLint mới nhất (9) cần Node 18.18 trở lên, nên dự án Node 14 cài bản 8.x cuối cùng. Chương 7.4 sẽ nâng Node; tới lúc đó, công cụ phải theo runtime. Cấu hình chỉ bật luật hình dáng:'}</p>
${J44_RC}
${O44_LAN1}
<p>${en
  ? 'Fifty-one warnings for 141 lines of code. If you open a PR that says “51 problems”, the team will add <code>// eslint-disable</code> and move on. Read before you fix: 15 of them are <code>no-magic-numbers</code> on HTTP codes (<code>res.status(500)</code>), the port <code>3000</code> and the JSON indent <code>2</code> — numbers whose meaning is obvious. Tune the rule, run again, count per rule:'
  : 'Năm mươi mốt cảnh báo cho 141 dòng code. Nếu bạn mở PR ghi "51 problems", cả đội sẽ thêm <code>// eslint-disable</code> rồi đi tiếp. Đọc trước khi sửa: 15 cảnh báo là <code>no-magic-numbers</code> cho mã HTTP (<code>res.status(500)</code>), cổng <code>3000</code> và độ thụt JSON <code>2</code> — những con số nghĩa đã rõ. Chỉnh luật, chạy lại, đếm theo từng luật:'}</p>
${O44_LAN2}
<p>${en
  ? 'Thirty-six, and now every line means something: 11 loose equalities (<code>==</code> — the <code>"abc"</code> id bug from Chapter 3 lives there), 10 business magic numbers, 8 callback nesting levels (the shape of pre-<code>async/await</code> Node), one 8-parameter function, one function of complexity 14. A tuned 36 is more useful than a raw 51, because people will read it.'
  : 'Ba mươi sáu, và giờ dòng nào cũng có nghĩa: 11 phép so sánh lỏng (<code>==</code> — bug id <code>"abc"</code> ở Chương 3 nằm ở đó), 10 số ma thuật nghiệp vụ, 8 tầng callback lồng nhau (hình dáng của Node thời trước <code>async/await</code>), một hàm 8 tham số, một hàm độ phức tạp 14. 36 cảnh báo đã chỉnh có ích hơn 51 cảnh báo thô, vì người ta sẽ đọc nó.'}</p>

<h3>${en ? 'Cyclomatic vs cognitive complexity — compute one by hand' : 'Cyclomatic và cognitive complexity — tự tính một lần bằng tay'}</h3>
<p>${en
  ? 'Set the threshold to 1 and ESLint prints the cyclomatic complexity of every function that has at least one branch:'
  : 'Đặt ngưỡng 1 thì ESLint in độ phức tạp cyclomatic của mọi hàm có ít nhất một nhánh:'}</p>
${O44_PHUC_TAP}
<p>${en
  ? 'Check <code>tinhPhi</code> = 5 yourself. McCabe’s shortcut for structured code: <strong>1 + the number of decisions</strong> (<code>if</code>, <code>else if</code>, loop, <code>case</code>, <code>&amp;&amp;</code>, <code>||</code>, <code>?:</code>, <code>catch</code>):'
  : 'Tự kiểm <code>tinhPhi</code> = 5. Cách tính nhanh của McCabe cho code có cấu trúc: <strong>1 + số điểm quyết định</strong> (<code>if</code>, <code>else if</code>, vòng lặp, <code>case</code>, <code>&amp;&amp;</code>, <code>||</code>, <code>?:</code>, <code>catch</code>):'}</p>
${J44_TINHPHI}
<p>${en
  ? 'Cyclomatic complexity (Thomas McCabe, IEEE Transactions on Software Engineering, 1976) counts <em>paths</em> — it tells you the minimum number of tests to cover every branch, which is why testers love it (Academy SWT301 3.4 drills the graph version for exams). But it treats a flat sequence of 10 <code>if</code>s and 10 <code>if</code>s nested inside each other as equally complex, and any human knows they are not. <strong>Cognitive complexity</strong> (G. Ann Campbell, SonarSource white paper, 2017) adds a penalty for each level of nesting and does not punish a clean <code>switch</code>. That is why PMD gave <code>doPost</code> cyclomatic 20 but cognitive 36: its branches sit inside <code>try</code> inside <code>if/else if</code> chains. Use cyclomatic to size your tests, cognitive to decide what a human cannot safely read.'
  : 'Cyclomatic complexity (Thomas McCabe, IEEE Transactions on Software Engineering, 1976) đếm <em>đường đi</em> — nó cho biết số test tối thiểu để phủ mọi nhánh, nên dân kiểm thử rất chuộng (Academy SWT301 3.4 luyện bản đồ thị cho kỳ thi). Nhưng nó coi một dãy 10 <code>if</code> nối tiếp và 10 <code>if</code> lồng vào nhau là phức tạp như nhau, trong khi ai đọc code cũng biết là không. <strong>Cognitive complexity</strong> (G. Ann Campbell, sách trắng của SonarSource, 2017) cộng thêm điểm phạt cho mỗi tầng lồng và không phạt một <code>switch</code> gọn gàng. Vì vậy PMD cho <code>doPost</code> cyclomatic 20 nhưng cognitive 36: các nhánh của nó nằm trong <code>try</code>, trong chuỗi <code>if/else if</code>. Dùng cyclomatic để định cỡ bộ test, dùng cognitive để quyết định chỗ nào con người không đọc an toàn được.'}</p>
${lk(academy('software-testing', 'swt301-static-analysis'), '🎓', en ? 'Academy SWT301 3.4 — static analysis and cyclomatic complexity (exam version)' : 'Academy SWT301 3.4 — phân tích tĩnh và cyclomatic complexity (bản thi)', en ? 'Control-flow graphs, V(G) = E − N + 2' : 'Đồ thị luồng điều khiển, V(G) = E − N + 2')}

<h3>${en ? 'Do not fix every warning — fix where the code changes' : 'Đừng sửa mọi cảnh báo — sửa ở chỗ code hay thay đổi'}</h3>
<p>${en
  ? 'You now have 12 PMD findings, 2 CPD clones, 36 ESLint warnings and 5 jscpd clones. Fixing all of them is weeks of work with zero visible value to the customer — and every fix is a chance to break something. The question is <em>which</em> ones. Adam Tornhill’s answer (<em>Your Code as a Crime Scene</em>, 2015): complex code that nobody touches is a sleeping dog; complex code that changes every month is where bugs are born. A <strong>hotspot</strong> = complexity × change frequency. You already have both inputs: complexity from PMD, change frequency from <code>git log --name-only</code> (4.3). BookServlet: WMC 25 × 6 commits = 150; the next file, LoginServlet, scores 22. Lab 4.5 builds the full table with a 40-line script. The ranking is what turns a smell report into a plan a leader can approve.'
  : 'Giờ bạn có 12 phát hiện PMD, 2 bản chép CPD, 36 cảnh báo ESLint và 5 bản chép jscpd. Sửa hết là vài tuần công mà khách không thấy giá trị gì — và mỗi lần sửa là một cơ hội làm hỏng thứ gì đó. Câu hỏi là sửa <em>những cái nào</em>. Câu trả lời của Adam Tornhill (<em>Your Code as a Crime Scene</em>, 2015): code phức tạp mà không ai đụng là con chó đang ngủ; code phức tạp mà tháng nào cũng sửa mới là nơi bug sinh ra. <strong>Hotspot</strong> (điểm nóng) = độ phức tạp × tần suất thay đổi. Bạn đã có đủ hai đầu vào: độ phức tạp từ PMD, tần suất từ <code>git log --name-only</code> (4.3). BookServlet: WMC 25 × 6 commit = 150; tệp đứng sau, LoginServlet, được 22. Lab 4.5 dựng bảng đầy đủ bằng một script 40 dòng. Chính bảng xếp hạng này biến báo cáo smell thành một kế hoạch mà leader duyệt được.'}</p>

<h3>${en ? 'Adding tools to an old project without a war: the ratchet' : 'Gắn công cụ vào dự án cũ mà không gây chiến: con cóc (ratchet)'}</h3>
${O44_RATCHET}
<p>${en
  ? 'A ratchet turns one way only. Record today’s count as the maximum, fail the build only when it goes <em>up</em>, lower the number whenever someone removes a warning. <code>--max-warnings 36</code> passes today and fails the moment anyone adds a 37th. For PMD, start with <code>failOnViolation=false</code> so the report exists without breaking the build, then make the rules that matter fail. SonarQube does the same thing with its “new code” quality gate: old debt is reported, new debt is blocked. Never turn on 200 rules as errors on a legacy project on a Friday.'
  : 'Bánh cóc chỉ quay một chiều. Ghi số cảnh báo hôm nay làm mức tối đa, chỉ cho build đỏ khi con số <em>tăng</em>, hạ mức mỗi khi có người dọn bớt một cảnh báo. <code>--max-warnings 36</code> qua hôm nay và đỏ ngay khi có người thêm cảnh báo thứ 37. Với PMD, bắt đầu bằng <code>failOnViolation=false</code> để có báo cáo mà không làm hỏng build, rồi mới bật chặn cho những luật quan trọng. SonarQube làm điều tương tự bằng cổng chất lượng cho "code mới": nợ cũ thì báo, nợ mới thì chặn. Đừng bao giờ bật 200 luật thành lỗi trên một dự án cũ vào chiều thứ Sáu.'}</p>

<h3>🕵️ ${en ? 'Real incident — when complexity is evidence in court' : 'Sự cố thật — khi độ phức tạp thành bằng chứng trước toà'}</h3>
<p>${en
  ? 'In October 2013 an Oklahoma jury found Toyota liable in <em>Bookout v. Toyota</em>, a case about unintended acceleration of a 2005 Camry. Embedded-software expert Michael Barr and his team spent months reviewing the engine-control source code. Among his findings presented to the court: dozens of functions with cyclomatic complexity above 50 (which he called untestable), the function computing the throttle angle above 100, and thousands of global variables. Complexity metrics did not prove the cause of the crash alone, but they were part of the argument that the code could not be adequately tested or reviewed. For a maintainer, the lesson is concrete: a complexity number is not an academic score — it is a statement about how many tests you would need and whether anyone can review the code safely. When your report says “cognitive 36”, you are saying “this method cannot be safely changed without the Chapter 3 net”.'
  : 'Tháng 10/2013, bồi thẩm đoàn ở Oklahoma tuyên Toyota phải chịu trách nhiệm trong vụ <em>Bookout v. Toyota</em>, về một chiếc Camry 2005 tự tăng tốc ngoài ý muốn. Chuyên gia phần mềm nhúng Michael Barr cùng nhóm mất nhiều tháng đọc mã nguồn điều khiển động cơ. Trong số phát hiện trình trước toà: hàng chục hàm có cyclomatic complexity trên 50 (ông gọi là không thể kiểm thử), hàm tính góc mở bướm ga trên 100, và hàng nghìn biến toàn cục. Chỉ số độ phức tạp tự nó không chứng minh nguyên nhân vụ tai nạn, nhưng là một phần lập luận rằng code đó không thể được kiểm thử hay review đầy đủ. Với người bảo trì, bài học rất cụ thể: con số độ phức tạp không phải điểm học thuật — nó là lời khẳng định cần bao nhiêu test và liệu có ai review được code an toàn không. Khi báo cáo của bạn ghi "cognitive 36", bạn đang nói "hàm này không thể sửa an toàn nếu thiếu tấm lưới Chương 3".'}</p>

<h3>💼 ${en ? 'OJT situation' : 'Tình huống OJT'}</h3>
<p>${en
  ? 'The project has no lint at all. You want to add ESLint in your first month. Do not open a PR that fixes 51 warnings in 6 files — it will conflict with everyone’s work and nobody can review it. Open one PR that adds the tools, the tuned config and <code>--max-warnings 36</code> in <code>npm run lint</code>, changes <em>zero</em> lines of application code, and pastes the per-rule counts in the description. Fixes come later, one file at a time, inside tickets that touch that file anyway (the “boy scout rule”, Chapter 5.5).'
  : 'Dự án chưa có lint gì cả. Bạn muốn thêm ESLint trong tháng đầu. Đừng mở một PR sửa 51 cảnh báo trên 6 tệp — nó xung đột với việc của mọi người và không ai review nổi. Mở một PR chỉ thêm công cụ, cấu hình đã chỉnh và <code>--max-warnings 36</code> vào <code>npm run lint</code>, sửa <em>không</em> dòng code ứng dụng nào, và dán bảng đếm theo luật vào mô tả. Việc sửa để sau, từng tệp một, nằm trong các ticket vốn đã đụng tới tệp đó (quy tắc hướng đạo sinh, Chương 5.5).'}</p>

<h3>🧪 ${en ? 'Practice (40 minutes)' : 'Thực hành (40 phút)'}</h3>
<div class="callout ok"><ol>
<li>${en ? 'Install ESLint 8 + jscpd in <code>legacy-express</code> with Node 14; reproduce 51 → 36.' : 'Cài ESLint 8 + jscpd vào <code>legacy-express</code> bằng Node 14; tái hiện 51 → 36.'}</li>
<li>${en ? 'Compute by hand the cyclomatic complexity of the <code>/qua-han</code> callback (ESLint says 5) and of <code>LoginServlet.doGet</code> (PMD says 7).' : 'Tự tính bằng tay cyclomatic complexity của callback <code>/qua-han</code> (ESLint nói 5) và của <code>LoginServlet.doGet</code> (PMD nói 7).'}</li>
<li>${en ? 'Add <code>"lint": "eslint . --max-warnings 36"</code> to <code>package.json</code>; prove it fails after you add one <code>==</code>.' : 'Thêm <code>"lint": "eslint . --max-warnings 36"</code> vào <code>package.json</code>; chứng minh nó đỏ sau khi bạn thêm một <code>==</code>.'}</li>
</ol>
${giai(en ? 'Show the count for LoginServlet.doGet' : 'Xem cách đếm LoginServlet.doGet', `<p>${en
  ? '1 + <code>if (logout)</code> + <code>if (cookies != null)</code> + <code>for</code> + <code>if (name.equals…</code> + <code>&amp;&amp;</code> + <code>if (makeToken…)</code> = 7. Cognitive adds a nesting penalty: +1 <code>if (logout)</code>, +1 <code>if (cookies)</code>, +2 <code>for</code> (nesting 1), +3 <code>if (name…)</code> (nesting 2), +1 <code>&amp;&amp;</code>, +4 <code>if (makeToken…)</code> (nesting 3) = 12.'
  : '1 + <code>if (logout)</code> + <code>if (cookies != null)</code> + <code>for</code> + <code>if (name.equals…</code> + <code>&amp;&amp;</code> + <code>if (makeToken…)</code> = 7. Cognitive cộng thêm điểm phạt theo tầng lồng: +1 <code>if (logout)</code>, +1 <code>if (cookies)</code>, +2 <code>for</code> (lồng 1 tầng), +3 <code>if (name…)</code> (lồng 2), +1 <code>&amp;&amp;</code>, +4 <code>if (makeToken…)</code> (lồng 3) = 12.'}</p>`)}
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? 'both repos produce a smell report from one command each, and adding a smell makes the build fail.' : 'cả hai repo ra được báo cáo smell bằng một lệnh mỗi bên, và thêm một smell thì build đỏ.'}</p></div>

<h3>🗂 ${en ? 'Key terms' : 'Thuật ngữ trong bài'}</h3>
${thuatNgu(en, [
  ['Static analysis', 'phân tích tĩnh', 'Đọc mã mà không chạy nó để tìm lỗi/smell (PMD, ESLint, Sonar).', 'Analysing code without running it (PMD, ESLint, Sonar).'],
  ['Inspection', 'kiểm tra của IDE', 'Phân tích tĩnh chạy trong trình soạn, tô ngay khi gõ.', 'Static analysis inside the editor, highlighted as you type.'],
  ['Cognitive complexity', 'độ phức tạp nhận thức', 'Như cyclomatic nhưng phạt thêm theo tầng lồng (SonarSource 2017).', 'Like cyclomatic but penalises nesting (SonarSource 2017).'],
  ['Hotspot', 'điểm nóng', 'Độ phức tạp × tần suất thay đổi — nơi nên refactor trước.', 'Complexity × change frequency — where to refactor first.'],
  ['Ratchet / baseline', 'bánh cóc / mốc nền', 'Chỉ chặn khi số cảnh báo tăng so với mốc; nợ cũ báo, nợ mới chặn.', 'Fail only when the count rises above the baseline.'],
  ['Quality gate', 'cổng chất lượng', 'Điều kiện CI phải qua (vd: code mới không có smell nặng).', 'A CI condition to pass (e.g. no major issues in new code).'],
])}
`
);

/* ═══════════════════ 4.5 — Lab ═══════════════════ */
const O45_DIEM_NONG = out(`
$ mvn -B -q pmd:pmd -Dpmd.boLuat=tools/do-phuc-tap.xml -Dformat=xml
$ python3 diem-nong.py master
 điểm  sửa  WMC cogMax  tệp
  150    6   25     36  servlet/BookServlet.java
   22    2   11     12  servlet/LoginServlet.java
   12    1   12      0  model/Book.java
   10    1   10      4  servlet/ReaderServlet.java
    8    1    8      5  util/DBUtil.java
    8    1    8      0  model/Reader.java
    7    1    7      2  dao/BookDAO.java
    5    1    5      4  servlet/ReportServlet.java
    4    1    4      3  servlet/ExportServlet.java
    2    1    2      1  util/TokenUtil.java
    0    2    0      0  util/Constants.java
    0    1    0      0  model/Loan.java
`
);
const P45_SCRIPT = `<pre><code class="language-python">${`#!/usr/bin/env python3
# diem-nong.py — xếp tệp Java theo "điểm nóng" = số lần sửa (git) × độ phức tạp (PMD). Lab 4.5.
import re, subprocess, sys, xml.etree.ElementTree as ET
from collections import Counter

nhanh = sys.argv[1] if len(sys.argv) > 1 else 'master'
log = subprocess.run(['git', 'log', nhanh, '--format=', '--name-only', '--', 'src/main/java'],
                     capture_output=True, text=True, check=True).stdout
churn = Counter(l for l in log.splitlines() if l.endswith('.java'))

ns = {'p': 'http://pmd.sourceforge.net/report/2.0.0'}
wmc, cog = {}, Counter()
for f in ET.parse('target/pmd.xml').getroot().findall('p:file', ns):
    ten = 'src/main/java/' + f.get('name').split('/src/main/java/')[-1]
    for v in f.findall('p:violation', ns):
        msg = v.text.strip()
        m = re.search(r"total cyclomatic complexity of (\\d+)", msg)
        if m: wmc[ten] = int(m.group(1))
        m = re.search(r"cognitive complexity of (\\d+)", msg)
        if m: cog[ten] = max(cog[ten], int(m.group(1)))

hang = sorted(((churn[t] * wmc.get(t, 0), churn[t], wmc.get(t, 0), cog[t], t)
               for t in set(churn) | set(wmc)), reverse=True)
print(f"{'điểm':>5} {'sửa':>4} {'WMC':>4} {'cogMax':>6}  tệp")
for d, c, w, g, t in hang:
    print(f"{d:>5} {c:>4} {w:>4} {g:>6}  {t.replace('src/main/java/com/thuvien/', '')}")`.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;

const L45 = ml((en) => `
<span class="eyebrow">${en ? 'Chapter 4 · Lab' : 'Chương 4 · Lab'}</span>
<h2>${en ? '4.5 — Lab: A smell report for the legacy app, ranked by risk' : '4.5 — Lab: Báo cáo smell cho ứng dụng cũ, xếp theo rủi ro'}</h2>
<p class="lead">${en
  ? 'A doctor who says “you look unwell” is useless; one who says “blood pressure 160/100, start here, come back in two weeks” is worth paying. This lab produces the second kind of document for the library app: every smell with a location, a name, evidence and a proposed treatment — ranked, so the team knows where Chapter 5 should start.'
  : 'Bác sĩ nói "trông anh không khoẻ" thì vô dụng; bác sĩ nói "huyết áp 160/100, bắt đầu từ đây, hai tuần nữa quay lại" mới đáng tiền. Lab này làm ra loại tài liệu thứ hai cho ứng dụng thư viện: mỗi smell có vị trí, tên, bằng chứng và đề xuất điều trị — có xếp hạng, để cả đội biết Chương 5 nên bắt đầu từ đâu.'}</p>
${moiTruong(en)}

<h3>${en ? 'The ticket' : 'Ticket'}</h3>
<div class="callout"><p><strong>LIB-104 · ${en ? 'Smell report before the refactoring sprint' : 'Báo cáo smell trước sprint refactor'}</strong></p>
<p>${en
  ? 'The customer has approved one sprint of “technical improvement” on the library system, but wants to know <em>what</em> will be improved and <em>why those parts first</em>. Deliver a smell report covering both repositories (<code>legacy-thu-vien</code> and <code>legacy-express</code>), at most two pages, that a non-developer project manager can read.'
  : 'Khách đã duyệt một sprint "cải thiện kỹ thuật" cho hệ thống thư viện, nhưng muốn biết sẽ cải thiện <em>cái gì</em> và <em>vì sao làm mấy phần đó trước</em>. Giao một báo cáo smell cho cả hai repo (<code>legacy-thu-vien</code> và <code>legacy-express</code>), tối đa hai trang, PM không làm lập trình cũng đọc được.'}</p></div>

<h3>${en ? 'Requirements' : 'Yêu cầu'}</h3>
<ol>
<li>${en ? '<strong>Machine evidence.</strong> PMD (smell ruleset), CPD, ESLint (tuned config) and jscpd run from one command per repo; paste the totals.' : '<strong>Bằng chứng từ máy.</strong> PMD (bộ luật smell), CPD, ESLint (cấu hình đã chỉnh) và jscpd chạy bằng một lệnh cho mỗi repo; dán con số tổng.'}</li>
<li>${en ? '<strong>Hotspot table</strong> for the Java repo: change count × complexity, from <code>git log</code> + PMD. Write the script yourself (≤ 50 lines, any language).' : '<strong>Bảng điểm nóng</strong> cho repo Java: số lần sửa × độ phức tạp, từ <code>git log</code> + PMD. Tự viết script (≤ 50 dòng, ngôn ngữ nào cũng được).'}</li>
<li>${en ? '<strong>At least 10 smells</strong>, each as one row: ID · location (file:line) · catalogue name · evidence (number or output) · proposed refactoring (Fowler name) · priority with a reason.' : '<strong>Ít nhất 10 smell</strong>, mỗi smell một dòng: mã · vị trí (tệp:dòng) · tên trong danh mục · bằng chứng (con số hoặc output) · refactoring đề xuất (tên theo Fowler) · độ ưu tiên kèm lý do.'}</li>
<li>${en ? 'At least <strong>one Node smell found by running the code</strong> (not only by reading), with the command and output.' : 'Ít nhất <strong>một smell phía Node tìm ra bằng cách chạy code</strong> (không chỉ đọc), kèm lệnh và output.'}</li>
<li>${en ? '<strong>Security findings separated</strong> from design smells, and secrets not copied into the report.' : '<strong>Tách riêng phát hiện bảo mật</strong> khỏi smell thiết kế, và không chép bí mật vào báo cáo.'}</li>
<li>${en ? '<strong>Top 3 for the sprint</strong>, with a rough estimate each and what test net exists (Chapter 3) before touching it.' : '<strong>Top 3 cho sprint</strong>, mỗi mục có ước lượng thô và tấm lưới test nào đã có (Chương 3) trước khi đụng vào.'}</li>
</ol>

<h3>${en ? 'Hints, one level at a time' : 'Gợi ý, từng bậc một'}</h3>
${giai(en ? 'Hint 1 — where to start' : 'Gợi ý 1 — bắt đầu từ đâu', `<p>${en
  ? 'Lessons 4.1–4.4 already gave you about 15 findings with outputs. Start the table from those, then look for what tools cannot see: JSP scriptlets, the stored procedure, rules duplicated across languages, the race in <code>routes/muon.js</code>.'
  : 'Bài 4.1–4.4 đã cho bạn khoảng 15 phát hiện kèm output. Bắt đầu bảng từ đó, rồi tìm những thứ công cụ không thấy: scriptlet JSP, stored procedure, luật trùng qua các ngôn ngữ, race trong <code>routes/muon.js</code>.'}</p>`)}
${giai(en ? 'Hint 2 — the hotspot script' : 'Gợi ý 2 — script điểm nóng', `<p>${en
  ? 'Two inputs: <code>git log master --format= --name-only -- src/main/java</code> (count lines per file) and PMD with <code>tools/do-phuc-tap.xml</code> (threshold 1, so every class reports its total cyclomatic complexity = WMC). Join by file path; multiply; sort.'
  : 'Hai đầu vào: <code>git log master --format= --name-only -- src/main/java</code> (đếm số dòng theo từng tệp) và PMD với <code>tools/do-phuc-tap.xml</code> (ngưỡng 1, nên lớp nào cũng báo tổng cyclomatic = WMC). Ghép theo đường dẫn tệp; nhân; sắp xếp.'}</p>`)}
${giai(en ? 'Hint 3 — how to rank' : 'Gợi ý 3 — xếp hạng thế nào', `<p>${en
  ? 'Priority = (hotspot score or “will change soon”: is there a ticket in the backlog touching it?) × (damage if it breaks: money, data, security) ÷ (cost: is there a test net?). A complex file nobody will touch this year goes to the bottom, however ugly.'
  : 'Ưu tiên = (điểm nóng hoặc "sắp phải sửa": backlog có ticket đụng tới không?) × (thiệt hại nếu hỏng: tiền, dữ liệu, bảo mật) ÷ (chi phí: đã có lưới test chưa?). Tệp phức tạp mà năm nay không ai đụng thì xuống cuối, xấu mấy cũng mặc.'}</p>`)}

<h3>${en ? 'Reference solution' : 'Lời giải tham khảo'}</h3>
${giai(en ? 'Show the hotspot script and its output' : 'Xem script điểm nóng và output', `${P45_SCRIPT}${O45_DIEM_NONG}<p>${en
  ? 'BookServlet scores 150, seven times the next file. That single number is the argument for the sprint: the most complex file is also the most changed, and it already has a 16-test net from Chapter 3. Note what the table cannot see: <code>header.jsp</code> and <code>sp_overdue_report</code> (not Java), and the whole Node repo (no history in the lab zip — use ESLint complexity there).'
  : 'BookServlet được 150, gấp bảy lần tệp đứng sau. Một con số đó là lý lẽ cho cả sprint: tệp phức tạp nhất cũng là tệp bị sửa nhiều nhất, và nó đã có tấm lưới 16 test từ Chương 3. Để ý thứ bảng không thấy: <code>header.jsp</code> và <code>sp_overdue_report</code> (không phải Java), và cả repo Node (zip lab không kèm lịch sử — ở đó dùng độ phức tạp của ESLint).'}</p>`)}
${giai(en ? 'Show a reference smell table (12 rows)' : 'Xem bảng smell tham khảo (12 dòng)', `<table>
<thead><tr><th>#</th><th>${en ? 'Location' : 'Vị trí'}</th><th>Smell</th><th>${en ? 'Evidence' : 'Bằng chứng'}</th><th>Refactoring</th><th>${en ? 'Priority' : 'Ưu tiên'}</th></tr></thead>
<tbody>
<tr><td>S1</td><td>BookServlet.java:73 doPost</td><td>Long Function</td><td>NCSS 111, cyclomatic 20, cognitive 36; hotspot 150</td><td>Extract Function ${en ? 'per action' : 'theo action'}</td><td>${en ? '1 — hottest file, net exists' : '1 — tệp nóng nhất, đã có lưới'}</td></tr>
<tr><td>S2</td><td>BookServlet.java:102/122/153, phi.js:9, muon.js:37</td><td>Repeated Switches</td><td>${en ? '5 copies, already disagree (Java &gt; vs Node &gt;=)' : '5 bản, đã lệch nhau (Java &gt; với Node &gt;=)'}</td><td>Replace Conditional with Polymorphism / ${en ? 'rule table' : 'bảng luật'}</td><td>${en ? '1 — TV-95 (NCS) is in the backlog' : '1 — TV-95 (NCS) đang trong backlog'}</td></tr>
<tr><td>S3</td><td>BookServlet:150, phi.js:6, sp_overdue_report</td><td>${en ? 'Duplicated knowledge (DRY)' : 'Trùng lặp tri thức (DRY)'}</td><td>18.000 / 20.000 / 2.000×${en ? 'days' : 'ngày'}</td><td>Move Function → Loan; ${en ? 'one source for fines' : 'một nguồn duy nhất cho phí'}</td><td>${en ? '2 — money, customer complaint likely' : '2 — tiền, dễ bị khách khiếu nại'}</td></tr>
<tr><td>S4</td><td>BookServlet (${en ? 'return branch' : 'nhánh trả'})</td><td>Feature Envy + Data Class (Loan)</td><td>${en ? 'uses only due_date + type; PMD DataClass NOPA=9' : 'chỉ dùng due_date + type; PMD DataClass NOPA=9'}</td><td>Move Function, Encapsulate Record</td><td>${en ? '2 — goes with S3' : '2 — đi cùng S3'}</td></tr>
<tr><td>S5</td><td>routes/muon.js:59</td><td>Insider Trading</td><td>${en ? '2 concurrent POSTs: same id, loan lost 4/5, file corrupt 1/5 ⇒ API 500' : '2 POST đồng thời: trùng id, mất phiếu 4/5, hỏng tệp 1/5 ⇒ API 500'}</td><td>${en ? 'Move writes into kho, serialise' : 'Chuyển ghi vào kho, xếp hàng'}</td><td>${en ? '1 — data loss in production' : '1 — mất dữ liệu trên production'}</td></tr>
<tr><td>S6</td><td>${en ? '5 servlet methods + JSPs' : '5 hàm servlet + JSP'}</td><td>${en ? 'Duplicated Code (auth check)' : 'Duplicated Code (kiểm tra đăng nhập)'}</td><td>${en ? 'literal "user" ×5, ExportServlet none, report.jsp public (3.4)' : 'literal "user" ×5, ExportServlet không có, report.jsp công khai (3.4)'}</td><td>${en ? 'one Filter /*' : 'một Filter /*'}</td><td>${en ? 'SECURITY — separate list' : 'BẢO MẬT — danh sách riêng'}</td></tr>
<tr><td>S7</td><td>DBUtil + 9 ${en ? 'methods' : 'hàm'}</td><td>Data Clumps</td><td>con/st/ps/rs ×18 ${en ? 'lines' : 'dòng'}</td><td>try-with-resources / ${en ? 'small JDBC helper' : 'hàm JDBC nhỏ'}</td><td>${en ? '3 — do inside S1' : '3 — làm trong lúc làm S1'}</td></tr>
<tr><td>S8</td><td>BookServlet, Loan.fine</td><td>Primitive Obsession</td><td>"18000.0"; type String</td><td>Replace Primitive with Object (BigDecimal, enum)</td><td>3</td></tr>
<tr><td>S9</td><td>muon.js:11 taoPhieu</td><td>Long Parameter List</td><td>${en ? '8 params, <code>loai</code> unused' : '8 tham số, <code>loai</code> không dùng'}</td><td>Remove Parameter, Introduce Parameter Object</td><td>${en ? '3 — cheap, after S5' : '3 — rẻ, làm sau S5'}</td></tr>
<tr><td>S10</td><td>routes/*.js</td><td>${en ? 'Callback nesting + duplicated load' : 'Callback lồng + nạp dữ liệu lặp'}</td><td>max-nested-callbacks ×8; jscpd 5 clones</td><td>Extract Function; ${en ? 'promises after Node upgrade (7.4)' : 'promise sau khi nâng Node (7.4)'}</td><td>${en ? '4 — wait for Chapter 7' : '4 — chờ Chương 7'}</td></tr>
<tr><td>S11</td><td>header.jsp:2</td><td>${en ? 'SQL in view (layer violation)' : 'SQL trong view (vi phạm tầng)'}</td><td>${en ? 'COUNT(*) on every page; invisible to PMD' : 'COUNT(*) ở mọi trang; PMD không thấy'}</td><td>${en ? 'Move to a filter/attribute' : 'Chuyển sang filter/attribute'}</td><td>4</td></tr>
<tr><td>S12</td><td>TokenUtil</td><td>${en ? 'Hard-coded secret' : 'Bí mật viết cứng'}</td><td>${en ? 'literal salt (value NOT copied here)' : 'chuỗi muối cố định (KHÔNG chép giá trị vào đây)'}</td><td>${en ? 'Chapter 6.3' : 'Chương 6.3'}</td><td>${en ? 'SECURITY — report privately' : 'BẢO MẬT — báo riêng'}</td></tr>
</tbody></table>
<p>${en
  ? 'Top 3 for the sprint: <strong>S5</strong> (data loss, 1 day: move writes into <code>kho</code> + a concurrency test), <strong>S1+S2</strong> (BookServlet, 3 days, on the Chapter 3 net — this is Lab 5.6), <strong>S3+S4</strong> (one fine rule, 2 days + a decision from the BA on which number is right). S6 and S12 go to the leader as a security note, outside the refactoring sprint.'
  : 'Top 3 cho sprint: <strong>S5</strong> (mất dữ liệu, 1 ngày: chuyển ghi vào <code>kho</code> + một test đồng thời), <strong>S1+S2</strong> (BookServlet, 3 ngày, trên tấm lưới Chương 3 — chính là Lab 5.6), <strong>S3+S4</strong> (một luật phí duy nhất, 2 ngày + quyết định của BA xem con số nào đúng). S6 và S12 gửi riêng leader thành ghi chú bảo mật, ngoài sprint refactor.'}</p>
<p>${en ? 'Files: <code>lab/loi-giai/ch4/</code> — <code>diem-nong.py</code>, <code>smell-pmd.xml</code>, <code>do-phuc-tap.xml</code>, <code>eslintrc-smell.json</code>.' : 'Tệp: <code>lab/loi-giai/ch4/</code> — <code>diem-nong.py</code>, <code>smell-pmd.xml</code>, <code>do-phuc-tap.xml</code>, <code>eslintrc-smell.json</code>.'}</p>`)}

<h3>${en ? 'Self-review rubric (10 points)' : 'Rubric tự chấm (10 điểm)'}</h3>
<table>
<thead><tr><th>${en ? 'Criterion' : 'Tiêu chí'}</th><th>${en ? 'Points' : 'Điểm'}</th></tr></thead>
<tbody>
<tr><td>${en ? 'Tools run from one command per repo; totals pasted' : 'Công cụ chạy bằng một lệnh mỗi repo; có dán con số tổng'}</td><td>1</td></tr>
<tr><td>${en ? 'Hotspot script written by you; table reproduces from a clean clone' : 'Script điểm nóng tự viết; bảng tái tạo được từ bản clone sạch'}</td><td>2</td></tr>
<tr><td>${en ? '≥ 10 smells, each with file:line, catalogue name and evidence' : '≥ 10 smell, mỗi cái có tệp:dòng, tên danh mục và bằng chứng'}</td><td>2</td></tr>
<tr><td>${en ? 'Each smell has a named refactoring (Fowler catalogue)' : 'Mỗi smell có tên refactoring (danh mục Fowler)'}</td><td>1</td></tr>
<tr><td>${en ? 'At least one smell found by running code (Node), with output' : 'Ít nhất một smell tìm bằng cách chạy code (Node), có output'}</td><td>1</td></tr>
<tr><td>${en ? 'Security separated; no secret value in the report' : 'Tách bảo mật; báo cáo không chứa giá trị bí mật'}</td><td>1</td></tr>
<tr><td>${en ? 'Top 3 justified by hotspot/backlog/damage, with estimate and test net' : 'Top 3 có lý do theo điểm nóng/backlog/thiệt hại, kèm ước lượng và lưới test'}</td><td>2</td></tr>
</tbody>
</table>
<p><strong>${en ? 'Extra challenge:' : 'Thử thách thêm:'}</strong> ${en
  ? '(1) Change coupling — extend the script to list pairs of files that appear in the same commit, and find which file always changes with <code>db/thuvien.sql</code>. (2) On your own machine, run SonarQube Community in Docker against both repos and compare its issue list with yours: what did it find that you missed, and the reverse?'
  : '(1) Change coupling (đổi cùng nhau) — mở rộng script để liệt kê các cặp tệp xuất hiện trong cùng commit, và tìm tệp nào luôn đổi cùng <code>db/thuvien.sql</code>. (2) Trên máy của bạn, chạy SonarQube Community trong Docker với cả hai repo rồi so danh sách lỗi của nó với của bạn: nó tìm được gì bạn bỏ sót, và ngược lại?'}</p>

<h3>🎤 ${en ? 'What the interviewer will ask' : 'Phỏng vấn viên sẽ hỏi'}</h3>
<ol>
<li><strong>${en ? '“What is a code smell? Give one from a real project.”' : '"Code smell là gì? Cho một ví dụ từ dự án thật."'}</strong><br>${en
  ? 'A surface sign that usually points to a deeper design problem — not a bug. Then one concrete example with a number: “a 120-line doPost with cognitive complexity 36 and the same if-chain on reader type three times; adding a reader type touched nine places”.'
  : 'Một dấu hiệu bề mặt thường chỉ tới vấn đề thiết kế sâu hơn — không phải bug. Rồi một ví dụ cụ thể có con số: "doPost 120 dòng, cognitive complexity 36, cùng một chuỗi if theo loại độc giả ba lần; thêm một loại độc giả phải sửa chín chỗ".'}</li>
<li><strong>${en ? '“Shotgun Surgery vs Divergent Change?”' : '"Shotgun Surgery khác Divergent Change thế nào?"'}</strong><br>${en
  ? 'Mirror images. Shotgun: one change → many modules. Divergent: one module → many kinds of change. Evidence for the first is an impact list; for the second, <code>git log</code> of one file with unrelated ticket reasons.'
  : 'Hai ảnh phản chiếu. Shotgun: một thay đổi → nhiều module. Divergent: một module → nhiều loại thay đổi. Bằng chứng cho cái đầu là danh sách ảnh hưởng; cho cái sau là <code>git log</code> của một tệp với các lý do ticket không liên quan.'}</li>
<li><strong>${en ? '“Cyclomatic or cognitive complexity — which do you use?”' : '"Dùng cyclomatic hay cognitive complexity?"'}</strong><br>${en
  ? 'Both, for different questions: cyclomatic = number of paths ⇒ minimum tests; cognitive = how hard to read, penalises nesting ⇒ refactoring priority. Same method: 20 vs 36 because of nesting.'
  : 'Cả hai, cho hai câu hỏi khác nhau: cyclomatic = số đường đi ⇒ số test tối thiểu; cognitive = độ khó đọc, phạt lồng nhau ⇒ thứ tự refactor. Cùng một hàm: 20 với 36, vì lồng nhau.'}</li>
<li><strong>${en ? '“You join a project with 2,000 Sonar warnings. What do you do in week one?”' : '"Em vào một dự án có 2.000 cảnh báo Sonar. Tuần đầu em làm gì?"'}</strong><br>${en
  ? 'Not fix them. Set a ratchet (new code must not add warnings), rank by hotspot (complexity × change frequency) and by security, then improve only files touched by real tickets.'
  : 'Không sửa chúng. Đặt cơ chế bánh cóc (code mới không được thêm cảnh báo), xếp hạng theo điểm nóng (độ phức tạp × tần suất sửa) và theo bảo mật, rồi chỉ cải thiện những tệp mà ticket thật đụng tới.'}</li>
<li><strong>${en ? '“Is duplicated code always bad?”' : '"Code lặp có phải lúc nào cũng xấu?"'}</strong><br>${en
  ? 'No. DRY is about knowledge: two similar-looking blocks that change for different reasons should stay separate. The dangerous duplication is one rule in several places — often in different languages, where no tool sees it.'
  : 'Không. DRY nói về tri thức: hai khối trông giống nhau nhưng đổi vì lý do khác nhau thì nên để riêng. Trùng lặp nguy hiểm là một luật nằm ở nhiều nơi — thường ở các ngôn ngữ khác nhau, nơi không công cụ nào thấy.'}</li>
</ol>

<h3>💼 ${en ? 'OJT situation' : 'Tình huống OJT'}</h3>
<p>${en
  ? 'In outsourcing, this exact document has a name on many projects: a <em>code assessment</em> or <em>technical due diligence</em>, done before a company takes over maintenance of a system written by another vendor. It decides the price of the maintenance contract. Juniors are often asked to collect the tool outputs; the ones who can also rank them and explain the top three in plain language get invited to the customer meeting.'
  : 'Trong outsourcing, đúng tài liệu này có tên ở nhiều dự án: <em>code assessment</em> hay <em>technical due diligence</em>, làm trước khi một công ty nhận bảo trì hệ thống do nhà cung cấp khác viết. Nó quyết định giá của hợp đồng bảo trì. Người mới thường được giao thu thập output công cụ; người nào còn xếp hạng được và giải thích top 3 bằng lời dễ hiểu thì được mời vào buổi họp với khách.'}</p>
<p>${en
  ? '🛠 <strong>Capstone milestone:</strong> keep your report. In the Chapter 9 sprint, it is the input to step one (“map”) — and you will compare it with what you actually changed.'
  : '🛠 <strong>Mốc dự án cuối khoá:</strong> giữ lại báo cáo của bạn. Trong sprint Chương 9, nó là đầu vào cho bước một ("vẽ bản đồ") — và bạn sẽ so nó với những gì mình thật sự đã sửa.'}</p>

<h3>🗂 ${en ? 'Key terms' : 'Thuật ngữ trong bài'}</h3>
${thuatNgu(en, [
  ['Smell report', 'báo cáo smell', 'Danh sách smell có vị trí, tên, bằng chứng, đề xuất và xếp hạng.', 'A list of smells with location, name, evidence, proposal and ranking.'],
  ['Churn', 'tần suất thay đổi', 'Số lần (hoặc số dòng) một tệp bị sửa theo lịch sử git.', 'How often (or how much) a file changed in git history.'],
  ['WMC', 'tổng độ phức tạp các hàm', 'Weighted Methods per Class: cộng cyclomatic của mọi hàm trong lớp.', 'Weighted Methods per Class: sum of method complexities.'],
  ['Change coupling', 'đổi cùng nhau', 'Các tệp hay xuất hiện chung một commit — phụ thuộc ẩn.', 'Files that tend to change in the same commit — hidden dependency.'],
  ['Code assessment', 'đánh giá mã nguồn', 'Báo cáo chất lượng trước khi nhận bảo trì một hệ thống.', 'A quality report before taking over maintenance of a system.'],
])}

<h3>📌 ${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'A smell is a hint with a name; the name tells you the refactoring.' : 'Smell là một gợi ý có tên; cái tên cho biết dùng refactoring nào.'}</li>
<li>${en ? 'Tools find shapes (long, complex, duplicated); humans find duplicated knowledge, wrong owners and races.' : 'Công cụ tìm hình dáng (dài, phức tạp, lặp); con người tìm tri thức trùng lặp, chủ sở hữu sai và tranh chấp.'}</li>
<li>${en ? 'A tool’s silence is not health: PMD GodClass missed BookServlet.' : 'Công cụ im lặng không có nghĩa là khoẻ: PMD GodClass bỏ sót BookServlet.'}</li>
<li>${en ? 'Rank by hotspot, separate security, ratchet the rest.' : 'Xếp hạng theo điểm nóng, tách riêng bảo mật, phần còn lại thì khoá bằng bánh cóc.'}</li>
<li>${en ? 'Next chapter: the refactorings, one small green step at a time.' : 'Chương sau: các bước refactor, từng bước nhỏ, luôn xanh.'}</li>
</ul>
${lk(bai('software-architecture', 'swarch-11-4-no-ky-thuat'), '🏛', en ? 'Software Architecture 11.4 — Technical debt: make it visible, pay it on purpose' : 'Kiến trúc phần mềm 11.4 — Nợ kỹ thuật: làm cho nó hiện ra và trả có chủ đích', en ? 'The same ranking, at system scale' : 'Cùng cách xếp hạng, ở tầm cả hệ thống')}
${lk(bai('ide-va-do-nghe-dev', 'ide-2-3-refactor-sinh-code'), '🧰', en ? 'IDE course 2.3 — Automated refactoring shortcuts' : 'Khoá IDE 2.3 — Phím tắt refactor tự động', en ? 'Get ready for Chapter 5' : 'Chuẩn bị cho Chương 5')}
`
);

/* ═══════════════════ 4.6 — Quiz ═══════════════════ */
const QUIZ4 = [
  Q('Which statement about code smells is correct?|||Phát biểu nào về code smell là đúng?', [
    'A smell is a bug that tests have not caught yet|||Smell là một bug mà test chưa bắt được',
    'A smell is a surface sign that usually points to a deeper design problem; the code may work correctly|||Smell là dấu hiệu bề mặt thường chỉ tới vấn đề thiết kế sâu hơn; code vẫn có thể chạy đúng',
    'A smell is any warning produced by a linter|||Smell là mọi cảnh báo do linter sinh ra',
    'A smell must be fixed before the next release|||Smell phải được sửa trước bản phát hành kế tiếp',
  ], 1, 'EN: Fowler/Beck — a hint, not a verdict. doPost is full of smells and passes 16 tests.|||VI: Fowler/Beck — gợi ý, không phải bản án. doPost đầy smell mà vẫn qua 16 test.'),
  Q('A teammate extracts a block into muonSach(con, st, rs, ps, readerId, bookId, response). Tests stay 16/16 green. PMD now reports ExcessiveParameterList and AvoidReassigningParameters. What is the best review comment?|||Đồng đội tách một khối thành muonSach(con, st, rs, ps, readerId, bookId, response). Test vẫn 16/16 xanh. PMD giờ báo ExcessiveParameterList và AvoidReassigningParameters. Bình luận review nào tốt nhất?', [
    'Revert: refactoring made it worse|||Revert: refactor làm tệ hơn',
    'LGTM, tests are green|||LGTM, test xanh rồi',
    'Behaviour preserved ✔; st/rs/ps are only overwritten — declare them inside muonSach, which also shortens the list|||Hành vi giữ nguyên ✔; st/rs/ps chỉ bị ghi đè — khai báo chúng bên trong muonSach, danh sách tham số cũng ngắn lại',
    'Raise the PMD threshold to 10 so the warning disappears|||Nâng ngưỡng PMD lên 10 cho hết cảnh báo',
  ], 2, 'EN: Java passes a copy of the reference, so the three parameters are useless. Name the smell, cite the tool, propose the move.|||VI: Java truyền bản sao của tham chiếu nên ba tham số đó vô dụng. Gọi tên smell, dẫn công cụ, đề xuất bước sửa.'),
  Q('grep for "30" finds the 30-day loan for lecturers, a 30-day cookie and INTERVAL 30 DAY in the dump. What does this show?|||grep "30" ra hạn mượn 30 ngày của giảng viên, cookie 30 ngày và INTERVAL 30 DAY trong dump. Điều này cho thấy gì?', [
    'Magic numbers cannot be searched exactly; a named constant makes Find Usages precise|||Số ma thuật không tìm kiếm chính xác được; hằng có tên làm Find Usages chính xác',
    'grep is the wrong tool; use the IDE|||grep là công cụ sai; dùng IDE',
    'All three should use one constant THIRTY|||Cả ba nên dùng chung một hằng THIRTY',
    'The cookie is a bug|||Cookie là bug',
  ], 0, 'EN: the value of naming a number is searchability for impact analysis — not one constant per value.|||VI: giá trị của việc đặt tên cho con số là tìm được khi phân tích ảnh hưởng — không phải mỗi giá trị một hằng.'),
  Q('PMD’s GodClass rule did not flag BookServlet (WMC 25). Why?|||Luật GodClass của PMD không đánh dấu BookServlet (WMC 25). Vì sao?', [
    'BookServlet is not a God Class|||BookServlet không phải God Class',
    'PMD does not scan servlets|||PMD không quét servlet',
    'GodClass only works on Java 17|||GodClass chỉ chạy trên Java 17',
    'The rule needs WMC ≥ 47 plus other conditions; BookServlet concentrates its complexity in one huge method, which the method-level rules caught instead|||Luật cần WMC ≥ 47 cùng các điều kiện khác; BookServlet dồn độ phức tạp vào một hàm khổng lồ, nên luật mức hàm mới bắt được',
  ], 3, 'EN: Lanza & Marinescu’s strategy; a tool’s silence is not health.|||VI: chiến lược của Lanza & Marinescu; công cụ im lặng không có nghĩa là khoẻ.'),
  Q('The fine calculation in BookServlet uses only a due date and a reader type. Which smell and which refactoring?|||Đoạn tính phí trong BookServlet chỉ dùng hạn trả và loại độc giả. Smell nào, refactoring nào?', [
    'Long Parameter List → Introduce Parameter Object|||Long Parameter List → Introduce Parameter Object',
    'Feature Envy → Move Function (towards Loan)|||Feature Envy → Move Function (về phía Loan)',
    'Data Clumps → Extract Class|||Data Clumps → Extract Class',
    'Divergent Change → Split Phase|||Divergent Change → Split Phase',
  ], 1, 'EN: the logic envies Loan’s data while Loan is a Data Class (NOPA=9).|||VI: logic thèm dữ liệu của Loan trong khi Loan là Data Class (NOPA=9).'),
  Q('Fowler’s quick test for a Data Clump is…|||Phép thử nhanh của Fowler cho Data Clump là…', [
    'Delete one member of the group: if the rest no longer makes sense, it is one concept that deserves a name|||Xoá một thành viên của nhóm: nếu phần còn lại hết nghĩa, đó là một khái niệm đáng có tên',
    'Count the parameters; more than 3 is a clump|||Đếm tham số; hơn 3 là một bó',
    'Check whether the variables have the same type|||Xem các biến có cùng kiểu không',
    'Run CPD|||Chạy CPD',
  ], 0, 'EN: a ResultSet without its Statement and Connection is meaningless ⇒ try-with-resources / JdbcTemplate.|||VI: ResultSet không có Statement và Connection của nó thì vô nghĩa ⇒ try-with-resources / JdbcTemplate.'),
  Q('Two concurrent POST /api/muon both return “201, loan 6”; afterwards one loan is missing or the JSON file is corrupt. Which smell let this hide?|||Hai POST /api/muon đồng thời cùng trả "201, phiếu 6"; sau đó mất một phiếu hoặc tệp JSON hỏng. Smell nào đã che lỗi này?', [
    'Magic numbers|||Số ma thuật',
    'Long Parameter List in taoPhieu|||Long Parameter List trong taoPhieu',
    'Comments|||Comments',
    'Insider Trading — the route writes the store’s file directly, so no module owns “one writer at a time”|||Insider Trading — route ghi thẳng vào tệp của kho, nên không module nào chịu trách nhiệm "mỗi lúc một người ghi"',
  ], 3, 'EN: measured — 4/5 rounds lost a loan, 1/5 corrupted the file and every endpoint returned 500.|||VI: đã đo — 4/5 lượt mất phiếu, 1/5 hỏng tệp và mọi endpoint trả 500.'),
  Q('Ticket: “add reader type NCS”. The change touches BookServlet ×3, readers.jsp, phi.js, muon.js ×2, Reader.java and the report procedure. This is…|||Ticket: "thêm loại độc giả NCS". Thay đổi đụng BookServlet ×3, readers.jsp, phi.js, muon.js ×2, Reader.java và thủ tục báo cáo. Đây là…', [
    'Divergent Change|||Divergent Change',
    'Feature Envy|||Feature Envy',
    'Shotgun Surgery|||Shotgun Surgery',
    'Speculative Generality|||Speculative Generality',
  ], 2, 'EN: one change, many scattered edits. The dangerous one is the place grep cannot find (the procedure ignores the type).|||VI: một thay đổi, nhiều chỗ sửa rải rác. Chỗ nguy hiểm là chỗ grep không tìm ra (thủ tục bỏ qua loại độc giả).'),
  Q('git log shows BookServlet changed for a stock bug, borrow limits, fines and a DAO refactor. This is evidence of…|||git log cho thấy BookServlet bị sửa vì lỗi tồn kho, giới hạn mượn, phí và refactor DAO. Đây là bằng chứng của…', [
    'Shotgun Surgery|||Shotgun Surgery',
    'Divergent Change|||Divergent Change',
    'Lazy Element|||Lazy Element',
    'Duplicated Code|||Duplicated Code',
  ], 1, 'EN: one module, many unrelated reasons to change — the mirror image of Shotgun Surgery.|||VI: một module, nhiều lý do thay đổi không liên quan — ảnh phản chiếu của Shotgun Surgery.'),
  Q('ESLint reports cyclomatic complexity 5 for tinhPhi, which has: if (tre <= 0), if SV, nested if (phi > 50000), else if GV, else. How is 5 obtained?|||ESLint báo cyclomatic complexity 5 cho tinhPhi, hàm có: if (tre <= 0), if SV, if lồng (phi > 50000), else if GV, else. 5 tính thế nào?', [
    '5 branches including else|||5 nhánh kể cả else',
    'Number of return statements + 3|||Số lệnh return + 3',
    'Lines of code ÷ 3|||Số dòng ÷ 3',
    '1 + 4 decisions (the final else adds none)|||1 + 4 điểm quyết định (else cuối không cộng)',
  ], 3, 'EN: McCabe for structured code = decisions + 1.|||VI: McCabe cho code có cấu trúc = số điểm quyết định + 1.'),
  Q('PMD: doPost cyclomatic 20, cognitive 36. What explains the gap?|||PMD: doPost cyclomatic 20, cognitive 36. Điều gì giải thích khoảng cách?', [
    'Cognitive adds a penalty for each nesting level; doPost’s branches sit inside try and if/else-if chains|||Cognitive cộng điểm phạt cho mỗi tầng lồng; các nhánh của doPost nằm trong try và chuỗi if/else-if',
    'Cognitive counts lines|||Cognitive đếm dòng',
    'Cyclomatic ignores loops|||Cyclomatic bỏ qua vòng lặp',
    'A PMD bug|||Lỗi của PMD',
  ], 0, 'EN: cyclomatic sizes tests; cognitive measures human effort.|||VI: cyclomatic định cỡ bộ test; cognitive đo công sức của người đọc.'),
  Q('You add ESLint to a legacy Node project: 36 warnings after tuning. What should your first PR do?|||Bạn thêm ESLint vào dự án Node cũ: 36 cảnh báo sau khi chỉnh. PR đầu tiên nên làm gì?', [
    'Fix all 36 warnings so the project starts clean|||Sửa hết 36 cảnh báo để dự án bắt đầu sạch',
    'Turn every rule into an error|||Bật mọi luật thành lỗi',
    'Add the tool, the tuned config and --max-warnings 36, change no application code, paste counts per rule|||Thêm công cụ, cấu hình đã chỉnh và --max-warnings 36, không sửa dòng code ứng dụng nào, dán số đếm theo luật',
    'Wait until the Node upgrade|||Chờ tới khi nâng Node',
  ], 2, 'EN: a ratchet — old debt reported, new debt blocked; fixes come inside real tickets, guided by hotspots.|||VI: bánh cóc — nợ cũ được báo, nợ mới bị chặn; việc sửa nằm trong ticket thật, theo điểm nóng.'),
];

const QUIZ_CONTENT = ml((en) => `
<span class="eyebrow">${en ? 'Chapter 4 · Quiz' : 'Chương 4 · Kiểm tra'}</span>
<h2>${en ? 'Check what stuck' : 'Xem thử đọng lại được gì'}</h2>
<p class="lead">${en ? 'Twelve questions, each built on an output from this chapter: recognise the smell from the evidence, name the refactoring, and decide what to fix first.' : 'Mười hai câu, câu nào cũng dựa trên một output của chương: nhận ra smell từ bằng chứng, gọi tên refactoring, và quyết định sửa cái gì trước.'}</p>
<h3>${en ? 'Self-check before you start' : 'Tự kiểm trước khi làm'}</h3>
<ul>
<li>${en ? 'I can name at least 12 smells from the catalogue and give a lab example for 8 of them.' : 'Tôi gọi được ít nhất 12 smell trong danh mục và chỉ ra ví dụ trong lab cho 8 cái.'}</li>
<li>${en ? 'I can run PMD/CPD on the Java repo and ESLint/jscpd on the Node repo with one command each.' : 'Tôi chạy được PMD/CPD cho repo Java và ESLint/jscpd cho repo Node, mỗi bên một lệnh.'}</li>
<li>${en ? 'I can compute cyclomatic complexity by hand and explain why cognitive differs.' : 'Tôi tự tính được cyclomatic complexity bằng tay và giải thích vì sao cognitive khác.'}</li>
<li>${en ? 'I can turn a grep into an impact list and an estimate.' : 'Tôi biến được một lệnh grep thành danh sách ảnh hưởng và một ước lượng.'}</li>
<li>${en ? 'I have a hotspot table and a ranked smell report.' : 'Tôi có bảng điểm nóng và báo cáo smell đã xếp hạng.'}</li>
</ul>
`
);

export default {
  title: 'Chapter 4 — Code smells: naming what feels wrong|||Chương 4 — Code smell: gọi tên cái cảm giác "sai sai"',
  description: 'Một danh mục chung để cả đội nói cùng một ngôn ngữ.',
  lessons: [
    { title: '4.1 — Smells inside functions: Long Method, Long Parameter List, Magic Numbers|||4.1 — Smell trong hàm: hàm dài, nhiều tham số, số ma thuật', slug: 'lgc-4-1-smell-ham', type: 'LESSON', isFreePreview: true, description: 'Đo bằng PMD 7 (NCSS 111, cyclomatic 20, cognitive 36), tách vội đẻ ra hàm 7 tham số mà test vẫn xanh, route Node 8 tham số có tham số chết, grep số ma thuật ra cả số trùng nhầm, comment làm chất khử mùi, chuỗi ma thuật là mật khẩu.', content: L41 },
    { title: '4.2 — Smells between classes: God Servlet, Feature Envy, Data Clumps|||4.2 — Smell giữa các lớp: God Servlet, Feature Envy, Data Clumps', slug: 'lgc-4-2-smell-lop', type: 'LESSON', isFreePreview: true, description: 'God Servlet mà PMD GodClass bỏ sót, Data Class và Feature Envy, bó con/st/ps/rs, tiền bằng double ("18000.0"), Insider Trading: hai lượt mượn đồng thời làm mất phiếu và hỏng tệp JSON — đo thật; Mars Climate Orbiter 1999, Starbucks 2015.', content: L42 },
    { title: '4.3 — Smells of change: Duplicated Code, Shotgun Surgery, Divergent Change, switch on type|||4.3 — Smell khi thay đổi: code lặp, Shotgun Surgery, Divergent Change, switch theo loại', slug: 'lgc-4-3-smell-thay-doi', type: 'LESSON', isFreePreview: true, description: 'CPD và jscpd theo ngưỡng, luật phí ở ba ngôn ngữ cho ba kết quả, ticket "thêm loại NCS" chạm chín chỗ (impact analysis + ước lượng), git log lộ Divergent Change, kiểm tra đăng nhập chép tay — goto fail 2014, OWASP A01.', content: L43 },
    { title: '4.4 — Tools that smell for you: IDE inspections, SonarLint, ESLint, complexity|||4.4 — Công cụ ngửi giúp bạn: inspection IDE, SonarLint, ESLint, độ phức tạp', slug: 'lgc-4-4-cong-cu', type: 'LESSON', isFreePreview: true, description: 'Bảng đối chiếu luật PMD/Sonar/ESLint/IntelliJ, ESLint 8 trên Node 14 (51 → 36 cảnh báo), tự tính cyclomatic, cognitive khác ở đâu, hotspot = độ phức tạp × tần suất sửa, bánh cóc --max-warnings, vụ Toyota 2013.', content: L44 },
    { title: '4.5 — Lab: A smell report for the legacy app, ranked by risk|||4.5 — Lab: Báo cáo smell cho ứng dụng cũ, xếp theo rủi ro', slug: 'lgc-4-5-lab', type: 'LESSON', isFreePreview: true, description: 'Ticket LIB-104: chạy công cụ hai repo, tự viết script điểm nóng (BookServlet 150 điểm), ≥ 10 smell có bằng chứng và refactoring, tách bảo mật, top 3 cho sprint — lời giải 12 dòng che sẵn, rubric 10 điểm.', content: L45 },
    { title: '4.6 — Chapter 4 quiz|||4.6 — Kiểm tra Chương 4', slug: 'lgc-4-6-quiz', type: 'QUIZ', isFreePreview: true, description: 'Mười hai câu: nhận diện smell từ output, tham số bị gán lại, God Class mà công cụ bỏ sót, Feature Envy, Data Clumps, race do Insider Trading, Shotgun và Divergent, cyclomatic và cognitive, bánh cóc.', content: QUIZ_CONTENT, quiz: { timeLimitSeconds: 900, questions: QUIZ4 } },
  ],
};
