/**
 * Đọc code cũ và refactor — Chương 2: Vẽ bản đồ một codebase lạ (soạn 22/11/2026).
 * 2.1 hình dáng repo (cây thư mục, đếm dòng, web.xml + @WebServlet, tệp hay đổi) · 2.2 lần một request (mượn sách: JSP → servlet →
 * SQL → trigger; Find Usages/Call Hierarchy; nguồn → đích của dữ liệu người dùng) · 2.3 đọc CSDL (information_schema, CASCADE,
 * trigger, procedure, dữ liệu lệch) · 2.4 đọc lịch sử (log -S, blame, show, commit "refactor" đổi hành vi) · 2.5 sơ đồ C4 +
 * tuần tự bằng Mermaid · 2.6 lab bản đồ một trang · 2.7 quiz 12 câu. Mọi output chạy thật trên repo lab.
 * KHÔNG dạy lại lệnh git (khoá git ch2) hay tour repo Node (inside-cuongthai ch2) — chỉ dẫn link.
 */
import { java, xml, sql, bash, out, tl, ml, lk, bai, thuatNgu, Q, MOI_TRUONG } from './_chung.mjs';

const moiTruong = (en) => `<p><em>${en ? 'Outputs run for real on:' : 'Output chạy thật trên:'} ${MOI_TRUONG}.</em></p>`;

/* ═══════════════════ 2.1 — Hình dáng repo ═══════════════════ */
const O21_WC = out(`
$ find src -name '*.java' -o -name '*.jsp' | xargs wc -l | sort -n | tail -8
      44 src/main/webapp/books.jsp
      50 src/main/webapp/readers.jsp
      57 src/main/java/com/thuvien/servlet/ReportServlet.java
      65 src/main/java/com/thuvien/dao/BookDAO.java
      76 src/main/java/com/thuvien/servlet/LoginServlet.java
      91 src/main/java/com/thuvien/servlet/ReaderServlet.java
     193 src/main/java/com/thuvien/servlet/BookServlet.java
     807 total
`
);
const O21_ENTRY = out(`
$ grep -n "url-pattern\\|servlet-class" src/main/webapp/WEB-INF/web.xml
10:    <servlet-class>com.thuvien.servlet.LoginServlet</servlet-class>
14:    <url-pattern>/login</url-pattern>
19:    <servlet-class>com.thuvien.servlet.BookServlet</servlet-class>
23:    <url-pattern>/books</url-pattern>
28:    <servlet-class>com.thuvien.servlet.ReaderServlet</servlet-class>
32:    <url-pattern>/readers</url-pattern>
38:    <servlet-class>com.thuvien.servlet.ExportServlet</servlet-class>
42:    <url-pattern>/export</url-pattern>
$ grep -rn "@WebServlet\\|@WebFilter\\|@WebListener" src/main/java
src/main/java/com/thuvien/servlet/ReportServlet.java:20:@WebServlet("/report")
`
);
const O21_CHURN = out(`
$ git log --format= --name-only | sort | uniq -c | sort -rn | head -5
   6 src/main/java/com/thuvien/servlet/BookServlet.java
   5 src/main/webapp/WEB-INF/web.xml
   3 db/thuvien.sql
   2 src/main/webapp/login.jsp
   2 src/main/webapp/header.jsp
`
);
const O21_DB = out(`
$ grep -rln "DBUtil.getConnection" src | sort
src/main/java/com/thuvien/dao/BookDAO.java
src/main/java/com/thuvien/servlet/BookServlet.java
src/main/java/com/thuvien/servlet/ExportServlet.java
src/main/java/com/thuvien/servlet/LoginServlet.java
src/main/java/com/thuvien/servlet/ReaderServlet.java
src/main/java/com/thuvien/servlet/ReportServlet.java
src/main/webapp/header.jsp
`
);

const O21_JSP = out(`
# Mở thẳng JSP, KHÔNG đăng nhập (Tomcat 9 cục bộ)
$ curl -s -o /dev/null -w "%{http_code}\\n" 127.0.0.1:18081/thuvien/report.jsp
200
$ curl -s 127.0.0.1:18081/thuvien/books.jsp | head -5
<html><body>
<h2>Có lỗi xảy ra</h2>
<pre>org.apache.jasper.JasperException: An exception occurred processing [books.jsp] at line [18]

15:   <tr><th>ID</th><th>Mã</th><th>Tên sách</th><th>Tác giả</th><th>Còn/Tổng</th><th>Mượn</th></tr>
`
);

const L21 = ml((en) => `
<span class="eyebrow">${en ? 'Chapter 2 · Mapping an unfamiliar codebase' : 'Chương 2 · Vẽ bản đồ một codebase lạ'}</span>
<h2>${en ? '2.1 — The shape of the repo: folders, layers, entry points' : '2.1 — Hình dáng repo: thư mục, tầng, điểm vào'}</h2>
<p class="lead">${en
  ? 'Nobody reads an unfamiliar codebase from the first line of the first file. You look at it the way you look at a city from a hill before walking in: where are the districts, which roads lead in, where is the traffic. This lesson gives you four cheap measurements that turn a folder of files into a rough map in fifteen minutes.'
  : 'Không ai đọc một codebase lạ từ dòng đầu của tệp đầu. Bạn nhìn nó như nhìn một thành phố từ trên đồi trước khi đi vào: các quận nằm đâu, đường nào dẫn vào, chỗ nào đông xe. Bài này cho bạn bốn phép đo rẻ tiền biến một thư mục đầy tệp thành bản đồ sơ bộ trong mười lăm phút.'}</p>
${moiTruong(en)}

<h3>${en ? 'Measurement 1 — size: where is the weight?' : 'Phép đo 1 — kích thước: sức nặng nằm ở đâu?'}</h3>
${O21_WC}
<p>${en
  ? 'Line counts are crude but honest. 807 lines in total, and one file — <code>BookServlet</code> — holds almost a quarter of them. In any codebase the biggest few files are where the business logic and the bugs collect; they are your first suspects. On a large repo use <code>cloc</code> (it separates code, comments and blank lines per language) or simply sort <code>wc -l</code> per folder.'
  : 'Đếm dòng thô nhưng trung thực. Tổng 807 dòng, và một tệp — <code>BookServlet</code> — chiếm gần một phần tư. Ở codebase nào cũng vậy, vài tệp to nhất là nơi logic nghiệp vụ và bug tụ lại; chúng là nghi phạm đầu tiên. Với repo lớn, dùng <code>cloc</code> (tách code, chú thích, dòng trống theo từng ngôn ngữ) hoặc đơn giản sắp <code>wc -l</code> theo thư mục.'}</p>

<h3>${en ? 'Measurement 2 — entry points: where do requests come in?' : 'Phép đo 2 — điểm vào: request đi vào từ đâu?'}</h3>
<p>${en
  ? 'A web app is a set of doors. In a Servlet/JSP app the doors are declared in two places, and you must check <strong>both</strong>:'
  : 'Một ứng dụng web là một dãy cửa ra vào. Trong ứng dụng Servlet/JSP, cửa được khai ở hai chỗ, và bạn phải kiểm <strong>cả hai</strong>:'}</p>
${O21_ENTRY}
<p>${en
  ? 'Four doors in <code>web.xml</code>, one more by annotation. But read the file, not only the grep: lines 35–44 of <code>web.xml</code> are inside an XML comment (<code>&lt;!-- tam tat 2018 … --&gt;</code>), so <code>/export</code> is <strong>not</strong> a door at all. grep cannot see comments; your eyes can. JSPs are doors too — any <code>.jsp</code> under <code>webapp/</code> outside <code>WEB-INF</code> can be opened directly by URL. In other stacks the same question has other answers:'
  : 'Bốn cửa trong <code>web.xml</code>, thêm một cửa bằng annotation. Nhưng hãy đọc tệp, đừng chỉ grep: dòng 35–44 của <code>web.xml</code> nằm trong một chú thích XML (<code>&lt;!-- tam tat 2018 … --&gt;</code>), nên <code>/export</code> <strong>không</strong> phải là cửa. grep không thấy chú thích; mắt bạn thì thấy. JSP cũng là cửa — mọi <code>.jsp</code> trong <code>webapp/</code> mà nằm ngoài <code>WEB-INF</code> đều mở thẳng được bằng URL. Ở stack khác, cùng câu hỏi có câu trả lời khác:'}</p>
<table>
<thead><tr><th>Stack</th><th>${en ? 'Where the doors are declared' : 'Cửa được khai ở đâu'}</th><th>${en ? 'Search for' : 'Tìm chữ'}</th></tr></thead>
<tbody>
<tr><td>Servlet/JSP</td><td><code>WEB-INF/web.xml</code> + ${en ? 'annotations' : 'annotation'}</td><td><code>url-pattern</code>, <code>@WebServlet</code>, <code>@WebFilter</code></td></tr>
<tr><td>Spring MVC / Boot</td><td>${en ? 'controller classes' : 'lớp controller'}</td><td><code>@RestController</code>, <code>@Controller</code>, <code>@GetMapping</code>, <code>@RequestMapping</code></td></tr>
<tr><td>Express</td><td>${en ? 'router files, then <code>app.use</code> mounts' : 'tệp router, rồi chỗ <code>app.use</code> gắn chúng'}</td><td><code>router.get(</code>, <code>app.use(</code></td></tr>
<tr><td>${en ? 'Any' : 'Mọi stack'}</td><td>${en ? 'scheduled jobs, message listeners, CLI scripts' : 'tác vụ hẹn giờ, bộ nghe hàng đợi, script dòng lệnh'}</td><td><code>@Scheduled</code>, <code>cron</code>, <code>main(</code></td></tr>
</tbody>
</table>

${O21_JSP}
<p>${en
  ? 'Both JSPs open without logging in, because the login check lives in each servlet, not in the JSPs or a filter. <code>report.jsp</code> renders (and its header even runs a database query for an anonymous visitor); <code>books.jsp</code> crashes and <code>error.jsp</code> prints the stack trace <em>and lines of source code</em> to the visitor. Two entries for your risk list, found by treating JSPs as doors.'
  : 'Cả hai JSP đều mở được mà không cần đăng nhập, vì phép kiểm đăng nhập nằm trong từng servlet, không nằm trong JSP hay một filter. <code>report.jsp</code> hiện ra (header của nó còn chạy một câu truy vấn CSDL cho người lạ); <code>books.jsp</code> sập và <code>error.jsp</code> in stack trace <em>kèm cả mấy dòng mã nguồn</em> cho người truy cập. Hai mục cho danh sách rủi ro, tìm ra chỉ nhờ coi JSP là cửa.'}</p>

<h3>${en ? 'Measurement 3 — layers: who talks to the database?' : 'Phép đo 3 — tầng: ai nói chuyện với CSDL?'}</h3>
${O21_DB}
<p>${en
  ? 'In a layered design only the DAO/repository layer would appear here. In the lab, <em>six Java classes and a JSP</em> open their own connections. That single grep tells you the architecture better than any diagram in a document: there are no real layers; every servlet is UI, logic and data access at once, and someone (2018) started a DAO and stopped after one method. Write that sentence on your map.'
  : 'Trong thiết kế phân tầng, chỉ tầng DAO/repository xuất hiện ở đây. Ở lab, <em>sáu lớp Java và một JSP</em> tự mở kết nối. Một lệnh grep đó nói về kiến trúc rõ hơn mọi sơ đồ trong tài liệu: không có tầng thật sự; mỗi servlet vừa là giao diện, vừa là logic, vừa truy cập dữ liệu, và có người (2018) bắt đầu làm DAO rồi dừng sau một hàm. Ghi câu đó lên bản đồ của bạn.'}</p>

<h3>${en ? 'Measurement 4 — churn: what changes most?' : 'Phép đo 4 — tần suất sửa: thứ gì đổi nhiều nhất?'}</h3>
${O21_CHURN}
<p>${en
  ? 'Counting how often each file appears in commits shows where the work happens. The file that is both <strong>big</strong> and <strong>changed often</strong> — <code>BookServlet</code> here — is a <em>hotspot</em>: the place most likely to receive your ticket and most worth protecting with tests (Chapter 3). Lesson 4.4 turns this into a ranking (complexity × change frequency).'
  : 'Đếm số lần mỗi tệp xuất hiện trong commit cho thấy công việc diễn ra ở đâu. Tệp vừa <strong>to</strong> vừa <strong>hay bị sửa</strong> — ở đây là <code>BookServlet</code> — là một <em>hotspot (điểm nóng)</em>: nơi dễ nhận ticket của bạn nhất và đáng được bảo vệ bằng test nhất (Chương 3). Bài 4.4 biến điều này thành bảng xếp hạng (độ phức tạp × tần suất sửa).'}</p>

<h3>${en ? 'Put it on one page' : 'Gom lên một trang'}</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">${en ? 'Doors' : 'Cửa'}</span><span class="lz-t">/login /books /readers /report</span><span class="lz-d">${en ? '/export is commented out' : '/export bị chú thích tắt'}</span></div>
  <div class="lz-step"><span class="lz-k">${en ? 'Weight' : 'Sức nặng'}</span><span class="lz-t">BookServlet 193</span><span class="lz-d">${en ? 'search, borrow, return, add, delete' : 'tìm, mượn, trả, thêm, xoá'}</span></div>
  <div class="lz-step"><span class="lz-k">${en ? 'Layers' : 'Tầng'}</span><span class="lz-t">${en ? 'none really' : 'gần như không có'}</span><span class="lz-d">${en ? '7 files open DB connections' : '7 tệp tự mở kết nối CSDL'}</span></div>
  <div class="lz-step"><span class="lz-k">Hotspot</span><span class="lz-t">BookServlet, web.xml, thuvien.sql</span><span class="lz-d">${en ? 'most commits' : 'nhiều commit nhất'}</span></div>
</div>
<p>${en
  ? 'The same method on a large real Node/TypeScript codebase is in “Inside cuongthai.com”, Chapter 2 — this lesson does not repeat it. What is specific to old Java web apps: check both <code>web.xml</code> and annotations, read XML comments, and treat every JSP as a door.'
  : 'Cùng phương pháp trên một codebase Node/TypeScript lớn có thật nằm ở "Bên trong cuongthai.com", Chương 2 — bài này không lặp lại. Điều riêng của ứng dụng Java web cũ: kiểm cả <code>web.xml</code> lẫn annotation, đọc chú thích XML, và coi mọi JSP là một cửa.'}</p>

<h3>💼 ${en ? 'OJT situation' : 'Tình huống OJT'}</h3>
<p>${en
  ? 'The client reports “the export button returns 404”. A teammate greps <code>ExportServlet</code>, finds the class and the mapping in <code>web.xml</code>, and spends an hour debugging the servlet. Reading the five lines around the mapping would have shown the comment — and <code>git log</code> on that file (lesson 2.4) would have shown who disabled it and why.'
  : 'Khách báo "nút xuất file trả 404". Một bạn trong nhóm grep <code>ExportServlet</code>, thấy lớp và cả mapping trong <code>web.xml</code>, rồi mất một giờ gỡ lỗi servlet. Đọc năm dòng quanh cái mapping là đã thấy chú thích — và <code>git log</code> trên tệp đó (bài 2.4) sẽ cho biết ai đã tắt nó và vì sao.'}</p>

<h3>🧪 ${en ? 'Practice (15 minutes)' : 'Thực hành (15 phút)'}</h3>
<div class="callout ok"><ol>
<li>${en ? 'Run the four measurements on the lab and paste the outputs into <code>NHAT-KY.md</code>.' : 'Chạy bốn phép đo trên lab và dán output vào <code>NHAT-KY.md</code>.'}</li>
<li>${en ? 'List every door: URL → class or JSP. Mark the ones that need login. (Hint: open each servlet’s first lines.)' : 'Liệt kê mọi cửa: URL → lớp hoặc JSP. Đánh dấu cửa nào cần đăng nhập. (Gợi ý: mở vài dòng đầu của từng servlet.)'}</li>
<li>${en ? 'Open <code>readers.jsp</code> directly, logged out. Compare with the two JSPs above and explain the result.' : 'Mở thẳng <code>readers.jsp</code> khi chưa đăng nhập. So với hai JSP ở trên và giải thích kết quả.'}</li>
</ol>
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? 'your door list has 4 servlet URLs (not 5), the JSPs, and a note on which ones skip the login check.' : 'danh sách cửa có 4 URL servlet (không phải 5), các JSP, và ghi chú cửa nào bỏ qua bước kiểm đăng nhập.'}</p></div>

<h3>🗂 ${en ? 'Key terms' : 'Thuật ngữ trong bài'}</h3>
${thuatNgu(en, [
  ['Entry point', 'điểm vào', 'Nơi một request, tác vụ hẹn giờ hay lệnh bắt đầu đi vào code.', 'Where a request, scheduled job or command enters the code.'],
  ['url-pattern', 'mẫu URL', 'Trong web.xml: URL nào được giao cho servlet nào.', 'In web.xml: which URLs go to which servlet.'],
  ['Layer', 'tầng', 'Nhóm code cùng trách nhiệm (giao diện, nghiệp vụ, dữ liệu).', 'A group of code with one responsibility (UI, business, data).'],
  ['DAO (Data Access Object)', 'đối tượng truy cập dữ liệu', 'Lớp gom các câu SQL của một bảng/thực thể.', 'A class that holds the SQL for one table/entity.'],
  ['Churn', 'tần suất sửa', 'Số lần một tệp bị thay đổi trong lịch sử.', 'How often a file changes in history.'],
  ['Hotspot', 'điểm nóng', 'Tệp vừa phức tạp vừa hay bị sửa — rủi ro cao nhất.', 'A file that is both complex and often changed — the highest risk.'],
])}

<h3>📌 ${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'Look from the hill first: size, doors, layers, churn — fifteen minutes.' : 'Nhìn từ trên đồi trước: kích thước, cửa, tầng, tần suất sửa — mười lăm phút.'}</li>
<li>${en ? 'Servlet doors live in web.xml <em>and</em> annotations; XML comments switch doors off.' : 'Cửa của servlet nằm trong web.xml <em>và</em> annotation; chú thích XML tắt cửa.'}</li>
<li>${en ? 'Who opens DB connections reveals the real architecture.' : 'Ai tự mở kết nối CSDL cho thấy kiến trúc thật.'}</li>
<li>${en ? 'Big + often changed = hotspot = where to protect first.' : 'To + hay sửa = điểm nóng = nơi cần bảo vệ trước.'}</li>
<li>${en ? 'grep finds candidates; reading confirms them.' : 'grep tìm ứng viên; đọc mới xác nhận.'}</li>
</ul>

${lk(bai('inside-cuongthai', 'inside-cuongthai-2-1-cau-truc'), '🏗️', en ? 'Inside cuongthai.com 2.1 — Structure of a large repo' : 'Bên trong cuongthai.com 2.1 — Cấu trúc một repo lớn', en ? 'The same method on a large Node/TypeScript codebase' : 'Cùng phương pháp trên codebase Node/TypeScript lớn')}
${tl('https://github.com/AlDanial/cloc', '📏', 'cloc — Count Lines of Code', en ? 'Lines of code per language and folder' : 'Đếm dòng code theo ngôn ngữ và thư mục')}
`
);

