/**
 * Đọc code cũ và refactor — Chương 5: Refactor bằng IDE — danh mục Fowler theo từng bước nhỏ (soạn 24/11/2026, agent rfc trên máy nhà Linux).
 * 5.1 bước cơ bản (Slide Statements trước Extract Function vì sao, Rename bằng công cụ vs Find/Replace — 5 test đỏ "Unknown column 'r.loai'",
 *     TypeScript Language Service = bộ máy refactor của VS Code chạy không giao diện: liệt kê/tách/đổi tên, từ chối "conditional return",
 *     quick fix không bỏ được tham số giữa) · 5.2 điều kiện (test cookie trước, guard clause, gom 3 switch ⇒ enum LoaiDocGia, bảng luật Node
 *     + bẫy khoá prototype — CVE-2019-10744) · 5.3 di chuyển (Extract Class PhieuMuonDAO/MuonTraService, Introduce Parameter Object, Move
 *     Function hết Feature Envy, SQL khỏi header.jsp có golden master qua HTTP, kho.ghi) · 5.4 dữ liệu (Tien thay double — 4 test đỏ vì cách in,
 *     Vancouver 1982, Patriot 1991; SoPhieu đóng gói tập hợp) · 5.5 nhịp (commit trộn ⇒ 2 test _BUG đỏ, TV-41 PR riêng, TV-95 sau khi dọn đường:
 *     9 chỗ/6 tệp ⇒ 4 tệp, test tái hiện race để dành Ch8, TCR) · 5.6 lab (18 + 11 commit xanh, PMD 12 ⇒ 8, ESLint 36 ⇒ 16) · 5.7 quiz 12 câu.
 * Repo lab: legacy-thu-vien nhánh ch5 (+ ch5-tv41, ch5-ncs), legacy-express nhánh ch5 (+ ch5-ncs). Lời giải: lab/loi-giai/ch5/ (git format-patch).
 * KHÔNG dạy lại: phím tắt IntelliJ (ide-va-do-nghe-dev 2.3), SOLID/Strategy (Academy SWD392), TDD (testing 10.1), rebase tương tác (git 3.5).
 */
import { java, bash, js, out, giai, ml, lk, bai, thuatNgu, Q, MOI_TRUONG_3 } from './_chung.mjs';

const moiTruong = (en) => `<p><em>${en ? 'Outputs run for real on:' : 'Output chạy thật trên:'} ${MOI_TRUONG_3} · PMD 7.7.0 · ESLint 8.57.1 · TypeScript 5.9.3 (Language Service, Node 22).</em></p>`;
const academy = (mon, slug) => `/academy/courses/${mon}/learn?lessonSlug=${slug}`;

/* ═══════════════════ 5.1 — Bước cơ bản ═══════════════════ */
const O51_LUOI = out(`
$ git log --oneline -1
143d106 seam: bayGio() + characterization tra sach        # đưa seam + 5 test trả sách của Ch3 vào nhánh chính
$ mvn -B -o test
[INFO] Tests run: 13, Failures: 0, Errors: 0, Skipped: 0 -- in com.thuvien.servlet.BookServletMuonSachTest
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0 -- in com.thuvien.servlet.ExportServletDacTaTest
[INFO] Tests run: 5, Failures: 0, Errors: 0, Skipped: 0 -- in com.thuvien.servlet.BookServletTraSachTest
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0 -- in com.thuvien.util.TokenUtilDacTaTest
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0 -- in com.thuvien.util.TokenUtilTest
[INFO] Tests run: 21, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
[INFO] Total time:  3.296 s
`);
const C51_VOI = java(`
// Chương 4, bài 4.1 — bôi đen nhánh "borrow" rồi Extract Method ngay: IDE đúng về kỹ thuật, nhưng
// st/rs/ps được khai báo ở đầu doPost và đóng ở finally ⇒ nó buộc phải truyền chúng vào
private void muonSach(Connection con, Statement st, ResultSet rs, PreparedStatement ps,
                      String readerId, String bookId, HttpServletResponse response) throws Exception {
`);
const O51_SLIDE = out(`
$ git show d4a57a0 -- src/main      # (trích) refactor(5.1): Slide Statements — st/ps/rs về từng nhánh
         Connection con = null;
-        Statement st = null;
-        PreparedStatement ps = null;
-        ResultSet rs = null;
         try {
             con = DBUtil.getConnection();
             if (action.equals("borrow")) {
+              Statement st = null;
+              PreparedStatement ps = null;
+              ResultSet rs = null;
+              try {
                 String readerId = request.getParameter("readerId");
 ...
                 response.sendRedirect("books?msg=" + URLEncoder.encode("Mượn thành công", "UTF-8"));
+              } finally {
+                DBUtil.close(rs, st, ps);
+              }
             } else if (action.equals("return")) {
 ...
-            DBUtil.close(rs, st, ps, con);
+            DBUtil.close(con);
$ mvn -B -o test
[INFO] Tests run: 21, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
`);
const C51_DOPOST = java(`
// Sau commit 2fddcbf — refactor(5.1): Extract Function × 4. Thân bốn hàm GIỮ NGUYÊN từng dòng, chỉ dời chỗ.
protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    if (request.getSession().getAttribute("user") == null) {
        response.sendRedirect("login");
        return;
    }
    request.setCharacterEncoding("UTF-8");
    String action = request.getParameter("action");
    Connection con = null;
    try {
        con = DBUtil.getConnection();
        if (action.equals("borrow")) {
            muonSach(request, response, con);
        } else if (action.equals("return")) {
            traSach(request, response, con);
        } else if (action.equals("add")) {
            themSach(request, response, con);
        } else if (action.equals("delete")) {
            xoaSach(request, response, con);
        } else {
            PrintWriter out = response.getWriter();
            out.println("<html><body><h3>Action khong hop le: " + action + "</h3></body></html>");
        }
    } catch (Exception e) {
        e.printStackTrace();
        PrintWriter out = response.getWriter();
        out.println("<html><body><h3>Loi: " + e.getMessage() + "</h3></body></html>");
    } finally {
        DBUtil.close(con);
    }
}

private void muonSach(HttpServletRequest request, HttpServletResponse response, Connection con) throws Exception {
    Statement st = null;
    PreparedStatement ps = null;
    ResultSet rs = null;
    try {
        String readerId = request.getParameter("readerId");
        // … y nguyên 40 dòng cũ …
`);
const O51_DO = out(`
$ mvn -B -o -q pmd:pmd -Dpmd.boLuat=tools/do-phuc-tap.xml && python3 tools/phuc-tap.py target/pmd.xml BookServlet
hàm                                        cyclomatic cognitive
BookServlet.traSach                                 7        10
BookServlet.muonSach                                8         9
BookServlet.doGet                                   5         7
BookServlet.doPost                                  7         7       # Chương 4: doPost = 20 / 36
BookServlet.themSach                                1         -
BookServlet.xoaSach                                 1         -
BookServlet.bayGio                                  1         -
`);
const O51_TIM_THAY = out(`
$ sed -i '/} else if (action.equals("return")) {/,/} else if (action.equals("add"))/ s/\\btype\\b/loai/g' BookServlet.java   # = Find/Replace trong vùng chọn, khớp cả từ
$ git diff | grep '^[-+] '
-                rs = st.executeQuery("SELECT l.*, r.type FROM loans l JOIN readers r ON r.id = l.reader_id WHERE l.id = " + loanId);
+                rs = st.executeQuery("SELECT l.*, r.loai FROM loans l JOIN readers r ON r.id = l.reader_id WHERE l.id = " + loanId);
-                String type = rs.getString("type");
+                String loai = rs.getString("loai");
-                    if (type.equals("SV")) {
+                    if (loai.equals("SV")) {
-                    } else if (type.equals("GV")) {
+                    } else if (loai.equals("GV")) {
$ mvn -B -o test
[ERROR] Tests run: 5, Failures: 0, Errors: 5, Skipped: 0 <<< FAILURE! -- in com.thuvien.servlet.BookServletTraSachTest
[ERROR]   BookServletTraSachTest.chuaToiHan:70->tra:47 » NullPointer
[ERROR]   BookServletTraSachTest.giangVienTre13Ngay1Gio:59->tra:47 » NullPointer
[ERROR]   BookServletTraSachTest.khachTre26Ngay1Gio:65->tra:47 » NullPointer
[ERROR] Tests run: 21, Failures: 0, Errors: 5, Skipped: 0
$ mvn -B -o test > test.log 2>&1; grep "Unknown column 'r" test.log | sort -u      # nguyên nhân thật nằm trong log
com.mysql.jdbc.exceptions.jdbc4.MySQLSyntaxErrorException: Unknown column 'r.loai' in 'field list'
`);
const C51_DOI_TEN = out(`
$ git show 0a1ce92 | grep '^[-+] ' | head -14      # refactor(5.1): Rename Variable — làm bằng công cụ: chuỗi SQL không bị đụng
-            String type = rs.getString("type");
+            String loai = rs.getString("type");
-            int max;
-            if (type.equals("SV")) {
-                max = 3;
+            int toiDa;
+            if (loai.equals("SV")) {
+                toiDa = 3;
-            long diff = bayGio() - due.getTime();
-            int days = (int) (diff / (1000 * 60 * 60 * 24));
-            double fine = 0;
+            long treMs = bayGio() - hanTra.getTime();
+            int soNgayTre = (int) (treMs / (1000 * 60 * 60 * 24));
+            double phi = 0;
`);
const C51_SPLIT = java(`
// commit 5095466 — Replace Magic Literal + Split Variable
private static final long MS_MOT_NGAY = 24L * 60 * 60 * 1000;
...
ResultSet rsDocGia = null;   // trước: một biến rs dùng lại cho ba câu truy vấn khác nhau
ResultSet rsDem = null;
ResultSet rsSach = null;
...
int soNgayTre = (int) (treMs / MS_MOT_NGAY);
`);
const B51_TS = bash(`
# tools/ts-sua.mjs (lời giải Ch5) — gọi TypeScript Language Service, đúng bộ máy chạy sau F2 / Ctrl+. của VS Code
node ts-sua.mjs routes/muon.js liet-ke 31 34               # VS Code sẽ gợi ý gì cho vùng chọn dòng 31–34
node ts-sua.mjs routes/muon.js tach 31 34 demDangMuon function_scope_3
node ts-sua.mjs routes/muon.js doi-ten 27 dg docGia        # F2 trên biến dg ở dòng 27
`);
const O51_TS_LIETKE = out(`
$ node ts-sua.mjs routes/muon.js liet-ke 31 34
Extract Symbol › function_scope_0: Extract to inner function in anonymous function
Extract Symbol › function_scope_3: Extract to function in global scope
$ node ts-sua.mjs routes/muon.js tach 31 34 demDangMuon function_scope_3
Extract Symbol (function_scope_3) → "newFunction" → đổi tên "demDangMuon" ở 2 chỗ
$ git diff | grep '^[-+]'
-      var dangMuon = 0;
-      for (var i = 0; i < dsPhieu.length; i++) {
-        if (dsPhieu[i].docGia == dg.id && !dsPhieu[i].ngayTra) dangMuon++;
-      }
+      var dangMuon = demDangMuon(dsPhieu, dg);
+
+function demDangMuon(dsPhieu, dg) {
+  var dangMuon = 0;
+  for (var i = 0; i < dsPhieu.length; i++) {
+    if (dsPhieu[i].docGia == dg.id && !dsPhieu[i].ngayTra) dangMuon++;
+  }
+  return dangMuon;
+}
$ npm test
Tests:       16 passed, 16 total
$ node ts-sua.mjs routes/muon.js doi-ten 27 dg docGia
Rename Symbol "dg" → "docGia": 9 chỗ
`);
const O51_TU_CHOI = out(`
$ node ts-sua.mjs routes/muon.js liet-ke 45 53 | grep "Extract Symbol"     # vòng lặp "đang có sách quá hạn"
Extract Symbol › Extract Function: Extract function  (không dùng được: Cannot extract range containing conditional return statement.)
Extract Symbol › Extract Constant: Extract constant  (không dùng được: Cannot extract range containing conditional return statement.)
`);
const J51_TACH_TRUY_VAN = js(`
// TRƯỚC — tìm kiếm và "trả lời HTTP" quấn vào nhau: return nằm sâu ba tầng trong vòng lặp
for (var j = 0; j < dsPhieu.length; j++) {
  if (dsPhieu[j].docGia == docGia.id && !dsPhieu[j].ngayTra) {
    if (moment().diff(moment(dsPhieu[j].hanTra), 'days', true) > 0) {
      if (docGia.loai != 'GV') {
        return res.status(409).json({ loi: 'dang co sach qua han', phieu: dsPhieu[j].id });
      }
    }
  }
}

// SAU (commit 39c4f8a, sửa tay) — vòng lặp chỉ TÌM; quyết định trả lời đứng riêng bên dưới
var quaHan = null;
for (var j = 0; j < dsPhieu.length; j++) {
  if (dsPhieu[j].docGia == docGia.id && !dsPhieu[j].ngayTra && moment().diff(moment(dsPhieu[j].hanTra), 'days', true) > 0) {
    quaHan = dsPhieu[j];
    break;
  }
}
if (quaHan && docGia.loai != 'GV') {
  return res.status(409).json({ loi: 'dang co sach qua han', phieu: quaHan.id });
}
// ⇒ commit a4831f7: công cụ tách 7 dòng đầu thành timPhieuQuaHan(dsPhieu, docGia) — lần này nó đồng ý
`);
const O51_QUICKFIX = out(`
$ node ts-sua.mjs routes/muon.js bo-tham-so 11 loai      # Ctrl+. trên tham số mờ 'loai' của taoPhieu
quick fix: unusedIdentifier — Prefix 'loai' with an underscore
quick fix: disableJsDiagnostics — Ignore this error message
quick fix: disableJsDiagnostics — Disable checking for this file
`);

