/**
 * CSI106 · Chương 11 — Databases, học theo từng slide: PHẦN A (slide 1–21).
 * Deck 'csi11' (CSI11), 42 slide, ảnh đã render lên CDN images/academy/CSI106/v1/csi11/NNN.webp.
 *
 * Nội dung bám ĐÚNG chữ trích từ CSI_11.pptx của trường (/tmp/csi106-text/csi11.txt, slide 1→21).
 * Các slide mà nội dung thật nằm trong HÌNH (7, 9, 14, 15, 16, 17, 19, 20, 21) đã được đọc thẳng
 * từ ảnh đã render để lấy đúng từng nhãn trong bảng và sơ đồ.
 *
 * MỌI câu SQL trong bài đã CHẠY THẬT bằng sqlite3 3.51.0 trên một CSDL thư viện mẫu
 * (SinhVien · Sach · MuonSach) và trên chính bảng COURSES của slide 19/21; mọi bảng kết quả,
 * mọi thông báo lỗi và mọi dòng EXPLAIN QUERY PLAN trong bài là kết quả thật, không phỏng đoán.
 *
 * Những chỗ SLIDE GỐC SAI, thiếu hoặc gây hiểu nhầm — đã nêu rõ trong bài, KHÔNG im lặng chép lại
 * và KHÔNG tự ý sửa slide:
 *   · slide 6 viết "more efficient that a flat-file system" — gõ nhầm "that" thay vì "than".
 *   · slide 6 giải thích Efficiency bằng "a piece of information is stored in fewer locations";
 *     lý do thật của hiệu năng là CHỈ MỤC và tối ưu hoá truy vấn, không phải số bản sao.
 *   · slide 6 dẫn "see Chapter 16" cho tính toàn vẹn — chương 16 của Forouzan là An toàn/Security;
 *     phần toàn vẹn dữ liệu nằm ngay trong chương 14 (chương CSDL).
 *   · thân slide 9, 14, 15, 16, 17, 19 dẫn "Figure 14.2 / 14.3 / 14.4 / 14.5 / 14.6" trong khi
 *     chú thích hình lại ghi "Figure 11.2 … 11.7" — deck đánh lại số của chương 14 sách gốc.
 *   · hình slide 14 xếp Network và Hierarchical vào nhánh "Non-relational"; cách chia này lệch với
 *     chữ trên chính slide ("three models have been in use") và lệch với nghĩa NoSQL hiện nay.
 *   · slide 19 định nghĩa cardinality nhưng KHÔNG định nghĩa degree (bậc) và domain (miền),
 *     dù cả hai đều nằm trong giáo trình và đều bị hỏi trong đề.
 *   · slide 20 tuyên bố "nine operations" nhưng cả deck chỉ có slide riêng cho SÁU
 *     (insert, delete, update, select, join, union) — project, intersection, difference không
 *     có slide nào; phải tự học ba phép còn lại.
 *   · hình slide 21 viết chuỗi bằng NHÁY KÉP ("CIS52", "TCP/IP"). Chuẩn SQL dùng nháy ĐƠN;
 *     nháy kép là để bọc TÊN ĐỐI TƯỢNG. Đã đo: SQLite chấp nhận cả hai, PostgreSQL thì không.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'csi11';

export default {
  title: '11.0a — Slide by slide: Databases, DBMS architecture and the relational model (slides 1–21)|||11.0a — Slide bài giảng: Cơ sở dữ liệu, kiến trúc DBMS & mô hình quan hệ (slide 1–21)',
  slug: 'csi106-11-0a-slides-csdl-mo-hinh-quan-he',
  type: 'DOCUMENT',
  description: 'Nửa đầu Chương 11 của CSI106 (slide 1–21) đi theo đúng bộ slide của trường: vì sao tệp phẳng thất bại, năm lợi thế của CSDL, năm thành phần của một DBMS, kiến trúc ba mức ANSI/SPARC cùng khái niệm độc lập dữ liệu, ba mô hình CSDL kinh điển, rồi vào mô hình quan hệ với quan hệ, thuộc tính, bộ, bậc, lực lượng, miền và ba loại khoá. Mọi câu SQL trong bài đã chạy thật bằng sqlite3 trên một CSDL thư viện mẫu ba bảng (SinhVien · Sach · MuonSach) và trên chính bảng COURSES của slide, nên mọi bảng kết quả, mọi thông báo lỗi ràng buộc và mọi dòng EXPLAIN QUERY PLAN đều là kết quả đo được. Ứng với CLO11 và là nền trực tiếp cho môn DBI202.',
  content: [
    walkHead(D, 1, 21),
    walk(D, [

      [1, '11. Databases',
        `<p class="y-chinh">🎯 The title slide of Chapter 11. One word carries the whole chapter: <strong>database</strong> — a single, shared, structured collection of data, managed by software, replacing the pile of separate files that Chapter 10 described.</p>
<ul>
<li><strong>Where this sits in the course</strong> — Chapter 9 taught data structures (in memory), Chapter 10 taught file structures (on disk, one program owning one file). Chapter 11 is the next honest step: what happens when <em>many</em> programs and <em>many</em> people need the same data at the same time, and the answer stops being "a file".</li>
<li><strong>The textbook chapter</strong> — Forouzan, <em>Foundations of Computer Science</em>, Chapter 14 "Databases". The deck renumbers it to 11, which is why the body text still cites "Figure 14.1, 14.2, 14.3…" while the captions say "Figure 11.1, 11.2, 11.3…". Same picture, two numbers.</li>
<li><strong>What CLO11 asks of you</strong> — define a database and a DBMS, describe the three-level architecture, name the three traditional models, describe a relation, and use SQL operations. Slides 1–21 cover everything up to the first SQL command.</li>
<li><strong>Why this chapter pays off later</strong> — DBI202 (Database Systems) is a whole subject built on what slides 19–26 sketch in eight minutes. Every vocabulary word you nail here (relation, tuple, attribute, primary key, foreign key) is a word you will use for the next three semesters.</li>
<li><strong>The one sentence to leave with</strong> — a database moves the <em>description of the data</em> out of the program and into the data store itself. Everything else in the chapter is a consequence of that move.</li>
</ul>
<p class="meo">💡 As you read the chapter, keep one running example alive in your head — the university library: students, books, borrowings. Every abstract term (relation, key, view, index) is easier to hold when it has a table to point at. This walkthrough uses exactly that example, and every SQL command in it was really executed.</p>`,
        `<p class="y-chinh">🎯 Slide tiêu đề của Chương 11. Một chữ gánh cả chương: <strong>cơ sở dữ liệu</strong> — một khối dữ liệu DUY NHẤT, dùng chung, có cấu trúc, do phần mềm quản lý, thay cho đống tệp rời rạc mà Chương 10 đã mô tả.</p>
<ul>
<li><strong>Chương này nằm ở đâu trong môn</strong> — Chương 9 dạy cấu trúc dữ liệu (trong bộ nhớ), Chương 10 dạy cấu trúc tệp (trên đĩa, một chương trình sở hữu một tệp). Chương 11 là bước tiếp theo trung thực: chuyện gì xảy ra khi <em>nhiều</em> chương trình và <em>nhiều</em> người cùng cần một dữ liệu tại cùng một lúc, và câu trả lời không còn là "một cái tệp" nữa.</li>
<li><strong>Chương trong giáo trình</strong> — Forouzan, <em>Foundations of Computer Science</em>, Chương 14 "Databases". Deck đánh lại số thành 11, nên phần chữ vẫn dẫn "Figure 14.1, 14.2, 14.3…" trong khi chú thích hình ghi "Figure 11.1, 11.2, 11.3…". Cùng một bức hình, hai số hiệu.</li>
<li><strong>CLO11 đòi gì ở bạn</strong> — định nghĩa CSDL và DBMS, mô tả kiến trúc ba mức, kể tên ba mô hình kinh điển, mô tả một quan hệ, và dùng được các phép toán SQL. Slide 1–21 phủ tới ngay trước câu lệnh SQL đầu tiên.</li>
<li><strong>Vì sao chương này sinh lời về sau</strong> — DBI202 (Hệ cơ sở dữ liệu) là cả một môn dựng trên đúng những gì slide 19–26 phác trong tám phút. Mỗi từ vựng bạn nắm chắc ở đây (quan hệ, bộ, thuộc tính, khoá chính, khoá ngoại) là một từ bạn sẽ dùng suốt ba kỳ tới.</li>
<li><strong>Một câu mang ra khỏi chương</strong> — cơ sở dữ liệu dời <em>bản mô tả dữ liệu</em> ra khỏi chương trình và đặt nó vào chính kho dữ liệu. Mọi thứ còn lại trong chương chỉ là hệ quả của cú dời ấy.</li>
</ul>
<p class="meo">💡 Đọc chương này thì giữ sống một ví dụ chạy xuyên suốt trong đầu — thư viện trường: sinh viên, sách, lượt mượn. Mọi thuật ngữ trừu tượng (quan hệ, khoá, khung nhìn, chỉ mục) đều dễ nắm hơn khi có một cái bảng để chỉ tay vào. Loạt bài này dùng đúng ví dụ ấy, và mọi câu SQL trong bài đều đã được chạy thật.</p>`],

      [2, 'Content',
        `<p class="y-chinh">🎯 The six sections of the chapter. Read it as a map: sections 11.1–11.4 are the theory you are examined on, 11.5 is design, and 11.6 is a click-by-click lab guide for SQL Server that carries almost no exam weight.</p>
<ul>
<li><strong>11.1 Introduction</strong> (slides 4–7) — flat files and why they fail, the five advantages of a database, and the five components of a DBMS. Pure definitions, and the easiest marks in the chapter.</li>
<li><strong>11.2 Database architecture</strong> (8–12) — the ANSI/SPARC three levels: internal, conceptual, external. This is the section students under-prepare and the exam loves.</li>
<li><strong>11.3 Database model</strong> (13–17) — hierarchical, network, relational. Two of the three are declared obsolete on the slides themselves, which tells you how much detail to memorise.</li>
<li><strong>11.4 The relationship database model</strong> (18–26) — relation, attributes, tuples, cardinality, then nine operations expressed in SQL. Slides 1–21 of this walkthrough stop inside this section, at the first operation (insert).</li>
<li><strong>11.5 Database design</strong> (27–34) — E-R modelling, turning an E-R diagram into relations, and normalisation up to 2NF. Part B of the walkthrough.</li>
<li><strong>11.6 Guide to practice set</strong> (35–42) — installing SQL Server Management Studio and clicking through a first table. It is lab material, not exam material.</li>
</ul>
<p class="pitfall">⚠️ Note the section title typo on the slide: "11.6 Guide <em>do</em> practice set" should read "Guide <em>to</em> practice set". Harmless, but it is a reminder that the deck is a translation-and-retype of Forouzan's Chapter 14, so trust the <em>ideas</em> and check the <em>wording</em>.</p>`,
        `<p class="y-chinh">🎯 Sáu mục của chương. Hãy đọc nó như một bản đồ: mục 11.1–11.4 là phần lý thuyết bị ra đề, 11.5 là thiết kế, còn 11.6 là hướng dẫn thực hành bấm chuột trên SQL Server, gần như không có trọng số thi.</p>
<ul>
<li><strong>11.1 Introduction</strong> (slide 4–7) — tệp phẳng và vì sao nó hỏng, năm lợi thế của CSDL, và năm thành phần của một DBMS. Thuần định nghĩa, và là điểm dễ ăn nhất cả chương.</li>
<li><strong>11.2 Database architecture</strong> (8–12) — ba mức ANSI/SPARC: trong, khái niệm, ngoài. Đây là mục sinh viên hay ôn hụt và đề thi thì rất thích.</li>
<li><strong>11.3 Database model</strong> (13–17) — phân cấp, mạng, quan hệ. Hai trong ba mô hình được chính slide tuyên bố là lỗi thời, điều đó cho bạn biết cần thuộc tới mức chi tiết nào.</li>
<li><strong>11.4 The relationship database model</strong> (18–26) — quan hệ, thuộc tính, bộ, lực lượng, rồi chín phép toán diễn đạt bằng SQL. Slide 1–21 của loạt bài này dừng ngay bên trong mục ấy, ở phép đầu tiên (insert).</li>
<li><strong>11.5 Database design</strong> (27–34) — mô hình thực thể–liên kết, chuyển sơ đồ E-R thành các quan hệ, và chuẩn hoá tới 2NF. Đó là Phần B của loạt bài.</li>
<li><strong>11.6 Guide to practice set</strong> (35–42) — cài SQL Server Management Studio và bấm chuột tạo bảng đầu tiên. Đó là tài liệu thực hành, không phải tài liệu thi.</li>
</ul>
<p class="pitfall">⚠️ Để ý lỗi gõ ngay trên slide: "11.6 Guide <em>do</em> practice set" đáng lẽ phải là "Guide <em>to</em> practice set". Vô hại, nhưng nó nhắc rằng deck này là bản gõ lại từ Chương 14 của Forouzan — hãy tin vào <em>ý</em> và luôn soi lại <em>chữ</em>.</p>`],

      [3, 'Objectives',
        `<p class="y-chinh">🎯 Ten objectives, and each one is almost verbatim an exam question. Count the verbs: <em>define</em> appears four times, <em>describe</em> three times, <em>understand</em> twice, <em>list</em> once. This is a recall-heavy chapter.</p>
<ul>
<li><strong>"Define a database and a DBMS and describe the components of a DBMS"</strong> — slide 7 gives the five components: hardware, software, data, users, procedures. Memorise the list; it is a guaranteed question.</li>
<li><strong>"Describe the architecture of a DBMS based on the ANSI/SPARC definition"</strong> — three levels, slides 9–12. You must be able to name them <em>in order from the disk upwards</em>: internal → conceptual → external.</li>
<li><strong>"Define the three traditional database models"</strong> — hierarchical, network, relational (slides 14–17). Notice "traditional": the last objective adds "list database types other than the relational model", which means object-oriented, NoSQL, distributed.</li>
<li><strong>"Describe the relational model and relations"</strong> — slide 19. Name, attributes, tuples, cardinality.</li>
<li><strong>"Understand operations on a relational database based on commands available in SQL"</strong> — slides 20–26. Note the wording: the course tests the <em>concept</em> of each operation through SQL, it does not ask you to write production SQL.</li>
<li><strong>"Describe the steps in database design" / "Define ERM and E-R diagrams"</strong> — slides 28–31, Part B.</li>
<li><strong>"Define the hierarchical levels of normalization and understand the rationale"</strong> — slides 32–34, Part B. Only 1NF and 2NF get a slide each, but the names 3NF, BCNF, 4NF, 5NF appear and can be asked as a list.</li>
</ul>
<p class="meo">💡 Make ten flashcards where the <em>question side</em> is the objective sentence copied word for word. If you can answer all ten aloud in six minutes, the whole chapter is done. This is the cheapest revision trick in CSI106 and it works because the exam writer used these same ten lines.</p>`,
        `<p class="y-chinh">🎯 Mười mục tiêu, và mỗi mục gần như là một câu hỏi thi nguyên văn. Đếm động từ: <em>define</em> bốn lần, <em>describe</em> ba lần, <em>understand</em> hai lần, <em>list</em> một lần. Đây là chương nặng về ghi nhớ.</p>
<ul>
<li><strong>"Định nghĩa CSDL và DBMS, mô tả các thành phần của DBMS"</strong> — slide 7 cho năm thành phần: phần cứng, phần mềm, dữ liệu, người dùng, quy trình. Thuộc danh sách này đi; nó chắc chắn được hỏi.</li>
<li><strong>"Mô tả kiến trúc DBMS theo định nghĩa ANSI/SPARC"</strong> — ba mức, slide 9–12. Phải gọi tên được <em>theo thứ tự từ đĩa đi lên</em>: trong → khái niệm → ngoài.</li>
<li><strong>"Định nghĩa ba mô hình CSDL kinh điển"</strong> — phân cấp, mạng, quan hệ (slide 14–17). Để ý chữ "kinh điển": mục tiêu cuối cùng còn thêm "liệt kê các loại CSDL khác ngoài mô hình quan hệ", tức là hướng đối tượng, NoSQL, phân tán.</li>
<li><strong>"Mô tả mô hình quan hệ và quan hệ"</strong> — slide 19. Tên, thuộc tính, bộ, lực lượng.</li>
<li><strong>"Hiểu các phép toán trên CSDL quan hệ dựa trên lệnh SQL"</strong> — slide 20–26. Chú ý cách diễn đạt: môn này kiểm tra <em>khái niệm</em> của từng phép thông qua SQL, chứ không bắt bạn viết SQL mức sản xuất.</li>
<li><strong>"Mô tả các bước thiết kế CSDL" / "Định nghĩa ERM và sơ đồ E-R"</strong> — slide 28–31, thuộc Phần B.</li>
<li><strong>"Định nghĩa các mức chuẩn hoá và hiểu lý do chuẩn hoá"</strong> — slide 32–34, Phần B. Chỉ 1NF và 2NF có slide riêng, nhưng các tên 3NF, BCNF, 4NF, 5NF có xuất hiện và có thể bị hỏi dạng liệt kê.</li>
</ul>
<p class="meo">💡 Làm mười thẻ ghi nhớ mà <em>mặt câu hỏi</em> là chính câu mục tiêu, chép nguyên văn. Trả lời được cả mười thành tiếng trong sáu phút thì cả chương coi như xong. Đây là mẹo ôn rẻ nhất của CSI106 và nó hiệu quả vì người ra đề cũng dùng đúng mười dòng này.</p>`],

      [4, '1 - Introduction',
        `<p class="y-chinh">🎯 A section divider opening section 11.1. The three slides behind it answer one question in three steps: <em>what did we do before databases, why did it hurt, and what piece of software fixed it?</em></p>
<ul>
<li><strong>Slide 5 — the problem</strong> — flat files, one per application, the university example where five offices each keep their own file about the same people.</li>
<li><strong>Slide 6 — the payoff</strong> — five advantages of a database: less redundancy, inconsistency avoidance, efficiency, data integrity, confidentiality.</li>
<li><strong>Slide 7 — the machine that delivers it</strong> — the DBMS and its five components.</li>
<li><strong>The link backwards you must make</strong> — Chapter 10 of this course taught sequential, indexed and hashed <em>files</em>. Nothing in this chapter throws that away: a database is still stored in files on a disk, with indexes that are still B-trees. What changes is <em>who describes the structure</em> — the DBMS, not each program.</li>
<li><strong>A definition worth having early</strong> — a database is an organised collection of <em>related</em> data. The word doing the work is "related": a folder holding a hundred unrelated CSV files is not a database, it is a folder.</li>
</ul>
<p class="meo">💡 Keep the phrase <strong>"data about data"</strong> — metadata — in reach. The single deepest difference between a file and a database is that the database also stores the description of its own structure (column names, types, keys, constraints), and stores it inside itself. That is what lets a new program read the data correctly without being told anything by the old program.</p>`,
        `<p class="y-chinh">🎯 Slide phân mục mở đầu mục 11.1. Ba slide phía sau trả lời một câu hỏi qua ba bước: <em>trước khi có CSDL ta làm thế nào, nó đau ở đâu, và phần mềm nào chữa được?</em></p>
<ul>
<li><strong>Slide 5 — vấn đề</strong> — tệp phẳng, mỗi ứng dụng một tệp, cùng ví dụ trường đại học với năm phòng ban ai cũng giữ tệp riêng về cùng một nhóm người.</li>
<li><strong>Slide 6 — phần thưởng</strong> — năm lợi thế của CSDL: ít dư thừa, tránh mâu thuẫn, hiệu quả, toàn vẹn dữ liệu, bảo mật.</li>
<li><strong>Slide 7 — cỗ máy làm ra phần thưởng ấy</strong> — DBMS và năm thành phần của nó.</li>
<li><strong>Mối nối ngược bạn phải tự bắc</strong> — Chương 10 của môn đã dạy <em>tệp</em> tuần tự, tệp chỉ mục và tệp băm. Chương này không vứt bỏ gì cả: cơ sở dữ liệu vẫn nằm trong các tệp trên đĩa, chỉ mục của nó vẫn là cây B. Cái đổi là <em>ai mô tả cấu trúc</em> — DBMS, chứ không phải từng chương trình.</li>
<li><strong>Một định nghĩa nên có sớm</strong> — cơ sở dữ liệu là một tập dữ liệu <em>có liên quan với nhau</em> được tổ chức lại. Chữ gánh việc là "liên quan": một thư mục chứa một trăm file CSV rời rạc không phải cơ sở dữ liệu, nó là một thư mục.</li>
</ul>
<p class="meo">💡 Giữ sẵn cụm <strong>"dữ liệu về dữ liệu"</strong> — siêu dữ liệu. Khác biệt sâu nhất giữa tệp và CSDL là CSDL còn lưu cả bản mô tả cấu trúc của chính nó (tên cột, kiểu, khoá, ràng buộc), và lưu ngay bên trong nó. Đó là thứ cho phép một chương trình mới đọc đúng dữ liệu mà không cần chương trình cũ dặn dò gì.</p>`],

      [5, '1. Introduction (flat files)',
        `<p class="y-chinh">🎯 The historical starting point: data used to live in <strong>individual, unrelated files — flat files</strong>, and each application program owned its own. The university example on the slide is the whole argument in one paragraph.</p>
<ul>
<li><strong>The slide's five offices</strong> — the <em>records office</em> keeps student information and grades; the <em>financial aid office</em> keeps its own file of students needing aid; the <em>scheduling office</em> keeps professors and the courses they teach; the <em>payroll department</em> keeps the whole staff, professors included. Four files, four programs, and the same human beings written down four times.</li>
<li><strong>Why it was reasonable in its day</strong> — in the 1960s a program and its file were designed together, on the same machine, by the same team. If nobody else needed the data, nothing was lost. The model broke when organisations grew and departments started asking each other questions.</li>
<li><strong>What "flat" actually means</strong> — the file has no internal structure the system understands. To the operating system it is a byte stream; only the program that wrote it knows that bytes 0–7 are the student ID and bytes 8–37 the name. That knowledge lives in the <em>code</em>, not in the file.</li>
<li><strong>Which is why changing the layout is so expensive</strong> — widen the name field from 30 to 50 characters and every program reading that file must be found, edited, recompiled and redeployed. This is <em>program–data dependence</em>, and it is the deepest of the five problems on slide 6.</li>
<li><strong>The fix stated on the slide</strong> — "all of these flat-files can be combined in a single entity, the database for the whole university". One store, many views. Slide 12 will show how each office still gets to see only its own part.</li>
</ul>
<p class="pitfall">⚠️ Do not read "flat file" as "text file" or "CSV". A fixed-length binary record file from Chapter 10 is just as flat. The word is about <em>the absence of a system-managed structure and of relationships</em>, not about the file being human-readable. A CSV with a header row is still flat; a well-indexed proprietary binary file is still flat.</p>`,
        `<p class="y-chinh">🎯 Điểm khởi đầu lịch sử: dữ liệu từng nằm trong <strong>các tệp riêng lẻ, không liên quan nhau — tệp phẳng</strong>, và mỗi chương trình ứng dụng sở hữu tệp của riêng nó. Ví dụ trường đại học trên slide chính là toàn bộ lập luận gói trong một đoạn văn.</p>
<ul>
<li><strong>Năm phòng ban trên slide</strong> — <em>phòng đào tạo</em> giữ thông tin và điểm sinh viên; <em>phòng học bổng</em> giữ tệp riêng về sinh viên cần hỗ trợ tài chính; <em>phòng xếp lịch</em> giữ tên giảng viên và các môn họ dạy; <em>phòng lương</em> giữ toàn bộ nhân sự, kể cả giảng viên. Bốn tệp, bốn chương trình, và cùng những con người ấy bị chép xuống bốn lần.</li>
<li><strong>Vì sao thời ấy làm thế là hợp lý</strong> — những năm 1960, một chương trình và tệp của nó được thiết kế cùng nhau, trên cùng một máy, bởi cùng một nhóm. Nếu không ai khác cần dữ liệu ấy thì chẳng mất gì. Mô hình vỡ khi tổ chức lớn lên và các phòng bắt đầu hỏi nhau.</li>
<li><strong>"Phẳng" thật ra nghĩa là gì</strong> — tệp không có cấu trúc bên trong mà hệ thống hiểu được. Với hệ điều hành nó chỉ là một dòng byte; chỉ chương trình đã ghi nó mới biết byte 0–7 là mã sinh viên và byte 8–37 là họ tên. Hiểu biết ấy sống trong <em>mã nguồn</em>, không sống trong tệp.</li>
<li><strong>Và vì thế đổi bố cục là cực đắt</strong> — nới trường tên từ 30 lên 50 ký tự thì mọi chương trình đang đọc tệp đó đều phải tìm ra, sửa, biên dịch lại và triển khai lại. Đó là <em>sự phụ thuộc chương trình–dữ liệu</em>, và là vấn đề sâu nhất trong năm vấn đề của slide 6.</li>
<li><strong>Lời chữa mà slide đưa ra</strong> — "tất cả các tệp phẳng ấy có thể gộp lại thành một thực thể duy nhất, cơ sở dữ liệu của cả trường". Một kho, nhiều góc nhìn. Slide 12 sẽ cho thấy từng phòng vẫn chỉ nhìn được đúng phần của mình.</li>
</ul>
<p class="pitfall">⚠️ Đừng đọc "tệp phẳng" thành "tệp văn bản" hay "CSV". Một tệp bản ghi nhị phân độ dài cố định ở Chương 10 cũng phẳng y như vậy. Chữ ấy nói về <em>việc KHÔNG có cấu trúc do hệ thống quản lý và KHÔNG có liên kết</em>, chứ không nói tệp có đọc bằng mắt được hay không. CSV có dòng tiêu đề vẫn là phẳng; một tệp nhị phân độc quyền có chỉ mục tốt vẫn là phẳng.</p>`],

      [6, '2. Advantages of databases',
        `<p class="y-chinh">🎯 Five advantages: <strong>less redundancy, inconsistency avoidance, efficiency, data integrity, confidentiality</strong>. Every one of them is the mirror image of a problem the flat-file university had. The easiest way to believe them is to build both versions and measure — which is exactly what was done below.</p>
<ul>
<li><strong>Less redundancy</strong> — the slide's own example: professors' and students' names are stored in more than one file. Measured on a three-row flat borrowing table holding two students, the repeated name+class+email text came to <strong>110 bytes</strong>; the same two students stored once in a <code>SinhVien</code> table came to <strong>70 bytes</strong>. With 5 000 borrowings the flat version repeats the same student text thousands of times.</li>
<li><strong>Inconsistency avoidance</strong> — the slide's marriage example, reproduced for real. A flat table holding one row per borrowing was updated the way a careless clerk would: one row only. Result below — the same student ID now answers to two different names, and no query can say which is right.</li>
<li><strong>Efficiency</strong> — slide 10 shows the real mechanism (indexes), not the one the slide states; see the Answer note below.</li>
<li><strong>Data integrity</strong> — the DBMS refuses writes that break the rules. Three real refusals were captured: duplicate primary key, a borrowing that points at a non-existent student, and a negative copy count.</li>
<li><strong>Confidentiality</strong> — centralised storage means one place to apply permissions and views. Slide 12 shows the view mechanism concretely.</li>
</ul>
<p class="nhan">Bằng chứng đã chạy thật — tệp phẳng, sửa tên ở MỘT dòng:</p>
<pre>UPDATE MuonSach_Phang SET ho_ten='Nguyen Van An Khang'
 WHERE mssv='HE180001' AND isbn='978-0132145374';
SELECT mssv, ho_ten FROM MuonSach_Phang WHERE mssv='HE180001';</pre>
<table><tr><th>mssv</th><th>ho_ten</th></tr>
<tr><td>HE180001</td><td>Nguyen Van An Khang</td></tr>
<tr><td>HE180001</td><td>Nguyen Van An</td></tr></table>
<p class="nhan">The same change in the 3-table database — <code>UPDATE SinhVien SET ho_ten=… WHERE mssv='HE180001';</code> — reported <code>changes() = 1</code>, and the joined view of that student's two borrowings showed the new name on <em>both</em> rows.</p>
<p class="dap-an">✅ Answer / correction: the slide justifies <em>Efficiency</em> with "a piece of information is stored in fewer locations". That is the reason for <em>less redundancy</em>, not for speed — a DBMS in fact adds overhead (parsing, planning, locking, logging) that a raw file read does not pay. Real database speed comes from <strong>indexes and a query optimiser</strong>, demonstrated on slide 10. Also note the typo: "more efficient <em>that</em> a flat-file system" should be "<em>than</em>". And the cross-reference "(see Chapter 16)" points at Forouzan's Security chapter; data integrity is discussed inside the database chapter itself.</p>
<p class="pitfall">⚠️ Exam trap: "a database removes redundancy completely". False. It removes <em>uncontrolled</em> redundancy. Foreign keys are deliberate duplication (<code>HE180001</code> appears in both <code>SinhVien</code> and <code>MuonSach</code>), and denormalisation for speed is a legitimate design choice you will meet in DBI202.</p>`,
        `<p class="y-chinh">🎯 Năm lợi thế: <strong>ít dư thừa, tránh mâu thuẫn, hiệu quả, toàn vẹn dữ liệu, bảo mật</strong>. Mỗi cái là ảnh phản chiếu của một vấn đề mà trường đại học dùng tệp phẳng gặp phải. Cách dễ tin nhất là dựng cả hai phiên bản rồi ĐO — và đó chính là việc đã làm ở dưới.</p>
<ul>
<li><strong>Ít dư thừa</strong> — ví dụ của chính slide: tên giảng viên và sinh viên bị lưu ở nhiều hơn một tệp. Đo trên một bảng mượn phẳng ba dòng chứa hai sinh viên, phần chữ họ tên + lớp + email lặp lại chiếm <strong>110 byte</strong>; cũng hai sinh viên ấy lưu MỘT lần trong bảng <code>SinhVien</code> chỉ chiếm <strong>70 byte</strong>. Với 5.000 lượt mượn thì bản phẳng chép lại đúng đoạn chữ ấy hàng nghìn lần.</li>
<li><strong>Tránh mâu thuẫn</strong> — ví dụ cô sinh viên lấy chồng đổi họ trên slide, làm lại cho thật. Một bảng phẳng mỗi dòng một lượt mượn được sửa đúng kiểu một nhân viên cẩu thả: chỉ sửa một dòng. Kết quả ở dưới — cùng một mã sinh viên giờ mang hai cái tên khác nhau, và không truy vấn nào nói được cái nào đúng.</li>
<li><strong>Hiệu quả</strong> — slide 10 mới cho thấy cơ chế thật (chỉ mục), chứ không phải cơ chế mà slide nêu; xem phần Đáp án bên dưới.</li>
<li><strong>Toàn vẹn dữ liệu</strong> — DBMS từ chối mọi lệnh ghi phá luật. Đã bắt được ba lần từ chối thật: trùng khoá chính, một lượt mượn trỏ vào sinh viên không tồn tại, và số bản sách âm.</li>
<li><strong>Bảo mật</strong> — lưu tập trung nghĩa là chỉ một chỗ để đặt quyền và khung nhìn. Slide 12 cho thấy cơ chế khung nhìn một cách cụ thể.</li>
</ul>
<p class="nhan">Bằng chứng đã chạy thật — tệp phẳng, sửa tên ở MỘT dòng:</p>
<pre>UPDATE MuonSach_Phang SET ho_ten='Nguyen Van An Khang'
 WHERE mssv='HE180001' AND isbn='978-0132145374';
SELECT mssv, ho_ten FROM MuonSach_Phang WHERE mssv='HE180001';</pre>
<table><tr><th>mssv</th><th>ho_ten</th></tr>
<tr><td>HE180001</td><td>Nguyen Van An Khang</td></tr>
<tr><td>HE180001</td><td>Nguyen Van An</td></tr></table>
<p class="nhan">Cùng phép sửa ấy trên CSDL ba bảng — <code>UPDATE SinhVien SET ho_ten=… WHERE mssv='HE180001';</code> — báo <code>changes() = 1</code>, và bảng kết nối hai lượt mượn của sinh viên đó hiện tên mới ở <em>cả hai</em> dòng.</p>
<p class="dap-an">✅ Đáp án / đính chính: slide biện minh cho <em>Efficiency</em> bằng câu "một mẩu thông tin được lưu ở ít vị trí hơn". Đó là lý do của <em>ít dư thừa</em>, không phải lý do của tốc độ — thật ra DBMS còn ĐẮT hơn vì phải phân tích câu lệnh, lập kế hoạch, khoá, ghi nhật ký, những thứ mà đọc tệp thô không phải trả. Tốc độ thật của CSDL đến từ <strong>chỉ mục và bộ tối ưu hoá truy vấn</strong>, sẽ chứng minh ở slide 10. Cũng lưu ý lỗi gõ: "more efficient <em>that</em> a flat-file system" đáng lẽ là "<em>than</em>". Và dẫn chiếu "(see Chapter 16)" trỏ sang chương An toàn của Forouzan; phần toàn vẹn dữ liệu nằm ngay trong chính chương CSDL.</p>
<p class="pitfall">⚠️ Bẫy thi: "cơ sở dữ liệu loại bỏ HOÀN TOÀN dư thừa". Sai. Nó loại bỏ dư thừa <em>không kiểm soát</em>. Khoá ngoại chính là trùng lặp có chủ ý (<code>HE180001</code> xuất hiện ở cả <code>SinhVien</code> lẫn <code>MuonSach</code>), và việc phi chuẩn hoá để lấy tốc độ là một lựa chọn thiết kế chính đáng mà bạn sẽ gặp ở DBI202.</p>`],

      [7, '3. Database management systems',
        `<p class="y-chinh">🎯 The definition that must be word-perfect: a <strong>DBMS defines, creates, and maintains a database, and allows controlled access to the data</strong>. Figure 11.1 draws its five components around a central hub: <em>hardware, software, data, users, procedures</em>.</p>
<ul>
<li><strong>Hardware</strong> — the physical computer system that allows access to data: the server, its CPU, memory, and above all the disks. Note that the hardware is <em>listed as part of the DBMS</em> in this framing — Forouzan is describing a whole database <em>system</em>, not just the program.</li>
<li><strong>Software</strong> — the actual program that lets users access, maintain and update data. Real names to attach: Oracle, Microsoft SQL Server (the deck's own lab tool, slides 36–42), MySQL, PostgreSQL, and SQLite — the last one is what every SQL example in this walkthrough really ran on.</li>
<li><strong>Data</strong> — stored physically on the storage devices, and the slide makes the decisive point: <em>"in a database, data is a separate entity from the software that accesses it"</em>. That single sentence is the end of program–data dependence from slide 5.</li>
<li><strong>Users</strong> — people who control, manage and operate on the database. Three roles worth naming: the <strong>DBA</strong> (database administrator, who owns the conceptual schema of slide 11), <strong>application programmers</strong>, and <strong>end users</strong>. The slide's Figure 11.2 on the next section shows end users sitting at the external level.</li>
<li><strong>Procedures</strong> — the rules and instructions for designing and using the DBMS: backup schedules, naming conventions, who may grant permissions, what to do when a server fails. It is the only non-technical component, and the one students forget in the exam.</li>
</ul>
<p class="meo">💡 Mnemonic for the five, in the order the figure reads clockwise from the top: <strong>P-U-H-S-D</strong> — Procedure, Users, Hardware, Software, Data. Or in Vietnamese order of habit: <em>phần cứng, phần mềm, dữ liệu, người dùng, quy trình</em>. Either way, always say five, never four — dropping "procedures" is the classic half-mark loss.</p>
<p class="pitfall">⚠️ Do not confuse <strong>database</strong> with <strong>DBMS</strong>. The database is the data; the DBMS is the software that manages it. "I installed a database" is loose speech — you installed a DBMS, and then you created a database with it. An exam question phrased "which of the following is NOT a component of a DBMS?" is testing exactly this five-item list.</p>`,
        `<p class="y-chinh">🎯 Định nghĩa phải thuộc từng chữ: <strong>DBMS định nghĩa, tạo lập và duy trì một cơ sở dữ liệu, đồng thời cho phép truy cập dữ liệu một cách CÓ KIỂM SOÁT</strong>. Hình 11.1 vẽ năm thành phần vây quanh một lõi: <em>phần cứng, phần mềm, dữ liệu, người dùng, quy trình</em>.</p>
<ul>
<li><strong>Phần cứng</strong> — hệ thống máy tính vật lý cho phép truy cập dữ liệu: máy chủ, CPU, bộ nhớ, và trên hết là các ổ đĩa. Để ý rằng phần cứng ở đây được liệt kê <em>như một thành phần của DBMS</em> — Forouzan đang mô tả cả một <em>hệ thống</em> cơ sở dữ liệu, không chỉ mỗi chương trình.</li>
<li><strong>Phần mềm</strong> — chính chương trình cho người dùng truy cập, bảo trì và cập nhật dữ liệu. Vài cái tên thật để gắn vào: Oracle, Microsoft SQL Server (đúng công cụ thực hành của deck, slide 36–42), MySQL, PostgreSQL, và SQLite — cái cuối cùng là thứ mà mọi ví dụ SQL trong loạt bài này thật sự chạy trên đó.</li>
<li><strong>Dữ liệu</strong> — lưu vật lý trên thiết bị lưu trữ, và slide nói ra điểm quyết định: <em>"trong một cơ sở dữ liệu, dữ liệu là một thực thể TÁCH RỜI khỏi phần mềm truy cập nó"</em>. Đúng một câu ấy chấm dứt sự phụ thuộc chương trình–dữ liệu ở slide 5.</li>
<li><strong>Người dùng</strong> — những người điều khiển, quản lý và thao tác trên CSDL. Ba vai đáng gọi tên: <strong>DBA</strong> (quản trị viên CSDL, người sở hữu lược đồ khái niệm ở slide 11), <strong>lập trình viên ứng dụng</strong>, và <strong>người dùng cuối</strong>. Hình 11.2 ở mục sau đặt người dùng cuối ngồi đúng ở mức ngoài.</li>
<li><strong>Quy trình</strong> — các luật và chỉ dẫn để thiết kế và dùng DBMS: lịch sao lưu, quy ước đặt tên, ai được cấp quyền, làm gì khi máy chủ chết. Đây là thành phần duy nhất KHÔNG mang tính kỹ thuật, và cũng là thứ sinh viên hay quên trong phòng thi.</li>
</ul>
<p class="meo">💡 Cách nhớ năm thành phần, theo chiều kim đồng hồ từ đỉnh hình: <strong>P-U-H-S-D</strong> — Procedure, Users, Hardware, Software, Data. Hoặc theo thứ tự quen tiếng Việt: <em>phần cứng, phần mềm, dữ liệu, người dùng, quy trình</em>. Kiểu nào cũng được, nhưng luôn nói NĂM, đừng bao giờ nói bốn — rụng chữ "quy trình" là kiểu mất nửa điểm kinh điển.</p>
<p class="pitfall">⚠️ Đừng lẫn <strong>cơ sở dữ liệu</strong> với <strong>DBMS</strong>. Cơ sở dữ liệu là dữ liệu; DBMS là phần mềm quản lý nó. Nói "tôi cài một cơ sở dữ liệu" là nói ẩu — bạn cài một DBMS, rồi dùng nó tạo ra một cơ sở dữ liệu. Câu hỏi thi dạng "thứ nào sau đây KHÔNG phải thành phần của DBMS?" chính là đang kiểm tra đúng danh sách năm mục này.</p>`],

      [8, '2 - Database architecture',
        `<p class="y-chinh">🎯 Section divider for 11.2 — the most conceptual part of the chapter, and the one that answers a question you did not know you had: <em>why does a database survive changes that would have destroyed a flat file?</em></p>
<ul>
<li><strong>What the next four slides deliver</strong> — slide 9 names the three ANSI/SPARC levels and draws them; slides 10, 11 and 12 take one level each, bottom to top.</li>
<li><strong>Where the names come from</strong> — ANSI/SPARC is the Standards Planning and Requirements Committee of the American National Standards Institute. Their DBMS study group proposed this three-schema architecture in <strong>1975</strong>. No product implements it literally, yet every product is described in its vocabulary — that is how good an abstraction it is.</li>
<li><strong>The single idea behind all three levels</strong> — <strong>data independence</strong>. Put a translation layer between "how it is stored" and "how it is seen", and either side can change without dragging the other with it.</li>
<li><strong>Two kinds of independence, and the exam wants both names</strong> — <em>physical data independence</em>: change the internal level (indexes, file layout, compression) without touching the conceptual level. <em>Logical data independence</em>: change the conceptual level (add a column, split a table) without touching the external views. The first is easy and every DBMS has it; the second is harder and only partly achieved in practice.</li>
<li><strong>The connection to slide 5</strong> — program–data dependence was the flat file's fatal flaw. The three-level architecture <em>is</em> the cure, expressed as a diagram.</li>
</ul>
<p class="meo">💡 A one-line way to hold the three levels: <strong>internal = how it is stored · conceptual = what is stored · external = what I am allowed to see.</strong> Say it in that order and you have also memorised the bottom-to-top order the diagram uses.</p>`,
        `<p class="y-chinh">🎯 Slide phân mục cho 11.2 — phần nặng khái niệm nhất của chương, và cũng là phần trả lời một câu hỏi bạn chưa kịp đặt ra: <em>vì sao cơ sở dữ liệu sống sót qua những thay đổi đã đủ giết chết một tệp phẳng?</em></p>
<ul>
<li><strong>Bốn slide tới sẽ giao gì</strong> — slide 9 gọi tên ba mức ANSI/SPARC và vẽ chúng ra; slide 10, 11, 12 mỗi slide một mức, đi từ dưới lên.</li>
<li><strong>Cái tên ấy từ đâu ra</strong> — ANSI/SPARC là Uỷ ban Hoạch định Tiêu chuẩn và Yêu cầu thuộc Viện Tiêu chuẩn Quốc gia Hoa Kỳ. Nhóm nghiên cứu DBMS của họ đề xuất kiến trúc ba lược đồ này năm <strong>1975</strong>. Không sản phẩm nào hiện thực hoá nó theo đúng nghĩa đen, vậy mà mọi sản phẩm đều được mô tả bằng từ vựng của nó — đủ thấy đó là một trừu tượng hoá tốt tới mức nào.</li>
<li><strong>Một ý duy nhất nằm sau cả ba mức</strong> — <strong>độc lập dữ liệu</strong>. Đặt một lớp phiên dịch vào giữa "lưu thế nào" và "nhìn thấy thế nào", thế là bên nào đổi cũng không lôi bên kia đi theo.</li>
<li><strong>Có HAI loại độc lập, và đề thi muốn cả hai cái tên</strong> — <em>độc lập dữ liệu vật lý</em>: đổi mức trong (chỉ mục, bố cục tệp, nén) mà không đụng mức khái niệm. <em>Độc lập dữ liệu logic</em>: đổi mức khái niệm (thêm cột, tách bảng) mà không đụng các khung nhìn ngoài. Cái đầu dễ và DBMS nào cũng có; cái sau khó hơn và trong thực tế chỉ đạt được một phần.</li>
<li><strong>Nối với slide 5</strong> — phụ thuộc chương trình–dữ liệu là tử huyệt của tệp phẳng. Kiến trúc ba mức CHÍNH LÀ thuốc chữa, được vẽ thành sơ đồ.</li>
</ul>
<p class="meo">💡 Một dòng để giữ ba mức: <strong>mức trong = lưu THẾ NÀO · mức khái niệm = lưu CÁI GÌ · mức ngoài = tôi được PHÉP THẤY gì.</strong> Đọc theo đúng thứ tự ấy là bạn cũng đã thuộc luôn thứ tự dưới-lên mà sơ đồ dùng.</p>`],

      [9, '1. Introduction (three-level architecture)',
        `<p class="y-chinh">🎯 The ANSI/SPARC three-level architecture, named and drawn: <strong>internal, conceptual, external</strong>. Figure 11.2 stacks them — hardware (a disk cylinder) at the bottom, then the red <em>Internal level</em>, the black <em>Conceptual level</em>, the grey <em>External level</em>, and three separate <em>User view</em> boxes on top.</p>
<ul>
<li><strong>Internal level</strong> — determines where data is actually stored on the storage devices; deals with low-level access methods and how bytes are transferred to and from storage. This is Chapter 10 (file structure) hiding under a new name.</li>
<li><strong>Conceptual level</strong> — defines the logical view of the data. The data model lives here, and so do the main DBMS functions such as queries. One conceptual schema per database, owned by the DBA.</li>
<li><strong>External level</strong> — interacts directly with the user, end users or application programs, and reshapes data from the conceptual level into a format familiar to that user. Many external schemas per database — the figure deliberately draws <em>three</em> user views on one external level.</li>
<li><strong>Read the picture's counts, they are the exam answer</strong> — one disk, one internal schema, one conceptual schema, <em>many</em> external schemas. "How many conceptual schemas does a database have?" → exactly one. "How many external schemas?" → as many as there are user groups.</li>
<li><strong>Map it onto the library database</strong> — internal: the B-tree index on <code>MuonSach(isbn)</code> created on slide 10. Conceptual: the three <code>CREATE TABLE</code> statements and their keys. External: the <code>v_TheThuVien</code> view on slide 12 that hides student emails from the front desk.</li>
</ul>
<table><tr><th>Mức</th><th>Lược đồ</th><th>Trả lời câu hỏi</th><th>Ai sở hữu</th><th>Có mấy cái</th></tr>
<tr><td>External / ngoài</td><td>external schema, user view</td><td>Tôi được thấy gì?</td><td>người dùng cuối, chương trình ứng dụng</td><td>nhiều</td></tr>
<tr><td>Conceptual / khái niệm</td><td>conceptual schema</td><td>Lưu cái gì, liên kết ra sao?</td><td>DBA</td><td>một</td></tr>
<tr><td>Internal / trong</td><td>internal schema</td><td>Lưu trên đĩa thế nào?</td><td>DBMS</td><td>một</td></tr></table>
<p class="pitfall">⚠️ The body text cites "(Figure 14.2)" while the caption under the picture says "Figure 11.2". Both refer to the same diagram — the deck renumbered Forouzan's Chapter 14 as Chapter 11 but did not update the in-text references. You will see the same mismatch on slides 14, 15, 16, 17 and 19. Never waste exam time hunting for a "Figure 14.2" that does not exist in this deck.</p>`,
        `<p class="y-chinh">🎯 Kiến trúc ba mức ANSI/SPARC, được gọi tên và vẽ ra: <strong>trong, khái niệm, ngoài</strong>. Hình 11.2 xếp chồng chúng — phần cứng (một hình trụ ổ đĩa) ở đáy, rồi khối đỏ <em>Internal level</em>, khối đen <em>Conceptual level</em>, khối xám <em>External level</em>, và ba ô <em>User view</em> riêng biệt trên cùng.</p>
<ul>
<li><strong>Mức trong</strong> — quyết định dữ liệu thật sự nằm ở đâu trên thiết bị lưu trữ; lo các phương pháp truy cập mức thấp và việc chuyển byte ra vào thiết bị. Đây chính là Chương 10 (cấu trúc tệp) đang núp dưới một cái tên mới.</li>
<li><strong>Mức khái niệm</strong> — định nghĩa góc nhìn logic của dữ liệu. Mô hình dữ liệu sống ở đây, và các chức năng chính của DBMS như truy vấn cũng ở đây. Mỗi CSDL có ĐÚNG MỘT lược đồ khái niệm, do DBA sở hữu.</li>
<li><strong>Mức ngoài</strong> — tiếp xúc trực tiếp với người dùng, người dùng cuối hoặc chương trình ứng dụng, và nhào nặn dữ liệu từ mức khái niệm sang định dạng quen thuộc với người đó. Mỗi CSDL có NHIỀU lược đồ ngoài — hình cố ý vẽ <em>ba</em> user view trên cùng một mức ngoài.</li>
<li><strong>Đọc SỐ LƯỢNG trong hình, đó chính là đáp án thi</strong> — một đĩa, một lược đồ trong, một lược đồ khái niệm, <em>nhiều</em> lược đồ ngoài. "Một CSDL có mấy lược đồ khái niệm?" → đúng một. "Mấy lược đồ ngoài?" → bao nhiêu nhóm người dùng thì bấy nhiêu.</li>
<li><strong>Ánh xạ vào CSDL thư viện</strong> — mức trong: chỉ mục cây B trên <code>MuonSach(isbn)</code> tạo ở slide 10. Mức khái niệm: ba câu <code>CREATE TABLE</code> và các khoá của chúng. Mức ngoài: khung nhìn <code>v_TheThuVien</code> ở slide 12, giấu email sinh viên khỏi quầy thủ thư.</li>
</ul>
<table><tr><th>Mức</th><th>Lược đồ</th><th>Trả lời câu hỏi</th><th>Ai sở hữu</th><th>Có mấy cái</th></tr>
<tr><td>External / ngoài</td><td>lược đồ ngoài, khung nhìn</td><td>Tôi được thấy gì?</td><td>người dùng cuối, chương trình ứng dụng</td><td>nhiều</td></tr>
<tr><td>Conceptual / khái niệm</td><td>lược đồ khái niệm</td><td>Lưu cái gì, liên kết ra sao?</td><td>DBA</td><td>một</td></tr>
<tr><td>Internal / trong</td><td>lược đồ trong</td><td>Lưu trên đĩa thế nào?</td><td>DBMS</td><td>một</td></tr></table>
<p class="pitfall">⚠️ Phần chữ dẫn "(Figure 14.2)" trong khi chú thích dưới hình ghi "Figure 11.2". Cả hai chỉ cùng một sơ đồ — deck đánh lại Chương 14 của Forouzan thành Chương 11 nhưng không sửa các dẫn chiếu trong thân bài. Bạn sẽ gặp đúng sự lệch ấy ở slide 14, 15, 16, 17 và 19. Đừng phí thời gian trong phòng thi đi tìm một "Figure 14.2" vốn không tồn tại trong deck này.</p>`],

      [10, '2. The internal level',
        `<p class="y-chinh">🎯 The bottom level and its <strong>internal schema</strong>: the complete description of physical storage and access paths — storage allocation for data <em>and indexes</em>, record description and placement, data compression, encryption.</p>
<ul>
<li><strong>What lives here, in one list from the slide</strong> — physical representation of the DB on the computer; how the data is stored; physical implementation chosen for run-time performance and space; space allocation for data and indexes; record description for storage; record placement; compression; encryption.</li>
<li><strong>Why indexes are the headline item</strong> — everything else on that list is about space. Indexes are about <em>time</em>, and they are the only reason a database with ten million rows answers in milliseconds. This is the real mechanism behind the word "Efficiency" that slide 6 mis-explained.</li>
<li><strong>The exam-critical property: physical data independence</strong> — you may add, drop or rebuild an index at any time, and <em>no application query needs to change</em>. The query text stays identical; only the plan the optimiser chooses changes. Measured below.</li>
<li><strong>SCAN versus SEARCH, read them literally</strong> — <code>SCAN</code> means the engine walks every row of the table (cost grows with table size, O(n)). <code>SEARCH … USING INDEX</code> means it descends a B-tree (cost grows with the logarithm of table size). On four rows the wall-clock difference is nothing; on four million it is the difference between a page that loads and a page that times out.</li>
<li><strong>The price you pay</strong> — an index is extra data on disk, and every <code>INSERT</code>, <code>UPDATE</code> and <code>DELETE</code> must update it too. Indexing every column is a classic beginner mistake: reads get faster, writes get slower, and the database doubles in size.</li>
</ul>
<p class="nhan">Đã chạy thật — cùng một câu truy vấn, trước và sau khi tạo chỉ mục:</p>
<pre>EXPLAIN QUERY PLAN SELECT * FROM MuonSach WHERE isbn='978-0132145374';
--&gt; QUERY PLAN
--&gt; \`--SCAN MuonSach

CREATE INDEX idx_muon_isbn ON MuonSach(isbn);

EXPLAIN QUERY PLAN SELECT * FROM MuonSach WHERE isbn='978-0132145374';
--&gt; QUERY PLAN
--&gt; \`--SEARCH MuonSach USING INDEX idx_muon_isbn (isbn=?)</pre>
<p class="nhan">And the answer the user sees, before and after, is byte-for-byte the same:</p>
<table><tr><th>mssv</th><th>isbn</th><th>ngay_muon</th><th>ngay_tra</th></tr>
<tr><td>HE180001</td><td>978-0132145374</td><td>2026-09-01</td><td>2026-09-10</td></tr>
<tr><td>HE180002</td><td>978-0132145374</td><td>2026-09-03</td><td>(NULL)</td></tr></table>
<p class="dap-an">✅ Đáp án — that is <strong>physical data independence</strong> demonstrated, not asserted: the internal level changed (a new B-tree now exists on disk), the query text did not change, the result did not change, and no application code was touched. A primary key gets its index for free — <code>EXPLAIN QUERY PLAN SELECT * FROM SinhVien WHERE mssv='HE180003'</code> reported <code>SEARCH SinhVien USING INDEX sqlite_autoindex_SinhVien_1 (mssv=?)</code>, while searching by <code>ho_ten</code> (no index) reported <code>SCAN SinhVien</code>.</p>
<p class="meo">💡 The link back to Chapter 10 is exact: the "access paths" of the internal schema are the sequential, indexed and hashed file structures you already studied. A database did not invent new storage — it took the file structures of Chapter 10 and put a schema manager on top of them.</p>`,
        `<p class="y-chinh">🎯 Mức đáy và <strong>lược đồ trong</strong> của nó: bản mô tả đầy đủ về lưu trữ vật lý và đường truy cập — cấp phát không gian cho dữ liệu <em>và cho chỉ mục</em>, mô tả bản ghi, sắp đặt bản ghi, nén dữ liệu, mã hoá.</p>
<ul>
<li><strong>Ở đây có gì, theo đúng danh sách của slide</strong> — biểu diễn vật lý của CSDL trên máy; dữ liệu được lưu ra sao; cách hiện thực vật lý được chọn để tối ưu thời gian chạy và không gian; cấp phát chỗ cho dữ liệu và chỉ mục; mô tả bản ghi để lưu; sắp đặt bản ghi; nén; mã hoá.</li>
<li><strong>Vì sao chỉ mục là mục quan trọng nhất</strong> — mọi thứ còn lại trong danh sách ấy nói về KHÔNG GIAN. Chỉ mục nói về THỜI GIAN, và nó là lý do duy nhất khiến một CSDL mười triệu dòng trả lời trong vài mili giây. Đây mới là cơ chế thật đứng sau chữ "Efficiency" mà slide 6 giải thích sai.</li>
<li><strong>Tính chất then chốt cho bài thi: độc lập dữ liệu vật lý</strong> — bạn có thể thêm, xoá hay dựng lại chỉ mục bất cứ lúc nào, và <em>không câu truy vấn ứng dụng nào phải sửa</em>. Chữ của câu truy vấn y nguyên; chỉ có kế hoạch mà bộ tối ưu chọn là đổi. Đo ở dưới.</li>
<li><strong>SCAN và SEARCH, đọc theo đúng nghĩa đen</strong> — <code>SCAN</code> nghĩa là máy đi qua MỌI dòng của bảng (chi phí tăng theo cỡ bảng, O(n)). <code>SEARCH … USING INDEX</code> nghĩa là nó đi xuống một cây B (chi phí tăng theo logarit cỡ bảng). Với bốn dòng thì chênh lệch đồng hồ bằng không; với bốn triệu dòng thì đó là khác biệt giữa một trang tải được và một trang hết giờ.</li>
<li><strong>Cái giá phải trả</strong> — chỉ mục là dữ liệu thêm trên đĩa, và mọi lệnh <code>INSERT</code>, <code>UPDATE</code>, <code>DELETE</code> đều phải cập nhật nó nữa. Đánh chỉ mục cho mọi cột là sai lầm kinh điển của người mới: đọc nhanh lên, ghi chậm đi, và CSDL phình gấp đôi.</li>
</ul>
<p class="nhan">Đã chạy thật — cùng một câu truy vấn, trước và sau khi tạo chỉ mục:</p>
<pre>EXPLAIN QUERY PLAN SELECT * FROM MuonSach WHERE isbn='978-0132145374';
--&gt; QUERY PLAN
--&gt; \`--SCAN MuonSach

CREATE INDEX idx_muon_isbn ON MuonSach(isbn);

EXPLAIN QUERY PLAN SELECT * FROM MuonSach WHERE isbn='978-0132145374';
--&gt; QUERY PLAN
--&gt; \`--SEARCH MuonSach USING INDEX idx_muon_isbn (isbn=?)</pre>
<p class="nhan">Còn câu trả lời mà người dùng nhận, trước và sau, giống nhau từng byte:</p>
<table><tr><th>mssv</th><th>isbn</th><th>ngay_muon</th><th>ngay_tra</th></tr>
<tr><td>HE180001</td><td>978-0132145374</td><td>2026-09-01</td><td>2026-09-10</td></tr>
<tr><td>HE180002</td><td>978-0132145374</td><td>2026-09-03</td><td>(NULL)</td></tr></table>
<p class="dap-an">✅ Đáp án — đó là <strong>độc lập dữ liệu vật lý</strong> được CHỨNG MINH chứ không phải được tuyên bố: mức trong đã đổi (một cây B mới nằm trên đĩa), chữ của câu truy vấn không đổi, kết quả không đổi, và không một dòng mã ứng dụng nào bị đụng tới. Khoá chính được tặng kèm chỉ mục — <code>EXPLAIN QUERY PLAN SELECT * FROM SinhVien WHERE mssv='HE180003'</code> báo <code>SEARCH SinhVien USING INDEX sqlite_autoindex_SinhVien_1 (mssv=?)</code>, còn tìm theo <code>ho_ten</code> (không có chỉ mục) thì báo <code>SCAN SinhVien</code>.</p>
<p class="meo">💡 Mối nối ngược về Chương 10 là chính xác: "đường truy cập" của lược đồ trong chính là các cấu trúc tệp tuần tự, tệp chỉ mục và tệp băm bạn đã học. Cơ sở dữ liệu không phát minh ra cách lưu trữ mới — nó lấy đúng các cấu trúc tệp của Chương 10 rồi đặt một bộ quản lý lược đồ lên trên.</p>`],

      [11, '3. The conceptual level',
        `<p class="y-chinh">🎯 The middle level and its <strong>conceptual schema</strong>: the structure of the <em>whole</em> database for a community of users — entities, data types, relationships, user operations and constraints — with every detail of physical storage deliberately hidden.</p>
<ul>
<li><strong>The slide's own list of what it represents</strong> — entities, attributes, relations, constraints on data, semantic information on data, and security/integrity information. Notice that <em>constraints</em> are listed as part of the schema: a rule like "a borrowing must point at a real student" is part of the description of the data, not part of some program.</li>
<li><strong>"As seen by the DBA"</strong> — this is the level the database administrator owns and the only level where the word "complete" applies. The external level sees fragments; the internal level sees bytes; only the conceptual level sees the whole meaning.</li>
<li><strong>"Independent of any storage consideration"</strong> — this phrase from the slide is the definition of the boundary with slide 10. Whether <code>SinhVien</code> is stored as a B-tree, a heap or a compressed column store is not a conceptual question.</li>
<li><strong>Where you actually write it</strong> — in SQL, the conceptual schema is your <code>CREATE TABLE</code> statements plus their keys and constraints. The library database's conceptual schema for students is exactly this, and it was really executed:</li>
</ul>
<pre>CREATE TABLE SinhVien (
  mssv     TEXT    PRIMARY KEY,
  ho_ten   TEXT    NOT NULL,
  lop      TEXT    NOT NULL,
  nam_sinh INTEGER,
  email    TEXT    UNIQUE
);</pre>
<p class="nhan">Every clause on those six lines is conceptual, not physical: <code>PRIMARY KEY</code> states identity, <code>NOT NULL</code> states a business rule, <code>UNIQUE</code> states a candidate key, <code>TEXT</code>/<code>INTEGER</code> state domains. Nothing there says where a single byte lives.</p>
<p class="dap-an">✅ Đáp án — a constraint really is enforced at this level, not by the application. Running <code>INSERT INTO SinhVien (mssv,ho_ten,lop) VALUES ('HE180005', NULL, 'SE1803');</code> returned <code>Error: NOT NULL constraint failed: SinhVien.ho_ten (19)</code>, and inserting a second student with an existing email returned <code>Error: UNIQUE constraint failed: SinhVien.email (19)</code>. No application code was involved in either refusal — which is the whole point of putting rules in the schema.</p>
<p class="pitfall">⚠️ Logical data independence is the <em>weaker</em> of the two. Adding a column to <code>SinhVien</code> leaves every existing view working — but splitting <code>SinhVien</code> into two tables will break a view unless the DBA redefines it as a join. That is why exam answers should say physical data independence is "easier to achieve" than logical data independence; saying both are equally easy is a classic wrong option.</p>`,
        `<p class="y-chinh">🎯 Mức giữa và <strong>lược đồ khái niệm</strong> của nó: cấu trúc của <em>toàn bộ</em> CSDL cho một cộng đồng người dùng — thực thể, kiểu dữ liệu, liên kết, các thao tác của người dùng và các ràng buộc — với mọi chi tiết lưu trữ vật lý bị giấu đi một cách CÓ CHỦ Ý.</p>
<ul>
<li><strong>Danh sách của chính slide về những gì nó biểu diễn</strong> — thực thể, thuộc tính, quan hệ, ràng buộc trên dữ liệu, thông tin ngữ nghĩa của dữ liệu, và thông tin an toàn/toàn vẹn. Để ý <em>ràng buộc</em> được liệt kê như một phần của lược đồ: một luật kiểu "một lượt mượn phải trỏ vào một sinh viên có thật" là một phần của bản mô tả dữ liệu, chứ không phải một phần của chương trình nào cả.</li>
<li><strong>"Theo cách DBA nhìn thấy"</strong> — đây là mức mà quản trị viên CSDL sở hữu, và là mức duy nhất mà chữ "đầy đủ" có nghĩa. Mức ngoài chỉ thấy mảnh; mức trong chỉ thấy byte; chỉ mức khái niệm thấy toàn bộ ý nghĩa.</li>
<li><strong>"Độc lập với mọi cân nhắc về lưu trữ"</strong> — cụm này trên slide chính là định nghĩa ranh giới với slide 10. Chuyện <code>SinhVien</code> được lưu dạng cây B, dạng đống hay dạng cột nén, không phải câu hỏi của mức khái niệm.</li>
<li><strong>Bạn thật sự viết nó ở đâu</strong> — trong SQL, lược đồ khái niệm chính là các câu <code>CREATE TABLE</code> cộng với khoá và ràng buộc của chúng. Lược đồ khái niệm phần sinh viên của CSDL thư viện đúng là thế này, và nó đã được chạy thật:</li>
</ul>
<pre>CREATE TABLE SinhVien (
  mssv     TEXT    PRIMARY KEY,
  ho_ten   TEXT    NOT NULL,
  lop      TEXT    NOT NULL,
  nam_sinh INTEGER,
  email    TEXT    UNIQUE
);</pre>
<p class="nhan">Mọi mệnh đề trong sáu dòng ấy đều thuộc mức khái niệm, không mức vật lý: <code>PRIMARY KEY</code> khai định danh, <code>NOT NULL</code> khai một luật nghiệp vụ, <code>UNIQUE</code> khai một khoá dự tuyển, <code>TEXT</code>/<code>INTEGER</code> khai miền giá trị. Không dòng nào nói một byte nằm ở đâu.</p>
<p class="dap-an">✅ Đáp án — ràng buộc thật sự được thi hành tại mức này, không phải bởi ứng dụng. Chạy <code>INSERT INTO SinhVien (mssv,ho_ten,lop) VALUES ('HE180005', NULL, 'SE1803');</code> trả về <code>Error: NOT NULL constraint failed: SinhVien.ho_ten (19)</code>, và chèn một sinh viên thứ hai với email đã tồn tại trả về <code>Error: UNIQUE constraint failed: SinhVien.email (19)</code>. Không một dòng mã ứng dụng nào tham gia vào hai lần từ chối ấy — và đó chính là toàn bộ lý do người ta đặt luật vào lược đồ.</p>
<p class="pitfall">⚠️ Độc lập dữ liệu logic là loại YẾU hơn trong hai loại. Thêm một cột vào <code>SinhVien</code> thì mọi khung nhìn đang có vẫn chạy — nhưng TÁCH <code>SinhVien</code> thành hai bảng sẽ làm vỡ khung nhìn, trừ khi DBA định nghĩa lại nó thành một phép kết nối. Vì thế bài thi nên trả lời rằng độc lập vật lý "dễ đạt được hơn" độc lập logic; nói hai cái dễ như nhau là một phương án sai kinh điển.</p>`],

      [12, '4. The external or view level',
        `<p class="y-chinh">🎯 The top level: a number of <strong>external schemas or user views</strong>, each describing the part of the database one user group cares about and <em>hiding the rest from them</em>. The slide's own example is dates — one user views them as (day, month, year), another as (year, month, day).</p>
<ul>
<li><strong>Two jobs in one mechanism</strong> — the slide lists them separately but they come from the same construct. (1) <em>Convenience</em>: each group sees data shaped the way it thinks. (2) <em>Security</em>: "a powerful and flexible security mechanism by hiding parts of the DB from certain users. The user is not aware of the existence of any attributes that are missing from the view."</li>
<li><strong>That last sentence is the strong claim</strong> — not merely "forbidden to read", but <em>not aware it exists</em>. A front-desk clerk querying a view that lacks the email column cannot even discover that emails are stored. That is stronger than an access-denied error, which leaks the fact that the column exists.</li>
<li><strong>"The same data can be seen by different users in different ways, at the same time"</strong> — simultaneity matters. Both views read the one conceptual schema live, so neither can drift out of date the way two copies of a flat file would.</li>
<li><strong>Back to the flat-file university of slide 5</strong> — the financial aid office and the payroll department stop keeping their own files; each gets a view over the single student and staff tables. Same convenience as before, none of the inconsistency of slide 6.</li>
<li><strong>How it is written in SQL</strong> — <code>CREATE VIEW</code>. Both of the slide's motivations were implemented and really run below.</li>
</ul>
<p class="nhan">Đã chạy thật — khung nhìn cho quầy thủ thư, KHÔNG có email, KHÔNG có năm sinh:</p>
<pre>CREATE VIEW v_TheThuVien AS SELECT mssv, ho_ten, lop FROM SinhVien;
SELECT * FROM v_TheThuVien;</pre>
<table><tr><th>mssv</th><th>ho_ten</th><th>lop</th></tr>
<tr><td>HE180001</td><td>Nguyen Van An</td><td>SE1801</td></tr>
<tr><td>HE180002</td><td>Tran Thi Binh</td><td>SE1801</td></tr>
<tr><td>HE180003</td><td>Le Van Cuong</td><td>SE1802</td></tr>
<tr><td>HE180004</td><td>Pham Thi Dung</td><td>SE1802</td></tr></table>
<p class="nhan">Và đúng ví dụ ĐỊNH DẠNG NGÀY của slide, cho nhóm người dùng quen dd/mm/yyyy:</p>
<pre>CREATE VIEW v_MuonVN AS
  SELECT mssv, isbn, strftime('%d/%m/%Y', ngay_muon) AS ngay_muon_vn
  FROM MuonSach;</pre>
<table><tr><th>mssv</th><th>isbn</th><th>ngay_muon_vn</th></tr>
<tr><td>HE180001</td><td>978-0132145374</td><td>01/09/2026</td></tr>
<tr><td>HE180001</td><td>978-0262033848</td><td>05/09/2026</td></tr>
<tr><td>HE180002</td><td>978-0132145374</td><td>03/09/2026</td></tr></table>
<p class="dap-an">✅ Đáp án — the stored data never changed: the conceptual schema still holds <code>ngay_muon</code> as <code>2026-09-01</code>, and a second user group reading the base table still sees ISO dates. One conceptual level, two external levels, at the same time — exactly the slide's claim, now measured. The view also survived the slide-10 index change untouched: <code>SELECT * FROM v_TheThuVien WHERE lop='SE1801'</code> returned the same two rows before and after <code>CREATE INDEX</code>.</p>
<p class="pitfall">⚠️ A view is <strong>not a copy</strong>. It stores no rows — it is a stored query that runs against the base tables every time you read it. That is why it can never be stale, and also why a view over a huge join can be slow. (A <em>materialised</em> view, which does store rows, is a different object and a DBI202 topic.)</p>`,
        `<p class="y-chinh">🎯 Mức trên cùng: một số <strong>lược đồ ngoài hay khung nhìn người dùng</strong>, mỗi cái mô tả đúng phần CSDL mà một nhóm người dùng quan tâm và <em>giấu phần còn lại khỏi họ</em>. Ví dụ của chính slide là ngày tháng — người này nhìn theo (ngày, tháng, năm), người kia nhìn theo (năm, tháng, ngày).</p>
<ul>
<li><strong>Một cơ chế, hai nhiệm vụ</strong> — slide liệt kê rời nhau nhưng chúng đến từ cùng một kiến trúc. (1) <em>Tiện lợi</em>: mỗi nhóm thấy dữ liệu theo đúng cách họ nghĩ. (2) <em>An toàn</em>: "một cơ chế bảo mật mạnh và linh hoạt nhờ giấu bớt phần CSDL khỏi một số người dùng. Người dùng KHÔNG hề biết có tồn tại những thuộc tính vắng mặt trong khung nhìn."</li>
<li><strong>Câu cuối ấy mới là tuyên bố mạnh</strong> — không chỉ là "bị cấm đọc", mà là <em>không biết nó tồn tại</em>. Một nhân viên quầy truy vấn khung nhìn thiếu cột email thậm chí không phát hiện được là email có được lưu. Điều đó mạnh hơn một lỗi "từ chối truy cập", vì lỗi ấy đã tiết lộ rằng cột đó có thật.</li>
<li><strong>"Cùng một dữ liệu được nhiều người dùng nhìn theo nhiều cách, CÙNG LÚC"</strong> — chữ cùng lúc rất quan trọng. Cả hai khung nhìn đều đọc trực tiếp một lược đồ khái niệm, nên không cái nào có thể lạc hậu như hai bản sao của một tệp phẳng.</li>
<li><strong>Quay lại trường đại học tệp phẳng ở slide 5</strong> — phòng học bổng và phòng lương thôi giữ tệp riêng; mỗi phòng nhận một khung nhìn trên đúng một bảng sinh viên và một bảng nhân sự. Tiện lợi vẫn như cũ, mà không còn mâu thuẫn của slide 6.</li>
<li><strong>Viết bằng SQL thế nào</strong> — <code>CREATE VIEW</code>. Cả hai động cơ mà slide nêu đều đã được hiện thực và chạy thật ở dưới.</li>
</ul>
<p class="nhan">Đã chạy thật — khung nhìn cho quầy thủ thư, KHÔNG có email, KHÔNG có năm sinh:</p>
<pre>CREATE VIEW v_TheThuVien AS SELECT mssv, ho_ten, lop FROM SinhVien;
SELECT * FROM v_TheThuVien;</pre>
<table><tr><th>mssv</th><th>ho_ten</th><th>lop</th></tr>
<tr><td>HE180001</td><td>Nguyen Van An</td><td>SE1801</td></tr>
<tr><td>HE180002</td><td>Tran Thi Binh</td><td>SE1801</td></tr>
<tr><td>HE180003</td><td>Le Van Cuong</td><td>SE1802</td></tr>
<tr><td>HE180004</td><td>Pham Thi Dung</td><td>SE1802</td></tr></table>
<p class="nhan">Và đúng ví dụ ĐỊNH DẠNG NGÀY của slide, cho nhóm người dùng quen dd/mm/yyyy:</p>
<pre>CREATE VIEW v_MuonVN AS
  SELECT mssv, isbn, strftime('%d/%m/%Y', ngay_muon) AS ngay_muon_vn
  FROM MuonSach;</pre>
<table><tr><th>mssv</th><th>isbn</th><th>ngay_muon_vn</th></tr>
<tr><td>HE180001</td><td>978-0132145374</td><td>01/09/2026</td></tr>
<tr><td>HE180001</td><td>978-0262033848</td><td>05/09/2026</td></tr>
<tr><td>HE180002</td><td>978-0132145374</td><td>03/09/2026</td></tr></table>
<p class="dap-an">✅ Đáp án — dữ liệu lưu trữ KHÔNG hề đổi: lược đồ khái niệm vẫn giữ <code>ngay_muon</code> là <code>2026-09-01</code>, và một nhóm người dùng khác đọc thẳng bảng gốc vẫn thấy ngày dạng ISO. Một mức khái niệm, hai mức ngoài, cùng một lúc — đúng tuyên bố của slide, nay đã đo được. Khung nhìn cũng sống nguyên vẹn qua thay đổi chỉ mục ở slide 10: <code>SELECT * FROM v_TheThuVien WHERE lop='SE1801'</code> trả về đúng hai dòng ấy cả trước lẫn sau <code>CREATE INDEX</code>.</p>
<p class="pitfall">⚠️ Khung nhìn <strong>KHÔNG phải một bản sao</strong>. Nó không lưu dòng nào — nó là một câu truy vấn được cất sẵn, cứ mỗi lần bạn đọc là nó chạy lại trên các bảng gốc. Vì thế nó không bao giờ lạc hậu được, và cũng vì thế một khung nhìn trên phép kết nối khổng lồ có thể rất chậm. (Khung nhìn <em>vật chất hoá</em>, loại CÓ lưu dòng, là một đối tượng khác và là chủ đề của DBI202.)</p>`],

      [13, '3 - DATABASE MODELS',
        `<p class="y-chinh">🎯 Section divider for 11.3. The question changes again: having agreed <em>where</em> the logical description lives (the conceptual level), we now ask <strong>what shape</strong> that description takes.</p>
<ul>
<li><strong>Definition to carry in</strong> — a database model defines the <em>logical design</em> of the data and describes the relationships between different parts of the data. It is the answer to "what is the conceptual schema allowed to look like?"</li>
<li><strong>The three models ahead</strong> — hierarchical (slide 15), network (slide 16), relational (slide 17). They are introduced in historical order, which is also the order of increasing flexibility.</li>
<li><strong>Two of the three are declared obsolete by the slides themselves</strong> — a strong hint about exam weight. You must be able to define hierarchical and network in one sentence each and recognise their diagrams; you must be able to <em>work</em> with the relational model.</li>
<li><strong>Why the dead models are still taught</strong> — because the shapes came back. A file system is a hierarchy; XML and JSON documents are hierarchies; MongoDB stores documents that are trees. A social graph or a road map is a network, and graph databases like Neo4j sell exactly that. The <em>products</em> died; the <em>shapes</em> are permanent.</li>
<li><strong>Keep the three levels in view</strong> — a model is a choice made at the conceptual level (slide 11). The same data could in principle be modelled all three ways; what changes is which questions are cheap to ask.</li>
</ul>
<p class="meo">💡 One sentence each, and that is genuinely enough for the exam: <strong>hierarchy = inverted tree, one parent per entity · network = graph, several access paths · relational = two-dimensional tables linked by common values.</strong></p>`,
        `<p class="y-chinh">🎯 Slide phân mục cho 11.3. Câu hỏi lại đổi: đã thống nhất bản mô tả logic <em>nằm ở đâu</em> (mức khái niệm), giờ ta hỏi bản mô tả ấy <strong>mang HÌNH DẠNG gì</strong>.</p>
<ul>
<li><strong>Định nghĩa mang theo</strong> — mô hình CSDL định nghĩa <em>thiết kế logic</em> của dữ liệu và mô tả các mối liên kết giữa các phần dữ liệu. Nó là câu trả lời cho "lược đồ khái niệm được phép trông như thế nào?"</li>
<li><strong>Ba mô hình sắp tới</strong> — phân cấp (slide 15), mạng (slide 16), quan hệ (slide 17). Chúng được giới thiệu theo thứ tự lịch sử, cũng là thứ tự tăng dần độ linh hoạt.</li>
<li><strong>Hai trong ba mô hình bị chính slide tuyên bố là lỗi thời</strong> — một gợi ý mạnh về trọng số thi. Bạn phải định nghĩa được phân cấp và mạng mỗi cái một câu và nhận ra sơ đồ của chúng; còn mô hình quan hệ thì bạn phải <em>làm việc</em> được với nó.</li>
<li><strong>Vì sao mô hình đã chết vẫn được dạy</strong> — vì HÌNH DẠNG của chúng quay lại. Hệ thống tệp là một cây phân cấp; tài liệu XML và JSON là cây phân cấp; MongoDB lưu tài liệu vốn là cây. Một mạng xã hội hay một bản đồ đường sá là đồ thị, và các CSDL đồ thị như Neo4j bán đúng thứ đó. <em>Sản phẩm</em> chết; <em>hình dạng</em> thì vĩnh viễn.</li>
<li><strong>Giữ ba mức trong tầm mắt</strong> — mô hình là một lựa chọn đưa ra tại mức khái niệm (slide 11). Về nguyên tắc cùng một dữ liệu có thể mô hình hoá theo cả ba cách; cái đổi là những câu hỏi nào trở nên rẻ để hỏi.</li>
</ul>
<p class="meo">💡 Mỗi mô hình một câu, và với bài thi thì thật sự là đủ: <strong>phân cấp = cây lộn ngược, mỗi thực thể một cha · mạng = đồ thị, nhiều đường truy cập · quan hệ = các bảng hai chiều nối nhau bằng giá trị chung.</strong></p>`],

      [14, '1. Introduction (database models)',
        `<p class="y-chinh">🎯 The definition plus the list of three: a <strong>database model defines the logical design of data and describes the relationships between different parts of the data</strong>; historically three have been in use — hierarchical, network, relational.</p>
<ul>
<li><strong>Read the two halves of the definition separately</strong> — "logical design of data" is about <em>structure</em> (what a record may contain); "relationships between different parts" is about <em>links</em> (how records find each other). A model must answer both, and the three models differ mainly in the second half.</li>
<li><strong>Dates worth attaching to the three names</strong> — hierarchical: IBM IMS, 1966, built for the Apollo programme's bill of materials. Network: the CODASYL DBTG specification, 1969/1971. Relational: E. F. Codd's paper <em>"A Relational Model of Data for Large Shared Data Banks"</em>, June 1970, with the first commercial products (Oracle, IBM SQL/DS) arriving around 1979–1981.</li>
<li><strong>What the picture adds</strong> — Figure 11.3 splits the three into two branches: <em>Relational</em> on the left (drawn as grids of coloured cells with arrows between them) and <em>Non-relational</em> on the right, which then forks into <em>Network</em> (a graph of blobs) and <em>Hierarchical</em> (a tree).</li>
<li><strong>Why that grouping is worth a second look</strong> — see the correction below. The picture's taxonomy is not the textbook's.</li>
<li><strong>The honest summary of the history</strong> — the first two models made the <em>access paths</em> part of the data design, so a program had to know how to navigate. Codd's move was to throw navigation away entirely and connect records by <em>matching values</em> instead of by stored pointers. That is why the relational model won.</li>
</ul>
<table><tr><th>Mô hình</th><th>Hình dạng</th><th>Liên kết bằng</th><th>Truy cập</th><th>Tình trạng</th></tr>
<tr><td>Hierarchical</td><td>cây lộn ngược</td><td>con trỏ cha–con</td><td>một đường duy nhất từ gốc</td><td>slide ghi: obsolete</td></tr>
<tr><td>Network</td><td>đồ thị</td><td>con trỏ nhiều chiều</td><td>nhiều đường</td><td>slide ghi: obsolete</td></tr>
<tr><td>Relational</td><td>bảng hai chiều</td><td>GIÁ TRỊ trùng nhau (khoá)</td><td>bất kỳ, do bộ tối ưu chọn</td><td>đang thống trị</td></tr></table>
<p class="dap-an">✅ Answer / correction: the figure labels Network and Hierarchical as <strong>"Non-relational"</strong>, which clashes with two things. First, with the slide's own text, which calls all three simply "models that have been in use". Second, with today's meaning of "non-relational / NoSQL", which denotes <em>document, key-value, column-family and graph</em> stores — a family born after 2007, not the 1960s navigational systems. Both hierarchical and network databases are pre-relational, not NoSQL. In an exam, answer with the textbook's three-model list and do not repeat the picture's two-branch split unless the question shows that picture.</p>
<p class="pitfall">⚠️ The in-text reference is to "Figure 14.3" while the caption reads "Figure 11.3" — the same renumbering mismatch as slide 9. Also note that the last objective on slide 3 asks you to "list database types other than the relational model": the expected answer there is <em>distributed, object-oriented, and NoSQL</em> databases, not hierarchical and network, which are covered by a different objective.</p>`,
        `<p class="y-chinh">🎯 Định nghĩa cộng danh sách ba: <strong>mô hình CSDL định nghĩa thiết kế logic của dữ liệu và mô tả liên kết giữa các phần dữ liệu</strong>; trong lịch sử có ba mô hình đã được dùng — phân cấp, mạng, quan hệ.</p>
<ul>
<li><strong>Đọc tách riêng hai nửa của định nghĩa</strong> — "thiết kế logic của dữ liệu" nói về <em>cấu trúc</em> (một bản ghi được chứa gì); "liên kết giữa các phần" nói về <em>mối nối</em> (các bản ghi tìm thấy nhau ra sao). Mô hình phải trả lời cả hai, và ba mô hình khác nhau chủ yếu ở nửa thứ hai.</li>
<li><strong>Mốc thời gian đáng gắn vào ba cái tên</strong> — phân cấp: IBM IMS, 1966, dựng cho bảng vật tư của chương trình Apollo. Mạng: đặc tả CODASYL DBTG, 1969/1971. Quan hệ: bài báo của E. F. Codd <em>"A Relational Model of Data for Large Shared Data Banks"</em>, tháng 6/1970, còn các sản phẩm thương mại đầu tiên (Oracle, IBM SQL/DS) ra khoảng 1979–1981.</li>
<li><strong>Bức hình thêm được gì</strong> — Hình 11.3 chia ba mô hình thành hai nhánh: <em>Relational</em> bên trái (vẽ thành các lưới ô màu có mũi tên nối nhau) và <em>Non-relational</em> bên phải, nhánh này lại rẽ thành <em>Network</em> (đồ thị các đốm) và <em>Hierarchical</em> (một cây).</li>
<li><strong>Vì sao cách gom nhóm ấy đáng nhìn lại lần hai</strong> — xem phần đính chính bên dưới. Cách phân loại của bức hình KHÔNG phải cách của giáo trình.</li>
<li><strong>Tóm tắt trung thực về lịch sử</strong> — hai mô hình đầu đưa <em>đường truy cập</em> vào làm một phần của thiết kế dữ liệu, nên chương trình buộc phải biết cách đi đường. Nước cờ của Codd là vứt hẳn chuyện đi đường, và nối các bản ghi bằng <em>giá trị trùng khớp</em> thay vì bằng con trỏ được lưu sẵn. Đó là lý do mô hình quan hệ thắng.</li>
</ul>
<table><tr><th>Mô hình</th><th>Hình dạng</th><th>Liên kết bằng</th><th>Truy cập</th><th>Tình trạng</th></tr>
<tr><td>Phân cấp</td><td>cây lộn ngược</td><td>con trỏ cha–con</td><td>một đường duy nhất từ gốc</td><td>slide ghi: lỗi thời</td></tr>
<tr><td>Mạng</td><td>đồ thị</td><td>con trỏ nhiều chiều</td><td>nhiều đường</td><td>slide ghi: lỗi thời</td></tr>
<tr><td>Quan hệ</td><td>bảng hai chiều</td><td>GIÁ TRỊ trùng nhau (khoá)</td><td>bất kỳ, do bộ tối ưu chọn</td><td>đang thống trị</td></tr></table>
<p class="dap-an">✅ Đáp án / đính chính: bức hình dán nhãn Network và Hierarchical là <strong>"Non-relational"</strong>, và nhãn ấy đụng hai thứ. Thứ nhất, đụng chính chữ trên slide, vốn chỉ gọi cả ba là "những mô hình đã được dùng". Thứ hai, đụng nghĩa hiện nay của "phi quan hệ / NoSQL", vốn chỉ các kho <em>tài liệu, khoá–giá trị, họ cột và đồ thị</em> — một họ sinh ra sau 2007, chứ không phải các hệ điều hướng của thập niên 1960. CSDL phân cấp và CSDL mạng là TIỀN-quan hệ, không phải NoSQL. Trong bài thi, hãy trả lời theo danh sách ba mô hình của giáo trình và đừng nhắc lại cách chia hai nhánh của bức hình, trừ khi đề chiếu đúng bức hình ấy.</p>
<p class="pitfall">⚠️ Dẫn chiếu trong thân slide ghi "Figure 14.3" còn chú thích ghi "Figure 11.3" — đúng kiểu lệch số như slide 9. Cũng để ý mục tiêu cuối ở slide 3 yêu cầu "liệt kê các loại CSDL khác ngoài mô hình quan hệ": đáp án mong đợi ở đó là CSDL <em>phân tán, hướng đối tượng và NoSQL</em>, chứ không phải phân cấp và mạng, vì hai cái ấy đã thuộc một mục tiêu khác.</p>`],

      [15, '2. The hierarchical model',
        `<p class="y-chinh">🎯 <strong>Data organised as an inverted tree. Each entity has only one parent but can have several children; at the top there is one entity called the root.</strong> And the slide's own verdict: the model is obsolete, so no further discussion is necessary.</p>
<ul>
<li><strong>Read Figure 11.4 exactly</strong> — the root is <strong>DEPARTMENT</strong> with fields <code>No</code> and <code>Name</code>. Two arrows leave it: one to <strong>COURSES</strong> (<code>No</code>, <code>Name</code>, <code>Unit</code>) and one to <strong>STUDENTS</strong> (<code>ID</code>, <code>Name</code>, <code>Courses</code>). From COURSES a third arrow goes down to <strong>PROFESSORS</strong> (<code>ID</code>, <code>Name</code>).</li>
<li><strong>"Only one parent" is the whole limitation</strong> — in that tree, a professor is reachable only <em>through</em> a course, which is reachable only through a department. There is exactly one path to any record, and it always starts at the root.</li>
<li><strong>What that costs, concretely</strong> — a professor who teaches two courses must be <em>stored twice</em>, once under each course. That is the redundancy of slide 6, now baked into the model itself rather than into careless file design. And a professor who teaches no course cannot be stored at all.</li>
<li><strong>The question the shape makes expensive</strong> — "which professors teach in more than one department?" requires walking the whole tree from the root, because there is no link from a professor back sideways.</li>
<li><strong>Where the shape survives</strong> — the model died, the shape did not: directory trees, XML and JSON documents, the HTML DOM, LDAP directories, and MongoDB documents are all single-parent trees. IBM IMS, the flagship hierarchical DBMS from 1966, is in fact still running in banks and insurers today, which is a useful nuance if an exam essay asks whether "obsolete" means "gone".</li>
</ul>
<p class="meo">💡 Two words to remember the model by: <strong>one parent</strong>. If an exam option says "in the hierarchical model an entity may have several parents", it is describing the network model and is wrong.</p>
<p class="pitfall">⚠️ Notice that the STUDENTS box carries a field named <code>Courses</code> — a <em>single</em> field meant to hold the <em>several</em> courses a student takes. That is a multi-valued attribute, and the deck itself admits later (slide 33) that such a relation is not in first normal form. Do not copy that design into any answer about the relational model.</p>`,
        `<p class="y-chinh">🎯 <strong>Dữ liệu tổ chức thành cây lộn ngược. Mỗi thực thể chỉ có MỘT cha nhưng có thể có nhiều con; trên đỉnh là một thực thể duy nhất gọi là gốc.</strong> Và phán quyết của chính slide: mô hình này đã lỗi thời, không cần bàn thêm.</p>
<ul>
<li><strong>Đọc Hình 11.4 cho chính xác</strong> — gốc là <strong>DEPARTMENT</strong> với hai trường <code>No</code> và <code>Name</code>. Hai mũi tên rời khỏi nó: một tới <strong>COURSES</strong> (<code>No</code>, <code>Name</code>, <code>Unit</code>) và một tới <strong>STUDENTS</strong> (<code>ID</code>, <code>Name</code>, <code>Courses</code>). Từ COURSES có mũi tên thứ ba đi xuống <strong>PROFESSORS</strong> (<code>ID</code>, <code>Name</code>).</li>
<li><strong>"Chỉ một cha" chính là toàn bộ giới hạn</strong> — trong cái cây ấy, một giảng viên chỉ tới được <em>thông qua</em> một môn học, mà môn học lại chỉ tới được thông qua một khoa. Tới bất kỳ bản ghi nào cũng chỉ có đúng một con đường, và đường ấy luôn bắt đầu từ gốc.</li>
<li><strong>Cái giá, nói cho cụ thể</strong> — một giảng viên dạy hai môn thì phải <em>lưu hai lần</em>, mỗi lần dưới một môn. Đó chính là sự dư thừa ở slide 6, nay nướng thẳng vào mô hình chứ không còn do thiết kế tệp cẩu thả. Và một giảng viên chưa dạy môn nào thì không có chỗ nào để lưu cả.</li>
<li><strong>Câu hỏi mà hình dạng này làm cho đắt</strong> — "những giảng viên nào dạy ở nhiều hơn một khoa?" buộc phải duyệt cả cây từ gốc, vì từ giảng viên không có mối nối nào đi ngang.</li>
<li><strong>Hình dạng ấy sống ở đâu</strong> — mô hình chết, hình dạng thì không: cây thư mục, tài liệu XML và JSON, cây DOM của HTML, thư mục LDAP, và tài liệu MongoDB đều là cây một cha. Bản thân IBM IMS, DBMS phân cấp chủ lực từ 1966, tới nay vẫn đang chạy trong các ngân hàng và hãng bảo hiểm — một sắc thái hữu ích nếu đề tự luận hỏi "lỗi thời" có nghĩa là "biến mất" hay không.</li>
</ul>
<p class="meo">💡 Hai chữ để nhớ mô hình này: <strong>một cha</strong>. Nếu phương án thi ghi "trong mô hình phân cấp một thực thể có thể có nhiều cha" thì nó đang tả mô hình MẠNG và nó sai.</p>
<p class="pitfall">⚠️ Để ý ô STUDENTS có một trường tên <code>Courses</code> — MỘT trường để chứa NHIỀU môn mà sinh viên học. Đó là thuộc tính đa trị, và chính deck về sau (slide 33) thừa nhận một quan hệ như thế KHÔNG ở dạng chuẩn 1. Đừng chép thiết kế ấy vào bất kỳ câu trả lời nào về mô hình quan hệ.</p>`],

      [16, '3. The network model',
        `<p class="y-chinh">🎯 <strong>Entities organised in a graph, in which some entities can be accessed through several paths. There is no hierarchy.</strong> Also declared obsolete on the slide itself.</p>
<ul>
<li><strong>Read Figure 11.5 exactly</strong> — the same four boxes as the previous slide, but now flat and cross-linked: <strong>DEPARTMENT</strong> (<code>No</code>, <code>Name</code>) and <strong>STUDENTS</strong> (<code>ID</code>, <code>Name</code>, <code>Courses</code>) on the top row, <strong>COURSES</strong> (<code>No</code>, <code>Name</code>, <code>Unit</code>) and <strong>PROFESSORS</strong> (<code>ID</code>, <code>Name</code>) on the bottom row, with lines crossing diagonally between them and a line joining DEPARTMENT to STUDENTS across the top.</li>
<li><strong>What "several paths" buys</strong> — you can reach PROFESSORS from DEPARTMENT directly <em>or</em> via COURSES. The single-path prison of the hierarchical model is gone, and so is its duplication: one professor record, many links pointing at it.</li>
<li><strong>What it costs</strong> — the links are physical pointers stored in the data. A program traverses them by hand, record by record, in what CODASYL literally called <em>navigation</em>: <code>FIND FIRST</code>, <code>FIND NEXT OWNER</code>, <code>FIND NEXT MEMBER</code>. The application therefore knows the physical structure again, which is exactly the program–data dependence the three-level architecture was built to kill.</li>
<li><strong>Why it lost anyway</strong> — adding a new kind of link means reorganising the stored pointers and rewriting every navigating program. In the relational model, adding a relationship means adding a column of values; no program that does not use it needs to change.</li>
<li><strong>Where the shape survives</strong> — graph databases (Neo4j, Amazon Neptune) are the network model reborn, and for genuinely graph-shaped questions ("shortest chain of friends between A and B") they beat joins comfortably. The idea was not wrong; it was premature and under-abstracted.</li>
</ul>
<table><tr><th></th><th>Phân cấp</th><th>Mạng</th></tr>
<tr><td>Số cha tối đa</td><td>1</td><td>nhiều</td></tr>
<tr><td>Hình dạng</td><td>cây</td><td>đồ thị</td></tr>
<tr><td>Số đường tới một bản ghi</td><td>một</td><td>nhiều</td></tr>
<tr><td>Trùng lặp dữ liệu</td><td>cao</td><td>thấp hơn</td></tr>
<tr><td>Chuẩn / sản phẩm</td><td>IBM IMS (1966)</td><td>CODASYL DBTG (1969–71), IDMS</td></tr></table>
<p class="pitfall">⚠️ The classic exam confusion is "network model = a database on a computer network". It has nothing to do with networking. "Network" here means <em>graph</em>, the mathematical structure — nodes and edges. A distributed database is the concept about machines on a network, and it belongs to the last objective on slide 3.</p>`,
        `<p class="y-chinh">🎯 <strong>Các thực thể tổ chức thành một đồ thị, trong đó một số thực thể tới được bằng nhiều đường. Không có phân cấp.</strong> Cũng bị chính slide tuyên bố là lỗi thời.</p>
<ul>
<li><strong>Đọc Hình 11.5 cho chính xác</strong> — vẫn bốn ô như slide trước, nhưng nay nằm ngang và nối chéo nhau: <strong>DEPARTMENT</strong> (<code>No</code>, <code>Name</code>) và <strong>STUDENTS</strong> (<code>ID</code>, <code>Name</code>, <code>Courses</code>) ở hàng trên, <strong>COURSES</strong> (<code>No</code>, <code>Name</code>, <code>Unit</code>) và <strong>PROFESSORS</strong> (<code>ID</code>, <code>Name</code>) ở hàng dưới, các đường cắt chéo qua nhau giữa hai hàng và một đường nối DEPARTMENT với STUDENTS vòng qua đỉnh.</li>
<li><strong>"Nhiều đường" mua được gì</strong> — bạn tới PROFESSORS từ DEPARTMENT trực tiếp <em>hoặc</em> qua COURSES. Nhà tù một-đường của mô hình phân cấp biến mất, và sự trùng lặp của nó cũng biến mất: một bản ghi giảng viên, nhiều mối nối trỏ vào.</li>
<li><strong>Cái giá</strong> — các mối nối là con trỏ vật lý được lưu ngay trong dữ liệu. Chương trình phải đi qua chúng bằng tay, từng bản ghi một, bằng thứ mà CODASYL gọi đúng chữ là <em>điều hướng</em>: <code>FIND FIRST</code>, <code>FIND NEXT OWNER</code>, <code>FIND NEXT MEMBER</code>. Thế là ứng dụng lại biết cấu trúc vật lý, đúng cái phụ thuộc chương trình–dữ liệu mà kiến trúc ba mức sinh ra để giết.</li>
<li><strong>Vì sao nó vẫn thua</strong> — thêm một loại mối nối mới nghĩa là sắp xếp lại con trỏ đã lưu và viết lại mọi chương trình điều hướng. Trong mô hình quan hệ, thêm một liên kết chỉ là thêm một cột giá trị; chương trình nào không dùng tới thì không phải sửa.</li>
<li><strong>Hình dạng ấy sống ở đâu</strong> — các CSDL đồ thị (Neo4j, Amazon Neptune) chính là mô hình mạng tái sinh, và với những câu hỏi thật sự mang hình đồ thị ("chuỗi bạn bè ngắn nhất giữa A và B") thì chúng hơn hẳn phép kết nối. Ý tưởng không sai; nó chỉ ra đời quá sớm và trừu tượng hoá chưa đủ.</li>
</ul>
<table><tr><th></th><th>Phân cấp</th><th>Mạng</th></tr>
<tr><td>Số cha tối đa</td><td>1</td><td>nhiều</td></tr>
<tr><td>Hình dạng</td><td>cây</td><td>đồ thị</td></tr>
<tr><td>Số đường tới một bản ghi</td><td>một</td><td>nhiều</td></tr>
<tr><td>Trùng lặp dữ liệu</td><td>cao</td><td>thấp hơn</td></tr>
<tr><td>Chuẩn / sản phẩm</td><td>IBM IMS (1966)</td><td>CODASYL DBTG (1969–71), IDMS</td></tr></table>
<p class="pitfall">⚠️ Nhầm lẫn kinh điển trong phòng thi là "mô hình mạng = cơ sở dữ liệu đặt trên mạng máy tính". Nó chẳng liên quan gì tới mạng máy tính. "Network" ở đây nghĩa là <em>đồ thị</em>, cấu trúc toán học gồm đỉnh và cạnh. Khái niệm nói về các máy trên mạng là CSDL PHÂN TÁN, và nó thuộc mục tiêu cuối cùng ở slide 3.</p>`],

      [17, '4. The relational model',
        `<p class="y-chinh">🎯 The model the rest of the chapter is about: <strong>data organised in two-dimensional tables called relations. No hierarchical or network structure is imposed on the data — but the tables are still related to each other.</strong></p>
<ul>
<li><strong>Read Figure 11.6 exactly</strong> — four tables with black headers. <strong>DEPARTMENT</strong>(<code>No</code>, <code>Name</code>) · <strong>PROFESSORS</strong>(<code>ID</code>, <code>Name</code>, <code>Dept-No</code>, <code>Courses</code>) · <strong>COURSES</strong>(<code>No</code>, <code>Dept-No</code>, <code>Prof-ID</code>, <code>Unit</code>) · <strong>STUDENTS</strong>(<code>ID</code>, <code>Name</code>, <code>Courses</code>). Dashed lines run between them — from <code>DEPARTMENT.No</code> to the <code>Dept-No</code> columns, from <code>PROFESSORS.ID</code> to <code>COURSES.Prof-ID</code>, and from <code>COURSES.No</code> to the <code>Courses</code> columns.</li>
<li><strong>The dashed lines are the whole invention</strong> — compare them with the solid arrows of slides 15 and 16. Those were <em>pointers</em>, physically stored. These are not stored at all: the link exists because the value <code>Dept-No</code> in one table <em>equals</em> the value <code>No</code> in another. Codd's idea in one sentence: <strong>relate records by matching values, never by stored addresses.</strong></li>
<li><strong>Why removing pointers removed the pain</strong> — no pointer means nothing to reorganise when the physical layout changes (physical data independence, slide 10) and nothing for an application to navigate (no program–data dependence, slide 5). Queries can then be written by saying <em>what</em> you want, and an optimiser decides <em>how</em> — which is why <code>EXPLAIN QUERY PLAN</code> on slide 10 had a choice to make.</li>
<li><strong>Proof that the link is a rule, not a drawing</strong> — in the library database the dashed line is written as <code>FOREIGN KEY (mssv) REFERENCES SinhVien(mssv)</code>, and the DBMS enforces it. Inserting a borrowing for a student who does not exist returned <code>Error: FOREIGN KEY constraint failed (19)</code>; deleting a student who still holds a book returned the same error.</li>
<li><strong>A caution about the figure's design</strong> — see the pitfall. Two of its columns would fail the normalisation test the same deck applies on slide 33.</li>
</ul>
<p class="nhan">Đã chạy thật — liên kết bằng GIÁ TRỊ, kết nối ba bảng của CSDL thư viện:</p>
<pre>SELECT sv.ho_ten, s.tua_sach, m.ngay_muon
FROM MuonSach m
JOIN SinhVien sv ON m.mssv = sv.mssv
JOIN Sach     s  ON m.isbn = s.isbn
ORDER BY m.ngay_muon;</pre>
<table><tr><th>ho_ten</th><th>tua_sach</th><th>ngay_muon</th></tr>
<tr><td>Nguyen Van An</td><td>Foundations of Computer Science</td><td>2026-09-01</td></tr>
<tr><td>Tran Thi Binh</td><td>Foundations of Computer Science</td><td>2026-09-03</td></tr>
<tr><td>Le Van Cuong</td><td>Database System Concepts</td><td>2026-09-04</td></tr>
<tr><td>Nguyen Van An</td><td>Introduction to Algorithms</td><td>2026-09-05</td></tr>
<tr><td>Pham Thi Dung</td><td>Head First Design Patterns</td><td>2026-09-06</td></tr></table>
<p class="pitfall">⚠️ Figure 11.6 gives <strong>PROFESSORS</strong> a column <code>Courses</code> and <strong>STUDENTS</strong> a column <code>Courses</code> — single columns holding many course codes. Those are multi-valued attributes, and slide 33 of this very deck says such relations are <em>not in first normal form</em> and must be split. Read the figure as a sketch of "tables linked by values", not as a correct schema to imitate. The correct design is a separate table with one row per (student, course) pair — exactly what <code>MuonSach</code> does for (student, book).</p>`,
        `<p class="y-chinh">🎯 Mô hình mà cả phần còn lại của chương nói về: <strong>dữ liệu tổ chức thành các bảng hai chiều gọi là quan hệ. Không áp đặt cấu trúc phân cấp hay cấu trúc mạng nào lên dữ liệu — nhưng các bảng vẫn liên quan với nhau.</strong></p>
<ul>
<li><strong>Đọc Hình 11.6 cho chính xác</strong> — bốn bảng với dòng tiêu đề nền đen. <strong>DEPARTMENT</strong>(<code>No</code>, <code>Name</code>) · <strong>PROFESSORS</strong>(<code>ID</code>, <code>Name</code>, <code>Dept-No</code>, <code>Courses</code>) · <strong>COURSES</strong>(<code>No</code>, <code>Dept-No</code>, <code>Prof-ID</code>, <code>Unit</code>) · <strong>STUDENTS</strong>(<code>ID</code>, <code>Name</code>, <code>Courses</code>). Các đường NÉT ĐỨT chạy giữa chúng — từ <code>DEPARTMENT.No</code> tới các cột <code>Dept-No</code>, từ <code>PROFESSORS.ID</code> tới <code>COURSES.Prof-ID</code>, và từ <code>COURSES.No</code> tới các cột <code>Courses</code>.</li>
<li><strong>Các đường nét đứt ấy chính là toàn bộ phát minh</strong> — so với mũi tên NÉT LIỀN ở slide 15 và 16. Những cái kia là <em>con trỏ</em>, được lưu vật lý. Những cái này không hề được lưu: mối nối tồn tại vì giá trị <code>Dept-No</code> ở bảng này <em>bằng</em> giá trị <code>No</code> ở bảng kia. Ý của Codd gói trong một câu: <strong>nối các bản ghi bằng giá trị trùng khớp, không bao giờ bằng địa chỉ lưu sẵn.</strong></li>
<li><strong>Bỏ con trỏ thì hết đau ở đâu</strong> — không con trỏ nghĩa là không có gì phải sắp xếp lại khi bố cục vật lý đổi (độc lập dữ liệu vật lý, slide 10) và không có gì cho ứng dụng phải đi đường (hết phụ thuộc chương trình–dữ liệu, slide 5). Nhờ đó truy vấn được viết bằng cách nói <em>muốn gì</em>, còn bộ tối ưu quyết định <em>làm thế nào</em> — đó là lý do <code>EXPLAIN QUERY PLAN</code> ở slide 10 có quyền chọn.</li>
<li><strong>Bằng chứng mối nối là một LUẬT chứ không phải một nét vẽ</strong> — trong CSDL thư viện, đường nét đứt ấy được viết thành <code>FOREIGN KEY (mssv) REFERENCES SinhVien(mssv)</code>, và DBMS thi hành nó. Chèn một lượt mượn cho sinh viên không tồn tại trả về <code>Error: FOREIGN KEY constraint failed (19)</code>; xoá một sinh viên còn đang giữ sách cũng trả về đúng lỗi ấy.</li>
<li><strong>Một lời cảnh báo về thiết kế của bức hình</strong> — xem phần bẫy. Hai cột của nó sẽ trượt đúng phép kiểm chuẩn hoá mà chính deck này áp dụng ở slide 33.</li>
</ul>
<p class="nhan">Đã chạy thật — liên kết bằng GIÁ TRỊ, kết nối ba bảng của CSDL thư viện:</p>
<pre>SELECT sv.ho_ten, s.tua_sach, m.ngay_muon
FROM MuonSach m
JOIN SinhVien sv ON m.mssv = sv.mssv
JOIN Sach     s  ON m.isbn = s.isbn
ORDER BY m.ngay_muon;</pre>
<table><tr><th>ho_ten</th><th>tua_sach</th><th>ngay_muon</th></tr>
<tr><td>Nguyen Van An</td><td>Foundations of Computer Science</td><td>2026-09-01</td></tr>
<tr><td>Tran Thi Binh</td><td>Foundations of Computer Science</td><td>2026-09-03</td></tr>
<tr><td>Le Van Cuong</td><td>Database System Concepts</td><td>2026-09-04</td></tr>
<tr><td>Nguyen Van An</td><td>Introduction to Algorithms</td><td>2026-09-05</td></tr>
<tr><td>Pham Thi Dung</td><td>Head First Design Patterns</td><td>2026-09-06</td></tr></table>
<p class="pitfall">⚠️ Hình 11.6 cho <strong>PROFESSORS</strong> một cột <code>Courses</code> và <strong>STUDENTS</strong> một cột <code>Courses</code> — những cột ĐƠN chứa NHIỀU mã môn. Đó là thuộc tính đa trị, và slide 33 của chính deck này nói các quan hệ như thế <em>không ở dạng chuẩn 1</em> và phải tách ra. Hãy đọc bức hình như một phác thảo cho ý "các bảng nối nhau bằng giá trị", đừng đọc nó như một lược đồ đúng để bắt chước. Thiết kế đúng là một bảng riêng, mỗi dòng một cặp (sinh viên, môn học) — đúng như <code>MuonSach</code> làm với cặp (sinh viên, sách).</p>`],

      [18, '4 - The relationship database model',
        `<p class="y-chinh">🎯 Section divider for 11.4, the practical heart of the chapter. Slide 17 said <em>what</em> the relational model is; from here the deck says <em>how to talk about it</em> (slide 19) and <em>how to operate on it</em> (slides 20–26).</p>
<ul>
<li><strong>What is coming</strong> — slide 19 defines a relation and its parts; slide 20 lists the nine operations and introduces SQL; slides 21–26 take one operation each: insert, delete, update, select, join, union.</li>
<li><strong>The vocabulary you are about to owe</strong> — relation, attribute, tuple, cardinality, and (from the textbook, though not from this slide) degree, domain, primary key, candidate key, foreign key. Every one of them has an everyday synonym, and the exam may use either.</li>
<li><strong>Read the section title carefully</strong> — it says "the relation<em>ship</em> database model". The correct name is the <strong>relational</strong> model. The two words are not synonyms: <em>relation</em> is the mathematical object (a table), while <em>relationship</em> is the link between entities in E-R modelling (slide 29). The model is named after the first, not the second.</li>
<li><strong>Why the distinction is worth a minute</strong> — students routinely write "the relational model is called that because tables are related to each other". That is a nice story and it is false. Codd took the word from mathematics: a relation is a subset of a Cartesian product. Tables being related is a consequence, not the origin of the name.</li>
<li><strong>What you should be able to do at the end of the section</strong> — look at a table and say its degree and cardinality; point at its primary key; point at a foreign key and name the table it references; and read a short SQL statement and say which of the nine operations it performs.</li>
</ul>
<p class="meo">💡 Learn the three-word triangle now and everything else attaches to it: <strong>relation = table · tuple = row · attribute = column.</strong> Formal word on the left, everyday word on the right. Exams use the left column; textbooks and screens use the right.</p>`,
        `<p class="y-chinh">🎯 Slide phân mục cho 11.4, phần lõi thực dụng của chương. Slide 17 đã nói mô hình quan hệ <em>là gì</em>; từ đây deck nói <em>nói về nó bằng từ gì</em> (slide 19) và <em>thao tác trên nó ra sao</em> (slide 20–26).</p>
<ul>
<li><strong>Sắp tới có gì</strong> — slide 19 định nghĩa quan hệ và các bộ phận của nó; slide 20 liệt kê chín phép toán và giới thiệu SQL; slide 21–26 mỗi slide một phép: insert, delete, update, select, join, union.</li>
<li><strong>Vốn từ bạn sắp phải nợ</strong> — quan hệ, thuộc tính, bộ, lực lượng, và (theo giáo trình, dù slide này không nói) bậc, miền, khoá chính, khoá dự tuyển, khoá ngoại. Mỗi từ đều có một từ đồng nghĩa đời thường, và đề thi có thể dùng từ nào cũng được.</li>
<li><strong>Đọc kỹ tiêu đề mục</strong> — nó ghi "the relation<em>ship</em> database model". Tên đúng là mô hình <strong>quan hệ (relational)</strong>. Hai chữ này KHÔNG đồng nghĩa: <em>relation</em> là đối tượng toán học (một cái bảng), còn <em>relationship</em> là mối liên kết giữa các thực thể trong mô hình E-R (slide 29). Mô hình được đặt tên theo chữ thứ nhất, không phải chữ thứ hai.</li>
<li><strong>Vì sao phân biệt ấy đáng một phút</strong> — sinh viên rất hay viết "gọi là mô hình quan hệ vì các bảng có liên quan với nhau". Đó là một câu chuyện đẹp và nó SAI. Codd lấy chữ ấy từ toán học: một quan hệ là một tập con của tích Descartes. Chuyện các bảng liên quan nhau là hệ quả, không phải nguồn gốc của cái tên.</li>
<li><strong>Cuối mục bạn phải làm được gì</strong> — nhìn một bảng và nói được bậc và lực lượng của nó; chỉ ra khoá chính; chỉ ra một khoá ngoại và gọi tên bảng mà nó tham chiếu; và đọc một câu SQL ngắn rồi nói nó thực hiện phép nào trong chín phép.</li>
</ul>
<p class="meo">💡 Thuộc ngay tam giác ba từ, rồi mọi thứ khác bám vào đó: <strong>quan hệ = bảng · bộ = dòng · thuộc tính = cột.</strong> Từ hình thức bên trái, từ đời thường bên phải. Đề thi dùng cột trái; giáo trình và màn hình dùng cột phải.</p>`],

      [19, '1. Relation',
        `<p class="y-chinh">🎯 The definition sheet: <strong>a relation is, in appearance, a two-dimensional table</strong> — with a unique <em>Name</em>, <em>Attributes</em> as columns, and <em>Tuples</em> as rows, the number of rows being the <strong>cardinality</strong>. And one sentence that is easy to skim and is the most important on the slide: <em>this does not mean the data is stored as tables — physical storage is independent of the logical organisation.</em></p>
<ul>
<li><strong>Read Figure 11.7 exactly</strong> — the relation is named <strong>COURSES</strong> (the note beside the picture says so). Its three attributes are <code>No</code>, <code>Course-Name</code>, <code>Unit</code>; its four tuples are CIS15/Intro to C/5, CIS17/Intro to Java/5, CIS19/UNIX/4, CIS51/Networking/5. So cardinality = 4, degree = 3.</li>
<li><strong>The three features named on the slide</strong> — <em>Name</em>: unique among all relations in the database. <em>Attributes</em>: the column headings; "each attribute gives meaning to the data" — <code>5</code> alone means nothing, <code>Unit = 5</code> means five credits. <em>Tuples</em>: rows, each a collection of attribute values.</li>
<li><strong>The two definitions the slide omits, and the exam does not</strong> — <strong>degree (bậc)</strong> = the number of attributes (columns); <strong>domain (miền)</strong> = the set of permitted values of one attribute. Cardinality changes every time someone inserts a row; degree changes only when the schema changes. That asymmetry is itself an exam question.</li>
<li><strong>The three kinds of key, pointed at real columns</strong> — <strong>candidate key (khoá dự tuyển)</strong>: any attribute set that uniquely identifies a tuple; in <code>SinhVien</code> both <code>mssv</code> and <code>email</code> qualify. <strong>Primary key (khoá chính)</strong>: the candidate key actually chosen — <code>mssv</code>; it may never be NULL and never repeat. <strong>Foreign key (khoá ngoại)</strong>: an attribute whose values must exist as a primary key in another relation — <code>MuonSach.mssv</code> pointing at <code>SinhVien.mssv</code>.</li>
<li><strong>Why "not stored as tables" matters</strong> — it is slide 10 again. The table is the <em>conceptual</em> picture; on disk it may be a B-tree, a heap, compressed, encrypted or split across machines. Never answer "a relation is a file".</li>
</ul>
<p class="nhan">Đã chạy thật — dựng đúng quan hệ COURSES của hình, rồi ĐO bậc và lực lượng:</p>
<pre>CREATE TABLE COURSES (No TEXT PRIMARY KEY, "Course-Name" TEXT, Unit INTEGER);
SELECT COUNT(*) FROM pragma_table_info('COURSES');  -- bậc   --&gt; 3
SELECT COUNT(*) FROM COURSES;                       -- lực lượng --&gt; 4</pre>
<table><tr><th>No</th><th>Course-Name</th><th>Unit</th></tr>
<tr><td>CIS15</td><td>Intro to C</td><td>5</td></tr>
<tr><td>CIS17</td><td>Intro to Java</td><td>5</td></tr>
<tr><td>CIS19</td><td>UNIX</td><td>4</td></tr>
<tr><td>CIS51</td><td>Networking</td><td>5</td></tr></table>
<p class="dap-an">✅ Đáp án — <strong>degree = 3, cardinality = 4</strong>, both measured, not guessed. The keys were tested too, each refusal proving the rule: re-inserting <code>HE180001</code> gave <code>Error: UNIQUE constraint failed: SinhVien.mssv</code> (primary key), re-using an existing address gave <code>Error: UNIQUE constraint failed: SinhVien.email</code> (candidate key), and a borrowing for the non-existent student <code>HE999999</code> gave <code>Error: FOREIGN KEY constraint failed</code>. A domain was tested as well: with <code>CHECK (so_ban &gt;= 0)</code> declared, inserting <code>-1</code> gave <code>Error: CHECK constraint failed: so_ban &gt;= 0</code>.</p>
<p class="pitfall">⚠️ Two traps in one slide. (1) <strong>Cardinality is rows, degree is columns</strong> — and the words feel backwards to most students, because "cardinality" sounds like it should count the headings. (2) A relation is a <em>set</em> of tuples, so in theory it has no duplicate rows and no row order; SQL, however, allows duplicates in a table without a key and <code>SELECT</code> returns rows in whatever order the engine likes. If you need an order you must write <code>ORDER BY</code> — never rely on the order rows come back in.</p>`,
        `<p class="y-chinh">🎯 Tờ định nghĩa: <strong>quan hệ, về hình thức, là một bảng hai chiều</strong> — có <em>Tên</em> duy nhất, các <em>Thuộc tính</em> là cột, các <em>Bộ</em> là dòng, và số dòng gọi là <strong>lực lượng</strong>. Cùng một câu rất dễ lướt qua mà lại quan trọng nhất slide: <em>điều đó KHÔNG có nghĩa dữ liệu được lưu dưới dạng bảng — lưu trữ vật lý độc lập với cách tổ chức logic.</em></p>
<ul>
<li><strong>Đọc Hình 11.7 cho chính xác</strong> — quan hệ tên là <strong>COURSES</strong> (ghi chú bên cạnh hình nói vậy). Ba thuộc tính là <code>No</code>, <code>Course-Name</code>, <code>Unit</code>; bốn bộ là CIS15/Intro to C/5, CIS17/Intro to Java/5, CIS19/UNIX/4, CIS51/Networking/5. Vậy lực lượng = 4, bậc = 3.</li>
<li><strong>Ba đặc điểm slide gọi tên</strong> — <em>Tên</em>: duy nhất trong toàn CSDL. <em>Thuộc tính</em>: các đầu cột; "mỗi thuộc tính mang lại ý nghĩa cho dữ liệu" — số <code>5</code> đứng một mình chẳng nghĩa gì, còn <code>Unit = 5</code> nghĩa là năm tín chỉ. <em>Bộ</em>: các dòng, mỗi dòng là một tập hợp các giá trị thuộc tính.</li>
<li><strong>Hai định nghĩa slide bỏ sót mà đề thi thì không</strong> — <strong>bậc (degree)</strong> = số thuộc tính (số cột); <strong>miền (domain)</strong> = tập giá trị được phép của một thuộc tính. Lực lượng thay đổi mỗi lần có người chèn một dòng; bậc chỉ đổi khi lược đồ đổi. Chính sự bất đối xứng ấy là một câu hỏi thi.</li>
<li><strong>Ba loại khoá, chỉ thẳng vào cột thật</strong> — <strong>khoá dự tuyển</strong>: bất kỳ tập thuộc tính nào định danh duy nhất một bộ; trong <code>SinhVien</code> thì cả <code>mssv</code> lẫn <code>email</code> đều đủ tư cách. <strong>Khoá chính</strong>: khoá dự tuyển được chọn thật — <code>mssv</code>; nó không bao giờ được NULL và không bao giờ được lặp. <strong>Khoá ngoại</strong>: thuộc tính mà giá trị của nó phải tồn tại như khoá chính ở một quan hệ khác — <code>MuonSach.mssv</code> trỏ vào <code>SinhVien.mssv</code>.</li>
<li><strong>Vì sao câu "không lưu dưới dạng bảng" lại quan trọng</strong> — nó lại là slide 10. Cái bảng là bức tranh <em>khái niệm</em>; trên đĩa nó có thể là cây B, là đống, bị nén, bị mã hoá, hoặc bị chia ra nhiều máy. Đừng bao giờ trả lời "quan hệ là một tệp".</li>
</ul>
<p class="nhan">Đã chạy thật — dựng đúng quan hệ COURSES của hình, rồi ĐO bậc và lực lượng:</p>
<pre>CREATE TABLE COURSES (No TEXT PRIMARY KEY, "Course-Name" TEXT, Unit INTEGER);
SELECT COUNT(*) FROM pragma_table_info('COURSES');  -- bậc      --&gt; 3
SELECT COUNT(*) FROM COURSES;                       -- lực lượng --&gt; 4</pre>
<table><tr><th>No</th><th>Course-Name</th><th>Unit</th></tr>
<tr><td>CIS15</td><td>Intro to C</td><td>5</td></tr>
<tr><td>CIS17</td><td>Intro to Java</td><td>5</td></tr>
<tr><td>CIS19</td><td>UNIX</td><td>4</td></tr>
<tr><td>CIS51</td><td>Networking</td><td>5</td></tr></table>
<p class="dap-an">✅ Đáp án — <strong>bậc = 3, lực lượng = 4</strong>, cả hai đều ĐO được chứ không đoán. Các khoá cũng đã được thử, mỗi lần bị từ chối là một lần luật được chứng minh: chèn lại <code>HE180001</code> cho <code>Error: UNIQUE constraint failed: SinhVien.mssv</code> (khoá chính), dùng lại một địa chỉ đã có cho <code>Error: UNIQUE constraint failed: SinhVien.email</code> (khoá dự tuyển), và một lượt mượn cho sinh viên không tồn tại <code>HE999999</code> cho <code>Error: FOREIGN KEY constraint failed</code>. Miền giá trị cũng đã thử: khai <code>CHECK (so_ban &gt;= 0)</code> rồi chèn <code>-1</code> thì nhận <code>Error: CHECK constraint failed: so_ban &gt;= 0</code>.</p>
<p class="pitfall">⚠️ Hai bẫy trong một slide. (1) <strong>Lực lượng là DÒNG, bậc là CỘT</strong> — và với đa số sinh viên hai chữ này nghe như ngược, vì "lực lượng/cardinality" nghe cứ như phải đếm đầu cột. (2) Quan hệ là một <em>tập hợp</em> các bộ, nên về lý thuyết nó không có dòng trùng và không có thứ tự dòng; nhưng SQL thì cho phép dòng trùng trong bảng không có khoá, và <code>SELECT</code> trả dòng theo thứ tự nào tuỳ máy thích. Cần thứ tự thì phải viết <code>ORDER BY</code> — đừng bao giờ tin vào thứ tự dòng trả về.</p>`],

      [20, '2. Operations on relations',
        `<p class="y-chinh">🎯 The bridge from theory to SQL: <strong>nine operations that create new relations from existing ones — insert, delete, update, select, project, join, union, intersection, difference</strong> — and the decision to describe each one through <strong>SQL</strong>, "the language standardized by ANSI and ISO for use on relational databases".</p>
<ul>
<li><strong>The operations split into two families</strong> — the first three (<em>insert, delete, update</em>) <em>change</em> the stored data; the other six (<em>select, project, join, union, intersection, difference</em>) only <em>read</em> it and produce a new relation as an answer. Only the second family is relational algebra in Codd's sense.</li>
<li><strong>Unary versus binary</strong> — insert, delete, update, select and project take one relation; join, union, intersection and difference take two. The deck states "unary" explicitly on slides 21–24, so expect the words in a question.</li>
<li><strong>Closure, the property that makes it all work</strong> — every operation returns a <em>relation</em>, so the answer of one operation can be the input of the next. That is why you can join, then filter, then project, in one statement.</li>
<li><strong>Read Figure 11.8 exactly</strong> — it dissects <code>UPDATE country SET population = population + 1 WHERE name = 'USA';</code> into labelled parts: the <em>UPDATE clause</em>, the <em>SET clause</em>, the <em>WHERE clause</em>, with <code>population + 1</code> and <code>'USA'</code> marked as <em>Expression</em>, <code>name = 'USA'</code> as the <em>Predicate</em>, and the whole thing as the <em>Statement</em>. Learn those five words; they make error messages readable.</li>
<li><strong>Three dates for SQL</strong> — designed at IBM in the early 1970s as SEQUEL; first ANSI standard 1986, ISO 1987; revised roughly every three to eight years since (SQL-92 is the one most often quoted, and SQL:2023 is current).</li>
</ul>
<table><tr><th>Phép</th><th>Ngôi</th><th>Đọc/Ghi</th><th>SQL</th><th>Kết quả đo thật trên CSDL thư viện</th></tr>
<tr><td>select (chọn dòng)</td><td>một ngôi</td><td>đọc</td><td><code>SELECT * FROM Sach WHERE nam_xb &gt;= 2014</code></td><td>2 / 4 dòng</td></tr>
<tr><td>project (chọn cột)</td><td>một ngôi</td><td>đọc</td><td><code>SELECT DISTINCT lop FROM SinhVien</code></td><td>4 dòng → 2 dòng</td></tr>
<tr><td>join</td><td>hai ngôi</td><td>đọc</td><td><code>… JOIN … ON m.mssv = sv.mssv</code></td><td>5 dòng</td></tr>
<tr><td>union</td><td>hai ngôi</td><td>đọc</td><td><code>… UNION …</code></td><td>4 mã sinh viên</td></tr>
<tr><td>intersection</td><td>hai ngôi</td><td>đọc</td><td><code>… INTERSECT …</code></td><td>1 mã: HE180001</td></tr>
<tr><td>difference</td><td>hai ngôi</td><td>đọc</td><td><code>… EXCEPT …</code></td><td>1 mã: HE180003</td></tr>
<tr><td>insert / delete / update</td><td>một ngôi</td><td>GHI</td><td><code>INSERT</code> / <code>DELETE</code> / <code>UPDATE</code></td><td>slide 21–23</td></tr></table>
<p class="dap-an">✅ Answer — the three set operations really were run, on "students with an unreturned book" against "students who have returned one". <code>UNION</code> returned HE180001, HE180002, HE180003, HE180004; <code>INTERSECT</code> returned only HE180001 (the one student in both groups); and <code>SELECT mssv FROM SinhVien EXCEPT SELECT mssv FROM MuonSach WHERE ngay_tra IS NULL</code> returned only HE180003 — the student holding nothing. Note the set behaviour: <code>UNION</code> on the <code>lop</code> column returned 2 rows while <code>UNION ALL</code> on the same query returned 5, because <code>UNION</code> removes duplicates and <code>UNION ALL</code> does not.</p>
<p class="pitfall">⚠️ The deck promises nine operations but gives a slide only to <strong>six</strong>: insert (21), delete (22), update (23), select (24), join (25), union (26). <em>Project, intersection and difference are never shown.</em> Learn them yourself — project is choosing columns (<code>SELECT col1, col2</code>), intersection is <code>INTERSECT</code>, difference is <code>EXCEPT</code> (called <code>MINUS</code> in Oracle). A second trap: the word <em>select</em> means two different things. In relational algebra it means <em>choose rows</em> (σ, the <code>WHERE</code> part); in SQL the keyword <code>SELECT</code> starts every query and its column list is actually the <em>project</em> operation.</p>`,
        `<p class="y-chinh">🎯 Cây cầu từ lý thuyết sang SQL: <strong>chín phép toán tạo ra quan hệ mới từ quan hệ đang có — insert, delete, update, select, project, join, union, intersection, difference</strong> — và quyết định mô tả từng phép thông qua <strong>SQL</strong>, "ngôn ngữ được ANSI và ISO chuẩn hoá để dùng trên các CSDL quan hệ".</p>
<ul>
<li><strong>Chín phép chia thành hai họ</strong> — ba phép đầu (<em>insert, delete, update</em>) <em>thay đổi</em> dữ liệu đã lưu; sáu phép còn lại (<em>select, project, join, union, intersection, difference</em>) chỉ <em>đọc</em> và sinh ra một quan hệ mới làm câu trả lời. Chỉ họ thứ hai mới là đại số quan hệ theo nghĩa của Codd.</li>
<li><strong>Một ngôi và hai ngôi</strong> — insert, delete, update, select, project nhận một quan hệ; join, union, intersection, difference nhận hai. Deck nói thẳng chữ "unary" ở slide 21–24, nên hãy chờ gặp lại chữ ấy trong đề.</li>
<li><strong>Tính đóng, thứ làm cho cả hệ thống chạy được</strong> — mọi phép đều trả về một <em>quan hệ</em>, nên kết quả của phép này làm được đầu vào cho phép kia. Đó là lý do bạn kết nối rồi lọc rồi chiếu cột, tất cả trong một câu lệnh.</li>
<li><strong>Đọc Hình 11.8 cho chính xác</strong> — nó mổ xẻ câu <code>UPDATE country SET population = population + 1 WHERE name = 'USA';</code> thành các phần có nhãn: <em>UPDATE clause</em>, <em>SET clause</em>, <em>WHERE clause</em>, trong đó <code>population + 1</code> và <code>'USA'</code> được đánh dấu là <em>Expression</em>, <code>name = 'USA'</code> là <em>Predicate</em>, và cả câu là <em>Statement</em>. Thuộc năm chữ ấy đi; chúng làm cho các thông báo lỗi trở nên đọc được.</li>
<li><strong>Ba mốc của SQL</strong> — thiết kế tại IBM đầu thập niên 1970 với tên SEQUEL; chuẩn ANSI đầu tiên năm 1986, ISO năm 1987; sau đó sửa đổi khoảng ba tới tám năm một lần (SQL-92 là bản hay bị trích nhất, còn SQL:2023 là bản hiện hành).</li>
</ul>
<table><tr><th>Phép</th><th>Ngôi</th><th>Đọc/Ghi</th><th>SQL</th><th>Kết quả đo thật trên CSDL thư viện</th></tr>
<tr><td>select (chọn dòng)</td><td>một ngôi</td><td>đọc</td><td><code>SELECT * FROM Sach WHERE nam_xb &gt;= 2014</code></td><td>2 / 4 dòng</td></tr>
<tr><td>project (chọn cột)</td><td>một ngôi</td><td>đọc</td><td><code>SELECT DISTINCT lop FROM SinhVien</code></td><td>4 dòng → 2 dòng</td></tr>
<tr><td>join</td><td>hai ngôi</td><td>đọc</td><td><code>… JOIN … ON m.mssv = sv.mssv</code></td><td>5 dòng</td></tr>
<tr><td>union</td><td>hai ngôi</td><td>đọc</td><td><code>… UNION …</code></td><td>4 mã sinh viên</td></tr>
<tr><td>intersection</td><td>hai ngôi</td><td>đọc</td><td><code>… INTERSECT …</code></td><td>1 mã: HE180001</td></tr>
<tr><td>difference</td><td>hai ngôi</td><td>đọc</td><td><code>… EXCEPT …</code></td><td>1 mã: HE180003</td></tr>
<tr><td>insert / delete / update</td><td>một ngôi</td><td>GHI</td><td><code>INSERT</code> / <code>DELETE</code> / <code>UPDATE</code></td><td>slide 21–23</td></tr></table>
<p class="dap-an">✅ Đáp án — ba phép tập hợp đã được chạy thật, trên "sinh viên còn sách chưa trả" đối chiếu "sinh viên đã trả sách". <code>UNION</code> trả về HE180001, HE180002, HE180003, HE180004; <code>INTERSECT</code> chỉ trả về HE180001 (sinh viên duy nhất có mặt ở cả hai nhóm); còn <code>SELECT mssv FROM SinhVien EXCEPT SELECT mssv FROM MuonSach WHERE ngay_tra IS NULL</code> chỉ trả về HE180003 — sinh viên không đang giữ gì cả. Để ý hành vi TẬP HỢP: <code>UNION</code> trên cột <code>lop</code> trả 2 dòng trong khi <code>UNION ALL</code> cùng câu ấy trả 5 dòng, vì <code>UNION</code> khử trùng còn <code>UNION ALL</code> thì không.</p>
<p class="pitfall">⚠️ Deck hứa chín phép nhưng chỉ dành slide cho <strong>SÁU</strong>: insert (21), delete (22), update (23), select (24), join (25), union (26). <em>Project, intersection và difference không hề được trình bày.</em> Phải tự học ba phép ấy — project là chọn cột (<code>SELECT col1, col2</code>), intersection là <code>INTERSECT</code>, difference là <code>EXCEPT</code> (Oracle gọi là <code>MINUS</code>). Bẫy thứ hai: chữ <em>select</em> mang hai nghĩa khác nhau. Trong đại số quan hệ nó nghĩa là <em>chọn DÒNG</em> (σ, tức phần <code>WHERE</code>); còn trong SQL từ khoá <code>SELECT</code> mở đầu mọi truy vấn và danh sách cột của nó thật ra chính là phép <em>project</em>.</p>`],

      [21, '3. Insert',
        `<p class="y-chinh">🎯 The first operation, and the simplest: <strong>insert is a unary operation that adds one new tuple to one relation</strong>. Format on the slide: <code>insert into RELATION-NAME values (…, …, …)</code>.</p>
<ul>
<li><strong>Read Figure 11.9 exactly</strong> — COURSES with four tuples on the left, the yellow SQL command in the middle (<code>insert into COURSES values ("CIS52", "TCP/IP", 6)</code>), and COURSES with five tuples on the right, the new row CIS52 / TCP/IP / 6 at the bottom.</li>
<li><strong>"Unary" is not decoration</strong> — it says the operation touches exactly one relation. Contrast slide 25: join is binary because it needs two.</li>
<li><strong>Three things the DBMS checks before it agrees</strong> — the value count must match the column count; each value must fit its attribute's domain; and no key constraint may be broken. All three were tested for real below.</li>
<li><strong>Cardinality changes, degree does not</strong> — after the insert the relation has 5 tuples and still 3 attributes. That is the slide-19 asymmetry made visible in one command.</li>
<li><strong>The habit to build now</strong> — write the column names: <code>insert into COURSES (No, "Course-Name", Unit) values (…)</code>. The slide's positional form breaks silently the day someone adds a column in the middle of the table; the named form keeps working. This was verified: the named form inserted CIS60/Compiler/3 correctly even with the values given out of column order.</li>
</ul>
<p class="nhan">Đã chạy thật — đúng câu lệnh của slide, trên đúng bảng COURSES của slide 19:</p>
<pre>insert into COURSES values ('CIS52','TCP/IP', 6);
SELECT * FROM COURSES;</pre>
<table><tr><th>No</th><th>Course-Name</th><th>Unit</th></tr>
<tr><td>CIS15</td><td>Intro to C</td><td>5</td></tr>
<tr><td>CIS17</td><td>Intro to Java</td><td>5</td></tr>
<tr><td>CIS19</td><td>UNIX</td><td>4</td></tr>
<tr><td>CIS51</td><td>Networking</td><td>5</td></tr>
<tr><td>CIS52</td><td>TCP/IP</td><td>6</td></tr></table>
<p class="dap-an">✅ Đáp án — the slide's figure is correct: cardinality went from 4 to 5 and the new tuple is exactly CIS52 / TCP/IP / 6. The three refusals were measured too. Running the same command a second time gave <code>Error: UNIQUE constraint failed: COURSES.No (19)</code> — the primary key doing its job, which is also why insert is <em>not</em> idempotent. Supplying too few values gave <code>Error: table COURSES has 3 columns but 2 values were supplied</code>. One caution about the figure's own typography: it writes the strings with <strong>double quotes</strong>, <code>("CIS52", "TCP/IP", 6)</code>. In standard SQL a string literal takes <strong>single</strong> quotes and double quotes mean <em>identifier</em> (a table or column name). Measured: SQLite accepts the double-quoted form as a fallback — it even returned the literal text for <code>SELECT "Khong-Co-Cot" FROM COURSES</code> instead of erroring — while PostgreSQL rejects it. Copy the idea from the slide, but type single quotes.</p>
<p class="pitfall">⚠️ Two more things to carry into the next slides. <strong>Insert can fail on a foreign key, not just on a primary key</strong>: adding a borrowing for a student who does not exist gave <code>Error: FOREIGN KEY constraint failed (19)</code> — <em>but only with</em> <code>PRAGMA foreign_keys = ON</code>. Measured with the default setting off, SQLite happily stored an orphan row pointing at a non-existent parent. A constraint that is declared but not enforced protects nothing, so check that setting before trusting your own lab results.</p>`,
        `<p class="y-chinh">🎯 Phép đầu tiên, và đơn giản nhất: <strong>insert là phép MỘT NGÔI, thêm đúng một bộ mới vào đúng một quan hệ</strong>. Khuôn dạng trên slide: <code>insert into RELATION-NAME values (…, …, …)</code>.</p>
<ul>
<li><strong>Đọc Hình 11.9 cho chính xác</strong> — COURSES với bốn bộ ở bên trái, câu lệnh SQL nền vàng ở giữa (<code>insert into COURSES values ("CIS52", "TCP/IP", 6)</code>), và COURSES với năm bộ ở bên phải, dòng mới CIS52 / TCP/IP / 6 nằm dưới cùng.</li>
<li><strong>Chữ "một ngôi" không phải để trang trí</strong> — nó nói phép này đụng đúng MỘT quan hệ. Đối chiếu slide 25: join là hai ngôi vì nó cần hai.</li>
<li><strong>Ba thứ DBMS kiểm trước khi đồng ý</strong> — số giá trị phải khớp số cột; mỗi giá trị phải nằm trong miền của thuộc tính; và không được phá ràng buộc khoá nào. Cả ba đều đã được thử thật ở dưới.</li>
<li><strong>Lực lượng đổi, bậc thì không</strong> — sau lệnh chèn, quan hệ có 5 bộ và vẫn 3 thuộc tính. Đúng sự bất đối xứng của slide 19, hiện ra trong một câu lệnh.</li>
<li><strong>Thói quen cần rèn ngay</strong> — hãy viết tên cột ra: <code>insert into COURSES (No, "Course-Name", Unit) values (…)</code>. Dạng theo vị trí của slide sẽ hỏng CÂM vào cái ngày có người chèn thêm một cột vào giữa bảng; dạng nêu tên thì vẫn chạy. Đã kiểm: dạng nêu tên chèn đúng CIS60/Compiler/3 ngay cả khi các giá trị được đưa vào lệch thứ tự cột.</li>
</ul>
<p class="nhan">Đã chạy thật — đúng câu lệnh của slide, trên đúng bảng COURSES của slide 19:</p>
<pre>insert into COURSES values ('CIS52','TCP/IP', 6);
SELECT * FROM COURSES;</pre>
<table><tr><th>No</th><th>Course-Name</th><th>Unit</th></tr>
<tr><td>CIS15</td><td>Intro to C</td><td>5</td></tr>
<tr><td>CIS17</td><td>Intro to Java</td><td>5</td></tr>
<tr><td>CIS19</td><td>UNIX</td><td>4</td></tr>
<tr><td>CIS51</td><td>Networking</td><td>5</td></tr>
<tr><td>CIS52</td><td>TCP/IP</td><td>6</td></tr></table>
<p class="dap-an">✅ Đáp án — hình của slide ĐÚNG: lực lượng đi từ 4 lên 5 và bộ mới đúng là CIS52 / TCP/IP / 6. Ba lần từ chối cũng đã đo. Chạy lại đúng câu lệnh ấy lần hai cho <code>Error: UNIQUE constraint failed: COURSES.No (19)</code> — khoá chính làm đúng việc của nó, và đó cũng là lý do insert KHÔNG luỹ đẳng. Đưa thiếu giá trị thì nhận <code>Error: table COURSES has 3 columns but 2 values were supplied</code>. Một lưu ý về chính cách gõ trong hình: nó viết chuỗi bằng <strong>nháy KÉP</strong>, <code>("CIS52", "TCP/IP", 6)</code>. Trong SQL chuẩn, hằng chuỗi dùng nháy <strong>ĐƠN</strong>, còn nháy kép nghĩa là <em>tên đối tượng</em> (tên bảng hoặc tên cột). Đã đo: SQLite chấp nhận dạng nháy kép như một đường lùi — nó còn trả về chính đoạn chữ đó cho <code>SELECT "Khong-Co-Cot" FROM COURSES</code> thay vì báo lỗi — trong khi PostgreSQL thì từ chối. Hãy chép Ý của slide, nhưng gõ nháy đơn.</p>
<p class="pitfall">⚠️ Thêm hai điều mang sang các slide sau. <strong>Insert có thể hỏng vì khoá NGOẠI chứ không chỉ vì khoá chính</strong>: thêm một lượt mượn cho sinh viên không tồn tại cho <code>Error: FOREIGN KEY constraint failed (19)</code> — <em>nhưng chỉ khi</em> có <code>PRAGMA foreign_keys = ON</code>. Đo với thiết lập mặc định (tắt), SQLite vui vẻ lưu một dòng mồ côi trỏ vào bản ghi cha không tồn tại. Một ràng buộc được KHAI mà không được THI HÀNH thì chẳng bảo vệ được gì, nên hãy kiểm thiết lập ấy trước khi tin vào kết quả thực hành của chính mình.</p>`],

    ]),
  ].join('\n'),
};