/* ═══════════════════ 2.2 — Lần một request ═══════════════════ */
const O22_FORM = out(`
$ grep -rn 'value="borrow"' src/main/webapp
src/main/webapp/books.jsp:28:        <input type="hidden" name="action" value="borrow">
$ grep -n 'action.equals\\|executeQuery\\|executeUpdate\\|sendRedirect' src/main/java/com/thuvien/servlet/BookServlet.java
…
86:            if (action.equals("borrow")) {
90:                rs = st.executeQuery("SELECT * FROM readers WHERE id = " + readerId);
92:                    response.sendRedirect("books?msg=" + URLEncoder.encode("Độc giả không tồn tại", "UTF-8"));
97:                rs = st.executeQuery("SELECT COUNT(*) FROM loans WHERE reader_id = " + readerId + " AND return_date IS NULL");
110:                    response.sendRedirect("books?msg=" + URLEncoder.encode("Vượt quá số sách được mượn", "UTF-8"));
113:                rs = st.executeQuery("SELECT available FROM books WHERE id = " + bookId);
116:                    response.sendRedirect("books?msg=" + URLEncoder.encode("Sách đã hết", "UTF-8"));
134:                ps.executeUpdate();
136:                response.sendRedirect("books?msg=" + URLEncoder.encode("Mượn thành công", "UTF-8"));
137:            } else if (action.equals("return")) {
…
`
);
const C22_LIMIT = java(`
int max;
if (type.equals("SV")) {
    max = 3;
} else if (type.equals("GV")) {
    max = 10;
} else {
    max = 1;
}
if (dangMuon > max) {            // dòng 109: SV đang mượn 3 cuốn ⇒ 3 > 3 là false ⇒ vẫn cho mượn cuốn thứ 4
    response.sendRedirect("books?msg=" + URLEncoder.encode("Vượt quá số sách được mượn", "UTF-8"));
    return;
}
`
);
const O22_HTTP = out(`
$ curl -s -v -b cj -o /dev/null -d "action=borrow&bookId=4&readerId=5" localhost:18080/thuvien/books 2>&1 | grep -E "^> (POST|Content-Type|Cookie)|^< (HTTP|Location)"
> POST /thuvien/books HTTP/1.1
> Cookie: JSESSIONID=F9CAE829DDD3EA5F9E5CC526311C1C22
> Content-Type: application/x-www-form-urlencoded
< HTTP/1.1 302
< Location: books?msg=M%C6%B0%E1%BB%A3n+th%C3%A0nh+c%C3%B4ng
$ docker compose logs web --since 30s | grep BookServlet
web-1  | 15:09:09 INFO  BookServlet - borrow book=4 reader=5
$ docker compose exec -T db mysql -uroot -p123456 -t thuvien -e "SELECT id, book_id, reader_id, borrow_date, due_date FROM loans ORDER BY id DESC LIMIT 1; SELECT id, title, available FROM books WHERE id = 4"
+----+---------+-----------+---------------------+---------------------+
| id | book_id | reader_id | borrow_date         | due_date            |
+----+---------+-----------+---------------------+---------------------+
|  6 |       4 |         5 | 2026-11-22 15:09:10 | 2026-12-06 15:09:10 |
+----+---------+-----------+---------------------+---------------------+
+----+-------------+-----------+
| id | title       | available |
+----+-------------+-----------+
|  4 | Refactoring |         1 |
+----+-------------+-----------+
`
);
const O22_FOUR = out(`
# Độc giả 2 (SV) đang mượn 1 cuốn. Mượn thêm 4 cuốn liên tiếp:
muon sach 4 cho doc gia 2 -> http://localhost:18080/thuvien/books?msg=Mượn thành công
muon sach 5 cho doc gia 2 -> http://localhost:18080/thuvien/books?msg=Mượn thành công
muon sach 6 cho doc gia 2 -> http://localhost:18080/thuvien/books?msg=Mượn thành công
muon sach 2 cho doc gia 2 -> http://localhost:18080/thuvien/books?msg=Vượt quá số sách được mượn
+-----------+
| dang_muon |
+-----------+
|         4 |
+-----------+
`
);
const O22_SINK = out(`
$ grep -rnE 'execute(Query|Update)\\("[^"]*" *\\+' src/main/java | wc -l
       9
$ grep -rn "getParameter" src/main/java | wc -l
      18
`
);
const C22_MERMAID = bash(`
sequenceDiagram
    actor TT as Thủ thư
    participant JSP as books.jsp
    participant S as BookServlet.doPost
    participant DB as MySQL
    participant TG as trigger trg_loans_ai
    TT->>JSP: bấm "Mượn" (bookId, readerId)
    JSP->>S: POST /books action=borrow
    S->>DB: SELECT * FROM readers WHERE id = …   (nối chuỗi)
    S->>DB: SELECT COUNT(*) FROM loans … return_date IS NULL
    Note over S: max theo loại: SV 3, GV 10, khác 1 · so sánh "> max" (lệch một)
    S->>DB: SELECT available FROM books WHERE id = …
    S->>DB: INSERT INTO loans(...)   (PreparedStatement)
    DB->>TG: AFTER INSERT
    TG->>DB: UPDATE books SET available = available - 1
    S-->>TT: 302 books?msg=Mượn thành công
`
);