const L51 = ml((en) => `
<span class="eyebrow">${en ? 'Chapter 5 · Refactoring with the IDE, in small steps' : 'Chương 5 · Refactor bằng IDE, từng bước nhỏ'}</span>
<h2>${en ? '5.1 — The basic moves: Rename, Extract Variable/Function, Inline, Change Signature' : '5.1 — Bước cơ bản: đổi tên, tách biến/hàm, gộp lại, đổi chữ ký hàm'}</h2>
<p class="lead">${en
  ? 'Rearranging a wardrobe: you buy nothing, throw nothing away, every shirt is still there — but next morning you find the white one in five seconds instead of five minutes. Refactoring is that, for code: the program does exactly what it did before, and the next person (often you) finds and changes things faster. Chapter 4 named the smells. This chapter applies the cure, one tiny move at a time, with the Chapter 3 tests run after every move.'
  : 'Xếp lại tủ quần áo: không mua thêm, không vứt đi, cái áo nào cũng còn đó — nhưng sáng hôm sau bạn tìm cái áo trắng mất năm giây thay vì năm phút. Refactor là như vậy với code: chương trình làm đúng y những gì nó làm trước đây, còn người kế tiếp (thường là chính bạn) tìm và sửa nhanh hơn. Chương 4 đã gọi tên các mùi. Chương này chữa, mỗi lần một bước rất nhỏ, chạy lại test của Chương 3 sau mỗi bước.'}</p>
${moiTruong(en)}

<h3>${en ? 'What refactoring is — and where the word comes from' : 'Refactor là gì — và chữ này từ đâu ra'}</h3>
<p>${en
  ? 'William Opdyke’s PhD thesis at the University of Illinois (1992), supervised by Ralph Johnson, was the first systematic catalogue of behaviour-preserving transformations for object-oriented code. At the same university, John Brant and Don Roberts built the Smalltalk <em>Refactoring Browser</em> (1997) — the first tool that performed them automatically. Martin Fowler’s <em>Refactoring</em> (1999; 2nd edition 2018 with JavaScript examples) turned the idea into a shared vocabulary; its online catalogue at refactoring.com lists more than 60 named refactorings. Fowler’s definition has two halves and both matter:'
  : 'Luận án tiến sĩ của William Opdyke ở Đại học Illinois (1992), do Ralph Johnson hướng dẫn, là danh mục có hệ thống đầu tiên về các phép biến đổi giữ nguyên hành vi cho code hướng đối tượng. Cũng ở trường đó, John Brant và Don Roberts viết <em>Refactoring Browser</em> cho Smalltalk (1997) — công cụ đầu tiên tự động làm các phép đó. Cuốn <em>Refactoring</em> của Martin Fowler (1999; bản 2 năm 2018 dùng ví dụ JavaScript) biến ý tưởng thành từ vựng chung; danh mục trực tuyến ở refactoring.com có hơn 60 phép refactor có tên. Định nghĩa của Fowler có hai nửa, nửa nào cũng quan trọng:'}</p>
<ul>
<li>${en ? '<strong>Refactoring (noun):</strong> a change made to the internal structure of software to make it easier to understand and cheaper to modify <em>without changing its observable behaviour</em>.' : '<strong>Refactoring (danh từ):</strong> một thay đổi ở cấu trúc bên trong phần mềm để nó dễ hiểu hơn và rẻ hơn khi sửa, <em>mà không đổi hành vi quan sát được</em>.'}</li>
<li>${en ? '<strong>Refactor (verb):</strong> to restructure software by applying a <em>series</em> of refactorings. Many small steps, each one safe — not one big jump.' : '<strong>Refactor (động từ):</strong> tái cấu trúc phần mềm bằng một <em>chuỗi</em> phép refactor. Nhiều bước nhỏ, bước nào cũng an toàn — không phải một cú nhảy lớn.'}</li>
</ul>
<p>${en
  ? 'So three things people call “refactoring” are not: <strong>rewriting</strong> (new code replaces old, behaviour re-implemented and usually changed), <strong>reformatting</strong> (whitespace only — useful, but it changes nothing a reader struggles with), and <strong>“refactor + fix while I am here”</strong> (lesson 5.5: that is two changes wearing one name). “Observable behaviour” in the lab means what the Chapter 3 net observes: redirect messages, rows in MySQL, HTML of three pages, the CSV, JSON of the API — and also error messages, because the lab locked “Unknown column ‘abc’” on purpose.'
  : 'Vậy ba thứ người ta hay gọi là "refactor" thật ra không phải: <strong>viết lại</strong> (code mới thay code cũ, hành vi được cài lại và thường bị đổi), <strong>định dạng lại</strong> (chỉ khoảng trắng — có ích, nhưng không đụng tới chỗ người đọc thấy khó), và <strong>"refactor + tiện tay sửa luôn"</strong> (bài 5.5: đó là hai thay đổi mang chung một tên). "Hành vi quan sát được" trong lab là những gì tấm lưới Chương 3 quan sát: thông báo redirect, dòng trong MySQL, HTML của ba trang, tệp CSV, JSON của API — và cả thông báo lỗi, vì lab đã cố ý khoá câu "Unknown column ‘abc’".'}</p>

<h3>${en ? 'Your tools: the same moves in IntelliJ and VS Code' : 'Đồ nghề: cùng một bước trong IntelliJ và VS Code'}</h3>
<table>
<tr><th>${en ? 'Refactoring (Fowler name)' : 'Refactoring (tên Fowler)'}</th><th>IntelliJ IDEA (Windows/Linux)</th><th>VS Code (JS/TS)</th><th>${en ? 'Smell it treats' : 'Chữa smell nào'}</th></tr>
<tr><td>Rename Variable / Function</td><td>Shift+F6</td><td>F2</td><td>Mysterious Name</td></tr>
<tr><td>Extract Variable</td><td>Ctrl+Alt+V</td><td>${en ? 'select ⇒ Ctrl+. ⇒ Extract to constant' : 'bôi đen ⇒ Ctrl+. ⇒ Extract to constant'}</td><td>${en ? 'long expression, comments' : 'biểu thức dài, comment'}</td></tr>
<tr><td>Extract Function</td><td>Ctrl+Alt+M</td><td>${en ? 'select ⇒ Ctrl+. ⇒ Extract to function' : 'bôi đen ⇒ Ctrl+. ⇒ Extract to function'}</td><td>Long Function</td></tr>
<tr><td>Inline Variable / Function</td><td>Ctrl+Alt+N</td><td>${en ? 'Ctrl+. ⇒ Inline variable (recent TypeScript)' : 'Ctrl+. ⇒ Inline variable (TypeScript bản mới)'}</td><td>${en ? 'needless indirection' : 'gián tiếp thừa'}</td></tr>
<tr><td>Change Function Declaration</td><td>Ctrl+F6</td><td>${en ? 'no direct equivalent (lesson below)' : 'không có tương đương trực tiếp (xem dưới)'}</td><td>Long Parameter List</td></tr>
<tr><td>Introduce Constant (Replace Magic Literal)</td><td>Ctrl+Alt+C</td><td>${en ? 'Extract to constant' : 'Extract to constant'}</td><td>${en ? 'magic numbers' : 'số ma thuật'}</td></tr>
<tr><td>Move (Function/Class)</td><td>F6</td><td>${en ? 'Move to a new file / Move to file' : 'Move to a new file / Move to file'}</td><td>Feature Envy</td></tr>
</table>
<p>${en
  ? 'Shortcuts and screenshots of the dialogs are in the IDE course — this chapter does not repeat them. The machine that ran this chapter has no GUI, so there are no IntelliJ screenshots here; instead, the JavaScript half is driven through the <em>TypeScript Language Service</em> directly — the exact engine VS Code calls when you press F2 or Ctrl+. on a <code>.js</code> file — so every edit you see below was made by the tool, not typed by hand.'
  : 'Phím tắt và ảnh chụp hộp thoại có ở khoá IDE — chương này không nhắc lại. Máy chạy chương này không có giao diện đồ hoạ nên không có ảnh IntelliJ; thay vào đó, nửa JavaScript được làm bằng cách gọi thẳng <em>TypeScript Language Service</em> — đúng bộ máy VS Code gọi khi bạn bấm F2 hay Ctrl+. trên tệp <code>.js</code> — nên mọi chỗ sửa bạn thấy bên dưới là do công cụ làm, không phải gõ tay.'}</p>
${lk(bai('ide-va-do-nghe-dev', 'ide-2-3-refactor-sinh-code'), '🧰', en ? 'IDE course 2.3 — Automatic refactoring, code generation and live templates' : 'Khoá IDE 2.3 — Refactor tự động, sinh code và live template', en ? 'Shortcuts, dialogs, previews' : 'Phím tắt, hộp thoại, xem trước')}

<h3>${en ? 'Step 0: check the net before you start' : 'Bước 0: kiểm tấm lưới trước khi bắt đầu'}</h3>
<p>${en
  ? 'The Chapter 3 net covered <em>borrow</em> on the main branch; the five <em>return</em> tests lived on a side branch because they need the <code>bayGio()</code> seam. Since this chapter will touch the return code, the first commit brings that seam and those tests over. 21 tests, 3.3 seconds — fast enough to run after every single step.'
  : 'Tấm lưới Chương 3 phủ phần <em>mượn</em> trên nhánh chính; năm test <em>trả sách</em> nằm ở nhánh phụ vì chúng cần seam <code>bayGio()</code>. Chương này sẽ đụng tới code trả sách, nên commit đầu tiên mang seam và năm test đó sang. 21 test, 3,3 giây — đủ nhanh để chạy sau từng bước một.'}</p>
${O51_LUOI}
<div class="callout"><p>${en
  ? '<strong>Rule of the chapter:</strong> no net, no refactoring. When a later lesson touches code with no test (the login cookie in 5.2, the Node borrow route here), the first commit is a characterization test, not a refactoring.'
  : '<strong>Luật của cả chương:</strong> chưa có lưới thì chưa refactor. Khi bài sau đụng tới code chưa có test (cookie đăng nhập ở 5.2, route mượn của Node ngay bài này), commit đầu tiên là characterization test, không phải refactor.'}</p></div>

<h3>${en ? 'Extract Function — but Slide Statements first' : 'Extract Function — nhưng Slide Statements trước đã'}</h3>
<p>${en
  ? 'Lesson 4.1 showed what happens if you select the “borrow” branch and press Ctrl+Alt+M straight away:'
  : 'Bài 4.1 đã cho thấy chuyện gì xảy ra nếu bôi đen nhánh "borrow" rồi bấm Ctrl+Alt+M ngay:'}</p>
${C51_VOI}
<p>${en
  ? 'The IDE is not wrong: <code>st</code>, <code>rs</code>, <code>ps</code> are declared at the top of <code>doPost</code> and closed in its <code>finally</code>, so for the tool they are both inputs and outputs. The fix is a refactoring <em>before</em> the refactoring — Fowler calls it <strong>Slide Statements</strong>: move each declaration to where it is used. Each branch gets its own variables and its own <code>finally</code>; the outer <code>finally</code> closes only the connection. The code looks worse for one commit (odd indentation, more lines). That is normal: scaffolding.'
  : 'IDE không sai: <code>st</code>, <code>rs</code>, <code>ps</code> được khai báo ở đầu <code>doPost</code> và đóng trong <code>finally</code> của nó, nên với công cụ chúng vừa là đầu vào vừa là đầu ra. Cách chữa là một phép refactor <em>trước</em> phép refactor — Fowler gọi là <strong>Slide Statements</strong> (trượt câu lệnh): dời mỗi khai báo về chỗ nó được dùng. Mỗi nhánh có biến riêng và <code>finally</code> riêng; <code>finally</code> ngoài chỉ còn đóng kết nối. Trong đúng một commit, code trông tệ hơn (thụt lề lạ, nhiều dòng hơn). Bình thường thôi: đó là giàn giáo.'}</p>
${O51_SLIDE}
<p>${en
  ? 'Now each branch is self-contained, and extraction needs only what the branch really reads: <code>request</code>, <code>response</code>, <code>con</code>. Four extractions, one commit (the four are the same move on parallel branches), bodies moved line for line:'
  : 'Giờ mỗi nhánh tự đủ, và việc tách chỉ cần đúng những gì nhánh thật sự đọc: <code>request</code>, <code>response</code>, <code>con</code>. Bốn lần tách, một commit (cả bốn là cùng một bước trên bốn nhánh song song), thân hàm dời đi nguyên từng dòng:'}</p>
${C51_DOPOST}
${O51_DO}
<p>${en
  ? 'Nothing got smarter yet — every line is the same — but the complexity is now <em>distributed</em>: no single method above 10, versus 36 before. That is the whole point of Extract Function: you can now read <code>doPost</code> in ten seconds and choose which of the four rooms to enter.'
  : 'Chưa có gì thông minh hơn — từng dòng vẫn y như cũ — nhưng độ phức tạp đã được <em>chia ra</em>: không hàm nào trên 10, so với 36 trước đó. Đó chính là mục đích của Extract Function: giờ đọc <code>doPost</code> mất mười giây, và bạn chọn được vào phòng nào trong bốn phòng.'}</p>

<h3>${en ? 'Rename — why the tool beats Find/Replace' : 'Rename — vì sao công cụ thắng Find/Replace'}</h3>
<p>${en
  ? 'The return branch calls the reader type <code>type</code>. You want <code>loai</code>. Watch what a careful-looking “Find/Replace in selection, whole words” does:'
  : 'Nhánh trả sách gọi loại độc giả là <code>type</code>. Bạn muốn đặt là <code>loai</code>. Xem "Find/Replace trong vùng chọn, khớp cả từ" — trông rất cẩn thận — làm gì:'}</p>
${O51_TIM_THAY}
<p>${en
  ? 'Two lessons in one output. (1) Text replacement does not know the difference between a Java variable and the SQL column <code>r.type</code> inside a string. A Rename refactoring works on the <em>symbol</em> — it renames the variable and every reference to it, and never touches strings or comments unless you ask. (2) The test report says <code>NullPointer</code>, not “Unknown column”: the error page calls <code>response.getWriter()</code>, which the return tests did not stub. The real cause is one line in the captured output. When a refactoring turns tests red, read the log before reading the code — and in this case, simply revert: a refactoring step that fails is undone, not debugged.'
  : 'Hai bài học trong một output. (1) Thay chữ không phân biệt biến Java với cột SQL <code>r.type</code> nằm trong chuỗi. Phép Rename làm việc trên <em>ký hiệu</em> (symbol) — nó đổi tên biến và mọi chỗ tham chiếu tới biến đó, không đụng tới chuỗi hay comment trừ khi bạn yêu cầu. (2) Báo cáo test nói <code>NullPointer</code>, không phải "Unknown column": trang lỗi gọi <code>response.getWriter()</code>, thứ mà test trả sách chưa giả lập. Nguyên nhân thật là một dòng trong output đã lưu. Khi một bước refactor làm test đỏ, đọc log trước khi đọc code — và trong trường hợp này, cứ hoàn tác: bước refactor hỏng thì bỏ, không ngồi gỡ.'}</p>
${C51_DOI_TEN}
<p>${en
  ? '<code>getString("type")</code> stayed — it is the column name. Renaming is the cheapest, highest-value refactoring there is: <code>max</code>, <code>days</code>, <code>fine</code>, <code>diff</code> become <code>toiDa</code>, <code>soNgayTre</code>, <code>phi</code>, <code>treMs</code>, and the next commit can replace the magic <code>1000 * 60 * 60 * 24</code> with a named constant and split the one <code>rs</code> that was reused for three different queries (<strong>Split Variable</strong>):'
  : '<code>getString("type")</code> vẫn giữ — đó là tên cột. Đổi tên là phép refactor rẻ nhất mà đáng giá nhất: <code>max</code>, <code>days</code>, <code>fine</code>, <code>diff</code> thành <code>toiDa</code>, <code>soNgayTre</code>, <code>phi</code>, <code>treMs</code>, và commit kế tiếp có thể thay con số ma thuật <code>1000 * 60 * 60 * 24</code> bằng hằng có tên, rồi tách biến <code>rs</code> đang bị dùng lại cho ba câu truy vấn khác nhau (<strong>Split Variable</strong>):'}</p>
${C51_SPLIT}

<h3>${en ? 'The same moves in JavaScript, made by the VS Code engine' : 'Cùng các bước trong JavaScript, do bộ máy của VS Code làm'}</h3>
<p>${en
  ? 'The Node route <code>POST /api/muon</code> from Chapter 4 had <strong>no tests</strong>. So the first JS commit is eight characterization tests for it (missing data, unknown reader, the 14/30-day due dates, the 2019 “overdue blocks borrowing except GV” rule, the <code>&gt;=</code> limit, a string id matched by <code>==</code>). They also exposed a test-infrastructure smell: the route writes <code>data/phieu.json</code>, and Jest runs test files in parallel — so the same commit sets <code>"test": "jest --runInBand"</code>. Then the tool:'
  : 'Route Node <code>POST /api/muon</code> từ Chương 4 <strong>chưa có test</strong>. Nên commit JS đầu tiên là tám characterization test cho nó (thiếu dữ liệu, độc giả lạ, hạn 14/30 ngày, luật 2019 "đang quá hạn thì không cho mượn trừ GV", giới hạn <code>&gt;=</code>, id dạng chuỗi khớp nhờ <code>==</code>). Chúng còn lộ ra một smell ở hạ tầng test: route ghi vào <code>data/phieu.json</code>, mà Jest chạy các tệp test song song — nên cùng commit đó đặt <code>"test": "jest --runInBand"</code>. Rồi tới công cụ:'}</p>
${B51_TS}
${O51_TS_LIETKE}
<p>${en
  ? 'The extracted function is called <code>newFunction</code> first — VS Code puts you straight into rename mode, which the script imitates. “Global scope” is the module scope of a CommonJS file. Rename found 9 references — and none inside strings. Now try the overdue loop:'
  : 'Hàm vừa tách đầu tiên tên <code>newFunction</code> — VS Code đưa bạn thẳng vào chế độ đổi tên, script làm y như vậy. "Global scope" ở đây là phạm vi module của tệp CommonJS. Rename tìm được 9 chỗ tham chiếu — không chỗ nào nằm trong chuỗi. Giờ thử vòng lặp quá hạn:'}</p>
${O51_TU_CHOI}
<p>${en
  ? 'The tool refuses, and the reason is the smell itself: the loop <em>searches</em> and <em>answers the HTTP request</em> in the same place. An extracted function cannot return from its caller. So you do one manual, careful step — <strong>separate the query from the decision</strong> — run the tests, commit, and only then let the tool extract:'
  : 'Công cụ từ chối, và lý do chính là smell: vòng lặp vừa <em>tìm kiếm</em> vừa <em>trả lời yêu cầu HTTP</em> ở cùng một chỗ. Hàm được tách ra không thể return thay cho hàm gọi nó. Vậy bạn làm một bước tay, cẩn thận — <strong>tách truy vấn khỏi quyết định</strong> — chạy test, commit, rồi mới để công cụ tách:'}</p>
${J51_TACH_TRUY_VAN}

<h3>${en ? 'Change Function Declaration — when the tool will not help' : 'Change Function Declaration — khi công cụ không giúp'}</h3>
<p>${en
  ? 'Lesson 4.1 found <code>taoPhieu</code>’s dead parameter <code>loai</code> (8 parameters, one unused). IntelliJ’s Change Signature (Ctrl+F6) removes a parameter and updates every call site in Java. In VS Code, the quick fix on the greyed-out parameter offers something else:'
  : 'Bài 4.1 tìm ra tham số chết <code>loai</code> của <code>taoPhieu</code> (8 tham số, một cái không dùng). Change Signature của IntelliJ (Ctrl+F6) bỏ một tham số và cập nhật mọi chỗ gọi trong Java. Trong VS Code, quick fix trên tham số bị làm mờ lại đưa ra thứ khác:'}</p>
${O51_QUICKFIX}
<p>${en
  ? 'Only the underscore — the same answer even for an unused <em>last</em> parameter (tested on a two-line file). Removing a parameter means editing every call, and in plain JavaScript the tool cannot be sure it has found every caller (dynamic calls, <code>apply</code>, files outside the project). This is where Fowler’s <strong>migration mechanics</strong> apply: (1) find all callers yourself (<code>grep -rn "taoPhieu(" .</code> — one caller here), (2) change declaration and callers in one commit, (3) run tests. With many callers or a public API: create the new function, make the old one call it, migrate callers one commit at a time, delete the old one last.'
  : 'Chỉ có dấu gạch dưới — kể cả với tham số không dùng nằm <em>ở cuối</em> cũng vậy (đã thử trên một tệp hai dòng). Bỏ tham số nghĩa là sửa mọi lời gọi, mà trong JavaScript thuần công cụ không chắc đã tìm thấy hết chỗ gọi (gọi động, <code>apply</code>, tệp nằm ngoài dự án). Đây là lúc dùng <strong>cách di trú</strong> (migration mechanics) của Fowler: (1) tự tìm mọi chỗ gọi (<code>grep -rn "taoPhieu(" .</code> — ở đây chỉ một chỗ), (2) đổi khai báo và chỗ gọi trong cùng một commit, (3) chạy test. Nhiều chỗ gọi hoặc là API công khai: tạo hàm mới, cho hàm cũ gọi hàm mới, chuyển từng chỗ gọi trong từng commit, xoá hàm cũ sau cùng.'}</p>
<p>${en
  ? '<strong>Inline</strong> is the reverse of every extraction: Inline Variable when a name says nothing more than its expression, Inline Function when a function’s body is as clear as its name (lesson 5.2 inlines three helper functions once the enum makes them pointless). Refactoring goes both ways; the goal is clarity, not “more functions”.'
  : '<strong>Inline</strong> (gộp lại) là chiều ngược của mọi phép tách: Inline Variable khi cái tên không nói thêm gì so với biểu thức, Inline Function khi thân hàm rõ ngang tên hàm (bài 5.2 gộp lại ba hàm phụ khi enum đã làm chúng thừa). Refactor đi được cả hai chiều; mục tiêu là rõ ràng, không phải "nhiều hàm hơn".'}</p>

<h3>💼 ${en ? 'OJT situation' : 'Tình huống OJT'}</h3>
<p>${en
  ? 'Your first maintenance PR at an outsourcing project: “clean up BookServlet before TV-95”. You send 6 commits, each with the Fowler name in the message (“refactor: Slide Statements…”, “refactor: Extract Function…”). The reviewer — a senior who has never seen this module — reviews commit by commit: a move-only commit takes seconds to check (“same lines, new place”), a rename commit is checked by the tool name. The same changes squashed into one 300-line diff would sit in the review queue for two days. Small named steps are not bureaucracy; they are how you get reviewed quickly.'
  : 'PR bảo trì đầu tiên của bạn ở một dự án outsourcing: "dọn BookServlet trước TV-95". Bạn gửi 6 commit, lời commit có tên Fowler ("refactor: Slide Statements…", "refactor: Extract Function…"). Người review — một anh senior chưa từng thấy module này — xem từng commit: commit chỉ dời code kiểm mất vài giây ("cùng các dòng, chỗ mới"), commit đổi tên thì nhìn tên phép là biết. Cũng những thay đổi đó gộp thành một diff 300 dòng sẽ nằm trong hàng chờ review hai ngày. Bước nhỏ có tên không phải thủ tục giấy tờ; đó là cách được review nhanh.'}</p>

<h3>🧪 ${en ? 'Practice (45 minutes)' : 'Thực hành (45 phút)'}</h3>
<div class="callout ok"><ol>
<li>${en ? 'On your lab copy, reproduce the 4 Java commits of this lesson (Slide Statements, Extract ×4, Rename, Magic Literal + Split Variable) — <code>mvn -B test</code> green after each, then commit.' : 'Trên bản lab của bạn, làm lại 4 commit Java của bài (Slide Statements, Extract ×4, Rename, Magic Literal + Split Variable) — <code>mvn -B test</code> xanh sau từng bước rồi mới commit.'}</li>
<li>${en ? 'On a throw-away branch, do the rename with Find/Replace and watch the 5 errors; find “Unknown column” in the surefire output; delete the branch.' : 'Trên một nhánh bỏ đi, đổi tên bằng Find/Replace và xem 5 lỗi; tìm "Unknown column" trong output của surefire; xoá nhánh.'}</li>
<li>${en ? 'In VS Code, open <code>routes/muon.js</code>, select the overdue loop and press Ctrl+. — confirm the same refusal; then do the manual “separate query” step and extract.' : 'Trong VS Code, mở <code>routes/muon.js</code>, bôi đen vòng lặp quá hạn và bấm Ctrl+. — xác nhận cùng lời từ chối; rồi làm bước tay "tách truy vấn" và tách hàm.'}</li>
</ol>
${giai(en ? 'Check: what should git log show?' : 'Kiểm: git log nên trông thế nào?', out(`
$ git log --oneline ch4..HEAD
5095466 refactor(5.1): Replace Magic Literal MS_MOT_NGAY + Split Variable rs
0a1ce92 refactor(5.1): Rename Variable — loai/toiDa/phi/soNgayTre/hanTra
2fddcbf refactor(5.1): Extract Function — muonSach/traSach/themSach/xoaSach
d4a57a0 refactor(5.1): Slide Statements — st/ps/rs ve tung nhanh cua doPost
143d106 seam: bayGio() + characterization tra sach
`))}
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? 'every commit is green on its own, every commit message names one refactoring, and the diff of each commit can be explained in one sentence.' : 'commit nào cũng xanh khi đứng riêng, lời commit nào cũng gọi tên một phép refactor, và diff của mỗi commit giải thích được trong một câu.'}</p></div>

<h3>🗂 ${en ? 'Key terms' : 'Thuật ngữ trong bài'}</h3>
${thuatNgu(en, [
  ['Refactoring', 'tái cấu trúc', 'Đổi cấu trúc bên trong để dễ hiểu, dễ sửa mà không đổi hành vi quan sát được (Fowler).', 'Changing internal structure to make code easier to understand and modify without changing observable behaviour (Fowler).'],
  ['Observable behaviour', 'hành vi quan sát được', 'Những gì bên ngoài thấy: output, dữ liệu ghi, thông báo lỗi — chính là thứ test đặc tả đã khoá.', 'What the outside sees: output, stored data, error messages — what characterization tests lock.'],
  ['Slide Statements', 'trượt câu lệnh', 'Dời câu lệnh/khai báo về gần chỗ dùng; thường là bước chuẩn bị cho Extract Function.', 'Move statements/declarations next to their use; often the step before Extract Function.'],
  ['Split Variable', 'tách biến', 'Một biến bị gán cho nhiều mục đích ⇒ mỗi mục đích một biến.', 'A variable assigned for several purposes ⇒ one variable per purpose.'],
  ['Migration mechanics', 'cách di trú', 'Đổi chữ ký hàm qua hàm trung gian, chuyển chỗ gọi dần dần khi công cụ không làm được một lần.', 'Change a signature through an intermediate function, migrating callers gradually when a tool cannot do it at once.'],
  ['Language Service', 'dịch vụ ngôn ngữ', 'Bộ máy phân tích code của TypeScript mà VS Code gọi cho F2, Ctrl+., tìm tham chiếu.', 'The TypeScript analysis engine VS Code uses for F2, Ctrl+., find references.'],
])}
`
);

/* ═══════════════════ 5.2 — Đơn giản hoá điều kiện ═══════════════════ */
const C52_LOGIN_CU = java(`
// LoginServlet.doGet — "tu dong dang nhap bang cookie" (Tuan 2016). PMD: AvoidDeeplyNestedIfStmts, cognitive 12
Cookie[] cookies = request.getCookies();
if (cookies != null) {
    for (Cookie c : cookies) {
        if (c.getName().equals("remember") && c.getValue().contains(":")) {
            String u = c.getValue().split(":")[0];
            String t = c.getValue().split(":")[1];
            if (TokenUtil.makeToken(u).equals(t)) {
                request.getSession().setAttribute(Constants.SESSION_USER, u);
                response.sendRedirect("books");
                return;
            }
        }
    }
}
request.getRequestDispatcher("login.jsp").forward(request, response);
`);
const C52_TEST_COOKIE = java(`
// LoginServletCookieTest — 7 test, không cần CSDL (Cookie là lớp thường, request/response giả bằng Mockito)
@Test
void cookieThuHaiDung_vanDangNhap() throws Exception {
    voiCookie(new Cookie("remember", "admin:sai"), new Cookie("remember", "admin:" + TokenUtil.makeToken("admin")));
    verify(session).setAttribute("user", "admin");
}

@Test
void duoiThua_vanDangNhap_BUG() throws Exception {
    // split(":")[1] chỉ lấy đoạn thứ hai ⇒ "admin:<token>:rac" vẫn được nhận
    voiCookie(new Cookie("remember", "admin:" + TokenUtil.makeToken("admin") + ":rac"));
    verify(session).setAttribute("user", "admin");
}

@Test
void dauHaiChamCuoi_nemLoi_BUG() {
    // "admin:".split(":") chỉ có MỘT phần tử ⇒ [1] ném lỗi, Tomcat trả 500
    assertThrows(ArrayIndexOutOfBoundsException.class, () -> voiCookie(new Cookie("remember", "admin:")));
}
`);
const O52_COOKIE_XANH = out(`
$ mvn -B -o test
[INFO] Tests run: 7, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.018 s -- in com.thuvien.servlet.LoginServletCookieTest
[INFO] Tests run: 28, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
`);
const C52_LOGIN_MOI = java(`
// commit ffe54cb — Extract Function + Replace Nested Conditional with Guard Clauses
String nguoiDung = nguoiDungTuCookie(request.getCookies());
if (nguoiDung != null) {
    request.getSession().setAttribute(Constants.SESSION_USER, nguoiDung);
    response.sendRedirect("books");
    return;
}
request.getRequestDispatcher("login.jsp").forward(request, response);
}

/** Tự đăng nhập bằng cookie "remember" dạng ten:token. Trả null nếu không có cookie hợp lệ. */
private String nguoiDungTuCookie(Cookie[] cookies) {
    if (cookies == null) return null;
    for (Cookie c : cookies) {
        if (!c.getName().equals("remember")) continue;
        if (!c.getValue().contains(":")) continue;
        String[] phan = c.getValue().split(":");
        if (TokenUtil.makeToken(phan[0]).equals(phan[1])) return phan[0];
    }
    return null;
}
`);
const O52_DO_LOGIN = out(`
$ python3 tools/phuc-tap.py target/pmd.xml Login          # trước (commit dee56bc)
hàm                                        cyclomatic cognitive
LoginServlet.doGet                                  7        12
$ python3 tools/phuc-tap.py target/pmd.xml Login          # sau (commit ffe54cb)
LoginServlet.nguoiDungTuCookie                      6         8
LoginServlet.doGet                                  3         2
`);
const C52_GOM = java(`
// commit 3fd2a6f — bước 1: Extract Function ba lần. Ba chuỗi if nằm cạnh nhau ⇒ thấy rõ chúng là MỘT khái niệm
static int toiDa(String loai) {
    if (loai.equals("SV")) {
        return 3;
    } else if (loai.equals("GV")) {
        return 10;
    } else {
        return 1;
    }
}

static int soNgayMuon(String loai) { /* SV 14, GV 30, còn lại 7 */ }

static double phiTre(String loai, int soNgayTre) { /* SV 2000/ngày trần 50000, GV 1000, còn lại 5000 */ }
`);
const C52_ENUM = java(`
// commit 83e3920 — bước 2: Replace Conditional with Polymorphism (enum có thân riêng cho từng hằng — chạy được trên Java 8)
package com.thuvien.model;

public enum LoaiDocGia {
    SV {
        public int toiDa() { return 3; }
        public int soNgayMuon() { return 14; }
        protected double phiMoiNgay(int soNgayTre) { return Math.min(soNgayTre * 2000, 50000); }   // trần 50.000 — TV-52
    },
    GV {
        public int toiDa() { return 10; }
        public int soNgayMuon() { return 30; }
        protected double phiMoiNgay(int soNgayTre) { return soNgayTre * 1000; }
    },
    KHACH {
        public int toiDa() { return 1; }
        public int soNgayMuon() { return 7; }
        protected double phiMoiNgay(int soNgayTre) { return soNgayTre * 5000; }
    };

    public abstract int toiDa();

    public abstract int soNgayMuon();

    protected abstract double phiMoiNgay(int soNgayTre);

    public double phiTre(int soNgayTre) {
        return soNgayTre > 0 ? phiMoiNgay(soNgayTre) : 0;
    }

    /** Cột readers.type. Giữ đúng hành vi cũ: chuỗi nào không phải "SV"/"GV" đều tính như KHACH; null vẫn ném NullPointerException. */
    public static LoaiDocGia tu(String type) {
        if (type.equals("SV")) return SV;
        if (type.equals("GV")) return GV;
        return KHACH;
    }
}
`);
const C52_ENUM_TEST = java(`
// LoaiDocGiaTest — test đơn vị: 3 test chạy 0,004 s, không MySQL, không mock
@Test
void docTuCotType() {
    assertEquals(LoaiDocGia.SV, LoaiDocGia.tu("SV"));
    assertEquals(LoaiDocGia.KHACH, LoaiDocGia.tu("sv"));      // giữ hành vi cũ: phân biệt hoa thường
    assertEquals(LoaiDocGia.KHACH, LoaiDocGia.tu("NCS"));     // loại lạ rơi vào nhánh else
    assertThrows(NullPointerException.class, () -> LoaiDocGia.tu(null));
}
`);
const O52_GOI = out(`
$ git show 0a28b51 | grep '^[-+] '      # bước 3: Inline Function — chỗ gọi dùng thẳng enum, xoá ba hàm tĩnh
-            String loai = rsDocGia.getString("type");
+            LoaiDocGia loai = LoaiDocGia.tu(rsDocGia.getString("type"));
-            int toiDa = toiDa(loai);
+            int toiDa = loai.toiDa();
-            cal.add(Calendar.DATE, soNgayMuon(loai));
+            cal.add(Calendar.DATE, loai.soNgayMuon());
-            double phi = phiTre(loai, soNgayTre);
+            double phi = loai.phiTre(soNgayTre);
$ grep -c '"SV"\\|"GV"' src/main/java/com/thuvien/servlet/BookServlet.java
0
$ mvn -B -o test
[INFO] Tests run: 31, Failures: 0, Errors: 0, Skipped: 0
`);
const J52_LUAT = js(`
// lib/luat.js (commit bee54a3) — JavaScript không cần lớp con: một BẢNG TRA làm việc của đa hình
var LUAT = {
  SV: { toiDa: 3, soNgayMuon: 14, phiMotNgay: 2000, phiToiDa: 50000, chanKhiQuaHan: true },
  GV: { toiDa: 10, soNgayMuon: 30, phiMotNgay: 1000, phiToiDa: Infinity, chanKhiQuaHan: false },
  KHACH: { toiDa: 1, soNgayMuon: 7, phiMotNgay: 5000, phiToiDa: Infinity, chanKhiQuaHan: true }
};

function luatCua(loai) {
  // hasOwnProperty: LUAT['constructor'] hay LUAT['toString'] là hàm kế thừa từ Object.prototype, không phải luật
  return Object.prototype.hasOwnProperty.call(LUAT, loai) ? LUAT[loai] : LUAT.KHACH;
}

// lib/phi.js sau commit ddfee8b — 13 dòng if còn 5 dòng
function tinhPhi(phieu, docGia) {
  var tre = moment().diff(moment(phieu.hanTra), 'days', true);
  tre = Math.ceil(tre);                         // lệch với Java (cắt bỏ phần lẻ) — GIỮ, đã ghi ở bài 3.1
  if (tre <= 0) return 0;                       // guard clause có sẵn từ 2018
  var luat = luatCua(docGia.loai);
  return Math.min(tre * luat.phiMotNgay, luat.phiToiDa);
}
`);
const O52_PROTO = out(`
$ node -e "…"      # bảng tra viết vội: return LUAT[loai] || LUAT.KHACH;
"NCS"          => toiDa = 1 | dang muon 50 cuon, bi chan? true
"__proto__"    => toiDa = undefined | dang muon 50 cuon, bi chan? false
"constructor"  => toiDa = undefined | dang muon 50 cuon, bi chan? false
lib/luat.js  "__proto__" => toiDa = 1
`);

