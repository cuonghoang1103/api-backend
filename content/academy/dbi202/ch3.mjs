/**
 * DBI202 · Chương 3 — mô hình E/R (slide Chapter 4 của trường).
 * Bài 📑 học theo từng slide: dbi5 (Chapter 4.pptx, slide 1–53).
 * Bài 🧪 thực hành + 🗂 thuật ngữ + 📌 tóm tắt: dbi202-on-ch3.
 * Quiz MỚI (10 câu, slug dbi202-quiz-ch3).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/DBI202/gen/gen.mjs từ gen/src/** và gen/sql/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node DBI202/gen/gen.mjs`.
 */

import { walk, walkHead, books, bi } from './_slides.mjs';

/* ───────── 3.A — 📑 Slide by slide · E/R model: entities, relationships, weak entities (school Ch.4, slides 1–18) ───────── */
const L_dbi5_1 = {
  title: '3.A — 📑 Slide by slide · E/R model: entities, relationships, weak entities (school Ch.4, slides 1–18)|||3.A — 📑 Học theo từng slide · Mô hình E/R: quy trình thiết kế, thực thể, liên kết, thực thể yếu (Chapter 4 của trường, slide 1–18)',
  slug: 'dbi202-slide-dbi5-1',
  type: 'VIDEO',
  description: "Giảng slide 1–18 của bộ Chapter 4 (High-Level Database Model) của trường — trên web là Chương 3: ba mức dữ liệu, quy trình thiết kế 6 bước, cách dựng ERD, ký hiệu Chen/Crow's Foot, thực thể, liên kết và bản số, bốn loại thuộc tính, thực thể yếu Crews/Contracts, lớp con isa, rồi dựng ERD và 5 bảng chạy thật cho đề COMPANY.",
  content: [
    bi(`<span class="eyebrow">Chapter 3 · Lesson 3.A · school deck "Chapter 4", slides 1–18</span>
<h2>The E/R model — the deck, slide by slide (part 1 of 3)</h2>
<p class="lead"><strong>These are the slides of the school's Chapter 4 (High-Level Database Model); on this website the topic is Chapter 3.</strong> The school teaches normalization (its Chapter 3) first; this site puts ER modelling first because it is how you <em>find</em> the tables, and normalization is how you <em>check</em> them. The slides are the same — only the number changes.</p>
<div class="callout"><strong>Why this chapter matters for the exams.</strong> The syllabus gives it sessions 19–22 (CLO4). Question 1 of the PE (85 minutes) usually gives a business description and asks you to create the tables with keys and foreign keys — that is exactly "requirements → ERD → relations → CREATE TABLE". This part covers the ERD itself; lesson 3.B converts ERDs into tables, lesson 3.C handles subclasses and UML.</div>
<h3>The deck in three lessons</h3>
<table>
<thead><tr><th>Lesson</th><th>Slides</th><th>Content</th></tr></thead>
<tbody>
<tr><td>3.A (this one)</td><td>1–18</td><td>design process, notation, entity, relationship, attribute types, weak entity sets, subclasses, the COMPANY exercise</td></tr>
<tr><td>3.B</td><td>19–32</td><td>from E/R to relations: 1-1, 1-M, M-M, n-ary, composite, multivalued, hierarchies, aggregation, weak entity sets</td></tr>
<tr><td>3.C</td><td>33–53</td><td>subclass structures to relations (three strategies), UML class diagrams and UML to relations</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 3 · Bài 3.A · bộ slide "Chapter 4" của trường, slide 1–18</span>
<h2>Mô hình E/R — học bộ slide từng trang (phần 1/3)</h2>
<p class="lead"><strong>Đây là slide Chapter 4 của trường (High-Level Database Model — mô hình CSDL mức cao); trên web chủ đề này là Chương 3.</strong> Trường dạy chuẩn hoá (Chapter 3 của trường) trước; trang này đặt mô hình ER lên trước vì đó là cách <em>tìm ra</em> các bảng, còn chuẩn hoá là cách <em>kiểm</em> các bảng. Slide vẫn y nguyên — chỉ số chương đổi.</p>
<div class="callout"><strong>Vì sao chương này quan trọng cho kỳ thi.</strong> Syllabus dành cho nó buổi 19–22 (chuẩn đầu ra CLO4). Câu 1 của đề PE (thi thực hành 85 phút) thường cho một đoạn mô tả nghiệp vụ và yêu cầu tạo bảng có khoá chính, khoá ngoại — chính là chuỗi "yêu cầu → ERD → quan hệ → CREATE TABLE". Phần này lo ERD; bài 3.B chuyển ERD thành bảng, bài 3.C xử lý lớp con và UML.</div>
<h3>Bộ slide chia làm ba bài</h3>
<table>
<thead><tr><th>Bài</th><th>Slide</th><th>Nội dung</th></tr></thead>
<tbody>
<tr><td>3.A (bài này)</td><td>1–18</td><td>quy trình thiết kế, ký hiệu, thực thể, liên kết, các loại thuộc tính, tập thực thể yếu, lớp con, bài tập COMPANY</td></tr>
<tr><td>3.B</td><td>19–32</td><td>từ E/R sang quan hệ: 1-1, 1-M, M-M, n ngôi, thuộc tính phức hợp, đa trị, phân cấp lớp, kết tập, thực thể yếu</td></tr>
<tr><td>3.C</td><td>33–53</td><td>chuyển cấu trúc lớp con sang quan hệ (ba chiến lược), sơ đồ lớp UML và từ UML sang quan hệ</td></tr>
</tbody>
</table>`),
    walkHead('dbi5', 1, 18),
    walk('dbi5', [
      [1, 'Chapter 4. High-Level Database Model',
        `<p class="y-chinh">🎯 The school's Chapter 4 (this site's Chapter 3): describing data at a high level — as entities and relationships — before thinking about tables.</p>
<p>"High-level" means close to how people talk about the business ("a student enrols in a course"), not how the DBMS stores it. The main tool is the Entity-Relationship (E/R) model, drawn as an ERD.</p>`,
        `<p class="y-chinh">🎯 Chapter 4 của trường (Chương 3 trên web): mô tả dữ liệu ở mức cao — thành thực thể và liên kết — trước khi nghĩ tới bảng.</p>
<p>"Mức cao" (high-level) nghĩa là gần với cách con người nói về nghiệp vụ ("sinh viên đăng ký môn học"), chứ không phải cách DBMS lưu trữ. Công cụ chính là mô hình Thực thể – Liên kết (Entity-Relationship — E/R), vẽ thành sơ đồ ERD.</p>`],
      [2, 'Objectives',
        `<p class="y-chinh">🎯 Three goals: understand the design process, model data with entities and relationships, and design a database that fits real business requirements.</p>
<p>The third goal is the one that is graded: in the assignment and PE question 1 nobody asks you to recite definitions — you get a paragraph of requirements and must produce correct tables.</p>`,
        `<p class="y-chinh">🎯 Ba mục tiêu: hiểu quy trình thiết kế CSDL, mô hình hoá dữ liệu bằng thực thể và liên kết, và thiết kế được CSDL khớp yêu cầu nghiệp vụ thực tế.</p>
<p>Mục tiêu thứ ba là thứ bị chấm điểm: trong assignment và câu 1 đề PE không ai bắt bạn đọc thuộc định nghĩa — bạn nhận một đoạn mô tả yêu cầu và phải cho ra các bảng đúng.</p>`],
      [3, 'Contents',
        `<p class="y-chinh">🎯 Seven topics: the design process, the E/R model, entity/entity set/attribute/relationship, the ERD, attributes on relationships, weak entities, sub-classes.</p>
<p>Slides 4–7 are the process, 8–12 the building blocks, 13–15 weak entity sets, 16 subclasses, 17–18 an exercise; from slide 19 the deck converts diagrams into relations (lesson 3.B).</p>`,
        `<p class="y-chinh">🎯 Bảy chủ đề: quy trình thiết kế, mô hình E/R, thực thể / tập thực thể / thuộc tính / liên kết, sơ đồ ERD, thuộc tính trên liên kết, thực thể yếu, lớp con.</p>
<p>Slide 4–7 là quy trình, 8–12 là các khối xây dựng, 13–15 là tập thực thể yếu, 16 là lớp con, 17–18 là bài tập; từ slide 19 bộ slide chuyển sơ đồ thành quan hệ (bài 3.B).</p>`],
      [4, 'Data model - Overview',
        `<p class="y-chinh">🎯 The three-level architecture: many external views on top, one conceptual schema in the middle, one internal schema over the stored database at the bottom.</p>
<table>
<thead><tr><th>Level (figure)</th><th>What it describes</th><th>Example (FAP)</th></tr></thead>
<tbody>
<tr><td>External level — external view 1 … n</td><td>what one group of users sees</td><td>a student sees only their own marks; the accountant sees fees</td></tr>
<tr><td>Conceptual level — conceptual schema</td><td>all entities, relationships and constraints of the whole organisation</td><td>Student, Course, Enroll, Lecturer and their keys</td></tr>
<tr><td>Internal level — internal schema</td><td>how data are stored: files, pages, indexes</td><td>a clustered index on StudentID, files on disk</td></tr>
</tbody>
</table>
<p>The arrows between the levels are <strong>mappings</strong>. Changing the internal schema (adding an index) does not touch the conceptual schema — <em>physical data independence</em>; changing the conceptual schema (adding a column) need not break an external view — <em>logical data independence</em>. The ER model of this chapter describes the conceptual level.</p>
<p class="meo">🧠 <strong>Remember "E-C-I" from top to bottom:</strong> External (who sees what), Conceptual (what exists), Internal (how it is stored).</p>`,
        `<p class="y-chinh">🎯 Kiến trúc ba mức: nhiều khung nhìn ngoài (external view) ở trên, một lược đồ khái niệm (conceptual schema) ở giữa, một lược đồ trong (internal schema) nằm trên CSDL đã lưu ở dưới cùng.</p>
<table>
<thead><tr><th>Mức (trong hình)</th><th>Mô tả cái gì</th><th>Ví dụ (FAP)</th></tr></thead>
<tbody>
<tr><td>Mức ngoài (external) — external view 1 … n</td><td>điều một nhóm người dùng nhìn thấy</td><td>sinh viên chỉ thấy điểm của mình; kế toán thấy học phí</td></tr>
<tr><td>Mức khái niệm (conceptual) — conceptual schema</td><td>mọi thực thể, liên kết, ràng buộc của cả tổ chức</td><td>Student, Course, Enroll, Lecturer cùng các khoá</td></tr>
<tr><td>Mức trong (internal) — internal schema</td><td>dữ liệu được lưu thế nào: tệp, trang, chỉ mục</td><td>chỉ mục cụm trên StudentID, các tệp trên đĩa</td></tr>
</tbody>
</table>
<p>Các mũi tên giữa các mức là <strong>ánh xạ (mapping)</strong>. Đổi lược đồ trong (thêm một chỉ mục) không đụng tới lược đồ khái niệm — gọi là <em>độc lập dữ liệu vật lý (physical data independence)</em>; đổi lược đồ khái niệm (thêm một cột) không nhất thiết làm hỏng một khung nhìn ngoài — <em>độc lập dữ liệu logic (logical data independence)</em>. Mô hình ER của chương này mô tả mức khái niệm.</p>
<p class="meo">🧠 <strong>Nhớ "E-C-I" từ trên xuống:</strong> External (ai thấy gì), Conceptual (có những gì), Internal (lưu ra sao).</p>`],
      [5, 'Database modeling and implementation process',
        `<p class="y-chinh">🎯 Figure 4.1: requirements → high-level design (output: an ER diagram) → relational database schema design (output: the relational schema) → implemented on a relational DBMS.</p>
<div class="lz-flow">
<div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Getting user requirement</div><div class="lz-d">interviews, forms, the PE paragraph</div></div>
<div class="lz-step"><div class="lz-k">2</div><div class="lz-t">High-level design</div><div class="lz-d">output: ER diagram</div></div>
<div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Relational schema design</div><div class="lz-d">output: relations with keys</div></div>
<div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Relational DBMS</div><div class="lz-d">CREATE TABLE on SQL Server</div></div>
</div>
<p>Each arrow is a translation you will practise: step 2 in this lesson, step 3 in lesson 3.B, step 4 in every SQL file below.</p>`,
        `<p class="y-chinh">🎯 Hình 4.1: lấy yêu cầu → thiết kế mức cao (đầu ra: sơ đồ ER) → thiết kế lược đồ CSDL quan hệ (đầu ra: lược đồ quan hệ) → cài đặt trên một DBMS quan hệ.</p>
<div class="lz-flow">
<div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Lấy yêu cầu người dùng</div><div class="lz-d">phỏng vấn, biểu mẫu, đoạn đề PE</div></div>
<div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Thiết kế mức cao</div><div class="lz-d">đầu ra: sơ đồ ER</div></div>
<div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Thiết kế lược đồ quan hệ</div><div class="lz-d">đầu ra: các quan hệ có khoá</div></div>
<div class="lz-step"><div class="lz-k">4</div><div class="lz-t">DBMS quan hệ</div><div class="lz-d">CREATE TABLE trên SQL Server</div></div>
</div>
<p>Mỗi mũi tên là một phép chuyển bạn sẽ luyện: bước 2 ở bài này, bước 3 ở bài 3.B, bước 4 ở mọi file SQL bên dưới.</p>`],
      [6, 'Steps in Database Design',
        `<p class="y-chinh">🎯 Six steps: requirements analysis, conceptual design (ERD), logical design (ERD → DBMS model), schema refinement (normalization), physical design (indexes), security design (who accesses what).</p>
<table>
<thead><tr><th>Step</th><th>Question it answers</th><th>Where in DBI202</th></tr></thead>
<tbody>
<tr><td>1. Requirements analysis</td><td>what must the database do?</td><td>reading the PE paragraph</td></tr>
<tr><td>2. Conceptual design</td><td>which entities and relationships? — the ERD</td><td>this chapter</td></tr>
<tr><td>3. Logical design</td><td>which tables, keys, foreign keys?</td><td>lesson 3.B, Chapter 5</td></tr>
<tr><td>4. Schema refinement</td><td>are the tables free of redundancy? — normalization</td><td>Chapter 4 (school Chapter 3)</td></tr>
<tr><td>5. Physical design</td><td>which indexes, how is data laid out on disk?</td><td>Chapter 8</td></tr>
<tr><td>6. Security design</td><td>who may read or change what?</td><td>GRANT/REVOKE, views</td></tr>
</tbody>
</table>
<div class="pitfall">Normalization is step 4, <em>after</em> the ERD. A frequent FE distractor places "normalization" in conceptual design — it belongs to schema refinement.</div>`,
        `<p class="y-chinh">🎯 Sáu bước: phân tích yêu cầu, thiết kế khái niệm (ERD), thiết kế logic (ERD → mô hình của DBMS), tinh chỉnh lược đồ (chuẩn hoá), thiết kế vật lý (chỉ mục), thiết kế bảo mật (ai truy cập gì).</p>
<table>
<thead><tr><th>Bước</th><th>Trả lời câu hỏi</th><th>Học ở đâu trong DBI202</th></tr></thead>
<tbody>
<tr><td>1. Phân tích yêu cầu (requirements analysis)</td><td>CSDL phải làm được gì?</td><td>đọc đoạn đề PE</td></tr>
<tr><td>2. Thiết kế khái niệm (conceptual design)</td><td>có những thực thể và liên kết nào? — ERD</td><td>chương này</td></tr>
<tr><td>3. Thiết kế logic (logical design)</td><td>bảng nào, khoá chính, khoá ngoại nào?</td><td>bài 3.B, Chương 5</td></tr>
<tr><td>4. Tinh chỉnh lược đồ (schema refinement)</td><td>bảng đã hết dư thừa chưa? — chuẩn hoá</td><td>Chương 4 (Chapter 3 của trường)</td></tr>
<tr><td>5. Thiết kế vật lý (physical design)</td><td>chỉ mục nào, dữ liệu xếp trên đĩa ra sao?</td><td>Chương 8</td></tr>
<tr><td>6. Thiết kế bảo mật (security design)</td><td>ai được đọc, được sửa gì?</td><td>GRANT/REVOKE, view</td></tr>
</tbody>
</table>
<div class="pitfall">Chuẩn hoá là bước 4, <em>sau</em> ERD. Phương án gây nhiễu hay gặp trong FE đặt "chuẩn hoá" vào thiết kế khái niệm — nó thuộc tinh chỉnh lược đồ.</div>`],
      [7, 'ERD – How to construct',
        `<p class="y-chinh">🎯 A seven-step recipe to draw an ERD from requirements — use it literally in the PE.</p>
<ol>
<li>Gather all the data that needs to be modelled (underline the nouns and numbers in the paragraph).</li>
<li>Identify data that can be modelled as real-world entities (nouns that have several facts of their own).</li>
<li>Identify the attributes of each entity (the facts about each noun).</li>
<li>Sort entity sets as <strong>strong or weak</strong> (can it be identified alone?).</li>
<li>Sort attributes as <strong>key, multi-valued, composite, derived</strong> (slide 12).</li>
<li>Identify the relationships between entities (verbs) and their cardinality (1-1, 1-M, M-M).</li>
<li>Draw everything with the right symbols (slide 8).</li>
</ol>
<p class="meo">🧠 <strong>Grammar trick:</strong> noun → entity, verb → relationship, adjective/fact → attribute, "each … has many …" → cardinality.</p>`,
        `<p class="y-chinh">🎯 Công thức bảy bước để vẽ ERD từ yêu cầu — dùng đúng từng bước khi làm PE.</p>
<ol>
<li>Gom mọi dữ liệu cần mô hình hoá (gạch chân các danh từ và con số trong đoạn đề).</li>
<li>Xác định dữ liệu nào là thực thể (entity) của thế giới thực (danh từ có nhiều thông tin riêng).</li>
<li>Xác định thuộc tính (attribute) cho từng thực thể (các thông tin về danh từ đó).</li>
<li>Phân loại tập thực thể thành <strong>mạnh hay yếu</strong> (strong / weak — tự nó có phân biệt được không?).</li>
<li>Phân loại thuộc tính thành <strong>khoá, đa trị, phức hợp, dẫn xuất</strong> (key, multi-valued, composite, derived — slide 12).</li>
<li>Xác định các liên kết (relationship) giữa các thực thể (động từ) và bản số (cardinality — 1-1, 1-M, M-M).</li>
<li>Vẽ tất cả bằng đúng ký hiệu (slide 8).</li>
</ol>
<p class="meo">🧠 <strong>Mẹo ngữ pháp:</strong> danh từ → thực thể, động từ → liên kết, tính từ/thông tin → thuộc tính, "mỗi … có nhiều …" → bản số.</p>`],
      [8, 'Entity Relationship Diagram - Notations',
        `<p class="y-chinh">🎯 Five symbols of the Chen notation: rectangle = entity, double rectangle = weak entity, oval = attribute, diamond = relationship, oval with underlined name = key attribute.</p>
<table>
<thead><tr><th>Component</th><th>Symbol</th><th>Example on the slide</th></tr></thead>
<tbody>
<tr><td>Entity</td><td>rectangle</td><td>Student</td></tr>
<tr><td>Weak entity</td><td>double rectangle</td><td>Assignments</td></tr>
<tr><td>Attribute</td><td>oval</td><td>Roll_num</td></tr>
<tr><td>Relationship</td><td>diamond</td><td>Saves in</td></tr>
<tr><td>Key attribute</td><td>oval, name underlined</td><td><u>Acct_num</u></td></tr>
</tbody>
</table>
<p>Two more symbols appear later in the deck: a double diamond for the supporting relationship of a weak entity (slide 13), a double oval for a multivalued attribute and a dashed oval for a derived one (slide 12).</p>
<p class="nhan">Every symbol, read aloud — and the mistake students make when drawing it</p>
<table>
<thead><tr><th>Symbol</th><th>Say it like this</th><th>Typical drawing mistake</th></tr></thead>
<tbody>
<tr><td>rectangle "Student"</td><td>"Student is a kind of thing we keep many of, each with its own data"</td><td>drawing a single value (e.g. "GPA") as a rectangle — a value is an attribute, not an entity</td></tr>
<tr><td>oval "Roll_num" joined by a line to Student</td><td>"every student has a roll number"</td><td>attaching the oval to the diamond when it describes only one entity</td></tr>
<tr><td>underlined oval "<u>Acct_num</u>"</td><td>"the account number identifies exactly one account"</td><td>underlining a name or a date — values that can repeat cannot be keys</td></tr>
<tr><td>diamond "Saves in" between two rectangles</td><td>"a customer saves in an account" — a verb joining two nouns</td><td>writing a noun in the diamond ("Account") or forgetting to connect both sides</td></tr>
<tr><td>double rectangle "Assignments"</td><td>"an assignment cannot be identified alone, only inside its course"</td><td>making it double without drawing the double diamond to its owner</td></tr>
</tbody>
</table>
<p class="dap-an">✅ <strong>Lecturers ask: "How do you tell an entity from an attribute?"</strong> Ask whether the thing has facts of its own that you need to store. Department with a name, a budget and a manager is an entity; the department name alone, stored for an employee, would be an attribute. If several entities share it and it has its own data, make it an entity.</p>`,
        `<p class="y-chinh">🎯 Năm ký hiệu của cách vẽ Chen: hình chữ nhật = thực thể, chữ nhật đôi = thực thể yếu, hình bầu dục = thuộc tính, hình thoi = liên kết, bầu dục có tên gạch chân = thuộc tính khoá.</p>
<table>
<thead><tr><th>Thành phần</th><th>Ký hiệu</th><th>Ví dụ trên slide</th></tr></thead>
<tbody>
<tr><td>Thực thể (entity)</td><td>hình chữ nhật</td><td>Student</td></tr>
<tr><td>Thực thể yếu (weak entity)</td><td>hình chữ nhật đôi</td><td>Assignments</td></tr>
<tr><td>Thuộc tính (attribute)</td><td>hình bầu dục</td><td>Roll_num</td></tr>
<tr><td>Liên kết (relationship)</td><td>hình thoi</td><td>Saves in</td></tr>
<tr><td>Thuộc tính khoá (key attribute)</td><td>bầu dục, tên gạch chân</td><td><u>Acct_num</u></td></tr>
</tbody>
</table>
<p>Còn hai ký hiệu xuất hiện sau trong bộ slide: hình thoi đôi cho liên kết hỗ trợ (supporting relationship) của thực thể yếu (slide 13), bầu dục đôi cho thuộc tính đa trị và bầu dục nét đứt cho thuộc tính dẫn xuất (slide 12).</p>
<p class="nhan">Từng ký hiệu, đọc thành lời — và lỗi hay mắc khi vẽ</p>
<table>
<thead><tr><th>Ký hiệu</th><th>Đọc thành câu</th><th>Lỗi vẽ hay gặp</th></tr></thead>
<tbody>
<tr><td>chữ nhật "Student"</td><td>"Sinh viên là một loại đối tượng ta lưu nhiều cái, mỗi cái có dữ liệu riêng"</td><td>vẽ một giá trị đơn (vd "GPA") thành hình chữ nhật — giá trị là thuộc tính, không phải thực thể</td></tr>
<tr><td>bầu dục "Roll_num" nối bằng một đường tới Student</td><td>"mỗi sinh viên có một mã số (roll number)"</td><td>nối bầu dục vào hình thoi trong khi nó chỉ mô tả một thực thể</td></tr>
<tr><td>bầu dục gạch chân "<u>Acct_num</u>"</td><td>"số tài khoản xác định đúng một tài khoản"</td><td>gạch chân tên người hay ngày tháng — giá trị có thể trùng thì không làm khoá được</td></tr>
<tr><td>hình thoi "Saves in" giữa hai chữ nhật</td><td>"khách hàng gửi tiền vào tài khoản" — một động từ nối hai danh từ</td><td>ghi danh từ vào hình thoi ("Account") hoặc quên nối một phía</td></tr>
<tr><td>chữ nhật đôi "Assignments"</td><td>"một bài tập không tự xác định được, chỉ xác định được trong môn học của nó"</td><td>vẽ chữ nhật đôi mà quên vẽ hình thoi đôi nối tới chủ của nó</td></tr>
</tbody>
</table>
<p class="dap-an">✅ <strong>Thầy hay hỏi: "Làm sao phân biệt thực thể với thuộc tính?"</strong> Hỏi xem cái đó có thông tin riêng cần lưu hay không. Phòng ban có tên, ngân sách, trưởng phòng thì là thực thể; chỉ riêng tên phòng ghi kèm nhân viên thì là thuộc tính. Nếu nhiều thực thể cùng dùng nó và nó có dữ liệu riêng, hãy cho nó thành thực thể.</p>`],
      [9, 'Comparison of E-R Modeling notations',
        `<p class="y-chinh">🎯 The same ideas can be drawn in four notations — Chen, Crow's Foot, Rein85, IDEF1X — and the table compares their symbols.</p>
<table>
<thead><tr><th>Concept</th><th>Chen</th><th>Crow's Foot</th><th>Rein85</th><th>IDEF1X</th></tr></thead>
<tbody>
<tr><td>Entity</td><td>rectangle</td><td>rectangle</td><td>rectangle</td><td>rectangle</td></tr>
<tr><td>Relationship</td><td>diamond</td><td>only a line</td><td>half-filled diamond</td><td>only a line</td></tr>
<tr><td>Optional</td><td>circle</td><td>circle</td><td>circle</td><td>small diamond</td></tr>
<tr><td>One (1)</td><td>the digit 1</td><td>a short bar</td><td>empty triangle</td><td>—</td></tr>
<tr><td>Many (M)</td><td>the letter M</td><td>crow's foot (three prongs)</td><td>filled triangle</td><td>filled dot</td></tr>
<tr><td>Composite entity (an M-N relationship made into an entity)</td><td>rectangle with a diamond inside</td><td>rectangle with cut corners</td><td>double rectangle</td><td>rounded, shaded rectangle</td></tr>
<tr><td>Weak entity</td><td>double rectangle</td><td>rectangle with cut corners</td><td>double rectangle</td><td>—</td></tr>
</tbody>
</table>
<p>DBI202 slides use <strong>Chen</strong> (diamonds, 1 and M). SQL Server's database diagrams, draw.io and most companies use <strong>Crow's Foot</strong>: no diamond, the "many" end is drawn as a three-pronged fork. You must read both: FE pictures sometimes use Crow's Foot.</p>
<p class="meo">🧠 <strong>Crow's Foot:</strong> the fork is on the MANY side, the bar is on the ONE side, a circle means "zero allowed".</p>`,
        `<p class="y-chinh">🎯 Cùng một ý có thể vẽ theo bốn kiểu ký hiệu — Chen, Crow's Foot (chân chim), Rein85, IDEF1X — bảng trên slide so sánh các ký hiệu của chúng.</p>
<table>
<thead><tr><th>Khái niệm</th><th>Chen</th><th>Crow's Foot</th><th>Rein85</th><th>IDEF1X</th></tr></thead>
<tbody>
<tr><td>Thực thể</td><td>chữ nhật</td><td>chữ nhật</td><td>chữ nhật</td><td>chữ nhật</td></tr>
<tr><td>Liên kết</td><td>hình thoi</td><td>chỉ một đường nối</td><td>thoi tô nửa đen</td><td>chỉ một đường nối</td></tr>
<tr><td>Tuỳ chọn (có thể không có)</td><td>vòng tròn</td><td>vòng tròn</td><td>vòng tròn</td><td>hình thoi nhỏ</td></tr>
<tr><td>Một (1)</td><td>chữ số 1</td><td>một vạch ngắn</td><td>tam giác rỗng</td><td>—</td></tr>
<tr><td>Nhiều (M)</td><td>chữ M</td><td>chân chim (ba nhánh)</td><td>tam giác tô đen</td><td>chấm tô đen</td></tr>
<tr><td>Thực thể kết hợp (composite entity — liên kết M-N được biến thành thực thể)</td><td>chữ nhật có hình thoi bên trong</td><td>chữ nhật vát góc</td><td>chữ nhật đôi</td><td>chữ nhật bo góc, tô màu</td></tr>
<tr><td>Thực thể yếu</td><td>chữ nhật đôi</td><td>chữ nhật vát góc</td><td>chữ nhật đôi</td><td>—</td></tr>
</tbody>
</table>
<p>Slide DBI202 dùng kiểu <strong>Chen</strong> (hình thoi, chữ 1 và M). Sơ đồ CSDL của SQL Server, draw.io và phần lớn công ty dùng <strong>Crow's Foot</strong>: không có hình thoi, đầu "nhiều" vẽ thành cái chĩa ba nhánh. Bạn phải đọc được cả hai: hình trong đề FE đôi khi vẽ kiểu Crow's Foot.</p>
<p class="meo">🧠 <strong>Crow's Foot:</strong> chĩa ba nằm ở phía NHIỀU, vạch ngắn ở phía MỘT, vòng tròn nghĩa là "được phép bằng 0".</p>`],
      [10, 'ERD - Entity',
        `<p class="y-chinh">🎯 An entity is a real-world thing distinguishable from others (a noun phrase), described by attributes; an entity set is the collection of similar entities, all with the same attributes, each attribute having a domain.</p>
<p>The slide's diagram: entity set <strong>Employee</strong> with three attributes — <u>ssn</u> (underlined: the key), <strong>name</strong> and <strong>lot</strong> (the parking lot number). One employee, e.g. (123-22-3666, Attishoo, 48), is an <em>entity</em>; all employees together form the <em>entity set</em> Employee.</p>
<ul>
<li><strong>Domain</strong>: the set of allowed values of an attribute — ssn is 9 digits, lot is a small integer. In SQL the domain becomes the column type plus CHECK constraints.</li>
<li>"Until we consider hierarchies" (slide text): in a subclass (slide 16) some entities have extra attributes.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> entity set ↔ table, entity ↔ row, attribute ↔ column, domain ↔ data type.</p>
<p class="dap-an">✅ <strong>Lecturers ask: "Why is ssn the key and not name?"</strong> A key must be unique for every entity, never empty and should not change. Two employees can share a name; ssn is issued once per person and never repeats. If several attributes qualify (candidate keys — e.g. ssn and email), choose the shortest, most stable one as the primary key.</p>
<div class="pitfall">Draw the key <em>inside</em> its own entity. Putting "ssn" on Works_In or on Departments is a common mistake: every attribute belongs to exactly one entity set or relationship.</div>`,
        `<p class="y-chinh">🎯 Thực thể (entity) là một vật của thế giới thực phân biệt được với vật khác (một cụm danh từ), được mô tả bằng các thuộc tính; tập thực thể (entity set) là tập các thực thể tương tự, cùng một bộ thuộc tính, mỗi thuộc tính có một miền giá trị (domain).</p>
<p>Sơ đồ trên slide: tập thực thể <strong>Employee</strong> có ba thuộc tính — <u>ssn</u> (gạch chân: khoá), <strong>name</strong> và <strong>lot</strong> (số chỗ đậu xe). Một nhân viên, vd (123-22-3666, Attishoo, 48), là một <em>thực thể</em>; mọi nhân viên gộp lại là <em>tập thực thể</em> Employee.</p>
<ul>
<li><strong>Miền giá trị (domain)</strong>: tập giá trị được phép của thuộc tính — ssn là 9 chữ số, lot là số nguyên nhỏ. Trong SQL, miền giá trị thành kiểu dữ liệu của cột cộng ràng buộc CHECK.</li>
<li>"Cho tới khi xét phân cấp" (chữ trên slide): trong lớp con (slide 16) một số thực thể có thêm thuộc tính riêng.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> tập thực thể ↔ bảng, thực thể ↔ dòng, thuộc tính ↔ cột, miền giá trị ↔ kiểu dữ liệu.</p>
<p class="dap-an">✅ <strong>Thầy hay hỏi: "Vì sao chọn ssn làm khoá mà không chọn name?"</strong> Khoá phải duy nhất với mọi thực thể, không bao giờ trống và không nên thay đổi. Hai nhân viên có thể trùng tên; ssn được cấp một lần cho mỗi người và không bao giờ lặp. Nếu có nhiều thuộc tính đủ điều kiện (khoá ứng viên — candidate key, vd ssn và email), chọn cái ngắn nhất, ổn định nhất làm khoá chính (primary key).</p>
<div class="pitfall">Vẽ khoá <em>bên trong</em> đúng thực thể của nó. Đặt "ssn" lên Works_In hay lên Departments là lỗi hay gặp: mỗi thuộc tính thuộc về đúng một tập thực thể hoặc một liên kết.</div>`],
      [11, 'Relationship',
        `<p class="y-chinh">🎯 A relationship is an association among two or more entities (a verb phrase); it can have its own descriptive attributes, a cardinality (1-1, 1-M, M-M) and a degree (unary, binary, ternary).</p>
<p>The slide's diagram: <strong>Employees</strong> (<u>ssn</u>, name, lot) — <strong>Works_In</strong> — <strong>Departments</strong> (<u>did</u>, dname, budget). The relationship Works_In has its own attribute <strong>since</strong>: the date belongs neither to the employee nor to the department, but to the pair (this employee works in this department since…). No cardinality is written on this diagram, so by default read it as many-to-many.</p>
<table>
<thead><tr><th>Term on the slide</th><th>Meaning</th><th>Example</th></tr></thead>
<tbody>
<tr><td>1-1</td><td>each A with at most one B and vice versa</td><td>Department — manager</td></tr>
<tr><td>1-M / M-1</td><td>one A with many B, each B with one A</td><td>Branch — employees</td></tr>
<tr><td>M-M</td><td>many to many</td><td>Student — Course (enrolment)</td></tr>
<tr><td>Degree constraints</td><td>minimum/maximum number of participations</td><td>a student takes 1 to 8 courses per term</td></tr>
<tr><td>Recursive relationship</td><td>an entity set related to itself</td><td>Employee supervises Employee</td></tr>
<tr><td>Unary / binary / ternary</td><td>1, 2 or 3 entity sets in the relationship</td><td>supervises / enrols / supplies(Supplier, Part, Project)</td></tr>
<tr><td>Referential integrity</td><td>a value appearing in one context must also appear in another</td><td>an employee's did must exist in Departments</td></tr>
</tbody>
</table>
<div class="pitfall">Put an attribute on the relationship only if it depends on <em>both</em> sides. <code>since</code> on Works_In is right; <code>budget</code> on Works_In would be wrong — it depends only on the department.</div>
<p class="nhan">Read every relationship in both directions — that is how you find its cardinality</p>
<table>
<thead><tr><th>Question to ask</th><th>Answer for Works_In (company rule: one department per employee)</th><th>Written on the diagram</th></tr></thead>
<tbody>
<tr><td>Starting from ONE employee: how many departments?</td><td>exactly one</td><td>1 next to Departments</td></tr>
<tr><td>Starting from ONE department: how many employees?</td><td>many</td><td>M next to Employees</td></tr>
<tr><td>Sentence</td><td>"each department has many employees; each employee works in exactly one department"</td><td>M — Works_In — 1</td></tr>
</tbody>
</table>
<p class="dap-an">✅ <strong>Lecturers ask: "What is the difference between 1-M and M-N?"</strong> Ask the question from both sides. If one side's answer is "one", it is 1-M (a foreign key); if both answers are "many" — a student takes many courses, a course has many students — it is M-N (a new table).</p>`,
        `<p class="y-chinh">🎯 Liên kết (relationship) là mối liên hệ giữa hai hay nhiều thực thể (một cụm động từ); nó có thể có thuộc tính mô tả riêng, có bản số (1-1, 1-M, M-M) và có bậc (một ngôi, hai ngôi, ba ngôi).</p>
<p>Sơ đồ trên slide: <strong>Employees</strong> (<u>ssn</u>, name, lot) — <strong>Works_In</strong> — <strong>Departments</strong> (<u>did</u>, dname, budget). Liên kết Works_In có thuộc tính riêng <strong>since</strong> (từ ngày): ngày này không thuộc nhân viên cũng không thuộc phòng, mà thuộc về cặp đôi (nhân viên này làm ở phòng này từ ngày…). Sơ đồ này không ghi bản số, nên mặc định đọc là nhiều – nhiều.</p>
<table>
<thead><tr><th>Thuật ngữ trên slide</th><th>Nghĩa</th><th>Ví dụ</th></tr></thead>
<tbody>
<tr><td>1-1 (một – một)</td><td>mỗi A với tối đa một B và ngược lại</td><td>Phòng ban — trưởng phòng</td></tr>
<tr><td>1-M / M-1 (một – nhiều)</td><td>một A với nhiều B, mỗi B với một A</td><td>Chi nhánh — nhân viên</td></tr>
<tr><td>M-M (nhiều – nhiều)</td><td>nhiều với nhiều</td><td>Sinh viên — Môn học (đăng ký học)</td></tr>
<tr><td>Degree constraints — ràng buộc số lượng</td><td>số lần tham gia tối thiểu/tối đa</td><td>mỗi kỳ sinh viên học 1 đến 8 môn</td></tr>
<tr><td>Recursive — liên kết đệ quy</td><td>một tập thực thể liên kết với chính nó</td><td>Nhân viên giám sát nhân viên</td></tr>
<tr><td>Unary / binary / ternary — một / hai / ba ngôi</td><td>1, 2 hay 3 tập thực thể tham gia</td><td>giám sát / đăng ký học / cung cấp(Nhà cung cấp, Linh kiện, Dự án)</td></tr>
<tr><td>Referential integrity — toàn vẹn tham chiếu</td><td>giá trị xuất hiện ở chỗ này thì phải có ở chỗ kia</td><td>did của nhân viên phải tồn tại trong Departments</td></tr>
</tbody>
</table>
<div class="pitfall">Chỉ đặt thuộc tính lên liên kết khi nó phụ thuộc vào <em>cả hai</em> phía. <code>since</code> trên Works_In là đúng; <code>budget</code> trên Works_In là sai — nó chỉ phụ thuộc vào phòng ban.</div>
<p class="nhan">Đọc mọi liên kết theo cả hai chiều — đó là cách tìm ra bản số</p>
<table>
<thead><tr><th>Câu cần hỏi</th><th>Trả lời cho Works_In (luật công ty: mỗi nhân viên một phòng)</th><th>Ghi trên sơ đồ</th></tr></thead>
<tbody>
<tr><td>Xuất phát từ MỘT nhân viên: bao nhiêu phòng?</td><td>đúng một</td><td>chữ 1 cạnh Departments</td></tr>
<tr><td>Xuất phát từ MỘT phòng: bao nhiêu nhân viên?</td><td>nhiều</td><td>chữ M cạnh Employees</td></tr>
<tr><td>Thành câu</td><td>"mỗi phòng ban có nhiều nhân viên; mỗi nhân viên làm ở đúng một phòng"</td><td>M — Works_In — 1</td></tr>
</tbody>
</table>
<p class="dap-an">✅ <strong>Thầy hay hỏi: "1-M khác M-N thế nào?"</strong> Hỏi từ cả hai phía. Nếu một phía trả lời "một" thì là 1-M (thành một khoá ngoại); nếu cả hai phía đều "nhiều" — một sinh viên học nhiều môn, một môn có nhiều sinh viên — thì là M-N (thành một bảng mới).</p>`],
      [12, 'Type of Attributes',
        `<p class="y-chinh">🎯 Four attribute types, each with its own symbol: key (underlined), multivalued (double oval), derived (dashed oval), composite (an oval with sub-attributes).</p>
<p>Reading the ERD on the slide:</p>
<table>
<thead><tr><th>Element</th><th>On the diagram</th><th>Type</th></tr></thead>
<tbody>
<tr><td>Employee</td><td>rectangle with <u>empID</u>, essn, ename, phone, children, Address</td><td>entity set</td></tr>
<tr><td>empID</td><td>underlined</td><td>key attribute</td></tr>
<tr><td>children</td><td>double oval</td><td>multivalued — an employee can have several children</td></tr>
<tr><td>Address</td><td>plain oval (the slide's legend lists it as composite; its parts are not drawn)</td><td>composite</td></tr>
<tr><td>Works_At</td><td>diamond between Employee (M) and Branch (1)</td><td>many-one: many employees work at one branch</td></tr>
<tr><td>since, seniority</td><td>ovals on Works_At; seniority is dashed</td><td>attributes of the relationship; seniority is derived from since</td></tr>
<tr><td>Branch</td><td>rectangle with <u>brID</u>, bname, bcity</td><td>entity set</td></tr>
<tr><td>Manage</td><td>diamond whose two lines both go to Employee</td><td>recursive relationship (an employee manages employees); no cardinality written</td></tr>
</tbody>
</table>
<p><strong>Read the diagram aloud:</strong> "each branch has many employees; each employee works at exactly one branch, since a given date"; "an employee can have several children"; "an employee can manage other employees". Common drawing mistakes: a derived attribute drawn with a solid line (it would then be stored and go stale); a multivalued attribute drawn as a single oval "children" and stored as "Mai, Nam" in one cell; since attached to Employee instead of Works_At.</p>
<p>Here is that diagram as tables (the full conversion rules come in lesson 3.B): children gets its own table, Address is split into street and city (the parts are our choice — the slide does not draw them), Works_At becomes the column brID plus since in Employee, Manage becomes managerID pointing back to Employee, and seniority is <strong>computed, never stored</strong>:</p>
<pre><code class="language-sql">CREATE TABLE Branch (                       -- strong entity: 1 entity set = 1 table
  brID  CHAR(4)      PRIMARY KEY,           -- key attribute (underlined)
  bname NVARCHAR(50) NOT NULL,
  bcity NVARCHAR(30)
);
CREATE TABLE Employee (
  empID     CHAR(5)      PRIMARY KEY,
  essn      CHAR(9),
  ename     NVARCHAR(50) NOT NULL,
  phone     VARCHAR(15),
  street    NVARCHAR(60),                   -- composite Address split into parts (our choice of parts)
  city      NVARCHAR(30),
  brID      CHAR(4)      NOT NULL REFERENCES Branch(brID),   -- Works_At: M side gets the key of the 1 side
  since     DATE,                                             -- attribute of Works_At travels with it
  managerID CHAR(5)      NULL REFERENCES Employee(empID)      -- Manage: recursive, NULL for the top boss
);
CREATE TABLE EmployeeChildren (             -- multivalued children -&gt; its own table
  empID     CHAR(5)      REFERENCES Employee(empID),
  childName NVARCHAR(50),
  PRIMARY KEY (empID, childName)
);</code></pre>
<pre><code class="language-sql">SELECT e.ename, b.bname, e.since,
       DATEDIFF(YEAR, e.since, '2026-09-30')      AS year_boundaries,  -- counts 31/12 crossings, not full years
       DATEDIFF(MONTH, e.since, '2026-09-30') / 12 AS seniority,        -- derived: computed on the fly, never stored
       m.ename AS manager,
       (SELECT COUNT(*) FROM EmployeeChildren c WHERE c.empID = e.empID) AS children
FROM Employee e
JOIN Branch b ON b.brID = e.brID
LEFT JOIN Employee m ON m.empID = e.managerID
ORDER BY e.empID;</code></pre>
<div class="out">(2 rows affected)<br>
(3 rows affected)<br>
(3 rows affected)</div>
<table>
<thead><tr><th>ename</th><th>bname</th><th>since</th><th>year_boundaries</th><th>seniority</th><th>manager</th><th>children</th></tr></thead>
<tbody>
<tr><td>Lan</td><td>FPT Hòa Lạc</td><td>2015-03-01</td><td>11</td><td>11</td><td><em>NULL</em></td><td>2</td></tr>
<tr><td>Minh</td><td>FPT Hòa Lạc</td><td>2021-09-15</td><td>5</td><td>5</td><td>Lan</td><td>1</td></tr>
<tr><td>Hùng</td><td>FPT Quận 9</td><td>2025-12-20</td><td>1</td><td>0</td><td>Lan</td><td>0</td></tr>
</tbody>
</table>
<div class="pitfall"><code>DATEDIFF(YEAR, …)</code> counts how many 31 December boundaries are crossed, not full years: Hùng joined on 2025-12-20 and gets 1 "year" on 2026-09-30 although he has worked 9 months. Count months and divide by 12 (the seniority column) when the exact number of full years matters.</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> there is no <code>DATEDIFF</code>. Full years come from <code>age(end, start)</code>; the T-SQL "year boundaries" count is a plain subtraction of <code>date_part('year', …)</code>:
<pre><code class="language-sql">CREATE TABLE branch (brid char(4) PRIMARY KEY, bname text NOT NULL, bcity text);
CREATE TABLE employee (
  empid char(5) PRIMARY KEY, ename text NOT NULL,
  brid char(4) NOT NULL REFERENCES branch(brid), since date,
  managerid char(5) REFERENCES employee(empid));
INSERT INTO branch VALUES ('HN01', 'FPT Hòa Lạc', 'Hà Nội'), ('HC01', 'FPT Quận 9', 'TP.HCM');
INSERT INTO employee VALUES ('E0001', 'Lan', 'HN01', '2015-03-01', NULL),
                            ('E0002', 'Minh', 'HN01', '2021-09-15', 'E0001'),
                            ('E0003', 'Hùng', 'HC01', '2025-12-20', 'E0001');
SELECT e.ename, e.since::text AS since,
       2026 - date_part('year', e.since)                   AS year_boundaries,  -- what T-SQL DATEDIFF(YEAR) counts
       date_part('year', age(date '2026-09-30', e.since)) AS seniority         -- age() gives full years; there is no DATEDIFF
FROM employee e
ORDER BY e.empid;</code></pre>
<div class="out">INSERT 0 2<br>
INSERT 0 3</div>
<table>
<thead><tr><th>ename</th><th>since</th><th>year_boundaries</th><th>seniority</th></tr></thead>
<tbody>
<tr><td>Lan</td><td>2015-03-01</td><td>11</td><td>11</td></tr>
<tr><td>Minh</td><td>2021-09-15</td><td>5</td><td>5</td></tr>
<tr><td>Hùng</td><td>2025-12-20</td><td>1</td><td>0</td></tr>
</tbody>
</table>
Read more: <a href="/courses/postgresql/learn?lessonSlug=postgresql-2-3-ngay-gio">PostgreSQL course — dates and times</a>.</div>`,
        `<p class="y-chinh">🎯 Bốn loại thuộc tính, mỗi loại một ký hiệu: khoá (gạch chân), đa trị (bầu dục đôi), dẫn xuất (bầu dục nét đứt), phức hợp (bầu dục có các thuộc tính con).</p>
<p>Đọc ERD trên slide:</p>
<table>
<thead><tr><th>Phần tử</th><th>Trên sơ đồ</th><th>Loại</th></tr></thead>
<tbody>
<tr><td>Employee</td><td>chữ nhật có <u>empID</u>, essn, ename, phone, children, Address</td><td>tập thực thể</td></tr>
<tr><td>empID</td><td>gạch chân</td><td>thuộc tính khoá (key)</td></tr>
<tr><td>children</td><td>bầu dục đôi</td><td>đa trị (multivalued) — một nhân viên có thể có nhiều con</td></tr>
<tr><td>Address</td><td>bầu dục thường (chú giải của slide xếp nó là phức hợp; các phần con không được vẽ)</td><td>phức hợp (composite)</td></tr>
<tr><td>Works_At</td><td>hình thoi giữa Employee (M) và Branch (1)</td><td>nhiều – một: nhiều nhân viên làm ở một chi nhánh</td></tr>
<tr><td>since, seniority</td><td>bầu dục gắn vào Works_At; seniority nét đứt</td><td>thuộc tính của liên kết; seniority (thâm niên) dẫn xuất (derived) từ since</td></tr>
<tr><td>Branch</td><td>chữ nhật có <u>brID</u>, bname, bcity</td><td>tập thực thể</td></tr>
<tr><td>Manage</td><td>hình thoi có hai đường đều nối về Employee</td><td>liên kết đệ quy (nhân viên quản lý nhân viên); không ghi bản số</td></tr>
</tbody>
</table>
<p><strong>Đọc to sơ đồ:</strong> "mỗi chi nhánh có nhiều nhân viên; mỗi nhân viên làm ở đúng một chi nhánh, kể từ một ngày nào đó"; "một nhân viên có thể có nhiều con"; "một nhân viên có thể quản lý các nhân viên khác". Lỗi vẽ hay gặp: vẽ thuộc tính dẫn xuất bằng nét liền (khi đó nó bị lưu và sẽ lỗi thời); vẽ thuộc tính đa trị thành bầu dục đơn "children" rồi lưu "Mai, Nam" vào một ô; gắn since vào Employee thay vì vào Works_At.</p>
<p>Đây là sơ đồ đó khi thành bảng (luật chuyển đầy đủ ở bài 3.B): children có bảng riêng, Address tách thành street và city (các phần là do bài tự chọn — slide không vẽ), Works_At thành cột brID cộng since trong Employee, Manage thành managerID trỏ ngược về Employee, còn seniority được <strong>tính ra, không bao giờ lưu</strong>:</p>
<pre><code class="language-sql">CREATE TABLE Branch (                       -- thực thể mạnh: 1 tập thực thể = 1 bảng
  brID  CHAR(4)      PRIMARY KEY,           -- thuộc tính khoá (gạch chân)
  bname NVARCHAR(50) NOT NULL,
  bcity NVARCHAR(30)
);
CREATE TABLE Employee (
  empID     CHAR(5)      PRIMARY KEY,
  essn      CHAR(9),
  ename     NVARCHAR(50) NOT NULL,
  phone     VARCHAR(15),
  street    NVARCHAR(60),                   -- Address phức hợp tách thành phần (chọn phần là của bài)
  city      NVARCHAR(30),
  brID      CHAR(4)      NOT NULL REFERENCES Branch(brID),   -- Works_At: phía M nhận khoá của phía 1
  since     DATE,                                             -- thuộc tính của Works_At đi theo
  managerID CHAR(5)      NULL REFERENCES Employee(empID)      -- Manage: đệ quy, NULL cho sếp cao nhất
);
CREATE TABLE EmployeeChildren (             -- thuộc tính đa trị children -&gt; bảng riêng
  empID     CHAR(5)      REFERENCES Employee(empID),
  childName NVARCHAR(50),
  PRIMARY KEY (empID, childName)
);</code></pre>
<pre><code class="language-sql">SELECT e.ename, b.bname, e.since,
       DATEDIFF(YEAR, e.since, '2026-09-30')      AS year_boundaries,  -- đếm số lần qua 31/12, không phải số năm tròn
       DATEDIFF(MONTH, e.since, '2026-09-30') / 12 AS seniority,        -- dẫn xuất: tính khi cần, không lưu
       m.ename AS manager,
       (SELECT COUNT(*) FROM EmployeeChildren c WHERE c.empID = e.empID) AS children
FROM Employee e
JOIN Branch b ON b.brID = e.brID
LEFT JOIN Employee m ON m.empID = e.managerID
ORDER BY e.empID;</code></pre>
<div class="out">(2 rows affected)<br>
(3 rows affected)<br>
(3 rows affected)</div>
<table>
<thead><tr><th>ename</th><th>bname</th><th>since</th><th>year_boundaries</th><th>seniority</th><th>manager</th><th>children</th></tr></thead>
<tbody>
<tr><td>Lan</td><td>FPT Hòa Lạc</td><td>2015-03-01</td><td>11</td><td>11</td><td><em>NULL</em></td><td>2</td></tr>
<tr><td>Minh</td><td>FPT Hòa Lạc</td><td>2021-09-15</td><td>5</td><td>5</td><td>Lan</td><td>1</td></tr>
<tr><td>Hùng</td><td>FPT Quận 9</td><td>2025-12-20</td><td>1</td><td>0</td><td>Lan</td><td>0</td></tr>
</tbody>
</table>
<div class="pitfall"><code>DATEDIFF(YEAR, …)</code> đếm số lần vượt qua ngày 31/12, không phải số năm tròn: Hùng vào làm ngày 2025-12-20 và tới 2026-09-30 được tính 1 "năm" dù mới làm 9 tháng. Khi cần đúng số năm tròn, hãy đếm tháng rồi chia 12 (cột seniority).</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> không có <code>DATEDIFF</code>. Số năm tròn lấy từ <code>age(ngày cuối, ngày đầu)</code>; còn kiểu đếm "số lần qua năm" của T-SQL chỉ là phép trừ hai <code>date_part('year', …)</code>:
<pre><code class="language-sql">CREATE TABLE branch (brid char(4) PRIMARY KEY, bname text NOT NULL, bcity text);
CREATE TABLE employee (
  empid char(5) PRIMARY KEY, ename text NOT NULL,
  brid char(4) NOT NULL REFERENCES branch(brid), since date,
  managerid char(5) REFERENCES employee(empid));
INSERT INTO branch VALUES ('HN01', 'FPT Hòa Lạc', 'Hà Nội'), ('HC01', 'FPT Quận 9', 'TP.HCM');
INSERT INTO employee VALUES ('E0001', 'Lan', 'HN01', '2015-03-01', NULL),
                            ('E0002', 'Minh', 'HN01', '2021-09-15', 'E0001'),
                            ('E0003', 'Hùng', 'HC01', '2025-12-20', 'E0001');
SELECT e.ename, e.since::text AS since,
       2026 - date_part('year', e.since)                   AS year_boundaries,  -- thứ DATEDIFF(YEAR) của T-SQL đếm
       date_part('year', age(date '2026-09-30', e.since)) AS seniority         -- age() cho số năm tròn; PG không có DATEDIFF
FROM employee e
ORDER BY e.empid;</code></pre>
<div class="out">INSERT 0 2<br>
INSERT 0 3</div>
<table>
<thead><tr><th>ename</th><th>since</th><th>year_boundaries</th><th>seniority</th></tr></thead>
<tbody>
<tr><td>Lan</td><td>2015-03-01</td><td>11</td><td>11</td></tr>
<tr><td>Minh</td><td>2021-09-15</td><td>5</td><td>5</td></tr>
<tr><td>Hùng</td><td>2025-12-20</td><td>1</td><td>0</td></tr>
</tbody>
</table>
Đọc thêm: <a href="/courses/postgresql/learn?lessonSlug=postgresql-2-3-ngay-gio">Khoá PostgreSQL — ngày và giờ</a>.</div>`],
      [13, 'Weak Entity Sets',
        `<p class="y-chinh">🎯 A weak entity set is one whose key is made, partly or wholly, of attributes of another entity set — drawn as a double rectangle linked by a double diamond to its supporting entity set.</p>
<p>The slide's diagram: <strong>Crews</strong> (double rectangle — weak) with attributes <u>number</u> and crewChief; the double diamond <strong>Unit-of</strong>; <strong>Studios</strong> (the supporting entity set) with <u>name</u> and address. Cardinality: <strong>M</strong> on the Crews side, <strong>1</strong> on the Studios side — a studio has many crews, each crew belongs to exactly one studio.</p>
<p>Why weak? Every studio numbers its crews 1, 2, 3…: "crew 1" exists at Disney and at Fox. The number alone does not identify a crew; (studio name, number) does. The key of Crews therefore <em>borrows</em> Studios.name.</p>
<table>
<thead><tr><th>Crews row</th><th>number</th><th>crewChief</th><th>studio (from Unit-of)</th></tr></thead>
<tbody>
<tr><td>a</td><td>1</td><td>Mickey</td><td>Disney</td></tr>
<tr><td>b</td><td>2</td><td>Donald</td><td>Disney</td></tr>
<tr><td>c</td><td>1</td><td>Homer</td><td>Fox</td></tr>
</tbody>
</table>
<p>Rows a and c share number 1 — only the pair (1, Disney) / (1, Fox) is unique. The CREATE TABLE is on slide 32 (lesson 3.B).</p>
<p class="meo">🧠 <strong>Remember:</strong> weak entity = "number within something" — room 101 of a hotel, crew 1 of a studio, dependent "Lan" of an employee.</p>
<p class="dap-an">✅ <strong>Lecturers ask: "What is a weak entity? Give an example."</strong> An entity set whose own attributes cannot identify its entities; it is identified together with the key of another entity set (its owner) through a many-one supporting relationship. Examples: a crew of a studio, room 101 of a hotel, a dependent of an employee. Its key = its partial key (number) + the owner's key (Studios.name).</p>
<div class="pitfall">Drawing mistakes: only the rectangle doubled but a single diamond; the M/1 swapped (a studio does not belong to a crew); or underlining "number" and calling it the full key. Many textbooks underline a partial key with a <em>dashed</em> line to show it is only part of the key; the slide uses a plain underline.</div>`,
        `<p class="y-chinh">🎯 Tập thực thể yếu (weak entity set) là tập có khoá được ghép một phần hoặc toàn bộ từ thuộc tính của một tập thực thể khác — vẽ bằng chữ nhật đôi, nối bằng hình thoi đôi tới tập thực thể hỗ trợ (supporting entity set).</p>
<p>Sơ đồ trên slide: <strong>Crews</strong> (chữ nhật đôi — yếu; crew là "tổ/đội sản xuất") có thuộc tính <u>number</u> và crewChief (tổ trưởng); hình thoi đôi <strong>Unit-of</strong> (là đơn vị của); <strong>Studios</strong> (tập thực thể hỗ trợ) có <u>name</u> và address. Bản số: <strong>M</strong> ở phía Crews, <strong>1</strong> ở phía Studios — một hãng phim có nhiều tổ, mỗi tổ thuộc đúng một hãng.</p>
<p>Vì sao yếu? Hãng nào cũng đánh số tổ 1, 2, 3…: "tổ 1" có ở Disney và cũng có ở Fox. Chỉ riêng số hiệu không xác định được một tổ; cặp (tên hãng, số hiệu) mới xác định được. Vì thế khoá của Crews phải <em>mượn</em> Studios.name.</p>
<table>
<thead><tr><th>Dòng Crews</th><th>number</th><th>crewChief</th><th>studio (lấy qua Unit-of)</th></tr></thead>
<tbody>
<tr><td>a</td><td>1</td><td>Mickey</td><td>Disney</td></tr>
<tr><td>b</td><td>2</td><td>Donald</td><td>Disney</td></tr>
<tr><td>c</td><td>1</td><td>Homer</td><td>Fox</td></tr>
</tbody>
</table>
<p>Dòng a và c cùng số 1 — chỉ cặp (1, Disney) / (1, Fox) mới là duy nhất. Câu CREATE TABLE ở slide 32 (bài 3.B).</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> thực thể yếu = "số thứ tự bên trong một cái gì đó" — phòng 101 của một khách sạn, tổ 1 của một hãng phim, người phụ thuộc "Lan" của một nhân viên.</p>
<p class="dap-an">✅ <strong>Thầy hay hỏi: "Thực thể yếu là gì? Lấy ví dụ."</strong> Là tập thực thể mà thuộc tính của chính nó không xác định được từng thực thể; phải xác định cùng với khoá của một tập thực thể khác (chủ của nó) qua một liên kết hỗ trợ nhiều – một. Ví dụ: tổ sản xuất của một hãng phim, phòng 101 của một khách sạn, người phụ thuộc của một nhân viên. Khoá của nó = khoá bộ phận (partial key — number) + khoá của chủ (Studios.name).</p>
<div class="pitfall">Lỗi vẽ: chỉ nhân đôi hình chữ nhật mà hình thoi vẫn đơn; đảo M và 1 (hãng phim không thuộc về tổ); hoặc gạch chân "number" rồi coi đó là cả khoá. Nhiều sách gạch chân khoá bộ phận bằng nét <em>đứt</em> để cho biết nó chỉ là một phần của khoá; slide dùng gạch chân thường.</div>`],
      [14, 'Requirements for Weak Entity Sets',
        `<p class="y-chinh">🎯 R (from weak E to F) is a supporting relationship only if it is binary and many-one from E to F, has referential integrity from E to F, and F supplies key attributes of F to the key of E.</p>
<table>
<thead><tr><th>Condition on the slide</th><th>Checked on Crews — Unit-of — Studios</th></tr></thead>
<tbody>
<tr><td>R is a binary, many-one relationship from E to F</td><td>Unit-of links 2 entity sets; many crews → one studio ✓</td></tr>
<tr><td>R has referential integrity from E to F</td><td>every crew's studio must exist — no crew without a studio ✓</td></tr>
<tr><td>The attributes F supplies for E's key are key attributes of F</td><td>Crews borrows Studios.<u>name</u>, the key of Studios ✓</td></tr>
</tbody>
</table>
<p>If any condition fails, the entity set is not weak in the E/R sense. For example, if a crew could move between studios, Unit-of would not identify it and crews would need their own global id.</p>
<p class="dap-an">✅ <strong>In SQL:</strong> condition 2 becomes <code>studioName … NOT NULL REFERENCES Studios(name)</code>; condition 3 becomes <code>PRIMARY KEY (number, studioName)</code>.</p>`,
        `<p class="y-chinh">🎯 R (từ tập yếu E tới F) chỉ là liên kết hỗ trợ khi nó hai ngôi và nhiều – một từ E tới F, có toàn vẹn tham chiếu từ E tới F, và thuộc tính F đóng góp vào khoá của E phải là thuộc tính khoá của F.</p>
<table>
<thead><tr><th>Điều kiện trên slide</th><th>Kiểm trên Crews — Unit-of — Studios</th></tr></thead>
<tbody>
<tr><td>R là liên kết hai ngôi (binary), nhiều – một từ E tới F</td><td>Unit-of nối 2 tập thực thể; nhiều tổ → một hãng ✓</td></tr>
<tr><td>R có toàn vẹn tham chiếu (referential integrity) từ E tới F</td><td>hãng của mọi tổ phải tồn tại — không có tổ nào thiếu hãng ✓</td></tr>
<tr><td>Thuộc tính F đóng góp cho khoá của E phải là thuộc tính khoá của F</td><td>Crews mượn Studios.<u>name</u>, chính là khoá của Studios ✓</td></tr>
</tbody>
</table>
<p>Nếu một điều kiện không thoả thì tập thực thể đó không phải yếu theo nghĩa E/R. Ví dụ, nếu một tổ có thể chuyển giữa các hãng thì Unit-of không còn xác định được tổ, và tổ cần mã riêng toàn cục.</p>
<p class="dap-an">✅ <strong>Trong SQL:</strong> điều kiện 2 thành <code>studioName … NOT NULL REFERENCES Studios(name)</code>; điều kiện 3 thành <code>PRIMARY KEY (number, studioName)</code>.</p>`],
      [15, 'Example weak entity set',
        `<p class="y-chinh">🎯 Contracts is a weak entity set with three supporting relationships — Star-of, Studio-of, Movie-of — so its key is made entirely of borrowed keys: star name + studio name + movie title + year.</p>
<p>The slide's diagram: <strong>Contracts</strong> (double rectangle, own attribute <strong>salary</strong>, marked M) linked by three double diamonds to <strong>Stars</strong> (<u>name</u>, addr), <strong>Studios</strong> (<u>name</u>, addr) and <strong>Movies</strong> (<u>title</u>, <u>year</u>, length, genre), each with 1 on the strong side. A contract = one star, one studio, one movie. salary is not a key — Contracts has no key attribute of its own at all.</p>
<p>Why model it this way instead of a 3-way relationship? A contract is a "thing" with its own data (salary) that other parts of a design could refer to. Converted:</p>
<pre><code class="language-sql">CREATE TABLE Stars   (name VARCHAR(40) PRIMARY KEY, addr VARCHAR(60));
CREATE TABLE Studios (name VARCHAR(40) PRIMARY KEY, addr VARCHAR(60));
CREATE TABLE Movies  (title VARCHAR(60), year INT, length INT, genre VARCHAR(20),
                      PRIMARY KEY (title, year));
CREATE TABLE Contracts (                    -- weak: its key is borrowed from 3 supporting entity sets
  starName   VARCHAR(40) REFERENCES Stars(name),      -- via Star-of
  studioName VARCHAR(40) REFERENCES Studios(name),    -- via Studio-of
  title      VARCHAR(60),
  year       INT,
  salary     DECIMAL(12,2),                           -- its only own attribute
  PRIMARY KEY (starName, studioName, title, year),
  FOREIGN KEY (title, year) REFERENCES Movies(title, year)   -- via Movie-of
);</code></pre>
<div class="out">(2 rows affected)<br>
(2 rows affected)<br>
(1 row affected)<br>
(2 rows affected)</div>
<table>
<thead><tr><th>starName</th><th>studioName</th><th>title</th><th>year</th><th>salary</th></tr></thead>
<tbody>
<tr><td>Carrie Fisher</td><td>Fox</td><td>Star Wars</td><td>1977</td><td>100000.00</td></tr>
<tr><td>Mark Hamill</td><td>Fox</td><td>Star Wars</td><td>1977</td><td>120000.00</td></tr>
</tbody>
</table>
<div class="out"><b>Msg 547, Level 16, State 0<br>
The INSERT statement conflicted with the FOREIGN KEY constraint "FK__Contracts__0FB73529". The conflict occurred in database "DBI202", table "dbo.Movies".</b><br>
The statement has been terminated.</div>
<p>The last INSERT fails on purpose: (Star Wars, 1978) is not a movie, so referential integrity through Movie-of refuses the contract.</p>
<div class="pitfall">The movie key is two attributes, so the foreign key must be written as one composite constraint, <code>FOREIGN KEY (title, year) REFERENCES Movies(title, year)</code>. Two separate foreign keys on title and on year do not compile (neither column alone is a key of Movies).</div>`,
        `<p class="y-chinh">🎯 Contracts (hợp đồng) là tập thực thể yếu có ba liên kết hỗ trợ — Star-of, Studio-of, Movie-of — nên khoá của nó toàn bộ là khoá mượn: tên diễn viên + tên hãng + tên phim + năm.</p>
<p>Sơ đồ trên slide: <strong>Contracts</strong> (chữ nhật đôi, thuộc tính riêng <strong>salary</strong> — thù lao, ghi M) nối bằng ba hình thoi đôi tới <strong>Stars</strong> (<u>name</u>, addr), <strong>Studios</strong> (<u>name</u>, addr) và <strong>Movies</strong> (<u>title</u>, <u>year</u>, length, genre), mỗi phía thực thể mạnh ghi 1. Một hợp đồng = một diễn viên, một hãng, một phim. salary không phải khoá — Contracts không có thuộc tính khoá riêng nào cả.</p>
<p>Vì sao mô hình hoá như vậy thay vì một liên kết ba ngôi? Vì hợp đồng là một "vật" có dữ liệu riêng (salary) mà các phần khác của thiết kế có thể tham chiếu tới. Khi chuyển thành bảng:</p>
<pre><code class="language-sql">CREATE TABLE Stars   (name VARCHAR(40) PRIMARY KEY, addr VARCHAR(60));
CREATE TABLE Studios (name VARCHAR(40) PRIMARY KEY, addr VARCHAR(60));
CREATE TABLE Movies  (title VARCHAR(60), year INT, length INT, genre VARCHAR(20),
                      PRIMARY KEY (title, year));
CREATE TABLE Contracts (                    -- yếu: khoá mượn từ 3 tập thực thể hỗ trợ
  starName   VARCHAR(40) REFERENCES Stars(name),      -- qua Star-of
  studioName VARCHAR(40) REFERENCES Studios(name),    -- qua Studio-of
  title      VARCHAR(60),
  year       INT,
  salary     DECIMAL(12,2),                           -- thuộc tính riêng duy nhất
  PRIMARY KEY (starName, studioName, title, year),
  FOREIGN KEY (title, year) REFERENCES Movies(title, year)   -- qua Movie-of
);</code></pre>
<div class="out">(2 rows affected)<br>
(2 rows affected)<br>
(1 row affected)<br>
(2 rows affected)</div>
<table>
<thead><tr><th>starName</th><th>studioName</th><th>title</th><th>year</th><th>salary</th></tr></thead>
<tbody>
<tr><td>Carrie Fisher</td><td>Fox</td><td>Star Wars</td><td>1977</td><td>100000.00</td></tr>
<tr><td>Mark Hamill</td><td>Fox</td><td>Star Wars</td><td>1977</td><td>120000.00</td></tr>
</tbody>
</table>
<div class="out"><b>Msg 547, Level 16, State 0<br>
The INSERT statement conflicted with the FOREIGN KEY constraint "FK__Contracts__0FB73529". The conflict occurred in database "DBI202", table "dbo.Movies".</b><br>
The statement has been terminated.</div>
<p>Câu INSERT cuối cố ý lỗi: (Star Wars, 1978) không phải phim nào cả, nên toàn vẹn tham chiếu qua Movie-of từ chối hợp đồng đó.</p>
<div class="pitfall">Khoá của phim gồm hai thuộc tính, nên khoá ngoại phải viết thành một ràng buộc ghép: <code>FOREIGN KEY (title, year) REFERENCES Movies(title, year)</code>. Viết hai khoá ngoại riêng trên title và trên year sẽ không chạy (riêng cột nào cũng không phải khoá của Movies).</div>`],
      [16, 'Subclasses in E/R Model',
        `<p class="y-chinh">🎯 Cartoons and Murder Mysteries are special kinds of Movies: they are drawn as subclasses joined by "isa" triangles, inherit all attributes of Movies and add their own.</p>
<p>Reading the diagram:</p>
<table>
<thead><tr><th>Entity set</th><th>Attributes / relationships on the slide</th></tr></thead>
<tbody>
<tr><td>Movies (root)</td><td>length, title, year, genre</td></tr>
<tr><td>Cartoons — isa Movies</td><td>no own attribute; takes part in the relationship <strong>Voices</strong> with Stars ("to Stars")</td></tr>
<tr><td>Murder Mysteries — isa Movies</td><td>own attribute <strong>weapon</strong></td></tr>
</tbody>
</table>
<p>"isa" reads "is a": a cartoon <em>is a</em> movie. A subclass entity has every attribute of its superclass plus its own; a movie can also be in both subclasses (a cartoon murder mystery such as "Who Framed Roger Rabbit"). Lesson 3.C (slides 33–38) turns this tree into tables in three different ways.</p>
<div class="pitfall">Use a subclass only when the special kind has its own attributes or relationships. "Movie genre = cartoon" alone is just a value of genre, not a subclass.</div>
<p><strong>Read it aloud:</strong> "every cartoon is a movie, and cartoons have voices by stars"; "every murder mystery is a movie that has a weapon". The triangle points from the subclass up to the superclass. Drawing mistakes: a diamond "isa" (isa is not a relationship with its own table rows), or repeating title and year on the subclasses — they are inherited, never drawn again.</p>`,
        `<p class="y-chinh">🎯 Cartoons (phim hoạt hình) và Murder Mysteries (phim trinh thám án mạng) là những loại phim đặc biệt: vẽ thành lớp con (subclass) nối bằng tam giác "isa", kế thừa mọi thuộc tính của Movies và thêm thuộc tính riêng.</p>
<p>Đọc sơ đồ:</p>
<table>
<thead><tr><th>Tập thực thể</th><th>Thuộc tính / liên kết trên slide</th></tr></thead>
<tbody>
<tr><td>Movies (gốc)</td><td>length, title, year, genre</td></tr>
<tr><td>Cartoons — isa Movies</td><td>không có thuộc tính riêng; tham gia liên kết <strong>Voices</strong> (lồng tiếng) với Stars ("to Stars")</td></tr>
<tr><td>Murder Mysteries — isa Movies</td><td>thuộc tính riêng <strong>weapon</strong> (hung khí)</td></tr>
</tbody>
</table>
<p>"isa" đọc là "is a" — "là một": một phim hoạt hình <em>là một</em> phim. Thực thể của lớp con có mọi thuộc tính của lớp cha (superclass) cộng thuộc tính riêng; một phim cũng có thể thuộc cả hai lớp con (phim hoạt hình trinh thám như "Who Framed Roger Rabbit"). Bài 3.C (slide 33–38) biến cây này thành bảng theo ba cách khác nhau.</p>
<div class="pitfall">Chỉ dùng lớp con khi loại đặc biệt có thuộc tính hoặc liên kết riêng. Chỉ "thể loại phim = hoạt hình" thì chỉ là một giá trị của genre, không phải lớp con.</div>
<p><strong>Đọc to:</strong> "mọi phim hoạt hình đều là một phim, và phim hoạt hình có diễn viên lồng tiếng"; "mọi phim trinh thám là một phim có hung khí". Tam giác đi từ lớp con lên lớp cha. Lỗi vẽ: vẽ "isa" thành hình thoi (isa không phải liên kết có dòng dữ liệu riêng), hoặc vẽ lại title và year ở các lớp con — chúng được kế thừa, không bao giờ vẽ lại.</p>`],
      [17, 'Example COMPANY Database – Construct ERD',
        `<p class="y-chinh">🎯 An exercise in PE style: from the requirements of a company, build the ERD — first paragraph: departments and projects.</p>
<p>Apply the recipe of slide 7 to the two sentences:</p>
<table>
<thead><tr><th>Phrase in the requirement</th><th>ERD element</th></tr></thead>
<tbody>
<tr><td>"organized into DEPARTMENTs"</td><td>entity DEPARTMENT</td></tr>
<tr><td>"has a name, number"</td><td>attributes Dname, <u>Dnumber</u> (the number identifies the department)</td></tr>
<tr><td>"an employee who <em>manages</em> the department"</td><td>relationship MANAGES between EMPLOYEE and DEPARTMENT, 1-1 (one manager per department; the requirement implies an employee manages at most one)</td></tr>
<tr><td>"the start date of the department manager"</td><td>attribute Mgr_start_date on MANAGES — it belongs to the pair</td></tr>
<tr><td>"each department <em>controls</em> a number of PROJECTs"</td><td>relationship CONTROLS, DEPARTMENT 1 — N PROJECT</td></tr>
<tr><td>"a project has a name, number and … a single location"</td><td>entity PROJECT: Pname, <u>Pnumber</u>, Plocation (single-valued)</td></tr>
</tbody>
</table>
<p class="meo">🧠 <strong>Words in italics are the verbs</strong> the author wants you to turn into relationships: manages, controls — and on the next slide works for, work on, supervisor, have.</p>`,
        `<p class="y-chinh">🎯 Một bài tập đúng kiểu PE: từ yêu cầu của một công ty, dựng ERD — đoạn đầu: phòng ban và dự án.</p>
<p>Áp công thức ở slide 7 vào hai câu:</p>
<table>
<thead><tr><th>Cụm từ trong yêu cầu</th><th>Phần tử ERD</th></tr></thead>
<tbody>
<tr><td>"được tổ chức thành các DEPARTMENT (phòng ban)"</td><td>thực thể DEPARTMENT</td></tr>
<tr><td>"có tên, số hiệu"</td><td>thuộc tính Dname, <u>Dnumber</u> (số hiệu xác định phòng)</td></tr>
<tr><td>"một nhân viên <em>quản lý</em> (manages) phòng"</td><td>liên kết MANAGES giữa EMPLOYEE và DEPARTMENT, 1-1 (mỗi phòng một trưởng phòng; yêu cầu ngầm hiểu một người quản lý tối đa một phòng)</td></tr>
<tr><td>"ngày bắt đầu của trưởng phòng"</td><td>thuộc tính Mgr_start_date trên MANAGES — nó thuộc về cặp đôi</td></tr>
<tr><td>"mỗi phòng <em>điều hành</em> (controls) một số PROJECT (dự án)"</td><td>liên kết CONTROLS, DEPARTMENT 1 — N PROJECT</td></tr>
<tr><td>"dự án có tên, số hiệu và … đặt tại một địa điểm duy nhất"</td><td>thực thể PROJECT: Pname, <u>Pnumber</u>, Plocation (đơn trị)</td></tr>
</tbody>
</table>
<p class="meo">🧠 <strong>Các chữ in nghiêng là động từ</strong> mà người ra đề muốn bạn biến thành liên kết: manages, controls — và ở slide sau là works for, work on, supervisor, have.</p>`],
      [18, 'Example COMPANY Database (Cont.)',
        `<p class="y-chinh">🎯 Second paragraph: employees, the projects they work on (with hours), their supervisor and their dependents — which completes a 4-entity, 6-relationship ERD.</p>
<table>
<thead><tr><th>Phrase in the requirement</th><th>ERD element</th></tr></thead>
<tbody>
<tr><td>"each EMPLOYEE's social security number, address, salary, sex, birthdate"</td><td>entity EMPLOYEE: <u>Ssn</u>, Address, Salary, Sex, Bdate</td></tr>
<tr><td>"works for one department"</td><td>WORKS_FOR: EMPLOYEE N — 1 DEPARTMENT</td></tr>
<tr><td>"may work on several projects … hours per week … on each project"</td><td>WORKS_ON: EMPLOYEE M — N PROJECT, attribute Hours on the relationship</td></tr>
<tr><td>"the direct supervisor of each employee"</td><td>SUPERVISION: recursive, EMPLOYEE (supervisor) 1 — N EMPLOYEE (supervisee)</td></tr>
<tr><td>"may have a number of DEPENDENTs … name, sex, birthdate, relationship"</td><td>weak entity DEPENDENT (Dependent_name partial key, Sex, Bdate, Relationship); supporting DEPENDENTS_OF: EMPLOYEE 1 — N DEPENDENT</td></tr>
</tbody>
</table>
<p class="nhan">The whole ERD in text (Chen style; [[ ]] = weak entity, &lt;&lt; &gt;&gt; = supporting relationship)</p>
<pre><code class="language-plaintext">[EMPLOYEE] Ssn*, Fname, Lname, Bdate, Address, Sex, Salary
  │ N ──&lt;WORKS_FOR&gt;── 1 [DEPARTMENT] Dnumber*, Dname
  │ 1 ──&lt;MANAGES (Mgr_start_date)&gt;── 1 [DEPARTMENT]
  │ M ──&lt;WORKS_ON (Hours)&gt;── N [PROJECT] Pnumber*, Pname, Plocation
  │ 1 (supervisor) ──&lt;SUPERVISION&gt;── N (supervisee) [EMPLOYEE]
  │ 1 ══&lt;&lt;DEPENDENTS_OF&gt;&gt;══ N [[DEPENDENT]] Dependent_name (partial), Sex, Bdate, Relationship
[DEPARTMENT] 1 ──&lt;CONTROLS&gt;── N [PROJECT]
                                              * = key attribute</code></pre>
<p>The slide's text lists no name for employees; the original COMPANY exercise (Elmasri &amp; Navathe) has one, and a real design needs it, so Fname/Lname are added. Converted with the rules of lesson 3.B, the ERD gives <strong>5 tables</strong>: 4 for the entity sets, 1 for the M-N WORKS_ON; the 1-N and 1-1 relationships become foreign-key columns. DEPARTMENT and EMPLOYEE point at each other, so one foreign key is added afterwards with ALTER TABLE:</p>
<pre><code class="language-sql">CREATE TABLE EMPLOYEE (
  Ssn       CHAR(9)       PRIMARY KEY,
  Fname     NVARCHAR(20)  NOT NULL,        -- the slide forgets the name; we add it
  Lname     NVARCHAR(20)  NOT NULL,
  Bdate     DATE,
  Address   NVARCHAR(60),
  Sex       CHAR(1)       CHECK (Sex IN ('M', 'F')),
  Salary    DECIMAL(10,2),
  Super_ssn CHAR(9)       NULL REFERENCES EMPLOYEE(Ssn),    -- SUPERVISION: recursive 1-N
  Dno       INT           NOT NULL                          -- WORKS_FOR: N-1, FK added below
);
CREATE TABLE DEPARTMENT (
  Dnumber        INT           PRIMARY KEY,
  Dname          NVARCHAR(30)  NOT NULL,
  Mgr_ssn        CHAR(9)       NOT NULL UNIQUE REFERENCES EMPLOYEE(Ssn),  -- MANAGES: 1-1, total on DEPARTMENT
  Mgr_start_date DATE                                                     -- attribute of MANAGES
);
ALTER TABLE EMPLOYEE ADD CONSTRAINT fk_emp_dept      -- the two tables point at each other
  FOREIGN KEY (Dno) REFERENCES DEPARTMENT(Dnumber);
CREATE TABLE PROJECT (
  Pnumber   INT          PRIMARY KEY,
  Pname     NVARCHAR(30) NOT NULL,
  Plocation NVARCHAR(30),                   -- "located at a single location"
  Dnum      INT          NOT NULL REFERENCES DEPARTMENT(Dnumber)   -- CONTROLS: N-1
);
CREATE TABLE WORKS_ON (                     -- M-N: its own table, key = both keys
  Essn  CHAR(9) REFERENCES EMPLOYEE(Ssn),
  Pno   INT     REFERENCES PROJECT(Pnumber),
  Hours DECIMAL(4,1),                       -- hours per week
  PRIMARY KEY (Essn, Pno)
);
CREATE TABLE DEPENDENT (                    -- weak entity: key = owner key + partial key
  Essn           CHAR(9)      REFERENCES EMPLOYEE(Ssn) ON DELETE CASCADE,
  Dependent_name NVARCHAR(30),
  Sex            CHAR(1),
  Bdate          DATE,
  Relationship   NVARCHAR(20),
  PRIMARY KEY (Essn, Dependent_name)
);</code></pre>
<pre><code class="language-sql">ALTER TABLE EMPLOYEE NOCHECK CONSTRAINT fk_emp_dept;             -- switch the check off
INSERT INTO EMPLOYEE (Ssn, Fname, Lname, Dno) VALUES ('123456789', N'John', N'Smith', 5);
INSERT INTO DEPARTMENT VALUES (5, N'Research', '123456789', '2026-01-01');
ALTER TABLE EMPLOYEE WITH CHECK CHECK CONSTRAINT fk_emp_dept;    -- back on, and re-verify existing rows
SELECT e.Fname, d.Dname, d.Mgr_ssn FROM EMPLOYEE e JOIN DEPARTMENT d ON d.Dnumber = e.Dno;</code></pre>
<table>
<thead><tr><th>TABLE_NAME</th><th>columns</th></tr></thead>
<tbody>
<tr><td>DEPARTMENT</td><td>4</td></tr>
<tr><td>DEPENDENT</td><td>5</td></tr>
<tr><td>EMPLOYEE</td><td>9</td></tr>
<tr><td>PROJECT</td><td>4</td></tr>
<tr><td>WORKS_ON</td><td>3</td></tr>
</tbody>
</table>
<div class="out">(1 row affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>Fname</th><th>Dname</th><th>Mgr_ssn</th></tr></thead>
<tbody>
<tr><td>John</td><td>Research</td><td>123456789</td></tr>
</tbody>
</table>
<div class="pitfall">Two classic PE mistakes here: (1) creating a table for WORKS_FOR or SUPERVISION — a 1-N relationship is only a foreign key; (2) giving DEPENDENT the key Dependent_name alone — two employees can both have a child called "Lan", so the key is (Essn, Dependent_name).</div>
<p class="dap-an">✅ <strong>Lecturers ask: "EMPLOYEE needs a department and DEPARTMENT needs a manager — which row do you insert first?"</strong> In SQL Server neither order works while both foreign keys are checked, so switch one check off (<code>ALTER TABLE … NOCHECK CONSTRAINT fk_emp_dept</code>), insert both rows, then switch it back on <code>WITH CHECK</code> so that SQL Server re-verifies the rows — the second script block above does exactly this. (Another way: allow Dno to be NULL, insert the employee, then fill in Dno.)</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong> the clean answer exists: declare the foreign key <code>DEFERRABLE INITIALLY DEFERRED</code>. It is then checked at COMMIT, so inside one transaction you can insert the employee of department 5 before department 5 itself. SQL Server has no deferrable constraints:
<pre><code class="language-sql">CREATE TABLE employee (
  ssn char(9) PRIMARY KEY, fname varchar(20) NOT NULL, lname varchar(20) NOT NULL,
  super_ssn char(9) REFERENCES employee,
  dno int NOT NULL
);
CREATE TABLE department (
  dnumber int PRIMARY KEY, dname varchar(30) NOT NULL,
  mgr_ssn char(9) NOT NULL UNIQUE REFERENCES employee, mgr_start_date date
);
ALTER TABLE employee ADD CONSTRAINT fk_emp_dept FOREIGN KEY (dno) REFERENCES department
  DEFERRABLE INITIALLY DEFERRED;            -- checked at COMMIT, not at each INSERT
BEGIN;
INSERT INTO employee VALUES ('123456789', 'John', 'Smith', NULL, 5);    -- department 5 does not exist yet
INSERT INTO department VALUES (5, 'Research', '123456789', '2026-01-01');
COMMIT;                                     -- now both rows exist: the deferred check passes
SELECT e.fname, d.dname FROM employee e JOIN department d ON d.dnumber = e.dno;</code></pre>
<div class="out">INSERT 0 1<br>
INSERT 0 1</div>
<table>
<thead><tr><th>fname</th><th>dname</th></tr></thead>
<tbody>
<tr><td>John</td><td>Research</td></tr>
</tbody>
</table>
Read more: <a href="/courses/postgresql/learn?lessonSlug=postgresql-11-1-giao-dich">PostgreSQL course — transactions</a>.</div>`,
        `<p class="y-chinh">🎯 Đoạn thứ hai: nhân viên, các dự án họ tham gia (kèm số giờ), người giám sát và người phụ thuộc — hoàn chỉnh một ERD 4 thực thể, 6 liên kết.</p>
<table>
<thead><tr><th>Cụm từ trong yêu cầu</th><th>Phần tử ERD</th></tr></thead>
<tbody>
<tr><td>"mã an sinh xã hội (SSN), địa chỉ, lương, giới tính, ngày sinh của mỗi EMPLOYEE"</td><td>thực thể EMPLOYEE: <u>Ssn</u>, Address, Salary, Sex, Bdate</td></tr>
<tr><td>"làm việc cho một phòng"</td><td>WORKS_FOR: EMPLOYEE N — 1 DEPARTMENT</td></tr>
<tr><td>"có thể làm nhiều dự án … số giờ mỗi tuần … trên từng dự án"</td><td>WORKS_ON: EMPLOYEE M — N PROJECT, thuộc tính Hours nằm trên liên kết</td></tr>
<tr><td>"người giám sát trực tiếp của mỗi nhân viên"</td><td>SUPERVISION: đệ quy, EMPLOYEE (người giám sát) 1 — N EMPLOYEE (người bị giám sát)</td></tr>
<tr><td>"có thể có nhiều DEPENDENT (người phụ thuộc) … tên, giới tính, ngày sinh, quan hệ"</td><td>thực thể yếu DEPENDENT (Dependent_name là khoá bộ phận, Sex, Bdate, Relationship); liên kết hỗ trợ DEPENDENTS_OF: EMPLOYEE 1 — N DEPENDENT</td></tr>
</tbody>
</table>
<p class="nhan">Cả ERD dạng chữ (kiểu Chen; [[ ]] = thực thể yếu, &lt;&lt; &gt;&gt; = liên kết hỗ trợ)</p>
<pre><code class="language-plaintext">[EMPLOYEE] Ssn*, Fname, Lname, Bdate, Address, Sex, Salary
  │ N ──&lt;WORKS_FOR&gt;── 1 [DEPARTMENT] Dnumber*, Dname
  │ 1 ──&lt;MANAGES (Mgr_start_date)&gt;── 1 [DEPARTMENT]
  │ M ──&lt;WORKS_ON (Hours)&gt;── N [PROJECT] Pnumber*, Pname, Plocation
  │ 1 (người giám sát) ──&lt;SUPERVISION&gt;── N (người bị giám sát) [EMPLOYEE]
  │ 1 ══&lt;&lt;DEPENDENTS_OF&gt;&gt;══ N [[DEPENDENT]] Dependent_name (bộ phận), Sex, Bdate, Relationship
[DEPARTMENT] 1 ──&lt;CONTROLS&gt;── N [PROJECT]
                                              * = thuộc tính khoá</code></pre>
<p>Chữ trên slide không nhắc tên nhân viên; bài COMPANY gốc (Elmasri &amp; Navathe) có, và thiết kế thật thì cần, nên bài thêm Fname/Lname. Chuyển bằng các luật của bài 3.B, ERD cho ra <strong>5 bảng</strong>: 4 bảng cho các tập thực thể, 1 bảng cho liên kết M-N WORKS_ON; các liên kết 1-N và 1-1 thành cột khoá ngoại. DEPARTMENT và EMPLOYEE trỏ vào nhau, nên một khoá ngoại được thêm sau bằng ALTER TABLE:</p>
<pre><code class="language-sql">CREATE TABLE EMPLOYEE (
  Ssn       CHAR(9)       PRIMARY KEY,
  Fname     NVARCHAR(20)  NOT NULL,        -- slide quên tên; bài thêm vào
  Lname     NVARCHAR(20)  NOT NULL,
  Bdate     DATE,
  Address   NVARCHAR(60),
  Sex       CHAR(1)       CHECK (Sex IN ('M', 'F')),
  Salary    DECIMAL(10,2),
  Super_ssn CHAR(9)       NULL REFERENCES EMPLOYEE(Ssn),    -- SUPERVISION: đệ quy 1-N
  Dno       INT           NOT NULL                          -- WORKS_FOR: N-1, khoá ngoại thêm ở dưới
);
CREATE TABLE DEPARTMENT (
  Dnumber        INT           PRIMARY KEY,
  Dname          NVARCHAR(30)  NOT NULL,
  Mgr_ssn        CHAR(9)       NOT NULL UNIQUE REFERENCES EMPLOYEE(Ssn),  -- MANAGES: 1-1, DEPARTMENT tham gia toàn phần
  Mgr_start_date DATE                                                     -- thuộc tính của MANAGES
);
ALTER TABLE EMPLOYEE ADD CONSTRAINT fk_emp_dept      -- hai bảng trỏ vào nhau
  FOREIGN KEY (Dno) REFERENCES DEPARTMENT(Dnumber);
CREATE TABLE PROJECT (
  Pnumber   INT          PRIMARY KEY,
  Pname     NVARCHAR(30) NOT NULL,
  Plocation NVARCHAR(30),                   -- "đặt tại đúng một địa điểm"
  Dnum      INT          NOT NULL REFERENCES DEPARTMENT(Dnumber)   -- CONTROLS: N-1
);
CREATE TABLE WORKS_ON (                     -- M-N: bảng riêng, khoá = hai khoá
  Essn  CHAR(9) REFERENCES EMPLOYEE(Ssn),
  Pno   INT     REFERENCES PROJECT(Pnumber),
  Hours DECIMAL(4,1),                       -- số giờ mỗi tuần
  PRIMARY KEY (Essn, Pno)
);
CREATE TABLE DEPENDENT (                    -- thực thể yếu: khoá = khoá chủ + khoá bộ phận
  Essn           CHAR(9)      REFERENCES EMPLOYEE(Ssn) ON DELETE CASCADE,
  Dependent_name NVARCHAR(30),
  Sex            CHAR(1),
  Bdate          DATE,
  Relationship   NVARCHAR(20),
  PRIMARY KEY (Essn, Dependent_name)
);</code></pre>
<pre><code class="language-sql">ALTER TABLE EMPLOYEE NOCHECK CONSTRAINT fk_emp_dept;             -- tạm tắt kiểm tra
INSERT INTO EMPLOYEE (Ssn, Fname, Lname, Dno) VALUES ('123456789', N'John', N'Smith', 5);
INSERT INTO DEPARTMENT VALUES (5, N'Research', '123456789', '2026-01-01');
ALTER TABLE EMPLOYEE WITH CHECK CHECK CONSTRAINT fk_emp_dept;    -- bật lại và kiểm lại các dòng đã có
SELECT e.Fname, d.Dname, d.Mgr_ssn FROM EMPLOYEE e JOIN DEPARTMENT d ON d.Dnumber = e.Dno;</code></pre>
<table>
<thead><tr><th>TABLE_NAME</th><th>columns</th></tr></thead>
<tbody>
<tr><td>DEPARTMENT</td><td>4</td></tr>
<tr><td>DEPENDENT</td><td>5</td></tr>
<tr><td>EMPLOYEE</td><td>9</td></tr>
<tr><td>PROJECT</td><td>4</td></tr>
<tr><td>WORKS_ON</td><td>3</td></tr>
</tbody>
</table>
<div class="out">(1 row affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>Fname</th><th>Dname</th><th>Mgr_ssn</th></tr></thead>
<tbody>
<tr><td>John</td><td>Research</td><td>123456789</td></tr>
</tbody>
</table>
<div class="pitfall">Hai lỗi PE kinh điển ở đây: (1) tạo bảng riêng cho WORKS_FOR hay SUPERVISION — liên kết 1-N chỉ là một khoá ngoại; (2) cho DEPENDENT khoá là Dependent_name một mình — hai nhân viên đều có thể có con tên "Lan", nên khoá là (Essn, Dependent_name).</div>
<p class="dap-an">✅ <strong>Thầy hay hỏi: "EMPLOYEE cần có phòng, DEPARTMENT cần có trưởng phòng — chèn dòng nào trước?"</strong> Trên SQL Server, khi cả hai khoá ngoại đều đang được kiểm thì thứ tự nào cũng lỗi, nên tạm tắt một phép kiểm (<code>ALTER TABLE … NOCHECK CONSTRAINT fk_emp_dept</code>), chèn cả hai dòng, rồi bật lại kèm <code>WITH CHECK</code> để SQL Server kiểm lại các dòng — khối script thứ hai ở trên làm đúng việc đó. (Cách khác: cho Dno được NULL, chèn nhân viên trước, rồi điền Dno sau.)</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> có lời giải gọn: khai báo khoá ngoại <code>DEFERRABLE INITIALLY DEFERRED</code> (kiểm hoãn). Khi đó nó được kiểm lúc COMMIT, nên trong một giao dịch bạn chèn được nhân viên của phòng 5 trước cả phòng 5. SQL Server không có ràng buộc kiểm hoãn:
<pre><code class="language-sql">CREATE TABLE employee (
  ssn char(9) PRIMARY KEY, fname varchar(20) NOT NULL, lname varchar(20) NOT NULL,
  super_ssn char(9) REFERENCES employee,
  dno int NOT NULL
);
CREATE TABLE department (
  dnumber int PRIMARY KEY, dname varchar(30) NOT NULL,
  mgr_ssn char(9) NOT NULL UNIQUE REFERENCES employee, mgr_start_date date
);
ALTER TABLE employee ADD CONSTRAINT fk_emp_dept FOREIGN KEY (dno) REFERENCES department
  DEFERRABLE INITIALLY DEFERRED;            -- kiểm lúc COMMIT, không kiểm từng INSERT
BEGIN;
INSERT INTO employee VALUES ('123456789', 'John', 'Smith', NULL, 5);    -- phòng 5 chưa có
INSERT INTO department VALUES (5, 'Research', '123456789', '2026-01-01');
COMMIT;                                     -- giờ cả hai dòng đã có: kiểm hoãn qua được
SELECT e.fname, d.dname FROM employee e JOIN department d ON d.dnumber = e.dno;</code></pre>
<div class="out">INSERT 0 1<br>
INSERT 0 1</div>
<table>
<thead><tr><th>fname</th><th>dname</th></tr></thead>
<tbody>
<tr><td>John</td><td>Research</td></tr>
</tbody>
</table>
Đọc thêm: <a href="/courses/postgresql/learn?lessonSlug=postgresql-11-1-giao-dich">Khoá PostgreSQL — giao dịch</a>.</div>`],
    ]),
    bi(`<h3>✅ Check yourself in 60 seconds</h3>
<ol>
<li>On slide 12, why is seniority drawn with a dashed oval, and should it be a column?</li>
<li>Why is Crews weak but Studios strong?</li>
<li>In the COMPANY ERD, which relationship needs its own table, and why?</li>
</ol>
<p class="dap-an">✅ <strong>Answers:</strong> (1) it is derived — computed from since — so it is not stored; compute it in the query. (2) a crew number repeats across studios, so a crew is identified only together with its studio's name; a studio's name identifies it alone. (3) WORKS_ON — it is M-N, and its attribute Hours belongs to each (employee, project) pair.</p>
<p><strong>Next:</strong> lesson 3.B — slides 19–32, turning every construct of this lesson into tables.</p>`,
    `<h3>✅ Tự kiểm tra trong 60 giây</h3>
<ol>
<li>Ở slide 12, vì sao seniority vẽ bằng bầu dục nét đứt, và có nên thành một cột không?</li>
<li>Vì sao Crews là yếu còn Studios là mạnh?</li>
<li>Trong ERD COMPANY, liên kết nào cần bảng riêng, và vì sao?</li>
</ol>
<p class="dap-an">✅ <strong>Đáp án:</strong> (1) nó là thuộc tính dẫn xuất — tính từ since — nên không lưu; tính trong câu truy vấn. (2) số hiệu tổ lặp lại giữa các hãng, nên một tổ chỉ xác định được khi đi kèm tên hãng; tên hãng thì tự xác định được hãng. (3) WORKS_ON — nó là M-N, và thuộc tính Hours thuộc về từng cặp (nhân viên, dự án).</p>
<p><strong>Học tiếp:</strong> bài 3.B — slide 19–32, biến mọi cấu trúc của bài này thành bảng.</p>`),
    books([
      ['ullman', 'Ch.4 High-Level Database Models — §4.1 The Entity/Relationship Model · §4.2 Design Principles · §4.3 Constraints in the E/R Model · §4.4 Weak Entity Sets', 'Chương 4 High-Level Database Models — §4.1 The Entity/Relationship Model (mô hình E/R) · §4.2 Design Principles (nguyên tắc thiết kế) · §4.3 Constraints in the E/R Model (ràng buộc) · §4.4 Weak Entity Sets (tập thực thể yếu)'],
    ]),
  ].join('\n'),
};

/* ───────── 3.B — 📑 Slide by slide · From E/R diagrams to relations (school Chapter 4, slides 19–32) ───────── */
const L_dbi5_2 = {
  title: '3.B — 📑 Slide by slide · From E/R diagrams to relations (school Chapter 4, slides 19–32)|||3.B — 📑 Học theo từng slide · Từ sơ đồ E/R sang quan hệ (Chapter 4 của trường, slide 19–32)',
  slug: 'dbi202-slide-dbi5-2',
  type: 'VIDEO',
  description: 'Giảng slide 19–32 của bộ Chapter 4 của trường (trên web là Chương 3): luật chuyển thực thể, liên kết 1-1, 1-M, M-M, n ngôi, thuộc tính phức hợp và đa trị, phân cấp lớp (hai cách), kết tập, liên kết có vai trò, gộp quan hệ nhiều – một và thực thể yếu — mỗi luật một CREATE TABLE chạy thật trên SQL Server và một ô PostgreSQL.',
  content: [
    bi(`<span class="eyebrow">Chapter 3 · Lesson 3.B · school deck "Chapter 4", slides 19–32</span>
<h2>From E/R diagrams to relations — every rule, run on SQL Server</h2>
<p class="lead"><strong>These are slides 19–32 of the school's Chapter 4; on this website the topic is Chapter 3.</strong> Lesson 3.A drew diagrams; this lesson turns them into tables. The conversion is mechanical — once you know the rule for each symbol, a diagram becomes CREATE TABLE statements without guessing. Every rule below comes with a script that really runs on SQL Server, and a 🐘 box showing what changes on PostgreSQL.</p>
<h3>The rules on one screen</h3>
<table>
<thead><tr><th>What you see in the ERD</th><th>What you create</th><th>Primary key</th><th>Slide</th></tr></thead>
<tbody>
<tr><td>Entity set (rectangle)</td><td>one table, one column per simple attribute</td><td>the key attribute(s)</td><td>19</td></tr>
<tr><td>1-M relationship</td><td>NO new table: the key of the 1 side becomes a foreign key in the M side</td><td>unchanged</td><td>19, 31</td></tr>
<tr><td>M-M relationship</td><td>a new table: both keys + the relationship's attributes</td><td>both keys together</td><td>19</td></tr>
<tr><td>1-1 relationship</td><td>a foreign key with UNIQUE on the total side, or a separate table</td><td>—</td><td>20</td></tr>
<tr><td>n-ary relationship</td><td>a new table with the keys of all n entity sets</td><td>keys of the sides without an arrow</td><td>21</td></tr>
<tr><td>Composite attribute</td><td>one column per component, none for the whole</td><td>—</td><td>22</td></tr>
<tr><td>Multivalued attribute</td><td>a new table (owner key, value)</td><td>both columns</td><td>23–24</td></tr>
<tr><td>isa hierarchy</td><td>a table per class with the root key, or subclass tables only</td><td>the root key</td><td>25–28</td></tr>
<tr><td>Aggregation</td><td>a table linking the aggregate's key and the other entity's key</td><td>both</td><td>29</td></tr>
<tr><td>Weak entity set</td><td>a table with its own attributes + the supporting entities' keys; no table for the supporting relationship</td><td>partial key + borrowed keys</td><td>32</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 3 · Bài 3.B · bộ slide "Chapter 4" của trường, slide 19–32</span>
<h2>Từ sơ đồ E/R sang quan hệ — từng luật, chạy thật trên SQL Server</h2>
<p class="lead"><strong>Đây là slide 19–32 của Chapter 4 của trường; trên web chủ đề này là Chương 3.</strong> Bài 3.A vẽ sơ đồ; bài này biến sơ đồ thành bảng. Phép chuyển mang tính máy móc — biết luật cho từng ký hiệu thì một sơ đồ thành các câu CREATE TABLE mà không phải đoán. Mỗi luật dưới đây đều kèm một đoạn script chạy thật trên SQL Server, và một ô 🐘 cho thấy trên PostgreSQL khác gì.</p>
<h3>Các luật gói trong một màn hình</h3>
<table>
<thead><tr><th>Thấy gì trong ERD</th><th>Tạo ra cái gì</th><th>Khoá chính</th><th>Slide</th></tr></thead>
<tbody>
<tr><td>Tập thực thể (hình chữ nhật)</td><td>một bảng, mỗi thuộc tính đơn một cột</td><td>(các) thuộc tính khoá</td><td>19</td></tr>
<tr><td>Liên kết 1-M</td><td>KHÔNG thêm bảng: khoá của phía 1 thành khoá ngoại ở phía M</td><td>giữ nguyên</td><td>19, 31</td></tr>
<tr><td>Liên kết M-M</td><td>một bảng mới: hai khoá + thuộc tính của liên kết</td><td>ghép cả hai khoá</td><td>19</td></tr>
<tr><td>Liên kết 1-1</td><td>khoá ngoại có UNIQUE ở phía tham gia toàn phần, hoặc một bảng riêng</td><td>—</td><td>20</td></tr>
<tr><td>Liên kết n ngôi</td><td>một bảng mới chứa khoá của cả n tập thực thể</td><td>khoá của các phía không có mũi tên</td><td>21</td></tr>
<tr><td>Thuộc tính phức hợp</td><td>mỗi thành phần một cột, không có cột cho cả khối</td><td>—</td><td>22</td></tr>
<tr><td>Thuộc tính đa trị</td><td>một bảng mới (khoá chủ, giá trị)</td><td>cả hai cột</td><td>23–24</td></tr>
<tr><td>Phân cấp isa</td><td>mỗi lớp một bảng mang khoá gốc, hoặc chỉ bảng lớp con</td><td>khoá gốc</td><td>25–28</td></tr>
<tr><td>Kết tập (aggregation)</td><td>một bảng nối khoá của khối gộp với khoá của thực thể kia</td><td>cả hai</td><td>29</td></tr>
<tr><td>Tập thực thể yếu</td><td>một bảng: thuộc tính riêng + khoá của các thực thể hỗ trợ; không có bảng cho liên kết hỗ trợ</td><td>khoá bộ phận + khoá mượn</td><td>32</td></tr>
</tbody>
</table>`),
    walkHead('dbi5', 19, 32),
    walk('dbi5', [
      [19, 'From ER Diagram to Relational Model',
        `<p class="y-chinh">🎯 The three basic rules: one entity set = one relation (its attributes and key carry over); a 1-M relationship puts the key of the one side into the many side; an M-M relationship becomes a new relation whose key combines the two keys and whose other attributes are the relationship's attributes.</p>
<p>Take a small FPTU example and read each relationship aloud first — the sentence tells you the rule:</p>
<table>
<thead><tr><th>Relationship</th><th>Read it as a sentence</th><th>Cardinality</th><th>Rule</th></tr></thead>
<tbody>
<tr><td>Class — has — Student</td><td>"each class has many students; each student belongs to exactly one class"</td><td>1-M</td><td>put classID into Student</td></tr>
<tr><td>Student — enrolls — Course (grade)</td><td>"a student takes many courses; a course has many students"</td><td>M-M</td><td>new table Enroll(studentID, courseCode, grade)</td></tr>
</tbody>
</table>
<pre><code class="language-sql">CREATE TABLE Class (                        -- entity -&gt; relation, key -&gt; PRIMARY KEY
  classID   CHAR(6)      PRIMARY KEY,
  className NVARCHAR(30) NOT NULL
);
CREATE TABLE Student (
  studentID CHAR(8)      PRIMARY KEY,
  fullName  NVARCHAR(50) NOT NULL,
  classID   CHAR(6)      NOT NULL REFERENCES Class(classID)   -- 1-M: key of the 1 side goes to the M side
);
CREATE TABLE Course (
  courseCode CHAR(6)      PRIMARY KEY,
  courseName NVARCHAR(60) NOT NULL
);
CREATE TABLE Enroll (                       -- M-M: a new relation
  studentID  CHAR(8) REFERENCES Student(studentID),
  courseCode CHAR(6) REFERENCES Course(courseCode),
  grade      DECIMAL(3,1),                  -- attribute of the relationship
  PRIMARY KEY (studentID, courseCode)       -- combined from the two keys
);</code></pre>
<pre><code class="language-sql">SELECT s.fullName, s.classID, e.courseCode, e.grade
FROM Student s
LEFT JOIN Enroll e ON e.studentID = s.studentID
ORDER BY s.studentID, e.courseCode;</code></pre>
<div class="out">(2 rows affected)<br>
(3 rows affected)<br>
(2 rows affected)<br>
(3 rows affected)</div>
<table>
<thead><tr><th>fullName</th><th>classID</th><th>courseCode</th><th>grade</th></tr></thead>
<tbody>
<tr><td>Nguyễn Văn An</td><td>SE1901</td><td>CSD201</td><td>7.5</td></tr>
<tr><td>Nguyễn Văn An</td><td>SE1901</td><td>DBI202</td><td>8.0</td></tr>
<tr><td>Trần Thị Bình</td><td>SE1901</td><td>DBI202</td><td>6.5</td></tr>
<tr><td>Lê Hoàng Cường</td><td>SE1902</td><td><em>NULL</em></td><td><em>NULL</em></td></tr>
</tbody>
</table>
<p>Four entity-and-relationship symbols gave 4 tables: 3 entity sets + 1 M-M. The 1-M "has" became only the column <code>Student.classID</code>. Cường (SE190003) has no enrolment, so the LEFT JOIN shows NULLs for him — nothing is lost.</p>
<p class="dap-an">✅ <strong>Lecturers ask: "How do you convert an M-N relationship, and why can't you just add a column?"</strong> A new table with both keys as a composite primary key. A single column in Student could hold only one course, and a list of courses in one cell breaks the rule that each cell holds one value (1NF).</p>
<p class="dap-an">✅ <strong>"Why does the foreign key go to the M side and not the 1 side?"</strong> Each student has exactly one class, so one column in Student is enough. A column in Class would have to hold many student ids at once.</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong> the rules are identical; what changes is the types — no <code>NVARCHAR</code> and no <code>N'…'</code> prefix (every string is Unicode), <code>DECIMAL</code> is usually written <code>numeric</code> — and unquoted names are folded to lower case (<code>Student</code> becomes <code>student</code>):
<pre><code class="language-sql">CREATE TABLE class (
  classid   char(6)     PRIMARY KEY,
  classname varchar(30) NOT NULL            -- no NVARCHAR: every PG string is Unicode
);
CREATE TABLE student (
  studentid char(8)     PRIMARY KEY,
  fullname  varchar(50) NOT NULL,
  classid   char(6)     NOT NULL REFERENCES class(classid)
);
CREATE TABLE course (coursecode char(6) PRIMARY KEY, coursename varchar(60) NOT NULL);
CREATE TABLE enroll (
  studentid  char(8) REFERENCES student(studentid),
  coursecode char(6) REFERENCES course(coursecode),
  grade      numeric(3,1),
  PRIMARY KEY (studentid, coursecode)
);
INSERT INTO class VALUES ('SE1901', 'SE1901'), ('SE1902', 'SE1902');
INSERT INTO student VALUES ('SE190001', 'Nguyễn Văn An', 'SE1901'), ('SE190002', 'Trần Thị Bình', 'SE1901'),
                           ('SE190003', 'Lê Hoàng Cường', 'SE1902');   -- no N'...' prefix needed
INSERT INTO course VALUES ('DBI202', 'Các hệ cơ sở dữ liệu'), ('CSD201', 'Cấu trúc dữ liệu');
INSERT INTO enroll VALUES ('SE190001', 'DBI202', 8.0), ('SE190001', 'CSD201', 7.5), ('SE190002', 'DBI202', 6.5);
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;   -- names were folded to lower case</code></pre>
<div class="out">INSERT 0 2<br>
INSERT 0 3<br>
INSERT 0 2<br>
INSERT 0 3</div>
<table>
<thead><tr><th>table_name</th></tr></thead>
<tbody>
<tr><td>class</td></tr>
<tr><td>course</td></tr>
<tr><td>enroll</td></tr>
<tr><td>student</td></tr>
</tbody>
</table>
Read more: <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-2-khoa-ngoai">PostgreSQL course — foreign keys</a>.</div>
<div class="pitfall">Most frequent PE mistake: a separate table for a 1-M relationship, e.g. <code>ClassStudent(classID, studentID)</code>. It needs an extra join and even allows a student in two classes — exactly what the "1" forbids.</div>`,
        `<p class="y-chinh">🎯 Ba luật cơ bản: một tập thực thể = một quan hệ (giữ nguyên thuộc tính và khoá); liên kết 1-M đưa khoá của phía một sang phía nhiều; liên kết M-M thành một quan hệ mới có khoá ghép từ hai khoá, các thuộc tính khác là thuộc tính của liên kết.</p>
<p>Lấy một ví dụ nhỏ ở FPTU và đọc to từng liên kết thành câu trước — câu văn cho bạn biết luật nào:</p>
<table>
<thead><tr><th>Liên kết</th><th>Đọc thành câu</th><th>Bản số</th><th>Luật</th></tr></thead>
<tbody>
<tr><td>Class — has — Student</td><td>"mỗi lớp có nhiều sinh viên; mỗi sinh viên thuộc đúng một lớp"</td><td>1-M</td><td>đưa classID vào Student</td></tr>
<tr><td>Student — enrolls — Course (grade)</td><td>"một sinh viên học nhiều môn; một môn có nhiều sinh viên"</td><td>M-M</td><td>bảng mới Enroll(studentID, courseCode, grade)</td></tr>
</tbody>
</table>
<pre><code class="language-sql">CREATE TABLE Class (                        -- thực thể -&gt; quan hệ, khoá -&gt; PRIMARY KEY
  classID   CHAR(6)      PRIMARY KEY,
  className NVARCHAR(30) NOT NULL
);
CREATE TABLE Student (
  studentID CHAR(8)      PRIMARY KEY,
  fullName  NVARCHAR(50) NOT NULL,
  classID   CHAR(6)      NOT NULL REFERENCES Class(classID)   -- 1-M: khoá phía 1 sang phía M
);
CREATE TABLE Course (
  courseCode CHAR(6)      PRIMARY KEY,
  courseName NVARCHAR(60) NOT NULL
);
CREATE TABLE Enroll (                       -- M-M: một quan hệ mới
  studentID  CHAR(8) REFERENCES Student(studentID),
  courseCode CHAR(6) REFERENCES Course(courseCode),
  grade      DECIMAL(3,1),                  -- thuộc tính của liên kết
  PRIMARY KEY (studentID, courseCode)       -- ghép từ hai khoá
);</code></pre>
<pre><code class="language-sql">SELECT s.fullName, s.classID, e.courseCode, e.grade
FROM Student s
LEFT JOIN Enroll e ON e.studentID = s.studentID
ORDER BY s.studentID, e.courseCode;</code></pre>
<div class="out">(2 rows affected)<br>
(3 rows affected)<br>
(2 rows affected)<br>
(3 rows affected)</div>
<table>
<thead><tr><th>fullName</th><th>classID</th><th>courseCode</th><th>grade</th></tr></thead>
<tbody>
<tr><td>Nguyễn Văn An</td><td>SE1901</td><td>CSD201</td><td>7.5</td></tr>
<tr><td>Nguyễn Văn An</td><td>SE1901</td><td>DBI202</td><td>8.0</td></tr>
<tr><td>Trần Thị Bình</td><td>SE1901</td><td>DBI202</td><td>6.5</td></tr>
<tr><td>Lê Hoàng Cường</td><td>SE1902</td><td><em>NULL</em></td><td><em>NULL</em></td></tr>
</tbody>
</table>
<p>Bốn ký hiệu thực thể và liên kết cho ra 4 bảng: 3 tập thực thể + 1 liên kết M-M. Liên kết 1-M "has" chỉ thành cột <code>Student.classID</code>. Cường (SE190003) chưa đăng ký môn nào nên LEFT JOIN (nối trái) hiện NULL cho bạn ấy — không mất dữ liệu nào.</p>
<p class="dap-an">✅ <strong>Thầy hay hỏi: "Quan hệ n-n chuyển thế nào, sao không thêm một cột là xong?"</strong> Tạo một bảng mới chứa hai khoá làm khoá chính ghép. Một cột trong Student chỉ chứa được một môn, còn nhét danh sách môn vào một ô thì phá luật mỗi ô một giá trị (dạng chuẩn 1 — 1NF).</p>
<p class="dap-an">✅ <strong>"Vì sao khoá ngoại đặt ở phía M chứ không phải phía 1?"</strong> Mỗi sinh viên có đúng một lớp, nên một cột trong Student là đủ. Nếu đặt cột ở Class thì cột đó phải chứa cùng lúc nhiều mã sinh viên.</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> các luật y hệt; chỗ khác là kiểu dữ liệu — không có <code>NVARCHAR</code> và không cần tiền tố <code>N'…'</code> (chuỗi nào cũng Unicode), <code>DECIMAL</code> thường viết <code>numeric</code> — và tên không đặt trong nháy kép bị đổi thành chữ thường (<code>Student</code> thành <code>student</code>):
<pre><code class="language-sql">CREATE TABLE class (
  classid   char(6)     PRIMARY KEY,
  classname varchar(30) NOT NULL            -- không có NVARCHAR: chuỗi PG nào cũng Unicode
);
CREATE TABLE student (
  studentid char(8)     PRIMARY KEY,
  fullname  varchar(50) NOT NULL,
  classid   char(6)     NOT NULL REFERENCES class(classid)
);
CREATE TABLE course (coursecode char(6) PRIMARY KEY, coursename varchar(60) NOT NULL);
CREATE TABLE enroll (
  studentid  char(8) REFERENCES student(studentid),
  coursecode char(6) REFERENCES course(coursecode),
  grade      numeric(3,1),
  PRIMARY KEY (studentid, coursecode)
);
INSERT INTO class VALUES ('SE1901', 'SE1901'), ('SE1902', 'SE1902');
INSERT INTO student VALUES ('SE190001', 'Nguyễn Văn An', 'SE1901'), ('SE190002', 'Trần Thị Bình', 'SE1901'),
                           ('SE190003', 'Lê Hoàng Cường', 'SE1902');   -- không cần tiền tố N'...'
INSERT INTO course VALUES ('DBI202', 'Các hệ cơ sở dữ liệu'), ('CSD201', 'Cấu trúc dữ liệu');
INSERT INTO enroll VALUES ('SE190001', 'DBI202', 8.0), ('SE190001', 'CSD201', 7.5), ('SE190002', 'DBI202', 6.5);
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;   -- tên đã bị đổi thành chữ thường</code></pre>
<div class="out">INSERT 0 2<br>
INSERT 0 3<br>
INSERT 0 2<br>
INSERT 0 3</div>
<table>
<thead><tr><th>table_name</th></tr></thead>
<tbody>
<tr><td>class</td></tr>
<tr><td>course</td></tr>
<tr><td>enroll</td></tr>
<tr><td>student</td></tr>
</tbody>
</table>
Đọc thêm: <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-2-khoa-ngoai">Khoá PostgreSQL — khoá ngoại</a>.</div>
<div class="pitfall">Lỗi PE hay gặp nhất: tạo bảng riêng cho liên kết 1-M, vd <code>ClassStudent(classID, studentID)</code>. Nó bắt phải nối thêm một bảng và còn cho phép một sinh viên nằm ở hai lớp — đúng điều mà chữ "1" cấm.</div>`],
      [20, 'Convert 1-1 relationship',
        `<p class="y-chinh">🎯 1-1 without total participation: a separate table with the two keys (plus the relationship's attributes); 1-1 where one side participates totally: add the other side's key as an extra column in the total side's table.</p>
<p><strong>Total participation</strong> means every entity of that set must take part — "every department HAS a manager". <strong>Partial</strong> means some may not — "not every person rents a locker; not every locker is rented".</p>
<table>
<thead><tr><th>Case</th><th>Example sentence</th><th>Tables</th></tr></thead>
<tbody>
<tr><td>(a) no total participation</td><td>"a person rents at most one locker; a locker is rented by at most one person; both may have none"</td><td>Rents(<u>pid</u>, lockerNo UNIQUE, since)</td></tr>
<tr><td>(b) one side total</td><td>"every department is managed by exactly one employee; an employee manages at most one department"</td><td>Department(…, managerEid NOT NULL UNIQUE)</td></tr>
</tbody>
</table>
<pre><code class="language-sql">CREATE TABLE Person  (pid INT PRIMARY KEY, name NVARCHAR(40));
CREATE TABLE Locker  (lockerNo INT PRIMARY KEY, floor INT);
CREATE TABLE Rents (                        -- no total participation: a separate table
  pid      INT PRIMARY KEY REFERENCES Person(pid),          -- one locker per person
  lockerNo INT NOT NULL UNIQUE REFERENCES Locker(lockerNo), -- one person per locker
  since    DATE                                             -- descriptive attribute
);</code></pre>
<pre><code class="language-sql">CREATE TABLE Employee (eid INT PRIMARY KEY, name NVARCHAR(40));
CREATE TABLE Department (                   -- total participation: every department HAS a manager
  did        INT PRIMARY KEY,
  dname      NVARCHAR(30),
  managerEid INT NOT NULL UNIQUE REFERENCES Employee(eid),  -- extra column on the total side
  startDate  DATE
);</code></pre>
<pre><code class="language-sql">CREATE TABLE Person2 (                      -- the tempting shortcut: FK column on the optional side
  pid      INT PRIMARY KEY,
  lockerNo INT NULL UNIQUE REFERENCES Locker(lockerNo)
);
INSERT INTO Person2 VALUES (1, 101), (2, NULL);
INSERT INTO Person2 VALUES (3, NULL);       -- SQL Server: UNIQUE allows only ONE NULL</code></pre>
<div class="out">(3 rows affected)<br>
(2 rows affected)<br>
(1 row affected)<br>
(2 rows affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>name</th><th>lockerNo</th></tr></thead>
<tbody>
<tr><td>An</td><td>101</td></tr>
<tr><td>Bình</td><td><em>NULL</em></td></tr>
<tr><td>Chi</td><td><em>NULL</em></td></tr>
</tbody>
</table>
<div class="out"><b>Msg 2627, Level 14, State 1<br>
Violation of UNIQUE KEY constraint 'UQ__Departme__751D06E01D62DEBF'. Cannot insert duplicate key in object 'dbo.Department'. The duplicate key value is (10).</b><br>
The statement has been terminated.<br>
(2 rows affected)<br>
<b>Msg 2627, Level 14, State 1<br>
Violation of UNIQUE KEY constraint 'UQ__Person2__5FACD99C650C7B35'. Cannot insert duplicate key in object 'dbo.Person2'. The duplicate key value is (&lt;NULL&gt;).</b><br>
The statement has been terminated.</div>
<p>Read the output from the top: An rents locker 101, Bình and Chi rent nothing (NULL). The first error is rule (b) at work — UNIQUE on managerEid stops Lan from managing a second department. Part (c) is why case (a) needs its own table: putting a nullable <code>lockerNo UNIQUE</code> column in Person looks simpler, but in SQL Server a UNIQUE column accepts only <strong>one</strong> NULL, so the second person without a locker is refused.</p>
<p class="dap-an">✅ <strong>"Why UNIQUE on the foreign key?"</strong> Without UNIQUE the foreign key only says "many-one"; UNIQUE adds "and at most one the other way", which is what makes it 1-1.</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong> a UNIQUE column accepts <em>any number</em> of NULLs (NULLs are never equal to each other), so shortcut (c) works there — the same schema behaves differently on the two DBMSs:
<pre><code class="language-sql">CREATE TABLE locker (lockerno int PRIMARY KEY, floor int);
INSERT INTO locker VALUES (101, 1), (102, 1);
CREATE TABLE person2 (
  pid      int PRIMARY KEY,
  lockerno int NULL UNIQUE REFERENCES locker(lockerno)
);
INSERT INTO person2 VALUES (1, 101), (2, NULL);
INSERT INTO person2 VALUES (3, NULL);       -- PG: many NULLs are allowed in a UNIQUE column
SELECT * FROM person2 ORDER BY pid;</code></pre>
<div class="out">INSERT 0 2<br>
INSERT 0 2<br>
INSERT 0 1</div>
<table>
<thead><tr><th>pid</th><th>lockerno</th></tr></thead>
<tbody>
<tr><td>1</td><td>101</td></tr>
<tr><td>2</td><td><em>NULL</em></td></tr>
<tr><td>3</td><td><em>NULL</em></td></tr>
</tbody>
</table>
In SQL Server the equivalent is a <em>filtered</em> unique index: <code>CREATE UNIQUE INDEX … ON Person2(lockerNo) WHERE lockerNo IS NOT NULL</code>. Read more: <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-3-rang-buoc-cot">PostgreSQL course — column constraints</a>.</div>`,
        `<p class="y-chinh">🎯 1-1 không có tham gia toàn phần: một bảng riêng chứa hai khoá (cộng thuộc tính của liên kết); 1-1 mà một phía tham gia toàn phần: thêm khoá của phía kia làm một cột mới trong bảng của phía toàn phần.</p>
<p><strong>Tham gia toàn phần (total participation)</strong> nghĩa là mọi thực thể của tập đó đều phải tham gia — "phòng nào cũng CÓ trưởng phòng". <strong>Tham gia bộ phận (partial)</strong> nghĩa là có thể có thực thể không tham gia — "không phải ai cũng thuê tủ đồ; không phải tủ nào cũng có người thuê".</p>
<table>
<thead><tr><th>Trường hợp</th><th>Câu ví dụ</th><th>Bảng</th></tr></thead>
<tbody>
<tr><td>(a) không phía nào toàn phần</td><td>"một người thuê tối đa một tủ; một tủ do tối đa một người thuê; cả hai đều có thể không có"</td><td>Rents(<u>pid</u>, lockerNo UNIQUE, since)</td></tr>
<tr><td>(b) một phía toàn phần</td><td>"mỗi phòng do đúng một nhân viên quản lý; một nhân viên quản lý tối đa một phòng"</td><td>Department(…, managerEid NOT NULL UNIQUE)</td></tr>
</tbody>
</table>
<pre><code class="language-sql">CREATE TABLE Person  (pid INT PRIMARY KEY, name NVARCHAR(40));
CREATE TABLE Locker  (lockerNo INT PRIMARY KEY, floor INT);
CREATE TABLE Rents (                        -- không bên nào tham gia toàn phần: bảng riêng
  pid      INT PRIMARY KEY REFERENCES Person(pid),          -- mỗi người tối đa một tủ
  lockerNo INT NOT NULL UNIQUE REFERENCES Locker(lockerNo), -- mỗi tủ tối đa một người
  since    DATE                                             -- thuộc tính mô tả
);</code></pre>
<pre><code class="language-sql">CREATE TABLE Employee (eid INT PRIMARY KEY, name NVARCHAR(40));
CREATE TABLE Department (                   -- tham gia toàn phần: phòng nào cũng CÓ trưởng phòng
  did        INT PRIMARY KEY,
  dname      NVARCHAR(30),
  managerEid INT NOT NULL UNIQUE REFERENCES Employee(eid),  -- thêm cột ở phía toàn phần
  startDate  DATE
);</code></pre>
<pre><code class="language-sql">CREATE TABLE Person2 (                      -- lối tắt hấp dẫn: cột khoá ngoại ở phía không bắt buộc
  pid      INT PRIMARY KEY,
  lockerNo INT NULL UNIQUE REFERENCES Locker(lockerNo)
);
INSERT INTO Person2 VALUES (1, 101), (2, NULL);
INSERT INTO Person2 VALUES (3, NULL);       -- SQL Server: UNIQUE chỉ cho MỘT giá trị NULL</code></pre>
<div class="out">(3 rows affected)<br>
(2 rows affected)<br>
(1 row affected)<br>
(2 rows affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>name</th><th>lockerNo</th></tr></thead>
<tbody>
<tr><td>An</td><td>101</td></tr>
<tr><td>Bình</td><td><em>NULL</em></td></tr>
<tr><td>Chi</td><td><em>NULL</em></td></tr>
</tbody>
</table>
<div class="out"><b>Msg 2627, Level 14, State 1<br>
Violation of UNIQUE KEY constraint 'UQ__Departme__751D06E01D62DEBF'. Cannot insert duplicate key in object 'dbo.Department'. The duplicate key value is (10).</b><br>
The statement has been terminated.<br>
(2 rows affected)<br>
<b>Msg 2627, Level 14, State 1<br>
Violation of UNIQUE KEY constraint 'UQ__Person2__5FACD99C650C7B35'. Cannot insert duplicate key in object 'dbo.Person2'. The duplicate key value is (&lt;NULL&gt;).</b><br>
The statement has been terminated.</div>
<p>Đọc output từ trên xuống: An thuê tủ 101, Bình và Chi không thuê (NULL). Lỗi thứ nhất là luật (b) đang làm việc — UNIQUE trên managerEid chặn Lan làm trưởng phòng thứ hai. Phần (c) là lý do trường hợp (a) cần bảng riêng: đặt cột <code>lockerNo UNIQUE</code> cho phép NULL ngay trong Person trông gọn hơn, nhưng trên SQL Server cột UNIQUE chỉ nhận <strong>một</strong> giá trị NULL, nên người thứ hai không thuê tủ bị từ chối.</p>
<p class="dap-an">✅ <strong>"Vì sao phải có UNIQUE trên khoá ngoại?"</strong> Không có UNIQUE thì khoá ngoại chỉ nói "nhiều – một"; UNIQUE thêm "và chiều ngược lại cũng tối đa một", đó mới là 1-1.</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> cột UNIQUE nhận <em>bao nhiêu</em> NULL cũng được (NULL không bao giờ bằng nhau), nên lối tắt (c) chạy được ở đó — cùng một lược đồ mà hai DBMS xử lý khác nhau:
<pre><code class="language-sql">CREATE TABLE locker (lockerno int PRIMARY KEY, floor int);
INSERT INTO locker VALUES (101, 1), (102, 1);
CREATE TABLE person2 (
  pid      int PRIMARY KEY,
  lockerno int NULL UNIQUE REFERENCES locker(lockerno)
);
INSERT INTO person2 VALUES (1, 101), (2, NULL);
INSERT INTO person2 VALUES (3, NULL);       -- PG: cột UNIQUE được nhiều NULL
SELECT * FROM person2 ORDER BY pid;</code></pre>
<div class="out">INSERT 0 2<br>
INSERT 0 2<br>
INSERT 0 1</div>
<table>
<thead><tr><th>pid</th><th>lockerno</th></tr></thead>
<tbody>
<tr><td>1</td><td>101</td></tr>
<tr><td>2</td><td><em>NULL</em></td></tr>
<tr><td>3</td><td><em>NULL</em></td></tr>
</tbody>
</table>
Trên SQL Server, cách tương đương là chỉ mục duy nhất <em>có lọc</em> (filtered unique index): <code>CREATE UNIQUE INDEX … ON Person2(lockerNo) WHERE lockerNo IS NOT NULL</code>. Đọc thêm: <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-3-rang-buoc-cot">Khoá PostgreSQL — ràng buộc cột</a>.</div>`],
      [21, 'Convert N-ary Relationship Set',
        `<p class="y-chinh">🎯 An n-ary relationship becomes one table holding the keys of all participating entity sets plus its own attributes; here the key is P-Key1 + P-Key2 + P-Key3 — A-Key is left out because the arrow points at Another Set.</p>
<p>The slide's diagram: <strong>A relationship</strong> (diamond) connects four entity sets — E-Set 1 (<u>P-Key1</u>), E-Set 2 (<u>P-Key2</u>), E-Set 3 (<u>P-Key3</u>) and, with an <strong>arrow</strong>, Another Set (<u>A-Key</u>) — and has its own attribute D-Attribute. The table below it: rows (9999, 8888, 7777, 6666, Yes) and (1234, 5678, 9012, 3456, No).</p>
<p><strong>What the arrow means.</strong> In Ullman's notation an arrow into an entity set means "one": for each combination of the other three entities there is <em>at most one</em> Another Set entity. So (P-Key1, P-Key2, P-Key3) already determines A-Key, and A-Key must not be in the primary key.</p>
<pre><code class="language-sql">CREATE TABLE ESet1 (PKey1 INT PRIMARY KEY);
CREATE TABLE ESet2 (PKey2 INT PRIMARY KEY);
CREATE TABLE ESet3 (PKey3 INT PRIMARY KEY);
CREATE TABLE AnotherSet (AKey INT PRIMARY KEY);
CREATE TABLE ARelationship (                -- one table for the 4-way relationship
  PKey1      INT REFERENCES ESet1(PKey1),
  PKey2      INT REFERENCES ESet2(PKey2),
  PKey3      INT REFERENCES ESet3(PKey3),
  AKey       INT NOT NULL REFERENCES AnotherSet(AKey),  -- arrow side: not part of the key
  DAttribute VARCHAR(3),                                -- attribute of the relationship
  PRIMARY KEY (PKey1, PKey2, PKey3)
);</code></pre>
<div class="out">(2 rows affected)<br>
(2 rows affected)<br>
(2 rows affected)<br>
(2 rows affected)<br>
(2 rows affected)</div>
<table>
<thead><tr><th>PKey1</th><th>PKey2</th><th>PKey3</th><th>AKey</th><th>DAttribute</th></tr></thead>
<tbody>
<tr><td>1234</td><td>5678</td><td>9012</td><td>3456</td><td>No</td></tr>
<tr><td>9999</td><td>8888</td><td>7777</td><td>6666</td><td>Yes</td></tr>
</tbody>
</table>
<div class="out"><b>Msg 2627, Level 14, State 1<br>
Violation of PRIMARY KEY constraint 'PK__ARelatio__FC7F087DAF9C7846'. Cannot insert duplicate key in object 'dbo.ARelationship'. The duplicate key value is (9999, 8888, 7777).</b><br>
The statement has been terminated.</div>
<p>The failing INSERT tries to give the triple (9999, 8888, 7777) a second A-Key (3456): the primary key refuses it, which is exactly the arrow's rule enforced by the DBMS.</p>
<p class="dap-an">✅ <strong>"Which attributes form the key of an n-ary relationship?"</strong> The keys of every participating entity set that has <em>no</em> arrow. With no arrow at all, the key is all n keys.</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong> <code>REFERENCES eset1</code> without a column list means "the primary key of eset1" (SQL Server requires the column), and the duplicate is reported with the constraint's generated name <code>arelationship_pkey</code> — the whole script stops at the error, so only the error line is shown:
<pre><code class="language-sql">CREATE TABLE eset1 (pkey1 int PRIMARY KEY);
CREATE TABLE eset2 (pkey2 int PRIMARY KEY);
CREATE TABLE eset3 (pkey3 int PRIMARY KEY);
CREATE TABLE anotherset (akey int PRIMARY KEY);
CREATE TABLE arelationship (
  pkey1 int REFERENCES eset1, pkey2 int REFERENCES eset2, pkey3 int REFERENCES eset3,   -- REFERENCES t = its primary key
  akey  int NOT NULL REFERENCES anotherset,
  dattribute varchar(3),
  PRIMARY KEY (pkey1, pkey2, pkey3)
);
INSERT INTO eset1 VALUES (9999), (1234);
INSERT INTO eset2 VALUES (8888), (5678);
INSERT INTO eset3 VALUES (7777), (9012);
INSERT INTO anotherset VALUES (6666), (3456);
INSERT INTO arelationship VALUES (9999, 8888, 7777, 6666, 'Yes'), (1234, 5678, 9012, 3456, 'No');
INSERT INTO arelationship VALUES (9999, 8888, 7777, 3456, 'No');   -- same triple again</code></pre>
<div class="out"><b>ERROR:  duplicate key value violates unique constraint "arelationship_pkey"</b></div>
Read more: <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-1-khoa-chinh">PostgreSQL course — primary keys</a>.</div>`,
        `<p class="y-chinh">🎯 Liên kết n ngôi (n-ary) thành một bảng chứa khoá của mọi tập thực thể tham gia cộng thuộc tính riêng của nó; ở đây khoá là P-Key1 + P-Key2 + P-Key3 — A-Key bị để ngoài vì mũi tên chỉ vào Another Set.</p>
<p>Sơ đồ trên slide: <strong>A relationship</strong> (hình thoi) nối bốn tập thực thể — E-Set 1 (<u>P-Key1</u>), E-Set 2 (<u>P-Key2</u>), E-Set 3 (<u>P-Key3</u>) và, bằng một <strong>mũi tên</strong>, Another Set (<u>A-Key</u>) — và có thuộc tính riêng D-Attribute. Bảng bên dưới: hai dòng (9999, 8888, 7777, 6666, Yes) và (1234, 5678, 9012, 3456, No).</p>
<p><strong>Mũi tên nghĩa là gì.</strong> Theo ký hiệu của Ullman, mũi tên chỉ vào một tập thực thể nghĩa là "một": với mỗi tổ hợp của ba thực thể kia có <em>tối đa một</em> thực thể Another Set. Vậy (P-Key1, P-Key2, P-Key3) đã xác định được A-Key, và A-Key không được nằm trong khoá chính.</p>
<pre><code class="language-sql">CREATE TABLE ESet1 (PKey1 INT PRIMARY KEY);
CREATE TABLE ESet2 (PKey2 INT PRIMARY KEY);
CREATE TABLE ESet3 (PKey3 INT PRIMARY KEY);
CREATE TABLE AnotherSet (AKey INT PRIMARY KEY);
CREATE TABLE ARelationship (                -- một bảng cho liên kết 4 ngôi
  PKey1      INT REFERENCES ESet1(PKey1),
  PKey2      INT REFERENCES ESet2(PKey2),
  PKey3      INT REFERENCES ESet3(PKey3),
  AKey       INT NOT NULL REFERENCES AnotherSet(AKey),  -- phía mũi tên: không vào khoá
  DAttribute VARCHAR(3),                                -- thuộc tính của liên kết
  PRIMARY KEY (PKey1, PKey2, PKey3)
);</code></pre>
<div class="out">(2 rows affected)<br>
(2 rows affected)<br>
(2 rows affected)<br>
(2 rows affected)<br>
(2 rows affected)</div>
<table>
<thead><tr><th>PKey1</th><th>PKey2</th><th>PKey3</th><th>AKey</th><th>DAttribute</th></tr></thead>
<tbody>
<tr><td>1234</td><td>5678</td><td>9012</td><td>3456</td><td>No</td></tr>
<tr><td>9999</td><td>8888</td><td>7777</td><td>6666</td><td>Yes</td></tr>
</tbody>
</table>
<div class="out"><b>Msg 2627, Level 14, State 1<br>
Violation of PRIMARY KEY constraint 'PK__ARelatio__FC7F087DAF9C7846'. Cannot insert duplicate key in object 'dbo.ARelationship'. The duplicate key value is (9999, 8888, 7777).</b><br>
The statement has been terminated.</div>
<p>Câu INSERT lỗi cố gán cho bộ ba (9999, 8888, 7777) một A-Key thứ hai (3456): khoá chính từ chối — chính là luật của mũi tên được DBMS ép thực hiện.</p>
<p class="dap-an">✅ <strong>"Khoá của liên kết n ngôi gồm những thuộc tính nào?"</strong> Khoá của mọi tập thực thể tham gia <em>không</em> có mũi tên chỉ vào. Không có mũi tên nào thì khoá là cả n khoá.</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> viết <code>REFERENCES eset1</code> không kèm tên cột nghĩa là "khoá chính của eset1" (SQL Server bắt ghi cột), và lỗi trùng được báo kèm tên ràng buộc tự sinh <code>arelationship_pkey</code> — cả script dừng tại lỗi, nên chỉ thấy dòng lỗi:
<pre><code class="language-sql">CREATE TABLE eset1 (pkey1 int PRIMARY KEY);
CREATE TABLE eset2 (pkey2 int PRIMARY KEY);
CREATE TABLE eset3 (pkey3 int PRIMARY KEY);
CREATE TABLE anotherset (akey int PRIMARY KEY);
CREATE TABLE arelationship (
  pkey1 int REFERENCES eset1, pkey2 int REFERENCES eset2, pkey3 int REFERENCES eset3,   -- REFERENCES t = khoá chính của t
  akey  int NOT NULL REFERENCES anotherset,
  dattribute varchar(3),
  PRIMARY KEY (pkey1, pkey2, pkey3)
);
INSERT INTO eset1 VALUES (9999), (1234);
INSERT INTO eset2 VALUES (8888), (5678);
INSERT INTO eset3 VALUES (7777), (9012);
INSERT INTO anotherset VALUES (6666), (3456);
INSERT INTO arelationship VALUES (9999, 8888, 7777, 6666, 'Yes'), (1234, 5678, 9012, 3456, 'No');
INSERT INTO arelationship VALUES (9999, 8888, 7777, 3456, 'No');   -- lại cùng bộ ba</code></pre>
<div class="out"><b>ERROR:  duplicate key value violates unique constraint "arelationship_pkey"</b></div>
Đọc thêm: <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-1-khoa-chinh">Khoá PostgreSQL — khoá chính</a>.</div>`],
      [22, 'Representing Composite Attribute',
        `<p class="y-chinh">🎯 A composite attribute is replaced by its components: one column per component, no column for the composite itself — the relational rule that every value is indivisible.</p>
<p>The slide's diagram: <strong>Professor</strong> with <u>SSN</u>, Name and <strong>Address</strong>, which splits into <strong>Street</strong> and <strong>City</strong>. The table: (9999, Dr. Smith, 50 1st St., Fake City), (8888, Dr. Lee, 1 B St., San Jose). City is underlined on the drawing — a slip of the slide; it is not a key.</p>
<pre><code class="language-sql">CREATE TABLE Professor (
  SSN    CHAR(4)      PRIMARY KEY,
  Name   VARCHAR(30),
  Street VARCHAR(40),                       -- component of Address
  City   VARCHAR(30)                        -- component of Address; no Address column
);
INSERT INTO Professor VALUES ('9999', 'Dr. Smith', '50 1st St.', 'Fake City'),
                             ('8888', 'Dr. Lee',   '1 B St.',    'San Jose');
SELECT * FROM Professor;
SELECT Name FROM Professor WHERE City = 'San Jose';   -- possible because City is its own column</code></pre>
<div class="out">(2 rows affected)</div>
<table>
<thead><tr><th>SSN</th><th>Name</th><th>Street</th><th>City</th></tr></thead>
<tbody>
<tr><td>8888</td><td>Dr. Lee</td><td>1 B St.</td><td>San Jose</td></tr>
<tr><td>9999</td><td>Dr. Smith</td><td>50 1st St.</td><td>Fake City</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Name</th></tr></thead>
<tbody>
<tr><td>Dr. Lee</td></tr>
</tbody>
</table>
<p>Because City is its own column, "which professors live in San Jose?" is a simple WHERE. With one Address column you would have to cut strings.</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong> you <em>can</em> keep the composite as one column with a composite type — useful to know, but for DBI202 and for querying, separate columns remain the right answer:
<pre><code class="language-sql">CREATE TYPE address_t AS (street varchar(40), city varchar(30));   -- PG can store a composite value in ONE column
CREATE TABLE professor (ssn char(4) PRIMARY KEY, name varchar(30), address address_t);
INSERT INTO professor VALUES ('9999', 'Dr. Smith', ROW('50 1st St.', 'Fake City')),
                             ('8888', 'Dr. Lee',   ROW('1 B St.', 'San Jose'));
SELECT name, (address).city AS city FROM professor WHERE (address).city = 'San Jose';   -- parentheses are required</code></pre>
<div class="out">INSERT 0 2</div>
<table>
<thead><tr><th>name</th><th>city</th></tr></thead>
<tbody>
<tr><td>Dr. Lee</td><td>San Jose</td></tr>
</tbody>
</table>
Read more: <a href="/courses/postgresql/learn?lessonSlug=postgresql-1-1-mo-hinh-quan-he">PostgreSQL course — the relational model</a>.</div>`,
        `<p class="y-chinh">🎯 Thuộc tính phức hợp (composite) được thay bằng các thành phần của nó: mỗi thành phần một cột, không có cột cho cả khối — đúng luật của mô hình quan hệ là mọi giá trị đều không chia nhỏ được.</p>
<p>Sơ đồ trên slide: <strong>Professor</strong> có <u>SSN</u>, Name và <strong>Address</strong> (địa chỉ), Address tách thành <strong>Street</strong> (đường) và <strong>City</strong> (thành phố). Bảng: (9999, Dr. Smith, 50 1st St., Fake City), (8888, Dr. Lee, 1 B St., San Jose). City bị gạch chân trên hình — đó là sơ suất của slide; nó không phải khoá.</p>
<pre><code class="language-sql">CREATE TABLE Professor (
  SSN    CHAR(4)      PRIMARY KEY,
  Name   VARCHAR(30),
  Street VARCHAR(40),                       -- thành phần của Address
  City   VARCHAR(30)                        -- thành phần của Address; không có cột Address
);
INSERT INTO Professor VALUES ('9999', 'Dr. Smith', '50 1st St.', 'Fake City'),
                             ('8888', 'Dr. Lee',   '1 B St.',    'San Jose');
SELECT * FROM Professor;
SELECT Name FROM Professor WHERE City = 'San Jose';   -- làm được vì City là một cột riêng</code></pre>
<div class="out">(2 rows affected)</div>
<table>
<thead><tr><th>SSN</th><th>Name</th><th>Street</th><th>City</th></tr></thead>
<tbody>
<tr><td>8888</td><td>Dr. Lee</td><td>1 B St.</td><td>San Jose</td></tr>
<tr><td>9999</td><td>Dr. Smith</td><td>50 1st St.</td><td>Fake City</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Name</th></tr></thead>
<tbody>
<tr><td>Dr. Lee</td></tr>
</tbody>
</table>
<p>Vì City là một cột riêng nên câu "giáo sư nào sống ở San Jose?" chỉ là một WHERE đơn giản. Nếu chỉ có một cột Address thì phải cắt chuỗi.</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> bạn <em>có thể</em> giữ thuộc tính phức hợp trong một cột bằng kiểu phức hợp (composite type) — nên biết, nhưng với DBI202 và để truy vấn, tách cột vẫn là đáp án đúng:
<pre><code class="language-sql">CREATE TYPE address_t AS (street varchar(40), city varchar(30));   -- PG lưu được giá trị phức hợp trong MỘT cột
CREATE TABLE professor (ssn char(4) PRIMARY KEY, name varchar(30), address address_t);
INSERT INTO professor VALUES ('9999', 'Dr. Smith', ROW('50 1st St.', 'Fake City')),
                             ('8888', 'Dr. Lee',   ROW('1 B St.', 'San Jose'));
SELECT name, (address).city AS city FROM professor WHERE (address).city = 'San Jose';   -- bắt buộc có ngoặc</code></pre>
<div class="out">INSERT 0 2</div>
<table>
<thead><tr><th>name</th><th>city</th></tr></thead>
<tbody>
<tr><td>Dr. Lee</td><td>San Jose</td></tr>
</tbody>
</table>
Đọc thêm: <a href="/courses/postgresql/learn?lessonSlug=postgresql-1-1-mo-hinh-quan-he">Khoá PostgreSQL — mô hình quan hệ</a>.</div>`],
      [23, 'Representing Multivalue Attribute',
        `<p class="y-chinh">🎯 Each multivalued attribute becomes a new relation with two columns — the owner's primary key and one value per row — whose primary key is both columns.</p>
<ul>
<li>"Build a new relation schema with two columns": owner key + value.</li>
<li>"Each cell of this column holds only one value. So each value is represented as a unique tuple": a person with three phones gets three rows.</li>
<li>"Primary key for this schema is the union of all attributes": the same owner can repeat, the same value can repeat for different owners, but the pair cannot repeat.</li>
</ul>
<p class="dap-an">✅ <strong>"Why not phone1, phone2, phone3 columns?"</strong> The number of values is unknown (a fourth phone breaks the design), most cells would be NULL, and "who has phone X?" would need three conditions.</p>`,
        `<p class="y-chinh">🎯 Mỗi thuộc tính đa trị (multivalued) thành một quan hệ mới hai cột — khoá chính của chủ sở hữu và mỗi dòng một giá trị — khoá chính là cả hai cột.</p>
<ul>
<li>"Dựng một lược đồ quan hệ mới hai cột": khoá của chủ + giá trị.</li>
<li>"Mỗi ô của cột này chỉ chứa một giá trị. Nên mỗi giá trị là một bộ (tuple) riêng": một người có ba số điện thoại thì có ba dòng.</li>
<li>"Khoá chính của lược đồ này là hợp của mọi thuộc tính": cùng một chủ được lặp, cùng một giá trị được lặp ở chủ khác, nhưng cặp đôi thì không được lặp.</li>
</ul>
<p class="dap-an">✅ <strong>"Sao không làm các cột phone1, phone2, phone3?"</strong> Số giá trị không biết trước (số thứ tư là vỡ thiết kế), phần lớn ô sẽ NULL, và câu "ai có số X?" phải viết ba điều kiện.</p>`],
      [24, 'Example – Multivalue attribute',
        `<p class="y-chinh">🎯 Student (<u>SID</u>, Name, Major, GPA) with the multivalued attribute Children becomes two tables: Student, and (Stud_SID, Children) keyed on both columns.</p>
<p>The slide's data: Student rows (1234, John, CS, 2.8) and (5678, Homer, EE, 3.6); the children table: 1234 → Johnson, Mary; 5678 → Bart, Lisa, Maggie. The table header on the slide underlines only Stud_SID, but the note beside it is the rule: the key is Stud_SID + Children.</p>
<pre><code class="language-sql">CREATE TABLE Student (SID CHAR(4) PRIMARY KEY, Name VARCHAR(30), Major VARCHAR(10), GPA DECIMAL(2,1));
CREATE TABLE StudentChildren (              -- the multivalued attribute becomes a table
  Stud_SID CHAR(4)     REFERENCES Student(SID),
  Children VARCHAR(30),
  PRIMARY KEY (Stud_SID, Children)          -- key = union of all attributes
);</code></pre>
<pre><code class="language-sql">SELECT s.Name, COUNT(c.Children) AS numChildren
FROM Student s LEFT JOIN StudentChildren c ON c.Stud_SID = s.SID
GROUP BY s.Name
ORDER BY s.Name;</code></pre>
<div class="out">(2 rows affected)<br>
(5 rows affected)</div>
<table>
<thead><tr><th>Name</th><th>numChildren</th></tr></thead>
<tbody>
<tr><td>Homer</td><td>3</td></tr>
<tr><td>John</td><td>2</td></tr>
</tbody>
</table>
<div class="pitfall">If the key were Stud_SID alone, Homer could have only one child. If the key were Children alone, two students could not both have a child named "Mary". Only the pair is right.</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> an array column (<code>text[]</code>) can hold all the children in one cell. It is convenient but it is exactly the "list in one cell" that 1NF forbids — no foreign key per child, no simple join. Use it for tags or logs, not in DBI202 answers:
<pre><code class="language-sql">CREATE TABLE student_arr (sid char(4) PRIMARY KEY, name varchar(30), children text[]);   -- an ARRAY column: not 1NF
INSERT INTO student_arr VALUES ('1234', 'John',  ARRAY['Johnson', 'Mary']),
                               ('5678', 'Homer', ARRAY['Bart', 'Lisa', 'Maggie']);
SELECT name, cardinality(children) AS numchildren FROM student_arr ORDER BY name;
SELECT name FROM student_arr WHERE 'Lisa' = ANY (children);                            -- search inside the array</code></pre>
<div class="out">INSERT 0 2</div>
<table>
<thead><tr><th>name</th><th>numchildren</th></tr></thead>
<tbody>
<tr><td>Homer</td><td>3</td></tr>
<tr><td>John</td><td>2</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>name</th></tr></thead>
<tbody>
<tr><td>Homer</td></tr>
</tbody>
</table>
Read more: <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-4-alter-chuan-hoa">PostgreSQL course — ALTER and normalization</a>.</div>`,
        `<p class="y-chinh">🎯 Student (<u>SID</u>, Name, Major, GPA) có thuộc tính đa trị Children thành hai bảng: Student, và (Stud_SID, Children) có khoá là cả hai cột.</p>
<p>Dữ liệu trên slide: Student có (1234, John, CS, 2.8) và (5678, Homer, EE, 3.6); bảng con cái: 1234 → Johnson, Mary; 5678 → Bart, Lisa, Maggie. Tiêu đề bảng trên slide chỉ gạch chân Stud_SID, nhưng ghi chú bên cạnh mới là luật: khoá là Stud_SID + Children.</p>
<pre><code class="language-sql">CREATE TABLE Student (SID CHAR(4) PRIMARY KEY, Name VARCHAR(30), Major VARCHAR(10), GPA DECIMAL(2,1));
CREATE TABLE StudentChildren (              -- thuộc tính đa trị thành một bảng
  Stud_SID CHAR(4)     REFERENCES Student(SID),
  Children VARCHAR(30),
  PRIMARY KEY (Stud_SID, Children)          -- khoá = hợp mọi thuộc tính
);</code></pre>
<pre><code class="language-sql">SELECT s.Name, COUNT(c.Children) AS numChildren
FROM Student s LEFT JOIN StudentChildren c ON c.Stud_SID = s.SID
GROUP BY s.Name
ORDER BY s.Name;</code></pre>
<div class="out">(2 rows affected)<br>
(5 rows affected)</div>
<table>
<thead><tr><th>Name</th><th>numChildren</th></tr></thead>
<tbody>
<tr><td>Homer</td><td>3</td></tr>
<tr><td>John</td><td>2</td></tr>
</tbody>
</table>
<div class="pitfall">Nếu khoá chỉ là Stud_SID thì Homer chỉ có được một con. Nếu khoá chỉ là Children thì hai sinh viên không thể cùng có con tên "Mary". Chỉ cặp đôi là đúng.</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> một cột mảng (<code>text[]</code>) chứa được mọi đứa con trong một ô. Tiện, nhưng chính là "danh sách trong một ô" mà 1NF cấm — không có khoá ngoại cho từng con, không nối đơn giản được. Dùng cho thẻ (tag) hay log, đừng dùng trong bài làm DBI202:
<pre><code class="language-sql">CREATE TABLE student_arr (sid char(4) PRIMARY KEY, name varchar(30), children text[]);   -- cột MẢNG: không đạt 1NF
INSERT INTO student_arr VALUES ('1234', 'John',  ARRAY['Johnson', 'Mary']),
                               ('5678', 'Homer', ARRAY['Bart', 'Lisa', 'Maggie']);
SELECT name, cardinality(children) AS numchildren FROM student_arr ORDER BY name;
SELECT name FROM student_arr WHERE 'Lisa' = ANY (children);                            -- tìm bên trong mảng</code></pre>
<div class="out">INSERT 0 2</div>
<table>
<thead><tr><th>name</th><th>numchildren</th></tr></thead>
<tbody>
<tr><td>Homer</td><td>3</td></tr>
<tr><td>John</td><td>2</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>name</th></tr></thead>
<tbody>
<tr><td>Homer</td></tr>
</tbody>
</table>
Đọc thêm: <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-4-alter-chuan-hoa">Khoá PostgreSQL — ALTER và chuẩn hoá</a>.</div>`],
      [25, 'Representing Class Hierarchy (non-disjoint and/or non-complete)',
        `<p class="y-chinh">🎯 When subclasses may overlap or do not cover every entity: one table for the superclass as usual, plus one table per subclass holding its own attributes and the superclass key — which is also the subclass table's primary key.</p>
<ul>
<li><strong>Disjoint</strong>: an entity belongs to at most one subclass (a person is a student <em>or</em> a lecturer, never both).</li>
<li><strong>Complete</strong> (total): every entity belongs to some subclass (no "plain" person).</li>
<li>This slide is the case where at least one of the two is false — the safe, general method.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> in the subclass table the superclass key is <em>both</em> PRIMARY KEY and FOREIGN KEY.</p>`,
        `<p class="y-chinh">🎯 Khi các lớp con có thể giao nhau hoặc không phủ hết mọi thực thể: một bảng cho lớp cha như bình thường, cộng mỗi lớp con một bảng chứa thuộc tính riêng và khoá của lớp cha — khoá đó đồng thời là khoá chính của bảng lớp con.</p>
<ul>
<li><strong>Tách rời (disjoint)</strong>: một thực thể thuộc tối đa một lớp con (một người là sinh viên <em>hoặc</em> giảng viên, không bao giờ cả hai).</li>
<li><strong>Đầy đủ (complete / total)</strong>: mọi thực thể đều thuộc một lớp con nào đó (không có "người thường").</li>
<li>Slide này là trường hợp ít nhất một trong hai điều trên sai — cách làm tổng quát, an toàn.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> trong bảng lớp con, khoá của lớp cha <em>vừa</em> là PRIMARY KEY <em>vừa</em> là FOREIGN KEY.</p>`],
      [26, 'Example',
        `<p class="y-chinh">🎯 Person (<u>SSN</u>, Name, Gender) isa Student (SID, Status, Major, GPA) becomes Person(SSN, Name, Gender) and Student(SSN, SID, Status, Major, GPA) — Student carries Person's key.</p>
<p>The slide's data: Person (1234, Homer, Male), (5678, Marge, Female); Student (1234, 9999, Full, CS, 2.8), (5678, 8888, Part, EE, 3.6). To see a whole student you join the two tables on SSN:</p>
<pre><code class="language-sql">CREATE TABLE Person (SSN CHAR(4) PRIMARY KEY, Name VARCHAR(30), Gender VARCHAR(6));
CREATE TABLE Student (                      -- subclass: its own attributes + the superclass key
  SSN    CHAR(4) PRIMARY KEY REFERENCES Person(SSN),   -- PK and FK at once
  SID    CHAR(4) UNIQUE,
  Status VARCHAR(4),
  Major  VARCHAR(10),
  GPA    DECIMAL(2,1)
);</code></pre>
<pre><code class="language-sql">SELECT p.SSN, p.Name, p.Gender, s.SID, s.Major, s.GPA   -- a whole student = join the two tables
FROM Person p JOIN Student s ON s.SSN = p.SSN;</code></pre>
<div class="out">(2 rows affected)<br>
(2 rows affected)</div>
<table>
<thead><tr><th>SSN</th><th>Name</th><th>Gender</th><th>SID</th><th>Major</th><th>GPA</th></tr></thead>
<tbody>
<tr><td>1234</td><td>Homer</td><td>Male</td><td>9999</td><td>CS</td><td>2.8</td></tr>
<tr><td>5678</td><td>Marge</td><td>Female</td><td>8888</td><td>EE</td><td>3.6</td></tr>
</tbody>
</table>
<div class="callout">🐘 <strong>On PostgreSQL</strong> there is also table inheritance: <code>CREATE TABLE student (…) INHERITS (person)</code> gives student every column of person, and a query on person also returns the students (<code>ONLY person</code> excludes them). Beware: primary keys and foreign keys are <em>not</em> inherited, so most designs still use the two-table method of the slide:
<pre><code class="language-sql">CREATE TABLE person (ssn char(4) PRIMARY KEY, name varchar(30), gender varchar(6));
CREATE TABLE student (sid char(4), status varchar(4), major varchar(10), gpa numeric(2,1))
  INHERITS (person);                        -- student gets ssn, name, gender automatically
INSERT INTO person  VALUES ('0001', 'Ned', 'Male');
INSERT INTO student VALUES ('1234', 'Homer', 'Male', '9999', 'Full', 'CS', 2.8),
                           ('5678', 'Marge', 'Female', '8888', 'Part', 'EE', 3.6);
SELECT ssn, name FROM person ORDER BY ssn;          -- the parent also shows the students
SELECT ssn, name FROM ONLY person ORDER BY ssn;     -- ONLY: rows stored in person itself</code></pre>
<div class="out">INSERT 0 1<br>
INSERT 0 2</div>
<table>
<thead><tr><th>ssn</th><th>name</th></tr></thead>
<tbody>
<tr><td>0001</td><td>Ned</td></tr>
<tr><td>1234</td><td>Homer</td></tr>
<tr><td>5678</td><td>Marge</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>ssn</th><th>name</th></tr></thead>
<tbody>
<tr><td>0001</td><td>Ned</td></tr>
</tbody>
</table>
Read more: <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-1-khoa-chinh">PostgreSQL course — primary keys</a>.</div>`,
        `<p class="y-chinh">🎯 Person (<u>SSN</u>, Name, Gender) isa Student (SID, Status, Major, GPA) thành Person(SSN, Name, Gender) và Student(SSN, SID, Status, Major, GPA) — Student mang khoá của Person.</p>
<p>Dữ liệu trên slide: Person (1234, Homer, Male), (5678, Marge, Female); Student (1234, 9999, Full, CS, 2.8), (5678, 8888, Part, EE, 3.6). Muốn xem một sinh viên đầy đủ thì nối hai bảng theo SSN:</p>
<pre><code class="language-sql">CREATE TABLE Person (SSN CHAR(4) PRIMARY KEY, Name VARCHAR(30), Gender VARCHAR(6));
CREATE TABLE Student (                      -- lớp con: thuộc tính riêng + khoá lớp cha
  SSN    CHAR(4) PRIMARY KEY REFERENCES Person(SSN),   -- vừa là khoá chính vừa là khoá ngoại
  SID    CHAR(4) UNIQUE,
  Status VARCHAR(4),
  Major  VARCHAR(10),
  GPA    DECIMAL(2,1)
);</code></pre>
<pre><code class="language-sql">SELECT p.SSN, p.Name, p.Gender, s.SID, s.Major, s.GPA   -- một sinh viên đầy đủ = nối hai bảng
FROM Person p JOIN Student s ON s.SSN = p.SSN;</code></pre>
<div class="out">(2 rows affected)<br>
(2 rows affected)</div>
<table>
<thead><tr><th>SSN</th><th>Name</th><th>Gender</th><th>SID</th><th>Major</th><th>GPA</th></tr></thead>
<tbody>
<tr><td>1234</td><td>Homer</td><td>Male</td><td>9999</td><td>CS</td><td>2.8</td></tr>
<tr><td>5678</td><td>Marge</td><td>Female</td><td>8888</td><td>EE</td><td>3.6</td></tr>
</tbody>
</table>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> còn có kế thừa bảng (table inheritance): <code>CREATE TABLE student (…) INHERITS (person)</code> cho student mọi cột của person, và truy vấn trên person trả về cả sinh viên (<code>ONLY person</code> thì loại họ ra). Cẩn thận: khoá chính và khoá ngoại <em>không</em> được kế thừa, nên đa số thiết kế vẫn dùng cách hai bảng của slide:
<pre><code class="language-sql">CREATE TABLE person (ssn char(4) PRIMARY KEY, name varchar(30), gender varchar(6));
CREATE TABLE student (sid char(4), status varchar(4), major varchar(10), gpa numeric(2,1))
  INHERITS (person);                        -- student tự có ssn, name, gender
INSERT INTO person  VALUES ('0001', 'Ned', 'Male');
INSERT INTO student VALUES ('1234', 'Homer', 'Male', '9999', 'Full', 'CS', 2.8),
                           ('5678', 'Marge', 'Female', '8888', 'Part', 'EE', 3.6);
SELECT ssn, name FROM person ORDER BY ssn;          -- bảng cha thấy cả sinh viên
SELECT ssn, name FROM ONLY person ORDER BY ssn;     -- ONLY: chỉ dòng nằm trong chính person</code></pre>
<div class="out">INSERT 0 1<br>
INSERT 0 2</div>
<table>
<thead><tr><th>ssn</th><th>name</th></tr></thead>
<tbody>
<tr><td>0001</td><td>Ned</td></tr>
<tr><td>1234</td><td>Homer</td></tr>
<tr><td>5678</td><td>Marge</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>ssn</th><th>name</th></tr></thead>
<tbody>
<tr><td>0001</td><td>Ned</td></tr>
</tbody>
</table>
Đọc thêm: <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-1-khoa-chinh">Khoá PostgreSQL — khoá chính</a>.</div>`],
      [27, 'Representing Class Hierarchy (disjoint and complete)',
        `<p class="y-chinh">🎯 When the hierarchy is disjoint AND complete: create no table for the superclass; each subclass table holds its own attributes and all the superclass's attributes.</p>
<p>Why it works: "complete" means every entity is in some subclass, so the superclass table would contain nothing that the subclass tables do not; "disjoint" means each entity is stored exactly once. The slide asks "need example?" — slide 28 gives one.</p>
<div class="pitfall">If the hierarchy is not complete, this method loses the "plain" entities (they have no table). If it is not disjoint, an entity in two subclasses is stored twice and its common attributes can drift apart.</div>`,
        `<p class="y-chinh">🎯 Khi phân cấp vừa tách rời VÀ vừa đầy đủ: không tạo bảng cho lớp cha; mỗi bảng lớp con chứa thuộc tính riêng và mọi thuộc tính của lớp cha.</p>
<p>Vì sao được: "đầy đủ" nghĩa là thực thể nào cũng nằm trong một lớp con, nên bảng lớp cha chẳng chứa gì mà các bảng lớp con không có; "tách rời" nghĩa là mỗi thực thể được lưu đúng một lần. Slide hỏi "cần ví dụ không?" — slide 28 cho một ví dụ.</p>
<div class="pitfall">Nếu phân cấp không đầy đủ, cách này làm mất các thực thể "thường" (chúng không có bảng nào). Nếu không tách rời, một thực thể thuộc hai lớp con bị lưu hai lần và các thuộc tính chung có thể lệch nhau.</div>`],
      [28, 'Example (disjoint and complete)',
        `<p class="y-chinh">🎯 SJSU people (<u>SSN</u>, Name) isa Student (<u>SID</u>, Major, GPA) or Faculty (Dept), disjoint and complete: only two tables, Student(SSN, Name, SID, Major, GPA) and Faculty(SSN, Name, Dept).</p>
<p>The slide's tables: Student (1234, John, 9999, CS, 2.8), (5678, Mary, 8888, EE, 3.6); Faculty (1234, Homer, C.S.), (5678, Marge, Math). To list all people, UNION the subclass tables:</p>
<pre><code class="language-sql">CREATE TABLE Student (SSN CHAR(4) PRIMARY KEY, Name VARCHAR(30), SID CHAR(4) UNIQUE, Major VARCHAR(10), GPA DECIMAL(2,1));
CREATE TABLE Faculty (SSN CHAR(4) PRIMARY KEY, Name VARCHAR(30), Dept VARCHAR(10));
-- no table for SJSU people</code></pre>
<pre><code class="language-sql">SELECT SSN, Name, 'Student' AS kind FROM Student     -- all people = UNION of the subclass tables
UNION ALL
SELECT SSN, Name, 'Faculty' FROM Faculty
ORDER BY SSN, kind;</code></pre>
<div class="out">(2 rows affected)<br>
(2 rows affected)</div>
<table>
<thead><tr><th>SSN</th><th>Name</th><th>kind</th></tr></thead>
<tbody>
<tr><td>1234</td><td>Homer</td><td>Faculty</td></tr>
<tr><td>1234</td><td>John</td><td>Student</td></tr>
<tr><td>5678</td><td>Marge</td><td>Faculty</td></tr>
<tr><td>5678</td><td>Mary</td><td>Student</td></tr>
</tbody>
</table>
<div class="pitfall">Look closely at the slide's own data: SSN 1234 is John in Student and Homer in Faculty. That contradicts "disjoint" (the same person in both subclasses) and even gives him two names — the slide's sample values were typed carelessly. No constraint in these two tables can catch it: disjointness across tables needs a trigger or a check query (see the 🐘 box).</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> (and on SQL Server, the same syntax) the check "no SSN in both subclasses" is one INTERSECT, which must return no rows — here it returns two, exposing the slide's data problem:
<pre><code class="language-sql">CREATE TABLE student (ssn char(4) PRIMARY KEY, name varchar(30), sid char(4) UNIQUE, major varchar(10), gpa numeric(2,1));
CREATE TABLE faculty (ssn char(4) PRIMARY KEY, name varchar(30), dept varchar(10));
INSERT INTO student VALUES ('1234', 'John', '9999', 'CS', 2.8), ('5678', 'Mary', '8888', 'EE', 3.6);
INSERT INTO faculty VALUES ('1234', 'Homer', 'C.S.'), ('5678', 'Marge', 'Math');
SELECT ssn FROM student INTERSECT SELECT ssn FROM faculty ORDER BY ssn;   -- disjointness check: must be empty</code></pre>
<div class="out">INSERT 0 2<br>
INSERT 0 2</div>
<table>
<thead><tr><th>ssn</th></tr></thead>
<tbody>
<tr><td>1234</td></tr>
<tr><td>5678</td></tr>
</tbody>
</table>
Read more: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-2-trigger">PostgreSQL course — triggers</a> (how to enforce it automatically).</div>`,
        `<p class="y-chinh">🎯 SJSU people (<u>SSN</u>, Name) isa Student (<u>SID</u>, Major, GPA) hoặc Faculty (Dept), tách rời và đầy đủ: chỉ hai bảng, Student(SSN, Name, SID, Major, GPA) và Faculty(SSN, Name, Dept).</p>
<p>Bảng trên slide: Student (1234, John, 9999, CS, 2.8), (5678, Mary, 8888, EE, 3.6); Faculty (1234, Homer, C.S.), (5678, Marge, Math). Muốn liệt kê mọi người thì UNION các bảng lớp con:</p>
<pre><code class="language-sql">CREATE TABLE Student (SSN CHAR(4) PRIMARY KEY, Name VARCHAR(30), SID CHAR(4) UNIQUE, Major VARCHAR(10), GPA DECIMAL(2,1));
CREATE TABLE Faculty (SSN CHAR(4) PRIMARY KEY, Name VARCHAR(30), Dept VARCHAR(10));
-- không có bảng cho SJSU people</code></pre>
<pre><code class="language-sql">SELECT SSN, Name, 'Student' AS kind FROM Student     -- mọi người = UNION các bảng lớp con
UNION ALL
SELECT SSN, Name, 'Faculty' FROM Faculty
ORDER BY SSN, kind;</code></pre>
<div class="out">(2 rows affected)<br>
(2 rows affected)</div>
<table>
<thead><tr><th>SSN</th><th>Name</th><th>kind</th></tr></thead>
<tbody>
<tr><td>1234</td><td>Homer</td><td>Faculty</td></tr>
<tr><td>1234</td><td>John</td><td>Student</td></tr>
<tr><td>5678</td><td>Marge</td><td>Faculty</td></tr>
<tr><td>5678</td><td>Mary</td><td>Student</td></tr>
</tbody>
</table>
<div class="pitfall">Nhìn kỹ chính dữ liệu của slide: SSN 1234 là John trong Student và Homer trong Faculty. Điều đó trái với "tách rời" (một người nằm ở cả hai lớp con) và còn cho người đó hai cái tên — dữ liệu mẫu của slide gõ ẩu. Không ràng buộc nào trong hai bảng này bắt được lỗi: tính tách rời giữa các bảng cần trigger hoặc một câu truy vấn kiểm tra (xem ô 🐘).</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> (và SQL Server cũng cùng cú pháp) phép kiểm "không SSN nào ở cả hai lớp con" là một INTERSECT, phải trả về rỗng — ở đây nó trả về hai dòng, lộ ra lỗi dữ liệu của slide:
<pre><code class="language-sql">CREATE TABLE student (ssn char(4) PRIMARY KEY, name varchar(30), sid char(4) UNIQUE, major varchar(10), gpa numeric(2,1));
CREATE TABLE faculty (ssn char(4) PRIMARY KEY, name varchar(30), dept varchar(10));
INSERT INTO student VALUES ('1234', 'John', '9999', 'CS', 2.8), ('5678', 'Mary', '8888', 'EE', 3.6);
INSERT INTO faculty VALUES ('1234', 'Homer', 'C.S.'), ('5678', 'Marge', 'Math');
SELECT ssn FROM student INTERSECT SELECT ssn FROM faculty ORDER BY ssn;   -- kiểm tách rời: phải rỗng</code></pre>
<div class="out">INSERT 0 2<br>
INSERT 0 2</div>
<table>
<thead><tr><th>ssn</th></tr></thead>
<tbody>
<tr><td>1234</td></tr>
<tr><td>5678</td></tr>
</tbody>
</table>
Đọc thêm: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-2-trigger">Khoá PostgreSQL — trigger</a> (cách ép tự động).</div>`],
      [29, 'Representing Aggregation',
        `<p class="y-chinh">🎯 Aggregation treats a relationship as if it were an entity so that it can take part in another relationship; the table for the outer relationship holds the key of the aggregated relationship plus the other entity's key.</p>
<p>The slide's diagram: inside the orange box, <strong>Student</strong> (<u>SID</u>, Name) — M — <strong>Advisor</strong> — 1 — <strong>Professor</strong> (<u>SSN</u>, Name, Dept): "many students have one advisor professor". The whole box (the advising relationship) is linked by <strong>member</strong> to <strong>Dept</strong> (<u>Code</u>, Name). Resulting table for member: (<u>SID</u>, <u>Code</u>) with rows (1234, 04), (5678, 08).</p>
<p>Why is the key of Advisor just SID? Advisor is many-one from Student to Professor, so each student appears in it once: SID identifies an advising pair. Member then stores SID ("primary key of Advisor") and Code ("primary key of Dept").</p>
<pre><code class="language-sql">CREATE TABLE Student   (SID CHAR(4) PRIMARY KEY, Name VARCHAR(30));
CREATE TABLE Professor (SSN CHAR(4) PRIMARY KEY, Name VARCHAR(30), Dept VARCHAR(20));
CREATE TABLE Advisor (                      -- M-1 Student -&gt; Professor: key = SID
  SID CHAR(4) PRIMARY KEY REFERENCES Student(SID),
  SSN CHAR(4) NOT NULL    REFERENCES Professor(SSN)
);
CREATE TABLE Dept (Code CHAR(2) PRIMARY KEY, Name VARCHAR(30));
CREATE TABLE Member (                       -- relationship between the aggregate Advisor and Dept
  SID  CHAR(4) REFERENCES Advisor(SID),     -- primary key of Advisor
  Code CHAR(2) REFERENCES Dept(Code),       -- primary key of Dept
  PRIMARY KEY (SID, Code)
);
INSERT INTO Student VALUES ('1234', 'An'), ('5678', 'Binh');
INSERT INTO Professor VALUES ('P001', 'Dr. Lee', 'CS');
INSERT INTO Advisor VALUES ('1234', 'P001'), ('5678', 'P001');
INSERT INTO Dept VALUES ('04', 'Computing'), ('08', 'Mathematics');
INSERT INTO Member VALUES ('1234', '04'), ('5678', '08');
SELECT * FROM Member;</code></pre>
<div class="out">(2 rows affected)<br>
(1 row affected)<br>
(2 rows affected)<br>
(2 rows affected)<br>
(2 rows affected)</div>
<table>
<thead><tr><th>SID</th><th>Code</th></tr></thead>
<tbody>
<tr><td>1234</td><td>04</td></tr>
<tr><td>5678</td><td>08</td></tr>
</tbody>
</table>
<div class="callout">🐘 <strong>On PostgreSQL</strong> the same tables, with the short form <code>REFERENCES advisor</code> (no column list = the referenced primary key). The codes are <code>char(2)</code> in both systems so that '04' keeps its leading zero — an INT column would store 4:
<pre><code class="language-sql">CREATE TABLE student   (sid char(4) PRIMARY KEY, name varchar(30));
CREATE TABLE professor (ssn char(4) PRIMARY KEY, name varchar(30), dept varchar(20));
CREATE TABLE advisor   (sid char(4) PRIMARY KEY REFERENCES student, ssn char(4) NOT NULL REFERENCES professor);
CREATE TABLE dept      (code char(2) PRIMARY KEY, name varchar(30));
CREATE TABLE member (
  sid  char(4) REFERENCES advisor,          -- short form: REFERENCES advisor = its primary key
  code char(2) REFERENCES dept,
  PRIMARY KEY (sid, code)
);
INSERT INTO student VALUES ('1234', 'An'), ('5678', 'Binh');
INSERT INTO professor VALUES ('P001', 'Dr. Lee', 'CS');
INSERT INTO advisor VALUES ('1234', 'P001'), ('5678', 'P001');
INSERT INTO dept VALUES ('04', 'Computing'), ('08', 'Mathematics');
INSERT INTO member VALUES ('1234', '04'), ('5678', '08');
SELECT * FROM member;</code></pre>
<div class="out">INSERT 0 2<br>
INSERT 0 1<br>
INSERT 0 2<br>
INSERT 0 2<br>
INSERT 0 2</div>
<table>
<thead><tr><th>sid</th><th>code</th></tr></thead>
<tbody>
<tr><td>1234</td><td>04</td></tr>
<tr><td>5678</td><td>08</td></tr>
</tbody>
</table>
Read more: <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-2-khoa-ngoai">PostgreSQL course — foreign keys</a>.</div>`,
        `<p class="y-chinh">🎯 Kết tập (aggregation) coi một liên kết như một thực thể để nó tham gia được vào một liên kết khác; bảng của liên kết bên ngoài chứa khoá của liên kết được gộp cộng khoá của thực thể kia.</p>
<p>Sơ đồ trên slide: trong khung màu cam, <strong>Student</strong> (<u>SID</u>, Name) — M — <strong>Advisor</strong> — 1 — <strong>Professor</strong> (<u>SSN</u>, Name, Dept): "nhiều sinh viên có một giáo sư cố vấn". Cả khung (liên kết cố vấn) được nối bằng <strong>member</strong> tới <strong>Dept</strong> (<u>Code</u>, Name). Bảng cho member: (<u>SID</u>, <u>Code</u>) với các dòng (1234, 04), (5678, 08).</p>
<p>Vì sao khoá của Advisor chỉ là SID? Advisor là nhiều – một từ Student tới Professor, nên mỗi sinh viên xuất hiện trong đó đúng một lần: SID xác định một cặp cố vấn. Member khi đó lưu SID ("khoá chính của Advisor") và Code ("khoá chính của Dept").</p>
<pre><code class="language-sql">CREATE TABLE Student   (SID CHAR(4) PRIMARY KEY, Name VARCHAR(30));
CREATE TABLE Professor (SSN CHAR(4) PRIMARY KEY, Name VARCHAR(30), Dept VARCHAR(20));
CREATE TABLE Advisor (                      -- M-1 Student -&gt; Professor: khoá = SID
  SID CHAR(4) PRIMARY KEY REFERENCES Student(SID),
  SSN CHAR(4) NOT NULL    REFERENCES Professor(SSN)
);
CREATE TABLE Dept (Code CHAR(2) PRIMARY KEY, Name VARCHAR(30));
CREATE TABLE Member (                       -- liên kết giữa khối gộp Advisor và Dept
  SID  CHAR(4) REFERENCES Advisor(SID),     -- khoá chính của Advisor
  Code CHAR(2) REFERENCES Dept(Code),       -- khoá chính của Dept
  PRIMARY KEY (SID, Code)
);
INSERT INTO Student VALUES ('1234', 'An'), ('5678', 'Binh');
INSERT INTO Professor VALUES ('P001', 'Dr. Lee', 'CS');
INSERT INTO Advisor VALUES ('1234', 'P001'), ('5678', 'P001');
INSERT INTO Dept VALUES ('04', 'Computing'), ('08', 'Mathematics');
INSERT INTO Member VALUES ('1234', '04'), ('5678', '08');
SELECT * FROM Member;</code></pre>
<div class="out">(2 rows affected)<br>
(1 row affected)<br>
(2 rows affected)<br>
(2 rows affected)<br>
(2 rows affected)</div>
<table>
<thead><tr><th>SID</th><th>Code</th></tr></thead>
<tbody>
<tr><td>1234</td><td>04</td></tr>
<tr><td>5678</td><td>08</td></tr>
</tbody>
</table>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> vẫn các bảng đó, với dạng ngắn <code>REFERENCES advisor</code> (không ghi cột = khoá chính được tham chiếu). Mã khoa để <code>char(2)</code> ở cả hai hệ để '04' giữ số 0 đầu — cột INT sẽ lưu thành 4:
<pre><code class="language-sql">CREATE TABLE student   (sid char(4) PRIMARY KEY, name varchar(30));
CREATE TABLE professor (ssn char(4) PRIMARY KEY, name varchar(30), dept varchar(20));
CREATE TABLE advisor   (sid char(4) PRIMARY KEY REFERENCES student, ssn char(4) NOT NULL REFERENCES professor);
CREATE TABLE dept      (code char(2) PRIMARY KEY, name varchar(30));
CREATE TABLE member (
  sid  char(4) REFERENCES advisor,          -- dạng ngắn: REFERENCES advisor = khoá chính của nó
  code char(2) REFERENCES dept,
  PRIMARY KEY (sid, code)
);
INSERT INTO student VALUES ('1234', 'An'), ('5678', 'Binh');
INSERT INTO professor VALUES ('P001', 'Dr. Lee', 'CS');
INSERT INTO advisor VALUES ('1234', 'P001'), ('5678', 'P001');
INSERT INTO dept VALUES ('04', 'Computing'), ('08', 'Mathematics');
INSERT INTO member VALUES ('1234', '04'), ('5678', '08');
SELECT * FROM member;</code></pre>
<div class="out">INSERT 0 2<br>
INSERT 0 1<br>
INSERT 0 2<br>
INSERT 0 2<br>
INSERT 0 2</div>
<table>
<thead><tr><th>sid</th><th>code</th></tr></thead>
<tbody>
<tr><td>1234</td><td>04</td></tr>
<tr><td>5678</td><td>08</td></tr>
</tbody>
</table>
Đọc thêm: <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-2-khoa-ngoai">Khoá PostgreSQL — khoá ngoại</a>.</div>`],
      [30, 'From E/R Relationship to Relations',
        `<p class="y-chinh">🎯 A relationship that uses the same entity set twice, in two roles, gets one column group per role — Contracts(starName, title, year, studioOfStar_name, producingStudio_name).</p>
<p>The slide's diagram: the diamond <strong>Contracts</strong> connects <strong>Stars</strong> and <strong>Movies</strong> with plain lines, and <strong>Studios</strong> twice with <strong>arrows</strong> labelled "Studio of star" and "Producing studio". Read it: "for a given star and movie there is one studio that employs the star and one studio that produces the movie".</p>
<ul>
<li>Every participating key becomes a column; Studios appears twice, so its key appears twice, renamed by role.</li>
<li>The arrows point at Studios, so the two studio columns are <strong>not</strong> in the key: key = (starName, title, year).</li>
</ul>
<pre><code class="language-sql">CREATE TABLE Stars   (name VARCHAR(40) PRIMARY KEY, address VARCHAR(60));
CREATE TABLE Studios (name VARCHAR(40) PRIMARY KEY, address VARCHAR(60));
CREATE TABLE Movies  (title VARCHAR(60), year INT, length INT, genre VARCHAR(20), PRIMARY KEY (title, year));
CREATE TABLE Contracts (
  starName               VARCHAR(40) REFERENCES Stars(name),
  title                  VARCHAR(60),
  year                   INT,
  studioOfStar_name      VARCHAR(40) NOT NULL REFERENCES Studios(name),  -- role "Studio of star"
  producingStudio_name   VARCHAR(40) NOT NULL REFERENCES Studios(name),  -- role "Producing studio"
  PRIMARY KEY (starName, title, year),      -- arrows point at Studios: the studios are not in the key
  FOREIGN KEY (title, year) REFERENCES Movies(title, year)
);
INSERT INTO Stars VALUES ('Carrie Fisher', 'Hollywood');
INSERT INTO Studios VALUES ('Fox', 'Los Angeles'), ('Lucasfilm', 'San Francisco');
INSERT INTO Movies VALUES ('Star Wars', 1977, 124, 'sciFi');
INSERT INTO Contracts VALUES ('Carrie Fisher', 'Star Wars', 1977, 'Fox', 'Lucasfilm');
SELECT * FROM Contracts;</code></pre>
<div class="out">(1 row affected)<br>
(2 rows affected)<br>
(1 row affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>starName</th><th>title</th><th>year</th><th>studioOfStar_name</th><th>producingStudio_name</th></tr></thead>
<tbody>
<tr><td>Carrie Fisher</td><td>Star Wars</td><td>1977</td><td>Fox</td><td>Lucasfilm</td></tr>
</tbody>
</table>
<div class="callout">🐘 <strong>On PostgreSQL</strong> the table is written the same way; PG's catalog <code>pg_constraint</code> shows the five constraints it created, with generated names such as <code>contracts_title_year_fkey</code> — two separate foreign keys to studios, one per role:
<pre><code class="language-sql">CREATE TABLE stars   (name varchar(40) PRIMARY KEY);
CREATE TABLE studios (name varchar(40) PRIMARY KEY);
CREATE TABLE movies  (title varchar(60), year int, PRIMARY KEY (title, year));
CREATE TABLE contracts (
  starname             varchar(40) REFERENCES stars,
  title                varchar(60),
  year                 int,
  studioofstar_name    varchar(40) NOT NULL REFERENCES studios,
  producingstudio_name varchar(40) NOT NULL REFERENCES studios,
  PRIMARY KEY (starname, title, year),
  FOREIGN KEY (title, year) REFERENCES movies
);
INSERT INTO stars VALUES ('Carrie Fisher');
INSERT INTO studios VALUES ('Fox'), ('Lucasfilm');
INSERT INTO movies VALUES ('Star Wars', 1977);
INSERT INTO contracts VALUES ('Carrie Fisher', 'Star Wars', 1977, 'Fox', 'Lucasfilm');
SELECT conname, pg_get_constraintdef(oid) AS definition      -- PG's catalog of constraints
FROM pg_constraint WHERE conrelid = 'contracts'::regclass ORDER BY conname;</code></pre>
<div class="out">INSERT 0 1<br>
INSERT 0 2<br>
INSERT 0 1<br>
INSERT 0 1</div>
<table>
<thead><tr><th>conname</th><th>definition</th></tr></thead>
<tbody>
<tr><td>contracts_pkey</td><td>PRIMARY KEY (starname, title, year)</td></tr>
<tr><td>contracts_producingstudio_name_fkey</td><td>FOREIGN KEY (producingstudio_name) REFERENCES studios(name)</td></tr>
<tr><td>contracts_starname_fkey</td><td>FOREIGN KEY (starname) REFERENCES stars(name)</td></tr>
<tr><td>contracts_studioofstar_name_fkey</td><td>FOREIGN KEY (studioofstar_name) REFERENCES studios(name)</td></tr>
<tr><td>contracts_title_year_fkey</td><td>FOREIGN KEY (title, year) REFERENCES movies(title, year)</td></tr>
</tbody>
</table>
Read more: <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-2-khoa-ngoai">PostgreSQL course — foreign keys</a>.</div>`,
        `<p class="y-chinh">🎯 Một liên kết dùng cùng một tập thực thể hai lần, với hai vai trò (role), có một nhóm cột cho mỗi vai — Contracts(starName, title, year, studioOfStar_name, producingStudio_name).</p>
<p>Sơ đồ trên slide: hình thoi <strong>Contracts</strong> nối <strong>Stars</strong> và <strong>Movies</strong> bằng nét thường, và nối <strong>Studios</strong> hai lần bằng <strong>mũi tên</strong> ghi "Studio of star" (hãng quản lý diễn viên) và "Producing studio" (hãng sản xuất phim). Đọc thành câu: "với một diễn viên và một phim cho trước, có một hãng thuê diễn viên đó và một hãng sản xuất phim đó".</p>
<ul>
<li>Khoá của mọi bên tham gia thành cột; Studios xuất hiện hai lần nên khoá của nó có hai lần, đổi tên theo vai.</li>
<li>Các mũi tên chỉ vào Studios, nên hai cột hãng phim <strong>không</strong> nằm trong khoá: khoá = (starName, title, year).</li>
</ul>
<pre><code class="language-sql">CREATE TABLE Stars   (name VARCHAR(40) PRIMARY KEY, address VARCHAR(60));
CREATE TABLE Studios (name VARCHAR(40) PRIMARY KEY, address VARCHAR(60));
CREATE TABLE Movies  (title VARCHAR(60), year INT, length INT, genre VARCHAR(20), PRIMARY KEY (title, year));
CREATE TABLE Contracts (
  starName               VARCHAR(40) REFERENCES Stars(name),
  title                  VARCHAR(60),
  year                   INT,
  studioOfStar_name      VARCHAR(40) NOT NULL REFERENCES Studios(name),  -- vai "Studio of star"
  producingStudio_name   VARCHAR(40) NOT NULL REFERENCES Studios(name),  -- vai "Producing studio"
  PRIMARY KEY (starName, title, year),      -- mũi tên chỉ vào Studios: studio không vào khoá
  FOREIGN KEY (title, year) REFERENCES Movies(title, year)
);
INSERT INTO Stars VALUES ('Carrie Fisher', 'Hollywood');
INSERT INTO Studios VALUES ('Fox', 'Los Angeles'), ('Lucasfilm', 'San Francisco');
INSERT INTO Movies VALUES ('Star Wars', 1977, 124, 'sciFi');
INSERT INTO Contracts VALUES ('Carrie Fisher', 'Star Wars', 1977, 'Fox', 'Lucasfilm');
SELECT * FROM Contracts;</code></pre>
<div class="out">(1 row affected)<br>
(2 rows affected)<br>
(1 row affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>starName</th><th>title</th><th>year</th><th>studioOfStar_name</th><th>producingStudio_name</th></tr></thead>
<tbody>
<tr><td>Carrie Fisher</td><td>Star Wars</td><td>1977</td><td>Fox</td><td>Lucasfilm</td></tr>
</tbody>
</table>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> bảng viết y như vậy; danh mục <code>pg_constraint</code> của PG cho thấy năm ràng buộc nó đã tạo, với tên tự sinh như <code>contracts_title_year_fkey</code> — hai khoá ngoại riêng tới studios, mỗi vai một cái:
<pre><code class="language-sql">CREATE TABLE stars   (name varchar(40) PRIMARY KEY);
CREATE TABLE studios (name varchar(40) PRIMARY KEY);
CREATE TABLE movies  (title varchar(60), year int, PRIMARY KEY (title, year));
CREATE TABLE contracts (
  starname             varchar(40) REFERENCES stars,
  title                varchar(60),
  year                 int,
  studioofstar_name    varchar(40) NOT NULL REFERENCES studios,
  producingstudio_name varchar(40) NOT NULL REFERENCES studios,
  PRIMARY KEY (starname, title, year),
  FOREIGN KEY (title, year) REFERENCES movies
);
INSERT INTO stars VALUES ('Carrie Fisher');
INSERT INTO studios VALUES ('Fox'), ('Lucasfilm');
INSERT INTO movies VALUES ('Star Wars', 1977);
INSERT INTO contracts VALUES ('Carrie Fisher', 'Star Wars', 1977, 'Fox', 'Lucasfilm');
SELECT conname, pg_get_constraintdef(oid) AS definition      -- danh mục ràng buộc của PG
FROM pg_constraint WHERE conrelid = 'contracts'::regclass ORDER BY conname;</code></pre>
<div class="out">INSERT 0 1<br>
INSERT 0 2<br>
INSERT 0 1<br>
INSERT 0 1</div>
<table>
<thead><tr><th>conname</th><th>definition</th></tr></thead>
<tbody>
<tr><td>contracts_pkey</td><td>PRIMARY KEY (starname, title, year)</td></tr>
<tr><td>contracts_producingstudio_name_fkey</td><td>FOREIGN KEY (producingstudio_name) REFERENCES studios(name)</td></tr>
<tr><td>contracts_starname_fkey</td><td>FOREIGN KEY (starname) REFERENCES stars(name)</td></tr>
<tr><td>contracts_studioofstar_name_fkey</td><td>FOREIGN KEY (studioofstar_name) REFERENCES studios(name)</td></tr>
<tr><td>contracts_title_year_fkey</td><td>FOREIGN KEY (title, year) REFERENCES movies(title, year)</td></tr>
</tbody>
</table>
Đọc thêm: <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-2-khoa-ngoai">Khoá PostgreSQL — khoá ngoại</a>.</div>`],
      [31, 'Combining Relations',
        `<p class="y-chinh">🎯 For an entity set E with a many-one relationship R to F, the relations of E and R can be combined into one: all attributes of E + the key of F + R's own attributes — Movies(title, year, length, genre) and Owns(title, year, studioName) become Movies(title, year, length, genre, studioName).</p>
<p>The slide's diagram: <strong>Stars</strong> (<u>name</u>, address) — <strong>Stars-in</strong> — <strong>Movies</strong> (<u>title</u>, <u>year</u>, length, genre), and Movies — <strong>Owns</strong> → <strong>Studios</strong> (<u>name</u>, address); the arrow into Studios makes Owns many-one ("each movie is owned by at most one studio"). Stars-in has no arrow: it is M-M and stays a table of its own.</p>
<pre><code class="language-sql">CREATE TABLE Movies1 (title VARCHAR(60), year INT, length INT, genre VARCHAR(20), PRIMARY KEY (title, year));
CREATE TABLE Owns (                         -- separate relation for Owns
  title VARCHAR(60), year INT,
  studioName VARCHAR(40) NOT NULL REFERENCES Studios(name),
  PRIMARY KEY (title, year),                -- key of the many side only
  FOREIGN KEY (title, year) REFERENCES Movies1(title, year)
);</code></pre>
<pre><code class="language-sql">CREATE TABLE Movies (                       -- Movies and Owns combined
  title VARCHAR(60), year INT, length INT, genre VARCHAR(20),
  studioName VARCHAR(40) REFERENCES Studios(name),   -- key of F = Studios
  PRIMARY KEY (title, year)
);</code></pre>
<pre><code class="language-sql">SELECT m.title, o.studioName FROM Movies1 m JOIN Owns o ON o.title = m.title AND o.year = m.year;  -- two tables need a join
SELECT title, studioName FROM Movies;                                                              -- combined: no join</code></pre>
<div class="out">(2 rows affected)<br>
(2 rows affected)<br>
(2 rows affected)<br>
(2 rows affected)</div>
<table>
<thead><tr><th>title</th><th>studioName</th></tr></thead>
<tbody>
<tr><td>Frozen</td><td>Disney</td></tr>
<tr><td>Titanic</td><td>Fox</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>title</th><th>studioName</th></tr></thead>
<tbody>
<tr><td>Frozen</td><td>Disney</td></tr>
<tr><td>Titanic</td><td>Fox</td></tr>
</tbody>
</table>
<p>Both designs give the same answer; the combined one needs no join. This combining step is exactly the "1-M rule" of slide 19 seen from the book's angle: first a relation per relationship, then merge the many-one ones into the entity on the many side.</p>
<div class="pitfall">Never combine an M-M relationship into an entity: Movies(…, starName) would repeat the movie's length and genre once per star — redundancy that normalization (Chapter 4) is designed to remove.</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> (SQL Server too) a foreign key can follow a renamed key with <code>ON UPDATE CASCADE</code>: rename the studio Fox and its movies follow automatically:
<pre><code class="language-sql">CREATE TABLE studios (name varchar(40) PRIMARY KEY);
CREATE TABLE movies (
  title varchar(60), year int, length int, genre varchar(20),
  studioname varchar(40) REFERENCES studios ON UPDATE CASCADE,   -- a studio renamed: movies follow
  PRIMARY KEY (title, year)
);
INSERT INTO studios VALUES ('Disney'), ('Fox');
INSERT INTO movies VALUES ('Frozen', 2013, 102, 'animation', 'Disney'), ('Titanic', 1997, 195, 'drama', 'Fox');
UPDATE studios SET name = '20th Century' WHERE name = 'Fox';
SELECT title, studioname FROM movies ORDER BY year;</code></pre>
<div class="out">INSERT 0 2<br>
INSERT 0 2<br>
UPDATE 1</div>
<table>
<thead><tr><th>title</th><th>studioname</th></tr></thead>
<tbody>
<tr><td>Titanic</td><td>20th Century</td></tr>
<tr><td>Frozen</td><td>Disney</td></tr>
</tbody>
</table>
Read more: <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-2-khoa-ngoai">PostgreSQL course — foreign keys</a>.</div>`,
        `<p class="y-chinh">🎯 Với tập thực thể E có liên kết nhiều – một R tới F, quan hệ của E và của R gộp được làm một: mọi thuộc tính của E + khoá của F + thuộc tính riêng của R — Movies(title, year, length, genre) và Owns(title, year, studioName) thành Movies(title, year, length, genre, studioName).</p>
<p>Sơ đồ trên slide: <strong>Stars</strong> (<u>name</u>, address) — <strong>Stars-in</strong> — <strong>Movies</strong> (<u>title</u>, <u>year</u>, length, genre), và Movies — <strong>Owns</strong> → <strong>Studios</strong> (<u>name</u>, address); mũi tên chỉ vào Studios làm Owns thành nhiều – một ("mỗi phim thuộc sở hữu của tối đa một hãng"). Stars-in không có mũi tên: nó là M-M và vẫn phải có bảng riêng.</p>
<pre><code class="language-sql">CREATE TABLE Movies1 (title VARCHAR(60), year INT, length INT, genre VARCHAR(20), PRIMARY KEY (title, year));
CREATE TABLE Owns (                         -- quan hệ riêng cho Owns
  title VARCHAR(60), year INT,
  studioName VARCHAR(40) NOT NULL REFERENCES Studios(name),
  PRIMARY KEY (title, year),                -- chỉ khoá của phía nhiều
  FOREIGN KEY (title, year) REFERENCES Movies1(title, year)
);</code></pre>
<pre><code class="language-sql">CREATE TABLE Movies (                       -- Movies và Owns gộp làm một
  title VARCHAR(60), year INT, length INT, genre VARCHAR(20),
  studioName VARCHAR(40) REFERENCES Studios(name),   -- khoá của F = Studios
  PRIMARY KEY (title, year)
);</code></pre>
<pre><code class="language-sql">SELECT m.title, o.studioName FROM Movies1 m JOIN Owns o ON o.title = m.title AND o.year = m.year;  -- hai bảng thì phải nối
SELECT title, studioName FROM Movies;                                                              -- gộp: khỏi nối</code></pre>
<div class="out">(2 rows affected)<br>
(2 rows affected)<br>
(2 rows affected)<br>
(2 rows affected)</div>
<table>
<thead><tr><th>title</th><th>studioName</th></tr></thead>
<tbody>
<tr><td>Frozen</td><td>Disney</td></tr>
<tr><td>Titanic</td><td>Fox</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>title</th><th>studioName</th></tr></thead>
<tbody>
<tr><td>Frozen</td><td>Disney</td></tr>
<tr><td>Titanic</td><td>Fox</td></tr>
</tbody>
</table>
<p>Hai thiết kế cho cùng một đáp án; bản gộp khỏi phải nối bảng. Bước gộp này chính là "luật 1-M" của slide 19 nhìn theo cách của sách: trước tiên mỗi liên kết một quan hệ, rồi gộp các liên kết nhiều – một vào thực thể ở phía nhiều.</p>
<div class="pitfall">Không bao giờ gộp liên kết M-M vào một thực thể: Movies(…, starName) sẽ lặp lại length và genre của phim một lần cho mỗi diễn viên — sự dư thừa mà chuẩn hoá (Chương 4) sinh ra để loại bỏ.</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> (SQL Server cũng vậy) khoá ngoại có thể đi theo khoá bị đổi tên nhờ <code>ON UPDATE CASCADE</code>: đổi tên hãng Fox là các phim của nó tự đổi theo:
<pre><code class="language-sql">CREATE TABLE studios (name varchar(40) PRIMARY KEY);
CREATE TABLE movies (
  title varchar(60), year int, length int, genre varchar(20),
  studioname varchar(40) REFERENCES studios ON UPDATE CASCADE,   -- đổi tên hãng: phim đi theo
  PRIMARY KEY (title, year)
);
INSERT INTO studios VALUES ('Disney'), ('Fox');
INSERT INTO movies VALUES ('Frozen', 2013, 102, 'animation', 'Disney'), ('Titanic', 1997, 195, 'drama', 'Fox');
UPDATE studios SET name = '20th Century' WHERE name = 'Fox';
SELECT title, studioname FROM movies ORDER BY year;</code></pre>
<div class="out">INSERT 0 2<br>
INSERT 0 2<br>
UPDATE 1</div>
<table>
<thead><tr><th>title</th><th>studioname</th></tr></thead>
<tbody>
<tr><td>Titanic</td><td>20th Century</td></tr>
<tr><td>Frozen</td><td>Disney</td></tr>
</tbody>
</table>
Đọc thêm: <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-2-khoa-ngoai">Khoá PostgreSQL — khoá ngoại</a>.</div>`],
      [32, 'Handling Weak Entity Sets',
        `<p class="y-chinh">🎯 A weak entity set W becomes a relation with all of W's attributes, the attributes of its supporting relationships, and the key attributes of each supporting entity set; the supporting relationship itself gets no relation — Crews(number, crewChief, studioName).</p>
<p>The slide's diagram (the same as slide 13): <strong>Crews</strong> (weak; <u>number</u>, crewChief) — double diamond <strong>Unit-of</strong> → <strong>Studios</strong> (<u>name</u>, address). Result: Studios(<u>name</u>, address), Crews(<u>number</u>, crewChief, <u>studioName</u>) — Studios.name is renamed studioName to avoid confusion (the slide's "rename attributes if necessary").</p>
<pre><code class="language-sql">CREATE TABLE Studios (
  name    VARCHAR(40) PRIMARY KEY,
  address VARCHAR(60)
);
CREATE TABLE Crews (                        -- weak entity set
  number     INT,                           -- partial key: unique only inside one studio
  crewChief  VARCHAR(40),
  studioName VARCHAR(40) REFERENCES Studios(name) ON DELETE CASCADE,  -- key of the supporting entity set
  PRIMARY KEY (number, studioName)
);
-- no table for Unit-of</code></pre>
<div class="out">(2 rows affected)<br>
(3 rows affected)</div>
<table>
<thead><tr><th>number</th><th>crewChief</th><th>studioName</th></tr></thead>
<tbody>
<tr><td>1</td><td>Mickey</td><td>Disney</td></tr>
<tr><td>2</td><td>Donald</td><td>Disney</td></tr>
<tr><td>1</td><td>Homer</td><td>Fox</td></tr>
</tbody>
</table>
<div class="out"><b>Msg 2627, Level 14, State 1<br>
Violation of PRIMARY KEY constraint 'PK__Crews__552CB7E137B557C3'. Cannot insert duplicate key in object 'dbo.Crews'. The duplicate key value is (1, Disney).</b><br>
The statement has been terminated.<br>
(1 row affected)</div>
<table>
<thead><tr><th>number</th><th>crewChief</th><th>studioName</th></tr></thead>
<tbody>
<tr><td>1</td><td>Mickey</td><td>Disney</td></tr>
<tr><td>2</td><td>Donald</td><td>Disney</td></tr>
</tbody>
</table>
<p>Read the output: crew 1 exists at Disney and at Fox (allowed); a second crew 1 at Disney is refused by the composite primary key; deleting the studio Fox deletes its crews too (ON DELETE CASCADE) — a weak entity cannot outlive its owner.</p>
<p class="dap-an">✅ <strong>Lecturers ask: "What is a weak entity? Give an example."</strong> An entity set that cannot be identified by its own attributes, only together with the key of another (supporting) entity set through a many-one supporting relationship. Examples: Crews of a Studio, Room 101 of a Hotel, a Dependent of an Employee. In the table its primary key = its partial key + the owner's key, and the owner's key is also a foreign key.</p>
<p class="dap-an">✅ <strong>"Why is there no table for Unit-of?"</strong> Its information — which studio a crew belongs to — is already the studioName column of Crews, which is part of the key.</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong> the table and ON DELETE CASCADE are identical; the error message quotes the generated constraint name <code>crews_pkey</code>, which is why many teams name constraints themselves (<code>CONSTRAINT pk_crews PRIMARY KEY (…)</code>) in both systems:
<pre><code class="language-sql">CREATE TABLE studios (name varchar(40) PRIMARY KEY, address varchar(60));
CREATE TABLE crews (
  number     int,
  crewchief  varchar(40),
  studioname varchar(40) REFERENCES studios ON DELETE CASCADE,
  PRIMARY KEY (number, studioname)
);
INSERT INTO studios VALUES ('Disney', 'Burbank'), ('Fox', 'Los Angeles');
INSERT INTO crews VALUES (1, 'Mickey', 'Disney'), (2, 'Donald', 'Disney'), (1, 'Homer', 'Fox');
INSERT INTO crews VALUES (1, 'Goofy', 'Disney');   -- the error text names the constraint</code></pre>
<div class="out"><b>ERROR:  duplicate key value violates unique constraint "crews_pkey"</b></div>
Read more: <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-2-khoa-ngoai">PostgreSQL course — foreign keys and ON DELETE</a>.</div>`,
        `<p class="y-chinh">🎯 Tập thực thể yếu W thành một quan hệ gồm mọi thuộc tính của W, thuộc tính của các liên kết hỗ trợ, và thuộc tính khoá của từng tập thực thể hỗ trợ; bản thân liên kết hỗ trợ không có quan hệ nào — Crews(number, crewChief, studioName).</p>
<p>Sơ đồ trên slide (giống slide 13): <strong>Crews</strong> (yếu; <u>number</u>, crewChief) — hình thoi đôi <strong>Unit-of</strong> → <strong>Studios</strong> (<u>name</u>, address). Kết quả: Studios(<u>name</u>, address), Crews(<u>number</u>, crewChief, <u>studioName</u>) — Studios.name được đổi tên thành studioName cho khỏi nhầm (chính là câu "đổi tên thuộc tính nếu cần" trên slide).</p>
<pre><code class="language-sql">CREATE TABLE Studios (
  name    VARCHAR(40) PRIMARY KEY,
  address VARCHAR(60)
);
CREATE TABLE Crews (                        -- tập thực thể yếu
  number     INT,                           -- khoá bộ phận: chỉ duy nhất trong một studio
  crewChief  VARCHAR(40),
  studioName VARCHAR(40) REFERENCES Studios(name) ON DELETE CASCADE,  -- khoá của tập thực thể hỗ trợ
  PRIMARY KEY (number, studioName)
);
-- không có bảng cho Unit-of</code></pre>
<div class="out">(2 rows affected)<br>
(3 rows affected)</div>
<table>
<thead><tr><th>number</th><th>crewChief</th><th>studioName</th></tr></thead>
<tbody>
<tr><td>1</td><td>Mickey</td><td>Disney</td></tr>
<tr><td>2</td><td>Donald</td><td>Disney</td></tr>
<tr><td>1</td><td>Homer</td><td>Fox</td></tr>
</tbody>
</table>
<div class="out"><b>Msg 2627, Level 14, State 1<br>
Violation of PRIMARY KEY constraint 'PK__Crews__552CB7E137B557C3'. Cannot insert duplicate key in object 'dbo.Crews'. The duplicate key value is (1, Disney).</b><br>
The statement has been terminated.<br>
(1 row affected)</div>
<table>
<thead><tr><th>number</th><th>crewChief</th><th>studioName</th></tr></thead>
<tbody>
<tr><td>1</td><td>Mickey</td><td>Disney</td></tr>
<tr><td>2</td><td>Donald</td><td>Disney</td></tr>
</tbody>
</table>
<p>Đọc output: tổ 1 có ở Disney và ở Fox (được phép); tổ 1 thứ hai ở Disney bị khoá chính ghép từ chối; xoá hãng Fox thì các tổ của nó cũng bị xoá theo (ON DELETE CASCADE) — thực thể yếu không sống lâu hơn chủ của nó.</p>
<p class="dap-an">✅ <strong>Thầy hay hỏi: "Thực thể yếu là gì? Lấy ví dụ."</strong> Là tập thực thể không tự xác định được bằng thuộc tính của chính nó, mà phải đi kèm khoá của một tập thực thể khác (tập hỗ trợ) thông qua một liên kết hỗ trợ nhiều – một. Ví dụ: tổ sản xuất (Crews) của một hãng phim, phòng 101 của một khách sạn, người phụ thuộc (Dependent) của một nhân viên. Trong bảng, khoá chính của nó = khoá bộ phận (partial key) + khoá của chủ, và khoá của chủ đồng thời là khoá ngoại.</p>
<p class="dap-an">✅ <strong>"Vì sao không có bảng cho Unit-of?"</strong> Thông tin của nó — tổ thuộc hãng nào — đã nằm ở cột studioName của Crews, và cột đó là một phần của khoá.</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> bảng và ON DELETE CASCADE y hệt; thông báo lỗi trích tên ràng buộc tự sinh <code>crews_pkey</code>, vì vậy nhiều nhóm tự đặt tên ràng buộc (<code>CONSTRAINT pk_crews PRIMARY KEY (…)</code>) ở cả hai hệ:
<pre><code class="language-sql">CREATE TABLE studios (name varchar(40) PRIMARY KEY, address varchar(60));
CREATE TABLE crews (
  number     int,
  crewchief  varchar(40),
  studioname varchar(40) REFERENCES studios ON DELETE CASCADE,
  PRIMARY KEY (number, studioname)
);
INSERT INTO studios VALUES ('Disney', 'Burbank'), ('Fox', 'Los Angeles');
INSERT INTO crews VALUES (1, 'Mickey', 'Disney'), (2, 'Donald', 'Disney'), (1, 'Homer', 'Fox');
INSERT INTO crews VALUES (1, 'Goofy', 'Disney');   -- thông báo lỗi nêu tên ràng buộc</code></pre>
<div class="out"><b>ERROR:  duplicate key value violates unique constraint "crews_pkey"</b></div>
Đọc thêm: <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-2-khoa-ngoai">Khoá PostgreSQL — khoá ngoại và ON DELETE</a>.</div>`],
    ]),
    bi(`<h3>✅ Check yourself in 60 seconds</h3>
<ol>
<li>An ERD has entity sets A, B, C; A–B is 1-M, B–C is M-M with attribute x, and C has a multivalued attribute. How many tables?</li>
<li>What is the key of the table for a ternary relationship R(E, F, G) with an arrow into G?</li>
<li>Name two ways to store the isa hierarchy of slide 26 and when each is allowed.</li>
</ol>
<p class="dap-an">✅ <strong>Answers:</strong> (1) 5 — A, B, C, the M-M table (bKey, cKey, x) and the multivalued table; the 1-M is a foreign key in B. (2) the keys of E and F; G's key is a non-key column. (3) superclass table + subclass tables carrying its key (always allowed); subclass tables only (only when the hierarchy is disjoint and complete).</p>
<p><strong>Next:</strong> lesson 3.C — slides 33–53: three strategies for subclass structures and the UML notation.</p>`,
    `<h3>✅ Tự kiểm tra trong 60 giây</h3>
<ol>
<li>Một ERD có các tập thực thể A, B, C; A–B là 1-M, B–C là M-M có thuộc tính x, và C có một thuộc tính đa trị. Bao nhiêu bảng?</li>
<li>Khoá của bảng cho liên kết ba ngôi R(E, F, G) có mũi tên chỉ vào G là gì?</li>
<li>Nêu hai cách lưu phân cấp isa của slide 26 và khi nào được dùng mỗi cách.</li>
</ol>
<p class="dap-an">✅ <strong>Đáp án:</strong> (1) 5 — A, B, C, bảng M-M (khoá B, khoá C, x) và bảng đa trị; liên kết 1-M là một khoá ngoại trong B. (2) khoá của E và của F; khoá của G là cột không thuộc khoá. (3) bảng lớp cha + các bảng lớp con mang khoá của nó (luôn dùng được); chỉ các bảng lớp con (chỉ khi phân cấp tách rời và đầy đủ).</p>
<p><strong>Học tiếp:</strong> bài 3.C — slide 33–53: ba chiến lược cho cấu trúc lớp con và ký hiệu UML.</p>`),
    books([
      ['ullman', 'Ch.4 High-Level Database Models — §4.5 From E/R Diagrams to Relational Designs (entity sets, relationships, combining relations, weak entity sets)', 'Chương 4 High-Level Database Models — §4.5 From E/R Diagrams to Relational Designs (tập thực thể, liên kết, gộp quan hệ, tập thực thể yếu)'],
    ]),
  ].join('\n'),
};

/* ───────── 3.C — 📑 Slide by slide · Subclass structures to relations and UML (school Chapter 4, slides 33–53) ───────── */
const L_dbi5_3 = {
  title: '3.C — 📑 Slide by slide · Subclass structures to relations and UML (school Chapter 4, slides 33–53)|||3.C — 📑 Học theo từng slide · Chuyển cấu trúc lớp con sang quan hệ và UML (Chapter 4 của trường, slide 33–53)',
  slug: 'dbi202-slide-dbi5-3',
  type: 'VIDEO',
  description: 'Giảng slide 33–53 của bộ Chapter 4 của trường (trên web là Chương 3): ba chiến lược chuyển cây lớp con Movies/Cartoons/Murder Mysteries (kiểu E/R, hướng đối tượng, dùng NULL) chạy thật và so sánh, rồi phần UML tự học: lớp, liên kết và bội số 0..1/0..*/1..1, liên kết tự thân, lớp liên kết, lớp con, kết tập và hợp thành, và cách chuyển UML sang quan hệ.',
  content: [
    bi(`<span class="eyebrow">Chapter 3 · Lesson 3.C · school deck "Chapter 4", slides 33–53</span>
<h2>Subclass structures and UML — the deck, slide by slide (part 3 of 3)</h2>
<p class="lead"><strong>These are slides 33–53 of the school's Chapter 4; on this website the topic is Chapter 3.</strong> Slides 33–38 answer one question with three answers: how do you store a class hierarchy in tables? Slides 39–53 are marked "self studying": the same modelling ideas drawn in UML, the notation of software design classes (SWR302, SWD392) — you will meet it again in every project.</p>
<h3>The three strategies at a glance (Movies with Cartoons and Murder Mysteries)</h3>
<table>
<thead><tr><th>Strategy</th><th>Relations created</th><th>A murder mystery is stored in</th><th>Weak point</th></tr></thead>
<tbody>
<tr><td>E/R style (slide 36)</td><td>Movies, MurderMysteries, (Cartoons), Voices</td><td>Movies + MurderMysteries (2 rows)</td><td>joins to rebuild an entity</td></tr>
<tr><td>Object-oriented (slide 37)</td><td>Movies, MoviesC, MoviesMM, MoviesCMM</td><td>exactly one table</td><td>many tables (2ⁿ), queries on all movies need UNION</td></tr>
<tr><td>Null values (slide 38)</td><td>Movie</td><td>one row, weapon filled</td><td>NULLs in every column that does not apply</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 3 · Bài 3.C · bộ slide "Chapter 4" của trường, slide 33–53</span>
<h2>Cấu trúc lớp con và UML — học bộ slide từng trang (phần 3/3)</h2>
<p class="lead"><strong>Đây là slide 33–53 của Chapter 4 của trường; trên web chủ đề này là Chương 3.</strong> Slide 33–38 trả lời một câu hỏi bằng ba đáp án: lưu một cây phân cấp lớp vào bảng thế nào? Slide 39–53 được ghi "self studying" (tự học): cùng những ý mô hình hoá đó nhưng vẽ bằng UML (Unified Modeling Language — ngôn ngữ mô hình hoá thống nhất), ký hiệu của các môn thiết kế phần mềm (SWR302, SWD392) — bạn sẽ gặp lại nó trong mọi đồ án.</p>
<h3>Ba chiến lược trong một bảng (Movies với Cartoons và Murder Mysteries)</h3>
<table>
<thead><tr><th>Chiến lược</th><th>Các quan hệ tạo ra</th><th>Một phim trinh thám nằm ở</th><th>Điểm yếu</th></tr></thead>
<tbody>
<tr><td>Kiểu E/R (slide 36)</td><td>Movies, MurderMysteries, (Cartoons), Voices</td><td>Movies + MurderMysteries (2 dòng)</td><td>phải nối bảng để dựng lại một thực thể</td></tr>
<tr><td>Hướng đối tượng (slide 37)</td><td>Movies, MoviesC, MoviesMM, MoviesCMM</td><td>đúng một bảng</td><td>nhiều bảng (2ⁿ), truy vấn trên mọi phim phải UNION</td></tr>
<tr><td>Dùng giá trị NULL (slide 38)</td><td>Movie</td><td>một dòng, có điền weapon</td><td>NULL ở mọi cột không áp dụng</td></tr>
</tbody>
</table>`),
    walkHead('dbi5', 33, 53),
    walk('dbi5', [
      [33, 'SUBCLASS STRUCTURES TO RELATIONS',
        `<p class="y-chinh">🎯 Section title: converting subclass (isa) structures into relations — textbook §4.6.</p>
<p>Lesson 3.B (slides 25–28) already gave two recipes for a Person/Student hierarchy. This section, taken from the textbook, names three general strategies and compares them on one example.</p>`,
        `<p class="y-chinh">🎯 Tiêu đề mục: chuyển cấu trúc lớp con (isa) thành quan hệ — mục §4.6 của giáo trình.</p>
<p>Bài 3.B (slide 25–28) đã cho hai công thức cho phân cấp Person/Student. Mục này, lấy từ giáo trình, gọi tên ba chiến lược tổng quát và so sánh chúng trên cùng một ví dụ.</p>`],
      [34, 'Converting Subclass Structures to Relations',
        `<p class="y-chinh">🎯 The example to convert: Movies (length, title, year, genre) with two isa subclasses — Cartoons, linked by Voices to Stars, and Murder Mysteries with the attribute weapon.</p>
<p>It is the diagram of slide 16 again. Before answering "how do we convert this structure?", notice what must survive: every movie's four attributes, the weapon of each murder mystery, which stars voice which cartoon — and the fact that a movie can be a cartoon <em>and</em> a murder mystery at the same time.</p>
<p class="dap-an">✅ <strong>Lecturers ask: "How many relations do you need?"</strong> It depends on the strategy — 4 (E/R style, 3 after removing Cartoons), 4 (object-oriented, plus Voices) or 1 (nulls, plus Voices). Slides 35–38 show each.</p>`,
        `<p class="y-chinh">🎯 Ví dụ cần chuyển: Movies (length, title, year, genre) với hai lớp con isa — Cartoons, nối bằng Voices tới Stars, và Murder Mysteries có thuộc tính weapon.</p>
<p>Đây lại là sơ đồ của slide 16. Trước khi trả lời "chuyển cấu trúc này thế nào?", hãy để ý những gì phải giữ được: bốn thuộc tính của mọi phim, hung khí (weapon) của từng phim trinh thám, diễn viên nào lồng tiếng phim hoạt hình nào — và việc một phim có thể vừa là hoạt hình <em>vừa</em> là trinh thám.</p>
<p class="dap-an">✅ <strong>Thầy hay hỏi: "Cần bao nhiêu quan hệ?"</strong> Tuỳ chiến lược — 4 (kiểu E/R, còn 3 khi bỏ Cartoons), 4 (hướng đối tượng, cộng Voices) hoặc 1 (dùng NULL, cộng Voices). Slide 35–38 cho từng cách.</p>`],
      [35, 'The principal conversion strategies',
        `<p class="y-chinh">🎯 Three strategies: follow the E/R viewpoint (a relation per entity set with the root's key), treat entities as object-oriented (a relation per subtree that includes the root), or use null values (one relation with every attribute).</p>
<table>
<thead><tr><th>Strategy</th><th>Rule on the slide</th><th>Plain meaning</th></tr></thead>
<tbody>
<tr><td>Follow E/R viewpoint</td><td>for each entity set E in the hierarchy, a relation with the key attributes from the root and the attributes of E</td><td>an entity is spread over several tables, one per class it belongs to</td></tr>
<tr><td>Treat entities as object-oriented</td><td>for each possible subtree that includes the root, one relation with all attributes of all entity sets in the subtree</td><td>each entity lives in exactly one table, chosen by the exact combination of classes it belongs to</td></tr>
<tr><td>Use null values</td><td>one relation with all attributes of all entity sets; NULL for what an entity does not have</td><td>everything in one wide table</td></tr>
</tbody>
</table>
<p class="meo">🧠 <strong>Remember "E-O-N":</strong> E/R spreads, OO picks one box, Null puts all in one box.</p>`,
        `<p class="y-chinh">🎯 Ba chiến lược: theo góc nhìn E/R (mỗi tập thực thể một quan hệ mang khoá của gốc), coi thực thể như hướng đối tượng (mỗi cây con chứa gốc một quan hệ), hoặc dùng giá trị NULL (một quan hệ chứa mọi thuộc tính).</p>
<table>
<thead><tr><th>Chiến lược</th><th>Luật trên slide</th><th>Nghĩa đơn giản</th></tr></thead>
<tbody>
<tr><td>Theo góc nhìn E/R</td><td>mỗi tập thực thể E trong cây một quan hệ, gồm thuộc tính khoá của gốc và thuộc tính của E</td><td>một thực thể được rải ra nhiều bảng, mỗi lớp nó thuộc về một bảng</td></tr>
<tr><td>Coi như hướng đối tượng (object-oriented)</td><td>mỗi cây con có chứa gốc một quan hệ, gồm mọi thuộc tính của mọi tập thực thể trong cây con đó</td><td>mỗi thực thể nằm đúng một bảng, chọn theo đúng tổ hợp các lớp nó thuộc về</td></tr>
<tr><td>Dùng giá trị NULL</td><td>một quan hệ chứa mọi thuộc tính của mọi tập thực thể; NULL cho thứ thực thể không có</td><td>tất cả trong một bảng rộng</td></tr>
</tbody>
</table>
<p class="meo">🧠 <strong>Nhớ "E-O-N":</strong> E/R thì rải ra, OO thì chọn một hộp, Null thì bỏ hết vào một hộp.</p>`],
      [36, 'E/R Style Conversion',
        `<p class="y-chinh">🎯 E/R style gives Movies(title, year, length, genre), MurderMysteries(title, year, weapon), Voices(title, year, starName) — and Cartoons(title, year) is removed because Voices already lists every cartoon's key.</p>
<p>Each subclass relation carries the root's key (title, year, in red on the slide) plus its own attributes. Cartoons has no own attribute, so its relation would contain only (title, year); every cartoon that has a voice actor already appears in Voices, so the slide strikes Cartoons out. (If you must also record cartoons without any voice, keep it.)</p>
<pre><code class="language-sql">CREATE TABLE Movies (title VARCHAR(60), year INT, length INT, genre VARCHAR(20), PRIMARY KEY (title, year));
CREATE TABLE MurderMysteries (              -- key of the root + own attribute
  title VARCHAR(60), year INT, weapon VARCHAR(20),
  PRIMARY KEY (title, year),
  FOREIGN KEY (title, year) REFERENCES Movies(title, year)
);
CREATE TABLE Voices (                       -- the relationship Voices(Cartoons, Stars)
  title VARCHAR(60), year INT, starName VARCHAR(40),
  PRIMARY KEY (title, year, starName),
  FOREIGN KEY (title, year) REFERENCES Movies(title, year)
);
-- Cartoons(title, year) is not created: Voices already lists the cartoons</code></pre>
<pre><code class="language-sql">SELECT m.title, m.year, m.length, mm.weapon       -- a murder mystery with ALL its attributes needs a join
FROM Movies m JOIN MurderMysteries mm ON mm.title = m.title AND mm.year = m.year
ORDER BY m.year;</code></pre>
<div class="out">(4 rows affected)<br>
(2 rows affected)<br>
(2 rows affected)</div>
<table>
<thead><tr><th>title</th><th>year</th><th>length</th><th>weapon</th></tr></thead>
<tbody>
<tr><td>Chinatown</td><td>1974</td><td>130</td><td>Gun</td></tr>
<tr><td>Roger Rabbit</td><td>1988</td><td>104</td><td>Dip</td></tr>
</tbody>
</table>
<p>The sample movies are illustrative data: Roger Rabbit (1988) is both a cartoon (it has a voice in Voices) and a murder mystery. Getting a murder mystery with all its attributes needs a join of two tables.</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong> the join can be written <code>NATURAL JOIN</code>, which joins on every column with the same name (title, year). SQL Server has no NATURAL JOIN — you must write the ON condition. Handy, but dangerous if two tables later get another common column:
<pre><code class="language-sql">CREATE TABLE movies (title varchar(60), year int, length int, genre varchar(20), PRIMARY KEY (title, year));
CREATE TABLE murdermysteries (title varchar(60), year int, weapon varchar(20),
  PRIMARY KEY (title, year), FOREIGN KEY (title, year) REFERENCES movies);
INSERT INTO movies VALUES ('Star Wars', 1977, 124, 'sciFi'), ('Lion King', 1994, 89, 'animation'),
                          ('Roger Rabbit', 1988, 104, 'comedy'), ('Chinatown', 1974, 130, 'crime');
INSERT INTO murdermysteries VALUES ('Roger Rabbit', 1988, 'Dip'), ('Chinatown', 1974, 'Gun');
SELECT title, year, length, weapon
FROM movies NATURAL JOIN murdermysteries   -- joins on the common columns title, year
ORDER BY year;</code></pre>
<div class="out">INSERT 0 4<br>
INSERT 0 2</div>
<table>
<thead><tr><th>title</th><th>year</th><th>length</th><th>weapon</th></tr></thead>
<tbody>
<tr><td>Chinatown</td><td>1974</td><td>130</td><td>Gun</td></tr>
<tr><td>Roger Rabbit</td><td>1988</td><td>104</td><td>Dip</td></tr>
</tbody>
</table>
Read more: <a href="/courses/postgresql/learn?lessonSlug=postgresql-5-1-inner-join">PostgreSQL course — INNER JOIN</a>.</div>`,
        `<p class="y-chinh">🎯 Kiểu E/R cho ra Movies(title, year, length, genre), MurderMysteries(title, year, weapon), Voices(title, year, starName) — còn Cartoons(title, year) bị bỏ vì Voices đã liệt kê khoá của mọi phim hoạt hình.</p>
<p>Mỗi quan hệ lớp con mang khoá của gốc (title, year — tô đỏ trên slide) cộng thuộc tính riêng. Cartoons không có thuộc tính riêng nào, nên quan hệ của nó chỉ chứa (title, year); mọi phim hoạt hình có người lồng tiếng đều đã có trong Voices, nên slide gạch bỏ Cartoons. (Nếu phải ghi cả phim hoạt hình chưa có ai lồng tiếng thì giữ lại.)</p>
<pre><code class="language-sql">CREATE TABLE Movies (title VARCHAR(60), year INT, length INT, genre VARCHAR(20), PRIMARY KEY (title, year));
CREATE TABLE MurderMysteries (              -- khoá của gốc + thuộc tính riêng
  title VARCHAR(60), year INT, weapon VARCHAR(20),
  PRIMARY KEY (title, year),
  FOREIGN KEY (title, year) REFERENCES Movies(title, year)
);
CREATE TABLE Voices (                       -- liên kết Voices(Cartoons, Stars)
  title VARCHAR(60), year INT, starName VARCHAR(40),
  PRIMARY KEY (title, year, starName),
  FOREIGN KEY (title, year) REFERENCES Movies(title, year)
);
-- không tạo Cartoons(title, year): Voices đã liệt kê các phim hoạt hình</code></pre>
<pre><code class="language-sql">SELECT m.title, m.year, m.length, mm.weapon       -- lấy đủ thuộc tính một phim trinh thám phải nối
FROM Movies m JOIN MurderMysteries mm ON mm.title = m.title AND mm.year = m.year
ORDER BY m.year;</code></pre>
<div class="out">(4 rows affected)<br>
(2 rows affected)<br>
(2 rows affected)</div>
<table>
<thead><tr><th>title</th><th>year</th><th>length</th><th>weapon</th></tr></thead>
<tbody>
<tr><td>Chinatown</td><td>1974</td><td>130</td><td>Gun</td></tr>
<tr><td>Roger Rabbit</td><td>1988</td><td>104</td><td>Dip</td></tr>
</tbody>
</table>
<p>Các phim mẫu là dữ liệu minh hoạ: Roger Rabbit (1988) vừa là phim hoạt hình (có người lồng tiếng trong Voices) vừa là phim trinh thám. Muốn lấy một phim trinh thám đủ mọi thuộc tính phải nối hai bảng.</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> phép nối viết được là <code>NATURAL JOIN</code> (nối tự nhiên), tự nối theo mọi cột trùng tên (title, year). SQL Server không có NATURAL JOIN — phải viết điều kiện ON. Tiện, nhưng nguy hiểm nếu sau này hai bảng có thêm một cột trùng tên:
<pre><code class="language-sql">CREATE TABLE movies (title varchar(60), year int, length int, genre varchar(20), PRIMARY KEY (title, year));
CREATE TABLE murdermysteries (title varchar(60), year int, weapon varchar(20),
  PRIMARY KEY (title, year), FOREIGN KEY (title, year) REFERENCES movies);
INSERT INTO movies VALUES ('Star Wars', 1977, 124, 'sciFi'), ('Lion King', 1994, 89, 'animation'),
                          ('Roger Rabbit', 1988, 104, 'comedy'), ('Chinatown', 1974, 130, 'crime');
INSERT INTO murdermysteries VALUES ('Roger Rabbit', 1988, 'Dip'), ('Chinatown', 1974, 'Gun');
SELECT title, year, length, weapon
FROM movies NATURAL JOIN murdermysteries   -- nối theo các cột trùng tên title, year
ORDER BY year;</code></pre>
<div class="out">INSERT 0 4<br>
INSERT 0 2</div>
<table>
<thead><tr><th>title</th><th>year</th><th>length</th><th>weapon</th></tr></thead>
<tbody>
<tr><td>Chinatown</td><td>1974</td><td>130</td><td>Gun</td></tr>
<tr><td>Roger Rabbit</td><td>1988</td><td>104</td><td>Dip</td></tr>
</tbody>
</table>
Đọc thêm: <a href="/courses/postgresql/learn?lessonSlug=postgresql-5-1-inner-join">Khoá PostgreSQL — INNER JOIN</a>.</div>`],
      [37, 'An Object-Oriented Approach',
        `<p class="y-chinh">🎯 Object-oriented: one relation per subtree containing the root — Movies, MoviesC, MoviesMM, MoviesCMM — each holding all attributes of its classes; every movie is stored in exactly one of them.</p>
<p>The four subtrees that include Movies: {Movies} (ordinary movies), {Movies, Cartoons}, {Movies, Murder Mysteries}, {Movies, Cartoons, Murder Mysteries}. Only the last two contain Murder Mysteries, so only they have the weapon column. With n subclasses there can be up to 2ⁿ relations.</p>
<pre><code class="language-sql">CREATE TABLE Movies    (title VARCHAR(60), year INT, length INT, genre VARCHAR(20), PRIMARY KEY (title, year));  -- plain movies
CREATE TABLE MoviesC   (title VARCHAR(60), year INT, length INT, genre VARCHAR(20), PRIMARY KEY (title, year));  -- cartoons only
CREATE TABLE MoviesMM  (title VARCHAR(60), year INT, length INT, genre VARCHAR(20), weapon VARCHAR(20), PRIMARY KEY (title, year));  -- murder mysteries only
CREATE TABLE MoviesCMM (title VARCHAR(60), year INT, length INT, genre VARCHAR(20), weapon VARCHAR(20), PRIMARY KEY (title, year));  -- both</code></pre>
<pre><code class="language-sql">SELECT title, year, weapon FROM MoviesMM           -- every murder mystery = two tables
UNION ALL
SELECT title, year, weapon FROM MoviesCMM
ORDER BY year;</code></pre>
<div class="out">(1 row affected)<br>
(1 row affected)<br>
(1 row affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>title</th><th>year</th><th>weapon</th></tr></thead>
<tbody>
<tr><td>Chinatown</td><td>1974</td><td>Gun</td></tr>
<tr><td>Roger Rabbit</td><td>1988</td><td>Dip</td></tr>
</tbody>
</table>
<p>"All murder mysteries" needs a UNION of two tables, and "all movies" would need four. Voices(title, year, starName) still exists and now refers to MoviesC or MoviesCMM — no single foreign key can express that, one of this strategy's costs.</p>
<p class="dap-an">✅ <strong>"How many relations does the OO approach give with 2 subclasses?"</strong> 2² = 4: every combination of subclasses, including "none" (plain movies).</p>`,
        `<p class="y-chinh">🎯 Hướng đối tượng: mỗi cây con chứa gốc một quan hệ — Movies, MoviesC, MoviesMM, MoviesCMM — mỗi quan hệ chứa mọi thuộc tính của các lớp trong đó; mỗi phim lưu ở đúng một quan hệ.</p>
<p>Bốn cây con có chứa Movies: {Movies} (phim thường), {Movies, Cartoons}, {Movies, Murder Mysteries}, {Movies, Cartoons, Murder Mysteries}. Chỉ hai cây cuối có Murder Mysteries nên chỉ chúng có cột weapon. Với n lớp con có thể có tới 2ⁿ quan hệ.</p>
<pre><code class="language-sql">CREATE TABLE Movies    (title VARCHAR(60), year INT, length INT, genre VARCHAR(20), PRIMARY KEY (title, year));  -- phim thường
CREATE TABLE MoviesC   (title VARCHAR(60), year INT, length INT, genre VARCHAR(20), PRIMARY KEY (title, year));  -- chỉ hoạt hình
CREATE TABLE MoviesMM  (title VARCHAR(60), year INT, length INT, genre VARCHAR(20), weapon VARCHAR(20), PRIMARY KEY (title, year));  -- chỉ trinh thám
CREATE TABLE MoviesCMM (title VARCHAR(60), year INT, length INT, genre VARCHAR(20), weapon VARCHAR(20), PRIMARY KEY (title, year));  -- cả hai</code></pre>
<pre><code class="language-sql">SELECT title, year, weapon FROM MoviesMM           -- mọi phim trinh thám = hai bảng
UNION ALL
SELECT title, year, weapon FROM MoviesCMM
ORDER BY year;</code></pre>
<div class="out">(1 row affected)<br>
(1 row affected)<br>
(1 row affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>title</th><th>year</th><th>weapon</th></tr></thead>
<tbody>
<tr><td>Chinatown</td><td>1974</td><td>Gun</td></tr>
<tr><td>Roger Rabbit</td><td>1988</td><td>Dip</td></tr>
</tbody>
</table>
<p>"Mọi phim trinh thám" phải UNION hai bảng, còn "mọi phim" thì phải bốn. Voices(title, year, starName) vẫn tồn tại và giờ tham chiếu tới MoviesC hoặc MoviesCMM — không một khoá ngoại nào diễn tả được điều đó, đó là một cái giá của chiến lược này.</p>
<p class="dap-an">✅ <strong>"Cách hướng đối tượng với 2 lớp con cho bao nhiêu quan hệ?"</strong> 2² = 4: mọi tổ hợp lớp con, kể cả "không lớp nào" (phim thường).</p>`],
      [38, 'Using Null Values',
        `<p class="y-chinh">🎯 Null values: a single relation Movie(title, year, length, genre, weapon); weapon is NULL for every movie that is not a murder mystery.</p>
<pre><code class="language-sql">CREATE TABLE Movie (                        -- one relation for the whole hierarchy
  title VARCHAR(60), year INT, length INT, genre VARCHAR(20),
  weapon VARCHAR(20) NULL,                  -- NULL when the movie is not a murder mystery
  PRIMARY KEY (title, year)
);</code></pre>
<pre><code class="language-sql">SELECT * FROM Movie ORDER BY year;
SELECT title FROM Movie WHERE weapon IS NOT NULL ORDER BY year;   -- the murder mysteries</code></pre>
<div class="out">(4 rows affected)</div>
<table>
<thead><tr><th>title</th><th>year</th><th>length</th><th>genre</th><th>weapon</th></tr></thead>
<tbody>
<tr><td>Chinatown</td><td>1974</td><td>130</td><td>crime</td><td>Gun</td></tr>
<tr><td>Star Wars</td><td>1977</td><td>124</td><td>sciFi</td><td><em>NULL</em></td></tr>
<tr><td>Roger Rabbit</td><td>1988</td><td>104</td><td>comedy</td><td>Dip</td></tr>
<tr><td>Lion King</td><td>1994</td><td>89</td><td>animation</td><td><em>NULL</em></td></tr>
</tbody>
</table>
<table>
<thead><tr><th>title</th></tr></thead>
<tbody>
<tr><td>Chinatown</td></tr>
<tr><td>Roger Rabbit</td></tr>
</tbody>
</table>
<p>One table, no join, no UNION — but NULL now means two things: "not a murder mystery" or "a murder mystery whose weapon is unknown". It also cannot say which movies are cartoons, except through Voices. Many real applications still choose this strategy for its simplicity, often adding a type column.</p>
<div class="pitfall">Test with <code>weapon IS NOT NULL</code>, never <code>weapon &lt;&gt; NULL</code> — any comparison with NULL is unknown, so that condition returns no rows at all.</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> <code>ISNULL(weapon, '…')</code> of T-SQL is written <code>coalesce(weapon, '…')</code> (coalesce also works in SQL Server), and PG can count with a condition using <code>count(*) FILTER (WHERE …)</code>, which T-SQL writes as <code>SUM(CASE WHEN … THEN 1 ELSE 0 END)</code>:
<pre><code class="language-sql">CREATE TABLE movie (title varchar(60), year int, length int, genre varchar(20), weapon varchar(20), PRIMARY KEY (title, year));
INSERT INTO movie VALUES ('Star Wars', 1977, 124, 'sciFi', NULL), ('Lion King', 1994, 89, 'animation', NULL),
                         ('Roger Rabbit', 1988, 104, 'comedy', 'Dip'), ('Chinatown', 1974, 130, 'crime', 'Gun');
SELECT title, coalesce(weapon, '(not a mystery)') AS weapon FROM movie ORDER BY year;   -- ISNULL in T-SQL
SELECT count(*) FILTER (WHERE weapon IS NOT NULL) AS mysteries, count(*) AS movies FROM movie;   -- FILTER: PG only</code></pre>
<div class="out">INSERT 0 4</div>
<table>
<thead><tr><th>title</th><th>weapon</th></tr></thead>
<tbody>
<tr><td>Chinatown</td><td>Gun</td></tr>
<tr><td>Star Wars</td><td>(not a mystery)</td></tr>
<tr><td>Roger Rabbit</td><td>Dip</td></tr>
<tr><td>Lion King</td><td>(not a mystery)</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>mysteries</th><th>movies</th></tr></thead>
<tbody>
<tr><td>2</td><td>4</td></tr>
</tbody>
</table>
Read more: <a href="/courses/postgresql/learn?lessonSlug=postgresql-6-3-having-filter">PostgreSQL course — HAVING and FILTER</a>.</div>`,
        `<p class="y-chinh">🎯 Dùng giá trị NULL: một quan hệ duy nhất Movie(title, year, length, genre, weapon); weapon là NULL với mọi phim không phải trinh thám.</p>
<pre><code class="language-sql">CREATE TABLE Movie (                        -- một quan hệ cho cả cây phân cấp
  title VARCHAR(60), year INT, length INT, genre VARCHAR(20),
  weapon VARCHAR(20) NULL,                  -- NULL khi phim không phải trinh thám
  PRIMARY KEY (title, year)
);</code></pre>
<pre><code class="language-sql">SELECT * FROM Movie ORDER BY year;
SELECT title FROM Movie WHERE weapon IS NOT NULL ORDER BY year;   -- các phim trinh thám</code></pre>
<div class="out">(4 rows affected)</div>
<table>
<thead><tr><th>title</th><th>year</th><th>length</th><th>genre</th><th>weapon</th></tr></thead>
<tbody>
<tr><td>Chinatown</td><td>1974</td><td>130</td><td>crime</td><td>Gun</td></tr>
<tr><td>Star Wars</td><td>1977</td><td>124</td><td>sciFi</td><td><em>NULL</em></td></tr>
<tr><td>Roger Rabbit</td><td>1988</td><td>104</td><td>comedy</td><td>Dip</td></tr>
<tr><td>Lion King</td><td>1994</td><td>89</td><td>animation</td><td><em>NULL</em></td></tr>
</tbody>
</table>
<table>
<thead><tr><th>title</th></tr></thead>
<tbody>
<tr><td>Chinatown</td></tr>
<tr><td>Roger Rabbit</td></tr>
</tbody>
</table>
<p>Một bảng, không nối, không UNION — nhưng NULL giờ mang hai nghĩa: "không phải phim trinh thám" hoặc "phim trinh thám chưa biết hung khí". Bảng này cũng không nói được phim nào là hoạt hình, trừ khi nhìn sang Voices. Nhiều ứng dụng thật vẫn chọn cách này vì đơn giản, thường thêm một cột loại (type).</p>
<div class="pitfall">Kiểm bằng <code>weapon IS NOT NULL</code>, không bao giờ viết <code>weapon &lt;&gt; NULL</code> — mọi phép so sánh với NULL đều cho "không xác định" (unknown), nên điều kiện đó không trả về dòng nào cả.</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> <code>ISNULL(weapon, '…')</code> của T-SQL viết là <code>coalesce(weapon, '…')</code> (coalesce cũng chạy trên SQL Server), và PG đếm có điều kiện được bằng <code>count(*) FILTER (WHERE …)</code>, còn T-SQL phải viết <code>SUM(CASE WHEN … THEN 1 ELSE 0 END)</code>:
<pre><code class="language-sql">CREATE TABLE movie (title varchar(60), year int, length int, genre varchar(20), weapon varchar(20), PRIMARY KEY (title, year));
INSERT INTO movie VALUES ('Star Wars', 1977, 124, 'sciFi', NULL), ('Lion King', 1994, 89, 'animation', NULL),
                         ('Roger Rabbit', 1988, 104, 'comedy', 'Dip'), ('Chinatown', 1974, 130, 'crime', 'Gun');
SELECT title, coalesce(weapon, '(not a mystery)') AS weapon FROM movie ORDER BY year;   -- ISNULL trong T-SQL
SELECT count(*) FILTER (WHERE weapon IS NOT NULL) AS mysteries, count(*) AS movies FROM movie;   -- FILTER: chỉ PG có</code></pre>
<div class="out">INSERT 0 4</div>
<table>
<thead><tr><th>title</th><th>weapon</th></tr></thead>
<tbody>
<tr><td>Chinatown</td><td>Gun</td></tr>
<tr><td>Star Wars</td><td>(not a mystery)</td></tr>
<tr><td>Roger Rabbit</td><td>Dip</td></tr>
<tr><td>Lion King</td><td>(not a mystery)</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>mysteries</th><th>movies</th></tr></thead>
<tbody>
<tr><td>2</td><td>4</td></tr>
</tbody>
</table>
Đọc thêm: <a href="/courses/postgresql/learn?lessonSlug=postgresql-6-3-having-filter">Khoá PostgreSQL — HAVING và FILTER</a>.</div>`],
      [39, 'Unified Modeling Language – self studying',
        `<p class="y-chinh">🎯 UML was designed for object-oriented software but is also used to model databases; it can say almost everything the E/R model says, except that UML has only binary relationships — no multi-way ones.</p>
<p>"Self studying" means the lecturer may skip it in class, but it can still appear in the FE. The practical reason to learn it: project documents (SRS, design documents) draw class diagrams in UML, and you must be able to turn them into tables.</p>
<div class="pitfall">An FE statement "UML supports ternary relationships like E/R" is false — slide text: "only binary relationships in UML". A 3-way relationship is modelled in UML with an extra class.</div>`,
        `<p class="y-chinh">🎯 UML sinh ra để thiết kế phần mềm hướng đối tượng nhưng cũng dùng để mô hình hoá CSDL; nó diễn tả được gần như mọi thứ mô hình E/R diễn tả, trừ việc UML chỉ có liên kết hai ngôi — không có liên kết nhiều ngôi.</p>
<p>"Self studying" (tự học) nghĩa là thầy/cô có thể không giảng trên lớp, nhưng vẫn có thể ra trong FE. Lý do thực tế để học: tài liệu đồ án (SRS, tài liệu thiết kế) vẽ sơ đồ lớp bằng UML, và bạn phải biến được chúng thành bảng.</p>
<div class="pitfall">Câu FE "UML hỗ trợ liên kết ba ngôi như E/R" là sai — chữ trên slide: "only binary relationships in UML" (chỉ có liên kết hai ngôi). Liên kết ba ngôi được mô hình hoá trong UML bằng một lớp thêm vào.</div>`],
      [40, 'UML vs. E/R Model',
        `<p class="y-chinh">🎯 Figure 4.34 — the dictionary between the two notations: class = entity set, association = binary relationship, association class = attributes on a relationship, subclass = is-a hierarchy, aggregation = many-one relationship, composition = many-one relationship with referential integrity.</p>
<table>
<thead><tr><th>UML</th><th>E/R model</th><th>Slide where it is drawn</th></tr></thead>
<tbody>
<tr><td>Class</td><td>Entity set</td><td>41</td></tr>
<tr><td>Association</td><td>Binary relationship</td><td>42</td></tr>
<tr><td>Association class</td><td>Attributes on a relationship</td><td>45</td></tr>
<tr><td>Subclass</td><td>is-a hierarchy</td><td>46</td></tr>
<tr><td>Aggregation</td><td>Many-one relationship</td><td>47</td></tr>
<tr><td>Composition</td><td>Many-one relationship with referential integrity</td><td>47, 53</td></tr>
</tbody>
</table>
<p class="meo">🧠 <strong>Aggregation vs composition:</strong> empty diamond = "may belong" (the part can exist alone, link may be NULL); filled diamond = "must belong" (the part cannot exist without the whole).</p>`,
        `<p class="y-chinh">🎯 Hình 4.34 — bảng tra giữa hai cách ký hiệu: lớp (class) = tập thực thể, liên kết UML (association) = liên kết hai ngôi, lớp liên kết (association class) = thuộc tính trên liên kết, lớp con (subclass) = phân cấp is-a, kết tập (aggregation) = liên kết nhiều – một, hợp thành (composition) = liên kết nhiều – một có toàn vẹn tham chiếu.</p>
<table>
<thead><tr><th>UML</th><th>Mô hình E/R</th><th>Slide vẽ nó</th></tr></thead>
<tbody>
<tr><td>Class — lớp</td><td>Entity set — tập thực thể</td><td>41</td></tr>
<tr><td>Association — liên kết</td><td>Binary relationship — liên kết hai ngôi</td><td>42</td></tr>
<tr><td>Association class — lớp liên kết</td><td>Attributes on a relationship — thuộc tính trên liên kết</td><td>45</td></tr>
<tr><td>Subclass — lớp con</td><td>is-a hierarchy — phân cấp is-a</td><td>46</td></tr>
<tr><td>Aggregation — kết tập</td><td>Many-one relationship — liên kết nhiều – một</td><td>47</td></tr>
<tr><td>Composition — hợp thành</td><td>Many-one relationship with referential integrity — nhiều – một có toàn vẹn tham chiếu</td><td>47, 53</td></tr>
</tbody>
</table>
<p class="meo">🧠 <strong>Kết tập hay hợp thành:</strong> thoi rỗng = "có thể thuộc về" (phần tồn tại được một mình, liên kết được phép NULL); thoi tô đen = "bắt buộc thuộc về" (phần không tồn tại được nếu thiếu cái toàn thể).</p>`],
      [41, 'UML Classes',
        `<p class="y-chinh">🎯 A UML class is a box with three parts: the class name, the state (attributes, with PK marking the key) and the behaviour (methods).</p>
<p>The slide's class <strong>Movies</strong>: name "Movies"; state title PK, year PK, length, genre (the key is title + year); behaviour init(), modify(). For database design the behaviour part is ignored — tables store state only.</p>
<p class="dap-an">✅ <strong>Reading PK:</strong> every attribute marked PK is part of the primary key; two PKs mean a composite key, exactly like two underlined ovals in E/R.</p>`,
        `<p class="y-chinh">🎯 Một lớp UML là một hộp ba phần: tên lớp, trạng thái (state — các thuộc tính, ghi PK cho khoá) và hành vi (behavior — các phương thức).</p>
<p>Lớp <strong>Movies</strong> trên slide: tên "Movies"; trạng thái title PK, year PK, length, genre (khoá là title + year); hành vi init(), modify(). Khi thiết kế CSDL thì bỏ qua phần hành vi — bảng chỉ lưu trạng thái.</p>
<p class="dap-an">✅ <strong>Đọc PK:</strong> mọi thuộc tính ghi PK là một phần của khoá chính; hai chữ PK nghĩa là khoá ghép, y như hai bầu dục gạch chân trong E/R.</p>`],
      [42, 'Associations',
        `<p class="y-chinh">🎯 Associations are lines between classes, named and labelled at each end with a multiplicity: Owns (Studios 0..1 — Movies 0..*) and Stars-in (Stars 0..* — Movies 0..*).</p>
<p>How to read a multiplicity: the label at an end tells how many objects of <em>that</em> class go with one object at the other end.</p>
<table>
<thead><tr><th>Association</th><th>Label near Studios / Stars</th><th>Label near Movies</th><th>Read as a sentence</th></tr></thead>
<tbody>
<tr><td>Owns</td><td>0..1 at Studios</td><td>0..* at Movies</td><td>"a movie is owned by at most one studio; a studio owns any number of movies" (many-one)</td></tr>
<tr><td>Stars-in</td><td>0..* at Stars</td><td>0..* at Movies</td><td>"a movie has any number of stars; a star plays in any number of movies" (many-many)</td></tr>
</tbody>
</table>
<div class="pitfall">The label is written at the <em>far</em> end from the object you start with: to know how many studios one movie has, read the label next to Studios (0..1). Reading the wrong end swaps 1-M and M-1.</div>`,
        `<p class="y-chinh">🎯 Liên kết UML (association) là các đường nối giữa các lớp, có tên và có ghi bội số (multiplicity) ở mỗi đầu: Owns (Studios 0..1 — Movies 0..*) và Stars-in (Stars 0..* — Movies 0..*).</p>
<p>Cách đọc bội số: nhãn ở một đầu cho biết có bao nhiêu đối tượng của <em>lớp ở đầu đó</em> đi với một đối tượng ở đầu kia.</p>
<table>
<thead><tr><th>Liên kết</th><th>Nhãn cạnh Studios / Stars</th><th>Nhãn cạnh Movies</th><th>Đọc thành câu</th></tr></thead>
<tbody>
<tr><td>Owns</td><td>0..1 ở Studios</td><td>0..* ở Movies</td><td>"một phim thuộc về tối đa một hãng; một hãng sở hữu bao nhiêu phim cũng được" (nhiều – một)</td></tr>
<tr><td>Stars-in</td><td>0..* ở Stars</td><td>0..* ở Movies</td><td>"một phim có bao nhiêu diễn viên cũng được; một diễn viên đóng bao nhiêu phim cũng được" (nhiều – nhiều)</td></tr>
</tbody>
</table>
<div class="pitfall">Nhãn được ghi ở đầu <em>xa</em> đối tượng bạn xuất phát: muốn biết một phim có mấy hãng thì đọc nhãn cạnh Studios (0..1). Đọc nhầm đầu là đảo 1-M thành M-1.</div>`],
      [43, 'Comparison with E/R Multiplicities',
        `<p class="y-chinh">🎯 Three E/R shapes and their UML labels: plain diamond (many-many) = 0..* / 0..*; arrow (many-one) = 0..* / 0..1; rounded arrow (many-one with referential integrity) = 0..* / 1..1.</p>
<table>
<thead><tr><th>E/R drawing on the slide</th><th>UML labels</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td>diamond, no arrow</td><td>0..* and 0..*</td><td>many-many</td></tr>
<tr><td>diamond, arrow into the right entity</td><td>0..* and 0..1</td><td>many-one: each left object has at most one right object</td></tr>
<tr><td>diamond, rounded arrow into the right entity</td><td>0..* and 1..1</td><td>many-one with referential integrity: exactly one — it must exist</td></tr>
</tbody>
</table>
<p>General form: <em>min..max</em>. 0..1 = optional one, 1..1 = exactly one, 0..* = any number, 1..* = at least one.</p>
<p class="meo">🧠 <strong>In SQL:</strong> 0..1 → foreign key that allows NULL; 1..1 → foreign key NOT NULL; 0..* on both sides → a separate table.</p>`,
        `<p class="y-chinh">🎯 Ba hình dạng E/R và nhãn UML tương ứng: thoi thường (nhiều – nhiều) = 0..* / 0..*; mũi tên (nhiều – một) = 0..* / 0..1; mũi tên tròn (nhiều – một có toàn vẹn tham chiếu) = 0..* / 1..1.</p>
<table>
<thead><tr><th>Hình E/R trên slide</th><th>Nhãn UML</th><th>Nghĩa</th></tr></thead>
<tbody>
<tr><td>hình thoi, không mũi tên</td><td>0..* và 0..*</td><td>nhiều – nhiều</td></tr>
<tr><td>hình thoi, mũi tên chỉ vào thực thể bên phải</td><td>0..* và 0..1</td><td>nhiều – một: mỗi đối tượng bên trái có tối đa một đối tượng bên phải</td></tr>
<tr><td>hình thoi, mũi tên đầu tròn chỉ vào thực thể bên phải</td><td>0..* và 1..1</td><td>nhiều – một có toàn vẹn tham chiếu: đúng một — bắt buộc phải có</td></tr>
</tbody>
</table>
<p>Dạng tổng quát: <em>tối thiểu..tối đa</em>. 0..1 = một, không bắt buộc; 1..1 = đúng một; 0..* = bao nhiêu cũng được; 1..* = ít nhất một.</p>
<p class="meo">🧠 <strong>Trong SQL:</strong> 0..1 → khoá ngoại cho phép NULL; 1..1 → khoá ngoại NOT NULL; 0..* ở cả hai đầu → một bảng riêng.</p>`],
      [44, 'Self-Associations',
        `<p class="y-chinh">🎯 A self-association has both ends at the same class; the ends are named by role — Movies theOriginal 0..1 / theSequel 0..*: "a movie has at most one original; an original can have many sequels".</p>
<p>In tables it becomes a foreign key from Movies to Movies: add originalTitle, originalYear (NULL for a movie that is not a sequel) referencing Movies(title, year) — the same pattern as Manage on slide 12 and SUPERVISION in COMPANY.</p>
<p class="dap-an">✅ <strong>"Unary/recursive relationship — example?"</strong> Employee supervises Employee, Movie is a sequel of Movie, Course is a prerequisite of Course (the last one is M-M, so it needs its own table Prerequisite(course, requiredCourse)).</p>`,
        `<p class="y-chinh">🎯 Liên kết tự thân (self-association) có cả hai đầu ở cùng một lớp; mỗi đầu được đặt tên theo vai — Movies theOriginal 0..1 / theSequel 0..*: "một phim có tối đa một bản gốc; một bản gốc có thể có nhiều phần tiếp theo (sequel)".</p>
<p>Khi thành bảng, nó là một khoá ngoại từ Movies trỏ về Movies: thêm originalTitle, originalYear (NULL nếu phim không phải phần tiếp theo) tham chiếu Movies(title, year) — cùng mẫu với Manage ở slide 12 và SUPERVISION trong COMPANY.</p>
<p class="dap-an">✅ <strong>"Liên kết một ngôi/đệ quy — ví dụ?"</strong> Nhân viên giám sát nhân viên, phim là phần tiếp theo của phim, môn học là môn tiên quyết của môn học (cái cuối là M-M, nên cần bảng riêng Prerequisite(course, requiredCourse)).</p>`],
      [45, 'Association Classes',
        `<p class="y-chinh">🎯 An association class attaches attributes to an association: Stars-in (Stars 0..* — Movies 0..*) carries the class Compensation with salary and residuals.</p>
<p>The dashed-like line from the middle of Stars-in to the box Compensation says: salary and residuals belong to one (star, movie) pair — the UML version of "attributes on a relationship" (compare since on Works_In, slide 11). In tables: StarsIn(movieTitle, movieYear, starName, salary, residuals).</p>`,
        `<p class="y-chinh">🎯 Lớp liên kết (association class) gắn thuộc tính vào một liên kết: Stars-in (Stars 0..* — Movies 0..*) mang lớp Compensation (thù lao) với salary (lương) và residuals (tiền bản quyền chia thêm).</p>
<p>Đường nối từ giữa Stars-in tới hộp Compensation nói rằng: salary và residuals thuộc về một cặp (diễn viên, phim) — phiên bản UML của "thuộc tính trên liên kết" (so với since trên Works_In, slide 11). Thành bảng: StarsIn(movieTitle, movieYear, starName, salary, residuals).</p>`],
      [46, 'Subclasses in UML',
        `<p class="y-chinh">🎯 Figure 4.40: in UML a subclass is drawn with a hollow triangle pointing at the superclass; here Movies has three disjoint subclasses — Murder Mysteries (weapon), Cartoons, and Cartoon-Murder Mysteries (weapon).</p>
<p>UML subclasses are usually disjoint, so a movie that is both a cartoon and a murder mystery needs its own class, Cartoon-Murder Mysteries — the OO strategy of slide 37 drawn as a diagram. Each subclass inherits title PK, year PK, length, genre.</p>`,
        `<p class="y-chinh">🎯 Hình 4.40: trong UML lớp con được vẽ bằng một tam giác rỗng chỉ vào lớp cha; ở đây Movies có ba lớp con tách rời — Murder Mysteries (weapon), Cartoons, và Cartoon-Murder Mysteries (weapon).</p>
<p>Lớp con UML thường tách rời, nên một phim vừa là hoạt hình vừa là trinh thám cần lớp riêng Cartoon-Murder Mysteries — chính là chiến lược hướng đối tượng của slide 37 vẽ thành sơ đồ. Mỗi lớp con kế thừa title PK, year PK, length, genre.</p>`],
      [47, 'Aggregations and Compositions',
        `<p class="y-chinh">🎯 Figure 4.41: an aggregation (empty diamond) from Movies to Studios, and a composition (filled diamond) from Presidents to Studios; Presidents is a subclass of MovieExecs.</p>
<table>
<thead><tr><th>Link</th><th>Labels</th><th>Read as a sentence</th></tr></thead>
<tbody>
<tr><td>Movies — aggregation ◇ — Studios</td><td>1..* at Movies, 0..1 at Studios</td><td>"a studio has one or more movies; a movie belongs to at most one studio — possibly none"</td></tr>
<tr><td>Presidents — composition ◆ — Studios</td><td>0..1 at Presidents, 1..1 at Studios</td><td>"a president runs exactly one studio; a studio has at most one president"</td></tr>
<tr><td>Presidents △ MovieExecs</td><td>subclass</td><td>"a president is a movie executive" (cert# PK, name, address, networth)</td></tr>
</tbody>
</table>
<p class="meo">🧠 <strong>The diamond sits at the "whole" end</strong> (Studios); the other class is the part.</p>`,
        `<p class="y-chinh">🎯 Hình 4.41: một kết tập (aggregation — thoi rỗng) từ Movies tới Studios, và một hợp thành (composition — thoi tô đen) từ Presidents tới Studios; Presidents là lớp con của MovieExecs.</p>
<table>
<thead><tr><th>Liên kết</th><th>Nhãn</th><th>Đọc thành câu</th></tr></thead>
<tbody>
<tr><td>Movies — kết tập ◇ — Studios</td><td>1..* ở Movies, 0..1 ở Studios</td><td>"một hãng có một hoặc nhiều phim; một phim thuộc tối đa một hãng — có thể không thuộc hãng nào"</td></tr>
<tr><td>Presidents — hợp thành ◆ — Studios</td><td>0..1 ở Presidents, 1..1 ở Studios</td><td>"một chủ tịch điều hành đúng một hãng; một hãng có tối đa một chủ tịch"</td></tr>
<tr><td>Presidents △ MovieExecs</td><td>lớp con</td><td>"chủ tịch là một nhà điều hành phim" (cert# PK, name, address, networth)</td></tr>
</tbody>
</table>
<p class="meo">🧠 <strong>Hình thoi nằm ở đầu "cái toàn thể"</strong> (Studios); lớp còn lại là phần.</p>`],
      [48, 'UML-to-Relations Basics',
        `<p class="y-chinh">🎯 Two basic rules: each class becomes a relation (same name, same attributes); each association becomes a relation named after it, whose attributes are the key attributes of the two connected classes.</p>
<p>These are the E/R rules of slide 19 in UML words. Slides 51–52 then refine the second rule: for aggregations and compositions (many-one), no separate relation is created.</p>`,
        `<p class="y-chinh">🎯 Hai luật cơ bản: mỗi lớp thành một quan hệ (cùng tên, cùng thuộc tính); mỗi liên kết thành một quan hệ mang tên của nó, thuộc tính là thuộc tính khoá của hai lớp được nối.</p>
<p>Đây là các luật E/R của slide 19 nói bằng từ ngữ UML. Slide 51–52 sau đó chỉnh luật thứ hai: với kết tập và hợp thành (nhiều – một) thì không tạo quan hệ riêng.</p>`],
      [49, 'UML-to-Relations Basics (example)',
        `<p class="y-chinh">🎯 The Movies–Stars–Studios diagram gives Movies(title, year, length, genre), Stars(name, address), Studios(name, address), Stars-In(movieTitle, movieYear, starName), Owns(movieTitle, movieYear, studioName).</p>
<p>The underlines on the slide are the keys: Stars-In has all three attributes as key (0..* at both ends, many-many); Owns has only movieTitle, movieYear (0..1 at Studios: a movie has at most one owner, so the movie alone identifies the row).</p>
<pre><code class="language-sql">CREATE TABLE Movies  (title VARCHAR(60), year INT, length INT, genre VARCHAR(20), PRIMARY KEY (title, year));  -- class -&gt; relation
CREATE TABLE Stars   (name VARCHAR(40) PRIMARY KEY, address VARCHAR(60));
CREATE TABLE Studios (name VARCHAR(40) PRIMARY KEY, address VARCHAR(60));
CREATE TABLE [Stars-In] (                   -- association -&gt; relation; the hyphen needs [ ]
  movieTitle VARCHAR(60), movieYear INT, starName VARCHAR(40) REFERENCES Stars(name),
  PRIMARY KEY (movieTitle, movieYear, starName),        -- 0..* both ends: all keys
  FOREIGN KEY (movieTitle, movieYear) REFERENCES Movies(title, year)
);
CREATE TABLE Owns (
  movieTitle VARCHAR(60), movieYear INT, studioName VARCHAR(40) NOT NULL REFERENCES Studios(name),
  PRIMARY KEY (movieTitle, movieYear),                  -- 0..1 at Studios: the movie key alone
  FOREIGN KEY (movieTitle, movieYear) REFERENCES Movies(title, year)
);</code></pre>
<table>
<thead><tr><th>TABLE_NAME</th></tr></thead>
<tbody>
<tr><td>Movies</td></tr>
<tr><td>Owns</td></tr>
<tr><td>Stars</td></tr>
<tr><td>Stars-In</td></tr>
<tr><td>Studios</td></tr>
</tbody>
</table>
<p>The name Stars-In contains a hyphen, which is not allowed in a plain identifier: SQL Server needs <code>[Stars-In]</code> (or <code>"Stars-In"</code>). Better practice: name it StarsIn.</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong> only double quotes work (<code>"Stars-In"</code>); square brackets are a syntax error. A quoted name also keeps its capitals — and must then be written with quotes and the same capitals in every query:
<pre><code class="language-sql">CREATE TABLE movies (title varchar(60), year int, PRIMARY KEY (title, year));
CREATE TABLE stars  (name varchar(40) PRIMARY KEY);
CREATE TABLE "Stars-In" (                   -- PG quotes with " ", never [ ]
  movietitle varchar(60), movieyear int, starname varchar(40) REFERENCES stars,
  PRIMARY KEY (movietitle, movieyear, starname),
  FOREIGN KEY (movietitle, movieyear) REFERENCES movies
);
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;   -- "Stars-In" keeps its capitals</code></pre>
<table>
<thead><tr><th>table_name</th></tr></thead>
<tbody>
<tr><td>Stars-In</td></tr>
<tr><td>movies</td></tr>
<tr><td>stars</td></tr>
</tbody>
</table>
Read more: <a href="/courses/postgresql/learn?lessonSlug=postgresql-1-1-mo-hinh-quan-he">PostgreSQL course — the relational model</a>.</div>`,
        `<p class="y-chinh">🎯 Sơ đồ Movies–Stars–Studios cho ra Movies(title, year, length, genre), Stars(name, address), Studios(name, address), Stars-In(movieTitle, movieYear, starName), Owns(movieTitle, movieYear, studioName).</p>
<p>Gạch chân trên slide là khoá: Stars-In lấy cả ba thuộc tính làm khoá (0..* ở hai đầu, nhiều – nhiều); Owns chỉ lấy movieTitle, movieYear (0..1 ở Studios: một phim có tối đa một chủ, nên riêng phim đã xác định được dòng).</p>
<pre><code class="language-sql">CREATE TABLE Movies  (title VARCHAR(60), year INT, length INT, genre VARCHAR(20), PRIMARY KEY (title, year));  -- lớp -&gt; quan hệ
CREATE TABLE Stars   (name VARCHAR(40) PRIMARY KEY, address VARCHAR(60));
CREATE TABLE Studios (name VARCHAR(40) PRIMARY KEY, address VARCHAR(60));
CREATE TABLE [Stars-In] (                   -- liên kết -&gt; quan hệ; dấu gạch nối cần [ ]
  movieTitle VARCHAR(60), movieYear INT, starName VARCHAR(40) REFERENCES Stars(name),
  PRIMARY KEY (movieTitle, movieYear, starName),        -- 0..* cả hai đầu: mọi khoá
  FOREIGN KEY (movieTitle, movieYear) REFERENCES Movies(title, year)
);
CREATE TABLE Owns (
  movieTitle VARCHAR(60), movieYear INT, studioName VARCHAR(40) NOT NULL REFERENCES Studios(name),
  PRIMARY KEY (movieTitle, movieYear),                  -- 0..1 ở Studios: chỉ khoá phim
  FOREIGN KEY (movieTitle, movieYear) REFERENCES Movies(title, year)
);</code></pre>
<table>
<thead><tr><th>TABLE_NAME</th></tr></thead>
<tbody>
<tr><td>Movies</td></tr>
<tr><td>Owns</td></tr>
<tr><td>Stars</td></tr>
<tr><td>Stars-In</td></tr>
<tr><td>Studios</td></tr>
</tbody>
</table>
<p>Tên Stars-In có dấu gạch nối, không được phép trong tên thường: SQL Server phải viết <code>[Stars-In]</code> (hoặc <code>"Stars-In"</code>). Nên đặt tên StarsIn cho gọn.</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> chỉ nháy kép dùng được (<code>"Stars-In"</code>); ngoặc vuông là lỗi cú pháp. Tên trong nháy kép còn giữ nguyên chữ hoa — và từ đó mọi câu truy vấn phải viết lại đúng nháy, đúng hoa thường:
<pre><code class="language-sql">CREATE TABLE movies (title varchar(60), year int, PRIMARY KEY (title, year));
CREATE TABLE stars  (name varchar(40) PRIMARY KEY);
CREATE TABLE "Stars-In" (                   -- PG dùng nháy kép " ", không có [ ]
  movietitle varchar(60), movieyear int, starname varchar(40) REFERENCES stars,
  PRIMARY KEY (movietitle, movieyear, starname),
  FOREIGN KEY (movietitle, movieyear) REFERENCES movies
);
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;   -- "Stars-In" giữ chữ hoa</code></pre>
<table>
<thead><tr><th>table_name</th></tr></thead>
<tbody>
<tr><td>Stars-In</td></tr>
<tr><td>movies</td></tr>
<tr><td>stars</td></tr>
</tbody>
</table>
Đọc thêm: <a href="/courses/postgresql/learn?lessonSlug=postgresql-1-1-mo-hinh-quan-he">Khoá PostgreSQL — mô hình quan hệ</a>.</div>`],
      [50, 'From UML Subclasses to Relations',
        `<p class="y-chinh">🎯 Any of the three E/R strategies works for UML subclasses: E/R style (each subclass stores its own attributes plus the key), OO style (each relation stores the attributes of the subclass and all superclasses), nulls (one relation).</p>
<p>For Figure 4.40 (three disjoint subclasses) the OO style is natural: Movies, MurderMysteries, Cartoons, CartoonMurderMysteries, each with all the columns of its class — every movie in exactly one table.</p>`,
        `<p class="y-chinh">🎯 Cả ba chiến lược của E/R đều dùng được cho lớp con UML: kiểu E/R (mỗi lớp con lưu thuộc tính riêng cộng khoá), kiểu OO (mỗi quan hệ lưu thuộc tính của lớp con và mọi lớp cha), kiểu NULL (một quan hệ).</p>
<p>Với Hình 4.40 (ba lớp con tách rời) thì kiểu OO là tự nhiên: Movies, MurderMysteries, Cartoons, CartoonMurderMysteries, mỗi bảng đủ các cột của lớp mình — mỗi phim nằm đúng một bảng.</p>`],
      [51, 'From Aggregations and Composition to Relation',
        `<p class="y-chinh">🎯 No relation is created for an aggregation or a composition: add the key of the class at the diamond end to the relation of the class at the other end; for an aggregation those columns may be NULL.</p>
<table>
<thead><tr><th>Link</th><th>Column added to</th><th>NULL allowed?</th></tr></thead>
<tbody>
<tr><td>Aggregation ◇ (0..1 at the whole)</td><td>the part's table</td><td>yes — the part can exist alone</td></tr>
<tr><td>Composition ◆ (1..1 at the whole)</td><td>the part's table</td><td>no — NOT NULL, the whole must exist</td></tr>
</tbody>
</table>
<p>It is the "combine many-one relationships" rule of slide 31 once more.</p>`,
        `<p class="y-chinh">🎯 Không tạo quan hệ cho kết tập hay hợp thành: thêm khoá của lớp ở đầu có hình thoi vào quan hệ của lớp ở đầu kia; với kết tập thì các cột đó được phép NULL.</p>
<table>
<thead><tr><th>Liên kết</th><th>Thêm cột vào</th><th>Cho NULL không?</th></tr></thead>
<tbody>
<tr><td>Kết tập ◇ (0..1 ở cái toàn thể)</td><td>bảng của phần</td><td>có — phần tồn tại được một mình</td></tr>
<tr><td>Hợp thành ◆ (1..1 ở cái toàn thể)</td><td>bảng của phần</td><td>không — NOT NULL, cái toàn thể bắt buộc phải có</td></tr>
</tbody>
</table>
<p>Đây lại là luật "gộp liên kết nhiều – một" của slide 31.</p>`],
      [52, 'From Aggregations and Composition to Relation (example)',
        `<p class="y-chinh">🎯 Figure 4.41 gives MovieExecs(cert#, name, address, netWorth), Presidents(cert#, studioName), Movies(title, year, length, genre, studioName), Studios(name, address) — no relation for the diamonds.</p>
<ul>
<li>Movies gets studioName (aggregation: may be NULL — an independent film).</li>
<li>Presidents gets studioName (composition: NOT NULL; and UNIQUE, because a studio has at most one president — the 0..1 at Presidents).</li>
<li>Presidents is a subclass of MovieExecs, stored E/R style: its key cert# is also a foreign key to MovieExecs.</li>
</ul>
<pre><code class="language-sql">CREATE TABLE MovieExecs (cert# INT PRIMARY KEY, name VARCHAR(40), address VARCHAR(60), netWorth DECIMAL(14,2));
CREATE TABLE Studios    (name VARCHAR(40) PRIMARY KEY, address VARCHAR(60));
CREATE TABLE Presidents (                   -- composition: studioName NOT NULL (1..1)
  cert#      INT PRIMARY KEY REFERENCES MovieExecs(cert#),     -- subclass of MovieExecs
  studioName VARCHAR(40) NOT NULL UNIQUE REFERENCES Studios(name)   -- a studio has 0..1 president
);
CREATE TABLE Movies (                       -- aggregation: studioName may be NULL (0..1)
  title VARCHAR(60), year INT, length INT, genre VARCHAR(20),
  studioName VARCHAR(40) NULL REFERENCES Studios(name),
  PRIMARY KEY (title, year)
);
-- no Owns, no "Runs" table</code></pre>
<div class="out">(1 row affected)<br>
(1 row affected)<br>
(1 row affected)<br>
(2 rows affected)</div>
<table>
<thead><tr><th>title</th><th>year</th><th>length</th><th>genre</th><th>studioName</th></tr></thead>
<tbody>
<tr><td>Frozen</td><td>2013</td><td>102</td><td>animation</td><td>Disney</td></tr>
<tr><td>Indie Film</td><td>2020</td><td>90</td><td>drama</td><td><em>NULL</em></td></tr>
</tbody>
</table>
<div class="callout">🐘 <strong>On PostgreSQL</strong> the column name <code>cert#</code> is not a valid plain identifier (SQL Server accepts <code>#</code> after the first character); it must be quoted, <code>"cert#"</code>, everywhere — one more reason to name it certNo:
<pre><code class="language-sql">CREATE TABLE movieexecs (
  "cert#"  int PRIMARY KEY,                 -- # is not allowed in a plain PG name: quote it
  name     text,
  networth numeric(14,2)
);
CREATE TABLE studios (name text PRIMARY KEY);
CREATE TABLE presidents (
  "cert#"    int PRIMARY KEY REFERENCES movieexecs("cert#"),
  studioname text NOT NULL UNIQUE REFERENCES studios(name)
);
INSERT INTO movieexecs VALUES (101, 'Walt', 5000000);
INSERT INTO studios VALUES ('Disney');
INSERT INTO presidents VALUES (101, 'Disney');
SELECT "cert#", studioname FROM presidents;</code></pre>
<div class="out">INSERT 0 1<br>
INSERT 0 1<br>
INSERT 0 1</div>
<table>
<thead><tr><th>cert#</th><th>studioname</th></tr></thead>
<tbody>
<tr><td>101</td><td>Disney</td></tr>
</tbody>
</table>
Read more: <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-2-khoa-ngoai">PostgreSQL course — foreign keys</a>.</div>`,
        `<p class="y-chinh">🎯 Hình 4.41 cho ra MovieExecs(cert#, name, address, netWorth), Presidents(cert#, studioName), Movies(title, year, length, genre, studioName), Studios(name, address) — không có quan hệ cho các hình thoi.</p>
<ul>
<li>Movies nhận studioName (kết tập: được NULL — một phim độc lập).</li>
<li>Presidents nhận studioName (hợp thành: NOT NULL; và UNIQUE, vì một hãng có tối đa một chủ tịch — nhãn 0..1 ở Presidents).</li>
<li>Presidents là lớp con của MovieExecs, lưu theo kiểu E/R: khoá cert# của nó đồng thời là khoá ngoại tới MovieExecs.</li>
</ul>
<pre><code class="language-sql">CREATE TABLE MovieExecs (cert# INT PRIMARY KEY, name VARCHAR(40), address VARCHAR(60), netWorth DECIMAL(14,2));
CREATE TABLE Studios    (name VARCHAR(40) PRIMARY KEY, address VARCHAR(60));
CREATE TABLE Presidents (                   -- hợp thành: studioName NOT NULL (1..1)
  cert#      INT PRIMARY KEY REFERENCES MovieExecs(cert#),     -- lớp con của MovieExecs
  studioName VARCHAR(40) NOT NULL UNIQUE REFERENCES Studios(name)   -- một studio có 0..1 chủ tịch
);
CREATE TABLE Movies (                       -- kết tập: studioName được NULL (0..1)
  title VARCHAR(60), year INT, length INT, genre VARCHAR(20),
  studioName VARCHAR(40) NULL REFERENCES Studios(name),
  PRIMARY KEY (title, year)
);
-- không có bảng Owns hay "Runs"</code></pre>
<div class="out">(1 row affected)<br>
(1 row affected)<br>
(1 row affected)<br>
(2 rows affected)</div>
<table>
<thead><tr><th>title</th><th>year</th><th>length</th><th>genre</th><th>studioName</th></tr></thead>
<tbody>
<tr><td>Frozen</td><td>2013</td><td>102</td><td>animation</td><td>Disney</td></tr>
<tr><td>Indie Film</td><td>2020</td><td>90</td><td>drama</td><td><em>NULL</em></td></tr>
</tbody>
</table>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> tên cột <code>cert#</code> không phải tên thường hợp lệ (SQL Server chấp nhận <code>#</code> sau ký tự đầu); phải đặt trong nháy kép, <code>"cert#"</code>, ở mọi chỗ — thêm một lý do để đặt tên certNo:
<pre><code class="language-sql">CREATE TABLE movieexecs (
  "cert#"  int PRIMARY KEY,                 -- PG không cho # trong tên trơn: phải đặt trong nháy kép
  name     text,
  networth numeric(14,2)
);
CREATE TABLE studios (name text PRIMARY KEY);
CREATE TABLE presidents (
  "cert#"    int PRIMARY KEY REFERENCES movieexecs("cert#"),
  studioname text NOT NULL UNIQUE REFERENCES studios(name)
);
INSERT INTO movieexecs VALUES (101, 'Walt', 5000000);
INSERT INTO studios VALUES ('Disney');
INSERT INTO presidents VALUES (101, 'Disney');
SELECT "cert#", studioname FROM presidents;</code></pre>
<div class="out">INSERT 0 1<br>
INSERT 0 1<br>
INSERT 0 1</div>
<table>
<thead><tr><th>cert#</th><th>studioname</th></tr></thead>
<tbody>
<tr><td>101</td><td>Disney</td></tr>
</tbody>
</table>
Đọc thêm: <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-2-khoa-ngoai">Khoá PostgreSQL — khoá ngoại</a>.</div>`],
      [53, 'The UML Analog of Weak Entity Sets',
        `<p class="y-chinh">🎯 A weak entity set is drawn in UML as a composition from the weak class to the supporting class, with PK on the link: Crews (number PK, crewChief) 0..* — ◆ 1..1 — Studios (name PK, address) gives Crews(number, crewChief, studioName).</p>
<p>The small "PK" box on the Crews end means the composition contributes to Crews' key: the key is number + studioName. It is the same result as slide 32 (whose script runs the CREATE TABLE and shows the cascade delete): Studios(name, address), Crews(number, crewChief, studioName).</p>
<p class="dap-an">✅ <strong>Summary of the three notations for a weak entity:</strong> E/R — double rectangle + double diamond; UML — composition (filled diamond, 1..1) with PK on the link; SQL — composite primary key containing the owner's key, which is also a NOT NULL foreign key.</p>`,
        `<p class="y-chinh">🎯 Tập thực thể yếu trong UML được vẽ bằng một hợp thành từ lớp yếu tới lớp hỗ trợ, có ghi PK trên đường nối: Crews (number PK, crewChief) 0..* — ◆ 1..1 — Studios (name PK, address) cho ra Crews(number, crewChief, studioName).</p>
<p>Ô nhỏ "PK" ở đầu Crews nghĩa là hợp thành này góp vào khoá của Crews: khoá là number + studioName. Kết quả giống hệt slide 32 (script ở đó chạy CREATE TABLE và cho thấy xoá dây chuyền): Studios(name, address), Crews(number, crewChief, studioName).</p>
<p class="dap-an">✅ <strong>Tóm ba cách ký hiệu thực thể yếu:</strong> E/R — chữ nhật đôi + thoi đôi; UML — hợp thành (thoi đen, 1..1) có PK trên đường nối; SQL — khoá chính ghép chứa khoá của chủ, và khoá đó đồng thời là khoá ngoại NOT NULL.</p>`],
    ]),
    bi(`<h3>✅ Check yourself in 60 seconds</h3>
<ol>
<li>A hierarchy has a root and 3 subclasses. How many relations can the OO strategy create at most?</li>
<li>In UML, what do 0..1 and 1..1 at the Studios end mean for the foreign key column studioName?</li>
<li>Which strategy stores one murder mystery in two tables?</li>
</ol>
<p class="dap-an">✅ <strong>Answers:</strong> (1) 2³ = 8. (2) 0..1 → studioName allows NULL; 1..1 → studioName NOT NULL. (3) the E/R style (Movies + MurderMysteries).</p>
<p><strong>Next:</strong> the deep-dive lessons 3.1–3.4 below, then lesson 3.5 (practice: 7 PE-style exercises from requirements to CREATE TABLE) and the chapter quiz.</p>`,
    `<h3>✅ Tự kiểm tra trong 60 giây</h3>
<ol>
<li>Một cây phân cấp có một gốc và 3 lớp con. Chiến lược OO tạo tối đa bao nhiêu quan hệ?</li>
<li>Trong UML, nhãn 0..1 và 1..1 ở đầu Studios nghĩa là gì với cột khoá ngoại studioName?</li>
<li>Chiến lược nào lưu một phim trinh thám ở hai bảng?</li>
</ol>
<p class="dap-an">✅ <strong>Đáp án:</strong> (1) 2³ = 8. (2) 0..1 → studioName cho phép NULL; 1..1 → studioName NOT NULL. (3) kiểu E/R (Movies + MurderMysteries).</p>
<p><strong>Học tiếp:</strong> các bài đào sâu 3.1–3.4 ngay bên dưới, rồi bài 3.5 (thực hành: 7 bài kiểu PE từ đề nghiệp vụ tới CREATE TABLE) và bài trắc nghiệm của chương.</p>`),
    books([
      ['ullman', 'Ch.4 High-Level Database Models — §4.6 Converting Subclass Structures to Relations · §4.7 Unified Modeling Language · §4.8 From UML Diagrams to Relations', 'Chương 4 High-Level Database Models — §4.6 Converting Subclass Structures to Relations (lớp con → quan hệ) · §4.7 Unified Modeling Language · §4.8 From UML Diagrams to Relations (UML → quan hệ)'],
    ]),
  ].join('\n'),
};

/* ───────── 3.4 — 🧩 ERD Workshop: 10 business briefs → ERD → tables, plus a 30+ question oral-exam bank ───────── */
const L_x_xuong_erd = {
  title: '3.4 — 🧩 ERD Workshop: 10 business briefs → ERD → tables, plus a 30+ question oral-exam bank|||3.4 — 🧩 Xưởng ERD: 10 đề nghiệp vụ → ERD → bảng, và ngân hàng 30+ câu hỏi vấn đáp',
  slug: 'dbi202-xuong-erd',
  type: 'VIDEO',
  description: "Trang quan trọng nhất của Chương 3 — quy trình 7 bước tóm tắt, bảng ký hiệu Chen/Crow's Foot/UML, 10 đề nghiệp vụ tăng dần độ khó (thư viện, bán hàng online, chuỗi khách sạn, đăng ký học phần, bệnh viện, rạp chiếu phim, giao hàng, mạng xã hội, quản lý dự án, ngân hàng) mỗi đề đi từ đoạn mô tả tới ERD tới CREATE TABLE chạy thật, ngân hàng hơn 30 câu hỏi vấn đáp thầy cô hay hỏi kèm câu trả lời mẫu, và 10 lỗi vẽ ERD hay bị trừ điểm.",
  content: [
    bi(`<span class="eyebrow">Chapter 3 · Lesson 3.4 · ERD Workshop</span>
<h2>The page students keep asking about: "the teacher always asks about ERD"</h2>
<p class="lead">If DBI202 has one skill that follows you into every PT, the PE, the FE and the interview after graduation, it is this one: turning a paragraph of business requirements into an Entity-Relationship Diagram, then into tables. Lesson 3.A already taught the notation and the 7-step recipe; lesson 3.5 already gave you 7 worked exercises. This page is different on purpose: 10 <em>new</em> business cases that climb in difficulty, one at a time, each one adding exactly one new idea on top of the last — and, at the end, a 30-plus question bank of exactly the kind of oral question a lecturer asks while looking at your diagram.</p>
<div class="callout"><p><strong>Read this page in order, not as a lookup table.</strong> Case 1 is deliberately easy; case 10 is a full mini-PE that reuses every idea from cases 1–9 at once. If you only have time for a few, do 1, 4, 8 and 10 — they carry the most new ideas per minute.</p></div>`,
    `<span class="eyebrow">Chương 3 · Bài 3.4 · Xưởng ERD</span>
<h2>Trang sinh viên hay hỏi lại nhất: "thầy lúc nào cũng hỏi ERD"</h2>
<p class="lead">Nếu DBI202 có một kỹ năng theo bạn suốt mọi bài PT, đề PE, đề FE và cả phỏng vấn sau khi ra trường, đó chính là kỹ năng này: biến một đoạn mô tả nghiệp vụ thành sơ đồ Thực thể – Liên kết (ERD), rồi thành bảng. Bài 3.A đã dạy ký hiệu và công thức 7 bước; bài 3.5 đã cho bạn 7 bài tập có lời giải. Trang này cố tình khác: 10 đề nghiệp vụ <em>mới</em>, tăng dần độ khó, mỗi đề thêm đúng một ý mới so với đề trước — và ở cuối, một ngân hàng hơn 30 câu hỏi đúng kiểu giảng viên hay hỏi vấn đáp khi nhìn vào sơ đồ của bạn.</p>
<div class="callout"><p><strong>Đọc trang này theo thứ tự, đừng dùng như bảng tra cứu.</strong> Đề 1 cố tình dễ; đề 10 là một đề PE mini đầy đủ, dùng lại mọi ý của đề 1–9 cùng lúc. Nếu chỉ có ít thời gian, làm đề 1, 4, 8 và 10 — chúng mang nhiều ý mới nhất trên mỗi phút bỏ ra.</p></div>`),
    bi(`<h2>Recap — the 7-step recipe and three notations side by side</h2>
<p>Full explanation with examples is in lesson 3.A; here is the version you actually use while solving a case below.</p>
<table>
<thead><tr><th>Step</th><th>Ask the paragraph</th><th>Watch for</th></tr></thead>
<tbody>
<tr><td>1</td><td>Which nouns have facts of their own?</td><td>those become entity sets</td></tr>
<tr><td>2</td><td>Which attribute identifies each one uniquely? Alone, or only with an owner?</td><td>primary key, or weak entity + partial key</td></tr>
<tr><td>3</td><td>Which verbs connect two (or three) nouns? "one or many, from each side"?</td><td>relationships + cardinality ratio (1-1, 1-M, M-N)</td></tr>
<tr><td>4</td><td>Any list, group, or computed value?</td><td>multivalued / composite / derived attribute</td></tr>
<tr><td>5</td><td>Does a noun "belong to" a broader category with its own extra facts?</td><td>subclass (isa hierarchy)</td></tr>
<tr><td>6</td><td>Does a noun refer to another instance of the SAME noun?</td><td>recursive relationship — read the two role names carefully</td></tr>
<tr><td>7</td><td>Apply the conversion rules (parent tables first; M-N and weak entities become their own table; composite keys stay composite)</td><td>CREATE TABLE, in dependency order</td></tr>
</tbody>
</table>
<p class="nhan">Three ways to draw the same fact</p>
<table>
<thead><tr><th>Concept</th><th>Chen (school slides)</th><th>Crow's Foot (SSMS diagrams, dbdiagram.io, industry)</th><th>UML class diagram</th></tr></thead>
<tbody>
<tr><td>Entity / class</td><td>rectangle</td><td>rectangle</td><td>rectangle, with a compartment for attributes</td></tr>
<tr><td>Relationship</td><td>diamond, named</td><td>a line, usually unnamed</td><td>an association line, sometimes named</td></tr>
<tr><td>"Many" end</td><td>the letter M/N next to the line</td><td>a three-pronged fork ("crow's foot")</td><td>a multiplicity label, e.g. <code>1..*</code> or <code>*</code></td></tr>
<tr><td>"Exactly one" end</td><td>the letter 1</td><td>a single perpendicular tick</td><td>a multiplicity label <code>1</code></td></tr>
<tr><td>"Zero or one" end</td><td>rarely distinguished</td><td>a circle plus a tick</td><td>multiplicity <code>0..1</code></td></tr>
<tr><td>Weak entity</td><td>double rectangle + double diamond</td><td>no special symbol — implied by a composite/no independent key</td><td>a composite/aggregation diamond on the association</td></tr>
</tbody>
</table>
<p class="pitfall">Every previous lesson used Chen because that is what the school's slides use, and PE diagrams follow it too — but a PE marker, a company's onboarding docs, or a tool like dbdiagram.io will show you Crow's Foot without warning. Practise reading both; do not assume the exam only ever shows one style.</p>`,
    `<h2>Ôn nhanh — công thức 7 bước và ba cách ký hiệu đặt cạnh nhau</h2>
<p>Giải thích đầy đủ có ví dụ nằm ở bài 3.A; đây là bản bạn thật sự dùng khi làm các đề bên dưới.</p>
<table>
<thead><tr><th>Bước</th><th>Hỏi đoạn đề</th><th>Để ý</th></tr></thead>
<tbody>
<tr><td>1</td><td>Danh từ nào có thông tin riêng?</td><td>thành tập thực thể</td></tr>
<tr><td>2</td><td>Thuộc tính nào xác định duy nhất từng thực thể? Tự nó, hay chỉ cùng với chủ?</td><td>khoá chính, hoặc thực thể yếu + khoá bộ phận</td></tr>
<tr><td>3</td><td>Động từ nào nối hai (hay ba) danh từ? "một hay nhiều, từ mỗi phía"?</td><td>liên kết + tỉ lệ bản số (1-1, 1-M, M-N)</td></tr>
<tr><td>4</td><td>Có danh sách, nhóm, hay giá trị tính ra được không?</td><td>thuộc tính đa trị / phức hợp / dẫn xuất</td></tr>
<tr><td>5</td><td>Một danh từ có "thuộc" một nhóm rộng hơn, có thêm thông tin riêng không?</td><td>lớp con (phân cấp isa)</td></tr>
<tr><td>6</td><td>Một danh từ có trỏ tới một thực thể KHÁC CÙNG LOẠI không?</td><td>liên kết đệ quy — đọc kỹ hai tên vai trò</td></tr>
<tr><td>7</td><td>Áp luật chuyển đổi (bảng cha trước; M-N và thực thể yếu thành bảng riêng; khoá ghép giữ nguyên ghép)</td><td>CREATE TABLE, theo đúng thứ tự phụ thuộc</td></tr>
</tbody>
</table>
<p class="nhan">Ba cách vẽ cùng một sự thật</p>
<table>
<thead><tr><th>Khái niệm</th><th>Chen (slide trường)</th><th>Crow's Foot (sơ đồ SSMS, dbdiagram.io, ngành)</th><th>UML class diagram</th></tr></thead>
<tbody>
<tr><td>Thực thể / lớp</td><td>hình chữ nhật</td><td>hình chữ nhật</td><td>hình chữ nhật, có ngăn riêng cho thuộc tính</td></tr>
<tr><td>Liên kết</td><td>hình thoi, có tên</td><td>một đường thẳng, thường không tên</td><td>một đường association, đôi khi có tên</td></tr>
<tr><td>Đầu "nhiều"</td><td>chữ M/N cạnh đường nối</td><td>ba nhánh chẽ ra ("chân chim")</td><td>nhãn bản số, vd <code>1..*</code> hoặc <code>*</code></td></tr>
<tr><td>Đầu "đúng một"</td><td>chữ 1</td><td>một gạch vuông góc</td><td>nhãn bản số <code>1</code></td></tr>
<tr><td>Đầu "không hoặc một"</td><td>ít khi phân biệt riêng</td><td>một vòng tròn cộng một gạch</td><td>nhãn bản số <code>0..1</code></td></tr>
<tr><td>Thực thể yếu</td><td>chữ nhật đôi + hình thoi đôi</td><td>không có ký hiệu riêng — ngầm hiểu qua khoá ghép/không có khoá độc lập</td><td>hình thoi composite/aggregation trên association</td></tr>
</tbody>
</table>
<p class="pitfall">Mọi bài trước dùng Chen vì slide trường dùng nó, và sơ đồ đề PE cũng theo đó — nhưng người chấm PE, tài liệu onboarding của công ty, hay công cụ như dbdiagram.io sẽ hiện Crow's Foot mà không báo trước. Luyện đọc cả hai; đừng cho rằng đề thi chỉ dùng một kiểu duy nhất.</p>`),
    bi(`<h3>Case 1 — Library: a weak entity and an M-N with attributes, again, but bigger (~10 min, warm-up)</h3>
<p>A library stores <strong>books</strong> (ISBN, title, publication year) and their <strong>authors</strong> (a book can have several authors, an author can write several books). The library owns physical <strong>copies</strong> of each book, numbered inside that book only (copy 1, 2, 3… of THIS book — a different book also has a copy 1). Each <strong>member</strong> can <strong>borrow</strong> a specific copy, on a loan date, with a due date and, once returned, a return date; the same copy can be borrowed again later by someone else.</p>
<table>
<thead><tr><th>Element</th><th>Decision</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Book — Author</td><td>M-N, own table BookAuthor</td><td>"several authors… several books" both ways</td></tr>
<tr><td>Copy</td><td>weak entity, partial key copyNo, owner Book</td><td>"numbered inside that book only" — copyNo alone repeats across books</td></tr>
<tr><td>Loan</td><td>M-N Member–Copy with loanDate/dueDate/returnDate</td><td>a copy can be borrowed many times over time; a member borrows many copies</td></tr>
<tr><td>key of Loan</td><td>(isbn, copyNo, loanDate)</td><td>the same copy can be borrowed again later — loanDate must be in the key, or a second loan of the same copy would overwrite the first</td></tr>
</tbody>
</table>
<pre><code class="language-plaintext">[Book] isbn*, title, yearPub ══ M ══&lt;&lt;writes&gt;&gt;══ N ══ [Author] authorID*, fullName
   │ 1
&lt;has&gt;
   │ N
[[Copy]] copyNo (partial), shelf
   │ 1
&lt;borrows (loanDate, dueDate, returnDate)&gt;
   │ N
[Member] memberID*, fullName
[[ ]] = weak entity</code></pre>
<p>Book(<u>isbn</u>, title, yearPub) · Author(<u>authorID</u>, fullName) · BookAuthor(<u>isbn</u>, <u>authorID</u>) · Copy(<u>isbn</u>, <u>copyNo</u>) · Member(<u>memberID</u>, fullName) · Loan(<u>isbn</u>, <u>copyNo</u>, <u>loanDate</u>, memberID, dueDate, returnDate)</p>
<pre><code class="language-sql">CREATE TABLE Author (
  authorID   INT IDENTITY PRIMARY KEY,
  fullName   NVARCHAR(50) NOT NULL
);
CREATE TABLE Book (
  isbn       CHAR(13)     PRIMARY KEY,
  title      NVARCHAR(120) NOT NULL,
  yearPub    INT
);
CREATE TABLE BookAuthor (                                         -- M-N: its own table
  isbn       CHAR(13) REFERENCES Book(isbn),
  authorID   INT      REFERENCES Author(authorID),
  PRIMARY KEY (isbn, authorID)
);
CREATE TABLE Copy (                                                -- weak entity: partial key copyNo
  isbn       CHAR(13) REFERENCES Book(isbn),
  copyNo     INT      NOT NULL,                                    -- unique only within one book
  shelf      VARCHAR(10),
  PRIMARY KEY (isbn, copyNo)
);
CREATE TABLE Member (
  memberID   CHAR(8)      PRIMARY KEY,
  fullName   NVARCHAR(50) NOT NULL
);
CREATE TABLE Loan (                                                -- M-N Member-Copy, with attributes
  isbn       CHAR(13),
  copyNo     INT,
  memberID   CHAR(8)  REFERENCES Member(memberID),
  loanDate   DATE     NOT NULL,
  dueDate    DATE     NOT NULL,
  returnDate DATE     NULL,
  PRIMARY KEY (isbn, copyNo, loanDate),
  FOREIGN KEY (isbn, copyNo) REFERENCES Copy(isbn, copyNo)          -- composite FK to a weak entity
);</code></pre>
<div class="out">(2 rows affected)<br>
(2 rows affected)<br>
(2 rows affected)<br>
(3 rows affected)<br>
(2 rows affected)<br>
(3 rows affected)</div>
<table>
<thead><tr><th>table_name</th><th>cols</th><th>fks</th></tr></thead>
<tbody>
<tr><td>Author</td><td>2</td><td>0</td></tr>
<tr><td>Book</td><td>3</td><td>0</td></tr>
<tr><td>BookAuthor</td><td>2</td><td>2</td></tr>
<tr><td>Copy</td><td>3</td><td>1</td></tr>
<tr><td>Loan</td><td>6</td><td>2</td></tr>
<tr><td>Member</td><td>2</td><td>0</td></tr>
</tbody>
</table>
<p>6 tables, matching the schema above; Loan carries 2 foreign keys (the composite one to Copy, plus memberID), exactly what the self-check query reports.</p>
<div class="pitfall">A very common near-miss: making Loan's key just (isbn, copyNo) because "one copy, one loan" feels natural. Re-read the paragraph: "the same copy can be borrowed again later" — without loanDate in the key, the second loan record would silently overwrite the first one's row (same primary key), destroying loan history. Exactly the same shape of mistake lesson 3.5's exercise 1 flagged for Enroll.</div>`,
    `<h3>Đề 1 — Thư viện: thực thể yếu và M-N có thuộc tính, làm lại nhưng lớn hơn (~10 phút, khởi động)</h3>
<p>Một thư viện lưu <strong>sách</strong> (ISBN, tên sách, năm xuất bản) và <strong>tác giả</strong> của chúng (một sách có thể nhiều tác giả, một tác giả viết nhiều sách). Thư viện có các <strong>bản sao</strong> vật lý của từng sách, đánh số chỉ trong phạm vi sách đó (bản 1, 2, 3… của sách NÀY — một sách khác cũng có bản số 1). Mỗi <strong>thành viên</strong> có thể <strong>mượn</strong> một bản sao cụ thể, có ngày mượn, hạn trả và, khi đã trả, ngày trả; đúng bản sao đó sau này có thể được người khác mượn lại.</p>
<table>
<thead><tr><th>Thành phần</th><th>Quyết định</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td>Book — Author</td><td>M-N, bảng riêng BookAuthor</td><td>"nhiều tác giả… nhiều sách" cả hai chiều</td></tr>
<tr><td>Copy</td><td>thực thể yếu, khoá bộ phận copyNo, chủ là Book</td><td>"đánh số chỉ trong phạm vi sách đó" — copyNo một mình lặp lại giữa các sách</td></tr>
<tr><td>Loan</td><td>M-N Member–Copy có loanDate/dueDate/returnDate</td><td>một bản sao mượn được nhiều lần theo thời gian; một thành viên mượn nhiều bản</td></tr>
<tr><td>khoá của Loan</td><td>(isbn, copyNo, loanDate)</td><td>đúng bản sao đó sau này mượn lại được — loanDate phải nằm trong khoá, không thì lần mượn thứ hai của cùng bản sao sẽ ghi đè lên lần đầu</td></tr>
</tbody>
</table>
<pre><code class="language-plaintext">[Book] isbn*, title, yearPub ══ M ══&lt;&lt;writes&gt;&gt;══ N ══ [Author] authorID*, fullName
   │ 1
&lt;has&gt;
   │ N
[[Copy]] copyNo (partial), shelf
   │ 1
&lt;borrows (loanDate, dueDate, returnDate)&gt;
   │ N
[Member] memberID*, fullName
[[ ]] = thực thể yếu</code></pre>
<p>Book(<u>isbn</u>, title, yearPub) · Author(<u>authorID</u>, fullName) · BookAuthor(<u>isbn</u>, <u>authorID</u>) · Copy(<u>isbn</u>, <u>copyNo</u>) · Member(<u>memberID</u>, fullName) · Loan(<u>isbn</u>, <u>copyNo</u>, <u>loanDate</u>, memberID, dueDate, returnDate)</p>
<pre><code class="language-sql">CREATE TABLE Author (
  authorID   INT IDENTITY PRIMARY KEY,
  fullName   NVARCHAR(50) NOT NULL
);
CREATE TABLE Book (
  isbn       CHAR(13)     PRIMARY KEY,
  title      NVARCHAR(120) NOT NULL,
  yearPub    INT
);
CREATE TABLE BookAuthor (                                         -- M-N: bảng riêng
  isbn       CHAR(13) REFERENCES Book(isbn),
  authorID   INT      REFERENCES Author(authorID),
  PRIMARY KEY (isbn, authorID)
);
CREATE TABLE Copy (                                                -- thực thể yếu: khoá bộ phận copyNo
  isbn       CHAR(13) REFERENCES Book(isbn),
  copyNo     INT      NOT NULL,                                    -- chỉ duy nhất trong một cuốn sách
  shelf      VARCHAR(10),
  PRIMARY KEY (isbn, copyNo)
);
CREATE TABLE Member (
  memberID   CHAR(8)      PRIMARY KEY,
  fullName   NVARCHAR(50) NOT NULL
);
CREATE TABLE Loan (                                                -- M-N Member-Copy, có thuộc tính
  isbn       CHAR(13),
  copyNo     INT,
  memberID   CHAR(8)  REFERENCES Member(memberID),
  loanDate   DATE     NOT NULL,
  dueDate    DATE     NOT NULL,
  returnDate DATE     NULL,
  PRIMARY KEY (isbn, copyNo, loanDate),
  FOREIGN KEY (isbn, copyNo) REFERENCES Copy(isbn, copyNo)          -- khoá ngoại ghép tới thực thể yếu
);</code></pre>
<div class="out">(2 rows affected)<br>
(2 rows affected)<br>
(2 rows affected)<br>
(3 rows affected)<br>
(2 rows affected)<br>
(3 rows affected)</div>
<table>
<thead><tr><th>table_name</th><th>cols</th><th>fks</th></tr></thead>
<tbody>
<tr><td>Author</td><td>2</td><td>0</td></tr>
<tr><td>Book</td><td>3</td><td>0</td></tr>
<tr><td>BookAuthor</td><td>2</td><td>2</td></tr>
<tr><td>Copy</td><td>3</td><td>1</td></tr>
<tr><td>Loan</td><td>6</td><td>2</td></tr>
<tr><td>Member</td><td>2</td><td>0</td></tr>
</tbody>
</table>
<p>6 bảng, đúng như lược đồ trên; Loan mang 2 khoá ngoại (một cái ghép tới Copy, cộng memberID), đúng như câu tự kiểm báo.</p>
<div class="pitfall">Một lỗi rất hay gặp: đặt khoá của Loan chỉ là (isbn, copyNo) vì cảm giác "một bản sao, một lần mượn" nghe tự nhiên. Đọc lại đề: "đúng bản sao đó sau này có thể được người khác mượn lại" — không có loanDate trong khoá, lần mượn thứ hai sẽ âm thầm ghi đè lên dòng của lần đầu (cùng khoá chính), xoá mất lịch sử mượn. Đúng hình dạng lỗi bài 1 của bài 3.5 từng cảnh báo cho Enroll.</div>`),
    bi(`<h3>Case 2 — Online store: a recursive relationship on the SAME entity set (~15 min)</h3>
<p>A shop organises its <strong>products</strong> into <strong>categories</strong> (Phones, Laptops…). A category can itself sit inside a broader category — "Phones" and "Laptops" both sit inside "Electronics" — and that broader category can sit inside an even broader one; a top-level category has no parent. A <strong>customer</strong> places <strong>orders</strong>, each with one or more products, a quantity, and the unit price <em>at the time of the order</em> (a later price change must not change old orders).</p>
<table>
<thead><tr><th>Element</th><th>Decision</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Category → Category</td><td>recursive 1-M, self foreign key parentID (nullable)</td><td>"a category can sit inside a broader category" — Category refers to another row of the SAME entity set; NULL parentID = top level</td></tr>
<tr><td>Product</td><td>1-M from Category (a product sits in exactly one category here)</td><td>simplification stated by "into categories"</td></tr>
<tr><td>Order — Product</td><td>M-N, own table OrderItem, WITH unitPrice stored</td><td>"at the time of the order… must not change" — this price is not derived, it is a deliberate snapshot, the opposite of a derived attribute</td></tr>
</tbody>
</table>
<pre><code class="language-plaintext">[Category] categoryID*, name, parentID → Category (recursive, self FK)
   │ 1
&lt;has&gt;
   │ N
[Product] productID*, name, price
                                    [Customer] customerID*, fullName
                                          │ 1
                                       &lt;places&gt;
                                          │ N
                                    [Order] orderID*, orderDate
[Product] ── N ──&lt;contains (qty, unitPrice)&gt;── M ── [Order]</code></pre>
<p>Category(<u>categoryID</u>, name, parentID → Category) · Product(<u>productID</u>, name, price, categoryID → Category) · Customer(<u>customerID</u>, fullName) · Order(<u>orderID</u>, customerID → Customer, orderDate) · OrderItem(<u>orderID</u>, <u>productID</u>, qty, unitPrice)</p>
<pre><code class="language-sql">CREATE TABLE Category (
  categoryID   INT IDENTITY PRIMARY KEY,
  name         NVARCHAR(50) NOT NULL,
  parentID     INT NULL REFERENCES Category(categoryID)            -- recursive self-FK: a category's parent category
);
CREATE TABLE Product (
  productID    INT IDENTITY PRIMARY KEY,
  name         NVARCHAR(80) NOT NULL,
  price        DECIMAL(12,0) NOT NULL CHECK (price &gt; 0),
  categoryID   INT NOT NULL REFERENCES Category(categoryID)
);
CREATE TABLE Customer (
  customerID   INT IDENTITY PRIMARY KEY,
  fullName     NVARCHAR(50) NOT NULL
);
CREATE TABLE [Order] (
  orderID      INT IDENTITY PRIMARY KEY,
  customerID   INT NOT NULL REFERENCES Customer(customerID),
  orderDate    DATE NOT NULL
);
CREATE TABLE OrderItem (                                           -- M-N Order-Product, with attributes
  orderID      INT REFERENCES [Order](orderID),
  productID    INT REFERENCES Product(productID),
  qty          INT NOT NULL CHECK (qty &gt; 0),
  unitPrice    DECIMAL(12,0) NOT NULL,                              -- snapshot of price at order time
  PRIMARY KEY (orderID, productID)
);</code></pre>
<div class="out">(1 row affected)<br>
(2 rows affected)<br>
(2 rows affected)<br>
(2 rows affected)<br>
(2 rows affected)<br>
(3 rows affected)</div>
<table>
<thead><tr><th>table_name</th><th>cols</th><th>fks</th></tr></thead>
<tbody>
<tr><td>Category</td><td>3</td><td>1</td></tr>
<tr><td>Customer</td><td>2</td><td>0</td></tr>
<tr><td>Order</td><td>3</td><td>1</td></tr>
<tr><td>OrderItem</td><td>4</td><td>2</td></tr>
<tr><td>Product</td><td>4</td><td>1</td></tr>
</tbody>
</table>
<p>5 tables; Category is the only one with a foreign key pointing at its own table — that single row in the self-check (fks=1 for a table that also owns itself) is exactly how a recursive relationship shows up once it becomes SQL.</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong> — the self-referencing foreign key is written identically; the only usual difference here is the identity column (<code>GENERATED ... AS IDENTITY</code> instead of <code>IDENTITY</code>). <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-2-khoa-ngoai">Học tiếp PostgreSQL — khoá ngoại</a>.</div>
<div class="pitfall">Do not draw three separate boxes "Electronics", "Phones", "Laptops" as three different entity SETS — they are three ROWS of the same entity set Category. Recursive relationships are the single most-missed case on PE question 1 because students expect every arrow to connect two different-looking boxes.</div>`,
    `<h3>Đề 2 — Bán hàng online: liên kết đệ quy trên CÙNG một tập thực thể (~15 phút)</h3>
<p>Một cửa hàng tổ chức <strong>sản phẩm</strong> theo <strong>danh mục</strong> (Điện thoại, Laptop…). Một danh mục có thể nằm bên trong một danh mục rộng hơn — "Điện thoại" và "Laptop" đều nằm trong "Điện tử" — và danh mục rộng hơn đó lại có thể nằm trong một danh mục rộng hơn nữa; danh mục ở mức cao nhất không có danh mục cha. Một <strong>khách hàng</strong> đặt <strong>đơn hàng</strong>, mỗi đơn có một hoặc nhiều sản phẩm, số lượng, và đơn giá <em>tại thời điểm đặt hàng</em> (giá đổi sau này không được làm đổi đơn cũ).</p>
<table>
<thead><tr><th>Thành phần</th><th>Quyết định</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td>Category → Category</td><td>1-M đệ quy, khoá ngoại tự trỏ parentID (cho phép NULL)</td><td>"một danh mục có thể nằm bên trong một danh mục rộng hơn" — Category trỏ tới một dòng KHÁC của CÙNG tập thực thể; parentID NULL = mức cao nhất</td></tr>
<tr><td>Product</td><td>1-M từ Category (một sản phẩm nằm đúng một danh mục ở đây)</td><td>đơn giản hoá theo đúng câu "theo danh mục"</td></tr>
<tr><td>Order — Product</td><td>M-N, bảng riêng OrderItem, CÓ lưu unitPrice</td><td>"tại thời điểm đặt hàng… không được làm đổi" — giá này không phải dẫn xuất, mà là một bản chụp cố ý, ngược hẳn với thuộc tính dẫn xuất</td></tr>
</tbody>
</table>
<pre><code class="language-plaintext">[Category] categoryID*, name, parentID → Category (đệ quy, khoá ngoại tự trỏ)
   │ 1
&lt;has&gt;
   │ N
[Product] productID*, name, price
                                    [Customer] customerID*, fullName
                                          │ 1
                                       &lt;places&gt;
                                          │ N
                                    [Order] orderID*, orderDate
[Product] ── N ──&lt;contains (qty, unitPrice)&gt;── M ── [Order]</code></pre>
<p>Category(<u>categoryID</u>, name, parentID → Category) · Product(<u>productID</u>, name, price, categoryID → Category) · Customer(<u>customerID</u>, fullName) · Order(<u>orderID</u>, customerID → Customer, orderDate) · OrderItem(<u>orderID</u>, <u>productID</u>, qty, unitPrice)</p>
<pre><code class="language-sql">CREATE TABLE Category (
  categoryID   INT IDENTITY PRIMARY KEY,
  name         NVARCHAR(50) NOT NULL,
  parentID     INT NULL REFERENCES Category(categoryID)            -- khoá ngoại đệ quy: danh mục cha
);
CREATE TABLE Product (
  productID    INT IDENTITY PRIMARY KEY,
  name         NVARCHAR(80) NOT NULL,
  price        DECIMAL(12,0) NOT NULL CHECK (price &gt; 0),
  categoryID   INT NOT NULL REFERENCES Category(categoryID)
);
CREATE TABLE Customer (
  customerID   INT IDENTITY PRIMARY KEY,
  fullName     NVARCHAR(50) NOT NULL
);
CREATE TABLE [Order] (
  orderID      INT IDENTITY PRIMARY KEY,
  customerID   INT NOT NULL REFERENCES Customer(customerID),
  orderDate    DATE NOT NULL
);
CREATE TABLE OrderItem (                                           -- M-N Order-Product, có thuộc tính
  orderID      INT REFERENCES [Order](orderID),
  productID    INT REFERENCES Product(productID),
  qty          INT NOT NULL CHECK (qty &gt; 0),
  unitPrice    DECIMAL(12,0) NOT NULL,                              -- chụp lại giá tại thời điểm đặt hàng
  PRIMARY KEY (orderID, productID)
);</code></pre>
<div class="out">(1 row affected)<br>
(2 rows affected)<br>
(2 rows affected)<br>
(2 rows affected)<br>
(2 rows affected)<br>
(3 rows affected)</div>
<table>
<thead><tr><th>table_name</th><th>cols</th><th>fks</th></tr></thead>
<tbody>
<tr><td>Category</td><td>3</td><td>1</td></tr>
<tr><td>Customer</td><td>2</td><td>0</td></tr>
<tr><td>Order</td><td>3</td><td>1</td></tr>
<tr><td>OrderItem</td><td>4</td><td>2</td></tr>
<tr><td>Product</td><td>4</td><td>1</td></tr>
</tbody>
</table>
<p>5 bảng; Category là bảng duy nhất có khoá ngoại trỏ về đúng bảng của mình — đúng dòng đó trong câu tự kiểm (fks=1 cho một bảng cũng tự sở hữu chính nó) chính là cách một liên kết đệ quy hiện ra khi thành SQL.</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> — khoá ngoại tự trỏ viết y hệt; khác biệt thường gặp duy nhất ở đây là cột tự tăng (<code>GENERATED ... AS IDENTITY</code> thay vì <code>IDENTITY</code>). <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-2-khoa-ngoai">Học tiếp PostgreSQL — khoá ngoại</a>.</div>
<div class="pitfall">Đừng vẽ ba hộp riêng "Điện tử", "Điện thoại", "Laptop" như ba tập thực thể KHÁC nhau — chúng là ba DÒNG của cùng một tập thực thể Category. Liên kết đệ quy là trường hợp bị bỏ sót nhiều nhất ở câu 1 đề PE vì sinh viên mặc định mọi mũi tên phải nối hai hộp trông khác nhau.</div>`),
    bi(`<h3>Case 3 — Hotel chain: an M-N attribute list and a weak entity chained onto an M-N (~15 min)</h3>
<p>A hotel <strong>chain</strong> owns several <strong>hotels</strong>, each in one city. Each hotel has <strong>rooms</strong> — here room numbers are unique within the whole hotel (unlike case 1's per-book numbering, a hotel's room numbers do not repeat inside that hotel, so Room does not need to be weak this time) — with a type and a price. Hotels advertise <strong>amenities</strong> (wifi, pool…) from a shared list; several hotels can share the same amenity. A <strong>guest books</strong> a room for a date range, and each booking is settled by one or more <strong>payments</strong> (a deposit, then a balance) — a payment only ever exists attached to exactly one booking, and is numbered only within that booking.</p>
<table>
<thead><tr><th>Element</th><th>Decision</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Hotel — Amenity</td><td>M-N, own table HotelAmenity</td><td>"several hotels can share the same amenity" both ways</td></tr>
<tr><td>Room</td><td>NOT weak this time — PK is just (hotelID, roomNo) as a composite natural key, but conceptually independent per hotel</td><td>contrast with case 1: whether an entity is "weak" is a business-rule decision the paragraph makes, not a fixed fact about "rooms" in general</td></tr>
<tr><td>Booking</td><td>M-N Guest–Room with checkIn/checkOut, PLUS a same-row date rule</td><td>checkOut must be after checkIn — a same-row, cross-column business rule</td></tr>
<tr><td>Payment</td><td>weak entity of BOOKING (not of Hotel or Guest), partial key paymentNo</td><td>"only ever exists attached to exactly one booking… numbered only within that booking" — the owner of a weak entity does not have to be a "simple" entity, it can be an M-N relationship's own table</td></tr>
</tbody>
</table>
<pre><code class="language-plaintext">[HotelChain] chainID*, name ══ 1 ══&lt;&lt;owns&gt;&gt;══ N ══ [Hotel] hotelID*, city
[Hotel] ── N ──&lt;offers&gt;── M ── [Amenity] amenityID*, name
[Hotel] ══ 1 ══&lt;&lt;has&gt;&gt;══ N ══ [Room] hotelID+roomNo*, roomType, price
[Room] ── N ──&lt;books (checkIn, checkOut)&gt;── M ── [Guest] guestID*, fullName
   creates Booking, and:
[Booking] ══ 1 ══&lt;&lt;settled by&gt;&gt;══ N ══ [[Payment]] paymentNo (partial), amount, paidAt</code></pre>
<p>HotelChain(<u>chainID</u>, name) · Hotel(<u>hotelID</u>, chainID → HotelChain, city) · Room(<u>hotelID</u>, <u>roomNo</u>, roomType, price) · Amenity(<u>amenityID</u>, name) · HotelAmenity(<u>hotelID</u>, <u>amenityID</u>) · Guest(<u>guestID</u>, fullName) · Booking(<u>bookingID</u>, hotelID+roomNo → Room, guestID → Guest, checkIn, checkOut) · Payment(<u>bookingID</u>, <u>paymentNo</u>, amount, paidAt)</p>
<pre><code class="language-sql">CREATE TABLE HotelChain (
  chainID    INT IDENTITY PRIMARY KEY,
  name       NVARCHAR(50) NOT NULL
);
CREATE TABLE Hotel (
  hotelID    INT IDENTITY PRIMARY KEY,
  chainID    INT NOT NULL REFERENCES HotelChain(chainID),
  city       NVARCHAR(50) NOT NULL
);
CREATE TABLE Room (
  hotelID    INT NOT NULL REFERENCES Hotel(hotelID),
  roomNo     INT NOT NULL,                                        -- unique only within one hotel
  roomType   VARCHAR(10) NOT NULL CHECK (roomType IN ('single','double','suite')),
  price      DECIMAL(12,0) NOT NULL CHECK (price &gt; 0),
  PRIMARY KEY (hotelID, roomNo)
);
CREATE TABLE Amenity (
  amenityID  INT IDENTITY PRIMARY KEY,
  name       NVARCHAR(30) NOT NULL
);
CREATE TABLE HotelAmenity (                                        -- M-N Hotel-Amenity
  hotelID    INT REFERENCES Hotel(hotelID),
  amenityID  INT REFERENCES Amenity(amenityID),
  PRIMARY KEY (hotelID, amenityID)
);
CREATE TABLE Guest (
  guestID    INT IDENTITY PRIMARY KEY,
  fullName   NVARCHAR(50) NOT NULL
);
CREATE TABLE Booking (                                             -- M-N Guest-Room, with attributes
  bookingID  INT IDENTITY PRIMARY KEY,
  hotelID    INT NOT NULL,
  roomNo     INT NOT NULL,
  guestID    INT NOT NULL REFERENCES Guest(guestID),
  checkIn    DATE NOT NULL,
  checkOut   DATE NOT NULL,
  FOREIGN KEY (hotelID, roomNo) REFERENCES Room(hotelID, roomNo)
);
ALTER TABLE Booking ADD CONSTRAINT ck_booking_dates CHECK (checkOut &gt; checkIn);  -- a same-row, two-column CHECK
CREATE TABLE Payment (                                             -- weak entity of Booking: partial key paymentNo
  bookingID  INT NOT NULL REFERENCES Booking(bookingID),
  paymentNo  INT NOT NULL,
  amount     DECIMAL(12,0) NOT NULL,
  paidAt     DATETIME NOT NULL,
  PRIMARY KEY (bookingID, paymentNo)
);</code></pre>
<div class="out">(1 row affected)<br>
(2 rows affected)<br>
(3 rows affected)<br>
(2 rows affected)<br>
(3 rows affected)<br>
(2 rows affected)<br>
(2 rows affected)<br>
(2 rows affected)</div>
<table>
<thead><tr><th>table_name</th><th>cols</th><th>fks</th></tr></thead>
<tbody>
<tr><td>Amenity</td><td>2</td><td>0</td></tr>
<tr><td>Booking</td><td>6</td><td>2</td></tr>
<tr><td>Guest</td><td>2</td><td>0</td></tr>
<tr><td>Hotel</td><td>3</td><td>1</td></tr>
<tr><td>HotelAmenity</td><td>2</td><td>2</td></tr>
<tr><td>HotelChain</td><td>2</td><td>0</td></tr>
<tr><td>Payment</td><td>4</td><td>1</td></tr>
<tr><td>Room</td><td>4</td><td>1</td></tr>
</tbody>
</table>
<p>8 tables; Booking shows 2 foreign keys as expected (the composite one to Room, plus guestID).</p>
<div class="pitfall">The schema adds <code>checkOut &gt; checkIn</code> with a separate <code>ALTER TABLE … ADD CONSTRAINT ck_booking_dates CHECK (…)</code>. That is a style choice, not a requirement: the same CHECK written inside <code>CREATE TABLE</code>, next to a composite <code>FOREIGN KEY</code>, works just as well. The form is worth knowing because PE questions often say “add a constraint to an existing table”, and a named constraint gives a readable error message later.</div>
<div class="pitfall"><strong>The real trap: “Could not create constraint or index. See previous errors.” (Msg 1750).</strong> This line is never the cause — it always comes AFTER the real error. Read the FIRST message. The most common one in ERD-to-table work is Msg 1776: a foreign key must point at the PRIMARY KEY or a UNIQUE column set of the other table. Here <code>Room2</code>’s key is <code>roomID</code>, and the pair <code>(hotelID, roomNo)</code> was never declared unique:
<pre><code class="language-sql">CREATE TABLE Room2 (
  roomID  INT PRIMARY KEY,           -- the key is roomID
  hotelID INT,
  roomNo  INT                         -- (hotelID, roomNo) is NOT declared unique
);
CREATE TABLE Booking2 (
  bookingID INT PRIMARY KEY,
  hotelID INT, roomNo INT, checkIn DATE, checkOut DATE,
  FOREIGN KEY (hotelID, roomNo) REFERENCES Room2(hotelID, roomNo),   -- points at non-key columns
  CHECK (checkOut &gt; checkIn)
);</code></pre>
<div class="out"><b>Msg 1776, Level 16, State 0<br>
There are no primary or candidate keys in the referenced table 'Room2' that match the referencing column list in the foreign key 'FK__Booking2__F8574319'.</b><br>
<b>Msg 1750, Level 16, State 1<br>
Could not create constraint or index. See previous errors.</b></div>
Fix: point the foreign key at <code>roomID</code>, or declare <code>UNIQUE (hotelID, roomNo)</code> on <code>Room2</code> (in this case study the pair IS the primary key, which is why the schema above works).</div>`,
    `<h3>Đề 3 — Chuỗi khách sạn: danh sách thuộc tính M-N và một thực thể yếu gắn lên trên một M-N (~15 phút)</h3>
<p>Một <strong>chuỗi</strong> khách sạn sở hữu nhiều <strong>khách sạn</strong>, mỗi cái ở một thành phố. Mỗi khách sạn có các <strong>phòng</strong> — lần này số phòng là duy nhất trong TOÀN khách sạn (khác cách đánh số theo từng sách ở đề 1, số phòng của một khách sạn không lặp lại trong khách sạn đó, nên Room lần này không cần là thực thể yếu) — có loại phòng và giá. Khách sạn quảng cáo các <strong>tiện ích</strong> (wifi, hồ bơi…) từ một danh sách dùng chung; nhiều khách sạn có thể cùng có một tiện ích. Một <strong>khách</strong> <strong>đặt</strong> một phòng cho một khoảng ngày, và mỗi lượt đặt được thanh toán bằng một hoặc nhiều <strong>lần thanh toán</strong> (đặt cọc, rồi thanh toán phần còn lại) — một lần thanh toán chỉ tồn tại gắn với đúng một lượt đặt, và chỉ đánh số trong phạm vi lượt đặt đó.</p>
<table>
<thead><tr><th>Thành phần</th><th>Quyết định</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td>Hotel — Amenity</td><td>M-N, bảng riêng HotelAmenity</td><td>"nhiều khách sạn có thể cùng có một tiện ích" cả hai chiều</td></tr>
<tr><td>Room</td><td>lần này KHÔNG yếu — khoá chính chỉ là (hotelID, roomNo) như một khoá tự nhiên ghép, nhưng về khái niệm độc lập theo từng khách sạn</td><td>so sánh với đề 1: một thực thể có "yếu" hay không là quyết định luật nghiệp vụ mà đoạn đề đưa ra, không phải sự thật cố định về "phòng" nói chung</td></tr>
<tr><td>Booking</td><td>M-N Guest–Room có checkIn/checkOut, CỘNG một luật cùng dòng</td><td>checkOut phải sau checkIn — luật nghiệp vụ cùng dòng, so sánh giữa các cột</td></tr>
<tr><td>Payment</td><td>thực thể yếu của BOOKING (không phải của Hotel hay Guest), khoá bộ phận paymentNo</td><td>"chỉ tồn tại gắn với đúng một lượt đặt… chỉ đánh số trong phạm vi lượt đặt đó" — chủ của một thực thể yếu không nhất thiết phải là một thực thể "đơn giản", nó có thể là bảng riêng của một liên kết M-N</td></tr>
</tbody>
</table>
<pre><code class="language-plaintext">[HotelChain] chainID*, name ══ 1 ══&lt;&lt;owns&gt;&gt;══ N ══ [Hotel] hotelID*, city
[Hotel] ── N ──&lt;offers&gt;── M ── [Amenity] amenityID*, name
[Hotel] ══ 1 ══&lt;&lt;has&gt;&gt;══ N ══ [Room] hotelID+roomNo*, roomType, price
[Room] ── N ──&lt;books (checkIn, checkOut)&gt;── M ── [Guest] guestID*, fullName
   tạo ra Booking, rồi:
[Booking] ══ 1 ══&lt;&lt;settled by&gt;&gt;══ N ══ [[Payment]] paymentNo (bộ phận), amount, paidAt</code></pre>
<p>HotelChain(<u>chainID</u>, name) · Hotel(<u>hotelID</u>, chainID → HotelChain, city) · Room(<u>hotelID</u>, <u>roomNo</u>, roomType, price) · Amenity(<u>amenityID</u>, name) · HotelAmenity(<u>hotelID</u>, <u>amenityID</u>) · Guest(<u>guestID</u>, fullName) · Booking(<u>bookingID</u>, hotelID+roomNo → Room, guestID → Guest, checkIn, checkOut) · Payment(<u>bookingID</u>, <u>paymentNo</u>, amount, paidAt)</p>
<pre><code class="language-sql">CREATE TABLE HotelChain (
  chainID    INT IDENTITY PRIMARY KEY,
  name       NVARCHAR(50) NOT NULL
);
CREATE TABLE Hotel (
  hotelID    INT IDENTITY PRIMARY KEY,
  chainID    INT NOT NULL REFERENCES HotelChain(chainID),
  city       NVARCHAR(50) NOT NULL
);
CREATE TABLE Room (
  hotelID    INT NOT NULL REFERENCES Hotel(hotelID),
  roomNo     INT NOT NULL,                                        -- chỉ duy nhất trong một khách sạn
  roomType   VARCHAR(10) NOT NULL CHECK (roomType IN ('single','double','suite')),
  price      DECIMAL(12,0) NOT NULL CHECK (price &gt; 0),
  PRIMARY KEY (hotelID, roomNo)
);
CREATE TABLE Amenity (
  amenityID  INT IDENTITY PRIMARY KEY,
  name       NVARCHAR(30) NOT NULL
);
CREATE TABLE HotelAmenity (                                        -- M-N Hotel-Amenity
  hotelID    INT REFERENCES Hotel(hotelID),
  amenityID  INT REFERENCES Amenity(amenityID),
  PRIMARY KEY (hotelID, amenityID)
);
CREATE TABLE Guest (
  guestID    INT IDENTITY PRIMARY KEY,
  fullName   NVARCHAR(50) NOT NULL
);
CREATE TABLE Booking (                                             -- M-N Guest-Room, có thuộc tính
  bookingID  INT IDENTITY PRIMARY KEY,
  hotelID    INT NOT NULL,
  roomNo     INT NOT NULL,
  guestID    INT NOT NULL REFERENCES Guest(guestID),
  checkIn    DATE NOT NULL,
  checkOut   DATE NOT NULL,
  FOREIGN KEY (hotelID, roomNo) REFERENCES Room(hotelID, roomNo)
);
ALTER TABLE Booking ADD CONSTRAINT ck_booking_dates CHECK (checkOut &gt; checkIn);  -- CHECK so sánh hai cột cùng dòng
CREATE TABLE Payment (                                             -- thực thể yếu của Booking: khoá bộ phận paymentNo
  bookingID  INT NOT NULL REFERENCES Booking(bookingID),
  paymentNo  INT NOT NULL,
  amount     DECIMAL(12,0) NOT NULL,
  paidAt     DATETIME NOT NULL,
  PRIMARY KEY (bookingID, paymentNo)
);</code></pre>
<div class="out">(1 row affected)<br>
(2 rows affected)<br>
(3 rows affected)<br>
(2 rows affected)<br>
(3 rows affected)<br>
(2 rows affected)<br>
(2 rows affected)<br>
(2 rows affected)</div>
<table>
<thead><tr><th>table_name</th><th>cols</th><th>fks</th></tr></thead>
<tbody>
<tr><td>Amenity</td><td>2</td><td>0</td></tr>
<tr><td>Booking</td><td>6</td><td>2</td></tr>
<tr><td>Guest</td><td>2</td><td>0</td></tr>
<tr><td>Hotel</td><td>3</td><td>1</td></tr>
<tr><td>HotelAmenity</td><td>2</td><td>2</td></tr>
<tr><td>HotelChain</td><td>2</td><td>0</td></tr>
<tr><td>Payment</td><td>4</td><td>1</td></tr>
<tr><td>Room</td><td>4</td><td>1</td></tr>
</tbody>
</table>
<p>8 bảng; Booking mang đúng 2 khoá ngoại như dự đoán (một cái ghép tới Room, cộng guestID).</p>
<div class="pitfall">Lược đồ thêm <code>checkOut &gt; checkIn</code> bằng một câu <code>ALTER TABLE … ADD CONSTRAINT ck_booking_dates CHECK (…)</code> riêng. Đó là lựa chọn cách viết, KHÔNG bắt buộc: cùng CHECK đó viết ngay trong <code>CREATE TABLE</code>, cạnh một <code>FOREIGN KEY</code> ghép, vẫn chạy bình thường. Nên biết cách viết này vì đề PE hay hỏi "thêm ràng buộc vào bảng đã có", và ràng buộc có tên thì sau này thông báo lỗi dễ đọc.</div>
<div class="pitfall"><strong>Bẫy thật: "Could not create constraint or index. See previous errors." (Msg 1750).</strong> Dòng này KHÔNG BAO GIỜ là nguyên nhân — nó luôn đứng SAU lỗi thật. Hãy đọc thông báo ĐẦU TIÊN. Lỗi hay gặp nhất khi chuyển ERD sang bảng là Msg 1776: khoá ngoại phải trỏ vào KHOÁ CHÍNH hoặc bộ cột UNIQUE của bảng kia. Ở đây khoá của <code>Room2</code> là <code>roomID</code>, còn cặp <code>(hotelID, roomNo)</code> chưa từng được khai là duy nhất:
<pre><code class="language-sql">CREATE TABLE Room2 (
  roomID  INT PRIMARY KEY,           -- khoá là roomID
  hotelID INT,
  roomNo  INT                         -- (hotelID, roomNo) KHÔNG được khai UNIQUE
);
CREATE TABLE Booking2 (
  bookingID INT PRIMARY KEY,
  hotelID INT, roomNo INT, checkIn DATE, checkOut DATE,
  FOREIGN KEY (hotelID, roomNo) REFERENCES Room2(hotelID, roomNo),   -- trỏ vào cột không phải khoá
  CHECK (checkOut &gt; checkIn)
);</code></pre>
<div class="out"><b>Msg 1776, Level 16, State 0<br>
There are no primary or candidate keys in the referenced table 'Room2' that match the referencing column list in the foreign key 'FK__Booking2__F8574319'.</b><br>
<b>Msg 1750, Level 16, State 1<br>
Could not create constraint or index. See previous errors.</b></div>
Cách sửa: cho khoá ngoại trỏ vào <code>roomID</code>, hoặc khai <code>UNIQUE (hotelID, roomNo)</code> trên <code>Room2</code> (trong đề này cặp đó CHÍNH LÀ khoá chính, nên lược đồ phía trên chạy được).</div>`),
    bi(`<h3>Case 4 — Course registration, expanded: a recursive M-N and a three-part weak entity (~15 min)</h3>
<p>A <strong>program</strong> (e.g. Software Engineering) offers several <strong>courses</strong>. Some courses require others as a <strong>prerequisite</strong> — DBI202 requires CSD201, PRJ301 requires DBI202 — and a course can have several prerequisites (and be the prerequisite of several others). Each semester, a course actually runs as one or more <strong>sections</strong> (section 1, section 2…), each taught by one <strong>instructor</strong>, in one room; the same section number can repeat for a different course, or a different semester. <strong>Students</strong> enrol in a specific section and receive a grade.</p>
<table>
<thead><tr><th>Element</th><th>Decision</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Course — Course</td><td>recursive M-N, own table Prerequisite(courseCode, preCode)</td><td>"a course can have several prerequisites, and be the prerequisite of several others" — both directions many, and it is Course referring to Course</td></tr>
<tr><td>Section</td><td>weak entity, partial key (semester, sectionNo), owner Course</td><td>"the same section number can repeat for a different course, or a different semester" — the partial key alone is not unique, it needs BOTH semester AND the owner course</td></tr>
<tr><td>Student — Section</td><td>M-N via Enrollment</td><td>a student enrols in many sections; a section has many students</td></tr>
</tbody>
</table>
<pre><code class="language-plaintext">[Course] courseCode* ── N ──&lt;requires&gt;── M ── [Course] (recursive: Prerequisite table, roles "course" / "prerequisite")
   │ 1
&lt;runs as&gt;
   │ N
[[Section]] semester+sectionNo (partial), room
   │ N                                    │ 1
&lt;enrolls (grade)&gt;                      &lt;teaches&gt;
   │ M                                    │ N
[Student]                            [Instructor]</code></pre>
<p>Program(<u>programCode</u>, name) · Course(<u>courseCode</u>, courseName, programCode → Program) · Prerequisite(<u>courseCode</u>, <u>preCode</u>) both → Course · Instructor(<u>instructorID</u>, fullName) · Section(<u>courseCode</u>, <u>semester</u>, <u>sectionNo</u>, instructorID → Instructor, room) · Student(<u>studentID</u>, fullName) · Enrollment(<u>courseCode</u>, <u>semester</u>, <u>sectionNo</u>, <u>studentID</u>, grade)</p>
<pre><code class="language-sql">CREATE TABLE Program (
  programCode  CHAR(6)      PRIMARY KEY,
  name         NVARCHAR(80) NOT NULL
);
CREATE TABLE Course (
  courseCode   CHAR(6)      PRIMARY KEY,
  courseName   NVARCHAR(80) NOT NULL,
  programCode  CHAR(6)      NOT NULL REFERENCES Program(programCode)
);
CREATE TABLE Prerequisite (                                        -- recursive M-N on Course
  courseCode   CHAR(6) REFERENCES Course(courseCode),
  preCode      CHAR(6) REFERENCES Course(courseCode),               -- another Course row: the prerequisite
  CHECK (courseCode &lt;&gt; preCode),
  PRIMARY KEY (courseCode, preCode)
);
CREATE TABLE Instructor (
  instructorID CHAR(6)      PRIMARY KEY,
  fullName     NVARCHAR(50) NOT NULL
);
CREATE TABLE Section (                                              -- weak entity: partial key (semester, sectionNo)
  courseCode   CHAR(6) NOT NULL REFERENCES Course(courseCode),
  semester     CHAR(6) NOT NULL,
  sectionNo    INT     NOT NULL,
  instructorID CHAR(6) NOT NULL REFERENCES Instructor(instructorID),
  room         VARCHAR(10),
  PRIMARY KEY (courseCode, semester, sectionNo)
);
CREATE TABLE Student (
  studentID    CHAR(8)      PRIMARY KEY,
  fullName     NVARCHAR(50) NOT NULL
);
CREATE TABLE Enrollment (                                           -- M-N Student-Section
  courseCode   CHAR(6),
  semester     CHAR(6),
  sectionNo    INT,
  studentID    CHAR(8) REFERENCES Student(studentID),
  grade        DECIMAL(3,1) NULL CHECK (grade IS NULL OR grade BETWEEN 0 AND 10),
  PRIMARY KEY (courseCode, semester, sectionNo, studentID),
  FOREIGN KEY (courseCode, semester, sectionNo) REFERENCES Section(courseCode, semester, sectionNo)
);</code></pre>
<div class="out">(1 row affected)<br>
(3 rows affected)<br>
(2 rows affected)<br>
(1 row affected)<br>
(2 rows affected)<br>
(1 row affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>table_name</th><th>cols</th><th>fks</th></tr></thead>
<tbody>
<tr><td>Course</td><td>3</td><td>1</td></tr>
<tr><td>Enrollment</td><td>5</td><td>2</td></tr>
<tr><td>Instructor</td><td>2</td><td>0</td></tr>
<tr><td>Prerequisite</td><td>2</td><td>2</td></tr>
<tr><td>Program</td><td>2</td><td>0</td></tr>
<tr><td>Section</td><td>5</td><td>2</td></tr>
<tr><td>Student</td><td>2</td><td>0</td></tr>
</tbody>
</table>
<p>7 tables; Prerequisite shows 2 foreign keys — both pointing at Course, which is exactly what a recursive M-N looks like once it becomes SQL (unlike case 2's recursive 1-M, which only needed 1 self-FK, a recursive M-N needs its own junction table with TWO foreign keys back to the same entity set).</p>
<div class="pitfall">A frequent mistake: giving Prerequisite only one column ("prerequisiteOf") instead of two role columns (courseCode, preCode). A relationship between an entity set and itself always needs <strong>two distinct role names</strong> in the diagram and <strong>two separate foreign key columns</strong> in the table, even though both point at the same parent table.</div>`,
    `<h3>Đề 4 — Đăng ký học phần, mở rộng: M-N đệ quy và thực thể yếu khoá ba phần (~15 phút)</h3>
<p>Một <strong>chương trình</strong> (vd Kỹ thuật phần mềm) mở nhiều <strong>môn học</strong>. Một số môn cần môn khác làm <strong>môn tiên quyết</strong> — DBI202 cần CSD201, PRJ301 cần DBI202 — và một môn có thể có nhiều môn tiên quyết (và cũng là tiên quyết của nhiều môn khác). Mỗi học kỳ, một môn thật sự chạy dưới dạng một hoặc nhiều <strong>lớp (section)</strong> (lớp 1, lớp 2…), mỗi lớp do một <strong>giảng viên</strong> dạy, ở một phòng; cùng một số hiệu lớp có thể lặp lại ở môn khác, hoặc học kỳ khác. <strong>Sinh viên</strong> đăng ký vào một lớp cụ thể và nhận điểm.</p>
<table>
<thead><tr><th>Thành phần</th><th>Quyết định</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td>Course — Course</td><td>M-N đệ quy, bảng riêng Prerequisite(courseCode, preCode)</td><td>"có thể có nhiều môn tiên quyết, và cũng là tiên quyết của nhiều môn khác" — cả hai chiều đều nhiều, và đó là Course trỏ tới Course</td></tr>
<tr><td>Section</td><td>thực thể yếu, khoá bộ phận (semester, sectionNo), chủ là Course</td><td>"cùng một số hiệu lớp có thể lặp lại ở môn khác, hoặc học kỳ khác" — khoá bộ phận một mình chưa đủ duy nhất, cần CẢ semester LẪN môn chủ</td></tr>
<tr><td>Student — Section</td><td>M-N qua Enrollment</td><td>một sinh viên đăng ký nhiều lớp; một lớp có nhiều sinh viên</td></tr>
</tbody>
</table>
<pre><code class="language-plaintext">[Course] courseCode* ── N ──&lt;requires&gt;── M ── [Course] (đệ quy: bảng Prerequisite, hai vai "môn" / "môn tiên quyết")
   │ 1
&lt;runs as&gt;
   │ N
[[Section]] semester+sectionNo (bộ phận), room
   │ N                                    │ 1
&lt;enrolls (grade)&gt;                      &lt;teaches&gt;
   │ M                                    │ N
[Student]                            [Instructor]</code></pre>
<p>Program(<u>programCode</u>, name) · Course(<u>courseCode</u>, courseName, programCode → Program) · Prerequisite(<u>courseCode</u>, <u>preCode</u>) cả hai → Course · Instructor(<u>instructorID</u>, fullName) · Section(<u>courseCode</u>, <u>semester</u>, <u>sectionNo</u>, instructorID → Instructor, room) · Student(<u>studentID</u>, fullName) · Enrollment(<u>courseCode</u>, <u>semester</u>, <u>sectionNo</u>, <u>studentID</u>, grade)</p>
<pre><code class="language-sql">CREATE TABLE Program (
  programCode  CHAR(6)      PRIMARY KEY,
  name         NVARCHAR(80) NOT NULL
);
CREATE TABLE Course (
  courseCode   CHAR(6)      PRIMARY KEY,
  courseName   NVARCHAR(80) NOT NULL,
  programCode  CHAR(6)      NOT NULL REFERENCES Program(programCode)
);
CREATE TABLE Prerequisite (                                        -- M-N đệ quy trên Course
  courseCode   CHAR(6) REFERENCES Course(courseCode),
  preCode      CHAR(6) REFERENCES Course(courseCode),               -- một dòng Course khác: môn tiên quyết
  CHECK (courseCode &lt;&gt; preCode),
  PRIMARY KEY (courseCode, preCode)
);
CREATE TABLE Instructor (
  instructorID CHAR(6)      PRIMARY KEY,
  fullName     NVARCHAR(50) NOT NULL
);
CREATE TABLE Section (                                              -- thực thể yếu: khoá bộ phận (semester, sectionNo)
  courseCode   CHAR(6) NOT NULL REFERENCES Course(courseCode),
  semester     CHAR(6) NOT NULL,
  sectionNo    INT     NOT NULL,
  instructorID CHAR(6) NOT NULL REFERENCES Instructor(instructorID),
  room         VARCHAR(10),
  PRIMARY KEY (courseCode, semester, sectionNo)
);
CREATE TABLE Student (
  studentID    CHAR(8)      PRIMARY KEY,
  fullName     NVARCHAR(50) NOT NULL
);
CREATE TABLE Enrollment (                                           -- M-N Student-Section
  courseCode   CHAR(6),
  semester     CHAR(6),
  sectionNo    INT,
  studentID    CHAR(8) REFERENCES Student(studentID),
  grade        DECIMAL(3,1) NULL CHECK (grade IS NULL OR grade BETWEEN 0 AND 10),
  PRIMARY KEY (courseCode, semester, sectionNo, studentID),
  FOREIGN KEY (courseCode, semester, sectionNo) REFERENCES Section(courseCode, semester, sectionNo)
);</code></pre>
<div class="out">(1 row affected)<br>
(3 rows affected)<br>
(2 rows affected)<br>
(1 row affected)<br>
(2 rows affected)<br>
(1 row affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>table_name</th><th>cols</th><th>fks</th></tr></thead>
<tbody>
<tr><td>Course</td><td>3</td><td>1</td></tr>
<tr><td>Enrollment</td><td>5</td><td>2</td></tr>
<tr><td>Instructor</td><td>2</td><td>0</td></tr>
<tr><td>Prerequisite</td><td>2</td><td>2</td></tr>
<tr><td>Program</td><td>2</td><td>0</td></tr>
<tr><td>Section</td><td>5</td><td>2</td></tr>
<tr><td>Student</td><td>2</td><td>0</td></tr>
</tbody>
</table>
<p>7 bảng; Prerequisite mang 2 khoá ngoại — cả hai đều trỏ vào Course, đúng hình dạng một M-N đệ quy khi thành SQL (khác đề 2, liên kết 1-M đệ quy chỉ cần 1 khoá ngoại tự trỏ; một M-N đệ quy cần bảng nối riêng với HAI khoá ngoại cùng trỏ về một tập thực thể).</p>
<div class="pitfall">Lỗi hay gặp: cho Prerequisite chỉ một cột ("prerequisiteOf") thay vì hai cột vai trò (courseCode, preCode). Một liên kết giữa một tập thực thể với chính nó luôn cần <strong>hai tên vai trò khác nhau</strong> trên sơ đồ và <strong>hai cột khoá ngoại riêng</strong> trong bảng, dù cả hai đều trỏ về cùng một bảng cha.</div>`),
    bi(`<h3>Case 5 — Hospital: a subclass hierarchy AND a recursive relationship together (~20 min)</h3>
<p>A hospital's <strong>departments</strong> employ <strong>staff</strong>. Every staff member has an ID, a name and a department; some staff <strong>supervise</strong> other staff (each staff has at most one direct supervisor, who is also staff). Staff are further split into two kinds that have different extra facts: <strong>doctors</strong> (a specialty) and <strong>nurses</strong> (a shift). A <strong>patient</strong> books an <strong>appointment</strong> with a specific doctor, in a specific room, at a specific time. During an appointment a doctor may write a <strong>prescription</strong> for one or more <strong>medicines</strong>, each with its own dosage instructions.</p>
<table>
<thead><tr><th>Element</th><th>Decision</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Staff → Staff</td><td>recursive 1-M, self FK supervisorID (nullable)</td><td>"at most one direct supervisor" — 1 on the supervisor side; NULL = top of the hierarchy</td></tr>
<tr><td>Staff → Doctor / Nurse</td><td>subclass (isa), disjoint (a staff member is exactly one of the two here)</td><td>"split into two kinds that have different extra facts" — each subclass gets its own table sharing the parent's key</td></tr>
<tr><td>Appointment</td><td>one relationship connecting THREE entity sets at once: Doctor, Patient, Room</td><td>"with a specific doctor, in a specific room, at a specific time" all in the SAME event — breaking this into three separate binary relationships would lose which doctor saw which patient in which room together</td></tr>
<tr><td>Prescription</td><td>M-N Appointment–Medicine, with dosage</td><td>one appointment can prescribe several medicines; conceptually the same medicine could appear in many appointments</td></tr>
</tbody>
</table>
<pre><code class="language-plaintext">[Department] ══ 1 ══&lt;&lt;employs&gt;&gt;══ N ══ [Staff] staffID*, fullName, supervisorID → Staff (recursive)
                                            │ isa
                                  ┌─────────┴─────────┐
                            [Doctor] specialty   [Nurse] shift

[Doctor] ── ┐
[Patient]── ├──&lt;Appointment (apptTime)&gt;   (ternary: 3 entity sets meet at once)
[Room]  ── ┘
   │ 1
&lt;prescribes&gt;
   │ N
[Medicine] ── M ──&lt;Prescription (dosage)&gt;── N ── Appointment</code></pre>
<p>Department(<u>deptID</u>, name) · Staff(<u>staffID</u>, fullName, deptID → Department, supervisorID → Staff) · Doctor(<u>staffID</u> → Staff, specialty) · Nurse(<u>staffID</u> → Staff, shift) · Patient(<u>patientID</u>, fullName) · Room(<u>roomNo</u>, deptID → Department) · Appointment(<u>apptID</u>, staffID → Doctor, patientID → Patient, roomNo → Room, apptTime) · Medicine(<u>medicineID</u>, name) · Prescription(<u>apptID</u>, <u>medicineID</u>, dosage)</p>
<pre><code class="language-sql">CREATE TABLE Department (
  deptID       INT IDENTITY PRIMARY KEY,
  name         NVARCHAR(50) NOT NULL
);
CREATE TABLE Staff (                                                -- superclass
  staffID      CHAR(6)      PRIMARY KEY,
  fullName     NVARCHAR(50) NOT NULL,
  deptID       INT NOT NULL REFERENCES Department(deptID),
  supervisorID CHAR(6) NULL REFERENCES Staff(staffID)                -- recursive self-FK: this staff's supervisor
);
CREATE TABLE Doctor (                                                -- subclass: table-per-subclass
  staffID      CHAR(6) PRIMARY KEY REFERENCES Staff(staffID),
  specialty    NVARCHAR(50) NOT NULL
);
CREATE TABLE Nurse (
  staffID      CHAR(6) PRIMARY KEY REFERENCES Staff(staffID),
  shift        VARCHAR(10) NOT NULL CHECK (shift IN ('morning','afternoon','night'))
);
CREATE TABLE Patient (
  patientID    CHAR(8)      PRIMARY KEY,
  fullName     NVARCHAR(50) NOT NULL
);
CREATE TABLE Room (
  roomNo       INT PRIMARY KEY,
  deptID       INT NOT NULL REFERENCES Department(deptID)
);
CREATE TABLE Appointment (                                           -- ternary: Doctor, Patient, Room together
  apptID       INT IDENTITY PRIMARY KEY,
  staffID      CHAR(6) NOT NULL REFERENCES Doctor(staffID),
  patientID    CHAR(8) NOT NULL REFERENCES Patient(patientID),
  roomNo       INT     NOT NULL REFERENCES Room(roomNo),
  apptTime     DATETIME NOT NULL
);
CREATE TABLE Medicine (
  medicineID   INT IDENTITY PRIMARY KEY,
  name         NVARCHAR(50) NOT NULL
);
CREATE TABLE Prescription (                                          -- M-N Appointment-Medicine, with attribute
  apptID       INT REFERENCES Appointment(apptID),
  medicineID   INT REFERENCES Medicine(medicineID),
  dosage       NVARCHAR(30) NOT NULL,
  PRIMARY KEY (apptID, medicineID)
);</code></pre>
<div class="out">(2 rows affected)<br>
(1 row affected)<br>
(2 rows affected)<br>
(2 rows affected)<br>
(1 row affected)<br>
(1 row affected)<br>
(2 rows affected)<br>
(1 row affected)<br>
(2 rows affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>table_name</th><th>cols</th><th>fks</th></tr></thead>
<tbody>
<tr><td>Appointment</td><td>5</td><td>3</td></tr>
<tr><td>Department</td><td>2</td><td>0</td></tr>
<tr><td>Doctor</td><td>2</td><td>1</td></tr>
<tr><td>Medicine</td><td>2</td><td>0</td></tr>
<tr><td>Nurse</td><td>2</td><td>1</td></tr>
<tr><td>Patient</td><td>2</td><td>0</td></tr>
<tr><td>Prescription</td><td>3</td><td>2</td></tr>
<tr><td>Room</td><td>2</td><td>1</td></tr>
<tr><td>Staff</td><td>4</td><td>2</td></tr>
</tbody>
</table>
<p>9 tables; Appointment shows 3 foreign keys — the direct SQL signature of a ternary relationship (a binary relationship's table has 2).</p>
<div class="pitfall">A doctor is stored TWICE across two tables — once as a row in Staff (shared facts: name, department, supervisor) and once as a row in Doctor (specialty only) sharing the same staffID as its primary key. Students who "flatten" this into one Staff table with a nullable <code>specialty</code> column AND a nullable <code>shift</code> column lose the CHECK-level guarantee that a nurse never has a specialty and a doctor never has a shift — that guarantee is exactly what lesson 3.5's exercise 5 called the trade-off between the two ways to store a subclass.</div>`,
    `<h3>Đề 5 — Bệnh viện: phân cấp lớp con VÀ liên kết đệ quy cùng lúc (~20 phút)</h3>
<p>Các <strong>khoa</strong> của bệnh viện tuyển <strong>nhân viên</strong>. Mỗi nhân viên có mã, tên, và một khoa; một số nhân viên <strong>giám sát</strong> nhân viên khác (mỗi nhân viên có tối đa một người giám sát trực tiếp, cũng là nhân viên). Nhân viên chia thành hai loại có thông tin riêng khác nhau: <strong>bác sĩ</strong> (chuyên khoa) và <strong>y tá</strong> (ca trực). Một <strong>bệnh nhân</strong> đặt một <strong>lịch khám</strong> với một bác sĩ cụ thể, tại một phòng cụ thể, vào một giờ cụ thể. Trong lượt khám, bác sĩ có thể kê một <strong>đơn thuốc</strong> gồm một hoặc nhiều <strong>loại thuốc</strong>, mỗi loại có liều dùng riêng.</p>
<table>
<thead><tr><th>Thành phần</th><th>Quyết định</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td>Staff → Staff</td><td>1-M đệ quy, khoá ngoại tự trỏ supervisorID (cho phép NULL)</td><td>"tối đa một người giám sát trực tiếp" — 1 ở phía người giám sát; NULL = đỉnh phân cấp</td></tr>
<tr><td>Staff → Doctor / Nurse</td><td>lớp con (isa), tách rời (một nhân viên ở đây đúng một trong hai loại)</td><td>"chia thành hai loại có thông tin riêng khác nhau" — mỗi lớp con có bảng riêng, dùng chung khoá của lớp cha</td></tr>
<tr><td>Appointment</td><td>một liên kết nối CẢ BA tập thực thể cùng lúc: Doctor, Patient, Room</td><td>"với một bác sĩ cụ thể, tại một phòng cụ thể, vào một giờ cụ thể" đều trong CÙNG một sự kiện — tách thành ba liên kết đôi riêng sẽ mất thông tin bác sĩ nào khám bệnh nhân nào ở phòng nào CÙNG lúc</td></tr>
<tr><td>Prescription</td><td>M-N Appointment–Medicine, có dosage</td><td>một lượt khám kê được nhiều loại thuốc; cùng một loại thuốc về khái niệm xuất hiện được ở nhiều lượt khám</td></tr>
</tbody>
</table>
<pre><code class="language-plaintext">[Department] ══ 1 ══&lt;&lt;employs&gt;&gt;══ N ══ [Staff] staffID*, fullName, supervisorID → Staff (đệ quy)
                                            │ isa
                                  ┌─────────┴─────────┐
                            [Doctor] specialty   [Nurse] shift

[Doctor] ── ┐
[Patient]── ├──&lt;Appointment (apptTime)&gt;   (ba ngôi: 3 tập thực thể gặp nhau cùng lúc)
[Room]  ── ┘
   │ 1
&lt;prescribes&gt;
   │ N
[Medicine] ── M ──&lt;Prescription (dosage)&gt;── N ── Appointment</code></pre>
<p>Department(<u>deptID</u>, name) · Staff(<u>staffID</u>, fullName, deptID → Department, supervisorID → Staff) · Doctor(<u>staffID</u> → Staff, specialty) · Nurse(<u>staffID</u> → Staff, shift) · Patient(<u>patientID</u>, fullName) · Room(<u>roomNo</u>, deptID → Department) · Appointment(<u>apptID</u>, staffID → Doctor, patientID → Patient, roomNo → Room, apptTime) · Medicine(<u>medicineID</u>, name) · Prescription(<u>apptID</u>, <u>medicineID</u>, dosage)</p>
<pre><code class="language-sql">CREATE TABLE Department (
  deptID       INT IDENTITY PRIMARY KEY,
  name         NVARCHAR(50) NOT NULL
);
CREATE TABLE Staff (                                                -- lớp cha
  staffID      CHAR(6)      PRIMARY KEY,
  fullName     NVARCHAR(50) NOT NULL,
  deptID       INT NOT NULL REFERENCES Department(deptID),
  supervisorID CHAR(6) NULL REFERENCES Staff(staffID)                -- khoá ngoại đệ quy: người giám sát
);
CREATE TABLE Doctor (                                                -- lớp con: một bảng riêng cho lớp con
  staffID      CHAR(6) PRIMARY KEY REFERENCES Staff(staffID),
  specialty    NVARCHAR(50) NOT NULL
);
CREATE TABLE Nurse (
  staffID      CHAR(6) PRIMARY KEY REFERENCES Staff(staffID),
  shift        VARCHAR(10) NOT NULL CHECK (shift IN ('morning','afternoon','night'))
);
CREATE TABLE Patient (
  patientID    CHAR(8)      PRIMARY KEY,
  fullName     NVARCHAR(50) NOT NULL
);
CREATE TABLE Room (
  roomNo       INT PRIMARY KEY,
  deptID       INT NOT NULL REFERENCES Department(deptID)
);
CREATE TABLE Appointment (                                           -- ba ngôi: Doctor, Patient, Room cùng lúc
  apptID       INT IDENTITY PRIMARY KEY,
  staffID      CHAR(6) NOT NULL REFERENCES Doctor(staffID),
  patientID    CHAR(8) NOT NULL REFERENCES Patient(patientID),
  roomNo       INT     NOT NULL REFERENCES Room(roomNo),
  apptTime     DATETIME NOT NULL
);
CREATE TABLE Medicine (
  medicineID   INT IDENTITY PRIMARY KEY,
  name         NVARCHAR(50) NOT NULL
);
CREATE TABLE Prescription (                                          -- M-N Appointment-Medicine, có thuộc tính
  apptID       INT REFERENCES Appointment(apptID),
  medicineID   INT REFERENCES Medicine(medicineID),
  dosage       NVARCHAR(30) NOT NULL,
  PRIMARY KEY (apptID, medicineID)
);</code></pre>
<div class="out">(2 rows affected)<br>
(1 row affected)<br>
(2 rows affected)<br>
(2 rows affected)<br>
(1 row affected)<br>
(1 row affected)<br>
(2 rows affected)<br>
(1 row affected)<br>
(2 rows affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>table_name</th><th>cols</th><th>fks</th></tr></thead>
<tbody>
<tr><td>Appointment</td><td>5</td><td>3</td></tr>
<tr><td>Department</td><td>2</td><td>0</td></tr>
<tr><td>Doctor</td><td>2</td><td>1</td></tr>
<tr><td>Medicine</td><td>2</td><td>0</td></tr>
<tr><td>Nurse</td><td>2</td><td>1</td></tr>
<tr><td>Patient</td><td>2</td><td>0</td></tr>
<tr><td>Prescription</td><td>3</td><td>2</td></tr>
<tr><td>Room</td><td>2</td><td>1</td></tr>
<tr><td>Staff</td><td>4</td><td>2</td></tr>
</tbody>
</table>
<p>9 bảng; Appointment mang 3 khoá ngoại — đúng dấu hiệu SQL trực tiếp của một liên kết ba ngôi (bảng của một liên kết hai ngôi chỉ có 2).</p>
<div class="pitfall">Một bác sĩ được lưu HAI LẦN ở hai bảng — một lần là dòng trong Staff (thông tin chung: tên, khoa, người giám sát) và một lần là dòng trong Doctor (chỉ chuyên khoa) dùng chung staffID làm khoá chính. Sinh viên "dồn phẳng" thành một bảng Staff với cột <code>specialty</code> cho phép NULL VÀ cột <code>shift</code> cho phép NULL sẽ mất đảm bảo mức CHECK rằng y tá không bao giờ có chuyên khoa và bác sĩ không bao giờ có ca trực — đúng đánh đổi bài 5 của bài 3.5 từng nêu giữa hai cách lưu lớp con.</div>`),
    bi(`<h3>Case 6 — Cinema: a weak entity chained twice, plus a ternary ticket (~20 min)</h3>
<p>A <strong>cinema</strong> has several <strong>halls</strong>, numbered inside that cinema; each hall has a fixed number of <strong>seats</strong>, numbered inside that hall (A1, A2…), the same seat number appearing in every hall. A <strong>movie</strong> belongs to one or more <strong>genres</strong>. A <strong>showtime</strong> is a specific movie, in a specific hall, at a specific date and time — the same hall can show different movies at different times, and (rare, but possible on a slow day) the schedule never lets one hall show two different movies at the exact same timestamp. A <strong>customer buys a ticket</strong> for one seat, for one showtime.</p>
<table>
<thead><tr><th>Element</th><th>Decision</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Seat</td><td>weak entity, partial key seatNo, owner Hall</td><td>"numbered inside that hall… the same seat number appearing in every hall" — the classic weak-entity phrasing, chained onto another entity (Hall) that is itself only unique inside a Cinema</td></tr>
<tr><td>Showtime</td><td>weak entity, partial key showTime, owner Hall (not Movie)</td><td>"the same hall can show different movies at different times… one hall show two different movies at the exact same timestamp" never happens — the uniqueness rule is about (hall, time), so Hall is the owner; movieID is just an extra attribute-like foreign key, not part of what makes a showtime unique</td></tr>
<tr><td>Ticket</td><td>ternary-shaped: references Seat AND Showtime AND Customer together, with a UNIQUE constraint so the same seat/showtime cannot be sold twice</td><td>"buys a ticket for one seat, for one showtime" — but the true business rule that needs enforcing is "not the same seat at the same showtime twice", which a UNIQUE constraint states directly</td></tr>
</tbody>
</table>
<pre><code class="language-plaintext">[Cinema] ══ 1 ══&lt;&lt;has&gt;&gt;══ N ══ [Hall] hallNo (partial), seatCount
[[Hall]] ══ 1 ══&lt;&lt;contains&gt;&gt;══ N ══ [[Seat]] seatNo (partial)
[[Hall]] ══ 1 ══&lt;&lt;schedules&gt;&gt;══ N ══ [[Showtime]] showTime (partial) ── N ──&lt;movieID→Movie&gt;
[Movie] ── N ──&lt;MovieGenre&gt;── M ── [Genre]
[Seat] ── ┐
[Showtime] ── ├──&lt;Ticket (price)&gt;   [Customer]</code></pre>
<p>Cinema(<u>cinemaID</u>, city) · Hall(<u>cinemaID</u>, <u>hallNo</u>, seatCount) · Seat(<u>cinemaID</u>, <u>hallNo</u>, <u>seatNo</u>) · Movie(<u>movieID</u>, title, duration) · Genre(<u>genreID</u>, name) · MovieGenre(<u>movieID</u>, <u>genreID</u>) · Showtime(<u>cinemaID</u>, <u>hallNo</u>, <u>showTime</u>, movieID → Movie) · Customer(<u>customerID</u>, fullName) · Ticket(<u>ticketID</u>, cinemaID+hallNo+seatNo → Seat, cinemaID+hallNo+showTime → Showtime, customerID → Customer, price, UNIQUE(cinemaID, hallNo, seatNo, showTime))</p>
<pre><code class="language-sql">CREATE TABLE Cinema (
  cinemaID   INT IDENTITY PRIMARY KEY,
  city       NVARCHAR(50) NOT NULL
);
CREATE TABLE Hall (
  cinemaID   INT NOT NULL REFERENCES Cinema(cinemaID),
  hallNo     INT NOT NULL,                                        -- unique only within one cinema
  seatCount  INT NOT NULL,
  PRIMARY KEY (cinemaID, hallNo)
);
CREATE TABLE Seat (                                                -- weak entity: partial key seatNo
  cinemaID   INT NOT NULL,
  hallNo     INT NOT NULL,
  seatNo     VARCHAR(5) NOT NULL,                                  -- e.g. 'A1'
  PRIMARY KEY (cinemaID, hallNo, seatNo),
  FOREIGN KEY (cinemaID, hallNo) REFERENCES Hall(cinemaID, hallNo)
);
CREATE TABLE Movie (
  movieID    INT IDENTITY PRIMARY KEY,
  title      NVARCHAR(100) NOT NULL,
  duration   INT NOT NULL CHECK (duration &gt; 0)
);
CREATE TABLE Genre (
  genreID    INT IDENTITY PRIMARY KEY,
  name       NVARCHAR(30) NOT NULL
);
CREATE TABLE MovieGenre (                                          -- M-N Movie-Genre = multivalued genre
  movieID    INT REFERENCES Movie(movieID),
  genreID    INT REFERENCES Genre(genreID),
  PRIMARY KEY (movieID, genreID)
);
CREATE TABLE Showtime (                                            -- weak entity: partial key showTime
  cinemaID   INT NOT NULL,
  hallNo     INT NOT NULL,
  movieID    INT NOT NULL REFERENCES Movie(movieID),
  showTime   DATETIME NOT NULL,
  PRIMARY KEY (cinemaID, hallNo, showTime),
  FOREIGN KEY (cinemaID, hallNo) REFERENCES Hall(cinemaID, hallNo)
);
CREATE TABLE Customer (
  customerID INT IDENTITY PRIMARY KEY,
  fullName   NVARCHAR(50) NOT NULL
);
CREATE TABLE Ticket (                                              -- ternary: Customer, Seat, Showtime together
  ticketID   INT IDENTITY PRIMARY KEY,
  cinemaID   INT NOT NULL,
  hallNo     INT NOT NULL,
  seatNo     VARCHAR(5)  NOT NULL,
  showTime   DATETIME    NOT NULL,
  customerID INT NOT NULL REFERENCES Customer(customerID),
  price      DECIMAL(12,0) NOT NULL,
  FOREIGN KEY (cinemaID, hallNo, seatNo)   REFERENCES Seat(cinemaID, hallNo, seatNo),
  FOREIGN KEY (cinemaID, hallNo, showTime) REFERENCES Showtime(cinemaID, hallNo, showTime),
  UNIQUE (cinemaID, hallNo, seatNo, showTime)                       -- one seat, one showtime, sold once
);</code></pre>
<div class="out">(1 row affected)<br>
(1 row affected)<br>
(4 rows affected)<br>
(1 row affected)<br>
(2 rows affected)<br>
(2 rows affected)<br>
(1 row affected)<br>
(1 row affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>table_name</th><th>cols</th><th>fks</th></tr></thead>
<tbody>
<tr><td>Cinema</td><td>2</td><td>0</td></tr>
<tr><td>Customer</td><td>2</td><td>0</td></tr>
<tr><td>Genre</td><td>2</td><td>0</td></tr>
<tr><td>Hall</td><td>3</td><td>1</td></tr>
<tr><td>Movie</td><td>3</td><td>0</td></tr>
<tr><td>MovieGenre</td><td>2</td><td>2</td></tr>
<tr><td>Seat</td><td>3</td><td>1</td></tr>
<tr><td>Showtime</td><td>4</td><td>2</td></tr>
<tr><td>Ticket</td><td>7</td><td>3</td></tr>
</tbody>
</table>
<p>9 tables; Ticket shows 3 foreign keys (to Seat, to Showtime, to Customer) — again the ternary signature — even though Ticket itself is not the classic diamond-shaped ternary relationship of case 5, it is a table doing the same job: tying three entity sets to one event.</p>
<div class="pitfall">Two separate weak entities chained one after another (Seat under Hall, Showtime also under Hall) trips up students who try to give Seat a partial key of just seatNo and Showtime a partial key of just showTime, then reference them from Ticket with only ONE column each. Every level of a weak-entity chain must carry the FULL partial key of every ancestor — Seat's real key is (cinemaID, hallNo, seatNo), not just seatNo — exactly the composite-foreign-key trap flagged in lesson 3.5's exercise 2.</div>`,
    `<h3>Đề 6 — Rạp chiếu phim: thực thể yếu lồng hai tầng, cộng vé ba ngôi (~20 phút)</h3>
<p>Một <strong>rạp</strong> có nhiều <strong>phòng chiếu</strong>, đánh số trong phạm vi rạp đó; mỗi phòng có số <strong>ghế</strong> cố định, đánh số trong phạm vi phòng đó (A1, A2…), cùng một số ghế xuất hiện ở mọi phòng. Một <strong>phim</strong> thuộc một hoặc nhiều <strong>thể loại</strong>. Một <strong>suất chiếu</strong> là một phim cụ thể, ở một phòng cụ thể, vào một ngày giờ cụ thể — cùng một phòng có thể chiếu phim khác nhau vào giờ khác nhau, và (hiếm, nhưng có thể) lịch chiếu không bao giờ để một phòng chiếu hai phim khác nhau đúng cùng một mốc giờ. Một <strong>khách hàng mua vé</strong> cho một ghế, cho một suất chiếu.</p>
<table>
<thead><tr><th>Thành phần</th><th>Quyết định</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td>Seat</td><td>thực thể yếu, khoá bộ phận seatNo, chủ là Hall</td><td>"đánh số trong phạm vi phòng đó… cùng một số ghế xuất hiện ở mọi phòng" — đúng cách diễn đạt kinh điển của thực thể yếu, lồng lên một thực thể khác (Hall) mà bản thân nó cũng chỉ duy nhất trong phạm vi một Cinema</td></tr>
<tr><td>Showtime</td><td>thực thể yếu, khoá bộ phận showTime, chủ là Hall (không phải Movie)</td><td>"cùng một phòng có thể chiếu phim khác nhau vào giờ khác nhau… một phòng chiếu hai phim khác nhau đúng cùng một mốc giờ" không bao giờ xảy ra — luật duy nhất nằm ở (phòng, giờ), nên Hall là chủ; movieID chỉ là một khoá ngoại giống thuộc tính thêm vào, không phải phần làm nên tính duy nhất của suất chiếu</td></tr>
<tr><td>Ticket</td><td>có hình dạng ba ngôi: trỏ tới Seat VÀ Showtime VÀ Customer cùng lúc, có ràng buộc UNIQUE để cùng ghế/cùng suất không bán được hai lần</td><td>"mua vé cho một ghế, cho một suất chiếu" — nhưng luật nghiệp vụ thật cần ép buộc là "không cùng ghế cùng suất hai lần", một ràng buộc UNIQUE nói thẳng điều đó</td></tr>
</tbody>
</table>
<pre><code class="language-plaintext">[Cinema] ══ 1 ══&lt;&lt;has&gt;&gt;══ N ══ [Hall] hallNo (bộ phận), seatCount
[[Hall]] ══ 1 ══&lt;&lt;contains&gt;&gt;══ N ══ [[Seat]] seatNo (bộ phận)
[[Hall]] ══ 1 ══&lt;&lt;schedules&gt;&gt;══ N ══ [[Showtime]] showTime (bộ phận) ── N ──&lt;movieID→Movie&gt;
[Movie] ── N ──&lt;MovieGenre&gt;── M ── [Genre]
[Seat] ── ┐
[Showtime] ── ├──&lt;Ticket (price)&gt;   [Customer]</code></pre>
<p>Cinema(<u>cinemaID</u>, city) · Hall(<u>cinemaID</u>, <u>hallNo</u>, seatCount) · Seat(<u>cinemaID</u>, <u>hallNo</u>, <u>seatNo</u>) · Movie(<u>movieID</u>, title, duration) · Genre(<u>genreID</u>, name) · MovieGenre(<u>movieID</u>, <u>genreID</u>) · Showtime(<u>cinemaID</u>, <u>hallNo</u>, <u>showTime</u>, movieID → Movie) · Customer(<u>customerID</u>, fullName) · Ticket(<u>ticketID</u>, cinemaID+hallNo+seatNo → Seat, cinemaID+hallNo+showTime → Showtime, customerID → Customer, price, UNIQUE(cinemaID, hallNo, seatNo, showTime))</p>
<pre><code class="language-sql">CREATE TABLE Cinema (
  cinemaID   INT IDENTITY PRIMARY KEY,
  city       NVARCHAR(50) NOT NULL
);
CREATE TABLE Hall (
  cinemaID   INT NOT NULL REFERENCES Cinema(cinemaID),
  hallNo     INT NOT NULL,                                        -- chỉ duy nhất trong một rạp
  seatCount  INT NOT NULL,
  PRIMARY KEY (cinemaID, hallNo)
);
CREATE TABLE Seat (                                                -- thực thể yếu: khoá bộ phận seatNo
  cinemaID   INT NOT NULL,
  hallNo     INT NOT NULL,
  seatNo     VARCHAR(5) NOT NULL,                                  -- vd 'A1'
  PRIMARY KEY (cinemaID, hallNo, seatNo),
  FOREIGN KEY (cinemaID, hallNo) REFERENCES Hall(cinemaID, hallNo)
);
CREATE TABLE Movie (
  movieID    INT IDENTITY PRIMARY KEY,
  title      NVARCHAR(100) NOT NULL,
  duration   INT NOT NULL CHECK (duration &gt; 0)
);
CREATE TABLE Genre (
  genreID    INT IDENTITY PRIMARY KEY,
  name       NVARCHAR(30) NOT NULL
);
CREATE TABLE MovieGenre (                                          -- M-N Movie-Genre = thể loại đa trị
  movieID    INT REFERENCES Movie(movieID),
  genreID    INT REFERENCES Genre(genreID),
  PRIMARY KEY (movieID, genreID)
);
CREATE TABLE Showtime (                                            -- thực thể yếu: khoá bộ phận showTime
  cinemaID   INT NOT NULL,
  hallNo     INT NOT NULL,
  movieID    INT NOT NULL REFERENCES Movie(movieID),
  showTime   DATETIME NOT NULL,
  PRIMARY KEY (cinemaID, hallNo, showTime),
  FOREIGN KEY (cinemaID, hallNo) REFERENCES Hall(cinemaID, hallNo)
);
CREATE TABLE Customer (
  customerID INT IDENTITY PRIMARY KEY,
  fullName   NVARCHAR(50) NOT NULL
);
CREATE TABLE Ticket (                                              -- ba ngôi: Customer, Seat, Showtime cùng lúc
  ticketID   INT IDENTITY PRIMARY KEY,
  cinemaID   INT NOT NULL,
  hallNo     INT NOT NULL,
  seatNo     VARCHAR(5)  NOT NULL,
  showTime   DATETIME    NOT NULL,
  customerID INT NOT NULL REFERENCES Customer(customerID),
  price      DECIMAL(12,0) NOT NULL,
  FOREIGN KEY (cinemaID, hallNo, seatNo)   REFERENCES Seat(cinemaID, hallNo, seatNo),
  FOREIGN KEY (cinemaID, hallNo, showTime) REFERENCES Showtime(cinemaID, hallNo, showTime),
  UNIQUE (cinemaID, hallNo, seatNo, showTime)                       -- một ghế, một suất, bán một lần
);</code></pre>
<div class="out">(1 row affected)<br>
(1 row affected)<br>
(4 rows affected)<br>
(1 row affected)<br>
(2 rows affected)<br>
(2 rows affected)<br>
(1 row affected)<br>
(1 row affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>table_name</th><th>cols</th><th>fks</th></tr></thead>
<tbody>
<tr><td>Cinema</td><td>2</td><td>0</td></tr>
<tr><td>Customer</td><td>2</td><td>0</td></tr>
<tr><td>Genre</td><td>2</td><td>0</td></tr>
<tr><td>Hall</td><td>3</td><td>1</td></tr>
<tr><td>Movie</td><td>3</td><td>0</td></tr>
<tr><td>MovieGenre</td><td>2</td><td>2</td></tr>
<tr><td>Seat</td><td>3</td><td>1</td></tr>
<tr><td>Showtime</td><td>4</td><td>2</td></tr>
<tr><td>Ticket</td><td>7</td><td>3</td></tr>
</tbody>
</table>
<p>9 bảng; Ticket mang 3 khoá ngoại (tới Seat, tới Showtime, tới Customer) — lại đúng dấu hiệu ba ngôi — dù bản thân Ticket không phải hình thoi ba ngôi kinh điển như đề 5, nó là một bảng làm đúng việc: buộc ba tập thực thể vào một sự kiện.</p>
<div class="pitfall">Hai thực thể yếu lồng liên tiếp (Seat dưới Hall, Showtime cũng dưới Hall) làm sinh viên hay bị vấp khi cho Seat khoá bộ phận chỉ là seatNo và Showtime khoá bộ phận chỉ là showTime, rồi tham chiếu chúng từ Ticket bằng đúng MỘT cột mỗi cái. Mỗi tầng của một chuỗi thực thể yếu phải mang ĐỦ khoá bộ phận của MỌI tổ tiên — khoá thật của Seat là (cinemaID, hallNo, seatNo), không chỉ seatNo — đúng bẫy khoá ngoại ghép bài 2 của bài 3.5 đã cảnh báo.</div>`),
    bi(`<h3>Case 7 — Delivery: a recursive M-N (directed, not symmetric) and a weak entity as an event log (~15 min)</h3>
<p>A logistics company has <strong>warehouses</strong>. Some pairs of warehouses have a direct <strong>route</strong> between them with a known distance — the route from Hanoi to Danang is a different fact from the route from Danang to Hanoi (different truck, possibly different distance by road). A <strong>customer</strong>'s <strong>package</strong> is carried by one <strong>shipper</strong> and, as it moves, the system records a numbered sequence of <strong>tracking events</strong> ("received at Hanoi", "in transit to Danang", "delivered") — each event belongs to exactly one package and is numbered only within that package's own history.</p>
<table>
<thead><tr><th>Element</th><th>Decision</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Warehouse — Warehouse</td><td>recursive M-N, own table Route(fromWarehouse, toWarehouse, distanceKm)</td><td>"different fact from the route... [the other way]" — unlike case 8's symmetric friendship below, THIS recursive relationship is directed: (A,B) and (B,A) are two different rows, not one</td></tr>
<tr><td>TrackingEvent</td><td>weak entity, partial key seqNo, owner Package</td><td>"numbered only within that package's own history" — the standard weak-entity phrasing again, this time modelling an ordered LOG rather than a physical sub-part</td></tr>
</tbody>
</table>
<pre><code class="language-plaintext">[Warehouse] ── N ──&lt;Route (distanceKm)&gt;── N ── [Warehouse]   (recursive, DIRECTED: (A,B) ≠ (B,A))
[Customer]                    [Shipper]
    │ 1                          │ 1
 &lt;places&gt;                    &lt;carries&gt;
    │ N                          │ N
        [Package] ── ── ── ── ──
              │ 1
           &lt;logs&gt;
              │ N
        [[TrackingEvent]] seqNo (partial), warehouseID → Warehouse, status, eventTime</code></pre>
<p>Warehouse(<u>warehouseID</u>, city) · Route(<u>fromWarehouse</u>, <u>toWarehouse</u>) both → Warehouse, distanceKm · Shipper(<u>shipperID</u>, fullName) · Customer(<u>customerID</u>, fullName, address) · Package(<u>packageID</u>, customerID → Customer, shipperID → Shipper, weightKg) · TrackingEvent(<u>packageID</u>, <u>seqNo</u>, warehouseID → Warehouse, status, eventTime)</p>
<pre><code class="language-sql">CREATE TABLE Warehouse (
  warehouseID  INT IDENTITY PRIMARY KEY,
  city         NVARCHAR(50) NOT NULL
);
CREATE TABLE Route (                                               -- recursive M-N on Warehouse
  fromWarehouse INT REFERENCES Warehouse(warehouseID),
  toWarehouse   INT REFERENCES Warehouse(warehouseID),
  distanceKm    DECIMAL(8,1) NOT NULL CHECK (distanceKm &gt; 0),
  CHECK (fromWarehouse &lt;&gt; toWarehouse),
  PRIMARY KEY (fromWarehouse, toWarehouse)
);
CREATE TABLE Shipper (
  shipperID    CHAR(6)      PRIMARY KEY,
  fullName     NVARCHAR(50) NOT NULL
);
CREATE TABLE Customer (
  customerID   INT IDENTITY PRIMARY KEY,
  fullName     NVARCHAR(50) NOT NULL,
  address      NVARCHAR(100) NOT NULL
);
CREATE TABLE Package (
  packageID    INT IDENTITY PRIMARY KEY,
  customerID   INT NOT NULL REFERENCES Customer(customerID),
  shipperID    CHAR(6) NOT NULL REFERENCES Shipper(shipperID),
  weightKg     DECIMAL(8,2) NOT NULL CHECK (weightKg &gt; 0)
);
CREATE TABLE TrackingEvent (                                       -- weak entity: partial key seqNo
  packageID    INT NOT NULL REFERENCES Package(packageID),
  seqNo        INT NOT NULL,
  warehouseID  INT NOT NULL REFERENCES Warehouse(warehouseID),
  status       VARCHAR(20) NOT NULL CHECK (status IN ('received','in_transit','delivered')),
  eventTime    DATETIME NOT NULL,
  PRIMARY KEY (packageID, seqNo)
);</code></pre>
<div class="out">(3 rows affected)<br>
(3 rows affected)<br>
(1 row affected)<br>
(1 row affected)<br>
(1 row affected)<br>
(3 rows affected)</div>
<table>
<thead><tr><th>table_name</th><th>cols</th><th>fks</th></tr></thead>
<tbody>
<tr><td>Customer</td><td>3</td><td>0</td></tr>
<tr><td>Package</td><td>4</td><td>2</td></tr>
<tr><td>Route</td><td>3</td><td>2</td></tr>
<tr><td>Shipper</td><td>2</td><td>0</td></tr>
<tr><td>TrackingEvent</td><td>5</td><td>2</td></tr>
<tr><td>Warehouse</td><td>2</td><td>0</td></tr>
</tbody>
</table>
<p>6 tables; Route shows 2 foreign keys, both to Warehouse — structurally identical to case 4's Prerequisite, confirming that a directed recursive M-N always compiles to a junction table with two self-pointing foreign keys, whatever the domain.</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong> — identical shape; the <code>CHECK (fromWarehouse &lt;&gt; toWarehouse)</code> guarding against a warehouse routing to itself is standard SQL and needs no change. <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-4-alter-chuan-hoa">Học tiếp PostgreSQL — ràng buộc</a>.</div>
<div class="pitfall">Do not merge Route's two directions into one undirected row "the pair {A,B} has a route" — the paragraph explicitly says the two directions are different facts. Confusing a directed recursive relationship (this case) with a symmetric one (next case) is one of the most common ERD reading errors in interviews, not just exams.</div>`,
    `<h3>Đề 7 — Giao hàng: M-N đệ quy có hướng (không đối xứng) và thực thể yếu làm nhật ký sự kiện (~15 phút)</h3>
<p>Một công ty logistics có các <strong>kho</strong>. Một số cặp kho có <strong>tuyến đường</strong> trực tiếp với khoảng cách biết trước — tuyến từ Hà Nội tới Đà Nẵng là một sự kiện khác với tuyến từ Đà Nẵng tới Hà Nội (xe khác, có thể khoảng cách đường bộ khác). <strong>Kiện hàng</strong> của một <strong>khách hàng</strong> do một <strong>người giao hàng</strong> vận chuyển, và trong lúc di chuyển, hệ thống ghi lại một chuỗi đánh số các <strong>sự kiện theo dõi</strong> ("nhận tại Hà Nội", "đang chuyển tới Đà Nẵng", "đã giao") — mỗi sự kiện thuộc đúng một kiện hàng và chỉ đánh số trong phạm vi lịch sử của kiện hàng đó.</p>
<table>
<thead><tr><th>Thành phần</th><th>Quyết định</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td>Warehouse — Warehouse</td><td>M-N đệ quy, bảng riêng Route(fromWarehouse, toWarehouse, distanceKm)</td><td>"một sự kiện khác với tuyến... [chiều ngược lại]" — khác friendship đối xứng ở đề 8 bên dưới, liên kết đệ quy NÀY có hướng: (A,B) và (B,A) là hai dòng khác nhau, không phải một</td></tr>
<tr><td>TrackingEvent</td><td>thực thể yếu, khoá bộ phận seqNo, chủ là Package</td><td>"chỉ đánh số trong phạm vi lịch sử của kiện hàng đó" — lại đúng cách diễn đạt kinh điển của thực thể yếu, lần này mô hình một NHẬT KÝ có thứ tự thay vì một bộ phận vật lý</td></tr>
</tbody>
</table>
<pre><code class="language-plaintext">[Warehouse] ── N ──&lt;Route (distanceKm)&gt;── N ── [Warehouse]   (đệ quy, CÓ HƯỚNG: (A,B) ≠ (B,A))
[Customer]                    [Shipper]
    │ 1                          │ 1
 &lt;places&gt;                    &lt;carries&gt;
    │ N                          │ N
        [Package] ── ── ── ── ──
              │ 1
           &lt;logs&gt;
              │ N
        [[TrackingEvent]] seqNo (bộ phận), warehouseID → Warehouse, status, eventTime</code></pre>
<p>Warehouse(<u>warehouseID</u>, city) · Route(<u>fromWarehouse</u>, <u>toWarehouse</u>) cả hai → Warehouse, distanceKm · Shipper(<u>shipperID</u>, fullName) · Customer(<u>customerID</u>, fullName, address) · Package(<u>packageID</u>, customerID → Customer, shipperID → Shipper, weightKg) · TrackingEvent(<u>packageID</u>, <u>seqNo</u>, warehouseID → Warehouse, status, eventTime)</p>
<pre><code class="language-sql">CREATE TABLE Warehouse (
  warehouseID  INT IDENTITY PRIMARY KEY,
  city         NVARCHAR(50) NOT NULL
);
CREATE TABLE Route (                                               -- M-N đệ quy trên Warehouse
  fromWarehouse INT REFERENCES Warehouse(warehouseID),
  toWarehouse   INT REFERENCES Warehouse(warehouseID),
  distanceKm    DECIMAL(8,1) NOT NULL CHECK (distanceKm &gt; 0),
  CHECK (fromWarehouse &lt;&gt; toWarehouse),
  PRIMARY KEY (fromWarehouse, toWarehouse)
);
CREATE TABLE Shipper (
  shipperID    CHAR(6)      PRIMARY KEY,
  fullName     NVARCHAR(50) NOT NULL
);
CREATE TABLE Customer (
  customerID   INT IDENTITY PRIMARY KEY,
  fullName     NVARCHAR(50) NOT NULL,
  address      NVARCHAR(100) NOT NULL
);
CREATE TABLE Package (
  packageID    INT IDENTITY PRIMARY KEY,
  customerID   INT NOT NULL REFERENCES Customer(customerID),
  shipperID    CHAR(6) NOT NULL REFERENCES Shipper(shipperID),
  weightKg     DECIMAL(8,2) NOT NULL CHECK (weightKg &gt; 0)
);
CREATE TABLE TrackingEvent (                                       -- thực thể yếu: khoá bộ phận seqNo
  packageID    INT NOT NULL REFERENCES Package(packageID),
  seqNo        INT NOT NULL,
  warehouseID  INT NOT NULL REFERENCES Warehouse(warehouseID),
  status       VARCHAR(20) NOT NULL CHECK (status IN ('received','in_transit','delivered')),
  eventTime    DATETIME NOT NULL,
  PRIMARY KEY (packageID, seqNo)
);</code></pre>
<div class="out">(3 rows affected)<br>
(3 rows affected)<br>
(1 row affected)<br>
(1 row affected)<br>
(1 row affected)<br>
(3 rows affected)</div>
<table>
<thead><tr><th>table_name</th><th>cols</th><th>fks</th></tr></thead>
<tbody>
<tr><td>Customer</td><td>3</td><td>0</td></tr>
<tr><td>Package</td><td>4</td><td>2</td></tr>
<tr><td>Route</td><td>3</td><td>2</td></tr>
<tr><td>Shipper</td><td>2</td><td>0</td></tr>
<tr><td>TrackingEvent</td><td>5</td><td>2</td></tr>
<tr><td>Warehouse</td><td>2</td><td>0</td></tr>
</tbody>
</table>
<p>6 bảng; Route mang 2 khoá ngoại, cả hai đều tới Warehouse — giống hệt cấu trúc Prerequisite ở đề 4, xác nhận một M-N đệ quy có hướng luôn ra bảng nối với hai khoá ngoại cùng tự trỏ, bất kể lĩnh vực nào.</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> — hình dạng y hệt; <code>CHECK (fromWarehouse &lt;&gt; toWarehouse)</code> chặn kho tự trỏ tới chính nó là SQL chuẩn, không cần đổi gì. <a href="/courses/postgresql/learn?lessonSlug=postgresql-3-4-alter-chuan-hoa">Học tiếp PostgreSQL — ràng buộc</a>.</div>
<div class="pitfall">Đừng gộp hai chiều của Route thành một dòng không hướng "cặp {A,B} có tuyến đường" — đoạn đề nói rõ hai chiều là hai sự kiện khác nhau. Nhầm một liên kết đệ quy có hướng (đề này) với một liên kết đối xứng (đề sau) là một trong những lỗi đọc ERD hay gặp nhất, không chỉ trong thi mà cả phỏng vấn.</div>`),
    bi(`<h3>Case 8 — Social network: a symmetric recursive M-N, and a weak entity that is ALSO recursive (~20 min)</h3>
<p>A <strong>user</strong> can become <strong>friends</strong> with another user — friendship, unlike case 7's routes, is mutual: if A is friends with B, B is automatically friends with A, it is the same fact, not two. A user <strong>posts</strong>, and other users <strong>comment</strong> on a post, numbered within that post; a comment can itself be a <strong>reply to another comment on the same post</strong> (a reply has no meaning attached to a different post). Users can <strong>like</strong> a post, once each.</p>
<table>
<thead><tr><th>Element</th><th>Decision</th><th>Why</th></tr></thead>
<tbody>
<tr><td>User — User</td><td>recursive M-N, but SYMMETRIC — one row per unordered pair</td><td>"mutual… the same fact, not two" — the opposite of case 7; storing (A,B) already implies (B,A), so a CHECK like userID1 &lt; userID2 keeps each pair stored exactly once instead of twice</td></tr>
<tr><td>Comment</td><td>weak entity of Post (partial key commentNo) — AND, inside that, a recursive self-FK for replies</td><td>"numbered within that post" gives the weak-entity part; "a reply to another comment on the same post" adds a second idea on top: Comment referencing Comment, but constrained to stay inside the same post</td></tr>
<tr><td>Like</td><td>M-N User–Post, with a UNIQUE-style key so "once each" is enforced by the primary key itself</td><td>the primary key (userID, postID) already forbids a second identical row — no extra constraint needed</td></tr>
</tbody>
</table>
<pre><code class="language-plaintext">[User] ── N ──&lt;Friendship (status)&gt;── N ── [User]   (recursive, SYMMETRIC: one row per pair)
   │ 1
&lt;writes&gt;
   │ N
[Post] ══ 1 ══&lt;&lt;has&gt;&gt;══ N ══ [[Comment]] commentNo (partial), parentCommentNo → Comment (recursive, same post only)
[User] ── N ──&lt;Like (likedAt)&gt;── M ── [Post]</code></pre>
<p>User(<u>userID</u>, username) · Friendship(<u>userID1</u>, <u>userID2</u>) both → User, status, CHECK(userID1&lt;userID2) · Post(<u>postID</u>, userID → User, content, postedAt) · Comment(<u>postID</u>, <u>commentNo</u>, userID → User, content, parentCommentNo → Comment on same postID) · Like(<u>userID</u>, <u>postID</u>, likedAt)</p>
<pre><code class="language-sql">CREATE TABLE [User] (
  userID       INT IDENTITY PRIMARY KEY,
  username     VARCHAR(30) UNIQUE NOT NULL
);
CREATE TABLE Friendship (                                          -- recursive M-N on User, symmetric
  userID1      INT REFERENCES [User](userID),
  userID2      INT REFERENCES [User](userID),
  status       VARCHAR(10) NOT NULL CHECK (status IN ('pending','accepted')),
  CHECK (userID1 &lt; userID2),                                       -- store each pair once, smaller id first
  PRIMARY KEY (userID1, userID2)
);
CREATE TABLE Post (
  postID       INT IDENTITY PRIMARY KEY,
  userID       INT NOT NULL REFERENCES [User](userID),
  content      NVARCHAR(500) NOT NULL,
  postedAt     DATETIME NOT NULL
);
CREATE TABLE Comment (                                             -- weak entity of Post + self-FK for replies
  postID           INT NOT NULL,
  commentNo        INT NOT NULL,
  userID           INT NOT NULL REFERENCES [User](userID),
  content          NVARCHAR(300) NOT NULL,
  parentCommentNo  INT NULL,                                       -- NULL: top-level; otherwise replies to another comment on the SAME post
  PRIMARY KEY (postID, commentNo),
  FOREIGN KEY (postID) REFERENCES Post(postID),
  FOREIGN KEY (postID, parentCommentNo) REFERENCES Comment(postID, commentNo)
);
CREATE TABLE [Like] (                                                -- M-N User-Post, with attribute
  userID       INT REFERENCES [User](userID),
  postID       INT REFERENCES Post(postID),
  likedAt      DATETIME NOT NULL,
  PRIMARY KEY (userID, postID)
);</code></pre>
<div class="out">(3 rows affected)<br>
(2 rows affected)<br>
(1 row affected)<br>
(2 rows affected)<br>
(2 rows affected)</div>
<table>
<thead><tr><th>table_name</th><th>cols</th><th>fks</th></tr></thead>
<tbody>
<tr><td>Comment</td><td>5</td><td>3</td></tr>
<tr><td>Friendship</td><td>3</td><td>2</td></tr>
<tr><td>Like</td><td>3</td><td>2</td></tr>
<tr><td>Post</td><td>4</td><td>1</td></tr>
<tr><td>User</td><td>2</td><td>0</td></tr>
</tbody>
</table>
<p>5 tables; Comment shows 3 foreign keys — one to Post, one to User, and one back to itself (the composite self-FK for replies) — the richest single-table signature in this workshop, because it stacks a weak entity AND a recursive relationship on the same table.</p>
<div class="pitfall">The <code>CHECK (userID1 &lt; userID2)</code> trick in Friendship is worth memorising: without it, a naive "insert both directions" approach stores (A,B) and (B,A) as two separate rows for one real-world fact, and a query like "count Alice's friends" silently double-counts if it is not written carefully. This is the single most common way a symmetric recursive relationship goes wrong in a PE.</div>`,
    `<h3>Đề 8 — Mạng xã hội: M-N đệ quy đối xứng, và một thực thể yếu CŨNG đệ quy (~20 phút)</h3>
<p>Một <strong>người dùng</strong> có thể trở thành <strong>bạn bè</strong> với người dùng khác — khác tuyến đường ở đề 7, kết bạn là hai chiều: nếu A là bạn của B, B tự động là bạn của A, đó là cùng một sự thật, không phải hai. Một người dùng <strong>đăng bài</strong>, người dùng khác <strong>bình luận</strong> trên bài đó, đánh số trong phạm vi bài đó; một bình luận có thể là <strong>trả lời một bình luận khác trên CÙNG bài đó</strong> (trả lời không có nghĩa gắn với một bài khác). Người dùng <strong>thích</strong> một bài, mỗi người một lần.</p>
<table>
<thead><tr><th>Thành phần</th><th>Quyết định</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td>User — User</td><td>M-N đệ quy, nhưng ĐỐI XỨNG — một dòng cho mỗi cặp không thứ tự</td><td>"hai chiều… cùng một sự thật, không phải hai" — ngược hẳn đề 7; lưu (A,B) đã ngầm có (B,A), nên một CHECK như userID1 &lt; userID2 giữ mỗi cặp chỉ lưu đúng một lần thay vì hai</td></tr>
<tr><td>Comment</td><td>thực thể yếu của Post (khoá bộ phận commentNo) — VÀ, bên trong đó, một khoá ngoại đệ quy tự trỏ cho phần trả lời</td><td>"đánh số trong phạm vi bài đó" cho phần thực thể yếu; "trả lời một bình luận khác trên CÙNG bài đó" thêm một ý thứ hai chồng lên: Comment trỏ tới Comment, nhưng bị ràng buộc phải ở trong cùng bài viết</td></tr>
<tr><td>Like</td><td>M-N User–Post, với khoá đóng vai trò UNIQUE nên "mỗi người một lần" tự động được ép bởi chính khoá chính</td><td>khoá chính (userID, postID) đã tự cấm một dòng trùng thứ hai — không cần ràng buộc thêm</td></tr>
</tbody>
</table>
<pre><code class="language-plaintext">[User] ── N ──&lt;Friendship (status)&gt;── N ── [User]   (đệ quy, ĐỐI XỨNG: một dòng cho mỗi cặp)
   │ 1
&lt;writes&gt;
   │ N
[Post] ══ 1 ══&lt;&lt;has&gt;&gt;══ N ══ [[Comment]] commentNo (bộ phận), parentCommentNo → Comment (đệ quy, chỉ trong cùng bài)
[User] ── N ──&lt;Like (likedAt)&gt;── M ── [Post]</code></pre>
<p>User(<u>userID</u>, username) · Friendship(<u>userID1</u>, <u>userID2</u>) cả hai → User, status, CHECK(userID1&lt;userID2) · Post(<u>postID</u>, userID → User, content, postedAt) · Comment(<u>postID</u>, <u>commentNo</u>, userID → User, content, parentCommentNo → Comment cùng postID) · Like(<u>userID</u>, <u>postID</u>, likedAt)</p>
<pre><code class="language-sql">CREATE TABLE [User] (
  userID       INT IDENTITY PRIMARY KEY,
  username     VARCHAR(30) UNIQUE NOT NULL
);
CREATE TABLE Friendship (                                          -- M-N đệ quy trên User, đối xứng
  userID1      INT REFERENCES [User](userID),
  userID2      INT REFERENCES [User](userID),
  status       VARCHAR(10) NOT NULL CHECK (status IN ('pending','accepted')),
  CHECK (userID1 &lt; userID2),                                       -- lưu mỗi cặp một lần, id nhỏ hơn trước
  PRIMARY KEY (userID1, userID2)
);
CREATE TABLE Post (
  postID       INT IDENTITY PRIMARY KEY,
  userID       INT NOT NULL REFERENCES [User](userID),
  content      NVARCHAR(500) NOT NULL,
  postedAt     DATETIME NOT NULL
);
CREATE TABLE Comment (                                             -- thực thể yếu của Post + khoá ngoại đệ quy cho trả lời
  postID           INT NOT NULL,
  commentNo        INT NOT NULL,
  userID           INT NOT NULL REFERENCES [User](userID),
  content          NVARCHAR(300) NOT NULL,
  parentCommentNo  INT NULL,                                       -- NULL: bình luận gốc; khác NULL: trả lời một bình luận khác CÙNG bài viết
  PRIMARY KEY (postID, commentNo),
  FOREIGN KEY (postID) REFERENCES Post(postID),
  FOREIGN KEY (postID, parentCommentNo) REFERENCES Comment(postID, commentNo)
);
CREATE TABLE [Like] (                                                -- M-N User-Post, có thuộc tính
  userID       INT REFERENCES [User](userID),
  postID       INT REFERENCES Post(postID),
  likedAt      DATETIME NOT NULL,
  PRIMARY KEY (userID, postID)
);</code></pre>
<div class="out">(3 rows affected)<br>
(2 rows affected)<br>
(1 row affected)<br>
(2 rows affected)<br>
(2 rows affected)</div>
<table>
<thead><tr><th>table_name</th><th>cols</th><th>fks</th></tr></thead>
<tbody>
<tr><td>Comment</td><td>5</td><td>3</td></tr>
<tr><td>Friendship</td><td>3</td><td>2</td></tr>
<tr><td>Like</td><td>3</td><td>2</td></tr>
<tr><td>Post</td><td>4</td><td>1</td></tr>
<tr><td>User</td><td>2</td><td>0</td></tr>
</tbody>
</table>
<p>5 bảng; Comment mang 3 khoá ngoại — một tới Post, một tới User, và một tự trỏ về chính nó (khoá ngoại ghép tự trỏ cho phần trả lời) — dấu hiệu trên một bảng phong phú nhất trong cả xưởng này, vì nó chồng cả thực thể yếu LẪN liên kết đệ quy lên cùng một bảng.</p>
<div class="pitfall">Mẹo <code>CHECK (userID1 &lt; userID2)</code> trong Friendship đáng nhớ: không có nó, cách làm ngây thơ "chèn cả hai chiều" sẽ lưu (A,B) và (B,A) thành hai dòng riêng cho một sự thật đời thực, và một câu truy vấn kiểu "đếm số bạn của Alice" sẽ âm thầm đếm đôi nếu viết không cẩn thận. Đây là cách một liên kết đệ quy đối xứng bị làm sai phổ biến nhất trong đề PE.</div>`),
    bi(`<h3>Case 9 — Project management: TWO different recursive relationships in one schema (~20 min)</h3>
<p>A <strong>project</strong> is broken into <strong>tasks</strong>; a task can itself be split into smaller <strong>subtasks</strong> (a subtask belongs to exactly one parent task; a top-level task has none). <strong>Employees</strong> are <strong>assigned</strong> to tasks with a role and a number of hours; the same employee can be assigned to several tasks. Every employee, except the most senior ones, <strong>reports to</strong> exactly one other employee (their manager). Employees are either <strong>full-time staff</strong> (paid a monthly salary) or <strong>contractors</strong> (paid an hourly rate).</p>
<table>
<thead><tr><th>Element</th><th>Decision</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Task → Task</td><td>recursive 1-M, self FK parentTaskID (nullable)</td><td>"a subtask belongs to exactly one parent task… a top-level task has none" — same shape as case 2's category tree, different domain</td></tr>
<tr><td>Employee → Employee</td><td>a SECOND, unrelated recursive 1-M, self FK managerID (nullable)</td><td>"reports to exactly one other employee" — this is a completely separate recursive relationship from the task tree above, even though both live in the same schema; do not confuse the two hierarchies</td></tr>
<tr><td>Employee → FullTimeStaff / Contractor</td><td>subclass (isa), disjoint</td><td>"either… or" — mutually exclusive extra facts</td></tr>
<tr><td>Employee — Task</td><td>M-N via Assignment(role, hours)</td><td>"assigned to tasks… the same employee can be assigned to several tasks" and a task needs several employees</td></tr>
</tbody>
</table>
<pre><code class="language-plaintext">[Project] ══ 1 ══&lt;&lt;has&gt;&gt;══ N ══ [Task] taskID*, title, parentTaskID → Task (recursive #1: subtasks)

[Employee] employeeID*, fullName, managerID → Employee (recursive #2: org chart — UNRELATED to the tree above)
      │ isa
 ┌────┴────┐
[FullTimeStaff]  [Contractor]

[Employee] ── N ──&lt;Assignment (role, hours)&gt;── M ── [Task]</code></pre>
<p>Project(<u>projectID</u>, name) · Task(<u>taskID</u>, projectID → Project, title, parentTaskID → Task) · Employee(<u>employeeID</u>, fullName, managerID → Employee) · FullTimeStaff(<u>employeeID</u> → Employee, monthlySalary) · Contractor(<u>employeeID</u> → Employee, hourlyRate) · Assignment(<u>employeeID</u>, <u>taskID</u>, role, hours)</p>
<pre><code class="language-sql">CREATE TABLE Project (
  projectID    INT IDENTITY PRIMARY KEY,
  name         NVARCHAR(80) NOT NULL
);
CREATE TABLE Employee (                                            -- superclass
  employeeID   CHAR(6)      PRIMARY KEY,
  fullName     NVARCHAR(50) NOT NULL,
  managerID    CHAR(6) NULL REFERENCES Employee(employeeID)         -- recursive self-FK #1: org chart
);
CREATE TABLE FullTimeStaff (                                       -- subclass
  employeeID   CHAR(6) PRIMARY KEY REFERENCES Employee(employeeID),
  monthlySalary DECIMAL(14,0) NOT NULL CHECK (monthlySalary &gt; 0)
);
CREATE TABLE Contractor (                                          -- subclass
  employeeID   CHAR(6) PRIMARY KEY REFERENCES Employee(employeeID),
  hourlyRate   DECIMAL(10,0) NOT NULL CHECK (hourlyRate &gt; 0)
);
CREATE TABLE Task (
  taskID       INT IDENTITY PRIMARY KEY,
  projectID    INT NOT NULL REFERENCES Project(projectID),
  title        NVARCHAR(80) NOT NULL,
  parentTaskID INT NULL REFERENCES Task(taskID)                     -- recursive self-FK #2: subtasks
);
CREATE TABLE Assignment (                                          -- M-N Employee-Task, with attributes
  employeeID   CHAR(6) REFERENCES Employee(employeeID),
  taskID       INT     REFERENCES Task(taskID),
  role         VARCHAR(20) NOT NULL,
  hours        DECIMAL(6,1) NOT NULL CHECK (hours &gt;= 0),
  PRIMARY KEY (employeeID, taskID)
);</code></pre>
<div class="out">(1 row affected)<br>
(2 rows affected)<br>
(2 rows affected)<br>
(1 row affected)<br>
(1 row affected)<br>
(1 row affected)<br>
(2 rows affected)<br>
(2 rows affected)</div>
<table>
<thead><tr><th>table_name</th><th>cols</th><th>fks</th></tr></thead>
<tbody>
<tr><td>Assignment</td><td>4</td><td>2</td></tr>
<tr><td>Contractor</td><td>2</td><td>1</td></tr>
<tr><td>Employee</td><td>3</td><td>1</td></tr>
<tr><td>FullTimeStaff</td><td>2</td><td>1</td></tr>
<tr><td>Project</td><td>2</td><td>0</td></tr>
<tr><td>Task</td><td>4</td><td>2</td></tr>
</tbody>
</table>
<p>6 tables; both Task and Employee show exactly 1 foreign key that points back at their own table — two independent recursive relationships coexisting in one schema, which is exactly what the paragraph described.</p>
<div class="pitfall">Students under time pressure sometimes try to "reuse" one self-referencing column for both ideas (e.g. giving Task a single <code>parentOrManagerID</code> and reusing it for org chart logic too) because both look like "a tree". Re-read the paragraph: subtasks belong to Task, reporting lines belong to Employee — two different entity sets, two different foreign keys, even though the diagrams look structurally identical.</div>`,
    `<h3>Đề 9 — Quản lý dự án: HAI liên kết đệ quy khác nhau trong cùng một lược đồ (~20 phút)</h3>
<p>Một <strong>dự án</strong> được chia thành các <strong>công việc</strong>; một công việc có thể tự chia thành các <strong>công việc con</strong> nhỏ hơn (một công việc con thuộc đúng một công việc cha; một công việc ở mức cao nhất không có). <strong>Nhân viên</strong> được <strong>phân công</strong> vào các công việc với một vai trò và số giờ; cùng một nhân viên có thể được phân công vào nhiều công việc. Mọi nhân viên, trừ những người cao cấp nhất, <strong>báo cáo cho</strong> đúng một nhân viên khác (quản lý của họ). Nhân viên hoặc là <strong>nhân viên chính thức</strong> (lương tháng) hoặc là <strong>cộng tác viên</strong> (lương theo giờ).</p>
<table>
<thead><tr><th>Thành phần</th><th>Quyết định</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td>Task → Task</td><td>1-M đệ quy, khoá ngoại tự trỏ parentTaskID (cho phép NULL)</td><td>"một công việc con thuộc đúng một công việc cha… một công việc ở mức cao nhất không có" — cùng hình dạng với cây danh mục ở đề 2, khác lĩnh vực</td></tr>
<tr><td>Employee → Employee</td><td>một liên kết đệ quy 1-M THỨ HAI, không liên quan, khoá ngoại tự trỏ managerID (cho phép NULL)</td><td>"báo cáo cho đúng một nhân viên khác" — đây là một liên kết đệ quy hoàn toàn tách biệt với cây công việc ở trên, dù cả hai cùng sống trong một lược đồ; đừng nhầm hai phân cấp này với nhau</td></tr>
<tr><td>Employee → FullTimeStaff / Contractor</td><td>lớp con (isa), tách rời</td><td>"hoặc… hoặc" — thông tin thêm loại trừ lẫn nhau</td></tr>
<tr><td>Employee — Task</td><td>M-N qua Assignment(role, hours)</td><td>"được phân công vào các công việc… cùng một nhân viên có thể được phân công vào nhiều công việc" và một công việc cần nhiều nhân viên</td></tr>
</tbody>
</table>
<pre><code class="language-plaintext">[Project] ══ 1 ══&lt;&lt;has&gt;&gt;══ N ══ [Task] taskID*, title, parentTaskID → Task (đệ quy #1: công việc con)

[Employee] employeeID*, fullName, managerID → Employee (đệ quy #2: sơ đồ tổ chức — KHÔNG liên quan tới cây ở trên)
      │ isa
 ┌────┴────┐
[FullTimeStaff]  [Contractor]

[Employee] ── N ──&lt;Assignment (role, hours)&gt;── M ── [Task]</code></pre>
<p>Project(<u>projectID</u>, name) · Task(<u>taskID</u>, projectID → Project, title, parentTaskID → Task) · Employee(<u>employeeID</u>, fullName, managerID → Employee) · FullTimeStaff(<u>employeeID</u> → Employee, monthlySalary) · Contractor(<u>employeeID</u> → Employee, hourlyRate) · Assignment(<u>employeeID</u>, <u>taskID</u>, role, hours)</p>
<pre><code class="language-sql">CREATE TABLE Project (
  projectID    INT IDENTITY PRIMARY KEY,
  name         NVARCHAR(80) NOT NULL
);
CREATE TABLE Employee (                                            -- lớp cha
  employeeID   CHAR(6)      PRIMARY KEY,
  fullName     NVARCHAR(50) NOT NULL,
  managerID    CHAR(6) NULL REFERENCES Employee(employeeID)         -- khoá ngoại đệ quy #1: sơ đồ tổ chức
);
CREATE TABLE FullTimeStaff (                                       -- lớp con
  employeeID   CHAR(6) PRIMARY KEY REFERENCES Employee(employeeID),
  monthlySalary DECIMAL(14,0) NOT NULL CHECK (monthlySalary &gt; 0)
);
CREATE TABLE Contractor (                                          -- lớp con
  employeeID   CHAR(6) PRIMARY KEY REFERENCES Employee(employeeID),
  hourlyRate   DECIMAL(10,0) NOT NULL CHECK (hourlyRate &gt; 0)
);
CREATE TABLE Task (
  taskID       INT IDENTITY PRIMARY KEY,
  projectID    INT NOT NULL REFERENCES Project(projectID),
  title        NVARCHAR(80) NOT NULL,
  parentTaskID INT NULL REFERENCES Task(taskID)                     -- khoá ngoại đệ quy #2: công việc con
);
CREATE TABLE Assignment (                                          -- M-N Employee-Task, có thuộc tính
  employeeID   CHAR(6) REFERENCES Employee(employeeID),
  taskID       INT     REFERENCES Task(taskID),
  role         VARCHAR(20) NOT NULL,
  hours        DECIMAL(6,1) NOT NULL CHECK (hours &gt;= 0),
  PRIMARY KEY (employeeID, taskID)
);</code></pre>
<div class="out">(1 row affected)<br>
(2 rows affected)<br>
(2 rows affected)<br>
(1 row affected)<br>
(1 row affected)<br>
(1 row affected)<br>
(2 rows affected)<br>
(2 rows affected)</div>
<table>
<thead><tr><th>table_name</th><th>cols</th><th>fks</th></tr></thead>
<tbody>
<tr><td>Assignment</td><td>4</td><td>2</td></tr>
<tr><td>Contractor</td><td>2</td><td>1</td></tr>
<tr><td>Employee</td><td>3</td><td>1</td></tr>
<tr><td>FullTimeStaff</td><td>2</td><td>1</td></tr>
<tr><td>Project</td><td>2</td><td>0</td></tr>
<tr><td>Task</td><td>4</td><td>2</td></tr>
</tbody>
</table>
<p>6 bảng; cả Task lẫn Employee đều mang đúng 1 khoá ngoại tự trỏ về bảng của mình — hai liên kết đệ quy độc lập cùng tồn tại trong một lược đồ, đúng như đoạn đề mô tả.</p>
<div class="pitfall">Sinh viên khi gấp gáp đôi khi cố "dùng chung" một cột tự trỏ cho cả hai ý (vd cho Task một cột <code>parentOrManagerID</code> rồi dùng chung cho cả logic sơ đồ tổ chức) vì cả hai trông đều "giống một cái cây". Đọc lại đề: công việc con thuộc về Task, đường báo cáo thuộc về Employee — hai tập thực thể khác nhau, hai khoá ngoại khác nhau, dù sơ đồ trông giống hệt nhau về cấu trúc.</div>`),
    bi(`<h3>Case 10 — Banking: a full mini-PE combining every idea from cases 1–9 (~30 min)</h3>
<p>A <strong>branch</strong> is staffed by <strong>employees</strong>; exactly one of a branch's employees is its <strong>manager</strong> (and an employee manages at most one branch). <strong>Customers</strong> hold <strong>accounts</strong> at a branch; an account can be jointly held by more than one customer, and a customer can hold more than one account. Every account is either a <strong>savings account</strong> (with an interest rate) or a <strong>checking account</strong> (with an overdraft limit). Every deposit, withdrawal or transfer on an account is recorded as a numbered <strong>transaction</strong>, local to that account's own history; a <strong>transfer</strong> transaction additionally names the OTHER account that received the money.</p>
<table>
<thead><tr><th>Element</th><th>Decision</th><th>Why · which earlier case this echoes</th></tr></thead>
<tbody>
<tr><td>Branch — Employee (manager)</td><td>1-1: a branch has one manager, a manager manages at most one branch</td><td>"exactly one… at most one" both sides — the one construct this workshop had not used explicitly yet; modelled as a nullable FK on the "1" side (Branch.managerID) after Employee exists, to avoid a chicken-and-egg dependency between the two tables</td></tr>
<tr><td>Customer — Account</td><td>M-N via AccountHolder</td><td>"jointly held by more than one… more than one account" both ways — same shape as case 4's Enrollment</td></tr>
<tr><td>Account → Savings / Checking</td><td>subclass (isa), disjoint</td><td>"either… or" — same shape as case 5/9's subclass</td></tr>
<tr><td>Transaction</td><td>weak entity of Account, partial key seqNo</td><td>"local to that account's own history" — same shape as case 1/7's weak entities</td></tr>
<tr><td>Transaction.relatedAccountNo</td><td>a SECOND foreign key from Transaction back to Account — a relationship with two different roles to the SAME entity set, but NOT recursive on Account itself (Transaction is a third party)</td><td>"names the OTHER account" — easy to mis-read as a ternary or as Account-to-Account; it is really Transaction playing two different roles towards Account, similar in spirit to case 4/7/8's two-role recursive tables but one level removed</td></tr>
</tbody>
</table>
<pre><code class="language-plaintext">[Branch] branchID*, city, managerID → Employee (nullable, set after Employee exists: 1-1)
   │ 1
&lt;staffs&gt;
   │ N
[Employee] employeeID*, fullName

[Customer] ── N ──&lt;AccountHolder&gt;── M ── [Account] accountNo*, balance, openedAt (branchID → Branch)
                                              │ isa
                                    ┌─────────┴─────────┐
                          [SavingsAccount] interestRate   [CheckingAccount] overdraftLimit

[Account] ══ 1 ══&lt;&lt;logs&gt;&gt;══ N ══ [[Transaction]] seqNo (partial), txType, amount, relatedAccountNo → Account (2nd role)</code></pre>
<p>Branch(<u>branchID</u>, city, managerID → Employee) · Employee(<u>employeeID</u>, fullName, branchID → Branch) · Customer(<u>customerID</u>, fullName) · Account(<u>accountNo</u>, branchID → Branch, balance, openedAt) · SavingsAccount(<u>accountNo</u> → Account, interestRate) · CheckingAccount(<u>accountNo</u> → Account, overdraftLimit) · AccountHolder(<u>customerID</u>, <u>accountNo</u>) · Transaction(<u>accountNo</u>, <u>seqNo</u>, txType, amount, relatedAccountNo → Account, txTime)</p>
<pre><code class="language-sql">CREATE TABLE Branch (
  branchID     INT IDENTITY PRIMARY KEY,
  city         NVARCHAR(50) NOT NULL
);
CREATE TABLE Employee (
  employeeID   CHAR(6)      PRIMARY KEY,
  fullName     NVARCHAR(50) NOT NULL,
  branchID     INT NOT NULL REFERENCES Branch(branchID)
);
ALTER TABLE Branch ADD managerID CHAR(6) NULL REFERENCES Employee(employeeID);  -- 1-1: a branch has one manager
CREATE TABLE Customer (
  customerID   INT IDENTITY PRIMARY KEY,
  fullName     NVARCHAR(50) NOT NULL
);
CREATE TABLE Account (                                             -- superclass
  accountNo    CHAR(10)      PRIMARY KEY,
  branchID     INT NOT NULL REFERENCES Branch(branchID),
  balance      DECIMAL(16,0) NOT NULL DEFAULT 0 CHECK (balance &gt;= 0),
  openedAt     DATE NOT NULL
);
CREATE TABLE SavingsAccount (                                      -- subclass
  accountNo    CHAR(10) PRIMARY KEY REFERENCES Account(accountNo),
  interestRate DECIMAL(5,2) NOT NULL CHECK (interestRate &gt;= 0)
);
CREATE TABLE CheckingAccount (                                     -- subclass
  accountNo    CHAR(10) PRIMARY KEY REFERENCES Account(accountNo),
  overdraftLimit DECIMAL(14,0) NOT NULL DEFAULT 0
);
CREATE TABLE AccountHolder (                                       -- M-N Customer-Account: joint accounts
  customerID   INT      REFERENCES Customer(customerID),
  accountNo    CHAR(10) REFERENCES Account(accountNo),
  PRIMARY KEY (customerID, accountNo)
);
CREATE TABLE [Transaction] (                                       -- weak entity of Account: partial key seqNo
  accountNo    CHAR(10) NOT NULL REFERENCES Account(accountNo),
  seqNo        INT      NOT NULL,
  txType       VARCHAR(10) NOT NULL CHECK (txType IN ('deposit','withdraw','transfer')),
  amount       DECIMAL(16,0) NOT NULL CHECK (amount &gt; 0),
  relatedAccountNo CHAR(10) NULL REFERENCES Account(accountNo),     -- transfer target: same entity set, second role
  txTime       DATETIME NOT NULL,
  PRIMARY KEY (accountNo, seqNo)
);</code></pre>
<div class="out">(1 row affected)<br>
(1 row affected)<br>
(1 row affected)<br>
(2 rows affected)<br>
(2 rows affected)<br>
(1 row affected)<br>
(1 row affected)<br>
(3 rows affected)<br>
(3 rows affected)</div>
<table>
<thead><tr><th>table_name</th><th>cols</th><th>fks</th></tr></thead>
<tbody>
<tr><td>Account</td><td>4</td><td>1</td></tr>
<tr><td>AccountHolder</td><td>2</td><td>2</td></tr>
<tr><td>Branch</td><td>3</td><td>1</td></tr>
<tr><td>CheckingAccount</td><td>2</td><td>1</td></tr>
<tr><td>Customer</td><td>2</td><td>0</td></tr>
<tr><td>Employee</td><td>3</td><td>1</td></tr>
<tr><td>SavingsAccount</td><td>2</td><td>1</td></tr>
<tr><td>Transaction</td><td>6</td><td>2</td></tr>
</tbody>
</table>
<p>8 tables — every construct from this whole workshop appears at least once: weak entity (Transaction), subclass (Savings/CheckingAccount), M-N (AccountHolder), and a two-roles-to-one-entity-set relationship (Transaction → Account twice). This is deliberately shaped like PE question 1: read once for entities, once for cardinalities, once for anything that looks like a repeat of an earlier idea.</p>
<div class="pitfall">Two traps stacked in one case, on purpose: (1) <code>Branch.managerID</code> referencing <code>Employee</code>, which itself references <code>Branch.branchID</code> — a real circular dependency between two tables. The fix used here is the same one lesson 3.5 and this schema's SQL both rely on: create <code>Branch</code> first WITHOUT the <code>managerID</code> column, create <code>Employee</code> (which can reference <code>Branch</code> immediately), THEN <code>ALTER TABLE Branch ADD managerID ...</code> and <code>UPDATE</code> it — never try to write both tables' CREATE statements with the circular reference inline, SQL Server will refuse it. (2) <code>relatedAccountNo</code> is not a recursive relationship on Account (Account never points at itself directly) — it is Transaction, a THIRD table, holding two separate foreign keys to Account. Calling this "Account is recursive" is a common but incorrect answer in oral exams.</div>`,
    `<h3>Đề 10 — Ngân hàng: một đề PE mini đầy đủ, gộp mọi ý từ đề 1–9 (~30 phút)</h3>
<p>Một <strong>chi nhánh</strong> có các <strong>nhân viên</strong>; đúng một nhân viên của chi nhánh là <strong>trưởng chi nhánh</strong> (và một nhân viên quản lý tối đa một chi nhánh). <strong>Khách hàng</strong> giữ các <strong>tài khoản</strong> tại một chi nhánh; một tài khoản có thể được đồng sở hữu bởi nhiều khách hàng, và một khách hàng có thể giữ nhiều tài khoản. Mọi tài khoản hoặc là <strong>tài khoản tiết kiệm</strong> (có lãi suất) hoặc là <strong>tài khoản thanh toán</strong> (có hạn mức thấu chi). Mọi lần gửi, rút hay chuyển khoản trên một tài khoản được ghi lại thành một <strong>giao dịch</strong> đánh số, riêng trong lịch sử của tài khoản đó; một giao dịch <strong>chuyển khoản</strong> còn ghi thêm tài khoản KHÁC nhận tiền.</p>
<table>
<thead><tr><th>Thành phần</th><th>Quyết định</th><th>Vì sao · gợi lại đề nào trước đó</th></tr></thead>
<tbody>
<tr><td>Branch — Employee (manager)</td><td>1-1: một chi nhánh có một trưởng chi nhánh, một trưởng chi nhánh quản lý tối đa một chi nhánh</td><td>"đúng một… tối đa một" cả hai phía — cấu trúc duy nhất xưởng này chưa dùng thẳng; mô hình bằng khoá ngoại cho phép NULL ở phía "1" (Branch.managerID) sau khi Employee đã tồn tại, để tránh phụ thuộc vòng giữa hai bảng</td></tr>
<tr><td>Customer — Account</td><td>M-N qua AccountHolder</td><td>"đồng sở hữu bởi nhiều khách hàng… nhiều tài khoản" cả hai chiều — cùng hình dạng Enrollment ở đề 4</td></tr>
<tr><td>Account → Savings / Checking</td><td>lớp con (isa), tách rời</td><td>"hoặc… hoặc" — cùng hình dạng lớp con ở đề 5/9</td></tr>
<tr><td>Transaction</td><td>thực thể yếu của Account, khoá bộ phận seqNo</td><td>"riêng trong lịch sử của tài khoản đó" — cùng hình dạng thực thể yếu ở đề 1/7</td></tr>
<tr><td>Transaction.relatedAccountNo</td><td>một khoá ngoại THỨ HAI từ Transaction về Account — một liên kết có hai vai trò khác nhau tới CÙNG một tập thực thể, nhưng KHÔNG đệ quy trên chính Account (Transaction là bên thứ ba)</td><td>"ghi thêm tài khoản KHÁC nhận tiền" — dễ đọc nhầm thành ba ngôi hoặc thành Account-tới-Account; thật ra là Transaction đóng hai vai khác nhau với Account, cùng tinh thần với các bảng hai-vai-trò đệ quy ở đề 4/7/8 nhưng lùi một bậc</td></tr>
</tbody>
</table>
<pre><code class="language-plaintext">[Branch] branchID*, city, managerID → Employee (cho phép NULL, đặt sau khi Employee tồn tại: 1-1)
   │ 1
&lt;staffs&gt;
   │ N
[Employee] employeeID*, fullName

[Customer] ── N ──&lt;AccountHolder&gt;── M ── [Account] accountNo*, balance, openedAt (branchID → Branch)
                                              │ isa
                                    ┌─────────┴─────────┐
                          [SavingsAccount] interestRate   [CheckingAccount] overdraftLimit

[Account] ══ 1 ══&lt;&lt;logs&gt;&gt;══ N ══ [[Transaction]] seqNo (bộ phận), txType, amount, relatedAccountNo → Account (vai thứ 2)</code></pre>
<p>Branch(<u>branchID</u>, city, managerID → Employee) · Employee(<u>employeeID</u>, fullName, branchID → Branch) · Customer(<u>customerID</u>, fullName) · Account(<u>accountNo</u>, branchID → Branch, balance, openedAt) · SavingsAccount(<u>accountNo</u> → Account, interestRate) · CheckingAccount(<u>accountNo</u> → Account, overdraftLimit) · AccountHolder(<u>customerID</u>, <u>accountNo</u>) · Transaction(<u>accountNo</u>, <u>seqNo</u>, txType, amount, relatedAccountNo → Account, txTime)</p>
<pre><code class="language-sql">CREATE TABLE Branch (
  branchID     INT IDENTITY PRIMARY KEY,
  city         NVARCHAR(50) NOT NULL
);
CREATE TABLE Employee (
  employeeID   CHAR(6)      PRIMARY KEY,
  fullName     NVARCHAR(50) NOT NULL,
  branchID     INT NOT NULL REFERENCES Branch(branchID)
);
ALTER TABLE Branch ADD managerID CHAR(6) NULL REFERENCES Employee(employeeID);  -- 1-1: một chi nhánh có một trưởng chi nhánh
CREATE TABLE Customer (
  customerID   INT IDENTITY PRIMARY KEY,
  fullName     NVARCHAR(50) NOT NULL
);
CREATE TABLE Account (                                             -- lớp cha
  accountNo    CHAR(10)      PRIMARY KEY,
  branchID     INT NOT NULL REFERENCES Branch(branchID),
  balance      DECIMAL(16,0) NOT NULL DEFAULT 0 CHECK (balance &gt;= 0),
  openedAt     DATE NOT NULL
);
CREATE TABLE SavingsAccount (                                      -- lớp con
  accountNo    CHAR(10) PRIMARY KEY REFERENCES Account(accountNo),
  interestRate DECIMAL(5,2) NOT NULL CHECK (interestRate &gt;= 0)
);
CREATE TABLE CheckingAccount (                                     -- lớp con
  accountNo    CHAR(10) PRIMARY KEY REFERENCES Account(accountNo),
  overdraftLimit DECIMAL(14,0) NOT NULL DEFAULT 0
);
CREATE TABLE AccountHolder (                                       -- M-N Customer-Account: tài khoản đồng sở hữu
  customerID   INT      REFERENCES Customer(customerID),
  accountNo    CHAR(10) REFERENCES Account(accountNo),
  PRIMARY KEY (customerID, accountNo)
);
CREATE TABLE [Transaction] (                                       -- thực thể yếu của Account: khoá bộ phận seqNo
  accountNo    CHAR(10) NOT NULL REFERENCES Account(accountNo),
  seqNo        INT      NOT NULL,
  txType       VARCHAR(10) NOT NULL CHECK (txType IN ('deposit','withdraw','transfer')),
  amount       DECIMAL(16,0) NOT NULL CHECK (amount &gt; 0),
  relatedAccountNo CHAR(10) NULL REFERENCES Account(accountNo),     -- tài khoản nhận chuyển: cùng tập thực thể, vai trò thứ hai
  txTime       DATETIME NOT NULL,
  PRIMARY KEY (accountNo, seqNo)
);</code></pre>
<div class="out">(1 row affected)<br>
(1 row affected)<br>
(1 row affected)<br>
(2 rows affected)<br>
(2 rows affected)<br>
(1 row affected)<br>
(1 row affected)<br>
(3 rows affected)<br>
(3 rows affected)</div>
<table>
<thead><tr><th>table_name</th><th>cols</th><th>fks</th></tr></thead>
<tbody>
<tr><td>Account</td><td>4</td><td>1</td></tr>
<tr><td>AccountHolder</td><td>2</td><td>2</td></tr>
<tr><td>Branch</td><td>3</td><td>1</td></tr>
<tr><td>CheckingAccount</td><td>2</td><td>1</td></tr>
<tr><td>Customer</td><td>2</td><td>0</td></tr>
<tr><td>Employee</td><td>3</td><td>1</td></tr>
<tr><td>SavingsAccount</td><td>2</td><td>1</td></tr>
<tr><td>Transaction</td><td>6</td><td>2</td></tr>
</tbody>
</table>
<p>8 bảng — mọi cấu trúc của cả xưởng này xuất hiện ít nhất một lần: thực thể yếu (Transaction), lớp con (Savings/CheckingAccount), M-N (AccountHolder), và một liên kết hai-vai-trò-tới-một-tập-thực-thể (Transaction → Account hai lần). Đề này cố tình có hình dạng câu 1 đề PE: đọc một lượt tìm thực thể, một lượt tìm bản số, một lượt tìm chỗ nào trông giống một ý đã gặp trước đó.</p>
<div class="pitfall">Hai bẫy chồng lên nhau trong đúng một đề, cố ý: (1) <code>Branch.managerID</code> trỏ tới <code>Employee</code>, mà bản thân <code>Employee</code> lại trỏ tới <code>Branch.branchID</code> — một phụ thuộc vòng thật sự giữa hai bảng. Cách sửa dùng ở đây giống hệt cách bài 3.5 và chính SQL của lược đồ này dùng: tạo <code>Branch</code> trước, KHÔNG có cột <code>managerID</code>, tạo <code>Employee</code> (trỏ được ngay tới <code>Branch</code>), RỒI <code>ALTER TABLE Branch ADD managerID ...</code> và <code>UPDATE</code> nó — đừng cố viết cả hai câu CREATE của hai bảng với tham chiếu vòng ngay trong đó, SQL Server sẽ từ chối. (2) <code>relatedAccountNo</code> không phải một liên kết đệ quy trên Account (Account không bao giờ tự trỏ trực tiếp) — đó là Transaction, một bảng THỨ BA, mang hai khoá ngoại riêng tới Account. Trả lời "Account đệ quy" là một câu trả lời sai hay gặp trong vấn đáp.</div>`),
    bi(`<h2>10 ERD mistakes that lose marks — check your diagram against every line</h2>
<table>
<thead><tr><th>#</th><th>Mistake</th><th>How it is usually spotted</th></tr></thead>
<tbody>
<tr><td>1</td><td>Drawing an attribute of a relationship (e.g. <code>grade</code>) as if it belonged to one of the entities instead of the relationship itself</td><td>ask "does this fact exist without BOTH sides present?" — if not, it belongs to the relationship</td></tr>
<tr><td>2</td><td>Missing a weak entity's supporting relationship, or giving the weak entity a key that is unique on its own</td><td>the phrase "numbered within X" / "unique only inside X" is the signal — look for it every time</td></tr>
<tr><td>3</td><td>Turning a ternary relationship into three binary ones</td><td>you lose which-with-which-with-which; check whether the paragraph describes ONE event with three participants, or three separate facts</td></tr>
<tr><td>4</td><td>Forgetting that a recursive relationship needs two distinct role names, and (for M-N) two separate foreign key columns pointing at the same table</td><td>re-read: does a noun ever refer to "another one of itself"?</td></tr>
<tr><td>5</td><td>Modelling a symmetric relationship (undirected, like friendship) the same way as a directed one (like a route or a supervises-relationship), doubling the stored rows</td><td>ask "if A→B is true, does that already mean B→A, or is it a separate fact?"</td></tr>
<tr><td>6</td><td>Choosing the wrong owner for a weak entity when there are two candidate "parents" nearby</td><td>the partial key + the phrase describing uniqueness point to exactly one true owner — re-read it</td></tr>
<tr><td>7</td><td>Flattening a subclass into the parent table with several nullable columns, losing the guarantee that only the right columns are filled for the right subtype</td><td>ask "can two different subtypes' extra columns ever both be filled on the same row, if this were one table?" — if that should never happen, use two tables</td></tr>
<tr><td>8</td><td>A composite key referenced by a foreign key written as separate, single-column foreign keys instead of one multi-column <code>FOREIGN KEY (...) REFERENCES ...(...)</code></td><td>if the parent's key has 2+ columns, every child referencing it needs the SAME number of columns, together, in one FK</td></tr>
<tr><td>9</td><td>Confusing "1-1" with "1-M" because the paragraph's wording is subtle ("has AT MOST ONE" vs "has ONE OR MORE")</td><td>underline every cardinality word in the paragraph before drawing anything</td></tr>
<tr><td>10</td><td>Skipping the self-check step — writing CREATE TABLE straight from memory instead of from the finished relational schema list</td><td>always write the schema list (Table(<u>key</u>, cols, FK → Parent)) FIRST, then translate it to SQL line by line — do not skip straight from ERD to code</td></tr>
</tbody>
</table>`,
    `<h2>10 lỗi vẽ ERD hay bị trừ điểm — soát lại sơ đồ của bạn theo từng dòng</h2>
<table>
<thead><tr><th>#</th><th>Lỗi</th><th>Cách hay phát hiện ra</th></tr></thead>
<tbody>
<tr><td>1</td><td>Vẽ một thuộc tính của liên kết (vd <code>grade</code>) như thể nó thuộc về một trong hai thực thể thay vì thuộc về chính liên kết</td><td>hỏi "sự kiện này có tồn tại nếu thiếu MỘT trong hai bên không?" — nếu không, nó thuộc về liên kết</td></tr>
<tr><td>2</td><td>Thiếu liên kết hỗ trợ của một thực thể yếu, hoặc cho thực thể yếu một khoá tự nó đã duy nhất</td><td>cụm "đánh số trong phạm vi X" / "chỉ duy nhất trong X" là tín hiệu — tìm nó mỗi lần</td></tr>
<tr><td>3</td><td>Biến một liên kết ba ngôi thành ba liên kết đôi</td><td>bạn mất thông tin ai-với-ai-với-ai; kiểm xem đoạn đề tả MỘT sự kiện có ba bên tham gia, hay ba sự kiện tách rời</td></tr>
<tr><td>4</td><td>Quên rằng một liên kết đệ quy cần hai tên vai trò khác nhau, và (với M-N) hai cột khoá ngoại riêng cùng trỏ về một bảng</td><td>đọc lại: có danh từ nào trỏ tới "một cái khác của chính nó" không?</td></tr>
<tr><td>5</td><td>Mô hình một liên kết đối xứng (không hướng, như kết bạn) giống hệt một liên kết có hướng (như tuyến đường hay liên kết giám sát), làm dữ liệu lưu gấp đôi</td><td>hỏi "nếu A→B đúng, điều đó đã ngầm nghĩa B→A, hay là một sự kiện tách rời?"</td></tr>
<tr><td>6</td><td>Chọn sai chủ cho một thực thể yếu khi có hai "cha" ứng viên gần đó</td><td>khoá bộ phận + câu mô tả tính duy nhất chỉ đúng một chủ thật — đọc lại nó</td></tr>
<tr><td>7</td><td>Dồn phẳng một lớp con vào bảng cha với nhiều cột cho phép NULL, mất đảm bảo chỉ đúng cột của đúng phân lớp được điền</td><td>hỏi "hai phân lớp khác nhau có bao giờ cùng điền cột riêng của mình trên cùng một dòng không, nếu đây là một bảng?" — nếu không bao giờ, dùng hai bảng</td></tr>
<tr><td>8</td><td>Một khoá ghép được tham chiếu bằng các khoá ngoại đơn cột riêng lẻ thay vì một <code>FOREIGN KEY (...) REFERENCES ...(...)</code> nhiều cột</td><td>nếu khoá của bảng cha có từ 2 cột trở lên, mọi bảng con tham chiếu nó cần ĐÚNG số cột đó, cùng nhau, trong một khoá ngoại</td></tr>
<tr><td>9</td><td>Nhầm "1-1" với "1-M" vì cách diễn đạt của đề tinh vi ("có TỐI ĐA MỘT" khác "có MỘT HOẶC NHIỀU")</td><td>gạch chân mọi từ chỉ bản số trong đề trước khi vẽ bất cứ gì</td></tr>
<tr><td>10</td><td>Bỏ qua bước tự kiểm — viết CREATE TABLE thẳng từ trí nhớ thay vì từ danh sách lược đồ quan hệ đã hoàn chỉnh</td><td>luôn viết danh sách lược đồ (Bảng(<u>khoá</u>, cột, khoá ngoại → cha)) TRƯỚC, rồi mới dịch sang SQL từng dòng — đừng nhảy thẳng từ ERD sang code</td></tr>
</tbody>
</table>`),
    bi(`<h2>🎤 Oral-exam question bank — 32 questions a lecturer actually asks while looking at your diagram</h2>
<p class="nhan">Basic concepts</p>
<table>
<thead><tr><th>Question</th><th>Model answer</th></tr></thead>
<tbody>
<tr><td>1. What is the difference between an entity and an entity set?</td><td>An entity is one specific instance (this particular student); an entity set is the whole collection of similar entities (all students) — the box in the diagram represents the SET, not one row</td></tr>
<tr><td>2. What is the difference between an attribute and a relationship?</td><td>An attribute describes ONE entity set on its own; a relationship connects TWO OR MORE entity sets together</td></tr>
<tr><td>3. What does "cardinality ratio" mean?</td><td>How many entities on one side of a relationship can be linked to one entity on the other side: 1-1, 1-M, or M-N</td></tr>
<tr><td>4. Why does a diamond in Chen notation need a name?</td><td>Because the same two entity sets can be connected by more than one relationship (e.g. Employee-Department by "works in" and separately by "manages") — the name disambiguates which one you mean</td></tr>
<tr><td>5. What is a key attribute, and how is it drawn?</td><td>The attribute (or set of attributes) that uniquely identifies every entity in the set; drawn underlined in Chen notation</td></tr>
<tr><td>6. Can a relationship itself have attributes? Give an example</td><td>Yes — a fact that only makes sense once both sides are known, e.g. <code>grade</code> on Student-enrols-Course, or <code>qty</code>/<code>unitPrice</code> on Order-contains-Product</td></tr>
</tbody>
</table>
<p class="nhan">Weak entities, multivalued, composite, derived</p>
<table>
<thead><tr><th>Question</th><th>Model answer</th></tr></thead>
<tbody>
<tr><td>7. What makes an entity set "weak"?</td><td>It has no attribute that is unique on its own — it can only be identified together with the primary key of its owner (supporting) entity set</td></tr>
<tr><td>8. What is a "partial key"?</td><td>The attribute of a weak entity that is unique only WITHIN one owner, not across the whole entity set</td></tr>
<tr><td>9. Does a weak entity's table need its own AUTO_INCREMENT id?</td><td>No — its primary key is the composite of (owner's key + partial key); adding a separate surrogate id is possible but not required and can hide the real business key</td></tr>
<tr><td>10. How is a multivalued attribute turned into tables?</td><td>It becomes its own table with a foreign key back to the owning entity, one row per value (e.g. GuestPhone(guestID, phone))</td></tr>
<tr><td>11. How is a composite attribute (e.g. address = street+city) turned into columns?</td><td>One column per component, directly on the owning entity's table — no separate table needed</td></tr>
<tr><td>12. Why is a derived attribute (e.g. age, or order total) usually NOT stored as a column?</td><td>Because it can be computed on demand from other stored data, and a stored, un-refreshed copy can silently go stale/wrong when the source values change</td></tr>
</tbody>
</table>
<p class="nhan">Relationships, cardinality, foreign keys</p>
<table>
<thead><tr><th>Question</th><th>Model answer</th></tr></thead>
<tbody>
<tr><td>13. Given a 1-M relationship, which side gets the foreign key?</td><td>The "many" side — the side that can only relate to ONE of the other, so one column is enough to record which one</td></tr>
<tr><td>14. Given an M-N relationship, how many tables does it need?</td><td>Its own junction/relationship table, with a composite primary key made of the two (or more) foreign keys</td></tr>
<tr><td>15. How do you tell a ternary relationship from three binary ones on a diagram?</td><td>A ternary relationship's diamond touches THREE entity sets directly with three lines from ONE diamond; three binary relationships would be three separate diamonds, each with two lines</td></tr>
<tr><td>16. Why can't you always replace a ternary relationship with three binary ones?</td><td>You lose which-combination-actually-happened — three pairwise facts don't reconstruct one three-way fact (e.g. which supplier shipped which part to which project)</td></tr>
<tr><td>17. What is a recursive relationship?</td><td>A relationship between an entity set and itself, requiring two distinct role names for the two ends</td></tr>
<tr><td>18. How do you tell a symmetric recursive relationship from a directed one?</td><td>Ask whether "A relates to B" automatically implies "B relates to A" (symmetric, e.g. friendship) or is a separate fact (directed, e.g. supervises, or a route)</td></tr>
<tr><td>19. How many foreign keys does a symmetric recursive M-N's junction table need, and how do you avoid storing each pair twice?</td><td>Two foreign keys, both to the same parent table; a CHECK like <code>id1 &lt; id2</code> keeps one row per pair</td></tr>
<tr><td>20. What does "total participation" mean, and how do you spot it in a paragraph?</td><td>Every entity of that set MUST take part in the relationship (e.g. "every order has a customer") — modelled with a NOT NULL foreign key; "partial participation" allows a NULL foreign key</td></tr>
</tbody>
</table>
<p class="nhan">Subclasses, generalisation, design decisions</p>
<table>
<thead><tr><th>Question</th><th>Model answer</th></tr></thead>
<tbody>
<tr><td>21. What is an isa hierarchy (subclass/superclass)?</td><td>A special-case entity set that inherits every attribute of a broader (super) entity set and adds attributes of its own</td></tr>
<tr><td>22. What does "disjoint" mean for subclasses, versus "overlapping"?</td><td>Disjoint: an entity can be in at most one subclass at a time (a staff member is a Doctor OR a Nurse, never both); overlapping allows both at once</td></tr>
<tr><td>23. What does "complete" (a.k.a. "total") specialisation mean, versus "partial"?</td><td>Complete: every entity of the superclass MUST belong to some subclass; partial: some entities can stay "just" the superclass, in no subclass</td></tr>
<tr><td>24. What are the two common ways to store a subclass in tables, and their trade-off?</td><td>(a) one table per subclass sharing the parent's key (this workshop's choice: clean, enforces the right columns per subtype); (b) one flat table with nullable columns for every subtype's extra facts (simpler to query everything at once, but loses the guarantee that the "wrong" columns stay empty)</td></tr>
<tr><td>25. Why might you choose the "one flat table" approach anyway?</td><td>When subtypes share almost all behaviour and queries usually need columns from several subtypes together — fewer joins, at the cost of weaker guarantees</td></tr>
</tbody>
</table>
<p class="nhan">Common mistakes and translation to SQL</p>
<table>
<thead><tr><th>Question</th><th>Model answer</th></tr></thead>
<tbody>
<tr><td>26. Why must a composite key be referenced by a composite foreign key, never by separate single-column ones?</td><td>A single-column FK can only guarantee that ONE piece of the parent's key exists somewhere — it cannot guarantee that the SPECIFIC COMBINATION exists, which is what the parent's actual key requires</td></tr>
<tr><td>27. In what order should CREATE TABLE statements run, and why?</td><td>Parent tables before child tables — a foreign key cannot reference a table (or row) that does not exist yet</td></tr>
<tr><td>28. What do you do when two tables need to reference each other (a true circular dependency, like Branch↔Employee's manager)?</td><td>Create one table without the circular column, create the other (which can reference the first), then ALTER TABLE ADD the missing column and foreign key on the first</td></tr>
<tr><td>29. If a business rule compares two columns of the SAME row (e.g. checkOut > checkIn), is that an entity attribute rule or a relationship rule?</td><td>Neither by itself — it's usually written as a CHECK constraint on the table holding both columns, independent of entity/relationship classification</td></tr>
<tr><td>30. A relationship connects an entity set to itself through a DIFFERENT table (not a direct self-FK) — is that "recursive"?</td><td>Not in the strict sense: true recursion is the entity set referencing itself directly. A third table holding two foreign keys back to the same entity set (like case 10's Transaction→Account twice) is a relationship with two roles towards one entity set, a related but distinct idea worth naming correctly in an oral exam</td></tr>
<tr><td>31. What is the very first thing a PE marker checks on your ERD/schema answer?</td><td>That every table has a primary key, and that every "belongs to/for/with" phrase in the paragraph became a foreign key on the correct (many) side</td></tr>
<tr><td>32. What is the very last thing you should do before submitting a schema-design answer?</td><td>Run your own CREATE TABLE statements top to bottom on a blank database and confirm they execute with no errors — a diagram that "looks right" but does not compile loses marks a working one would have kept</td></tr>
</tbody>
</table>`,
    `<h2>🎤 Ngân hàng câu hỏi vấn đáp — 32 câu giảng viên thật sự hay hỏi khi nhìn vào sơ đồ của bạn</h2>
<p class="nhan">Khái niệm cơ bản</p>
<table>
<thead><tr><th>Câu hỏi</th><th>Câu trả lời mẫu</th></tr></thead>
<tbody>
<tr><td>1. Thực thể và tập thực thể khác nhau thế nào?</td><td>Thực thể là một đối tượng cụ thể (đúng sinh viên này); tập thực thể là cả tập hợp các thực thể giống nhau (mọi sinh viên) — hộp trên sơ đồ đại diện cho TẬP, không phải một dòng</td></tr>
<tr><td>2. Thuộc tính và liên kết khác nhau thế nào?</td><td>Thuộc tính mô tả MỘT tập thực thể, đứng một mình; liên kết nối HAI HAY NHIỀU tập thực thể lại với nhau</td></tr>
<tr><td>3. "Tỉ lệ bản số" nghĩa là gì?</td><td>Bao nhiêu thực thể ở một phía của liên kết nối được với một thực thể ở phía kia: 1-1, 1-M, hay M-N</td></tr>
<tr><td>4. Vì sao hình thoi trong ký hiệu Chen cần có tên?</td><td>Vì cùng hai tập thực thể có thể nối bằng nhiều hơn một liên kết (vd Employee-Department bằng "làm việc tại" và riêng "quản lý") — tên giúp phân biệt đang nói tới liên kết nào</td></tr>
<tr><td>5. Thuộc tính khoá là gì, và vẽ thế nào?</td><td>(Các) thuộc tính xác định duy nhất mọi thực thể trong tập; vẽ gạch chân trong ký hiệu Chen</td></tr>
<tr><td>6. Bản thân liên kết có thuộc tính riêng được không? Cho ví dụ</td><td>Có — một sự kiện chỉ có nghĩa khi biết cả hai phía, vd <code>grade</code> trên Student-enrols-Course, hay <code>qty</code>/<code>unitPrice</code> trên Order-contains-Product</td></tr>
</tbody>
</table>
<p class="nhan">Thực thể yếu, đa trị, phức hợp, dẫn xuất</p>
<table>
<thead><tr><th>Câu hỏi</th><th>Câu trả lời mẫu</th></tr></thead>
<tbody>
<tr><td>7. Điều gì làm một tập thực thể trở thành "yếu"?</td><td>Nó không có thuộc tính nào tự nó đã duy nhất — chỉ xác định được cùng với khoá chính của tập thực thể chủ (hỗ trợ) của nó</td></tr>
<tr><td>8. "Khoá bộ phận" là gì?</td><td>Thuộc tính của thực thể yếu chỉ duy nhất TRONG PHẠM VI một chủ, không duy nhất trên cả tập thực thể</td></tr>
<tr><td>9. Bảng của một thực thể yếu có cần tự có id AUTO_INCREMENT riêng không?</td><td>Không — khoá chính của nó là ghép của (khoá của chủ + khoá bộ phận); thêm một id thay thế riêng vẫn được nhưng không bắt buộc và có thể che mất khoá nghiệp vụ thật</td></tr>
<tr><td>10. Một thuộc tính đa trị chuyển thành bảng thế nào?</td><td>Thành bảng riêng, có khoá ngoại về thực thể chủ, mỗi dòng một giá trị (vd GuestPhone(guestID, phone))</td></tr>
<tr><td>11. Một thuộc tính phức hợp (vd địa chỉ = đường+thành phố) chuyển thành cột thế nào?</td><td>Mỗi phần một cột, ngay trên bảng của thực thể chủ — không cần bảng riêng</td></tr>
<tr><td>12. Vì sao thuộc tính dẫn xuất (vd tuổi, hay tổng tiền đơn) thường KHÔNG lưu thành cột?</td><td>Vì tính được ngay từ dữ liệu đã lưu khác khi cần, và một bản sao lưu sẵn không cập nhật có thể âm thầm cũ/sai khi giá trị gốc đổi</td></tr>
</tbody>
</table>
<p class="nhan">Liên kết, bản số, khoá ngoại</p>
<table>
<thead><tr><th>Câu hỏi</th><th>Câu trả lời mẫu</th></tr></thead>
<tbody>
<tr><td>13. Với liên kết 1-M, khoá ngoại đặt ở phía nào?</td><td>Phía "nhiều" — phía chỉ liên quan tới ĐÚNG MỘT bên kia, nên một cột là đủ ghi lại đó là ai</td></tr>
<tr><td>14. Với liên kết M-N, cần bao nhiêu bảng?</td><td>Bảng nối/liên kết riêng của nó, có khoá chính ghép từ hai (hay nhiều) khoá ngoại</td></tr>
<tr><td>15. Làm sao phân biệt một liên kết ba ngôi với ba liên kết đôi trên sơ đồ?</td><td>Hình thoi của liên kết ba ngôi chạm trực tiếp BA tập thực thể bằng ba đường từ MỘT hình thoi; ba liên kết đôi sẽ là ba hình thoi riêng, mỗi cái hai đường</td></tr>
<tr><td>16. Vì sao không phải lúc nào cũng thay được liên kết ba ngôi bằng ba liên kết đôi?</td><td>Bạn mất thông tin tổ hợp nào thật sự xảy ra — ba sự kiện từng cặp không dựng lại được một sự kiện ba chiều (vd nhà cung cấp nào gửi linh kiện nào cho dự án nào)</td></tr>
<tr><td>17. Liên kết đệ quy là gì?</td><td>Liên kết giữa một tập thực thể với chính nó, cần hai tên vai trò khác nhau cho hai đầu</td></tr>
<tr><td>18. Làm sao phân biệt liên kết đệ quy đối xứng với có hướng?</td><td>Hỏi "A liên quan tới B" có tự động nghĩa "B liên quan tới A" không (đối xứng, vd kết bạn) hay là một sự kiện tách rời (có hướng, vd giám sát, hay tuyến đường)</td></tr>
<tr><td>19. Bảng nối của một M-N đệ quy đối xứng cần bao nhiêu khoá ngoại, và làm sao tránh lưu mỗi cặp hai lần?</td><td>Hai khoá ngoại, cả hai cùng trỏ về một bảng cha; một CHECK như <code>id1 &lt; id2</code> giữ mỗi cặp chỉ một dòng</td></tr>
<tr><td>20. "Tham gia đầy đủ" (total participation) nghĩa là gì, và nhận ra thế nào trong đề?</td><td>Mọi thực thể của tập đó BẮT BUỘC tham gia liên kết (vd "mọi đơn hàng đều có khách hàng") — mô hình bằng khoá ngoại NOT NULL; "tham gia bộ phận" cho phép khoá ngoại NULL</td></tr>
</tbody>
</table>
<p class="nhan">Lớp con, tổng quát hoá, quyết định thiết kế</p>
<table>
<thead><tr><th>Câu hỏi</th><th>Câu trả lời mẫu</th></tr></thead>
<tbody>
<tr><td>21. Phân cấp isa (lớp con/lớp cha) là gì?</td><td>Một tập thực thể trường hợp đặc biệt, kế thừa mọi thuộc tính của tập thực thể rộng hơn (lớp cha) và thêm thuộc tính riêng</td></tr>
<tr><td>22. "Tách rời" (disjoint) nghĩa là gì cho lớp con, khác "chồng lấn" (overlapping) thế nào?</td><td>Tách rời: một thực thể tối đa ở một lớp con tại một thời điểm (một nhân viên là Doctor HOẶC Nurse, không bao giờ cả hai); chồng lấn cho phép cả hai cùng lúc</td></tr>
<tr><td>23. "Đầy đủ" (complete/total) trong tổng quát hoá nghĩa là gì, khác "bộ phận" (partial) thế nào?</td><td>Đầy đủ: mọi thực thể của lớp cha BẮT BUỘC thuộc một lớp con nào đó; bộ phận: một số thực thể có thể ở lại "chỉ" lớp cha, không thuộc lớp con nào</td></tr>
<tr><td>24. Hai cách thường dùng để lưu lớp con thành bảng là gì, và đánh đổi ra sao?</td><td>(a) mỗi lớp con một bảng riêng, dùng chung khoá của lớp cha (cách xưởng này chọn: sạch, ép đúng cột theo đúng phân lớp); (b) một bảng phẳng duy nhất với các cột cho phép NULL cho thông tin riêng của từng phân lớp (dễ truy vấn mọi thứ cùng lúc hơn, nhưng mất đảm bảo cột "sai" luôn trống)</td></tr>
<tr><td>25. Vì sao đôi khi vẫn chọn cách "một bảng phẳng"?</td><td>Khi các phân lớp gần như giống hệt nhau về hành vi và truy vấn thường cần cột của nhiều phân lớp cùng lúc — ít join hơn, đổi lại đảm bảo yếu hơn</td></tr>
</tbody>
</table>
<p class="nhan">Lỗi hay gặp và dịch sang SQL</p>
<table>
<thead><tr><th>Câu hỏi</th><th>Câu trả lời mẫu</th></tr></thead>
<tbody>
<tr><td>26. Vì sao một khoá ghép phải được tham chiếu bằng một khoá ngoại ghép, không bao giờ bằng các khoá ngoại đơn cột riêng lẻ?</td><td>Một khoá ngoại đơn cột chỉ đảm bảo được MỘT MẢNH của khoá cha tồn tại ở đâu đó — nó không đảm bảo được ĐÚNG TỔ HỢP đó tồn tại, điều mà khoá thật của bảng cha đòi hỏi</td></tr>
<tr><td>27. Các câu CREATE TABLE nên chạy theo thứ tự nào, vì sao?</td><td>Bảng cha trước bảng con — một khoá ngoại không thể tham chiếu một bảng (hay dòng) chưa tồn tại</td></tr>
<tr><td>28. Khi hai bảng cần tham chiếu lẫn nhau (phụ thuộc vòng thật sự, như Branch↔trưởng chi nhánh của Employee) thì làm sao?</td><td>Tạo một bảng không có cột gây vòng, tạo bảng kia (tham chiếu được bảng đầu ngay), rồi ALTER TABLE ADD cột và khoá ngoại còn thiếu vào bảng đầu</td></tr>
<tr><td>29. Nếu một luật nghiệp vụ so sánh hai cột của CÙNG một dòng (vd checkOut > checkIn), đó là luật thuộc tính thực thể hay luật liên kết?</td><td>Không hẳn cái nào — thường viết thành ràng buộc CHECK trên bảng chứa cả hai cột, độc lập với phân loại thực thể/liên kết</td></tr>
<tr><td>30. Một liên kết nối một tập thực thể với chính nó qua một bảng KHÁC (không phải khoá ngoại tự trỏ trực tiếp) — đó có phải "đệ quy" không?</td><td>Không theo nghĩa chặt: đệ quy thật là tập thực thể tự trỏ trực tiếp về chính nó. Một bảng thứ ba mang hai khoá ngoại cùng trỏ về một tập thực thể (như Transaction→Account hai lần ở đề 10) là một liên kết có hai vai trò tới một tập thực thể — một ý liên quan nhưng khác, đáng gọi đúng tên khi vấn đáp</td></tr>
<tr><td>31. Điều đầu tiên người chấm PE kiểm trên bài ERD/lược đồ của bạn là gì?</td><td>Mọi bảng có khoá chính, và mọi cụm "thuộc về/dành cho/với" trong đề đã thành khoá ngoại ở đúng phía (nhiều)</td></tr>
<tr><td>32. Điều cuối cùng nên làm trước khi nộp bài thiết kế lược đồ?</td><td>Chạy chính các câu CREATE TABLE của mình từ đầu tới cuối trên một database trống và xác nhận chạy không lỗi — một sơ đồ "trông đúng" mà không biên dịch được mất điểm mà một sơ đồ chạy được sẽ giữ lại</td></tr>
</tbody>
</table>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>identifying relationship</strong></td><td>liên kết định danh</td><td>The supporting relationship from a weak entity set to its owner — it contributes the owner's key into the weak entity's own key.</td></tr>
<tr><td><strong>total participation</strong></td><td>tham gia đầy đủ</td><td>Every entity of a set must take part in a given relationship — modelled with a NOT NULL foreign key.</td></tr>
<tr><td><strong>partial participation</strong></td><td>tham gia bộ phận</td><td>Some entities of a set may not take part in a given relationship — modelled with a nullable foreign key.</td></tr>
<tr><td><strong>disjoint subclasses</strong></td><td>lớp con tách rời</td><td>An entity can belong to at most one of the subclasses at a time.</td></tr>
<tr><td><strong>overlapping subclasses</strong></td><td>lớp con chồng lấn</td><td>An entity can belong to more than one subclass at the same time.</td></tr>
<tr><td><strong>complete (total) specialisation</strong></td><td>tổng quát hoá đầy đủ</td><td>Every entity of the superclass must belong to some subclass.</td></tr>
<tr><td><strong>symmetric relationship</strong></td><td>liên kết đối xứng</td><td>A recursive relationship where "A relates to B" already implies "B relates to A" — stored once per pair.</td></tr>
<tr><td><strong>directed relationship</strong></td><td>liên kết có hướng</td><td>A recursive relationship where the two directions are separate facts, each stored as its own row.</td></tr>
<tr><td><strong>junction table</strong></td><td>bảng nối</td><td>The table a many-to-many (or n-ary) relationship becomes, holding one foreign key per participating entity set.</td></tr>
<tr><td><strong>circular dependency (tables)</strong></td><td>phụ thuộc vòng</td><td>Two tables each needing a foreign key into the other — resolved by creating one without that column first, then ALTER TABLE to add it back.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>identifying relationship</strong></td><td>liên kết định danh</td><td>Liên kết hỗ trợ từ một thực thể yếu tới chủ của nó — nó góp khoá của chủ vào khoá của chính thực thể yếu.</td></tr>
<tr><td><strong>total participation</strong></td><td>tham gia đầy đủ</td><td>Mọi thực thể của một tập bắt buộc tham gia một liên kết cho trước — mô hình bằng khoá ngoại NOT NULL.</td></tr>
<tr><td><strong>partial participation</strong></td><td>tham gia bộ phận</td><td>Một số thực thể của một tập có thể không tham gia một liên kết cho trước — mô hình bằng khoá ngoại cho phép NULL.</td></tr>
<tr><td><strong>disjoint subclasses</strong></td><td>lớp con tách rời</td><td>Một thực thể chỉ thuộc tối đa một lớp con tại một thời điểm.</td></tr>
<tr><td><strong>overlapping subclasses</strong></td><td>lớp con chồng lấn</td><td>Một thực thể có thể thuộc nhiều hơn một lớp con cùng lúc.</td></tr>
<tr><td><strong>complete (total) specialisation</strong></td><td>tổng quát hoá đầy đủ</td><td>Mọi thực thể của lớp cha bắt buộc thuộc một lớp con nào đó.</td></tr>
<tr><td><strong>symmetric relationship</strong></td><td>liên kết đối xứng</td><td>Liên kết đệ quy mà "A liên quan B" đã ngầm nghĩa "B liên quan A" — lưu một lần cho mỗi cặp.</td></tr>
<tr><td><strong>directed relationship</strong></td><td>liên kết có hướng</td><td>Liên kết đệ quy mà hai chiều là hai sự kiện tách rời, mỗi chiều lưu thành một dòng riêng.</td></tr>
<tr><td><strong>junction table</strong></td><td>bảng nối</td><td>Bảng mà một liên kết nhiều-nhiều (hay n ngôi) trở thành, mang một khoá ngoại cho mỗi tập thực thể tham gia.</td></tr>
<tr><td><strong>circular dependency (tables)</strong></td><td>phụ thuộc vòng</td><td>Hai bảng cùng cần khoá ngoại trỏ vào nhau — giải quyết bằng cách tạo một bảng trước không có cột đó, rồi ALTER TABLE thêm lại sau.</td></tr>
</tbody>
</table>`),
  ].join('\n'),
};

/* ───────── 3.5 — 🧪 Practice + 🗂 Glossary + 📌 Summary · ER modelling: requirements → ERD → tables ───────── */
const L_on_ch3 = {
  title: '3.5 — 🧪 Practice + 🗂 Glossary + 📌 Summary · ER modelling: requirements → ERD → tables|||3.5 — 🧪 Thực hành + 🗂 Thuật ngữ + 📌 Tóm tắt · Mô hình ER: đề nghiệp vụ → ERD → bảng',
  slug: 'dbi202-on-ch3',
  type: 'VIDEO',
  description: '7 bài tập đúng dạng câu 1 đề PE: đọc đoạn nghiệp vụ, tìm thực thể – thuộc tính – liên kết – bản số, vẽ ERD, chuyển sang lược đồ quan hệ và viết CREATE TABLE chạy thật trên SQL Server (đăng ký học, khách sạn có phòng là thực thể yếu, cửa hàng có thuộc tính phức hợp/đa trị/dẫn xuất, liên kết ba ngôi, lớp con, liên kết 1-1 và đệ quy, đề mini phòng khám); 20 thuật ngữ Anh–Việt; tóm tắt 8 ý.',
  content: [
    bi(`<span class="eyebrow">Chapter 3 · Lesson 3.5 · Practice &amp; review</span>
<h2>From a business paragraph to CREATE TABLE — practise like PE question 1</h2>
<p class="lead">Seven exercises, each starting from a paragraph of requirements like the ones in the practical exam and the assignment. For each one: find the entities, attributes and relationships, draw the ERD, write the relational schema, then the CREATE TABLE statements — which really run on SQL Server below, followed by a self-check query that lists every table with its number of columns and foreign keys.</p>
<div class="callout"><strong>How to use this page.</strong>
<ol>
<li>Read the task only. On paper, list the nouns (entity candidates), the verbs (relationships) and the numbers ("each", "many", "at most one") — they give the cardinality.</li>
<li>Draw the ERD, then write the schema in the form Table(<u>key</u>, column, …) and the CREATE TABLE statements in SSMS.</li>
<li>Run the self-check query (it works on any database): compare the number of tables, columns and foreign keys with the solution. Only then read the solution and the trap below it.</li>
</ol></div>
<table>
<thead><tr><th>Step</th><th>Question you ask the paragraph</th><th>Output</th></tr></thead>
<tbody>
<tr><td>1</td><td>Which nouns have facts of their own?</td><td>entity sets + attributes</td></tr>
<tr><td>2</td><td>Which attribute identifies each one? Can it be identified alone?</td><td>keys; strong or weak</td></tr>
<tr><td>3</td><td>Which verbs link two nouns? Ask "one or many?" from both sides</td><td>relationships + cardinality</td></tr>
<tr><td>4</td><td>Any attribute that is a list, a group or computed?</td><td>multivalued / composite / derived</td></tr>
<tr><td>5</td><td>Apply the conversion rules (lesson 3.B)</td><td>schema</td></tr>
<tr><td>6</td><td>Parents first, children after; composite FKs for composite keys</td><td>CREATE TABLE</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 3 · Bài 3.5 · Thực hành &amp; ôn tập</span>
<h2>Từ một đoạn nghiệp vụ tới CREATE TABLE — luyện đúng như câu 1 đề PE</h2>
<p class="lead">Bảy bài tập, bài nào cũng bắt đầu từ một đoạn mô tả yêu cầu giống đề thi thực hành (PE) và assignment. Với mỗi bài: tìm thực thể, thuộc tính và liên kết, vẽ ERD, viết lược đồ quan hệ, rồi viết các câu CREATE TABLE — chúng chạy thật trên SQL Server ngay bên dưới, kèm một câu truy vấn tự kiểm liệt kê mọi bảng cùng số cột và số khoá ngoại.</p>
<div class="callout"><strong>Cách dùng trang này.</strong>
<ol>
<li>Chỉ đọc đề. Trên giấy, liệt kê các danh từ (ứng viên thực thể), động từ (liên kết) và các chữ chỉ số lượng ("mỗi", "nhiều", "tối đa một") — chúng cho bạn bản số.</li>
<li>Vẽ ERD, rồi viết lược đồ dạng Bảng(<u>khoá</u>, cột, …) và các câu CREATE TABLE trong SSMS.</li>
<li>Chạy câu truy vấn tự kiểm (chạy được trên CSDL nào cũng được): so số bảng, số cột, số khoá ngoại với lời giải. Lúc đó mới đọc lời giải và cái bẫy bên dưới.</li>
</ol></div>
<table>
<thead><tr><th>Bước</th><th>Câu hỏi đặt cho đoạn đề</th><th>Kết quả</th></tr></thead>
<tbody>
<tr><td>1</td><td>Danh từ nào có thông tin riêng?</td><td>các tập thực thể + thuộc tính</td></tr>
<tr><td>2</td><td>Thuộc tính nào xác định từng thực thể? Nó tự xác định được không?</td><td>khoá; thực thể mạnh hay yếu</td></tr>
<tr><td>3</td><td>Động từ nào nối hai danh từ? Hỏi "một hay nhiều?" từ cả hai phía</td><td>các liên kết + bản số</td></tr>
<tr><td>4</td><td>Có thuộc tính nào là một danh sách, một nhóm, hay tính ra được?</td><td>đa trị / phức hợp / dẫn xuất</td></tr>
<tr><td>5</td><td>Áp các luật chuyển đổi (bài 3.B)</td><td>lược đồ quan hệ</td></tr>
<tr><td>6</td><td>Bảng cha trước, bảng con sau; khoá ngoại ghép cho khoá ghép</td><td>CREATE TABLE</td></tr>
</tbody>
</table>`),
    bi(`<h3>🧪 Exercise 1 — Course registration: 1-M and M-N (PE style · ~15 min)</h3>
<p class="nhan">Task</p>
<p>FPTU wants to store its <strong>students</strong> (student ID, full name, e-mail — unique), its <strong>courses</strong> (course code, name, number of credits between 1 and 10) and its <strong>lecturers</strong> (lecturer ID, full name). Each course is taught by exactly one lecturer; a lecturer can teach several courses. A student <strong>enrols</strong> in many courses each semester and gets a grade from 0 to 10; a failed course can be retaken in a later semester.</p>
<p class="nhan">Step 1–3 — nouns, verbs, cardinality</p>
<table>
<thead><tr><th>Relationship</th><th>From one A</th><th>From one B</th><th>Type</th></tr></thead>
<tbody>
<tr><td>Lecturer — teaches — Course</td><td>a lecturer teaches many courses</td><td>a course is taught by exactly one lecturer</td><td>1-M → FK lecturerID in Course</td></tr>
<tr><td>Student — enrolls — Course (semester, grade)</td><td>a student takes many courses</td><td>a course has many students</td><td>M-N → table Enroll</td></tr>
</tbody>
</table>
<p class="nhan">ERD</p>
<pre><code class="language-plaintext">[Lecturer] lecturerID*, fullName
     │ 1
  &lt;teaches&gt;
     │ N
[Course] courseCode*, courseName, credits  ── N ──&lt;enrolls (semester, grade)&gt;── M ── [Student] studentID*, fullName, email</code></pre>
<p class="nhan">Schema → CREATE TABLE (run on SQL Server) → self-check</p>
<p>Lecturer(<u>lecturerID</u>, fullName) · Course(<u>courseCode</u>, courseName, credits, lecturerID → Lecturer) · Student(<u>studentID</u>, fullName, email) · Enroll(<u>studentID</u>, <u>courseCode</u>, <u>semester</u>, grade)</p>
<pre><code class="language-sql">CREATE TABLE Lecturer (
  lecturerID CHAR(6)      PRIMARY KEY,
  fullName   NVARCHAR(50) NOT NULL
);
CREATE TABLE Course (
  courseCode CHAR(6)      PRIMARY KEY,
  courseName NVARCHAR(80) NOT NULL,
  credits    INT          NOT NULL CHECK (credits BETWEEN 1 AND 10),
  lecturerID CHAR(6)      NOT NULL REFERENCES Lecturer(lecturerID)   -- Teaches 1-N: FK on the N side
);
CREATE TABLE Student (
  studentID CHAR(8)      PRIMARY KEY,
  fullName  NVARCHAR(50) NOT NULL,
  email     VARCHAR(100) UNIQUE
);
CREATE TABLE Enroll (                                               -- M-N: its own table
  studentID  CHAR(8) REFERENCES Student(studentID),
  courseCode CHAR(6) REFERENCES Course(courseCode),
  semester   CHAR(6),                                               -- in the key: a course can be retaken
  grade      DECIMAL(3,1) CHECK (grade BETWEEN 0 AND 10),
  PRIMARY KEY (studentID, courseCode, semester)
);</code></pre>
<pre><code class="language-sql">SELECT t.name AS table_name,                                        -- self-check: tables, columns, FKs
       (SELECT COUNT(*) FROM sys.columns c WHERE c.object_id = t.object_id)             AS cols,
       (SELECT COUNT(*) FROM sys.foreign_keys f WHERE f.parent_object_id = t.object_id) AS fks
FROM sys.tables t
ORDER BY t.name;</code></pre>
<div class="out">(2 rows affected)<br>
(2 rows affected)<br>
(2 rows affected)<br>
(4 rows affected)</div>
<table>
<thead><tr><th>table_name</th><th>cols</th><th>fks</th></tr></thead>
<tbody>
<tr><td>Course</td><td>4</td><td>1</td></tr>
<tr><td>Enroll</td><td>4</td><td>2</td></tr>
<tr><td>Lecturer</td><td>2</td><td>0</td></tr>
<tr><td>Student</td><td>3</td><td>0</td></tr>
</tbody>
</table>
<p>Expected: 4 tables; Course has 1 foreign key, Enroll 2. The sample data (not shown) enrols SE190001 in DBI202 twice — SU2026 and FA2026 — which the key accepts because semester is part of it.</p>
<div class="pitfall">Key of Enroll = (studentID, courseCode) looks natural, but then a retake in a later semester is refused. Read the paragraph for words like "retake", "again", "history": they put a date or semester into the key. The rules "grade between 0 and 10" and "credits between 1 and 10" are CHECK constraints — PE graders look for them.</div>`,
    `<h3>🧪 Bài 1 — Đăng ký học: 1-M và M-N (kiểu PE · ~15 phút)</h3>
<p class="nhan">Đề bài</p>
<p>FPTU muốn lưu <strong>sinh viên</strong> (mã sinh viên, họ tên, e-mail — không trùng), <strong>môn học</strong> (mã môn, tên môn, số tín chỉ từ 1 đến 10) và <strong>giảng viên</strong> (mã giảng viên, họ tên). Mỗi môn do đúng một giảng viên dạy; một giảng viên có thể dạy nhiều môn. Mỗi kỳ, một sinh viên <strong>đăng ký</strong> nhiều môn và nhận điểm từ 0 đến 10; môn trượt có thể học lại ở kỳ sau.</p>
<p class="nhan">Bước 1–3 — danh từ, động từ, bản số</p>
<table>
<thead><tr><th>Liên kết</th><th>Từ một A</th><th>Từ một B</th><th>Loại</th></tr></thead>
<tbody>
<tr><td>Lecturer — teaches (dạy) — Course</td><td>một giảng viên dạy nhiều môn</td><td>một môn do đúng một giảng viên dạy</td><td>1-M → khoá ngoại lecturerID trong Course</td></tr>
<tr><td>Student — enrolls (đăng ký) — Course (semester, grade)</td><td>một sinh viên học nhiều môn</td><td>một môn có nhiều sinh viên</td><td>M-N → bảng Enroll</td></tr>
</tbody>
</table>
<p class="nhan">ERD</p>
<pre><code class="language-plaintext">[Lecturer] lecturerID*, fullName
     │ 1
  &lt;teaches&gt;
     │ N
[Course] courseCode*, courseName, credits  ── N ──&lt;enrolls (semester, grade)&gt;── M ── [Student] studentID*, fullName, email</code></pre>
<p class="nhan">Lược đồ → CREATE TABLE (chạy trên SQL Server) → tự kiểm</p>
<p>Lecturer(<u>lecturerID</u>, fullName) · Course(<u>courseCode</u>, courseName, credits, lecturerID → Lecturer) · Student(<u>studentID</u>, fullName, email) · Enroll(<u>studentID</u>, <u>courseCode</u>, <u>semester</u>, grade)</p>
<pre><code class="language-sql">CREATE TABLE Lecturer (
  lecturerID CHAR(6)      PRIMARY KEY,
  fullName   NVARCHAR(50) NOT NULL
);
CREATE TABLE Course (
  courseCode CHAR(6)      PRIMARY KEY,
  courseName NVARCHAR(80) NOT NULL,
  credits    INT          NOT NULL CHECK (credits BETWEEN 1 AND 10),
  lecturerID CHAR(6)      NOT NULL REFERENCES Lecturer(lecturerID)   -- Teaches 1-N: khoá ngoại ở phía N
);
CREATE TABLE Student (
  studentID CHAR(8)      PRIMARY KEY,
  fullName  NVARCHAR(50) NOT NULL,
  email     VARCHAR(100) UNIQUE
);
CREATE TABLE Enroll (                                               -- M-N: bảng riêng
  studentID  CHAR(8) REFERENCES Student(studentID),
  courseCode CHAR(6) REFERENCES Course(courseCode),
  semester   CHAR(6),                                               -- nằm trong khoá: có thể học lại
  grade      DECIMAL(3,1) CHECK (grade BETWEEN 0 AND 10),
  PRIMARY KEY (studentID, courseCode, semester)
);</code></pre>
<pre><code class="language-sql">SELECT t.name AS table_name,                                        -- tự kiểm: bảng, cột, khoá ngoại
       (SELECT COUNT(*) FROM sys.columns c WHERE c.object_id = t.object_id)             AS cols,
       (SELECT COUNT(*) FROM sys.foreign_keys f WHERE f.parent_object_id = t.object_id) AS fks
FROM sys.tables t
ORDER BY t.name;</code></pre>
<div class="out">(2 rows affected)<br>
(2 rows affected)<br>
(2 rows affected)<br>
(4 rows affected)</div>
<table>
<thead><tr><th>table_name</th><th>cols</th><th>fks</th></tr></thead>
<tbody>
<tr><td>Course</td><td>4</td><td>1</td></tr>
<tr><td>Enroll</td><td>4</td><td>2</td></tr>
<tr><td>Lecturer</td><td>2</td><td>0</td></tr>
<tr><td>Student</td><td>3</td><td>0</td></tr>
</tbody>
</table>
<p>Kết quả mong đợi: 4 bảng; Course có 1 khoá ngoại, Enroll có 2. Dữ liệu mẫu (không hiện ra) cho SE190001 đăng ký DBI202 hai lần — SU2026 và FA2026 — khoá chấp nhận vì semester nằm trong khoá.</p>
<div class="pitfall">Khoá của Enroll = (studentID, courseCode) trông rất tự nhiên, nhưng khi đó học lại ở kỳ sau sẽ bị từ chối. Hãy tìm trong đề các chữ như "học lại", "lần nữa", "lịch sử": chúng đưa ngày hoặc học kỳ vào khoá. Các luật "điểm từ 0 đến 10" và "tín chỉ từ 1 đến 10" là ràng buộc CHECK — người chấm PE tìm đúng những dòng này.</div>`),
    bi(`<h3>🧪 Exercise 2 — Hotels: a weak entity and a multivalued attribute (PE style · ~20 min)</h3>
<p class="nhan">Task</p>
<p>A booking site stores <strong>hotels</strong> (hotel ID, name, city). Each hotel has <strong>rooms</strong> numbered inside the hotel (room 101 exists in many hotels), each with a type (single, double or suite) and a positive price. A <strong>guest</strong> has an ID, a full name and one or more phone numbers. A guest <strong>books</strong> a room for a check-in and a check-out date (check-out after check-in); a room can be booked many times over time.</p>
<p class="nhan">Analysis</p>
<table>
<thead><tr><th>Element</th><th>Decision</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Room</td><td>weak entity, partial key roomNo, owner Hotel</td><td>"numbered inside the hotel" — roomNo alone repeats</td></tr>
<tr><td>phones</td><td>multivalued attribute of Guest → table GuestPhone</td><td>"one or more phone numbers"</td></tr>
<tr><td>Booking</td><td>M-N Guest — Room with checkIn, checkOut</td><td>a guest books many rooms; a room is booked by many guests</td></tr>
<tr><td>key of Booking</td><td>(hotelID, roomNo, checkIn)</td><td>a room cannot be booked twice for the same night</td></tr>
</tbody>
</table>
<pre><code class="language-plaintext">[Hotel] hotelID*, name, city ══ 1 ══&lt;&lt;has&gt;&gt;══ N ══ [[Room]] roomNo (partial), type, price
[[Room]] ── N ──&lt;books (checkIn, checkOut)&gt;── M ── [Guest] guestID*, fullName, {phone}
                                               {…} = multivalued, [[ ]] = weak</code></pre>
<p>Hotel(<u>hotelID</u>, name, city) · Room(<u>hotelID</u>, <u>roomNo</u>, type, price) · Guest(<u>guestID</u>, fullName) · GuestPhone(<u>guestID</u>, <u>phone</u>) · Booking(guestID, <u>hotelID</u>, <u>roomNo</u>, <u>checkIn</u>, checkOut)</p>
<pre><code class="language-sql">CREATE TABLE Hotel (
  hotelID CHAR(4)      PRIMARY KEY,
  name    NVARCHAR(60) NOT NULL,
  city    NVARCHAR(30) NOT NULL
);
CREATE TABLE Room (                                                 -- weak entity: roomNo repeats across hotels
  hotelID CHAR(4)  REFERENCES Hotel(hotelID) ON DELETE CASCADE,
  roomNo  CHAR(4),
  type    VARCHAR(10) NOT NULL CHECK (type IN ('single', 'double', 'suite')),
  price   DECIMAL(10,0) NOT NULL CHECK (price &gt; 0),
  PRIMARY KEY (hotelID, roomNo)
);
CREATE TABLE Guest (
  guestID  INT          PRIMARY KEY,
  fullName NVARCHAR(50) NOT NULL
);
CREATE TABLE GuestPhone (                                           -- multivalued phones
  guestID INT         REFERENCES Guest(guestID),
  phone   VARCHAR(15),
  PRIMARY KEY (guestID, phone)
);
CREATE TABLE Booking (                                              -- M-N Guest-Room with dates
  guestID  INT     REFERENCES Guest(guestID),
  hotelID  CHAR(4),
  roomNo   CHAR(4),
  checkIn  DATE    NOT NULL,
  checkOut DATE    NOT NULL,
  PRIMARY KEY (hotelID, roomNo, checkIn),
  FOREIGN KEY (hotelID, roomNo) REFERENCES Room(hotelID, roomNo),   -- composite FK to a weak entity
  CHECK (checkOut &gt; checkIn)
);</code></pre>
<pre><code class="language-sql">SELECT t.name AS table_name,                                        -- self-check: tables, columns, FKs
       (SELECT COUNT(*) FROM sys.columns c WHERE c.object_id = t.object_id)             AS cols,
       (SELECT COUNT(*) FROM sys.foreign_keys f WHERE f.parent_object_id = t.object_id) AS fks
FROM sys.tables t
ORDER BY t.name;</code></pre>
<div class="out">(2 rows affected)<br>
(3 rows affected)<br>
(2 rows affected)<br>
(3 rows affected)<br>
(2 rows affected)</div>
<table>
<thead><tr><th>table_name</th><th>cols</th><th>fks</th></tr></thead>
<tbody>
<tr><td>Booking</td><td>5</td><td>2</td></tr>
<tr><td>Guest</td><td>2</td><td>0</td></tr>
<tr><td>GuestPhone</td><td>2</td><td>1</td></tr>
<tr><td>Hotel</td><td>3</td><td>0</td></tr>
<tr><td>Room</td><td>4</td><td>1</td></tr>
</tbody>
</table>
<div class="pitfall">Booking must reference Room with ONE composite foreign key <code>(hotelID, roomNo)</code>. Two separate foreign keys (hotelID → Hotel, roomNo → ?) cannot even be written, because roomNo alone is not a key of anything — a classic error message in the PE: "There are no primary or candidate keys in the referenced table that match the referencing column list".</div>`,
    `<h3>🧪 Bài 2 — Khách sạn: thực thể yếu và thuộc tính đa trị (kiểu PE · ~20 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Một trang đặt phòng lưu <strong>khách sạn</strong> (mã khách sạn, tên, thành phố). Mỗi khách sạn có các <strong>phòng</strong> đánh số trong phạm vi khách sạn đó (phòng 101 có ở nhiều khách sạn), mỗi phòng có loại (single, double hoặc suite) và giá dương. Một <strong>khách</strong> có mã, họ tên và một hoặc nhiều số điện thoại. Khách <strong>đặt</strong> một phòng với ngày nhận phòng và ngày trả phòng (trả sau nhận); theo thời gian một phòng được đặt nhiều lần.</p>
<p class="nhan">Phân tích</p>
<table>
<thead><tr><th>Phần tử</th><th>Quyết định</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td>Room</td><td>thực thể yếu, khoá bộ phận roomNo, chủ là Hotel</td><td>"đánh số trong phạm vi khách sạn" — riêng roomNo thì lặp</td></tr>
<tr><td>phones</td><td>thuộc tính đa trị của Guest → bảng GuestPhone</td><td>"một hoặc nhiều số điện thoại"</td></tr>
<tr><td>Booking</td><td>M-N Guest — Room kèm checkIn, checkOut</td><td>một khách đặt nhiều phòng; một phòng được nhiều khách đặt</td></tr>
<tr><td>khoá của Booking</td><td>(hotelID, roomNo, checkIn)</td><td>một phòng không thể bị đặt hai lần cho cùng một đêm</td></tr>
</tbody>
</table>
<pre><code class="language-plaintext">[Hotel] hotelID*, name, city ══ 1 ══&lt;&lt;has&gt;&gt;══ N ══ [[Room]] roomNo (bộ phận), type, price
[[Room]] ── N ──&lt;books (checkIn, checkOut)&gt;── M ── [Guest] guestID*, fullName, {phone}
                                               {…} = đa trị, [[ ]] = thực thể yếu</code></pre>
<p>Hotel(<u>hotelID</u>, name, city) · Room(<u>hotelID</u>, <u>roomNo</u>, type, price) · Guest(<u>guestID</u>, fullName) · GuestPhone(<u>guestID</u>, <u>phone</u>) · Booking(guestID, <u>hotelID</u>, <u>roomNo</u>, <u>checkIn</u>, checkOut)</p>
<pre><code class="language-sql">CREATE TABLE Hotel (
  hotelID CHAR(4)      PRIMARY KEY,
  name    NVARCHAR(60) NOT NULL,
  city    NVARCHAR(30) NOT NULL
);
CREATE TABLE Room (                                                 -- thực thể yếu: roomNo lặp lại giữa các khách sạn
  hotelID CHAR(4)  REFERENCES Hotel(hotelID) ON DELETE CASCADE,
  roomNo  CHAR(4),
  type    VARCHAR(10) NOT NULL CHECK (type IN ('single', 'double', 'suite')),
  price   DECIMAL(10,0) NOT NULL CHECK (price &gt; 0),
  PRIMARY KEY (hotelID, roomNo)
);
CREATE TABLE Guest (
  guestID  INT          PRIMARY KEY,
  fullName NVARCHAR(50) NOT NULL
);
CREATE TABLE GuestPhone (                                           -- thuộc tính đa trị phones
  guestID INT         REFERENCES Guest(guestID),
  phone   VARCHAR(15),
  PRIMARY KEY (guestID, phone)
);
CREATE TABLE Booking (                                              -- M-N Guest-Room kèm ngày
  guestID  INT     REFERENCES Guest(guestID),
  hotelID  CHAR(4),
  roomNo   CHAR(4),
  checkIn  DATE    NOT NULL,
  checkOut DATE    NOT NULL,
  PRIMARY KEY (hotelID, roomNo, checkIn),
  FOREIGN KEY (hotelID, roomNo) REFERENCES Room(hotelID, roomNo),   -- khoá ngoại ghép trỏ tới thực thể yếu
  CHECK (checkOut &gt; checkIn)
);</code></pre>
<pre><code class="language-sql">SELECT t.name AS table_name,                                        -- tự kiểm: bảng, cột, khoá ngoại
       (SELECT COUNT(*) FROM sys.columns c WHERE c.object_id = t.object_id)             AS cols,
       (SELECT COUNT(*) FROM sys.foreign_keys f WHERE f.parent_object_id = t.object_id) AS fks
FROM sys.tables t
ORDER BY t.name;</code></pre>
<div class="out">(2 rows affected)<br>
(3 rows affected)<br>
(2 rows affected)<br>
(3 rows affected)<br>
(2 rows affected)</div>
<table>
<thead><tr><th>table_name</th><th>cols</th><th>fks</th></tr></thead>
<tbody>
<tr><td>Booking</td><td>5</td><td>2</td></tr>
<tr><td>Guest</td><td>2</td><td>0</td></tr>
<tr><td>GuestPhone</td><td>2</td><td>1</td></tr>
<tr><td>Hotel</td><td>3</td><td>0</td></tr>
<tr><td>Room</td><td>4</td><td>1</td></tr>
</tbody>
</table>
<div class="pitfall">Booking phải tham chiếu Room bằng MỘT khoá ngoại ghép <code>(hotelID, roomNo)</code>. Hai khoá ngoại riêng (hotelID → Hotel, roomNo → ?) thậm chí không viết được, vì riêng roomNo không là khoá của bảng nào — thông báo lỗi kinh điển ở PE: "There are no primary or candidate keys in the referenced table that match the referencing column list".</div>`),
    bi(`<h3>🧪 Exercise 3 — Online shop: composite, multivalued and derived attributes (PE style · ~20 min)</h3>
<p class="nhan">Task</p>
<p>A shop stores <strong>customers</strong>: ID, name (first name, last name), address (street, district, city), several phone numbers and a birth date — the age is shown on screen but must not be stored. <strong>Products</strong> have an ID, a name and a price. A customer <strong>places</strong> orders (ID, date); an order <strong>contains</strong> several products, each with a quantity and the unit price at the time of sale. The total of an order is computed.</p>
<p class="nhan">Analysis</p>
<table>
<thead><tr><th>Attribute</th><th>Type</th><th>In the tables</th></tr></thead>
<tbody>
<tr><td>name (first, last), address (street, district, city)</td><td>composite</td><td>one column per part</td></tr>
<tr><td>phones</td><td>multivalued</td><td>table CustomerPhone(cusID, phone)</td></tr>
<tr><td>age, order total</td><td>derived</td><td>not stored — computed in the query</td></tr>
<tr><td>quantity, unitPrice</td><td>attributes of the M-N "contains"</td><td>columns of OrderLine</td></tr>
</tbody>
</table>
<pre><code class="language-plaintext">[Customer] cusID*, name(firstName, lastName), address(street, district, city), {phone}, birthDate, /age/
   │ 1 ──&lt;places&gt;── N [Orders] orderID*, orderDate, /total/
[Orders] ── M ──&lt;contains (quantity, unitPrice)&gt;── N ── [Product] productID*, name, price
                                               /…/ = derived, {…} = multivalued</code></pre>
<pre><code class="language-sql">CREATE TABLE Customer (
  cusID     INT          PRIMARY KEY,
  firstName NVARCHAR(20) NOT NULL,                                  -- composite name
  lastName  NVARCHAR(30) NOT NULL,
  street    NVARCHAR(60),                                           -- composite address
  district  NVARCHAR(30),
  city      NVARCHAR(30),
  birthDate DATE                                                    -- age is derived: not stored
);
CREATE TABLE CustomerPhone (
  cusID INT         REFERENCES Customer(cusID),
  phone VARCHAR(15),
  PRIMARY KEY (cusID, phone)
);
CREATE TABLE Product (
  productID INT          PRIMARY KEY,
  name      NVARCHAR(60) NOT NULL,
  price     DECIMAL(12,0) NOT NULL CHECK (price &gt;= 0)
);
CREATE TABLE Orders (                                               -- ORDER is a reserved word
  orderID   INT  PRIMARY KEY,
  orderDate DATE NOT NULL,
  cusID     INT  NOT NULL REFERENCES Customer(cusID)                -- Places 1-N
);
CREATE TABLE OrderLine (                                            -- Contains M-N with quantity, unitPrice
  orderID   INT REFERENCES Orders(orderID),
  productID INT REFERENCES Product(productID),
  quantity  INT NOT NULL CHECK (quantity &gt; 0),
  unitPrice DECIMAL(12,0) NOT NULL,                                 -- price at the time of sale
  PRIMARY KEY (orderID, productID)
);</code></pre>
<pre><code class="language-sql">SELECT o.orderID, c.lastName + N' ' + c.firstName AS customer,
       DATEDIFF(MONTH, c.birthDate, o.orderDate) / 12 AS ageAtOrder,  -- derived attribute 1
       SUM(l.quantity * l.unitPrice)                AS orderTotal    -- derived attribute 2
FROM Orders o
JOIN Customer c  ON c.cusID = o.cusID
JOIN OrderLine l ON l.orderID = o.orderID
GROUP BY o.orderID, c.lastName, c.firstName, c.birthDate, o.orderDate;</code></pre>
<div class="out">(1 row affected)<br>
(2 rows affected)<br>
(2 rows affected)<br>
(1 row affected)<br>
(2 rows affected)</div>
<table>
<thead><tr><th>orderID</th><th>customer</th><th>ageAtOrder</th><th>orderTotal</th></tr></thead>
<tbody>
<tr><td>500</td><td>Nguyễn An</td><td>22</td><td>1450000</td></tr>
</tbody>
</table>
<p>The order total 1,450,000 = 1 × 850,000 + 2 × 300,000, computed from OrderLine; the mouse was sold at 300,000 although its current price is 320,000 — that is why unitPrice is stored on the line.</p>
<div class="pitfall"><code>ORDER</code> is a reserved word: <code>CREATE TABLE Order</code> fails. Name the table Orders (or write [Order]). And never store a total or an age in a column "to be faster": the moment a line is added or a birthday passes, the stored value is wrong.</div>`,
    `<h3>🧪 Bài 3 — Cửa hàng trực tuyến: thuộc tính phức hợp, đa trị và dẫn xuất (kiểu PE · ~20 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Một cửa hàng lưu <strong>khách hàng</strong>: mã, họ tên (tên, họ), địa chỉ (đường, quận, thành phố), nhiều số điện thoại và ngày sinh — tuổi được hiện trên màn hình nhưng không được lưu. <strong>Sản phẩm</strong> có mã, tên và giá. Khách <strong>đặt</strong> các đơn hàng (mã, ngày); một đơn <strong>gồm</strong> nhiều sản phẩm, mỗi sản phẩm có số lượng và đơn giá tại lúc bán. Tổng tiền của đơn được tính ra.</p>
<p class="nhan">Phân tích</p>
<table>
<thead><tr><th>Thuộc tính</th><th>Loại</th><th>Trong bảng</th></tr></thead>
<tbody>
<tr><td>tên (tên, họ), địa chỉ (đường, quận, thành phố)</td><td>phức hợp (composite)</td><td>mỗi phần một cột</td></tr>
<tr><td>số điện thoại</td><td>đa trị (multivalued)</td><td>bảng CustomerPhone(cusID, phone)</td></tr>
<tr><td>tuổi, tổng tiền đơn</td><td>dẫn xuất (derived)</td><td>không lưu — tính trong câu truy vấn</td></tr>
<tr><td>quantity, unitPrice</td><td>thuộc tính của liên kết M-N "gồm"</td><td>các cột của OrderLine</td></tr>
</tbody>
</table>
<pre><code class="language-plaintext">[Customer] cusID*, name(firstName, lastName), address(street, district, city), {phone}, birthDate, /age/
   │ 1 ──&lt;places&gt;── N [Orders] orderID*, orderDate, /total/
[Orders] ── M ──&lt;contains (quantity, unitPrice)&gt;── N ── [Product] productID*, name, price
                                               /…/ = dẫn xuất, {…} = đa trị</code></pre>
<pre><code class="language-sql">CREATE TABLE Customer (
  cusID     INT          PRIMARY KEY,
  firstName NVARCHAR(20) NOT NULL,                                  -- tên phức hợp
  lastName  NVARCHAR(30) NOT NULL,
  street    NVARCHAR(60),                                           -- địa chỉ phức hợp
  district  NVARCHAR(30),
  city      NVARCHAR(30),
  birthDate DATE                                                    -- tuổi là dẫn xuất: không lưu
);
CREATE TABLE CustomerPhone (
  cusID INT         REFERENCES Customer(cusID),
  phone VARCHAR(15),
  PRIMARY KEY (cusID, phone)
);
CREATE TABLE Product (
  productID INT          PRIMARY KEY,
  name      NVARCHAR(60) NOT NULL,
  price     DECIMAL(12,0) NOT NULL CHECK (price &gt;= 0)
);
CREATE TABLE Orders (                                               -- ORDER là từ khoá
  orderID   INT  PRIMARY KEY,
  orderDate DATE NOT NULL,
  cusID     INT  NOT NULL REFERENCES Customer(cusID)                -- Places 1-N
);
CREATE TABLE OrderLine (                                            -- Contains M-N kèm quantity, unitPrice
  orderID   INT REFERENCES Orders(orderID),
  productID INT REFERENCES Product(productID),
  quantity  INT NOT NULL CHECK (quantity &gt; 0),
  unitPrice DECIMAL(12,0) NOT NULL,                                 -- giá lúc bán
  PRIMARY KEY (orderID, productID)
);</code></pre>
<pre><code class="language-sql">SELECT o.orderID, c.lastName + N' ' + c.firstName AS customer,
       DATEDIFF(MONTH, c.birthDate, o.orderDate) / 12 AS ageAtOrder,  -- thuộc tính dẫn xuất 1
       SUM(l.quantity * l.unitPrice)                AS orderTotal    -- thuộc tính dẫn xuất 2
FROM Orders o
JOIN Customer c  ON c.cusID = o.cusID
JOIN OrderLine l ON l.orderID = o.orderID
GROUP BY o.orderID, c.lastName, c.firstName, c.birthDate, o.orderDate;</code></pre>
<div class="out">(1 row affected)<br>
(2 rows affected)<br>
(2 rows affected)<br>
(1 row affected)<br>
(2 rows affected)</div>
<table>
<thead><tr><th>orderID</th><th>customer</th><th>ageAtOrder</th><th>orderTotal</th></tr></thead>
<tbody>
<tr><td>500</td><td>Nguyễn An</td><td>22</td><td>1450000</td></tr>
</tbody>
</table>
<p>Tổng đơn 1.450.000 = 1 × 850.000 + 2 × 300.000, tính từ OrderLine; con chuột được bán giá 300.000 dù giá hiện tại là 320.000 — đó là lý do phải lưu unitPrice trên từng dòng đơn.</p>
<div class="pitfall"><code>ORDER</code> là từ khoá dành riêng (reserved word): <code>CREATE TABLE Order</code> sẽ lỗi. Đặt tên bảng là Orders (hoặc viết [Order]). Và đừng bao giờ lưu tổng tiền hay tuổi vào một cột "cho nhanh": ngay khi thêm một dòng đơn hay qua một ngày sinh nhật, giá trị đã lưu thành sai.</div>`),
    bi(`<h3>🧪 Exercise 4 — Supplies: a ternary relationship, with and without an arrow (PE style · ~15 min)</h3>
<p class="nhan">Task</p>
<p>A construction company records which <strong>supplier</strong> supplies which <strong>part</strong> to which <strong>project</strong>, and in what quantity. (a) Any number of suppliers may supply the same part to the same project. (b) Variant: company policy changes — for a given project and part there is <strong>exactly one</strong> supplier.</p>
<pre><code class="language-plaintext">(a)  [Supplier] ──┐                          (b)  [Supplier] ◀──┐   (arrow: "one supplier")
                  &lt;supplies (quantity)&gt;                         &lt;supplies (quantity)&gt;
     [Part] ──────┤                               [Part] ───────┤
     [Project] ───┘                               [Project] ────┘</code></pre>
<p>(a) Supply(<u>supplierID</u>, <u>partID</u>, <u>projectID</u>, quantity) — no arrow, all three keys. (b) SupplyB(<u>partID</u>, <u>projectID</u>, supplierID, quantity) — the arrow side leaves the key.</p>
<pre><code class="language-sql">CREATE TABLE Supplier (supplierID CHAR(3) PRIMARY KEY, name NVARCHAR(40));
CREATE TABLE Part     (partID INT PRIMARY KEY, name NVARCHAR(40));
CREATE TABLE Project  (projectID CHAR(4) PRIMARY KEY, name NVARCHAR(40));
CREATE TABLE Supply (                                               -- version (a): no arrow
  supplierID CHAR(3) REFERENCES Supplier(supplierID),
  partID     INT     REFERENCES Part(partID),
  projectID  CHAR(4) REFERENCES Project(projectID),
  quantity   INT     NOT NULL,
  PRIMARY KEY (supplierID, partID, projectID)
);
CREATE TABLE SupplyB (                                              -- version (b): arrow into Supplier
  partID     INT     REFERENCES Part(partID),
  projectID  CHAR(4) REFERENCES Project(projectID),
  supplierID CHAR(3) NOT NULL REFERENCES Supplier(supplierID),
  quantity   INT     NOT NULL,
  PRIMARY KEY (partID, projectID)
);</code></pre>
<pre><code class="language-sql">INSERT INTO SupplyB VALUES (1, 'P001', 'S02', 30);                  -- (b): a second supplier is refused</code></pre>
<div class="out">(2 rows affected)<br>
(1 row affected)<br>
(1 row affected)<br>
(2 rows affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>rowsInSupply</th></tr></thead>
<tbody>
<tr><td>2</td></tr>
</tbody>
</table>
<div class="out"><b>Msg 2627, Level 14, State 1<br>
Violation of PRIMARY KEY constraint 'PK__SupplyB__784E063E5EC5E63E'. Cannot insert duplicate key in object 'dbo.SupplyB'. The duplicate key value is (1, P001).</b><br>
The statement has been terminated.</div>
<p>Two rows for (part 1, project P001) are fine in Supply; the same second supplier is refused by SupplyB's primary key — the arrow's meaning, enforced.</p>
<div class="pitfall">Do not break a ternary relationship into three binary ones (Supplier–Part, Part–Project, Supplier–Project): you lose which supplier sent which part to which project, and joining the three back produces combinations that never happened.</div>`,
    `<h3>🧪 Bài 4 — Cung ứng: liên kết ba ngôi, có và không có mũi tên (kiểu PE · ~15 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Một công ty xây dựng ghi lại <strong>nhà cung cấp</strong> nào cung cấp <strong>vật tư</strong> nào cho <strong>dự án</strong> nào, với số lượng bao nhiêu. (a) Bao nhiêu nhà cung cấp cùng cấp một vật tư cho cùng một dự án cũng được. (b) Biến thể: công ty đổi quy định — với một dự án và một vật tư thì có <strong>đúng một</strong> nhà cung cấp.</p>
<pre><code class="language-plaintext">(a)  [Supplier] ──┐                          (b)  [Supplier] ◀──┐   (mũi tên: "một nhà cung cấp")
                  &lt;supplies (quantity)&gt;                         &lt;supplies (quantity)&gt;
     [Part] ──────┤                               [Part] ───────┤
     [Project] ───┘                               [Project] ────┘</code></pre>
<p>(a) Supply(<u>supplierID</u>, <u>partID</u>, <u>projectID</u>, quantity) — không mũi tên, cả ba khoá. (b) SupplyB(<u>partID</u>, <u>projectID</u>, supplierID, quantity) — phía có mũi tên ra khỏi khoá.</p>
<pre><code class="language-sql">CREATE TABLE Supplier (supplierID CHAR(3) PRIMARY KEY, name NVARCHAR(40));
CREATE TABLE Part     (partID INT PRIMARY KEY, name NVARCHAR(40));
CREATE TABLE Project  (projectID CHAR(4) PRIMARY KEY, name NVARCHAR(40));
CREATE TABLE Supply (                                               -- bản (a): không mũi tên
  supplierID CHAR(3) REFERENCES Supplier(supplierID),
  partID     INT     REFERENCES Part(partID),
  projectID  CHAR(4) REFERENCES Project(projectID),
  quantity   INT     NOT NULL,
  PRIMARY KEY (supplierID, partID, projectID)
);
CREATE TABLE SupplyB (                                              -- bản (b): mũi tên chỉ vào Supplier
  partID     INT     REFERENCES Part(partID),
  projectID  CHAR(4) REFERENCES Project(projectID),
  supplierID CHAR(3) NOT NULL REFERENCES Supplier(supplierID),
  quantity   INT     NOT NULL,
  PRIMARY KEY (partID, projectID)
);</code></pre>
<pre><code class="language-sql">INSERT INTO SupplyB VALUES (1, 'P001', 'S02', 30);                  -- (b): nhà cung cấp thứ hai bị từ chối</code></pre>
<div class="out">(2 rows affected)<br>
(1 row affected)<br>
(1 row affected)<br>
(2 rows affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>rowsInSupply</th></tr></thead>
<tbody>
<tr><td>2</td></tr>
</tbody>
</table>
<div class="out"><b>Msg 2627, Level 14, State 1<br>
Violation of PRIMARY KEY constraint 'PK__SupplyB__784E063E5EC5E63E'. Cannot insert duplicate key in object 'dbo.SupplyB'. The duplicate key value is (1, P001).</b><br>
The statement has been terminated.</div>
<p>Hai dòng cho (vật tư 1, dự án P001) vẫn ổn trong Supply; nhà cung cấp thứ hai đó bị khoá chính của SupplyB từ chối — ý nghĩa của mũi tên được ép thực hiện.</p>
<div class="pitfall">Đừng bẻ liên kết ba ngôi thành ba liên kết hai ngôi (Supplier–Part, Part–Project, Supplier–Project): bạn mất thông tin nhà cung cấp nào gửi vật tư nào cho dự án nào, và nối ba bảng lại sẽ sinh ra những tổ hợp chưa từng xảy ra.</div>`),
    bi(`<h3>🧪 Exercise 5 — Employees: a subclass hierarchy stored two ways (PE style · ~15 min)</h3>
<p class="nhan">Task</p>
<p>Every <strong>employee</strong> (ID, full name, hire date) is either <strong>full-time</strong> (monthly salary) or <strong>part-time</strong> (hourly rate, hours per week ≤ 30) — never both, never neither. Store it (a) E/R style, (b) with one table and NULLs, and compute each employee's monthly cost (part-time: rate × hours × 4).</p>
<pre><code class="language-plaintext">             [Employee] empID*, fullName, hireDate
                △ isa (disjoint, complete)
       ┌────────┴─────────┐
[FullTime] monthlySalary   [PartTime] hourlyRate, hoursPerWeek</code></pre>
<pre><code class="language-sql">CREATE TABLE Employee (empID INT PRIMARY KEY, fullName NVARCHAR(50) NOT NULL, hireDate DATE);
CREATE TABLE FullTime (                                             -- E/R style: key of the root + own attributes
  empID         INT PRIMARY KEY REFERENCES Employee(empID) ON DELETE CASCADE,
  monthlySalary DECIMAL(12,0) NOT NULL
);
CREATE TABLE PartTime (
  empID        INT PRIMARY KEY REFERENCES Employee(empID) ON DELETE CASCADE,
  hourlyRate   DECIMAL(10,0) NOT NULL,
  hoursPerWeek INT NOT NULL CHECK (hoursPerWeek &lt;= 30)
);</code></pre>
<pre><code class="language-sql">CREATE TABLE EmployeeAll (                                          -- null style: one table + a type column
  empID         INT PRIMARY KEY,
  fullName      NVARCHAR(50) NOT NULL,
  hireDate      DATE,
  empType       CHAR(2) NOT NULL CHECK (empType IN ('FT', 'PT')),
  monthlySalary DECIMAL(12,0) NULL,
  hourlyRate    DECIMAL(10,0) NULL,
  hoursPerWeek  INT NULL,
  CHECK ((empType = 'FT' AND monthlySalary IS NOT NULL AND hourlyRate IS NULL)
      OR (empType = 'PT' AND hourlyRate IS NOT NULL AND monthlySalary IS NULL))
);</code></pre>
<pre><code class="language-sql">SELECT e.fullName,                                                  -- E/R style: monthly cost needs two outer joins
       COALESCE(f.monthlySalary, p.hourlyRate * p.hoursPerWeek * 4) AS monthlyCost
FROM Employee e
LEFT JOIN FullTime f ON f.empID = e.empID
LEFT JOIN PartTime p ON p.empID = e.empID;
SELECT fullName,                                                    -- null style: one table, no join
       COALESCE(monthlySalary, hourlyRate * hoursPerWeek * 4) AS monthlyCost
FROM EmployeeAll;</code></pre>
<div class="out">(2 rows affected)<br>
(1 row affected)<br>
(1 row affected)<br>
(2 rows affected)</div>
<table>
<thead><tr><th>fullName</th><th>monthlyCost</th></tr></thead>
<tbody>
<tr><td>Lan</td><td>25000000</td></tr>
<tr><td>Tú</td><td>4800000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>fullName</th><th>monthlyCost</th></tr></thead>
<tbody>
<tr><td>Lan</td><td>25000000</td></tr>
<tr><td>Tú</td><td>4800000</td></tr>
</tbody>
</table>
<p>Both designs give the same costs (Lan 25,000,000; Tú 60,000 × 20 × 4 = 4,800,000). The E/R style needs two outer joins; the NULL style needs a CHECK so that a full-time employee cannot also get an hourly rate. Because the hierarchy is disjoint and complete, a third design is allowed too: only FullTime and PartTime tables, each repeating fullName and hireDate (slide 27).</p>
<div class="pitfall">With the E/R style nothing stops the same empID from appearing in both FullTime and PartTime — "disjoint" needs an extra check (a trigger, Chapter 7). With the NULL style the CHECK above enforces it in one line.</div>`,
    `<h3>🧪 Bài 5 — Nhân viên: phân cấp lớp con lưu theo hai cách (kiểu PE · ~15 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Mỗi <strong>nhân viên</strong> (mã, họ tên, ngày vào làm) hoặc là <strong>toàn thời gian</strong> (lương tháng) hoặc là <strong>bán thời gian</strong> (lương giờ, số giờ mỗi tuần ≤ 30) — không bao giờ cả hai, không bao giờ không thuộc loại nào. Lưu (a) theo kiểu E/R, (b) bằng một bảng có NULL, và tính chi phí tháng của từng người (bán thời gian: lương giờ × số giờ × 4).</p>
<pre><code class="language-plaintext">             [Employee] empID*, fullName, hireDate
                △ isa (tách rời, đầy đủ)
       ┌────────┴─────────┐
[FullTime] monthlySalary   [PartTime] hourlyRate, hoursPerWeek</code></pre>
<pre><code class="language-sql">CREATE TABLE Employee (empID INT PRIMARY KEY, fullName NVARCHAR(50) NOT NULL, hireDate DATE);
CREATE TABLE FullTime (                                             -- kiểu E/R: khoá gốc + thuộc tính riêng
  empID         INT PRIMARY KEY REFERENCES Employee(empID) ON DELETE CASCADE,
  monthlySalary DECIMAL(12,0) NOT NULL
);
CREATE TABLE PartTime (
  empID        INT PRIMARY KEY REFERENCES Employee(empID) ON DELETE CASCADE,
  hourlyRate   DECIMAL(10,0) NOT NULL,
  hoursPerWeek INT NOT NULL CHECK (hoursPerWeek &lt;= 30)
);</code></pre>
<pre><code class="language-sql">CREATE TABLE EmployeeAll (                                          -- kiểu NULL: một bảng + cột loại
  empID         INT PRIMARY KEY,
  fullName      NVARCHAR(50) NOT NULL,
  hireDate      DATE,
  empType       CHAR(2) NOT NULL CHECK (empType IN ('FT', 'PT')),
  monthlySalary DECIMAL(12,0) NULL,
  hourlyRate    DECIMAL(10,0) NULL,
  hoursPerWeek  INT NULL,
  CHECK ((empType = 'FT' AND monthlySalary IS NOT NULL AND hourlyRate IS NULL)
      OR (empType = 'PT' AND hourlyRate IS NOT NULL AND monthlySalary IS NULL))
);</code></pre>
<pre><code class="language-sql">SELECT e.fullName,                                                  -- kiểu E/R: chi phí tháng cần hai phép nối ngoài
       COALESCE(f.monthlySalary, p.hourlyRate * p.hoursPerWeek * 4) AS monthlyCost
FROM Employee e
LEFT JOIN FullTime f ON f.empID = e.empID
LEFT JOIN PartTime p ON p.empID = e.empID;
SELECT fullName,                                                    -- kiểu NULL: một bảng, khỏi nối
       COALESCE(monthlySalary, hourlyRate * hoursPerWeek * 4) AS monthlyCost
FROM EmployeeAll;</code></pre>
<div class="out">(2 rows affected)<br>
(1 row affected)<br>
(1 row affected)<br>
(2 rows affected)</div>
<table>
<thead><tr><th>fullName</th><th>monthlyCost</th></tr></thead>
<tbody>
<tr><td>Lan</td><td>25000000</td></tr>
<tr><td>Tú</td><td>4800000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>fullName</th><th>monthlyCost</th></tr></thead>
<tbody>
<tr><td>Lan</td><td>25000000</td></tr>
<tr><td>Tú</td><td>4800000</td></tr>
</tbody>
</table>
<p>Hai thiết kế cho cùng chi phí (Lan 25.000.000; Tú 60.000 × 20 × 4 = 4.800.000). Kiểu E/R phải nối ngoài hai lần; kiểu NULL cần một CHECK để nhân viên toàn thời gian không thể có thêm lương giờ. Vì phân cấp tách rời và đầy đủ nên còn được phép cách thứ ba: chỉ hai bảng FullTime và PartTime, mỗi bảng lặp lại fullName và hireDate (slide 27).</p>
<div class="pitfall">Với kiểu E/R, không gì ngăn cùng một empID xuất hiện ở cả FullTime lẫn PartTime — "tách rời" cần thêm một phép kiểm (trigger, Chương 7). Với kiểu NULL, CHECK ở trên ép điều đó chỉ bằng một dòng.</div>`),
    bi(`<h3>🧪 Exercise 6 — Football clubs: a 1-1 and a recursive relationship (PE style · ~15 min)</h3>
<p class="nhan">Task</p>
<p>A league stores <strong>clubs</strong> (code, name) and <strong>players</strong> (ID, name). A player plays for at most one club. Every club has exactly one <strong>captain</strong>, who is a player, and a player captains at most one club. A young player may have a <strong>mentor</strong>, another player; a mentor can guide several players.</p>
<table>
<thead><tr><th>Relationship</th><th>Read as sentences</th><th>Type</th><th>In the tables</th></tr></thead>
<tbody>
<tr><td>plays for</td><td>a club has many players; a player plays for at most one club</td><td>1-M, partial</td><td>Player.clubID NULL → Club</td></tr>
<tr><td>captain</td><td>a club has exactly one captain; a player captains at most one club</td><td>1-1, total on Club</td><td>Club.captainID NOT NULL UNIQUE → Player</td></tr>
<tr><td>mentors</td><td>a player mentors many players; a player has at most one mentor</td><td>recursive 1-M</td><td>Player.mentorID NULL → Player</td></tr>
</tbody>
</table>
<pre><code class="language-sql">CREATE TABLE Player (
  playerID INT          PRIMARY KEY,
  fullName NVARCHAR(50) NOT NULL,
  clubID   CHAR(3)      NULL,                                       -- PlaysFor N-1, FK added after Club
  mentorID INT          NULL REFERENCES Player(playerID)            -- Mentors: recursive 1-N
);
CREATE TABLE Club (
  clubID    CHAR(3)      PRIMARY KEY,
  name      NVARCHAR(40) NOT NULL,
  captainID INT          NOT NULL UNIQUE REFERENCES Player(playerID) -- Captain 1-1, total on Club
);
ALTER TABLE Player ADD CONSTRAINT fk_player_club FOREIGN KEY (clubID) REFERENCES Club(clubID);</code></pre>
<pre><code class="language-sql">SELECT c.name AS club, cap.fullName AS captain, p.fullName AS player, m.fullName AS mentor
FROM Club c
JOIN Player cap   ON cap.playerID = c.captainID
JOIN Player p     ON p.clubID = c.clubID
LEFT JOIN Player m ON m.playerID = p.mentorID
ORDER BY c.name, p.playerID;</code></pre>
<div class="out">(3 rows affected)<br>
(2 rows affected)<br>
(2 rows affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>club</th><th>captain</th><th>player</th><th>mentor</th></tr></thead>
<tbody>
<tr><td>Hà Nội FC</td><td>Quang Hải</td><td>Quang Hải</td><td><em>NULL</em></td></tr>
<tr><td>Hà Nội FC</td><td>Quang Hải</td><td>Văn Toàn</td><td>Quang Hải</td></tr>
<tr><td>HAGL</td><td>Văn Lâm</td><td>Văn Lâm</td><td><em>NULL</em></td></tr>
</tbody>
</table>
<p>Club and Player point at each other, so the players are inserted first with clubID NULL, then the clubs, then the players' clubID is filled in — the order-of-creation problem of the COMPANY example (slide 18).</p>
<div class="pitfall">The schema cannot check that the captain plays for the club he captains (Club.captainID = a player whose clubID is that club). That rule crosses two rows of two tables: write it down as a business rule and enforce it later with a trigger.</div>`,
    `<h3>🧪 Bài 6 — Câu lạc bộ bóng đá: liên kết 1-1 và liên kết đệ quy (kiểu PE · ~15 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Một giải đấu lưu các <strong>câu lạc bộ</strong> (mã, tên) và <strong>cầu thủ</strong> (mã, tên). Một cầu thủ chơi cho tối đa một câu lạc bộ. Câu lạc bộ nào cũng có đúng một <strong>đội trưởng</strong>, là một cầu thủ, và một cầu thủ làm đội trưởng tối đa một câu lạc bộ. Một cầu thủ trẻ có thể có một <strong>người kèm cặp</strong> (mentor) là cầu thủ khác; một người kèm cặp có thể kèm nhiều cầu thủ.</p>
<table>
<thead><tr><th>Liên kết</th><th>Đọc thành câu</th><th>Loại</th><th>Trong bảng</th></tr></thead>
<tbody>
<tr><td>plays for (chơi cho)</td><td>một câu lạc bộ có nhiều cầu thủ; một cầu thủ chơi cho tối đa một câu lạc bộ</td><td>1-M, bộ phận</td><td>Player.clubID NULL → Club</td></tr>
<tr><td>captain (đội trưởng)</td><td>một câu lạc bộ có đúng một đội trưởng; một cầu thủ làm đội trưởng tối đa một câu lạc bộ</td><td>1-1, Club tham gia toàn phần</td><td>Club.captainID NOT NULL UNIQUE → Player</td></tr>
<tr><td>mentors (kèm cặp)</td><td>một cầu thủ kèm nhiều cầu thủ; một cầu thủ có tối đa một người kèm</td><td>đệ quy 1-M</td><td>Player.mentorID NULL → Player</td></tr>
</tbody>
</table>
<pre><code class="language-sql">CREATE TABLE Player (
  playerID INT          PRIMARY KEY,
  fullName NVARCHAR(50) NOT NULL,
  clubID   CHAR(3)      NULL,                                       -- PlaysFor N-1, khoá ngoại thêm sau khi có Club
  mentorID INT          NULL REFERENCES Player(playerID)            -- Mentors: đệ quy 1-N
);
CREATE TABLE Club (
  clubID    CHAR(3)      PRIMARY KEY,
  name      NVARCHAR(40) NOT NULL,
  captainID INT          NOT NULL UNIQUE REFERENCES Player(playerID) -- Captain 1-1, Club tham gia toàn phần
);
ALTER TABLE Player ADD CONSTRAINT fk_player_club FOREIGN KEY (clubID) REFERENCES Club(clubID);</code></pre>
<pre><code class="language-sql">SELECT c.name AS club, cap.fullName AS captain, p.fullName AS player, m.fullName AS mentor
FROM Club c
JOIN Player cap   ON cap.playerID = c.captainID
JOIN Player p     ON p.clubID = c.clubID
LEFT JOIN Player m ON m.playerID = p.mentorID
ORDER BY c.name, p.playerID;</code></pre>
<div class="out">(3 rows affected)<br>
(2 rows affected)<br>
(2 rows affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>club</th><th>captain</th><th>player</th><th>mentor</th></tr></thead>
<tbody>
<tr><td>Hà Nội FC</td><td>Quang Hải</td><td>Quang Hải</td><td><em>NULL</em></td></tr>
<tr><td>Hà Nội FC</td><td>Quang Hải</td><td>Văn Toàn</td><td>Quang Hải</td></tr>
<tr><td>HAGL</td><td>Văn Lâm</td><td>Văn Lâm</td><td><em>NULL</em></td></tr>
</tbody>
</table>
<p>Club và Player trỏ vào nhau, nên chèn cầu thủ trước với clubID NULL, rồi chèn câu lạc bộ, rồi mới điền clubID cho cầu thủ — đúng bài toán thứ tự tạo của ví dụ COMPANY (slide 18).</p>
<div class="pitfall">Lược đồ không kiểm được việc đội trưởng phải chơi cho chính câu lạc bộ mình làm đội trưởng (Club.captainID = một cầu thủ có clubID là câu lạc bộ đó). Luật này đi qua hai dòng của hai bảng: hãy ghi nó thành quy tắc nghiệp vụ và ép bằng trigger sau.</div>`),
    bi(`<h3>🧪 Exercise 7 — Mini PE: a clinic, from paragraph to working database (~25 min)</h3>
<p class="nhan">Task (as it would appear in PE question 1)</p>
<p>A clinic manages <strong>doctors</strong> (ID, full name), each belonging to exactly one <strong>specialty</strong> (code, unique name). <strong>Patients</strong> have an ID, a full name, a gender (M/F) and a birth date. Each <strong>visit</strong> has an ID, a date and time, a diagnosis, and is for one patient with one doctor. During a visit the doctor <strong>prescribes</strong> several <strong>medicines</strong> (ID, name, unit), each with a positive quantity and a dosage. Create the database with all primary keys, foreign keys and the constraints mentioned.</p>
<pre><code class="language-plaintext">[Specialty] specID*, specName ── 1 ──&lt;belongs to&gt;── N ── [Doctor] doctorID*, fullName
[Doctor] ── 1 ──&lt;examines&gt;── N ── [Visit] visitID*, visitDate, diagnosis ── N ──&lt;has&gt;── 1 ── [Patient] patientID*, fullName, gender, birthDate
[Visit] ── M ──&lt;prescribes (quantity, dosage)&gt;── N ── [Medicine] medID*, medName, unit</code></pre>
<p>6 tables: Specialty, Doctor(→ Specialty), Patient, Visit(→ Patient, → Doctor), Medicine, Prescribes(<u>visitID</u>, <u>medID</u>, quantity, dosage). Visit is a strong entity (it has its own ID), which is why patient and doctor are ordinary foreign keys, not part of its key.</p>
<pre><code class="language-sql">CREATE TABLE Specialty (
  specID   CHAR(3)      PRIMARY KEY,
  specName NVARCHAR(40) NOT NULL UNIQUE
);
CREATE TABLE Doctor (
  doctorID CHAR(5)      PRIMARY KEY,
  fullName NVARCHAR(50) NOT NULL,
  specID   CHAR(3)      NOT NULL REFERENCES Specialty(specID)       -- BelongsTo N-1
);
CREATE TABLE Patient (
  patientID INT          PRIMARY KEY,
  fullName  NVARCHAR(50) NOT NULL,
  gender    CHAR(1)      CHECK (gender IN ('M', 'F')),
  birthDate DATE
);
CREATE TABLE Visit (                                                -- strong entity with its own id
  visitID   INT      PRIMARY KEY,
  visitDate DATETIME NOT NULL,
  diagnosis NVARCHAR(200),
  patientID INT      NOT NULL REFERENCES Patient(patientID),        -- Has N-1
  doctorID  CHAR(5)  NOT NULL REFERENCES Doctor(doctorID)           -- Examines N-1
);
CREATE TABLE Medicine (
  medID   INT          PRIMARY KEY,
  medName NVARCHAR(60) NOT NULL,
  unit    NVARCHAR(10) NOT NULL
);
CREATE TABLE Prescribes (                                           -- M-N Visit-Medicine
  visitID  INT REFERENCES Visit(visitID) ON DELETE CASCADE,
  medID    INT REFERENCES Medicine(medID),
  quantity INT NOT NULL CHECK (quantity &gt; 0),
  dosage   NVARCHAR(100),
  PRIMARY KEY (visitID, medID)
);</code></pre>
<pre><code class="language-sql">SELECT t.name AS table_name,                                        -- self-check: tables, columns, FKs
       (SELECT COUNT(*) FROM sys.columns c WHERE c.object_id = t.object_id)             AS cols,
       (SELECT COUNT(*) FROM sys.foreign_keys f WHERE f.parent_object_id = t.object_id) AS fks
FROM sys.tables t
ORDER BY t.name;</code></pre>
<pre><code class="language-sql">SELECT v.visitID, p.fullName AS patient, d.fullName AS doctor, s.specName,
       COUNT(pr.medID) AS medicines
FROM Visit v
JOIN Patient p   ON p.patientID = v.patientID
JOIN Doctor d    ON d.doctorID = v.doctorID
JOIN Specialty s ON s.specID = d.specID
LEFT JOIN Prescribes pr ON pr.visitID = v.visitID
GROUP BY v.visitID, p.fullName, d.fullName, s.specName
ORDER BY v.visitID;</code></pre>
<div class="out">(2 rows affected)<br>
(2 rows affected)<br>
(2 rows affected)<br>
(2 rows affected)<br>
(2 rows affected)<br>
(3 rows affected)</div>
<table>
<thead><tr><th>table_name</th><th>cols</th><th>fks</th></tr></thead>
<tbody>
<tr><td>Doctor</td><td>3</td><td>1</td></tr>
<tr><td>Medicine</td><td>3</td><td>0</td></tr>
<tr><td>Patient</td><td>4</td><td>0</td></tr>
<tr><td>Prescribes</td><td>4</td><td>2</td></tr>
<tr><td>Specialty</td><td>2</td><td>0</td></tr>
<tr><td>Visit</td><td>5</td><td>2</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>visitID</th><th>patient</th><th>doctor</th><th>specName</th><th>medicines</th></tr></thead>
<tbody>
<tr><td>1001</td><td>Nguyễn An</td><td>Trần Hòa</td><td>Nội tổng quát</td><td>2</td></tr>
<tr><td>1002</td><td>Đỗ Bích</td><td>Lê Mai</td><td>Nhi</td><td>1</td></tr>
</tbody>
</table>
<p class="dap-an">✅ <strong>Grading checklist a PE marker uses:</strong> every table has a PRIMARY KEY; every "belongs to / is for / with" is a FOREIGN KEY on the many side; the M-N is a table with a composite key; "unique", "positive", "M/F" appear as UNIQUE and CHECK; Vietnamese text uses NVARCHAR; tables are created parents first so the script runs top to bottom without errors.</p>`,
    `<h3>🧪 Bài 7 — Đề PE mini: phòng khám, từ đoạn đề tới CSDL chạy được (~25 phút)</h3>
<p class="nhan">Đề bài (đúng kiểu câu 1 đề PE)</p>
<p>Một phòng khám quản lý <strong>bác sĩ</strong> (mã, họ tên), mỗi bác sĩ thuộc đúng một <strong>chuyên khoa</strong> (mã, tên không trùng). <strong>Bệnh nhân</strong> có mã, họ tên, giới tính (M/F) và ngày sinh. Mỗi <strong>lượt khám</strong> có mã, ngày giờ, chẩn đoán, và là của một bệnh nhân với một bác sĩ. Trong một lượt khám, bác sĩ <strong>kê</strong> nhiều <strong>thuốc</strong> (mã, tên, đơn vị), mỗi thuốc có số lượng dương và liều dùng. Hãy tạo CSDL với đủ khoá chính, khoá ngoại và các ràng buộc được nêu.</p>
<pre><code class="language-plaintext">[Specialty] specID*, specName ── 1 ──&lt;belongs to&gt;── N ── [Doctor] doctorID*, fullName
[Doctor] ── 1 ──&lt;examines&gt;── N ── [Visit] visitID*, visitDate, diagnosis ── N ──&lt;has&gt;── 1 ── [Patient] patientID*, fullName, gender, birthDate
[Visit] ── M ──&lt;prescribes (quantity, dosage)&gt;── N ── [Medicine] medID*, medName, unit</code></pre>
<p>6 bảng: Specialty, Doctor(→ Specialty), Patient, Visit(→ Patient, → Doctor), Medicine, Prescribes(<u>visitID</u>, <u>medID</u>, quantity, dosage). Visit là thực thể mạnh (có mã riêng), nên bệnh nhân và bác sĩ chỉ là khoá ngoại thường, không nằm trong khoá của nó.</p>
<pre><code class="language-sql">CREATE TABLE Specialty (
  specID   CHAR(3)      PRIMARY KEY,
  specName NVARCHAR(40) NOT NULL UNIQUE
);
CREATE TABLE Doctor (
  doctorID CHAR(5)      PRIMARY KEY,
  fullName NVARCHAR(50) NOT NULL,
  specID   CHAR(3)      NOT NULL REFERENCES Specialty(specID)       -- BelongsTo N-1
);
CREATE TABLE Patient (
  patientID INT          PRIMARY KEY,
  fullName  NVARCHAR(50) NOT NULL,
  gender    CHAR(1)      CHECK (gender IN ('M', 'F')),
  birthDate DATE
);
CREATE TABLE Visit (                                                -- thực thể mạnh có mã riêng
  visitID   INT      PRIMARY KEY,
  visitDate DATETIME NOT NULL,
  diagnosis NVARCHAR(200),
  patientID INT      NOT NULL REFERENCES Patient(patientID),        -- Has N-1
  doctorID  CHAR(5)  NOT NULL REFERENCES Doctor(doctorID)           -- Examines N-1
);
CREATE TABLE Medicine (
  medID   INT          PRIMARY KEY,
  medName NVARCHAR(60) NOT NULL,
  unit    NVARCHAR(10) NOT NULL
);
CREATE TABLE Prescribes (                                           -- M-N Visit-Medicine
  visitID  INT REFERENCES Visit(visitID) ON DELETE CASCADE,
  medID    INT REFERENCES Medicine(medID),
  quantity INT NOT NULL CHECK (quantity &gt; 0),
  dosage   NVARCHAR(100),
  PRIMARY KEY (visitID, medID)
);</code></pre>
<pre><code class="language-sql">SELECT t.name AS table_name,                                        -- tự kiểm: bảng, cột, khoá ngoại
       (SELECT COUNT(*) FROM sys.columns c WHERE c.object_id = t.object_id)             AS cols,
       (SELECT COUNT(*) FROM sys.foreign_keys f WHERE f.parent_object_id = t.object_id) AS fks
FROM sys.tables t
ORDER BY t.name;</code></pre>
<pre><code class="language-sql">SELECT v.visitID, p.fullName AS patient, d.fullName AS doctor, s.specName,
       COUNT(pr.medID) AS medicines
FROM Visit v
JOIN Patient p   ON p.patientID = v.patientID
JOIN Doctor d    ON d.doctorID = v.doctorID
JOIN Specialty s ON s.specID = d.specID
LEFT JOIN Prescribes pr ON pr.visitID = v.visitID
GROUP BY v.visitID, p.fullName, d.fullName, s.specName
ORDER BY v.visitID;</code></pre>
<div class="out">(2 rows affected)<br>
(2 rows affected)<br>
(2 rows affected)<br>
(2 rows affected)<br>
(2 rows affected)<br>
(3 rows affected)</div>
<table>
<thead><tr><th>table_name</th><th>cols</th><th>fks</th></tr></thead>
<tbody>
<tr><td>Doctor</td><td>3</td><td>1</td></tr>
<tr><td>Medicine</td><td>3</td><td>0</td></tr>
<tr><td>Patient</td><td>4</td><td>0</td></tr>
<tr><td>Prescribes</td><td>4</td><td>2</td></tr>
<tr><td>Specialty</td><td>2</td><td>0</td></tr>
<tr><td>Visit</td><td>5</td><td>2</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>visitID</th><th>patient</th><th>doctor</th><th>specName</th><th>medicines</th></tr></thead>
<tbody>
<tr><td>1001</td><td>Nguyễn An</td><td>Trần Hòa</td><td>Nội tổng quát</td><td>2</td></tr>
<tr><td>1002</td><td>Đỗ Bích</td><td>Lê Mai</td><td>Nhi</td><td>1</td></tr>
</tbody>
</table>
<p class="dap-an">✅ <strong>Danh sách chấm mà người chấm PE hay dùng:</strong> bảng nào cũng có PRIMARY KEY; mọi chữ "thuộc / của / với" là một FOREIGN KEY ở phía nhiều; liên kết M-N là một bảng có khoá ghép; "không trùng", "dương", "M/F" xuất hiện thành UNIQUE và CHECK; chữ tiếng Việt dùng NVARCHAR; tạo bảng cha trước để script chạy từ trên xuống không lỗi.</p>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>entity</strong></td><td>thực thể</td><td>A real-world thing that can be distinguished from others and about which data is stored.</td></tr>
<tr><td><strong>entity set</strong></td><td>tập thực thể</td><td>The collection of similar entities with the same attributes; becomes a table.</td></tr>
<tr><td><strong>attribute</strong></td><td>thuộc tính</td><td>A property of an entity or relationship, with a domain of allowed values.</td></tr>
<tr><td><strong>key attribute</strong></td><td>thuộc tính khoá</td><td>An attribute (or set) whose value identifies exactly one entity; underlined in the ERD.</td></tr>
<tr><td><strong>relationship</strong></td><td>liên kết</td><td>An association among two or more entities, drawn as a diamond.</td></tr>
<tr><td><strong>cardinality</strong></td><td>bản số</td><td>How many entities on one side can be linked to one entity on the other: 1-1, 1-M, M-N.</td></tr>
<tr><td><strong>total participation</strong></td><td>tham gia toàn phần</td><td>Every entity of the set must take part in the relationship (NOT NULL in SQL).</td></tr>
<tr><td><strong>degree</strong></td><td>bậc của liên kết</td><td>The number of entity sets in a relationship: unary, binary, ternary.</td></tr>
<tr><td><strong>recursive relationship</strong></td><td>liên kết đệ quy</td><td>A relationship between an entity set and itself, with two roles.</td></tr>
<tr><td><strong>weak entity set</strong></td><td>tập thực thể yếu</td><td>An entity set identified only together with the key of its supporting entity set.</td></tr>
<tr><td><strong>partial key</strong></td><td>khoá bộ phận</td><td>The attribute of a weak entity that is unique only inside one owner (room number).</td></tr>
<tr><td><strong>supporting relationship</strong></td><td>liên kết hỗ trợ</td><td>The many-one relationship from a weak entity set to its owner; gets no table.</td></tr>
<tr><td><strong>multivalued attribute</strong></td><td>thuộc tính đa trị</td><td>An attribute that can hold several values for one entity; becomes its own table.</td></tr>
<tr><td><strong>composite attribute</strong></td><td>thuộc tính phức hợp</td><td>An attribute made of parts (address = street + city); one column per part.</td></tr>
<tr><td><strong>derived attribute</strong></td><td>thuộc tính dẫn xuất</td><td>An attribute computed from others (age from birth date); not stored.</td></tr>
<tr><td><strong>isa hierarchy / subclass</strong></td><td>phân cấp isa / lớp con</td><td>A special kind of entity set that inherits all attributes of its superclass and adds its own.</td></tr>
<tr><td><strong>disjoint / complete</strong></td><td>tách rời / đầy đủ</td><td>No entity in two subclasses / every entity in some subclass.</td></tr>
<tr><td><strong>aggregation</strong></td><td>kết tập</td><td>Treating a relationship as an entity so it can take part in another relationship; in UML, a many-one "may belong" link.</td></tr>
<tr><td><strong>composition</strong></td><td>hợp thành</td><td>UML many-one link with referential integrity: the part cannot exist without the whole.</td></tr>
<tr><td><strong>multiplicity</strong></td><td>bội số</td><td>The min..max label at each end of a UML association: 0..1, 1..1, 0..*, 1..*.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>entity</strong></td><td>thực thể</td><td>Một vật của thế giới thực phân biệt được với vật khác và cần lưu dữ liệu về nó.</td></tr>
<tr><td><strong>entity set</strong></td><td>tập thực thể</td><td>Tập các thực thể cùng loại, cùng bộ thuộc tính; thành một bảng.</td></tr>
<tr><td><strong>attribute</strong></td><td>thuộc tính</td><td>Một tính chất của thực thể hay liên kết, có miền giá trị cho phép.</td></tr>
<tr><td><strong>key attribute</strong></td><td>thuộc tính khoá</td><td>Thuộc tính (hoặc nhóm) có giá trị xác định đúng một thực thể; gạch chân trên ERD.</td></tr>
<tr><td><strong>relationship</strong></td><td>liên kết</td><td>Mối liên hệ giữa hai hay nhiều thực thể, vẽ bằng hình thoi.</td></tr>
<tr><td><strong>cardinality</strong></td><td>bản số</td><td>Số thực thể ở một phía có thể liên kết với một thực thể ở phía kia: 1-1, 1-M, M-N.</td></tr>
<tr><td><strong>total participation</strong></td><td>tham gia toàn phần</td><td>Mọi thực thể của tập đều phải tham gia liên kết (NOT NULL trong SQL).</td></tr>
<tr><td><strong>degree</strong></td><td>bậc của liên kết</td><td>Số tập thực thể tham gia một liên kết: một ngôi, hai ngôi, ba ngôi.</td></tr>
<tr><td><strong>recursive relationship</strong></td><td>liên kết đệ quy</td><td>Liên kết giữa một tập thực thể với chính nó, có hai vai trò.</td></tr>
<tr><td><strong>weak entity set</strong></td><td>tập thực thể yếu</td><td>Tập thực thể chỉ xác định được khi đi kèm khoá của tập thực thể hỗ trợ.</td></tr>
<tr><td><strong>partial key</strong></td><td>khoá bộ phận</td><td>Thuộc tính của thực thể yếu chỉ duy nhất trong phạm vi một chủ (số phòng).</td></tr>
<tr><td><strong>supporting relationship</strong></td><td>liên kết hỗ trợ</td><td>Liên kết nhiều – một từ tập thực thể yếu tới chủ của nó; không có bảng riêng.</td></tr>
<tr><td><strong>multivalued attribute</strong></td><td>thuộc tính đa trị</td><td>Thuộc tính có thể có nhiều giá trị cho một thực thể; thành bảng riêng.</td></tr>
<tr><td><strong>composite attribute</strong></td><td>thuộc tính phức hợp</td><td>Thuộc tính gồm nhiều phần (địa chỉ = đường + thành phố); mỗi phần một cột.</td></tr>
<tr><td><strong>derived attribute</strong></td><td>thuộc tính dẫn xuất</td><td>Thuộc tính tính ra từ thuộc tính khác (tuổi từ ngày sinh); không lưu.</td></tr>
<tr><td><strong>isa hierarchy / subclass</strong></td><td>phân cấp isa / lớp con</td><td>Một loại đặc biệt của tập thực thể, kế thừa mọi thuộc tính của lớp cha và thêm thuộc tính riêng.</td></tr>
<tr><td><strong>disjoint / complete</strong></td><td>tách rời / đầy đủ</td><td>Không thực thể nào ở hai lớp con / thực thể nào cũng ở một lớp con.</td></tr>
<tr><td><strong>aggregation</strong></td><td>kết tập</td><td>Coi một liên kết như thực thể để nó tham gia liên kết khác; trong UML là liên kết nhiều – một "có thể thuộc về".</td></tr>
<tr><td><strong>composition</strong></td><td>hợp thành</td><td>Liên kết nhiều – một của UML có toàn vẹn tham chiếu: phần không tồn tại được nếu thiếu cái toàn thể.</td></tr>
<tr><td><strong>multiplicity</strong></td><td>bội số</td><td>Nhãn tối thiểu..tối đa ở mỗi đầu của liên kết UML: 0..1, 1..1, 0..*, 1..*.</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Summary — 8 things to remember from Chapter 3</h2>
<ol>
<li><strong>Design process</strong>: requirements → conceptual design (ERD) → logical design (tables) → schema refinement (normalization) → physical design (indexes) → security. The ERD describes the conceptual level of the three-level architecture.</li>
<li><strong>Symbols (Chen)</strong>: rectangle = entity set, oval = attribute, underlined = key, diamond = relationship, double rectangle + double diamond = weak entity and its supporting relationship, double oval = multivalued, dashed oval = derived, triangle "isa" = subclass. Crow's Foot draws "many" as a three-pronged fork.</li>
<li><strong>Cardinality</strong>: ask "one or many?" from both sides. 1-M → a foreign key on the M side; M-N → a new table keyed on both keys; 1-1 → a foreign key with UNIQUE on the total side (or a separate table).</li>
<li><strong>n-ary relationships</strong>: one table with all the keys; the side an arrow points to leaves the primary key. Do not split a ternary relationship into binary ones.</li>
<li><strong>Attributes</strong>: composite → one column per part; multivalued → a table (owner key, value) keyed on both; derived → not stored, computed in queries.</li>
<li><strong>Weak entity sets</strong>: key = partial key + the owner's key (also a NOT NULL foreign key, usually ON DELETE CASCADE); no table for the supporting relationship.</li>
<li><strong>Subclasses</strong>: E/R style (a table per class, all carrying the root key), object-oriented (a table per combination of classes, up to 2ⁿ), NULL style (one wide table). Subclass tables only when the hierarchy is disjoint and complete.</li>
<li><strong>UML</strong>: class = entity set, association with multiplicities (0..1 → FK may be NULL, 1..1 → NOT NULL, 0..* on both ends → own table), association class = relationship attributes, aggregation/composition → a foreign key in the part, no table. UML has only binary associations.</li>
</ol>
<h3>✅ Self-check before the quiz</h3>
<ol>
<li>An ERD: Department 1 — N Employee, Employee M — N Project (hours), Employee has {phone}. How many tables, and what is the key of the phone table?</li>
<li>Why is "room 101" a weak entity but a student is not?</li>
<li>For Supplier–Part–Project with an arrow into Supplier, what is the key?</li>
</ol>
<p class="dap-an">✅ <strong>Answers:</strong> (1) 5 tables — Department, Employee (with deptID), Project, WorksOn(empID, projectID, hours), EmployeePhone(empID, phone) with key (empID, phone). (2) room numbers repeat across hotels, so a room is identified only with its hotel; a student ID is unique on its own. (3) (partID, projectID).</p>`,
    `<h2>📌 Tóm tắt — 8 điều cần nhớ của Chương 3</h2>
<ol>
<li><strong>Quy trình thiết kế</strong>: yêu cầu → thiết kế khái niệm (ERD) → thiết kế logic (bảng) → tinh chỉnh lược đồ (chuẩn hoá) → thiết kế vật lý (chỉ mục) → bảo mật. ERD mô tả mức khái niệm của kiến trúc ba mức.</li>
<li><strong>Ký hiệu (Chen)</strong>: chữ nhật = tập thực thể, bầu dục = thuộc tính, gạch chân = khoá, hình thoi = liên kết, chữ nhật đôi + thoi đôi = thực thể yếu và liên kết hỗ trợ của nó, bầu dục đôi = đa trị, bầu dục nét đứt = dẫn xuất, tam giác "isa" = lớp con. Kiểu Crow's Foot vẽ "nhiều" thành cái chĩa ba nhánh.</li>
<li><strong>Bản số</strong>: hỏi "một hay nhiều?" từ cả hai phía. 1-M → khoá ngoại ở phía M; M-N → bảng mới có khoá là cả hai khoá; 1-1 → khoá ngoại có UNIQUE ở phía toàn phần (hoặc bảng riêng).</li>
<li><strong>Liên kết n ngôi</strong>: một bảng chứa mọi khoá; phía có mũi tên chỉ vào ra khỏi khoá chính. Đừng tách liên kết ba ngôi thành các liên kết hai ngôi.</li>
<li><strong>Thuộc tính</strong>: phức hợp → mỗi phần một cột; đa trị → một bảng (khoá chủ, giá trị) có khoá là cả hai; dẫn xuất → không lưu, tính trong truy vấn.</li>
<li><strong>Tập thực thể yếu</strong>: khoá = khoá bộ phận + khoá của chủ (đồng thời là khoá ngoại NOT NULL, thường kèm ON DELETE CASCADE); không có bảng cho liên kết hỗ trợ.</li>
<li><strong>Lớp con</strong>: kiểu E/R (mỗi lớp một bảng, đều mang khoá gốc), hướng đối tượng (mỗi tổ hợp lớp một bảng, tới 2ⁿ), kiểu NULL (một bảng rộng). Chỉ dùng bảng lớp con khi phân cấp tách rời và đầy đủ.</li>
<li><strong>UML</strong>: lớp = tập thực thể, liên kết có bội số (0..1 → khoá ngoại được NULL, 1..1 → NOT NULL, 0..* ở hai đầu → bảng riêng), lớp liên kết = thuộc tính của liên kết, kết tập/hợp thành → khoá ngoại ở phía phần, không có bảng. UML chỉ có liên kết hai ngôi.</li>
</ol>
<h3>✅ Tự kiểm tra trước khi làm quiz</h3>
<ol>
<li>Một ERD: Department 1 — N Employee, Employee M — N Project (hours), Employee có {phone}. Bao nhiêu bảng, và khoá của bảng số điện thoại là gì?</li>
<li>Vì sao "phòng 101" là thực thể yếu còn sinh viên thì không?</li>
<li>Với Supplier–Part–Project có mũi tên chỉ vào Supplier, khoá là gì?</li>
</ol>
<p class="dap-an">✅ <strong>Đáp án:</strong> (1) 5 bảng — Department, Employee (có deptID), Project, WorksOn(empID, projectID, hours), EmployeePhone(empID, phone) có khoá (empID, phone). (2) số phòng lặp lại giữa các khách sạn, nên một phòng chỉ xác định được khi đi kèm khách sạn; mã sinh viên thì tự nó đã duy nhất. (3) (partID, projectID).</p>`),
  ].join('\n'),
};

/* ───────── Quiz (dbi202-quiz-ch3) — 10 câu ───────── */
const QUIZ = {
  timeLimitSeconds: 900,
  questions: [
    { id: 'q1',
      question: 'An ERD has Department 1 — N Employee, Employee M — N Project with the attribute hours on the relationship, and Employee has a multivalued attribute phone. Converted with the standard rules, how many tables do you get?|||Một ERD có Department 1 — N Employee, Employee M — N Project với thuộc tính hours trên liên kết, và Employee có thuộc tính đa trị phone. Chuyển theo các luật chuẩn thì được bao nhiêu bảng?',
      options: ['3|||3', '4|||4', '5|||5', '6|||6'],
      correctIndex: 2,
      points: 1,
      explanation: 'Three entity sets give 3 tables; the M-N relationship gives WorksOn(empID, projID, hours); the multivalued phone gives EmployeePhone(empID, phone): 5. The 1-N Department–Employee adds no table, only deptID in Employee. Answer D is what you get by wrongly making a table for the 1-N relationship; B forgets the multivalued attribute.|||Ba tập thực thể cho 3 bảng; liên kết M-N cho WorksOn(empID, projID, hours); thuộc tính đa trị phone cho EmployeePhone(empID, phone): tổng 5. Liên kết 1-N Department–Employee không thêm bảng, chỉ thêm deptID vào Employee. Đáp án D là khi tạo nhầm bảng cho liên kết 1-N; B quên thuộc tính đa trị.' },
    { id: 'q2',
      question: 'Crews (attributes number, crewChief) is a weak entity set supported by Studios (key name) through the many-one relationship Unit-of. What is the primary key of the Crews table?|||Crews (thuộc tính number, crewChief) là tập thực thể yếu, được Studios (khoá name) hỗ trợ qua liên kết nhiều – một Unit-of. Khoá chính của bảng Crews là gì?',
      options: ['number|||number', '(number, studioName)|||(number, studioName)', '(number, crewChief)|||(number, crewChief)', 'studioName|||studioName'],
      correctIndex: 1,
      points: 1,
      explanation: 'A weak entity is identified by its partial key together with the key of its supporting entity set: crew 1 exists in every studio, so only (number, studioName) is unique (slide 32). Number alone (A) would forbid two studios from both having a crew 1; studioName alone (D) would allow only one crew per studio.|||Thực thể yếu được xác định bằng khoá bộ phận cùng với khoá của tập thực thể hỗ trợ: hãng nào cũng có tổ 1, nên chỉ (number, studioName) là duy nhất (slide 32). Chỉ number (A) sẽ cấm hai hãng cùng có tổ 1; chỉ studioName (D) thì mỗi hãng chỉ được một tổ.' },
    { id: 'q3',
      question: 'A ternary relationship Supply connects Supplier, Part and Project, with an arrow pointing into Supplier (for each part and project there is exactly one supplier). What is the key of the Supply table?|||Liên kết ba ngôi Supply nối Supplier, Part và Project, có một mũi tên chỉ vào Supplier (với mỗi vật tư và dự án có đúng một nhà cung cấp). Khoá của bảng Supply là gì?',
      options: ['(supplierID, partID, projectID)|||(supplierID, partID, projectID)', '(supplierID, partID)|||(supplierID, partID)', 'supplierID alone|||chỉ supplierID', '(partID, projectID)|||(partID, projectID)'],
      correctIndex: 3,
      points: 1,
      explanation: 'The arrow says the part and the project determine the supplier, so the supplier is left out of the key — like A-Key on slide 21. Answer A would be right with no arrow at all; with the arrow it allows two suppliers for the same part and project, which the diagram forbids.|||Mũi tên nói rằng vật tư và dự án xác định được nhà cung cấp, nên nhà cung cấp bị để ra ngoài khoá — giống A-Key ở slide 21. Đáp án A đúng khi không có mũi tên nào; có mũi tên thì nó cho phép hai nhà cung cấp cho cùng vật tư và dự án, điều sơ đồ cấm.' },
    { id: 'q4',
      question: 'Professor has the key SSN, the attribute Name and the composite attribute Address made of Street and City. Which table follows the rule of slide 22?|||Professor có khoá SSN, thuộc tính Name và thuộc tính phức hợp Address gồm Street và City. Bảng nào đúng luật của slide 22?',
      options: ['Professor(SSN, Name, Street, City)|||Professor(SSN, Name, Street, City)', 'Professor(SSN, Name, Address)|||Professor(SSN, Name, Address)', 'Professor(SSN, Name, Address, Street, City)|||Professor(SSN, Name, Address, Street, City)', 'Professor(SSN, Name) and Address(SSN, Street, City)|||Professor(SSN, Name) và Address(SSN, Street, City)'],
      correctIndex: 0,
      points: 1,
      explanation: 'A composite attribute is replaced by one column per component and there is no column for the composite itself. B keeps an indivisible "address" string that cannot be searched by city; C stores the same information twice; D treats Address as if it were multivalued.|||Thuộc tính phức hợp được thay bằng mỗi thành phần một cột và không có cột cho cả khối. B giữ một chuỗi địa chỉ không chia được nên không tìm theo thành phố được; C lưu cùng một thông tin hai lần; D đối xử với Address như thuộc tính đa trị.' },
    { id: 'q5',
      question: 'Movies has two subclasses, Cartoons and MurderMysteries, and a movie may belong to both. How many relations does the object-oriented strategy create for this hierarchy (not counting Voices)?|||Movies có hai lớp con Cartoons và MurderMysteries, và một phim có thể thuộc cả hai. Chiến lược hướng đối tượng tạo bao nhiêu quan hệ cho cây này (không tính Voices)?',
      options: ['1|||1', '3|||3', '4|||4', '2|||2'],
      correctIndex: 2,
      points: 1,
      explanation: 'The OO approach creates one relation per subtree that includes the root: Movies, MoviesC, MoviesMM, MoviesCMM — 2² = 4 (slide 37). Three is the E/R style before removing Cartoons; one is the null-values strategy.|||Cách hướng đối tượng tạo mỗi cây con có chứa gốc một quan hệ: Movies, MoviesC, MoviesMM, MoviesCMM — 2² = 4 (slide 37). Ba là kiểu E/R trước khi bỏ Cartoons; một là chiến lược dùng NULL.' },
    { id: 'q6',
      question: '"Each class has many students; each student belongs to exactly one class." How is this relationship stored?|||"Mỗi lớp có nhiều sinh viên; mỗi sinh viên thuộc đúng một lớp." Liên kết này được lưu thế nào?',
      options: ['A column classID NOT NULL in Student, referencing Class|||Một cột classID NOT NULL trong Student, tham chiếu Class', 'A column studentID in Class, referencing Student|||Một cột studentID trong Class, tham chiếu Student', 'A new table ClassStudent(classID, studentID) with both as key|||Một bảng mới ClassStudent(classID, studentID) có khoá là cả hai', 'A column holding the list of student IDs in Class|||Một cột chứa danh sách mã sinh viên trong Class'],
      correctIndex: 0,
      points: 1,
      explanation: '1-M: the key of the one side goes into the many side as a foreign key; NOT NULL because every student must have a class. C works but is the classic PE mistake: an extra join, and it even allows a student in two classes. B and D would need several student IDs in one row.|||1-M: khoá của phía một đi sang phía nhiều làm khoá ngoại; NOT NULL vì sinh viên nào cũng phải có lớp. C chạy được nhưng là lỗi PE kinh điển: thêm một phép nối và còn cho phép một sinh viên ở hai lớp. B và D cần nhiều mã sinh viên trong một dòng.' },
    { id: 'q7',
      question: 'In the UML diagram of slide 42, the association Owns has 0..1 at the Studios end and 0..* at the Movies end. What does it mean?|||Trong sơ đồ UML ở slide 42, liên kết Owns ghi 0..1 ở đầu Studios và 0..* ở đầu Movies. Nghĩa là gì?',
      options: ['Each studio owns at most one movie|||Mỗi hãng sở hữu tối đa một phim', 'Each movie is owned by at most one studio; a studio owns any number of movies|||Mỗi phim thuộc tối đa một hãng; một hãng sở hữu bao nhiêu phim cũng được', 'Each movie must be owned by exactly one studio|||Mỗi phim bắt buộc thuộc đúng một hãng', 'Movies and studios are many-to-many|||Phim và hãng là nhiều – nhiều'],
      correctIndex: 1,
      points: 1,
      explanation: 'A label is read at the far end: starting from one movie, the Studios end says 0..1 — at most one owner, possibly none. Starting from a studio, the Movies end says 0..* — any number. Option A reads the label at the wrong end; C would need 1..1.|||Nhãn được đọc ở đầu xa: xuất phát từ một phim, đầu Studios ghi 0..1 — tối đa một chủ, có thể không có. Xuất phát từ một hãng, đầu Movies ghi 0..* — bao nhiêu cũng được. Phương án A đọc nhãn ở nhầm đầu; C thì phải là 1..1.' },
    { id: 'q8',
      question: 'Crews is created with FOREIGN KEY studioName REFERENCES Studios ON DELETE CASCADE. How many rows are left in Crews after this code?|||Crews được tạo với khoá ngoại studioName REFERENCES Studios ON DELETE CASCADE. Sau đoạn code, Crews còn bao nhiêu dòng?',
      code: `INSERT INTO Crews VALUES (1, 'Mickey', 'Disney'), (2, 'Donald', 'Disney'), (1, 'Homer', 'Fox'), (2, 'Bart', 'Fox');
DELETE FROM Studios WHERE name = 'Fox';
SELECT COUNT(*) FROM Crews;`,
      codeLang: 'sql',
      options: ['4|||4', '0|||0', '3|||3', '2|||2'],
      correctIndex: 3,
      points: 1,
      explanation: 'Deleting the studio Fox cascades to its two crews, so the two Disney crews remain. Without ON DELETE CASCADE the DELETE would fail instead and all 4 rows would stay (option A) — the behaviour many students expect by default.|||Xoá hãng Fox thì xoá dây chuyền hai tổ của nó, còn lại hai tổ của Disney. Nếu không có ON DELETE CASCADE thì lệnh DELETE sẽ bị lỗi và cả 4 dòng còn nguyên (phương án A) — cách nhiều bạn nghĩ là mặc định.' },
    { id: 'q9',
      question: 'Employee has the attribute birthDate and the derived attribute age. What should the table contain?|||Employee có thuộc tính birthDate và thuộc tính dẫn xuất age. Bảng nên chứa gì?',
      options: ['birthDate only; age is computed in queries when needed|||chỉ birthDate; age được tính trong truy vấn khi cần', 'age only, because it is what the users see|||chỉ age, vì đó là thứ người dùng nhìn thấy', 'both birthDate and age, updated every year|||cả birthDate lẫn age, cập nhật mỗi năm', 'a separate table EmployeeAge(empID, age)|||một bảng riêng EmployeeAge(empID, age)'],
      correctIndex: 0,
      points: 1,
      explanation: 'A derived attribute (dashed oval) is computed from stored ones, so it is not stored: age changes every day while birthDate never does. Option C looks safe but the stored age is wrong the day after a birthday until someone updates it.|||Thuộc tính dẫn xuất (bầu dục nét đứt) được tính từ thuộc tính đã lưu, nên không lưu: tuổi đổi theo từng ngày còn ngày sinh thì không bao giờ đổi. Phương án C trông an toàn nhưng tuổi đã lưu sai ngay từ hôm sau sinh nhật cho tới khi có người cập nhật.' },
    { id: 'q10',
      question: 'On SQL Server, Person has the column lockerNo INT NULL UNIQUE. The code tries to insert four persons. How many rows does Person contain at the end?|||Trên SQL Server, Person có cột lockerNo INT NULL UNIQUE. Đoạn code cố chèn bốn người. Cuối cùng Person có bao nhiêu dòng?',
      code: `INSERT INTO Person VALUES (1, 101);
GO
INSERT INTO Person VALUES (2, NULL);
GO
INSERT INTO Person VALUES (3, NULL);
GO
INSERT INTO Person VALUES (4, NULL);
GO
SELECT COUNT(*) FROM Person;`,
      codeLang: 'sql',
      options: ['4|||4', '1|||1', '2|||2', '3|||3'],
      correctIndex: 2,
      points: 1,
      explanation: 'SQL Server lets a UNIQUE column hold only one NULL: person 1 (locker 101) and person 2 (NULL) are inserted, persons 3 and 4 are refused as duplicate NULLs. That is why an optional 1-1 relationship is better stored in its own table (slide 20). On PostgreSQL all four rows would be accepted (option A), since PG allows many NULLs in a UNIQUE column.|||SQL Server chỉ cho một cột UNIQUE chứa một giá trị NULL: người 1 (tủ 101) và người 2 (NULL) được chèn, người 3 và 4 bị từ chối vì trùng NULL. Đó là lý do liên kết 1-1 không bắt buộc nên lưu thành bảng riêng (slide 20). Trên PostgreSQL cả bốn dòng đều được nhận (phương án A), vì PG cho cột UNIQUE chứa nhiều NULL.' },
  ],
};

const QUIZ_LESSON = {
  title: 'Quiz — Chapter 3 · E/R modelling|||Quiz — Chương 3 · Mô hình E/R',
  slug: 'dbi202-quiz-ch3',
  type: 'QUIZ',
  description: '10 câu về Chương 3 (slide Chapter 4 của trường): ERD này thành mấy bảng, khoá của thực thể yếu, liên kết ba ngôi có mũi tên, thuộc tính phức hợp và dẫn xuất, khoá ngoại của liên kết 1-M, chiến lược lớp con hướng đối tượng, bội số UML, ON DELETE CASCADE và UNIQUE với NULL trên SQL Server — 3 câu được chạy thật để xác nhận đáp án; mỗi câu có giải thích.',
  quiz: QUIZ,
};

export default {
  slides: [L_dbi5_1, L_dbi5_2, L_dbi5_3],
  practice: L_on_ch3,
  extrasEnd: [L_x_xuong_erd],
  quiz: QUIZ,
  quizDescription: '10 câu về Chương 3 (slide Chapter 4 của trường): ERD này thành mấy bảng, khoá của thực thể yếu, liên kết ba ngôi có mũi tên, thuộc tính phức hợp và dẫn xuất, khoá ngoại của liên kết 1-M, chiến lược lớp con hướng đối tượng, bội số UML, ON DELETE CASCADE và UNIQUE với NULL trên SQL Server — 3 câu được chạy thật để xác nhận đáp án; mỗi câu có giải thích.',
  quizLesson: QUIZ_LESSON,
};