const L22 = ml((en) => `
<span class="eyebrow">${en ? 'Chapter 2 · Mapping an unfamiliar codebase' : 'Chương 2 · Vẽ bản đồ một codebase lạ'}</span>
<h2>${en ? '2.2 — Tracing one request with Find Usages and Call Hierarchy' : '2.2 — Lần một request bằng Find Usages và Call Hierarchy'}</h2>
<p class="lead">${en
  ? 'A map from the hill tells you where the districts are. To understand how the city works you follow one delivery truck from the gate to the shop. In code, that truck is one request. This lesson follows “borrow a book” from the button to the database row — and on the way finds the bug from the OJT story in Start here (2/2).'
  : 'Bản đồ từ trên đồi cho biết các quận nằm đâu. Muốn hiểu thành phố vận hành thế nào, bạn đi theo một chiếc xe giao hàng từ cổng tới cửa hàng. Trong code, chiếc xe đó là một request. Bài này đi theo "mượn sách" từ cái nút tới dòng dữ liệu trong CSDL — và dọc đường tìm ra đúng con bug trong câu chuyện OJT ở bài Bắt đầu tại đây (2/2).'}</p>
${moiTruong(en)}

<h3>${en ? 'Start from what the user touches' : 'Bắt đầu từ thứ người dùng chạm vào'}</h3>
<p>${en
  ? 'Pick a visible string or field from the screen and search for it. On the books page the borrow button sends a hidden field <code>action=borrow</code>; that string leads straight to the form, the form’s <code>action="books"</code> leads to <code>/books</code> in <code>web.xml</code>, and that leads to <code>BookServlet.doPost</code>. Then list the interesting lines of the branch:'
  : 'Chọn một chuỗi hay một ô nhìn thấy trên màn hình rồi tìm nó. Ở trang sách, nút mượn gửi một trường ẩn <code>action=borrow</code>; chuỗi đó dẫn thẳng tới form, <code>action="books"</code> của form dẫn tới <code>/books</code> trong <code>web.xml</code>, và từ đó tới <code>BookServlet.doPost</code>. Rồi liệt kê các dòng đáng chú ý của nhánh đó:'}</p>
${O22_FORM}
<p>${en
  ? 'Listing only the lines that touch the database or leave the method (<code>executeQuery</code>, <code>executeUpdate</code>, <code>sendRedirect</code>) gives you the skeleton of the branch in twelve lines: three checks, each with an early exit, then one insert. You now know what to read carefully and what to skip.'
  : 'Chỉ liệt kê những dòng chạm CSDL hoặc thoát khỏi hàm (<code>executeQuery</code>, <code>executeUpdate</code>, <code>sendRedirect</code>) cho bạn bộ xương của nhánh trong mười hai dòng: ba phép kiểm, mỗi cái có lối thoát sớm, rồi một lệnh insert. Giờ bạn biết chỗ nào phải đọc kỹ, chỗ nào lướt qua.'}</p>

<h3>${en ? 'Read the checks — and find the off-by-one' : 'Đọc các phép kiểm — và tìm ra lỗi lệch một'}</h3>
${C22_LIMIT}
<p>${en
  ? 'The commit message that introduced this block (lesson 2.4) says “SV 3, GV 10, khach 1”. With <code>&gt;</code>, a student who already has 3 books passes the check and gets a fourth. Do not trust your reading alone — reproduce it. We borrowed four books in a row for reader 2, a student who already had one:'
  : 'Lời nhắn của commit tạo ra khối này (bài 2.4) ghi "SV 3, GV 10, khach 1". Với <code>&gt;</code>, một sinh viên đang có 3 cuốn vẫn qua phép kiểm và mượn được cuốn thứ tư. Đừng chỉ tin vào việc đọc — tái hiện nó. Chúng tôi mượn liền bốn cuốn cho độc giả 2, một sinh viên đang có sẵn một cuốn:'}</p>
${O22_FOUR}
<p>${en
  ? 'Four books on loan, the fifth refused. The rule says three. You found a real bug by tracing one request — <strong>but you do not fix it now</strong>. Chapter 3 first writes a test that pins today’s behaviour (4 allowed), then the fix becomes a one-character change that turns that test red on purpose, in its own PR.'
  : 'Bốn cuốn đang mượn, cuốn thứ năm bị từ chối. Luật nói ba. Bạn tìm ra một bug thật chỉ nhờ lần theo một request — <strong>nhưng chưa sửa vội</strong>. Chương 3 viết trước một test khoá hành vi hiện tại (cho mượn tới 4), rồi bản sửa trở thành một thay đổi một ký tự làm test đó đỏ có chủ đích, trong một PR riêng.'}</p>

<h3>${en ? 'Follow it out of the code and into the database' : 'Đi theo nó ra khỏi code và vào CSDL'}</h3>
${O22_HTTP}
<p>${en
  ? 'Three views of the same request: the HTTP exchange (a POST with the session cookie, answered by a 302), the log line, and the new row. And a surprise: <code>available</code> for book 4 dropped from 2 to 1, yet no line of <code>BookServlet</code>’s borrow branch updates <code>books</code>. Search the whole repo for <code>available - 1</code> and the answer is in <code>db/thuvien.sql</code>: a trigger. Logic that is invisible from the Java side is the topic of lesson 2.3.'
  : 'Ba góc nhìn của cùng một request: trao đổi HTTP (một POST kèm cookie phiên, được trả lời bằng 302), dòng log, và dòng dữ liệu mới. Và một bất ngờ: <code>available</code> của sách 4 giảm từ 2 xuống 1, nhưng không dòng nào trong nhánh mượn của <code>BookServlet</code> cập nhật bảng <code>books</code>. Tìm <code>available - 1</code> trong cả repo và câu trả lời nằm ở <code>db/thuvien.sql</code>: một trigger. Logic vô hình khi nhìn từ phía Java là chủ đề của bài 2.3.'}</p>

<h3>${en ? 'The IDE does this faster: Find Usages and Call Hierarchy' : 'IDE làm nhanh hơn: Find Usages và Call Hierarchy'}</h3>
<table>
<thead><tr><th>${en ? 'Question' : 'Câu hỏi'}</th><th>IntelliJ (Windows/Linux · macOS)</th><th>VS Code</th></tr></thead>
<tbody>
<tr><td>${en ? 'Where is this method/field used?' : 'Hàm/trường này được dùng ở đâu?'}</td><td>Find Usages: <code>Alt+F7</code> · <code>⌥F7</code></td><td>${en ? 'Find All References' : 'Find All References'}: <code>Shift+Alt+F12</code></td></tr>
<tr><td>${en ? 'Who calls this, and who calls them?' : 'Ai gọi hàm này, và ai gọi những người đó?'}</td><td>Call Hierarchy: <code>Ctrl+Alt+H</code> · <code>⌃⌥H</code></td><td>Show Call Hierarchy: <code>Shift+Alt+H</code></td></tr>
<tr><td>${en ? 'Jump to the definition' : 'Nhảy tới định nghĩa'}</td><td><code>Ctrl+B</code> · <code>⌘B</code></td><td><code>F12</code></td></tr>
<tr><td>${en ? 'Search text in all files' : 'Tìm chữ trong mọi tệp'}</td><td><code>Ctrl+Shift+F</code> · <code>⌘⇧F</code></td><td><code>Ctrl+Shift+F</code> · <code>⌘⇧F</code></td></tr>
</tbody>
</table>
<p>${en
  ? 'Run Call Hierarchy on <code>DBUtil.getConnection()</code> and you get the same seven callers as the grep in 2.1, as a clickable tree. But know the limits, because legacy code lives exactly in them: the IDE cannot follow a URL in a JSP to a servlet (that link is in <code>web.xml</code>), cannot see into SQL strings, triggers or stored procedures, and cannot follow reflection or <code>Class.forName</code>. For those, text search is your tool. Shortcuts and IDE setup are taught in the IDE course, Chapter 2; this lesson only uses them.'
  : 'Chạy Call Hierarchy trên <code>DBUtil.getConnection()</code> sẽ ra đúng bảy nơi gọi như lệnh grep ở 2.1, dưới dạng cây bấm được. Nhưng hãy biết giới hạn, vì code cũ sống đúng trong những giới hạn đó: IDE không lần được từ URL trong JSP sang servlet (mối nối nằm ở <code>web.xml</code>), không nhìn vào chuỗi SQL, trigger hay stored procedure, và không theo được reflection hay <code>Class.forName</code>. Với những thứ đó, tìm chữ là công cụ của bạn. Phím tắt và cài đặt IDE được dạy ở khoá IDE, Chương 2; bài này chỉ dùng chúng.'}</p>

<h3>🕵️ ${en ? 'Hacker’s corner — map where user input ends up' : 'Góc hacker — vẽ đường đi của dữ liệu người dùng'}</h3>
<p>${en
  ? 'Security reviewers trace requests too, but they ask one question: where does user input (a <em>source</em>) reach something dangerous (a <em>sink</em>) without being cleaned? In this app, sources are <code>getParameter</code> calls and sinks are SQL strings and JSP <code>&lt;%= %&gt;</code> output. A first count:'
  : 'Người rà soát bảo mật cũng lần request, nhưng họ chỉ hỏi một câu: dữ liệu người dùng (<em>nguồn</em>) đi tới chỗ nguy hiểm (<em>đích</em>) mà không được làm sạch ở đâu? Trong ứng dụng này, nguồn là các lời gọi <code>getParameter</code>, đích là chuỗi SQL và chỗ in <code>&lt;%= %&gt;</code> trong JSP. Đếm sơ bộ:'}</p>
${O22_SINK}
<p>${en
  ? 'Nine one-line SQL statements built with <code>+</code>. Now read instead of grepping: the search query is built into a variable first and executed on another line (<code>executeQuery(sql)</code>, line 50), and the book insert spans four lines (172–175). Neither matches the pattern. <strong>grep found 9, reading finds 11</strong> — keep both numbers on your map as “injection candidates”, without trying any payload outside your own lab. Chapter 6.3 proves and fixes them.'
  : 'Chín câu SQL một dòng dựng bằng <code>+</code>. Giờ đọc thay vì grep: câu tìm kiếm được dựng vào một biến trước rồi chạy ở dòng khác (<code>executeQuery(sql)</code>, dòng 50), còn câu thêm sách trải dài bốn dòng (172–175). Cả hai đều không khớp mẫu. <strong>grep thấy 9, đọc thấy 11</strong> — ghi cả hai con số lên bản đồ như "ứng viên injection", và không thử payload nào ngoài lab của chính bạn. Bài 6.3 chứng minh và sửa chúng.'}</p>

<h3>${en ? 'Write the trace as a sequence diagram' : 'Viết lại đường đi thành sơ đồ tuần tự'}</h3>
${C22_MERMAID}
<p>${en
  ? 'This is Mermaid syntax; GitHub, GitLab and many wikis render it directly from a <code>.md</code> file, so the diagram lives in the repo next to the code (lesson 2.5). Writing it forces you to name every hop — if you cannot write an arrow, you have not understood that step yet.'
  : 'Đây là cú pháp Mermaid; GitHub, GitLab và nhiều wiki vẽ thẳng nó từ tệp <code>.md</code>, nên sơ đồ sống trong repo cạnh code (bài 2.5). Viết nó buộc bạn gọi tên mọi chặng — chặng nào bạn không viết được mũi tên thì chặng đó bạn chưa hiểu.'}</p>

<h3>💼 ${en ? 'OJT situation' : 'Tình huống OJT'}</h3>
<p>${en
  ? 'Ticket: “the borrow limit is wrong for students”. A newcomer searches for “3” in the codebase and gets 400 results. A tracer clicks the button, sees <code>action=borrow</code> in the request, opens that branch, and is looking at line 109 within ten minutes. Start from the behaviour, not from a guess.'
  : 'Ticket: "giới hạn mượn của sinh viên bị sai". Người mới tìm chữ "3" trong codebase và nhận 400 kết quả. Người biết lần request thì bấm nút, thấy <code>action=borrow</code> trong request, mở đúng nhánh đó, và nhìn thấy dòng 109 trong vòng mười phút. Xuất phát từ hành vi, không xuất phát từ phỏng đoán.'}</p>

<h3>🧪 ${en ? 'Practice (25 minutes)' : 'Thực hành (25 phút)'}</h3>
<div class="callout ok"><ol>
<li>${en ? 'Trace <strong>“return a book”</strong> the same way: from the “Trả” button on the readers page to the database. List every SQL statement and every early exit with line numbers.' : 'Lần <strong>"trả sách"</strong> theo đúng cách đó: từ nút "Trả" ở trang độc giả tới CSDL. Liệt kê mọi câu SQL và mọi lối thoát sớm, kèm số dòng.'}</li>
<li>${en ? 'Answer: where is <code>available</code> increased on return — Java or database? Is that symmetric with borrowing?' : 'Trả lời: lúc trả sách, <code>available</code> được tăng ở đâu — Java hay CSDL? Có đối xứng với lúc mượn không?'}</li>
<li>${en ? 'Write the Mermaid sequence diagram for “return”.' : 'Viết sơ đồ tuần tự Mermaid cho "trả sách".'}</li>
<li>${en ? 'Reproduce the off-by-one on your lab (borrow until refused), note the count, then reset the data.' : 'Tái hiện lỗi lệch một trên lab của bạn (mượn tới khi bị từ chối), ghi số cuốn, rồi khôi phục dữ liệu.'}</li>
</ol>
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? 'your “return” diagram shows that the fine is computed in Java (with three rates and a cap only for SV) and that the stock update on return happens in Java, not in a trigger.' : 'sơ đồ "trả sách" của bạn cho thấy phí được tính trong Java (ba mức, chỉ SV có trần) và việc cộng số sách khi trả nằm trong Java chứ không nằm trong trigger.'}</p></div>

<h3>🗂 ${en ? 'Key terms' : 'Thuật ngữ trong bài'}</h3>
${thuatNgu(en, [
  ['Find Usages', 'tìm nơi dùng', 'Liệt kê mọi chỗ một ký hiệu được dùng, theo ngữ nghĩa chứ không theo chữ.', 'Lists every place a symbol is used, by meaning rather than text.'],
  ['Call Hierarchy', 'cây lời gọi', 'Cây "ai gọi hàm này" (hoặc "hàm này gọi ai") nhiều tầng.', 'A multi-level tree of who calls a method (or what it calls).'],
  ['Early exit / guard', 'lối thoát sớm', 'return sớm khi điều kiện không thoả; mỗi cái là một nhánh hành vi.', 'An early return when a condition fails; each is a behaviour branch.'],
  ['Off-by-one', 'lệch một', 'Sai biên một đơn vị (> thay vì >=).', 'A boundary wrong by one (> instead of >=).'],
  ['Source / sink', 'nguồn / đích', 'Nơi dữ liệu người dùng vào / nơi nó có thể gây hại.', 'Where user data enters / where it can do harm.'],
  ['Sequence diagram', 'sơ đồ tuần tự', 'Sơ đồ các bên và thông điệp theo thứ tự thời gian.', 'A diagram of participants and messages in time order.'],
])}

<h3>📌 ${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'Trace one request from what the user touches: field → form → web.xml → servlet branch.' : 'Lần một request từ thứ người dùng chạm: trường → form → web.xml → nhánh servlet.'}</li>
<li>${en ? 'List only DB calls and exits first — that is the skeleton.' : 'Liệt kê trước chỉ lời gọi CSDL và lối thoát — đó là bộ xương.'}</li>
<li>${en ? 'Reproduce what you think you read; the lab really lends 4 books to a student.' : 'Tái hiện điều bạn nghĩ mình đọc được; lab thật sự cho sinh viên mượn 4 cuốn.'}</li>
<li>${en ? 'IDE navigation stops at web.xml, SQL strings, triggers and reflection — use text search there.' : 'Điều hướng của IDE dừng ở web.xml, chuỗi SQL, trigger và reflection — ở đó hãy tìm chữ.'}</li>
<li>${en ? 'Map sources and sinks; grep gives a lower bound (9), reading the real number (11).' : 'Vẽ nguồn và đích; grep cho cận dưới (9), đọc mới ra con số thật (11).'}</li>
</ul>

${lk(bai('ide-va-do-nghe-dev', 'ide-2-2-dieu-huong'), '🛠️', en ? 'IDE course 2.2 — Navigating in IntelliJ' : 'Khoá IDE 2.2 — Điều hướng trong IntelliJ', en ? 'Shortcuts and setup (not repeated here)' : 'Phím tắt và cài đặt (không dạy lại ở đây)')}
${tl('https://www.jetbrains.com/help/idea/find-highlight-usages.html', '🧭', 'IntelliJ IDEA — Find usages', 'Alt+F7, Ctrl+Alt+F7')}
${tl('https://www.jetbrains.com/help/idea/viewing-structure-and-hierarchy-of-the-source-code.html', '🧭', 'IntelliJ IDEA — Source code hierarchy', 'Call Hierarchy Ctrl+Alt+H')}
${tl('https://mermaid.js.org/syntax/sequenceDiagram.html', '🧜', 'Mermaid — Sequence diagrams', en ? 'Syntax reference' : 'Tra cú pháp')}
`
);

/* ═══════════════════ 2.3 — Đọc CSDL ═══════════════════ */
const S23_FK = sql(`
SELECT TABLE_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, CONSTRAINT_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'thuvien' AND REFERENCED_TABLE_NAME IS NOT NULL;
SELECT CONSTRAINT_NAME, DELETE_RULE, UPDATE_RULE
FROM information_schema.REFERENTIAL_CONSTRAINTS WHERE CONSTRAINT_SCHEMA = 'thuvien';
SELECT TRIGGER_NAME, EVENT_MANIPULATION, EVENT_OBJECT_TABLE, ACTION_TIMING
FROM information_schema.TRIGGERS WHERE TRIGGER_SCHEMA = 'thuvien';
SELECT ROUTINE_NAME, ROUTINE_TYPE, DEFINER FROM information_schema.ROUTINES WHERE ROUTINE_SCHEMA = 'thuvien';
`
);
const O23_FK = out(`
+------------+-------------+-----------------------+-----------------+
| TABLE_NAME | COLUMN_NAME | REFERENCED_TABLE_NAME | CONSTRAINT_NAME |
+------------+-------------+-----------------------+-----------------+
| loans      | book_id     | books                 | fk_loans_book   |
| loans      | reader_id   | readers               | fk_loans_reader |
+------------+-------------+-----------------------+-----------------+
+-----------------+-------------+-------------+
| CONSTRAINT_NAME | DELETE_RULE | UPDATE_RULE |
+-----------------+-------------+-------------+
| fk_loans_book   | NO ACTION   | NO ACTION   |
| fk_loans_reader | CASCADE     | NO ACTION   |
+-----------------+-------------+-------------+
+--------------+--------------------+--------------------+---------------+
| TRIGGER_NAME | EVENT_MANIPULATION | EVENT_OBJECT_TABLE | ACTION_TIMING |
+--------------+--------------------+--------------------+---------------+
| trg_loans_ai | INSERT             | loans              | AFTER         |
+--------------+--------------------+--------------------+---------------+
+-------------------+--------------+---------+
| ROUTINE_NAME      | ROUTINE_TYPE | DEFINER |
+-------------------+--------------+---------+
| sp_overdue_report | PROCEDURE    | root@%  |
+-------------------+--------------+---------+
`
);
const O23_CASCADE = out(`
$ mysql … -e "SELECT id, book_id, reader_id, return_date FROM loans WHERE reader_id = 1"
+----+---------+-----------+---------------------+
| id | book_id | reader_id | return_date         |
+----+---------+-----------+---------------------+
|  1 |       1 |         1 | NULL                |
|  5 |       7 |         1 | 2026-10-13 21:42:46 |
+----+---------+-----------+---------------------+
$ curl -s -b cj -o /dev/null -w "POST /readers action=delete id=1 -> %{http_code} %{redirect_url}\\n" -d "action=delete&id=1" localhost:18080/thuvien/readers
POST /readers action=delete id=1 -> 302 http://localhost:18080/thuvien/readers
$ mysql … -e "SELECT COUNT(*) AS phieu_cua_doc_gia_1 FROM loans WHERE reader_id = 1; SELECT id, title, quantity, available FROM books WHERE id IN (1,7)"
+---------------------+
| phieu_cua_doc_gia_1 |
+---------------------+
|                   0 |
+---------------------+
+----+------------------------------+----------+-----------+
| id | title                        | quantity | available |
+----+------------------------------+----------+-----------+
|  1 | Lập trình Java căn bản       |        5 |         3 |
|  7 | Tiếng Nhật sơ cấp 1          |        6 |         5 |
+----+------------------------------+----------+-----------+
`
);
const S23_SP = sql(`
-- db/thuvien.sql — procedure Lan thêm năm 2019
CREATE DEFINER=\`root\`@\`%\` PROCEDURE \`sp_overdue_report\`(IN p_min_days INT)
BEGIN
  SELECT l.id AS loan_id, r.name AS reader_name, b.title,
         DATEDIFF(NOW(), l.due_date) AS days_late,
         DATEDIFF(NOW(), l.due_date) * 2000 AS est_fine        -- một mức 2000 cho MỌI loại độc giả
  FROM loans l JOIN readers r ON r.id = l.reader_id JOIN books b ON b.id = l.book_id
  WHERE l.return_date IS NULL AND DATEDIFF(NOW(), l.due_date) >= p_min_days
  ORDER BY days_late DESC;
END
`
);
const O23_REPORT = out(`
$ curl -s -b cj localhost:18080/thuvien/report | grep "<td>"
    <tr><td>4</td><td>Phạm Quốc Dũng</td><td>Clean Code</td><td>23</td><td>46000.0</td></tr>
    <tr><td>3</td><td>Lê Minh Châu</td><td>Cấu trúc dữ liệu và giải thuật</td><td>10</td><td>20000.0</td></tr>
    <tr><td>1</td><td>Nguyễn Văn An</td><td>Lập trình Java căn bản</td><td>6</td><td>12000.0</td></tr>
`
);
const S23_DRIFT = sql(`
-- Số "available" có khớp với số phiếu đang mượn không?
SELECT b.id, b.title, b.quantity, b.available, b.quantity - COUNT(l.id) AS dung_ra
FROM books b LEFT JOIN loans l ON l.book_id = b.id AND l.return_date IS NULL
GROUP BY b.id HAVING b.available <> dung_ra;
`
);
const O23_DRIFT = out(`
+----+----------------------------+----------+-----------+---------+
| id | title                      | quantity | available | dung_ra |
+----+----------------------------+----------+-----------+---------+
|  7 | Tiếng Nhật sơ cấp 1        |        6 |         5 |       6 |
+----+----------------------------+----------+-----------+---------+
`
);