const L52 = ml((en) => `
<span class="eyebrow">${en ? 'Chapter 5 · Refactoring with the IDE, in small steps' : 'Chương 5 · Refactor bằng IDE, từng bước nhỏ'}</span>
<h2>${en ? '5.2 — Simplifying conditionals: guard clauses, polymorphism instead of switch' : '5.2 — Đơn giản hoá điều kiện: guard clause, đa hình thay cho switch'}</h2>
<p class="lead">${en
  ? 'A building guard who checks “no badge? out. Wrong floor? out. Visitor after 6 pm? out.” and only then says “welcome” is easy to follow. A guard who says “if you have a badge, then if the floor matches, then if it is before 6 pm, then welcome, otherwise…” loses everybody by the third “then”. This lesson does two refactorings on conditionals: <strong>guard clauses</strong> for nesting, and <strong>polymorphism</strong> for the same switch repeated in several places (Repeated Switches, lesson 4.3).'
  : 'Bác bảo vệ toà nhà nói "không có thẻ? mời ra. Sai tầng? mời ra. Khách sau 6 giờ tối? mời ra." rồi mới "mời vào" thì ai cũng theo kịp. Bác nào nói "nếu có thẻ thì nếu đúng tầng thì nếu trước 6 giờ thì mời vào, còn không thì…" là tới chữ "thì" thứ ba ai cũng lạc. Bài này làm hai phép refactor trên điều kiện: <strong>guard clause</strong> (mệnh đề canh cửa) cho chỗ lồng sâu, và <strong>đa hình</strong> cho cùng một switch lặp ở nhiều chỗ (Repeated Switches, bài 4.3).'}</p>
${moiTruong(en)}

<h3>${en ? 'Guard clauses — but the cookie login has no test yet' : 'Guard clause — nhưng phần đăng nhập bằng cookie chưa có test'}</h3>
<p>${en
  ? 'Lesson 4.1 flagged <code>LoginServlet.doGet</code>: PMD <em>AvoidDeeplyNestedIfStmts</em>, cognitive complexity 12. The normal path (“show the login page”) is at the bottom; the special path (auto-login) is four levels deep:'
  : 'Bài 4.1 đã đánh dấu <code>LoginServlet.doGet</code>: PMD <em>AvoidDeeplyNestedIfStmts</em>, cognitive complexity 12. Đường bình thường ("hiện trang đăng nhập") nằm tận đáy; đường đặc biệt (tự đăng nhập) lồng sâu bốn tầng:'}</p>
${C52_LOGIN_CU}
<p>${en
  ? 'This is security code — an authentication shortcut — and no test covers it. So first, seven characterization tests, none of which needs MySQL. Writing them is how you learn what the code really does, including two surprises you would never guess from reading quickly:'
  : 'Đây là code bảo mật — một lối tắt xác thực — mà không test nào phủ. Vậy trước tiên là bảy characterization test, không test nào cần MySQL. Viết chúng là cách biết code thật sự làm gì, kể cả hai bất ngờ mà đọc lướt sẽ không bao giờ đoán ra:'}</p>
${C52_TEST_COOKIE}
${O52_COOKIE_XANH}
<p>${en
  ? 'A cookie with a trailing colon crashes the request with HTTP 500, and a valid token followed by garbage is accepted. Both are bugs; both are now <em>locked</em> by tests with the <code>_BUG</code> suffix (the convention from Chapter 3), so the refactoring cannot change them by accident — and whoever fixes them later will do it on purpose, in a separate PR. Now the refactoring: extract the search into a function that <em>returns</em> the user, and turn each “if this, go deeper” into “if not this, skip”:'
  : 'Cookie có dấu hai chấm ở cuối làm yêu cầu sập với HTTP 500, còn token đúng kèm rác phía sau vẫn được nhận. Cả hai là bug; cả hai giờ đã được <em>khoá</em> bằng test có hậu tố <code>_BUG</code> (quy ước từ Chương 3), nên phép refactor không thể vô tình đổi chúng — và ai sửa chúng sau này sẽ sửa có chủ đích, ở PR riêng. Giờ mới refactor: tách phần tìm kiếm thành hàm <em>trả về</em> người dùng, và biến mỗi "nếu thế này thì vào sâu hơn" thành "nếu không phải thế này thì bỏ qua":'}</p>
${C52_LOGIN_MOI}
${O52_DO_LOGIN}
<p>${en
  ? 'Read the new function top to bottom: no cookies — nothing; wrong name — next; no colon — next; token matches — that user. Each guard removes one case and the reader forgets it. Note that <code>split(":")</code> is now called once instead of twice — a refactoring may remove duplicated work as long as the result is the same (the <code>_BUG</code> tests prove it is). Cognitive complexity: 12 in one method became 2 + 8 in two — the total barely moved, but the hard part has a name and a single job.'
  : 'Đọc hàm mới từ trên xuống: không có cookie — không ai; sai tên — cái tiếp; không có dấu hai chấm — cái tiếp; token khớp — chính người đó. Mỗi guard loại một trường hợp và người đọc quên nó đi được. Để ý <code>split(":")</code> giờ chỉ gọi một lần thay vì hai — refactor được phép bỏ việc làm lặp miễn kết quả không đổi (test <code>_BUG</code> chứng minh là không đổi). Cognitive complexity: 12 trong một hàm thành 2 + 8 ở hai hàm — tổng gần như không đổi, nhưng phần khó đã có tên và chỉ làm một việc.'}</p>

<h3>${en ? 'Replace Conditional with Polymorphism — three steps, three commits' : 'Replace Conditional with Polymorphism — ba bước, ba commit'}</h3>
<p>${en
  ? 'After 5.1, <code>muonSach</code> and <code>traSach</code> still contain three if-chains on the reader type: the limit (3/10/1), the loan length (14/30/7) and the fine (2000 with a 50,000 cap / 1000 / 5000). Lesson 4.3 counted where ticket TV-95 “add type NCS” would have to touch the code. You do not jump to classes in one go. <strong>Step 1</strong> — Extract Function on each chain, so they sit side by side:'
  : 'Sau 5.1, <code>muonSach</code> và <code>traSach</code> vẫn còn ba chuỗi if theo loại độc giả: giới hạn (3/10/1), số ngày mượn (14/30/7) và phí (2000 có trần 50.000 / 1000 / 5000). Bài 4.3 đã đếm những chỗ ticket TV-95 "thêm loại NCS" sẽ phải đụng. Không nhảy thẳng sang lớp trong một lần. <strong>Bước 1</strong> — Extract Function cho từng chuỗi, để chúng nằm cạnh nhau:'}</p>
${C52_GOM}
<p>${en
  ? 'Side by side, it is obvious: three functions, one parameter <code>loai</code>, one concept. <strong>Step 2</strong> — give the concept a type. In Java 8 the shortest honest form of polymorphism is an <code>enum</code> whose constants each override abstract methods; the old functions keep their signatures and simply delegate, so no call site changes in this commit:'
  : 'Đặt cạnh nhau thì thấy ngay: ba hàm, một tham số <code>loai</code>, một khái niệm. <strong>Bước 2</strong> — cho khái niệm đó một kiểu. Trong Java 8, dạng đa hình ngắn và thật nhất là một <code>enum</code> mà mỗi hằng tự ghi đè các hàm trừu tượng; các hàm cũ giữ nguyên chữ ký và chỉ uỷ quyền, nên commit này không đổi chỗ gọi nào:'}</p>
${C52_ENUM}
<p>${en
  ? 'Two details are what make this a refactoring rather than a rewrite. <code>tu()</code> keeps the old <code>else</code>: any string that is not exactly “SV” or “GV” — including “sv” or a future “NCS” — still behaves like KHACH, and <code>null</code> still throws. And <code>Math.min(soNgayTre * 2000, 50000)</code> computes in <code>int</code> then widens to <code>double</code>, exactly like the old <code>fine = days * 2000</code>. The enum also gets its own unit test — the first test in this repo that runs in milliseconds without a database:'
  : 'Hai chi tiết làm đây là refactor chứ không phải viết lại. <code>tu()</code> giữ nhánh <code>else</code> cũ: chuỗi nào không đúng y "SV" hay "GV" — kể cả "sv" hay "NCS" trong tương lai — vẫn cư xử như KHACH, còn <code>null</code> vẫn ném lỗi. Và <code>Math.min(soNgayTre * 2000, 50000)</code> tính bằng <code>int</code> rồi mới nới sang <code>double</code>, y như dòng cũ <code>fine = days * 2000</code>. Enum còn có test đơn vị riêng — test đầu tiên trong repo này chạy trong vài mili giây mà không cần cơ sở dữ liệu:'}</p>
${C52_ENUM_TEST}
<p>${en ? '<strong>Step 3</strong> — Inline Function: call the enum directly and delete the three helpers.' : '<strong>Bước 3</strong> — Inline Function: gọi thẳng enum và xoá ba hàm phụ.'}</p>
${O52_GOI}
<p>${en
  ? 'Why an enum and not <code>SinhVien extends DocGia</code>? Reader type is a <em>value</em> read from a column, and it never changes behaviour at runtime beyond these rules; an enum gives you exhaustiveness for free (add a constant, and the compiler refuses to build until all three abstract methods exist). When each type needs its own state or dependencies, the next step is a Strategy interface with one class per type — the GoF pattern you met in SWD392. On Java 17+, sealed interfaces and switch expressions offer a third option (Chapter 7).'
  : 'Sao dùng enum mà không dùng <code>SinhVien extends DocGia</code>? Loại độc giả là một <em>giá trị</em> đọc từ cột, và ngoài mấy luật này nó không đổi hành vi lúc chạy; enum cho bạn tính đầy đủ miễn phí (thêm một hằng là trình biên dịch không chịu build cho tới khi đủ cả ba hàm trừu tượng). Khi mỗi loại cần trạng thái hay phụ thuộc riêng, bước kế tiếp là interface Strategy với mỗi loại một lớp — mẫu GoF bạn đã gặp ở SWD392. Từ Java 17, sealed interface và switch expression cho thêm lựa chọn thứ ba (Chương 7).'}</p>
${lk(academy('software-architecture-and-design', 'swd392-slide-swd15-1'), '🎓', en ? 'Academy SWD392 — SOLID: the Open/Closed principle behind this refactoring' : 'Academy SWD392 — SOLID: nguyên lý Open/Closed đứng sau phép refactor này', en ? 'Theory there, mechanics here' : 'Lý thuyết ở đó, thao tác ở đây')}

<h3>${en ? 'The same move in JavaScript: a lookup table' : 'Cùng bước đó trong JavaScript: một bảng tra'}</h3>
<p>${en
  ? 'Node has the same three switches (in <code>lib/phi.js</code> and <code>routes/muon.js</code>, plus the 2019 rule “overdue blocks borrowing, except GV”). In JavaScript, data plus one function is often enough polymorphism. Three commits again: create <code>lib/luat.js</code> with its own unit tests (nobody uses it yet), switch <code>tinhPhi</code> to it, switch the route to it. The route’s <code>docGia.loai != \'GV\'</code> becomes <code>luat.chanKhiQuaHan</code> — the rule now has a name instead of an exception list.'
  : 'Node có đúng ba switch đó (trong <code>lib/phi.js</code> và <code>routes/muon.js</code>, cộng luật 2019 "đang quá hạn thì không cho mượn, trừ GV"). Trong JavaScript, dữ liệu cộng một hàm thường đã đủ làm đa hình. Lại ba commit: tạo <code>lib/luat.js</code> kèm test đơn vị (chưa ai dùng), chuyển <code>tinhPhi</code> sang dùng nó, chuyển route sang dùng nó. Dòng <code>docGia.loai != \'GV\'</code> của route thành <code>luat.chanKhiQuaHan</code> — luật giờ có tên thay vì một danh sách ngoại lệ.'}</p>
${J52_LUAT}

<h3>🕵️ ${en ? 'Hacker’s corner — a lookup table is also an attack surface' : 'Góc hacker — bảng tra cũng là bề mặt tấn công'}</h3>
<p>${en
  ? 'The first draft of <code>luatCua</code> was the one-liner everybody writes: <code>return LUAT[loai] || LUAT.KHACH;</code>. Here is what it does with keys every JavaScript object inherits:'
  : 'Bản nháp đầu của <code>luatCua</code> là dòng mà ai cũng viết: <code>return LUAT[loai] || LUAT.KHACH;</code>. Đây là cách nó xử lý những khoá mà object JavaScript nào cũng thừa kế:'}</p>
${O52_PROTO}
<p>${en
  ? 'With <code>loai = "__proto__"</code> the lookup returns <code>Object.prototype</code>, <code>toiDa</code> is <code>undefined</code>, <code>50 &gt;= undefined</code> is <code>false</code> — the borrowing limit silently disappears. In this lab the type comes from <code>doc-gia.json</code>, written by staff, so it is a latent bug; but the moment a type comes from a request body or a query string, it is an authorisation bypass. The same family of mistakes, at scale, is <strong>prototype pollution</strong>: CVE-2019-10744 (July 2019) in lodash ≤ 4.17.11 let an attacker pass <code>{"constructor": {"prototype": {…}}}</code> to <code>defaultsDeep</code> and add properties to <em>every</em> object in the process; it was fixed in lodash 4.17.12 and affected thousands of packages that depended on it (Snyk advisory SNYK-JS-LODASH-450202). Rules for lookup tables keyed by data: <code>hasOwnProperty</code> (or <code>Object.create(null)</code>, or a <code>Map</code>), and a unit test for <code>"__proto__"</code> and <code>"constructor"</code> — the lab has both.'
  : 'Với <code>loai = "__proto__"</code> phép tra trả về <code>Object.prototype</code>, <code>toiDa</code> là <code>undefined</code>, <code>50 &gt;= undefined</code> là <code>false</code> — giới hạn mượn sách lặng lẽ biến mất. Trong lab, loại lấy từ <code>doc-gia.json</code> do nhân viên ghi, nên đây là bug tiềm ẩn; nhưng ngay khi loại đến từ thân yêu cầu hay query string, nó thành lỗ hổng vượt quyền. Cùng họ sai lầm đó, ở quy mô lớn, là <strong>prototype pollution</strong>: CVE-2019-10744 (tháng 7/2019) trong lodash ≤ 4.17.11 cho kẻ tấn công truyền <code>{"constructor": {"prototype": {…}}}</code> vào <code>defaultsDeep</code> để thêm thuộc tính vào <em>mọi</em> object trong tiến trình; bản sửa là lodash 4.17.12 và lỗi ảnh hưởng tới hàng nghìn gói phụ thuộc vào nó (thông báo Snyk SNYK-JS-LODASH-450202). Luật cho bảng tra dùng khoá lấy từ dữ liệu: <code>hasOwnProperty</code> (hoặc <code>Object.create(null)</code>, hoặc <code>Map</code>), và một test đơn vị cho <code>"__proto__"</code> với <code>"constructor"</code> — lab có cả hai.'}</p>

<h3>💼 ${en ? 'OJT situation' : 'Tình huống OJT'}</h3>
<p>${en
  ? 'In a review, a teammate suggests: “While you are in LoginServlet, also fix the 500 on <code>admin:</code> — it is one line.” The answer that keeps your PR reviewable: “Agreed it is a bug — it is locked by <code>dauHaiChamCuoi_nemLoi_BUG</code>. I will open TV-96 and fix it right after this refactoring merges, so the fix PR shows one red test turning green.” Polite, concrete, and you do not lose the bug.'
  : 'Khi review, một đồng đội gợi ý: "Đã vào LoginServlet rồi thì sửa luôn lỗi 500 với <code>admin:</code> đi — có một dòng." Câu trả lời giữ PR của bạn dễ review: "Đồng ý đó là bug — đã khoá bằng test <code>dauHaiChamCuoi_nemLoi_BUG</code>. Em mở TV-96 và sửa ngay sau khi PR refactor này được merge, để PR sửa lỗi cho thấy đúng một test đỏ chuyển xanh." Lịch sự, cụ thể, và bug không bị quên.'}</p>

<h3>🧪 ${en ? 'Practice (50 minutes): late fees by reader type' : 'Thực hành (50 phút): phí trễ hạn theo loại độc giả'}</h3>
<div class="callout ok"><ol>
<li>${en ? 'Write the 7 cookie tests first; check “Tests run: 28”. Then do the guard-clause refactoring and re-run PMD with <code>tools/do-phuc-tap.xml</code>.' : 'Viết 7 test cookie trước; kiểm "Tests run: 28". Rồi refactor bằng guard clause và chạy lại PMD với <code>tools/do-phuc-tap.xml</code>.'}</li>
<li>${en ? 'Do the three polymorphism commits in Java. After step 2, temporarily delete <code>soNgayMuon()</code> from <code>GV</code>: what does the compiler say? (Restore it.)' : 'Làm ba commit đa hình bên Java. Sau bước 2, tạm xoá <code>soNgayMuon()</code> khỏi <code>GV</code>: trình biên dịch nói gì? (Khôi phục lại.)'}</li>
<li>${en ? 'Do the three Node commits. Then change <code>luatCua</code> back to <code>LUAT[loai] || LUAT.KHACH</code> and run the tests — which one catches it?' : 'Làm ba commit bên Node. Rồi sửa <code>luatCua</code> về lại <code>LUAT[loai] || LUAT.KHACH</code> và chạy test — test nào bắt được?'}</li>
</ol>
${giai(en ? 'Show answers for steps 2 and 3' : 'Xem đáp án bước 2 và 3', `<p>${en
  ? 'Step 2: compilation fails with “&lt;anonymous com.thuvien.model.LoaiDocGia$2&gt; is not abstract and does not override abstract method soNgayMuon() in com.thuvien.model.LoaiDocGia” (line 13) — the exhaustiveness you get for free. Step 3: “khoá kế thừa từ prototype không phải là luật” fails: <code>luatCua(\'constructor\')</code> returns <code>[Function Object]</code> instead of the KHACH rule (“Tests: 1 failed, 20 passed” on the end-of-chapter branch).'
  : 'Bước 2: biên dịch lỗi "&lt;anonymous com.thuvien.model.LoaiDocGia$2&gt; is not abstract and does not override abstract method soNgayMuon() in com.thuvien.model.LoaiDocGia" (dòng 13) — tính đầy đủ được tặng miễn phí. Bước 3: test "khoá kế thừa từ prototype không phải là luật" đỏ: <code>luatCua(\'constructor\')</code> trả về <code>[Function Object]</code> thay vì luật KHACH ("Tests: 1 failed, 20 passed" trên nhánh cuối chương).'}</p>`)}
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? '<code>grep -c \'"SV"\' BookServlet.java</code> prints 0, 31 Java tests and 19 Jest tests are green, and every commit is green on its own.' : '<code>grep -c \'"SV"\' BookServlet.java</code> in ra 0, 31 test Java và 19 test Jest xanh, và commit nào cũng xanh khi đứng riêng.'}</p></div>

<h3>🗂 ${en ? 'Key terms' : 'Thuật ngữ trong bài'}</h3>
${thuatNgu(en, [
  ['Guard clause', 'mệnh đề canh cửa', 'Kiểm trường hợp đặc biệt ở đầu hàm rồi return/continue ngay, để đường chính không bị lồng.', 'Check a special case first and return/continue, so the main path is not nested.'],
  ['Replace Conditional with Polymorphism', 'thay điều kiện bằng đa hình', 'Chuỗi if/switch theo loại ⇒ mỗi loại một hằng enum/lớp tự cài hành vi.', 'An if/switch on type ⇒ one enum constant/class per type implementing its behaviour.'],
  ['Repeated Switches', 'switch lặp lại', 'Cùng một chuỗi điều kiện xuất hiện ở nhiều nơi; thêm một loại phải sửa tất cả.', 'The same conditional appears in several places; a new case means editing all of them.'],
  ['Exhaustiveness', 'tính đầy đủ', 'Trình biên dịch bắt buộc mọi trường hợp đều được xử lý (abstract method trong enum, sealed + switch).', 'The compiler forces every case to be handled (abstract methods in an enum, sealed + switch).'],
  ['Prototype pollution', 'đầu độc prototype', 'Ghi thuộc tính vào Object.prototype qua khoá như __proto__/constructor ⇒ mọi object bị ảnh hưởng.', 'Writing to Object.prototype through keys like __proto__/constructor ⇒ every object is affected.'],
])}
`
);

