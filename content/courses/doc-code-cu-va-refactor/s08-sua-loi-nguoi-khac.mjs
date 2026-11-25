/**
 * Đọc code cũ và refactor — Chương 8: Sửa lỗi trong code của người khác (soạn 24/11/2026, agent rfc trên máy nhà Linux).
 * 8.1 Quy ước: đo quy ước ngầm bằng lệnh (thụt lề, nháy, var, tên hàm, lời commit — và chỗ chính khoá này đã lệch ở Ch5),
 *     .editorconfig viết từ số đo (đoán sai 2 lần: XML/SQL thụt 2, JSP trộn), editorconfig-checker 4.0.2, Checkstyle 9.3
 *     (sun 439 / google 879 / bộ luật dự án 0 — đoán sai LeftCurly vì getter một dòng), cổng chặn 1 tab mới;
 *     Prettier 3.10.1 (14/14 tệp "sai", muon.js 40 dòng ⇒ +43/−19), google-java-format 1.27.0 (+1492/−1262; --aosp +559/−244),
 *     git blame bị "cướp", --ignore-rev / blame.ignoreRevsFile, nhánh đang mở xung đột sau commit format; Boy Scout có giới hạn;
 *     Trojan Source CVE-2021-42574 chạy thật trên Node + luật Checkstyle chặn.
 * 8.2 Bản sửa tối thiểu TV-108 (trả cùng phiếu hai lần cộng sách ma): nhận ticket, tái hiện, ước lượng; test đỏ → sửa 19/10 dòng
 *     (UPDATE … AND return_date IS NULL + đếm dòng) → test mock đỏ vì hợp đồng đổi → 50 xanh; hai phiên MySQL chứng minh khoá dòng;
 *     PR 900 dòng (583/252) tách thành 19/10 + format máy sinh, chứng minh tổng giống hệt từng byte; formatter cần 2 lượt mới ổn định.
 * 8.3 Mô tả PR 4 mục (nguyên nhân gốc · phạm vi ảnh hưởng · cách kiểm · rủi ro) với số đo thật (SQL ảnh hưởng: sách 7 lệch NGƯỢC chiều
 *     ⇒ không phải TV-108); review TV-98: người review hỏi "ném lỗi đồng bộ thì sao" ⇒ hàng đợi treo thật (ECONNABORTED) ⇒ fixup +
 *     autosquash + range-diff; trả lời review không tự ái; xz-utils CVE-2024-3094.
 * 8.4 Khi người viết đã nghỉ: bản đồ tri thức từ git blame (ai-biet.py, hệ số xe buýt), git log -S lần ra phí 2.000 đ đồng giá của TV-77,
 *     ai còn biết (BA, tester, thủ thư, khách), Q&A list, ghi chú trong code, ADR (Nygard 2011) commit vào repo; New Jersey COBOL 2020, GitLab 2017.
 * 8.5 Lab: TV-96 (cookie, 9/9 dòng), TV-98 (race Node, 64/2 dòng), TV-109 (error.jsp CWE-209, 10/3 dòng) — đỏ trước, xanh sau,
 *     bằng chứng HTTP trước/sau trên Tomcat 10.1, giả cookie admin từ bí mật trong mã (Apache Shiro CVE-2016-4437), e2e 3/3, golden master.
 * 8.6 quiz 12 câu.
 * Repo: legacy-thu-vien nhánh ch8 (từ ch7) + tv-108, tv-96, tv-109, format-aosp; legacy-express nhánh ch8 + tv-98. Lời giải: lab/loi-giai/ch8/.
 * KHÔNG dạy lại: quy ước nhánh/commit (agile-teamwork 3.1), PR dễ review (agile-teamwork 3.2, git 6.1), viết/nhận review (agile-teamwork 4.2/4.3),
 * ADR tổng quát (agile-teamwork 5.2), ước lượng man-day (agile-teamwork 9.6), Q&A list/CR (agile-teamwork 9.5), blame/pickaxe (git 2.3).
 */
import { java, xml, bash, js, out, tl, giai, ml, lk, bai, thuatNgu, Q, MOI_TRUONG_3 } from './_chung.mjs';

const moiTruong = (en) => `<p><em>${en ? 'Outputs run for real on:' : 'Output chạy thật trên:'} ${MOI_TRUONG_3} · Temurin JDK 17.0.19 (Maven trong container) · Tomcat 10.1.62 · Node 22.22.2 / npm 10.9.7 · Git 2.55.0 · Prettier 3.10.1 · google-java-format 1.27.0 · Checkstyle 9.3 (maven-checkstyle-plugin 3.6.0) · editorconfig-checker 4.0.2.</em></p>`;

/* ═══════════════════ 8.1 — Quy ước ═══════════════════ */
const B81_TIM = bash(`
# 1) Quy ước VIẾT RA: tìm trước khi gõ dòng đầu tiên
git ls-files | grep -iE 'editorconfig|checkstyle|pmd|spotless|eslint|prettier|stylelint|CONTRIBUTING|pull_request_template|commitlint|\\.husky'
cat README* CONTRIBUTING* 2>/dev/null | grep -inE 'quy ước|convention|style|format|commit'
# 2) Quy ước NGẦM: đo bằng lệnh (code cũ của đội là tài liệu thật nhất)
git log --format=%s -30                       # lời commit trông thế nào
grep -rhoE '^( +|\\t+)' --include=*.java src | sort | uniq -c | sort -rn | head   # thụt lề
`);
const O81_NODE = out(`
$ cat app.js server.js lib/*.js routes/*.js | grep -o "'" | wc -l      # nháy đơn
122
$ cat app.js server.js lib/*.js routes/*.js | grep -o '"' | wc -l      # nháy kép
6
$ cat app.js server.js lib/*.js routes/*.js | grep -oE '\\b(var|let|const) ' | sort | uniq -c
     47 var
$ cat app.js server.js lib/*.js routes/*.js | grep -oE 'function \\(|function\\(|=> ' | sort | uniq -c
     20 function (
`);
const O81_JAVA = out(`
$ git log --format=%s master          # đội gốc 2016–2019
update
TV-77 bao cao phieu qua han + dem qua han tren menu
refactor
tam tat export, server moi chay linux khong co o C
xuat csv cho ke toan
ghi nho dang nhap
TV-52 SV khieu nai phi qua cao -> tran 50k (chi ap dung SV theo y kien phong CTSV)
TV-45 tinh phi tre han khi tra sach
TV-41 gioi han so sach muon theo loai doc gia (SV 3, GV 10, khach 1)
fix loi so luong am (TV-23)
them chuc nang doc gia
init project
$ git log --format=%s master..ch8 | sed -E "s/[:(].*//" | sort | uniq -c | sort -rn     # chính khoá này, Ch3–Ch8
     16 refactor
     10 chore
      8 test
      6 fix
      4 build
      1 seam
      1 feat
      1 docs
--- tên hàm/hàm dựng khai báo trong src/main/java
master (đội gốc): 26 — close doGet doPost findAll findById getAuthor getAvailable getCode getConnection getId getName
                       getPhone getQuantity getTitle getType makeToken map setAuthor setAvailable setCode setId ...
ch8 (sau Ch3–7):  74 — mới: muon tra soNguyen timPhieuCanTra ghiTra congLaiSach demDangMuon loaiCuaDocGia phiTre soNgayTre
                       hienThiKieuCu nguoiDungTuCookie bam khop nenBamLai thoat dichVu chuyenTrang ...
--- comment có dấu tiếng Việt (src/main/java)
master: 0 dòng có dấu / 34 dòng comment
ch8:   45 dòng có dấu / 83 dòng comment
`);
const O81_EC1 = out(`
$ editorconfig-checker -no-color -exclude "^(target|e2e/target|golden|\\.approval_tests_temp)/"   # lần 1: đoán [*.{java,jsp,xml,sql}] thụt 4
db/thuvien.sql:
	18-24: wrong amount of left-padding spaces(want multiple of 4)
	36-41: wrong amount of left-padding spaces(want multiple of 4)
	... (7 khối nữa)
e2e/pom.xml:
	3: wrong amount of left-padding spaces(want multiple of 4)
	5-9: wrong amount of left-padding spaces(want multiple of 4)
	... (13 khối nữa)
pom.xml:
	3-6: wrong amount of left-padding spaces(want multiple of 4)
	9-16: wrong amount of left-padding spaces(want multiple of 4)
	...
$ for f in pom.xml db/thuvien.sql src/main/webapp/WEB-INF/web.xml src/main/webapp/books.jsp; do
>   printf "%s: " $f; grep -oE '^ +' $f | awk '{print length($0)}' | sort -n | uniq -c | head -4 | tr '\\n' ' '; echo; done
pom.xml:      18 2      31 4      60 6      30 8
db/thuvien.sql:      15 1      39 2       2 9
src/main/webapp/WEB-INF/web.xml:      17 2      15 4       3 9
src/main/webapp/books.jsp:       9 2       9 4       2 6       4 8
`);
const C81_EC = `# Mô tả quy ước ĐANG CÓ của dự án (đo ở bài 8.1), không phải quy ước mình thích
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.java]
indent_style = space
indent_size = 4

# đo lại: pom.xml, web.xml, db/thuvien.sql thụt 2 (lần đầu đoán 4 ⇒ 60 dòng "sai")
[*.{xml,sql}]
indent_style = space
indent_size = 2

[*.{yml,yaml,json}]
indent_style = space
indent_size = 2

# JSP trộn HTML thụt 2 và Java thụt 4 — không ép
[*.jsp]
indent_style = space`;
const O81_EC3 = out(`
$ editorconfig-checker -no-color -exclude "^(target|e2e/target|golden|\\.approval_tests_temp)/"
db/thuvien.sql:
	46-48: wrong amount of left-padding spaces(want multiple of 2)
e2e/pom.xml:
	3: wrong amount of left-padding spaces(want multiple of 2)
src/main/java/com/thuvien/tools/BamMatKhauCu.java:
	20-22: wrong amount of left-padding spaces(want multiple of 4)
src/main/webapp/WEB-INF/web.xml:
	3-5: wrong amount of left-padding spaces(want multiple of 2)
... (dòng gióng cột: thuộc tính XML, cột SQL, chuỗi nối dài)
$ editorconfig-checker -no-color -disable-indent-size -exclude "^(target|e2e/target|golden|\\.approval_tests_temp)/"
$ echo $?
0
`);
const O81_CS = out(`
$ mvn -B -q checkstyle:checkstyle -Dcheckstyle.config.location=<cấu hình> -Dcheckstyle.includeTestSourceDirectory=true
  (đếm target/checkstyle-result.xml theo luật)
sun_checks.xml:              439 vi phạm / 20 tệp — LineLength 104, FinalParameters 88, JavadocVariable 38, DesignForExtension 35, LeftCurly 30, MagicNumber 26
google_checks.xml:           879 vi phạm / 20 tệp — Indentation 650, LineLength 62, CustomImportOrder 32, LeftCurly 30, RightCurlyAlone 29, EmptyLineSeparator 24
checkstyle-du-an.xml (lần 1): 30 vi phạm / 4 tệp  — LeftCurly 30        (trên master: 20 vi phạm / 2 tệp — Book.java 12, Reader.java 8)
checkstyle-du-an.xml (lần 2):  0 vi phạm / 0 tệp
`);
const O81_CS_CONG = out(`
$ mvn -B checkstyle:check -Dcheckstyle.config.location=tools/checkstyle-du-an.xml     # sau khi lỡ thụt một dòng bằng tab
[ERROR] src/main/java/com/thuvien/servlet/LoginServlet.java:[57,1] (whitespace) FileTabCharacter: File contains tab characters (this is the first instance).
[INFO] BUILD FAILURE
[ERROR] Failed to execute goal org.apache.maven.plugins:maven-checkstyle-plugin:3.6.0:check (default-cli) on project thuvien: You have 1 Checkstyle violation. -> [Help 1]
`);
const C81_CS = xml(`
<!-- tools/checkstyle-du-an.xml — Quy ước ĐANG CÓ của thuvien: chặn code mới làm lệch, không bắt sửa code cũ -->
<module name="Checker">
  <property name="charset" value="UTF-8"/>
  <module name="FileTabCharacter"/>
  <module name="NewlineAtEndOfFile"><property name="lineSeparator" value="lf"/></module>
  <module name="RegexpSingleline">
    <property name="format" value="\\s+$"/><property name="message" value="Khoảng trắng cuối dòng"/>
  </module>
  <module name="RegexpSingleline">
    <property name="format" value="[\\u202A-\\u202E\\u2066-\\u2069]"/><property name="message" value="Ký tự điều khiển hai chiều (Trojan Source)"/>
  </module>
  <module name="LineLength"><property name="max" value="200"/></module>
  <module name="TreeWalker">
    <module name="AvoidStarImport"/>
    <module name="UnusedImports"/>
    <module name="RightCurly"/>
    <module name="Indentation"><property name="basicOffset" value="4"/><property name="caseIndent" value="4"/></module>
    <module name="MethodName"/>
    <module name="TypeName"/>
    <module name="EqualsHashCode"/>
    <module name="NeedBraces"><property name="allowSingleLineStatement" value="true"/></module>
  </module>
</module>
`);
const O81_PRETTIER = out(`
$ npx prettier --check app.js server.js "lib/*.js" "routes/*.js" "__tests__/*.js"
[warn] app.js
...
[warn] __tests__/so-phieu.test.js
[warn] Code style issues found in 14 files. Run Prettier with --write to fix.
$ npx prettier --write routes/muon.js && git diff --stat          # tệp 40 dòng
 routes/muon.js | 62 ++++++++++++++++++++++++++++++++++++++++------------------
 1 file changed, 43 insertions(+), 19 deletions(-)
$ git diff routes/muon.js | sed -n 6,12p
-var express = require('express');
-var moment = require('moment');
-var kho = require('../lib/kho');
+var express = require("express");
+var moment = require("moment");
+var kho = require("../lib/kho");
$ npx prettier --write app.js server.js lib routes __tests__ && git diff --shortstat
 14 files changed, 312 insertions(+), 162 deletions(-)
$ npx jest --silent 2>&1 | grep -E "^Tests:"
Tests:       21 passed, 21 total
`);
const O81_GJF = out(`
$ git blame -L "/String q = request.getParameter/,+1" src/main/java/com/thuvien/servlet/BookServlet.java
^1133063 (Nguyen Anh Tuan 2016-03-02 09:14:00 +0700 39)         String q = request.getParameter("q");
$ git ls-files "src/*.java" | xargs google-java-format --replace && git diff --shortstat      # ~2.000 dòng Java
 33 files changed, 1492 insertions(+), 1262 deletions(-)
$ git ls-files "src/*.java" | xargs google-java-format --aosp --replace && git diff --shortstat   # kiểu AOSP: thụt 4 như dự án
 31 files changed, 559 insertions(+), 244 deletions(-)
$ git commit -qam "style: google-java-format toan repo"
$ git blame -L "/String q = request.getParameter/,+1" src/main/java/com/thuvien/servlet/BookServlet.java
51bd1bea (hocvien 2026-11-24 07:14:29 +0700 37)     String q = request.getParameter("q");
$ git blame --ignore-rev HEAD -L "/String q = request.getParameter/,+1" src/main/java/com/thuvien/servlet/BookServlet.java
^1133063 (Nguyen Anh Tuan 2016-03-02 09:14:00 +0700 37)     String q = request.getParameter("q");
$ git show -w --shortstat --format= HEAD        # bỏ qua khác biệt khoảng trắng: vẫn còn nhiều vì formatter ngắt lại dòng
 30 files changed, 456 insertions(+), 226 deletions(-)
`);
const O81_IGNORE = out(`
$ git rev-parse HEAD > .git-blame-ignore-revs           # mã commit format; commit tệp này vào repo
$ git config blame.ignoreRevsFile .git-blame-ignore-revs  # mỗi máy dev chạy một lần
$ git blame -L 15,17 routes/muon.js
df6b8943 (Lan 2026-11-24 04:04:02 +0700 15)     return res.status(400).json({ loi: "thieu docGia hoac sach" });
df6b8943 (Lan 2026-11-24 04:04:02 +0700 16)   kho.doc("doc-gia", function (err, dsDocGia) {
df6b8943 (Lan 2026-11-24 04:04:02 +0700 17)     if (err) return res.status(500).send("loi doc du lieu");
$ git config --unset blame.ignoreRevsFile && git blame -L 15,17 routes/muon.js     # không bỏ qua
22368e10 (Hoc Vien 2026-11-24 07:13:34 +0700 15)     return res.status(400).json({ loi: "thieu docGia hoac sach" });
22368e10 (Hoc Vien 2026-11-24 07:13:34 +0700 16)   kho.doc("doc-gia", function (err, dsDocGia) {
22368e10 (Hoc Vien 2026-11-24 07:13:34 +0700 17)     if (err) return res.status(500).send("loi doc du lieu");
`);
const O81_XD = out(`
$ git rebase format-ch8      # nhánh TV-96 (9 dòng) mở từ trước; đồng đội vừa merge commit format cả repo
CONFLICT (content): Merge conflict in src/test/java/com/thuvien/servlet/LoginServletCookieTest.java
error: could not apply 325ad21... fix(TV-96): cookie remember phai dung dang ten:token — 'admin:' khong con 500, duoi thua khong con dang nhap
$ git diff --name-only --diff-filter=U
src/test/java/com/thuvien/servlet/LoginServletCookieTest.java
`);
const O81_TROJAN = out(`
$ node kiem-quyen.js user
VAO TRANG QUAN TRI
$ grep -nP '[\\x{202A}-\\x{202E}\\x{2066}-\\x{2069}]' kiem-quyen.js | cat -A | cut -c1-90
2:if (vaiTro !== 'userM-bM-^@M-. M-bM-^AM-&// chi admin moi quaM-bM-^AM-) M-bM-^AM-&') {$
`);