const L23 = ml((en) => `
<span class="eyebrow">${en ? 'Chapter 2 · Mapping an unfamiliar codebase' : 'Chương 2 · Vẽ bản đồ một codebase lạ'}</span>
<h2>${en ? '2.3 — Reading the database: schema, foreign keys, stored procedures and triggers' : '2.3 — Đọc cơ sở dữ liệu: schema, khoá ngoại, stored procedure và trigger'}</h2>
<p class="lead">${en
  ? 'In old applications a lot of the behaviour is not in the Java code at all. It is in foreign-key rules, triggers and stored procedures — places your IDE cannot see and a code review never shows. This lesson asks the database itself what it contains, then solves a mystery that every maintenance team meets sooner or later: “we deleted a reader and their loans disappeared”.'
  : 'Ở ứng dụng cũ, rất nhiều hành vi hoàn toàn không nằm trong code Java. Nó nằm trong luật khoá ngoại, trigger và stored procedure — những nơi IDE không nhìn thấy và review code không bao giờ hiện ra. Bài này hỏi thẳng CSDL xem nó chứa những gì, rồi giải một bí ẩn mà nhóm bảo trì nào sớm muộn cũng gặp: "xoá một độc giả thì phiếu mượn của họ biến mất".'}</p>
${moiTruong(en)}

<h3>${en ? 'Ask the database, not the documentation' : 'Hỏi CSDL, đừng hỏi tài liệu'}</h3>
<p>${en
  ? '<code>information_schema</code> is a set of read-only views every MySQL (and, with small differences, SQL Server and PostgreSQL) database has about itself. Four queries give you the relationships and the hidden logic:'
  : '<code>information_schema</code> là tập các view chỉ đọc mà mọi CSDL MySQL (và, khác chút ít, SQL Server, PostgreSQL) có sẵn để mô tả chính nó. Bốn câu truy vấn cho bạn các mối quan hệ và phần logic ẩn:'}</p>
${S23_FK}
${O23_FK}
<p>${en
  ? 'Read it row by row. <code>loans</code> points to <code>books</code> and <code>readers</code>. Deleting a book that has loans is refused (<code>NO ACTION</code>), but deleting a reader <strong>cascades</strong>: their loans are deleted automatically. There is one trigger that runs after every insert into <code>loans</code>, and one stored procedure. For a picture, DBeaver (free) can draw an ER diagram from an existing database: connect, right-click the database, <em>View Diagram</em>. The picture is nice; the four queries are what you can paste into a ticket.'
  : 'Đọc từng dòng. <code>loans</code> trỏ tới <code>books</code> và <code>readers</code>. Xoá một cuốn sách đang có phiếu mượn sẽ bị từ chối (<code>NO ACTION</code>), nhưng xoá một độc giả thì <strong>dây chuyền (CASCADE)</strong>: phiếu của họ tự bị xoá theo. Có một trigger chạy sau mỗi lần insert vào <code>loans</code>, và một stored procedure. Muốn có hình, DBeaver (miễn phí) vẽ được sơ đồ ER từ CSDL có sẵn: kết nối, chuột phải vào CSDL, <em>View Diagram</em>. Hình thì đẹp; còn bốn câu truy vấn là thứ bạn dán được vào ticket.'}</p>

<h3>${en ? 'The mystery: “deleting a reader made the loans disappear”' : 'Bí ẩn: "xoá độc giả thì phiếu mượn biến mất"'}</h3>
<p>${en ? 'We reproduced it on a fresh lab database:' : 'Chúng tôi tái hiện trên một CSDL lab mới nạp:'}</p>
${O23_CASCADE}
<p>${en
  ? 'Reader 1 had an active loan (book 1) and a returned one (book 7). After the delete, both loan rows are gone — the cascade. Now look at book 1: it still says 3 available out of 5. The active loan was the reason one copy was out; that loan no longer exists, but the copy was never given back. <strong>One copy of “Lập trình Java căn bản” has vanished from the library forever</strong>, and the history of who borrowed what is gone too. Nobody wrote a line of Java to do this; <code>ReaderServlet</code> only runs <code>DELETE FROM readers WHERE id = …</code>. The behaviour lives in one schema clause, <code>ON DELETE CASCADE</code>.'
  : 'Độc giả 1 có một phiếu đang mượn (sách 1) và một phiếu đã trả (sách 7). Sau lệnh xoá, cả hai phiếu đều mất — do cascade. Giờ nhìn sách 1: vẫn ghi còn 3 trên 5. Phiếu đang mượn là lý do một bản sách nằm ngoài thư viện; phiếu đó không còn, nhưng bản sách chưa bao giờ được trả lại. <strong>Một cuốn "Lập trình Java căn bản" biến mất khỏi thư viện vĩnh viễn</strong>, và lịch sử ai đã mượn gì cũng mất theo. Không ai viết dòng Java nào làm việc này; <code>ReaderServlet</code> chỉ chạy <code>DELETE FROM readers WHERE id = …</code>. Hành vi nằm trong đúng một mệnh đề schema, <code>ON DELETE CASCADE</code>.'}</p>
<div class="pitfall co-tieu-de"><p><strong>${en ? 'Trap — changing CASCADE to fix it.' : 'Bẫy — đổi CASCADE cho hết lỗi.'}</strong> ${en
  ? 'Changing the foreign key to <code>RESTRICT</code> would make every reader delete with loans fail with an SQL error, and the servlet swallows exceptions (<code>e.printStackTrace()</code>) and redirects as if it worked. The right fix is a product decision (soft delete? forbid deleting readers with active loans?) — write it up as a question, with this reproduction attached.'
  : 'Đổi khoá ngoại sang <code>RESTRICT</code> sẽ làm mọi lần xoá độc giả có phiếu bị lỗi SQL, mà servlet thì nuốt ngoại lệ (<code>e.printStackTrace()</code>) rồi chuyển hướng như thể đã xong. Cách sửa đúng là một quyết định nghiệp vụ (xoá mềm? cấm xoá độc giả đang mượn?) — ghi thành câu hỏi, kèm bản tái hiện này.'}</p></div>

<h3>${en ? 'Logic split between Java and SQL' : 'Logic bị chia đôi giữa Java và SQL'}</h3>
<p>${en
  ? 'Borrowing decreases <code>available</code> in the trigger; returning increases it in Java (<code>BookServlet</code> line 167). Commit history (lesson 2.4) explains why — someone moved half of it into a trigger to fix a race in 2016 and wrote “the return part is still in Java, not fixed yet”. Now the overdue report. It does not compute fines in Java at all; it calls a procedure:'
  : 'Mượn sách thì <code>available</code> giảm trong trigger; trả sách thì tăng trong Java (<code>BookServlet</code> dòng 167). Lịch sử commit (bài 2.4) giải thích vì sao — năm 2016 có người chuyển một nửa vào trigger để sửa lỗi tranh chấp và ghi "phần trả sách vẫn ở Java, chưa sửa". Giờ tới báo cáo quá hạn. Nó hoàn toàn không tính phí trong Java; nó gọi một procedure:'}</p>
${S23_SP}
${O23_REPORT}
<p>${en
  ? 'Phạm Quốc Dũng is a <code>KHACH</code> reader, 23 days late: the report says 46,000 (23 × 2,000). When he returns the book, <code>BookServlet</code> will charge 23 × 5,000 = 115,000. A student 30 days late would see 60,000 in the report and pay 50,000 (the SV cap). <strong>Two implementations of the same business rule, disagreeing</strong>, in two languages, written by two people two years apart. This is one of the most common findings in legacy systems. Do not pick a winner yourself — put both numbers in front of the person who owns the rule.'
  : 'Phạm Quốc Dũng là độc giả <code>KHACH</code>, trễ 23 ngày: báo cáo ghi 46.000 (23 × 2.000). Khi anh trả sách, <code>BookServlet</code> sẽ thu 23 × 5.000 = 115.000. Một sinh viên trễ 30 ngày sẽ thấy 60.000 trên báo cáo mà chỉ phải trả 50.000 (trần của SV). <strong>Hai bản cài đặt của cùng một luật nghiệp vụ, nói ngược nhau</strong>, bằng hai ngôn ngữ, do hai người viết cách nhau hai năm. Đây là một trong những phát hiện phổ biến nhất ở hệ thống cũ. Đừng tự chọn bên thắng — đặt cả hai con số trước mặt người sở hữu luật đó.'}</p>

<h3>${en ? 'Data drift: when the numbers do not add up' : 'Dữ liệu lệch: khi các con số không cộng lại được'}</h3>
<p>${en
  ? 'When logic is split and nothing enforces consistency, data drifts. Ask the database whether <code>available</code> equals <code>quantity</code> minus active loans:'
  : 'Khi logic bị chia đôi và không có gì giữ cho nhất quán, dữ liệu sẽ trôi lệch. Hỏi CSDL xem <code>available</code> có bằng <code>quantity</code> trừ số phiếu đang mượn không:'}</p>
${S23_DRIFT}
${O23_DRIFT}
<p>${en
  ? 'On the freshly loaded dump, book 7 already disagrees: no active loans, but only 5 of 6 available. The dump itself carries drift from production. Queries like this are cheap, read-only and powerful: run them before and after your change to show you did not make things worse.'
  : 'Ngay trên dump vừa nạp, sách 7 đã lệch: không có phiếu nào đang mượn, mà chỉ còn 5 trên 6. Chính file dump đã mang theo độ lệch từ production. Những câu truy vấn kiểu này rẻ, chỉ đọc, và rất mạnh: chạy trước và sau thay đổi của bạn để chứng minh bạn không làm mọi thứ tệ hơn.'}</p>

<h3>💼 ${en ? 'OJT situation' : 'Tình huống OJT'}</h3>
<p>${en
  ? 'The client asks why their monthly report shows a different total from the invoices. A junior spends two days comparing Java code paths. A senior runs <code>SELECT ROUTINE_NAME FROM information_schema.ROUTINES</code>, finds the report is a procedure with its own formula, and has an answer before lunch. Always check the database for logic before concluding the code is the whole story.'
  : 'Khách hỏi vì sao báo cáo tháng ra tổng khác với hoá đơn. Một bạn junior mất hai ngày so các nhánh code Java. Một anh senior chạy <code>SELECT ROUTINE_NAME FROM information_schema.ROUTINES</code>, thấy báo cáo là một procedure có công thức riêng, và có câu trả lời trước giờ ăn trưa. Luôn kiểm logic trong CSDL trước khi kết luận code là toàn bộ câu chuyện.'}</p>

<h3>🧪 ${en ? 'Practice (20 minutes)' : 'Thực hành (20 phút)'}</h3>
<div class="callout ok"><ol>
<li>${en ? 'Run the four <code>information_schema</code> queries on your lab and draw the three tables with arrows; label the CASCADE arrow in red.' : 'Chạy bốn câu <code>information_schema</code> trên lab và vẽ ba bảng có mũi tên; tô đỏ mũi tên CASCADE.'}</li>
<li>${en ? 'Reproduce the vanished copy: delete reader 1 from the web UI, then run the drift query. How many books drift now?' : 'Tái hiện cuốn sách biến mất: xoá độc giả 1 trên giao diện, rồi chạy câu kiểm lệch. Giờ có bao nhiêu cuốn bị lệch?'}</li>
<li>${en ? 'Compute, for each reader type, the report’s fine and the fine Java would charge for 30 days late. Put it in a 3-row table.' : 'Tính, cho từng loại độc giả, phí mà báo cáo hiện và phí Java sẽ thu khi trễ 30 ngày. Lập bảng 3 dòng.'}</li>
<li>${en ? 'Reset the data (<code>docker compose down -v &amp;&amp; docker compose up -d</code>).' : 'Khôi phục dữ liệu (<code>docker compose down -v &amp;&amp; docker compose up -d</code>).'}</li>
</ol>
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? 'after deleting reader 1 the drift query returns 2 rows (books 1 and 7), and your fee table shows SV 60,000 vs 50,000, GV 60,000 vs 30,000, KHACH 60,000 vs 150,000.' : 'sau khi xoá độc giả 1, câu kiểm lệch trả 2 dòng (sách 1 và 7), và bảng phí của bạn ra SV 60.000 so với 50.000, GV 60.000 so với 30.000, KHACH 60.000 so với 150.000.'}</p></div>

<h3>🗂 ${en ? 'Key terms' : 'Thuật ngữ trong bài'}</h3>
${thuatNgu(en, [
  ['information_schema', 'lược đồ thông tin', 'Các view chỉ đọc mô tả bảng, khoá, trigger, routine của CSDL.', 'Read-only views describing a database’s tables, keys, triggers, routines.'],
  ['Foreign key', 'khoá ngoại', 'Cột trỏ tới khoá chính của bảng khác, kèm luật khi xoá/sửa.', 'A column pointing to another table’s key, with delete/update rules.'],
  ['ON DELETE CASCADE', 'xoá dây chuyền', 'Xoá dòng cha thì CSDL tự xoá các dòng con.', 'Deleting a parent row makes the database delete its children.'],
  ['Trigger', 'trigger (bẫy sự kiện)', 'Đoạn SQL CSDL tự chạy trước/sau insert/update/delete.', 'SQL the database runs automatically before/after insert/update/delete.'],
  ['Stored procedure', 'thủ tục lưu sẵn', 'Chương trình SQL đặt trong CSDL, gọi bằng CALL.', 'A SQL program stored in the database, called with CALL.'],
  ['Data drift', 'dữ liệu trôi lệch', 'Dữ liệu dẫn xuất không còn khớp dữ liệu gốc.', 'Derived data no longer matching its source.'],
  ['ER diagram', 'sơ đồ thực thể – quan hệ', 'Hình các bảng và quan hệ giữa chúng.', 'A picture of tables and their relationships.'],
])}

<h3>📌 ${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'Ask <code>information_schema</code>: keys and their delete rules, triggers, routines.' : 'Hỏi <code>information_schema</code>: khoá và luật xoá, trigger, routine.'}</li>
<li>${en ? '<code>ON DELETE CASCADE</code> on loans → readers silently deletes history and loses a copy.' : '<code>ON DELETE CASCADE</code> từ loans sang readers lặng lẽ xoá lịch sử và làm mất một bản sách.'}</li>
<li>${en ? 'Stock logic is split: trigger on borrow, Java on return.' : 'Logic tồn kho bị chia đôi: trigger khi mượn, Java khi trả.'}</li>
<li>${en ? 'The report procedure and Java disagree on fines — a business question, not yours to settle.' : 'Procedure báo cáo và Java tính phí khác nhau — câu hỏi nghiệp vụ, không phải để bạn tự quyết.'}</li>
<li>${en ? 'Drift queries are cheap evidence; run them before and after changes.' : 'Câu kiểm lệch là bằng chứng rẻ; chạy trước và sau mỗi thay đổi.'}</li>
</ul>

${tl('https://dev.mysql.com/doc/refman/8.0/en/information-schema.html', '🐬', 'MySQL 8.0 — INFORMATION_SCHEMA Tables', en ? 'Reference for the views used above' : 'Tra cứu các view dùng ở trên')}
${tl('https://dev.mysql.com/doc/refman/8.0/en/create-table-foreign-keys.html', '🐬', 'MySQL 8.0 — FOREIGN KEY Constraints', 'CASCADE, RESTRICT, NO ACTION')}
${tl('https://dbeaver.io/', '🦫', 'DBeaver Community', en ? 'Free database tool with ER diagrams' : 'Công cụ CSDL miễn phí có vẽ sơ đồ ER')}
${lk('/courses/introduction-to-databases', '🗄️', 'DBI202 — Introduction to Databases (Academy)', en ? 'Keys, constraints and triggers from the beginning' : 'Khoá, ràng buộc và trigger từ đầu')}
`
);