/* ═══════════════════ 5.3 — Di chuyển trách nhiệm ═══════════════════ */
const C53_DAO = java(`
// commit 66506c5 + 7ff0a21 — Extract Class PhieuMuonDAO: SQL chuyển NGUYÊN VĂN, mỗi hàm tự mở/đóng Statement của mình
public class PhieuMuonDAO {

    private final Connection con;      // dùng chung kết nối của yêu cầu, như trước

    public PhieuMuonDAO(Connection con) {
        this.con = con;
    }

    /** Loại của độc giả, hoặc null nếu không có độc giả này. */
    public LoaiDocGia loaiCuaDocGia(String readerId) throws SQLException {
        Statement st = con.createStatement();
        ResultSet rs = null;
        try {
            rs = st.executeQuery("SELECT * FROM readers WHERE id = " + readerId);   // nối chuỗi: GIỮ — sửa ở 6.3
            return rs.next() ? LoaiDocGia.tu(rs.getString("type")) : null;
        } finally {
            DBUtil.close(rs, st);
        }
    }

    /** Giữ nguyên: không kiểm rs.next() ⇒ sách không tồn tại ném "Illegal operation on empty result set." */
    public int soBanConLai(String bookId) throws SQLException { … }

    public int demDangMuon(String readerId) throws SQLException { … }
    public void themPhieu(int bookId, int readerId, Timestamp ngayMuon, Timestamp hanTra) throws SQLException { … }
    public PhieuCanTra timPhieuCanTra(String loanId) throws SQLException { … }    // KHÔNG lọc return_date IS NULL — giữ bug
    public void ghiTra(int loanId, Timestamp ngayTra, double phi) throws SQLException { … }
    public void congLaiSach(int bookId) throws SQLException { … }
}
`);
const C53_KHOANG = java(`
// commit 87a9387 — Introduce Parameter Object: hai Timestamp luôn đi cùng nhau thành một khái niệm
public final class KhoangMuon {
    public final Timestamp ngayMuon;
    public final Timestamp hanTra;

    /** Bắt đầu từ thời điểm của lịch truyền vào, cộng số ngày theo lịch (Calendar.DATE) như mã cũ. */
    public static KhoangMuon batDau(Calendar luc, int soNgay) {
        Calendar cal = (Calendar) luc.clone();
        Timestamp tu = new Timestamp(cal.getTimeInMillis());
        cal.add(Calendar.DATE, soNgay);
        return new KhoangMuon(tu, new Timestamp(cal.getTimeInMillis()));
    }
    …
}
// chỗ gọi:  dao.themPhieu(bookId, readerId, now, new Timestamp(cal.getTimeInMillis()))
//      ⇒  dao.themPhieu(bookId, readerId, KhoangMuon.batDau(Calendar.getInstance(), loai.soNgayMuon()))
`);
const O53_ENVY = out(`
$ git show 6563f5b | grep '^[-+] '      # Move Function — servlet hết "ghen tị" với dữ liệu của phiếu
-        long treMs = bayGio() - phieu.hanTra.getTime();
-        int soNgayTre = (int) (treMs / MS_MOT_NGAY);
-        double phi = phieu.loai.phiTre(soNgayTre);
+        double phi = phieu.phiTre(bayGio());
+        /** Số ngày trễ, CẮT phần lẻ (9 ngày 1 giờ ⇒ 9). Node làm tròn lên — lệch đã ghi ở bài 3.1, chưa sửa. */
+        public int soNgayTre(long bayGio) {
+            return (int) ((bayGio - hanTra.getTime()) / MS_MOT_NGAY);
+        }
+
+        public double phiTre(long bayGio) {
+            return loai.phiTre(soNgayTre(bayGio));
+        }
`);
const C53_SERVICE = java(`
// commit a1a8337 — Extract Class MuonTraService: nghiệp vụ không biết gì về HTTP
public class MuonTraService {

    private final PhieuMuonDAO dao;
    private final LongSupplier bayGio;          // seam thời gian của Ch3, giờ là phụ thuộc truyền vào

    public KetQua muon(String readerId, String bookId) throws SQLException {
        LoaiDocGia loai = dao.loaiCuaDocGia(readerId);
        if (loai == null) return new KetQua("books", "Độc giả không tồn tại", false);
        if (dao.demDangMuon(readerId) > loai.toiDa()) return new KetQua("books", "Vượt quá số sách được mượn", false);   // ">" — BUG TV-41, chưa sửa
        if (dao.soBanConLai(bookId) <= 0) return new KetQua("books", "Sách đã hết", false);
        KhoangMuon khoang = KhoangMuon.batDau(Calendar.getInstance(), loai.soNgayMuon());
        dao.themPhieu(Integer.parseInt(bookId), Integer.parseInt(readerId), khoang);
        return new KetQua("books", "Mượn thành công", true);
    }

    public KetQua tra(String loanId) throws SQLException {
        PhieuMuonDAO.PhieuCanTra phieu = dao.timPhieuCanTra(loanId);
        if (phieu == null) return new KetQua("readers", "Không tìm thấy phiếu mượn", false);
        double phi = phieu.phiTre(bayGio.getAsLong());
        dao.ghiTra(Integer.parseInt(loanId), new Timestamp(bayGio.getAsLong()), phi);
        dao.congLaiSach(phieu.bookId);
        return new KetQua("readers", phi > 0 ? "Trả sách. Phí trễ hạn: " + phi : "Trả sách thành công", true);
    }
}

// BookServlet — phần mượn/trả còn lại
private void muonSach(HttpServletRequest request, HttpServletResponse response, Connection con) throws Exception {
    String readerId = request.getParameter("readerId");
    String bookId = request.getParameter("bookId");
    MuonTraService.KetQua kq = dichVu(con).muon(readerId, bookId);
    if (kq.thanhCong) log.info("borrow book=" + bookId + " reader=" + readerId);    // log vẫn mang tên BookServlet
    chuyenTrang(response, kq);
}

private void traSach(HttpServletRequest request, HttpServletResponse response, Connection con) throws Exception {
    chuyenTrang(response, dichVu(con).tra(request.getParameter("loanId")));
}

private MuonTraService dichVu(Connection con) {
    return new MuonTraService(new PhieuMuonDAO(con), this::bayGio);   // test cũ ghi đè bayGio() vẫn có tác dụng
}
`);
const O53_SO_DONG = out(`
$ wc -l src/main/java/com/thuvien/{servlet/BookServlet,service/MuonTraService,dao/PhieuMuonDAO,model/LoaiDocGia,model/KhoangMuon}.java
  144 servlet/BookServlet.java          # trước Chương 5: 193 dòng, một doPost 120 dòng
   54 service/MuonTraService.java
  133 dao/PhieuMuonDAO.java
   40 model/LoaiDocGia.java
   23 model/KhoangMuon.java
`);
const C53_SERVICE_TEST = java(`
// MuonTraServiceTest — giờ luật mượn/trả test được KHÔNG cần MySQL, không cần mock servlet
private final PhieuMuonDAO dao = mock(PhieuMuonDAO.class);
private final MuonTraService dichVu = new MuonTraService(dao, () -> HOM_NAY);

@Test
void svDangGiu4_biTuChoi_khongGhiGi() throws Exception {
    when(dao.loaiCuaDocGia("5")).thenReturn(LoaiDocGia.SV);
    when(dao.demDangMuon("5")).thenReturn(4);
    assertEquals("Vượt quá số sách được mượn", dichVu.muon("5", "7").thongBao);
    verify(dao, never()).themPhieu(anyInt(), anyInt(), any());
}
`);
const O53_SERVICE_TEST = out(`
[INFO] Tests run: 2, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.037 s -- in com.thuvien.service.MuonTraServiceTest
[INFO] Tests run: 13, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 1.527 s -- in com.thuvien.servlet.BookServletMuonSachTest
[INFO] Tests run: 33, Failures: 0, Errors: 0, Skipped: 0
`);
const C53_HEADER = out(`
$ git show 5afc327 -- src/main/webapp/header.jsp
-<%@ page import="java.sql.*, com.thuvien.util.DBUtil" %>
-<%
-    int quaHan = 0;
-    Connection hc = DBUtil.getConnection();
-    Statement hs = hc.createStatement();
-    ResultSet hr = hs.executeQuery("SELECT COUNT(*) FROM loans WHERE return_date IS NULL AND due_date < NOW()");
-    if (hr.next()) quaHan = hr.getInt(1);
-    hr.close(); hs.close(); hc.close();
-%>
+<%@ page import="com.thuvien.dao.ThongKeDAO" %>
+<% int quaHan = new ThongKeDAO().demQuaHan(); %>
 <div style="background:#2b5797;color:#fff;padding:8px">
`);
const O53_GOLDEN = out(`
$ bash tools/golden.sh /tmp/golden-truoc          # ứng dụng chạy bản TRƯỚC commit, Tomcat 9 trong Docker
 145 /tmp/golden-truoc/books.html
 125 /tmp/golden-truoc/readers.html
  29 /tmp/golden-truoc/report_days_1.html
$ for f in golden/*.html; do cmp -s $f /tmp/golden-truoc/$(basename $f) && echo "giong: $f"; done   # so với golden của Ch3
giong: golden/books.html
giong: golden/readers.html
giong: golden/report_days_1.html
$ docker compose up -d --build web && bash tools/golden.sh /tmp/golden-sau     # bản SAU commit
$ diff -r /tmp/golden-truoc /tmp/golden-sau && echo "diff -r: KHONG KHAC"
diff -r: KHONG KHAC
$ grep -n "report" /tmp/golden-sau/books.html | head -1
12:  <a style="color:#fff" href="report">QuÃ¡ háº¡n (3)</a> |
`);
const J53_KHO = out(`
$ git show 9e9d8da | grep '^[-+] '      # Move Function: chỉ kho được biết dữ liệu nằm ở tệp nào
+// Chuyển từ routes/muon.js (Move Function — bài 5.3): chỉ kho được biết dữ liệu nằm ở tệp nào
+function ghi(ten, ds, cb) {
+  fs.writeFile(path.join(__dirname, '..', 'data', ten + '.json'), JSON.stringify(ds, null, 2), cb);
+}
-module.exports = { doc: doc };
+module.exports = { doc: doc, ghi: ghi };
-      fs.writeFile(path.join(__dirname, '..', 'data', 'phieu.json'), JSON.stringify(dsPhieu, null, 2), function (err3) {
+      kho.ghi('phieu', dsPhieu, function (err3) {
$ npm test
Tests:       19 passed, 19 total
`);

const L53 = ml((en) => `
<span class="eyebrow">${en ? 'Chapter 5 · Refactoring with the IDE, in small steps' : 'Chương 5 · Refactor bằng IDE, từng bước nhỏ'}</span>
<h2>${en ? '5.3 — Moving features: Move Function/Field, Extract Class, Introduce Parameter Object' : '5.3 — Di chuyển trách nhiệm: chuyển hàm/trường, tách lớp, gom tham số thành đối tượng'}</h2>
<p class="lead">${en
  ? 'A family restaurant where the owner takes orders, cooks, washes dishes and does the accounts works — until there are forty tables. Hiring a cook does not change the menu; it changes who does what. <strong>BookServlet</strong> is that owner: it reads HTTP parameters, decides borrowing rules, writes SQL and builds redirect messages. This lesson moves each job to its own place — DAO, service, value object — without changing one thing the customer sees.'
  : 'Một quán ăn gia đình mà chủ quán vừa nhận món, vừa nấu, vừa rửa bát, vừa làm sổ sách vẫn chạy được — cho tới khi có bốn mươi bàn. Thuê thêm đầu bếp không đổi thực đơn; nó đổi ai làm việc gì. <strong>BookServlet</strong> chính là ông chủ quán đó: đọc tham số HTTP, quyết luật mượn, viết SQL và ghép thông báo redirect. Bài này chuyển từng việc về đúng chỗ của nó — DAO, service, đối tượng giá trị — mà không đổi một thứ gì khách nhìn thấy.'}</p>
${moiTruong(en)}

<h3>${en ? 'The target: three layers you already know from PRJ301' : 'Đích đến: ba tầng bạn đã biết từ PRJ301'}</h3>
<table>
<tr><th>${en ? 'Layer' : 'Tầng'}</th><th>${en ? 'Knows about' : 'Biết về'}</th><th>${en ? 'Must not know about' : 'Không được biết về'}</th><th>${en ? 'In the lab after this lesson' : 'Trong lab sau bài này'}</th></tr>
<tr><td>Servlet (controller)</td><td>HTTP: ${en ? 'parameters, session, redirect' : 'tham số, session, redirect'}</td><td>SQL, ${en ? 'business rules' : 'luật nghiệp vụ'}</td><td><code>BookServlet</code></td></tr>
<tr><td>Service</td><td>${en ? 'rules: limit, due date, fine' : 'luật: giới hạn, hạn trả, phí'}</td><td>HTTP, SQL</td><td><code>MuonTraService</code>, <code>LoaiDocGia</code>, <code>KhoangMuon</code></td></tr>
<tr><td>DAO</td><td>SQL, ${en ? 'tables, columns' : 'bảng, cột'}</td><td>HTTP, ${en ? 'rules' : 'luật'}</td><td><code>PhieuMuonDAO</code>, <code>ThongKeDAO</code></td></tr>
</table>
<p>${en
  ? 'You studied this shape (MVC, DAO) at school on fresh code. On legacy code the question is not “what should it look like” but “how do I get there without breaking anything, and so that every intermediate commit also works”. The answer is a sequence of Fowler moves: <strong>Extract Class</strong> (create the new class, move members one by one), <strong>Move Function</strong> (a function goes to the data it uses), <strong>Introduce Parameter Object</strong> (values that travel together become one type).'
  : 'Ở trường bạn học hình dáng này (MVC, DAO) trên code mới. Trên code cũ, câu hỏi không phải "nó nên trông thế nào" mà là "làm sao đi tới đó mà không làm hỏng gì, và commit trung gian nào cũng chạy được". Câu trả lời là một chuỗi bước Fowler: <strong>Extract Class</strong> (tạo lớp mới, chuyển từng thành viên một), <strong>Move Function</strong> (hàm đi theo dữ liệu nó dùng), <strong>Introduce Parameter Object</strong> (các giá trị luôn đi cùng nhau thành một kiểu).'}</p>
${lk(academy('java-web-application-development', 'prj301-on-ch6'), '🎓', en ? 'Academy PRJ301 6.4 — MVC practice: god servlet, PRG, front controller' : 'Academy PRJ301 6.4 — Thực hành MVC: god servlet, PRG, front controller', en ? 'The target shape, taught on new code' : 'Hình dáng đích, dạy trên code mới')}

<h3>${en ? 'Extract Class: the DAO, moved verbatim — including the bugs' : 'Extract Class: DAO, chuyển nguyên văn — kể cả bug'}</h3>
<p>${en
  ? 'Two commits: the borrow queries first, then the return queries. Each method opens and closes its own <code>Statement</code> on the shared connection. The SQL strings are copied character for character — <em>including</em> the concatenation that Chapter 6 will exploit, and the missing <code>rs.next()</code> check:'
  : 'Hai commit: câu truy vấn của phần mượn trước, phần trả sau. Mỗi hàm tự mở và đóng <code>Statement</code> của mình trên kết nối dùng chung. Chuỗi SQL được chép đúng từng ký tự — <em>kể cả</em> chỗ nối chuỗi mà Chương 6 sẽ khai thác, và chỗ thiếu kiểm <code>rs.next()</code>:'}</p>
${C53_DAO}
<div class="callout warn"><p>${en
  ? '<strong>Why not switch to PreparedStatement “while moving”?</strong> Because the Chapter 3 net locked <code>readerId = "abc"</code> ⇒ <em>Loi: Unknown column ‘abc’ in ‘where clause’</em>. With a PreparedStatement the driver would report a different error, a test would go red, and your “refactoring” commit would contain a security fix nobody reviewed as one. Lesson 6.3 does it properly: test of the attack first, fix, update the locked message on purpose.'
  : '<strong>Sao không đổi sang PreparedStatement "nhân tiện đang chuyển"?</strong> Vì tấm lưới Chương 3 đã khoá <code>readerId = "abc"</code> ⇒ <em>Loi: Unknown column ‘abc’ in ‘where clause’</em>. Dùng PreparedStatement thì driver sẽ báo lỗi khác, một test sẽ đỏ, và commit "refactor" của bạn chứa một bản vá bảo mật mà không ai review như một bản vá. Bài 6.3 làm đúng cách: test cuộc tấn công trước, sửa, rồi cập nhật thông báo đã khoá một cách có chủ đích.'}</p></div>

<h3>${en ? 'Introduce Parameter Object and Move Function' : 'Introduce Parameter Object và Move Function'}</h3>
<p>${en
  ? 'Borrow date and due date always travel together — Fowler’s textbook example of a parameter object is exactly a date range. Making it a type also gives the computation (“start now, add N calendar days”) a home:'
  : 'Ngày mượn và hạn trả lúc nào cũng đi cùng nhau — ví dụ kinh điển của Fowler cho parameter object chính là một khoảng ngày. Biến nó thành một kiểu còn cho phép tính ("bắt đầu từ giờ, cộng N ngày lịch") một chỗ ở:'}</p>
${C53_KHOANG}
<p>${en
  ? 'In <code>traSach</code>, three lines reached into the loan record (<code>phieu.hanTra</code>, <code>phieu.loai</code>) to compute the fine — <strong>Feature Envy</strong> from lesson 4.2. Move Function sends the computation to the data:'
  : 'Trong <code>traSach</code>, ba dòng thò tay vào bản ghi phiếu (<code>phieu.hanTra</code>, <code>phieu.loai</code>) để tính phí — <strong>Feature Envy</strong> ở bài 4.2. Move Function gửi phép tính về chỗ dữ liệu:'}</p>
${O53_ENVY}

<h3>${en ? 'Extract Class: the service — and what the servlet keeps' : 'Extract Class: service — và servlet còn giữ lại gì'}</h3>
${C53_SERVICE}
<p>${en
  ? 'Three decisions in this commit worth copying. <strong>The log line stays in the servlet</strong>: moving <code>log.info</code> into the service would change the logger name from <code>com.thuvien.servlet.BookServlet</code> to <code>…MuonTraService</code> — invisible to tests, but an ops team grepping logs or an alert rule keyed on the class name would break. Logs are observable behaviour too. <strong>The time seam becomes a constructor argument</strong> (<code>LongSupplier</code>), but the servlet passes <code>this::bayGio</code>, so the five Chapter 3 tests that override <code>bayGio()</code> keep working unchanged. <strong>Calendar.getInstance() for borrowing stays</strong> — the old code used real time there, not the seam; switching would be harmless in production but is a decision, not a refactoring.'
  : 'Ba quyết định trong commit này đáng học theo. <strong>Dòng log ở lại servlet</strong>: chuyển <code>log.info</code> sang service sẽ đổi tên logger từ <code>com.thuvien.servlet.BookServlet</code> thành <code>…MuonTraService</code> — test không thấy, nhưng đội vận hành grep log hay một luật cảnh báo theo tên lớp sẽ hỏng. Log cũng là hành vi quan sát được. <strong>Seam thời gian thành tham số hàm dựng</strong> (<code>LongSupplier</code>), nhưng servlet truyền <code>this::bayGio</code>, nên năm test Chương 3 ghi đè <code>bayGio()</code> vẫn chạy y nguyên. <strong>Calendar.getInstance() khi mượn được giữ</strong> — code cũ dùng giờ thật ở chỗ đó, không dùng seam; đổi thì vô hại trên production nhưng đó là một quyết định, không phải refactor.'}</p>
${O53_SO_DONG}
<p>${en
  ? 'The payoff is not the line count; it is what you can now test. The borrowing rule can be checked with a fake DAO — no MySQL, no mocked servlet, 37 ms for two tests versus 1.5 s for the database-backed suite:'
  : 'Phần thưởng không nằm ở số dòng; nó nằm ở chỗ giờ test được gì. Luật mượn kiểm được bằng DAO giả — không MySQL, không mock servlet, 37 ms cho hai test so với 1,5 giây của bộ test chạy với cơ sở dữ liệu:'}</p>
${C53_SERVICE_TEST}
${O53_SERVICE_TEST}

<h3>${en ? 'Taking SQL out of a JSP — proved by the golden master' : 'Đưa SQL ra khỏi JSP — chứng minh bằng golden master'}</h3>
<p>${en
  ? '<code>header.jsp</code> is included in every page and opens its own database connection in a scriptlet to count overdue loans. No unit test sees a JSP. The net for this one is the Chapter 3 golden master: three HTML pages captured over HTTP from the running Tomcat. Capture before, change, rebuild, capture after, compare:'
  : '<code>header.jsp</code> được include vào mọi trang và tự mở kết nối cơ sở dữ liệu trong scriptlet để đếm phiếu quá hạn. Không unit test nào nhìn thấy JSP. Lưới cho chỗ này là golden master của Chương 3: ba trang HTML chụp qua HTTP từ Tomcat đang chạy. Chụp trước, sửa, build lại, chụp sau, so:'}</p>
${C53_HEADER}
${O53_GOLDEN}
<p>${en
  ? 'Identical — and note what “identical” includes: the menu text is still mojibake (<code>QuÃ¡ háº¡n</code>) because <code>header.jsp</code> has no <code>pageEncoding</code> (lesson 1.1). The golden master locks that too. Fixing it is a one-line behaviour change with its own commit, after which you re-approve the golden files on purpose. The scriptlet still exists — one line of Java in the view — but no SQL; the cleaner end state (a filter setting a request attribute, <code>\${quaHan}</code> in the JSP) is the practice exercise.'
  : 'Giống hệt — và để ý "giống hệt" bao gồm cả gì: chữ trên menu vẫn lỗi font (<code>QuÃ¡ háº¡n</code>) vì <code>header.jsp</code> không có <code>pageEncoding</code> (bài 1.1). Golden master khoá cả cái đó. Sửa nó là một thay đổi hành vi một dòng, có commit riêng, sau đó bạn duyệt lại tệp golden một cách có chủ đích. Scriptlet vẫn còn — một dòng Java trong view — nhưng không còn SQL; trạng thái sạch hơn (một filter gán thuộc tính request, <code>\${quaHan}</code> trong JSP) là bài thực hành.'}</p>

<h3>${en ? 'In Node: only the store may know where data lives' : 'Bên Node: chỉ kho được biết dữ liệu nằm ở đâu'}</h3>
<p>${en
  ? 'Lesson 4.2 found <strong>Insider Trading</strong>: the borrow route wrote <code>data/phieu.json</code> itself, bypassing <code>lib/kho.js</code>, which is why two simultaneous requests can lose a loan or corrupt the file. Moving the write into the store does not fix the race — it moves the code so that the fix (lesson 5.5, ticket in Chapter 8) touches one function in one file:'
  : 'Bài 4.2 tìm ra <strong>Insider Trading</strong>: route mượn tự ghi <code>data/phieu.json</code>, đi vòng qua <code>lib/kho.js</code>, và đó là lý do hai yêu cầu đồng thời có thể làm mất phiếu hay hỏng tệp. Chuyển việc ghi vào kho không sửa được race — nó dời code để bản sửa (bài 5.5, ticket ở Chương 8) chỉ phải đụng một hàm trong một tệp:'}</p>
${J53_KHO}

<h3>💼 ${en ? 'OJT situation' : 'Tình huống OJT'}</h3>
<p>${en
  ? 'A customer’s architect reviews your branch and asks: “Why is <code>PhieuMuonDAO</code> still concatenating SQL? You are refactoring it anyway.” Answer with the plan, not with a defence: “This PR is behaviour-preserving, proved by 33 tests and an identical golden master. The injection fix is TV-102, next PR: it changes two error messages, so it comes with an attack test and updated expectations — reviewable on its own in ten minutes.” Architects in outsourcing projects ask that question to see whether you know the difference.'
  : 'Kiến trúc sư phía khách hàng review nhánh của bạn và hỏi: "Sao <code>PhieuMuonDAO</code> vẫn nối chuỗi SQL? Đằng nào em cũng đang refactor nó." Trả lời bằng kế hoạch, đừng trả lời bằng phân bua: "PR này giữ nguyên hành vi, chứng minh bằng 33 test và golden master giống hệt. Bản vá injection là TV-102, PR kế tiếp: nó đổi hai thông báo lỗi, nên đi kèm test tấn công và kỳ vọng mới — review riêng mất mười phút." Kiến trúc sư ở dự án outsourcing hỏi câu đó để xem bạn có phân biệt được hai việc hay không.'}</p>

<h3>🧪 ${en ? 'Practice (60 minutes): take SQL out of the views' : 'Thực hành (60 phút): đưa SQL ra khỏi view'}</h3>
<div class="callout ok"><ol>
<li>${en ? 'Reproduce the 6 Java commits (DAO ×2, parameter object, move function, service, service test). Tests: 31 → 33.' : 'Làm lại 6 commit Java (DAO ×2, parameter object, move function, service, test service). Test: 31 → 33.'}</li>
<li>${en ? 'Run <code>tools/golden.sh</code> before and after the <code>header.jsp</code> change; <code>diff -r</code> must be empty.' : 'Chạy <code>tools/golden.sh</code> trước và sau khi sửa <code>header.jsp</code>; <code>diff -r</code> phải rỗng.'}</li>
<li>${en ? 'Go one step further: a <code>Filter</code> mapped to <code>/books</code>, <code>/readers</code>, <code>/report</code> sets <code>request.setAttribute("quaHan", …)</code>, and <code>header.jsp</code> prints <code>\${quaHan}</code> — no Java left in the JSP. Golden master still identical?' : 'Đi thêm một bước: một <code>Filter</code> gắn vào <code>/books</code>, <code>/readers</code>, <code>/report</code> gán <code>request.setAttribute("quaHan", …)</code>, còn <code>header.jsp</code> in <code>\${quaHan}</code> — không còn Java trong JSP. Golden master vẫn giống hệt?'}</li>
</ol>
${giai(en ? 'Hint for step 3 — the trap' : 'Gợi ý bước 3 — cái bẫy', `<p>${en
  ? 'Map the filter only to the three servlet paths. Mapped to <code>/*</code>, it would also run (and query MySQL) for <code>/login</code> — and when the database is down, the login page would now fail, while before it worked. That is a behaviour change the golden master does not capture, because it logs in first. Ask yourself for every move: which requests run this code now that did not before?'
  : 'Chỉ gắn filter vào ba đường của servlet. Gắn vào <code>/*</code> thì nó chạy (và truy vấn MySQL) cả với <code>/login</code> — khi cơ sở dữ liệu sập, trang đăng nhập sẽ hỏng, trong khi trước đây vẫn hiện. Đó là thay đổi hành vi mà golden master không bắt được, vì nó đăng nhập trước rồi mới chụp. Với mỗi bước chuyển, tự hỏi: giờ những yêu cầu nào chạy đoạn code này mà trước đây không chạy?'}</p>`)}
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? 'no <code>java.sql</code> import in any JSP (<code>grep -l "java.sql" src/main/webapp/*.jsp</code> prints nothing), 33 tests green, golden master identical.' : 'không JSP nào còn import <code>java.sql</code> (<code>grep -l "java.sql" src/main/webapp/*.jsp</code> không in gì), 33 test xanh, golden master giống hệt.'}</p></div>

<h3>🗂 ${en ? 'Key terms' : 'Thuật ngữ trong bài'}</h3>
${thuatNgu(en, [
  ['Extract Class', 'tách lớp', 'Một lớp làm hai việc ⇒ tạo lớp mới, chuyển dần trường và hàm sang.', 'A class doing two jobs ⇒ create a new class and move fields and functions over gradually.'],
  ['Move Function', 'chuyển hàm', 'Hàm dùng dữ liệu của chỗ khác nhiều hơn của chính nó ⇒ chuyển về chỗ đó (chữa Feature Envy).', 'A function uses another module’s data more than its own ⇒ move it there (cures Feature Envy).'],
  ['Introduce Parameter Object', 'gom tham số thành đối tượng', 'Nhóm tham số luôn đi cùng (Data Clumps) ⇒ một kiểu có tên, có hành vi riêng.', 'Parameters that travel together (Data Clumps) ⇒ one named type that can grow behaviour.'],
  ['Move Statements', 'chuyển câu lệnh', 'Dời một đoạn lệnh sang chỗ đúng trách nhiệm (ở đây: từ JSP sang DAO).', 'Move statements to where the responsibility belongs (here: from a JSP into a DAO).'],
  ['Value object', 'đối tượng giá trị', 'Đối tượng bất biến, định danh bằng giá trị (KhoangMuon, Tien ở 5.4).', 'An immutable object identified by its value (KhoangMuon, Tien in 5.4).'],
])}
`
);

