/**
 * Web Foundations — Chương 8: Dữ liệu & SQL (database, SELECT, CRUD viết dữ liệu,
 * quan hệ + JOIN, ORM/Prisma). Nền tảng dữ liệu phía server cho khoá NODE.JS.
 * Song ngữ EN/VI (.ml-en / .ml-vi, số khối bằng nhau). ⚠️ KHÔNG backtick trần
 * trong content (dùng &#96;); `${` trong code escape thành \${. Quiz có field content.
 */

import { gallery, galleryGiang } from './_slides.mjs';
import L85 from './s08/wf-8-5-orm-prisma.mjs';
import L84 from './s08/wf-8-4-relationships-joins.mjs';
import L83 from './s08/wf-8-3-crud.mjs';
import L82 from './s08/wf-8-2-select.mjs';
import L81 from './s08/wf-8-1-databases.mjs';
import { onTapBai } from './_on-tap/index.mjs';

export default {
  title: 'Chapter 8 — Data & SQL|||Chương 8 — Dữ liệu & SQL',
  description: 'API của bạn ở Chương 6 trả về dữ liệu — nhưng dữ liệu đó nằm ở đâu, và làm sao đọc/ghi nó một cách đáng tin cậy? Học cách một cơ sở dữ liệu quan hệ tổ chức dữ liệu thành bảng, cách đọc dữ liệu bằng SELECT, cách thay đổi dữ liệu an toàn với INSERT/UPDATE/DELETE, cách nối nhiều bảng bằng JOIN, và cách một ORM như Prisma (đúng công cụ dự án này dùng) biến các dòng SQL thành object JavaScript quen thuộc.',
  lessons: [
    /* ─────────────────── 8.0 slide bài giảng ─────────────────── */
    {
      title: '8.0 — Lecture slides: data & SQL in 13 slides|||8.0 — Slide bài giảng: dữ liệu & SQL trong 13 slide',
      slug: 'wf-8-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bảng, SELECT, INSERT/UPDATE/DELETE, JOIN, chỉ mục, injection và ORM.',
      content: `
<div class="ml-en"><h2>📑 Lecture slides: data & SQL in 13 slides</h2>
<p>Slide 7 carries the single most expensive mistake in this chapter: forgetting WHERE on an UPDATE or DELETE.</p>
<p>Two ways to use it: skim before the chapter to see what is coming, then come back afterwards to revise. If a slide still does not make sense, the lesson that teaches it is right below.</p></div>
<div class="ml-vi"><h2>📑 Slide bài giảng: dữ liệu & SQL trong 13 slide</h2>
<p>Slide 7 mang lỗi đắt nhất của cả chương: quên WHERE khi UPDATE hoặc DELETE.</p>
<p>Hai cách dùng: lướt trước khi học chương để biết sắp học gì, rồi quay lại ôn sau. Slide nào còn chưa hiểu thì bài dạy nó nằm ngay bên dưới.</p></div>
${galleryGiang('wf-sql', [
  [1, "Bìa"],
  [2, "Nội dung chương"],
  [3, "Vì sao không lưu vào file cho xong"],
  [4, "Bảng · hàng · cột · khoá"],
  [5, "SELECT — câu lệnh dùng nhiều nhất"],
  [6, "Gộp nhóm: COUNT · SUM · GROUP BY"],
  [7, "Thay đổi dữ liệu — và bẫy quên WHERE"],
  [8, "Quan hệ — ba kiểu"],
  [9, "JOIN — ghép dữ liệu nhiều bảng"],
  [10, "Chỉ mục — vì sao truy vấn chậm"],
  [11, "SQL Injection và cách chặn"],
  [12, "ORM & Prisma ⭐"],
  [13, "Tự luyện"],
])}
`,
    },

    /* ─────────────────────────── 8.1 ─────────────────────────── */
    L81,

    /* ─────────────────────────── 8.2 ─────────────────────────── */
    L82,

    /* ─────────────────────────── 8.3 ─────────────────────────── */
    L83,

    /* ─────────────────────────── 8.4 ─────────────────────────── */
    L84,

    /* ─────────────────────────── 8.5 ─────────────────────────── */
    L85,

    /* ─────────────────────────── 8.6 quiz ─────────────────────────── */
    {
      title: '8.6 — Chapter 8 quiz|||8.6 — Kiểm tra chương 8',
      slug: 'wf-8-6-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về database quan hệ, SELECT, INSERT/UPDATE/DELETE, khoá chính/khoá ngoại, JOIN và ORM/Prisma.',
      content: `
<div class="ml-en"><p class="lead">Ten questions on Chapter 8: what a database is, reading data with SELECT, changing data with INSERT/UPDATE/DELETE, primary/foreign keys and JOINs, and how an ORM like Prisma maps to the SQL you learned.</p>
<p class="note-ct"><strong>Now practice by doing.</strong> The best way to internalise SQL is to write real queries against real tables. The Chapter 8 set on Code Lab has you rebuild what the database does — constraints, NULL logic, GROUP BY, joins, safe query builders, N+1 detection, Prisma-style filters — and the SQL track lets you run real queries.</p>
<h3>The chapter in four points</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">Why a database</span><span class="lz-t">Concurrency, constraints, transactions</span><span class="lz-d">A JSON file loses one of two simultaneous writes and cannot enforce a rule. Those are not features you can add later.</span></div>
<div class="lz-node"><span class="lz-k">SELECT runs in a strange order</span><span class="lz-t">FROM, WHERE, SELECT, ORDER, LIMIT</span><span class="lz-d">That order explains why a <code>SELECT</code> alias cannot be used in <code>WHERE</code>, and why aggregates need <code>HAVING</code>.</span></div>
<div class="lz-node"><span class="lz-k">Write statements need a WHERE</span><span class="lz-t">Read it twice</span><span class="lz-d">An <code>UPDATE</code> without one changes every row, instantly, with no undo. Test it as a <code>SELECT</code> first.</span></div>
<div class="lz-node"><span class="lz-k">Joins and N+1</span><span class="lz-t">Index the foreign key</span><span class="lz-d">Fetching related rows in a loop is fast on five records and half a second on fifty. One join, or one <code>WHERE id IN (…)</code>.</span></div>
</div>
<p class="note-ct"><strong>Turn on query logging while you learn.</strong> Whatever ORM you use, make it print the SQL it generates. Seeing an N+1 as fifty identical lines scrolling past teaches the lesson faster than any explanation of it.</p>
<div class="link-card"><a href="/code-lab/web-foundations-practice?bai=wf-8-0-slides&khoa=web-foundations">Practice on Code Lab → Chapter 8 practice set (30 auto-graded exercises)</a></div></div>
<div class="ml-vi"><p class="lead">Mười câu cho Chương 8: database là gì, đọc dữ liệu với SELECT, đổi dữ liệu với INSERT/UPDATE/DELETE, khoá chính/khoá ngoại và JOIN, và cách một ORM như Prisma ánh xạ về SQL bạn đã học.</p>
<p class="note-ct"><strong>Giờ luyện bằng cách làm.</strong> Cách tốt nhất để thấm SQL là tự viết truy vấn thật trên bảng thật. Bộ đề Chương 8 trên Code Lab cho bạn tự dựng lại việc CSDL làm — ràng buộc, logic NULL, GROUP BY, phép nối, dựng truy vấn an toàn, phát hiện N+1, bộ lọc kiểu Prisma — còn track SQL cho bạn chạy truy vấn thật.</p>
<h3>Cả chương trong bốn ý</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">Vì sao cần cơ sở dữ liệu</span><span class="lz-t">Đồng thời, ràng buộc, giao dịch</span><span class="lz-d">Một file JSON mất một trong hai lượt ghi cùng lúc và không cưỡng chế nổi một luật nào. Đó không phải những tính năng thêm vào sau được.</span></div>
<div class="lz-node"><span class="lz-k">SELECT chạy theo thứ tự lạ</span><span class="lz-t">FROM, WHERE, SELECT, ORDER, LIMIT</span><span class="lz-d">Thứ tự đó giải thích vì sao một bí danh ở <code>SELECT</code> không dùng được trong <code>WHERE</code>, và vì sao hàm tổng hợp cần <code>HAVING</code>.</span></div>
<div class="lz-node"><span class="lz-k">Câu lệnh ghi cần một WHERE</span><span class="lz-t">Hãy đọc lại hai lần</span><span class="lz-d">Một <code>UPDATE</code> thiếu nó sẽ đổi mọi dòng, tức thì, không hoàn tác được. Hãy thử nó dưới dạng <code>SELECT</code> trước.</span></div>
<div class="lz-node"><span class="lz-k">Phép nối và N+1</span><span class="lz-t">Hãy đánh chỉ mục cho khoá ngoại</span><span class="lz-d">Lấy dữ liệu liên quan trong một vòng lặp thì nhanh với năm bản ghi và mất nửa giây với năm mươi. Một phép nối, hoặc một <code>WHERE id IN (…)</code>.</span></div>
</div>
<p class="note-ct"><strong>Hãy bật ghi log truy vấn trong lúc học.</strong> Dùng ORM nào cũng được, hãy bắt nó in ra đoạn SQL mà nó sinh ra. Nhìn thấy một N+1 dưới dạng năm mươi dòng y hệt nhau chạy qua màn hình dạy bài học đó nhanh hơn mọi lời giải thích.</p>
<div class="link-card"><a href="/code-lab/web-foundations-practice?bai=wf-8-0-slides&khoa=web-foundations">Luyện tập ở Code Lab → bộ đề Chương 8 (30 bài, máy chấm tự động)</a></div></div>
${onTapBai('wf-8-6-quiz')}
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Why do applications need a database instead of just keeping data in memory?|||Vì sao ứng dụng cần một database thay vì chỉ giữ dữ liệu trong bộ nhớ?',
            options: [
              'A database stores data persistently, surviving restarts and crashes|||Database lưu dữ liệu bền vững, sống sót qua khởi động lại và sập',
              'Memory is slower than a database|||Bộ nhớ chậm hơn database',
              'Databases are only for images|||Database chỉ dùng cho ảnh',
              'Memory cannot store text|||Bộ nhớ không lưu được chữ',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'In a relational database, what is a row?|||Trong một database quan hệ, một dòng (row) là gì?',
            options: [
              'One single record in a table, with a value for every column|||Một bản ghi duy nhất trong một bảng, với một giá trị cho mỗi cột',
              'The name of a table|||Tên của một bảng',
              'A column type|||Một kiểu cột',
              'A SQL keyword|||Một từ khoá SQL',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Given posts(id, title, views, published) with rows (1,"A",120,true), (2,"B",45,true), (3,"C",3,false), what does SELECT title FROM posts WHERE published = true ORDER BY views DESC LIMIT 1; return?|||Cho posts(id, title, views, published) với các dòng (1,"A",120,true), (2,"B",45,true), (3,"C",3,false), SELECT title FROM posts WHERE published = true ORDER BY views DESC LIMIT 1; trả về gì?',
            options: [
              'Just "A" (highest views among published rows)|||Chỉ "A" (views cao nhất trong các dòng đã xuất bản)',
              'Just "C"|||Chỉ "C"',
              'All three titles|||Cả ba tiêu đề',
              'An empty result|||Một kết quả rỗng',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which statement creates a brand-new row in a table?|||Câu lệnh nào tạo một dòng hoàn toàn mới trong một bảng?',
            options: [
              'INSERT INTO|||INSERT INTO',
              'SELECT|||SELECT',
              'UPDATE|||UPDATE',
              'ORDER BY|||ORDER BY',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What happens if you run UPDATE posts SET published = false; with no WHERE clause?|||Điều gì xảy ra nếu chạy UPDATE posts SET published = false; không có mệnh đề WHERE?',
            options: [
              'Every row in the posts table gets published set to false|||Mọi dòng trong bảng posts đều bị đặt published thành false',
              'Nothing happens without WHERE|||Không có gì xảy ra nếu thiếu WHERE',
              'Only the first row changes|||Chỉ dòng đầu tiên đổi',
              'It causes a syntax error|||Nó gây lỗi cú pháp',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Given posts(id, title, views) with rows (1,"A",120), (2,"B",45), (3,"C",3), what does DELETE FROM posts WHERE id = 2; leave in the table?|||Cho posts(id, title, views) với các dòng (1,"A",120), (2,"B",45), (3,"C",3), DELETE FROM posts WHERE id = 2; để lại gì trong bảng?',
            options: [
              'Rows 1 ("A") and 3 ("C") only|||Chỉ dòng 1 ("A") và 3 ("C")',
              'All three rows|||Cả ba dòng',
              'No rows at all|||Không dòng nào cả',
              'Only row 2|||Chỉ dòng 2',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What is a foreign key?|||Khoá ngoại (foreign key) là gì?',
            options: [
              'A column in one table storing the primary key of a row in another table|||Một cột ở bảng này lưu khoá chính của một dòng ở bảng khác',
              'A password for the database|||Một mật khẩu cho database',
              'A column that must always be empty|||Một cột luôn phải rỗng',
              'A type of index used only for text|||Một loại index chỉ dùng cho chữ',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Given users(id,name) = (1,"Lan"),(2,"Minh") and posts(id,title,user_id) = (1,"X",1),(2,"Y",NULL), what does INNER JOIN return for SELECT posts.title, users.name FROM posts INNER JOIN users ON posts.user_id = users.id;?|||Cho users(id,name) = (1,"Lan"),(2,"Minh") và posts(id,title,user_id) = (1,"X",1),(2,"Y",NULL), INNER JOIN trả về gì cho SELECT posts.title, users.name FROM posts INNER JOIN users ON posts.user_id = users.id;?',
            options: [
              'Only one row: "X" with "Lan" — post "Y" is dropped since its user_id is NULL|||Chỉ một dòng: "X" với "Lan" — post "Y" bị loại vì user_id của nó là NULL',
              'Both posts, "Y" paired with NULL|||Cả hai post, "Y" ghép với NULL',
              'Every combination of every post and every user|||Mọi tổ hợp của mọi post và mọi user',
              'An empty result|||Một kết quả rỗng',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Using the same tables, what would LEFT JOIN return instead, for the same query with LEFT JOIN in place of INNER JOIN?|||Dùng cùng các bảng, LEFT JOIN sẽ trả về gì thay vào đó, cho cùng truy vấn nhưng thay INNER JOIN bằng LEFT JOIN?',
            options: [
              'Both rows: "X" with "Lan", and "Y" with NULL for name|||Cả hai dòng: "X" với "Lan", và "Y" với NULL cho name',
              'Only "X" with "Lan"|||Chỉ "X" với "Lan"',
              'Only "Y" with NULL|||Chỉ "Y" với NULL',
              'Neither row|||Không dòng nào',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What does an ORM like Prisma do?|||Một ORM như Prisma làm gì?',
            options: [
              'Maps database rows to JavaScript objects so you call methods instead of writing raw SQL strings|||Ánh xạ dòng database sang object JavaScript để bạn gọi phương thức thay vì viết chuỗi SQL thô',
              'Replaces the need for a database entirely|||Thay thế hoàn toàn nhu cầu về database',
              'Only works with NoSQL databases|||Chỉ hoạt động với database NoSQL',
              'Sends HTTP requests instead of SQL queries|||Gửi yêu cầu HTTP thay vì truy vấn SQL',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