const L81 = ml((en) => `
<span class="eyebrow">${en ? 'Chapter 8 · Fixing bugs in someone else’s code' : 'Chương 8 · Sửa lỗi trong code của người khác'}</span>
<h2>${en ? '8.1 — Respecting the project’s conventions, even when you disagree' : '8.1 — Tôn trọng quy ước của dự án, kể cả khi bạn không đồng ý'}</h2>
<p class="lead">${en
  ? 'When you stay at a friend’s house you put the cups back where they keep them, not where you would. You may think their kitchen is badly organised; you are still a guest. Maintaining someone else’s code is the same — and the cost of rearranging the kitchen is not your taste, it is everybody’s ability to find things afterwards: reviewers, <code>git blame</code>, and colleagues with open branches. This lesson measures the conventions a project really has, writes them down as tool configuration, and shows in numbers what “just reformatting” costs.'
  : 'Ở nhờ nhà bạn, bạn để cốc lại đúng chỗ nhà họ vẫn để, không phải chỗ bạn thích. Bạn có thể thấy bếp nhà họ xếp dở; bạn vẫn là khách. Bảo trì code của người khác cũng vậy — và cái giá của việc "xếp lại bếp" không nằm ở sở thích của bạn, mà ở khả năng tìm đồ của mọi người sau đó: người review, <code>git blame</code>, và đồng đội đang có nhánh mở. Bài này đo các quy ước dự án THẬT SỰ có, ghi chúng lại thành cấu hình công cụ, và cho thấy bằng con số "chỉ format lại thôi" tốn những gì.'}</p>
${moiTruong(en)}

<h3>${en ? 'Where conventions live: written ones and unwritten ones' : 'Quy ước nằm ở đâu: loại viết ra và loại ngầm'}</h3>
<p>${en
  ? 'A <strong>convention</strong> is any rule the team follows so that code looks like one person wrote it: indentation, quotes, naming, where SQL goes, how commits are worded, how errors are shown to users. Some are <em>written</em> — <code>.editorconfig</code>, <code>checkstyle.xml</code>, <code>.eslintrc</code>, <code>.prettierrc</code>, a CONTRIBUTING file, a PR template, a commit-message hook, and in Japanese outsourcing projects often a coding-rules Excel sheet from the customer. Most old projects have almost none written down; the conventions are <em>unwritten</em> and live in the code itself. Look for both before your first keystroke:'
  : '<strong>Quy ước</strong> (convention) là mọi luật đội tuân theo để code trông như một người viết: thụt lề, dấu nháy, đặt tên, SQL đặt ở đâu, lời commit viết thế nào, lỗi hiện cho người dùng ra sao. Có loại <em>viết ra</em> — <code>.editorconfig</code>, <code>checkstyle.xml</code>, <code>.eslintrc</code>, <code>.prettierrc</code>, tệp CONTRIBUTING, mẫu PR, hook kiểm lời commit, và ở dự án outsourcing cho khách Nhật thường là một tệp Excel quy tắc lập trình khách gửi. Dự án cũ hầu như không có gì viết ra; quy ước là loại <em>ngầm</em>, nằm ngay trong code. Tìm cả hai trước khi gõ phím đầu tiên:'}</p>
${B81_TIM}
<p>${en
  ? 'On <code>legacy-thu-vien</code> (branch <code>master</code>, as the customer handed it over) the first command prints nothing: zero written conventions. So we measure. The Node API first:'
  : 'Trên <code>legacy-thu-vien</code> (nhánh <code>master</code>, đúng bản khách bàn giao) lệnh đầu không in gì: không có quy ước nào viết ra. Vậy ta đo. Trước hết là API Node:'}</p>
${O81_NODE}
<p>${en
  ? 'Single quotes 122 to 6 (the six are inside strings), <code>var</code> only, <code>function (</code> with a space, no arrow functions. That is a convention as clear as any config file — and it also tells you <em>not</em> to bring <code>const</code> and arrow functions into a bug fix, even though you would write them in a new project. Lessons 5.1–5.4 respected it: all 47 declarations are still <code>var</code>. Now the Java side, and an honest look at this course itself:'
  : 'Nháy đơn 122 so với 6 (sáu cái kia nằm trong chuỗi), chỉ có <code>var</code>, <code>function (</code> có dấu cách, không có hàm mũi tên. Đó là một quy ước rõ ràng như bất kỳ tệp cấu hình nào — và nó cũng bảo bạn <em>đừng</em> mang <code>const</code> và hàm mũi tên vào một bản sửa lỗi, dù ở dự án mới bạn sẽ viết như thế. Các bài 5.1–5.4 đã tôn trọng điều đó: cả 47 khai báo vẫn là <code>var</code>. Giờ tới phía Java, và một cái nhìn thật thà vào chính khoá học này:'}</p>
${O81_JAVA}
<p>${en
  ? 'Two drifts are visible. The original team named methods in English (<code>findAll</code>, <code>makeToken</code>) and wrote comments without Vietnamese diacritics; the refactoring of Chapter 5 introduced Vietnamese method names (<code>timPhieuCanTra</code>) and comments with diacritics. The commit style also changed, from “TV-45 short description” to Conventional Commits. For a course that was a deliberate teaching choice. On a customer project it would be a review comment on day one: <em>“please follow the existing naming”</em> — and a reasonable lead would be right. If you believe a change of convention is worth it, propose it <strong>once, explicitly</strong> (a short message to the lead, or an ADR — lesson 8.4), and apply it to new code only after agreement. Never introduce it silently in a bug fix.'
  : 'Thấy rõ hai chỗ lệch. Đội gốc đặt tên hàm tiếng Anh (<code>findAll</code>, <code>makeToken</code>) và viết comment tiếng Việt không dấu; đợt refactor ở Chương 5 đưa vào tên hàm tiếng Việt (<code>timPhieuCanTra</code>) và comment có dấu. Kiểu lời commit cũng đổi, từ "TV-45 mô tả ngắn" sang Conventional Commits. Với khoá học, đó là lựa chọn có chủ đích để dạy. Ở dự án của khách, đó sẽ là nhận xét review ngay ngày đầu: <em>"em theo cách đặt tên đang có nhé"</em> — và trưởng nhóm nói vậy là đúng. Nếu bạn tin đổi quy ước là đáng, hãy đề xuất <strong>một lần, công khai</strong> (một tin nhắn ngắn cho trưởng nhóm, hoặc một ADR — bài 8.4), và chỉ áp dụng cho code mới sau khi đã thống nhất. Đừng bao giờ lặng lẽ đưa nó vào một bản sửa lỗi.'}</p>
<div class="callout"><p>${en
  ? '<strong>Commit messages are a convention too.</strong> The old history references tickets (“TV-45 …”). Whatever format you use, keep the ticket ID in it: that is what made lesson 2.4 possible, and it is what lesson 8.4 will rely on when the author is gone.'
  : '<strong>Lời commit cũng là quy ước.</strong> Lịch sử cũ luôn có mã ticket ("TV-45 …"). Dùng định dạng nào thì cũng giữ mã ticket trong đó: nhờ nó mà bài 2.4 làm được, và bài 8.4 sẽ dựa vào nó khi người viết đã nghỉ.'}</p></div>

<h3>${en ? 'Write the conventions down — from measurements, not from taste' : 'Ghi quy ước lại — từ số đo, không phải từ sở thích'}</h3>
<p>${en
  ? '<a href="https://editorconfig.org" target="_blank" rel="noopener">EditorConfig</a> is a tiny file every editor (IntelliJ, VS Code, Eclipse, NetBeans with a plugin) reads to set indentation, charset and line endings per file type. Adding it changes no code; it stops <em>your</em> editor from silently re-indenting the lines you touch. The first version below was written from the Java files only, then checked with <code>editorconfig-checker</code>:'
  : '<a href="https://editorconfig.org" target="_blank" rel="noopener">EditorConfig</a> là một tệp nhỏ mà mọi trình soạn thảo (IntelliJ, VS Code, Eclipse, NetBeans có plugin) đọc để đặt thụt lề, bảng mã và kiểu xuống dòng theo loại tệp. Thêm nó không đổi dòng code nào; nó ngăn trình soạn thảo của <em>bạn</em> lặng lẽ thụt lại những dòng bạn chạm vào. Bản đầu dưới đây viết chỉ dựa trên các tệp Java, rồi kiểm bằng <code>editorconfig-checker</code>:'}</p>
${O81_EC1}
<p>${en
  ? 'Wrong guess: the POM, <code>web.xml</code> and the SQL dump are indented by 2. Fixing that left only lines aligned to a column (XML attributes, SQL columns, continuation lines). Those are a style too — the checker’s “multiple of N” rule is stricter than any editor. Second lesson: JSP mixes HTML indented by 2 and Java indented by 4, so do not force a size there. The final file, committed on its own with the message “describes existing conventions, changes no file”:'
  : 'Đoán sai: POM, <code>web.xml</code> và tệp dump SQL thụt 2. Sửa xong thì chỉ còn các dòng gióng theo cột (thuộc tính XML, cột SQL, dòng nối tiếp). Đó cũng là một kiểu viết — luật "bội số của N" của công cụ kiểm còn khắt khe hơn mọi trình soạn thảo. Bài học thứ hai: JSP trộn HTML thụt 2 với Java thụt 4, nên đừng ép cỡ thụt ở đó. Tệp cuối cùng, commit riêng với lời "mô tả quy ước đang có, không đổi tệp nào":'}</p>
${out(C81_EC)}
${O81_EC3}
<p>${en
  ? 'Same idea one level up: a <strong>linter</strong> configuration that describes the project. Run Checkstyle’s two famous built-in rule sets on 20 files of this project and you get hundreds of “violations”; run a rule set built from the measurements and you get zero:'
  : 'Cùng ý tưởng ở tầng cao hơn: một cấu hình <strong>linter</strong> mô tả đúng dự án. Chạy hai bộ luật nổi tiếng có sẵn của Checkstyle lên 20 tệp của dự án này thì ra hàng trăm "vi phạm"; chạy bộ luật dựng từ số đo thì ra không:'}</p>
${O81_CS}
<p>${en
  ? 'The 439 and 879 are not bugs; they are the difference between Sun’s or Google’s taste and this team’s. Even the project rule set was wrong the first time: <code>LeftCurly</code> flagged one-line getters such as <code>public int getId() { return id; }</code>, which are exactly how Tuấn wrote <code>Book</code> and <code>Reader</code> in 2016. A convention you measured beats a rule you assumed. The rule set that remains (no tabs, final newline, no trailing spaces, no wildcard imports, 4-space indentation, camelCase names, braces unless the statement fits on one line, and one security rule explained at the end of this lesson):'
  : 'Con số 439 và 879 không phải lỗi; đó là khoảng cách giữa khẩu vị của Sun hay Google với khẩu vị của đội này. Đến bộ luật dự án cũng sai ở lần đầu: <code>LeftCurly</code> bắt các getter một dòng như <code>public int getId() { return id; }</code> — đúng kiểu Tuấn đã viết <code>Book</code> và <code>Reader</code> năm 2016. Quy ước bạn đo được luôn thắng luật bạn giả định. Bộ luật còn lại (không tab, có dòng trống cuối tệp, không khoảng trắng cuối dòng, không import dấu sao, thụt 4, tên camelCase, có ngoặc nhọn trừ câu lệnh vừa một dòng, và một luật bảo mật giải thích ở cuối bài):'}</p>
${C81_CS}
<p>${en
  ? 'Its job is to be a <strong>gate for new code</strong>: zero today, so any violation in CI is something a PR just introduced.'
  : 'Việc của nó là làm <strong>cổng chặn cho code mới</strong>: hôm nay bằng không, nên vi phạm nào xuất hiện trong CI cũng là thứ một PR vừa đưa vào.'}</p>
${O81_CS_CONG}

<h3>${en ? 'Do not reformat whole files — what it really costs' : 'Đừng format lại cả tệp — cái giá thật'}</h3>
<p>${en
  ? 'The most common first-month mistake: your editor or a formatter you like reformats the file you opened, and your one-line fix arrives with two hundred changed lines. Measured on the Node API with Prettier’s defaults:'
  : 'Lỗi tháng đầu phổ biến nhất: trình soạn thảo hoặc một formatter bạn thích format lại tệp bạn vừa mở, và bản sửa một dòng của bạn đến tay người review kèm hai trăm dòng thay đổi. Đo trên API Node với Prettier mặc định:'}</p>
${O81_PRETTIER}
<p>${en
  ? 'All 14 files are “wrong” for Prettier, a 40-line file produces 62 changed lines, and the tests pass — which is exactly the trap: nothing broke, so it feels free. The bill comes later, in history. On the Java app, with <code>google-java-format</code>:'
  : 'Cả 14 tệp đều "sai" theo Prettier, một tệp 40 dòng sinh 62 dòng thay đổi, và test vẫn xanh — chính đó là cái bẫy: không có gì vỡ, nên cảm giác như miễn phí. Hoá đơn đến sau, trong lịch sử. Trên ứng dụng Java, với <code>google-java-format</code>:'}</p>
${O81_GJF}
<p>${en
  ? 'Before the format commit, <code>git blame</code> said that line was written by Nguyễn Anh Tuấn on 2 March 2016 — the person and the date you need when you ask “why” (lesson 2.4). After it, every line of the repository “was written” by whoever ran the formatter, today. With Google’s 2-space style, 2,754 of about 2,000 lines change (most lines change twice: removed and added); even the closer AOSP style touches 800 lines, and <code>-w</code> does not save you because formatters also re-wrap lines, reorder imports and split long strings.'
  : 'Trước commit format, <code>git blame</code> nói dòng đó do Nguyễn Anh Tuấn viết ngày 2/3/2016 — đúng người và đúng ngày bạn cần khi hỏi "vì sao" (bài 2.4). Sau commit đó, mọi dòng trong repo đều "do" người chạy formatter viết, hôm nay. Với kiểu Google thụt 2, có 2.754 dòng thay đổi trên khoảng 2.000 dòng code (hầu hết mỗi dòng đổi hai lần: xoá rồi thêm); ngay cả kiểu AOSP gần với dự án hơn cũng chạm 800 dòng, và <code>-w</code> không cứu được vì formatter còn ngắt lại dòng, sắp lại import và cắt chuỗi dài.'}</p>
<p>${en
  ? 'Two more costs. <strong>Open branches:</strong> every colleague who started work before the format commit gets conflicts. Measured on this repo — the 9-line TV-96 branch of lesson 8.5, rebased onto a repository-wide format commit:'
  : 'Thêm hai cái giá nữa. <strong>Nhánh đang mở:</strong> mọi đồng đội bắt đầu việc trước commit format đều dính xung đột. Đo trên chính repo này — nhánh TV-96 chín dòng của bài 8.5, rebase lên một commit format toàn repo:'}</p>
${O81_XD}
<p>${en
  ? '<strong>Review:</strong> a reviewer cannot see a one-line behaviour change inside 800 lines of whitespace (lesson 8.2 measures it). That is why “reformat the file I am fixing” is almost never acceptable in maintenance work.'
  : '<strong>Review:</strong> người review không thể thấy một thay đổi hành vi một dòng nằm giữa 800 dòng khoảng trắng (bài 8.2 sẽ đo). Vì vậy "format lại tệp mình đang sửa" gần như không bao giờ được chấp nhận trong việc bảo trì.'}</p>

<h3>${en ? 'If the team decides to format everything: the safe way' : 'Nếu đội quyết định format toàn bộ: cách làm an toàn'}</h3>
<ol>
<li>${en ? 'Agree first (lead, and the customer if they review). Pin the formatter and its version in the build, not in someone’s IDE.' : 'Thống nhất trước (trưởng nhóm, và cả khách nếu khách review). Ghim formatter và phiên bản của nó trong build, không phải trong IDE của ai đó.'}</li>
<li>${en ? 'Pick a quiet moment (after a release, few open branches) and announce it: “merge or rebase before Friday 17:00”.' : 'Chọn lúc vắng (sau một đợt phát hành, ít nhánh mở) và báo trước: "merge hoặc rebase trước 17:00 thứ Sáu".'}</li>
<li>${en ? 'One commit, machine output only, nothing else in it. Tests and golden master must be identical.' : 'Một commit, chỉ có output của máy, không lẫn gì khác. Test và golden master phải giống hệt.'}</li>
<li>${en ? 'Put its hash in <code>.git-blame-ignore-revs</code> in the same PR, so history stays readable:' : 'Đưa mã băm của nó vào <code>.git-blame-ignore-revs</code> ngay trong PR đó, để lịch sử vẫn đọc được:'}</li>
</ol>
${O81_IGNORE}
<p>${en
  ? 'GitHub and GitLab read <code>.git-blame-ignore-revs</code> automatically in their blame view; local Git needs the one-time <code>git config</code> above (or <code>--ignore-rev</code> per command). After that, turn on the formatter check in CI so the codebase never drifts again. A softer alternative used in many big repositories is the <em>ratchet</em>: only files a PR touches must be formatted (Spotless has <code>ratchetFrom origin/main</code>), so the code converges over months without a big-bang commit.'
  : 'GitHub và GitLab tự đọc <code>.git-blame-ignore-revs</code> ở màn hình blame; Git trên máy cần chạy <code>git config</code> ở trên một lần (hoặc <code>--ignore-rev</code> cho từng lệnh). Sau đó bật bước kiểm định dạng trong CI để code không bao giờ lệch lại. Một cách mềm hơn mà nhiều repo lớn dùng là <em>bánh cóc</em> (ratchet): chỉ tệp nào PR chạm vào mới phải format (Spotless có <code>ratchetFrom origin/main</code>), nên code hội tụ dần trong vài tháng mà không cần một commit "nổ lớn".'}</p>

<h3>${en ? 'The Boy Scout rule — with limits' : 'Luật Hướng đạo sinh — có giới hạn'}</h3>
<p>${en
  ? '“Leave the campground cleaner than you found it” (Robert C. Martin, in <em>97 Things Every Programmer Should Know</em>, 2010). It is good advice, and lesson 5.5’s preparatory refactoring is its disciplined form. In maintenance work it needs fences:'
  : '"Rời khu cắm trại sạch hơn lúc bạn đến" (Robert C. Martin, trong <em>97 Things Every Programmer Should Know</em>, 2010). Đó là lời khuyên tốt, và refactor dọn đường ở bài 5.5 chính là dạng có kỷ luật của nó. Trong việc bảo trì, nó cần hàng rào:'}</p>
<table>
<tr><th>${en ? 'OK in the same PR (separate commit)' : 'Được, trong cùng PR (commit riêng)'}</th><th>${en ? 'Not in this PR — open a ticket' : 'Không trong PR này — mở ticket'}</th></tr>
<tr><td>${en ? 'Rename a confusing local variable in the function you are fixing' : 'Đổi tên một biến cục bộ khó hiểu trong hàm bạn đang sửa'}</td><td>${en ? 'Rename a public method used in 12 files' : 'Đổi tên một hàm public được dùng ở 12 tệp'}</td></tr>
<tr><td>${en ? 'Add the missing test that pins the behaviour you are about to change' : 'Thêm test còn thiếu để khoá hành vi bạn sắp đổi'}</td><td>${en ? 'Reformat or reorder the file' : 'Format lại hoặc sắp lại thứ tự trong tệp'}</td></tr>
<tr><td>${en ? 'Fix a typo in a comment on a line you changed' : 'Sửa lỗi chính tả trong comment của dòng bạn đã sửa'}</td><td>${en ? 'Upgrade a library “while you are there”' : 'Nâng phiên bản thư viện "tiện tay"'}</td></tr>
<tr><td>${en ? 'Extract a function, IDE-automated, to make the fix readable' : 'Tách một hàm bằng IDE để bản sửa dễ đọc'}</td><td>${en ? 'Change a convention (naming, error style) for the whole module' : 'Đổi quy ước (đặt tên, cách báo lỗi) cho cả module'}</td></tr>
</table>
<p>${en
  ? 'A simple test: could the reviewer approve your cleanup commit in under a minute without running anything? If not, it belongs in its own PR.'
  : 'Một phép thử đơn giản: người review có duyệt được commit dọn dẹp của bạn trong chưa tới một phút mà không cần chạy gì không? Nếu không, nó thuộc về một PR riêng.'}</p>

<h3>🕵️ ${en ? 'Security corner: when the code you see is not the code that runs (Trojan Source, 2021)' : 'Góc bảo mật: khi code bạn thấy không phải code chạy (Trojan Source, 2021)'}</h3>
<p>${en
  ? 'Conventions are also a defence. In November 2021 Nicholas Boucher and Ross Anderson (University of Cambridge) published <em>Trojan Source</em> (CVE-2021-42574): Unicode bidirectional control characters — meant for mixing Arabic or Hebrew with Latin text — can reorder how a line is <em>displayed</em> without changing how the compiler <em>reads</em> it. A reviewer sees a harmless line; the machine runs another. Reproduced in Node 22 with four invisible characters (U+202E, U+2066, U+2069) inside a string. A bidi-aware editor shows the second line as <code>if (vaiTro !== \'user\') { // chi admin moi qua</code> — it reads as “only someone who is not a plain user (an admin) gets in”. In reality the comment is <em>inside the string</em>:'
  : 'Quy ước cũng là một lớp phòng thủ. Tháng 11/2021, Nicholas Boucher và Ross Anderson (Đại học Cambridge) công bố <em>Trojan Source</em> (CVE-2021-42574): các ký tự điều khiển hai chiều của Unicode — sinh ra để trộn chữ Ả Rập hay Do Thái với chữ Latinh — có thể đảo cách một dòng được <em>hiển thị</em> mà không đổi cách trình biên dịch <em>đọc</em> nó. Người review thấy một dòng vô hại; máy chạy một dòng khác. Tái hiện trên Node 22 bằng bốn ký tự vô hình (U+202E, U+2066, U+2069) nằm trong một chuỗi. Trình soạn thảo hiểu hai chiều hiển thị dòng thứ hai thành <code>if (vaiTro !== \'user\') { // chi admin moi qua</code> — đọc lên như "chỉ ai không phải user thường (tức admin) mới vào được". Thật ra comment đó nằm <em>bên trong chuỗi</em>:'}</p>
${O81_TROJAN}
<p>${en
  ? 'The string is <code>"user" + invisible characters + "// chi admin moi qua" + …</code>, which is never equal to <code>user</code>, so <em>everyone</em> reaches the admin branch. How it is stopped: compilers and linters added warnings after the disclosure (Rust, GCC <code>-Wbidi-chars</code>), GitHub shows a banner on files containing bidirectional text since late 2021, and you can add a one-line rule — the <code>RegexpSingleline</code> on <code>[\\u202A-\\u202E\\u2066-\\u2069]</code> in the project rule set above. Old projects are a real target: nobody reads their diffs carefully, and they often accept patches from contractors.'
  : 'Chuỗi đó là <code>"user" + ký tự vô hình + "// chi admin moi qua" + …</code>, không bao giờ bằng <code>user</code>, nên <em>ai cũng</em> vào nhánh quản trị. Cách chặn: sau khi công bố, trình biên dịch và linter đã thêm cảnh báo (Rust, GCC <code>-Wbidi-chars</code>), GitHub hiện dải cảnh báo trên tệp chứa chữ hai chiều từ cuối 2021, và bạn có thể thêm một luật một dòng — chính <code>RegexpSingleline</code> trên <code>[\\u202A-\\u202E\\u2066-\\u2069]</code> trong bộ luật dự án ở trên. Dự án cũ là mục tiêu thật: không ai đọc kỹ diff của chúng, và chúng thường nhận bản vá từ nhà thầu bên ngoài.'}</p>

<h3>💼 ${en ? 'OJT situation: the customer’s coding-rules spreadsheet' : 'Tình huống OJT: tệp Excel quy tắc lập trình của khách'}</h3>
<p>${en
  ? 'Week two, a Japanese customer’s maintenance project. Your leader forwards an Excel file of 140 coding rules and says “follow it for new code”. The existing code breaks rule 37 (“no method longer than 50 lines”) in 30 places. Do not fix them in your ticket. Do this: (1) follow the sheet in the lines you write; (2) where the sheet and the existing code disagree <em>inside the function you are changing</em>, follow the existing code and ask in the Q&A list (agile-teamwork 9.5): “Rule 37 vs. existing BookServlet.doPost (111 lines) — keep the existing style in TV-108?”; (3) if there is a linter, encode the sheet’s rules as a gate for new code only, like <code>checkstyle-du-an.xml</code>. Customers notice and value this more than a perfectly formatted file.'
  : 'Tuần thứ hai, dự án bảo trì của một khách Nhật. Trưởng nhóm chuyển cho bạn tệp Excel 140 quy tắc lập trình và dặn "code mới theo cái này". Code đang có vi phạm quy tắc 37 ("không hàm nào dài quá 50 dòng") ở 30 chỗ. Đừng sửa chúng trong ticket của bạn. Hãy: (1) theo bảng quy tắc ở những dòng bạn viết; (2) chỗ nào bảng quy tắc và code đang có mâu thuẫn <em>ngay trong hàm bạn đang đổi</em>, theo code đang có và hỏi trong Q&A list (agile-teamwork 9.5): "Quy tắc 37 so với BookServlet.doPost hiện có (111 dòng) — trong TV-108 giữ kiểu hiện có được không?"; (3) nếu có linter, mã hoá các quy tắc thành cổng chặn chỉ cho code mới, như <code>checkstyle-du-an.xml</code>. Khách để ý và đánh giá cao điều này hơn một tệp được format hoàn hảo.'}</p>

<h3>🎤 ${en ? 'What the interviewer will ask' : 'Phỏng vấn viên sẽ hỏi'}</h3>
<ol>
<li><strong>${en ? '“The project’s style is different from what you like. What do you do?”' : '"Style của dự án khác với cái em thích. Em làm gì?"'}</strong><br>${en
  ? 'Follow it. Consistency is worth more than any individual style, because it keeps diffs small and history readable. If I think a change is worth it, I propose it once with a cost/benefit and apply it only after the team agrees — never inside a bug fix.'
  : 'Theo nó. Sự nhất quán đáng giá hơn mọi style cá nhân, vì nó giữ diff nhỏ và lịch sử đọc được. Nếu em thấy đổi là đáng, em đề xuất một lần kèm lợi/hại và chỉ áp dụng khi đội đồng ý — không bao giờ lẫn vào một bản sửa lỗi.'}</li>
<li><strong>${en ? '“Why not just run the formatter on the file you touch?”' : '"Sao không chạy formatter cho tệp mình chạm vào luôn?"'}</strong><br>${en
  ? 'It hides the real change from the reviewer, rewrites git blame for every line, and creates conflicts for colleagues with open branches. If the team wants formatting, it is one agreed commit plus <code>.git-blame-ignore-revs</code>, or a ratchet on touched files.'
  : 'Nó che thay đổi thật khỏi mắt người review, viết lại git blame cho mọi dòng, và gây xung đột cho đồng đội đang có nhánh mở. Nếu đội muốn format, đó là một commit đã thống nhất kèm <code>.git-blame-ignore-revs</code>, hoặc kiểu bánh cóc chỉ trên tệp được chạm.'}</li>
<li><strong>${en ? '“How do you find the conventions of a project with no documentation?”' : '"Dự án không có tài liệu, em tìm quy ước bằng cách nào?"'}</strong><br>${en
  ? 'Look for config files and the PR template first, then measure the code: indentation, quotes, naming, error handling, commit messages; read a few recent merged PRs and their review comments. Then write what I measured into .editorconfig / a linter config that reports zero on today’s code.'
  : 'Tìm tệp cấu hình và mẫu PR trước, rồi đo code: thụt lề, dấu nháy, đặt tên, cách xử lý lỗi, lời commit; đọc vài PR đã merge gần đây cùng nhận xét review. Sau đó ghi điều đo được vào .editorconfig / cấu hình linter sao cho báo không lỗi trên code hôm nay.'}</li>
<li><strong>${en ? '“What is the Boy Scout rule, and when does it go wrong?”' : '"Luật Hướng đạo sinh là gì, và khi nào nó thành sai?"'}</strong><br>${en
  ? 'Leave code a bit cleaner than you found it. It goes wrong when “a bit” becomes a refactoring the reviewer cannot verify quickly, when it mixes with a behaviour change, or when it spreads outside the code you are changing.'
  : 'Để code sạch hơn một chút so với lúc bạn đến. Nó thành sai khi "một chút" biến thành một đợt refactor người review không kiểm nhanh được, khi nó trộn với thay đổi hành vi, hoặc khi nó lan ra ngoài phần code bạn đang sửa.'}</li>
</ol>

<h3>✍️ ${en ? 'Exercise' : 'Bài tập'}</h3>
<p>${en
  ? 'On your copy (branch <code>ch7</code>): (1) measure the Node API’s conventions and write <code>legacy-express/.editorconfig</code> plus an ESLint rule set that reports <strong>zero</strong> on today’s code (hint: start from lesson 4.4’s config, keep only style rules); (2) run Prettier with defaults on one file, commit it on a throw-away branch, and use <code>git blame</code> with and without <code>--ignore-rev</code> to find who wrote the line that answers 400 “thieu docGia hoac sach”; (3) find one place where the Chapter 5 refactoring did <em>not</em> follow the original conventions and write the one-sentence review comment you would leave.'
  : 'Trên bản của bạn (nhánh <code>ch7</code>): (1) đo quy ước của API Node rồi viết <code>legacy-express/.editorconfig</code> cùng một bộ luật ESLint báo <strong>không</strong> lỗi trên code hôm nay (gợi ý: bắt đầu từ cấu hình của bài 4.4, chỉ giữ luật về style); (2) chạy Prettier mặc định trên một tệp, commit trên một nhánh nháp, rồi dùng <code>git blame</code> có và không có <code>--ignore-rev</code> để tìm ai viết dòng trả 400 "thieu docGia hoac sach"; (3) tìm một chỗ mà đợt refactor Chương 5 <em>không</em> theo quy ước gốc và viết câu nhận xét review một câu bạn sẽ để lại.'}</p>
${giai(en ? '🔑 Answers' : '🔑 Đáp án', `<ol>
<li>${en ? '<code>indent_size = 2</code> for <code>*.js</code>/<code>*.json</code>; ESLint: <code>quotes: [error, single, {avoidEscape: true}]</code>, <code>indent: [error, 2]</code>, <code>no-var: off</code>, <code>prefer-arrow-callback: off</code>, <code>space-before-function-paren: [error, {anonymous: always, named: never}]</code>. Verify with <code>npx eslint . --max-warnings 0</code>.' : '<code>indent_size = 2</code> cho <code>*.js</code>/<code>*.json</code>; ESLint: <code>quotes: [error, single, {avoidEscape: true}]</code>, <code>indent: [error, 2]</code>, <code>no-var: off</code>, <code>prefer-arrow-callback: off</code>, <code>space-before-function-paren: [error, {anonymous: always, named: never}]</code>. Kiểm bằng <code>npx eslint . --max-warnings 0</code>.'}</li>
<li>${en ? 'Without the option: you, today. With it: <code>df6b894 Lan</code> (the commit “api muon sach cho app mobile”).' : 'Không có tuỳ chọn: chính bạn, hôm nay. Có tuỳ chọn: <code>df6b894 Lan</code> (commit "api muon sach cho app mobile").'}</li>
<li>${en ? 'Example: “The rest of the codebase names methods in English (<code>findAll</code>, <code>makeToken</code>); could we keep <code>timPhieuCanTra</code> → <code>findLoanToReturn</code> consistent, or agree on Vietnamese names for new code?”' : 'Ví dụ: "Phần còn lại của code đặt tên hàm tiếng Anh (<code>findAll</code>, <code>makeToken</code>); mình giữ thống nhất <code>timPhieuCanTra</code> → <code>findLoanToReturn</code>, hay thống nhất dùng tên tiếng Việt cho code mới?"'}</li>
</ol>`)}

<h3>🗂 ${en ? 'Key terms' : 'Thuật ngữ trong bài'}</h3>
${thuatNgu(en, [
  ['Convention', 'quy ước', 'Luật đội theo để code trông như một người viết; có loại viết ra và loại ngầm.', 'Rules a team follows so code looks written by one person; written or unwritten.'],
  ['EditorConfig', 'EditorConfig', 'Tệp .editorconfig mọi trình soạn thảo đọc: thụt lề, bảng mã, xuống dòng theo loại tệp.', 'The .editorconfig file editors read: indentation, charset, line endings per file type.'],
  ['Linter / Checkstyle', 'công cụ soát kiểu', 'Công cụ soát code theo bộ luật; ở dự án cũ dùng làm cổng chặn cho code mới.', 'A tool checking code against rules; on legacy code, a gate for new code.'],
  ['Formatter', 'công cụ định dạng', 'Prettier, google-java-format: tự viết lại khoảng trắng và ngắt dòng.', 'Prettier, google-java-format: rewrite whitespace and line breaks automatically.'],
  ['.git-blame-ignore-revs', 'danh sách commit bỏ qua khi blame', 'Liệt kê commit chỉ đổi định dạng để blame chỉ về người viết thật.', 'Lists formatting-only commits so blame points at the real author.'],
  ['Ratchet', 'bánh cóc', 'Chỉ kiểm/format tệp mà PR chạm vào; code hội tụ dần.', 'Check/format only files a PR touches; the code converges over time.'],
  ['Boy Scout rule', 'luật Hướng đạo sinh', 'Để code sạch hơn một chút — trong giới hạn người review kiểm nhanh được.', 'Leave code slightly cleaner — within what a reviewer can verify quickly.'],
  ['Trojan Source', 'Trojan Source', 'CVE-2021-42574: ký tự hai chiều làm code hiển thị khác code chạy.', 'CVE-2021-42574: bidi characters make displayed code differ from executed code.'],
])}

<h3>📌 ${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'Find written conventions first; old projects rarely have any, so measure the code (and the commit log).' : 'Tìm quy ước viết ra trước; dự án cũ hiếm khi có, nên hãy đo code (và lịch sử commit).'}</li>
<li>${en ? 'Write what you measured into .editorconfig and a linter rule set that reports zero today — a gate for new code. Expect your first guess to be wrong.' : 'Ghi điều đo được vào .editorconfig và bộ luật linter báo không lỗi hôm nay — cổng chặn cho code mới. Lần đoán đầu thường sai.'}</li>
<li>${en ? 'Reformatting whole files costs blame, review and colleagues’ branches; if the team wants it, one agreed commit + ignore-revs, or a ratchet.' : 'Format lại cả tệp làm mất blame, khó review và gây xung đột nhánh của đồng đội; nếu đội muốn, một commit đã thống nhất + ignore-revs, hoặc bánh cóc.'}</li>
<li>${en ? 'Boy Scout cleanups stay small, separate and quick to review; anything bigger is its own ticket.' : 'Dọn dẹp kiểu Hướng đạo sinh phải nhỏ, tách riêng, duyệt nhanh; lớn hơn thì là ticket riêng.'}</li>
</ul>
${tl('https://editorconfig.org', '📐', 'EditorConfig', en ? 'Specification and editor support' : 'Đặc tả và trình soạn thảo hỗ trợ')}
${tl('https://checkstyle.org/checks.html', '✅', 'Checkstyle — Checks', en ? 'Every rule used above, with options' : 'Mọi luật dùng ở trên, kèm tuỳ chọn')}
${tl('https://git-scm.com/docs/git-blame#Documentation/git-blame.txt---ignore-revs-fileltfilegt', '🌿', 'git blame --ignore-revs-file', en ? 'Official documentation' : 'Tài liệu chính thức')}
${tl('https://trojansource.codes', '🕵️', 'Trojan Source (Boucher & Anderson, 2021)', en ? 'Paper, examples, CVE-2021-42574' : 'Bài báo, ví dụ, CVE-2021-42574')}
${lk(bai('agile-teamwork', 'agl-3-1-quy-uoc'), '🤝', en ? 'Agile teamwork 3.1 — Team conventions: branches and commits' : 'Agile teamwork 3.1 — Quy ước đội: nhánh và commit', en ? 'Branch and commit conventions for a team' : 'Quy ước nhánh và commit cho một đội')}
${lk(bai('git', 'git-2-3-blame-va-pickaxe'), '🌿', en ? 'Git 2.3 — blame and the pickaxe' : 'Git 2.3 — blame và cái cuốc chim', en ? 'Why history must stay readable' : 'Vì sao lịch sử phải còn đọc được')}
`);