/* ═══════════════════ 5.4 — Tổ chức dữ liệu ═══════════════════ */
const C54_TIEN = java(`
// model/Tien.java — Replace Primitive with Object
public final class Tien {
    public static final Tien KHONG = new Tien(0);

    private final long dong;                     // VND không có đơn vị lẻ ⇒ số nguyên đồng là đủ chính xác

    private Tien(long dong) {
        if (dong < 0) throw new IllegalArgumentException("Tiền âm: " + dong);   // bất biến mà double không giữ được
        this.dong = dong;
    }

    public static Tien dong(long dong) { return dong == 0 ? KHONG : new Tien(dong); }
    public long soDong() { return dong; }
    public Tien nhan(int lan) { return dong(dong * lan); }
    public Tien khongVuotQua(Tien tran) { return dong <= tran.dong ? this : tran; }
    public boolean lonHonKhong() { return dong > 0; }

    /** "18.000 đ" — dấu chấm ngăn nghìn kiểu Việt Nam, không phụ thuộc locale của máy chủ. */
    @Override
    public String toString() { return String.format("%,d đ", dong).replace(',', '.'); }

    @Override public boolean equals(Object o) { return o instanceof Tien && ((Tien) o).dong == dong; }
    @Override public int hashCode() { return Long.hashCode(dong); }
}

// LoaiDocGia sau khi đổi kiểu:
SV {
    …
    protected Tien phiMoiNgay(int soNgayTre) { return Tien.dong(2000).nhan(soNgayTre).khongVuotQua(Tien.dong(50000)); }
},
`);
const O54_DO = out(`
$ mvn -B -o test          # lần 1: thông báo trả sách dùng thẳng "… Phí trễ hạn: " + phi  ⇒ gọi Tien.toString()
[ERROR]   BookServletTraSachTest.giangVienTre13Ngay1Gio:59 expected: <readers?msg=Trả sách. Phí trễ hạn: 13000.0> but was: <readers?msg=Trả sách. Phí trễ hạn: 13.000 đ>
[ERROR]   BookServletTraSachTest.khachTre26Ngay1Gio:65 expected: <readers?msg=Trả sách. Phí trễ hạn: 130000.0> but was: <readers?msg=Trả sách. Phí trễ hạn: 130.000 đ>
[ERROR]   BookServletTraSachTest.sinhVienTre9Ngay1Gio:54 expected: <readers?msg=Trả sách. Phí trễ hạn: 18000.0> but was: <readers?msg=Trả sách. Phí trễ hạn: 18.000 đ>
[ERROR]   MuonTraServiceTest.traTre9Ngay1Gio_phi18000:35 expected: <Trả sách. Phí trễ hạn: 18000.0> but was: <Trả sách. Phí trễ hạn: 18.000 đ>
[ERROR] Tests run: 33, Failures: 4, Errors: 0, Skipped: 0
`);
const C54_KIEU_CU = java(`
/**
 * Cách in CŨ của double ("18000.0") — giữ để thông báo trả sách không đổi. Đổi sang toString() là đổi hành vi:
 * làm ở ticket riêng (TV-97) cùng lúc sửa test đặc tả, không lẫn vào refactor này.
 */
public String hienThiKieuCu() {
    return String.valueOf((double) dong);
}

// MuonTraService.tra
return new KetQua("readers", phi.lonHonKhong() ? "Trả sách. Phí trễ hạn: " + phi.hienThiKieuCu() : "Trả sách thành công", true);

// PhieuMuonDAO.ghiTra — cột loans.fine vẫn là DOUBLE: đổi schema là việc khác, có kế hoạch di trú dữ liệu riêng
ps.setDouble(2, phi.soDong());
`);
const O54_XANH = out(`
$ mvn -B -o test
[INFO] Tests run: 33, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
$ git commit -am "refactor(5.4): Replace Primitive with Object — Tien thay double cho phi tre (in kieu cu de giu thong bao)"
`);
const O54_FLOAT = out(`
$ node -e "…"          # Node 14 — cùng chuẩn IEEE 754 với double của Java
0.1 cong 10 lan = 0.9999999999999999
0.1 + 0.2 = 0.30000000000000004
Math.round(1.005*100)/100 = 1
2**53 + 1 = 9007199254740992
`);
const J54_SO_PHIEU = js(`
// lib/so-phieu.js (commit ea68fc0) — Encapsulate Collection + Combine Functions into Class
// Giữ phong cách ES5 của repo (var, function, prototype) — quy ước dự án, xem bài 8.1.
function SoPhieu(ds) {
  this._ds = ds.slice();          // bản sao: không ai bên ngoài sửa được mảng bên trong
}

/** Bản sao để ghi ra kho hay trả cho client — push vào bản sao không làm đổi sổ. */
SoPhieu.prototype.danhSach = function () {
  return this._ds.slice();
};

SoPhieu.prototype.dangMuonCua = function (docGia) { … };          // trước: demDangMuon(dsPhieu, dg) ở cuối route
SoPhieu.prototype.quaHanDauTienCua = function (docGia) { … };     // trước: timPhieuQuaHan(dsPhieu, docGia)

/** Thêm phiếu mới với id = id lớn nhất + 1; trả về phiếu vừa thêm. */
SoPhieu.prototype.them = function (docGiaId, tenSach, ngayMuon, soNgay, nguoiTao, ghiChu) { … };   // trước: taoPhieu + dsPhieu.push

// routes/muon.js — chỗ dùng
var so = new SoPhieu(dsPhieu);
var dangMuon = so.dangMuonCua(docGia);
…
var p = so.them(docGia.id, tenSach, new Date(), soNgay, 'mobile', req.body.ghiChu || '');
kho.ghi('phieu', so.danhSach(), function (err3) { … });
`);
const J54_SO_TEST = js(`
// __tests__/so-phieu.test.js
test('bản sao trả ra không làm đổi sổ', () => {
  const so = new SoPhieu(DS);
  so.danhSach().push({ id: 99 });
  expect(so.danhSach()).toHaveLength(2);
});

test('mảng gốc truyền vào cũng không bị sửa khi thêm', () => {
  const goc = DS.slice();
  const so = new SoPhieu(goc);
  expect(so.them(2, 'X', new Date('2026-11-24T10:00:00+07:00'), 14, 'mobile', '').id).toBe(5);
  expect(goc).toHaveLength(2);
  expect(so.dangMuonCua({ id: 2 })).toBe(2);
});
`);

const L54 = ml((en) => `
<span class="eyebrow">${en ? 'Chapter 5 · Refactoring with the IDE, in small steps' : 'Chương 5 · Refactor bằng IDE, từng bước nhỏ'}</span>
<h2>${en ? '5.4 — Organising data: magic numbers, primitives to objects, encapsulated collections' : '5.4 — Tổ chức dữ liệu: số ma thuật, kiểu nguyên thuỷ thành đối tượng, đóng gói tập hợp'}</h2>
<p class="lead">${en
  ? 'Writing an amount on a cheque, you write “18,000 VND” — never just “18000”, never “18000.0”. The unit, the format and the rule “no negative cheques” are part of what money <em>is</em>. Code that stores money in a <code>double</code> keeps the number and throws away everything else. This lesson turns primitives into small types that carry their own rules — and shows the exact moment a “pure refactoring” tried to change what users see.'
  : 'Viết số tiền lên séc, bạn ghi "18.000 đồng" — không bao giờ chỉ "18000", càng không "18000.0". Đơn vị, cách viết và luật "không có séc âm" là một phần bản chất của tiền. Code lưu tiền bằng <code>double</code> giữ con số và vứt hết phần còn lại. Bài này biến kiểu nguyên thuỷ thành những kiểu nhỏ tự mang luật của mình — và chỉ ra đúng khoảnh khắc một phép "refactor thuần" suýt đổi thứ người dùng nhìn thấy.'}</p>
${moiTruong(en)}

<h3>${en ? 'Where the lab already stands' : 'Lab đang ở đâu'}</h3>
<ul>
<li>${en ? '<strong>Magic numbers</strong> (3/10/1, 14/30/7, 2000/1000/5000, 50000) — gone from <code>BookServlet</code>: they now live, named, in <code>LoaiDocGia</code> (Java) and <code>lib/luat.js</code> (Node). <code>1000 * 60 * 60 * 24</code> became <code>MS_MOT_NGAY</code> in 5.1.' : '<strong>Số ma thuật</strong> (3/10/1, 14/30/7, 2000/1000/5000, 50000) — đã rời <code>BookServlet</code>: giờ chúng nằm, có tên, trong <code>LoaiDocGia</code> (Java) và <code>lib/luat.js</code> (Node). <code>1000 * 60 * 60 * 24</code> thành <code>MS_MOT_NGAY</code> từ bài 5.1.'}</li>
<li>${en ? '<strong>Status as String</strong> — the reader type is now an enum inside the code (5.2). It is still a <code>VARCHAR</code> in MySQL and a <code>String</code> in <code>Reader.java</code> (used by JSPs): the enum is applied at the boundary, in <code>LoaiDocGia.tu()</code>. Changing the column is a database migration, not a refactoring.' : '<strong>Trạng thái bằng String</strong> — loại độc giả giờ là enum bên trong code (5.2). Nó vẫn là <code>VARCHAR</code> trong MySQL và <code>String</code> trong <code>Reader.java</code> (JSP đang dùng): enum được áp ở biên, trong <code>LoaiDocGia.tu()</code>. Đổi kiểu cột là di trú cơ sở dữ liệu, không phải refactor.'}</li>
<li>${en ? '<strong>Money as double</strong> — still everywhere: <code>phiTre</code> returns <code>double</code>, the message prints <code>18000.0</code>, the column <code>loans.fine</code> is <code>DOUBLE</code>. That is this lesson.' : '<strong>Tiền bằng double</strong> — vẫn ở khắp nơi: <code>phiTre</code> trả <code>double</code>, thông báo in <code>18000.0</code>, cột <code>loans.fine</code> là <code>DOUBLE</code>. Đó là việc của bài này.'}</li>
</ul>

<h3>${en ? 'Why double is wrong for money — in numbers' : 'Vì sao double sai cho tiền — bằng con số'}</h3>
${O54_FLOAT}
<p>${en
  ? 'A <code>double</code> stores binary fractions; 0.1 has no exact binary form, so it is stored as the nearest representable value and the error accumulates. Today’s lab fines are whole thousands, so nothing has gone wrong <em>yet</em> — but the first ticket that says “discount 1.5%” or “split the fine across two loans” will produce <code>17999.999999999996</code> on someone’s receipt. Above 2<sup>53</sup> a double cannot even count by one.'
  : '<code>double</code> lưu phân số nhị phân; 0,1 không có dạng nhị phân chính xác, nên được lưu bằng giá trị gần nhất biểu diễn được và sai số cộng dồn. Phí trong lab hôm nay toàn số nghìn tròn, nên <em>chưa</em> có gì sai — nhưng ticket đầu tiên ghi "giảm 1,5%" hay "chia phí cho hai phiếu" sẽ cho ra <code>17999.999999999996</code> trên biên lai của ai đó. Vượt 2<sup>53</sup>, double còn không đếm được từng đơn vị một.'}</p>

<h3>🕵️ ${en ? 'Real incidents — small rounding, big consequences' : 'Sự cố thật — sai số nhỏ, hậu quả lớn'}</h3>
<ul>
<li>${en
  ? '<strong>Vancouver Stock Exchange, 1982–1983.</strong> A new index started at 1000.000 in January 1982 and was recomputed thousands of times a day, each time <em>truncated</em> to three decimals instead of rounded. Twenty-two months later it stood near 524.8 while markets had risen; recomputed correctly over a weekend in November 1983, it jumped to about 1098.9 (reported by The Wall Street Journal and The Toronto Star, November 1983).'
  : '<strong>Sở giao dịch chứng khoán Vancouver, 1982–1983.</strong> Một chỉ số mới bắt đầu ở 1000,000 vào tháng 1/1982 và được tính lại hàng nghìn lần mỗi ngày, lần nào cũng bị <em>cắt</em> còn ba chữ số thập phân thay vì làm tròn. Hai mươi hai tháng sau, nó còn khoảng 524,8 trong khi thị trường đã tăng; tính lại đúng trong một cuối tuần của tháng 11/1983, nó nhảy lên khoảng 1098,9 (The Wall Street Journal và The Toronto Star đưa tin, tháng 11/1983).'}</li>
<li>${en
  ? '<strong>Patriot missile, Dhahran, 25 February 1991.</strong> The system counted time in tenths of a second in a 24-bit register; 0.1 is not exact in binary, and after about 100 hours of uptime the clock had drifted by 0.34 seconds — enough for the tracking gate to miss an incoming Scud. 28 soldiers were killed. US GAO report GAO/IMTEC-92-26 (February 1992) documents it; a fix had already been shipped but had not reached that battery.'
  : '<strong>Tên lửa Patriot, Dhahran, 25/2/1991.</strong> Hệ thống đếm thời gian theo phần mười giây trong một thanh ghi 24 bit; 0,1 không chính xác ở hệ nhị phân, và sau khoảng 100 giờ chạy liên tục đồng hồ đã lệch 0,34 giây — đủ để cửa sổ theo dõi trượt mất một quả Scud. 28 binh sĩ thiệt mạng. Báo cáo GAO/IMTEC-92-26 của GAO Hoa Kỳ (2/1992) ghi lại sự cố; bản sửa đã có nhưng chưa tới được khẩu đội đó.'}</li>
</ul>
<p>${en
  ? 'Both are the same lesson as the lab: a numeric representation chosen for convenience, an error too small to notice in one operation, and a system that repeats the operation many times. The cure is a type that makes the right representation the only one available.'
  : 'Cả hai là cùng bài học với lab: một cách biểu diễn số được chọn cho tiện, một sai số quá nhỏ để thấy trong một phép tính, và một hệ thống lặp phép tính đó rất nhiều lần. Cách chữa là một kiểu dữ liệu khiến cách biểu diễn đúng là cách duy nhất có thể dùng.'}</p>

<h3>${en ? 'Replace Primitive with Object: Tien' : 'Replace Primitive with Object: Tien'}</h3>
<p>${en
  ? 'Vietnamese đồng have no minor unit in practice, so a <code>long</code> of đồng is exact; for currencies with cents you would use <code>BigDecimal</code> with an explicit scale and <code>RoundingMode</code>, or <code>java.money</code> (JSR 354). The type also enforces a rule a <code>double</code> cannot: no negative amounts.'
  : 'Tiền đồng trên thực tế không có đơn vị lẻ, nên <code>long</code> tính bằng đồng là chính xác; với loại tiền có xu bạn sẽ dùng <code>BigDecimal</code> với số chữ số thập phân và <code>RoundingMode</code> ghi rõ, hoặc <code>java.money</code> (JSR 354). Kiểu này còn giữ được một luật mà <code>double</code> không giữ nổi: không có số tiền âm.'}</p>
${C54_TIEN}
<p>${en
  ? 'The internal unit tests (<code>LoaiDocGiaTest</code>, <code>MuonTraServiceTest</code>) are updated in the same commit — they test the types, and the type changed. The Chapter 3 tests at the HTTP boundary are <em>not</em> touched. Run them:'
  : 'Các test đơn vị bên trong (<code>LoaiDocGiaTest</code>, <code>MuonTraServiceTest</code>) được cập nhật trong cùng commit — chúng test các kiểu, mà kiểu thì đã đổi. Các test Chương 3 ở biên HTTP thì <em>không</em> đụng tới. Chạy:'}</p>
${O54_DO}
<p>${en
  ? 'This is the most important output of the chapter. A nice <code>toString()</code> — exactly what a good developer would write — changed the text the librarian sees after every late return. No reviewer reading the diff of <code>Tien.java</code> would have noticed; four characterization tests did, in three seconds. The new format is better. It is still a <strong>behaviour change</strong>: maybe the librarians have a habit, maybe a screen-reader script or a report scraper reads that message. So the refactoring keeps the old format explicitly, and the improvement becomes its own ticket:'
  : 'Đây là output quan trọng nhất của chương. Một <code>toString()</code> đẹp — đúng thứ mà người viết giỏi sẽ viết — đã đổi dòng chữ thủ thư nhìn thấy sau mỗi lần trả sách trễ. Không người review nào đọc diff của <code>Tien.java</code> mà nhận ra; bốn characterization test nhận ra, trong ba giây. Cách in mới đẹp hơn. Nó vẫn là <strong>thay đổi hành vi</strong>: biết đâu thủ thư đã quen, biết đâu có script đọc màn hình hay công cụ cào báo cáo đọc dòng đó. Vì vậy phép refactor giữ cách in cũ một cách tường minh, còn cải tiến thành ticket riêng:'}</p>
${C54_KIEU_CU}
${O54_XANH}
<div class="callout"><p>${en
  ? '<strong>Pattern: “preserve explicitly, improve separately”.</strong> A method named <code>hienThiKieuCu</code> (“old display”) is deliberately ugly: it documents a compatibility decision and is easy to find when ticket TV-97 comes. The same pattern applies to the mojibake menu (5.3) and to <code>Math.ceil</code> in Node (3.1).'
  : '<strong>Khuôn mẫu: "giữ tường minh, cải tiến riêng".</strong> Một hàm tên <code>hienThiKieuCu</code> cố tình xấu: nó ghi lại một quyết định giữ tương thích và dễ tìm khi ticket TV-97 tới. Khuôn mẫu này áp dụng cho cả menu lỗi font (5.3) và <code>Math.ceil</code> bên Node (3.1).'}</p></div>

<h3>${en ? 'Encapsulate Collection — the loan list in Node' : 'Encapsulate Collection — danh sách phiếu bên Node'}</h3>
<p>${en
  ? 'In the route, the array returned by <code>kho.doc</code> was passed around and mutated with <code>push</code> before being written back; three free functions at the bottom of the file each looped over it. Lesson 4.2’s race is partly a symptom of this: anyone holding the array can change it. <strong>Encapsulate Collection</strong> hides the array behind methods and hands out copies; <strong>Combine Functions into Class</strong> gathers the three loops into the same object:'
  : 'Trong route, mảng do <code>kho.doc</code> trả về bị truyền đi khắp nơi và bị sửa bằng <code>push</code> trước khi ghi lại; ba hàm rời ở cuối tệp, hàm nào cũng tự lặp qua nó. Race ở bài 4.2 một phần là triệu chứng của chuyện này: ai cầm mảng cũng sửa được nó. <strong>Encapsulate Collection</strong> (đóng gói tập hợp) giấu mảng sau các hàm và chỉ đưa ra bản sao; <strong>Combine Functions into Class</strong> gom ba vòng lặp vào cùng một đối tượng:'}</p>
${J54_SO_PHIEU}
${J54_SO_TEST}
<p>${en
  ? 'Jest: 19 → 21, all green. ESLint (the tuned config from lesson 4.4) on <code>routes/muon.js</code>: 20 warnings before this chapter, 4 now — all “nested callbacks” and <code>==</code>; <code>lib/phi.js</code>: 7 → 0. <code>them()</code> still takes six parameters — a smell left on purpose, the practice below fixes it with a parameter object. And note what was <em>not</em> changed: <code>==</code> in <code>dangMuonCua</code>. ESLint’s <code>eqeqeq</code> keeps nagging, but switching to <code>===</code> turns the test “docGia sent as a string still matches” red — the mobile app sends <code>"2"</code>. That is a contract decision for the API owner, not a refactoring.'
  : 'Jest: 19 → 21, xanh hết. ESLint (cấu hình đã chỉnh ở bài 4.4) trên <code>routes/muon.js</code>: 20 cảnh báo trước chương này, giờ còn 4 — toàn "callback lồng nhau" và <code>==</code>; <code>lib/phi.js</code>: 7 → 0. <code>them()</code> vẫn nhận sáu tham số — smell cố tình để lại, bài thực hành dưới đây chữa bằng parameter object. Và để ý thứ <em>không</em> đổi: <code>==</code> trong <code>dangMuonCua</code>. Luật <code>eqeqeq</code> của ESLint vẫn nhắc, nhưng đổi sang <code>===</code> sẽ làm đỏ test "docGia gửi dạng chuỗi vẫn khớp" — ứng dụng mobile gửi <code>"2"</code>. Đó là quyết định về hợp đồng API của người sở hữu API, không phải refactor.'}</p>

<h3>💼 ${en ? 'OJT situation' : 'Tình huống OJT'}</h3>
<p>${en
  ? 'A BA reads your PR and says: “The new format 18.000 đ looks great, why not ship it now?” Good answer: “It is ready — TV-97 is one line plus four test expectations. I kept it out of this PR so that if the customer objects to the format we revert one small commit, not the whole refactoring.” In outsourcing, the customer approves user-visible text; refactoring PRs should never need that approval.'
  : 'BA đọc PR của bạn và nói: "Cách in 18.000 đ mới đẹp quá, sao không đưa luôn?" Câu trả lời tốt: "Đã sẵn sàng — TV-97 là một dòng cộng bốn kỳ vọng test. Em để nó ngoài PR này, để nếu khách không đồng ý cách in thì mình revert một commit nhỏ, chứ không phải cả đợt refactor." Ở dự án outsourcing, chữ người dùng nhìn thấy do khách duyệt; PR refactor không bao giờ nên cần phải xin duyệt kiểu đó.'}</p>

<h3>🧪 ${en ? 'Practice (40 minutes)' : 'Thực hành (40 phút)'}</h3>
<div class="callout ok"><ol>
<li>${en ? 'Introduce <code>Tien</code> and use <code>toString()</code> in the message first: confirm exactly 4 failures. Then add <code>hienThiKieuCu()</code> and get back to 33 green.' : 'Thêm <code>Tien</code> và dùng <code>toString()</code> trong thông báo trước: xác nhận đúng 4 lỗi. Rồi thêm <code>hienThiKieuCu()</code> để về lại 33 xanh.'}</li>
<li>${en ? 'On a branch <code>tv97</code>: switch the message to <code>toString()</code> and update the 4 expectations — that is the whole behaviour-change PR. Count its lines.' : 'Trên nhánh <code>tv97</code>: chuyển thông báo sang <code>toString()</code> và cập nhật 4 kỳ vọng — đó là toàn bộ PR đổi hành vi. Đếm số dòng của nó.'}</li>
<li>${en ? 'Node: introduce a parameter object for <code>SoPhieu.prototype.them</code> (<code>{ docGiaId, tenSach, ngayMuon, soNgay, nguoiTao, ghiChu }</code>) — tests green, ESLint <code>max-params</code> warning gone.' : 'Node: dùng parameter object cho <code>SoPhieu.prototype.them</code> (<code>{ docGiaId, tenSach, ngayMuon, soNgay, nguoiTao, ghiChu }</code>) — test xanh, cảnh báo <code>max-params</code> của ESLint biến mất.'}</li>
</ol>
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? 'no <code>double</code> left in <code>LoaiDocGia</code>/<code>MuonTraService</code> (<code>grep -n double</code>), the boundary tests unchanged, and TV-97 exists as a separate branch.' : 'không còn <code>double</code> trong <code>LoaiDocGia</code>/<code>MuonTraService</code> (<code>grep -n double</code>), test ở biên không đổi, và TV-97 nằm ở một nhánh riêng.'}</p></div>

<h3>🗂 ${en ? 'Key terms' : 'Thuật ngữ trong bài'}</h3>
${thuatNgu(en, [
  ['Replace Primitive with Object', 'thay kiểu nguyên thuỷ bằng đối tượng', 'Một con số/chuỗi có luật riêng (tiền, mã, khoảng ngày) ⇒ một kiểu nhỏ giữ luật đó.', 'A number/string with its own rules (money, codes, date ranges) ⇒ a small type that keeps them.'],
  ['Primitive Obsession', 'ám ảnh kiểu nguyên thuỷ', 'Dùng double/String/int cho khái niệm nghiệp vụ; smell ở bài 4.2.', 'Using double/String/int for business concepts; the smell from lesson 4.2.'],
  ['IEEE 754', 'chuẩn số dấu phẩy động', 'Cách double lưu số nhị phân; 0,1 không chính xác ⇒ sai số cộng dồn.', 'How doubles store binary fractions; 0.1 is inexact ⇒ errors accumulate.'],
  ['Encapsulate Collection', 'đóng gói tập hợp', 'Không trả mảng/list gốc ra ngoài; cho thêm/bớt qua hàm, trả bản sao.', 'Never hand out the internal list; add/remove through methods, return copies.'],
  ['Combine Functions into Class', 'gom hàm vào lớp', 'Nhiều hàm cùng thao tác trên một dữ liệu ⇒ một lớp giữ dữ liệu đó.', 'Several functions operating on the same data ⇒ one class that owns it.'],
])}
`
);

