/**
 * CSD201 · Mục 0 — giới thiệu môn, nhập môn CTDL & GT, phân tích độ phức tạp.
 * Bài 📑 học theo từng slide: csd1 (0-DSA-course-Introduction.ppt, 11 slide); csd2 (0-IntroductionToDSA.ppt, 10 slide); csd3 (ComplexityAnalysis (for reading).ppt, 46 slide).
 * Bài 🧪 thực hành + 🗂 thuật ngữ + 📌 tóm tắt: csd201-on-ch0.
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/CSD201/gen/gen.mjs từ gen/src/** và gen/java/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node CSD201/gen/gen.mjs`.
 */

import { walk, walkHead, books, bi } from './_slides.mjs';

/* ───────── 0.A — 📑 Slide by slide · Course introduction (0-DSA-course-Introduction, slides 1–11) ───────── */
const L_csd1_1 = {
  title: '0.A — 📑 Slide by slide · Course introduction (0-DSA-course-Introduction, slides 1–11)|||0.A — 📑 Học theo từng slide · Giới thiệu môn học (0-DSA-course-Introduction, slide 1–11)',
  slug: 'csd201-slide-csd1-1',
  type: 'VIDEO',
  isFreePreview: true,
  description: 'Giảng từng slide 1–11 của bộ 0-DSA-course-Introduction: nội dung môn, giáo trình Goodrich bản 6 và tài liệu FU, công cụ (JDK + IDE, nay dùng Eclipse, viết code tương thích Java 8), yêu cầu học tập, công thức điểm TS và điều kiện qua môn, quy chế học thuật, cách nộp bài và quy ước đặt tên — 4 chương trình Java chạy thật.',
  content: [
    bi(`<span class="eyebrow">Section 0 · Lesson 0.A · 0-DSA-course-Introduction, slides 1–11</span>
<h2>Course introduction — the first deck, slide by slide</h2>
<p class="lead">This is the deck of the very first session (syllabus session 1, "Course Introduction"). It contains no data structure yet: it tells you what CSD201 covers, which book and tools to use, what you must do every week, how your final score is computed, what counts as cheating, and how to hand in and name your code. Read it together with lessons 0.0–0.4 of this section.</p>
<div class="callout"><strong>Why it matters.</strong> The syllabus has 8 CLOs (course learning outcomes); this deck is the frame around all of them. Exams hardly ever ask about it, but three of its slides decide real marks: <strong>slide 8</strong> (the completion criteria — a high average can still fail), <strong>slide 10</strong> (how to pack an assignment) and <strong>slide 11</strong> (naming conventions — PE skeletons normally follow them).</div>
<h3>The whole deck in one table</h3>
<table>
<thead><tr><th>Slide</th><th>Topic</th><th>What to remember</th></tr></thead>
<tbody>
<tr><td>1–2</td><td>Cover, objectives</td><td>the seven topics of the first session</td></tr>
<tr><td>3</td><td>Instructor</td><td>ask for the contact of <em>your own</em> lecturer</td></tr>
<tr><td>4</td><td>Course description</td><td>algorithm analysis, lists, stacks and queues, recursion, trees, hash tables (+ graphs, sorting, text) — all in Java</td></tr>
<tr><td>5</td><td>Materials</td><td>Goodrich, Tamassia &amp; Goldwasser, <em>Data Structures and Algorithms in Java</em>, 6th ed. (2014) + FU slides, exercises, code files</td></tr>
<tr><td>6</td><td>Tools</td><td>a JDK, its API documentation and an IDE; the syllabus now names Eclipse — keep your code Java 8-compatible</td></tr>
<tr><td>7</td><td>Requirements</td><td>attend, read at home, finish workshops and assignments on time, discuss, present</td></tr>
<tr><td>8</td><td>Grading</td><td>TS = 0.2·AS + 0.2·PT + 0.3·PE + 0.3·FE; every component &gt; 0, FE ≥ 4, TS ≥ 5</td></tr>
<tr><td>9</td><td>Academic policy</td><td>cheating, plagiarism, breach of copyright</td></tr>
<tr><td>10</td><td>Submission</td><td>a folder like <code>01245_HungNV_AS1</code>, compressed as a whole under the same name</td></tr>
<tr><td>11</td><td>Naming</td><td><code>ClassName</code>, <code>variableName</code>, <code>methodName()</code> — camelCase</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Mục 0 · Bài 0.A · 0-DSA-course-Introduction, slide 1–11</span>
<h2>Giới thiệu môn học — bộ slide đầu tiên, học từng trang</h2>
<p class="lead">Đây là bộ slide của buổi học đầu tiên (buổi 1 trong syllabus — đề cương môn học: "Course Introduction"). Bộ này chưa có cấu trúc dữ liệu nào: nó cho biết CSD201 học gì, dùng sách và công cụ nào, mỗi tuần phải làm gì, điểm tổng kết tính ra sao, thế nào là gian lận, và nộp bài, đặt tên trong code thế nào. Hãy đọc cùng các bài 0.0–0.4 của mục này.</p>
<div class="callout"><strong>Vì sao cần đọc kỹ.</strong> Syllabus có 8 CLO (course learning outcome — chuẩn đầu ra của môn); bộ slide này là khung bao quanh cả tám. Đề thi hầu như không hỏi phần này, nhưng có ba slide quyết định điểm thật: <strong>slide 8</strong> (điều kiện hoàn thành — trung bình cao vẫn có thể trượt), <strong>slide 10</strong> (cách đóng gói bài nộp) và <strong>slide 11</strong> (quy ước đặt tên — các bộ khung code của đề PE, tức thi thực hành, thường theo đúng quy ước này).</div>
<h3>Cả bộ slide trong một bảng</h3>
<table>
<thead><tr><th>Slide</th><th>Nội dung</th><th>Cần nhớ</th></tr></thead>
<tbody>
<tr><td>1–2</td><td>Bìa, mục tiêu</td><td>bảy nội dung của buổi đầu tiên</td></tr>
<tr><td>3</td><td>Giảng viên</td><td>xin thông tin liên hệ của <em>chính</em> giảng viên lớp mình</td></tr>
<tr><td>4</td><td>Mô tả môn học</td><td>phân tích giải thuật, danh sách, ngăn xếp và hàng đợi, đệ quy, cây, bảng băm (+ đồ thị, sắp xếp, xử lý văn bản) — tất cả bằng Java</td></tr>
<tr><td>5</td><td>Tài liệu</td><td>Goodrich, Tamassia &amp; Goldwasser, <em>Data Structures and Algorithms in Java</em>, bản 6 (2014) + slide, bài tập, code mẫu của FU</td></tr>
<tr><td>6</td><td>Công cụ</td><td>JDK (bộ công cụ phát triển Java), tài liệu API (tài liệu tra cứu thư viện) và một IDE (môi trường lập trình); syllabus hiện dùng Eclipse — viết code tương thích Java 8</td></tr>
<tr><td>7</td><td>Yêu cầu</td><td>đi học, đọc sách ở nhà, làm xong workshop (bài thực hành trên lớp) và assignment (bài tập lớn) đúng hạn, thảo luận, thuyết trình</td></tr>
<tr><td>8</td><td>Chấm điểm</td><td>TS (điểm tổng kết) = 0.2·AS + 0.2·PT + 0.3·PE + 0.3·FE — bài tập lớn, kiểm tra tiến độ, thi thực hành, thi cuối kỳ; mọi cột &gt; 0, FE ≥ 4, TS ≥ 5</td></tr>
<tr><td>9</td><td>Quy chế học thuật</td><td>gian lận, đạo văn, vi phạm bản quyền</td></tr>
<tr><td>10</td><td>Nộp bài</td><td>thư mục kiểu <code>01245_HungNV_AS1</code>, nén nguyên thư mục với cùng tên</td></tr>
<tr><td>11</td><td>Đặt tên</td><td><code>ClassName</code>, <code>variableName</code>, <code>methodName()</code> — kiểu camelCase (viết hoa chữ đầu mỗi từ ghép)</td></tr>
</tbody>
</table>`),
    walkHead('csd1', 1, 11),
    walk('csd1', [
      [1, 'Data Structures and Algorithms using Java - Course Introduction',
        `<p class="y-chinh">🎯 CSD201 opens with a deck about the course itself — what you will learn, with which book and tools, and how you will be graded — before any data structure appears.</p>
<p>The title already names the two halves of the subject: <strong>data structures</strong> (how data is organised in memory) and <strong>algorithms</strong> (the steps that work on that data). The last words matter too: <strong>using Java</strong> — every structure in this course is written and run in Java, the language you learned in PRO192, the prerequisite of CSD201.</p>`,
        `<p class="y-chinh">🎯 CSD201 mở đầu bằng một bộ slide về chính môn học — học gì, dùng sách và công cụ nào, chấm điểm ra sao — trước khi có bất kỳ cấu trúc dữ liệu nào.</p>
<p>Tiêu đề đã gọi tên hai nửa của môn: <strong>cấu trúc dữ liệu (data structures)</strong> — cách tổ chức dữ liệu trong bộ nhớ — và <strong>giải thuật (algorithms)</strong> — các bước xử lý dữ liệu đó. Mấy chữ cuối cũng quan trọng: <strong>using Java</strong> (bằng Java) — mọi cấu trúc trong môn đều được viết và chạy bằng Java, ngôn ngữ bạn đã học ở PRO192, môn tiên quyết của CSD201.</p>`],
      [2, 'Objectives',
        `<p class="y-chinh">🎯 The first session covers seven topics: the lecturer, the course, the materials, the tools, the requirements, the grading and the academic rules.</p>
<ol>
<li><strong>Instructor introduction</strong> — slide 3</li>
<li><strong>Course description</strong> — slide 4</li>
<li><strong>Textbooks and reference resources</strong> — slide 5 (the slide writes "Recourses", a typo for <em>Resources</em>)</li>
<li><strong>Learning tools</strong> — slide 6 (spelt "Learing" on the slide)</li>
<li><strong>Requirements of the course</strong> — slide 7</li>
<li><strong>Grading policy</strong> — slide 8</li>
<li><strong>Academic policy</strong> — slide 9</li>
</ol>
<p>Two practical slides follow that are not in this list: how to submit an assignment (slide 10) and how to name classes, variables and methods (slide 11).</p>
<p class="meo">🧠 <strong>Remember:</strong> if you only have five minutes, read slides 8, 10 and 11 — those are the ones that cost marks.</p>`,
        `<p class="y-chinh">🎯 Buổi đầu tiên gồm bảy nội dung: giảng viên, môn học, tài liệu, công cụ, yêu cầu, cách chấm điểm và quy chế học thuật.</p>
<ol>
<li><strong>Instructor introduction</strong> (giới thiệu giảng viên) — slide 3</li>
<li><strong>Course description</strong> (mô tả môn học) — slide 4</li>
<li><strong>Text book(s) and Reference Resources</strong> (giáo trình và tài liệu tham khảo) — slide 5. Chữ "Recourses" trên slide là gõ nhầm của <em>Resources</em> (tài liệu, nguồn học); tra từ điển đừng tra nhầm "recourse" (sự cầu viện) — nghĩa khác hẳn.</li>
<li><strong>Learning tools</strong> (công cụ học tập) — slide 6; slide viết nhầm thành "Learing"</li>
<li><strong>Requirements of the course</strong> (yêu cầu của môn) — slide 7</li>
<li><strong>Grading policy</strong> (chính sách chấm điểm) — slide 8</li>
<li><strong>Academic policy</strong> (quy chế học thuật) — slide 9</li>
</ol>
<p>Sau đó còn hai slide thực dụng không nằm trong danh sách: cách nộp bài tập lớn (assignment — slide 10) và cách đặt tên lớp, biến, hàm (slide 11).</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> nếu chỉ có năm phút, hãy đọc slide 8, 10 và 11 — đó là những slide làm mất điểm thật.</p>`],
      [3, 'Instructor introduction',
        `<p class="y-chinh">🎯 The slide introduces a lecturer — a name, and how to reach them by email or by mobile phone.</p>
<ul>
<li>This page does not copy the name, email address or phone number shown on the slide: they are one person's private contact details, and the same deck is used by many classes.</li>
<li><strong>Your</strong> lecturer is the one on your own timetable: ask for their contact in the first session. For course information, the syllabus tells students to check FLM (flm.fpt.edu.vn) regularly.</li>
<li>Write from your university email account, so the lecturer sees at once who is asking.</li>
</ul>
<p class="nhan">A question email that gets a quick answer (AS1 = Assignment 1)</p>
<pre><code class="language-plaintext">Subject: [CSD201] SE1801 - HE180021 - AS1, question 2
Dear teacher,
I am Nguyen Van Minh (HE180021), class SE1801.
In AS1, question 2, my removeLast() throws a NullPointerException
when the list has only one node. I have checked head and tail,
but I cannot find the bug. Could you give me a hint?
Thank you. Best regards,
Minh</code></pre>
<p class="meo">🧠 <strong>Remember:</strong> subject = course + class + roll number + topic; body = what you did, what happened, what you have already tried. Ask early — not the night before the deadline.</p>`,
        `<p class="y-chinh">🎯 Slide giới thiệu một giảng viên — tên, và cách liên hệ với thầy/cô qua email hoặc điện thoại di động.</p>
<ul>
<li>Trang này không chép lại tên, địa chỉ email hay số điện thoại trên slide: đó là thông tin liên lạc riêng của một người, còn bộ slide thì nhiều lớp dùng chung.</li>
<li>Giảng viên <strong>của bạn</strong> là người có tên trên thời khoá biểu lớp bạn: hãy xin thông tin liên hệ của thầy/cô ngay trong buổi đầu. Còn thông tin môn học thì syllabus (đề cương môn học) dặn sinh viên thường xuyên vào FLM (flm.fpt.edu.vn — trang học liệu của trường) để xem.</li>
<li>Hãy gửi từ email sinh viên do trường cấp để thầy/cô biết ngay ai đang hỏi.</li>
</ul>
<p class="nhan">Một email hỏi bài được trả lời nhanh (AS1 = Assignment 1 — bài tập lớn số 1)</p>
<pre><code class="language-plaintext">Tiêu đề: [CSD201] SE1801 - HE180021 - AS1, câu 2
Em chào thầy/cô,
Em là Nguyễn Văn Minh (HE180021), lớp SE1801.
Ở AS1 câu 2, hàm removeLast() của em báo lỗi NullPointerException
khi danh sách chỉ có một nút. Em đã kiểm tra head và tail
nhưng chưa tìm ra lỗi. Thầy/cô gợi ý giúp em được không ạ?
Em cảm ơn thầy/cô.
Minh</code></pre>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> tiêu đề = mã môn + lớp + mã số sinh viên + chủ đề; nội dung = mình đã làm gì, lỗi gì xảy ra, đã thử những gì. Hỏi sớm — đừng đợi tới đêm trước hạn nộp (deadline).</p>`],
      [4, 'Course description',
        `<p class="y-chinh">🎯 CSD201 teaches the fundamental data structures together with the algorithms that come from them, starts with how to analyse an algorithm, and implements everything in Java.</p>
<ul>
<li><strong>"the algorithms that proceed from them"</strong> — the structure decides which algorithms are possible: binary search needs a sorted array; a search tree finds a key by walking a single path down from the root.</li>
<li><strong>"the basics of algorithmic analysis"</strong> — how to show that one algorithm is faster than another without a stopwatch: count its steps and write their growth in Big-O (the ComplexityAnalysis deck of this section, and lesson 0.3).</li>
<li>The sentence names stacks, queues, linked lists, hash tables, trees and recursion. Graphs, sorting and text processing are full chapters of the syllabus too (CLO5, CLO6, CLO8) — they are the "important applications".</li>
</ul>
<table>
<thead><tr><th>Topic</th><th>CSD201 chapter</th><th>Deck</th></tr></thead>
<tbody>
<tr><td>basics of algorithmic analysis</td><td>Section 0</td><td>ComplexityAnalysis</td></tr>
<tr><td>linked lists</td><td>Chapter 1</td><td>1-ListDataStructures</td></tr>
<tr><td>stacks, queues</td><td>Chapter 2</td><td>2A-Stacks, 2B-Queues</td></tr>
<tr><td>recursion</td><td>Chapter 3</td><td>3-Recursion</td></tr>
<tr><td>trees (BST, AVL, heap)</td><td>Chapter 4</td><td>4A-Trees1, 4B-Trees2</td></tr>
<tr><td>graphs (an "application")</td><td>Chapter 5</td><td>5A-Graphs1, 5B-Graphs2</td></tr>
<tr><td>sorting (an "application")</td><td>Chapter 6</td><td>6-Sorting</td></tr>
<tr><td>hash tables</td><td>Chapter 7</td><td>7-Hashing</td></tr>
<tr><td>text processing (an "application")</td><td>Chapter 8</td><td>8-TextProcessing</td></tr>
</tbody>
</table>
<p>A one-line preview of every chapter, using the ready-made versions in the Java library — by the end of the course you will be able to build each of them yourself:</p>
<pre><code class="language-java">import java.util.*;

public class CourseTour {
    // Ch3 recursion: a method that calls itself
    static long factorial(int n) {
        return n &lt;= 1 ? 1 : n * factorial(n - 1);
    }

    public static void main(String[] args) {
        List&lt;Integer&gt; list = new LinkedList&lt;Integer&gt;(Arrays.asList(10, 20, 30));
        list.add(1, 15);                                  // Ch1 list: insert at position 1
        System.out.println("Ch1 list       : " + list);

        Deque&lt;String&gt; stack = new ArrayDeque&lt;String&gt;();   // Ch2 stack: last in, first out
        Queue&lt;String&gt; queue = new ArrayDeque&lt;String&gt;();   // Ch2 queue: first in, first out
        for (String s : new String[] {"A", "B", "C"}) {
            stack.push(s);
            queue.offer(s);
        }
        System.out.println("Ch2 stack/queue: pop -&gt; " + stack.pop() + ", poll -&gt; " + queue.poll());

        System.out.println("Ch3 recursion  : 5! = " + factorial(5));

        TreeSet&lt;Integer&gt; bst = new TreeSet&lt;Integer&gt;(Arrays.asList(50, 30, 70, 20, 40));          // Ch4 search tree: always sorted
        PriorityQueue&lt;Integer&gt; heap = new PriorityQueue&lt;Integer&gt;(Arrays.asList(50, 30, 70, 20, 40)); // Ch4 heap: smallest on top
        System.out.println("Ch4 tree/heap  : " + bst + ", heap top = " + heap.peek());

        Map&lt;String, List&lt;String&gt;&gt; graph = new TreeMap&lt;String, List&lt;String&gt;&gt;();  // Ch5 graph as adjacency lists
        graph.put("HN", Arrays.asList("HP", "DN"));
        graph.put("HP", Arrays.asList("HN"));
        graph.put("DN", Arrays.asList("HN", "HCM"));
        graph.put("HCM", Arrays.asList("DN"));
        System.out.println("Ch5 graph      : neighbours of DN = " + graph.get("DN"));

        int[] a = {42, 7, 19, 3, 25};
        Arrays.sort(a);                                   // Ch6 sorting
        System.out.println("Ch6 sorting    : " + Arrays.toString(a));

        Map&lt;String, Integer&gt; credits = new HashMap&lt;String, Integer&gt;();  // Ch7 hash table: key -&gt; value
        credits.put("CSD201", 3);
        credits.put("PRO192", 3);
        System.out.println("Ch7 hashing    : credits of CSD201 = " + credits.get("CSD201"));

        String text = "data structures and algorithms";
        System.out.println("Ch8 text       : \\"algo\\" found at index " + text.indexOf("algo"));  // Ch8 pattern matching
    }
}</code></pre>
<div class="out">Ch1 list &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: [10, 15, 20, 30]<br>
Ch2 stack/queue: pop -&gt; C, poll -&gt; A<br>
Ch3 recursion &nbsp;: 5! = 120<br>
Ch4 tree/heap &nbsp;: [20, 30, 40, 50, 70], heap top = 20<br>
Ch5 graph &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: neighbours of DN = [HN, HCM]<br>
Ch6 sorting &nbsp;&nbsp;&nbsp;: [3, 7, 19, 25, 42]<br>
Ch7 hashing &nbsp;&nbsp;&nbsp;: credits of CSD201 = 3<br>
Ch8 text &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: "algo" found at index 20</div>
<p class="meo">🧠 <strong>Remember:</strong> structure first, algorithm second — each chapter builds a structure, then the algorithms that work on it.</p>
<div class="pitfall">These library classes are for real projects and for checking your answers. When a PE task gives you its own <code>MyList</code> or <code>BSTree</code> class and asks for a method, the method must work on <em>that</em> class — copying the data into a <code>java.util.LinkedList</code> or a <code>TreeSet</code> does not answer the question.</div>`,
        `<p class="y-chinh">🎯 CSD201 dạy các cấu trúc dữ liệu nền tảng cùng những giải thuật sinh ra từ chúng, mở đầu bằng cách phân tích một giải thuật, và cài đặt mọi thứ bằng Java.</p>
<ul>
<li><strong>"the algorithms that proceed from them"</strong> (các giải thuật đi ra từ chúng) — cấu trúc quyết định giải thuật nào làm được: tìm kiếm nhị phân (binary search) cần mảng đã sắp xếp; cây tìm kiếm (search tree) tìm một khoá chỉ bằng cách đi một đường duy nhất từ gốc xuống.</li>
<li><strong>"the basics of algorithmic analysis"</strong> (nhập môn phân tích giải thuật) — cách chứng tỏ giải thuật này nhanh hơn giải thuật kia mà không cần bấm giờ: đếm số bước rồi viết tốc độ tăng của nó bằng Big-O (ký hiệu O lớn) — chính là bộ slide ComplexityAnalysis của mục này và bài 0.3.</li>
<li>Câu mô tả kể tên ngăn xếp (stack), hàng đợi (queue), danh sách liên kết (linked list), bảng băm (hash table), cây (tree) và đệ quy (recursion). Đồ thị (graph), sắp xếp (sorting) và xử lý văn bản (text processing) cũng là những chương trọn vẹn của syllabus (CLO5, CLO6, CLO8 — chuẩn đầu ra số 5, 6, 8): chúng thuộc phần "các ứng dụng quan trọng" (important applications).</li>
</ul>
<table>
<thead><tr><th>Chủ đề</th><th>Chương của CSD201</th><th>Bộ slide</th></tr></thead>
<tbody>
<tr><td>phân tích giải thuật cơ bản</td><td>Mục 0</td><td>ComplexityAnalysis</td></tr>
<tr><td>danh sách liên kết</td><td>Chương 1</td><td>1-ListDataStructures</td></tr>
<tr><td>ngăn xếp, hàng đợi</td><td>Chương 2</td><td>2A-Stacks, 2B-Queues</td></tr>
<tr><td>đệ quy</td><td>Chương 3</td><td>3-Recursion</td></tr>
<tr><td>cây (cây nhị phân tìm kiếm BST, cây AVL, heap — đống)</td><td>Chương 4</td><td>4A-Trees1, 4B-Trees2</td></tr>
<tr><td>đồ thị (một "ứng dụng")</td><td>Chương 5</td><td>5A-Graphs1, 5B-Graphs2</td></tr>
<tr><td>sắp xếp (một "ứng dụng")</td><td>Chương 6</td><td>6-Sorting</td></tr>
<tr><td>bảng băm</td><td>Chương 7</td><td>7-Hashing</td></tr>
<tr><td>xử lý văn bản (một "ứng dụng")</td><td>Chương 8</td><td>8-TextProcessing</td></tr>
</tbody>
</table>
<p>Xem trước mỗi chương bằng một dòng, dùng những bản có sẵn trong thư viện Java — học xong môn, bạn sẽ tự cài đặt được từng cái:</p>
<pre><code class="language-java">import java.util.*;

public class CourseTour {
    // Ch3 đệ quy: hàm tự gọi lại chính nó
    static long factorial(int n) {
        return n &lt;= 1 ? 1 : n * factorial(n - 1);
    }

    public static void main(String[] args) {
        List&lt;Integer&gt; list = new LinkedList&lt;Integer&gt;(Arrays.asList(10, 20, 30));
        list.add(1, 15);                                  // Ch1 danh sách: chèn vào vị trí 1
        System.out.println("Ch1 list       : " + list);

        Deque&lt;String&gt; stack = new ArrayDeque&lt;String&gt;();   // Ch2 ngăn xếp: vào sau, ra trước
        Queue&lt;String&gt; queue = new ArrayDeque&lt;String&gt;();   // Ch2 hàng đợi: vào trước, ra trước
        for (String s : new String[] {"A", "B", "C"}) {
            stack.push(s);
            queue.offer(s);
        }
        System.out.println("Ch2 stack/queue: pop -&gt; " + stack.pop() + ", poll -&gt; " + queue.poll());

        System.out.println("Ch3 recursion  : 5! = " + factorial(5));

        TreeSet&lt;Integer&gt; bst = new TreeSet&lt;Integer&gt;(Arrays.asList(50, 30, 70, 20, 40));          // Ch4 cây tìm kiếm: luôn có thứ tự
        PriorityQueue&lt;Integer&gt; heap = new PriorityQueue&lt;Integer&gt;(Arrays.asList(50, 30, 70, 20, 40)); // Ch4 heap: nhỏ nhất nằm ở đỉnh
        System.out.println("Ch4 tree/heap  : " + bst + ", heap top = " + heap.peek());

        Map&lt;String, List&lt;String&gt;&gt; graph = new TreeMap&lt;String, List&lt;String&gt;&gt;();  // Ch5 đồ thị lưu bằng danh sách kề
        graph.put("HN", Arrays.asList("HP", "DN"));
        graph.put("HP", Arrays.asList("HN"));
        graph.put("DN", Arrays.asList("HN", "HCM"));
        graph.put("HCM", Arrays.asList("DN"));
        System.out.println("Ch5 graph      : neighbours of DN = " + graph.get("DN"));

        int[] a = {42, 7, 19, 3, 25};
        Arrays.sort(a);                                   // Ch6 sắp xếp
        System.out.println("Ch6 sorting    : " + Arrays.toString(a));

        Map&lt;String, Integer&gt; credits = new HashMap&lt;String, Integer&gt;();  // Ch7 bảng băm: khoá -&gt; giá trị
        credits.put("CSD201", 3);
        credits.put("PRO192", 3);
        System.out.println("Ch7 hashing    : credits of CSD201 = " + credits.get("CSD201"));

        String text = "data structures and algorithms";
        System.out.println("Ch8 text       : \\"algo\\" found at index " + text.indexOf("algo"));  // Ch8 so khớp mẫu
    }
}</code></pre>
<div class="out">Ch1 list &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: [10, 15, 20, 30]<br>
Ch2 stack/queue: pop -&gt; C, poll -&gt; A<br>
Ch3 recursion &nbsp;: 5! = 120<br>
Ch4 tree/heap &nbsp;: [20, 30, 40, 50, 70], heap top = 20<br>
Ch5 graph &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: neighbours of DN = [HN, HCM]<br>
Ch6 sorting &nbsp;&nbsp;&nbsp;: [3, 7, 19, 25, 42]<br>
Ch7 hashing &nbsp;&nbsp;&nbsp;: credits of CSD201 = 3<br>
Ch8 text &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: "algo" found at index 20</div>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> cấu trúc trước, giải thuật sau — chương nào cũng dựng một cấu trúc, rồi mới tới các giải thuật chạy trên nó.</p>
<div class="pitfall">Các lớp thư viện này dùng cho dự án thật và để tự kiểm tra đáp án. Khi đề PE (thi thực hành) cho sẵn lớp <code>MyList</code> hay <code>BSTree</code> của đề và yêu cầu viết một hàm, hàm đó phải chạy trên <em>chính</em> lớp ấy — chép dữ liệu sang <code>java.util.LinkedList</code> hay <code>TreeSet</code> không phải là trả lời câu hỏi.</div>`],
      [5, 'Textbooks and reference resources',
        `<p class="y-chinh">🎯 One main textbook — Goodrich, Tamassia &amp; Goldwasser, <em>Data Structures and Algorithms in Java</em>, 6th edition (2014) — plus the FU slides, the FU exercises and the code files: the same four materials the current syllabus lists.</p>
<ol>
<li><strong>The textbook</strong>, as an ebook. The slide spells the first author "Michaelt"; the name is Michael T. Goodrich.</li>
<li><strong>A download link</strong> to a PDF copy — not reproduced here. Use a legal copy (library, publisher, bookshop); slide 9 explains why.</li>
<li><strong>FU slides</strong> (.ppt) — the 14 decks that these lessons walk through slide by slide.</li>
<li><strong>FU exercises</strong> (.pdf) — the exercise sheet of the course.</li>
<li><strong>Code files for students</strong> (.java) — sample code to run and modify.</li>
<li><strong>FU CMS</strong> — the course website named when the slide was written; today the syllabus sends students to FLM for up-to-date course information.</li>
</ol>
<p class="nhan">Which chapter of the book goes with which part of CSD201 (pages from the "Reading at home" slides of the later decks; Ch.4 from the book's table of contents)</p>
<table>
<thead><tr><th>Goodrich 6e</th><th>Starts on page</th><th>CSD201</th></tr></thead>
<tbody>
<tr><td>Ch.3 Fundamental Data Structures</td><td>103</td><td>Chapter 1 — arrays and linked lists</td></tr>
<tr><td>Ch.4 Algorithm Analysis</td><td>149</td><td>Section 0 — complexity</td></tr>
<tr><td>Ch.5 Recursion</td><td>189</td><td>Chapter 3</td></tr>
<tr><td>Ch.6 Stacks, Queues, and Deques</td><td>225</td><td>Chapter 2 (+ §9.1 priority queues, p.360)</td></tr>
<tr><td>Ch.8 Trees</td><td>307</td><td>Chapter 4 (+ §9.3 heaps, p.370; §11.1–11.3 binary search trees, balanced trees and AVL, p.460–479)</td></tr>
<tr><td>Ch.14 Graph Algorithms</td><td>611</td><td>Chapter 5</td></tr>
<tr><td>Ch.12 Sorting and Selection</td><td>531</td><td>Chapter 6 (+ §9.4 selection, insertion and heap sort, p.386–388)</td></tr>
<tr><td>Ch.10 Maps, Hash Tables, and Skip Lists</td><td>401</td><td>Chapter 7</td></tr>
<tr><td>Ch.13 Text Processing</td><td>573</td><td>Chapter 8</td></tr>
</tbody>
</table>
<p class="meo">🧠 <strong>Remember:</strong> the slides tell you <em>what</em>, the book tells you <em>why</em> — read the pages of each deck's "Reading at home" slide after class.</p>
<div class="pitfall">Get the <strong>Java 6th edition</strong>. Goodrich and Tamassia also wrote Python and C++ versions, and older Java editions number the chapters differently — the sections and pages quoted on the slides only match this one.</div>`,
        `<p class="y-chinh">🎯 Một giáo trình chính — Goodrich, Tamassia &amp; Goldwasser, <em>Data Structures and Algorithms in Java</em>, bản 6 (2014) — cộng slide, bài tập và code mẫu của FU: đúng bốn tài liệu mà syllabus hiện hành liệt kê.</p>
<ol>
<li><strong>Giáo trình (textbook)</strong>, dạng sách điện tử (ebook). Slide ghi tên tác giả đầu là "Michaelt"; đúng là Michael T. Goodrich.</li>
<li><strong>Một đường link tải</strong> bản PDF của sách — trang này không chép lại. Hãy dùng bản hợp pháp (thư viện, nhà xuất bản, hiệu sách); slide 9 giải thích vì sao.</li>
<li><strong>FU slides</strong> (slide bài giảng .ppt) — 14 bộ slide mà các bài này giảng lại từng trang.</li>
<li><strong>FU exercises</strong> (tập bài tập .pdf) — bài tập của môn.</li>
<li><strong>Code files for students</strong> (code mẫu .java) — để chạy thử và sửa theo.</li>
<li><strong>FU CMS</strong> — trang web môn học được nêu lúc soạn slide; hiện nay syllabus hướng sinh viên vào FLM (flm.fpt.edu.vn — trang học liệu của trường) để xem thông tin môn học mới nhất.</li>
</ol>
<p class="nhan">Chương nào của sách đi với phần nào của CSD201 (số trang lấy từ slide "Reading at home" — đọc ở nhà — của các bộ slide sau; riêng Ch.4 lấy từ mục lục sách)</p>
<table>
<thead><tr><th>Goodrich bản 6</th><th>Bắt đầu ở trang</th><th>CSD201</th></tr></thead>
<tbody>
<tr><td>Ch.3 Fundamental Data Structures</td><td>103</td><td>Chương 1 — mảng và danh sách liên kết</td></tr>
<tr><td>Ch.4 Algorithm Analysis</td><td>149</td><td>Mục 0 — độ phức tạp</td></tr>
<tr><td>Ch.5 Recursion</td><td>189</td><td>Chương 3 — đệ quy</td></tr>
<tr><td>Ch.6 Stacks, Queues, and Deques</td><td>225</td><td>Chương 2 — ngăn xếp, hàng đợi, hàng đợi hai đầu (+ §9.1 hàng đợi ưu tiên, tr.360)</td></tr>
<tr><td>Ch.8 Trees</td><td>307</td><td>Chương 4 — cây (+ §9.3 heap — đống, tr.370; §11.1–11.3 cây nhị phân tìm kiếm, cây cân bằng và cây AVL, tr.460–479)</td></tr>
<tr><td>Ch.14 Graph Algorithms</td><td>611</td><td>Chương 5 — đồ thị</td></tr>
<tr><td>Ch.12 Sorting and Selection</td><td>531</td><td>Chương 6 — sắp xếp (+ §9.4 sắp xếp chọn, sắp xếp chèn và heap sort — sắp xếp vun đống, tr.386–388)</td></tr>
<tr><td>Ch.10 Maps, Hash Tables, and Skip Lists</td><td>401</td><td>Chương 7 — băm</td></tr>
<tr><td>Ch.13 Text Processing</td><td>573</td><td>Chương 8 — xử lý văn bản</td></tr>
</tbody>
</table>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> slide cho biết <em>cái gì</em>, sách giải thích <em>vì sao</em> — sau mỗi buổi học, đọc đúng các trang ghi ở slide "Reading at home" của bộ slide đó.</p>
<div class="pitfall">Hãy tìm đúng <strong>bản Java, ấn bản thứ 6 (6th edition)</strong>. Goodrich và Tamassia còn viết bản Python và bản C++, còn các bản Java cũ hơn đánh số chương khác — mục và số trang ghi trên slide chỉ khớp với bản này.</div>`],
      [6, 'Learning Tools',
        `<p class="y-chinh">🎯 You need a JDK (to compile and run Java), the Java API documentation and an IDE — the slide names JDK 1.7 and NetBeans 7.x, which are old; the current syllabus names Eclipse.</p>
<ul>
<li><strong>JDK</strong> (Java Development Kit) = <code>javac</code>, the compiler, + <code>java</code>, the launcher of the JVM (Java Virtual Machine), + the standard library (<code>java.util</code> …).</li>
<li><strong>JDK documentation</strong> = the Javadoc pages of the Java SE API — the place to check what <code>ArrayList.remove(int)</code> really does.</li>
<li><strong>IDE</strong> (integrated development environment) = editor + compiler + debugger in one window. JDK 1.7 is Java 7, from 2011; lesson 0.4 installs a current JDK and Eclipse, as the syllabus asks ("use Eclipse tool for developing programs in JAVA").</li>
<li>A newer JDK compiles old code, but not the other way round. Write <strong>Java 8-compatible</strong> code: in Eclipse, Project → Properties → Java Compiler → Compiler compliance level 1.8; on the command line <code>javac --release 8</code>. Every program in these lessons is compiled that way.</li>
</ul>
<table>
<thead><tr><th>Newer syntax — avoid</th><th>Needs</th><th>Java 8 way</th></tr></thead>
<tbody>
<tr><td><code>var list = new ArrayList&lt;Integer&gt;();</code></td><td>Java 10</td><td><code>ArrayList&lt;Integer&gt; list = new ArrayList&lt;Integer&gt;();</code></td></tr>
<tr><td><code>List.of(3, 1, 2)</code></td><td>Java 9</td><td><code>Arrays.asList(3, 1, 2)</code></td></tr>
<tr><td><code>case 2 -&gt; name = "Tuesday";</code></td><td>Java 14</td><td><code>case 2: name = "Tuesday"; break;</code></td></tr>
<tr><td>a text block <code>"""…"""</code></td><td>Java 15</td><td><code>"1. Add\\n" + "2. Delete"</code></td></tr>
<tr><td><code>record Point(int x, int y) {}</code></td><td>Java 16</td><td>a small class with fields and a constructor</td></tr>
<tr><td><code>o instanceof Point p</code></td><td>Java 16</td><td><code>o instanceof Point</code>, then <code>(Point) o</code></td></tr>
</tbody>
</table>
<pre><code class="language-java">import java.util.*;

// A Java 8 "record": a small class with final fields and a constructor
class Point {
    final int x, y;

    Point(int x, int y) { this.x = x; this.y = y; }
    public String toString() { return "(" + x + ", " + y + ")"; }
}

public class Java8Style {
    public static void main(String[] args) {
        ArrayList&lt;Integer&gt; list = new ArrayList&lt;Integer&gt;();   // not: var list = ... (Java 10+)
        list.addAll(Arrays.asList(3, 1, 2));                   // not: List.of(3, 1, 2) (Java 9+)
        Collections.sort(list);
        System.out.println("sorted list: " + list);

        int day = 2;
        String name;
        switch (day) {                                         // not: case 2 -&gt; ... (Java 14+)
            case 1: name = "Monday"; break;
            case 2: name = "Tuesday"; break;
            default: name = "other";
        }
        System.out.println("day 2 is " + name);

        Object o = new Point(3, 4);                            // not: record Point(int x, int y) (Java 16+)
        if (o instanceof Point) {                              // not: o instanceof Point p (Java 16+)
            Point p = (Point) o;
            System.out.println("point " + p + ", x + y = " + (p.x + p.y));
        }

        String menu = "1. Add\\n" + "2. Delete\\n" + "0. Exit";  // not: a text block """...""" (Java 15+)
        System.out.println(menu);
    }
}</code></pre>
<div class="out">sorted list: [1, 2, 3]<br>
day 2 is Tuesday<br>
point (3, 4), x + y = 7<br>
1. Add<br>
2. Delete<br>
0. Exit</div>
<div class="pitfall">Code that compiles on your laptop's new JDK can fail on the exam machine if you used <code>var</code>, <code>List.of</code> or an arrow <code>switch</code>. Set the compliance level to 1.8 from the first day, so the IDE flags those forms immediately.</div>`,
        `<p class="y-chinh">🎯 Bạn cần một JDK (bộ công cụ phát triển Java — để biên dịch và chạy Java), tài liệu tra cứu API (thư viện lập trình) của Java và một IDE (môi trường lập trình) — slide ghi JDK 1.7 và NetBeans 7.x, nay đã cũ; syllabus hiện hành dùng Eclipse.</p>
<ul>
<li><strong>JDK</strong> (Java Development Kit — bộ công cụ phát triển Java) = <code>javac</code>, trình biên dịch (compiler), + <code>java</code>, lệnh khởi động JVM (Java Virtual Machine — máy ảo Java), + thư viện chuẩn (<code>java.util</code> …).</li>
<li><strong>JDK documentation</strong> (tài liệu JDK) = các trang Javadoc của Java SE API (giao diện lập trình của thư viện chuẩn) — nơi tra xem <code>ArrayList.remove(int)</code> thật ra làm gì.</li>
<li><strong>IDE</strong> (integrated development environment — môi trường phát triển tích hợp) = trình soạn thảo + trình biên dịch + trình gỡ lỗi (debugger) trong một cửa sổ. JDK 1.7 là Java 7, ra năm 2011; bài 0.4 hướng dẫn cài JDK hiện hành và Eclipse, đúng như syllabus yêu cầu ("use Eclipse tool for developing programs in JAVA").</li>
<li>JDK mới biên dịch được code cũ, nhưng ngược lại thì không. Hãy viết code <strong>tương thích Java 8</strong>: trong Eclipse vào Project → Properties → Java Compiler → Compiler compliance level (mức tương thích của trình biên dịch) chọn 1.8; ở dòng lệnh dùng <code>javac --release 8</code>. Mọi chương trình trong các bài này đều được biên dịch như vậy.</li>
</ul>
<table>
<thead><tr><th>Cú pháp mới — tránh dùng</th><th>Cần</th><th>Cách viết Java 8</th></tr></thead>
<tbody>
<tr><td><code>var list = new ArrayList&lt;Integer&gt;();</code></td><td>Java 10</td><td><code>ArrayList&lt;Integer&gt; list = new ArrayList&lt;Integer&gt;();</code></td></tr>
<tr><td><code>List.of(3, 1, 2)</code></td><td>Java 9</td><td><code>Arrays.asList(3, 1, 2)</code></td></tr>
<tr><td><code>case 2 -&gt; name = "Tuesday";</code></td><td>Java 14</td><td><code>case 2: name = "Tuesday"; break;</code></td></tr>
<tr><td>khối chữ (text block) <code>"""…"""</code></td><td>Java 15</td><td><code>"1. Add\\n" + "2. Delete"</code></td></tr>
<tr><td><code>record Point(int x, int y) {}</code></td><td>Java 16</td><td>một lớp nhỏ có trường và hàm dựng (constructor)</td></tr>
<tr><td><code>o instanceof Point p</code></td><td>Java 16</td><td><code>o instanceof Point</code>, rồi ép kiểu <code>(Point) o</code></td></tr>
</tbody>
</table>
<pre><code class="language-java">import java.util.*;

// "Bản ghi" kiểu Java 8: lớp nhỏ có trường final và hàm dựng
class Point {
    final int x, y;

    Point(int x, int y) { this.x = x; this.y = y; }
    public String toString() { return "(" + x + ", " + y + ")"; }
}

public class Java8Style {
    public static void main(String[] args) {
        ArrayList&lt;Integer&gt; list = new ArrayList&lt;Integer&gt;();   // không viết: var list = ... (Java 10+)
        list.addAll(Arrays.asList(3, 1, 2));                   // không viết: List.of(3, 1, 2) (Java 9+)
        Collections.sort(list);
        System.out.println("sorted list: " + list);

        int day = 2;
        String name;
        switch (day) {                                         // không viết: case 2 -&gt; ... (Java 14+)
            case 1: name = "Monday"; break;
            case 2: name = "Tuesday"; break;
            default: name = "other";
        }
        System.out.println("day 2 is " + name);

        Object o = new Point(3, 4);                            // không viết: record Point(int x, int y) (Java 16+)
        if (o instanceof Point) {                              // không viết: o instanceof Point p (Java 16+)
            Point p = (Point) o;
            System.out.println("point " + p + ", x + y = " + (p.x + p.y));
        }

        String menu = "1. Add\\n" + "2. Delete\\n" + "0. Exit";  // không viết: khối chữ """...""" (Java 15+)
        System.out.println(menu);
    }
}</code></pre>
<div class="out">sorted list: [1, 2, 3]<br>
day 2 is Tuesday<br>
point (3, 4), x + y = 7<br>
1. Add<br>
2. Delete<br>
0. Exit</div>
<div class="pitfall">Code biên dịch được trên JDK mới ở laptop của bạn vẫn có thể hỏng trên máy phòng thi nếu dùng <code>var</code>, <code>List.of</code> hay <code>switch</code> kiểu mũi tên. Hãy đặt mức tương thích 1.8 ngay từ ngày đầu, để IDE báo lỗi các cách viết đó ngay lập tức.</div>`],
      [7, 'Requirements of the course',
        `<p class="y-chinh">🎯 Six duties: follow the lessons in class, read the textbook at home, finish the workshops on time, submit the assignments on time, discuss actively in your team and in class, and present in class.</p>
<ul>
<li><strong>Follow the lessons</strong> — and be there: the syllabus requires at least <strong>80% of the contact sessions</strong> to be allowed to sit the final exam.</li>
<li><strong>Read the textbook at home</strong> — every chapter deck, from 1-ListDataStructures on, has a "Reading at home" slide near its end giving exact sections and pages (for 1-ListDataStructures: Goodrich §3.1, p.104, through §3.4, which starts on p.132).</li>
<li><strong>Workshops</strong> (programming exercises in class) and <strong>assignments</strong> (graded work done at home, 20% of the score — slide 8) must be handed in on time.</li>
<li><strong>Discuss and present</strong> — the syllabus uses a constructivist approach and lists "constructive questions" for the sessions, such as CQ1.1 "Please list the advantages of Linked List over Array?", for you to think through, discuss in your team and present. Lesson 9.2 collects all 120 of them.</li>
</ul>
<p class="meo">🧠 <strong>A weekly routine that works:</strong> before class, skim the 📑 slide lesson; after class, read the book pages and run the Java yourself; before the deadline, finish the assignment and the chapter's 🧪 practice lesson.</p>
<div class="pitfall">Attendance is a hard gate: below 80% you may not take the final exam, whatever your other scores are — and without an FE of at least 4 (slide 8) the subject is failed.</div>`,
        `<p class="y-chinh">🎯 Sáu nhiệm vụ: theo dõi bài giảng trên lớp, đọc giáo trình ở nhà, làm xong workshop (bài thực hành trên lớp) đúng hạn, nộp assignment (bài tập lớn) đúng hạn, tích cực thảo luận trong nhóm và trên lớp, và thuyết trình trên lớp.</p>
<ul>
<li><strong>Following lessons in classrooms</strong> (theo dõi bài giảng trên lớp) — và phải có mặt: syllabus yêu cầu dự ít nhất <strong>80% số buổi học</strong> mới được thi cuối kỳ.</li>
<li><strong>Reading textbooks at home</strong> (đọc giáo trình ở nhà) — mọi bộ slide của các chương, từ 1-ListDataStructures trở đi, đều có slide "Reading at home" (đọc ở nhà) ở gần cuối, ghi đúng mục và số trang cần đọc (với 1-ListDataStructures: Goodrich từ §3.1, tr.104, tới hết §3.4 — mục bắt đầu ở tr.132).</li>
<li><strong>Workshop</strong> (bài thực hành lập trình trên lớp) và <strong>assignment</strong> (bài tập lớn có chấm điểm, làm ở nhà, chiếm 20% điểm — slide 8) phải nộp đúng hạn.</li>
<li><strong>Discussing and presenting</strong> (thảo luận và thuyết trình) — syllabus theo hướng kiến tạo (constructivism) và liệt kê các "câu hỏi kiến tạo" (constructive question — CQ) cho các buổi học, ví dụ CQ1.1 "Please list the advantages of Linked List over Array?" (hãy nêu ưu điểm của danh sách liên kết so với mảng), để bạn suy nghĩ, thảo luận trong nhóm và trình bày. Bài 9.2 gom đủ 120 câu này.</li>
</ul>
<p class="meo">🧠 <strong>Nhịp học mỗi tuần nên theo:</strong> trước buổi học, đọc lướt bài 📑 học theo slide; sau buổi học, đọc các trang sách và tự chạy lại code Java; trước hạn nộp (deadline), làm xong assignment và bài 🧪 thực hành của chương.</p>
<div class="pitfall">Chuyên cần là một cửa cứng: dưới 80% số buổi thì không được thi cuối kỳ (FE — Final Exam), bất kể các điểm khác cao thế nào — mà không có FE từ 4 trở lên (slide 8) là trượt môn.</div>`],
      [8, 'Grading policy',
        `<p class="y-chinh">🎯 The total score is TS = 0.2·AS + 0.2·PT + 0.3·PE + 0.3·FE, and you pass only if every component is above 0, the FE is at least 4 and the TS is at least 5.</p>
<table>
<thead><tr><th>Component</th><th>Parts</th><th>Weight</th><th>Completion criterion</th></tr></thead>
<tbody>
<tr><td>AS — Assignments (on-going)</td><td>2</td><td>20%</td><td>average &gt; 0</td></tr>
<tr><td>PT — Progress tests (on-going)</td><td>2</td><td>20%</td><td>average &gt; 0</td></tr>
<tr><td>PE — Practical Exam, 85 minutes of coding</td><td>1</td><td>30%</td><td>&gt; 0, no resit</td></tr>
<tr><td>FE — Final Exam, 60 minutes</td><td>1</td><td>30%</td><td>≥ 4</td></tr>
</tbody>
</table>
<ul>
<li>This is exactly the assessment table of the current syllabus (the 85- and 60-minute durations come from the syllabus).</li>
<li>AS and PT are each the <strong>average</strong> of two parts, and the "&gt; 0" rule is on that average.</li>
<li>"No resit", as the slide puts it: there is no second sitting of the PE — treat it as a one-shot exam.</li>
<li>The conditions are separate gates: a high TS does not rescue an FE of 3.9, and a PE of 0 fails the subject even with 10 everywhere else.</li>
</ul>
<p>The program applies the rules to six sets of scores, then answers the question students really ask — "what FE do I need?":</p>
<pre><code class="language-java">import java.util.Locale;

public class GradeCalc {
    // TS = 0.2*AS + 0.2*PT + 0.3*PE + 0.3*FE (slide 8)
    static double total(double as, double pt, double pe, double fe) {
        return 0.2 * as + 0.2 * pt + 0.3 * pe + 0.3 * fe;
    }

    // Completion criteria, checked in the slide's order
    static String result(double as, double pt, double pe, double fe) {
        if (as &lt;= 0) return "FAIL: AS = 0";
        if (pt &lt;= 0) return "FAIL: PT = 0";
        if (pe &lt;= 0) return "FAIL: PE = 0";
        if (fe &lt; 4) return "FAIL: FE &lt; 4";
        if (total(as, pt, pe, fe) &lt; 5 - 1e-9) return "FAIL: TS &lt; 5";   // 1e-9: room for rounding errors of double
        return "PASS";
    }

    // The lowest FE that passes, once AS, PT and PE are known
    static String feNeeded(double as, double pt, double pe) {
        double need = Math.max(4, (5 - 0.2 * as - 0.2 * pt - 0.3 * pe) / 0.3);
        String s = String.format(Locale.US, "%.2f", need);          // Locale.US: always a dot as decimal point
        return need &gt; 10 ? s + " -&gt; impossible, FE is out of 10" : s;
    }

    public static void main(String[] args) {
        double[][] cases = {
            {8, 7, 6, 6}, {9, 9, 5, 3.5}, {6, 5, 4, 4}, {10, 8, 0, 9}, {0, 9, 9, 9}, {5, 5, 5, 5}
        };
        System.out.println("  AS   PT   PE   FE |   TS | result");
        for (double[] c : cases)
            System.out.println(String.format(Locale.US, "%4.1f %4.1f %4.1f %4.1f | %4.2f | ", c[0], c[1], c[2], c[3],
                    total(c[0], c[1], c[2], c[3])) + result(c[0], c[1], c[2], c[3]));
        System.out.println("FE needed with AS=7, PT=6, PE=5: " + feNeeded(7, 6, 5));
        System.out.println("FE needed with AS=5, PT=4, PE=3: " + feNeeded(5, 4, 3));
        System.out.println("FE needed with AS=2, PT=2, PE=1: " + feNeeded(2, 2, 1));
    }
}</code></pre>
<div class="out">&nbsp;&nbsp;AS &nbsp;&nbsp;PT &nbsp;&nbsp;PE &nbsp;&nbsp;FE | &nbsp;&nbsp;TS | result<br>
&nbsp;8.0 &nbsp;7.0 &nbsp;6.0 &nbsp;6.0 | 6.60 | PASS<br>
&nbsp;9.0 &nbsp;9.0 &nbsp;5.0 &nbsp;3.5 | 6.15 | FAIL: FE &lt; 4<br>
&nbsp;6.0 &nbsp;5.0 &nbsp;4.0 &nbsp;4.0 | 4.60 | FAIL: TS &lt; 5<br>
10.0 &nbsp;8.0 &nbsp;0.0 &nbsp;9.0 | 6.30 | FAIL: PE = 0<br>
&nbsp;0.0 &nbsp;9.0 &nbsp;9.0 &nbsp;9.0 | 7.20 | FAIL: AS = 0<br>
&nbsp;5.0 &nbsp;5.0 &nbsp;5.0 &nbsp;5.0 | 5.00 | PASS<br>
FE needed with AS=7, PT=6, PE=5: 4.00<br>
FE needed with AS=5, PT=4, PE=3: 7.67<br>
FE needed with AS=2, PT=2, PE=1: 13.00 -&gt; impossible, FE is out of 10</div>
<div class="pitfall">The second score set is the classic trap: AS 9, PT 9, PE 5, FE 3.5 gives TS = 6.15 — well above 5 — and still <strong>fails</strong>, because FE &lt; 4. The last line shows the other side: with weak AS, PT and PE scores the FE you need can be above 10, so the subject is lost before the final exam.</div>`,
        `<p class="y-chinh">🎯 Điểm tổng kết (Total Score — TS) là TS = 0.2·AS + 0.2·PT + 0.3·PE + 0.3·FE (bài tập lớn, kiểm tra tiến độ, thi thực hành, thi cuối kỳ), và chỉ qua môn khi mọi cột đều lớn hơn 0, FE đạt ít nhất 4 và TS đạt ít nhất 5.</p>
<table>
<thead><tr><th>Thành phần</th><th>Số bài</th><th>Trọng số</th><th>Điều kiện hoàn thành</th></tr></thead>
<tbody>
<tr><td>AS — Assignment, bài tập lớn (đánh giá trong quá trình — on-going)</td><td>2</td><td>20%</td><td>trung bình &gt; 0</td></tr>
<tr><td>PT — Progress Test, bài kiểm tra tiến độ (on-going)</td><td>2</td><td>20%</td><td>trung bình &gt; 0</td></tr>
<tr><td>PE — Practical Exam, thi thực hành: 85 phút lập trình</td><td>1</td><td>30%</td><td>&gt; 0, không thi lại</td></tr>
<tr><td>FE — Final Exam, thi cuối kỳ: 60 phút</td><td>1</td><td>30%</td><td>≥ 4</td></tr>
</tbody>
</table>
<ul>
<li>Bảng này khớp đúng bảng đánh giá (assessment) của syllabus (đề cương môn học) hiện hành (thời lượng 85 và 60 phút lấy từ syllabus).</li>
<li>AS và PT mỗi cột là <strong>trung bình</strong> của hai bài, và điều kiện "&gt; 0" áp lên điểm trung bình đó.</li>
<li>"No resit" (không thi lại) — như slide ghi: PE không có lần thi thứ hai, hãy coi đó là bài thi chỉ có một cơ hội.</li>
<li>Các điều kiện (completion criteria — điều kiện hoàn thành) là những cửa riêng biệt: TS cao không cứu được FE 3,9, còn PE bằng 0 là trượt môn dù các cột khác đều 10.</li>
</ul>
<p>Chương trình áp các luật lên sáu bộ điểm, rồi trả lời câu sinh viên thật sự hay hỏi — "mình cần FE bao nhiêu?":</p>
<pre><code class="language-java">import java.util.Locale;

public class GradeCalc {
    // TS = 0.2*AS + 0.2*PT + 0.3*PE + 0.3*FE (slide 8)
    static double total(double as, double pt, double pe, double fe) {
        return 0.2 * as + 0.2 * pt + 0.3 * pe + 0.3 * fe;
    }

    // Điều kiện hoàn thành, kiểm theo đúng thứ tự trên slide
    static String result(double as, double pt, double pe, double fe) {
        if (as &lt;= 0) return "FAIL: AS = 0";
        if (pt &lt;= 0) return "FAIL: PT = 0";
        if (pe &lt;= 0) return "FAIL: PE = 0";
        if (fe &lt; 4) return "FAIL: FE &lt; 4";
        if (total(as, pt, pe, fe) &lt; 5 - 1e-9) return "FAIL: TS &lt; 5";   // 1e-9: chừa chỗ cho sai số làm tròn của double
        return "PASS";
    }

    // FE thấp nhất để qua môn khi đã biết AS, PT, PE
    static String feNeeded(double as, double pt, double pe) {
        double need = Math.max(4, (5 - 0.2 * as - 0.2 * pt - 0.3 * pe) / 0.3);
        String s = String.format(Locale.US, "%.2f", need);          // Locale.US: luôn dùng dấu chấm thập phân
        return need &gt; 10 ? s + " -&gt; impossible, FE is out of 10" : s;
    }

    public static void main(String[] args) {
        double[][] cases = {
            {8, 7, 6, 6}, {9, 9, 5, 3.5}, {6, 5, 4, 4}, {10, 8, 0, 9}, {0, 9, 9, 9}, {5, 5, 5, 5}
        };
        System.out.println("  AS   PT   PE   FE |   TS | result");
        for (double[] c : cases)
            System.out.println(String.format(Locale.US, "%4.1f %4.1f %4.1f %4.1f | %4.2f | ", c[0], c[1], c[2], c[3],
                    total(c[0], c[1], c[2], c[3])) + result(c[0], c[1], c[2], c[3]));
        System.out.println("FE needed with AS=7, PT=6, PE=5: " + feNeeded(7, 6, 5));
        System.out.println("FE needed with AS=5, PT=4, PE=3: " + feNeeded(5, 4, 3));
        System.out.println("FE needed with AS=2, PT=2, PE=1: " + feNeeded(2, 2, 1));
    }
}</code></pre>
<div class="out">&nbsp;&nbsp;AS &nbsp;&nbsp;PT &nbsp;&nbsp;PE &nbsp;&nbsp;FE | &nbsp;&nbsp;TS | result<br>
&nbsp;8.0 &nbsp;7.0 &nbsp;6.0 &nbsp;6.0 | 6.60 | PASS<br>
&nbsp;9.0 &nbsp;9.0 &nbsp;5.0 &nbsp;3.5 | 6.15 | FAIL: FE &lt; 4<br>
&nbsp;6.0 &nbsp;5.0 &nbsp;4.0 &nbsp;4.0 | 4.60 | FAIL: TS &lt; 5<br>
10.0 &nbsp;8.0 &nbsp;0.0 &nbsp;9.0 | 6.30 | FAIL: PE = 0<br>
&nbsp;0.0 &nbsp;9.0 &nbsp;9.0 &nbsp;9.0 | 7.20 | FAIL: AS = 0<br>
&nbsp;5.0 &nbsp;5.0 &nbsp;5.0 &nbsp;5.0 | 5.00 | PASS<br>
FE needed with AS=7, PT=6, PE=5: 4.00<br>
FE needed with AS=5, PT=4, PE=3: 7.67<br>
FE needed with AS=2, PT=2, PE=1: 13.00 -&gt; impossible, FE is out of 10</div>
<div class="pitfall">Bộ điểm thứ hai là cái bẫy kinh điển: AS 9, PT 9, PE 5, FE 3,5 cho TS = 6,15 — cao hơn hẳn 5 — mà vẫn <strong>trượt</strong>, vì FE &lt; 4. Dòng cuối cho thấy mặt kia: nếu AS, PT và PE đều quá thấp, FE cần đạt có thể vượt 10, tức là môn học đã mất trước cả khi thi cuối kỳ.</div>`],
      [9, 'FPT University Academic policy',
        `<p class="y-chinh">🎯 FPT University treats three things as serious offences: cheating in tests and exams, plagiarism, and breach of copyright.</p>
<ul>
<li><strong>Cheating</strong> — during a test or exam: talking, peeking at another student's paper, or any other hidden ("clandestine") way of passing information.</li>
<li><strong>Plagiarism</strong> — using the work of others without citing it, i.e. presenting it as your own. In programming: handing in code you did not write — a classmate's, an old assignment from a senior student, a website's — as your own work.</li>
<li><strong>Breach of copyright</strong> — for example photocopying a textbook without the copyright holder's permission. It is also why this lesson does not repeat the download link of slide 5.</li>
</ul>
<p class="nhan">Using other people's ideas the right way</p>
<ul>
<li>Learning from the book and from sample code is expected. When your code is adapted from a source, say so in a comment (for example <code>// adapted from Goodrich 6e, section 3.2</code>), and ask your lecturer what is allowed in assignments.</li>
<li>Code-similarity tools compare the <em>structure</em> of programs, so renaming variables or reordering methods does not hide copying — and the syllabus plans "assignment evaluation" sessions where you may be asked to explain your code.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> if you cannot explain a line of your code, it is not really your line.</p>
<div class="pitfall">Giving your code to a friend "just to have a look" is risky too: when two submissions match, it is hard to show who copied from whom.</div>`,
        `<p class="y-chinh">🎯 Trường Đại học FPT coi ba việc là vi phạm nghiêm trọng: gian lận khi kiểm tra và thi (cheating), đạo văn (plagiarism) và vi phạm bản quyền (breach of copyright).</p>
<ul>
<li><strong>Cheating</strong> (gian lận) — trong giờ kiểm tra hay thi: nói chuyện, nhìn bài người khác, hoặc bất kỳ cách lén lút ("clandestine" — lén lút, bí mật) nào để truyền thông tin. Chữ "construed as" trên slide nghĩa là "được hiểu là".</li>
<li><strong>Plagiarism</strong> (đạo văn) — dùng sản phẩm của người khác mà không ghi nguồn, tức là nhận nó là của mình. Trong lập trình: nộp code không phải mình viết — của bạn cùng lớp, bài cũ của khoá trên, code trên mạng — như thể là bài của mình.</li>
<li><strong>Breach of copyright</strong> (vi phạm bản quyền) — ví dụ photo giáo trình khi chưa được chủ sở hữu bản quyền cho phép. Đó cũng là lý do bài này không chép lại đường link tải sách ở slide 5.</li>
</ul>
<p class="nhan">Dùng ý tưởng của người khác cho đúng cách</p>
<ul>
<li>Học theo sách và code mẫu là việc bình thường. Khi code của bạn được chỉnh từ một nguồn nào đó, hãy ghi rõ trong chú thích (comment), ví dụ <code>// adapted from Goodrich 6e, section 3.2</code> (chỉnh từ Goodrich bản 6, mục 3.2), và hỏi giảng viên xem assignment (bài tập lớn) cho phép đến đâu.</li>
<li>Các công cụ so độ giống code so sánh <em>cấu trúc</em> chương trình, nên đổi tên biến hay đảo thứ tự các hàm không che được việc sao chép — và syllabus (đề cương môn học) có các buổi "assignment evaluation" (đánh giá bài tập lớn), nơi bạn có thể bị yêu cầu giải thích code của mình.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> dòng code nào bạn không giải thích được thì đó chưa thật sự là dòng code của bạn.</p>
<div class="pitfall">Đưa code cho bạn "chỉ để tham khảo" cũng rủi ro: khi hai bài nộp giống nhau, rất khó chứng minh ai chép của ai.</div>`],
      [10, 'Assignments submission guide',
        `<p class="y-chinh">🎯 Put the whole assignment in one folder named like <code>01245_HungNV_AS1</code>, compress that folder into an archive with the same name, and submit the archive.</p>
<ol>
<li>Create a folder named after the pattern <strong>login_name_ASX</strong>. The slide's example, <code>01245_HungNV_AS1</code>, joins a number, a login name and the assignment number with underscores.</li>
<li>Put everything the assignment needs inside it — the source files, and whatever else your lecturer asks for.</li>
<li>Compress the <strong>folder itself</strong>, not just the files inside it, into an archive (for example a .zip) with the same name.</li>
<li>Submit the archive — to CMS on the slide; today, wherever your lecturer tells you.</li>
</ol>
<pre><code class="language-plaintext">Right                                   Wrong
01245_HungNV_AS1.zip                    AS1.zip             &lt;- no name, no number
  01245_HungNV_AS1/                       MyList.java       &lt;- files at the top:
    src/MyList.java                       Main.java            the folder was not zipped
    src/Main.java</code></pre>
<p class="meo">🧠 <strong>Remember:</strong> the lecturer unpacks dozens of archives into one place; a folder named after you keeps your files apart from everybody else's.</p>
<div class="pitfall">Before you submit, unpack your own archive into an empty folder, open it and run it. A wrong name, missing source files, or an archive holding only the compiled <code>.class</code> files are the classic ways to lose assignment marks.</div>`,
        `<p class="y-chinh">🎯 Cho toàn bộ bài vào một thư mục (folder) đặt tên kiểu <code>01245_HungNV_AS1</code>, nén (compress) nguyên thư mục đó thành một tệp nén cùng tên, rồi nộp tệp nén.</p>
<ol>
<li>Tạo thư mục theo mẫu <strong>login_name_ASX</strong> (tên đăng nhập + số thứ tự assignment — bài tập lớn). Ví dụ trên slide, <code>01245_HungNV_AS1</code>, ghép một dãy số, một tên đăng nhập và số thứ tự bài bằng dấu gạch dưới (underscore).</li>
<li>Đặt mọi thứ bài cần vào trong đó — các file mã nguồn (source), và những gì khác giảng viên yêu cầu.</li>
<li>Nén <strong>chính thư mục đó</strong>, chứ không chỉ các file bên trong, thành một tệp nén (archive — ví dụ .zip) cùng tên.</li>
<li>Nộp tệp nén — trên slide là nộp lên trang CMS của trường; hiện nay thì nộp ở nơi giảng viên hướng dẫn.</li>
</ol>
<pre><code class="language-plaintext">Đúng                                    Sai
01245_HungNV_AS1.zip                    AS1.zip             &lt;- không tên, không số
  01245_HungNV_AS1/                       MyList.java       &lt;- file nằm ngay ngoài cùng:
    src/MyList.java                       Main.java            thư mục chưa được nén
    src/Main.java</code></pre>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> giảng viên giải nén hàng chục bài vào cùng một chỗ; thư mục mang tên bạn giúp file của bạn không lẫn vào bài người khác.</p>
<div class="pitfall">Trước khi nộp, tự giải nén tệp của mình vào một thư mục trống, mở ra và chạy thử. Sai tên, thiếu file mã nguồn, hay tệp nén chỉ chứa các file <code>.class</code> đã biên dịch là những cách mất điểm assignment kinh điển.</div>`],
      [11, 'OOP naming conventions',
        `<p class="y-chinh">🎯 Java names follow camelCase: class names start with a capital letter, variable and method names with a small letter, and from the second word on every word starts with a capital.</p>
<table>
<thead><tr><th>Kind of name</th><th>Rule on the slide</th><th>Slide's examples</th><th>Wrong</th></tr></thead>
<tbody>
<tr><td>class</td><td>starts with an uppercase letter</td><td><code>Rectangle</code>, <code>SecondDegreeEquation</code></td><td><code>rectangle</code>, <code>Second_degree_equation</code></td></tr>
<tr><td>variable</td><td>starts with a lowercase letter</td><td><code>sideOfRectangle</code></td><td><code>SideOfRectangle</code>, <code>side_of_rectangle</code></td></tr>
<tr><td>method (function)</td><td>starts with a lowercase letter</td><td><code>setDataToSafety</code></td><td><code>SetDataToSafety()</code>, <code>Getarea()</code></td></tr>
</tbody>
</table>
<ul>
<li>The slide's title says "notion conventions"; the usual English term is <strong>naming conventions</strong>.</li>
<li>Not on the slide but standard Java: constants are <code>UPPER_CASE</code> (<code>MAX_ROOTS</code>), package names are all lowercase.</li>
<li>The compiler accepts any legal name — these are conventions, not rules: the program's <code>rectangle_helper</code> class breaks all of them on purpose and still compiles. But the whole Java library (<code>ArrayList</code>, <code>toString()</code>, <code>isEmpty()</code>) and the usual PE skeletons (<code>MyList</code>, <code>addLast</code>) follow them, so code that breaks them is hard to read.</li>
</ul>
<pre><code class="language-java">// Class names start with an uppercase letter: Rectangle, SecondDegreeEquation
class Rectangle {
    private double width, height;                     // variables start with a lowercase letter

    Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }

    double getArea() { return width * height; }       // methods: lowercase first, then every word capitalised
    boolean isSquare() { return width == height; }
}

class SecondDegreeEquation {                          // a*x*x + b*x + c = 0
    static final int MAX_ROOTS = 2;                   // constants: UPPER_CASE (Java habit, not on the slide)
    private double a, b, c;

    SecondDegreeEquation(double a, double b, double c) { this.a = a; this.b = b; this.c = c; }

    double getDiscriminant() { return b * b - 4 * a * c; }

    String solve() {
        double delta = getDiscriminant();
        if (delta &lt; 0) return "no real root";
        double x1 = (-b + Math.sqrt(delta)) / (2 * a);
        double x2 = (-b - Math.sqrt(delta)) / (2 * a);
        return "x1 = " + x1 + ", x2 = " + x2 + " (at most " + MAX_ROOTS + " roots)";
    }
}

// WRONG on purpose: breaks every convention, yet compiles - conventions are for people, not for the compiler
class rectangle_helper {
    double Side_Of_Rectangle = 3;
    double GETAREA() { return Side_Of_Rectangle * Side_Of_Rectangle; }
}

public class NamingDemo {
    public static void main(String[] args) {
        double sideOfRectangle = 3;                   // a variable name made of three words
        Rectangle square = new Rectangle(sideOfRectangle, sideOfRectangle);
        System.out.println("area = " + square.getArea() + ", isSquare = " + square.isSquare());
        SecondDegreeEquation equation = new SecondDegreeEquation(1, -3, 2);
        System.out.println("delta = " + equation.getDiscriminant() + ", " + equation.solve());
        System.out.println("badly named class, same result: area = " + new rectangle_helper().GETAREA());
    }
}</code></pre>
<div class="out">area = 9.0, isSquare = true<br>
delta = 1.0, x1 = 2.0, x2 = 1.0 (at most 2 roots)<br>
badly named class, same result: area = 9.0</div>
<p class="meo">🧠 <strong>Remember:</strong> classes are nouns (<code>Rectangle</code>), methods are verbs (<code>getArea</code>), and a boolean method reads like a yes/no question (<code>isSquare</code>, <code>isEmpty</code>).</p>
<div class="pitfall">Java is case-sensitive: <code>Node</code>, <code>node</code> and <code>NODE</code> are three different names. And a <code>public class</code> must sit in a file with exactly its name — <code>public class NamingDemo</code> saved as <code>Namingdemo.java</code> does not compile.</div>`,
        `<p class="y-chinh">🎯 Tên trong Java theo kiểu camelCase (viết hoa chữ đầu mỗi từ, trông như lưng lạc đà): tên lớp bắt đầu bằng chữ hoa, tên biến và tên hàm bắt đầu bằng chữ thường, và từ từ thứ hai trở đi, mỗi từ viết hoa chữ cái đầu.</p>
<table>
<thead><tr><th>Loại tên</th><th>Luật trên slide</th><th>Ví dụ của slide</th><th>Sai</th></tr></thead>
<tbody>
<tr><td>lớp (class)</td><td>bắt đầu bằng chữ hoa</td><td><code>Rectangle</code>, <code>SecondDegreeEquation</code></td><td><code>rectangle</code>, <code>Second_degree_equation</code></td></tr>
<tr><td>biến (variable)</td><td>bắt đầu bằng chữ thường</td><td><code>sideOfRectangle</code></td><td><code>SideOfRectangle</code>, <code>side_of_rectangle</code></td></tr>
<tr><td>hàm (method/function)</td><td>bắt đầu bằng chữ thường</td><td><code>setDataToSafety</code></td><td><code>SetDataToSafety()</code>, <code>Getarea()</code></td></tr>
</tbody>
</table>
<ul>
<li>Tiêu đề slide ghi "notion conventions"; thuật ngữ tiếng Anh thường dùng là <strong>naming conventions</strong> (quy ước đặt tên).</li>
<li>Slide không nêu nhưng là chuẩn của Java: hằng số (constant) viết <code>UPPER_CASE</code> — toàn chữ hoa, nối bằng gạch dưới (<code>MAX_ROOTS</code>); tên gói (package) viết toàn chữ thường.</li>
<li>Trình biên dịch (compiler) chấp nhận mọi tên hợp lệ — đây là quy ước, không phải luật: lớp <code>rectangle_helper</code> trong chương trình cố tình phá hết các quy ước mà vẫn biên dịch được. Nhưng cả thư viện Java (<code>ArrayList</code>, <code>toString()</code>, <code>isEmpty()</code>) và các bộ khung đề PE — thi thực hành — thường gặp (<code>MyList</code>, <code>addLast</code>) đều theo quy ước, nên code phá quy ước rất khó đọc.</li>
</ul>
<pre><code class="language-java">// Tên lớp bắt đầu bằng chữ HOA: Rectangle, SecondDegreeEquation
class Rectangle {
    private double width, height;                     // biến bắt đầu bằng chữ thường

    Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }

    double getArea() { return width * height; }       // hàm: chữ đầu thường, các từ sau viết hoa chữ đầu
    boolean isSquare() { return width == height; }
}

class SecondDegreeEquation {                          // a*x*x + b*x + c = 0
    static final int MAX_ROOTS = 2;                   // hằng số: VIẾT_HOA (thói quen Java, slide không nêu)
    private double a, b, c;

    SecondDegreeEquation(double a, double b, double c) { this.a = a; this.b = b; this.c = c; }

    double getDiscriminant() { return b * b - 4 * a * c; }

    String solve() {
        double delta = getDiscriminant();
        if (delta &lt; 0) return "no real root";
        double x1 = (-b + Math.sqrt(delta)) / (2 * a);
        double x2 = (-b - Math.sqrt(delta)) / (2 * a);
        return "x1 = " + x1 + ", x2 = " + x2 + " (at most " + MAX_ROOTS + " roots)";
    }
}

// CỐ TÌNH SAI: phá mọi quy ước mà vẫn biên dịch được - quy ước là cho người đọc, không phải cho trình biên dịch
class rectangle_helper {
    double Side_Of_Rectangle = 3;
    double GETAREA() { return Side_Of_Rectangle * Side_Of_Rectangle; }
}

public class NamingDemo {
    public static void main(String[] args) {
        double sideOfRectangle = 3;                   // tên biến ghép từ ba từ
        Rectangle square = new Rectangle(sideOfRectangle, sideOfRectangle);
        System.out.println("area = " + square.getArea() + ", isSquare = " + square.isSquare());
        SecondDegreeEquation equation = new SecondDegreeEquation(1, -3, 2);
        System.out.println("delta = " + equation.getDiscriminant() + ", " + equation.solve());
        System.out.println("badly named class, same result: area = " + new rectangle_helper().GETAREA());
    }
}</code></pre>
<div class="out">area = 9.0, isSquare = true<br>
delta = 1.0, x1 = 2.0, x2 = 1.0 (at most 2 roots)<br>
badly named class, same result: area = 9.0</div>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> lớp là danh từ (<code>Rectangle</code> — hình chữ nhật), hàm là động từ (<code>getArea</code> — lấy diện tích), hàm trả về boolean (kiểu đúng/sai) đọc như một câu hỏi có/không (<code>isSquare</code> — có phải hình vuông?, <code>isEmpty</code> — có rỗng không?).</p>
<div class="pitfall">Java phân biệt chữ hoa, chữ thường (case-sensitive): <code>Node</code>, <code>node</code> và <code>NODE</code> là ba tên khác nhau. Và một <code>public class</code> phải nằm trong file có tên y hệt — <code>public class NamingDemo</code> lưu thành <code>Namingdemo.java</code> là không biên dịch được.</div>`],
    ]),
    bi(`<h3>✅ Check yourself in 60 seconds</h3>
<ol>
<li>AS 9, PT 9, PE 8, FE 3.8. Pass or fail? Why?</li>
<li>Your folder for Assignment 2 is <code>01245_HungNV_AS2</code>. What exactly do you submit?</li>
<li>Which of these follow the slide's conventions: class <code>bankAccount</code>, class <code>BankAccount</code>, method <code>GetBalance()</code>, method <code>getBalance()</code>, variable <code>Balance</code>?</li>
<li>What is the main textbook, and which edition?</li>
<li>What attendance does the syllabus require before you may sit the final exam?</li>
</ol>
<p class="dap-an">✅ <strong>Answers:</strong> (1) fail — TS = 1.8 + 1.8 + 2.4 + 1.14 = 7.14, but FE &lt; 4. (2) the folder itself, compressed into an archive with the same name, <code>01245_HungNV_AS2</code>. (3) only class <code>BankAccount</code> and method <code>getBalance()</code>; the variable should be <code>balance</code>. (4) Goodrich, Tamassia &amp; Goldwasser, <em>Data Structures and Algorithms in Java</em>, 6th edition (2014). (5) at least 80% of the sessions.</p>
<p><strong>Next:</strong> lesson 0.B — the second deck, 0-IntroductionToDSA (what a data structure and an algorithm are); then the course lessons 0.0 (materials and the 8 learning outcomes), 0.1 (course map), 0.2 (grading in detail) and 0.4 (installing JDK and Eclipse).</p>`,
    `<h3>✅ Tự kiểm tra trong 60 giây</h3>
<ol>
<li>AS 9, PT 9, PE 8, FE 3,8 (bài tập lớn, kiểm tra tiến độ, thi thực hành, thi cuối kỳ). Qua hay trượt? Vì sao?</li>
<li>Thư mục Assignment 2 (bài tập lớn số 2) của bạn là <code>01245_HungNV_AS2</code>. Chính xác thì bạn nộp cái gì?</li>
<li>Tên nào đúng quy ước của slide: lớp <code>bankAccount</code>, lớp <code>BankAccount</code>, hàm <code>GetBalance()</code>, hàm <code>getBalance()</code>, biến <code>Balance</code>?</li>
<li>Giáo trình chính là sách nào, bản thứ mấy?</li>
<li>Syllabus (đề cương môn học) yêu cầu dự bao nhiêu phần trăm số buổi mới được thi cuối kỳ?</li>
</ol>
<p class="dap-an">✅ <strong>Đáp án:</strong> (1) trượt — TS (điểm tổng kết) = 1,8 + 1,8 + 2,4 + 1,14 = 7,14, nhưng FE &lt; 4. (2) chính thư mục đó, nén thành một tệp nén cùng tên <code>01245_HungNV_AS2</code>. (3) chỉ có lớp <code>BankAccount</code> và hàm <code>getBalance()</code>; biến phải là <code>balance</code>. (4) Goodrich, Tamassia &amp; Goldwasser, <em>Data Structures and Algorithms in Java</em>, bản 6 (2014). (5) ít nhất 80% số buổi.</p>
<p><strong>Học tiếp:</strong> bài 0.B — bộ slide thứ hai, 0-IntroductionToDSA (cấu trúc dữ liệu và giải thuật là gì); sau đó các bài của khoá: 0.0 (tài liệu và 8 chuẩn đầu ra), 0.1 (bản đồ môn học), 0.2 (cách chấm điểm chi tiết) và 0.4 (cài JDK — bộ công cụ Java — và Eclipse).</p>`),
    books([
      ['goodrich', 'Ch.1 Java Primer, p.1 — revise the Java of PRO192 · §1.9 Software Development, p.46 — design, pseudocode, coding style and naming, testing and debugging', 'Chương 1 Java Primer, tr.1 — ôn lại Java đã học ở PRO192 · §1.9 Software Development, tr.46 — thiết kế, mã giả, phong cách viết code và đặt tên, kiểm thử và gỡ lỗi'],
    ]),
  ].join('\n'),
};

/* ───────── 0.B — 📑 Slide by slide · Introduction to data structures & algorithms (0-IntroductionToDSA, slides 1–10) ───────── */
const L_csd2_1 = {
  title: '0.B — 📑 Slide by slide · Introduction to data structures & algorithms (0-IntroductionToDSA, slides 1–10)|||0.B — 📑 Học theo từng slide · Nhập môn cấu trúc dữ liệu & giải thuật (0-IntroductionToDSA, slide 1–10)',
  slug: 'csd201-slide-csd2-1',
  type: 'VIDEO',
  isFreePreview: true,
  description: 'Giảng từng slide 1–10 của bộ 0-IntroductionToDSA: cấu trúc dữ liệu là gì và vì sao quan trọng (Wirth: Algorithms + Data Structures = Programs), các loại cấu trúc cơ bản, giải thuật là gì (al-Khwarizmi), ví dụ thuật toán Euclid, 6 tính chất của giải thuật, 4 cách biểu diễn (ngôn ngữ tự nhiên, ngôn ngữ lập trình, mã giả, lưu đồ) với ví dụ max(a,b,c), ADT Collection — 8 chương trình Java chạy thật.',
  content: [
    bi(`<span class="eyebrow">Section 0 · Lesson 0.B · 0-IntroductionToDSA, slides 1–10</span>
<h2>Introduction to data structures &amp; algorithms — slide by slide</h2>
<p class="lead">Ten slides, two definitions that the whole course rests on: a <strong>data structure</strong> is a way of organising data so that it can be used efficiently; an <strong>algorithm</strong> is a finite sequence of unambiguous steps that solves a problem. The deck adds the six properties every algorithm must have, four ways to write one down, and the Collection ADT that later chapters implement again and again.</p>
<div class="callout"><strong>In the syllabus:</strong> the first knowledge goal of CSD201 is to understand "the connection between data structures and their algorithms, including an analysis of algorithms' complexity". This deck introduces the connection; the ComplexityAnalysis deck right after it adds the analysis. Definition questions — "which is <em>not</em> a property of an algorithm?", "what does this pseudocode return?" — are typical multiple-choice material in progress tests and the FE.</div>
<h3>The whole deck in one table</h3>
<table>
<thead><tr><th>Idea</th><th>In one line</th><th>Slide</th></tr></thead>
<tbody>
<tr><td>data structure</td><td>a way of storing and organising data — the items <em>and</em> their relationships — so that it can be used efficiently</td><td>2</td></tr>
<tr><td>why it matters</td><td>efficient structures make efficient algorithms possible: Algorithms + Data Structures = Programs (Wirth)</td><td>3</td></tr>
<tr><td>basic types</td><td>arrays, lists, records, files, trees, tables — each with many variations</td><td>4</td></tr>
<tr><td>algorithm</td><td>a set of unambiguous steps with a clear stopping point that solves a problem</td><td>5–6</td></tr>
<tr><td>six properties</td><td>input, output, finiteness, definiteness, effectiveness, generality</td><td>7</td></tr>
<tr><td>representations</td><td>natural language, programming language, pseudocode, flowchart</td><td>8–9</td></tr>
<tr><td>Collection ADT</td><td>constructor/destructor, add, edit, delete, find, sort</td><td>10</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Mục 0 · Bài 0.B · 0-IntroductionToDSA, slide 1–10</span>
<h2>Nhập môn cấu trúc dữ liệu &amp; giải thuật — học từng slide</h2>
<p class="lead">Mười slide, hai định nghĩa mà cả môn học dựa lên: <strong>cấu trúc dữ liệu (data structure)</strong> là cách tổ chức dữ liệu để dùng nó hiệu quả; <strong>giải thuật (algorithm)</strong> là một dãy hữu hạn các bước rõ ràng, không mơ hồ, để giải một bài toán. Bộ slide thêm sáu tính chất mà giải thuật nào cũng phải có, bốn cách viết một giải thuật ra, và ADT Collection (kiểu dữ liệu trừu tượng "tập hợp") mà các chương sau sẽ cài đặt đi cài đặt lại.</p>
<div class="callout"><strong>Trong syllabus (đề cương môn học):</strong> mục tiêu kiến thức đầu tiên của CSD201 là hiểu "mối liên hệ giữa cấu trúc dữ liệu và giải thuật của chúng, kể cả phân tích độ phức tạp của giải thuật". Bộ slide này giới thiệu mối liên hệ đó; bộ ComplexityAnalysis ngay sau nó bổ sung phần phân tích. Các câu hỏi định nghĩa — "đâu <em>không</em> phải tính chất của giải thuật?", "đoạn mã giả này trả về gì?" — là dạng trắc nghiệm thường gặp trong bài kiểm tra tiến độ (progress test) và thi cuối kỳ (FE).</div>
<h3>Cả bộ slide trong một bảng</h3>
<table>
<thead><tr><th>Ý</th><th>Tóm trong một dòng</th><th>Slide</th></tr></thead>
<tbody>
<tr><td>cấu trúc dữ liệu</td><td>cách lưu và tổ chức dữ liệu — các phần tử <em>và</em> quan hệ giữa chúng — để dùng hiệu quả</td><td>2</td></tr>
<tr><td>vì sao quan trọng</td><td>cấu trúc hiệu quả mở đường cho giải thuật hiệu quả: Giải thuật + Cấu trúc dữ liệu = Chương trình (Wirth)</td><td>3</td></tr>
<tr><td>các loại cơ bản</td><td>mảng, danh sách, bản ghi, tệp, cây, bảng — mỗi loại có nhiều biến thể</td><td>4</td></tr>
<tr><td>giải thuật</td><td>tập các bước không mơ hồ, có điểm dừng rõ ràng, để giải một bài toán</td><td>5–6</td></tr>
<tr><td>sáu tính chất</td><td>đầu vào, đầu ra, tính dừng, tính xác định, tính hiệu quả (thực hiện được), tính tổng quát</td><td>7</td></tr>
<tr><td>cách biểu diễn</td><td>ngôn ngữ tự nhiên, ngôn ngữ lập trình, mã giả, lưu đồ</td><td>8–9</td></tr>
<tr><td>ADT Collection</td><td>hàm dựng/hàm huỷ, thêm, sửa, xoá, tìm, sắp xếp</td><td>10</td></tr>
</tbody>
</table>`),
    walkHead('csd2', 1, 10),
    walk('csd2', [
      [1, 'Introduction to Data Structures and Algorithms',
        `<p class="y-chinh">🎯 The second introductory deck defines the two words in the course title — data structure and algorithm — and shows how an algorithm is written down.</p>
<p>Everything after this deck, from linked lists to Huffman codes, is one of these two things or both: a way to organise data, and the steps that make use of that organisation.</p>`,
        `<p class="y-chinh">🎯 Bộ slide nhập môn thứ hai định nghĩa hai cụm từ trong tên môn học — cấu trúc dữ liệu (data structure) và giải thuật (algorithm) — và cho thấy cách viết một giải thuật ra.</p>
<p>Mọi thứ sau bộ slide này, từ danh sách liên kết tới mã Huffman, đều là một trong hai thứ đó hoặc cả hai: một cách tổ chức dữ liệu, và các bước tận dụng cách tổ chức ấy.</p>`],
      [2, 'What is data structure?',
        `<p class="y-chinh">🎯 A data structure is a way of storing data in a computer so that it can be used efficiently — it organises not only the items but also their relationships to each other.</p>
<ul>
<li><strong>Relationships</strong> are the point: the same numbers kept in a sorted array know their order (so binary search works); in a linked list each item knows its successor; in a tree each item knows its children.</li>
<li><strong>ADT first</strong>: the choice of a structure "often begins from the choice of an abstract data structure" — first decide <em>which operations</em> you need (the abstract data type, ADT), then <em>how</em> to store the data so that those operations are cheap.</li>
<li><strong>Resources</strong>: a well-designed structure performs the critical operations using as little execution time and memory space as possible.</li>
<li><strong>No universal winner</strong>: the slide's examples — B-trees suit databases, while compilers use hash tables to look up identifiers.</li>
</ul>
<p>The slide's two examples in Java. Java has no B-tree class; <code>TreeMap</code>, a balanced binary search tree, is its in-memory cousin — the keys stay sorted, so a whole range comes out at once:</p>
<pre><code class="language-java">import java.util.HashMap;
import java.util.TreeMap;

public class StructureChoice {
    public static void main(String[] args) {
        // A compiler's symbol table: name -&gt; type, looked up all the time -&gt; a hash table
        HashMap&lt;String, String&gt; symbols = new HashMap&lt;String, String&gt;();
        symbols.put("count", "int");
        symbols.put("total", "double");
        symbols.put("name", "String");
        System.out.println("type of total     : " + symbols.get("total"));
        System.out.println("is price declared?: " + symbols.containsKey("price"));

        // A database-style index: keys kept in order, a whole range is easy -&gt; a balanced search tree
        TreeMap&lt;Integer, String&gt; index = new TreeMap&lt;Integer, String&gt;();
        index.put(180345, "Lan");
        index.put(180021, "Minh");
        index.put(180990, "Hoa");
        index.put(180502, "Tuan");
        System.out.println("all, in key order : " + index);
        System.out.println("IDs 180300-180600 : " + index.subMap(180300, true, 180600, true));
    }
}</code></pre>
<div class="out">type of total &nbsp;&nbsp;&nbsp;&nbsp;: double<br>
is price declared?: false<br>
all, in key order : {180021=Minh, 180345=Lan, 180502=Tuan, 180990=Hoa}<br>
IDs 180300-180600 : {180345=Lan, 180502=Tuan}</div>
<p class="dap-an">✅ <strong>Answer:</strong> a data structure is a way of storing and organising data in a computer — the items together with the relationships between them — so that the operations a program needs (search, insert, delete, …) cost as little time and memory as possible. Why the relationships matter: the same IDs placed in a sorted array can be searched by halving; thrown into an unsorted array they cannot.</p>
<div class="pitfall">Never rely on the order in which a <code>HashMap</code> prints or iterates: it follows the hash values, not the insertion order and not the key order. When order matters, use a <code>TreeMap</code> (sorted keys) or a <code>LinkedHashMap</code> (insertion order).</div>`,
        `<p class="y-chinh">🎯 Cấu trúc dữ liệu (data structure) là cách lưu dữ liệu trong máy tính để dùng nó hiệu quả — nó tổ chức không chỉ các phần tử mà cả quan hệ giữa chúng với nhau.</p>
<ul>
<li><strong>Quan hệ (relationship)</strong> mới là cốt lõi: cùng những con số, đặt trong mảng đã sắp xếp thì biết thứ tự của nhau (nhờ vậy tìm kiếm nhị phân — binary search — chạy được); trong danh sách liên kết (linked list) mỗi phần tử biết phần tử đứng sau; trong cây (tree) mỗi phần tử biết các con của nó.</li>
<li><strong>ADT trước</strong>: việc chọn cấu trúc "thường bắt đầu từ việc chọn một cấu trúc dữ liệu trừu tượng" — trước hết quyết định cần <em>những thao tác nào</em> (kiểu dữ liệu trừu tượng — abstract data type, ADT), sau đó mới chọn lưu dữ liệu <em>thế nào</em> để các thao tác đó rẻ.</li>
<li><strong>Tài nguyên (resources)</strong>: một cấu trúc thiết kế tốt thực hiện các thao tác quan trọng mà tốn càng ít thời gian chạy (execution time) và bộ nhớ (memory space) càng tốt.</li>
<li><strong>Không có cấu trúc vô địch</strong>: ví dụ trên slide — B-tree (cây B) hợp với cơ sở dữ liệu, còn trình biên dịch (compiler) dùng bảng băm (hash table) để tra tên định danh (identifier — tên biến, tên hàm).</li>
</ul>
<p>Hai ví dụ của slide viết bằng Java. Java không có lớp B-tree; <code>TreeMap</code> — cây nhị phân tìm kiếm cân bằng (balanced binary search tree) — là "họ hàng" chạy trong bộ nhớ của nó: khoá luôn được sắp xếp, nên lấy cả một khoảng rất dễ:</p>
<pre><code class="language-java">import java.util.HashMap;
import java.util.TreeMap;

public class StructureChoice {
    public static void main(String[] args) {
        // Bảng ký hiệu của trình biên dịch: tên -&gt; kiểu, tra liên tục -&gt; bảng băm
        HashMap&lt;String, String&gt; symbols = new HashMap&lt;String, String&gt;();
        symbols.put("count", "int");
        symbols.put("total", "double");
        symbols.put("name", "String");
        System.out.println("type of total     : " + symbols.get("total"));
        System.out.println("is price declared?: " + symbols.containsKey("price"));

        // Chỉ mục kiểu cơ sở dữ liệu: khoá luôn có thứ tự, lấy cả một khoảng rất dễ -&gt; cây tìm kiếm cân bằng
        TreeMap&lt;Integer, String&gt; index = new TreeMap&lt;Integer, String&gt;();
        index.put(180345, "Lan");
        index.put(180021, "Minh");
        index.put(180990, "Hoa");
        index.put(180502, "Tuan");
        System.out.println("all, in key order : " + index);
        System.out.println("IDs 180300-180600 : " + index.subMap(180300, true, 180600, true));
    }
}</code></pre>
<div class="out">type of total &nbsp;&nbsp;&nbsp;&nbsp;: double<br>
is price declared?: false<br>
all, in key order : {180021=Minh, 180345=Lan, 180502=Tuan, 180990=Hoa}<br>
IDs 180300-180600 : {180345=Lan, 180502=Tuan}</div>
<p class="dap-an">✅ <strong>Đáp án:</strong> cấu trúc dữ liệu là cách lưu và tổ chức dữ liệu trong máy tính — gồm các phần tử cùng quan hệ giữa chúng — sao cho các thao tác chương trình cần (tìm, thêm, xoá, …) tốn ít thời gian và bộ nhớ nhất có thể. Vì sao quan hệ lại quan trọng: cùng những mã số đó, đặt trong mảng đã sắp xếp thì tìm được bằng cách chia đôi; để lộn xộn trong mảng thì không.</p>
<div class="pitfall">Đừng bao giờ dựa vào thứ tự mà <code>HashMap</code> in ra hay duyệt qua: nó đi theo giá trị băm (hash), không theo thứ tự thêm vào, cũng không theo thứ tự khoá. Khi thứ tự quan trọng, dùng <code>TreeMap</code> (khoá được sắp xếp) hoặc <code>LinkedHashMap</code> (giữ thứ tự thêm vào).</div>`],
      [3, 'Why data structure is important in computer science?',
        `<p class="y-chinh">🎯 Almost every program uses data structures, they make huge amounts of data manageable, and an efficient structure is usually the key to an efficient algorithm — Niklaus Wirth put it as "Algorithms + Data Structures = Programs".</p>
<ul>
<li><strong>Everywhere</strong>: large databases and internet indexing services (search engines) only work because of well-chosen structures.</li>
<li><strong>Some design methods and languages</strong> put the data structures, rather than the algorithms, at the centre of software design: choose the structure well, and good algorithms follow.</li>
<li><strong>Niklaus Wirth</strong> (Swiss computer scientist, born 15 February 1934, died 2024) designed the Pascal language and wrote a book with exactly that title (1976). The equation says a program is two things you design together: how the data is organised, and the steps that work on it.</li>
</ul>
<p class="nhan">The same job — look up every one of n student IDs once — with two ways of organising the IDs</p>
<pre><code class="language-java">public class StructureMatters {
    static long examined = 0;                         // how many elements were looked at

    // Works on any array: look at the elements one by one
    static boolean linearSearch(int[] a, int key) {
        for (int i = 0; i &lt; a.length; i++) {
            examined++;
            if (a[i] == key) return true;
        }
        return false;
    }

    // Needs a SORTED array: halve the search range each time
    static boolean binarySearch(int[] a, int key) {
        int left = 0, right = a.length - 1;
        while (left &lt;= right) {
            int mid = (left + right) / 2;
            examined++;
            if (a[mid] == key) return true;
            if (key &gt; a[mid]) left = mid + 1;
            else right = mid - 1;
        }
        return false;
    }

    public static void main(String[] args) {
        for (int n : new int[] {1000, 10000}) {
            int[] ids = new int[n];                   // student IDs kept in increasing order
            for (int i = 0; i &lt; n; i++) ids[i] = 100000 + 7 * i;
            examined = 0;
            for (int i = 0; i &lt; n; i++) linearSearch(ids, ids[i]);   // the program: look up every student once
            long linear = examined;
            examined = 0;
            for (int i = 0; i &lt; n; i++) binarySearch(ids, ids[i]);
            long binary = examined;
            System.out.println("n = " + n + ": linear search looked at " + linear + " elements, binary search " + binary
                    + " (" + linear / binary + " times fewer)");
        }
    }
}</code></pre>
<div class="out">n = 1000: linear search looked at 500500 elements, binary search 8987 (55 times fewer)<br>
n = 10000: linear search looked at 50005000 elements, binary search 123631 (404 times fewer)</div>
<ul>
<li><strong>Linear search</strong> works on any array: the k-th ID costs k looks, so the whole job costs 1 + 2 + … + n = n(n+1)/2 → 500,500 for n = 1,000.</li>
<li>Keeping the IDs <strong>sorted</strong> makes <strong>binary search</strong> possible: at most ⌊log₂ n⌋ + 1 = 10 looks per ID for n = 1,000, 8,987 in total.</li>
<li>Ten times more data made the gap grow from 55× to 404×. Measuring how cost grows with n is exactly what Big-O does (lesson 0.3 and the ComplexityAnalysis deck).</li>
</ul>
<p class="dap-an">✅ <strong>Answer</strong> (the slide's three reasons): almost every program uses data structures; they make huge amounts of data manageable (large databases, search engines); and an efficient data structure is usually the key to an efficient algorithm — the program above proves the last point: the same lookups cost 500,500 or 8,987 steps depending only on how the IDs are organised.</p>`,
        `<p class="y-chinh">🎯 Gần như chương trình nào cũng dùng cấu trúc dữ liệu, chúng giúp quản lý được lượng dữ liệu khổng lồ, và một cấu trúc hiệu quả thường là chìa khoá cho một giải thuật hiệu quả — Niklaus Wirth tóm lại: "Algorithms + Data Structures = Programs" (Giải thuật + Cấu trúc dữ liệu = Chương trình).</p>
<ul>
<li><strong>Ở khắp nơi</strong>: các cơ sở dữ liệu (database) lớn và dịch vụ lập chỉ mục internet (internet indexing — như công cụ tìm kiếm) chỉ chạy được nhờ cấu trúc được chọn khéo.</li>
<li><strong>Một số phương pháp thiết kế và ngôn ngữ</strong> đặt cấu trúc dữ liệu, chứ không phải giải thuật, vào trung tâm của thiết kế phần mềm: chọn đúng cấu trúc thì giải thuật tốt sẽ theo sau.</li>
<li><strong>Niklaus Wirth</strong> (nhà khoa học máy tính người Thuỵ Sĩ, sinh ngày 15/2/1934, mất năm 2024) là người thiết kế ngôn ngữ Pascal và viết một cuốn sách mang đúng tên câu nói đó (1976). Phương trình nói rằng một chương trình gồm hai thứ phải thiết kế cùng nhau: cách tổ chức dữ liệu, và các bước xử lý nó.</li>
</ul>
<p class="nhan">Cùng một việc — tra mỗi mã sinh viên trong n mã đúng một lần — với hai cách tổ chức các mã</p>
<pre><code class="language-java">public class StructureMatters {
    static long examined = 0;                         // số phần tử đã phải xem

    // Dùng được với mọi mảng: xem lần lượt từng phần tử
    static boolean linearSearch(int[] a, int key) {
        for (int i = 0; i &lt; a.length; i++) {
            examined++;
            if (a[i] == key) return true;
        }
        return false;
    }

    // Cần mảng ĐÃ SẮP XẾP: mỗi lần chia đôi vùng tìm
    static boolean binarySearch(int[] a, int key) {
        int left = 0, right = a.length - 1;
        while (left &lt;= right) {
            int mid = (left + right) / 2;
            examined++;
            if (a[mid] == key) return true;
            if (key &gt; a[mid]) left = mid + 1;
            else right = mid - 1;
        }
        return false;
    }

    public static void main(String[] args) {
        for (int n : new int[] {1000, 10000}) {
            int[] ids = new int[n];                   // mã sinh viên được giữ theo thứ tự tăng dần
            for (int i = 0; i &lt; n; i++) ids[i] = 100000 + 7 * i;
            examined = 0;
            for (int i = 0; i &lt; n; i++) linearSearch(ids, ids[i]);   // chương trình: tra mỗi sinh viên một lần
            long linear = examined;
            examined = 0;
            for (int i = 0; i &lt; n; i++) binarySearch(ids, ids[i]);
            long binary = examined;
            System.out.println("n = " + n + ": linear search looked at " + linear + " elements, binary search " + binary
                    + " (" + linear / binary + " times fewer)");
        }
    }
}</code></pre>
<div class="out">n = 1000: linear search looked at 500500 elements, binary search 8987 (55 times fewer)<br>
n = 10000: linear search looked at 50005000 elements, binary search 123631 (404 times fewer)</div>
<ul>
<li><strong>Tìm kiếm tuần tự (linear search)</strong> dùng được với mọi mảng: mã thứ k tốn k lần xem, nên cả việc tốn 1 + 2 + … + n = n(n+1)/2 → 500.500 lần với n = 1.000.</li>
<li>Giữ các mã <strong>đã sắp xếp</strong> thì dùng được <strong>tìm kiếm nhị phân (binary search)</strong>: tối đa ⌊log₂ n⌋ + 1 = 10 lần xem mỗi mã khi n = 1.000, tổng cộng 8.987 lần.</li>
<li>Dữ liệu nhiều gấp mười thì khoảng cách tăng từ 55 lần lên 404 lần. Đo xem chi phí tăng thế nào theo n chính là việc của Big-O (ký hiệu O lớn — bài 0.3 và bộ slide ComplexityAnalysis).</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án</strong> (ba lý do trên slide): gần như chương trình nào cũng dùng cấu trúc dữ liệu; chúng giúp quản lý lượng dữ liệu khổng lồ (cơ sở dữ liệu lớn, công cụ tìm kiếm); và cấu trúc dữ liệu hiệu quả thường là chìa khoá của giải thuật hiệu quả — chương trình ở trên chứng minh ý cuối: cùng những lần tra cứu mà tốn 500.500 hay 8.987 bước, chỉ tuỳ vào cách tổ chức các mã.</p>`],
      [4, 'Basic types of data structure',
        `<p class="y-chinh">🎯 The slide lists six basic data structures — arrays, lists, records, files, trees and tables — each with many variations that allow different operations on the data.</p>
<table>
<thead><tr><th>Structure</th><th>What it is</th><th>In Java</th><th>Where in CSD201</th></tr></thead>
<tbody>
<tr><td>array</td><td>a fixed number of cells, reached by index</td><td><code>int[] a = new int[10];</code></td><td>everywhere; Chapter 1</td></tr>
<tr><td>list</td><td>a sequence that grows and shrinks</td><td><code>ArrayList</code>, <code>LinkedList</code>, your own <code>MyList</code></td><td>Chapter 1; stacks and queues (Chapter 2) are lists with rules</td></tr>
<tr><td>record</td><td>fields of different types grouped under one name</td><td>a class with fields, e.g. <code>Student(name, gpa)</code></td><td>the data objects of PE tasks, e.g. <code>Car(owner, price)</code></td></tr>
<tr><td>file</td><td>data kept on disk, read and written in order</td><td><code>FileReader</code>, <code>FileWriter</code></td><td>PE skeletons often write your answers to a file</td></tr>
<tr><td>tree</td><td>a hierarchy: one parent, several children</td><td>your own <code>BSTree</code>; <code>TreeMap</code></td><td>Chapter 4</td></tr>
<tr><td>table</td><td>look a value up by its key</td><td><code>HashMap</code></td><td>Chapter 7 (hashing)</td></tr>
</tbody>
</table>
<pre><code class="language-java">import java.util.*;

class Student {                                  // RECORD: fields of different types under one name
    String name;
    double gpa;

    Student(String name, double gpa) { this.name = name; this.gpa = gpa; }
    public String toString() { return name + "(" + gpa + ")"; }
}

class Folder {                                   // TREE node: one parent, any number of children
    String name;
    List&lt;Folder&gt; children = new ArrayList&lt;Folder&gt;();

    Folder(String name) { this.name = name; }
    Folder add(Folder child) { children.add(child); return this; }

    void print(String indent) {                  // print this node, then its children one level deeper
        System.out.println(indent + name);
        for (Folder c : children) c.print(indent + "  ");
    }
}

public class BasicTypes {
    public static void main(String[] args) {
        int[] scores = {7, 9, 6};                // ARRAY: fixed size, jump straight to any index
        System.out.println("array : scores[1] = " + scores[1] + ", length = " + scores.length);

        List&lt;Student&gt; list = new ArrayList&lt;Student&gt;();   // LIST: a sequence that grows and shrinks
        list.add(new Student("An", 3.2));
        list.add(new Student("Binh", 3.7));
        list.add(0, new Student("Chi", 2.9));
        System.out.println("list  : " + list);
        Student s = list.get(2);
        System.out.println("record: " + s.name + " has gpa " + s.gpa);

        Map&lt;String, Double&gt; table = new HashMap&lt;String, Double&gt;();   // TABLE: look a value up by its key
        for (Student x : list) table.put(x.name, x.gpa);
        System.out.println("table : gpa of An = " + table.get("An"));

        Folder root = new Folder("CSD201");
        root.add(new Folder("slides").add(new Folder("csd1")).add(new Folder("csd2"))).add(new Folder("code"));
        System.out.println("tree  :");
        root.print("  ");
    }
}</code></pre>
<div class="out">array : scores[1] = 9, length = 3<br>
list &nbsp;: [Chi(2.9), An(3.2), Binh(3.7)]<br>
record: Binh has gpa 3.7<br>
table : gpa of An = 3.2<br>
tree &nbsp;:<br>
&nbsp;&nbsp;CSD201<br>
&nbsp;&nbsp;&nbsp;&nbsp;slides<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;csd1<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;csd2<br>
&nbsp;&nbsp;&nbsp;&nbsp;code</div>
<ul>
<li>"Variations": a list can be an array list or a singly, doubly or circular linked list; a tree can be a binary tree, a BST, an AVL tree or a heap — each variation makes different operations cheap.</li>
<li>Arrays and lists are <strong>linear</strong> (each item has at most one successor); trees are <strong>non-linear</strong>. Graphs (Chapter 5), not on this slide, are non-linear too.</li>
<li>The choice follows the operations you need most: reading by position → array; frequent inserts and deletes → linked list; hierarchy or fast ordered search → tree; lookup by key → table.</li>
</ul>
<p class="meo">🧠 <strong>Remember with everyday objects:</strong> array = numbered lockers, list = a queue of people, record = one filled-in form, file = a notebook on the shelf, tree = a folder tree or a family tree, table = a dictionary.</p>
<div class="pitfall">"Record" here is the general idea of a group of fields. The Java keyword <code>record</code> (Java 16+) does not compile as Java 8 — in the PE, write an ordinary class with fields and a constructor, like <code>Student</code> above.</div>`,
        `<p class="y-chinh">🎯 Slide kể sáu cấu trúc dữ liệu cơ bản — mảng, danh sách, bản ghi, tệp, cây và bảng — mỗi loại có nhiều biến thể (variation) cho phép những thao tác khác nhau trên dữ liệu.</p>
<table>
<thead><tr><th>Cấu trúc</th><th>Là gì</th><th>Trong Java</th><th>Ở đâu trong CSD201</th></tr></thead>
<tbody>
<tr><td>mảng (array)</td><td>một số ô cố định, truy cập theo chỉ số</td><td><code>int[] a = new int[10];</code></td><td>khắp nơi; Chương 1</td></tr>
<tr><td>danh sách (list)</td><td>một dãy co giãn được</td><td><code>ArrayList</code>, <code>LinkedList</code>, lớp <code>MyList</code> tự viết</td><td>Chương 1; ngăn xếp và hàng đợi (Chương 2) là danh sách có luật riêng</td></tr>
<tr><td>bản ghi (record)</td><td>các trường khác kiểu gom dưới một tên</td><td>một lớp có các trường, ví dụ <code>Student(name, gpa)</code></td><td>đối tượng dữ liệu trong đề PE (thi thực hành), ví dụ <code>Car(owner, price)</code></td></tr>
<tr><td>tệp (file)</td><td>dữ liệu nằm trên đĩa, đọc/ghi theo thứ tự</td><td><code>FileReader</code>, <code>FileWriter</code></td><td>khung đề PE thường ghi đáp án của bạn ra file</td></tr>
<tr><td>cây (tree)</td><td>một hệ phân cấp: một cha, nhiều con</td><td>lớp <code>BSTree</code> tự viết; <code>TreeMap</code></td><td>Chương 4</td></tr>
<tr><td>bảng (table)</td><td>tra một giá trị theo khoá (key)</td><td><code>HashMap</code></td><td>Chương 7 (băm — hashing)</td></tr>
</tbody>
</table>
<pre><code class="language-java">import java.util.*;

class Student {                                  // BẢN GHI: các trường khác kiểu gom dưới một tên
    String name;
    double gpa;

    Student(String name, double gpa) { this.name = name; this.gpa = gpa; }
    public String toString() { return name + "(" + gpa + ")"; }
}

class Folder {                                   // nút CÂY: một cha, bao nhiêu con cũng được
    String name;
    List&lt;Folder&gt; children = new ArrayList&lt;Folder&gt;();

    Folder(String name) { this.name = name; }
    Folder add(Folder child) { children.add(child); return this; }

    void print(String indent) {                  // in nút này, rồi in các con thụt vào một mức
        System.out.println(indent + name);
        for (Folder c : children) c.print(indent + "  ");
    }
}

public class BasicTypes {
    public static void main(String[] args) {
        int[] scores = {7, 9, 6};                // MẢNG: kích thước cố định, nhảy thẳng tới chỉ số bất kỳ
        System.out.println("array : scores[1] = " + scores[1] + ", length = " + scores.length);

        List&lt;Student&gt; list = new ArrayList&lt;Student&gt;();   // DANH SÁCH: dãy co giãn được
        list.add(new Student("An", 3.2));
        list.add(new Student("Binh", 3.7));
        list.add(0, new Student("Chi", 2.9));
        System.out.println("list  : " + list);
        Student s = list.get(2);
        System.out.println("record: " + s.name + " has gpa " + s.gpa);

        Map&lt;String, Double&gt; table = new HashMap&lt;String, Double&gt;();   // BẢNG: tra giá trị theo khoá
        for (Student x : list) table.put(x.name, x.gpa);
        System.out.println("table : gpa of An = " + table.get("An"));

        Folder root = new Folder("CSD201");
        root.add(new Folder("slides").add(new Folder("csd1")).add(new Folder("csd2"))).add(new Folder("code"));
        System.out.println("tree  :");
        root.print("  ");
    }
}</code></pre>
<div class="out">array : scores[1] = 9, length = 3<br>
list &nbsp;: [Chi(2.9), An(3.2), Binh(3.7)]<br>
record: Binh has gpa 3.7<br>
table : gpa of An = 3.2<br>
tree &nbsp;:<br>
&nbsp;&nbsp;CSD201<br>
&nbsp;&nbsp;&nbsp;&nbsp;slides<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;csd1<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;csd2<br>
&nbsp;&nbsp;&nbsp;&nbsp;code</div>
<ul>
<li>"Biến thể": danh sách có thể là danh sách mảng (array list) hay danh sách liên kết đơn, đôi, vòng; cây có thể là cây nhị phân, BST (cây nhị phân tìm kiếm), cây AVL hay heap (đống) — mỗi biến thể làm rẻ một số thao tác khác nhau.</li>
<li>Mảng và danh sách là cấu trúc <strong>tuyến tính (linear)</strong> — mỗi phần tử có nhiều nhất một phần tử đứng sau; cây là <strong>phi tuyến (non-linear)</strong>. Đồ thị (graph — Chương 5), không có trên slide này, cũng là phi tuyến.</li>
<li>Chọn cấu trúc theo thao tác dùng nhiều nhất: đọc theo vị trí → mảng; chèn/xoá thường xuyên → danh sách liên kết; phân cấp hoặc tìm kiếm có thứ tự thật nhanh → cây; tra theo khoá → bảng.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ bằng đồ vật hằng ngày:</strong> mảng = dãy tủ đồ đánh số, danh sách = hàng người xếp hàng, bản ghi = một tờ khai đã điền, tệp = cuốn sổ trên giá, cây = cây thư mục hay cây gia phả, bảng = cuốn từ điển.</p>
<div class="pitfall">"Record" (bản ghi) ở đây là ý chung: một nhóm các trường. Từ khoá <code>record</code> của Java (Java 16 trở lên) không biên dịch được ở mức Java 8 — trong bài PE, hãy viết một lớp bình thường có các trường và hàm dựng (constructor), như lớp <code>Student</code> ở trên.</div>`],
      [5, 'What is algorithm?',
        `<p class="y-chinh">🎯 An algorithm is a set of steps for solving a particular problem; to count as an algorithm, the steps must be unambiguous and must have a clear stopping point.</p>
<ul>
<li><strong>Any language</strong> can express it — English, French, pseudocode, FORTRAN or Java; the language is only the packaging (slides 8–9).</li>
<li><strong>Every day</strong>: the slide's example is a recipe for baking a cake — ingredients in, a cake out, steps in between. A computer would object to "bake until golden", though: not unambiguous enough (slide 7).</li>
<li><strong>Programs are made of algorithms</strong> — with the exception, says the slide, of some artificial-intelligence applications.</li>
<li><strong>Elegant</strong> algorithms are simple and need the fewest steps possible; inventing them is one of the principal challenges in programming.</li>
<li><strong>The word</strong> comes from the name of al-Khwarizmi, a 9th-century mathematician of the House of Wisdom in Baghdad. Latin translations of his work brought the Hindu-Arabic decimal numerals to Europe; reckoning with them was called "algorism", later "algorithm". (The slide calls him an Arab; most historians describe him as a Persian scholar from Khwarazm, in Central Asia, who wrote in Arabic. "Algebra" comes from the title of another of his books.)</li>
</ul>
<p class="nhan">Two correct algorithms for "is n prime?" — one of them elegant</p>
<pre><code class="language-java">public class PrimeTwoWays {
    static long divisions;                           // how many times we tested n % d

    // Algorithm 1: try every d from 2 to n - 1
    static boolean isPrimeSlow(long n) {
        if (n &lt; 2) return false;
        for (long d = 2; d &lt; n; d++) {
            divisions++;
            if (n % d == 0) return false;
        }
        return true;
    }

    // Algorithm 2: stop at the square root - if n = d * e with d &lt;= e, then d * d &lt;= n
    static boolean isPrimeFast(long n) {
        if (n &lt; 2) return false;
        for (long d = 2; d * d &lt;= n; d++) {
            divisions++;
            if (n % d == 0) return false;
        }
        return true;
    }

    public static void main(String[] args) {
        for (long n : new long[] {97, 10007, 1000003}) {
            divisions = 0;
            boolean a = isPrimeSlow(n);
            long slow = divisions;
            divisions = 0;
            boolean b = isPrimeFast(n);
            System.out.println("n = " + n + ": prime? " + a + "/" + b + " -&gt; up to n-1: " + slow
                    + " divisions, up to sqrt(n): " + divisions + " divisions");
        }
    }
}</code></pre>
<div class="out">n = 97: prime? true/true -&gt; up to n-1: 95 divisions, up to sqrt(n): 8 divisions<br>
n = 10007: prime? true/true -&gt; up to n-1: 10005 divisions, up to sqrt(n): 99 divisions<br>
n = 1000003: prime? true/true -&gt; up to n-1: 1000001 divisions, up to sqrt(n): 999 divisions</div>
<p>Both give the same answers, but trying divisors up to √n is enough: if n = d × e with d ≤ e, then d × d ≤ n. For n = 1,000,003 that is 999 divisions instead of 1,000,001 — roughly √n steps against n steps, a difference this course learns to measure with Big-O.</p>
<p class="dap-an">✅ <strong>Answer:</strong> an algorithm is a finite set of unambiguous steps, with a clear stopping point, that solves a particular problem — like a recipe, but precise enough for a computer to follow without guessing. Both prime tests above are algorithms; the second one is simply more elegant.</p>`,
        `<p class="y-chinh">🎯 Giải thuật (algorithm) là một tập các bước để giải một bài toán cụ thể; muốn được gọi là giải thuật, các bước phải không mơ hồ (unambiguous) và phải có điểm dừng rõ ràng (clear stopping point).</p>
<ul>
<li><strong>Ngôn ngữ nào</strong> cũng diễn đạt được — tiếng Anh, tiếng Pháp, tiếng Việt, mã giả, FORTRAN hay Java; ngôn ngữ chỉ là lớp vỏ (slide 8–9).</li>
<li><strong>Hằng ngày</strong>: ví dụ trên slide là công thức (recipe) nướng bánh — nguyên liệu vào, bánh ra, ở giữa là các bước. Nhưng máy tính sẽ "không chịu" câu "nướng tới khi vàng": chưa đủ rõ ràng (slide 7).</li>
<li><strong>Chương trình được làm từ giải thuật</strong> — trừ một số ứng dụng trí tuệ nhân tạo (artificial intelligence), theo lời slide.</li>
<li>Giải thuật <strong>tinh tế (elegant)</strong> là giải thuật đơn giản và cần ít bước nhất có thể; nghĩ ra chúng là một trong những thách thức chính của lập trình.</li>
<li><strong>Chữ "algorithm"</strong> bắt nguồn từ tên al-Khwarizmi, nhà toán học thế kỷ 9 làm việc tại Nhà Thông thái (House of Wisdom) ở Baghdad. Các bản dịch tiếng Latin sách của ông đưa hệ chữ số thập phân Ấn Độ – Ả Rập vào châu Âu; cách tính bằng hệ số đó được gọi là "algorism", về sau thành "algorithm". (Slide gọi ông là người Ả Rập; phần lớn nhà sử học mô tả ông là học giả người Ba Tư, quê vùng Khwarazm ở Trung Á, viết sách bằng tiếng Ả Rập. Chữ "algebra" — đại số — cũng lấy từ tên một cuốn sách khác của ông.)</li>
</ul>
<p class="nhan">Hai giải thuật đúng cho câu hỏi "n có phải số nguyên tố?" — một cái tinh tế hơn hẳn</p>
<pre><code class="language-java">public class PrimeTwoWays {
    static long divisions;                           // số lần đã thử n % d

    // Thuật toán 1: thử mọi d từ 2 tới n - 1
    static boolean isPrimeSlow(long n) {
        if (n &lt; 2) return false;
        for (long d = 2; d &lt; n; d++) {
            divisions++;
            if (n % d == 0) return false;
        }
        return true;
    }

    // Thuật toán 2: dừng ở căn bậc hai - nếu n = d * e với d &lt;= e thì d * d &lt;= n
    static boolean isPrimeFast(long n) {
        if (n &lt; 2) return false;
        for (long d = 2; d * d &lt;= n; d++) {
            divisions++;
            if (n % d == 0) return false;
        }
        return true;
    }

    public static void main(String[] args) {
        for (long n : new long[] {97, 10007, 1000003}) {
            divisions = 0;
            boolean a = isPrimeSlow(n);
            long slow = divisions;
            divisions = 0;
            boolean b = isPrimeFast(n);
            System.out.println("n = " + n + ": prime? " + a + "/" + b + " -&gt; up to n-1: " + slow
                    + " divisions, up to sqrt(n): " + divisions + " divisions");
        }
    }
}</code></pre>
<div class="out">n = 97: prime? true/true -&gt; up to n-1: 95 divisions, up to sqrt(n): 8 divisions<br>
n = 10007: prime? true/true -&gt; up to n-1: 10005 divisions, up to sqrt(n): 99 divisions<br>
n = 1000003: prime? true/true -&gt; up to n-1: 1000001 divisions, up to sqrt(n): 999 divisions</div>
<p>Cả hai cho cùng đáp án, nhưng chỉ cần thử ước số tới √n là đủ: nếu n = d × e với d ≤ e thì d × d ≤ n. Với n = 1.000.003, đó là 999 phép chia thay vì 1.000.001 — cỡ √n bước so với n bước, một khác biệt mà môn học này dạy cách đo bằng Big-O (ký hiệu O lớn).</p>
<p class="dap-an">✅ <strong>Đáp án:</strong> giải thuật là một tập hữu hạn các bước không mơ hồ, có điểm dừng rõ ràng, để giải một bài toán cụ thể — giống công thức nấu ăn, nhưng chính xác tới mức máy tính làm theo được mà không phải đoán. Cả hai cách kiểm tra số nguyên tố ở trên đều là giải thuật; cách thứ hai chỉ tinh tế hơn.</p>`],
      [6, 'Algorithm example (figure)',
        `<p class="y-chinh">🎯 Right after the definition, the deck shows an algorithm example; here the idea is rebuilt with one of the oldest known algorithms — Euclid's greatest common divisor.</p>
<p class="ghi-chu">This slide is a picture: apart from its title, no text could be extracted, so the picture is not described here. The lesson teaches the idea the slide belongs to — what a concrete algorithm looks like — with its own example; compare it with the picture on the slide.</p>
<p class="nhan">The lesson's own example — Euclid's algorithm (about 300 BC): gcd(a, b) of two positive integers</p>
<ol>
<li>If b = 0, the answer is a — stop.</li>
<li>Otherwise compute r = a mod b, the remainder of a ÷ b.</li>
<li>Replace (a, b) by (b, r) and go back to step 1.</li>
</ol>
<table>
<thead><tr><th>Round</th><th>a</th><th>b</th><th>r = a mod b</th></tr></thead>
<tbody>
<tr><td>1</td><td>48</td><td>18</td><td>12</td></tr>
<tr><td>2</td><td>18</td><td>12</td><td>6</td></tr>
<tr><td>3</td><td>12</td><td>6</td><td>0</td></tr>
<tr><td>stop (b = 0)</td><td>6</td><td>0</td><td>answer: gcd(48, 18) = 6</td></tr>
</tbody>
</table>
<pre><code class="language-java">public class EuclidGcd {
    // Euclid (about 300 BC): gcd(a, b) = gcd(b, a mod b) and gcd(a, 0) = a
    static int gcd(int a, int b) {
        int step = 0;
        while (b != 0) {                             // stops: b gets strictly smaller every round
            int r = a % b;
            step++;
            System.out.println("  step " + step + ": a = " + a + ", b = " + b + ", a mod b = " + r);
            a = b;
            b = r;
        }
        return a;
    }

    public static void main(String[] args) {
        System.out.println("gcd(48, 18):");
        System.out.println("  result = " + gcd(48, 18));
        System.out.println("gcd(17, 5):");
        System.out.println("  result = " + gcd(17, 5));
    }
}</code></pre>
<div class="out">gcd(48, 18):<br>
&nbsp;&nbsp;step 1: a = 48, b = 18, a mod b = 12<br>
&nbsp;&nbsp;step 2: a = 18, b = 12, a mod b = 6<br>
&nbsp;&nbsp;step 3: a = 12, b = 6, a mod b = 0<br>
&nbsp;&nbsp;result = 6<br>
gcd(17, 5):<br>
&nbsp;&nbsp;step 1: a = 17, b = 5, a mod b = 2<br>
&nbsp;&nbsp;step 2: a = 5, b = 2, a mod b = 1<br>
&nbsp;&nbsp;step 3: a = 2, b = 1, a mod b = 0<br>
&nbsp;&nbsp;result = 1</div>
<ul>
<li>It already has the properties of slide 7: inputs (two positive integers), an output (their gcd), every step exact, only basic operations (mod and assignment) — and it always stops, because b gets strictly smaller every round and cannot go below 0.</li>
<li><strong>Big-O:</strong> the number of rounds grows like the logarithm of the smaller number, O(log min(a, b)) — a handful of rounds even for huge numbers.</li>
</ul>`,
        `<p class="y-chinh">🎯 Ngay sau định nghĩa, bộ slide đưa ra một ví dụ giải thuật; ở đây ý đó được dựng lại bằng một trong những giải thuật cổ nhất còn biết: tìm ước chung lớn nhất (greatest common divisor — gcd) của Euclid.</p>
<p class="ghi-chu">Slide này là hình: ngoài tiêu đề, không trích được chữ nào trên slide, nên ở đây không mô tả hình. Phần giảng dạy ý mà slide thuộc về — một giải thuật cụ thể trông như thế nào — bằng ví dụ của bài; hãy đối chiếu với hình trên slide.</p>
<p class="nhan">Ví dụ của bài — giải thuật Euclid (khoảng năm 300 trước Công nguyên): gcd(a, b) của hai số nguyên dương</p>
<ol>
<li>Nếu b = 0 thì đáp án là a — dừng.</li>
<li>Ngược lại, tính r = a mod b, tức số dư của a ÷ b.</li>
<li>Thay (a, b) bằng (b, r) rồi quay lại bước 1.</li>
</ol>
<table>
<thead><tr><th>Vòng</th><th>a</th><th>b</th><th>r = a mod b</th></tr></thead>
<tbody>
<tr><td>1</td><td>48</td><td>18</td><td>12</td></tr>
<tr><td>2</td><td>18</td><td>12</td><td>6</td></tr>
<tr><td>3</td><td>12</td><td>6</td><td>0</td></tr>
<tr><td>dừng (b = 0)</td><td>6</td><td>0</td><td>đáp án: gcd(48, 18) = 6</td></tr>
</tbody>
</table>
<pre><code class="language-java">public class EuclidGcd {
    // Euclid (khoảng 300 TCN): gcd(a, b) = gcd(b, a mod b) và gcd(a, 0) = a
    static int gcd(int a, int b) {
        int step = 0;
        while (b != 0) {                             // chắc chắn dừng: b giảm hẳn sau mỗi vòng
            int r = a % b;
            step++;
            System.out.println("  step " + step + ": a = " + a + ", b = " + b + ", a mod b = " + r);
            a = b;
            b = r;
        }
        return a;
    }

    public static void main(String[] args) {
        System.out.println("gcd(48, 18):");
        System.out.println("  result = " + gcd(48, 18));
        System.out.println("gcd(17, 5):");
        System.out.println("  result = " + gcd(17, 5));
    }
}</code></pre>
<div class="out">gcd(48, 18):<br>
&nbsp;&nbsp;step 1: a = 48, b = 18, a mod b = 12<br>
&nbsp;&nbsp;step 2: a = 18, b = 12, a mod b = 6<br>
&nbsp;&nbsp;step 3: a = 12, b = 6, a mod b = 0<br>
&nbsp;&nbsp;result = 6<br>
gcd(17, 5):<br>
&nbsp;&nbsp;step 1: a = 17, b = 5, a mod b = 2<br>
&nbsp;&nbsp;step 2: a = 5, b = 2, a mod b = 1<br>
&nbsp;&nbsp;step 3: a = 2, b = 1, a mod b = 0<br>
&nbsp;&nbsp;result = 1</div>
<ul>
<li>Nó đã có đủ các tính chất của slide 7: đầu vào (hai số nguyên dương), đầu ra (ước chung lớn nhất của chúng), mọi bước đều chính xác, chỉ dùng phép toán cơ bản (lấy dư và gán) — và luôn dừng, vì b giảm hẳn sau mỗi vòng và không thể nhỏ hơn 0.</li>
<li><strong>Big-O</strong> (ký hiệu O lớn): số vòng tăng theo lôgarit của số nhỏ hơn, O(log min(a, b)) — chỉ vài vòng kể cả với số rất lớn.</li>
</ul>`],
      [7, 'What are the properties of an algorithm?',
        `<p class="y-chinh">🎯 Six properties turn a list of instructions into an algorithm: input, output, finiteness, definiteness, effectiveness and generality.</p>
<table>
<thead><tr><th>Property</th><th>The slide's definition</th><th>Example / counter-example</th></tr></thead>
<tbody>
<tr><td>Input</td><td>accepts zero or more inputs</td><td>zero is allowed: "print the first 10 primes" needs no input</td></tr>
<tr><td>Output</td><td>produces at least one output</td><td>a procedure that computes but shows nothing solves no problem</td></tr>
<tr><td>Finiteness</td><td>terminates after a finite number of steps</td><td>✗ <code>while (x != 0) x = x - 2;</code> with x = 5</td></tr>
<tr><td>Definiteness</td><td>each step is unambiguous — it cannot be interpreted in several ways</td><td>✗ "add a little salt", "pick a big number"</td></tr>
<tr><td>Effectiveness</td><td>basic instructions that can be carried out with the given inputs in finite time</td><td>✗ "write down every digit of √2"</td></tr>
<tr><td>Generality</td><td>works for a general set of inputs</td><td>✗ a max that starts from 0 and fails on negative numbers</td></tr>
</tbody>
</table>
<pre><code class="language-java">import java.util.Arrays;

public class GeneralityBug {
    // BUG: quietly assumes the answer is at least 0
    static int maxFromZero(int[] a) {
        int max = 0;
        for (int x : a) if (x &gt; max) max = x;
        return max;
    }

    // Correct for EVERY non-empty array: start from a real element
    static int maxFromFirst(int[] a) {
        int max = a[0];
        for (int i = 1; i &lt; a.length; i++) if (a[i] &gt; max) max = a[i];
        return max;
    }

    public static void main(String[] args) {
        int[][] tests = {{3, 8, 5}, {7}, {-5, -2, -9}};
        for (int[] t : tests)
            System.out.println(Arrays.toString(t) + " -&gt; maxFromZero = " + maxFromZero(t) + ", maxFromFirst = " + maxFromFirst(t));

        // Finiteness: "while (x != 0) x = x - 2" never ends when x is odd; we stop it after 5 rounds
        int x = 5, rounds = 0;
        while (x != 0 &amp;&amp; rounds &lt; 5) {
            x = x - 2;
            rounds++;
        }
        System.out.println("x = 5, then x = x - 2 five times -&gt; x = " + x + " (it jumped over 0: not finite)");
    }
}</code></pre>
<div class="out">[3, 8, 5] -&gt; maxFromZero = 8, maxFromFirst = 8<br>
[7] -&gt; maxFromZero = 7, maxFromFirst = 7<br>
[-5, -2, -9] -&gt; maxFromZero = 0, maxFromFirst = -2<br>
x = 5, then x = x - 2 five times -&gt; x = -5 (it jumped over 0: not finite)</div>
<ul>
<li>The output shows two broken properties: <code>maxFromZero</code> answers 0 for [-5, -2, -9] — a number that is not even in the array (generality) — and the x = 5 loop jumps over 0, so without the guard it would run forever (finiteness).</li>
<li>Start a maximum from a real element (<code>a[0]</code>), never from 0 or from a "large enough" constant.</li>
<li><strong>Effectiveness is not efficiency</strong>: here it means every step can actually be carried out; whether the algorithm is <em>fast</em> is a different question — the one the ComplexityAnalysis deck answers.</li>
</ul>
<p class="meo">🧠 <strong>Remember the six:</strong> in → out → it stops → each step is clear → each step is doable → it works for every input.</p>
<p class="dap-an">✅ <strong>Answer:</strong> six properties — input (zero or more), output (at least one), finiteness, definiteness, effectiveness and generality. A procedure missing any one of them is not an algorithm: the table gives, for each property, an example that breaks it.</p>
<div class="pitfall">Typical multiple-choice trap: "an algorithm must have at least one input" is <strong>false</strong> (zero or more), while "an algorithm produces at least one output" is <strong>true</strong>. Learn the two numbers exactly.</div>`,
        `<p class="y-chinh">🎯 Sáu tính chất biến một danh sách chỉ dẫn thành giải thuật: đầu vào, đầu ra, tính dừng, tính xác định, tính hiệu quả (thực hiện được) và tính tổng quát.</p>
<table>
<thead><tr><th>Tính chất</th><th>Định nghĩa trên slide</th><th>Ví dụ / phản ví dụ</th></tr></thead>
<tbody>
<tr><td>Input (đầu vào)</td><td>nhận không hoặc nhiều đầu vào</td><td>được phép không có: "in 10 số nguyên tố đầu tiên" không cần đầu vào</td></tr>
<tr><td>Output (đầu ra)</td><td>cho ra ít nhất một đầu ra</td><td>một thủ tục tính toán mà không đưa ra gì thì chẳng giải bài toán nào</td></tr>
<tr><td>Finiteness (tính dừng, tính hữu hạn)</td><td>kết thúc sau một số hữu hạn bước</td><td>✗ <code>while (x != 0) x = x - 2;</code> với x = 5</td></tr>
<tr><td>Definiteness (tính xác định)</td><td>mỗi bước không mơ hồ — không thể hiểu (interpret) theo nhiều cách</td><td>✗ "cho một ít muối", "chọn một số thật lớn"</td></tr>
<tr><td>Effectiveness (tính hiệu quả, thực hiện được)</td><td>gồm các lệnh cơ bản làm được với đầu vào đã cho trong thời gian hữu hạn</td><td>✗ "viết ra mọi chữ số của √2"</td></tr>
<tr><td>Generality (tính tổng quát)</td><td>chạy đúng với cả một lớp đầu vào</td><td>✗ hàm tìm max bắt đầu từ 0, sai với số âm</td></tr>
</tbody>
</table>
<pre><code class="language-java">import java.util.Arrays;

public class GeneralityBug {
    // LỖI: ngầm cho rằng đáp án ít nhất là 0
    static int maxFromZero(int[] a) {
        int max = 0;
        for (int x : a) if (x &gt; max) max = x;
        return max;
    }

    // Đúng với MỌI mảng khác rỗng: bắt đầu từ một phần tử thật
    static int maxFromFirst(int[] a) {
        int max = a[0];
        for (int i = 1; i &lt; a.length; i++) if (a[i] &gt; max) max = a[i];
        return max;
    }

    public static void main(String[] args) {
        int[][] tests = {{3, 8, 5}, {7}, {-5, -2, -9}};
        for (int[] t : tests)
            System.out.println(Arrays.toString(t) + " -&gt; maxFromZero = " + maxFromZero(t) + ", maxFromFirst = " + maxFromFirst(t));

        // Tính dừng: "while (x != 0) x = x - 2" không bao giờ dừng khi x lẻ; ta chặn sau 5 vòng
        int x = 5, rounds = 0;
        while (x != 0 &amp;&amp; rounds &lt; 5) {
            x = x - 2;
            rounds++;
        }
        System.out.println("x = 5, then x = x - 2 five times -&gt; x = " + x + " (it jumped over 0: not finite)");
    }
}</code></pre>
<div class="out">[3, 8, 5] -&gt; maxFromZero = 8, maxFromFirst = 8<br>
[7] -&gt; maxFromZero = 7, maxFromFirst = 7<br>
[-5, -2, -9] -&gt; maxFromZero = 0, maxFromFirst = -2<br>
x = 5, then x = x - 2 five times -&gt; x = -5 (it jumped over 0: not finite)</div>
<ul>
<li>Output cho thấy hai tính chất bị phá: <code>maxFromZero</code> trả 0 cho [-5, -2, -9] — một số thậm chí không có trong mảng (sai tính tổng quát) — còn vòng lặp với x = 5 nhảy qua 0, nếu không bị chặn sẽ chạy mãi (sai tính dừng).</li>
<li>Khởi tạo max bằng một phần tử thật (<code>a[0]</code>), đừng bao giờ bằng 0 hay một hằng số "đủ lớn/đủ nhỏ".</li>
<li><strong>Effectiveness không phải efficiency</strong>: ở đây "tính hiệu quả" nghĩa là mỗi bước <em>làm được</em> thật; còn giải thuật có <em>nhanh</em> hay không (efficiency — hiệu năng) là câu hỏi khác — câu mà bộ slide ComplexityAnalysis trả lời.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ sáu tính chất:</strong> có vào → có ra → biết dừng → bước nào cũng rõ → bước nào cũng làm được → đúng với mọi đầu vào.</p>
<p class="dap-an">✅ <strong>Đáp án:</strong> sáu tính chất — đầu vào (không hoặc nhiều), đầu ra (ít nhất một), tính dừng, tính xác định, tính hiệu quả (thực hiện được) và tính tổng quát. Một thủ tục thiếu bất kỳ tính chất nào thì không phải giải thuật: bảng ở trên cho mỗi tính chất một ví dụ phá vỡ nó.</p>
<div class="pitfall">Bẫy trắc nghiệm hay gặp: "giải thuật phải có ít nhất một đầu vào" là <strong>SAI</strong> (không hoặc nhiều), còn "giải thuật cho ra ít nhất một đầu ra" là <strong>ĐÚNG</strong>. Hãy nhớ chính xác hai con số này.</div>`],
      [8, 'How to represent algorithms?',
        `<p class="y-chinh">🎯 An algorithm can be written in natural language, in a programming language, in pseudocode or as a flowchart; pseudocode and flowcharts sit between the two extremes.</p>
<table>
<thead><tr><th>Form</th><th>What the slide says</th><th>In practice</th></tr></thead>
<tbody>
<tr><td>natural language</td><td>too verbose; too "context-sensitive" — relies on the reader's experience</td><td>fine for a first idea, not precise enough to code from</td></tr>
<tr><td>programming language</td><td>too low level; you must deal with complicated syntax</td><td>the final form — the computer runs it</td></tr>
<tr><td>pseudocode</td><td>natural-language constructs modelled on the statements of many programming languages</td><td>the form of textbooks and exams: precise, and no compiler to please</td></tr>
<tr><td>flowchart</td><td>boxes of various kinds connected by arrows; used to analyse, design, document or manage a process</td><td>shows branches and loops at a glance; bulky for long algorithms</td></tr>
</tbody>
</table>
<ul>
<li><strong>Pseudocode</strong> of this course: <code>x := a</code> (assignment), <code>if … then</code>, <code>for i := 1 to n</code>, <code>while … do</code>, <code>return</code>.</li>
<li><strong>Flowchart</strong> — the usual convention (not stated on this slide): an oval for begin/end, a rectangle for a step, a diamond for a yes/no decision, a parallelogram for input/output, arrows for the order.</li>
<li>Slide 9 writes one algorithm in three of these forms; the ComplexityAnalysis deck analyses algorithms written in pseudocode.</li>
</ul>
<p class="nhan">One step of slide 9, in the four forms</p>
<table>
<thead><tr><th>Natural language</th><th>Pseudocode</th><th>Java</th><th>Flowchart</th></tr></thead>
<tbody>
<tr><td>if b is greater than x, x becomes b</td><td><code>if b &gt; x then x := b</code></td><td><code>if (b &gt; x) x = b;</code></td><td>a decision box <code>b &gt; x ?</code> whose True arrow leads to a box <code>x := b</code></td></tr>
</tbody>
</table>
<p class="meo">🧠 <strong>Remember:</strong> pseudocode for the exam paper, a flowchart for the whiteboard, Java for the machine.</p>
<p class="dap-an">✅ <strong>Answer:</strong> in four ways — natural language, a programming language, pseudocode and flowcharts. For designing and for exams, pseudocode and flowcharts are preferred: natural language is too vague and context-dependent, a programming language too detailed; pseudocode keeps the precision without the syntax, and a flowchart shows the branches at a glance.</p>
<div class="pitfall">In the course's pseudocode, <code>x := a</code> is an <strong>assignment</strong> and <code>if key = ai</code> is a <strong>comparison</strong>. In Java, assignment is <code>=</code> and comparison is <code>==</code> — translate carefully; <code>if (x = 5)</code> does not even compile for an <code>int</code> x.</div>`,
        `<p class="y-chinh">🎯 Một giải thuật có thể viết bằng ngôn ngữ tự nhiên, bằng ngôn ngữ lập trình, bằng mã giả hoặc bằng lưu đồ; mã giả và lưu đồ nằm ở giữa hai thái cực.</p>
<table>
<thead><tr><th>Cách viết</th><th>Slide nói gì</th><th>Thực tế</th></tr></thead>
<tbody>
<tr><td>ngôn ngữ tự nhiên (natural language)</td><td>quá dài dòng (verbose); quá "phụ thuộc ngữ cảnh" (context-sensitive) — dựa vào kinh nghiệm người đọc</td><td>ổn để phác ý tưởng, chưa đủ chính xác để code theo</td></tr>
<tr><td>ngôn ngữ lập trình (programming language)</td><td>quá chi tiết, "cấp thấp" (low level); phải vật lộn với cú pháp (syntax) phức tạp</td><td>dạng cuối cùng — máy tính chạy được</td></tr>
<tr><td>mã giả (pseudocode)</td><td>dùng cấu trúc ngôn ngữ tự nhiên nhưng viết giống câu lệnh của nhiều ngôn ngữ lập trình</td><td>dạng dùng trong sách và đề thi: chính xác, không cần chiều trình biên dịch</td></tr>
<tr><td>lưu đồ (flowchart)</td><td>các loại hộp nối nhau bằng mũi tên; dùng để phân tích, thiết kế, viết tài liệu hay quản lý một quy trình</td><td>thấy ngay các nhánh và vòng lặp; cồng kềnh với giải thuật dài</td></tr>
</tbody>
</table>
<ul>
<li><strong>Mã giả (pseudocode)</strong> của môn: <code>x := a</code> (phép gán), <code>if … then</code> (nếu … thì), <code>for i := 1 to n</code> (cho i từ 1 tới n), <code>while … do</code> (trong khi … làm), <code>return</code> (trả về).</li>
<li><strong>Lưu đồ (flowchart)</strong> — quy ước thường dùng (slide này không nêu): hình bầu dục cho bắt đầu/kết thúc, hình chữ nhật cho một bước xử lý, hình thoi cho một quyết định có/không, hình bình hành cho nhập/xuất, mũi tên cho thứ tự.</li>
<li>Slide 9 viết một giải thuật theo ba trong bốn cách này; bộ slide ComplexityAnalysis phân tích các giải thuật viết bằng mã giả.</li>
</ul>
<p class="nhan">Một bước của slide 9, viết theo cả bốn cách</p>
<table>
<thead><tr><th>Ngôn ngữ tự nhiên</th><th>Mã giả</th><th>Java</th><th>Lưu đồ</th></tr></thead>
<tbody>
<tr><td>nếu b lớn hơn x thì x lấy giá trị b</td><td><code>if b &gt; x then x := b</code></td><td><code>if (b &gt; x) x = b;</code></td><td>một ô quyết định <code>b &gt; x ?</code> có mũi tên True (đúng) dẫn tới ô <code>x := b</code></td></tr>
</tbody>
</table>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> mã giả để viết trên giấy thi, lưu đồ để vẽ lên bảng, Java để máy chạy.</p>
<p class="dap-an">✅ <strong>Đáp án:</strong> có bốn cách — ngôn ngữ tự nhiên, ngôn ngữ lập trình, mã giả và lưu đồ. Khi thiết kế và khi đi thi, người ta chuộng mã giả và lưu đồ: ngôn ngữ tự nhiên quá mơ hồ và phụ thuộc ngữ cảnh, ngôn ngữ lập trình thì quá chi tiết; mã giả giữ được độ chính xác mà bỏ được cú pháp, còn lưu đồ cho thấy ngay các nhánh rẽ.</p>
<div class="pitfall">Trong mã giả của môn, <code>x := a</code> là <strong>phép gán</strong> còn <code>if key = ai</code> là <strong>phép so sánh</strong>. Trong Java, gán là <code>=</code> còn so sánh là <code>==</code> — chuyển sang Java phải cẩn thận; <code>if (x = 5)</code> với x kiểu <code>int</code> thậm chí không biên dịch được.</div>`],
      [9, 'Algorithm representation examples',
        `<p class="y-chinh">🎯 One algorithm — find the greatest of three numbers, max(a, b, c) — written three ways: in natural language, in pseudocode and as a flowchart.</p>
<ul>
<li><strong>Natural language</strong> (slide): assign x = a; if b is greater than x, assign x = b; if c is greater than x, assign x = c; the result x is max(a, b, c).</li>
<li><strong>Pseudocode</strong> (slide): <code>function max(a,b,c)</code> — Input: a, b, c — Output: max(a,b,c) — <code>x = a; if b &gt; x then x = b; if c &gt; x then x = c; return x;</code> — here <code>=</code> assigns; the flowchart writes the same step as <code>x := a</code>.</li>
<li><strong>Flowchart</strong>: redrawn below in text from the labels on the slide (begin, <code>x := a</code>, <code>b &gt; x</code>, <code>x := b</code>, <code>c &gt; x</code>, <code>x := c</code>, True/False, end) — compare it with the picture. The branch labels in the slide's text read True, False, True, True; in a correct flowchart every decision has exactly one True exit and one False exit, so check the arrows on the picture.</li>
</ul>
<pre><code class="language-plaintext">    begin
      |
      v
   x := a
      |
      v
+-----------+  True
|  b &gt; x ?  |---------&gt; x := b
+-----------+              |
      | False              |
      v                    |
      +&lt;-------------------+
      |
      v
+-----------+  True
|  c &gt; x ?  |---------&gt; x := c
+-----------+              |
      | False              |
      v                    |
      +&lt;-------------------+
      |
      v
     end          (the result is x)</code></pre>
<p class="nhan">Trace for (a, b, c) = (3, 7, 5)</p>
<table>
<thead><tr><th>Step</th><th>Box</th><th>Test</th><th>x after the step</th></tr></thead>
<tbody>
<tr><td>1</td><td><code>x := a</code></td><td>—</td><td>3</td></tr>
<tr><td>2</td><td><code>b &gt; x ?</code></td><td>7 &gt; 3 → True, so <code>x := b</code></td><td>7</td></tr>
<tr><td>3</td><td><code>c &gt; x ?</code></td><td>5 &gt; 7 → False</td><td>7</td></tr>
<tr><td>4</td><td>end</td><td>—</td><td>7 = max(3, 7, 5)</td></tr>
</tbody>
</table>
<pre><code class="language-java">public class Max3 {
    // The slide's pseudocode, line by line: x = a; if b &gt; x then x = b; if c &gt; x then x = c; return x
    static int max(int a, int b, int c) {
        int x = a;
        if (b &gt; x) x = b;
        if (c &gt; x) x = c;
        return x;
    }

    // A version that "looks right" but hides a bug (watch the ties)
    static int maxBuggy(int a, int b, int c) {
        if (a &gt; b &amp;&amp; a &gt; c) return a;
        if (b &gt; a &amp;&amp; b &gt; c) return b;
        return c;
    }

    public static void main(String[] args) {
        int[][] tests = {{3, 7, 5}, {9, 2, 4}, {1, 2, 3}, {-4, -9, -1}, {5, 5, 2}};
        for (int[] t : tests) {
            int good = max(t[0], t[1], t[2]);
            int bad = maxBuggy(t[0], t[1], t[2]);
            System.out.println("max(" + t[0] + ", " + t[1] + ", " + t[2] + ") = " + good
                    + "   maxBuggy = " + bad + (good == bad ? "" : "   &lt;-- WRONG"));
        }
    }
}</code></pre>
<div class="out">max(3, 7, 5) = 7 &nbsp;&nbsp;maxBuggy = 7<br>
max(9, 2, 4) = 9 &nbsp;&nbsp;maxBuggy = 9<br>
max(1, 2, 3) = 3 &nbsp;&nbsp;maxBuggy = 3<br>
max(-4, -9, -1) = -1 &nbsp;&nbsp;maxBuggy = -1<br>
max(5, 5, 2) = 5 &nbsp;&nbsp;maxBuggy = 2 &nbsp;&nbsp;&lt;-- WRONG</div>
<p><strong>Big-O:</strong> always exactly 2 comparisons → O(1). For n numbers, the same "best so far" idea needs n − 1 comparisons → O(n) — the max example on slide 35 of the ComplexityAnalysis deck.</p>
<div class="pitfall"><code>maxBuggy</code> requires the winner to be strictly greater than <em>both</em> others; with a tie at the top, e.g. (5, 5, 2), neither test is true and it returns c = 2. The slide's "keep the best so far in x" pattern has no such hole — and <code>Math.max(a, Math.max(b, c))</code> is the one-line Java version.</div>`,
        `<p class="y-chinh">🎯 Một giải thuật — tìm số lớn nhất trong ba số, max(a, b, c) — viết theo ba cách: ngôn ngữ tự nhiên, mã giả (pseudocode) và lưu đồ (flowchart).</p>
<ul>
<li><strong>Ngôn ngữ tự nhiên</strong> (slide): gán x = a; nếu b lớn hơn x thì gán x = b; nếu c lớn hơn x thì gán x = c; kết quả x chính là max(a, b, c). ("great than" trên slide là viết nhầm của "greater than" — lớn hơn.)</li>
<li><strong>Mã giả</strong> (slide): <code>function max(a,b,c)</code> — Input (đầu vào): a, b, c — Output (đầu ra): max(a,b,c) — <code>x = a; if b &gt; x then x = b; if c &gt; x then x = c; return x;</code> — ở đây <code>=</code> là phép gán; lưu đồ viết cùng bước đó là <code>x := a</code>.</li>
<li><strong>Lưu đồ</strong>: vẽ lại bằng chữ bên dưới từ các nhãn có trên slide (begin — bắt đầu, <code>x := a</code>, <code>b &gt; x</code>, <code>x := b</code>, <code>c &gt; x</code>, <code>x := c</code>, True/False — đúng/sai, end — kết thúc); hãy đối chiếu với hình. Các nhãn nhánh trong chữ của slide là True, False, True, True; lưu đồ đúng thì mỗi ô quyết định có đúng một lối ra True và một lối ra False, nên hãy kiểm tra các mũi tên trên hình.</li>
</ul>
<pre><code class="language-plaintext">    begin
      |
      v
   x := a
      |
      v
+-----------+  True
|  b &gt; x ?  |---------&gt; x := b
+-----------+              |
      | False              |
      v                    |
      +&lt;-------------------+
      |
      v
+-----------+  True
|  c &gt; x ?  |---------&gt; x := c
+-----------+              |
      | False              |
      v                    |
      +&lt;-------------------+
      |
      v
     end          (kết quả là x)</code></pre>
<p class="nhan">Lần theo (trace) với (a, b, c) = (3, 7, 5)</p>
<table>
<thead><tr><th>Bước</th><th>Ô</th><th>Phép thử</th><th>x sau bước</th></tr></thead>
<tbody>
<tr><td>1</td><td><code>x := a</code></td><td>—</td><td>3</td></tr>
<tr><td>2</td><td><code>b &gt; x ?</code></td><td>7 &gt; 3 → True (đúng), nên <code>x := b</code></td><td>7</td></tr>
<tr><td>3</td><td><code>c &gt; x ?</code></td><td>5 &gt; 7 → False (sai)</td><td>7</td></tr>
<tr><td>4</td><td>end</td><td>—</td><td>7 = max(3, 7, 5)</td></tr>
</tbody>
</table>
<pre><code class="language-java">public class Max3 {
    // Mã giả của slide, từng dòng: x = a; if b &gt; x then x = b; if c &gt; x then x = c; return x
    static int max(int a, int b, int c) {
        int x = a;
        if (b &gt; x) x = b;
        if (c &gt; x) x = c;
        return x;
    }

    // Một bản "trông đúng" nhưng giấu lỗi (để ý trường hợp bằng nhau)
    static int maxBuggy(int a, int b, int c) {
        if (a &gt; b &amp;&amp; a &gt; c) return a;
        if (b &gt; a &amp;&amp; b &gt; c) return b;
        return c;
    }

    public static void main(String[] args) {
        int[][] tests = {{3, 7, 5}, {9, 2, 4}, {1, 2, 3}, {-4, -9, -1}, {5, 5, 2}};
        for (int[] t : tests) {
            int good = max(t[0], t[1], t[2]);
            int bad = maxBuggy(t[0], t[1], t[2]);
            System.out.println("max(" + t[0] + ", " + t[1] + ", " + t[2] + ") = " + good
                    + "   maxBuggy = " + bad + (good == bad ? "" : "   &lt;-- WRONG"));
        }
    }
}</code></pre>
<div class="out">max(3, 7, 5) = 7 &nbsp;&nbsp;maxBuggy = 7<br>
max(9, 2, 4) = 9 &nbsp;&nbsp;maxBuggy = 9<br>
max(1, 2, 3) = 3 &nbsp;&nbsp;maxBuggy = 3<br>
max(-4, -9, -1) = -1 &nbsp;&nbsp;maxBuggy = -1<br>
max(5, 5, 2) = 5 &nbsp;&nbsp;maxBuggy = 2 &nbsp;&nbsp;&lt;-- WRONG</div>
<p><strong>Big-O</strong> (ký hiệu O lớn): luôn đúng 2 phép so sánh → O(1). Với n số, cùng ý tưởng "giữ số lớn nhất tới giờ" cần n − 1 phép so sánh → O(n) — chính là ví dụ max ở slide 35 của bộ slide ComplexityAnalysis.</p>
<div class="pitfall"><code>maxBuggy</code> đòi số thắng phải lớn hơn hẳn <em>cả hai</em> số kia; khi hai số lớn nhất bằng nhau, ví dụ (5, 5, 2), không phép thử nào đúng và hàm trả về c = 2. Cách "giữ số lớn nhất tới giờ trong x" của slide không có lỗ hổng đó — còn <code>Math.max(a, Math.max(b, c))</code> là bản Java một dòng.</div>`],
      [10, 'Data Structures and Algorithms',
        `<p class="y-chinh">🎯 Most algorithms work on collections of data, so we first define a Collection ADT — the operations it offers (constructor/destructor, add, edit, delete, find, sort, …) — and only then choose how to store it.</p>
<ul>
<li><strong>ADT</strong> (abstract data type) = <em>what</em> the collection can do, not <em>how</em>. In Java an ADT is written as an <code>interface</code> (like <code>List</code>), and each way of storing it is a class (like <code>ArrayList</code>, <code>LinkedList</code>).</li>
<li><strong>Constructor</strong> creates an empty collection. <strong>Destructor</strong>: languages such as C++ free the memory explicitly; Java has no destructor — an object that nothing refers to any more is reclaimed by the garbage collector, and a <code>clear()</code> method empties the collection.</li>
<li><strong>Add / Edit / Delete</strong> change the contents, <strong>Find</strong> searches, <strong>Sort</strong> reorders; the "…" stands for more, such as <code>size()</code>, <code>isEmpty()</code> or a traversal.</li>
</ul>
<p class="nhan">The lesson's own Collection ADT, stored in an array — each call of the program below</p>
<table>
<thead><tr><th>Call</th><th>Contents after the call</th><th>Cost, and why</th></tr></thead>
<tbody>
<tr><td><code>new MyCollection()</code></td><td>[]</td><td>O(1)</td></tr>
<tr><td><code>add</code> 40, 10, 30, 20</td><td>[40, 10, 30, 20]</td><td>O(1) amortized each — the array doubles when full</td></tr>
<tr><td><code>edit(1, 15)</code></td><td>[40, 15, 30, 20]</td><td>O(1) — direct index</td></tr>
<tr><td><code>find(30)</code> → 2, <code>find(99)</code> → -1</td><td>unchanged</td><td>O(n) — looks at the elements one by one</td></tr>
<tr><td><code>delete(40)</code></td><td>[15, 30, 20]</td><td>O(n) — find it, then shift the rest left</td></tr>
<tr><td><code>sort()</code></td><td>[15, 20, 30]</td><td>O(n²) — insertion sort; Chapter 6 reaches O(n log n)</td></tr>
<tr><td><code>clear()</code></td><td>[]</td><td>O(1)</td></tr>
</tbody>
</table>
<pre><code class="language-java">import java.util.Arrays;

// A Collection ADT stored in an array (slide 10: constructor, add, edit, delete, find, sort)
class MyCollection {
    private int[] a;
    private int n;                                  // number of elements in use

    MyCollection() { a = new int[2]; n = 0; }       // constructor: an empty collection

    void add(int x) {                               // add at the end; double the array when it is full
        if (n == a.length) a = Arrays.copyOf(a, 2 * a.length);
        a[n++] = x;
    }

    boolean edit(int i, int x) {                    // replace the element at index i
        if (i &lt; 0 || i &gt;= n) return false;
        a[i] = x;
        return true;
    }

    int find(int x) {                               // linear search: an index, or -1
        for (int i = 0; i &lt; n; i++) if (a[i] == x) return i;
        return -1;
    }

    boolean delete(int x) {                         // remove the first x, shift the rest left
        int i = find(x);
        if (i &lt; 0) return false;
        for (int j = i; j &lt; n - 1; j++) a[j] = a[j + 1];
        n--;
        return true;
    }

    void sort() {                                   // insertion sort (Chapter 6)
        for (int i = 1; i &lt; n; i++) {
            int key = a[i], j = i - 1;
            while (j &gt;= 0 &amp;&amp; a[j] &gt; key) { a[j + 1] = a[j]; j--; }
            a[j + 1] = key;
        }
    }

    void clear() { n = 0; }                         // no destructor in Java: forget the elements, the GC does the rest

    public String toString() { return Arrays.toString(Arrays.copyOf(a, n)); }
}

public class MyCollectionDemo {
    public static void main(String[] args) {
        MyCollection c = new MyCollection();
        System.out.println("new MyCollection() -&gt; " + c);
        for (int x : new int[] {40, 10, 30, 20}) c.add(x);
        System.out.println("add 40, 10, 30, 20 -&gt; " + c);
        c.edit(1, 15);
        System.out.println("edit(1, 15)        -&gt; " + c);
        System.out.println("find(30) = " + c.find(30) + ", find(99) = " + c.find(99));
        c.delete(40);
        System.out.println("delete(40)         -&gt; " + c);
        c.sort();
        System.out.println("sort()             -&gt; " + c);
        c.clear();
        System.out.println("clear()            -&gt; " + c);
    }
}</code></pre>
<div class="out">new MyCollection() -&gt; []<br>
add 40, 10, 30, 20 -&gt; [40, 10, 30, 20]<br>
edit(1, 15) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; [40, 15, 30, 20]<br>
find(30) = 2, find(99) = -1<br>
delete(40) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; [15, 30, 20]<br>
sort() &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; [15, 20, 30]<br>
clear() &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; []</div>
<p class="meo">🧠 <strong>Remember:</strong> the rest of the course is this table again and again — the same ADT, different storage, different costs: find is O(n) here, O(log n) in a balanced search tree (Chapter 4), O(1) on average in a hash table (Chapter 7).</p>
<div class="pitfall">Setting a reference to <code>null</code> does not destroy the object at that moment: the garbage collector reclaims it later, and only when no reference to it is left. Java has no <code>delete</code> or <code>free</code>.</div>`,
        `<p class="y-chinh">🎯 Phần lớn giải thuật làm việc trên tập hợp dữ liệu (data collection), nên trước hết ta định nghĩa ADT Collection (kiểu dữ liệu trừu tượng "tập hợp") — các thao tác nó cung cấp (hàm dựng/hàm huỷ, thêm, sửa, xoá, tìm, sắp xếp, …) — rồi mới chọn cách lưu trữ.</p>
<ul>
<li><strong>ADT</strong> (abstract data type — kiểu dữ liệu trừu tượng) = tập hợp <em>làm được gì</em>, không nói <em>làm thế nào</em>. Trong Java, ADT được viết thành một <code>interface</code> (giao diện, như <code>List</code>), còn mỗi cách lưu là một lớp (như <code>ArrayList</code>, <code>LinkedList</code>).</li>
<li><strong>Constructor</strong> (hàm dựng) tạo một tập rỗng. <strong>Destructor</strong> (hàm huỷ): các ngôn ngữ như C++ tự tay giải phóng bộ nhớ; Java không có hàm huỷ — đối tượng không còn ai tham chiếu tới sẽ được bộ dọn rác (garbage collector) thu hồi, còn hàm <code>clear()</code> dùng để làm rỗng tập hợp.</li>
<li><strong>Add / Edit / Delete</strong> (thêm / sửa / xoá) thay đổi nội dung, <strong>Find</strong> (tìm) để tìm kiếm, <strong>Sort</strong> (sắp xếp) để sắp lại thứ tự; dấu "…" nghĩa là còn nữa, như <code>size()</code> (kích thước), <code>isEmpty()</code> (có rỗng không) hay duyệt (traverse) qua các phần tử.</li>
</ul>
<p class="nhan">ADT Collection của bài, lưu bằng mảng — từng lời gọi trong chương trình bên dưới</p>
<table>
<thead><tr><th>Lời gọi</th><th>Nội dung sau lời gọi</th><th>Chi phí, và vì sao</th></tr></thead>
<tbody>
<tr><td><code>new MyCollection()</code></td><td>[]</td><td>O(1)</td></tr>
<tr><td><code>add</code> 40, 10, 30, 20</td><td>[40, 10, 30, 20]</td><td>mỗi lần O(1) khấu hao (amortized) — mảng đầy thì nhân đôi</td></tr>
<tr><td><code>edit(1, 15)</code></td><td>[40, 15, 30, 20]</td><td>O(1) — truy cập thẳng theo chỉ số</td></tr>
<tr><td><code>find(30)</code> → 2, <code>find(99)</code> → -1</td><td>không đổi</td><td>O(n) — xem lần lượt từng phần tử</td></tr>
<tr><td><code>delete(40)</code></td><td>[15, 30, 20]</td><td>O(n) — tìm nó, rồi dời phần sau sang trái</td></tr>
<tr><td><code>sort()</code></td><td>[15, 20, 30]</td><td>O(n²) — sắp xếp chèn (insertion sort); Chương 6 đạt O(n log n)</td></tr>
<tr><td><code>clear()</code></td><td>[]</td><td>O(1)</td></tr>
</tbody>
</table>
<pre><code class="language-java">import java.util.Arrays;

// ADT Collection lưu bằng mảng (slide 10: hàm dựng, add, edit, delete, find, sort)
class MyCollection {
    private int[] a;
    private int n;                                  // số phần tử đang có

    MyCollection() { a = new int[2]; n = 0; }       // hàm dựng: một tập rỗng

    void add(int x) {                               // thêm vào cuối; mảng đầy thì nhân đôi
        if (n == a.length) a = Arrays.copyOf(a, 2 * a.length);
        a[n++] = x;
    }

    boolean edit(int i, int x) {                    // thay phần tử ở chỉ số i
        if (i &lt; 0 || i &gt;= n) return false;
        a[i] = x;
        return true;
    }

    int find(int x) {                               // tìm tuần tự: trả về chỉ số, hoặc -1
        for (int i = 0; i &lt; n; i++) if (a[i] == x) return i;
        return -1;
    }

    boolean delete(int x) {                         // xoá x đầu tiên, dời phần sau sang trái
        int i = find(x);
        if (i &lt; 0) return false;
        for (int j = i; j &lt; n - 1; j++) a[j] = a[j + 1];
        n--;
        return true;
    }

    void sort() {                                   // sắp xếp chèn (Chương 6)
        for (int i = 1; i &lt; n; i++) {
            int key = a[i], j = i - 1;
            while (j &gt;= 0 &amp;&amp; a[j] &gt; key) { a[j + 1] = a[j]; j--; }
            a[j + 1] = key;
        }
    }

    void clear() { n = 0; }                         // Java không có hàm huỷ: "quên" các phần tử, bộ dọn rác lo phần còn lại

    public String toString() { return Arrays.toString(Arrays.copyOf(a, n)); }
}

public class MyCollectionDemo {
    public static void main(String[] args) {
        MyCollection c = new MyCollection();
        System.out.println("new MyCollection() -&gt; " + c);
        for (int x : new int[] {40, 10, 30, 20}) c.add(x);
        System.out.println("add 40, 10, 30, 20 -&gt; " + c);
        c.edit(1, 15);
        System.out.println("edit(1, 15)        -&gt; " + c);
        System.out.println("find(30) = " + c.find(30) + ", find(99) = " + c.find(99));
        c.delete(40);
        System.out.println("delete(40)         -&gt; " + c);
        c.sort();
        System.out.println("sort()             -&gt; " + c);
        c.clear();
        System.out.println("clear()            -&gt; " + c);
    }
}</code></pre>
<div class="out">new MyCollection() -&gt; []<br>
add 40, 10, 30, 20 -&gt; [40, 10, 30, 20]<br>
edit(1, 15) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; [40, 15, 30, 20]<br>
find(30) = 2, find(99) = -1<br>
delete(40) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; [15, 30, 20]<br>
sort() &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; [15, 20, 30]<br>
clear() &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; []</div>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> phần còn lại của môn học là bảng này lặp đi lặp lại — cùng một ADT, cách lưu khác, chi phí khác: tìm kiếm là O(n) ở đây, O(log n) trong cây tìm kiếm cân bằng (Chương 4), O(1) trung bình trong bảng băm (Chương 7).</p>
<div class="pitfall">Gán một tham chiếu bằng <code>null</code> không huỷ đối tượng ngay lúc đó: bộ dọn rác thu hồi nó sau, và chỉ khi không còn tham chiếu nào trỏ tới nó. Java không có <code>delete</code> hay <code>free</code>.</div>`],
    ]),
    bi(`<h3>✅ Check yourself in 60 seconds</h3>
<ol>
<li><code>while (x != 0) x = x - 2;</code> with x = 7 — which property of an algorithm is broken?</li>
<li>"Choose a suitable number and add it to x" — which property is broken?</li>
<li>True or false: every algorithm has at least one input.</li>
<li>What does the pseudocode <code>x := a; if b &gt; x then x := b; if c &gt; x then x := c</code> give for (4, 9, 9)?</li>
<li>Who wrote "Algorithms + Data Structures = Programs", and what does it mean?</li>
</ol>
<p class="dap-an">✅ <strong>Answers:</strong> (1) finiteness — x goes 7, 5, 3, 1, −1, … and never equals 0. (2) definiteness — "suitable" can be understood in many ways. (3) false: zero or more inputs; it is the <em>output</em> that must be at least one. (4) 9 — <code>b &gt; x</code> (9 &gt; 4) sets x = 9, then <code>c &gt; x</code> (9 &gt; 9) is false. (5) Niklaus Wirth: a program is the organisation of its data plus the steps that work on it, designed together.</p>
<p><strong>Next:</strong> lessons 0.C and 0.D — the ComplexityAnalysis deck (how "efficient" is measured: counting operations, best/worst/average case, Big-O); lesson 0.3 (Big-O in one page); then lesson 0.5 to practise counting operations in Java.</p>`,
    `<h3>✅ Tự kiểm tra trong 60 giây</h3>
<ol>
<li><code>while (x != 0) x = x - 2;</code> với x = 7 — tính chất nào của giải thuật bị phá?</li>
<li>"Chọn một số thích hợp rồi cộng vào x" — tính chất nào bị phá?</li>
<li>Đúng hay sai: giải thuật nào cũng có ít nhất một đầu vào.</li>
<li>Mã giả <code>x := a; if b &gt; x then x := b; if c &gt; x then x := c</code> cho kết quả gì với (4, 9, 9)?</li>
<li>Ai viết "Algorithms + Data Structures = Programs" (Giải thuật + Cấu trúc dữ liệu = Chương trình), và câu đó nghĩa là gì?</li>
</ol>
<p class="dap-an">✅ <strong>Đáp án:</strong> (1) tính dừng (finiteness) — x đi 7, 5, 3, 1, −1, … và không bao giờ bằng 0. (2) tính xác định (definiteness) — "thích hợp" có thể hiểu theo nhiều cách. (3) sai: không hoặc nhiều đầu vào; chính <em>đầu ra</em> mới phải có ít nhất một. (4) 9 — <code>b &gt; x</code> (9 &gt; 4) gán x = 9, rồi <code>c &gt; x</code> (9 &gt; 9) sai. (5) Niklaus Wirth: một chương trình là cách tổ chức dữ liệu cộng với các bước xử lý dữ liệu đó, thiết kế cùng nhau.</p>
<p><strong>Học tiếp:</strong> bài 0.C và 0.D — bộ slide ComplexityAnalysis (đo "hiệu quả" thế nào: đếm số phép toán, trường hợp tốt nhất/xấu nhất/trung bình, Big-O — ký hiệu O lớn); bài 0.3 (Big-O gói trong một trang); rồi bài 0.5 để luyện đếm số phép toán bằng Java.</p>`),
    books([
      ['goodrich', "Opening of Ch.4 Algorithm Analysis, p.149 — the book's own definitions of data structure and algorithm · §1.9 Software Development, p.46 — pseudocode · §2.1 Goals, Principles, and Patterns, p.60 — abstraction and abstract data types", 'Phần mở đầu Chương 4 Algorithm Analysis, tr.149 — định nghĩa cấu trúc dữ liệu và giải thuật của sách · §1.9 Software Development, tr.46 — mã giả · §2.1 Goals, Principles, and Patterns, tr.60 — trừu tượng hoá và kiểu dữ liệu trừu tượng'],
    ]),
  ].join('\n'),
};

/* ───────── 0.C — 📑 Slide by slide · Complexity analysis, part 1: running time & Big-O (ComplexityAnalysis, slides 1–23) ───────── */
const L_csd3_1 = {
  title: '0.C — 📑 Slide by slide · Complexity analysis, part 1: running time & Big-O (ComplexityAnalysis, slides 1–23)|||0.C — 📑 Học theo từng slide · Phân tích độ phức tạp, phần 1: thời gian chạy & Big-O (ComplexityAnalysis, slide 1–23)',
  slug: 'csd201-slide-csd3-1',
  type: 'VIDEO',
  isFreePreview: true,
  description: 'Giảng từng slide 1–23 của bộ ComplexityAnalysis: thuật toán là gì, yêu cầu của thuật toán tốt, độ phức tạp tính toán, thời gian chạy và ba trường hợp tốt nhất/trung bình/xấu nhất, đo giờ thực nghiệm và giới hạn của nó, mã giả, đếm phép toán cơ bản, tốc độ tăng, định nghĩa Big-O — 13 chương trình Java (12 có output thật).',
  content: [
    bi(`<span class="eyebrow">Section 0 · Lesson 0.C · ComplexityAnalysis, slides 1–23</span>
<h2>Complexity analysis, part 1 — running time and Big-O, slide by slide</h2>
<p class="lead">This deck is marked "for reading": it gives you the language every later chapter uses to compare data structures — how the work grows with the input size n, written in Big-O. Part 1 goes from "what is an algorithm" through experiments, counting primitive operations and growth rates to the definition of Big-O. Part 2 (lesson 0.D) covers the rules, the classic examples, amortized cost and NP. Every slide has its key idea, a plain explanation, runnable Java that counts instead of guessing, and the exam traps.</p>
<div class="callout"><strong>Where it sits in the syllabus:</strong> complexity is not a CLO of its own — the course description asks you to understand "the connection between data structures and their algorithms, including an analysis of algorithms' complexity", and then every chapter uses it: the oral questions ask for the complexity of AVL search (CQ6.3), of selection/insertion/bubble sort (CQ14.1), of brute-force and KMP matching (CQ18.2–18.3). In the FE and in job interviews you will be asked again and again "what is the Big-O of this code, and why?" — this deck is where the "why" comes from.</div>
<h3>The whole of part 1 in one table</h3>
<table>
<thead><tr><th>Idea</th><th>In one line</th><th>Slides</th></tr></thead>
<tbody>
<tr><td>Algorithm</td><td>a finite sequence of precise steps turning an input into an output</td><td>3</td></tr>
<tr><td>Good algorithm</td><td>correct, simple, and efficient in time and memory</td><td>4</td></tr>
<tr><td>Complexity</td><td>how much time (or memory) an algorithm needs as the input grows</td><td>5</td></tr>
<tr><td>Running time</td><td>grows with n; for the same n it depends on the input → best / average / worst case</td><td>6, 11</td></tr>
<tr><td>Experiments</td><td>implement, run, time — results depend on machine, language and the inputs chosen</td><td>7–10</td></tr>
<tr><td>Theoretical analysis</td><td>count primitive operations in pseudocode as a function f(n)</td><td>12–16</td></tr>
<tr><td>Growth rate</td><td>a·f(n) ≤ T(n) ≤ b·f(n): hardware changes a and b, never the growth rate</td><td>17–19</td></tr>
<tr><td>Big-O</td><td>f(n) is O(g(n)) if f(n) ≤ c·g(n) for every n ≥ n0 — an upper bound on growth</td><td>20–23</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Mục 0 · Bài 0.C · ComplexityAnalysis, slide 1–23</span>
<h2>Phân tích độ phức tạp, phần 1 — thời gian chạy và Big-O, học từng slide</h2>
<p class="lead">Bộ slide này ghi "for reading" (để tự đọc): nó cho bạn thứ ngôn ngữ mà mọi chương sau dùng để so sánh các cấu trúc dữ liệu — khối lượng công việc tăng thế nào theo kích thước đầu vào n, viết bằng ký hiệu Big-O (ký hiệu O lớn). Phần 1 đi từ "thuật toán là gì" qua đo đạc thực nghiệm, đếm phép toán cơ bản, tốc độ tăng, tới định nghĩa Big-O. Phần 2 (bài 0.D) là các quy tắc, các ví dụ kinh điển, chi phí khấu hao và NP. Slide nào cũng có ý chính, lời giải thích dễ hiểu, code Java chạy được để đếm thay vì đoán, và các bẫy hay gặp khi thi.</p>
<div class="callout"><strong>Vị trí trong syllabus (đề cương môn học):</strong> độ phức tạp không phải một CLO (chuẩn đầu ra) riêng — phần mô tả môn học yêu cầu hiểu "mối liên hệ giữa cấu trúc dữ liệu và thuật toán của chúng, kể cả phân tích độ phức tạp của thuật toán", rồi chương nào cũng dùng tới: các câu hỏi vấn đáp hỏi độ phức tạp của tìm kiếm trên cây AVL (CQ6.3), của các thuật toán sắp xếp selection/insertion/bubble sort (sắp xếp chọn/chèn/nổi bọt — CQ14.1), của so khớp vét cạn và KMP (CQ18.2–18.3). Ở FE (thi cuối kỳ) và khi phỏng vấn xin việc, bạn sẽ bị hỏi đi hỏi lại "đoạn code này Big-O bao nhiêu, vì sao?" — bộ slide này chính là nơi trả lời chữ "vì sao".</div>
<h3>Cả phần 1 trong một bảng</h3>
<table>
<thead><tr><th>Ý</th><th>Nói gọn một dòng</th><th>Slide</th></tr></thead>
<tbody>
<tr><td>Thuật toán (algorithm)</td><td>dãy hữu hạn các bước chính xác, biến đầu vào thành đầu ra</td><td>3</td></tr>
<tr><td>Thuật toán tốt</td><td>đúng, đơn giản, tiết kiệm thời gian và bộ nhớ</td><td>4</td></tr>
<tr><td>Độ phức tạp (complexity)</td><td>thuật toán cần bao nhiêu thời gian (hoặc bộ nhớ) khi đầu vào lớn dần</td><td>5</td></tr>
<tr><td>Thời gian chạy (running time)</td><td>tăng theo n; cùng n thì còn tuỳ đầu vào → trường hợp tốt nhất / trung bình / xấu nhất</td><td>6, 11</td></tr>
<tr><td>Thực nghiệm (experiment)</td><td>cài đặt, chạy, bấm giờ — kết quả phụ thuộc máy, ngôn ngữ và bộ đầu vào đã chọn</td><td>7–10</td></tr>
<tr><td>Phân tích lý thuyết</td><td>đếm phép toán cơ bản trên mã giả, thành một hàm f(n)</td><td>12–16</td></tr>
<tr><td>Tốc độ tăng (growth rate)</td><td>a·f(n) ≤ T(n) ≤ b·f(n): phần cứng chỉ đổi a và b, không bao giờ đổi tốc độ tăng</td><td>17–19</td></tr>
<tr><td>Big-O</td><td>f(n) là O(g(n)) nếu f(n) ≤ c·g(n) với mọi n ≥ n0 — một cận trên của tốc độ tăng</td><td>20–23</td></tr>
</tbody>
</table>`),
    walkHead('csd3', 1, 23),
    walk('csd3', [
      [1, 'Complexity Analysis (For reading)',
        `<p class="y-chinh">🎯 The cover of the complexity-analysis deck — "for reading" means it is meant to be studied on your own, and what it teaches is used in every chapter after it.</p>
<p>Every structure in CSD201 is judged by one question: when the data grows, how fast does the work grow? This deck gives you the tools to answer it — counting operations and Big-O.</p>`,
        `<p class="y-chinh">🎯 Trang bìa bộ slide phân tích độ phức tạp (complexity analysis) — dòng "for reading" nghĩa là bộ này dành để tự đọc, và kiến thức của nó được dùng ở mọi chương phía sau.</p>
<p>Mọi cấu trúc trong CSD201 đều được đánh giá bằng một câu hỏi: dữ liệu tăng thì khối lượng công việc tăng nhanh cỡ nào? Bộ slide này cho bạn công cụ để trả lời — đếm số phép toán và ký hiệu Big-O (ký hiệu O lớn).</p>`],
      [2, 'Objectives',
        `<p class="y-chinh">🎯 Four goals: measure an algorithm's cost, describe it with asymptotic notation (O, Ω, Θ), tell apart the best, average and worst cases, and meet the hardest family of problems (NP-complete).</p>
<ol>
<li><strong>Computational and asymptotic complexity</strong> — what "cost" means and why we care only about large n (slides 3–19).</li>
<li><strong>Big-O, Big-Ω and Big-Θ</strong> — upper, lower and tight bounds on growth (slides 20–32; Ω and Θ are in lesson 0.D).</li>
<li><strong>Best, average and worst cases</strong> — inputs of the same size can cost very different amounts (slides 6, 11, 33–37), plus the amortized cost of a whole sequence of operations (38–40).</li>
<li><strong>NP-completeness</strong> — problems nobody knows how to solve fast, although a proposed answer can be checked fast (slides 41–46).</li>
</ol>
<p><strong>Asymptotic</strong> means "as n grows towards infinity": we describe the trend of the cost, not an exact number of microseconds.</p>
<p class="meo">🧠 <strong>Remember:</strong> count the steps, keep the dominant term — that is the whole method.</p>`,
        `<p class="y-chinh">🎯 Bốn mục tiêu: đo chi phí của thuật toán, mô tả nó bằng ký hiệu tiệm cận (O, Ω, Θ), phân biệt trường hợp tốt nhất, trung bình và xấu nhất, và làm quen với họ bài toán khó nhất (NP-đầy đủ — NP-complete).</p>
<ol>
<li><strong>Độ phức tạp tính toán và độ phức tạp tiệm cận (computational and asymptotic complexity)</strong> — "chi phí" là gì và vì sao ta chỉ quan tâm khi n lớn (slide 3–19).</li>
<li><strong>Big-O, Big-Ω và Big-Θ (O lớn, Omega lớn, Theta lớn)</strong> — cận trên, cận dưới và cận chặt của tốc độ tăng (slide 20–32; Ω và Θ nằm ở bài 0.D).</li>
<li><strong>Trường hợp tốt nhất, trung bình, xấu nhất (best, average, worst case)</strong> — các đầu vào cùng kích thước có thể tốn chi phí rất khác nhau (slide 6, 11, 33–37), thêm chi phí khấu hao (amortized cost) của cả một dãy thao tác (38–40).</li>
<li><strong>NP-đầy đủ (NP-completeness)</strong> — những bài toán chưa ai biết cách giải nhanh, dù kiểm tra một đáp án được đưa ra thì nhanh (slide 41–46).</li>
</ol>
<p><strong>Tiệm cận (asymptotic)</strong> nghĩa là "khi n tăng dần tới vô cùng": ta mô tả xu hướng của chi phí, không phải con số micro-giây chính xác.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> đếm số bước, giữ lại số hạng trội — cả phương pháp chỉ có vậy.</p>`],
      [3, 'Simple definition of an algorithm',
        `<p class="y-chinh">🎯 An algorithm is a finite sequence of precise steps that turns an input into the required output in a finite amount of time.</p>
<p class="ghi-chu">This slide is mainly a picture; only its title could be extracted. The explanation below teaches the definition the title names, with the lesson's own example.</p>
<pre><code class="language-plaintext">    input                    algorithm                    output
[7, 3, 9, 2]  ---&gt;  step 1, step 2, ..., stop  ---&gt;      9
                  (precise steps, finitely many)</code></pre>
<ul>
<li><strong>Input and output</strong>: zero or more inputs, at least one output — here an array goes in and its largest value comes out.</li>
<li><strong>Precise (definite)</strong>: every step means exactly one thing; "pick a big number" is not a step, "compare <code>a[i]</code> with <code>max</code>" is.</li>
<li><strong>Finite</strong>: it stops after a finite number of steps for every input — a loop that never ends is not an algorithm.</li>
<li><strong>Effective</strong>: each step is simple enough to be carried out, by hand or by a machine.</li>
</ul>
<p>A program is an algorithm written in a programming language; the same algorithm can be written in Java, in C or in pseudocode (slide 13).</p>
<p class="meo">🧠 <strong>Remember:</strong> a cooking recipe is an algorithm — ingredients in, dish out, every step clear, and it ends.</p>`,
        `<p class="y-chinh">🎯 Thuật toán (algorithm) là một dãy hữu hạn các bước chính xác, biến đầu vào (input) thành đầu ra (output) cần có trong một khoảng thời gian hữu hạn.</p>
<p class="ghi-chu">Slide này chủ yếu là hình; chữ trích được chỉ có tiêu đề. Phần dưới giảng đúng định nghĩa mà tiêu đề nêu, bằng ví dụ của bài.</p>
<pre><code class="language-plaintext">   đầu vào                   thuật toán                   đầu ra
[7, 3, 9, 2]  ---&gt;  bước 1, bước 2, ..., dừng  ---&gt;      9
                (các bước chính xác, hữu hạn bước)</code></pre>
<ul>
<li><strong>Đầu vào và đầu ra</strong>: không hoặc nhiều đầu vào, ít nhất một đầu ra — ở đây một mảng đi vào, giá trị lớn nhất của nó đi ra.</li>
<li><strong>Chính xác (definite)</strong>: mỗi bước chỉ có đúng một nghĩa; "chọn một số to to" không phải là một bước, "so sánh <code>a[i]</code> với <code>max</code>" mới là một bước.</li>
<li><strong>Hữu hạn (finite)</strong>: với mọi đầu vào, nó dừng sau một số hữu hạn bước — vòng lặp chạy mãi không phải là thuật toán.</li>
<li><strong>Khả thi (effective)</strong>: mỗi bước đủ đơn giản để thực hiện được, bằng tay hay bằng máy.</li>
</ul>
<p>Chương trình (program) là thuật toán được viết bằng một ngôn ngữ lập trình; cùng một thuật toán có thể viết bằng Java, bằng C hay bằng mã giả (pseudocode, slide 13).</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> công thức nấu ăn là một thuật toán — nguyên liệu vào, món ăn ra, bước nào cũng rõ ràng, và có lúc kết thúc.</p>`],
      [4, 'Analysis of Algorithms',
        `<p class="y-chinh">🎯 A good algorithm must be precise (correct), simple, and effective — cheap in running time and in memory; analysing an algorithm means checking these requirements.</p>
<table>
<thead><tr><th>Requirement on the slide</th><th>What it means</th><th>How you check it</th></tr></thead>
<tbody>
<tr><td>Precision — proved by mathematics</td><td>the algorithm gives the right output for every valid input</td><td>a proof (induction, a loop invariant…)</td></tr>
<tr><td>Precision — implementation and test</td><td>the code really behaves as the proof says</td><td>run it on many inputs, edge cases included</td></tr>
<tr><td>Simple and public</td><td>easy to understand and to share, so that others can check and reuse it</td><td>clear pseudocode, code review</td></tr>
<tr><td>Effectiveness — run time duration</td><td>time complexity: how the number of steps grows with n</td><td>count operations → Big-O (this deck)</td></tr>
<tr><td>Effectiveness — memory space</td><td>space complexity: how the extra memory grows with n</td><td>count extra cells and objects → Big-O</td></tr>
</tbody>
</table>
<ul>
<li>Correctness comes first: a fast algorithm that returns a wrong answer is worthless.</li>
<li>Tests can reveal bugs but never prove there are none — that is why the slide lists "proved by mathematics" as well.</li>
<li>This deck concentrates on <strong>time</strong>; space is analysed the same way, counting extra memory instead of steps.</li>
</ul>
<p class="dap-an">✅ <strong>Answer — what are the requirements for a good algorithm?</strong> (1) Precision: it is correct — proved mathematically, and confirmed by implementation and tests. (2) Simplicity: clear enough for others to read, verify and reuse. (3) Effectiveness: low time complexity and low space complexity.</p>
<div class="pitfall">Time and memory often trade against each other: keeping extra data (a table, a copy) can make an algorithm faster but costs space. A statement such as "the fastest algorithm is always the best one" is false — the right choice depends on the requirements.</div>`,
        `<p class="y-chinh">🎯 Thuật toán tốt phải chính xác (đúng), đơn giản và hiệu quả — ít tốn thời gian chạy và bộ nhớ; phân tích thuật toán (analysis of algorithms) là kiểm tra các yêu cầu này.</p>
<table>
<thead><tr><th>Yêu cầu trên slide</th><th>Nghĩa là gì</th><th>Kiểm tra bằng cách nào</th></tr></thead>
<tbody>
<tr><td>Chính xác (precision) — chứng minh bằng toán học</td><td>thuật toán cho kết quả đúng với mọi đầu vào hợp lệ</td><td>một chứng minh (quy nạp, bất biến vòng lặp…)</td></tr>
<tr><td>Chính xác — cài đặt và kiểm thử (implementation and test)</td><td>code thật sự chạy đúng như chứng minh nói</td><td>chạy trên thật nhiều đầu vào, kể cả trường hợp biên</td></tr>
<tr><td>Đơn giản và công khai (simple and public)</td><td>dễ hiểu, dễ chia sẻ, để người khác kiểm tra và dùng lại được</td><td>mã giả rõ ràng, đọc chéo code (code review)</td></tr>
<tr><td>Hiệu quả (effectiveness) — thời gian chạy</td><td>độ phức tạp thời gian (time complexity): số bước tăng thế nào theo n</td><td>đếm phép toán → Big-O (ký hiệu O lớn — bộ slide này)</td></tr>
<tr><td>Hiệu quả — bộ nhớ</td><td>độ phức tạp không gian (space complexity): bộ nhớ phụ tăng thế nào theo n</td><td>đếm số ô nhớ, số đối tượng phụ → Big-O</td></tr>
</tbody>
</table>
<ul>
<li>Đúng là trên hết: thuật toán nhanh mà trả lời sai thì vô giá trị.</li>
<li>Kiểm thử chỉ có thể tìm ra lỗi, không bao giờ chứng minh được là hết lỗi — vì vậy slide ghi thêm "chứng minh bằng toán học".</li>
<li>Bộ slide này tập trung vào <strong>thời gian</strong>; không gian phân tích y như vậy, chỉ là đếm bộ nhớ phụ thay vì đếm bước.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án — thuật toán tốt cần những yêu cầu gì?</strong> (1) Chính xác: cho kết quả đúng — chứng minh bằng toán học, và được xác nhận bằng cài đặt và kiểm thử. (2) Đơn giản: đủ rõ để người khác đọc, kiểm tra và dùng lại. (3) Hiệu quả: độ phức tạp thời gian thấp và độ phức tạp không gian thấp.</p>
<div class="pitfall">Thời gian và bộ nhớ hay "đổi chác" cho nhau: giữ thêm dữ liệu (một bảng, một bản sao) có thể làm thuật toán nhanh hơn nhưng tốn chỗ. Câu kiểu "thuật toán nhanh nhất luôn là thuật toán tốt nhất" là SAI — chọn cái nào còn tuỳ yêu cầu bài toán.</div>`],
      [5, 'What is a computational complexity?',
        `<p class="y-chinh">🎯 Computational complexity measures how many resources — mainly time, sometimes memory — an algorithm needs, so that two algorithms computing the same result can be compared.</p>
<ul>
<li>The same problem can be solved by several algorithms that differ in efficiency: below, both compute 1 + 2 + … + n.</li>
<li>"Complex" here means "expensive to run", not "hard to read" — which is why we usually speak of <strong>efficiency</strong>.</li>
<li>Of the several possible measures, the deck focuses on one: <strong>computation time</strong>.</li>
</ul>
<pre><code class="language-java">public class SumTwoWays {
    static long ops;                                  // arithmetic operations counted

    // Algorithm 1: add 1, 2, ..., n one by one
    static long sumLoop(long n) {
        long s = 0;
        for (long i = 1; i &lt;= n; i++) {
            s += i;
            ops++;                                    // one addition per turn
        }
        return s;
    }

    // Algorithm 2: Gauss's formula n(n+1)/2
    static long sumFormula(long n) {
        ops += 3;                                     // one +, one *, one /
        return n * (n + 1) / 2;
    }

    public static void main(String[] args) {
        for (long n : new long[] {10, 1000, 1000000}) {
            ops = 0;
            long s1 = sumLoop(n);
            long opsLoop = ops;
            ops = 0;
            long s2 = sumFormula(n);
            System.out.println("n = " + n + ": loop -&gt; " + s1 + " (" + opsLoop + " ops), formula -&gt; " + s2 + " (" + ops + " ops)");
        }
    }
}</code></pre>
<div class="out">n = 10: loop -&gt; 55 (10 ops), formula -&gt; 55 (3 ops)<br>
n = 1000: loop -&gt; 500500 (1000 ops), formula -&gt; 500500 (3 ops)<br>
n = 1000000: loop -&gt; 500000500000 (1000000 ops), formula -&gt; 500000500000 (3 ops)</div>
<p>The loop needs n additions — a million for n = 1,000,000 — while the formula always needs 3 operations, whatever n is. Same answer, very different cost.</p>
<p class="dap-an">✅ <strong>Answer — can wall-clock time on two different machines tell which algorithm is more efficient?</strong> No. The measured time mixes the speed of the machine (CPU, operating system, compiler, other running programs) with the efficiency of the algorithm, so a slow algorithm on a fast machine can "win". A fair comparison needs the same machine, language and inputs — or, better, a measure that does not depend on any machine: the number of operations (slides 10–11).</p>
<div class="pitfall">"Program A ran in 2 s on my laptop and program B in 5 s on the lab PC, so A is more efficient" — wrong reasoning, and a typical wrong option in the FE.</div>`,
        `<p class="y-chinh">🎯 Độ phức tạp tính toán (computational complexity) đo xem thuật toán cần bao nhiêu tài nguyên (resource) — chủ yếu là thời gian, đôi khi là bộ nhớ — để có thể so sánh hai thuật toán cùng tính ra một kết quả.</p>
<ul>
<li>Cùng một bài toán có thể giải bằng nhiều thuật toán có hiệu quả khác nhau: dưới đây cả hai đều tính 1 + 2 + … + n.</li>
<li>"Phức tạp" ở đây nghĩa là "tốn kém khi chạy", không phải "khó đọc" — vì vậy người ta hay nói tới <strong>hiệu quả (efficiency)</strong>.</li>
<li>Trong nhiều thước đo có thể dùng, bộ slide chỉ tập trung vào một: <strong>thời gian tính toán (computation time)</strong>.</li>
</ul>
<pre><code class="language-java">public class SumTwoWays {
    static long ops;                                  // số phép toán số học đã đếm

    // Thuật toán 1: cộng lần lượt 1, 2, ..., n
    static long sumLoop(long n) {
        long s = 0;
        for (long i = 1; i &lt;= n; i++) {
            s += i;
            ops++;                                    // mỗi vòng một phép cộng
        }
        return s;
    }

    // Thuật toán 2: công thức Gauss n(n+1)/2
    static long sumFormula(long n) {
        ops += 3;                                     // một phép +, một phép *, một phép /
        return n * (n + 1) / 2;
    }

    public static void main(String[] args) {
        for (long n : new long[] {10, 1000, 1000000}) {
            ops = 0;
            long s1 = sumLoop(n);
            long opsLoop = ops;
            ops = 0;
            long s2 = sumFormula(n);
            System.out.println("n = " + n + ": loop -&gt; " + s1 + " (" + opsLoop + " ops), formula -&gt; " + s2 + " (" + ops + " ops)");
        }
    }
}</code></pre>
<div class="out">n = 10: loop -&gt; 55 (10 ops), formula -&gt; 55 (3 ops)<br>
n = 1000: loop -&gt; 500500 (1000 ops), formula -&gt; 500500 (3 ops)<br>
n = 1000000: loop -&gt; 500000500000 (1000000 ops), formula -&gt; 500000500000 (3 ops)</div>
<p>Vòng lặp cần n phép cộng — một triệu phép với n = 1.000.000 — còn công thức lúc nào cũng chỉ cần 3 phép toán, n bao nhiêu cũng vậy. Cùng đáp số, chi phí khác hẳn nhau.</p>
<p class="dap-an">✅ <strong>Đáp án — thời gian đồng hồ thực (wall-clock time) đo trên hai máy khác nhau có cho biết thuật toán nào hiệu quả hơn không?</strong> Không. Thời gian đo được trộn lẫn tốc độ của máy (CPU, hệ điều hành, trình biên dịch, các chương trình khác đang chạy) với hiệu quả của thuật toán, nên thuật toán chậm chạy trên máy nhanh vẫn có thể "thắng". So sánh công bằng cần cùng máy, cùng ngôn ngữ, cùng đầu vào — hoặc tốt hơn, một thước đo không phụ thuộc máy nào cả: số phép toán (slide 10–11).</p>
<div class="pitfall">"Chương trình A chạy 2 giây trên laptop của tôi, chương trình B chạy 5 giây trên máy phòng lab, vậy A hiệu quả hơn" — lập luận sai, và là kiểu phương án nhiễu hay gặp trong FE (thi cuối kỳ).</div>`],
      [6, 'Running time',
        `<p class="y-chinh">🎯 The running time of an algorithm grows with the size of its input, and for the same size it depends on which input you give it — so we speak of best, average and worst case, and usually report the worst.</p>
<p class="ghi-chu">This slide is mainly a picture; only its title could be extracted. The explanation below teaches running time with the lesson's own example.</p>
<ul>
<li><strong>Input size n</strong>: the number of elements, characters, vertices… whatever makes the input "bigger".</li>
<li><strong>Best case</strong>: the luckiest input of size n; <strong>worst case</strong>: the unluckiest; <strong>average case</strong>: the mean over all inputs of size n — it needs an assumption about how likely each input is.</li>
<li>We usually report the <strong>worst case</strong>: it is easier to analyse than the average, and it is a guarantee — the program is never slower than that.</li>
</ul>
<p class="nhan">The lesson's example — linear search among n odd numbers, counting comparisons</p>
<pre><code class="language-java">public class RunningTime {
    static int comparisons;                           // how many times a[i] == key was tested

    static int linearSearch(int[] a, int key) {
        for (int i = 0; i &lt; a.length; i++) {
            comparisons++;
            if (a[i] == key) return i;
        }
        return -1;
    }

    public static void main(String[] args) {
        for (int n : new int[] {10, 100, 1000}) {
            int[] a = new int[n];
            for (int i = 0; i &lt; n; i++) a[i] = 2 * i + 1;          // 1, 3, 5, ... (all odd)
            comparisons = 0;
            linearSearch(a, 1);                                    // key is the first element
            int best = comparisons;
            comparisons = 0;
            linearSearch(a, 0);                                    // key is missing
            int worst = comparisons;
            long total = 0;
            for (int i = 0; i &lt; n; i++) {                          // search every element once
                comparisons = 0;
                linearSearch(a, a[i]);
                total += comparisons;
            }
            System.out.println("n = " + n + ": best = " + best + ", average = " + (double) total / n + ", worst = " + worst);
        }
    }
}</code></pre>
<div class="out">n = 10: best = 1, average = 5.5, worst = 10<br>
n = 100: best = 1, average = 50.5, worst = 100<br>
n = 1000: best = 1, average = 500.5, worst = 1000</div>
<p>The best case stays 1 for every n, the worst case equals n, and the average (the key equally likely to be any element) is (n + 1)/2 — all three computed by the program, not guessed.</p>
<p class="meo">🧠 <strong>Remember:</strong> the worst case is the promise you can write into a contract; the best case is the lucky day you cannot count on.</p>`,
        `<p class="y-chinh">🎯 Thời gian chạy (running time) của thuật toán tăng theo kích thước đầu vào, và với cùng kích thước thì còn tuỳ bạn đưa đầu vào nào — nên ta nói tới trường hợp tốt nhất, trung bình, xấu nhất, và thường báo cáo trường hợp xấu nhất.</p>
<p class="ghi-chu">Slide này chủ yếu là hình; chữ trích được chỉ có tiêu đề. Phần dưới giảng thời gian chạy bằng ví dụ của bài.</p>
<ul>
<li><strong>Kích thước đầu vào (input size) n</strong>: số phần tử, số ký tự, số đỉnh… bất cứ thứ gì làm đầu vào "to ra".</li>
<li><strong>Trường hợp tốt nhất (best case)</strong>: đầu vào cỡ n may mắn nhất; <strong>xấu nhất (worst case)</strong>: xui nhất; <strong>trung bình (average case)</strong>: giá trị trung bình trên mọi đầu vào cỡ n — muốn tính phải giả định mỗi đầu vào xuất hiện với khả năng bao nhiêu.</li>
<li>Ta thường báo cáo <strong>trường hợp xấu nhất</strong>: nó dễ phân tích hơn trường hợp trung bình, và là một lời bảo đảm — chương trình không bao giờ chậm hơn mức đó.</li>
</ul>
<p class="nhan">Ví dụ của bài — tìm tuần tự (linear search) trong n số lẻ, đếm số lần so sánh</p>
<pre><code class="language-java">public class RunningTime {
    static int comparisons;                           // số lần đã so sánh a[i] == key

    static int linearSearch(int[] a, int key) {
        for (int i = 0; i &lt; a.length; i++) {
            comparisons++;
            if (a[i] == key) return i;
        }
        return -1;
    }

    public static void main(String[] args) {
        for (int n : new int[] {10, 100, 1000}) {
            int[] a = new int[n];
            for (int i = 0; i &lt; n; i++) a[i] = 2 * i + 1;          // 1, 3, 5, ... (toàn số lẻ)
            comparisons = 0;
            linearSearch(a, 1);                                    // khoá là phần tử đầu tiên
            int best = comparisons;
            comparisons = 0;
            linearSearch(a, 0);                                    // khoá không có trong mảng
            int worst = comparisons;
            long total = 0;
            for (int i = 0; i &lt; n; i++) {                          // tìm lần lượt từng phần tử
                comparisons = 0;
                linearSearch(a, a[i]);
                total += comparisons;
            }
            System.out.println("n = " + n + ": best = " + best + ", average = " + (double) total / n + ", worst = " + worst);
        }
    }
}</code></pre>
<div class="out">n = 10: best = 1, average = 5.5, worst = 10<br>
n = 100: best = 1, average = 50.5, worst = 100<br>
n = 1000: best = 1, average = 500.5, worst = 1000</div>
<p>Trường hợp tốt nhất luôn là 1 dù n bao nhiêu, xấu nhất bằng đúng n, còn trung bình (khoá cần tìm có khả năng như nhau là bất kỳ phần tử nào) là (n + 1)/2 — cả ba đều do chương trình đếm ra, không phải đoán.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> trường hợp xấu nhất là lời hứa dám ghi vào hợp đồng; trường hợp tốt nhất là ngày may mắn không thể trông vào.</p>`],
      [7, 'Experimental Studies',
        `<p class="y-chinh">🎯 An experimental study measures running time for real: implement the algorithm, run it on inputs of different sizes, record the times and look at how they grow.</p>
<p class="ghi-chu">This slide is mainly a picture; only its title could be extracted. The steps below are the standard method the title names; slide 8 is the deck's own example program.</p>
<ol>
<li><strong>Implement</strong> the algorithm as a complete program.</li>
<li><strong>Choose inputs</strong> of increasing size n (for example 1,000, 2,000, 4,000, …) and of different kinds (sorted, random, reversed).</li>
<li><strong>Measure</strong>: read the clock just before and just after the work — in Java <code>System.currentTimeMillis()</code> or <code>System.nanoTime()</code>; slide 8 uses <code>Calendar</code>.</li>
<li><strong>Repeat</strong> every run several times and keep the average, because other programs on the machine disturb a single measurement.</li>
<li><strong>Plot</strong> time against n and look at the shape: a straight line (linear), a parabola (quadratic)…</li>
</ol>
<p>This is how engineers benchmark real systems, so it is worth knowing — but slides 9–10 explain why it cannot be the main tool for comparing algorithms.</p>`,
        `<p class="y-chinh">🎯 Nghiên cứu thực nghiệm (experimental study) đo thời gian chạy thật: cài đặt thuật toán, chạy với các đầu vào kích thước khác nhau, ghi lại thời gian và xem chúng tăng ra sao.</p>
<p class="ghi-chu">Slide này chủ yếu là hình; chữ trích được chỉ có tiêu đề. Các bước dưới đây là phương pháp chuẩn mà tiêu đề nói tới; slide 8 là chương trình ví dụ của chính bộ slide.</p>
<ol>
<li><strong>Cài đặt (implement)</strong> thuật toán thành một chương trình hoàn chỉnh.</li>
<li><strong>Chọn đầu vào</strong> có kích thước n tăng dần (ví dụ 1.000, 2.000, 4.000, …) và thuộc nhiều loại (đã sắp xếp, ngẫu nhiên, đảo ngược).</li>
<li><strong>Đo (measure)</strong>: đọc đồng hồ ngay trước và ngay sau phần việc — trong Java dùng <code>System.currentTimeMillis()</code> hoặc <code>System.nanoTime()</code>; slide 8 dùng <code>Calendar</code>.</li>
<li><strong>Lặp lại</strong> mỗi lần chạy vài lượt rồi lấy trung bình, vì các chương trình khác trên máy làm nhiễu một lần đo đơn lẻ.</li>
<li><strong>Vẽ đồ thị (plot)</strong> thời gian theo n rồi nhìn hình dạng: đường thẳng (tuyến tính), đường parabol (bậc hai)…</li>
</ol>
<p>Kỹ sư vẫn đo hiệu năng (benchmark) các hệ thống thật theo cách này, nên rất đáng biết — nhưng slide 9–10 giải thích vì sao nó không thể là công cụ chính để so sánh thuật toán.</p>`],
      [8, 'Experimental Study Example',
        `<p class="y-chinh">🎯 The slide's program times two nested loops of n = 10,000 turns each by reading the clock before and after them — a complete, tiny experimental study.</p>
<pre><code class="language-java">import java.util.Calendar;

// The slide's program: statements unchanged; only indentation and comments added
public class Main
{ public static void main(String[] args)
  { long beginTimes = Calendar.getInstance().getTimeInMillis();   // clock reading before
    long n = 10000;
    for (long i=0; i&lt;n;++i)
      for(long j =0; j&lt;n; ++j);                                   // the ';' is an EMPTY body
    long endTimes = Calendar.getInstance().getTimeInMillis();     // clock reading after
    System.out.println("The times in ms for run the program are:");
    System.out.println(endTimes - beginTimes);                    // differs on every machine and run
  }
}</code></pre>
<ul>
<li><code>Calendar.getInstance().getTimeInMillis()</code> reads the current time in milliseconds; <code>endTimes - beginTimes</code> is the elapsed time.</li>
<li>The <code>;</code> right after the inner <code>for(...)</code> is an <strong>empty body</strong>: the loops do nothing but count, 10,000 × 10,000 = 10<sup>8</sup> times.</li>
<li>Its statements compile and run unchanged — only comments were added, and the file is saved as <code>Main.java</code>, the name its public class requires. Its output is <strong>not shown here on purpose</strong>: the number of milliseconds differs from machine to machine and even from run to run — try it yourself.</li>
<li>Java's JIT compiler is even allowed to remove a loop whose body does nothing, so the time may say little about the loop itself.</li>
</ul>
<p>What stays the same everywhere is the <strong>amount of work</strong>. This program counts it instead of timing it:</p>
<pre><code class="language-java">public class CountLoop {
    public static void main(String[] args) {
        for (long n = 10; n &lt;= 10000; n *= 10) {
            long count = 0;
            for (long i = 0; i &lt; n; ++i)
                for (long j = 0; j &lt; n; ++j)
                    count++;                          // the slide's empty body, now counted
            System.out.println("n = " + n + " -&gt; the inner body runs " + count + " times");
        }
    }
}</code></pre>
<div class="out">n = 10 -&gt; the inner body runs 100 times<br>
n = 100 -&gt; the inner body runs 10000 times<br>
n = 1000 -&gt; the inner body runs 1000000 times<br>
n = 10000 -&gt; the inner body runs 100000000 times</div>
<p>Ten times more n gives a hundred times more work: the count is exactly n², on any machine. Slides 10–11 build on exactly this idea.</p>
<div class="pitfall">In your own code, <code>for (int i = 0; i &lt; n; i++);</code> followed by a block runs the loop with an empty body and then the block <strong>once</strong>. On the slide the <code>;</code> is intentional; in a PE it is a classic silent bug.</div>`,
        `<p class="y-chinh">🎯 Chương trình trên slide bấm giờ hai vòng lặp lồng nhau, mỗi vòng n = 10.000 lượt, bằng cách đọc đồng hồ trước và sau — một nghiên cứu thực nghiệm nhỏ mà đủ bước.</p>
<pre><code class="language-java">import java.util.Calendar;

// Chương trình của slide: giữ nguyên các lệnh; chỉ canh lề lại và thêm chú thích
public class Main
{ public static void main(String[] args)
  { long beginTimes = Calendar.getInstance().getTimeInMillis();   // đọc đồng hồ trước
    long n = 10000;
    for (long i=0; i&lt;n;++i)
      for(long j =0; j&lt;n; ++j);                                   // dấu ';' là thân vòng lặp RỖNG
    long endTimes = Calendar.getInstance().getTimeInMillis();     // đọc đồng hồ sau
    System.out.println("The times in ms for run the program are:");
    System.out.println(endTimes - beginTimes);                    // mỗi máy, mỗi lần chạy một khác
  }
}</code></pre>
<ul>
<li><code>Calendar.getInstance().getTimeInMillis()</code> đọc thời điểm hiện tại tính bằng mili-giây; <code>endTimes - beginTimes</code> là thời gian đã trôi qua.</li>
<li>Dấu <code>;</code> ngay sau <code>for(...)</code> bên trong là một <strong>thân vòng lặp rỗng (empty body)</strong>: hai vòng lặp không làm gì ngoài đếm, 10.000 × 10.000 = 10<sup>8</sup> lần.</li>
<li>Các lệnh biên dịch và chạy được nguyên văn — chỉ thêm chú thích, và file được lưu thành <code>Main.java</code>, đúng tên mà lớp public (công khai) của nó đòi hỏi. Output (kết quả in ra) <strong>cố ý không in ở đây</strong>: số mili-giây mỗi máy một khác, thậm chí mỗi lần chạy một khác — hãy tự chạy thử.</li>
<li>Trình biên dịch JIT (just-in-time — biên dịch ngay lúc chương trình chạy) của Java thậm chí được phép bỏ hẳn một vòng lặp có thân không làm gì, nên con số đo được có khi chẳng nói lên gì về chính vòng lặp.</li>
</ul>
<p>Thứ giữ nguyên ở mọi máy là <strong>khối lượng công việc</strong>. Chương trình dưới đây đếm nó thay vì bấm giờ:</p>
<pre><code class="language-java">public class CountLoop {
    public static void main(String[] args) {
        for (long n = 10; n &lt;= 10000; n *= 10) {
            long count = 0;
            for (long i = 0; i &lt; n; ++i)
                for (long j = 0; j &lt; n; ++j)
                    count++;                          // thân rỗng của slide, giờ được đếm
            System.out.println("n = " + n + " -&gt; the inner body runs " + count + " times");
        }
    }
}</code></pre>
<div class="out">n = 10 -&gt; the inner body runs 100 times<br>
n = 100 -&gt; the inner body runs 10000 times<br>
n = 1000 -&gt; the inner body runs 1000000 times<br>
n = 10000 -&gt; the inner body runs 100000000 times</div>
<p>n lớn gấp mười thì công việc gấp một trăm: số đếm đúng bằng n², trên bất kỳ máy nào. Slide 10–11 xây tiếp đúng trên ý này.</p>
<div class="pitfall">Trong code của bạn, <code>for (int i = 0; i &lt; n; i++);</code> rồi tới một khối lệnh sẽ chạy vòng lặp với thân rỗng, sau đó chạy khối lệnh <strong>đúng một lần</strong>. Trên slide dấu <code>;</code> là cố ý; trong bài PE (thi thực hành) nó là lỗi âm thầm kinh điển.</div>`],
      [9, 'Limitations of Experiments',
        `<p class="y-chinh">🎯 Experiments have three big limitations: you must implement the algorithm first, you can only try a limited set of inputs, and two algorithms can be compared only on the same hardware and software.</p>
<p class="ghi-chu">This slide is mainly a picture; only its title could be extracted. The three limitations below are the standard ones behind this title.</p>
<table>
<thead><tr><th>Limitation</th><th>Why it hurts</th></tr></thead>
<tbody>
<tr><td>Must implement it first</td><td>writing and debugging the code costs time — and you wanted to know whether the idea deserves to be coded at all</td></tr>
<tr><td>Limited set of inputs</td><td>the inputs you try may miss the worst case (a reversed array, a missing key…), so the measurement can be too optimistic</td></tr>
<tr><td>Same environment needed</td><td>a result on one CPU, OS, JVM and language says little about another; background programs, caches and the JIT add noise</td></tr>
</tbody>
</table>
<ul>
<li>The same program can print different times on two runs on the same machine (slide 8), so one measurement proves nothing.</li>
<li>Timing is still useful — to tune a finished program, or to confirm what the analysis predicts.</li>
<li>To compare <em>algorithms</em> we need a method that works on paper, for all inputs, independent of any machine: theoretical analysis (slide 12).</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> a stopwatch measures the runner and the track together — you cannot tell which of the two was fast.</p>`,
        `<p class="y-chinh">🎯 Thực nghiệm có ba giới hạn lớn: phải cài đặt thuật toán trước, chỉ thử được một số đầu vào hữu hạn, và chỉ so sánh được hai thuật toán khi chạy trên cùng phần cứng, phần mềm.</p>
<p class="ghi-chu">Slide này chủ yếu là hình; chữ trích được chỉ có tiêu đề. Ba giới hạn dưới đây là các giới hạn chuẩn ứng với tiêu đề này.</p>
<table>
<thead><tr><th>Giới hạn (limitation)</th><th>Vì sao gây hại</th></tr></thead>
<tbody>
<tr><td>Phải cài đặt trước</td><td>viết và gỡ lỗi code tốn thời gian — trong khi điều bạn muốn biết là ý tưởng có đáng để code hay không</td></tr>
<tr><td>Bộ đầu vào có hạn</td><td>các đầu vào bạn thử có thể bỏ sót trường hợp xấu nhất (mảng đảo ngược, khoá không có…), nên kết quả đo có thể lạc quan quá mức</td></tr>
<tr><td>Phải cùng môi trường</td><td>kết quả trên một CPU, một hệ điều hành, một máy ảo Java (JVM), một ngôn ngữ nói được rất ít về môi trường khác; chương trình chạy ngầm, bộ nhớ đệm (cache) và trình biên dịch JIT (biên dịch lúc chạy) còn gây nhiễu</td></tr>
</tbody>
</table>
<ul>
<li>Cùng một chương trình có thể in ra hai thời gian khác nhau ở hai lần chạy trên cùng một máy (slide 8), nên một lần đo không chứng minh được gì.</li>
<li>Bấm giờ vẫn có ích — để tinh chỉnh một chương trình đã xong, hoặc để xác nhận điều mà phân tích đã dự đoán.</li>
<li>Muốn so sánh <em>thuật toán</em>, ta cần một phương pháp làm được trên giấy, cho mọi đầu vào, không phụ thuộc máy nào: phân tích lý thuyết (theoretical analysis, slide 12).</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> đồng hồ bấm giờ đo chung cả vận động viên lẫn đường chạy — không biết được ai trong hai thứ đó mới là "nhanh".</p>`],
      [10, 'Time complexity of an algorithm (1)',
        `<p class="y-chinh">🎯 Running time depends on four things — input size, computing system, programming language and state of the data — so we need a measure that ignores the machine and the language but keeps the input.</p>
<ol>
<li><strong>Size of the input</strong> (n): more data, more work — this one we keep.</li>
<li><strong>Computing system</strong>: operating system, CPU speed, how long each kind of statement takes — we remove it.</li>
<li><strong>Programming language</strong>: Java, C and Python run the same steps at different speeds — we remove it.</li>
<li><strong>State of the data</strong>: already sorted, reversed, random… — we keep it, as best / average / worst case.</li>
</ol>
<p class="nhan">The lesson's example — same algorithm (insertion sort), same n = 8, same machine; only the state of the data changes</p>
<pre><code class="language-java">import java.util.Arrays;

public class StateOfData {
    static int comparisons;                           // how many times a[j] &gt; key was tested

    // Insertion sort: slide each element left past the bigger ones
    static void insertionSort(int[] a) {
        for (int i = 1; i &lt; a.length; i++) {
            int key = a[i], j = i - 1;
            while (j &gt;= 0) {
                comparisons++;
                if (a[j] &lt;= key) break;                // found its place
                a[j + 1] = a[j];                       // shift the bigger one right
                j--;
            }
            a[j + 1] = key;
        }
    }

    static void run(String state, int[] a) {
        comparisons = 0;
        String before = Arrays.toString(a);
        insertionSort(a);
        System.out.println(state + before + " -&gt; " + comparisons + " comparisons");
    }

    public static void main(String[] args) {
        // same algorithm, same size n = 8, same machine: only the state of the data changes
        run("already sorted ", new int[] {1, 2, 3, 4, 5, 6, 7, 8});
        run("mixed          ", new int[] {5, 2, 7, 1, 8, 3, 6, 4});
        run("reversed       ", new int[] {8, 7, 6, 5, 4, 3, 2, 1});
    }
}</code></pre>
<div class="out">already sorted [1, 2, 3, 4, 5, 6, 7, 8] -&gt; 7 comparisons<br>
mixed &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[5, 2, 7, 1, 8, 3, 6, 4] -&gt; 18 comparisons<br>
reversed &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[8, 7, 6, 5, 4, 3, 2, 1] -&gt; 28 comparisons</div>
<p>Insertion sort slides each element left past the bigger ones. On sorted data every element stops at once (7 comparisons); on reversed data every element travels all the way (1 + 2 + … + 7 = 28 comparisons).</p>
<p>Counting operations, as the program does, gives the same numbers on any machine and in any language — exactly the independence the slide asks for.</p>
<div class="pitfall">FE question type: "Which factor does time-complexity analysis deliberately leave out?" → the computer and the programming language. The input size, and the state of the data (through the three cases), stay in.</div>`,
        `<p class="y-chinh">🎯 Thời gian chạy phụ thuộc bốn thứ — kích thước đầu vào, hệ thống máy tính, ngôn ngữ lập trình và trạng thái dữ liệu — nên ta cần một thước đo bỏ qua máy và ngôn ngữ nhưng giữ lại đầu vào.</p>
<ol>
<li><strong>Kích thước đầu vào (size of data input)</strong> n: nhiều dữ liệu thì nhiều việc — thứ này ta giữ.</li>
<li><strong>Hệ thống máy tính (computing system)</strong>: hệ điều hành, tốc độ CPU, mỗi loại câu lệnh tốn bao lâu — thứ này ta bỏ.</li>
<li><strong>Ngôn ngữ lập trình (programming language)</strong>: Java, C, Python chạy cùng các bước với tốc độ khác nhau — thứ này ta bỏ.</li>
<li><strong>Trạng thái dữ liệu (state of data)</strong>: đã sắp xếp, đảo ngược, ngẫu nhiên… — thứ này ta giữ, dưới dạng trường hợp tốt nhất / trung bình / xấu nhất.</li>
</ol>
<p class="nhan">Ví dụ của bài — cùng thuật toán (sắp xếp chèn — insertion sort), cùng n = 8, cùng máy; chỉ trạng thái dữ liệu thay đổi</p>
<pre><code class="language-java">import java.util.Arrays;

public class StateOfData {
    static int comparisons;                           // số lần đã so sánh a[j] &gt; key

    // Sắp xếp chèn: đẩy từng phần tử sang trái qua các số lớn hơn nó
    static void insertionSort(int[] a) {
        for (int i = 1; i &lt; a.length; i++) {
            int key = a[i], j = i - 1;
            while (j &gt;= 0) {
                comparisons++;
                if (a[j] &lt;= key) break;                // đã tới đúng chỗ
                a[j + 1] = a[j];                       // dời số lớn hơn sang phải
                j--;
            }
            a[j + 1] = key;
        }
    }

    static void run(String state, int[] a) {
        comparisons = 0;
        String before = Arrays.toString(a);
        insertionSort(a);
        System.out.println(state + before + " -&gt; " + comparisons + " comparisons");
    }

    public static void main(String[] args) {
        // cùng thuật toán, cùng n = 8, cùng máy: chỉ trạng thái dữ liệu khác
        run("already sorted ", new int[] {1, 2, 3, 4, 5, 6, 7, 8});
        run("mixed          ", new int[] {5, 2, 7, 1, 8, 3, 6, 4});
        run("reversed       ", new int[] {8, 7, 6, 5, 4, 3, 2, 1});
    }
}</code></pre>
<div class="out">already sorted [1, 2, 3, 4, 5, 6, 7, 8] -&gt; 7 comparisons<br>
mixed &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[5, 2, 7, 1, 8, 3, 6, 4] -&gt; 18 comparisons<br>
reversed &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[8, 7, 6, 5, 4, 3, 2, 1] -&gt; 28 comparisons</div>
<p>Sắp xếp chèn đẩy từng phần tử sang trái vượt qua các số lớn hơn nó. Dữ liệu đã sắp thì phần tử nào cũng dừng ngay (7 lần so sánh); dữ liệu đảo ngược thì phần tử nào cũng phải đi hết đường (1 + 2 + … + 7 = 28 lần so sánh).</p>
<p>Đếm phép toán như chương trình làm cho ra cùng con số trên mọi máy, với mọi ngôn ngữ — đúng sự độc lập mà slide đòi hỏi.</p>
<div class="pitfall">Dạng câu FE (thi cuối kỳ): "Phân tích độ phức tạp thời gian cố ý bỏ qua yếu tố nào?" → máy tính và ngôn ngữ lập trình. Kích thước đầu vào, và trạng thái dữ liệu (qua ba trường hợp), vẫn được giữ lại.</div>`],
      [11, 'Time complexity of an algorithm (2)',
        `<p class="y-chinh">🎯 Time complexity = the number of operations an algorithm performs, written as a function of the input size n; when many inputs share the same n, we state the worst, best or average case.</p>
<ul>
<li><strong>"Number of operations"</strong>: we count the basic steps — comparisons, assignments, arithmetic, array accesses (slides 15–16) — or only the dominant one, such as the comparisons of a sort.</li>
<li><strong>"Size"</strong>: whatever measures the input — array length, number of characters of a text, number of vertices and edges of a graph, number of bits of a number.</li>
<li><strong>Many inputs of size n</strong>: n numbers can be ordered in n! ways and each ordering can cost differently, so "the" cost of size n needs a choice — worst, best or average.</li>
</ul>
<p class="nhan">The lesson's example — insertion sort (slide 10) run on ALL n! inputs of each size</p>
<pre><code class="language-java">import java.util.Locale;

public class ThreeCases {
    static long comparisons;
    static long best, worst, total, inputs;

    static void insertionSort(int[] a) {             // the same sort as on slide 10
        for (int i = 1; i &lt; a.length; i++) {
            int key = a[i], j = i - 1;
            while (j &gt;= 0) {
                comparisons++;
                if (a[j] &lt;= key) break;
                a[j + 1] = a[j];
                j--;
            }
            a[j + 1] = key;
        }
    }

    // Try every ordering of p[k..n-1]: all n! inputs of size n
    static void permute(int[] p, int k) {
        if (k == p.length) {
            comparisons = 0;
            insertionSort(p.clone());
            best = Math.min(best, comparisons);
            worst = Math.max(worst, comparisons);
            total += comparisons;
            inputs++;
            return;
        }
        for (int i = k; i &lt; p.length; i++) {
            int t = p[k]; p[k] = p[i]; p[i] = t;
            permute(p, k + 1);
            t = p[k]; p[k] = p[i]; p[i] = t;
        }
    }

    public static void main(String[] args) {
        System.out.println(" n  inputs  best  average  worst  n(n-1)/2");
        for (int n = 2; n &lt;= 8; n++) {
            int[] p = new int[n];
            for (int i = 0; i &lt; n; i++) p[i] = i + 1;
            best = Long.MAX_VALUE; worst = 0; total = 0; inputs = 0;
            permute(p, 0);
            System.out.println(String.format(Locale.ROOT, "%2d %7d %5d %8.2f %6d %9d",
                    n, inputs, best, (double) total / inputs, worst, n * (n - 1) / 2));
        }
    }
}</code></pre>
<div class="out">&nbsp;n &nbsp;inputs &nbsp;best &nbsp;average &nbsp;worst &nbsp;n(n-1)/2<br>
&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;1.00 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1<br>
&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6 &nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;2.67 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3<br>
&nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;24 &nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;4.92 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6<br>
&nbsp;5 &nbsp;&nbsp;&nbsp;&nbsp;120 &nbsp;&nbsp;&nbsp;&nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;7.72 &nbsp;&nbsp;&nbsp;&nbsp;10 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10<br>
&nbsp;6 &nbsp;&nbsp;&nbsp;&nbsp;720 &nbsp;&nbsp;&nbsp;&nbsp;5 &nbsp;&nbsp;&nbsp;11.05 &nbsp;&nbsp;&nbsp;&nbsp;15 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;15<br>
&nbsp;7 &nbsp;&nbsp;&nbsp;5040 &nbsp;&nbsp;&nbsp;&nbsp;6 &nbsp;&nbsp;&nbsp;14.91 &nbsp;&nbsp;&nbsp;&nbsp;21 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;21<br>
&nbsp;8 &nbsp;&nbsp;40320 &nbsp;&nbsp;&nbsp;&nbsp;7 &nbsp;&nbsp;&nbsp;19.28 &nbsp;&nbsp;&nbsp;&nbsp;28 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;28</div>
<p>Worst case = n(n − 1)/2 (reversed input), best case = n − 1 (sorted input), and the average grows like n²/4 — it lies between the two but is not their midpoint.</p>
<p class="dap-an">✅ <strong>Answer — "number of operations" = "running time"?</strong> Not equal, but proportional. On a given machine each primitive operation takes a constant time between some a and b nanoseconds, so the running time lies between a × count and b × count (slide 17). The count keeps what matters — how the cost grows with n — and drops what depends on the machine.</p>
<div class="pitfall">"Average case = (best + worst) / 2" is false: for n = 8 above, (7 + 28)/2 = 17.5, while the true average is 19.28. The average has to be computed over all inputs, weighted by how likely they are.</div>`,
        `<p class="y-chinh">🎯 Độ phức tạp thời gian (time complexity) = số phép toán thuật toán thực hiện, viết thành một hàm của kích thước đầu vào n; khi có nhiều đầu vào cùng cỡ n, ta nêu rõ trường hợp xấu nhất, tốt nhất hay trung bình.</p>
<ul>
<li><strong>"Số phép toán" (number of operations)</strong>: ta đếm các bước cơ bản — so sánh, gán, tính toán số học, truy cập mảng (slide 15–16) — hoặc chỉ đếm loại bước trội nhất, như số lần so sánh của một thuật toán sắp xếp.</li>
<li><strong>"Kích thước" (size)</strong>: bất cứ thứ gì đo độ lớn của đầu vào — độ dài mảng, số ký tự của văn bản, số đỉnh và số cạnh của đồ thị, số bit của một con số.</li>
<li><strong>Nhiều đầu vào cùng cỡ n</strong>: n con số có n! cách sắp thứ tự và mỗi cách có thể tốn chi phí khác nhau, nên muốn nói "chi phí của cỡ n" phải chọn — xấu nhất, tốt nhất hay trung bình.</li>
</ul>
<p class="nhan">Ví dụ của bài — sắp xếp chèn (slide 10) chạy trên TẤT CẢ n! đầu vào của mỗi cỡ n</p>
<pre><code class="language-java">import java.util.Locale;

public class ThreeCases {
    static long comparisons;
    static long best, worst, total, inputs;

    static void insertionSort(int[] a) {             // cùng thuật toán như ở slide 10
        for (int i = 1; i &lt; a.length; i++) {
            int key = a[i], j = i - 1;
            while (j &gt;= 0) {
                comparisons++;
                if (a[j] &lt;= key) break;
                a[j + 1] = a[j];
                j--;
            }
            a[j + 1] = key;
        }
    }

    // Thử mọi thứ tự của p[k..n-1]: đủ n! đầu vào cỡ n
    static void permute(int[] p, int k) {
        if (k == p.length) {
            comparisons = 0;
            insertionSort(p.clone());
            best = Math.min(best, comparisons);
            worst = Math.max(worst, comparisons);
            total += comparisons;
            inputs++;
            return;
        }
        for (int i = k; i &lt; p.length; i++) {
            int t = p[k]; p[k] = p[i]; p[i] = t;
            permute(p, k + 1);
            t = p[k]; p[k] = p[i]; p[i] = t;
        }
    }

    public static void main(String[] args) {
        System.out.println(" n  inputs  best  average  worst  n(n-1)/2");
        for (int n = 2; n &lt;= 8; n++) {
            int[] p = new int[n];
            for (int i = 0; i &lt; n; i++) p[i] = i + 1;
            best = Long.MAX_VALUE; worst = 0; total = 0; inputs = 0;
            permute(p, 0);
            System.out.println(String.format(Locale.ROOT, "%2d %7d %5d %8.2f %6d %9d",
                    n, inputs, best, (double) total / inputs, worst, n * (n - 1) / 2));
        }
    }
}</code></pre>
<div class="out">&nbsp;n &nbsp;inputs &nbsp;best &nbsp;average &nbsp;worst &nbsp;n(n-1)/2<br>
&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;1.00 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1<br>
&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6 &nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;2.67 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3<br>
&nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;24 &nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;4.92 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6<br>
&nbsp;5 &nbsp;&nbsp;&nbsp;&nbsp;120 &nbsp;&nbsp;&nbsp;&nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;7.72 &nbsp;&nbsp;&nbsp;&nbsp;10 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10<br>
&nbsp;6 &nbsp;&nbsp;&nbsp;&nbsp;720 &nbsp;&nbsp;&nbsp;&nbsp;5 &nbsp;&nbsp;&nbsp;11.05 &nbsp;&nbsp;&nbsp;&nbsp;15 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;15<br>
&nbsp;7 &nbsp;&nbsp;&nbsp;5040 &nbsp;&nbsp;&nbsp;&nbsp;6 &nbsp;&nbsp;&nbsp;14.91 &nbsp;&nbsp;&nbsp;&nbsp;21 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;21<br>
&nbsp;8 &nbsp;&nbsp;40320 &nbsp;&nbsp;&nbsp;&nbsp;7 &nbsp;&nbsp;&nbsp;19.28 &nbsp;&nbsp;&nbsp;&nbsp;28 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;28</div>
<p>Xấu nhất = n(n − 1)/2 (đầu vào đảo ngược), tốt nhất = n − 1 (đầu vào đã sắp), còn trung bình tăng cỡ n²/4 — nằm giữa hai giá trị kia nhưng không phải điểm chính giữa.</p>
<p class="dap-an">✅ <strong>Đáp án — "số phép toán" = "thời gian chạy"?</strong> Không bằng nhau, nhưng tỉ lệ với nhau. Trên một máy cụ thể, mỗi phép toán cơ bản tốn một thời gian cố định nằm giữa a và b nano-giây nào đó, nên thời gian chạy nằm giữa a × số phép và b × số phép (slide 17). Số phép giữ lại điều quan trọng — chi phí tăng thế nào theo n — và bỏ đi phần phụ thuộc máy.</p>
<div class="pitfall">"Trung bình = (tốt nhất + xấu nhất) / 2" là SAI: với n = 8 ở trên, (7 + 28)/2 = 17,5, trong khi trung bình thật là 19,28. Trung bình phải tính trên mọi đầu vào, có tính tới khả năng xuất hiện của từng đầu vào.</div>`],
      [12, 'Theoretical analysis (figure)',
        `<p class="y-chinh">🎯 Theoretical analysis replaces the stopwatch: it works on a high-level description of the algorithm, counts its steps as a function of n, covers every input, and does not depend on hardware or software.</p>
<p class="ghi-chu">This slide is a picture and no text could be extracted from it. At this point the deck moves from experiments (slides 7–11) to analysis on paper (pseudocode and primitive operations, slides 13–16), so this block teaches that step; compare with the picture on your copy of the slide.</p>
<table>
<thead><tr><th>Experimental study (slides 7–9)</th><th>Theoretical analysis (slides 12–19)</th></tr></thead>
<tbody>
<tr><td>needs a working implementation</td><td>works on pseudocode, before any code exists</td></tr>
<tr><td>tests a limited set of inputs</td><td>takes all possible inputs into account (best / worst / average)</td></tr>
<tr><td>result tied to one machine and language</td><td>independent of hardware and software</td></tr>
<tr><td>gives a number of milliseconds</td><td>gives a function of n, such as 7n − 2 → O(n)</td></tr>
</tbody>
</table>
<ul>
<li>It answers the three limitations of slide 9 one by one.</li>
<li>The price: we must agree on what one "step" is — slides 13–16 settle that with pseudocode and primitive operations.</li>
<li>The result is a <strong>growth rate</strong>, exactly what we need to compare algorithms on large inputs.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> an experiment weighs the cake after baking it; analysis reads the recipe and counts the steps before you turn the oven on.</p>`,
        `<p class="y-chinh">🎯 Phân tích lý thuyết (theoretical analysis) thay cho đồng hồ bấm giờ: nó làm việc trên mô tả mức cao của thuật toán, đếm số bước thành một hàm của n, tính tới mọi đầu vào, và không phụ thuộc phần cứng hay phần mềm.</p>
<p class="ghi-chu">Slide này là hình, không trích được chữ nào. Ở vị trí này bộ slide chuyển từ thực nghiệm (slide 7–11) sang phân tích trên giấy (mã giả và phép toán cơ bản, slide 13–16), nên phần giảng dưới đây dạy bước chuyển đó; hãy đối chiếu với hình trên bản slide của bạn.</p>
<table>
<thead><tr><th>Nghiên cứu thực nghiệm (slide 7–9)</th><th>Phân tích lý thuyết (slide 12–19)</th></tr></thead>
<tbody>
<tr><td>cần có chương trình chạy được</td><td>làm trên mã giả (pseudocode), trước khi có dòng code nào</td></tr>
<tr><td>chỉ thử một số đầu vào có hạn</td><td>tính tới mọi đầu vào có thể (tốt nhất / xấu nhất / trung bình)</td></tr>
<tr><td>kết quả gắn với một máy, một ngôn ngữ</td><td>không phụ thuộc phần cứng, phần mềm</td></tr>
<tr><td>cho ra một số mili-giây</td><td>cho ra một hàm của n, ví dụ 7n − 2 → O(n)</td></tr>
</tbody>
</table>
<ul>
<li>Nó giải quyết lần lượt từng giới hạn trong ba giới hạn ở slide 9.</li>
<li>Cái giá phải trả: phải thống nhất thế nào là một "bước" — slide 13–16 chốt chuyện này bằng mã giả và phép toán cơ bản (primitive operation).</li>
<li>Kết quả là một <strong>tốc độ tăng (growth rate)</strong>, đúng thứ ta cần để so sánh thuật toán trên đầu vào lớn.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> thực nghiệm là nướng bánh xong rồi mới cân; phân tích là đọc công thức và đếm các bước trước khi bật lò.</p>`],
      [13, 'Pseudocode',
        `<p class="y-chinh">🎯 Pseudocode is a high-level description of an algorithm — more structured than English, less detailed than a program — and it is what we analyse.</p>
<p class="ghi-chu">This slide is mainly a picture; only its title could be extracted. The pseudocode below is the lesson's own example (finding the largest element), used again on slides 16–17.</p>
<pre><code class="language-plaintext">Algorithm arrayMax(A, n):
    Input:  an array A storing n ≥ 1 integers
    Output: the largest element of A
    currentMax ← A[0]
    for i ← 1 to n − 1 do
        if currentMax &lt; A[i] then
            currentMax ← A[i]
    return currentMax</code></pre>
<ul>
<li>It hides details that do not change the analysis: types, declarations, braces, semicolons.</li>
<li>It keeps what does: the loops, the comparisons, the assignments — so we can count them.</li>
<li>The deck's own examples on slides 35–37 use another common style (<code>procedure … end procedure</code>, <code>:=</code>); the lesson's table under slide 14 lists the conventions of both.</li>
</ul>
<p>Translated line by line into Java and traced on A = [7, 3, 9, 2, 9, 5]:</p>
<pre><code class="language-java">public class ArrayMax {
    // Algorithm arrayMax(A, n), line by line from the lesson's pseudocode
    static int arrayMax(int[] A, int n) {
        int currentMax = A[0];                                 // currentMax &lt;- A[0]
        for (int i = 1; i &lt;= n - 1; i++) {                     // for i &lt;- 1 to n - 1 do
            if (currentMax &lt; A[i])                             //   if currentMax &lt; A[i] then
                currentMax = A[i];                             //     currentMax &lt;- A[i]
            System.out.println("i = " + i + "   A[i] = " + A[i] + "   currentMax = " + currentMax);
        }
        return currentMax;                                     // return currentMax
    }

    public static void main(String[] args) {
        int[] A = {7, 3, 9, 2, 9, 5};
        System.out.println("start: currentMax = A[0] = " + A[0]);
        System.out.println("arrayMax(A, 6) = " + arrayMax(A, A.length));
    }
}</code></pre>
<div class="out">start: currentMax = A[0] = 7<br>
i = 1 &nbsp;&nbsp;A[i] = 3 &nbsp;&nbsp;currentMax = 7<br>
i = 2 &nbsp;&nbsp;A[i] = 9 &nbsp;&nbsp;currentMax = 9<br>
i = 3 &nbsp;&nbsp;A[i] = 2 &nbsp;&nbsp;currentMax = 9<br>
i = 4 &nbsp;&nbsp;A[i] = 9 &nbsp;&nbsp;currentMax = 9<br>
i = 5 &nbsp;&nbsp;A[i] = 5 &nbsp;&nbsp;currentMax = 9<br>
arrayMax(A, 6) = 9</div>
<p class="meo">🧠 <strong>Remember:</strong> pseudocode is for humans — if a classmate who knows no Java can follow it step by step, it is good pseudocode.</p>`,
        `<p class="y-chinh">🎯 Mã giả (pseudocode) là mô tả mức cao của thuật toán — có cấu trúc hơn văn nói, ít chi tiết hơn chương trình — và chính nó là thứ ta đem ra phân tích.</p>
<p class="ghi-chu">Slide này chủ yếu là hình; chữ trích được chỉ có tiêu đề. Mã giả dưới đây là ví dụ của bài (tìm phần tử lớn nhất), sẽ dùng lại ở slide 16–17.</p>
<pre><code class="language-plaintext">Algorithm arrayMax(A, n):
    Input:  mảng A chứa n ≥ 1 số nguyên
    Output: phần tử lớn nhất của A
    currentMax ← A[0]
    for i ← 1 to n − 1 do
        if currentMax &lt; A[i] then
            currentMax ← A[i]
    return currentMax</code></pre>
<ul>
<li>Nó giấu đi các chi tiết không làm đổi kết quả phân tích: kiểu dữ liệu, khai báo, dấu ngoặc nhọn, dấu chấm phẩy.</li>
<li>Nó giữ lại những gì ảnh hưởng: vòng lặp, phép so sánh, phép gán — để ta đếm được.</li>
<li>Các ví dụ của chính bộ slide ở slide 35–37 viết theo một kiểu phổ biến khác (<code>procedure … end procedure</code>, <code>:=</code>); bảng của bài ở slide 14 liệt kê quy ước của cả hai kiểu.</li>
</ul>
<p>Dịch từng dòng sang Java và chạy lần theo trên A = [7, 3, 9, 2, 9, 5]:</p>
<pre><code class="language-java">public class ArrayMax {
    // Thuật toán arrayMax(A, n), dịch từng dòng từ mã giả của bài
    static int arrayMax(int[] A, int n) {
        int currentMax = A[0];                                 // currentMax &lt;- A[0]
        for (int i = 1; i &lt;= n - 1; i++) {                     // for i &lt;- 1 to n - 1 do
            if (currentMax &lt; A[i])                             //   if currentMax &lt; A[i] then
                currentMax = A[i];                             //     currentMax &lt;- A[i]
            System.out.println("i = " + i + "   A[i] = " + A[i] + "   currentMax = " + currentMax);
        }
        return currentMax;                                     // return currentMax
    }

    public static void main(String[] args) {
        int[] A = {7, 3, 9, 2, 9, 5};
        System.out.println("start: currentMax = A[0] = " + A[0]);
        System.out.println("arrayMax(A, 6) = " + arrayMax(A, A.length));
    }
}</code></pre>
<div class="out">start: currentMax = A[0] = 7<br>
i = 1 &nbsp;&nbsp;A[i] = 3 &nbsp;&nbsp;currentMax = 7<br>
i = 2 &nbsp;&nbsp;A[i] = 9 &nbsp;&nbsp;currentMax = 9<br>
i = 3 &nbsp;&nbsp;A[i] = 2 &nbsp;&nbsp;currentMax = 9<br>
i = 4 &nbsp;&nbsp;A[i] = 9 &nbsp;&nbsp;currentMax = 9<br>
i = 5 &nbsp;&nbsp;A[i] = 5 &nbsp;&nbsp;currentMax = 9<br>
arrayMax(A, 6) = 9</div>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> mã giả viết cho người đọc — nếu một bạn cùng lớp không biết Java vẫn làm theo được từng bước, đó là mã giả tốt.</p>`],
      [14, 'Pseudocode details (figure)',
        `<p class="y-chinh">🎯 Pseudocode uses a small set of conventions for control flow, method headers, assignment and expressions; knowing them lets you read any textbook's pseudocode and turn it into Java.</p>
<p class="ghi-chu">This slide is a picture and no text could be extracted from it. It sits between "Pseudocode" (slide 13) and the counting of operations (slides 15–16), so this block teaches the pseudocode conventions; compare with the picture on your copy.</p>
<table>
<thead><tr><th>Pseudocode</th><th>Meaning</th><th>Java</th></tr></thead>
<tbody>
<tr><td><code>x ← e</code> or <code>x := e</code></td><td>assignment</td><td><code>x = e;</code></td></tr>
<tr><td><code>x = y</code> inside a test</td><td>equality test</td><td><code>x == y</code></td></tr>
<tr><td><code>if … then … [else …]</code></td><td>decision</td><td><code>if (…) { … } else { … }</code></td></tr>
<tr><td><code>while … do …</code></td><td>loop while a condition holds</td><td><code>while (…) { … }</code></td></tr>
<tr><td><code>for i ← 1 to n − 1 do</code> or <code>for i := 1 to n</code></td><td>counted loop, both ends included</td><td><code>for (int i = 1; i &lt;= n - 1; i++)</code></td></tr>
<tr><td><code>Algorithm name(p1, p2)</code> or <code>procedure name(…)</code></td><td>method header, with Input and Output lines</td><td><code>static int name(int p1, int p2)</code></td></tr>
<tr><td><code>return e</code></td><td>give back a value</td><td><code>return e;</code></td></tr>
<tr><td>n², ⌊x⌋, a<sub>i</sub></td><td>ordinary math notation</td><td><code>n * n</code>, <code>(int) Math.floor(x)</code>, <code>a[i]</code></td></tr>
</tbody>
</table>
<ul>
<li>Indentation (or <code>begin … end</code>) shows which lines belong to a loop or to an <code>if</code>.</li>
<li><code>for i := 1 to n</code> <strong>includes</strong> n — n turns, not n − 1. This detail decides the counts on slides 35–37.</li>
<li>Pseudocode arrays often start at index 0, as in Java, but some books start at 1: check the first index before you count.</li>
</ul>
<div class="pitfall">In pseudocode <code>=</code> is a comparison and <code>←</code> or <code>:=</code> is an assignment; in Java <code>=</code> assigns and <code>==</code> compares. Copying <code>if max = a[i]</code> straight into Java does not compile for ints — and for booleans it compiles and silently assigns.</div>`,
        `<p class="y-chinh">🎯 Mã giả dùng một bộ quy ước nhỏ cho luồng điều khiển, phần đầu phương thức, phép gán và biểu thức; nắm được chúng là đọc được mã giả của mọi giáo trình và dịch sang Java.</p>
<p class="ghi-chu">Slide này là hình, không trích được chữ nào. Nó nằm giữa "Pseudocode" (slide 13) và phần đếm phép toán (slide 15–16), nên phần giảng dưới đây dạy các quy ước viết mã giả; hãy đối chiếu với hình trên bản slide của bạn.</p>
<table>
<thead><tr><th>Mã giả</th><th>Nghĩa</th><th>Java</th></tr></thead>
<tbody>
<tr><td><code>x ← e</code> hoặc <code>x := e</code></td><td>phép gán (assignment)</td><td><code>x = e;</code></td></tr>
<tr><td><code>x = y</code> trong một điều kiện</td><td>kiểm tra bằng nhau</td><td><code>x == y</code></td></tr>
<tr><td><code>if … then … [else …]</code></td><td>rẽ nhánh</td><td><code>if (…) { … } else { … }</code></td></tr>
<tr><td><code>while … do …</code></td><td>lặp khi điều kiện còn đúng</td><td><code>while (…) { … }</code></td></tr>
<tr><td><code>for i ← 1 to n − 1 do</code> hoặc <code>for i := 1 to n</code></td><td>vòng lặp đếm, lấy cả hai đầu mút</td><td><code>for (int i = 1; i &lt;= n - 1; i++)</code></td></tr>
<tr><td><code>Algorithm name(p1, p2)</code> hoặc <code>procedure name(…)</code></td><td>phần đầu phương thức, kèm dòng Input (đầu vào) và Output (đầu ra)</td><td><code>static int name(int p1, int p2)</code></td></tr>
<tr><td><code>return e</code></td><td>trả về một giá trị</td><td><code>return e;</code></td></tr>
<tr><td>n², ⌊x⌋, a<sub>i</sub></td><td>ký hiệu toán học thông thường</td><td><code>n * n</code>, <code>(int) Math.floor(x)</code>, <code>a[i]</code></td></tr>
</tbody>
</table>
<ul>
<li>Thụt lề (hoặc <code>begin … end</code>) cho biết dòng nào thuộc vòng lặp hay thuộc <code>if</code> nào.</li>
<li><code>for i := 1 to n</code> <strong>lấy cả</strong> n — n lượt, không phải n − 1. Chi tiết này quyết định các con số đếm ở slide 35–37.</li>
<li>Mảng trong mã giả thường bắt đầu từ chỉ số 0 như Java, nhưng có sách bắt đầu từ 1: xem chỉ số đầu tiên trước khi đếm.</li>
</ul>
<div class="pitfall">Trong mã giả, <code>=</code> là phép so sánh còn <code>←</code> hay <code>:=</code> là phép gán; trong Java <code>=</code> là gán, <code>==</code> mới là so sánh. Chép nguyên <code>if max = a[i]</code> sang Java thì với kiểu int sẽ không biên dịch được — còn với kiểu boolean thì biên dịch được và lặng lẽ gán giá trị.</div>`],
      [15, 'Primitive operations (figure)',
        `<p class="y-chinh">🎯 Primitive operations are the basic steps of an algorithm — assigning, comparing, doing arithmetic, indexing an array, calling or returning from a method — and each is assumed to take constant time.</p>
<p class="ghi-chu">This slide is a picture and no text could be extracted from it. It comes just before "Counting Primitive Operation" (slide 16), so this block teaches what a primitive operation is; compare with the picture on your copy.</p>
<ul>
<li><strong>Examples</strong>: <code>x = e</code> (assign), <code>a &lt; b</code> (compare), <code>x + y</code> (arithmetic), <code>A[i]</code> (index into an array), <code>p.next</code> (follow a reference), calling a method, <code>return</code>.</li>
<li><strong>Constant time</strong>: each costs a fixed amount, whatever n is. On a real machine that amount varies a little from one operation to another — the lesson handles it at slide 17 with a fastest time a and a slowest time b.</li>
<li><strong>Not primitive</strong>: anything hiding a loop — <code>Arrays.sort(a)</code>, <code>list.contains(x)</code>, <code>s1.equals(s2)</code> on long strings, a method of yours that loops. Count their inside, or use their known Big-O.</li>
<li>Primitive operations can be spotted in pseudocode and are largely independent of the programming language — which is why counting them removes the language from the analysis.</li>
</ul>
<p>This model — every memory cell reachable in one step, every basic operation in constant time — is called the <strong>RAM model</strong> (random access machine).</p>
<div class="pitfall">A one-line Java call is not a one-step operation: <code>for (…) if (list.contains(x)) …</code> over an <code>ArrayList</code> of n elements is O(n²), not O(n), because <code>contains</code> scans the list each time.</div>`,
        `<p class="y-chinh">🎯 Phép toán cơ bản (primitive operation) là các bước nền của thuật toán — gán, so sánh, tính toán số học, truy cập phần tử mảng, gọi hoặc trả về từ một phương thức — và mỗi phép được coi là tốn thời gian hằng (constant time).</p>
<p class="ghi-chu">Slide này là hình, không trích được chữ nào. Nó đứng ngay trước "Counting Primitive Operation" (slide 16), nên phần giảng dưới đây dạy thế nào là một phép toán cơ bản; hãy đối chiếu với hình trên bản slide của bạn.</p>
<ul>
<li><strong>Ví dụ</strong>: <code>x = e</code> (gán), <code>a &lt; b</code> (so sánh), <code>x + y</code> (số học), <code>A[i]</code> (lấy phần tử mảng theo chỉ số), <code>p.next</code> (đi theo một tham chiếu — reference), gọi một phương thức, <code>return</code>.</li>
<li><strong>Thời gian hằng</strong>: mỗi phép tốn một lượng cố định, n bao nhiêu cũng vậy. Trên máy thật lượng đó xê dịch chút ít giữa các loại phép — bài xử lý chuyện này ở slide 17 bằng thời gian nhanh nhất a và chậm nhất b.</li>
<li><strong>Không phải phép cơ bản</strong>: mọi thứ giấu một vòng lặp bên trong — <code>Arrays.sort(a)</code>, <code>list.contains(x)</code>, <code>s1.equals(s2)</code> trên chuỗi dài, một phương thức bạn tự viết có vòng lặp. Phải đếm phần bên trong của chúng, hoặc dùng Big-O (O lớn) đã biết của chúng.</li>
<li>Phép toán cơ bản nhận ra được ngay trên mã giả và hầu như không phụ thuộc ngôn ngữ lập trình — vì thế đếm chúng là loại được ngôn ngữ ra khỏi phép phân tích.</li>
</ul>
<p>Mô hình này — ô nhớ nào cũng truy cập được trong một bước, phép cơ bản nào cũng tốn thời gian hằng — gọi là <strong>mô hình RAM</strong> (random access machine — máy truy cập ngẫu nhiên).</p>
<div class="pitfall">Một lời gọi Java viết trên một dòng không phải là một bước: <code>for (…) if (list.contains(x)) …</code> trên một <code>ArrayList</code> n phần tử là O(n²) chứ không phải O(n), vì mỗi lần <code>contains</code> đều quét cả danh sách.</div>`],
      [16, 'Counting Primitive Operation',
        `<p class="y-chinh">🎯 Counting primitive operations line by line turns an algorithm into a formula of n: for arrayMax, between 5n operations (best case) and 7n − 2 (worst case).</p>
<p class="ghi-chu">This slide is mainly a picture; only its title could be extracted. The count below is made on the lesson's arrayMax (slide 13) with the charges written in the table; the slide's figure may charge some lines differently — compare it line by line.</p>
<table>
<thead><tr><th>Line of arrayMax</th><th>Operations each time</th><th>Times executed</th><th>Total</th></tr></thead>
<tbody>
<tr><td><code>currentMax ← A[0]</code></td><td>2 (index, assign)</td><td>1</td><td>2</td></tr>
<tr><td><code>i ← 1</code></td><td>1 (assign)</td><td>1</td><td>1</td></tr>
<tr><td>test <code>i ≤ n − 1</code></td><td>1 (compare)</td><td>n (n − 1 true + 1 false)</td><td>n</td></tr>
<tr><td><code>currentMax &lt; A[i]</code></td><td>2 (index, compare)</td><td>n − 1</td><td>2(n − 1)</td></tr>
<tr><td><code>currentMax ← A[i]</code></td><td>2 (index, assign)</td><td>0 … n − 1</td><td>0 … 2(n − 1)</td></tr>
<tr><td><code>i ← i + 1</code></td><td>2 (add, assign)</td><td>n − 1</td><td>2(n − 1)</td></tr>
<tr><td><code>return currentMax</code></td><td>1</td><td>1</td><td>1</td></tr>
</tbody>
</table>
<ul>
<li><strong>Best case</strong> (largest element first, the update never runs): 2 + 1 + n + 2(n − 1) + 2(n − 1) + 1 = <strong>5n</strong>.</li>
<li><strong>Worst case</strong> (increasing array, the update runs every turn): 5n + 2(n − 1) = <strong>7n − 2</strong>.</li>
<li>The loop test runs <strong>once more</strong> than the loop body — the final, failing test costs an operation too.</li>
</ul>
<pre><code class="language-java">public class CountArrayMax {
    static long ops;                                   // primitive operations counted

    static boolean test(boolean b) { ops += 1; return b; }        // the loop test i &lt;= n - 1: 1 op

    static int arrayMax(int[] A, int n) {
        int currentMax = A[0];         ops += 2;       // index A[0], assign
        int i = 1;                     ops += 1;       // assign i
        while (test(i &lt; n)) {                          // runs n times: n - 1 true + 1 false
            ops += 2;                                  // index A[i], compare
            if (currentMax &lt; A[i]) {
                currentMax = A[i];     ops += 2;       // index A[i], assign
            }
            i = i + 1;                 ops += 2;       // add, assign
        }
        ops += 1;                                      // return
        return currentMax;
    }

    public static void main(String[] args) {
        for (int n : new int[] {5, 10, 100}) {
            int[] down = new int[n], up = new int[n];
            for (int k = 0; k &lt; n; k++) { down[k] = n - k; up[k] = k + 1; }
            ops = 0; arrayMax(down, n); long best = ops;   // max is A[0]: never updated
            ops = 0; arrayMax(up, n);   long worst = ops;  // increasing: updated every turn
            System.out.println("n = " + n + ": best " + best + " ops (5n = " + 5 * n + "), worst " + worst + " ops (7n - 2 = " + (7 * n - 2) + ")");
        }
    }
}</code></pre>
<div class="out">n = 5: best 25 ops (5n = 25), worst 33 ops (7n - 2 = 33)<br>
n = 10: best 50 ops (5n = 50), worst 68 ops (7n - 2 = 68)<br>
n = 100: best 500 ops (5n = 500), worst 698 ops (7n - 2 = 698)</div>
<p>The program charges exactly the operations of the table and matches both formulas. Other books charge the lines a little differently, so their constants differ; every version has the form a·n + b — linear, O(n).</p>
<p class="meo">🧠 <strong>Remember:</strong> for each line, operations per execution × number of executions; then add up the lines.</p>`,
        `<p class="y-chinh">🎯 Đếm phép toán cơ bản từng dòng biến thuật toán thành một công thức theo n: với arrayMax là từ 5n phép (trường hợp tốt nhất) tới 7n − 2 phép (trường hợp xấu nhất).</p>
<p class="ghi-chu">Slide này chủ yếu là hình; chữ trích được chỉ có tiêu đề. Phép đếm dưới đây làm trên arrayMax của bài (slide 13) với số phép tính cho mỗi dòng ghi trong bảng; hình trên slide có thể tính một số dòng khác đi — hãy so từng dòng.</p>
<table>
<thead><tr><th>Dòng của arrayMax</th><th>Số phép mỗi lần chạy</th><th>Số lần chạy</th><th>Tổng</th></tr></thead>
<tbody>
<tr><td><code>currentMax ← A[0]</code></td><td>2 (lấy phần tử, gán)</td><td>1</td><td>2</td></tr>
<tr><td><code>i ← 1</code></td><td>1 (gán)</td><td>1</td><td>1</td></tr>
<tr><td>kiểm tra <code>i ≤ n − 1</code></td><td>1 (so sánh)</td><td>n (n − 1 lần đúng + 1 lần sai)</td><td>n</td></tr>
<tr><td><code>currentMax &lt; A[i]</code></td><td>2 (lấy phần tử, so sánh)</td><td>n − 1</td><td>2(n − 1)</td></tr>
<tr><td><code>currentMax ← A[i]</code></td><td>2 (lấy phần tử, gán)</td><td>0 … n − 1</td><td>0 … 2(n − 1)</td></tr>
<tr><td><code>i ← i + 1</code></td><td>2 (cộng, gán)</td><td>n − 1</td><td>2(n − 1)</td></tr>
<tr><td><code>return currentMax</code></td><td>1</td><td>1</td><td>1</td></tr>
</tbody>
</table>
<ul>
<li><strong>Tốt nhất</strong> (phần tử lớn nhất đứng đầu, lệnh cập nhật không chạy lần nào): 2 + 1 + n + 2(n − 1) + 2(n − 1) + 1 = <strong>5n</strong>.</li>
<li><strong>Xấu nhất</strong> (mảng tăng dần, lượt nào cũng cập nhật): 5n + 2(n − 1) = <strong>7n − 2</strong>.</li>
<li>Điều kiện lặp chạy <strong>nhiều hơn thân vòng lặp một lần</strong> — lần kiểm tra cuối (cho kết quả sai để thoát) cũng tốn một phép.</li>
</ul>
<pre><code class="language-java">public class CountArrayMax {
    static long ops;                                   // số phép toán cơ bản đã đếm

    static boolean test(boolean b) { ops += 1; return b; }        // phép kiểm tra i &lt;= n - 1: 1 phép

    static int arrayMax(int[] A, int n) {
        int currentMax = A[0];         ops += 2;       // lấy A[0], gán
        int i = 1;                     ops += 1;       // gán i
        while (test(i &lt; n)) {                          // chạy n lần: n - 1 lần đúng + 1 lần sai
            ops += 2;                                  // lấy A[i], so sánh
            if (currentMax &lt; A[i]) {
                currentMax = A[i];     ops += 2;       // lấy A[i], gán
            }
            i = i + 1;                 ops += 2;       // cộng, gán
        }
        ops += 1;                                      // trả về
        return currentMax;
    }

    public static void main(String[] args) {
        for (int n : new int[] {5, 10, 100}) {
            int[] down = new int[n], up = new int[n];
            for (int k = 0; k &lt; n; k++) { down[k] = n - k; up[k] = k + 1; }
            ops = 0; arrayMax(down, n); long best = ops;   // max là A[0]: không cập nhật lần nào
            ops = 0; arrayMax(up, n);   long worst = ops;  // tăng dần: lần nào cũng cập nhật
            System.out.println("n = " + n + ": best " + best + " ops (5n = " + 5 * n + "), worst " + worst + " ops (7n - 2 = " + (7 * n - 2) + ")");
        }
    }
}</code></pre>
<div class="out">n = 5: best 25 ops (5n = 25), worst 33 ops (7n - 2 = 33)<br>
n = 10: best 50 ops (5n = 50), worst 68 ops (7n - 2 = 68)<br>
n = 100: best 500 ops (5n = 500), worst 698 ops (7n - 2 = 698)</div>
<p>Chương trình tính đúng các phép như trong bảng và khớp cả hai công thức. Sách khác có thể tính mỗi dòng hơi khác nên hằng số khác đi; nhưng phiên bản nào cũng có dạng a·n + b — tuyến tính, O(n).</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> với mỗi dòng, lấy số phép mỗi lần chạy × số lần chạy; rồi cộng tất cả các dòng lại.</p>`],
      [17, 'Estimating running time (figure)',
        `<p class="y-chinh">🎯 If the fastest primitive operation takes time a and the slowest takes b, then a·f(n) ≤ T(n) ≤ b·f(n): the running time is squeezed between two multiples of the operation count.</p>
<p class="ghi-chu">This slide is a picture and no text could be extracted from it. Right after the count of slide 16, this block teaches how an operation count becomes an estimate of running time; compare with the picture on your copy.</p>
<ul>
<li>For arrayMax in the worst case f(n) = 7n − 2, so a(7n − 2) ≤ T(n) ≤ b(7n − 2): T(n) is bounded by two <strong>linear</strong> functions.</li>
<li>a and b depend on the machine; 7n − 2 depends only on the algorithm.</li>
<li>Below, a = 1 ns and b = 4 ns are <strong>assumed values</strong>, chosen only to show the effect:</li>
</ul>
<pre><code class="language-java">import java.util.Locale;

public class EstimateTime {
    static String human(double seconds) {
        if (seconds &lt; 1e-3) return String.format(Locale.ROOT, "%.1f us", seconds * 1e6);
        if (seconds &lt; 1) return String.format(Locale.ROOT, "%.1f ms", seconds * 1e3);
        return String.format(Locale.ROOT, "%.1f s", seconds);
    }

    public static void main(String[] args) {
        double a = 1e-9;                              // assumed: the fastest primitive op takes 1 ns
        double b = 4e-9;                              // assumed: the slowest primitive op takes 4 ns
        for (long n = 1000; n &lt;= 1000000000L; n *= 1000) {
            long ops = 7 * n - 2;                     // worst-case count of arrayMax (slide 16)
            System.out.println("n = " + n + ": " + ops + " ops -&gt; T(n) between " + human(a * ops) + " and " + human(b * ops));
        }
    }
}</code></pre>
<div class="out">n = 1000: 6998 ops -&gt; T(n) between 7.0 us and 28.0 us<br>
n = 1000000: 6999998 ops -&gt; T(n) between 7.0 ms and 28.0 ms<br>
n = 1000000000: 6999999998 ops -&gt; T(n) between 7.0 s and 28.0 s</div>
<p>Each time n is multiplied by 1,000, both bounds are multiplied by about 1,000 too. The exact times depend on a and b; the "× 1,000" does not — it is a property of arrayMax.</p>
<p class="meo">🧠 <strong>Remember:</strong> the machine sets the constants a and b; the algorithm sets the shape f(n).</p>`,
        `<p class="y-chinh">🎯 Nếu phép toán cơ bản nhanh nhất tốn thời gian a và chậm nhất tốn b, thì a·f(n) ≤ T(n) ≤ b·f(n): thời gian chạy bị kẹp giữa hai bội số của số phép toán.</p>
<p class="ghi-chu">Slide này là hình, không trích được chữ nào. Ngay sau phép đếm ở slide 16, phần giảng dưới đây dạy cách biến số phép toán thành ước lượng thời gian chạy (estimating running time); hãy đối chiếu với hình trên bản slide của bạn.</p>
<ul>
<li>Với arrayMax trong trường hợp xấu nhất f(n) = 7n − 2, nên a(7n − 2) ≤ T(n) ≤ b(7n − 2): T(n) bị chặn bởi hai hàm <strong>tuyến tính (linear)</strong>.</li>
<li>a và b phụ thuộc máy; 7n − 2 chỉ phụ thuộc thuật toán.</li>
<li>Dưới đây a = 1 ns và b = 4 ns là <strong>giá trị giả định</strong>, chọn ra chỉ để thấy hiệu ứng:</li>
</ul>
<pre><code class="language-java">import java.util.Locale;

public class EstimateTime {
    static String human(double seconds) {
        if (seconds &lt; 1e-3) return String.format(Locale.ROOT, "%.1f us", seconds * 1e6);
        if (seconds &lt; 1) return String.format(Locale.ROOT, "%.1f ms", seconds * 1e3);
        return String.format(Locale.ROOT, "%.1f s", seconds);
    }

    public static void main(String[] args) {
        double a = 1e-9;                              // giả sử: phép cơ bản nhanh nhất tốn 1 ns
        double b = 4e-9;                              // giả sử: phép cơ bản chậm nhất tốn 4 ns
        for (long n = 1000; n &lt;= 1000000000L; n *= 1000) {
            long ops = 7 * n - 2;                     // số phép trường hợp xấu nhất của arrayMax (slide 16)
            System.out.println("n = " + n + ": " + ops + " ops -&gt; T(n) between " + human(a * ops) + " and " + human(b * ops));
        }
    }
}</code></pre>
<div class="out">n = 1000: 6998 ops -&gt; T(n) between 7.0 us and 28.0 us<br>
n = 1000000: 6999998 ops -&gt; T(n) between 7.0 ms and 28.0 ms<br>
n = 1000000000: 6999999998 ops -&gt; T(n) between 7.0 s and 28.0 s</div>
<p>Mỗi lần n nhân 1.000 thì cả hai cận cũng nhân khoảng 1.000. Thời gian cụ thể tuỳ a và b; còn chuyện "× 1.000" thì không — đó là tính chất của arrayMax.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> máy quyết định hằng số a và b; thuật toán quyết định hình dạng f(n).</p>`],
      [18, 'Growth rate of running time (figure)',
        `<p class="y-chinh">🎯 Changing the hardware or software changes the running time only by a constant factor; the growth rate — linear, quadratic, exponential… — is an intrinsic property of the algorithm.</p>
<p class="ghi-chu">This slide is a picture and no text could be extracted from it. After estimating T(n) on slide 17, this block teaches why only the growth rate matters; compare with the picture on your copy.</p>
<p class="nhan">The lesson's example — machine B is 100 times faster than machine A. How big an input can each finish in one second?</p>
<pre><code class="language-java">import java.util.Locale;

public class FasterMachine {
    interface F { double at(double n); }               // one growth function f(n)

    // Largest n with f(n) &lt;= budget (f grows with n)
    static long maxN(F f, double budget) {
        long lo = 1, hi = 2;
        while (f.at(hi) &lt;= budget) { lo = hi; hi *= 2; }
        while (hi - lo &gt; 1) {                          // binary search between lo (fits) and hi (too big)
            long mid = (lo + hi) / 2;
            if (f.at(mid) &lt;= budget) lo = mid; else hi = mid;
        }
        return lo;
    }

    public static void main(String[] args) {
        String[] name = {"n", "n log2 n", "n^2", "n^3", "2^n"};
        F[] f = {
            n -&gt; n,
            n -&gt; n * Math.log(n) / Math.log(2),
            n -&gt; n * n,
            n -&gt; n * n * n,
            n -&gt; Math.pow(2, n)
        };
        System.out.println("f(n)       machine A (1e6 steps/s)   machine B (1e8 steps/s)   gain");
        for (int k = 0; k &lt; f.length; k++) {
            long a = maxN(f[k], 1e6), b = maxN(f[k], 1e8);  // biggest input solved in 1 second
            String gain = k == 4 ? "+" + (b - a) : String.format(Locale.ROOT, "x%.1f", (double) b / a);
            System.out.println(String.format(Locale.ROOT, "%-9s %14d %25d %10s", name[k], a, b, gain));
        }
    }
}</code></pre>
<div class="out">f(n) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;machine A (1e6 steps/s) &nbsp;&nbsp;machine B (1e8 steps/s) &nbsp;&nbsp;gain<br>
n &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1000000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;100000000 &nbsp;&nbsp;&nbsp;&nbsp;x100.0<br>
n log2 n &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;62746 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4523071 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;x72.1<br>
n^2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;x10.0<br>
n^3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;100 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;464 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;x4.6<br>
2^n &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;19 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;26 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+7</div>
<ul>
<li>For a linear algorithm, 100 × the speed buys 100 × bigger inputs.</li>
<li>For n² it buys only 10 ×, for n³ about 4.6 ×.</li>
<li>For 2ⁿ it adds just 7 to n: from 19 to 26 elements. No hardware upgrade rescues an exponential algorithm.</li>
<li>Conversely, replacing an O(n²) algorithm by an O(n log n) one helps more than a faster computer once n is large enough.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> a faster computer shifts the curve; a better algorithm changes its shape.</p>`,
        `<p class="y-chinh">🎯 Đổi phần cứng hay phần mềm chỉ làm thời gian chạy thay đổi một hằng số lần; còn tốc độ tăng (growth rate) — tuyến tính, bậc hai, hàm mũ… — là tính chất nội tại của thuật toán.</p>
<p class="ghi-chu">Slide này là hình, không trích được chữ nào. Sau khi ước lượng T(n) ở slide 17, phần giảng dưới đây dạy vì sao chỉ có tốc độ tăng là quan trọng; hãy đối chiếu với hình trên bản slide của bạn.</p>
<p class="nhan">Ví dụ của bài — máy B nhanh gấp 100 lần máy A. Mỗi máy xử lý xong đầu vào lớn cỡ nào trong một giây?</p>
<pre><code class="language-java">import java.util.Locale;

public class FasterMachine {
    interface F { double at(double n); }               // một hàm tăng trưởng f(n)

    // n lớn nhất sao cho f(n) &lt;= budget (f tăng theo n)
    static long maxN(F f, double budget) {
        long lo = 1, hi = 2;
        while (f.at(hi) &lt;= budget) { lo = hi; hi *= 2; }
        while (hi - lo &gt; 1) {                          // tìm nhị phân giữa lo (vừa) và hi (quá lớn)
            long mid = (lo + hi) / 2;
            if (f.at(mid) &lt;= budget) lo = mid; else hi = mid;
        }
        return lo;
    }

    public static void main(String[] args) {
        String[] name = {"n", "n log2 n", "n^2", "n^3", "2^n"};
        F[] f = {
            n -&gt; n,
            n -&gt; n * Math.log(n) / Math.log(2),
            n -&gt; n * n,
            n -&gt; n * n * n,
            n -&gt; Math.pow(2, n)
        };
        System.out.println("f(n)       machine A (1e6 steps/s)   machine B (1e8 steps/s)   gain");
        for (int k = 0; k &lt; f.length; k++) {
            long a = maxN(f[k], 1e6), b = maxN(f[k], 1e8);  // đầu vào lớn nhất giải xong trong 1 giây
            String gain = k == 4 ? "+" + (b - a) : String.format(Locale.ROOT, "x%.1f", (double) b / a);
            System.out.println(String.format(Locale.ROOT, "%-9s %14d %25d %10s", name[k], a, b, gain));
        }
    }
}</code></pre>
<div class="out">f(n) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;machine A (1e6 steps/s) &nbsp;&nbsp;machine B (1e8 steps/s) &nbsp;&nbsp;gain<br>
n &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1000000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;100000000 &nbsp;&nbsp;&nbsp;&nbsp;x100.0<br>
n log2 n &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;62746 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4523071 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;x72.1<br>
n^2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;x10.0<br>
n^3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;100 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;464 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;x4.6<br>
2^n &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;19 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;26 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+7</div>
<ul>
<li>Với thuật toán tuyến tính, tốc độ gấp 100 thì đầu vào xử lý được cũng gấp 100.</li>
<li>Với n² chỉ còn gấp 10, với n³ khoảng 4,6 lần.</li>
<li>Với 2ⁿ chỉ cộng thêm được 7 vào n: từ 19 lên 26 phần tử. Không nâng cấp phần cứng nào cứu được thuật toán hàm mũ (exponential).</li>
<li>Ngược lại, thay thuật toán O(n²) bằng thuật toán O(n log n) có lợi hơn mua máy nhanh hơn, khi n đủ lớn.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> máy nhanh hơn chỉ dịch đường cong đi; thuật toán tốt hơn mới đổi được hình dạng của nó.</p>`],
      [19, 'Constant factors and lower-order terms (figure)',
        `<p class="y-chinh">🎯 The growth rate is not affected by constant factors or by lower-order terms: 10²n + 10⁵ is still linear, and 10⁵n² + 10⁸n is still quadratic.</p>
<p class="ghi-chu">This slide is a picture and no text could be extracted from it. Just before Big-O (slide 20), this block teaches why constants and smaller terms are dropped; compare with the picture on your copy.</p>
<pre><code class="language-java">import java.util.Locale;

public class ConstantFactors {
    public static void main(String[] args) {
        // Divide by the dominant term and watch the ratio settle
        System.out.println("           n   (10^2 n + 10^5) / n   (10^5 n^2 + 10^8 n) / n^2");
        for (double n = 10; n &lt;= 1e7; n *= 100) {
            double f = 1e2 * n + 1e5;                  // linear: 100n + 100000
            double g = 1e5 * n * n + 1e8 * n;          // quadratic: 100000n^2 + 100000000n
            System.out.println(String.format(Locale.ROOT, "%12.0f %21.2f %27.2f", n, f / n, g / (n * n)));
        }
        // A big constant only delays the moment the faster-growing function wins
        for (long n : new long[] {10, 50, 100, 101, 1000})
            System.out.println("n = " + n + ": 100n = " + 100 * n + ", n^2 = " + n * n + (n * n &gt; 100 * n ? "   &lt;- n^2 is now bigger" : ""));
    }
}</code></pre>
<div class="out">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;n &nbsp;&nbsp;(10^2 n + 10^5) / n &nbsp;&nbsp;(10^5 n^2 + 10^8 n) / n^2<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10100.00 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10100000.00<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;200.00 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;200000.00<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;100000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;101.00 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;101000.00<br>
&nbsp;&nbsp;&nbsp;&nbsp;10000000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;100.01 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;100010.00<br>
n = 10: 100n = 1000, n^2 = 100<br>
n = 50: 100n = 5000, n^2 = 2500<br>
n = 100: 100n = 10000, n^2 = 10000<br>
n = 101: 100n = 10100, n^2 = 10201 &nbsp;&nbsp;&lt;- n^2 is now bigger<br>
n = 1000: 100n = 100000, n^2 = 1000000 &nbsp;&nbsp;&lt;- n^2 is now bigger</div>
<ul>
<li>Divide each function by its dominant term: the ratio settles to a constant (100 and 10⁵). The other terms fade as n grows.</li>
<li>A big constant only <strong>delays</strong> the moment the faster-growing function wins: 100n ≥ n² up to n = 100, and from n = 101 on n² is bigger — for ever.</li>
<li>So two functions with the same dominant power of n belong to the same growth class, whatever their constants.</li>
</ul>
<p>Big-O (next slide) is simply a precise way of saying "ignore the constants and the smaller terms".</p>
<div class="pitfall">Constants still matter in practice when n is small (slide 33 shows binary search losing to sequential search on tiny arrays) — they just never change the Big-O class.</div>`,
        `<p class="y-chinh">🎯 Tốc độ tăng không bị ảnh hưởng bởi hệ số hằng (constant factor) hay các số hạng bậc thấp (lower-order term): 10²n + 10⁵ vẫn là tuyến tính, 10⁵n² + 10⁸n vẫn là bậc hai.</p>
<p class="ghi-chu">Slide này là hình, không trích được chữ nào. Ngay trước Big-O (ký hiệu O lớn, slide 20), phần giảng dưới đây dạy vì sao bỏ được hằng số và các số hạng nhỏ; hãy đối chiếu với hình trên bản slide của bạn.</p>
<pre><code class="language-java">import java.util.Locale;

public class ConstantFactors {
    public static void main(String[] args) {
        // Chia cho số hạng trội và xem tỉ số ổn định dần
        System.out.println("           n   (10^2 n + 10^5) / n   (10^5 n^2 + 10^8 n) / n^2");
        for (double n = 10; n &lt;= 1e7; n *= 100) {
            double f = 1e2 * n + 1e5;                  // tuyến tính
            double g = 1e5 * n * n + 1e8 * n;          // bậc hai
            System.out.println(String.format(Locale.ROOT, "%12.0f %21.2f %27.2f", n, f / n, g / (n * n)));
        }
        // Hằng số lớn chỉ làm chậm lúc hàm tăng nhanh hơn vượt lên
        for (long n : new long[] {10, 50, 100, 101, 1000})
            System.out.println("n = " + n + ": 100n = " + 100 * n + ", n^2 = " + n * n + (n * n &gt; 100 * n ? "   &lt;- n^2 is now bigger" : ""));
    }
}</code></pre>
<div class="out">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;n &nbsp;&nbsp;(10^2 n + 10^5) / n &nbsp;&nbsp;(10^5 n^2 + 10^8 n) / n^2<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10100.00 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10100000.00<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;200.00 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;200000.00<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;100000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;101.00 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;101000.00<br>
&nbsp;&nbsp;&nbsp;&nbsp;10000000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;100.01 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;100010.00<br>
n = 10: 100n = 1000, n^2 = 100<br>
n = 50: 100n = 5000, n^2 = 2500<br>
n = 100: 100n = 10000, n^2 = 10000<br>
n = 101: 100n = 10100, n^2 = 10201 &nbsp;&nbsp;&lt;- n^2 is now bigger<br>
n = 1000: 100n = 100000, n^2 = 1000000 &nbsp;&nbsp;&lt;- n^2 is now bigger</div>
<ul>
<li>Chia mỗi hàm cho số hạng trội (dominant term) của nó: tỉ số ổn định dần về một hằng số (100 và 10⁵). Các số hạng còn lại mờ dần khi n tăng.</li>
<li>Hằng số lớn chỉ <strong>làm chậm</strong> lúc hàm tăng nhanh hơn vượt lên: 100n ≥ n² cho tới n = 100, còn từ n = 101 trở đi n² lớn hơn — mãi mãi.</li>
<li>Vì thế hai hàm có cùng lũy thừa trội của n thuộc cùng một lớp tăng trưởng, hằng số của chúng là bao nhiêu cũng vậy.</li>
</ul>
<p>Big-O (slide sau) chỉ là cách nói chính xác của câu "bỏ qua hằng số và các số hạng nhỏ".</p>
<div class="pitfall">Trong thực tế hằng số vẫn quan trọng khi n nhỏ (slide 33 cho thấy tìm nhị phân thua tìm tuần tự trên mảng rất nhỏ) — chỉ là chúng không bao giờ làm đổi lớp Big-O.</div>`],
      [20, 'Big-Oh Notation',
        `<p class="y-chinh">🎯 Big-O notation describes an upper bound on how fast a function grows; its relatives o, Ω, ω and Θ describe the other kinds of bounds.</p>
<ul>
<li><strong>Other names</strong> listed on the slide: Big Oh, Landau notation, Bachmann–Landau notation, asymptotic notation — all the same thing.</li>
<li><strong>Upper bound</strong>: "f(n) is O(g(n))" says f grows <em>no faster than</em> g, up to a constant factor, for large n. It does not say that f grows exactly like g.</li>
<li><strong>Formally</strong> (slide 22): f(n) is O(g(n)) if there are constants c &gt; 0 and n0 ≥ 1 such that f(n) ≤ c·g(n) for every n ≥ n0.</li>
</ul>
<table>
<thead><tr><th>Notation</th><th>Kind of bound</th><th>Read it like</th></tr></thead>
<tbody>
<tr><td>f is O(g)</td><td>upper bound</td><td>f ≤ g (up to a constant, for large n)</td></tr>
<tr><td>f is Ω(g)</td><td>lower bound</td><td>f ≥ g</td></tr>
<tr><td>f is Θ(g)</td><td>tight bound — both O and Ω</td><td>f = g</td></tr>
<tr><td>f is o(g)</td><td>strict upper bound</td><td>f &lt; g — e.g. n is o(n²)</td></tr>
<tr><td>f is ω(g)</td><td>strict lower bound</td><td>f &gt; g — e.g. n² is ω(n)</td></tr>
</tbody>
</table>
<p>CSD201 uses O almost everywhere, and Θ when it wants to say "exactly this order"; Ω and Θ come back in lesson 0.D.</p>
<div class="pitfall">Because O is only an upper bound, "n is O(n²)" is <strong>true</strong> — a favourite FE trap. It is simply not the best (tightest) answer; the tight one is O(n).</div>`,
        `<p class="y-chinh">🎯 Ký hiệu Big-O (O lớn) mô tả một cận trên (upper bound) của tốc độ tăng của một hàm; các "họ hàng" o, Ω, ω và Θ mô tả những kiểu cận khác.</p>
<ul>
<li><strong>Các tên gọi khác</strong> mà slide liệt kê: Big Oh, ký hiệu Landau, ký hiệu Bachmann–Landau, ký hiệu tiệm cận (asymptotic notation) — đều là một thứ.</li>
<li><strong>Cận trên</strong>: "f(n) là O(g(n))" nói rằng f tăng <em>không nhanh hơn</em> g, sai khác một hằng số, khi n lớn. Nó không nói f tăng giống hệt g.</li>
<li><strong>Định nghĩa chặt chẽ</strong> (slide 22): f(n) là O(g(n)) nếu có các hằng số c &gt; 0 và n0 ≥ 1 sao cho f(n) ≤ c·g(n) với mọi n ≥ n0.</li>
</ul>
<table>
<thead><tr><th>Ký hiệu</th><th>Loại cận</th><th>Đọc như</th></tr></thead>
<tbody>
<tr><td>f là O(g)</td><td>cận trên</td><td>f ≤ g (sai khác hằng số, khi n lớn)</td></tr>
<tr><td>f là Ω(g)</td><td>cận dưới (lower bound)</td><td>f ≥ g</td></tr>
<tr><td>f là Θ(g)</td><td>cận chặt (tight bound) — vừa O vừa Ω</td><td>f = g</td></tr>
<tr><td>f là o(g)</td><td>cận trên ngặt</td><td>f &lt; g — ví dụ n là o(n²)</td></tr>
<tr><td>f là ω(g)</td><td>cận dưới ngặt</td><td>f &gt; g — ví dụ n² là ω(n)</td></tr>
</tbody>
</table>
<p>CSD201 dùng O gần như ở mọi nơi, và dùng Θ khi muốn nói "đúng bậc này"; Ω và Θ sẽ quay lại ở bài 0.D.</p>
<div class="pitfall">Vì O chỉ là cận trên nên "n là O(n²)" là <strong>ĐÚNG</strong> — một cái bẫy FE (thi cuối kỳ) rất hay gặp. Nó chỉ không phải câu trả lời tốt nhất (chặt nhất); câu trả lời chặt là O(n).</div>`],
      [21, 'big-oh notation pronouncement',
        `<p class="y-chinh">🎯 How to say Big-O out loud — the slide writes "O to the one", "O to the n / Big-O of n" and "O to the log2 n"; in interviews you will mostly hear "O of …" together with the name of the class.</p>
<table>
<thead><tr><th>Written</th><th>The slide says</th><th>Also commonly said</th><th>Class name</th></tr></thead>
<tbody>
<tr><td>O(1)</td><td>O to the one</td><td>"O of one", "constant time"</td><td>constant</td></tr>
<tr><td>O(log2 n)</td><td>O to the log2 n</td><td>"O of log n", "logarithmic time"</td><td>logarithmic</td></tr>
<tr><td>O(n)</td><td>O to the n, Big-O of n</td><td>"O of n", "linear time"</td><td>linear</td></tr>
<tr><td>O(n log n)</td><td>—</td><td>"O of n log n"</td><td>linearithmic (n log n)</td></tr>
<tr><td>O(n²)</td><td>—</td><td>"O of n squared", "quadratic time"</td><td>quadratic</td></tr>
<tr><td>O(2ⁿ)</td><td>—</td><td>"O of two to the n", "exponential time"</td><td>exponential</td></tr>
</tbody>
</table>
<ul>
<li>"Big-O" itself is read "big oh" — the letter O, not zero.</li>
<li>In English "to the" usually announces a power ("n to the two" = n²), so "O of n" is the safer way to say O(n) in an interview.</li>
<li>Inside O( ) the base of the logarithm is usually dropped: O(log2 n) and O(log n) are the same class (lesson 0.D, slide 25, shows why).</li>
<li>Answering with the class name is fine too: "binary search is logarithmic, linear search is linear".</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> say "O of …" plus the class name — "O of n, linear" — and nobody will misunderstand you.</p>`,
        `<p class="y-chinh">🎯 Cách đọc Big-O (ký hiệu O lớn) thành lời — slide ghi "O to the one", "O to the n / Big-O of n" và "O to the log2 n"; khi phỏng vấn bạn sẽ hay nghe "O of …" kèm tên của lớp độ phức tạp.</p>
<table>
<thead><tr><th>Viết</th><th>Slide đọc</th><th>Cách đọc phổ biến khác</th><th>Tên lớp</th></tr></thead>
<tbody>
<tr><td>O(1)</td><td>O to the one</td><td>"O of one", "constant time"</td><td>hằng (constant)</td></tr>
<tr><td>O(log2 n)</td><td>O to the log2 n</td><td>"O of log n", "logarithmic time"</td><td>logarit (logarithmic)</td></tr>
<tr><td>O(n)</td><td>O to the n, Big-O of n</td><td>"O of n", "linear time"</td><td>tuyến tính (linear)</td></tr>
<tr><td>O(n log n)</td><td>—</td><td>"O of n log n"</td><td>n log n (linearithmic)</td></tr>
<tr><td>O(n²)</td><td>—</td><td>"O of n squared", "quadratic time"</td><td>bậc hai (quadratic)</td></tr>
<tr><td>O(2ⁿ)</td><td>—</td><td>"O of two to the n", "exponential time"</td><td>hàm mũ (exponential)</td></tr>
</tbody>
</table>
<ul>
<li>Bản thân "Big-O" đọc là "big âu" — chữ cái O, không phải số 0.</li>
<li>Trong tiếng Anh "to the" thường báo hiệu một lũy thừa ("n to the two" = n²), nên nói "O of n" là cách an toàn hơn để đọc O(n) khi phỏng vấn.</li>
<li>Bên trong O( ) người ta thường bỏ cơ số của logarit: O(log2 n) và O(log n) là cùng một lớp (bài 0.D, slide 25, giải thích vì sao).</li>
<li>Trả lời bằng tên lớp cũng được: "tìm nhị phân là logarit, tìm tuần tự là tuyến tính".</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> nói "O of …" kèm tên lớp — "O of n, linear" — thì không ai hiểu nhầm bạn.</p>`],
      [22, 'Big-Oh definition (figure)',
        `<p class="y-chinh">🎯 Definition: f(n) is O(g(n)) if there exist a real constant c &gt; 0 and an integer constant n0 ≥ 1 such that f(n) ≤ c·g(n) for every n ≥ n0.</p>
<p class="ghi-chu">This slide is a picture and no text could be extracted from it. Between the slides that introduce Big-O (20–21) and the one that explains it (23), this block states the standard textbook definition and applies it; compare with the picture on your copy.</p>
<ul>
<li><strong>c</strong> absorbs constant factors; <strong>n0</strong> lets us ignore small inputs — the inequality only has to hold from n0 on.</li>
<li><strong>To prove</strong> that f(n) is O(g(n)), exhibit one pair (c, n0) and show the inequality with algebra.</li>
<li><strong>Example</strong>: 2n + 10 is O(n). We need 2n + 10 ≤ c·n, that is (c − 2)·n ≥ 10. Take c = 3: it holds when n ≥ 10, so n0 = 10.</li>
<li><strong>To disprove</strong>, show that no pair works: n² ≤ c·n would mean n ≤ c, which fails as soon as n = c + 1, whatever c you pick — so n² is not O(n).</li>
</ul>
<pre><code class="language-java">import java.util.Locale;

public class BigOhProof {
    public static void main(String[] args) {
        // Claim: f(n) = 2n + 10 is O(n), witnesses c = 3 and n0 = 10
        System.out.println(" n   f(n) = 2n + 10   c*g(n) = 3n   f(n) &lt;= 3n ?");
        for (int n : new int[] {1, 5, 9, 10, 11, 12, 100}) {
            int f = 2 * n + 10, cg = 3 * n;
            System.out.println(String.format(Locale.ROOT, "%3d %12d %14d          %s", n, f, cg, f &lt;= cg ? "yes" : "no"));
        }
        int bad = 0;
        for (int n = 10; n &lt;= 1000000; n++) if (2 * n + 10 &gt; 3 * n) bad++;
        System.out.println("checked n = 10 .. 1000000: " + bad + " counterexamples");

        // n^2 is NOT O(n): whatever c we pick, n^2 &lt;= c*n breaks at n = c + 1
        for (long c : new long[] {10, 1000, 1000000}) {
            long n = 1;
            while (n * n &lt;= c * n) n++;
            System.out.println("c = " + c + ": n^2 &lt;= c*n first fails at n = " + n);
        }
    }
}</code></pre>
<div class="out">&nbsp;n &nbsp;&nbsp;f(n) = 2n + 10 &nbsp;&nbsp;c*g(n) = 3n &nbsp;&nbsp;f(n) &lt;= 3n ?<br>
&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;12 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;no<br>
&nbsp;&nbsp;5 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;15 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;no<br>
&nbsp;&nbsp;9 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;28 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;27 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;no<br>
&nbsp;10 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;30 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;30 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;yes<br>
&nbsp;11 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;32 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;33 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;yes<br>
&nbsp;12 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;34 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;36 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;yes<br>
100 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;210 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;300 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;yes<br>
checked n = 10 .. 1000000: 0 counterexamples<br>
c = 10: n^2 &lt;= c*n first fails at n = 11<br>
c = 1000: n^2 &lt;= c*n first fails at n = 1001<br>
c = 1000000: n^2 &lt;= c*n first fails at n = 1000001</div>
<p>The program only illustrates: a finite check is not a proof — the algebra above is. It also shows every candidate c breaking at n = c + 1 for n².</p>
<div class="pitfall">c and n0 are not unique: (c = 3, n0 = 10), (c = 4, n0 = 5) and (c = 12, n0 = 1) all prove that 2n + 10 is O(n). An FE option such as "n0 must be 10" is wrong.</div>`,
        `<p class="y-chinh">🎯 Định nghĩa: f(n) là O(g(n)) nếu tồn tại một hằng số thực c &gt; 0 và một hằng số nguyên n0 ≥ 1 sao cho f(n) ≤ c·g(n) với mọi n ≥ n0.</p>
<p class="ghi-chu">Slide này là hình, không trích được chữ nào. Nằm giữa các slide giới thiệu Big-O (O lớn, slide 20–21) và slide giải thích nó (23), phần giảng dưới đây nêu định nghĩa chuẩn của giáo trình và áp dụng nó; hãy đối chiếu với hình trên bản slide của bạn.</p>
<ul>
<li><strong>c</strong> "nuốt" các hệ số hằng; <strong>n0</strong> cho phép bỏ qua các đầu vào nhỏ — bất đẳng thức chỉ cần đúng từ n0 trở đi.</li>
<li><strong>Muốn chứng minh</strong> f(n) là O(g(n)), chỉ ra một cặp (c, n0) và chứng minh bất đẳng thức bằng đại số.</li>
<li><strong>Ví dụ</strong>: 2n + 10 là O(n). Cần 2n + 10 ≤ c·n, tức là (c − 2)·n ≥ 10. Chọn c = 3: bất đẳng thức đúng khi n ≥ 10, vậy n0 = 10.</li>
<li><strong>Muốn bác bỏ</strong>, chỉ ra không cặp nào dùng được: n² ≤ c·n nghĩa là n ≤ c, điều này sai ngay khi n = c + 1, dù bạn chọn c bao nhiêu — vậy n² không phải O(n).</li>
</ul>
<pre><code class="language-java">import java.util.Locale;

public class BigOhProof {
    public static void main(String[] args) {
        // Mệnh đề: f(n) = 2n + 10 là O(n), cặp chứng cứ c = 3 và n0 = 10
        System.out.println(" n   f(n) = 2n + 10   c*g(n) = 3n   f(n) &lt;= 3n ?");
        for (int n : new int[] {1, 5, 9, 10, 11, 12, 100}) {
            int f = 2 * n + 10, cg = 3 * n;
            System.out.println(String.format(Locale.ROOT, "%3d %12d %14d          %s", n, f, cg, f &lt;= cg ? "yes" : "no"));
        }
        int bad = 0;
        for (int n = 10; n &lt;= 1000000; n++) if (2 * n + 10 &gt; 3 * n) bad++;
        System.out.println("checked n = 10 .. 1000000: " + bad + " counterexamples");

        // n^2 KHÔNG là O(n): chọn c nào thì n^2 &lt;= c*n cũng gãy ở n = c + 1
        for (long c : new long[] {10, 1000, 1000000}) {
            long n = 1;
            while (n * n &lt;= c * n) n++;
            System.out.println("c = " + c + ": n^2 &lt;= c*n first fails at n = " + n);
        }
    }
}</code></pre>
<div class="out">&nbsp;n &nbsp;&nbsp;f(n) = 2n + 10 &nbsp;&nbsp;c*g(n) = 3n &nbsp;&nbsp;f(n) &lt;= 3n ?<br>
&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;12 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;no<br>
&nbsp;&nbsp;5 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;15 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;no<br>
&nbsp;&nbsp;9 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;28 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;27 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;no<br>
&nbsp;10 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;30 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;30 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;yes<br>
&nbsp;11 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;32 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;33 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;yes<br>
&nbsp;12 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;34 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;36 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;yes<br>
100 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;210 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;300 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;yes<br>
checked n = 10 .. 1000000: 0 counterexamples<br>
c = 10: n^2 &lt;= c*n first fails at n = 11<br>
c = 1000: n^2 &lt;= c*n first fails at n = 1001<br>
c = 1000000: n^2 &lt;= c*n first fails at n = 1000001</div>
<p>Chương trình chỉ để minh hoạ: kiểm tra một số hữu hạn giá trị không phải là chứng minh — phần đại số ở trên mới là chứng minh. Nó cũng cho thấy với n², c nào cũng gãy tại n = c + 1.</p>
<div class="pitfall">c và n0 không duy nhất: (c = 3, n0 = 10), (c = 4, n0 = 5) hay (c = 12, n0 = 1) đều chứng minh được 2n + 10 là O(n). Phương án FE (thi cuối kỳ) kiểu "n0 bắt buộc phải là 10" là SAI.</div>`],
      [23, 'When we say f(n) is O(g(n))',
        `<p class="y-chinh">🎯 Saying "f(n) is O(g(n))" uses g(n) as a speed limit: as n goes to infinity, f(n) may never grow faster than a constant times g(n).</p>
<ul>
<li>Only the long run counts: what f does for small n is irrelevant — that is the role of n0.</li>
<li>A handy test: if the ratio f(n)/g(n) stays below some constant as n grows, f(n) is O(g(n)); if the ratio grows without limit, it is not.</li>
<li>g(n) is a <em>ceiling</em>, not a portrait: 5n is O(n), and also O(n²) and O(2ⁿ) — all true, but only O(n) is informative.</li>
</ul>
<pre><code class="language-java">import java.util.Locale;

public class RatioTest {
    public static void main(String[] args) {
        System.out.println("      n   (3n^2 + 20n + 5) / n^2      n^2 / n");
        for (double n = 1; n &lt;= 1e5; n *= 10) {
            double f1 = 3 * n * n + 20 * n + 5;       // f(n) = 3n^2 + 20n + 5, g(n) = n^2
            double f2 = n * n;                         // f(n) = n^2, g(n) = n
            System.out.println(String.format(Locale.ROOT, "%7.0f %24.6f %12.0f", n, f1 / (n * n), f2 / n));
        }
        // left ratio stays below a constant -&gt; O(n^2); right ratio has no ceiling -&gt; not O(n)
    }
}</code></pre>
<div class="out">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;n &nbsp;&nbsp;(3n^2 + 20n + 5) / n^2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;n^2 / n<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;28.000000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5.050000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10<br>
&nbsp;&nbsp;&nbsp;&nbsp;100 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.200500 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;100<br>
&nbsp;&nbsp;&nbsp;1000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.020005 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1000<br>
&nbsp;&nbsp;10000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.002000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10000<br>
&nbsp;100000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.000200 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;100000</div>
<p>Left column: (3n² + 20n + 5)/n² falls towards 3 and never exceeds 28, its value at n = 1. So 3n² + 20n + 5 is O(n²) — with c = 28 and n0 = 1, or with c = 4 and n0 = 21 (from there on 20n + 5 ≤ n²).</p>
<p>Right column: n²/n = n keeps growing, so n² is not O(n) — the same conclusion as slide 22.</p>
<p class="meo">🧠 <strong>Remember:</strong> O(g) is a speed-limit sign — after n0, f may drive slower, never faster.</p>`,
        `<p class="y-chinh">🎯 Nói "f(n) là O(g(n))" là dùng g(n) làm giới hạn tốc độ: khi n tiến tới vô cùng, f(n) không bao giờ được tăng nhanh hơn một hằng số nhân với g(n).</p>
<ul>
<li>Chỉ tính chuyện về lâu dài: f làm gì khi n nhỏ không quan trọng — đó là vai trò của n0.</li>
<li>Một phép thử tiện lợi: nếu tỉ số f(n)/g(n) luôn nằm dưới một hằng số nào đó khi n tăng thì f(n) là O(g(n)); nếu tỉ số tăng không giới hạn thì không phải.</li>
<li>g(n) là cái <em>trần nhà</em>, không phải bức chân dung: 5n là O(n), và cũng là O(n²), O(2ⁿ) — đều đúng, nhưng chỉ O(n) là có ích.</li>
</ul>
<pre><code class="language-java">import java.util.Locale;

public class RatioTest {
    public static void main(String[] args) {
        System.out.println("      n   (3n^2 + 20n + 5) / n^2      n^2 / n");
        for (double n = 1; n &lt;= 1e5; n *= 10) {
            double f1 = 3 * n * n + 20 * n + 5;       // f(n) = 3n^2 + 20n + 5, g(n) = n^2
            double f2 = n * n;                         // f(n) = n^2, g(n) = n
            System.out.println(String.format(Locale.ROOT, "%7.0f %24.6f %12.0f", n, f1 / (n * n), f2 / n));
        }
        // tỉ số trái bị chặn bởi một hằng -&gt; O(n^2); tỉ số phải không có trần -&gt; không là O(n)
    }
}</code></pre>
<div class="out">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;n &nbsp;&nbsp;(3n^2 + 20n + 5) / n^2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;n^2 / n<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;28.000000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5.050000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10<br>
&nbsp;&nbsp;&nbsp;&nbsp;100 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.200500 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;100<br>
&nbsp;&nbsp;&nbsp;1000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.020005 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1000<br>
&nbsp;&nbsp;10000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.002000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10000<br>
&nbsp;100000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.000200 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;100000</div>
<p>Cột trái: (3n² + 20n + 5)/n² giảm dần về 3 và không bao giờ vượt 28, giá trị của nó tại n = 1. Vậy 3n² + 20n + 5 là O(n²) — với c = 28 và n0 = 1, hoặc với c = 4 và n0 = 21 (từ đó trở đi 20n + 5 ≤ n²).</p>
<p>Cột phải: n²/n = n cứ tăng mãi, nên n² không phải O(n) — cùng kết luận với slide 22.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> O(g) là biển báo tốc độ tối đa — sau n0, f được chạy chậm hơn, không bao giờ được chạy nhanh hơn.</p>`],
    ]),
    bi(`<h3>✅ Check yourself</h3>
<ol>
<li>Why can't wall-clock times measured on two different machines tell you which algorithm is better?</li>
<li>arrayMax on n elements: how many times is the comparison <code>currentMax &lt; A[i]</code> executed, and what is the Big-O?</li>
<li>Prove that n² + 1000n is O(n²) by giving c and n0.</li>
<li>True or false: 5n + 3 is O(n²).</li>
<li>Linear search among n elements: how many comparisons in the best case, and in the worst case?</li>
</ol>
<p class="dap-an">✅ <strong>Answers:</strong> (1) the time mixes the speed of the machine with the efficiency of the algorithm; count operations instead. (2) n − 1 times → O(n). (3) c = 2, n0 = 1000: n² + 1000n ≤ 2n² ⇔ 1000n ≤ n² ⇔ n ≥ 1000. (4) true — O is an upper bound — but the tight answer is O(n). (5) 1 in the best case, n in the worst case.</p>
<p><strong>Next:</strong> lesson 0.D — part 2 of this deck (the Big-O rules, Ω and Θ, the classic search examples, amortized cost, NP). Then the deep-dive lesson 0.3 "Big-O: the language of efficiency" below, and lesson 0.5 (practice for Section 0). To run this lesson's programs on your own machine, lesson 0.4 sets up the JDK and Eclipse; lessons 0.0–0.2 cover the course materials, the course map and the grading.</p>`,
    `<h3>✅ Tự kiểm tra</h3>
<ol>
<li>Vì sao thời gian đồng hồ đo trên hai máy khác nhau không cho biết thuật toán nào tốt hơn?</li>
<li>arrayMax trên n phần tử: phép so sánh <code>currentMax &lt; A[i]</code> chạy bao nhiêu lần, và Big-O (O lớn) là gì?</li>
<li>Chứng minh n² + 1000n là O(n²) bằng cách chỉ ra c và n0.</li>
<li>Đúng hay sai: 5n + 3 là O(n²).</li>
<li>Tìm tuần tự trong n phần tử: trường hợp tốt nhất bao nhiêu lần so sánh, xấu nhất bao nhiêu lần?</li>
</ol>
<p class="dap-an">✅ <strong>Đáp án:</strong> (1) thời gian đo được trộn lẫn tốc độ của máy với hiệu quả của thuật toán; hãy đếm phép toán thay vì bấm giờ. (2) n − 1 lần → O(n). (3) c = 2, n0 = 1000: n² + 1000n ≤ 2n² ⇔ 1000n ≤ n² ⇔ n ≥ 1000. (4) đúng — O là cận trên — nhưng câu trả lời chặt là O(n). (5) tốt nhất 1 lần, xấu nhất n lần.</p>
<p><strong>Học tiếp:</strong> bài 0.D — phần 2 của bộ slide này (các quy tắc Big-O, Ω và Θ, các ví dụ tìm kiếm kinh điển, chi phí khấu hao, NP). Sau đó là bài đào sâu 0.3 "Big-O: ngôn ngữ của hiệu năng" bên dưới, và bài 0.5 (thực hành của Mục 0). Muốn tự chạy các chương trình của bài này trên máy mình, bài 0.4 hướng dẫn cài JDK và Eclipse; bài 0.0–0.2 nói về tài liệu, bản đồ môn học và cách tính điểm.</p>`),
    books([
      ['goodrich', 'Ch.4 Algorithm Analysis — §4.1 Experimental Studies · §4.2 The Seven Functions Used in This Book · §4.3 Asymptotic Analysis (the "Big-Oh" notation)', 'Chương 4 Algorithm Analysis — §4.1 Experimental Studies (nghiên cứu thực nghiệm) · §4.2 The Seven Functions Used in This Book (bảy hàm dùng trong sách) · §4.3 Asymptotic Analysis (phân tích tiệm cận, ký hiệu Big-Oh)'],
    ]),
  ].join('\n'),
};

/* ───────── 0.D — 📑 Slide by slide · Complexity analysis, part 2: Big-O rules, amortized cost, NP (ComplexityAnalysis, slides 24–46) ───────── */
const L_csd3_2 = {
  title: '0.D — 📑 Slide by slide · Complexity analysis, part 2: Big-O rules, amortized cost, NP (ComplexityAnalysis, slides 24–46)|||0.D — 📑 Học theo từng slide · Độ phức tạp, phần 2: quy tắc Big-O, khấu hao, NP (ComplexityAnalysis, slide 24–46)',
  slug: 'csd201-slide-csd3-2',
  type: 'VIDEO',
  isFreePreview: true,
  description: 'Giảng từng slide 24–46 của bộ ComplexityAnalysis: quy tắc tổng, tích, bắc cầu của Big-O, Big-Ω và Big-Θ, các bậc tăng thường gặp, tìm tuần tự vs nhị phân, ba ví dụ max / tìm tuyến tính / tìm nhị phân (chỉ ra lỗi key > mid trên slide 37), phân tích khấu hao của mảng nhân đôi bằng hàm thế, P, NP, rút gọn, NP-đầy đủ — 20 chương trình Java chạy thật.',
  content: [
    bi(`<span class="eyebrow">Section 0 · Lesson 0.D · ComplexityAnalysis, slides 24–46</span>
<h2>Complexity analysis, part 2 — Big-O rules, examples, amortized cost and NP, slide by slide</h2>
<p class="lead">Part 1 (lesson 0.C) defined Big-O. This part turns it into a tool: the rules that compute Big-O without re-proving the definition every time, the lower and tight bounds Ω and Θ, the common growth orders, three classic examples worked on the deck's own pseudocode (maximum, linear search, binary search — with a bug to catch on slide 37), the amortized cost of a growing array, and a first look at P, NP and NP-completeness.</p>
<div class="callout"><strong>What the exams do with it:</strong> the FE and the oral questions of the syllabus keep asking "what is the complexity of …?" — AVL search (CQ6.3), the basic sorts (CQ14.1), brute-force and KMP matching (CQ18.2–18.3). Slides 24–37 are the method for answering; slide 37 is also the binary search you will write again in chapter 3 and meet in binary search trees in chapter 4. Amortized O(1) explains why <code>ArrayList.add</code> is fast (lesson 1.A, slide 21).</div>
<h3>The whole of part 2 in one table</h3>
<table>
<thead><tr><th>Idea</th><th>Rule or result</th><th>Slides</th></tr></thead>
<tbody>
<tr><td>Sum rule</td><td>f1 is O(g1), f2 is O(g2) ⇒ f1 + f2 is O(max(g1, g2))</td><td>24</td></tr>
<tr><td>Product rule</td><td>f1·f2 is O(g1·g2)</td><td>24</td></tr>
<tr><td>Transitivity</td><td>f is O(g), g is O(h) ⇒ f is O(h)</td><td>24</td></tr>
<tr><td>Polynomials and logs</td><td>a degree-d polynomial is O(n<sup>d</sup>); the base of a log does not matter</td><td>25–26</td></tr>
<tr><td>Ω and Θ</td><td>Ω = lower bound, Θ = both bounds (tight)</td><td>27–29</td></tr>
<tr><td>Growth orders</td><td>1 &lt; log n &lt; n &lt; n log n &lt; n² &lt; n<sup>b</sup> &lt; b<sup>n</sup> &lt; n!</td><td>31–32</td></tr>
<tr><td>Classic examples</td><td>max O(n) · linear search O(n) · binary search O(log n)</td><td>33–37</td></tr>
<tr><td>Amortized cost</td><td>doubling array: m adds cost less than 3m in total → O(1) per add</td><td>38–40</td></tr>
<tr><td>NP</td><td>P ⊆ NP · P = NP? unsolved · NP-complete through reductions</td><td>41–46</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Mục 0 · Bài 0.D · ComplexityAnalysis, slide 24–46</span>
<h2>Phân tích độ phức tạp, phần 2 — quy tắc Big-O, ví dụ, chi phí khấu hao và NP, học từng slide</h2>
<p class="lead">Phần 1 (bài 0.C) đã định nghĩa Big-O (ký hiệu O lớn). Phần này biến nó thành công cụ: các quy tắc tính Big-O mà không phải chứng minh lại từ định nghĩa mỗi lần, cận dưới Ω và cận chặt Θ, các bậc tăng thường gặp, ba ví dụ kinh điển làm trên chính mã giả của bộ slide (tìm max, tìm tuần tự, tìm nhị phân — có một lỗi cần bắt ở slide 37), chi phí khấu hao (amortized cost) của một mảng tự lớn dần, và cái nhìn đầu tiên về P, NP và NP-đầy đủ (NP-completeness).</p>
<div class="callout"><strong>Đề thi dùng phần này thế nào:</strong> FE (thi cuối kỳ) và các câu hỏi vấn đáp của syllabus (đề cương môn học) liên tục hỏi "độ phức tạp của … là bao nhiêu?" — tìm kiếm trên cây AVL (CQ6.3), các thuật toán sắp xếp cơ bản (CQ14.1), so khớp vét cạn và KMP (CQ18.2–18.3). Slide 24–37 là phương pháp để trả lời; slide 37 cũng chính là thuật toán tìm nhị phân bạn sẽ viết lại ở chương 3 và gặp lại trong cây nhị phân tìm kiếm ở chương 4. O(1) khấu hao giải thích vì sao <code>ArrayList.add</code> nhanh (bài 1.A, slide 21).</div>
<h3>Cả phần 2 trong một bảng</h3>
<table>
<thead><tr><th>Ý</th><th>Quy tắc hoặc kết quả</th><th>Slide</th></tr></thead>
<tbody>
<tr><td>Quy tắc tổng (sum rule)</td><td>f1 là O(g1), f2 là O(g2) ⇒ f1 + f2 là O(max(g1, g2))</td><td>24</td></tr>
<tr><td>Quy tắc tích (product rule)</td><td>f1·f2 là O(g1·g2)</td><td>24</td></tr>
<tr><td>Tính bắc cầu (transitivity)</td><td>f là O(g), g là O(h) ⇒ f là O(h)</td><td>24</td></tr>
<tr><td>Đa thức và logarit</td><td>đa thức bậc d là O(n<sup>d</sup>); cơ số của log không quan trọng</td><td>25–26</td></tr>
<tr><td>Ω và Θ</td><td>Ω = cận dưới, Θ = cả hai cận (cận chặt)</td><td>27–29</td></tr>
<tr><td>Các bậc tăng</td><td>1 &lt; log n &lt; n &lt; n log n &lt; n² &lt; n<sup>b</sup> &lt; b<sup>n</sup> &lt; n!</td><td>31–32</td></tr>
<tr><td>Ví dụ kinh điển</td><td>max O(n) · tìm tuần tự O(n) · tìm nhị phân O(log n)</td><td>33–37</td></tr>
<tr><td>Chi phí khấu hao</td><td>mảng nhân đôi: m lần thêm tốn tổng cộng ít hơn 3m → O(1) mỗi lần thêm</td><td>38–40</td></tr>
<tr><td>NP</td><td>P ⊆ NP · P = NP? chưa giải được · NP-đầy đủ qua phép rút gọn</td><td>41–46</td></tr>
</tbody>
</table>`),
    walkHead('csd3', 24, 46),
    walk('csd3', [
      [24, 'Properties of Big-Oh',
        `<p class="y-chinh">🎯 Three theorems let you compute Big-O piece by piece: the sum rule, the product rule and transitivity.</p>
<p>The slide's formulas are pictures; these are the standard statements of the three theorems it announces:</p>
<table>
<thead><tr><th>Theorem</th><th>Statement</th><th>Use it for</th></tr></thead>
<tbody>
<tr><td>Sum</td><td>if f1(n) is O(g1(n)) and f2(n) is O(g2(n)), then f1(n) + f2(n) is O(max(g1(n), g2(n)))</td><td>blocks of code that run one after another</td></tr>
<tr><td>Product</td><td>if f1(n) is O(g1(n)) and f2(n) is O(g2(n)), then f1(n)·f2(n) is O(g1(n)·g2(n))</td><td>a loop nested inside another loop</td></tr>
<tr><td>Transitive</td><td>if f(n) is O(g(n)) and g(n) is O(h(n)), then f(n) is O(h(n))</td><td>chaining bounds: 3n + 1 is O(n) and n is O(n²), so 3n + 1 is O(n²)</td></tr>
</tbody>
</table>
<ul>
<li><strong>Why the sum rule holds</strong>: from some n on, f1 ≤ c1·g1 and f2 ≤ c2·g2, so f1 + f2 ≤ (c1 + c2)·max(g1, g2).</li>
<li><strong>Why the product rule holds</strong>: multiply the two inequalities — f1·f2 ≤ (c1·c2)·(g1·g2).</li>
</ul>
<p class="nhan">The lesson's example — count the steps of two code fragments</p>
<pre><code class="language-java">public class SumProductRules {
    static int log2(int n) { int r = 0; while (n &gt; 1) { n /= 2; r++; } return r; }

    public static void main(String[] args) {
        for (int n : new int[] {8, 64, 1024}) {
            long a = 0, b = 0;
            // Fragment A: one loop, THEN a nested loop (in sequence -&gt; sum rule)
            for (int i = 0; i &lt; n; i++) a++;                        // n steps
            for (int i = 0; i &lt; n; i++)
                for (int j = 0; j &lt; n; j++) a++;                    // n * n steps
            // Fragment B: a halving loop INSIDE an n-loop (nested -&gt; product rule)
            for (int i = 0; i &lt; n; i++)
                for (int k = n; k &gt; 1; k /= 2) b++;                 // log2 n steps each time
            System.out.println("n = " + n + ": A = " + a + " (n + n^2 = " + (n + (long) n * n) + ")   B = " + b + " (n * log2 n = " + n * log2(n) + ")");
        }
    }
}</code></pre>
<div class="out">n = 8: A = 72 (n + n^2 = 72) &nbsp;&nbsp;B = 24 (n * log2 n = 24)<br>
n = 64: A = 4160 (n + n^2 = 4160) &nbsp;&nbsp;B = 384 (n * log2 n = 384)<br>
n = 1024: A = 1049600 (n + n^2 = 1049600) &nbsp;&nbsp;B = 10240 (n * log2 n = 10240)</div>
<ul>
<li>Fragment A: n + n² steps. Sum rule: O(max(n, n²)) = <strong>O(n²)</strong> — the smaller block disappears.</li>
<li>Fragment B: a loop of log2 n steps inside a loop of n turns. Product rule: O(n · log n) = <strong>O(n log n)</strong>.</li>
</ul>
<div class="pitfall">Two loops <em>one after the other</em> add up (O(n) + O(n) = O(n)); only loops <em>inside</em> each other multiply (O(n)·O(n) = O(n²)). Writing O(n²) for two separate loops is a common FE mistake.</div>`,
        `<p class="y-chinh">🎯 Ba định lý cho phép tính Big-O (O lớn) từng mảnh một: quy tắc tổng (sum rule), quy tắc tích (product rule) và tính bắc cầu (transitive property).</p>
<p>Công thức trên slide là hình; đây là phát biểu chuẩn của ba định lý mà slide giới thiệu:</p>
<table>
<thead><tr><th>Định lý</th><th>Phát biểu</th><th>Dùng khi</th></tr></thead>
<tbody>
<tr><td>Tổng</td><td>nếu f1(n) là O(g1(n)) và f2(n) là O(g2(n)) thì f1(n) + f2(n) là O(max(g1(n), g2(n)))</td><td>các khối code chạy nối tiếp nhau</td></tr>
<tr><td>Tích</td><td>nếu f1(n) là O(g1(n)) và f2(n) là O(g2(n)) thì f1(n)·f2(n) là O(g1(n)·g2(n))</td><td>một vòng lặp nằm bên trong một vòng lặp khác</td></tr>
<tr><td>Bắc cầu</td><td>nếu f(n) là O(g(n)) và g(n) là O(h(n)) thì f(n) là O(h(n))</td><td>nối các cận lại: 3n + 1 là O(n) và n là O(n²), nên 3n + 1 là O(n²)</td></tr>
</tbody>
</table>
<ul>
<li><strong>Vì sao quy tắc tổng đúng</strong>: từ một n nào đó trở đi, f1 ≤ c1·g1 và f2 ≤ c2·g2, nên f1 + f2 ≤ (c1 + c2)·max(g1, g2).</li>
<li><strong>Vì sao quy tắc tích đúng</strong>: nhân hai bất đẳng thức với nhau — f1·f2 ≤ (c1·c2)·(g1·g2).</li>
</ul>
<p class="nhan">Ví dụ của bài — đếm số bước của hai đoạn code</p>
<pre><code class="language-java">public class SumProductRules {
    static int log2(int n) { int r = 0; while (n &gt; 1) { n /= 2; r++; } return r; }

    public static void main(String[] args) {
        for (int n : new int[] {8, 64, 1024}) {
            long a = 0, b = 0;
            // Đoạn A: một vòng, RỒI một vòng lồng (nối tiếp -&gt; quy tắc tổng)
            for (int i = 0; i &lt; n; i++) a++;                        // n bước
            for (int i = 0; i &lt; n; i++)
                for (int j = 0; j &lt; n; j++) a++;                    // n * n bước
            // Đoạn B: vòng chia đôi NẰM TRONG vòng n (lồng nhau -&gt; quy tắc tích)
            for (int i = 0; i &lt; n; i++)
                for (int k = n; k &gt; 1; k /= 2) b++;                 // mỗi lần log2 n bước
            System.out.println("n = " + n + ": A = " + a + " (n + n^2 = " + (n + (long) n * n) + ")   B = " + b + " (n * log2 n = " + n * log2(n) + ")");
        }
    }
}</code></pre>
<div class="out">n = 8: A = 72 (n + n^2 = 72) &nbsp;&nbsp;B = 24 (n * log2 n = 24)<br>
n = 64: A = 4160 (n + n^2 = 4160) &nbsp;&nbsp;B = 384 (n * log2 n = 384)<br>
n = 1024: A = 1049600 (n + n^2 = 1049600) &nbsp;&nbsp;B = 10240 (n * log2 n = 10240)</div>
<ul>
<li>Đoạn A: n + n² bước. Quy tắc tổng: O(max(n, n²)) = <strong>O(n²)</strong> — khối nhỏ hơn biến mất.</li>
<li>Đoạn B: một vòng lặp log2 n bước nằm trong một vòng lặp n lượt. Quy tắc tích: O(n · log n) = <strong>O(n log n)</strong>.</li>
</ul>
<div class="pitfall">Hai vòng lặp <em>nối tiếp nhau</em> thì cộng (O(n) + O(n) = O(n)); chỉ vòng lặp <em>lồng trong nhau</em> mới nhân (O(n)·O(n) = O(n²)). Ghi O(n²) cho hai vòng lặp tách rời là lỗi FE (thi cuối kỳ) hay gặp.</div>`],
      [25, 'Big-Oh of polynomials and logarithms (figure)',
        `<p class="y-chinh">🎯 Two consequences of the rules are used constantly: a polynomial of degree d is O(n<sup>d</sup>), and the base of a logarithm does not matter inside O( ).</p>
<p class="ghi-chu">This slide is a picture and no text could be extracted from it. Slides 24–29 of the deck deal with the properties of Big-O and its relatives, so this block teaches the two properties used most often in practice; compare with the picture on your copy.</p>
<ul>
<li><strong>Polynomials</strong>: 5n³ − 2n² + 7 ≤ 5n³ + 2n³ + 7n³ = 14n³ for n ≥ 1, so it is O(n³). In general a<sub>d</sub>n<sup>d</sup> + … + a<sub>1</sub>n + a<sub>0</sub> is O(n<sup>d</sup>): keep the highest power, drop its coefficient.</li>
<li><strong>Log bases</strong>: log<sub>a</sub> n = log<sub>b</sub> n / log<sub>b</sub> a — changing the base only multiplies by a constant, so O(log2 n) = O(log10 n) = O(log n).</li>
<li><strong>Logs grow slower than any power of n</strong>: (log n)<sup>k</sup> is O(n) for every fixed k — even (log n)³ ends up far below n.</li>
</ul>
<pre><code class="language-java">import java.math.BigInteger;
import java.util.Locale;

public class LogBase {
    static double log2(double x) { return Math.log(x) / Math.log(2); }

    public static void main(String[] args) {
        // Changing the base of a log only multiplies it by a constant
        System.out.println("         n     log2 n    log10 n    log2 n / log10 n");
        for (double n = 10; n &lt;= 1e9; n *= 1000)
            System.out.println(String.format(Locale.ROOT, "%10.0f %10.4f %10.4f %19.6f", n, log2(n), Math.log10(n), log2(n) / Math.log10(n)));
        // Any fixed power of log n still ends up far below n
        System.out.println(" n = 2^k   (log2 n)^3   n");
        for (int k : new int[] {4, 8, 10, 16, 32, 64})
            System.out.println(String.format(Locale.ROOT, "%8s %12d   %s", "2^" + k, k * k * k, BigInteger.ONE.shiftLeft(k)));
    }
}</code></pre>
<div class="out">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;n &nbsp;&nbsp;&nbsp;&nbsp;log2 n &nbsp;&nbsp;&nbsp;log10 n &nbsp;&nbsp;&nbsp;log2 n / log10 n<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10 &nbsp;&nbsp;&nbsp;&nbsp;3.3219 &nbsp;&nbsp;&nbsp;&nbsp;1.0000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.321928<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10000 &nbsp;&nbsp;&nbsp;13.2877 &nbsp;&nbsp;&nbsp;&nbsp;4.0000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.321928<br>
&nbsp;&nbsp;10000000 &nbsp;&nbsp;&nbsp;23.2535 &nbsp;&nbsp;&nbsp;&nbsp;7.0000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.321928<br>
&nbsp;n = 2^k &nbsp;&nbsp;(log2 n)^3 &nbsp;&nbsp;n<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2^4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;64 &nbsp;&nbsp;16<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2^8 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;512 &nbsp;&nbsp;256<br>
&nbsp;&nbsp;&nbsp;&nbsp;2^10 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1000 &nbsp;&nbsp;1024<br>
&nbsp;&nbsp;&nbsp;&nbsp;2^16 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4096 &nbsp;&nbsp;65536<br>
&nbsp;&nbsp;&nbsp;&nbsp;2^32 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;32768 &nbsp;&nbsp;4294967296<br>
&nbsp;&nbsp;&nbsp;&nbsp;2^64 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;262144 &nbsp;&nbsp;18446744073709551616</div>
<p>The first table shows log2 n / log10 n = 3.321928… for every n — the constant log2 10. In the second, (log2 n)³ is still larger at n = 16 and n = 256, by n = 2¹⁰ = 1024 n has passed it (1000 &lt; 1024; the exact crossing is at n = 982), and from there the gap only widens.</p>
<div class="pitfall">The base does not matter for logarithms, but it <strong>does</strong> matter for exponentials: 4ⁿ = 2ⁿ · 2ⁿ is not O(2ⁿ), because the ratio 4ⁿ/2ⁿ = 2ⁿ has no ceiling. O(2ⁿ) and O(3ⁿ) are different classes.</div>`,
        `<p class="y-chinh">🎯 Hai hệ quả của các quy tắc được dùng liên tục: đa thức (polynomial) bậc d là O(n<sup>d</sup>), và cơ số (base) của logarit không quan trọng khi nằm trong O( ).</p>
<p class="ghi-chu">Slide này là hình, không trích được chữ nào. Slide 24–29 của bộ slide bàn về tính chất của Big-O (O lớn) và các ký hiệu họ hàng, nên phần giảng dưới đây dạy hai tính chất được dùng nhiều nhất trong thực tế; hãy đối chiếu với hình trên bản slide của bạn.</p>
<ul>
<li><strong>Đa thức</strong>: 5n³ − 2n² + 7 ≤ 5n³ + 2n³ + 7n³ = 14n³ với n ≥ 1, nên nó là O(n³). Tổng quát, a<sub>d</sub>n<sup>d</sup> + … + a<sub>1</sub>n + a<sub>0</sub> là O(n<sup>d</sup>): giữ lũy thừa cao nhất, bỏ hệ số của nó.</li>
<li><strong>Cơ số của log</strong>: log<sub>a</sub> n = log<sub>b</sub> n / log<sub>b</sub> a — đổi cơ số chỉ là nhân với một hằng số, nên O(log2 n) = O(log10 n) = O(log n).</li>
<li><strong>Logarit tăng chậm hơn mọi lũy thừa của n</strong>: (log n)<sup>k</sup> là O(n) với mọi k cố định — ngay cả (log n)³ rồi cũng nằm rất xa dưới n.</li>
</ul>
<pre><code class="language-java">import java.math.BigInteger;
import java.util.Locale;

public class LogBase {
    static double log2(double x) { return Math.log(x) / Math.log(2); }

    public static void main(String[] args) {
        // Đổi cơ số của log chỉ nhân nó với một hằng số
        System.out.println("         n     log2 n    log10 n    log2 n / log10 n");
        for (double n = 10; n &lt;= 1e9; n *= 1000)
            System.out.println(String.format(Locale.ROOT, "%10.0f %10.4f %10.4f %19.6f", n, log2(n), Math.log10(n), log2(n) / Math.log10(n)));
        // Mọi lũy thừa cố định của log n rồi cũng nằm rất xa dưới n
        System.out.println(" n = 2^k   (log2 n)^3   n");
        for (int k : new int[] {4, 8, 10, 16, 32, 64})
            System.out.println(String.format(Locale.ROOT, "%8s %12d   %s", "2^" + k, k * k * k, BigInteger.ONE.shiftLeft(k)));
    }
}</code></pre>
<div class="out">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;n &nbsp;&nbsp;&nbsp;&nbsp;log2 n &nbsp;&nbsp;&nbsp;log10 n &nbsp;&nbsp;&nbsp;log2 n / log10 n<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10 &nbsp;&nbsp;&nbsp;&nbsp;3.3219 &nbsp;&nbsp;&nbsp;&nbsp;1.0000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.321928<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10000 &nbsp;&nbsp;&nbsp;13.2877 &nbsp;&nbsp;&nbsp;&nbsp;4.0000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.321928<br>
&nbsp;&nbsp;10000000 &nbsp;&nbsp;&nbsp;23.2535 &nbsp;&nbsp;&nbsp;&nbsp;7.0000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.321928<br>
&nbsp;n = 2^k &nbsp;&nbsp;(log2 n)^3 &nbsp;&nbsp;n<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2^4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;64 &nbsp;&nbsp;16<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2^8 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;512 &nbsp;&nbsp;256<br>
&nbsp;&nbsp;&nbsp;&nbsp;2^10 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1000 &nbsp;&nbsp;1024<br>
&nbsp;&nbsp;&nbsp;&nbsp;2^16 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4096 &nbsp;&nbsp;65536<br>
&nbsp;&nbsp;&nbsp;&nbsp;2^32 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;32768 &nbsp;&nbsp;4294967296<br>
&nbsp;&nbsp;&nbsp;&nbsp;2^64 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;262144 &nbsp;&nbsp;18446744073709551616</div>
<p>Bảng thứ nhất cho thấy log2 n / log10 n = 3,321928… với mọi n — chính là hằng số log2 10. Ở bảng thứ hai, (log2 n)³ vẫn lớn hơn khi n = 16 và n = 256, tới n = 2¹⁰ = 1024 thì n đã vượt lên (1000 &lt; 1024; điểm vượt chính xác là n = 982), và từ đó khoảng cách chỉ ngày càng xa.</p>
<div class="pitfall">Với logarit thì cơ số không quan trọng, nhưng với hàm mũ thì <strong>có</strong>: 4ⁿ = 2ⁿ · 2ⁿ không phải O(2ⁿ), vì tỉ số 4ⁿ/2ⁿ = 2ⁿ không có trần. O(2ⁿ) và O(3ⁿ) là hai lớp khác nhau.</div>`],
      [26, 'Writing Big-Oh - dominant term and tight bound (figure)',
        `<p class="y-chinh">🎯 Conventions for writing Big-O: drop constant factors and lower-order terms, and give the smallest (tightest) simple class that is still true.</p>
<p class="ghi-chu">This slide is a picture and no text could be extracted from it. Within the deck's slides on the properties of Big-O (24–29), this block teaches how a Big-O answer should be written; compare with the picture on your copy.</p>
<table>
<thead><tr><th>Instead of</th><th>Write</th><th>Rule</th></tr></thead>
<tbody>
<tr><td>O(3n² + 5n + 2)</td><td>O(n²)</td><td>drop lower-order terms and the coefficient</td></tr>
<tr><td>O(2n)</td><td>O(n)</td><td>constants never appear inside O( )</td></tr>
<tr><td>O(log2 n)</td><td>O(log n)</td><td>the base of a log is only a constant factor</td></tr>
<tr><td>O(n² + n log n)</td><td>O(n²)</td><td>sum rule: keep the maximum</td></tr>
<tr><td>"8n + 128 is O(n²)"</td><td>"8n + 128 is O(n)"</td><td>true but loose → give the tight class</td></tr>
<tr><td>O(n + m) for a graph</td><td>keep O(n + m)</td><td>two independent sizes: neither term dominates the other</td></tr>
</tbody>
</table>
<ul>
<li>A <strong>tight</strong> bound is the smallest class that is still correct; FE questions usually expect it even when a looser one is technically true.</li>
<li>When the cost depends on two sizes (n vertices and m edges, a text of length n and a pattern of length m), keep both — they grow independently.</li>
<li>Say "O(n) in the worst case" or "O(1) amortized" when the case matters: the same method can belong to different classes in different cases.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> a Big-O answer is written like a shop sign — short and exact: O(n²), not O(3n² + 5n + 2).</p>`,
        `<p class="y-chinh">🎯 Quy ước viết Big-O (O lớn): bỏ hệ số hằng và các số hạng bậc thấp, và nêu lớp đơn giản nhỏ nhất (chặt nhất — tight) mà vẫn đúng.</p>
<p class="ghi-chu">Slide này là hình, không trích được chữ nào. Nằm trong nhóm slide về tính chất của Big-O (24–29), phần giảng dưới đây dạy cách viết một câu trả lời Big-O cho đúng quy ước; hãy đối chiếu với hình trên bản slide của bạn.</p>
<table>
<thead><tr><th>Thay vì</th><th>Hãy viết</th><th>Quy tắc</th></tr></thead>
<tbody>
<tr><td>O(3n² + 5n + 2)</td><td>O(n²)</td><td>bỏ số hạng bậc thấp và hệ số</td></tr>
<tr><td>O(2n)</td><td>O(n)</td><td>hằng số không bao giờ xuất hiện trong O( )</td></tr>
<tr><td>O(log2 n)</td><td>O(log n)</td><td>cơ số của log chỉ là một hệ số hằng</td></tr>
<tr><td>O(n² + n log n)</td><td>O(n²)</td><td>quy tắc tổng: giữ số hạng lớn nhất</td></tr>
<tr><td>"8n + 128 là O(n²)"</td><td>"8n + 128 là O(n)"</td><td>đúng nhưng lỏng → hãy nêu lớp chặt</td></tr>
<tr><td>O(n + m) với đồ thị</td><td>giữ nguyên O(n + m)</td><td>hai kích thước độc lập: không số hạng nào trội hơn số hạng kia</td></tr>
</tbody>
</table>
<ul>
<li>Cận <strong>chặt</strong> là lớp nhỏ nhất mà vẫn đúng; câu hỏi FE (thi cuối kỳ) thường chờ đúng đáp án này, dù một cận lỏng hơn về lý thuyết vẫn đúng.</li>
<li>Khi chi phí phụ thuộc hai kích thước (n đỉnh và m cạnh, văn bản dài n và mẫu dài m), giữ cả hai — chúng tăng độc lập với nhau.</li>
<li>Nói rõ "O(n) trong trường hợp xấu nhất" hay "O(1) khấu hao (amortized)" khi trường hợp là quan trọng: cùng một phương thức có thể thuộc các lớp khác nhau ở các trường hợp khác nhau.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> câu trả lời Big-O viết như biển hiệu cửa hàng — ngắn và chính xác: O(n²), không phải O(3n² + 5n + 2).</p>`],
      [27, 'Big-Omega notation (figure)',
        `<p class="y-chinh">🎯 Big-Omega gives a lower bound: f(n) is Ω(g(n)) if there are constants c &gt; 0 and n0 ≥ 1 such that f(n) ≥ c·g(n) for every n ≥ n0 — f grows at least as fast as g.</p>
<p class="ghi-chu">This slide is a picture and no text could be extracted from it. The deck's objectives (slide 2) list Big-Ω and Big-Θ and no text slide teaches them, so this block and the next two teach them at this point of the flow; compare with the pictures on your copy.</p>
<ul>
<li>It is Big-O turned upside down: f(n) is Ω(g(n)) exactly when g(n) is O(f(n)).</li>
<li>Typical use: "any algorithm that must look at all n elements (maximum, sum) is Ω(n)" — no trick can do it with fewer steps.</li>
<li><strong>Example</strong>: the number of pairs n(n − 1)/2 (the lesson's pairs loop, slide 34) is Ω(n²) with c = 1/4 and n0 = 2, because n(n − 1)/2 ≥ n²/4 ⇔ n ≥ 2.</li>
<li>100n is <strong>not</strong> Ω(n²): 100n ≥ c·n² would need n ≤ 100/c, which fails for large n.</li>
</ul>
<pre><code class="language-java">import java.util.Locale;

public class OmegaCheck {
    public static void main(String[] args) {
        // f(n) = n(n-1)/2 (the pairs loop, slide 34) is Omega(n^2): c = 1/4, n0 = 2
        System.out.println("    n   f(n) = n(n-1)/2       n^2/4   f(n) &gt;= n^2/4 ?");
        for (long n : new long[] {1, 2, 3, 10, 100, 1000}) {
            long f = n * (n - 1) / 2;
            double low = n * n / 4.0;
            System.out.println(String.format(Locale.ROOT, "%5d %17d %11.2f   %s", n, f, low, f &gt;= low ? "yes" : "no"));
        }
        // 100n is NOT Omega(n^2): 100n &gt;= n^2/4 only while n &lt;= 400
        for (long n : new long[] {400, 401, 10000}) {
            double low = n * n / 4.0;
            System.out.println(String.format(Locale.ROOT, "n = %d: 100n = %d, n^2/4 = %.2f%s", n, 100 * n, low, 100 * n &gt;= low ? "" : "   &lt;- lower bound broken"));
        }
    }
}</code></pre>
<div class="out">&nbsp;&nbsp;&nbsp;&nbsp;n &nbsp;&nbsp;f(n) = n(n-1)/2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;n^2/4 &nbsp;&nbsp;f(n) &gt;= n^2/4 ?<br>
&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.25 &nbsp;&nbsp;no<br>
&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1.00 &nbsp;&nbsp;yes<br>
&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.25 &nbsp;&nbsp;yes<br>
&nbsp;&nbsp;&nbsp;10 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;45 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;25.00 &nbsp;&nbsp;yes<br>
&nbsp;&nbsp;100 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4950 &nbsp;&nbsp;&nbsp;&nbsp;2500.00 &nbsp;&nbsp;yes<br>
&nbsp;1000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;499500 &nbsp;&nbsp;250000.00 &nbsp;&nbsp;yes<br>
n = 400: 100n = 40000, n^2/4 = 40000.00<br>
n = 401: 100n = 40100, n^2/4 = 40200.25 &nbsp;&nbsp;&lt;- lower bound broken<br>
n = 10000: 100n = 1000000, n^2/4 = 25000000.00 &nbsp;&nbsp;&lt;- lower bound broken</div>
<div class="pitfall">Ω is not "the best case" and O is not "the worst case". Each case (best, worst, average) is its own function of n, and each can be given an O, an Ω or a Θ: the worst case of linear search is Θ(n), its best case is Θ(1).</div>`,
        `<p class="y-chinh">🎯 Big-Omega (Omega lớn) cho một cận dưới (lower bound): f(n) là Ω(g(n)) nếu có các hằng số c &gt; 0 và n0 ≥ 1 sao cho f(n) ≥ c·g(n) với mọi n ≥ n0 — f tăng ít nhất là nhanh bằng g.</p>
<p class="ghi-chu">Slide này là hình, không trích được chữ nào. Mục tiêu của bộ slide (slide 2) có Big-Ω và Big-Θ mà không slide chữ nào dạy chúng, nên khối này và hai khối kế tiếp dạy chúng ở vị trí này của mạch bài; hãy đối chiếu với hình trên bản slide của bạn.</p>
<ul>
<li>Nó là Big-O lật ngược: f(n) là Ω(g(n)) đúng khi g(n) là O(f(n)).</li>
<li>Cách dùng điển hình: "thuật toán nào buộc phải nhìn đủ n phần tử (tìm max, tính tổng) thì là Ω(n)" — không mẹo nào làm được với ít bước hơn.</li>
<li><strong>Ví dụ</strong>: số cặp n(n − 1)/2 (vòng lặp đếm cặp — ví dụ của bài ở slide 34) là Ω(n²) với c = 1/4 và n0 = 2, vì n(n − 1)/2 ≥ n²/4 ⇔ n ≥ 2.</li>
<li>100n <strong>không</strong> phải Ω(n²): 100n ≥ c·n² đòi n ≤ 100/c, điều này sai khi n lớn.</li>
</ul>
<pre><code class="language-java">import java.util.Locale;

public class OmegaCheck {
    public static void main(String[] args) {
        // f(n) = n(n-1)/2 (vòng đếm cặp, slide 34) là Omega(n^2): c = 1/4, n0 = 2
        System.out.println("    n   f(n) = n(n-1)/2       n^2/4   f(n) &gt;= n^2/4 ?");
        for (long n : new long[] {1, 2, 3, 10, 100, 1000}) {
            long f = n * (n - 1) / 2;
            double low = n * n / 4.0;
            System.out.println(String.format(Locale.ROOT, "%5d %17d %11.2f   %s", n, f, low, f &gt;= low ? "yes" : "no"));
        }
        // 100n KHÔNG là Omega(n^2): 100n &gt;= n^2/4 chỉ đúng khi n &lt;= 400
        for (long n : new long[] {400, 401, 10000}) {
            double low = n * n / 4.0;
            System.out.println(String.format(Locale.ROOT, "n = %d: 100n = %d, n^2/4 = %.2f%s", n, 100 * n, low, 100 * n &gt;= low ? "" : "   &lt;- lower bound broken"));
        }
    }
}</code></pre>
<div class="out">&nbsp;&nbsp;&nbsp;&nbsp;n &nbsp;&nbsp;f(n) = n(n-1)/2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;n^2/4 &nbsp;&nbsp;f(n) &gt;= n^2/4 ?<br>
&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.25 &nbsp;&nbsp;no<br>
&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1.00 &nbsp;&nbsp;yes<br>
&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.25 &nbsp;&nbsp;yes<br>
&nbsp;&nbsp;&nbsp;10 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;45 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;25.00 &nbsp;&nbsp;yes<br>
&nbsp;&nbsp;100 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4950 &nbsp;&nbsp;&nbsp;&nbsp;2500.00 &nbsp;&nbsp;yes<br>
&nbsp;1000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;499500 &nbsp;&nbsp;250000.00 &nbsp;&nbsp;yes<br>
n = 400: 100n = 40000, n^2/4 = 40000.00<br>
n = 401: 100n = 40100, n^2/4 = 40200.25 &nbsp;&nbsp;&lt;- lower bound broken<br>
n = 10000: 100n = 1000000, n^2/4 = 25000000.00 &nbsp;&nbsp;&lt;- lower bound broken</div>
<div class="pitfall">Ω không phải là "trường hợp tốt nhất", O cũng không phải là "trường hợp xấu nhất". Mỗi trường hợp (tốt nhất, xấu nhất, trung bình) là một hàm riêng của n, và hàm nào cũng có thể gắn O, Ω hay Θ: trường hợp xấu nhất của tìm tuần tự là Θ(n), trường hợp tốt nhất của nó là Θ(1).</div>`],
      [28, 'Big-Theta notation (figure)',
        `<p class="y-chinh">🎯 Big-Theta gives a tight bound: f(n) is Θ(g(n)) if it is both O(g(n)) and Ω(g(n)) — there are constants c′ &gt; 0, c″ &gt; 0 and n0 ≥ 1 such that c′·g(n) ≤ f(n) ≤ c″·g(n) for every n ≥ n0.</p>
<p class="ghi-chu">This slide is a picture and no text could be extracted from it. Continuing from Big-Ω (slide 27), this block teaches Big-Θ, the third notation named in the deck's objectives; compare with the picture on your copy.</p>
<ul>
<li>Θ pins the growth rate down exactly: f is sandwiched between two multiples of g.</li>
<li><strong>Example</strong>: n²/4 ≤ n(n − 1)/2 ≤ n²/2 for every n ≥ 2, so the number of pairs is Θ(n²) (c′ = 1/4, c″ = 1/2, n0 = 2).</li>
<li>Every polynomial with a positive leading coefficient a<sub>d</sub> is Θ(n<sup>d</sup>): 3n² + 20n + 5 is Θ(n²).</li>
<li>When people say "insertion sort is O(n²)" they often mean "its worst case is Θ(n²)" — Θ is the precise word.</li>
</ul>
<pre><code class="language-java">import java.util.Locale;

public class ThetaCheck {
    public static void main(String[] args) {
        // n^2/4 &lt;= n(n-1)/2 &lt;= n^2/2 for every n &gt;= 2 -&gt; Theta(n^2)
        System.out.println("      n        n^2/4    n(n-1)/2        n^2/2   ratio f(n)/n^2");
        for (long n : new long[] {2, 10, 100, 1000, 100000}) {
            double f = n * (n - 1) / 2.0;
            System.out.println(String.format(Locale.ROOT, "%7d %12.0f %11.0f %12.0f %16.5f", n, n * n / 4.0, f, n * n / 2.0, f / ((double) n * n)));
        }
        int bad = 0;
        for (long n = 2; n &lt;= 1000000; n++) {
            long twoF = n * (n - 1);                            // 2 f(n), to stay with integers
            if (!(n * n &lt;= 2 * twoF &amp;&amp; twoF &lt;= n * n)) bad++;   // both bounds, multiplied by 4
        }
        System.out.println("checked n = 2 .. 1000000: " + bad + " counterexamples");
    }
}</code></pre>
<div class="out">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;n &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;n^2/4 &nbsp;&nbsp;&nbsp;n(n-1)/2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;n^2/2 &nbsp;&nbsp;ratio f(n)/n^2<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.25000<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;25 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;45 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;50 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.45000<br>
&nbsp;&nbsp;&nbsp;&nbsp;100 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2500 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4950 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.49500<br>
&nbsp;&nbsp;&nbsp;1000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;250000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;499500 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;500000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.49950<br>
&nbsp;100000 &nbsp;&nbsp;2500000000 &nbsp;4999950000 &nbsp;&nbsp;5000000000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.50000<br>
checked n = 2 .. 1000000: 0 counterexamples</div>
<p>The ratio f(n)/n² tends to 1/2 and stays inside the band [c′, c″] = [1/4, 1/2]: that is what "the same growth rate" means.</p>`,
        `<p class="y-chinh">🎯 Big-Theta (Theta lớn) cho một cận chặt (tight bound): f(n) là Θ(g(n)) nếu nó vừa là O(g(n)) vừa là Ω(g(n)) — có các hằng số c′ &gt; 0, c″ &gt; 0 và n0 ≥ 1 sao cho c′·g(n) ≤ f(n) ≤ c″·g(n) với mọi n ≥ n0.</p>
<p class="ghi-chu">Slide này là hình, không trích được chữ nào. Tiếp nối Big-Ω (slide 27), phần giảng dưới đây dạy Big-Θ, ký hiệu thứ ba có trong mục tiêu của bộ slide; hãy đối chiếu với hình trên bản slide của bạn.</p>
<ul>
<li>Θ "ghim" tốc độ tăng lại chính xác: f bị kẹp giữa hai bội số của g.</li>
<li><strong>Ví dụ</strong>: n²/4 ≤ n(n − 1)/2 ≤ n²/2 với mọi n ≥ 2, nên số cặp là Θ(n²) (c′ = 1/4, c″ = 1/2, n0 = 2).</li>
<li>Đa thức nào có hệ số cao nhất a<sub>d</sub> dương cũng là Θ(n<sup>d</sup>): 3n² + 20n + 5 là Θ(n²).</li>
<li>Khi người ta nói "insertion sort (sắp xếp chèn) là O(n²)", thường ý họ là "trường hợp xấu nhất của nó là Θ(n²)" — Θ mới là từ chính xác.</li>
</ul>
<pre><code class="language-java">import java.util.Locale;

public class ThetaCheck {
    public static void main(String[] args) {
        // n^2/4 &lt;= n(n-1)/2 &lt;= n^2/2 với mọi n &gt;= 2 -&gt; Theta(n^2)
        System.out.println("      n        n^2/4    n(n-1)/2        n^2/2   ratio f(n)/n^2");
        for (long n : new long[] {2, 10, 100, 1000, 100000}) {
            double f = n * (n - 1) / 2.0;
            System.out.println(String.format(Locale.ROOT, "%7d %12.0f %11.0f %12.0f %16.5f", n, n * n / 4.0, f, n * n / 2.0, f / ((double) n * n)));
        }
        int bad = 0;
        for (long n = 2; n &lt;= 1000000; n++) {
            long twoF = n * (n - 1);                            // 2 f(n), để chỉ dùng số nguyên
            if (!(n * n &lt;= 2 * twoF &amp;&amp; twoF &lt;= n * n)) bad++;   // cả hai cận, đã nhân 4
        }
        System.out.println("checked n = 2 .. 1000000: " + bad + " counterexamples");
    }
}</code></pre>
<div class="out">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;n &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;n^2/4 &nbsp;&nbsp;&nbsp;n(n-1)/2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;n^2/2 &nbsp;&nbsp;ratio f(n)/n^2<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.25000<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;25 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;45 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;50 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.45000<br>
&nbsp;&nbsp;&nbsp;&nbsp;100 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2500 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4950 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.49500<br>
&nbsp;&nbsp;&nbsp;1000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;250000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;499500 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;500000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.49950<br>
&nbsp;100000 &nbsp;&nbsp;2500000000 &nbsp;4999950000 &nbsp;&nbsp;5000000000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.50000<br>
checked n = 2 .. 1000000: 0 counterexamples</div>
<p>Tỉ số f(n)/n² tiến về 1/2 và luôn nằm trong dải [c′, c″] = [1/4, 1/2]: đó chính là nghĩa của "cùng tốc độ tăng".</p>`],
      [29, 'O, Omega, Theta and the three cases (figure)',
        `<p class="y-chinh">🎯 The three notations compare growth rates like ≤, ≥ and =, and they are independent of the best/worst/average choice — you pick the case first, then bound its function.</p>
<p class="ghi-chu">This slide is a picture and no text could be extracted from it. It closes the deck's group of slides on Big-O and its relatives (24–29), so this block puts O, Ω and Θ side by side with the three cases; compare with the picture on your copy.</p>
<table>
<thead><tr><th>Algorithm</th><th>Best case</th><th>Worst case</th><th>Safe one-line summary</th></tr></thead>
<tbody>
<tr><td>linear search (slide 36)</td><td>Θ(1) — key first</td><td>Θ(n) — key last or missing</td><td>O(n)</td></tr>
<tr><td>binary search (slide 37)</td><td>Θ(1) — key in the middle</td><td>Θ(log n)</td><td>O(log n)</td></tr>
<tr><td>arrayMax (lesson's example, slides 13–16)</td><td>Θ(n)</td><td>Θ(n)</td><td>Θ(n)</td></tr>
<tr><td>insertion sort (lesson's example, slides 10–11)</td><td>Θ(n) — sorted input</td><td>Θ(n²) — reversed input</td><td>O(n²)</td></tr>
</tbody>
</table>
<ul>
<li>O(f) ≈ "at most f", Ω(f) ≈ "at least f", Θ(f) ≈ "exactly the order of f" — always for large n, always up to a constant.</li>
<li>When the best and the worst case have the same order (arrayMax), the algorithm is Θ of it for every input.</li>
<li>"Linear search is O(n)" is a statement about every input; "linear search is Θ(n)" is true only of its worst (and average) case.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> O is a ceiling, Ω is a floor, Θ is both — the growth rate is trapped in the room.</p>`,
        `<p class="y-chinh">🎯 Ba ký hiệu so sánh tốc độ tăng giống như ≤, ≥ và =, và chúng độc lập với việc chọn trường hợp tốt nhất/xấu nhất/trung bình — chọn trường hợp trước, rồi mới chặn hàm của trường hợp đó.</p>
<p class="ghi-chu">Slide này là hình, không trích được chữ nào. Nó khép lại nhóm slide về Big-O (O lớn) và các ký hiệu họ hàng (24–29), nên phần giảng dưới đây đặt O, Ω và Θ cạnh ba trường hợp; hãy đối chiếu với hình trên bản slide của bạn.</p>
<table>
<thead><tr><th>Thuật toán</th><th>Tốt nhất</th><th>Xấu nhất</th><th>Tóm tắt một dòng an toàn</th></tr></thead>
<tbody>
<tr><td>tìm tuần tự (slide 36)</td><td>Θ(1) — khoá ở đầu</td><td>Θ(n) — khoá ở cuối hoặc không có</td><td>O(n)</td></tr>
<tr><td>tìm nhị phân (slide 37)</td><td>Θ(1) — khoá ở giữa</td><td>Θ(log n)</td><td>O(log n)</td></tr>
<tr><td>arrayMax (ví dụ của bài, slide 13–16)</td><td>Θ(n)</td><td>Θ(n)</td><td>Θ(n)</td></tr>
<tr><td>sắp xếp chèn (ví dụ của bài, slide 10–11)</td><td>Θ(n) — đầu vào đã sắp</td><td>Θ(n²) — đầu vào đảo ngược</td><td>O(n²)</td></tr>
</tbody>
</table>
<ul>
<li>O(f) ≈ "nhiều nhất là f", Ω(f) ≈ "ít nhất là f", Θ(f) ≈ "đúng bậc của f" — luôn là khi n lớn, luôn sai khác một hằng số.</li>
<li>Khi trường hợp tốt nhất và xấu nhất cùng bậc (arrayMax), thuật toán là Θ của bậc đó với mọi đầu vào.</li>
<li>"Tìm tuần tự là O(n)" là câu nói về mọi đầu vào; "tìm tuần tự là Θ(n)" chỉ đúng với trường hợp xấu nhất (và trung bình) của nó.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> O là trần nhà, Ω là sàn nhà, Θ là cả hai — tốc độ tăng bị nhốt trong căn phòng.</p>`],
      [30, 'More notes about Big-Oh notation',
        `<p class="y-chinh">🎯 "Algorithm A runs in time Big-O of n log n" means: its number of operations, as a function of n, is O(n log n); and since O(g(n)) is a set of functions, writing it with "=" is only a convention.</p>
<ul>
<li>"Algorithm B is an order n-squared algorithm" = its operation count is O(n²).</li>
<li>The statement is about the <strong>function</strong> T(n) — the count — not about seconds on some machine.</li>
<li>The two forms the slide prefers are part of its picture. The forms textbooks use are "T(n) <strong>is</strong> O(g(n))" (the way Goodrich writes it) and the set form "T(n) ∈ O(g(n))" — compare them with your slide.</li>
<li>Why "T(n) = O(g(n))" is weaker style: it is a one-way "=". From n = O(n²) and n² = O(n²) you may not conclude n = n².</li>
</ul>
<p>Read O(g(n)) as "the set of all functions that grow no faster than g(n)": then "5n + 3 ∈ O(n)" is literally true, and "O(n) ⊆ O(n²)" makes sense.</p>
<div class="pitfall">Never write "O(n) = T(n)": the "=" of Big-O reads only from left to right. In an exam, "T(n) is O(g(n))" is always a safe way to write your answer.</div>`,
        `<p class="y-chinh">🎯 "Thuật toán A chạy trong thời gian Big-O (O lớn) của n log n" nghĩa là: số phép toán của nó, như một hàm của n, là O(n log n); và vì O(g(n)) là một tập hợp hàm, viết nó bằng dấu "=" chỉ là một quy ước.</p>
<ul>
<li>"Thuật toán B là thuật toán bậc n bình phương (order n-squared)" = số phép toán của nó là O(n²).</li>
<li>Câu nói đó nói về <strong>hàm</strong> T(n) — số phép toán — chứ không phải số giây trên một máy nào đó.</li>
<li>Hai cách viết mà slide khuyên dùng nằm trong phần hình của slide. Các cách viết giáo trình hay dùng là "T(n) <strong>is</strong> O(g(n))" (T(n) là O(g(n)) — sách Goodrich viết như vậy) và dạng tập hợp "T(n) ∈ O(g(n))" — hãy so với slide của bạn.</li>
<li>Vì sao "T(n) = O(g(n))" là văn phong kém hơn: dấu "=" ở đây chỉ đọc một chiều. Từ n = O(n²) và n² = O(n²) không được suy ra n = n².</li>
</ul>
<p>Hãy đọc O(g(n)) là "tập hợp mọi hàm tăng không nhanh hơn g(n)": khi đó "5n + 3 ∈ O(n)" đúng theo nghĩa đen, và "O(n) ⊆ O(n²)" cũng có nghĩa.</p>
<div class="pitfall">Đừng bao giờ viết "O(n) = T(n)": dấu "=" của Big-O chỉ đọc từ trái sang phải. Khi thi, viết "T(n) là O(g(n))" luôn là cách an toàn.</div>`],
      [31, 'Some common growth orders of functions',
        `<p class="y-chinh">🎯 Eight growth orders cover almost every algorithm of the course, from constant to factorial — learn them in order.</p>
<table>
<thead><tr><th>Order</th><th>Name on the slide</th><th>Typical example in CSD201</th></tr></thead>
<tbody>
<tr><td>O(1)</td><td>constant</td><td>array access <code>a[i]</code>, push/pop on a stack</td></tr>
<tr><td>O(log n)</td><td>logarithmic</td><td>binary search, search in an AVL tree</td></tr>
<tr><td>O(n)</td><td>linear</td><td>linear search, traversing a list</td></tr>
<tr><td>O(n log n)</td><td>n log n</td><td>merge sort, heap sort, quick sort on average</td></tr>
<tr><td>O(n²)</td><td>quadratic</td><td>selection, insertion and bubble sort</td></tr>
<tr><td>O(n<sup>b</sup>)</td><td>polynomial (b a constant)</td><td>n³: three nested loops over n; Floyd's shortest paths</td></tr>
<tr><td>O(b<sup>n</sup>)</td><td>exponential (b &gt; 1)</td><td>trying all 2ⁿ subsets (the lesson's subset-sum example, slide 42)</td></tr>
<tr><td>O(n!)</td><td>factorial</td><td>trying every ordering of n vertices (Hamiltonian cycle by brute force)</td></tr>
</tbody>
</table>
<pre><code class="language-java">import java.math.BigInteger;
import java.util.Locale;

public class GrowthTable {
    // Print exactly while short, else as a.be+x
    static String show(BigInteger v) {
        String s = v.toString();
        if (s.length() &lt;= 14) return s;
        return s.charAt(0) + "." + s.charAt(1) + "e+" + (s.length() - 1);
    }

    public static void main(String[] args) {
        System.out.println(" n  log2n  n  nlog2n   n^2    n^3          2^n              n!");
        BigInteger fact = BigInteger.ONE;
        int done = 1;
        for (int n = 1; n &lt;= 32; n *= 2) {
            while (done &lt; n) { done++; fact = fact.multiply(BigInteger.valueOf(done)); }
            int lg = 31 - Integer.numberOfLeadingZeros(n);          // exact log2 of a power of 2
            BigInteger two = BigInteger.ONE.shiftLeft(n);            // 2^n
            System.out.println(String.format(Locale.ROOT, "%2d %5d %3d %6d %6d %6d %12s %15s",
                    n, lg, n, n * lg, n * n, n * n * n, show(two), show(fact)));
        }
    }
}</code></pre>
<div class="out">&nbsp;n &nbsp;log2n &nbsp;n &nbsp;nlog2n &nbsp;&nbsp;n^2 &nbsp;&nbsp;&nbsp;n^3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2^n &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;n!<br>
&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1<br>
&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2<br>
&nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8 &nbsp;&nbsp;&nbsp;&nbsp;16 &nbsp;&nbsp;&nbsp;&nbsp;64 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;16 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;24<br>
&nbsp;8 &nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;8 &nbsp;&nbsp;&nbsp;&nbsp;24 &nbsp;&nbsp;&nbsp;&nbsp;64 &nbsp;&nbsp;&nbsp;512 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;256 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;40320<br>
16 &nbsp;&nbsp;&nbsp;&nbsp;4 &nbsp;16 &nbsp;&nbsp;&nbsp;&nbsp;64 &nbsp;&nbsp;&nbsp;256 &nbsp;&nbsp;4096 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;65536 &nbsp;20922789888000<br>
32 &nbsp;&nbsp;&nbsp;&nbsp;5 &nbsp;32 &nbsp;&nbsp;&nbsp;160 &nbsp;&nbsp;1024 &nbsp;32768 &nbsp;&nbsp;4294967296 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.6e+35</div>
<ul>
<li>From the row n = 16 on, every row is already in increasing order. At n = 8, n³ = 512 is still above 2ⁿ = 256 (2ⁿ overtakes at n = 10, as computed under slide 32).</li>
<li>At small n the order can look different: at n = 2 and n = 4, n² and 2ⁿ are equal (4 = 4, 16 = 16).</li>
<li>Polynomial orders (up to n<sup>b</sup>) count as "efficient"; exponential and factorial ones are hopeless beyond a few dozen elements — the P versus NP question of slide 42 is about exactly this boundary.</li>
</ul>
<p>The values are exact (16! = 20,922,789,888,000); only 32! ≈ 2.6 × 10³⁵ is printed rounded.</p>
<p class="meo">🧠 <strong>Remember the ladder:</strong> 1 &lt; log n &lt; n &lt; n log n &lt; n² &lt; n³ &lt; 2ⁿ &lt; n!.</p>`,
        `<p class="y-chinh">🎯 Tám bậc tăng (growth order) phủ gần như mọi thuật toán trong môn, từ hằng tới giai thừa — hãy học thuộc theo đúng thứ tự.</p>
<table>
<thead><tr><th>Bậc</th><th>Tên trên slide</th><th>Ví dụ tiêu biểu trong CSD201</th></tr></thead>
<tbody>
<tr><td>O(1)</td><td>hằng (constant)</td><td>truy cập mảng <code>a[i]</code>, push/pop (đẩy vào/lấy ra) trên ngăn xếp (stack)</td></tr>
<tr><td>O(log n)</td><td>logarit (logarithmic)</td><td>tìm nhị phân, tìm kiếm trên cây AVL</td></tr>
<tr><td>O(n)</td><td>tuyến tính (linear)</td><td>tìm tuần tự, duyệt một danh sách</td></tr>
<tr><td>O(n log n)</td><td>n log n</td><td>merge sort (sắp xếp trộn), heap sort (sắp xếp vun đống), quick sort (sắp xếp nhanh) trong trường hợp trung bình</td></tr>
<tr><td>O(n²)</td><td>bậc hai (quadratic)</td><td>selection, insertion và bubble sort (sắp xếp chọn, chèn, nổi bọt)</td></tr>
<tr><td>O(n<sup>b</sup>)</td><td>đa thức (polynomial, b là hằng số)</td><td>n³: ba vòng lặp lồng nhau trên n; thuật toán Floyd tìm đường đi ngắn nhất</td></tr>
<tr><td>O(b<sup>n</sup>)</td><td>hàm mũ (exponential, b &gt; 1)</td><td>thử mọi tập con, 2ⁿ tập (ví dụ tổng tập con của bài, slide 42)</td></tr>
<tr><td>O(n!)</td><td>giai thừa (factorial)</td><td>thử mọi thứ tự của n đỉnh (tìm chu trình Hamilton bằng vét cạn)</td></tr>
</tbody>
</table>
<pre><code class="language-java">import java.math.BigInteger;
import java.util.Locale;

public class GrowthTable {
    // In đúng từng chữ số khi còn ngắn, dài quá thì in dạng a.be+x
    static String show(BigInteger v) {
        String s = v.toString();
        if (s.length() &lt;= 14) return s;
        return s.charAt(0) + "." + s.charAt(1) + "e+" + (s.length() - 1);
    }

    public static void main(String[] args) {
        System.out.println(" n  log2n  n  nlog2n   n^2    n^3          2^n              n!");
        BigInteger fact = BigInteger.ONE;
        int done = 1;
        for (int n = 1; n &lt;= 32; n *= 2) {
            while (done &lt; n) { done++; fact = fact.multiply(BigInteger.valueOf(done)); }
            int lg = 31 - Integer.numberOfLeadingZeros(n);          // log2 chính xác của lũy thừa 2
            BigInteger two = BigInteger.ONE.shiftLeft(n);            // 2^n
            System.out.println(String.format(Locale.ROOT, "%2d %5d %3d %6d %6d %6d %12s %15s",
                    n, lg, n, n * lg, n * n, n * n * n, show(two), show(fact)));
        }
    }
}</code></pre>
<div class="out">&nbsp;n &nbsp;log2n &nbsp;n &nbsp;nlog2n &nbsp;&nbsp;n^2 &nbsp;&nbsp;&nbsp;n^3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2^n &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;n!<br>
&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1<br>
&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2<br>
&nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8 &nbsp;&nbsp;&nbsp;&nbsp;16 &nbsp;&nbsp;&nbsp;&nbsp;64 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;16 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;24<br>
&nbsp;8 &nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;8 &nbsp;&nbsp;&nbsp;&nbsp;24 &nbsp;&nbsp;&nbsp;&nbsp;64 &nbsp;&nbsp;&nbsp;512 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;256 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;40320<br>
16 &nbsp;&nbsp;&nbsp;&nbsp;4 &nbsp;16 &nbsp;&nbsp;&nbsp;&nbsp;64 &nbsp;&nbsp;&nbsp;256 &nbsp;&nbsp;4096 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;65536 &nbsp;20922789888000<br>
32 &nbsp;&nbsp;&nbsp;&nbsp;5 &nbsp;32 &nbsp;&nbsp;&nbsp;160 &nbsp;&nbsp;1024 &nbsp;32768 &nbsp;&nbsp;4294967296 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.6e+35</div>
<ul>
<li>Từ hàng n = 16 trở đi, hàng nào cũng đã đúng thứ tự tăng dần. Ở n = 8, n³ = 512 vẫn còn lớn hơn 2ⁿ = 256 (2ⁿ vượt lên ở n = 10, bài tính ở slide 32).</li>
<li>Khi n nhỏ thứ tự có thể trông khác đi: ở n = 2 và n = 4, n² và 2ⁿ bằng nhau (4 = 4, 16 = 16).</li>
<li>Các bậc đa thức (tới n<sup>b</sup>) được coi là "hiệu quả"; bậc hàm mũ và giai thừa thì vô vọng khi quá vài chục phần tử — câu hỏi P với NP ở slide 42 xoay quanh đúng ranh giới này.</li>
</ul>
<p>Các giá trị in ra là chính xác (16! = 20.922.789.888.000); chỉ 32! ≈ 2,6 × 10³⁵ được in dạng làm tròn.</p>
<p class="meo">🧠 <strong>Nhớ cái thang:</strong> 1 &lt; log n &lt; n &lt; n log n &lt; n² &lt; n³ &lt; 2ⁿ &lt; n!.</p>`],
      [32, 'Growth orders of functions in graphics',
        `<p class="y-chinh">🎯 Drawn as curves, the typical Big-O functions separate quickly: whatever happens at small n, for large n the faster-growing curve ends up on top and stays there.</p>
<p class="ghi-chu">This slide is mainly a picture (graphs of the typical functions used in Big-O estimates); only its title and subtitle could be extracted. The program below computes, for the lesson's own pairs of functions, exactly where one curve overtakes the other.</p>
<pre><code class="language-java">public class Crossover {
    interface F { double at(int n); }

    // Last n (up to limit) where the faster-growing f is still &lt;= the slower g
    static int lastTie(F fast, F slow, int limit) {
        int last = 0;
        for (int n = 1; n &lt;= limit; n++) if (fast.at(n) &lt;= slow.at(n)) last = n;
        return last;
    }

    static double fact(int n) { double r = 1; for (int i = 2; i &lt;= n; i++) r *= i; return r; }
    static double log2(int n) { return Math.log(n) / Math.log(2); }

    static void show(String fast, String slow, int last) {
        System.out.println(fast + " &gt; " + slow + " for every n &gt;= " + (last + 1) + "   (still &lt;= at n = " + last + ")");
    }

    public static void main(String[] args) {
        show("n^2", "100n", lastTie(n -&gt; (double) n * n, n -&gt; 100.0 * n, 100000));
        show("n", "1000 log2 n", lastTie(n -&gt; n, n -&gt; 1000 * log2(n), 100000));
        show("2^n", "n^3", lastTie(n -&gt; Math.pow(2, n), n -&gt; (double) n * n * n, 60));
        show("n!", "2^n", lastTie(n -&gt; fact(n), n -&gt; Math.pow(2, n), 60));
    }
}</code></pre>
<div class="out">n^2 &gt; 100n for every n &gt;= 101 &nbsp;&nbsp;(still &lt;= at n = 100)<br>
n &gt; 1000 log2 n for every n &gt;= 13747 &nbsp;&nbsp;(still &lt;= at n = 13746)<br>
2^n &gt; n^3 for every n &gt;= 10 &nbsp;&nbsp;(still &lt;= at n = 9)<br>
n! &gt; 2^n for every n &gt;= 4 &nbsp;&nbsp;(still &lt;= at n = 3)</div>
<ul>
<li>Curves can cross at small n: 100n ≥ n² up to n = 100, n³ ≥ 2ⁿ for n = 2 … 9, 2ⁿ ≥ n! up to n = 3.</li>
<li>After the last crossing the order never changes again — and that part is the only one Big-O talks about.</li>
<li>A logarithm with a huge constant (1000 log2 n) still loses to plain n — from n = 13,747 on.</li>
<li>On a normal (linear) scale the fast curves leave the picture almost at once; that is why graphs of these functions often put a logarithmic scale on the vertical axis, so that all of them fit.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> judge a race at the finish line, not in the first metres — Big-O only looks at large n.</p>`,
        `<p class="y-chinh">🎯 Vẽ thành đường cong, các hàm Big-O (O lớn) tiêu biểu tách nhau rất nhanh: dù lúc n nhỏ có ra sao, khi n lớn đường tăng nhanh hơn sẽ nằm trên và ở luôn trên đó.</p>
<p class="ghi-chu">Slide này chủ yếu là hình (đồ thị các hàm tiêu biểu dùng khi ước lượng Big-O); chữ trích được chỉ có tiêu đề và phụ đề. Chương trình dưới đây tính chính xác, với các cặp hàm của bài, đường này vượt đường kia từ chỗ nào.</p>
<pre><code class="language-java">public class Crossover {
    interface F { double at(int n); }

    // n cuối cùng (tới limit) mà hàm tăng nhanh f vẫn &lt;= hàm chậm g
    static int lastTie(F fast, F slow, int limit) {
        int last = 0;
        for (int n = 1; n &lt;= limit; n++) if (fast.at(n) &lt;= slow.at(n)) last = n;
        return last;
    }

    static double fact(int n) { double r = 1; for (int i = 2; i &lt;= n; i++) r *= i; return r; }
    static double log2(int n) { return Math.log(n) / Math.log(2); }

    static void show(String fast, String slow, int last) {
        System.out.println(fast + " &gt; " + slow + " for every n &gt;= " + (last + 1) + "   (still &lt;= at n = " + last + ")");
    }

    public static void main(String[] args) {
        show("n^2", "100n", lastTie(n -&gt; (double) n * n, n -&gt; 100.0 * n, 100000));
        show("n", "1000 log2 n", lastTie(n -&gt; n, n -&gt; 1000 * log2(n), 100000));
        show("2^n", "n^3", lastTie(n -&gt; Math.pow(2, n), n -&gt; (double) n * n * n, 60));
        show("n!", "2^n", lastTie(n -&gt; fact(n), n -&gt; Math.pow(2, n), 60));
    }
}</code></pre>
<div class="out">n^2 &gt; 100n for every n &gt;= 101 &nbsp;&nbsp;(still &lt;= at n = 100)<br>
n &gt; 1000 log2 n for every n &gt;= 13747 &nbsp;&nbsp;(still &lt;= at n = 13746)<br>
2^n &gt; n^3 for every n &gt;= 10 &nbsp;&nbsp;(still &lt;= at n = 9)<br>
n! &gt; 2^n for every n &gt;= 4 &nbsp;&nbsp;(still &lt;= at n = 3)</div>
<ul>
<li>Các đường cong có thể cắt nhau khi n nhỏ: 100n ≥ n² cho tới n = 100, n³ ≥ 2ⁿ với n = 2 … 9, 2ⁿ ≥ n! cho tới n = 3.</li>
<li>Sau điểm cắt cuối cùng, thứ tự không bao giờ đổi nữa — và Big-O chỉ nói về đúng phần đó.</li>
<li>Một hàm logarit dù nhân hằng số rất lớn (1000 log2 n) vẫn thua n trơn — từ n = 13.747 trở đi.</li>
<li>Trên thang chia đều (thang tuyến tính), các đường tăng nhanh vọt ra khỏi khung hình gần như ngay lập tức; vì thế đồ thị các hàm này thường dùng thang logarit cho trục đứng để tất cả cùng vừa khung.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> xem cuộc đua ở vạch đích, đừng nhìn mấy mét đầu — Big-O chỉ nhìn khi n lớn.</p>`],
      [33, 'Binary Search vs Sequential Search',
        `<p class="y-chinh">🎯 Sequential search costs c1·n in the worst case and binary search c2·log2 n; binary search has the bigger constant (c2 &gt; c1), so it can lose on tiny inputs, but for large n the gap in its favour grows without limit.</p>
<ul>
<li><strong>Sequential</strong>: compare the key with each element in turn — works on any array.</li>
<li><strong>Binary</strong>: needs a sorted array; each step compares with the middle element and discards half (slide 37). It is "more complex" — more work per step (computing mid, up to two comparisons, moving left or right) — hence the slide's "higher constant factor".</li>
<li>The labels n and 4log2n appear on the slide's figure. As an illustration, take c1 = 1 and c2 = 4 and compute both costs:</li>
</ul>
<pre><code class="language-java">import java.util.Locale;

public class SeqVsBinary {
    static int log2(int n) { int r = 0; while (n &gt; 1) { n /= 2; r++; } return r; }

    public static void main(String[] args) {
        // Illustration: sequential costs 1 * n, binary costs 4 * log2 n (c1 = 1, c2 = 4)
        System.out.println("        n   sequential n   binary 4*log2 n   cheaper");
        for (int n : new int[] {2, 4, 8, 16, 32, 64, 1024, 1048576}) {
            int seq = n, bin = 4 * log2(n);
            String cheaper = seq &lt; bin ? "sequential" : seq == bin ? "tie" : "binary";
            System.out.println(String.format(Locale.ROOT, "%9d %14d %17d   %s", n, seq, bin, cheaper));
        }
    }
}</code></pre>
<div class="out">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;n &nbsp;&nbsp;sequential n &nbsp;&nbsp;binary 4*log2 n &nbsp;&nbsp;cheaper<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4 &nbsp;&nbsp;sequential<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8 &nbsp;&nbsp;sequential<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;12 &nbsp;&nbsp;sequential<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;16 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;16 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;16 &nbsp;&nbsp;tie<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;32 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;32 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20 &nbsp;&nbsp;binary<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;64 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;64 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;24 &nbsp;&nbsp;binary<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1024 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1024 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;40 &nbsp;&nbsp;binary<br>
&nbsp;&nbsp;1048576 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1048576 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;80 &nbsp;&nbsp;binary</div>
<ul>
<li>Up to n = 8 the simple scan is cheaper; at n = 16 they tie; from n = 32 on binary search wins, and at a million elements it needs 80 steps instead of 1,048,576.</li>
<li>That is the slide's message: small problems — "we're not interested"; large problems — "we're interested in this gap".</li>
</ul>
<div class="pitfall">Binary search is O(log n) only on <strong>sorted</strong> data with O(1) access by index (an array). On an unsorted array its answers are wrong; on a linked list just reaching the middle element costs O(n), so the whole search is no better than a scan.</div>`,
        `<p class="y-chinh">🎯 Tìm tuần tự (sequential search) tốn c1·n trong trường hợp xấu nhất, tìm nhị phân (binary search) tốn c2·log2 n; tìm nhị phân có hằng số lớn hơn (c2 &gt; c1) nên có thể thua khi đầu vào rất nhỏ, nhưng khi n lớn khoảng cách có lợi cho nó tăng không giới hạn.</p>
<ul>
<li><strong>Tuần tự</strong>: so khoá lần lượt với từng phần tử — dùng được trên mọi mảng.</li>
<li><strong>Nhị phân</strong>: cần mảng đã sắp xếp; mỗi bước so với phần tử ở giữa rồi bỏ đi một nửa (slide 37). Nó "phức tạp hơn" — mỗi bước làm nhiều việc hơn (tính mid, tới hai phép so sánh, dời sang trái hay phải) — nên slide mới ghi "hệ số hằng lớn hơn" (higher constant factor).</li>
<li>Trên hình của slide có hai nhãn n và 4log2n. Để minh hoạ, lấy c1 = 1 và c2 = 4 rồi tính cả hai chi phí:</li>
</ul>
<pre><code class="language-java">import java.util.Locale;

public class SeqVsBinary {
    static int log2(int n) { int r = 0; while (n &gt; 1) { n /= 2; r++; } return r; }

    public static void main(String[] args) {
        // Minh hoạ: tuần tự tốn 1 * n, nhị phân tốn 4 * log2 n (c1 = 1, c2 = 4)
        System.out.println("        n   sequential n   binary 4*log2 n   cheaper");
        for (int n : new int[] {2, 4, 8, 16, 32, 64, 1024, 1048576}) {
            int seq = n, bin = 4 * log2(n);
            String cheaper = seq &lt; bin ? "sequential" : seq == bin ? "tie" : "binary";
            System.out.println(String.format(Locale.ROOT, "%9d %14d %17d   %s", n, seq, bin, cheaper));
        }
    }
}</code></pre>
<div class="out">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;n &nbsp;&nbsp;sequential n &nbsp;&nbsp;binary 4*log2 n &nbsp;&nbsp;cheaper<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4 &nbsp;&nbsp;sequential<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8 &nbsp;&nbsp;sequential<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;12 &nbsp;&nbsp;sequential<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;16 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;16 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;16 &nbsp;&nbsp;tie<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;32 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;32 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20 &nbsp;&nbsp;binary<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;64 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;64 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;24 &nbsp;&nbsp;binary<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1024 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1024 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;40 &nbsp;&nbsp;binary<br>
&nbsp;&nbsp;1048576 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1048576 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;80 &nbsp;&nbsp;binary</div>
<ul>
<li>Tới n = 8 quét tuần tự còn rẻ hơn; ở n = 16 hai bên hoà; từ n = 32 trở đi tìm nhị phân thắng, và với một triệu phần tử nó chỉ cần 80 bước thay vì 1.048.576.</li>
<li>Đó là thông điệp của slide: bài toán nhỏ — "ta không quan tâm"; bài toán lớn — "ta quan tâm tới khoảng cách này".</li>
</ul>
<div class="pitfall">Tìm nhị phân chỉ là O(log n) trên dữ liệu <strong>đã sắp xếp</strong> và truy cập theo chỉ số trong O(1) (mảng). Trên mảng chưa sắp nó trả lời sai; trên danh sách liên kết, chỉ riêng việc đi tới phần tử giữa đã tốn O(n), nên cả phép tìm không hơn gì quét tuần tự.</div>`],
      [34, 'Determining time complexity',
        `<p class="y-chinh">🎯 Determining time complexity takes two steps: count the operations as a function of n, then convert the count to Big-O by keeping only the dominant term.</p>
<ol>
<li><strong>Count</strong>: pick the operation that runs most often (usually the comparison in the innermost loop) and count how many times it runs — exactly, or at least its highest term.</li>
<li><strong>Convert</strong>: drop lower-order terms and constant factors (slides 19 and 26).</li>
</ol>
<p class="nhan">The lesson's example — every pair (i, j) with i &lt; j</p>
<pre><code class="language-plaintext">for i := 0 to n - 1
    for j := i + 1 to n - 1
        count := count + 1        // runs (n-1) + (n-2) + ... + 1 + 0 times</code></pre>
<pre><code class="language-java">import java.util.Locale;

public class CountThenConvert {
    public static void main(String[] args) {
        System.out.println("     n   count   n(n-1)/2   count / n^2");
        for (int n : new int[] {10, 100, 1000, 10000}) {
            long count = 0;
            for (int i = 0; i &lt; n; i++)                 // step 1: count how often the body runs
                for (int j = i + 1; j &lt; n; j++)         // every pair i &lt; j once
                    count++;
            // step 2: keep the dominant term n^2/2, drop the 1/2 -&gt; O(n^2)
            System.out.println(String.format(Locale.ROOT, "%6d %9d %10d %13.4f", n, count, (long) n * (n - 1) / 2, count / ((double) n * n)));
        }
    }
}</code></pre>
<div class="out">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;n &nbsp;&nbsp;count &nbsp;&nbsp;n(n-1)/2 &nbsp;&nbsp;count / n^2<br>
&nbsp;&nbsp;&nbsp;&nbsp;10 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;45 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;45 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.4500<br>
&nbsp;&nbsp;&nbsp;100 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4950 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4950 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.4950<br>
&nbsp;&nbsp;1000 &nbsp;&nbsp;&nbsp;499500 &nbsp;&nbsp;&nbsp;&nbsp;499500 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.4995<br>
&nbsp;10000 &nbsp;49995000 &nbsp;&nbsp;49995000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.5000</div>
<ul>
<li>Step 1: (n − 1) + (n − 2) + … + 1 = n(n − 1)/2 — the program's count matches the formula exactly.</li>
<li>Step 2: n(n − 1)/2 = n²/2 − n/2 → keep n²/2 → drop the 1/2 → <strong>O(n²)</strong>. The last column (count/n² → 0.5) confirms it.</li>
<li>As the slide says, we describe algorithms in pseudocode for this — slides 35–37 apply the two steps to the deck's own procedures.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> a nested loop whose inner loop starts at i + 1 is still O(n²) — half of n² is still n².</p>`,
        `<p class="y-chinh">🎯 Xác định độ phức tạp thời gian gồm hai bước: đếm số phép toán thành một hàm của n, rồi đổi số đếm sang Big-O (O lớn) bằng cách chỉ giữ số hạng trội.</p>
<ol>
<li><strong>Đếm (count)</strong>: chọn phép toán chạy nhiều lần nhất (thường là phép so sánh ở vòng lặp trong cùng) và đếm xem nó chạy bao nhiêu lần — chính xác, hoặc ít nhất là số hạng bậc cao nhất.</li>
<li><strong>Đổi sang Big-O (convert)</strong>: bỏ các số hạng bậc thấp và hệ số hằng (slide 19 và 26).</li>
</ol>
<p class="nhan">Ví dụ của bài — mọi cặp (i, j) với i &lt; j</p>
<pre><code class="language-plaintext">for i := 0 to n - 1
    for j := i + 1 to n - 1
        count := count + 1        // chạy (n-1) + (n-2) + ... + 1 + 0 lần</code></pre>
<pre><code class="language-java">import java.util.Locale;

public class CountThenConvert {
    public static void main(String[] args) {
        System.out.println("     n   count   n(n-1)/2   count / n^2");
        for (int n : new int[] {10, 100, 1000, 10000}) {
            long count = 0;
            for (int i = 0; i &lt; n; i++)                 // bước 1: đếm số lần thân vòng chạy
                for (int j = i + 1; j &lt; n; j++)         // mỗi cặp i &lt; j đúng một lần
                    count++;
            // bước 2: giữ số hạng trội n^2/2, bỏ hệ số 1/2 -&gt; O(n^2)
            System.out.println(String.format(Locale.ROOT, "%6d %9d %10d %13.4f", n, count, (long) n * (n - 1) / 2, count / ((double) n * n)));
        }
    }
}</code></pre>
<div class="out">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;n &nbsp;&nbsp;count &nbsp;&nbsp;n(n-1)/2 &nbsp;&nbsp;count / n^2<br>
&nbsp;&nbsp;&nbsp;&nbsp;10 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;45 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;45 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.4500<br>
&nbsp;&nbsp;&nbsp;100 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4950 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4950 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.4950<br>
&nbsp;&nbsp;1000 &nbsp;&nbsp;&nbsp;499500 &nbsp;&nbsp;&nbsp;&nbsp;499500 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.4995<br>
&nbsp;10000 &nbsp;49995000 &nbsp;&nbsp;49995000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.5000</div>
<ul>
<li>Bước 1: (n − 1) + (n − 2) + … + 1 = n(n − 1)/2 — số đếm của chương trình khớp đúng công thức.</li>
<li>Bước 2: n(n − 1)/2 = n²/2 − n/2 → giữ n²/2 → bỏ hệ số 1/2 → <strong>O(n²)</strong>. Cột cuối (count/n² → 0,5) xác nhận điều đó.</li>
<li>Như slide nói, ta mô tả thuật toán bằng mã giả để làm việc này — slide 35–37 áp dụng hai bước trên cho chính các thủ tục của bộ slide.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> vòng lặp lồng mà vòng trong bắt đầu từ i + 1 vẫn là O(n²) — một nửa của n² vẫn là n².</p>`],
      [35, 'Examples for determining time complexity - 1',
        `<p class="y-chinh">🎯 Finding the maximum makes one comparison per element after the first — N − 1 comparisons for N numbers, whatever the data — so it is O(n).</p>
<pre><code class="language-plaintext">procedure max(a0, a1, a2, ..., an: R)        R = real numbers
    max := a0
    for i := 1 to n
        if max &lt; ai then max := ai
    end for
    return max
end procedure</code></pre>
<p>The slide's procedure, traced on a0 … a5 = 4, 9, 2, 11, 7, 5 (so n = 5):</p>
<pre><code class="language-java">public class MaxProcedure {
    static int comparisons;

    // procedure max(a0, a1, ..., an) exactly as on the slide: i := 1 to n
    static int max(int[] a, int n) {
        int max = a[0];                                // max := a0
        for (int i = 1; i &lt;= n; i++) {                 // for i := 1 to n
            comparisons++;
            boolean bigger = max &lt; a[i];               // the comparison max &lt; ai
            if (bigger) max = a[i];                    // then max := ai
            System.out.println("i = " + i + "  a" + i + " = " + a[i] + "  max &lt; a" + i + "? " + (bigger ? "yes" : "no ") + "  max = " + max);
        }
        return max;
    }

    public static void main(String[] args) {
        int[] a = {4, 9, 2, 11, 7, 5};                  // a0 .. a5: n = 5 in the slide's notation
        System.out.println("max = " + max(a, 5) + " after " + comparisons + " comparisons on " + a.length + " numbers");
    }
}</code></pre>
<div class="out">i = 1 &nbsp;a1 = 9 &nbsp;max &lt; a1? yes &nbsp;max = 9<br>
i = 2 &nbsp;a2 = 2 &nbsp;max &lt; a2? no &nbsp;&nbsp;max = 9<br>
i = 3 &nbsp;a3 = 11 &nbsp;max &lt; a3? yes &nbsp;max = 11<br>
i = 4 &nbsp;a4 = 7 &nbsp;max &lt; a4? no &nbsp;&nbsp;max = 11<br>
i = 5 &nbsp;a5 = 5 &nbsp;max &lt; a5? no &nbsp;&nbsp;max = 11<br>
max = 11 after 5 comparisons on 6 numbers</div>
<ul>
<li>The comparison <code>max &lt; ai</code> runs once per turn of the loop, for every input: max has no early exit, so the count is the same in the best and in the worst case.</li>
<li><code>max := ai</code> runs only when a bigger element appears — twice here (9, then 11); at least 0 times (largest element first), at most once per turn (increasing data). It changes the constant, never the Big-O.</li>
<li>Converting (slide 34): (number of elements − 1) comparisons → drop the constant → O(n), more precisely Θ(n).</li>
</ul>
<div class="pitfall"><strong>What slide 35 prints vs the corrected version:</strong> the header lists a0 … an — that is <strong>n + 1</strong> numbers — and the loop is <code>for i := 1 to n</code>, so <code>max &lt; ai</code> runs <strong>n</strong> times (5 for a0 … a5 in the trace), not "n − 1". Corrected, for a sequence of n numbers: <code>procedure max(a0, a1, …, a(n−1))</code> with <code>for i := 1 to n − 1</code> → exactly n − 1 comparisons. Both versions are O(n). In the FE, "how many comparisons does max make on 10 numbers?" → 9.</div>`,
        `<p class="y-chinh">🎯 Tìm giá trị lớn nhất tốn một phép so sánh cho mỗi phần tử sau phần tử đầu — N số thì N − 1 phép so sánh, dữ liệu thế nào cũng vậy — nên nó là O(n).</p>
<pre><code class="language-plaintext">procedure max(a0, a1, a2, ..., an: R)        R = số thực
    max := a0
    for i := 1 to n
        if max &lt; ai then max := ai
    end for
    return max
end procedure</code></pre>
<p>Thủ tục (procedure) của slide, chạy lần theo trên a0 … a5 = 4, 9, 2, 11, 7, 5 (tức n = 5):</p>
<pre><code class="language-java">public class MaxProcedure {
    static int comparisons;

    // procedure max(a0, a1, ..., an) đúng như slide: i := 1 to n
    static int max(int[] a, int n) {
        int max = a[0];                                // max := a0
        for (int i = 1; i &lt;= n; i++) {                 // for i := 1 to n
            comparisons++;
            boolean bigger = max &lt; a[i];               // phép so sánh max &lt; ai
            if (bigger) max = a[i];                    // then max := ai
            System.out.println("i = " + i + "  a" + i + " = " + a[i] + "  max &lt; a" + i + "? " + (bigger ? "yes" : "no ") + "  max = " + max);
        }
        return max;
    }

    public static void main(String[] args) {
        int[] a = {4, 9, 2, 11, 7, 5};                  // a0 .. a5: theo cách viết của slide thì n = 5
        System.out.println("max = " + max(a, 5) + " after " + comparisons + " comparisons on " + a.length + " numbers");
    }
}</code></pre>
<div class="out">i = 1 &nbsp;a1 = 9 &nbsp;max &lt; a1? yes &nbsp;max = 9<br>
i = 2 &nbsp;a2 = 2 &nbsp;max &lt; a2? no &nbsp;&nbsp;max = 9<br>
i = 3 &nbsp;a3 = 11 &nbsp;max &lt; a3? yes &nbsp;max = 11<br>
i = 4 &nbsp;a4 = 7 &nbsp;max &lt; a4? no &nbsp;&nbsp;max = 11<br>
i = 5 &nbsp;a5 = 5 &nbsp;max &lt; a5? no &nbsp;&nbsp;max = 11<br>
max = 11 after 5 comparisons on 6 numbers</div>
<ul>
<li>Phép so sánh <code>max &lt; ai</code> chạy một lần mỗi lượt lặp, với mọi đầu vào: tìm max không có lối thoát sớm, nên số lần so sánh ở trường hợp tốt nhất và xấu nhất bằng nhau.</li>
<li>Lệnh <code>max := ai</code> chỉ chạy khi gặp phần tử lớn hơn — ở đây hai lần (9, rồi 11); ít nhất 0 lần (phần tử lớn nhất đứng đầu), nhiều nhất mỗi lượt một lần (dữ liệu tăng dần). Nó làm đổi hằng số, không bao giờ đổi Big-O (O lớn).</li>
<li>Đổi sang Big-O (slide 34): (số phần tử − 1) phép so sánh → bỏ hằng số → O(n), nói chính xác hơn là Θ(n).</li>
</ul>
<div class="pitfall"><strong>Chỗ lệch trên slide 35 và bản đã sửa:</strong> phần đầu thủ tục liệt kê a0 … an — tức <strong>n + 1</strong> số — và vòng lặp là <code>for i := 1 to n</code>, nên <code>max &lt; ai</code> chạy <strong>n</strong> lần (5 lần với a0 … a5 trong bảng lần theo), không phải "n − 1". Bản sửa cho dãy n số: <code>procedure max(a0, a1, …, a(n−1))</code> với <code>for i := 1 to n − 1</code> → đúng n − 1 phép so sánh. Cả hai bản đều là O(n). Trong FE (thi cuối kỳ), "tìm max trên 10 số tốn bao nhiêu phép so sánh?" → 9.</div>`],
      [36, 'Examples for determining time complexity - 2',
        `<p class="y-chinh">🎯 Linear search compares the key with the elements one by one and stops at the first match: from 1 comparison (best case) up to one per element (worst case) — O(n).</p>
<pre><code class="language-plaintext">procedure linear search(key, a0, a1, ..., an: R)
    loc := -1
    i := 0
    while i &lt;= n and loc = -1
        if key = ai then loc := i
        i := i + 1
    return loc</code></pre>
<pre><code class="language-java">public class LinearSearchProcedure {
    static int comparisons;

    // procedure linear search(key, a0, a1, ..., an) exactly as on the slide
    static int linearSearch(int key, int[] a, int n) {
        int loc = -1;                                  // loc := -1
        int i = 0;                                     // i := 0
        while (i &lt;= n &amp;&amp; loc == -1) {                  // while i &lt;= n and loc = -1
            comparisons++;                             // the comparison key = ai
            if (key == a[i]) loc = i;                  // if key = ai then loc := i
            i = i + 1;                                 // i := i + 1
        }
        return loc;                                    // return loc
    }

    public static void main(String[] args) {
        int[] a = {4, 9, 2, 11, 7, 5};                  // a0 .. a5, so n = 5
        for (int key : new int[] {4, 11, 5, 8}) {
            comparisons = 0;
            int loc = linearSearch(key, a, 5);
            System.out.println("key = " + key + ": loc = " + loc + ", comparisons = " + comparisons);
        }
    }
}</code></pre>
<div class="out">key = 4: loc = 0, comparisons = 1<br>
key = 11: loc = 3, comparisons = 4<br>
key = 5: loc = 5, comparisons = 6<br>
key = 8: loc = -1, comparisons = 6</div>
<ul>
<li><code>loc = -1</code> in the loop test makes the search stop right after a match: key 4 (at a0) costs 1 comparison, key 11 (at a3) costs 4.</li>
<li>Key at the last position (5 = a5) or missing (8): the loop runs to the end — 6 comparisons on the six numbers a0 … a5.</li>
<li>"Both 1 and n are O(n)" is true, because O is only an upper bound. More precisely, the best case is Θ(1) and the worst case Θ(n).</li>
<li>Average, if the key is present and equally likely to be at each of the n positions: (n + 1)/2 comparisons — still Θ(n).</li>
</ul>
<div class="pitfall"><strong>What slide 36 prints vs the corrected version:</strong> <code>while i &lt;= n</code> over a0 … an examines up to <strong>n + 1</strong> numbers, so the comparison <code>key = ai</code> runs from 1 to n + 1 times (6 for a0 … a5 above), not "from 1 to n". Corrected, for n numbers a0 … a(n−1): <code>while i &lt;= n - 1 and loc = -1</code> (in Java <code>i &lt; n</code>) → from 1 to n comparisons. The Big-O does not change: O(n).</div>
<p class="meo">🧠 <strong>Remember:</strong> looking for a friend in a queue — lucky if they stand first, unlucky if they stand last or never came, and on average you walk half the queue.</p>`,
        `<p class="y-chinh">🎯 Tìm tuyến tính (linear search) so khoá lần lượt với từng phần tử và dừng ở chỗ khớp đầu tiên: từ 1 phép so sánh (tốt nhất) tới mỗi phần tử một phép (xấu nhất) — O(n).</p>
<pre><code class="language-plaintext">procedure linear search(key, a0, a1, ..., an: R)
    loc := -1
    i := 0
    while i &lt;= n and loc = -1
        if key = ai then loc := i
        i := i + 1
    return loc</code></pre>
<pre><code class="language-java">public class LinearSearchProcedure {
    static int comparisons;

    // procedure linear search(key, a0, a1, ..., an) đúng như slide
    static int linearSearch(int key, int[] a, int n) {
        int loc = -1;                                  // loc := -1
        int i = 0;                                     // i := 0
        while (i &lt;= n &amp;&amp; loc == -1) {                  // while i &lt;= n and loc = -1
            comparisons++;                             // phép so sánh key = ai
            if (key == a[i]) loc = i;                  // if key = ai then loc := i
            i = i + 1;                                 // i := i + 1
        }
        return loc;                                    // return loc
    }

    public static void main(String[] args) {
        int[] a = {4, 9, 2, 11, 7, 5};                  // a0 .. a5, nên n = 5
        for (int key : new int[] {4, 11, 5, 8}) {
            comparisons = 0;
            int loc = linearSearch(key, a, 5);
            System.out.println("key = " + key + ": loc = " + loc + ", comparisons = " + comparisons);
        }
    }
}</code></pre>
<div class="out">key = 4: loc = 0, comparisons = 1<br>
key = 11: loc = 3, comparisons = 4<br>
key = 5: loc = 5, comparisons = 6<br>
key = 8: loc = -1, comparisons = 6</div>
<ul>
<li>Điều kiện <code>loc = -1</code> trong vòng lặp làm phép tìm dừng ngay sau khi khớp: khoá 4 (ở a0) tốn 1 phép so sánh, khoá 11 (ở a3) tốn 4.</li>
<li>Khoá ở vị trí cuối (5 = a5) hoặc không có (8): vòng lặp chạy tới hết — 6 phép so sánh trên sáu số a0 … a5.</li>
<li>"Both 1 and n are O(n)" (cả 1 lẫn n đều là O(n)) là đúng, vì O chỉ là cận trên. Nói chính xác hơn: trường hợp tốt nhất là Θ(1), xấu nhất là Θ(n).</li>
<li>Trung bình, nếu khoá có trong dãy và có khả năng như nhau ở mỗi vị trí trong n vị trí: (n + 1)/2 phép so sánh — vẫn là Θ(n).</li>
</ul>
<div class="pitfall"><strong>Chỗ lệch trên slide 36 và bản đã sửa:</strong> <code>while i &lt;= n</code> trên a0 … an xét tới <strong>n + 1</strong> số, nên phép so sánh <code>key = ai</code> chạy từ 1 tới n + 1 lần (6 lần với a0 … a5 ở trên), không phải "from 1 to n" (từ 1 tới n). Bản sửa cho n số a0 … a(n−1): <code>while i &lt;= n - 1 and loc = -1</code> (trong Java là <code>i &lt; n</code>) → từ 1 tới n phép so sánh. Big-O (O lớn) không đổi: O(n).</div>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> tìm một người bạn trong hàng đợi — may thì bạn ấy đứng đầu, xui thì đứng cuối hoặc không đến, còn trung bình bạn phải đi hết nửa hàng.</p>`],
      [37, 'Examples for determining time complexity - 3',
        `<p class="y-chinh">🎯 Binary search halves the part of a sorted array that can still contain the key at every step, so it needs about log2 n steps — O(log n); but the slide's pseudocode must be corrected first.</p>
<pre><code class="language-plaintext">procedure binary search(key: R; a0, a1, ..., an: increasing R)
    left := 0; right := n-1            &lt;-- read with a0 ... an, this skips an
    while left &lt;= right
    begin
        mid := (left + right)/2        integer division: (5 + 6)/2 = 5
        if amid = key return mid
        if key &gt; mid                   &lt;-- BUG: must be  key &gt; amid
            then left := mid + 1
            else right := mid - 1
    end
    return -1</code></pre>
<ul>
<li><strong>The bug</strong>: <code>key &gt; mid</code> compares the key with an <em>index</em>; it must compare it with the <em>value</em> <code>a[mid]</code>. The slide's own count line ("key &gt; amid is performed…") confirms the intended test.</li>
<li><code>mid := (left + right)/2</code> keeps only the integer part.</li>
<li><strong>Indexing</strong>: <code>right := n-1</code> fits n elements a0 … a(n−1); read with the header's a0 … an it never looks at an (the program's third test).</li>
</ul>
<pre><code class="language-java">public class BinarySearchProcedure {
    static int loops;                                   // iterations of the while loop

    // The slide's procedure. slideBug = true keeps "if key &gt; mid" exactly as printed
    static int binarySearch(int key, int[] a, int right, boolean slideBug, boolean trace) {
        int left = 0;                                   // left := 0; right is passed in
        loops = 0;
        while (left &lt;= right) {                         // while left &lt;= right
            int mid = (left + right) / 2;               // integer division drops the fraction
            loops++;
            if (trace) System.out.println("  left = " + left + "  right = " + right + "  mid = " + mid + "  a[mid] = " + a[mid]);
            if (a[mid] == key) return mid;              // if amid = key return mid
            boolean goRight = slideBug ? key &gt; mid      // BUG: compares key with an index
                                       : key &gt; a[mid];  // FIX: compare key with the value
            if (goRight) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] a = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};   // 10 elements a0 .. a9
        System.out.println("fixed (key &gt; a[mid]), key = 23:");
        System.out.println("  -&gt; returns " + binarySearch(23, a, a.length - 1, false, true));
        System.out.println("as printed (key &gt; mid), key = 23:");
        System.out.println("  -&gt; returns " + binarySearch(23, a, a.length - 1, true, true));
        // header a0 .. an read literally: n = 9, right := n - 1 = 8
        System.out.println("right := n-1 with a0..a9 (n = 9), key = 91 = a9 -&gt; returns " + binarySearch(91, a, 8, false, false));
        System.out.println("most loops over every key, present or absent:");
        for (int n : new int[] {10, 100, 1000, 1000000}) {
            int[] b = new int[n];
            for (int i = 0; i &lt; n; i++) b[i] = 2 * i + 2;              // 2, 4, 6, ...: odd keys are absent
            int most = 0;
            for (int key = 1; key &lt;= 2 * n + 1; key++) {
                binarySearch(key, b, n - 1, false, false);
                most = Math.max(most, loops);
            }
            int floorLog = 31 - Integer.numberOfLeadingZeros(n);       // floor(log2 n)
            System.out.println("  n = " + n + ": " + most + " loops   (floor(log2 n) + 1 = " + (floorLog + 1) + ")");
        }
    }
}</code></pre>
<div class="out">fixed (key &gt; a[mid]), key = 23:<br>
&nbsp;&nbsp;left = 0 &nbsp;right = 9 &nbsp;mid = 4 &nbsp;a[mid] = 16<br>
&nbsp;&nbsp;left = 5 &nbsp;right = 9 &nbsp;mid = 7 &nbsp;a[mid] = 56<br>
&nbsp;&nbsp;left = 5 &nbsp;right = 6 &nbsp;mid = 5 &nbsp;a[mid] = 23<br>
&nbsp;&nbsp;-&gt; returns 5<br>
as printed (key &gt; mid), key = 23:<br>
&nbsp;&nbsp;left = 0 &nbsp;right = 9 &nbsp;mid = 4 &nbsp;a[mid] = 16<br>
&nbsp;&nbsp;left = 5 &nbsp;right = 9 &nbsp;mid = 7 &nbsp;a[mid] = 56<br>
&nbsp;&nbsp;left = 8 &nbsp;right = 9 &nbsp;mid = 8 &nbsp;a[mid] = 72<br>
&nbsp;&nbsp;left = 9 &nbsp;right = 9 &nbsp;mid = 9 &nbsp;a[mid] = 91<br>
&nbsp;&nbsp;-&gt; returns -1<br>
right := n-1 with a0..a9 (n = 9), key = 91 = a9 -&gt; returns -1<br>
most loops over every key, present or absent:<br>
&nbsp;&nbsp;n = 10: 4 loops &nbsp;&nbsp;(floor(log2 n) + 1 = 4)<br>
&nbsp;&nbsp;n = 100: 7 loops &nbsp;&nbsp;(floor(log2 n) + 1 = 7)<br>
&nbsp;&nbsp;n = 1000: 10 loops &nbsp;&nbsp;(floor(log2 n) + 1 = 10)<br>
&nbsp;&nbsp;n = 1000000: 20 loops &nbsp;&nbsp;(floor(log2 n) + 1 = 20)</div>
<p class="nhan">Trace of the fixed version — key = 23 in [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]</p>
<table>
<thead><tr><th>Loop</th><th>left</th><th>right</th><th>mid</th><th>a[mid]</th><th>Decision</th></tr></thead>
<tbody>
<tr><td>1</td><td>0</td><td>9</td><td>4</td><td>16</td><td>23 &gt; 16 → left = 5</td></tr>
<tr><td>2</td><td>5</td><td>9</td><td>7</td><td>56</td><td>23 &lt; 56 → right = 6</td></tr>
<tr><td>3</td><td>5</td><td>6</td><td>5</td><td>23</td><td>found → return 5</td></tr>
</tbody>
</table>
<ul>
<li>With the bug, the same search compares 23 with the indices 4, 7, 8, 9, always goes right, and returns −1 although 23 is in the array.</li>
<li><strong>Big-O</strong>: every loop at least halves the range right − left + 1, so the worst case is ⌊log2 n⌋ + 1 loops — 4 for n = 10, 20 for a million (the program tries every key). Each loop makes at most two comparisons, so about log2 n of each kind: O(log n).</li>
</ul>
<div class="pitfall"><strong>What slide 37 prints vs the corrected version:</strong> (1) <code>if key &gt; mid</code> → <code>if key &gt; a[mid]</code>; (2) the header a0 … an together with <code>right := n-1</code> skips an → write the header as a0 … a(n−1), or keep a0 … an and start with <code>right := n</code>; (3) "key &gt; amid is performed log2 n times" → in the worst case the loop runs ⌊log2 n⌋ + 1 times — still O(log n). The corrected procedure, for n elements:
<pre><code class="language-plaintext">procedure binary search(key: R; a0, a1, ..., a(n-1): increasing R)
    left := 0; right := n-1
    while left &lt;= right
        mid := (left + right)/2
        if a[mid] = key then return mid
        if key &gt; a[mid] then left := mid + 1
                        else right := mid - 1
    return -1</code></pre>
</div>
<div class="pitfall">Two more binary-search traps: the array must be <strong>sorted</strong> (otherwise the answers are simply wrong); and in Java <code>(left + right) / 2</code> overflows on arrays of more than about a billion elements — <code>left + (right - left) / 2</code> is the safe form.</div>`,
        `<p class="y-chinh">🎯 Tìm nhị phân chia đôi phần mảng đã sắp còn có thể chứa khoá sau mỗi bước, nên chỉ cần khoảng log2 n bước — O(log n); nhưng mã giả trên slide phải được sửa trước.</p>
<pre><code class="language-plaintext">procedure binary search(key: R; a0, a1, ..., an: increasing R)
    left := 0; right := n-1            &lt;-- đọc với a0 ... an thì bỏ sót an
    while left &lt;= right
    begin
        mid := (left + right)/2        chia nguyên: (5 + 6)/2 = 5
        if amid = key return mid
        if key &gt; mid                   &lt;-- LỖI: phải là  key &gt; amid
            then left := mid + 1
            else right := mid - 1
    end
    return -1</code></pre>
<ul>
<li><strong>Lỗi</strong>: <code>key &gt; mid</code> so khoá với một <em>chỉ số</em>; phải so với <em>giá trị</em> <code>a[mid]</code>. Chính dòng đếm trên slide ("key &gt; amid is performed…" — phép so sánh key &gt; amid được thực hiện…) xác nhận phép so sánh dự định là với amid.</li>
<li><code>mid := (left + right)/2</code> chỉ lấy phần nguyên.</li>
<li><strong>Chỉ số</strong>: <code>right := n-1</code> hợp với n phần tử a0 … a(n−1); đọc cùng phần đầu a0 … an thì nó không bao giờ xét tới an (phép thử thứ ba của chương trình).</li>
</ul>
<pre><code class="language-java">public class BinarySearchProcedure {
    static int loops;                                   // số vòng lặp while đã chạy

    // Thủ tục của slide. slideBug = true giữ nguyên "if key &gt; mid" như slide in
    static int binarySearch(int key, int[] a, int right, boolean slideBug, boolean trace) {
        int left = 0;                                   // left := 0; right truyền vào
        loops = 0;
        while (left &lt;= right) {                         // while left &lt;= right
            int mid = (left + right) / 2;               // chia nguyên, bỏ phần lẻ
            loops++;
            if (trace) System.out.println("  left = " + left + "  right = " + right + "  mid = " + mid + "  a[mid] = " + a[mid]);
            if (a[mid] == key) return mid;              // if amid = key return mid
            boolean goRight = slideBug ? key &gt; mid      // LỖI: so khoá với một chỉ số
                                       : key &gt; a[mid];  // SỬA: so khoá với giá trị
            if (goRight) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] a = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};   // 10 phần tử a0 .. a9
        System.out.println("fixed (key &gt; a[mid]), key = 23:");
        System.out.println("  -&gt; returns " + binarySearch(23, a, a.length - 1, false, true));
        System.out.println("as printed (key &gt; mid), key = 23:");
        System.out.println("  -&gt; returns " + binarySearch(23, a, a.length - 1, true, true));
        // đọc đúng chữ phần đầu a0 .. an: n = 9, right := n - 1 = 8
        System.out.println("right := n-1 with a0..a9 (n = 9), key = 91 = a9 -&gt; returns " + binarySearch(91, a, 8, false, false));
        System.out.println("most loops over every key, present or absent:");
        for (int n : new int[] {10, 100, 1000, 1000000}) {
            int[] b = new int[n];
            for (int i = 0; i &lt; n; i++) b[i] = 2 * i + 2;              // 2, 4, 6, ...: khoá lẻ là không có
            int most = 0;
            for (int key = 1; key &lt;= 2 * n + 1; key++) {
                binarySearch(key, b, n - 1, false, false);
                most = Math.max(most, loops);
            }
            int floorLog = 31 - Integer.numberOfLeadingZeros(n);       // floor(log2 n)
            System.out.println("  n = " + n + ": " + most + " loops   (floor(log2 n) + 1 = " + (floorLog + 1) + ")");
        }
    }
}</code></pre>
<div class="out">fixed (key &gt; a[mid]), key = 23:<br>
&nbsp;&nbsp;left = 0 &nbsp;right = 9 &nbsp;mid = 4 &nbsp;a[mid] = 16<br>
&nbsp;&nbsp;left = 5 &nbsp;right = 9 &nbsp;mid = 7 &nbsp;a[mid] = 56<br>
&nbsp;&nbsp;left = 5 &nbsp;right = 6 &nbsp;mid = 5 &nbsp;a[mid] = 23<br>
&nbsp;&nbsp;-&gt; returns 5<br>
as printed (key &gt; mid), key = 23:<br>
&nbsp;&nbsp;left = 0 &nbsp;right = 9 &nbsp;mid = 4 &nbsp;a[mid] = 16<br>
&nbsp;&nbsp;left = 5 &nbsp;right = 9 &nbsp;mid = 7 &nbsp;a[mid] = 56<br>
&nbsp;&nbsp;left = 8 &nbsp;right = 9 &nbsp;mid = 8 &nbsp;a[mid] = 72<br>
&nbsp;&nbsp;left = 9 &nbsp;right = 9 &nbsp;mid = 9 &nbsp;a[mid] = 91<br>
&nbsp;&nbsp;-&gt; returns -1<br>
right := n-1 with a0..a9 (n = 9), key = 91 = a9 -&gt; returns -1<br>
most loops over every key, present or absent:<br>
&nbsp;&nbsp;n = 10: 4 loops &nbsp;&nbsp;(floor(log2 n) + 1 = 4)<br>
&nbsp;&nbsp;n = 100: 7 loops &nbsp;&nbsp;(floor(log2 n) + 1 = 7)<br>
&nbsp;&nbsp;n = 1000: 10 loops &nbsp;&nbsp;(floor(log2 n) + 1 = 10)<br>
&nbsp;&nbsp;n = 1000000: 20 loops &nbsp;&nbsp;(floor(log2 n) + 1 = 20)</div>
<p class="nhan">Lần theo bản đã sửa — khoá 23 trong [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]</p>
<table>
<thead><tr><th>Vòng</th><th>left</th><th>right</th><th>mid</th><th>a[mid]</th><th>Quyết định</th></tr></thead>
<tbody>
<tr><td>1</td><td>0</td><td>9</td><td>4</td><td>16</td><td>23 &gt; 16 → left = 5</td></tr>
<tr><td>2</td><td>5</td><td>9</td><td>7</td><td>56</td><td>23 &lt; 56 → right = 6</td></tr>
<tr><td>3</td><td>5</td><td>6</td><td>5</td><td>23</td><td>tìm thấy → trả về 5</td></tr>
</tbody>
</table>
<ul>
<li>Với bản có lỗi, cùng phép tìm đó so 23 với các chỉ số 4, 7, 8, 9, lúc nào cũng rẽ phải, và trả về −1 dù 23 có trong mảng.</li>
<li><strong>Big-O</strong>: mỗi vòng lặp làm khoảng right − left + 1 giảm ít nhất một nửa, nên trường hợp xấu nhất là ⌊log2 n⌋ + 1 vòng — 4 vòng với n = 10, 20 vòng với một triệu phần tử (chương trình thử mọi khoá). Mỗi vòng tối đa hai phép so sánh, nên mỗi loại khoảng log2 n lần: O(log n).</li>
</ul>
<div class="pitfall"><strong>Chỗ lệch trên slide 37 và bản đã sửa:</strong> (1) <code>if key &gt; mid</code> → <code>if key &gt; a[mid]</code>; (2) phần đầu a0 … an đi cùng <code>right := n-1</code> thì bỏ sót an → viết phần đầu là a0 … a(n−1), hoặc giữ a0 … an và bắt đầu bằng <code>right := n</code>; (3) "key &gt; amid is performed log2 n times" (key &gt; amid được thực hiện log2 n lần) → trong trường hợp xấu nhất vòng lặp chạy ⌊log2 n⌋ + 1 lần — vẫn là O(log n). Thủ tục đã sửa, cho n phần tử:
<pre><code class="language-plaintext">procedure binary search(key: R; a0, a1, ..., a(n-1): increasing R)
    left := 0; right := n-1
    while left &lt;= right
        mid := (left + right)/2
        if a[mid] = key then return mid
        if key &gt; a[mid] then left := mid + 1
                        else right := mid - 1
    return -1</code></pre>
</div>
<div class="pitfall">Thêm hai bẫy của tìm nhị phân: mảng phải được <strong>sắp xếp</strong> (không thì câu trả lời sai luôn); và trong Java <code>(left + right) / 2</code> bị tràn số (overflow) với mảng hơn khoảng một tỉ phần tử — viết <code>left + (right - left) / 2</code> mới an toàn.</div>`],
      [38, 'Amortized Complexity - Main idea',
        `<p class="y-chinh">🎯 Amortized analysis looks at a whole sequence of operations: cheap operations are charged a little extra, and the savings pay for the rare expensive ones, so the average cost per operation over the sequence is guaranteed.</p>
<ul>
<li><strong>Worst case per operation is often too pessimistic</strong>: if one operation in a hundred is expensive, charging every operation the expensive price wildly overestimates the total.</li>
<li><strong>Average case is often difficult</strong>: it is not clear what "average data" is, uniformly random data is usually not what programs really receive, and probabilistic arguments can be hard.</li>
<li><strong>Amortized</strong> needs no probability: it bounds the <em>total</em> cost of any sequence of operations, then divides by their number.</li>
</ul>
<p class="nhan">The lesson's example (the one slide 40 analyses) — adding 16 elements to an array that doubles when full, charging 3 units per add</p>
<pre><code class="language-java">import java.util.Locale;

public class CostSequence {
    public static void main(String[] args) {
        int count = 0, N = 0;                           // elements stored, cells available
        long total = 0, saved = 0;
        StringBuilder num = new StringBuilder(), cost = new StringBuilder(), bank = new StringBuilder();
        for (int i = 1; i &lt;= 16; i++) {
            int c;
            if (count == N) {                           // full: double, copy count elements, write 1
                N = (N == 0) ? 1 : 2 * N;
                c = count + 1;
            } else {
                c = 1;                                  // room left: just write it
            }
            count++;
            total += c;
            saved += 3 - c;                             // charge 3 per add, keep what is not spent
            num.append(String.format(Locale.ROOT, "%3d", i));
            cost.append(String.format(Locale.ROOT, "%3d", c));
            bank.append(String.format(Locale.ROOT, "%3d", saved));
        }
        System.out.println("add #  " + num);
        System.out.println("cost   " + cost);
        System.out.println("saved  " + bank);
        System.out.println("total real cost of 16 adds = " + total + " &lt;= 3 x 16 = 48");
    }
}</code></pre>
<div class="out">add # &nbsp;&nbsp;&nbsp;1 &nbsp;2 &nbsp;3 &nbsp;4 &nbsp;5 &nbsp;6 &nbsp;7 &nbsp;8 &nbsp;9 10 11 12 13 14 15 16<br>
cost &nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;2 &nbsp;3 &nbsp;1 &nbsp;5 &nbsp;1 &nbsp;1 &nbsp;1 &nbsp;9 &nbsp;1 &nbsp;1 &nbsp;1 &nbsp;1 &nbsp;1 &nbsp;1 &nbsp;1<br>
saved &nbsp;&nbsp;&nbsp;2 &nbsp;3 &nbsp;3 &nbsp;5 &nbsp;3 &nbsp;5 &nbsp;7 &nbsp;9 &nbsp;3 &nbsp;5 &nbsp;7 &nbsp;9 11 13 15 17<br>
total real cost of 16 adds = 31 &lt;= 3 x 16 = 48</div>
<ul>
<li>Most adds cost 1; apart from the very first one, the adds that find the array full cost 2, 3, 5 and 9 (copy everything, then write).</li>
<li>"saved" = what has been charged (3 per add) minus what has been spent: it never goes below zero — the cheap adds really do save up for the expensive ones.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> like putting a little money aside every month for a yearly insurance bill — no month is a shock, and the bill is always covered.</p>`,
        `<p class="y-chinh">🎯 Phân tích khấu hao (amortized analysis) nhìn cả một dãy thao tác: thao tác rẻ bị "thu" thêm một chút, phần dư để dành trả cho các thao tác đắt hiếm hoi, nhờ vậy chi phí trung bình mỗi thao tác trên cả dãy được bảo đảm.</p>
<ul>
<li><strong>Xấu nhất cho từng thao tác thường quá bi quan</strong>: nếu trăm thao tác mới có một thao tác đắt, tính thao tác nào cũng theo giá đắt sẽ ước lượng tổng chi phí cao quá mức.</li>
<li><strong>Trung bình thường khó tính</strong>: không rõ thế nào là "dữ liệu trung bình", dữ liệu ngẫu nhiên đều (uniformly random) thường không giống dữ liệu chương trình thật sự nhận, và lập luận xác suất có thể rất khó.</li>
<li><strong>Khấu hao</strong> không cần xác suất: nó chặn <em>tổng</em> chi phí của mọi dãy thao tác, rồi chia cho số thao tác.</li>
</ul>
<p class="nhan">Ví dụ của bài (cũng là ví dụ slide 40 phân tích) — thêm 16 phần tử vào một mảng tự nhân đôi khi đầy, mỗi lần thêm "thu" 3 đơn vị</p>
<pre><code class="language-java">import java.util.Locale;

public class CostSequence {
    public static void main(String[] args) {
        int count = 0, N = 0;                           // số phần tử đang có, số ô đang có
        long total = 0, saved = 0;
        StringBuilder num = new StringBuilder(), cost = new StringBuilder(), bank = new StringBuilder();
        for (int i = 1; i &lt;= 16; i++) {
            int c;
            if (count == N) {                           // đầy: nhân đôi, chép count phần tử, ghi 1
                N = (N == 0) ? 1 : 2 * N;
                c = count + 1;
            } else {
                c = 1;                                  // còn chỗ: chỉ việc ghi
            }
            count++;
            total += c;
            saved += 3 - c;                             // thu 3 mỗi lần thêm, phần chưa tiêu để dành
            num.append(String.format(Locale.ROOT, "%3d", i));
            cost.append(String.format(Locale.ROOT, "%3d", c));
            bank.append(String.format(Locale.ROOT, "%3d", saved));
        }
        System.out.println("add #  " + num);
        System.out.println("cost   " + cost);
        System.out.println("saved  " + bank);
        System.out.println("total real cost of 16 adds = " + total + " &lt;= 3 x 16 = 48");
    }
}</code></pre>
<div class="out">add # &nbsp;&nbsp;&nbsp;1 &nbsp;2 &nbsp;3 &nbsp;4 &nbsp;5 &nbsp;6 &nbsp;7 &nbsp;8 &nbsp;9 10 11 12 13 14 15 16<br>
cost &nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;2 &nbsp;3 &nbsp;1 &nbsp;5 &nbsp;1 &nbsp;1 &nbsp;1 &nbsp;9 &nbsp;1 &nbsp;1 &nbsp;1 &nbsp;1 &nbsp;1 &nbsp;1 &nbsp;1<br>
saved &nbsp;&nbsp;&nbsp;2 &nbsp;3 &nbsp;3 &nbsp;5 &nbsp;3 &nbsp;5 &nbsp;7 &nbsp;9 &nbsp;3 &nbsp;5 &nbsp;7 &nbsp;9 11 13 15 17<br>
total real cost of 16 adds = 31 &lt;= 3 x 16 = 48</div>
<ul>
<li>Phần lớn các lần thêm tốn 1; trừ lần đầu tiên, những lần thêm gặp mảng đầy tốn 2, 3, 5 và 9 (chép hết sang mảng mới rồi mới ghi).</li>
<li>"saved" (để dành) = số đã thu (3 mỗi lần) trừ số đã tiêu: nó không bao giờ xuống dưới 0 — các lần thêm rẻ đúng là đang để dành cho các lần thêm đắt.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> như mỗi tháng để riêng một ít tiền cho hoá đơn bảo hiểm cuối năm — không tháng nào bị "sốc", và hoá đơn lúc nào cũng đủ tiền trả.</p>`],
      [39, 'Amortized Complexity - three ways to add up costs',
        `<p class="y-chinh">🎯 The cost of a sequence of operations can be estimated three ways: charge each operation its worst case, charge each its average case, or — amortized — add up what each operation really costs in that sequence.</p>
<table>
<thead><tr><th>Method</th><th>Cost of op1, op2, op3, …</th><th>Weakness or strength</th></tr></thead>
<tbody>
<tr><td>Worst case</td><td>Cworst(op1) + Cworst(op2) + …</td><td>safe but pessimistic: assumes every operation is the expensive kind</td></tr>
<tr><td>Average case</td><td>Cavg(op1) + Cavg(op2) + …</td><td>needs a probability model of the inputs</td></tr>
<tr><td>Amortized</td><td>C(op1) + C(op2) + …</td><td>follows the real sequence: each C is whatever that operation costs there — worst, average or best</td></tr>
</tbody>
</table>
<ul>
<li>Amortized analysis works because the operations of a real sequence are not independent: an expensive add (a doubling) leaves a lot of free room, so the next adds must be cheap.</li>
<li>The worst case of the i-th add into a growing array is i (copy i − 1 elements, write 1); summing worst cases gives m(m + 1)/2 for m adds — quadratic.</li>
<li>The real total for a doubling array is less than 3m — linear. Same operations, very different verdicts:</li>
</ul>
<pre><code class="language-java">import java.util.Locale;

public class SumOfCosts {
    // Real total cost of m adds into a doubling array that starts empty
    static long realDoubling(long m) {
        long count = 0, N = 0, total = 0;
        for (long i = 1; i &lt;= m; i++) {
            if (count == N) { total += count; N = (N == 0) ? 1 : 2 * N; }   // copy on overflow
            total += 1;                                                    // write the new element
            count++;
        }
        return total;
    }

    public static void main(String[] args) {
        System.out.println("        m   sum of worst cases m(m+1)/2   real total (doubling)   real / m");
        for (long m : new long[] {16, 1024, 1000000}) {
            long worstSum = m * (m + 1) / 2;            // the i-th add costs at most i
            long real = realDoubling(m);
            System.out.println(String.format(Locale.ROOT, "%9d %29d %23d %10.2f", m, worstSum, real, (double) real / m));
        }
    }
}</code></pre>
<div class="out">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;m &nbsp;&nbsp;sum of worst cases m(m+1)/2 &nbsp;&nbsp;real total (doubling) &nbsp;&nbsp;real / m<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;16 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;136 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;31 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1.94<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1024 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;524800 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2047 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.00<br>
&nbsp;&nbsp;1000000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;500000500000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2048575 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.05</div>
<p>For a million adds, summing worst cases predicts 500 billion steps; the real total is about 2 million — 2.05 per add. The amortized cost of one add is that total divided by m: <strong>O(1)</strong>.</p>
<div class="pitfall">Amortized O(1) is not "every operation is O(1)": one add can still cost O(n) (the doubling). It is not an average over random inputs either — it holds for every sequence.</div>`,
        `<p class="y-chinh">🎯 Chi phí của một dãy thao tác có ba cách ước lượng: tính mỗi thao tác theo trường hợp xấu nhất của nó, theo trường hợp trung bình của nó, hoặc — khấu hao — cộng đúng chi phí thật của từng thao tác trong dãy đó.</p>
<table>
<thead><tr><th>Cách tính</th><th>Chi phí của op1, op2, op3, …</th><th>Điểm yếu hoặc điểm mạnh</th></tr></thead>
<tbody>
<tr><td>Xấu nhất (worst case)</td><td>Cworst(op1) + Cworst(op2) + …</td><td>an toàn nhưng bi quan: coi thao tác nào cũng thuộc loại đắt</td></tr>
<tr><td>Trung bình (average case)</td><td>Cavg(op1) + Cavg(op2) + …</td><td>cần một mô hình xác suất của đầu vào</td></tr>
<tr><td>Khấu hao (amortized)</td><td>C(op1) + C(op2) + …</td><td>bám theo dãy thật: mỗi C là chi phí thật của thao tác đó tại chỗ đó — có thể là xấu nhất, trung bình hay tốt nhất</td></tr>
</tbody>
</table>
<ul>
<li>Khấu hao làm được vì các thao tác trong một dãy thật không độc lập với nhau: một lần thêm đắt (nhân đôi) để lại rất nhiều chỗ trống, nên các lần thêm kế tiếp buộc phải rẻ.</li>
<li>Trường hợp xấu nhất của lần thêm thứ i vào mảng đang lớn dần là i (chép i − 1 phần tử, ghi 1); cộng các trường hợp xấu nhất được m(m + 1)/2 cho m lần thêm — bậc hai.</li>
<li>Tổng thật với mảng nhân đôi nhỏ hơn 3m — tuyến tính. Cùng các thao tác mà hai kết luận khác hẳn nhau:</li>
</ul>
<pre><code class="language-java">import java.util.Locale;

public class SumOfCosts {
    // Tổng chi phí thật của m lần thêm vào mảng nhân đôi bắt đầu rỗng
    static long realDoubling(long m) {
        long count = 0, N = 0, total = 0;
        for (long i = 1; i &lt;= m; i++) {
            if (count == N) { total += count; N = (N == 0) ? 1 : 2 * N; }   // tràn thì chép
            total += 1;                                                    // ghi phần tử mới
            count++;
        }
        return total;
    }

    public static void main(String[] args) {
        System.out.println("        m   sum of worst cases m(m+1)/2   real total (doubling)   real / m");
        for (long m : new long[] {16, 1024, 1000000}) {
            long worstSum = m * (m + 1) / 2;            // lần thêm thứ i tốn nhiều nhất i
            long real = realDoubling(m);
            System.out.println(String.format(Locale.ROOT, "%9d %29d %23d %10.2f", m, worstSum, real, (double) real / m));
        }
    }
}</code></pre>
<div class="out">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;m &nbsp;&nbsp;sum of worst cases m(m+1)/2 &nbsp;&nbsp;real total (doubling) &nbsp;&nbsp;real / m<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;16 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;136 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;31 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1.94<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1024 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;524800 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2047 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.00<br>
&nbsp;&nbsp;1000000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;500000500000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2048575 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.05</div>
<p>Với một triệu lần thêm, cộng các trường hợp xấu nhất dự đoán 500 tỉ bước; tổng thật chỉ khoảng 2 triệu — 2,05 bước mỗi lần thêm. Chi phí khấu hao của một lần thêm là tổng đó chia cho m: <strong>O(1)</strong>.</p>
<div class="pitfall">O(1) khấu hao không có nghĩa là "thao tác nào cũng O(1)": một lần thêm vẫn có thể tốn O(n) (lần nhân đôi). Nó cũng không phải trung bình trên đầu vào ngẫu nhiên — nó đúng với mọi dãy thao tác.</div>`],
      [40, 'Amortized Complexity - flexible array and potential',
        `<p class="y-chinh">🎯 Adding to a flexible array costs O(1) when there is room and O(count) when it overflows; growing by a fixed k makes overflows frequent, doubling makes them rare — and a potential function proves that the amortized cost of one add is the constant 3.</p>
<p class="nhan">1 · Grow by +k or double? Total elements copied while adding m elements, starting from an empty array</p>
<pre><code class="language-java">import java.util.Locale;

public class GrowthPolicy {
    // Total elements copied while adding m elements; grow by +k, or double when k == 0
    static long copies(long m, long k) {
        long count = 0, N = 0, copied = 0;
        for (long i = 1; i &lt;= m; i++) {
            if (count == N) {                           // overflow: new array, copy everything
                copied += count;
                N = (k &gt; 0) ? N + k : Math.max(1, 2 * N);
            }
            count++;
        }
        return copied;
    }

    public static void main(String[] args) {
        System.out.println("       m   policy        copies   copies per add");
        for (long m : new long[] {1000, 100000}) {
            for (long k : new long[] {1, 100, 0}) {
                long c = copies(m, k);
                String policy = (k &gt; 0) ? "N + " + k : "2N";
                System.out.println(String.format(Locale.ROOT, "%8d   %-7s %12d %16.2f", m, policy, c, (double) c / m));
            }
        }
    }
}</code></pre>
<div class="out">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;m &nbsp;&nbsp;policy &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;copies &nbsp;&nbsp;copies per add<br>
&nbsp;&nbsp;&nbsp;&nbsp;1000 &nbsp;&nbsp;N + 1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;499500 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;499.50<br>
&nbsp;&nbsp;&nbsp;&nbsp;1000 &nbsp;&nbsp;N + 100 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4500 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4.50<br>
&nbsp;&nbsp;&nbsp;&nbsp;1000 &nbsp;&nbsp;2N &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1023 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1.02<br>
&nbsp;&nbsp;100000 &nbsp;&nbsp;N + 1 &nbsp;&nbsp;&nbsp;&nbsp;4999950000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;49999.50<br>
&nbsp;&nbsp;100000 &nbsp;&nbsp;N + 100 &nbsp;&nbsp;&nbsp;&nbsp;49950000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;499.50<br>
&nbsp;&nbsp;100000 &nbsp;&nbsp;2N &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;131071 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1.31</div>
<ul>
<li><strong>k = 1</strong>: after the first overflow every add overflows and copies everything — m(m − 1)/2 copies, O(m²) in total, O(m) per add.</li>
<li><strong>Any fixed k</strong> only divides that by k (N + 100 still copies 499.5 elements per add at m = 100,000): still quadratic.</li>
<li><strong>Doubling</strong>: 1 + 2 + 4 + … &lt; 2m copies in total — about 1 per add, whatever m is.</li>
</ul>
<p class="nhan">2 · The potential method: amCost(op<sub>i</sub>) = Cost(op<sub>i</sub>) + Φ(ds<sub>i</sub>) − Φ(ds<sub>i−1</sub>), where an add with room costs 1 and an add to a full array costs count + 1 (copy, then write); capacity goes 0 → 1 → 2 → 4 → …</p>
<p>Φ ("potential") assigns a number to the state of the data structure — think of it as money kept inside the array. Summed over m operations the Φ terms cancel in a chain: total amCost = total real cost + Φ(ds<sub>m</sub>) − Φ(ds<sub>0</sub>); with Φ(ds<sub>0</sub>) = 0 and Φ ≥ 0, the amortized total is an upper bound on the real total.</p>
<pre><code class="language-java">import java.util.Locale;

public class Potential {
    // potential exactly as written on the slide
    static int phiSlide(int count, int N) { return count == N ? 0 : 2 * count - N; }
    // the textbook potential, without the special case
    static int phiBook(int count, int N) { return 2 * count - N; }

    public static void main(String[] args) {
        int count = 0, N = 0, sumCost = 0, sumSlide = 0, sumBook = 0;
        System.out.println("add  count/N  cost |  phi(slide)  amCost |  phi=2count-N  amCost");
        for (int i = 1; i &lt;= 9; i++) {
            int ps0 = phiSlide(count, N), pb0 = phiBook(count, N);
            int cost = 1;                               // write the new element
            if (count == N) {                           // full: copy count elements first
                cost += count;
                N = (N == 0) ? 1 : 2 * N;
            }
            count++;
            int amSlide = cost + phiSlide(count, N) - ps0;    // amCost = Cost + phi(after) - phi(before)
            int amBook = cost + phiBook(count, N) - pb0;
            sumCost += cost; sumSlide += amSlide; sumBook += amBook;
            System.out.println(String.format(Locale.ROOT, "%3d  %3d/%-3d %4d | %11d %7d | %13d %7d",
                    i, count, N, cost, phiSlide(count, N), amSlide, phiBook(count, N), amBook));
        }
        System.out.println("sums: cost = " + sumCost + ", amCost(slide phi) = " + sumSlide + ", amCost(2count-N) = " + sumBook);
    }
}</code></pre>
<div class="out">add &nbsp;count/N &nbsp;cost | &nbsp;phi(slide) &nbsp;amCost | &nbsp;phi=2count-N &nbsp;amCost<br>
&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;1/1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2<br>
&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;2/2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3<br>
&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;3/4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3<br>
&nbsp;&nbsp;4 &nbsp;&nbsp;&nbsp;4/4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-1 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3<br>
&nbsp;&nbsp;5 &nbsp;&nbsp;&nbsp;5/8 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3<br>
&nbsp;&nbsp;6 &nbsp;&nbsp;&nbsp;6/8 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3<br>
&nbsp;&nbsp;7 &nbsp;&nbsp;&nbsp;7/8 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3<br>
&nbsp;&nbsp;8 &nbsp;&nbsp;&nbsp;8/8 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-5 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3<br>
&nbsp;&nbsp;9 &nbsp;&nbsp;&nbsp;9/16 &nbsp;&nbsp;&nbsp;&nbsp;9 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;11 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3<br>
sums: cost = 24, amCost(slide phi) = 26, amCost(2count-N) = 26</div>
<ul>
<li>With the textbook potential Φ = 2·count − N, every add has amortized cost exactly 3 (only the first one 2, because we start from an empty array) — the slide's result amCost = 3. So m adds cost at most 3m: O(1) per add.</li>
<li>The slide writes Φ with a special case: 0 when count = N. Taken literally, it shifts potential between the add that fills the array and the next add, which overflows — add 4 (fills N = 4: 3 − 4 = −1) and add 5 (overflows: 4 + 3 = 7). From N = 4 on, each such pair still sums to 6 = 3 + 3 (adds 1–3, where fills and overflows overlap, balance as a group: 1 + 2 + 5 = 2 + 3 + 3 = 8), and the totals agree (26 = 26), so the conclusion stands; but only the version without the special case gives exactly 3 for every single add.</li>
</ul>
<div class="pitfall">"Growing the array by 10 (or 100) cells each time is enough" — false: with any constant increment an add still costs O(m) on average; only multiplying the capacity (×2, or ×1.5 as Java's <code>ArrayList</code> does) gives amortized O(1).</div>`,
        `<p class="y-chinh">🎯 Thêm phần tử vào mảng linh hoạt (flexible array) tốn O(1) khi còn chỗ và O(count) khi tràn (overflow); nới thêm một hằng k làm tràn liên tục, nhân đôi làm tràn hiếm hoi — và một hàm thế (potential function) chứng minh chi phí khấu hao mỗi lần thêm là hằng số 3.</p>
<p class="nhan">1 · Nới thêm +k hay nhân đôi? Tổng số phần tử phải chép khi thêm m phần tử, bắt đầu từ mảng rỗng</p>
<pre><code class="language-java">import java.util.Locale;

public class GrowthPolicy {
    // Tổng số phần tử phải chép khi thêm m phần tử; nới thêm +k, hoặc nhân đôi khi k == 0
    static long copies(long m, long k) {
        long count = 0, N = 0, copied = 0;
        for (long i = 1; i &lt;= m; i++) {
            if (count == N) {                           // tràn: cấp mảng mới, chép hết sang
                copied += count;
                N = (k &gt; 0) ? N + k : Math.max(1, 2 * N);
            }
            count++;
        }
        return copied;
    }

    public static void main(String[] args) {
        System.out.println("       m   policy        copies   copies per add");
        for (long m : new long[] {1000, 100000}) {
            for (long k : new long[] {1, 100, 0}) {
                long c = copies(m, k);
                String policy = (k &gt; 0) ? "N + " + k : "2N";
                System.out.println(String.format(Locale.ROOT, "%8d   %-7s %12d %16.2f", m, policy, c, (double) c / m));
            }
        }
    }
}</code></pre>
<div class="out">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;m &nbsp;&nbsp;policy &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;copies &nbsp;&nbsp;copies per add<br>
&nbsp;&nbsp;&nbsp;&nbsp;1000 &nbsp;&nbsp;N + 1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;499500 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;499.50<br>
&nbsp;&nbsp;&nbsp;&nbsp;1000 &nbsp;&nbsp;N + 100 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4500 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4.50<br>
&nbsp;&nbsp;&nbsp;&nbsp;1000 &nbsp;&nbsp;2N &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1023 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1.02<br>
&nbsp;&nbsp;100000 &nbsp;&nbsp;N + 1 &nbsp;&nbsp;&nbsp;&nbsp;4999950000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;49999.50<br>
&nbsp;&nbsp;100000 &nbsp;&nbsp;N + 100 &nbsp;&nbsp;&nbsp;&nbsp;49950000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;499.50<br>
&nbsp;&nbsp;100000 &nbsp;&nbsp;2N &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;131071 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1.31</div>
<ul>
<li><strong>k = 1</strong>: sau lần tràn đầu tiên, lần thêm nào cũng tràn và chép lại toàn bộ — m(m − 1)/2 lần chép, tổng O(m²), mỗi lần thêm O(m).</li>
<li><strong>k cố định bất kỳ</strong> chỉ chia con số đó cho k (N + 100 vẫn chép 499,5 phần tử cho mỗi lần thêm khi m = 100.000): vẫn là bậc hai.</li>
<li><strong>Nhân đôi</strong>: tổng cộng 1 + 2 + 4 + … &lt; 2m lần chép — khoảng 1 lần chép cho mỗi lần thêm, m bao nhiêu cũng vậy.</li>
</ul>
<p class="nhan">2 · Phương pháp hàm thế: amCost(op<sub>i</sub>) = Cost(op<sub>i</sub>) + Φ(ds<sub>i</sub>) − Φ(ds<sub>i−1</sub>), trong đó thêm khi còn chỗ tốn 1, thêm vào mảng đầy tốn count + 1 (chép rồi ghi); sức chứa đi 0 → 1 → 2 → 4 → …</p>
<p>Φ (thế — potential) gán một con số cho trạng thái của cấu trúc dữ liệu (ds) — hãy nghĩ nó là tiền để dành cất trong mảng. Cộng qua m thao tác, các số hạng Φ triệt tiêu nhau theo dây chuyền: tổng amCost = tổng chi phí thật + Φ(ds<sub>m</sub>) − Φ(ds<sub>0</sub>); nếu Φ(ds<sub>0</sub>) = 0 và Φ luôn ≥ 0 thì tổng khấu hao là cận trên của tổng thật.</p>
<pre><code class="language-java">import java.util.Locale;

public class Potential {
    // hàm thế viết đúng như trên slide
    static int phiSlide(int count, int N) { return count == N ? 0 : 2 * count - N; }
    // hàm thế trong sách giáo khoa, không có trường hợp đặc biệt
    static int phiBook(int count, int N) { return 2 * count - N; }

    public static void main(String[] args) {
        int count = 0, N = 0, sumCost = 0, sumSlide = 0, sumBook = 0;
        System.out.println("add  count/N  cost |  phi(slide)  amCost |  phi=2count-N  amCost");
        for (int i = 1; i &lt;= 9; i++) {
            int ps0 = phiSlide(count, N), pb0 = phiBook(count, N);
            int cost = 1;                               // ghi phần tử mới
            if (count == N) {                           // đầy: chép count phần tử trước
                cost += count;
                N = (N == 0) ? 1 : 2 * N;
            }
            count++;
            int amSlide = cost + phiSlide(count, N) - ps0;    // amCost = Cost + phi(after) - phi(before)
            int amBook = cost + phiBook(count, N) - pb0;
            sumCost += cost; sumSlide += amSlide; sumBook += amBook;
            System.out.println(String.format(Locale.ROOT, "%3d  %3d/%-3d %4d | %11d %7d | %13d %7d",
                    i, count, N, cost, phiSlide(count, N), amSlide, phiBook(count, N), amBook));
        }
        System.out.println("sums: cost = " + sumCost + ", amCost(slide phi) = " + sumSlide + ", amCost(2count-N) = " + sumBook);
    }
}</code></pre>
<div class="out">add &nbsp;count/N &nbsp;cost | &nbsp;phi(slide) &nbsp;amCost | &nbsp;phi=2count-N &nbsp;amCost<br>
&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;1/1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2<br>
&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;2/2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3<br>
&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;3/4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3<br>
&nbsp;&nbsp;4 &nbsp;&nbsp;&nbsp;4/4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-1 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3<br>
&nbsp;&nbsp;5 &nbsp;&nbsp;&nbsp;5/8 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3<br>
&nbsp;&nbsp;6 &nbsp;&nbsp;&nbsp;6/8 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3<br>
&nbsp;&nbsp;7 &nbsp;&nbsp;&nbsp;7/8 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3<br>
&nbsp;&nbsp;8 &nbsp;&nbsp;&nbsp;8/8 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-5 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3<br>
&nbsp;&nbsp;9 &nbsp;&nbsp;&nbsp;9/16 &nbsp;&nbsp;&nbsp;&nbsp;9 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;11 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3<br>
sums: cost = 24, amCost(slide phi) = 26, amCost(2count-N) = 26</div>
<ul>
<li>Với hàm thế của sách giáo khoa Φ = 2·count − N, lần thêm nào cũng có chi phí khấu hao đúng bằng 3 (riêng lần đầu là 2, vì bắt đầu từ mảng rỗng) — đúng kết quả amCost = 3 của slide. Vậy m lần thêm tốn nhiều nhất 3m: O(1) mỗi lần.</li>
<li>Slide viết Φ có một trường hợp đặc biệt: bằng 0 khi count = N. Tính đúng từng chữ như vậy thì thế bị dời giữa lần thêm làm đầy mảng và lần thêm kế tiếp gây tràn — lần 4 (làm đầy N = 4: 3 − 4 = −1) và lần 5 (tràn: 4 + 3 = 7). Từ N = 4 trở đi, mỗi cặp như vậy vẫn cộng lại bằng 6 = 3 + 3 (ba lần thêm đầu, nơi làm đầy và tràn chồng lên nhau, cân bằng theo cả nhóm: 1 + 2 + 5 = 2 + 3 + 3 = 8), và hai tổng khớp nhau (26 = 26), nên kết luận vẫn đứng vững; nhưng chỉ bản không có trường hợp đặc biệt mới cho đúng 3 ở từng lần thêm.</li>
</ul>
<div class="pitfall">"Mỗi lần đầy nới thêm 10 (hay 100) ô là đủ" — SAI: nới thêm một hằng số thì trung bình mỗi lần thêm vẫn tốn O(m); chỉ khi nhân sức chứa lên (×2, hoặc ×1,5 như <code>ArrayList</code> của Java) mới được O(1) khấu hao.</div>`],
      [41, 'NP - Completeness',
        `<p class="y-chinh">🎯 The last part of the deck moves from single algorithms to whole problems: some problems have polynomial-time algorithms, and for a large family of important problems nobody knows one — the NP-complete problems.</p>
<p class="ghi-chu">This slide is mainly a picture; only its title could be extracted. It opens the NP-completeness part (slides 42–46); the explanation below gives the motivation with the lesson's own numbers.</p>
<ul>
<li>So far every algorithm had a polynomial cost: n, n log n, n², n³…</li>
<li>For some problems the only known algorithms try (almost) all candidates — 2ⁿ subsets, n! orderings — which is exponential.</li>
<li>Assume a computer doing 10⁹ simple steps per second (an assumed speed, for illustration):</li>
</ul>
<pre><code class="language-java">import java.util.Locale;

public class PolyVsExp {
    static String human(double s) {                     // seconds -&gt; a readable unit
        if (s &lt; 1e-3) return String.format(Locale.ROOT, "%.0f us", s * 1e6);
        if (s &lt; 1) return String.format(Locale.ROOT, "%.0f ms", s * 1e3);
        if (s &lt; 60) return String.format(Locale.ROOT, "%.1f s", s);
        if (s &lt; 3600) return String.format(Locale.ROOT, "%.1f min", s / 60);
        if (s &lt; 86400) return String.format(Locale.ROOT, "%.1f hours", s / 3600);
        if (s &lt; 365 * 86400.0) return String.format(Locale.ROOT, "%.1f days", s / 86400);
        return String.format(Locale.ROOT, "%.1f years", s / (365 * 86400.0));
    }

    public static void main(String[] args) {
        double speed = 1e9;                             // assumed: 10^9 simple steps per second
        System.out.println(" n   n^3 steps   time               2^n steps   time");
        for (int n = 10; n &lt;= 60; n += 10) {
            long poly = (long) n * n * n, expo = 1L &lt;&lt; n;   // exact step counts
            System.out.println(String.format(Locale.ROOT, "%2d %11d   %-7s %20d   %s", n, poly, human(poly / speed), expo, human(expo / speed)));
        }
    }
}</code></pre>
<div class="out">&nbsp;n &nbsp;&nbsp;n^3 steps &nbsp;&nbsp;time &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2^n steps &nbsp;&nbsp;time<br>
10 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1000 &nbsp;&nbsp;1 us &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1024 &nbsp;&nbsp;1 us<br>
20 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8000 &nbsp;&nbsp;8 us &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1048576 &nbsp;&nbsp;1 ms<br>
30 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;27000 &nbsp;&nbsp;27 us &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1073741824 &nbsp;&nbsp;1.1 s<br>
40 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;64000 &nbsp;&nbsp;64 us &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1099511627776 &nbsp;&nbsp;18.3 min<br>
50 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;125000 &nbsp;&nbsp;125 us &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1125899906842624 &nbsp;&nbsp;13.0 days<br>
60 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;216000 &nbsp;&nbsp;216 us &nbsp;&nbsp;1152921504606846976 &nbsp;&nbsp;36.6 years</div>
<ul>
<li>n³ stays below a millisecond all the way to n = 60; 2ⁿ goes from a microsecond at n = 10 to 36.6 years at n = 60.</li>
<li>That is why "polynomial" is the line between tractable (practically solvable) and intractable problems — the subject of slides 42–46.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> adding 10 to n multiplies 2ⁿ by 1,024 — exponential growth swallows every speed-up.</p>`,
        `<p class="y-chinh">🎯 Phần cuối của bộ slide chuyển từ từng thuật toán sang cả bài toán: có những bài toán có thuật toán thời gian đa thức, và có cả một họ lớn bài toán quan trọng mà chưa ai biết thuật toán như vậy — các bài toán NP-đầy đủ (NP-complete).</p>
<p class="ghi-chu">Slide này chủ yếu là hình; chữ trích được chỉ có tiêu đề. Nó mở đầu phần NP-đầy đủ (slide 42–46); phần giảng dưới đây nêu động cơ bằng số liệu của bài.</p>
<ul>
<li>Tới giờ mọi thuật toán đều có chi phí đa thức (polynomial): n, n log n, n², n³…</li>
<li>Với một số bài toán, các thuật toán đã biết đều phải thử (gần như) mọi ứng viên — 2ⁿ tập con, n! cách sắp thứ tự — tức là hàm mũ (exponential).</li>
<li>Giả sử máy tính làm 10⁹ bước đơn giản mỗi giây (tốc độ giả định, để minh hoạ):</li>
</ul>
<pre><code class="language-java">import java.util.Locale;

public class PolyVsExp {
    static String human(double s) {                     // giây -&gt; đơn vị dễ đọc
        if (s &lt; 1e-3) return String.format(Locale.ROOT, "%.0f us", s * 1e6);
        if (s &lt; 1) return String.format(Locale.ROOT, "%.0f ms", s * 1e3);
        if (s &lt; 60) return String.format(Locale.ROOT, "%.1f s", s);
        if (s &lt; 3600) return String.format(Locale.ROOT, "%.1f min", s / 60);
        if (s &lt; 86400) return String.format(Locale.ROOT, "%.1f hours", s / 3600);
        if (s &lt; 365 * 86400.0) return String.format(Locale.ROOT, "%.1f days", s / 86400);
        return String.format(Locale.ROOT, "%.1f years", s / (365 * 86400.0));
    }

    public static void main(String[] args) {
        double speed = 1e9;                             // giả sử: 10^9 bước đơn giản mỗi giây
        System.out.println(" n   n^3 steps   time               2^n steps   time");
        for (int n = 10; n &lt;= 60; n += 10) {
            long poly = (long) n * n * n, expo = 1L &lt;&lt; n;   // số bước chính xác
            System.out.println(String.format(Locale.ROOT, "%2d %11d   %-7s %20d   %s", n, poly, human(poly / speed), expo, human(expo / speed)));
        }
    }
}</code></pre>
<div class="out">&nbsp;n &nbsp;&nbsp;n^3 steps &nbsp;&nbsp;time &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2^n steps &nbsp;&nbsp;time<br>
10 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1000 &nbsp;&nbsp;1 us &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1024 &nbsp;&nbsp;1 us<br>
20 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8000 &nbsp;&nbsp;8 us &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1048576 &nbsp;&nbsp;1 ms<br>
30 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;27000 &nbsp;&nbsp;27 us &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1073741824 &nbsp;&nbsp;1.1 s<br>
40 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;64000 &nbsp;&nbsp;64 us &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1099511627776 &nbsp;&nbsp;18.3 min<br>
50 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;125000 &nbsp;&nbsp;125 us &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1125899906842624 &nbsp;&nbsp;13.0 days<br>
60 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;216000 &nbsp;&nbsp;216 us &nbsp;&nbsp;1152921504606846976 &nbsp;&nbsp;36.6 years</div>
<ul>
<li>n³ vẫn dưới một mili-giây cho tới tận n = 60; 2ⁿ đi từ một micro-giây ở n = 10 tới 36,6 năm ở n = 60.</li>
<li>Vì thế "đa thức" là ranh giới giữa bài toán giải được trong thực tế (tractable) và bài toán bất khả thi (intractable) — chủ đề của slide 42–46.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> cộng thêm 10 vào n là nhân 2ⁿ lên 1.024 lần — tăng trưởng hàm mũ nuốt chửng mọi lần tăng tốc.</p>`],
      [42, 'What is NP problem?',
        `<p class="y-chinh">🎯 P is the class of problems solvable in polynomial time; NP is the class of problems whose proposed solutions can be <em>checked</em> in polynomial time — and whether P = NP is still unsolved.</p>
<ul>
<li><strong>P</strong> (polynomial): solvable in O(n<sup>k</sup>) for some constant k — sorting, searching, shortest paths: the main material of this course.</li>
<li><strong>NP</strong> (nondeterministic polynomial time): "nondeterministic" is a fancy way of saying <em>guessing</em>. A problem is in NP if a proposed solution (a certificate) can be tested quickly, however hard it is to find.</li>
<li>Every problem in P is also in NP (if you can solve it fast, you can check an answer fast), so P ⊆ NP. Whether P = NP — whether fast checking always implies fast solving — is the famous open question.</li>
</ul>
<p class="nhan">The lesson's example — subset sum: can some of these 20 numbers add up to exactly 100?</p>
<pre><code class="language-java">public class CheckVsFind {
    static int[] w = {34, 4, 12, 5, 2, 17, 23, 9, 41, 8, 15, 27, 3, 19, 11, 6, 30, 14, 21, 7};   // n = 20 numbers
    static int target = 100;

    // CHECK a proposed answer: add the chosen numbers, O(n)
    static boolean check(int[] chosen) {
        int sum = 0;
        for (int i : chosen) sum += w[i];
        return sum == target;
    }

    public static void main(String[] args) {
        int[] certificate = {0, 8, 13, 15};            // indices of 34, 41, 19, 6
        System.out.println("check {34, 41, 19, 6}: " + (check(certificate) ? "valid" : "invalid") + " after " + certificate.length + " additions");

        // FIND an answer by brute force: try all 2^n subsets
        int n = w.length, tried = 0, found = 0;
        for (int mask = 0; mask &lt; (1 &lt;&lt; n); mask++) {
            tried++;
            int sum = 0;
            for (int i = 0; i &lt; n; i++) if ((mask &amp; (1 &lt;&lt; i)) != 0) sum += w[i];
            if (sum == target) found++;
        }
        System.out.println("search: tried " + tried + " subsets (2^" + n + "), " + found + " of them add up to " + target);
        for (int m : new int[] {20, 40, 60})
            System.out.println("n = " + m + " numbers -&gt; " + (1L &lt;&lt; m) + " subsets to try");
    }
}</code></pre>
<div class="out">check {34, 41, 19, 6}: valid after 4 additions<br>
search: tried 1048576 subsets (2^20), 4582 of them add up to 100<br>
n = 20 numbers -&gt; 1048576 subsets to try<br>
n = 40 numbers -&gt; 1099511627776 subsets to try<br>
n = 60 numbers -&gt; 1152921504606846976 subsets to try</div>
<ul>
<li><strong>Check</strong>: given the certificate {34, 41, 19, 6}, four additions confirm it — O(n).</li>
<li><strong>Find</strong>: with no clever idea, try the subsets — 2²⁰ ≈ 1 million here, 2⁶⁰ ≈ 10¹⁸ for 60 numbers. No polynomial-time algorithm for subset sum is known (it is NP-complete, the notion of slide 45).</li>
</ul>
<p class="dap-an">✅ <strong>Answer — what is an NP problem?</strong> A yes/no problem whose "yes" answers have certificates that can be verified in polynomial time. <strong>P = NP?</strong> Nobody knows; most researchers believe P ≠ NP, and a proof either way would solve one of the Clay Mathematics Institute's Millennium Prize Problems (US$1 million).</p>
<div class="pitfall">NP does <strong>not</strong> mean "non-polynomial". It means "nondeterministic polynomial": checkable in polynomial time. Every easy problem (in P) is in NP too.</div>`,
        `<p class="y-chinh">🎯 P là lớp bài toán giải được trong thời gian đa thức; NP là lớp bài toán mà một lời giải được đưa ra có thể <em>kiểm tra</em> trong thời gian đa thức — và câu hỏi P = NP đến nay vẫn chưa ai giải được.</p>
<ul>
<li><strong>P</strong> (polynomial — đa thức): giải được trong O(n<sup>k</sup>) với một hằng số k nào đó — sắp xếp, tìm kiếm, đường đi ngắn nhất: phần chính của môn học này.</li>
<li><strong>NP</strong> (nondeterministic polynomial time — thời gian đa thức không đơn định): "không đơn định" chỉ là cách nói hoa mỹ của <em>đoán</em>. Một bài toán thuộc NP nếu một lời giải được đưa ra (chứng cứ — certificate) kiểm tra được nhanh, bất kể tìm ra nó khó thế nào.</li>
<li>Mọi bài toán thuộc P cũng thuộc NP (giải nhanh được thì kiểm tra nhanh được), nên P ⊆ NP. Còn P có bằng NP không — kiểm tra nhanh có luôn kéo theo giải nhanh không — là câu hỏi mở nổi tiếng.</li>
</ul>
<p class="nhan">Ví dụ của bài — tổng tập con (subset sum): có chọn được vài số trong 20 số này để tổng đúng bằng 100 không?</p>
<pre><code class="language-java">public class CheckVsFind {
    static int[] w = {34, 4, 12, 5, 2, 17, 23, 9, 41, 8, 15, 27, 3, 19, 11, 6, 30, 14, 21, 7};   // n = 20 số
    static int target = 100;

    // KIỂM một lời giải được đưa ra: cộng các số đã chọn, O(n)
    static boolean check(int[] chosen) {
        int sum = 0;
        for (int i : chosen) sum += w[i];
        return sum == target;
    }

    public static void main(String[] args) {
        int[] certificate = {0, 8, 13, 15};            // chỉ số của 34, 41, 19, 6
        System.out.println("check {34, 41, 19, 6}: " + (check(certificate) ? "valid" : "invalid") + " after " + certificate.length + " additions");

        // TÌM lời giải bằng vét cạn: thử cả 2^n tập con
        int n = w.length, tried = 0, found = 0;
        for (int mask = 0; mask &lt; (1 &lt;&lt; n); mask++) {
            tried++;
            int sum = 0;
            for (int i = 0; i &lt; n; i++) if ((mask &amp; (1 &lt;&lt; i)) != 0) sum += w[i];
            if (sum == target) found++;
        }
        System.out.println("search: tried " + tried + " subsets (2^" + n + "), " + found + " of them add up to " + target);
        for (int m : new int[] {20, 40, 60})
            System.out.println("n = " + m + " numbers -&gt; " + (1L &lt;&lt; m) + " subsets to try");
    }
}</code></pre>
<div class="out">check {34, 41, 19, 6}: valid after 4 additions<br>
search: tried 1048576 subsets (2^20), 4582 of them add up to 100<br>
n = 20 numbers -&gt; 1048576 subsets to try<br>
n = 40 numbers -&gt; 1099511627776 subsets to try<br>
n = 60 numbers -&gt; 1152921504606846976 subsets to try</div>
<ul>
<li><strong>Kiểm tra</strong>: đưa sẵn chứng cứ {34, 41, 19, 6}, bốn phép cộng là xác nhận xong — O(n).</li>
<li><strong>Tìm</strong>: không có ý tưởng thông minh nào thì phải thử các tập con — ở đây 2²⁰ ≈ 1 triệu, với 60 số là 2⁶⁰ ≈ 10¹⁸. Chưa ai biết thuật toán thời gian đa thức cho bài tổng tập con (nó là bài NP-đầy đủ — NP-complete, khái niệm ở slide 45).</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án — bài toán NP là gì?</strong> Là bài toán dạng có/không mà mỗi câu trả lời "có" đều có chứng cứ kiểm tra được trong thời gian đa thức. <strong>P = NP?</strong> Chưa ai biết; phần lớn các nhà nghiên cứu tin rằng P ≠ NP, và chứng minh được chiều nào cũng là giải xong một trong các Bài toán Thiên niên kỷ (Millennium Prize Problems) của Viện Toán học Clay (giải thưởng 1 triệu USD).</p>
<div class="pitfall">NP <strong>không</strong> có nghĩa là "non-polynomial" (không đa thức). Nó là "nondeterministic polynomial": kiểm tra được trong thời gian đa thức. Mọi bài toán dễ (thuộc P) cũng thuộc NP.</div>`],
      [43, 'Reduction (1)',
        `<p class="y-chinh">🎯 A reduction A &lt; B ("A is easier than B") is an algorithm for A that calls a subroutine for B a small number of times and does only polynomial work outside those calls; then if B is in P, A is in P too.</p>
<ul>
<li><strong>"A small number of calls"</strong>: depending on the book, a polynomial number of calls, a constant number, or exactly one.</li>
<li><strong>Why speed transfers</strong>: replace each call by the fast algorithm for B — a polynomial number of calls × a polynomial cost + polynomial work outside = polynomial.</li>
<li><strong>"Easier" is loose</strong>: it means "if B can be solved in polynomial time, so can A". A's algorithm may even be slower than B's — for instance if it calls B n times.</li>
</ul>
<p class="nhan">The lesson's example — A = "does the array contain a duplicate?", B = sorting</p>
<pre><code class="language-java">import java.util.Arrays;

public class ReduceToSort {
    static int calls, outside;                          // calls to B, steps outside B

    // Problem B: sorting (we only call it, as a subroutine)
    static void sortB(int[] a) {
        calls++;
        Arrays.sort(a);
    }

    // Problem A: "does the array contain a duplicate?", solved with ONE call to B
    static boolean hasDuplicate(int[] a) {
        int[] b = a.clone();
        sortB(b);                                       // after sorting, equal values sit side by side
        for (int i = 0; i + 1 &lt; b.length; i++) {
            outside++;                                  // one comparison outside B
            if (b[i] == b[i + 1]) return true;
        }
        return false;
    }

    public static void main(String[] args) {
        int[][] tests = {{31, 7, 19, 4, 26, 12, 7, 40}, {31, 8, 19, 4, 26, 12, 7, 40}};
        for (int[] t : tests) {
            calls = 0; outside = 0;
            boolean d = hasDuplicate(t);
            System.out.println(Arrays.toString(t) + " -&gt; duplicate: " + d + "  (calls to sort: " + calls + ", comparisons outside: " + outside + ")");
        }
    }
}</code></pre>
<div class="out">[31, 7, 19, 4, 26, 12, 7, 40] -&gt; duplicate: true &nbsp;(calls to sort: 1, comparisons outside: 2)<br>
[31, 8, 19, 4, 26, 12, 7, 40] -&gt; duplicate: false &nbsp;(calls to sort: 1, comparisons outside: 7)</div>
<ul>
<li>One call to B (sort), then one pass comparing neighbours (at most n − 1 comparisons): so A &lt; B.</li>
<li>B is in P (sorting is O(n log n)), therefore A is in P: O(n log n) + O(n) = O(n log n) — better than comparing all n(n − 1)/2 pairs.</li>
</ul>
<div class="pitfall">Direction matters. "A &lt; B" carries <em>easiness</em> from B to A (B fast ⇒ A fast) and <em>hardness</em> from A to B (A hard ⇒ B hard). Reading the arrow backwards is the classic mistake with reductions.</div>`,
        `<p class="y-chinh">🎯 Phép rút gọn (reduction) A &lt; B ("A dễ hơn B") là một thuật toán giải A có gọi một chương trình con (subroutine) giải B một số ít lần, và ngoài các lần gọi đó chỉ làm việc trong thời gian đa thức; khi đó nếu B thuộc P thì A cũng thuộc P.</p>
<ul>
<li><strong>"Một số ít lần gọi"</strong>: tuỳ sách, là số lần gọi đa thức, một số hằng lần, hoặc đúng một lần.</li>
<li><strong>Vì sao tốc độ được "truyền" sang</strong>: thay mỗi lần gọi bằng thuật toán nhanh của B — số lần gọi đa thức × chi phí đa thức + phần việc đa thức bên ngoài = đa thức.</li>
<li><strong>"Dễ hơn" hiểu theo nghĩa lỏng</strong>: nghĩa là "nếu B giải được trong thời gian đa thức thì A cũng vậy". Thuật toán cho A thậm chí có thể chậm hơn thuật toán cho B — chẳng hạn khi nó gọi B tới n lần.</li>
</ul>
<p class="nhan">Ví dụ của bài — A = "mảng có phần tử trùng nhau không?", B = sắp xếp</p>
<pre><code class="language-java">import java.util.Arrays;

public class ReduceToSort {
    static int calls, outside;                          // số lần gọi B, số bước ngoài B

    // Bài toán B: sắp xếp (chỉ gọi nó như một chương trình con)
    static void sortB(int[] a) {
        calls++;
        Arrays.sort(a);
    }

    // Bài toán A: "mảng có phần tử trùng không?", giải bằng MỘT lần gọi B
    static boolean hasDuplicate(int[] a) {
        int[] b = a.clone();
        sortB(b);                                       // sau khi sắp, các giá trị bằng nhau đứng cạnh nhau
        for (int i = 0; i + 1 &lt; b.length; i++) {
            outside++;                                  // một phép so sánh bên ngoài B
            if (b[i] == b[i + 1]) return true;
        }
        return false;
    }

    public static void main(String[] args) {
        int[][] tests = {{31, 7, 19, 4, 26, 12, 7, 40}, {31, 8, 19, 4, 26, 12, 7, 40}};
        for (int[] t : tests) {
            calls = 0; outside = 0;
            boolean d = hasDuplicate(t);
            System.out.println(Arrays.toString(t) + " -&gt; duplicate: " + d + "  (calls to sort: " + calls + ", comparisons outside: " + outside + ")");
        }
    }
}</code></pre>
<div class="out">[31, 7, 19, 4, 26, 12, 7, 40] -&gt; duplicate: true &nbsp;(calls to sort: 1, comparisons outside: 2)<br>
[31, 8, 19, 4, 26, 12, 7, 40] -&gt; duplicate: false &nbsp;(calls to sort: 1, comparisons outside: 7)</div>
<ul>
<li>Gọi B (sắp xếp) một lần, rồi đi một lượt so sánh các phần tử đứng cạnh nhau (nhiều nhất n − 1 phép so sánh): vậy A &lt; B.</li>
<li>B thuộc P (sắp xếp tốn O(n log n)), nên A thuộc P: O(n log n) + O(n) = O(n log n) — tốt hơn so sánh mọi cặp, n(n − 1)/2 phép.</li>
</ul>
<div class="pitfall">Chiều của phép rút gọn rất quan trọng. "A &lt; B" truyền <em>sự dễ</em> từ B sang A (B nhanh ⇒ A nhanh) và truyền <em>sự khó</em> từ A sang B (A khó ⇒ B khó). Đọc ngược chiều mũi tên là lỗi kinh điển khi học rút gọn.</div>`],
      [44, 'Reduction (2)',
        `<p class="y-chinh">🎯 Example: the Hamiltonian cycle problem reduces to the longest path problem — for each edge (u, v), ask whether a simple path of length n − 1 goes from u to v; if one does, that path plus the edge is a Hamiltonian cycle.</p>
<pre><code class="language-plaintext">for each edge (u,v) of G
    if there is a simple path of length n-1 from u to v
        return yes            // path + edge form a cycle
return no</code></pre>
<ul>
<li><strong>Hamiltonian cycle</strong>: a cycle that visits every vertex exactly once. <strong>Longest path</strong>, as used here: is there a simple path (no repeated vertex) of a given length between two vertices?</li>
<li><strong>Why it is correct</strong>: a simple path with n − 1 edges visits all n vertices; closing it with the edge (v, u) gives a Hamiltonian cycle. Conversely, removing one edge (u, v) from a Hamiltonian cycle leaves exactly such a path from u to v.</li>
<li><strong>Cost outside the subroutine</strong>: at most m calls (one per edge) and O(m) other work — so Hamiltonian cycle &lt; longest path.</li>
</ul>
<pre><code class="language-java">public class HamiltonViaLongestPath {
    static int n, calls;
    static boolean[][] adj;
    static int[] path;

    // Subroutine for B: is there a SIMPLE path with exactly len edges from u to v? (brute force)
    static boolean simplePath(int u, int v, int len) {
        calls++;
        boolean[] used = new boolean[n];
        used[u] = true;
        path[0] = u;
        return extend(u, v, len, 1, used);
    }

    static boolean extend(int x, int v, int left, int depth, boolean[] used) {
        if (left == 0) return x == v;
        for (int y = 0; y &lt; n; y++)
            if (adj[x][y] &amp;&amp; !used[y]) {
                used[y] = true;
                path[depth] = y;
                if (extend(y, v, left - 1, depth + 1, used)) return true;
                used[y] = false;                        // backtrack
            }
        return false;
    }

    // Problem A (Hamiltonian cycle) using calls to B: the slide's algorithm
    static boolean hamiltonianCycle(int[][] edges) {
        for (int[] e : edges)                           // for each edge (u,v) of G
            if (simplePath(e[0], e[1], n - 1))          //   if there is a simple path of length n-1 from u to v
                return true;                            // return yes: path + edge form a cycle
        return false;                                   // return no
    }

    static void run(String name, int vertices, int[][] edges) {
        n = vertices; calls = 0; adj = new boolean[n][n]; path = new int[n];
        for (int[] e : edges) adj[e[0]][e[1]] = adj[e[1]][e[0]] = true;
        boolean yes = hamiltonianCycle(edges);
        String how = "";
        if (yes) {
            StringBuilder s = new StringBuilder(" path");
            for (int x : path) s.append(' ').append(x);
            how = s.append(" + edge (").append(path[n - 1]).append(',').append(path[0]).append(')').toString();
        }
        System.out.println(name + ", m = " + edges.length + ": " + (yes ? "yes" : "no") + " after " + calls + " call(s) to B." + how);
    }

    public static void main(String[] args) {
        run("G1 ring 0-1-2-3-4-0 plus chord 0-2", 5, new int[][] {{0, 1}, {1, 2}, {2, 3}, {3, 4}, {4, 0}, {0, 2}});
        run("G2 two triangles sharing vertex 2", 5, new int[][] {{0, 1}, {1, 2}, {2, 0}, {2, 3}, {3, 4}, {4, 2}});
    }
}</code></pre>
<div class="out">G1 ring 0-1-2-3-4-0 plus chord 0-2, m = 6: yes after 1 call(s) to B. path 0 4 3 2 1 + edge (1,0)<br>
G2 two triangles sharing vertex 2, m = 6: no after 6 call(s) to B.</div>
<ul>
<li>G1: the first edge (0, 1) already succeeds — the path 0 4 3 2 1 plus the edge (1, 0) is the cycle.</li>
<li>G2: vertex 2 joins two triangles, so no cycle can visit every vertex; all m = 6 calls answer "no".</li>
<li>Our subroutine is brute force (exponential). That is the slide's last remark: the reduction does <strong>not</strong> put Hamiltonian cycle in P, because nobody knows a fast longest-path algorithm.</li>
</ul>`,
        `<p class="y-chinh">🎯 Ví dụ: bài toán chu trình Hamilton rút gọn về bài toán đường đi dài nhất — với mỗi cạnh (u, v), hỏi xem có đường đi đơn độ dài n − 1 từ u tới v không; nếu có, đường đi đó cộng với cạnh (u, v) là một chu trình Hamilton.</p>
<pre><code class="language-plaintext">for each edge (u,v) of G
    if there is a simple path of length n-1 from u to v
        return yes            // đường đi + cạnh tạo thành chu trình
return no</code></pre>
<ul>
<li><strong>Chu trình Hamilton (Hamiltonian cycle)</strong>: chu trình đi qua mỗi đỉnh đúng một lần. <strong>Đường đi dài nhất (longest path)</strong>, theo nghĩa dùng ở đây: có đường đi đơn (simple path — không lặp đỉnh) với độ dài cho trước giữa hai đỉnh không?</li>
<li><strong>Vì sao đúng</strong>: đường đi đơn có n − 1 cạnh thì đi qua đủ n đỉnh; nối thêm cạnh (v, u) là thành chu trình Hamilton. Ngược lại, bỏ một cạnh (u, v) khỏi một chu trình Hamilton thì còn lại đúng một đường đi như vậy từ u tới v.</li>
<li><strong>Chi phí bên ngoài chương trình con</strong>: nhiều nhất m lần gọi (mỗi cạnh một lần) và O(m) việc khác — vậy chu trình Hamilton &lt; đường đi dài nhất.</li>
</ul>
<pre><code class="language-java">public class HamiltonViaLongestPath {
    static int n, calls;
    static boolean[][] adj;
    static int[] path;

    // Chương trình con cho B: có đường đi ĐƠN đúng len cạnh từ u tới v không? (vét cạn)
    static boolean simplePath(int u, int v, int len) {
        calls++;
        boolean[] used = new boolean[n];
        used[u] = true;
        path[0] = u;
        return extend(u, v, len, 1, used);
    }

    static boolean extend(int x, int v, int left, int depth, boolean[] used) {
        if (left == 0) return x == v;
        for (int y = 0; y &lt; n; y++)
            if (adj[x][y] &amp;&amp; !used[y]) {
                used[y] = true;
                path[depth] = y;
                if (extend(y, v, left - 1, depth + 1, used)) return true;
                used[y] = false;                        // quay lui
            }
        return false;
    }

    // Bài toán A (chu trình Hamilton) dùng các lời gọi B: thuật toán của slide
    static boolean hamiltonianCycle(int[][] edges) {
        for (int[] e : edges)                           // for each edge (u,v) of G
            if (simplePath(e[0], e[1], n - 1))          //   if there is a simple path of length n-1 from u to v
                return true;                            // trả lời có: đường đi + cạnh tạo thành chu trình
        return false;                                   // return no
    }

    static void run(String name, int vertices, int[][] edges) {
        n = vertices; calls = 0; adj = new boolean[n][n]; path = new int[n];
        for (int[] e : edges) adj[e[0]][e[1]] = adj[e[1]][e[0]] = true;
        boolean yes = hamiltonianCycle(edges);
        String how = "";
        if (yes) {
            StringBuilder s = new StringBuilder(" path");
            for (int x : path) s.append(' ').append(x);
            how = s.append(" + edge (").append(path[n - 1]).append(',').append(path[0]).append(')').toString();
        }
        System.out.println(name + ", m = " + edges.length + ": " + (yes ? "yes" : "no") + " after " + calls + " call(s) to B." + how);
    }

    public static void main(String[] args) {
        run("G1 ring 0-1-2-3-4-0 plus chord 0-2", 5, new int[][] {{0, 1}, {1, 2}, {2, 3}, {3, 4}, {4, 0}, {0, 2}});
        run("G2 two triangles sharing vertex 2", 5, new int[][] {{0, 1}, {1, 2}, {2, 0}, {2, 3}, {3, 4}, {4, 2}});
    }
}</code></pre>
<div class="out">G1 ring 0-1-2-3-4-0 plus chord 0-2, m = 6: yes after 1 call(s) to B. path 0 4 3 2 1 + edge (1,0)<br>
G2 two triangles sharing vertex 2, m = 6: no after 6 call(s) to B.</div>
<ul>
<li>G1: ngay cạnh đầu tiên (0, 1) đã thành công — đường đi 0 4 3 2 1 cộng cạnh (1, 0) chính là chu trình.</li>
<li>G2: đỉnh 2 nối hai tam giác với nhau, nên không chu trình nào đi qua được mọi đỉnh; cả m = 6 lần gọi đều trả lời "không".</li>
<li>Chương trình con của ta là vét cạn (brute force, hàm mũ). Đó chính là ý cuối của slide: phép rút gọn này <strong>không</strong> đưa chu trình Hamilton vào P, vì chưa ai biết thuật toán nhanh cho đường đi dài nhất.</li>
</ul>`],
      [45, 'What is a NP-complete problem?',
        `<p class="y-chinh">🎯 A problem A is NP-complete when (1) A is in NP and (2) every problem B in NP reduces to it (B &lt; A); Cook's theorem guarantees that such a problem exists.</p>
<ul>
<li>NP-complete problems are the <strong>hardest problems in NP</strong>: a polynomial algorithm for any one of them would give one for every problem in NP — that is, P = NP.</li>
<li>The definition looks too strong — why would one problem be "closely related" to every problem in NP? Cook's theorem (Stephen Cook, 1971) answers it: the satisfiability problem <strong>SAT</strong> is NP-complete.</li>
<li><strong>SAT</strong>: given a formula of true/false variables joined by AND, OR and NOT, is there an assignment that makes it true? The idea of the proof: any polynomial-time checker can be rewritten as such a formula.</li>
<li>Only condition (2)? Then A is called <strong>NP-hard</strong> — at least as hard as everything in NP, but not necessarily in NP itself.</li>
</ul>
<p class="nhan">The lesson's example — SAT by brute force: checking one assignment is fast, but there are 2ⁿ of them</p>
<pre><code class="language-java">public class SatBruteForce {
    // A formula in CNF: each clause is an OR of literals; +k means xk, -k means NOT xk
    static boolean satisfied(int[][] clauses, boolean[] x) {       // CHECK one assignment: fast
        for (int[] clause : clauses) {
            boolean ok = false;
            for (int lit : clause) ok |= (lit &gt; 0) ? x[lit] : !x[-lit];
            if (!ok) return false;
        }
        return true;
    }

    static void solve(String name, int vars, int[][] clauses) {     // FIND: try all 2^vars assignments
        StringBuilder sol = new StringBuilder();
        int tried = 0;
        for (int mask = 0; mask &lt; (1 &lt;&lt; vars); mask++) {
            boolean[] x = new boolean[vars + 1];
            for (int k = 1; k &lt;= vars; k++) x[k] = ((mask &gt;&gt; (vars - k)) &amp; 1) == 1;
            tried++;
            if (satisfied(clauses, x)) {
                sol.append(" (");
                for (int k = 1; k &lt;= vars; k++) sol.append(x[k] ? '1' : '0');
                sol.append(')');
            }
        }
        System.out.println(name + ": tried " + tried + " assignments, satisfying x1..x" + vars + " =" + (sol.length() &gt; 0 ? sol.toString() : " none"));
    }

    public static void main(String[] args) {
        // F1 = (x1 OR x2) AND (NOT x1 OR x3) AND (NOT x2 OR NOT x3)
        solve("F1", 3, new int[][] {{1, 2}, {-1, 3}, {-2, -3}});
        // F2 = (x1) AND (NOT x1 OR x2) AND (NOT x2)
        solve("F2", 2, new int[][] {{1}, {-1, 2}, {-2}});
    }
}</code></pre>
<div class="out">F1: tried 8 assignments, satisfying x1..x3 = (010) (101)<br>
F2: tried 4 assignments, satisfying x1..x2 = none</div>
<p>F1 = (x1 ∨ x2) ∧ (¬x1 ∨ x3) ∧ (¬x2 ∨ ¬x3) is satisfied by 010 and 101; F2 = x1 ∧ (¬x1 ∨ x2) ∧ ¬x2 by nothing. With 3 variables, 8 tries; with 100 variables, 2¹⁰⁰.</p>
<p class="dap-an">✅ <strong>Answer — why should one problem be related to all of NP?</strong> Because every NP problem has a fast checker, and Cook showed how to turn any such checker, run on a given input, into a SAT formula that is satisfiable exactly when the answer is "yes" — so every NP problem reduces to SAT.</p>`,
        `<p class="y-chinh">🎯 Bài toán A là NP-đầy đủ (NP-complete) khi (1) A thuộc NP và (2) mọi bài toán B thuộc NP đều rút gọn được về A (B &lt; A); định lý Cook bảo đảm có tồn tại một bài toán như vậy.</p>
<ul>
<li>Các bài toán NP-đầy đủ là <strong>những bài khó nhất trong NP</strong>: có thuật toán đa thức cho một bài bất kỳ trong số đó là có thuật toán đa thức cho mọi bài thuộc NP — tức là P = NP.</li>
<li>Định nghĩa trông mạnh quá mức — sao một bài toán lại "họ hàng gần" với mọi bài trong NP được? Định lý Cook (Cook's theorem — Stephen Cook, 1971) trả lời: bài toán thoả mãn được <strong>SAT</strong> (satisfiability) là NP-đầy đủ.</li>
<li><strong>SAT</strong>: cho một công thức gồm các biến đúng/sai nối bằng AND, OR, NOT, có cách gán giá trị nào làm công thức đúng không? Ý tưởng chứng minh: mọi bộ kiểm tra chạy trong thời gian đa thức đều viết lại được thành một công thức như thế.</li>
<li>Chỉ thoả điều kiện (2)? Khi đó A gọi là <strong>NP-khó (NP-hard)</strong> — khó ít nhất bằng mọi bài trong NP, nhưng chưa chắc bản thân nó thuộc NP.</li>
</ul>
<p class="nhan">Ví dụ của bài — giải SAT bằng vét cạn: kiểm một phép gán thì nhanh, nhưng có tới 2ⁿ phép gán</p>
<pre><code class="language-java">public class SatBruteForce {
    // Công thức dạng CNF: mỗi mệnh đề là OR các literal; +k là xk, -k là NOT xk
    static boolean satisfied(int[][] clauses, boolean[] x) {       // KIỂM một phép gán: nhanh
        for (int[] clause : clauses) {
            boolean ok = false;
            for (int lit : clause) ok |= (lit &gt; 0) ? x[lit] : !x[-lit];
            if (!ok) return false;
        }
        return true;
    }

    static void solve(String name, int vars, int[][] clauses) {     // TÌM: thử cả 2^vars phép gán
        StringBuilder sol = new StringBuilder();
        int tried = 0;
        for (int mask = 0; mask &lt; (1 &lt;&lt; vars); mask++) {
            boolean[] x = new boolean[vars + 1];
            for (int k = 1; k &lt;= vars; k++) x[k] = ((mask &gt;&gt; (vars - k)) &amp; 1) == 1;
            tried++;
            if (satisfied(clauses, x)) {
                sol.append(" (");
                for (int k = 1; k &lt;= vars; k++) sol.append(x[k] ? '1' : '0');
                sol.append(')');
            }
        }
        System.out.println(name + ": tried " + tried + " assignments, satisfying x1..x" + vars + " =" + (sol.length() &gt; 0 ? sol.toString() : " none"));
    }

    public static void main(String[] args) {
        // F1 = (x1 OR x2) AND (NOT x1 OR x3) AND (NOT x2 OR NOT x3)
        solve("F1", 3, new int[][] {{1, 2}, {-1, 3}, {-2, -3}});
        // F2 = (x1) AND (NOT x1 OR x2) AND (NOT x2)
        solve("F2", 2, new int[][] {{1}, {-1, 2}, {-2}});
    }
}</code></pre>
<div class="out">F1: tried 8 assignments, satisfying x1..x3 = (010) (101)<br>
F2: tried 4 assignments, satisfying x1..x2 = none</div>
<p>F1 = (x1 ∨ x2) ∧ (¬x1 ∨ x3) ∧ (¬x2 ∨ ¬x3) đúng với 010 và 101; F2 = x1 ∧ (¬x1 ∨ x2) ∧ ¬x2 không đúng với phép gán nào. 3 biến thì 8 lần thử; 100 biến thì 2¹⁰⁰ lần.</p>
<p class="dap-an">✅ <strong>Đáp án — vì sao một bài toán lại liên quan tới mọi bài trong NP?</strong> Vì bài nào trong NP cũng có một bộ kiểm tra nhanh, và Cook chỉ ra cách biến bất kỳ bộ kiểm tra nào như thế, chạy trên một đầu vào cụ thể, thành một công thức SAT thoả mãn được đúng khi câu trả lời là "có" — nên mọi bài trong NP đều rút gọn được về SAT.</p>`],
      [46, 'How to prove NP-completeness in practice',
        `<p class="y-chinh">🎯 To prove a new problem B NP-complete: show that B is in NP, then reduce a problem A already known to be NP-complete to B (A &lt; B); transitivity does the rest.</p>
<ul>
<li><strong>Transitivity</strong>: if A &lt; B and B &lt; C then A &lt; C — plug the algorithm for B (which calls C) into the algorithm for A.</li>
<li><strong>Consequence</strong>: every problem in NP reduces to A (A is NP-complete) and A &lt; B, so every problem in NP reduces to B. With B in NP, B is NP-complete.</li>
<li><strong>The slide's example</strong>: Hamiltonian cycle is known to be NP-complete, and Hamiltonian cycle &lt; longest path (slide 44), so longest path is NP-complete — it is in NP, since a proposed path is easy to check.</li>
</ul>
<pre><code class="language-plaintext">Cook's theorem:     every NP problem  &lt;  SAT
a standard chain:   SAT &lt; 3-SAT &lt; clique &lt; vertex cover &lt; Hamiltonian cycle &lt; longest path
                    (each "&lt;" is a reduction; every problem on the chain is NP-complete)</code></pre>
<p>On the chain, 3-SAT is SAT with exactly three literals per clause, a clique is a set of pairwise adjacent vertices, and a vertex cover is a set of vertices touching every edge.</p>
<ol>
<li>Show B ∈ NP: a certificate for B can be checked in polynomial time.</li>
<li>Pick a known NP-complete problem A and build a polynomial reduction A &lt; B.</li>
</ol>
<div class="pitfall">Reducing B to a known NP-complete problem (B &lt; A) proves nothing about B's hardness — it only says B is no harder than A. The known hard problem must be on the <strong>left</strong>: A &lt; B.</div>
<p class="meo">🧠 <strong>Remember:</strong> hardness flows along the arrow — from the famous hard problem to the new one.</p>`,
        `<p class="y-chinh">🎯 Muốn chứng minh một bài toán mới B là NP-đầy đủ (NP-complete): chỉ ra B thuộc NP, rồi rút gọn một bài A đã biết là NP-đầy đủ về B (A &lt; B); tính bắc cầu làm nốt phần còn lại.</p>
<ul>
<li><strong>Tính bắc cầu (transitivity)</strong>: nếu A &lt; B và B &lt; C thì A &lt; C — lắp thuật toán cho B (vốn gọi C) vào trong thuật toán cho A.</li>
<li><strong>Hệ quả</strong>: mọi bài thuộc NP rút gọn được về A (vì A là NP-đầy đủ) và A &lt; B, nên mọi bài thuộc NP rút gọn được về B. Cộng thêm B thuộc NP, B là NP-đầy đủ.</li>
<li><strong>Ví dụ trên slide</strong>: chu trình Hamilton đã biết là NP-đầy đủ, và chu trình Hamilton &lt; đường đi dài nhất (slide 44), nên đường đi dài nhất là NP-đầy đủ — nó thuộc NP, vì một đường đi được đưa ra thì kiểm tra dễ dàng.</li>
</ul>
<pre><code class="language-plaintext">Định lý Cook:           mọi bài toán thuộc NP  &lt;  SAT
một chuỗi quen thuộc:   SAT &lt; 3-SAT &lt; clique &lt; vertex cover &lt; chu trình Hamilton &lt; đường đi dài nhất
                        (mỗi dấu "&lt;" là một phép rút gọn; mọi bài trên chuỗi đều NP-đầy đủ)</code></pre>
<p>Trên chuỗi đó, 3-SAT là SAT mà mỗi mệnh đề (clause) có đúng ba literal (biến hoặc phủ định của biến), clique (bè) là tập đỉnh đôi một kề nhau, còn vertex cover (phủ đỉnh) là tập đỉnh chạm tới mọi cạnh.</p>
<ol>
<li>Chứng minh B ∈ NP: chứng cứ cho B kiểm tra được trong thời gian đa thức.</li>
<li>Chọn một bài A đã biết là NP-đầy đủ và xây phép rút gọn đa thức A &lt; B.</li>
</ol>
<div class="pitfall">Rút gọn B về một bài NP-đầy đủ đã biết (B &lt; A) không chứng minh được gì về độ khó của B — nó chỉ nói B không khó hơn A. Bài khó đã biết phải đứng ở <strong>bên trái</strong>: A &lt; B.</div>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> độ khó chảy theo chiều mũi tên — từ bài khó nổi tiếng sang bài mới.</p>`],
    ]),
    bi(`<h3>✅ Check yourself</h3>
<ol>
<li>f(n) = 3n² + 2n log n + 7. Give its Big-O and the rule you used.</li>
<li>An outer loop runs n times; inside it, <code>k</code> starts at n and is halved until it reaches 1. What is the Big-O?</li>
<li>Binary search on 1,000,000 sorted elements: at most how many loop turns? And what is wrong with <code>if key &gt; mid</code>?</li>
<li>Why is <code>add</code> on a doubling array O(1) amortized, although one add can cost O(n)?</li>
<li>True or false: "NP means non-polynomial, so problems in NP cannot be solved in polynomial time."</li>
</ol>
<p class="dap-an">✅ <strong>Answers:</strong> (1) O(n²) — sum rule, keep the dominant term. (2) O(n log n) — product rule. (3) 20 = ⌊log2 10⁶⌋ + 1; it compares the key with an index instead of <code>a[mid]</code>. (4) the expensive adds are rare: m adds cost fewer than 3m steps in total. (5) false — NP means checkable in polynomial time, and every problem in P is also in NP.</p>
<p><strong>Next:</strong> the deep-dive lesson 0.3 "Big-O: the language of efficiency" below, then lesson 0.5 (practice + glossary + summary of Section 0). Later in the course, lesson 3.3 analyses recursive algorithms (recursion trees, the Master theorem), A.2 goes deeper into amortized analysis, and 9.3 is the complexity cheat sheet for the exams.</p>`,
    `<h3>✅ Tự kiểm tra</h3>
<ol>
<li>f(n) = 3n² + 2n log n + 7. Cho biết Big-O của nó và quy tắc bạn đã dùng.</li>
<li>Vòng ngoài chạy n lần; bên trong, <code>k</code> bắt đầu bằng n và bị chia đôi cho tới khi bằng 1. Big-O là gì?</li>
<li>Tìm nhị phân trên 1.000.000 phần tử đã sắp: nhiều nhất bao nhiêu vòng lặp? Và <code>if key &gt; mid</code> sai ở đâu?</li>
<li>Vì sao <code>add</code> trên mảng nhân đôi là O(1) khấu hao, dù một lần thêm có thể tốn O(n)?</li>
<li>Đúng hay sai: "NP nghĩa là không đa thức, nên bài toán thuộc NP không thể giải trong thời gian đa thức."</li>
</ol>
<p class="dap-an">✅ <strong>Đáp án:</strong> (1) O(n²) — quy tắc tổng, giữ số hạng trội. (2) O(n log n) — quy tắc tích. (3) 20 = ⌊log2 10⁶⌋ + 1; nó so khoá với một chỉ số thay vì với <code>a[mid]</code>. (4) các lần thêm đắt rất hiếm: m lần thêm tốn tổng cộng ít hơn 3m bước. (5) sai — NP nghĩa là kiểm tra được trong thời gian đa thức, và mọi bài thuộc P cũng thuộc NP.</p>
<p><strong>Học tiếp:</strong> bài đào sâu 0.3 "Big-O: ngôn ngữ của hiệu năng" bên dưới, rồi bài 0.5 (thực hành + thuật ngữ + tóm tắt của Mục 0). Về sau trong môn, bài 3.3 phân tích thuật toán đệ quy (cây đệ quy, định lý Thợ — Master theorem), bài A.2 đi sâu hơn vào phân tích khấu hao, còn bài 9.3 là bảng tra độ phức tạp để ôn thi.</p>`),
    books([
      ['goodrich', 'Ch.4 Algorithm Analysis — §4.3 Asymptotic Analysis (Big-Oh, Big-Omega, Big-Theta, examples of algorithm analysis) · Ch.7 §7.2 Array Lists (dynamic arrays and their amortized analysis)', 'Chương 4 Algorithm Analysis — §4.3 Asymptotic Analysis (phân tích tiệm cận: Big-Oh, Big-Omega, Big-Theta, các ví dụ phân tích thuật toán) · Chương 7 §7.2 Array Lists (mảng động và phân tích khấu hao của nó)'],
    ]),
  ].join('\n'),
};

/* ───────── 0.5 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Algorithms & complexity analysis ───────── */
const L_on_ch0 = {
  title: '0.5 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Algorithms & complexity analysis|||0.5 — 🧪 Thực hành + 🗂 Thuật ngữ + 📌 Tóm tắt · Thuật toán & phân tích độ phức tạp',
  slug: 'csd201-on-ch0',
  type: 'VIDEO',
  isFreePreview: true,
  description: '7 bài tập Java đếm phép toán thay vì bấm giờ (arrayMax, đoán Big-O bằng cách đếm vòng lặp, tìm tuần tự vs nhị phân với n = 8, 1024, 10^6, tổng tiền tố O(n²) → O(n), tìm phần tử trùng ba cách, mảng động N + k vs nhân đôi — khấu hao, bài kiểu PE CarList f1–f4) có lời giải và test tự kiểm chạy thật; 24 thuật ngữ Anh–Việt; tóm tắt 8 ý và bảng độ phức tạp của Mục 0.',
  content: [
    bi(`<span class="eyebrow">Section 0 · Lesson 0.5 · Practice &amp; review</span>
<h2>Algorithms &amp; complexity — count the work, then review</h2>
<p class="lead">Seven exercises that train the one skill Section 0 is about: counting how much work an algorithm does and turning the count into Big-O. No stopwatch — only counters — so every output is the same on every machine. Then the vocabulary of the three decks (course introduction, introduction to DSA, complexity analysis) in English and Vietnamese, a one-screen summary and the complexity table.</p>
<div class="callout"><strong>How to use this page.</strong>
<ol>
<li>Read the task, scroll the solution out of sight and write the method yourself in Eclipse (compliance level 1.8 — lesson 0.A, slide 6).</li>
<li>Copy the test <code>main</code> of the solution and run it: every line must say PASS.</li>
<li>Only then compare with the solution and read the trap under it.</li>
</ol>
<p>Section 0 is rarely the subject of a PE question of its own, but "how many times does this statement run?" is a common FE question, and picking an O(n) method instead of an O(n²) one matters as soon as the data grows. A CSD201 PE usually gives you a skeleton — a data class, a structure class, a <code>main</code> that calls <code>f1</code>, <code>f2</code>, … and writes each answer to a file — and you fill in the bodies; Exercise 7 has that shape, with the answers printed on the screen instead.</p></div>`,
    `<span class="eyebrow">Mục 0 · Bài 0.5 · Thực hành &amp; ôn tập</span>
<h2>Giải thuật &amp; độ phức tạp — đếm khối lượng công việc, rồi ôn lại</h2>
<p class="lead">Bảy bài tập rèn đúng một kỹ năng mà Mục 0 hướng tới: đếm xem giải thuật làm bao nhiêu việc rồi đổi con số đó thành Big-O (ký hiệu O lớn). Không bấm giờ — chỉ dùng biến đếm — nên máy nào chạy cũng ra đúng một output (kết quả in ra). Sau đó là thuật ngữ của ba bộ slide (giới thiệu môn, nhập môn cấu trúc dữ liệu &amp; giải thuật, phân tích độ phức tạp) bằng tiếng Anh và tiếng Việt, bản tóm tắt một màn hình và bảng độ phức tạp.</p>
<div class="callout"><strong>Cách dùng trang này.</strong>
<ol>
<li>Đọc đề, cuộn lời giải ra khỏi màn hình rồi tự viết hàm trong Eclipse (đặt mức tương thích 1.8 — bài 0.A, slide 6).</li>
<li>Chép hàm <code>main</code> kiểm thử (test) của lời giải vào và chạy: mọi dòng phải là PASS (đạt).</li>
<li>Lúc đó mới so với lời giải và đọc cái bẫy ghi bên dưới.</li>
</ol>
<p>Mục 0 hiếm khi có câu PE (thi thực hành) riêng, nhưng "lệnh này chạy bao nhiêu lần?" là dạng câu quen thuộc của FE (thi cuối kỳ), và chọn cách O(n) thay vì O(n²) trở nên quan trọng ngay khi dữ liệu lớn lên. Đề PE môn CSD201 thường cho sẵn bộ khung — một lớp dữ liệu, một lớp cấu trúc, hàm <code>main</code> gọi <code>f1</code>, <code>f2</code>, … và ghi từng đáp án ra file — còn bạn viết thân các hàm; Bài 7 có đúng dạng đó, chỉ khác là kết quả in ra màn hình.</p></div>`),
    bi(`<h3>🧪 Exercise 1 — arrayMax: count the primitive operations (warm-up · ~10 min)</h3>
<p class="nhan">Task</p>
<p>Write <code>int arrayMax(int[] a)</code> that returns the largest element and counts two primitive operations in static counters: <code>comparisons</code> (each test <code>a[i] &gt; currentMax</code>) and <code>assignments</code> (each assignment to <code>currentMax</code>, the first one included). Run it on three arrays of n = 8: increasing 1…8, decreasing 8…1, and {3, 9, 2, 9, 5, 1, 7, 4}.</p>
<p class="nhan">Data → expected result</p>
<p>max / comparisons / assignments = 8/7/8 (increasing), 8/7/1 (decreasing), 9/7/2 (mixed).</p>
<p class="nhan">Idea</p>
<p>The loop runs for i = 1 … n − 1, so the comparison happens exactly n − 1 times whatever the data. Only the assignments depend on the data: 1 in the best case (the maximum comes first), n in the worst case (increasing order). In total between n and 2n − 1 primitive operations — O(n) in every case.</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">public class Pe1ArrayMax {
    static int comparisons, assignments;             // the two primitive operations we count

    static int arrayMax(int[] a) {
        comparisons = 0;
        int currentMax = a[0];
        assignments = 1;                             // the first assignment counts too
        for (int i = 1; i &lt; a.length; i++) {
            comparisons++;                           // a[i] &gt; currentMax is tested once per turn
            if (a[i] &gt; currentMax) {
                currentMax = a[i];
                assignments++;
            }
        }
        return currentMax;
    }

    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    static String run(int[] a) {                     // "max/comparisons/assignments"
        int m = arrayMax(a);
        return m + "/" + comparisons + "/" + assignments;
    }

    public static void main(String[] args) {
        int[] up = {1, 2, 3, 4, 5, 6, 7, 8};
        int[] down = {8, 7, 6, 5, 4, 3, 2, 1};
        int[] mixed = {3, 9, 2, 9, 5, 1, 7, 4};
        System.out.println("increasing: max/comparisons/assignments = " + run(up));
        System.out.println("decreasing: max/comparisons/assignments = " + run(down));
        System.out.println("mixed     : max/comparisons/assignments = " + run(mixed));
        check("increasing = worst case: 7 comparisons, 8 assignments", run(up), "8/7/8");
        check("decreasing = best case: 7 comparisons, 1 assignment", run(down), "8/7/1");
        check("mixed: the second 9 does not reassign (strict &gt;)", run(mixed), "9/7/2");
        check("one element: no comparison at all", run(new int[] {42}), "42/0/1");
        check("all negative: the answer is -2, not 0", run(new int[] {-5, -2, -9}), "-2/2/2");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">increasing: max/comparisons/assignments = 8/7/8<br>
decreasing: max/comparisons/assignments = 8/7/1<br>
mixed &nbsp;&nbsp;&nbsp;&nbsp;: max/comparisons/assignments = 9/7/2<br>
PASS increasing = worst case: 7 comparisons, 8 assignments<br>
PASS decreasing = best case: 7 comparisons, 1 assignment<br>
PASS mixed: the second 9 does not reassign (strict &gt;)<br>
PASS one element: no comparison at all<br>
PASS all negative: the answer is -2, not 0<br>
ALL TESTS PASSED</div>
<div class="pitfall">Count the elements before counting the steps. The ComplexityAnalysis deck lists the sequence as a0, a1, …, an — that is n + 1 elements — loops <code>for i := 1 to n</code> (n comparisons) and yet states "n − 1 times"; the statement is right for n elements a0 … a(n−1). Exam options often differ by exactly one.</div>`,
    `<h3>🧪 Bài 1 — arrayMax: đếm các phép toán cơ bản (khởi động · ~10 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Viết <code>int arrayMax(int[] a)</code> trả về phần tử lớn nhất và đếm hai loại phép toán cơ bản (primitive operation) trong các biến đếm tĩnh (<code>static</code>): <code>comparisons</code> (mỗi lần thử <code>a[i] &gt; currentMax</code>) và <code>assignments</code> (mỗi lần gán cho <code>currentMax</code>, tính cả lần gán đầu tiên). Chạy trên ba mảng n = 8: tăng dần 1…8, giảm dần 8…1, và {3, 9, 2, 9, 5, 1, 7, 4}.</p>
<p class="nhan">Dữ liệu → kết quả mong đợi</p>
<p>max / số phép so sánh / số phép gán = 8/7/8 (tăng dần), 8/7/1 (giảm dần), 9/7/2 (lẫn lộn).</p>
<p class="nhan">Ý tưởng</p>
<p>Vòng lặp chạy với i = 1 … n − 1, nên phép so sánh xảy ra đúng n − 1 lần bất kể dữ liệu. Chỉ số phép gán phụ thuộc dữ liệu: 1 lần ở trường hợp tốt nhất (best case — max đứng đầu), n lần ở trường hợp xấu nhất (worst case — mảng tăng dần). Tổng cộng từ n tới 2n − 1 phép toán cơ bản — O(n) trong mọi trường hợp.</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">public class Pe1ArrayMax {
    static int comparisons, assignments;             // hai loại phép toán cơ bản cần đếm

    static int arrayMax(int[] a) {
        comparisons = 0;
        int currentMax = a[0];
        assignments = 1;                             // phép gán đầu tiên cũng được đếm
        for (int i = 1; i &lt; a.length; i++) {
            comparisons++;                           // mỗi vòng thử a[i] &gt; currentMax đúng một lần
            if (a[i] &gt; currentMax) {
                currentMax = a[i];
                assignments++;
            }
        }
        return currentMax;
    }

    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    static String run(int[] a) {                     // "max/số so sánh/số phép gán"
        int m = arrayMax(a);
        return m + "/" + comparisons + "/" + assignments;
    }

    public static void main(String[] args) {
        int[] up = {1, 2, 3, 4, 5, 6, 7, 8};
        int[] down = {8, 7, 6, 5, 4, 3, 2, 1};
        int[] mixed = {3, 9, 2, 9, 5, 1, 7, 4};
        System.out.println("increasing: max/comparisons/assignments = " + run(up));
        System.out.println("decreasing: max/comparisons/assignments = " + run(down));
        System.out.println("mixed     : max/comparisons/assignments = " + run(mixed));
        check("increasing = worst case: 7 comparisons, 8 assignments", run(up), "8/7/8");
        check("decreasing = best case: 7 comparisons, 1 assignment", run(down), "8/7/1");
        check("mixed: the second 9 does not reassign (strict &gt;)", run(mixed), "9/7/2");
        check("one element: no comparison at all", run(new int[] {42}), "42/0/1");
        check("all negative: the answer is -2, not 0", run(new int[] {-5, -2, -9}), "-2/2/2");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">increasing: max/comparisons/assignments = 8/7/8<br>
decreasing: max/comparisons/assignments = 8/7/1<br>
mixed &nbsp;&nbsp;&nbsp;&nbsp;: max/comparisons/assignments = 9/7/2<br>
PASS increasing = worst case: 7 comparisons, 8 assignments<br>
PASS decreasing = best case: 7 comparisons, 1 assignment<br>
PASS mixed: the second 9 does not reassign (strict &gt;)<br>
PASS one element: no comparison at all<br>
PASS all negative: the answer is -2, not 0<br>
ALL TESTS PASSED</div>
<div class="pitfall">Đếm số phần tử trước khi đếm số bước. Bộ slide ComplexityAnalysis ghi dãy là a0, a1, …, an — tức n + 1 phần tử — lặp <code>for i := 1 to n</code> (n phép so sánh) mà lại kết luận "n − 1 lần"; kết luận đó chỉ đúng khi có n phần tử a0 … a(n−1). Các phương án trắc nghiệm thường chỉ lệch nhau đúng một đơn vị.</div>`),
    bi(`<h3>🧪 Exercise 2 — Big-O detective: count the loops, classify the growth (FE style · ~15 min)</h3>
<p class="nhan">Task</p>
<p>For each fragment, count by hand how many times <code>count++</code> runs for n = 8, 16 and 32, write the exact formula, and give the Big-O. Then check yourself with the program.</p>
<table>
<thead><tr><th>Fragment</th><th>Code</th></tr></thead>
<tbody>
<tr><td>f1</td><td><code>for (i = 0; i &lt; n; i++) count++;</code></td></tr>
<tr><td>f2</td><td><code>for (i = 0; i &lt; n; i++) for (j = 0; j &lt; n; j++) count++;</code></td></tr>
<tr><td>f3</td><td><code>for (i = 0; i &lt; n; i++) for (j = 0; j &lt; i; j++) count++;</code></td></tr>
<tr><td>f4</td><td><code>for (i = 1; i &lt; n; i *= 2) count++;</code></td></tr>
<tr><td>f5</td><td><code>for (i = 0; i &lt; n; i++) for (j = 1; j &lt; n; j *= 2) count++;</code></td></tr>
<tr><td>f6</td><td><code>for (i = 0; i &lt; 100; i++) count++;</code></td></tr>
<tr><td>f7</td><td><code>for (i = 0; i &lt; n; i += 2) count++;</code></td></tr>
</tbody>
</table>
<p class="nhan">Idea</p>
<p>Exact counts: f1 = n, f2 = n², f3 = 0 + 1 + … + (n − 1) = n(n − 1)/2, f4 = log₂ n (n a power of 2), f5 = n·log₂ n, f6 = 100, f7 = n/2. Then the <strong>doubling test</strong>: look at count(2n) / count(n) — about 1 → O(1); growing by just +1 → O(log n); 2 → O(n); a little above 2 → O(n log n); 4 → O(n²); 8 → O(n³).</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">import java.util.Locale;

public class Pe2LoopCount {
    // How many times does count++ run in fragment f, for input size n?
    static long count(int f, int n) {
        long count = 0;
        switch (f) {
            case 1: for (int i = 0; i &lt; n; i++) count++; break;
            case 2: for (int i = 0; i &lt; n; i++) for (int j = 0; j &lt; n; j++) count++; break;
            case 3: for (int i = 0; i &lt; n; i++) for (int j = 0; j &lt; i; j++) count++; break;
            case 4: for (int i = 1; i &lt; n; i *= 2) count++; break;
            case 5: for (int i = 0; i &lt; n; i++) for (int j = 1; j &lt; n; j *= 2) count++; break;
            case 6: for (int i = 0; i &lt; 100; i++) count++; break;
            case 7: for (int i = 0; i &lt; n; i += 2) count++; break;
        }
        return count;
    }

    static int log2(int n) { int k = 0; while ((1 &lt;&lt; (k + 1)) &lt;= n) k++; return k; }   // n is a power of 2 here

    static long formula(int f, int n) {               // the exact count, worked out by hand
        switch (f) {
            case 1: return n;
            case 2: return (long) n * n;
            case 3: return (long) n * (n - 1) / 2;
            case 4: return log2(n);
            case 5: return (long) n * log2(n);
            case 6: return 100;
            default: return n / 2;
        }
    }

    public static void main(String[] args) {
        String[] bigO = {"", "O(n)", "O(n^2)", "O(n^2)", "O(log n)", "O(n log n)", "O(1)", "O(n)"};
        int fails = 0;
        System.out.println("frag  n=8  n=16  n=32  x2 ratio  Big-O       formula check");
        for (int f = 1; f &lt;= 7; f++) {
            long c8 = count(f, 8), c16 = count(f, 16), c32 = count(f, 32);
            boolean ok = c8 == formula(f, 8) &amp;&amp; c16 == formula(f, 16) &amp;&amp; c32 == formula(f, 32);
            if (!ok) fails++;
            System.out.println(String.format(Locale.US, "f%d  %5d %5d %5d   %6.2f   %-10s  %s", f, c8, c16, c32,
                    (double) c32 / c16, bigO[f], ok ? "PASS" : "FAIL"));
        }
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">frag &nbsp;n=8 &nbsp;n=16 &nbsp;n=32 &nbsp;x2 ratio &nbsp;Big-O &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;formula check<br>
f1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8 &nbsp;&nbsp;&nbsp;16 &nbsp;&nbsp;&nbsp;32 &nbsp;&nbsp;&nbsp;&nbsp;2.00 &nbsp;&nbsp;O(n) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PASS<br>
f2 &nbsp;&nbsp;&nbsp;&nbsp;64 &nbsp;&nbsp;256 &nbsp;1024 &nbsp;&nbsp;&nbsp;&nbsp;4.00 &nbsp;&nbsp;O(n^2) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PASS<br>
f3 &nbsp;&nbsp;&nbsp;&nbsp;28 &nbsp;&nbsp;120 &nbsp;&nbsp;496 &nbsp;&nbsp;&nbsp;&nbsp;4.13 &nbsp;&nbsp;O(n^2) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PASS<br>
f4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;5 &nbsp;&nbsp;&nbsp;&nbsp;1.25 &nbsp;&nbsp;O(log n) &nbsp;&nbsp;&nbsp;PASS<br>
f5 &nbsp;&nbsp;&nbsp;&nbsp;24 &nbsp;&nbsp;&nbsp;64 &nbsp;&nbsp;160 &nbsp;&nbsp;&nbsp;&nbsp;2.50 &nbsp;&nbsp;O(n log n) &nbsp;PASS<br>
f6 &nbsp;&nbsp;&nbsp;100 &nbsp;&nbsp;100 &nbsp;&nbsp;100 &nbsp;&nbsp;&nbsp;&nbsp;1.00 &nbsp;&nbsp;O(1) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PASS<br>
f7 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;8 &nbsp;&nbsp;&nbsp;16 &nbsp;&nbsp;&nbsp;&nbsp;2.00 &nbsp;&nbsp;O(n) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PASS<br>
ALL TESTS PASSED</div>
<div class="pitfall">Constant factors and smaller terms disappear: n(n − 1)/2 is still O(n²), n/2 is still O(n). And f6 is O(1) although it makes 100 steps — "constant time" means "does not grow with n", not "one step".</div>`,
    `<h3>🧪 Bài 2 — Thám tử Big-O: đếm vòng lặp, phân loại tốc độ tăng (kiểu câu FE · ~15 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Với mỗi đoạn code, tự đếm bằng tay xem <code>count++</code> chạy bao nhiêu lần khi n = 8, 16 và 32, viết công thức chính xác, và cho Big-O (ký hiệu O lớn). Sau đó tự kiểm bằng chương trình.</p>
<table>
<thead><tr><th>Đoạn</th><th>Code</th></tr></thead>
<tbody>
<tr><td>f1</td><td><code>for (i = 0; i &lt; n; i++) count++;</code></td></tr>
<tr><td>f2</td><td><code>for (i = 0; i &lt; n; i++) for (j = 0; j &lt; n; j++) count++;</code></td></tr>
<tr><td>f3</td><td><code>for (i = 0; i &lt; n; i++) for (j = 0; j &lt; i; j++) count++;</code></td></tr>
<tr><td>f4</td><td><code>for (i = 1; i &lt; n; i *= 2) count++;</code></td></tr>
<tr><td>f5</td><td><code>for (i = 0; i &lt; n; i++) for (j = 1; j &lt; n; j *= 2) count++;</code></td></tr>
<tr><td>f6</td><td><code>for (i = 0; i &lt; 100; i++) count++;</code></td></tr>
<tr><td>f7</td><td><code>for (i = 0; i &lt; n; i += 2) count++;</code></td></tr>
</tbody>
</table>
<p class="nhan">Ý tưởng</p>
<p>Số lần chính xác: f1 = n, f2 = n², f3 = 0 + 1 + … + (n − 1) = n(n − 1)/2, f4 = log₂ n (n là luỹ thừa của 2), f5 = n·log₂ n, f6 = 100, f7 = n/2. Rồi làm <strong>phép thử nhân đôi (doubling test)</strong>: xem tỉ số count(2n) / count(n) — khoảng 1 → O(1); chỉ tăng thêm 1 → O(log n); 2 → O(n); nhỉnh hơn 2 → O(n log n); 4 → O(n²); 8 → O(n³).</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">import java.util.Locale;

public class Pe2LoopCount {
    // Lệnh count++ trong đoạn f chạy bao nhiêu lần với cỡ n?
    static long count(int f, int n) {
        long count = 0;
        switch (f) {
            case 1: for (int i = 0; i &lt; n; i++) count++; break;
            case 2: for (int i = 0; i &lt; n; i++) for (int j = 0; j &lt; n; j++) count++; break;
            case 3: for (int i = 0; i &lt; n; i++) for (int j = 0; j &lt; i; j++) count++; break;
            case 4: for (int i = 1; i &lt; n; i *= 2) count++; break;
            case 5: for (int i = 0; i &lt; n; i++) for (int j = 1; j &lt; n; j *= 2) count++; break;
            case 6: for (int i = 0; i &lt; 100; i++) count++; break;
            case 7: for (int i = 0; i &lt; n; i += 2) count++; break;
        }
        return count;
    }

    static int log2(int n) { int k = 0; while ((1 &lt;&lt; (k + 1)) &lt;= n) k++; return k; }   // ở đây n là luỹ thừa của 2

    static long formula(int f, int n) {               // số lần chính xác, tính bằng tay
        switch (f) {
            case 1: return n;
            case 2: return (long) n * n;
            case 3: return (long) n * (n - 1) / 2;
            case 4: return log2(n);
            case 5: return (long) n * log2(n);
            case 6: return 100;
            default: return n / 2;
        }
    }

    public static void main(String[] args) {
        String[] bigO = {"", "O(n)", "O(n^2)", "O(n^2)", "O(log n)", "O(n log n)", "O(1)", "O(n)"};
        int fails = 0;
        System.out.println("frag  n=8  n=16  n=32  x2 ratio  Big-O       formula check");
        for (int f = 1; f &lt;= 7; f++) {
            long c8 = count(f, 8), c16 = count(f, 16), c32 = count(f, 32);
            boolean ok = c8 == formula(f, 8) &amp;&amp; c16 == formula(f, 16) &amp;&amp; c32 == formula(f, 32);
            if (!ok) fails++;
            System.out.println(String.format(Locale.US, "f%d  %5d %5d %5d   %6.2f   %-10s  %s", f, c8, c16, c32,
                    (double) c32 / c16, bigO[f], ok ? "PASS" : "FAIL"));
        }
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">frag &nbsp;n=8 &nbsp;n=16 &nbsp;n=32 &nbsp;x2 ratio &nbsp;Big-O &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;formula check<br>
f1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8 &nbsp;&nbsp;&nbsp;16 &nbsp;&nbsp;&nbsp;32 &nbsp;&nbsp;&nbsp;&nbsp;2.00 &nbsp;&nbsp;O(n) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PASS<br>
f2 &nbsp;&nbsp;&nbsp;&nbsp;64 &nbsp;&nbsp;256 &nbsp;1024 &nbsp;&nbsp;&nbsp;&nbsp;4.00 &nbsp;&nbsp;O(n^2) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PASS<br>
f3 &nbsp;&nbsp;&nbsp;&nbsp;28 &nbsp;&nbsp;120 &nbsp;&nbsp;496 &nbsp;&nbsp;&nbsp;&nbsp;4.13 &nbsp;&nbsp;O(n^2) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PASS<br>
f4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;5 &nbsp;&nbsp;&nbsp;&nbsp;1.25 &nbsp;&nbsp;O(log n) &nbsp;&nbsp;&nbsp;PASS<br>
f5 &nbsp;&nbsp;&nbsp;&nbsp;24 &nbsp;&nbsp;&nbsp;64 &nbsp;&nbsp;160 &nbsp;&nbsp;&nbsp;&nbsp;2.50 &nbsp;&nbsp;O(n log n) &nbsp;PASS<br>
f6 &nbsp;&nbsp;&nbsp;100 &nbsp;&nbsp;100 &nbsp;&nbsp;100 &nbsp;&nbsp;&nbsp;&nbsp;1.00 &nbsp;&nbsp;O(1) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PASS<br>
f7 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;8 &nbsp;&nbsp;&nbsp;16 &nbsp;&nbsp;&nbsp;&nbsp;2.00 &nbsp;&nbsp;O(n) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PASS<br>
ALL TESTS PASSED</div>
<div class="pitfall">Hằng số nhân và các số hạng nhỏ đều bị bỏ: n(n − 1)/2 vẫn là O(n²), n/2 vẫn là O(n). Còn f6 là O(1) dù chạy 100 bước — "thời gian hằng" (constant time) nghĩa là "không tăng theo n", chứ không phải "một bước".</div>`),
    bi(`<h3>🧪 Exercise 3 — Sequential vs binary search: worst cases for n = 8, 1,024, 10⁶ (~15 min)</h3>
<p class="nhan">Task</p>
<p>Write <code>linearSearch(a, key)</code> and <code>binarySearch(a, key)</code> (a sorted ascending), both returning the index of key or −1, and count every comparison of the key with an element. On a = {0, 2, 4, …, 2(n − 1)} measure the worst case of each for n = 8, 1,024 and 1,000,000; then run binary search for every key from −1 to 2,048 with n = 1,024.</p>
<p class="nhan">Data → expected result</p>
<p>Linear: 8, 1,024 and 1,000,000 comparisons. Binary: 4, 11 and 20 — that is ⌊log₂ n⌋ + 1.</p>
<p class="nhan">Idea</p>
<p>A missing key forces linear search through all n elements. Binary search halves the range at every probe; a key bigger than every element always goes right, and the range shrinks n → n/2 → … → 1 → 0, which takes ⌊log₂ n⌋ + 1 probes. A million elements cost 20 probes instead of a million comparisons: in the deck's words, c₁·n against c₂·log₂ n — for small n the gap does not matter, for large n it is huge.</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">import java.util.Locale;

public class Pe3Search {
    static long comparisons;                          // comparisons of key with an element

    static int linearSearch(int[] a, int key) {
        for (int i = 0; i &lt; a.length; i++) {
            comparisons++;
            if (a[i] == key) return i;
        }
        return -1;
    }

    static int binarySearch(int[] a, int key) {       // a must be sorted ascending
        int left = 0, right = a.length - 1;
        while (left &lt;= right) {
            int mid = left + (right - left) / 2;      // same as (left + right) / 2, but cannot overflow
            comparisons++;                            // one probe: key against a[mid]
            if (a[mid] == key) return mid;
            if (key &gt; a[mid]) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }

    static int bound(int n) { int k = 0; for (int s = n; s &gt; 0; s /= 2) k++; return k; }   // halvings until 0 = floor(log2 n) + 1

    static int fails = 0;

    static void check(String name, boolean ok) {
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name);
    }

    public static void main(String[] args) {
        System.out.println("      n | linear, worst | binary, worst | floor(log2 n) + 1");
        for (int n : new int[] {8, 1024, 1000000}) {
            int[] a = new int[n];
            for (int i = 0; i &lt; n; i++) a[i] = 2 * i;            // 0, 2, 4, ... : sorted, all even
            comparisons = 0;
            linearSearch(a, -1);                                  // missing key: all n compared
            long lin = comparisons;
            comparisons = 0;
            binarySearch(a, 2 * n);                               // bigger than all: always go right
            long bin = comparisons;
            System.out.println(String.format(Locale.US, "%7d | %13d | %13d | %d", n, lin, bin, bound(n)));
            check("n = " + n + ": linear worst = n, binary worst = floor(log2 n) + 1", lin == n &amp;&amp; bin == bound(n));
        }
        int n = 1024;
        int[] a = new int[n];
        for (int i = 0; i &lt; n; i++) a[i] = 2 * i;
        boolean found = true, missing = true, withinBound = true;
        for (int key = -1; key &lt;= 2 * n; key++) {                 // present: 0, 2, ..., 2046; missing: -1, every odd key, 2048
            comparisons = 0;
            int r = binarySearch(a, key);
            if (key % 2 == 0 &amp;&amp; key &gt;= 0 &amp;&amp; key &lt; 2 * n) found &amp;= (r == key / 2);
            else missing &amp;= (r == -1);
            withinBound &amp;= comparisons &lt;= bound(n);
        }
        check("binary search finds all 1024 elements at the right index", found);
        check("binary search returns -1 for all 1026 missing keys", missing);
        check("no search needed more than 11 probes", withinBound);
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;n | linear, worst | binary, worst | floor(log2 n) + 1<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4 | 4<br>
PASS n = 8: linear worst = n, binary worst = floor(log2 n) + 1<br>
&nbsp;&nbsp;&nbsp;1024 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1024 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;11 | 11<br>
PASS n = 1024: linear worst = n, binary worst = floor(log2 n) + 1<br>
1000000 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1000000 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20 | 20<br>
PASS n = 1000000: linear worst = n, binary worst = floor(log2 n) + 1<br>
PASS binary search finds all 1024 elements at the right index<br>
PASS binary search returns -1 for all 1026 missing keys<br>
PASS no search needed more than 11 probes<br>
ALL TESTS PASSED</div>
<div class="pitfall">Two classic bugs. (1) Comparing the key with the <em>index</em> <code>mid</code> instead of the <em>element</em> <code>a[mid]</code> — the ComplexityAnalysis deck's own pseudocode slips here ("if key &gt; mid"). (2) <code>mid = (left + right) / 2</code> overflows once <code>left + right</code> passes 2³¹ − 1 (arrays of over a billion elements); <code>left + (right - left) / 2</code> cannot. And on unsorted data binary search returns wrong answers without any error.</div>`,
    `<h3>🧪 Bài 3 — Tìm tuần tự vs tìm nhị phân: trường hợp xấu nhất với n = 8, 1.024, 10⁶ (~15 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Viết <code>linearSearch(a, key)</code> (tìm tuần tự — linear/sequential search) và <code>binarySearch(a, key)</code> (tìm nhị phân — binary search, a đã sắp tăng dần), cả hai trả về chỉ số của khoá (key) hoặc −1, và đếm mọi lần so sánh khoá với một phần tử. Trên a = {0, 2, 4, …, 2(n − 1)}, đo trường hợp xấu nhất (worst case) của mỗi hàm với n = 8, 1.024 và 1.000.000; sau đó chạy tìm nhị phân cho mọi khoá từ −1 tới 2.048 với n = 1.024.</p>
<p class="nhan">Dữ liệu → kết quả mong đợi</p>
<p>Tuần tự: 8, 1.024 và 1.000.000 phép so sánh. Nhị phân: 4, 11 và 20 — tức ⌊log₂ n⌋ + 1.</p>
<p class="nhan">Ý tưởng</p>
<p>Khoá không có trong mảng buộc tìm tuần tự phải đi hết n phần tử. Tìm nhị phân chia đôi vùng tìm sau mỗi lần dò (probe); khoá lớn hơn mọi phần tử thì luôn rẽ phải, vùng tìm co lại n → n/2 → … → 1 → 0, mất ⌊log₂ n⌋ + 1 lần dò. Một triệu phần tử chỉ tốn 20 lần dò thay vì một triệu phép so sánh: theo cách nói của slide, c₁·n so với c₂·log₂ n — n nhỏ thì chênh lệch không đáng kể, n lớn thì khác biệt khổng lồ.</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">import java.util.Locale;

public class Pe3Search {
    static long comparisons;                          // số lần so sánh khoá với một phần tử

    static int linearSearch(int[] a, int key) {
        for (int i = 0; i &lt; a.length; i++) {
            comparisons++;
            if (a[i] == key) return i;
        }
        return -1;
    }

    static int binarySearch(int[] a, int key) {       // a phải được sắp tăng dần
        int left = 0, right = a.length - 1;
        while (left &lt;= right) {
            int mid = left + (right - left) / 2;      // giống (left + right) / 2 nhưng không bị tràn số
            comparisons++;                            // một lần dò: so key với a[mid]
            if (a[mid] == key) return mid;
            if (key &gt; a[mid]) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }

    static int bound(int n) { int k = 0; for (int s = n; s &gt; 0; s /= 2) k++; return k; }   // số lần chia đôi tới 0 = floor(log2 n) + 1

    static int fails = 0;

    static void check(String name, boolean ok) {
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name);
    }

    public static void main(String[] args) {
        System.out.println("      n | linear, worst | binary, worst | floor(log2 n) + 1");
        for (int n : new int[] {8, 1024, 1000000}) {
            int[] a = new int[n];
            for (int i = 0; i &lt; n; i++) a[i] = 2 * i;            // 0, 2, 4, ... : đã sắp, toàn số chẵn
            comparisons = 0;
            linearSearch(a, -1);                                  // khoá không có: so đủ n phần tử
            long lin = comparisons;
            comparisons = 0;
            binarySearch(a, 2 * n);                               // lớn hơn tất cả: luôn rẽ phải
            long bin = comparisons;
            System.out.println(String.format(Locale.US, "%7d | %13d | %13d | %d", n, lin, bin, bound(n)));
            check("n = " + n + ": linear worst = n, binary worst = floor(log2 n) + 1", lin == n &amp;&amp; bin == bound(n));
        }
        int n = 1024;
        int[] a = new int[n];
        for (int i = 0; i &lt; n; i++) a[i] = 2 * i;
        boolean found = true, missing = true, withinBound = true;
        for (int key = -1; key &lt;= 2 * n; key++) {                 // có: 0, 2, ..., 2046; không có: -1, mọi khoá lẻ, 2048
            comparisons = 0;
            int r = binarySearch(a, key);
            if (key % 2 == 0 &amp;&amp; key &gt;= 0 &amp;&amp; key &lt; 2 * n) found &amp;= (r == key / 2);
            else missing &amp;= (r == -1);
            withinBound &amp;= comparisons &lt;= bound(n);
        }
        check("binary search finds all 1024 elements at the right index", found);
        check("binary search returns -1 for all 1026 missing keys", missing);
        check("no search needed more than 11 probes", withinBound);
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;n | linear, worst | binary, worst | floor(log2 n) + 1<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4 | 4<br>
PASS n = 8: linear worst = n, binary worst = floor(log2 n) + 1<br>
&nbsp;&nbsp;&nbsp;1024 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1024 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;11 | 11<br>
PASS n = 1024: linear worst = n, binary worst = floor(log2 n) + 1<br>
1000000 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1000000 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20 | 20<br>
PASS n = 1000000: linear worst = n, binary worst = floor(log2 n) + 1<br>
PASS binary search finds all 1024 elements at the right index<br>
PASS binary search returns -1 for all 1026 missing keys<br>
PASS no search needed more than 11 probes<br>
ALL TESTS PASSED</div>
<div class="pitfall">Hai lỗi kinh điển. (1) So key với <em>chỉ số</em> <code>mid</code> thay vì với <em>phần tử</em> <code>a[mid]</code> — chính mã giả trong bộ slide ComplexityAnalysis bị sót chỗ này ("if key &gt; mid"). (2) <code>mid = (left + right) / 2</code> bị tràn số (overflow) khi <code>left + right</code> vượt 2³¹ − 1 (mảng hơn một tỷ phần tử); <code>left + (right - left) / 2</code> thì không. Và trên dữ liệu chưa sắp xếp, tìm nhị phân trả kết quả sai mà không báo lỗi gì.</div>`),
    bi(`<h3>🧪 Exercise 4 — Prefix sums: from O(n²) to O(n) (interview classic · ~10 min)</h3>
<p class="nhan">Task</p>
<p>Given <code>int[] a</code>, build <code>p</code> with p[i] = a[0] + a[1] + … + a[i]. Write a slow version that recomputes each sum from a[0] and a fast version that reuses the previous sum; count the additions of each. Then use p to answer "sum of a[l..r]" in O(1).</p>
<p class="nhan">Data → expected result</p>
<p>a = {3, 1, 4, 1, 5, 9, 2, 6} → p = [3, 4, 8, 9, 14, 23, 25, 31]; slow 36 additions, fast 7; sum of a[2..5] = p[5] − p[1] = 23 − 4 = 19.</p>
<p class="nhan">Idea</p>
<table>
<thead><tr><th>i</th><th>a[i]</th><th>p[i] = p[i−1] + a[i]</th></tr></thead>
<tbody>
<tr><td>0</td><td>3</td><td>3 (p[0] = a[0], no addition)</td></tr>
<tr><td>1</td><td>1</td><td>3 + 1 = 4</td></tr>
<tr><td>2</td><td>4</td><td>4 + 4 = 8</td></tr>
<tr><td>3</td><td>1</td><td>8 + 1 = 9</td></tr>
<tr><td>4</td><td>5</td><td>9 + 5 = 14</td></tr>
<tr><td>5</td><td>9</td><td>14 + 9 = 23</td></tr>
<tr><td>6</td><td>2</td><td>23 + 2 = 25</td></tr>
<tr><td>7</td><td>6</td><td>25 + 6 = 31</td></tr>
</tbody>
</table>
<p>The slow version adds 1 + 2 + … + n = n(n + 1)/2 numbers → O(n²); the fast one makes one addition per element → O(n). Afterwards every range sum is one subtraction, p[r] − p[l − 1] (or just p[r] when l = 0): O(1) per query instead of O(n).</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">import java.util.Arrays;

public class Pe4PrefixSum {
    static long additions;

    // O(n^2): recompute every prefix from the start
    static long[] prefixSlow(int[] a) {
        long[] p = new long[a.length];
        for (int i = 0; i &lt; a.length; i++) {
            long s = 0;
            for (int j = 0; j &lt;= i; j++) {
                s += a[j];
                additions++;
            }
            p[i] = s;
        }
        return p;
    }

    // O(n): each prefix = the previous prefix + one element
    static long[] prefixFast(int[] a) {
        long[] p = new long[a.length];
        if (a.length == 0) return p;
        p[0] = a[0];
        for (int i = 1; i &lt; a.length; i++) {
            p[i] = p[i - 1] + a[i];
            additions++;
        }
        return p;
    }

    // Sum of a[l..r] in O(1) once the prefix sums exist
    static long rangeSum(long[] p, int l, int r) { return l == 0 ? p[r] : p[r] - p[l - 1]; }

    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        int[] a = {3, 1, 4, 1, 5, 9, 2, 6};
        additions = 0;
        long[] slow = prefixSlow(a);
        long slowAdds = additions;
        additions = 0;
        long[] fast = prefixFast(a);
        System.out.println("prefix sums of " + Arrays.toString(a) + " = " + Arrays.toString(fast));
        System.out.println("n = 8: slow version " + slowAdds + " additions, fast version " + additions);
        check("both versions give the same prefix sums", Arrays.toString(slow), Arrays.toString(fast));
        check("sum of a[2..5] = 4 + 1 + 5 + 9", String.valueOf(rangeSum(fast, 2, 5)), "19");
        check("sum of the whole array", String.valueOf(rangeSum(fast, 0, 7)), "31");
        int n = 1000;
        int[] big = new int[n];
        for (int i = 0; i &lt; n; i++) big[i] = i % 7 - 3;          // a mix of negative, zero, positive
        additions = 0;
        long[] s2 = prefixSlow(big);
        long slow2 = additions;
        additions = 0;
        long[] f2 = prefixFast(big);
        System.out.println("n = 1000: slow version " + slow2 + " additions, fast version " + additions);
        check("n = 1000: slow = n(n+1)/2, fast = n - 1", slow2 + "/" + additions, "500500/999");
        check("n = 1000: same results", String.valueOf(Arrays.equals(s2, f2)), "true");
        check("empty array: no crash, no sums", Arrays.toString(prefixFast(new int[0])), "[]");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">prefix sums of [3, 1, 4, 1, 5, 9, 2, 6] = [3, 4, 8, 9, 14, 23, 25, 31]<br>
n = 8: slow version 36 additions, fast version 7<br>
PASS both versions give the same prefix sums<br>
PASS sum of a[2..5] = 4 + 1 + 5 + 9<br>
PASS sum of the whole array<br>
n = 1000: slow version 500500 additions, fast version 999<br>
PASS n = 1000: slow = n(n+1)/2, fast = n - 1<br>
PASS n = 1000: same results<br>
PASS empty array: no crash, no sums<br>
ALL TESTS PASSED</div>
<div class="pitfall">The range formula needs the case l = 0 on its own: there is no p[−1], and forgetting it throws <code>ArrayIndexOutOfBoundsException</code>. Keep sums in <code>long</code>: a million <code>int</code> values can overflow an <code>int</code> total.</div>`,
    `<h3>🧪 Bài 4 — Tổng tiền tố: từ O(n²) xuống O(n) (câu phỏng vấn kinh điển · ~10 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Cho <code>int[] a</code>, dựng mảng tổng tiền tố (prefix sum) <code>p</code> với p[i] = a[0] + a[1] + … + a[i]. Viết bản chậm tính lại từng tổng từ a[0], và bản nhanh dùng lại tổng ngay trước; đếm số phép cộng của mỗi bản. Sau đó dùng p để trả lời "tổng a[l..r]" trong O(1).</p>
<p class="nhan">Dữ liệu → kết quả mong đợi</p>
<p>a = {3, 1, 4, 1, 5, 9, 2, 6} → p = [3, 4, 8, 9, 14, 23, 25, 31]; bản chậm 36 phép cộng, bản nhanh 7; tổng a[2..5] = p[5] − p[1] = 23 − 4 = 19.</p>
<p class="nhan">Ý tưởng</p>
<table>
<thead><tr><th>i</th><th>a[i]</th><th>p[i] = p[i−1] + a[i]</th></tr></thead>
<tbody>
<tr><td>0</td><td>3</td><td>3 (p[0] = a[0], không cộng)</td></tr>
<tr><td>1</td><td>1</td><td>3 + 1 = 4</td></tr>
<tr><td>2</td><td>4</td><td>4 + 4 = 8</td></tr>
<tr><td>3</td><td>1</td><td>8 + 1 = 9</td></tr>
<tr><td>4</td><td>5</td><td>9 + 5 = 14</td></tr>
<tr><td>5</td><td>9</td><td>14 + 9 = 23</td></tr>
<tr><td>6</td><td>2</td><td>23 + 2 = 25</td></tr>
<tr><td>7</td><td>6</td><td>25 + 6 = 31</td></tr>
</tbody>
</table>
<p>Bản chậm cộng 1 + 2 + … + n = n(n + 1)/2 số → O(n²); bản nhanh mỗi phần tử một phép cộng → O(n). Có p rồi thì tổng của mọi đoạn chỉ là một phép trừ, p[r] − p[l − 1] (hoặc p[r] khi l = 0): O(1) mỗi truy vấn (query) thay vì O(n).</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">import java.util.Arrays;

public class Pe4PrefixSum {
    static long additions;

    // O(n^2): tính lại mỗi tổng tiền tố từ đầu mảng
    static long[] prefixSlow(int[] a) {
        long[] p = new long[a.length];
        for (int i = 0; i &lt; a.length; i++) {
            long s = 0;
            for (int j = 0; j &lt;= i; j++) {
                s += a[j];
                additions++;
            }
            p[i] = s;
        }
        return p;
    }

    // O(n): mỗi tổng = tổng ngay trước + một phần tử
    static long[] prefixFast(int[] a) {
        long[] p = new long[a.length];
        if (a.length == 0) return p;
        p[0] = a[0];
        for (int i = 1; i &lt; a.length; i++) {
            p[i] = p[i - 1] + a[i];
            additions++;
        }
        return p;
    }

    // Tổng a[l..r] trong O(1) khi đã có tổng tiền tố
    static long rangeSum(long[] p, int l, int r) { return l == 0 ? p[r] : p[r] - p[l - 1]; }

    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        int[] a = {3, 1, 4, 1, 5, 9, 2, 6};
        additions = 0;
        long[] slow = prefixSlow(a);
        long slowAdds = additions;
        additions = 0;
        long[] fast = prefixFast(a);
        System.out.println("prefix sums of " + Arrays.toString(a) + " = " + Arrays.toString(fast));
        System.out.println("n = 8: slow version " + slowAdds + " additions, fast version " + additions);
        check("both versions give the same prefix sums", Arrays.toString(slow), Arrays.toString(fast));
        check("sum of a[2..5] = 4 + 1 + 5 + 9", String.valueOf(rangeSum(fast, 2, 5)), "19");
        check("sum of the whole array", String.valueOf(rangeSum(fast, 0, 7)), "31");
        int n = 1000;
        int[] big = new int[n];
        for (int i = 0; i &lt; n; i++) big[i] = i % 7 - 3;          // lẫn số âm, số 0, số dương
        additions = 0;
        long[] s2 = prefixSlow(big);
        long slow2 = additions;
        additions = 0;
        long[] f2 = prefixFast(big);
        System.out.println("n = 1000: slow version " + slow2 + " additions, fast version " + additions);
        check("n = 1000: slow = n(n+1)/2, fast = n - 1", slow2 + "/" + additions, "500500/999");
        check("n = 1000: same results", String.valueOf(Arrays.equals(s2, f2)), "true");
        check("empty array: no crash, no sums", Arrays.toString(prefixFast(new int[0])), "[]");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">prefix sums of [3, 1, 4, 1, 5, 9, 2, 6] = [3, 4, 8, 9, 14, 23, 25, 31]<br>
n = 8: slow version 36 additions, fast version 7<br>
PASS both versions give the same prefix sums<br>
PASS sum of a[2..5] = 4 + 1 + 5 + 9<br>
PASS sum of the whole array<br>
n = 1000: slow version 500500 additions, fast version 999<br>
PASS n = 1000: slow = n(n+1)/2, fast = n - 1<br>
PASS n = 1000: same results<br>
PASS empty array: no crash, no sums<br>
ALL TESTS PASSED</div>
<div class="pitfall">Công thức tổng đoạn phải tách riêng trường hợp l = 0: không có p[−1], quên là văng <code>ArrayIndexOutOfBoundsException</code> (lỗi chỉ số vượt biên). Hãy giữ tổng bằng <code>long</code>: cộng một triệu số <code>int</code> có thể tràn kiểu <code>int</code>.</div>`),
    bi(`<h3>🧪 Exercise 5 — Find a duplicate three ways: O(n²), O(n log n), O(n) (~15 min)</h3>
<p class="nhan">Task</p>
<p>Write three versions of "does the array contain a value twice?": (1) compare every pair; (2) sort a copy, then compare neighbours; (3) add the values to a <code>HashSet</code> and stop as soon as <code>add</code> returns false. Count the comparisons (for the <code>HashSet</code>: the set operations) on 2,000 and 4,000 different values — no duplicate is the worst case, since nothing stops the search early.</p>
<p class="nhan">Data → expected result</p>
<p>All pairs: n(n − 1)/2 = 1,999,000 and 7,998,000 comparisons. All three versions: true for {1, 2, 3, 2} and {1000, 1000}, false for {5, 4, 3}, the empty array and a single element.</p>
<p class="nhan">Idea</p>
<ul>
<li><strong>All pairs</strong>: n(n − 1)/2 comparisons → O(n²). Doubling n multiplies the work by 4 (1,999,000 → 7,998,000).</li>
<li><strong>Sort + scan</strong>: after sorting, equal values sit side by side; the sort makes about n·log₂ n comparisons and the scan n − 1 → O(n log n). Doubling n a little more than doubles the work (21,381 → 46,770).</li>
<li><strong>HashSet</strong>: each <code>add</code> hashes the value and looks in one bucket — O(1) on average — so n operations → O(n) on average, paid for with the memory of the set.</li>
</ul>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">import java.util.*;

public class Pe5Duplicates {
    static long ops;                                    // comparisons (or set operations) counted

    // 1) Compare every pair: n(n-1)/2 comparisons when there is no duplicate -&gt; O(n^2)
    static boolean dupPairs(int[] a) {
        for (int i = 0; i &lt; a.length; i++)
            for (int j = i + 1; j &lt; a.length; j++) {
                ops++;
                if (a[i] == a[j]) return true;
            }
        return false;
    }

    // 2) Sort a copy, then equal values sit side by side -&gt; O(n log n) + O(n)
    static boolean dupSort(int[] a) {
        Integer[] b = new Integer[a.length];
        for (int i = 0; i &lt; a.length; i++) b[i] = a[i];
        Arrays.sort(b, new Comparator&lt;Integer&gt;() {      // counts every comparison the library sort makes
            public int compare(Integer x, Integer y) { ops++; return Integer.compare(x, y); }
        });
        for (int i = 1; i &lt; b.length; i++) {
            ops++;
            if (b[i].equals(b[i - 1])) return true;     // equals, never == on Integer objects
        }
        return false;
    }

    // 3) HashSet.add returns false when the value is already there -&gt; O(n) on average
    static boolean dupHash(int[] a) {
        HashSet&lt;Integer&gt; seen = new HashSet&lt;Integer&gt;();
        for (int x : a) {
            ops++;                                      // one set operation: hash, then look in one bucket
            if (!seen.add(x)) return true;
        }
        return false;
    }

    static int fails = 0;

    static void check(String name, boolean ok) {
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name);
    }

    static String all3(int[] a) { return dupPairs(a) + "/" + dupSort(a) + "/" + dupHash(a); }

    public static void main(String[] args) {
        System.out.println("   n | all pairs | sort + scan | HashSet   (no duplicate: the worst case)");
        long[] pairs = new long[2];
        int row = 0;
        for (int n : new int[] {2000, 4000}) {
            int[] a = new int[n];
            for (int i = 0; i &lt; n; i++) a[i] = (int) ((i * 7919L) % 10007);   // n different values, not sorted
            ops = 0; dupPairs(a); long p = ops;
            ops = 0; dupSort(a); long s = ops;
            ops = 0; dupHash(a); long h = ops;
            pairs[row++] = p;
            System.out.println(String.format(Locale.US, "%4d | %9d | %11d | %7d", n, p, s, h));
        }
        check("all pairs = n(n-1)/2 when there is no duplicate", pairs[0] == 1999000L &amp;&amp; pairs[1] == 7998000L);
        check("{1, 2, 3, 2} -&gt; true/true/true", all3(new int[] {1, 2, 3, 2}).equals("true/true/true"));
        check("{5, 4, 3} -&gt; false/false/false", all3(new int[] {5, 4, 3}).equals("false/false/false"));
        check("{1000, 1000}: big equal values are caught", all3(new int[] {1000, 1000}).equals("true/true/true"));
        check("empty array and one element -&gt; no duplicate", all3(new int[0]).equals("false/false/false")
                &amp;&amp; all3(new int[] {7}).equals("false/false/false"));
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">&nbsp;&nbsp;&nbsp;n | all pairs | sort + scan | HashSet &nbsp;&nbsp;(no duplicate: the worst case)<br>
2000 | &nbsp;&nbsp;1999000 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;21381 | &nbsp;&nbsp;&nbsp;2000<br>
4000 | &nbsp;&nbsp;7998000 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;46770 | &nbsp;&nbsp;&nbsp;4000<br>
PASS all pairs = n(n-1)/2 when there is no duplicate<br>
PASS {1, 2, 3, 2} -&gt; true/true/true<br>
PASS {5, 4, 3} -&gt; false/false/false<br>
PASS {1000, 1000}: big equal values are caught<br>
PASS empty array and one element -&gt; no duplicate<br>
ALL TESTS PASSED</div>
<div class="pitfall">Never compare two <code>Integer</code> objects with <code>==</code>: it compares references. It happens to work for −128…127, which Java caches, and fails for larger values — the test {1000, 1000} catches exactly that. Use <code>equals</code>, or compare <code>int</code> values.</div>`,
    `<h3>🧪 Bài 5 — Tìm phần tử trùng theo ba cách: O(n²), O(n log n), O(n) (~15 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Viết ba phiên bản của câu hỏi "mảng có giá trị nào xuất hiện hai lần không?": (1) so mọi cặp; (2) sắp một bản sao rồi so các phần tử kề nhau; (3) thêm các giá trị vào một <code>HashSet</code> (tập hợp dùng bảng băm) và dừng ngay khi <code>add</code> trả về false (sai — tức giá trị đã có trong tập). Đếm số phép so sánh (với <code>HashSet</code>: số thao tác trên tập) trên 2.000 và 4.000 giá trị khác nhau — không có phần tử trùng là trường hợp xấu nhất, vì không có gì làm việc tìm dừng sớm.</p>
<p class="nhan">Dữ liệu → kết quả mong đợi</p>
<p>So mọi cặp: n(n − 1)/2 = 1.999.000 và 7.998.000 phép so sánh. Cả ba bản: true với {1, 2, 3, 2} và {1000, 1000}, false với {5, 4, 3}, mảng rỗng và mảng một phần tử.</p>
<p class="nhan">Ý tưởng</p>
<ul>
<li><strong>So mọi cặp</strong>: n(n − 1)/2 phép so sánh → O(n²). Gấp đôi n thì công việc gấp 4 (1.999.000 → 7.998.000).</li>
<li><strong>Sắp xếp + quét</strong>: sau khi sắp, các giá trị bằng nhau nằm cạnh nhau; phép sắp tốn khoảng n·log₂ n phép so sánh, lượt quét thêm n − 1 → O(n log n). Gấp đôi n thì công việc tăng hơn gấp đôi một chút (21.381 → 46.770).</li>
<li><strong>HashSet</strong>: mỗi lần <code>add</code> băm (hash) giá trị rồi xem trong một ô (bucket) — trung bình O(1) — nên n thao tác → O(n) trung bình, đổi lại tốn thêm bộ nhớ cho tập hợp.</li>
</ul>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">import java.util.*;

public class Pe5Duplicates {
    static long ops;                                    // số phép so sánh (hoặc thao tác trên tập) đã đếm

    // 1) So mọi cặp: n(n-1)/2 phép so sánh khi không có trùng -&gt; O(n^2)
    static boolean dupPairs(int[] a) {
        for (int i = 0; i &lt; a.length; i++)
            for (int j = i + 1; j &lt; a.length; j++) {
                ops++;
                if (a[i] == a[j]) return true;
            }
        return false;
    }

    // 2) Sắp một bản sao, giá trị bằng nhau sẽ nằm cạnh nhau -&gt; O(n log n) + O(n)
    static boolean dupSort(int[] a) {
        Integer[] b = new Integer[a.length];
        for (int i = 0; i &lt; a.length; i++) b[i] = a[i];
        Arrays.sort(b, new Comparator&lt;Integer&gt;() {      // đếm mọi phép so sánh mà hàm sort của thư viện thực hiện
            public int compare(Integer x, Integer y) { ops++; return Integer.compare(x, y); }
        });
        for (int i = 1; i &lt; b.length; i++) {
            ops++;
            if (b[i].equals(b[i - 1])) return true;     // dùng equals, không bao giờ dùng == với đối tượng Integer
        }
        return false;
    }

    // 3) HashSet.add trả về false khi giá trị đã có -&gt; O(n) trung bình
    static boolean dupHash(int[] a) {
        HashSet&lt;Integer&gt; seen = new HashSet&lt;Integer&gt;();
        for (int x : a) {
            ops++;                                      // một thao tác trên tập: băm, rồi xem trong một ô
            if (!seen.add(x)) return true;
        }
        return false;
    }

    static int fails = 0;

    static void check(String name, boolean ok) {
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name);
    }

    static String all3(int[] a) { return dupPairs(a) + "/" + dupSort(a) + "/" + dupHash(a); }

    public static void main(String[] args) {
        System.out.println("   n | all pairs | sort + scan | HashSet   (no duplicate: the worst case)");
        long[] pairs = new long[2];
        int row = 0;
        for (int n : new int[] {2000, 4000}) {
            int[] a = new int[n];
            for (int i = 0; i &lt; n; i++) a[i] = (int) ((i * 7919L) % 10007);   // n giá trị khác nhau, chưa sắp
            ops = 0; dupPairs(a); long p = ops;
            ops = 0; dupSort(a); long s = ops;
            ops = 0; dupHash(a); long h = ops;
            pairs[row++] = p;
            System.out.println(String.format(Locale.US, "%4d | %9d | %11d | %7d", n, p, s, h));
        }
        check("all pairs = n(n-1)/2 when there is no duplicate", pairs[0] == 1999000L &amp;&amp; pairs[1] == 7998000L);
        check("{1, 2, 3, 2} -&gt; true/true/true", all3(new int[] {1, 2, 3, 2}).equals("true/true/true"));
        check("{5, 4, 3} -&gt; false/false/false", all3(new int[] {5, 4, 3}).equals("false/false/false"));
        check("{1000, 1000}: big equal values are caught", all3(new int[] {1000, 1000}).equals("true/true/true"));
        check("empty array and one element -&gt; no duplicate", all3(new int[0]).equals("false/false/false")
                &amp;&amp; all3(new int[] {7}).equals("false/false/false"));
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">&nbsp;&nbsp;&nbsp;n | all pairs | sort + scan | HashSet &nbsp;&nbsp;(no duplicate: the worst case)<br>
2000 | &nbsp;&nbsp;1999000 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;21381 | &nbsp;&nbsp;&nbsp;2000<br>
4000 | &nbsp;&nbsp;7998000 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;46770 | &nbsp;&nbsp;&nbsp;4000<br>
PASS all pairs = n(n-1)/2 when there is no duplicate<br>
PASS {1, 2, 3, 2} -&gt; true/true/true<br>
PASS {5, 4, 3} -&gt; false/false/false<br>
PASS {1000, 1000}: big equal values are caught<br>
PASS empty array and one element -&gt; no duplicate<br>
ALL TESTS PASSED</div>
<div class="pitfall">Đừng bao giờ so hai đối tượng <code>Integer</code> bằng <code>==</code>: nó so tham chiếu (reference). Nó tình cờ đúng với −128…127 vì Java lưu sẵn (cache) các giá trị này, và sai với số lớn hơn — test {1000, 1000} bắt đúng lỗi đó. Hãy dùng <code>equals</code>, hoặc so hai giá trị <code>int</code>.</div>`),
    bi(`<h3>🧪 Exercise 6 — A flexible array: grow by k, or double? (amortized analysis · ~15 min)</h3>
<p class="nhan">Task</p>
<p>Write a class <code>FlexArray</code> whose <code>add(x)</code> stores x at the end; when the array is full (count = N) it allocates a bigger array — size N + k, or 2N — and copies every element across. Starting from capacity 1, add m = 1,000 and m = 2,000 elements and count the copies for N + 1, N + 10 and 2N.</p>
<p class="nhan">Data → expected result</p>
<p>N + 1: 1 + 2 + … + 999 = 499,500 copies for m = 1,000. 2N: 1 + 2 + 4 + … + 512 = 1,023 copies — fewer than 2m.</p>
<p class="nhan">Idea</p>
<p>This is the amortized-analysis example of the ComplexityAnalysis deck. With N + k a resize comes every k adds and copies everything, about m²/(2k) copies in total → O(m) per add on average, and doubling m makes the copies about 4 times more. With 2N the resizes come at sizes 1, 2, 4, 8, …, so all copies add up to less than 2m → O(1) amortized per add. The deck's potential-function argument gives an amortized cost of 3 per add; the test checks m writes + copies ≤ 3m.</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">import java.util.Locale;

// A flexible array: when it is full, allocate a bigger one and copy (ComplexityAnalysis deck, amortized cost)
class FlexArray {
    int[] a = new int[1];
    int count = 0;
    long copies = 0;                                   // elements copied during all resizes
    final int k;                                       // k &gt; 0: new size N + k;  k = 0: new size 2N

    FlexArray(int k) { this.k = k; }

    void add(int x) {
        if (count == a.length) {                       // full: count = N
            int[] b = new int[k &gt; 0 ? a.length + k : 2 * a.length];
            for (int i = 0; i &lt; count; i++) {
                b[i] = a[i];
                copies++;
            }
            a = b;
        }
        a[count++] = x;
    }
}

public class Pe6FlexArray {
    static long copiesFor(int k, int m) {
        FlexArray f = new FlexArray(k);
        for (int i = 0; i &lt; m; i++) f.add(i);
        return f.copies;
    }

    static int fails = 0;

    static void check(String name, boolean ok) {
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name);
    }

    public static void main(String[] args) {
        System.out.println("policy | copies, m=1000 | copies, m=2000 | ratio | cost per add, m=2000");
        int[] ks = {1, 10, 0};
        String[] names = {"N + 1 ", "N + 10", "2N    "};
        for (int t = 0; t &lt; 3; t++) {
            long c1 = copiesFor(ks[t], 1000), c2 = copiesFor(ks[t], 2000);
            System.out.println(String.format(Locale.US, "%s | %14d | %14d | %5.2f | %.2f",
                    names[t], c1, c2, (double) c2 / c1, (2000.0 + c2) / 2000));
        }
        check("N + 1: every add after the first copies everything: 1 + 2 + ... + 999", copiesFor(1, 1000) == 499500);
        check("N + 10: copies grow about 4x when m doubles (quadratic)", copiesFor(10, 2000) &gt; 3.9 * copiesFor(10, 1000));
        check("2N: copies = 1 + 2 + 4 + ... + 512 = 1023 &lt; 2m", copiesFor(0, 1000) == 1023);
        check("2N: total cost (m writes + copies) &lt;= 3m, the slide's amortized cost 3",
                1000 + copiesFor(0, 1000) &lt;= 3000 &amp;&amp; 2000 + copiesFor(0, 2000) &lt;= 6000);
        FlexArray f = new FlexArray(0);
        for (int i = 0; i &lt; 100; i++) f.add(i * i);
        boolean kept = f.count == 100;
        for (int i = 0; i &lt; 100; i++) kept &amp;= f.a[i] == i * i;
        check("no element is lost or moved by the resizes", kept);
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">policy | copies, m=1000 | copies, m=2000 | ratio | cost per add, m=2000<br>
N + 1 &nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;499500 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1999000 | &nbsp;4.00 | 1000.50<br>
N + 10 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;49600 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;199200 | &nbsp;4.02 | 100.60<br>
2N &nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1023 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2047 | &nbsp;2.00 | 2.02<br>
PASS N + 1: every add after the first copies everything: 1 + 2 + ... + 999<br>
PASS N + 10: copies grow about 4x when m doubles (quadratic)<br>
PASS 2N: copies = 1 + 2 + 4 + ... + 512 = 1023 &lt; 2m<br>
PASS 2N: total cost (m writes + copies) &lt;= 3m, the slide's amortized cost 3<br>
PASS no element is lost or moved by the resizes<br>
ALL TESTS PASSED</div>
<div class="pitfall">"Grow by 10 each time" looks thrifty but is quadratic overall: the output shows 4 times the copies for twice the data. Growth must be proportional — × 2 here, × 1.5 in Java's <code>ArrayList</code> — to get O(1) amortized. And "amortized O(1)" is an average over the sequence: the one <code>add</code> that triggers a resize still costs O(n).</div>`,
    `<h3>🧪 Bài 6 — Mảng co giãn: nới thêm k ô hay nhân đôi? (phân tích khấu hao · ~15 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Viết lớp <code>FlexArray</code> có <code>add(x)</code> đặt x vào cuối; khi mảng đầy (count = N) thì cấp mảng lớn hơn — cỡ N + k, hoặc 2N — rồi chép toàn bộ phần tử sang. Bắt đầu với sức chứa (capacity) 1, thêm m = 1.000 và m = 2.000 phần tử và đếm số lần chép với ba cách N + 1, N + 10 và 2N.</p>
<p class="nhan">Dữ liệu → kết quả mong đợi</p>
<p>N + 1: 1 + 2 + … + 999 = 499.500 lần chép với m = 1.000. 2N: 1 + 2 + 4 + … + 512 = 1.023 lần chép — ít hơn 2m.</p>
<p class="nhan">Ý tưởng</p>
<p>Đây là ví dụ phân tích khấu hao (amortized analysis) của bộ slide ComplexityAnalysis. Với N + k, cứ k lần thêm lại có một lần nới và chép toàn bộ, tổng cộng khoảng m²/(2k) lần chép → trung bình O(m) mỗi lần thêm, và gấp đôi m thì số lần chép gấp khoảng 4. Với 2N, các lần nới xảy ra ở cỡ 1, 2, 4, 8, …, nên tổng mọi lần chép nhỏ hơn 2m → O(1) khấu hao mỗi lần thêm. Lập luận bằng hàm thế (potential function) trên slide cho chi phí khấu hao là 3 mỗi lần thêm; test kiểm tra m lần ghi + số lần chép ≤ 3m.</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">import java.util.Locale;

// Mảng co giãn: đầy thì cấp mảng lớn hơn rồi chép sang (bộ slide ComplexityAnalysis, chi phí khấu hao)
class FlexArray {
    int[] a = new int[1];
    int count = 0;
    long copies = 0;                                   // số phần tử đã chép qua mọi lần nới
    final int k;                                       // k &gt; 0: cỡ mới N + k;  k = 0: cỡ mới 2N

    FlexArray(int k) { this.k = k; }

    void add(int x) {
        if (count == a.length) {                       // đầy: count = N
            int[] b = new int[k &gt; 0 ? a.length + k : 2 * a.length];
            for (int i = 0; i &lt; count; i++) {
                b[i] = a[i];
                copies++;
            }
            a = b;
        }
        a[count++] = x;
    }
}

public class Pe6FlexArray {
    static long copiesFor(int k, int m) {
        FlexArray f = new FlexArray(k);
        for (int i = 0; i &lt; m; i++) f.add(i);
        return f.copies;
    }

    static int fails = 0;

    static void check(String name, boolean ok) {
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name);
    }

    public static void main(String[] args) {
        System.out.println("policy | copies, m=1000 | copies, m=2000 | ratio | cost per add, m=2000");
        int[] ks = {1, 10, 0};
        String[] names = {"N + 1 ", "N + 10", "2N    "};
        for (int t = 0; t &lt; 3; t++) {
            long c1 = copiesFor(ks[t], 1000), c2 = copiesFor(ks[t], 2000);
            System.out.println(String.format(Locale.US, "%s | %14d | %14d | %5.2f | %.2f",
                    names[t], c1, c2, (double) c2 / c1, (2000.0 + c2) / 2000));
        }
        check("N + 1: every add after the first copies everything: 1 + 2 + ... + 999", copiesFor(1, 1000) == 499500);
        check("N + 10: copies grow about 4x when m doubles (quadratic)", copiesFor(10, 2000) &gt; 3.9 * copiesFor(10, 1000));
        check("2N: copies = 1 + 2 + 4 + ... + 512 = 1023 &lt; 2m", copiesFor(0, 1000) == 1023);
        check("2N: total cost (m writes + copies) &lt;= 3m, the slide's amortized cost 3",
                1000 + copiesFor(0, 1000) &lt;= 3000 &amp;&amp; 2000 + copiesFor(0, 2000) &lt;= 6000);
        FlexArray f = new FlexArray(0);
        for (int i = 0; i &lt; 100; i++) f.add(i * i);
        boolean kept = f.count == 100;
        for (int i = 0; i &lt; 100; i++) kept &amp;= f.a[i] == i * i;
        check("no element is lost or moved by the resizes", kept);
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">policy | copies, m=1000 | copies, m=2000 | ratio | cost per add, m=2000<br>
N + 1 &nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;499500 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1999000 | &nbsp;4.00 | 1000.50<br>
N + 10 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;49600 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;199200 | &nbsp;4.02 | 100.60<br>
2N &nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1023 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2047 | &nbsp;2.00 | 2.02<br>
PASS N + 1: every add after the first copies everything: 1 + 2 + ... + 999<br>
PASS N + 10: copies grow about 4x when m doubles (quadratic)<br>
PASS 2N: copies = 1 + 2 + 4 + ... + 512 = 1023 &lt; 2m<br>
PASS 2N: total cost (m writes + copies) &lt;= 3m, the slide's amortized cost 3<br>
PASS no element is lost or moved by the resizes<br>
ALL TESTS PASSED</div>
<div class="pitfall">"Mỗi lần nới thêm 10 ô" nghe có vẻ tiết kiệm nhưng tổng thể là bậc hai: output (kết quả in ra) cho thấy dữ liệu gấp đôi thì số lần chép gấp 4. Phải nới theo tỉ lệ — × 2 ở đây, × 1,5 trong <code>ArrayList</code> của Java — mới được O(1) khấu hao. Và "O(1) khấu hao" là trung bình trên cả chuỗi thao tác: đúng lần <code>add</code> gây ra việc nới mảng vẫn tốn O(n).</div>`),
    bi(`<h3>🧪 Exercise 7 — CarList: f1–f4 on a Collection of cars (PE style · ~25 min)</h3>
<p class="nhan">Task</p>
<p>The skeleton gives <code>Car(owner, price)</code> and a <code>CarList</code> stored in an array (the Collection ADT of lesson 0.B) with <code>addLast</code> and <code>traverse</code>. Write the four methods; each one stores its number of comparisons in the field <code>steps</code>.</p>
<ul>
<li><strong>f1</strong> <code>f1MaxPrice()</code> — the <em>first</em> car with the highest price, or <code>null</code> for an empty list.</li>
<li><strong>f2</strong> <code>f2CountInRange(lo, hi)</code> — how many cars have lo ≤ price ≤ hi.</li>
<li><strong>f3</strong> <code>f3SortByPrice()</code> — ascending by price; cars with the same price keep their order.</li>
<li><strong>f4</strong> <code>f4FindPrice(price)</code> — binary search on the sorted list: an index, or −1.</li>
</ul>
<p class="nhan">Data → expected result</p>
<p>Hoa 25, Nam 12, Lan 40, Minh 18, Tuan 33, An 7, Binh 40 → f1 = (Lan,40) after 6 comparisons; f2(15, 35) = 3; f3 = (An,7) (Nam,12) (Minh,18) (Hoa,25) (Tuan,33) (Lan,40) (Binh,40); f4(33) = 4; f4(20) = −1 after 3 probes.</p>
<p class="nhan">Idea</p>
<p>f1 is Exercise 1 on objects — strict <code>&gt;</code> keeps the first maximum — O(n). f2 is one pass, O(n). f3 is insertion sort, O(n²) in the worst case, and stable because the inner loop stops at <code>&lt;=</code>. f4 is Exercise 3, O(log n) — valid only after f3.</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">import java.util.Arrays;

class Car {
    String owner;
    int price;

    Car(String owner, int price) { this.owner = owner; this.price = price; }
    public String toString() { return "(" + owner + "," + price + ")"; }
}

class CarList {                                        // the Collection ADT of lesson 0.B, holding Car objects
    Car[] a = new Car[2];
    int n = 0, steps;                                  // steps = comparisons made by the last f-call

    void addLast(String owner, int price) {
        if (n == a.length) a = Arrays.copyOf(a, 2 * a.length);
        a[n++] = new Car(owner, price);
    }

    Car f1MaxPrice() {                                 // the FIRST car with the highest price, n - 1 comparisons
        steps = 0;
        if (n == 0) return null;
        Car best = a[0];
        for (int i = 1; i &lt; n; i++) { steps++; if (a[i].price &gt; best.price) best = a[i]; }
        return best;
    }

    int f2CountInRange(int lo, int hi) {               // cars with lo &lt;= price &lt;= hi, one pass: O(n)
        steps = 0;
        int c = 0;
        for (int i = 0; i &lt; n; i++) { steps++; if (a[i].price &gt;= lo &amp;&amp; a[i].price &lt;= hi) c++; }
        return c;
    }

    void f3SortByPrice() {                             // insertion sort, ascending, stable: O(n^2)
        steps = 0;
        for (int i = 1; i &lt; n; i++) {
            Car x = a[i];
            int j = i - 1;
            while (j &gt;= 0) {
                steps++;
                if (a[j].price &lt;= x.price) break;      // &lt;= keeps equal prices in their order
                a[j + 1] = a[j];
                j--;
            }
            a[j + 1] = x;
        }
    }

    int f4FindPrice(int price) {                       // binary search on the SORTED list: O(log n)
        steps = 0;
        int left = 0, right = n - 1;
        while (left &lt;= right) {
            int mid = left + (right - left) / 2;
            steps++;
            if (a[mid].price == price) return mid;
            if (price &gt; a[mid].price) left = mid + 1; else right = mid - 1;
        }
        return -1;
    }

    String traverse() {
        StringBuilder s = new StringBuilder();
        for (int i = 0; i &lt; n; i++) s.append(a[i]).append(' ');
        return s.toString().trim();
    }
}

public class Pe7CarShop {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        CarList t = new CarList();
        check("f1 on an empty list returns null", String.valueOf(t.f1MaxPrice()), "null");
        String[] owners = {"Hoa", "Nam", "Lan", "Minh", "Tuan", "An", "Binh"};
        int[] prices = {25, 12, 40, 18, 33, 7, 40};
        for (int i = 0; i &lt; owners.length; i++) t.addLast(owners[i], prices[i]);
        System.out.println("data: " + t.traverse());
        check("f1: first of the two 40s, in n - 1 = 6 comparisons", t.f1MaxPrice() + " " + t.steps, "(Lan,40) 6");
        check("f2: prices in [15, 35], one pass of 7", t.f2CountInRange(15, 35) + " " + t.steps, "3 7");
        t.f3SortByPrice();
        System.out.println("f3 used " + t.steps + " comparisons");
        check("f3: ascending, and Lan stays before Binh (stable)", t.traverse(),
                "(An,7) (Nam,12) (Minh,18) (Hoa,25) (Tuan,33) (Lan,40) (Binh,40)");
        check("f4: price 33 is at index 4", String.valueOf(t.f4FindPrice(33)), "4");
        check("f4: price 20 is missing, found out in 3 probes", t.f4FindPrice(20) + " " + t.steps, "-1 3");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS f1 on an empty list returns null<br>
data: (Hoa,25) (Nam,12) (Lan,40) (Minh,18) (Tuan,33) (An,7) (Binh,40)<br>
PASS f1: first of the two 40s, in n - 1 = 6 comparisons<br>
PASS f2: prices in [15, 35], one pass of 7<br>
f3 used 13 comparisons<br>
PASS f3: ascending, and Lan stays before Binh (stable)<br>
PASS f4: price 33 is at index 4<br>
PASS f4: price 20 is missing, found out in 3 probes<br>
ALL TESTS PASSED</div>
<div class="pitfall">Calling f4 before f3 runs binary search on unsorted data: it returns wrong answers without any error. And writing <code>&gt;=</code> in f1 returns (Binh,40), the <em>last</em> maximum — the word "first" in a PE task is there to test exactly that.</div>`,
    `<h3>🧪 Bài 7 — CarList: f1–f4 trên một tập hợp xe (kiểu PE · ~25 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Bộ khung cho sẵn lớp <code>Car(owner, price)</code> và lớp <code>CarList</code> lưu bằng mảng (chính ADT Collection — kiểu dữ liệu trừu tượng "tập hợp" — của bài 0.B) có <code>addLast</code> và <code>traverse</code>. Viết bốn hàm; hàm nào cũng ghi số phép so sánh của nó vào trường <code>steps</code>.</p>
<ul>
<li><strong>f1</strong> <code>f1MaxPrice()</code> — xe <em>đầu tiên</em> có giá cao nhất, hoặc <code>null</code> nếu danh sách rỗng.</li>
<li><strong>f2</strong> <code>f2CountInRange(lo, hi)</code> — có bao nhiêu xe có lo ≤ price ≤ hi.</li>
<li><strong>f3</strong> <code>f3SortByPrice()</code> — sắp tăng dần theo giá; các xe cùng giá giữ nguyên thứ tự.</li>
<li><strong>f4</strong> <code>f4FindPrice(price)</code> — tìm nhị phân (binary search) trên danh sách đã sắp: trả về chỉ số, hoặc −1.</li>
</ul>
<p class="nhan">Dữ liệu → kết quả mong đợi</p>
<p>Hoa 25, Nam 12, Lan 40, Minh 18, Tuan 33, An 7, Binh 40 → f1 = (Lan,40) sau 6 phép so sánh; f2(15, 35) = 3; f3 = (An,7) (Nam,12) (Minh,18) (Hoa,25) (Tuan,33) (Lan,40) (Binh,40); f4(33) = 4; f4(20) = −1 sau 3 lần dò.</p>
<p class="nhan">Ý tưởng</p>
<p>f1 là Bài 1 áp lên đối tượng — dùng <code>&gt;</code> để giữ max đầu tiên — O(n). f2 là một lượt duyệt, O(n). f3 là sắp xếp chèn (insertion sort), O(n²) trong trường hợp xấu nhất, và ổn định (stable) vì vòng trong dừng ở <code>&lt;=</code>. f4 là Bài 3, O(log n) — chỉ đúng khi đã chạy f3.</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">import java.util.Arrays;

class Car {
    String owner;
    int price;

    Car(String owner, int price) { this.owner = owner; this.price = price; }
    public String toString() { return "(" + owner + "," + price + ")"; }
}

class CarList {                                        // ADT Collection của bài 0.B, chứa đối tượng Car
    Car[] a = new Car[2];
    int n = 0, steps;                                  // steps = số phép so sánh của lần gọi f gần nhất

    void addLast(String owner, int price) {
        if (n == a.length) a = Arrays.copyOf(a, 2 * a.length);
        a[n++] = new Car(owner, price);
    }

    Car f1MaxPrice() {                                 // xe ĐẦU TIÊN có giá cao nhất, n - 1 phép so sánh
        steps = 0;
        if (n == 0) return null;
        Car best = a[0];
        for (int i = 1; i &lt; n; i++) { steps++; if (a[i].price &gt; best.price) best = a[i]; }
        return best;
    }

    int f2CountInRange(int lo, int hi) {               // số xe có lo &lt;= price &lt;= hi, một lượt: O(n)
        steps = 0;
        int c = 0;
        for (int i = 0; i &lt; n; i++) { steps++; if (a[i].price &gt;= lo &amp;&amp; a[i].price &lt;= hi) c++; }
        return c;
    }

    void f3SortByPrice() {                             // sắp xếp chèn, tăng dần, ổn định: O(n^2)
        steps = 0;
        for (int i = 1; i &lt; n; i++) {
            Car x = a[i];
            int j = i - 1;
            while (j &gt;= 0) {
                steps++;
                if (a[j].price &lt;= x.price) break;      // &lt;= giữ nguyên thứ tự các xe cùng giá
                a[j + 1] = a[j];
                j--;
            }
            a[j + 1] = x;
        }
    }

    int f4FindPrice(int price) {                       // tìm nhị phân trên danh sách ĐÃ SẮP: O(log n)
        steps = 0;
        int left = 0, right = n - 1;
        while (left &lt;= right) {
            int mid = left + (right - left) / 2;
            steps++;
            if (a[mid].price == price) return mid;
            if (price &gt; a[mid].price) left = mid + 1; else right = mid - 1;
        }
        return -1;
    }

    String traverse() {
        StringBuilder s = new StringBuilder();
        for (int i = 0; i &lt; n; i++) s.append(a[i]).append(' ');
        return s.toString().trim();
    }
}

public class Pe7CarShop {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        CarList t = new CarList();
        check("f1 on an empty list returns null", String.valueOf(t.f1MaxPrice()), "null");
        String[] owners = {"Hoa", "Nam", "Lan", "Minh", "Tuan", "An", "Binh"};
        int[] prices = {25, 12, 40, 18, 33, 7, 40};
        for (int i = 0; i &lt; owners.length; i++) t.addLast(owners[i], prices[i]);
        System.out.println("data: " + t.traverse());
        check("f1: first of the two 40s, in n - 1 = 6 comparisons", t.f1MaxPrice() + " " + t.steps, "(Lan,40) 6");
        check("f2: prices in [15, 35], one pass of 7", t.f2CountInRange(15, 35) + " " + t.steps, "3 7");
        t.f3SortByPrice();
        System.out.println("f3 used " + t.steps + " comparisons");
        check("f3: ascending, and Lan stays before Binh (stable)", t.traverse(),
                "(An,7) (Nam,12) (Minh,18) (Hoa,25) (Tuan,33) (Lan,40) (Binh,40)");
        check("f4: price 33 is at index 4", String.valueOf(t.f4FindPrice(33)), "4");
        check("f4: price 20 is missing, found out in 3 probes", t.f4FindPrice(20) + " " + t.steps, "-1 3");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS f1 on an empty list returns null<br>
data: (Hoa,25) (Nam,12) (Lan,40) (Minh,18) (Tuan,33) (An,7) (Binh,40)<br>
PASS f1: first of the two 40s, in n - 1 = 6 comparisons<br>
PASS f2: prices in [15, 35], one pass of 7<br>
f3 used 13 comparisons<br>
PASS f3: ascending, and Lan stays before Binh (stable)<br>
PASS f4: price 33 is at index 4<br>
PASS f4: price 20 is missing, found out in 3 probes<br>
ALL TESTS PASSED</div>
<div class="pitfall">Gọi f4 trước f3 là tìm nhị phân trên dữ liệu chưa sắp: kết quả sai mà không có lỗi nào. Còn viết <code>&gt;=</code> ở f1 sẽ trả (Binh,40), tức max <em>cuối cùng</em> — chữ "đầu tiên" (first) trong đề PE (thi thực hành) được đặt ra để kiểm tra đúng chỗ này.</div>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>data structure</strong></td><td>cấu trúc dữ liệu</td><td>A way of storing and organising data — the items and their relationships — so that it can be used efficiently.</td></tr>
<tr><td><strong>algorithm</strong></td><td>giải thuật, thuật toán</td><td>A finite sequence of unambiguous steps that solves a problem.</td></tr>
<tr><td><strong>abstract data type (ADT)</strong></td><td>kiểu dữ liệu trừu tượng</td><td>What a type can do — its values and operations — independent of how it is stored.</td></tr>
<tr><td><strong>pseudocode</strong></td><td>mã giả</td><td>Program-like steps written for people, not for a compiler; <code>x := a</code> is an assignment.</td></tr>
<tr><td><strong>flowchart</strong></td><td>lưu đồ</td><td>A diagram of an algorithm: boxes for steps and decisions, arrows for their order.</td></tr>
<tr><td><strong>finiteness</strong></td><td>tính dừng (tính hữu hạn)</td><td>The algorithm stops after a finite number of steps.</td></tr>
<tr><td><strong>definiteness</strong></td><td>tính xác định</td><td>Every step has exactly one meaning.</td></tr>
<tr><td><strong>effectiveness</strong></td><td>tính hiệu quả (thực hiện được)</td><td>Every step is basic enough to be carried out in finite time with the given inputs.</td></tr>
<tr><td><strong>generality</strong></td><td>tính tổng quát</td><td>The algorithm works for a whole class of inputs, not for one example.</td></tr>
<tr><td><strong>primitive operation</strong></td><td>phép toán cơ bản</td><td>One elementary step — a comparison, an assignment, an arithmetic operation — counted as one unit of time.</td></tr>
<tr><td><strong>input size (n)</strong></td><td>kích thước đầu vào</td><td>The quantity running time is expressed in, such as the number of elements.</td></tr>
<tr><td><strong>time complexity</strong></td><td>độ phức tạp thời gian</td><td>The number of primitive operations, as a function of the input size.</td></tr>
<tr><td><strong>space complexity</strong></td><td>độ phức tạp không gian (bộ nhớ)</td><td>The extra memory an algorithm needs, as a function of the input size.</td></tr>
<tr><td><strong>best / worst / average case</strong></td><td>trường hợp tốt nhất / xấu nhất / trung bình</td><td>The fewest, the most and the typical number of operations over all inputs of size n.</td></tr>
<tr><td><strong>Big-O notation</strong></td><td>ký hiệu O lớn</td><td>An upper bound on growth: f(n) is O(g(n)) if f(n) ≤ c·g(n) for some constant c and all large enough n.</td></tr>
<tr><td><strong>Big-Omega / Big-Theta</strong></td><td>Omega lớn / Theta lớn (chặn dưới / chặn chặt)</td><td>Ω is a lower bound; Θ means both O and Ω — the exact growth rate.</td></tr>
<tr><td><strong>asymptotic</strong></td><td>tiệm cận</td><td>About the behaviour as n grows very large, ignoring constant factors and smaller terms.</td></tr>
<tr><td><strong>logarithm, log₂ n</strong></td><td>lôgarit cơ số 2</td><td>How many times n can be halved before reaching 1: log₂ 1024 = 10.</td></tr>
<tr><td><strong>linear (sequential) search</strong></td><td>tìm kiếm tuần tự</td><td>Look at the elements one by one: 1 to n comparisons, O(n).</td></tr>
<tr><td><strong>binary search</strong></td><td>tìm kiếm nhị phân</td><td>On sorted data, compare with the middle element and keep one half: O(log n).</td></tr>
<tr><td><strong>amortized cost</strong></td><td>chi phí khấu hao</td><td>The average cost per operation over a worst-case sequence of operations.</td></tr>
<tr><td><strong>NP-complete</strong></td><td>NP-đầy đủ</td><td>A problem in NP to which every problem in NP reduces; no polynomial-time algorithm is known for any of them.</td></tr>
<tr><td><strong>reduction (<code>A &lt; B</code>)</strong></td><td>phép quy dẫn</td><td>Solving A with a small number of calls to a solver for B, so A is "easier than" B.</td></tr>
<tr><td><strong>naming convention (camelCase)</strong></td><td>quy ước đặt tên (kiểu lạc đà)</td><td>Classes start with a capital letter, variables and methods with a small one, and every later word is capitalised.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>data structure</strong></td><td>cấu trúc dữ liệu</td><td>Cách lưu và tổ chức dữ liệu — các phần tử và quan hệ giữa chúng — để dùng hiệu quả.</td></tr>
<tr><td><strong>algorithm</strong></td><td>giải thuật, thuật toán</td><td>Một dãy hữu hạn các bước rõ ràng, không mơ hồ, để giải một bài toán.</td></tr>
<tr><td><strong>abstract data type (ADT)</strong></td><td>kiểu dữ liệu trừu tượng</td><td>Kiểu dữ liệu làm được gì — tập giá trị và thao tác — không phụ thuộc cách lưu trữ.</td></tr>
<tr><td><strong>pseudocode</strong></td><td>mã giả</td><td>Các bước viết giống câu lệnh nhưng dành cho người đọc, không cho trình biên dịch; <code>x := a</code> là phép gán.</td></tr>
<tr><td><strong>flowchart</strong></td><td>lưu đồ</td><td>Sơ đồ của giải thuật: các hộp cho bước xử lý và quyết định, mũi tên cho thứ tự.</td></tr>
<tr><td><strong>finiteness</strong></td><td>tính dừng (tính hữu hạn)</td><td>Giải thuật dừng sau một số hữu hạn bước.</td></tr>
<tr><td><strong>definiteness</strong></td><td>tính xác định</td><td>Mỗi bước chỉ có đúng một cách hiểu.</td></tr>
<tr><td><strong>effectiveness</strong></td><td>tính hiệu quả (thực hiện được)</td><td>Mỗi bước đủ cơ bản để làm xong trong thời gian hữu hạn với đầu vào đã cho.</td></tr>
<tr><td><strong>generality</strong></td><td>tính tổng quát</td><td>Giải thuật đúng với cả một lớp đầu vào, không chỉ một ví dụ.</td></tr>
<tr><td><strong>primitive operation</strong></td><td>phép toán cơ bản</td><td>Một bước sơ cấp — so sánh, gán, phép tính số học — được tính là một đơn vị thời gian.</td></tr>
<tr><td><strong>input size (n)</strong></td><td>kích thước đầu vào</td><td>Đại lượng dùng để biểu diễn thời gian chạy, ví dụ số phần tử.</td></tr>
<tr><td><strong>time complexity</strong></td><td>độ phức tạp thời gian</td><td>Số phép toán cơ bản, viết thành hàm theo kích thước đầu vào.</td></tr>
<tr><td><strong>space complexity</strong></td><td>độ phức tạp không gian (bộ nhớ)</td><td>Lượng bộ nhớ thêm mà giải thuật cần, viết theo kích thước đầu vào.</td></tr>
<tr><td><strong>best / worst / average case</strong></td><td>trường hợp tốt nhất / xấu nhất / trung bình</td><td>Số phép toán ít nhất, nhiều nhất và điển hình trên mọi đầu vào cỡ n.</td></tr>
<tr><td><strong>Big-O notation</strong></td><td>ký hiệu O lớn</td><td>Chặn trên của tốc độ tăng: f(n) là O(g(n)) nếu f(n) ≤ c·g(n) với một hằng số c nào đó và mọi n đủ lớn.</td></tr>
<tr><td><strong>Big-Omega / Big-Theta</strong></td><td>Omega lớn / Theta lớn (chặn dưới / chặn chặt)</td><td>Ω là chặn dưới; Θ nghĩa là vừa O vừa Ω — tốc độ tăng chính xác.</td></tr>
<tr><td><strong>asymptotic</strong></td><td>tiệm cận</td><td>Nói về hành vi khi n rất lớn, bỏ qua hằng số nhân và các số hạng nhỏ hơn.</td></tr>
<tr><td><strong>logarithm, log₂ n</strong></td><td>lôgarit cơ số 2</td><td>Số lần chia đôi n cho tới khi còn 1: log₂ 1024 = 10.</td></tr>
<tr><td><strong>linear (sequential) search</strong></td><td>tìm kiếm tuần tự</td><td>Xem lần lượt từng phần tử: từ 1 tới n phép so sánh, O(n).</td></tr>
<tr><td><strong>binary search</strong></td><td>tìm kiếm nhị phân</td><td>Trên dữ liệu đã sắp, so với phần tử giữa rồi giữ lại một nửa: O(log n).</td></tr>
<tr><td><strong>amortized cost</strong></td><td>chi phí khấu hao</td><td>Chi phí trung bình mỗi thao tác, tính trên một chuỗi thao tác xấu nhất.</td></tr>
<tr><td><strong>NP-complete</strong></td><td>NP-đầy đủ</td><td>Bài toán thuộc NP mà mọi bài toán NP đều quy dẫn về được; chưa ai tìm ra giải thuật thời gian đa thức cho bài nào trong số đó.</td></tr>
<tr><td><strong>reduction (<code>A &lt; B</code>)</strong></td><td>phép quy dẫn</td><td>Giải A bằng một số ít lần gọi bộ giải của B, nên A "dễ hơn" B.</td></tr>
<tr><td><strong>naming convention (camelCase)</strong></td><td>quy ước đặt tên (kiểu lạc đà)</td><td>Lớp bắt đầu bằng chữ hoa, biến và hàm bằng chữ thường, và mỗi từ phía sau viết hoa chữ cái đầu.</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Summary — 8 things to remember from Section 0</h2>
<ol>
<li><strong>Passing CSD201</strong>: TS = 0.2·AS + 0.2·PT + 0.3·PE + 0.3·FE, with every component above 0, FE ≥ 4, TS ≥ 5 and at least 80% attendance. Write Java 8-compatible code, follow the naming conventions, never hand in work that is not yours.</li>
<li>A <strong>data structure</strong> organises data — the items and their relationships — so that operations are efficient; an <strong>algorithm</strong> is a finite sequence of unambiguous steps. Algorithms + Data Structures = Programs (Wirth).</li>
<li>Six <strong>properties</strong> of an algorithm: input (zero or more), output (at least one), finiteness, definiteness, effectiveness, generality.</li>
<li>Four <strong>representations</strong>: natural language, a programming language, pseudocode (<code>:=</code> assigns, <code>=</code> compares) and flowcharts.</li>
<li><strong>Measure by counting</strong>, not by the clock: running time depends on the machine, the language and the state of the data, so we count primitive operations as a function of the input size n.</li>
<li><strong>Best, worst, average case</strong>: linear search makes 1 to n comparisons; the worst case is the usual guarantee.</li>
<li><strong>Big-O</strong> keeps the dominant term and drops constants: n(n − 1)/2 → O(n²), n/2 → O(n), 100 → O(1). Doubling test: × 2 → O(n), × 4 → O(n²), + 1 → O(log n). Big-O is an upper bound, so an O(n) algorithm is also O(n²) — but the tight bound is the useful answer.</li>
<li><strong>The structure makes the algorithm</strong>: a sorted array allows binary search, O(log n) instead of O(n); a hash set finds duplicates in O(n) on average; doubling a flexible array makes <code>add</code> O(1) amortized, while growing by a constant k makes it O(n) per add on average.</li>
</ol>
<h3>✅ Check yourself before Chapter 1</h3>
<ol>
<li>How many times does <code>count++</code> run in <code>for (i = 1; i &lt; n; i *= 2) for (j = 0; j &lt; n; j++) count++;</code> when n = 16? What is the Big-O?</li>
<li>Why can binary search not be used on {5, 1, 4, 2}?</li>
<li>Linear search in 1,000 elements: the best and the worst number of comparisons?</li>
<li>True or false: 3n² + 100n + 7 is O(n²); it is also O(n³).</li>
<li><code>ArrayList</code> grows its hidden array by about 1.5 times when it is full. What is the amortized cost of <code>add</code> at the end?</li>
</ol>
<p class="dap-an">✅ <strong>Answers:</strong> (1) the outer loop runs for i = 1, 2, 4, 8 — 4 times — and the inner one 16 times each: 64 = n·log₂ n → O(n log n). (2) It is not sorted; binary search would discard the wrong half. (3) 1 (the key is first) and 1,000 (the key is last or missing). (4) Both true: Big-O is an upper bound; O(n²) is the tight, useful answer. (5) O(1) amortized, because the growth is proportional — the total copying stays below a constant times the number of adds.</p>
<h3>⏱ Complexity table</h3>
<table>
<thead><tr><th>Algorithm</th><th>Big-O (worst case unless noted)</th><th>The count behind it</th></tr></thead>
<tbody>
<tr><td>arrayMax, n elements</td><td>O(n) — the best case too</td><td>exactly n − 1 comparisons</td></tr>
<tr><td>linear search</td><td>O(n); best case O(1)</td><td>1 … n comparisons</td></tr>
<tr><td>binary search (sorted array)</td><td>O(log n)</td><td>at most ⌊log₂ n⌋ + 1 probes — 20 for 10⁶</td></tr>
<tr><td>max(a, b, c)</td><td>O(1)</td><td>always 2 comparisons</td></tr>
<tr><td>Euclid's gcd(a, b)</td><td>O(log min(a, b))</td><td>the numbers at least halve every two rounds</td></tr>
<tr><td>prime test up to √n</td><td>O(√n)</td><td>at most ⌊√n⌋ − 1 divisions — 999 for 1,000,003</td></tr>
<tr><td>duplicates — all pairs</td><td>O(n²)</td><td>n(n − 1)/2 comparisons</td></tr>
<tr><td>duplicates — sort + scan</td><td>O(n log n)</td><td>about n·log₂ n for the sort, n − 1 for the scan</td></tr>
<tr><td>duplicates — <code>HashSet</code></td><td>O(n) on average</td><td>n set operations</td></tr>
<tr><td>prefix sums — recompute / reuse</td><td>O(n²) / O(n)</td><td>n(n + 1)/2 / n − 1 additions</td></tr>
<tr><td>range sum with prefix sums</td><td>O(1) per query</td><td>p[r] − p[l − 1]</td></tr>
<tr><td>flexible array <code>add</code> — N + k / 2N</td><td>O(n) / O(1), both amortized per add</td><td>about m²/(2k) / fewer than 2m copies for m adds</td></tr>
<tr><td>insertion sort</td><td>O(n²); O(n) if already sorted</td><td>up to n(n − 1)/2 comparisons</td></tr>
</tbody>
</table>`,
    `<h2>📌 Tóm tắt — 8 điều cần nhớ của Mục 0</h2>
<ol>
<li><strong>Qua môn CSD201</strong>: TS (điểm tổng kết) = 0.2·AS + 0.2·PT + 0.3·PE + 0.3·FE (bài tập lớn, kiểm tra tiến độ, thi thực hành, thi cuối kỳ), mọi cột phải lớn hơn 0, FE ≥ 4, TS ≥ 5 và đi học ít nhất 80% số buổi. Viết code tương thích Java 8, theo đúng quy ước đặt tên (naming convention), không bao giờ nộp bài không phải của mình.</li>
<li><strong>Cấu trúc dữ liệu (data structure)</strong> tổ chức dữ liệu — các phần tử và quan hệ giữa chúng — để các thao tác hiệu quả; <strong>giải thuật (algorithm)</strong> là một dãy hữu hạn các bước không mơ hồ. Giải thuật + Cấu trúc dữ liệu = Chương trình (Wirth).</li>
<li>Sáu <strong>tính chất</strong> của giải thuật: đầu vào (input — không hoặc nhiều), đầu ra (output — ít nhất một), tính dừng (finiteness), tính xác định (definiteness), tính hiệu quả/thực hiện được (effectiveness), tính tổng quát (generality).</li>
<li>Bốn <strong>cách biểu diễn</strong>: ngôn ngữ tự nhiên, ngôn ngữ lập trình, mã giả (pseudocode — <code>:=</code> là gán, <code>=</code> là so sánh) và lưu đồ (flowchart).</li>
<li><strong>Đo bằng cách đếm</strong>, không bằng đồng hồ: thời gian chạy phụ thuộc máy, ngôn ngữ và trạng thái dữ liệu, nên ta đếm số phép toán cơ bản (primitive operation) theo kích thước đầu vào n.</li>
<li><strong>Trường hợp tốt nhất, xấu nhất, trung bình</strong> (best, worst, average case): tìm tuần tự tốn từ 1 tới n phép so sánh; trường hợp xấu nhất là thứ thường dùng để cam kết.</li>
<li><strong>Big-O</strong> (ký hiệu O lớn) giữ số hạng trội và bỏ hằng số: n(n − 1)/2 → O(n²), n/2 → O(n), 100 → O(1). Phép thử nhân đôi: × 2 → O(n), × 4 → O(n²), + 1 → O(log n). Big-O là chặn trên (upper bound), nên giải thuật O(n) cũng là O(n²) — nhưng chặn sát mới là câu trả lời có ích.</li>
<li><strong>Cấu trúc quyết định giải thuật</strong>: mảng đã sắp cho phép tìm nhị phân, O(log n) thay vì O(n); tập băm (hash set) tìm phần tử trùng trong O(n) trung bình; nhân đôi mảng co giãn làm <code>add</code> thành O(1) khấu hao (amortized), còn nới thêm một hằng số k ô thì trung bình mỗi lần <code>add</code> tốn O(n).</li>
</ol>
<h3>✅ Tự kiểm tra trước khi vào Chương 1</h3>
<ol>
<li>Lệnh <code>count++</code> trong <code>for (i = 1; i &lt; n; i *= 2) for (j = 0; j &lt; n; j++) count++;</code> chạy bao nhiêu lần khi n = 16? Big-O là gì?</li>
<li>Vì sao không dùng được tìm nhị phân trên {5, 1, 4, 2}?</li>
<li>Tìm tuần tự trong 1.000 phần tử: số phép so sánh ít nhất và nhiều nhất là bao nhiêu?</li>
<li>Đúng hay sai: 3n² + 100n + 7 là O(n²); nó cũng là O(n³).</li>
<li><code>ArrayList</code> nới mảng ẩn khoảng 1,5 lần mỗi khi đầy. Chi phí khấu hao của <code>add</code> vào cuối là bao nhiêu?</li>
</ol>
<p class="dap-an">✅ <strong>Đáp án:</strong> (1) vòng ngoài chạy với i = 1, 2, 4, 8 — 4 lần — mỗi lần vòng trong chạy 16 lần: 64 = n·log₂ n → O(n log n). (2) Mảng chưa sắp xếp; tìm nhị phân sẽ bỏ nhầm nửa chứa đáp án. (3) 1 (khoá đứng đầu) và 1.000 (khoá đứng cuối hoặc không có). (4) Cả hai đều đúng: Big-O là chặn trên; O(n²) là câu trả lời sát và có ích. (5) O(1) khấu hao, vì mảng nới theo tỉ lệ — tổng số lần chép luôn nhỏ hơn một hằng số nhân với số lần thêm.</p>
<h3>⏱ Bảng độ phức tạp</h3>
<table>
<thead><tr><th>Giải thuật</th><th>Big-O (trường hợp xấu nhất, trừ khi ghi khác)</th><th>Con số đứng sau</th></tr></thead>
<tbody>
<tr><td>arrayMax, n phần tử</td><td>O(n) — cả trường hợp tốt nhất</td><td>đúng n − 1 phép so sánh</td></tr>
<tr><td>tìm tuần tự</td><td>O(n); tốt nhất O(1)</td><td>1 … n phép so sánh</td></tr>
<tr><td>tìm nhị phân (mảng đã sắp)</td><td>O(log n)</td><td>tối đa ⌊log₂ n⌋ + 1 lần dò — 20 với 10⁶</td></tr>
<tr><td>max(a, b, c)</td><td>O(1)</td><td>luôn 2 phép so sánh</td></tr>
<tr><td>gcd(a, b) — ước chung lớn nhất — của Euclid</td><td>O(log min(a, b))</td><td>cứ hai vòng, các số giảm ít nhất một nửa</td></tr>
<tr><td>kiểm tra nguyên tố tới √n</td><td>O(√n)</td><td>tối đa ⌊√n⌋ − 1 phép chia — 999 với 1.000.003</td></tr>
<tr><td>tìm trùng — so mọi cặp</td><td>O(n²)</td><td>n(n − 1)/2 phép so sánh</td></tr>
<tr><td>tìm trùng — sắp xếp + quét</td><td>O(n log n)</td><td>khoảng n·log₂ n cho phép sắp, n − 1 cho lượt quét</td></tr>
<tr><td>tìm trùng — <code>HashSet</code></td><td>O(n) trung bình</td><td>n thao tác trên tập</td></tr>
<tr><td>tổng tiền tố — tính lại / dùng lại</td><td>O(n²) / O(n)</td><td>n(n + 1)/2 / n − 1 phép cộng</td></tr>
<tr><td>tổng một đoạn nhờ tổng tiền tố</td><td>O(1) mỗi truy vấn</td><td>p[r] − p[l − 1]</td></tr>
<tr><td><code>add</code> của mảng co giãn — N + k / 2N</td><td>O(n) / O(1), đều là khấu hao mỗi lần thêm</td><td>khoảng m²/(2k) / ít hơn 2m lần chép cho m lần thêm</td></tr>
<tr><td>sắp xếp chèn (insertion sort)</td><td>O(n²); O(n) nếu đã sắp sẵn</td><td>tối đa n(n − 1)/2 phép so sánh</td></tr>
</tbody>
</table>`),
  ].join('\n'),
};

export default {
  slides: [L_csd1_1, L_csd2_1, L_csd3_1, L_csd3_2],
  practice: L_on_ch0,
};