/* ═══════════════════ 8.2 — Bản sửa tối thiểu ═══════════════════ */
const O82_TICKET = out(`
TV-108  Kho ghi thừa sách sau khi trả                       Ưu tiên: Cao · Người báo: chị Hoa (thủ thư) · Môi trường: production
Mô tả: Màn hình "Sách" ghi còn 5 cuốn "Lập trình Java căn bản" nhưng trên kệ chỉ có 4. Hôm đó mạng chậm, em có bấm "Trả" hai lần
       cho phiếu của bạn Bình. Lần hai vẫn báo "Trả sách thành công".
Mong muốn: Số cuốn còn lại đúng với kệ.
`);
const O82_UOC = out(`
TV-108 — ước lượng (sau 30 phút đọc code + chạy test có sẵn)
Đã tái hiện: có, bằng test traHaiLanCungMotPhieu (khoá hành vi từ bài 3.1) — lần trả thứ hai cộng thêm 1 bản.
Ba điểm: lạc quan 1 giờ · khả dĩ 3 giờ · bi quan 8 giờ (nếu phải sửa dữ liệu production đã lệch)
        ⇒ (1 + 4×3 + 8) / 6 ≈ 3,5 giờ; báo PM "nửa ngày, trong đó có phần kiểm dữ liệu".
Chưa biết: dữ liệu production đã lệch bao nhiêu (cần chạy truy vấn kiểm — xin quyền đọc bản sao CSDL).
Ngoài phạm vi: số liệu sách 7 lệch (thấy khi kiểm, chiều ngược lại — hỏi thủ thư, mở ticket riêng nếu cần).
`);
const J82_TEST = java(`
    @Test
    void traHaiLanCungMotPhieu_lanHaiBiTuChoi_TV108() throws Exception {
        tra("2");
        assertEquals("readers?msg=Phiếu này đã trả rồi", tra("2"));
        // sách 1: 5 bản, phiếu 1 vẫn đang giữ 1 bản ⇒ còn 4 (trước TV-108: CSDL ghi 5 — một bản sách ma)
        assertEquals(4, DuLieuTest.so("SELECT available FROM books WHERE id = 1"));
    }
`);
const O82_DO = out(`
$ mvn -B -o test -Dtest=BookServletTraSachTest
[ERROR] Tests run: 6, Failures: 1, Errors: 0, Skipped: 0, Time elapsed: 0.779 s <<< FAILURE! -- in com.thuvien.servlet.BookServletTraSachTest
[ERROR]   BookServletTraSachTest.traHaiLanCungMotPhieu_lanHaiBiTuChoi_TV108:83 expected: <readers?msg=Phiếu này đã trả rồi> but was: <readers?msg=Trả sách thành công>
[INFO] BUILD FAILURE
`);
const O82_DIFF = out(`
$ git diff -- src/main
--- a/src/main/java/com/thuvien/dao/PhieuMuonDAO.java
+++ b/src/main/java/com/thuvien/dao/PhieuMuonDAO.java
-    /** null nếu không có phiếu. Giữ nguyên: KHÔNG lọc return_date IS NULL ⇒ trả lần hai vẫn tìm thấy (test traHaiLanCungMotPhieu). */
+    /** null nếu không có phiếu. Không lọc return_date: phiếu đã trả vẫn tìm thấy — chặn trả lần hai nằm ở ghiTra (TV-108). */
     public PhieuCanTra timPhieuCanTra(int loanId) throws SQLException {
@@
-    public void ghiTra(int loanId, Timestamp ngayTra, Tien phi) throws SQLException {
-        PreparedStatement ps = con.prepareStatement("UPDATE loans SET return_date = ?, fine = ? WHERE id = ?");
+    /** Số dòng đã ghi: 0 nghĩa là phiếu đã trả trước đó (TV-108 — kể cả hai cú bấm cùng lúc, vì MySQL khoá dòng khi UPDATE). */
+    public int ghiTra(int loanId, Timestamp ngayTra, Tien phi) throws SQLException {
+        PreparedStatement ps = con.prepareStatement("UPDATE loans SET return_date = ?, fine = ? WHERE id = ? AND return_date IS NULL");
         try {
             ps.setTimestamp(1, ngayTra);
             ps.setDouble(2, phi.soDong());   // cột fine vẫn là double — đổi schema là việc khác
             ps.setInt(3, loanId);
-            ps.executeUpdate();
+            return ps.executeUpdate();
--- a/src/main/java/com/thuvien/service/MuonTraService.java
+++ b/src/main/java/com/thuvien/service/MuonTraService.java
         Tien phi = phieu.phiTre(bayGio.getAsLong());
-        dao.ghiTra(loanId, new Timestamp(bayGio.getAsLong()), phi);
+        if (dao.ghiTra(loanId, new Timestamp(bayGio.getAsLong()), phi) == 0) return new KetQua("readers", "Phiếu này đã trả rồi", false);
         dao.congLaiSach(phieu.bookId);
`);
const O82_SUA1 = out(`
$ mvn -B -o test
[ERROR]   MuonTraServiceTest.traTre9Ngay1Gio_phi18000:35 expected: <Trả sách. Phí trễ hạn: 18000.0> but was: <Phiếu này đã trả rồi>
[ERROR] Tests run: 49, Failures: 1, Errors: 0, Skipped: 0
[INFO] BUILD FAILURE
`);
const J82_MOCK = java(`
    @Test
    void traTre9Ngay1Gio_phi18000() throws Exception {
        when(dao.timPhieuCanTra(1)).thenReturn(phieu(LoaiDocGia.SV, "2026-11-15T09:00:00+07:00"));
        when(dao.ghiTra(anyInt(), any(), any())).thenReturn(1);          // hợp đồng mới: "đã ghi 1 dòng"
        ...
    }

    @Test
    void ghiTraKhongDongNao_daTraRoi_khongCongSach_TV108() throws Exception {
        when(dao.timPhieuCanTra(1)).thenReturn(phieu(LoaiDocGia.SV, "2026-11-30T09:00:00+07:00"));
        when(dao.ghiTra(anyInt(), any(), any())).thenReturn(0);          // lượt kia đã ghi trước
        assertEquals("Phiếu này đã trả rồi", dichVu.tra("1").thongBao());
        verify(dao, never()).congLaiSach(anyInt());
    }
`);
const O82_XANH = out(`
$ mvn -B -o test
[INFO] Tests run: 50, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
$ git show --stat --format="%h %s" HEAD
52a1c54 fix(TV-108): tra lan hai cung mot phieu bi tu choi, khong cong sach ma
 src/main/java/com/thuvien/dao/PhieuMuonDAO.java               | 9 +++++----
 src/main/java/com/thuvien/service/MuonTraService.java         | 2 +-
 src/test/java/com/thuvien/service/MuonTraServiceTest.java     | 9 +++++++++
 src/test/java/com/thuvien/servlet/BookServletTraSachTest.java | 9 ++++-----
 4 files changed, 19 insertions(+), 10 deletions(-)
`);
const O82_HAIPHIEN = out(`
# phiên A (một cú bấm) — giữ giao dịch 3 giây          # phiên B (cú bấm thứ hai) — bắt đầu sau A 1 giây
BEGIN;
UPDATE loans SET return_date = NOW(), fine = 0 WHERE id = 2 AND return_date IS NULL;
A: 1 dong, giu khoa 3 giay
                                                        B: bat dau 00:19:15.186000
                                                        UPDATE loans SET return_date = NOW(), fine = 0 WHERE id = 2 AND return_date IS NULL;
                                                        (đứng chờ khoá dòng của A…)
COMMIT;
A: commit luc 00:19:17.176000
                                                        B: 0 dong, xong luc 00:19:17.177000
`);
const O82_TACH = out(`
$ git diff --shortstat ch8 tv-108-tron      # PR bạn định mở: sửa lỗi + "format lại cho dễ đọc"
 31 files changed, 583 insertions(+), 252 deletions(-)
$ git diff --shortstat ch8 tv-108           # PR 1: chỉ bản sửa
 4 files changed, 19 insertions(+), 10 deletions(-)
$ git checkout -b format-aosp tv-108 && git ls-files "src/*.java" | xargs google-java-format --aosp --replace && git commit -qam "style: ..."
$ git diff --shortstat tv-108 format-aosp   # PR 2: chỉ định dạng, đặt SAU PR 1
 31 files changed, 570 insertions(+), 248 deletions(-)
$ git diff --stat tv-108-tron format-aosp   # hai PR cộng lại có đúng bằng PR gộp?
$                                            (rỗng: giống hệt từng byte)
`);
const O82_LUOT2 = out(`
$ git ls-files "src/*.java" | xargs google-java-format --aosp --dry-run   # người review tự kiểm PR 2: còn tệp nào chưa đúng định dạng?
src/main/java/com/thuvien/dao/BookDAO.java
src/main/java/com/thuvien/dao/PhieuMuonDAO.java
src/main/java/com/thuvien/dao/ThongKeDAO.java
... (8 tệp)
$ git ls-files "src/*.java" | xargs google-java-format --aosp --replace && git diff --shortstat   # lượt 2
 8 files changed, 17 insertions(+), 17 deletions(-)
$ git diff src/main/java/com/thuvien/dao/ThongKeDAO.java | sed -n 5,9p
                     st.executeQuery(
                             "SELECT COUNT(*) FROM loans WHERE return_date IS NULL AND due_date <"
-                                + " NOW()");
+                                    + " NOW()");
$ git ls-files "src/*.java" | xargs google-java-format --aosp --dry-run   # lượt 3
$                                                                          (rỗng: ổn định)
$ mvn -B -o test                                                           # trên nhánh format-aosp (2 lượt)
[INFO] Tests run: 50, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
`);

const L82 = ml((en) => `
<span class="eyebrow">${en ? 'Chapter 8 · Fixing bugs in someone else’s code' : 'Chương 8 · Sửa lỗi trong code của người khác'}</span>
<h2>${en ? '8.2 — The minimal fix: test first, smallest change, separate cleanup PR' : '8.2 — Bản sửa tối thiểu: test trước, thay đổi nhỏ nhất, PR dọn dẹp tách riêng'}</h2>
<p class="lead">${en
  ? 'A plumber called for a leaking pipe replaces the leaking section, shows you it no longer drips, and tells you the other pipes are old too. They do not retile the bathroom. This lesson fixes a real bug in the library app the same way — one ticket, one red test, nineteen added lines — and then deals with the situation every intern meets: the leader who says “this PR is 900 lines, split it”.'
  : 'Thợ ống nước được gọi tới vì ống rò sẽ thay đúng đoạn rò, cho bạn thấy nó hết nhỏ giọt, rồi nói thêm rằng mấy đoạn ống kia cũng cũ rồi. Họ không lát lại cả nhà tắm. Bài này sửa một lỗi thật trong ứng dụng thư viện đúng như vậy — một ticket, một test đỏ, mười chín dòng thêm — rồi xử lý tình huống thực tập sinh nào cũng gặp: trưởng nhóm bảo "PR này 900 dòng, tách ra".'}</p>
${moiTruong(en)}

<h3>${en ? 'Step 0: receive the ticket — reproduce before you estimate' : 'Bước 0: nhận ticket — tái hiện trước khi ước lượng'}</h3>
${O82_TICKET}
<p>${en
  ? 'Before touching code, do three things. <strong>Restate it</strong> as “when … then … expected …”: <em>when a loan that is already returned is returned again, the system says success and adds one copy; expected: refuse, and do not add a copy</em>. <strong>Reproduce it</strong> — and here the Chapter 3 safety net pays off: the characterization test <code>traHaiLanCungMotPhieu</code> already locks exactly this behaviour (it asserts the wrong “success” and the ghost copy). If you cannot reproduce a ticket, say so within the first hour and ask for data or steps; do not guess-fix. <strong>Estimate</strong> with a range, not a single number. A three-point estimate (optimistic, most likely, pessimistic; weighted average (O + 4M + P) / 6) gives the PM what they need, including what is still unknown:'
  : 'Trước khi chạm vào code, làm ba việc. <strong>Viết lại</strong> theo dạng "khi … thì … mong đợi …": <em>khi trả lại một phiếu đã trả, hệ thống báo thành công và cộng một bản sách; mong đợi: từ chối, không cộng</em>. <strong>Tái hiện</strong> — và ở đây tấm lưới Chương 3 trả công: characterization test <code>traHaiLanCungMotPhieu</code> đã khoá đúng hành vi này (nó khẳng định cái "thành công" sai và bản sách ma). Nếu không tái hiện được ticket, hãy nói ngay trong giờ đầu và xin dữ liệu hoặc các bước; đừng đoán mà sửa. <strong>Ước lượng</strong> bằng một khoảng, không phải một con số. Ước lượng ba điểm (lạc quan, khả dĩ, bi quan; trung bình có trọng số (O + 4M + P) / 6) cho PM đủ thứ họ cần, kể cả điều còn chưa biết:'}</p>
${O82_UOC}
<div class="callout"><p>${en
  ? '<strong>Severity is not your call alone.</strong> This bug corrupts stock numbers, so it is “High” even though nobody is blocked. In outsourcing, severity and priority are usually set with the customer; the estimate is yours. How to estimate in man-days, with buffers and WBS, is taught in agile-teamwork 9.6 — here we only add the maintenance part: <em>investigation is timeboxed</em> (“I will spend at most 2 hours finding the cause, then report”).'
  : '<strong>Mức nghiêm trọng không do một mình bạn quyết.</strong> Lỗi này làm sai số tồn kho, nên là "Cao" dù không ai bị chặn việc. Ở outsourcing, mức nghiêm trọng và độ ưu tiên thường chốt cùng khách; ước lượng là việc của bạn. Ước lượng bằng man-day, có dự phòng và WBS, được dạy ở agile-teamwork 9.6 — ở đây chỉ thêm phần riêng của bảo trì: <em>điều tra có giới hạn thời gian</em> ("em dành tối đa 2 giờ tìm nguyên nhân, rồi báo lại").'}</p></div>

<h3>${en ? 'Step 1: the red test is the specification' : 'Bước 1: test đỏ chính là đặc tả'}</h3>
<p>${en
  ? 'Change the characterization test from “this is what it does” to “this is what it must do”, and rename it so its history tells the story (the <code>_BUG</code> / ticket-suffix convention from Chapter 3):'
  : 'Đổi characterization test từ "nó đang làm thế này" sang "nó phải làm thế này", và đổi tên để lịch sử tự kể chuyện (quy ước hậu tố <code>_BUG</code> / mã ticket của Chương 3):'}</p>
${J82_TEST}
${O82_DO}
<p>${en
  ? 'Red, for the right reason: the message says exactly what the ticket says. Do not commit a red test on its own — every commit stays green; the test and the fix travel together.'
  : 'Đỏ, và đỏ đúng lý do: thông báo nói đúng điều ticket nói. Đừng commit riêng một test đỏ — commit nào cũng phải xanh; test và bản sửa đi cùng nhau.'}</p>

<h3>${en ? 'Step 2: the smallest change that is actually correct' : 'Bước 2: thay đổi nhỏ nhất mà thật sự đúng'}</h3>
<p>${en
  ? 'The obvious “minimal” fix is to filter <code>return_date IS NULL</code> in the SELECT that finds the loan. It makes the test green — and it is still wrong, because it is <em>check-then-act</em>: two clicks arriving together both SELECT before either UPDATEs, both see an open loan, both add a copy. The ticket literally says “the network was slow and I clicked twice”. The smallest correct change moves the check into the write itself: update only if not yet returned, and look at how many rows were updated.'
  : 'Bản sửa "tối thiểu" hiển nhiên là lọc <code>return_date IS NULL</code> trong câu SELECT tìm phiếu. Nó làm test xanh — mà vẫn sai, vì nó là kiểu <em>kiểm-rồi-làm</em> (check-then-act): hai cú bấm tới cùng lúc đều SELECT trước khi bên nào UPDATE, đều thấy phiếu còn mở, đều cộng một bản. Ticket nói rõ "mạng chậm, em bấm hai lần". Thay đổi nhỏ nhất mà đúng là đưa phép kiểm vào ngay câu ghi: chỉ cập nhật nếu chưa trả, rồi xem đã cập nhật bao nhiêu dòng.'}</p>
${O82_DIFF}
<p>${en
  ? 'Does the database really serialise two clicks? Do not believe the comment — prove it. Two MySQL sessions, B starting one second after A:'
  : 'CSDL có thật sự xếp hàng hai cú bấm không? Đừng tin comment — chứng minh đi. Hai phiên MySQL, B bắt đầu sau A một giây:'}</p>
${O82_HAIPHIEN}
<p>${en
  ? 'B waited for A’s row lock (about two seconds), then found <code>return_date</code> already set and updated 0 rows — so only one copy is added. InnoDB re-reads the row after the lock is released for an <code>UPDATE … WHERE</code>; that is why the condition belongs in the UPDATE and not in an earlier SELECT.'
  : 'B đứng chờ khoá dòng của A (khoảng hai giây), rồi thấy <code>return_date</code> đã có và cập nhật 0 dòng — nên chỉ một bản được cộng. Với <code>UPDATE … WHERE</code>, InnoDB đọc lại dòng sau khi khoá được nhả; vì vậy điều kiện phải nằm trong UPDATE chứ không phải trong một câu SELECT trước đó.'}</p>

<h3>${en ? 'Step 3: run everything — the net catches a changed contract' : 'Bước 3: chạy toàn bộ — tấm lưới bắt được hợp đồng đã đổi'}</h3>
${O82_SUA1}
<p>${en
  ? 'Not a new bug: <code>MuonTraServiceTest</code> uses a Mockito mock of the DAO, and a mocked method returning <code>int</code> returns 0 by default — which now means “already returned”. The fix changed the DAO’s contract from <code>void</code> to “number of rows written”, and the unit test noticed. Update the mock to the new contract and add the case the fix is about, at the cheap level (no database):'
  : 'Không phải lỗi mới: <code>MuonTraServiceTest</code> dùng mock Mockito của DAO, và một hàm bị mock trả <code>int</code> thì mặc định trả 0 — giờ nghĩa là "đã trả rồi". Bản sửa đã đổi hợp đồng của DAO từ <code>void</code> sang "số dòng đã ghi", và test đơn vị nhận ra. Cập nhật mock theo hợp đồng mới và thêm đúng trường hợp của bản sửa, ở tầng rẻ (không cần CSDL):'}</p>
${J82_MOCK}
${O82_XANH}
<p>${en
  ? 'Nineteen lines added, ten removed, four files, two of them tests. What is <em>not</em> in the diff matters as much: no reformatting, no renaming <code>ghiTra</code>, no transaction around update-and-increment (a real but older risk — mentioned in the PR, lesson 8.3), no fix for book 7’s numbers. A reviewer can read this in five minutes and answer one question: “is the UPDATE condition right?”'
  : 'Mười chín dòng thêm, mười dòng bớt, bốn tệp, hai trong đó là test. Thứ <em>không</em> có trong diff cũng quan trọng không kém: không format lại, không đổi tên <code>ghiTra</code>, không bọc giao dịch quanh cập nhật-và-cộng (rủi ro thật nhưng có từ trước — ghi trong PR, bài 8.3), không sửa số liệu sách 7. Người review đọc xong trong năm phút và chỉ cần trả lời một câu: "điều kiện UPDATE có đúng không?"'}</p>
<div class="callout"><p>${en
  ? '<strong>Why “five minutes” is not a slogan.</strong> Google’s public engineering-practices guide says about 100 changed lines is usually a reasonable size and 1,000 is usually too large. The Cisco/SmartBear code-review study (2006, 2,500 reviews) found reviewers’ ability to find defects drops sharply beyond 200–400 lines at a time. A 19-line fix gets a real review; an 835-line one gets a rubber stamp.'
  : '<strong>Vì sao "năm phút" không phải khẩu hiệu.</strong> Hướng dẫn engineering practices công khai của Google nói khoảng 100 dòng thay đổi thường là cỡ hợp lý, 1.000 dòng thường là quá lớn. Nghiên cứu review của Cisco/SmartBear (2006, 2.500 lượt review) thấy khả năng tìm lỗi của người review giảm mạnh khi vượt 200–400 dòng một lần. Bản sửa 19 dòng được review thật; bản 835 dòng chỉ được đóng dấu cho qua.'}</p></div>

<h3>💼 ${en ? 'OJT situation: “this PR is 900 lines — split it”' : 'Tình huống OJT: "PR này 900 dòng — tách ra"'}</h3>
<p>${en
  ? 'You fixed TV-108, and since IntelliJ had the files open you also ran “Reformat Code” on the project “to make it easier to read”. The leader’s comment is one line: <em>“Please split: fix in one PR, formatting (if we want it) in another.”</em> Do not untangle 835 lines by hand. Use the fact that a formatter is <strong>deterministic</strong>: redo the small fix on a clean branch (it is 19 lines — faster than surgery), then regenerate the formatting on top, and prove the two together equal what you had:'
  : 'Bạn đã sửa TV-108, và vì IntelliJ đang mở sẵn các tệp nên bạn chạy luôn "Reformat Code" cho cả dự án "cho dễ đọc". Nhận xét của trưởng nhóm đúng một dòng: <em>"Em tách ra nhé: bản sửa một PR, format (nếu đội muốn) một PR khác."</em> Đừng gỡ 835 dòng bằng tay. Hãy dùng việc formatter là <strong>tất định</strong> (deterministic): làm lại bản sửa nhỏ trên một nhánh sạch (19 dòng — nhanh hơn mổ xẻ), rồi sinh lại phần định dạng ở trên nó, và chứng minh hai phần cộng lại bằng đúng thứ bạn đã có:'}</p>
${O82_TACH}
<p>${en
  ? 'An empty <code>git diff</code> between the mixed branch and the two-PR stack is the proof that nothing was lost or added. PR 1 gets a real review; PR 2 needs none beyond “the reviewer re-runs the same command and gets no diff”. Which leads to a real surprise from this repository:'
  : 'Một <code>git diff</code> rỗng giữa nhánh trộn và chồng hai PR là bằng chứng không mất, không thêm gì. PR 1 được review thật; PR 2 không cần review gì ngoài "người review chạy lại đúng lệnh đó và không thấy diff". Và điều đó dẫn tới một bất ngờ thật từ chính repo này:'}</p>
${O82_LUOT2}
<p>${en
  ? 'google-java-format 1.27.0 needed <strong>two passes</strong> to become stable on this code: the first pass splits long SQL strings, the second re-indents the new continuation lines. If PR 2 had been made with one pass, the CI format check (which runs <code>--dry-run</code>) would fail on it. Lesson: a formatting PR is produced by exactly the command CI runs, repeated until <code>--dry-run</code> prints nothing, with the formatter version pinned. And it still needs the full test run — 50 green — because “only whitespace” is a claim, not a proof.'
  : 'google-java-format 1.27.0 cần <strong>hai lượt</strong> mới ổn định trên code này: lượt đầu cắt chuỗi SQL dài, lượt hai thụt lại các dòng nối mới sinh. Nếu PR 2 làm bằng một lượt, bước kiểm định dạng của CI (chạy <code>--dry-run</code>) sẽ báo hỏng ngay trên nó. Bài học: PR định dạng phải sinh bằng đúng lệnh CI chạy, lặp tới khi <code>--dry-run</code> không in gì, với phiên bản formatter được ghim. Và vẫn phải chạy đủ test — 50 xanh — vì "chỉ là khoảng trắng" là một lời khẳng định, chưa phải bằng chứng.'}</p>
<p>${en
  ? 'When the mixed parts are not machine-generated (a hand-made rename plus a fix), use the same idea manually: create the fix branch from the base, and bring only the hunks you want with <code>git checkout -p mixed-branch -- file</code> or <code>git add -p</code> (git course 1.3); commit each intention separately; finish with the same empty-diff proof.'
  : 'Khi phần trộn không do máy sinh (một lần đổi tên làm tay cộng một bản sửa), dùng cùng ý tưởng bằng tay: tạo nhánh sửa từ gốc, chỉ mang sang các khối thay đổi bạn muốn bằng <code>git checkout -p nhanh-tron -- tep</code> hoặc <code>git add -p</code> (khoá git 1.3); mỗi ý định một commit; kết thúc bằng đúng phép chứng minh diff rỗng.'}</p>

<h3>🕵️ ${en ? 'Real incident: a small change with a global blast radius (Cloudflare, 2 July 2019)' : 'Sự cố thật: thay đổi nhỏ, vùng ảnh hưởng toàn cầu (Cloudflare, 2/7/2019)'}</h3>
<p>${en
  ? 'On 2 July 2019 a single new rule for Cloudflare’s Web Application Firewall, containing one badly-backtracking regular expression, was deployed to every server at once. CPU went to 100% worldwide and Cloudflare-proxied sites returned 502 errors for about 27 minutes. The change was tiny — that is the point: <em>minimal</em> is about the diff and the blast radius together. The post-mortem’s fixes were about the second half: staged rollout, a kill switch, and testing the performance of rules before release. For your maintenance PRs that means: a small diff, a note on who is affected (lesson 8.3), and a way back (revert, feature flag, or a deploy to staging first).'
  : 'Ngày 2/7/2019, một luật mới duy nhất của tường lửa ứng dụng web (WAF) của Cloudflare, chứa một biểu thức chính quy quay lui tệ, được triển khai lên mọi máy chủ cùng lúc. CPU lên 100% trên toàn thế giới và các trang đi qua Cloudflare trả lỗi 502 khoảng 27 phút. Thay đổi rất nhỏ — chính là điểm mấu chốt: <em>tối thiểu</em> là nói về cả diff lẫn vùng ảnh hưởng. Các biện pháp sau sự cố đều nhắm vào nửa thứ hai: triển khai theo từng nhóm, công tắc ngắt khẩn cấp, và đo hiệu năng của luật trước khi phát hành. Với PR bảo trì của bạn, điều đó nghĩa là: diff nhỏ, ghi rõ ai bị ảnh hưởng (bài 8.3), và một đường lùi (revert, cờ tính năng, hoặc lên staging trước).'}</p>

<h3>🎤 ${en ? 'What the interviewer will ask' : 'Phỏng vấn viên sẽ hỏi'}</h3>
<ol>
<li><strong>${en ? '“Walk me through how you fix a bug in code you have never seen.”' : '"Kể em sửa một lỗi trong code chưa từng thấy như thế nào."'}</strong><br>${en
  ? 'Restate and reproduce it; find the code path (lesson 2.2); write a failing test that expresses the expected behaviour; make the smallest correct change; run the whole suite; open a small PR that explains the root cause, impact, how I tested and the risks.'
  : 'Viết lại và tái hiện; tìm đường đi của code (bài 2.2); viết một test đỏ diễn đạt hành vi mong đợi; làm thay đổi nhỏ nhất mà đúng; chạy toàn bộ test; mở một PR nhỏ giải thích nguyên nhân gốc, ảnh hưởng, cách đã kiểm và rủi ro.'}</li>
<li><strong>${en ? '“What is wrong with check-then-act? Give an example.”' : '"Check-then-act sai ở đâu? Cho ví dụ."'}</strong><br>${en
  ? 'Between the check and the action another request can change the state. Example: SELECT “not yet returned”, then UPDATE — two clicks both pass the check. Fix: make the action conditional and atomic (<code>UPDATE … WHERE return_date IS NULL</code> and check the row count), or lock.'
  : 'Giữa lúc kiểm và lúc làm, một yêu cầu khác có thể đổi trạng thái. Ví dụ: SELECT "chưa trả" rồi UPDATE — hai cú bấm đều qua phép kiểm. Cách sửa: biến hành động thành có điều kiện và nguyên tử (<code>UPDATE … WHERE return_date IS NULL</code> rồi xem số dòng), hoặc dùng khoá.'}</li>
<li><strong>${en ? '“Your fix is 900 lines. Why is that a problem if the tests pass?”' : '"Bản sửa của em 900 dòng. Test xanh thì có sao?"'}</strong><br>${en
  ? 'Nobody can review it properly, so the behaviour change is effectively unreviewed; reverting it also reverts the cleanup; it conflicts with others’ branches. Split: fix first, cleanup separately, ideally machine-generated and verifiable.'
  : 'Không ai review nó tử tế được, nên thay đổi hành vi coi như chưa được review; revert nó là revert luôn phần dọn dẹp; nó xung đột với nhánh của người khác. Tách ra: bản sửa trước, dọn dẹp riêng, tốt nhất là do máy sinh và kiểm lại được.'}</li>
<li><strong>${en ? '“How do you estimate a bug you have not found yet?”' : '"Em ước lượng một lỗi chưa tìm ra nguyên nhân thế nào?"'}</strong><br>${en
  ? 'I do not give a single number. I timebox the investigation, then give a range (three-point) with the unknowns listed, and update it when I know the cause.'
  : 'Em không đưa một con số. Em giới hạn thời gian điều tra, rồi đưa một khoảng (ba điểm) kèm danh sách điều chưa biết, và cập nhật khi đã biết nguyên nhân.'}</li>
</ol>

<h3>✍️ ${en ? 'Exercise' : 'Bài tập'}</h3>
<p>${en
  ? 'On your copy (branch <code>ch8</code> before TV-108, i.e. <code>744ec02</code>): (1) implement the “obvious” fix (filter in <code>timPhieuCanTra</code>) and show it makes the test green; (2) explain in two sentences, using the two-session experiment, why a double click would still add a ghost copy; (3) implement the conditional UPDATE and count: how many lines in <code>src/main</code>? (4) Run the formatter on a branch on top of your fix and prove with <code>git diff</code> that formatting changed nothing but whitespace and line breaks — or explain why you cannot.'
  : 'Trên bản của bạn (nhánh <code>ch8</code> trước TV-108, tức <code>744ec02</code>): (1) làm bản sửa "hiển nhiên" (lọc trong <code>timPhieuCanTra</code>) và cho thấy nó làm test xanh; (2) giải thích trong hai câu, dựa vào thí nghiệm hai phiên, vì sao bấm đúp vẫn cộng sách ma; (3) làm UPDATE có điều kiện rồi đếm: bao nhiêu dòng trong <code>src/main</code>? (4) Chạy formatter trên một nhánh nằm trên bản sửa của bạn và chứng minh bằng <code>git diff</code> rằng định dạng không đổi gì ngoài khoảng trắng và xuống dòng — hoặc giải thích vì sao không chứng minh được.'}</p>
${giai(en ? '🔑 Answers' : '🔑 Đáp án', `<ol>
<li>${en ? 'Add <code>AND l.return_date IS NULL</code> to the SELECT: the sequential test goes green (the second call finds nothing → “Không tìm thấy phiếu mượn”, and you would also need a new message).' : 'Thêm <code>AND l.return_date IS NULL</code> vào câu SELECT: test tuần tự xanh (lần hai không tìm thấy → "Không tìm thấy phiếu mượn", và bạn còn phải đổi câu thông báo).'}</li>
<li>${en ? 'Both requests run the SELECT before either UPDATE commits, so both see an open loan; the plain UPDATE then succeeds twice (once per request) and <code>congLaiSach</code> runs twice. The conditional UPDATE makes the second one wait for the row lock and update 0 rows.' : 'Cả hai yêu cầu chạy SELECT trước khi UPDATE nào commit, nên đều thấy phiếu còn mở; UPDATE thường sau đó thành công hai lần (mỗi yêu cầu một lần) và <code>congLaiSach</code> chạy hai lần. UPDATE có điều kiện bắt lượt hai chờ khoá dòng rồi cập nhật 0 dòng.'}</li>
<li>${en ? '<code>git diff --stat 744ec02 tv-108 -- src/main</code> on the model solution: 6 added, 5 removed (DAO 9 changed lines including comments, service 2).' : '<code>git diff --stat 744ec02 tv-108 -- src/main</code> của lời giải mẫu: 6 dòng thêm, 5 dòng bớt (DAO 9 dòng thay đổi kể cả comment, service 2).'}</li>
<li>${en ? 'Trick question — you cannot, because it is not true. Comparing the files with all whitespace removed, 27 of the 31 changed files differ: google-java-format also <strong>reorders imports</strong> and <strong>splits long string literals</strong> into <code>"…" + "…"</code>. Both are behaviour-preserving, but not whitespace-only. The proof of equivalence is therefore the test suite and the golden master (50 green, pages identical), not <code>git diff -w</code>; the formatter’s <code>--dry-run</code> proves stability, not equivalence.' : 'Câu hỏi bẫy — không chứng minh được, vì điều đó không đúng. So các tệp sau khi bỏ hết khoảng trắng, 27/31 tệp vẫn khác: google-java-format còn <strong>sắp lại thứ tự import</strong> và <strong>cắt chuỗi dài</strong> thành <code>"…" + "…"</code>. Cả hai giữ nguyên hành vi, nhưng không chỉ là khoảng trắng. Vì vậy bằng chứng tương đương là bộ test và golden master (50 xanh, trang giống hệt), không phải <code>git diff -w</code>; <code>--dry-run</code> của formatter chứng minh tính ổn định, không chứng minh tương đương.'}</li>
</ol>`)}

<h3>🗂 ${en ? 'Key terms' : 'Thuật ngữ trong bài'}</h3>
${thuatNgu(en, [
  ['Minimal fix', 'bản sửa tối thiểu', 'Thay đổi nhỏ nhất mà ĐÚNG (kể cả khi chạy đồng thời), không kèm dọn dẹp.', 'The smallest change that is correct (including under concurrency), with no cleanup mixed in.'],
  ['Reproduce', 'tái hiện', 'Làm lỗi xảy ra lại theo ý muốn — tốt nhất bằng một test tự động.', 'Make the bug happen on demand — ideally as an automated test.'],
  ['Three-point estimate', 'ước lượng ba điểm', '(lạc quan + 4 × khả dĩ + bi quan) / 6, kèm điều chưa biết.', '(optimistic + 4 × likely + pessimistic) / 6, with the unknowns listed.'],
  ['Timebox', 'hộp thời gian', 'Giới hạn thời gian điều tra trước khi báo lại.', 'A fixed time limit for investigation before reporting back.'],
  ['Check-then-act', 'kiểm rồi làm', 'Kiểm trạng thái rồi hành động ở hai bước; yêu cầu khác chen vào giữa được.', 'Checking state and acting in two steps; another request can slip in between.'],
  ['Row lock', 'khoá dòng', 'InnoDB khoá dòng đang UPDATE; phiên khác chờ rồi đọc lại.', 'InnoDB locks the row being updated; other sessions wait, then re-read.'],
  ['Deterministic formatter', 'formatter tất định', 'Cùng đầu vào, cùng phiên bản ⇒ cùng đầu ra; nhờ vậy sinh lại được PR định dạng.', 'Same input and version ⇒ same output; lets you regenerate a formatting PR.'],
  ['Blast radius', 'vùng ảnh hưởng', 'Bao nhiêu người/hệ thống bị ảnh hưởng nếu thay đổi sai.', 'How many users/systems are hit if the change is wrong.'],
])}

<h3>📌 ${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'Restate, reproduce, then estimate with a range and a timebox.' : 'Viết lại, tái hiện, rồi ước lượng bằng một khoảng và một hộp thời gian.'}</li>
<li>${en ? 'The red test is the specification; commit it together with the fix.' : 'Test đỏ là đặc tả; commit nó cùng bản sửa.'}</li>
<li>${en ? 'Smallest <em>correct</em> change: put the check inside the write when concurrency is possible; prove it.' : 'Thay đổi nhỏ nhất <em>mà đúng</em>: đặt phép kiểm vào trong câu ghi khi có thể chạy đồng thời; và chứng minh.'}</li>
<li>${en ? 'Mixed PR? Redo the fix small, regenerate the machine part, prove the stack equals the original with an empty diff.' : 'PR trộn? Làm lại bản sửa nhỏ, sinh lại phần do máy làm, chứng minh chồng PR bằng bản gốc bằng một diff rỗng.'}</li>
</ul>
${tl('https://google.github.io/eng-practices/review/developer/small-cls.html', '📏', 'Google Engineering Practices — Small CLs', en ? 'Why and how to keep changes small' : 'Vì sao và cách giữ thay đổi nhỏ')}
${tl('https://blog.cloudflare.com/details-of-the-cloudflare-outage-on-july-2-2019/', '☁️', 'Cloudflare — Details of the outage on July 2, 2019', en ? 'One regex, deployed everywhere at once' : 'Một regex, triển khai mọi nơi cùng lúc')}
${tl('https://dev.mysql.com/doc/refman/8.0/en/innodb-locking-reads.html', '🐬', 'MySQL 8.0 — Locking reads', en ? 'How InnoDB locks rows for UPDATE' : 'InnoDB khoá dòng khi UPDATE thế nào')}
${lk(bai('agile-teamwork', 'agl-9-6-uoc-luong-man-day'), '📊', en ? 'Agile teamwork 9.6 — Estimating in man-days' : 'Agile teamwork 9.6 — Ước lượng bằng man-day', en ? 'WBS, buffers, three-point estimates' : 'WBS, dự phòng, ước lượng ba điểm')}
${lk(bai('git', 'git-1-3-vong-lap-hang-ngay'), '🌿', en ? 'Git 1.3 — add, commit, diff and add -p' : 'Git 1.3 — add, commit, diff và add -p', en ? 'Staging only the hunks you want' : 'Chỉ đưa vào các khối thay đổi bạn muốn')}
${lk(bai('thuc-tap-cung-claude', 'thuc-tap-cung-claude-1-1-ticket-1'), '🧑‍💻', en ? 'Internship with Claude 1.1 — Ticket 1' : 'Thực tập cùng Claude 1.1 — Ticket 1', en ? 'A first small bug fix, end to end' : 'Một bản sửa lỗi nhỏ đầu tiên, từ đầu tới cuối')}
`);