/* ═══════════════════ 5.5 — Nhịp và kỷ luật ═══════════════════ */
const O55_TRON = out(`
$ git checkout -b ch5-tron ch5
$ # "tiện tay" trong lúc refactor MuonTraService: > thành >= (vì luật nói "tối đa 3 cuốn")
$ mvn -B -o test
[ERROR]   BookServletMuonSachTest.khachDangMuon1_vanMuonDuocCuonThu2_BUG_TV41:84 expected: <books?msg=Mượn thành công> but was: <books?msg=Vượt quá số sách được mượn>
[ERROR]   BookServletMuonSachTest.sinhVienDangMuon3_vanMuonDuocCuonThu4_BUG_TV41:72 expected: <books?msg=Mượn thành công> but was: <books?msg=Vượt quá số sách được mượn>
[ERROR] Tests run: 33, Failures: 2, Errors: 0, Skipped: 0
`);
const O55_TV41 = out(`
$ git checkout -b ch5-tv41 ch5        # PR riêng, chỉ một việc: sửa TV-41
$ git show --stat --format=%s HEAD
fix(TV-41): toi da N cuon nghia la N (> thanh >=) — cap nhat 2 test dac ta co chu dich
 src/main/java/com/thuvien/service/MuonTraService.java          |  2 +-
 src/test/java/com/thuvien/servlet/BookServletMuonSachTest.java | 10 +++++-----
 2 files changed, 6 insertions(+), 6 deletions(-)
$ git show HEAD | grep '^[-+] *void'
-    void sinhVienDangMuon3_vanMuonDuocCuonThu4_BUG_TV41() throws Exception {
+    void sinhVienDangMuon3_biTuChoiCuonThu4_TV41() throws Exception {
-    void khachDangMuon1_vanMuonDuocCuonThu2_BUG_TV41() throws Exception {
+    void khachDangMuon1_biTuChoiCuonThu2_TV41() throws Exception {
[INFO] Tests run: 33, Failures: 0, Errors: 0, Skipped: 0
`);
const O55_NCS = out(`
$ git checkout -b ch5-ncs ch5        # TV-95 "thêm loại NCS: 5 cuốn, 21 ngày, 1.500 đ/ngày, không trần" — SAU khi đã dọn đường
$ git show --stat --format=%s HEAD                       # legacy-thu-vien
feat(TV-95): them loai doc gia NCS
 src/main/java/com/thuvien/model/LoaiDocGia.java     |  6 ++++++
 src/main/java/com/thuvien/model/Reader.java         |  2 +-
 src/main/webapp/readers.jsp                         |  2 +-
 src/test/java/com/thuvien/model/LoaiDocGiaTest.java | 11 ++++++++++-
 4 files changed, 18 insertions(+), 3 deletions(-)
$ git show HEAD -- src/main | grep '^+ '
+    NCS {   // TV-95: nghiên cứu sinh — 5 cuốn, 21 ngày, 1.500 đ/ngày, không trần
+        public int toiDa() { return 5; }
+        public int soNgayMuon() { return 21; }
+        protected Tien phiMoiNgay(int soNgayTre) { return Tien.dong(1500).nhan(soNgayTre); }
+    },
+        if (type.equals("NCS")) return NCS;
[INFO] Tests run: 34, Failures: 0, Errors: 0, Skipped: 0
$ git show --stat --format=%s HEAD                       # legacy-express
feat(TV-95): them NCS vao bang luat
 __tests__/luat.test.js | 3 ++-
 lib/luat.js            | 1 +
 2 files changed, 3 insertions(+), 1 deletion(-)
Tests:       21 passed, 21 total
`);
const J55_DUA = js(`
// __tests__/dua-ghi.tam.test.js — TẠM, không commit: tái hiện "app báo tạo phiếu nhưng thủ thư không thấy"
test('hai lượt mượn đồng thời ⇒ hai phiếu khác id, tệp có 7 phiếu', async () => {
  fs.writeFileSync(TEP, GOC);
  const [a, b] = await Promise.all([
    request(app).post('/api/muon').send({ docGia: 2, sach: 'Refactoring' }),
    request(app).post('/api/muon').send({ docGia: 3, sach: 'Clean Architecture' }),
  ]);
  expect([a.body.phieu, b.body.phieu].sort()).toEqual([6, 7]);
  expect(JSON.parse(fs.readFileSync(TEP, 'utf8'))).toHaveLength(7);
});
`);
const O55_DUA = out(`
$ npx jest __tests__/dua-ghi.tam.test.js
FAIL __tests__/dua-ghi.tam.test.js
  ✕ hai lượt mượn đồng thời ⇒ hai phiếu khác id, tệp có 7 phiếu (49 ms)
    - Expected  - 1
    + Received  + 1
      Array [
        6,
    -   7,
    +   6,
      ]
Tests:       1 failed, 1 total
`);
const B55_TCR = bash(`
#!/bin/sh
# tools/tcr.sh "<lời commit>" — test && commit || revert (Kent Beck, 2018)
if npx jest --silent >/tmp/tcr.log 2>&1; then
  git commit -qam "$1" && echo "XANH ⇒ commit: $(git log --oneline -1)"
else
  git checkout -- lib routes && echo "ĐỎ ⇒ revert: $(grep -E '^Tests:' /tmp/tcr.log)"
fi
`);
const O55_TCR = out(`
$ sed -i "s/var toiDa = luat.toiDa;/var toiDaDuocMuon = luat.toiDa;/" routes/muon.js   # đổi tên bằng tay, quên chỗ dùng
$ tcr.sh "refactor: doi ten toiDa"
ĐỎ ⇒ revert: Tests:       6 failed, 15 passed, 21 total
$ node ts-sua.mjs routes/muon.js doi-ten 24 toiDa toiDaDuocMuon                         # đổi tên bằng công cụ
Rename Symbol "toiDa" → "toiDaDuocMuon": 3 chỗ
$ tcr.sh "refactor: doi ten toiDa"
XANH ⇒ commit: 23c9527 refactor: doi ten toiDa
$ git show HEAD | grep '^[-+] '
-      var toiDa = luat.toiDa;
+      var toiDaDuocMuon = luat.toiDa;
-      if (dangMuon >= toiDa) {
-        return res.status(409).json({ loi: 'vuot qua so sach duoc muon', dangMuon: dangMuon, toiDa: toiDa });
+      if (dangMuon >= toiDaDuocMuon) {
+        return res.status(409).json({ loi: 'vuot qua so sach duoc muon', dangMuon: dangMuon, toiDa: toiDaDuocMuon });
`);

const L55 = ml((en) => `
<span class="eyebrow">${en ? 'Chapter 5 · Refactoring with the IDE, in small steps' : 'Chương 5 · Refactor bằng IDE, từng bước nhỏ'}</span>
<h2>${en ? '5.5 — Rhythm and discipline: never mix refactoring and behaviour change, preparatory refactoring' : '5.5 — Nhịp và kỷ luật: không trộn refactor với đổi hành vi, refactor dọn đường'}</h2>
<p class="lead">${en
  ? 'An electrician does not rewire a room and move the sockets on the same afternoon without switching the breaker off and testing between the two jobs — if the lights fail, which job broke them? Lessons 5.1–5.4 showed the moves. This lesson is about the rhythm around them: one hat at a time, tests after every step, a commit on every green, a revert on every red — and the one reason to refactor that managers always accept: it makes the next feature cheap.'
  : 'Thợ điện không đi lại dây cả phòng và dời ổ cắm trong cùng một buổi chiều mà không ngắt cầu dao và thử điện giữa hai việc — đèn không sáng thì việc nào làm hỏng? Bài 5.1–5.4 cho bạn các bước. Bài này nói về nhịp quanh chúng: mỗi lúc đội một chiếc mũ, chạy test sau mỗi bước, xanh thì commit, đỏ thì hoàn tác — và một lý do refactor mà quản lý lúc nào cũng chấp nhận: nó làm tính năng kế tiếp trở nên rẻ.'}</p>
${moiTruong(en)}

<h3>${en ? 'Two hats' : 'Hai chiếc mũ'}</h3>
<p>${en
  ? 'Kent Beck’s metaphor, told by Fowler in <em>Refactoring</em>: when you program you wear one of two hats. With the <strong>adding-function hat</strong> you change behaviour and add tests; you do not restructure. With the <strong>refactoring hat</strong> you restructure and add no behaviour; tests do not change (except internal unit tests following a type change, as in 5.4). You swap hats often — every few minutes — but you always know which one you are wearing, and each commit is made under exactly one.'
  : 'Ẩn dụ của Kent Beck, được Fowler kể trong <em>Refactoring</em>: khi lập trình bạn đội một trong hai chiếc mũ. Đội <strong>mũ thêm chức năng</strong> thì bạn đổi hành vi và thêm test; không tái cấu trúc. Đội <strong>mũ refactor</strong> thì bạn tái cấu trúc và không thêm hành vi; test không đổi (trừ test đơn vị bên trong đi theo một lần đổi kiểu, như bài 5.4). Bạn đổi mũ thường xuyên — vài phút một lần — nhưng lúc nào cũng biết mình đang đội mũ nào, và mỗi commit được làm dưới đúng một chiếc.'}</p>

<h3>${en ? 'What a mixed commit looks like from the outside' : 'Một commit trộn trông thế nào từ bên ngoài'}</h3>
<p>${en
  ? 'While extracting <code>MuonTraService</code>, you notice <code>&gt;</code> where the rule says “at most 3 books”. It is bug TV-41, it is one character, you are right. Fix it in the same commit and run the net:'
  : 'Đang tách <code>MuonTraService</code>, bạn thấy dấu <code>&gt;</code> trong khi luật nói "tối đa 3 cuốn". Đó là bug TV-41, chỉ một ký tự, và bạn đúng. Sửa luôn trong cùng commit rồi chạy lưới:'}</p>
${O55_TRON}
<p>${en
  ? 'The two red tests are the <code>_BUG_TV41</code> tests — the net is telling you that behaviour changed, which here is exactly what you wanted. But now look at it from the reviewer’s side: a 300-line “refactor” commit with two edited test expectations. Are those the only behaviour changes? Did the move itself change anything? The reviewer cannot tell which red came from which intention, and has to re-read every line as if it could hide a change. Worse, if production shows a problem next week, reverting the commit also reverts the refactoring. Same bug, done properly, is its own branch:'
  : 'Hai test đỏ chính là hai test <code>_BUG_TV41</code> — lưới đang báo hành vi đã đổi, mà ở đây đó đúng là điều bạn muốn. Nhưng giờ nhìn từ phía người review: một commit "refactor" 300 dòng kèm hai kỳ vọng test bị sửa. Đó có phải là tất cả thay đổi hành vi không? Bản thân việc dời code có đổi gì không? Người review không biết vệt đỏ nào đến từ ý định nào, và phải đọc lại từng dòng như thể dòng nào cũng có thể giấu một thay đổi. Tệ hơn, nếu tuần sau production có vấn đề, revert commit đó là revert luôn cả đợt refactor. Cùng bug đó, làm đúng cách, là một nhánh riêng:'}</p>
${O55_TV41}
<p>${en
  ? 'Twelve lines, two files, one sentence of review: “the limit check is now <code>&gt;=</code>; the two tests that locked the old behaviour are renamed from <code>_BUG</code> and flipped”. This is also what the <code>_BUG</code> naming convention from Chapter 3 was for: when the fix comes, the diff of the test file <em>is</em> the specification of the change.'
  : 'Mười hai dòng, hai tệp, một câu review: "phép kiểm giới hạn giờ là <code>&gt;=</code>; hai test khoá hành vi cũ được bỏ hậu tố <code>_BUG</code> và đảo kỳ vọng". Đây cũng là lý do có quy ước đặt tên <code>_BUG</code> ở Chương 3: khi bản sửa tới, diff của tệp test <em>chính là</em> đặc tả của thay đổi.'}</p>

<h3>${en ? 'Preparatory refactoring: make the change easy, then make the easy change' : 'Refactor dọn đường: làm cho thay đổi trở nên dễ, rồi làm thay đổi dễ đó'}</h3>
<p>${en
  ? 'Kent Beck, 25 September 2012: <em>“for each desired change, make the change easy (warning: this may be hard), then make the easy change”</em>. Lesson 4.3 estimated ticket TV-95 (“add reader type NCS: 5 books, 21 days, 1,500 per day, no cap”) on the old code: nine places in six files across two repos plus a stored procedure, about 1.5 days. After lessons 5.1–5.4, here is the same ticket for real:'
  : 'Kent Beck, 25/9/2012: <em>"với mỗi thay đổi bạn muốn, hãy làm cho thay đổi đó trở nên dễ (cảnh báo: việc này có thể khó), rồi làm thay đổi dễ đó"</em>. Bài 4.3 đã ước lượng ticket TV-95 ("thêm loại độc giả NCS: 5 cuốn, 21 ngày, 1.500 đ một ngày, không trần") trên code cũ: chín chỗ trong sáu tệp ở hai repo cộng một stored procedure, khoảng 1,5 ngày. Sau bài 5.1–5.4, đây là cùng ticket đó làm thật:'}</p>
${O55_NCS}
<p>${en
  ? 'Six lines of Java (one enum constant, one mapping), one option in a JSP, one comment, one line in the Node table, and tests for each — about an hour including review. The compiler guaranteed that NCS has all three rules. What did <em>not</em> get easier is worth saying in the PR: <code>sp_overdue_report</code> still charges a flat 2,000 per day for everyone, so the report will show NCS fines wrong, exactly as it already does for GV and guests (lesson 4.3). Refactoring Java did not move knowledge out of SQL — that is a separate ticket with the DBA.'
  : 'Sáu dòng Java (một hằng enum, một dòng ánh xạ), một lựa chọn trong JSP, một comment, một dòng trong bảng Node, và test cho từng chỗ — khoảng một giờ kể cả review. Trình biên dịch bảo đảm NCS có đủ ba luật. Thứ <em>không</em> dễ hơn cũng đáng ghi vào PR: <code>sp_overdue_report</code> vẫn tính đồng giá 2.000 đ một ngày cho mọi người, nên báo cáo sẽ hiện phí NCS sai, y như nó đang sai cho GV và khách (bài 4.3). Refactor Java không kéo được tri thức ra khỏi SQL — đó là một ticket riêng với DBA.'}</p>
<div class="callout"><p>${en
  ? '<strong>How to sell refactoring to a PM:</strong> never as “cleaning”. As “TV-95 costs 1.5 days on today’s code, or 0.5 day of preparatory refactoring plus 1 hour — and the next reader type will cost 1 hour too”. Martin Fowler calls this the <em>economics</em> argument; it is the only one that survives a deadline.'
  : '<strong>Cách "bán" refactor cho PM:</strong> đừng bao giờ gọi là "dọn dẹp". Hãy nói "TV-95 trên code hiện tại mất 1,5 ngày, hoặc 0,5 ngày refactor dọn đường cộng 1 giờ — và loại độc giả kế tiếp cũng chỉ mất 1 giờ". Martin Fowler gọi đây là lập luận <em>kinh tế</em>; đó là lập luận duy nhất sống sót qua deadline.'}</p></div>

<h3>${en ? 'Preparing for a bug fix: the race, one function away' : 'Dọn đường cho một bản sửa lỗi: race chỉ còn cách một hàm'}</h3>
<p>${en
  ? 'Preparatory refactoring works for fixes too. Lesson 4.2 measured that two simultaneous borrow requests lose a loan (or corrupt the file). Before 5.3, the fix would have touched the route’s callback pyramid; now every read and write of loans goes through <code>lib/kho.js</code>, so the fix is “serialise read-modify-write inside the store”. First the red test — the behaviour change starts here, under the other hat:'
  : 'Refactor dọn đường cũng dùng cho bản sửa lỗi. Bài 4.2 đã đo: hai yêu cầu mượn đồng thời làm mất một phiếu (hoặc hỏng tệp). Trước 5.3, bản sửa sẽ phải đụng vào kim tự tháp callback của route; giờ mọi lần đọc và ghi phiếu đều đi qua <code>lib/kho.js</code>, nên bản sửa là "tuần tự hoá đọc-sửa-ghi bên trong kho". Trước hết là test đỏ — thay đổi hành vi bắt đầu từ đây, dưới chiếc mũ còn lại:'}</p>
${J55_DUA}
${O55_DUA}
<p>${en
  ? 'Both requests got loan 6. The test is not committed in this chapter, and the fix is not written here: it is ticket TV-98 “app says loan created but the librarian cannot see it” in the Chapter 8 lab, where you will write the minimal fix and the PR description. What this chapter delivered is the reason that fix will be ten lines in one file.'
  : 'Cả hai yêu cầu đều nhận phiếu số 6. Chương này không commit test đó, và không viết bản sửa ở đây: đó là ticket TV-98 "app báo tạo phiếu nhưng thủ thư không thấy" trong lab Chương 8, nơi bạn viết bản sửa tối thiểu và mô tả PR. Thứ chương này mang lại là lý do bản sửa đó sẽ chỉ mười dòng trong một tệp.'}</p>

<h3>${en ? 'The loop: run, commit on green, revert on red' : 'Vòng lặp: chạy, xanh thì commit, đỏ thì hoàn tác'}</h3>
<p>${en
  ? 'The fastest refactorers are not the ones who never break anything; they are the ones who lose at most five minutes when they do. In 2018 Kent Beck published an extreme version of the loop called <strong>TCR — test &amp;&amp; commit || revert</strong>: if the tests pass, commit automatically; if they fail, throw the change away. It sounds brutal; it forces steps small enough that losing one does not hurt. Try it on the Node repo:'
  : 'Người refactor nhanh nhất không phải người không bao giờ làm hỏng gì; mà là người mỗi lần làm hỏng chỉ mất tối đa năm phút. Năm 2018 Kent Beck công bố một phiên bản cực đoan của vòng lặp gọi là <strong>TCR — test &amp;&amp; commit || revert</strong>: test qua thì tự commit; test hỏng thì vứt thay đổi đi. Nghe thì phũ; nó ép bạn đi những bước đủ nhỏ để mất một bước không đau. Thử trên repo Node:'}</p>
${B55_TCR}
${O55_TCR}
<p>${en
  ? 'Look at the last line of the tool’s diff: the variable was renamed, but the JSON key <code>toiDa:</code> was not — because it is part of the API contract the mobile app reads, and the rename tool knows a property name from a variable. The hand edit lost 30 seconds; the tool edit was committed by itself. You do not have to use TCR every day; you do have to keep the reflex it trains: <em>if it went red and you do not know why within a minute, revert and take a smaller step</em>.'
  : 'Nhìn dòng cuối trong diff của công cụ: biến được đổi tên, còn khoá JSON <code>toiDa:</code> thì không — vì nó là một phần hợp đồng API mà ứng dụng mobile đọc, và công cụ đổi tên phân biệt được tên thuộc tính với tên biến. Lần sửa tay mất 30 giây; lần sửa bằng công cụ tự được commit. Bạn không bắt buộc dùng TCR hằng ngày; nhưng phải giữ phản xạ nó rèn: <em>đỏ mà một phút không biết vì sao thì hoàn tác và đi bước nhỏ hơn</em>.'}</p>
<p>${en
  ? 'Small green commits pay back later too: <code>git bisect run mvn -q test</code> can find the exact step that broke something, which is useless on a 300-line commit. Whether the team squashes them at merge is a project convention (Chapter 8) — locally, keep them small.'
  : 'Commit nhỏ và xanh còn trả lãi về sau: <code>git bisect run mvn -q test</code> tìm được đúng bước làm hỏng, việc vô ích với một commit 300 dòng. Đội có gộp (squash) chúng lúc merge hay không là quy ước dự án (Chương 8) — còn ở máy bạn, cứ giữ chúng nhỏ.'}</p>
${lk(bai('debug-co-phuong-phap', 'dbg-9-1-bisect-run'), '🐞', en ? 'Debugging course 9.1 — git bisect run with an automatic test script' : 'Khoá Debug 9.1 — git bisect run với script test tự động', en ? 'Why small commits make bisect work' : 'Vì sao commit nhỏ làm bisect có ích')}
${lk(bai('git', 'git-3-5-rebase-tuong-tac'), '🌿', en ? 'Git course 3.5 — Interactive rebase: editing your own history' : 'Khoá Git 3.5 — Rebase tương tác: sửa lịch sử của chính bạn', en ? 'Split a mixed commit before review' : 'Tách một commit trộn trước khi review')}

<h3>${en ? 'When NOT to refactor' : 'Khi nào KHÔNG nên refactor'}</h3>
<ul>
<li>${en ? '<strong>A production fire.</strong> Hotfix with the minimal change (Chapter 8), deploy, and schedule the refactoring as its own ticket.' : '<strong>Production đang cháy.</strong> Hotfix bằng thay đổi tối thiểu (Chương 8), deploy, rồi xếp refactor thành ticket riêng.'}</li>
<li>${en ? '<strong>Code that is about to be deleted</strong> — a module being replaced by strangler fig, a feature the customer is turning off.' : '<strong>Code sắp bị xoá</strong> — module đang được thay bằng strangler fig, tính năng khách sắp tắt.'}</li>
<li>${en ? '<strong>Code nobody changes.</strong> Hotspot score near zero (lesson 4.5): ugly but stable code costs nothing until a ticket arrives.' : '<strong>Code không ai đụng tới.</strong> Điểm nóng gần 0 (bài 4.5): code xấu mà ổn định không tốn gì cho tới khi có ticket.'}</li>
<li>${en ? '<strong>No net, and no way to build one this sprint.</strong> Then the honest move is a characterization test first, or a smaller scope — not a brave refactoring.' : '<strong>Không có lưới, và sprint này không dựng nổi.</strong> Khi đó việc trung thực là viết characterization test trước, hoặc thu hẹp phạm vi — không phải một đợt refactor liều.'}</li>
<li>${en ? '<strong>A release freeze</strong>, or the project’s rules say refactoring PRs need the customer’s approval. Follow the rules; bring the economics argument to the next planning.' : '<strong>Đang đóng băng phát hành</strong>, hoặc luật dự án yêu cầu PR refactor phải có khách duyệt. Theo luật; mang lập luận kinh tế tới buổi lập kế hoạch kế tiếp.'}</li>
</ul>
<p>${en
  ? 'For refactorings too big for one sitting, two techniques keep the rhythm: the <strong>Mikado Method</strong> (Ellnestam &amp; Brolund, Manning 2014 — try the goal, note what breaks, revert, solve the prerequisites first, as a graph) and Kent Beck’s <em>Tidy First?</em> (O’Reilly 2023 — tiny “tidyings” in their own commits before a behaviour change).'
  : 'Với đợt refactor quá lớn cho một lần ngồi, có hai kỹ thuật giữ được nhịp: <strong>Mikado Method</strong> (Ellnestam &amp; Brolund, Manning 2014 — thử đích, ghi lại cái gì vỡ, hoàn tác, giải các điều kiện tiên quyết trước, vẽ thành đồ thị) và cuốn <em>Tidy First?</em> của Kent Beck (O’Reilly 2023 — những lần "dọn" rất nhỏ, mỗi lần một commit riêng, trước một thay đổi hành vi).'}</p>

<h3>💼 ${en ? 'OJT situation — “split this 900-line PR”' : 'Tình huống OJT — "tách cái PR 900 dòng này ra"'}</h3>
<p>${en
  ? 'Your leader returns your PR: “refactor + TV-95 + two fixes, 900 lines, please split”. Recipe: (1) create <code>refactor/tv95-chuan-bi</code> from main and replay only the structural commits (<code>git cherry-pick</code> or interactive rebase) — tests must stay green with <em>no</em> test expectation changed; (2) <code>fix/tv41</code> from main with the one-character fix and its two flipped tests; (3) <code>feat/tv95</code> on top of (1). Three PRs: 600 lines that change nothing (fast review, verified by tests), 12 lines that fix a bug, 20 lines that add a feature. Total review time drops, not rises.'
  : 'Leader trả PR lại: "refactor + TV-95 + hai bản sửa lỗi, 900 dòng, tách giùm". Công thức: (1) tạo <code>refactor/tv95-chuan-bi</code> từ main và chỉ phát lại các commit cấu trúc (<code>git cherry-pick</code> hoặc rebase tương tác) — test phải xanh mà <em>không</em> sửa kỳ vọng test nào; (2) <code>fix/tv41</code> từ main với bản sửa một ký tự và hai test bị đảo; (3) <code>feat/tv95</code> nằm trên (1). Ba PR: 600 dòng không đổi gì (review nhanh, có test bảo chứng), 12 dòng sửa một bug, 20 dòng thêm một tính năng. Tổng thời gian review giảm chứ không tăng.'}</p>

<h3>🧪 ${en ? 'Practice (40 minutes)' : 'Thực hành (40 phút)'}</h3>
<div class="callout ok"><ol>
<li>${en ? 'Reproduce the mixed commit on a throw-away branch; read the two red tests; delete the branch. Then make <code>ch5-tv41</code> properly.' : 'Làm lại commit trộn trên nhánh bỏ đi; đọc hai test đỏ; xoá nhánh. Rồi làm <code>ch5-tv41</code> đúng cách.'}</li>
<li>${en ? 'Implement TV-95 on top of your refactored branch, in both repos. Record the time and compare with the 1.5-day estimate of lesson 4.3. Write the “not covered” line about <code>sp_overdue_report</code> in the PR description.' : 'Làm TV-95 trên nhánh đã refactor, ở cả hai repo. Ghi lại thời gian và so với ước lượng 1,5 ngày của bài 4.3. Viết dòng "chưa xử lý" về <code>sp_overdue_report</code> trong mô tả PR.'}</li>
<li>${en ? 'Use <code>tools/tcr.sh</code> for 20 minutes on <code>lib/so-phieu.js</code> (e.g. replace the <code>for</code> loops with <code>filter</code>/<code>find</code>). How many reverts? What size of step stopped producing reverts?' : 'Dùng <code>tools/tcr.sh</code> trong 20 phút trên <code>lib/so-phieu.js</code> (ví dụ thay vòng <code>for</code> bằng <code>filter</code>/<code>find</code>). Bị revert bao nhiêu lần? Bước cỡ nào thì hết bị revert?'}</li>
</ol>
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? 'three branches exist (refactor, fix, feature), the refactor branch changes no test expectation at the HTTP boundary, and each PR description says which hat it was written under.' : 'có ba nhánh (refactor, sửa lỗi, tính năng), nhánh refactor không đổi kỳ vọng test nào ở biên HTTP, và mô tả PR nào cũng nói rõ nó được viết dưới chiếc mũ nào.'}</p></div>

<h3>🗂 ${en ? 'Key terms' : 'Thuật ngữ trong bài'}</h3>
${thuatNgu(en, [
  ['Two hats', 'hai chiếc mũ', 'Mỗi lúc chỉ làm một trong hai: thêm chức năng hoặc refactor (Kent Beck).', 'At any moment do one of two things: add function or refactor (Kent Beck).'],
  ['Preparatory refactoring', 'refactor dọn đường', 'Refactor ngay trước một tính năng/bản sửa để nó trở nên dễ.', 'Refactoring right before a feature or fix so that it becomes easy.'],
  ['TCR', 'test && commit || revert', 'Test qua tự commit, hỏng tự hoàn tác — ép bước thật nhỏ (Beck 2018).', 'Pass ⇒ auto-commit, fail ⇒ auto-revert — forces tiny steps (Beck 2018).'],
  ['Mikado Method', 'phương pháp Mikado', 'Thử đích, ghi điều kiện tiên quyết thành đồ thị, hoàn tác, làm từ lá lên gốc.', 'Try the goal, record prerequisites as a graph, revert, work from the leaves up.'],
  ['Mixed commit', 'commit trộn', 'Một commit vừa đổi cấu trúc vừa đổi hành vi — khó review, khó revert.', 'A commit that changes both structure and behaviour — hard to review and to revert.'],
])}
`
);