/* ═══════════════════ 2.4 — Đọc lịch sử ═══════════════════ */
const O24_S = out(`
$ git log --oneline -S "available - 1"
1d7ff47 fix loi so luong am (TV-23)
1133063 init project
$ git show --stat 1d7ff47
commit 1d7ff47312c8d559dcb00e88df4e29aef0c4adfe
Author: Nguyen Anh Tuan <tuan@thuvien.local>
Date:   Tue Sep 20 11:05:00 2016 +0700

    fix loi so luong am (TV-23)

    Hai thu thu bam muon cung luc thi available bi tru 2 lan / am.
    Chuyen viec tru so luong vao trigger trg_loans_ai cho chac. Phan TRA SACH van cong trong Java, chua sua.

 db/thuvien.sql                                     | 10 ++++++++++
 src/main/java/com/thuvien/servlet/BookServlet.java |  1 -
 2 files changed, 10 insertions(+), 1 deletion(-)
`
);
const O24_BLAME = out(`
$ git blame -L 107,111 src/main/java/com/thuvien/servlet/BookServlet.java
ac4b9410 (Tran Quoc Hung 2017-04-11 14:22:00 +0700 107)                     max = 1;
ac4b9410 (Tran Quoc Hung 2017-04-11 14:22:00 +0700 108)                 }
ac4b9410 (Tran Quoc Hung 2017-04-11 14:22:00 +0700 109)                 if (dangMuon > max) {
ac4b9410 (Tran Quoc Hung 2017-04-11 14:22:00 +0700 110)                     response.sendRedirect("books?msg=" + URLEncoder.encode("Vượt quá số sách được mượn", "UTF-8"));
ac4b9410 (Tran Quoc Hung 2017-04-11 14:22:00 +0700 111)                     return;
$ git log -1 --format=%s ac4b9410
TV-41 gioi han so sach muon theo loai doc gia (SV 3, GV 10, khach 1)
`
);
const O24_FILE = out(`
$ git log --format="%h %ad %an %s" --date=short -- src/main/java/com/thuvien/servlet/BookServlet.java
4780c81 2018-06-20 Tran Quoc Hung refactor
c4b91f7 2017-06-19 Tran Quoc Hung TV-52 SV khieu nai phi qua cao -> tran 50k (chi ap dung SV theo y kien phong CTSV)
7b36199 2017-05-02 Tran Quoc Hung TV-45 tinh phi tre han khi tra sach
ac4b941 2017-04-11 Tran Quoc Hung TV-41 gioi han so sach muon theo loai doc gia (SV 3, GV 10, khach 1)
1d7ff47 2016-09-20 Nguyen Anh Tuan fix loi so luong am (TV-23)
1133063 2016-03-02 Nguyen Anh Tuan init project
$ git log --oneline -S "50000"
c4b91f7 TV-52 SV khieu nai phi qua cao -> tran 50k (chi ap dung SV theo y kien phong CTSV)
$ git log --format='%h %s' -- src/main/webapp/WEB-INF/web.xml
e505b01 update
c50e9ac tam tat export, server moi chay linux khong co o C
27b41a4 xuat csv cho ke toan
d48c4bb them chuc nang doc gia
1133063 init project
`
);
const O24_REF = out(`
$ git show 4780c81 -- src/main/java/com/thuvien/servlet/BookServlet.java
commit 4780c8144702d1825d0f746aa7b70e129bdce9bb
Author: Tran Quoc Hung <hung@thuvien.local>
Date:   Wed Jun 20 13:37:00 2018 +0700

    refactor
…
@@ -35,8 +37,7 @@ public class BookServlet extends HttpServlet {
         request.setCharacterEncoding("UTF-8");
         String q = request.getParameter("q");
         List<Book> books = new ArrayList<Book>();
-        if (q == null) q = "";
-        {
+        if (StringUtils.isNotBlank(q)) {
             // tim theo ten hoac tac gia
…
+        } else {
+            books = new BookDAO().findAll();
         }
`
);

const L24 = ml((en) => `
<span class="eyebrow">${en ? 'Chapter 2 · Mapping an unfamiliar codebase' : 'Chương 2 · Vẽ bản đồ một codebase lạ'}</span>
<h2>${en ? '2.4 — Reading history for the “why”: git log, blame, old tickets' : '2.4 — Đọc lịch sử để hiểu "vì sao": git log, blame, ticket cũ'}</h2>
<p class="lead">${en
  ? 'The code tells you <em>what</em> the system does. Only history tells you <em>why</em> — and the why decides whether a strange line is a bug or a fix you must keep. The commands themselves (log, show, blame, the pickaxe <code>-S</code>) are taught in the Git course, Chapter 2; this lesson is about using them as a maintainer, on the lab’s 13 commits.'
  : 'Code cho bạn biết hệ thống làm <em>gì</em>. Chỉ lịch sử mới cho biết <em>vì sao</em> — và cái "vì sao" quyết định một dòng kỳ quặc là bug hay là bản vá bạn phải giữ. Bản thân các lệnh (log, show, blame, "cuốc chim" <code>-S</code>) được dạy ở khoá Git, Chương 2; bài này dạy dùng chúng với tư cách người bảo trì, trên 13 commit của lab.'}</p>
${moiTruong(en)}

<h3>${en ? 'Question 1 — why is half the stock logic in a trigger?' : 'Câu hỏi 1 — vì sao một nửa logic tồn kho nằm trong trigger?'}</h3>
${O24_S}
<p>${en
  ? '<code>-S "text"</code> lists the commits where the number of occurrences of that text changed — when it appeared, moved or disappeared. Two hits: the line was born in <code>init project</code> and moved in <code>1d7ff47</code>. That commit message is a gift: a race condition (“two librarians press borrow at the same time”), the decision (move it into a trigger), and an honest note that the return side was <em>not</em> fixed. Now the asymmetry you found in 2.2–2.3 is not a mystery; it is a known, unfinished fix with a ticket number (TV-23) you can ask about.'
  : '<code>-S "chữ"</code> liệt kê các commit làm thay đổi số lần chữ đó xuất hiện — lúc nó ra đời, bị chuyển, hay biến mất. Hai kết quả: dòng đó sinh ra ở <code>init project</code> và bị chuyển đi ở <code>1d7ff47</code>. Lời nhắn của commit đó là một món quà: một lỗi tranh chấp ("hai thủ thư bấm mượn cùng lúc"), quyết định (chuyển vào trigger), và một ghi chú trung thực rằng phía trả sách <em>chưa</em> sửa. Giờ sự bất đối xứng bạn thấy ở 2.2–2.3 không còn là bí ẩn; nó là một bản vá đã biết, làm dở, có mã ticket (TV-23) để bạn hỏi.'}</p>

<h3>${en ? 'Question 2 — is the off-by-one a bug or a decision?' : 'Câu hỏi 2 — lỗi lệch một là bug hay là quyết định?'}</h3>
${O24_BLAME}
<p>${en
  ? '<code>blame</code> gives each line its last commit. All of the limit block, including <code>&gt; max</code>, came in one commit whose message states the rule: SV 3, GV 10, guest 1. So <code>&gt;</code> contradicts the written intention of its own author — strong evidence of a bug rather than a deliberate exception. Compare with the fine cap:'
  : '<code>blame</code> gán cho mỗi dòng commit cuối cùng đã đụng tới nó. Cả khối giới hạn, kể cả <code>&gt; max</code>, vào cùng một commit mà lời nhắn nêu rõ luật: SV 3, GV 10, khách 1. Vậy <code>&gt;</code> trái với ý định đã viết ra của chính tác giả — bằng chứng mạnh rằng đó là bug chứ không phải ngoại lệ có chủ đích. So với cái trần phí:'}</p>
${O24_FILE}
<p>${en
  ? 'The 50,000 cap applies only to students, which looked like an inconsistency in 2.3. History says it is <strong>deliberate</strong>: ticket TV-52, a student complaint, and “only for SV, per the student affairs office”. If you had “fixed” it for all reader types you would have broken a business decision. That is the whole point of reading history before changing anything: the same kind of oddity can be a bug in one place and a requirement in another.'
  : 'Trần 50.000 chỉ áp cho sinh viên, điều mà ở 2.3 trông như thiếu nhất quán. Lịch sử nói nó là <strong>có chủ đích</strong>: ticket TV-52, sinh viên khiếu nại, và "chỉ áp dụng SV theo ý kiến phòng CTSV". Nếu bạn "sửa" cho mọi loại độc giả là bạn đã phá một quyết định nghiệp vụ. Đó chính là lý do phải đọc lịch sử trước khi đổi bất cứ gì: cùng một kiểu kỳ quặc, ở chỗ này là bug, ở chỗ kia lại là yêu cầu.'}</p>
<p>${en
  ? 'The same file view also answers lesson 2.1’s mystery: <code>/export</code> was switched off on purpose (“the new server runs Linux and has no C: drive”) — the hard-coded <code>C:\\thuvien\\export\\</code> path in <code>Constants</code> is why.'
  : 'Cũng góc nhìn theo tệp này trả lời bí ẩn ở bài 2.1: <code>/export</code> bị tắt có chủ đích ("server mới chạy Linux, không có ổ C") — đường dẫn cứng <code>C:\\thuvien\\export\\</code> trong <code>Constants</code> là lý do.'}</p>

<h3>${en ? 'When the message lies: a “refactor” that changed behaviour' : 'Khi lời nhắn nói dối: một commit "refactor" đã đổi hành vi'}</h3>
${O24_REF}
<p>${en
  ? 'Commit <code>4780c81</code> says only “refactor”. Read the diff as a reviewer would. Before: a blank search box ran <code>LIKE \'%%\'</code>, a search of a few spaces ran <code>LIKE \'%   %\'</code> (finding almost nothing). After: any blank or whitespace-only query shows <em>all</em> books, through a new DAO, in id order. Small, probably harmless — but it is a <strong>behaviour change hidden in a commit that claims none</strong>. When a commit message is useless, the diff is the truth; when the diff is not enough, look for the ticket (TV-xx), the PR discussion, or ask.'
  : 'Commit <code>4780c81</code> chỉ ghi "refactor". Đọc diff như một người review. Trước: ô tìm kiếm trống chạy <code>LIKE \'%%\'</code>, tìm vài dấu cách chạy <code>LIKE \'%   %\'</code> (gần như không ra gì). Sau: mọi truy vấn trống hoặc chỉ toàn khoảng trắng đều hiện <em>tất cả</em> sách, qua một DAO mới, theo thứ tự id. Nhỏ, có lẽ vô hại — nhưng đó là một <strong>thay đổi hành vi giấu trong commit tự nhận là không đổi gì</strong>. Lời nhắn vô dụng thì diff là sự thật; diff chưa đủ thì tìm ticket (TV-xx), thảo luận trong PR, hoặc hỏi.'}</p>
<div class="callout warn"><p>${en
  ? '<strong>Blame is not about blaming.</strong> Lines 101–111 are “Hùng’s”, but Hùng in 2017 had a deadline and no tests. Use blame to find the commit and its context, never to say “his fault” in a review or a chat. If the person is still around, ask with your evidence: “In TV-41 the limit was SV 3; line 109 uses <code>&gt;</code>, so students can borrow 4 — was that intended?”'
  : '<strong>Blame không phải để đổ lỗi.</strong> Dòng 101–111 là "của Hùng", nhưng Hùng năm 2017 có deadline và không có test. Dùng blame để tìm commit và bối cảnh của nó, không bao giờ để nói "lỗi của anh ấy" trong review hay trên chat. Nếu người đó vẫn còn, hỏi kèm bằng chứng: "Ở TV-41 giới hạn là SV 3; dòng 109 dùng <code>&gt;</code> nên sinh viên mượn được 4 — có phải chủ đích không ạ?"'}</p></div>

<h3>${en ? 'Ask the right person, with your map in hand' : 'Hỏi đúng người, cầm sẵn bản đồ'}</h3>
<table>
<thead><tr><th>${en ? 'Question type' : 'Loại câu hỏi'}</th><th>${en ? 'Ask' : 'Hỏi ai'}</th></tr></thead>
<tbody>
<tr><td>${en ? '“Is the rule SV 3 or SV 4?” (business)' : '"Luật là SV 3 hay SV 4?" (nghiệp vụ)'}</td><td>${en ? 'BA / product owner / the client’s key user — not another developer' : 'BA / product owner / người dùng chính phía khách — không phải một lập trình viên khác'}</td></tr>
<tr><td>${en ? '“Why is it a trigger?” (technical history)' : '"Vì sao lại là trigger?" (lịch sử kỹ thuật)'}</td><td>${en ? 'The commit author if still here, else the longest-serving developer' : 'Tác giả commit nếu còn ở đây, không thì người làm dự án lâu nhất'}</td></tr>
<tr><td>${en ? '“Which Tomcat runs in production?” (operations)' : '"Production chạy Tomcat nào?" (vận hành)'}</td><td>${en ? 'Lead / DevOps' : 'Leader / DevOps'}</td></tr>
</tbody>
</table>
<p>${en
  ? 'A good question shows what you already did: “I traced borrow (diagram attached), found line 109, history says TV-41 meant SV 3, reproduction shows 4. Can you confirm the rule?” It takes the other person one minute to answer and shows you did your homework.'
  : 'Một câu hỏi tốt cho thấy bạn đã làm gì: "Em đã lần luồng mượn (kèm sơ đồ), thấy dòng 109, lịch sử ghi TV-41 định SV 3, tái hiện ra 4. Anh/chị xác nhận giúp em luật đúng ạ?" Người kia mất một phút để trả lời, và thấy bạn đã làm bài tập trước.'}</p>

<h3>🧪 ${en ? 'Practice (20 minutes)' : 'Thực hành (20 phút)'}</h3>
<div class="callout ok"><ol>
<li>${en ? 'Find with <code>-S</code> the commit that introduced <code>sp_overdue_report</code>. Who, when, which ticket?' : 'Dùng <code>-S</code> tìm commit đã thêm <code>sp_overdue_report</code>. Ai, khi nào, ticket nào?'}</li>
<li>${en ? 'Find the commit that added <code>header.jsp</code>’s SQL count. Was it the same commit? What does that tell you about the garbled menu (known issue #1)?' : 'Tìm commit thêm câu đếm SQL vào <code>header.jsp</code>. Có cùng commit không? Điều đó cho biết gì về menu lỗi font (lỗi đã biết #1)?'}</li>
<li>${en ? 'Read <code>git show e505b01</code> (“update”) and write the commit message it should have had.' : 'Đọc <code>git show e505b01</code> ("update") và viết lại lời nhắn mà nó lẽ ra phải có.'}</li>
<li>${en ? 'Draft the question you would send about line 109, in two sentences, with evidence.' : 'Soạn câu hỏi bạn sẽ gửi về dòng 109, trong hai câu, có bằng chứng.'}</li>
</ol>
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? 'you can say for each oddity found so far — off-by-one, SV-only cap, trigger/Java split, disabled export — whether history marks it as a bug or a decision, citing a commit hash.' : 'với mỗi điều kỳ quặc đã thấy — lệch một, trần chỉ cho SV, chia đôi trigger/Java, export bị tắt — bạn nói được lịch sử đánh dấu nó là bug hay quyết định, kèm mã commit.'}</p></div>

<h3>🗂 ${en ? 'Key terms' : 'Thuật ngữ trong bài'}</h3>
${thuatNgu(en, [
  ['Pickaxe (git log -S)', 'cuốc chim', 'Tìm commit làm thay đổi số lần xuất hiện của một chuỗi.', 'Finds commits that change how often a string appears.'],
  ['git blame', 'xem dòng do commit nào', 'Gán mỗi dòng cho commit cuối cùng đã sửa nó.', 'Assigns each line to the last commit that changed it.'],
  ['Commit message', 'lời nhắn commit', 'Lời giải thích của tác giả — tốt nhất có lý do và mã ticket.', 'The author’s explanation — best with a reason and a ticket id.'],
  ['Race condition', 'lỗi tranh chấp', 'Kết quả sai khi hai thao tác chạy cùng lúc.', 'A wrong result when two operations run at the same time.'],
  ['Business rule', 'luật nghiệp vụ', 'Quy định của tổ chức (giới hạn mượn, mức phí) mà code thực thi.', 'An organisation’s rule (borrow limit, fees) the code enforces.'],
  ['Behaviour change', 'thay đổi hành vi', 'Đầu ra khác đi với cùng đầu vào — không được giấu trong "refactor".', 'Different output for the same input — must not hide in a “refactor”.'],
])}

<h3>📌 ${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'Code says what; history says why; the why decides bug vs requirement.' : 'Code nói "gì"; lịch sử nói "vì sao"; "vì sao" quyết định bug hay yêu cầu.'}</li>
<li>${en ? '<code>log -S</code> finds when a line appeared or moved; <code>blame</code> finds the commit behind a line.' : '<code>log -S</code> tìm lúc một dòng ra đời hay bị chuyển; <code>blame</code> tìm commit đứng sau một dòng.'}</li>
<li>${en ? 'The off-by-one contradicts TV-41 (bug); the SV-only cap matches TV-52 (decision).' : 'Lệch một trái với TV-41 (bug); trần chỉ cho SV khớp TV-52 (quyết định).'}</li>
<li>${en ? 'A “refactor” message can hide a behaviour change; read the diff.' : 'Lời nhắn "refactor" có thể giấu một thay đổi hành vi; hãy đọc diff.'}</li>
<li>${en ? 'Blame finds context, not culprits; ask the right person with evidence.' : 'Blame tìm bối cảnh, không tìm thủ phạm; hỏi đúng người, kèm bằng chứng.'}</li>
</ul>

${lk(bai('git', 'git-2-3-blame-va-pickaxe'), '🌿', en ? 'Git 2.3 — blame and pickaxe' : 'Git 2.3 — blame và pickaxe', en ? 'The commands in depth (not repeated here)' : 'Các lệnh chi tiết (không dạy lại ở đây)')}
${lk(bai('git', 'git-2-5-dieu-tra-thuc-te'), '🔎', en ? 'Git 2.5 — A real investigation' : 'Git 2.5 — Điều tra thực tế', en ? 'Another worked example of history reading' : 'Thêm một ví dụ đọc lịch sử')}
${tl('https://git-scm.com/docs/git-log', '📘', 'git-log documentation', '-S, -G, -L, --follow')}
${tl('https://git-scm.com/docs/git-blame', '📘', 'git-blame documentation', '-L, -w, -C')}
`
);