/* ═══════════════════ 8.3 — Mô tả PR và review ═══════════════════ */
const C83_MAU = `## [TV-___] <một dòng: hành vi sau khi merge>

### 1. Nguyên nhân gốc
<!-- Vì sao lỗi xảy ra (dòng nào, điều kiện nào) — không phải "đã sửa lỗi X" -->

### 2. Phạm vi ảnh hưởng
<!-- Code: ai gọi hàm đã đổi (git grep) · Dữ liệu: đã hỏng chưa, bao nhiêu (truy vấn) · Người dùng: ai thấy gì khác · Hệ thống khác: job, báo cáo, app -->

### 3. Cách kiểm
<!-- Test mới/đổi (đỏ trước khi sửa, xanh sau) · lệnh đã chạy + kết quả · bằng chứng thủ công (curl, ảnh) -->

### 4. Rủi ro và đường lùi
<!-- Điều có thể sai · cách lùi (revert an toàn? cần lùi dữ liệu?) · ngoài phạm vi: ticket riêng -->`;
const O83_PHAMVI = out(`
$ git grep -n "ghiTra\\|congLaiSach" -- src/main
src/main/java/com/thuvien/dao/PhieuMuonDAO.java:119:    public int ghiTra(int loanId, Timestamp ngayTra, Tien phi) throws SQLException {
src/main/java/com/thuvien/dao/PhieuMuonDAO.java:131:    public void congLaiSach(int bookId) throws SQLException {
src/main/java/com/thuvien/service/MuonTraService.java:47:        if (dao.ghiTra(loanId, new Timestamp(bayGio.getAsLong()), phi) == 0) return ...
src/main/java/com/thuvien/service/MuonTraService.java:48:        dao.congLaiSach(phieu.bookId);
$ git grep -n -i "return_date" -- src/main db ":!db/migrations"      # ai khác đọc/ghi cột này?
db/thuvien.sql:127:  WHERE l.return_date IS NULL AND DATEDIFF(NOW(), l.due_date) >= p_min_days      (sp_overdue_report — chỉ đọc)
src/main/java/com/thuvien/dao/PhieuMuonDAO.java:43:        ... FROM loans WHERE reader_id = ? AND return_date IS NULL                 (đếm đang mượn — chỉ đọc)
src/main/java/com/thuvien/dao/PhieuMuonDAO.java:120:       UPDATE loans SET return_date = ?, fine = ? WHERE id = ? AND return_date IS NULL
src/main/java/com/thuvien/dao/ThongKeDAO.java:20:          ... FROM loans WHERE return_date IS NULL AND due_date < NOW()               (menu quá hạn — chỉ đọc)
src/main/java/com/thuvien/servlet/ReaderServlet.java:45:   ... WHERE l.return_date IS NULL ORDER ...                                   (trang độc giả — chỉ đọc)
$ grep -rn "ngayTra" ../legacy-express/routes ../legacy-express/lib | wc -l      # API Node dùng tệp JSON riêng, không chung CSDL
5
`);
const C83_ANHHUONG = `-- TV-108: dữ liệu đã hỏng chưa? Sách có "available" lệch với số bản thật còn trong kho
SELECT b.id, b.title, b.quantity, b.available,
       b.quantity - COUNT(l.id) AS dung_ra_phai_la
FROM books b LEFT JOIN loans l ON l.book_id = b.id AND l.return_date IS NULL
GROUP BY b.id, b.title, b.quantity, b.available
HAVING b.available <> b.quantity - COUNT(l.id);`;
const O83_ANHHUONG = out(`
$ mysql thuvien < anh-huong.sql      # trên bản dump khách gửi (db/thuvien.sql)
+----+----------------------------+----------+-----------+-----------------+
| id | title                      | quantity | available | dung_ra_phai_la |
+----+----------------------------+----------+-----------+-----------------+
|  7 | Tiếng Nhật sơ cấp 1        |        6 |         5 |               6 |
+----+----------------------------+----------+-----------+-----------------+
`);
const O83_KHUNG = out(`
$ tools/mo-ta-pr.sh 744ec02 | head -18
## [TV-108] tra lan hai cung mot phieu bi tu choi, khong cong sach ma

Commit:
- 52a1c54 fix(TV-108): tra lan hai cung mot phieu bi tu choi, khong cong sach ma

Tệp thay đổi:
     src/main/java/com/thuvien/dao/PhieuMuonDAO.java               | 9 +++++----
     src/main/java/com/thuvien/service/MuonTraService.java         | 2 +-
     src/test/java/com/thuvien/service/MuonTraServiceTest.java     | 9 +++++++++
     src/test/java/com/thuvien/servlet/BookServletTraSachTest.java | 9 ++++-----
     4 files changed, 19 insertions(+), 10 deletions(-)

Test thêm/đổi:
    + ghiTraKhongDongNao_daTraRoi_khongCongSach_TV108
    - traHaiLanCungMotPhieu
    + traHaiLanCungMotPhieu_lanHaiBiTuChoi_TV108

Kết quả test lần cuối trên máy: 50 test, 0 fail, 0 error
`);
const O83_PR = out(`
## [TV-108] Trả lần hai cùng một phiếu bị từ chối, không cộng sách ma

### 1. Nguyên nhân gốc
PhieuMuonDAO.ghiTra cập nhật "UPDATE loans SET return_date = ? … WHERE id = ?" mà không kiểm phiếu đã trả chưa;
MuonTraService.tra luôn gọi congLaiSach sau đó ⇒ trả lần hai (bấm đúp khi mạng chậm) vẫn "thành công" và available + 1.
Có từ commit đầu tiên 1133063 (2016, git log -S); test traHaiLanCungMotPhieu đã khoá hành vi này ở bài 3.1.

### 2. Phạm vi ảnh hưởng
- Code: ghiTra/congLaiSach chỉ được gọi từ MuonTraService.tra (git grep). ghiTra đổi void → int (số dòng đã ghi).
  Các chỗ khác đọc return_date (sp_overdue_report, ThongKeDAO, ReaderServlet) chỉ đọc — không đổi.
- Dữ liệu: chạy truy vấn kiểm trên bản dump 20/11: KHÔNG có sách nào thừa bản. Có 1 sách lệch CHIỀU NGƯỢC (sách 7: available 5,
  đúng ra 6) — không do lỗi này gây ra; đã hỏi chị Hoa (Q&A #14), mở TV-112 nếu cần sửa dữ liệu.
- Người dùng: thủ thư bấm "Trả" lần hai sẽ thấy "Phiếu này đã trả rồi" (trước: "Trả sách thành công"). API Node không dùng CSDL này.

### 3. Cách kiểm
- BookServletTraSachTest.traHaiLanCungMotPhieu_lanHaiBiTuChoi_TV108: đỏ trên ch8 (expected "Phiếu này đã trả rồi" but was
  "Trả sách thành công"), xanh sau khi sửa. MuonTraServiceTest thêm ca ghiTra trả 0 ⇒ không cộng sách.
- mvn -B test (JDK 17): 50 test, 0 lỗi. Golden master 3 trang: giống hệt.
- Đồng thời: thử bằng hai phiên MySQL — phiên thứ hai chờ khoá dòng rồi cập nhật 0 dòng (log trong ticket).

### 4. Rủi ro và đường lùi
- Cập nhật phiếu và cộng sách vẫn là hai câu lệnh không chung giao dịch (có từ trước): lỗi giữa chừng ⇒ phiếu đã trả mà sách chưa cộng.
  Không làm trong PR này — đề xuất TV-113 (bọc giao dịch, cần đổi DBUtil).
- Đường lùi: revert an toàn, không có thay đổi schema hay dữ liệu.
`);
const O83_TREO = out(`
$ npx jest __tests__/zz-thu-nem.test.js        # tuanTu bản v1, lượt đầu ném lỗi đồng bộ
FAIL __tests__/zz-thu-nem.test.js
  ● lượt đầu ném lỗi đồng bộ ⇒ lượt sau vẫn được phục vụ
    - Expected  - 2
    + Received  + 2
      Array [
    -   500,
    -   201,
    +   "treo: ECONNABORTED",
    +   "treo: ECONNABORTED",
      ]
`);
const J83_THUNEM = js(`
// __tests__/tuan-tu.test.js — TV-98, góp ý review: lượt xử lý ném lỗi đồng bộ không được làm treo hàng đợi
const express = require('express');
const request = require('supertest');
const tuanTu = require('../lib/tuan-tu');

test('lượt đầu ném lỗi đồng bộ ⇒ lượt sau vẫn được phục vụ', async () => {
  const app = express();
  let lan = 0;
  app.post('/x', tuanTu((req, res) => { lan++; if (lan === 1) throw new Error('loi dong bo'); res.status(201).end(); }));
  app.use((err, req, res, next) => res.status(500).end());
  const dau = await request(app).post('/x').timeout(1000).catch((e) => ({ status: 'treo: ' + e.code }));
  const sau = await request(app).post('/x').timeout(1000).catch((e) => ({ status: 'treo: ' + e.code }));
  expect([dau.status, sau.status]).toEqual([500, 201]);
});
`);
const J83_TUANTU = js(`
// lib/tuan-tu.js — sau góp ý review (v2)
var hang = Promise.resolve();

module.exports = function tuanTu(xuLy) {
  return function (req, res, next) {
    hang = hang.then(function () {
      return new Promise(function (xong) {
        res.on('finish', xong);
        res.on('close', xong);
        try { xuLy(req, res); } catch (e) { next(e); }     // v1: không có try ⇒ Promise bị từ chối, hàng đợi chết
      });
    });
  };
};
`);
const O83_FIXUP = out(`
$ git add -A lib routes __tests__ && git commit --fixup=HEAD
$ git log --oneline ch8..
ca3a388 fixup! fix(TV-98): xep hang cac luot POST /api/muon — hai luot cung luc khong con mat phieu
cbb862e fix(TV-98): xep hang cac luot POST /api/muon — hai luot cung luc khong con mat phieu
$ npm test 2>&1 | grep -E "^Tests:"
Tests:       24 passed, 24 total
$ git rebase --autosquash ch8          # Git 2.44+: không cần -i
Successfully rebased and updated refs/heads/tv-98.
$ git log --stat --format="%h %s" ch8..
9ab4ccf fix(TV-98): xep hang cac luot POST /api/muon — hai luot cung luc khong con mat phieu
 __tests__/muon.dong-thoi.test.js | 30 ++++++++++++++++++++++++++++++
 __tests__/tuan-tu.test.js        | 14 ++++++++++++++
 lib/tuan-tu.js                   | 16 ++++++++++++++++
 routes/muon.js                   |  6 ++++--
 4 files changed, 64 insertions(+), 2 deletions(-)
$ git range-diff --stat ch8 cbb862e tv-98      # người review xem đúng phần đã đổi so với lần review trước
1:  cbb862e ! 1:  9ab4ccf fix(TV-98): xep hang cac luot POST /api/muon — hai luot cung luc khong con mat phieu
     a => b | 55 +++++++++++++++++++++++++++++++++++++++++++------------
     1 file changed, 43 insertions(+), 12 deletions(-)
`);