/* ═══════════════════ 5.6 — Lab ═══════════════════ */
const O56_JAVA = out(`
$ for c in $(git rev-list --reverse ch4..ch5); do git checkout -q $c; mvn -B -o test; done      # 18 commit, từng cái một
143d106 seam: bayGio() + characterization tra sach Tests run: 21, Failures: 0, Errors: 0, Skipped: 0 BUILD SUCCESS
d4a57a0 refactor(5.1): Slide Statements — st/ps/rs ve tung nhanh cua doPost Tests run: 21, Failures: 0, Errors: 0, Skipped: 0 BUILD SUCCESS
2fddcbf refactor(5.1): Extract Function — muonSach/traSach/themSach/xoaSach Tests run: 21, Failures: 0, Errors: 0, Skipped: 0 BUILD SUCCESS
0a1ce92 refactor(5.1): Rename Variable — loai/toiDa/phi/soNgayTre/hanTra Tests run: 21, Failures: 0, Errors: 0, Skipped: 0 BUILD SUCCESS
5095466 refactor(5.1): Replace Magic Literal MS_MOT_NGAY + Split Variable rs Tests run: 21, Failures: 0, Errors: 0, Skipped: 0 BUILD SUCCESS
dee56bc test(5.2): characterization dang nhap bang cookie (7 test, khong can CSDL) Tests run: 28, Failures: 0, Errors: 0, Skipped: 0 BUILD SUCCESS
ffe54cb refactor(5.2): Extract Function nguoiDungTuCookie + Replace Nested Conditional Tests run: 28, Failures: 0, Errors: 0, Skipped: 0 BUILD SUCCESS
3fd2a6f refactor(5.2): Extract Function toiDa/soNgayMuon/phiTre — gom 3 chuoi if the Tests run: 28, Failures: 0, Errors: 0, Skipped: 0 BUILD SUCCESS
83e3920 refactor(5.2): Replace Conditional with Polymorphism — enum LoaiDocGia, ham Tests run: 31, Failures: 0, Errors: 0, Skipped: 0 BUILD SUCCESS
0a28b51 refactor(5.2): Inline Function toiDa/soNgayMuon/phiTre — goi thang LoaiDocGi Tests run: 31, Failures: 0, Errors: 0, Skipped: 0 BUILD SUCCESS
66506c5 refactor(5.3): Extract Class PhieuMuonDAO — SQL nhanh muon (giu nguyen cau S Tests run: 31, Failures: 0, Errors: 0, Skipped: 0 BUILD SUCCESS
7ff0a21 refactor(5.3): Move Function — SQL nhanh tra sang PhieuMuonDAO Tests run: 31, Failures: 0, Errors: 0, Skipped: 0 BUILD SUCCESS
87a9387 refactor(5.3): Introduce Parameter Object KhoangMuon (ngayMuon + hanTra) Tests run: 31, Failures: 0, Errors: 0, Skipped: 0 BUILD SUCCESS
6563f5b refactor(5.3): Move Function soNgayTre/phiTre vao PhieuCanTra (het Feature Env Tests run: 31, Failures: 0, Errors: 0, Skipped: 0 BUILD SUCCESS
a1a8337 refactor(5.3): Extract Class MuonTraService — servlet chi con doc tham so + Tests run: 31, Failures: 0, Errors: 0, Skipped: 0 BUILD SUCCESS
e4985d0 test(5.3): test don vi MuonTraService voi DAO gia (khong can MySQL) Tests run: 33, Failures: 0, Errors: 0, Skipped: 0 BUILD SUCCESS
5afc327 refactor(5.3): Move Statements — SQL dem qua han tu header.jsp sang ThongKeD Tests run: 33, Failures: 0, Errors: 0, Skipped: 0 BUILD SUCCESS
4dee184 refactor(5.4): Replace Primitive with Object — Tien thay double cho phi tre Tests run: 33, Failures: 0, Errors: 0, Skipped: 0 BUILD SUCCESS
`);
const O56_JS = out(`
$ for c in $(git rev-list --reverse df6b894..ch5); do git checkout -q $c; npx jest --runInBand; done      # 11 commit
98ec33f test: characterization POST /api/muon (8 test) + jest --runInBand vi tes Tests: 16 passed, 16 total
ea20eab refactor(5.1): Extract Function demDangMuon (TS language service) Tests: 16 passed, 16 total
283985f refactor(5.1): Rename Variable dg -> docGia (F2) Tests: 16 passed, 16 total
39c4f8a refactor(5.1): tach truy van khoi return (Separate Query) — chuan bi E Tests: 16 passed, 16 total
a4831f7 refactor(5.1): Extract Function timPhieuQuaHan Tests: 16 passed, 16 total
ec26c6e refactor(5.1): Change Function Declaration — bo tham so chet loai cua Tests: 16 passed, 16 total
bee54a3 refactor(5.2): bang luat lib/luat.js + test don vi (chua ai dung) Tests: 19 passed, 19 total
ddfee8b refactor(5.2): tinhPhi tra bang luat thay chuoi if Tests: 19 passed, 19 total
e71f804 refactor(5.2): route muon tra bang luat (toiDa, soNgayMuon, chanKhiQuaHa Tests: 19 passed, 19 total
9e9d8da refactor(5.3): Move Function — ghi tep phieu tu route vao kho.ghi Tests: 19 passed, 19 total
ea68fc0 refactor(5.4): Encapsulate Collection + Combine Functions into Class — Tests: 21 passed, 21 total
`);
const O56_PMD = out(`
$ mvn -B -o pmd:check          # cùng bộ luật tools/smell-pmd.xml của Chương 4 (khi đó: 12 vi phạm)
com.thuvien.model.Book:3 Rule:DataClass The class 'Book' is suspected to be a Data Class (WOC=0.000%, NOPA=0, NOAM=12, WMC=12).
com.thuvien.model.Loan:5 Rule:DataClass The class 'Loan' is suspected to be a Data Class (WOC=0.000%, NOPA=9, NOAM=0, WMC=0).
com.thuvien.model.Reader:3 Rule:DataClass The class 'Reader' is suspected to be a Data Class (WOC=0.000%, NOPA=0, NOAM=8, WMC=8).
com.thuvien.service.MuonTraService:39 Rule:AvoidDuplicateLiterals The String literal "books" appears 4 times in this file; the first occurrence is on line 39.
com.thuvien.servlet.BookServlet:36 Rule:AvoidDuplicateLiterals The String literal "UTF-8" appears 4 times in this file; the first occurrence is on line 36.
com.thuvien.servlet.LoginServlet:22 Rule:AvoidDuplicateLiterals The String literal "remember" appears 4 times in this file; the first occurrence is on line 22.
com.thuvien.servlet.LoginServlet:51 Rule:AvoidDuplicateLiterals The String literal "username" appears 4 times in this file; the first occurrence is on line 51.
com.thuvien.util.Constants:3 Rule:DataClass The class 'Constants' is suspected to be a Data Class (WOC=0.000%, NOPA=4, NOAM=0, WMC=0).
PMD 7.7.0 has found 8 violations.
`);
const O56_SO = out(`
                               Chương 4 (trước)        Chương 5 (sau)
PMD smell-pmd.xml              12 vi phạm              8 vi phạm (hết NcssCount/Cyclomatic/Cognitive/DeeplyNested)
doPost  cyclomatic/cognitive   20 / 36                 7 / 7   (hàm khó nhất cả repo: nguoiDungTuCookie 6 / 8)
BookServlet                    193 dòng                144 dòng + service 54 + DAO 133 + model 3 lớp
Chỗ phải sửa cho TV-95         9 chỗ / 6 tệp (ước)     4 tệp mã chạy (đã làm, 18+3 dòng Java, 3+1 dòng Node)
Test Java                      21 (3,3 s)              33 (12 test mới không cần MySQL)
ESLint (cấu hình 4.4)          36 cảnh báo             16 cảnh báo (muon.js 20 → 4, phi.js 7 → 0)
Test Jest                      8                       21
Golden master 3 trang HTML     —                       diff -r rỗng
`);

const L56 = ml((en) => `
<span class="eyebrow">${en ? 'Chapter 5 · Lab' : 'Chương 5 · Lab'}</span>
<h2>${en ? '5.6 — Lab: Refactor the borrow/return module from God Servlet to layered code' : '5.6 — Lab: Refactor module mượn/trả từ God Servlet thành code phân tầng'}</h2>
<p class="lead">${en
  ? 'Ticket LIB-105, assigned to you: “Before the NCS feature (TV-95) and the mobile race fix (TV-98), restructure borrow/return so that both become small changes. No behaviour change. Every commit must pass CI.” This is the full refactoring of lessons 5.1–5.4, done by you on your copy, with the Chapter 3 net as the referee.'
  : 'Ticket LIB-105, giao cho bạn: "Trước tính năng NCS (TV-95) và bản sửa race của app mobile (TV-98), tái cấu trúc phần mượn/trả để cả hai thành thay đổi nhỏ. Không đổi hành vi. Commit nào cũng phải qua CI." Đây là toàn bộ đợt refactor của bài 5.1–5.4, do chính bạn làm trên bản của mình, với tấm lưới Chương 3 làm trọng tài.'}</p>
${moiTruong(en)}

<h3>${en ? 'Rules' : 'Luật chơi'}</h3>
<ol>
<li>${en ? 'Start from your Chapter 4 state (Chapter 3 tests + PMD config). First commit: bring the <code>bayGio()</code> seam and the 5 return tests onto the branch.' : 'Bắt đầu từ trạng thái Chương 4 của bạn (test Chương 3 + cấu hình PMD). Commit đầu: đưa seam <code>bayGio()</code> và 5 test trả sách vào nhánh.'}</li>
<li>${en ? 'Use the IDE’s automated refactorings whenever one exists (Rename, Extract, Inline, Change Signature, Move). Manual steps are allowed only when the tool refuses — write “(tay)” / “(manual)” in the commit message.' : 'Dùng refactor tự động của IDE mỗi khi có (Rename, Extract, Inline, Change Signature, Move). Chỉ sửa tay khi công cụ từ chối — ghi "(tay)" trong lời commit.'}</li>
<li>${en ? 'Each commit: one Fowler refactoring (or one characterization test), name in the message, <code>mvn -B test</code> / <code>npm test</code> green <em>before</em> committing.' : 'Mỗi commit: một phép refactor Fowler (hoặc một characterization test), tên phép trong lời commit, <code>mvn -B test</code> / <code>npm test</code> xanh <em>trước</em> khi commit.'}</li>
<li>${en ? 'No test expectation at the HTTP boundary may change. Internal unit tests you wrote yourself may follow a type change.' : 'Không kỳ vọng test nào ở biên HTTP được đổi. Test đơn vị bên trong do chính bạn viết được phép đi theo một lần đổi kiểu.'}</li>
<li>${en ? 'Known bugs stay (TV-41 <code>&gt;</code>, SQL concatenation, <code>Math.ceil</code>, <code>==</code>, the race, the mojibake menu, “18000.0”). List them in the PR as “preserved on purpose”.' : 'Bug đã biết giữ nguyên (TV-41 <code>&gt;</code>, SQL nối chuỗi, <code>Math.ceil</code>, <code>==</code>, race, menu lỗi font, "18000.0"). Liệt kê chúng trong PR là "cố ý giữ".'}</li>
</ol>

<h3>${en ? 'Target structure' : 'Cấu trúc đích'}</h3>
<table>
<tr><th>${en ? 'Class / file' : 'Lớp / tệp'}</th><th>${en ? 'Responsibility' : 'Trách nhiệm'}</th><th>${en ? 'Comes from lesson' : 'Từ bài'}</th></tr>
<tr><td><code>BookServlet</code></td><td>${en ? 'read parameters, call the service, redirect, log' : 'đọc tham số, gọi service, redirect, ghi log'}</td><td>5.1, 5.3</td></tr>
<tr><td><code>service/MuonTraService</code></td><td>${en ? 'borrow and return rules; returns KetQua' : 'luật mượn và trả; trả về KetQua'}</td><td>5.3</td></tr>
<tr><td><code>dao/PhieuMuonDAO</code>, <code>dao/ThongKeDAO</code></td><td>${en ? 'all SQL of borrow/return and of the header' : 'toàn bộ SQL của mượn/trả và của header'}</td><td>5.3</td></tr>
<tr><td><code>model/LoaiDocGia</code>, <code>KhoangMuon</code>, <code>Tien</code></td><td>${en ? 'rules per reader type; loan period; money' : 'luật theo loại độc giả; khoảng mượn; tiền'}</td><td>5.2, 5.3, 5.4</td></tr>
<tr><td><code>lib/luat.js</code>, <code>lib/so-phieu.js</code>, <code>kho.ghi</code></td><td>${en ? 'Node: rule table, loan book, the only writer of data files' : 'Node: bảng luật, sổ phiếu, nơi duy nhất ghi tệp dữ liệu'}</td><td>5.2, 5.3, 5.4</td></tr>
</table>

<h3>${en ? 'Steps' : 'Các bước'}</h3>
<ol>
<li>${en ? '<strong>Baseline (10 min).</strong> Record: <code>mvn -B test</code> count and time, PMD (<code>pmd:check</code>, <code>tools/do-phuc-tap.xml</code>), ESLint count, golden master of the 3 pages. Save them in <code>docs/lib-105-truoc.txt</code>.' : '<strong>Mốc ban đầu (10 phút).</strong> Ghi lại: số test và thời gian của <code>mvn -B test</code>, PMD (<code>pmd:check</code>, <code>tools/do-phuc-tap.xml</code>), số cảnh báo ESLint, golden master 3 trang. Lưu vào <code>docs/lib-105-truoc.txt</code>.'}</li>
<li>${en ? '<strong>Java, lessons 5.1–5.4 (2.5 h).</strong> At least 15 commits. Suggested order: Slide Statements → Extract ×4 → Rename → Magic Literal/Split Variable → cookie tests → Guard Clauses → gather switches → enum → inline → DAO (2 commits) → Parameter Object → Move Function → Service → service unit test → header.jsp (+ golden) → Tien.' : '<strong>Java, bài 5.1–5.4 (2,5 giờ).</strong> Ít nhất 15 commit. Thứ tự gợi ý: Slide Statements → Extract ×4 → Rename → Magic Literal/Split Variable → test cookie → Guard Clauses → gom switch → enum → inline → DAO (2 commit) → Parameter Object → Move Function → Service → test đơn vị service → header.jsp (+ golden) → Tien.'}</li>
<li>${en ? '<strong>Node (1 h).</strong> At least 8 commits: characterization tests for <code>/api/muon</code> → Extract/Rename with VS Code → separate query → remove dead parameter → <code>lib/luat.js</code> (3 commits) → <code>kho.ghi</code> → <code>SoPhieu</code>.' : '<strong>Node (1 giờ).</strong> Ít nhất 8 commit: characterization test cho <code>/api/muon</code> → Extract/Rename bằng VS Code → tách truy vấn → bỏ tham số chết → <code>lib/luat.js</code> (3 commit) → <code>kho.ghi</code> → <code>SoPhieu</code>.'}</li>
<li>${en ? '<strong>Prove every commit (15 min).</strong> Run the whole suite on each commit, not only on the last one:' : '<strong>Chứng minh từng commit (15 phút).</strong> Chạy cả bộ test trên từng commit, không chỉ commit cuối:'}</li>
</ol>
${bash(`
# Java — dừng ở commit đầu tiên bị đỏ
for c in $(git rev-list --reverse ch4..HEAD); do
  git checkout -q $c && mvn -B -o -q test > /dev/null 2>&1 && echo "xanh $(git log -1 --format='%h %s')" || { echo "ĐỎ  $c"; break; }
done; git checkout -q -
# Node
for c in $(git rev-list --reverse df6b894..HEAD); do git checkout -q $c && npx jest --runInBand --silent > /dev/null 2>&1 && echo "xanh $c" || { echo "ĐỎ $c"; break; }; done; git checkout -q -
`)}
<ol start="5">
<li>${en ? '<strong>Measure again (10 min)</strong> with the same commands as step 1, and write the before/after table into the PR description.' : '<strong>Đo lại (10 phút)</strong> bằng đúng các lệnh ở bước 1, và ghi bảng trước/sau vào mô tả PR.'}</li>
<li>${en ? '<strong>Cash in (30 min).</strong> On top of your branch, implement TV-95 in both repos and record how long it took.' : '<strong>Thu hoạch (30 phút).</strong> Trên nhánh của bạn, làm TV-95 ở cả hai repo và ghi lại mất bao lâu.'}</li>
</ol>

<h3>${en ? 'Reference result (run on the lab machine)' : 'Kết quả tham chiếu (chạy trên máy lab)'}</h3>
${giai(en ? 'Show: every Java commit, green' : 'Xem: từng commit Java, đều xanh', O56_JAVA)}
${giai(en ? 'Show: every Node commit, green' : 'Xem: từng commit Node, đều xanh', O56_JS)}
${giai(en ? 'Show: PMD after the chapter' : 'Xem: PMD sau chương', O56_PMD + `<p>${en
  ? 'Read it like a reviewer. Gone: everything about long and complex methods. Still there: Data Class on the old models (Chapter 4 said: not every finding needs a refactor) and duplicated literals. <strong>New</strong>: <code>"books"</code> four times in <code>MuonTraService</code> — the refactoring itself introduced a smell; a constant <code>TRANG_SACH</code> fixes it in one more commit. Tools are useful exactly because they also judge your own work.'
  : 'Đọc như người review. Đã hết: mọi thứ về hàm dài và phức tạp. Vẫn còn: Data Class ở các model cũ (Chương 4 đã nói: không phải phát hiện nào cũng cần refactor) và literal lặp. <strong>Mới</strong>: <code>"books"</code> bốn lần trong <code>MuonTraService</code> — chính đợt refactor đã sinh ra một smell; hằng <code>TRANG_SACH</code> chữa nó bằng một commit nữa. Công cụ hữu ích chính vì nó cũng chấm cả bài của bạn.'}</p>`)}
${O56_SO}
${giai(en ? 'Show the reference solution files' : 'Xem tệp lời giải tham chiếu', `<p>${en
  ? '<code>lab/loi-giai/ch5/</code>: one <code>.patch</code> per commit (<code>git format-patch</code>) — <code>legacy-thu-vien/ch5/</code> (18), <code>legacy-thu-vien/ch5-tv41/</code>, <code>legacy-thu-vien/ch5-ncs/</code>, <code>legacy-express/ch5/</code> (11), <code>legacy-express/ch5-ncs/</code> — plus <code>tools/ts-sua.mjs</code>, <code>tools/tcr.sh</code>, <code>tools/phuc-tap.py</code>. Apply with <code>git am</code>. Compare with your own commits <em>after</em> you finish: different order and names are fine if every commit is green and single-purpose.'
  : '<code>lab/loi-giai/ch5/</code>: mỗi commit một tệp <code>.patch</code> (<code>git format-patch</code>) — <code>legacy-thu-vien/ch5/</code> (18), <code>legacy-thu-vien/ch5-tv41/</code>, <code>legacy-thu-vien/ch5-ncs/</code>, <code>legacy-express/ch5/</code> (11), <code>legacy-express/ch5-ncs/</code> — cộng <code>tools/ts-sua.mjs</code>, <code>tools/tcr.sh</code>, <code>tools/phuc-tap.py</code>. Áp bằng <code>git am</code>. So với commit của bạn <em>sau khi</em> làm xong: thứ tự và tên khác cũng được, miễn commit nào cũng xanh và chỉ làm một việc.'}</p>`)}

<h3>${en ? 'Rubric (10 points)' : 'Thang chấm (10 điểm)'}</h3>
<table>
<tr><th>${en ? 'Criterion' : 'Tiêu chí'}</th><th>${en ? 'Points' : 'Điểm'}</th></tr>
<tr><td>${en ? 'Every commit green on its own (loop output attached)' : 'Commit nào cũng xanh khi đứng riêng (kèm output vòng lặp)'}</td><td>3</td></tr>
<tr><td>${en ? '≥ 15 Java + ≥ 8 Node commits, one named refactoring each' : '≥ 15 commit Java + ≥ 8 commit Node, mỗi commit một phép có tên'}</td><td>2</td></tr>
<tr><td>${en ? 'No boundary test expectation changed; golden master identical' : 'Không đổi kỳ vọng test ở biên; golden master giống hệt'}</td><td>2</td></tr>
<tr><td>${en ? 'Before/after table with real numbers (tests, PMD, ESLint, complexity)' : 'Bảng trước/sau có số thật (test, PMD, ESLint, độ phức tạp)'}</td><td>1</td></tr>
<tr><td>${en ? 'PR lists bugs preserved on purpose, with ticket ids' : 'PR liệt kê các bug cố ý giữ, kèm mã ticket'}</td><td>1</td></tr>
<tr><td>${en ? 'TV-95 done on top, time recorded' : 'Làm TV-95 bên trên, có ghi thời gian'}</td><td>1</td></tr>
</table>
<p><strong>${en ? 'Extra challenge:' : 'Thử thách thêm:'}</strong> ${en
  ? '(1) Replace the if-chain on <code>action</code> in <code>doPost</code> with a <code>Map&lt;String, HanhDong&gt;</code> — same messages for unknown actions. (2) Run PIT (lesson 3.5) on <code>MuonTraService</code> and <code>LoaiDocGia</code>: is the mutation score higher than on the old servlet? Why?'
  : '(1) Thay chuỗi if theo <code>action</code> trong <code>doPost</code> bằng <code>Map&lt;String, HanhDong&gt;</code> — thông báo cho action lạ phải y như cũ. (2) Chạy PIT (bài 3.5) trên <code>MuonTraService</code> và <code>LoaiDocGia</code>: điểm đột biến có cao hơn trên servlet cũ không? Vì sao?'}</p>

<h3>🎤 ${en ? 'What the interviewer will ask' : 'Phỏng vấn viên sẽ hỏi'}</h3>
<ol>
<li><strong>${en ? '“What is the difference between refactoring and rewriting?”' : '"Refactor khác viết lại ở đâu?"'}</strong><br>${en
  ? 'Refactoring is a sequence of small behaviour-preserving steps, each verified by tests, so the system works after every step. Rewriting replaces the code and re-implements behaviour — usually changing it, and you only know if it works at the end. Example with numbers: 18 commits, 33 tests green after each, golden master identical.'
  : 'Refactor là chuỗi bước nhỏ giữ nguyên hành vi, bước nào cũng được test kiểm, nên hệ thống chạy được sau từng bước. Viết lại là thay code và cài lại hành vi — thường là đổi nó, và tới cuối mới biết có chạy không. Ví dụ có số: 18 commit, 33 test xanh sau từng commit, golden master giống hệt.'}</li>
<li><strong>${en ? '“How do you refactor code with no tests?”' : '"Refactor code không có test thế nào?"'}</strong><br>${en
  ? 'I don’t — first I write characterization tests that lock current behaviour, including bugs (the cookie login: 7 tests, two of them locking bugs). If the code cannot be tested, I make the smallest seam with a safe automated refactoring, then test, then refactor.'
  : 'Em không refactor ngay — trước tiên em viết characterization test khoá hành vi hiện tại, kể cả bug (đăng nhập bằng cookie: 7 test, hai test khoá bug). Nếu code không test được, em tạo seam nhỏ nhất bằng một phép refactor tự động an toàn, rồi test, rồi mới refactor.'}</li>
<li><strong>${en ? '“Give an example of a code smell and the refactoring you used.”' : '"Kể một code smell và phép refactor em đã dùng."'}</strong><br>${en
  ? 'Repeated Switches on reader type in three places ⇒ Extract Function to put them side by side ⇒ Replace Conditional with Polymorphism (an enum with abstract methods) ⇒ Inline the helpers. Adding a reader type went from nine places to one enum constant.'
  : 'Repeated Switches theo loại độc giả ở ba chỗ ⇒ Extract Function để đặt chúng cạnh nhau ⇒ Replace Conditional with Polymorphism (enum có hàm trừu tượng) ⇒ Inline các hàm phụ. Thêm một loại độc giả từ chín chỗ còn một hằng enum.'}</li>
<li><strong>${en ? '“You found a bug while refactoring. What do you do?”' : '"Đang refactor thì thấy bug. Em làm gì?"'}</strong><br>${en
  ? 'Note it, make sure a test locks the current behaviour, finish the refactoring, then fix it in a separate commit/PR where the flipped test is the specification. Mixing them makes both harder to review and to revert.'
  : 'Ghi lại, bảo đảm có test khoá hành vi hiện tại, làm xong đợt refactor, rồi sửa ở commit/PR riêng, nơi test bị đảo chính là đặc tả. Trộn lẫn làm cả hai khó review và khó revert.'}</li>
<li><strong>${en ? '“How do you justify refactoring time to a manager?”' : '"Em thuyết phục quản lý cho thời gian refactor thế nào?"'}</strong><br>${en
  ? 'With the cost of the next ticket: “TV-95 is 1.5 days on today’s code, or half a day of preparatory refactoring plus an hour — and every later reader type is an hour.” Never as cleanliness.'
  : 'Bằng chi phí của ticket kế tiếp: "TV-95 trên code hiện tại mất 1,5 ngày, hoặc nửa ngày refactor dọn đường cộng một giờ — và mỗi loại độc giả sau này chỉ một giờ." Không bao giờ bằng chuyện sạch đẹp.'}</li>
</ol>

<h3>💼 ${en ? 'OJT situation' : 'Tình huống OJT'}</h3>
<p>${en
  ? 'On many outsourcing projects, a refactoring like LIB-105 is the first “real” task a trusted intern gets after two or three bug fixes — because it is low-risk when done this way and very visible when done well. The deliverable the leader actually reads is the PR description: the before/after table, the loop output proving every commit green, and the list of preserved bugs with ticket ids. Keep yours; Chapter 8 turns it into a template.'
  : 'Ở nhiều dự án outsourcing, một đợt refactor như LIB-105 là việc "thật" đầu tiên được giao cho một bạn thực tập đã được tin tưởng sau hai, ba lần sửa lỗi — vì làm theo cách này thì rủi ro thấp, còn làm tốt thì ai cũng thấy. Thứ leader thật sự đọc là mô tả PR: bảng trước/sau, output vòng lặp chứng minh commit nào cũng xanh, và danh sách bug cố ý giữ kèm mã ticket. Giữ lại bản của bạn; Chương 8 biến nó thành mẫu.'}</p>
<p>${en
  ? '🛠 <strong>Capstone milestone:</strong> the Chapter 9 sprint includes “refactor one module”. Your LIB-105 branch and its PR description are the model answer you will compare against.'
  : '🛠 <strong>Mốc dự án cuối khoá:</strong> sprint Chương 9 có mục "refactor một module". Nhánh LIB-105 và mô tả PR của bạn là đáp án mẫu để bạn so.'}</p>

<h3>🗂 ${en ? 'Key terms' : 'Thuật ngữ trong bài'}</h3>
${thuatNgu(en, [
  ['Layered code', 'code phân tầng', 'Mỗi tầng một trách nhiệm (controller / service / DAO), phụ thuộc đi một chiều.', 'One responsibility per layer (controller / service / DAO), dependencies in one direction.'],
  ['Behaviour-preserving', 'giữ nguyên hành vi', 'Test ở biên không đổi kỳ vọng mà vẫn xanh sau mỗi bước.', 'Boundary tests pass after every step with unchanged expectations.'],
  ['Preserved bug', 'bug cố ý giữ', 'Bug đã biết, khoá bằng test _BUG, để sửa ở PR riêng.', 'A known bug locked by a _BUG test, fixed in its own PR.'],
  ['git format-patch / git am', 'xuất / áp bản vá', 'Xuất từng commit thành tệp .patch / áp lại đúng chuỗi commit đó.', 'Export commits as .patch files / replay them as the same commits.'],
])}

<h3>📌 ${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'Refactoring = many small steps, each named, each verified, each committed.' : 'Refactor = nhiều bước nhỏ, bước nào cũng có tên, có kiểm, có commit.'}</li>
<li>${en ? 'Prepare a step when the tool refuses (Slide Statements, separate query) instead of forcing it.' : 'Khi công cụ từ chối thì chuẩn bị một bước (Slide Statements, tách truy vấn), đừng ép.'}</li>
<li>${en ? 'Tests catch what reviewers miss: a nicer toString() was a behaviour change.' : 'Test bắt được thứ người review bỏ sót: một toString() đẹp hơn là một thay đổi hành vi.'}</li>
<li>${en ? 'One hat per commit; bugs found while refactoring get their own PR.' : 'Mỗi commit một chiếc mũ; bug thấy khi refactor có PR riêng.'}</li>
<li>${en ? 'Next chapter: dead code, old dependencies, and the security debt this chapter deliberately left alone.' : 'Chương sau: code chết, thư viện cũ, và món nợ bảo mật mà chương này cố ý chưa đụng.'}</li>
</ul>
${lk(bai('testing', 'tst-10-1-tdd'), '🧪', en ? 'Testing 10.1 — TDD in practice: red, green, refactor' : 'Testing 10.1 — TDD thực hành: đỏ, xanh, refactor', en ? 'The same rhythm, starting from new code' : 'Cùng nhịp đó, bắt đầu từ code mới')}
`
);