/* ═══════════════════ 2.5 — Sơ đồ ═══════════════════ */
const C25_CONTEXT = bash(`
flowchart LR
    TT["👤 Thủ thư<br/>(nhân viên thư viện)"] -->|"mượn/trả, quản lý sách, độc giả"| HT["Hệ thống thư viện<br/>legacy-thu-vien"]
    QL["👤 Quản trị"] -->|"xem báo cáo quá hạn"| HT
    HT -.->|"xuất CSV cho kế toán<br/>(TẮT từ 2018)"| KT["Phòng kế toán"]
`
);
const C25_CONTAINER = bash(`
flowchart LR
    B["Trình duyệt"] -->|"HTTP form POST/GET<br/>cookie JSESSIONID"| W
    subgraph W["Tomcat 9 · Java 8 · thuvien.war"]
      J["JSP (scriptlet)<br/>books, readers, report, header"]
      S["Servlet<br/>Login, Book (193 dòng), Reader, Report"]
      S --> J
      J -. "header.jsp tự mở kết nối" .-> D
    end
    S -->|"JDBC nối chuỗi · driver 5.1.49"| D[("MySQL 8.0 · thuvien<br/>trigger trg_loans_ai<br/>procedure sp_overdue_report<br/>FK loans→readers CASCADE")]
`
);

const L25 = ml((en) => `
<span class="eyebrow">${en ? 'Chapter 2 · Mapping an unfamiliar codebase' : 'Chương 2 · Vẽ bản đồ một codebase lạ'}</span>
<h2>${en ? '2.5 — Drawing what you learned: C4 context/container and a sequence diagram' : '2.5 — Vẽ lại điều đã hiểu: C4 context/container và sơ đồ tuần tự'}</h2>
<p class="lead">${en
  ? 'Everything you found in this chapter is in your notebook, in your head, and nowhere else. Two diagrams and one sequence chart turn it into something the next person can read in ten minutes. The rule: draw only what you verified, keep it to one page, and store it next to the code so it can be corrected in the same PR as the code.'
  : 'Mọi thứ bạn tìm ra trong chương này đang nằm trong nhật ký, trong đầu bạn, và không ở đâu khác. Hai sơ đồ và một biểu đồ tuần tự biến nó thành thứ người sau đọc được trong mười phút. Luật: chỉ vẽ những gì đã kiểm chứng, gói trong một trang, và đặt cạnh code để sửa được trong cùng PR với code.'}</p>

<h3>${en ? 'Why C4, and why only the first two levels' : 'Vì sao C4, và vì sao chỉ hai tầng đầu'}</h3>
<p>${en
  ? 'The C4 model, by Simon Brown, describes software at four zoom levels: <strong>Context</strong> (the system as one box, with its users and neighbours), <strong>Container</strong> (the separately running pieces: web app, database…), <strong>Component</strong> and <strong>Code</strong>. For a maintenance map the first two are almost always enough: they answer “what talks to what, over which protocol, and where does data live”. Component and code levels go out of date fastest; the IDE shows them better anyway.'
  : 'Mô hình C4 của Simon Brown mô tả phần mềm ở bốn mức phóng: <strong>Context (bối cảnh)</strong> — hệ thống là một hộp, cùng người dùng và hệ thống lân cận; <strong>Container (khối chạy)</strong> — các phần chạy riêng: ứng dụng web, CSDL…; <strong>Component</strong> và <strong>Code</strong>. Với bản đồ bảo trì, hai mức đầu gần như luôn đủ: chúng trả lời "cái gì nói chuyện với cái gì, qua giao thức nào, dữ liệu nằm đâu". Mức component và code lỗi thời nhanh nhất; IDE cũng hiển thị chúng tốt hơn.'}</p>

<h3>${en ? 'Level 1 — Context' : 'Mức 1 — Bối cảnh'}</h3>
${C25_CONTEXT}
<p>${en
  ? 'Who uses it, for what, and which outside parties depend on it — including the dashed, switched-off export (lesson 2.4). A dashed arrow for “exists but disabled” is exactly the kind of detail that saves the next person an hour.'
  : 'Ai dùng nó, để làm gì, và những bên ngoài nào phụ thuộc vào nó — kể cả đường export nét đứt đã bị tắt (bài 2.4). Một mũi tên nét đứt cho "có nhưng đang tắt" chính là loại chi tiết giúp người sau đỡ mất một giờ.'}</p>

<h3>${en ? 'Level 2 — Containers' : 'Mức 2 — Các khối chạy'}</h3>
${C25_CONTAINER}
<p>${en
  ? 'Put on the arrows what you learned the hard way: the protocol and the driver version, the fact that SQL is concatenated, that a JSP opens its own connection. Inside the database box, list the three things the IDE cannot see — trigger, procedure, cascade. A newcomer reading this diagram will not repeat your two days of discovery.'
  : 'Ghi lên mũi tên những gì bạn đã học bằng mồ hôi: giao thức và bản driver, việc SQL được nối chuỗi, việc một JSP tự mở kết nối. Trong hộp CSDL, liệt kê ba thứ IDE không nhìn thấy — trigger, procedure, cascade. Người mới đọc sơ đồ này sẽ không phải lặp lại hai ngày khám phá của bạn.'}</p>

<h3>${en ? 'Plus one sequence diagram per important flow' : 'Thêm một sơ đồ tuần tự cho mỗi luồng quan trọng'}</h3>
<p>${en
  ? 'You already wrote “borrow” in lesson 2.2 and “return” in its exercise. Two flows are enough for this app; on a big system, choose the three or four flows that carry money, data or the most tickets.'
  : 'Bạn đã viết luồng "mượn" ở bài 2.2 và "trả" trong bài tập của nó. Hai luồng là đủ cho ứng dụng này; với hệ thống lớn, chọn ba bốn luồng liên quan tới tiền, dữ liệu, hoặc nhận nhiều ticket nhất.'}</p>

<h3>${en ? 'Diagrams as code' : 'Sơ đồ dưới dạng code'}</h3>
<table>
<thead><tr><th></th><th>Mermaid</th><th>PlantUML</th><th>${en ? 'Drawing tool (draw.io…)' : 'Công cụ vẽ (draw.io…)'}</th></tr></thead>
<tbody>
<tr><td>${en ? 'Lives in the repo as text' : 'Nằm trong repo dạng chữ'}</td><td>✅ ${en ? 'inside .md' : 'trong .md'}</td><td>✅ .puml</td><td>${en ? 'file, hard to diff' : 'tệp, khó so diff'}</td></tr>
<tr><td>${en ? 'Renders on GitHub/GitLab' : 'Hiển thị trên GitHub/GitLab'}</td><td>✅ ${en ? 'natively' : 'sẵn'}</td><td>${en ? 'needs a plugin/server' : 'cần plugin/máy chủ'}</td><td>${en ? 'as an image' : 'dạng ảnh'}</td></tr>
<tr><td>${en ? 'Reviewed in a PR' : 'Review được trong PR'}</td><td>✅</td><td>✅</td><td>${en ? 'barely' : 'rất khó'}</td></tr>
</tbody>
</table>
<p>${en
  ? 'For a maintenance map, prefer Mermaid in <code>docs/BAN-DO.md</code>: it shows up when someone opens the repo on GitHub, and a reviewer sees diagram changes as text in the same PR as code changes. A diagram that is updated in the same PR as the code is the only kind that stays true.'
  : 'Với bản đồ bảo trì, ưu tiên Mermaid trong <code>docs/BAN-DO.md</code>: nó hiện ra khi ai đó mở repo trên GitHub, và người review thấy thay đổi sơ đồ dưới dạng chữ trong cùng PR với thay đổi code. Sơ đồ được sửa cùng PR với code là loại duy nhất giữ được sự đúng đắn.'}</p>
<div class="pitfall co-tieu-de"><p><strong>${en ? 'Trap — drawing the architecture you wish it had.' : 'Bẫy — vẽ kiến trúc bạn ước nó có.'}</strong> ${en
  ? 'A neat “Controller → Service → DAO” picture of this app would be a lie: seven places open database connections. Draw the mess as it is; the improvement belongs to Chapter 5, and the honest “before” picture is what makes the “after” valuable.'
  : 'Một hình "Controller → Service → DAO" gọn gàng cho ứng dụng này là nói dối: bảy chỗ tự mở kết nối CSDL. Vẽ cái lộn xộn đúng như nó đang là; cải thiện thuộc về Chương 5, và bức hình "trước" trung thực mới làm cho bức "sau" có giá trị.'}</p></div>

<h3>💼 ${en ? 'OJT situation' : 'Tình huống OJT'}</h3>
<p>${en
  ? 'Two weeks in, a second intern joins. Your lead says: “Show them around.” Without a map you will spend an afternoon talking. With <code>docs/BAN-DO.md</code> you send one link, they read it in ten minutes, and you answer three questions. That is also the moment your lead notices the map.'
  : 'Hai tuần sau, một intern nữa vào nhóm. Leader bảo: "Dẫn bạn ấy làm quen nhé." Không có bản đồ, bạn mất một buổi chiều để nói. Có <code>docs/BAN-DO.md</code>, bạn gửi một đường link, bạn ấy đọc mười phút, bạn trả lời ba câu hỏi. Đó cũng là lúc leader để ý tới tấm bản đồ.'}</p>

<h3>🧪 ${en ? 'Practice (20 minutes)' : 'Thực hành (20 phút)'}</h3>
<div class="callout ok"><ol>
<li>${en ? 'Create <code>docs/BAN-DO.md</code> with the context and container diagrams in Mermaid. Fix anything above that does not match your own findings.' : 'Tạo <code>docs/BAN-DO.md</code> với sơ đồ bối cảnh và khối chạy bằng Mermaid. Sửa bất cứ chỗ nào ở trên không khớp với phát hiện của chính bạn.'}</li>
<li>${en ? 'Add the borrow and return sequence diagrams.' : 'Thêm sơ đồ tuần tự mượn và trả.'}</li>
<li>${en ? 'Preview it (GitHub, VS Code’s Markdown preview with a Mermaid extension, or mermaid.live).' : 'Xem trước (GitHub, xem trước Markdown của VS Code kèm extension Mermaid, hoặc mermaid.live).'}</li>
</ol>
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? 'all four diagrams render, and every box and arrow can be backed by an output or a line number from this chapter.' : 'cả bốn sơ đồ hiển thị được, và mọi hộp, mọi mũi tên đều có một output hoặc số dòng trong chương này làm chứng.'}</p></div>

<h3>🗂 ${en ? 'Key terms' : 'Thuật ngữ trong bài'}</h3>
${thuatNgu(en, [
  ['C4 model', 'mô hình C4', 'Bốn mức phóng: Context, Container, Component, Code.', 'Four zoom levels: Context, Container, Component, Code.'],
  ['Context diagram', 'sơ đồ bối cảnh', 'Hệ thống là một hộp, với người dùng và hệ thống lân cận.', 'The system as one box with its users and neighbours.'],
  ['Container (C4)', 'khối chạy', 'Một phần chạy riêng: ứng dụng web, CSDL, hàng đợi — không phải container Docker.', 'A separately running part: web app, database, queue — not a Docker container.'],
  ['Mermaid', 'Mermaid', 'Ngôn ngữ chữ để vẽ sơ đồ, GitHub hiển thị trực tiếp.', 'A text language for diagrams that GitHub renders directly.'],
  ['Diagrams as code', 'sơ đồ dạng code', 'Sơ đồ lưu bằng chữ trong repo, review và sửa như code.', 'Diagrams stored as text in the repo, reviewed and edited like code.'],
])}

<h3>📌 ${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'Two C4 levels (context, container) + one sequence per key flow = a one-page map.' : 'Hai mức C4 (bối cảnh, khối chạy) + một sơ đồ tuần tự cho mỗi luồng chính = bản đồ một trang.'}</li>
<li>${en ? 'Write the hard-won details on the arrows: protocol, driver, concatenated SQL.' : 'Ghi chi tiết học bằng mồ hôi lên mũi tên: giao thức, driver, SQL nối chuỗi.'}</li>
<li>${en ? 'List what the IDE cannot see inside the database box.' : 'Liệt kê những thứ IDE không thấy ngay trong hộp CSDL.'}</li>
<li>${en ? 'Mermaid in the repo, updated in the same PR as the code.' : 'Mermaid trong repo, sửa trong cùng PR với code.'}</li>
<li>${en ? 'Draw the system as it is, not as it should be.' : 'Vẽ hệ thống đúng như nó đang là, không như nó nên là.'}</li>
</ul>

${tl('https://c4model.com/', '🗺️', 'The C4 model (Simon Brown)', en ? 'Context, containers, components, code' : 'Bối cảnh, khối chạy, thành phần, code')}
${tl('https://mermaid.js.org/syntax/flowchart.html', '🧜', 'Mermaid — Flowcharts', en ? 'Syntax for the two C4 diagrams above' : 'Cú pháp cho hai sơ đồ C4 ở trên')}
${tl('https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams', '🐙', 'GitHub Docs — Creating diagrams', en ? 'Mermaid rendered in Markdown' : 'Mermaid hiển thị trong Markdown')}
`
);