const L83 = ml((en) => `
<span class="eyebrow">${en ? 'Chapter 8 · Fixing bugs in someone else’s code' : 'Chương 8 · Sửa lỗi trong code của người khác'}</span>
<h2>${en ? '8.3 — PR description and review for maintenance work' : '8.3 — Mô tả PR và review cho việc bảo trì'}</h2>
<p class="lead">${en
  ? 'At a hospital shift change, the nurse leaving does not say “patient in bed 4 is fine”. They say what happened, why, what was done, and what to watch tonight. A maintenance PR description is that handover: the reviewer, the tester, the customer and the person who opens this PR in two years all need the same four things. This lesson writes the TV-108 description with real measurements, then goes through a real review of the TV-98 fix where the reviewer was right and the author was not.'
  : 'Lúc giao ca ở bệnh viện, y tá ra về không nói "bệnh nhân giường 4 ổn". Họ nói chuyện gì đã xảy ra, vì sao, đã làm gì, và tối nay cần để ý gì. Mô tả PR bảo trì chính là bản giao ca đó: người review, tester, khách hàng và người mở PR này sau hai năm đều cần đúng bốn thứ ấy. Bài này viết mô tả PR TV-108 bằng số đo thật, rồi đi qua một lượt review thật của bản sửa TV-98 — nơi người review đúng còn người viết thì sai.'}</p>
${moiTruong(en)}

<h3>${en ? 'Four sections, in this order' : 'Bốn mục, đúng thứ tự này'}</h3>
<p>${en
  ? 'General PR hygiene (title, size, linking the ticket, screenshots) is taught in agile-teamwork 3.2 and git 6.1. Maintenance PRs add one thing those do not stress: the reader must be able to judge <em>risk to an existing system</em> without re-doing your investigation. That is what the four sections are for. Put them in the repository so every PR starts from them (GitHub reads <code>.github/pull_request_template.md</code>; GitLab reads <code>.gitlab/merge_request_templates/</code>):'
  : 'Phép tắc PR chung (tiêu đề, kích thước, gắn ticket, ảnh chụp) đã dạy ở agile-teamwork 3.2 và git 6.1. PR bảo trì thêm một điều mà ở đó không nhấn: người đọc phải đánh giá được <em>rủi ro cho một hệ thống đang chạy</em> mà không phải làm lại phần điều tra của bạn. Bốn mục sinh ra để làm việc đó. Đưa chúng vào repo để PR nào cũng bắt đầu từ đây (GitHub đọc <code>.github/pull_request_template.md</code>; GitLab đọc <code>.gitlab/merge_request_templates/</code>):'}</p>
${out(C83_MAU)}
<ol>
<li><strong>${en ? 'Root cause' : 'Nguyên nhân gốc'}</strong> — ${en ? 'why it happened, at the level of a line and a condition. “Fixed bug TV-108” is not a root cause; “the UPDATE has no return_date condition and the service always increments afterwards” is.' : 'vì sao nó xảy ra, ở mức một dòng và một điều kiện. "Đã sửa lỗi TV-108" không phải nguyên nhân gốc; "câu UPDATE không có điều kiện return_date và service luôn cộng sách sau đó" mới là.'}</li>
<li><strong>${en ? 'Impact (scope)' : 'Phạm vi ảnh hưởng'}</strong> — ${en ? 'impact analysis in four directions: code (who calls what you changed), data (is existing data already wrong?), people (who will see something different), other systems (jobs, reports, apps).' : 'phân tích ảnh hưởng theo bốn hướng: code (ai gọi thứ bạn đổi), dữ liệu (dữ liệu hiện có đã sai chưa?), con người (ai sẽ thấy điều khác đi), hệ thống khác (job, báo cáo, ứng dụng).'}</li>
<li><strong>${en ? 'How it was tested' : 'Cách kiểm'}</strong> — ${en ? 'which test was red before and green after, the command and its result, manual evidence.' : 'test nào đỏ trước và xanh sau, lệnh đã chạy cùng kết quả, bằng chứng thủ công.'}</li>
<li><strong>${en ? 'Risks and way back' : 'Rủi ro và đường lùi'}</strong> — ${en ? 'what could still go wrong, whether a revert is safe, and what you deliberately left out (with ticket numbers).' : 'điều gì vẫn có thể sai, revert có an toàn không, và những gì bạn cố ý để ngoài (kèm số ticket).'}</li>
</ol>

<h3>${en ? 'Impact analysis, for real' : 'Phân tích ảnh hưởng, làm thật'}</h3>
<p>${en
  ? '<strong>Code:</strong> every caller of what you changed, and every other reader/writer of the data you touched. Search the whole repository including SQL — stored procedures do not show up in “Find Usages”:'
  : '<strong>Code:</strong> mọi nơi gọi thứ bạn đã đổi, và mọi chỗ khác đọc/ghi dữ liệu bạn chạm vào. Tìm trên cả repo kể cả SQL — stored procedure không hiện trong "Find Usages":'}</p>
${O83_PHAMVI}
<p>${en
  ? '<strong>Data:</strong> a bug that has been in production since 2016 has probably already damaged data, and a fix that stops new damage does not repair old damage. Ask the question in SQL, run it on a copy (never on production without permission):'
  : '<strong>Dữ liệu:</strong> một lỗi nằm trên production từ 2016 nhiều khả năng đã làm hỏng dữ liệu, và bản sửa chặn hỏng mới không chữa được hỏng cũ. Đặt câu hỏi bằng SQL, chạy trên bản sao (không bao giờ chạy trên production khi chưa được phép):'}</p>
${out(C83_ANHHUONG)}
${O83_ANHHUONG}
<p>${en
  ? 'An honest and useful surprise. No book has <em>extra</em> copies, which is what TV-108 would cause. One book has one copy <em>missing</em> — the opposite direction, so a different cause (lesson 1.4 noted book 7 was already inconsistent in the dump). Two consequences for the PR: say clearly that TV-108 has not damaged this data set, and do <strong>not</strong> “fix” book 7 in this PR. A missing copy might be a lost book, a manual correction, or another bug; that is a question for the librarian (lesson 8.4), and possibly a separate ticket.'
  : 'Một bất ngờ thật thà và có ích. Không sách nào bị <em>thừa</em> bản — điều TV-108 sẽ gây ra. Có một sách bị <em>thiếu</em> một bản — chiều ngược lại, nên là nguyên nhân khác (bài 1.4 đã ghi sách 7 vốn lệch sẵn trong dump). Hai hệ quả cho PR: nói rõ TV-108 chưa làm hỏng bộ dữ liệu này, và <strong>không</strong> "sửa luôn" sách 7 trong PR này. Thiếu một bản có thể là sách mất, một lần chỉnh tay, hay một lỗi khác; đó là câu hỏi cho thủ thư (bài 8.4), và có thể là một ticket riêng.'}</p>
<p>${en
  ? '<strong>People and other systems:</strong> the librarian will now see a new message; the overdue report and the menu counter only read the column; the Node API uses its own JSON file. Write those sentences — the tester uses them to decide what to re-test.'
  : '<strong>Con người và hệ thống khác:</strong> thủ thư sẽ thấy một câu thông báo mới; báo cáo quá hạn và bộ đếm trên menu chỉ đọc cột này; API Node dùng tệp JSON riêng. Viết hẳn những câu đó ra — tester dựa vào chúng để quyết định kiểm lại những gì.'}</p>

<h3>${en ? 'Let a script write the boring half' : 'Để script viết nửa nhàm chán'}</h3>
<p>${en
  ? 'Commit list, changed files, which tests were added or renamed, last test result — all of that is in Git and Surefire already. A 10-line script in the repo (<code>tools/mo-ta-pr.sh</code>) prints it above the four empty sections, so your time goes into the parts only a human can write:'
  : 'Danh sách commit, tệp thay đổi, test nào được thêm hay đổi tên, kết quả test lần cuối — tất cả đã có sẵn trong Git và Surefire. Một script 10 dòng trong repo (<code>tools/mo-ta-pr.sh</code>) in chúng ra phía trên bốn mục trống, để thời gian của bạn dành cho phần chỉ con người viết được:'}</p>
${O83_KHUNG}
<p>${en ? 'The finished description:' : 'Mô tả hoàn chỉnh:'}</p>
${O83_PR}
<div class="callout"><p>${en
  ? '<strong>Check yourself:</strong> can the tester decide what to re-test from section 2 alone? Can the reviewer reproduce the red test from section 3 alone? Can the on-call person decide to revert from section 4 alone? If any answer is no, the description is not finished. Note also what is absent: no “I think”, no “should be fine” — every claim has a command or a number behind it.'
  : '<strong>Tự kiểm:</strong> chỉ đọc mục 2, tester có quyết được cần kiểm lại gì không? Chỉ đọc mục 3, người review có làm lại được test đỏ không? Chỉ đọc mục 4, người trực có quyết được revert không? Câu nào là "không" thì mô tả chưa xong. Để ý cả thứ vắng mặt: không có "em nghĩ là", không có "chắc ổn" — mọi khẳng định đều có một lệnh hoặc một con số đứng sau.'}</p></div>

<h3>${en ? 'Reviewing a maintenance PR: what to check' : 'Review một PR bảo trì: kiểm những gì'}</h3>
<p>${en
  ? 'How to write kind, useful review comments is taught in agile-teamwork 4.2 and 4.4. For a fix in old code, add these questions:'
  : 'Cách viết nhận xét review tử tế và có ích đã dạy ở agile-teamwork 4.2 và 4.4. Với một bản sửa trong code cũ, thêm các câu hỏi sau:'}</p>
<ul>
<li>${en ? '<strong>Does the new test fail without the fix?</strong> Check it yourself: <code>git stash</code> the main change (or <code>git checkout origin/main -- src/main</code>) and run the test. A test that passes either way proves nothing.' : '<strong>Test mới có đỏ khi không có bản sửa không?</strong> Tự kiểm: <code>git stash</code> phần thay đổi chính (hoặc <code>git checkout origin/main -- src/main</code>) rồi chạy test. Test xanh cả hai cách thì không chứng minh gì.'}</li>
<li>${en ? '<strong>Which characterization tests changed expectation, and is each change intended?</strong> In TV-108 exactly one did, and its new name says why.' : '<strong>Characterization test nào đổi kỳ vọng, và lần đổi nào cũng có chủ đích không?</strong> Ở TV-108 đúng một test đổi, và tên mới của nó nói rõ vì sao.'}</li>
<li>${en ? '<strong>What happens on the unhappy paths</strong> — concurrency, exceptions, empty data, a second click, a client that disconnects?' : '<strong>Chuyện gì xảy ra ở các nhánh không suôn sẻ</strong> — chạy đồng thời, ngoại lệ, dữ liệu rỗng, cú bấm thứ hai, khách ngắt kết nối giữa chừng?'}</li>
<li>${en ? '<strong>Is anything outside the ticket in the diff?</strong> If yes, ask for a separate PR (lesson 8.2).' : '<strong>Trong diff có gì ngoài ticket không?</strong> Có thì đề nghị tách PR (bài 8.2).'}</li>
<li>${en ? '<strong>Is the revert safe?</strong> Schema or data changes make reverting harder; they need their own plan.' : '<strong>Revert có an toàn không?</strong> Đổi schema hay dữ liệu làm revert khó hơn; cần kế hoạch riêng.'}</li>
</ul>

<h3>${en ? 'A real review: the reviewer was right' : 'Một lượt review thật: người review đúng'}</h3>
<p>${en
  ? 'The first version of the TV-98 fix (lab 8.5) put every <code>POST /api/muon</code> in a queue: the next request starts when the previous response has finished. Tests green, 5 parallel requests gave 5 distinct loans. The reviewer left one comment: <em>“What happens to the queue if the handler throws synchronously?”</em> The tempting reply is “it doesn’t throw”. The right reply is to answer with a test:'
  : 'Bản đầu của bản sửa TV-98 (lab 8.5) đưa mọi <code>POST /api/muon</code> vào một hàng đợi: yêu cầu sau bắt đầu khi phản hồi trước đã xong. Test xanh, 5 yêu cầu song song ra 5 phiếu khác nhau. Người review để lại một nhận xét: <em>"Nếu hàm xử lý ném lỗi đồng bộ thì hàng đợi ra sao?"</em> Câu trả lời dễ buột ra là "nó không ném đâu". Câu trả lời đúng là trả lời bằng một test:'}</p>
${J83_THUNEM}
${O83_TREO}
<p>${en
  ? 'Both requests hang until the client gives up. In v1 the handler was called inside a <code>new Promise(...)</code> executor; a synchronous throw there <em>rejects</em> that promise, Express never hears about the error, no response is sent — and because <code>hang</code> now holds a rejected promise, every later <code>.then</code> is skipped: the borrow API would be dead until restart. Today’s handler does not throw synchronously, but the next person to edit it might, and the failure mode is “silently stops serving one endpoint”. The fix is one <code>try</code>, plus moving the helper into <code>lib/tuan-tu.js</code> so it can be tested on its own:'
  : 'Cả hai yêu cầu treo tới khi phía gọi bỏ cuộc. Ở v1, hàm xử lý được gọi bên trong executor của <code>new Promise(...)</code>; ném lỗi đồng bộ ở đó làm Promise đó bị <em>từ chối</em>, Express không hề biết có lỗi, không phản hồi nào được gửi — và vì <code>hang</code> giờ giữ một Promise bị từ chối, mọi <code>.then</code> sau đó đều bị bỏ qua: API mượn sách sẽ chết cho tới khi khởi động lại. Hàm xử lý hôm nay không ném lỗi đồng bộ, nhưng người sửa nó lần sau có thể, và kiểu hỏng là "lặng lẽ thôi phục vụ một endpoint". Cách sửa là một <code>try</code>, cộng với dời hàm phụ ra <code>lib/tuan-tu.js</code> để test riêng được:'}</p>
${J83_TUANTU}
<p>${en
  ? 'How to deliver the change so the reviewer does not have to re-read everything: commit it as a <strong>fixup</strong> of the commit it corrects, push, let the reviewer look at just that commit, then squash it before merge. <code>git range-diff</code> shows the reviewer exactly what changed between the version they reviewed and the new one:'
  : 'Giao thay đổi thế nào để người review không phải đọc lại từ đầu: commit nó dưới dạng <strong>fixup</strong> của commit mà nó sửa, đẩy lên, để người review chỉ xem commit đó, rồi gộp lại trước khi merge. <code>git range-diff</code> cho người review thấy đúng phần đã đổi giữa bản họ đã review và bản mới:'}</p>
${O83_FIXUP}

<h3>${en ? 'Answering review without getting defensive' : 'Trả lời review không tự ái'}</h3>
<table>
<tr><th>${en ? 'Comment' : 'Nhận xét'}</th><th>${en ? 'Defensive reply' : 'Trả lời kiểu tự ái'}</th><th>${en ? 'Useful reply' : 'Trả lời có ích'}</th></tr>
<tr><td>${en ? '“What if the handler throws?”' : '"Nếu hàm xử lý ném lỗi thì sao?"'}</td><td>${en ? '“It doesn’t.”' : '"Nó không ném đâu ạ."'}</td><td>${en ? '“Good catch — confirmed with a test, the queue hangs. Fixed in fixup ca3a388, test <code>tuan-tu.test.js</code>.”' : '"Anh bắt đúng — em đã thử bằng test, hàng đợi treo thật. Đã sửa ở fixup ca3a388, test <code>tuan-tu.test.js</code>."'}</td></tr>
<tr><td>${en ? '“Why not move phieu.json to MySQL?”' : '"Sao không chuyển phieu.json sang MySQL luôn?"'}</td><td>${en ? 'Rewrites half the API in the same PR.' : 'Viết lại nửa API trong cùng PR.'}</td><td>${en ? '“Agreed that is the real fix for multi-process; out of scope here (1 process in prod). Opened TV-114 with the reasoning.”' : '"Em đồng ý đó là cách sửa thật khi chạy nhiều tiến trình; nằm ngoài phạm vi ở đây (prod chạy 1 tiến trình). Em đã mở TV-114 kèm lý do."'}</td></tr>
<tr><td>${en ? '“Rename <code>hang</code>, it is unclear.”' : '"Đổi tên <code>hang</code> đi, khó hiểu."'}</td><td>${en ? 'Silent rename of everything nearby.' : 'Lặng lẽ đổi tên mọi thứ xung quanh.'}</td><td>${en ? '“<code>hang</code> = queue in Vietnamese; renamed to <code>hangDoi</code> to match the file’s naming. 2 lines.” — or politely disagree with a reason.' : '"<code>hang</code> nghĩa là hàng đợi; em đổi thành <code>hangDoi</code> cho khớp cách đặt tên của tệp. 2 dòng." — hoặc lịch sự giữ ý kiến kèm lý do.'}</td></tr>
</table>
<p>${en
  ? 'Three rules: assume the reviewer is trying to protect the system, not attack you; reply to every comment (fixed with a link, or why not); move disagreements that take more than two replies to a short call, then write the decision back in the thread. More in agile-teamwork 4.3 and the internship course’s first review.'
  : 'Ba luật: coi như người review đang bảo vệ hệ thống chứ không tấn công bạn; trả lời mọi nhận xét (đã sửa kèm liên kết, hoặc vì sao không sửa); bất đồng nào quá hai lượt trả lời thì chuyển sang một cuộc gọi ngắn, rồi ghi lại quyết định vào luồng thảo luận. Xem thêm agile-teamwork 4.3 và lượt review đầu tiên trong khoá thực tập.'}</p>

<h3>🕵️ ${en ? 'Real incident: the backdoor that hid in test files (xz-utils, 2024)' : 'Sự cố thật: cửa hậu nấp trong tệp test (xz-utils, 2024)'}</h3>
<p>${en
  ? 'On 29 March 2024 Andres Freund, a PostgreSQL developer, noticed SSH logins on Debian unstable taking about half a second longer and traced it to a backdoor in xz-utils 5.6.0/5.6.1 (CVE-2024-3094). A contributor had spent about two years earning maintainer trust. The malicious payload was hidden in binary “test fixtures” (<code>tests/files/bad-3-corrupt_lzma2.xz</code>, <code>good-large_compressed.lzma</code>) added in commits described as test updates, and a build-script change that existed only in the release tarball, not in the Git repository. Lessons for reviewing maintenance PRs: binary files and test data are code and deserve questions (“what generates this file?”); a PR description is a claim, the diff is the evidence; and what you deploy must be built from what you reviewed.'
  : 'Ngày 29/3/2024, Andres Freund, một lập trình viên PostgreSQL, để ý đăng nhập SSH trên Debian unstable chậm thêm khoảng nửa giây và lần ra một cửa hậu trong xz-utils 5.6.0/5.6.1 (CVE-2024-3094). Một người đóng góp đã mất khoảng hai năm để được tin tưởng làm maintainer. Phần độc hại được giấu trong các "tệp test" nhị phân (<code>tests/files/bad-3-corrupt_lzma2.xz</code>, <code>good-large_compressed.lzma</code>) thêm vào bằng những commit mô tả là cập nhật test, cùng một thay đổi script build chỉ có trong tệp nén phát hành, không có trong repo Git. Bài học cho việc review PR bảo trì: tệp nhị phân và dữ liệu test cũng là code và đáng được hỏi ("tệp này sinh ra từ đâu?"); mô tả PR là lời khẳng định, diff mới là bằng chứng; và thứ bạn triển khai phải được build từ đúng thứ bạn đã review.'}</p>

<h3>💼 ${en ? 'OJT situation: “please attach evidence”' : 'Tình huống OJT: "em đính kèm evidence nhé"'}</h3>
<p>${en
  ? 'On many Japanese-customer projects the customer reviews PRs too, and asks for <em>evidence</em> (エビデンス): proof for each test case — logs, screenshots, SQL before/after. Sections 3 and 4 of the template are exactly where it goes; keep the raw outputs (test reports, the impact SQL and its result, curl output) in the ticket, and list their names in the PR. Test-spec and evidence formats are covered in agile-teamwork 9.4.'
  : 'Ở nhiều dự án khách Nhật, khách cũng review PR và yêu cầu <em>evidence</em> (エビデンス): bằng chứng cho từng ca kiểm — log, ảnh chụp, SQL trước/sau. Mục 3 và 4 của mẫu chính là chỗ để chúng; giữ output thô (báo cáo test, câu SQL ảnh hưởng và kết quả, output curl) trong ticket, và liệt kê tên chúng trong PR. Định dạng test spec và evidence có ở agile-teamwork 9.4.'}</p>

<h3>🎤 ${en ? 'What the interviewer will ask' : 'Phỏng vấn viên sẽ hỏi'}</h3>
<ol>
<li><strong>${en ? '“What goes into a good bug-fix PR description?”' : '"Mô tả PR sửa lỗi tốt có những gì?"'}</strong><br>${en
  ? 'Root cause, impact (code, data, users, other systems), how it was tested (red before, green after, commands), risks and rollback, and what is out of scope with ticket numbers.'
  : 'Nguyên nhân gốc, phạm vi ảnh hưởng (code, dữ liệu, người dùng, hệ thống khác), cách kiểm (đỏ trước, xanh sau, lệnh), rủi ro và đường lùi, cùng những gì ngoài phạm vi kèm số ticket.'}</li>
<li><strong>${en ? '“What is impact analysis?”' : '"Phân tích ảnh hưởng là gì?"'}</strong><br>${en
  ? 'Finding everything a change can affect before merging: callers and other readers/writers of the same data (including SQL and other services), whether existing data is already damaged, who sees a difference, and what must be re-tested.'
  : 'Tìm mọi thứ một thay đổi có thể ảnh hưởng trước khi merge: nơi gọi và các chỗ khác đọc/ghi cùng dữ liệu (kể cả SQL và dịch vụ khác), dữ liệu hiện có đã hỏng chưa, ai thấy khác đi, và cần kiểm lại gì.'}</li>
<li><strong>${en ? '“A reviewer finds a problem in your PR. What do you do?”' : '"Người review tìm ra vấn đề trong PR của em. Em làm gì?"'}</strong><br>${en
  ? 'Verify it (ideally with a test), thank them, fix it as a fixup commit so they can review only the delta, reply with the commit link; if I disagree, explain with evidence and escalate to a call after two rounds.'
  : 'Kiểm chứng (tốt nhất bằng test), cảm ơn, sửa bằng commit fixup để họ chỉ review phần chênh, trả lời kèm liên kết commit; nếu không đồng ý thì giải thích bằng bằng chứng và chuyển sang gọi sau hai lượt.'}</li>
<li><strong>${en ? '“How do you know a new test really tests the fix?”' : '"Làm sao biết test mới thật sự kiểm bản sửa?"'}</strong><br>${en
  ? 'Run it without the fix and see it fail for the expected reason; then with the fix and see it pass. Mutation testing (PIT, lesson 3.5) automates that question for the whole suite.'
  : 'Chạy nó khi chưa có bản sửa và thấy nó đỏ đúng lý do; rồi chạy với bản sửa và thấy xanh. Mutation testing (PIT, bài 3.5) tự động hoá câu hỏi đó cho cả bộ test.'}</li>
</ol>

<h3>✍️ ${en ? 'Exercise' : 'Bài tập'}</h3>
<p>${en
  ? '(1) Write the four-section description for TV-96 (lab 8.5) before you write the fix: which sections can you already fill, and which need measurements? (2) Act as the reviewer of TV-109 (<code>error.jsp</code>): list three questions you would ask. (3) Reproduce the TV-98 review on your copy: write <code>tuan-tu.test.js</code> against v1 and watch it hang, then apply the fixup and autosquash.'
  : '(1) Viết mô tả bốn mục cho TV-96 (lab 8.5) TRƯỚC khi viết bản sửa: mục nào bạn đã điền được, mục nào cần số đo? (2) Đóng vai người review TV-109 (<code>error.jsp</code>): liệt kê ba câu bạn sẽ hỏi. (3) Làm lại lượt review TV-98 trên bản của bạn: viết <code>tuan-tu.test.js</code> chạy với v1 và nhìn nó treo, rồi áp fixup và autosquash.'}</p>
${giai(en ? '🔑 Answers' : '🔑 Đáp án', `<ol>
<li>${en ? 'Root cause can be written from reading the code (split(":") without a length check). Impact needs <code>git grep nguoiDungTuCookie</code> (one caller) and a decision about logged-in users whose cookies are malformed (none valid ⇒ nobody is logged out). Testing and risks need the red/green runs and the curl evidence. Lab 8.5 has the model text.' : 'Nguyên nhân gốc viết được ngay khi đọc code (split(":") không kiểm độ dài). Phạm vi cần <code>git grep nguoiDungTuCookie</code> (một nơi gọi) và một nhận định về người dùng có cookie hỏng (không ai hợp lệ ⇒ không ai bị đăng xuất). Cách kiểm và rủi ro cần các lượt đỏ/xanh và bằng chứng curl. Lab 8.5 có văn bản mẫu.'}</li>
<li>${en ? 'Examples: “Where does the full stack trace go now, and can support find it from the code?” “Does the page still return status 500 (monitoring relies on it)?” “Does the error page itself throw if logging fails?”' : 'Ví dụ: "Stack trace đầy đủ giờ đi đâu, và bộ phận hỗ trợ tìm được nó từ mã lỗi không?" "Trang vẫn trả mã 500 chứ (giám sát dựa vào nó)?" "Nếu ghi log lỗi thì bản thân trang lỗi có ném lỗi không?"'}</li>
<li>${en ? 'Expected: <code>["treo: ECONNABORTED", "treo: ECONNABORTED"]</code> on v1, <code>[500, 201]</code> after the fixup.' : 'Mong đợi: <code>["treo: ECONNABORTED", "treo: ECONNABORTED"]</code> với v1, <code>[500, 201]</code> sau fixup.'}</li>
</ol>`)}

<h3>🗂 ${en ? 'Key terms' : 'Thuật ngữ trong bài'}</h3>
${thuatNgu(en, [
  ['Root cause', 'nguyên nhân gốc', 'Dòng và điều kiện gây ra lỗi — không phải triệu chứng.', 'The line and condition that cause the bug — not the symptom.'],
  ['Impact analysis', 'phân tích ảnh hưởng', 'Code, dữ liệu, người dùng, hệ thống khác bị thay đổi chạm tới.', 'Code, data, users and other systems a change can affect.'],
  ['PR template', 'mẫu mô tả PR', 'Tệp trong repo mà GitHub/GitLab chèn sẵn vào mọi PR mới.', 'A file in the repo that GitHub/GitLab pre-fills into every new PR.'],
  ['Evidence', 'bằng chứng kiểm thử', 'Log, ảnh, SQL trước/sau chứng minh từng ca kiểm (khách Nhật hay yêu cầu).', 'Logs, screenshots, SQL before/after proving each test case.'],
  ['Fixup commit', 'commit fixup', 'Commit sửa một commit trước; gộp lại bằng rebase --autosquash.', 'A commit correcting an earlier one; squashed with rebase --autosquash.'],
  ['range-diff', 'range-diff', 'So hai phiên bản của cùng một chuỗi commit — người review xem phần chênh.', 'Compares two versions of a commit series — reviewers see the delta.'],
])}

<h3>📌 ${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'Four sections: root cause, impact, how tested, risks and way back — each claim backed by a command or a number.' : 'Bốn mục: nguyên nhân gốc, phạm vi ảnh hưởng, cách kiểm, rủi ro và đường lùi — khẳng định nào cũng có lệnh hoặc con số đứng sau.'}</li>
<li>${en ? 'Impact analysis covers data too: query whether old data is already damaged, and do not fix unrelated anomalies in the same PR.' : 'Phân tích ảnh hưởng gồm cả dữ liệu: truy vấn xem dữ liệu cũ đã hỏng chưa, và đừng sửa bất thường không liên quan trong cùng PR.'}</li>
<li>${en ? 'Reviewing a fix: does the test fail without it, what about unhappy paths, is revert safe?' : 'Review một bản sửa: test có đỏ khi không có nó không, các nhánh không suôn sẻ thì sao, revert có an toàn không?'}</li>
<li>${en ? 'Answer review with tests and fixup commits, not with “it’s fine”.' : 'Trả lời review bằng test và commit fixup, không bằng "chắc ổn ạ".'}</li>
</ul>
${tl('https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/creating-a-pull-request-template-for-your-repository', '🐙', 'GitHub Docs — Pull request templates', en ? 'Where the template file goes' : 'Tệp mẫu đặt ở đâu')}
${tl('https://git-scm.com/docs/git-range-diff', '🌿', 'git range-diff', en ? 'Compare two versions of a branch' : 'So hai phiên bản của một nhánh')}
${tl('https://www.openwall.com/lists/oss-security/2024/03/29/4', '🕵️', 'oss-security — backdoor in upstream xz/liblzma (Andres Freund, 29/3/2024)', en ? 'The original report of CVE-2024-3094' : 'Báo cáo gốc của CVE-2024-3094')}
${lk(bai('agile-teamwork', 'agl-3-2-pr-tot'), '🤝', en ? 'Agile teamwork 3.2 — PRs that are easy to review' : 'Agile teamwork 3.2 — Mở PR dễ review', en ? 'General PR hygiene' : 'Phép tắc PR chung')}
${lk(bai('agile-teamwork', 'agl-4-3-nhan-review'), '🤝', en ? 'Agile teamwork 4.3 — Receiving review well' : 'Agile teamwork 4.3 — Nhận góp ý cho tốt', en ? 'Feedback without ego' : 'Nhận góp ý không tự ái')}
${lk(bai('agile-teamwork', 'agl-4-4-checklist'), '✅', en ? 'Agile teamwork 4.4 — Review checklist' : 'Agile teamwork 4.4 — Checklist review', en ? 'The general checklist this lesson extends' : 'Checklist chung mà bài này mở rộng')}
${lk(bai('thuc-tap-cung-claude', 'thuc-tap-cung-claude-1-3-review-1'), '🧑‍💻', en ? 'Internship with Claude 1.3 — First code review' : 'Thực tập cùng Claude 1.3 — Code review đầu tiên', en ? 'Practise answering a review' : 'Tập trả lời một lượt review')}
`);

