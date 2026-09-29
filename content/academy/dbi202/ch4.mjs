/**
 * DBI202 · Chương 4 — phụ thuộc hàm & chuẩn hoá (slide Chapter 3 của trường).
 * Bài 📑 học theo từng slide: dbi4 (Chapter 3.pptx, slide 1–73).
 * Bài 🧪 thực hành + 🗂 thuật ngữ + 📌 tóm tắt: dbi202-on-ch4.
 * Quiz viết lại (10 câu, giữ slug dbi202-quiz-2).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/DBI202/gen/gen.mjs từ gen/src/** và gen/sql/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node DBI202/gen/gen.mjs`.
 */

import { walk, walkHead, books, bi } from './_slides.mjs';

/* ───────── 4.A — 📑 Slide by slide · Functional dependencies, closures & minimal bases (Chapter 3, slides 1–19) ───────── */
const L_dbi4_1 = {
  title: '4.A — 📑 Slide by slide · Functional dependencies, closures & minimal bases (Chapter 3, slides 1–19)|||4.A — 📑 Học theo từng slide · Phụ thuộc hàm, bao đóng & phủ tối thiểu (Chapter 3, slide 1–19)',
  slug: 'dbi202-slide-dbi4-1',
  type: 'VIDEO',
  description: 'Giảng từng slide 1–19 của bộ slide Chapter 3 của trường (Design Theory for Relational Databases): phụ thuộc hàm, khoá và siêu khoá, luật Armstrong, tập FD suy ra/tương đương, thuật toán bao đóng 3.7 làm từng vòng bằng bảng, phủ tối thiểu, chiếu FD (thuật toán 3.12) — mọi bao đóng được tính lại bằng script, kèm câu SQL kiểm một FD trên dữ liệu thật.',
  content: [
    bi(`<span class="eyebrow">Chapter 4 · Lesson 4.A · school slides "Chapter 3", slides 1–19</span>
<h2>Functional dependencies — the deck, slide by slide</h2>
<p class="lead">⚠️ <strong>This is the school's "Chapter 3" deck</strong> (Design Theory for Relational Databases). On this website it is Chapter 4, because the web course teaches E/R modelling first — so when your lecturer says "Chapter 3", open these lessons. Slides 1–19 give you the tools that every normalization question needs: functional dependencies (FDs), Armstrong's rules, the closure X⁺, keys and superkeys, minimal bases and projected FDs.</p>
<div class="callout"><strong>After this lesson you can:</strong> say whether an FD holds on a table (and check it with one SQL query), compute X⁺ round by round, find every key of a small relation, reduce a set of FDs to a minimal basis, and find the FDs that survive a projection. These are exactly the steps asked in PT/FE multiple-choice questions ("F is given, what is the key?").</div>
<h3>Starting from zero — the words this chapter uses</h3>
<p>Take a table you already know, a class grade sheet:</p>
<table>
<thead><tr><th>StudentID</th><th>StudentName</th><th>Subject</th><th>Grade</th></tr></thead>
<tbody>
<tr><td>SE001</td><td>Lan</td><td>DBI202</td><td>8</td></tr>
<tr><td>SE001</td><td>Lan</td><td>CSD201</td><td>7</td></tr>
<tr><td>SE002</td><td>Minh</td><td>DBI202</td><td>9</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Word</th><th>Meaning</th><th>In the grade sheet</th></tr></thead>
<tbody>
<tr><td>relation</td><td>a table</td><td>the whole grade sheet</td></tr>
<tr><td>attribute</td><td>a column (it has a name and a type)</td><td>StudentID, StudentName, Subject, Grade</td></tr>
<tr><td>tuple</td><td>one row</td><td>(SE001, Lan, DBI202, 8)</td></tr>
<tr><td>schema</td><td>the name of the table plus its column names</td><td>Grades(StudentID, StudentName, Subject, Grade)</td></tr>
<tr><td>instance</td><td>the rows stored at one moment</td><td>the three rows above</td></tr>
<tr><td>key</td><td>columns whose values never repeat and that identify a row</td><td>(StudentID, Subject): one grade per student per subject</td></tr>
<tr><td>functional dependency X → Y</td><td>"if you know X, there is only one possible Y"</td><td>StudentID → StudentName</td></tr>
</tbody>
</table>
<p>Normalization, the goal of the whole chapter, asks: is StudentName in the right table? Here "Lan" is typed once per subject Lan takes — the rules below explain why that is a problem and how to fix it.</p>
<h3>The whole part in one table</h3>
<table>
<thead><tr><th>Slides</th><th>Idea</th><th>You must be able to</th></tr></thead>
<tbody>
<tr><td>4–6</td><td>FD X → Y; key, superkey</td><td>read an FD off a table; tell key from superkey</td></tr>
<tr><td>7–8</td><td>Armstrong's axioms, derived rules; "follows from", "equivalent"</td><td>derive a new FD in 2–3 steps</td></tr>
<tr><td>9–11</td><td>closure X⁺ (Algorithm 3.7)</td><td>compute X⁺ until nothing changes; test X → Y with Y ⊆ X⁺</td></tr>
<tr><td>12–13</td><td>basis, minimal basis</td><td>split, drop extra left-side attributes, drop redundant FDs</td></tr>
<tr><td>14–19</td><td>projecting FDs (Algorithm 3.12)</td><td>find the FDs that hold on πL(R)</td></tr>
</tbody>
</table>
<p>Read it before lessons 4.1–4.4 below; lesson 4.2 (closures and finding keys) goes deeper into the same algorithm.</p>`,
    `<span class="eyebrow">Chương 4 · Bài 4.A · slide "Chapter 3" của trường, slide 1–19</span>
<h2>Phụ thuộc hàm — học bộ slide từng trang</h2>
<p class="lead">⚠️ <strong>Đây là bộ slide "Chapter 3" của trường</strong> (Design Theory for Relational Databases — lý thuyết thiết kế CSDL quan hệ). Trên web này nó là Chương 4, vì khoá web dạy mô hình E/R trước — nên khi thầy/cô nói "Chapter 3", hãy mở các bài này. Slide 1–19 cho bạn bộ đồ nghề mà câu chuẩn hoá nào cũng cần: phụ thuộc hàm (functional dependency — FD), luật Armstrong, bao đóng X⁺ (closure), khoá (key) và siêu khoá (superkey), phủ tối thiểu (minimal basis) và FD của phép chiếu (projected FDs).</p>
<div class="callout"><strong>Học xong bài này bạn làm được:</strong> nói một FD có đúng trên một bảng hay không (và kiểm bằng một câu SQL), tính X⁺ từng vòng, tìm mọi khoá của một quan hệ nhỏ, rút một tập FD về phủ tối thiểu, và tìm các FD còn lại sau một phép chiếu. Đó đúng là các bước mà câu trắc nghiệm PT/FE hay hỏi ("cho F, khoá là gì?").</div>
<h3>Bắt đầu từ con số 0 — các từ chương này dùng</h3>
<p>Lấy một bảng bạn đã quen: bảng điểm của lớp.</p>
<table>
<thead><tr><th>StudentID</th><th>StudentName</th><th>Subject</th><th>Grade</th></tr></thead>
<tbody>
<tr><td>SE001</td><td>Lan</td><td>DBI202</td><td>8</td></tr>
<tr><td>SE001</td><td>Lan</td><td>CSD201</td><td>7</td></tr>
<tr><td>SE002</td><td>Minh</td><td>DBI202</td><td>9</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Từ</th><th>Nghĩa</th><th>Trong bảng điểm</th></tr></thead>
<tbody>
<tr><td>quan hệ (relation)</td><td>một bảng</td><td>cả bảng điểm</td></tr>
<tr><td>thuộc tính (attribute)</td><td>một cột (có tên và kiểu dữ liệu)</td><td>StudentID, StudentName, Subject, Grade</td></tr>
<tr><td>bộ (tuple)</td><td>một dòng</td><td>(SE001, Lan, DBI202, 8)</td></tr>
<tr><td>lược đồ (schema)</td><td>tên bảng cùng tên các cột</td><td>Grades(StudentID, StudentName, Subject, Grade)</td></tr>
<tr><td>thể hiện (instance)</td><td>các dòng đang lưu tại một thời điểm</td><td>ba dòng ở trên</td></tr>
<tr><td>khoá (key)</td><td>các cột có giá trị không bao giờ lặp và xác định được một dòng</td><td>(StudentID, Subject): mỗi sinh viên mỗi môn một điểm</td></tr>
<tr><td>phụ thuộc hàm (functional dependency) X → Y</td><td>"biết X thì Y chỉ có đúng một giá trị"</td><td>StudentID → StudentName</td></tr>
</tbody>
</table>
<p>Chuẩn hoá (normalization), mục tiêu của cả chương, hỏi: StudentName có nằm đúng bảng không? Ở đây chữ "Lan" bị gõ lại một lần cho mỗi môn Lan học — các luật bên dưới giải thích vì sao đó là vấn đề và sửa thế nào.</p>
<h3>Cả phần trong một bảng</h3>
<table>
<thead><tr><th>Slide</th><th>Ý</th><th>Bạn phải làm được</th></tr></thead>
<tbody>
<tr><td>4–6</td><td>FD X → Y; khoá, siêu khoá</td><td>đọc FD từ một bảng; phân biệt khoá với siêu khoá</td></tr>
<tr><td>7–8</td><td>tiên đề Armstrong, luật suy ra; "suy ra từ", "tương đương"</td><td>suy ra một FD mới trong 2–3 bước</td></tr>
<tr><td>9–11</td><td>bao đóng X⁺ (thuật toán 3.7)</td><td>tính X⁺ tới khi không thêm được gì; kiểm X → Y bằng Y ⊆ X⁺</td></tr>
<tr><td>12–13</td><td>cơ sở (basis), phủ tối thiểu</td><td>tách vế phải, bỏ thuộc tính thừa vế trái, bỏ FD thừa</td></tr>
<tr><td>14–19</td><td>chiếu FD (thuật toán 3.12)</td><td>tìm các FD đúng trên πL(R)</td></tr>
</tbody>
</table>
<p>Đọc bài này trước các bài 4.1–4.4 bên dưới; bài 4.2 (bao đóng và tìm khoá) đi sâu hơn vào đúng thuật toán này.</p>`),
    walkHead('dbi4', 1, 19),
    walk('dbi4', [
      [1, 'Chapter 3 Design Theory for Relational Databases',
        `<p class="y-chinh">🎯 The title slide of the school's Chapter 3: how to decide, with rules instead of intuition, whether a table design is good.</p>
<p>A "design theory" answers one question: which columns should live together in one table? The tool is the functional dependency; the goal is a schema with no redundancy and no anomalies.</p>`,
        `<p class="y-chinh">🎯 Slide tiêu đề của Chapter 3 của trường: quyết định một thiết kế bảng tốt hay xấu bằng luật chứ không bằng cảm tính.</p>
<p>"Lý thuyết thiết kế" (design theory) trả lời một câu hỏi: những cột nào nên ở chung một bảng? Công cụ là phụ thuộc hàm (functional dependency); mục tiêu là một lược đồ (schema) không dư thừa và không bất thường (anomaly).</p>`],
      [2, 'Objectives',
        `<p class="y-chinh">🎯 Four concepts: functional dependencies, normalization, decomposition and multivalued dependencies.</p>
<ul>
<li><strong>Functional dependencies</strong> — slides 4–19 (this lesson).</li>
<li><strong>Normalization</strong> — 1NF, 2NF, 3NF, BCNF on slides 28–69 (lessons 4.B–4.D).</li>
<li><strong>Decomposition</strong> — splitting a table, lossless join, dependency loss: slides 22–27 and 70–72.</li>
<li><strong>Multivalued dependencies</strong> (MVD, X ↠ Y) are listed here, but <em>no slide of this deck covers them</em>; slide 28 only names 4NF, the normal form built on MVDs. Read them in Ullman §3.6 if your class covers them.</li>
</ul>`,
        `<p class="y-chinh">🎯 Bốn khái niệm: phụ thuộc hàm, chuẩn hoá, phân rã và phụ thuộc đa trị.</p>
<ul>
<li><strong>Phụ thuộc hàm (functional dependency — FD)</strong> — slide 4–19 (bài này).</li>
<li><strong>Chuẩn hoá (normalization)</strong> — 1NF, 2NF, 3NF, BCNF ở slide 28–69 (bài 4.B–4.D).</li>
<li><strong>Phân rã (decomposition)</strong> — tách bảng, nối không mất thông tin (lossless join), mất phụ thuộc: slide 22–27 và 70–72.</li>
<li><strong>Phụ thuộc đa trị (multivalued dependency — MVD, X ↠ Y)</strong> có trong mục tiêu, nhưng <em>không slide nào của bộ này giảng nó</em>; slide 28 chỉ nêu tên 4NF, dạng chuẩn dựa trên MVD. Nếu lớp bạn có học thì đọc Ullman §3.6.</li>
</ul>`],
      [3, 'Contents',
        `<p class="y-chinh">🎯 The order of the deck: FDs → rules about FDs → key and superkey → normal forms.</p>
<p>Keep this order in mind: you cannot name a normal form without the keys, and you cannot find the keys without closures. Every exam exercise follows the same chain: <strong>F → closures → keys → prime attributes → normal form → decomposition</strong>.</p>`,
        `<p class="y-chinh">🎯 Thứ tự của bộ slide: FD → các luật về FD → khoá và siêu khoá → các dạng chuẩn.</p>
<p>Nhớ thứ tự này: không có khoá thì không gọi tên được dạng chuẩn (normal form), và không có bao đóng (closure) thì không tìm được khoá. Bài tập thi nào cũng đi đúng một chuỗi: <strong>F → bao đóng → khoá → thuộc tính khoá (prime) → dạng chuẩn → phân rã</strong>.</p>`],
      [4, 'Functional dependency',
        `<p class="y-chinh">🎯 X → Y holds on R when any two tuples that agree on all of X also agree on all of Y — each X value comes with exactly one Y value.</p>
<ul>
<li>Read X → Y as "X <strong>functionally determines</strong> Y". Both sides are <em>sets</em> of attributes: A1A2…An → B1B2…Bm.</li>
<li>Everyday example: in a student table, <code>StudentID → StudentName</code> holds (one ID, one name), but <code>StudentName → StudentID</code> does not (two students may be called Lan).</li>
<li>An FD is a rule about <strong>every legal instance</strong> of R, decided by the meaning of the data. A table can only <em>refute</em> an FD (two rows that agree on X but differ on Y); it can never prove one.</li>
</ul>
<table>
<thead><tr><th>Row</th><th>X = StudentID</th><th>Y = StudentName</th><th>Verdict</th></tr></thead>
<tbody>
<tr><td>t1</td><td>SE001</td><td>Lan</td><td>—</td></tr>
<tr><td>t2</td><td>SE001</td><td>Lan</td><td>agrees on X and on Y: fine</td></tr>
<tr><td>t3</td><td>SE001</td><td>Minh</td><td>agrees on X, differs on Y ⇒ StudentID → StudentName is violated</td></tr>
</tbody>
</table>
<div class="pitfall">"Agree on X" means equal on <em>all</em> attributes of X at once. For AB → C, two rows with the same A but different B say nothing about the FD.</div>`,
        `<p class="y-chinh">🎯 X → Y đúng trên R khi hai bộ (tuple) bất kỳ bằng nhau trên mọi thuộc tính của X thì cũng bằng nhau trên mọi thuộc tính của Y — mỗi giá trị X đi kèm đúng một giá trị Y.</p>
<ul>
<li>Đọc X → Y là "X <strong>xác định hàm</strong> Y" (functionally determines). Hai vế đều là <em>tập</em> thuộc tính: A1A2…An → B1B2…Bm.</li>
<li>Ví dụ đời thường: trong bảng sinh viên, <code>StudentID → StudentName</code> đúng (một mã, một tên), nhưng <code>StudentName → StudentID</code> sai (hai bạn có thể cùng tên Lan).</li>
<li>FD là luật cho <strong>mọi thể hiện hợp lệ</strong> (instance) của R, do ý nghĩa dữ liệu quyết định. Một bảng cụ thể chỉ <em>bác bỏ</em> được FD (hai dòng bằng nhau trên X mà khác trên Y), không bao giờ chứng minh được FD.</li>
</ul>
<table>
<thead><tr><th>Dòng</th><th>X = StudentID</th><th>Y = StudentName</th><th>Kết luận</th></tr></thead>
<tbody>
<tr><td>t1</td><td>SE001</td><td>Lan</td><td>—</td></tr>
<tr><td>t2</td><td>SE001</td><td>Lan</td><td>bằng nhau trên X và trên Y: ổn</td></tr>
<tr><td>t3</td><td>SE001</td><td>Minh</td><td>bằng trên X, khác trên Y ⇒ vi phạm StudentID → StudentName</td></tr>
</tbody>
</table>
<div class="pitfall">"Bằng nhau trên X" nghĩa là bằng nhau trên <em>mọi</em> thuộc tính của X cùng lúc. Với AB → C, hai dòng cùng A nhưng khác B không nói gì về FD này.</div>`],
      [5, 'Functional dependency - Movies1',
        `<p class="y-chinh">🎯 On the Movies1 table, title,year → length, genre, studioName holds, but title,year → starName does not: one film has several stars.</p>
<p>Check it the way the definition says: group the rows by (title, year) and look for a group with two different values on the right side. In SQL that is a <code>GROUP BY … HAVING COUNT(DISTINCT …) &gt; 1</code> — rows returned = violations.</p>
<pre><code class="language-sql">-- FD title,year -&gt; length,genre,studioName: groups that break it
SELECT title, year
FROM Movies1
GROUP BY title, year
HAVING COUNT(DISTINCT length) &gt; 1 OR COUNT(DISTINCT genre) &gt; 1
    OR COUNT(DISTINCT studioName) &gt; 1;

-- FD title,year -&gt; starName: groups that break it
SELECT title, year, COUNT(DISTINCT starName) AS soSao
FROM Movies1
GROUP BY title, year
HAVING COUNT(DISTINCT starName) &gt; 1;</code></pre>
<div class="out">(6 rows affected)</div>
<table>
<thead><tr><th>title</th><th>year</th></tr></thead>
<tbody>
<tr><td>(0 rows)</td><td></td></tr>
</tbody>
</table>
<table>
<thead><tr><th>title</th><th>year</th><th>soSao</th></tr></thead>
<tbody>
<tr><td>Star Wars</td><td>1977</td><td>3</td></tr>
<tr><td>Wayne's World</td><td>1992</td><td>2</td></tr>
</tbody>
</table>
<p class="nhan">Reading the query line by line</p>
<ul>
<li><code>SELECT title, year FROM Movies1</code> — show the columns title and year of the table Movies1 (the table is created with the slide's six rows before this code runs).</li>
<li><code>GROUP BY title, year</code> — put rows with the same (title, year) into one group: Star Wars 1977 becomes one group of 3 rows.</li>
<li><code>COUNT(DISTINCT length)</code> — inside a group, count how many <em>different</em> lengths there are. 1 means "all the same".</li>
<li><code>HAVING … &gt; 1</code> — keep only the groups where some right-side column has 2 or more different values, i.e. the groups that break the FD.</li>
</ul>
<p>The first query returns no row: every (title, year) group has one length, one genre, one studio. The second returns the two films with more than one star — the counter-examples to title,year → starName. This query is written exactly the same way on PostgreSQL.</p>
<p class="dap-an">✅ <strong>Exercise on the slide:</strong> title,year → starName does <strong>not</strong> hold (the slide writes "startName" — a typo for starName): the three Star Wars rows agree on (Star Wars, 1977) but have three different stars.</p>
<p class="meo">🧠 <strong>Remember:</strong> the key of Movies1 is {title, year, starName}. An FD whose left side is only <em>part</em> of that key (title, year) is exactly what will make Movies1 fail BCNF on slide 66.</p>`,
        `<p class="y-chinh">🎯 Trên bảng Movies1, title,year → length, genre, studioName đúng, nhưng title,year → starName sai: một phim có nhiều ngôi sao.</p>
<p>Kiểm đúng như định nghĩa nói: gom các dòng theo (title, year) rồi tìm nhóm nào có hai giá trị khác nhau ở vế phải. Trong SQL đó là <code>GROUP BY … HAVING COUNT(DISTINCT …) &gt; 1</code> — dòng nào trả về là một vi phạm.</p>
<pre><code class="language-sql">-- FD title,year → length,genre,studioName: các nhóm vi phạm
SELECT title, year
FROM Movies1
GROUP BY title, year
HAVING COUNT(DISTINCT length) &gt; 1 OR COUNT(DISTINCT genre) &gt; 1
    OR COUNT(DISTINCT studioName) &gt; 1;

-- FD title,year → starName: các nhóm vi phạm
SELECT title, year, COUNT(DISTINCT starName) AS soSao
FROM Movies1
GROUP BY title, year
HAVING COUNT(DISTINCT starName) &gt; 1;</code></pre>
<div class="out">(6 rows affected)</div>
<table>
<thead><tr><th>title</th><th>year</th></tr></thead>
<tbody>
<tr><td>(0 dòng)</td><td></td></tr>
</tbody>
</table>
<table>
<thead><tr><th>title</th><th>year</th><th>soSao</th></tr></thead>
<tbody>
<tr><td>Star Wars</td><td>1977</td><td>3</td></tr>
<tr><td>Wayne's World</td><td>1992</td><td>2</td></tr>
</tbody>
</table>
<p class="nhan">Đọc câu truy vấn từng dòng</p>
<ul>
<li><code>SELECT title, year FROM Movies1</code> — lấy ra cột title và year của bảng Movies1 (bảng đã được tạo với đúng sáu dòng của slide trước khi đoạn này chạy).</li>
<li><code>GROUP BY title, year</code> — gom các dòng cùng (title, year) vào một nhóm: Star Wars 1977 thành một nhóm 3 dòng.</li>
<li><code>COUNT(DISTINCT length)</code> — trong một nhóm, đếm có bao nhiêu giá trị length <em>khác nhau</em>. Ra 1 nghĩa là "đều giống nhau".</li>
<li><code>HAVING … &gt; 1</code> — chỉ giữ các nhóm có một cột vế phải mang từ 2 giá trị khác nhau trở lên, tức các nhóm vi phạm FD.</li>
</ul>
<p>Câu thứ nhất không trả dòng nào: mỗi nhóm (title, year) chỉ có một length, một genre, một studio. Câu thứ hai trả về hai phim có hơn một ngôi sao — chính là phản ví dụ của title,year → starName. Trên PostgreSQL câu này viết y hệt.</p>
<p class="dap-an">✅ <strong>Bài tập trên slide:</strong> title,year → starName <strong>không</strong> đúng (slide gõ "startName" — lỗi chính tả của starName): ba dòng Star Wars bằng nhau trên (Star Wars, 1977) nhưng có ba ngôi sao khác nhau.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> khoá của Movies1 là {title, year, starName}. Một FD có vế trái chỉ là <em>một phần</em> của khoá đó (title, year) chính là thứ làm Movies1 không đạt BCNF ở slide 66.</p>`],
      [6, 'Functional dependency - key and super-key',
        `<p class="y-chinh">🎯 A superkey is any set of attributes that contains a key; a key is a superkey with nothing extra — remove any attribute and it stops determining the whole relation.</p>
<ul>
<li><strong>Key</strong> (candidate key): K → all attributes of R, and no proper subset of K does that. A relation may have several (candidate keys, also called alternate keys); the designer picks one as the <strong>primary key</strong>.</li>
<li><strong>Superkey</strong>: satisfies only the first condition (determines everything). Every key is a superkey; a superkey need not be minimal.</li>
<li>The slide's line "If K is a key, L is a super key, then K ⊆ L" should be read "L is a superkey <em>containing</em> K" — a superkey always contains <em>some</em> key, not necessarily a given one.</li>
</ul>
<table>
<thead><tr><th>Set (Movies1)</th><th>Determines all 6 attributes?</th><th>Minimal?</th><th>So it is</th></tr></thead>
<tbody>
<tr><td>{title, year, starName}</td><td>yes</td><td>yes</td><td>a key</td></tr>
<tr><td>{title, year, starName, genre}</td><td>yes</td><td>no (drop genre)</td><td>a superkey, not a key</td></tr>
<tr><td>{title, year}</td><td>no (misses starName)</td><td>—</td><td>neither</td></tr>
</tbody>
</table>
<div class="pitfall">FE trap: "every superkey is a key" is false; "every key is a superkey" is true. And a relation with n attributes always has the trivial superkey "all n attributes".</div>`,
        `<p class="y-chinh">🎯 Siêu khoá (superkey) là mọi tập thuộc tính chứa một khoá; khoá (key) là siêu khoá không thừa gì — bỏ bất kỳ thuộc tính nào là nó không còn xác định được cả quan hệ.</p>
<ul>
<li><strong>Khoá</strong> (candidate key — khoá ứng viên): K → mọi thuộc tính của R, và không tập con thực sự nào của K làm được vậy. Một quan hệ có thể có nhiều khoá (còn gọi khoá thay thế — alternate key); người thiết kế chọn một làm <strong>khoá chính (primary key)</strong>.</li>
<li><strong>Siêu khoá</strong>: chỉ cần điều kiện thứ nhất (xác định được mọi thứ). Mọi khoá là siêu khoá; siêu khoá không nhất thiết tối tiểu.</li>
<li>Dòng "If K is a key, L is a super key, then K ⊆ L" trên slide nên hiểu là "L là siêu khoá <em>chứa</em> K" — siêu khoá luôn chứa <em>một</em> khoá nào đó, không nhất thiết là một khoá cho trước.</li>
</ul>
<table>
<thead><tr><th>Tập (Movies1)</th><th>Xác định cả 6 thuộc tính?</th><th>Tối tiểu?</th><th>Vậy nó là</th></tr></thead>
<tbody>
<tr><td>{title, year, starName}</td><td>có</td><td>có</td><td>khoá</td></tr>
<tr><td>{title, year, starName, genre}</td><td>có</td><td>không (bỏ được genre)</td><td>siêu khoá, không phải khoá</td></tr>
<tr><td>{title, year}</td><td>không (thiếu starName)</td><td>—</td><td>không là gì cả</td></tr>
</tbody>
</table>
<div class="pitfall">Bẫy FE: "mọi siêu khoá là khoá" là SAI; "mọi khoá là siêu khoá" là ĐÚNG. Và quan hệ n thuộc tính luôn có siêu khoá hiển nhiên là "cả n thuộc tính".</div>`],
      [7, "Armstrong's Axioms",
        `<p class="y-chinh">🎯 Three axioms — reflexivity, augmentation, transitivity — derive every FD that follows from F; union, decomposition and pseudotransitivity are shortcuts built from them.</p>
<table>
<thead><tr><th>Rule</th><th>If</th><th>Then</th><th>Example</th></tr></thead>
<tbody>
<tr><td>Reflexivity</td><td>Y ⊆ X</td><td>X → Y (a trivial FD)</td><td>FLD → FD</td></tr>
<tr><td>Augmentation</td><td>X → Y</td><td>XZ → YZ</td><td>A → B gives AC → BC</td></tr>
<tr><td>Transitivity</td><td>X → Y, Y → Z</td><td>X → Z</td><td>ID → Dept, Dept → Head gives ID → Head</td></tr>
<tr><td>Union (combining)</td><td>X → Y, X → Z</td><td>X → YZ</td><td>A → B, A → C gives A → BC</td></tr>
<tr><td>Decomposition (splitting)</td><td>X → YZ</td><td>X → Y and X → Z</td><td>A → BC gives A → B</td></tr>
<tr><td>Pseudotransitivity</td><td>X → Y, WY → Z</td><td>WX → Z</td><td>A → B, CB → D gives CA → D</td></tr>
</tbody>
</table>
<p class="nhan">Why pseudotransitivity is not a new axiom — derived in two steps</p>
<pre><code class="language-plaintext">1. X → Y           (given)
2. WX → WY         (augmentation of 1 with W)
3. WY → Z          (given)
4. WX → Z          (transitivity of 2 and 3)</code></pre>
<p class="meo">🧠 <strong>Remember "RAT"</strong>: Reflexivity, Augmentation, Transitivity. The FE likes "which one is NOT an Armstrong axiom?" — the answer is one of the derived rules (union, decomposition, pseudotransitivity).</p>
<div class="pitfall">Splitting works on the <strong>right</strong> side only. From AB → C you may NOT conclude A → C: that is the most common wrong step in closure and key questions.</div>`,
        `<p class="y-chinh">🎯 Ba tiên đề — phản xạ, tăng trưởng, bắc cầu — suy ra được mọi FD kéo theo từ F; hợp, tách và giả bắc cầu là các lối tắt dựng từ ba tiên đề đó.</p>
<table>
<thead><tr><th>Luật</th><th>Nếu</th><th>Thì</th><th>Ví dụ</th></tr></thead>
<tbody>
<tr><td>Phản xạ (reflexivity)</td><td>Y ⊆ X</td><td>X → Y (FD tầm thường — trivial)</td><td>FLD → FD</td></tr>
<tr><td>Tăng trưởng (augmentation)</td><td>X → Y</td><td>XZ → YZ</td><td>A → B cho AC → BC</td></tr>
<tr><td>Bắc cầu (transitivity)</td><td>X → Y, Y → Z</td><td>X → Z</td><td>Mã SV → Khoa, Khoa → Trưởng khoa cho Mã SV → Trưởng khoa</td></tr>
<tr><td>Hợp (union / combining)</td><td>X → Y, X → Z</td><td>X → YZ</td><td>A → B, A → C cho A → BC</td></tr>
<tr><td>Tách (decomposition / splitting)</td><td>X → YZ</td><td>X → Y và X → Z</td><td>A → BC cho A → B</td></tr>
<tr><td>Giả bắc cầu (pseudotransitivity)</td><td>X → Y, WY → Z</td><td>WX → Z</td><td>A → B, CB → D cho CA → D</td></tr>
</tbody>
</table>
<p class="nhan">Vì sao giả bắc cầu không phải tiên đề mới — suy ra trong hai bước</p>
<pre><code class="language-plaintext">1. X → Y           (cho trước)
2. WX → WY         (tăng trưởng 1 thêm W)
3. WY → Z          (cho trước)
4. WX → Z          (bắc cầu 2 và 3)</code></pre>
<p class="meo">🧠 <strong>Nhớ "RAT"</strong>: Reflexivity, Augmentation, Transitivity. FE hay hỏi "luật nào KHÔNG phải tiên đề Armstrong?" — đáp án là một trong các luật suy ra (hợp, tách, giả bắc cầu).</p>
<div class="pitfall">Chỉ được tách ở vế <strong>phải</strong>. Từ AB → C KHÔNG được suy ra A → C: đây là bước sai phổ biến nhất trong câu hỏi bao đóng và tìm khoá.</div>`],
      [8, 'Follows from and equivalent sets of FDs',
        `<p class="y-chinh">🎯 S follows from T when every instance satisfying T also satisfies S; S and T are equivalent when each follows from the other.</p>
<p>In practice you never check "every instance": you use closures (slide 9). S follows from T ⇔ for every FD X → Y in S, Y ⊆ X⁺ computed <strong>with T</strong>.</p>
<table>
<thead><tr><th>T</th><th>S</th><th>S follows from T?</th><th>T follows from S?</th></tr></thead>
<tbody>
<tr><td>{A → B, B → C}</td><td>{A → C}</td><td>yes: A⁺ under T = {A, B, C} ∋ C</td><td>no: A⁺ under S = {A, C}, no B</td></tr>
<tr><td>{A → B, B → C}</td><td>{A → B, B → C, A → C}</td><td>yes</td><td>yes ⇒ equivalent</td></tr>
</tbody>
</table>
<p>Equivalent sets describe exactly the same legal tables — which is why we may replace F by a smaller equivalent set (a basis, slide 12) before normalizing.</p>
<div class="pitfall">Equivalence must be checked in <strong>both</strong> directions. "Every FD of S is implied by T" alone only shows S follows from T.</div>`,
        `<p class="y-chinh">🎯 S suy ra từ T (follows from) khi mọi thể hiện thoả T đều thoả S; S và T tương đương (equivalent) khi mỗi tập suy ra từ tập kia.</p>
<p>Trên thực tế không ai kiểm "mọi thể hiện": ta dùng bao đóng (slide 9). S suy ra từ T ⇔ với mọi FD X → Y trong S, Y ⊆ X⁺ tính <strong>bằng T</strong>.</p>
<table>
<thead><tr><th>T</th><th>S</th><th>S suy ra từ T?</th><th>T suy ra từ S?</th></tr></thead>
<tbody>
<tr><td>{A → B, B → C}</td><td>{A → C}</td><td>có: A⁺ theo T = {A, B, C} ∋ C</td><td>không: A⁺ theo S = {A, C}, không có B</td></tr>
<tr><td>{A → B, B → C}</td><td>{A → B, B → C, A → C}</td><td>có</td><td>có ⇒ tương đương</td></tr>
</tbody>
</table>
<p>Hai tập tương đương mô tả đúng cùng một tập bảng hợp lệ — vì vậy được thay F bằng một tập tương đương nhỏ hơn (cơ sở — basis, slide 12) trước khi chuẩn hoá.</p>
<div class="pitfall">Tương đương phải kiểm <strong>cả hai</strong> chiều. Chỉ "mọi FD của S suy ra được từ T" thì mới chứng tỏ S suy ra từ T.</div>`],
      [9, 'The Closure of Attributes - definition',
        `<p class="y-chinh">🎯 The closure {A1,…,An}⁺ under S is the set of every attribute B such that A1…An → B follows from S.</p>
<ul>
<li>It always contains A1, …, An themselves, because A1…An → Ai is trivial (reflexivity).</li>
<li>The closure turns every FD question into set inclusion: <strong>X → Y follows from S ⇔ Y ⊆ X⁺</strong>.</li>
<li>And every key question too: <strong>X is a superkey ⇔ X⁺ = all attributes of R</strong>.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> X⁺ = "everything X can reach". If X reaches everything, X is a superkey; if no smaller part of X does, X is a key.</p>`,
        `<p class="y-chinh">🎯 Bao đóng (closure) {A1,…,An}⁺ theo S là tập mọi thuộc tính B sao cho A1…An → B suy ra được từ S.</p>
<ul>
<li>Nó luôn chứa chính A1, …, An, vì A1…An → Ai là FD tầm thường (luật phản xạ).</li>
<li>Bao đóng biến mọi câu hỏi về FD thành câu hỏi tập con: <strong>X → Y suy ra từ S ⇔ Y ⊆ X⁺</strong>.</li>
<li>Và cả câu hỏi về khoá: <strong>X là siêu khoá ⇔ X⁺ = mọi thuộc tính của R</strong>.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> X⁺ = "mọi thứ X với tới được". X với tới mọi thứ thì X là siêu khoá; nếu không phần nhỏ hơn nào của X làm được thì X là khoá.</p>`],
      [10, 'Algorithm 3.7 - Closure of a set of attributes',
        `<p class="y-chinh">🎯 Start with X = the given attributes; repeatedly fire any FD whose left side is inside X and add its right side; stop when a full pass adds nothing.</p>
<ol>
<li>Split every FD so its right side is a single attribute (optional, it only simplifies bookkeeping).</li>
<li>X := {A1, …, An}.</li>
<li>Look for B1…Bm → C with all Bi in X and C not in X; add C; repeat.</li>
<li>When no FD adds anything, X = {A1, …, An}⁺.</li>
</ol>
<p class="nhan">Step by step — R(A, B, C, D, E), F = {CD → E, A → C, B → D}, compute {A, B}⁺ (FDs scanned in this order)</p>
<table>
<thead><tr><th>Pass</th><th>FD tried</th><th>Left side inside X?</th><th>Added</th><th>X after</th></tr></thead>
<tbody>
<tr><td>1</td><td>CD → E</td><td>no (C, D missing)</td><td>—</td><td>{A, B}</td></tr>
<tr><td>1</td><td>A → C</td><td>yes</td><td>C</td><td>{A, B, C}</td></tr>
<tr><td>1</td><td>B → D</td><td>yes</td><td>D</td><td>{A, B, C, D}</td></tr>
<tr><td>2</td><td>CD → E</td><td>yes now</td><td>E</td><td>{A, B, C, D, E}</td></tr>
<tr><td>3</td><td>all three</td><td>—</td><td>nothing</td><td>stop: {A, B}⁺ = {A, B, C, D, E}</td></tr>
</tbody>
</table>
<div class="pitfall">One pass is not enough: CD → E was useless in pass 1 and fires in pass 2. Stop only after a <em>whole</em> pass adds nothing — stopping early is the most frequent way to miss a key.</div>
<div class="callout"><strong>✍️ Doing it by hand in the exam room</strong>
<ol>
<li>Copy F as a numbered list, one FD per line (split right sides: A → BC becomes A → B and A → C).</li>
<li>Write X on a line. Go down the list; next to each FD whose whole left side is already in X, write the new attributes and tick the FD (a ticked FD never needs trying again).</li>
<li>When you reach the end of the list, go back to the top if anything was added in this pass.</li>
<li>Stop when one full pass adds nothing. Compare the result with the list of all attributes of R: equal ⇒ X is a superkey.</li>
</ol></div>`,
        `<p class="y-chinh">🎯 Bắt đầu với X = các thuộc tính đã cho; lặp: FD nào có vế trái nằm gọn trong X thì thêm vế phải của nó vào X; dừng khi một lượt quét trọn vẹn không thêm được gì.</p>
<ol>
<li>Tách mọi FD cho vế phải chỉ còn một thuộc tính (không bắt buộc, chỉ để dễ theo dõi).</li>
<li>X := {A1, …, An}.</li>
<li>Tìm B1…Bm → C với mọi Bi thuộc X và C chưa thuộc X; thêm C; lặp lại.</li>
<li>Khi không FD nào thêm được gì nữa, X = {A1, …, An}⁺.</li>
</ol>
<p class="nhan">Từng bước — R(A, B, C, D, E), F = {CD → E, A → C, B → D}, tính {A, B}⁺ (quét FD theo đúng thứ tự này)</p>
<table>
<thead><tr><th>Lượt</th><th>FD thử</th><th>Vế trái nằm trong X?</th><th>Thêm</th><th>X sau đó</th></tr></thead>
<tbody>
<tr><td>1</td><td>CD → E</td><td>không (thiếu C, D)</td><td>—</td><td>{A, B}</td></tr>
<tr><td>1</td><td>A → C</td><td>có</td><td>C</td><td>{A, B, C}</td></tr>
<tr><td>1</td><td>B → D</td><td>có</td><td>D</td><td>{A, B, C, D}</td></tr>
<tr><td>2</td><td>CD → E</td><td>giờ thì có</td><td>E</td><td>{A, B, C, D, E}</td></tr>
<tr><td>3</td><td>cả ba</td><td>—</td><td>không gì</td><td>dừng: {A, B}⁺ = {A, B, C, D, E}</td></tr>
</tbody>
</table>
<div class="pitfall">Một lượt là chưa đủ: CD → E vô dụng ở lượt 1 nhưng dùng được ở lượt 2. Chỉ dừng khi <em>cả một</em> lượt không thêm được gì — dừng sớm là cách hay gặp nhất khiến bạn bỏ sót khoá.</div>
<div class="callout"><strong>✍️ Tự làm bằng tay trong phòng thi</strong>
<ol>
<li>Chép F thành danh sách đánh số, mỗi dòng một FD (tách vế phải: A → BC thành A → B và A → C).</li>
<li>Viết X ra một dòng. Đi dọc danh sách; FD nào có cả vế trái đã nằm trong X thì ghi các thuộc tính mới bên cạnh và đánh dấu ✓ FD đó (FD đã ✓ không cần thử lại).</li>
<li>Tới cuối danh sách, nếu lượt này có thêm gì thì quay lại đầu danh sách.</li>
<li>Dừng khi trọn một lượt không thêm được gì. So kết quả với danh sách mọi thuộc tính của R: bằng nhau ⇒ X là siêu khoá.</li>
</ol></div>`],
      [11, 'The Closure of Attributes - exercise',
        `<p class="y-chinh">🎯 R(A, B, C, D) with S = {A → B, B → C, C → D, D → A}: every single attribute reaches everything, so A, B, C and D are all keys.</p>
<p class="nhan">{A}⁺ step by step</p>
<table>
<thead><tr><th>Step</th><th>FD fired</th><th>X</th></tr></thead>
<tbody>
<tr><td>start</td><td>—</td><td>{A}</td></tr>
<tr><td>1</td><td>A → B</td><td>{A, B}</td></tr>
<tr><td>2</td><td>B → C</td><td>{A, B, C}</td></tr>
<tr><td>3</td><td>C → D</td><td>{A, B, C, D} = all of R</td></tr>
</tbody>
</table>
<p>{B}⁺ is the same walk around the cycle: B → C → D → A, so {B}⁺ = {A, B, C, D}. By symmetry {C}⁺ = {D}⁺ = {A, B, C, D}.</p>
<p class="dap-an">✅ <strong>Answer:</strong> {A}⁺ = {B}⁺ = {A, B, C, D}. The keys of R are <strong>{A}, {B}, {C}, {D}</strong> — four candidate keys of one attribute each. Any larger set such as {A, B} is a superkey but not a key, because {A} alone already works.</p>
<p class="meo">🧠 <strong>Remember:</strong> a cycle of FDs (A → B → C → D → A) makes every attribute on it equivalent — each one alone is a key.</p>
<div class="pitfall">"Some keys" in the question invites answers like {A, B}. A key must be minimal: {A, B}⁺ = R, but so does {A}⁺, so {A, B} is only a superkey.</div>
<div class="callout"><strong>✍️ Finding ALL keys in the exam room</strong>
<ol>
<li>Make three columns: attributes only on the <strong>left</strong> of FDs (or in no FD at all) — they are in every key; only on the <strong>right</strong> — in no key; on <strong>both</strong> sides — maybe.</li>
<li>Close the "left-only" set. If the closure is all of R, it is the one and only key — done.</li>
<li>Otherwise add the "both" attributes one at a time, then two at a time…; every set whose closure is R and that contains no key found earlier is a new key.</li>
</ol>
<p>Here every attribute is on both sides (A → B and D → A, …), so the left-only set is empty and step 3 starts with single attributes: {A}⁺ = {B}⁺ = {C}⁺ = {D}⁺ = R ⇒ four keys; no larger set can be a key.</p></div>`,
        `<p class="y-chinh">🎯 R(A, B, C, D) với S = {A → B, B → C, C → D, D → A}: mỗi thuộc tính đơn đều với tới mọi thứ, nên A, B, C và D đều là khoá.</p>
<p class="nhan">Tính {A}⁺ từng bước</p>
<table>
<thead><tr><th>Bước</th><th>FD dùng</th><th>X</th></tr></thead>
<tbody>
<tr><td>bắt đầu</td><td>—</td><td>{A}</td></tr>
<tr><td>1</td><td>A → B</td><td>{A, B}</td></tr>
<tr><td>2</td><td>B → C</td><td>{A, B, C}</td></tr>
<tr><td>3</td><td>C → D</td><td>{A, B, C, D} = cả R</td></tr>
</tbody>
</table>
<p>{B}⁺ đi đúng vòng đó: B → C → D → A, nên {B}⁺ = {A, B, C, D}. Tương tự {C}⁺ = {D}⁺ = {A, B, C, D}.</p>
<p class="dap-an">✅ <strong>Đáp án:</strong> {A}⁺ = {B}⁺ = {A, B, C, D}. Các khoá của R là <strong>{A}, {B}, {C}, {D}</strong> — bốn khoá ứng viên, mỗi khoá một thuộc tính. Tập lớn hơn như {A, B} là siêu khoá chứ không phải khoá, vì riêng {A} đã đủ.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> một vòng FD (A → B → C → D → A) làm mọi thuộc tính trên vòng "ngang hàng" — mỗi cái đứng một mình đều là khoá.</p>
<div class="pitfall">Chữ "some keys" trong đề dễ dụ trả lời {A, B}. Khoá phải tối tiểu: {A, B}⁺ = R, nhưng {A}⁺ cũng vậy, nên {A, B} chỉ là siêu khoá.</div>
<div class="callout"><strong>✍️ Tìm MỌI khoá trong phòng thi</strong>
<ol>
<li>Kẻ ba cột: thuộc tính chỉ nằm ở vế <strong>trái</strong> các FD (hoặc không có trong FD nào) — chắc chắn có trong mọi khoá; chỉ ở vế <strong>phải</strong> — không nằm trong khoá nào; ở <strong>cả hai</strong> vế — có thể.</li>
<li>Tính bao đóng của tập "chỉ vế trái". Nếu ra cả R thì đó là khoá duy nhất — xong.</li>
<li>Nếu chưa, thêm lần lượt từng thuộc tính "cả hai vế", rồi từng cặp…; tập nào có bao đóng bằng R và không chứa khoá nào đã tìm trước đó là một khoá mới.</li>
</ol>
<p>Ở đây thuộc tính nào cũng nằm ở cả hai vế (A → B và D → A, …), nên tập "chỉ vế trái" rỗng và bước 3 bắt đầu từ từng thuộc tính đơn: {A}⁺ = {B}⁺ = {C}⁺ = {D}⁺ = R ⇒ bốn khoá; không tập lớn hơn nào còn là khoá được.</p></div>`],
      [12, 'Closing Sets of Functional Dependencies - minimal basis',
        `<p class="y-chinh">🎯 A basis of S is any equivalent set of FDs; a minimal basis has single-attribute right sides, no removable FD and no removable left-side attribute.</p>
<p>The three conditions are also the three steps to build one:</p>
<table>
<thead><tr><th>Condition</th><th>Step to reach it</th><th>Test</th></tr></thead>
<tbody>
<tr><td>1. right sides are single attributes</td><td>split X → AB into X → A, X → B</td><td>—</td></tr>
<tr><td>2. no FD can be dropped</td><td>drop X → A if A ⊆ X⁺ computed <em>without</em> that FD</td><td>closure without the FD</td></tr>
<tr><td>3. no left-side attribute can be dropped</td><td>replace XB → A by X → A if A ⊆ X⁺ (computed with all FDs)</td><td>closure of the smaller left side</td></tr>
</tbody>
</table>
<p>Do step 3 (left sides) <em>before</em> step 2 (whole FDs): shrinking a left side can make another FD redundant. The result is also called a <strong>minimal cover</strong> or <strong>canonical cover</strong>.</p>
<div class="pitfall">A minimal basis is <strong>not unique</strong> (see slide 13). An exam option that differs from yours may still be right — check it is equivalent to F and meets the three conditions.</div>`,
        `<p class="y-chinh">🎯 Cơ sở (basis) của S là mọi tập FD tương đương với S; cơ sở tối thiểu (minimal basis) có vế phải một thuộc tính, không bỏ được FD nào và không bỏ được thuộc tính nào ở vế trái.</p>
<p>Ba điều kiện cũng chính là ba bước dựng nó:</p>
<table>
<thead><tr><th>Điều kiện</th><th>Bước để đạt</th><th>Cách kiểm</th></tr></thead>
<tbody>
<tr><td>1. vế phải một thuộc tính</td><td>tách X → AB thành X → A, X → B</td><td>—</td></tr>
<tr><td>2. không bỏ được FD nào</td><td>bỏ X → A nếu A ⊆ X⁺ tính <em>không dùng</em> FD đó</td><td>bao đóng khi bỏ FD</td></tr>
<tr><td>3. không bỏ được thuộc tính vế trái</td><td>thay XB → A bằng X → A nếu A ⊆ X⁺ (tính với mọi FD)</td><td>bao đóng của vế trái nhỏ hơn</td></tr>
</tbody>
</table>
<p>Làm bước 3 (vế trái) <em>trước</em> bước 2 (bỏ cả FD): thu nhỏ vế trái có thể làm một FD khác thành thừa. Kết quả còn được gọi là <strong>phủ tối thiểu (minimal cover)</strong> hay <strong>phủ chính tắc (canonical cover)</strong>.</p>
<div class="pitfall">Phủ tối thiểu <strong>không duy nhất</strong> (xem slide 13). Phương án trắc nghiệm khác với kết quả của bạn vẫn có thể đúng — kiểm xem nó có tương đương F và thoả đủ ba điều kiện không.</div>`],
      [13, 'Closing Sets of FDs - example with several minimal bases',
        `<p class="y-chinh">🎯 For R(A, B, C) where every attribute determines every other, the slide gives two different minimal bases — both correct.</p>
<p>S has 12 FDs, but they all say one thing: A, B and C each determine the other two ({A}⁺ = {B}⁺ = {C}⁺ = {A, B, C}). Any small set that keeps that property is a basis.</p>
<table>
<thead><tr><th>Candidate</th><th>Equivalent to S?</th><th>Can an FD be dropped?</th><th>Minimal basis?</th></tr></thead>
<tbody>
<tr><td>{A → B, B → A, B → C, C → B}</td><td>yes: A → B → C, C → B → A</td><td>no (each one is the only way to reach its target)</td><td>✓ (slide)</td></tr>
<tr><td>{A → B, B → C, C → A}</td><td>yes: the cycle reaches everything</td><td>no</td><td>✓ (slide)</td></tr>
<tr><td>{A → C, C → B, B → A}</td><td>yes: the cycle the other way</td><td>no</td><td>✓ (also correct)</td></tr>
<tr><td>{A → B, B → A, A → C, C → A}</td><td>yes: A is the hub</td><td>no</td><td>✓ (also correct)</td></tr>
</tbody>
</table>
<p>All four were checked with the three conditions of slide 12 by script. The two on the slide have 4 and 3 FDs — "minimal" means no redundancy inside the set, not the smallest possible number of FDs.</p>
<p class="meo">🧠 <strong>Remember:</strong> the keys of this R are A, B and C — each alone determines everything, whichever basis you pick.</p>`,
        `<p class="y-chinh">🎯 Với R(A, B, C) mà thuộc tính nào cũng xác định hai thuộc tính còn lại, slide đưa ra hai cơ sở tối thiểu khác nhau — cả hai đều đúng.</p>
<p>S có 12 FD nhưng cùng nói một điều: A, B, C mỗi cái xác định hai cái còn lại ({A}⁺ = {B}⁺ = {C}⁺ = {A, B, C}). Tập nhỏ nào giữ được tính chất đó đều là cơ sở.</p>
<table>
<thead><tr><th>Ứng viên</th><th>Tương đương S?</th><th>Bỏ được FD nào không?</th><th>Là phủ tối thiểu?</th></tr></thead>
<tbody>
<tr><td>{A → B, B → A, B → C, C → B}</td><td>có: A → B → C, C → B → A</td><td>không (mỗi FD là đường duy nhất tới đích của nó)</td><td>✓ (slide)</td></tr>
<tr><td>{A → B, B → C, C → A}</td><td>có: vòng tròn với tới mọi thứ</td><td>không</td><td>✓ (slide)</td></tr>
<tr><td>{A → C, C → B, B → A}</td><td>có: vòng tròn theo chiều ngược</td><td>không</td><td>✓ (cũng đúng)</td></tr>
<tr><td>{A → B, B → A, A → C, C → A}</td><td>có: A là trung tâm</td><td>không</td><td>✓ (cũng đúng)</td></tr>
</tbody>
</table>
<p>Cả bốn tập đều đã được kiểm bằng script theo ba điều kiện của slide 12. Hai tập trên slide có 4 và 3 FD — "tối thiểu" nghĩa là trong tập không có gì thừa, chứ không phải số FD ít nhất có thể.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> khoá của R này là A, B và C — mỗi cái đứng riêng đều xác định mọi thứ, chọn cơ sở nào cũng vậy.</p>`],
      [14, 'What happens to FDs when we project R',
        `<p class="y-chinh">🎯 The question of slides 14–19: if R has FDs S and we keep only some columns, R1 = πL(R), which FDs hold on R1?</p>
<p>This matters because normalization <em>is</em> projection: every decomposed table is a projection of the original. To know whether R1 is in BCNF or 3NF you need its own FDs — and they are not simply "the FDs of S whose attributes are all in R1".</p>
<p>Example preview (slide 19): R(A, B, C, D) with A → B, B → C, C → D. Keep A, C, D. No FD of S mentions only A, C, D except C → D, yet A → C also holds on R1 — it comes through B, which was projected away.</p>`,
        `<p class="y-chinh">🎯 Câu hỏi của slide 14–19: nếu R có tập FD S và ta chỉ giữ lại một số cột, R1 = πL(R) (phép chiếu — projection), thì FD nào đúng trên R1?</p>
<p>Điều này quan trọng vì chuẩn hoá <em>chính là</em> phép chiếu: mỗi bảng sau khi phân rã là một phép chiếu của bảng gốc. Muốn biết R1 có đạt BCNF hay 3NF thì phải có FD của riêng nó — và đó không đơn giản là "các FD của S có mọi thuộc tính nằm trong R1".</p>
<p>Xem trước ví dụ (slide 19): R(A, B, C, D) với A → B, B → C, C → D. Giữ A, C, D. Trong S chỉ có C → D là nằm gọn trong A, C, D, vậy mà A → C vẫn đúng trên R1 — nó đi qua B, cột đã bị chiếu bỏ.</p>`],
      [15, 'Projecting Functional Dependencies - what we look for',
        `<p class="y-chinh">🎯 The FDs of a projection R1 are those that follow from S and mention only attributes of R1.</p>
<ul>
<li><strong>Follow from S</strong>: not only the FDs written in S — also those implied (through closures), like A → C above.</li>
<li><strong>Involve only attributes of R1</strong>: an FD with an attribute outside R1 cannot even be tested on R1.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> "close in R, keep what lands in R1" — compute X⁺ with all of S, then throw away what is not a column of R1.</p>`,
        `<p class="y-chinh">🎯 FD của phép chiếu R1 là những FD suy ra được từ S và chỉ nhắc tới thuộc tính của R1.</p>
<ul>
<li><strong>Suy ra được từ S</strong>: không chỉ các FD viết sẵn trong S — cả các FD kéo theo (qua bao đóng), như A → C ở trên.</li>
<li><strong>Chỉ gồm thuộc tính của R1</strong>: FD có thuộc tính nằm ngoài R1 thì không kiểm được trên R1.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> "đóng trong R, giữ phần rơi vào R1" — tính X⁺ bằng toàn bộ S, rồi bỏ những gì không phải cột của R1.</p>`],
      [16, 'Algorithm 3.12 - Projecting a Set of FDs',
        `<p class="y-chinh">🎯 For every subset X of R1's attributes, compute X⁺ with S; every A in X⁺ that is an attribute of R1 but not in X gives an FD X → A of R1; finally reduce the result to a minimal basis.</p>
<pre><code class="language-plaintext">T := ∅
for each subset X of attributes(R1):
    compute X⁺ using S (all FDs of R)
    for each A in X⁺ ∩ attributes(R1), A ∉ X:
        add X → A to T
return a minimal basis of T</code></pre>
<p>The loop is exponential (R1 with n attributes has 2ⁿ − 1 non-empty subsets), which is why exam relations have 3–5 attributes, and why slide 18 gives two shortcuts.</p>
<div class="pitfall">Compute X⁺ with the FDs of the <strong>original</strong> R, not only with the FDs that happen to fit inside R1 — otherwise you lose A → C in the slide 19 example.</div>`,
        `<p class="y-chinh">🎯 Với mọi tập con X của các thuộc tính của R1, tính X⁺ bằng S; mỗi A thuộc X⁺, là thuộc tính của R1 và không thuộc X cho một FD X → A của R1; cuối cùng rút kết quả về phủ tối thiểu.</p>
<pre><code class="language-plaintext">T := ∅
với mỗi tập con X của thuộc tính(R1):
    tính X⁺ bằng S (mọi FD của R)
    với mỗi A thuộc X⁺ ∩ thuộc tính(R1), A ∉ X:
        thêm X → A vào T
trả về phủ tối thiểu của T</code></pre>
<p>Vòng lặp tăng theo hàm mũ (R1 có n thuộc tính thì có 2ⁿ − 1 tập con khác rỗng), vì vậy quan hệ trong đề thi chỉ 3–5 thuộc tính, và slide 18 cho hai lối tắt.</p>
<div class="pitfall">Tính X⁺ bằng FD của R <strong>gốc</strong>, không chỉ bằng các FD tình cờ nằm gọn trong R1 — nếu không bạn mất A → C trong ví dụ slide 19.</div>`],
      [17, 'Algorithm 3.12 (cont) - minimal basis from T',
        `<p class="y-chinh">🎯 The last step of the projection repeats slide 12: remove FDs that follow from the others, shrink left sides, and repeat until nothing changes.</p>
<ul>
<li><strong>Remove</strong> an FD F of T when it follows from the other FDs of T.</li>
<li><strong>Shrink</strong> Y → B (Y has at least 2 attributes): drop one attribute to get Z; if Z → B follows from T (Y → B included), replace Y → B by Z → B.</li>
</ul>
<p class="nhan">Shrinking a left side — T = {A → B, AB → C}</p>
<table>
<thead><tr><th>FD</th><th>Try Z</th><th>Z⁺ with T</th><th>Contains the right side?</th><th>Result</th></tr></thead>
<tbody>
<tr><td>AB → C</td><td>Z = A</td><td>{A, B, C}</td><td>yes (A → B then AB → C)</td><td>replace by A → C</td></tr>
<tr><td>AB → C</td><td>Z = B</td><td>{B}</td><td>no</td><td>—</td></tr>
</tbody>
</table>
<p>So T becomes {A → B, A → C}: equivalent to the old T, and nothing more can be removed.</p>`,
        `<p class="y-chinh">🎯 Bước cuối của phép chiếu lặp lại slide 12: bỏ FD suy ra được từ các FD còn lại, thu nhỏ vế trái, lặp tới khi không đổi được gì.</p>
<ul>
<li><strong>Bỏ</strong> một FD F của T khi nó suy ra được từ các FD khác của T.</li>
<li><strong>Thu nhỏ</strong> Y → B (Y có ít nhất 2 thuộc tính): bỏ một thuộc tính được Z; nếu Z → B suy ra được từ T (tính cả Y → B), thay Y → B bằng Z → B.</li>
</ul>
<p class="nhan">Thu nhỏ vế trái — T = {A → B, AB → C}</p>
<table>
<thead><tr><th>FD</th><th>Thử Z</th><th>Z⁺ theo T</th><th>Chứa vế phải?</th><th>Kết quả</th></tr></thead>
<tbody>
<tr><td>AB → C</td><td>Z = A</td><td>{A, B, C}</td><td>có (A → B rồi AB → C)</td><td>thay bằng A → C</td></tr>
<tr><td>AB → C</td><td>Z = B</td><td>{B}</td><td>không</td><td>—</td></tr>
</tbody>
</table>
<p>Vậy T thành {A → B, A → C}: tương đương T cũ và không bỏ được gì nữa.</p>`],
      [18, 'Projecting FDs - two notations',
        `<p class="y-chinh">🎯 Two shortcuts: closing ∅ or the set of all attributes never gives a non-trivial FD, and once X⁺ is everything, supersets of X give nothing new.</p>
<ol>
<li>∅⁺ gives nothing (an FD needs a left side), and the closure of all attributes cannot add an attribute outside itself — skip both.</li>
<li>If X⁺ already contains every attribute of R1, any superset Y ⊇ X only gives FDs Y → A that follow from X → A by augmentation — skip them.</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> go from small subsets to large ones (singletons, then pairs, …) and cross out every superset of a set whose closure is already "everything".</p>`,
        `<p class="y-chinh">🎯 Hai lối tắt: bao đóng của ∅ hay của cả tập thuộc tính không bao giờ cho FD không tầm thường, và một khi X⁺ đã là tất cả thì các tập chứa X không cho gì mới.</p>
<ol>
<li>∅⁺ không cho gì (FD cần vế trái), còn bao đóng của cả tập thuộc tính không thể thêm thuộc tính nào ngoài chính nó — bỏ qua cả hai.</li>
<li>Nếu X⁺ đã chứa mọi thuộc tính của R1 thì mọi tập Y ⊇ X chỉ cho các FD Y → A suy ra được từ X → A bằng luật tăng trưởng — bỏ qua chúng.</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> đi từ tập con nhỏ tới lớn (từng thuộc tính, rồi từng cặp, …) và gạch mọi tập chứa một tập mà bao đóng đã là "tất cả".</p>`],
      [19, 'Projecting FDs - example',
        `<p class="y-chinh">🎯 R(A, B, C, D) with A → B, B → C, C → D projected on R1 = {A, C, D}: the FDs of R1 are A → C, A → D, C → D, and the minimal basis is {A → C, C → D}.</p>
<table>
<thead><tr><th>X ⊆ {A, C, D}</th><th>X⁺ (with all FDs of R)</th><th>New FDs of R1 (keep only A, C, D)</th></tr></thead>
<tbody>
<tr><td>{A}</td><td>{A, B, C, D}</td><td>A → C, A → D (B is not in R1)</td></tr>
<tr><td>{C}</td><td>{C, D}</td><td>C → D</td></tr>
<tr><td>{D}</td><td>{D}</td><td>none</td></tr>
<tr><td>{A, C}, {A, D}, {A, C, D}</td><td>skipped: supersets of {A}, whose closure is everything</td><td>none</td></tr>
<tr><td>{C, D}</td><td>{C, D}</td><td>none</td></tr>
</tbody>
</table>
<p>T = {A → C, A → D, C → D}. A → D is redundant (A → C and C → D give it by transitivity), so the <strong>minimal basis is {A → C, C → D}</strong> — every closure above was recomputed by script and matches the slide.</p>
<p class="dap-an">✅ The key of R1 is {A}; the FD C → D has a left side that is not a superkey of R1, so R1 is not in BCNF — you will meet this test on slide 65.</p>
<div class="pitfall">Two classic slips: forgetting A → C (it only exists through B), or writing B → C among R1's FDs (B is not a column of R1).</div>`,
        `<p class="y-chinh">🎯 R(A, B, C, D) với A → B, B → C, C → D chiếu lên R1 = {A, C, D}: FD của R1 là A → C, A → D, C → D, và phủ tối thiểu là {A → C, C → D}.</p>
<table>
<thead><tr><th>X ⊆ {A, C, D}</th><th>X⁺ (tính bằng mọi FD của R)</th><th>FD mới của R1 (chỉ giữ A, C, D)</th></tr></thead>
<tbody>
<tr><td>{A}</td><td>{A, B, C, D}</td><td>A → C, A → D (B không có trong R1)</td></tr>
<tr><td>{C}</td><td>{C, D}</td><td>C → D</td></tr>
<tr><td>{D}</td><td>{D}</td><td>không có</td></tr>
<tr><td>{A, C}, {A, D}, {A, C, D}</td><td>bỏ qua: chứa {A}, mà bao đóng của {A} đã là tất cả</td><td>không có</td></tr>
<tr><td>{C, D}</td><td>{C, D}</td><td>không có</td></tr>
</tbody>
</table>
<p>T = {A → C, A → D, C → D}. A → D thừa (A → C và C → D bắc cầu ra nó), nên <strong>phủ tối thiểu là {A → C, C → D}</strong> — mọi bao đóng ở trên đã được script tính lại và khớp với slide.</p>
<p class="dap-an">✅ Khoá của R1 là {A}; FD C → D có vế trái không phải siêu khoá của R1, nên R1 không đạt BCNF — bạn sẽ gặp phép kiểm này ở slide 65.</p>
<div class="pitfall">Hai lỗi kinh điển: quên A → C (nó chỉ tồn tại nhờ đi qua B), hoặc ghi B → C vào FD của R1 (B không phải cột của R1).</div>`],
    ]),
    bi(`<h3>✅ Check yourself in 60 seconds</h3>
<ol>
<li>R(A, B, C, D), F = {AB → C, C → D}. Is AB a key? Is A?</li>
<li>From AB → C, can you conclude A → C?</li>
<li>Why can a minimal basis have more FDs than another minimal basis of the same F?</li>
<li>How do you prove that X → Y follows from F in one line?</li>
</ol>
<p class="dap-an">✅ <strong>Answers:</strong> (1) {A, B}⁺ = {A, B, C, D}, and neither {A}⁺ = {A} nor {B}⁺ = {B} is everything, so AB is a key and A is not. (2) No — only the right side may be split. (3) Minimal means "nothing inside can be removed", not "fewest FDs" (slide 13: 4 FDs and 3 FDs). (4) Compute X⁺ under F and check Y ⊆ X⁺.</p>
<p><strong>Next:</strong> lesson 4.B (anomalies, decomposition, 1NF and 2NF), then lesson 4.2 below for more key-finding practice.</p>`,
    `<h3>✅ Tự kiểm tra trong 60 giây</h3>
<ol>
<li>R(A, B, C, D), F = {AB → C, C → D}. AB có phải khoá không? A thì sao?</li>
<li>Từ AB → C có suy ra được A → C không?</li>
<li>Vì sao một phủ tối thiểu có thể nhiều FD hơn một phủ tối thiểu khác của cùng F?</li>
<li>Chứng minh X → Y suy ra từ F trong một dòng thế nào?</li>
</ol>
<p class="dap-an">✅ <strong>Đáp án:</strong> (1) {A, B}⁺ = {A, B, C, D}, còn {A}⁺ = {A} và {B}⁺ = {B} đều không phải tất cả, nên AB là khoá, A thì không. (2) Không — chỉ được tách vế phải. (3) Tối thiểu nghĩa là "không bỏ được gì bên trong", không phải "ít FD nhất" (slide 13: 4 FD và 3 FD). (4) Tính X⁺ theo F và kiểm Y ⊆ X⁺.</p>
<p><strong>Tiếp theo:</strong> bài 4.B (bất thường, phân rã, 1NF và 2NF), rồi bài 4.2 bên dưới để luyện thêm tìm khoá.</p>`),
    books([
      ['ullman', 'Ch.3 Design Theory for Relational Databases — §3.1 Functional Dependencies · §3.2 Rules About Functional Dependencies (§3.2.4 closure, Algorithm 3.7 · §3.2.7 closing sets of FDs · §3.2.8 projecting FDs, Algorithm 3.12)', 'Chương 3 Design Theory for Relational Databases — §3.1 Functional Dependencies · §3.2 Rules About Functional Dependencies (§3.2.4 bao đóng, thuật toán 3.7 · §3.2.7 phủ của tập FD · §3.2.8 chiếu FD, thuật toán 3.12)'],
      ['ramakrishnan', 'Ch.19 Schema Refinement and Normal Forms — §19.2 Functional Dependencies · §19.3 Reasoning about FDs (closure, attribute closure)', 'Chương 19 Schema Refinement and Normal Forms — §19.2 Functional Dependencies · §19.3 Reasoning about FDs (bao đóng tập FD, bao đóng thuộc tính)'],
    ]),
  ].join('\n'),
};

/* ───────── 4.B — 📑 Slide by slide · Anomalies, decomposition, 1NF & 2NF (Chapter 3, slides 20–38) ───────── */
const L_dbi4_2 = {
  title: '4.B — 📑 Slide by slide · Anomalies, decomposition, 1NF & 2NF (Chapter 3, slides 20–38)|||4.B — 📑 Học theo từng slide · Bất thường, phân rã, 1NF & 2NF (Chapter 3, slide 20–38)',
  slug: 'dbi202-slide-dbi4-2',
  type: 'VIDEO',
  description: 'Giảng từng slide 20–38 của bộ slide Chapter 3 của trường: dư thừa và bất thường cập nhật/xoá chạy thật trên bảng Movies1, định nghĩa phân rã, tách Movies1 rồi nối lại bằng SQL, ví dụ mất thông tin (nối sinh bộ giả) và mất phụ thuộc, bảng chase, phụ thuộc bộ phận/bắc cầu, 1NF và 2NF trên bảng StudentID của slide — có ô NATURAL JOIN của PostgreSQL.',
  content: [
    bi(`<span class="eyebrow">Chapter 4 · Lesson 4.B · school slides "Chapter 3", slides 20–38</span>
<h2>Why we split tables — anomalies, decomposition, 1NF and 2NF</h2>
<p class="lead">⚠️ This is still the school's <strong>"Chapter 3"</strong> deck (web Chapter 4). Slides 20–27 show what goes wrong in a table that holds too much (anomalies) and what can go wrong when you split it (lost information, lost dependencies). Slides 28–38 start the normal-form ladder on the student table used for the rest of the deck: 1NF, then 2NF.</p>
<div class="callout"><strong>After this lesson you can:</strong> name the three anomalies and show them with SQL, decompose a relation by projection and join it back, decide with a chase table whether a split loses information, recognise partial and transitive dependencies, and say why a table is not in 1NF or 2NF. Every SQL statement below was run on SQL Server; the results are the real output.</div>`,
    `<span class="eyebrow">Chương 4 · Bài 4.B · slide "Chapter 3" của trường, slide 20–38</span>
<h2>Vì sao phải tách bảng — bất thường, phân rã, 1NF và 2NF</h2>
<p class="lead">⚠️ Vẫn là bộ slide <strong>"Chapter 3"</strong> của trường (Chương 4 trên web). Slide 20–27 cho thấy chuyện gì hỏng trong một bảng chứa quá nhiều thứ (bất thường — anomaly) và chuyện gì có thể hỏng khi tách nó (mất thông tin, mất phụ thuộc). Slide 28–38 bắt đầu leo "bậc thang" dạng chuẩn trên bảng sinh viên dùng suốt phần còn lại của bộ slide: 1NF, rồi 2NF.</p>
<div class="callout"><strong>Học xong bài này bạn làm được:</strong> gọi tên ba loại bất thường và minh hoạ bằng SQL, phân rã một quan hệ bằng phép chiếu rồi nối lại, dùng bảng chase để quyết định phép tách có mất thông tin không, nhận ra phụ thuộc bộ phận và phụ thuộc bắc cầu, và nói vì sao một bảng không đạt 1NF hay 2NF. Mọi câu SQL bên dưới đã chạy trên SQL Server; bảng kết quả là output thật.</div>`),
    walkHead('dbi4', 20, 38),
    walk('dbi4', [
      [20, 'Anomalies introduction',
        `<p class="y-chinh">🎯 Cramming too much into one relation causes redundancy and the related problems called anomalies — this part of the deck is about avoiding them by design.</p>
<p>A table is "too much" when it mixes independent facts: facts about a film (length, genre, studio) and facts about who acted in it. Each film fact is then repeated once per star — and every repetition is a chance for the copies to disagree.</p>
<p class="meo">🧠 <strong>Remember:</strong> one fact, one place. Normalization is the systematic way to get there.</p>`,
        `<p class="y-chinh">🎯 Nhồi quá nhiều thứ vào một quan hệ gây ra dư thừa (redundancy) và các sự cố đi kèm gọi là bất thường (anomaly) — phần này của bộ slide bàn cách tránh chúng ngay từ thiết kế.</p>
<p>Một bảng "chứa quá nhiều" khi nó trộn các sự thật độc lập: sự thật về bộ phim (thời lượng, thể loại, hãng) và sự thật về ai đóng phim. Khi đó mỗi sự thật về phim bị lặp lại một lần cho mỗi ngôi sao — và mỗi bản lặp là một cơ hội để các bản sao "cãi nhau".</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> một sự thật, một chỗ. Chuẩn hoá (normalization) là cách làm có hệ thống để đạt được điều đó.</p>`],
      [21, 'Anomalies - redundancy, update, deletion',
        `<p class="y-chinh">🎯 In Movies1, length and genre are repeated per star (redundancy); changing one copy leaves the others wrong (update anomaly); deleting rows can erase unrelated facts (deletion anomaly).</p>
<p>The slide's own examples, run on the Movies1 table of slide 5. First the update anomaly: we learn Star Wars is 125 minutes and fix only the first tuple; then the deletion anomaly: we delete the only star of Gone With the Wind.</p>
<pre><code class="language-sql">-- Update anomaly: fix the length in ONE tuple only
UPDATE Movies1 SET length = 125
WHERE title = 'Star Wars' AND starName = 'Carrie Fisher';

SELECT title, year, length, starName
FROM Movies1 WHERE title = 'Star Wars';</code></pre>
<pre><code class="language-sql">-- Deletion anomaly: Vivien Leigh leaves the table
DELETE FROM Movies1 WHERE starName = 'Vivien Leigh';

SELECT COUNT(*) AS soPhimGoneWithTheWind   -- the film itself is gone
FROM Movies1 WHERE title = 'Gone With the Wind';</code></pre>
<div class="out">(6 rows affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>title</th><th>year</th><th>length</th><th>starName</th></tr></thead>
<tbody>
<tr><td>Star Wars</td><td>1977</td><td>125</td><td>Carrie Fisher</td></tr>
<tr><td>Star Wars</td><td>1977</td><td>124</td><td>Harrison Ford</td></tr>
<tr><td>Star Wars</td><td>1977</td><td>124</td><td>Mark Hamill</td></tr>
</tbody>
</table>
<div class="out">(1 row affected)</div>
<table>
<thead><tr><th>soPhimGoneWithTheWind</th></tr></thead>
<tbody>
<tr><td>0</td></tr>
</tbody>
</table>
<p>After the update, Star Wars is 124 minutes long and 125 minutes long at the same time. After the delete, Gone With the Wind — its year, length, genre and studio — has vanished, although we only wanted to remove an actress.</p>
<ul>
<li><code>UPDATE Movies1 SET length = 125 WHERE …</code> — change the column length to 125 in every row matching the <code>WHERE</code> condition; here the condition matches only Carrie Fisher's row, so "(1 row affected)".</li>
<li><code>DELETE FROM Movies1 WHERE starName = 'Vivien Leigh'</code> — remove the matching rows; <code>COUNT(*)</code> then counts the rows left for that film: 0.</li>
<li>Both statements are written the same way on PostgreSQL (it prints <code>UPDATE 1</code> / <code>DELETE 1</code> instead of "(1 row affected)").</li>
</ul>
<table>
<thead><tr><th>Anomaly</th><th>Cause in Movies1</th><th>Symptom</th></tr></thead>
<tbody>
<tr><td>Redundancy</td><td>title, year → length, genre, studioName, but the key is (title, year, starName)</td><td>124/SciFi/Fox stored 3 times</td></tr>
<tr><td>Update</td><td>the copies are independent rows</td><td>two different lengths for one film</td></tr>
<tr><td>Deletion</td><td>film facts only live next to a star</td><td>deleting the last star deletes the film</td></tr>
<tr><td>Insertion (not on the slide)</td><td>starName is part of the primary key</td><td>a film with no star yet cannot be stored</td></tr>
</tbody>
</table>
<div class="pitfall">The slide's deletion example ("delete Fox … no more studios for Star Wars") is short-hand for the same idea: when the last tuple carrying a fact goes, the fact goes with it. The clearer case is the one above (Vivien Leigh); slide 24 uses it too.</div>`,
        `<p class="y-chinh">🎯 Trong Movies1, length và genre lặp lại theo từng ngôi sao (dư thừa); sửa một bản sao thì các bản kia sai (bất thường cập nhật); xoá dòng có thể xoá mất sự thật không liên quan (bất thường xoá).</p>
<p>Chạy đúng các ví dụ của slide trên bảng Movies1 của slide 5. Trước hết là bất thường cập nhật (update anomaly): biết Star Wars dài 125 phút, ta chỉ sửa bộ đầu tiên; rồi bất thường xoá (deletion anomaly): xoá ngôi sao duy nhất của Gone With the Wind.</p>
<pre><code class="language-sql">-- Bất thường cập nhật: sửa length ở MỘT bộ thôi
UPDATE Movies1 SET length = 125
WHERE title = 'Star Wars' AND starName = 'Carrie Fisher';

SELECT title, year, length, starName
FROM Movies1 WHERE title = 'Star Wars';</code></pre>
<pre><code class="language-sql">-- Bất thường xoá: xoá Vivien Leigh
DELETE FROM Movies1 WHERE starName = 'Vivien Leigh';

SELECT COUNT(*) AS soPhimGoneWithTheWind   -- bộ phim cũng mất theo
FROM Movies1 WHERE title = 'Gone With the Wind';</code></pre>
<div class="out">(6 rows affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>title</th><th>year</th><th>length</th><th>starName</th></tr></thead>
<tbody>
<tr><td>Star Wars</td><td>1977</td><td>125</td><td>Carrie Fisher</td></tr>
<tr><td>Star Wars</td><td>1977</td><td>124</td><td>Harrison Ford</td></tr>
<tr><td>Star Wars</td><td>1977</td><td>124</td><td>Mark Hamill</td></tr>
</tbody>
</table>
<div class="out">(1 row affected)</div>
<table>
<thead><tr><th>soPhimGoneWithTheWind</th></tr></thead>
<tbody>
<tr><td>0</td></tr>
</tbody>
</table>
<p>Sau câu UPDATE, Star Wars vừa dài 124 phút vừa dài 125 phút. Sau câu DELETE, Gone With the Wind — năm, thời lượng, thể loại, hãng phim — biến mất, dù ta chỉ muốn xoá một nữ diễn viên.</p>
<ul>
<li><code>UPDATE Movies1 SET length = 125 WHERE …</code> — đổi cột length thành 125 ở mọi dòng thoả điều kiện <code>WHERE</code>; ở đây điều kiện chỉ khớp dòng của Carrie Fisher, nên báo "(1 row affected)" — 1 dòng bị ảnh hưởng.</li>
<li><code>DELETE FROM Movies1 WHERE starName = 'Vivien Leigh'</code> — xoá các dòng khớp điều kiện; <code>COUNT(*)</code> sau đó đếm số dòng còn lại của bộ phim đó: 0.</li>
<li>Cả hai câu viết y hệt trên PostgreSQL (nó in <code>UPDATE 1</code> / <code>DELETE 1</code> thay vì "(1 row affected)").</li>
</ul>
<table>
<thead><tr><th>Bất thường</th><th>Nguyên nhân trong Movies1</th><th>Triệu chứng</th></tr></thead>
<tbody>
<tr><td>Dư thừa (redundancy)</td><td>title, year → length, genre, studioName, nhưng khoá là (title, year, starName)</td><td>124/SciFi/Fox lưu 3 lần</td></tr>
<tr><td>Cập nhật (update)</td><td>các bản sao là những dòng độc lập</td><td>một phim có hai thời lượng khác nhau</td></tr>
<tr><td>Xoá (deletion)</td><td>thông tin phim chỉ sống cạnh một ngôi sao</td><td>xoá ngôi sao cuối cùng là xoá luôn phim</td></tr>
<tr><td>Chèn (insertion — slide không nêu)</td><td>starName nằm trong khoá chính</td><td>phim chưa có ngôi sao nào thì không lưu được</td></tr>
</tbody>
</table>
<div class="pitfall">Ví dụ xoá trên slide ("xoá Fox … Star Wars không còn hãng phim") là cách nói tắt của cùng một ý: khi bộ cuối cùng mang một sự thật bị xoá, sự thật đó mất theo. Ví dụ rõ hơn là ví dụ ở trên (Vivien Leigh); slide 24 cũng dùng nó.</div>`],
      [22, 'Decomposition - definition',
        `<p class="y-chinh">🎯 Decomposing R(A1…An) means splitting its attributes into S(B1…Bm) and T(C1…Ck) with {A} = {B} ∪ {C}, S = πB(R) and T = πC(R).</p>
<ul>
<li>Every attribute of R must appear in at least one of S, T (the union is all of R); they normally share some attributes — the shared ones are how we join back.</li>
<li>The tuples of S and T are <strong>projections</strong> of R: duplicates collapse, which is exactly where the redundancy disappears.</li>
<li>Decomposition is the accepted cure for anomalies; slides 25–27 show that a careless one creates new problems.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> decompose = project; recompose = natural join on the shared attributes.</p>`,
        `<p class="y-chinh">🎯 Phân rã (decompose) R(A1…An) là chia các thuộc tính của nó thành S(B1…Bm) và T(C1…Ck) với {A} = {B} ∪ {C}, S = πB(R) và T = πC(R).</p>
<ul>
<li>Mỗi thuộc tính của R phải nằm trong ít nhất một trong S, T (hợp lại là cả R); thường chúng có chung vài thuộc tính — phần chung đó là cách để nối lại.</li>
<li>Các bộ của S và T là <strong>phép chiếu</strong> (projection) của R: các bộ trùng gộp lại, và đó chính là chỗ dư thừa biến mất.</li>
<li>Phân rã là cách chữa bất thường được chấp nhận; slide 25–27 cho thấy phân rã cẩu thả lại sinh ra vấn đề mới.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> phân rã = chiếu; ghép lại = nối tự nhiên (natural join) theo các thuộc tính chung.</p>`],
      [23, 'Example - Decomposition of Movies1',
        `<p class="y-chinh">🎯 Movies1 is split into (title, year, length, genre, studioName) and (title, year, starName); the three Star Wars rows collapse into one in the first table.</p>
<p>The picture on the slide is exactly two projections. In SQL a projection is <code>SELECT DISTINCT</code> of the columns (the <code>DISTINCT</code> matters — without it the duplicates stay):</p>
<pre><code class="language-sql">-- S = projection on title, year, length, genre, studioName
SELECT DISTINCT title, year, length, genre, studioName
INTO Movies2
FROM Movies1;
-- T = projection on title, year, starName
SELECT DISTINCT title, year, starName
INTO StarsIn
FROM Movies1;

SELECT * FROM Movies2;
SELECT * FROM StarsIn;</code></pre>
<pre><code class="language-sql">-- Join back on the shared attributes title, year
SELECT m.title, m.year, m.length, m.genre, m.studioName, s.starName
INTO Rejoined
FROM Movies2 m JOIN StarsIn s ON m.title = s.title AND m.year = s.year;

SELECT (SELECT COUNT(*) FROM Rejoined) AS soDongNoiLai,
       (SELECT COUNT(*) FROM (SELECT * FROM Rejoined EXCEPT SELECT * FROM Movies1) x) AS thuaRa,
       (SELECT COUNT(*) FROM (SELECT * FROM Movies1 EXCEPT SELECT * FROM Rejoined) y) AS thieuDi;</code></pre>
<div class="out">(6 rows affected)<br>
(3 rows affected)<br>
(6 rows affected)</div>
<table>
<thead><tr><th>title</th><th>year</th><th>length</th><th>genre</th><th>studioName</th></tr></thead>
<tbody>
<tr><td>Gone With the Wind</td><td>1939</td><td>231</td><td>drama</td><td>MGM</td></tr>
<tr><td>Star Wars</td><td>1977</td><td>124</td><td>SciFi</td><td>Fox</td></tr>
<tr><td>Wayne's World</td><td>1992</td><td>95</td><td>comedy</td><td>Paramount</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>title</th><th>year</th><th>starName</th></tr></thead>
<tbody>
<tr><td>Gone With the Wind</td><td>1939</td><td>Vivien Leigh</td></tr>
<tr><td>Star Wars</td><td>1977</td><td>Carrie Fisher</td></tr>
<tr><td>Star Wars</td><td>1977</td><td>Harrison Ford</td></tr>
<tr><td>Star Wars</td><td>1977</td><td>Mark Hamill</td></tr>
<tr><td>Wayne's World</td><td>1992</td><td>Dana Carvey</td></tr>
<tr><td>Wayne's World</td><td>1992</td><td>Mike Meyers</td></tr>
</tbody>
</table>
<div class="out">(6 rows affected)</div>
<table>
<thead><tr><th>soDongNoiLai</th><th>thuaRa</th><th>thieuDi</th></tr></thead>
<tbody>
<tr><td>6</td><td>0</td><td>0</td></tr>
</tbody>
</table>
<p>The last row is the proof that this split is safe: joining the two pieces on (title, year) gives back 6 rows, none extra and none missing. It works because the shared attributes {title, year} are a key of the first piece (title, year → length, genre, studioName).</p>
<ul>
<li><code>SELECT DISTINCT … INTO Movies2 FROM Movies1</code> — T-SQL shortcut: create a new table Movies2 and fill it with the result of the query (distinct rows only).</li>
<li><code>FROM Movies2 m JOIN StarsIn s ON m.title = s.title AND m.year = s.year</code> — pair every film row with every StarsIn row having the same title and year; <code>m</code> and <code>s</code> are short aliases.</li>
<li><code>A EXCEPT B</code> — the rows of A that are not in B. Both differences are 0 ⇒ the join equals the original table.</li>
</ul>
<div class="callout">🐘 <strong>On PostgreSQL</strong> (what you will type at work) the usual way to create a table from a query is <code>CREATE TABLE … AS SELECT …</code>; <code>JOIN … USING (title, year)</code> is a shorter form of the ON condition when the columns have the same names.
<pre><code class="language-sql">CREATE TABLE movies1 (title VARCHAR(40), year INT, length INT, genre VARCHAR(10),
  studio_name VARCHAR(20), star_name VARCHAR(30), PRIMARY KEY (title, year, star_name));
INSERT INTO movies1 VALUES
 ('Star Wars', 1977, 124, 'SciFi', 'Fox', 'Carrie Fisher'),
 ('Star Wars', 1977, 124, 'SciFi', 'Fox', 'Mark Hamill'),
 ('Star Wars', 1977, 124, 'SciFi', 'Fox', 'Harrison Ford'),
 ('Gone With the Wind', 1939, 231, 'drama', 'MGM', 'Vivien Leigh'),
 ('Wayne''s World', 1992, 95, 'comedy', 'Paramount', 'Dana Carvey'),
 ('Wayne''s World', 1992, 95, 'comedy', 'Paramount', 'Mike Meyers');
-- PostgreSQL style: CREATE TABLE ... AS SELECT
CREATE TABLE movies2 AS
  SELECT DISTINCT title, year, length, genre, studio_name FROM movies1;
CREATE TABLE stars_in AS
  SELECT DISTINCT title, year, star_name FROM movies1;

SELECT (SELECT count(*) FROM movies2) AS so_phim,
       (SELECT count(*) FROM stars_in) AS so_dong_stars_in,
       (SELECT count(*) FROM movies2 JOIN stars_in USING (title, year)) AS noi_lai;</code></pre>
<div class="out">INSERT 0 6</div>
<table>
<thead><tr><th>so_phim</th><th>so_dong_stars_in</th><th>noi_lai</th></tr></thead>
<tbody>
<tr><td>3</td><td>6</td><td>6</td></tr>
</tbody>
</table>
3 films, 6 StarsIn rows, and the join gives back 6 rows. Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-4-alter-chuan-hoa">PostgreSQL 3.4 — ALTER TABLE &amp; normalization</a>.</div>
<p class="meo">🧠 <strong>The same split seen as an ERD:</strong> Movies1 hid an entity <em>Movie</em> (key title, year) and a many-to-many relationship <em>StarsIn</em> between movies and stars. Draw Movie as a rectangle with its attributes and StarsIn as a diamond, convert the ERD to tables (web Chapter 3) — and you get exactly these two tables.</p>`,
        `<p class="y-chinh">🎯 Movies1 được tách thành (title, year, length, genre, studioName) và (title, year, starName); ba dòng Star Wars gộp thành một trong bảng thứ nhất.</p>
<p>Hình trên slide chính là hai phép chiếu. Trong SQL, phép chiếu là <code>SELECT DISTINCT</code> các cột (chữ <code>DISTINCT</code> quan trọng — thiếu nó các dòng trùng vẫn còn):</p>
<pre><code class="language-sql">-- S = phép chiếu lên title, year, length, genre, studioName
SELECT DISTINCT title, year, length, genre, studioName
INTO Movies2
FROM Movies1;
-- T = phép chiếu lên title, year, starName
SELECT DISTINCT title, year, starName
INTO StarsIn
FROM Movies1;

SELECT * FROM Movies2;
SELECT * FROM StarsIn;</code></pre>
<pre><code class="language-sql">-- Nối lại theo thuộc tính chung title, year
SELECT m.title, m.year, m.length, m.genre, m.studioName, s.starName
INTO Rejoined
FROM Movies2 m JOIN StarsIn s ON m.title = s.title AND m.year = s.year;

SELECT (SELECT COUNT(*) FROM Rejoined) AS soDongNoiLai,
       (SELECT COUNT(*) FROM (SELECT * FROM Rejoined EXCEPT SELECT * FROM Movies1) x) AS thuaRa,
       (SELECT COUNT(*) FROM (SELECT * FROM Movies1 EXCEPT SELECT * FROM Rejoined) y) AS thieuDi;</code></pre>
<div class="out">(6 rows affected)<br>
(3 rows affected)<br>
(6 rows affected)</div>
<table>
<thead><tr><th>title</th><th>year</th><th>length</th><th>genre</th><th>studioName</th></tr></thead>
<tbody>
<tr><td>Gone With the Wind</td><td>1939</td><td>231</td><td>drama</td><td>MGM</td></tr>
<tr><td>Star Wars</td><td>1977</td><td>124</td><td>SciFi</td><td>Fox</td></tr>
<tr><td>Wayne's World</td><td>1992</td><td>95</td><td>comedy</td><td>Paramount</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>title</th><th>year</th><th>starName</th></tr></thead>
<tbody>
<tr><td>Gone With the Wind</td><td>1939</td><td>Vivien Leigh</td></tr>
<tr><td>Star Wars</td><td>1977</td><td>Carrie Fisher</td></tr>
<tr><td>Star Wars</td><td>1977</td><td>Harrison Ford</td></tr>
<tr><td>Star Wars</td><td>1977</td><td>Mark Hamill</td></tr>
<tr><td>Wayne's World</td><td>1992</td><td>Dana Carvey</td></tr>
<tr><td>Wayne's World</td><td>1992</td><td>Mike Meyers</td></tr>
</tbody>
</table>
<div class="out">(6 rows affected)</div>
<table>
<thead><tr><th>soDongNoiLai</th><th>thuaRa</th><th>thieuDi</th></tr></thead>
<tbody>
<tr><td>6</td><td>0</td><td>0</td></tr>
</tbody>
</table>
<p>Dòng cuối là bằng chứng phép tách này an toàn: nối hai mảnh theo (title, year) cho lại đúng 6 dòng, không thừa không thiếu. Nó đúng vì phần chung {title, year} là khoá của mảnh thứ nhất (title, year → length, genre, studioName).</p>
<ul>
<li><code>SELECT DISTINCT … INTO Movies2 FROM Movies1</code> — lối tắt của T-SQL: tạo bảng mới Movies2 và đổ vào đó kết quả truy vấn (chỉ các dòng khác nhau).</li>
<li><code>FROM Movies2 m JOIN StarsIn s ON m.title = s.title AND m.year = s.year</code> — ghép mỗi dòng phim với mọi dòng StarsIn có cùng title và year; <code>m</code> và <code>s</code> là bí danh (alias) cho gọn.</li>
<li><code>A EXCEPT B</code> — các dòng của A mà B không có. Cả hai hiệu đều bằng 0 ⇒ kết quả nối bằng đúng bảng gốc.</li>
</ul>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> (thứ bạn sẽ gõ khi đi làm) cách thường dùng để tạo bảng từ một truy vấn là <code>CREATE TABLE … AS SELECT …</code>; <code>JOIN … USING (title, year)</code> là dạng viết ngắn của điều kiện ON khi hai cột cùng tên.
<pre><code class="language-sql">CREATE TABLE movies1 (title VARCHAR(40), year INT, length INT, genre VARCHAR(10),
  studio_name VARCHAR(20), star_name VARCHAR(30), PRIMARY KEY (title, year, star_name));
INSERT INTO movies1 VALUES
 ('Star Wars', 1977, 124, 'SciFi', 'Fox', 'Carrie Fisher'),
 ('Star Wars', 1977, 124, 'SciFi', 'Fox', 'Mark Hamill'),
 ('Star Wars', 1977, 124, 'SciFi', 'Fox', 'Harrison Ford'),
 ('Gone With the Wind', 1939, 231, 'drama', 'MGM', 'Vivien Leigh'),
 ('Wayne''s World', 1992, 95, 'comedy', 'Paramount', 'Dana Carvey'),
 ('Wayne''s World', 1992, 95, 'comedy', 'Paramount', 'Mike Meyers');
-- Kiểu PostgreSQL: CREATE TABLE ... AS SELECT
CREATE TABLE movies2 AS
  SELECT DISTINCT title, year, length, genre, studio_name FROM movies1;
CREATE TABLE stars_in AS
  SELECT DISTINCT title, year, star_name FROM movies1;

SELECT (SELECT count(*) FROM movies2) AS so_phim,
       (SELECT count(*) FROM stars_in) AS so_dong_stars_in,
       (SELECT count(*) FROM movies2 JOIN stars_in USING (title, year)) AS noi_lai;</code></pre>
<div class="out">INSERT 0 6</div>
<table>
<thead><tr><th>so_phim</th><th>so_dong_stars_in</th><th>noi_lai</th></tr></thead>
<tbody>
<tr><td>3</td><td>6</td><td>6</td></tr>
</tbody>
</table>
3 phim, 6 dòng StarsIn, và phép nối cho lại 6 dòng. Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-4-alter-chuan-hoa">PostgreSQL 3.4 — ALTER TABLE &amp; chuẩn hoá</a>.</div>
<p class="meo">🧠 <strong>Cùng phép tách, nhìn bằng ERD:</strong> Movies1 giấu một thực thể (entity) <em>Movie</em> (khoá title, year) và một liên kết nhiều–nhiều (many-to-many relationship) <em>StarsIn</em> giữa phim và ngôi sao. Vẽ Movie thành hình chữ nhật kèm thuộc tính, StarsIn thành hình thoi, chuyển ERD sang bảng (Chương 3 trên web) — bạn được đúng hai bảng này.</p>`],
      [24, 'Discuss - what the decomposition fixed',
        `<p class="y-chinh">🎯 After the split, each film's length appears once, so the redundancy, the update anomaly and the deletion anomaly are all gone.</p>
<table>
<thead><tr><th>Problem in Movies1</th><th>After the split</th></tr></thead>
<tbody>
<tr><td>length/genre stored once per star</td><td>stored once per film (3 rows instead of 6)</td></tr>
<tr><td>update Star Wars' length in 3 rows</td><td>one UPDATE on one row</td></tr>
<tr><td>deleting the stars of Gone With the Wind deletes the film</td><td>the film stays in the left table</td></tr>
</tbody>
</table>
<p>Both pieces are in BCNF (slides 67 and 68 say so), so no FD inside them can create a new anomaly.</p>`,
        `<p class="y-chinh">🎯 Sau khi tách, thời lượng mỗi phim chỉ xuất hiện một lần, nên dư thừa, bất thường cập nhật và bất thường xoá đều biến mất.</p>
<table>
<thead><tr><th>Vấn đề trong Movies1</th><th>Sau khi tách</th></tr></thead>
<tbody>
<tr><td>length/genre lưu một lần cho mỗi ngôi sao</td><td>lưu một lần cho mỗi phim (3 dòng thay vì 6)</td></tr>
<tr><td>sửa thời lượng Star Wars ở 3 dòng</td><td>một câu UPDATE trên một dòng</td></tr>
<tr><td>xoá các ngôi sao của Gone With the Wind là xoá luôn phim</td><td>phim vẫn nằm ở bảng bên trái</td></tr>
</tbody>
</table>
<p>Cả hai mảnh đều đạt BCNF (slide 67 và 68 nói vậy), nên không FD nào bên trong chúng còn gây ra bất thường mới.</p>`],
      [25, 'Decomposition - The Good, Bad and Ugly',
        `<p class="y-chinh">🎯 The good: decomposition removes anomalies. The bad: we may not be able to recover the original data, or the original FDs may no longer be enforceable.</p>
<table>
<thead><tr><th>Property</th><th>Question</th><th>Test</th><th>Slide</th></tr></thead>
<tbody>
<tr><td>Lossless join</td><td>does joining the pieces give back exactly R?</td><td>chase table, or for two pieces: R1 ∩ R2 → R1 or R1 ∩ R2 → R2</td><td>26</td></tr>
<tr><td>Dependency preservation</td><td>can every FD of R be checked inside one piece?</td><td>project F onto each piece, check F follows from the union</td><td>27</td></tr>
</tbody>
</table>
<p>BCNF decomposition (slide 70) always gives a lossless join but may lose dependencies; 3NF synthesis (slide 71) keeps both.</p>`,
        `<p class="y-chinh">🎯 Cái tốt: phân rã xoá bất thường. Cái xấu: có thể không khôi phục được dữ liệu gốc, hoặc các FD gốc không còn kiểm được nữa.</p>
<table>
<thead><tr><th>Tính chất</th><th>Câu hỏi</th><th>Cách kiểm</th><th>Slide</th></tr></thead>
<tbody>
<tr><td>Nối không mất thông tin (lossless join)</td><td>nối các mảnh có cho lại đúng R không?</td><td>bảng chase, hoặc với hai mảnh: R1 ∩ R2 → R1 hay R1 ∩ R2 → R2</td><td>26</td></tr>
<tr><td>Bảo toàn phụ thuộc (dependency preservation)</td><td>mọi FD của R có kiểm được trong một mảnh không?</td><td>chiếu F lên từng mảnh, kiểm F suy ra được từ hợp của chúng</td><td>27</td></tr>
</tbody>
</table>
<p>Phân rã BCNF (slide 70) luôn nối không mất thông tin nhưng có thể mất phụ thuộc; tổng hợp 3NF (slide 71) giữ được cả hai.</p>`],
      [26, 'Example - Loss of information after decomposition',
        `<p class="y-chinh">🎯 R(A, B, C) = {(1,2,3), (4,2,5)} split into R1(A, B) and R2(B, C) joins back to 4 tuples: two of them are spurious, so information is lost.</p>
<pre><code class="language-sql">CREATE TABLE R (A INT, B INT, C INT);
INSERT INTO R VALUES (1, 2, 3), (4, 2, 5);   -- the relation R of slide 26
SELECT DISTINCT A, B INTO R1 FROM R;          -- R1 = πA,B(R)
SELECT DISTINCT B, C INTO R2 FROM R;          -- R2 = πB,C(R)
-- R3 = R1 natural join R2 (common attribute B)
SELECT R1.A, R1.B, R2.C
FROM R1 JOIN R2 ON R1.B = R2.B
ORDER BY A, C;</code></pre>
<div class="out">(2 rows affected)<br>
(2 rows affected)<br>
(2 rows affected)</div>
<table>
<thead><tr><th>A</th><th>B</th><th>C</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td><td>3</td></tr>
<tr><td>1</td><td>2</td><td>5</td></tr>
<tr><td>4</td><td>2</td><td>3</td></tr>
<tr><td>4</td><td>2</td><td>5</td></tr>
</tbody>
</table>
<p><code>SELECT DISTINCT A, B INTO R1 FROM R</code> builds the projection πA,B(R) as a new table; the last query joins the two pieces on their only common column B and sorts the result (<code>ORDER BY</code>) so it is easy to compare with R.</p>
<p>Both tuples share B = 2, so each A value pairs with each C value. The slide writes "R3 = R1 X R2 (but R3 &lt;&gt; R1)": read it as <strong>R3 = R1 ⋈ R2 and R3 ≠ R</strong> — a natural join on B (it happens to look like a product because all B values are equal), compared with the original R, not R1.</p>
<p class="nhan">The chase test (Ullman §3.4.2) says the same without data — one row per piece, "a" = known value, "b1, b2…" = unknown</p>
<table>
<thead><tr><th>Row</th><th>A</th><th>B</th><th>C</th><th>comment</th></tr></thead>
<tbody>
<tr><td>from R1(A, B)</td><td>a</td><td>b</td><td>c1</td><td>C unknown</td></tr>
<tr><td>from R2(B, C)</td><td>a2</td><td>b</td><td>c</td><td>A unknown</td></tr>
</tbody>
</table>
<p>The two rows agree on B, but no FD B → A or B → C is given, so no symbol can be equated. No row becomes all "a" ⇒ <strong>lossy</strong>. With B → C, row 1 would get c and become (a, b, c) ⇒ lossless — that is the rule "the shared attributes must determine one side".</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong> the natural join has its own keyword; SQL Server has no <code>NATURAL JOIN</code>, so there you must write <code>JOIN … ON R1.B = R2.B</code>.
<pre><code class="language-sql">CREATE TABLE r (a INT, b INT, c INT);
INSERT INTO r VALUES (1, 2, 3), (4, 2, 5);
CREATE TABLE r1 AS SELECT DISTINCT a, b FROM r;
CREATE TABLE r2 AS SELECT DISTINCT b, c FROM r;
-- PostgreSQL has NATURAL JOIN: it matches every column with the same name
SELECT * FROM r1 NATURAL JOIN r2 ORDER BY a, c;</code></pre>
<div class="out">INSERT 0 2</div>
<table>
<thead><tr><th>b</th><th>a</th><th>c</th></tr></thead>
<tbody>
<tr><td>2</td><td>1</td><td>3</td></tr>
<tr><td>2</td><td>1</td><td>5</td></tr>
<tr><td>2</td><td>4</td><td>3</td></tr>
<tr><td>2</td><td>4</td><td>5</td></tr>
</tbody>
</table>
Note the column order: <code>NATURAL JOIN</code> puts the common column b first. Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-5-1-inner-join">PostgreSQL 5.1 — INNER JOIN</a>.</div>
<div class="pitfall">A lossy join gives <strong>more</strong> rows, not fewer — the "loss" is that you can no longer tell which rows are real. An FE option "the join loses tuples" is wrong.</div>`,
        `<p class="y-chinh">🎯 R(A, B, C) = {(1,2,3), (4,2,5)} tách thành R1(A, B) và R2(B, C) nối lại được 4 bộ: hai bộ là bộ giả (spurious tuple), nên thông tin bị mất.</p>
<pre><code class="language-sql">CREATE TABLE R (A INT, B INT, C INT);
INSERT INTO R VALUES (1, 2, 3), (4, 2, 5);   -- quan hệ R của slide 26
SELECT DISTINCT A, B INTO R1 FROM R;          -- R1 = πA,B(R)
SELECT DISTINCT B, C INTO R2 FROM R;          -- R2 = πB,C(R)
-- R3 = R1 ⋈ R2 (thuộc tính chung B)
SELECT R1.A, R1.B, R2.C
FROM R1 JOIN R2 ON R1.B = R2.B
ORDER BY A, C;</code></pre>
<div class="out">(2 rows affected)<br>
(2 rows affected)<br>
(2 rows affected)</div>
<table>
<thead><tr><th>A</th><th>B</th><th>C</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td><td>3</td></tr>
<tr><td>1</td><td>2</td><td>5</td></tr>
<tr><td>4</td><td>2</td><td>3</td></tr>
<tr><td>4</td><td>2</td><td>5</td></tr>
</tbody>
</table>
<p><code>SELECT DISTINCT A, B INTO R1 FROM R</code> dựng phép chiếu πA,B(R) thành một bảng mới; câu cuối nối hai mảnh theo cột chung duy nhất B và sắp xếp kết quả (<code>ORDER BY</code>) cho dễ so với R.</p>
<p>Hai bộ có chung B = 2, nên mỗi giá trị A ghép với mỗi giá trị C. Slide viết "R3 = R1 X R2 (but R3 &lt;&gt; R1)": hãy đọc là <strong>R3 = R1 ⋈ R2 và R3 ≠ R</strong> — phép nối tự nhiên theo B (trông giống tích Descartes chỉ vì mọi giá trị B đều bằng nhau), và so với R gốc chứ không phải R1.</p>
<p class="nhan">Phép kiểm chase (Ullman §3.4.2) nói cùng điều đó mà không cần dữ liệu — mỗi mảnh một dòng, "a" = giá trị đã biết, "b1, b2…" = chưa biết</p>
<table>
<thead><tr><th>Dòng</th><th>A</th><th>B</th><th>C</th><th>ghi chú</th></tr></thead>
<tbody>
<tr><td>từ R1(A, B)</td><td>a</td><td>b</td><td>c1</td><td>chưa biết C</td></tr>
<tr><td>từ R2(B, C)</td><td>a2</td><td>b</td><td>c</td><td>chưa biết A</td></tr>
</tbody>
</table>
<p>Hai dòng bằng nhau trên B, nhưng không có FD B → A hay B → C nào, nên không đồng nhất được ký hiệu nào. Không dòng nào thành toàn "a" ⇒ <strong>mất thông tin (lossy)</strong>. Nếu có B → C thì dòng 1 nhận c và thành (a, b, c) ⇒ không mất thông tin (lossless) — đó chính là luật "phần chung phải xác định được một bên".</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> phép nối tự nhiên có từ khoá riêng; SQL Server không có <code>NATURAL JOIN</code>, nên ở đó phải viết <code>JOIN … ON R1.B = R2.B</code>.
<pre><code class="language-sql">CREATE TABLE r (a INT, b INT, c INT);
INSERT INTO r VALUES (1, 2, 3), (4, 2, 5);
CREATE TABLE r1 AS SELECT DISTINCT a, b FROM r;
CREATE TABLE r2 AS SELECT DISTINCT b, c FROM r;
-- PostgreSQL có NATURAL JOIN: tự nối theo mọi cột trùng tên
SELECT * FROM r1 NATURAL JOIN r2 ORDER BY a, c;</code></pre>
<div class="out">INSERT 0 2</div>
<table>
<thead><tr><th>b</th><th>a</th><th>c</th></tr></thead>
<tbody>
<tr><td>2</td><td>1</td><td>3</td></tr>
<tr><td>2</td><td>1</td><td>5</td></tr>
<tr><td>2</td><td>4</td><td>3</td></tr>
<tr><td>2</td><td>4</td><td>5</td></tr>
</tbody>
</table>
Để ý thứ tự cột: <code>NATURAL JOIN</code> đưa cột chung b lên đầu. Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-5-1-inner-join">PostgreSQL 5.1 — INNER JOIN</a>.</div>
<div class="pitfall">Nối mất thông tin cho ra <strong>nhiều</strong> dòng hơn chứ không ít hơn — "mất" ở đây là không còn phân biệt được dòng nào là thật. Phương án FE "phép nối làm mất bộ" là SAI.</div>`],
      [27, 'Example - Dependency Loss',
        `<p class="y-chinh">🎯 Even a lossless decomposition can lose an FD: each piece satisfies its own projected FDs, yet the joined result violates an original FD.</p>
<p>The slide asks the question without an example; here is the standard one (Ullman §3.4.4). Bookings(title, theater, city) with <strong>theater → city</strong> and <strong>title, city → theater</strong> (a film plays in at most one theater per city). Keys: {title, theater} and {title, city}. theater → city violates BCNF, so BCNF splits it into TheaterCity(theater, city) and TitleTheater(title, theater) — lossless, since theater is a key of TheaterCity.</p>
<pre><code class="language-sql">-- Bookings(title, theater, city): theater -&gt; city ; title, city -&gt; theater
-- BCNF split: TheaterCity(theater, city) + TitleTheater(title, theater)
CREATE TABLE TheaterCity (
  theater VARCHAR(20) PRIMARY KEY,           -- theater -&gt; city is enforced here
  city    VARCHAR(20)
);
CREATE TABLE TitleTheater (
  title   VARCHAR(20),
  theater VARCHAR(20) REFERENCES TheaterCity(theater),
  PRIMARY KEY (title, theater)               -- no FD to enforce, any pair is legal
);
INSERT INTO TheaterCity  VALUES ('Guild', 'Menlo Park'), ('Park', 'Menlo Park');
INSERT INTO TitleTheater VALUES ('Star Wars', 'Guild'), ('Star Wars', 'Park');</code></pre>
<pre><code class="language-sql">-- Both tables are legal. Join them and test title, city -&gt; theater
SELECT t.title, c.city, COUNT(*) AS soRap
FROM TitleTheater t JOIN TheaterCity c ON t.theater = c.theater
GROUP BY t.title, c.city
HAVING COUNT(DISTINCT t.theater) &gt; 1;</code></pre>
<div class="out">(2 rows affected)<br>
(2 rows affected)</div>
<table>
<thead><tr><th>title</th><th>city</th><th>soRap</th></tr></thead>
<tbody>
<tr><td>Star Wars</td><td>Menlo Park</td><td>2</td></tr>
</tbody>
</table>
<p>Each table accepted its rows (theater is unique in TheaterCity; TitleTheater has no FD left to check), but the join shows Star Wars in two theaters of Menlo Park: <strong>title, city → theater is lost</strong> — no single table contains title, city and theater together, so no constraint can enforce it without a join.</p>
<ul>
<li><code>theater VARCHAR(20) PRIMARY KEY</code> — a primary key refuses duplicates, so one theater can have only one city: this is how a table enforces an FD (key → everything).</li>
<li><code>REFERENCES TheaterCity(theater)</code> — a foreign key: every theater used in TitleTheater must exist in TheaterCity.</li>
<li>The last query is the FD test of slide 5 on the joined result: the group (Star Wars, Menlo Park) has 2 different theaters.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> lossless is about the <em>data</em> coming back; dependency preservation is about the <em>rules</em> still being checkable. BCNF guarantees the first, not the second.</p>`,
        `<p class="y-chinh">🎯 Ngay cả phân rã không mất thông tin vẫn có thể mất một FD: mỗi mảnh thoả các FD chiếu của nó, vậy mà kết quả nối lại vi phạm một FD gốc.</p>
<p>Slide chỉ đặt câu hỏi, không có ví dụ; đây là ví dụ chuẩn (Ullman §3.4.4). Bookings(title, theater, city) với <strong>theater → city</strong> và <strong>title, city → theater</strong> (một phim chiếu tối đa ở một rạp trong mỗi thành phố). Khoá: {title, theater} và {title, city}. theater → city vi phạm BCNF, nên phân rã BCNF tách thành TheaterCity(theater, city) và TitleTheater(title, theater) — không mất thông tin, vì theater là khoá của TheaterCity.</p>
<pre><code class="language-sql">-- Bookings(title, theater, city): theater → city ; title, city → theater
-- Tách BCNF: TheaterCity(theater, city) + TitleTheater(title, theater)
CREATE TABLE TheaterCity (
  theater VARCHAR(20) PRIMARY KEY,           -- theater → city được giữ ở đây
  city    VARCHAR(20)
);
CREATE TABLE TitleTheater (
  title   VARCHAR(20),
  theater VARCHAR(20) REFERENCES TheaterCity(theater),
  PRIMARY KEY (title, theater)               -- không còn FD nào để giữ, cặp nào cũng hợp lệ
);
INSERT INTO TheaterCity  VALUES ('Guild', 'Menlo Park'), ('Park', 'Menlo Park');
INSERT INTO TitleTheater VALUES ('Star Wars', 'Guild'), ('Star Wars', 'Park');</code></pre>
<pre><code class="language-sql">-- Hai bảng đều hợp lệ. Nối lại rồi kiểm title, city → theater
SELECT t.title, c.city, COUNT(*) AS soRap
FROM TitleTheater t JOIN TheaterCity c ON t.theater = c.theater
GROUP BY t.title, c.city
HAVING COUNT(DISTINCT t.theater) &gt; 1;</code></pre>
<div class="out">(2 rows affected)<br>
(2 rows affected)</div>
<table>
<thead><tr><th>title</th><th>city</th><th>soRap</th></tr></thead>
<tbody>
<tr><td>Star Wars</td><td>Menlo Park</td><td>2</td></tr>
</tbody>
</table>
<p>Mỗi bảng đều nhận các dòng của nó (theater là duy nhất trong TheaterCity; TitleTheater không còn FD nào để kiểm), nhưng phép nối cho thấy Star Wars chiếu ở hai rạp của Menlo Park: <strong>title, city → theater đã bị mất</strong> — không bảng nào chứa đủ title, city và theater, nên không ràng buộc nào giữ được nó mà không phải nối bảng.</p>
<ul>
<li><code>theater VARCHAR(20) PRIMARY KEY</code> — khoá chính không cho trùng, nên một rạp chỉ có một thành phố: đây là cách một bảng giữ một FD (khoá → mọi thứ).</li>
<li><code>REFERENCES TheaterCity(theater)</code> — khoá ngoại: rạp nào dùng trong TitleTheater cũng phải có trong TheaterCity.</li>
<li>Câu cuối là phép kiểm FD của slide 5 trên kết quả nối: nhóm (Star Wars, Menlo Park) có 2 rạp khác nhau.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> lossless nói về <em>dữ liệu</em> quay về được; bảo toàn phụ thuộc nói về <em>luật</em> còn kiểm được. BCNF bảo đảm cái thứ nhất, không bảo đảm cái thứ hai.</p>`],
      [28, 'Normal Forms',
        `<p class="y-chinh">🎯 The ladder of normal forms: 1NF, 2NF, 3NF and BCNF (boxed — the ones this course examines), then 4NF, 5NF and domain-key normal form.</p>
<table>
<thead><tr><th>Form</th><th>Removes</th><th>Built on</th></tr></thead>
<tbody>
<tr><td>1NF</td><td>repeating groups, non-atomic cells</td><td>atomic domains</td></tr>
<tr><td>2NF</td><td>partial dependencies on a composite key</td><td>FDs + keys</td></tr>
<tr><td>3NF</td><td>transitive dependencies of non-key attributes</td><td>FDs + keys</td></tr>
<tr><td>BCNF</td><td>every FD whose left side is not a superkey</td><td>FDs + superkeys</td></tr>
<tr><td>4NF</td><td>multivalued dependencies (X ↠ Y) not implied by a key</td><td>MVDs — Ullman §3.6, not in these slides</td></tr>
<tr><td>5NF, DKNF</td><td>join dependencies; constraints from domains and keys</td><td>beyond the course</td></tr>
</tbody>
</table>
<p>Each form includes the previous ones: BCNF ⇒ 3NF ⇒ 2NF ⇒ 1NF, never the other way round.</p>`,
        `<p class="y-chinh">🎯 Bậc thang dạng chuẩn (normal form): 1NF, 2NF, 3NF và BCNF (khung đỏ — phần môn này thi), rồi 4NF, 5NF và dạng chuẩn khoá–miền (DKNF).</p>
<table>
<thead><tr><th>Dạng</th><th>Loại bỏ</th><th>Dựa trên</th></tr></thead>
<tbody>
<tr><td>1NF</td><td>nhóm lặp, ô không nguyên tố</td><td>miền giá trị nguyên tố (atomic)</td></tr>
<tr><td>2NF</td><td>phụ thuộc bộ phận vào khoá ghép</td><td>FD + khoá</td></tr>
<tr><td>3NF</td><td>phụ thuộc bắc cầu của thuộc tính không khoá</td><td>FD + khoá</td></tr>
<tr><td>BCNF</td><td>mọi FD có vế trái không phải siêu khoá</td><td>FD + siêu khoá</td></tr>
<tr><td>4NF</td><td>phụ thuộc đa trị (MVD, X ↠ Y) không do khoá kéo theo</td><td>MVD — Ullman §3.6, không có trong bộ slide này</td></tr>
<tr><td>5NF, DKNF</td><td>phụ thuộc nối; ràng buộc từ miền và khoá</td><td>ngoài phạm vi môn</td></tr>
</tbody>
</table>
<p>Mỗi dạng bao hàm các dạng trước: BCNF ⇒ 3NF ⇒ 2NF ⇒ 1NF, không bao giờ theo chiều ngược lại.</p>`],
      [29, 'Dependencies - Definitions',
        `<p class="y-chinh">🎯 Three words used by the 1NF–3NF slides: repeating group (multivalued attribute), partial dependency and transitive dependency.</p>
<table>
<thead><tr><th>Term</th><th>Meaning</th><th>Example in the student table (slides 30–63)</th></tr></thead>
<tbody>
<tr><td>Repeating group</td><td>non-key values not determined by the primary key (or its part) — several values in one cell</td><td>Subject, SubjectCost, Grade listed 3 times for one StudentID</td></tr>
<tr><td>Partial dependency</td><td>a non-key attribute determined by <em>part</em> of a <em>composite</em> key</td><td>key (StudentID, Subject), but Subject → SubjectCost</td></tr>
<tr><td>Transitive dependency</td><td>a non-key attribute determined by another non-key attribute</td><td>StudentID → HouseName → HouseColor</td></tr>
</tbody>
</table>
<p class="meo">🧠 <strong>Remember:</strong> 1NF kills repeating groups, 2NF kills partial dependencies, 3NF kills transitive dependencies — "the key, the whole key, and nothing but the key".</p>
<div class="pitfall">A partial dependency needs a <strong>composite</strong> key. If every key has one attribute, the relation is automatically in 2NF.</div>`,
        `<p class="y-chinh">🎯 Ba từ mà các slide 1NF–3NF dùng: nhóm lặp (thuộc tính đa trị), phụ thuộc bộ phận và phụ thuộc bắc cầu.</p>
<table>
<thead><tr><th>Thuật ngữ</th><th>Nghĩa</th><th>Ví dụ trong bảng sinh viên (slide 30–63)</th></tr></thead>
<tbody>
<tr><td>Nhóm lặp (repeating group)</td><td>các giá trị không khoá không do khoá chính (hay một phần của nó) xác định — nhiều giá trị trong một ô</td><td>Subject, SubjectCost, Grade liệt kê 3 lần cho một StudentID</td></tr>
<tr><td>Phụ thuộc bộ phận (partial dependency)</td><td>thuộc tính không khoá do <em>một phần</em> của khoá <em>ghép</em> xác định</td><td>khoá (StudentID, Subject), nhưng Subject → SubjectCost</td></tr>
<tr><td>Phụ thuộc bắc cầu (transitive dependency)</td><td>thuộc tính không khoá do một thuộc tính không khoá khác xác định</td><td>StudentID → HouseName → HouseColor</td></tr>
</tbody>
</table>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> 1NF diệt nhóm lặp, 2NF diệt phụ thuộc bộ phận, 3NF diệt phụ thuộc bắc cầu — "phụ thuộc vào khoá, cả khoá, và chỉ khoá mà thôi".</p>
<div class="pitfall">Phụ thuộc bộ phận cần khoá <strong>ghép</strong> (composite key). Nếu mọi khoá chỉ có một thuộc tính thì quan hệ tự động đạt 2NF.</div>`],
      [30, '1NF',
        `<p class="y-chinh">🎯 R is in 1NF when every domain contains atomic values only; the student table on the slide, keyed by StudentID, is tested.</p>
<p>The table has one row for student 19594332X (Mary Watson, 10 Charles Street, house Bob, colour Red), but the cells Subject, SubjectCost and Grade each hold three values: English/Maths/Info Tech, $50/$50/$100, B/A/B+.</p>
<p><strong>Atomic</strong> means the DBMS treats the value as one indivisible thing: you cannot query "the second subject" inside a cell. Is it 1NF? See slide 31.</p>`,
        `<p class="y-chinh">🎯 R đạt 1NF khi mọi miền giá trị (domain) chỉ chứa giá trị nguyên tố (atomic); bảng sinh viên trên slide, khoá StudentID, được đem ra kiểm.</p>
<p>Bảng có một dòng cho sinh viên 19594332X (Mary Watson, 10 Charles Street, nhà Bob, màu Red), nhưng các ô Subject, SubjectCost và Grade mỗi ô chứa ba giá trị: English/Maths/Info Tech, $50/$50/$100, B/A/B+.</p>
<p><strong>Nguyên tố</strong> nghĩa là hệ quản trị coi giá trị là một thứ không chia nhỏ: bạn không truy vấn được "môn thứ hai" nằm trong một ô. Có phải 1NF không? Xem slide 31.</p>`],
      [31, 'Not 1NF - repeating groups',
        `<p class="y-chinh">🎯 No: (Subject, SubjectCost, Grade) is a repeating group — three values in one cell.</p>
<p class="dap-an">✅ <strong>Answer to slide 30:</strong> not in 1NF. How to make it 1NF: either one row per value (slide 32), or move the repeating group into its own table right away (which is what 2NF will do anyway).</p>
<p>How such data looks in SQL is instructive: a list glued into one string is exactly a non-atomic value. The 3NF database of slide 63 can still <em>display</em> it that way with <code>STRING_AGG</code> — as a report, never as storage.</p>
<div class="pitfall">"Comma-separated values in one column" (e.g. <code>Phones = '0901, 0912'</code>) is the same 1NF violation in real projects: you cannot index, join or constrain one phone number.</div>`,
        `<p class="y-chinh">🎯 Không: (Subject, SubjectCost, Grade) là một nhóm lặp — ba giá trị trong một ô.</p>
<p class="dap-an">✅ <strong>Đáp án câu hỏi slide 30:</strong> không đạt 1NF. Cách đưa về 1NF: hoặc mỗi giá trị một dòng (slide 32), hoặc đưa ngay nhóm lặp sang bảng riêng (dù sao 2NF cũng sẽ làm việc đó).</p>
<p>Dữ liệu kiểu này trông ra sao trong SQL rất đáng xem: một danh sách dán vào một chuỗi chính là giá trị không nguyên tố. CSDL 3NF ở slide 63 vẫn có thể <em>hiển thị</em> kiểu đó bằng <code>STRING_AGG</code> — làm báo cáo thôi, không bao giờ để lưu trữ.</p>
<div class="pitfall">"Nhiều giá trị ngăn bằng dấu phẩy trong một cột" (ví dụ <code>Phones = '0901, 0912'</code>) là đúng lỗi vi phạm 1NF này trong dự án thật: bạn không đánh chỉ mục, nối bảng hay đặt ràng buộc cho từng số điện thoại được.</div>`],
      [32, 'Create new rows so each cell contains only one value',
        `<p class="y-chinh">🎯 Flatten the repeating group into one row per subject — every cell is now atomic, but StudentID can no longer be the primary key.</p>
<p>Try it: keep <code>StudentID PRIMARY KEY</code> and insert the three flattened rows. The script runs the wrong version first, then the fixed one (slide 33).</p>
<pre><code class="language-sql">-- 1NF rows, but StudentID is still declared as the primary key
CREATE TABLE StudentGrades (
  StudentID   VARCHAR(10) PRIMARY KEY,
  StudentName VARCHAR(30), Address VARCHAR(40),
  HouseName   VARCHAR(20), HouseColor VARCHAR(10),
  Subject     VARCHAR(20), SubjectCost MONEY, Grade VARCHAR(2)
);
INSERT INTO StudentGrades VALUES
 ('19594332X', 'Mary Watson', '10 Charles Street', 'Bob', 'Red', 'English', 50, 'B'),
 ('19594332X', 'Mary Watson', '10 Charles Street', 'Bob', 'Red', 'Maths', 50, 'A'),
 ('19594332X', 'Mary Watson', '10 Charles Street', 'Bob', 'Red', 'Info Tech', 100, 'B+');
GO
DROP TABLE StudentGrades;
-- The new key: StudentID + Subject
CREATE TABLE StudentGrades (
  StudentID   VARCHAR(10),
  StudentName VARCHAR(30), Address VARCHAR(40),
  HouseName   VARCHAR(20), HouseColor VARCHAR(10),
  Subject     VARCHAR(20), SubjectCost MONEY, Grade VARCHAR(2),
  PRIMARY KEY (StudentID, Subject)
);
INSERT INTO StudentGrades VALUES
 ('19594332X', 'Mary Watson', '10 Charles Street', 'Bob', 'Red', 'English', 50, 'B'),
 ('19594332X', 'Mary Watson', '10 Charles Street', 'Bob', 'Red', 'Maths', 50, 'A'),
 ('19594332X', 'Mary Watson', '10 Charles Street', 'Bob', 'Red', 'Info Tech', 100, 'B+');
SELECT * FROM StudentGrades;</code></pre>
<div class="out"><b>Msg 2627, Level 14, State 1<br>
Violation of PRIMARY KEY constraint 'PK__StudentG__DDACEB8D88E8BB99'. Cannot insert duplicate key in object 'dbo.StudentGrades'. The duplicate key value is (19594332X).</b><br>
The statement has been terminated.<br>
(3 rows affected)</div>
<table>
<thead><tr><th>StudentID</th><th>StudentName</th><th>Address</th><th>HouseName</th><th>HouseColor</th><th>Subject</th><th>SubjectCost</th><th>Grade</th></tr></thead>
<tbody>
<tr><td>19594332X</td><td>Mary Watson</td><td>10 Charles Street</td><td>Bob</td><td>Red</td><td>English</td><td>50.0000</td><td>B</td></tr>
<tr><td>19594332X</td><td>Mary Watson</td><td>10 Charles Street</td><td>Bob</td><td>Red</td><td>Info Tech</td><td>100.0000</td><td>B+</td></tr>
<tr><td>19594332X</td><td>Mary Watson</td><td>10 Charles Street</td><td>Bob</td><td>Red</td><td>Maths</td><td>50.0000</td><td>A</td></tr>
</tbody>
</table>
<p>The first INSERT fails with a PRIMARY KEY violation: the three rows share 19594332X, so StudentID does not identify a row any more. The whole multi-row INSERT is rejected, which is why the table is dropped and created again with the right key (<code>GO</code> separates the two batches in SQL Server).</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong> the same mistake gives a different message, and <code>MONEY</code> is usually replaced by <code>NUMERIC(8, 2)</code> (PostgreSQL has a money type, but it depends on the server's locale — avoid it).
<pre><code class="language-sql">CREATE TABLE student_grades (
  student_id   VARCHAR(10) PRIMARY KEY,         -- still the old key
  student_name TEXT, subject TEXT,
  subject_cost NUMERIC(8, 2),                   -- NUMERIC instead of MONEY
  grade        VARCHAR(2)
);
INSERT INTO student_grades VALUES
 ('19594332X', 'Mary Watson', 'English', 50, 'B'),
 ('19594332X', 'Mary Watson', 'Maths', 50, 'A');</code></pre>
<div class="out"><b>ERROR:  duplicate key value violates unique constraint "student_grades_pkey"</b></div>
"duplicate key value violates unique constraint student_grades_pkey" is the message you will meet at work (and in Prisma logs) whenever a key is too small. Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-1-khoa-chinh">PostgreSQL 3.1 — primary keys</a>.</div>`,
        `<p class="y-chinh">🎯 Trải nhóm lặp ra thành mỗi môn một dòng — mọi ô giờ đã nguyên tố, nhưng StudentID không còn làm khoá chính được nữa.</p>
<p>Thử thật: giữ <code>StudentID PRIMARY KEY</code> rồi chèn ba dòng đã trải. Script chạy bản sai trước, rồi bản đã sửa (slide 33).</p>
<pre><code class="language-sql">-- Các dòng đã 1NF nhưng vẫn khai StudentID làm khoá chính
CREATE TABLE StudentGrades (
  StudentID   VARCHAR(10) PRIMARY KEY,
  StudentName VARCHAR(30), Address VARCHAR(40),
  HouseName   VARCHAR(20), HouseColor VARCHAR(10),
  Subject     VARCHAR(20), SubjectCost MONEY, Grade VARCHAR(2)
);
INSERT INTO StudentGrades VALUES
 ('19594332X', 'Mary Watson', '10 Charles Street', 'Bob', 'Red', 'English', 50, 'B'),
 ('19594332X', 'Mary Watson', '10 Charles Street', 'Bob', 'Red', 'Maths', 50, 'A'),
 ('19594332X', 'Mary Watson', '10 Charles Street', 'Bob', 'Red', 'Info Tech', 100, 'B+');
GO
DROP TABLE StudentGrades;
-- Khoá mới: StudentID + Subject
CREATE TABLE StudentGrades (
  StudentID   VARCHAR(10),
  StudentName VARCHAR(30), Address VARCHAR(40),
  HouseName   VARCHAR(20), HouseColor VARCHAR(10),
  Subject     VARCHAR(20), SubjectCost MONEY, Grade VARCHAR(2),
  PRIMARY KEY (StudentID, Subject)
);
INSERT INTO StudentGrades VALUES
 ('19594332X', 'Mary Watson', '10 Charles Street', 'Bob', 'Red', 'English', 50, 'B'),
 ('19594332X', 'Mary Watson', '10 Charles Street', 'Bob', 'Red', 'Maths', 50, 'A'),
 ('19594332X', 'Mary Watson', '10 Charles Street', 'Bob', 'Red', 'Info Tech', 100, 'B+');
SELECT * FROM StudentGrades;</code></pre>
<div class="out"><b>Msg 2627, Level 14, State 1<br>
Violation of PRIMARY KEY constraint 'PK__StudentG__DDACEB8D88E8BB99'. Cannot insert duplicate key in object 'dbo.StudentGrades'. The duplicate key value is (19594332X).</b><br>
The statement has been terminated.<br>
(3 rows affected)</div>
<table>
<thead><tr><th>StudentID</th><th>StudentName</th><th>Address</th><th>HouseName</th><th>HouseColor</th><th>Subject</th><th>SubjectCost</th><th>Grade</th></tr></thead>
<tbody>
<tr><td>19594332X</td><td>Mary Watson</td><td>10 Charles Street</td><td>Bob</td><td>Red</td><td>English</td><td>50.0000</td><td>B</td></tr>
<tr><td>19594332X</td><td>Mary Watson</td><td>10 Charles Street</td><td>Bob</td><td>Red</td><td>Info Tech</td><td>100.0000</td><td>B+</td></tr>
<tr><td>19594332X</td><td>Mary Watson</td><td>10 Charles Street</td><td>Bob</td><td>Red</td><td>Maths</td><td>50.0000</td><td>A</td></tr>
</tbody>
</table>
<p>Câu INSERT đầu tiên lỗi vi phạm PRIMARY KEY: ba dòng cùng 19594332X, nên StudentID không còn xác định được một dòng. Cả câu INSERT nhiều dòng bị từ chối, vì vậy bảng bị xoá (<code>DROP TABLE</code>) rồi tạo lại với khoá đúng (<code>GO</code> tách hai lô lệnh — batch — trong SQL Server).</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> cùng lỗi đó ra thông báo khác, và <code>MONEY</code> thường được thay bằng <code>NUMERIC(8, 2)</code> (PostgreSQL có kiểu money nhưng phụ thuộc thiết lập vùng miền của máy chủ — nên tránh).
<pre><code class="language-sql">CREATE TABLE student_grades (
  student_id   VARCHAR(10) PRIMARY KEY,         -- vẫn là khoá cũ
  student_name TEXT, subject TEXT,
  subject_cost NUMERIC(8, 2),                   -- NUMERIC thay cho MONEY
  grade        VARCHAR(2)
);
INSERT INTO student_grades VALUES
 ('19594332X', 'Mary Watson', 'English', 50, 'B'),
 ('19594332X', 'Mary Watson', 'Maths', 50, 'A');</code></pre>
<div class="out"><b>ERROR:  duplicate key value violates unique constraint "student_grades_pkey"</b></div>
"duplicate key value violates unique constraint student_grades_pkey" (giá trị khoá bị trùng) là thông báo bạn sẽ gặp khi đi làm (và trong log của Prisma) mỗi khi khoá chọn quá nhỏ. Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-1-khoa-chinh">PostgreSQL 3.1 — khoá chính</a>.</div>`],
      [33, 'The new key is StudentID and Subject',
        `<p class="y-chinh">🎯 StudentID alone no longer identifies a row; StudentID and Subject together do — the new key is (StudentID, Subject).</p>
<p>With FDs this is a closure check. Write I = StudentID, N = StudentName, A = Address, H = HouseName, C = HouseColor, S = Subject, K = SubjectCost, G = Grade, and F = {I → NAHC, S → K, IS → G, H → C}:</p>
<table>
<thead><tr><th>X</th><th>X⁺</th><th>Superkey?</th></tr></thead>
<tbody>
<tr><td>{I}</td><td>{I, N, A, H, C}</td><td>no — misses S, K, G</td></tr>
<tr><td>{S}</td><td>{S, K}</td><td>no</td></tr>
<tr><td>{I, S}</td><td>all 8 attributes</td><td>yes, and minimal ⇒ the key</td></tr>
</tbody>
</table>
<p>The second half of the script above (<code>PRIMARY KEY (StudentID, Subject)</code>) accepts all three rows — the table is now in 1NF with a composite key.</p>`,
        `<p class="y-chinh">🎯 Riêng StudentID không còn xác định được một dòng; StudentID và Subject cùng nhau thì được — khoá mới là (StudentID, Subject).</p>
<p>Với FD, đây là phép kiểm bao đóng. Đặt I = StudentID, N = StudentName, A = Address, H = HouseName, C = HouseColor, S = Subject, K = SubjectCost, G = Grade, và F = {I → NAHC, S → K, IS → G, H → C}:</p>
<table>
<thead><tr><th>X</th><th>X⁺</th><th>Siêu khoá?</th></tr></thead>
<tbody>
<tr><td>{I}</td><td>{I, N, A, H, C}</td><td>không — thiếu S, K, G</td></tr>
<tr><td>{S}</td><td>{S, K}</td><td>không</td></tr>
<tr><td>{I, S}</td><td>cả 8 thuộc tính</td><td>có, và tối tiểu ⇒ là khoá</td></tr>
</tbody>
</table>
<p>Nửa sau của script ở trên (<code>PRIMARY KEY (StudentID, Subject)</code>) nhận cả ba dòng — bảng giờ đạt 1NF với khoá ghép.</p>`],
      [34, 'So we now have 1NF - is it 2NF?',
        `<p class="y-chinh">🎯 The flattened table is in 1NF; the next question is 2NF.</p>
<p>Look at the redundancy that is still there: Mary Watson's name, address, house and colour are repeated on all three rows, and $50 for English would be repeated for every student taking English. 1NF only fixed the <em>shape</em> of the cells, not the dependencies.</p>`,
        `<p class="y-chinh">🎯 Bảng đã trải phẳng đạt 1NF; câu hỏi tiếp theo là 2NF.</p>
<p>Nhìn phần dư thừa vẫn còn: tên, địa chỉ, nhà và màu của Mary Watson lặp trên cả ba dòng, còn $50 của môn English sẽ lặp lại cho mọi sinh viên học English. 1NF mới sửa <em>hình dạng</em> các ô, chưa đụng tới các phụ thuộc.</p>`],
      [35, '2NF',
        `<p class="y-chinh">🎯 R is in 2NF when it is in 1NF and every non-key attribute is fully dependent on the (whole) primary key; here StudentName and Address depend on StudentID alone.</p>
<ul>
<li><strong>Fully dependent</strong>: the FD needs the whole key — remove any attribute from the left side and it stops holding (the "full functional dependency" of slide 69).</li>
<li>In the table: StudentID → StudentName, Address, HouseName, HouseColor and Subject → SubjectCost use only <em>part</em> of (StudentID, Subject) — partial dependencies.</li>
<li>Only Grade needs both halves: (StudentID, Subject) → Grade.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> 2NF only looks at non-key attributes and only at composite keys: "does some half of the key already determine this column?"</p>`,
        `<p class="y-chinh">🎯 R đạt 2NF khi đạt 1NF và mọi thuộc tính không khoá phụ thuộc đầy đủ vào (toàn bộ) khoá chính; ở đây StudentName và Address chỉ phụ thuộc vào StudentID.</p>
<ul>
<li><strong>Phụ thuộc đầy đủ</strong> (fully dependent): FD cần cả khoá — bỏ bất kỳ thuộc tính nào ở vế trái là nó không còn đúng (chính là "phụ thuộc hàm đầy đủ — full functional dependency" của slide 69).</li>
<li>Trong bảng: StudentID → StudentName, Address, HouseName, HouseColor và Subject → SubjectCost chỉ dùng <em>một phần</em> của (StudentID, Subject) — phụ thuộc bộ phận.</li>
<li>Chỉ Grade cần cả hai nửa: (StudentID, Subject) → Grade.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> 2NF chỉ xét thuộc tính không khoá và chỉ với khoá ghép: "có nửa nào của khoá đã tự xác định được cột này chưa?"</p>`],
      [36, 'And 2NF requires',
        `<p class="y-chinh">🎯 2NF requires every non-key field to depend on the ENTIRE key (StudentID + Subject).</p>
<table>
<thead><tr><th>Non-key attribute</th><th>Determined by</th><th>Whole key?</th><th>Partial dependency?</th></tr></thead>
<tbody>
<tr><td>StudentName, Address, HouseName, HouseColor</td><td>StudentID</td><td>no</td><td>yes</td></tr>
<tr><td>SubjectCost</td><td>Subject</td><td>no</td><td>yes</td></tr>
<tr><td>Grade</td><td>StudentID + Subject</td><td>yes</td><td>no</td></tr>
</tbody>
</table>
<p>Six of the seven non-key attributes fail — the table is far from 2NF.</p>`,
        `<p class="y-chinh">🎯 2NF đòi mọi cột không khoá phụ thuộc vào TOÀN BỘ khoá (StudentID + Subject).</p>
<table>
<thead><tr><th>Thuộc tính không khoá</th><th>Do ai xác định</th><th>Cả khoá?</th><th>Phụ thuộc bộ phận?</th></tr></thead>
<tbody>
<tr><td>StudentName, Address, HouseName, HouseColor</td><td>StudentID</td><td>không</td><td>có</td></tr>
<tr><td>SubjectCost</td><td>Subject</td><td>không</td><td>có</td></tr>
<tr><td>Grade</td><td>StudentID + Subject</td><td>có</td><td>không</td></tr>
</tbody>
</table>
<p>Sáu trên bảy thuộc tính không khoá không đạt — bảng còn cách 2NF khá xa.</p>`],
      [37, 'So it is not 2NF - how can we fix it',
        `<p class="y-chinh">🎯 Not in 2NF, because of the partial dependencies — the fix is to move each group of partially dependent columns out with the part of the key it depends on.</p>
<p>That is a decomposition (slide 22): the new tables are projections of this one, and each shares a key column with the rest so we can join back without loss.</p>
<div class="pitfall">Do not "fix" 2NF by adding a surrogate ID column as the primary key: the partial dependency Subject → SubjectCost is still in the data, and so is the redundancy.</div>`,
        `<p class="y-chinh">🎯 Không đạt 2NF, do các phụ thuộc bộ phận — cách sửa là chuyển mỗi nhóm cột phụ thuộc bộ phận ra ngoài cùng với phần khoá mà nó phụ thuộc.</p>
<p>Đó là một phép phân rã (slide 22): các bảng mới là phép chiếu của bảng này, và mỗi bảng giữ chung một cột khoá với phần còn lại để nối lại không mất thông tin.</p>
<div class="pitfall">Đừng "sửa" 2NF bằng cách thêm cột ID thay thế (surrogate key) làm khoá chính: phụ thuộc bộ phận Subject → SubjectCost vẫn nằm trong dữ liệu, và dư thừa cũng vậy.</div>`],
      [38, 'Make new tables',
        `<p class="y-chinh">🎯 The recipe: one new table per part of the primary key, give it that part as its key, and move each column to the table whose key it depends on.</p>
<table>
<thead><tr><th>Key part</th><th>New table</th><th>Columns moved</th></tr></thead>
<tbody>
<tr><td>StudentID</td><td>STUDENT (key StudentID)</td><td>StudentName, Address, HouseName, HouseColor</td></tr>
<tr><td>Subject</td><td>SUBJECTS (key Subject)</td><td>SubjectCost</td></tr>
<tr><td>StudentID + Subject</td><td>RESULTS (key StudentID + Subject)</td><td>Grade</td></tr>
</tbody>
</table>
<p>Slides 39–42 build these three tables step by step; lesson 4.C runs them in SQL.</p>
<p class="nhan">The same fix read as an ERD (your lecturer will ask for it)</p>
<pre><code class="language-plaintext">[STUDENT]                                   [SUBJECT]
StudentID (key)                             Subject (key)
StudentName, Address,     ──&lt; takes &gt;──     SubjectCost
HouseName, HouseColor      many   many
                         attribute: Grade</code></pre>
<p>A table that breaks 2NF is an ERD with <strong>missing entities</strong>: each partial dependency is an entity hidden inside the table, whose key is that part of the composite key. StudentID → … is the entity STUDENT, Subject → SubjectCost is the entity SUBJECT, and what really needed the whole key (Grade) is the attribute of the many-to-many relationship "takes" — which becomes the table RESULTS.</p>`,
        `<p class="y-chinh">🎯 Công thức: mỗi phần của khoá chính một bảng mới, lấy phần đó làm khoá, rồi chuyển mỗi cột sang bảng có khoá mà nó phụ thuộc.</p>
<table>
<thead><tr><th>Phần khoá</th><th>Bảng mới</th><th>Cột chuyển sang</th></tr></thead>
<tbody>
<tr><td>StudentID</td><td>STUDENT (khoá StudentID)</td><td>StudentName, Address, HouseName, HouseColor</td></tr>
<tr><td>Subject</td><td>SUBJECTS (khoá Subject)</td><td>SubjectCost</td></tr>
<tr><td>StudentID + Subject</td><td>RESULTS (khoá StudentID + Subject)</td><td>Grade</td></tr>
</tbody>
</table>
<p>Slide 39–42 dựng ba bảng này từng bước; bài 4.C chạy chúng bằng SQL.</p>
<p class="nhan">Cùng cách sửa đó đọc bằng ERD (thầy/cô sẽ hỏi)</p>
<pre><code class="language-plaintext">[STUDENT]                                   [SUBJECT]
StudentID (khoá)                            Subject (khoá)
StudentName, Address,     ──&lt; học &gt;──       SubjectCost
HouseName, HouseColor      nhiều  nhiều
                         thuộc tính: Grade</code></pre>
<p>Bảng vi phạm 2NF là một ERD bị <strong>thiếu thực thể (entity)</strong>: mỗi phụ thuộc bộ phận là một thực thể trốn trong bảng, khoá của nó chính là phần khoá đó. StudentID → … là thực thể STUDENT, Subject → SubjectCost là thực thể SUBJECT, còn thứ thật sự cần cả khoá (Grade) là thuộc tính của liên kết nhiều–nhiều "học" — liên kết này thành bảng RESULTS.</p>`],
    ]),
    bi(`<h3>✅ Check yourself in 60 seconds</h3>
<ol>
<li>Name the anomaly: changing a studio's address in one row but not the others.</li>
<li>R(A, B, C) split into (A, B) and (A, C) with A → B. Lossless?</li>
<li>Can a relation whose only key is a single attribute violate 2NF?</li>
<li>Why did PRIMARY KEY (StudentID) fail after flattening?</li>
</ol>
<p class="dap-an">✅ <strong>Answers:</strong> (1) update anomaly. (2) Yes — the shared attribute A is a key of (A, B). (3) No — a partial dependency needs a composite key. (4) Three rows share StudentID 19594332X, so it no longer identifies a row; the key became (StudentID, Subject).</p>`,
    `<h3>✅ Tự kiểm tra trong 60 giây</h3>
<ol>
<li>Gọi tên bất thường: sửa địa chỉ một hãng phim ở một dòng mà không sửa các dòng khác.</li>
<li>R(A, B, C) tách thành (A, B) và (A, C) với A → B. Có mất thông tin không?</li>
<li>Quan hệ chỉ có một khoá gồm một thuộc tính có thể vi phạm 2NF không?</li>
<li>Vì sao PRIMARY KEY (StudentID) lỗi sau khi trải phẳng?</li>
</ol>
<p class="dap-an">✅ <strong>Đáp án:</strong> (1) bất thường cập nhật. (2) Không mất — thuộc tính chung A là khoá của (A, B). (3) Không — phụ thuộc bộ phận cần khoá ghép. (4) Ba dòng cùng StudentID 19594332X, nên nó không còn xác định được một dòng; khoá thành (StudentID, Subject).</p>`),
    books([
      ['ullman', 'Ch.3 — §3.3 Design of Relational Database Schemas (§3.3.1 Anomalies · §3.3.2 Decomposing Relations) · §3.4 Decomposition: The Good, Bad, and Ugly (§3.4.1 Recovering Information · §3.4.2 The Chase Test for Lossless Join · §3.4.4 Dependency Preservation)', 'Chương 3 — §3.3 Design of Relational Database Schemas (§3.3.1 bất thường · §3.3.2 phân rã) · §3.4 Decomposition: The Good, Bad, and Ugly (§3.4.1 khôi phục thông tin · §3.4.2 phép kiểm chase · §3.4.4 bảo toàn phụ thuộc)'],
      ['ramakrishnan', 'Ch.19 — §19.1 Introduction to Schema Refinement (problems caused by redundancy) · §19.4 Normal Forms (1NF, 2NF) · §19.5 Properties of Decompositions', 'Chương 19 — §19.1 vấn đề do dư thừa · §19.4 các dạng chuẩn (1NF, 2NF) · §19.5 tính chất của phân rã'],
    ]),
  ].join('\n'),
};

/* ───────── 4.C — 📑 Slide by slide · Reaching 2NF step by step, then the 3NF check (Chapter 3, slides 39–58) ───────── */
const L_dbi4_3 = {
  title: '4.C — 📑 Slide by slide · Reaching 2NF step by step, then the 3NF check (Chapter 3, slides 39–58)|||4.C — 📑 Học theo từng slide · Đưa về 2NF từng bước, rồi kiểm 3NF (Chapter 3, slide 39–58)',
  slug: 'dbi202-slide-dbi4-3',
  type: 'VIDEO',
  description: 'Giảng từng slide 39–58 của bộ slide Chapter 3 của trường: tách bảng StudentID thành STUDENT, SUBJECTS, RESULTS (tạo bảng + khoá ngoại chạy thật trên SQL Server), quan hệ và bản số 1–nhiều thử bằng lệnh INSERT lỗi thật, kiểm 2NF từng cột, định nghĩa 3NF và phụ thuộc bắc cầu, vì sao HouseName → HouseColor làm bảng STUDENT không đạt 3NF — mọi kết luận kiểm lại bằng bao đóng.',
  content: [
    bi(`<span class="eyebrow">Chapter 4 · Lesson 4.C · school slides "Chapter 3", slides 39–58</span>
<h2>From 1NF to 2NF in four steps, then "is it 3NF?"</h2>
<p class="lead">⚠️ Still the school's <strong>"Chapter 3"</strong> deck (web Chapter 4). These twenty slides are one long animation on the student table: slides 39–42 carve it into three tables, 43–47 draw the relationships and their cardinalities, 48–51 check 2NF column by column, and 52–58 define 3NF and find the dependency that breaks it.</p>
<div class="callout"><strong>The running example</strong> (letters used in the closure tables): I = StudentID, N = StudentName, A = Address, H = HouseName, C = HouseColor, S = Subject, K = SubjectCost, G = Grade, with F = {I → NAHC, S → K, IS → G, H → C}. The last FD is the one the slides only reveal on slide 54: each house has one colour.</div>`,
    `<span class="eyebrow">Chương 4 · Bài 4.C · slide "Chapter 3" của trường, slide 39–58</span>
<h2>Từ 1NF lên 2NF trong bốn bước, rồi "đã 3NF chưa?"</h2>
<p class="lead">⚠️ Vẫn là bộ slide <strong>"Chapter 3"</strong> của trường (Chương 4 trên web). Hai mươi slide này là một hoạt hình dài trên bảng sinh viên: slide 39–42 cắt nó thành ba bảng, 43–47 vẽ quan hệ giữa các bảng và bản số (cardinality), 48–51 kiểm 2NF từng cột, còn 52–58 định nghĩa 3NF và tìm ra phụ thuộc làm nó hỏng.</p>
<div class="callout"><strong>Ví dụ xuyên suốt</strong> (chữ cái dùng trong các bảng bao đóng): I = StudentID, N = StudentName, A = Address, H = HouseName, C = HouseColor, S = Subject, K = SubjectCost, G = Grade, với F = {I → NAHC, S → K, IS → G, H → C}. FD cuối là thứ mà slide chỉ tiết lộ ở slide 54: mỗi nhà (house) có một màu.</div>`),
    walkHead('dbi4', 39, 58),
    walk('dbi4', [
      [39, 'Step 1 - STUDENT TABLE',
        `<p class="y-chinh">🎯 Step 1 names the first new table: STUDENT, keyed by StudentID — the home of everything that depends on StudentID alone.</p>
<p>Which columns go there is a closure question: {StudentID}⁺ = {StudentID, StudentName, Address, HouseName, HouseColor}. Those five columns form STUDENT (slide 40 shows it filled).</p>`,
        `<p class="y-chinh">🎯 Bước 1 đặt tên bảng mới đầu tiên: STUDENT, khoá StudentID — nơi chứa mọi thứ chỉ phụ thuộc vào riêng StudentID.</p>
<p>Cột nào vào đó là câu hỏi bao đóng: {StudentID}⁺ = {StudentID, StudentName, Address, HouseName, HouseColor}. Năm cột đó tạo thành STUDENT (slide 40 cho thấy bảng đã điền).</p>`],
      [40, 'Step 2 - STUDENT and SUBJECTS tables',
        `<p class="y-chinh">🎯 STUDENT now holds one row (19594332X, Mary Watson, 10 Charles Street, Bob, Red); the next table named is SUBJECTS, keyed by Subject.</p>
<p>Three rows of the 1NF table collapsed into one row of STUDENT — this is where the redundancy of the name and address disappears. {Subject}⁺ = {Subject, SubjectCost}, so SUBJECTS gets SubjectCost.</p>`,
        `<p class="y-chinh">🎯 STUDENT giờ có một dòng (19594332X, Mary Watson, 10 Charles Street, Bob, Red); bảng tiếp theo được đặt tên là SUBJECTS, khoá Subject.</p>
<p>Ba dòng của bảng 1NF gộp thành một dòng của STUDENT — đây là chỗ dư thừa tên và địa chỉ biến mất. {Subject}⁺ = {Subject, SubjectCost}, nên SUBJECTS nhận SubjectCost.</p>`],
      [41, 'Step 3 - SUBJECTS filled, RESULTS named',
        `<p class="y-chinh">🎯 SUBJECTS is filled — English $50, Maths $50, Info Tech $100 — and the last table is named: RESULTS, keyed by StudentID + Subject.</p>
<p>What is left after moving the StudentID group and the Subject group is the column that needs the whole key: Grade. RESULTS keeps both key columns so that it can be joined to STUDENT and to SUBJECTS.</p>`,
        `<p class="y-chinh">🎯 SUBJECTS đã điền — English $50, Maths $50, Info Tech $100 — và bảng cuối được đặt tên: RESULTS, khoá StudentID + Subject.</p>
<p>Sau khi chuyển nhóm của StudentID và nhóm của Subject đi, phần còn lại là cột cần cả khoá: Grade. RESULTS giữ cả hai cột khoá để nối được với STUDENT và với SUBJECTS.</p>`],
      [42, 'Step 3 - the three tables',
        `<p class="y-chinh">🎯 The 2NF design: STUDENT(StudentID, StudentName, Address, HouseName, HouseColor), SUBJECTS(Subject, SubjectCost), RESULTS(StudentID, Subject, Grade).</p>
<p>The same three tables in T-SQL, with the keys on the slide and the foreign keys that slide 43 draws as arrows:</p>
<pre><code class="language-sql">CREATE TABLE Student (                       -- key = StudentID
  StudentID   VARCHAR(10) PRIMARY KEY,
  StudentName VARCHAR(30), Address VARCHAR(40),
  HouseName   VARCHAR(20), HouseColor VARCHAR(10)
);
CREATE TABLE Subjects (                      -- key = Subject
  Subject     VARCHAR(20) PRIMARY KEY,
  SubjectCost MONEY
);
CREATE TABLE Results (                       -- key = StudentID + Subject
  StudentID VARCHAR(10) REFERENCES Student(StudentID),
  Subject   VARCHAR(20) REFERENCES Subjects(Subject),
  Grade     VARCHAR(2),
  PRIMARY KEY (StudentID, Subject)
);
INSERT INTO Student  VALUES ('19594332X', 'Mary Watson', '10 Charles Street', 'Bob', 'Red');
INSERT INTO Subjects VALUES ('English', 50), ('Maths', 50), ('Info Tech', 100);
INSERT INTO Results  VALUES ('19594332X', 'English', 'B'), ('19594332X', 'Maths', 'A'),
                            ('19594332X', 'Info Tech', 'B+');
SELECT * FROM Student;
SELECT * FROM Subjects;
SELECT * FROM Results;</code></pre>
<div class="out">(1 row affected)<br>
(3 rows affected)<br>
(3 rows affected)</div>
<table>
<thead><tr><th>StudentID</th><th>StudentName</th><th>Address</th><th>HouseName</th><th>HouseColor</th></tr></thead>
<tbody>
<tr><td>19594332X</td><td>Mary Watson</td><td>10 Charles Street</td><td>Bob</td><td>Red</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Subject</th><th>SubjectCost</th></tr></thead>
<tbody>
<tr><td>English</td><td>50.0000</td></tr>
<tr><td>Info Tech</td><td>100.0000</td></tr>
<tr><td>Maths</td><td>50.0000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>StudentID</th><th>Subject</th><th>Grade</th></tr></thead>
<tbody>
<tr><td>19594332X</td><td>English</td><td>B</td></tr>
<tr><td>19594332X</td><td>Info Tech</td><td>B+</td></tr>
<tr><td>19594332X</td><td>Maths</td><td>A</td></tr>
</tbody>
</table>
<ul>
<li><code>CREATE TABLE Student ( … )</code> — create a table; each line inside is a column: name, then type (<code>VARCHAR(10)</code> = text up to 10 characters, <code>MONEY</code> = an amount of money).</li>
<li><code>PRIMARY KEY</code> after a column — that column is the key; <code>PRIMARY KEY (StudentID, Subject)</code> at the end — a key made of two columns.</li>
<li><code>REFERENCES Student(StudentID)</code> — a foreign key: the value must already exist in Student.StudentID.</li>
<li><code>INSERT INTO … VALUES (…), (…)</code> — add rows; <code>SELECT * FROM …</code> — show every column of every row.</li>
</ul>
<p>Count the stored values: the 1NF table held 3 × 8 = 24 cells; now 5 + 6 + 9 = 20, and adding a second student taking English adds 5 + 3 cells instead of 8 with "English, $50" repeated.</p>
<div class="pitfall">Keep <strong>both</strong> key columns in RESULTS. Dropping StudentID "because it is already in STUDENT" makes the join impossible — that would be a lossy decomposition.</div>`,
        `<p class="y-chinh">🎯 Thiết kế 2NF: STUDENT(StudentID, StudentName, Address, HouseName, HouseColor), SUBJECTS(Subject, SubjectCost), RESULTS(StudentID, Subject, Grade).</p>
<p>Đúng ba bảng đó bằng T-SQL, với các khoá như slide và các khoá ngoại (foreign key) mà slide 43 vẽ bằng mũi tên:</p>
<pre><code class="language-sql">CREATE TABLE Student (                       -- khoá = StudentID
  StudentID   VARCHAR(10) PRIMARY KEY,
  StudentName VARCHAR(30), Address VARCHAR(40),
  HouseName   VARCHAR(20), HouseColor VARCHAR(10)
);
CREATE TABLE Subjects (                      -- khoá = Subject
  Subject     VARCHAR(20) PRIMARY KEY,
  SubjectCost MONEY
);
CREATE TABLE Results (                       -- khoá = StudentID + Subject
  StudentID VARCHAR(10) REFERENCES Student(StudentID),
  Subject   VARCHAR(20) REFERENCES Subjects(Subject),
  Grade     VARCHAR(2),
  PRIMARY KEY (StudentID, Subject)
);
INSERT INTO Student  VALUES ('19594332X', 'Mary Watson', '10 Charles Street', 'Bob', 'Red');
INSERT INTO Subjects VALUES ('English', 50), ('Maths', 50), ('Info Tech', 100);
INSERT INTO Results  VALUES ('19594332X', 'English', 'B'), ('19594332X', 'Maths', 'A'),
                            ('19594332X', 'Info Tech', 'B+');
SELECT * FROM Student;
SELECT * FROM Subjects;
SELECT * FROM Results;</code></pre>
<div class="out">(1 row affected)<br>
(3 rows affected)<br>
(3 rows affected)</div>
<table>
<thead><tr><th>StudentID</th><th>StudentName</th><th>Address</th><th>HouseName</th><th>HouseColor</th></tr></thead>
<tbody>
<tr><td>19594332X</td><td>Mary Watson</td><td>10 Charles Street</td><td>Bob</td><td>Red</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Subject</th><th>SubjectCost</th></tr></thead>
<tbody>
<tr><td>English</td><td>50.0000</td></tr>
<tr><td>Info Tech</td><td>100.0000</td></tr>
<tr><td>Maths</td><td>50.0000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>StudentID</th><th>Subject</th><th>Grade</th></tr></thead>
<tbody>
<tr><td>19594332X</td><td>English</td><td>B</td></tr>
<tr><td>19594332X</td><td>Info Tech</td><td>B+</td></tr>
<tr><td>19594332X</td><td>Maths</td><td>A</td></tr>
</tbody>
</table>
<ul>
<li><code>CREATE TABLE Student ( … )</code> — tạo bảng; mỗi dòng bên trong là một cột: tên, rồi kiểu (<code>VARCHAR(10)</code> = chuỗi tối đa 10 ký tự, <code>MONEY</code> = số tiền).</li>
<li><code>PRIMARY KEY</code> đứng sau một cột — cột đó là khoá; <code>PRIMARY KEY (StudentID, Subject)</code> ở cuối — khoá gồm hai cột.</li>
<li><code>REFERENCES Student(StudentID)</code> — khoá ngoại: giá trị phải có sẵn trong Student.StudentID.</li>
<li><code>INSERT INTO … VALUES (…), (…)</code> — thêm dòng; <code>SELECT * FROM …</code> — hiện mọi cột của mọi dòng.</li>
</ul>
<p>Đếm số ô lưu trữ: bảng 1NF có 3 × 8 = 24 ô; giờ là 5 + 6 + 9 = 20, và thêm một sinh viên thứ hai học English chỉ thêm 5 + 3 ô thay vì 8 ô với "English, $50" lặp lại.</p>
<div class="pitfall">Giữ <strong>cả hai</strong> cột khoá trong RESULTS. Bỏ StudentID "vì STUDENT có rồi" là hết nối được — đó là phân rã mất thông tin.</div>`],
      [43, 'Step 4 - relationships',
        `<p class="y-chinh">🎯 Two relationships connect the tables: RESULTS.StudentID → STUDENT and RESULTS.Subject → SUBJECTS — in SQL, two foreign keys.</p>
<p>Each arrow goes from the table that <em>repeats</em> a key value (RESULTS) to the table where that value is the primary key. The foreign key guarantees the join of slide 63 finds a partner for every row.</p>
<pre><code class="language-sql">-- "1" side: a student appears ONCE in Student
INSERT INTO Student VALUES ('19594332X', 'Mary W.', 'Elsewhere', 'Bob', 'Red');
GO
-- "many" side: a result must point to an existing subject
INSERT INTO Results VALUES ('19594332X', 'Physics', 'A');
GO
-- One student, MANY rows in Results
SELECT StudentID, COUNT(*) AS soMon FROM Results GROUP BY StudentID;</code></pre>
<div class="out">(1 row affected)<br>
(3 rows affected)<br>
(3 rows affected)<br>
<b>Msg 2627, Level 14, State 1<br>
Violation of PRIMARY KEY constraint 'PK__Student__54B88B4E9D509648'. Cannot insert duplicate key in object 'dbo.Student'. The duplicate key value is (19594332X).</b><br>
The statement has been terminated.<br>
<b>Msg 547, Level 16, State 0<br>
The INSERT statement conflicted with the FOREIGN KEY constraint "FK__Results__Subject__959A1FEE". The conflict occurred in database "DBI202", table "dbo.Subjects", column 'Subject'.</b><br>
The statement has been terminated.</div>
<table>
<thead><tr><th>StudentID</th><th>soMon</th></tr></thead>
<tbody>
<tr><td>19594332X</td><td>3</td></tr>
</tbody>
</table>
<p>The two errors are the two rules of slides 44–47 enforced by SQL Server: a StudentID cannot appear twice in STUDENT (PRIMARY KEY), and RESULTS cannot mention a subject that SUBJECTS does not have (FOREIGN KEY). The last query shows the "many" side: one student, three rows in RESULTS.</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong> <code>REFERENCES student</code> may omit the column (it then points to the primary key), <code>TEXT</code> replaces <code>VARCHAR</code> for free text, and the foreign-key error reads differently:
<pre><code class="language-sql">CREATE TABLE student (student_id VARCHAR(10) PRIMARY KEY, student_name TEXT);
CREATE TABLE subjects (subject TEXT PRIMARY KEY, subject_cost NUMERIC(8, 2));
CREATE TABLE results (
  student_id VARCHAR(10) REFERENCES student,    -- short form: refers to the primary key
  subject    TEXT REFERENCES subjects,
  grade      VARCHAR(2),
  PRIMARY KEY (student_id, subject));
INSERT INTO student  VALUES ('19594332X', 'Mary Watson');
INSERT INTO subjects VALUES ('English', 50), ('Maths', 50), ('Info Tech', 100);
INSERT INTO results  VALUES ('19594332X', 'English', 'B'), ('19594332X', 'Maths', 'A'),
                            ('19594332X', 'Info Tech', 'B+');
INSERT INTO results VALUES ('19594332X', 'Physics', 'A');   -- no such subject</code></pre>
<div class="out"><b>ERROR:  insert or update on table "results" violates foreign key constraint "results_subject_fkey"</b></div>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-2-khoa-ngoai">PostgreSQL 3.2 — foreign keys &amp; referential integrity</a>.</div>`,
        `<p class="y-chinh">🎯 Hai mối quan hệ nối các bảng: RESULTS.StudentID → STUDENT và RESULTS.Subject → SUBJECTS — trong SQL là hai khoá ngoại.</p>
<p>Mỗi mũi tên đi từ bảng <em>lặp lại</em> một giá trị khoá (RESULTS) tới bảng mà giá trị đó là khoá chính. Khoá ngoại bảo đảm phép nối ở slide 63 tìm được bạn đồng hành cho mọi dòng.</p>
<pre><code class="language-sql">-- Phía "1": mỗi sinh viên chỉ xuất hiện MỘT lần trong Student
INSERT INTO Student VALUES ('19594332X', 'Mary W.', 'Elsewhere', 'Bob', 'Red');
GO
-- Phía "nhiều": kết quả phải trỏ tới một môn đã có
INSERT INTO Results VALUES ('19594332X', 'Physics', 'A');
GO
-- Một sinh viên, NHIỀU dòng trong Results
SELECT StudentID, COUNT(*) AS soMon FROM Results GROUP BY StudentID;</code></pre>
<div class="out">(1 row affected)<br>
(3 rows affected)<br>
(3 rows affected)<br>
<b>Msg 2627, Level 14, State 1<br>
Violation of PRIMARY KEY constraint 'PK__Student__54B88B4E9D509648'. Cannot insert duplicate key in object 'dbo.Student'. The duplicate key value is (19594332X).</b><br>
The statement has been terminated.<br>
<b>Msg 547, Level 16, State 0<br>
The INSERT statement conflicted with the FOREIGN KEY constraint "FK__Results__Subject__959A1FEE". The conflict occurred in database "DBI202", table "dbo.Subjects", column 'Subject'.</b><br>
The statement has been terminated.</div>
<table>
<thead><tr><th>StudentID</th><th>soMon</th></tr></thead>
<tbody>
<tr><td>19594332X</td><td>3</td></tr>
</tbody>
</table>
<p>Hai lỗi chính là hai luật của slide 44–47 được SQL Server giữ hộ: một StudentID không được xuất hiện hai lần trong STUDENT (PRIMARY KEY), và RESULTS không được nhắc tới môn mà SUBJECTS không có (FOREIGN KEY). Câu truy vấn cuối cho thấy phía "nhiều": một sinh viên, ba dòng trong RESULTS.</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> <code>REFERENCES student</code> được bỏ tên cột (khi đó nó trỏ tới khoá chính), <code>TEXT</code> thay cho <code>VARCHAR</code> với chữ tự do, và lỗi khoá ngoại có câu chữ khác:
<pre><code class="language-sql">CREATE TABLE student (student_id VARCHAR(10) PRIMARY KEY, student_name TEXT);
CREATE TABLE subjects (subject TEXT PRIMARY KEY, subject_cost NUMERIC(8, 2));
CREATE TABLE results (
  student_id VARCHAR(10) REFERENCES student,    -- dạng rút gọn: tự trỏ tới khoá chính
  subject    TEXT REFERENCES subjects,
  grade      VARCHAR(2),
  PRIMARY KEY (student_id, subject));
INSERT INTO student  VALUES ('19594332X', 'Mary Watson');
INSERT INTO subjects VALUES ('English', 50), ('Maths', 50), ('Info Tech', 100);
INSERT INTO results  VALUES ('19594332X', 'English', 'B'), ('19594332X', 'Maths', 'A'),
                            ('19594332X', 'Info Tech', 'B+');
INSERT INTO results VALUES ('19594332X', 'Physics', 'A');   -- không có môn này</code></pre>
<div class="out"><b>ERROR:  insert or update on table "results" violates foreign key constraint "results_subject_fkey"</b></div>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-2-khoa-ngoai">PostgreSQL 3.2 — khoá ngoại &amp; toàn vẹn tham chiếu</a>.</div>`],
      [44, 'Step 4 - cardinality: 1 at STUDENT',
        `<p class="y-chinh">🎯 The "1" at STUDENT: each student can appear only once in the student table.</p>
<p>That is exactly what PRIMARY KEY (StudentID) says — the first failed INSERT above. On the arrow it means: for one row of RESULTS there is at most one matching student.</p>`,
        `<p class="y-chinh">🎯 Số "1" ở phía STUDENT: mỗi sinh viên chỉ xuất hiện một lần trong bảng sinh viên.</p>
<p>Đó chính là điều PRIMARY KEY (StudentID) nói — câu INSERT lỗi đầu tiên ở trên. Trên mũi tên nó nghĩa là: một dòng của RESULTS khớp với nhiều nhất một sinh viên.</p>`],
      [45, 'Step 4 - cardinality: 1 at SUBJECTS',
        `<p class="y-chinh">🎯 The "1" at SUBJECTS: each subject can appear only once in the subjects table.</p>
<p>So SubjectCost is stored once per subject: changing the price of Info Tech is one UPDATE on one row — the update anomaly of slide 21 cannot happen for costs any more.</p>`,
        `<p class="y-chinh">🎯 Số "1" ở phía SUBJECTS: mỗi môn chỉ xuất hiện một lần trong bảng môn học.</p>
<p>Vì vậy SubjectCost lưu một lần cho mỗi môn: đổi học phí của Info Tech là một câu UPDATE trên một dòng — bất thường cập nhật của slide 21 không còn xảy ra với học phí nữa.</p>`],
      [46, 'Step 4 - cardinality: many subjects in RESULTS',
        `<p class="y-chinh">🎯 The "∞" (many) at RESULTS on the subject arrow: a subject can be listed many times in RESULTS, once per student taking it.</p>
<p>The deck's text export shows this symbol as "8" — on the picture it is ∞. Subject alone is not unique in RESULTS; only the pair (StudentID, Subject) is.</p>`,
        `<p class="y-chinh">🎯 Ký hiệu "∞" (nhiều) ở phía RESULTS trên mũi tên môn học: một môn có thể xuất hiện nhiều lần trong RESULTS, mỗi lần cho một sinh viên học môn đó.</p>
<p>Bản chữ của slide hiện ký hiệu này thành "8" — trên hình là ∞. Riêng Subject không duy nhất trong RESULTS; chỉ cặp (StudentID, Subject) mới duy nhất.</p>`],
      [47, 'Step 4 - cardinality: many students in RESULTS',
        `<p class="y-chinh">🎯 The second "∞": a student can be listed many times in RESULTS, once per subject — the query above counts 3 rows for 19594332X.</p>
<p>Together: STUDENT 1 — ∞ RESULTS ∞ — 1 SUBJECTS. RESULTS is the junction table of a many-to-many relationship between students and subjects, with Grade as the attribute of that relationship — exactly how an E/R many-to-many relationship becomes a table (web Chapter 3).</p>
<p class="meo">🧠 <strong>Remember:</strong> the foreign key always lives on the "many" side.</p>`,
        `<p class="y-chinh">🎯 Ký hiệu "∞" thứ hai: một sinh viên có thể xuất hiện nhiều lần trong RESULTS, mỗi lần một môn — câu truy vấn ở trên đếm được 3 dòng cho 19594332X.</p>
<p>Gộp lại: STUDENT 1 — ∞ RESULTS ∞ — 1 SUBJECTS. RESULTS là bảng trung gian (junction table) của một quan hệ nhiều–nhiều giữa sinh viên và môn học, với Grade là thuộc tính của quan hệ đó — đúng cách một liên kết nhiều–nhiều của mô hình E/R trở thành bảng (Chương 3 trên web).</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> khoá ngoại luôn nằm ở phía "nhiều".</p>`],
      [48, 'A 2NF check - SubjectCost',
        `<p class="y-chinh">🎯 In SUBJECTS, SubjectCost depends only on the primary key Subject — fine for 2NF.</p>
<p>A one-attribute key cannot have a "part", so a partial dependency is impossible in SUBJECTS (and in STUDENT). The only table where 2NF must really be checked is RESULTS, the one with a composite key.</p>`,
        `<p class="y-chinh">🎯 Trong SUBJECTS, SubjectCost chỉ phụ thuộc vào khoá chính Subject — ổn với 2NF.</p>
<p>Khoá một thuộc tính không có "một phần", nên phụ thuộc bộ phận không thể xảy ra trong SUBJECTS (và cả STUDENT). Bảng duy nhất thật sự phải kiểm 2NF là RESULTS, bảng có khoá ghép.</p>`],
      [49, 'A 2NF check - Grade',
        `<p class="y-chinh">🎯 In RESULTS, Grade depends on the whole key (StudentID + Subject) — a full dependency, so RESULTS is in 2NF.</p>
<table>
<thead><tr><th>Left side tried</th><th>Closure (with F)</th><th>Contains Grade?</th></tr></thead>
<tbody>
<tr><td>{StudentID}</td><td>{StudentID, StudentName, Address, HouseName, HouseColor}</td><td>no</td></tr>
<tr><td>{Subject}</td><td>{Subject, SubjectCost}</td><td>no</td></tr>
<tr><td>{StudentID, Subject}</td><td>all attributes</td><td>yes</td></tr>
</tbody>
</table>
<p>Neither half alone reaches Grade, so (StudentID, Subject) → Grade is a <strong>full</strong> functional dependency.</p>`,
        `<p class="y-chinh">🎯 Trong RESULTS, Grade phụ thuộc vào cả khoá (StudentID + Subject) — phụ thuộc đầy đủ, nên RESULTS đạt 2NF.</p>
<table>
<thead><tr><th>Vế trái thử</th><th>Bao đóng (theo F)</th><th>Chứa Grade?</th></tr></thead>
<tbody>
<tr><td>{StudentID}</td><td>{StudentID, StudentName, Address, HouseName, HouseColor}</td><td>không</td></tr>
<tr><td>{Subject}</td><td>{Subject, SubjectCost}</td><td>không</td></tr>
<tr><td>{StudentID, Subject}</td><td>mọi thuộc tính</td><td>có</td></tr>
</tbody>
</table>
<p>Không nửa nào một mình với tới Grade, nên (StudentID, Subject) → Grade là phụ thuộc hàm <strong>đầy đủ</strong>.</p>`],
      [50, 'A 2NF check - Name and Address',
        `<p class="y-chinh">🎯 In STUDENT, StudentName and Address depend only on the primary key StudentID — also fine for 2NF.</p>
<p>All three tables pass the 2NF test: every non-key column depends on the whole key of <em>its own</em> table. Note the change of viewpoint: StudentID → StudentName was a partial dependency in the 1NF table (StudentID was half of the key) and is a normal key dependency in STUDENT.</p>`,
        `<p class="y-chinh">🎯 Trong STUDENT, StudentName và Address chỉ phụ thuộc vào khoá chính StudentID — cũng ổn với 2NF.</p>
<p>Cả ba bảng đều qua phép kiểm 2NF: mọi cột không khoá phụ thuộc vào toàn bộ khoá của <em>chính bảng đó</em>. Để ý góc nhìn thay đổi: StudentID → StudentName là phụ thuộc bộ phận trong bảng 1NF (StudentID là nửa khoá), nhưng là phụ thuộc vào khoá bình thường trong STUDENT.</p>`],
      [51, 'So it is 2NF - but is it 3NF?',
        `<p class="y-chinh">🎯 The three-table design is in 2NF; the next question is whether it is also in 3NF.</p>
<p>2NF only asked "does part of the key determine a non-key column?". 3NF asks a new question: "does a non-key column determine another non-key column?" — and STUDENT still has HouseName and HouseColor side by side.</p>`,
        `<p class="y-chinh">🎯 Thiết kế ba bảng đã đạt 2NF; câu hỏi tiếp theo là nó có đạt cả 3NF không.</p>
<p>2NF chỉ hỏi "có phần nào của khoá xác định một cột không khoá không?". 3NF hỏi câu mới: "có cột không khoá nào xác định một cột không khoá khác không?" — và STUDENT vẫn còn HouseName và HouseColor đứng cạnh nhau.</p>`],
      [52, '3NF',
        `<p class="y-chinh">🎯 R is in 3NF when it is in 2NF and no non-key attribute is transitively dependent on the primary key (A → B → C with B not a key).</p>
<ul>
<li><strong>Transitive dependency</strong>: C depends on A through B (A → B and B → C). It is a problem when B is a non-key attribute: B's facts are repeated for every A.</li>
<li><strong>The slide's note</strong>: a chain through another <em>candidate key</em> is not a violation. Student(StudentID, Email, Name) with StudentID → Email and Email → Name, where Email is unique: StudentID → Email → Name looks transitive, but Email is a key, so the table is in 3NF (even BCNF — checked with closures: keys {StudentID} and {Email}).</li>
<li>The formal version (slide 69): for every non-trivial X → A, X is a superkey <strong>or</strong> A is a prime attribute (belongs to some key).</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> 3NF = every non-key column depends on "the key, the whole key, and nothing but the key".</p>`,
        `<p class="y-chinh">🎯 R đạt 3NF khi đạt 2NF và không thuộc tính không khoá nào phụ thuộc bắc cầu vào khoá chính (A → B → C với B không phải khoá).</p>
<ul>
<li><strong>Phụ thuộc bắc cầu (transitive dependency)</strong>: C phụ thuộc A thông qua B (A → B và B → C). Nó gây hại khi B là thuộc tính không khoá: thông tin của B bị lặp lại cho mỗi A.</li>
<li><strong>Ghi chú của slide</strong>: chuỗi đi qua một <em>khoá ứng viên</em> khác không phải vi phạm. Student(StudentID, Email, Name) với StudentID → Email và Email → Name, Email là duy nhất: StudentID → Email → Name trông như bắc cầu, nhưng Email là khoá, nên bảng đạt 3NF (thậm chí BCNF — đã kiểm bằng bao đóng: khoá {StudentID} và {Email}).</li>
<li>Bản hình thức (slide 69): với mọi X → A không tầm thường, X là siêu khoá <strong>hoặc</strong> A là thuộc tính khoá (prime — thuộc một khoá nào đó).</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> 3NF = mọi cột không khoá phụ thuộc vào "khoá, cả khoá, và chỉ khoá mà thôi".</p>`],
      [53, 'A 3NF check - Oh oh',
        `<p class="y-chinh">🎯 Checking 3NF table by table, STUDENT raises an alarm ("Oh oh… What?").</p>
<p>SUBJECTS has one non-key column, RESULTS has one non-key column: no non-key column can determine another there. STUDENT has four non-key columns — StudentName, Address, HouseName, HouseColor — so the question is whether one of them determines another.</p>`,
        `<p class="y-chinh">🎯 Kiểm 3NF từng bảng một, STUDENT kêu báo động ("Oh oh… What?").</p>
<p>SUBJECTS có một cột không khoá, RESULTS có một cột không khoá: ở đó không cột không khoá nào xác định được cột khác. STUDENT có bốn cột không khoá — StudentName, Address, HouseName, HouseColor — nên câu hỏi là có cột nào trong đó xác định cột khác không.</p>`],
      [54, 'A 3NF check - HouseName',
        `<p class="y-chinh">🎯 HouseName depends not only on StudentID but also on HouseColour — two ways to reach the same fact.</p>
<p>The underlying rule is a fact about houses, not about students: a house has one colour (Bob is always Red). So <strong>HouseName → HouseColor</strong>, and StudentID → HouseName → HouseColor is a transitive dependency through a non-key attribute.</p>
<table>
<thead><tr><th>X</th><th>X⁺ in STUDENT (with F)</th><th>Superkey of STUDENT?</th></tr></thead>
<tbody>
<tr><td>{StudentID}</td><td>{StudentID, StudentName, Address, HouseName, HouseColor}</td><td>yes — the key</td></tr>
<tr><td>{HouseName}</td><td>{HouseName, HouseColor}</td><td>no ⇒ HouseName → HouseColor violates 3NF</td></tr>
</tbody>
</table>
<p>Projecting F onto STUDENT (Algorithm 3.12) gives the minimal basis {StudentID → StudentName, StudentID → Address, StudentID → HouseName, HouseName → HouseColor}: StudentID → HouseColor is not even needed — it follows by transitivity.</p>`,
        `<p class="y-chinh">🎯 HouseName không chỉ phụ thuộc StudentID mà còn "dính" với HouseColour — hai đường tới cùng một sự thật.</p>
<p>Luật thật sự đằng sau là một sự thật về nhà (house), không phải về sinh viên: mỗi nhà có một màu (Bob luôn là Red). Nên <strong>HouseName → HouseColor</strong>, và StudentID → HouseName → HouseColor là phụ thuộc bắc cầu qua một thuộc tính không khoá.</p>
<table>
<thead><tr><th>X</th><th>X⁺ trong STUDENT (theo F)</th><th>Siêu khoá của STUDENT?</th></tr></thead>
<tbody>
<tr><td>{StudentID}</td><td>{StudentID, StudentName, Address, HouseName, HouseColor}</td><td>có — là khoá</td></tr>
<tr><td>{HouseName}</td><td>{HouseName, HouseColor}</td><td>không ⇒ HouseName → HouseColor vi phạm 3NF</td></tr>
</tbody>
</table>
<p>Chiếu F lên STUDENT (thuật toán 3.12) cho phủ tối thiểu {StudentID → StudentName, StudentID → Address, StudentID → HouseName, HouseName → HouseColor}: StudentID → HouseColor thậm chí không cần — nó suy ra bằng bắc cầu.</p>`],
      [55, 'A 3NF check - or HouseColour',
        `<p class="y-chinh">🎯 Or the other way round: HouseColour is determined by HouseName as well as by StudentID — if colours are unique per house, HouseColor → HouseName holds too.</p>
<p>The slide leaves the direction open, and it does not matter: with HouseName → HouseColor alone, or with both directions, STUDENT is in 2NF but not 3NF (checked by script — the key stays {StudentID} and each of the two FDs has a non-superkey left side and a non-prime right side).</p>
<div class="pitfall">The slide's wording "dependent on both StudentID + HouseColour" does not mean the FD StudentID, HouseColour → HouseName. It means "determined by StudentID <em>and also</em> by HouseColour". In an exam, write the real FD: HouseName → HouseColor.</div>`,
        `<p class="y-chinh">🎯 Hoặc theo chiều ngược lại: HouseColour được HouseName xác định, cũng như được StudentID xác định — nếu mỗi nhà một màu riêng thì HouseColor → HouseName cũng đúng.</p>
<p>Slide để ngỏ chiều nào, và điều đó không quan trọng: chỉ với HouseName → HouseColor, hay với cả hai chiều, STUDENT đều đạt 2NF mà không đạt 3NF (đã kiểm bằng script — khoá vẫn là {StudentID}, và mỗi FD trong hai FD đó có vế trái không phải siêu khoá, vế phải không phải thuộc tính khoá).</p>
<div class="pitfall">Câu chữ của slide "dependent on both StudentID + HouseColour" không có nghĩa là FD StudentID, HouseColour → HouseName. Nó nghĩa là "được StudentID xác định <em>và cũng</em> được HouseColour xác định". Khi thi, hãy ghi FD thật: HouseName → HouseColor.</div>`],
      [56, 'A 3NF check - more than the primary key',
        `<p class="y-chinh">🎯 Either way, non-key fields depend on MORE THAN THE PRIMARY KEY (studentID): something other than the key also determines them.</p>
<p>The cost shows up as soon as a second student joins house Bob: "Red" is stored again. Repaint house Bob blue and you must update every student of that house — the update anomaly again, one level down.</p>`,
        `<p class="y-chinh">🎯 Chiều nào cũng vậy, các cột không khoá phụ thuộc vào NHIỀU HƠN KHOÁ CHÍNH (studentID): ngoài khoá còn có thứ khác xác định chúng.</p>
<p>Cái giá lộ ra ngay khi sinh viên thứ hai vào nhà Bob: "Red" lại được lưu thêm lần nữa. Sơn nhà Bob sang màu xanh thì phải sửa mọi sinh viên của nhà đó — lại là bất thường cập nhật, chỉ ở tầng thấp hơn.</p>`],
      [57, 'A 3NF check - nothing but the key',
        `<p class="y-chinh">🎯 3NF says non-key fields must depend on nothing but the key — HouseColor breaks that rule in STUDENT.</p>
<table>
<thead><tr><th>Table</th><th>Key</th><th>Non-key → non-key FD?</th><th>3NF?</th></tr></thead>
<tbody>
<tr><td>STUDENT</td><td>StudentID</td><td>HouseName → HouseColor</td><td>no</td></tr>
<tr><td>SUBJECTS</td><td>Subject</td><td>—</td><td>yes</td></tr>
<tr><td>RESULTS</td><td>StudentID, Subject</td><td>—</td><td>yes</td></tr>
</tbody>
</table>`,
        `<p class="y-chinh">🎯 3NF nói cột không khoá chỉ được phụ thuộc vào khoá mà thôi — HouseColor phá luật đó trong STUDENT.</p>
<table>
<thead><tr><th>Bảng</th><th>Khoá</th><th>FD không khoá → không khoá?</th><th>3NF?</th></tr></thead>
<tbody>
<tr><td>STUDENT</td><td>StudentID</td><td>HouseName → HouseColor</td><td>không</td></tr>
<tr><td>SUBJECTS</td><td>Subject</td><td>—</td><td>có</td></tr>
<tr><td>RESULTS</td><td>StudentID, Subject</td><td>—</td><td>có</td></tr>
</tbody>
</table>`],
      [58, 'A 3NF check - what do we do',
        `<p class="y-chinh">🎯 "WHAT DO WE DO?" — the same medicine as for 2NF: carve the offending FD out into its own table (slide 59).</p>
<p>The rule is general: for a violating FD X → A, put X ∪ {A} in a new table keyed by X, and remove A from the old table (keep X there as a foreign key). Here X = HouseName, A = HouseColor.</p>
<p class="meo">🧠 <strong>Remember:</strong> the left side of the bad FD becomes the key of the new table <em>and</em> stays behind as the link.</p>
<p><strong>Seen as an ERD:</strong> a 3NF violation means the ERD is missing an entity on the "one" side of a many-to-one relationship. Here HOUSE (key HouseName, attribute HouseColor) was drawn as two plain attributes of STUDENT; the correct ERD has STUDENT ──&lt; lives in &gt;── HOUSE, many students to one house — and a many-to-one relationship becomes a foreign key HouseName in StudentTable.</p>`,
        `<p class="y-chinh">🎯 "WHAT DO WE DO?" (làm gì bây giờ?) — cùng một liều thuốc như 2NF: cắt FD gây lỗi ra thành bảng riêng (slide 59).</p>
<p>Luật tổng quát: với FD vi phạm X → A, đặt X ∪ {A} vào một bảng mới có khoá X, và bỏ A khỏi bảng cũ (giữ lại X ở đó làm khoá ngoại). Ở đây X = HouseName, A = HouseColor.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> vế trái của FD xấu thành khoá của bảng mới <em>và</em> ở lại bảng cũ làm cầu nối.</p>
<p><strong>Nhìn bằng ERD:</strong> vi phạm 3NF nghĩa là ERD thiếu một thực thể ở phía "một" của một liên kết nhiều–một. Ở đây HOUSE (khoá HouseName, thuộc tính HouseColor) bị vẽ thành hai thuộc tính thường của STUDENT; ERD đúng là STUDENT ──&lt; ở tại &gt;── HOUSE, nhiều sinh viên một nhà — và liên kết nhiều–một trở thành khoá ngoại HouseName trong StudentTable.</p>`],
    ]),
    bi(`<h3>✅ Check yourself in 60 seconds</h3>
<ol>
<li>Why can SUBJECTS never violate 2NF?</li>
<li>Where does the foreign key go in a 1 — ∞ relationship?</li>
<li>Employee(EmpID, DeptID, DeptName) with EmpID → DeptID, DeptID → DeptName. Highest normal form?</li>
<li>Is StudentID → Email → Name a 3NF violation when Email is unique?</li>
</ol>
<p class="dap-an">✅ <strong>Answers:</strong> (1) Its key has one attribute, so there is no "part of the key". (2) On the ∞ side (RESULTS). (3) 2NF: the key EmpID is a single attribute, but DeptID → DeptName is transitive through a non-key attribute. (4) No — Email is a candidate key (slide 52's note).</p>`,
    `<h3>✅ Tự kiểm tra trong 60 giây</h3>
<ol>
<li>Vì sao SUBJECTS không bao giờ vi phạm 2NF?</li>
<li>Trong quan hệ 1 — ∞, khoá ngoại đặt ở đâu?</li>
<li>Employee(EmpID, DeptID, DeptName) với EmpID → DeptID, DeptID → DeptName. Dạng chuẩn cao nhất?</li>
<li>StudentID → Email → Name có vi phạm 3NF không khi Email là duy nhất?</li>
</ol>
<p class="dap-an">✅ <strong>Đáp án:</strong> (1) Khoá của nó chỉ một thuộc tính, không có "một phần của khoá". (2) Ở phía ∞ (RESULTS). (3) 2NF: khoá EmpID một thuộc tính, nhưng DeptID → DeptName là bắc cầu qua thuộc tính không khoá. (4) Không — Email là khoá ứng viên (ghi chú của slide 52).</p>`),
    books([
      ['ullman', 'Ch.3 — §3.5 Third Normal Form (§3.5.1 Definition of Third Normal Form) · Ch.4 §4.5 From E/R Diagrams to Relational Designs (many-many relationship → junction table)', 'Chương 3 — §3.5 Third Normal Form (§3.5.1 định nghĩa 3NF) · Chương 4 §4.5 From E/R Diagrams to Relational Designs (quan hệ nhiều–nhiều → bảng trung gian)'],
      ['ramakrishnan', 'Ch.19 — §19.4 Normal Forms (§19.4.1 BCNF · §19.4.2 Third Normal Form)', 'Chương 19 — §19.4 các dạng chuẩn (§19.4.1 BCNF · §19.4.2 3NF)'],
    ]),
  ].join('\n'),
};

/* ───────── 4.D — 📑 Slide by slide · The 3NF fix, BCNF and the two decomposition algorithms (Chapter 3, slides 59–73) ───────── */
const L_dbi4_4 = {
  title: '4.D — 📑 Slide by slide · The 3NF fix, BCNF and the two decomposition algorithms (Chapter 3, slides 59–73)|||4.D — 📑 Học theo từng slide · Sửa về 3NF, BCNF và hai thuật toán phân rã (Chapter 3, slide 59–73)',
  slug: 'dbi202-slide-dbi4-4',
  type: 'VIDEO',
  description: 'Giảng từng slide 59–73 của bộ slide Chapter 3 của trường: tách HouseTable để đạt 3NF, bốn bảng cuối cùng tạo và nối lại thật trên SQL Server (có ô string_agg của PostgreSQL), BCNF và ba ví dụ Movies, khác nhau giữa 3NF và BCNF, thuật toán phân rã BCNF và tổng hợp 3NF chạy từng bước trên bảng sinh viên (kiểm bằng script, bảng chase), hai bảng tóm tắt — kèm chỗ slide 72 nói chưa chính xác.',
  content: [
    bi(`<span class="eyebrow">Chapter 4 · Lesson 4.D · school slides "Chapter 3", slides 59–73</span>
<h2>The 3NF fix, BCNF, and the algorithms behind them</h2>
<p class="lead">⚠️ The last part of the school's <strong>"Chapter 3"</strong> deck (web Chapter 4). Slides 59–63 finish the student example (four tables, all in 3NF — and in BCNF), slides 64–69 define BCNF and compare it with 3NF, slides 70–71 give the two decomposition algorithms marked "self studying" — which is exactly why they are worked through step by step here — and slides 72–73 summarise.</p>
<div class="callout"><strong>Exam note.</strong> The "self studying" algorithms are the ones behind the classic FE/PT question "decompose R into BCNF / 3NF". Every decomposition below was produced and checked by a script (closures, keys, chase table, dependency preservation) — not by hand.</div>`,
    `<span class="eyebrow">Chương 4 · Bài 4.D · slide "Chapter 3" của trường, slide 59–73</span>
<h2>Sửa về 3NF, BCNF, và các thuật toán đằng sau</h2>
<p class="lead">⚠️ Phần cuối của bộ slide <strong>"Chapter 3"</strong> của trường (Chương 4 trên web). Slide 59–63 kết thúc ví dụ sinh viên (bốn bảng, đều đạt 3NF — và cả BCNF), slide 64–69 định nghĩa BCNF và so sánh với 3NF, slide 70–71 cho hai thuật toán phân rã được ghi "self studying" (tự học) — chính vì vậy chúng được làm từng bước ở đây — và slide 72–73 tóm tắt.</p>
<div class="callout"><strong>Lưu ý thi cử.</strong> Hai thuật toán "tự học" chính là thứ đứng sau câu FE/PT kinh điển "phân rã R về BCNF / 3NF". Mọi phép phân rã dưới đây được sinh và kiểm bằng script (bao đóng, khoá, bảng chase, bảo toàn phụ thuộc) — không làm tay.</div>`),
    walkHead('dbi4', 59, 73),
    walk('dbi4', [
      [59, 'Again, carve off the offending fields',
        `<p class="y-chinh">🎯 HouseColor leaves STUDENT: the new StudentTable keeps StudentID, StudentName, Address, HouseName (primary key StudentID).</p>
<p>HouseName stays in StudentTable — it is the left side of the offending FD and becomes the link (foreign key) to the table that will hold the colour. SUBJECTS and RESULTS are untouched: they were already in 3NF.</p>`,
        `<p class="y-chinh">🎯 HouseColor rời khỏi STUDENT: StudentTable mới giữ StudentID, StudentName, Address, HouseName (khoá chính StudentID).</p>
<p>HouseName ở lại StudentTable — nó là vế trái của FD gây lỗi và trở thành cầu nối (khoá ngoại) tới bảng sẽ giữ màu. SUBJECTS và RESULTS không đổi: chúng đã đạt 3NF từ trước.</p>`],
      [60, 'A 3NF fix - HouseTable',
        `<p class="y-chinh">🎯 The carved-off fields form HouseTable(HouseName, HouseColor) with primary key HouseName — one row: Bob, Red.</p>
<p>Check with closures: in HouseTable, {HouseName}⁺ = {HouseName, HouseColor}, so HouseName is its key and HouseName → HouseColor is now a key dependency — allowed by 3NF and by BCNF.</p>`,
        `<p class="y-chinh">🎯 Các cột bị cắt ra tạo thành HouseTable(HouseName, HouseColor), khoá chính HouseName — một dòng: Bob, Red.</p>
<p>Kiểm bằng bao đóng: trong HouseTable, {HouseName}⁺ = {HouseName, HouseColor}, nên HouseName là khoá và HouseName → HouseColor giờ là phụ thuộc vào khoá — được cả 3NF lẫn BCNF cho phép.</p>`],
      [61, 'A 3NF fix - the new relationship',
        `<p class="y-chinh">🎯 A new relationship: StudentTable ∞ — 1 HouseTable — many students live in one house, each house appears once.</p>
<p>Same pattern as before: the foreign key StudentTable.HouseName is on the "many" side. Repainting house Bob is now one UPDATE on one row of HouseTable, however many students live there.</p>`,
        `<p class="y-chinh">🎯 Một quan hệ mới: StudentTable ∞ — 1 HouseTable — nhiều sinh viên ở một nhà, mỗi nhà xuất hiện một lần.</p>
<p>Cùng mẫu như trước: khoá ngoại StudentTable.HouseName nằm ở phía "nhiều". Sơn lại nhà Bob giờ chỉ là một câu UPDATE trên một dòng của HouseTable, dù bao nhiêu sinh viên ở đó.</p>`],
      [62, 'A 3NF win - or the diagram',
        `<p class="y-chinh">🎯 Four tables, all in 3NF — drawn a second way as a schema diagram with the primary keys starred.</p>
<table>
<thead><tr><th>Table (* = primary key)</th><th>Relationship</th></tr></thead>
<tbody>
<tr><td>StudentTable(StudentID*, StudentName, Address, HouseName)</td><td>1 — ∞ GradesTable; ∞ — 1 HouseTable</td></tr>
<tr><td>GradesTable(StudentID*, Subject*, Grade)</td><td>∞ — 1 SubjectTable</td></tr>
<tr><td>SubjectTable(Subject*, SubjectCost)</td><td>—</td></tr>
<tr><td>HouseTable(HouseName*, HouseColour)</td><td>—</td></tr>
</tbody>
</table>
<p>RESULTS of the earlier slides is called GradesTable in this diagram; it is the same table.</p>`,
        `<p class="y-chinh">🎯 Bốn bảng, đều đạt 3NF — vẽ lại lần hai dưới dạng sơ đồ lược đồ, khoá chính đánh dấu sao.</p>
<table>
<thead><tr><th>Bảng (* = khoá chính)</th><th>Quan hệ</th></tr></thead>
<tbody>
<tr><td>StudentTable(StudentID*, StudentName, Address, HouseName)</td><td>1 — ∞ GradesTable; ∞ — 1 HouseTable</td></tr>
<tr><td>GradesTable(StudentID*, Subject*, Grade)</td><td>∞ — 1 SubjectTable</td></tr>
<tr><td>SubjectTable(Subject*, SubjectCost)</td><td>—</td></tr>
<tr><td>HouseTable(HouseName*, HouseColour)</td><td>—</td></tr>
</tbody>
</table>
<p>RESULTS ở các slide trước được gọi là GradesTable trong sơ đồ này; đó là cùng một bảng.</p>`],
      [63, 'The Reveal - before and after',
        `<p class="y-chinh">🎯 Before: one table with a repeating group; after: four 3NF tables that together hold exactly the same information.</p>
<p>"Exactly the same information" is a claim you can test: build the four tables and join them back.</p>
<pre><code class="language-sql">CREATE TABLE HouseTable (                    -- key = HouseName
  HouseName  VARCHAR(20) PRIMARY KEY,
  HouseColor VARCHAR(10)
);
CREATE TABLE StudentTable (                  -- key = StudentID
  StudentID   VARCHAR(10) PRIMARY KEY,
  StudentName VARCHAR(30), Address VARCHAR(40),
  HouseName   VARCHAR(20) REFERENCES HouseTable(HouseName)
);
CREATE TABLE SubjectTable (
  Subject     VARCHAR(20) PRIMARY KEY,
  SubjectCost MONEY
);
CREATE TABLE GradesTable (
  StudentID VARCHAR(10) REFERENCES StudentTable(StudentID),
  Subject   VARCHAR(20) REFERENCES SubjectTable(Subject),
  Grade     VARCHAR(2),
  PRIMARY KEY (StudentID, Subject)
);
INSERT INTO HouseTable   VALUES ('Bob', 'Red');
INSERT INTO StudentTable VALUES ('19594332X', 'Mary Watson', '10 Charles Street', 'Bob');
INSERT INTO SubjectTable VALUES ('English', 50), ('Maths', 50), ('Info Tech', 100);
INSERT INTO GradesTable  VALUES ('19594332X', 'English', 'B'), ('19594332X', 'Maths', 'A'),
                                ('19594332X', 'Info Tech', 'B+');</code></pre>
<pre><code class="language-sql">-- "Before" rebuilt from the four 3NF tables
SELECT st.StudentID, st.StudentName, st.Address, st.HouseName, h.HouseColor,
       g.Subject, sb.SubjectCost, g.Grade
FROM StudentTable st
JOIN HouseTable   h  ON h.HouseName = st.HouseName
JOIN GradesTable  g  ON g.StudentID = st.StudentID
JOIN SubjectTable sb ON sb.Subject  = g.Subject
ORDER BY g.Subject;

-- The same data as ONE row with a repeating group (not 1NF)
SELECT st.StudentID, st.StudentName,
       STRING_AGG(g.Subject, ', ') WITHIN GROUP (ORDER BY g.Subject) AS Subjects
FROM StudentTable st JOIN GradesTable g ON g.StudentID = st.StudentID
GROUP BY st.StudentID, st.StudentName;</code></pre>
<div class="out">(1 row affected)<br>
(1 row affected)<br>
(3 rows affected)<br>
(3 rows affected)</div>
<table>
<thead><tr><th>StudentID</th><th>StudentName</th><th>Address</th><th>HouseName</th><th>HouseColor</th><th>Subject</th><th>SubjectCost</th><th>Grade</th></tr></thead>
<tbody>
<tr><td>19594332X</td><td>Mary Watson</td><td>10 Charles Street</td><td>Bob</td><td>Red</td><td>English</td><td>50.0000</td><td>B</td></tr>
<tr><td>19594332X</td><td>Mary Watson</td><td>10 Charles Street</td><td>Bob</td><td>Red</td><td>Info Tech</td><td>100.0000</td><td>B+</td></tr>
<tr><td>19594332X</td><td>Mary Watson</td><td>10 Charles Street</td><td>Bob</td><td>Red</td><td>Maths</td><td>50.0000</td><td>A</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>StudentID</th><th>StudentName</th><th>Subjects</th></tr></thead>
<tbody>
<tr><td>19594332X</td><td>Mary Watson</td><td>English, Info Tech, Maths</td></tr>
</tbody>
</table>
<p>The first result is the 1NF table of slide 33, row for row; the second is even the unnormalized "Before" row of slide 30, rebuilt as a report with <code>STRING_AGG</code>. The decomposition is lossless — and by closures each of the four tables is in fact in <strong>BCNF</strong>, not only 3NF (every FD inside a table has the table's key on the left).</p>
<ul>
<li><code>FROM StudentTable st JOIN HouseTable h ON h.HouseName = st.HouseName</code> — each student row finds its house row through the foreign key; the three following <code>JOIN</code>s do the same for grades and subjects.</li>
<li><code>STRING_AGG(g.Subject, ', ') WITHIN GROUP (ORDER BY g.Subject)</code> — glue the subjects of one group into one string, in alphabetical order; <code>GROUP BY</code> makes one group per student.</li>
</ul>
<div class="callout">🐘 <strong>On PostgreSQL</strong> the ordered string aggregate is written differently: the <code>ORDER BY</code> goes inside the call, and there is no <code>WITHIN GROUP</code>.
<pre><code class="language-sql">CREATE TABLE student_table (student_id VARCHAR(10) PRIMARY KEY, student_name VARCHAR(30));
CREATE TABLE grades_table (student_id VARCHAR(10) REFERENCES student_table, subject VARCHAR(20),
                           grade VARCHAR(2), PRIMARY KEY (student_id, subject));
INSERT INTO student_table VALUES ('19594332X', 'Mary Watson');
INSERT INTO grades_table VALUES ('19594332X', 'English', 'B'), ('19594332X', 'Maths', 'A'),
                                ('19594332X', 'Info Tech', 'B+');
-- ORDER BY goes INSIDE string_agg(...) — no WITHIN GROUP
SELECT s.student_id, s.student_name,
       string_agg(g.subject, ', ' ORDER BY g.subject) AS subjects
FROM student_table s JOIN grades_table g USING (student_id)
GROUP BY s.student_id, s.student_name;</code></pre>
<div class="out">INSERT 0 1<br>
INSERT 0 3</div>
<table>
<thead><tr><th>student_id</th><th>student_name</th><th>subjects</th></tr></thead>
<tbody>
<tr><td>19594332X</td><td>Mary Watson</td><td>English, Info Tech, Maths</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-6-1-ham-tong-hop">PostgreSQL 6.1 — aggregate functions</a>.</div>`,
        `<p class="y-chinh">🎯 Trước: một bảng có nhóm lặp; sau: bốn bảng 3NF cùng nhau giữ đúng y nguyên thông tin đó.</p>
<p>"Đúng y nguyên thông tin" là một khẳng định kiểm được: dựng bốn bảng rồi nối lại.</p>
<pre><code class="language-sql">CREATE TABLE HouseTable (                    -- khoá = HouseName
  HouseName  VARCHAR(20) PRIMARY KEY,
  HouseColor VARCHAR(10)
);
CREATE TABLE StudentTable (                  -- khoá = StudentID
  StudentID   VARCHAR(10) PRIMARY KEY,
  StudentName VARCHAR(30), Address VARCHAR(40),
  HouseName   VARCHAR(20) REFERENCES HouseTable(HouseName)
);
CREATE TABLE SubjectTable (
  Subject     VARCHAR(20) PRIMARY KEY,
  SubjectCost MONEY
);
CREATE TABLE GradesTable (
  StudentID VARCHAR(10) REFERENCES StudentTable(StudentID),
  Subject   VARCHAR(20) REFERENCES SubjectTable(Subject),
  Grade     VARCHAR(2),
  PRIMARY KEY (StudentID, Subject)
);
INSERT INTO HouseTable   VALUES ('Bob', 'Red');
INSERT INTO StudentTable VALUES ('19594332X', 'Mary Watson', '10 Charles Street', 'Bob');
INSERT INTO SubjectTable VALUES ('English', 50), ('Maths', 50), ('Info Tech', 100);
INSERT INTO GradesTable  VALUES ('19594332X', 'English', 'B'), ('19594332X', 'Maths', 'A'),
                                ('19594332X', 'Info Tech', 'B+');</code></pre>
<pre><code class="language-sql">-- Dựng lại bảng "Before" từ bốn bảng 3NF
SELECT st.StudentID, st.StudentName, st.Address, st.HouseName, h.HouseColor,
       g.Subject, sb.SubjectCost, g.Grade
FROM StudentTable st
JOIN HouseTable   h  ON h.HouseName = st.HouseName
JOIN GradesTable  g  ON g.StudentID = st.StudentID
JOIN SubjectTable sb ON sb.Subject  = g.Subject
ORDER BY g.Subject;

-- Cùng dữ liệu thành MỘT dòng có nhóm lặp (không 1NF)
SELECT st.StudentID, st.StudentName,
       STRING_AGG(g.Subject, ', ') WITHIN GROUP (ORDER BY g.Subject) AS Subjects
FROM StudentTable st JOIN GradesTable g ON g.StudentID = st.StudentID
GROUP BY st.StudentID, st.StudentName;</code></pre>
<div class="out">(1 row affected)<br>
(1 row affected)<br>
(3 rows affected)<br>
(3 rows affected)</div>
<table>
<thead><tr><th>StudentID</th><th>StudentName</th><th>Address</th><th>HouseName</th><th>HouseColor</th><th>Subject</th><th>SubjectCost</th><th>Grade</th></tr></thead>
<tbody>
<tr><td>19594332X</td><td>Mary Watson</td><td>10 Charles Street</td><td>Bob</td><td>Red</td><td>English</td><td>50.0000</td><td>B</td></tr>
<tr><td>19594332X</td><td>Mary Watson</td><td>10 Charles Street</td><td>Bob</td><td>Red</td><td>Info Tech</td><td>100.0000</td><td>B+</td></tr>
<tr><td>19594332X</td><td>Mary Watson</td><td>10 Charles Street</td><td>Bob</td><td>Red</td><td>Maths</td><td>50.0000</td><td>A</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>StudentID</th><th>StudentName</th><th>Subjects</th></tr></thead>
<tbody>
<tr><td>19594332X</td><td>Mary Watson</td><td>English, Info Tech, Maths</td></tr>
</tbody>
</table>
<p>Kết quả thứ nhất là bảng 1NF của slide 33, khớp từng dòng; kết quả thứ hai còn dựng lại được cả dòng "Before" chưa chuẩn hoá của slide 30, dưới dạng báo cáo bằng <code>STRING_AGG</code>. Phép phân rã không mất thông tin — và kiểm bằng bao đóng thì mỗi bảng trong bốn bảng thực ra đạt <strong>BCNF</strong>, không chỉ 3NF (mọi FD trong một bảng đều có khoá của bảng ở vế trái).</p>
<ul>
<li><code>FROM StudentTable st JOIN HouseTable h ON h.HouseName = st.HouseName</code> — mỗi dòng sinh viên tìm tới dòng nhà của mình qua khoá ngoại; ba <code>JOIN</code> tiếp theo làm y như vậy cho điểm và môn học.</li>
<li><code>STRING_AGG(g.Subject, ', ') WITHIN GROUP (ORDER BY g.Subject)</code> — dán các môn của một nhóm thành một chuỗi, theo thứ tự chữ cái; <code>GROUP BY</code> tạo mỗi sinh viên một nhóm.</li>
</ul>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> hàm gộp chuỗi có sắp xếp viết khác: <code>ORDER BY</code> nằm bên trong lời gọi, và không có <code>WITHIN GROUP</code>.
<pre><code class="language-sql">CREATE TABLE student_table (student_id VARCHAR(10) PRIMARY KEY, student_name VARCHAR(30));
CREATE TABLE grades_table (student_id VARCHAR(10) REFERENCES student_table, subject VARCHAR(20),
                           grade VARCHAR(2), PRIMARY KEY (student_id, subject));
INSERT INTO student_table VALUES ('19594332X', 'Mary Watson');
INSERT INTO grades_table VALUES ('19594332X', 'English', 'B'), ('19594332X', 'Maths', 'A'),
                                ('19594332X', 'Info Tech', 'B+');
-- ORDER BY nằm TRONG string_agg(...) — không có WITHIN GROUP
SELECT s.student_id, s.student_name,
       string_agg(g.subject, ', ' ORDER BY g.subject) AS subjects
FROM student_table s JOIN grades_table g USING (student_id)
GROUP BY s.student_id, s.student_name;</code></pre>
<div class="out">INSERT 0 1<br>
INSERT 0 3</div>
<table>
<thead><tr><th>student_id</th><th>student_name</th><th>subjects</th></tr></thead>
<tbody>
<tr><td>19594332X</td><td>Mary Watson</td><td>English, Info Tech, Maths</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-6-1-ham-tong-hop">PostgreSQL 6.1 — hàm tổng hợp</a>.</div>`],
      [64, '3NF - no transitive dependencies',
        `<p class="y-chinh">🎯 A 3NF violation means the table contains an embedded entity (a "sub-table") with its own non-key attributes; BCNF is the same idea, but the embedded table may involve key attributes.</p>
<ul>
<li>The picture: a TABLE with a SUB-TABLE inside (StudentTable with House inside). The fix pulls the sub-table out and leaves a reference behind.</li>
<li>For 3NF the hidden entity is made of non-key attributes (HouseName, HouseColor).</li>
<li>For BCNF the hidden entity may use a key attribute — e.g. Bookings(title, theater, city) hides Theater(theater, city) although city belongs to the key {title, city}. 3NF tolerates that; BCNF does not.</li>
</ul>`,
        `<p class="y-chinh">🎯 Vi phạm 3NF nghĩa là bảng chứa một thực thể nhúng (một "bảng con") có thuộc tính không khoá của riêng nó; BCNF cùng ý đó, nhưng bảng nhúng có thể dính tới thuộc tính khoá.</p>
<ul>
<li>Hình vẽ: một TABLE có SUB-TABLE bên trong (StudentTable chứa House bên trong). Cách sửa là kéo bảng con ra và để lại một tham chiếu.</li>
<li>Với 3NF, thực thể ẩn gồm thuộc tính không khoá (HouseName, HouseColor).</li>
<li>Với BCNF, thực thể ẩn có thể dùng thuộc tính khoá — ví dụ Bookings(title, theater, city) giấu Theater(theater, city) dù city thuộc khoá {title, city}. 3NF chấp nhận chuyện đó; BCNF thì không.</li>
</ul>`],
      [65, 'BCNF',
        `<p class="y-chinh">🎯 R is in BCNF iff for every non-trivial FD A1…An → B1…Bm of R, {A1, …, An} is a superkey of R — the left side of every non-trivial FD must be a superkey.</p>
<p class="nhan">How to test BCNF in an exam</p>
<ol>
<li>Split F so each right side is one attribute; ignore trivial FDs (right side inside the left side).</li>
<li>For each FD X → A: compute X⁺. If X⁺ is not all of R, X is not a superkey ⇒ <strong>not BCNF</strong>.</li>
<li>If a relation is a projection, test the <em>projected</em> FDs (slide 16), not only the ones written in F.</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> every relation with exactly two attributes is in BCNF — whatever its FDs.</p>
<div class="pitfall">BCNF talks about <strong>superkeys</strong>, not keys: a left side that contains a key is fine. And there is no "prime attribute" escape clause — that clause is what 3NF adds (slide 69).</div>`,
        `<p class="y-chinh">🎯 R đạt BCNF khi và chỉ khi với mọi FD không tầm thường A1…An → B1…Bm của R, {A1, …, An} là siêu khoá của R — vế trái của mọi FD không tầm thường phải là siêu khoá.</p>
<p class="nhan">Cách kiểm BCNF khi đi thi</p>
<ol>
<li>Tách F cho mỗi vế phải một thuộc tính; bỏ qua FD tầm thường (vế phải nằm trong vế trái).</li>
<li>Với mỗi FD X → A: tính X⁺. Nếu X⁺ không phải cả R thì X không là siêu khoá ⇒ <strong>không đạt BCNF</strong>.</li>
<li>Nếu quan hệ là một phép chiếu thì kiểm các FD <em>đã chiếu</em> (slide 16), không chỉ các FD viết sẵn trong F.</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> mọi quan hệ có đúng hai thuộc tính đều đạt BCNF — FD của nó là gì cũng vậy.</p>
<div class="pitfall">BCNF nói về <strong>siêu khoá</strong>, không phải khoá: vế trái chứa một khoá là ổn. Và BCNF không có lối thoát "thuộc tính khoá (prime)" — lối thoát đó là thứ 3NF thêm vào (slide 69).</div>`],
      [66, 'Example - Movies1 is not in BCNF',
        `<p class="y-chinh">🎯 Movies1 is not in BCNF: in {title, year} → {length, genre, studioName}, the left side {title, year} is not a superkey.</p>
<table>
<thead><tr><th>X</th><th>X⁺</th><th>Superkey of Movies1(title, year, length, genre, studioName, starName)?</th></tr></thead>
<tbody>
<tr><td>{title, year}</td><td>{title, year, length, genre, studioName}</td><td>no — starName missing</td></tr>
<tr><td>{title, year, starName}</td><td>all six</td><td>yes — the only key</td></tr>
</tbody>
</table>
<p>Worse than "not BCNF": the key is {title, year, starName} and title, year → length is a dependency on <em>part</em> of it, so Movies1 is only in <strong>1NF</strong> (checked by script). Slide 23's decomposition is exactly the BCNF fix.</p>`,
        `<p class="y-chinh">🎯 Movies1 không đạt BCNF: trong {title, year} → {length, genre, studioName}, vế trái {title, year} không phải siêu khoá.</p>
<table>
<thead><tr><th>X</th><th>X⁺</th><th>Siêu khoá của Movies1(title, year, length, genre, studioName, starName)?</th></tr></thead>
<tbody>
<tr><td>{title, year}</td><td>{title, year, length, genre, studioName}</td><td>không — thiếu starName</td></tr>
<tr><td>{title, year, starName}</td><td>cả sáu</td><td>có — khoá duy nhất</td></tr>
</tbody>
</table>
<p>Còn tệ hơn "không BCNF": khoá là {title, year, starName} và title, year → length là phụ thuộc vào <em>một phần</em> của khoá, nên Movies1 chỉ đạt <strong>1NF</strong> (đã kiểm bằng script). Phép phân rã ở slide 23 chính là cách sửa về BCNF.</p>`],
      [67, 'Example - Movies (title, year, length, genre, studioName) is in BCNF',
        `<p class="y-chinh">🎯 The left piece Movies(title, year, length, genre, studioName) is in BCNF: its only non-trivial FDs have {title, year} on the left, which is its key.</p>
<p>The slide's second argument — "neither title nor year by itself determines any other attribute" — is what makes {title, year} a <em>key</em> (minimal), so no smaller left side can sneak in a violation. {title}⁺ = {title}, {year}⁺ = {year}.</p>`,
        `<p class="y-chinh">🎯 Mảnh bên trái Movies(title, year, length, genre, studioName) đạt BCNF: các FD không tầm thường duy nhất của nó có {title, year} ở vế trái, và đó là khoá của nó.</p>
<p>Lập luận thứ hai của slide — "cả title lẫn year đứng riêng đều không xác định thuộc tính nào khác" — là điều làm {title, year} thành <em>khoá</em> (tối tiểu), nên không vế trái nhỏ hơn nào lẻn vào gây vi phạm được. {title}⁺ = {title}, {year}⁺ = {year}.</p>`],
      [68, 'Example - StarsIn (title, year, starName) is in BCNF',
        `<p class="y-chinh">🎯 The right piece (title, year, starName) is in BCNF because it has no non-trivial FD at all.</p>
<p>Its only key is all three attributes (a film has several stars, a star plays in several films). With no non-trivial FD there is nothing that could violate the rule — an "all-key" relation is always in BCNF.</p>`,
        `<p class="y-chinh">🎯 Mảnh bên phải (title, year, starName) đạt BCNF vì nó không có FD không tầm thường nào.</p>
<p>Khoá duy nhất của nó là cả ba thuộc tính (một phim có nhiều ngôi sao, một ngôi sao đóng nhiều phim). Không có FD không tầm thường thì không có gì vi phạm được — quan hệ "toàn khoá" (all-key) luôn đạt BCNF.</p>`],
      [69, 'Differences between BCNF and 3NF',
        `<p class="y-chinh">🎯 For every non-trivial X → A: BCNF requires X to be a superkey; 3NF also accepts the case where A is a prime attribute (a member of some key).</p>
<table>
<thead><tr><th>Test for X → A (non-trivial)</th><th>3NF</th><th>BCNF</th></tr></thead>
<tbody>
<tr><td>X is a superkey</td><td>OK</td><td>OK</td></tr>
<tr><td>X not a superkey, A prime</td><td>OK</td><td>violation</td></tr>
<tr><td>X not a superkey, A non-prime</td><td>violation</td><td>violation</td></tr>
</tbody>
</table>
<p class="nhan">The smallest 3NF-but-not-BCNF example — R(A, B, C), F = {AB → C, C → B}</p>
<table>
<thead><tr><th>Step</th><th>Result</th></tr></thead>
<tbody>
<tr><td>keys</td><td>{A, B}⁺ = {A, B, C}; {A, C}⁺ = {A, B, C}; {A}⁺ = {A} ⇒ keys AB and AC; prime = A, B, C</td></tr>
<tr><td>AB → C</td><td>AB is a key ⇒ OK for both</td></tr>
<tr><td>C → B</td><td>C⁺ = {B, C} not a superkey; B is prime ⇒ OK for 3NF, violates BCNF</td></tr>
<tr><td>verdict</td><td>3NF, not BCNF (same shape as Bookings on slide 27)</td></tr>
</tbody>
</table>
<p><strong>Full functional dependency</strong> (the note on the slide): X → Y is full if removing any attribute from X breaks it; otherwise it is partial. 2NF forbids non-prime attributes that depend partially on a key.</p>`,
        `<p class="y-chinh">🎯 Với mọi X → A không tầm thường: BCNF đòi X là siêu khoá; 3NF còn chấp nhận trường hợp A là thuộc tính khoá (prime — thuộc một khoá nào đó).</p>
<table>
<thead><tr><th>Kiểm X → A (không tầm thường)</th><th>3NF</th><th>BCNF</th></tr></thead>
<tbody>
<tr><td>X là siêu khoá</td><td>đạt</td><td>đạt</td></tr>
<tr><td>X không là siêu khoá, A là thuộc tính khoá</td><td>đạt</td><td>vi phạm</td></tr>
<tr><td>X không là siêu khoá, A không phải thuộc tính khoá</td><td>vi phạm</td><td>vi phạm</td></tr>
</tbody>
</table>
<p class="nhan">Ví dụ nhỏ nhất đạt 3NF mà không đạt BCNF — R(A, B, C), F = {AB → C, C → B}</p>
<table>
<thead><tr><th>Bước</th><th>Kết quả</th></tr></thead>
<tbody>
<tr><td>khoá</td><td>{A, B}⁺ = {A, B, C}; {A, C}⁺ = {A, B, C}; {A}⁺ = {A} ⇒ khoá AB và AC; thuộc tính khoá = A, B, C</td></tr>
<tr><td>AB → C</td><td>AB là khoá ⇒ đạt cả hai</td></tr>
<tr><td>C → B</td><td>C⁺ = {B, C} không là siêu khoá; B là thuộc tính khoá ⇒ đạt 3NF, vi phạm BCNF</td></tr>
<tr><td>kết luận</td><td>3NF, không BCNF (cùng dạng với Bookings ở slide 27)</td></tr>
</tbody>
</table>
<p><strong>Phụ thuộc hàm đầy đủ (full functional dependency)</strong> (ghi chú trên slide): X → Y là đầy đủ nếu bỏ bất kỳ thuộc tính nào khỏi X là nó hỏng; ngược lại là phụ thuộc bộ phận (partial). 2NF cấm thuộc tính không khoá phụ thuộc bộ phận vào một khoá.</p>`],
      [70, 'BCNF decomposition algorithm (self studying)',
        `<p class="y-chinh">🎯 Repeat: find an FD X → Y that violates BCNF in the current relation, split it into R1(X ∪ Y) and R2(R − Y), project the FDs onto both; stop when every piece is in BCNF. The result always has a lossless join.</p>
<p>The slide writes R2(S − Y): S is the attribute set of the relation being split. Two practical details: take Y without the attributes of X, and — as Ullman does — take Y = X⁺ − X (everything X determines) to avoid many tiny tables.</p>
<p class="nhan">Run on the 1NF student table (I N A H C S K G), F = {I → NAHC, S → K, IS → G, H → C}, key IS</p>
<table>
<thead><tr><th>Relation</th><th>Violating FD</th><th>Split into</th></tr></thead>
<tbody>
<tr><td>INAHCSKG</td><td>H → C (H⁺ = HC)</td><td>HC + INAHSKG</td></tr>
<tr><td>INAHSKG</td><td>I → NAH (I⁺ ∩ R = INAH)</td><td>INAH + ISKG</td></tr>
<tr><td>ISKG</td><td>S → K (S⁺ = SK)</td><td>SK + ISG</td></tr>
<tr><td>HC, INAH, SK, ISG</td><td>none — each left side is the key of its piece</td><td>stop</td></tr>
</tbody>
</table>
<p>The result is exactly the four tables of slide 62. If you take only the single right-hand attribute each time (Y = one attribute), the same algorithm still ends in BCNF but produces 6 tables (I split into IA, IH, IN) — correct, but not what an examiner expects.</p>
<div class="pitfall">Pick the violating FD from the <strong>current</strong> piece's projected FDs. An FD of the original F whose attributes are no longer all in the piece cannot be used there.</div>
<div class="callout"><strong>✍️ BCNF decomposition in the exam room</strong>
<ol>
<li>Find all keys of R (slide 11 method).</li>
<li>Go through F: the first FD X → … whose X⁺ is not all of R is a violation. Compute X⁺.</li>
<li>Write R1 = X⁺ (restricted to R) and R2 = X ∪ (R − X⁺). Underline X in both: it is the join column.</li>
<li>For each piece, list the FDs that fit inside it (and those that come through closures), find its key, and repeat from step 2 if some left side is not a key of the piece.</li>
<li>Finish with a one-line check per split: "R1 ∩ R2 = X and X → R1, so lossless".</li>
</ol></div>`,
        `<p class="y-chinh">🎯 Lặp: tìm FD X → Y vi phạm BCNF trong quan hệ hiện tại, tách thành R1(X ∪ Y) và R2(R − Y), chiếu FD xuống cả hai; dừng khi mọi mảnh đều đạt BCNF. Kết quả luôn nối không mất thông tin.</p>
<p>Slide viết R2(S − Y): S là tập thuộc tính của quan hệ đang tách. Hai chi tiết thực hành: lấy Y không chứa thuộc tính của X, và — như Ullman làm — lấy Y = X⁺ − X (mọi thứ X xác định) để khỏi sinh ra nhiều bảng lẻ tẻ.</p>
<p class="nhan">Chạy trên bảng sinh viên 1NF (I N A H C S K G), F = {I → NAHC, S → K, IS → G, H → C}, khoá IS</p>
<table>
<thead><tr><th>Quan hệ</th><th>FD vi phạm</th><th>Tách thành</th></tr></thead>
<tbody>
<tr><td>INAHCSKG</td><td>H → C (H⁺ = HC)</td><td>HC + INAHSKG</td></tr>
<tr><td>INAHSKG</td><td>I → NAH (I⁺ ∩ R = INAH)</td><td>INAH + ISKG</td></tr>
<tr><td>ISKG</td><td>S → K (S⁺ = SK)</td><td>SK + ISG</td></tr>
<tr><td>HC, INAH, SK, ISG</td><td>không còn — vế trái nào cũng là khoá của mảnh</td><td>dừng</td></tr>
</tbody>
</table>
<p>Kết quả đúng bằng bốn bảng của slide 62. Nếu mỗi lần chỉ lấy một thuộc tính vế phải (Y = một thuộc tính), cùng thuật toán vẫn kết thúc ở BCNF nhưng sinh ra 6 bảng (I bị tách thành IA, IH, IN) — đúng, nhưng không phải thứ người chấm chờ đợi.</p>
<div class="pitfall">Chọn FD vi phạm trong các FD đã chiếu của mảnh <strong>hiện tại</strong>. FD của F gốc mà thuộc tính không còn nằm đủ trong mảnh thì không dùng ở đó được.</div>
<div class="callout"><strong>✍️ Phân rã BCNF trong phòng thi</strong>
<ol>
<li>Tìm mọi khoá của R (cách của slide 11).</li>
<li>Duyệt F: FD đầu tiên X → … mà X⁺ không phải cả R là một vi phạm. Tính X⁺.</li>
<li>Viết R1 = X⁺ (chỉ lấy thuộc tính của R) và R2 = X ∪ (R − X⁺). Gạch chân X ở cả hai: đó là cột để nối.</li>
<li>Với mỗi mảnh, liệt kê các FD nằm gọn trong nó (kể cả FD có được qua bao đóng), tìm khoá của mảnh, và lặp lại từ bước 2 nếu còn vế trái không phải khoá của mảnh.</li>
<li>Kết thúc bằng một dòng kiểm cho mỗi lần tách: "R1 ∩ R2 = X và X → R1, nên không mất thông tin".</li>
</ol></div>`],
      [71, '3NF decomposition algorithm (self studying)',
        `<p class="y-chinh">🎯 3NF synthesis: take a minimal basis G of F, make one relation XA for each FD X → A in G, and add a relation holding a key if none of them contains one — lossless and dependency-preserving.</p>
<p class="nhan">Same student table — step by step</p>
<table>
<thead><tr><th>Step</th><th>Result</th></tr></thead>
<tbody>
<tr><td>1. minimal basis G</td><td>{I → N, I → A, I → H, S → K, IS → G, H → C} (I → C dropped: it follows from I → H, H → C)</td></tr>
<tr><td>2. one relation per FD, same left sides merged</td><td>INAH, SK, ISG, HC</td></tr>
<tr><td>3. a relation containing a key?</td><td>ISG contains the key IS ⇒ nothing to add</td></tr>
</tbody>
</table>
<p>Same four tables as the BCNF algorithm — here both algorithms agree. They differ on Bookings(title, theater, city): G = {theater → city, title city → theater} gives (theater, city) and (title, city, theater); the first lies inside the second, so the usual extra step (not on the slide) drops it — the result is Bookings itself, in 3NF but not BCNF, with both FDs preserved.</p>
<p class="meo">🧠 <strong>Remember:</strong> BCNF = split top-down by violations (lossless, may lose FDs); 3NF = build bottom-up from a minimal basis (lossless and keeps every FD).</p>
<div class="pitfall">Step 3 is the one people forget. R(A, B, C, D) with F = {A → B, C → D}: step 2 gives AB and CD, neither contains the key AC — without adding AC the join is lossy.</div>
<div class="callout"><strong>✍️ 3NF synthesis in the exam room</strong>
<ol>
<li>Minimal cover first (split, shrink left sides, drop redundant FDs) — write it as a numbered list.</li>
<li>Group the FDs with the same left side; each group gives one relation = left side + all its right sides; underline the left side (its key).</li>
<li>Cross out a relation whose attributes all appear in another one.</li>
<li>Find one key of R; if no relation contains it, add a relation with just that key.</li>
<li>No need to test lossless or preservation — the algorithm guarantees both; say so in one sentence.</li>
</ol></div>`,
        `<p class="y-chinh">🎯 Tổng hợp 3NF (3NF synthesis): lấy phủ tối thiểu G của F, mỗi FD X → A trong G thành một quan hệ XA, rồi thêm một quan hệ chứa khoá nếu chưa quan hệ nào chứa — không mất thông tin và bảo toàn phụ thuộc.</p>
<p class="nhan">Vẫn bảng sinh viên — từng bước</p>
<table>
<thead><tr><th>Bước</th><th>Kết quả</th></tr></thead>
<tbody>
<tr><td>1. phủ tối thiểu G</td><td>{I → N, I → A, I → H, S → K, IS → G, H → C} (bỏ I → C: suy ra từ I → H, H → C)</td></tr>
<tr><td>2. mỗi FD một quan hệ, gộp FD cùng vế trái</td><td>INAH, SK, ISG, HC</td></tr>
<tr><td>3. có quan hệ chứa khoá chưa?</td><td>ISG chứa khoá IS ⇒ không cần thêm</td></tr>
</tbody>
</table>
<p>Ra đúng bốn bảng như thuật toán BCNF — ở đây hai thuật toán trùng nhau. Chúng khác nhau trên Bookings(title, theater, city): G = {theater → city, title city → theater} cho (theater, city) và (title, city, theater); cái đầu nằm gọn trong cái sau, nên bước bổ sung thường làm (slide không ghi) bỏ nó đi — kết quả là chính Bookings, đạt 3NF nhưng không đạt BCNF, giữ được cả hai FD.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> BCNF = tách từ trên xuống theo vi phạm (không mất thông tin, có thể mất FD); 3NF = dựng từ dưới lên từ phủ tối thiểu (không mất thông tin và giữ mọi FD).</p>
<div class="pitfall">Bước 3 là bước hay bị quên. R(A, B, C, D) với F = {A → B, C → D}: bước 2 cho AB và CD, không cái nào chứa khoá AC — không thêm AC thì phép nối mất thông tin.</div>
<div class="callout"><strong>✍️ Tổng hợp 3NF trong phòng thi</strong>
<ol>
<li>Làm phủ tối thiểu trước (tách vế phải, thu gọn vế trái, bỏ FD thừa) — ghi thành danh sách đánh số.</li>
<li>Gom các FD cùng vế trái; mỗi nhóm cho một quan hệ = vế trái + mọi vế phải của nó; gạch chân vế trái (khoá của nó).</li>
<li>Gạch bỏ quan hệ có mọi thuộc tính đều nằm trong một quan hệ khác.</li>
<li>Tìm một khoá của R; nếu chưa quan hệ nào chứa nó thì thêm một quan hệ chỉ gồm khoá đó.</li>
<li>Không cần kiểm lossless hay bảo toàn phụ thuộc — thuật toán bảo đảm cả hai; ghi một câu nói rõ điều đó.</li>
</ol></div>`],
      [72, 'Summary 1',
        `<p class="y-chinh">🎯 BCNF decomposition eliminates anomalies; 3NF is the relaxed alternative that always keeps both a lossless join and dependency preservation.</p>
<p>⚠️ <strong>One line of the slide is imprecise:</strong> "BCNF can cause information loss and dependency loss". The BCNF algorithm of slide 70 <em>always</em> gives a lossless join (the slide says so itself). What BCNF can cost is <strong>dependency loss only</strong> (Bookings, slide 27). Information loss comes from a careless split (slide 26), not from BCNF.</p>
<table>
<thead><tr><th>Goal</th><th>BCNF decomposition</th><th>3NF synthesis</th></tr></thead>
<tbody>
<tr><td>No anomalies from FDs</td><td>yes</td><td>almost (a little redundancy may remain, e.g. Bookings)</td></tr>
<tr><td>Lossless join</td><td>always</td><td>always</td></tr>
<tr><td>Dependency preservation</td><td>not always</td><td>always</td></tr>
</tbody>
</table>`,
        `<p class="y-chinh">🎯 Phân rã BCNF xoá bất thường; 3NF là lựa chọn "nới lỏng" luôn giữ được cả nối không mất thông tin lẫn bảo toàn phụ thuộc.</p>
<p>⚠️ <strong>Một dòng của slide nói chưa chính xác:</strong> "BCNF can cause information loss and dependency loss". Thuật toán BCNF của slide 70 <em>luôn</em> cho phép nối không mất thông tin (chính slide 70 ghi vậy). Cái BCNF có thể làm mất <strong>chỉ là phụ thuộc</strong> (Bookings, slide 27). Mất thông tin đến từ phép tách cẩu thả (slide 26), không phải từ BCNF.</p>
<table>
<thead><tr><th>Mục tiêu</th><th>Phân rã BCNF</th><th>Tổng hợp 3NF</th></tr></thead>
<tbody>
<tr><td>Không bất thường do FD</td><td>có</td><td>gần như có (có thể còn chút dư thừa, ví dụ Bookings)</td></tr>
<tr><td>Nối không mất thông tin</td><td>luôn luôn</td><td>luôn luôn</td></tr>
<tr><td>Bảo toàn phụ thuộc</td><td>không phải lúc nào cũng</td><td>luôn luôn</td></tr>
</tbody>
</table>`],
      [73, 'Summary 2',
        `<p class="y-chinh">🎯 The formal definitions side by side: 2NF (no non-prime attribute partially dependent on any key), 3NF (X superkey or A prime), BCNF (X superkey).</p>
<table>
<thead><tr><th>Form</th><th>Condition for every non-trivial X → A</th><th>Violated by</th></tr></thead>
<tbody>
<tr><td>2NF</td><td>no non-prime A depends on a proper part of any key</td><td>partial dependency</td></tr>
<tr><td>3NF</td><td>X is a superkey, or A is prime</td><td>non-key → non-key (transitive)</td></tr>
<tr><td>BCNF</td><td>X is a superkey</td><td>any non-superkey left side</td></tr>
</tbody>
</table>
<p>Note "<em>any</em> key": the formal 2NF/3NF use every candidate key and the prime attributes, while slides 35 and 52 speak of "the primary key". With one key they agree; with several keys, use this slide.</p>
<p class="meo">🧠 <strong>Remember the order of the test:</strong> find all keys → mark prime attributes → for each FD: superkey? (BCNF ok) → A prime? (3NF ok) → left side part of a key and A non-prime? (2NF broken).</p>`,
        `<p class="y-chinh">🎯 Các định nghĩa hình thức đặt cạnh nhau: 2NF (không thuộc tính không khoá nào phụ thuộc bộ phận vào bất kỳ khoá nào), 3NF (X là siêu khoá hoặc A là thuộc tính khoá), BCNF (X là siêu khoá).</p>
<table>
<thead><tr><th>Dạng</th><th>Điều kiện cho mọi X → A không tầm thường</th><th>Bị phá bởi</th></tr></thead>
<tbody>
<tr><td>2NF</td><td>không A không khoá nào phụ thuộc vào một phần thực sự của một khoá</td><td>phụ thuộc bộ phận</td></tr>
<tr><td>3NF</td><td>X là siêu khoá, hoặc A là thuộc tính khoá</td><td>không khoá → không khoá (bắc cầu)</td></tr>
<tr><td>BCNF</td><td>X là siêu khoá</td><td>mọi vế trái không phải siêu khoá</td></tr>
</tbody>
</table>
<p>Để ý chữ "<em>bất kỳ</em> khoá nào": định nghĩa hình thức của 2NF/3NF dùng mọi khoá ứng viên và các thuộc tính khoá, còn slide 35 và 52 nói "khoá chính". Chỉ có một khoá thì hai cách trùng nhau; có nhiều khoá thì dùng slide này.</p>
<p class="meo">🧠 <strong>Nhớ thứ tự phép kiểm:</strong> tìm mọi khoá → đánh dấu thuộc tính khoá → với mỗi FD: vế trái là siêu khoá? (đạt BCNF) → A là thuộc tính khoá? (đạt 3NF) → vế trái là một phần của khoá và A không khoá? (hỏng 2NF).</p>`],
    ]),
    bi(`<h3>✅ Check yourself in 60 seconds</h3>
<ol>
<li>R(A, B, C, D), F = {AB → C, C → D}. Highest normal form? Decompose into BCNF.</li>
<li>Can the BCNF algorithm produce a lossy join?</li>
<li>After 3NF synthesis, no relation contains a key. What do you do?</li>
<li>Why is every two-attribute relation in BCNF?</li>
</ol>
<p class="dap-an">✅ <strong>Answers:</strong> (1) Key AB; C → D is transitive through a non-prime attribute ⇒ 2NF. BCNF: C⁺ = CD ⇒ CD + ABC, both in BCNF, and here no FD is lost. (2) No — every split R1(XY), R2(R − Y) shares X, and X → Y makes X a key of R1. (3) Add one relation whose schema is a key of R. (4) With attributes A, B the only possible non-trivial FDs are A → B or B → A, and each left side is then a key.</p>
<p><strong>Next:</strong> lessons 4.1–4.4 below revisit the same theory with new examples, then lesson 4.5 (practice) and Quiz 2.</p>`,
    `<h3>✅ Tự kiểm tra trong 60 giây</h3>
<ol>
<li>R(A, B, C, D), F = {AB → C, C → D}. Dạng chuẩn cao nhất? Phân rã về BCNF.</li>
<li>Thuật toán BCNF có thể cho phép nối mất thông tin không?</li>
<li>Sau khi tổng hợp 3NF, không quan hệ nào chứa khoá. Làm gì?</li>
<li>Vì sao mọi quan hệ hai thuộc tính đều đạt BCNF?</li>
</ol>
<p class="dap-an">✅ <strong>Đáp án:</strong> (1) Khoá AB; C → D là bắc cầu qua thuộc tính không khoá ⇒ 2NF. BCNF: C⁺ = CD ⇒ CD + ABC, cả hai đạt BCNF, và ở đây không mất FD nào. (2) Không — mỗi lần tách R1(XY), R2(R − Y) có chung X, mà X → Y làm X thành khoá của R1. (3) Thêm một quan hệ có lược đồ là một khoá của R. (4) Với hai thuộc tính A, B thì FD không tầm thường chỉ có thể là A → B hoặc B → A, và khi đó vế trái chính là khoá.</p>
<p><strong>Tiếp theo:</strong> các bài 4.1–4.4 bên dưới ôn lại cùng lý thuyết bằng ví dụ mới, rồi bài 4.5 (thực hành) và Quiz 2.</p>`),
    books([
      ['ullman', 'Ch.3 — §3.3.3 Boyce-Codd Normal Form · §3.3.4 Decomposition into BCNF · §3.5 Third Normal Form (§3.5.2 The Synthesis Algorithm for 3NF Schemas · §3.5.3 Why the 3NF Synthesis Algorithm Works) · §3.6 Multivalued Dependencies (4NF — named on slide 28 only)', 'Chương 3 — §3.3.3 BCNF · §3.3.4 phân rã về BCNF · §3.5 Third Normal Form (§3.5.2 thuật toán tổng hợp 3NF · §3.5.3 vì sao thuật toán đúng) · §3.6 Multivalued Dependencies (4NF — slide 28 chỉ nêu tên)'],
      ['ramakrishnan', 'Ch.19 — §19.5 Properties of Decompositions · §19.6 Normalization (§19.6.1 Decomposition into BCNF · §19.6.2 Decomposition into 3NF)', 'Chương 19 — §19.5 tính chất của phân rã · §19.6 chuẩn hoá (§19.6.1 phân rã về BCNF · §19.6.2 phân rã về 3NF)'],
    ]),
  ].join('\n'),
};

/* ───────── 4.5 — 🧪 Practice + 🗂 Glossary + 📌 Summary · FDs, keys & normalization ───────── */
const L_on_ch4 = {
  title: '4.5 — 🧪 Practice + 🗂 Glossary + 📌 Summary · FDs, keys & normalization|||4.5 — 🧪 Thực hành + 🗂 Thuật ngữ + 📌 Tóm tắt · Phụ thuộc hàm, khoá & chuẩn hoá',
  slug: 'dbi202-on-ch4',
  type: 'VIDEO',
  description: '8 bài tập kiểu đề FPTU cho R và F: tính bao đóng từng vòng, tìm mọi khoá, phủ tối thiểu, xác định dạng chuẩn cao nhất, phân rã BCNF và tổng hợp 3NF, kiểm lossless bằng bảng chase, bảo toàn phụ thuộc, và một bảng đơn hàng thật chuẩn hoá tới 3NF rồi tạo bảng chạy thật trên SQL Server — mọi đáp án được kiểm bằng script; 24 thuật ngữ Anh–Việt; tóm tắt 8 ý và quy trình làm bài.',
  content: [
    bi(`<span class="eyebrow">Chapter 4 · Lesson 4.5 · Practice &amp; review</span>
<h2>FDs, keys and normal forms — practise like the exam, then review</h2>
<p class="lead">Eight exercises in the shape FPTU uses for this chapter: a relation R and a set of FDs F, then "compute the closure", "find all keys", "find a minimal cover", "what is the highest normal form", "decompose into BCNF / 3NF", "is the decomposition lossless". Each solution is worked step by step in tables. None of the numbers was computed by hand: a small script (closure, keys, minimal basis, projection, chase) produced and checked every one of them.</p>
<div class="callout"><strong>How to use this page.</strong>
<ol>
<li>Copy R and F on paper, hide the solution and work it out — write every closure as a table, round by round, exactly as below. In the FE the options are built from the typical slips (a closure stopped after one pass, a non-minimal key, a split left side).</li>
<li>Compare step by step, not only the final answer.</li>
<li>Read the trap under each exercise — it is the wrong option you would have picked.</li>
</ol>
<p>Exercises 1–3 use slides 9–19 of the school's Chapter 3 deck (lesson 4.A), exercise 4 slides 29–69 (lessons 4.B–4.D), exercises 5–7 slides 25–27 and 70–71, and exercise 8 does the whole chain on a real table and runs the result on SQL Server.</p></div>
<h3>The standard method (use it in every exercise)</h3>
<table>
<thead><tr><th>Step</th><th>What you do</th><th>Tool</th></tr></thead>
<tbody>
<tr><td>1</td><td>split every right side into single attributes</td><td>decomposition rule</td></tr>
<tr><td>2</td><td>classify attributes: only on the left (or in no FD) ⇒ in every key; only on the right ⇒ in no key</td><td>inspection</td></tr>
<tr><td>3</td><td>close the "must" set; add other attributes one by one until the closure is R</td><td>closure X⁺</td></tr>
<tr><td>4</td><td>mark prime attributes (members of some key)</td><td>keys</td></tr>
<tr><td>5</td><td>test each FD X → A: X superkey? A prime? X a proper part of a key?</td><td>BCNF / 3NF / 2NF</td></tr>
<tr><td>6</td><td>decompose (BCNF top-down, or 3NF synthesis) and check lossless + preserved FDs</td><td>chase, projection</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 4 · Bài 4.5 · Thực hành &amp; ôn tập</span>
<h2>FD, khoá và dạng chuẩn — luyện như đề thi, rồi ôn lại</h2>
<p class="lead">Tám bài tập đúng dạng FPTU hay ra cho chương này: cho quan hệ R và tập phụ thuộc hàm F, rồi "tính bao đóng", "tìm mọi khoá", "tìm phủ tối thiểu", "dạng chuẩn cao nhất là gì", "phân rã về BCNF / 3NF", "phép phân rã có mất thông tin không". Lời giải nào cũng làm từng bước bằng bảng. Không con số nào được tính nhẩm: một script nhỏ (bao đóng, khoá, phủ tối thiểu, phép chiếu, chase) đã sinh và kiểm từng con số.</p>
<div class="callout"><strong>Cách dùng trang này.</strong>
<ol>
<li>Chép R và F ra giấy, che lời giải rồi tự làm — ghi mọi bao đóng thành bảng, từng vòng, đúng như bên dưới. Ở FE, các phương án sai được dựng từ đúng những lỗi hay mắc (bao đóng dừng sau một lượt, khoá không tối tiểu, tách vế trái).</li>
<li>So từng bước, không chỉ so đáp số cuối.</li>
<li>Đọc cái bẫy dưới mỗi bài — đó là phương án sai mà bạn lẽ ra đã chọn.</li>
</ol>
<p>Bài 1–3 dùng slide 9–19 của bộ slide Chapter 3 của trường (bài 4.A), bài 4 dùng slide 29–69 (bài 4.B–4.D), bài 5–7 dùng slide 25–27 và 70–71, còn bài 8 đi trọn chuỗi trên một bảng thật và chạy kết quả trên SQL Server.</p></div>
<h3>Quy trình chuẩn (dùng cho mọi bài)</h3>
<table>
<thead><tr><th>Bước</th><th>Làm gì</th><th>Công cụ</th></tr></thead>
<tbody>
<tr><td>1</td><td>tách mọi vế phải thành một thuộc tính</td><td>luật tách</td></tr>
<tr><td>2</td><td>phân loại thuộc tính: chỉ ở vế trái (hoặc không có trong FD nào) ⇒ nằm trong mọi khoá; chỉ ở vế phải ⇒ không nằm trong khoá nào</td><td>nhìn F</td></tr>
<tr><td>3</td><td>tính bao đóng của tập "bắt buộc"; thêm dần thuộc tính khác tới khi bao đóng bằng R</td><td>bao đóng X⁺</td></tr>
<tr><td>4</td><td>đánh dấu thuộc tính khoá (prime — thuộc một khoá nào đó)</td><td>các khoá</td></tr>
<tr><td>5</td><td>kiểm từng FD X → A: X là siêu khoá? A là thuộc tính khoá? X là phần thực sự của một khoá?</td><td>BCNF / 3NF / 2NF</td></tr>
<tr><td>6</td><td>phân rã (BCNF từ trên xuống, hoặc tổng hợp 3NF) rồi kiểm lossless + bảo toàn FD</td><td>chase, phép chiếu</td></tr>
</tbody>
</table>`),
    bi(`<h3>🧪 Exercise 1 — closures and implied FDs (FE style · ~10 min)</h3>
<p class="nhan">Task</p>
<p>R(A, B, C, D, E, G), F = {AB → C, C → A, BC → D, ACD → B, D → EG, BE → C, CG → BD, CE → AG}. (a) Compute (BD)⁺. (b) Does BD → AC follow from F? (c) Is BD a key? (d) Compute (CE)⁺. (e) Does AD → B follow from F?</p>
<p class="nhan">(a) (BD)⁺ — FDs scanned in the order given</p>
<table>
<thead><tr><th>Pass</th><th>FD fired</th><th>Added</th><th>X</th></tr></thead>
<tbody>
<tr><td>start</td><td>—</td><td>—</td><td>{B, D}</td></tr>
<tr><td>1</td><td>D → EG</td><td>E, G</td><td>{B, D, E, G}</td></tr>
<tr><td>1</td><td>BE → C</td><td>C</td><td>{B, C, D, E, G}</td></tr>
<tr><td>1</td><td>CE → AG</td><td>A</td><td>{A, B, C, D, E, G} = R</td></tr>
</tbody>
</table>
<p class="dap-an">✅ (b) Yes: {A, C} ⊆ (BD)⁺. (c) Yes: (BD)⁺ = R, and neither {B}⁺ = {B} nor {D}⁺ = {D, E, G} is all of R, so BD is minimal — a key.</p>
<p class="nhan">(d) (CE)⁺ — needs a second pass</p>
<table>
<thead><tr><th>Pass</th><th>FD fired</th><th>Added</th><th>X</th></tr></thead>
<tbody>
<tr><td>start</td><td>—</td><td>—</td><td>{C, E}</td></tr>
<tr><td>1</td><td>C → A</td><td>A</td><td>{A, C, E}</td></tr>
<tr><td>1</td><td>CE → AG</td><td>G</td><td>{A, C, E, G}</td></tr>
<tr><td>2</td><td>CG → BD</td><td>B, D</td><td>{A, B, C, D, E, G} = R</td></tr>
</tbody>
</table>
<p>In pass 1, CG → BD comes before CE → AG in the list, so G was not there yet when CG → BD was tried; it fires in pass 2.</p>
<p class="dap-an">✅ (e) No: (AD)⁺ = {A, D, E, G} — D → EG fires, then nothing else (ACD → B needs C, CE → AG needs C). B ∉ (AD)⁺.</p>
<div class="pitfall">Stopping (CE)⁺ after one pass gives {A, C, E, G} and the wrong conclusion "CE is not a key". This F actually has 7 keys: AB, BC, BD, BE, CD, CE, CG — an FE option listing only two of them is incomplete.</div>`,
    `<h3>🧪 Bài 1 — bao đóng và FD kéo theo (kiểu FE · ~10 phút)</h3>
<p class="nhan">Đề bài</p>
<p>R(A, B, C, D, E, G), F = {AB → C, C → A, BC → D, ACD → B, D → EG, BE → C, CG → BD, CE → AG}. (a) Tính (BD)⁺. (b) BD → AC có suy ra được từ F không? (c) BD có phải khoá không? (d) Tính (CE)⁺. (e) AD → B có suy ra được từ F không?</p>
<p class="nhan">(a) (BD)⁺ — quét FD theo đúng thứ tự đề cho</p>
<table>
<thead><tr><th>Lượt</th><th>FD dùng</th><th>Thêm</th><th>X</th></tr></thead>
<tbody>
<tr><td>bắt đầu</td><td>—</td><td>—</td><td>{B, D}</td></tr>
<tr><td>1</td><td>D → EG</td><td>E, G</td><td>{B, D, E, G}</td></tr>
<tr><td>1</td><td>BE → C</td><td>C</td><td>{B, C, D, E, G}</td></tr>
<tr><td>1</td><td>CE → AG</td><td>A</td><td>{A, B, C, D, E, G} = R</td></tr>
</tbody>
</table>
<p class="dap-an">✅ (b) Có: {A, C} ⊆ (BD)⁺. (c) Có: (BD)⁺ = R, và cả {B}⁺ = {B} lẫn {D}⁺ = {D, E, G} đều không phải cả R, nên BD tối tiểu — là khoá.</p>
<p class="nhan">(d) (CE)⁺ — cần lượt thứ hai</p>
<table>
<thead><tr><th>Lượt</th><th>FD dùng</th><th>Thêm</th><th>X</th></tr></thead>
<tbody>
<tr><td>bắt đầu</td><td>—</td><td>—</td><td>{C, E}</td></tr>
<tr><td>1</td><td>C → A</td><td>A</td><td>{A, C, E}</td></tr>
<tr><td>1</td><td>CE → AG</td><td>G</td><td>{A, C, E, G}</td></tr>
<tr><td>2</td><td>CG → BD</td><td>B, D</td><td>{A, B, C, D, E, G} = R</td></tr>
</tbody>
</table>
<p>Ở lượt 1, CG → BD đứng trước CE → AG trong danh sách, nên lúc thử CG → BD thì chưa có G; nó chỉ dùng được ở lượt 2.</p>
<p class="dap-an">✅ (e) Không: (AD)⁺ = {A, D, E, G} — D → EG dùng được, rồi hết (ACD → B cần C, CE → AG cần C). B ∉ (AD)⁺.</p>
<div class="pitfall">Dừng (CE)⁺ sau một lượt sẽ được {A, C, E, G} và kết luận sai "CE không phải khoá". F này thật ra có 7 khoá: AB, BC, BD, BE, CD, CE, CG — phương án FE chỉ liệt kê hai trong số đó là thiếu.</div>`),
    bi(`<h3>🧪 Exercise 2 — find ALL keys (FE style · ~10 min)</h3>
<p class="nhan">Task</p>
<p>R(A, B, C, D, E), F = {A → B, BC → E, ED → A}. Find every candidate key and the prime attributes.</p>
<p class="nhan">Step 1–2: classify the attributes</p>
<table>
<thead><tr><th>Attribute</th><th>Left of</th><th>Right of</th><th>Class</th></tr></thead>
<tbody>
<tr><td>A</td><td>A → B</td><td>ED → A</td><td>both</td></tr>
<tr><td>B</td><td>BC → E</td><td>A → B</td><td>both</td></tr>
<tr><td>C</td><td>BC → E</td><td>—</td><td>left only ⇒ in every key</td></tr>
<tr><td>D</td><td>ED → A</td><td>—</td><td>left only ⇒ in every key</td></tr>
<tr><td>E</td><td>ED → A</td><td>BC → E</td><td>both</td></tr>
</tbody>
</table>
<p class="nhan">Step 3: close CD, then add one attribute at a time</p>
<table>
<thead><tr><th>X</th><th>X⁺</th><th>Key?</th></tr></thead>
<tbody>
<tr><td>{C, D}</td><td>{C, D}</td><td>no — nothing fires</td></tr>
<tr><td>{A, C, D}</td><td>A → B, then BC → E ⇒ {A, B, C, D, E}</td><td>yes</td></tr>
<tr><td>{B, C, D}</td><td>BC → E, then ED → A ⇒ {A, B, C, D, E}</td><td>yes</td></tr>
<tr><td>{C, D, E}</td><td>ED → A, then A → B ⇒ {A, B, C, D, E}</td><td>yes</td></tr>
</tbody>
</table>
<p>Every other candidate of size 4 contains one of these three, so it is only a superkey.</p>
<p class="dap-an">✅ Keys: <strong>ACD, BCD, CDE</strong>. Prime attributes: A, B, C, D, E — all of them. Consequence (Exercise 4): every FD passes the 3NF test, but A → B, BC → E and ED → A all have a non-superkey left side ⇒ R is in <strong>3NF but not BCNF</strong>.</p>
<div class="pitfall">"C and D appear in every key" does not make CD a key: (CD)⁺ = CD. And stopping at the first key you find (ACD) misses two others — the FE loves "how many candidate keys does R have?" (answer: 3).</div>`,
    `<h3>🧪 Bài 2 — tìm MỌI khoá (kiểu FE · ~10 phút)</h3>
<p class="nhan">Đề bài</p>
<p>R(A, B, C, D, E), F = {A → B, BC → E, ED → A}. Tìm mọi khoá ứng viên và các thuộc tính khoá (prime).</p>
<p class="nhan">Bước 1–2: phân loại thuộc tính</p>
<table>
<thead><tr><th>Thuộc tính</th><th>Ở vế trái của</th><th>Ở vế phải của</th><th>Loại</th></tr></thead>
<tbody>
<tr><td>A</td><td>A → B</td><td>ED → A</td><td>cả hai</td></tr>
<tr><td>B</td><td>BC → E</td><td>A → B</td><td>cả hai</td></tr>
<tr><td>C</td><td>BC → E</td><td>—</td><td>chỉ vế trái ⇒ có trong mọi khoá</td></tr>
<tr><td>D</td><td>ED → A</td><td>—</td><td>chỉ vế trái ⇒ có trong mọi khoá</td></tr>
<tr><td>E</td><td>ED → A</td><td>BC → E</td><td>cả hai</td></tr>
</tbody>
</table>
<p class="nhan">Bước 3: tính bao đóng của CD, rồi thêm từng thuộc tính một</p>
<table>
<thead><tr><th>X</th><th>X⁺</th><th>Là khoá?</th></tr></thead>
<tbody>
<tr><td>{C, D}</td><td>{C, D}</td><td>không — không FD nào dùng được</td></tr>
<tr><td>{A, C, D}</td><td>A → B, rồi BC → E ⇒ {A, B, C, D, E}</td><td>có</td></tr>
<tr><td>{B, C, D}</td><td>BC → E, rồi ED → A ⇒ {A, B, C, D, E}</td><td>có</td></tr>
<tr><td>{C, D, E}</td><td>ED → A, rồi A → B ⇒ {A, B, C, D, E}</td><td>có</td></tr>
</tbody>
</table>
<p>Mọi tập 4 thuộc tính khác đều chứa một trong ba tập này, nên chỉ là siêu khoá.</p>
<p class="dap-an">✅ Khoá: <strong>ACD, BCD, CDE</strong>. Thuộc tính khoá: A, B, C, D, E — tất cả. Hệ quả (Bài 4): mọi FD đều qua phép kiểm 3NF, nhưng A → B, BC → E và ED → A đều có vế trái không phải siêu khoá ⇒ R đạt <strong>3NF nhưng không đạt BCNF</strong>.</p>
<div class="pitfall">"C và D có mặt trong mọi khoá" không có nghĩa CD là khoá: (CD)⁺ = CD. Và dừng ở khoá đầu tiên tìm được (ACD) là bỏ sót hai khoá — FE rất thích hỏi "R có bao nhiêu khoá ứng viên?" (đáp án: 3).</div>`),
    bi(`<h3>🧪 Exercise 3 — minimal cover (PT/FE style · ~10 min)</h3>
<p class="nhan">Task</p>
<p>R(A, B, C, D, E), F = {A → BC, AB → D, B → C, AC → E, D → E}. Find a minimal cover (minimal basis) of F, then the key of R.</p>
<p class="nhan">Step 1 — split the right sides</p>
<p>A → B, A → C, AB → D, B → C, AC → E, D → E.</p>
<p class="nhan">Step 2 — remove extra attributes from left sides (closures computed with all current FDs)</p>
<table>
<thead><tr><th>FD</th><th>Try</th><th>Closure</th><th>Contains the right side?</th><th>Result</th></tr></thead>
<tbody>
<tr><td>AB → D</td><td>drop B: A⁺</td><td>{A, B, C, D, E}</td><td>yes</td><td>A → D</td></tr>
<tr><td>AC → E</td><td>drop C: A⁺</td><td>{A, B, C, D, E}</td><td>yes</td><td>A → E</td></tr>
</tbody>
</table>
<p class="nhan">Step 3 — remove redundant FDs (closure of the left side WITHOUT the FD itself)</p>
<table>
<thead><tr><th>FD</th><th>Left-side closure without it</th><th>Right side reached?</th><th>Keep?</th></tr></thead>
<tbody>
<tr><td>A → B</td><td>{A, C, D, E}</td><td>no</td><td>keep</td></tr>
<tr><td>A → C</td><td>{A, B, C, D, E} (via A → B, B → C)</td><td>yes</td><td>drop</td></tr>
<tr><td>A → D</td><td>{A, B, C, E}</td><td>no</td><td>keep</td></tr>
<tr><td>B → C</td><td>{B}</td><td>no</td><td>keep</td></tr>
<tr><td>A → E</td><td>{A, B, C, D, E} (via A → D, D → E)</td><td>yes</td><td>drop</td></tr>
<tr><td>D → E</td><td>{D}</td><td>no</td><td>keep</td></tr>
</tbody>
</table>
<p class="dap-an">✅ Minimal cover: <strong>{A → B, A → D, B → C, D → E}</strong>. A appears only on the left and A⁺ = {A, B, C, D, E}, so the only key is <strong>A</strong>. The FDs B → C and D → E are transitive (non-key → non-key), so R is in 2NF, not 3NF.</p>
<div class="pitfall">Doing step 3 before step 2 can leave a redundant FD in: the reduced A → E only becomes removable after AC → E has been shrunk. Also keep the right order inside step 3 — after dropping A → C, check the next FD against the <em>new</em> set.</div>`,
    `<h3>🧪 Bài 3 — phủ tối thiểu (kiểu PT/FE · ~10 phút)</h3>
<p class="nhan">Đề bài</p>
<p>R(A, B, C, D, E), F = {A → BC, AB → D, B → C, AC → E, D → E}. Tìm một phủ tối thiểu (minimal cover — minimal basis) của F, rồi tìm khoá của R.</p>
<p class="nhan">Bước 1 — tách vế phải</p>
<p>A → B, A → C, AB → D, B → C, AC → E, D → E.</p>
<p class="nhan">Bước 2 — bỏ thuộc tính thừa ở vế trái (bao đóng tính bằng mọi FD hiện có)</p>
<table>
<thead><tr><th>FD</th><th>Thử</th><th>Bao đóng</th><th>Chứa vế phải?</th><th>Kết quả</th></tr></thead>
<tbody>
<tr><td>AB → D</td><td>bỏ B: A⁺</td><td>{A, B, C, D, E}</td><td>có</td><td>A → D</td></tr>
<tr><td>AC → E</td><td>bỏ C: A⁺</td><td>{A, B, C, D, E}</td><td>có</td><td>A → E</td></tr>
</tbody>
</table>
<p class="nhan">Bước 3 — bỏ FD thừa (bao đóng vế trái KHÔNG dùng chính FD đó)</p>
<table>
<thead><tr><th>FD</th><th>Bao đóng vế trái khi bỏ nó</th><th>Tới được vế phải?</th><th>Giữ?</th></tr></thead>
<tbody>
<tr><td>A → B</td><td>{A, C, D, E}</td><td>không</td><td>giữ</td></tr>
<tr><td>A → C</td><td>{A, B, C, D, E} (qua A → B, B → C)</td><td>có</td><td>bỏ</td></tr>
<tr><td>A → D</td><td>{A, B, C, E}</td><td>không</td><td>giữ</td></tr>
<tr><td>B → C</td><td>{B}</td><td>không</td><td>giữ</td></tr>
<tr><td>A → E</td><td>{A, B, C, D, E} (qua A → D, D → E)</td><td>có</td><td>bỏ</td></tr>
<tr><td>D → E</td><td>{D}</td><td>không</td><td>giữ</td></tr>
</tbody>
</table>
<p class="dap-an">✅ Phủ tối thiểu: <strong>{A → B, A → D, B → C, D → E}</strong>. A chỉ xuất hiện ở vế trái và A⁺ = {A, B, C, D, E}, nên khoá duy nhất là <strong>A</strong>. Các FD B → C và D → E là bắc cầu (không khoá → không khoá), nên R đạt 2NF, không đạt 3NF.</p>
<div class="pitfall">Làm bước 3 trước bước 2 có thể để sót một FD thừa: A → E chỉ bỏ được sau khi AC → E đã được thu gọn. Trong bước 3 cũng phải giữ thứ tự — bỏ A → C xong thì FD tiếp theo được kiểm với tập <em>mới</em>.</div>`),
    bi(`<h3>🧪 Exercise 4 — highest normal form (FE style · ~12 min)</h3>
<p class="nhan">Task</p>
<p>For each relation, give the keys and the highest normal form among 1NF, 2NF, 3NF, BCNF.</p>
<table>
<thead><tr><th>Relation and F</th><th>Keys</th><th>Decisive FD</th><th>Highest NF</th></tr></thead>
<tbody>
<tr><td>(a) R(A, B, C, D), {AB → C, B → D}</td><td>AB</td><td>B → D: D non-prime, B a proper part of the key AB</td><td>1NF</td></tr>
<tr><td>(b) R(A, B, C, D), {A → B, B → C, A → D}</td><td>A</td><td>B → C: B not a superkey, C non-prime, key has one attribute</td><td>2NF</td></tr>
<tr><td>(c) R(A, B, C), {AB → C, C → B}</td><td>AB, AC</td><td>C → B: C not a superkey, but B is prime</td><td>3NF</td></tr>
<tr><td>(d) R(A, B, C, D), {A → BCD, BC → A}</td><td>A, BC</td><td>every left side (A, BC) is a key</td><td>BCNF</td></tr>
<tr><td>(e) R(A, B, C, D, E), Exercise 2</td><td>ACD, BCD, CDE</td><td>all attributes prime; A → B not a superkey</td><td>3NF</td></tr>
</tbody>
</table>
<p>Reading (c) carefully: {C}⁺ = {B, C}, so C is not a superkey — BCNF fails. The 3NF escape clause applies because B belongs to the key AB. For (d): {B, C}⁺ = {A, B, C, D}, so BC is a second key and BC → A has a superkey on the left.</p>
<div class="pitfall">Always find <strong>all</strong> keys before judging. In (c), with only the key AB in mind you would call B non-prime and answer 2NF; with AC also a key, B is prime and the answer is 3NF.</div>`,
    `<h3>🧪 Bài 4 — dạng chuẩn cao nhất (kiểu FE · ~12 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Với mỗi quan hệ, cho biết các khoá và dạng chuẩn cao nhất trong 1NF, 2NF, 3NF, BCNF.</p>
<table>
<thead><tr><th>Quan hệ và F</th><th>Khoá</th><th>FD quyết định</th><th>Dạng chuẩn cao nhất</th></tr></thead>
<tbody>
<tr><td>(a) R(A, B, C, D), {AB → C, B → D}</td><td>AB</td><td>B → D: D không khoá, B là phần thực sự của khoá AB</td><td>1NF</td></tr>
<tr><td>(b) R(A, B, C, D), {A → B, B → C, A → D}</td><td>A</td><td>B → C: B không là siêu khoá, C không khoá, khoá một thuộc tính</td><td>2NF</td></tr>
<tr><td>(c) R(A, B, C), {AB → C, C → B}</td><td>AB, AC</td><td>C → B: C không là siêu khoá, nhưng B là thuộc tính khoá</td><td>3NF</td></tr>
<tr><td>(d) R(A, B, C, D), {A → BCD, BC → A}</td><td>A, BC</td><td>mọi vế trái (A, BC) đều là khoá</td><td>BCNF</td></tr>
<tr><td>(e) R(A, B, C, D, E), Bài 2</td><td>ACD, BCD, CDE</td><td>mọi thuộc tính đều là thuộc tính khoá; A → B không là siêu khoá</td><td>3NF</td></tr>
</tbody>
</table>
<p>Đọc kỹ (c): {C}⁺ = {B, C}, nên C không là siêu khoá — hỏng BCNF. Lối thoát của 3NF áp dụng được vì B thuộc khoá AB. Với (d): {B, C}⁺ = {A, B, C, D}, nên BC là khoá thứ hai và BC → A có vế trái là siêu khoá.</p>
<div class="pitfall">Luôn tìm <strong>đủ mọi</strong> khoá trước khi kết luận. Ở (c), nếu chỉ nghĩ tới khoá AB thì bạn sẽ coi B là không khoá và trả lời 2NF; khi AC cũng là khoá thì B là thuộc tính khoá và đáp án là 3NF.</div>`),
    bi(`<h3>🧪 Exercise 5 — decompose into BCNF, then check lossless and preserved FDs (FE/PT style · ~15 min)</h3>
<p class="nhan">Task</p>
<p>R(A, B, C, D) — think A = student, B = subject, C = lecturer, D = the lecturer's office — with F = {AB → C (a student takes a subject with one lecturer), C → B (a lecturer teaches one subject), C → D (a lecturer has one office)}. (a) Keys and highest NF. (b) Decompose into BCNF. (c) Is it lossless? (d) Is every FD preserved?</p>
<p class="nhan">(a) Keys and normal form</p>
<table>
<thead><tr><th>X</th><th>X⁺</th><th>Conclusion</th></tr></thead>
<tbody>
<tr><td>{A, B}</td><td>{A, B, C, D}</td><td>key</td></tr>
<tr><td>{A, C}</td><td>{A, B, C, D}</td><td>key</td></tr>
<tr><td>{C}</td><td>{B, C, D}</td><td>not a superkey</td></tr>
<tr><td>{A}</td><td>{A}</td><td>—</td></tr>
</tbody>
</table>
<p>Prime: A, B, C; non-prime: D. C → D: D non-prime and C is a proper part of the key AC ⇒ partial dependency ⇒ R is only in <strong>1NF</strong>.</p>
<p class="nhan">(b) BCNF decomposition (slide 70, with Y = X⁺ − X)</p>
<table>
<thead><tr><th>Relation</th><th>Violating FD</th><th>Split</th></tr></thead>
<tbody>
<tr><td>ABCD</td><td>C → BD (C⁺ = {B, C, D})</td><td>R1(B, C, D) + R2(A, C)</td></tr>
<tr><td>R1(B, C, D)</td><td>projected FDs C → B, C → D; key C</td><td>BCNF ✓</td></tr>
<tr><td>R2(A, C)</td><td>no non-trivial FD; key AC</td><td>BCNF ✓</td></tr>
</tbody>
</table>
<p class="nhan">(c) Chase — one row per piece; a = known value, a1, b2, d2 = unknown</p>
<table>
<thead><tr><th>Step</th><th>Row R1(B, C, D)</th><th>Row R2(A, C)</th><th>Reason</th></tr></thead>
<tbody>
<tr><td>start</td><td>a1, b, c, d</td><td>a, b2, c, d2</td><td>—</td></tr>
<tr><td>C → B</td><td>a1, b, c, d</td><td>a, b, c, d2</td><td>rows agree on C ⇒ b2 becomes b</td></tr>
<tr><td>C → D</td><td>a1, b, c, d</td><td>a, b, c, d</td><td>rows agree on C ⇒ d2 becomes d</td></tr>
</tbody>
</table>
<p class="dap-an">✅ Row 2 is all unsubscripted (a, b, c, d) ⇒ <strong>lossless</strong>. Shortcut for two pieces: R1 ∩ R2 = {C} and C → BCD, so C is a key of R1.</p>
<p class="dap-an">✅ (d) Projected FDs: on R1 {C → B, C → D}; on R2 none. Under their union, (AB)⁺ = {A, B} ⇒ <strong>AB → C is lost</strong>: nothing now prevents a student from taking the same subject with two lecturers. Exercise 6 shows the 3NF way out.</p>
<div class="pitfall">"Lossless" and "dependency-preserving" are independent: this decomposition is lossless but not dependency-preserving. An FE option "BCNF decomposition is always dependency-preserving" is false.</div>`,
    `<h3>🧪 Bài 5 — phân rã về BCNF, rồi kiểm lossless và bảo toàn FD (kiểu FE/PT · ~15 phút)</h3>
<p class="nhan">Đề bài</p>
<p>R(A, B, C, D) — hình dung A = sinh viên, B = môn học, C = giảng viên, D = phòng làm việc của giảng viên — với F = {AB → C (một sinh viên học một môn với một giảng viên), C → B (mỗi giảng viên dạy một môn), C → D (mỗi giảng viên một phòng)}. (a) Khoá và dạng chuẩn cao nhất. (b) Phân rã về BCNF. (c) Có mất thông tin không? (d) Mọi FD có được bảo toàn không?</p>
<p class="nhan">(a) Khoá và dạng chuẩn</p>
<table>
<thead><tr><th>X</th><th>X⁺</th><th>Kết luận</th></tr></thead>
<tbody>
<tr><td>{A, B}</td><td>{A, B, C, D}</td><td>khoá</td></tr>
<tr><td>{A, C}</td><td>{A, B, C, D}</td><td>khoá</td></tr>
<tr><td>{C}</td><td>{B, C, D}</td><td>không là siêu khoá</td></tr>
<tr><td>{A}</td><td>{A}</td><td>—</td></tr>
</tbody>
</table>
<p>Thuộc tính khoá: A, B, C; không khoá: D. C → D: D không khoá và C là phần thực sự của khoá AC ⇒ phụ thuộc bộ phận ⇒ R chỉ đạt <strong>1NF</strong>.</p>
<p class="nhan">(b) Phân rã BCNF (slide 70, lấy Y = X⁺ − X)</p>
<table>
<thead><tr><th>Quan hệ</th><th>FD vi phạm</th><th>Tách</th></tr></thead>
<tbody>
<tr><td>ABCD</td><td>C → BD (C⁺ = {B, C, D})</td><td>R1(B, C, D) + R2(A, C)</td></tr>
<tr><td>R1(B, C, D)</td><td>FD chiếu C → B, C → D; khoá C</td><td>BCNF ✓</td></tr>
<tr><td>R2(A, C)</td><td>không có FD không tầm thường; khoá AC</td><td>BCNF ✓</td></tr>
</tbody>
</table>
<p class="nhan">(c) Chase — mỗi mảnh một dòng; a = giá trị đã biết, a1, b2, d2 = chưa biết</p>
<table>
<thead><tr><th>Bước</th><th>Dòng R1(B, C, D)</th><th>Dòng R2(A, C)</th><th>Lý do</th></tr></thead>
<tbody>
<tr><td>bắt đầu</td><td>a1, b, c, d</td><td>a, b2, c, d2</td><td>—</td></tr>
<tr><td>C → B</td><td>a1, b, c, d</td><td>a, b, c, d2</td><td>hai dòng trùng C ⇒ b2 thành b</td></tr>
<tr><td>C → D</td><td>a1, b, c, d</td><td>a, b, c, d</td><td>hai dòng trùng C ⇒ d2 thành d</td></tr>
</tbody>
</table>
<p class="dap-an">✅ Dòng 2 toàn ký hiệu không chỉ số (a, b, c, d) ⇒ <strong>không mất thông tin (lossless)</strong>. Lối tắt cho hai mảnh: R1 ∩ R2 = {C} và C → BCD, nên C là khoá của R1.</p>
<p class="dap-an">✅ (d) FD chiếu: trên R1 là {C → B, C → D}; trên R2 không có. Theo hợp của chúng, (AB)⁺ = {A, B} ⇒ <strong>mất AB → C</strong>: giờ không gì ngăn một sinh viên học cùng một môn với hai giảng viên. Bài 6 cho lối ra kiểu 3NF.</p>
<div class="pitfall">"Không mất thông tin" và "bảo toàn phụ thuộc" độc lập với nhau: phép phân rã này lossless nhưng không bảo toàn phụ thuộc. Phương án FE "phân rã BCNF luôn bảo toàn phụ thuộc" là SAI.</div>`),
    bi(`<h3>🧪 Exercise 6 — 3NF synthesis of the same relation (FE/PT style · ~10 min)</h3>
<p class="nhan">Task</p>
<p>Same R(A, B, C, D) and F = {AB → C, C → B, C → D} as Exercise 5. Decompose into 3NF with the synthesis algorithm (slide 71) and compare with Exercise 5.</p>
<table>
<thead><tr><th>Step</th><th>Result</th></tr></thead>
<tbody>
<tr><td>1. minimal cover</td><td>F is already minimal: {AB → C, C → B, C → D} (no right side to split, AB → C cannot lose A or B: A⁺ = {A}, B⁺ = {B}; no FD follows from the others)</td></tr>
<tr><td>2. one relation per left side</td><td>AB → C gives R1(A, B, C); C → B and C → D give R2(B, C, D)</td></tr>
<tr><td>3. a relation containing a key?</td><td>R1 contains the key AB ⇒ nothing to add</td></tr>
<tr><td>check R1(A, B, C)</td><td>keys AB, AC; C → B has a prime right side ⇒ 3NF (not BCNF)</td></tr>
<tr><td>check R2(B, C, D)</td><td>key C ⇒ BCNF</td></tr>
<tr><td>lossless?</td><td>chase: the rows agree on C, C → D fills D in row 1 ⇒ row 1 = a, b, c, d ✓</td></tr>
<tr><td>preserved?</td><td>AB → C lives in R1, C → B and C → D in R2 ✓</td></tr>
</tbody>
</table>
<p class="dap-an">✅ 3NF result: <strong>R1(A, B, C), R2(B, C, D)</strong> — lossless and every FD preserved; the price is that R1 is not in BCNF (the lecturer–subject pair is repeated per student).</p>
<p class="meo">🧠 <strong>Remember the trade-off:</strong> Exercise 5 (BCNF) has no redundancy but lost AB → C; Exercise 6 (3NF) keeps every FD but tolerates C → B inside R1.</p>`,
    `<h3>🧪 Bài 6 — tổng hợp 3NF cho cùng quan hệ (kiểu FE/PT · ~10 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Cùng R(A, B, C, D) và F = {AB → C, C → B, C → D} như Bài 5. Phân rã về 3NF bằng thuật toán tổng hợp (slide 71) và so sánh với Bài 5.</p>
<table>
<thead><tr><th>Bước</th><th>Kết quả</th></tr></thead>
<tbody>
<tr><td>1. phủ tối thiểu</td><td>F đã tối thiểu: {AB → C, C → B, C → D} (không vế phải nào cần tách, AB → C không bỏ được A hay B: A⁺ = {A}, B⁺ = {B}; không FD nào suy ra được từ các FD còn lại)</td></tr>
<tr><td>2. mỗi vế trái một quan hệ</td><td>AB → C cho R1(A, B, C); C → B và C → D cho R2(B, C, D)</td></tr>
<tr><td>3. có quan hệ chứa khoá chưa?</td><td>R1 chứa khoá AB ⇒ không cần thêm</td></tr>
<tr><td>kiểm R1(A, B, C)</td><td>khoá AB, AC; C → B có vế phải là thuộc tính khoá ⇒ 3NF (không BCNF)</td></tr>
<tr><td>kiểm R2(B, C, D)</td><td>khoá C ⇒ BCNF</td></tr>
<tr><td>lossless?</td><td>chase: hai dòng trùng C, C → D điền D cho dòng 1 ⇒ dòng 1 = a, b, c, d ✓</td></tr>
<tr><td>bảo toàn?</td><td>AB → C nằm trong R1, C → B và C → D nằm trong R2 ✓</td></tr>
</tbody>
</table>
<p class="dap-an">✅ Kết quả 3NF: <strong>R1(A, B, C), R2(B, C, D)</strong> — không mất thông tin và giữ mọi FD; cái giá là R1 không đạt BCNF (cặp giảng viên–môn lặp lại theo từng sinh viên).</p>
<p class="meo">🧠 <strong>Nhớ sự đánh đổi:</strong> Bài 5 (BCNF) không dư thừa nhưng mất AB → C; Bài 6 (3NF) giữ mọi FD nhưng chấp nhận C → B nằm trong R1.</p>`),
    bi(`<h3>🧪 Exercise 7 — the chase test on three pieces (FE style · ~12 min)</h3>
<p class="nhan">Task</p>
<p>R(A, B, C, D), F = {A → B, B → C, CD → A}. Is the decomposition (a) {AD, AC, BCD} lossless? (b) {AB, BC, CD}?</p>
<p class="nhan">(a) Start: one row per piece — the attributes of the piece get the plain letter, the others a subscript</p>
<table>
<thead><tr><th>Step</th><th>Row AD</th><th>Row AC</th><th>Row BCD</th><th>Reason</th></tr></thead>
<tbody>
<tr><td>start</td><td>a, b1, c1, d</td><td>a, b2, c, d2</td><td>a3, b, c, d</td><td>—</td></tr>
<tr><td>1</td><td>a, b1, c1, d</td><td>a, b1, c, d2</td><td>a3, b, c, d</td><td>A → B: rows 1, 2 agree on A ⇒ b2 becomes b1</td></tr>
<tr><td>2</td><td>a, b1, c, d</td><td>a, b1, c, d2</td><td>a3, b, c, d</td><td>B → C: rows 1, 2 agree on B ⇒ c1 becomes c</td></tr>
<tr><td>3</td><td>a, b1, c, d</td><td>a, b1, c, d2</td><td>a, b, c, d</td><td>CD → A: rows 1, 3 agree on (c, d) ⇒ a3 becomes a</td></tr>
<tr><td>4</td><td>a, b, c, d</td><td>a, b, c, d2</td><td>a, b, c, d</td><td>A → B: rows 1, 3 agree on A ⇒ b1 becomes b (everywhere)</td></tr>
</tbody>
</table>
<p class="dap-an">✅ (a) Row 1 (and row 3) is all plain letters ⇒ <strong>lossless</strong>.</p>
<p class="nhan">(b) {AB, BC, CD}</p>
<table>
<thead><tr><th>Step</th><th>Row AB</th><th>Row BC</th><th>Row CD</th><th>Reason</th></tr></thead>
<tbody>
<tr><td>start</td><td>a, b, c1, d1</td><td>a2, b, c, d2</td><td>a3, b3, c, d</td><td>—</td></tr>
<tr><td>1</td><td>a, b, c, d1</td><td>a2, b, c, d2</td><td>a3, b3, c, d</td><td>B → C: rows 1, 2 agree on B ⇒ c1 becomes c</td></tr>
<tr><td>end</td><td>no FD applies: rows agree on C but never on CD, and never on A</td><td></td><td></td><td>stop</td></tr>
</tbody>
</table>
<p class="dap-an">✅ (b) No row is all plain ⇒ <strong>lossy</strong>. The final table is itself a counter-example: take it as the data of R, project it on AB, BC, CD and join back — (a, b, c, d) appears although R does not contain it.</p>
<div class="pitfall">When you equate two symbols, change them <strong>in every row</strong>, and prefer the plain letter (b1 → b, never b → b1). Step 4 of (a) only works because b1 in row 2 changes too.</div>`,
    `<h3>🧪 Bài 7 — phép kiểm chase trên ba mảnh (kiểu FE · ~12 phút)</h3>
<p class="nhan">Đề bài</p>
<p>R(A, B, C, D), F = {A → B, B → C, CD → A}. Phép phân rã (a) {AD, AC, BCD} có mất thông tin không? (b) {AB, BC, CD} thì sao?</p>
<p class="nhan">(a) Bắt đầu: mỗi mảnh một dòng — thuộc tính của mảnh ghi chữ trơn, thuộc tính khác ghi kèm chỉ số</p>
<table>
<thead><tr><th>Bước</th><th>Dòng AD</th><th>Dòng AC</th><th>Dòng BCD</th><th>Lý do</th></tr></thead>
<tbody>
<tr><td>bắt đầu</td><td>a, b1, c1, d</td><td>a, b2, c, d2</td><td>a3, b, c, d</td><td>—</td></tr>
<tr><td>1</td><td>a, b1, c1, d</td><td>a, b1, c, d2</td><td>a3, b, c, d</td><td>A → B: dòng 1, 2 trùng A ⇒ b2 thành b1</td></tr>
<tr><td>2</td><td>a, b1, c, d</td><td>a, b1, c, d2</td><td>a3, b, c, d</td><td>B → C: dòng 1, 2 trùng B ⇒ c1 thành c</td></tr>
<tr><td>3</td><td>a, b1, c, d</td><td>a, b1, c, d2</td><td>a, b, c, d</td><td>CD → A: dòng 1, 3 trùng (c, d) ⇒ a3 thành a</td></tr>
<tr><td>4</td><td>a, b, c, d</td><td>a, b, c, d2</td><td>a, b, c, d</td><td>A → B: dòng 1, 3 trùng A ⇒ b1 thành b (ở mọi dòng)</td></tr>
</tbody>
</table>
<p class="dap-an">✅ (a) Dòng 1 (và dòng 3) toàn chữ trơn ⇒ <strong>không mất thông tin</strong>.</p>
<p class="nhan">(b) {AB, BC, CD}</p>
<table>
<thead><tr><th>Bước</th><th>Dòng AB</th><th>Dòng BC</th><th>Dòng CD</th><th>Lý do</th></tr></thead>
<tbody>
<tr><td>bắt đầu</td><td>a, b, c1, d1</td><td>a2, b, c, d2</td><td>a3, b3, c, d</td><td>—</td></tr>
<tr><td>1</td><td>a, b, c, d1</td><td>a2, b, c, d2</td><td>a3, b3, c, d</td><td>B → C: dòng 1, 2 trùng B ⇒ c1 thành c</td></tr>
<tr><td>kết thúc</td><td>không FD nào dùng được: các dòng trùng C nhưng không bao giờ trùng CD, cũng không trùng A</td><td></td><td></td><td>dừng</td></tr>
</tbody>
</table>
<p class="dap-an">✅ (b) Không dòng nào toàn chữ trơn ⇒ <strong>mất thông tin (lossy)</strong>. Chính bảng cuối là phản ví dụ: lấy nó làm dữ liệu của R, chiếu lên AB, BC, CD rồi nối lại — (a, b, c, d) xuất hiện dù R không chứa nó.</p>
<div class="pitfall">Khi đồng nhất hai ký hiệu, phải đổi chúng <strong>ở mọi dòng</strong>, và ưu tiên chữ trơn (b1 → b, không bao giờ b → b1). Bước 4 của (a) chỉ đúng vì b1 ở dòng 2 cũng đổi theo.</div>`),
    bi(`<h3>🧪 Exercise 8 — a real order table, from F to CREATE TABLE (PE style · ~20 min)</h3>
<p class="nhan">Task</p>
<p>A shop keeps everything in one table OrderFlat(OrderID, OrderDate, CustomerID, CustomerName, ProductID, ProductName, UnitPrice, Qty). Business rules: an order has one date and one customer; a customer has one name; a product has one name and one current price; an order line has one quantity. (a) Write F, find the key and the highest normal form. (b) Decompose into 3NF. (c) Create the tables in T-SQL and show the original rows can be rebuilt.</p>
<p class="nhan">(a) With O, D, C, N, P, M, U, Q for the eight columns: F = {O → DC, C → N, P → MU, OP → Q}</p>
<table>
<thead><tr><th>X</th><th>X⁺</th><th>Conclusion</th></tr></thead>
<tbody>
<tr><td>{O}</td><td>{O, D, C, N}</td><td>not a superkey</td></tr>
<tr><td>{P}</td><td>{P, M, U}</td><td>not a superkey</td></tr>
<tr><td>{C}</td><td>{C, N}</td><td>not a superkey</td></tr>
<tr><td>{O, P}</td><td>all 8</td><td>the key (O and P never appear on a right side)</td></tr>
</tbody>
</table>
<p>O → D and P → M depend on part of the key OP ⇒ partial dependencies ⇒ <strong>1NF</strong> only.</p>
<p class="nhan">(b) 3NF synthesis</p>
<table>
<thead><tr><th>Step</th><th>Result</th></tr></thead>
<tbody>
<tr><td>minimal cover</td><td>{O → D, O → C, C → N, P → M, P → U, OP → Q}</td></tr>
<tr><td>one relation per left side</td><td>Orders(O, D, C), Customers(C, N), Products(P, M, U), OrderLines(O, P, Q)</td></tr>
<tr><td>key contained?</td><td>OrderLines contains OP ✓ — and each table is in BCNF (checked by script)</td></tr>
</tbody>
</table>
<p class="nhan">(c) The four tables on SQL Server, with a price change done in one place, then the join that rebuilds OrderFlat</p>
<pre><code class="language-sql">CREATE TABLE Customers (                          -- C -&gt; N
  CustomerID   VARCHAR(5) PRIMARY KEY,
  CustomerName NVARCHAR(40) NOT NULL
);
CREATE TABLE Orders (                             -- O -&gt; D, C
  OrderID    INT PRIMARY KEY,
  OrderDate  DATE NOT NULL,
  CustomerID VARCHAR(5) NOT NULL REFERENCES Customers(CustomerID)
);
CREATE TABLE Products (                           -- P -&gt; M, U
  ProductID   VARCHAR(5) PRIMARY KEY,
  ProductName NVARCHAR(40) NOT NULL,
  UnitPrice   DECIMAL(10, 2) NOT NULL
);
CREATE TABLE OrderLines (                         -- O, P -&gt; Q
  OrderID   INT REFERENCES Orders(OrderID),
  ProductID VARCHAR(5) REFERENCES Products(ProductID),
  Qty       INT NOT NULL CHECK (Qty &gt; 0),
  PRIMARY KEY (OrderID, ProductID)
);</code></pre>
<pre><code class="language-sql">-- The price of P02 changes: ONE row to update
UPDATE Products SET UnitPrice = 20000 WHERE ProductID = 'P02';</code></pre>
<pre><code class="language-sql">-- Rebuild the original flat table from the four 3NF tables
SELECT o.OrderID, o.OrderDate, c.CustomerID, c.CustomerName,
       p.ProductID, p.ProductName, p.UnitPrice, l.Qty
FROM OrderLines l
JOIN Orders    o ON o.OrderID    = l.OrderID
JOIN Customers c ON c.CustomerID = o.CustomerID
JOIN Products  p ON p.ProductID  = l.ProductID
ORDER BY o.OrderID, p.ProductID;</code></pre>
<div class="out">(2 rows affected)<br>
(3 rows affected)<br>
(3 rows affected)<br>
(5 rows affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>OrderID</th><th>OrderDate</th><th>CustomerID</th><th>CustomerName</th><th>ProductID</th><th>ProductName</th><th>UnitPrice</th><th>Qty</th></tr></thead>
<tbody>
<tr><td>1001</td><td>2026-09-01</td><td>C01</td><td>Nguyễn Văn An</td><td>P01</td><td>Bút bi</td><td>5000.00</td><td>10</td></tr>
<tr><td>1001</td><td>2026-09-01</td><td>C01</td><td>Nguyễn Văn An</td><td>P02</td><td>Vở 200 trang</td><td>20000.00</td><td>2</td></tr>
<tr><td>1002</td><td>2026-09-02</td><td>C02</td><td>Trần Thị Bình</td><td>P02</td><td>Vở 200 trang</td><td>20000.00</td><td>5</td></tr>
<tr><td>1003</td><td>2026-09-05</td><td>C01</td><td>Nguyễn Văn An</td><td>P01</td><td>Bút bi</td><td>5000.00</td><td>3</td></tr>
<tr><td>1003</td><td>2026-09-05</td><td>C01</td><td>Nguyễn Văn An</td><td>P03</td><td>Thước kẻ</td><td>7000.00</td><td>1</td></tr>
</tbody>
</table>
<ul>
<li><code>NVARCHAR(40)</code> + <code>N'Nguyễn Văn An'</code> — SQL Server's Unicode text; without the <code>N</code> the accents turn into <code>?</code> (a classic PE mistake).</li>
<li><code>DECIMAL(10, 2)</code> — an exact number with 2 digits after the point, right for money; <code>CHECK (Qty &gt; 0)</code> rejects a zero or negative quantity.</li>
<li><code>NOT NULL</code> — the column must always have a value; each <code>REFERENCES</code> line is one arrow of the ERD below.</li>
<li>The final <code>SELECT</code> joins the four tables through their keys; <code>ORDER BY</code> sorts by order, then product.</li>
</ul>
<p>The new price 20000 appears on both lines of product P02 (orders 1001 and 1002) after one UPDATE of one row — in OrderFlat it would have needed an update per order line, the update anomaly of slide 21.</p>
<p class="nhan">The same result as an ERD</p>
<pre><code class="language-plaintext">[CUSTOMER] 1 ──&lt; places &gt;── ∞ [ORDER] ∞ ──&lt; contains &gt;── ∞ [PRODUCT]
CustomerID (key)              OrderID (key)   attribute: Qty    ProductID (key)
CustomerName                  OrderDate                         ProductName, UnitPrice</code></pre>
<p>Each FD with a single-attribute left side is an entity (C → N: CUSTOMER, O → DC: ORDER, P → MU: PRODUCT); O → C is the many-to-one relationship "places" (foreign key CustomerID in Orders); OP → Q is the many-to-many relationship "contains" with its attribute Qty (table OrderLines). Normalizing and drawing the ERD first lead to the same four tables.</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong> (the version you will use in your project) Vietnamese text needs no <code>NVARCHAR</code> and no <code>N'…'</code> prefix — <code>TEXT</code> stores Unicode; <code>NUMERIC</code> replaces <code>DECIMAL</code> (same thing), and <code>JOIN … USING (col)</code> shortens the join conditions.
<pre><code class="language-sql">CREATE TABLE customers (
  customer_id   VARCHAR(5) PRIMARY KEY,
  customer_name TEXT NOT NULL                     -- TEXT stores Unicode, no N'...' needed
);
CREATE TABLE orders (
  order_id    INT PRIMARY KEY,
  order_date  DATE NOT NULL,
  customer_id VARCHAR(5) NOT NULL REFERENCES customers
);
CREATE TABLE products (
  product_id   VARCHAR(5) PRIMARY KEY,
  product_name TEXT NOT NULL,
  unit_price   NUMERIC(10, 2) NOT NULL
);
CREATE TABLE order_lines (
  order_id   INT REFERENCES orders,
  product_id VARCHAR(5) REFERENCES products,
  qty        INT NOT NULL CHECK (qty &gt; 0),
  PRIMARY KEY (order_id, product_id)
);
INSERT INTO customers VALUES ('C01', 'Nguyễn Văn An'), ('C02', 'Trần Thị Bình');</code></pre>
<div class="out">INSERT 0 2<br>
INSERT 0 3<br>
INSERT 0 3<br>
INSERT 0 5<br>
UPDATE 1</div>
<table>
<thead><tr><th>order_id</th><th>customer_name</th><th>product_name</th><th>unit_price</th><th>qty</th></tr></thead>
<tbody>
<tr><td>1001</td><td>Nguyễn Văn An</td><td>Bút bi</td><td>5000.00</td><td>10</td></tr>
<tr><td>1001</td><td>Nguyễn Văn An</td><td>Vở 200 trang</td><td>20000.00</td><td>2</td></tr>
<tr><td>1002</td><td>Trần Thị Bình</td><td>Vở 200 trang</td><td>20000.00</td><td>5</td></tr>
<tr><td>1003</td><td>Nguyễn Văn An</td><td>Bút bi</td><td>5000.00</td><td>3</td></tr>
<tr><td>1003</td><td>Nguyễn Văn An</td><td>Thước kẻ</td><td>7000.00</td><td>1</td></tr>
</tbody>
</table>
Lessons: <a href="/courses/postgresql/learn?lessonSlug=postgresql-2-2-text">PostgreSQL 2.2 — text types</a> · <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-4-alter-chuan-hoa">PostgreSQL 3.4 — normalization</a>.</div>
<div class="pitfall">Storing UnitPrice in Products means an old order shows <em>today's</em> price. Real systems copy the price into OrderLines at the time of sale — that is a different attribute ("price paid", determined by OP), not redundancy. Say so in a design defense.</div>`,
    `<h3>🧪 Bài 8 — một bảng đơn hàng thật, từ F tới CREATE TABLE (kiểu PE · ~20 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Một cửa hàng lưu mọi thứ trong một bảng OrderFlat(OrderID, OrderDate, CustomerID, CustomerName, ProductID, ProductName, UnitPrice, Qty). Luật nghiệp vụ: mỗi đơn có một ngày và một khách; mỗi khách một tên; mỗi sản phẩm một tên và một giá hiện hành; mỗi dòng đơn một số lượng. (a) Viết F, tìm khoá và dạng chuẩn cao nhất. (b) Phân rã về 3NF. (c) Tạo bảng bằng T-SQL và chứng tỏ dựng lại được các dòng ban đầu.</p>
<p class="nhan">(a) Đặt O, D, C, N, P, M, U, Q cho tám cột: F = {O → DC, C → N, P → MU, OP → Q}</p>
<table>
<thead><tr><th>X</th><th>X⁺</th><th>Kết luận</th></tr></thead>
<tbody>
<tr><td>{O}</td><td>{O, D, C, N}</td><td>không là siêu khoá</td></tr>
<tr><td>{P}</td><td>{P, M, U}</td><td>không là siêu khoá</td></tr>
<tr><td>{C}</td><td>{C, N}</td><td>không là siêu khoá</td></tr>
<tr><td>{O, P}</td><td>cả 8</td><td>là khoá (O và P không bao giờ ở vế phải)</td></tr>
</tbody>
</table>
<p>O → D và P → M phụ thuộc vào một phần của khoá OP ⇒ phụ thuộc bộ phận ⇒ chỉ đạt <strong>1NF</strong>.</p>
<p class="nhan">(b) Tổng hợp 3NF</p>
<table>
<thead><tr><th>Bước</th><th>Kết quả</th></tr></thead>
<tbody>
<tr><td>phủ tối thiểu</td><td>{O → D, O → C, C → N, P → M, P → U, OP → Q}</td></tr>
<tr><td>mỗi vế trái một quan hệ</td><td>Orders(O, D, C), Customers(C, N), Products(P, M, U), OrderLines(O, P, Q)</td></tr>
<tr><td>đã chứa khoá?</td><td>OrderLines chứa OP ✓ — và mỗi bảng đều đạt BCNF (đã kiểm bằng script)</td></tr>
</tbody>
</table>
<p class="nhan">(c) Bốn bảng trên SQL Server, đổi giá ở đúng một chỗ, rồi phép nối dựng lại OrderFlat</p>
<pre><code class="language-sql">CREATE TABLE Customers (                          -- C → N
  CustomerID   VARCHAR(5) PRIMARY KEY,
  CustomerName NVARCHAR(40) NOT NULL
);
CREATE TABLE Orders (                             -- O → D, C
  OrderID    INT PRIMARY KEY,
  OrderDate  DATE NOT NULL,
  CustomerID VARCHAR(5) NOT NULL REFERENCES Customers(CustomerID)
);
CREATE TABLE Products (                           -- P → M, U
  ProductID   VARCHAR(5) PRIMARY KEY,
  ProductName NVARCHAR(40) NOT NULL,
  UnitPrice   DECIMAL(10, 2) NOT NULL
);
CREATE TABLE OrderLines (                         -- O, P → Q
  OrderID   INT REFERENCES Orders(OrderID),
  ProductID VARCHAR(5) REFERENCES Products(ProductID),
  Qty       INT NOT NULL CHECK (Qty &gt; 0),
  PRIMARY KEY (OrderID, ProductID)
);</code></pre>
<pre><code class="language-sql">-- Giá P02 đổi: chỉ sửa MỘT dòng
UPDATE Products SET UnitPrice = 20000 WHERE ProductID = 'P02';</code></pre>
<pre><code class="language-sql">-- Dựng lại bảng phẳng ban đầu từ bốn bảng 3NF
SELECT o.OrderID, o.OrderDate, c.CustomerID, c.CustomerName,
       p.ProductID, p.ProductName, p.UnitPrice, l.Qty
FROM OrderLines l
JOIN Orders    o ON o.OrderID    = l.OrderID
JOIN Customers c ON c.CustomerID = o.CustomerID
JOIN Products  p ON p.ProductID  = l.ProductID
ORDER BY o.OrderID, p.ProductID;</code></pre>
<div class="out">(2 rows affected)<br>
(3 rows affected)<br>
(3 rows affected)<br>
(5 rows affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>OrderID</th><th>OrderDate</th><th>CustomerID</th><th>CustomerName</th><th>ProductID</th><th>ProductName</th><th>UnitPrice</th><th>Qty</th></tr></thead>
<tbody>
<tr><td>1001</td><td>2026-09-01</td><td>C01</td><td>Nguyễn Văn An</td><td>P01</td><td>Bút bi</td><td>5000.00</td><td>10</td></tr>
<tr><td>1001</td><td>2026-09-01</td><td>C01</td><td>Nguyễn Văn An</td><td>P02</td><td>Vở 200 trang</td><td>20000.00</td><td>2</td></tr>
<tr><td>1002</td><td>2026-09-02</td><td>C02</td><td>Trần Thị Bình</td><td>P02</td><td>Vở 200 trang</td><td>20000.00</td><td>5</td></tr>
<tr><td>1003</td><td>2026-09-05</td><td>C01</td><td>Nguyễn Văn An</td><td>P01</td><td>Bút bi</td><td>5000.00</td><td>3</td></tr>
<tr><td>1003</td><td>2026-09-05</td><td>C01</td><td>Nguyễn Văn An</td><td>P03</td><td>Thước kẻ</td><td>7000.00</td><td>1</td></tr>
</tbody>
</table>
<ul>
<li><code>NVARCHAR(40)</code> + <code>N'Nguyễn Văn An'</code> — chuỗi Unicode của SQL Server; thiếu chữ <code>N</code> là dấu tiếng Việt thành <code>?</code> (lỗi PE kinh điển).</li>
<li><code>DECIMAL(10, 2)</code> — số chính xác có 2 chữ số sau dấu phẩy, hợp với tiền; <code>CHECK (Qty &gt; 0)</code> từ chối số lượng bằng 0 hoặc âm.</li>
<li><code>NOT NULL</code> — cột luôn phải có giá trị; mỗi dòng <code>REFERENCES</code> là một mũi tên của ERD bên dưới.</li>
<li>Câu <code>SELECT</code> cuối nối bốn bảng qua các khoá; <code>ORDER BY</code> sắp theo đơn rồi theo sản phẩm.</li>
</ul>
<p>Giá mới 20000 hiện trên cả hai dòng của sản phẩm P02 (đơn 1001 và 1002) chỉ sau một câu UPDATE trên một dòng — ở OrderFlat thì phải sửa từng dòng đơn, đúng bất thường cập nhật của slide 21.</p>
<p class="nhan">Cùng kết quả dưới dạng ERD</p>
<pre><code class="language-plaintext">[KHÁCH HÀNG] 1 ──&lt; đặt &gt;── ∞ [ĐƠN HÀNG] ∞ ──&lt; gồm &gt;── ∞ [SẢN PHẨM]
CustomerID (khoá)            OrderID (khoá)  thuộc tính: Qty  ProductID (khoá)
CustomerName                 OrderDate                        ProductName, UnitPrice</code></pre>
<p>Mỗi FD có vế trái một thuộc tính là một thực thể (C → N: KHÁCH HÀNG, O → DC: ĐƠN HÀNG, P → MU: SẢN PHẨM); O → C là liên kết nhiều–một "đặt" (khoá ngoại CustomerID trong Orders); OP → Q là liên kết nhiều–nhiều "gồm" với thuộc tính Qty (bảng OrderLines). Chuẩn hoá, hay vẽ ERD trước, đều dẫn tới cùng bốn bảng này.</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> (bản bạn sẽ dùng trong đồ án) chữ tiếng Việt không cần <code>NVARCHAR</code> hay tiền tố <code>N'…'</code> — <code>TEXT</code> lưu được Unicode; <code>NUMERIC</code> thay cho <code>DECIMAL</code> (cùng một thứ), và <code>JOIN … USING (cột)</code> viết gọn điều kiện nối.
<pre><code class="language-sql">CREATE TABLE customers (
  customer_id   VARCHAR(5) PRIMARY KEY,
  customer_name TEXT NOT NULL                     -- TEXT lưu Unicode, không cần N'...'
);
CREATE TABLE orders (
  order_id    INT PRIMARY KEY,
  order_date  DATE NOT NULL,
  customer_id VARCHAR(5) NOT NULL REFERENCES customers
);
CREATE TABLE products (
  product_id   VARCHAR(5) PRIMARY KEY,
  product_name TEXT NOT NULL,
  unit_price   NUMERIC(10, 2) NOT NULL
);
CREATE TABLE order_lines (
  order_id   INT REFERENCES orders,
  product_id VARCHAR(5) REFERENCES products,
  qty        INT NOT NULL CHECK (qty &gt; 0),
  PRIMARY KEY (order_id, product_id)
);
INSERT INTO customers VALUES ('C01', 'Nguyễn Văn An'), ('C02', 'Trần Thị Bình');</code></pre>
<div class="out">INSERT 0 2<br>
INSERT 0 3<br>
INSERT 0 3<br>
INSERT 0 5<br>
UPDATE 1</div>
<table>
<thead><tr><th>order_id</th><th>customer_name</th><th>product_name</th><th>unit_price</th><th>qty</th></tr></thead>
<tbody>
<tr><td>1001</td><td>Nguyễn Văn An</td><td>Bút bi</td><td>5000.00</td><td>10</td></tr>
<tr><td>1001</td><td>Nguyễn Văn An</td><td>Vở 200 trang</td><td>20000.00</td><td>2</td></tr>
<tr><td>1002</td><td>Trần Thị Bình</td><td>Vở 200 trang</td><td>20000.00</td><td>5</td></tr>
<tr><td>1003</td><td>Nguyễn Văn An</td><td>Bút bi</td><td>5000.00</td><td>3</td></tr>
<tr><td>1003</td><td>Nguyễn Văn An</td><td>Thước kẻ</td><td>7000.00</td><td>1</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-2-2-text">PostgreSQL 2.2 — kiểu chữ</a> · <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-4-alter-chuan-hoa">PostgreSQL 3.4 — chuẩn hoá</a>.</div>
<div class="pitfall">Lưu UnitPrice trong Products nghĩa là đơn cũ hiện giá <em>hôm nay</em>. Hệ thống thật chép giá vào OrderLines lúc bán — đó là một thuộc tính khác ("giá đã trả", do OP xác định), không phải dư thừa. Nhớ nói điều này khi bảo vệ thiết kế.</div>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>functional dependency (FD) X → Y</strong></td><td>phụ thuộc hàm</td><td>Any two tuples that agree on X also agree on Y.</td></tr>
<tr><td><strong>trivial FD</strong></td><td>FD tầm thường</td><td>An FD whose right side is a subset of its left side, e.g. AB → A.</td></tr>
<tr><td><strong>Armstrong's axioms</strong></td><td>tiên đề Armstrong</td><td>Reflexivity, augmentation, transitivity — together they derive every implied FD.</td></tr>
<tr><td><strong>closure of attributes X⁺</strong></td><td>bao đóng của tập thuộc tính</td><td>Every attribute determined by X; X → Y follows from F iff Y ⊆ X⁺.</td></tr>
<tr><td><strong>follows from / equivalent</strong></td><td>suy ra từ / tương đương</td><td>S follows from T if every instance satisfying T satisfies S; equivalent = both directions.</td></tr>
<tr><td><strong>superkey</strong></td><td>siêu khoá</td><td>A set of attributes whose closure is the whole relation.</td></tr>
<tr><td><strong>candidate key</strong></td><td>khoá ứng viên</td><td>A minimal superkey: no attribute can be removed.</td></tr>
<tr><td><strong>primary key</strong></td><td>khoá chính</td><td>The candidate key the designer picks to identify rows.</td></tr>
<tr><td><strong>prime attribute</strong></td><td>thuộc tính khoá</td><td>An attribute that belongs to at least one candidate key.</td></tr>
<tr><td><strong>minimal basis (minimal cover)</strong></td><td>phủ tối thiểu</td><td>An equivalent FD set with single right sides, no redundant FD and no extra left-side attribute.</td></tr>
<tr><td><strong>projection of FDs</strong></td><td>chiếu tập FD</td><td>The FDs that follow from F and use only the attributes of a sub-relation.</td></tr>
<tr><td><strong>anomaly</strong></td><td>bất thường</td><td>A problem caused by redundancy: update, deletion or insertion anomaly.</td></tr>
<tr><td><strong>redundancy</strong></td><td>dư thừa</td><td>The same fact stored in several tuples.</td></tr>
<tr><td><strong>decomposition</strong></td><td>phân rã</td><td>Replacing R by projections whose attributes together cover R.</td></tr>
<tr><td><strong>lossless join</strong></td><td>nối không mất thông tin</td><td>Joining the pieces gives back exactly R — no spurious tuples.</td></tr>
<tr><td><strong>spurious tuple</strong></td><td>bộ giả</td><td>A tuple produced by joining lossy pieces that was not in the original relation.</td></tr>
<tr><td><strong>chase test</strong></td><td>phép kiểm chase</td><td>A tableau with one row per piece; apply FDs until a row has no subscripts (lossless) or nothing changes.</td></tr>
<tr><td><strong>dependency preservation</strong></td><td>bảo toàn phụ thuộc</td><td>Every FD of F follows from the FDs projected onto the pieces, so it can be checked without a join.</td></tr>
<tr><td><strong>repeating group</strong></td><td>nhóm lặp</td><td>Several values stored in one cell or one row for one key — forbidden by 1NF.</td></tr>
<tr><td><strong>partial dependency</strong></td><td>phụ thuộc bộ phận</td><td>A non-prime attribute determined by a proper part of a composite key — forbidden by 2NF.</td></tr>
<tr><td><strong>full functional dependency</strong></td><td>phụ thuộc hàm đầy đủ</td><td>X → Y where no attribute can be removed from X.</td></tr>
<tr><td><strong>transitive dependency</strong></td><td>phụ thuộc bắc cầu</td><td>A non-key attribute determined through another non-key attribute — forbidden by 3NF.</td></tr>
<tr><td><strong>Boyce-Codd normal form (BCNF)</strong></td><td>dạng chuẩn Boyce-Codd</td><td>Every non-trivial FD has a superkey on the left.</td></tr>
<tr><td><strong>3NF synthesis</strong></td><td>tổng hợp 3NF</td><td>Build one relation per FD of a minimal cover, add a key if needed — lossless and dependency-preserving.</td></tr>
<tr><td><strong>multivalued dependency (MVD) X ↠ Y</strong></td><td>phụ thuộc đa trị</td><td>Independent sets of values for one X, the basis of 4NF — named in the slides, taught in Ullman §3.6.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>functional dependency (FD) X → Y</strong></td><td>phụ thuộc hàm</td><td>Hai bộ bất kỳ bằng nhau trên X thì cũng bằng nhau trên Y.</td></tr>
<tr><td><strong>trivial FD</strong></td><td>FD tầm thường</td><td>FD có vế phải là tập con của vế trái, ví dụ AB → A.</td></tr>
<tr><td><strong>Armstrong's axioms</strong></td><td>tiên đề Armstrong</td><td>Phản xạ, tăng trưởng, bắc cầu — cùng nhau suy ra được mọi FD kéo theo.</td></tr>
<tr><td><strong>closure of attributes X⁺</strong></td><td>bao đóng của tập thuộc tính</td><td>Mọi thuộc tính do X xác định; X → Y suy ra từ F khi và chỉ khi Y ⊆ X⁺.</td></tr>
<tr><td><strong>follows from / equivalent</strong></td><td>suy ra từ / tương đương</td><td>S suy ra từ T nếu mọi thể hiện thoả T đều thoả S; tương đương = đúng cả hai chiều.</td></tr>
<tr><td><strong>superkey</strong></td><td>siêu khoá</td><td>Tập thuộc tính có bao đóng là cả quan hệ.</td></tr>
<tr><td><strong>candidate key</strong></td><td>khoá ứng viên</td><td>Siêu khoá tối tiểu: không bỏ được thuộc tính nào.</td></tr>
<tr><td><strong>primary key</strong></td><td>khoá chính</td><td>Khoá ứng viên được người thiết kế chọn để định danh dòng.</td></tr>
<tr><td><strong>prime attribute</strong></td><td>thuộc tính khoá</td><td>Thuộc tính nằm trong ít nhất một khoá ứng viên.</td></tr>
<tr><td><strong>minimal basis (minimal cover)</strong></td><td>phủ tối thiểu</td><td>Tập FD tương đương có vế phải đơn, không FD thừa, không thuộc tính thừa ở vế trái.</td></tr>
<tr><td><strong>projection of FDs</strong></td><td>chiếu tập FD</td><td>Các FD suy ra từ F và chỉ dùng thuộc tính của một quan hệ con.</td></tr>
<tr><td><strong>anomaly</strong></td><td>bất thường</td><td>Sự cố do dư thừa gây ra: bất thường cập nhật, xoá hoặc chèn.</td></tr>
<tr><td><strong>redundancy</strong></td><td>dư thừa</td><td>Cùng một sự thật được lưu ở nhiều bộ.</td></tr>
<tr><td><strong>decomposition</strong></td><td>phân rã</td><td>Thay R bằng các phép chiếu mà thuộc tính hợp lại phủ đủ R.</td></tr>
<tr><td><strong>lossless join</strong></td><td>nối không mất thông tin</td><td>Nối các mảnh cho lại đúng R — không có bộ giả.</td></tr>
<tr><td><strong>spurious tuple</strong></td><td>bộ giả</td><td>Bộ sinh ra khi nối các mảnh mất thông tin mà không có trong quan hệ gốc.</td></tr>
<tr><td><strong>chase test</strong></td><td>phép kiểm chase</td><td>Một bảng mỗi mảnh một dòng; áp FD tới khi có dòng không còn chỉ số (lossless) hoặc không đổi được nữa.</td></tr>
<tr><td><strong>dependency preservation</strong></td><td>bảo toàn phụ thuộc</td><td>Mọi FD của F suy ra được từ các FD chiếu lên các mảnh, nên kiểm được mà không cần nối bảng.</td></tr>
<tr><td><strong>repeating group</strong></td><td>nhóm lặp</td><td>Nhiều giá trị lưu trong một ô hay một dòng cho một khoá — 1NF cấm.</td></tr>
<tr><td><strong>partial dependency</strong></td><td>phụ thuộc bộ phận</td><td>Thuộc tính không khoá do một phần thực sự của khoá ghép xác định — 2NF cấm.</td></tr>
<tr><td><strong>full functional dependency</strong></td><td>phụ thuộc hàm đầy đủ</td><td>X → Y mà không bỏ được thuộc tính nào khỏi X.</td></tr>
<tr><td><strong>transitive dependency</strong></td><td>phụ thuộc bắc cầu</td><td>Thuộc tính không khoá được xác định qua một thuộc tính không khoá khác — 3NF cấm.</td></tr>
<tr><td><strong>Boyce-Codd normal form (BCNF)</strong></td><td>dạng chuẩn Boyce-Codd</td><td>Mọi FD không tầm thường có vế trái là siêu khoá.</td></tr>
<tr><td><strong>3NF synthesis</strong></td><td>tổng hợp 3NF</td><td>Dựng mỗi FD của phủ tối thiểu thành một quan hệ, thêm khoá nếu cần — không mất thông tin và bảo toàn phụ thuộc.</td></tr>
<tr><td><strong>multivalued dependency (MVD) X ↠ Y</strong></td><td>phụ thuộc đa trị</td><td>Các tập giá trị độc lập ứng với một X, nền của 4NF — slide chỉ nêu tên, Ullman §3.6 giảng.</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Summary — 8 things to remember from Chapter 4</h2>
<ol>
<li><strong>FD X → Y</strong>: equal on X ⇒ equal on Y, for every legal instance. Data can refute an FD (a <code>GROUP BY … HAVING COUNT(DISTINCT …) &gt; 1</code> query finds counter-examples) but never prove one — FDs come from business rules.</li>
<li><strong>Armstrong</strong>: reflexivity, augmentation, transitivity (+ union, splitting, pseudotransitivity). Only the <em>right</em> side may be split.</li>
<li><strong>Closure X⁺</strong>: repeat passes until one adds nothing. X → Y ⇔ Y ⊆ X⁺; X superkey ⇔ X⁺ = R; key = minimal superkey.</li>
<li><strong>All keys</strong>: left-only attributes are in every key, right-only ones in none; close the must-set and grow it one attribute at a time; keep only minimal sets.</li>
<li><strong>Minimal cover</strong>: split right sides → drop extra left-side attributes → drop redundant FDs. Not unique.</li>
<li><strong>Normal forms</strong>: 1NF atomic values; 2NF no non-prime attribute on part of a key; 3NF for every X → A, X superkey or A prime; BCNF X superkey. BCNF ⇒ 3NF ⇒ 2NF ⇒ 1NF.</li>
<li><strong>Decomposition</strong>: lossless (chase; two pieces: R1 ∩ R2 is a key of one side) and dependency-preserving (projected FDs imply F) are separate properties.</li>
<li><strong>Algorithms</strong>: BCNF — split by a violating FD X → Y into X⁺ and R − (X⁺ − X), always lossless, may lose FDs; 3NF synthesis — one relation per FD of a minimal cover plus a key, lossless and preserving.</li>
</ol>
<h3>✅ Check yourself before the quiz</h3>
<ol>
<li>R(A, B, C), F = {A → B, B → C}. Key? Highest NF?</li>
<li>Two pieces R1(A, B) and R2(B, C) of R(A, B, C) with only A → B. Lossless?</li>
<li>Why does 3NF synthesis sometimes add a relation that is just a key?</li>
<li>Can a relation in 3NF have redundancy?</li>
</ol>
<p class="dap-an">✅ <strong>Answers:</strong> (1) Key A; B → C is transitive through non-prime B ⇒ 2NF. (2) No: R1 ∩ R2 = {B}, and B determines neither A nor C (B⁺ = {B}). (3) Without a relation containing a key the chase may never produce an all-plain row — see the pitfall on slide 71 (F = {A → B, C → D}). (4) Yes — an FD like C → B with a prime right side is allowed in 3NF and repeats its values (Exercise 6, R1).</p>`,
    `<h2>📌 Tóm tắt — 8 điều cần nhớ của Chương 4</h2>
<ol>
<li><strong>FD X → Y</strong>: bằng nhau trên X ⇒ bằng nhau trên Y, với mọi thể hiện hợp lệ. Dữ liệu bác bỏ được một FD (câu <code>GROUP BY … HAVING COUNT(DISTINCT …) &gt; 1</code> tìm ra phản ví dụ) nhưng không bao giờ chứng minh được — FD đến từ luật nghiệp vụ.</li>
<li><strong>Armstrong</strong>: phản xạ, tăng trưởng, bắc cầu (+ hợp, tách, giả bắc cầu). Chỉ được tách vế <em>phải</em>.</li>
<li><strong>Bao đóng X⁺</strong>: quét nhiều lượt tới khi một lượt không thêm gì. X → Y ⇔ Y ⊆ X⁺; X là siêu khoá ⇔ X⁺ = R; khoá = siêu khoá tối tiểu.</li>
<li><strong>Mọi khoá</strong>: thuộc tính chỉ ở vế trái có trong mọi khoá, chỉ ở vế phải thì không có trong khoá nào; tính bao đóng của tập bắt buộc rồi thêm dần từng thuộc tính; chỉ giữ các tập tối tiểu.</li>
<li><strong>Phủ tối thiểu</strong>: tách vế phải → bỏ thuộc tính thừa vế trái → bỏ FD thừa. Không duy nhất.</li>
<li><strong>Dạng chuẩn</strong>: 1NF giá trị nguyên tố; 2NF không thuộc tính không khoá nào phụ thuộc vào một phần của khoá; 3NF với mọi X → A, X là siêu khoá hoặc A là thuộc tính khoá; BCNF X là siêu khoá. BCNF ⇒ 3NF ⇒ 2NF ⇒ 1NF.</li>
<li><strong>Phân rã</strong>: không mất thông tin (chase; hai mảnh: R1 ∩ R2 là khoá của một bên) và bảo toàn phụ thuộc (FD chiếu suy ra được F) là hai tính chất riêng biệt.</li>
<li><strong>Thuật toán</strong>: BCNF — tách theo FD vi phạm X → Y thành X⁺ và R − (X⁺ − X), luôn lossless, có thể mất FD; tổng hợp 3NF — mỗi FD của phủ tối thiểu một quan hệ, thêm khoá nếu thiếu, lossless và bảo toàn phụ thuộc.</li>
</ol>
<h3>✅ Tự kiểm tra trước khi làm bài trắc nghiệm (quiz)</h3>
<ol>
<li>R(A, B, C), F = {A → B, B → C}. Khoá? Dạng chuẩn cao nhất?</li>
<li>Hai mảnh R1(A, B) và R2(B, C) của R(A, B, C), chỉ có A → B. Có mất thông tin không?</li>
<li>Vì sao tổng hợp 3NF đôi khi phải thêm một quan hệ chỉ gồm khoá?</li>
<li>Quan hệ đạt 3NF có thể còn dư thừa không?</li>
</ol>
<p class="dap-an">✅ <strong>Đáp án:</strong> (1) Khoá A; B → C bắc cầu qua B không khoá ⇒ 2NF. (2) Có mất: R1 ∩ R2 = {B}, mà B không xác định A cũng không xác định C (B⁺ = {B}). (3) Không có quan hệ nào chứa khoá thì chase có thể không bao giờ ra dòng toàn chữ trơn — xem bẫy ở slide 71 (F = {A → B, C → D}). (4) Có — FD kiểu C → B với vế phải là thuộc tính khoá được 3NF cho phép và làm lặp giá trị (Bài 6, R1).</p>`),
  ].join('\n'),
};

/* ───────── Quiz (dbi202-quiz-2) — 10 câu ───────── */
const QUIZ = {
  timeLimitSeconds: 900,
  questions: [
    { id: 'q1',
      question: 'R(A, B, C, D, E) with F = {A → B, B → C, CD → E}. What is the closure {A, D}⁺?|||R(A, B, C, D, E) với F = {A → B, B → C, CD → E}. Bao đóng {A, D}⁺ là gì?',
      options: ['{A, B, C}|||{A, B, C}', '{A, B, C, D}|||{A, B, C, D}', '{A, B, C, D, E}|||{A, B, C, D, E}', '{A, D, E}|||{A, D, E}'],
      correctIndex: 2,
      points: 1,
      explanation: 'Start with {A, D}; A → B adds B, B → C adds C, and now C and D are both present so CD → E adds E: {A, B, C, D, E}, so AD is a superkey. B misses the last step: once C has been added, C and D are both in the set, so CD → E must fire too; A is the closure of A alone.|||Bắt đầu từ {A, D}; A → B thêm B, B → C thêm C, lúc này có đủ C và D nên CD → E thêm E: {A, B, C, D, E}, vậy AD là siêu khoá. B thiếu bước cuối: khi C đã được thêm thì có đủ C và D, nên CD → E cũng phải dùng; A là bao đóng của riêng A.' },
    { id: 'q2',
      question: 'R(A, B, C, D) with F = {AB → C, C → D, D → A}. Which list contains exactly all candidate keys of R?|||R(A, B, C, D) với F = {AB → C, C → D, D → A}. Danh sách nào gồm đúng tất cả các khoá ứng viên của R?',
      options: ['AB, BC, BD|||AB, BC, BD', 'AB only|||Chỉ AB', 'AB, CD|||AB, CD', 'AB, AC, BD|||AB, AC, BD'],
      correctIndex: 0,
      points: 1,
      explanation: 'B never appears on a right side, so it is in every key, and B⁺ = {B}. Adding one attribute: (AB)⁺, (BC)⁺ and (BD)⁺ are all {A, B, C, D} — for BC: C → D, D → A; for BD: D → A, AB → C. So there are three keys. AC and CD are wrong because they lack B: (AC)⁺ = (CD)⁺ = {A, C, D}. Stopping at the first key found gives B.|||B không bao giờ ở vế phải, nên B có trong mọi khoá, và B⁺ = {B}. Thêm một thuộc tính: (AB)⁺, (BC)⁺ và (BD)⁺ đều bằng {A, B, C, D} — với BC: C → D, D → A; với BD: D → A, AB → C. Vậy có ba khoá. AC và CD sai vì thiếu B: (AC)⁺ = (CD)⁺ = {A, C, D}. Dừng ở khoá đầu tiên tìm được thì ra B.' },
    { id: 'q3',
      question: "Which of the following is NOT one of Armstrong's three axioms?|||Luật nào sau đây KHÔNG phải một trong ba tiên đề Armstrong?",
      options: ['Reflexivity: if Y ⊆ X then X → Y|||Phản xạ: nếu Y ⊆ X thì X → Y', 'Augmentation: if X → Y then XZ → YZ|||Tăng trưởng: nếu X → Y thì XZ → YZ', 'Transitivity: if X → Y and Y → Z then X → Z|||Bắc cầu: nếu X → Y và Y → Z thì X → Z', 'Union: if X → Y and X → Z then X → YZ|||Hợp: nếu X → Y và X → Z thì X → YZ'],
      correctIndex: 3,
      points: 1,
      explanation: 'The three axioms are reflexivity, augmentation and transitivity (slide 7, "RAT"). Union is a correct rule, but it is derived from them (augment X → Y with X, augment X → Z with Y, then transitivity), which is why the slide lists it under "additional rules" together with splitting and pseudotransitivity.|||Ba tiên đề là phản xạ, tăng trưởng và bắc cầu (slide 7, "RAT"). Luật hợp là luật đúng, nhưng được suy ra từ ba tiên đề đó (tăng trưởng X → Y với X, tăng trưởng X → Z với Y, rồi bắc cầu), vì vậy slide xếp nó vào "additional rules" cùng luật tách và giả bắc cầu.' },
    { id: 'q4',
      question: 'R(A, B, C, D) with F = {AB → CD, C → A}. What is the highest normal form of R?|||R(A, B, C, D) với F = {AB → CD, C → A}. Dạng chuẩn cao nhất của R là gì?',
      options: ['2NF|||2NF', '3NF|||3NF', 'BCNF|||BCNF', '1NF|||1NF'],
      correctIndex: 1,
      points: 1,
      explanation: 'Keys: (AB)⁺ = {A, B, C, D} and (BC)⁺ = {A, B, C, D} (C → A, then AB → CD), so the keys are AB and BC and the prime attributes are A, B, C. C → A has a left side that is not a superkey (C⁺ = {A, C}), so R is not in BCNF; but A is prime, so 3NF allows it. Answering BCNF forgets that C is not a superkey; answering 2NF forgets the second key BC that makes A prime.|||Khoá: (AB)⁺ = {A, B, C, D} và (BC)⁺ = {A, B, C, D} (C → A, rồi AB → CD), nên khoá là AB và BC, thuộc tính khoá là A, B, C. C → A có vế trái không là siêu khoá (C⁺ = {A, C}), nên R không đạt BCNF; nhưng A là thuộc tính khoá, nên 3NF cho phép. Trả lời BCNF là quên rằng C không phải siêu khoá; trả lời 2NF là quên khoá thứ hai BC làm A thành thuộc tính khoá.' },
    { id: 'q5',
      question: 'Enrollment(StudentID, CourseID, StudentName, Grade) has key (StudentID, CourseID), with StudentID → StudentName and StudentID, CourseID → Grade. Why is it not in 2NF, and what does that mean for the ERD?|||Enrollment(StudentID, CourseID, StudentName, Grade) có khoá (StudentID, CourseID), với StudentID → StudentName và StudentID, CourseID → Grade. Vì sao nó không đạt 2NF, và điều đó nói gì về ERD?',
      options: ['Grade depends on the whole key; the ERD is missing a Grade entity|||Grade phụ thuộc cả khoá; ERD thiếu thực thể Grade', 'StudentName depends on Grade; the ERD needs a one-to-one relationship|||StudentName phụ thuộc Grade; ERD cần một liên kết một–một', 'StudentName depends on part of the key; the ERD is missing a Student entity|||StudentName phụ thuộc một phần của khoá; ERD thiếu thực thể Student', 'The key has two columns; composite keys are never allowed in 2NF|||Khoá có hai cột; 2NF không bao giờ cho phép khoá ghép'],
      correctIndex: 2,
      points: 1,
      explanation: 'StudentID → StudentName uses only part of the composite key, a partial dependency of a non-prime attribute — exactly what 2NF forbids. Each partial dependency is an entity hidden in the table: here STUDENT (key StudentID, attribute StudentName), and Enrollment is really the many-to-many relationship between Student and Course with attribute Grade. A describes the one FD that is fine (a full dependency); D is false — 2NF is only about partial dependencies, composite keys are normal.|||StudentID → StudentName chỉ dùng một phần của khoá ghép, là phụ thuộc bộ phận của thuộc tính không khoá — đúng thứ 2NF cấm. Mỗi phụ thuộc bộ phận là một thực thể trốn trong bảng: ở đây là STUDENT (khoá StudentID, thuộc tính StudentName), còn Enrollment thật ra là liên kết nhiều–nhiều giữa Student và Course với thuộc tính Grade. A mô tả chính FD hợp lệ (phụ thuộc đầy đủ); D sai — 2NF chỉ nói về phụ thuộc bộ phận, khoá ghép là chuyện bình thường.' },
    { id: 'q6',
      question: 'Table R(A, B, C) holds the rows (1, 2, 3) and (4, 2, 5). We store R1 = πA,B(R) and R2 = πB,C(R), then run the join below on SQL Server. How many rows does it return?|||Bảng R(A, B, C) chứa các dòng (1, 2, 3) và (4, 2, 5). Ta lưu R1 = πA,B(R) và R2 = πB,C(R), rồi chạy phép nối dưới đây trên SQL Server. Nó trả về bao nhiêu dòng?',
      code: `SELECT R1.A, R1.B, R2.C
FROM R1 JOIN R2 ON R1.B = R2.B;`,
      codeLang: 'sql',
      options: ['4 rows — two of them are spurious, the split is lossy|||4 dòng — hai dòng là bộ giả, phép tách mất thông tin', '2 rows — exactly R comes back|||2 dòng — đúng R quay về', '1 row — only rows agreeing on every column survive|||1 dòng — chỉ dòng khớp mọi cột mới còn', '3 rows — the duplicate B = 2 is merged once|||3 dòng — giá trị B = 2 trùng được gộp một lần'],
      correctIndex: 0,
      points: 1,
      explanation: 'Both tuples have B = 2, so each of the 2 rows of R1 matches each of the 2 rows of R2: 4 rows, including (1, 2, 5) and (4, 2, 3), which were never in R — the example of slide 26. The split is lossy because the common attribute B determines neither A nor C. B would only be right with B → A or B → C; "losing information" means gaining wrong rows, not losing rows.|||Cả hai bộ có B = 2, nên mỗi dòng trong 2 dòng của R1 khớp với mỗi dòng trong 2 dòng của R2: 4 dòng, trong đó (1, 2, 5) và (4, 2, 3) chưa từng có trong R — đúng ví dụ slide 26. Phép tách mất thông tin vì thuộc tính chung B không xác định A cũng không xác định C. B chỉ đúng khi có B → A hoặc B → C; "mất thông tin" nghĩa là thừa dòng sai, không phải thiếu dòng.' },
    { id: 'q7',
      question: 'F = {A → B, B → C, A → C, AB → D}. Which set is a minimal cover (minimal basis) of F?|||F = {A → B, B → C, A → C, AB → D}. Tập nào là một phủ tối thiểu (minimal basis) của F?',
      options: ['{A → B, B → C, A → C, A → D}|||{A → B, B → C, A → C, A → D}', '{A → B, B → C, A → D}|||{A → B, B → C, A → D}', '{A → B, B → C, AB → D}|||{A → B, B → C, AB → D}', '{A → BCD}|||{A → BCD}'],
      correctIndex: 1,
      points: 1,
      explanation: 'In AB → D the B is extra, because A⁺ = {A, B, C, D} already contains D: it becomes A → D. A → C is redundant, because A → B and B → C give it. What is left, {A → B, B → C, A → D}, has single right sides and nothing removable. A still contains the redundant A → C; C keeps the extra B; D is not even equivalent (it loses B → C) and has a multi-attribute right side.|||Trong AB → D, B là thừa, vì A⁺ = {A, B, C, D} đã chứa D: thành A → D. A → C thừa, vì A → B và B → C đã cho nó. Phần còn lại {A → B, B → C, A → D} có vế phải đơn và không bỏ được gì. A vẫn còn A → C thừa; C còn giữ B thừa; D thậm chí không tương đương (mất B → C) và vế phải nhiều thuộc tính.' },
    { id: 'q8',
      question: 'R(A, B, C, D) with F = {AB → C, C → D}. Which decomposition is a correct BCNF decomposition with a lossless join?|||R(A, B, C, D) với F = {AB → C, C → D}. Phép phân rã nào là phân rã BCNF đúng và nối không mất thông tin?',
      options: ['{ABD, CD}|||{ABD, CD}', '{AC, BCD}|||{AC, BCD}', '{AB, BC, CD}|||{AB, BC, CD}', '{CD, ABC}|||{CD, ABC}'],
      correctIndex: 3,
      points: 1,
      explanation: 'The key is AB. C → D violates BCNF (C⁺ = {C, D}), so split on it: R1 = C⁺ = CD and R2 = ABC; both are in BCNF and they share C, which is a key of CD, so the join is lossless (and here both FDs are preserved). A is the tempting one: ABD and CD are each in BCNF, but they share only D, which determines nothing — lossy. B is lossy and BCD is still 1NF; C is lossy too (checked with the chase).|||Khoá là AB. C → D vi phạm BCNF (C⁺ = {C, D}), nên tách theo nó: R1 = C⁺ = CD và R2 = ABC; cả hai đạt BCNF và có chung C, mà C là khoá của CD, nên phép nối không mất thông tin (ở đây cả hai FD cũng được giữ). A là phương án dễ nhầm: ABD và CD đều đạt BCNF, nhưng chỉ chung D, mà D không xác định gì — mất thông tin. B mất thông tin và BCD vẫn chỉ 1NF; C cũng mất thông tin (đã kiểm bằng chase).' },
    { id: 'q9',
      question: 'An ERD has entity Student(sid, name), entity Course(cid, title) and a many-to-many relationship Enrolls between them with attribute grade. How is it converted to relations?|||Một ERD có thực thể Student(sid, name), thực thể Course(cid, title) và liên kết nhiều–nhiều Enrolls giữa chúng với thuộc tính grade. Chuyển sang quan hệ thế nào?',
      options: ['3 tables: Student, Course, Enrolls(sid, cid, grade) with key (sid, cid)|||3 bảng: Student, Course, Enrolls(sid, cid, grade) với khoá (sid, cid)', '2 tables: Student(sid, name, cid, grade) and Course(cid, title)|||2 bảng: Student(sid, name, cid, grade) và Course(cid, title)', '3 tables: Student, Course, Enrolls(sid, cid, grade) with key sid|||3 bảng: Student, Course, Enrolls(sid, cid, grade) với khoá sid', '1 table: Enrolls(sid, name, cid, title, grade)|||1 bảng: Enrolls(sid, name, cid, title, grade)'],
      correctIndex: 0,
      points: 1,
      explanation: 'A many-to-many relationship becomes its own table holding the keys of both entities (both foreign keys) plus its attributes; its key is the pair (sid, cid), since a student has one grade per course. B puts cid in Student, which allows only one course per student; C with key sid has the same flaw; D is the unnormalized table of this chapter — name and title would repeat, with all three anomalies.|||Liên kết nhiều–nhiều thành một bảng riêng chứa khoá của cả hai thực thể (cả hai là khoá ngoại) cùng các thuộc tính của nó; khoá là cặp (sid, cid), vì mỗi sinh viên mỗi môn một điểm. B đặt cid vào Student, nên mỗi sinh viên chỉ học được một môn; C với khoá sid mắc cùng lỗi đó; D là bảng chưa chuẩn hoá của chương này — name và title lặp lại, đủ cả ba bất thường.' },
    { id: 'q10',
      question: 'Department(did, dname) and Employee(eid, ename) are linked by WorksIn, many-to-one: each employee works in exactly one department, a department has many employees. What is the usual relational design?|||Department(did, dname) và Employee(eid, ename) nối bằng WorksIn, nhiều–một: mỗi nhân viên làm ở đúng một phòng, một phòng có nhiều nhân viên. Thiết kế quan hệ thường dùng là gì?',
      options: ['Department(did, dname, eid) with a foreign key to Employee|||Department(did, dname, eid) với khoá ngoại tới Employee', 'Employee(eid, ename, did) with did a foreign key to Department|||Employee(eid, ename, did) với did là khoá ngoại tới Department', 'a third table WorksIn(eid, did) with key (eid, did)|||một bảng thứ ba WorksIn(eid, did) với khoá (eid, did)', 'one table Staff(eid, ename, did, dname)|||một bảng Staff(eid, ename, did, dname)'],
      correctIndex: 1,
      points: 1,
      explanation: 'The foreign key goes on the "many" side: each employee row stores the one did it belongs to, and eid → did is an ordinary key dependency. A cannot store several employees for one department. C is legal but its key (eid, did) would allow one employee in two departments — the key should be eid alone, and then the table is just merged into Employee. D has did → dname with did non-key: a transitive dependency, so only 2NF.|||Khoá ngoại đặt ở phía "nhiều": mỗi dòng nhân viên lưu did của phòng mình, và eid → did là phụ thuộc vào khoá bình thường. A không lưu được nhiều nhân viên cho một phòng. C hợp lệ nhưng khoá (eid, did) cho phép một nhân viên ở hai phòng — khoá đúng phải là eid, và khi đó bảng này gộp luôn vào Employee. D có did → dname với did không khoá: phụ thuộc bắc cầu, nên chỉ đạt 2NF.' },
  ],
};

export default {
  slides: [L_dbi4_1, L_dbi4_2, L_dbi4_3, L_dbi4_4],
  practice: L_on_ch4,
  quiz: QUIZ,
  quizDescription: '10 câu kiểu FE/PT: tính bao đóng, tìm mọi khoá, tiên đề Armstrong, dạng chuẩn cao nhất, phụ thuộc bộ phận và thực thể bị thiếu trong ERD, phép nối mất thông tin (chạy thật), phủ tối thiểu, phân rã BCNF, chuyển liên kết nhiều–nhiều và một–nhiều của ERD thành bảng — mỗi câu có giải thích vì sao đúng và vì sao phương án dễ nhầm sai.',
};