/* ═══════════════════ 2.6 — Lab ═══════════════════ */
const L26 = ml((en) => `
<span class="eyebrow">${en ? 'Chapter 2 · Lab' : 'Chương 2 · Lab'}</span>
<h2>${en ? '2.6 — Lab: A one-page map of the legacy library app' : '2.6 — Lab: Bản đồ một trang của ứng dụng thư viện cũ'}</h2>
<p class="lead">${en
  ? 'You will produce the document you wished you had on day one: <code>docs/BAN-DO.md</code>, one page, that lets a new developer find their way around the library app in ten minutes — and a list of risks ranked by what you found, ready for Chapter 3.'
  : 'Bạn sẽ làm ra đúng tài liệu mà bạn ước có từ ngày đầu: <code>docs/BAN-DO.md</code>, một trang, giúp lập trình viên mới định hướng được trong ứng dụng thư viện trong mười phút — kèm danh sách rủi ro xếp theo những gì đã phát hiện, sẵn sàng cho Chương 3.'}</p>

<h3>${en ? 'The ticket' : 'Ticket'}</h3>
<div class="callout"><p><strong>LIB-102 · ${en ? 'Document the system map' : 'Lập bản đồ hệ thống'}</strong><br>
${en
  ? 'Acceptance: one Markdown page in the repo with (1) entry points, (2) the three main flows, (3) the main tables and the logic living in the database, (4) risks with evidence; every claim backed by a command output, a line number or a commit hash.'
  : 'Tiêu chí chấp nhận: một trang Markdown trong repo gồm (1) các điểm vào, (2) ba luồng chính, (3) các bảng chính và logic nằm trong CSDL, (4) rủi ro kèm bằng chứng; mọi khẳng định đều có output lệnh, số dòng hoặc mã commit làm chứng.'}</p></div>

<h3>${en ? 'Required sections of docs/BAN-DO.md' : 'Các phần bắt buộc của docs/BAN-DO.md'}</h3>
<ol>
<li>${en ? '<strong>Doors</strong> — table URL → class/JSP → login required? (2.1). Note <code>/export</code> and why it is off (2.4).' : '<strong>Cửa</strong> — bảng URL → lớp/JSP → có cần đăng nhập? (2.1). Ghi chú <code>/export</code> và vì sao bị tắt (2.4).'}</li>
<li>${en ? '<strong>Containers</strong> — the C4 container diagram (2.5).' : '<strong>Khối chạy</strong> — sơ đồ C4 container (2.5).'}</li>
<li>${en ? '<strong>Three flows</strong> — borrow, return, overdue report — as sequence diagrams (2.2) or numbered steps with file:line.' : '<strong>Ba luồng</strong> — mượn, trả, báo cáo quá hạn — bằng sơ đồ tuần tự (2.2) hoặc các bước đánh số kèm tệp:dòng.'}</li>
<li>${en ? '<strong>Data</strong> — tables, foreign keys with their delete rules, trigger, procedure (2.3).' : '<strong>Dữ liệu</strong> — các bảng, khoá ngoại kèm luật xoá, trigger, procedure (2.3).'}</li>
<li>${en ? '<strong>Hotspots</strong> — the churn × size table (2.1).' : '<strong>Điểm nóng</strong> — bảng tần suất sửa × kích thước (2.1).'}</li>
<li>${en ? '<strong>Risks</strong> — at least six, each with evidence and a label “bug / decision / unknown — ask X” from history (2.4).' : '<strong>Rủi ro</strong> — ít nhất sáu, mỗi cái có bằng chứng và nhãn "bug / quyết định / chưa rõ — hỏi X" dựa trên lịch sử (2.4).'}</li>
</ol>

<h3>${en ? 'Risk list — the minimum you should have found' : 'Danh sách rủi ro — tối thiểu bạn phải tìm ra'}</h3>
<table>
<thead><tr><th>#</th><th>${en ? 'Risk' : 'Rủi ro'}</th><th>${en ? 'Evidence' : 'Bằng chứng'}</th><th>${en ? 'Label' : 'Nhãn'}</th></tr></thead>
<tbody>
<tr><td>1</td><td>${en ? 'Students can borrow 4' : 'Sinh viên mượn được 4'}</td><td>BookServlet:109, ac4b941 (TV-41), ${en ? 'reproduction' : 'tái hiện'}</td><td>${en ? 'bug' : 'bug'}</td></tr>
<tr><td>2</td><td>${en ? 'Deleting a reader deletes history and loses a copy' : 'Xoá độc giả làm mất lịch sử và mất một bản sách'}</td><td>fk_loans_reader CASCADE, ${en ? 'drift query' : 'câu kiểm lệch'}</td><td>${en ? 'unknown — ask BA' : 'chưa rõ — hỏi BA'}</td></tr>
<tr><td>3</td><td>${en ? 'Report fines ≠ charged fines' : 'Phí trên báo cáo ≠ phí thu thật'}</td><td>sp_overdue_report vs BookServlet:149–161</td><td>${en ? 'unknown — ask BA' : 'chưa rõ — hỏi BA'}</td></tr>
<tr><td>4</td><td>${en ? 'Stock logic split trigger/Java' : 'Logic tồn kho chia đôi trigger/Java'}</td><td>1d7ff47 (TV-23), BookServlet:167</td><td>${en ? 'known unfinished fix' : 'bản vá làm dở đã biết'}</td></tr>
<tr><td>5</td><td>${en ? 'SQL built by concatenation (≥ 11 places)' : 'SQL dựng bằng nối chuỗi (≥ 11 chỗ)'}</td><td>${en ? 'grep 9 + reading 2; login bypass in Start here 2/2' : 'grep 9 + đọc thêm 2; vượt đăng nhập ở Bắt đầu 2/2'}</td><td>${en ? 'bug (security)' : 'bug (bảo mật)'}</td></tr>
<tr><td>6</td><td>${en ? 'Garbled menu' : 'Menu lỗi font'}</td><td>header.jsp ${en ? 'without pageEncoding' : 'thiếu pageEncoding'}</td><td>${en ? 'bug' : 'bug'}</td></tr>
</tbody>
</table>
<p>${en
  ? 'Good maps usually find more: plain-text passwords, the database password inside the WAR, exceptions swallowed with <code>printStackTrace()</code>, <code>error.jsp</code> printing stack traces to users, the hidden behaviour change in <code>4780c81</code>.'
  : 'Bản đồ tốt thường tìm ra nhiều hơn: mật khẩu lưu dạng chữ thường, mật khẩu CSDL nằm trong WAR, ngoại lệ bị nuốt bằng <code>printStackTrace()</code>, <code>error.jsp</code> in stack trace ra cho người dùng, thay đổi hành vi giấu trong <code>4780c81</code>.'}</p>

<h3>${en ? 'Done when' : 'Đạt khi'}</h3>
<div class="callout ok"><ul>
<li>${en ? 'A classmate who has never seen the app reads <code>docs/BAN-DO.md</code> for 10 minutes and then, without opening code, answers: Which file handles return? Where is the stock decreased on borrow? What happens to loans when a reader is deleted?' : 'Một bạn chưa từng thấy ứng dụng đọc <code>docs/BAN-DO.md</code> trong 10 phút rồi, không mở code, trả lời được: Tệp nào xử lý trả sách? Số sách giảm ở đâu khi mượn? Phiếu mượn ra sao khi xoá độc giả?'}</li>
<li>${en ? 'Every risk has evidence a reviewer can re-run.' : 'Mọi rủi ro đều có bằng chứng mà người review chạy lại được.'}</li>
<li>${en ? 'The page fits on one screen-scroll of about two A4 pages; no copied code longer than 10 lines.' : 'Trang gói gọn khoảng hai trang A4; không chép đoạn code nào dài quá 10 dòng.'}</li>
<li>${en ? 'Only <code>docs/BAN-DO.md</code> (and your README from Chapter 1) changed — no code yet.' : 'Chỉ <code>docs/BAN-DO.md</code> (và README từ Chương 1) thay đổi — chưa đụng code.'}</li>
</ul></div>

<h3>${en ? 'Self-review rubric (10 points)' : 'Rubric tự chấm (10 điểm)'}</h3>
<table>
<thead><tr><th>${en ? 'Criterion' : 'Tiêu chí'}</th><th>${en ? 'Points' : 'Điểm'}</th></tr></thead>
<tbody>
<tr><td>${en ? 'Doors complete and correct (4 servlets, not 5)' : 'Cửa đủ và đúng (4 servlet, không phải 5)'}</td><td>2</td></tr>
<tr><td>${en ? 'Flows: borrow, return, report with file:line' : 'Luồng: mượn, trả, báo cáo kèm tệp:dòng'}</td><td>2</td></tr>
<tr><td>${en ? 'Data: FK rules, trigger, procedure, drift' : 'Dữ liệu: luật khoá ngoại, trigger, procedure, độ lệch'}</td><td>2</td></tr>
<tr><td>${en ? 'Risks ≥ 6 with evidence and history-based labels' : 'Rủi ro ≥ 6 có bằng chứng và nhãn dựa trên lịch sử'}</td><td>3</td></tr>
<tr><td>${en ? '10-minute test passed' : 'Qua phép thử 10 phút'}</td><td>1</td></tr>
</tbody>
</table>

<h3>🗂 ${en ? 'Key terms' : 'Thuật ngữ trong bài'}</h3>
${thuatNgu(en, [
  ['System map', 'bản đồ hệ thống', 'Tài liệu ngắn giúp người mới định hướng trong codebase.', 'A short document that orients a newcomer in a codebase.'],
  ['Evidence', 'bằng chứng', 'Output, số dòng, mã commit — thứ người khác kiểm lại được.', 'Output, line numbers, commit hashes — things others can re-check.'],
  ['Risk register', 'sổ rủi ro', 'Danh sách rủi ro có mức độ, bằng chứng, người phụ trách.', 'A list of risks with severity, evidence and an owner.'],
])}

<h3>📌 ${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'One page: doors, containers, three flows, data, hotspots, risks.' : 'Một trang: cửa, khối chạy, ba luồng, dữ liệu, điểm nóng, rủi ro.'}</li>
<li>${en ? 'Every claim has evidence; every risk has a history-based label.' : 'Mọi khẳng định có bằng chứng; mọi rủi ro có nhãn dựa trên lịch sử.'}</li>
<li>${en ? 'The map is tested by a person, not by you re-reading it.' : 'Bản đồ được kiểm bằng một người khác, không phải bằng việc bạn đọc lại.'}</li>
<li>${en ? 'The risk list is the input of Chapter 3: what to pin with tests first.' : 'Danh sách rủi ro là đầu vào của Chương 3: thứ cần khoá bằng test trước tiên.'}</li>
</ul>
`
);