/* ═══════════════════ 8.4 — Khi người viết đã nghỉ ═══════════════════ */
const O84_AIBIET = out(`
$ python3 ai-biet.py master $(git ls-tree -r --name-only master src/main db | grep -vE "model/|Constants|index.jsp")   # bản khách giao
tệp                          dòng  ai viết (% dòng)                         sửa cuối   xe buýt
db/thuvien.sql                133  Tuan 87, Lan 12                          11/2019    1
dao/BookDAO.java               65  Hung 100                                 06/2018    1
servlet/BookServlet.java      193  Tuan 86, Hung 13                         06/2018    1
servlet/ExportServlet.java     42  Hung 100                                 10/2017    1
servlet/LoginServlet.java      76  Tuan 72, Hung 27                         08/2017    2
servlet/ReaderServlet.java     91  Tuan 100                                 03/2016    1
servlet/ReportServlet.java     57  Lan 100                                  11/2019    1
util/DBUtil.java               39  Tuan 100                                 03/2016    1
util/TokenUtil.java            20  Hung 100                                 08/2017    1
WEB-INF/web.xml                54  Tuan 77, Hung 14, Lan 7                  11/2019    1
webapp/books.jsp               44  Tuan 100                                 03/2016    1
webapp/error.jsp                5  Lan 100                                  11/2019    1
webapp/header.jsp              17  Lan 58, Tuan 41                          11/2019    2
webapp/login.jsp               16  Tuan 93, Hung 6                          08/2017    1
webapp/readers.jsp             50  Tuan 100                                 03/2016    1
webapp/report.jsp              15  Lan 100                                  11/2019    1
$ for a in "Nguyen Anh Tuan" "Tran Quoc Hung" "Le Thi Lan"; do …; done      # commit đầu → cuối của từng người
Nguyen Anh Tuan: 2016-03-02 → 2018-01-08, 4 commit
Tran Quoc Hung: 2017-04-11 → 2018-06-20, 6 commit
Le Thi Lan: 2019-11-04 → 2019-11-05, 2 commit
`);
const P84_AIBIET = bash(`
#!/usr/bin/env python3
"""ai-biet.py <rev> <tệp…> — mỗi tệp: ai viết bao nhiêu % dòng (git blame), lần sửa cuối, "hệ số xe buýt" (số người viết ≥ 20 %)."""
import subprocess, sys, collections
rev, tep = sys.argv[1], sys.argv[2:]
print(f"{'tệp':28} {'dòng':>4}  {'ai viết (% dòng)':40} {'sửa cuối':10} xe buýt")
for t in tep:
    out = subprocess.run(['git', 'blame', '--line-porcelain', rev, '--', t], capture_output=True, text=True).stdout
    dem = collections.Counter(l[7:] for l in out.splitlines() if l.startswith('author '))
    n = sum(dem.values())
    if not n: continue
    ai = ', '.join(f"{a.split()[-1]} {100*c//n}" for a, c in dem.most_common(3))
    cuoi = subprocess.run(['git', 'log', '-1', '--format=%ad', '--date=format:%m/%Y', rev, '--', t], capture_output=True, text=True).stdout.strip()
    bus = sum(1 for c in dem.values() if c / n >= 0.2)
    print(f"{'/'.join(t.split('/')[-2:]):28} {n:>4}  {ai:40} {cuoi:10} {bus}")
`);
const O84_VISAO = out(`
$ git log -S"2000" --format="%h %ad %an | %s" --date=short master -- db src     # số 2.000 xuất hiện/biến mất ở commit nào?
1dfb1cd 2019-11-04 Le Thi Lan | TV-77 bao cao phieu qua han + dem qua han tren menu
7b36199 2017-05-02 Tran Quoc Hung | TV-45 tinh phi tre han khi tra sach
1133063 2016-03-02 Nguyen Anh Tuan | init project
$ git show 7b36199 | grep -E "^\\+.*fine = days"                                  # TV-45: phí theo loại độc giả
+                        fine = days * 2000;
+                        fine = days * 1000;
+                        fine = days * 5000;
$ git show 1dfb1cd -- db/thuvien.sql | grep -E "^\\+" | grep -iE "2000|PROCEDURE|est_fine"    # TV-77: báo cáo
+-- Procedure: bao cao qua han (Lan 2019)
+CREATE DEFINER=\`root\`@\`%\` PROCEDURE \`sp_overdue_report\`(IN p_min_days INT)
+         DATEDIFF(NOW(), l.due_date) * 2000 AS est_fine
$ git log -S"50000" --format="%h %ad %an | %s" --date=short master -- src
c4b91f7 2017-06-19 Tran Quoc Hung | TV-52 SV khieu nai phi qua cao -> tran 50k (chi ap dung SV theo y kien phong CTSV)
$ head -1 ../legacy-express/lib/phi.js; grep -n ceil ../legacy-express/lib/phi.js
// Tinh phi tre han — chep tu ben Java sang (Hung, 03/2018). "Giong het BookServlet".
7:  tre = Math.ceil(tre);
`);
const O84_QA = out(`
Q&A list — dự án Thư viện (bảo trì)                                     cập nhật 24/11/2026
#   Ngày   Hỏi ai           Câu hỏi                                                        Trả lời / trạng thái
14  24/11  chị Hoa (thủ thư) Sách 7 "Tiếng Nhật sơ cấp 1": kho ghi 5, CSDL tính ra 6.        "Mất 1 cuốn tháng 9, chị trừ tay."
                             Có đúng là đang thiếu 1 cuốn không? (thấy khi kiểm TV-108)     ⇒ đúng, KHÔNG sửa dữ liệu. Đóng.
15  24/11  PO phía khách     Báo cáo quá hạn tính đồng giá 2.000 đ, màn hình trả sách tính  Đang chờ (hẹn 27/11).
           (cc chị Hoa)      theo loại (GV 1.000, khách 5.000, trần SV 50.000). Báo cáo      Đã ghi ADR 0001 (đề xuất).
                             cần đúng từng đồng hay chỉ để ước tính?
16  24/11  IT khách          API mobile chạy mấy tiến trình node trên production?           "1 tiến trình, systemd." Đóng.
`);
const C84_GHICHU = java(`
            // LƯU Ý (TV-77, Lan 11/2019): sp_overdue_report tính ĐỒNG GIÁ 2.000 đ/ngày (cột est_fine = ước tính) — khác LoaiDocGia
            // (SV/GV/khách, trần SV). Người viết đã nghỉ; chưa rõ cố ý hay sót. Đừng "sửa cho khớp" trước khi xem docs/adr/0001.
            cs = con.prepareCall("{call sp_overdue_report(?)}");
`);
const C84_ADR = `# ADR 0001 — Phí trễ hạn: Java (LoaiDocGia) là nguồn đúng; báo cáo chỉ là ước tính

- Trạng thái: Đề xuất (24/11/2026) — chờ khách xác nhận, Q&A #15
- Người viết: hocvien (đội bảo trì) · Người duyệt: trưởng nhóm, chị Hoa (thủ thư), phòng CTSV (trần phí SV)

## Bối cảnh
Có BA cách tính phí trễ hạn trong hệ thống, cho cùng một phiếu ra ba con số:
- Java LoaiDocGia (từ TV-45, Hùng 05/2017): SV 2.000 đ/ngày (trần 50.000 đ theo TV-52, ý kiến phòng CTSV), GV 1.000 đ, khách 5.000 đ; ngày lẻ CẮT.
- sp_overdue_report (TV-77, Lan 11/2019): đồng giá 2.000 đ/ngày cho mọi loại, cột tên est_fine (ước tính), không trần.
- API Node lib/phi.js (Hùng 2018): làm tròn ngày lẻ LÊN (phiếu 1 lúc 10:00 24/11/2026: Node 20.000 đ, Java 18.000 đ).
Người viết cả ba đã nghỉ. Thủ thư thu tiền theo màn hình "Trả sách" (Java). Báo cáo quá hạn dùng để gọi nhắc độc giả.

## Quyết định
1. Số tiền THU là của Java. Mọi chỗ khác hiển thị phí phải khớp Java hoặc ghi rõ "ước tính".
2. Báo cáo giữ đồng giá trong lúc chờ khách; thêm chú thích "phí ước tính" trên trang (ticket TV-115) — không sửa SQL khi chưa có xác nhận.
3. API Node đổi sang cắt ngày lẻ như Java (ticket TV-116), vì app hiện "phí dự kiến" cao hơn số thủ thư thu.

## Hệ quả
- Tốt: một nguồn đúng, mọi lệch đều có ticket. Khi thêm loại độc giả (TV-95) chỉ cần sửa LoaiDocGia.
- Xấu: báo cáo còn sai cho GV/khách tới khi TV-115 xong; độc giả từng thấy "phí dự kiến" Node cao hơn có thể thắc mắc.
- Nếu khách trả lời "báo cáo phải đúng từng đồng": viết ADR 0002 thay thế mục 2 (gọi Java hoặc đưa bảng giá vào CSDL).`;
const O84_ADR_GIT = out(`
$ git show --stat --format="%h %s" HEAD
5358c29 docs(8.4): ADR 0001 phi tre han, ADR 0002 TV-98; ghi chu canh bao o ReportServlet (khong doi hanh vi)
 docs/adr/0001-phi-tre-han-mot-nguon.md              | 21 +++++++++++++++++++++
 docs/adr/0002-tv98-xep-hang-trong-tien-trinh.md     | 16 ++++++++++++++++
 docs/adr/README.md                                  |  8 ++++++++
 .../java/com/thuvien/servlet/ReportServlet.java     |  2 ++
 4 files changed, 47 insertions(+)
$ git log --format="%h %s" -- docs/adr/0001-phi-tre-han-mot-nguon.md     # hai năm sau: ai quyết, khi nào, vì sao
5358c29 docs(8.4): ADR 0001 phi tre han, ADR 0002 TV-98; ghi chu canh bao o ReportServlet (khong doi hanh vi)
`);

const L84 = ml((en) => `
<span class="eyebrow">${en ? 'Chapter 8 · Fixing bugs in someone else’s code' : 'Chương 8 · Sửa lỗi trong code của người khác'}</span>
<h2>${en ? '8.4 — When the author is gone: asking, documenting decisions, ADRs' : '8.4 — Khi người viết đã nghỉ: hỏi ai, ghi lại quyết định, ADR'}</h2>
<p class="lead">${en
  ? 'You buy an old house and find a pipe that goes into the wall and nowhere else. The builder is gone. You do not cut it to see what happens: you ask the neighbours who have lived there longest, you look for old plans, and when you finally know, you write it on a note taped to the wall for the next owner. In legacy code that pipe is a strange number in a stored procedure; the neighbours are the BA, the tester and the users; and the note is a comment and an ADR. This lesson does all three on the library app’s three different late fees.'
  : 'Bạn mua một căn nhà cũ và thấy một đoạn ống đi vào tường rồi không đi đâu cả. Thợ xây đã đi mất. Bạn không cắt thử xem chuyện gì xảy ra: bạn hỏi hàng xóm ở lâu nhất, tìm bản vẽ cũ, và khi đã biết thì viết lên một mảnh giấy dán vào tường cho chủ nhà sau. Trong code cũ, đoạn ống đó là một con số lạ trong stored procedure; hàng xóm là BA, tester và người dùng; còn mảnh giấy là một dòng comment và một ADR. Bài này làm cả ba việc trên ba cách tính phí trễ hạn khác nhau của ứng dụng thư viện.'}</p>
${moiTruong(en)}

<h3>${en ? 'Who still knows? A knowledge map from Git' : 'Ai còn biết? Bản đồ tri thức từ Git'}</h3>
<p>${en
  ? 'Before asking anyone, find out whose knowledge you are missing. <code>git blame</code> per line, aggregated per file, gives a map: who wrote most of each file, when it was last touched, and the <strong>bus factor</strong> — how many people would have to disappear (“be hit by a bus”) before nobody understands the file. A 14-line script:'
  : 'Trước khi hỏi ai, hãy tìm xem bạn đang thiếu tri thức của ai. <code>git blame</code> theo từng dòng, gộp theo tệp, cho ra một tấm bản đồ: ai viết phần lớn mỗi tệp, lần cuối được chạm khi nào, và <strong>hệ số xe buýt</strong> (bus factor) — cần bao nhiêu người biến mất ("bị xe buýt tông") thì không còn ai hiểu tệp đó. Một script 14 dòng:'}</p>
${P84_AIBIET}
${O84_AIBIET}
<p>${en
  ? 'Fourteen of sixteen files have a bus factor of 1, and all three authors stopped committing between 2018 and 2019. That is normal for an outsourced maintenance project — and it tells you two things. First, “ask the author” is not an option; you need the people <em>around</em> the code. Second, the most valuable thing you can leave behind is written knowledge, because you will leave too. (The same map on <code>ch8</code> would show “hocvien” everywhere — the course’s refactoring made the bus factor of this repo even worse. Lesson 9.3’s handover exists for that reason.)'
  : 'Mười bốn trên mười sáu tệp có hệ số xe buýt bằng 1, và cả ba tác giả đều ngừng commit trong khoảng 2018–2019. Ở dự án bảo trì outsourcing, chuyện đó bình thường — và nó cho bạn biết hai điều. Một, "hỏi người viết" không phải là lựa chọn; bạn cần những người <em>xung quanh</em> code. Hai, thứ đáng giá nhất bạn để lại là tri thức viết ra, vì rồi bạn cũng sẽ rời đi. (Cùng tấm bản đồ đó trên <code>ch8</code> sẽ hiện "hocvien" ở khắp nơi — đợt refactor của khoá còn làm hệ số xe buýt của repo tệ hơn. Phần bàn giao ở bài 9.3 tồn tại vì lý do đó.)'}</p>

<h3>${en ? 'Who to ask instead' : 'Hỏi ai thay thế'}</h3>
<table>
<tr><th>${en ? 'Person' : 'Người'}</th><th>${en ? 'What they know' : 'Họ biết gì'}</th><th>${en ? 'Good question for them' : 'Câu hỏi hợp với họ'}</th></tr>
<tr><td>${en ? 'BA / PO (customer side)' : 'BA / PO (phía khách)'}</td><td>${en ? 'What the system <em>should</em> do; who decided rules' : 'Hệ thống <em>phải</em> làm gì; ai quyết các luật'}</td><td>${en ? '“Must the overdue report be exact, or is it an estimate?”' : '"Báo cáo quá hạn phải đúng từng đồng hay chỉ là ước tính?"'}</td></tr>
<tr><td>${en ? 'Tester / QA' : 'Tester / QA'}</td><td>${en ? 'Old test cases, known quirks, what was accepted' : 'Test case cũ, các điểm kỳ quặc đã biết, điều đã được chấp nhận'}</td><td>${en ? '“Was the flat fee in the report ever reported as a bug?”' : '"Phí đồng giá trong báo cáo đã từng bị báo lỗi chưa?"'}</td></tr>
<tr><td>${en ? 'End users (the librarian)' : 'Người dùng cuối (thủ thư)'}</td><td>${en ? 'How the system is really used, workarounds, manual fixes' : 'Hệ thống được dùng thật ra sao, các cách lách, chỗ chỉnh tay'}</td><td>${en ? '“Which screen do you collect fines from?”' : '"Chị thu tiền theo màn hình nào?"'}</td></tr>
<tr><td>${en ? 'Rule owners (student affairs office)' : 'Chủ của luật (phòng CTSV)'}</td><td>${en ? 'Why a business rule exists (the 50k cap of TV-52)' : 'Vì sao một luật nghiệp vụ tồn tại (trần 50k của TV-52)'}</td><td>${en ? '“Does the cap apply to postgraduates (TV-95)?”' : '"Trần phí có áp cho NCS (TV-95) không?"'}</td></tr>
<tr><td>${en ? 'Customer IT / operations' : 'IT / vận hành của khách'}</td><td>${en ? 'How it runs: servers, processes, jobs, backups' : 'Nó chạy thế nào: máy chủ, tiến trình, job, sao lưu'}</td><td>${en ? '“How many node processes serve the mobile API?”' : '"API mobile chạy mấy tiến trình node?"'}</td></tr>
<tr><td>${en ? 'Artefacts' : 'Hiện vật'}</td><td>${en ? 'Old tickets, emails, chat, commit messages, the production data itself' : 'Ticket cũ, email, chat, lời commit, chính dữ liệu production'}</td><td>${en ? '<code>git log --grep=TV-77</code>, search the old tracker' : '<code>git log --grep=TV-77</code>, tìm trong hệ thống ticket cũ'}</td></tr>
</table>
<p>${en
  ? 'Before asking, do your homework so the question is answerable in one line. Here, Git already tells most of the story:'
  : 'Trước khi hỏi, làm bài tập về nhà để câu hỏi trả lời được trong một dòng. Ở đây, Git đã kể gần hết câu chuyện:'}</p>
${O84_VISAO}
<p>${en
  ? 'So: in 2017 Hùng made fees depend on reader type; in 2019 Lan wrote the report with a flat 2,000 — and named the column <code>est_fine</code>, “estimated fine”. That name is a clue that the simplification may have been deliberate. And the Node API “copied from Java” in 2018 but rounds days up. Three sources of truth, no author to ask, and a real risk: “fixing” the report to match Java might break a use the librarian relies on. This is where good questions go — a <strong>Q&A list</strong>, the shared table outsourcing projects keep with the customer (format: agile-teamwork 9.5):'
  : 'Vậy: năm 2017 Hùng cho phí phụ thuộc loại độc giả; năm 2019 Lan viết báo cáo đồng giá 2.000 — và đặt tên cột là <code>est_fine</code>, "phí ước tính". Cái tên đó là manh mối rằng sự đơn giản hoá có thể là cố ý. Còn API Node "chép từ bên Java sang" năm 2018 nhưng làm tròn ngày lên. Ba nguồn sự thật, không còn tác giả để hỏi, và một rủi ro thật: "sửa" báo cáo cho khớp Java có thể làm hỏng một cách dùng mà thủ thư đang dựa vào. Câu hỏi tốt được đặt ở đây — một <strong>Q&A list</strong>, bảng dùng chung mà dự án outsourcing giữ với khách (định dạng: agile-teamwork 9.5):'}</p>
${O84_QA}
<p>${en
  ? 'Each question states what you found, what you need, and offers a default (“keep it as an estimate?”). Question 14 shows why asking beats guessing: book 7’s “missing copy” from lesson 8.3 was a lost book the librarian corrected by hand — “fixing” the data would have created a ghost copy, the very bug TV-108 just removed.'
  : 'Câu nào cũng nêu điều bạn tìm thấy, điều bạn cần, và đưa sẵn một phương án mặc định ("giữ là ước tính nhé?"). Câu 14 cho thấy vì sao hỏi tốt hơn đoán: "bản sách thiếu" của sách 7 ở bài 8.3 là một cuốn bị mất mà thủ thư đã trừ tay — nếu "sửa" dữ liệu thì đã tạo ra đúng một bản sách ma, chính cái lỗi TV-108 vừa gỡ.'}</p>
<div class="callout"><p>${en
  ? '<strong>The answers in this Q&A list are part of the course’s scenario</strong> (the librarian, PO and IT are role-played); the Git findings above them are real output. In your real project the same table lives in Excel or the ticket system, and the answers come from real people — which is the point.'
  : '<strong>Các câu trả lời trong Q&A list này thuộc kịch bản của khoá</strong> (thủ thư, PO và IT là vai giả định); các phát hiện Git phía trên là output thật. Ở dự án thật, bảng này nằm trong Excel hoặc hệ thống ticket, và câu trả lời đến từ người thật — đó mới là điều quan trọng.'}</p></div>

<h3>${en ? 'Leave a note where the next person will trip' : 'Để lại ghi chú đúng chỗ người sau sẽ vấp'}</h3>
<p>${en
  ? 'When you discover something surprising, write it <em>at the place where someone will be surprised</em>, the day you find it — even if the question is not answered yet. Not “TODO fix”, but what you know, what you do not, and where the decision lives:'
  : 'Khi phát hiện điều bất ngờ, hãy viết nó <em>đúng tại chỗ người khác sẽ bất ngờ</em>, ngay hôm bạn tìm ra — kể cả khi câu hỏi chưa có lời đáp. Không phải "TODO sửa", mà là điều bạn biết, điều chưa biết, và quyết định nằm ở đâu:'}</p>
${C84_GHICHU}
<p>${en
  ? 'A good surprise comment has four parts: the ticket or origin (<em>TV-77, Lan 11/2019</em>), the fact (<em>flat 2,000</em>), the uncertainty (<em>not clear if deliberate</em>), and the pointer (<em>see ADR 0001</em>). It changes no behaviour, so it can go in its own tiny commit or with the fix that made you find it. Comments explain <em>why</em>; the code already says <em>what</em>.'
  : 'Một comment "điều bất ngờ" tốt có bốn phần: ticket hay nguồn gốc (<em>TV-77, Lan 11/2019</em>), sự thật (<em>đồng giá 2.000</em>), điều chưa chắc (<em>chưa rõ cố ý hay sót</em>), và chỗ tra tiếp (<em>xem ADR 0001</em>). Nó không đổi hành vi, nên có thể đi trong một commit nhỏ riêng hoặc cùng bản sửa đã khiến bạn phát hiện ra nó. Comment giải thích <em>vì sao</em>; code đã tự nói <em>cái gì</em>.'}</p>

<h3>${en ? 'ADR: a short record of a decision' : 'ADR: bản ghi ngắn của một quyết định'}</h3>
<p>${en
  ? 'An <strong>Architecture Decision Record</strong> (Michael Nygard, “Documenting Architecture Decisions”, 2011) is a one-page Markdown file in the repository: context, decision, consequences, status. Despite the name, in maintenance work it is for any decision that is hard to reverse or will make someone ask “why on earth is it like this?” — which is exactly what the three late fees are. The general technique is taught in agile-teamwork 5.2; here is one written for a real legacy decision:'
  : '<strong>Architecture Decision Record</strong> (ADR — Michael Nygard, "Documenting Architecture Decisions", 2011) là một tệp Markdown một trang nằm trong repo: bối cảnh, quyết định, hệ quả, trạng thái. Tên là "kiến trúc", nhưng trong việc bảo trì nó dùng cho mọi quyết định khó đảo ngược hoặc sẽ khiến người khác hỏi "sao lại thế này?" — đúng như ba cách tính phí trễ hạn. Kỹ thuật chung đã dạy ở agile-teamwork 5.2; đây là một ADR viết cho một quyết định thật trên code cũ:'}</p>
${out(C84_ADR)}
${O84_ADR_GIT}
<ul>
<li>${en ? '<strong>Status “Proposed” is fine.</strong> The ADR records the current best decision and what would change it; when the customer answers, flip it to “Accepted” or write a new ADR that supersedes it. Never rewrite an accepted ADR — history is the point.' : '<strong>Trạng thái "Đề xuất" là được.</strong> ADR ghi quyết định tốt nhất lúc này và điều gì sẽ làm nó đổi; khi khách trả lời, chuyển sang "Chấp nhận" hoặc viết ADR mới thay thế. Đừng bao giờ viết lại một ADR đã chấp nhận — lịch sử mới là thứ cần giữ.'}</li>
<li>${en ? '<strong>Small and many beats big and none.</strong> ADR 0002 (the TV-98 queue instead of moving to MySQL) is 16 lines and answers the first question every future reviewer will ask about <code>lib/tuan-tu.js</code>.' : '<strong>Nhỏ mà nhiều hơn to mà không có.</strong> ADR 0002 (hàng đợi TV-98 thay vì chuyển sang MySQL) chỉ 16 dòng và trả lời câu hỏi đầu tiên mọi người review sau này sẽ hỏi về <code>lib/tuan-tu.js</code>.'}</li>
<li>${en ? '<strong>Commit it with the code.</strong> In the repo, <code>git log</code> answers “who decided and when”; in a wiki it gets lost with the next tool migration.' : '<strong>Commit cùng code.</strong> Nằm trong repo thì <code>git log</code> trả lời được "ai quyết, khi nào"; nằm trên wiki thì sẽ thất lạc ở lần đổi công cụ tiếp theo.'}</li>
</ul>

<h3>🕵️ ${en ? 'Real incidents: when knowledge was only in people’s heads' : 'Sự cố thật: khi tri thức chỉ nằm trong đầu người'}</h3>
<p>${en
  ? '<strong>New Jersey, April 2020.</strong> When COVID-19 made unemployment claims explode, the state’s benefits system — written in COBOL decades earlier — could not keep up, and Governor Phil Murphy publicly asked for volunteers who knew COBOL. The code still ran; the people who understood it had retired. <strong>GitLab, 31 January 2017.</strong> An engineer removing a database directory on what he thought was the replica ran the command on the primary; about 300 GB were deleted. The post-mortem found that five backup and replication mechanisms were in place and none worked as believed — nobody had written down or regularly tested how restore actually worked, so roughly six hours of data were lost. Both are the same lesson at different scales: a system is only as maintainable as its <em>written</em> knowledge — runbooks, ADRs, comments where people trip, and tests that prove what the documents claim.'
  : '<strong>New Jersey, tháng 4/2020.</strong> Khi COVID-19 làm số đơn trợ cấp thất nghiệp tăng vọt, hệ thống trợ cấp của bang — viết bằng COBOL từ nhiều thập kỷ trước — không theo kịp, và Thống đốc Phil Murphy công khai kêu gọi tình nguyện viên biết COBOL. Code vẫn chạy; người hiểu nó thì đã nghỉ hưu. <strong>GitLab, 31/1/2017.</strong> Một kỹ sư định xoá thư mục CSDL trên máy anh nghĩ là bản sao, nhưng lại chạy lệnh trên máy chính; khoảng 300 GB bị xoá. Báo cáo sau sự cố cho thấy có năm cơ chế sao lưu và nhân bản, không cái nào hoạt động như mọi người tưởng — không ai ghi lại hay thường xuyên thử việc khôi phục thật sự diễn ra thế nào, nên mất khoảng sáu giờ dữ liệu. Hai vụ là cùng một bài học ở hai quy mô: một hệ thống chỉ bảo trì được tới mức tri thức <em>viết ra</em> của nó — runbook, ADR, comment đúng chỗ người ta vấp, và test chứng minh điều tài liệu khẳng định.'}</p>

<h3>💼 ${en ? 'OJT situation: “the previous vendor left no documentation”' : 'Tình huống OJT: "nhà thầu trước không để lại tài liệu gì"'}</h3>
<p>${en
  ? 'Very common when a customer moves a system from one outsourcing company to another. Week one: build it (Chapter 1), map it (Chapter 2), run the knowledge map, list the bus-factor-1 areas with the riskiest business rules, and turn every “why?” into a Q&A-list entry with a proposed default. Report it as risk, not complaint: “14 of 16 files have no remaining author; 3 open questions on fee rules block TV-95; proposed: 1-hour session with the librarian and the PO this week.” Leads and customers remember the intern who did that.'
  : 'Rất hay gặp khi khách chuyển một hệ thống từ công ty outsourcing này sang công ty khác. Tuần đầu: dựng chạy (Chương 1), vẽ bản đồ (Chương 2), chạy bản đồ tri thức, liệt kê các vùng có hệ số xe buýt 1 chứa luật nghiệp vụ rủi ro nhất, và biến mỗi câu "vì sao?" thành một dòng Q&A list kèm phương án đề xuất. Báo cáo nó như rủi ro, không như lời phàn nàn: "14/16 tệp không còn tác giả; 3 câu hỏi mở về luật tính phí đang chặn TV-95; đề xuất: một buổi 1 giờ với thủ thư và PO trong tuần này." Trưởng nhóm và khách sẽ nhớ thực tập sinh đã làm như thế.'}</p>

<h3>🎤 ${en ? 'What the interviewer will ask' : 'Phỏng vấn viên sẽ hỏi'}</h3>
<ol>
<li><strong>${en ? '“You find logic you do not understand and the author has left. What do you do?”' : '"Em gặp logic không hiểu và người viết đã nghỉ. Em làm gì?"'}</strong><br>${en
  ? 'Pin current behaviour with a characterization test; dig history (blame, log -S, ticket IDs); ask the people around the code — BA/PO, tester, users, operations — with a concrete question and a proposed default; write the answer down (comment at the spot, ADR if it is a decision).'
  : 'Khoá hành vi hiện tại bằng characterization test; đào lịch sử (blame, log -S, mã ticket); hỏi những người xung quanh code — BA/PO, tester, người dùng, vận hành — bằng một câu cụ thể kèm phương án mặc định; ghi lại câu trả lời (comment tại chỗ, ADR nếu đó là một quyết định).'}</li>
<li><strong>${en ? '“What is an ADR and when do you write one?”' : '"ADR là gì và khi nào em viết?"'}</strong><br>${en
  ? 'A short Markdown record in the repo: context, decision, consequences, status. When a decision is hard to reverse or will surprise future readers — e.g. keeping a known inconsistency on purpose, or choosing a temporary fix over a rewrite.'
  : 'Một bản ghi Markdown ngắn trong repo: bối cảnh, quyết định, hệ quả, trạng thái. Viết khi quyết định khó đảo ngược hoặc sẽ làm người đọc sau bất ngờ — ví dụ cố ý giữ một chỗ lệch đã biết, hay chọn bản sửa tạm thay vì viết lại.'}</li>
<li><strong>${en ? '“What is the bus factor, and how would you measure it?”' : '"Bus factor là gì, em đo bằng cách nào?"'}</strong><br>${en
  ? 'How many people must leave before nobody understands a part of the system. A rough measure: per file, how many authors own a meaningful share of the current lines (git blame), combined with recent activity.'
  : 'Cần bao nhiêu người rời đi thì không ai còn hiểu một phần của hệ thống. Cách đo thô: theo từng tệp, có bao nhiêu tác giả nắm phần đáng kể số dòng hiện tại (git blame), kết hợp với mức hoạt động gần đây.'}</li>
<li><strong>${en ? '“What makes a good code comment?”' : '"Comment tốt là comment thế nào?"'}</strong><br>${en
  ? 'It says why, not what: the origin (ticket), the non-obvious fact or constraint, what is still uncertain, and where to read more. It sits exactly where the next reader will be surprised.'
  : 'Nó nói vì sao, không nói cái gì: nguồn gốc (ticket), sự thật hay ràng buộc không hiển nhiên, điều còn chưa chắc, và đọc thêm ở đâu. Nó nằm đúng chỗ người đọc sau sẽ bất ngờ.'}</li>
</ol>

<h3>✍️ ${en ? 'Exercise' : 'Bài tập'}</h3>
<p>${en
  ? '(1) Run <code>ai-biet.py</code> on <code>legacy-express</code> (branch <code>master</code>): which file has the worst bus factor <em>and</em> the most important business rule? (2) Find with <code>git log -S</code> when the Node API started rounding days up. (3) Write ADR 0003 for TV-41 (the <code>&gt;</code> vs <code>&gt;=</code> borrow limit, lessons 3.1/5.5): context, decision, consequences — in under 20 lines. (4) Write the Q&A-list entry you would send before fixing TV-41.'
  : '(1) Chạy <code>ai-biet.py</code> trên <code>legacy-express</code> (nhánh <code>master</code>): tệp nào vừa có hệ số xe buýt tệ nhất <em>vừa</em> chứa luật nghiệp vụ quan trọng nhất? (2) Dùng <code>git log -S</code> tìm xem API Node bắt đầu làm tròn ngày lên từ khi nào. (3) Viết ADR 0003 cho TV-41 (giới hạn mượn <code>&gt;</code> hay <code>&gt;=</code>, bài 3.1/5.5): bối cảnh, quyết định, hệ quả — dưới 20 dòng. (4) Viết dòng Q&A list bạn sẽ gửi trước khi sửa TV-41.'}</p>
${giai(en ? '🔑 Answers' : '🔑 Đáp án', `<ol>
<li>${en ? 'Every file has bus factor 1 (the Express history was rebuilt in 2026, so dates are not useful here). <code>lib/phi.js</code> (Hùng 100 %) holds the fee rule and <code>routes/muon.js</code> (Lan 100 %) the borrow rule.' : 'Tệp nào cũng có hệ số xe buýt 1 (lịch sử repo Express được dựng lại năm 2026 nên ngày tháng ở đây không có ích). <code>lib/phi.js</code> (Hùng 100 %) giữ luật tính phí và <code>routes/muon.js</code> (Lan 100 %) giữ luật mượn.'}</li>
<li>${en ? '<code>git log -S"Math.ceil" --oneline -- lib</code> ⇒ <code>19ce130 Hung api mobile: phi du kien + qua han</code>, the commit that created <code>lib/phi.js</code>.' : '<code>git log -S"Math.ceil" --oneline -- lib</code> ⇒ <code>19ce130 Hung api mobile: phi du kien + qua han</code>, commit tạo ra <code>lib/phi.js</code>.'}</li>
<li>${en ? 'Context: commit ac4b941 says “SV 3, GV 10, khach 1”, the code allows one more (<code>&gt;</code>), students have been borrowing 4 since 2017, Node uses <code>&gt;=</code>. Decision: follow the ticket text (<code>&gt;=</code>), after the customer confirms. Consequences: some students currently holding 4 books cannot borrow until they return one; announce it.' : 'Bối cảnh: commit ac4b941 ghi "SV 3, GV 10, khach 1", code cho thêm một cuốn (<code>&gt;</code>), SV mượn được 4 từ 2017, Node dùng <code>&gt;=</code>. Quyết định: theo đúng chữ ticket (<code>&gt;=</code>), sau khi khách xác nhận. Hệ quả: SV đang giữ 4 cuốn sẽ không mượn được tới khi trả bớt; cần thông báo trước.'}</li>
<li>${en ? '“TV-41 says SV max 3; since 2017 the web app allows 4 (Node allows 3). Should we enforce 3 from next release? Default proposal: yes, with a notice to students; attached: the query counting students who currently hold 4.”' : '"TV-41 ghi SV tối đa 3; từ 2017 web cho mượn 4 (Node cho 3). Từ bản phát hành tới mình áp đúng 3 nhé? Đề xuất mặc định: có, kèm thông báo cho SV; đính kèm truy vấn đếm số SV đang giữ 4 cuốn."'}</li>
</ol>`)}

<h3>🗂 ${en ? 'Key terms' : 'Thuật ngữ trong bài'}</h3>
${thuatNgu(en, [
  ['Bus factor', 'hệ số xe buýt', 'Số người phải rời đi trước khi không ai còn hiểu một phần hệ thống.', 'How many people must leave before nobody understands part of the system.'],
  ['Knowledge map', 'bản đồ tri thức', 'Ai viết phần nào, sửa lần cuối khi nào — dựng từ git blame/log.', 'Who wrote what and when it was last touched — built from git blame/log.'],
  ['Q&A list', 'danh sách hỏi đáp', 'Bảng câu hỏi chung với khách: hỏi ai, ngày, câu trả lời, trạng thái.', 'A shared question table with the customer: whom, when, answer, status.'],
  ['Surprise comment', 'comment điều bất ngờ', 'Ghi nguồn gốc, sự thật, điều chưa chắc, chỗ tra — đúng nơi người sau vấp.', 'Origin, fact, uncertainty, pointer — exactly where the next reader trips.'],
  ['ADR', 'bản ghi quyết định', 'Bối cảnh · quyết định · hệ quả · trạng thái, một trang, trong repo (Nygard 2011).', 'Context · decision · consequences · status, one page, in the repo (Nygard 2011).'],
  ['Supersede', 'thay thế', 'Quyết định mới thì viết ADR mới, ADR cũ ghi "thay thế bởi".', 'A new decision gets a new ADR; the old one says “superseded by”.'],
])}

<h3>📌 ${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'Measure whose knowledge is missing (knowledge map, bus factor) before asking anyone.' : 'Đo xem đang thiếu tri thức của ai (bản đồ tri thức, hệ số xe buýt) trước khi hỏi ai.'}</li>
<li>${en ? 'Ask the people around the code with homework done: what you found, what you need, a default proposal — and keep it in a Q&A list.' : 'Hỏi những người xung quanh code sau khi đã làm bài tập về nhà: điều đã thấy, điều cần biết, một phương án mặc định — và giữ trong Q&A list.'}</li>
<li>${en ? 'Write surprises down at the spot, the day you find them; record decisions as ADRs in the repo.' : 'Ghi điều bất ngờ ngay tại chỗ, ngay hôm phát hiện; ghi quyết định thành ADR trong repo.'}</li>
<li>${en ? 'Do not “fix” data or rules you do not understand: book 7 was a lost book, not a bug.' : 'Đừng "sửa" dữ liệu hay luật bạn chưa hiểu: sách 7 là sách mất, không phải lỗi.'}</li>
</ul>
${tl('https://www.cognitect.com/blog/2011/11/15/documenting-architecture-decisions', '📝', 'Michael Nygard — Documenting Architecture Decisions (2011)', en ? 'The original ADR article' : 'Bài viết gốc về ADR')}
${tl('https://about.gitlab.com/blog/2017/02/10/postmortem-of-database-outage-of-january-31/', '🦊', 'GitLab — Postmortem of database outage of January 31 (2017)', en ? 'Five backup methods, none working' : 'Năm cách sao lưu, không cách nào chạy')}
${tl('https://adr.github.io', '📚', 'adr.github.io', en ? 'ADR templates and tools' : 'Mẫu và công cụ ADR')}
${lk(bai('agile-teamwork', 'agl-5-2-adr'), '🤝', en ? 'Agile teamwork 5.2 — Recording architecture decisions (ADR)' : 'Agile teamwork 5.2 — Ghi quyết định kiến trúc (ADR)', en ? 'The general technique' : 'Kỹ thuật chung')}
${lk(bai('agile-teamwork', 'agl-9-5-qa-cr'), '🤝', en ? 'Agile teamwork 9.5 — Q&A list and change requests' : 'Agile teamwork 9.5 — Q&A list với khách và change request', en ? 'The outsourcing Q&A format' : 'Định dạng Q&A của outsourcing')}
${lk(bai('agile-teamwork', 'agl-8-2-hoi'), '🤝', en ? 'Agile teamwork 8.2 — Asking good questions' : 'Agile teamwork 8.2 — Hỏi câu hỏi tốt', en ? 'How to ask so people answer' : 'Hỏi sao cho người ta trả lời')}
`);