/* ═══════════════════ 5.7 — Quiz ═══════════════════ */
/** Dời đáp án đúng sang vị trí khác để các câu không dồn về cùng một chữ cái. */
const dat = (q, viTri) => { const o = [...q.options]; const [d] = o.splice(q.correctIndex, 1); o.splice(viTri, 0, d); return { ...q, options: o, correctIndex: viTri }; };

const QUIZ5_GOC = [
  Q('Which change is a refactoring in Fowler’s sense?|||Thay đổi nào là refactor theo nghĩa của Fowler?', [
    'Replacing > with >= because the rule says “at most 3 books”|||Đổi > thành >= vì luật nói "tối đa 3 cuốn"',
    'Reformatting the whole file with the IDE formatter|||Định dạng lại cả tệp bằng formatter của IDE',
    'Moving the fine calculation into PhieuCanTra; all 33 tests pass with unchanged expectations|||Chuyển phép tính phí vào PhieuCanTra; cả 33 test vẫn qua mà không đổi kỳ vọng',
    'Rewriting BookServlet in Spring Boot|||Viết lại BookServlet bằng Spring Boot',
  ], 2, 'EN: Structure changes, observable behaviour does not. The first is a behaviour change (two _BUG tests go red), the second changes nothing a reader struggles with, the last is a rewrite.|||VI: Cấu trúc đổi, hành vi quan sát được không đổi. Cái đầu là đổi hành vi (hai test _BUG đỏ), cái thứ hai không đụng tới chỗ người đọc thấy khó, cái cuối là viết lại.'),
  Q('Selecting the “borrow” branch and pressing Extract Method produced muonSach(con, st, rs, ps, readerId, bookId, response). What should have come first?|||Bôi đen nhánh "borrow" rồi Extract Method ra muonSach(con, st, rs, ps, readerId, bookId, response). Lẽ ra phải làm gì trước?', [
    'Slide Statements: declare st/rs/ps inside the branch and close them there|||Slide Statements: khai báo st/rs/ps bên trong nhánh và đóng chúng ở đó',
    'Introduce Parameter Object for the 7 parameters|||Introduce Parameter Object cho 7 tham số',
    'Inline Function on doPost|||Inline Function cho doPost',
    'Nothing — 7 parameters is acceptable for a servlet|||Không gì cả — 7 tham số là chấp nhận được với servlet',
  ], 0, 'EN: The variables were declared at the top and closed in the outer finally, so the tool had to pass them in. Move declarations to their use first; then only request/response/con are needed.|||VI: Các biến được khai báo ở đầu và đóng ở finally ngoài, nên công cụ buộc phải truyền vào. Dời khai báo về chỗ dùng trước; khi đó chỉ cần request/response/con.'),
  Q('A Find/Replace of “type” → “loai” in traSach turned 5 tests red with NullPointerException. What was the real cause?|||Find/Replace "type" → "loai" trong traSach làm 5 test đỏ với NullPointerException. Nguyên nhân thật là gì?', [
    'Mockito cannot mock HttpServletResponse|||Mockito không mock được HttpServletResponse',
    'The SQL string r.type became r.loai ⇒ “Unknown column”; the error page then hit an unstubbed getWriter()|||Chuỗi SQL r.type thành r.loai ⇒ "Unknown column"; rồi trang lỗi gọi getWriter() chưa được giả lập',
    'The variable name loai is reserved in Java|||Tên biến loai là từ khoá của Java',
    'The test fixture was not reloaded|||Dữ liệu test không được nạp lại',
  ], 1, 'EN: Text replacement touches strings; Rename works on symbols. And read the log before the code: the first error was the SQL one.|||VI: Thay chữ đụng cả vào chuỗi; Rename làm trên ký hiệu. Và đọc log trước khi đọc code: lỗi đầu tiên là lỗi SQL.'),
  Q('VS Code refuses to extract the overdue loop: “Cannot extract range containing conditional return statement.” Best next step?|||VS Code từ chối tách vòng lặp quá hạn: "Cannot extract range containing conditional return statement." Bước tiếp theo tốt nhất?', [
    'Copy the loop into a new function by hand, keeping the return|||Chép tay vòng lặp sang hàm mới, giữ nguyên return',
    'Disable the TypeScript check for the file|||Tắt kiểm tra TypeScript cho tệp',
    'Separate the query (find the overdue loan) from the decision (send 409), run tests, commit, then extract|||Tách truy vấn (tìm phiếu quá hạn) khỏi quyết định (trả 409), chạy test, commit, rồi mới tách hàm',
    'Convert the route to async/await first|||Đổi route sang async/await trước',
  ], 2, 'EN: The refusal names the smell: searching and answering HTTP in one place. A manual preparatory step makes the automated one possible.|||VI: Lời từ chối gọi đúng tên smell: vừa tìm kiếm vừa trả lời HTTP ở cùng chỗ. Một bước tay dọn đường giúp bước tự động làm được.'),
  Q('Why were 7 characterization tests written before turning LoginServlet’s nested ifs into guard clauses?|||Vì sao viết 7 characterization test trước khi đổi if lồng của LoginServlet thành guard clause?', [
    'PMD requires tests before it accepts the change|||PMD đòi có test mới chấp nhận thay đổi',
    'It is authentication code with no test; the tests also revealed two bugs (trailing garbage accepted, “admin:” ⇒ 500) that the refactoring must not change|||Đó là code xác thực chưa có test; test còn lộ ra hai bug (rác phía sau vẫn được nhận, "admin:" ⇒ 500) mà phép refactor không được đổi',
    'Guard clauses change behaviour, so tests are needed to document the new one|||Guard clause đổi hành vi nên cần test để ghi lại hành vi mới',
    'To raise coverage above 80%|||Để nâng độ phủ trên 80%',
  ], 1, 'EN: No net, no refactoring — and writing the net is how you learn what the code really does.|||VI: Chưa có lưới thì chưa refactor — và dựng lưới chính là cách biết code thật sự làm gì.'),
  Q('In LoaiDocGia.tu(), why do all strings other than "SV"/"GV" map to KHACH, even “sv” and “NCS”?|||Trong LoaiDocGia.tu(), vì sao mọi chuỗi khác "SV"/"GV" đều thành KHACH, kể cả "sv" và "NCS"?', [
    'Because KHACH is the safest default for a library|||Vì KHACH là mặc định an toàn nhất cho thư viện',
    'Because enums cannot represent unknown values|||Vì enum không biểu diễn được giá trị lạ',
    'To preserve the old else-branch exactly; recognising NCS is a feature (TV-95), not part of the refactoring|||Để giữ đúng nhánh else cũ; nhận ra NCS là một tính năng (TV-95), không thuộc phép refactor',
    'Because MySQL stores the column in upper case|||Vì MySQL lưu cột đó bằng chữ hoa',
  ], 2, 'EN: Polymorphism must reproduce every branch of the old conditional, including its default.|||VI: Đa hình phải tái hiện mọi nhánh của điều kiện cũ, kể cả nhánh mặc định.'),
  Q('A JS lookup table is written as return LUAT[loai] || LUAT.KHACH. What happens for loai = "__proto__"?|||Bảng tra JS viết return LUAT[loai] || LUAT.KHACH. Chuyện gì xảy ra với loai = "__proto__"?', [
    'It falls back to KHACH|||Nó rơi về KHACH',
    'It throws a TypeError|||Nó ném TypeError',
    'It returns Object.prototype; toiDa is undefined and 50 >= undefined is false, so the limit disappears|||Nó trả về Object.prototype; toiDa là undefined và 50 >= undefined là false, nên giới hạn biến mất',
    'Node 14 blocks __proto__ as a key|||Node 14 chặn __proto__ làm khoá',
  ], 2, 'EN: Use hasOwnProperty, Object.create(null) or a Map, and test the inherited keys. Same family as prototype pollution (CVE-2019-10744, lodash).|||VI: Dùng hasOwnProperty, Object.create(null) hoặc Map, và test các khoá kế thừa. Cùng họ với prototype pollution (CVE-2019-10744, lodash).'),
  Q('While extracting MuonTraService, why does the log.info("borrow …") line stay in BookServlet?|||Khi tách MuonTraService, vì sao dòng log.info("borrow …") ở lại BookServlet?', [
    'Services must not log|||Service không được ghi log',
    'Moving it changes the logger name; alerts or log searches keyed on com.thuvien.servlet.BookServlet would break — logs are observable too|||Chuyển đi sẽ đổi tên logger; cảnh báo hay tìm kiếm log theo com.thuvien.servlet.BookServlet sẽ hỏng — log cũng là hành vi quan sát được',
    'log4j 1.x cannot be used outside servlets|||log4j 1.x không dùng được ngoài servlet',
    'The tests assert on the log line|||Test có kiểm dòng log',
  ], 1, 'EN: Tests are not the only observers: ops, monitoring and other teams see logs, messages and file formats.|||VI: Test không phải người quan sát duy nhất: vận hành, giám sát và đội khác cũng thấy log, thông báo và định dạng tệp.'),
  Q('After introducing Tien with a nice toString() (“18.000 đ”), 4 tests fail. What is the right move?|||Sau khi thêm Tien với toString() đẹp ("18.000 đ"), 4 test đỏ. Nước đi đúng là gì?', [
    'Update the 4 expected messages — the new format is better|||Sửa 4 thông báo kỳ vọng — cách in mới đẹp hơn',
    'Keep the old format explicitly (hienThiKieuCu) so the refactoring stays green; ship the new format as its own ticket|||Giữ cách in cũ một cách tường minh (hienThiKieuCu) để refactor vẫn xanh; đưa cách in mới thành ticket riêng',
    'Delete the boundary tests and keep the unit tests|||Xoá test ở biên, giữ test đơn vị',
    'Go back to double|||Quay về double',
  ], 1, 'EN: The improved text is a behaviour change users see; it needs its own review (and in outsourcing, the customer’s approval).|||VI: Dòng chữ đẹp hơn là thay đổi hành vi người dùng nhìn thấy; nó cần review riêng (ở outsourcing còn cần khách duyệt).'),
  Q('Which statement about money in this lab is correct?|||Phát biểu nào về tiền trong lab là đúng?', [
    'double is fine because all fines are multiples of 1,000 today|||double ổn vì hôm nay mọi khoản phí đều là bội của 1.000',
    'A long of đồng is exact for VND; BigDecimal with explicit scale/rounding is for currencies with cents|||long tính bằng đồng là chính xác cho VND; BigDecimal với số lẻ/cách làm tròn ghi rõ dành cho tiền có xu',
    'float is more precise than double for small amounts|||float chính xác hơn double với số nhỏ',
    'Math.round(x * 100) / 100 always gives correct cents|||Math.round(x * 100) / 100 luôn cho đúng số xu',
  ], 1, 'EN: 0.1 added ten times is 0.9999999999999999; Math.round(1.005*100)/100 is 1. The Patriot (1991) and Vancouver (1982) incidents are the same class of error.|||VI: 0,1 cộng mười lần ra 0.9999999999999999; Math.round(1.005*100)/100 ra 1. Sự cố Patriot (1991) và Vancouver (1982) cùng loại lỗi.'),
  Q('Kent Beck: “make the change easy, then make the easy change”. In this chapter, what made TV-95 (add NCS) a ~1 hour task?|||Kent Beck: "làm cho thay đổi trở nên dễ, rồi làm thay đổi dễ". Trong chương này, điều gì khiến TV-95 (thêm NCS) chỉ còn khoảng 1 giờ?', [
    'Adding NCS to the stored procedure|||Thêm NCS vào stored procedure',
    'The preparatory refactorings: rules per type in one enum and one Node table, so the feature is one constant plus one table line|||Các phép refactor dọn đường: luật theo loại nằm trong một enum và một bảng Node, nên tính năng chỉ là một hằng cộng một dòng bảng',
    'Using TCR|||Dùng TCR',
    'Squashing all commits|||Gộp mọi commit',
  ], 1, 'EN: And say what is still not easy: sp_overdue_report ignores types and will show NCS fines wrong.|||VI: Và nói rõ cái vẫn chưa dễ: sp_overdue_report bỏ qua loại và sẽ hiện phí NCS sai.'),
  Q('Your 900-line PR mixes refactoring, TV-95 and two bug fixes. The leader asks you to split it. Which split is best?|||PR 900 dòng của bạn trộn refactor, TV-95 và hai bản sửa lỗi. Leader yêu cầu tách. Cách tách nào tốt nhất?', [
    'By file: Java PR and Node PR|||Theo tệp: một PR Java, một PR Node',
    'By size: three PRs of 300 lines|||Theo kích thước: ba PR mỗi cái 300 dòng',
    'By hat: a refactor PR with no changed boundary expectations, a fix PR per bug with its flipped test, a feature PR on top of the refactor|||Theo chiếc mũ: một PR refactor không đổi kỳ vọng ở biên, mỗi bug một PR sửa kèm test bị đảo, một PR tính năng nằm trên PR refactor',
    'Do not split; add a longer description|||Không tách; viết mô tả dài hơn',
  ], 2, 'EN: Each PR then has one kind of risk and one way to review it; total review time goes down.|||VI: Khi đó mỗi PR chỉ có một loại rủi ro và một cách review; tổng thời gian review giảm.'),
];

// vị trí đáp án đúng sau khi dời: 2 0 1 3 1 0 2 1 3 1 0 2
const VI_TRI = [2, 0, 1, 3, 1, 0, 2, 1, 3, 1, 0, 2];
const QUIZ5 = QUIZ5_GOC.map((q, i) => dat(q, VI_TRI[i]));

const QUIZ_CONTENT = ml((en) => `
<span class="eyebrow">${en ? 'Chapter 5 · Quiz' : 'Chương 5 · Kiểm tra'}</span>
<h2>${en ? 'Check what stuck' : 'Xem thử đọng lại được gì'}</h2>
<p class="lead">${en ? 'Twelve questions, each built on a real output from this chapter: which change is a refactoring, what the tool’s refusal means, which test caught what, and how to split the work.' : 'Mười hai câu, câu nào cũng dựa trên một output thật của chương: thay đổi nào là refactor, lời từ chối của công cụ nghĩa là gì, test nào bắt được gì, và tách việc ra sao.'}</p>
<h3>${en ? 'Self-check before you start' : 'Tự kiểm trước khi làm'}</h3>
<ul>
<li>${en ? 'I can name 12 refactorings from the catalogue and say which smell each one treats.' : 'Tôi gọi được 12 phép refactor trong danh mục và nói mỗi phép chữa smell nào.'}</li>
<li>${en ? 'I can do Rename, Extract, Inline and Change Signature with the IDE, and I know when the tool refuses and why.' : 'Tôi làm được Rename, Extract, Inline, Change Signature bằng IDE, và biết khi nào công cụ từ chối, vì sao.'}</li>
<li>${en ? 'I have a branch where every commit is green on its own, and I can prove it with one loop.' : 'Tôi có một nhánh mà commit nào cũng xanh khi đứng riêng, và chứng minh được bằng một vòng lặp.'}</li>
<li>${en ? 'I can tell a refactoring commit from a behaviour change by looking at the test diff.' : 'Tôi phân biệt được commit refactor với thay đổi hành vi chỉ bằng cách nhìn diff của test.'}</li>
</ul>
`
);

export default {
  title: 'Chapter 5 — Refactoring with the IDE: the Fowler catalogue in small steps|||Chương 5 — Refactor bằng IDE: danh mục Fowler theo từng bước nhỏ',
  description: 'Đổi cấu trúc, giữ nguyên hành vi — chạy test sau mỗi bước.',
  lessons: [
    { title: '5.1 — The basic moves: Rename, Extract Variable/Method, Inline, Change Signature|||5.1 — Bước cơ bản: đổi tên, tách biến/hàm, gộp lại, đổi chữ ký hàm', slug: 'lgc-5-1-co-ban', type: 'LESSON', isFreePreview: true, description: 'Slide Statements trước Extract Function (doPost 20/36 ⇒ 7/7), Rename bằng công cụ so với Find/Replace làm 5 test đỏ, bộ máy refactor của VS Code chạy thật: tách hàm, đổi tên 9 chỗ, lời từ chối "conditional return", bỏ tham số chết bằng cách di trú.', content: L51 },
    { title: '5.2 — Simplifying conditionals: guard clauses, polymorphism instead of switch|||5.2 — Đơn giản hoá điều kiện: guard clause, đa hình thay cho switch', slug: 'lgc-5-2-dieu-kien', type: 'LESSON', isFreePreview: true, description: 'Bảy test cho đăng nhập bằng cookie (lộ hai bug) rồi mới guard clause; ba switch theo loại ⇒ enum LoaiDocGia trong ba commit; bảng luật bên Node và cái bẫy khoá __proto__ (CVE-2019-10744).', content: L52 },
    { title: '5.3 — Moving features: Move Method/Field, Extract Class, Introduce Parameter Object|||5.3 — Di chuyển trách nhiệm: chuyển hàm/trường, tách lớp, gom tham số thành đối tượng', slug: 'lgc-5-3-di-chuyen', type: 'LESSON', isFreePreview: true, description: 'God Servlet ⇒ servlet mỏng + MuonTraService + PhieuMuonDAO, SQL chuyển nguyên văn kể cả bug, KhoangMuon, hết Feature Envy, test service không cần MySQL, SQL rời header.jsp với golden master giống hệt, kho.ghi bên Node.', content: L53 },
    { title: '5.4 — Organising data: magic numbers, primitives to objects, encapsulated collections|||5.4 — Tổ chức dữ liệu: số ma thuật, kiểu nguyên thuỷ thành đối tượng, đóng gói tập hợp', slug: 'lgc-5-4-du-lieu', type: 'LESSON', isFreePreview: true, description: 'Tiền từ double sang Tien: một toString() đẹp làm 4 test đỏ vì đổi chữ người dùng thấy; giữ tường minh, cải tiến riêng; Vancouver 1982 và Patriot 1991; đóng gói danh sách phiếu bên Node.', content: L54 },
    { title: '5.5 — Rhythm and discipline: never mix refactor and behaviour change, preparatory refactoring|||5.5 — Nhịp và kỷ luật: không trộn refactor với đổi hành vi, refactor dọn đường', slug: 'lgc-5-5-nhip-refactor', type: 'LESSON', isFreePreview: true, description: 'Hai chiếc mũ; commit trộn làm đỏ hai test _BUG; TV-41 thành PR 12 dòng; TV-95 sau khi dọn đường còn 4 tệp; test tái hiện race để dành Chương 8; TCR chạy thật; khi nào không nên refactor; tách PR 900 dòng.', content: L55 },
    { title: '5.6 — Lab: Refactor the borrow/return module from God Servlet to layered code|||5.6 — Lab: Refactor module mượn/trả từ God Servlet thành code phân tầng', slug: 'lgc-5-6-lab', type: 'LESSON', isFreePreview: true, description: 'Ticket LIB-105: 18 commit Java + 11 commit Node, commit nào cũng xanh (vòng lặp kiểm từng commit), PMD 12 ⇒ 8, ESLint 36 ⇒ 16, golden master giống hệt, TV-95 làm bên trên; lời giải dạng patch, thang chấm 10 điểm, 5 câu phỏng vấn.', content: L56 },
    { title: '5.7 — Chapter 5 quiz|||5.7 — Kiểm tra Chương 5', slug: 'lgc-5-7-quiz', type: 'QUIZ', isFreePreview: true, description: 'Mười hai câu: refactor hay đổi hành vi, Slide Statements, Find/Replace, lời từ chối của công cụ, guard clause có test, nhánh else của enum, khoá __proto__, log là hành vi, toString() đổi chữ, tiền, refactor dọn đường, tách PR.', content: QUIZ_CONTENT, quiz: { timeLimitSeconds: 900, questions: QUIZ5 } },
  ],
};