/* ═══════════════════ 2.7 — Quiz ═══════════════════ */
const QUIZ2 = [
  Q('grep finds four url-pattern entries in web.xml (login, books, readers, export) plus one @WebServlet("/report"). How many URLs does the lab really serve with a servlet?|||grep thấy bốn url-pattern trong web.xml (login, books, readers, export) cộng một @WebServlet("/report"). Lab thật sự phục vụ bao nhiêu URL bằng servlet?', [
    '5 — four in web.xml plus the annotation|||5 — bốn trong web.xml cộng annotation',
    '6 — every servlet class is a URL|||6 — lớp servlet nào cũng là một URL',
    '4 — the /export mapping is inside an XML comment|||4 — mapping /export nằm trong một chú thích XML',
    '3 — annotations are ignored when web.xml exists|||3 — annotation bị bỏ qua khi có web.xml',
  ], 2, 'EN: lines 35–44 of web.xml are an XML comment, so /export is not deployed; the live doors are /login, /books, /readers, /report. Annotations are still scanned because the web.xml (version 3.1) is not metadata-complete. grep cannot see comments — lesson 2.1.|||VI: dòng 35–44 của web.xml là một chú thích XML, nên /export không được triển khai; cửa thật là /login, /books, /readers, /report. Annotation vẫn được quét vì web.xml (bản 3.1) không khai metadata-complete. grep không nhìn thấy chú thích — bài 2.1.'),
  Q('Which single command best reveals that the lab has no real data-access layer?|||Lệnh nào cho thấy rõ nhất rằng lab không có tầng truy cập dữ liệu thật sự?', [
    'grep -rln "DBUtil.getConnection" src|||grep -rln "DBUtil.getConnection" src',
    'git shortlog -sn|||git shortlog -sn',
    'mvn dependency:tree|||mvn dependency:tree',
    'find src -name "*DAO*"|||find src -name "*DAO*"',
  ], 0, 'EN: seven files (six Java classes and a JSP) open their own connections. Finding a BookDAO with find would suggest the opposite — the tempting wrong answer.|||VI: bảy tệp (sáu lớp Java và một JSP) tự mở kết nối. Tìm thấy BookDAO bằng find lại gợi ý điều ngược lại — đáp án sai hấp dẫn.'),
  Q('A file is the largest in the repo and appears in the most commits. What is it, for a maintainer?|||Một tệp to nhất repo và xuất hiện trong nhiều commit nhất. Với người bảo trì, nó là gì?', [
    'Dead code to delete|||Code chết cần xoá',
    'A hotspot: the most likely place for tickets and the first to protect with tests|||Một điểm nóng: nơi dễ có ticket nhất và cần khoá bằng test đầu tiên',
    'The safest file to refactor because it is well known|||Tệp an toàn nhất để refactor vì ai cũng quen',
    'A file the IDE cannot index|||Tệp IDE không lập chỉ mục được',
  ], 1, 'EN: size × churn = risk. BookServlet: 193 lines, 6 commits.|||VI: kích thước × tần suất sửa = rủi ro. BookServlet: 193 dòng, 6 commit.'),
  Q('Reader 2 (student) already has 1 book. You borrow 4 more in a row. What happens in the lab, and why?|||Độc giả 2 (sinh viên) đang mượn 1 cuốn. Bạn mượn liền thêm 4 cuốn. Trên lab chuyện gì xảy ra, vì sao?', [
    'All 4 succeed; there is no limit check|||Cả 4 đều được; không có kiểm giới hạn',
    'Only 2 succeed; the limit is 3|||Chỉ được 2; giới hạn là 3',
    '3 succeed, the 4th is refused, ending with 4 on loan, because the check is dangMuon > max|||Được 3, cuốn thứ 4 bị từ chối, cuối cùng đang mượn 4 cuốn, vì phép kiểm là dangMuon > max',
    'The first fails because the reader is a student|||Cuốn đầu đã hỏng vì độc giả là sinh viên',
  ], 2, 'EN: measured in lesson 2.2: three “Mượn thành công”, then “Vượt quá số sách được mượn”, dang_muon = 4. With max = 3, 3 > 3 is false.|||VI: đo ở bài 2.2: ba lần "Mượn thành công", rồi "Vượt quá số sách được mượn", dang_muon = 4. Với max = 3, 3 > 3 là false.'),
  Q('After a borrow, books.available drops by 1, but the borrow branch of BookServlet never updates books. Where is the update?|||Sau một lần mượn, books.available giảm 1, nhưng nhánh mượn của BookServlet không hề cập nhật books. Lệnh cập nhật nằm ở đâu?', [
    'In BookDAO.findAll|||Trong BookDAO.findAll',
    'In header.jsp|||Trong header.jsp',
    'In the stored procedure sp_overdue_report|||Trong stored procedure sp_overdue_report',
    'In the AFTER INSERT trigger trg_loans_ai on loans|||Trong trigger AFTER INSERT trg_loans_ai trên bảng loans',
  ], 3, 'EN: searching for “available - 1” leads to db/thuvien.sql; information_schema.TRIGGERS lists it. The procedure only reads.|||VI: tìm "available - 1" dẫn tới db/thuvien.sql; information_schema.TRIGGERS liệt kê nó. Procedure chỉ đọc dữ liệu.'),
  Q('Why can Call Hierarchy in IntelliJ not lead you from books.jsp’s form to BookServlet.doPost?|||Vì sao Call Hierarchy của IntelliJ không dẫn được bạn từ form trong books.jsp tới BookServlet.doPost?', [
    'The link is a URL mapped in web.xml, not a Java method call|||Mối nối là một URL được ánh xạ trong web.xml, không phải lời gọi hàm Java',
    'Call Hierarchy only works for interfaces|||Call Hierarchy chỉ chạy với interface',
    'JSP files are not part of the project|||Tệp JSP không thuộc dự án',
    'doPost is private|||doPost là private',
  ], 0, 'EN: the container calls doPost based on the URL; no Java code calls it. Use text search (action=borrow, url-pattern) for such hops.|||VI: container gọi doPost dựa trên URL; không có code Java nào gọi nó. Với những chặng như vậy, hãy tìm chữ (action=borrow, url-pattern).'),
  Q('grep finds 9 one-line SQL statements built with +. Why does the risk list say “at least 11”?|||grep thấy 9 câu SQL một dòng dựng bằng dấu +. Vì sao danh sách rủi ro ghi "ít nhất 11"?', [
    'grep double-counts comments|||grep đếm trùng chú thích',
    'Two more are built across lines or in a variable first, which the pattern misses|||Thêm hai câu được dựng qua nhiều dòng hoặc vào biến trước, mẫu tìm bỏ sót',
    'JSPs always add two|||JSP luôn thêm hai câu',
    'PreparedStatements count as injection too|||PreparedStatement cũng tính là injection',
  ], 1, 'EN: the search query goes through a variable (executeQuery(sql), line 50) and the book INSERT spans lines 172–175. grep gives a lower bound; reading gives the number.|||VI: câu tìm kiếm đi qua một biến (executeQuery(sql), dòng 50) và câu INSERT sách trải dòng 172–175. grep cho cận dưới; đọc mới ra con số.'),
  Q('You delete reader 1 (one active loan of book 1). What happens?|||Bạn xoá độc giả 1 (đang mượn một cuốn sách 1). Chuyện gì xảy ra?', [
    'The delete is refused because of the foreign key|||Lệnh xoá bị từ chối vì khoá ngoại',
    'The loan stays, pointing to a missing reader|||Phiếu mượn còn đó, trỏ tới độc giả không tồn tại',
    'Both of their loans are deleted by CASCADE, and book 1 stays at 3/5 available — a copy is lost|||Cả hai phiếu của họ bị CASCADE xoá, và sách 1 vẫn còn 3/5 — mất một bản sách',
    'The book is returned automatically by the trigger|||Sách được trigger tự trả lại',
  ], 2, 'EN: measured in lesson 2.3. fk_loans_reader is ON DELETE CASCADE; the trigger only fires on INSERT. NO ACTION applies to books, not readers.|||VI: đo ở bài 2.3. fk_loans_reader là ON DELETE CASCADE; trigger chỉ chạy khi INSERT. NO ACTION áp cho books, không phải readers.'),
  Q('A KHACH reader is 23 days late. The overdue report shows 46,000. What will BookServlet charge when the book is returned today?|||Một độc giả KHACH trễ 23 ngày. Báo cáo quá hạn ghi 46.000. Hôm nay trả sách thì BookServlet thu bao nhiêu?', [
    '46,000|||46.000',
    '50,000 (the cap)|||50.000 (mức trần)',
    '23,000|||23.000',
    '115,000|||115.000',
  ], 3, 'EN: the procedure uses 2,000/day for everyone; Java uses 5,000/day for KHACH and caps only SV. Two implementations of one rule disagree — lesson 2.3.|||VI: procedure dùng 2.000/ngày cho mọi người; Java dùng 5.000/ngày cho KHACH và chỉ có trần với SV. Hai bản cài đặt của một luật nói khác nhau — bài 2.3.'),
  Q('The 50,000 fine cap applies only to students. Bug or decision?|||Trần phí 50.000 chỉ áp cho sinh viên. Bug hay quyết định?', [
    'Bug — rules must be the same for everyone|||Bug — luật phải như nhau cho mọi người',
    'Decision — commit c4b91f7 (TV-52) says “only SV, per the student affairs office”|||Quyết định — commit c4b91f7 (TV-52) ghi "chỉ áp dụng SV theo ý kiến phòng CTSV"',
    'Unknown — history cannot tell|||Chưa rõ — lịch sử không cho biết',
    'Bug — git blame shows it was added by a different author|||Bug — git blame cho thấy người khác thêm vào',
  ], 1, 'EN: git log -S "50000" finds exactly that commit. Compare with the off-by-one, which contradicts its own commit message (TV-41) and is therefore a bug.|||VI: git log -S "50000" tìm đúng commit đó. So với lỗi lệch một, vốn trái với chính lời nhắn commit của nó (TV-41) nên là bug.'),
  Q('Commit 4780c81 says only “refactor”. What did it actually change for users?|||Commit 4780c81 chỉ ghi "refactor". Thực ra nó đổi gì với người dùng?', [
    'Nothing — it only added an import|||Không gì — nó chỉ thêm một import',
    'It fixed SQL injection in search|||Nó sửa SQL injection ở ô tìm kiếm',
    'A blank or whitespace-only search now lists all books via BookDAO instead of running LIKE on the spaces|||Tìm kiếm trống hoặc chỉ toàn dấu cách giờ liệt kê mọi sách qua BookDAO thay vì chạy LIKE trên các dấu cách',
    'It removed the borrow feature|||Nó gỡ chức năng mượn',
  ], 2, 'EN: read the diff (lesson 2.4): if (q == null) q = "" became if (StringUtils.isNotBlank(q)) … else findAll(). The concatenated search SQL is untouched.|||VI: đọc diff (bài 2.4): if (q == null) q = "" thành if (StringUtils.isNotBlank(q)) … else findAll(). Câu SQL tìm kiếm nối chuỗi vẫn y nguyên.'),
  Q('For a maintenance map, which combination is the most useful and the most likely to stay true?|||Với bản đồ bảo trì, kết hợp nào hữu ích nhất và dễ giữ đúng nhất?', [
    'C4 context + container + a sequence diagram per key flow, in Mermaid inside the repo|||C4 context + container + một sơ đồ tuần tự cho mỗi luồng chính, bằng Mermaid trong repo',
    'A full class diagram of every class, exported as a PNG to the shared drive|||Sơ đồ lớp đầy đủ của mọi lớp, xuất PNG lên ổ chia sẻ',
    'The ideal Controller → Service → DAO architecture the app should have|||Kiến trúc lý tưởng Controller → Service → DAO mà ứng dụng nên có',
    'No diagram; the code is the documentation|||Không cần sơ đồ; code chính là tài liệu',
  ], 0, 'EN: the first two C4 levels answer what talks to what; text diagrams in the repo are reviewed and updated in the same PR. Drawing the ideal architecture is the trap from lesson 2.5.|||VI: hai mức C4 đầu trả lời cái gì nói chuyện với cái gì; sơ đồ dạng chữ trong repo được review và sửa trong cùng PR. Vẽ kiến trúc lý tưởng là cái bẫy ở bài 2.5.'),
];

const QUIZ_CONTENT = ml((en) => `
<span class="eyebrow">${en ? 'Chapter 2 · Quiz' : 'Chương 2 · Kiểm tra'}</span>
<h2>${en ? 'Check what stuck' : 'Xem thử đọng lại được gì'}</h2>
<p class="lead">${en ? 'Twelve questions on the lab you mapped. Each answer can be checked by re-running a command from the chapter.' : 'Mười hai câu về chính ứng dụng lab bạn đã vẽ bản đồ. Đáp án nào cũng kiểm lại được bằng cách chạy lại một lệnh trong chương.'}</p>
<h3>${en ? 'Self-check before you start' : 'Tự kiểm trước khi làm'}</h3>
<ul>
<li>${en ? 'I can list the lab’s doors and explain why /export is not one.' : 'Tôi liệt kê được các cửa của lab và giải thích vì sao /export không phải cửa.'}</li>
<li>${en ? 'I can trace borrow and return to the database, including the trigger.' : 'Tôi lần được luồng mượn và trả tới CSDL, kể cả trigger.'}</li>
<li>${en ? 'I can query information_schema for keys, triggers and routines.' : 'Tôi truy vấn được information_schema để xem khoá, trigger, routine.'}</li>
<li>${en ? 'I can tell a bug from a decision using log -S and blame.' : 'Tôi phân biệt được bug với quyết định bằng log -S và blame.'}</li>
<li>${en ? 'I have a one-page map in docs/BAN-DO.md.' : 'Tôi đã có bản đồ một trang trong docs/BAN-DO.md.'}</li>
</ul>
`
);

export default {
  title: 'Chapter 2 — Mapping an unfamiliar codebase|||Chương 2 — Vẽ bản đồ một codebase lạ',
  description: 'Không đọc từng dòng — đọc có chủ đích.',
  lessons: [
    { title: '2.1 — The shape of the repo: folders, layers, entry points|||2.1 — Hình dáng repo: thư mục, tầng, điểm vào', slug: 'lgc-2-1-ban-do-thu-muc', type: 'LESSON', isFreePreview: true, description: 'Bốn phép đo rẻ: kích thước, cửa vào (web.xml + @WebServlet, chú thích XML), ai mở kết nối CSDL, tần suất sửa — bản đồ sơ bộ 15 phút.', content: L21 },
    { title: '2.2 — Tracing one request with Find Usages and Call Hierarchy|||2.2 — Lần một request bằng Find Usages và Call Hierarchy', slug: 'lgc-2-2-lan-request', type: 'LESSON', isFreePreview: true, description: 'Lần "mượn sách" từ nút bấm tới trigger, tìm và tái hiện lỗi lệch một, giới hạn của IDE, nguồn → đích của dữ liệu người dùng, sơ đồ tuần tự Mermaid.', content: L22 },
    { title: '2.3 — Reading the database: schema, foreign keys, stored procedures and triggers|||2.3 — Đọc cơ sở dữ liệu: schema, khoá ngoại, stored procedure và trigger', slug: 'lgc-2-3-schema-sp', type: 'LESSON', isFreePreview: true, description: 'information_schema, CASCADE xoá lịch sử và làm mất một bản sách, logic chia đôi trigger/Java, procedure tính phí khác Java, câu kiểm dữ liệu lệch.', content: L23 },
    { title: '2.4 — Reading history for the "why": git log, blame, old tickets|||2.4 — Đọc lịch sử để hiểu "vì sao": git log, blame, ticket cũ', slug: 'lgc-2-4-lich-su', type: 'LESSON', isFreePreview: true, description: 'log -S và blame trên 13 commit: bug hay quyết định (TV-41 vs TV-52), commit "refactor" đổi hành vi, hỏi đúng người kèm bằng chứng.', content: L24 },
    { title: '2.5 — Drawing what you learned: C4 context/container and a sequence diagram|||2.5 — Vẽ lại điều đã hiểu: C4 context/container và sơ đồ tuần tự', slug: 'lgc-2-5-so-do', type: 'LESSON', isFreePreview: true, description: 'C4 mức bối cảnh và khối chạy cho ứng dụng lab, sơ đồ tuần tự, Mermaid trong repo, vẽ đúng hiện trạng chứ không vẽ kiến trúc mơ ước.', content: L25 },
    { title: '2.6 — Lab: A one-page map of the legacy library app|||2.6 — Lab: Bản đồ một trang của ứng dụng thư viện cũ', slug: 'lgc-2-6-lab', type: 'LESSON', isFreePreview: true, description: 'Ticket LIB-102: docs/BAN-DO.md gồm cửa, khối chạy, ba luồng, dữ liệu, điểm nóng, ≥ 6 rủi ro có bằng chứng — phép thử 10 phút, rubric 10 điểm.', content: L26 },
    { title: '2.7 — Chapter 2 quiz|||2.7 — Kiểm tra Chương 2', slug: 'lgc-2-7-quiz', type: 'QUIZ', isFreePreview: true, description: 'Mười hai câu tình huống về cửa vào, điểm nóng, lỗi lệch một, trigger, CASCADE, phí lệch, bug hay quyết định và sơ đồ.', content: QUIZ_CONTENT, quiz: { timeLimitSeconds: 900, questions: QUIZ2 } },
  ],
};