/* ═══════════════════ 8.5 — Lab ═══════════════════ */
const O85_BACKLOG = out(`
TV-96  [Web] Đăng nhập tự động bằng cookie "Ghi nhớ" lỗi lạ                          Ưu tiên: Cao   Người báo: IT khách
       Có máy mở trang đăng nhập thì ra trang "Có lỗi xảy ra" kèm cả trang chữ tiếng Anh. Pentest nội bộ còn ghi chú:
       "cookie remember sửa đuôi vẫn đăng nhập được".
TV-98  [API mobile] App báo tạo phiếu thành công nhưng thủ thư không thấy phiếu         Ưu tiên: Cao   Người báo: chị Hoa
       Giờ cao điểm (8:00, sinh viên đặt sách qua app) mất vài phiếu mỗi ngày; một lần cả API trả lỗi tới khi IT khởi động lại.
TV-109 [Web] Trang lỗi hiện chi tiết kỹ thuật                                           Ưu tiên: TB    Người báo: IT khách (quét bảo mật)
       Công cụ quét báo "Information exposure through an error message (CWE-209)" ở /thuvien/books.jsp.
`);
const O85_TV96_TRUOC = out(`
$ curl -s -i -b "remember=admin:" http://127.0.0.1:41880/thuvien/login | head -12
HTTP/1.1 500
Content-Type: text/html;charset=UTF-8
Content-Length: 2333
Connection: close

<html><body>
<h2>Có lỗi xảy ra</h2>
<pre>java.lang.ArrayIndexOutOfBoundsException: Index 1 out of bounds for length 1
	at com.thuvien.servlet.LoginServlet.nguoiDungTuCookie(LoginServlet.java:50)
	...
$ curl -s -o /dev/null -w "%{http_code} %{redirect_url}\\n" -b "remember=thuthu:37876f012402c506e151a9f407c5c1f9:rac" http://127.0.0.1:41880/thuvien/login
302 http://127.0.0.1:41880/thuvien/books
`);
const O85_GIA = out(`
# kẻ tấn công chỉ cần đọc mã nguồn (repo lộ, cựu nhân viên, tệp WAR giải nén được): bí mật "thuvien2016" nằm trong TokenUtil
$ printf %s "adminthuvien2016" | md5sum
a316eabce65f3759e1ce2d96db99486c  -
$ curl -s -o /dev/null -w "%{http_code} %{redirect_url}\\n" -c jar.txt -b "remember=admin:a316eabce65f3759e1ce2d96db99486c" http://127.0.0.1:41880/thuvien/login
302 http://127.0.0.1:41880/thuvien/books
$ curl -s -b jar.txt http://127.0.0.1:41880/thuvien/books | grep -oE "Xin ch[^<]*"
Xin chÃ o admin |          ← đã vào với quyền admin (chữ vỡ là lỗi pageEncoding của header.jsp từ bài 1.1, không liên quan)
`);
const O85_TV96_DO = out(`
$ mvn -B -o test -Dtest=LoginServletCookieTest          # đã đảo 2 test _BUG, CHƯA sửa LoginServlet
[ERROR]   LoginServletCookieTest.duoiThua_khongDangNhap_TV96:76
[ERROR]   LoginServletCookieTest.dauHaiChamCuoi_hienTrangLogin_TV96:83->voiCookie:36 » ArrayIndexOutOfBounds Index 1 out of bounds for length 1
[ERROR] Tests run: 7, Failures: 1, Errors: 1, Skipped: 0
`);
const O85_JSP_TRUOC = out(`
$ curl -s -i http://127.0.0.1:41880/thuvien/books.jsp | sed -n '1p;/<pre>/,+3p'
HTTP/1.1 500
<pre>org.apache.jasper.JasperException: An exception occurred processing [/books.jsp] at line [18]

15:   <tr><th>ID</th><th>Mã</th><th>Tên sách</th><th>Tác giả</th><th>Còn/Tổng</th><th>Mượn</th></tr>
16: <%
$ curl -s http://127.0.0.1:41880/thuvien/books.jsp | grep -c "	at "      # số dòng stack trace lộ ra
31
`);
const O85_TV109_DO = out(`
$ mvn -B -f e2e/pom.xml test        # Testcontainers, đã đảo kỳ vọng moThangJsp, CHƯA sửa error.jsp
[ERROR]   MuonSachQuaHttpTest.moThangJsp_khongCanDangNhap:119 expected: <true> but was: <false>
[ERROR] Tests run: 3, Failures: 1, Errors: 0, Skipped: 0
[INFO] Total time:  27.168 s
`);
const O85_NODE_DO = out(`
$ npx jest __tests__/muon.dong-thoi.test.js          # chạy 3 lần: lần nào cũng đỏ
  ● hai lượt mượn đồng thời ⇒ hai phiếu khác id, tệp có 7 phiếu
      Array [
        6,
    -   7,
    +   6,
      ]
  ● năm lượt đồng thời, có lượt bị từ chối ⇒ mọi lượt 201 đều nằm trong tệp
    Expected length: 9
    Received length: 6
Tests:       2 failed, 2 total
$ seq 2 6 | xargs -P5 -I{} curl -s -X POST -H 'Content-Type: application/json' -d '{"docGia":{},"sach":"Sach {}"}' 127.0.0.1:41390/api/muon
{"loi":"khong tim thay doc gia"}
{"loi":"khong tim thay doc gia"}
{"phieu":6,"hanTra":"08/12/2026","phi":0}
{"phieu":6,"hanTra":"24/12/2026","phi":0}
{"loi":"vuot qua so sach duoc muon","dangMuon":1,"toiDa":1}
$ node -e 'console.log(require("./data/phieu.json").map(p => p.id).join(" "))'
1 2 3 4 5 6                  ← hai lượt cùng được "phiếu 6", tệp chỉ còn một
`);
const O85_SAU = out(`
# ── TV-96 ──
$ curl -s -i -b "remember=admin:" http://127.0.0.1:41880/thuvien/login | head -1
HTTP/1.1 200                 ← trang đăng nhập bình thường
$ curl -s -o /dev/null -w "%{http_code} %{redirect_url}\\n" -b "remember=thuthu:37876f012402c506e151a9f407c5c1f9:rac" http://127.0.0.1:41880/thuvien/login
200
$ curl -s -o /dev/null -w "%{http_code} %{redirect_url}\\n" -b "remember=thuthu:37876f012402c506e151a9f407c5c1f9" http://127.0.0.1:41880/thuvien/login     # cookie đúng vẫn đăng nhập
302 http://127.0.0.1:41880/thuvien/books
# ── TV-109 ──
$ curl -s -i http://127.0.0.1:41880/thuvien/books.jsp | sed -n "1p;/<h2>/,/<\\/body>/p"
HTTP/1.1 500
<h2>Có lỗi xảy ra</h2>
<h3>Loi he thong, vui long thu lai (ma loi a28e77e3)</h3>
</body></html>
$ docker logs rfc-thuvien-web 2>&1 | grep -A1 "a28e77e3"      # %c{1} của log4j in "jsp" (phần sau dấu chấm của "error.jsp")
00:27:59 ERROR jsp - loi a28e77e3 uri=/thuvien/books.jsp
org.apache.jasper.JasperException: An exception occurred processing [/books.jsp] at line [18]
# ── TV-98 ──
$ seq 2 6 | xargs -P5 -I{} curl -s -X POST ... 127.0.0.1:41390/api/muon        # nhánh tv-98
{"phieu":6,"hanTra":"08/12/2026","phi":0}
{"loi":"khong tim thay doc gia"}
{"phieu":7,"hanTra":"24/12/2026","phi":0}
{"loi":"khong tim thay doc gia"}
{"loi":"vuot qua so sach duoc muon","dangMuon":1,"toiDa":1}
$ node -e 'console.log(require("./data/phieu.json").map(p => p.id).join(" "))'
1 2 3 4 5 6 7
# ── toàn bộ, trên ch8 sau khi merge ba PR (Java) và tv-98 (Node) ──
$ mvn -B -o test                    → Tests run: 50, Failures: 0, Errors: 0, Skipped: 0 — BUILD SUCCESS
$ mvn -B -f e2e/pom.xml test        → Tests run: 3, Failures: 0, Errors: 0, Skipped: 0 — BUILD SUCCESS (36 s)
$ diff -r golden/ golden-ch8/ && echo "golden master: giong het"
golden master: giong het
$ npm test                          → Tests: 24 passed, 24 total
`);
const O85_KICHTHUOC = out(`
$ for b in tv-96 tv-108 tv-109; do echo "$b: $(git diff --shortstat 744ec02 $b)"; done      # Java; 744ec02 = ch7 + .editorconfig
tv-96:  2 files changed, 9 insertions(+), 9 deletions(-)
tv-108:  4 files changed, 19 insertions(+), 10 deletions(-)
tv-109:  2 files changed, 10 insertions(+), 3 deletions(-)
$ git diff --shortstat ch7 tv-98                                                              # Node
 4 files changed, 64 insertions(+), 2 deletions(-)
`);
const O85_DIFF96 = out(`
--- a/src/main/java/com/thuvien/servlet/LoginServlet.java
+++ b/src/main/java/com/thuvien/servlet/LoginServlet.java
             if (!c.getName().equals("remember")) continue;
-            if (!c.getValue().contains(":")) continue;
-            String[] phan = c.getValue().split(":");
+            String[] phan = c.getValue().split(":", -1);   // TV-96: đúng "ten:token" — thiếu token hay thừa đuôi đều bỏ qua
+            if (phan.length != 2) continue;
             if (TokenUtil.makeToken(phan[0]).equals(phan[1])) return phan[0];
`);
const O85_DIFF109 = out(`
--- a/src/main/webapp/error.jsp
+++ b/src/main/webapp/error.jsp
+<%-- TV-109 (CWE-209): chi tiết lỗi chỉ vào log cho dev; người dùng thấy mã tra cứu, cùng câu với BookServlet (bài 6.3) --%>
+<%
+    String maLoi = java.util.UUID.randomUUID().toString().substring(0, 8);
+    org.apache.log4j.Logger.getLogger("error.jsp").error("loi " + maLoi + " uri=" + request.getAttribute("jakarta.servlet.error.request_uri"), exception);
+%>
-<pre><% if (exception != null) exception.printStackTrace(new java.io.PrintWriter(out)); %></pre>
+<h3>Loi he thong, vui long thu lai (ma loi <%= maLoi %>)</h3>
--- a/e2e/src/test/java/com/thuvien/e2e/MuonSachQuaHttpTest.java
+++ b/e2e/src/test/java/com/thuvien/e2e/MuonSachQuaHttpTest.java
-        assertTrue(sach.body().contains("JasperException"));  // error.jsp in stack trace + mã nguồn JSP
+        assertTrue(sach.body().matches("(?s).*\\\\(ma loi [0-9a-f]{8}\\\\).*"));   // TV-109: chỉ còn mã tra cứu
+        assertFalse(sach.body().contains("Exception"));     // trước TV-109: JasperException + 31 dòng stack trace + mã nguồn JSP
`);
const O85_PR96 = out(`
## [TV-96] Cookie "Ghi nhớ" phải đúng dạng ten:token — cookie hỏng không còn ra trang lỗi, đuôi thừa không còn đăng nhập

### 1. Nguyên nhân gốc
LoginServlet.nguoiDungTuCookie tách giá trị bằng split(":") rồi lấy phan[1]:
- "admin:" ⇒ split bỏ chuỗi rỗng cuối ⇒ mảng 1 phần tử ⇒ ArrayIndexOutOfBounds ⇒ 500 + error.jsp in stack trace.
- "ten:token:rac" ⇒ chỉ so phần thứ hai ⇒ đuôi thừa bị bỏ qua ⇒ vẫn đăng nhập.
Có từ f104802 "ghi nho dang nhap" (Hùng 08/2017); hai test _BUG khoá hành vi này từ bài 5.2.

### 2. Phạm vi ảnh hưởng
- Code: nguoiDungTuCookie chỉ được gọi trong LoginServlet.doGet. TokenUtil không đổi.
- Người dùng: cookie hợp lệ (do chính ứng dụng tạo) luôn đúng dạng ten:token ⇒ không ai bị đăng xuất. Cookie hỏng/sửa tay ⇒ thấy trang đăng nhập.
- Dữ liệu, hệ thống khác: không.

### 3. Cách kiểm
- LoginServletCookieTest: duoiThua_khongDangNhap_TV96 và dauHaiChamCuoi_hienTrangLogin_TV96 đỏ trên ch8 (1 fail, 1 error
  ArrayIndexOutOfBounds), xanh sau khi sửa. mvn -B test: 49/49.
- Thủ công trên Tomcat 10.1 (curl, đính kèm): "admin:" 500 → 200; đuôi ":rac" 302 → 200; cookie đúng vẫn 302 → /books.

### 4. Rủi ro và đường lùi
- Revert an toàn. Không đổi schema, không đổi định dạng cookie.
- NGOÀI PHẠM VI, ƯU TIÊN CAO — TV-110: token = MD5(tên + "thuvien2016"), bí mật cố định nằm trong mã nguồn ⇒ ai đọc được mã
  đều tự tạo được cookie admin (đã thử: 302 vào /books với quyền admin). Cần token ngẫu nhiên lưu phía máy chủ hoặc HMAC với
  khoá trong cấu hình, cookie HttpOnly + Secure, và vô hiệu mọi cookie cũ. Không làm ở đây vì đổi định dạng cookie và cần CSDL.
`);

const L85 = ml((en) => `
<span class="eyebrow">${en ? 'Chapter 8 · Lab' : 'Chương 8 · Lab'}</span>
<h2>${en ? '8.5 — Lab: Three tickets in the legacy app, three small PRs' : '8.5 — Lab: Ba ticket trong ứng dụng cũ, ba PR nhỏ'}</h2>
<p class="lead">${en
  ? 'Monday morning, the maintenance backlog has three tickets for you: one security bug in the Java login, one data-loss race in the Node mobile API, one information leak flagged by the customer’s scanner. Each becomes one branch, one red test, one small fix and one PR with the four sections of lesson 8.3. All three were done for real on this course’s copy; the outputs below are from that run.'
  : 'Sáng thứ Hai, backlog bảo trì có ba ticket cho bạn: một lỗi bảo mật ở phần đăng nhập Java, một race làm mất dữ liệu ở API mobile Node, một chỗ lộ thông tin bị công cụ quét của khách gắn cờ. Mỗi ticket thành một nhánh, một test đỏ, một bản sửa nhỏ và một PR đủ bốn mục của bài 8.3. Cả ba đã được làm thật trên bản của khoá; output dưới đây lấy từ lượt chạy đó.'}</p>
${moiTruong(en)}
${O85_BACKLOG}

<h3>${en ? 'Rules (“done when”)' : 'Luật chơi ("Đạt khi")'}</h3>
<ul>
<li>${en ? 'Start from branch <code>ch7</code> of both repos (Java 49 tests on JDK 17, Node 21 tests on Node 22+). One ticket = one branch from the same base = one PR.' : 'Xuất phát từ nhánh <code>ch7</code> của cả hai repo (Java 49 test trên JDK 17, Node 21 test trên Node 22+). Một ticket = một nhánh từ cùng gốc = một PR.'}</li>
<li>${en ? 'Each PR: <strong>under 200 changed lines</strong>, contains a test that is red without the fix (show it), every commit green.' : 'Mỗi PR: <strong>dưới 200 dòng thay đổi</strong>, có test đỏ khi chưa sửa (cho xem), commit nào cũng xanh.'}</li>
<li>${en ? 'Each PR description has the four sections (root cause, impact, how tested, risks/way back) and lists what is out of scope with a new ticket ID.' : 'Mỗi mô tả PR có đủ bốn mục (nguyên nhân gốc, phạm vi ảnh hưởng, cách kiểm, rủi ro/đường lùi) và liệt kê thứ ngoài phạm vi kèm mã ticket mới.'}</li>
<li>${en ? 'Before/after evidence on the running app (curl), not only unit tests. Golden master of Chapter 3 identical; e2e of lesson 3.4 green.' : 'Bằng chứng trước/sau trên ứng dụng đang chạy (curl), không chỉ test đơn vị. Golden master Chương 3 giống hệt; e2e của bài 3.4 xanh.'}</li>
<li>${en ? 'Follow the project’s conventions (8.1): <code>var</code> and single quotes in Node, the existing error-message style in Java; the Checkstyle gate stays at zero.' : 'Theo quy ước dự án (8.1): <code>var</code> và nháy đơn ở Node, đúng kiểu câu báo lỗi đang có ở Java; cổng Checkstyle vẫn bằng không.'}</li>
<li>${en ? 'Pass the review checklist of lesson 8.3 — do it on your own PRs before asking anyone.' : 'Qua checklist review của bài 8.3 — tự chạy trên PR của mình trước khi nhờ ai.'}</li>
</ul>

<h3>${en ? 'Ticket 1 — TV-96: the remember-me cookie' : 'Ticket 1 — TV-96: cookie "Ghi nhớ"'}</h3>
<p>${en
  ? 'Reproduce on the running stack (<code>docker compose up</code> of lesson 0.1, port 18080 on your machine — 41880 here). Two symptoms, both from the ticket:'
  : 'Tái hiện trên stack đang chạy (<code>docker compose up</code> của bài 0.1, cổng 18080 trên máy bạn — ở đây là 41880). Hai triệu chứng, đều từ ticket:'}</p>
${O85_TV96_TRUOC}
<p>${en
  ? 'Hints, in order — open only what you need: (1) the two <code>_BUG</code> tests of lesson 5.2 already describe both symptoms; (2) what does <code>"admin:".split(":")</code> return in Java, and what does <code>split(":", -1)</code> return? (3) the fix is in one method and is shorter than this hint.'
  : 'Gợi ý theo bậc — chỉ mở cái cần: (1) hai test <code>_BUG</code> của bài 5.2 đã mô tả đúng hai triệu chứng; (2) trong Java, <code>"admin:".split(":")</code> trả về gì, còn <code>split(":", -1)</code> thì sao? (3) bản sửa nằm trong một hàm và ngắn hơn chính gợi ý này.'}</p>
<p>${en
  ? '<strong>Hacker’s angle — and the scope trap.</strong> While reading <code>TokenUtil</code> you will notice something far worse than the ticket: the token is <code>MD5(username + "thuvien2016")</code>, with the secret hard-coded in the source. Anyone who has seen the code — a leaked repo, a former employee, or anyone who unzips the WAR — can mint an admin cookie:'
  : '<strong>Góc hacker — và cái bẫy phạm vi.</strong> Đọc <code>TokenUtil</code>, bạn sẽ thấy một thứ tệ hơn ticket nhiều: token là <code>MD5(tên + "thuvien2016")</code>, bí mật viết cứng trong mã nguồn. Ai từng thấy code — repo bị lộ, cựu nhân viên, hay bất kỳ ai giải nén tệp WAR — đều tự đúc được cookie admin:'}</p>
${O85_GIA}
<p>${en
  ? 'This is a known class of real vulnerability: Apache Shiro before 1.2.5 shipped a hard-coded default key for its “rememberMe” cookie (CVE-2016-4437); attackers who knew the key could forge cookies and, through deserialization, run code on servers — it was mass-exploited for years. The professional move is <em>not</em> to redesign authentication inside TV-96 (it needs a server-side token table, invalidating every existing cookie, and a customer decision). It is to fix TV-96 as asked, prove the forgery in a separate, clearly marked ticket (TV-110, priority high), and tell the lead the same day. Fixing a cookie-format bug and silently changing the login scheme in one PR is how outages and angry customers happen.'
  : 'Đây là một loại lỗ hổng có thật: Apache Shiro trước 1.2.5 đóng gói sẵn một khoá mặc định viết cứng cho cookie "rememberMe" (CVE-2016-4437); kẻ tấn công biết khoá có thể giả cookie và, qua lỗi giải tuần tự hoá, chạy mã trên máy chủ — nó bị khai thác hàng loạt trong nhiều năm. Cách làm chuyên nghiệp <em>không</em> phải thiết kế lại cơ chế đăng nhập ngay trong TV-96 (việc đó cần bảng token phía máy chủ, vô hiệu mọi cookie hiện có, và một quyết định của khách). Mà là sửa TV-96 đúng như được giao, chứng minh việc giả cookie trong một ticket riêng ghi rõ ràng (TV-110, ưu tiên cao), và báo trưởng nhóm ngay trong ngày. Sửa lỗi định dạng cookie mà lặng lẽ đổi luôn cơ chế đăng nhập trong cùng một PR là con đường dẫn tới sự cố và khách giận.'}</p>

<h3>${en ? 'Ticket 2 — TV-98: two borrows at 8:00' : 'Ticket 2 — TV-98: hai lượt mượn lúc 8:00'}</h3>
<p>${en
  ? 'You already know the cause from lessons 4.2 and 5.5: read–compute–write of <code>data/phieu.json</code> without any ordering. Commit lesson 5.5’s reproduction test with your fix this time (add a second case with five requests, one rejected), and reproduce it over real HTTP too:'
  : 'Bạn đã biết nguyên nhân từ bài 4.2 và 5.5: đọc–tính–ghi <code>data/phieu.json</code> không có thứ tự nào. Lần này hãy commit test tái hiện của bài 5.5 cùng bản sửa (thêm ca thứ hai với năm yêu cầu, một yêu cầu bị từ chối), và tái hiện cả qua HTTP thật:'}</p>
${O85_NODE_DO}
<p>${en
  ? 'Hints: (1) production runs one Node process (Q&A #16), so ordering requests inside the process is enough — say so in the PR; (2) every branch of the handler ends the response, so “the response finished” (<code>res.on(\'finish\')</code>, and <code>\'close\'</code> for disconnects) is a reliable “done” signal; (3) after it works, read lesson 8.3’s review section and test the unhappy path before your reviewer does. Write ADR 0002 (lesson 8.4) for “queue now, MySQL later”.'
  : 'Gợi ý: (1) production chạy một tiến trình Node (Q&A #16), nên xếp thứ tự các yêu cầu ngay trong tiến trình là đủ — ghi rõ điều này trong PR; (2) nhánh nào của hàm xử lý cũng kết thúc phản hồi, nên "phản hồi đã xong" (<code>res.on(\'finish\')</code>, và <code>\'close\'</code> khi khách ngắt) là tín hiệu "xong" tin được; (3) chạy được rồi thì đọc phần review của bài 8.3 và tự thử nhánh không suôn sẻ trước khi người review thử. Viết ADR 0002 (bài 8.4) cho "hàng đợi bây giờ, MySQL sau".'}</p>

<h3>${en ? 'Ticket 3 — TV-109: the error page' : 'Ticket 3 — TV-109: trang lỗi'}</h3>
${O85_JSP_TRUOC}
<p>${en
  ? 'Thirty-one lines of stack trace plus source lines of the JSP, to anyone who opens the URL — CWE-209, and a gift to the attacker of lesson 6.3 (class names, library versions, file paths). Hints: (1) lesson 6.3 already fixed the same problem inside <code>BookServlet</code> — reuse its message and its “error code + log” pattern, that is the project’s convention now; (2) the test that pins today’s behaviour is in the <code>e2e</code> module (<code>moThangJsp_khongCanDangNhap</code>, lesson 3.4) — flip its expectation first and watch it fail; (3) keep status 500: monitoring counts it.'
  : 'Ba mươi mốt dòng stack trace cộng các dòng mã nguồn JSP, cho bất kỳ ai mở URL — CWE-209, và là món quà cho kẻ tấn công của bài 6.3 (tên lớp, phiên bản thư viện, đường dẫn tệp). Gợi ý: (1) bài 6.3 đã sửa đúng vấn đề này bên trong <code>BookServlet</code> — dùng lại câu báo và mẫu "mã lỗi + log" của nó, giờ đó là quy ước của dự án; (2) test đang khoá hành vi hôm nay nằm trong module <code>e2e</code> (<code>moThangJsp_khongCanDangNhap</code>, bài 3.4) — đảo kỳ vọng của nó trước rồi nhìn nó đỏ; (3) giữ mã 500: hệ thống giám sát đếm nó.'}</p>
<p>${en
  ? 'Scope trap number two: the URL in the ticket is <code>books.jsp</code> opened <em>without logging in</em>. That JSPs are reachable directly (lesson 2.1’s risk map) is a separate, bigger problem — moving them under <code>WEB-INF/</code> touches every servlet’s forward. New ticket TV-111; not in this PR.'
  : 'Cái bẫy phạm vi thứ hai: URL trong ticket là <code>books.jsp</code> mở <em>khi chưa đăng nhập</em>. Việc JSP mở thẳng được (bản đồ rủi ro bài 2.1) là một vấn đề riêng và lớn hơn — dời chúng vào <code>WEB-INF/</code> sẽ chạm tới lệnh forward của mọi servlet. Ticket mới TV-111; không nằm trong PR này.'}</p>

${giai(en ? '🔑 Model solution, evidence and PR descriptions (open after you try)' : '🔑 Lời giải mẫu, bằng chứng và mô tả PR (mở sau khi đã thử)', `
<p>${en ? 'Patches: <code>lab/loi-giai/ch8/java/</code> (one folder per branch, apply with <code>git am</code> on <code>ch7</code>) and <code>lab/loi-giai/ch8/node/tv-98/</code>. Red runs before the fixes:' : 'Patch: <code>lab/loi-giai/ch8/java/</code> (mỗi nhánh một thư mục, áp bằng <code>git am</code> lên <code>ch7</code>) và <code>lab/loi-giai/ch8/node/tv-98/</code>. Các lượt đỏ trước khi sửa:'}</p>
${O85_TV96_DO}
${O85_TV109_DO}
<p>${en ? 'The fixes:' : 'Các bản sửa:'}</p>
${O85_DIFF96}
${O85_DIFF109}
<p>${en ? 'TV-98: <code>lib/tuan-tu.js</code> after review is in lesson 8.3; the route change is two lines (<code>require</code> and wrapping the handler in <code>tuanTu(…)</code>). Sizes:' : 'TV-98: <code>lib/tuan-tu.js</code> sau review có ở bài 8.3; thay đổi ở route chỉ hai dòng (<code>require</code> và bọc hàm xử lý trong <code>tuanTu(…)</code>). Kích thước:'}</p>
${O85_KICHTHUOC}
<p>${en ? 'After the fixes, on the running apps:' : 'Sau khi sửa, trên ứng dụng đang chạy:'}</p>
${O85_SAU}
<p>${en ? 'PR description for TV-96 (the other two follow the same shape; TV-98’s risk section points to ADR 0002 and TV-114, TV-109’s to TV-111):' : 'Mô tả PR cho TV-96 (hai PR còn lại cùng khuôn; mục rủi ro của TV-98 trỏ tới ADR 0002 và TV-114, của TV-109 trỏ tới TV-111):'}</p>
${O85_PR96}
<p><strong>${en ? 'Grading (10 points)' : 'Thang chấm (10 điểm)'}</strong></p>
<table>
<tr><th>${en ? 'Criterion' : 'Tiêu chí'}</th><th>${en ? 'Points' : 'Điểm'}</th></tr>
<tr><td>${en ? 'Three branches from the same base, each &lt; 200 lines, no unrelated change, conventions followed' : 'Ba nhánh từ cùng gốc, mỗi nhánh &lt; 200 dòng, không có thay đổi lạc đề, theo đúng quy ước'}</td><td>2</td></tr>
<tr><td>${en ? 'Each fix has a test shown red before and green after (including the e2e one for TV-109)' : 'Bản sửa nào cũng có test được cho thấy đỏ trước, xanh sau (kể cả test e2e của TV-109)'}</td><td>2</td></tr>
<tr><td>${en ? 'TV-98 correct under concurrency, and the unhappy path (handler throws) does not hang the queue' : 'TV-98 đúng khi chạy đồng thời, và nhánh không suôn sẻ (hàm xử lý ném lỗi) không làm treo hàng đợi'}</td><td>2</td></tr>
<tr><td>${en ? 'Four-section descriptions with real numbers and curl evidence before/after' : 'Mô tả bốn mục có số thật và bằng chứng curl trước/sau'}</td><td>2</td></tr>
<tr><td>${en ? 'Out-of-scope findings (forged cookie TV-110, JSP access TV-111, multi-process TV-114) recorded as tickets, not fixed silently' : 'Phát hiện ngoài phạm vi (giả cookie TV-110, mở thẳng JSP TV-111, nhiều tiến trình TV-114) được ghi thành ticket, không lặng lẽ sửa'}</td><td>2</td></tr>
</table>
`)}

<h3>💼 ${en ? 'OJT situation: three tickets, one day — in which order?' : 'Tình huống OJT: ba ticket, một ngày — làm theo thứ tự nào?'}</h3>
<p>${en
  ? 'Order by harm, then by size: TV-98 loses customers’ data every morning (first, even though it is the biggest), TV-96 is a crash plus a security weakness (second), TV-109 leaks information but nothing is lost (third). Tell the lead the order and the reason in standup — and mention TV-110 immediately, because a forgeable admin cookie outranks all three. Because each ticket has its own branch from the same base, they merge in any order without conflicts; on this repo the three Java PRs merged cleanly one after another.'
  : 'Xếp theo mức hại, rồi theo độ lớn: TV-98 làm mất dữ liệu của khách mỗi sáng (đầu tiên, dù lớn nhất), TV-96 là một lỗi sập kèm điểm yếu bảo mật (thứ hai), TV-109 lộ thông tin nhưng không mất gì (thứ ba). Báo thứ tự và lý do cho trưởng nhóm ở buổi standup — và nhắc TV-110 ngay, vì một cookie admin giả được còn nghiêm trọng hơn cả ba. Vì mỗi ticket có nhánh riêng từ cùng gốc, chúng merge theo thứ tự nào cũng không xung đột; trên repo này ba PR Java merge lần lượt không vướng gì.'}</p>

<h3>📌 ${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'One ticket, one branch, one red test, one small fix, one four-section PR — 13 to 66 lines each here.' : 'Một ticket, một nhánh, một test đỏ, một bản sửa nhỏ, một PR bốn mục — ở đây mỗi PR 13 tới 66 dòng.'}</li>
<li>${en ? 'Evidence on the running app, before and after, is part of the fix.' : 'Bằng chứng trên ứng dụng đang chạy, trước và sau, là một phần của bản sửa.'}</li>
<li>${en ? 'The worst finding is often outside the ticket (forged admin cookie): prove it, ticket it, report it the same day — do not hide it inside a small PR.' : 'Phát hiện tệ nhất thường nằm ngoài ticket (giả cookie admin): chứng minh, ghi ticket, báo ngay trong ngày — đừng giấu nó vào một PR nhỏ.'}</li>
</ul>
${tl('https://cwe.mitre.org/data/definitions/209.html', '🛡️', 'CWE-209 — Generation of Error Message Containing Sensitive Information', en ? 'What TV-109 is' : 'TV-109 là gì')}
${tl('https://nvd.nist.gov/vuln/detail/CVE-2016-4437', '🛡️', 'NVD — CVE-2016-4437 (Apache Shiro rememberMe default key)', en ? 'Hard-coded cookie key, mass-exploited' : 'Khoá cookie viết cứng, bị khai thác hàng loạt')}
${lk(bai('thuc-tap-cung-claude', 'thuc-tap-cung-claude-4-2-ticket-7'), '🧑‍💻', en ? 'Internship with Claude 4.2 — Ticket 7: injection and authorization bugs' : 'Thực tập cùng Claude 4.2 — Ticket 7: vá injection và lỗi phân quyền', en ? 'Another security ticket, end to end' : 'Thêm một ticket bảo mật, từ đầu tới cuối')}
`);

/* ═══════════════════ 8.6 — Quiz ═══════════════════ */
const dat = (q, viTri) => { const o = [...q.options]; const [d] = o.splice(q.correctIndex, 1); o.splice(viTri, 0, d); return { ...q, options: o, correctIndex: viTri }; };

const QUIZ8_GOC = [
  Q('You run the project’s Checkstyle with google_checks.xml and get 879 violations on 20 files. What does that number mean?|||Chạy Checkstyle với google_checks.xml ra 879 vi phạm trên 20 tệp. Con số đó nghĩa là gì?', [
    'Mostly the distance between Google’s style and this team’s style — not 879 bugs|||Chủ yếu là khoảng cách giữa style của Google và style của đội này — không phải 879 lỗi',
    'The code has 879 bugs to fix before any ticket|||Code có 879 lỗi phải sửa trước mọi ticket',
    'Checkstyle is misconfigured|||Checkstyle bị cấu hình sai',
    'The project must adopt Google style in the next PR|||Dự án phải chuyển sang style Google ở PR kế tiếp',
  ], 0, 'EN: A rule set built from measurements reported 0; use it as a gate for new code.|||VI: Bộ luật dựng từ số đo báo 0; dùng nó làm cổng chặn cho code mới.'),
  Q('After a repository-wide format commit, git blame shows every line written “today”. The cleanest way to get the real authors back?|||Sau một commit format toàn repo, git blame hiện mọi dòng là viết "hôm nay". Cách gọn nhất để lấy lại tác giả thật?', [
    'Put the commit hash in .git-blame-ignore-revs (and set blame.ignoreRevsFile / use --ignore-rev)|||Đưa mã commit vào .git-blame-ignore-revs (và đặt blame.ignoreRevsFile / dùng --ignore-rev)',
    'Revert the format commit|||Revert commit format',
    'Use git blame -w only|||Chỉ dùng git blame -w',
    'Rewrite history with filter-branch|||Viết lại lịch sử bằng filter-branch',
  ], 0, 'EN: -w is not enough: formatters re-wrap lines, reorder imports and split strings.|||VI: -w không đủ: formatter còn ngắt dòng, sắp import, cắt chuỗi.'),
  Q('Which cleanup is acceptable inside a bug-fix PR (as its own commit)?|||Dọn dẹp nào chấp nhận được trong một PR sửa lỗi (ở commit riêng)?', [
    'Upgrading a library “while you are there”|||Nâng phiên bản một thư viện "tiện tay"',
    'Running the formatter on the files you touched|||Chạy formatter cho các tệp đã chạm',
    'Renaming a confusing local variable in the function you are fixing|||Đổi tên một biến cục bộ khó hiểu trong hàm đang sửa',
    'Renaming a public method used in 12 files|||Đổi tên một hàm public dùng ở 12 tệp',
  ], 2, 'EN: Small, local, reviewable in a minute — the Boy Scout rule with limits.|||VI: Nhỏ, cục bộ, duyệt được trong một phút — luật Hướng đạo sinh có giới hạn.'),
  Q('TV-108: returning the same loan twice adds a ghost copy. Why is filtering return_date IS NULL in the earlier SELECT not enough?|||TV-108: trả cùng phiếu hai lần cộng sách ma. Vì sao lọc return_date IS NULL ở câu SELECT trước đó là chưa đủ?', [
    'SELECT cannot use IS NULL|||SELECT không dùng được IS NULL',
    'It is check-then-act: two simultaneous clicks both pass the SELECT before either UPDATE|||Đó là kiểm-rồi-làm: hai cú bấm đồng thời đều qua SELECT trước khi UPDATE nào chạy',
    'It makes the test red|||Nó làm test đỏ',
    'MySQL caches SELECT results|||MySQL lưu đệm kết quả SELECT',
  ], 1, 'EN: Put the condition in the UPDATE and check the row count; the row lock serialises the clicks.|||VI: Đặt điều kiện vào UPDATE và xem số dòng; khoá dòng xếp hàng các cú bấm.'),
  Q('After changing ghiTra from void to int, a Mockito unit test fails with “Phiếu này đã trả rồi”. Why?|||Sau khi đổi ghiTra từ void sang int, một test Mockito đỏ với "Phiếu này đã trả rồi". Vì sao?', [
    'Mockito cannot mock int methods|||Mockito không mock được hàm trả int',
    'The fix is wrong|||Bản sửa sai',
    'The database was not reset|||CSDL chưa được nạp lại',
    'An unstubbed mocked method returns 0, which now means “already returned”; update the stub to the new contract|||Hàm bị mock chưa khai báo trả 0, giờ nghĩa là "đã trả rồi"; cập nhật stub theo hợp đồng mới',
  ], 3, 'EN: The unit test noticed a contract change — that is the net working.|||VI: Test đơn vị nhận ra hợp đồng đã đổi — đó là tấm lưới đang làm việc.'),
  Q('A PR mixes a 19-line fix with 800 lines of formatter output. Best way to split it?|||Một PR trộn bản sửa 19 dòng với 800 dòng output formatter. Cách tách tốt nhất?', [
    'Redo the small fix on a clean branch, regenerate formatting on top with the pinned formatter, prove the stack equals the original with an empty git diff|||Làm lại bản sửa nhỏ trên nhánh sạch, sinh lại phần định dạng ở trên bằng formatter đã ghim, chứng minh chồng PR bằng bản gốc bằng git diff rỗng',
    'Squash everything and ask for approval|||Gộp hết rồi xin duyệt',
    'Untangle all 800 lines by hand with git add -p|||Gỡ cả 800 dòng bằng tay với git add -p',
    'Close the PR and drop the fix|||Đóng PR và bỏ bản sửa',
  ], 0, 'EN: Formatters are deterministic; machine output can be regenerated and verified.|||VI: Formatter là tất định; output của máy sinh lại và kiểm lại được.'),
  Q('google-java-format --dry-run still lists 8 files right after a --replace run. What does it tell you?|||Ngay sau lần --replace, google-java-format --dry-run vẫn liệt kê 8 tệp. Điều đó cho biết gì?', [
    'The formatter is broken|||Formatter bị hỏng',
    'Someone edited the files meanwhile|||Có người sửa tệp trong lúc đó',
    'This code needed two passes to be stable; produce formatting PRs exactly as CI checks them, until --dry-run is empty|||Code này cần hai lượt mới ổn định; sinh PR định dạng đúng như CI kiểm, tới khi --dry-run rỗng',
    'You must use --aosp|||Bắt buộc dùng --aosp',
  ], 2, 'EN: First pass split long strings, second re-indented the new lines.|||VI: Lượt đầu cắt chuỗi dài, lượt hai thụt lại các dòng mới.'),
  Q('Which is a root cause, as section 1 of a maintenance PR expects?|||Câu nào là nguyên nhân gốc đúng như mục 1 của PR bảo trì yêu cầu?', [
    '“Fixed TV-96.”|||"Đã sửa TV-96."',
    '“Cookie handling improved.”|||"Cải thiện xử lý cookie."',
    '“Users reported errors on the login page.”|||"Người dùng báo lỗi ở trang đăng nhập."',
    '“split(\":\") drops the trailing empty string, so \"admin:\" gives one element and phan[1] throws”|||"split(\":\") bỏ chuỗi rỗng cuối, nên \"admin:\" ra một phần tử và phan[1] ném lỗi"',
  ], 3, 'EN: A line and a condition, not a symptom or a summary.|||VI: Một dòng và một điều kiện, không phải triệu chứng hay tóm tắt.'),
  Q('The impact query finds book 7 with one copy fewer than expected. TV-108 can only add copies. What do you do in the TV-108 PR?|||Truy vấn ảnh hưởng thấy sách 7 thiếu một bản so với mong đợi. TV-108 chỉ có thể làm thừa bản. Trong PR TV-108 bạn làm gì?', [
    'Fix book 7’s number in a migration in the same PR|||Sửa số của sách 7 bằng migration trong cùng PR',
    'State that TV-108 did not damage this data, ask the librarian (Q&A), and do not touch book 7 here|||Ghi rõ TV-108 chưa làm hỏng dữ liệu này, hỏi thủ thư (Q&A), và không đụng sách 7 ở đây',
    'Ignore it|||Bỏ qua',
    'Revert TV-108|||Revert TV-108',
  ], 1, 'EN: It was a lost book; “fixing” it would have created a ghost copy.|||VI: Đó là sách mất; "sửa" nó sẽ tạo ra một bản sách ma.'),
  Q('A reviewer asks: “what happens to your request queue if the handler throws synchronously?” Best reply?|||Người review hỏi: "nếu hàm xử lý ném lỗi đồng bộ thì hàng đợi của em ra sao?" Trả lời tốt nhất?', [
    '“It doesn’t throw.”|||"Nó không ném đâu ạ."',
    '“Out of scope.”|||"Ngoài phạm vi ạ."',
    'Write a test, find that both requests hang, fix with try/next(e) as a fixup commit, reply with the link|||Viết test, thấy cả hai yêu cầu treo, sửa bằng try/next(e) dưới dạng commit fixup, trả lời kèm liên kết',
    'Rewrite the API with async/await in the same PR|||Viết lại API bằng async/await trong cùng PR',
  ], 2, 'EN: A sync throw rejected the chained promise; every later request was skipped.|||VI: Ném lỗi đồng bộ làm Promise trong chuỗi bị từ chối; mọi yêu cầu sau bị bỏ qua.'),
  Q('Fourteen of sixteen files have bus factor 1 and their authors left in 2018–2019. Most useful first action?|||Mười bốn trên mười sáu tệp có hệ số xe buýt 1 và tác giả đã nghỉ từ 2018–2019. Việc đầu tiên có ích nhất?', [
    'Rewrite those files so you understand them|||Viết lại các tệp đó cho dễ hiểu',
    'Do homework in Git, then ask BA/PO, tester, users and operations concrete questions with a proposed default, and write answers down (Q&A list, comments, ADR)|||Làm bài tập về nhà bằng Git, rồi hỏi BA/PO, tester, người dùng, vận hành bằng câu cụ thể kèm phương án mặc định, và ghi câu trả lời lại (Q&A list, comment, ADR)',
    'Find the former employees on social media|||Tìm cựu nhân viên trên mạng xã hội',
    'Wait until a bug appears|||Chờ tới khi có lỗi',
  ], 1, 'EN: The people around the code know what it should do; Git knows what it does.|||VI: Người xung quanh code biết nó phải làm gì; Git biết nó đang làm gì.'),
  Q('What is the right status for ADR 0001 (“Java is the source of truth for fees”) while the customer has not answered yet?|||Trạng thái đúng cho ADR 0001 ("Java là nguồn đúng của phí") khi khách chưa trả lời?', [
    'Don’t write it until the answer arrives|||Chưa viết cho tới khi có câu trả lời',
    'Accepted, and edit it later if needed|||Chấp nhận, sau này sửa lại nếu cần',
    'Proposed — record the current best decision and what would change it; later accept it or supersede it with a new ADR|||Đề xuất — ghi quyết định tốt nhất hiện tại và điều gì sẽ đổi nó; sau đó chấp nhận hoặc thay bằng ADR mới',
    'Deprecated|||Lỗi thời',
  ], 2, 'EN: Never rewrite an accepted ADR; supersede it.|||VI: Không viết lại ADR đã chấp nhận; hãy thay thế bằng ADR mới.'),
];
const VI_TRI8 = [1, 0, 2, 3, 0, 2, 1, 3, 2, 0, 3, 1];
const QUIZ8 = QUIZ8_GOC.map((q, i) => dat(q, VI_TRI8[i]));

const QUIZ_CONTENT = ml((en) => `
<span class="eyebrow">${en ? 'Chapter 8 · Quiz' : 'Chương 8 · Kiểm tra'}</span>
<h2>${en ? '8.6 — Chapter 8 quiz' : '8.6 — Kiểm tra Chương 8'}</h2>
<p>${en
  ? 'Twelve questions on conventions, the minimal fix, splitting PRs, PR descriptions and review, and working when the author is gone. 15 minutes. Every question comes from an output that actually appeared in this chapter’s labs.'
  : 'Mười hai câu về quy ước, bản sửa tối thiểu, tách PR, mô tả PR và review, và làm việc khi người viết đã nghỉ. 15 phút. Câu nào cũng lấy từ một output đã thật sự xuất hiện trong các lab của chương.'}</p>
`);

export default {
  title: 'Chapter 8 — Fixing bugs in someone else\'s code|||Chương 8 — Sửa lỗi trong code của người khác',
  lessons: [
    { title: '8.1 — Respecting the project\'s conventions, even when you disagree|||8.1 — Tôn trọng quy ước của dự án, kể cả khi bạn không đồng ý', slug: 'lgc-8-1-quy-uoc', type: 'LESSON', isFreePreview: true, description: 'Đo quy ước ngầm bằng lệnh (và chỗ chính khoá này đã lệch); .editorconfig và bộ luật Checkstyle viết từ số đo — đoán sai hai lần, cuối cùng 0 vi phạm so với 439/879 của sun/google, làm cổng chặn code mới; Prettier và google-java-format "format cả tệp" tốn bao nhiêu dòng, cướp git blame, gây xung đột nhánh đang mở; .git-blame-ignore-revs; luật Hướng đạo sinh có giới hạn; Trojan Source CVE-2021-42574 chạy thật.', content: L81 },
    { title: '8.2 — The minimal fix: test first, smallest change, separate cleanup PR|||8.2 — Bản sửa tối thiểu: test trước, thay đổi nhỏ nhất, PR dọn dẹp tách riêng', slug: 'lgc-8-2-sua-toi-thieu', type: 'LESSON', isFreePreview: true, description: 'Ticket TV-108 (trả hai lần cộng sách ma): viết lại, tái hiện, ước lượng ba điểm; test đỏ, bản sửa 19 dòng đặt điều kiện vào UPDATE (hai phiên MySQL chứng minh khoá dòng), test mock bắt hợp đồng đổi; tách PR 835 dòng thành bản sửa + định dạng máy sinh, chứng minh bằng diff rỗng; formatter cần hai lượt; Cloudflare 2019.', content: L82 },
    { title: '8.3 — PR description and review for maintenance work|||8.3 — Mô tả PR và review cho việc bảo trì', slug: 'lgc-8-3-pr-review', type: 'LESSON', isFreePreview: true, description: 'Mẫu PR bốn mục (nguyên nhân gốc, phạm vi ảnh hưởng, cách kiểm, rủi ro) trong repo; phân tích ảnh hưởng thật cả code lẫn dữ liệu (sách 7 lệch chiều ngược — không phải lỗi này); script sinh khung mô tả; review TV-98: người review đúng, hàng đợi treo thật, sửa bằng fixup + autosquash + range-diff; trả lời review không tự ái; xz-utils 2024.', content: L83 },
    { title: '8.4 — When the author is gone: asking, documenting decisions, ADRs|||8.4 — Khi người viết đã nghỉ: hỏi ai, ghi lại quyết định, ADR', slug: 'lgc-8-4-nguoi-viet-cu', type: 'LESSON', isFreePreview: true, description: 'Bản đồ tri thức và hệ số xe buýt từ git blame; git log -S lần ra ba cách tính phí trễ hạn; hỏi BA/PO, tester, thủ thư, vận hành bằng Q&A list; comment điều bất ngờ đúng chỗ; ADR 0001/0002 commit vào repo; New Jersey COBOL 2020, GitLab 2017.', content: L84 },
    { title: '8.5 — Lab: Three tickets in the legacy app, three small PRs|||8.5 — Lab: Ba ticket trong ứng dụng cũ, ba PR nhỏ', slug: 'lgc-8-5-lab', type: 'LESSON', isFreePreview: true, description: 'TV-96 cookie "Ghi nhớ" (500 + stack trace, đuôi thừa vẫn đăng nhập; giả cookie admin từ bí mật trong mã — Apache Shiro CVE-2016-4437, ticket riêng), TV-98 race mất phiếu ở API Node, TV-109 trang lỗi lộ stack trace (CWE-209): đỏ trước, xanh sau, bằng chứng curl, e2e và golden master; mỗi PR 13–66 dòng; thang chấm 10 điểm.', content: L85 },
    { title: '8.6 — Chapter 8 quiz|||8.6 — Kiểm tra Chương 8', slug: 'lgc-8-6-quiz', type: 'QUIZ', isFreePreview: true, description: 'Mười hai câu: bộ luật sách và luật dự án, ignore-revs, Hướng đạo sinh có giới hạn, kiểm-rồi-làm, hợp đồng mock, tách PR, formatter hai lượt, nguyên nhân gốc, dữ liệu lệch không liên quan, trả lời review, hệ số xe buýt, trạng thái ADR.', content: QUIZ_CONTENT, quiz: { timeLimitSeconds: 900, questions: QUIZ8 } },
  ],
};
