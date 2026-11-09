// Khoá TỰ SOẠN cho MAD102 — trường chưa công bố syllabus trên FLM (dò 09/11/2026). Soạn theo _HOP-DONG-TU-SOAN.md.
// Bản dành cho ngành Khoa học Máy tính: sâu hơn MAD101 (ngành SE) về chứng minh, quan hệ, đếm nâng cao, truy hồi,
// lý thuyết số cho mật mã và lý thuyết đồ thị/cây. Khung bám thứ tự giáo trình chuẩn:
//   Rosen "Discrete Mathematics and Its Applications" 8e (McGraw-Hill, 2018, ISBN 978-1-259-67651-2)
//   Lehman–Leighton–Meyer "Mathematics for Computer Science" (MIT, bản 06/06/2018, CC BY-SA 3.0, miễn phí).
// Mọi ví dụ số đã kiểm bằng python3; mọi khối code Python đã chạy thật và output dán nguyên văn.
// Mọi link ngoài đã mở thử (HTTP 200 + tiêu đề trang đúng chủ đề) ngày 09/11/2026.
// ⚠️ File này KHÔNG dùng chuỗi nội suy (dấu đô-la + ngoặc nhọn) và không backtick lồng; nội dung ghép bằng toán tử +.

const bi = (en, vi) => '<div class="ml-en">' + en + '</div>\n<div class="ml-vi">' + vi + '</div>';
const L = (slug, title, description, en, vi) => ({ title, slug, type: 'DOCUMENT', description, content: bi(en, vi) });
const Q = (id, question, options, correctIndex, explanation) => ({ id, question, options, correctIndex, points: 1, explanation });
// Xoay vòng thứ tự phương án theo vị trí câu để đáp án đúng không dồn về một ô (correctIndex tính lại theo phép xoay).
const xoay = (q, k) => {
  const r = k % 4;
  return { ...q, options: q.options.map((_, j) => q.options[(j + r) % 4]), correctIndex: (q.correctIndex - r + 4) % 4 };
};
const QZ = (ch, title, description, questions) => ({
  title, slug: 'mad102-ts-quiz-' + ch, type: 'QUIZ', description,
  quiz: { timeLimitSeconds: 900, questions: questions.map((q, k) => xoay(q, k + ch)) },
});

// ───────────────────────────── Mục 0 ─────────────────────────────
const m01 = L('mad102-ts-0-1',
  '0.1 — Welcome to MAD102: discrete mathematics for computer science|||0.1 — Giới thiệu MAD102: toán rời rạc cho ngành Khoa học Máy tính',
  'MAD102 học gì, vì sao sinh viên Khoa học Máy tính cần (thuật toán, mật mã, đồ thị, xác suất), 8 chuẩn đầu ra tự soạn, khác MAD101 ở đâu, môn liên quan, cảnh báo: trường chưa công bố syllabus trên FLM.',
  `<span class="eyebrow">MAD102 · Section 0 · Lesson 0.1</span>
<h2>Welcome to Discrete Mathematics for Computer Science</h2>
<p class="lead">Discrete mathematics studies objects that come in separate, countable pieces — truth values, integers, sets, relations, graphs, finite sequences. A computer is exactly such an object: every bit is 0 or 1, every step of a program is one discrete step. This course gives you the language and the proof tools that the rest of computer science is written in.</p>
<div class="callout"><p>⚠️ <strong>Important.</strong> FPT University has <strong>not published the MAD102 syllabus on FLM</strong> (we searched the code, its variants and the course name on 09/11/2026). This course framework is therefore <strong>self-authored</strong>, following the chapter order of the international standard textbooks — Rosen <em>Discrete Mathematics and Its Applications</em> and the MIT text <em>Mathematics for Computer Science</em> (Lehman, Leighton, Meyer). <strong>Grading weights, assessment format and exam dates are decided by your lecturer</strong> — always follow the course outline your lecturer gives in class.</p></div>
<h3>Why does a Computer Science student need it?</h3>
<ul>
<li><strong>Correctness:</strong> logic and proof (induction, loop invariants) are how you show that an algorithm is right for <em>every</em> input, not just the ones you tested.</li>
<li><strong>Efficiency:</strong> counting, recurrences and Big-O tell you how many steps an algorithm takes; the Master theorem explains why merge sort is n log n.</li>
<li><strong>Security:</strong> modular arithmetic, primes and Euler's theorem are the whole of RSA and Diffie–Hellman, which protect every HTTPS connection.</li>
<li><strong>Data and AI:</strong> relations are the theory behind relational databases; graphs model networks, social media, routing and knowledge graphs; discrete probability underlies randomized algorithms, hashing and machine learning.</li>
<li><strong>Compilers and systems:</strong> trees represent expressions and file systems; partial orders schedule builds (topological sort); Boolean logic is how circuits and SAT solvers work.</li>
</ul>
<h3>MAD102 vs MAD101</h3>
<p>FPTU also teaches <strong>MAD101 — Discrete Mathematics</strong> for the Software Engineering programme; its course is already on this site: <a href="https://cuongthai.com/courses/discrete-mathematics" target="_blank" rel="noopener">MAD101 on CuongThai Academy</a>. MAD102 is the Computer Science version: it covers the same core but goes <strong>deeper</strong> into proof technique (strong and structural induction, invariants), relations and orders, cardinality, advanced counting (generating functions, inclusion–exclusion), solving recurrences, number theory for cryptography, and graph/tree algorithms. If a topic here feels too fast, read the matching MAD101 lesson first.</p>
<h3>Learning outcomes (self-authored)</h3>
<p>After this course you should be able to:</p>
<ol>
<li>Translate statements between English/Vietnamese and propositional/predicate logic, test equivalence and validity, and use rules of inference.</li>
<li>Write correct direct, contrapositive, contradiction and case proofs, and proofs by (strong, structural) induction, including loop invariants for programs.</li>
<li>Work with sets, functions, sequences, sums and cardinality; decide whether a function is injective, surjective or bijective; explain why some sets are uncountable.</li>
<li>Classify relations (reflexive, symmetric, antisymmetric, transitive), compute closures, and use equivalence relations and partial orders (Hasse diagrams, topological sort).</li>
<li>Estimate the running time of algorithms with Big-O/Θ/Ω and explain the meaning of P, NP and undecidability.</li>
<li>Apply modular arithmetic, the Euclidean algorithm, modular inverses, the Chinese Remainder Theorem and Fermat/Euler theorems, and explain RSA.</li>
<li>Count with sum/product rules, pigeonhole, permutations/combinations, the binomial theorem, stars and bars, inclusion–exclusion and generating functions; set up and solve linear recurrences and divide-and-conquer recurrences.</li>
<li>Compute discrete probabilities, conditional probabilities and expectations; model problems with graphs and trees and apply BFS/DFS, Euler/Hamilton criteria, Dijkstra, colouring, Huffman coding and minimum spanning trees.</li>
</ol>
<h3>Course map</h3>
<p>Chapter 1 Logic → 2 Proofs and induction → 3 Sets, functions, sums and cardinality → 4 Relations → 5 Algorithms and complexity → 6 Number theory and cryptography → 7 Counting → 8 Recurrences and advanced counting → 9 Discrete probability → 10 Graphs → 11 Trees.</p>
<h3>Related courses at FPTU</h3>
<p>MAD102 sits in <strong>semester 1</strong> and needs only high-school algebra. Its ideas are used directly in <strong>CSD201 — Data Structures and Algorithms</strong> (recursion, complexity, trees, graphs) and in <strong>MAS291 — Statistics and Probability</strong> (counting, discrete probability). Exact prerequisites and follow-up courses are fixed by the curriculum of your intake — check FAP.</p>
<h3>How to study this course</h3>
<ul>
<li>Each lesson has objectives, a lecture, worked examples, common mistakes, a 📌 summary, 🔗 further learning, 🧪 practice with answers; each chapter ends with a quiz.</li>
<li>Discrete maths is learned by <strong>writing proofs and counting by hand</strong>. Do the practice on paper first, then open the answer.</li>
<li>Many lessons include short Python programs. Use them to <em>check</em> answers by brute force on small cases — a computer test is evidence, a proof is certainty.</li>
</ul>`,
  `<span class="eyebrow">MAD102 · Mục 0 · Bài 0.1</span>
<h2>Chào mừng đến với Toán rời rạc cho Khoa học Máy tính</h2>
<p class="lead">Toán rời rạc nghiên cứu những đối tượng gồm các phần tách rời, đếm được — giá trị chân trị, số nguyên, tập hợp, quan hệ, đồ thị, dãy hữu hạn. Máy tính chính là một đối tượng như thế: mỗi bit là 0 hoặc 1, mỗi bước chương trình là một bước rời rạc. Môn này cho bạn ngôn ngữ và công cụ chứng minh mà toàn bộ phần còn lại của khoa học máy tính được viết bằng nó.</p>
<div class="callout"><p>⚠️ <strong>Lưu ý quan trọng.</strong> Trường <strong>chưa công bố syllabus của MAD102 trên FLM</strong> (đã dò mã môn, mã biến thể và tên môn ngày 09/11/2026). Vì vậy khung môn này là <strong>khung tự soạn</strong>, bám thứ tự chương của giáo trình chuẩn quốc tế — Rosen <em>Discrete Mathematics and Its Applications</em> và giáo trình MIT <em>Mathematics for Computer Science</em> (Lehman, Leighton, Meyer). <strong>Cách tính điểm, hình thức đánh giá và lịch thi theo giảng viên</strong> — luôn theo đề cương giảng viên phát trên lớp.</p></div>
<h3>Sinh viên Khoa học Máy tính cần nó để làm gì?</h3>
<ul>
<li><strong>Tính đúng:</strong> logic và chứng minh (quy nạp, bất biến vòng lặp) là cách chứng tỏ thuật toán đúng với <em>mọi</em> đầu vào, không chỉ những đầu vào bạn đã thử.</li>
<li><strong>Hiệu năng:</strong> phép đếm, hệ thức truy hồi và Big-O cho biết thuật toán chạy bao nhiêu bước; định lý Master giải thích vì sao merge sort là n log n.</li>
<li><strong>Bảo mật:</strong> số học đồng dư, số nguyên tố và định lý Euler là toàn bộ nền của RSA và Diffie–Hellman — thứ bảo vệ mọi kết nối HTTPS.</li>
<li><strong>Dữ liệu và AI:</strong> quan hệ là lý thuyết đứng sau cơ sở dữ liệu quan hệ; đồ thị mô hình hoá mạng, mạng xã hội, định tuyến, đồ thị tri thức; xác suất rời rạc là nền của thuật toán ngẫu nhiên, băm và học máy.</li>
<li><strong>Trình biên dịch và hệ thống:</strong> cây biểu diễn biểu thức và hệ thống tệp; thứ tự bộ phận dùng để lập lịch build (sắp xếp tô-pô); logic Boole là cách mạch điện và bộ giải SAT hoạt động.</li>
</ul>
<h3>MAD102 khác MAD101 thế nào</h3>
<p>FPTU còn dạy <strong>MAD101 — Toán rời rạc</strong> cho ngành Kỹ thuật phần mềm; khoá đó đã có trên web: <a href="https://cuongthai.com/courses/discrete-mathematics" target="_blank" rel="noopener">MAD101 trên CuongThai Academy</a>. MAD102 là bản dành cho Khoa học Máy tính: cùng phần lõi nhưng đi <strong>sâu hơn</strong> vào kỹ thuật chứng minh (quy nạp mạnh, quy nạp cấu trúc, bất biến), quan hệ và thứ tự, lực lượng tập hợp, đếm nâng cao (hàm sinh, bao hàm – loại trừ), giải hệ thức truy hồi, lý thuyết số cho mật mã và thuật toán trên đồ thị/cây. Thấy phần nào quá nhanh thì đọc bài MAD101 tương ứng trước.</p>
<h3>Chuẩn đầu ra (tự soạn)</h3>
<p>Học xong môn, bạn cần làm được:</p>
<ol>
<li>Dịch câu tiếng Việt/tiếng Anh sang logic mệnh đề/vị từ và ngược lại, kiểm tra tương đương và tính hợp lệ của suy luận, dùng các quy tắc suy diễn.</li>
<li>Viết đúng chứng minh trực tiếp, phản đảo, phản chứng, chia trường hợp và chứng minh quy nạp (thường, mạnh, cấu trúc), kể cả bất biến vòng lặp cho chương trình.</li>
<li>Làm việc với tập hợp, hàm, dãy, tổng và lực lượng; xác định hàm đơn ánh, toàn ánh, song ánh; giải thích vì sao có tập không đếm được.</li>
<li>Phân loại quan hệ (phản xạ, đối xứng, phản đối xứng, bắc cầu), tính bao đóng, dùng quan hệ tương đương và thứ tự bộ phận (biểu đồ Hasse, sắp xếp tô-pô).</li>
<li>Ước lượng thời gian chạy thuật toán bằng Big-O/Θ/Ω và giải thích ý nghĩa của P, NP và bài toán không quyết định được.</li>
<li>Áp dụng số học đồng dư, thuật toán Euclid, nghịch đảo modulo, định lý số dư Trung Hoa, định lý Fermat/Euler, và giải thích RSA.</li>
<li>Đếm bằng quy tắc cộng/nhân, nguyên lý chuồng bồ câu, hoán vị/tổ hợp, nhị thức Newton, chia kẹo (stars and bars), bao hàm – loại trừ và hàm sinh; lập và giải hệ thức truy hồi tuyến tính và truy hồi chia để trị.</li>
<li>Tính xác suất rời rạc, xác suất có điều kiện và kỳ vọng; mô hình hoá bài toán bằng đồ thị, cây và áp dụng BFS/DFS, điều kiện Euler/Hamilton, Dijkstra, tô màu, mã Huffman, cây khung nhỏ nhất.</li>
</ol>
<h3>Bản đồ môn học</h3>
<p>Chương 1 Logic → 2 Chứng minh và quy nạp → 3 Tập hợp, hàm, tổng và lực lượng → 4 Quan hệ → 5 Thuật toán và độ phức tạp → 6 Lý thuyết số và mật mã → 7 Phép đếm → 8 Truy hồi và đếm nâng cao → 9 Xác suất rời rạc → 10 Đồ thị → 11 Cây.</p>
<h3>Môn liên quan trong khung FPTU</h3>
<p>MAD102 nằm ở <strong>kỳ 1</strong> và chỉ cần đại số phổ thông. Kiến thức của môn được dùng trực tiếp ở <strong>CSD201 — Cấu trúc dữ liệu và giải thuật</strong> (đệ quy, độ phức tạp, cây, đồ thị) và <strong>MAS291 — Xác suất thống kê</strong> (đếm, xác suất rời rạc). Môn tiên quyết và môn học tiếp chính xác do khung chương trình của khoá bạn quy định — kiểm tra trên FAP.</p>
<h3>Học môn này thế nào cho hiệu quả</h3>
<ul>
<li>Mỗi bài có mục tiêu, bài giảng, ví dụ giải từng bước, lỗi hay gặp, 📌 tóm tắt, 🔗 học thêm, 🧪 tự luyện có đáp án; cuối mỗi chương có quiz.</li>
<li>Toán rời rạc học bằng cách <strong>tự viết chứng minh và tự đếm bằng tay</strong>. Làm bài tự luyện ra giấy trước rồi mới mở đáp án.</li>
<li>Nhiều bài có chương trình Python ngắn. Dùng chúng để <em>kiểm</em> đáp án bằng vét cạn trên trường hợp nhỏ — máy tính thử là bằng chứng, chứng minh mới là chắc chắn.</li>
</ul>`);

const m02 = L('mad102-ts-0-2',
  '0.2 — Textbooks & learning resources (verified)|||0.2 — Giáo trình & tài liệu học (đã kiểm)',
  'Giáo trình chuẩn kèm ISBN đã kiểm (Rosen 8e, Epp 5e, Hammack Book of Proof 3e), sách mở MIT Mathematics for Computer Science và Levin, khoá mở MIT OCW 6.042J/6.1200J, Coursera UCSD; bảng đối chiếu chương.',
  `<span class="eyebrow">MAD102 · Section 0 · Lesson 0.2</span>
<h2>Textbooks &amp; learning resources</h2>
<p class="lead">This course follows the chapter order of the standard textbooks below. You do <strong>not</strong> need to buy anything: two excellent full textbooks are free and legal online, and every lesson links to the matching section.</p>
<h3>📘 Main textbooks</h3>
<ol>
<li><strong>Kenneth H. Rosen — <em>Discrete Mathematics and Its Applications</em>, 8th edition.</strong> McGraw-Hill Education, 2018 (published 3 September 2018, © 2019). ISBN 978-1-259-67651-2. The most widely used discrete-maths textbook; our chapter order follows its chapters 1–11 (logic, structures, algorithms, number theory, induction, counting, probability, advanced counting, relations, graphs, trees).</li>
<li><strong>Eric Lehman, F. Thomson Leighton, Albert R. Meyer — <em>Mathematics for Computer Science</em>.</strong> MIT, revised 6 June 2018, Creative Commons BY-SA 3.0. <a href="https://courses.csail.mit.edu/6.042/spring18/mcs.pdf" target="_blank" rel="noopener">Free PDF (MIT CSAIL, 13 MB)</a>. The text of MIT course 6.042J; stronger on proofs, well-ordering, state machines, generating functions and probability. Printed reprints exist from several publishers with different ISBNs, so we cite the free MIT edition.</li>
<li><strong>Susanna S. Epp — <em>Discrete Mathematics with Applications</em>, 5th edition.</strong> Cengage Learning, © 2020. ISBN 978-1-337-69419-3. <a href="https://cengage.com/c/discrete-mathematics-with-applications-5e-epp/9781337694193" target="_blank" rel="noopener">Publisher page</a>. The gentlest introduction to logic and proof writing — read it if proofs feel hard.</li>
<li><strong>Richard Hammack — <em>Book of Proof</em>, 3rd edition.</strong> 2018 (edition 3.4, 2025). ISBN 978-0-9894721-2-8 (paperback). <a href="https://richardhammack.github.io/BookOfProof/" target="_blank" rel="noopener">Free PDF from the author</a>. A short, clear book devoted to sets, logic and every proof technique in Chapters 1–4 of this course.</li>
<li><strong>Oscar Levin — <em>Discrete Mathematics: An Open Introduction</em>, 4th edition.</strong> Free online textbook. <a href="https://discrete.openmathbooks.org/dmoi4/dmoi4.html" target="_blank" rel="noopener">Read online</a>. Very readable chapters on counting, sequences, graphs and generating functions, with hints and solutions.</li>
</ol>
<h3>🎓 Open courses</h3>
<ul>
<li><a href="https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/" target="_blank" rel="noopener">MIT OpenCourseWare 6.042J — Mathematics for Computer Science (Spring 2015)</a>: notes, problem sets with solutions, exams.</li>
<li><a href="https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/video_galleries/video-lectures/" target="_blank" rel="noopener">MIT OCW 6.042J (Fall 2010) — full video lectures (Tom Leighton, Marten van Dijk)</a>.</li>
<li><a href="https://ocw.mit.edu/courses/6-1200j-mathematics-for-computer-science-spring-2024/" target="_blank" rel="noopener">MIT OCW 6.1200J — Mathematics for Computer Science (Spring 2024)</a>: the newest version of the course.</li>
<li><a href="https://www.coursera.org/specializations/discrete-mathematics" target="_blank" rel="noopener">Coursera — Introduction to Discrete Mathematics for Computer Science (UC San Diego)</a>, starting with <a href="https://www.coursera.org/learn/what-is-a-proof" target="_blank" rel="noopener">Mathematical Thinking in Computer Science</a>.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://docs.python.org/3/library/itertools.html" target="_blank" rel="noopener">Python itertools</a> and <a href="https://docs.python.org/3/library/math.html" target="_blank" rel="noopener">math</a> (<code>product</code>, <code>permutations</code>, <code>combinations</code>, <code>comb</code>, <code>gcd</code>) — brute-force checks for counting and logic.</li>
<li><a href="https://visualgo.net/en/dfsbfs" target="_blank" rel="noopener">VisuAlgo</a> — animations of BFS/DFS, shortest paths, spanning trees.</li>
<li><a href="https://cp-algorithms.com/algebra/extended-euclid-algorithm.html" target="_blank" rel="noopener">cp-algorithms.com</a> — clean implementations of number-theory and graph algorithms.</li>
</ul>
<h3>🗺️ Chapter mapping</h3>
<ul>
<li>Ch. 1 Logic — Rosen 1.1–1.6 · MCS ch. 3</li>
<li>Ch. 2 Proofs and induction — Rosen 1.7–1.8, 5.1–5.5 · MCS ch. 1, 2, 5, 6, 7</li>
<li>Ch. 3 Sets, functions, sums, cardinality — Rosen 2.1–2.5 · MCS ch. 4, 8, 14</li>
<li>Ch. 4 Relations — Rosen ch. 9 · MCS ch. 10</li>
<li>Ch. 5 Algorithms and complexity — Rosen ch. 3 · MCS ch. 14</li>
<li>Ch. 6 Number theory and cryptography — Rosen ch. 4 · MCS ch. 9</li>
<li>Ch. 7 Counting — Rosen ch. 6 · MCS ch. 15</li>
<li>Ch. 8 Recurrences and advanced counting — Rosen ch. 8 · MCS ch. 16, 22</li>
<li>Ch. 9 Discrete probability — Rosen ch. 7 · MCS ch. 17–20</li>
<li>Ch. 10 Graphs — Rosen ch. 10 · MCS ch. 12, 13</li>
<li>Ch. 11 Trees — Rosen ch. 11 · MCS ch. 12</li>
</ul>
<div class="meo"><p><strong>Study plan.</strong> For each lesson: read the lesson here → read the matching textbook section → do 5–10 exercises from the book → do the 🧪 practice → take the chapter quiz. Budget about 8 hours per chapter.</p></div>`,
  `<span class="eyebrow">MAD102 · Mục 0 · Bài 0.2</span>
<h2>Giáo trình &amp; tài liệu học</h2>
<p class="lead">Khoá này bám thứ tự chương của các giáo trình chuẩn dưới đây. Bạn <strong>không</strong> cần mua sách: có hai giáo trình đầy đủ, miễn phí, hợp pháp trên mạng, và mỗi bài đều dẫn tới đúng mục tương ứng.</p>
<h3>📘 Giáo trình chính</h3>
<ol>
<li><strong>Kenneth H. Rosen — <em>Discrete Mathematics and Its Applications</em>, tái bản lần 8.</strong> McGraw-Hill Education, 2018 (phát hành 03/09/2018, © 2019). ISBN 978-1-259-67651-2. Giáo trình toán rời rạc phổ biến nhất; thứ tự chương của khoá theo các chương 1–11 của sách (logic, cấu trúc, thuật toán, lý thuyết số, quy nạp, đếm, xác suất, đếm nâng cao, quan hệ, đồ thị, cây).</li>
<li><strong>Eric Lehman, F. Thomson Leighton, Albert R. Meyer — <em>Mathematics for Computer Science</em>.</strong> MIT, bản sửa 06/06/2018, giấy phép Creative Commons BY-SA 3.0. <a href="https://courses.csail.mit.edu/6.042/spring18/mcs.pdf" target="_blank" rel="noopener">PDF miễn phí (MIT CSAIL, 13 MB)</a>. Giáo trình của môn MIT 6.042J; mạnh hơn về chứng minh, nguyên lý sắp thứ tự tốt, máy trạng thái, hàm sinh và xác suất. Bản in lại có ở nhiều nhà xuất bản với ISBN khác nhau, nên khoá trích bản MIT miễn phí.</li>
<li><strong>Susanna S. Epp — <em>Discrete Mathematics with Applications</em>, tái bản lần 5.</strong> Cengage Learning, © 2020. ISBN 978-1-337-69419-3. <a href="https://cengage.com/c/discrete-mathematics-with-applications-5e-epp/9781337694193" target="_blank" rel="noopener">Trang nhà xuất bản</a>. Cách vào logic và viết chứng minh nhẹ nhàng nhất — đọc nếu thấy chứng minh khó.</li>
<li><strong>Richard Hammack — <em>Book of Proof</em>, tái bản lần 3.</strong> 2018 (bản 3.4, 2025). ISBN 978-0-9894721-2-8 (bìa mềm). <a href="https://richardhammack.github.io/BookOfProof/" target="_blank" rel="noopener">PDF miễn phí từ tác giả</a>. Sách ngắn, rõ, chuyên về tập hợp, logic và mọi kỹ thuật chứng minh của Chương 1–4 trong khoá.</li>
<li><strong>Oscar Levin — <em>Discrete Mathematics: An Open Introduction</em>, tái bản lần 4.</strong> Sách mở miễn phí. <a href="https://discrete.openmathbooks.org/dmoi4/dmoi4.html" target="_blank" rel="noopener">Đọc trực tuyến</a>. Các chương về đếm, dãy, đồ thị, hàm sinh rất dễ đọc, có gợi ý và lời giải.</li>
</ol>
<h3>🎓 Khoá học mở</h3>
<ul>
<li><a href="https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/" target="_blank" rel="noopener">MIT OpenCourseWare 6.042J — Mathematics for Computer Science (Xuân 2015)</a>: ghi chú, bài tập có lời giải, đề thi.</li>
<li><a href="https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/video_galleries/video-lectures/" target="_blank" rel="noopener">MIT OCW 6.042J (Thu 2010) — trọn bộ video bài giảng (Tom Leighton, Marten van Dijk)</a>.</li>
<li><a href="https://ocw.mit.edu/courses/6-1200j-mathematics-for-computer-science-spring-2024/" target="_blank" rel="noopener">MIT OCW 6.1200J — Mathematics for Computer Science (Xuân 2024)</a>: phiên bản mới nhất của môn.</li>
<li><a href="https://www.coursera.org/specializations/discrete-mathematics" target="_blank" rel="noopener">Coursera — Introduction to Discrete Mathematics for Computer Science (UC San Diego)</a>, bắt đầu bằng <a href="https://www.coursera.org/learn/what-is-a-proof" target="_blank" rel="noopener">Mathematical Thinking in Computer Science</a>.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://docs.python.org/3/library/itertools.html" target="_blank" rel="noopener">Python itertools</a> và <a href="https://docs.python.org/3/library/math.html" target="_blank" rel="noopener">math</a> (<code>product</code>, <code>permutations</code>, <code>combinations</code>, <code>comb</code>, <code>gcd</code>) — kiểm vét cạn cho bài đếm và logic.</li>
<li><a href="https://visualgo.net/en/dfsbfs" target="_blank" rel="noopener">VisuAlgo</a> — hoạt hình BFS/DFS, đường đi ngắn nhất, cây khung.</li>
<li><a href="https://cp-algorithms.com/algebra/extended-euclid-algorithm.html" target="_blank" rel="noopener">cp-algorithms.com</a> — cài đặt gọn gàng các thuật toán lý thuyết số và đồ thị.</li>
</ul>
<h3>🗺️ Đối chiếu chương</h3>
<ul>
<li>Ch. 1 Logic — Rosen 1.1–1.6 · MCS ch. 3</li>
<li>Ch. 2 Chứng minh và quy nạp — Rosen 1.7–1.8, 5.1–5.5 · MCS ch. 1, 2, 5, 6, 7</li>
<li>Ch. 3 Tập hợp, hàm, tổng, lực lượng — Rosen 2.1–2.5 · MCS ch. 4, 8, 14</li>
<li>Ch. 4 Quan hệ — Rosen ch. 9 · MCS ch. 10</li>
<li>Ch. 5 Thuật toán và độ phức tạp — Rosen ch. 3 · MCS ch. 14</li>
<li>Ch. 6 Lý thuyết số và mật mã — Rosen ch. 4 · MCS ch. 9</li>
<li>Ch. 7 Phép đếm — Rosen ch. 6 · MCS ch. 15</li>
<li>Ch. 8 Truy hồi và đếm nâng cao — Rosen ch. 8 · MCS ch. 16, 22</li>
<li>Ch. 9 Xác suất rời rạc — Rosen ch. 7 · MCS ch. 17–20</li>
<li>Ch. 10 Đồ thị — Rosen ch. 10 · MCS ch. 12, 13</li>
<li>Ch. 11 Cây — Rosen ch. 11 · MCS ch. 12</li>
</ul>
<div class="meo"><p><strong>Kế hoạch học.</strong> Mỗi bài: đọc bài ở đây → đọc mục tương ứng trong sách → làm 5–10 bài tập trong sách → làm 🧪 tự luyện → làm quiz chương. Dành khoảng 8 giờ cho mỗi chương.</p></div>`);

const muc0 = {
  title: 'Section 0 — Course framework (self-authored, no FLM syllabus)|||Mục 0 — Khung môn học (tự soạn, trường chưa công bố syllabus)',
  description: 'Giới thiệu MAD102, chuẩn đầu ra tự soạn, khác MAD101 ở đâu, giáo trình chuẩn kèm ISBN và tài liệu mở. Trường chưa công bố syllabus MAD102 trên FLM — điểm/lịch thi theo giảng viên.',
  lessons: [m01, m02],
};

// ───────────────────────────── Chương 1 — Logic ─────────────────────────────
const c11 = L('mad102-ts-1-1',
  '1.1 — Propositions, connectives and truth tables|||1.1 — Mệnh đề, phép nối và bảng chân trị',
  'Mệnh đề, 5 phép nối (¬ ∧ ∨ → ↔), bảng chân trị, kéo theo và các dạng đảo/nghịch/phản đảo, hằng đúng; sinh bảng chân trị bằng Python.',
  `<span class="eyebrow">MAD102 · Chapter 1 · Lesson 1.1</span>
<h2>Propositions, connectives and truth tables</h2>
<p class="lead">Logic is the grammar of mathematics and of programs. Every <code>if</code>, every database filter and every specification is a logical formula; this lesson gives you the five building blocks and a mechanical way to evaluate any formula.</p>
<h3>🎯 Objectives</h3>
<ul><li>Recognise propositions and build compound propositions with ¬, ∧, ∨, →, ↔.</li><li>Build a truth table for any formula and decide whether it is a tautology, contradiction or contingency.</li><li>Form the converse, inverse and contrapositive of an implication and know which are equivalent.</li></ul>
<h3>📖 Lecture</h3>
<p>A <strong>proposition</strong> is a declarative sentence that is either true (T) or false (F), but not both. “7 is prime” and “2 + 2 = 5” are propositions; “x + 1 = 3” is not (its truth depends on x) and “Close the door!” is not (it is not declarative). We name propositions with variables p, q, r, …</p>
<p>Five <strong>connectives</strong> build compound propositions:</p>
<ul>
<li><strong>Negation</strong> ¬p — true exactly when p is false.</li>
<li><strong>Conjunction</strong> p ∧ q — true only when both are true.</li>
<li><strong>Disjunction</strong> p ∨ q — true when at least one is true (inclusive or). Exclusive or p ⊕ q is true when exactly one is true.</li>
<li><strong>Implication</strong> p → q (“if p then q”, “p only if q”, “q is necessary for p”) — false <em>only</em> when p is true and q is false.</li>
<li><strong>Biconditional</strong> p ↔ q (“p if and only if q”) — true when p and q have the same value.</li>
</ul>
<div class="formula"><span class="lbl">Implication truth table</span>p = T, q = T → T  ·  p = T, q = F → <b>F</b>  ·  p = F, q = T → T  ·  p = F, q = F → T</div>
<p>The last two rows surprise students: an implication with a false hypothesis is <em>vacuously true</em>. “If 2 + 2 = 5 then I am the Pope” is true. This is exactly how a program behaves: a guarded statement <code>if (p) assert(q)</code> never fails when p is false.</p>
<p>From p → q we build three relatives: the <strong>converse</strong> q → p, the <strong>inverse</strong> ¬p → ¬q, and the <strong>contrapositive</strong> ¬q → ¬p. Only the contrapositive is equivalent to the original; the converse and inverse are equivalent to each other.</p>
<p>A formula with n variables has a truth table with <strong>2<sup>n</sup> rows</strong>. A formula true in every row is a <strong>tautology</strong>, false in every row a <strong>contradiction</strong>, otherwise a <strong>contingency</strong>. Precedence: ¬ first, then ∧, then ∨, then →, then ↔; use parentheses when in doubt.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — translation.</b> “You can access the server only if you are an admin or you are not a guest.” Let a = “you can access”, d = “you are an admin”, g = “you are a guest”. “Only if” introduces the <em>conclusion</em>: a → (d ∨ ¬g).</p></div>
<div class="callout"><p><b>Example 2 — contrapositive.</b> “If n is divisible by 6, then n is even.” Contrapositive: “If n is odd, then n is not divisible by 6” (true). Converse: “If n is even, then n is divisible by 6” (false: n = 4).</p></div>
<div class="callout"><p><b>Example 3 — tautology by table.</b> Hypothetical syllogism ((p → q) ∧ (q → r)) → (p → r) has 3 variables, so 8 rows. The program below checks every row.</p></div>
<pre><code class="language-python">from itertools import product

def implies(a, b):
    return (not a) or b

print(" p     q     r     | (p-&gt;q) and (q-&gt;r) -&gt; (p-&gt;r)")
all_true = True
for p, q, r in product([True, False], repeat=3):
    v = implies(implies(p, q) and implies(q, r), implies(p, r))
    all_true = all_true and v
    print(f"{p!s:5} {q!s:5} {r!s:5} | {v}")
print("Tautology:", all_true)</code></pre>
<div class="out"> p     q     r     | (p-&gt;q) and (q-&gt;r) -&gt; (p-&gt;r)
True  True  True  | True
True  True  False | True
True  False True  | True
True  False False | True
False True  True  | True
False True  False | True
False False True  | True
False False False | True
Tautology: True</div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Reading “p only if q” as q → p. It is p → q.</li><li>Thinking p → q is false when p is false. It is true (vacuously).</li><li>Confusing the converse with the contrapositive — only the contrapositive keeps the meaning.</li><li>Treating “or” in English as exclusive when the problem means inclusive.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>A proposition is true or false; connectives combine them.</li><li>p → q is false only in the row p = T, q = F.</li><li>p → q ≡ ¬q → ¬p; converse ≡ inverse, but neither equals the original.</li><li>n variables ⇒ 2<sup>n</sup> rows; tautology = true in every row.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_logic-statements.html" target="_blank" rel="noopener">Levin, DMOI 1.1 — Mathematical Statements</a></li><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_logic-implications.html" target="_blank" rel="noopener">Levin, DMOI 1.2 — Implications</a></li><li><a href="https://brilliant.org/wiki/truth-tables/" target="_blank" rel="noopener">Brilliant — Truth Tables</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>How many rows does the truth table of (p ∨ q) → (r ∧ s ∧ t) have?</li><li>Write the contrapositive and the converse of “If the input is sorted, binary search returns the correct index.”</li><li>Is (p → q) ∨ (q → p) a tautology?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 5 variables ⇒ 2<sup>5</sup> = 32 rows. 2) Contrapositive: “If binary search does not return the correct index, the input is not sorted.” Converse: “If binary search returns the correct index, the input is sorted” (not implied). 3) Yes: if q is true the first part is true; if q is false the second part is true.</p></div>`,
  `<span class="eyebrow">MAD102 · Chương 1 · Bài 1.1</span>
<h2>Mệnh đề, phép nối và bảng chân trị</h2>
<p class="lead">Logic là ngữ pháp của toán học và của chương trình. Mỗi câu <code>if</code>, mỗi điều kiện lọc trong cơ sở dữ liệu, mỗi đặc tả đều là một công thức logic; bài này cho bạn năm viên gạch cơ bản và một cách máy móc để tính giá trị bất kỳ công thức nào.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Nhận ra mệnh đề và lập mệnh đề phức hợp bằng ¬, ∧, ∨, →, ↔.</li><li>Lập bảng chân trị cho mọi công thức và xác định đó là hằng đúng, mâu thuẫn hay tiếp liên.</li><li>Lập mệnh đề đảo, nghịch, phản đảo của một phép kéo theo và biết cái nào tương đương.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Mệnh đề</strong> là câu khẳng định hoặc đúng (T) hoặc sai (F), không thể cả hai. “7 là số nguyên tố” và “2 + 2 = 5” là mệnh đề; “x + 1 = 3” thì không (đúng sai phụ thuộc x), “Đóng cửa lại!” cũng không (không phải câu khẳng định). Ta đặt tên mệnh đề bằng biến p, q, r, …</p>
<p>Năm <strong>phép nối</strong> tạo mệnh đề phức hợp:</p>
<ul>
<li><strong>Phủ định</strong> ¬p — đúng đúng khi p sai.</li>
<li><strong>Hội</strong> p ∧ q — chỉ đúng khi cả hai đúng.</li>
<li><strong>Tuyển</strong> p ∨ q — đúng khi ít nhất một đúng (hoặc bao hàm). Hoặc loại trừ p ⊕ q đúng khi đúng một trong hai đúng.</li>
<li><strong>Kéo theo</strong> p → q (“nếu p thì q”, “p chỉ khi q”, “q là điều kiện cần của p”) — sai <em>duy nhất</em> khi p đúng mà q sai.</li>
<li><strong>Tương đương</strong> p ↔ q (“p khi và chỉ khi q”) — đúng khi p và q cùng giá trị.</li>
</ul>
<div class="formula"><span class="lbl">Bảng chân trị phép kéo theo</span>p = T, q = T → T  ·  p = T, q = F → <b>F</b>  ·  p = F, q = T → T  ·  p = F, q = F → T</div>
<p>Hai dòng cuối hay làm sinh viên bất ngờ: phép kéo theo có giả thiết sai thì <em>đúng một cách hiển nhiên</em>. “Nếu 2 + 2 = 5 thì tôi là Giáo hoàng” là mệnh đề đúng. Chương trình cũng hành xử y như vậy: câu lệnh có điều kiện <code>if (p) assert(q)</code> không bao giờ lỗi khi p sai.</p>
<p>Từ p → q ta có ba “họ hàng”: <strong>mệnh đề đảo</strong> q → p, <strong>mệnh đề nghịch</strong> ¬p → ¬q và <strong>mệnh đề phản đảo</strong> ¬q → ¬p. Chỉ phản đảo tương đương với mệnh đề gốc; đảo và nghịch tương đương với nhau.</p>
<p>Công thức có n biến thì bảng chân trị có <strong>2<sup>n</sup> dòng</strong>. Công thức đúng ở mọi dòng là <strong>hằng đúng</strong>, sai ở mọi dòng là <strong>mâu thuẫn</strong>, còn lại là <strong>tiếp liên</strong>. Thứ tự ưu tiên: ¬ trước, rồi ∧, rồi ∨, rồi →, rồi ↔; nghi ngờ thì dùng ngoặc.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — dịch câu.</b> “Bạn truy cập được máy chủ chỉ khi bạn là admin hoặc bạn không phải khách.” Đặt a = “truy cập được”, d = “là admin”, g = “là khách”. “Chỉ khi” dẫn ra <em>kết luận</em>: a → (d ∨ ¬g).</p></div>
<div class="callout"><p><b>Ví dụ 2 — phản đảo.</b> “Nếu n chia hết cho 6 thì n chẵn.” Phản đảo: “Nếu n lẻ thì n không chia hết cho 6” (đúng). Đảo: “Nếu n chẵn thì n chia hết cho 6” (sai: n = 4).</p></div>
<div class="callout"><p><b>Ví dụ 3 — hằng đúng bằng bảng.</b> Tam đoạn luận giả định ((p → q) ∧ (q → r)) → (p → r) có 3 biến nên 8 dòng. Chương trình dưới kiểm từng dòng.</p></div>
<pre><code class="language-python">from itertools import product

def implies(a, b):
    return (not a) or b

print(" p     q     r     | (p-&gt;q) and (q-&gt;r) -&gt; (p-&gt;r)")
all_true = True
for p, q, r in product([True, False], repeat=3):
    v = implies(implies(p, q) and implies(q, r), implies(p, r))
    all_true = all_true and v
    print(f"{p!s:5} {q!s:5} {r!s:5} | {v}")
print("Tautology:", all_true)</code></pre>
<div class="out"> p     q     r     | (p-&gt;q) and (q-&gt;r) -&gt; (p-&gt;r)
True  True  True  | True
True  True  False | True
True  False True  | True
True  False False | True
False True  True  | True
False True  False | True
False False True  | True
False False False | True
Tautology: True</div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Đọc “p chỉ khi q” thành q → p. Đúng là p → q.</li><li>Nghĩ p → q sai khi p sai. Nó đúng (hiển nhiên).</li><li>Nhầm mệnh đề đảo với phản đảo — chỉ phản đảo giữ nguyên nghĩa.</li><li>Hiểu chữ “hoặc” là loại trừ trong khi đề bài dùng nghĩa bao hàm.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Mệnh đề là đúng hoặc sai; phép nối ghép chúng lại.</li><li>p → q chỉ sai ở dòng p = T, q = F.</li><li>p → q ≡ ¬q → ¬p; đảo ≡ nghịch, nhưng không cái nào bằng mệnh đề gốc.</li><li>n biến ⇒ 2<sup>n</sup> dòng; hằng đúng = đúng ở mọi dòng.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_logic-statements.html" target="_blank" rel="noopener">Levin, DMOI 1.1 — Mathematical Statements</a></li><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_logic-implications.html" target="_blank" rel="noopener">Levin, DMOI 1.2 — Implications</a></li><li><a href="https://brilliant.org/wiki/truth-tables/" target="_blank" rel="noopener">Brilliant — Truth Tables</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Bảng chân trị của (p ∨ q) → (r ∧ s ∧ t) có bao nhiêu dòng?</li><li>Viết mệnh đề phản đảo và mệnh đề đảo của “Nếu đầu vào đã sắp xếp thì tìm kiếm nhị phân trả về đúng chỉ số.”</li><li>(p → q) ∨ (q → p) có phải hằng đúng không?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 5 biến ⇒ 2<sup>5</sup> = 32 dòng. 2) Phản đảo: “Nếu tìm kiếm nhị phân không trả về đúng chỉ số thì đầu vào chưa sắp xếp.” Đảo: “Nếu tìm kiếm nhị phân trả về đúng chỉ số thì đầu vào đã sắp xếp” (không suy ra được). 3) Có: nếu q đúng thì vế đầu đúng; nếu q sai thì vế sau đúng.</p></div>`);

const c12 = L('mad102-ts-1-2',
  '1.2 — Logical equivalences, normal forms and satisfiability|||1.2 — Tương đương logic, dạng chuẩn và bài toán thoả được',
  'Các luật tương đương (De Morgan, phân phối, hấp thụ, p → q ≡ ¬p ∨ q), chứng minh tương đương bằng biến đổi, dạng chuẩn tuyển/hội (DNF/CNF), bài toán SAT và kiểm bằng vét cạn.',
  `<span class="eyebrow">MAD102 · Chapter 1 · Lesson 1.2</span>
<h2>Logical equivalences, normal forms and satisfiability</h2>
<p class="lead">Two formulas are <strong>logically equivalent</strong> (A ≡ B) when A ↔ B is a tautology — they agree in every row. Equivalence laws let you simplify conditions in code, and normal forms are the input format of SAT solvers that verify hardware and schedule software.</p>
<h3>🎯 Objectives</h3>
<ul><li>Use the standard equivalence laws to transform formulas step by step.</li><li>Convert a formula to disjunctive normal form (DNF) and conjunctive normal form (CNF).</li><li>Explain the satisfiability problem and why brute force costs 2<sup>n</sup>.</li></ul>
<h3>📖 Lecture</h3>
<p>The most-used laws (each can be checked with a truth table):</p>
<div class="formula"><span class="lbl">Key equivalences</span>De Morgan: ¬(p ∧ q) ≡ ¬p ∨ ¬q,  ¬(p ∨ q) ≡ ¬p ∧ ¬q<br>Implication: p → q ≡ ¬p ∨ q<br>Distributive: p ∧ (q ∨ r) ≡ (p ∧ q) ∨ (p ∧ r),  p ∨ (q ∧ r) ≡ (p ∨ q) ∧ (p ∨ r)<br>Absorption: p ∨ (p ∧ q) ≡ p,  p ∧ (p ∨ q) ≡ p<br>Double negation ¬¬p ≡ p · Identity p ∧ T ≡ p · Domination p ∨ T ≡ T · Negation p ∧ ¬p ≡ F</div>
<p>To prove A ≡ B without a table, transform A into B with a chain of laws, naming the law at each step. This is shorter than a table when there are many variables and it shows <em>why</em> the equivalence holds.</p>
<p>A <strong>literal</strong> is a variable or its negation. A formula is in <strong>DNF</strong> if it is an OR of ANDs of literals, and in <strong>CNF</strong> if it is an AND of ORs of literals (each OR is a <em>clause</em>). Every formula has both forms. To read DNF off a truth table, take one AND-term for every row where the formula is true. For CNF, take one clause for every row where the formula is false (the clause says “not this row”).</p>
<p>A formula is <strong>satisfiable</strong> if some assignment makes it true. Deciding satisfiability of a CNF formula (SAT) is the first problem proved NP-complete (Cook–Levin). Brute force tries all 2<sup>n</sup> assignments — fine for n = 20, hopeless for n = 300 — yet modern SAT solvers routinely handle industrial instances with millions of clauses by clever search.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1.</b> Show ¬(p ∨ (¬p ∧ q)) ≡ ¬p ∧ ¬q.<br>¬(p ∨ (¬p ∧ q)) ≡ ¬p ∧ ¬(¬p ∧ q) (De Morgan) ≡ ¬p ∧ (p ∨ ¬q) (De Morgan, double negation) ≡ (¬p ∧ p) ∨ (¬p ∧ ¬q) (distributive) ≡ F ∨ (¬p ∧ ¬q) (negation law) ≡ ¬p ∧ ¬q (identity).</p></div>
<div class="callout"><p><b>Example 2 — DNF from a table.</b> p ⊕ q is true in rows (p, q) = (T, F) and (F, T), so DNF = (p ∧ ¬q) ∨ (¬p ∧ q). It is false in rows (T, T) and (F, F), so CNF = (¬p ∨ ¬q) ∧ (p ∨ q).</p></div>
<div class="callout"><p><b>Example 3 — code simplification.</b> <code>if not (x &gt; 0 and y &gt; 0)</code> is the same as <code>if x &lt;= 0 or y &lt;= 0</code> by De Morgan.</p></div>
<pre><code class="language-python">from itertools import product

def equivalent(f, g, n):
    """True if formulas f and g (functions of n booleans) agree on all 2**n rows."""
    return all(f(*row) == g(*row) for row in product([False, True], repeat=n))

lhs = lambda p, q: not (p or ((not p) and q))
rhs = lambda p, q: (not p) and (not q)
print("not(p or (not p and q)) == not p and not q :", equivalent(lhs, rhs, 2))

# a common mistake: "not (p and q)" is NOT "not p and not q"
print("not(p and q) == not p and not q :",
      equivalent(lambda p, q: not (p and q), lambda p, q: (not p) and (not q), 2))

# brute-force SAT for a small CNF formula
cnf = lambda p, q, r: (p or q) and ((not p) or r) and ((not q) or (not r)) and ((not r) or p)
sols = [row for row in product([False, True], repeat=3) if cnf(*row)]
print("satisfying assignments (p,q,r):", sols)</code></pre>
<div class="out">not(p or (not p and q)) == not p and not q : True
not(p and q) == not p and not q : False
satisfying assignments (p,q,r): [(False, True, False), (True, False, True)]</div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Negating ¬(p ∧ q) as ¬p ∧ ¬q — the program above shows it is wrong.</li><li>Writing ¬(p → q) ≡ ¬p → ¬q. Correct: ¬(p → q) ≡ p ∧ ¬q.</li><li>Distributing ∧ over ∧ or ∨ over ∨ (that is associativity, not distribution).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>A ≡ B means A ↔ B is a tautology.</li><li>Prove equivalences by a chain of named laws.</li><li>DNF = OR of AND-terms (true rows); CNF = AND of clauses (false rows).</li><li>SAT is NP-complete; brute force checks 2<sup>n</sup> assignments.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_logic-rules.html" target="_blank" rel="noopener">Levin, DMOI 1.3 — Rules of Logic</a></li><li><a href="https://brilliant.org/wiki/de-morgans-laws/" target="_blank" rel="noopener">Brilliant — De Morgan's Laws</a></li><li><a href="https://en.wikipedia.org/wiki/Boolean_satisfiability_problem" target="_blank" rel="noopener">Wikipedia — Boolean satisfiability problem</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Simplify ¬(p → q) ∨ q.</li><li>Give the DNF of the formula that is true exactly when at least two of p, q, r are true.</li><li>Is (p ∨ q) ∧ (¬p ∨ q) ∧ (¬q) satisfiable?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) ¬(p → q) ≡ p ∧ ¬q, so (p ∧ ¬q) ∨ q ≡ (p ∨ q) ∧ (¬q ∨ q) ≡ p ∨ q. 2) (p ∧ q) ∨ (p ∧ r) ∨ (q ∧ r) (the majority function). 3) No: ¬q forces q = F, then the first two clauses need p and ¬p.</p></div>`,
  `<span class="eyebrow">MAD102 · Chương 1 · Bài 1.2</span>
<h2>Tương đương logic, dạng chuẩn và bài toán thoả được</h2>
<p class="lead">Hai công thức <strong>tương đương logic</strong> (A ≡ B) khi A ↔ B là hằng đúng — chúng trùng nhau ở mọi dòng. Các luật tương đương giúp rút gọn điều kiện trong code, còn dạng chuẩn là định dạng đầu vào của bộ giải SAT dùng để kiểm chứng phần cứng và lập lịch phần mềm.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Dùng các luật tương đương chuẩn để biến đổi công thức từng bước.</li><li>Chuyển công thức sang dạng chuẩn tuyển (DNF) và dạng chuẩn hội (CNF).</li><li>Giải thích bài toán thoả được (SAT) và vì sao vét cạn tốn 2<sup>n</sup>.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Các luật dùng nhiều nhất (mỗi luật đều kiểm được bằng bảng chân trị):</p>
<div class="formula"><span class="lbl">Các tương đương chính</span>De Morgan: ¬(p ∧ q) ≡ ¬p ∨ ¬q,  ¬(p ∨ q) ≡ ¬p ∧ ¬q<br>Kéo theo: p → q ≡ ¬p ∨ q<br>Phân phối: p ∧ (q ∨ r) ≡ (p ∧ q) ∨ (p ∧ r),  p ∨ (q ∧ r) ≡ (p ∨ q) ∧ (p ∨ r)<br>Hấp thụ: p ∨ (p ∧ q) ≡ p,  p ∧ (p ∨ q) ≡ p<br>Phủ định kép ¬¬p ≡ p · Đồng nhất p ∧ T ≡ p · Thống trị p ∨ T ≡ T · Phủ định p ∧ ¬p ≡ F</div>
<p>Muốn chứng minh A ≡ B mà không lập bảng, ta biến đổi A thành B bằng một chuỗi luật, ghi tên luật ở mỗi bước. Cách này ngắn hơn bảng khi có nhiều biến và cho thấy <em>vì sao</em> hai công thức tương đương.</p>
<p><strong>Literal</strong> là một biến hoặc phủ định của nó. Công thức ở <strong>DNF</strong> nếu là tuyển (OR) của các hội (AND) literal, ở <strong>CNF</strong> nếu là hội của các tuyển literal (mỗi tuyển gọi là một <em>mệnh đề con – clause</em>). Mọi công thức đều có cả hai dạng. Đọc DNF từ bảng chân trị: mỗi dòng công thức đúng cho một hạng tử AND. Đọc CNF: mỗi dòng công thức sai cho một clause (clause nói “không phải dòng này”).</p>
<p>Công thức <strong>thoả được</strong> nếu có một phép gán làm nó đúng. Quyết định tính thoả được của công thức CNF (SAT) là bài toán đầu tiên được chứng minh NP-đầy đủ (Cook–Levin). Vét cạn thử cả 2<sup>n</sup> phép gán — ổn với n = 20, vô vọng với n = 300 — nhưng bộ giải SAT hiện đại vẫn xử lý được bài công nghiệp hàng triệu clause nhờ tìm kiếm thông minh.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1.</b> Chứng minh ¬(p ∨ (¬p ∧ q)) ≡ ¬p ∧ ¬q.<br>¬(p ∨ (¬p ∧ q)) ≡ ¬p ∧ ¬(¬p ∧ q) (De Morgan) ≡ ¬p ∧ (p ∨ ¬q) (De Morgan, phủ định kép) ≡ (¬p ∧ p) ∨ (¬p ∧ ¬q) (phân phối) ≡ F ∨ (¬p ∧ ¬q) (luật phủ định) ≡ ¬p ∧ ¬q (đồng nhất).</p></div>
<div class="callout"><p><b>Ví dụ 2 — DNF từ bảng.</b> p ⊕ q đúng ở các dòng (p, q) = (T, F) và (F, T), nên DNF = (p ∧ ¬q) ∨ (¬p ∧ q). Nó sai ở (T, T) và (F, F), nên CNF = (¬p ∨ ¬q) ∧ (p ∨ q).</p></div>
<div class="callout"><p><b>Ví dụ 3 — rút gọn code.</b> <code>if not (x &gt; 0 and y &gt; 0)</code> giống hệt <code>if x &lt;= 0 or y &lt;= 0</code> theo De Morgan.</p></div>
<pre><code class="language-python">from itertools import product

def equivalent(f, g, n):
    """True if formulas f and g (functions of n booleans) agree on all 2**n rows."""
    return all(f(*row) == g(*row) for row in product([False, True], repeat=n))

lhs = lambda p, q: not (p or ((not p) and q))
rhs = lambda p, q: (not p) and (not q)
print("not(p or (not p and q)) == not p and not q :", equivalent(lhs, rhs, 2))

# a common mistake: "not (p and q)" is NOT "not p and not q"
print("not(p and q) == not p and not q :",
      equivalent(lambda p, q: not (p and q), lambda p, q: (not p) and (not q), 2))

# brute-force SAT for a small CNF formula
cnf = lambda p, q, r: (p or q) and ((not p) or r) and ((not q) or (not r)) and ((not r) or p)
sols = [row for row in product([False, True], repeat=3) if cnf(*row)]
print("satisfying assignments (p,q,r):", sols)</code></pre>
<div class="out">not(p or (not p and q)) == not p and not q : True
not(p and q) == not p and not q : False
satisfying assignments (p,q,r): [(False, True, False), (True, False, True)]</div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Phủ định ¬(p ∧ q) thành ¬p ∧ ¬q — chương trình trên cho thấy là sai.</li><li>Viết ¬(p → q) ≡ ¬p → ¬q. Đúng là ¬(p → q) ≡ p ∧ ¬q.</li><li>“Phân phối” ∧ qua ∧ hay ∨ qua ∨ (đó là kết hợp, không phải phân phối).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>A ≡ B nghĩa là A ↔ B là hằng đúng.</li><li>Chứng minh tương đương bằng chuỗi luật có ghi tên.</li><li>DNF = tuyển các hạng tử AND (dòng đúng); CNF = hội các clause (dòng sai).</li><li>SAT là NP-đầy đủ; vét cạn kiểm 2<sup>n</sup> phép gán.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_logic-rules.html" target="_blank" rel="noopener">Levin, DMOI 1.3 — Rules of Logic</a></li><li><a href="https://brilliant.org/wiki/de-morgans-laws/" target="_blank" rel="noopener">Brilliant — De Morgan's Laws</a></li><li><a href="https://en.wikipedia.org/wiki/Boolean_satisfiability_problem" target="_blank" rel="noopener">Wikipedia — Boolean satisfiability problem</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Rút gọn ¬(p → q) ∨ q.</li><li>Viết DNF của công thức đúng khi và chỉ khi có ít nhất hai trong p, q, r đúng.</li><li>(p ∨ q) ∧ (¬p ∨ q) ∧ (¬q) có thoả được không?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) ¬(p → q) ≡ p ∧ ¬q, nên (p ∧ ¬q) ∨ q ≡ (p ∨ q) ∧ (¬q ∨ q) ≡ p ∨ q. 2) (p ∧ q) ∨ (p ∧ r) ∨ (q ∧ r) (hàm đa số). 3) Không: ¬q buộc q = F, khi đó hai clause đầu đòi cả p lẫn ¬p.</p></div>`);

const c13 = L('mad102-ts-1-3',
  '1.3 — Predicates and nested quantifiers|||1.3 — Vị từ và lượng từ lồng nhau',
  'Vị từ, miền xác định, lượng từ ∀ và ∃, phủ định lượng từ, lượng từ lồng nhau và thứ tự lượng từ, dịch câu sang logic vị từ, kiểm trên miền hữu hạn bằng all/any.',
  `<span class="eyebrow">MAD102 · Chapter 1 · Lesson 1.3</span>
<h2>Predicates and nested quantifiers</h2>
<p class="lead">Propositional logic cannot say “every integer has a successor” or “some user has no password”. Predicate logic adds variables and quantifiers, and it is exactly the language of specifications, SQL queries and loop invariants.</p>
<h3>🎯 Objectives</h3>
<ul><li>Evaluate statements with ∀ and ∃ over a given domain.</li><li>Negate quantified statements correctly (push ¬ inside).</li><li>Translate English/Vietnamese sentences with nested quantifiers and see why the order of quantifiers matters.</li></ul>
<h3>📖 Lecture</h3>
<p>A <strong>predicate</strong> P(x) is a statement with a variable; it becomes a proposition when x is given a value from the <strong>domain</strong> (universe of discourse). With domain ℤ, P(x): “x &gt; 3” gives P(5) true and P(1) false.</p>
<ul>
<li><strong>Universal quantifier</strong> ∀x P(x): P(x) is true for every x in the domain. One counterexample makes it false.</li>
<li><strong>Existential quantifier</strong> ∃x P(x): there is at least one x with P(x). One example makes it true.</li>
<li>Uniqueness ∃!x P(x): exactly one such x.</li>
</ul>
<div class="formula"><span class="lbl">De Morgan for quantifiers</span>¬∀x P(x) ≡ ∃x ¬P(x)      ¬∃x P(x) ≡ ∀x ¬P(x)</div>
<p>Restricted quantifiers are abbreviations: “∀x &gt; 0, P(x)” means ∀x (x &gt; 0 → P(x)), and “∃x &gt; 0, P(x)” means ∃x (x &gt; 0 ∧ P(x)). Note the <strong>→ with ∀</strong> and the <strong>∧ with ∃</strong>; swapping them is the most common translation error.</p>
<p><strong>Nested quantifiers.</strong> Read them left to right, like nested loops: ∀x ∃y Q(x, y) means “for each x (outer loop) we can find a y (inner loop) depending on x”. ∃y ∀x Q(x, y) means “one single y works for all x” — much stronger. Quantifiers of the <em>same</em> type commute (∀x∀y ≡ ∀y∀x), mixed ones generally do not.</p>
<p>To negate a nested statement, move ¬ inward one quantifier at a time, flipping each: ¬∀x ∃y Q(x, y) ≡ ∃x ∀y ¬Q(x, y).</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — order matters.</b> Domain ℤ, Q(x, y): x + y = 0. ∀x ∃y Q(x, y) is true (take y = −x). ∃y ∀x Q(x, y) is false (no single y cancels every x). On a finite domain we can check with Python's <code>all</code> (∀) and <code>any</code> (∃):</p></div>
<pre><code class="language-python">D = range(-3, 4)          # a small finite domain {-3,...,3}

# forall x exists y: x + y == 0
print(all(any(x + y == 0 for y in D) for x in D))
# exists y forall x: x + y == 0
print(any(all(x + y == 0 for x in D) for y in D))
# forall x exists y: y &gt; x   (false on a finite domain: x = 3 has no bigger y)
print(all(any(y &gt; x for y in D) for x in D))</code></pre>
<div class="out">True
False
False</div>
<p>The last line shows a subtlety: over ℤ, “∀x ∃y (y &gt; x)” is true, but over the finite domain {−3, …, 3} it is false. <strong>The truth value depends on the domain.</strong></p>
<div class="callout"><p><b>Example 2 — translation.</b> Domain: students S and courses C; T(s, c): “s takes c”. “Every student takes some course”: ∀s ∃c T(s, c). “Some course is taken by every student”: ∃c ∀s T(s, c). “No student takes every course”: ¬∃s ∀c T(s, c) ≡ ∀s ∃c ¬T(s, c).</p></div>
<div class="callout"><p><b>Example 3 — limits.</b> “lim f(x) = L as x → a” is ∀ε &gt; 0 ∃δ &gt; 0 ∀x (0 &lt; |x − a| &lt; δ → |f(x) − L| &lt; ε). Its negation: ∃ε &gt; 0 ∀δ &gt; 0 ∃x (0 &lt; |x − a| &lt; δ ∧ |f(x) − L| ≥ ε).</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>“All admins are logged in” as ∀x (A(x) ∧ L(x)) — this says everyone is an admin. Correct: ∀x (A(x) → L(x)).</li><li>“Some admin is logged in” as ∃x (A(x) → L(x)) — true even if nobody is an admin. Correct: ∃x (A(x) ∧ L(x)).</li><li>Swapping ∀ and ∃ when negating only the outer quantifier.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>∀ needs no counterexample; ∃ needs one witness.</li><li>¬∀ = ∃¬ and ¬∃ = ∀¬.</li><li>∀ pairs with →, ∃ pairs with ∧ in restricted statements.</li><li>∀x∃y ≠ ∃y∀x; nested quantifiers are nested loops.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_logic-statements.html" target="_blank" rel="noopener">Levin, DMOI 1.1 — Mathematical Statements (quantifiers)</a></li><li><a href="https://en.wikipedia.org/wiki/Quantifier_(logic)" target="_blank" rel="noopener">Wikipedia — Quantifier (logic)</a></li><li><a href="https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/pages/readings/" target="_blank" rel="noopener">MIT 6.042J readings — Logical Formulas (Ch. 3)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Domain ℕ = {0, 1, 2, …}. Is ∃x ∀y (x ≤ y) true? Is ∀x ∃y (y &lt; x) true?</li><li>Negate and simplify: ∀u ∃p (Owns(u, p) ∧ Strong(p)).</li><li>Translate: “Every non-zero real number has a multiplicative inverse.”</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) True (x = 0); false (x = 0 has no smaller natural number). 2) ∃u ∀p (¬Owns(u, p) ∨ ¬Strong(p)) — some user owns no strong password. 3) ∀x (x ≠ 0 → ∃y (xy = 1)), domain ℝ.</p></div>`,
  `<span class="eyebrow">MAD102 · Chương 1 · Bài 1.3</span>
<h2>Vị từ và lượng từ lồng nhau</h2>
<p class="lead">Logic mệnh đề không nói được “mọi số nguyên đều có số liền sau” hay “có người dùng chưa đặt mật khẩu”. Logic vị từ thêm biến và lượng từ, và đó chính là ngôn ngữ của đặc tả, truy vấn SQL và bất biến vòng lặp.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính giá trị các câu có ∀ và ∃ trên một miền cho trước.</li><li>Phủ định đúng câu có lượng từ (đưa ¬ vào trong).</li><li>Dịch câu có lượng từ lồng nhau và hiểu vì sao thứ tự lượng từ quan trọng.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Vị từ</strong> P(x) là câu chứa biến; nó thành mệnh đề khi x nhận một giá trị trong <strong>miền xác định</strong> (miền đang bàn). Với miền ℤ, P(x): “x &gt; 3” cho P(5) đúng và P(1) sai.</p>
<ul>
<li><strong>Lượng từ với mọi</strong> ∀x P(x): P(x) đúng với mọi x trong miền. Một phản ví dụ là đủ để nó sai.</li>
<li><strong>Lượng từ tồn tại</strong> ∃x P(x): có ít nhất một x thoả P(x). Một ví dụ là đủ để nó đúng.</li>
<li>Tồn tại duy nhất ∃!x P(x): có đúng một x như vậy.</li>
</ul>
<div class="formula"><span class="lbl">De Morgan cho lượng từ</span>¬∀x P(x) ≡ ∃x ¬P(x)      ¬∃x P(x) ≡ ∀x ¬P(x)</div>
<p>Lượng từ có điều kiện là cách viết tắt: “∀x &gt; 0, P(x)” nghĩa là ∀x (x &gt; 0 → P(x)), còn “∃x &gt; 0, P(x)” nghĩa là ∃x (x &gt; 0 ∧ P(x)). Nhớ <strong>∀ đi với →</strong> và <strong>∃ đi với ∧</strong>; đổi lẫn hai cái là lỗi dịch câu phổ biến nhất.</p>
<p><strong>Lượng từ lồng nhau.</strong> Đọc từ trái sang phải như vòng lặp lồng: ∀x ∃y Q(x, y) nghĩa là “với mỗi x (vòng ngoài) ta tìm được một y (vòng trong) tuỳ theo x”. ∃y ∀x Q(x, y) nghĩa là “có một y duy nhất dùng được cho mọi x” — mạnh hơn nhiều. Lượng từ <em>cùng loại</em> đổi chỗ được (∀x∀y ≡ ∀y∀x), khác loại thì nói chung không.</p>
<p>Phủ định câu lồng nhau: đưa ¬ vào trong qua từng lượng từ, lật từng cái: ¬∀x ∃y Q(x, y) ≡ ∃x ∀y ¬Q(x, y).</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — thứ tự quan trọng.</b> Miền ℤ, Q(x, y): x + y = 0. ∀x ∃y Q(x, y) đúng (chọn y = −x). ∃y ∀x Q(x, y) sai (không có y nào triệt tiêu mọi x). Trên miền hữu hạn ta kiểm bằng <code>all</code> (∀) và <code>any</code> (∃) của Python:</p></div>
<pre><code class="language-python">D = range(-3, 4)          # a small finite domain {-3,...,3}

# forall x exists y: x + y == 0
print(all(any(x + y == 0 for y in D) for x in D))
# exists y forall x: x + y == 0
print(any(all(x + y == 0 for x in D) for y in D))
# forall x exists y: y &gt; x   (false on a finite domain: x = 3 has no bigger y)
print(all(any(y &gt; x for y in D) for x in D))</code></pre>
<div class="out">True
False
False</div>
<p>Dòng cuối cho thấy một điểm tinh tế: trên ℤ, “∀x ∃y (y &gt; x)” đúng, nhưng trên miền hữu hạn {−3, …, 3} thì sai. <strong>Giá trị chân trị phụ thuộc vào miền.</strong></p>
<div class="callout"><p><b>Ví dụ 2 — dịch câu.</b> Miền: sinh viên S và môn học C; T(s, c): “s học c”. “Mọi sinh viên đều học một môn nào đó”: ∀s ∃c T(s, c). “Có môn mà mọi sinh viên đều học”: ∃c ∀s T(s, c). “Không sinh viên nào học mọi môn”: ¬∃s ∀c T(s, c) ≡ ∀s ∃c ¬T(s, c).</p></div>
<div class="callout"><p><b>Ví dụ 3 — giới hạn.</b> “lim f(x) = L khi x → a” là ∀ε &gt; 0 ∃δ &gt; 0 ∀x (0 &lt; |x − a| &lt; δ → |f(x) − L| &lt; ε). Phủ định: ∃ε &gt; 0 ∀δ &gt; 0 ∃x (0 &lt; |x − a| &lt; δ ∧ |f(x) − L| ≥ ε).</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>“Mọi admin đều đang đăng nhập” viết thành ∀x (A(x) ∧ L(x)) — câu này nói ai cũng là admin. Đúng: ∀x (A(x) → L(x)).</li><li>“Có admin đang đăng nhập” viết thành ∃x (A(x) → L(x)) — câu này đúng cả khi không có admin nào. Đúng: ∃x (A(x) ∧ L(x)).</li><li>Chỉ lật lượng từ ngoài cùng khi phủ định.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>∀ cần không có phản ví dụ; ∃ cần một nhân chứng.</li><li>¬∀ = ∃¬ và ¬∃ = ∀¬.</li><li>Câu có điều kiện: ∀ đi với →, ∃ đi với ∧.</li><li>∀x∃y ≠ ∃y∀x; lượng từ lồng là vòng lặp lồng.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_logic-statements.html" target="_blank" rel="noopener">Levin, DMOI 1.1 — Mathematical Statements (lượng từ)</a></li><li><a href="https://en.wikipedia.org/wiki/Quantifier_(logic)" target="_blank" rel="noopener">Wikipedia — Quantifier (logic)</a></li><li><a href="https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/pages/readings/" target="_blank" rel="noopener">MIT 6.042J readings — Logical Formulas (Ch. 3)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Miền ℕ = {0, 1, 2, …}. ∃x ∀y (x ≤ y) có đúng không? ∀x ∃y (y &lt; x) có đúng không?</li><li>Phủ định và rút gọn: ∀u ∃p (Owns(u, p) ∧ Strong(p)).</li><li>Dịch: “Mọi số thực khác 0 đều có nghịch đảo.”</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Đúng (x = 0); sai (x = 0 không có số tự nhiên nhỏ hơn). 2) ∃u ∀p (¬Owns(u, p) ∨ ¬Strong(p)) — có người dùng không sở hữu mật khẩu mạnh nào. 3) ∀x (x ≠ 0 → ∃y (xy = 1)), miền ℝ.</p></div>`);

const c14 = L('mad102-ts-1-4',
  '1.4 — Rules of inference and valid arguments|||1.4 — Quy tắc suy diễn và lập luận hợp lệ',
  'Lập luận hợp lệ, các quy tắc suy diễn (modus ponens/tollens, tam đoạn luận, tam đoạn luận tuyển, hợp giải), ngụy biện, quy tắc cho lượng từ; kiểm tính hợp lệ bằng vét cạn.',
  `<span class="eyebrow">MAD102 · Chapter 1 · Lesson 1.4</span>
<h2>Rules of inference and valid arguments</h2>
<p class="lead">A proof is a chain of small, certainly-correct steps. Rules of inference are those steps. They are also how automated theorem provers, type checkers and logic-programming languages (Prolog) reason.</p>
<h3>🎯 Objectives</h3>
<ul><li>Define a valid argument and test validity with a truth table.</li><li>Use the main rules of inference, including resolution, to derive a conclusion.</li><li>Recognise the two classic fallacies and the rules for quantifiers.</li></ul>
<h3>📖 Lecture</h3>
<p>An <strong>argument</strong> is a list of premises p<sub>1</sub>, …, p<sub>n</sub> and a conclusion q. It is <strong>valid</strong> if (p<sub>1</sub> ∧ … ∧ p<sub>n</sub>) → q is a tautology: whenever every premise is true, the conclusion is true. Validity is about <em>form</em>, not about whether the premises are actually true.</p>
<div class="formula"><span class="lbl">Rules of inference</span>Modus ponens: p, p → q ⊢ q<br>Modus tollens: ¬q, p → q ⊢ ¬p<br>Hypothetical syllogism: p → q, q → r ⊢ p → r<br>Disjunctive syllogism: p ∨ q, ¬p ⊢ q<br>Addition: p ⊢ p ∨ q · Simplification: p ∧ q ⊢ p · Conjunction: p, q ⊢ p ∧ q<br>Resolution: p ∨ q, ¬p ∨ r ⊢ q ∨ r</div>
<p><strong>Resolution</strong> is special: together with CNF it is a complete method for showing a set of clauses unsatisfiable, and it is the engine inside Prolog and many SAT/SMT solvers.</p>
<p>Two <strong>fallacies</strong> look like rules but are not valid: <em>affirming the conclusion</em> (p → q, q ⊢ p) and <em>denying the hypothesis</em> (p → q, ¬p ⊢ ¬q). “If it rains the road is wet; the road is wet; so it rained” — maybe a water truck passed.</p>
<p>For quantifiers there are four rules: <strong>universal instantiation</strong> (from ∀x P(x) infer P(c) for any c), <strong>universal generalization</strong> (if P(c) holds for an <em>arbitrary</em> c, infer ∀x P(x)), <strong>existential instantiation</strong> (from ∃x P(x) name a witness c with P(c)), and <strong>existential generalization</strong> (from P(c) infer ∃x P(x)). Combining instantiation with modus ponens gives <em>universal modus ponens</em>: ∀x (P(x) → Q(x)), P(a) ⊢ Q(a).</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — a derivation.</b> Premises: (1) “If the build passes, we deploy” b → d; (2) “If we deploy, users get the fix” d → u; (3) “Users did not get the fix” ¬u. Conclusion: ¬b.<br>Step 4: b → u (hypothetical syllogism, 1, 2). Step 5: ¬b (modus tollens, 3, 4).</p></div>
<div class="callout"><p><b>Example 2 — resolution.</b> From (p ∨ q) and (¬p ∨ r) and (¬q ∨ r): resolve the first two on p to get q ∨ r; resolve with the third on q to get r ∨ r ≡ r.</p></div>
<div class="callout"><p><b>Example 3 — checking by machine.</b> An argument is invalid exactly when some row makes all premises true and the conclusion false; the program returns that row as a counterexample.</p></div>
<pre><code class="language-python">from itertools import product

def valid(premises, conclusion, n):
    """An argument is valid iff no row makes every premise true and the conclusion false."""
    for row in product([False, True], repeat=n):
        if all(p(*row) for p in premises) and not conclusion(*row):
            return False, row
    return True, None

imp = lambda a, b: (not a) or b
# modus tollens: p-&gt;q, not q  therefore not p
print(valid([lambda p, q: imp(p, q), lambda p, q: not q], lambda p, q: not p, 2))
# fallacy of affirming the conclusion: p-&gt;q, q  therefore p
print(valid([lambda p, q: imp(p, q), lambda p, q: q], lambda p, q: p, 2))</code></pre>
<div class="out">(True, None)
(False, (False, True))</div>
<p>The counterexample (p, q) = (False, True) is exactly the “water truck” situation: wet road, no rain.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Confusing “valid” with “true conclusion”: a valid argument with a false premise may reach a false conclusion.</li><li>Using universal generalization on a <em>specific</em> chosen element instead of an arbitrary one.</li><li>In existential instantiation, reusing a name that already denotes something else.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Valid = premises ∧ … → conclusion is a tautology.</li><li>Core rules: modus ponens, modus tollens, syllogisms, resolution.</li><li>Fallacies: affirming the conclusion, denying the hypothesis.</li><li>Quantifier rules: instantiate/generalize, universal vs existential.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Rule_of_inference" target="_blank" rel="noopener">Wikipedia — Rule of inference</a></li><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_logic-rules.html" target="_blank" rel="noopener">Levin, DMOI 1.3 — Rules of Logic (deductions)</a></li><li><a href="https://www.coursera.org/learn/what-is-a-proof" target="_blank" rel="noopener">Coursera (UCSD) — Mathematical Thinking in Computer Science</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Which rule: “Hà is a student or an employee. Hà is not a student. So Hà is an employee.”</li><li>Is the argument p → q, ¬p ⊢ ¬q valid? Give a counterexample row if not.</li><li>From ∀x (Prime(x) ∧ x &gt; 2 → Odd(x)) and Prime(7), 7 &gt; 2, what can you conclude and by which rules?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Disjunctive syllogism. 2) Invalid (denying the hypothesis): p = F, q = T makes both premises true and ¬q false. 3) Odd(7), by universal instantiation then conjunction and modus ponens (universal modus ponens).</p></div>`,
  `<span class="eyebrow">MAD102 · Chương 1 · Bài 1.4</span>
<h2>Quy tắc suy diễn và lập luận hợp lệ</h2>
<p class="lead">Một chứng minh là chuỗi các bước nhỏ, chắc chắn đúng. Quy tắc suy diễn chính là những bước đó. Chúng cũng là cách bộ chứng minh tự động, bộ kiểm kiểu và ngôn ngữ lập trình logic (Prolog) lập luận.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Định nghĩa lập luận hợp lệ và kiểm tính hợp lệ bằng bảng chân trị.</li><li>Dùng các quy tắc suy diễn chính, kể cả hợp giải (resolution), để rút ra kết luận.</li><li>Nhận ra hai ngụy biện kinh điển và các quy tắc cho lượng từ.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Lập luận</strong> gồm các tiền đề p<sub>1</sub>, …, p<sub>n</sub> và kết luận q. Nó <strong>hợp lệ</strong> nếu (p<sub>1</sub> ∧ … ∧ p<sub>n</sub>) → q là hằng đúng: hễ mọi tiền đề đúng thì kết luận đúng. Tính hợp lệ nói về <em>hình thức</em>, không nói tiền đề có thật sự đúng hay không.</p>
<div class="formula"><span class="lbl">Quy tắc suy diễn</span>Modus ponens: p, p → q ⊢ q<br>Modus tollens: ¬q, p → q ⊢ ¬p<br>Tam đoạn luận giả định: p → q, q → r ⊢ p → r<br>Tam đoạn luận tuyển: p ∨ q, ¬p ⊢ q<br>Cộng: p ⊢ p ∨ q · Rút gọn: p ∧ q ⊢ p · Hội: p, q ⊢ p ∧ q<br>Hợp giải: p ∨ q, ¬p ∨ r ⊢ q ∨ r</div>
<p><strong>Hợp giải</strong> đặc biệt: cùng với CNF, nó là phương pháp đầy đủ để chứng tỏ một tập clause không thoả được, và là động cơ bên trong Prolog cùng nhiều bộ giải SAT/SMT.</p>
<p>Hai <strong>ngụy biện</strong> trông giống quy tắc nhưng không hợp lệ: <em>khẳng định kết luận</em> (p → q, q ⊢ p) và <em>phủ định giả thiết</em> (p → q, ¬p ⊢ ¬q). “Nếu trời mưa thì đường ướt; đường ướt; vậy trời đã mưa” — có thể xe tưới nước vừa đi qua.</p>
<p>Với lượng từ có bốn quy tắc: <strong>đặc biệt hoá phổ dụng</strong> (từ ∀x P(x) suy ra P(c) với c bất kỳ), <strong>tổng quát hoá phổ dụng</strong> (nếu P(c) đúng với c <em>tuỳ ý</em> thì suy ra ∀x P(x)), <strong>đặc biệt hoá tồn tại</strong> (từ ∃x P(x) đặt tên một nhân chứng c có P(c)), <strong>tổng quát hoá tồn tại</strong> (từ P(c) suy ra ∃x P(x)). Ghép đặc biệt hoá với modus ponens được <em>modus ponens phổ dụng</em>: ∀x (P(x) → Q(x)), P(a) ⊢ Q(a).</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — một phép suy diễn.</b> Tiền đề: (1) “Nếu build qua thì ta deploy” b → d; (2) “Nếu deploy thì người dùng nhận bản vá” d → u; (3) “Người dùng chưa nhận bản vá” ¬u. Kết luận: ¬b.<br>Bước 4: b → u (tam đoạn luận giả định, 1, 2). Bước 5: ¬b (modus tollens, 3, 4).</p></div>
<div class="callout"><p><b>Ví dụ 2 — hợp giải.</b> Từ (p ∨ q), (¬p ∨ r) và (¬q ∨ r): hợp giải hai clause đầu theo p được q ∨ r; hợp giải với clause thứ ba theo q được r ∨ r ≡ r.</p></div>
<div class="callout"><p><b>Ví dụ 3 — kiểm bằng máy.</b> Lập luận không hợp lệ đúng khi có một dòng làm mọi tiền đề đúng mà kết luận sai; chương trình trả về dòng đó làm phản ví dụ.</p></div>
<pre><code class="language-python">from itertools import product

def valid(premises, conclusion, n):
    """An argument is valid iff no row makes every premise true and the conclusion false."""
    for row in product([False, True], repeat=n):
        if all(p(*row) for p in premises) and not conclusion(*row):
            return False, row
    return True, None

imp = lambda a, b: (not a) or b
# modus tollens: p-&gt;q, not q  therefore not p
print(valid([lambda p, q: imp(p, q), lambda p, q: not q], lambda p, q: not p, 2))
# fallacy of affirming the conclusion: p-&gt;q, q  therefore p
print(valid([lambda p, q: imp(p, q), lambda p, q: q], lambda p, q: p, 2))</code></pre>
<div class="out">(True, None)
(False, (False, True))</div>
<p>Phản ví dụ (p, q) = (False, True) đúng là tình huống “xe tưới nước”: đường ướt, trời không mưa.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Nhầm “hợp lệ” với “kết luận đúng”: lập luận hợp lệ mà tiền đề sai vẫn có thể ra kết luận sai.</li><li>Tổng quát hoá phổ dụng từ một phần tử <em>cụ thể</em> đã chọn thay vì phần tử tuỳ ý.</li><li>Khi đặc biệt hoá tồn tại, dùng lại một tên đã chỉ thứ khác.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Hợp lệ = (tiền đề ∧ …) → kết luận là hằng đúng.</li><li>Quy tắc lõi: modus ponens, modus tollens, các tam đoạn luận, hợp giải.</li><li>Ngụy biện: khẳng định kết luận, phủ định giả thiết.</li><li>Quy tắc lượng từ: đặc biệt hoá/tổng quát hoá, phổ dụng và tồn tại.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Rule_of_inference" target="_blank" rel="noopener">Wikipedia — Rule of inference</a></li><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_logic-rules.html" target="_blank" rel="noopener">Levin, DMOI 1.3 — Rules of Logic (suy diễn)</a></li><li><a href="https://www.coursera.org/learn/what-is-a-proof" target="_blank" rel="noopener">Coursera (UCSD) — Mathematical Thinking in Computer Science</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Quy tắc nào: “Hà là sinh viên hoặc nhân viên. Hà không phải sinh viên. Vậy Hà là nhân viên.”</li><li>Lập luận p → q, ¬p ⊢ ¬q có hợp lệ không? Nếu không, chỉ ra dòng phản ví dụ.</li><li>Từ ∀x (Prime(x) ∧ x &gt; 2 → Odd(x)) và Prime(7), 7 &gt; 2, suy ra được gì và bằng quy tắc nào?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Tam đoạn luận tuyển. 2) Không hợp lệ (phủ định giả thiết): p = F, q = T làm hai tiền đề đúng mà ¬q sai. 3) Odd(7), nhờ đặc biệt hoá phổ dụng rồi quy tắc hội và modus ponens (modus ponens phổ dụng).</p></div>`);

const q1 = QZ(1, 'Quiz — Chapter 1: Logic|||Quiz — Chương 1: Logic', 'Kiểm tra chương 1: bảng chân trị, kéo theo, tương đương, DNF/CNF, lượng từ, quy tắc suy diễn.', [
  Q('q1', 'When is p → q false?|||p → q sai khi nào?',
    ['p false, q true|||p sai, q đúng', 'p true, q false|||p đúng, q sai', 'p false, q false|||p sai, q sai', 'never|||không bao giờ'], 1,
    'An implication fails only when the hypothesis is true and the conclusion false.|||Phép kéo theo chỉ sai khi giả thiết đúng và kết luận sai.'),
  Q('q2', 'Which statement is logically equivalent to p → q?|||Mệnh đề nào tương đương logic với p → q?',
    ['q → p|||q → p', '¬p → ¬q|||¬p → ¬q', '¬q → ¬p|||¬q → ¬p', 'p ∧ ¬q|||p ∧ ¬q'], 2,
    'The contrapositive ¬q → ¬p is equivalent; converse and inverse are not.|||Phản đảo ¬q → ¬p tương đương; đảo và nghịch thì không.'),
  Q('q3', 'How many rows does a truth table with 6 variables have?|||Bảng chân trị có 6 biến có bao nhiêu dòng?',
    ['12|||12', '36|||36', '64|||64', '720|||720'], 2,
    '2⁶ = 64.|||2⁶ = 64.'),
  Q('q4', '¬(p → q) is equivalent to|||¬(p → q) tương đương với',
    ['¬p → ¬q|||¬p → ¬q', 'p ∧ ¬q|||p ∧ ¬q', '¬p ∨ q|||¬p ∨ q', '¬p ∧ q|||¬p ∧ q'], 1,
    'p → q ≡ ¬p ∨ q; De Morgan gives p ∧ ¬q.|||p → q ≡ ¬p ∨ q; De Morgan cho p ∧ ¬q.'),
  Q('q5', 'The CNF of p ⊕ q (exclusive or) is|||CNF của p ⊕ q (hoặc loại trừ) là',
    ['(p ∧ ¬q) ∨ (¬p ∧ q)|||(p ∧ ¬q) ∨ (¬p ∧ q)', '(p ∨ q) ∧ (¬p ∨ ¬q)|||(p ∨ q) ∧ (¬p ∨ ¬q)', '(p ∨ ¬q) ∧ (¬p ∨ q)|||(p ∨ ¬q) ∧ (¬p ∨ q)', 'p ∨ q|||p ∨ q'], 1,
    'One clause excludes each false row (T,T) and (F,F); (p ∧ ¬q) ∨ (¬p ∧ q) is the DNF, not the CNF.|||Mỗi clause loại một dòng sai (T,T) và (F,F); (p ∧ ¬q) ∨ (¬p ∧ q) là DNF, không phải CNF.'),
  Q('q6', 'Domain ℤ. Which statement is TRUE?|||Miền ℤ. Câu nào ĐÚNG?',
    ['∃y ∀x (x + y = 0)|||∃y ∀x (x + y = 0)', '∀x ∃y (x + y = 0)|||∀x ∃y (x + y = 0)', '∃x ∀y (y ≥ x)|||∃x ∀y (y ≥ x)', '∀x ∀y (x + y = 0)|||∀x ∀y (x + y = 0)'], 1,
    'For each x choose y = −x. No single y works for all x.|||Với mỗi x chọn y = −x. Không có một y nào dùng được cho mọi x.'),
  Q('q7', 'The negation of ∀x ∃y P(x, y) is|||Phủ định của ∀x ∃y P(x, y) là',
    ['∀x ∃y ¬P(x, y)|||∀x ∃y ¬P(x, y)', '∃x ∃y ¬P(x, y)|||∃x ∃y ¬P(x, y)', '∃x ∀y ¬P(x, y)|||∃x ∀y ¬P(x, y)', '∀y ∃x ¬P(x, y)|||∀y ∃x ¬P(x, y)'], 2,
    'Move ¬ inward, flipping each quantifier.|||Đưa ¬ vào trong, lật từng lượng từ.'),
  Q('q8', '“If the server is up, the page loads. The page does not load. So the server is down.” This uses|||“Nếu máy chủ chạy thì trang tải được. Trang không tải được. Vậy máy chủ không chạy.” Đây là',
    ['modus ponens|||modus ponens', 'modus tollens|||modus tollens', 'affirming the conclusion|||khẳng định kết luận', 'disjunctive syllogism|||tam đoạn luận tuyển'], 1,
    'p → q and ¬q give ¬p: modus tollens (valid).|||p → q và ¬q cho ¬p: modus tollens (hợp lệ).'),
  Q('q9', 'Resolving (p ∨ q) with (¬p ∨ r) gives|||Hợp giải (p ∨ q) với (¬p ∨ r) được',
    ['q ∧ r|||q ∧ r', 'q ∨ r|||q ∨ r', 'p ∨ r|||p ∨ r', '¬q ∨ r|||¬q ∨ r'], 1,
    'Resolution cancels the complementary pair p, ¬p.|||Hợp giải triệt tiêu cặp đối nhau p, ¬p.'),
]);

const ch1 = {
  title: 'Chapter 1 — Logic: propositions, quantifiers and inference|||Chương 1 — Logic: mệnh đề, lượng từ và suy diễn',
  description: 'Logic mệnh đề và bảng chân trị, tương đương và dạng chuẩn (DNF/CNF, SAT), vị từ và lượng từ lồng nhau, quy tắc suy diễn và hợp giải (Rosen 1.1–1.6 · MCS ch. 3).',
  lessons: [c11, c12, c13, c14, q1],
};

// ───────────────────────────── Chương 2 — Chứng minh & quy nạp ─────────────────────────────
const c21 = L('mad102-ts-2-1',
  '2.1 — Direct proof and proof by contrapositive|||2.1 — Chứng minh trực tiếp và chứng minh phản đảo',
  'Định lý, định nghĩa và cấu trúc một chứng minh; chứng minh trực tiếp (chẵn/lẻ, chia hết); chứng minh phản đảo; chứng minh “khi và chỉ khi”; viết chứng minh gọn và đúng.',
  `<span class="eyebrow">MAD102 · Chapter 2 · Lesson 2.1</span>
<h2>Direct proof and proof by contrapositive</h2>
<p class="lead">A proof is a convincing argument that leaves no case unchecked. In computer science you prove that an algorithm terminates, that a protocol is secure, that an optimisation preserves meaning. This lesson covers the two most common shapes of proof for statements “if P then Q”.</p>
<h3>🎯 Objectives</h3>
<ul><li>Write a direct proof starting from precise definitions.</li><li>Choose the contrapositive when the hypothesis is hard to use directly.</li><li>Prove an “if and only if” statement in two directions.</li></ul>
<h3>📖 Lecture</h3>
<p>Proofs run on <strong>definitions</strong>. Ours: an integer n is <strong>even</strong> if n = 2k for some integer k, and <strong>odd</strong> if n = 2k + 1. An integer a <strong>divides</strong> b (a | b) if b = ak for some integer k. A real r is <strong>rational</strong> if r = p/q with integers p, q and q ≠ 0.</p>
<p><strong>Direct proof</strong> of P → Q: assume P, use definitions, known facts and algebra, and arrive at Q. Template: “Let … be arbitrary. Assume P. Then … Therefore Q. ∎”. The word “arbitrary” is what makes universal generalization legal.</p>
<p><strong>Proof by contrapositive</strong>: since P → Q ≡ ¬Q → ¬P, assume ¬Q and derive ¬P. Use it when ¬Q gives you an equation to work with but P does not — typically statements of the form “if f(n) is …, then n is …”.</p>
<p><strong>Biconditional</strong> P ↔ Q: prove P → Q and Q → P separately (each may use a different method). A chain “P<sub>1</sub> ↔ P<sub>2</sub> ↔ P<sub>3</sub>” can be proved by a cycle P<sub>1</sub> → P<sub>2</sub> → P<sub>3</sub> → P<sub>1</sub>.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 (direct).</b> <em>If n is odd, then n<sup>2</sup> is odd.</em><br>Let n be an arbitrary odd integer, so n = 2k + 1 for some integer k. Then n<sup>2</sup> = 4k<sup>2</sup> + 4k + 1 = 2(2k<sup>2</sup> + 2k) + 1. Since 2k<sup>2</sup> + 2k is an integer, n<sup>2</sup> is odd. ∎</p></div>
<div class="callout"><p><b>Example 2 (direct, divisibility).</b> <em>If a | b and b | c, then a | c.</em><br>b = ak and c = bm for integers k, m. Then c = (ak)m = a(km), and km is an integer, so a | c. ∎</p></div>
<div class="callout"><p><b>Example 3 (contrapositive).</b> <em>If n<sup>2</sup> is even, then n is even.</em><br>A direct attempt gets stuck: n<sup>2</sup> = 2k gives n = √(2k), useless. Contrapositive: if n is odd then n<sup>2</sup> is odd — that is Example 1. ∎</p></div>
<div class="callout"><p><b>Example 4 (contrapositive).</b> <em>If 3n + 2 is odd, then n is odd.</em><br>Suppose n is even, n = 2k. Then 3n + 2 = 6k + 2 = 2(3k + 1) is even. So “n even → 3n + 2 even”, which is the contrapositive. ∎</p></div>
<div class="callout"><p><b>Example 5 (iff).</b> <em>n is even ⇔ n<sup>2</sup> is even.</em> (→): n = 2k gives n<sup>2</sup> = 2(2k<sup>2</sup>). (←): Example 3. ∎</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Proving by examples: checking n = 1, 3, 5 proves nothing about all odd n.</li><li>Using the same letter k for two different numbers (“m = 2k and n = 2k” forces m = n). Use k and l.</li><li>Assuming what you want to prove (starting from Q and working backwards without making each step reversible).</li><li>Proving only one direction of an “if and only if”.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Start from definitions; end with exactly the claim.</li><li>Direct: P ⇒ … ⇒ Q. Contrapositive: ¬Q ⇒ … ⇒ ¬P.</li><li>Pick the contrapositive when ¬Q is easier to use than P.</li><li>Iff = two implications.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_logic-proofs.html" target="_blank" rel="noopener">Levin, DMOI 1.4 — Proofs</a></li><li><a href="https://richardhammack.github.io/BookOfProof/" target="_blank" rel="noopener">Hammack, Book of Proof — Ch. 4 Direct Proof, Ch. 5 Contrapositive Proof</a></li><li><a href="https://en.wikipedia.org/wiki/Contraposition" target="_blank" rel="noopener">Wikipedia — Contraposition</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Prove: the sum of two odd integers is even.</li><li>Prove: if n<sup>2</sup> + 5 is odd, then n is even.</li><li>Prove: if a | b and a | c, then a | (3b − 2c).</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) (2k + 1) + (2l + 1) = 2(k + l + 1). 2) Contrapositive: if n = 2k + 1 then n<sup>2</sup> + 5 = 4k<sup>2</sup> + 4k + 6 = 2(2k<sup>2</sup> + 2k + 3) is even. 3) b = ak, c = al, so 3b − 2c = a(3k − 2l).</p></div>`,
  `<span class="eyebrow">MAD102 · Chương 2 · Bài 2.1</span>
<h2>Chứng minh trực tiếp và chứng minh phản đảo</h2>
<p class="lead">Chứng minh là một lập luận thuyết phục không bỏ sót trường hợp nào. Trong khoa học máy tính ta chứng minh thuật toán dừng, giao thức an toàn, phép tối ưu giữ nguyên ngữ nghĩa. Bài này trình bày hai dạng chứng minh phổ biến nhất cho câu “nếu P thì Q”.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Viết chứng minh trực tiếp xuất phát từ định nghĩa chính xác.</li><li>Chọn chứng minh phản đảo khi giả thiết khó dùng trực tiếp.</li><li>Chứng minh câu “khi và chỉ khi” theo hai chiều.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Chứng minh chạy bằng <strong>định nghĩa</strong>. Của ta: số nguyên n <strong>chẵn</strong> nếu n = 2k với k nguyên nào đó, <strong>lẻ</strong> nếu n = 2k + 1. Số nguyên a <strong>chia hết</strong> b (a | b) nếu b = ak với k nguyên. Số thực r <strong>hữu tỉ</strong> nếu r = p/q với p, q nguyên và q ≠ 0.</p>
<p><strong>Chứng minh trực tiếp</strong> P → Q: giả sử P, dùng định nghĩa, sự kiện đã biết và đại số để đi tới Q. Khuôn: “Cho … tuỳ ý. Giả sử P. Khi đó … Vậy Q. ∎”. Chữ “tuỳ ý” chính là thứ cho phép tổng quát hoá phổ dụng.</p>
<p><strong>Chứng minh phản đảo</strong>: vì P → Q ≡ ¬Q → ¬P, giả sử ¬Q rồi suy ra ¬P. Dùng khi ¬Q cho bạn một phương trình để làm việc còn P thì không — thường là câu dạng “nếu f(n) là … thì n là …”.</p>
<p><strong>Câu tương đương</strong> P ↔ Q: chứng minh riêng P → Q và Q → P (mỗi chiều có thể dùng cách khác). Chuỗi “P<sub>1</sub> ↔ P<sub>2</sub> ↔ P<sub>3</sub>” có thể chứng minh theo vòng P<sub>1</sub> → P<sub>2</sub> → P<sub>3</sub> → P<sub>1</sub>.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 (trực tiếp).</b> <em>Nếu n lẻ thì n<sup>2</sup> lẻ.</em><br>Cho n là số nguyên lẻ tuỳ ý, n = 2k + 1 với k nguyên. Khi đó n<sup>2</sup> = 4k<sup>2</sup> + 4k + 1 = 2(2k<sup>2</sup> + 2k) + 1. Vì 2k<sup>2</sup> + 2k là số nguyên nên n<sup>2</sup> lẻ. ∎</p></div>
<div class="callout"><p><b>Ví dụ 2 (trực tiếp, chia hết).</b> <em>Nếu a | b và b | c thì a | c.</em><br>b = ak và c = bm với k, m nguyên. Khi đó c = (ak)m = a(km), km nguyên nên a | c. ∎</p></div>
<div class="callout"><p><b>Ví dụ 3 (phản đảo).</b> <em>Nếu n<sup>2</sup> chẵn thì n chẵn.</em><br>Làm trực tiếp sẽ tắc: n<sup>2</sup> = 2k cho n = √(2k), vô dụng. Phản đảo: nếu n lẻ thì n<sup>2</sup> lẻ — chính là Ví dụ 1. ∎</p></div>
<div class="callout"><p><b>Ví dụ 4 (phản đảo).</b> <em>Nếu 3n + 2 lẻ thì n lẻ.</em><br>Giả sử n chẵn, n = 2k. Khi đó 3n + 2 = 6k + 2 = 2(3k + 1) chẵn. Vậy “n chẵn → 3n + 2 chẵn”, đó là phản đảo. ∎</p></div>
<div class="callout"><p><b>Ví dụ 5 (khi và chỉ khi).</b> <em>n chẵn ⇔ n<sup>2</sup> chẵn.</em> (→): n = 2k cho n<sup>2</sup> = 2(2k<sup>2</sup>). (←): Ví dụ 3. ∎</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Chứng minh bằng ví dụ: thử n = 1, 3, 5 không chứng minh được gì cho mọi n lẻ.</li><li>Dùng cùng chữ k cho hai số khác nhau (“m = 2k và n = 2k” ép m = n). Dùng k và l.</li><li>Giả sử điều cần chứng minh (đi ngược từ Q mà không bảo đảm mỗi bước đảo ngược được).</li><li>Chỉ chứng minh một chiều của câu “khi và chỉ khi”.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Bắt đầu từ định nghĩa; kết thúc đúng bằng mệnh đề cần chứng minh.</li><li>Trực tiếp: P ⇒ … ⇒ Q. Phản đảo: ¬Q ⇒ … ⇒ ¬P.</li><li>Chọn phản đảo khi ¬Q dễ dùng hơn P.</li><li>Khi và chỉ khi = hai phép kéo theo.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_logic-proofs.html" target="_blank" rel="noopener">Levin, DMOI 1.4 — Proofs</a></li><li><a href="https://richardhammack.github.io/BookOfProof/" target="_blank" rel="noopener">Hammack, Book of Proof — Ch. 4 Direct Proof, Ch. 5 Contrapositive Proof</a></li><li><a href="https://en.wikipedia.org/wiki/Contraposition" target="_blank" rel="noopener">Wikipedia — Contraposition</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Chứng minh: tổng hai số nguyên lẻ là số chẵn.</li><li>Chứng minh: nếu n<sup>2</sup> + 5 lẻ thì n chẵn.</li><li>Chứng minh: nếu a | b và a | c thì a | (3b − 2c).</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) (2k + 1) + (2l + 1) = 2(k + l + 1). 2) Phản đảo: nếu n = 2k + 1 thì n<sup>2</sup> + 5 = 4k<sup>2</sup> + 4k + 6 = 2(2k<sup>2</sup> + 2k + 3) chẵn. 3) b = ak, c = al nên 3b − 2c = a(3k − 2l).</p></div>`);

const c22 = L('mad102-ts-2-2',
  '2.2 — Contradiction, cases, existence and counterexamples|||2.2 — Phản chứng, chia trường hợp, chứng minh tồn tại và phản ví dụ',
  'Chứng minh phản chứng (√2 vô tỉ, vô hạn số nguyên tố), chia trường hợp và “không mất tổng quát”, chứng minh tồn tại kiến thiết/không kiến thiết, phản ví dụ (n² + n + 41) kiểm bằng Python.',
  `<span class="eyebrow">MAD102 · Chapter 2 · Lesson 2.2</span>
<h2>Contradiction, cases, existence and counterexamples</h2>
<p class="lead">Some theorems have no obvious “if P then Q” shape: “√2 is irrational”, “there are infinitely many primes”, “there is a winning strategy”. This lesson adds the remaining standard tools, and the one tool for showing a claim is <em>false</em>.</p>
<h3>🎯 Objectives</h3>
<ul><li>Prove a statement by contradiction.</li><li>Split a proof into exhaustive cases, using “without loss of generality” correctly.</li><li>Distinguish constructive and non-constructive existence proofs; disprove universal claims with a counterexample.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>Proof by contradiction.</strong> To prove P, assume ¬P and derive a contradiction (some statement r ∧ ¬r). Since ¬P → F is true only when ¬P is false, P must be true. For P → Q, assume P ∧ ¬Q and reach a contradiction.</p>
<p><strong>Proof by cases.</strong> If P<sub>1</sub> ∨ P<sub>2</sub> ∨ … ∨ P<sub>k</sub> covers every possibility, prove Q in each case. Cases must be <em>exhaustive</em>. When two cases are symmetric, write “without loss of generality (WLOG) assume x ≤ y” and do only one — but only if the other case really is the same argument with names swapped.</p>
<p><strong>Existence proofs.</strong> A <em>constructive</em> proof exhibits a witness (“1729 = 1<sup>3</sup> + 12<sup>3</sup> = 9<sup>3</sup> + 10<sup>3</sup>, so a number that is a sum of two cubes in two ways exists”). A <em>non-constructive</em> proof shows existence without naming the object, often by cases or contradiction. <strong>Uniqueness</strong> needs two parts: existence, and “if x and y both work then x = y”.</p>
<p><strong>Counterexamples.</strong> To refute ∀x P(x), one x with ¬P(x) suffices. Many plausible patterns break eventually, which is why testing is not proof.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — √2 is irrational.</b> Suppose √2 = p/q in lowest terms (gcd(p, q) = 1). Then p<sup>2</sup> = 2q<sup>2</sup>, so p<sup>2</sup> is even, so p is even (Lesson 2.1), p = 2k. Then 4k<sup>2</sup> = 2q<sup>2</sup>, q<sup>2</sup> = 2k<sup>2</sup>, so q is even. Both p and q even contradicts lowest terms. ∎</p></div>
<div class="callout"><p><b>Example 2 — infinitely many primes (Euclid).</b> Suppose p<sub>1</sub>, …, p<sub>n</sub> are all the primes. Let N = p<sub>1</sub>p<sub>2</sub>…p<sub>n</sub> + 1. N &gt; 1 has a prime factor p; p is some p<sub>i</sub>, so p divides both N and N − 1 = p<sub>1</sub>…p<sub>n</sub>, hence divides 1 — impossible. ∎ (Note: N itself need not be prime: 2·3·5·7·11·13 + 1 = 30031 = 59 · 509.)</p></div>
<div class="callout"><p><b>Example 3 — cases.</b> <em>For every integer n, n<sup>2</sup> + n is even.</em> Case n even: n = 2k, n<sup>2</sup> + n = 2(2k<sup>2</sup> + k). Case n odd: n = 2k + 1, n<sup>2</sup> + n = (2k + 1)(2k + 2) = 2(2k + 1)(k + 1). ∎</p></div>
<div class="callout"><p><b>Example 4 — non-constructive.</b> <em>There exist irrational a, b with a<sup>b</sup> rational.</em> Consider √2<sup>√2</sup>. If it is rational, take a = b = √2. If not, take a = √2<sup>√2</sup>, b = √2: a<sup>b</sup> = √2<sup>2</sup> = 2. Either way such a pair exists — we do not know which. ∎</p></div>
<div class="callout"><p><b>Example 5 — counterexample.</b> Euler noticed n<sup>2</sup> + n + 41 is prime for n = 0, 1, …, 39. Is it always prime?</p></div>
<pre><code class="language-python">def is_prime(n):
    if n &lt; 2:
        return False
    d = 2
    while d * d &lt;= n:
        if n % d == 0:
            return False
        d += 1
    return True

# Claim: n*n + n + 41 is prime for every n &gt;= 0.  Search for a counterexample.
for n in range(100):
    v = n * n + n + 41
    if not is_prime(v):
        print("counterexample: n =", n, "value =", v, "=", 41, "*", v // 41)
        break
print("primes for n = 0..39:", all(is_prime(n * n + n + 41) for n in range(40)))</code></pre>
<div class="out">counterexample: n = 40 value = 1681 = 41 * 41
primes for n = 0..39: True</div>
<p>Forty successes, then failure at n = 40: 40<sup>2</sup> + 40 + 41 = 41<sup>2</sup>. One counterexample kills the claim.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>In a contradiction proof, never reaching an actual contradiction — just proving something true and stopping.</li><li>Cases that do not cover everything (forgetting n = 0 or negative numbers).</li><li>Using WLOG when the cases are not symmetric.</li><li>“Disproving” an existence claim with one example where it fails.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Contradiction: assume ¬P, derive r ∧ ¬r.</li><li>Cases must be exhaustive; WLOG only for genuine symmetry.</li><li>Existence: constructive (show it) or non-constructive; uniqueness needs a second argument.</li><li>One counterexample refutes a ∀-claim.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://brilliant.org/wiki/proof-by-contradiction/" target="_blank" rel="noopener">Brilliant — Proof by Contradiction</a></li><li><a href="https://en.wikipedia.org/wiki/Euclid%27s_theorem" target="_blank" rel="noopener">Wikipedia — Euclid's theorem (infinitely many primes)</a></li><li><a href="https://en.wikipedia.org/wiki/Square_root_of_2" target="_blank" rel="noopener">Wikipedia — Square root of 2 (irrationality proofs)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Prove by contradiction: there is no largest even integer.</li><li>Prove by cases: |xy| = |x||y| for all reals x, y.</li><li>Disprove: “if n is a positive integer then 2<sup>n</sup> + 1 is prime.”</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) If N were the largest even integer, N + 2 is even and larger — contradiction. 2) Four sign cases (x ≥ 0 or &lt; 0, y ≥ 0 or &lt; 0); e.g. x &lt; 0 ≤ y: xy ≤ 0, |xy| = −xy = (−x)y = |x||y|. 3) n = 3: 2<sup>3</sup> + 1 = 9 = 3 · 3.</p></div>`,
  `<span class="eyebrow">MAD102 · Chương 2 · Bài 2.2</span>
<h2>Phản chứng, chia trường hợp, chứng minh tồn tại và phản ví dụ</h2>
<p class="lead">Có những định lý không có dạng “nếu P thì Q” rõ ràng: “√2 vô tỉ”, “có vô hạn số nguyên tố”, “tồn tại chiến lược thắng”. Bài này bổ sung các công cụ chuẩn còn lại, và công cụ duy nhất để chỉ ra một khẳng định là <em>sai</em>.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Chứng minh một mệnh đề bằng phản chứng.</li><li>Chia chứng minh thành các trường hợp phủ kín, dùng đúng “không mất tổng quát”.</li><li>Phân biệt chứng minh tồn tại kiến thiết và không kiến thiết; bác bỏ câu “với mọi” bằng phản ví dụ.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Phản chứng.</strong> Để chứng minh P, giả sử ¬P và suy ra mâu thuẫn (một mệnh đề r ∧ ¬r). Vì ¬P → F chỉ đúng khi ¬P sai, nên P đúng. Với P → Q, giả sử P ∧ ¬Q rồi đi tới mâu thuẫn.</p>
<p><strong>Chia trường hợp.</strong> Nếu P<sub>1</sub> ∨ P<sub>2</sub> ∨ … ∨ P<sub>k</sub> phủ mọi khả năng, chứng minh Q trong từng trường hợp. Các trường hợp phải <em>phủ kín</em>. Khi hai trường hợp đối xứng, viết “không mất tổng quát (KMTQ) giả sử x ≤ y” và chỉ làm một — nhưng chỉ khi trường hợp kia thật sự là cùng lập luận, đổi tên biến.</p>
<p><strong>Chứng minh tồn tại.</strong> Chứng minh <em>kiến thiết</em> đưa ra nhân chứng (“1729 = 1<sup>3</sup> + 12<sup>3</sup> = 9<sup>3</sup> + 10<sup>3</sup>, vậy tồn tại số là tổng hai lập phương theo hai cách”). Chứng minh <em>không kiến thiết</em> chỉ ra sự tồn tại mà không nêu tên đối tượng, thường bằng chia trường hợp hoặc phản chứng. <strong>Duy nhất</strong> cần hai phần: tồn tại, và “nếu x, y cùng thoả thì x = y”.</p>
<p><strong>Phản ví dụ.</strong> Để bác bỏ ∀x P(x), chỉ cần một x có ¬P(x). Nhiều quy luật trông hợp lý rồi cũng gãy, đó là lý do thử nghiệm không phải chứng minh.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — √2 vô tỉ.</b> Giả sử √2 = p/q tối giản (gcd(p, q) = 1). Khi đó p<sup>2</sup> = 2q<sup>2</sup>, nên p<sup>2</sup> chẵn, nên p chẵn (Bài 2.1), p = 2k. Suy ra 4k<sup>2</sup> = 2q<sup>2</sup>, q<sup>2</sup> = 2k<sup>2</sup>, nên q chẵn. Cả p và q chẵn mâu thuẫn với tối giản. ∎</p></div>
<div class="callout"><p><b>Ví dụ 2 — vô hạn số nguyên tố (Euclid).</b> Giả sử p<sub>1</sub>, …, p<sub>n</sub> là tất cả số nguyên tố. Đặt N = p<sub>1</sub>p<sub>2</sub>…p<sub>n</sub> + 1. N &gt; 1 có ước nguyên tố p; p là một p<sub>i</sub> nào đó, nên p chia hết cả N và N − 1 = p<sub>1</sub>…p<sub>n</sub>, do đó chia hết 1 — vô lý. ∎ (Chú ý: bản thân N không nhất thiết nguyên tố: 2·3·5·7·11·13 + 1 = 30031 = 59 · 509.)</p></div>
<div class="callout"><p><b>Ví dụ 3 — chia trường hợp.</b> <em>Với mọi số nguyên n, n<sup>2</sup> + n chẵn.</em> n chẵn: n = 2k, n<sup>2</sup> + n = 2(2k<sup>2</sup> + k). n lẻ: n = 2k + 1, n<sup>2</sup> + n = (2k + 1)(2k + 2) = 2(2k + 1)(k + 1). ∎</p></div>
<div class="callout"><p><b>Ví dụ 4 — không kiến thiết.</b> <em>Tồn tại hai số vô tỉ a, b với a<sup>b</sup> hữu tỉ.</em> Xét √2<sup>√2</sup>. Nếu nó hữu tỉ, chọn a = b = √2. Nếu không, chọn a = √2<sup>√2</sup>, b = √2: a<sup>b</sup> = √2<sup>2</sup> = 2. Trường hợp nào cũng có cặp như vậy — ta không biết là trường hợp nào. ∎</p></div>
<div class="callout"><p><b>Ví dụ 5 — phản ví dụ.</b> Euler nhận thấy n<sup>2</sup> + n + 41 nguyên tố với n = 0, 1, …, 39. Có phải luôn nguyên tố?</p></div>
<pre><code class="language-python">def is_prime(n):
    if n &lt; 2:
        return False
    d = 2
    while d * d &lt;= n:
        if n % d == 0:
            return False
        d += 1
    return True

# Claim: n*n + n + 41 is prime for every n &gt;= 0.  Search for a counterexample.
for n in range(100):
    v = n * n + n + 41
    if not is_prime(v):
        print("counterexample: n =", n, "value =", v, "=", 41, "*", v // 41)
        break
print("primes for n = 0..39:", all(is_prime(n * n + n + 41) for n in range(40)))</code></pre>
<div class="out">counterexample: n = 40 value = 1681 = 41 * 41
primes for n = 0..39: True</div>
<p>Bốn mươi lần đúng, rồi gãy ở n = 40: 40<sup>2</sup> + 40 + 41 = 41<sup>2</sup>. Một phản ví dụ là đủ bác bỏ khẳng định.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Trong phản chứng, không bao giờ đi tới mâu thuẫn thật — chỉ chứng minh một điều đúng rồi dừng.</li><li>Các trường hợp không phủ kín (quên n = 0 hoặc số âm).</li><li>Dùng KMTQ khi các trường hợp không đối xứng.</li><li>“Bác bỏ” câu tồn tại bằng một ví dụ không thoả.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Phản chứng: giả sử ¬P, suy ra r ∧ ¬r.</li><li>Trường hợp phải phủ kín; KMTQ chỉ khi thật sự đối xứng.</li><li>Tồn tại: kiến thiết (chỉ ra) hoặc không kiến thiết; duy nhất cần lập luận thứ hai.</li><li>Một phản ví dụ bác bỏ câu “với mọi”.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://brilliant.org/wiki/proof-by-contradiction/" target="_blank" rel="noopener">Brilliant — Proof by Contradiction</a></li><li><a href="https://en.wikipedia.org/wiki/Euclid%27s_theorem" target="_blank" rel="noopener">Wikipedia — Euclid's theorem (vô hạn số nguyên tố)</a></li><li><a href="https://en.wikipedia.org/wiki/Square_root_of_2" target="_blank" rel="noopener">Wikipedia — Square root of 2 (các chứng minh vô tỉ)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Chứng minh bằng phản chứng: không có số nguyên chẵn lớn nhất.</li><li>Chứng minh bằng chia trường hợp: |xy| = |x||y| với mọi số thực x, y.</li><li>Bác bỏ: “nếu n nguyên dương thì 2<sup>n</sup> + 1 là số nguyên tố.”</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Nếu N là số chẵn lớn nhất thì N + 2 chẵn và lớn hơn — mâu thuẫn. 2) Bốn trường hợp dấu (x ≥ 0 hoặc &lt; 0, y ≥ 0 hoặc &lt; 0); vd x &lt; 0 ≤ y: xy ≤ 0, |xy| = −xy = (−x)y = |x||y|. 3) n = 3: 2<sup>3</sup> + 1 = 9 = 3 · 3.</p></div>`);

const c23 = L('mad102-ts-2-3',
  '2.3 — Mathematical induction, strong induction and well-ordering|||2.3 — Quy nạp toán học, quy nạp mạnh và nguyên lý sắp thứ tự tốt',
  'Nguyên lý quy nạp (bước cơ sở + bước quy nạp), ví dụ tổng, bất đẳng thức, chia hết; quy nạp mạnh (phân tích thừa số nguyên tố, bài tem thư) có code đệ quy; nguyên lý sắp thứ tự tốt.',
  `<span class="eyebrow">MAD102 · Chapter 2 · Lesson 2.3</span>
<h2>Mathematical induction, strong induction and well-ordering</h2>
<p class="lead">Induction is the proof technique of computer science: it proves statements about all natural numbers, all inputs of a recursive function, all iterations of a loop. Think of a row of dominoes: knock over the first, make sure each one knocks over the next, and all of them fall.</p>
<h3>🎯 Objectives</h3>
<ul><li>Write a complete induction proof with base case, inductive hypothesis and inductive step.</li><li>Use strong induction when step n needs several earlier cases.</li><li>Relate induction to the well-ordering principle and to recursive algorithms.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Principle of induction</span>[ P(b) ∧ ∀k ≥ b (P(k) → P(k + 1)) ] → ∀n ≥ b P(n)</div>
<p>A proof has three labelled parts. <strong>Basis:</strong> verify P(b). <strong>Inductive hypothesis (IH):</strong> “assume P(k) for an arbitrary k ≥ b”. <strong>Inductive step:</strong> prove P(k + 1), and point to where the IH is used. Note that we do <em>not</em> assume what we want to prove: we assume P(k) for one k and prove the implication P(k) → P(k + 1).</p>
<div class="formula"><span class="lbl">Strong induction</span>[ P(b) ∧ ∀k ≥ b ((P(b) ∧ … ∧ P(k)) → P(k + 1)) ] → ∀n ≥ b P(n)</div>
<p>Strong induction lets the step use <em>all</em> earlier cases. It is no more powerful logically, but it is far more convenient when n + 1 breaks into pieces that are not just n (factorisations, recursive algorithms that halve the input). If the step only reaches back a fixed distance (n − 4, say), you need that many base cases.</p>
<p>The <strong>well-ordering principle</strong>: every non-empty set of non-negative integers has a least element. It is equivalent to induction and gives “minimal counterexample” proofs: suppose the claim fails, take the smallest failing n, and show a smaller one also fails.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — a sum.</b> P(n): 1 + 2 + … + n = n(n + 1)/2 for n ≥ 1. Basis: 1 = 1·2/2. Step: assume P(k). Then 1 + … + k + (k + 1) = k(k + 1)/2 + (k + 1) (by IH) = (k + 1)(k + 2)/2, which is P(k + 1). ∎</p></div>
<div class="callout"><p><b>Example 2 — an inequality.</b> 2<sup>n</sup> &gt; n<sup>2</sup> for n ≥ 5. Basis: 32 &gt; 25. Step: assume 2<sup>k</sup> &gt; k<sup>2</sup> with k ≥ 5. Then 2<sup>k+1</sup> = 2·2<sup>k</sup> &gt; 2k<sup>2</sup> = k<sup>2</sup> + k<sup>2</sup> ≥ k<sup>2</sup> + 5k &gt; k<sup>2</sup> + 2k + 1 = (k + 1)<sup>2</sup>. ∎ (For n = 2, 3, 4 the claim is false — the base case matters.)</p></div>
<div class="callout"><p><b>Example 3 — divisibility.</b> 3 | n<sup>3</sup> − n for n ≥ 0. Basis: 0. Step: (k + 1)<sup>3</sup> − (k + 1) = (k<sup>3</sup> − k) + 3(k<sup>2</sup> + k), both terms divisible by 3. ∎</p></div>
<div class="callout"><p><b>Example 4 — strong induction.</b> Every n ≥ 2 is a product of primes. If n + 1 is prime, done. Otherwise n + 1 = ab with 2 ≤ a, b ≤ n, and by the strong IH both a and b are products of primes. ∎</p></div>
<div class="callout"><p><b>Example 5 — strong induction as code.</b> Every amount n ≥ 12 cents can be paid with 4-cent and 5-cent stamps. Bases: 12, 13, 14, 15. Step for n ≥ 16: pay n − 4 (true by IH), add one 4-cent stamp. The recursion <em>is</em> the proof:</p></div>
<pre><code class="language-python"># Strong induction in code: every amount n &gt;= 12 cents can be paid with 4c and 5c stamps.
def stamps(n):
    """Return (fours, fives) with 4*fours + 5*fives == n, for n &gt;= 12."""
    base = {12: (3, 0), 13: (2, 1), 14: (1, 2), 15: (0, 3)}
    if n in base:
        return base[n]
    f, v = stamps(n - 4)          # inductive step: use the answer for n - 4
    return (f + 1, v)

for n in [12, 13, 14, 15, 16, 23, 31]:
    f, v = stamps(n)
    print(n, "=", f, "x 4 +", v, "x 5")
print(all(4 * a + 5 * b == n for n in range(12, 500) for a, b in [stamps(n)]))</code></pre>
<div class="out">12 = 3 x 4 + 0 x 5
13 = 2 x 4 + 1 x 5
14 = 1 x 4 + 2 x 5
15 = 0 x 4 + 3 x 5
16 = 4 x 4 + 0 x 5
23 = 2 x 4 + 3 x 5
31 = 4 x 4 + 3 x 5
True</div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Skipping the basis — the “proof” that n = n + 1 has a valid step but no base.</li><li>Writing the step as “assume P(n) for all n” — that assumes the theorem.</li><li>Too few base cases for a step that reaches back several values.</li><li>The classic “all horses have the same colour” bug: the step from k = 1 to 2 silently uses an overlap that does not exist.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Induction = basis + (P(k) → P(k + 1)) for arbitrary k.</li><li>Strong induction assumes P(b), …, P(k); needs enough base cases.</li><li>Well-ordering ⇔ induction; use minimal counterexamples.</li><li>Recursive programs mirror inductive proofs.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_seq-induction.html" target="_blank" rel="noopener">Levin, DMOI 4.5 — Proof by Induction</a></li><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_seq-strong-induction.html" target="_blank" rel="noopener">Levin, DMOI 4.6 — Strong Induction</a></li><li><a href="https://brilliant.org/wiki/strong-induction/" target="_blank" rel="noopener">Brilliant — Strong Induction</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Prove 1 + 3 + 5 + … + (2n − 1) = n<sup>2</sup> for n ≥ 1.</li><li>Prove 6 | 7<sup>n</sup> − 1 for n ≥ 0.</li><li>Which amounts can be paid with 3-cent and 5-cent coins? State the claim and the base cases for strong induction.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Basis 1 = 1<sup>2</sup>; step k<sup>2</sup> + (2k + 1) = (k + 1)<sup>2</sup>. 2) Basis 7<sup>0</sup> − 1 = 0; step 7<sup>k+1</sup> − 1 = 7(7<sup>k</sup> − 1) + 6. 3) Every n ≥ 8; bases 8 = 3 + 5, 9 = 3 + 3 + 3, 10 = 5 + 5; step: pay n − 3 then add a 3.</p></div>`,
  `<span class="eyebrow">MAD102 · Chương 2 · Bài 2.3</span>
<h2>Quy nạp toán học, quy nạp mạnh và nguyên lý sắp thứ tự tốt</h2>
<p class="lead">Quy nạp là kỹ thuật chứng minh của khoa học máy tính: nó chứng minh mệnh đề cho mọi số tự nhiên, mọi đầu vào của hàm đệ quy, mọi vòng lặp. Hãy nghĩ tới dãy quân domino: làm đổ quân đầu, bảo đảm mỗi quân làm đổ quân kế tiếp, thì tất cả sẽ đổ.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Viết chứng minh quy nạp đầy đủ: bước cơ sở, giả thiết quy nạp, bước quy nạp.</li><li>Dùng quy nạp mạnh khi bước n cần nhiều trường hợp trước đó.</li><li>Liên hệ quy nạp với nguyên lý sắp thứ tự tốt và thuật toán đệ quy.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Nguyên lý quy nạp</span>[ P(b) ∧ ∀k ≥ b (P(k) → P(k + 1)) ] → ∀n ≥ b P(n)</div>
<p>Một chứng minh có ba phần có nhãn. <strong>Cơ sở:</strong> kiểm P(b). <strong>Giả thiết quy nạp (GTQN):</strong> “giả sử P(k) đúng với k ≥ b tuỳ ý”. <strong>Bước quy nạp:</strong> chứng minh P(k + 1), và chỉ rõ chỗ dùng GTQN. Chú ý ta <em>không</em> giả sử điều cần chứng minh: ta giả sử P(k) cho một k và chứng minh phép kéo theo P(k) → P(k + 1).</p>
<div class="formula"><span class="lbl">Quy nạp mạnh</span>[ P(b) ∧ ∀k ≥ b ((P(b) ∧ … ∧ P(k)) → P(k + 1)) ] → ∀n ≥ b P(n)</div>
<p>Quy nạp mạnh cho phép bước quy nạp dùng <em>mọi</em> trường hợp trước. Về logic nó không mạnh hơn, nhưng tiện hơn nhiều khi n + 1 tách thành các mảnh không phải n (phân tích thừa số, thuật toán đệ quy chia đôi đầu vào). Nếu bước quy nạp chỉ lùi một khoảng cố định (vd n − 4) thì cần đủ chừng ấy trường hợp cơ sở.</p>
<p><strong>Nguyên lý sắp thứ tự tốt</strong>: mọi tập khác rỗng các số nguyên không âm đều có phần tử nhỏ nhất. Nó tương đương quy nạp và cho kiểu chứng minh “phản ví dụ nhỏ nhất”: giả sử khẳng định sai, lấy n nhỏ nhất làm nó sai, rồi chỉ ra một số nhỏ hơn cũng làm nó sai.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — một tổng.</b> P(n): 1 + 2 + … + n = n(n + 1)/2 với n ≥ 1. Cơ sở: 1 = 1·2/2. Bước: giả sử P(k). Khi đó 1 + … + k + (k + 1) = k(k + 1)/2 + (k + 1) (theo GTQN) = (k + 1)(k + 2)/2, chính là P(k + 1). ∎</p></div>
<div class="callout"><p><b>Ví dụ 2 — bất đẳng thức.</b> 2<sup>n</sup> &gt; n<sup>2</sup> với n ≥ 5. Cơ sở: 32 &gt; 25. Bước: giả sử 2<sup>k</sup> &gt; k<sup>2</sup> với k ≥ 5. Khi đó 2<sup>k+1</sup> = 2·2<sup>k</sup> &gt; 2k<sup>2</sup> = k<sup>2</sup> + k<sup>2</sup> ≥ k<sup>2</sup> + 5k &gt; k<sup>2</sup> + 2k + 1 = (k + 1)<sup>2</sup>. ∎ (Với n = 2, 3, 4 khẳng định sai — bước cơ sở quan trọng.)</p></div>
<div class="callout"><p><b>Ví dụ 3 — chia hết.</b> 3 | n<sup>3</sup> − n với n ≥ 0. Cơ sở: 0. Bước: (k + 1)<sup>3</sup> − (k + 1) = (k<sup>3</sup> − k) + 3(k<sup>2</sup> + k), cả hai hạng tử chia hết cho 3. ∎</p></div>
<div class="callout"><p><b>Ví dụ 4 — quy nạp mạnh.</b> Mọi n ≥ 2 là tích các số nguyên tố. Nếu n + 1 nguyên tố thì xong. Ngược lại n + 1 = ab với 2 ≤ a, b ≤ n, và theo GTQN mạnh cả a, b đều là tích các số nguyên tố. ∎</p></div>
<div class="callout"><p><b>Ví dụ 5 — quy nạp mạnh thành code.</b> Mọi số tiền n ≥ 12 xu đều trả được bằng tem 4 xu và 5 xu. Cơ sở: 12, 13, 14, 15. Bước với n ≥ 16: trả n − 4 (đúng theo GTQN), thêm một tem 4 xu. Đệ quy <em>chính là</em> chứng minh:</p></div>
<pre><code class="language-python"># Strong induction in code: every amount n &gt;= 12 cents can be paid with 4c and 5c stamps.
def stamps(n):
    """Return (fours, fives) with 4*fours + 5*fives == n, for n &gt;= 12."""
    base = {12: (3, 0), 13: (2, 1), 14: (1, 2), 15: (0, 3)}
    if n in base:
        return base[n]
    f, v = stamps(n - 4)          # inductive step: use the answer for n - 4
    return (f + 1, v)

for n in [12, 13, 14, 15, 16, 23, 31]:
    f, v = stamps(n)
    print(n, "=", f, "x 4 +", v, "x 5")
print(all(4 * a + 5 * b == n for n in range(12, 500) for a, b in [stamps(n)]))</code></pre>
<div class="out">12 = 3 x 4 + 0 x 5
13 = 2 x 4 + 1 x 5
14 = 1 x 4 + 2 x 5
15 = 0 x 4 + 3 x 5
16 = 4 x 4 + 0 x 5
23 = 2 x 4 + 3 x 5
31 = 4 x 4 + 3 x 5
True</div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Bỏ bước cơ sở — “chứng minh” n = n + 1 có bước quy nạp hợp lệ nhưng không có cơ sở.</li><li>Viết bước quy nạp thành “giả sử P(n) đúng với mọi n” — thế là giả sử luôn định lý.</li><li>Thiếu trường hợp cơ sở khi bước quy nạp lùi lại nhiều giá trị.</li><li>Lỗi kinh điển “mọi con ngựa cùng màu”: bước từ k = 1 lên 2 ngầm dùng một phần giao không tồn tại.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Quy nạp = cơ sở + (P(k) → P(k + 1)) với k tuỳ ý.</li><li>Quy nạp mạnh giả sử P(b), …, P(k); cần đủ trường hợp cơ sở.</li><li>Sắp thứ tự tốt ⇔ quy nạp; dùng phản ví dụ nhỏ nhất.</li><li>Chương trình đệ quy phản chiếu chứng minh quy nạp.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_seq-induction.html" target="_blank" rel="noopener">Levin, DMOI 4.5 — Proof by Induction</a></li><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_seq-strong-induction.html" target="_blank" rel="noopener">Levin, DMOI 4.6 — Strong Induction</a></li><li><a href="https://brilliant.org/wiki/strong-induction/" target="_blank" rel="noopener">Brilliant — Strong Induction</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Chứng minh 1 + 3 + 5 + … + (2n − 1) = n<sup>2</sup> với n ≥ 1.</li><li>Chứng minh 6 | 7<sup>n</sup> − 1 với n ≥ 0.</li><li>Những số tiền nào trả được bằng xu 3 và xu 5? Phát biểu khẳng định và các trường hợp cơ sở cho quy nạp mạnh.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Cơ sở 1 = 1<sup>2</sup>; bước k<sup>2</sup> + (2k + 1) = (k + 1)<sup>2</sup>. 2) Cơ sở 7<sup>0</sup> − 1 = 0; bước 7<sup>k+1</sup> − 1 = 7(7<sup>k</sup> − 1) + 6. 3) Mọi n ≥ 8; cơ sở 8 = 3 + 5, 9 = 3 + 3 + 3, 10 = 5 + 5; bước: trả n − 3 rồi thêm một xu 3.</p></div>`);

const c24 = L('mad102-ts-2-4',
  '2.4 — Recursive definitions, structural induction and loop invariants|||2.4 — Định nghĩa đệ quy, quy nạp cấu trúc và bất biến vòng lặp',
  'Định nghĩa đệ quy hàm và tập (xâu, cây nhị phân đầy đủ), quy nạp cấu trúc, tính đúng của thuật toán đệ quy, bất biến vòng lặp (lũy thừa nhanh) có assert chạy thật.',
  `<span class="eyebrow">MAD102 · Chapter 2 · Lesson 2.4</span>
<h2>Recursive definitions, structural induction and loop invariants</h2>
<p class="lead">Programs are full of recursively defined data: lists, strings, trees, JSON, arithmetic expressions. Structural induction proves facts about all of them, and loop invariants bring the same idea to <code>while</code> loops — the standard way to prove an algorithm correct.</p>
<h3>🎯 Objectives</h3>
<ul><li>Define functions and sets recursively (basis + recursive step + exclusion).</li><li>Prove properties of recursively defined structures by structural induction.</li><li>State a loop invariant and use it to prove partial correctness and termination.</li></ul>
<h3>📖 Lecture</h3>
<p>A <strong>recursively defined function</strong> on ℕ gives f(0) and a rule for f(n + 1) in terms of earlier values: factorial 0! = 1, (n + 1)! = (n + 1)·n!; Fibonacci f<sub>0</sub> = 0, f<sub>1</sub> = 1, f<sub>n</sub> = f<sub>n−1</sub> + f<sub>n−2</sub>.</p>
<p>A <strong>recursively defined set</strong> has a basis step (some elements), a recursive step (rules building new elements from old), and the implicit exclusion rule “nothing else”. Examples: the set Σ* of strings over alphabet Σ (basis: the empty string λ; step: if w ∈ Σ* and x ∈ Σ then wx ∈ Σ*); <strong>full binary trees</strong> (basis: a single vertex; step: a new root joined to two full binary trees T<sub>1</sub>, T<sub>2</sub>).</p>
<p><strong>Structural induction</strong>: to prove P for every element, prove P for the basis elements, then prove that each recursive rule preserves P (if the parts satisfy P, the new element does). No numbers are needed — we induct on how the object was built.</p>
<p><strong>Program correctness.</strong> A program is <em>partially correct</em> w.r.t. precondition p and postcondition q (Hoare triple p{S}q) if whenever p holds before S and S terminates, q holds after. A <strong>loop invariant</strong> is a statement that is true before the loop and is preserved by every iteration; when the loop exits, invariant ∧ ¬(loop condition) gives the postcondition. Termination is shown separately, usually with a non-negative integer that strictly decreases each iteration.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — structural induction.</b> For a full binary tree T let n(T) be its number of vertices and h(T) its height. Claim: n(T) ≤ 2<sup>h(T)+1</sup> − 1.<br>Basis: one vertex, n = 1, h = 0, and 1 ≤ 2<sup>1</sup> − 1. Step: T has root plus T<sub>1</sub>, T<sub>2</sub>, h(T) = 1 + max(h(T<sub>1</sub>), h(T<sub>2</sub>)). Then n(T) = 1 + n(T<sub>1</sub>) + n(T<sub>2</sub>) ≤ 1 + (2<sup>h(T1)+1</sup> − 1) + (2<sup>h(T2)+1</sup> − 1) ≤ 2·2<sup>max+1</sup> − 1 = 2<sup>h(T)+1</sup> − 1. ∎</p></div>
<div class="callout"><p><b>Example 2 — strings.</b> Define length l(λ) = 0, l(wx) = l(w) + 1. Prove l(uv) = l(u) + l(v) by structural induction on v: basis v = λ is trivial; if it holds for v then l(u(vx)) = l((uv)x) = l(uv) + 1 = l(u) + l(v) + 1 = l(u) + l(vx). ∎</p></div>
<div class="callout"><p><b>Example 3 — a loop invariant.</b> Fast exponentiation keeps the invariant <em>result · base<sup>e</sup> = x<sup>n</sup></em>. Initially result = 1, base = x, e = n: true. If e is odd we multiply result by base and the halving of e with squaring of base keeps the product unchanged. At exit e = 0, so result = x<sup>n</sup>. Termination: e is a non-negative integer that strictly decreases. The <code>assert</code> statements below check the invariant on every iteration:</p></div>
<pre><code class="language-python">def power(x, n):
    """Compute x**n with O(log n) multiplications; the invariant is checked every loop."""
    result, base, e = 1, x, n
    while e &gt; 0:
        assert result * base ** e == x ** n      # loop invariant
        if e % 2 == 1:
            result *= base
        base *= base
        e //= 2
    assert result * base ** e == x ** n and e == 0   # invariant + exit condition
    return result

print(power(3, 13), 3 ** 13)
print(power(2, 100) == 2 ** 100)</code></pre>
<div class="out">1594323 1594323
True</div>
<p>The loop runs ⌊log<sub>2</sub> n⌋ + 1 times, so x<sup>n</sup> costs O(log n) multiplications instead of n − 1. The same loop with “mod m” is the core of RSA (Chapter 6).</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Forgetting a basis element or a recursive rule in a structural induction — every way of building an object must be covered.</li><li>An “invariant” that is not true before the first iteration.</li><li>Proving the invariant but forgetting to show the loop terminates (partial vs total correctness).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Recursive definition = basis + recursive rules + nothing else.</li><li>Structural induction: basis elements, then each rule preserves P.</li><li>Invariant: true initially, preserved by each iteration; invariant ∧ exit condition ⇒ postcondition.</li><li>Termination: a decreasing non-negative quantity.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Structural_induction" target="_blank" rel="noopener">Wikipedia — Structural induction</a></li><li><a href="https://en.wikipedia.org/wiki/Loop_invariant" target="_blank" rel="noopener">Wikipedia — Loop invariant</a></li><li><a href="https://en.wikipedia.org/wiki/Hoare_logic" target="_blank" rel="noopener">Wikipedia — Hoare logic</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Give a recursive definition of the set of positive integers divisible by 3.</li><li>Prove by structural induction that a full binary tree with i internal vertices has i + 1 leaves.</li><li>State a loop invariant for <code>s = 0; i = 0; while i &lt; n: i += 1; s += i</code> that proves s = n(n + 1)/2 at the end.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Basis 3 ∈ S; step: if x ∈ S then x + 3 ∈ S. 2) Basis: one vertex, 0 internal, 1 leaf. Step: new root is internal, i = i<sub>1</sub> + i<sub>2</sub> + 1, leaves = (i<sub>1</sub> + 1) + (i<sub>2</sub> + 1) = i + 1. 3) Invariant s = i(i + 1)/2 and 0 ≤ i ≤ n; at exit i = n.</p></div>`,
  `<span class="eyebrow">MAD102 · Chương 2 · Bài 2.4</span>
<h2>Định nghĩa đệ quy, quy nạp cấu trúc và bất biến vòng lặp</h2>
<p class="lead">Chương trình đầy dữ liệu định nghĩa đệ quy: danh sách, xâu, cây, JSON, biểu thức số học. Quy nạp cấu trúc chứng minh tính chất cho tất cả chúng, còn bất biến vòng lặp đưa cùng ý tưởng đó vào vòng <code>while</code> — cách chuẩn để chứng minh thuật toán đúng.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Định nghĩa hàm và tập bằng đệ quy (cơ sở + bước đệ quy + loại trừ).</li><li>Chứng minh tính chất của cấu trúc đệ quy bằng quy nạp cấu trúc.</li><li>Phát biểu bất biến vòng lặp và dùng nó chứng minh tính đúng bộ phận và tính dừng.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Hàm định nghĩa đệ quy</strong> trên ℕ cho f(0) và quy tắc tính f(n + 1) theo các giá trị trước: giai thừa 0! = 1, (n + 1)! = (n + 1)·n!; Fibonacci f<sub>0</sub> = 0, f<sub>1</sub> = 1, f<sub>n</sub> = f<sub>n−1</sub> + f<sub>n−2</sub>.</p>
<p><strong>Tập định nghĩa đệ quy</strong> có bước cơ sở (vài phần tử), bước đệ quy (quy tắc tạo phần tử mới từ phần tử cũ) và quy tắc loại trừ ngầm “không còn gì khác”. Ví dụ: tập Σ* các xâu trên bảng chữ Σ (cơ sở: xâu rỗng λ; bước: nếu w ∈ Σ* và x ∈ Σ thì wx ∈ Σ*); <strong>cây nhị phân đầy đủ</strong> (cơ sở: một đỉnh; bước: gốc mới nối với hai cây nhị phân đầy đủ T<sub>1</sub>, T<sub>2</sub>).</p>
<p><strong>Quy nạp cấu trúc</strong>: để chứng minh P cho mọi phần tử, chứng minh P cho các phần tử cơ sở, rồi chứng minh mỗi quy tắc đệ quy giữ P (nếu các phần ghép thoả P thì phần tử mới thoả P). Không cần số — ta quy nạp theo cách đối tượng được dựng lên.</p>
<p><strong>Tính đúng của chương trình.</strong> Chương trình <em>đúng bộ phận</em> với tiền điều kiện p và hậu điều kiện q (bộ ba Hoare p{S}q) nếu hễ p đúng trước S và S dừng thì q đúng sau. <strong>Bất biến vòng lặp</strong> là mệnh đề đúng trước vòng lặp và được giữ qua mỗi lần lặp; khi thoát vòng, bất biến ∧ ¬(điều kiện lặp) cho hậu điều kiện. Tính dừng chứng minh riêng, thường bằng một số nguyên không âm giảm ngặt sau mỗi lần lặp.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — quy nạp cấu trúc.</b> Với cây nhị phân đầy đủ T, gọi n(T) là số đỉnh, h(T) là chiều cao. Khẳng định: n(T) ≤ 2<sup>h(T)+1</sup> − 1.<br>Cơ sở: một đỉnh, n = 1, h = 0, và 1 ≤ 2<sup>1</sup> − 1. Bước: T gồm gốc và T<sub>1</sub>, T<sub>2</sub>, h(T) = 1 + max(h(T<sub>1</sub>), h(T<sub>2</sub>)). Khi đó n(T) = 1 + n(T<sub>1</sub>) + n(T<sub>2</sub>) ≤ 1 + (2<sup>h(T1)+1</sup> − 1) + (2<sup>h(T2)+1</sup> − 1) ≤ 2·2<sup>max+1</sup> − 1 = 2<sup>h(T)+1</sup> − 1. ∎</p></div>
<div class="callout"><p><b>Ví dụ 2 — xâu.</b> Định nghĩa độ dài l(λ) = 0, l(wx) = l(w) + 1. Chứng minh l(uv) = l(u) + l(v) bằng quy nạp cấu trúc theo v: cơ sở v = λ hiển nhiên; nếu đúng với v thì l(u(vx)) = l((uv)x) = l(uv) + 1 = l(u) + l(v) + 1 = l(u) + l(vx). ∎</p></div>
<div class="callout"><p><b>Ví dụ 3 — bất biến vòng lặp.</b> Lũy thừa nhanh giữ bất biến <em>result · base<sup>e</sup> = x<sup>n</sup></em>. Ban đầu result = 1, base = x, e = n: đúng. Nếu e lẻ ta nhân result với base, rồi việc chia đôi e cùng bình phương base giữ nguyên tích. Khi thoát e = 0 nên result = x<sup>n</sup>. Tính dừng: e là số nguyên không âm giảm ngặt. Các lệnh <code>assert</code> dưới đây kiểm bất biến ở mọi lần lặp:</p></div>
<pre><code class="language-python">def power(x, n):
    """Compute x**n with O(log n) multiplications; the invariant is checked every loop."""
    result, base, e = 1, x, n
    while e &gt; 0:
        assert result * base ** e == x ** n      # loop invariant
        if e % 2 == 1:
            result *= base
        base *= base
        e //= 2
    assert result * base ** e == x ** n and e == 0   # invariant + exit condition
    return result

print(power(3, 13), 3 ** 13)
print(power(2, 100) == 2 ** 100)</code></pre>
<div class="out">1594323 1594323
True</div>
<p>Vòng lặp chạy ⌊log<sub>2</sub> n⌋ + 1 lần, nên x<sup>n</sup> chỉ tốn O(log n) phép nhân thay vì n − 1. Cũng vòng lặp đó thêm “mod m” là lõi của RSA (Chương 6).</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Quên một phần tử cơ sở hoặc một quy tắc đệ quy trong quy nạp cấu trúc — mọi cách dựng đối tượng đều phải được xét.</li><li>“Bất biến” không đúng trước lần lặp đầu tiên.</li><li>Chứng minh bất biến nhưng quên chứng minh vòng lặp dừng (đúng bộ phận khác đúng hoàn toàn).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Định nghĩa đệ quy = cơ sở + quy tắc đệ quy + không còn gì khác.</li><li>Quy nạp cấu trúc: phần tử cơ sở, rồi mỗi quy tắc giữ P.</li><li>Bất biến: đúng ban đầu, được giữ qua mỗi lần lặp; bất biến ∧ điều kiện thoát ⇒ hậu điều kiện.</li><li>Tính dừng: một đại lượng không âm giảm dần.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Structural_induction" target="_blank" rel="noopener">Wikipedia — Structural induction</a></li><li><a href="https://en.wikipedia.org/wiki/Loop_invariant" target="_blank" rel="noopener">Wikipedia — Loop invariant</a></li><li><a href="https://en.wikipedia.org/wiki/Hoare_logic" target="_blank" rel="noopener">Wikipedia — Hoare logic</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Định nghĩa đệ quy tập các số nguyên dương chia hết cho 3.</li><li>Chứng minh bằng quy nạp cấu trúc: cây nhị phân đầy đủ có i đỉnh trong thì có i + 1 lá.</li><li>Phát biểu bất biến vòng lặp cho <code>s = 0; i = 0; while i &lt; n: i += 1; s += i</code> để chứng minh s = n(n + 1)/2 khi kết thúc.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Cơ sở 3 ∈ S; bước: nếu x ∈ S thì x + 3 ∈ S. 2) Cơ sở: một đỉnh, 0 đỉnh trong, 1 lá. Bước: gốc mới là đỉnh trong, i = i<sub>1</sub> + i<sub>2</sub> + 1, số lá = (i<sub>1</sub> + 1) + (i<sub>2</sub> + 1) = i + 1. 3) Bất biến s = i(i + 1)/2 và 0 ≤ i ≤ n; khi thoát i = n.</p></div>`);

const q2 = QZ(2, 'Quiz — Chapter 2: Proofs and induction|||Quiz — Chương 2: Chứng minh và quy nạp', 'Kiểm tra chương 2: trực tiếp, phản đảo, phản chứng, phản ví dụ, quy nạp thường/mạnh, quy nạp cấu trúc, bất biến vòng lặp.', [
  Q('q1', 'To prove “if n² is even then n is even”, the most convenient method is|||Để chứng minh “nếu n² chẵn thì n chẵn”, cách thuận tiện nhất là',
    ['direct proof|||chứng minh trực tiếp', 'contrapositive|||chứng minh phản đảo', 'counterexample|||phản ví dụ', 'structural induction|||quy nạp cấu trúc'], 1,
    'Prove “n odd ⇒ n² odd” instead.|||Chứng minh “n lẻ ⇒ n² lẻ” thay thế.'),
  Q('q2', 'In the proof that √2 is irrational, the contradiction is that|||Trong chứng minh √2 vô tỉ, mâu thuẫn nằm ở chỗ',
    ['p² is negative|||p² âm', 'p and q are both even, contradicting lowest terms|||p và q đều chẵn, trái với tối giản', '2 is not prime|||2 không nguyên tố', 'q = 0|||q = 0'], 1,
    'Both p and q turn out even although gcd(p, q) = 1.|||Cả p và q đều chẵn dù gcd(p, q) = 1.'),
  Q('q3', 'n² + n + 41 is first composite at|||n² + n + 41 lần đầu là hợp số tại',
    ['n = 10|||n = 10', 'n = 39|||n = 39', 'n = 40|||n = 40', 'never|||không bao giờ'], 2,
    '40² + 40 + 41 = 1681 = 41².|||40² + 40 + 41 = 1681 = 41².'),
  Q('q4', 'An induction proof that 2ⁿ exceeds n² should start at|||Chứng minh quy nạp “2ⁿ lớn hơn n²” nên bắt đầu từ',
    ['n = 1|||n = 1', 'n = 3|||n = 3', 'n = 5|||n = 5', 'n = 0 only|||chỉ n = 0'], 2,
    'It fails for n = 2, 3, 4 (4 = 4, 8 is less than 9, 16 = 16) and holds from n = 5.|||Sai với n = 2, 3, 4 (4 = 4, 8 nhỏ hơn 9, 16 = 16) và đúng từ n = 5.'),
  Q('q5', 'In the inductive step we assume|||Trong bước quy nạp ta giả sử',
    ['P(n) for all n|||P(n) với mọi n', 'P(k) for an arbitrary k and prove P(k + 1)|||P(k) với k tuỳ ý rồi chứng minh P(k + 1)', 'P(k + 1)|||P(k + 1)', 'nothing|||không gì cả'], 1,
    'Assuming P(n) for all n would assume the theorem.|||Giả sử P(n) với mọi n là giả sử luôn định lý.'),
  Q('q6', 'Postage “n = 4a + 5b for n ≥ 12” proved by stepping from n − 4 needs how many base cases?|||Bài tem “n = 4a + 5b với n ≥ 12” chứng minh bằng bước lùi n − 4 cần bao nhiêu trường hợp cơ sở?',
    ['1|||1', '2|||2', '4|||4', '12|||12'], 2,
    'Bases 12, 13, 14, 15; then n − 4 is always one of the earlier cases.|||Cơ sở 12, 13, 14, 15; sau đó n − 4 luôn rơi vào trường hợp trước.'),
  Q('q7', 'A full binary tree with 10 internal vertices has how many leaves?|||Cây nhị phân đầy đủ có 10 đỉnh trong thì có bao nhiêu lá?',
    ['9|||9', '10|||10', '11|||11', '20|||20'], 2,
    'Leaves = internal + 1 (structural induction).|||Số lá = số đỉnh trong + 1 (quy nạp cấu trúc).'),
  Q('q8', 'A loop invariant must be|||Bất biến vòng lặp phải',
    ['true only after the loop|||chỉ đúng sau vòng lặp', 'true before the loop and preserved by each iteration|||đúng trước vòng lặp và được giữ qua mỗi lần lặp', 'false at exit|||sai khi thoát', 'the loop condition|||chính là điều kiện lặp'], 1,
    'Then invariant ∧ exit condition gives the postcondition.|||Khi đó bất biến ∧ điều kiện thoát cho hậu điều kiện.'),
  Q('q9', 'Showing “there exist irrational a, b with aᵇ rational” via the two cases √2^√2 rational / irrational is a|||Chứng minh “tồn tại a, b vô tỉ với aᵇ hữu tỉ” qua hai trường hợp √2^√2 hữu tỉ / vô tỉ là chứng minh',
    ['constructive existence proof|||tồn tại kiến thiết', 'non-constructive existence proof|||tồn tại không kiến thiết', 'proof by counterexample|||bằng phản ví dụ', 'uniqueness proof|||tính duy nhất'], 1,
    'It shows a pair exists without telling which one.|||Nó chỉ ra có cặp như vậy mà không nói cặp nào.'),
]);

const ch2 = {
  title: 'Chapter 2 — Proof techniques and induction|||Chương 2 — Kỹ thuật chứng minh và quy nạp',
  description: 'Chứng minh trực tiếp, phản đảo, phản chứng, chia trường hợp, tồn tại, phản ví dụ; quy nạp thường, quy nạp mạnh, sắp thứ tự tốt; định nghĩa đệ quy, quy nạp cấu trúc và bất biến vòng lặp (Rosen 1.7–1.8, 5.1–5.5 · MCS ch. 1, 2, 5, 6, 7).',
  lessons: [c21, c22, c23, c24, q2],
};

// ───────────────────────────── Chương 3 — Tập hợp, hàm, tổng, lực lượng ─────────────────────────────
const c31 = L('mad102-ts-3-1',
  '3.1 — Sets, set operations and set identities|||3.1 — Tập hợp, phép toán tập hợp và các đẳng thức tập hợp',
  'Tập hợp, ký hiệu, tập con, tập lũy thừa, tích Descartes; hợp, giao, hiệu, phần bù, hiệu đối xứng; chứng minh đẳng thức tập hợp bằng hai chiều bao hàm và bảng thuộc; biểu diễn tập bằng chuỗi bit.',
  `<span class="eyebrow">MAD102 · Chapter 3 · Lesson 3.1</span>
<h2>Sets, set operations and set identities</h2>
<p class="lead">Sets are the data type of mathematics. Types in programming languages, tables in databases, the keys of a hash map and the states of an automaton are all sets. Set operations correspond exactly to the logical connectives of Chapter 1.</p>
<h3>🎯 Objectives</h3>
<ul><li>Use set notation: membership, subsets, power set, Cartesian product, cardinality.</li><li>Compute unions, intersections, differences, complements and symmetric differences.</li><li>Prove set identities by mutual inclusion or with membership tables.</li></ul>
<h3>📖 Lecture</h3>
<p>A <strong>set</strong> is an unordered collection of distinct elements: {1, 2, 3} = {3, 1, 2} = {1, 1, 2, 3}. We write x ∈ A, use set-builder notation {x ∈ ℤ | x<sup>2</sup> &lt; 10} = {−3, …, 3}, and denote the empty set ∅. A ⊆ B means every element of A is in B; A = B iff A ⊆ B and B ⊆ A. The <strong>cardinality</strong> |A| of a finite set is its number of elements.</p>
<p>The <strong>power set</strong> P(A) is the set of all subsets of A, and |P(A)| = 2<sup>|A|</sup> (each element is either in or out). The <strong>Cartesian product</strong> A × B = {(a, b) | a ∈ A, b ∈ B} consists of ordered pairs and |A × B| = |A|·|B|. A relational database table is a subset of a Cartesian product of column domains.</p>
<div class="formula"><span class="lbl">Operations</span>A ∪ B = {x | x ∈ A ∨ x ∈ B}   A ∩ B = {x | x ∈ A ∧ x ∈ B}   A − B = {x | x ∈ A ∧ x ∉ B}<br>Ā = U − A   A ⊕ B = (A − B) ∪ (B − A)   |A ∪ B| = |A| + |B| − |A ∩ B|</div>
<p>Set identities mirror logical equivalences because x ∈ A ∪ B is “x ∈ A ∨ x ∈ B”: De Morgan (complement of A ∪ B is Ā ∩ B̄), distributive laws, absorption, and so on. Three ways to prove an identity: (1) <strong>mutual inclusion</strong> — take an arbitrary x in the left side and show it is in the right side, then the converse; (2) <strong>set-builder + logic</strong> — rewrite each side as a logical formula and use Chapter 1 equivalences; (3) a <strong>membership table</strong> — like a truth table with 1 for “in”, 0 for “out”.</p>
<p>In computers, subsets of a small universe U = {u<sub>1</sub>, …, u<sub>n</sub>} are stored as <strong>bit strings</strong> of length n; union, intersection and symmetric difference become bitwise OR, AND, XOR — the trick behind permission flags and bitmask dynamic programming.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — mutual inclusion.</b> Prove A − (B ∪ C) = (A − B) ∩ (A − C).<br>(⊆) x ∈ A − (B ∪ C) ⇒ x ∈ A and x ∉ B ∪ C ⇒ x ∈ A, x ∉ B, x ∉ C ⇒ x ∈ A − B and x ∈ A − C. (⊇) the same steps read backwards. ∎</p></div>
<div class="callout"><p><b>Example 2 — bit strings.</b> U = {1, …, 8}, A = {1, 2, 5, 8} → 1100 1001, B = {2, 3, 5} → 0110 1000. A ∩ B = AND = 0100 1000 = {2, 5}; A ∪ B = OR = 1110 1001 = {1, 2, 3, 5, 8}.</p></div>
<div class="callout"><p><b>Example 3 — Python sets.</b> Python's <code>set</code> implements these operations directly:</p></div>
<pre><code class="language-python">from itertools import chain, combinations

A = {1, 2, 3, 4, 5}
B = {4, 5, 6}
print("A | B =", A | B)
print("A &amp; B =", A &amp; B)
print("A - B =", A - B)
print("A ^ B =", A ^ B)          # symmetric difference
print(len(A | B) == len(A) + len(B) - len(A &amp; B))

def power_set(s):
    s = list(s)
    return [set(c) for c in chain.from_iterable(combinations(s, r) for r in range(len(s) + 1))]

P = power_set({"a", "b", "c"})
print(len(P), sorted(sorted(x) for x in P))</code></pre>
<div class="out">A | B = {1, 2, 3, 4, 5, 6}
A &amp; B = {4, 5}
A - B = {1, 2, 3}
A ^ B = {1, 2, 3, 6}
True
8 [[], ['a'], ['a', 'b'], ['a', 'b', 'c'], ['a', 'c'], ['b'], ['b', 'c'], ['c']]</div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Confusing ∈ and ⊆: 1 ∈ {1, 2} but {1} ⊆ {1, 2}; ∅ ⊆ A always, but ∅ ∈ A only if ∅ is listed as an element.</li><li>Thinking |P(∅)| = 0. P(∅) = {∅} has one element.</li><li>Forgetting that A × B ≠ B × A in general (ordered pairs).</li><li>“Proving” an identity with one Venn diagram drawing instead of an argument for arbitrary x.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>|P(A)| = 2<sup>|A|</sup>, |A × B| = |A||B|.</li><li>∪, ∩, complement ↔ ∨, ∧, ¬; identities follow from logic.</li><li>Prove identities by mutual inclusion or membership tables.</li><li>Subsets of a small universe = bit strings; operations = bitwise.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_structures-sets.html" target="_blank" rel="noopener">Levin, DMOI 5.1 — Sets</a></li><li><a href="https://en.wikipedia.org/wiki/Algebra_of_sets" target="_blank" rel="noopener">Wikipedia — Algebra of sets</a></li><li><a href="https://richardhammack.github.io/BookOfProof/" target="_blank" rel="noopener">Hammack, Book of Proof — Ch. 1 Sets, Ch. 8 Proofs Involving Sets</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>A = {a, b}, B = {1, 2, 3}. Find |A × B| and |P(A × B)|.</li><li>Prove A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C) by mutual inclusion.</li><li>In a class of 40 students, 25 take Python, 18 take Java, 7 take both. How many take neither?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 6 and 2<sup>6</sup> = 64. 2) x ∈ A and (x ∈ B or x ∈ C) ⇔ (x ∈ A and x ∈ B) or (x ∈ A and x ∈ C) — distributive law of logic, both directions. 3) |P ∪ J| = 25 + 18 − 7 = 36, so 40 − 36 = 4.</p></div>`,
  `<span class="eyebrow">MAD102 · Chương 3 · Bài 3.1</span>
<h2>Tập hợp, phép toán tập hợp và các đẳng thức tập hợp</h2>
<p class="lead">Tập hợp là kiểu dữ liệu của toán học. Kiểu trong ngôn ngữ lập trình, bảng trong cơ sở dữ liệu, tập khoá của bảng băm, tập trạng thái của ô-tô-mát đều là tập hợp. Các phép toán tập hợp tương ứng đúng với các phép nối logic ở Chương 1.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Dùng ký hiệu tập hợp: thuộc, tập con, tập lũy thừa, tích Descartes, lực lượng.</li><li>Tính hợp, giao, hiệu, phần bù, hiệu đối xứng.</li><li>Chứng minh đẳng thức tập hợp bằng hai chiều bao hàm hoặc bảng thuộc.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Tập hợp</strong> là một bộ sưu tập không thứ tự các phần tử phân biệt: {1, 2, 3} = {3, 1, 2} = {1, 1, 2, 3}. Ta viết x ∈ A, dùng cách mô tả {x ∈ ℤ | x<sup>2</sup> &lt; 10} = {−3, …, 3}, và ký hiệu tập rỗng ∅. A ⊆ B nghĩa là mọi phần tử của A đều thuộc B; A = B khi và chỉ khi A ⊆ B và B ⊆ A. <strong>Lực lượng</strong> |A| của tập hữu hạn là số phần tử của nó.</p>
<p><strong>Tập lũy thừa</strong> P(A) là tập mọi tập con của A, và |P(A)| = 2<sup>|A|</sup> (mỗi phần tử hoặc được chọn hoặc không). <strong>Tích Descartes</strong> A × B = {(a, b) | a ∈ A, b ∈ B} gồm các cặp có thứ tự và |A × B| = |A|·|B|. Một bảng trong cơ sở dữ liệu quan hệ là tập con của tích Descartes các miền giá trị cột.</p>
<div class="formula"><span class="lbl">Phép toán</span>A ∪ B = {x | x ∈ A ∨ x ∈ B}   A ∩ B = {x | x ∈ A ∧ x ∈ B}   A − B = {x | x ∈ A ∧ x ∉ B}<br>Ā = U − A   A ⊕ B = (A − B) ∪ (B − A)   |A ∪ B| = |A| + |B| − |A ∩ B|</div>
<p>Đẳng thức tập hợp phản chiếu tương đương logic vì x ∈ A ∪ B là “x ∈ A ∨ x ∈ B”: De Morgan (phần bù của A ∪ B là Ā ∩ B̄), luật phân phối, hấp thụ, v.v. Ba cách chứng minh đẳng thức: (1) <strong>hai chiều bao hàm</strong> — lấy x tuỳ ý ở vế trái, chứng tỏ x thuộc vế phải, rồi làm chiều ngược; (2) <strong>mô tả + logic</strong> — viết mỗi vế thành công thức logic và dùng tương đương ở Chương 1; (3) <strong>bảng thuộc</strong> — như bảng chân trị, 1 là “thuộc”, 0 là “không thuộc”.</p>
<p>Trong máy tính, tập con của một tập vũ trụ nhỏ U = {u<sub>1</sub>, …, u<sub>n</sub>} được lưu bằng <strong>chuỗi bit</strong> độ dài n; hợp, giao, hiệu đối xứng trở thành OR, AND, XOR theo bit — mẹo đằng sau cờ phân quyền và quy hoạch động bitmask.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — hai chiều bao hàm.</b> Chứng minh A − (B ∪ C) = (A − B) ∩ (A − C).<br>(⊆) x ∈ A − (B ∪ C) ⇒ x ∈ A và x ∉ B ∪ C ⇒ x ∈ A, x ∉ B, x ∉ C ⇒ x ∈ A − B và x ∈ A − C. (⊇) đọc ngược các bước. ∎</p></div>
<div class="callout"><p><b>Ví dụ 2 — chuỗi bit.</b> U = {1, …, 8}, A = {1, 2, 5, 8} → 1100 1001, B = {2, 3, 5} → 0110 1000. A ∩ B = AND = 0100 1000 = {2, 5}; A ∪ B = OR = 1110 1001 = {1, 2, 3, 5, 8}.</p></div>
<div class="callout"><p><b>Ví dụ 3 — set trong Python.</b> Kiểu <code>set</code> của Python cài sẵn các phép toán này:</p></div>
<pre><code class="language-python">from itertools import chain, combinations

A = {1, 2, 3, 4, 5}
B = {4, 5, 6}
print("A | B =", A | B)
print("A &amp; B =", A &amp; B)
print("A - B =", A - B)
print("A ^ B =", A ^ B)          # symmetric difference
print(len(A | B) == len(A) + len(B) - len(A &amp; B))

def power_set(s):
    s = list(s)
    return [set(c) for c in chain.from_iterable(combinations(s, r) for r in range(len(s) + 1))]

P = power_set({"a", "b", "c"})
print(len(P), sorted(sorted(x) for x in P))</code></pre>
<div class="out">A | B = {1, 2, 3, 4, 5, 6}
A &amp; B = {4, 5}
A - B = {1, 2, 3}
A ^ B = {1, 2, 3, 6}
True
8 [[], ['a'], ['a', 'b'], ['a', 'b', 'c'], ['a', 'c'], ['b'], ['b', 'c'], ['c']]</div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Nhầm ∈ với ⊆: 1 ∈ {1, 2} nhưng {1} ⊆ {1, 2}; ∅ ⊆ A luôn đúng, còn ∅ ∈ A chỉ khi ∅ được liệt kê là phần tử.</li><li>Nghĩ |P(∅)| = 0. P(∅) = {∅} có một phần tử.</li><li>Quên rằng nói chung A × B ≠ B × A (cặp có thứ tự).</li><li>“Chứng minh” đẳng thức bằng một hình Venn thay vì lập luận cho x tuỳ ý.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>|P(A)| = 2<sup>|A|</sup>, |A × B| = |A||B|.</li><li>∪, ∩, phần bù ↔ ∨, ∧, ¬; các đẳng thức suy từ logic.</li><li>Chứng minh đẳng thức bằng hai chiều bao hàm hoặc bảng thuộc.</li><li>Tập con của vũ trụ nhỏ = chuỗi bit; phép toán = phép theo bit.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_structures-sets.html" target="_blank" rel="noopener">Levin, DMOI 5.1 — Sets</a></li><li><a href="https://en.wikipedia.org/wiki/Algebra_of_sets" target="_blank" rel="noopener">Wikipedia — Algebra of sets</a></li><li><a href="https://richardhammack.github.io/BookOfProof/" target="_blank" rel="noopener">Hammack, Book of Proof — Ch. 1 Sets, Ch. 8 Proofs Involving Sets</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>A = {a, b}, B = {1, 2, 3}. Tính |A × B| và |P(A × B)|.</li><li>Chứng minh A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C) bằng hai chiều bao hàm.</li><li>Lớp 40 sinh viên, 25 học Python, 18 học Java, 7 học cả hai. Bao nhiêu bạn không học môn nào?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 6 và 2<sup>6</sup> = 64. 2) x ∈ A và (x ∈ B hoặc x ∈ C) ⇔ (x ∈ A và x ∈ B) hoặc (x ∈ A và x ∈ C) — luật phân phối của logic, cả hai chiều. 3) |P ∪ J| = 25 + 18 − 7 = 36, nên 40 − 36 = 4.</p></div>`);

const c32 = L('mad102-ts-3-2',
  '3.2 — Functions: injective, surjective, bijective, inverse and composition|||3.2 — Hàm: đơn ánh, toàn ánh, song ánh, hàm ngược và hàm hợp',
  'Định nghĩa hàm, miền, đối miền, ảnh; đơn ánh, toàn ánh, song ánh và cách chứng minh; hàm ngược, hàm hợp; hàm sàn/trần; đếm số hàm, đơn ánh, toàn ánh giữa hai tập hữu hạn bằng Python.',
  `<span class="eyebrow">MAD102 · Chapter 3 · Lesson 3.2</span>
<h2>Functions: injective, surjective, bijective, inverse and composition</h2>
<p class="lead">A function is a rule with exactly one output per input — the mathematical model of a pure function in code, a hash function, an encoding, a database key. Whether a function loses information (not injective) or misses outputs (not surjective) is a constant question in CS.</p>
<h3>🎯 Objectives</h3>
<ul><li>State the definitions of injective, surjective and bijective and prove/disprove them.</li><li>Compute compositions and inverses; know when an inverse exists.</li><li>Count the functions, injections and surjections between finite sets.</li></ul>
<h3>📖 Lecture</h3>
<p>A <strong>function</strong> f: A → B assigns to each a ∈ A exactly one f(a) ∈ B. A is the <strong>domain</strong>, B the <strong>codomain</strong>; the <strong>range</strong> (image) f(A) = {f(a) | a ∈ A} ⊆ B.</p>
<ul>
<li><strong>Injective</strong> (one-to-one): f(a) = f(a′) ⇒ a = a′. Different inputs give different outputs.</li>
<li><strong>Surjective</strong> (onto): ∀b ∈ B ∃a ∈ A, f(a) = b. The range is the whole codomain.</li>
<li><strong>Bijective</strong>: both. Exactly then f has an <strong>inverse</strong> f<sup>−1</sup>: B → A with f<sup>−1</sup>(f(a)) = a.</li>
</ul>
<p>To <em>prove</em> injectivity, assume f(a) = f(a′) and derive a = a′. To prove surjectivity, take an arbitrary b and solve for an a with f(a) = b, checking that a lies in the domain. To disprove, give two inputs with the same output, or one b with no preimage.</p>
<p>The <strong>composition</strong> (f ∘ g)(x) = f(g(x)) requires the range of g to lie in the domain of f. Compositions of injections are injective, of surjections surjective; in general f ∘ g ≠ g ∘ f. The <strong>floor</strong> ⌊x⌋ (largest integer ≤ x) and <strong>ceiling</strong> ⌈x⌉ (smallest integer ≥ x) appear everywhere in algorithm analysis: ⌈n/2⌉ + ⌊n/2⌋ = n; a file of 1000 bytes needs ⌈1000/512⌉ = 2 blocks of 512 bytes.</p>
<div class="formula"><span class="lbl">Counting (|A| = m, |B| = n)</span>functions A → B: n<sup>m</sup>   injections: n(n − 1)…(n − m + 1) (0 if m &gt; n)   bijections: n! if m = n</div>
<p>Pigeonhole in function language: if |A| &gt; |B| no function A → B is injective — the reason every hash function from long strings to 64-bit values must have collisions.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1.</b> f: ℝ → ℝ, f(x) = 2x + 3. Injective: 2a + 3 = 2a′ + 3 ⇒ a = a′. Surjective: given b, a = (b − 3)/2 ∈ ℝ works. So f is bijective with f<sup>−1</sup>(y) = (y − 3)/2. The same formula on ℤ → ℤ is injective but <em>not</em> surjective: b = 4 would need a = 1/2.</p></div>
<div class="callout"><p><b>Example 2.</b> g: ℤ → ℕ, g(x) = x<sup>2</sup> is neither: g(−1) = g(1), and 2 has no preimage.</p></div>
<div class="callout"><p><b>Example 3 — counting by brute force.</b> Each function from an m-set to B is a tuple (f(a<sub>1</sub>), …, f(a<sub>m</sub>)) ∈ B<sup>m</sup>, so we can list them all:</p></div>
<pre><code class="language-python">from itertools import product

def count(A, B):
    funcs = list(product(B, repeat=len(A)))           # each tuple = (f(a1), f(a2), ...)
    inj = [f for f in funcs if len(set(f)) == len(f)]
    surj = [f for f in funcs if set(f) == set(B)]
    bij = [f for f in inj if f in surj]
    return len(funcs), len(inj), len(surj), len(bij)

print("|A|=3, |B|=4:", count([1, 2, 3], "wxyz"))
print("|A|=4, |B|=3:", count([1, 2, 3, 4], "xyz"))
print("|A|=3, |B|=3:", count([1, 2, 3], "xyz"))</code></pre>
<div class="out">|A|=3, |B|=4: (64, 24, 0, 0)
|A|=4, |B|=3: (81, 0, 36, 0)
|A|=3, |B|=3: (27, 6, 6, 6)</div>
<p>Read the output as (functions, injections, surjections, bijections). The 36 surjections from a 4-set onto a 3-set will be derived by inclusion–exclusion in Chapter 8: 3<sup>4</sup> − 3·2<sup>4</sup> + 3·1<sup>4</sup> = 81 − 48 + 3 = 36.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Checking surjectivity against the range instead of the codomain (every function is onto its range).</li><li>Forgetting that the domain matters: the same formula can be bijective on ℝ and not on ℤ.</li><li>Writing f<sup>−1</sup> for a function that is not bijective, or confusing f<sup>−1</sup>(x) with 1/f(x).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Injective: no collisions. Surjective: every codomain value is hit. Bijective: both ⇔ invertible.</li><li>Prove injective by f(a) = f(a′) ⇒ a = a′; surjective by solving f(a) = b.</li><li>n<sup>m</sup> functions, n!/(n − m)! injections from an m-set to an n-set.</li><li>|A| &gt; |B| ⇒ no injection (collisions are unavoidable).</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_structures-functions.html" target="_blank" rel="noopener">Levin, DMOI 5.2 — Functions</a></li><li><a href="https://brilliant.org/wiki/functions/" target="_blank" rel="noopener">Brilliant — Functions</a></li><li><a href="https://en.wikipedia.org/wiki/Bijection" target="_blank" rel="noopener">Wikipedia — Bijection, injection and surjection</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Is f: ℤ → ℤ, f(n) = ⌈n/2⌉ injective? surjective?</li><li>How many injective functions are there from {1, 2, 3} to {a, b, c, d, e}?</li><li>f(x) = x + 1 and g(x) = x<sup>2</sup> on ℝ. Compute (f ∘ g)(2) and (g ∘ f)(2).</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Not injective (f(1) = f(2) = 1); surjective (f(2m) = m). 2) 5·4·3 = 60. 3) f(g(2)) = f(4) = 5; g(f(2)) = g(3) = 9.</p></div>`,
  `<span class="eyebrow">MAD102 · Chương 3 · Bài 3.2</span>
<h2>Hàm: đơn ánh, toàn ánh, song ánh, hàm ngược và hàm hợp</h2>
<p class="lead">Hàm là quy tắc cho đúng một đầu ra với mỗi đầu vào — mô hình toán học của hàm thuần trong code, hàm băm, phép mã hoá, khoá cơ sở dữ liệu. Hàm có làm mất thông tin (không đơn ánh) hay bỏ sót đầu ra (không toàn ánh) là câu hỏi thường trực trong khoa học máy tính.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phát biểu định nghĩa đơn ánh, toàn ánh, song ánh và chứng minh/bác bỏ chúng.</li><li>Tính hàm hợp và hàm ngược; biết khi nào hàm ngược tồn tại.</li><li>Đếm số hàm, đơn ánh, toàn ánh giữa các tập hữu hạn.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Hàm</strong> f: A → B gán cho mỗi a ∈ A đúng một f(a) ∈ B. A là <strong>miền xác định</strong>, B là <strong>đối miền</strong>; <strong>tập ảnh</strong> f(A) = {f(a) | a ∈ A} ⊆ B.</p>
<ul>
<li><strong>Đơn ánh</strong>: f(a) = f(a′) ⇒ a = a′. Đầu vào khác nhau cho đầu ra khác nhau.</li>
<li><strong>Toàn ánh</strong>: ∀b ∈ B ∃a ∈ A, f(a) = b. Tập ảnh là toàn bộ đối miền.</li>
<li><strong>Song ánh</strong>: cả hai. Đúng khi đó f có <strong>hàm ngược</strong> f<sup>−1</sup>: B → A với f<sup>−1</sup>(f(a)) = a.</li>
</ul>
<p>Để <em>chứng minh</em> đơn ánh, giả sử f(a) = f(a′) rồi suy ra a = a′. Chứng minh toàn ánh: lấy b tuỳ ý và giải tìm a với f(a) = b, kiểm tra a thuộc miền xác định. Để bác bỏ, đưa hai đầu vào cùng đầu ra, hoặc một b không có tạo ảnh.</p>
<p><strong>Hàm hợp</strong> (f ∘ g)(x) = f(g(x)) đòi tập ảnh của g nằm trong miền của f. Hợp các đơn ánh là đơn ánh, hợp các toàn ánh là toàn ánh; nói chung f ∘ g ≠ g ∘ f. Hàm <strong>sàn</strong> ⌊x⌋ (số nguyên lớn nhất ≤ x) và <strong>trần</strong> ⌈x⌉ (số nguyên nhỏ nhất ≥ x) xuất hiện khắp nơi trong phân tích thuật toán: ⌈n/2⌉ + ⌊n/2⌋ = n; tệp 1000 byte cần ⌈1000/512⌉ = 2 khối 512 byte.</p>
<div class="formula"><span class="lbl">Đếm (|A| = m, |B| = n)</span>số hàm A → B: n<sup>m</sup>   số đơn ánh: n(n − 1)…(n − m + 1) (bằng 0 nếu m &gt; n)   số song ánh: n! nếu m = n</div>
<p>Nguyên lý chuồng bồ câu theo ngôn ngữ hàm: nếu |A| &gt; |B| thì không hàm A → B nào là đơn ánh — lý do mọi hàm băm từ xâu dài về giá trị 64 bit đều phải có va chạm.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1.</b> f: ℝ → ℝ, f(x) = 2x + 3. Đơn ánh: 2a + 3 = 2a′ + 3 ⇒ a = a′. Toàn ánh: với b cho trước, a = (b − 3)/2 ∈ ℝ thoả. Vậy f song ánh, f<sup>−1</sup>(y) = (y − 3)/2. Cùng công thức đó trên ℤ → ℤ là đơn ánh nhưng <em>không</em> toàn ánh: b = 4 cần a = 1/2.</p></div>
<div class="callout"><p><b>Ví dụ 2.</b> g: ℤ → ℕ, g(x) = x<sup>2</sup> không đơn ánh cũng không toàn ánh: g(−1) = g(1), và 2 không có tạo ảnh.</p></div>
<div class="callout"><p><b>Ví dụ 3 — đếm bằng vét cạn.</b> Mỗi hàm từ tập m phần tử vào B là một bộ (f(a<sub>1</sub>), …, f(a<sub>m</sub>)) ∈ B<sup>m</sup>, nên ta liệt kê được tất cả:</p></div>
<pre><code class="language-python">from itertools import product

def count(A, B):
    funcs = list(product(B, repeat=len(A)))           # each tuple = (f(a1), f(a2), ...)
    inj = [f for f in funcs if len(set(f)) == len(f)]
    surj = [f for f in funcs if set(f) == set(B)]
    bij = [f for f in inj if f in surj]
    return len(funcs), len(inj), len(surj), len(bij)

print("|A|=3, |B|=4:", count([1, 2, 3], "wxyz"))
print("|A|=4, |B|=3:", count([1, 2, 3, 4], "xyz"))
print("|A|=3, |B|=3:", count([1, 2, 3], "xyz"))</code></pre>
<div class="out">|A|=3, |B|=4: (64, 24, 0, 0)
|A|=4, |B|=3: (81, 0, 36, 0)
|A|=3, |B|=3: (27, 6, 6, 6)</div>
<p>Đọc kết quả theo thứ tự (số hàm, đơn ánh, toàn ánh, song ánh). 36 toàn ánh từ tập 4 phần tử lên tập 3 phần tử sẽ được suy ra bằng bao hàm – loại trừ ở Chương 8: 3<sup>4</sup> − 3·2<sup>4</sup> + 3·1<sup>4</sup> = 81 − 48 + 3 = 36.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Xét toàn ánh theo tập ảnh thay vì đối miền (mọi hàm đều toàn ánh lên tập ảnh của nó).</li><li>Quên rằng miền xác định quan trọng: cùng công thức có thể song ánh trên ℝ mà không song ánh trên ℤ.</li><li>Viết f<sup>−1</sup> cho hàm không song ánh, hoặc nhầm f<sup>−1</sup>(x) với 1/f(x).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Đơn ánh: không va chạm. Toàn ánh: mọi giá trị đối miền đều đạt. Song ánh: cả hai ⇔ khả nghịch.</li><li>Chứng minh đơn ánh bằng f(a) = f(a′) ⇒ a = a′; toàn ánh bằng giải f(a) = b.</li><li>Có n<sup>m</sup> hàm, n!/(n − m)! đơn ánh từ tập m phần tử vào tập n phần tử.</li><li>|A| &gt; |B| ⇒ không có đơn ánh (va chạm là không tránh được).</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_structures-functions.html" target="_blank" rel="noopener">Levin, DMOI 5.2 — Functions</a></li><li><a href="https://brilliant.org/wiki/functions/" target="_blank" rel="noopener">Brilliant — Functions</a></li><li><a href="https://en.wikipedia.org/wiki/Bijection" target="_blank" rel="noopener">Wikipedia — Bijection, injection and surjection</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>f: ℤ → ℤ, f(n) = ⌈n/2⌉ có đơn ánh không? Toàn ánh không?</li><li>Có bao nhiêu đơn ánh từ {1, 2, 3} vào {a, b, c, d, e}?</li><li>f(x) = x + 1 và g(x) = x<sup>2</sup> trên ℝ. Tính (f ∘ g)(2) và (g ∘ f)(2).</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Không đơn ánh (f(1) = f(2) = 1); toàn ánh (f(2m) = m). 2) 5·4·3 = 60. 3) f(g(2)) = f(4) = 5; g(f(2)) = g(3) = 9.</p></div>`);

const c33 = L('mad102-ts-3-3',
  '3.3 — Sequences and summations|||3.3 — Dãy số và tổng',
  'Dãy số, cấp số cộng và cấp số nhân, ký hiệu tổng Σ, các công thức tổng đóng (Σk, Σk², Σrᵏ), tổng lồng (telescoping), tổng kép, đổi chỉ số; kiểm công thức bằng Python.',
  `<span class="eyebrow">MAD102 · Chapter 3 · Lesson 3.3</span>
<h2>Sequences and summations</h2>
<p class="lead">The running time of a loop is a sum: a loop that does i operations in iteration i costs 1 + 2 + … + n. Closed forms for sums are therefore the first tool of algorithm analysis.</p>
<h3>🎯 Objectives</h3>
<ul><li>Recognise arithmetic and geometric sequences and write their general terms.</li><li>Use Σ-notation, shift indices and evaluate double sums.</li><li>Apply the standard closed forms and the telescoping trick.</li></ul>
<h3>📖 Lecture</h3>
<p>A <strong>sequence</strong> is a function from (a subset of) ℕ to a set; a<sub>n</sub> is its n-th term. An <strong>arithmetic</strong> sequence a<sub>n</sub> = a + nd adds a constant d; a <strong>geometric</strong> sequence a<sub>n</sub> = ar<sup>n</sup> multiplies by a constant r. Strings are finite sequences of characters.</p>
<p>The sum a<sub>m</sub> + a<sub>m+1</sub> + … + a<sub>n</sub> is written Σ<sub>k=m</sub><sup>n</sup> a<sub>k</sub>; k is a dummy index. Shifting: Σ<sub>k=1</sub><sup>n</sup> a<sub>k</sub> = Σ<sub>j=0</sub><sup>n−1</sup> a<sub>j+1</sub>. Sums are linear: Σ(c·a<sub>k</sub> + b<sub>k</sub>) = c·Σa<sub>k</sub> + Σb<sub>k</sub>.</p>
<div class="formula"><span class="lbl">Closed forms</span>Σ<sub>k=1</sub><sup>n</sup> k = n(n + 1)/2      Σ<sub>k=1</sub><sup>n</sup> k<sup>2</sup> = n(n + 1)(2n + 1)/6      Σ<sub>k=1</sub><sup>n</sup> k<sup>3</sup> = (n(n + 1)/2)<sup>2</sup><br>Σ<sub>k=0</sub><sup>n</sup> r<sup>k</sup> = (r<sup>n+1</sup> − 1)/(r − 1) (r ≠ 1)      Σ<sub>k=0</sub><sup>∞</sup> r<sup>k</sup> = 1/(1 − r) (|r| &lt; 1)</div>
<p>The geometric formula comes from multiplying S = 1 + r + … + r<sup>n</sup> by r and subtracting. A special case: 1 + 2 + 4 + … + 2<sup>n</sup> = 2<sup>n+1</sup> − 1, which is why a binary number with n + 1 one-bits is 2<sup>n+1</sup> − 1, and why a full binary tree of height h has 2<sup>h+1</sup> − 1 vertices.</p>
<p><strong>Telescoping</strong>: Σ<sub>k=1</sub><sup>n</sup> (a<sub>k</sub> − a<sub>k−1</sub>) = a<sub>n</sub> − a<sub>0</sub>. Partial fractions often create such differences, e.g. 1/(k(k + 1)) = 1/k − 1/(k + 1).</p>
<p><strong>Double sums</strong> are evaluated from the inside out, exactly like nested loops: Σ<sub>i=1</sub><sup>n</sup> Σ<sub>j=1</sub><sup>i</sup> 1 = Σ<sub>i=1</sub><sup>n</sup> i = n(n + 1)/2 counts the iterations of <code>for i in 1..n: for j in 1..i</code>.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1.</b> Σ<sub>k=50</sub><sup>100</sup> k = Σ<sub>k=1</sub><sup>100</sup> k − Σ<sub>k=1</sub><sup>49</sup> k = 5050 − 1225 = 3825.</p></div>
<div class="callout"><p><b>Example 2.</b> Σ<sub>k=1</sub><sup>n</sup> (2k − 1) = 2·n(n + 1)/2 − n = n<sup>2</sup> (sum of the first n odd numbers).</p></div>
<div class="callout"><p><b>Example 3 — telescoping.</b> Σ<sub>k=1</sub><sup>n</sup> 1/(k(k + 1)) = Σ (1/k − 1/(k + 1)) = 1 − 1/(n + 1) = n/(n + 1). For n = 100 this is 100/101.</p></div>
<div class="callout"><p><b>Example 4 — double sum.</b> Σ<sub>i=1</sub><sup>3</sup> Σ<sub>j=1</sub><sup>2</sup> ij = Σ<sub>i</sub> i(1 + 2) = 3(1 + 2 + 3) = 18. All checked in Python (exact fractions with <code>fractions.Fraction</code>):</p></div>
<pre><code class="language-python">from fractions import Fraction

n = 100
print(sum(range(1, n + 1)), n * (n + 1) // 2)
print(sum(k * k for k in range(1, n + 1)), n * (n + 1) * (2 * n + 1) // 6)
print(sum(2 ** k for k in range(0, 11)), 2 ** 11 - 1)
print(sum(Fraction(1, k * (k + 1)) for k in range(1, n + 1)))   # telescoping: 1 - 1/(n+1)
print(sum(i * j for i in range(1, 4) for j in range(1, 3)))     # double sum</code></pre>
<div class="out">5050 5050
338350 338350
2047 2047
100/101
18</div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Off-by-one in the number of terms: Σ<sub>k=m</sub><sup>n</sup> has n − m + 1 terms.</li><li>Using Σr<sup>k</sup> = 1/(1 − r) for a finite sum or for |r| ≥ 1.</li><li>Pulling a factor that depends on k out of the sum.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Arithmetic: add d; geometric: multiply by r.</li><li>Σk = n(n + 1)/2, Σk<sup>2</sup> = n(n + 1)(2n + 1)/6, Σr<sup>k</sup> = (r<sup>n+1</sup> − 1)/(r − 1).</li><li>Telescoping sums collapse to first and last terms.</li><li>Nested sums = nested loops; evaluate inside out.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_seq_intro.html" target="_blank" rel="noopener">Levin, DMOI 4.1 — Describing Sequences</a></li><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_seq-polynomial.html" target="_blank" rel="noopener">Levin, DMOI 4.3 — Polynomial Sequences (finite differences)</a></li><li><a href="https://en.wikipedia.org/wiki/Summation" target="_blank" rel="noopener">Wikipedia — Summation</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Compute Σ<sub>k=0</sub><sup>9</sup> 3·2<sup>k</sup>.</li><li>Find a closed form for Σ<sub>k=1</sub><sup>n</sup> k(k + 1).</li><li>How many times does the inner statement run in <code>for i in range(n): for j in range(i, n): work()</code>?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 3(2<sup>10</sup> − 1) = 3069. 2) Σk<sup>2</sup> + Σk = n(n + 1)(2n + 1)/6 + n(n + 1)/2 = n(n + 1)(n + 2)/3. 3) Σ<sub>i=0</sub><sup>n−1</sup> (n − i) = n(n + 1)/2.</p></div>`,
  `<span class="eyebrow">MAD102 · Chương 3 · Bài 3.3</span>
<h2>Dãy số và tổng</h2>
<p class="lead">Thời gian chạy của một vòng lặp là một tổng: vòng lặp làm i phép toán ở lần lặp thứ i tốn 1 + 2 + … + n. Vì thế công thức tổng dạng đóng là công cụ đầu tiên của phân tích thuật toán.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Nhận ra cấp số cộng, cấp số nhân và viết số hạng tổng quát.</li><li>Dùng ký hiệu Σ, đổi chỉ số và tính tổng kép.</li><li>Áp dụng các công thức tổng chuẩn và mẹo tổng lồng (telescoping).</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Dãy số</strong> là hàm từ (một tập con của) ℕ vào một tập; a<sub>n</sub> là số hạng thứ n. <strong>Cấp số cộng</strong> a<sub>n</sub> = a + nd cộng thêm hằng số d; <strong>cấp số nhân</strong> a<sub>n</sub> = ar<sup>n</sup> nhân với hằng số r. Xâu ký tự là dãy hữu hạn các ký tự.</p>
<p>Tổng a<sub>m</sub> + a<sub>m+1</sub> + … + a<sub>n</sub> viết là Σ<sub>k=m</sub><sup>n</sup> a<sub>k</sub>; k là chỉ số câm. Đổi chỉ số: Σ<sub>k=1</sub><sup>n</sup> a<sub>k</sub> = Σ<sub>j=0</sub><sup>n−1</sup> a<sub>j+1</sub>. Tổng có tính tuyến tính: Σ(c·a<sub>k</sub> + b<sub>k</sub>) = c·Σa<sub>k</sub> + Σb<sub>k</sub>.</p>
<div class="formula"><span class="lbl">Công thức đóng</span>Σ<sub>k=1</sub><sup>n</sup> k = n(n + 1)/2      Σ<sub>k=1</sub><sup>n</sup> k<sup>2</sup> = n(n + 1)(2n + 1)/6      Σ<sub>k=1</sub><sup>n</sup> k<sup>3</sup> = (n(n + 1)/2)<sup>2</sup><br>Σ<sub>k=0</sub><sup>n</sup> r<sup>k</sup> = (r<sup>n+1</sup> − 1)/(r − 1) (r ≠ 1)      Σ<sub>k=0</sub><sup>∞</sup> r<sup>k</sup> = 1/(1 − r) (|r| &lt; 1)</div>
<p>Công thức cấp số nhân có được bằng cách nhân S = 1 + r + … + r<sup>n</sup> với r rồi trừ. Trường hợp riêng: 1 + 2 + 4 + … + 2<sup>n</sup> = 2<sup>n+1</sup> − 1, đó là lý do số nhị phân gồm n + 1 bit 1 bằng 2<sup>n+1</sup> − 1, và cây nhị phân đầy đủ chiều cao h có 2<sup>h+1</sup> − 1 đỉnh.</p>
<p><strong>Tổng lồng</strong>: Σ<sub>k=1</sub><sup>n</sup> (a<sub>k</sub> − a<sub>k−1</sub>) = a<sub>n</sub> − a<sub>0</sub>. Tách phân thức thường tạo ra hiệu như vậy, vd 1/(k(k + 1)) = 1/k − 1/(k + 1).</p>
<p><strong>Tổng kép</strong> tính từ trong ra ngoài, y như vòng lặp lồng: Σ<sub>i=1</sub><sup>n</sup> Σ<sub>j=1</sub><sup>i</sup> 1 = Σ<sub>i=1</sub><sup>n</sup> i = n(n + 1)/2 đếm số lần lặp của <code>for i in 1..n: for j in 1..i</code>.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1.</b> Σ<sub>k=50</sub><sup>100</sup> k = Σ<sub>k=1</sub><sup>100</sup> k − Σ<sub>k=1</sub><sup>49</sup> k = 5050 − 1225 = 3825.</p></div>
<div class="callout"><p><b>Ví dụ 2.</b> Σ<sub>k=1</sub><sup>n</sup> (2k − 1) = 2·n(n + 1)/2 − n = n<sup>2</sup> (tổng n số lẻ đầu tiên).</p></div>
<div class="callout"><p><b>Ví dụ 3 — tổng lồng.</b> Σ<sub>k=1</sub><sup>n</sup> 1/(k(k + 1)) = Σ (1/k − 1/(k + 1)) = 1 − 1/(n + 1) = n/(n + 1). Với n = 100 được 100/101.</p></div>
<div class="callout"><p><b>Ví dụ 4 — tổng kép.</b> Σ<sub>i=1</sub><sup>3</sup> Σ<sub>j=1</sub><sup>2</sup> ij = Σ<sub>i</sub> i(1 + 2) = 3(1 + 2 + 3) = 18. Tất cả được kiểm bằng Python (phân số chính xác với <code>fractions.Fraction</code>):</p></div>
<pre><code class="language-python">from fractions import Fraction

n = 100
print(sum(range(1, n + 1)), n * (n + 1) // 2)
print(sum(k * k for k in range(1, n + 1)), n * (n + 1) * (2 * n + 1) // 6)
print(sum(2 ** k for k in range(0, 11)), 2 ** 11 - 1)
print(sum(Fraction(1, k * (k + 1)) for k in range(1, n + 1)))   # telescoping: 1 - 1/(n+1)
print(sum(i * j for i in range(1, 4) for j in range(1, 3)))     # double sum</code></pre>
<div class="out">5050 5050
338350 338350
2047 2047
100/101
18</div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Sai lệch một khi đếm số số hạng: Σ<sub>k=m</sub><sup>n</sup> có n − m + 1 số hạng.</li><li>Dùng Σr<sup>k</sup> = 1/(1 − r) cho tổng hữu hạn hoặc khi |r| ≥ 1.</li><li>Đưa thừa số phụ thuộc k ra ngoài dấu tổng.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Cấp số cộng: cộng d; cấp số nhân: nhân r.</li><li>Σk = n(n + 1)/2, Σk<sup>2</sup> = n(n + 1)(2n + 1)/6, Σr<sup>k</sup> = (r<sup>n+1</sup> − 1)/(r − 1).</li><li>Tổng lồng co về số hạng đầu và cuối.</li><li>Tổng lồng nhau = vòng lặp lồng nhau; tính từ trong ra.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_seq_intro.html" target="_blank" rel="noopener">Levin, DMOI 4.1 — Describing Sequences</a></li><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_seq-polynomial.html" target="_blank" rel="noopener">Levin, DMOI 4.3 — Polynomial Sequences (sai phân)</a></li><li><a href="https://en.wikipedia.org/wiki/Summation" target="_blank" rel="noopener">Wikipedia — Summation</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tính Σ<sub>k=0</sub><sup>9</sup> 3·2<sup>k</sup>.</li><li>Tìm dạng đóng của Σ<sub>k=1</sub><sup>n</sup> k(k + 1).</li><li>Lệnh bên trong chạy bao nhiêu lần trong <code>for i in range(n): for j in range(i, n): work()</code>?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 3(2<sup>10</sup> − 1) = 3069. 2) Σk<sup>2</sup> + Σk = n(n + 1)(2n + 1)/6 + n(n + 1)/2 = n(n + 1)(n + 2)/3. 3) Σ<sub>i=0</sub><sup>n−1</sup> (n − i) = n(n + 1)/2.</p></div>`);

const c34 = L('mad102-ts-3-4',
  '3.4 — Cardinality of infinite sets: countable and uncountable|||3.4 — Lực lượng tập vô hạn: đếm được và không đếm được',
  'So sánh lực lượng bằng song ánh, tập đếm được (ℤ, ℚ, ℤ×ℤ, Σ*), đường chéo Cantor (ℝ không đếm được), định lý Cantor |P(S)| > |S|, Schröder–Bernstein, hệ quả: tồn tại hàm không tính được.',
  `<span class="eyebrow">MAD102 · Chapter 3 · Lesson 3.4</span>
<h2>Cardinality of infinite sets: countable and uncountable</h2>
<p class="lead">Are there more real numbers than integers? More problems than programs? Cantor's answer — yes, and provably so — is the reason some problems can never be solved by any computer, which we meet again with the halting problem in Chapter 5.</p>
<h3>🎯 Objectives</h3>
<ul><li>Define “same cardinality” via bijections and “countable”.</li><li>Show that ℤ, ℚ and the set of all finite strings are countable.</li><li>Reproduce Cantor's diagonal argument and explain why uncomputable functions exist.</li></ul>
<h3>📖 Lecture</h3>
<p>Sets A and B have the <strong>same cardinality</strong>, |A| = |B|, if there is a bijection A → B. We write |A| ≤ |B| if there is an injection A → B. The <strong>Schröder–Bernstein theorem</strong> says: injections both ways imply a bijection, so ≤ behaves like an order.</p>
<p>A set is <strong>countable</strong> if it is finite or has the same cardinality as ℤ<sup>+</sup> (written ℵ<sub>0</sub>) — equivalently, its elements can be listed as a sequence a<sub>1</sub>, a<sub>2</sub>, a<sub>3</sub>, … where every element appears. Infinite sets behave strangely: the even numbers are a proper subset of ℕ yet have the same cardinality (n ↦ 2n).</p>
<ul>
<li><strong>ℤ is countable:</strong> list 0, 1, −1, 2, −2, 3, −3, …</li>
<li><strong>ℤ<sup>+</sup> × ℤ<sup>+</sup> and ℚ are countable:</strong> list pairs by diagonals p + q = 2, 3, 4, … (skipping repeats for fractions).</li>
<li><strong>Σ* (all finite strings over a finite alphabet) is countable:</strong> list by length, then alphabetically. In particular the set of all Python programs is countable.</li>
<li>A countable union of countable sets is countable.</li>
</ul>
<p><strong>Cantor's diagonal argument.</strong> Suppose the reals in (0, 1) could be listed r<sub>1</sub>, r<sub>2</sub>, … with decimal expansions r<sub>i</sub> = 0.d<sub>i1</sub>d<sub>i2</sub>d<sub>i3</sub>… Build r = 0.e<sub>1</sub>e<sub>2</sub>… with e<sub>i</sub> = 4 if d<sub>ii</sub> ≠ 4 and e<sub>i</sub> = 5 if d<sub>ii</sub> = 4. Then r differs from every r<sub>i</sub> in the i-th digit, so r is not in the list — contradiction. Hence ℝ is <strong>uncountable</strong>.</p>
<p><strong>Cantor's theorem:</strong> for every set S, |P(S)| &gt; |S|. If f: S → P(S) were onto, the set D = {x ∈ S | x ∉ f(x)} would equal f(d) for some d, and then d ∈ D ⇔ d ∉ D. So there is an endless hierarchy of infinities.</p>
<div class="callout"><p><b>Consequence for CS.</b> The set of functions ℕ → {0, 1} (decision problems) has the cardinality of P(ℕ), which is uncountable, but programs are countable. So <strong>most decision problems have no program at all</strong>. Chapter 5 exhibits a concrete one: the halting problem.</p></div>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — bijection ℕ → ℤ.</b> f(n) = (n + 1)/2 if n is odd, −n/2 if n is even. The diagonal construction and the bijection on small cases:</p></div>
<pre><code class="language-python"># Cantor's diagonal argument on a finite list of 0/1 strings:
rows = ["0101", "1100", "0010", "1111"]
diag = "".join("1" if rows[i][i] == "0" else "0" for i in range(len(rows)))
print("diagonal flipped:", diag)
print("appears in the list?", diag in rows)

# A bijection N -&gt; Z: 0, 1, -1, 2, -2, ...
f = lambda n: (n + 1) // 2 if n % 2 == 1 else -(n // 2)
print([f(n) for n in range(9)])</code></pre>
<div class="out">diagonal flipped: 1000
appears in the list? False
[0, 1, -1, 2, -2, 3, -3, 4, -4]</div>
<p>The flipped diagonal differs from row i in position i, so it can never be one of the rows — exactly Cantor's idea on a finite table.</p>
<div class="callout"><p><b>Example 2.</b> (0, 1) and ℝ have the same cardinality: f(x) = tan(π(x − 1/2)) is a bijection (0, 1) → ℝ.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Concluding “a proper subset is smaller” for infinite sets — false (evens vs ℕ).</li><li>Listing ℚ “row by row” (1/1, 1/2, 1/3, …): the first row never ends, so 2/1 is never reached. Use diagonals.</li><li>In the diagonal argument, choosing digits 0/9, which can create the double expansion 0.0999… = 0.1000…</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>|A| = |B| ⇔ a bijection exists; countable ⇔ can be listed.</li><li>ℕ, ℤ, ℚ, ℤ×ℤ, Σ* are countable.</li><li>ℝ and P(ℕ) are uncountable (diagonalisation); |P(S)| &gt; |S|.</li><li>Countably many programs, uncountably many problems ⇒ uncomputable problems exist.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Cantor%27s_diagonal_argument" target="_blank" rel="noopener">Wikipedia — Cantor's diagonal argument</a></li><li><a href="https://en.wikipedia.org/wiki/Countable_set" target="_blank" rel="noopener">Wikipedia — Countable set</a></li><li><a href="https://en.wikipedia.org/wiki/Cantor%27s_theorem" target="_blank" rel="noopener">Wikipedia — Cantor's theorem</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Give a bijection between ℕ and the set of odd positive integers.</li><li>Is the set of all finite subsets of ℕ countable? Is P(ℕ)?</li><li>Is the set of all infinite bit strings countable?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) n ↦ 2n + 1. 2) Finite subsets: countable (encode each as a finite bit string / list by largest element). P(ℕ): uncountable (Cantor). 3) No — it is in bijection with P(ℕ); diagonalise.</p></div>`,
  `<span class="eyebrow">MAD102 · Chương 3 · Bài 3.4</span>
<h2>Lực lượng tập vô hạn: đếm được và không đếm được</h2>
<p class="lead">Số thực có nhiều hơn số nguyên không? Bài toán có nhiều hơn chương trình không? Câu trả lời của Cantor — có, và chứng minh được — là lý do có những bài toán không máy tính nào giải nổi, ta sẽ gặp lại ở bài toán dừng trong Chương 5.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Định nghĩa “cùng lực lượng” bằng song ánh và “đếm được”.</li><li>Chứng tỏ ℤ, ℚ và tập mọi xâu hữu hạn là đếm được.</li><li>Trình bày lại lập luận đường chéo của Cantor và giải thích vì sao tồn tại hàm không tính được.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Hai tập A và B <strong>cùng lực lượng</strong>, |A| = |B|, nếu có song ánh A → B. Viết |A| ≤ |B| nếu có đơn ánh A → B. <strong>Định lý Schröder–Bernstein</strong>: có đơn ánh theo cả hai chiều thì có song ánh, nên ≤ hành xử như một thứ tự.</p>
<p>Một tập <strong>đếm được</strong> nếu nó hữu hạn hoặc cùng lực lượng với ℤ<sup>+</sup> (ký hiệu ℵ<sub>0</sub>) — tương đương, các phần tử của nó liệt kê được thành dãy a<sub>1</sub>, a<sub>2</sub>, a<sub>3</sub>, … trong đó phần tử nào cũng xuất hiện. Tập vô hạn hành xử lạ: tập số chẵn là tập con thực sự của ℕ nhưng cùng lực lượng (n ↦ 2n).</p>
<ul>
<li><strong>ℤ đếm được:</strong> liệt kê 0, 1, −1, 2, −2, 3, −3, …</li>
<li><strong>ℤ<sup>+</sup> × ℤ<sup>+</sup> và ℚ đếm được:</strong> liệt kê cặp theo đường chéo p + q = 2, 3, 4, … (bỏ phân số trùng).</li>
<li><strong>Σ* (mọi xâu hữu hạn trên bảng chữ hữu hạn) đếm được:</strong> liệt kê theo độ dài rồi theo thứ tự từ điển. Nói riêng, tập mọi chương trình Python là đếm được.</li>
<li>Hợp đếm được các tập đếm được là đếm được.</li>
</ul>
<p><strong>Lập luận đường chéo của Cantor.</strong> Giả sử các số thực trong (0, 1) liệt kê được r<sub>1</sub>, r<sub>2</sub>, … với khai triển thập phân r<sub>i</sub> = 0.d<sub>i1</sub>d<sub>i2</sub>d<sub>i3</sub>… Dựng r = 0.e<sub>1</sub>e<sub>2</sub>… với e<sub>i</sub> = 4 nếu d<sub>ii</sub> ≠ 4 và e<sub>i</sub> = 5 nếu d<sub>ii</sub> = 4. Khi đó r khác mọi r<sub>i</sub> ở chữ số thứ i, nên r không có trong danh sách — mâu thuẫn. Vậy ℝ <strong>không đếm được</strong>.</p>
<p><strong>Định lý Cantor:</strong> với mọi tập S, |P(S)| &gt; |S|. Nếu f: S → P(S) là toàn ánh thì tập D = {x ∈ S | x ∉ f(x)} bằng f(d) với d nào đó, và khi đó d ∈ D ⇔ d ∉ D. Vậy có một thang vô tận các vô hạn.</p>
<div class="callout"><p><b>Hệ quả cho khoa học máy tính.</b> Tập các hàm ℕ → {0, 1} (bài toán quyết định) có lực lượng của P(ℕ), không đếm được, nhưng chương trình thì đếm được. Vậy <strong>phần lớn bài toán quyết định không có chương trình nào giải</strong>. Chương 5 đưa ra một ví dụ cụ thể: bài toán dừng.</p></div>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — song ánh ℕ → ℤ.</b> f(n) = (n + 1)/2 nếu n lẻ, −n/2 nếu n chẵn. Phép dựng đường chéo và song ánh trên trường hợp nhỏ:</p></div>
<pre><code class="language-python"># Cantor's diagonal argument on a finite list of 0/1 strings:
rows = ["0101", "1100", "0010", "1111"]
diag = "".join("1" if rows[i][i] == "0" else "0" for i in range(len(rows)))
print("diagonal flipped:", diag)
print("appears in the list?", diag in rows)

# A bijection N -&gt; Z: 0, 1, -1, 2, -2, ...
f = lambda n: (n + 1) // 2 if n % 2 == 1 else -(n // 2)
print([f(n) for n in range(9)])</code></pre>
<div class="out">diagonal flipped: 1000
appears in the list? False
[0, 1, -1, 2, -2, 3, -3, 4, -4]</div>
<p>Đường chéo lật khác dòng i ở vị trí i, nên không bao giờ trùng một dòng nào — đúng ý tưởng của Cantor trên một bảng hữu hạn.</p>
<div class="callout"><p><b>Ví dụ 2.</b> (0, 1) và ℝ cùng lực lượng: f(x) = tan(π(x − 1/2)) là song ánh (0, 1) → ℝ.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Kết luận “tập con thực sự thì nhỏ hơn” với tập vô hạn — sai (số chẵn và ℕ).</li><li>Liệt kê ℚ “theo hàng” (1/1, 1/2, 1/3, …): hàng đầu không bao giờ hết nên không bao giờ tới 2/1. Dùng đường chéo.</li><li>Trong lập luận đường chéo, chọn chữ số 0/9, có thể sinh khai triển kép 0.0999… = 0.1000…</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>|A| = |B| ⇔ có song ánh; đếm được ⇔ liệt kê được.</li><li>ℕ, ℤ, ℚ, ℤ×ℤ, Σ* đếm được.</li><li>ℝ và P(ℕ) không đếm được (đường chéo); |P(S)| &gt; |S|.</li><li>Chương trình đếm được, bài toán không đếm được ⇒ tồn tại bài toán không tính được.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Cantor%27s_diagonal_argument" target="_blank" rel="noopener">Wikipedia — Cantor's diagonal argument</a></li><li><a href="https://en.wikipedia.org/wiki/Countable_set" target="_blank" rel="noopener">Wikipedia — Countable set</a></li><li><a href="https://en.wikipedia.org/wiki/Cantor%27s_theorem" target="_blank" rel="noopener">Wikipedia — Cantor's theorem</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Cho một song ánh giữa ℕ và tập các số nguyên dương lẻ.</li><li>Tập mọi tập con hữu hạn của ℕ có đếm được không? P(ℕ) thì sao?</li><li>Tập mọi chuỗi bit vô hạn có đếm được không?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) n ↦ 2n + 1. 2) Tập con hữu hạn: đếm được (mã hoá mỗi tập thành chuỗi bit hữu hạn / liệt kê theo phần tử lớn nhất). P(ℕ): không đếm được (Cantor). 3) Không — nó song ánh với P(ℕ); dùng đường chéo.</p></div>`);

const q3 = QZ(3, 'Quiz — Chapter 3: Sets, functions, sums, cardinality|||Quiz — Chương 3: Tập hợp, hàm, tổng, lực lượng', 'Kiểm tra chương 3: tập lũy thừa, đẳng thức tập, đơn/toàn/song ánh, đếm hàm, tổng đóng, tập đếm được và đường chéo Cantor.', [
  Q('q1', 'If |A| = 5, then |P(A)| =|||Nếu |A| = 5 thì |P(A)| =',
    ['10|||10', '25|||25', '32|||32', '120|||120'], 2,
    '2⁵ = 32 subsets.|||2⁵ = 32 tập con.'),
  Q('q2', '|A ∪ B| when |A| = 25, |B| = 18, |A ∩ B| = 7|||Tính |A ∪ B| khi |A| = 25, |B| = 18, |A ∩ B| = 7',
    ['43|||43', '36|||36', '50|||50', '32|||32'], 1,
    '25 + 18 − 7 = 36.|||25 + 18 − 7 = 36.'),
  Q('q3', 'f: ℤ → ℤ, f(x) = 2x + 3 is|||f: ℤ → ℤ, f(x) = 2x + 3 là',
    ['bijective|||song ánh', 'injective but not surjective|||đơn ánh nhưng không toàn ánh', 'surjective but not injective|||toàn ánh nhưng không đơn ánh', 'neither|||không đơn ánh cũng không toàn ánh'], 1,
    'Only odd integers are hit; on ℝ it would be bijective.|||Chỉ đạt các số lẻ; trên ℝ thì là song ánh.'),
  Q('q4', 'How many functions are there from a 3-element set to a 4-element set?|||Có bao nhiêu hàm từ tập 3 phần tử vào tập 4 phần tử?',
    ['12|||12', '24|||24', '64|||64', '81|||81'], 2,
    '4³ = 64 (24 of them are injective).|||4³ = 64 (trong đó 24 đơn ánh).'),
  Q('q5', 'How many surjections are there from a 4-element set onto a 3-element set?|||Có bao nhiêu toàn ánh từ tập 4 phần tử lên tập 3 phần tử?',
    ['24|||24', '36|||36', '64|||64', '81|||81'], 1,
    '3⁴ − 3·2⁴ + 3·1⁴ = 81 − 48 + 3 = 36.|||3⁴ − 3·2⁴ + 3·1⁴ = 81 − 48 + 3 = 36.'),
  Q('q6', 'Σ from k = 1 to 100 of k² equals|||Tổng k² với k từ 1 đến 100 bằng',
    ['5050|||5050', '338350|||338350', '1000000|||1000000', '171700|||171700'], 1,
    '100·101·201/6 = 338350.|||100·101·201/6 = 338350.'),
  Q('q7', 'Σ from k = 1 to n of 1/(k(k + 1)) equals|||Tổng 1/(k(k + 1)) với k từ 1 đến n bằng',
    ['1/n|||1/n', 'n/(n + 1)|||n/(n + 1)', '(n + 1)/n|||(n + 1)/n', 'ln n|||ln n'], 1,
    'Telescoping: 1 − 1/(n + 1).|||Tổng lồng: 1 − 1/(n + 1).'),
  Q('q8', 'Which set is uncountable?|||Tập nào không đếm được?',
    ['ℚ|||ℚ', 'the set of all finite bit strings|||tập mọi chuỗi bit hữu hạn', 'P(ℕ)|||P(ℕ)', 'ℤ × ℤ|||ℤ × ℤ'], 2,
    'Cantor: |P(ℕ)| is strictly larger than |ℕ|.|||Cantor: |P(ℕ)| lớn hơn ngặt |ℕ|.'),
  Q('q9', 'Why must there be decision problems that no program solves?|||Vì sao phải tồn tại bài toán quyết định không chương trình nào giải được?',
    ['computers are too slow|||máy tính quá chậm', 'programs are countable but problems are uncountable|||chương trình đếm được nhưng bài toán không đếm được', 'memory is finite|||bộ nhớ hữu hạn', 'P ≠ NP|||P ≠ NP'], 1,
    'A countable set cannot cover an uncountable one.|||Một tập đếm được không phủ được một tập không đếm được.'),
]);

const ch3 = {
  title: 'Chapter 3 — Sets, functions, sums and cardinality|||Chương 3 — Tập hợp, hàm, tổng và lực lượng',
  description: 'Tập hợp và đẳng thức tập hợp, hàm (đơn/toàn/song ánh, hàm ngược, hàm hợp, đếm hàm), dãy và tổng dạng đóng, lực lượng tập vô hạn và đường chéo Cantor (Rosen 2.1–2.5 · MCS ch. 4, 8, 14).',
  lessons: [c31, c32, c33, c34, q3],
};

// ───────────────────────────── Chương 4 — Quan hệ ─────────────────────────────
const c41 = L('mad102-ts-4-1',
  '4.1 — Relations and their properties|||4.1 — Quan hệ và các tính chất',
  'Quan hệ hai ngôi, biểu diễn bằng ma trận 0/1 và đồ thị có hướng; phản xạ, đối xứng, phản đối xứng, bắc cầu; hợp thành quan hệ; quan hệ n-ngôi và cơ sở dữ liệu; đếm quan hệ bằng Python.',
  `<span class="eyebrow">MAD102 · Chapter 4 · Lesson 4.1</span>
<h2>Relations and their properties</h2>
<p class="lead">A relation records which pairs of objects are connected: “follows” on a social network, “calls” between functions, “is a prerequisite of” between courses, rows of a database table. Four properties classify almost every relation you will meet.</p>
<h3>🎯 Objectives</h3>
<ul><li>Represent a relation as a set of pairs, a 0/1 matrix and a directed graph.</li><li>Decide whether a relation is reflexive, symmetric, antisymmetric, transitive.</li><li>Compose relations and connect n-ary relations to relational databases.</li></ul>
<h3>📖 Lecture</h3>
<p>A <strong>binary relation</strong> R from A to B is a subset R ⊆ A × B; we write a R b for (a, b) ∈ R. A relation <em>on</em> A is a subset of A × A. Every function is a relation, but a relation may relate one a to many b's or to none. On a finite set A = {a<sub>1</sub>, …, a<sub>n</sub>} we store R as an n × n <strong>0/1 matrix</strong> M with m<sub>ij</sub> = 1 iff a<sub>i</sub> R a<sub>j</sub>, or as a <strong>digraph</strong> with an arrow a<sub>i</sub> → a<sub>j</sub> for each pair.</p>
<ul>
<li><strong>Reflexive</strong>: ∀a (a R a). Matrix: all 1 on the diagonal; digraph: a loop at every vertex.</li>
<li><strong>Symmetric</strong>: a R b → b R a. Matrix equals its transpose.</li>
<li><strong>Antisymmetric</strong>: (a R b ∧ b R a) → a = b. No pair of opposite arrows between distinct vertices.</li>
<li><strong>Transitive</strong>: (a R b ∧ b R c) → a R c. Every path of length 2 has a shortcut arrow.</li>
</ul>
<p>Symmetric and antisymmetric are not opposites: “=” is both, and {(1, 2), (2, 1), (1, 3)} is neither.</p>
<p>The <strong>composition</strong> S ∘ R = {(a, c) | ∃b (a R b ∧ b S c)}. With matrices, M<sub>S∘R</sub> is the Boolean product M<sub>R</sub> ⊙ M<sub>S</sub> (AND instead of ×, OR instead of +). R<sup>n</sup> = R ∘ … ∘ R relates a to c iff there is a path of length n; R is transitive iff R<sup>2</sup> ⊆ R.</p>
<div class="formula"><span class="lbl">Counting relations on an n-set</span>all: 2<sup>n²</sup>   reflexive: 2<sup>n(n−1)</sup>   symmetric: 2<sup>n(n+1)/2</sup>   antisymmetric: 2<sup>n</sup>·3<sup>n(n−1)/2</sup></div>
<p><strong>n-ary relations and databases.</strong> A table with columns (StudentID, Course, Grade) is a 3-ary relation. Relational algebra operations are set operations: <em>selection</em> keeps rows satisfying a predicate (SQL <code>WHERE</code>), <em>projection</em> keeps some columns, and <em>join</em> combines two tables on equal fields — a composition of relations.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1.</b> On ℤ: “≤” is reflexive, antisymmetric, transitive, not symmetric. “a | b” on ℤ<sup>+</sup> is the same. “a ≡ b (mod 3)” is reflexive, symmetric, transitive. “a &lt; b” is antisymmetric (vacuously) and transitive but not reflexive. “|a − b| ≤ 1” is reflexive and symmetric but not transitive (1 ~ 2, 2 ~ 3, but not 1 ~ 3).</p></div>
<div class="callout"><p><b>Example 2 — brute-force check of the counting formulas for n = 3.</b> There are 9 possible pairs, so 2<sup>9</sup> relations; the program classifies every one:</p></div>
<pre><code class="language-python">from itertools import product

A = [1, 2, 3]
pairs = [(a, b) for a in A for b in A]

def props(R):
    refl = all((a, a) in R for a in A)
    sym = all((b, a) in R for (a, b) in R)
    anti = all(not ((b, a) in R and a != b) for (a, b) in R)
    trans = all((a, d) in R for (a, b) in R for (c, d) in R if b == c)
    return refl, sym, anti, trans

total = refl = sym = anti = equiv = 0
for bits in product([0, 1], repeat=len(pairs)):
    R = {p for p, bit in zip(pairs, bits) if bit}
    r, s, an, t = props(R)
    total += 1; refl += r; sym += s; anti += an; equiv += (r and s and t)
print("relations:", total, "reflexive:", refl, "symmetric:", sym,
      "antisymmetric:", anti, "equivalence:", equiv)

R = {(1, 1), (1, 2), (2, 1), (2, 2), (3, 3)}
print("R is (refl, sym, antisym, trans):", props(R))</code></pre>
<div class="out">relations: 512 reflexive: 64 symmetric: 64 antisymmetric: 216 equivalence: 5
R is (refl, sym, antisym, trans): (True, True, False, True)</div>
<p>The formulas predict 2<sup>9</sup> = 512, 2<sup>6</sup> = 64, 2<sup>6</sup> = 64, 2<sup>3</sup>·3<sup>3</sup> = 216 — all match. Only 5 relations on a 3-set are equivalence relations; that number (a Bell number) reappears in Lesson 4.3.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Declaring R reflexive because <em>some</em> a R a holds; reflexivity needs every element.</li><li>Thinking “not symmetric” means “antisymmetric”.</li><li>Checking transitivity only on pairs that look related; you must check every a R b, b R c, including b = a or b = c.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Relation = set of pairs; matrix and digraph representations.</li><li>Reflexive (diagonal), symmetric (M = M<sup>T</sup>), antisymmetric, transitive (R<sup>2</sup> ⊆ R).</li><li>Composition ↔ Boolean matrix product ↔ paths.</li><li>Database tables are n-ary relations; join is composition.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_gt-relations.html" target="_blank" rel="noopener">Levin, DMOI 2.6 — Relations and Graphs</a></li><li><a href="https://en.wikipedia.org/wiki/Binary_relation" target="_blank" rel="noopener">Wikipedia — Binary relation</a></li><li><a href="https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/pages/readings/" target="_blank" rel="noopener">MIT 6.042J readings — Binary Relations (Ch. 4), Digraphs (Ch. 10)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>On {1, 2, 3, 4}, is R = {(1, 1), (2, 2), (3, 3), (4, 4), (1, 2), (2, 3)} transitive? If not, which pair is missing?</li><li>How many relations on a 4-element set are reflexive?</li><li>Give a relation on {1, 2, 3} that is symmetric and transitive but not reflexive.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) No: (1, 2), (2, 3) ∈ R but (1, 3) ∉ R. 2) 2<sup>4·3</sup> = 2<sup>12</sup> = 4096. 3) {(1, 1)} (or ∅): it never relates 2 or 3 to themselves.</p></div>`,
  `<span class="eyebrow">MAD102 · Chương 4 · Bài 4.1</span>
<h2>Quan hệ và các tính chất</h2>
<p class="lead">Quan hệ ghi lại cặp đối tượng nào có liên hệ: “theo dõi” trên mạng xã hội, “gọi” giữa các hàm, “là tiên quyết của” giữa các môn học, các dòng của một bảng dữ liệu. Bốn tính chất đủ để phân loại hầu hết mọi quan hệ bạn sẽ gặp.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Biểu diễn quan hệ bằng tập cặp, ma trận 0/1 và đồ thị có hướng.</li><li>Xác định quan hệ có phản xạ, đối xứng, phản đối xứng, bắc cầu không.</li><li>Hợp thành các quan hệ và liên hệ quan hệ n-ngôi với cơ sở dữ liệu quan hệ.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Quan hệ hai ngôi</strong> R từ A đến B là tập con R ⊆ A × B; viết a R b khi (a, b) ∈ R. Quan hệ <em>trên</em> A là tập con của A × A. Mọi hàm đều là quan hệ, nhưng quan hệ có thể nối một a với nhiều b hoặc không với b nào. Trên tập hữu hạn A = {a<sub>1</sub>, …, a<sub>n</sub>} ta lưu R bằng <strong>ma trận 0/1</strong> cấp n với m<sub>ij</sub> = 1 khi và chỉ khi a<sub>i</sub> R a<sub>j</sub>, hoặc bằng <strong>đồ thị có hướng</strong> với mũi tên a<sub>i</sub> → a<sub>j</sub> cho mỗi cặp.</p>
<ul>
<li><strong>Phản xạ</strong>: ∀a (a R a). Ma trận: toàn 1 trên đường chéo; đồ thị: khuyên ở mọi đỉnh.</li>
<li><strong>Đối xứng</strong>: a R b → b R a. Ma trận bằng ma trận chuyển vị.</li>
<li><strong>Phản đối xứng</strong>: (a R b ∧ b R a) → a = b. Không có cặp mũi tên ngược chiều giữa hai đỉnh khác nhau.</li>
<li><strong>Bắc cầu</strong>: (a R b ∧ b R c) → a R c. Mọi đường đi độ dài 2 đều có mũi tên tắt.</li>
</ul>
<p>Đối xứng và phản đối xứng không phải hai cực đối nhau: “=” có cả hai, còn {(1, 2), (2, 1), (1, 3)} không có cái nào.</p>
<p><strong>Hợp thành</strong> S ∘ R = {(a, c) | ∃b (a R b ∧ b S c)}. Với ma trận, M<sub>S∘R</sub> là tích Boole M<sub>R</sub> ⊙ M<sub>S</sub> (AND thay ×, OR thay +). R<sup>n</sup> = R ∘ … ∘ R nối a với c khi và chỉ khi có đường đi độ dài n; R bắc cầu khi và chỉ khi R<sup>2</sup> ⊆ R.</p>
<div class="formula"><span class="lbl">Đếm quan hệ trên tập n phần tử</span>tất cả: 2<sup>n²</sup>   phản xạ: 2<sup>n(n−1)</sup>   đối xứng: 2<sup>n(n+1)/2</sup>   phản đối xứng: 2<sup>n</sup>·3<sup>n(n−1)/2</sup></div>
<p><strong>Quan hệ n-ngôi và cơ sở dữ liệu.</strong> Bảng có các cột (MãSV, Môn, Điểm) là một quan hệ 3-ngôi. Các phép của đại số quan hệ là phép toán tập hợp: <em>chọn</em> giữ các dòng thoả vị từ (<code>WHERE</code> trong SQL), <em>chiếu</em> giữ một số cột, <em>kết nối</em> (join) ghép hai bảng theo trường bằng nhau — một phép hợp thành quan hệ.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1.</b> Trên ℤ: “≤” phản xạ, phản đối xứng, bắc cầu, không đối xứng. “a | b” trên ℤ<sup>+</sup> cũng vậy. “a ≡ b (mod 3)” phản xạ, đối xứng, bắc cầu. “a &lt; b” phản đối xứng (hiển nhiên) và bắc cầu nhưng không phản xạ. “|a − b| ≤ 1” phản xạ và đối xứng nhưng không bắc cầu (1 ~ 2, 2 ~ 3, nhưng không có 1 ~ 3).</p></div>
<div class="callout"><p><b>Ví dụ 2 — kiểm vét cạn các công thức đếm với n = 3.</b> Có 9 cặp có thể nên có 2<sup>9</sup> quan hệ; chương trình phân loại từng quan hệ:</p></div>
<pre><code class="language-python">from itertools import product

A = [1, 2, 3]
pairs = [(a, b) for a in A for b in A]

def props(R):
    refl = all((a, a) in R for a in A)
    sym = all((b, a) in R for (a, b) in R)
    anti = all(not ((b, a) in R and a != b) for (a, b) in R)
    trans = all((a, d) in R for (a, b) in R for (c, d) in R if b == c)
    return refl, sym, anti, trans

total = refl = sym = anti = equiv = 0
for bits in product([0, 1], repeat=len(pairs)):
    R = {p for p, bit in zip(pairs, bits) if bit}
    r, s, an, t = props(R)
    total += 1; refl += r; sym += s; anti += an; equiv += (r and s and t)
print("relations:", total, "reflexive:", refl, "symmetric:", sym,
      "antisymmetric:", anti, "equivalence:", equiv)

R = {(1, 1), (1, 2), (2, 1), (2, 2), (3, 3)}
print("R is (refl, sym, antisym, trans):", props(R))</code></pre>
<div class="out">relations: 512 reflexive: 64 symmetric: 64 antisymmetric: 216 equivalence: 5
R is (refl, sym, antisym, trans): (True, True, False, True)</div>
<p>Công thức dự đoán 2<sup>9</sup> = 512, 2<sup>6</sup> = 64, 2<sup>6</sup> = 64, 2<sup>3</sup>·3<sup>3</sup> = 216 — đều khớp. Chỉ có 5 quan hệ tương đương trên tập 3 phần tử; con số này (số Bell) xuất hiện lại ở Bài 4.3.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Kết luận R phản xạ vì <em>có</em> a R a; phản xạ cần mọi phần tử.</li><li>Nghĩ “không đối xứng” nghĩa là “phản đối xứng”.</li><li>Chỉ kiểm bắc cầu trên những cặp trông có liên hệ; phải kiểm mọi a R b, b R c, kể cả khi b = a hoặc b = c.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Quan hệ = tập các cặp; biểu diễn bằng ma trận và đồ thị có hướng.</li><li>Phản xạ (đường chéo), đối xứng (M = M<sup>T</sup>), phản đối xứng, bắc cầu (R<sup>2</sup> ⊆ R).</li><li>Hợp thành ↔ tích ma trận Boole ↔ đường đi.</li><li>Bảng dữ liệu là quan hệ n-ngôi; join là hợp thành.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_gt-relations.html" target="_blank" rel="noopener">Levin, DMOI 2.6 — Relations and Graphs</a></li><li><a href="https://en.wikipedia.org/wiki/Binary_relation" target="_blank" rel="noopener">Wikipedia — Binary relation</a></li><li><a href="https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/pages/readings/" target="_blank" rel="noopener">MIT 6.042J readings — Binary Relations (Ch. 4), Digraphs (Ch. 10)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Trên {1, 2, 3, 4}, R = {(1, 1), (2, 2), (3, 3), (4, 4), (1, 2), (2, 3)} có bắc cầu không? Nếu không, thiếu cặp nào?</li><li>Có bao nhiêu quan hệ phản xạ trên tập 4 phần tử?</li><li>Cho một quan hệ trên {1, 2, 3} đối xứng và bắc cầu nhưng không phản xạ.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Không: (1, 2), (2, 3) ∈ R nhưng (1, 3) ∉ R. 2) 2<sup>4·3</sup> = 2<sup>12</sup> = 4096. 3) {(1, 1)} (hoặc ∅): nó không nối 2 hay 3 với chính nó.</p></div>`);

const c42 = L('mad102-ts-4-2',
  '4.2 — Closures of relations and Warshall’s algorithm|||4.2 — Bao đóng của quan hệ và thuật toán Warshall',
  'Bao đóng phản xạ, đối xứng, bắc cầu; bao đóng bắc cầu = tính liên thông (đường đi); R* = R ∪ R² ∪ … ∪ Rⁿ; thuật toán Warshall O(n³) chạy thật bằng Python; ứng dụng: khả năng tới được, phụ thuộc.',
  `<span class="eyebrow">MAD102 · Chapter 4 · Lesson 4.2</span>
<h2>Closures of relations and Warshall’s algorithm</h2>
<p class="lead">“Can user A reach user B through a chain of follows?” “Does module X depend, directly or indirectly, on module Y?” Both questions ask for the <strong>transitive closure</strong> of a relation — the smallest transitive relation containing it.</p>
<h3>🎯 Objectives</h3>
<ul><li>Compute reflexive, symmetric and transitive closures.</li><li>Relate the transitive closure to paths in the digraph.</li><li>Run Warshall's algorithm by hand and in code, and state its O(n<sup>3</sup>) cost.</li></ul>
<h3>📖 Lecture</h3>
<p>The <strong>closure</strong> of R with respect to a property P is the smallest relation that contains R and has P. Two are easy: the <strong>reflexive closure</strong> is R ∪ Δ where Δ = {(a, a) | a ∈ A}; the <strong>symmetric closure</strong> is R ∪ R<sup>−1</sup>, where R<sup>−1</sup> = {(b, a) | (a, b) ∈ R}.</p>
<p>The <strong>transitive closure</strong> R* adds (a, c) whenever there is a path from a to c of any positive length. On an n-element set a path never needs more than n edges (a longer one repeats a vertex and can be shortened), so</p>
<div class="formula"><span class="lbl">Transitive closure</span>R* = R ∪ R<sup>2</sup> ∪ … ∪ R<sup>n</sup>      M<sub>R*</sub> = M<sub>R</sub> ∨ M<sub>R</sub><sup>[2]</sup> ∨ … ∨ M<sub>R</sub><sup>[n]</sup></div>
<p>Computing n Boolean matrix powers costs O(n<sup>4</sup>). <strong>Warshall's algorithm</strong> does it in O(n<sup>3</sup>) with a different idea: W<sub>k</sub>[i][j] = 1 iff there is a path from i to j whose <em>interior</em> vertices all lie in {1, …, k}. Then</p>
<div class="formula"><span class="lbl">Warshall step</span>W<sub>k</sub>[i][j] = W<sub>k−1</sub>[i][j] ∨ (W<sub>k−1</sub>[i][k] ∧ W<sub>k−1</sub>[k][j])</div>
<p>Start with W<sub>0</sub> = M<sub>R</sub> and allow vertex 1, then 2, …, then n as an intermediate stop. The same triple loop with “min of sums” instead of “or of ands” is the Floyd–Warshall all-pairs shortest-path algorithm.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — small closures.</b> A = {1, 2, 3}, R = {(1, 2), (2, 3)}. Reflexive closure adds (1, 1), (2, 2), (3, 3). Symmetric closure adds (2, 1), (3, 2). Transitive closure adds (1, 3).</p></div>
<div class="callout"><p><b>Example 2 — Warshall by hand.</b> A = {1, 2, 3, 4}, R: 1 → 2, 2 → 3, 3 → 4, 4 → 2 (a cycle 2 → 3 → 4 → 2).<br>k = 1: nothing enters 1, no change. k = 2: anything reaching 2 (that is 1 and 4) now reaches 3: add (1, 3), (4, 3). k = 3: anything reaching 3 (1, 2, 4) reaches 4: add (1, 4), (2, 4), (4, 4). k = 4: anything reaching 4 (1, 2, 3, 4) reaches 2 and 3: add (2, 2), (3, 2), (3, 3). Result: every vertex reaches 2, 3, 4, and nothing reaches 1.</p></div>
<pre><code class="language-python">def warshall(M):
    """Transitive closure of a 0/1 adjacency matrix (Warshall, O(n^3))."""
    n = len(M)
    W = [row[:] for row in M]
    for k in range(n):
        for i in range(n):
            for j in range(n):
                W[i][j] = W[i][j] or (W[i][k] and W[k][j])
    return W

# R on {1,2,3,4}: 1-&gt;2, 2-&gt;3, 3-&gt;4, 4-&gt;2
M = [[0, 1, 0, 0],
     [0, 0, 1, 0],
     [0, 0, 0, 1],
     [0, 1, 0, 0]]
for row in warshall(M):
    print(row)</code></pre>
<div class="out">[0, 1, 1, 1]
[0, 1, 1, 1]
[0, 1, 1, 1]
[0, 1, 1, 1]</div>
<p>Each row i lists the vertices reachable from i. Diagonal entries for 2, 3, 4 are 1 because they lie on a cycle; (1, 1) stays 0 — the transitive closure does <em>not</em> automatically make R reflexive (that is the reflexive–transitive closure).</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Stopping after adding the pairs of R<sup>2</sup>: new pairs can create new length-2 paths; you must repeat until nothing changes (or use Warshall).</li><li>Putting the k-loop inside instead of outermost in Warshall — then it is no longer correct.</li><li>Assuming the transitive closure contains (a, a) for every a.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Reflexive closure R ∪ Δ; symmetric closure R ∪ R<sup>−1</sup>.</li><li>Transitive closure = reachability = R ∪ R<sup>2</sup> ∪ … ∪ R<sup>n</sup>.</li><li>Warshall: k outermost, O(n<sup>3</sup>).</li><li>Same pattern → Floyd–Warshall shortest paths.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Transitive_closure" target="_blank" rel="noopener">Wikipedia — Transitive closure</a></li><li><a href="https://cp-algorithms.com/graph/all-pair-shortest-path-floyd-warshall.html" target="_blank" rel="noopener">cp-algorithms — Floyd–Warshall (same triple loop)</a></li><li><a href="https://en.wikipedia.org/wiki/Closure_(mathematics)" target="_blank" rel="noopener">Wikipedia — Closure (mathematics)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Find the transitive closure of R = {(a, b), (b, c), (c, a)} on {a, b, c}.</li><li>How many Boolean operations does Warshall's algorithm perform on a 100-element set (one AND and one OR per inner step)?</li><li>Give the symmetric closure of “x is a parent of y”.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) All 9 pairs (the cycle lets every vertex reach every vertex, including itself). 2) 2·100<sup>3</sup> = 2 000 000. 3) “x is a parent or a child of y”.</p></div>`,
  `<span class="eyebrow">MAD102 · Chương 4 · Bài 4.2</span>
<h2>Bao đóng của quan hệ và thuật toán Warshall</h2>
<p class="lead">“Người A có tới được người B qua một chuỗi theo dõi không?” “Module X có phụ thuộc, trực tiếp hay gián tiếp, vào module Y không?” Cả hai câu hỏi đều đòi <strong>bao đóng bắc cầu</strong> của một quan hệ — quan hệ bắc cầu nhỏ nhất chứa nó.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính bao đóng phản xạ, đối xứng và bắc cầu.</li><li>Liên hệ bao đóng bắc cầu với đường đi trong đồ thị có hướng.</li><li>Chạy thuật toán Warshall bằng tay và bằng code, nêu chi phí O(n<sup>3</sup>).</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Bao đóng</strong> của R theo tính chất P là quan hệ nhỏ nhất chứa R và có P. Hai loại dễ: <strong>bao đóng phản xạ</strong> là R ∪ Δ với Δ = {(a, a) | a ∈ A}; <strong>bao đóng đối xứng</strong> là R ∪ R<sup>−1</sup>, trong đó R<sup>−1</sup> = {(b, a) | (a, b) ∈ R}.</p>
<p><strong>Bao đóng bắc cầu</strong> R* thêm (a, c) mỗi khi có đường đi từ a tới c với độ dài dương bất kỳ. Trên tập n phần tử, đường đi không bao giờ cần quá n cạnh (đường dài hơn lặp đỉnh và rút ngắn được), nên</p>
<div class="formula"><span class="lbl">Bao đóng bắc cầu</span>R* = R ∪ R<sup>2</sup> ∪ … ∪ R<sup>n</sup>      M<sub>R*</sub> = M<sub>R</sub> ∨ M<sub>R</sub><sup>[2]</sup> ∨ … ∨ M<sub>R</sub><sup>[n]</sup></div>
<p>Tính n lũy thừa ma trận Boole tốn O(n<sup>4</sup>). <strong>Thuật toán Warshall</strong> làm trong O(n<sup>3</sup>) bằng ý tưởng khác: W<sub>k</sub>[i][j] = 1 khi và chỉ khi có đường đi từ i tới j mà mọi đỉnh <em>trung gian</em> đều thuộc {1, …, k}. Khi đó</p>
<div class="formula"><span class="lbl">Bước Warshall</span>W<sub>k</sub>[i][j] = W<sub>k−1</sub>[i][j] ∨ (W<sub>k−1</sub>[i][k] ∧ W<sub>k−1</sub>[k][j])</div>
<p>Bắt đầu W<sub>0</sub> = M<sub>R</sub> rồi lần lượt cho phép đỉnh 1, 2, …, n làm điểm dừng trung gian. Cùng vòng lặp ba tầng đó, thay “hoặc của và” bằng “min của tổng”, là thuật toán Floyd–Warshall tìm đường ngắn nhất mọi cặp.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — bao đóng nhỏ.</b> A = {1, 2, 3}, R = {(1, 2), (2, 3)}. Bao đóng phản xạ thêm (1, 1), (2, 2), (3, 3). Bao đóng đối xứng thêm (2, 1), (3, 2). Bao đóng bắc cầu thêm (1, 3).</p></div>
<div class="callout"><p><b>Ví dụ 2 — Warshall bằng tay.</b> A = {1, 2, 3, 4}, R: 1 → 2, 2 → 3, 3 → 4, 4 → 2 (chu trình 2 → 3 → 4 → 2).<br>k = 1: không gì đi vào 1, không đổi. k = 2: những đỉnh tới được 2 (là 1 và 4) nay tới được 3: thêm (1, 3), (4, 3). k = 3: những đỉnh tới được 3 (1, 2, 4) tới được 4: thêm (1, 4), (2, 4), (4, 4). k = 4: những đỉnh tới được 4 (1, 2, 3, 4) tới được 2 và 3: thêm (2, 2), (3, 2), (3, 3). Kết quả: mọi đỉnh tới được 2, 3, 4, và không đỉnh nào tới được 1.</p></div>
<pre><code class="language-python">def warshall(M):
    """Transitive closure of a 0/1 adjacency matrix (Warshall, O(n^3))."""
    n = len(M)
    W = [row[:] for row in M]
    for k in range(n):
        for i in range(n):
            for j in range(n):
                W[i][j] = W[i][j] or (W[i][k] and W[k][j])
    return W

# R on {1,2,3,4}: 1-&gt;2, 2-&gt;3, 3-&gt;4, 4-&gt;2
M = [[0, 1, 0, 0],
     [0, 0, 1, 0],
     [0, 0, 0, 1],
     [0, 1, 0, 0]]
for row in warshall(M):
    print(row)</code></pre>
<div class="out">[0, 1, 1, 1]
[0, 1, 1, 1]
[0, 1, 1, 1]
[0, 1, 1, 1]</div>
<p>Dòng i liệt kê các đỉnh tới được từ i. Phần tử đường chéo của 2, 3, 4 bằng 1 vì chúng nằm trên chu trình; (1, 1) vẫn là 0 — bao đóng bắc cầu <em>không</em> tự làm R phản xạ (đó là bao đóng phản xạ – bắc cầu).</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dừng sau khi thêm các cặp của R<sup>2</sup>: cặp mới có thể tạo đường đi độ dài 2 mới; phải lặp tới khi không đổi (hoặc dùng Warshall).</li><li>Đặt vòng k ở trong thay vì ngoài cùng trong Warshall — khi đó thuật toán sai.</li><li>Cho rằng bao đóng bắc cầu chứa (a, a) với mọi a.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Bao đóng phản xạ R ∪ Δ; bao đóng đối xứng R ∪ R<sup>−1</sup>.</li><li>Bao đóng bắc cầu = khả năng tới được = R ∪ R<sup>2</sup> ∪ … ∪ R<sup>n</sup>.</li><li>Warshall: vòng k ngoài cùng, O(n<sup>3</sup>).</li><li>Cùng khuôn → Floyd–Warshall tìm đường ngắn nhất.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Transitive_closure" target="_blank" rel="noopener">Wikipedia — Transitive closure</a></li><li><a href="https://cp-algorithms.com/graph/all-pair-shortest-path-floyd-warshall.html" target="_blank" rel="noopener">cp-algorithms — Floyd–Warshall (cùng vòng lặp ba tầng)</a></li><li><a href="https://en.wikipedia.org/wiki/Closure_(mathematics)" target="_blank" rel="noopener">Wikipedia — Closure (mathematics)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tìm bao đóng bắc cầu của R = {(a, b), (b, c), (c, a)} trên {a, b, c}.</li><li>Thuật toán Warshall làm bao nhiêu phép Boole trên tập 100 phần tử (một AND và một OR mỗi bước trong cùng)?</li><li>Cho bao đóng đối xứng của “x là cha/mẹ của y”.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Cả 9 cặp (chu trình cho mọi đỉnh tới được mọi đỉnh, kể cả chính nó). 2) 2·100<sup>3</sup> = 2 000 000. 3) “x là cha/mẹ hoặc con của y”.</p></div>`);

const c43 = L('mad102-ts-4-3',
  '4.3 — Equivalence relations and partitions|||4.3 — Quan hệ tương đương và phân hoạch',
  'Quan hệ tương đương, lớp tương đương, định lý tương đương ⇔ phân hoạch, đồng dư modulo m, số Bell (đếm phân hoạch) sinh bằng Python, ứng dụng: chuẩn hoá dữ liệu, union-find, lớp đồng dư.',
  `<span class="eyebrow">MAD102 · Chapter 4 · Lesson 4.3</span>
<h2>Equivalence relations and partitions</h2>
<p class="lead">Whenever we say “these are the same for our purposes” — same remainder mod m, same file content, same connected component, same string ignoring case — we are using an equivalence relation, and it automatically splits the universe into disjoint classes.</p>
<h3>🎯 Objectives</h3>
<ul><li>Recognise equivalence relations and compute their equivalence classes.</li><li>State and use the correspondence between equivalence relations and partitions.</li><li>Count partitions of a finite set (Bell numbers).</li></ul>
<h3>📖 Lecture</h3>
<p>A relation on A is an <strong>equivalence relation</strong> if it is reflexive, symmetric and transitive. We write a ~ b. The <strong>equivalence class</strong> of a is [a] = {x ∈ A | x ~ a}; any element of a class is a <em>representative</em> of it.</p>
<p>A <strong>partition</strong> of A is a collection of non-empty, pairwise disjoint subsets (blocks) whose union is A.</p>
<div class="formula"><span class="lbl">Fundamental theorem</span>The equivalence classes of ~ form a partition of A. Conversely, every partition defines the equivalence relation “a ~ b ⇔ a and b lie in the same block”.</div>
<p>Proof idea: every a is in [a] (reflexive), so classes cover A. If [a] and [b] share an element c, then a ~ c ~ b, so a ~ b (symmetric, transitive), and then [a] = [b]. So two classes are either equal or disjoint.</p>
<p>The most important example is <strong>congruence modulo m</strong>: a ≡ b (mod m) iff m | (a − b). Its m classes [0], [1], …, [m − 1] are the residues; ℤ<sub>m</sub> = {0, 1, …, m − 1} is the set of classes and is the arithmetic of Chapter 6. Other examples: “same length” on strings, “same connected component” on the vertices of an undirected graph, and the <em>union–find</em> data structure, which maintains a partition under merges in almost constant time per operation.</p>
<p>The number of partitions of an n-element set is the <strong>Bell number</strong> B<sub>n</sub>: 1, 2, 5, 15, 52, 203, … for n = 1, 2, 3, … Equivalently, B<sub>n</sub> counts the equivalence relations on an n-set — which is why the brute-force count in Lesson 4.1 found 5 for n = 3.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1.</b> On ℤ, a ~ b ⇔ a<sup>2</sup> = b<sup>2</sup>. Reflexive, symmetric, transitive — yes. Classes: [0] = {0}, [k] = {k, −k} for k ≥ 1.</p></div>
<div class="callout"><p><b>Example 2.</b> On bit strings, s ~ t ⇔ s and t have the same first 3 bits. For strings of length ≥ 3 there are 2<sup>3</sup> = 8 classes, one per prefix.</p></div>
<div class="callout"><p><b>Example 3 — generating all partitions.</b> A recursive generator: take the first element and either add it to a block of a partition of the rest, or make it a new singleton block.</p></div>
<pre><code class="language-python">def partitions(s):
    """All partitions of list s into non-empty blocks."""
    if not s:
        yield []
        return
    first, rest = s[0], s[1:]
    for p in partitions(rest):
        for i in range(len(p)):                 # put first into an existing block
            yield p[:i] + [[first] + p[i]] + p[i + 1:]
        yield [[first]] + p                     # or into a new block

for n in range(1, 7):
    print(n, sum(1 for _ in partitions(list(range(n)))))
print(list(partitions([1, 2, 3])))

# equivalence classes of congruence mod 4 on {0..11}
classes = {}
for x in range(12):
    classes.setdefault(x % 4, []).append(x)
print(classes)</code></pre>
<div class="out">1 1
2 2
3 5
4 15
5 52
6 203
[[[1, 2, 3]], [[1], [2, 3]], [[1, 2], [3]], [[2], [1, 3]], [[1], [2], [3]]]
{0: [0, 4, 8], 1: [1, 5, 9], 2: [2, 6, 10], 3: [3, 7, 11]}</div>
<p>The counts are the Bell numbers, the five partitions of {1, 2, 3} are listed, and the last line shows the four congruence classes mod 4 inside {0, …, 11}.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Forgetting reflexivity: “a ~ b ⇔ a and b are friends” is usually not reflexive.</li><li>Calling a covering by overlapping subsets a partition — blocks must be disjoint and non-empty.</li><li>Confusing the number of classes with the size of a class.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Equivalence = reflexive + symmetric + transitive.</li><li>Equivalence classes ⇔ partition (two classes are equal or disjoint).</li><li>Congruence mod m has m classes, the elements of ℤ<sub>m</sub>.</li><li>Bell numbers count partitions: B<sub>3</sub> = 5, B<sub>4</sub> = 15.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Equivalence_relation" target="_blank" rel="noopener">Wikipedia — Equivalence relation</a></li><li><a href="https://en.wikipedia.org/wiki/Partition_of_a_set" target="_blank" rel="noopener">Wikipedia — Partition of a set</a></li><li><a href="https://richardhammack.github.io/BookOfProof/" target="_blank" rel="noopener">Hammack, Book of Proof — Ch. 11 Relations (equivalence classes, partitions)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Is “a ~ b ⇔ a − b is even” an equivalence on ℤ? What are its classes?</li><li>Is {{1, 2}, {2, 3}, {4}} a partition of {1, 2, 3, 4}?</li><li>How many equivalence relations are there on a 4-element set?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Yes (it is congruence mod 2); classes: evens and odds. 2) No — the blocks overlap in 2. 3) B<sub>4</sub> = 15.</p></div>`,
  `<span class="eyebrow">MAD102 · Chương 4 · Bài 4.3</span>
<h2>Quan hệ tương đương và phân hoạch</h2>
<p class="lead">Mỗi khi ta nói “với mục đích này thì chúng như nhau” — cùng số dư khi chia m, cùng nội dung tệp, cùng thành phần liên thông, cùng xâu khi bỏ qua hoa thường — là ta đang dùng một quan hệ tương đương, và nó tự động chia tập vũ trụ thành các lớp rời nhau.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Nhận ra quan hệ tương đương và tính các lớp tương đương.</li><li>Phát biểu và dùng sự tương ứng giữa quan hệ tương đương và phân hoạch.</li><li>Đếm số phân hoạch của tập hữu hạn (số Bell).</li></ul>
<h3>📖 Bài giảng</h3>
<p>Quan hệ trên A là <strong>quan hệ tương đương</strong> nếu nó phản xạ, đối xứng và bắc cầu. Viết a ~ b. <strong>Lớp tương đương</strong> của a là [a] = {x ∈ A | x ~ a}; mọi phần tử của lớp đều là một <em>đại diện</em> của lớp.</p>
<p><strong>Phân hoạch</strong> của A là họ các tập con khác rỗng, đôi một rời nhau (các khối), có hợp bằng A.</p>
<div class="formula"><span class="lbl">Định lý cơ bản</span>Các lớp tương đương của ~ tạo thành một phân hoạch của A. Ngược lại, mỗi phân hoạch xác định quan hệ tương đương “a ~ b ⇔ a và b cùng một khối”.</div>
<p>Ý chứng minh: mỗi a thuộc [a] (phản xạ), nên các lớp phủ A. Nếu [a] và [b] có chung phần tử c thì a ~ c ~ b, nên a ~ b (đối xứng, bắc cầu), và khi đó [a] = [b]. Vậy hai lớp hoặc bằng nhau hoặc rời nhau.</p>
<p>Ví dụ quan trọng nhất là <strong>đồng dư modulo m</strong>: a ≡ b (mod m) khi và chỉ khi m | (a − b). Có m lớp [0], [1], …, [m − 1] là các lớp thặng dư; ℤ<sub>m</sub> = {0, 1, …, m − 1} là tập các lớp và là số học của Chương 6. Ví dụ khác: “cùng độ dài” trên xâu, “cùng thành phần liên thông” trên đỉnh của đồ thị vô hướng, và cấu trúc dữ liệu <em>union–find</em>, duy trì một phân hoạch dưới các phép gộp với chi phí gần như hằng số mỗi phép.</p>
<p>Số phân hoạch của tập n phần tử là <strong>số Bell</strong> B<sub>n</sub>: 1, 2, 5, 15, 52, 203, … với n = 1, 2, 3, … Tương đương, B<sub>n</sub> đếm số quan hệ tương đương trên tập n phần tử — đó là lý do phép đếm vét cạn ở Bài 4.1 ra 5 với n = 3.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1.</b> Trên ℤ, a ~ b ⇔ a<sup>2</sup> = b<sup>2</sup>. Phản xạ, đối xứng, bắc cầu — có. Các lớp: [0] = {0}, [k] = {k, −k} với k ≥ 1.</p></div>
<div class="callout"><p><b>Ví dụ 2.</b> Trên chuỗi bit, s ~ t ⇔ s và t có cùng 3 bit đầu. Với chuỗi độ dài ≥ 3 có 2<sup>3</sup> = 8 lớp, mỗi lớp ứng một tiền tố.</p></div>
<div class="callout"><p><b>Ví dụ 3 — sinh mọi phân hoạch.</b> Bộ sinh đệ quy: lấy phần tử đầu, hoặc thêm nó vào một khối của một phân hoạch phần còn lại, hoặc cho nó thành khối đơn mới.</p></div>
<pre><code class="language-python">def partitions(s):
    """All partitions of list s into non-empty blocks."""
    if not s:
        yield []
        return
    first, rest = s[0], s[1:]
    for p in partitions(rest):
        for i in range(len(p)):                 # put first into an existing block
            yield p[:i] + [[first] + p[i]] + p[i + 1:]
        yield [[first]] + p                     # or into a new block

for n in range(1, 7):
    print(n, sum(1 for _ in partitions(list(range(n)))))
print(list(partitions([1, 2, 3])))

# equivalence classes of congruence mod 4 on {0..11}
classes = {}
for x in range(12):
    classes.setdefault(x % 4, []).append(x)
print(classes)</code></pre>
<div class="out">1 1
2 2
3 5
4 15
5 52
6 203
[[[1, 2, 3]], [[1], [2, 3]], [[1, 2], [3]], [[2], [1, 3]], [[1], [2], [3]]]
{0: [0, 4, 8], 1: [1, 5, 9], 2: [2, 6, 10], 3: [3, 7, 11]}</div>
<p>Các số đếm chính là số Bell, năm phân hoạch của {1, 2, 3} được liệt kê, và dòng cuối cho bốn lớp đồng dư mod 4 trong {0, …, 11}.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Quên tính phản xạ: “a ~ b ⇔ a và b là bạn” thường không phản xạ.</li><li>Gọi một cách phủ bằng các tập con chồng lên nhau là phân hoạch — các khối phải rời nhau và khác rỗng.</li><li>Nhầm số lớp với kích thước một lớp.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Tương đương = phản xạ + đối xứng + bắc cầu.</li><li>Lớp tương đương ⇔ phân hoạch (hai lớp hoặc bằng nhau hoặc rời nhau).</li><li>Đồng dư mod m có m lớp, là các phần tử của ℤ<sub>m</sub>.</li><li>Số Bell đếm phân hoạch: B<sub>3</sub> = 5, B<sub>4</sub> = 15.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Equivalence_relation" target="_blank" rel="noopener">Wikipedia — Equivalence relation</a></li><li><a href="https://en.wikipedia.org/wiki/Partition_of_a_set" target="_blank" rel="noopener">Wikipedia — Partition of a set</a></li><li><a href="https://richardhammack.github.io/BookOfProof/" target="_blank" rel="noopener">Hammack, Book of Proof — Ch. 11 Relations (lớp tương đương, phân hoạch)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>“a ~ b ⇔ a − b chẵn” có là quan hệ tương đương trên ℤ không? Các lớp là gì?</li><li>{{1, 2}, {2, 3}, {4}} có là phân hoạch của {1, 2, 3, 4} không?</li><li>Có bao nhiêu quan hệ tương đương trên tập 4 phần tử?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Có (đó là đồng dư mod 2); các lớp: số chẵn và số lẻ. 2) Không — các khối chồng nhau ở 2. 3) B<sub>4</sub> = 15.</p></div>`);

const c44 = L('mad102-ts-4-4',
  '4.4 — Partial orders, Hasse diagrams and topological sorting|||4.4 — Thứ tự bộ phận, biểu đồ Hasse và sắp xếp tô-pô',
  'Thứ tự bộ phận (poset), so sánh được, thứ tự toàn phần, thứ tự từ điển; biểu đồ Hasse; phần tử tối đại/tối tiểu, lớn nhất/nhỏ nhất, cận trên/dưới, dàn; sắp xếp tô-pô (Kahn) cho môn tiên quyết bằng Python.',
  `<span class="eyebrow">MAD102 · Chapter 4 · Lesson 4.4</span>
<h2>Partial orders, Hasse diagrams and topological sorting</h2>
<p class="lead">Build systems, spreadsheets, course plans and task schedulers all face the same question: in which order can we do things that depend on each other? The mathematics is the partial order; the algorithm is topological sorting.</p>
<h3>🎯 Objectives</h3>
<ul><li>Recognise partial and total orders, and lexicographic order.</li><li>Draw Hasse diagrams; find maximal/minimal, greatest/least elements and bounds.</li><li>Produce a topological sort and explain why it exists exactly when there is no cycle.</li></ul>
<h3>📖 Lecture</h3>
<p>A relation ≼ on S is a <strong>partial order</strong> if it is reflexive, antisymmetric and transitive; (S, ≼) is a <strong>poset</strong>. Examples: ≤ on ℤ, divisibility | on ℤ<sup>+</sup>, ⊆ on P(S), “is a prerequisite of (or equal to)” on courses. Elements a, b are <strong>comparable</strong> if a ≼ b or b ≼ a; in (ℤ<sup>+</sup>, |) the numbers 2 and 3 are incomparable — that is why the order is only <em>partial</em>. If every pair is comparable, ≼ is a <strong>total</strong> (linear) order.</p>
<p><strong>Lexicographic order</strong> on pairs: (a<sub>1</sub>, a<sub>2</sub>) ≺ (b<sub>1</sub>, b<sub>2</sub>) if a<sub>1</sub> ≺ b<sub>1</sub>, or a<sub>1</sub> = b<sub>1</sub> and a<sub>2</sub> ≺ b<sub>2</sub>. Dictionaries and string comparison in every programming language use it.</p>
<p>A <strong>Hasse diagram</strong> draws a poset compactly: omit loops (reflexivity), omit edges implied by transitivity, and draw every edge upward instead of with arrows. In a poset: a is <strong>maximal</strong> if nothing is strictly above it, <strong>minimal</strong> if nothing is strictly below; a is the <strong>greatest</strong> element if everything is ≼ a, the <strong>least</strong> if a ≼ everything. An upper bound of a subset is an element above all of it; the <strong>least upper bound</strong> (join) is the smallest such. A <strong>lattice</strong> is a poset where every pair has a least upper bound and a greatest lower bound: (ℤ<sup>+</sup>, |) is a lattice with lub = lcm and glb = gcd; (P(S), ⊆) with ∪ and ∩.</p>
<p>A <strong>topological sort</strong> lists the elements of a finite poset in a total order compatible with ≼ (if a ≺ b then a comes first). Every finite poset has one, because a finite non-empty poset always has a minimal element: output it, remove it, repeat. <strong>Kahn's algorithm</strong> implements this on a dependency graph: repeatedly output a vertex with in-degree 0 and delete its outgoing edges, in O(V + E). If at some point no vertex has in-degree 0 while vertices remain, the graph has a <strong>cycle</strong> — a circular dependency.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — divisors of 12.</b> S = {1, 2, 3, 4, 6, 12} under |. Hasse edges: 1–2, 1–3, 2–4, 2–6, 3–6, 4–12, 6–12. Least element 1, greatest 12. In the subset {2, 3}: upper bounds 6, 12; lub = 6 = lcm(2, 3). In {4, 6}: lub = 12, glb = 2.</p></div>
<div class="callout"><p><b>Example 2 — maximal vs greatest.</b> In {2, 3, 4, 6} under |, the maximal elements are 4 and 6, but there is no greatest element.</p></div>
<div class="callout"><p><b>Example 3 — a course plan.</b> Kahn's algorithm on a small prerequisite graph (codes are illustrative):</p></div>
<pre><code class="language-python">from collections import deque

# prerequisite pairs (a, b): course a must come before course b
prereq = [("MAD", "CSD"), ("PRF", "PRO"), ("PRO", "CSD"), ("CSD", "DAA"), ("MAD", "DAA")]
nodes = sorted({x for e in prereq for x in e})
indeg = {v: 0 for v in nodes}
adj = {v: [] for v in nodes}
for a, b in prereq:
    adj[a].append(b)
    indeg[b] += 1

q = deque(sorted(v for v in nodes if indeg[v] == 0))
order = []
while q:
    v = q.popleft()
    order.append(v)
    for w in sorted(adj[v]):
        indeg[w] -= 1
        if indeg[w] == 0:
            q.append(w)
print("topological order:", order)
print("has a cycle?", len(order) != len(nodes))</code></pre>
<div class="out">topological order: ['MAD', 'PRF', 'PRO', 'CSD', 'DAA']
has a cycle? False</div>
<p>Other valid orders exist (e.g. PRF, PRO, MAD, CSD, DAA); a topological sort is generally not unique.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Drawing transitive edges in a Hasse diagram (1–4 in the divisor example is implied by 1–2–4).</li><li>Confusing maximal (nothing above) with greatest (above everything).</li><li>Forgetting that a strict order (&lt;) is not a partial order in our sense because it is not reflexive.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Partial order = reflexive + antisymmetric + transitive.</li><li>Hasse diagram: no loops, no transitive edges, edges point up.</li><li>Maximal ≠ greatest; lattices have lub and glb for every pair.</li><li>Topological sort exists ⇔ no cycle; Kahn's algorithm O(V + E).</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Partially_ordered_set" target="_blank" rel="noopener">Wikipedia — Partially ordered set</a></li><li><a href="https://en.wikipedia.org/wiki/Hasse_diagram" target="_blank" rel="noopener">Wikipedia — Hasse diagram</a></li><li><a href="https://cp-algorithms.com/graph/topological-sort.html" target="_blank" rel="noopener">cp-algorithms — Topological Sorting</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Draw the Hasse diagram of (P({a, b, c}), ⊆). How many edges does it have?</li><li>In ({1, 2, 3, 5, 30}, |), list the minimal and maximal elements.</li><li>Tasks: A before C, B before C, C before D, D before B. Can they be scheduled?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) A cube: 8 vertices, 12 edges. 2) Minimal: 1; maximal: 30 (also greatest). 3) No — B → C → D → B is a cycle.</p></div>`,
  `<span class="eyebrow">MAD102 · Chương 4 · Bài 4.4</span>
<h2>Thứ tự bộ phận, biểu đồ Hasse và sắp xếp tô-pô</h2>
<p class="lead">Hệ thống build, bảng tính, kế hoạch học tập và bộ lập lịch công việc đều gặp cùng câu hỏi: làm các việc phụ thuộc nhau theo thứ tự nào? Phần toán là thứ tự bộ phận; phần thuật toán là sắp xếp tô-pô.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Nhận ra thứ tự bộ phận, thứ tự toàn phần và thứ tự từ điển.</li><li>Vẽ biểu đồ Hasse; tìm phần tử tối đại/tối tiểu, lớn nhất/nhỏ nhất và các cận.</li><li>Sắp xếp tô-pô và giải thích vì sao nó tồn tại đúng khi không có chu trình.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Quan hệ ≼ trên S là <strong>thứ tự bộ phận</strong> nếu nó phản xạ, phản đối xứng và bắc cầu; (S, ≼) gọi là <strong>poset</strong>. Ví dụ: ≤ trên ℤ, chia hết | trên ℤ<sup>+</sup>, ⊆ trên P(S), “là tiên quyết của (hoặc bằng)” trên các môn học. Hai phần tử a, b <strong>so sánh được</strong> nếu a ≼ b hoặc b ≼ a; trong (ℤ<sup>+</sup>, |) hai số 2 và 3 không so sánh được — vì thế thứ tự chỉ là <em>bộ phận</em>. Nếu mọi cặp đều so sánh được, ≼ là thứ tự <strong>toàn phần</strong> (tuyến tính).</p>
<p><strong>Thứ tự từ điển</strong> trên cặp: (a<sub>1</sub>, a<sub>2</sub>) ≺ (b<sub>1</sub>, b<sub>2</sub>) nếu a<sub>1</sub> ≺ b<sub>1</sub>, hoặc a<sub>1</sub> = b<sub>1</sub> và a<sub>2</sub> ≺ b<sub>2</sub>. Từ điển và phép so sánh xâu trong mọi ngôn ngữ lập trình đều dùng nó.</p>
<p><strong>Biểu đồ Hasse</strong> vẽ poset gọn: bỏ khuyên (phản xạ), bỏ cạnh suy ra được từ bắc cầu, và vẽ mọi cạnh hướng lên trên thay vì mũi tên. Trong poset: a <strong>tối đại</strong> nếu không có gì ngặt ở trên nó, <strong>tối tiểu</strong> nếu không có gì ngặt ở dưới; a là phần tử <strong>lớn nhất</strong> nếu mọi phần tử ≼ a, <strong>nhỏ nhất</strong> nếu a ≼ mọi phần tử. Cận trên của một tập con là phần tử ở trên tất cả các phần tử của nó; <strong>cận trên nhỏ nhất</strong> (join) là cận trên bé nhất. <strong>Dàn</strong> là poset mà mọi cặp đều có cận trên nhỏ nhất và cận dưới lớn nhất: (ℤ<sup>+</sup>, |) là dàn với lub = bội chung nhỏ nhất, glb = ước chung lớn nhất; (P(S), ⊆) với ∪ và ∩.</p>
<p><strong>Sắp xếp tô-pô</strong> liệt kê các phần tử của poset hữu hạn theo một thứ tự toàn phần tương thích với ≼ (nếu a ≺ b thì a đứng trước). Mọi poset hữu hạn đều có, vì poset hữu hạn khác rỗng luôn có phần tử tối tiểu: xuất nó, bỏ nó, lặp lại. <strong>Thuật toán Kahn</strong> cài đặt ý đó trên đồ thị phụ thuộc: liên tục xuất một đỉnh có bậc vào 0 và xoá các cạnh đi ra của nó, trong O(V + E). Nếu tới lúc không còn đỉnh bậc vào 0 mà vẫn còn đỉnh, đồ thị có <strong>chu trình</strong> — phụ thuộc vòng.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — ước của 12.</b> S = {1, 2, 3, 4, 6, 12} với |. Cạnh Hasse: 1–2, 1–3, 2–4, 2–6, 3–6, 4–12, 6–12. Nhỏ nhất là 1, lớn nhất là 12. Với tập con {2, 3}: cận trên 6, 12; lub = 6 = lcm(2, 3). Với {4, 6}: lub = 12, glb = 2.</p></div>
<div class="callout"><p><b>Ví dụ 2 — tối đại khác lớn nhất.</b> Trong {2, 3, 4, 6} với |, phần tử tối đại là 4 và 6, nhưng không có phần tử lớn nhất.</p></div>
<div class="callout"><p><b>Ví dụ 3 — kế hoạch học.</b> Thuật toán Kahn trên một đồ thị tiên quyết nhỏ (mã môn chỉ để minh hoạ):</p></div>
<pre><code class="language-python">from collections import deque

# prerequisite pairs (a, b): course a must come before course b
prereq = [("MAD", "CSD"), ("PRF", "PRO"), ("PRO", "CSD"), ("CSD", "DAA"), ("MAD", "DAA")]
nodes = sorted({x for e in prereq for x in e})
indeg = {v: 0 for v in nodes}
adj = {v: [] for v in nodes}
for a, b in prereq:
    adj[a].append(b)
    indeg[b] += 1

q = deque(sorted(v for v in nodes if indeg[v] == 0))
order = []
while q:
    v = q.popleft()
    order.append(v)
    for w in sorted(adj[v]):
        indeg[w] -= 1
        if indeg[w] == 0:
            q.append(w)
print("topological order:", order)
print("has a cycle?", len(order) != len(nodes))</code></pre>
<div class="out">topological order: ['MAD', 'PRF', 'PRO', 'CSD', 'DAA']
has a cycle? False</div>
<p>Còn các thứ tự hợp lệ khác (vd PRF, PRO, MAD, CSD, DAA); sắp xếp tô-pô nói chung không duy nhất.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Vẽ cạnh bắc cầu trong biểu đồ Hasse (1–4 ở ví dụ ước số đã được suy ra từ 1–2–4).</li><li>Nhầm tối đại (không có gì ở trên) với lớn nhất (ở trên mọi thứ).</li><li>Quên rằng thứ tự ngặt (&lt;) không phải thứ tự bộ phận theo nghĩa của ta vì không phản xạ.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Thứ tự bộ phận = phản xạ + phản đối xứng + bắc cầu.</li><li>Biểu đồ Hasse: không khuyên, không cạnh bắc cầu, cạnh hướng lên.</li><li>Tối đại ≠ lớn nhất; dàn có lub và glb cho mọi cặp.</li><li>Sắp xếp tô-pô tồn tại ⇔ không có chu trình; thuật toán Kahn O(V + E).</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Partially_ordered_set" target="_blank" rel="noopener">Wikipedia — Partially ordered set</a></li><li><a href="https://en.wikipedia.org/wiki/Hasse_diagram" target="_blank" rel="noopener">Wikipedia — Hasse diagram</a></li><li><a href="https://cp-algorithms.com/graph/topological-sort.html" target="_blank" rel="noopener">cp-algorithms — Topological Sorting</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Vẽ biểu đồ Hasse của (P({a, b, c}), ⊆). Nó có bao nhiêu cạnh?</li><li>Trong ({1, 2, 3, 5, 30}, |), liệt kê phần tử tối tiểu và tối đại.</li><li>Công việc: A trước C, B trước C, C trước D, D trước B. Có lập lịch được không?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Một hình lập phương: 8 đỉnh, 12 cạnh. 2) Tối tiểu: 1; tối đại: 30 (cũng là lớn nhất). 3) Không — B → C → D → B là chu trình.</p></div>`);

const q4 = QZ(4, 'Quiz — Chapter 4: Relations|||Quiz — Chương 4: Quan hệ', 'Kiểm tra chương 4: tính chất quan hệ, đếm quan hệ, bao đóng bắc cầu, Warshall, quan hệ tương đương, phân hoạch, poset, Hasse, sắp xếp tô-pô.', [
  Q('q1', 'The relation “|a − b| ≤ 1” on ℤ is|||Quan hệ “|a − b| ≤ 1” trên ℤ là',
    ['an equivalence relation|||quan hệ tương đương', 'reflexive and symmetric but not transitive|||phản xạ, đối xứng nhưng không bắc cầu', 'a partial order|||thứ tự bộ phận', 'antisymmetric|||phản đối xứng'], 1,
    '1 ~ 2 and 2 ~ 3 but not 1 ~ 3.|||1 ~ 2 và 2 ~ 3 nhưng không có 1 ~ 3.'),
  Q('q2', 'How many relations are there on a 3-element set?|||Có bao nhiêu quan hệ trên tập 3 phần tử?',
    ['9|||9', '64|||64', '512|||512', '27|||27'], 2,
    '2^(3²) = 2⁹ = 512.|||2^(3²) = 2⁹ = 512.'),
  Q('q3', 'How many symmetric relations are there on a 3-element set?|||Có bao nhiêu quan hệ đối xứng trên tập 3 phần tử?',
    ['8|||8', '64|||64', '216|||216', '512|||512'], 1,
    '2^(n(n+1)/2) = 2⁶ = 64.|||2^(n(n+1)/2) = 2⁶ = 64.'),
  Q('q4', 'The transitive closure of R corresponds to|||Bao đóng bắc cầu của R tương ứng với',
    ['loops at every vertex|||khuyên ở mọi đỉnh', 'reachability by a path of positive length|||tới được bằng đường đi độ dài dương', 'reversing every arrow|||đảo mọi mũi tên', 'removing cycles|||xoá chu trình'], 1,
    'R* = R ∪ R² ∪ … ∪ Rⁿ.|||R* = R ∪ R² ∪ … ∪ Rⁿ.'),
  Q('q5', 'The running time of Warshall’s algorithm on n elements is|||Thời gian chạy của thuật toán Warshall trên n phần tử là',
    ['O(n)|||O(n)', 'O(n²)|||O(n²)', 'O(n³)|||O(n³)', 'O(2ⁿ)|||O(2ⁿ)'], 2,
    'Three nested loops over k, i, j.|||Ba vòng lặp lồng theo k, i, j.'),
  Q('q6', 'How many equivalence relations are there on a 4-element set?|||Có bao nhiêu quan hệ tương đương trên tập 4 phần tử?',
    ['4|||4', '15|||15', '16|||16', '24|||24'], 1,
    'Bell number B₄ = 15 (one per partition).|||Số Bell B₄ = 15 (mỗi phân hoạch một quan hệ).'),
  Q('q7', 'In the poset ({2, 3, 4, 6}, |), which is true?|||Trong poset ({2, 3, 4, 6}, |), câu nào đúng?',
    ['6 is the greatest element|||6 là phần tử lớn nhất', '4 and 6 are maximal, there is no greatest|||4 và 6 tối đại, không có phần tử lớn nhất', '2 is the least element|||2 là phần tử nhỏ nhất', '3 is maximal|||3 tối đại'], 1,
    '4 does not divide 6 and 6 does not divide 4.|||4 không chia hết 6 và 6 không chia hết 4.'),
  Q('q8', 'In (ℤ⁺, |), the least upper bound of 4 and 6 is|||Trong (ℤ⁺, |), cận trên nhỏ nhất của 4 và 6 là',
    ['2|||2', '10|||10', '12|||12', '24|||24'], 2,
    'lub = lcm(4, 6) = 12; glb = gcd = 2.|||lub = lcm(4, 6) = 12; glb = gcd = 2.'),
  Q('q9', 'A directed graph has a topological sort if and only if|||Đồ thị có hướng có sắp xếp tô-pô khi và chỉ khi',
    ['it is connected|||nó liên thông', 'it has no directed cycle|||nó không có chu trình có hướng', 'every vertex has in-degree 0|||mọi đỉnh có bậc vào 0', 'it is a tree|||nó là cây'], 1,
    'Kahn’s algorithm gets stuck exactly on a cycle.|||Thuật toán Kahn bị kẹt đúng khi có chu trình.'),
]);

const ch4 = {
  title: 'Chapter 4 — Relations: closures, equivalences and orders|||Chương 4 — Quan hệ: bao đóng, tương đương và thứ tự',
  description: 'Quan hệ và tính chất, biểu diễn ma trận/đồ thị, bao đóng và thuật toán Warshall, quan hệ tương đương và phân hoạch (số Bell), thứ tự bộ phận, biểu đồ Hasse, dàn, sắp xếp tô-pô (Rosen ch. 9 · MCS ch. 4, 10).',
  lessons: [c41, c42, c43, c44, q4],
};

// ───────────────────────────── Chương 5 — Thuật toán & độ phức tạp ─────────────────────────────
const c51 = L('mad102-ts-5-1',
  '5.1 — Growth of functions: Big-O, Big-Omega, Big-Theta|||5.1 — Tốc độ tăng của hàm: Big-O, Big-Omega, Big-Theta',
  'Định nghĩa Big-O với nhân chứng C, k; Big-Ω, Big-Θ; quy tắc tổng/tích; thang tăng log n < n < n log n < n² < 2ⁿ < n!; chứng minh bằng nhân chứng và kiểm số bằng Python.',
  `<span class="eyebrow">MAD102 · Chapter 5 · Lesson 5.1</span>
<h2>Growth of functions: Big-O, Big-Omega, Big-Theta</h2>
<p class="lead">We do not care whether an algorithm takes 3n<sup>2</sup> + 5n + 2 or 4n<sup>2</sup> steps — machines differ by constant factors. We care that it grows like n<sup>2</sup>, because doubling the input quadruples the time. Asymptotic notation makes “grows like” precise.</p>
<h3>🎯 Objectives</h3>
<ul><li>State the definitions of O, Ω and Θ and prove a bound by exhibiting witnesses C and k.</li><li>Use the sum and product rules and the standard growth hierarchy.</li><li>Compare functions such as n log n and n<sup>1.5</sup>, or 2<sup>n</sup> and n!.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Definitions</span>f(n) is O(g(n)) ⇔ ∃C &gt; 0 ∃k ∀n &gt; k: |f(n)| ≤ C|g(n)|<br>f(n) is Ω(g(n)) ⇔ ∃C &gt; 0 ∃k ∀n &gt; k: |f(n)| ≥ C|g(n)|<br>f(n) is Θ(g(n)) ⇔ f is O(g) and f is Ω(g)</div>
<p>C and k are called <strong>witnesses</strong>. O is an upper bound (“at most a constant times”), Ω a lower bound, Θ a tight bound. Note the quantifier pattern from Chapter 1: ∃C ∃k ∀n — the same C must work for all large n.</p>
<p><strong>Useful facts.</strong> A polynomial of degree d is Θ(n<sup>d</sup>). log<sub>a</sub> n = log<sub>b</sub> n / log<sub>b</sub> a, so the base of a logarithm does not matter inside O. Sum rule: if f<sub>1</sub> is O(g<sub>1</sub>) and f<sub>2</sub> is O(g<sub>2</sub>), then f<sub>1</sub> + f<sub>2</sub> is O(max(g<sub>1</sub>, g<sub>2</sub>)). Product rule: f<sub>1</sub>f<sub>2</sub> is O(g<sub>1</sub>g<sub>2</sub>). log n! is Θ(n log n) (because n! ≤ n<sup>n</sup> and n! ≥ (n/2)<sup>n/2</sup>).</p>
<div class="formula"><span class="lbl">Growth hierarchy</span>1 ≺ log n ≺ √n ≺ n ≺ n log n ≺ n<sup>2</sup> ≺ n<sup>3</sup> ≺ 2<sup>n</sup> ≺ 3<sup>n</sup> ≺ n! ≺ n<sup>n</sup></div>
<p>Each function is O of the next one but not Ω of it. To compare two functions, look at the limit of their ratio: f/g → 0 means f grows strictly slower; f/g → c &gt; 0 means Θ.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — witnesses.</b> Show f(n) = 3n<sup>2</sup> + 5n + 2 is O(n<sup>2</sup>).<br>Quick witnesses: for n ≥ 1, 5n ≤ 5n<sup>2</sup> and 2 ≤ 2n<sup>2</sup>, so f(n) ≤ 10n<sup>2</sup>: C = 10, k = 1. Tighter: f(n) ≤ 4n<sup>2</sup> ⇔ n<sup>2</sup> − 5n − 2 ≥ 0, which holds for n ≥ 6: C = 4, k = 5. Also f(n) ≥ 3n<sup>2</sup>, so f is Θ(n<sup>2</sup>).</p></div>
<div class="callout"><p><b>Example 2 — not O.</b> n<sup>2</sup> is not O(n): if n<sup>2</sup> ≤ Cn for all n &gt; k, then n ≤ C for all large n — false.</p></div>
<div class="callout"><p><b>Example 3 — checking numerically.</b> The program verifies the witnesses C = 4, k = 5 and prints a table of log<sub>2</sub> n, n log<sub>2</sub> n, n<sup>1.5</sup> and n<sup>2</sup>:</p></div>
<pre><code class="language-python">import math

f = lambda n: 3 * n * n + 5 * n + 2
# witnesses C = 4, k = 6 for f(n) = O(n^2)
print(all(f(n) &lt;= 4 * n * n for n in range(6, 10**5)))
print([n for n in range(1, 10) if f(n) &gt; 4 * n * n])     # where the bound fails

for n in [10, 100, 1000, 10**6]:
    print(n, round(math.log2(n), 1), round(n * math.log2(n)), round(n ** 1.5), n * n)</code></pre>
<div class="out">True
[1, 2, 3, 4, 5]
10 3.3 33 32 100
100 6.6 664 1000 10000
1000 10.0 9966 31623 1000000
1000000 19.9 19931569 1000000000 1000000000000</div>
<p>The bound fails exactly for n = 1, …, 5, as computed. In the table, n log n and n<sup>1.5</sup> are close at n = 10 (33 vs 32), but at n = 10<sup>6</sup> the gap is 50×: n log n ≺ n<sup>1.5</sup>. A finite table suggests; the limit (log n)/√n → 0 proves.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Reading “f = O(g)” as an equation: O(n) = O(n<sup>2</sup>) is true but O(n<sup>2</sup>) = O(n) is not. It means “f belongs to the set O(g)”.</li><li>Saying “binary search is O(log n) so it is fast for every input size” — O hides constants; for tiny n a linear scan may win.</li><li>Writing O for a lower bound (“sorting is at least O(n log n)”) — use Ω.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>O ≤, Ω ≥, Θ = up to constants, for large n.</li><li>Prove with explicit witnesses C, k.</li><li>Polynomial of degree d is Θ(n<sup>d</sup>); log base does not matter.</li><li>1 ≺ log n ≺ n ≺ n log n ≺ n<sup>2</sup> ≺ 2<sup>n</sup> ≺ n!.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://brilliant.org/wiki/big-o-notation/" target="_blank" rel="noopener">Brilliant — Big O Notation</a></li><li><a href="https://en.wikipedia.org/wiki/Big_O_notation" target="_blank" rel="noopener">Wikipedia — Big O notation</a></li><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_seq-growth.html" target="_blank" rel="noopener">Levin, DMOI 4.2 — Rate of Growth</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Give witnesses showing 7n + 100 is O(n).</li><li>Order by growth: n<sup>2</sup> log n, 2<sup>n/2</sup>, n<sup>3</sup>, (log n)<sup>10</sup>, n!.</li><li>Is 2<sup>n+1</sup> O(2<sup>n</sup>)? Is 2<sup>2n</sup> O(2<sup>n</sup>)?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) C = 8, k = 100 (7n + 100 ≤ 8n for n ≥ 100). 2) (log n)<sup>10</sup> ≺ n<sup>2</sup> log n ≺ n<sup>3</sup> ≺ 2<sup>n/2</sup> ≺ n!. 3) Yes (C = 2). No: 2<sup>2n</sup>/2<sup>n</sup> = 2<sup>n</sup> → ∞.</p></div>`,
  `<span class="eyebrow">MAD102 · Chương 5 · Bài 5.1</span>
<h2>Tốc độ tăng của hàm: Big-O, Big-Omega, Big-Theta</h2>
<p class="lead">Ta không quan tâm thuật toán tốn 3n<sup>2</sup> + 5n + 2 hay 4n<sup>2</sup> bước — máy khác nhau chênh nhau hằng số lần. Ta quan tâm nó tăng như n<sup>2</sup>, vì gấp đôi đầu vào thì thời gian gấp bốn. Ký hiệu tiệm cận làm cho chữ “tăng như” trở nên chính xác.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phát biểu định nghĩa O, Ω, Θ và chứng minh một cận bằng cách đưa ra nhân chứng C và k.</li><li>Dùng quy tắc tổng, quy tắc tích và thang tăng chuẩn.</li><li>So sánh các hàm như n log n với n<sup>1.5</sup>, hay 2<sup>n</sup> với n!.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Định nghĩa</span>f(n) là O(g(n)) ⇔ ∃C &gt; 0 ∃k ∀n &gt; k: |f(n)| ≤ C|g(n)|<br>f(n) là Ω(g(n)) ⇔ ∃C &gt; 0 ∃k ∀n &gt; k: |f(n)| ≥ C|g(n)|<br>f(n) là Θ(g(n)) ⇔ f là O(g) và f là Ω(g)</div>
<p>C và k gọi là <strong>nhân chứng</strong>. O là cận trên (“không quá hằng số lần”), Ω là cận dưới, Θ là cận chặt. Chú ý mẫu lượng từ ở Chương 1: ∃C ∃k ∀n — cùng một C phải đúng cho mọi n đủ lớn.</p>
<p><strong>Sự kiện hữu ích.</strong> Đa thức bậc d là Θ(n<sup>d</sup>). log<sub>a</sub> n = log<sub>b</sub> n / log<sub>b</sub> a, nên cơ số logarit không quan trọng trong O. Quy tắc tổng: nếu f<sub>1</sub> là O(g<sub>1</sub>) và f<sub>2</sub> là O(g<sub>2</sub>) thì f<sub>1</sub> + f<sub>2</sub> là O(max(g<sub>1</sub>, g<sub>2</sub>)). Quy tắc tích: f<sub>1</sub>f<sub>2</sub> là O(g<sub>1</sub>g<sub>2</sub>). log n! là Θ(n log n) (vì n! ≤ n<sup>n</sup> và n! ≥ (n/2)<sup>n/2</sup>).</p>
<div class="formula"><span class="lbl">Thang tăng</span>1 ≺ log n ≺ √n ≺ n ≺ n log n ≺ n<sup>2</sup> ≺ n<sup>3</sup> ≺ 2<sup>n</sup> ≺ 3<sup>n</sup> ≺ n! ≺ n<sup>n</sup></div>
<p>Mỗi hàm là O của hàm kế tiếp nhưng không là Ω của nó. Để so sánh hai hàm, xét giới hạn tỉ số: f/g → 0 nghĩa là f tăng chậm hơn hẳn; f/g → c &gt; 0 nghĩa là Θ.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — nhân chứng.</b> Chứng minh f(n) = 3n<sup>2</sup> + 5n + 2 là O(n<sup>2</sup>).<br>Nhân chứng nhanh: với n ≥ 1, 5n ≤ 5n<sup>2</sup> và 2 ≤ 2n<sup>2</sup>, nên f(n) ≤ 10n<sup>2</sup>: C = 10, k = 1. Chặt hơn: f(n) ≤ 4n<sup>2</sup> ⇔ n<sup>2</sup> − 5n − 2 ≥ 0, đúng với n ≥ 6: C = 4, k = 5. Ngoài ra f(n) ≥ 3n<sup>2</sup>, nên f là Θ(n<sup>2</sup>).</p></div>
<div class="callout"><p><b>Ví dụ 2 — không phải O.</b> n<sup>2</sup> không là O(n): nếu n<sup>2</sup> ≤ Cn với mọi n &gt; k thì n ≤ C với mọi n lớn — sai.</p></div>
<div class="callout"><p><b>Ví dụ 3 — kiểm bằng số.</b> Chương trình kiểm nhân chứng C = 4, k = 5 và in bảng log<sub>2</sub> n, n log<sub>2</sub> n, n<sup>1.5</sup>, n<sup>2</sup>:</p></div>
<pre><code class="language-python">import math

f = lambda n: 3 * n * n + 5 * n + 2
# witnesses C = 4, k = 6 for f(n) = O(n^2)
print(all(f(n) &lt;= 4 * n * n for n in range(6, 10**5)))
print([n for n in range(1, 10) if f(n) &gt; 4 * n * n])     # where the bound fails

for n in [10, 100, 1000, 10**6]:
    print(n, round(math.log2(n), 1), round(n * math.log2(n)), round(n ** 1.5), n * n)</code></pre>
<div class="out">True
[1, 2, 3, 4, 5]
10 3.3 33 32 100
100 6.6 664 1000 10000
1000 10.0 9966 31623 1000000
1000000 19.9 19931569 1000000000 1000000000000</div>
<p>Cận chỉ sai đúng với n = 1, …, 5, như đã tính. Trong bảng, n log n và n<sup>1.5</sup> gần nhau ở n = 10 (33 so với 32), nhưng ở n = 10<sup>6</sup> chênh 50 lần: n log n ≺ n<sup>1.5</sup>. Bảng hữu hạn chỉ gợi ý; giới hạn (log n)/√n → 0 mới là chứng minh.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Đọc “f = O(g)” như một đẳng thức: O(n) = O(n<sup>2</sup>) đúng nhưng O(n<sup>2</sup>) = O(n) thì không. Nó nghĩa là “f thuộc tập O(g)”.</li><li>Nói “tìm kiếm nhị phân là O(log n) nên nhanh với mọi kích thước” — O giấu hằng số; với n rất nhỏ quét tuyến tính có thể thắng.</li><li>Dùng O cho cận dưới (“sắp xếp ít nhất O(n log n)”) — phải dùng Ω.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>O ≤, Ω ≥, Θ = sai khác hằng số, với n lớn.</li><li>Chứng minh bằng nhân chứng C, k cụ thể.</li><li>Đa thức bậc d là Θ(n<sup>d</sup>); cơ số log không quan trọng.</li><li>1 ≺ log n ≺ n ≺ n log n ≺ n<sup>2</sup> ≺ 2<sup>n</sup> ≺ n!.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://brilliant.org/wiki/big-o-notation/" target="_blank" rel="noopener">Brilliant — Big O Notation</a></li><li><a href="https://en.wikipedia.org/wiki/Big_O_notation" target="_blank" rel="noopener">Wikipedia — Big O notation</a></li><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_seq-growth.html" target="_blank" rel="noopener">Levin, DMOI 4.2 — Rate of Growth</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Cho nhân chứng chứng tỏ 7n + 100 là O(n).</li><li>Sắp theo tốc độ tăng: n<sup>2</sup> log n, 2<sup>n/2</sup>, n<sup>3</sup>, (log n)<sup>10</sup>, n!.</li><li>2<sup>n+1</sup> có là O(2<sup>n</sup>) không? 2<sup>2n</sup> có là O(2<sup>n</sup>) không?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) C = 8, k = 100 (7n + 100 ≤ 8n khi n ≥ 100). 2) (log n)<sup>10</sup> ≺ n<sup>2</sup> log n ≺ n<sup>3</sup> ≺ 2<sup>n/2</sup> ≺ n!. 3) Có (C = 2). Không: 2<sup>2n</sup>/2<sup>n</sup> = 2<sup>n</sup> → ∞.</p></div>`);

const c52 = L('mad102-ts-5-2',
  '5.2 — Analysing algorithms: searching, sorting and nested loops|||5.2 — Phân tích thuật toán: tìm kiếm, sắp xếp và vòng lặp lồng',
  'Đếm phép toán cơ bản, trường hợp xấu nhất/trung bình/tốt nhất; tìm kiếm tuyến tính và nhị phân (⌊log₂n⌋ + 1 phép so sánh); insertion sort n(n−1)/2; vòng lặp lồng; đo số phép so sánh bằng Python.',
  `<span class="eyebrow">MAD102 · Chapter 5 · Lesson 5.2</span>
<h2>Analysing algorithms: searching, sorting and nested loops</h2>
<p class="lead">Analysing an algorithm means counting its basic operations as a function of the input size n, usually in the worst case. With the sums of Chapter 3 and the notation of Lesson 5.1, most loop-based algorithms can be analysed in a few lines.</p>
<h3>🎯 Objectives</h3>
<ul><li>Choose a basic operation and count it in the worst, best and average case.</li><li>Derive the complexity of linear search, binary search and insertion sort.</li><li>Translate nested loops into sums and then into Θ-bounds.</li></ul>
<h3>📖 Lecture</h3>
<p>An <strong>algorithm</strong> is a finite sequence of precise instructions that solves a problem; it should be correct, finite and effective. To analyse <strong>time complexity</strong>, pick a basic operation (a comparison, an arithmetic operation, an array access) and count how many times it runs for an input of size n. The <strong>worst case</strong> gives a guarantee; the <strong>average case</strong> assumes a probability distribution on inputs (Chapter 9); the best case is rarely informative.</p>
<ul>
<li><strong>Linear search</strong> for x in n items: worst case n comparisons (x is last or absent) ⇒ Θ(n). Average, if x is present and equally likely anywhere: (n + 1)/2.</li>
<li><strong>Binary search</strong> in a sorted array: each comparison halves the remaining range, so after k comparisons at most n/2<sup>k</sup> candidates remain. Worst case ⌊log<sub>2</sub> n⌋ + 1 comparisons ⇒ Θ(log n).</li>
<li><strong>Insertion sort</strong>: inserting element i may compare it with all i earlier elements. Worst case (reversed input) 1 + 2 + … + (n − 1) = n(n − 1)/2 ⇒ Θ(n<sup>2</sup>); best case (already sorted) n − 1.</li>
<li><strong>Bubble sort</strong>: always (n − 1) + (n − 2) + … + 1 = n(n − 1)/2 comparisons in the basic version.</li>
</ul>
<p><strong>Nested loops</strong> become nested sums. <code>for i in range(n): for j in range(n)</code> runs n<sup>2</sup> times; <code>for i in range(n): for j in range(i)</code> runs n(n − 1)/2 — still Θ(n<sup>2</sup>). A loop where the counter doubles (<code>i = 1; while i &lt; n: i *= 2</code>) runs about log<sub>2</sub> n times. Matrix multiplication with three nested loops is Θ(n<sup>3</sup>).</p>
<p>Sorting by comparisons cannot beat Ω(n log n) in the worst case (proved with decision trees in Chapter 11); merge sort reaches O(n log n) (Chapter 8).</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — counting in code.</b> Instrument binary search and insertion sort to count comparisons:</p></div>
<pre><code class="language-python">def binary_search(a, x):
    lo, hi, comps = 0, len(a) - 1, 0
    while lo &lt;= hi:
        mid = (lo + hi) // 2
        comps += 1
        if a[mid] == x:
            return mid, comps
        if a[mid] &lt; x:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1, comps

def insertion_sort(a):
    a, comps = a[:], 0
    for i in range(1, len(a)):
        key, j = a[i], i - 1
        while j &gt;= 0:
            comps += 1
            if a[j] &lt;= key:
                break
            a[j + 1] = a[j]
            j -= 1
        a[j + 1] = key
    return a, comps

a = list(range(1000))
print("worst binary search comparisons, n=1000:",
      max(binary_search(a, x)[1] for x in range(-1, 1001)))
for n in [10, 100, 1000]:
    print(n, "insertion sort on reversed input:", insertion_sort(list(range(n, 0, -1)))[1],
          " n(n-1)/2 =", n * (n - 1) // 2)</code></pre>
<div class="out">worst binary search comparisons, n=1000: 10
10 insertion sort on reversed input: 45  n(n-1)/2 = 45
100 insertion sort on reversed input: 4950  n(n-1)/2 = 4950
1000 insertion sort on reversed input: 499500  n(n-1)/2 = 499500</div>
<p>For n = 1000, ⌊log<sub>2</sub> 1000⌋ + 1 = 9 + 1 = 10 comparisons, as measured. Insertion sort on reversed input matches n(n − 1)/2 exactly; multiplying n by 10 multiplies the work by about 100 — the signature of Θ(n<sup>2</sup>).</p>
<div class="callout"><p><b>Example 2 — a nested loop.</b> <code>for i in range(1, n + 1): j = n; while j &gt; 1: j //= 2</code>. The inner loop runs ⌊log<sub>2</sub> n⌋ times for each of the n values of i, so the total is Θ(n log n).</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Counting the loop variable updates instead of the dominant operation — fine for Θ, wrong for exact counts.</li><li>Assuming binary search works on unsorted data.</li><li>Adding instead of multiplying the costs of nested loops (or multiplying the costs of consecutive loops).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Count a basic operation as a function of n; usually report the worst case.</li><li>Linear search Θ(n); binary search ⌊log<sub>2</sub> n⌋ + 1 = Θ(log n).</li><li>Insertion/bubble sort worst case n(n − 1)/2 = Θ(n<sup>2</sup>).</li><li>Nested loops → nested sums; halving loops → log n.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Binary_search" target="_blank" rel="noopener">Wikipedia — Binary search (performance analysis)</a></li><li><a href="https://en.wikipedia.org/wiki/Insertion_sort" target="_blank" rel="noopener">Wikipedia — Insertion sort</a></li><li><a href="https://en.wikipedia.org/wiki/Time_complexity" target="_blank" rel="noopener">Wikipedia — Time complexity</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>How many comparisons does binary search need in the worst case for n = 10<sup>6</sup>?</li><li>Give Θ for: <code>for i in range(n): for j in range(i, i + 5): work()</code>.</li><li>Give Θ for: <code>i = n; while i &gt; 0: for j in range(i): work(); i //= 2</code>.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) ⌊log<sub>2</sub> 10<sup>6</sup>⌋ + 1 = 19 + 1 = 20. 2) 5n ⇒ Θ(n). 3) n + n/2 + n/4 + … ≤ 2n ⇒ Θ(n).</p></div>`,
  `<span class="eyebrow">MAD102 · Chương 5 · Bài 5.2</span>
<h2>Phân tích thuật toán: tìm kiếm, sắp xếp và vòng lặp lồng</h2>
<p class="lead">Phân tích thuật toán là đếm số phép toán cơ bản theo kích thước đầu vào n, thường trong trường hợp xấu nhất. Với các tổng ở Chương 3 và ký hiệu ở Bài 5.1, đa số thuật toán dùng vòng lặp phân tích được trong vài dòng.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Chọn phép toán cơ bản và đếm nó trong trường hợp xấu nhất, tốt nhất, trung bình.</li><li>Suy ra độ phức tạp của tìm kiếm tuyến tính, tìm kiếm nhị phân và insertion sort.</li><li>Chuyển vòng lặp lồng thành tổng rồi thành cận Θ.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Thuật toán</strong> là dãy hữu hạn các chỉ thị chính xác giải một bài toán; nó phải đúng, hữu hạn và thực hiện được. Để phân tích <strong>độ phức tạp thời gian</strong>, chọn một phép toán cơ bản (phép so sánh, phép tính số học, truy cập mảng) và đếm số lần nó chạy với đầu vào kích thước n. <strong>Trường hợp xấu nhất</strong> cho một bảo đảm; <strong>trường hợp trung bình</strong> giả định một phân phối xác suất trên đầu vào (Chương 9); trường hợp tốt nhất hiếm khi có ích.</p>
<ul>
<li><strong>Tìm kiếm tuyến tính</strong> x trong n phần tử: xấu nhất n phép so sánh (x ở cuối hoặc không có) ⇒ Θ(n). Trung bình, nếu x có mặt và đồng khả năng ở mọi vị trí: (n + 1)/2.</li>
<li><strong>Tìm kiếm nhị phân</strong> trên mảng đã sắp: mỗi phép so sánh chia đôi phạm vi còn lại, nên sau k phép so sánh còn tối đa n/2<sup>k</sup> ứng viên. Xấu nhất ⌊log<sub>2</sub> n⌋ + 1 phép so sánh ⇒ Θ(log n).</li>
<li><strong>Insertion sort</strong>: chèn phần tử thứ i có thể phải so với cả i phần tử trước. Xấu nhất (đầu vào đảo ngược) 1 + 2 + … + (n − 1) = n(n − 1)/2 ⇒ Θ(n<sup>2</sup>); tốt nhất (đã sắp) n − 1.</li>
<li><strong>Bubble sort</strong>: bản cơ bản luôn tốn (n − 1) + (n − 2) + … + 1 = n(n − 1)/2 phép so sánh.</li>
</ul>
<p><strong>Vòng lặp lồng</strong> thành tổng lồng. <code>for i in range(n): for j in range(n)</code> chạy n<sup>2</sup> lần; <code>for i in range(n): for j in range(i)</code> chạy n(n − 1)/2 — vẫn Θ(n<sup>2</sup>). Vòng lặp mà biến đếm gấp đôi (<code>i = 1; while i &lt; n: i *= 2</code>) chạy khoảng log<sub>2</sub> n lần. Nhân ma trận bằng ba vòng lặp lồng là Θ(n<sup>3</sup>).</p>
<p>Sắp xếp dựa trên so sánh không thể nhanh hơn Ω(n log n) trong trường hợp xấu nhất (chứng minh bằng cây quyết định ở Chương 11); merge sort đạt O(n log n) (Chương 8).</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — đếm trong code.</b> Gắn bộ đếm vào tìm kiếm nhị phân và insertion sort để đếm số phép so sánh:</p></div>
<pre><code class="language-python">def binary_search(a, x):
    lo, hi, comps = 0, len(a) - 1, 0
    while lo &lt;= hi:
        mid = (lo + hi) // 2
        comps += 1
        if a[mid] == x:
            return mid, comps
        if a[mid] &lt; x:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1, comps

def insertion_sort(a):
    a, comps = a[:], 0
    for i in range(1, len(a)):
        key, j = a[i], i - 1
        while j &gt;= 0:
            comps += 1
            if a[j] &lt;= key:
                break
            a[j + 1] = a[j]
            j -= 1
        a[j + 1] = key
    return a, comps

a = list(range(1000))
print("worst binary search comparisons, n=1000:",
      max(binary_search(a, x)[1] for x in range(-1, 1001)))
for n in [10, 100, 1000]:
    print(n, "insertion sort on reversed input:", insertion_sort(list(range(n, 0, -1)))[1],
          " n(n-1)/2 =", n * (n - 1) // 2)</code></pre>
<div class="out">worst binary search comparisons, n=1000: 10
10 insertion sort on reversed input: 45  n(n-1)/2 = 45
100 insertion sort on reversed input: 4950  n(n-1)/2 = 4950
1000 insertion sort on reversed input: 499500  n(n-1)/2 = 499500</div>
<p>Với n = 1000, ⌊log<sub>2</sub> 1000⌋ + 1 = 9 + 1 = 10 phép so sánh, đúng như đo. Insertion sort trên đầu vào đảo ngược khớp đúng n(n − 1)/2; nhân n lên 10 thì công việc tăng khoảng 100 lần — dấu hiệu của Θ(n<sup>2</sup>).</p>
<div class="callout"><p><b>Ví dụ 2 — vòng lặp lồng.</b> <code>for i in range(1, n + 1): j = n; while j &gt; 1: j //= 2</code>. Vòng trong chạy ⌊log<sub>2</sub> n⌋ lần cho mỗi giá trị trong n giá trị của i, nên tổng là Θ(n log n).</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Đếm số lần cập nhật biến lặp thay vì phép toán chủ đạo — ổn cho Θ, sai khi cần số đếm chính xác.</li><li>Giả sử tìm kiếm nhị phân chạy được trên dữ liệu chưa sắp.</li><li>Cộng thay vì nhân chi phí của vòng lặp lồng (hoặc nhân chi phí của hai vòng lặp nối tiếp).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Đếm một phép toán cơ bản theo n; thường báo trường hợp xấu nhất.</li><li>Tìm tuyến tính Θ(n); tìm nhị phân ⌊log<sub>2</sub> n⌋ + 1 = Θ(log n).</li><li>Insertion/bubble sort xấu nhất n(n − 1)/2 = Θ(n<sup>2</sup>).</li><li>Vòng lặp lồng → tổng lồng; vòng chia đôi → log n.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Binary_search" target="_blank" rel="noopener">Wikipedia — Binary search (phân tích hiệu năng)</a></li><li><a href="https://en.wikipedia.org/wiki/Insertion_sort" target="_blank" rel="noopener">Wikipedia — Insertion sort</a></li><li><a href="https://en.wikipedia.org/wiki/Time_complexity" target="_blank" rel="noopener">Wikipedia — Time complexity</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tìm kiếm nhị phân cần bao nhiêu phép so sánh trong trường hợp xấu nhất với n = 10<sup>6</sup>?</li><li>Cho Θ của: <code>for i in range(n): for j in range(i, i + 5): work()</code>.</li><li>Cho Θ của: <code>i = n; while i &gt; 0: for j in range(i): work(); i //= 2</code>.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) ⌊log<sub>2</sub> 10<sup>6</sup>⌋ + 1 = 19 + 1 = 20. 2) 5n ⇒ Θ(n). 3) n + n/2 + n/4 + … ≤ 2n ⇒ Θ(n).</p></div>`);

const c53 = L('mad102-ts-5-3',
  '5.3 — Tractability, P vs NP and the halting problem|||5.3 — Bài toán dễ/khó, P và NP, bài toán dừng',
  'Bảng thời gian thực tế theo độ phức tạp, bài toán dễ (đa thức) và khó, lớp P, NP, NP-đầy đủ (SAT, TSP, tô màu), câu hỏi P = NP; bài toán dừng không giải được — chứng minh bằng đường chéo.',
  `<span class="eyebrow">MAD102 · Chapter 5 · Lesson 5.3</span>
<h2>Tractability, P vs NP and the halting problem</h2>
<p class="lead">Some problems are solvable quickly, some are solvable only slowly as far as anyone knows, and some cannot be solved by any program at all. Knowing which class a problem is in saves you from trying to write an algorithm that cannot exist.</p>
<h3>🎯 Objectives</h3>
<ul><li>Estimate real running times from complexity classes.</li><li>Explain P, NP, NP-complete and the open question P = NP with examples.</li><li>Reproduce the proof that the halting problem is undecidable.</li></ul>
<h3>📖 Lecture</h3>
<p>Assume a computer performs 10<sup>9</sup> basic operations per second. The table shows what complexity means in practice for n = 10<sup>6</sup>:</p>
<pre><code class="language-python">import math
ops_per_sec = 10**9
n = 10**6
for name, ops in [("log n", math.log2(n)), ("n", n), ("n log n", n * math.log2(n)),
                  ("n^2", n**2), ("n^3", n**3)]:
    print(f"{name:8} {ops / ops_per_sec:.3g} s")
print("2^n for n = 60:", f"{2**60 / ops_per_sec / 3600 / 24 / 365:.1f}", "years")</code></pre>
<div class="out">log n    1.99e-08 s
n        0.001 s
n log n  0.0199 s
n^2      1e+03 s
n^3      1e+09 s
2^n for n = 60: 36.6 years</div>
<p>n<sup>2</sup> takes about 17 minutes, n<sup>3</sup> about 31 years; an exponential algorithm is hopeless already at n = 60. Problems solvable in polynomial time O(n<sup>k</sup>) are called <strong>tractable</strong>; the others <strong>intractable</strong>.</p>
<ul>
<li><strong>P</strong>: decision problems solvable in polynomial time (sorting-based questions, shortest path, “is this graph connected?”, “is n prime?”).</li>
<li><strong>NP</strong>: problems whose “yes” answers can be <em>checked</em> in polynomial time given a certificate. SAT: given an assignment, checking it takes linear time. Hamilton circuit: given the circuit, check it. P ⊆ NP.</li>
<li><strong>NP-complete</strong>: problems in NP to which every NP problem reduces in polynomial time. SAT (Cook–Levin, 1971), 3-colouring, Hamilton circuit, the decision version of the travelling salesman problem, subset sum. A polynomial algorithm for any one of them would give one for all of NP.</li>
</ul>
<p>Whether <strong>P = NP</strong> is the most famous open problem of computer science (a Clay Millennium Prize problem). Most researchers believe P ≠ NP. In practice, faced with an NP-complete problem you use exponential algorithms on small inputs, approximation algorithms, heuristics, or SAT solvers.</p>
<p><strong>Undecidable problems.</strong> Chapter 3 showed that most problems have no program. A concrete one is the <strong>halting problem</strong>: given the source of a program P and an input I, decide whether P halts on I.</p>
<div class="callout"><p><b>Theorem (Turing, 1936).</b> No program H(P, I) correctly answers “halts / loops” for all P, I.<br><b>Proof.</b> Suppose H exists. Build K(P): if H(P, P) says “halts”, K loops forever; otherwise K halts. Now run K on its own source. If K(K) halts, then H(K, K) said “halts”, so K loops — contradiction. If K(K) loops, then H(K, K) said “loops”, so K halts — contradiction. So H cannot exist. ∎<br>This is Cantor's diagonal argument again: K differs from every program on the “diagonal” input.</p></div>
<p>Consequences: no tool can perfectly detect infinite loops, dead code, or whether two programs are equivalent (Rice's theorem generalises this to every non-trivial property of program behaviour). Static analysers therefore always either miss bugs or raise false alarms.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1.</b> An O(n<sup>2</sup>) algorithm takes 4 s for n = 10<sup>4</sup>. Estimate for n = 10<sup>5</sup>: the input grows 10×, the time about 100× ⇒ about 400 s.</p></div>
<div class="callout"><p><b>Example 2.</b> “Does this graph with 50 vertices have a Hamilton circuit?” Trying all orders costs up to 49!/2 ≈ 3·10<sup>62</sup> checks — infeasible; but verifying a proposed circuit takes 50 steps. That gap is NP.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>“NP” does not mean “not polynomial”; it means “nondeterministic polynomial” (verifiable quickly). P ⊆ NP.</li><li>Believing NP-complete problems can never be solved: small or structured instances are solved every day.</li><li>Thinking a faster computer makes an exponential algorithm practical: doubling speed adds only one to the feasible n for 2<sup>n</sup>.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Polynomial = tractable; exponential = intractable even on fast hardware.</li><li>P ⊆ NP; NP-complete problems are the hardest in NP; P = NP is open.</li><li>The halting problem is undecidable (diagonal argument).</li><li>Perfect static analysis of program behaviour is impossible.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://brilliant.org/wiki/p-versus-np/" target="_blank" rel="noopener">Brilliant — P versus NP</a></li><li><a href="https://brilliant.org/wiki/halting-problem/" target="_blank" rel="noopener">Brilliant — Halting Problem</a></li><li><a href="https://en.wikipedia.org/wiki/NP-completeness" target="_blank" rel="noopener">Wikipedia — NP-completeness</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>An algorithm runs in 2<sup>n</sup> steps at 10<sup>9</sup> steps per second. Roughly what is the largest n solvable in one hour?</li><li>Why is “given a set of integers, is there a subset summing to 0?” in NP?</li><li>Can an antivirus decide perfectly whether any program will ever execute a malicious action? Why?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 3.6·10<sup>12</sup> steps ⇒ n ≈ log<sub>2</sub>(3.6·10<sup>12</sup>) ≈ 41. 2) A certificate is the subset itself; adding it up takes linear time. 3) No — that is a non-trivial property of program behaviour, undecidable by Rice's theorem (a halting-problem reduction).</p></div>`,
  `<span class="eyebrow">MAD102 · Chương 5 · Bài 5.3</span>
<h2>Bài toán dễ/khó, P và NP, bài toán dừng</h2>
<p class="lead">Có bài toán giải nhanh được, có bài toán theo hiểu biết hiện nay chỉ giải chậm được, và có bài toán không chương trình nào giải nổi. Biết bài toán thuộc lớp nào giúp bạn khỏi cố viết một thuật toán không thể tồn tại.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Ước lượng thời gian chạy thực tế từ lớp độ phức tạp.</li><li>Giải thích P, NP, NP-đầy đủ và câu hỏi mở P = NP bằng ví dụ.</li><li>Trình bày lại chứng minh bài toán dừng không quyết định được.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Giả sử máy tính làm 10<sup>9</sup> phép toán cơ bản mỗi giây. Bảng sau cho thấy độ phức tạp có nghĩa gì trong thực tế với n = 10<sup>6</sup>:</p>
<pre><code class="language-python">import math
ops_per_sec = 10**9
n = 10**6
for name, ops in [("log n", math.log2(n)), ("n", n), ("n log n", n * math.log2(n)),
                  ("n^2", n**2), ("n^3", n**3)]:
    print(f"{name:8} {ops / ops_per_sec:.3g} s")
print("2^n for n = 60:", f"{2**60 / ops_per_sec / 3600 / 24 / 365:.1f}", "years")</code></pre>
<div class="out">log n    1.99e-08 s
n        0.001 s
n log n  0.0199 s
n^2      1e+03 s
n^3      1e+09 s
2^n for n = 60: 36.6 years</div>
<p>n<sup>2</sup> mất khoảng 17 phút, n<sup>3</sup> khoảng 31 năm; thuật toán mũ đã vô vọng từ n = 60. Bài toán giải được trong thời gian đa thức O(n<sup>k</sup>) gọi là <strong>dễ (tractable)</strong>; còn lại là <strong>khó (intractable)</strong>.</p>
<ul>
<li><strong>P</strong>: bài toán quyết định giải được trong thời gian đa thức (câu hỏi dựa trên sắp xếp, đường đi ngắn nhất, “đồ thị có liên thông không?”, “n có nguyên tố không?”).</li>
<li><strong>NP</strong>: bài toán mà câu trả lời “có” <em>kiểm tra</em> được trong thời gian đa thức khi có chứng chỉ. SAT: có phép gán thì kiểm trong thời gian tuyến tính. Chu trình Hamilton: có chu trình thì kiểm được. P ⊆ NP.</li>
<li><strong>NP-đầy đủ</strong>: bài toán trong NP mà mọi bài toán NP đều quy về được trong thời gian đa thức. SAT (Cook–Levin, 1971), tô 3 màu, chu trình Hamilton, phiên bản quyết định của bài toán người du lịch, tổng tập con. Có thuật toán đa thức cho một bài là có cho cả NP.</li>
</ul>
<p><strong>P = NP</strong> hay không là bài toán mở nổi tiếng nhất của khoa học máy tính (một bài toán Thiên niên kỷ của viện Clay). Đa số nhà nghiên cứu tin rằng P ≠ NP. Trong thực tế, gặp bài NP-đầy đủ thì ta dùng thuật toán mũ cho đầu vào nhỏ, thuật toán xấp xỉ, heuristic hoặc bộ giải SAT.</p>
<p><strong>Bài toán không quyết định được.</strong> Chương 3 cho thấy phần lớn bài toán không có chương trình. Một ví dụ cụ thể là <strong>bài toán dừng</strong>: cho mã nguồn chương trình P và đầu vào I, quyết định P có dừng trên I không.</p>
<div class="callout"><p><b>Định lý (Turing, 1936).</b> Không có chương trình H(P, I) trả lời đúng “dừng / lặp mãi” với mọi P, I.<br><b>Chứng minh.</b> Giả sử có H. Dựng K(P): nếu H(P, P) nói “dừng” thì K lặp mãi; ngược lại K dừng. Chạy K trên chính mã nguồn của nó. Nếu K(K) dừng thì H(K, K) đã nói “dừng”, nên K lặp mãi — mâu thuẫn. Nếu K(K) lặp mãi thì H(K, K) đã nói “lặp”, nên K dừng — mâu thuẫn. Vậy H không thể tồn tại. ∎<br>Đây lại là lập luận đường chéo của Cantor: K khác mọi chương trình ở đầu vào “đường chéo”.</p></div>
<p>Hệ quả: không công cụ nào phát hiện hoàn hảo vòng lặp vô hạn, code chết, hay hai chương trình có tương đương không (định lý Rice tổng quát hoá cho mọi tính chất không tầm thường của hành vi chương trình). Vì thế bộ phân tích tĩnh luôn hoặc bỏ sót lỗi, hoặc báo động nhầm.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1.</b> Thuật toán O(n<sup>2</sup>) mất 4 s với n = 10<sup>4</sup>. Ước lượng cho n = 10<sup>5</sup>: đầu vào tăng 10 lần, thời gian tăng khoảng 100 lần ⇒ khoảng 400 s.</p></div>
<div class="callout"><p><b>Ví dụ 2.</b> “Đồ thị 50 đỉnh này có chu trình Hamilton không?” Thử mọi thứ tự tốn tới 49!/2 ≈ 3·10<sup>62</sup> lần kiểm — bất khả thi; nhưng kiểm một chu trình được đề xuất chỉ mất 50 bước. Khoảng cách đó chính là NP.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>“NP” không có nghĩa “không đa thức”; nó là “đa thức không đơn định” (kiểm nhanh được). P ⊆ NP.</li><li>Tin rằng bài NP-đầy đủ không bao giờ giải được: các trường hợp nhỏ hoặc có cấu trúc được giải hằng ngày.</li><li>Nghĩ máy nhanh hơn sẽ làm thuật toán mũ khả thi: tăng tốc gấp đôi chỉ thêm được 1 vào n khả thi với 2<sup>n</sup>.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Đa thức = dễ; mũ = khó kể cả trên phần cứng nhanh.</li><li>P ⊆ NP; NP-đầy đủ là khó nhất trong NP; P = NP còn mở.</li><li>Bài toán dừng không quyết định được (lập luận đường chéo).</li><li>Phân tích tĩnh hoàn hảo về hành vi chương trình là bất khả.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://brilliant.org/wiki/p-versus-np/" target="_blank" rel="noopener">Brilliant — P versus NP</a></li><li><a href="https://brilliant.org/wiki/halting-problem/" target="_blank" rel="noopener">Brilliant — Halting Problem</a></li><li><a href="https://en.wikipedia.org/wiki/NP-completeness" target="_blank" rel="noopener">Wikipedia — NP-completeness</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Thuật toán chạy 2<sup>n</sup> bước với tốc độ 10<sup>9</sup> bước/giây. n lớn nhất giải được trong một giờ khoảng bao nhiêu?</li><li>Vì sao bài “cho tập số nguyên, có tập con nào tổng bằng 0 không?” thuộc NP?</li><li>Phần mềm diệt virus có quyết định hoàn hảo được mọi chương trình có bao giờ làm hành động độc hại không? Vì sao?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 3,6·10<sup>12</sup> bước ⇒ n ≈ log<sub>2</sub>(3,6·10<sup>12</sup>) ≈ 41. 2) Chứng chỉ chính là tập con đó; cộng lại tốn thời gian tuyến tính. 3) Không — đó là tính chất không tầm thường của hành vi chương trình, không quyết định được theo định lý Rice (quy về bài toán dừng).</p></div>`);

const q5 = QZ(5, 'Quiz — Chapter 5: Algorithms and complexity|||Quiz — Chương 5: Thuật toán và độ phức tạp', 'Kiểm tra chương 5: Big-O/Ω/Θ, nhân chứng, thang tăng, đếm phép so sánh, vòng lặp lồng, P/NP, bài toán dừng.', [
  Q('q1', 'Which witnesses show 3n² + 5n + 2 is O(n²)?|||Cặp nhân chứng nào chứng tỏ 3n² + 5n + 2 là O(n²)?',
    ['C = 3, k = 1|||C = 3, k = 1', 'C = 4, k = 5|||C = 4, k = 5', 'C = 4, k = 1|||C = 4, k = 1', 'C = 1, k = 100|||C = 1, k = 100'], 1,
    '3n² + 5n + 2 ≤ 4n² holds for n ≥ 6, i.e. n greater than 5.|||3n² + 5n + 2 ≤ 4n² đúng với n ≥ 6, tức n lớn hơn 5.'),
  Q('q2', 'Which grows fastest?|||Hàm nào tăng nhanh nhất?',
    ['n¹⁰|||n¹⁰', '2ⁿ|||2ⁿ', 'n!|||n!', 'n log n|||n log n'], 2,
    'n! grows faster than any exponential cⁿ.|||n! tăng nhanh hơn mọi hàm mũ cⁿ.'),
  Q('q3', 'log₂ n and log₁₀ n are|||log₂ n và log₁₀ n là',
    ['different Θ classes|||hai lớp Θ khác nhau', 'Θ of each other|||Θ của nhau', 'unrelated|||không liên quan', 'both Θ(n)|||đều Θ(n)'], 1,
    'They differ by the constant factor log₂ 10.|||Chúng chênh nhau hằng số log₂ 10.'),
  Q('q4', 'Worst-case comparisons of binary search on 1000 sorted items:|||Số phép so sánh xấu nhất của tìm kiếm nhị phân trên 1000 phần tử đã sắp:',
    ['10|||10', '500|||500', '1000|||1000', '32|||32'], 0,
    '⌊log₂ 1000⌋ + 1 = 10.|||⌊log₂ 1000⌋ + 1 = 10.'),
  Q('q5', 'Insertion sort on a reversed array of 100 elements makes how many comparisons?|||Insertion sort trên mảng đảo ngược 100 phần tử làm bao nhiêu phép so sánh?',
    ['99|||99', '4950|||4950', '10000|||10000', '664|||664'], 1,
    'n(n − 1)/2 = 100·99/2 = 4950.|||n(n − 1)/2 = 100·99/2 = 4950.'),
  Q('q6', 'for i in range(n): for j in range(i): work() — total calls are|||for i in range(n): for j in range(i): work() — tổng số lần gọi là',
    ['Θ(n)|||Θ(n)', 'Θ(n log n)|||Θ(n log n)', 'Θ(n²)|||Θ(n²)', 'Θ(2ⁿ)|||Θ(2ⁿ)'], 2,
    '0 + 1 + … + (n − 1) = n(n − 1)/2.|||0 + 1 + … + (n − 1) = n(n − 1)/2.'),
  Q('q7', 'A problem is in NP if|||Một bài toán thuộc NP nếu',
    ['it cannot be solved in polynomial time|||nó không giải được trong thời gian đa thức', 'a yes-answer can be verified in polynomial time from a certificate|||câu trả lời “có” kiểm được trong thời gian đa thức nhờ chứng chỉ', 'it is undecidable|||nó không quyết định được', 'it is about graphs|||nó về đồ thị'], 1,
    'NP = efficiently verifiable; P ⊆ NP.|||NP = kiểm tra được hiệu quả; P ⊆ NP.'),
  Q('q8', 'The first problem proved NP-complete is|||Bài toán đầu tiên được chứng minh NP-đầy đủ là',
    ['sorting|||sắp xếp', 'SAT|||SAT', 'shortest path|||đường đi ngắn nhất', 'the halting problem|||bài toán dừng'], 1,
    'Cook–Levin theorem (1971).|||Định lý Cook–Levin (1971).'),
  Q('q9', 'The halting problem is proved undecidable by|||Bài toán dừng được chứng minh không quyết định được bằng',
    ['induction|||quy nạp', 'a diagonal (self-reference) contradiction|||mâu thuẫn kiểu đường chéo (tự tham chiếu)', 'counting|||phép đếm', 'a computer search|||tìm kiếm bằng máy'], 1,
    'Run the program K on its own source.|||Chạy chương trình K trên chính mã nguồn của nó.'),
]);

const ch5 = {
  title: 'Chapter 5 — Algorithms and computational complexity|||Chương 5 — Thuật toán và độ phức tạp tính toán',
  description: 'Big-O/Ω/Θ với nhân chứng, thang tăng; phân tích tìm kiếm, sắp xếp, vòng lặp lồng có đo bằng Python; bài toán dễ/khó, P và NP, NP-đầy đủ, bài toán dừng (Rosen ch. 3 · MCS ch. 8, 14).',
  lessons: [c51, c52, c53, q5],
};

// ───────────────────────────── Chương 6 — Lý thuyết số & mật mã ─────────────────────────────
const c61 = L('mad102-ts-6-1',
  '6.1 — Divisibility, modular arithmetic and fast exponentiation|||6.1 — Chia hết, số học đồng dư và lũy thừa nhanh theo modulo',
  'Thuật toán chia (thương, dư), div/mod trong Python và C/Java khác nhau với số âm, đồng dư, cộng/nhân trong ℤₘ, biểu diễn cơ số b, lũy thừa nhanh modulo (bình phương và nhân) chạy thật.',
  `<span class="eyebrow">MAD102 · Chapter 6 · Lesson 6.1</span>
<h2>Divisibility, modular arithmetic and fast exponentiation</h2>
<p class="lead">Computers do arithmetic modulo 2<sup>32</sup> or 2<sup>64</sup> whether you like it or not, hash tables reduce keys modulo the table size, and every public-key cryptosystem computes enormous powers modulo a large number. This lesson builds that arithmetic.</p>
<h3>🎯 Objectives</h3>
<ul><li>Apply the division algorithm and know how languages define div and mod for negative numbers.</li><li>Compute with congruences and in ℤ<sub>m</sub>.</li><li>Convert between bases and compute b<sup>e</sup> mod m with square-and-multiply.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Division algorithm</span>For integers a and d &gt; 0 there are unique q, r with a = dq + r and 0 ≤ r &lt; d.   q = a div d, r = a mod d.</div>
<p>Example: −11 = 3·(−4) + 1, so −11 div 3 = −4 and −11 mod 3 = 1. Python's <code>//</code> and <code>%</code> follow this definition (the remainder has the sign of the divisor), but C, C++ and Java truncate toward zero and give −11 % 3 = −2. Bugs in hash functions and circular buffers often come from this difference.</p>
<p><strong>Congruence.</strong> a ≡ b (mod m) iff m | a − b iff a mod m = b mod m. Congruences can be added and multiplied: if a ≡ b and c ≡ d (mod m), then a + c ≡ b + d and ac ≡ bd (mod m). Hence (a + b) mod m = ((a mod m) + (b mod m)) mod m and similarly for ·, so we can reduce at every step and never handle big numbers. <strong>Division is not automatic</strong>: 2·3 ≡ 2·1 (mod 4) but 3 ≢ 1 (mod 4) — we return to inverses in Lesson 6.3. ℤ<sub>m</sub> = {0, 1, …, m − 1} with +<sub>m</sub> and ·<sub>m</sub> is the arithmetic of a clock with m hours.</p>
<p><strong>Base-b expansion.</strong> Every positive integer has a unique representation n = a<sub>k</sub>b<sup>k</sup> + … + a<sub>1</sub>b + a<sub>0</sub> with digits 0 ≤ a<sub>i</sub> &lt; b. Repeated division by b produces the digits from right to left: 241 = 11110001<sub>2</sub> = F1<sub>16</sub>.</p>
<p><strong>Fast modular exponentiation.</strong> Write e in binary; scan its bits from the lowest, squaring the base each time and multiplying it into the result when the bit is 1. This needs O(log e) multiplications of numbers smaller than m, instead of e − 1 multiplications of huge numbers. It is the loop of Lesson 2.4 with “mod m” added.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — by hand with a pattern.</b> 3<sup>200</sup> mod 13: 3<sup>3</sup> = 27 ≡ 1 (mod 13), and 200 = 3·66 + 2, so 3<sup>200</sup> = (3<sup>3</sup>)<sup>66</sup>·3<sup>2</sup> ≡ 1·9 = 9.</p></div>
<div class="callout"><p><b>Example 2 — square-and-multiply.</b> 7<sup>644</sup> mod 645 (Rosen's example): 644 = 1010000100<sub>2</sub>; ten squarings and three multiplications give 436.</p></div>
<pre><code class="language-python">print(-11 // 3, -11 % 3)          # Python: quotient -4, remainder 1  (remainder &gt;= 0)
print(divmod(101, 11))
print(pow(3, 200, 13))            # fast modular exponentiation
print((17 * 23) % 7, ((17 % 7) * (23 % 7)) % 7)

def mod_pow(b, e, m):
    """Square-and-multiply: O(log e) multiplications."""
    result, b = 1, b % m
    while e &gt; 0:
        if e &amp; 1:
            result = result * b % m
        b = b * b % m
        e &gt;&gt;= 1
    return result

print(mod_pow(3, 200, 13), mod_pow(7, 644, 645))
print(bin(200), format(241, "b"), format(241, "x"))</code></pre>
<div class="out">-4 1
(9, 2)
9
6 6
9 436
0b11001000 11110001 f1</div>
<p>Line 4 shows the reduce-first rule: 17·23 = 391 ≡ 6 (mod 7), and (17 mod 7)(23 mod 7) = 3·2 = 6. Python's built-in <code>pow(b, e, m)</code> uses the same algorithm.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Computing b<sup>e</sup> fully and then reducing — impossible for 2048-bit RSA numbers.</li><li>Porting <code>x % m</code> from Python to Java/C with negative x and getting a negative index.</li><li>Cancelling a common factor in a congruence when it is not coprime to m.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>a = dq + r with 0 ≤ r &lt; d; languages differ for negative a.</li><li>Congruences respect + and ·; reduce at every step.</li><li>Base-b digits by repeated division.</li><li>b<sup>e</sup> mod m in O(log e) multiplications (square-and-multiply).</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://brilliant.org/wiki/modular-arithmetic/" target="_blank" rel="noopener">Brilliant — Modular Arithmetic</a></li><li><a href="https://cp-algorithms.com/algebra/binary-exp.html" target="_blank" rel="noopener">cp-algorithms — Binary Exponentiation</a></li><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_addtops-numbth.html" target="_blank" rel="noopener">Levin, DMOI 6.2 — Introduction to Number Theory</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Find −17 div 5 and −17 mod 5 by the division algorithm.</li><li>Compute 2<sup>100</sup> mod 7 by hand.</li><li>Convert 1000 to binary and to hexadecimal.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) −17 = 5·(−4) + 3: div −4, mod 3. 2) 2<sup>3</sup> ≡ 1 and 100 = 3·33 + 1, so 2<sup>100</sup> ≡ 2. 3) 1111101000<sub>2</sub> = 3E8<sub>16</sub>.</p></div>`,
  `<span class="eyebrow">MAD102 · Chương 6 · Bài 6.1</span>
<h2>Chia hết, số học đồng dư và lũy thừa nhanh theo modulo</h2>
<p class="lead">Máy tính làm số học modulo 2<sup>32</sup> hay 2<sup>64</sup> dù bạn muốn hay không, bảng băm rút gọn khoá theo modulo kích thước bảng, và mọi hệ mật mã khoá công khai đều tính những lũy thừa khổng lồ modulo một số lớn. Bài này xây dựng phép số học đó.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Áp dụng thuật toán chia và biết các ngôn ngữ định nghĩa div, mod với số âm ra sao.</li><li>Tính toán với đồng dư và trong ℤ<sub>m</sub>.</li><li>Đổi cơ số và tính b<sup>e</sup> mod m bằng bình phương và nhân.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Thuật toán chia</span>Với số nguyên a và d &gt; 0, có duy nhất q, r với a = dq + r và 0 ≤ r &lt; d.   q = a div d, r = a mod d.</div>
<p>Ví dụ: −11 = 3·(−4) + 1, nên −11 div 3 = −4 và −11 mod 3 = 1. Toán tử <code>//</code> và <code>%</code> của Python theo đúng định nghĩa này (số dư cùng dấu với số chia), nhưng C, C++ và Java làm tròn về 0 và cho −11 % 3 = −2. Lỗi trong hàm băm và bộ đệm vòng hay xuất phát từ khác biệt này.</p>
<p><strong>Đồng dư.</strong> a ≡ b (mod m) khi và chỉ khi m | a − b khi và chỉ khi a mod m = b mod m. Đồng dư cộng và nhân được: nếu a ≡ b và c ≡ d (mod m) thì a + c ≡ b + d và ac ≡ bd (mod m). Do đó (a + b) mod m = ((a mod m) + (b mod m)) mod m, tương tự với ·, nên ta rút gọn ở mỗi bước và không bao giờ phải cầm số lớn. <strong>Phép chia không tự động đúng</strong>: 2·3 ≡ 2·1 (mod 4) nhưng 3 ≢ 1 (mod 4) — ta quay lại nghịch đảo ở Bài 6.3. ℤ<sub>m</sub> = {0, 1, …, m − 1} với +<sub>m</sub> và ·<sub>m</sub> là số học của chiếc đồng hồ m giờ.</p>
<p><strong>Biểu diễn cơ số b.</strong> Mọi số nguyên dương có biểu diễn duy nhất n = a<sub>k</sub>b<sup>k</sup> + … + a<sub>1</sub>b + a<sub>0</sub> với chữ số 0 ≤ a<sub>i</sub> &lt; b. Chia liên tiếp cho b cho các chữ số từ phải sang trái: 241 = 11110001<sub>2</sub> = F1<sub>16</sub>.</p>
<p><strong>Lũy thừa nhanh theo modulo.</strong> Viết e dạng nhị phân; quét bit từ thấp lên, mỗi lần bình phương cơ số và nhân nó vào kết quả khi bit bằng 1. Chỉ cần O(log e) phép nhân các số nhỏ hơn m, thay vì e − 1 phép nhân số khổng lồ. Đó chính là vòng lặp ở Bài 2.4 thêm “mod m”.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — bằng tay nhờ chu kỳ.</b> 3<sup>200</sup> mod 13: 3<sup>3</sup> = 27 ≡ 1 (mod 13), và 200 = 3·66 + 2, nên 3<sup>200</sup> = (3<sup>3</sup>)<sup>66</sup>·3<sup>2</sup> ≡ 1·9 = 9.</p></div>
<div class="callout"><p><b>Ví dụ 2 — bình phương và nhân.</b> 7<sup>644</sup> mod 645 (ví dụ của Rosen): 644 = 1010000100<sub>2</sub>; mười lần bình phương và ba lần nhân cho 436.</p></div>
<pre><code class="language-python">print(-11 // 3, -11 % 3)          # Python: quotient -4, remainder 1  (remainder &gt;= 0)
print(divmod(101, 11))
print(pow(3, 200, 13))            # fast modular exponentiation
print((17 * 23) % 7, ((17 % 7) * (23 % 7)) % 7)

def mod_pow(b, e, m):
    """Square-and-multiply: O(log e) multiplications."""
    result, b = 1, b % m
    while e &gt; 0:
        if e &amp; 1:
            result = result * b % m
        b = b * b % m
        e &gt;&gt;= 1
    return result

print(mod_pow(3, 200, 13), mod_pow(7, 644, 645))
print(bin(200), format(241, "b"), format(241, "x"))</code></pre>
<div class="out">-4 1
(9, 2)
9
6 6
9 436
0b11001000 11110001 f1</div>
<p>Dòng 4 minh hoạ quy tắc rút gọn trước: 17·23 = 391 ≡ 6 (mod 7), và (17 mod 7)(23 mod 7) = 3·2 = 6. Hàm có sẵn <code>pow(b, e, m)</code> của Python dùng cùng thuật toán.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Tính trọn b<sup>e</sup> rồi mới rút gọn — bất khả với số RSA 2048 bit.</li><li>Chuyển <code>x % m</code> từ Python sang Java/C với x âm và nhận chỉ số âm.</li><li>Giản ước thừa số chung trong đồng dư khi thừa số đó không nguyên tố cùng nhau với m.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>a = dq + r với 0 ≤ r &lt; d; các ngôn ngữ khác nhau khi a âm.</li><li>Đồng dư giữ được + và ·; rút gọn ở mỗi bước.</li><li>Chữ số cơ số b bằng chia liên tiếp.</li><li>b<sup>e</sup> mod m trong O(log e) phép nhân (bình phương và nhân).</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://brilliant.org/wiki/modular-arithmetic/" target="_blank" rel="noopener">Brilliant — Modular Arithmetic</a></li><li><a href="https://cp-algorithms.com/algebra/binary-exp.html" target="_blank" rel="noopener">cp-algorithms — Binary Exponentiation</a></li><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_addtops-numbth.html" target="_blank" rel="noopener">Levin, DMOI 6.2 — Introduction to Number Theory</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tìm −17 div 5 và −17 mod 5 theo thuật toán chia.</li><li>Tính 2<sup>100</sup> mod 7 bằng tay.</li><li>Đổi 1000 sang nhị phân và thập lục phân.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) −17 = 5·(−4) + 3: div −4, mod 3. 2) 2<sup>3</sup> ≡ 1 và 100 = 3·33 + 1, nên 2<sup>100</sup> ≡ 2. 3) 1111101000<sub>2</sub> = 3E8<sub>16</sub>.</p></div>`);

const c62 = L('mad102-ts-6-2',
  '6.2 — Primes, GCD and the (extended) Euclidean algorithm|||6.2 — Số nguyên tố, ƯCLN và thuật toán Euclid (mở rộng)',
  'Số nguyên tố, định lý cơ bản của số học, sàng Eratosthenes, ƯCLN/BCNN, thuật toán Euclid và độ phức tạp, đẳng thức Bézout và thuật toán Euclid mở rộng — chạy thật bằng Python.',
  `<span class="eyebrow">MAD102 · Chapter 6 · Lesson 6.2</span>
<h2>Primes, GCD and the (extended) Euclidean algorithm</h2>
<p class="lead">The Euclidean algorithm is more than 2300 years old and still runs billions of times a day: every TLS handshake computes modular inverses with its extended form. It is also the first algorithm whose running time we can prove is logarithmic.</p>
<h3>🎯 Objectives</h3>
<ul><li>Use the Fundamental Theorem of Arithmetic and the sieve of Eratosthenes.</li><li>Compute gcd and lcm with the Euclidean algorithm and explain why it is fast.</li><li>Find Bézout coefficients with the extended Euclidean algorithm.</li></ul>
<h3>📖 Lecture</h3>
<p>An integer p &gt; 1 is <strong>prime</strong> if its only positive divisors are 1 and p; otherwise it is composite. The <strong>Fundamental Theorem of Arithmetic</strong>: every integer n &gt; 1 is a product of primes in exactly one way up to order (existence was Example 4 of Lesson 2.3; uniqueness uses Euclid's lemma below). If n is composite it has a prime divisor ≤ √n, so trial division up to √n tests primality. The <strong>sieve of Eratosthenes</strong> lists all primes ≤ n by crossing out multiples of each prime p starting at p<sup>2</sup>. There are infinitely many primes (Lesson 2.2), and by the Prime Number Theorem about n/ln n of them are ≤ n.</p>
<p>gcd(a, b) is the largest integer dividing both; lcm(a, b) the smallest positive common multiple; ab = gcd(a, b)·lcm(a, b). a and b are <strong>coprime</strong> if gcd(a, b) = 1. From factorisations, gcd takes the minimum exponent of each prime and lcm the maximum — but factoring is slow, so we use:</p>
<div class="formula"><span class="lbl">Euclidean algorithm</span>gcd(a, b) = gcd(b, a mod b),   gcd(a, 0) = a</div>
<p>Why it is correct: any common divisor of a and b divides r = a − qb, and conversely. Why it is fast: every two steps the remainder at least halves, so the number of divisions is O(log b) (Lamé's theorem: at most 5 times the number of decimal digits of b).</p>
<div class="formula"><span class="lbl">Bézout's identity</span>gcd(a, b) = s·a + t·b for some integers s, t</div>
<p>The <strong>extended Euclidean algorithm</strong> finds s and t by running Euclid backwards (or carrying coefficients forward). <strong>Euclid's lemma</strong> follows: if p is prime and p | ab, then p | a or p | b (if p ∤ a then 1 = sp + ta, so b = spb + tab is divisible by p).</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1.</b> gcd(252, 198): 252 = 1·198 + 54; 198 = 3·54 + 36; 54 = 1·36 + 18; 36 = 2·18 + 0 ⇒ gcd = 18. lcm = 252·198/18 = 2772.</p></div>
<div class="callout"><p><b>Example 2 — back-substitution.</b> 18 = 54 − 1·36 = 54 − (198 − 3·54) = 4·54 − 198 = 4·(252 − 198) − 198 = 4·252 − 5·198. So s = 4, t = −5.</p></div>
<pre><code class="language-python">def gcd_steps(a, b):
    while b:
        print(f"{a} = {a // b} * {b} + {a % b}")
        a, b = b, a % b
    return a

def ext_gcd(a, b):
    """Return (g, s, t) with g = gcd(a, b) = s*a + t*b."""
    if b == 0:
        return a, 1, 0
    g, s, t = ext_gcd(b, a % b)
    return g, t, s - (a // b) * t

print("gcd =", gcd_steps(252, 198))
g, s, t = ext_gcd(252, 198)
print(g, s, t, s * 252 + t * 198)

def sieve(n):
    is_p = [True] * (n + 1)
    is_p[0] = is_p[1] = False
    for i in range(2, int(n ** 0.5) + 1):
        if is_p[i]:
            for j in range(i * i, n + 1, i):
                is_p[j] = False
    return [i for i in range(n + 1) if is_p[i]]

print(sieve(50))
print(len(sieve(10**6)))</code></pre>
<div class="out">252 = 1 * 198 + 54
198 = 3 * 54 + 36
54 = 1 * 36 + 18
36 = 2 * 18 + 0
gcd = 18
18 4 -5 18
[2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]
78498</div>
<p>The recursive <code>ext_gcd</code> returns the same s = 4, t = −5. The sieve finds 78 498 primes below one million in a fraction of a second; n/ln n ≈ 72 382 is the Prime Number Theorem estimate.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Believing 1 is prime (it is not — otherwise factorisation would not be unique).</li><li>Testing divisors up to n/2 instead of √n.</li><li>Losing track of signs in back-substitution; always check s·a + t·b at the end.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Unique prime factorisation; trial division to √n; sieve for many primes.</li><li>gcd(a, b) = gcd(b, a mod b): O(log b) steps.</li><li>Bézout: gcd = sa + tb, found by extended Euclid.</li><li>Euclid's lemma: p | ab ⇒ p | a or p | b.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://cp-algorithms.com/algebra/euclid-algorithm.html" target="_blank" rel="noopener">cp-algorithms — Euclidean algorithm</a></li><li><a href="https://cp-algorithms.com/algebra/extended-euclid-algorithm.html" target="_blank" rel="noopener">cp-algorithms — Extended Euclidean Algorithm</a></li><li><a href="https://cp-algorithms.com/algebra/sieve-of-eratosthenes.html" target="_blank" rel="noopener">cp-algorithms — Sieve of Eratosthenes</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Find gcd(1071, 462) with the Euclidean algorithm.</li><li>Express gcd(26, 7) as a combination 26s + 7t.</li><li>Find the prime factorisation of 7007 and use it to find gcd(7007, 1001).</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 1071 = 2·462 + 147; 462 = 3·147 + 21; 147 = 7·21 ⇒ 21. 2) 26 = 3·7 + 5, 7 = 1·5 + 2, 5 = 2·2 + 1 ⇒ 1 = 5 − 2·2 = 5 − 2(7 − 5) = 3·5 − 2·7 = 3(26 − 3·7) − 2·7 = 3·26 − 11·7. 3) 7007 = 7<sup>2</sup>·11·13, 1001 = 7·11·13 ⇒ gcd = 1001.</p></div>`,
  `<span class="eyebrow">MAD102 · Chương 6 · Bài 6.2</span>
<h2>Số nguyên tố, ƯCLN và thuật toán Euclid (mở rộng)</h2>
<p class="lead">Thuật toán Euclid đã hơn 2300 tuổi mà vẫn chạy hàng tỷ lần mỗi ngày: mọi lần bắt tay TLS đều tính nghịch đảo modulo bằng dạng mở rộng của nó. Đây cũng là thuật toán đầu tiên mà ta chứng minh được thời gian chạy là logarit.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Dùng định lý cơ bản của số học và sàng Eratosthenes.</li><li>Tính ƯCLN, BCNN bằng thuật toán Euclid và giải thích vì sao nó nhanh.</li><li>Tìm hệ số Bézout bằng thuật toán Euclid mở rộng.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Số nguyên p &gt; 1 là <strong>số nguyên tố</strong> nếu ước dương duy nhất của nó là 1 và p; ngược lại là hợp số. <strong>Định lý cơ bản của số học</strong>: mọi số nguyên n &gt; 1 là tích các số nguyên tố theo đúng một cách nếu không kể thứ tự (sự tồn tại là Ví dụ 4 Bài 2.3; tính duy nhất dùng bổ đề Euclid ở dưới). Nếu n là hợp số thì nó có ước nguyên tố ≤ √n, nên chia thử tới √n là kiểm được tính nguyên tố. <strong>Sàng Eratosthenes</strong> liệt kê mọi số nguyên tố ≤ n bằng cách gạch bội của từng số nguyên tố p, bắt đầu từ p<sup>2</sup>. Có vô hạn số nguyên tố (Bài 2.2), và theo định lý số nguyên tố có khoảng n/ln n số nguyên tố ≤ n.</p>
<p>gcd(a, b) (ƯCLN) là số nguyên lớn nhất chia hết cả hai; lcm(a, b) (BCNN) là bội chung dương nhỏ nhất; ab = gcd(a, b)·lcm(a, b). a và b <strong>nguyên tố cùng nhau</strong> nếu gcd(a, b) = 1. Từ phân tích thừa số, gcd lấy số mũ nhỏ nhất của từng số nguyên tố, lcm lấy số mũ lớn nhất — nhưng phân tích thừa số chậm, nên ta dùng:</p>
<div class="formula"><span class="lbl">Thuật toán Euclid</span>gcd(a, b) = gcd(b, a mod b),   gcd(a, 0) = a</div>
<p>Vì sao đúng: mọi ước chung của a và b đều chia hết r = a − qb, và ngược lại. Vì sao nhanh: cứ hai bước thì số dư giảm ít nhất một nửa, nên số phép chia là O(log b) (định lý Lamé: không quá 5 lần số chữ số thập phân của b).</p>
<div class="formula"><span class="lbl">Đẳng thức Bézout</span>gcd(a, b) = s·a + t·b với các số nguyên s, t nào đó</div>
<p><strong>Thuật toán Euclid mở rộng</strong> tìm s và t bằng cách chạy Euclid ngược lại (hoặc mang hệ số theo chiều xuôi). Từ đó có <strong>bổ đề Euclid</strong>: nếu p nguyên tố và p | ab thì p | a hoặc p | b (nếu p ∤ a thì 1 = sp + ta, nên b = spb + tab chia hết cho p).</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1.</b> gcd(252, 198): 252 = 1·198 + 54; 198 = 3·54 + 36; 54 = 1·36 + 18; 36 = 2·18 + 0 ⇒ gcd = 18. lcm = 252·198/18 = 2772.</p></div>
<div class="callout"><p><b>Ví dụ 2 — thế ngược.</b> 18 = 54 − 1·36 = 54 − (198 − 3·54) = 4·54 − 198 = 4·(252 − 198) − 198 = 4·252 − 5·198. Vậy s = 4, t = −5.</p></div>
<pre><code class="language-python">def gcd_steps(a, b):
    while b:
        print(f"{a} = {a // b} * {b} + {a % b}")
        a, b = b, a % b
    return a

def ext_gcd(a, b):
    """Return (g, s, t) with g = gcd(a, b) = s*a + t*b."""
    if b == 0:
        return a, 1, 0
    g, s, t = ext_gcd(b, a % b)
    return g, t, s - (a // b) * t

print("gcd =", gcd_steps(252, 198))
g, s, t = ext_gcd(252, 198)
print(g, s, t, s * 252 + t * 198)

def sieve(n):
    is_p = [True] * (n + 1)
    is_p[0] = is_p[1] = False
    for i in range(2, int(n ** 0.5) + 1):
        if is_p[i]:
            for j in range(i * i, n + 1, i):
                is_p[j] = False
    return [i for i in range(n + 1) if is_p[i]]

print(sieve(50))
print(len(sieve(10**6)))</code></pre>
<div class="out">252 = 1 * 198 + 54
198 = 3 * 54 + 36
54 = 1 * 36 + 18
36 = 2 * 18 + 0
gcd = 18
18 4 -5 18
[2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]
78498</div>
<p>Hàm đệ quy <code>ext_gcd</code> trả về đúng s = 4, t = −5. Sàng tìm 78 498 số nguyên tố dưới một triệu trong chưa tới một giây; n/ln n ≈ 72 382 là ước lượng của định lý số nguyên tố.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Tin rằng 1 là số nguyên tố (không phải — nếu không, phân tích thừa số sẽ không duy nhất).</li><li>Thử ước tới n/2 thay vì √n.</li><li>Mất dấu khi thế ngược; luôn kiểm lại s·a + t·b ở cuối.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Phân tích thừa số nguyên tố duy nhất; chia thử tới √n; sàng cho nhiều số nguyên tố.</li><li>gcd(a, b) = gcd(b, a mod b): O(log b) bước.</li><li>Bézout: gcd = sa + tb, tìm bằng Euclid mở rộng.</li><li>Bổ đề Euclid: p | ab ⇒ p | a hoặc p | b.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://cp-algorithms.com/algebra/euclid-algorithm.html" target="_blank" rel="noopener">cp-algorithms — Euclidean algorithm</a></li><li><a href="https://cp-algorithms.com/algebra/extended-euclid-algorithm.html" target="_blank" rel="noopener">cp-algorithms — Extended Euclidean Algorithm</a></li><li><a href="https://cp-algorithms.com/algebra/sieve-of-eratosthenes.html" target="_blank" rel="noopener">cp-algorithms — Sieve of Eratosthenes</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tìm gcd(1071, 462) bằng thuật toán Euclid.</li><li>Biểu diễn gcd(26, 7) dưới dạng 26s + 7t.</li><li>Phân tích 7007 ra thừa số nguyên tố và dùng nó để tìm gcd(7007, 1001).</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 1071 = 2·462 + 147; 462 = 3·147 + 21; 147 = 7·21 ⇒ 21. 2) 26 = 3·7 + 5, 7 = 1·5 + 2, 5 = 2·2 + 1 ⇒ 1 = 5 − 2·2 = 5 − 2(7 − 5) = 3·5 − 2·7 = 3(26 − 3·7) − 2·7 = 3·26 − 11·7. 3) 7007 = 7<sup>2</sup>·11·13, 1001 = 7·11·13 ⇒ gcd = 1001.</p></div>`);

const c63 = L('mad102-ts-6-3',
  '6.3 — Linear congruences, CRT, Fermat and Euler|||6.3 — Đồng dư tuyến tính, định lý số dư Trung Hoa, Fermat và Euler',
  'Nghịch đảo modulo (tồn tại ⇔ gcd = 1), giải ax ≡ b (mod m), định lý số dư Trung Hoa (CRT) có thuật toán, định lý Fermat nhỏ, hàm φ Euler và định lý Euler; kiểm bằng pow(a, -1, m) trong Python.',
  `<span class="eyebrow">MAD102 · Chapter 6 · Lesson 6.3</span>
<h2>Linear congruences, CRT, Fermat and Euler</h2>
<p class="lead">To “divide” modulo m we need inverses. With inverses we can solve linear congruences, combine information modulo several numbers (the Chinese Remainder Theorem), and shrink huge exponents with the theorems of Fermat and Euler — the three ingredients of RSA.</p>
<h3>🎯 Objectives</h3>
<ul><li>Decide whether a has an inverse mod m and compute it.</li><li>Solve linear congruences and systems with the Chinese Remainder Theorem.</li><li>Apply Fermat's little theorem and Euler's theorem to reduce exponents.</li></ul>
<h3>📖 Lecture</h3>
<p>An <strong>inverse</strong> of a modulo m is an ā with aā ≡ 1 (mod m). It exists <strong>iff gcd(a, m) = 1</strong>, and then it is unique mod m: Bézout gives 1 = sa + tm, so sa ≡ 1. When m is prime every non-zero a has an inverse, so ℤ<sub>p</sub> is a field — you can add, subtract, multiply and divide.</p>
<p>The linear congruence ax ≡ b (mod m) with gcd(a, m) = 1 has the unique solution x ≡ āb (mod m).</p>
<div class="formula"><span class="lbl">Chinese Remainder Theorem</span>If m<sub>1</sub>, …, m<sub>n</sub> are pairwise coprime and M = m<sub>1</sub>…m<sub>n</sub>, the system x ≡ a<sub>i</sub> (mod m<sub>i</sub>) has a unique solution mod M:<br>x = Σ a<sub>i</sub>·M<sub>i</sub>·y<sub>i</sub> where M<sub>i</sub> = M/m<sub>i</sub> and y<sub>i</sub> is the inverse of M<sub>i</sub> mod m<sub>i</sub>.</div>
<p>CRT lets computers work with huge numbers through several small residues in parallel, and it speeds up RSA decryption about 4×.</p>
<div class="formula"><span class="lbl">Fermat's little theorem</span>p prime, p ∤ a ⇒ a<sup>p−1</sup> ≡ 1 (mod p)   (and a<sup>p</sup> ≡ a for every a)</div>
<p>Euler's <strong>totient</strong> φ(n) counts the integers in {1, …, n} coprime to n: φ(p) = p − 1, φ(p<sup>k</sup>) = p<sup>k</sup> − p<sup>k−1</sup>, and φ(mn) = φ(m)φ(n) when gcd(m, n) = 1. In particular φ(pq) = (p − 1)(q − 1) for distinct primes.</p>
<div class="formula"><span class="lbl">Euler's theorem</span>gcd(a, n) = 1 ⇒ a<sup>φ(n)</sup> ≡ 1 (mod n)</div>
<p>Fermat is the case n = p. Consequence: exponents can be reduced mod φ(n) — a<sup>e</sup> ≡ a<sup>e mod φ(n)</sup> when gcd(a, n) = 1. Fermat's theorem also gives the <strong>Fermat primality test</strong>: if a<sup>n−1</sup> ≢ 1 (mod n), n is certainly composite; the Miller–Rabin refinement is what libraries use to generate RSA primes.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — inverse and congruence.</b> Inverse of 3 mod 7: 3·5 = 15 ≡ 1, so 3̄ = 5. Solve 3x ≡ 4 (mod 7): x ≡ 5·4 = 20 ≡ 6. Check 3·6 = 18 ≡ 4. ✓</p></div>
<div class="callout"><p><b>Example 2 — CRT (Sun Zi's problem).</b> x ≡ 2 (mod 3), x ≡ 3 (mod 5), x ≡ 2 (mod 7). M = 105; M<sub>1</sub> = 35, y<sub>1</sub> = 2 (35 ≡ 2, 2·2 ≡ 1 mod 3); M<sub>2</sub> = 21, y<sub>2</sub> = 1; M<sub>3</sub> = 15, y<sub>3</sub> = 1. x = 2·35·2 + 3·21·1 + 2·15·1 = 140 + 63 + 30 = 233 ≡ 23 (mod 105).</p></div>
<div class="callout"><p><b>Example 3 — Fermat.</b> 7<sup>222</sup> mod 11: 7<sup>10</sup> ≡ 1 and 222 = 22·10 + 2, so 7<sup>222</sup> ≡ 7<sup>2</sup> = 49 ≡ 5.</p></div>
<pre><code class="language-python">print(pow(3, -1, 7))                      # inverse of 3 mod 7 (Python 3.8+)
print((pow(3, -1, 7) * 4) % 7)            # solution of 3x = 4 (mod 7)

def crt(remainders, moduli):
    """Chinese Remainder Theorem for pairwise coprime moduli."""
    M = 1
    for m in moduli:
        M *= m
    x = 0
    for a, m in zip(remainders, moduli):
        Mi = M // m
        x += a * Mi * pow(Mi, -1, m)
    return x % M, M

print(crt([2, 3, 2], [3, 5, 7]))
print(pow(7, 222, 11))                    # Fermat: 7^10 = 1 (mod 11)

from math import gcd
phi = lambda n: sum(1 for k in range(1, n + 1) if gcd(k, n) == 1)
print([phi(n) for n in [7, 10, 12, 36]])
print(pow(3, phi(10), 10))                # Euler: 3^phi(10) = 1 (mod 10)</code></pre>
<div class="out">5
6
(23, 105)
5
[6, 4, 4, 12]
1</div>
<p>φ(7) = 6, φ(10) = 4, φ(12) = 4, φ(36) = 12 = 36·(1 − 1/2)(1 − 1/3); and 3<sup>4</sup> = 81 ≡ 1 (mod 10), as Euler's theorem says. Since Python 3.8, <code>pow(a, -1, m)</code> computes modular inverses.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Looking for the inverse of 4 mod 6 — none exists, gcd(4, 6) = 2.</li><li>Applying CRT to moduli that are not pairwise coprime (6 and 4).</li><li>Using Fermat with a non-prime modulus; for composite n use φ(n).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>a has an inverse mod m ⇔ gcd(a, m) = 1; find it by extended Euclid.</li><li>CRT: pairwise coprime moduli ⇒ unique solution mod M.</li><li>Fermat: a<sup>p−1</sup> ≡ 1 (mod p); Euler: a<sup>φ(n)</sup> ≡ 1 (mod n).</li><li>φ(pq) = (p − 1)(q − 1).</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://cp-algorithms.com/algebra/module-inverse.html" target="_blank" rel="noopener">cp-algorithms — Modular Inverse</a></li><li><a href="https://brilliant.org/wiki/chinese-remainder-theorem/" target="_blank" rel="noopener">Brilliant — Chinese Remainder Theorem</a></li><li><a href="https://brilliant.org/wiki/fermats-little-theorem/" target="_blank" rel="noopener">Brilliant — Fermat's Little Theorem</a></li><li><a href="https://cp-algorithms.com/algebra/phi-function.html" target="_blank" rel="noopener">cp-algorithms — Euler's totient function</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Find the inverse of 7 modulo 26.</li><li>Solve x ≡ 1 (mod 4), x ≡ 2 (mod 9).</li><li>Compute 2<sup>1000</sup> mod 13 using Fermat.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 7·15 = 105 = 4·26 + 1 ⇒ 15. 2) x ≡ 29 (mod 36) (29 = 4·7 + 1 = 9·3 + 2). 3) 2<sup>12</sup> ≡ 1 and 1000 = 12·83 + 4 ⇒ 2<sup>4</sup> = 16 ≡ 3.</p></div>`,
  `<span class="eyebrow">MAD102 · Chương 6 · Bài 6.3</span>
<h2>Đồng dư tuyến tính, định lý số dư Trung Hoa, Fermat và Euler</h2>
<p class="lead">Muốn “chia” theo modulo m ta cần nghịch đảo. Có nghịch đảo, ta giải được đồng dư tuyến tính, ghép thông tin theo nhiều modulo (định lý số dư Trung Hoa), và thu nhỏ số mũ khổng lồ bằng định lý Fermat và Euler — ba nguyên liệu của RSA.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Xác định a có nghịch đảo modulo m không và tính nó.</li><li>Giải đồng dư tuyến tính và hệ đồng dư bằng định lý số dư Trung Hoa.</li><li>Áp dụng định lý Fermat nhỏ và định lý Euler để rút gọn số mũ.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Nghịch đảo</strong> của a modulo m là ā với aā ≡ 1 (mod m). Nó tồn tại <strong>khi và chỉ khi gcd(a, m) = 1</strong>, và khi đó duy nhất theo mod m: Bézout cho 1 = sa + tm, nên sa ≡ 1. Khi m nguyên tố, mọi a khác 0 đều có nghịch đảo, nên ℤ<sub>p</sub> là một trường — cộng, trừ, nhân, chia đều được.</p>
<p>Đồng dư tuyến tính ax ≡ b (mod m) với gcd(a, m) = 1 có nghiệm duy nhất x ≡ āb (mod m).</p>
<div class="formula"><span class="lbl">Định lý số dư Trung Hoa</span>Nếu m<sub>1</sub>, …, m<sub>n</sub> đôi một nguyên tố cùng nhau và M = m<sub>1</sub>…m<sub>n</sub> thì hệ x ≡ a<sub>i</sub> (mod m<sub>i</sub>) có nghiệm duy nhất mod M:<br>x = Σ a<sub>i</sub>·M<sub>i</sub>·y<sub>i</sub> với M<sub>i</sub> = M/m<sub>i</sub> và y<sub>i</sub> là nghịch đảo của M<sub>i</sub> mod m<sub>i</sub>.</div>
<p>CRT cho máy tính làm việc với số khổng lồ qua nhiều số dư nhỏ song song, và tăng tốc giải mã RSA khoảng 4 lần.</p>
<div class="formula"><span class="lbl">Định lý Fermat nhỏ</span>p nguyên tố, p ∤ a ⇒ a<sup>p−1</sup> ≡ 1 (mod p)   (và a<sup>p</sup> ≡ a với mọi a)</div>
<p><strong>Hàm phi Euler</strong> φ(n) đếm số nguyên trong {1, …, n} nguyên tố cùng nhau với n: φ(p) = p − 1, φ(p<sup>k</sup>) = p<sup>k</sup> − p<sup>k−1</sup>, và φ(mn) = φ(m)φ(n) khi gcd(m, n) = 1. Nói riêng φ(pq) = (p − 1)(q − 1) với hai số nguyên tố khác nhau.</p>
<div class="formula"><span class="lbl">Định lý Euler</span>gcd(a, n) = 1 ⇒ a<sup>φ(n)</sup> ≡ 1 (mod n)</div>
<p>Fermat là trường hợp n = p. Hệ quả: số mũ rút gọn được theo mod φ(n) — a<sup>e</sup> ≡ a<sup>e mod φ(n)</sup> khi gcd(a, n) = 1. Định lý Fermat còn cho <strong>phép thử Fermat</strong>: nếu a<sup>n−1</sup> ≢ 1 (mod n) thì n chắc chắn là hợp số; bản cải tiến Miller–Rabin là thứ các thư viện dùng để sinh số nguyên tố cho RSA.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — nghịch đảo và đồng dư.</b> Nghịch đảo của 3 mod 7: 3·5 = 15 ≡ 1, nên 3̄ = 5. Giải 3x ≡ 4 (mod 7): x ≡ 5·4 = 20 ≡ 6. Kiểm 3·6 = 18 ≡ 4. ✓</p></div>
<div class="callout"><p><b>Ví dụ 2 — CRT (bài toán Tôn Tử).</b> x ≡ 2 (mod 3), x ≡ 3 (mod 5), x ≡ 2 (mod 7). M = 105; M<sub>1</sub> = 35, y<sub>1</sub> = 2 (35 ≡ 2, 2·2 ≡ 1 mod 3); M<sub>2</sub> = 21, y<sub>2</sub> = 1; M<sub>3</sub> = 15, y<sub>3</sub> = 1. x = 2·35·2 + 3·21·1 + 2·15·1 = 140 + 63 + 30 = 233 ≡ 23 (mod 105).</p></div>
<div class="callout"><p><b>Ví dụ 3 — Fermat.</b> 7<sup>222</sup> mod 11: 7<sup>10</sup> ≡ 1 và 222 = 22·10 + 2, nên 7<sup>222</sup> ≡ 7<sup>2</sup> = 49 ≡ 5.</p></div>
<pre><code class="language-python">print(pow(3, -1, 7))                      # inverse of 3 mod 7 (Python 3.8+)
print((pow(3, -1, 7) * 4) % 7)            # solution of 3x = 4 (mod 7)

def crt(remainders, moduli):
    """Chinese Remainder Theorem for pairwise coprime moduli."""
    M = 1
    for m in moduli:
        M *= m
    x = 0
    for a, m in zip(remainders, moduli):
        Mi = M // m
        x += a * Mi * pow(Mi, -1, m)
    return x % M, M

print(crt([2, 3, 2], [3, 5, 7]))
print(pow(7, 222, 11))                    # Fermat: 7^10 = 1 (mod 11)

from math import gcd
phi = lambda n: sum(1 for k in range(1, n + 1) if gcd(k, n) == 1)
print([phi(n) for n in [7, 10, 12, 36]])
print(pow(3, phi(10), 10))                # Euler: 3^phi(10) = 1 (mod 10)</code></pre>
<div class="out">5
6
(23, 105)
5
[6, 4, 4, 12]
1</div>
<p>φ(7) = 6, φ(10) = 4, φ(12) = 4, φ(36) = 12 = 36·(1 − 1/2)(1 − 1/3); và 3<sup>4</sup> = 81 ≡ 1 (mod 10), đúng như định lý Euler. Từ Python 3.8, <code>pow(a, -1, m)</code> tính nghịch đảo modulo.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Tìm nghịch đảo của 4 mod 6 — không có, gcd(4, 6) = 2.</li><li>Áp dụng CRT cho các modulo không đôi một nguyên tố cùng nhau (6 và 4).</li><li>Dùng Fermat với modulo không nguyên tố; với n hợp số dùng φ(n).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>a có nghịch đảo mod m ⇔ gcd(a, m) = 1; tìm bằng Euclid mở rộng.</li><li>CRT: modulo đôi một nguyên tố cùng nhau ⇒ nghiệm duy nhất mod M.</li><li>Fermat: a<sup>p−1</sup> ≡ 1 (mod p); Euler: a<sup>φ(n)</sup> ≡ 1 (mod n).</li><li>φ(pq) = (p − 1)(q − 1).</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://cp-algorithms.com/algebra/module-inverse.html" target="_blank" rel="noopener">cp-algorithms — Modular Inverse</a></li><li><a href="https://brilliant.org/wiki/chinese-remainder-theorem/" target="_blank" rel="noopener">Brilliant — Chinese Remainder Theorem</a></li><li><a href="https://brilliant.org/wiki/fermats-little-theorem/" target="_blank" rel="noopener">Brilliant — Fermat's Little Theorem</a></li><li><a href="https://cp-algorithms.com/algebra/phi-function.html" target="_blank" rel="noopener">cp-algorithms — Euler's totient function</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tìm nghịch đảo của 7 modulo 26.</li><li>Giải x ≡ 1 (mod 4), x ≡ 2 (mod 9).</li><li>Tính 2<sup>1000</sup> mod 13 bằng định lý Fermat.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 7·15 = 105 = 4·26 + 1 ⇒ 15. 2) x ≡ 29 (mod 36) (29 = 4·7 + 1 = 9·3 + 2). 3) 2<sup>12</sup> ≡ 1 và 1000 = 12·83 + 4 ⇒ 2<sup>4</sup> = 16 ≡ 3.</p></div>`);

const c64 = L('mad102-ts-6-4',
  '6.4 — Cryptography: RSA, Diffie–Hellman and check digits|||6.4 — Mật mã: RSA, Diffie–Hellman và chữ số kiểm tra',
  'Mã Caesar/affine, mật mã khoá công khai, RSA (sinh khoá, mã hoá, giải mã, vì sao đúng, vì sao an toàn) với ví dụ số nhỏ chạy thật, trao đổi khoá Diffie–Hellman, chữ số kiểm tra ISBN-13.',
  `<span class="eyebrow">MAD102 · Chapter 6 · Lesson 6.4</span>
<h2>Cryptography: RSA, Diffie–Hellman and check digits</h2>
<p class="lead">Every lesson of this chapter now pays off. With modular exponentiation, gcd, inverses and Euler's theorem you can understand, line by line, the algorithms that protect banking, messaging and software updates.</p>
<h3>🎯 Objectives</h3>
<ul><li>Encrypt and decrypt with shift and affine ciphers, and see why they are weak.</li><li>Generate RSA keys, encrypt, decrypt, and prove decryption works.</li><li>Explain Diffie–Hellman key exchange and compute check digits.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>Classical ciphers.</strong> Number the letters A = 0, …, Z = 25. The Caesar (shift) cipher is f(p) = (p + k) mod 26; the affine cipher is f(p) = (ap + b) mod 26 with gcd(a, 26) = 1 so that decryption p = ā(c − b) exists. Both are broken instantly by trying all keys (26 or 312) or by letter-frequency analysis. Their deeper weakness is that the key used to encrypt is also the key used to decrypt, so it must be shared secretly beforehand.</p>
<p><strong>Public-key cryptography</strong> separates the two: anyone may encrypt with the public key; only the owner of the private key can decrypt.</p>
<div class="formula"><span class="lbl">RSA (Rivest–Shamir–Adleman, 1977)</span>Key generation: choose large primes p, q; n = pq; φ = (p − 1)(q − 1); choose e with gcd(e, φ) = 1; d = e<sup>−1</sup> mod φ.<br>Public key (n, e). Private key d.<br>Encrypt: c = m<sup>e</sup> mod n.   Decrypt: m = c<sup>d</sup> mod n.</div>
<p><strong>Why it works.</strong> ed = 1 + kφ, so c<sup>d</sup> = m<sup>ed</sup> = m·(m<sup>φ</sup>)<sup>k</sup> ≡ m (mod n) by Euler's theorem when gcd(m, n) = 1 (the case gcd ≠ 1 follows with CRT). <strong>Why it is secure.</strong> Computing d requires φ(n), which is as hard as factoring n; with 2048-bit n no known classical algorithm factors it in practical time. Signatures run RSA in reverse: s = m<sup>d</sup> mod n, and anyone checks s<sup>e</sup> ≡ m.</p>
<p><strong>Diffie–Hellman key exchange</strong> lets two parties agree on a secret over a public channel. Public: a prime P and a base g. Alice picks secret a and sends A = g<sup>a</sup> mod P; Bob picks b and sends B = g<sup>b</sup> mod P. Both compute g<sup>ab</sup> mod P = B<sup>a</sup> = A<sup>b</sup>. An eavesdropper sees g<sup>a</sup> and g<sup>b</sup> but must solve a discrete logarithm to get the secret. Modern TLS uses the elliptic-curve version.</p>
<p><strong>Check digits</strong> catch typing errors rather than attackers. ISBN-13: weights 1, 3, 1, 3, … on the 13 digits must give a sum ≡ 0 (mod 10). It detects every single-digit error.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — affine.</b> f(p) = (7p + 3) mod 26. “K” = 10 ↦ 73 mod 26 = 21 = “V”. Decrypt: 7̄ = 15 (Lesson 6.3), p = 15(21 − 3) = 270 ≡ 10 = “K”. ✓</p></div>
<div class="callout"><p><b>Example 2 — RSA with small numbers.</b> p = 61, q = 53 ⇒ n = 3233, φ = 3120; e = 17 (gcd(17, 3120) = 1), d = 2753. Message m = 65 ⇒ c = 65<sup>17</sup> mod 3233 = 2790 ⇒ 2790<sup>2753</sup> mod 3233 = 65.</p></div>
<pre><code class="language-python">p, q, e = 61, 53, 17
n, phi = p * q, (p - 1) * (q - 1)
d = pow(e, -1, phi)
print("n =", n, "phi =", phi, "d =", d, "check e*d mod phi =", e * d % phi)
m = 65
c = pow(m, e, n)
print("encrypt 65 -&gt;", c, "; decrypt -&gt;", pow(c, d, n))

# Diffie-Hellman with tiny numbers (real systems use 2048-bit primes or elliptic curves)
P, g = 23, 5
a, b = 6, 15                       # secret keys of Alice and Bob
A, B = pow(g, a, P), pow(g, b, P)  # public values
print("A =", A, "B =", B, "shared:", pow(B, a, P), pow(A, b, P))

# ISBN-13 check digit
def isbn13_check(first12):
    s = sum(int(ch) * (1 if i % 2 == 0 else 3) for i, ch in enumerate(first12))
    return (10 - s % 10) % 10
print(isbn13_check("978125967651"))   # Rosen 8e: 978-1-259-67651-?</code></pre>
<div class="out">n = 3233 phi = 3120 d = 2753 check e*d mod phi = 1
encrypt 65 -&gt; 2790 ; decrypt -&gt; 65
A = 8 B = 19 shared: 2 2
2</div>
<p>The last line recomputes the check digit of the ISBN of Rosen's textbook (978-1-259-67651-<b>2</b>): it is 2, as printed on the book. Real RSA keys use primes of about 1024 bits each and padding schemes (OAEP); never use “textbook RSA” as above in production.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Choosing e not coprime to φ — then d does not exist.</li><li>Thinking the security comes from keeping e or n secret; they are public. Only d (equivalently p, q) is secret.</li><li>Encrypting m ≥ n: the message must be smaller than n (split or hash long messages).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Shift/affine ciphers: same key both ways, easy to break.</li><li>RSA: n = pq, ed ≡ 1 (mod φ), c = m<sup>e</sup>, m = c<sup>d</sup> mod n; correctness by Euler; security by hardness of factoring.</li><li>Diffie–Hellman: shared secret g<sup>ab</sup> mod P; security by discrete log.</li><li>Check digits detect errors with a weighted sum mod 10.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://brilliant.org/wiki/rsa-encryption/" target="_blank" rel="noopener">Brilliant — RSA Encryption</a></li><li><a href="https://en.wikipedia.org/wiki/RSA_(cryptosystem)" target="_blank" rel="noopener">Wikipedia — RSA cryptosystem</a></li><li><a href="https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange" target="_blank" rel="noopener">Wikipedia — Diffie–Hellman key exchange</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>RSA with p = 5, q = 11, e = 3: find n, φ, d, then encrypt m = 9.</li><li>Why must p and q be kept secret even though n is public?</li><li>Diffie–Hellman with P = 23, g = 5, a = 4, b = 3: what is the shared secret?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) n = 55, φ = 40, d = 27 (3·27 = 81 ≡ 1 mod 40); c = 9<sup>3</sup> mod 55 = 729 mod 55 = 14. 2) Knowing p, q gives φ = (p − 1)(q − 1) and hence d. 3) g<sup>ab</sup> = 5<sup>12</sup> mod 23 = 18.</p></div>`,
  `<span class="eyebrow">MAD102 · Chương 6 · Bài 6.4</span>
<h2>Mật mã: RSA, Diffie–Hellman và chữ số kiểm tra</h2>
<p class="lead">Mọi bài trong chương giờ được đền đáp. Với lũy thừa modulo, ƯCLN, nghịch đảo và định lý Euler, bạn hiểu được từng dòng của các thuật toán bảo vệ ngân hàng, nhắn tin và cập nhật phần mềm.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Mã hoá và giải mã bằng mã dịch chuyển và mã affine, thấy vì sao chúng yếu.</li><li>Sinh khoá RSA, mã hoá, giải mã và chứng minh giải mã đúng.</li><li>Giải thích trao đổi khoá Diffie–Hellman và tính chữ số kiểm tra.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Mã cổ điển.</strong> Đánh số chữ cái A = 0, …, Z = 25. Mã Caesar (dịch chuyển) là f(p) = (p + k) mod 26; mã affine là f(p) = (ap + b) mod 26 với gcd(a, 26) = 1 để có giải mã p = ā(c − b). Cả hai bị phá ngay bằng thử mọi khoá (26 hoặc 312 khoá) hoặc phân tích tần suất chữ cái. Điểm yếu sâu hơn: khoá mã hoá cũng là khoá giải mã, nên phải chia sẻ bí mật từ trước.</p>
<p><strong>Mật mã khoá công khai</strong> tách hai khoá: ai cũng mã hoá được bằng khoá công khai; chỉ người giữ khoá bí mật giải mã được.</p>
<div class="formula"><span class="lbl">RSA (Rivest–Shamir–Adleman, 1977)</span>Sinh khoá: chọn hai số nguyên tố lớn p, q; n = pq; φ = (p − 1)(q − 1); chọn e với gcd(e, φ) = 1; d = e<sup>−1</sup> mod φ.<br>Khoá công khai (n, e). Khoá bí mật d.<br>Mã hoá: c = m<sup>e</sup> mod n.   Giải mã: m = c<sup>d</sup> mod n.</div>
<p><strong>Vì sao đúng.</strong> ed = 1 + kφ, nên c<sup>d</sup> = m<sup>ed</sup> = m·(m<sup>φ</sup>)<sup>k</sup> ≡ m (mod n) theo định lý Euler khi gcd(m, n) = 1 (trường hợp gcd ≠ 1 suy ra nhờ CRT). <strong>Vì sao an toàn.</strong> Tính d cần φ(n), khó ngang phân tích n ra thừa số; với n 2048 bit chưa có thuật toán cổ điển nào phân tích được trong thời gian thực tế. Chữ ký số chạy RSA theo chiều ngược: s = m<sup>d</sup> mod n, ai cũng kiểm được s<sup>e</sup> ≡ m.</p>
<p><strong>Trao đổi khoá Diffie–Hellman</strong> cho hai bên thống nhất một bí mật qua kênh công khai. Công khai: số nguyên tố P và cơ số g. Alice chọn bí mật a và gửi A = g<sup>a</sup> mod P; Bob chọn b và gửi B = g<sup>b</sup> mod P. Cả hai tính g<sup>ab</sup> mod P = B<sup>a</sup> = A<sup>b</sup>. Kẻ nghe lén thấy g<sup>a</sup>, g<sup>b</sup> nhưng phải giải bài toán logarit rời rạc mới có bí mật. TLS hiện đại dùng phiên bản đường cong elliptic.</p>
<p><strong>Chữ số kiểm tra</strong> bắt lỗi gõ chứ không chống kẻ tấn công. ISBN-13: trọng số 1, 3, 1, 3, … trên 13 chữ số phải cho tổng ≡ 0 (mod 10). Nó phát hiện mọi lỗi sai một chữ số.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — affine.</b> f(p) = (7p + 3) mod 26. “K” = 10 ↦ 73 mod 26 = 21 = “V”. Giải mã: 7̄ = 15 (Bài 6.3), p = 15(21 − 3) = 270 ≡ 10 = “K”. ✓</p></div>
<div class="callout"><p><b>Ví dụ 2 — RSA với số nhỏ.</b> p = 61, q = 53 ⇒ n = 3233, φ = 3120; e = 17 (gcd(17, 3120) = 1), d = 2753. Thông điệp m = 65 ⇒ c = 65<sup>17</sup> mod 3233 = 2790 ⇒ 2790<sup>2753</sup> mod 3233 = 65.</p></div>
<pre><code class="language-python">p, q, e = 61, 53, 17
n, phi = p * q, (p - 1) * (q - 1)
d = pow(e, -1, phi)
print("n =", n, "phi =", phi, "d =", d, "check e*d mod phi =", e * d % phi)
m = 65
c = pow(m, e, n)
print("encrypt 65 -&gt;", c, "; decrypt -&gt;", pow(c, d, n))

# Diffie-Hellman with tiny numbers (real systems use 2048-bit primes or elliptic curves)
P, g = 23, 5
a, b = 6, 15                       # secret keys of Alice and Bob
A, B = pow(g, a, P), pow(g, b, P)  # public values
print("A =", A, "B =", B, "shared:", pow(B, a, P), pow(A, b, P))

# ISBN-13 check digit
def isbn13_check(first12):
    s = sum(int(ch) * (1 if i % 2 == 0 else 3) for i, ch in enumerate(first12))
    return (10 - s % 10) % 10
print(isbn13_check("978125967651"))   # Rosen 8e: 978-1-259-67651-?</code></pre>
<div class="out">n = 3233 phi = 3120 d = 2753 check e*d mod phi = 1
encrypt 65 -&gt; 2790 ; decrypt -&gt; 65
A = 8 B = 19 shared: 2 2
2</div>
<p>Dòng cuối tính lại chữ số kiểm tra trong ISBN của giáo trình Rosen (978-1-259-67651-<b>2</b>): đúng là 2 như in trên sách. Khoá RSA thật dùng mỗi số nguyên tố khoảng 1024 bit và lược đồ đệm (OAEP); đừng bao giờ dùng “RSA sách giáo khoa” như trên trong sản phẩm thật.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Chọn e không nguyên tố cùng nhau với φ — khi đó không có d.</li><li>Nghĩ an toàn đến từ việc giấu e hoặc n; chúng công khai. Chỉ d (tương đương p, q) là bí mật.</li><li>Mã hoá m ≥ n: thông điệp phải nhỏ hơn n (chia nhỏ hoặc băm thông điệp dài).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Mã dịch chuyển/affine: cùng khoá hai chiều, dễ phá.</li><li>RSA: n = pq, ed ≡ 1 (mod φ), c = m<sup>e</sup>, m = c<sup>d</sup> mod n; đúng nhờ Euler; an toàn nhờ độ khó phân tích thừa số.</li><li>Diffie–Hellman: bí mật chung g<sup>ab</sup> mod P; an toàn nhờ logarit rời rạc.</li><li>Chữ số kiểm tra phát hiện lỗi bằng tổng có trọng số mod 10.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://brilliant.org/wiki/rsa-encryption/" target="_blank" rel="noopener">Brilliant — RSA Encryption</a></li><li><a href="https://en.wikipedia.org/wiki/RSA_(cryptosystem)" target="_blank" rel="noopener">Wikipedia — RSA cryptosystem</a></li><li><a href="https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange" target="_blank" rel="noopener">Wikipedia — Diffie–Hellman key exchange</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>RSA với p = 5, q = 11, e = 3: tìm n, φ, d rồi mã hoá m = 9.</li><li>Vì sao phải giữ bí mật p và q dù n công khai?</li><li>Diffie–Hellman với P = 23, g = 5, a = 4, b = 3: bí mật chung là gì?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) n = 55, φ = 40, d = 27 (3·27 = 81 ≡ 1 mod 40); c = 9<sup>3</sup> mod 55 = 729 mod 55 = 14. 2) Biết p, q là có φ = (p − 1)(q − 1) và suy ra d. 3) g<sup>ab</sup> = 5<sup>12</sup> mod 23 = 18.</p></div>`);

const q6 = QZ(6, 'Quiz — Chapter 6: Number theory and cryptography|||Quiz — Chương 6: Lý thuyết số và mật mã', 'Kiểm tra chương 6: div/mod, lũy thừa modulo, Euclid, Bézout, nghịch đảo, CRT, Fermat/Euler, RSA, Diffie–Hellman.', [
  Q('q1', 'By the division algorithm, −11 mod 3 equals|||Theo thuật toán chia, −11 mod 3 bằng',
    ['−2|||−2', '1|||1', '2|||2', '−1|||−1'], 1,
    '−11 = 3·(−4) + 1 with 0 ≤ r and r less than 3.|||−11 = 3·(−4) + 1 với 0 ≤ r và r nhỏ hơn 3.'),
  Q('q2', '3²⁰⁰ mod 13 equals|||3²⁰⁰ mod 13 bằng',
    ['1|||1', '3|||3', '9|||9', '12|||12'], 2,
    '3³ ≡ 1 (mod 13) and 200 = 3·66 + 2.|||3³ ≡ 1 (mod 13) và 200 = 3·66 + 2.'),
  Q('q3', 'gcd(252, 198) =|||gcd(252, 198) =',
    ['6|||6', '9|||9', '18|||18', '54|||54'], 2,
    '252 → 198 → 54 → 36 → 18 → 0.|||252 → 198 → 54 → 36 → 18 → 0.'),
  Q('q4', 'Which pair (s, t) satisfies 252s + 198t = 18?|||Cặp (s, t) nào thoả 252s + 198t = 18?',
    ['(1, −1)|||(1, −1)', '(4, −5)|||(4, −5)', '(−5, 4)|||(−5, 4)', '(2, −3)|||(2, −3)'], 1,
    '4·252 − 5·198 = 1008 − 990 = 18.|||4·252 − 5·198 = 1008 − 990 = 18.'),
  Q('q5', 'Which number has NO inverse modulo 12?|||Số nào KHÔNG có nghịch đảo modulo 12?',
    ['5|||5', '7|||7', '9|||9', '11|||11'], 2,
    'gcd(9, 12) = 3, not 1.|||gcd(9, 12) = 3, khác 1.'),
  Q('q6', 'The smallest positive x with x ≡ 2 (mod 3), x ≡ 3 (mod 5), x ≡ 2 (mod 7) is|||Số dương x nhỏ nhất với x ≡ 2 (mod 3), x ≡ 3 (mod 5), x ≡ 2 (mod 7) là',
    ['8|||8', '23|||23', '53|||53', '128|||128'], 1,
    'CRT gives x ≡ 23 (mod 105).|||CRT cho x ≡ 23 (mod 105).'),
  Q('q7', 'φ(36) =|||φ(36) =',
    ['6|||6', '12|||12', '18|||18', '24|||24'], 1,
    '36·(1 − 1/2)(1 − 1/3) = 12.|||36·(1 − 1/2)(1 − 1/3) = 12.'),
  Q('q8', 'In RSA with p = 61, q = 53, e = 17, the private exponent d is|||Trong RSA với p = 61, q = 53, e = 17, số mũ bí mật d là',
    ['17|||17', '3120|||3120', '2753|||2753', '3233|||3233'], 2,
    '17·2753 = 46801 = 15·3120 + 1.|||17·2753 = 46801 = 15·3120 + 1.'),
  Q('q9', 'The security of RSA rests on the difficulty of|||Độ an toàn của RSA dựa trên độ khó của',
    ['computing gcds|||tính ƯCLN', 'factoring n = pq|||phân tích n = pq ra thừa số', 'modular exponentiation|||lũy thừa modulo', 'testing primality|||kiểm tra nguyên tố'], 1,
    'Factoring n reveals φ(n) and hence d; the other tasks are fast.|||Phân tích n lộ ra φ(n) và do đó d; các việc khác đều nhanh.'),
]);

const ch6 = {
  title: 'Chapter 6 — Number theory and cryptography|||Chương 6 — Lý thuyết số và mật mã',
  description: 'Chia hết, đồng dư, lũy thừa nhanh modulo; số nguyên tố, Euclid và Euclid mở rộng; nghịch đảo, CRT, Fermat, Euler; RSA, Diffie–Hellman, chữ số kiểm tra — mọi ví dụ chạy thật (Rosen ch. 4 · MCS ch. 9).',
  lessons: [c61, c62, c63, c64, q6],
};

// ───────────────────────────── Chương 7 — Phép đếm ─────────────────────────────
const c71 = L('mad102-ts-7-1',
  '7.1 — Basic counting rules and the pigeonhole principle|||7.1 — Các quy tắc đếm cơ bản và nguyên lý chuồng bồ câu',
  'Quy tắc nhân, quy tắc cộng, quy tắc trừ (bao hàm – loại trừ hai tập), quy tắc chia, cây đếm; nguyên lý chuồng bồ câu và dạng tổng quát; ví dụ mật khẩu, chuỗi bit kiểm bằng vét cạn.',
  `<span class="eyebrow">MAD102 · Chapter 7 · Lesson 7.1</span>
<h2>Basic counting rules and the pigeonhole principle</h2>
<p class="lead">How many passwords can a policy produce? How many IP addresses exist? How many states can a program reach? Counting is the basis of complexity analysis, probability and security estimates, and almost everything reduces to four simple rules.</p>
<h3>🎯 Objectives</h3>
<ul><li>Apply the product, sum, subtraction and division rules, and decide which one a problem needs.</li><li>Use complements (“at least one”) to simplify counting.</li><li>Apply the pigeonhole principle and its generalised form.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Four rules</span>Product rule: a task done in two stages with n<sub>1</sub> and n<sub>2</sub> ways ⇒ n<sub>1</sub>·n<sub>2</sub> ways.<br>Sum rule: a task done in one of two disjoint ways ⇒ n<sub>1</sub> + n<sub>2</sub> ways.<br>Subtraction rule: |A ∪ B| = |A| + |B| − |A ∩ B|.<br>Division rule: if every outcome is counted exactly d times, divide by d.</div>
<p>The product rule counts sequences: bit strings of length n: 2<sup>n</sup>; functions from an m-set to an n-set: n<sup>m</sup>; subsets of an n-set: 2<sup>n</sup>. The sum rule counts alternatives that cannot happen together. When they can overlap, subtract the overlap. The division rule handles symmetry: the number of ways to seat n people at a round table is n!/n = (n − 1)! because each arrangement is counted once for each of its n rotations.</p>
<p><strong>Complements.</strong> “At least one” is usually easier as “all minus none”. Passwords of length 6 over 36 symbols (A–Z, 0–9) with at least one digit: 36<sup>6</sup> − 26<sup>6</sup>.</p>
<div class="formula"><span class="lbl">Pigeonhole principle</span>If N objects go into k boxes, some box contains at least ⌈N/k⌉ objects. In particular, k + 1 objects in k boxes ⇒ a box with ≥ 2.</div>
<p>Pigeonhole proves existence without finding the object: among 367 people two share a birthday; any 6 integers contain two with the same remainder mod 5; every lossless compression algorithm makes some file <em>longer</em> (there are 2<sup>n</sup> files of length n but only 2<sup>n</sup> − 1 shorter strings); every hash function on more inputs than outputs has collisions.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — passwords.</b> Length 6, 7 or 8; each character an uppercase letter or a digit; at least one digit. Sum rule over the lengths, complement inside each: Σ<sub>k=6</sub><sup>8</sup> (36<sup>k</sup> − 26<sup>k</sup>) = 2 684 483 063 360.</p></div>
<div class="callout"><p><b>Example 2 — subtraction rule.</b> Bit strings of length 8 that start with 1 <em>or</em> end with 00: 2<sup>7</sup> + 2<sup>6</sup> − 2<sup>5</sup> = 128 + 64 − 32 = 160.</p></div>
<div class="callout"><p><b>Example 3 — generalised pigeonhole.</b> In any group of 100 people at least ⌈100/12⌉ = 9 were born in the same month.</p></div>
<pre><code class="language-python">from itertools import product

# passwords of length 6..8 over A-Z and 0-9 containing at least one digit
total = sum(36 ** k - 26 ** k for k in range(6, 9))
print(f"{total:,}")

# bit strings of length 8 that start with 1 OR end with 00
count = sum(1 for s in product("01", repeat=8) if s[0] == "1" or s[-2:] == ("0", "0"))
print(count, 2**7 + 2**6 - 2**5)

import math
print(math.ceil(100 / 12))   # generalized pigeonhole: 100 people, 12 months</code></pre>
<div class="out">2,684,483,063,360
160 160
9</div>
<div class="callout"><p><b>Example 4 — a pigeonhole proof.</b> Among any n + 1 numbers chosen from {1, 2, …, 2n}, one divides another. Write each as 2<sup>k</sup>·m with m odd; there are only n odd values m ≤ 2n, so two chosen numbers share m, and the smaller divides the larger.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Adding when the stages happen together (use product) or multiplying when they are alternatives (use sum).</li><li>Using the sum rule for overlapping cases — double counting.</li><li>Counting “at least one digit” as 10·36<sup>5</sup>: this counts strings with several digits many times.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>“And then” ⇒ multiply; “or” (disjoint) ⇒ add; overlap ⇒ subtract.</li><li>Symmetric over-counting ⇒ divide.</li><li>“At least one” ⇒ total minus none.</li><li>N objects in k boxes ⇒ some box has ⌈N/k⌉.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_counting-combine-outcomes.html" target="_blank" rel="noopener">Levin, DMOI 3.2 — Combining Outcomes</a></li><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_counting-non-disjoint.html" target="_blank" rel="noopener">Levin, DMOI 3.3 — Non-Disjoint Outcomes</a></li><li><a href="https://brilliant.org/wiki/pigeonhole-principle-definition/" target="_blank" rel="noopener">Brilliant — Pigeonhole Principle</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>How many IPv4 addresses (32-bit strings) are there? How many 8-bit strings have no two equal adjacent bits?</li><li>How many positive integers ≤ 1000 are divisible by 7 or 11?</li><li>How many students must a class have to guarantee that at least 6 get the same grade among A, B, C, D, F?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 2<sup>32</sup> = 4 294 967 296; 2 (alternating, starting with 0 or 1). 2) ⌊1000/7⌋ + ⌊1000/11⌋ − ⌊1000/77⌋ = 142 + 90 − 12 = 220. 3) ⌈N/5⌉ ≥ 6 ⇒ N = 26.</p></div>`,
  `<span class="eyebrow">MAD102 · Chương 7 · Bài 7.1</span>
<h2>Các quy tắc đếm cơ bản và nguyên lý chuồng bồ câu</h2>
<p class="lead">Một chính sách mật khẩu tạo ra bao nhiêu mật khẩu? Có bao nhiêu địa chỉ IP? Chương trình đi tới được bao nhiêu trạng thái? Phép đếm là nền của phân tích độ phức tạp, xác suất và ước lượng an ninh, và hầu như mọi thứ quy về bốn quy tắc đơn giản.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Áp dụng quy tắc nhân, cộng, trừ, chia và biết bài toán cần quy tắc nào.</li><li>Dùng phần bù (“ít nhất một”) để đếm gọn hơn.</li><li>Áp dụng nguyên lý chuồng bồ câu và dạng tổng quát.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Bốn quy tắc</span>Quy tắc nhân: việc làm qua hai giai đoạn có n<sub>1</sub> và n<sub>2</sub> cách ⇒ n<sub>1</sub>·n<sub>2</sub> cách.<br>Quy tắc cộng: việc làm theo một trong hai cách rời nhau ⇒ n<sub>1</sub> + n<sub>2</sub> cách.<br>Quy tắc trừ: |A ∪ B| = |A| + |B| − |A ∩ B|.<br>Quy tắc chia: nếu mỗi kết quả bị đếm đúng d lần thì chia cho d.</div>
<p>Quy tắc nhân đếm dãy: chuỗi bit độ dài n: 2<sup>n</sup>; hàm từ tập m phần tử vào tập n phần tử: n<sup>m</sup>; tập con của tập n phần tử: 2<sup>n</sup>. Quy tắc cộng đếm các phương án không thể xảy ra cùng lúc. Khi có thể chồng nhau thì trừ phần chồng. Quy tắc chia xử lý đối xứng: số cách xếp n người quanh bàn tròn là n!/n = (n − 1)! vì mỗi cách xếp bị đếm một lần cho mỗi phép xoay trong n phép xoay.</p>
<p><strong>Phần bù.</strong> “Ít nhất một” thường dễ hơn khi tính “tất cả trừ không có”. Mật khẩu độ dài 6 trên 36 ký hiệu (A–Z, 0–9) có ít nhất một chữ số: 36<sup>6</sup> − 26<sup>6</sup>.</p>
<div class="formula"><span class="lbl">Nguyên lý chuồng bồ câu</span>Nếu N đồ vật bỏ vào k hộp thì có hộp chứa ít nhất ⌈N/k⌉ đồ vật. Nói riêng, k + 1 đồ vật trong k hộp ⇒ có hộp chứa ≥ 2.</div>
<p>Chuồng bồ câu chứng minh sự tồn tại mà không cần tìm ra đối tượng: trong 367 người có hai người trùng ngày sinh; 6 số nguyên bất kỳ có hai số cùng số dư khi chia 5; mọi thuật toán nén không mất dữ liệu đều làm <em>dài thêm</em> một tệp nào đó (có 2<sup>n</sup> tệp độ dài n nhưng chỉ 2<sup>n</sup> − 1 xâu ngắn hơn); mọi hàm băm có nhiều đầu vào hơn đầu ra đều có va chạm.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — mật khẩu.</b> Độ dài 6, 7 hoặc 8; mỗi ký tự là chữ in hoa hoặc chữ số; có ít nhất một chữ số. Quy tắc cộng theo độ dài, phần bù trong từng độ dài: Σ<sub>k=6</sub><sup>8</sup> (36<sup>k</sup> − 26<sup>k</sup>) = 2 684 483 063 360.</p></div>
<div class="callout"><p><b>Ví dụ 2 — quy tắc trừ.</b> Chuỗi bit độ dài 8 bắt đầu bằng 1 <em>hoặc</em> kết thúc bằng 00: 2<sup>7</sup> + 2<sup>6</sup> − 2<sup>5</sup> = 128 + 64 − 32 = 160.</p></div>
<div class="callout"><p><b>Ví dụ 3 — chuồng bồ câu tổng quát.</b> Trong 100 người bất kỳ có ít nhất ⌈100/12⌉ = 9 người sinh cùng tháng.</p></div>
<pre><code class="language-python">from itertools import product

# passwords of length 6..8 over A-Z and 0-9 containing at least one digit
total = sum(36 ** k - 26 ** k for k in range(6, 9))
print(f"{total:,}")

# bit strings of length 8 that start with 1 OR end with 00
count = sum(1 for s in product("01", repeat=8) if s[0] == "1" or s[-2:] == ("0", "0"))
print(count, 2**7 + 2**6 - 2**5)

import math
print(math.ceil(100 / 12))   # generalized pigeonhole: 100 people, 12 months</code></pre>
<div class="out">2,684,483,063,360
160 160
9</div>
<div class="callout"><p><b>Ví dụ 4 — một chứng minh chuồng bồ câu.</b> Trong n + 1 số bất kỳ chọn từ {1, 2, …, 2n}, có một số chia hết số khác. Viết mỗi số dạng 2<sup>k</sup>·m với m lẻ; chỉ có n giá trị lẻ m ≤ 2n, nên hai số được chọn có chung m, và số nhỏ chia hết số lớn.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Cộng khi các giai đoạn diễn ra cùng nhau (phải nhân) hoặc nhân khi chúng là phương án thay thế (phải cộng).</li><li>Dùng quy tắc cộng cho các trường hợp chồng nhau — đếm trùng.</li><li>Đếm “ít nhất một chữ số” thành 10·36<sup>5</sup>: cách này đếm nhiều lần các xâu có nhiều chữ số.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>“Rồi” ⇒ nhân; “hoặc” (rời nhau) ⇒ cộng; chồng nhau ⇒ trừ.</li><li>Đếm thừa đối xứng ⇒ chia.</li><li>“Ít nhất một” ⇒ tổng trừ không có.</li><li>N đồ vật trong k hộp ⇒ có hộp chứa ⌈N/k⌉.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_counting-combine-outcomes.html" target="_blank" rel="noopener">Levin, DMOI 3.2 — Combining Outcomes</a></li><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_counting-non-disjoint.html" target="_blank" rel="noopener">Levin, DMOI 3.3 — Non-Disjoint Outcomes</a></li><li><a href="https://brilliant.org/wiki/pigeonhole-principle-definition/" target="_blank" rel="noopener">Brilliant — Pigeonhole Principle</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Có bao nhiêu địa chỉ IPv4 (chuỗi 32 bit)? Có bao nhiêu chuỗi 8 bit không có hai bit kề nhau bằng nhau?</li><li>Có bao nhiêu số nguyên dương ≤ 1000 chia hết cho 7 hoặc 11?</li><li>Lớp phải có bao nhiêu sinh viên để chắc chắn ít nhất 6 bạn cùng điểm chữ trong A, B, C, D, F?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 2<sup>32</sup> = 4 294 967 296; 2 (xen kẽ, bắt đầu bằng 0 hoặc 1). 2) ⌊1000/7⌋ + ⌊1000/11⌋ − ⌊1000/77⌋ = 142 + 90 − 12 = 220. 3) ⌈N/5⌉ ≥ 6 ⇒ N = 26.</p></div>`);

const c72 = L('mad102-ts-7-2',
  '7.2 — Permutations and combinations|||7.2 — Hoán vị và tổ hợp',
  'Chỉnh hợp P(n, r), tổ hợp C(n, r), khi nào thứ tự quan trọng, đối xứng C(n, r) = C(n, n − r), bài toán uỷ ban, ván bài poker, chuỗi bit có đúng k bit 1; itertools.permutations/combinations và math.comb/perm.',
  `<span class="eyebrow">MAD102 · Chapter 7 · Lesson 7.2</span>
<h2>Permutations and combinations</h2>
<p class="lead">Most counting problems ask how many ways to choose r things out of n, and the one question that decides the formula is: <strong>does the order matter?</strong> Ranking the top 3 of a contest is a permutation; picking a 3-person team is a combination.</p>
<h3>🎯 Objectives</h3>
<ul><li>Compute r-permutations P(n, r) and r-combinations C(n, r).</li><li>Decide between them by asking whether order matters.</li><li>Combine them with the product and sum rules for multi-step problems.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Formulas</span>P(n, r) = n(n − 1)…(n − r + 1) = n!/(n − r)!   (ordered, no repetition)<br>C(n, r) = n!/(r!(n − r)!) = P(n, r)/r!   (unordered, no repetition)</div>
<p>P(n, r) follows from the product rule: n choices for the first position, n − 1 for the second, and so on. C(n, r) follows from the division rule: each unordered selection of r objects corresponds to r! ordered ones. Conventions: 0! = 1, C(n, 0) = C(n, n) = 1.</p>
<p><strong>Symmetry:</strong> C(n, r) = C(n, n − r) — choosing the r to include is the same as choosing the n − r to exclude. C(n, r) is also the number of bit strings of length n with exactly r ones, and the number of lattice paths with r right-steps and n − r up-steps.</p>
<p>In code: Python's <code>math.perm</code>, <code>math.comb</code> compute the numbers; <code>itertools.permutations</code>, <code>itertools.combinations</code> generate the objects (useful for brute-force tests and for exhaustive search over small inputs).</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — order matters.</b> In a race with 8 runners, how many ways to award gold, silver, bronze? P(8, 3) = 8·7·6 = 336.</p></div>
<div class="callout"><p><b>Example 2 — order does not matter.</b> Poker hands: C(52, 5) = 2 598 960. Bit strings of length 10 with exactly three 1s: C(10, 3) = 120.</p></div>
<div class="callout"><p><b>Example 3 — product of choices.</b> A committee with 3 of 9 CS lecturers and 4 of 11 maths lecturers: C(9, 3)·C(11, 4) = 84·330 = 27 720.</p></div>
<div class="callout"><p><b>Example 4 — with a restriction.</b> How many 5-card hands contain at least one ace? Complement: C(52, 5) − C(48, 5) = 2 598 960 − 1 712 304 = 886 656. (The tempting 4·C(51, 4) over-counts hands with two or more aces.)</p></div>
<pre><code class="language-python">from itertools import permutations, combinations
from math import comb, perm, factorial

print(perm(5, 3), len(list(permutations("ABCDE", 3))))
print(comb(5, 3), len(list(combinations("ABCDE", 3))))
print(f"{comb(52, 5):,}")                         # poker hands
print(comb(10, 3))                                # bit strings length 10 with exactly three 1s
print(comb(9, 3) * comb(11, 4))                   # committee: 3 of 9 CS + 4 of 11 math
print(factorial(8) // factorial(8 - 3) == perm(8, 3))</code></pre>
<div class="out">60 60
10 10
2,598,960
120
27720
True</div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using P when order does not matter (counting each team r! times).</li><li>“Choose one special element first, then the rest” — this counts an answer once for each possible special element, unless the special role is real.</li><li>Forgetting that C(n, r) = 0 when r &gt; n.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Order matters, no repetition: P(n, r) = n!/(n − r)!.</li><li>Order does not matter: C(n, r) = n!/(r!(n − r)!).</li><li>C(n, r) = C(n, n − r) = number of n-bit strings with r ones.</li><li>Use complements for “at least one”; beware double counting.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_counting-combperm.html" target="_blank" rel="noopener">Levin, DMOI 3.4 — Combinations and Permutations</a></li><li><a href="https://brilliant.org/wiki/permutations/" target="_blank" rel="noopener">Brilliant — Permutations</a></li><li><a href="https://docs.python.org/3/library/itertools.html" target="_blank" rel="noopener">Python docs — itertools (permutations, combinations)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>How many ways can 10 students sit in a row of 10 chairs? In a circle?</li><li>How many 8-bit strings have at least 6 ones?</li><li>A class has 12 women and 10 men. How many 5-person teams have exactly 2 women?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 10! = 3 628 800; circle 9! = 362 880. 2) C(8, 6) + C(8, 7) + C(8, 8) = 28 + 8 + 1 = 37. 3) C(12, 2)·C(10, 3) = 66·120 = 7920.</p></div>`,
  `<span class="eyebrow">MAD102 · Chương 7 · Bài 7.2</span>
<h2>Hoán vị và tổ hợp</h2>
<p class="lead">Hầu hết bài đếm hỏi có bao nhiêu cách chọn r thứ trong n thứ, và câu hỏi duy nhất quyết định công thức là: <strong>thứ tự có quan trọng không?</strong> Xếp hạng 3 người đứng đầu cuộc thi là chỉnh hợp; chọn một đội 3 người là tổ hợp.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính chỉnh hợp chập r P(n, r) và tổ hợp chập r C(n, r).</li><li>Chọn giữa hai loại bằng câu hỏi thứ tự có quan trọng không.</li><li>Kết hợp chúng với quy tắc nhân, cộng cho bài nhiều bước.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Công thức</span>P(n, r) = n(n − 1)…(n − r + 1) = n!/(n − r)!   (có thứ tự, không lặp)<br>C(n, r) = n!/(r!(n − r)!) = P(n, r)/r!   (không thứ tự, không lặp)</div>
<p>P(n, r) suy từ quy tắc nhân: n lựa chọn cho vị trí đầu, n − 1 cho vị trí thứ hai, v.v. C(n, r) suy từ quy tắc chia: mỗi cách chọn không thứ tự r đối tượng ứng với r! cách có thứ tự. Quy ước: 0! = 1, C(n, 0) = C(n, n) = 1.</p>
<p><strong>Đối xứng:</strong> C(n, r) = C(n, n − r) — chọn r cái để lấy cũng là chọn n − r cái để bỏ. C(n, r) còn là số chuỗi bit độ dài n có đúng r bit 1, và số đường đi trên lưới gồm r bước sang phải và n − r bước lên.</p>
<p>Trong code: <code>math.perm</code>, <code>math.comb</code> của Python tính các con số; <code>itertools.permutations</code>, <code>itertools.combinations</code> sinh ra chính các đối tượng (hữu ích để kiểm vét cạn và tìm kiếm toàn bộ trên đầu vào nhỏ).</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — thứ tự quan trọng.</b> Cuộc đua 8 người, có bao nhiêu cách trao vàng, bạc, đồng? P(8, 3) = 8·7·6 = 336.</p></div>
<div class="callout"><p><b>Ví dụ 2 — thứ tự không quan trọng.</b> Số ván bài poker: C(52, 5) = 2 598 960. Chuỗi bit độ dài 10 có đúng ba bit 1: C(10, 3) = 120.</p></div>
<div class="callout"><p><b>Ví dụ 3 — tích các lựa chọn.</b> Hội đồng gồm 3 trong 9 giảng viên CNTT và 4 trong 11 giảng viên toán: C(9, 3)·C(11, 4) = 84·330 = 27 720.</p></div>
<div class="callout"><p><b>Ví dụ 4 — có ràng buộc.</b> Có bao nhiêu bộ 5 lá có ít nhất một quân át? Phần bù: C(52, 5) − C(48, 5) = 2 598 960 − 1 712 304 = 886 656. (Cách hấp dẫn 4·C(51, 4) đếm thừa các bộ có từ hai quân át.)</p></div>
<pre><code class="language-python">from itertools import permutations, combinations
from math import comb, perm, factorial

print(perm(5, 3), len(list(permutations("ABCDE", 3))))
print(comb(5, 3), len(list(combinations("ABCDE", 3))))
print(f"{comb(52, 5):,}")                         # poker hands
print(comb(10, 3))                                # bit strings length 10 with exactly three 1s
print(comb(9, 3) * comb(11, 4))                   # committee: 3 of 9 CS + 4 of 11 math
print(factorial(8) // factorial(8 - 3) == perm(8, 3))</code></pre>
<div class="out">60 60
10 10
2,598,960
120
27720
True</div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng P khi thứ tự không quan trọng (mỗi đội bị đếm r! lần).</li><li>“Chọn trước một phần tử đặc biệt, rồi chọn phần còn lại” — cách này đếm một đáp án nhiều lần theo số phần tử có thể làm “đặc biệt”, trừ khi vai trò đặc biệt là thật.</li><li>Quên rằng C(n, r) = 0 khi r &gt; n.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Có thứ tự, không lặp: P(n, r) = n!/(n − r)!.</li><li>Không thứ tự: C(n, r) = n!/(r!(n − r)!).</li><li>C(n, r) = C(n, n − r) = số chuỗi n bit có r bit 1.</li><li>Dùng phần bù cho “ít nhất một”; cẩn thận đếm trùng.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_counting-combperm.html" target="_blank" rel="noopener">Levin, DMOI 3.4 — Combinations and Permutations</a></li><li><a href="https://brilliant.org/wiki/permutations/" target="_blank" rel="noopener">Brilliant — Permutations</a></li><li><a href="https://docs.python.org/3/library/itertools.html" target="_blank" rel="noopener">Python docs — itertools (permutations, combinations)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>10 sinh viên ngồi một hàng 10 ghế có bao nhiêu cách? Ngồi quanh bàn tròn?</li><li>Có bao nhiêu chuỗi 8 bit có ít nhất 6 bit 1?</li><li>Lớp có 12 nữ và 10 nam. Có bao nhiêu đội 5 người có đúng 2 nữ?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 10! = 3 628 800; bàn tròn 9! = 362 880. 2) C(8, 6) + C(8, 7) + C(8, 8) = 28 + 8 + 1 = 37. 3) C(12, 2)·C(10, 3) = 66·120 = 7920.</p></div>`);

const c73 = L('mad102-ts-7-3',
  '7.3 — Binomial coefficients, Pascal’s triangle and combinatorial proofs|||7.3 — Hệ số nhị thức, tam giác Pascal và chứng minh tổ hợp',
  'Định lý nhị thức Newton, tìm hệ số, tam giác Pascal và hằng đẳng thức Pascal, tổng hàng 2ⁿ, đẳng thức Vandermonde, chứng minh tổ hợp bằng đếm hai cách; kiểm bằng Python.',
  `<span class="eyebrow">MAD102 · Chapter 7 · Lesson 7.3</span>
<h2>Binomial coefficients, Pascal’s triangle and combinatorial proofs</h2>
<p class="lead">The numbers C(n, k) appear as coefficients when expanding (x + y)<sup>n</sup>, which is why they are called binomial coefficients. Their identities can be proved by algebra, but the elegant way is a <strong>combinatorial proof</strong>: count the same set in two different ways.</p>
<h3>🎯 Objectives</h3>
<ul><li>Apply the binomial theorem to find coefficients and evaluate sums.</li><li>Build Pascal's triangle and prove Pascal's identity.</li><li>Write combinatorial (double-counting) proofs of identities such as Vandermonde's.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Binomial theorem</span>(x + y)<sup>n</sup> = Σ<sub>k=0</sub><sup>n</sup> C(n, k) x<sup>n−k</sup> y<sup>k</sup></div>
<p>Reason: expanding the product of n factors (x + y) means choosing x or y from each factor; the term x<sup>n−k</sup>y<sup>k</sup> appears once for each way to choose which k factors contribute y — C(n, k) ways.</p>
<p>Consequences: x = y = 1 gives Σ C(n, k) = 2<sup>n</sup> (subsets of an n-set); x = 1, y = −1 gives Σ (−1)<sup>k</sup>C(n, k) = 0 (as many even-size as odd-size subsets).</p>
<div class="formula"><span class="lbl">Pascal’s identity</span>C(n + 1, k) = C(n, k − 1) + C(n, k)</div>
<p><strong>Combinatorial proof:</strong> count k-subsets of {1, …, n + 1}. Those containing n + 1 are C(n, k − 1) (choose the other k − 1); those not containing it are C(n, k). Arranging the coefficients in rows gives <strong>Pascal's triangle</strong>, where each entry is the sum of the two above it — and a recursive, overflow-friendly way to compute C(n, k) by dynamic programming.</p>
<div class="formula"><span class="lbl">Vandermonde’s identity</span>C(m + n, r) = Σ<sub>k=0</sub><sup>r</sup> C(m, r − k)·C(n, k)</div>
<p>Proof: choose r people from m men and n women; split by the number k of women chosen. A <strong>combinatorial proof</strong> in general: (1) define a set, (2) count it one way to get the left side, (3) count it another way to get the right side. Both counts are correct, so they are equal.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1.</b> Coefficient of x<sup>5</sup>y<sup>8</sup> in (x + y)<sup>13</sup>: C(13, 8) = C(13, 5) = 1287.</p></div>
<div class="callout"><p><b>Example 2.</b> Coefficient of x<sup>12</sup>y<sup>13</sup> in (2x − 3y)<sup>25</sup>: the term is C(25, 13)(2x)<sup>12</sup>(−3y)<sup>13</sup>, so the coefficient is −C(25, 13)·2<sup>12</sup>·3<sup>13</sup> = −33 959 763 545 702 400.</p></div>
<div class="callout"><p><b>Example 3 — combinatorial proof.</b> Show k·C(n, k) = n·C(n − 1, k − 1). Count pairs (team of k, captain in the team): choose the team then the captain, k·C(n, k); or choose the captain first (n ways) then the other k − 1 members, n·C(n − 1, k − 1). ∎</p></div>
<pre><code class="language-python">from math import comb
print(comb(13, 5))                                       # coeff of x^5 y^8 in (x+y)^13
print(comb(25, 13) * 2**12 * (-3)**13)                   # coeff of x^12 y^13 in (2x-3y)^25
print([comb(6, k) for k in range(7)], sum(comb(6, k) for k in range(7)))
print(all(comb(n, k) == comb(n - 1, k - 1) + comb(n - 1, k)
          for n in range(1, 30) for k in range(1, n)))   # Pascal's identity
print(comb(10, 5), sum(comb(5, k) * comb(5, 5 - k) for k in range(6)))  # Vandermonde</code></pre>
<div class="out">1287
-33959763545702400
[1, 6, 15, 20, 15, 6, 1] 64
True
252 252</div>
<p>Row 6 of Pascal's triangle sums to 2<sup>6</sup> = 64; Pascal's identity holds for all n &lt; 30 checked; Vandermonde with m = n = r = 5 gives C(10, 5) = 252 = Σ C(5, k)<sup>2</sup>.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Forgetting the coefficients inside the brackets: the coefficient in (2x − 3y)<sup>n</sup> includes powers of 2 and −3.</li><li>Off-by-one in the exponent: the term with y<sup>k</sup> has x<sup>n−k</sup>.</li><li>In a combinatorial proof, counting two <em>different</em> sets.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>(x + y)<sup>n</sup> = Σ C(n, k)x<sup>n−k</sup>y<sup>k</sup>.</li><li>Row sums 2<sup>n</sup>; alternating sums 0.</li><li>Pascal: C(n + 1, k) = C(n, k − 1) + C(n, k).</li><li>Combinatorial proof = count one set two ways.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_counting-pascal.html" target="_blank" rel="noopener">Levin, DMOI 3.1 — Pascal’s Arithmetical Triangle</a></li><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_comb-proofs.html" target="_blank" rel="noopener">Levin, DMOI 3.6 — Combinatorial Proofs</a></li><li><a href="https://brilliant.org/wiki/binomial-theorem-n-choose-k/" target="_blank" rel="noopener">Brilliant — Binomial Theorem</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Find the coefficient of x<sup>3</sup> in (1 + 2x)<sup>7</sup>.</li><li>Evaluate Σ<sub>k=0</sub><sup>n</sup> C(n, k)2<sup>k</sup>.</li><li>Give a combinatorial proof that C(n, 2) + C(n + 1, 2) = n<sup>2</sup> (hint: count the ordered pairs (a, b) with a, b ∈ {1, …, n}).</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) C(7, 3)·2<sup>3</sup> = 35·8 = 280. 2) (1 + 2)<sup>n</sup> = 3<sup>n</sup>. 3) n<sup>2</sup> ordered pairs (a, b): pairs with a &lt; b are C(n, 2); pairs with a ≥ b correspond to 2-element multisets {a, b} with repetition, C(n + 1, 2). Algebraically n(n − 1)/2 + (n + 1)n/2 = n<sup>2</sup>.</p></div>`,
  `<span class="eyebrow">MAD102 · Chương 7 · Bài 7.3</span>
<h2>Hệ số nhị thức, tam giác Pascal và chứng minh tổ hợp</h2>
<p class="lead">Các số C(n, k) xuất hiện làm hệ số khi khai triển (x + y)<sup>n</sup>, nên gọi là hệ số nhị thức. Các đẳng thức của chúng chứng minh được bằng đại số, nhưng cách đẹp là <strong>chứng minh tổ hợp</strong>: đếm cùng một tập theo hai cách khác nhau.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Áp dụng định lý nhị thức để tìm hệ số và tính tổng.</li><li>Dựng tam giác Pascal và chứng minh hằng đẳng thức Pascal.</li><li>Viết chứng minh tổ hợp (đếm hai cách) cho các đẳng thức như Vandermonde.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Định lý nhị thức</span>(x + y)<sup>n</sup> = Σ<sub>k=0</sub><sup>n</sup> C(n, k) x<sup>n−k</sup> y<sup>k</sup></div>
<p>Lý do: khai triển tích n thừa số (x + y) là chọn x hoặc y từ mỗi thừa số; số hạng x<sup>n−k</sup>y<sup>k</sup> xuất hiện một lần cho mỗi cách chọn k thừa số đóng góp y — có C(n, k) cách.</p>
<p>Hệ quả: x = y = 1 cho Σ C(n, k) = 2<sup>n</sup> (số tập con của tập n phần tử); x = 1, y = −1 cho Σ (−1)<sup>k</sup>C(n, k) = 0 (số tập con cỡ chẵn bằng số tập con cỡ lẻ).</p>
<div class="formula"><span class="lbl">Hằng đẳng thức Pascal</span>C(n + 1, k) = C(n, k − 1) + C(n, k)</div>
<p><strong>Chứng minh tổ hợp:</strong> đếm tập con k phần tử của {1, …, n + 1}. Những tập chứa n + 1 có C(n, k − 1) (chọn k − 1 phần tử còn lại); những tập không chứa có C(n, k). Xếp các hệ số thành hàng được <strong>tam giác Pascal</strong>, mỗi số bằng tổng hai số ngay trên nó — đồng thời là cách đệ quy, ít tràn số để tính C(n, k) bằng quy hoạch động.</p>
<div class="formula"><span class="lbl">Đẳng thức Vandermonde</span>C(m + n, r) = Σ<sub>k=0</sub><sup>r</sup> C(m, r − k)·C(n, k)</div>
<p>Chứng minh: chọn r người từ m nam và n nữ; chia theo số nữ k được chọn. <strong>Chứng minh tổ hợp</strong> nói chung: (1) định nghĩa một tập, (2) đếm nó một cách để được vế trái, (3) đếm cách khác để được vế phải. Cả hai cách đếm đều đúng nên hai vế bằng nhau.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1.</b> Hệ số của x<sup>5</sup>y<sup>8</sup> trong (x + y)<sup>13</sup>: C(13, 8) = C(13, 5) = 1287.</p></div>
<div class="callout"><p><b>Ví dụ 2.</b> Hệ số của x<sup>12</sup>y<sup>13</sup> trong (2x − 3y)<sup>25</sup>: số hạng là C(25, 13)(2x)<sup>12</sup>(−3y)<sup>13</sup>, nên hệ số là −C(25, 13)·2<sup>12</sup>·3<sup>13</sup> = −33 959 763 545 702 400.</p></div>
<div class="callout"><p><b>Ví dụ 3 — chứng minh tổ hợp.</b> Chứng minh k·C(n, k) = n·C(n − 1, k − 1). Đếm các cặp (đội k người, đội trưởng trong đội): chọn đội rồi chọn đội trưởng, k·C(n, k); hoặc chọn đội trưởng trước (n cách) rồi k − 1 thành viên còn lại, n·C(n − 1, k − 1). ∎</p></div>
<pre><code class="language-python">from math import comb
print(comb(13, 5))                                       # coeff of x^5 y^8 in (x+y)^13
print(comb(25, 13) * 2**12 * (-3)**13)                   # coeff of x^12 y^13 in (2x-3y)^25
print([comb(6, k) for k in range(7)], sum(comb(6, k) for k in range(7)))
print(all(comb(n, k) == comb(n - 1, k - 1) + comb(n - 1, k)
          for n in range(1, 30) for k in range(1, n)))   # Pascal's identity
print(comb(10, 5), sum(comb(5, k) * comb(5, 5 - k) for k in range(6)))  # Vandermonde</code></pre>
<div class="out">1287
-33959763545702400
[1, 6, 15, 20, 15, 6, 1] 64
True
252 252</div>
<p>Hàng 6 của tam giác Pascal có tổng 2<sup>6</sup> = 64; hằng đẳng thức Pascal đúng với mọi n &lt; 30 đã kiểm; Vandermonde với m = n = r = 5 cho C(10, 5) = 252 = Σ C(5, k)<sup>2</sup>.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Quên hệ số bên trong ngoặc: hệ số trong (2x − 3y)<sup>n</sup> chứa lũy thừa của 2 và −3.</li><li>Lệch một ở số mũ: số hạng chứa y<sup>k</sup> có x<sup>n−k</sup>.</li><li>Trong chứng minh tổ hợp, đếm hai tập <em>khác nhau</em>.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>(x + y)<sup>n</sup> = Σ C(n, k)x<sup>n−k</sup>y<sup>k</sup>.</li><li>Tổng hàng 2<sup>n</sup>; tổng đan dấu 0.</li><li>Pascal: C(n + 1, k) = C(n, k − 1) + C(n, k).</li><li>Chứng minh tổ hợp = đếm một tập theo hai cách.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_counting-pascal.html" target="_blank" rel="noopener">Levin, DMOI 3.1 — Pascal’s Arithmetical Triangle</a></li><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_comb-proofs.html" target="_blank" rel="noopener">Levin, DMOI 3.6 — Combinatorial Proofs</a></li><li><a href="https://brilliant.org/wiki/binomial-theorem-n-choose-k/" target="_blank" rel="noopener">Brilliant — Binomial Theorem</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tìm hệ số của x<sup>3</sup> trong (1 + 2x)<sup>7</sup>.</li><li>Tính Σ<sub>k=0</sub><sup>n</sup> C(n, k)2<sup>k</sup>.</li><li>Chứng minh tổ hợp: C(n, 2) + C(n + 1, 2) = n<sup>2</sup> (gợi ý: đếm các cặp có thứ tự (a, b) với a, b ∈ {1, …, n}).</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) C(7, 3)·2<sup>3</sup> = 35·8 = 280. 2) (1 + 2)<sup>n</sup> = 3<sup>n</sup>. 3) Có n<sup>2</sup> cặp có thứ tự (a, b): cặp có a &lt; b là C(n, 2); cặp có a ≥ b ứng với đa tập 2 phần tử {a, b} cho phép lặp, C(n + 1, 2). Về đại số n(n − 1)/2 + (n + 1)n/2 = n<sup>2</sup>.</p></div>`);

const c74 = L('mad102-ts-7-4',
  '7.4 — Counting with repetition: stars and bars, multinomials|||7.4 — Đếm có lặp: chia kẹo (stars and bars), hệ số đa thức',
  'Chỉnh hợp lặp nʳ, tổ hợp lặp C(n + r − 1, r) bằng phương pháp “sao và vạch”, nghiệm nguyên không âm của x₁ + … + xₙ = r có ràng buộc dưới, hoán vị có phần tử giống nhau (MISSISSIPPI), phân phối vật vào hộp.',
  `<span class="eyebrow">MAD102 · Chapter 7 · Lesson 7.4</span>
<h2>Counting with repetition: stars and bars, multinomials</h2>
<p class="lead">Many real counts allow repetition: choosing 6 drinks from 4 kinds, distributing identical tasks to servers, counting non-negative integer solutions of an equation, or anagrams of a word with repeated letters. Two formulas cover almost all of them.</p>
<h3>🎯 Objectives</h3>
<ul><li>Distinguish the four cases: ordered/unordered × with/without repetition.</li><li>Count multisets and integer solutions with stars and bars, including lower bounds.</li><li>Count arrangements of objects with repeated types (multinomial coefficients).</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">The four cases (choose r from n types)</span>ordered, no repetition: P(n, r)   ordered, repetition: n<sup>r</sup><br>unordered, no repetition: C(n, r)   unordered, repetition: C(n + r − 1, r)</div>
<p><strong>Stars and bars.</strong> An unordered selection of r objects from n types with repetition is a sequence of r stars and n − 1 bars: the bars split the stars into n groups (one per type). Choosing the positions of the r stars among n + r − 1 places gives C(n + r − 1, r) = C(n + r − 1, n − 1). The same count is the number of <strong>non-negative integer solutions</strong> of x<sub>1</sub> + x<sub>2</sub> + … + x<sub>n</sub> = r.</p>
<p><strong>Lower bounds</strong> are removed by substitution: if x<sub>i</sub> ≥ a<sub>i</sub>, set y<sub>i</sub> = x<sub>i</sub> − a<sub>i</sub> ≥ 0 and solve y<sub>1</sub> + … + y<sub>n</sub> = r − Σa<sub>i</sub>. <strong>Upper bounds</strong> need inclusion–exclusion or generating functions (Chapter 8).</p>
<div class="formula"><span class="lbl">Permutations with indistinguishable objects</span>n objects with n<sub>1</sub> of type 1, …, n<sub>k</sub> of type k: n!/(n<sub>1</sub>! n<sub>2</sub>! … n<sub>k</sub>!)</div>
<p>This multinomial coefficient also counts the ways to put n distinguishable objects into k distinguishable boxes with n<sub>i</sub> objects in box i, and it is the coefficient in the multinomial theorem (x<sub>1</sub> + … + x<sub>k</sub>)<sup>n</sup>.</p>
<p><strong>Distributing objects into boxes.</strong> Distinguishable objects into distinguishable boxes: k<sup>n</sup>. Indistinguishable objects into distinguishable boxes: stars and bars. (Indistinguishable boxes lead to Stirling and partition numbers — beyond this course.)</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1.</b> Non-negative solutions of x<sub>1</sub> + x<sub>2</sub> + x<sub>3</sub> = 11: C(13, 2) = 78. With x<sub>1</sub> ≥ 1, x<sub>2</sub> ≥ 2, x<sub>3</sub> ≥ 3: y-sum = 11 − 6 = 5, C(7, 2) = 21.</p></div>
<div class="callout"><p><b>Example 2.</b> Choose 6 cookies from 4 kinds (repetition allowed, order irrelevant): C(4 + 6 − 1, 6) = C(9, 6) = 84.</p></div>
<div class="callout"><p><b>Example 3.</b> Anagrams of MISSISSIPPI (1 M, 4 I, 4 S, 2 P): 11!/(1!·4!·4!·2!) = 34 650.</p></div>
<pre><code class="language-python">from math import comb, factorial
from itertools import product

print(comb(13, 2), sum(1 for x in range(12) for y in range(12) if 11 - x - y &gt;= 0))
print(comb(7, 2), sum(1 for x1, x2 in product(range(12), repeat=2)
                       if x1 &gt;= 1 and x2 &gt;= 2 and 11 - x1 - x2 &gt;= 3))
print(factorial(11) // (factorial(1) * factorial(4) * factorial(4) * factorial(2)))  # MISSISSIPPI
print(comb(4 + 6 - 1, 6))      # choose 6 cookies from 4 kinds
print(5 ** 3)                  # 3-letter strings over 5 letters (repetition allowed)</code></pre>
<div class="out">78 78
21 21
34650
84
125</div>
<p>The first two lines compare the formula with a direct enumeration of all solutions; they agree.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using C(n, r) when repetition is allowed (6 cookies from 4 kinds is impossible without repetition, yet the answer is 84).</li><li>Mixing up n and r in C(n + r − 1, r): n is the number of types (boxes), r the number of items (stars).</li><li>Forgetting to subtract the lower bounds before applying stars and bars.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Ordered with repetition n<sup>r</sup>; unordered with repetition C(n + r − 1, r).</li><li>Solutions of x<sub>1</sub> + … + x<sub>n</sub> = r in non-negative integers: C(n + r − 1, n − 1).</li><li>Lower bounds: substitute y<sub>i</sub> = x<sub>i</sub> − a<sub>i</sub>.</li><li>Words with repeated letters: n!/(n<sub>1</sub>!…n<sub>k</sub>!).</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_counting-multisets.html" target="_blank" rel="noopener">Levin, DMOI 3.5 — Counting Multisets</a></li><li><a href="https://cp-algorithms.com/combinatorics/stars_and_bars.html" target="_blank" rel="noopener">cp-algorithms — Stars and bars</a></li><li><a href="https://brilliant.org/wiki/stars-and-bars/" target="_blank" rel="noopener">Brilliant — Integer Equations: Stars and Bars</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>How many ways to distribute 10 identical tasks to 4 servers? If every server must get at least one?</li><li>How many strings of length 7 use the letters of “BANANAS” exactly?</li><li>How many 4-digit strings (0000–9999) have digits that sum to 9?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) C(13, 3) = 286; at least one each: C(9, 3) = 84. 2) 7!/(1!·3!·2!·1!) = 420. 3) C(9 + 3, 3) = C(12, 3) = 220 (no digit can exceed 9, so no upper bound is violated).</p></div>`,
  `<span class="eyebrow">MAD102 · Chương 7 · Bài 7.4</span>
<h2>Đếm có lặp: chia kẹo (stars and bars), hệ số đa thức</h2>
<p class="lead">Nhiều phép đếm thực tế cho phép lặp: chọn 6 đồ uống từ 4 loại, chia các tác vụ giống nhau cho các máy chủ, đếm nghiệm nguyên không âm của một phương trình, hoặc đếm hoán vị chữ của một từ có chữ lặp. Hai công thức bao quát gần hết các trường hợp đó.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phân biệt bốn trường hợp: có/không thứ tự × có/không lặp.</li><li>Đếm đa tập và nghiệm nguyên bằng “sao và vạch”, kể cả ràng buộc dưới.</li><li>Đếm cách sắp xếp đối tượng có các loại lặp (hệ số đa thức).</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Bốn trường hợp (chọn r từ n loại)</span>có thứ tự, không lặp: P(n, r)   có thứ tự, có lặp: n<sup>r</sup><br>không thứ tự, không lặp: C(n, r)   không thứ tự, có lặp: C(n + r − 1, r)</div>
<p><strong>Sao và vạch.</strong> Một cách chọn không thứ tự r đối tượng từ n loại có lặp là một dãy r ngôi sao và n − 1 vạch: các vạch chia các sao thành n nhóm (mỗi loại một nhóm). Chọn vị trí của r sao trong n + r − 1 chỗ cho C(n + r − 1, r) = C(n + r − 1, n − 1). Cũng con số đó là số <strong>nghiệm nguyên không âm</strong> của x<sub>1</sub> + x<sub>2</sub> + … + x<sub>n</sub> = r.</p>
<p><strong>Ràng buộc dưới</strong> khử bằng phép đổi biến: nếu x<sub>i</sub> ≥ a<sub>i</sub>, đặt y<sub>i</sub> = x<sub>i</sub> − a<sub>i</sub> ≥ 0 và giải y<sub>1</sub> + … + y<sub>n</sub> = r − Σa<sub>i</sub>. <strong>Ràng buộc trên</strong> cần bao hàm – loại trừ hoặc hàm sinh (Chương 8).</p>
<div class="formula"><span class="lbl">Hoán vị có đối tượng giống nhau</span>n đối tượng gồm n<sub>1</sub> cái loại 1, …, n<sub>k</sub> cái loại k: n!/(n<sub>1</sub>! n<sub>2</sub>! … n<sub>k</sub>!)</div>
<p>Hệ số đa thức này cũng đếm số cách bỏ n đối tượng phân biệt vào k hộp phân biệt sao cho hộp i có n<sub>i</sub> đối tượng, và là hệ số trong định lý đa thức (x<sub>1</sub> + … + x<sub>k</sub>)<sup>n</sup>.</p>
<p><strong>Phân phối vật vào hộp.</strong> Vật phân biệt vào hộp phân biệt: k<sup>n</sup>. Vật giống nhau vào hộp phân biệt: sao và vạch. (Hộp giống nhau dẫn tới số Stirling và số phân hoạch — ngoài phạm vi môn.)</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1.</b> Số nghiệm không âm của x<sub>1</sub> + x<sub>2</sub> + x<sub>3</sub> = 11: C(13, 2) = 78. Với x<sub>1</sub> ≥ 1, x<sub>2</sub> ≥ 2, x<sub>3</sub> ≥ 3: tổng các y = 11 − 6 = 5, C(7, 2) = 21.</p></div>
<div class="callout"><p><b>Ví dụ 2.</b> Chọn 6 chiếc bánh từ 4 loại (được lặp, không thứ tự): C(4 + 6 − 1, 6) = C(9, 6) = 84.</p></div>
<div class="callout"><p><b>Ví dụ 3.</b> Hoán vị chữ của MISSISSIPPI (1 M, 4 I, 4 S, 2 P): 11!/(1!·4!·4!·2!) = 34 650.</p></div>
<pre><code class="language-python">from math import comb, factorial
from itertools import product

print(comb(13, 2), sum(1 for x in range(12) for y in range(12) if 11 - x - y &gt;= 0))
print(comb(7, 2), sum(1 for x1, x2 in product(range(12), repeat=2)
                       if x1 &gt;= 1 and x2 &gt;= 2 and 11 - x1 - x2 &gt;= 3))
print(factorial(11) // (factorial(1) * factorial(4) * factorial(4) * factorial(2)))  # MISSISSIPPI
print(comb(4 + 6 - 1, 6))      # choose 6 cookies from 4 kinds
print(5 ** 3)                  # 3-letter strings over 5 letters (repetition allowed)</code></pre>
<div class="out">78 78
21 21
34650
84
125</div>
<p>Hai dòng đầu so công thức với liệt kê trực tiếp mọi nghiệm; chúng khớp.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng C(n, r) khi được lặp (chọn 6 bánh từ 4 loại là bất khả nếu không lặp, vậy mà đáp án là 84).</li><li>Nhầm n với r trong C(n + r − 1, r): n là số loại (hộp), r là số vật (sao).</li><li>Quên trừ ràng buộc dưới trước khi dùng sao và vạch.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Có thứ tự, có lặp n<sup>r</sup>; không thứ tự, có lặp C(n + r − 1, r).</li><li>Số nghiệm nguyên không âm của x<sub>1</sub> + … + x<sub>n</sub> = r: C(n + r − 1, n − 1).</li><li>Ràng buộc dưới: đổi biến y<sub>i</sub> = x<sub>i</sub> − a<sub>i</sub>.</li><li>Từ có chữ lặp: n!/(n<sub>1</sub>!…n<sub>k</sub>!).</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_counting-multisets.html" target="_blank" rel="noopener">Levin, DMOI 3.5 — Counting Multisets</a></li><li><a href="https://cp-algorithms.com/combinatorics/stars_and_bars.html" target="_blank" rel="noopener">cp-algorithms — Stars and bars</a></li><li><a href="https://brilliant.org/wiki/stars-and-bars/" target="_blank" rel="noopener">Brilliant — Integer Equations: Stars and Bars</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Có bao nhiêu cách chia 10 tác vụ giống nhau cho 4 máy chủ? Nếu máy nào cũng phải nhận ít nhất một?</li><li>Có bao nhiêu xâu độ dài 7 dùng đúng các chữ của “BANANAS”?</li><li>Có bao nhiêu xâu 4 chữ số (0000–9999) có tổng các chữ số bằng 9?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) C(13, 3) = 286; mỗi máy ít nhất một: C(9, 3) = 84. 2) 7!/(1!·3!·2!·1!) = 420. 3) C(9 + 3, 3) = C(12, 3) = 220 (không chữ số nào vượt 9 nên không vi phạm ràng buộc trên).</p></div>`);

const q7 = QZ(7, 'Quiz — Chapter 7: Counting|||Quiz — Chương 7: Phép đếm', 'Kiểm tra chương 7: quy tắc nhân/cộng/trừ, chuồng bồ câu, chỉnh hợp, tổ hợp, nhị thức Newton, Pascal, sao và vạch, hoán vị có lặp.', [
  Q('q1', 'How many 8-bit strings start with 1 or end with 00?|||Có bao nhiêu chuỗi 8 bit bắt đầu bằng 1 hoặc kết thúc bằng 00?',
    ['192|||192', '160|||160', '128|||128', '96|||96'], 1,
    '2⁷ + 2⁶ − 2⁵ = 160.|||2⁷ + 2⁶ − 2⁵ = 160.'),
  Q('q2', 'Minimum number of people guaranteeing 9 born in the same month:|||Số người tối thiểu bảo đảm có 9 người sinh cùng tháng:',
    ['97|||97', '100|||100', '108|||108', '109|||109'], 0,
    'Need ⌈N/12⌉ ≥ 9, i.e. N ≥ 12·8 + 1 = 97.|||Cần ⌈N/12⌉ ≥ 9, tức N ≥ 12·8 + 1 = 97.'),
  Q('q3', 'Ways to award gold, silver and bronze among 8 runners:|||Số cách trao vàng, bạc, đồng cho 8 vận động viên:',
    ['56|||56', '336|||336', '512|||512', '24|||24'], 1,
    'Order matters: P(8, 3) = 336.|||Thứ tự quan trọng: P(8, 3) = 336.'),
  Q('q4', 'Number of 5-card hands from a 52-card deck:|||Số bộ 5 lá từ bộ bài 52 lá:',
    ['311875200|||311875200', '2598960|||2598960', '380204032|||380204032', '1712304|||1712304'], 1,
    'C(52, 5) = 2 598 960.|||C(52, 5) = 2 598 960.'),
  Q('q5', 'Coefficient of x⁵y⁸ in (x + y)¹³:|||Hệ số của x⁵y⁸ trong (x + y)¹³:',
    ['13|||13', '1287|||1287', '40|||40', '8192|||8192'], 1,
    'C(13, 5) = 1287.|||C(13, 5) = 1287.'),
  Q('q6', 'Σ over k of C(n, k) equals|||Tổng C(n, k) theo k bằng',
    ['n!|||n!', '2ⁿ|||2ⁿ', 'n²|||n²', '0|||0'], 1,
    'Binomial theorem with x = y = 1 (number of subsets).|||Định lý nhị thức với x = y = 1 (số tập con).'),
  Q('q7', 'Non-negative integer solutions of x₁ + x₂ + x₃ = 11:|||Số nghiệm nguyên không âm của x₁ + x₂ + x₃ = 11:',
    ['55|||55', '66|||66', '78|||78', '1331|||1331'], 2,
    'Stars and bars: C(13, 2) = 78.|||Sao và vạch: C(13, 2) = 78.'),
  Q('q8', 'Distinct arrangements of the letters of MISSISSIPPI:|||Số cách sắp xếp các chữ của MISSISSIPPI:',
    ['39916800|||39916800', '34650|||34650', '462|||462', '69300|||69300'], 1,
    '11!/(1!4!4!2!) = 34 650.|||11!/(1!4!4!2!) = 34 650.'),
  Q('q9', 'Pascal’s identity states C(n + 1, k) =|||Hằng đẳng thức Pascal: C(n + 1, k) =',
    ['C(n, k) + C(n, k + 1)|||C(n, k) + C(n, k + 1)', 'C(n, k − 1) + C(n, k)|||C(n, k − 1) + C(n, k)', 'C(n, k)·(n + 1)|||C(n, k)·(n + 1)', 'C(n + 1, n − k)·2|||C(n + 1, n − k)·2'], 1,
    'Split k-subsets by whether they contain element n + 1.|||Chia các tập con k phần tử theo việc có chứa phần tử n + 1 hay không.'),
]);

const ch7 = {
  title: 'Chapter 7 — Counting: rules, permutations, combinations, binomials|||Chương 7 — Phép đếm: quy tắc, hoán vị, tổ hợp, nhị thức',
  description: 'Quy tắc nhân/cộng/trừ/chia, chuồng bồ câu, chỉnh hợp và tổ hợp, định lý nhị thức, tam giác Pascal, chứng minh tổ hợp, đếm có lặp (sao và vạch, hoán vị lặp) — kiểm vét cạn bằng Python (Rosen ch. 6 · MCS ch. 15).',
  lessons: [c71, c72, c73, c74, q7],
};

// ───────────────────────────── Chương 8 — Truy hồi & đếm nâng cao ─────────────────────────────
const c81 = L('mad102-ts-8-1',
  '8.1 — Modelling with recurrence relations|||8.1 — Mô hình hoá bằng hệ thức truy hồi',
  'Hệ thức truy hồi và điều kiện đầu, lập truy hồi cho tháp Hà Nội, chuỗi bit không có hai số 0 liền nhau, lãi kép, đếm đệ quy; giải bằng lặp và đoán – chứng minh; đệ quy có nhớ (memoization) trong Python.',
  `<span class="eyebrow">MAD102 · Chapter 8 · Lesson 8.1</span>
<h2>Modelling with recurrence relations</h2>
<p class="lead">Many counting problems are hard to solve directly but easy to describe in terms of smaller instances of themselves. That description is a <strong>recurrence relation</strong>, and it is also exactly how recursive programs and dynamic programming work.</p>
<h3>🎯 Objectives</h3>
<ul><li>Set up a recurrence with the right initial conditions from a word problem.</li><li>Solve simple recurrences by iteration (unrolling) and confirm with induction.</li><li>Compute recurrences efficiently with memoization and check counts by brute force.</li></ul>
<h3>📖 Lecture</h3>
<p>A <strong>recurrence relation</strong> for a sequence (a<sub>n</sub>) expresses a<sub>n</sub> in terms of earlier terms, for all n ≥ some n<sub>0</sub>; together with <strong>initial conditions</strong> it determines the sequence uniquely. A <strong>solution</strong> is a closed formula for a<sub>n</sub>.</p>
<p><strong>The modelling recipe:</strong> (1) define a<sub>n</sub> precisely in words; (2) look at the last (or first) step of an object of size n and split into cases; (3) each case is a smaller instance — write its count in terms of a<sub>n−1</sub>, a<sub>n−2</sub>, …; (4) find enough initial values by hand.</p>
<ul>
<li><strong>Compound interest:</strong> P<sub>n</sub> = 1.05·P<sub>n−1</sub>, P<sub>0</sub> = 10 000 000 VND ⇒ P<sub>n</sub> = 1.05<sup>n</sup>·P<sub>0</sub>.</li>
<li><strong>Tower of Hanoi:</strong> to move n discs, move the top n − 1 to the spare peg, move the largest, then move n − 1 on top: H<sub>n</sub> = 2H<sub>n−1</sub> + 1, H<sub>1</sub> = 1. Unrolling: H<sub>n</sub> = 2<sup>n−1</sup> + … + 2 + 1 = 2<sup>n</sup> − 1. With 64 discs and one move per second this is about 5.8·10<sup>11</sup> years.</li>
<li><strong>Bit strings of length n without two consecutive 0s:</strong> such a string ends in 1 (preceded by any valid string of length n − 1) or in 10 (preceded by any valid string of length n − 2). So a<sub>n</sub> = a<sub>n−1</sub> + a<sub>n−2</sub>, a<sub>1</sub> = 2, a<sub>2</sub> = 3 — the Fibonacci numbers shifted: a<sub>n</sub> = f<sub>n+2</sub>.</li>
<li><strong>Codewords:</strong> decimal strings of length n with an even number of 0s: a<sub>n</sub> = 9a<sub>n−1</sub> + (10<sup>n−1</sup> − a<sub>n−1</sub>) = 8a<sub>n−1</sub> + 10<sup>n−1</sup>, a<sub>1</sub> = 9.</li>
</ul>
<p><strong>Iteration</strong> (unrolling) substitutes the recurrence into itself until a pattern appears; then prove the guess by induction. It works well for first-order recurrences; Lessons 8.2–8.3 give systematic methods for the rest.</p>
<p><strong>Computing.</strong> A naive recursive implementation of a<sub>n</sub> = a<sub>n−1</sub> + a<sub>n−2</sub> makes about φ<sup>n</sup> calls (φ ≈ 1.618). Memoization (caching each value) or a bottom-up loop makes it O(n) — this is dynamic programming.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — iteration.</b> a<sub>n</sub> = a<sub>n−1</sub> + 3, a<sub>0</sub> = 2: a<sub>n</sub> = a<sub>n−2</sub> + 2·3 = … = a<sub>0</sub> + 3n = 3n + 2.</p></div>
<div class="callout"><p><b>Example 2 — check by machine.</b> Hanoi move counts against 2<sup>n</sup> − 1, the actual move list for n = 3, and the no-“00” recurrence against brute force:</p></div>
<pre><code class="language-python">from functools import lru_cache
from itertools import product

def hanoi(n, src="A", aux="B", dst="C", moves=None):
    if moves is None:
        moves = []
    if n &gt; 0:
        hanoi(n - 1, src, dst, aux, moves)
        moves.append((src, dst))
        hanoi(n - 1, aux, src, dst, moves)
    return moves

print([len(hanoi(n)) for n in range(1, 8)], [2**n - 1 for n in range(1, 8)])
print(hanoi(3))

@lru_cache(maxsize=None)
def a(n):            # bit strings of length n with no two consecutive 0s
    return {1: 2, 2: 3}.get(n) or a(n - 1) + a(n - 2)

brute = lambda n: sum(1 for s in product("01", repeat=n) if "00" not in "".join(s))
print([a(n) for n in range(1, 11)])
print([brute(n) for n in range(1, 11)])</code></pre>
<div class="out">[1, 3, 7, 15, 31, 63, 127] [1, 3, 7, 15, 31, 63, 127]
[('A', 'C'), ('A', 'B'), ('C', 'B'), ('A', 'C'), ('B', 'A'), ('B', 'C'), ('A', 'C')]
[2, 3, 5, 8, 13, 21, 34, 55, 89, 144]
[2, 3, 5, 8, 13, 21, 34, 55, 89, 144]</div>
<p>The recurrence and the brute-force count agree for n = 1, …, 10 — strong evidence that the case analysis is right, and the case analysis itself is the proof.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Cases that overlap or miss objects (e.g. splitting by the last bit without checking what may precede a 0).</li><li>Too few initial conditions for a second-order recurrence.</li><li>Implementing a recurrence with plain recursion and getting exponential running time.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Recurrence + initial conditions determine a sequence.</li><li>Model by splitting on the last step; each case is a smaller instance.</li><li>Hanoi: H<sub>n</sub> = 2H<sub>n−1</sub> + 1 = 2<sup>n</sup> − 1; no “00”: Fibonacci.</li><li>Memoize or iterate bottom-up to compute in O(n).</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://brilliant.org/wiki/recurrence-relations/" target="_blank" rel="noopener">Brilliant — Recurrence Relations</a></li><li><a href="https://en.wikipedia.org/wiki/Tower_of_Hanoi" target="_blank" rel="noopener">Wikipedia — Tower of Hanoi</a></li><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_seq_intro.html" target="_blank" rel="noopener">Levin, DMOI 4.1 — Describing Sequences (recursive definitions)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Find a recurrence for the number of ways to climb n stairs taking 1 or 2 steps at a time. How many ways for n = 6?</li><li>Find a recurrence for the number of bit strings of length n containing “00”.</li><li>Solve a<sub>n</sub> = 2a<sub>n−1</sub>, a<sub>0</sub> = 5 by iteration.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) s<sub>n</sub> = s<sub>n−1</sub> + s<sub>n−2</sub>, s<sub>1</sub> = 1, s<sub>2</sub> = 2; s<sub>6</sub> = 13. 2) b<sub>n</sub> = b<sub>n−1</sub> + b<sub>n−2</sub> + 2<sup>n−2</sup> (ends in 1; ends in 10; ends in 00 — any prefix), b<sub>1</sub> = 0, b<sub>2</sub> = 1; equivalently b<sub>n</sub> = 2<sup>n</sup> − a<sub>n</sub>. 3) a<sub>n</sub> = 5·2<sup>n</sup>.</p></div>`,
  `<span class="eyebrow">MAD102 · Chương 8 · Bài 8.1</span>
<h2>Mô hình hoá bằng hệ thức truy hồi</h2>
<p class="lead">Nhiều bài đếm khó giải trực tiếp nhưng dễ mô tả qua các trường hợp nhỏ hơn của chính nó. Mô tả đó là <strong>hệ thức truy hồi</strong>, và đó cũng chính là cách chương trình đệ quy và quy hoạch động hoạt động.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Lập hệ thức truy hồi với điều kiện đầu đúng từ bài toán lời văn.</li><li>Giải truy hồi đơn giản bằng phép lặp (khai triển) và khẳng định bằng quy nạp.</li><li>Tính truy hồi hiệu quả bằng đệ quy có nhớ và kiểm số đếm bằng vét cạn.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Hệ thức truy hồi</strong> của dãy (a<sub>n</sub>) biểu diễn a<sub>n</sub> theo các số hạng trước, với mọi n ≥ n<sub>0</sub> nào đó; cùng với <strong>điều kiện đầu</strong> nó xác định duy nhất dãy. <strong>Nghiệm</strong> là một công thức dạng đóng cho a<sub>n</sub>.</p>
<p><strong>Công thức lập mô hình:</strong> (1) định nghĩa a<sub>n</sub> chính xác bằng lời; (2) nhìn bước cuối (hoặc đầu) của một đối tượng cỡ n và chia trường hợp; (3) mỗi trường hợp là một bài nhỏ hơn — viết số đếm của nó theo a<sub>n−1</sub>, a<sub>n−2</sub>, …; (4) tính tay đủ số giá trị đầu.</p>
<ul>
<li><strong>Lãi kép:</strong> P<sub>n</sub> = 1,05·P<sub>n−1</sub>, P<sub>0</sub> = 10 000 000 đồng ⇒ P<sub>n</sub> = 1,05<sup>n</sup>·P<sub>0</sub>.</li>
<li><strong>Tháp Hà Nội:</strong> để chuyển n đĩa, chuyển n − 1 đĩa trên sang cọc trung gian, chuyển đĩa lớn nhất, rồi chuyển n − 1 đĩa lên trên: H<sub>n</sub> = 2H<sub>n−1</sub> + 1, H<sub>1</sub> = 1. Khai triển: H<sub>n</sub> = 2<sup>n−1</sup> + … + 2 + 1 = 2<sup>n</sup> − 1. Với 64 đĩa, mỗi giây một nước, mất khoảng 5,8·10<sup>11</sup> năm.</li>
<li><strong>Chuỗi bit độ dài n không có hai số 0 liền nhau:</strong> chuỗi như vậy kết thúc bằng 1 (đứng trước là chuỗi hợp lệ độ dài n − 1 bất kỳ) hoặc bằng 10 (đứng trước là chuỗi hợp lệ độ dài n − 2 bất kỳ). Vậy a<sub>n</sub> = a<sub>n−1</sub> + a<sub>n−2</sub>, a<sub>1</sub> = 2, a<sub>2</sub> = 3 — dãy Fibonacci dịch chỉ số: a<sub>n</sub> = f<sub>n+2</sub>.</li>
<li><strong>Từ mã:</strong> xâu thập phân độ dài n có số chữ số 0 chẵn: a<sub>n</sub> = 9a<sub>n−1</sub> + (10<sup>n−1</sup> − a<sub>n−1</sub>) = 8a<sub>n−1</sub> + 10<sup>n−1</sup>, a<sub>1</sub> = 9.</li>
</ul>
<p><strong>Phép lặp</strong> (khai triển) thế hệ thức vào chính nó tới khi lộ ra quy luật; rồi chứng minh dự đoán bằng quy nạp. Cách này tốt cho truy hồi cấp một; Bài 8.2–8.3 cho phương pháp hệ thống cho phần còn lại.</p>
<p><strong>Tính toán.</strong> Cài đặt đệ quy ngây thơ của a<sub>n</sub> = a<sub>n−1</sub> + a<sub>n−2</sub> gọi khoảng φ<sup>n</sup> lần (φ ≈ 1,618). Đệ quy có nhớ (lưu mỗi giá trị) hoặc vòng lặp từ dưới lên đưa về O(n) — đó là quy hoạch động.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — phép lặp.</b> a<sub>n</sub> = a<sub>n−1</sub> + 3, a<sub>0</sub> = 2: a<sub>n</sub> = a<sub>n−2</sub> + 2·3 = … = a<sub>0</sub> + 3n = 3n + 2.</p></div>
<div class="callout"><p><b>Ví dụ 2 — kiểm bằng máy.</b> Số nước tháp Hà Nội so với 2<sup>n</sup> − 1, danh sách nước đi thật với n = 3, và truy hồi “không 00” so với vét cạn:</p></div>
<pre><code class="language-python">from functools import lru_cache
from itertools import product

def hanoi(n, src="A", aux="B", dst="C", moves=None):
    if moves is None:
        moves = []
    if n &gt; 0:
        hanoi(n - 1, src, dst, aux, moves)
        moves.append((src, dst))
        hanoi(n - 1, aux, src, dst, moves)
    return moves

print([len(hanoi(n)) for n in range(1, 8)], [2**n - 1 for n in range(1, 8)])
print(hanoi(3))

@lru_cache(maxsize=None)
def a(n):            # bit strings of length n with no two consecutive 0s
    return {1: 2, 2: 3}.get(n) or a(n - 1) + a(n - 2)

brute = lambda n: sum(1 for s in product("01", repeat=n) if "00" not in "".join(s))
print([a(n) for n in range(1, 11)])
print([brute(n) for n in range(1, 11)])</code></pre>
<div class="out">[1, 3, 7, 15, 31, 63, 127] [1, 3, 7, 15, 31, 63, 127]
[('A', 'C'), ('A', 'B'), ('C', 'B'), ('A', 'C'), ('B', 'A'), ('B', 'C'), ('A', 'C')]
[2, 3, 5, 8, 13, 21, 34, 55, 89, 144]
[2, 3, 5, 8, 13, 21, 34, 55, 89, 144]</div>
<p>Truy hồi và phép đếm vét cạn khớp với n = 1, …, 10 — bằng chứng mạnh rằng phân tích trường hợp là đúng, và chính phân tích trường hợp là chứng minh.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Các trường hợp chồng nhau hoặc bỏ sót đối tượng (vd chia theo bit cuối mà không kiểm cái gì được đứng trước số 0).</li><li>Thiếu điều kiện đầu cho truy hồi cấp hai.</li><li>Cài truy hồi bằng đệ quy thuần và bị thời gian chạy mũ.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Truy hồi + điều kiện đầu xác định dãy.</li><li>Lập mô hình bằng cách chia theo bước cuối; mỗi trường hợp là bài nhỏ hơn.</li><li>Hà Nội: H<sub>n</sub> = 2H<sub>n−1</sub> + 1 = 2<sup>n</sup> − 1; không “00”: Fibonacci.</li><li>Đệ quy có nhớ hoặc lặp từ dưới lên để tính trong O(n).</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://brilliant.org/wiki/recurrence-relations/" target="_blank" rel="noopener">Brilliant — Recurrence Relations</a></li><li><a href="https://en.wikipedia.org/wiki/Tower_of_Hanoi" target="_blank" rel="noopener">Wikipedia — Tower of Hanoi</a></li><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_seq_intro.html" target="_blank" rel="noopener">Levin, DMOI 4.1 — Describing Sequences (định nghĩa đệ quy)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Lập truy hồi cho số cách leo n bậc thang, mỗi lần 1 hoặc 2 bậc. Với n = 6 có bao nhiêu cách?</li><li>Lập truy hồi cho số chuỗi bit độ dài n có chứa “00”.</li><li>Giải a<sub>n</sub> = 2a<sub>n−1</sub>, a<sub>0</sub> = 5 bằng phép lặp.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) s<sub>n</sub> = s<sub>n−1</sub> + s<sub>n−2</sub>, s<sub>1</sub> = 1, s<sub>2</sub> = 2; s<sub>6</sub> = 13. 2) b<sub>n</sub> = b<sub>n−1</sub> + b<sub>n−2</sub> + 2<sup>n−2</sup> (kết thúc 1; kết thúc 10; kết thúc 00 — tiền tố tuỳ ý), b<sub>1</sub> = 0, b<sub>2</sub> = 1; tương đương b<sub>n</sub> = 2<sup>n</sup> − a<sub>n</sub>. 3) a<sub>n</sub> = 5·2<sup>n</sup>.</p></div>`);

const c82 = L('mad102-ts-8-2',
  '8.2 — Solving linear homogeneous recurrences|||8.2 — Giải hệ thức truy hồi tuyến tính thuần nhất',
  'Truy hồi tuyến tính thuần nhất hệ số hằng, phương trình đặc trưng, nghiệm phân biệt, nghiệm kép, công thức Binet cho Fibonacci; ví dụ giải từng bước và kiểm nghiệm bằng Python.',
  `<span class="eyebrow">MAD102 · Chapter 8 · Lesson 8.2</span>
<h2>Solving linear homogeneous recurrences</h2>
<p class="lead">For the most common kind of recurrence there is a complete recipe: guess a<sub>n</sub> = r<sup>n</sup>, solve a polynomial equation for r, and combine the solutions to fit the initial conditions. It turns Fibonacci-like recurrences into closed formulas and tells you their exact growth rate.</p>
<h3>🎯 Objectives</h3>
<ul><li>Recognise linear homogeneous recurrences with constant coefficients and their degree.</li><li>Solve degree-2 recurrences with distinct and with repeated characteristic roots.</li><li>Derive Binet's formula and read off growth rates.</li></ul>
<h3>📖 Lecture</h3>
<p>A <strong>linear homogeneous recurrence of degree k with constant coefficients</strong> has the form a<sub>n</sub> = c<sub>1</sub>a<sub>n−1</sub> + c<sub>2</sub>a<sub>n−2</sub> + … + c<sub>k</sub>a<sub>n−k</sub>, c<sub>k</sub> ≠ 0. Linear: no products or powers of terms; homogeneous: no extra term depending only on n; degree k: needs k initial values. Fibonacci is degree 2; H<sub>n</sub> = 2H<sub>n−1</sub> + 1 is <em>not</em> homogeneous (the “+1”); a<sub>n</sub> = a<sub>n−1</sub><sup>2</sup> is not linear.</p>
<p>Try a<sub>n</sub> = r<sup>n</sup>: dividing by r<sup>n−k</sup> gives the <strong>characteristic equation</strong> r<sup>k</sup> − c<sub>1</sub>r<sup>k−1</sup> − … − c<sub>k</sub> = 0. Because the recurrence is linear, any linear combination of solutions is a solution.</p>
<div class="formula"><span class="lbl">Degree 2: r<sup>2</sup> − c<sub>1</sub>r − c<sub>2</sub> = 0</span>Two distinct roots r<sub>1</sub> ≠ r<sub>2</sub>: a<sub>n</sub> = α<sub>1</sub>r<sub>1</sub><sup>n</sup> + α<sub>2</sub>r<sub>2</sub><sup>n</sup><br>One repeated root r<sub>0</sub>: a<sub>n</sub> = (α<sub>1</sub> + α<sub>2</sub>n)r<sub>0</sub><sup>n</sup><br>α<sub>1</sub>, α<sub>2</sub> are found from the initial conditions (a 2 × 2 linear system).</div>
<p>For degree k the same holds: each root r of multiplicity m contributes (β<sub>0</sub> + β<sub>1</sub>n + … + β<sub>m−1</sub>n<sup>m−1</sup>)r<sup>n</sup>. The root with the largest absolute value dominates the growth: a<sub>n</sub> = Θ(|r<sub>max</sub>|<sup>n</sup>) (times n<sup>m−1</sup> if repeated), unless its coefficient is 0.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — distinct roots.</b> a<sub>n</sub> = a<sub>n−1</sub> + 2a<sub>n−2</sub>, a<sub>0</sub> = 2, a<sub>1</sub> = 7.<br>Step 1: r<sup>2</sup> − r − 2 = 0 ⇒ (r − 2)(r + 1) = 0 ⇒ r = 2, −1.<br>Step 2: a<sub>n</sub> = α<sub>1</sub>2<sup>n</sup> + α<sub>2</sub>(−1)<sup>n</sup>.<br>Step 3: n = 0: α<sub>1</sub> + α<sub>2</sub> = 2; n = 1: 2α<sub>1</sub> − α<sub>2</sub> = 7 ⇒ α<sub>1</sub> = 3, α<sub>2</sub> = −1.<br>Answer: a<sub>n</sub> = 3·2<sup>n</sup> − (−1)<sup>n</sup>.</p></div>
<div class="callout"><p><b>Example 2 — repeated root.</b> a<sub>n</sub> = 6a<sub>n−1</sub> − 9a<sub>n−2</sub>, a<sub>0</sub> = 1, a<sub>1</sub> = 6. r<sup>2</sup> − 6r + 9 = (r − 3)<sup>2</sup> ⇒ r<sub>0</sub> = 3. a<sub>n</sub> = (α<sub>1</sub> + α<sub>2</sub>n)3<sup>n</sup>; α<sub>1</sub> = 1, 3(1 + α<sub>2</sub>) = 6 ⇒ α<sub>2</sub> = 1. Answer: a<sub>n</sub> = (n + 1)3<sup>n</sup>.</p></div>
<div class="callout"><p><b>Example 3 — Fibonacci (Binet).</b> r<sup>2</sup> − r − 1 = 0 ⇒ φ = (1 + √5)/2, ψ = (1 − √5)/2. With f<sub>0</sub> = 0, f<sub>1</sub> = 1: f<sub>n</sub> = (φ<sup>n</sup> − ψ<sup>n</sup>)/√5. Since |ψ| &lt; 1, f<sub>n</sub> is the integer nearest to φ<sup>n</sup>/√5, and f<sub>n</sub> = Θ(φ<sup>n</sup>) ≈ Θ(1.618<sup>n</sup>).</p></div>
<pre><code class="language-python">def iterate(c1, c2, a0, a1, n):
    seq = [a0, a1]
    while len(seq) &lt; n:
        seq.append(c1 * seq[-1] + c2 * seq[-2])
    return seq

# a_n = a_{n-1} + 2 a_{n-2}, a0 = 2, a1 = 7  -&gt; closed form 3*2^n - (-1)^n
print(iterate(1, 2, 2, 7, 8))
print([3 * 2**n - (-1)**n for n in range(8)])
# a_n = 6 a_{n-1} - 9 a_{n-2}, a0 = 1, a1 = 6 -&gt; (1 + n) 3^n
print(iterate(6, -9, 1, 6, 7))
print([(1 + n) * 3**n for n in range(7)])
# Fibonacci vs Binet's formula
phi, psi = (1 + 5 ** 0.5) / 2, (1 - 5 ** 0.5) / 2
fib = iterate(1, 1, 0, 1, 15)
print(fib)
print([round((phi**n - psi**n) / 5 ** 0.5) for n in range(15)])</code></pre>
<div class="out">[2, 7, 11, 25, 47, 97, 191, 385]
[2, 7, 11, 25, 47, 97, 191, 385]
[1, 6, 27, 108, 405, 1458, 5103]
[1, 6, 27, 108, 405, 1458, 5103]
[0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377]
[0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377]</div>
<p>In each pair of lines the iterated sequence equals the closed form. (Floating-point Binet is exact only up to about n = 70; for larger n use integers.)</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Sign errors in the characteristic equation: a<sub>n</sub> = c<sub>1</sub>a<sub>n−1</sub> + c<sub>2</sub>a<sub>n−2</sub> gives r<sup>2</sup> − c<sub>1</sub>r − c<sub>2</sub> = 0.</li><li>Using α<sub>1</sub>r<sup>n</sup> + α<sub>2</sub>r<sup>n</sup> for a repeated root — that has only one free constant; you need the n·r<sup>n</sup> term.</li><li>Fitting constants to a<sub>1</sub>, a<sub>2</sub> when the given initial conditions are a<sub>0</sub>, a<sub>1</sub>.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Guess r<sup>n</sup> ⇒ characteristic equation.</li><li>Distinct roots: α<sub>1</sub>r<sub>1</sub><sup>n</sup> + α<sub>2</sub>r<sub>2</sub><sup>n</sup>; repeated: (α<sub>1</sub> + α<sub>2</sub>n)r<sub>0</sub><sup>n</sup>.</li><li>Constants from initial conditions.</li><li>Largest root gives the growth rate (Fibonacci ~ 1.618<sup>n</sup>).</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://brilliant.org/wiki/linear-recurrence-relations/" target="_blank" rel="noopener">Brilliant — Linear Recurrence Relations</a></li><li><a href="https://en.wikipedia.org/wiki/Linear_recurrence_with_constant_coefficients" target="_blank" rel="noopener">Wikipedia — Linear recurrence with constant coefficients</a></li><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_seq-exponential.html" target="_blank" rel="noopener">Levin, DMOI 4.4 — Exponential Sequences (characteristic roots)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Solve a<sub>n</sub> = 5a<sub>n−1</sub> − 6a<sub>n−2</sub>, a<sub>0</sub> = 1, a<sub>1</sub> = 0.</li><li>Solve a<sub>n</sub> = 4a<sub>n−1</sub> − 4a<sub>n−2</sub>, a<sub>0</sub> = 1, a<sub>1</sub> = 4.</li><li>The stair-climbing count s<sub>n</sub> (Lesson 8.1) grows like c·x<sup>n</sup>. What is x?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Roots 2, 3: α<sub>1</sub> + α<sub>2</sub> = 1, 2α<sub>1</sub> + 3α<sub>2</sub> = 0 ⇒ α<sub>1</sub> = 3, α<sub>2</sub> = −2: a<sub>n</sub> = 3·2<sup>n</sup> − 2·3<sup>n</sup>. 2) Root 2 (double): a<sub>n</sub> = (1 + n)2<sup>n</sup>. 3) The golden ratio φ ≈ 1.618.</p></div>`,
  `<span class="eyebrow">MAD102 · Chương 8 · Bài 8.2</span>
<h2>Giải hệ thức truy hồi tuyến tính thuần nhất</h2>
<p class="lead">Với loại truy hồi phổ biến nhất có một công thức hoàn chỉnh: đoán a<sub>n</sub> = r<sup>n</sup>, giải một phương trình đa thức tìm r, rồi tổ hợp các nghiệm cho khớp điều kiện đầu. Nó biến truy hồi kiểu Fibonacci thành công thức đóng và cho biết chính xác tốc độ tăng.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Nhận ra truy hồi tuyến tính thuần nhất hệ số hằng và bậc của nó.</li><li>Giải truy hồi bậc 2 khi phương trình đặc trưng có nghiệm phân biệt và nghiệm kép.</li><li>Suy ra công thức Binet và đọc ra tốc độ tăng.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Truy hồi tuyến tính thuần nhất bậc k hệ số hằng</strong> có dạng a<sub>n</sub> = c<sub>1</sub>a<sub>n−1</sub> + c<sub>2</sub>a<sub>n−2</sub> + … + c<sub>k</sub>a<sub>n−k</sub>, c<sub>k</sub> ≠ 0. Tuyến tính: không có tích hay lũy thừa của các số hạng; thuần nhất: không có số hạng thêm chỉ phụ thuộc n; bậc k: cần k giá trị đầu. Fibonacci có bậc 2; H<sub>n</sub> = 2H<sub>n−1</sub> + 1 <em>không</em> thuần nhất (vì “+1”); a<sub>n</sub> = a<sub>n−1</sub><sup>2</sup> không tuyến tính.</p>
<p>Thử a<sub>n</sub> = r<sup>n</sup>: chia cho r<sup>n−k</sup> được <strong>phương trình đặc trưng</strong> r<sup>k</sup> − c<sub>1</sub>r<sup>k−1</sup> − … − c<sub>k</sub> = 0. Vì truy hồi tuyến tính nên mọi tổ hợp tuyến tính của các nghiệm cũng là nghiệm.</p>
<div class="formula"><span class="lbl">Bậc 2: r<sup>2</sup> − c<sub>1</sub>r − c<sub>2</sub> = 0</span>Hai nghiệm phân biệt r<sub>1</sub> ≠ r<sub>2</sub>: a<sub>n</sub> = α<sub>1</sub>r<sub>1</sub><sup>n</sup> + α<sub>2</sub>r<sub>2</sub><sup>n</sup><br>Một nghiệm kép r<sub>0</sub>: a<sub>n</sub> = (α<sub>1</sub> + α<sub>2</sub>n)r<sub>0</sub><sup>n</sup><br>α<sub>1</sub>, α<sub>2</sub> tìm từ điều kiện đầu (hệ phương trình tuyến tính 2 × 2).</div>
<p>Với bậc k cũng vậy: mỗi nghiệm r bội m đóng góp (β<sub>0</sub> + β<sub>1</sub>n + … + β<sub>m−1</sub>n<sup>m−1</sup>)r<sup>n</sup>. Nghiệm có trị tuyệt đối lớn nhất quyết định tốc độ tăng: a<sub>n</sub> = Θ(|r<sub>max</sub>|<sup>n</sup>) (nhân n<sup>m−1</sup> nếu là nghiệm bội), trừ khi hệ số của nó bằng 0.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — nghiệm phân biệt.</b> a<sub>n</sub> = a<sub>n−1</sub> + 2a<sub>n−2</sub>, a<sub>0</sub> = 2, a<sub>1</sub> = 7.<br>Bước 1: r<sup>2</sup> − r − 2 = 0 ⇒ (r − 2)(r + 1) = 0 ⇒ r = 2, −1.<br>Bước 2: a<sub>n</sub> = α<sub>1</sub>2<sup>n</sup> + α<sub>2</sub>(−1)<sup>n</sup>.<br>Bước 3: n = 0: α<sub>1</sub> + α<sub>2</sub> = 2; n = 1: 2α<sub>1</sub> − α<sub>2</sub> = 7 ⇒ α<sub>1</sub> = 3, α<sub>2</sub> = −1.<br>Đáp số: a<sub>n</sub> = 3·2<sup>n</sup> − (−1)<sup>n</sup>.</p></div>
<div class="callout"><p><b>Ví dụ 2 — nghiệm kép.</b> a<sub>n</sub> = 6a<sub>n−1</sub> − 9a<sub>n−2</sub>, a<sub>0</sub> = 1, a<sub>1</sub> = 6. r<sup>2</sup> − 6r + 9 = (r − 3)<sup>2</sup> ⇒ r<sub>0</sub> = 3. a<sub>n</sub> = (α<sub>1</sub> + α<sub>2</sub>n)3<sup>n</sup>; α<sub>1</sub> = 1, 3(1 + α<sub>2</sub>) = 6 ⇒ α<sub>2</sub> = 1. Đáp số: a<sub>n</sub> = (n + 1)3<sup>n</sup>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — Fibonacci (Binet).</b> r<sup>2</sup> − r − 1 = 0 ⇒ φ = (1 + √5)/2, ψ = (1 − √5)/2. Với f<sub>0</sub> = 0, f<sub>1</sub> = 1: f<sub>n</sub> = (φ<sup>n</sup> − ψ<sup>n</sup>)/√5. Vì |ψ| &lt; 1 nên f<sub>n</sub> là số nguyên gần φ<sup>n</sup>/√5 nhất, và f<sub>n</sub> = Θ(φ<sup>n</sup>) ≈ Θ(1,618<sup>n</sup>).</p></div>
<pre><code class="language-python">def iterate(c1, c2, a0, a1, n):
    seq = [a0, a1]
    while len(seq) &lt; n:
        seq.append(c1 * seq[-1] + c2 * seq[-2])
    return seq

# a_n = a_{n-1} + 2 a_{n-2}, a0 = 2, a1 = 7  -&gt; closed form 3*2^n - (-1)^n
print(iterate(1, 2, 2, 7, 8))
print([3 * 2**n - (-1)**n for n in range(8)])
# a_n = 6 a_{n-1} - 9 a_{n-2}, a0 = 1, a1 = 6 -&gt; (1 + n) 3^n
print(iterate(6, -9, 1, 6, 7))
print([(1 + n) * 3**n for n in range(7)])
# Fibonacci vs Binet's formula
phi, psi = (1 + 5 ** 0.5) / 2, (1 - 5 ** 0.5) / 2
fib = iterate(1, 1, 0, 1, 15)
print(fib)
print([round((phi**n - psi**n) / 5 ** 0.5) for n in range(15)])</code></pre>
<div class="out">[2, 7, 11, 25, 47, 97, 191, 385]
[2, 7, 11, 25, 47, 97, 191, 385]
[1, 6, 27, 108, 405, 1458, 5103]
[1, 6, 27, 108, 405, 1458, 5103]
[0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377]
[0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377]</div>
<p>Trong mỗi cặp dòng, dãy tính bằng lặp trùng với công thức đóng. (Binet bằng số thực dấu phẩy động chỉ chính xác tới khoảng n = 70; n lớn hơn hãy dùng số nguyên.)</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Sai dấu trong phương trình đặc trưng: a<sub>n</sub> = c<sub>1</sub>a<sub>n−1</sub> + c<sub>2</sub>a<sub>n−2</sub> cho r<sup>2</sup> − c<sub>1</sub>r − c<sub>2</sub> = 0.</li><li>Dùng α<sub>1</sub>r<sup>n</sup> + α<sub>2</sub>r<sup>n</sup> cho nghiệm kép — chỉ có một hằng số tự do; cần thêm số hạng n·r<sup>n</sup>.</li><li>Khớp hằng số với a<sub>1</sub>, a<sub>2</sub> khi điều kiện đầu cho là a<sub>0</sub>, a<sub>1</sub>.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Đoán r<sup>n</sup> ⇒ phương trình đặc trưng.</li><li>Nghiệm phân biệt: α<sub>1</sub>r<sub>1</sub><sup>n</sup> + α<sub>2</sub>r<sub>2</sub><sup>n</sup>; nghiệm kép: (α<sub>1</sub> + α<sub>2</sub>n)r<sub>0</sub><sup>n</sup>.</li><li>Hằng số từ điều kiện đầu.</li><li>Nghiệm lớn nhất cho tốc độ tăng (Fibonacci ~ 1,618<sup>n</sup>).</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://brilliant.org/wiki/linear-recurrence-relations/" target="_blank" rel="noopener">Brilliant — Linear Recurrence Relations</a></li><li><a href="https://en.wikipedia.org/wiki/Linear_recurrence_with_constant_coefficients" target="_blank" rel="noopener">Wikipedia — Linear recurrence with constant coefficients</a></li><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_seq-exponential.html" target="_blank" rel="noopener">Levin, DMOI 4.4 — Exponential Sequences (nghiệm đặc trưng)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Giải a<sub>n</sub> = 5a<sub>n−1</sub> − 6a<sub>n−2</sub>, a<sub>0</sub> = 1, a<sub>1</sub> = 0.</li><li>Giải a<sub>n</sub> = 4a<sub>n−1</sub> − 4a<sub>n−2</sub>, a<sub>0</sub> = 1, a<sub>1</sub> = 4.</li><li>Số cách leo thang s<sub>n</sub> (Bài 8.1) tăng như c·x<sup>n</sup>. x bằng bao nhiêu?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Nghiệm 2, 3: α<sub>1</sub> + α<sub>2</sub> = 1, 2α<sub>1</sub> + 3α<sub>2</sub> = 0 ⇒ α<sub>1</sub> = 3, α<sub>2</sub> = −2: a<sub>n</sub> = 3·2<sup>n</sup> − 2·3<sup>n</sup>. 2) Nghiệm kép 2: a<sub>n</sub> = (1 + n)2<sup>n</sup>. 3) Tỉ lệ vàng φ ≈ 1,618.</p></div>`);

const c83 = L('mad102-ts-8-3',
  '8.3 — Non-homogeneous recurrences and divide-and-conquer (Master theorem)|||8.3 — Truy hồi không thuần nhất và chia để trị (định lý Master)',
  'Nghiệm = nghiệm thuần nhất + nghiệm riêng, chọn dạng nghiệm riêng; truy hồi chia để trị T(n) = aT(n/b) + f(n): tìm kiếm nhị phân, merge sort, Karatsuba, Strassen; định lý Master và kiểm số bằng Python.',
  `<span class="eyebrow">MAD102 · Chapter 8 · Lesson 8.3</span>
<h2>Non-homogeneous recurrences and divide-and-conquer (Master theorem)</h2>
<p class="lead">Recurrences in algorithm analysis usually have an extra term — the cost of splitting and combining. This lesson handles the extra term in linear recurrences and gives the Master theorem, which reads the complexity of a divide-and-conquer algorithm straight off its recurrence.</p>
<h3>🎯 Objectives</h3>
<ul><li>Solve a<sub>n</sub> = c·a<sub>n−1</sub> + F(n) by homogeneous + particular solution.</li><li>Write the recurrence of a divide-and-conquer algorithm.</li><li>Apply the Master theorem to binary search, merge sort, Karatsuba and Strassen.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>Linear non-homogeneous recurrences</strong> a<sub>n</sub> = c<sub>1</sub>a<sub>n−1</sub> + … + c<sub>k</sub>a<sub>n−k</sub> + F(n). Every solution is a<sub>n</sub> = a<sub>n</sub><sup>(p)</sup> + a<sub>n</sub><sup>(h)</sup>: one <strong>particular solution</strong> plus the general solution of the associated homogeneous recurrence (Lesson 8.2). Guess the particular solution in the same shape as F(n): if F(n) is a polynomial of degree d, try a polynomial of degree d; if F(n) = C·s<sup>n</sup>, try A·s<sup>n</sup> — multiplied by n<sup>m</sup> if s is a characteristic root of multiplicity m. Fit the initial conditions <em>last</em>, to the full solution.</p>
<p><strong>Divide-and-conquer recurrences.</strong> An algorithm that splits a problem of size n into a subproblems of size n/b and spends f(n) to split and combine satisfies T(n) = aT(n/b) + f(n).</p>
<div class="formula"><span class="lbl">Master theorem (f(n) = c·n<sup>d</sup>, a ≥ 1, b &gt; 1, d ≥ 0)</span>a &lt; b<sup>d</sup> ⇒ T(n) = Θ(n<sup>d</sup>)<br>a = b<sup>d</sup> ⇒ T(n) = Θ(n<sup>d</sup> log n)<br>a &gt; b<sup>d</sup> ⇒ T(n) = Θ(n<sup>log<sub>b</sub> a</sup>)</div>
<p>Intuition: the recursion tree has log<sub>b</sub> n levels; level i has a<sup>i</sup> nodes doing c(n/b<sup>i</sup>)<sup>d</sup> work each, total c·n<sup>d</sup>(a/b<sup>d</sup>)<sup>i</sup>. A geometric series: decreasing (top level dominates), constant (every level equal, log n levels), or increasing (the n<sup>log<sub>b</sub> a</sup> leaves dominate).</p>
<ul>
<li>Binary search: T(n) = T(n/2) + 1: a = 1 = 2<sup>0</sup> ⇒ Θ(log n).</li>
<li>Merge sort: T(n) = 2T(n/2) + n: a = 2 = 2<sup>1</sup> ⇒ Θ(n log n).</li>
<li>Karatsuba multiplication: T(n) = 3T(n/2) + n: 3 &gt; 2 ⇒ Θ(n<sup>log<sub>2</sub> 3</sup>) ≈ Θ(n<sup>1.585</sup>), better than the schoolbook n<sup>2</sup>.</li>
<li>Strassen matrix multiplication: T(n) = 7T(n/2) + n<sup>2</sup>: 7 &gt; 4 ⇒ Θ(n<sup>log<sub>2</sub> 7</sup>) ≈ Θ(n<sup>2.807</sup>), better than n<sup>3</sup>.</li>
</ul>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — particular solution.</b> a<sub>n</sub> = 3a<sub>n−1</sub> + 2n, a<sub>1</sub> = 3.<br>Homogeneous: a<sub>n</sub><sup>(h)</sup> = α3<sup>n</sup>. Particular: try p<sub>n</sub> = cn + d: cn + d = 3(c(n − 1) + d) + 2n ⇒ (2c + 2)n + (2d − 3c) = 0 ⇒ c = −1, d = −3/2.<br>General: a<sub>n</sub> = −n − 3/2 + α3<sup>n</sup>; a<sub>1</sub> = 3 ⇒ −5/2 + 3α = 3 ⇒ α = 11/6.<br>Answer: a<sub>n</sub> = −n − 3/2 + (11/6)3<sup>n</sup>.</p></div>
<div class="callout"><p><b>Example 2 — merge sort exactly.</b> With T(1) = 0 and T(n) = 2T(n/2) + n for n = 2<sup>k</sup>, unrolling gives T(n) = n log<sub>2</sub> n exactly.</p></div>
<pre><code class="language-python">from fractions import Fraction as F
import math

# a_n = 3 a_{n-1} + 2n, a_1 = 3  -&gt;  a_n = -n - 3/2 + (11/6) 3^n
a = {1: 3}
for n in range(2, 8):
    a[n] = 3 * a[n - 1] + 2 * n
print([a[n] for n in range(1, 8)])
print([int(-n - F(3, 2) + F(11, 6) * 3**n) for n in range(1, 8)])

# Divide and conquer: merge-sort comparisons recurrence T(n) = 2T(n/2) + n, T(1) = 0
T = {1: 0}
for k in range(1, 11):
    n = 2**k
    T[n] = 2 * T[n // 2] + n
print([(2**k, T[2**k], 2**k * k) for k in range(1, 6)])
print(round(math.log2(7), 3), round(math.log2(3), 3))</code></pre>
<div class="out">[3, 13, 45, 143, 439, 1329, 4001]
[3, 13, 45, 143, 439, 1329, 4001]
[(2, 2, 2), (4, 8, 8), (8, 24, 24), (16, 64, 64), (32, 160, 160)]
2.807 1.585</div>
<p>The iterated values match the closed form; the merge-sort tuples (n, T(n), n log<sub>2</sub> n) agree; and log<sub>2</sub> 7 ≈ 2.807, log<sub>2</sub> 3 ≈ 1.585 are the Strassen and Karatsuba exponents.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Fitting initial conditions to the homogeneous part before adding the particular solution.</li><li>Guessing A·s<sup>n</sup> when s is already a characteristic root (the guess then gives 0 = F(n)); multiply by n.</li><li>Applying the Master theorem to T(n) = T(n − 1) + n (not of the form aT(n/b)); that one is Θ(n<sup>2</sup>) by summation.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Non-homogeneous: particular + homogeneous; constants last.</li><li>Divide and conquer: T(n) = aT(n/b) + cn<sup>d</sup>.</li><li>Compare a with b<sup>d</sup>: Θ(n<sup>d</sup>), Θ(n<sup>d</sup> log n) or Θ(n<sup>log<sub>b</sub> a</sup>).</li><li>Merge sort n log n; Karatsuba n<sup>1.585</sup>; Strassen n<sup>2.807</sup>.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://brilliant.org/wiki/master-theorem/" target="_blank" rel="noopener">Brilliant — Master Theorem</a></li><li><a href="https://en.wikipedia.org/wiki/Master_theorem_(analysis_of_algorithms)" target="_blank" rel="noopener">Wikipedia — Master theorem (analysis of algorithms)</a></li><li><a href="https://en.wikipedia.org/wiki/Divide-and-conquer_algorithm" target="_blank" rel="noopener">Wikipedia — Divide-and-conquer algorithm</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Solve a<sub>n</sub> = 2a<sub>n−1</sub> + 1, a<sub>0</sub> = 0 with the particular-solution method.</li><li>Give Θ for T(n) = 4T(n/2) + n, T(n) = 4T(n/2) + n<sup>2</sup>, T(n) = 4T(n/2) + n<sup>3</sup>.</li><li>Ternary search splits into one subproblem of size n/3 with constant extra work. What is its complexity?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Particular p = −1, so a<sub>n</sub> = α2<sup>n</sup> − 1, a<sub>0</sub> = 0 ⇒ α = 1: a<sub>n</sub> = 2<sup>n</sup> − 1 (Hanoi). 2) a = 4, b = 2: b<sup>d</sup> = 2, 4, 8 ⇒ Θ(n<sup>2</sup>), Θ(n<sup>2</sup> log n), Θ(n<sup>3</sup>). 3) T(n) = T(n/3) + 1 ⇒ Θ(log n).</p></div>`,
  `<span class="eyebrow">MAD102 · Chương 8 · Bài 8.3</span>
<h2>Truy hồi không thuần nhất và chia để trị (định lý Master)</h2>
<p class="lead">Truy hồi trong phân tích thuật toán thường có thêm một số hạng — chi phí chia và ghép. Bài này xử lý số hạng thêm đó trong truy hồi tuyến tính và đưa ra định lý Master, cho phép đọc thẳng độ phức tạp của thuật toán chia để trị từ hệ thức truy hồi.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải a<sub>n</sub> = c·a<sub>n−1</sub> + F(n) bằng nghiệm thuần nhất + nghiệm riêng.</li><li>Viết truy hồi của một thuật toán chia để trị.</li><li>Áp dụng định lý Master cho tìm kiếm nhị phân, merge sort, Karatsuba và Strassen.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Truy hồi tuyến tính không thuần nhất</strong> a<sub>n</sub> = c<sub>1</sub>a<sub>n−1</sub> + … + c<sub>k</sub>a<sub>n−k</sub> + F(n). Mọi nghiệm có dạng a<sub>n</sub> = a<sub>n</sub><sup>(p)</sup> + a<sub>n</sub><sup>(h)</sup>: một <strong>nghiệm riêng</strong> cộng nghiệm tổng quát của truy hồi thuần nhất tương ứng (Bài 8.2). Đoán nghiệm riêng cùng dạng với F(n): nếu F(n) là đa thức bậc d thì thử đa thức bậc d; nếu F(n) = C·s<sup>n</sup> thì thử A·s<sup>n</sup> — nhân thêm n<sup>m</sup> nếu s là nghiệm đặc trưng bội m. Khớp điều kiện đầu <em>cuối cùng</em>, cho nghiệm đầy đủ.</p>
<p><strong>Truy hồi chia để trị.</strong> Thuật toán chia bài cỡ n thành a bài con cỡ n/b và tốn f(n) để chia và ghép thì thoả T(n) = aT(n/b) + f(n).</p>
<div class="formula"><span class="lbl">Định lý Master (f(n) = c·n<sup>d</sup>, a ≥ 1, b &gt; 1, d ≥ 0)</span>a &lt; b<sup>d</sup> ⇒ T(n) = Θ(n<sup>d</sup>)<br>a = b<sup>d</sup> ⇒ T(n) = Θ(n<sup>d</sup> log n)<br>a &gt; b<sup>d</sup> ⇒ T(n) = Θ(n<sup>log<sub>b</sub> a</sup>)</div>
<p>Trực giác: cây đệ quy có log<sub>b</sub> n tầng; tầng i có a<sup>i</sup> nút, mỗi nút làm c(n/b<sup>i</sup>)<sup>d</sup> việc, tổng c·n<sup>d</sup>(a/b<sup>d</sup>)<sup>i</sup>. Một cấp số nhân: giảm (tầng trên cùng chiếm ưu thế), không đổi (mọi tầng bằng nhau, có log n tầng), hoặc tăng (n<sup>log<sub>b</sub> a</sup> lá chiếm ưu thế).</p>
<ul>
<li>Tìm kiếm nhị phân: T(n) = T(n/2) + 1: a = 1 = 2<sup>0</sup> ⇒ Θ(log n).</li>
<li>Merge sort: T(n) = 2T(n/2) + n: a = 2 = 2<sup>1</sup> ⇒ Θ(n log n).</li>
<li>Nhân Karatsuba: T(n) = 3T(n/2) + n: 3 &gt; 2 ⇒ Θ(n<sup>log<sub>2</sub> 3</sup>) ≈ Θ(n<sup>1,585</sup>), tốt hơn n<sup>2</sup> của phép nhân tay.</li>
<li>Nhân ma trận Strassen: T(n) = 7T(n/2) + n<sup>2</sup>: 7 &gt; 4 ⇒ Θ(n<sup>log<sub>2</sub> 7</sup>) ≈ Θ(n<sup>2,807</sup>), tốt hơn n<sup>3</sup>.</li>
</ul>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — nghiệm riêng.</b> a<sub>n</sub> = 3a<sub>n−1</sub> + 2n, a<sub>1</sub> = 3.<br>Thuần nhất: a<sub>n</sub><sup>(h)</sup> = α3<sup>n</sup>. Nghiệm riêng: thử p<sub>n</sub> = cn + d: cn + d = 3(c(n − 1) + d) + 2n ⇒ (2c + 2)n + (2d − 3c) = 0 ⇒ c = −1, d = −3/2.<br>Tổng quát: a<sub>n</sub> = −n − 3/2 + α3<sup>n</sup>; a<sub>1</sub> = 3 ⇒ −5/2 + 3α = 3 ⇒ α = 11/6.<br>Đáp số: a<sub>n</sub> = −n − 3/2 + (11/6)3<sup>n</sup>.</p></div>
<div class="callout"><p><b>Ví dụ 2 — merge sort chính xác.</b> Với T(1) = 0 và T(n) = 2T(n/2) + n khi n = 2<sup>k</sup>, khai triển cho T(n) = n log<sub>2</sub> n đúng tuyệt đối.</p></div>
<pre><code class="language-python">from fractions import Fraction as F
import math

# a_n = 3 a_{n-1} + 2n, a_1 = 3  -&gt;  a_n = -n - 3/2 + (11/6) 3^n
a = {1: 3}
for n in range(2, 8):
    a[n] = 3 * a[n - 1] + 2 * n
print([a[n] for n in range(1, 8)])
print([int(-n - F(3, 2) + F(11, 6) * 3**n) for n in range(1, 8)])

# Divide and conquer: merge-sort comparisons recurrence T(n) = 2T(n/2) + n, T(1) = 0
T = {1: 0}
for k in range(1, 11):
    n = 2**k
    T[n] = 2 * T[n // 2] + n
print([(2**k, T[2**k], 2**k * k) for k in range(1, 6)])
print(round(math.log2(7), 3), round(math.log2(3), 3))</code></pre>
<div class="out">[3, 13, 45, 143, 439, 1329, 4001]
[3, 13, 45, 143, 439, 1329, 4001]
[(2, 2, 2), (4, 8, 8), (8, 24, 24), (16, 64, 64), (32, 160, 160)]
2.807 1.585</div>
<p>Các giá trị lặp khớp công thức đóng; các bộ (n, T(n), n log<sub>2</sub> n) của merge sort trùng nhau; còn log<sub>2</sub> 7 ≈ 2,807 và log<sub>2</sub> 3 ≈ 1,585 là số mũ của Strassen và Karatsuba.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Khớp điều kiện đầu cho phần thuần nhất trước khi cộng nghiệm riêng.</li><li>Đoán A·s<sup>n</sup> khi s đã là nghiệm đặc trưng (khi đó dự đoán cho 0 = F(n)); phải nhân thêm n.</li><li>Dùng định lý Master cho T(n) = T(n − 1) + n (không có dạng aT(n/b)); bài đó là Θ(n<sup>2</sup>) bằng cách lấy tổng.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Không thuần nhất: nghiệm riêng + thuần nhất; hằng số tính sau cùng.</li><li>Chia để trị: T(n) = aT(n/b) + cn<sup>d</sup>.</li><li>So a với b<sup>d</sup>: Θ(n<sup>d</sup>), Θ(n<sup>d</sup> log n) hoặc Θ(n<sup>log<sub>b</sub> a</sup>).</li><li>Merge sort n log n; Karatsuba n<sup>1,585</sup>; Strassen n<sup>2,807</sup>.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://brilliant.org/wiki/master-theorem/" target="_blank" rel="noopener">Brilliant — Master Theorem</a></li><li><a href="https://en.wikipedia.org/wiki/Master_theorem_(analysis_of_algorithms)" target="_blank" rel="noopener">Wikipedia — Master theorem (analysis of algorithms)</a></li><li><a href="https://en.wikipedia.org/wiki/Divide-and-conquer_algorithm" target="_blank" rel="noopener">Wikipedia — Divide-and-conquer algorithm</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Giải a<sub>n</sub> = 2a<sub>n−1</sub> + 1, a<sub>0</sub> = 0 bằng phương pháp nghiệm riêng.</li><li>Cho Θ của T(n) = 4T(n/2) + n, T(n) = 4T(n/2) + n<sup>2</sup>, T(n) = 4T(n/2) + n<sup>3</sup>.</li><li>Tìm kiếm tam phân chia thành một bài con cỡ n/3 với chi phí thêm hằng số. Độ phức tạp là gì?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Nghiệm riêng p = −1, nên a<sub>n</sub> = α2<sup>n</sup> − 1, a<sub>0</sub> = 0 ⇒ α = 1: a<sub>n</sub> = 2<sup>n</sup> − 1 (tháp Hà Nội). 2) a = 4, b = 2: b<sup>d</sup> = 2, 4, 8 ⇒ Θ(n<sup>2</sup>), Θ(n<sup>2</sup> log n), Θ(n<sup>3</sup>). 3) T(n) = T(n/3) + 1 ⇒ Θ(log n).</p></div>`);

const c84 = L('mad102-ts-8-4',
  '8.4 — Generating functions and inclusion–exclusion|||8.4 — Hàm sinh và nguyên lý bao hàm – loại trừ',
  'Hàm sinh thường, chuỗi 1/(1 − x), dùng hàm sinh đếm nghiệm có cận trên/dưới; nguyên lý bao hàm – loại trừ tổng quát, đếm toàn ánh, số mất thứ tự (derangement) Dₙ ≈ n!/e; kiểm bằng nhân đa thức và vét cạn.',
  `<span class="eyebrow">MAD102 · Chapter 8 · Lesson 8.4</span>
<h2>Generating functions and inclusion–exclusion</h2>
<p class="lead">Two power tools finish the counting toolbox. Generating functions turn counting problems into multiplication of polynomials — something a computer does instantly. Inclusion–exclusion corrects over-counting when conditions overlap, and it answers classic questions such as “how many permutations move every element?”.</p>
<h3>🎯 Objectives</h3>
<ul><li>Write the generating function of a sequence and of a constrained selection problem.</li><li>Extract a coefficient to count solutions with upper and lower bounds.</li><li>Apply inclusion–exclusion to unions of n sets, onto functions and derangements.</li></ul>
<h3>📖 Lecture</h3>
<p>The (ordinary) <strong>generating function</strong> of a sequence a<sub>0</sub>, a<sub>1</sub>, a<sub>2</sub>, … is the formal power series G(x) = a<sub>0</sub> + a<sub>1</sub>x + a<sub>2</sub>x<sup>2</sup> + … We never plug in numbers; x is a placeholder whose exponent records “how many”. Key series: 1/(1 − x) = 1 + x + x<sup>2</sup> + …, 1/(1 − x)<sup>n</sup> = Σ C(n + k − 1, k)x<sup>k</sup> (the stars-and-bars numbers), (1 + x)<sup>n</sup> = Σ C(n, k)x<sup>k</sup>.</p>
<p><strong>Counting with generating functions.</strong> If item type i may be taken in amounts from a set S<sub>i</sub>, give it the factor Σ<sub>s∈S<sub>i</sub></sub> x<sup>s</sup>. The number of ways to take r items in total is the coefficient of x<sup>r</sup> in the product of the factors. Upper and lower bounds are just which powers appear.</p>
<div class="formula"><span class="lbl">Inclusion–exclusion</span>|A<sub>1</sub> ∪ … ∪ A<sub>n</sub>| = Σ|A<sub>i</sub>| − Σ|A<sub>i</sub> ∩ A<sub>j</sub>| + Σ|A<sub>i</sub> ∩ A<sub>j</sub> ∩ A<sub>k</sub>| − … + (−1)<sup>n+1</sup>|A<sub>1</sub> ∩ … ∩ A<sub>n</sub>|</div>
<p>Each element in exactly t of the sets is counted C(t, 1) − C(t, 2) + C(t, 3) − … = 1 time (binomial theorem). Two famous applications:</p>
<ul>
<li><strong>Onto functions</strong> from an m-set to an n-set: n<sup>m</sup> − C(n, 1)(n − 1)<sup>m</sup> + C(n, 2)(n − 2)<sup>m</sup> − … (subtract the functions that miss some value).</li>
<li><strong>Derangements</strong> (permutations with no fixed point): D<sub>n</sub> = n!(1 − 1/1! + 1/2! − … + (−1)<sup>n</sup>/n!). Hence D<sub>n</sub>/n! → 1/e ≈ 0.3679: if n students randomly swap their phones, the chance nobody gets their own is about 37%, for any large n. D<sub>n</sub> is the nearest integer to n!/e.</li>
</ul>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — generating function with bounds.</b> Number of solutions of e<sub>1</sub> + e<sub>2</sub> + e<sub>3</sub> = 17 with 2 ≤ e<sub>1</sub> ≤ 5, 3 ≤ e<sub>2</sub> ≤ 6, 4 ≤ e<sub>3</sub> ≤ 7: coefficient of x<sup>17</sup> in (x<sup>2</sup> + … + x<sup>5</sup>)(x<sup>3</sup> + … + x<sup>6</sup>)(x<sup>4</sup> + … + x<sup>7</sup>). Since the maxima sum to 18, we need total “deficit” 1: three solutions (5, 6, 6), (5, 5, 7), (4, 6, 7).</p></div>
<div class="callout"><p><b>Example 2 — onto functions.</b> From a 6-set onto a 3-set: 3<sup>6</sup> − 3·2<sup>6</sup> + 3·1<sup>6</sup> − 0 = 729 − 192 + 3 = 540. (Ways to assign 6 jobs to 3 servers so that every server gets work.)</p></div>
<div class="callout"><p><b>Example 3 — derangements.</b> D<sub>5</sub> = 120(1 − 1 + 1/2 − 1/6 + 1/24 − 1/120) = 44.</p></div>
<pre><code class="language-python">from itertools import permutations, product
from math import comb, factorial, e

# coefficient of x^17 in (x^2+..+x^5)(x^3+..+x^6)(x^4+..+x^7)
def poly_mul(p, q):
    r = [0] * (len(p) + len(q) - 1)
    for i, a in enumerate(p):
        for j, b in enumerate(q):
            r[i + j] += a * b
    return r
f1 = [0, 0, 1, 1, 1, 1]
f2 = [0, 0, 0, 1, 1, 1, 1]
f3 = [0, 0, 0, 0, 1, 1, 1, 1]
print(poly_mul(poly_mul(f1, f2), f3)[17])

# onto functions from a 6-set to a 3-set (inclusion-exclusion)
onto = sum((-1)**k * comb(3, k) * (3 - k)**6 for k in range(4))
print(onto, sum(1 for f in product(range(3), repeat=6) if len(set(f)) == 3))

# derangements
D = lambda n: round(factorial(n) / e) if n &gt; 0 else 1
brute = lambda n: sum(1 for p in permutations(range(n)) if all(p[i] != i for i in range(n)))
print([D(n) for n in range(1, 8)], [brute(n) for n in range(1, 8)])
print(D(5) / factorial(5), 1 / e)</code></pre>
<div class="out">3
540 540
[0, 1, 2, 9, 44, 265, 1854] [0, 1, 2, 9, 44, 265, 1854]
0.36666666666666664 0.36787944117144233</div>
<p>Polynomial multiplication gives 3; the inclusion–exclusion count 540 equals brute force over all 3<sup>6</sup> functions; the formula round(n!/e) matches brute-force derangements, and D<sub>5</sub>/5! = 0.3667 is already close to 1/e.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Stopping inclusion–exclusion after the pair terms when triples can overlap.</li><li>Getting the alternating signs wrong — odd-size intersections are added, even-size subtracted.</li><li>In generating functions, forgetting the x<sup>0</sup> term when a type may be omitted.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>G(x) = Σ a<sub>k</sub>x<sup>k</sup>; counting = coefficient extraction from a product.</li><li>1/(1 − x)<sup>n</sup> encodes stars and bars.</li><li>Inclusion–exclusion: alternate signs over intersections.</li><li>Onto functions and derangements D<sub>n</sub> ≈ n!/e.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_addtops-genfun.html" target="_blank" rel="noopener">Levin, DMOI 6.1 — Generating Functions</a></li><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_advPIE.html" target="_blank" rel="noopener">Levin, DMOI 3.8 — Advanced Counting Using PIE</a></li><li><a href="https://brilliant.org/wiki/derangements/" target="_blank" rel="noopener">Brilliant — Derangements</a></li><li><a href="https://cp-algorithms.com/combinatorics/inclusion-exclusion.html" target="_blank" rel="noopener">cp-algorithms — The Inclusion-Exclusion Principle</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>How many integers in 1..1000 are divisible by 2, 3 or 5?</li><li>How many solutions of x<sub>1</sub> + x<sub>2</sub> + x<sub>3</sub> = 10 with 0 ≤ x<sub>i</sub> ≤ 4?</li><li>Compute D<sub>4</sub> and the probability that a random permutation of 4 items has no fixed point.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 500 + 333 + 200 − 166 − 100 − 66 + 33 = 734. 2) Total C(12, 2) = 66; subtract solutions with some x<sub>i</sub> ≥ 5: 3·C(7, 2) = 63; add back two ≥ 5: 3·C(2, 2) = 3 ⇒ 66 − 63 + 3 = 6. 3) D<sub>4</sub> = 9, probability 9/24 = 0.375.</p></div>`,
  `<span class="eyebrow">MAD102 · Chương 8 · Bài 8.4</span>
<h2>Hàm sinh và nguyên lý bao hàm – loại trừ</h2>
<p class="lead">Hai công cụ mạnh hoàn tất hộp đồ nghề đếm. Hàm sinh biến bài đếm thành phép nhân đa thức — việc máy tính làm tức thì. Bao hàm – loại trừ sửa lỗi đếm thừa khi các điều kiện chồng nhau, và trả lời những câu hỏi kinh điển như “có bao nhiêu hoán vị làm mọi phần tử đổi chỗ?”.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Viết hàm sinh của một dãy và của bài toán chọn có ràng buộc.</li><li>Lấy hệ số để đếm nghiệm có cận trên và cận dưới.</li><li>Áp dụng bao hàm – loại trừ cho hợp n tập, toàn ánh và số mất thứ tự.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Hàm sinh</strong> (thường) của dãy a<sub>0</sub>, a<sub>1</sub>, a<sub>2</sub>, … là chuỗi lũy thừa hình thức G(x) = a<sub>0</sub> + a<sub>1</sub>x + a<sub>2</sub>x<sup>2</sup> + … Ta không bao giờ thay số vào; x là vật giữ chỗ mà số mũ ghi lại “bao nhiêu”. Các chuỗi chính: 1/(1 − x) = 1 + x + x<sup>2</sup> + …, 1/(1 − x)<sup>n</sup> = Σ C(n + k − 1, k)x<sup>k</sup> (chính là số sao và vạch), (1 + x)<sup>n</sup> = Σ C(n, k)x<sup>k</sup>.</p>
<p><strong>Đếm bằng hàm sinh.</strong> Nếu loại i được lấy với số lượng thuộc tập S<sub>i</sub>, cho nó thừa số Σ<sub>s∈S<sub>i</sub></sub> x<sup>s</sup>. Số cách lấy tổng cộng r món là hệ số của x<sup>r</sup> trong tích các thừa số. Cận trên và cận dưới chỉ là việc lũy thừa nào có mặt.</p>
<div class="formula"><span class="lbl">Bao hàm – loại trừ</span>|A<sub>1</sub> ∪ … ∪ A<sub>n</sub>| = Σ|A<sub>i</sub>| − Σ|A<sub>i</sub> ∩ A<sub>j</sub>| + Σ|A<sub>i</sub> ∩ A<sub>j</sub> ∩ A<sub>k</sub>| − … + (−1)<sup>n+1</sup>|A<sub>1</sub> ∩ … ∩ A<sub>n</sub>|</div>
<p>Phần tử thuộc đúng t tập được đếm C(t, 1) − C(t, 2) + C(t, 3) − … = 1 lần (định lý nhị thức). Hai ứng dụng nổi tiếng:</p>
<ul>
<li><strong>Toàn ánh</strong> từ tập m phần tử lên tập n phần tử: n<sup>m</sup> − C(n, 1)(n − 1)<sup>m</sup> + C(n, 2)(n − 2)<sup>m</sup> − … (trừ các hàm bỏ sót giá trị nào đó).</li>
<li><strong>Số mất thứ tự</strong> (hoán vị không có điểm bất động): D<sub>n</sub> = n!(1 − 1/1! + 1/2! − … + (−1)<sup>n</sup>/n!). Do đó D<sub>n</sub>/n! → 1/e ≈ 0,3679: nếu n sinh viên tráo điện thoại ngẫu nhiên, xác suất không ai nhận lại máy mình khoảng 37%, với mọi n lớn. D<sub>n</sub> là số nguyên gần n!/e nhất.</li>
</ul>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — hàm sinh có cận.</b> Số nghiệm của e<sub>1</sub> + e<sub>2</sub> + e<sub>3</sub> = 17 với 2 ≤ e<sub>1</sub> ≤ 5, 3 ≤ e<sub>2</sub> ≤ 6, 4 ≤ e<sub>3</sub> ≤ 7: hệ số của x<sup>17</sup> trong (x<sup>2</sup> + … + x<sup>5</sup>)(x<sup>3</sup> + … + x<sup>6</sup>)(x<sup>4</sup> + … + x<sup>7</sup>). Vì tổng các giá trị lớn nhất là 18 nên tổng “thiếu hụt” phải là 1: ba nghiệm (5, 6, 6), (5, 5, 7), (4, 6, 7).</p></div>
<div class="callout"><p><b>Ví dụ 2 — toàn ánh.</b> Từ tập 6 phần tử lên tập 3 phần tử: 3<sup>6</sup> − 3·2<sup>6</sup> + 3·1<sup>6</sup> − 0 = 729 − 192 + 3 = 540. (Số cách giao 6 việc cho 3 máy chủ sao cho máy nào cũng có việc.)</p></div>
<div class="callout"><p><b>Ví dụ 3 — số mất thứ tự.</b> D<sub>5</sub> = 120(1 − 1 + 1/2 − 1/6 + 1/24 − 1/120) = 44.</p></div>
<pre><code class="language-python">from itertools import permutations, product
from math import comb, factorial, e

# coefficient of x^17 in (x^2+..+x^5)(x^3+..+x^6)(x^4+..+x^7)
def poly_mul(p, q):
    r = [0] * (len(p) + len(q) - 1)
    for i, a in enumerate(p):
        for j, b in enumerate(q):
            r[i + j] += a * b
    return r
f1 = [0, 0, 1, 1, 1, 1]
f2 = [0, 0, 0, 1, 1, 1, 1]
f3 = [0, 0, 0, 0, 1, 1, 1, 1]
print(poly_mul(poly_mul(f1, f2), f3)[17])

# onto functions from a 6-set to a 3-set (inclusion-exclusion)
onto = sum((-1)**k * comb(3, k) * (3 - k)**6 for k in range(4))
print(onto, sum(1 for f in product(range(3), repeat=6) if len(set(f)) == 3))

# derangements
D = lambda n: round(factorial(n) / e) if n &gt; 0 else 1
brute = lambda n: sum(1 for p in permutations(range(n)) if all(p[i] != i for i in range(n)))
print([D(n) for n in range(1, 8)], [brute(n) for n in range(1, 8)])
print(D(5) / factorial(5), 1 / e)</code></pre>
<div class="out">3
540 540
[0, 1, 2, 9, 44, 265, 1854] [0, 1, 2, 9, 44, 265, 1854]
0.36666666666666664 0.36787944117144233</div>
<p>Nhân đa thức cho 3; số đếm bao hàm – loại trừ 540 trùng với vét cạn trên cả 3<sup>6</sup> hàm; công thức round(n!/e) khớp số mất thứ tự vét cạn, và D<sub>5</sub>/5! = 0,3667 đã gần 1/e.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dừng bao hàm – loại trừ sau các số hạng cặp khi bộ ba còn có thể chồng nhau.</li><li>Sai dấu đan xen — giao số lẻ tập thì cộng, số chẵn tập thì trừ.</li><li>Trong hàm sinh, quên số hạng x<sup>0</sup> khi một loại có thể không được chọn.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>G(x) = Σ a<sub>k</sub>x<sup>k</sup>; đếm = lấy hệ số của một tích.</li><li>1/(1 − x)<sup>n</sup> mã hoá sao và vạch.</li><li>Bao hàm – loại trừ: đan dấu trên các giao.</li><li>Toàn ánh và số mất thứ tự D<sub>n</sub> ≈ n!/e.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_addtops-genfun.html" target="_blank" rel="noopener">Levin, DMOI 6.1 — Generating Functions</a></li><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_advPIE.html" target="_blank" rel="noopener">Levin, DMOI 3.8 — Advanced Counting Using PIE</a></li><li><a href="https://brilliant.org/wiki/derangements/" target="_blank" rel="noopener">Brilliant — Derangements</a></li><li><a href="https://cp-algorithms.com/combinatorics/inclusion-exclusion.html" target="_blank" rel="noopener">cp-algorithms — The Inclusion-Exclusion Principle</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Có bao nhiêu số trong 1..1000 chia hết cho 2, 3 hoặc 5?</li><li>Có bao nhiêu nghiệm của x<sub>1</sub> + x<sub>2</sub> + x<sub>3</sub> = 10 với 0 ≤ x<sub>i</sub> ≤ 4?</li><li>Tính D<sub>4</sub> và xác suất một hoán vị ngẫu nhiên của 4 phần tử không có điểm bất động.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 500 + 333 + 200 − 166 − 100 − 66 + 33 = 734. 2) Tổng C(12, 2) = 66; trừ nghiệm có x<sub>i</sub> ≥ 5: 3·C(7, 2) = 63; cộng lại khi hai biến ≥ 5: 3·C(2, 2) = 3 ⇒ 66 − 63 + 3 = 6. 3) D<sub>4</sub> = 9, xác suất 9/24 = 0,375.</p></div>`);

const q8 = QZ(8, 'Quiz — Chapter 8: Recurrences and advanced counting|||Quiz — Chương 8: Truy hồi và đếm nâng cao', 'Kiểm tra chương 8: lập truy hồi, phương trình đặc trưng, nghiệm kép, nghiệm riêng, định lý Master, hàm sinh, bao hàm – loại trừ, số mất thứ tự.', [
  Q('q1', 'Moves needed for the Tower of Hanoi with 7 discs:|||Số nước cần cho tháp Hà Nội 7 đĩa:',
    ['49|||49', '64|||64', '127|||127', '128|||128'], 2,
    'H(n) = 2ⁿ − 1 = 127.|||H(n) = 2ⁿ − 1 = 127.'),
  Q('q2', 'Bit strings of length 5 with no two consecutive 0s:|||Số chuỗi bit độ dài 5 không có hai số 0 liền nhau:',
    ['8|||8', '13|||13', '21|||21', '16|||16'], 1,
    'a(n) = a(n−1) + a(n−2), a(1) = 2, a(2) = 3 gives 2, 3, 5, 8, 13.|||a(n) = a(n−1) + a(n−2), a(1) = 2, a(2) = 3 cho 2, 3, 5, 8, 13.'),
  Q('q3', 'The solution of a(n) = a(n−1) + 2a(n−2), a(0) = 2, a(1) = 7 is|||Nghiệm của a(n) = a(n−1) + 2a(n−2), a(0) = 2, a(1) = 7 là',
    ['2ⁿ + (−1)ⁿ|||2ⁿ + (−1)ⁿ', '3·2ⁿ − (−1)ⁿ|||3·2ⁿ − (−1)ⁿ', '(n + 2)2ⁿ|||(n + 2)2ⁿ', '7·2ⁿ⁻¹|||7·2ⁿ⁻¹'], 1,
    'Roots 2 and −1; constants 3 and −1.|||Nghiệm 2 và −1; hằng số 3 và −1.'),
  Q('q4', 'Characteristic equation r² − 6r + 9 = 0 gives general solution|||Phương trình đặc trưng r² − 6r + 9 = 0 cho nghiệm tổng quát',
    ['α·3ⁿ|||α·3ⁿ', '(α + βn)3ⁿ|||(α + βn)3ⁿ', 'α3ⁿ + β(−3)ⁿ|||α3ⁿ + β(−3)ⁿ', 'α + βn|||α + βn'], 1,
    'Repeated root 3 needs the extra n·3ⁿ term.|||Nghiệm kép 3 cần thêm số hạng n·3ⁿ.'),
  Q('q5', 'By the Master theorem, T(n) = 2T(n/2) + n is|||Theo định lý Master, T(n) = 2T(n/2) + n là',
    ['Θ(n)|||Θ(n)', 'Θ(n log n)|||Θ(n log n)', 'Θ(n²)|||Θ(n²)', 'Θ(log n)|||Θ(log n)'], 1,
    'a = 2 = b^d with b = 2, d = 1: Θ(n^d log n).|||a = 2 = b^d với b = 2, d = 1: Θ(n^d log n).'),
  Q('q6', 'Strassen’s recurrence T(n) = 7T(n/2) + n² solves to|||Truy hồi Strassen T(n) = 7T(n/2) + n² có nghiệm',
    ['Θ(n²)|||Θ(n²)', 'Θ(n² log n)|||Θ(n² log n)', 'Θ(n^(log₂ 7)) ≈ Θ(n^2.807)|||Θ(n^(log₂ 7)) ≈ Θ(n^2.807)', 'Θ(n³)|||Θ(n³)'], 2,
    '7 exceeds 2² = 4, so the leaves dominate.|||7 lớn hơn 2² = 4 nên các lá chiếm ưu thế.'),
  Q('q7', 'Number of onto functions from a 6-element set to a 3-element set:|||Số toàn ánh từ tập 6 phần tử lên tập 3 phần tử:',
    ['729|||729', '540|||540', '90|||90', '120|||120'], 1,
    '3⁶ − 3·2⁶ + 3·1⁶ = 540.|||3⁶ − 3·2⁶ + 3·1⁶ = 540.'),
  Q('q8', 'The number of derangements of 5 objects is|||Số mất thứ tự của 5 phần tử là',
    ['24|||24', '44|||44', '60|||60', '120|||120'], 1,
    'D(5) = round(5!/e) = 44.|||D(5) = round(5!/e) = 44.'),
  Q('q9', 'The coefficient of xʳ in 1/(1 − x)ⁿ is|||Hệ số của xʳ trong 1/(1 − x)ⁿ là',
    ['C(n, r)|||C(n, r)', 'C(n + r − 1, r)|||C(n + r − 1, r)', 'nʳ|||nʳ', 'r!|||r!'], 1,
    'It counts multisets of size r from n types (stars and bars).|||Nó đếm đa tập cỡ r từ n loại (sao và vạch).'),
]);

const ch8 = {
  title: 'Chapter 8 — Recurrences and advanced counting|||Chương 8 — Hệ thức truy hồi và đếm nâng cao',
  description: 'Lập hệ thức truy hồi, giải truy hồi tuyến tính thuần nhất và không thuần nhất, chia để trị và định lý Master, hàm sinh, bao hàm – loại trừ, toàn ánh, số mất thứ tự (Rosen ch. 8 · MCS ch. 16, 22).',
  lessons: [c81, c82, c83, c84, q8],
};

// ───────────────────────────── Chương 9 — Xác suất rời rạc ─────────────────────────────
const c91 = L('mad102-ts-9-1',
  '9.1 — Finite probability: sample spaces, events and the birthday problem|||9.1 — Xác suất hữu hạn: không gian mẫu, biến cố và bài toán ngày sinh',
  'Không gian mẫu, biến cố, xác suất cổ điển (Laplace) và tiên đề, biến cố bù, hợp, bài toán ngày sinh (n = 23 ⇒ ≈ 0,507) tính chính xác và mô phỏng Monte Carlo có seed, xổ số 6/45, liên hệ va chạm băm.',
  `<span class="eyebrow">MAD102 · Chapter 9 · Lesson 9.1</span>
<h2>Finite probability: sample spaces, events and the birthday problem</h2>
<p class="lead">Discrete probability is counting divided by counting. With Chapter 7 in hand you can already compute lottery odds, the chance of a hash collision and the success rate of a randomized algorithm — as long as you define the sample space carefully.</p>
<h3>🎯 Objectives</h3>
<ul><li>Model an experiment with a sample space and events; use Laplace's definition and the axioms.</li><li>Use complements and the union rule to compute probabilities.</li><li>Solve the birthday problem exactly and by simulation, and relate it to hash collisions.</li></ul>
<h3>📖 Lecture</h3>
<p>An <strong>experiment</strong> has a <strong>sample space</strong> S of possible outcomes; an <strong>event</strong> is a subset E ⊆ S. If all outcomes are equally likely (Laplace), p(E) = |E|/|S|. In general a probability distribution assigns p(s) ≥ 0 to each outcome with Σ p(s) = 1, and p(E) = Σ<sub>s∈E</sub> p(s).</p>
<div class="formula"><span class="lbl">Rules</span>p(Ē) = 1 − p(E)      p(E<sub>1</sub> ∪ E<sub>2</sub>) = p(E<sub>1</sub>) + p(E<sub>2</sub>) − p(E<sub>1</sub> ∩ E<sub>2</sub>)<br>If E<sub>1</sub>, E<sub>2</sub>, … are pairwise disjoint: p(∪E<sub>i</sub>) = Σ p(E<sub>i</sub>)</div>
<p>The most common error is a sample space whose outcomes are <em>not</em> equally likely. Rolling two dice, the sums 2, …, 12 are not equally likely; the 36 ordered pairs are. Always count in the space where symmetry really holds.</p>
<p><strong>The birthday problem.</strong> With n people and 365 equally likely birthdays, the probability that all birthdays differ is (365/365)(364/365)…((365 − n + 1)/365). The complement — some two share — exceeds 1/2 already at n = 23. The reason: there are C(23, 2) = 253 pairs, each with chance 1/365 of matching.</p>
<p><strong>Why CS cares.</strong> A hash function with N possible outputs starts producing collisions after about √N inputs (the “birthday bound”): with 64-bit hashes, after roughly 2<sup>32</sup> ≈ 4·10<sup>9</sup> items. That is why cryptographic hashes need 256 bits for 128-bit security.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — lottery.</b> Vietlott Mega 6/45: choose 6 of 45 numbers. One ticket wins the jackpot with probability 1/C(45, 6) = 1/8 145 060.</p></div>
<div class="callout"><p><b>Example 2 — complement.</b> Probability that a random 8-bit string contains at least one 1: 1 − (1/2)<sup>8</sup> = 255/256.</p></div>
<div class="callout"><p><b>Example 3 — two dice.</b> p(sum = 7) = 6/36 = 1/6 (pairs (1,6), (2,5), …, (6,1)); p(sum = 2) = 1/36.</p></div>
<div class="callout"><p><b>Example 4 — birthday, exact and simulated.</b> The simulation uses a fixed seed so that you get the same output when you run it.</p></div>
<pre><code class="language-python">import random
from math import comb, prod

def p_shared(n, days=365):
    """Exact probability that at least two of n people share a birthday."""
    return 1 - prod((days - i) / days for i in range(n))

for n in [10, 23, 30, 50, 70]:
    print(n, round(p_shared(n), 4))

random.seed(2026)
trials = 100_000
hits = sum(len(set(random.randrange(365) for _ in range(23))) &lt; 23 for _ in range(trials))
print("simulation n=23:", hits / trials)
print("Vietlott 6/45 jackpot: 1 in", f"{comb(45, 6):,}")</code></pre>
<div class="out">10 0.1169
23 0.5073
30 0.7063
50 0.9704
70 0.9992
simulation n=23: 0.50396
Vietlott 6/45 jackpot: 1 in 8,145,060</div>
<p>The Monte Carlo estimate from 100 000 simulated groups of 23 is within 0.004 of the exact 0.5073. Simulation is a powerful check, but its error shrinks only like 1/√trials.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using an unequally likely sample space with Laplace's formula.</li><li>Adding probabilities of overlapping events without subtracting the intersection.</li><li>Thinking the birthday problem asks “someone shares <em>my</em> birthday” — that needs about 253 people for probability 1/2.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>p(E) = |E|/|S| when outcomes are equally likely.</li><li>Complement: p(Ē) = 1 − p(E); union: subtract the intersection.</li><li>Birthday: 23 people ⇒ ≈ 50.7% chance of a shared birthday.</li><li>Hash collisions appear after about √N items.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://discrete.openmathbooks.org/dmoi4/sec-counting-probability.html" target="_blank" rel="noopener">Levin, DMOI 3.7 — Applications to Probability</a></li><li><a href="https://en.wikipedia.org/wiki/Birthday_problem" target="_blank" rel="noopener">Wikipedia — Birthday problem</a></li><li><a href="https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/pages/readings/" target="_blank" rel="noopener">MIT 6.042J readings — Events and Probability Spaces (Ch. 17)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>A 4-digit PIN is chosen uniformly. What is the probability it has no repeated digit?</li><li>Two cards are drawn from a 52-card deck. What is the probability that both are hearts?</li><li>What is the probability that a random 5-card hand is a flush or contains the ace of spades? (Set up only.)</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 10·9·8·7/10<sup>4</sup> = 0.504. 2) C(13, 2)/C(52, 2) = 78/1326 = 1/17. 3) p(F) + p(A) − p(F ∩ A) with p(A) = 5/52, p(F) = 4·C(13, 5)/C(52, 5), p(F ∩ A) = C(12, 4)/C(52, 5).</p></div>`,
  `<span class="eyebrow">MAD102 · Chương 9 · Bài 9.1</span>
<h2>Xác suất hữu hạn: không gian mẫu, biến cố và bài toán ngày sinh</h2>
<p class="lead">Xác suất rời rạc là phép đếm chia cho phép đếm. Với Chương 7 trong tay, bạn đã tính được xác suất trúng xổ số, khả năng va chạm băm và tỉ lệ thành công của thuật toán ngẫu nhiên — miễn là định nghĩa không gian mẫu cẩn thận.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Mô hình hoá một phép thử bằng không gian mẫu và biến cố; dùng định nghĩa Laplace và các tiên đề.</li><li>Dùng biến cố bù và quy tắc hợp để tính xác suất.</li><li>Giải bài toán ngày sinh chính xác và bằng mô phỏng, liên hệ với va chạm băm.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Một <strong>phép thử</strong> có <strong>không gian mẫu</strong> S gồm các kết quả có thể; <strong>biến cố</strong> là tập con E ⊆ S. Nếu mọi kết quả đồng khả năng (Laplace) thì p(E) = |E|/|S|. Tổng quát, một phân phối xác suất gán p(s) ≥ 0 cho mỗi kết quả với Σ p(s) = 1, và p(E) = Σ<sub>s∈E</sub> p(s).</p>
<div class="formula"><span class="lbl">Quy tắc</span>p(Ē) = 1 − p(E)      p(E<sub>1</sub> ∪ E<sub>2</sub>) = p(E<sub>1</sub>) + p(E<sub>2</sub>) − p(E<sub>1</sub> ∩ E<sub>2</sub>)<br>Nếu E<sub>1</sub>, E<sub>2</sub>, … đôi một xung khắc: p(∪E<sub>i</sub>) = Σ p(E<sub>i</sub>)</div>
<p>Lỗi hay gặp nhất là không gian mẫu mà các kết quả <em>không</em> đồng khả năng. Gieo hai xúc xắc, các tổng 2, …, 12 không đồng khả năng; 36 cặp có thứ tự mới đồng khả năng. Luôn đếm trong không gian mà tính đối xứng thật sự đúng.</p>
<p><strong>Bài toán ngày sinh.</strong> Với n người và 365 ngày sinh đồng khả năng, xác suất mọi ngày sinh khác nhau là (365/365)(364/365)…((365 − n + 1)/365). Biến cố bù — có hai người trùng — vượt 1/2 ngay từ n = 23. Lý do: có C(23, 2) = 253 cặp, mỗi cặp có khả năng 1/365 trùng nhau.</p>
<p><strong>Vì sao dân CNTT quan tâm.</strong> Hàm băm có N giá trị đầu ra bắt đầu va chạm sau khoảng √N đầu vào (“cận ngày sinh”): với băm 64 bit là sau khoảng 2<sup>32</sup> ≈ 4·10<sup>9</sup> phần tử. Đó là lý do hàm băm mật mã cần 256 bit để có độ an toàn 128 bit.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — xổ số.</b> Vietlott Mega 6/45: chọn 6 trong 45 số. Một vé trúng giải độc đắc với xác suất 1/C(45, 6) = 1/8 145 060.</p></div>
<div class="callout"><p><b>Ví dụ 2 — biến cố bù.</b> Xác suất một chuỗi 8 bit ngẫu nhiên có ít nhất một bit 1: 1 − (1/2)<sup>8</sup> = 255/256.</p></div>
<div class="callout"><p><b>Ví dụ 3 — hai xúc xắc.</b> p(tổng = 7) = 6/36 = 1/6 (các cặp (1,6), (2,5), …, (6,1)); p(tổng = 2) = 1/36.</p></div>
<div class="callout"><p><b>Ví dụ 4 — ngày sinh, chính xác và mô phỏng.</b> Mô phỏng dùng seed cố định để bạn chạy lại được đúng kết quả này.</p></div>
<pre><code class="language-python">import random
from math import comb, prod

def p_shared(n, days=365):
    """Exact probability that at least two of n people share a birthday."""
    return 1 - prod((days - i) / days for i in range(n))

for n in [10, 23, 30, 50, 70]:
    print(n, round(p_shared(n), 4))

random.seed(2026)
trials = 100_000
hits = sum(len(set(random.randrange(365) for _ in range(23))) &lt; 23 for _ in range(trials))
print("simulation n=23:", hits / trials)
print("Vietlott 6/45 jackpot: 1 in", f"{comb(45, 6):,}")</code></pre>
<div class="out">10 0.1169
23 0.5073
30 0.7063
50 0.9704
70 0.9992
simulation n=23: 0.50396
Vietlott 6/45 jackpot: 1 in 8,145,060</div>
<p>Ước lượng Monte Carlo từ 100 000 nhóm 23 người mô phỏng lệch không quá 0,004 so với giá trị chính xác 0,5073. Mô phỏng là cách kiểm tra mạnh, nhưng sai số chỉ giảm như 1/√(số lần thử).</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng công thức Laplace trên không gian mẫu không đồng khả năng.</li><li>Cộng xác suất các biến cố chồng nhau mà không trừ phần giao.</li><li>Nghĩ bài toán ngày sinh hỏi “có người trùng ngày sinh <em>với tôi</em>” — câu đó cần khoảng 253 người mới đạt xác suất 1/2.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>p(E) = |E|/|S| khi các kết quả đồng khả năng.</li><li>Bù: p(Ē) = 1 − p(E); hợp: trừ phần giao.</li><li>Ngày sinh: 23 người ⇒ khoảng 50,7% có người trùng.</li><li>Va chạm băm xuất hiện sau khoảng √N phần tử.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://discrete.openmathbooks.org/dmoi4/sec-counting-probability.html" target="_blank" rel="noopener">Levin, DMOI 3.7 — Applications to Probability</a></li><li><a href="https://en.wikipedia.org/wiki/Birthday_problem" target="_blank" rel="noopener">Wikipedia — Birthday problem</a></li><li><a href="https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/pages/readings/" target="_blank" rel="noopener">MIT 6.042J readings — Events and Probability Spaces (Ch. 17)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Mã PIN 4 chữ số được chọn ngẫu nhiên đều. Xác suất không có chữ số lặp là bao nhiêu?</li><li>Rút hai lá từ bộ bài 52 lá. Xác suất cả hai là cơ là bao nhiêu?</li><li>Xác suất một bộ 5 lá ngẫu nhiên là thùng (flush) hoặc có át bích là bao nhiêu? (Chỉ lập công thức.)</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 10·9·8·7/10<sup>4</sup> = 0,504. 2) C(13, 2)/C(52, 2) = 78/1326 = 1/17. 3) p(F) + p(A) − p(F ∩ A) với p(A) = 5/52, p(F) = 4·C(13, 5)/C(52, 5), p(F ∩ A) = C(12, 4)/C(52, 5).</p></div>`);

const c92 = L('mad102-ts-9-2',
  '9.2 — Conditional probability, independence and Bayes’ theorem|||9.2 — Xác suất có điều kiện, độc lập và định lý Bayes',
  'Xác suất có điều kiện, quy tắc nhân, độc lập, công thức xác suất toàn phần, định lý Bayes (xét nghiệm hiếm: dương tính vẫn chỉ ≈ 0,2%), bộ lọc thư rác, bài toán Monty Hall mô phỏng bằng Python.',
  `<span class="eyebrow">MAD102 · Chapter 9 · Lesson 9.2</span>
<h2>Conditional probability, independence and Bayes’ theorem</h2>
<p class="lead">Information changes probabilities. A positive medical test, a word in an e-mail, a door opened by a game-show host — conditional probability says how much each should change your belief, and Bayes' theorem is the formula behind spam filters and many machine-learning classifiers.</p>
<h3>🎯 Objectives</h3>
<ul><li>Compute conditional probabilities and use the multiplication rule.</li><li>Test independence of events.</li><li>Apply the law of total probability and Bayes' theorem, and avoid the base-rate fallacy.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Conditional probability</span>p(E | F) = p(E ∩ F)/p(F)   (p(F) &gt; 0)      Multiplication rule: p(E ∩ F) = p(E | F)·p(F)</div>
<p>Conditioning on F shrinks the sample space to F. Example: a family has two children; given that at least one is a boy, the probability that both are boys is 1/3 (the space is {BB, BG, GB}), not 1/2.</p>
<p>E and F are <strong>independent</strong> if p(E ∩ F) = p(E)p(F), equivalently p(E | F) = p(E). Independent ≠ disjoint: disjoint events with positive probability are strongly <em>dependent</em> (if one happens the other cannot). Repeated coin flips are independent; drawing cards without replacement is not. <strong>Bernoulli trials</strong>: n independent trials, each a success with probability p; then p(exactly k successes) = C(n, k)p<sup>k</sup>(1 − p)<sup>n−k</sup> (the binomial distribution).</p>
<div class="formula"><span class="lbl">Total probability and Bayes</span>p(F) = p(F | E)p(E) + p(F | Ē)p(Ē)<br>p(E | F) = p(F | E)p(E) / [p(F | E)p(E) + p(F | Ē)p(Ē)]</div>
<p>Bayes reverses a conditional: we usually know p(evidence | cause) and want p(cause | evidence). The answer depends heavily on the <strong>base rate</strong> p(E).</p>
<p><strong>Naive Bayes spam filter.</strong> For a word w, estimate p(w | spam) and p(w | ham) from labelled mail; with equal priors, p(spam | w) = p(w | spam)/(p(w | spam) + p(w | ham)). Several words are combined by assuming they are independent given the class — “naive”, but it works remarkably well.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — rare disease (Rosen).</b> 1 person in 100 000 has the disease. The test detects it 99% of the time and gives a false positive 0.5% of the time. Given a positive test: p(D | +) = 0.99·0.00001 / (0.99·0.00001 + 0.005·0.99999) ≈ 0.002. Almost all positives are false, because healthy people vastly outnumber sick ones.</p></div>
<div class="callout"><p><b>Example 2 — Monty Hall.</b> A car is behind one of 3 doors. You pick one; the host, who knows, opens another door with a goat and offers a switch. Staying wins with probability 1/3, switching with 2/3: switching wins exactly when your first pick was wrong.</p></div>
<pre><code class="language-python">import random
p_d = 1 / 100_000          # prevalence
sens = 0.99                # P(+ | D)
fpr = 0.005                # P(+ | not D)
p_pos = sens * p_d + fpr * (1 - p_d)          # law of total probability
print("P(+) =", round(p_pos, 6))
print("P(D | +) =", round(sens * p_d / p_pos, 6))
print("P(not D | -) =", round((1 - fpr) * (1 - p_d) / (1 - p_pos), 8))

random.seed(42)
def monty(switch, trials=100_000):
    win = 0
    for _ in range(trials):
        car, pick = random.randrange(3), random.randrange(3)
        opened = next(d for d in range(3) if d != pick and d != car)
        if switch:
            pick = next(d for d in range(3) if d != pick and d != opened)
        win += (pick == car)
    return win / trials
print("stay:", monty(False), " switch:", monty(True))</code></pre>
<div class="out">P(+) = 0.00501
P(D | +) = 0.001976
P(not D | -) = 0.9999999
stay: 0.33456  switch: 0.66732</div>
<p>The exact Bayes computation gives 0.198% for a positive result, while a negative result is almost certainly correct; the Monty Hall simulation matches 1/3 vs 2/3.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Confusing p(A | B) with p(B | A) (the “prosecutor's fallacy”).</li><li>Ignoring the base rate when interpreting a test result.</li><li>Assuming disjoint events are independent.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>p(E | F) = p(E ∩ F)/p(F); multiplication rule.</li><li>Independent ⇔ p(E ∩ F) = p(E)p(F).</li><li>Bayes = total probability in the denominator; base rates matter.</li><li>Binomial: C(n, k)p<sup>k</sup>(1 − p)<sup>n−k</sup>.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://brilliant.org/wiki/bayes-theorem/" target="_blank" rel="noopener">Brilliant — Bayes' Theorem and Conditional Probability</a></li><li><a href="https://www.3blue1brown.com/lessons/bayes-theorem" target="_blank" rel="noopener">3Blue1Brown — Bayes' theorem (visual explanation)</a></li><li><a href="https://en.wikipedia.org/wiki/Monty_Hall_problem" target="_blank" rel="noopener">Wikipedia — Monty Hall problem</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>A fair coin is flipped 10 times. What is the probability of exactly 3 heads?</li><li>Are the events “first die is 6” and “sum of two dice is 7” independent?</li><li>40% of mail is spam. The word “free” appears in 30% of spam and 2% of ham. Find p(spam | “free”).</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) C(10, 3)/2<sup>10</sup> = 120/1024 = 15/128 ≈ 0.117. 2) Yes: p = 1/6 each and p(both) = 1/36 = (1/6)(1/6). 3) 0.3·0.4 / (0.3·0.4 + 0.02·0.6) = 0.12/0.132 ≈ 0.909.</p></div>`,
  `<span class="eyebrow">MAD102 · Chương 9 · Bài 9.2</span>
<h2>Xác suất có điều kiện, độc lập và định lý Bayes</h2>
<p class="lead">Thông tin làm thay đổi xác suất. Một kết quả xét nghiệm dương tính, một từ trong email, một cánh cửa người dẫn chương trình mở ra — xác suất có điều kiện cho biết mỗi thứ nên thay đổi niềm tin của bạn bao nhiêu, và định lý Bayes là công thức đứng sau bộ lọc thư rác cùng nhiều bộ phân loại học máy.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính xác suất có điều kiện và dùng quy tắc nhân.</li><li>Kiểm tra tính độc lập của các biến cố.</li><li>Áp dụng công thức xác suất toàn phần và định lý Bayes, tránh ngụy biện bỏ qua tỉ lệ nền.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Xác suất có điều kiện</span>p(E | F) = p(E ∩ F)/p(F)   (p(F) &gt; 0)      Quy tắc nhân: p(E ∩ F) = p(E | F)·p(F)</div>
<p>Điều kiện F thu hẹp không gian mẫu về F. Ví dụ: một gia đình có hai con; biết ít nhất một con là trai, xác suất cả hai là trai là 1/3 (không gian {TT, TG, GT}), không phải 1/2.</p>
<p>E và F <strong>độc lập</strong> nếu p(E ∩ F) = p(E)p(F), tương đương p(E | F) = p(E). Độc lập ≠ xung khắc: hai biến cố xung khắc có xác suất dương thì <em>phụ thuộc</em> mạnh (cái này xảy ra thì cái kia không thể). Các lần tung đồng xu là độc lập; rút bài không hoàn lại thì không. <strong>Phép thử Bernoulli</strong>: n phép thử độc lập, mỗi lần thành công với xác suất p; khi đó p(đúng k lần thành công) = C(n, k)p<sup>k</sup>(1 − p)<sup>n−k</sup> (phân phối nhị thức).</p>
<div class="formula"><span class="lbl">Xác suất toàn phần và Bayes</span>p(F) = p(F | E)p(E) + p(F | Ē)p(Ē)<br>p(E | F) = p(F | E)p(E) / [p(F | E)p(E) + p(F | Ē)p(Ē)]</div>
<p>Bayes đảo chiều một xác suất có điều kiện: ta thường biết p(dấu hiệu | nguyên nhân) và muốn p(nguyên nhân | dấu hiệu). Đáp án phụ thuộc rất mạnh vào <strong>tỉ lệ nền</strong> p(E).</p>
<p><strong>Bộ lọc thư rác Naive Bayes.</strong> Với từ w, ước lượng p(w | spam) và p(w | thư thường) từ thư đã gán nhãn; với tiên nghiệm bằng nhau, p(spam | w) = p(w | spam)/(p(w | spam) + p(w | thư thường)). Nhiều từ được ghép bằng giả thiết chúng độc lập khi đã biết lớp — “ngây thơ”, nhưng chạy tốt bất ngờ.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — bệnh hiếm (Rosen).</b> 1 người trên 100 000 mắc bệnh. Xét nghiệm phát hiện đúng 99% ca bệnh và dương tính giả 0,5% ở người khoẻ. Biết kết quả dương tính: p(D | +) = 0,99·0,00001 / (0,99·0,00001 + 0,005·0,99999) ≈ 0,002. Gần như mọi ca dương tính là giả, vì người khoẻ đông hơn người bệnh rất nhiều.</p></div>
<div class="callout"><p><b>Ví dụ 2 — Monty Hall.</b> Ô tô nằm sau một trong 3 cửa. Bạn chọn một cửa; người dẫn, vốn biết trước, mở một cửa khác có dê và mời bạn đổi. Giữ nguyên thắng với xác suất 1/3, đổi thắng với 2/3: đổi thắng đúng khi lựa chọn đầu của bạn sai.</p></div>
<pre><code class="language-python">import random
p_d = 1 / 100_000          # prevalence
sens = 0.99                # P(+ | D)
fpr = 0.005                # P(+ | not D)
p_pos = sens * p_d + fpr * (1 - p_d)          # law of total probability
print("P(+) =", round(p_pos, 6))
print("P(D | +) =", round(sens * p_d / p_pos, 6))
print("P(not D | -) =", round((1 - fpr) * (1 - p_d) / (1 - p_pos), 8))

random.seed(42)
def monty(switch, trials=100_000):
    win = 0
    for _ in range(trials):
        car, pick = random.randrange(3), random.randrange(3)
        opened = next(d for d in range(3) if d != pick and d != car)
        if switch:
            pick = next(d for d in range(3) if d != pick and d != opened)
        win += (pick == car)
    return win / trials
print("stay:", monty(False), " switch:", monty(True))</code></pre>
<div class="out">P(+) = 0.00501
P(D | +) = 0.001976
P(not D | -) = 0.9999999
stay: 0.33456  switch: 0.66732</div>
<p>Phép tính Bayes chính xác cho 0,198% với kết quả dương tính, còn kết quả âm tính thì gần như chắc chắn đúng; mô phỏng Monty Hall khớp 1/3 và 2/3.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Nhầm p(A | B) với p(B | A) (“ngụy biện của công tố viên”).</li><li>Bỏ qua tỉ lệ nền khi đọc kết quả xét nghiệm.</li><li>Cho rằng hai biến cố xung khắc thì độc lập.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>p(E | F) = p(E ∩ F)/p(F); quy tắc nhân.</li><li>Độc lập ⇔ p(E ∩ F) = p(E)p(F).</li><li>Bayes = xác suất toàn phần ở mẫu số; tỉ lệ nền rất quan trọng.</li><li>Nhị thức: C(n, k)p<sup>k</sup>(1 − p)<sup>n−k</sup>.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://brilliant.org/wiki/bayes-theorem/" target="_blank" rel="noopener">Brilliant — Bayes' Theorem and Conditional Probability</a></li><li><a href="https://www.3blue1brown.com/lessons/bayes-theorem" target="_blank" rel="noopener">3Blue1Brown — Bayes' theorem (giải thích trực quan)</a></li><li><a href="https://en.wikipedia.org/wiki/Monty_Hall_problem" target="_blank" rel="noopener">Wikipedia — Monty Hall problem</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tung đồng xu cân đối 10 lần. Xác suất được đúng 3 mặt ngửa là bao nhiêu?</li><li>Hai biến cố “xúc xắc thứ nhất ra 6” và “tổng hai xúc xắc là 7” có độc lập không?</li><li>40% thư là spam. Từ “free” xuất hiện trong 30% thư spam và 2% thư thường. Tính p(spam | “free”).</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) C(10, 3)/2<sup>10</sup> = 120/1024 = 15/128 ≈ 0,117. 2) Có: mỗi biến cố có p = 1/6 và p(cả hai) = 1/36 = (1/6)(1/6). 3) 0,3·0,4 / (0,3·0,4 + 0,02·0,6) = 0,12/0,132 ≈ 0,909.</p></div>`);

const c93 = L('mad102-ts-9-3',
  '9.3 — Random variables, expectation and variance|||9.3 — Biến ngẫu nhiên, kỳ vọng và phương sai',
  'Biến ngẫu nhiên, phân phối, kỳ vọng, tuyến tính của kỳ vọng (biến chỉ thị), phân phối hình học, phương sai và độ lệch chuẩn, bất đẳng thức Markov/Chebyshev, phân tích trường hợp trung bình (số nghịch thế = n(n − 1)/4).',
  `<span class="eyebrow">MAD102 · Chapter 9 · Lesson 9.3</span>
<h2>Random variables, expectation and variance</h2>
<p class="lead">“How long does quicksort take on average?” “How many probes does a hash table need?” These are questions about the <strong>expected value</strong> of a random variable. Linearity of expectation makes many of them surprisingly easy.</p>
<h3>🎯 Objectives</h3>
<ul><li>Define random variables and compute expectations from distributions.</li><li>Use linearity of expectation with indicator variables.</li><li>Compute variance and apply Markov's and Chebyshev's inequalities.</li></ul>
<h3>📖 Lecture</h3>
<p>A <strong>random variable</strong> X is a function from the sample space to ℝ (e.g. the number of heads in 10 flips, the number of comparisons an algorithm makes on a random input). Its <strong>distribution</strong> is the list of pairs (r, p(X = r)).</p>
<div class="formula"><span class="lbl">Expectation</span>E(X) = Σ<sub>s∈S</sub> p(s)X(s) = Σ<sub>r</sub> r·p(X = r)<br>Linearity: E(X + Y) = E(X) + E(Y),  E(aX + b) = aE(X) + b — always, even if X and Y are dependent.</div>
<p><strong>Indicator trick.</strong> Write a count as a sum of 0/1 variables: X = I<sub>1</sub> + … + I<sub>n</sub>, where I<sub>j</sub> = 1 if “event j happens”. Then E(X) = Σ p(event j). Examples: the number of heads in n flips has expectation np; the number of fixed points of a random permutation has expectation n·(1/n) = 1; the number of <strong>inversions</strong> (pairs out of order) of a random permutation has expectation C(n, 2)·(1/2) = n(n − 1)/4 — so insertion sort makes about n<sup>2</sup>/4 comparisons on average, half of its worst case.</p>
<p><strong>Geometric distribution.</strong> If each independent trial succeeds with probability p, the number of trials until the first success has p(X = k) = (1 − p)<sup>k−1</sup>p and E(X) = 1/p. Example: a randomized algorithm that succeeds with probability 1/4 per run needs 4 runs on average.</p>
<div class="formula"><span class="lbl">Variance</span>V(X) = E((X − E(X))<sup>2</sup>) = E(X<sup>2</sup>) − E(X)<sup>2</sup>,  σ(X) = √V(X)<br>If X, Y are independent: V(X + Y) = V(X) + V(Y). Binomial: V = np(1 − p).</div>
<p><strong>Tail bounds.</strong> Markov: for X ≥ 0, p(X ≥ a) ≤ E(X)/a. Chebyshev: p(|X − E(X)| ≥ r) ≤ V(X)/r<sup>2</sup>. They guarantee that a randomized algorithm rarely takes much longer than its expected time.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — one die.</b> E(X) = (1 + … + 6)/6 = 7/2; E(X<sup>2</sup>) = 91/6; V(X) = 91/6 − 49/4 = 35/12. Sum of two dice: E = 7 by linearity, V = 35/6 by independence.</p></div>
<div class="callout"><p><b>Example 2 — verifying linearity by brute force.</b> Average fixed points and inversions over all permutations of n items:</p></div>
<pre><code class="language-python">from fractions import Fraction as F
from itertools import permutations
from math import comb

die = range(1, 7)
E = sum(F(x, 6) for x in die)
V = sum(F(x * x, 6) for x in die) - E**2
print("one die: E =", E, " V =", V)
print("sum of two dice: E =", sum(F(a + b, 36) for a in die for b in die))

# expected number of fixed points of a random permutation of n items = 1
for n in [3, 5, 7]:
    perms = list(permutations(range(n)))
    fixed = sum(sum(p[i] == i for i in range(n)) for p in perms)
    inv = sum(sum(p[i] &gt; p[j] for i in range(n) for j in range(i + 1, n)) for p in perms)
    print(n, "E[fixed] =", F(fixed, len(perms)), " E[inversions] =", F(inv, len(perms)),
          " n(n-1)/4 =", F(n * (n - 1), 4))

# binomial: P(exactly 3 heads in 10 fair flips)
print(F(comb(10, 3), 2**10), float(F(comb(10, 3), 2**10)))</code></pre>
<div class="out">one die: E = 7/2  V = 35/12
sum of two dice: E = 7
3 E[fixed] = 1  E[inversions] = 3/2  n(n-1)/4 = 3/2
5 E[fixed] = 1  E[inversions] = 5  n(n-1)/4 = 5
7 E[fixed] = 1  E[inversions] = 21/2  n(n-1)/4 = 21/2
15/128 0.1171875</div>
<p>Exact fractions confirm E = 7/2, V = 35/12, E[fixed points] = 1 for every n, and E[inversions] = n(n − 1)/4; the last line is p(exactly 3 heads in 10 flips) = 15/128.</p>
<div class="callout"><p><b>Example 3 — Chebyshev.</b> 100 fair coin flips: E = 50, V = 25. p(|X − 50| ≥ 10) ≤ 25/100 = 0.25 (the true value is much smaller, about 0.057 — Chebyshev is a guarantee, not an estimate).</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Thinking linearity needs independence — it does not; additivity of <em>variance</em> does.</li><li>Writing E(XY) = E(X)E(Y) for dependent variables.</li><li>Confusing V(X) with σ(X) (units squared vs original units).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>E(X) = Σ r·p(X = r); linear always.</li><li>Indicator variables turn counts into sums of probabilities.</li><li>Geometric: E = 1/p; binomial: E = np, V = np(1 − p).</li><li>V(X) = E(X<sup>2</sup>) − E(X)<sup>2</sup>; Markov and Chebyshev bound tails.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://brilliant.org/wiki/linearity-of-expectation/" target="_blank" rel="noopener">Brilliant — Linearity of Expectation</a></li><li><a href="https://brilliant.org/wiki/expected-value/" target="_blank" rel="noopener">Brilliant — Expected Value</a></li><li><a href="https://en.wikipedia.org/wiki/Variance" target="_blank" rel="noopener">Wikipedia — Variance</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>n balls are thrown independently into n bins. What is the expected number of empty bins?</li><li>X is the number of 6s in 12 rolls of a die. Find E(X) and V(X).</li><li>A hash table lookup succeeds on each probe with probability 0.8. Expected number of probes?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) n(1 − 1/n)<sup>n</sup> ≈ n/e. 2) E = 12·1/6 = 2, V = 12·(1/6)(5/6) = 5/3. 3) 1/0.8 = 1.25.</p></div>`,
  `<span class="eyebrow">MAD102 · Chương 9 · Bài 9.3</span>
<h2>Biến ngẫu nhiên, kỳ vọng và phương sai</h2>
<p class="lead">“Quicksort chạy trung bình bao lâu?” “Bảng băm cần bao nhiêu lần dò?” Đó là các câu hỏi về <strong>kỳ vọng</strong> của một biến ngẫu nhiên. Tính tuyến tính của kỳ vọng làm nhiều câu trong số đó dễ bất ngờ.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Định nghĩa biến ngẫu nhiên và tính kỳ vọng từ phân phối.</li><li>Dùng tính tuyến tính của kỳ vọng với biến chỉ thị.</li><li>Tính phương sai và áp dụng bất đẳng thức Markov, Chebyshev.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Biến ngẫu nhiên</strong> X là hàm từ không gian mẫu vào ℝ (vd số mặt ngửa trong 10 lần tung, số phép so sánh thuật toán làm trên đầu vào ngẫu nhiên). <strong>Phân phối</strong> của nó là danh sách các cặp (r, p(X = r)).</p>
<div class="formula"><span class="lbl">Kỳ vọng</span>E(X) = Σ<sub>s∈S</sub> p(s)X(s) = Σ<sub>r</sub> r·p(X = r)<br>Tuyến tính: E(X + Y) = E(X) + E(Y),  E(aX + b) = aE(X) + b — luôn đúng, kể cả khi X, Y phụ thuộc.</div>
<p><strong>Mẹo biến chỉ thị.</strong> Viết một số đếm thành tổng các biến 0/1: X = I<sub>1</sub> + … + I<sub>n</sub>, với I<sub>j</sub> = 1 nếu “sự kiện j xảy ra”. Khi đó E(X) = Σ p(sự kiện j). Ví dụ: số mặt ngửa trong n lần tung có kỳ vọng np; số điểm bất động của hoán vị ngẫu nhiên có kỳ vọng n·(1/n) = 1; số <strong>nghịch thế</strong> (cặp sai thứ tự) của hoán vị ngẫu nhiên có kỳ vọng C(n, 2)·(1/2) = n(n − 1)/4 — nên insertion sort trung bình làm khoảng n<sup>2</sup>/4 phép so sánh, bằng nửa trường hợp xấu nhất.</p>
<p><strong>Phân phối hình học.</strong> Nếu mỗi phép thử độc lập thành công với xác suất p thì số lần thử tới khi thành công lần đầu có p(X = k) = (1 − p)<sup>k−1</sup>p và E(X) = 1/p. Ví dụ: thuật toán ngẫu nhiên thành công với xác suất 1/4 mỗi lần chạy cần trung bình 4 lần chạy.</p>
<div class="formula"><span class="lbl">Phương sai</span>V(X) = E((X − E(X))<sup>2</sup>) = E(X<sup>2</sup>) − E(X)<sup>2</sup>,  σ(X) = √V(X)<br>Nếu X, Y độc lập: V(X + Y) = V(X) + V(Y). Nhị thức: V = np(1 − p).</div>
<p><strong>Chặn đuôi.</strong> Markov: với X ≥ 0, p(X ≥ a) ≤ E(X)/a. Chebyshev: p(|X − E(X)| ≥ r) ≤ V(X)/r<sup>2</sup>. Chúng bảo đảm thuật toán ngẫu nhiên hiếm khi chạy lâu hơn nhiều so với thời gian kỳ vọng.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — một xúc xắc.</b> E(X) = (1 + … + 6)/6 = 7/2; E(X<sup>2</sup>) = 91/6; V(X) = 91/6 − 49/4 = 35/12. Tổng hai xúc xắc: E = 7 nhờ tuyến tính, V = 35/6 nhờ độc lập.</p></div>
<div class="callout"><p><b>Ví dụ 2 — kiểm tính tuyến tính bằng vét cạn.</b> Trung bình số điểm bất động và số nghịch thế trên mọi hoán vị của n phần tử:</p></div>
<pre><code class="language-python">from fractions import Fraction as F
from itertools import permutations
from math import comb

die = range(1, 7)
E = sum(F(x, 6) for x in die)
V = sum(F(x * x, 6) for x in die) - E**2
print("one die: E =", E, " V =", V)
print("sum of two dice: E =", sum(F(a + b, 36) for a in die for b in die))

# expected number of fixed points of a random permutation of n items = 1
for n in [3, 5, 7]:
    perms = list(permutations(range(n)))
    fixed = sum(sum(p[i] == i for i in range(n)) for p in perms)
    inv = sum(sum(p[i] &gt; p[j] for i in range(n) for j in range(i + 1, n)) for p in perms)
    print(n, "E[fixed] =", F(fixed, len(perms)), " E[inversions] =", F(inv, len(perms)),
          " n(n-1)/4 =", F(n * (n - 1), 4))

# binomial: P(exactly 3 heads in 10 fair flips)
print(F(comb(10, 3), 2**10), float(F(comb(10, 3), 2**10)))</code></pre>
<div class="out">one die: E = 7/2  V = 35/12
sum of two dice: E = 7
3 E[fixed] = 1  E[inversions] = 3/2  n(n-1)/4 = 3/2
5 E[fixed] = 1  E[inversions] = 5  n(n-1)/4 = 5
7 E[fixed] = 1  E[inversions] = 21/2  n(n-1)/4 = 21/2
15/128 0.1171875</div>
<p>Phân số chính xác khẳng định E = 7/2, V = 35/12, E[điểm bất động] = 1 với mọi n, và E[nghịch thế] = n(n − 1)/4; dòng cuối là p(đúng 3 mặt ngửa trong 10 lần tung) = 15/128.</p>
<div class="callout"><p><b>Ví dụ 3 — Chebyshev.</b> 100 lần tung đồng xu cân đối: E = 50, V = 25. p(|X − 50| ≥ 10) ≤ 25/100 = 0,25 (giá trị thật nhỏ hơn nhiều, khoảng 0,057 — Chebyshev là bảo đảm, không phải ước lượng).</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Nghĩ tính tuyến tính cần độc lập — không cần; tính cộng của <em>phương sai</em> mới cần.</li><li>Viết E(XY) = E(X)E(Y) cho biến phụ thuộc.</li><li>Nhầm V(X) với σ(X) (đơn vị bình phương và đơn vị gốc).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>E(X) = Σ r·p(X = r); luôn tuyến tính.</li><li>Biến chỉ thị biến số đếm thành tổng xác suất.</li><li>Hình học: E = 1/p; nhị thức: E = np, V = np(1 − p).</li><li>V(X) = E(X<sup>2</sup>) − E(X)<sup>2</sup>; Markov và Chebyshev chặn đuôi.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://brilliant.org/wiki/linearity-of-expectation/" target="_blank" rel="noopener">Brilliant — Linearity of Expectation</a></li><li><a href="https://brilliant.org/wiki/expected-value/" target="_blank" rel="noopener">Brilliant — Expected Value</a></li><li><a href="https://en.wikipedia.org/wiki/Variance" target="_blank" rel="noopener">Wikipedia — Variance</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Ném độc lập n quả bóng vào n hộp. Kỳ vọng số hộp rỗng là bao nhiêu?</li><li>X là số lần ra mặt 6 trong 12 lần gieo xúc xắc. Tính E(X) và V(X).</li><li>Mỗi lần dò bảng băm thành công với xác suất 0,8. Kỳ vọng số lần dò?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) n(1 − 1/n)<sup>n</sup> ≈ n/e. 2) E = 12·1/6 = 2, V = 12·(1/6)(5/6) = 5/3. 3) 1/0,8 = 1,25.</p></div>`);

const q9 = QZ(9, 'Quiz — Chapter 9: Discrete probability|||Quiz — Chương 9: Xác suất rời rạc', 'Kiểm tra chương 9: Laplace, biến cố bù, ngày sinh, xác suất có điều kiện, độc lập, Bayes, Monty Hall, kỳ vọng, tuyến tính, phương sai.', [
  Q('q1', 'Probability that the sum of two fair dice is 7:|||Xác suất tổng hai xúc xắc cân đối bằng 7:',
    ['1/11|||1/11', '1/6|||1/6', '7/36|||7/36', '1/12|||1/12'], 1,
    '6 of the 36 equally likely ordered pairs.|||6 trong 36 cặp có thứ tự đồng khả năng.'),
  Q('q2', 'The smallest group size for which a shared birthday is more likely than not:|||Cỡ nhóm nhỏ nhất để khả năng có người trùng ngày sinh vượt 50%:',
    ['23|||23', '183|||183', '50|||50', '366|||366'], 0,
    'For n = 23 the probability is about 0.507.|||Với n = 23 xác suất khoảng 0,507.'),
  Q('q3', 'A family has two children, at least one a boy. Probability both are boys?|||Gia đình có hai con, ít nhất một trai. Xác suất cả hai là trai?',
    ['1/2|||1/2', '1/3|||1/3', '1/4|||1/4', '2/3|||2/3'], 1,
    'Conditioned space {BB, BG, GB}.|||Không gian có điều kiện {TT, TG, GT}.'),
  Q('q4', 'Two events with positive probability that are disjoint are|||Hai biến cố có xác suất dương và xung khắc thì',
    ['always independent|||luôn độc lập', 'never independent|||không bao giờ độc lập', 'independent iff equal|||độc lập khi và chỉ khi bằng nhau', 'complements|||là bù của nhau'], 1,
    'p(E ∩ F) = 0 but p(E)p(F) is positive.|||p(E ∩ F) = 0 nhưng p(E)p(F) dương.'),
  Q('q5', 'Disease rate 1/100000, sensitivity 99%, false-positive rate 0.5%. p(disease | positive) is about|||Tỉ lệ bệnh 1/100000, độ nhạy 99%, dương tính giả 0,5%. p(bệnh | dương tính) khoảng',
    ['99%|||99%', '50%|||50%', '0.2%|||0,2%', '0.5%|||0,5%'], 2,
    'Bayes: 0.99·0.00001 / 0.00501 ≈ 0.002.|||Bayes: 0,99·0,00001 / 0,00501 ≈ 0,002.'),
  Q('q6', 'In the Monty Hall problem, switching wins with probability|||Trong bài toán Monty Hall, đổi cửa thắng với xác suất',
    ['1/3|||1/3', '1/2|||1/2', '2/3|||2/3', '1|||1'], 2,
    'Switching wins exactly when the first choice was wrong.|||Đổi cửa thắng đúng khi lựa chọn đầu sai.'),
  Q('q7', 'Expected number of fixed points of a random permutation of 100 items:|||Kỳ vọng số điểm bất động của hoán vị ngẫu nhiên 100 phần tử:',
    ['1|||1', '1/100|||1/100', '50|||50', '1/e|||1/e'], 0,
    'Linearity: 100 indicators each with probability 1/100.|||Tuyến tính: 100 biến chỉ thị, mỗi biến xác suất 1/100.'),
  Q('q8', 'Variance of one fair die roll:|||Phương sai của một lần gieo xúc xắc cân đối:',
    ['7/2|||7/2', '35/12|||35/12', '91/6|||91/6', '1/6|||1/6'], 1,
    'E(X²) − E(X)² = 91/6 − 49/4 = 35/12.|||E(X²) − E(X)² = 91/6 − 49/4 = 35/12.'),
  Q('q9', 'Expected number of inversions of a random permutation of n items:|||Kỳ vọng số nghịch thế của hoán vị ngẫu nhiên n phần tử:',
    ['n/2|||n/2', 'n(n − 1)/4|||n(n − 1)/4', 'n(n − 1)/2|||n(n − 1)/2', 'log n|||log n'], 1,
    'Each of the C(n, 2) pairs is inverted with probability 1/2.|||Mỗi cặp trong C(n, 2) cặp bị nghịch thế với xác suất 1/2.'),
]);

const ch9 = {
  title: 'Chapter 9 — Discrete probability|||Chương 9 — Xác suất rời rạc',
  description: 'Không gian mẫu và biến cố, bài toán ngày sinh, xác suất có điều kiện, độc lập, Bayes và Monty Hall, biến ngẫu nhiên, kỳ vọng tuyến tính, phương sai, Markov/Chebyshev — có mô phỏng Python (Rosen ch. 7 · MCS ch. 17–20).',
  lessons: [c91, c92, c93, q9],
};

// ───────────────────────────── Chương 10 — Đồ thị ─────────────────────────────
const c101 = L('mad102-ts-10-1',
  '10.1 — Graph terminology, special graphs and representations|||10.1 — Thuật ngữ đồ thị, các đồ thị đặc biệt và cách biểu diễn',
  'Đồ thị vô hướng/có hướng, đơn/đa đồ thị, bậc, định lý bắt tay, Kₙ, Cₙ, Wₙ, Qₙ, đồ thị hai phía và kiểm tra hai phía bằng BFS; danh sách kề và ma trận kề, chi phí bộ nhớ.',
  `<span class="eyebrow">MAD102 · Chapter 10 · Lesson 10.1</span>
<h2>Graph terminology, special graphs and representations</h2>
<p class="lead">A graph is the simplest model of “things and connections”: road networks, computer networks, social networks, web links, call graphs, state machines. Before running algorithms on graphs we need a precise vocabulary and a way to store them.</p>
<h3>🎯 Objectives</h3>
<ul><li>Use the basic terminology: vertices, edges, degree, directed/undirected, simple/multigraph.</li><li>Apply the handshaking theorem and recognise K<sub>n</sub>, C<sub>n</sub>, W<sub>n</sub>, Q<sub>n</sub> and bipartite graphs.</li><li>Choose between adjacency lists and adjacency matrices, and test bipartiteness.</li></ul>
<h3>📖 Lecture</h3>
<p>A <strong>graph</strong> G = (V, E) has a set V of vertices and a set E of edges, each edge joining two vertices (its endpoints). A <strong>simple graph</strong> has no loops and no multiple edges; a <strong>multigraph</strong> allows multiple edges; a <strong>directed graph</strong> has ordered pairs (u, v) as edges. Two vertices are <strong>adjacent</strong> (neighbours) if an edge joins them. The <strong>degree</strong> deg(v) is the number of edge-ends at v (a loop counts twice); in a digraph we have in-degree and out-degree.</p>
<div class="formula"><span class="lbl">Handshaking theorem</span>Σ<sub>v∈V</sub> deg(v) = 2|E|.   Consequence: every graph has an even number of vertices of odd degree.<br>Directed: Σ deg<sup>−</sup>(v) = Σ deg<sup>+</sup>(v) = |E|.</div>
<p><strong>Special graphs.</strong> The complete graph K<sub>n</sub> has an edge between every pair: n(n − 1)/2 edges. The cycle C<sub>n</sub> (n ≥ 3) has n edges; the wheel W<sub>n</sub> adds a hub joined to all n cycle vertices (2n edges). The n-cube Q<sub>n</sub> has the 2<sup>n</sup> bit strings of length n as vertices, adjacent when they differ in one bit: n·2<sup>n−1</sup> edges — the topology of parallel machines and of Gray codes.</p>
<p>A graph is <strong>bipartite</strong> if V splits into two parts with every edge going between them (jobs/workers, students/courses). <strong>Theorem:</strong> a graph is bipartite iff it can be 2-coloured iff it has no odd cycle. A BFS that colours vertices alternately detects this in O(V + E). K<sub>m,n</sub> is the complete bipartite graph with parts of sizes m, n (mn edges).</p>
<p><strong>Representations.</strong> An <strong>adjacency list</strong> stores, for each vertex, its neighbours: O(V + E) memory, ideal for sparse graphs (most real ones). An <strong>adjacency matrix</strong> A has a<sub>ij</sub> = 1 if v<sub>i</sub>v<sub>j</sub> is an edge: O(V<sup>2</sup>) memory, O(1) edge lookup, good for dense graphs. A social network with 10<sup>9</sup> users and 10<sup>11</sup> friendships fits in lists but its matrix would need 10<sup>18</sup> entries.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — handshaking.</b> Can a graph have degree sequence 3, 3, 3, 3, 3? The sum 15 is odd, so no. A graph with 10 vertices each of degree 6 has 10·6/2 = 30 edges.</p></div>
<div class="callout"><p><b>Example 2 — bipartiteness by BFS.</b> C<sub>6</sub> is bipartite; C<sub>5</sub> (an odd cycle) is not:</p></div>
<pre><code class="language-python">from collections import deque

def is_bipartite(adj):
    color = {}
    for s in adj:
        if s in color:
            continue
        color[s] = 0
        q = deque([s])
        while q:
            u = q.popleft()
            for w in adj[u]:
                if w not in color:
                    color[w] = 1 - color[u]
                    q.append(w)
                elif color[w] == color[u]:
                    return False, None
    return True, color

C6 = {i: [(i - 1) % 6, (i + 1) % 6] for i in range(6)}   # even cycle
C5 = {i: [(i - 1) % 5, (i + 1) % 5] for i in range(5)}   # odd cycle
print(is_bipartite(C6))
print(is_bipartite(C5))

degrees = [len(v) for v in C6.values()]
print("sum of degrees =", sum(degrees), "= 2 * edges =", 2 * 6)
print("K_n edges:", [n * (n - 1) // 2 for n in range(1, 8)])
print("Q_n edges:", [n * 2 ** (n - 1) for n in range(1, 6)])</code></pre>
<div class="out">(True, {0: 0, 5: 1, 1: 1, 4: 0, 2: 0, 3: 1})
(False, None)
sum of degrees = 12 = 2 * edges = 12
K_n edges: [0, 1, 3, 6, 10, 15, 21]
Q_n edges: [1, 4, 12, 32, 80]</div>
<p>The colouring dictionary shows the two parts of C<sub>6</sub> ({0, 2, 4} and {1, 3, 5}); the edge counts of K<sub>n</sub> and Q<sub>n</sub> match n(n − 1)/2 and n·2<sup>n−1</sup>.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Forgetting that a loop adds 2 to the degree.</li><li>Calling a graph bipartite after finding <em>one</em> valid split attempt failed — you must show no odd cycle (or run the BFS test from every component).</li><li>Choosing a matrix for a huge sparse graph.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Σ deg(v) = 2|E|; odd-degree vertices come in pairs.</li><li>K<sub>n</sub>: n(n − 1)/2 edges; Q<sub>n</sub>: n·2<sup>n−1</sup> edges.</li><li>Bipartite ⇔ 2-colourable ⇔ no odd cycle; BFS test.</li><li>Lists O(V + E) for sparse; matrix O(V<sup>2</sup>) for dense.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_gt-intro.html" target="_blank" rel="noopener">Levin, DMOI 2.1 — Problems and Definitions</a></li><li><a href="https://en.wikipedia.org/wiki/Handshaking_lemma" target="_blank" rel="noopener">Wikipedia — Handshaking lemma</a></li><li><a href="https://en.wikipedia.org/wiki/Bipartite_graph" target="_blank" rel="noopener">Wikipedia — Bipartite graph</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>How many edges does K<sub>10</sub> have? Q<sub>4</sub>?</li><li>Is there a simple graph with degree sequence 4, 4, 3, 2, 1?</li><li>Is the wheel W<sub>4</sub> bipartite? Is Q<sub>3</sub>?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 45; 4·2<sup>3</sup> = 32. 2) Sum 14 is even, but two vertices of degree 4 in a 5-vertex simple graph are adjacent to all others, so every vertex has degree ≥ 2 — the degree-1 vertex is impossible. No. 3) W<sub>4</sub>: no (hub + two adjacent rim vertices form a triangle). Q<sub>3</sub>: yes (split by parity of the number of 1 bits).</p></div>`,
  `<span class="eyebrow">MAD102 · Chương 10 · Bài 10.1</span>
<h2>Thuật ngữ đồ thị, các đồ thị đặc biệt và cách biểu diễn</h2>
<p class="lead">Đồ thị là mô hình đơn giản nhất cho “các thứ và các mối nối”: mạng đường bộ, mạng máy tính, mạng xã hội, liên kết web, đồ thị lời gọi hàm, máy trạng thái. Trước khi chạy thuật toán trên đồ thị ta cần bộ từ vựng chính xác và cách lưu trữ chúng.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Dùng thuật ngữ cơ bản: đỉnh, cạnh, bậc, có hướng/vô hướng, đơn đồ thị/đa đồ thị.</li><li>Áp dụng định lý bắt tay và nhận ra K<sub>n</sub>, C<sub>n</sub>, W<sub>n</sub>, Q<sub>n</sub>, đồ thị hai phía.</li><li>Chọn giữa danh sách kề và ma trận kề, kiểm tra tính hai phía.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Đồ thị</strong> G = (V, E) gồm tập đỉnh V và tập cạnh E, mỗi cạnh nối hai đỉnh (hai đầu mút). <strong>Đơn đồ thị</strong> không có khuyên và không có cạnh bội; <strong>đa đồ thị</strong> cho phép cạnh bội; <strong>đồ thị có hướng</strong> có cạnh là cặp có thứ tự (u, v). Hai đỉnh <strong>kề nhau</strong> (láng giềng) nếu có cạnh nối chúng. <strong>Bậc</strong> deg(v) là số đầu cạnh tại v (khuyên tính hai lần); trong đồ thị có hướng có bán bậc vào và bán bậc ra.</p>
<div class="formula"><span class="lbl">Định lý bắt tay</span>Σ<sub>v∈V</sub> deg(v) = 2|E|.   Hệ quả: mọi đồ thị có số chẵn đỉnh bậc lẻ.<br>Có hướng: Σ deg<sup>−</sup>(v) = Σ deg<sup>+</sup>(v) = |E|.</div>
<p><strong>Đồ thị đặc biệt.</strong> Đồ thị đầy đủ K<sub>n</sub> có cạnh giữa mọi cặp đỉnh: n(n − 1)/2 cạnh. Chu trình C<sub>n</sub> (n ≥ 3) có n cạnh; bánh xe W<sub>n</sub> thêm một đỉnh trục nối với cả n đỉnh của chu trình (2n cạnh). Khối lập phương n chiều Q<sub>n</sub> có đỉnh là 2<sup>n</sup> chuỗi bit độ dài n, kề nhau khi khác nhau đúng một bit: n·2<sup>n−1</sup> cạnh — cấu trúc nối của máy song song và của mã Gray.</p>
<p>Đồ thị là <strong>hai phía</strong> nếu V chia được thành hai phần sao cho mọi cạnh đi giữa hai phần (công việc/nhân viên, sinh viên/môn học). <strong>Định lý:</strong> đồ thị hai phía ⇔ tô được 2 màu ⇔ không có chu trình lẻ. BFS tô màu xen kẽ phát hiện điều này trong O(V + E). K<sub>m,n</sub> là đồ thị hai phía đầy đủ với hai phần cỡ m, n (mn cạnh).</p>
<p><strong>Biểu diễn.</strong> <strong>Danh sách kề</strong> lưu láng giềng của từng đỉnh: bộ nhớ O(V + E), lý tưởng cho đồ thị thưa (đa số đồ thị thực tế). <strong>Ma trận kề</strong> A có a<sub>ij</sub> = 1 nếu v<sub>i</sub>v<sub>j</sub> là cạnh: bộ nhớ O(V<sup>2</sup>), tra cạnh O(1), hợp với đồ thị dày. Mạng xã hội 10<sup>9</sup> người và 10<sup>11</sup> quan hệ bạn bè vừa danh sách kề, nhưng ma trận cần 10<sup>18</sup> ô.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — bắt tay.</b> Có đồ thị nào có dãy bậc 3, 3, 3, 3, 3 không? Tổng 15 lẻ nên không. Đồ thị 10 đỉnh, mỗi đỉnh bậc 6 có 10·6/2 = 30 cạnh.</p></div>
<div class="callout"><p><b>Ví dụ 2 — kiểm hai phía bằng BFS.</b> C<sub>6</sub> là hai phía; C<sub>5</sub> (chu trình lẻ) thì không:</p></div>
<pre><code class="language-python">from collections import deque

def is_bipartite(adj):
    color = {}
    for s in adj:
        if s in color:
            continue
        color[s] = 0
        q = deque([s])
        while q:
            u = q.popleft()
            for w in adj[u]:
                if w not in color:
                    color[w] = 1 - color[u]
                    q.append(w)
                elif color[w] == color[u]:
                    return False, None
    return True, color

C6 = {i: [(i - 1) % 6, (i + 1) % 6] for i in range(6)}   # even cycle
C5 = {i: [(i - 1) % 5, (i + 1) % 5] for i in range(5)}   # odd cycle
print(is_bipartite(C6))
print(is_bipartite(C5))

degrees = [len(v) for v in C6.values()]
print("sum of degrees =", sum(degrees), "= 2 * edges =", 2 * 6)
print("K_n edges:", [n * (n - 1) // 2 for n in range(1, 8)])
print("Q_n edges:", [n * 2 ** (n - 1) for n in range(1, 6)])</code></pre>
<div class="out">(True, {0: 0, 5: 1, 1: 1, 4: 0, 2: 0, 3: 1})
(False, None)
sum of degrees = 12 = 2 * edges = 12
K_n edges: [0, 1, 3, 6, 10, 15, 21]
Q_n edges: [1, 4, 12, 32, 80]</div>
<p>Từ điển màu cho thấy hai phần của C<sub>6</sub> ({0, 2, 4} và {1, 3, 5}); số cạnh của K<sub>n</sub> và Q<sub>n</sub> khớp n(n − 1)/2 và n·2<sup>n−1</sup>.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Quên rằng khuyên cộng 2 vào bậc.</li><li>Kết luận đồ thị không hai phía chỉ vì <em>một</em> cách chia thử bị hỏng — phải chỉ ra chu trình lẻ (hoặc chạy BFS kiểm từ mọi thành phần).</li><li>Chọn ma trận cho đồ thị thưa khổng lồ.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Σ deg(v) = 2|E|; đỉnh bậc lẻ đi theo cặp.</li><li>K<sub>n</sub>: n(n − 1)/2 cạnh; Q<sub>n</sub>: n·2<sup>n−1</sup> cạnh.</li><li>Hai phía ⇔ tô 2 màu ⇔ không chu trình lẻ; kiểm bằng BFS.</li><li>Danh sách O(V + E) cho đồ thị thưa; ma trận O(V<sup>2</sup>) cho đồ thị dày.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_gt-intro.html" target="_blank" rel="noopener">Levin, DMOI 2.1 — Problems and Definitions</a></li><li><a href="https://en.wikipedia.org/wiki/Handshaking_lemma" target="_blank" rel="noopener">Wikipedia — Handshaking lemma</a></li><li><a href="https://en.wikipedia.org/wiki/Bipartite_graph" target="_blank" rel="noopener">Wikipedia — Bipartite graph</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>K<sub>10</sub> có bao nhiêu cạnh? Q<sub>4</sub>?</li><li>Có đơn đồ thị nào có dãy bậc 4, 4, 3, 2, 1 không?</li><li>Bánh xe W<sub>4</sub> có hai phía không? Q<sub>3</sub> thì sao?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 45; 4·2<sup>3</sup> = 32. 2) Tổng 14 chẵn, nhưng hai đỉnh bậc 4 trong đơn đồ thị 5 đỉnh kề mọi đỉnh khác, nên mọi đỉnh có bậc ≥ 2 — đỉnh bậc 1 là bất khả. Không có. 3) W<sub>4</sub>: không (trục cùng hai đỉnh kề trên vành tạo tam giác). Q<sub>3</sub>: có (chia theo tính chẵn lẻ của số bit 1).</p></div>`);

const c102 = L('mad102-ts-10-2',
  '10.2 — Connectivity, graph traversal (BFS/DFS) and isomorphism|||10.2 — Liên thông, duyệt đồ thị (BFS/DFS) và đẳng cấu',
  'Đường đi, chu trình, liên thông, thành phần liên thông, đỉnh cắt, liên thông mạnh; đếm đường đi bằng lũy thừa ma trận kề; BFS và DFS O(V + E); đẳng cấu đồ thị và bất biến; code Python chạy thật.',
  `<span class="eyebrow">MAD102 · Chapter 10 · Lesson 10.2</span>
<h2>Connectivity, graph traversal (BFS/DFS) and isomorphism</h2>
<p class="lead">Can every server reach every other? Which users are in the same community? Is this network the same as that one with the labels changed? These questions are answered with paths, traversal algorithms and graph invariants.</p>
<h3>🎯 Objectives</h3>
<ul><li>Define paths, circuits, connected components, cut vertices and strong connectivity.</li><li>Count walks with powers of the adjacency matrix.</li><li>Run BFS and DFS, state their O(V + E) cost, and test isomorphism with invariants.</li></ul>
<h3>📖 Lecture</h3>
<p>A <strong>path</strong> of length k is a sequence of k edges joining consecutive vertices; it is a <strong>circuit</strong> (cycle) if it starts and ends at the same vertex; it is <strong>simple</strong> if no edge repeats. An undirected graph is <strong>connected</strong> if every pair of vertices is joined by a path; otherwise it splits into <strong>connected components</strong>. A <strong>cut vertex</strong> (articulation point) or <strong>bridge</strong> is one whose removal disconnects the graph — single points of failure in a network. A digraph is <strong>strongly connected</strong> if there is a directed path from every vertex to every other.</p>
<div class="formula"><span class="lbl">Counting walks</span>The (i, j) entry of A<sup>r</sup> equals the number of walks of length r from v<sub>i</sub> to v<sub>j</sub>.</div>
<p>(A “walk” may repeat vertices and edges; Rosen calls it a path.) Proof by induction on r: a walk of length r + 1 is a walk of length r to some v<sub>k</sub> followed by an edge v<sub>k</sub>v<sub>j</sub>, which is exactly the matrix product.</p>
<p><strong>Breadth-first search (BFS)</strong> explores a graph in layers using a queue: all vertices at distance 1, then distance 2, … It finds shortest paths (by number of edges) in unweighted graphs. <strong>Depth-first search (DFS)</strong> goes as deep as possible using a stack (or recursion), then backtracks; it is the basis of cycle detection, topological sorting and finding cut vertices. Both visit each vertex and edge a constant number of times: <strong>O(V + E)</strong> with adjacency lists.</p>
<p>Graphs G and H are <strong>isomorphic</strong> if there is a bijection f: V(G) → V(H) with uv ∈ E(G) ⇔ f(u)f(v) ∈ E(H) — the same graph drawn and labelled differently. <strong>Invariants</strong> (number of vertices and edges, degree sequence, number of triangles, being bipartite, connected components) must agree; if one differs, the graphs are not isomorphic. Agreement of invariants does not prove isomorphism — you must exhibit f. No polynomial algorithm is known for isomorphism in general (Babai's 2015 algorithm is quasi-polynomial).</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — walks.</b> In the 4-cycle a–b–c–d–a, A<sup>2</sup> has 2 on the diagonal (go to either neighbour and back) and A<sup>4</sup>[a][d] = 0: every walk from a to d has odd length because C<sub>4</sub> is bipartite.</p></div>
<div class="callout"><p><b>Example 2 — components with an iterative DFS.</b></p></div>
<pre><code class="language-python">def mat_mult(A, B):
    n = len(A)
    return [[sum(A[i][k] * B[k][j] for k in range(n)) for j in range(n)] for i in range(n)]

# square a-b-c-d-a  (vertices 0..3)
A = [[0, 1, 0, 1],
     [1, 0, 1, 0],
     [0, 1, 0, 1],
     [1, 0, 1, 0]]
A2 = mat_mult(A, A)
A4 = mat_mult(A2, A2)
print("A^2:", A2)
print("walks of length 4 from a to d:", A4[0][3], "; from a to a:", A4[0][0])

def components(adj):
    seen, comps = set(), []
    for s in adj:
        if s in seen:
            continue
        stack, comp = [s], []
        seen.add(s)
        while stack:                       # iterative DFS
            u = stack.pop()
            comp.append(u)
            for w in adj[u]:
                if w not in seen:
                    seen.add(w)
                    stack.append(w)
        comps.append(sorted(comp))
    return comps

G = {1: [2], 2: [1, 3], 3: [2], 4: [5], 5: [4], 6: []}
print(components(G))</code></pre>
<div class="out">A^2: [[2, 0, 2, 0], [0, 2, 0, 2], [2, 0, 2, 0], [0, 2, 0, 2]]
walks of length 4 from a to d: 0 ; from a to a: 8
[[1, 2, 3], [4, 5], [6]]</div>
<p>A<sup>4</sup>[a][a] = 8 walks of length 4 from a back to a; the graph on 6 vertices has three components {1, 2, 3}, {4, 5}, {6} (vertex 6 is isolated).</p>
<div class="callout"><p><b>Example 3 — non-isomorphic.</b> Two graphs with 6 vertices and 9 edges: K<sub>3,3</sub> and the triangular prism (two triangles joined by a matching). Both are 3-regular, but the prism contains triangles and K<sub>3,3</sub> (bipartite) has none ⇒ not isomorphic.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Concluding isomorphism from equal degree sequences alone.</li><li>Using DFS to find shortest paths in unweighted graphs (BFS does that; DFS does not).</li><li>Forgetting to mark vertices as visited — infinite loops on cycles.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Connected components, cut vertices, strong connectivity.</li><li>(A<sup>r</sup>)<sub>ij</sub> = number of walks of length r.</li><li>BFS (queue, shortest unweighted paths) and DFS (stack/recursion): O(V + E).</li><li>Isomorphism: preserve adjacency; invariants can only refute it.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://cp-algorithms.com/graph/breadth-first-search.html" target="_blank" rel="noopener">cp-algorithms — Breadth First Search</a></li><li><a href="https://cp-algorithms.com/graph/depth-first-search.html" target="_blank" rel="noopener">cp-algorithms — Depth First Search</a></li><li><a href="https://visualgo.net/en/dfsbfs" target="_blank" rel="noopener">VisuAlgo — Graph Traversal (DFS/BFS) animation</a></li><li><a href="https://en.wikipedia.org/wiki/Graph_isomorphism" target="_blank" rel="noopener">Wikipedia — Graph isomorphism</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>In K<sub>4</sub>, how many walks of length 2 go from a vertex back to itself?</li><li>Give a graph with 5 vertices and 4 edges that is not connected.</li><li>Are C<sub>6</sub> and two disjoint copies of C<sub>3</sub> isomorphic?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 3 (to any of the 3 neighbours and back) — the degree. 2) A triangle plus one edge on the other two vertices (3 + 1 = 4 edges, two components). 3) No: both are 2-regular with 6 vertices and 6 edges, but C<sub>6</sub> is connected and the other has two components.</p></div>`,
  `<span class="eyebrow">MAD102 · Chương 10 · Bài 10.2</span>
<h2>Liên thông, duyệt đồ thị (BFS/DFS) và đẳng cấu</h2>
<p class="lead">Mọi máy chủ có tới được nhau không? Những người dùng nào cùng một cộng đồng? Mạng này có giống mạng kia khi đổi nhãn không? Các câu hỏi đó được trả lời bằng đường đi, thuật toán duyệt và bất biến của đồ thị.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Định nghĩa đường đi, chu trình, thành phần liên thông, đỉnh cắt và liên thông mạnh.</li><li>Đếm đường đi bằng lũy thừa ma trận kề.</li><li>Chạy BFS và DFS, nêu chi phí O(V + E), kiểm tra đẳng cấu bằng bất biến.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Đường đi</strong> độ dài k là dãy k cạnh nối các đỉnh liên tiếp; nó là <strong>chu trình</strong> nếu bắt đầu và kết thúc tại cùng một đỉnh; nó <strong>đơn</strong> nếu không lặp cạnh. Đồ thị vô hướng <strong>liên thông</strong> nếu mọi cặp đỉnh đều có đường đi nối; ngược lại nó tách thành các <strong>thành phần liên thông</strong>. <strong>Đỉnh cắt</strong> (khớp) hay <strong>cầu</strong> là đỉnh/cạnh mà bỏ đi thì đồ thị mất liên thông — điểm hỏng đơn lẻ của mạng. Đồ thị có hướng <strong>liên thông mạnh</strong> nếu có đường đi có hướng từ mọi đỉnh tới mọi đỉnh khác.</p>
<div class="formula"><span class="lbl">Đếm đường đi</span>Phần tử (i, j) của A<sup>r</sup> bằng số đường đi (cho phép lặp) độ dài r từ v<sub>i</sub> tới v<sub>j</sub>.</div>
<p>(Đường đi ở đây được lặp đỉnh và cạnh; Rosen gọi là “path”.) Chứng minh bằng quy nạp theo r: đường đi độ dài r + 1 là đường đi độ dài r tới v<sub>k</sub> nào đó rồi thêm cạnh v<sub>k</sub>v<sub>j</sub>, đúng là phép nhân ma trận.</p>
<p><strong>Tìm kiếm theo chiều rộng (BFS)</strong> duyệt đồ thị theo từng lớp bằng hàng đợi: mọi đỉnh ở khoảng cách 1, rồi khoảng cách 2, … Nó tìm đường đi ngắn nhất (theo số cạnh) trên đồ thị không trọng số. <strong>Tìm kiếm theo chiều sâu (DFS)</strong> đi sâu hết mức bằng ngăn xếp (hoặc đệ quy) rồi quay lui; nó là nền của phát hiện chu trình, sắp xếp tô-pô và tìm đỉnh cắt. Cả hai thăm mỗi đỉnh và mỗi cạnh một số hằng lần: <strong>O(V + E)</strong> với danh sách kề.</p>
<p>Đồ thị G và H <strong>đẳng cấu</strong> nếu có song ánh f: V(G) → V(H) với uv ∈ E(G) ⇔ f(u)f(v) ∈ E(H) — cùng một đồ thị vẽ và đặt nhãn khác đi. Các <strong>bất biến</strong> (số đỉnh, số cạnh, dãy bậc, số tam giác, tính hai phía, số thành phần liên thông) phải trùng nhau; một bất biến khác là đủ kết luận không đẳng cấu. Bất biến trùng nhau chưa chứng minh được đẳng cấu — phải chỉ ra f. Chưa biết thuật toán đa thức cho bài toán đẳng cấu tổng quát (thuật toán Babai 2015 là tựa đa thức).</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — đếm đường đi.</b> Trong chu trình 4 đỉnh a–b–c–d–a, A<sup>2</sup> có 2 trên đường chéo (sang một trong hai láng giềng rồi quay về) và A<sup>4</sup>[a][d] = 0: mọi đường đi từ a tới d có độ dài lẻ vì C<sub>4</sub> là hai phía.</p></div>
<div class="callout"><p><b>Ví dụ 2 — thành phần liên thông bằng DFS lặp.</b></p></div>
<pre><code class="language-python">def mat_mult(A, B):
    n = len(A)
    return [[sum(A[i][k] * B[k][j] for k in range(n)) for j in range(n)] for i in range(n)]

# square a-b-c-d-a  (vertices 0..3)
A = [[0, 1, 0, 1],
     [1, 0, 1, 0],
     [0, 1, 0, 1],
     [1, 0, 1, 0]]
A2 = mat_mult(A, A)
A4 = mat_mult(A2, A2)
print("A^2:", A2)
print("walks of length 4 from a to d:", A4[0][3], "; from a to a:", A4[0][0])

def components(adj):
    seen, comps = set(), []
    for s in adj:
        if s in seen:
            continue
        stack, comp = [s], []
        seen.add(s)
        while stack:                       # iterative DFS
            u = stack.pop()
            comp.append(u)
            for w in adj[u]:
                if w not in seen:
                    seen.add(w)
                    stack.append(w)
        comps.append(sorted(comp))
    return comps

G = {1: [2], 2: [1, 3], 3: [2], 4: [5], 5: [4], 6: []}
print(components(G))</code></pre>
<div class="out">A^2: [[2, 0, 2, 0], [0, 2, 0, 2], [2, 0, 2, 0], [0, 2, 0, 2]]
walks of length 4 from a to d: 0 ; from a to a: 8
[[1, 2, 3], [4, 5], [6]]</div>
<p>A<sup>4</sup>[a][a] = 8 đường đi độ dài 4 từ a quay về a; đồ thị 6 đỉnh có ba thành phần {1, 2, 3}, {4, 5}, {6} (đỉnh 6 cô lập).</p>
<div class="callout"><p><b>Ví dụ 3 — không đẳng cấu.</b> Hai đồ thị 6 đỉnh 9 cạnh: K<sub>3,3</sub> và lăng trụ tam giác (hai tam giác nối bằng một cặp ghép). Cả hai đều chính quy bậc 3, nhưng lăng trụ có tam giác còn K<sub>3,3</sub> (hai phía) thì không ⇒ không đẳng cấu.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Kết luận đẳng cấu chỉ vì dãy bậc bằng nhau.</li><li>Dùng DFS tìm đường đi ngắn nhất trên đồ thị không trọng số (BFS mới làm được; DFS thì không).</li><li>Quên đánh dấu đỉnh đã thăm — lặp vô hạn trên chu trình.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Thành phần liên thông, đỉnh cắt, liên thông mạnh.</li><li>(A<sup>r</sup>)<sub>ij</sub> = số đường đi độ dài r.</li><li>BFS (hàng đợi, đường ngắn nhất không trọng số) và DFS (ngăn xếp/đệ quy): O(V + E).</li><li>Đẳng cấu: giữ quan hệ kề; bất biến chỉ dùng để bác bỏ.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://cp-algorithms.com/graph/breadth-first-search.html" target="_blank" rel="noopener">cp-algorithms — Breadth First Search</a></li><li><a href="https://cp-algorithms.com/graph/depth-first-search.html" target="_blank" rel="noopener">cp-algorithms — Depth First Search</a></li><li><a href="https://visualgo.net/en/dfsbfs" target="_blank" rel="noopener">VisuAlgo — hoạt hình duyệt đồ thị DFS/BFS</a></li><li><a href="https://en.wikipedia.org/wiki/Graph_isomorphism" target="_blank" rel="noopener">Wikipedia — Graph isomorphism</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Trong K<sub>4</sub>, có bao nhiêu đường đi độ dài 2 từ một đỉnh quay về chính nó?</li><li>Cho một đồ thị 5 đỉnh, 4 cạnh mà không liên thông.</li><li>C<sub>6</sub> và hai bản C<sub>3</sub> rời nhau có đẳng cấu không?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 3 (sang một trong 3 láng giềng rồi về) — đúng bằng bậc. 2) Một tam giác cộng một cạnh nối hai đỉnh còn lại (3 + 1 = 4 cạnh, hai thành phần). 3) Không: cả hai đều chính quy bậc 2 với 6 đỉnh, 6 cạnh, nhưng C<sub>6</sub> liên thông còn đồ thị kia có hai thành phần.</p></div>`);

const c103 = L('mad102-ts-10-3',
  '10.3 — Euler and Hamilton paths|||10.3 — Đường đi Euler và Hamilton',
  'Bảy cây cầu Königsberg, định lý Euler (chu trình/đường đi Euler theo bậc), thuật toán Hierholzer O(E) chạy thật; đường đi Hamilton, định lý Dirac và Ore, bài toán người du lịch (TSP) NP-khó, mã Gray.',
  `<span class="eyebrow">MAD102 · Chapter 10 · Lesson 10.3</span>
<h2>Euler and Hamilton paths</h2>
<p class="lead">Two questions that look almost identical have completely different difficulty. “Can I traverse every <em>edge</em> exactly once?” is answered instantly by checking degrees. “Can I visit every <em>vertex</em> exactly once?” is NP-complete. This contrast is one of the best lessons in algorithm design.</p>
<h3>🎯 Objectives</h3>
<ul><li>Decide whether a graph has an Euler circuit or Euler path, and construct one.</li><li>State sufficient conditions (Dirac, Ore) for Hamilton circuits.</li><li>Explain why the travelling salesman problem is hard and where Hamilton paths appear in CS.</li></ul>
<h3>📖 Lecture</h3>
<p>An <strong>Euler circuit</strong> uses every edge exactly once and returns to the start; an <strong>Euler path</strong> uses every edge exactly once.</p>
<div class="formula"><span class="lbl">Euler’s theorem (connected multigraph, ≥ 2 vertices)</span>Euler circuit ⇔ every vertex has even degree.<br>Euler path (not circuit) ⇔ exactly two vertices have odd degree; the path starts at one and ends at the other.</div>
<p>Necessity: each time a walk passes through a vertex it uses two edge-ends, so interior vertices need even degree. Sufficiency is constructive — <strong>Hierholzer's algorithm</strong>: walk from the start without reusing edges until stuck (you must be back at the start), then splice in sub-circuits from vertices that still have unused edges. It runs in O(E). Applications: drawing a figure without lifting the pen, snow-plough and postal routes, DNA fragment assembly (de Bruijn graphs).</p>
<p>In 1736 Euler proved that the seven bridges of Königsberg cannot be crossed exactly once each: all four land masses have odd degree (5, 3, 3, 3).</p>
<p>A <strong>Hamilton circuit</strong> visits every vertex exactly once and returns; a <strong>Hamilton path</strong> visits every vertex exactly once. No simple degree criterion is known — deciding existence is NP-complete. Sufficient conditions for a simple graph with n ≥ 3 vertices:</p>
<div class="formula"><span class="lbl">Dirac and Ore</span>Dirac: deg(v) ≥ n/2 for every v ⇒ Hamilton circuit.<br>Ore: deg(u) + deg(v) ≥ n for every pair of non-adjacent u, v ⇒ Hamilton circuit.</div>
<p>Hamilton circuits in Q<sub>n</sub> are <strong>Gray codes</strong>: listing all n-bit strings so that consecutive ones differ in one bit (000, 001, 011, 010, 110, 111, 101, 100), used in rotary encoders and error minimisation. The <strong>travelling salesman problem</strong> (TSP) asks for the cheapest Hamilton circuit in a weighted complete graph; brute force checks (n − 1)!/2 circuits — for 25 cities about 3·10<sup>23</sup>. In practice: dynamic programming O(n<sup>2</sup>2<sup>n</sup>) for small n, heuristics and approximation for large n.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — Königsberg and the “envelope”.</b> The program checks degrees for the Königsberg multigraph (A is the island) and for an envelope-shaped graph, then finds an Euler path in the envelope with Hierholzer's algorithm, starting at an odd vertex:</p></div>
<pre><code class="language-python">from collections import defaultdict

def euler_info(edges):
    deg = defaultdict(int)
    for u, v in edges:
        deg[u] += 1
        deg[v] += 1
    odd = sorted(v for v in deg if deg[v] % 2)
    return dict(deg), odd

# Konigsberg multigraph: land masses A (island), B, C, D; 7 bridges
k = [("A", "B"), ("A", "B"), ("A", "C"), ("A", "C"), ("A", "D"), ("B", "D"), ("C", "D")]
print(euler_info(k))

def hierholzer(edges, start):
    adj = defaultdict(list)
    for i, (u, v) in enumerate(edges):
        adj[u].append((v, i))
        adj[v].append((u, i))
    used, stack, path = set(), [start], []
    while stack:
        u = stack[-1]
        while adj[u] and adj[u][-1][1] in used:
            adj[u].pop()
        if adj[u]:
            v, i = adj[u].pop()
            used.add(i)
            stack.append(v)
        else:
            path.append(stack.pop())
    return path[::-1]

house = [(1, 2), (2, 3), (3, 4), (4, 1), (1, 3), (2, 4), (3, 5), (4, 5)]   # "envelope"
print(euler_info(house))
path = hierholzer(house, 1)          # start at an odd-degree vertex
print(path, "edges used:", len(path) - 1)
print(sorted(tuple(sorted(e)) for e in zip(path, path[1:])) == sorted(tuple(sorted(e)) for e in house))</code></pre>
<div class="out">({'A': 5, 'B': 3, 'C': 3, 'D': 3}, ['A', 'B', 'C', 'D'])
({1: 3, 2: 3, 3: 4, 4: 4, 5: 2}, [1, 2])
[1, 3, 5, 4, 2, 3, 4, 1, 2] edges used: 8
True</div>
<p>Königsberg: four odd vertices ⇒ neither path nor circuit. Envelope: exactly two odd vertices (1 and 2) ⇒ an Euler path from 1 to 2, and the last line confirms it uses all 8 edges exactly once.</p>
<div class="callout"><p><b>Example 2 — Dirac.</b> K<sub>n</sub> (n ≥ 3) has deg = n − 1 ≥ n/2, so it has a Hamilton circuit. K<sub>2,3</sub> has none: a Hamilton circuit in a bipartite graph alternates sides, so needs equal parts.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Starting Hierholzer's algorithm for an Euler <em>path</em> at an even-degree vertex.</li><li>Forgetting the connectivity requirement (two disjoint cycles have all degrees even but no Euler circuit).</li><li>Reading Dirac's condition as necessary — C<sub>n</sub> has a Hamilton circuit with all degrees 2.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Euler circuit ⇔ connected + all degrees even; path ⇔ exactly two odd.</li><li>Hierholzer finds it in O(E).</li><li>Hamilton: NP-complete; Dirac/Ore are sufficient conditions.</li><li>TSP = cheapest Hamilton circuit; Gray code = Hamilton circuit in Q<sub>n</sub>.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_gt-paths.html" target="_blank" rel="noopener">Levin, DMOI 2.4 — Euler Trails and Circuits</a></li><li><a href="https://cp-algorithms.com/graph/euler_path.html" target="_blank" rel="noopener">cp-algorithms — Finding the Eulerian path in O(M)</a></li><li><a href="https://brilliant.org/wiki/hamiltonian-path/" target="_blank" rel="noopener">Brilliant — Hamiltonian Path</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>For which n does K<sub>n</sub> have an Euler circuit?</li><li>Does Q<sub>3</sub> have an Euler circuit? A Hamilton circuit?</li><li>How many distinct Hamilton circuits does K<sub>5</sub> have (ignoring start and direction)?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Odd n (degree n − 1 must be even). 2) Euler: no (all degrees 3). Hamilton: yes (the Gray code 000, 001, 011, 010, 110, 111, 101, 100). 3) (5 − 1)!/2 = 12.</p></div>`,
  `<span class="eyebrow">MAD102 · Chương 10 · Bài 10.3</span>
<h2>Đường đi Euler và Hamilton</h2>
<p class="lead">Hai câu hỏi trông gần như y hệt lại có độ khó khác hẳn nhau. “Có đi qua mỗi <em>cạnh</em> đúng một lần được không?” trả lời ngay bằng cách xem bậc. “Có thăm mỗi <em>đỉnh</em> đúng một lần được không?” là NP-đầy đủ. Sự tương phản này là một trong những bài học hay nhất về thiết kế thuật toán.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Xác định đồ thị có chu trình Euler hay đường đi Euler, và dựng ra nó.</li><li>Phát biểu điều kiện đủ (Dirac, Ore) cho chu trình Hamilton.</li><li>Giải thích vì sao bài toán người du lịch khó và đường đi Hamilton xuất hiện ở đâu trong CNTT.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Chu trình Euler</strong> dùng mỗi cạnh đúng một lần và quay về điểm xuất phát; <strong>đường đi Euler</strong> dùng mỗi cạnh đúng một lần.</p>
<div class="formula"><span class="lbl">Định lý Euler (đa đồ thị liên thông, ≥ 2 đỉnh)</span>Có chu trình Euler ⇔ mọi đỉnh có bậc chẵn.<br>Có đường đi Euler (không phải chu trình) ⇔ có đúng hai đỉnh bậc lẻ; đường đi bắt đầu ở đỉnh này và kết thúc ở đỉnh kia.</div>
<p>Điều kiện cần: mỗi lần đi qua một đỉnh dùng hai đầu cạnh, nên đỉnh ở giữa cần bậc chẵn. Điều kiện đủ được chứng minh kiến thiết — <strong>thuật toán Hierholzer</strong>: đi từ điểm xuất phát, không dùng lại cạnh, tới khi kẹt (khi đó chắc chắn đã về điểm đầu), rồi chèn thêm các chu trình con từ những đỉnh còn cạnh chưa dùng. Nó chạy trong O(E). Ứng dụng: vẽ hình một nét, tuyến xe quét tuyết và đưa thư, lắp ráp đoạn DNA (đồ thị de Bruijn).</p>
<p>Năm 1736 Euler chứng minh không thể đi qua bảy cây cầu Königsberg, mỗi cầu đúng một lần: cả bốn vùng đất đều có bậc lẻ (5, 3, 3, 3).</p>
<p><strong>Chu trình Hamilton</strong> thăm mỗi đỉnh đúng một lần rồi quay về; <strong>đường đi Hamilton</strong> thăm mỗi đỉnh đúng một lần. Chưa biết tiêu chuẩn đơn giản nào theo bậc — quyết định sự tồn tại là NP-đầy đủ. Điều kiện đủ cho đơn đồ thị n ≥ 3 đỉnh:</p>
<div class="formula"><span class="lbl">Dirac và Ore</span>Dirac: deg(v) ≥ n/2 với mọi v ⇒ có chu trình Hamilton.<br>Ore: deg(u) + deg(v) ≥ n với mọi cặp u, v không kề nhau ⇒ có chu trình Hamilton.</div>
<p>Chu trình Hamilton trong Q<sub>n</sub> chính là <strong>mã Gray</strong>: liệt kê mọi chuỗi n bit sao cho hai chuỗi liên tiếp khác nhau đúng một bit (000, 001, 011, 010, 110, 111, 101, 100), dùng trong bộ mã hoá vòng quay và giảm thiểu lỗi. <strong>Bài toán người du lịch</strong> (TSP) tìm chu trình Hamilton rẻ nhất trên đồ thị đầy đủ có trọng số; vét cạn phải kiểm (n − 1)!/2 chu trình — với 25 thành phố khoảng 3·10<sup>23</sup>. Thực tế: quy hoạch động O(n<sup>2</sup>2<sup>n</sup>) cho n nhỏ, heuristic và thuật toán xấp xỉ cho n lớn.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — Königsberg và “phong bì”.</b> Chương trình kiểm bậc của đa đồ thị Königsberg (A là hòn đảo) và của đồ thị hình phong bì, rồi tìm đường đi Euler trên phong bì bằng thuật toán Hierholzer, xuất phát từ một đỉnh bậc lẻ:</p></div>
<pre><code class="language-python">from collections import defaultdict

def euler_info(edges):
    deg = defaultdict(int)
    for u, v in edges:
        deg[u] += 1
        deg[v] += 1
    odd = sorted(v for v in deg if deg[v] % 2)
    return dict(deg), odd

# Konigsberg multigraph: land masses A (island), B, C, D; 7 bridges
k = [("A", "B"), ("A", "B"), ("A", "C"), ("A", "C"), ("A", "D"), ("B", "D"), ("C", "D")]
print(euler_info(k))

def hierholzer(edges, start):
    adj = defaultdict(list)
    for i, (u, v) in enumerate(edges):
        adj[u].append((v, i))
        adj[v].append((u, i))
    used, stack, path = set(), [start], []
    while stack:
        u = stack[-1]
        while adj[u] and adj[u][-1][1] in used:
            adj[u].pop()
        if adj[u]:
            v, i = adj[u].pop()
            used.add(i)
            stack.append(v)
        else:
            path.append(stack.pop())
    return path[::-1]

house = [(1, 2), (2, 3), (3, 4), (4, 1), (1, 3), (2, 4), (3, 5), (4, 5)]   # "envelope"
print(euler_info(house))
path = hierholzer(house, 1)          # start at an odd-degree vertex
print(path, "edges used:", len(path) - 1)
print(sorted(tuple(sorted(e)) for e in zip(path, path[1:])) == sorted(tuple(sorted(e)) for e in house))</code></pre>
<div class="out">({'A': 5, 'B': 3, 'C': 3, 'D': 3}, ['A', 'B', 'C', 'D'])
({1: 3, 2: 3, 3: 4, 4: 4, 5: 2}, [1, 2])
[1, 3, 5, 4, 2, 3, 4, 1, 2] edges used: 8
True</div>
<p>Königsberg: bốn đỉnh bậc lẻ ⇒ không có đường đi lẫn chu trình Euler. Phong bì: đúng hai đỉnh lẻ (1 và 2) ⇒ có đường đi Euler từ 1 tới 2, và dòng cuối xác nhận nó dùng cả 8 cạnh, mỗi cạnh đúng một lần.</p>
<div class="callout"><p><b>Ví dụ 2 — Dirac.</b> K<sub>n</sub> (n ≥ 3) có deg = n − 1 ≥ n/2 nên có chu trình Hamilton. K<sub>2,3</sub> thì không: chu trình Hamilton trong đồ thị hai phía phải đổi phía liên tục, nên cần hai phần bằng nhau.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Bắt đầu Hierholzer cho <em>đường đi</em> Euler từ một đỉnh bậc chẵn.</li><li>Quên điều kiện liên thông (hai chu trình rời nhau có mọi bậc chẵn mà không có chu trình Euler).</li><li>Đọc điều kiện Dirac như điều kiện cần — C<sub>n</sub> có chu trình Hamilton dù mọi bậc bằng 2.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Chu trình Euler ⇔ liên thông + mọi bậc chẵn; đường đi ⇔ đúng hai đỉnh lẻ.</li><li>Hierholzer tìm ra trong O(E).</li><li>Hamilton: NP-đầy đủ; Dirac/Ore là điều kiện đủ.</li><li>TSP = chu trình Hamilton rẻ nhất; mã Gray = chu trình Hamilton trong Q<sub>n</sub>.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_gt-paths.html" target="_blank" rel="noopener">Levin, DMOI 2.4 — Euler Trails and Circuits</a></li><li><a href="https://cp-algorithms.com/graph/euler_path.html" target="_blank" rel="noopener">cp-algorithms — Finding the Eulerian path in O(M)</a></li><li><a href="https://brilliant.org/wiki/hamiltonian-path/" target="_blank" rel="noopener">Brilliant — Hamiltonian Path</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Với n nào thì K<sub>n</sub> có chu trình Euler?</li><li>Q<sub>3</sub> có chu trình Euler không? Chu trình Hamilton không?</li><li>K<sub>5</sub> có bao nhiêu chu trình Hamilton khác nhau (không kể điểm xuất phát và chiều đi)?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) n lẻ (bậc n − 1 phải chẵn). 2) Euler: không (mọi bậc bằng 3). Hamilton: có (mã Gray 000, 001, 011, 010, 110, 111, 101, 100). 3) (5 − 1)!/2 = 12.</p></div>`);

const c104 = L('mad102-ts-10-4',
  '10.4 — Shortest paths, planar graphs and graph colouring|||10.4 — Đường đi ngắn nhất, đồ thị phẳng và tô màu đồ thị',
  'Đồ thị có trọng số, thuật toán Dijkstra (truy vết đường đi) chạy thật bằng Python với heapq; đồ thị phẳng, công thức Euler v − e + f = 2, e ≤ 3v − 6, K₅ và K₃,₃; tô màu, số màu, định lý 4 màu, tô màu tham lam lập lịch thi.',
  `<span class="eyebrow">MAD102 · Chapter 10 · Lesson 10.4</span>
<h2>Shortest paths, planar graphs and graph colouring</h2>
<p class="lead">Navigation apps compute shortest paths millions of times a second; chip designers need circuits that can be laid out without crossing wires; universities schedule exams so that no student has two at the same time. Three classic graph problems, three different flavours of mathematics.</p>
<h3>🎯 Objectives</h3>
<ul><li>Run Dijkstra's algorithm by hand and in code, and know when it applies.</li><li>Use Euler's formula to prove that K<sub>5</sub> and K<sub>3,3</sub> are not planar.</li><li>Find chromatic numbers of small graphs and model scheduling as colouring.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>Shortest paths.</strong> In a weighted graph each edge has a length w(u, v) ≥ 0. <strong>Dijkstra's algorithm</strong> keeps tentative distances; repeatedly it takes the unfinished vertex u with the smallest distance, marks it final, and relaxes its edges: if dist(u) + w(u, v) &lt; dist(v), update dist(v) and remember prev(v) = u. With a binary heap it runs in O((V + E) log V). Correctness relies on non-negative weights: once the closest unfinished vertex is chosen, no later path can be shorter. With negative edges use Bellman–Ford; for all pairs, Floyd–Warshall (Lesson 4.2).</p>
<p><strong>Planar graphs.</strong> A graph is <strong>planar</strong> if it can be drawn in the plane without crossing edges. A planar drawing divides the plane into regions (faces), including the unbounded one.</p>
<div class="formula"><span class="lbl">Euler’s formula (connected planar simple graph)</span>v − e + f = 2<br>Corollaries (v ≥ 3): e ≤ 3v − 6; if there is no triangle, e ≤ 2v − 4.</div>
<p>K<sub>5</sub>: v = 5, e = 10 &gt; 3·5 − 6 = 9 ⇒ not planar. K<sub>3,3</sub>: bipartite (no triangle), e = 9 &gt; 2·6 − 4 = 8 ⇒ not planar. <strong>Kuratowski's theorem</strong>: a graph is planar iff it contains no subdivision of K<sub>5</sub> or K<sub>3,3</sub>. A corollary of e ≤ 3v − 6 is that every planar graph has a vertex of degree ≤ 5.</p>
<p><strong>Colouring.</strong> A proper colouring gives adjacent vertices different colours; the minimum number of colours is the <strong>chromatic number</strong> χ(G). χ(K<sub>n</sub>) = n; χ(C<sub>n</sub>) = 2 for even n, 3 for odd n; χ(G) ≤ 2 ⇔ bipartite. The <strong>Four Colour Theorem</strong> (Appel–Haken 1976, computer-assisted) says every planar graph has χ ≤ 4. Deciding whether χ ≤ 3 is NP-complete, so in practice we use the <strong>greedy</strong> algorithm (often with vertices sorted by decreasing degree), which uses at most Δ + 1 colours where Δ is the maximum degree. Applications: exam timetabling (vertex = exam, edge = shared student, colour = time slot), register allocation in compilers, frequency assignment.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — Dijkstra and greedy colouring.</b> A weighted graph from a to z, and an exam-conflict graph (course codes are illustrative):</p></div>
<pre><code class="language-python">import heapq

def dijkstra(graph, src):
    dist = {v: float("inf") for v in graph}
    prev = {}
    dist[src] = 0
    pq = [(0, src)]
    while pq:
        d, u = heapq.heappop(pq)
        if d &gt; dist[u]:
            continue
        for v, w in graph[u]:
            if d + w &lt; dist[v]:
                dist[v], prev[v] = d + w, u
                heapq.heappush(pq, (dist[v], v))
    return dist, prev

g = {"a": [("b", 4), ("c", 2)], "b": [("a", 4), ("c", 1), ("d", 5)],
     "c": [("a", 2), ("b", 1), ("d", 8), ("e", 10)], "d": [("b", 5), ("c", 8), ("e", 2), ("z", 6)],
     "e": [("c", 10), ("d", 2), ("z", 3)], "z": [("d", 6), ("e", 3)]}
dist, prev = dijkstra(g, "a")
path, v = ["z"], "z"
while v != "a":
    v = prev[v]
    path.append(v)
print(dist)
print("shortest a-&gt;z:", "-".join(reversed(path)), "length", dist["z"])

# greedy colouring for exam scheduling (edge = a student takes both exams)
conflicts = {"MAD": ["PRF", "CEA", "SSL"], "PRF": ["MAD", "CEA"], "CEA": ["MAD", "PRF", "SSL"],
             "SSL": ["MAD", "CEA"], "JPD": []}
color = {}
for v in sorted(conflicts, key=lambda x: -len(conflicts[x])):
    used = {color[w] for w in conflicts[v] if w in color}
    color[v] = next(c for c in range(len(conflicts)) if c not in used)
print(color, "slots:", max(color.values()) + 1)</code></pre>
<div class="out">{'a': 0, 'b': 3, 'c': 2, 'd': 8, 'e': 10, 'z': 13}
shortest a-&gt;z: a-c-b-d-e-z length 13
{'MAD': 0, 'CEA': 1, 'PRF': 2, 'SSL': 2, 'JPD': 0} slots: 3</div>
<p>The shortest route a–c–b–d–e–z has length 2 + 1 + 5 + 2 + 3 = 13; note it goes to b <em>through</em> c (2 + 1 = 3 instead of the direct 4). The exams need 3 slots: MAD, PRF, CEA form a triangle, so 3 is optimal here.</p>
<div class="callout"><p><b>Example 2 — Euler's formula.</b> A connected planar graph with 6 vertices, each of degree 4: e = 6·4/2 = 12, so f = 2 − v + e = 8 regions (e.g. the octahedron).</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Running Dijkstra with negative edge weights.</li><li>Using e ≤ 3v − 6 to “prove” a graph planar — it is only a necessary condition.</li><li>Assuming greedy colouring is optimal; vertex order matters.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Dijkstra: non-negative weights, O((V + E) log V) with a heap.</li><li>Planar: v − e + f = 2; e ≤ 3v − 6; K<sub>5</sub>, K<sub>3,3</sub> are not planar.</li><li>χ(G): bipartite ⇔ χ ≤ 2; planar ⇒ χ ≤ 4.</li><li>Scheduling = colouring; greedy uses ≤ Δ + 1 colours.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://cp-algorithms.com/graph/dijkstra.html" target="_blank" rel="noopener">cp-algorithms — Dijkstra</a></li><li><a href="https://visualgo.net/en/sssp" target="_blank" rel="noopener">VisuAlgo — Single-Source Shortest Paths</a></li><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_gt-planar.html" target="_blank" rel="noopener">Levin, DMOI 2.3 — Planar Graphs</a></li><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_coloring.html" target="_blank" rel="noopener">Levin, DMOI 2.5 — Coloring</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>A connected planar graph has 20 vertices of degree 3. How many faces?</li><li>What is χ of the wheel W<sub>5</sub> (5-cycle plus hub)? Of W<sub>6</sub>?</li><li>In the Dijkstra example, what is the shortest distance from a to e and the path?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) e = 30, f = 2 − 20 + 30 = 12 (the dodecahedron). 2) W<sub>5</sub>: odd rim needs 3 colours + hub ⇒ 4. W<sub>6</sub>: even rim 2 + hub ⇒ 3. 3) 10, along a–c–b–d–e.</p></div>`,
  `<span class="eyebrow">MAD102 · Chương 10 · Bài 10.4</span>
<h2>Đường đi ngắn nhất, đồ thị phẳng và tô màu đồ thị</h2>
<p class="lead">Ứng dụng bản đồ tính đường đi ngắn nhất hàng triệu lần mỗi giây; người thiết kế chip cần mạch dàn được mà không có dây cắt nhau; trường đại học xếp lịch thi sao cho không sinh viên nào có hai môn cùng giờ. Ba bài toán đồ thị kinh điển, ba hương vị toán học khác nhau.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Chạy thuật toán Dijkstra bằng tay và bằng code, biết khi nào dùng được.</li><li>Dùng công thức Euler chứng minh K<sub>5</sub> và K<sub>3,3</sub> không phẳng.</li><li>Tìm số màu của đồ thị nhỏ và mô hình hoá lập lịch thành bài toán tô màu.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Đường đi ngắn nhất.</strong> Trong đồ thị có trọng số, mỗi cạnh có độ dài w(u, v) ≥ 0. <strong>Thuật toán Dijkstra</strong> giữ khoảng cách tạm thời; lặp lại: lấy đỉnh chưa xong u có khoảng cách nhỏ nhất, đánh dấu cố định, rồi nới lỏng các cạnh của nó: nếu dist(u) + w(u, v) &lt; dist(v) thì cập nhật dist(v) và nhớ prev(v) = u. Dùng đống nhị phân, nó chạy trong O((V + E) log V). Tính đúng dựa vào trọng số không âm: khi đã chọn đỉnh chưa xong gần nhất thì không đường đi nào sau đó ngắn hơn được. Có cạnh âm thì dùng Bellman–Ford; cho mọi cặp đỉnh dùng Floyd–Warshall (Bài 4.2).</p>
<p><strong>Đồ thị phẳng.</strong> Đồ thị là <strong>phẳng</strong> nếu vẽ được trên mặt phẳng mà không có cạnh cắt nhau. Một cách vẽ phẳng chia mặt phẳng thành các miền (mặt), kể cả miền vô hạn.</p>
<div class="formula"><span class="lbl">Công thức Euler (đơn đồ thị phẳng liên thông)</span>v − e + f = 2<br>Hệ quả (v ≥ 3): e ≤ 3v − 6; nếu không có tam giác thì e ≤ 2v − 4.</div>
<p>K<sub>5</sub>: v = 5, e = 10 &gt; 3·5 − 6 = 9 ⇒ không phẳng. K<sub>3,3</sub>: hai phía (không có tam giác), e = 9 &gt; 2·6 − 4 = 8 ⇒ không phẳng. <strong>Định lý Kuratowski</strong>: đồ thị phẳng khi và chỉ khi nó không chứa phép chia nhỏ của K<sub>5</sub> hay K<sub>3,3</sub>. Hệ quả của e ≤ 3v − 6 là mọi đồ thị phẳng có một đỉnh bậc ≤ 5.</p>
<p><strong>Tô màu.</strong> Tô màu hợp lệ cho hai đỉnh kề nhau khác màu; số màu ít nhất là <strong>sắc số</strong> χ(G). χ(K<sub>n</sub>) = n; χ(C<sub>n</sub>) = 2 với n chẵn, 3 với n lẻ; χ(G) ≤ 2 ⇔ hai phía. <strong>Định lý bốn màu</strong> (Appel–Haken 1976, có máy tính hỗ trợ): mọi đồ thị phẳng có χ ≤ 4. Quyết định χ ≤ 3 là NP-đầy đủ, nên thực tế dùng thuật toán <strong>tham lam</strong> (thường sắp đỉnh theo bậc giảm dần), dùng không quá Δ + 1 màu với Δ là bậc lớn nhất. Ứng dụng: xếp lịch thi (đỉnh = môn thi, cạnh = có sinh viên chung, màu = ca thi), cấp phát thanh ghi trong trình biên dịch, phân tần số.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — Dijkstra và tô màu tham lam.</b> Một đồ thị có trọng số từ a tới z, và một đồ thị xung đột lịch thi (mã môn chỉ để minh hoạ):</p></div>
<pre><code class="language-python">import heapq

def dijkstra(graph, src):
    dist = {v: float("inf") for v in graph}
    prev = {}
    dist[src] = 0
    pq = [(0, src)]
    while pq:
        d, u = heapq.heappop(pq)
        if d &gt; dist[u]:
            continue
        for v, w in graph[u]:
            if d + w &lt; dist[v]:
                dist[v], prev[v] = d + w, u
                heapq.heappush(pq, (dist[v], v))
    return dist, prev

g = {"a": [("b", 4), ("c", 2)], "b": [("a", 4), ("c", 1), ("d", 5)],
     "c": [("a", 2), ("b", 1), ("d", 8), ("e", 10)], "d": [("b", 5), ("c", 8), ("e", 2), ("z", 6)],
     "e": [("c", 10), ("d", 2), ("z", 3)], "z": [("d", 6), ("e", 3)]}
dist, prev = dijkstra(g, "a")
path, v = ["z"], "z"
while v != "a":
    v = prev[v]
    path.append(v)
print(dist)
print("shortest a-&gt;z:", "-".join(reversed(path)), "length", dist["z"])

# greedy colouring for exam scheduling (edge = a student takes both exams)
conflicts = {"MAD": ["PRF", "CEA", "SSL"], "PRF": ["MAD", "CEA"], "CEA": ["MAD", "PRF", "SSL"],
             "SSL": ["MAD", "CEA"], "JPD": []}
color = {}
for v in sorted(conflicts, key=lambda x: -len(conflicts[x])):
    used = {color[w] for w in conflicts[v] if w in color}
    color[v] = next(c for c in range(len(conflicts)) if c not in used)
print(color, "slots:", max(color.values()) + 1)</code></pre>
<div class="out">{'a': 0, 'b': 3, 'c': 2, 'd': 8, 'e': 10, 'z': 13}
shortest a-&gt;z: a-c-b-d-e-z length 13
{'MAD': 0, 'CEA': 1, 'PRF': 2, 'SSL': 2, 'JPD': 0} slots: 3</div>
<p>Đường ngắn nhất a–c–b–d–e–z dài 2 + 1 + 5 + 2 + 3 = 13; chú ý nó tới b <em>qua</em> c (2 + 1 = 3 thay vì 4 đi thẳng). Lịch thi cần 3 ca: MAD, PRF, CEA tạo thành tam giác nên 3 là tối ưu ở đây.</p>
<div class="callout"><p><b>Ví dụ 2 — công thức Euler.</b> Đồ thị phẳng liên thông 6 đỉnh, mỗi đỉnh bậc 4: e = 6·4/2 = 12, nên f = 2 − v + e = 8 miền (vd khối bát diện).</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Chạy Dijkstra khi có cạnh trọng số âm.</li><li>Dùng e ≤ 3v − 6 để “chứng minh” đồ thị phẳng — đó chỉ là điều kiện cần.</li><li>Cho rằng tô màu tham lam là tối ưu; thứ tự đỉnh có ảnh hưởng.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Dijkstra: trọng số không âm, O((V + E) log V) với đống.</li><li>Phẳng: v − e + f = 2; e ≤ 3v − 6; K<sub>5</sub>, K<sub>3,3</sub> không phẳng.</li><li>χ(G): hai phía ⇔ χ ≤ 2; phẳng ⇒ χ ≤ 4.</li><li>Lập lịch = tô màu; tham lam dùng ≤ Δ + 1 màu.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://cp-algorithms.com/graph/dijkstra.html" target="_blank" rel="noopener">cp-algorithms — Dijkstra</a></li><li><a href="https://visualgo.net/en/sssp" target="_blank" rel="noopener">VisuAlgo — Single-Source Shortest Paths</a></li><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_gt-planar.html" target="_blank" rel="noopener">Levin, DMOI 2.3 — Planar Graphs</a></li><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_coloring.html" target="_blank" rel="noopener">Levin, DMOI 2.5 — Coloring</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Đồ thị phẳng liên thông có 20 đỉnh bậc 3. Nó có bao nhiêu mặt?</li><li>χ của bánh xe W<sub>5</sub> (chu trình 5 đỉnh + trục) là bao nhiêu? Của W<sub>6</sub>?</li><li>Trong ví dụ Dijkstra, khoảng cách ngắn nhất từ a tới e là bao nhiêu và đi đường nào?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) e = 30, f = 2 − 20 + 30 = 12 (khối mười hai mặt). 2) W<sub>5</sub>: vành lẻ cần 3 màu + trục ⇒ 4. W<sub>6</sub>: vành chẵn 2 + trục ⇒ 3. 3) 10, theo a–c–b–d–e.</p></div>`);

const q10 = QZ(10, 'Quiz — Chapter 10: Graphs|||Quiz — Chương 10: Đồ thị', 'Kiểm tra chương 10: định lý bắt tay, Kₙ/Qₙ, hai phía, BFS/DFS, đếm đường đi, đẳng cấu, Euler, Hamilton, Dijkstra, đồ thị phẳng, tô màu.', [
  Q('q1', 'A graph has 10 vertices, each of degree 6. How many edges?|||Đồ thị có 10 đỉnh, mỗi đỉnh bậc 6. Có bao nhiêu cạnh?',
    ['60|||60', '30|||30', '16|||16', '45|||45'], 1,
    'Handshaking: Σ deg = 2|E| ⇒ 60/2 = 30.|||Bắt tay: Σ deg = 2|E| ⇒ 60/2 = 30.'),
  Q('q2', 'How many edges does the 4-cube Q₄ have?|||Khối lập phương Q₄ có bao nhiêu cạnh?',
    ['16|||16', '24|||24', '32|||32', '64|||64'], 2,
    'n·2ⁿ⁻¹ = 4·8 = 32.|||n·2ⁿ⁻¹ = 4·8 = 32.'),
  Q('q3', 'A graph is bipartite if and only if|||Đồ thị là hai phía khi và chỉ khi',
    ['it has no cycle|||nó không có chu trình', 'it has no odd cycle|||nó không có chu trình lẻ', 'it is connected|||nó liên thông', 'all degrees are even|||mọi bậc đều chẵn'], 1,
    'Equivalently, it is 2-colourable.|||Tương đương, nó tô được bằng 2 màu.'),
  Q('q4', 'The (i, j) entry of Aʳ counts|||Phần tử (i, j) của Aʳ đếm',
    ['edges between vi and vj|||số cạnh giữa vi và vj', 'walks of length r from vi to vj|||số đường đi độ dài r từ vi tới vj', 'shortest paths|||số đường đi ngắn nhất', 'common neighbours only|||chỉ số láng giềng chung'], 1,
    'Proof by induction on r using matrix multiplication.|||Chứng minh bằng quy nạp theo r dùng phép nhân ma trận.'),
  Q('q5', 'Which algorithm finds shortest paths by number of edges in an unweighted graph?|||Thuật toán nào tìm đường đi ít cạnh nhất trên đồ thị không trọng số?',
    ['DFS|||DFS', 'BFS|||BFS', 'Kruskal|||Kruskal', 'Hierholzer|||Hierholzer'], 1,
    'BFS explores vertices in order of distance.|||BFS duyệt đỉnh theo thứ tự khoảng cách.'),
  Q('q6', 'A connected multigraph has an Euler circuit if and only if|||Đa đồ thị liên thông có chu trình Euler khi và chỉ khi',
    ['every vertex has even degree|||mọi đỉnh có bậc chẵn', 'exactly two vertices have odd degree|||có đúng hai đỉnh bậc lẻ', 'every degree is at least n/2|||mọi bậc ít nhất n/2', 'it is bipartite|||nó là hai phía'], 0,
    'Euler’s theorem; two odd vertices give a path, not a circuit.|||Định lý Euler; hai đỉnh lẻ cho đường đi, không phải chu trình.'),
  Q('q7', 'Deciding whether a graph has a Hamilton circuit is|||Quyết định đồ thị có chu trình Hamilton hay không là',
    ['solvable in O(E) by degrees|||giải được trong O(E) nhờ bậc', 'NP-complete|||NP-đầy đủ', 'undecidable|||không quyết định được', 'always yes for connected graphs|||luôn có với đồ thị liên thông'], 1,
    'Only sufficient conditions (Dirac, Ore) are known.|||Chỉ biết điều kiện đủ (Dirac, Ore).'),
  Q('q8', 'Why is K₅ not planar?|||Vì sao K₅ không phẳng?',
    ['it has 5 vertices|||nó có 5 đỉnh', 'e = 10 exceeds 3v − 6 = 9|||e = 10 vượt 3v − 6 = 9', 'it is bipartite|||nó là hai phía', 'it has an Euler circuit|||nó có chu trình Euler'], 1,
    'Every connected planar simple graph with v ≥ 3 has e ≤ 3v − 6.|||Mọi đơn đồ thị phẳng liên thông với v ≥ 3 có e ≤ 3v − 6.'),
  Q('q9', 'The chromatic number of the odd cycle C₇ is|||Sắc số của chu trình lẻ C₇ là',
    ['2|||2', '3|||3', '4|||4', '7|||7'], 1,
    'Odd cycles are not bipartite but 3 colours suffice.|||Chu trình lẻ không hai phía nhưng 3 màu là đủ.'),
]);

const ch10 = {
  title: 'Chapter 10 — Graphs: connectivity, paths, planarity, colouring|||Chương 10 — Đồ thị: liên thông, đường đi, tính phẳng, tô màu',
  description: 'Thuật ngữ và biểu diễn đồ thị, định lý bắt tay, hai phía, BFS/DFS, đếm đường đi bằng ma trận, đẳng cấu, Euler (Hierholzer) và Hamilton, Dijkstra, đồ thị phẳng, tô màu — có code Python (Rosen ch. 10 · MCS ch. 12, 13).',
  lessons: [c101, c102, c103, c104, q10],
};

// ───────────────────────────── Chương 11 — Cây ─────────────────────────────
const c111 = L('mad102-ts-11-1',
  '11.1 — Trees: properties, rooted trees and m-ary trees|||11.1 — Cây: tính chất, cây có gốc và cây m-phân',
  'Định nghĩa cây và các điều kiện tương đương (n − 1 cạnh, đường đi duy nhất), cây có gốc (cha, con, lá, mức, chiều cao), cây m-phân đầy đủ: n = mi + 1, số lá; chiều cao tối thiểu ⌈logₘ l⌉; công thức Cayley nⁿ⁻².',
  `<span class="eyebrow">MAD102 · Chapter 11 · Lesson 11.1</span>
<h2>Trees: properties, rooted trees and m-ary trees</h2>
<p class="lead">Trees are everywhere in computing: file systems, the DOM of a web page, parse trees in compilers, decision trees in machine learning, B-trees in databases, routing trees in networks. Their power comes from one property: between any two vertices there is exactly one path.</p>
<h3>🎯 Objectives</h3>
<ul><li>State the equivalent characterisations of a tree and use “n vertices ⇒ n − 1 edges”.</li><li>Use rooted-tree vocabulary: parent, child, ancestor, leaf, level, height, balanced.</li><li>Apply the counting formulas for full m-ary trees and the height bound.</li></ul>
<h3>📖 Lecture</h3>
<p>A <strong>tree</strong> is a connected undirected graph with no simple circuits. A <strong>forest</strong> is a graph whose components are trees. For a simple graph T with n vertices, the following are equivalent:</p>
<div class="formula"><span class="lbl">Characterisations of a tree</span>(1) T is connected and has no cycle · (2) every two vertices are joined by a unique simple path<br>(3) T is connected and has n − 1 edges · (4) T has no cycle and has n − 1 edges<br>(5) T is minimally connected: removing any edge disconnects it</div>
<p>Proof sketch of “n − 1 edges”: a tree with n ≥ 2 vertices has a leaf (follow a longest path; its end has degree 1); removing the leaf and its edge leaves a tree with n − 1 vertices; induct.</p>
<p>A <strong>rooted tree</strong> designates one vertex as the root and directs every edge away from it. Vocabulary: <strong>parent</strong>, <strong>child</strong>, <strong>siblings</strong>, <strong>ancestors</strong>, <strong>descendants</strong>, <strong>leaf</strong> (no children), <strong>internal vertex</strong> (has children), the <strong>level</strong> of a vertex (length of its path from the root) and the <strong>height</strong> (maximum level). A rooted tree is <strong>m-ary</strong> if every internal vertex has at most m children, <strong>full m-ary</strong> if exactly m; binary means m = 2. It is <strong>balanced</strong> if all leaves are at levels h or h − 1.</p>
<div class="formula"><span class="lbl">Full m-ary tree with i internal vertices</span>n = mi + 1 vertices,  l = (m − 1)i + 1 leaves<br>An m-ary tree of height h has at most m<sup>h</sup> leaves ⇒ h ≥ ⌈log<sub>m</sub> l⌉ (equality possible when full and balanced)</div>
<p>The first formula counts edges two ways: each internal vertex has m children, and every vertex except the root is somebody's child. The height bound explains why balanced search trees and B-trees keep operations at O(log n): one million keys fit in a balanced binary tree of height 20.</p>
<p><strong>Cayley's formula:</strong> there are n<sup>n−2</sup> labelled trees on n vertices (1, 3, 16, 125, 1296 for n = 2, …, 6).</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — chain letter.</b> Each person who receives a letter either sends it to exactly 4 others or to nobody. If 100 people sent it on, the communication tree is full 4-ary with i = 100: n = 401 people received or started it, and l = 301 did not send it on.</p></div>
<div class="callout"><p><b>Example 2 — tournament.</b> A single-elimination tournament with 1000 players is a full binary tree with 1000 leaves: i = l − 1 = 999 matches, and at least ⌈log<sub>2</sub> 1000⌉ = 10 rounds.</p></div>
<pre><code class="language-python">import math
# full m-ary tree with i internal vertices: n = m*i + 1 vertices, l = (m-1)*i + 1 leaves
for m, i in [(2, 5), (3, 4), (5, 100)]:
    print(m, i, "vertices", m * i + 1, "leaves", (m - 1) * i + 1)
# binary tree of height h has at most 2^h leaves  -&gt;  h &gt;= ceil(log2 l)
print([math.ceil(math.log2(l)) for l in [1000, 10**6]])
# Cayley: number of labelled trees on n vertices = n^(n-2)
print([n ** (n - 2) for n in range(2, 7)])</code></pre>
<div class="out">2 5 vertices 11 leaves 6
3 4 vertices 13 leaves 9
5 100 vertices 501 leaves 401
[10, 20]
[1, 3, 16, 125, 1296]</div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Applying n − 1 edges to a forest (a forest with c components has n − c edges).</li><li>Confusing level (depth of a vertex) with height (maximum depth of the tree).</li><li>Using the full m-ary formulas for trees that are not full.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Tree ⇔ connected + acyclic ⇔ unique paths ⇔ connected with n − 1 edges.</li><li>Rooted trees: parent/child, leaves, level, height, balanced.</li><li>Full m-ary: n = mi + 1, l = (m − 1)i + 1.</li><li>Height ≥ ⌈log<sub>m</sub> l⌉ — balanced trees give logarithmic depth.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_trees.html" target="_blank" rel="noopener">Levin, DMOI 2.2 — Trees</a></li><li><a href="https://brilliant.org/wiki/trees-basic/" target="_blank" rel="noopener">Brilliant — Trees</a></li><li><a href="https://en.wikipedia.org/wiki/Tree_(graph_theory)" target="_blank" rel="noopener">Wikipedia — Tree (graph theory)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>A forest has 50 vertices and 3 components. How many edges?</li><li>A full ternary tree has 13 vertices. How many internal vertices and leaves?</li><li>What is the minimum height of a binary tree with 500 leaves?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 50 − 3 = 47. 2) n = 3i + 1 = 13 ⇒ i = 4, l = 9. 3) ⌈log<sub>2</sub> 500⌉ = 9.</p></div>`,
  `<span class="eyebrow">MAD102 · Chương 11 · Bài 11.1</span>
<h2>Cây: tính chất, cây có gốc và cây m-phân</h2>
<p class="lead">Cây có mặt khắp nơi trong tin học: hệ thống tệp, DOM của trang web, cây phân tích cú pháp trong trình biên dịch, cây quyết định trong học máy, B-tree trong cơ sở dữ liệu, cây định tuyến trong mạng. Sức mạnh của chúng đến từ một tính chất: giữa hai đỉnh bất kỳ có đúng một đường đi.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phát biểu các đặc trưng tương đương của cây và dùng “n đỉnh ⇒ n − 1 cạnh”.</li><li>Dùng thuật ngữ cây có gốc: cha, con, tổ tiên, lá, mức, chiều cao, cân bằng.</li><li>Áp dụng các công thức đếm cho cây m-phân đầy đủ và cận chiều cao.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Cây</strong> là đồ thị vô hướng liên thông không có chu trình đơn. <strong>Rừng</strong> là đồ thị mà mỗi thành phần là một cây. Với đơn đồ thị T có n đỉnh, các điều sau tương đương:</p>
<div class="formula"><span class="lbl">Đặc trưng của cây</span>(1) T liên thông và không có chu trình · (2) mọi hai đỉnh được nối bởi đúng một đường đi đơn<br>(3) T liên thông và có n − 1 cạnh · (4) T không có chu trình và có n − 1 cạnh<br>(5) T liên thông tối tiểu: bỏ bất kỳ cạnh nào cũng mất liên thông</div>
<p>Ý chứng minh “n − 1 cạnh”: cây có n ≥ 2 đỉnh thì có lá (đi theo một đường đi dài nhất; đầu mút có bậc 1); bỏ lá và cạnh của nó được cây n − 1 đỉnh; quy nạp.</p>
<p><strong>Cây có gốc</strong> chọn một đỉnh làm gốc và hướng mọi cạnh ra xa gốc. Thuật ngữ: <strong>cha</strong>, <strong>con</strong>, <strong>anh em</strong>, <strong>tổ tiên</strong>, <strong>hậu duệ</strong>, <strong>lá</strong> (không có con), <strong>đỉnh trong</strong> (có con), <strong>mức</strong> của đỉnh (độ dài đường đi từ gốc) và <strong>chiều cao</strong> (mức lớn nhất). Cây có gốc là <strong>m-phân</strong> nếu mỗi đỉnh trong có không quá m con, <strong>m-phân đầy đủ</strong> nếu có đúng m con; nhị phân là m = 2. Cây <strong>cân bằng</strong> nếu mọi lá ở mức h hoặc h − 1.</p>
<div class="formula"><span class="lbl">Cây m-phân đầy đủ có i đỉnh trong</span>n = mi + 1 đỉnh,  l = (m − 1)i + 1 lá<br>Cây m-phân chiều cao h có không quá m<sup>h</sup> lá ⇒ h ≥ ⌈log<sub>m</sub> l⌉ (đạt dấu bằng khi đầy đủ và cân bằng)</div>
<p>Công thức thứ nhất đếm cạnh theo hai cách: mỗi đỉnh trong có m con, và mọi đỉnh trừ gốc đều là con của ai đó. Cận chiều cao giải thích vì sao cây tìm kiếm cân bằng và B-tree giữ thao tác ở O(log n): một triệu khoá vừa trong cây nhị phân cân bằng cao 20.</p>
<p><strong>Công thức Cayley:</strong> có n<sup>n−2</sup> cây gán nhãn trên n đỉnh (1, 3, 16, 125, 1296 với n = 2, …, 6).</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — thư dây chuyền.</b> Mỗi người nhận thư hoặc gửi tiếp cho đúng 4 người, hoặc không gửi. Nếu 100 người gửi tiếp thì cây liên lạc là cây 4-phân đầy đủ với i = 100: n = 401 người đã nhận hoặc khởi xướng, và l = 301 người không gửi tiếp.</p></div>
<div class="callout"><p><b>Ví dụ 2 — giải đấu.</b> Giải loại trực tiếp 1000 người chơi là cây nhị phân đầy đủ có 1000 lá: i = l − 1 = 999 trận, và ít nhất ⌈log<sub>2</sub> 1000⌉ = 10 vòng.</p></div>
<pre><code class="language-python">import math
# full m-ary tree with i internal vertices: n = m*i + 1 vertices, l = (m-1)*i + 1 leaves
for m, i in [(2, 5), (3, 4), (5, 100)]:
    print(m, i, "vertices", m * i + 1, "leaves", (m - 1) * i + 1)
# binary tree of height h has at most 2^h leaves  -&gt;  h &gt;= ceil(log2 l)
print([math.ceil(math.log2(l)) for l in [1000, 10**6]])
# Cayley: number of labelled trees on n vertices = n^(n-2)
print([n ** (n - 2) for n in range(2, 7)])</code></pre>
<div class="out">2 5 vertices 11 leaves 6
3 4 vertices 13 leaves 9
5 100 vertices 501 leaves 401
[10, 20]
[1, 3, 16, 125, 1296]</div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Áp n − 1 cạnh cho rừng (rừng có c thành phần thì có n − c cạnh).</li><li>Nhầm mức (độ sâu của một đỉnh) với chiều cao (độ sâu lớn nhất của cây).</li><li>Dùng công thức cây m-phân đầy đủ cho cây không đầy đủ.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Cây ⇔ liên thông + không chu trình ⇔ đường đi duy nhất ⇔ liên thông với n − 1 cạnh.</li><li>Cây có gốc: cha/con, lá, mức, chiều cao, cân bằng.</li><li>m-phân đầy đủ: n = mi + 1, l = (m − 1)i + 1.</li><li>Chiều cao ≥ ⌈log<sub>m</sub> l⌉ — cây cân bằng cho độ sâu logarit.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://discrete.openmathbooks.org/dmoi4/sec_trees.html" target="_blank" rel="noopener">Levin, DMOI 2.2 — Trees</a></li><li><a href="https://brilliant.org/wiki/trees-basic/" target="_blank" rel="noopener">Brilliant — Trees</a></li><li><a href="https://en.wikipedia.org/wiki/Tree_(graph_theory)" target="_blank" rel="noopener">Wikipedia — Tree (graph theory)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Rừng có 50 đỉnh và 3 thành phần. Có bao nhiêu cạnh?</li><li>Cây tam phân đầy đủ có 13 đỉnh. Có bao nhiêu đỉnh trong và bao nhiêu lá?</li><li>Chiều cao nhỏ nhất của cây nhị phân có 500 lá là bao nhiêu?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 50 − 3 = 47. 2) n = 3i + 1 = 13 ⇒ i = 4, l = 9. 3) ⌈log<sub>2</sub> 500⌉ = 9.</p></div>`);

const c112 = L('mad102-ts-11-2',
  '11.2 — Applications of trees: search trees, decision trees, Huffman codes|||11.2 — Ứng dụng của cây: cây tìm kiếm, cây quyết định, mã Huffman',
  'Cây tìm kiếm nhị phân (chèn, tìm, độ phức tạp theo chiều cao), cây quyết định và cận dưới Ω(n log n) cho sắp xếp so sánh (⌈log₂ n!⌉), mã tiền tố và thuật toán Huffman chạy thật bằng heapq.',
  `<span class="eyebrow">MAD102 · Chapter 11 · Lesson 11.2</span>
<h2>Applications of trees: search trees, decision trees, Huffman codes</h2>
<p class="lead">Three applications show three different uses of trees: storing data for fast lookup, proving that no algorithm can beat a certain bound, and compressing data optimally.</p>
<h3>🎯 Objectives</h3>
<ul><li>Insert into and search a binary search tree, and relate its cost to its height.</li><li>Use decision trees to prove the Ω(n log n) lower bound for comparison sorting.</li><li>Build a Huffman code and compute its average code length.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>Binary search trees (BST).</strong> Each vertex stores a key; all keys in the left subtree are smaller, all keys in the right subtree larger. Search and insertion walk down one path from the root, so they cost O(h) where h is the height. With keys inserted in random order h is O(log n) on average, but inserting sorted keys creates a path of height n − 1. Self-balancing trees (AVL, red–black) and B-trees guarantee h = O(log n).</p>
<p><strong>Decision trees.</strong> An algorithm that decides only by comparisons can be drawn as a binary tree: each internal vertex is a comparison, each leaf an outcome. Sorting n distinct items must distinguish all n! orderings, so the tree has at least n! leaves and height at least ⌈log<sub>2</sub> n!⌉. Since log<sub>2</sub> n! = Θ(n log n), <strong>every comparison sort needs Ω(n log n) comparisons in the worst case</strong> — merge sort and heapsort are optimal. The same argument shows that finding one lighter counterfeit coin among 8 with a balance scale needs ⌈log<sub>3</sub> 8⌉ = 2 weighings (3 outcomes per weighing).</p>
<p><strong>Prefix codes.</strong> To encode characters with variable-length bit strings so that decoding is unambiguous, no codeword may be a prefix of another. Such a code is a binary tree: characters at the leaves, 0 = left edge, 1 = right edge; decoding follows edges from the root until a leaf.</p>
<div class="formula"><span class="lbl">Huffman’s algorithm</span>Start with one single-vertex tree per symbol, weighted by its frequency.<br>Repeat: remove the two trees of smallest weight, join them under a new root (weight = sum).<br>Stop when one tree remains. The result minimises the average code length Σ f(c)·len(c).</div>
<p>Huffman coding is a building block of DEFLATE (ZIP, PNG, gzip) and of JPEG.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — BST.</b> Insert 50, 30, 70, 20, 40, 60, 80: the tree has height 2 and a search needs at most 3 comparisons. Insert the same keys sorted (20, 30, …, 80): height 6, up to 7 comparisons.</p></div>
<div class="callout"><p><b>Example 2 — Huffman (Rosen's example) and the sorting lower bound.</b> Frequencies A 0.08, B 0.10, C 0.12, D 0.15, E 0.20, F 0.35:</p></div>
<pre><code class="language-python">import heapq, math

def huffman(freq):
    heap = [(f, i, {ch: ""}) for i, (ch, f) in enumerate(sorted(freq.items()))]
    heapq.heapify(heap)
    k = len(heap)
    while len(heap) &gt; 1:
        f1, _, c1 = heapq.heappop(heap)      # two least frequent subtrees
        f2, _, c2 = heapq.heappop(heap)
        merged = {ch: "0" + code for ch, code in c1.items()}
        merged.update({ch: "1" + code for ch, code in c2.items()})
        heapq.heappush(heap, (f1 + f2, k, merged))
        k += 1
    return heap[0][2]

freq = {"A": 0.08, "B": 0.10, "C": 0.12, "D": 0.15, "E": 0.20, "F": 0.35}
code = huffman(freq)
for ch in sorted(code):
    print(ch, code[ch])
print("average bits/symbol:", round(sum(freq[c] * len(code[c]) for c in freq), 2))

# decision-tree lower bound for comparison sorting
for n in [4, 10, 100]:
    print(n, "comparisons needed in worst case &gt;=", math.ceil(math.log2(math.factorial(n))))</code></pre>
<div class="out">A 000
B 001
C 100
D 101
E 01
F 11
average bits/symbol: 2.45
4 comparisons needed in worst case &gt;= 5
10 comparisons needed in worst case &gt;= 22
100 comparisons needed in worst case &gt;= 525</div>
<p>The average is 2.45 bits per symbol, versus 3 bits for a fixed-length code for 6 symbols. (Ties may be broken differently by another implementation, giving different codewords but the same average.) The lower bound says sorting 4 items needs 5 comparisons in the worst case, 10 items 22, 100 items 525.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Assuming every BST has O(log n) height.</li><li>Merging the two <em>largest</em> weights in Huffman's algorithm.</li><li>Reading the decision-tree bound as a statement about average speed of every algorithm — it applies to comparison-based algorithms only (counting sort beats it on small integer keys).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>BST operations cost O(height); balancing keeps it O(log n).</li><li>Decision trees: n! leaves ⇒ comparison sorting is Ω(n log n).</li><li>Prefix codes = binary trees with symbols at the leaves.</li><li>Huffman: repeatedly merge the two lightest trees; optimal average length.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://visualgo.net/en/bst" target="_blank" rel="noopener">VisuAlgo — Binary Search Tree, AVL Tree</a></li><li><a href="https://brilliant.org/wiki/huffman-encoding/" target="_blank" rel="noopener">Brilliant — Huffman Code</a></li><li><a href="https://en.wikipedia.org/wiki/Huffman_coding" target="_blank" rel="noopener">Wikipedia — Huffman coding</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Insert 15, 10, 20, 8, 12, 25, 6 into an empty BST. What is its height?</li><li>Is {0, 10, 110, 111} a prefix code? Is {0, 01, 11}?</li><li>Build a Huffman code for a: 0.5, b: 0.25, c: 0.125, d: 0.125 and give the average length.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Height 3 (15 → 10 → 8 → 6). 2) Yes; no (0 is a prefix of 01). 3) a = 0, b = 10, c = 110, d = 111 (up to swapping 0/1); average 0.5·1 + 0.25·2 + 0.125·3·2 = 1.75 bits.</p></div>`,
  `<span class="eyebrow">MAD102 · Chương 11 · Bài 11.2</span>
<h2>Ứng dụng của cây: cây tìm kiếm, cây quyết định, mã Huffman</h2>
<p class="lead">Ba ứng dụng cho thấy ba cách dùng cây khác nhau: lưu dữ liệu để tra nhanh, chứng minh rằng không thuật toán nào vượt được một cận, và nén dữ liệu tối ưu.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Chèn và tìm kiếm trên cây tìm kiếm nhị phân, liên hệ chi phí với chiều cao.</li><li>Dùng cây quyết định chứng minh cận dưới Ω(n log n) cho sắp xếp dựa trên so sánh.</li><li>Dựng mã Huffman và tính độ dài mã trung bình.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Cây tìm kiếm nhị phân (BST).</strong> Mỗi đỉnh lưu một khoá; mọi khoá trong cây con trái nhỏ hơn, mọi khoá trong cây con phải lớn hơn. Tìm và chèn đi xuống một đường từ gốc, nên tốn O(h) với h là chiều cao. Nếu khoá được chèn theo thứ tự ngẫu nhiên thì trung bình h là O(log n), nhưng chèn khoá đã sắp tạo ra một đường đi cao n − 1. Cây tự cân bằng (AVL, đỏ – đen) và B-tree bảo đảm h = O(log n).</p>
<p><strong>Cây quyết định.</strong> Thuật toán chỉ quyết định bằng phép so sánh vẽ được thành cây nhị phân: mỗi đỉnh trong là một phép so sánh, mỗi lá là một kết quả. Sắp xếp n phần tử phân biệt phải phân biệt cả n! thứ tự, nên cây có ít nhất n! lá và chiều cao ít nhất ⌈log<sub>2</sub> n!⌉. Vì log<sub>2</sub> n! = Θ(n log n), <strong>mọi thuật toán sắp xếp dựa trên so sánh cần Ω(n log n) phép so sánh trong trường hợp xấu nhất</strong> — merge sort và heapsort là tối ưu. Cùng lập luận đó cho thấy tìm một đồng xu giả (nhẹ hơn) trong 8 đồng bằng cân đĩa cần ⌈log<sub>3</sub> 8⌉ = 2 lần cân (mỗi lần cân có 3 kết quả).</p>
<p><strong>Mã tiền tố.</strong> Để mã hoá ký tự bằng chuỗi bit độ dài thay đổi mà giải mã không nhập nhằng, không từ mã nào được là tiền tố của từ mã khác. Mã như vậy là một cây nhị phân: ký tự ở lá, 0 = cạnh trái, 1 = cạnh phải; giải mã đi theo cạnh từ gốc tới khi gặp lá.</p>
<div class="formula"><span class="lbl">Thuật toán Huffman</span>Bắt đầu với mỗi ký hiệu là một cây một đỉnh, trọng số bằng tần suất.<br>Lặp: lấy ra hai cây trọng số nhỏ nhất, nối chúng dưới một gốc mới (trọng số = tổng).<br>Dừng khi còn một cây. Kết quả cực tiểu hoá độ dài mã trung bình Σ f(c)·len(c).</div>
<p>Mã Huffman là một khối xây dựng của DEFLATE (ZIP, PNG, gzip) và của JPEG.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — BST.</b> Chèn 50, 30, 70, 20, 40, 60, 80: cây cao 2 và một lần tìm cần không quá 3 phép so sánh. Chèn cùng các khoá đó theo thứ tự tăng (20, 30, …, 80): cao 6, tới 7 phép so sánh.</p></div>
<div class="callout"><p><b>Ví dụ 2 — Huffman (ví dụ của Rosen) và cận dưới cho sắp xếp.</b> Tần suất A 0,08, B 0,10, C 0,12, D 0,15, E 0,20, F 0,35:</p></div>
<pre><code class="language-python">import heapq, math

def huffman(freq):
    heap = [(f, i, {ch: ""}) for i, (ch, f) in enumerate(sorted(freq.items()))]
    heapq.heapify(heap)
    k = len(heap)
    while len(heap) &gt; 1:
        f1, _, c1 = heapq.heappop(heap)      # two least frequent subtrees
        f2, _, c2 = heapq.heappop(heap)
        merged = {ch: "0" + code for ch, code in c1.items()}
        merged.update({ch: "1" + code for ch, code in c2.items()})
        heapq.heappush(heap, (f1 + f2, k, merged))
        k += 1
    return heap[0][2]

freq = {"A": 0.08, "B": 0.10, "C": 0.12, "D": 0.15, "E": 0.20, "F": 0.35}
code = huffman(freq)
for ch in sorted(code):
    print(ch, code[ch])
print("average bits/symbol:", round(sum(freq[c] * len(code[c]) for c in freq), 2))

# decision-tree lower bound for comparison sorting
for n in [4, 10, 100]:
    print(n, "comparisons needed in worst case &gt;=", math.ceil(math.log2(math.factorial(n))))</code></pre>
<div class="out">A 000
B 001
C 100
D 101
E 01
F 11
average bits/symbol: 2.45
4 comparisons needed in worst case &gt;= 5
10 comparisons needed in worst case &gt;= 22
100 comparisons needed in worst case &gt;= 525</div>
<p>Trung bình 2,45 bit mỗi ký hiệu, so với 3 bit của mã độ dài cố định cho 6 ký hiệu. (Cài đặt khác có thể phá thế hoà khác đi, cho từ mã khác nhưng cùng độ dài trung bình.) Cận dưới cho biết sắp xếp 4 phần tử cần 5 phép so sánh trong trường hợp xấu nhất, 10 phần tử cần 22, 100 phần tử cần 525.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Cho rằng mọi BST đều cao O(log n).</li><li>Gộp hai cây trọng số <em>lớn nhất</em> trong thuật toán Huffman.</li><li>Hiểu cận cây quyết định là nói về tốc độ của mọi thuật toán — nó chỉ áp dụng cho thuật toán dựa trên so sánh (counting sort vượt nó với khoá là số nguyên nhỏ).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Thao tác BST tốn O(chiều cao); cân bằng giữ ở O(log n).</li><li>Cây quyết định: n! lá ⇒ sắp xếp so sánh là Ω(n log n).</li><li>Mã tiền tố = cây nhị phân có ký hiệu ở lá.</li><li>Huffman: liên tục gộp hai cây nhẹ nhất; độ dài trung bình tối ưu.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://visualgo.net/en/bst" target="_blank" rel="noopener">VisuAlgo — Binary Search Tree, AVL Tree</a></li><li><a href="https://brilliant.org/wiki/huffman-encoding/" target="_blank" rel="noopener">Brilliant — Huffman Code</a></li><li><a href="https://en.wikipedia.org/wiki/Huffman_coding" target="_blank" rel="noopener">Wikipedia — Huffman coding</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Chèn 15, 10, 20, 8, 12, 25, 6 vào BST rỗng. Cây cao bao nhiêu?</li><li>{0, 10, 110, 111} có là mã tiền tố không? {0, 01, 11} thì sao?</li><li>Dựng mã Huffman cho a: 0,5, b: 0,25, c: 0,125, d: 0,125 và tính độ dài trung bình.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Cao 3 (15 → 10 → 8 → 6). 2) Có; không (0 là tiền tố của 01). 3) a = 0, b = 10, c = 110, d = 111 (có thể đổi 0/1); trung bình 0,5·1 + 0,25·2 + 0,125·3·2 = 1,75 bit.</p></div>`);

const c113 = L('mad102-ts-11-3',
  '11.3 — Tree traversal and expression trees|||11.3 — Duyệt cây và cây biểu thức',
  'Duyệt tiền thứ tự, trung thứ tự, hậu thứ tự; cây biểu thức, ký pháp tiền tố (Ba Lan), trung tố, hậu tố (Ba Lan ngược); tính biểu thức hậu tố bằng ngăn xếp — code Python chạy thật.',
  `<span class="eyebrow">MAD102 · Chapter 11 · Lesson 11.3</span>
<h2>Tree traversal and expression trees</h2>
<p class="lead">To print a directory tree, evaluate a formula in a spreadsheet, or generate machine code from a parse tree, a program must visit every vertex of a tree in a systematic order. The three classic orders correspond exactly to the three ways of writing an arithmetic expression.</p>
<h3>🎯 Objectives</h3>
<ul><li>Perform preorder, inorder and postorder traversals of an ordered rooted tree.</li><li>Build the expression tree of an arithmetic formula and write it in prefix, infix and postfix notation.</li><li>Evaluate prefix and postfix expressions with a stack.</li></ul>
<h3>📖 Lecture</h3>
<p>In an <strong>ordered rooted tree</strong> the children of each vertex are ordered left to right. For a tree with root r and subtrees T<sub>1</sub>, …, T<sub>n</sub>:</p>
<div class="formula"><span class="lbl">Traversals</span>Preorder: visit r, then preorder(T<sub>1</sub>), …, preorder(T<sub>n</sub>)<br>Inorder (binary): inorder(left), visit r, inorder(right)<br>Postorder: postorder(T<sub>1</sub>), …, postorder(T<sub>n</sub>), then visit r</div>
<p>Each traversal visits every vertex once: O(n). Inorder traversal of a BST lists the keys in sorted order. Postorder is what <code>du</code> does to compute directory sizes (children first); preorder is how <code>ls -R</code> or a table of contents prints (parent first). BFS on a tree is the fourth common order, “level order”.</p>
<p><strong>Expression trees.</strong> A formula with binary operators is an ordered binary tree: operators at internal vertices, operands at leaves. The three traversals give three notations:</p>
<ul>
<li><strong>Infix</strong> (inorder): x + y — needs parentheses and precedence rules to be unambiguous.</li>
<li><strong>Prefix</strong> or Polish notation (preorder): + x y — no parentheses needed. Lisp uses it.</li>
<li><strong>Postfix</strong> or reverse Polish notation (postorder): x y + — no parentheses needed; evaluated left to right with a stack. The Java Virtual Machine, Python bytecode and many calculators work this way.</li>
</ul>
<p><strong>Evaluating postfix:</strong> scan left to right; push operands; on an operator, pop the top two values (the right operand first), apply the operator, push the result. At the end the stack holds the answer. Prefix is evaluated the same way scanning right to left.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — one tree, three notations.</b> The expression ((x + y) ^ 2) + ((x − 4) / 3) as a tree, traversed three ways; then the postfix expression 7 2 3 * − 4 ^ 9 3 / + evaluated with a stack:</p></div>
<pre><code class="language-python">class Node:
    def __init__(self, val, left=None, right=None):
        self.val, self.left, self.right = val, left, right

def preorder(t):
    return [] if t is None else [t.val] + preorder(t.left) + preorder(t.right)
def inorder(t):
    return [] if t is None else inorder(t.left) + [t.val] + inorder(t.right)
def postorder(t):
    return [] if t is None else postorder(t.left) + postorder(t.right) + [t.val]

# expression tree for ((x + y) ^ 2) + ((x - 4) / 3)
expr = Node("+", Node("^", Node("+", Node("x"), Node("y")), Node("2")),
                 Node("/", Node("-", Node("x"), Node("4")), Node("3")))
print("prefix :", " ".join(preorder(expr)))
print("infix  :", " ".join(inorder(expr)))
print("postfix:", " ".join(postorder(expr)))

def eval_postfix(tokens):
    st = []
    ops = {"+": lambda a, b: a + b, "-": lambda a, b: a - b, "*": lambda a, b: a * b,
           "/": lambda a, b: a / b, "^": lambda a, b: a ** b}
    for t in tokens:
        if t in ops:
            b, a = st.pop(), st.pop()
            st.append(ops[t](a, b))
        else:
            st.append(float(t))
    return st[0]

print(eval_postfix("7 2 3 * - 4 ^ 9 3 / +".split()))</code></pre>
<div class="out">prefix : + ^ + x y 2 / - x 4 3
infix  : x + y ^ 2 + x - 4 / 3
postfix: x y + 2 ^ x 4 - 3 / +
4.0</div>
<p>The infix line has lost the parentheses — inorder traversal alone is ambiguous, which is why compilers keep the tree. The postfix evaluation: 2·3 = 6; 7 − 6 = 1; 1<sup>4</sup> = 1; 9/3 = 3; 1 + 3 = 4.</p>
<div class="callout"><p><b>Example 2 — prefix by hand.</b> Evaluate + − * 2 3 5 / ^ 2 3 4 (Rosen). Right to left: 2<sup>3</sup> = 8; 8/4 = 2; 2·3 = 6; 6 − 5 = 1; 1 + 2 = 3.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Popping operands in the wrong order for − and / (the first pop is the <em>right</em> operand).</li><li>Writing infix from an inorder traversal without restoring parentheses.</li><li>Confusing preorder with level order.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Preorder: root first; postorder: root last; inorder: root in the middle.</li><li>Inorder of a BST = sorted keys.</li><li>Expression trees: prefix and postfix need no parentheses.</li><li>Postfix evaluation uses a stack in O(n).</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Tree_traversal" target="_blank" rel="noopener">Wikipedia — Tree traversal</a></li><li><a href="https://en.wikipedia.org/wiki/Polish_notation" target="_blank" rel="noopener">Wikipedia — Polish notation</a></li><li><a href="https://en.wikipedia.org/wiki/Binary_tree" target="_blank" rel="noopener">Wikipedia — Binary tree</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Write (A + B) * (C − D) in prefix and postfix.</li><li>Evaluate the postfix expression 5 1 2 + 4 * + 3 −.</li><li>Give the preorder and postorder of the BST built from 50, 30, 70, 20, 40.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Prefix * + A B − C D; postfix A B + C D − *. 2) 1 + 2 = 3; 3·4 = 12; 5 + 12 = 17; 17 − 3 = 14. 3) Preorder 50 30 20 40 70; postorder 20 40 30 70 50.</p></div>`,
  `<span class="eyebrow">MAD102 · Chương 11 · Bài 11.3</span>
<h2>Duyệt cây và cây biểu thức</h2>
<p class="lead">Để in cây thư mục, tính công thức trong bảng tính, hay sinh mã máy từ cây phân tích cú pháp, chương trình phải thăm mọi đỉnh của cây theo một thứ tự có hệ thống. Ba thứ tự kinh điển tương ứng đúng với ba cách viết một biểu thức số học.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Duyệt tiền thứ tự, trung thứ tự và hậu thứ tự trên cây có gốc có thứ tự.</li><li>Dựng cây biểu thức của một công thức và viết nó ở ký pháp tiền tố, trung tố, hậu tố.</li><li>Tính biểu thức tiền tố và hậu tố bằng ngăn xếp.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Trong <strong>cây có gốc có thứ tự</strong>, các con của mỗi đỉnh được sắp từ trái sang phải. Với cây gốc r và các cây con T<sub>1</sub>, …, T<sub>n</sub>:</p>
<div class="formula"><span class="lbl">Các phép duyệt</span>Tiền thứ tự: thăm r, rồi tiền thứ tự(T<sub>1</sub>), …, tiền thứ tự(T<sub>n</sub>)<br>Trung thứ tự (nhị phân): trung thứ tự(trái), thăm r, trung thứ tự(phải)<br>Hậu thứ tự: hậu thứ tự(T<sub>1</sub>), …, hậu thứ tự(T<sub>n</sub>), rồi thăm r</div>
<p>Mỗi phép duyệt thăm mỗi đỉnh một lần: O(n). Duyệt trung thứ tự trên BST liệt kê khoá theo thứ tự tăng. Hậu thứ tự là cách <code>du</code> tính dung lượng thư mục (con trước); tiền thứ tự là cách <code>ls -R</code> hay mục lục in ra (cha trước). BFS trên cây là thứ tự phổ biến thứ tư, “theo mức”.</p>
<p><strong>Cây biểu thức.</strong> Công thức với các toán tử hai ngôi là một cây nhị phân có thứ tự: toán tử ở đỉnh trong, toán hạng ở lá. Ba phép duyệt cho ba ký pháp:</p>
<ul>
<li><strong>Trung tố</strong> (trung thứ tự): x + y — cần ngoặc và quy tắc ưu tiên mới không nhập nhằng.</li>
<li><strong>Tiền tố</strong> hay ký pháp Ba Lan (tiền thứ tự): + x y — không cần ngoặc. Lisp dùng nó.</li>
<li><strong>Hậu tố</strong> hay ký pháp Ba Lan ngược (hậu thứ tự): x y + — không cần ngoặc; tính từ trái sang phải bằng ngăn xếp. Máy ảo Java, bytecode Python và nhiều máy tính bỏ túi làm theo cách này.</li>
</ul>
<p><strong>Tính biểu thức hậu tố:</strong> quét từ trái sang phải; gặp toán hạng thì đẩy vào ngăn xếp; gặp toán tử thì lấy ra hai giá trị trên cùng (lấy ra trước là toán hạng phải), thực hiện phép toán, đẩy kết quả vào. Cuối cùng ngăn xếp giữ đáp số. Tiền tố tính cùng cách nhưng quét từ phải sang trái.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — một cây, ba ký pháp.</b> Biểu thức ((x + y) ^ 2) + ((x − 4) / 3) dưới dạng cây, duyệt ba cách; rồi tính biểu thức hậu tố 7 2 3 * − 4 ^ 9 3 / + bằng ngăn xếp:</p></div>
<pre><code class="language-python">class Node:
    def __init__(self, val, left=None, right=None):
        self.val, self.left, self.right = val, left, right

def preorder(t):
    return [] if t is None else [t.val] + preorder(t.left) + preorder(t.right)
def inorder(t):
    return [] if t is None else inorder(t.left) + [t.val] + inorder(t.right)
def postorder(t):
    return [] if t is None else postorder(t.left) + postorder(t.right) + [t.val]

# expression tree for ((x + y) ^ 2) + ((x - 4) / 3)
expr = Node("+", Node("^", Node("+", Node("x"), Node("y")), Node("2")),
                 Node("/", Node("-", Node("x"), Node("4")), Node("3")))
print("prefix :", " ".join(preorder(expr)))
print("infix  :", " ".join(inorder(expr)))
print("postfix:", " ".join(postorder(expr)))

def eval_postfix(tokens):
    st = []
    ops = {"+": lambda a, b: a + b, "-": lambda a, b: a - b, "*": lambda a, b: a * b,
           "/": lambda a, b: a / b, "^": lambda a, b: a ** b}
    for t in tokens:
        if t in ops:
            b, a = st.pop(), st.pop()
            st.append(ops[t](a, b))
        else:
            st.append(float(t))
    return st[0]

print(eval_postfix("7 2 3 * - 4 ^ 9 3 / +".split()))</code></pre>
<div class="out">prefix : + ^ + x y 2 / - x 4 3
infix  : x + y ^ 2 + x - 4 / 3
postfix: x y + 2 ^ x 4 - 3 / +
4.0</div>
<p>Dòng trung tố đã mất ngoặc — chỉ duyệt trung thứ tự thì nhập nhằng, vì thế trình biên dịch giữ lại cây. Tính hậu tố: 2·3 = 6; 7 − 6 = 1; 1<sup>4</sup> = 1; 9/3 = 3; 1 + 3 = 4.</p>
<div class="callout"><p><b>Ví dụ 2 — tiền tố bằng tay.</b> Tính + − * 2 3 5 / ^ 2 3 4 (Rosen). Từ phải sang trái: 2<sup>3</sup> = 8; 8/4 = 2; 2·3 = 6; 6 − 5 = 1; 1 + 2 = 3.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Lấy toán hạng sai thứ tự với − và / (lần lấy ra đầu tiên là toán hạng <em>phải</em>).</li><li>Viết trung tố từ phép duyệt trung thứ tự mà không khôi phục ngoặc.</li><li>Nhầm tiền thứ tự với duyệt theo mức.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Tiền thứ tự: gốc trước; hậu thứ tự: gốc sau; trung thứ tự: gốc ở giữa.</li><li>Trung thứ tự của BST = khoá đã sắp.</li><li>Cây biểu thức: tiền tố và hậu tố không cần ngoặc.</li><li>Tính hậu tố bằng ngăn xếp trong O(n).</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Tree_traversal" target="_blank" rel="noopener">Wikipedia — Tree traversal</a></li><li><a href="https://en.wikipedia.org/wiki/Polish_notation" target="_blank" rel="noopener">Wikipedia — Polish notation</a></li><li><a href="https://en.wikipedia.org/wiki/Binary_tree" target="_blank" rel="noopener">Wikipedia — Binary tree</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Viết (A + B) * (C − D) ở dạng tiền tố và hậu tố.</li><li>Tính biểu thức hậu tố 5 1 2 + 4 * + 3 −.</li><li>Cho thứ tự duyệt tiền thứ tự và hậu thứ tự của BST dựng từ 50, 30, 70, 20, 40.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Tiền tố * + A B − C D; hậu tố A B + C D − *. 2) 1 + 2 = 3; 3·4 = 12; 5 + 12 = 17; 17 − 3 = 14. 3) Tiền thứ tự 50 30 20 40 70; hậu thứ tự 20 40 30 70 50.</p></div>`);

const c114 = L('mad102-ts-11-4',
  '11.4 — Spanning trees and minimum spanning trees (Prim, Kruskal)|||11.4 — Cây khung và cây khung nhỏ nhất (Prim, Kruskal)',
  'Cây khung, tồn tại cây khung, cây khung bằng BFS/DFS; cây khung nhỏ nhất: thuật toán Prim và Kruskal, tính chất lát cắt, cấu trúc union–find; Kruskal chạy thật cho bài nối cáp mạng.',
  `<span class="eyebrow">MAD102 · Chapter 11 · Lesson 11.4</span>
<h2>Spanning trees and minimum spanning trees (Prim, Kruskal)</h2>
<p class="lead">To connect offices with the least cable, link servers with the cheapest network, or cluster data points, we need a tree that touches every vertex of a weighted graph with minimum total weight. Two greedy algorithms solve this exactly — a rare case where greed is provably optimal.</p>
<h3>🎯 Objectives</h3>
<ul><li>Find spanning trees with BFS or DFS and explain why every connected graph has one.</li><li>Run Prim's and Kruskal's algorithms by hand.</li><li>Explain the cut property that makes them correct, and the role of union–find.</li></ul>
<h3>📖 Lecture</h3>
<p>A <strong>spanning tree</strong> of a connected graph G is a subgraph that is a tree and contains every vertex of G. Every connected graph has one: while there is a cycle, delete one of its edges (the graph stays connected). In practice BFS or DFS from any vertex produces one — the tree edges are those used to discover new vertices. A spanning tree of an n-vertex graph has n − 1 edges. Network protocols use them to avoid loops (the Spanning Tree Protocol in Ethernet switches).</p>
<p>In a weighted graph, a <strong>minimum spanning tree</strong> (MST) is a spanning tree with the smallest total weight.</p>
<div class="formula"><span class="lbl">Two greedy algorithms</span>Prim: start from any vertex; repeatedly add the cheapest edge joining the tree to a vertex outside it.<br>Kruskal: sort all edges by weight; repeatedly add the cheapest edge that does not create a cycle.<br>Both stop after n − 1 edges.</div>
<p><strong>Why greedy works — the cut property.</strong> For any partition of the vertices into two sets, the cheapest edge crossing the partition belongs to some MST. Prim's choice is the cheapest edge across (tree, rest); Kruskal's choice is the cheapest edge across the two components it joins. An exchange argument shows that swapping it into any MST cannot increase the weight.</p>
<p><strong>Efficiency.</strong> Prim with a binary heap runs in O(E log V). Kruskal costs O(E log E) for sorting plus nearly-linear cycle checks using the <strong>union–find</strong> (disjoint-set) structure: find(x) returns the representative of x's component, union merges two components — exactly the partitions of Lesson 4.3 maintained incrementally.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — Kruskal on a cabling problem.</b> Six offices 0–5, costs in millions of VND. Sorted edges: (0–3, 5), (2–4, 5), (3–5, 6), (0–1, 7), (1–4, 7), (1–2, 8), (4–5, 8), … Kruskal accepts 0–3, 2–4, 3–5, 0–1, 1–4 and then has 5 = n − 1 edges:</p></div>
<pre><code class="language-python">def kruskal(n, edges):
    parent = list(range(n))
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]      # path halving
            x = parent[x]
        return x
    mst, total = [], 0
    for w, u, v in sorted(edges):
        ru, rv = find(u), find(v)
        if ru != rv:                           # adding (u, v) creates no cycle
            parent[ru] = rv
            mst.append((u, v, w))
            total += w
    return mst, total

# 6 offices, cost of laying cable (in millions VND)
edges = [(7, 0, 1), (5, 0, 3), (8, 1, 2), (9, 1, 3), (7, 1, 4), (5, 2, 4),
         (15, 3, 4), (6, 3, 5), (8, 4, 5), (11, 2, 5)]
mst, total = kruskal(6, edges)
print(mst)
print("total cost:", total, "edges:", len(mst))</code></pre>
<div class="out">[(0, 3, 5), (2, 4, 5), (3, 5, 6), (0, 1, 7), (1, 4, 7)]
total cost: 30 edges: 5</div>
<p>Total cost 30 million. The edge (4–5, 8) is rejected later because 4 and 5 are already connected through 4–1–0–3–5.</p>
<div class="callout"><p><b>Example 2 — Prim by hand on the same graph.</b> Start at 0: cheapest edge out is 0–3 (5); then 3–5 (6); then 0–1 (7); then 1–4 (7); then 4–2 (5). Same total 30 — both algorithms find a minimum spanning tree.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>In Prim, choosing the globally cheapest edge instead of the cheapest edge <em>leaving the current tree</em>.</li><li>In Kruskal, adding an edge whose endpoints are already connected (it creates a cycle).</li><li>Confusing an MST with a shortest-path tree: Dijkstra minimises distances from one source, an MST minimises total weight.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Every connected graph has a spanning tree with n − 1 edges (BFS/DFS find one).</li><li>Prim grows one tree; Kruskal merges a forest; both greedy and optimal.</li><li>Correctness: the cut property.</li><li>Kruskal + union–find: O(E log E); Prim + heap: O(E log V).</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://cp-algorithms.com/graph/mst_kruskal.html" target="_blank" rel="noopener">cp-algorithms — Minimum Spanning Tree: Kruskal</a></li><li><a href="https://cp-algorithms.com/graph/mst_prim.html" target="_blank" rel="noopener">cp-algorithms — Minimum Spanning Tree: Prim</a></li><li><a href="https://visualgo.net/en/mst" target="_blank" rel="noopener">VisuAlgo — Minimum Spanning Tree (Prim, Kruskal)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>How many edges does a spanning tree of K<sub>8</sub> have? How many spanning trees does K<sub>4</sub> have?</li><li>Run Kruskal on the square a–b–c–d–a with weights ab = 1, bc = 2, cd = 3, da = 4 and diagonal ac = 1.5.</li><li>If all edge weights are distinct, is the MST unique?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 7; Cayley: 4<sup>2</sup> = 16. 2) Take ab (1), ac (1.5); skip bc (2) — cycle a–b–c; take cd (3); total 5.5. 3) Yes — with distinct weights the MST is unique.</p></div>`,
  `<span class="eyebrow">MAD102 · Chương 11 · Bài 11.4</span>
<h2>Cây khung và cây khung nhỏ nhất (Prim, Kruskal)</h2>
<p class="lead">Để nối các văn phòng bằng ít cáp nhất, nối các máy chủ bằng mạng rẻ nhất, hay phân cụm dữ liệu, ta cần một cây chạm tới mọi đỉnh của đồ thị có trọng số với tổng trọng số nhỏ nhất. Hai thuật toán tham lam giải chính xác bài này — một trường hợp hiếm hoi mà tham lam được chứng minh là tối ưu.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tìm cây khung bằng BFS hoặc DFS và giải thích vì sao đồ thị liên thông nào cũng có.</li><li>Chạy thuật toán Prim và Kruskal bằng tay.</li><li>Giải thích tính chất lát cắt làm chúng đúng, và vai trò của union–find.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Cây khung</strong> của đồ thị liên thông G là đồ thị con là cây và chứa mọi đỉnh của G. Đồ thị liên thông nào cũng có: khi còn chu trình thì xoá một cạnh của nó (đồ thị vẫn liên thông). Thực tế, BFS hoặc DFS từ một đỉnh bất kỳ cho ra một cây khung — các cạnh cây là cạnh dùng để phát hiện đỉnh mới. Cây khung của đồ thị n đỉnh có n − 1 cạnh. Giao thức mạng dùng nó để tránh vòng lặp (Spanning Tree Protocol trên switch Ethernet).</p>
<p>Trong đồ thị có trọng số, <strong>cây khung nhỏ nhất</strong> (MST) là cây khung có tổng trọng số nhỏ nhất.</p>
<div class="formula"><span class="lbl">Hai thuật toán tham lam</span>Prim: bắt đầu từ một đỉnh bất kỳ; lặp lại thêm cạnh rẻ nhất nối cây với một đỉnh ngoài cây.<br>Kruskal: sắp mọi cạnh theo trọng số; lặp lại thêm cạnh rẻ nhất không tạo chu trình.<br>Cả hai dừng sau n − 1 cạnh.</div>
<p><strong>Vì sao tham lam đúng — tính chất lát cắt.</strong> Với mọi cách chia tập đỉnh thành hai phần, cạnh rẻ nhất băng qua lát cắt thuộc một MST nào đó. Lựa chọn của Prim là cạnh rẻ nhất băng qua (cây, phần còn lại); lựa chọn của Kruskal là cạnh rẻ nhất băng qua hai thành phần nó nối. Lập luận hoán đổi cho thấy đưa cạnh đó vào một MST bất kỳ không làm tăng trọng số.</p>
<p><strong>Hiệu năng.</strong> Prim dùng đống nhị phân chạy trong O(E log V). Kruskal tốn O(E log E) để sắp xếp cộng với kiểm tra chu trình gần tuyến tính nhờ cấu trúc <strong>union–find</strong> (tập rời nhau): find(x) trả về đại diện thành phần của x, union gộp hai thành phần — chính là phân hoạch ở Bài 4.3 được duy trì dần dần.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — Kruskal cho bài đi cáp.</b> Sáu văn phòng 0–5, chi phí tính bằng triệu đồng. Các cạnh đã sắp: (0–3, 5), (2–4, 5), (3–5, 6), (0–1, 7), (1–4, 7), (1–2, 8), (4–5, 8), … Kruskal nhận 0–3, 2–4, 3–5, 0–1, 1–4 và khi đó có 5 = n − 1 cạnh:</p></div>
<pre><code class="language-python">def kruskal(n, edges):
    parent = list(range(n))
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]      # path halving
            x = parent[x]
        return x
    mst, total = [], 0
    for w, u, v in sorted(edges):
        ru, rv = find(u), find(v)
        if ru != rv:                           # adding (u, v) creates no cycle
            parent[ru] = rv
            mst.append((u, v, w))
            total += w
    return mst, total

# 6 offices, cost of laying cable (in millions VND)
edges = [(7, 0, 1), (5, 0, 3), (8, 1, 2), (9, 1, 3), (7, 1, 4), (5, 2, 4),
         (15, 3, 4), (6, 3, 5), (8, 4, 5), (11, 2, 5)]
mst, total = kruskal(6, edges)
print(mst)
print("total cost:", total, "edges:", len(mst))</code></pre>
<div class="out">[(0, 3, 5), (2, 4, 5), (3, 5, 6), (0, 1, 7), (1, 4, 7)]
total cost: 30 edges: 5</div>
<p>Tổng chi phí 30 triệu. Cạnh (4–5, 8) bị loại về sau vì 4 và 5 đã được nối qua 4–1–0–3–5.</p>
<div class="callout"><p><b>Ví dụ 2 — Prim bằng tay trên cùng đồ thị.</b> Bắt đầu từ 0: cạnh rẻ nhất đi ra là 0–3 (5); rồi 3–5 (6); rồi 0–1 (7); rồi 1–4 (7); rồi 4–2 (5). Cùng tổng 30 — cả hai thuật toán đều tìm ra cây khung nhỏ nhất.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Trong Prim, chọn cạnh rẻ nhất toàn đồ thị thay vì cạnh rẻ nhất <em>đi ra khỏi cây hiện tại</em>.</li><li>Trong Kruskal, thêm cạnh có hai đầu đã liên thông (tạo chu trình).</li><li>Nhầm MST với cây đường đi ngắn nhất: Dijkstra cực tiểu khoảng cách từ một nguồn, MST cực tiểu tổng trọng số.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Đồ thị liên thông nào cũng có cây khung n − 1 cạnh (BFS/DFS tìm được).</li><li>Prim nuôi một cây; Kruskal gộp một rừng; cả hai tham lam và tối ưu.</li><li>Tính đúng: tính chất lát cắt.</li><li>Kruskal + union–find: O(E log E); Prim + đống: O(E log V).</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://cp-algorithms.com/graph/mst_kruskal.html" target="_blank" rel="noopener">cp-algorithms — Minimum Spanning Tree: Kruskal</a></li><li><a href="https://cp-algorithms.com/graph/mst_prim.html" target="_blank" rel="noopener">cp-algorithms — Minimum Spanning Tree: Prim</a></li><li><a href="https://visualgo.net/en/mst" target="_blank" rel="noopener">VisuAlgo — Minimum Spanning Tree (Prim, Kruskal)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Cây khung của K<sub>8</sub> có bao nhiêu cạnh? K<sub>4</sub> có bao nhiêu cây khung?</li><li>Chạy Kruskal trên hình vuông a–b–c–d–a với trọng số ab = 1, bc = 2, cd = 3, da = 4 và đường chéo ac = 1,5.</li><li>Nếu mọi trọng số cạnh đôi một khác nhau, MST có duy nhất không?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 7; Cayley: 4<sup>2</sup> = 16. 2) Lấy ab (1), ac (1,5); bỏ bc (2) — chu trình a–b–c; lấy cd (3); tổng 5,5. 3) Có — trọng số đôi một khác nhau thì MST duy nhất.</p></div>`);

const q11 = QZ(11, 'Quiz — Chapter 11: Trees|||Quiz — Chương 11: Cây', 'Kiểm tra chương 11: tính chất cây, cây m-phân, BST, cây quyết định, Huffman, duyệt cây, ký pháp Ba Lan, cây khung, Prim/Kruskal.', [
  Q('q1', 'A tree with 25 vertices has how many edges?|||Cây 25 đỉnh có bao nhiêu cạnh?',
    ['25|||25', '24|||24', '26|||26', '50|||50'], 1,
    'A tree on n vertices has n − 1 edges.|||Cây n đỉnh có n − 1 cạnh.'),
  Q('q2', 'A full 4-ary tree with 100 internal vertices has how many leaves?|||Cây 4-phân đầy đủ có 100 đỉnh trong thì có bao nhiêu lá?',
    ['300|||300', '301|||301', '400|||400', '401|||401'], 1,
    'l = (m − 1)i + 1 = 3·100 + 1.|||l = (m − 1)i + 1 = 3·100 + 1.'),
  Q('q3', 'The minimum height of a binary tree with 1000 leaves is|||Chiều cao nhỏ nhất của cây nhị phân có 1000 lá là',
    ['9|||9', '10|||10', '11|||11', '500|||500'], 1,
    '⌈log₂ 1000⌉ = 10.|||⌈log₂ 1000⌉ = 10.'),
  Q('q4', 'Any comparison-based sort of n items needs in the worst case|||Mọi thuật toán sắp xếp dựa trên so sánh n phần tử cần trong trường hợp xấu nhất',
    ['Ω(n)|||Ω(n)', 'Ω(n log n)|||Ω(n log n)', 'Ω(n²)|||Ω(n²)', 'Ω(log n)|||Ω(log n)'], 1,
    'A decision tree with n! leaves has height at least log₂ n! = Θ(n log n).|||Cây quyết định có n! lá cao ít nhất log₂ n! = Θ(n log n).'),
  Q('q5', 'In Huffman’s algorithm, at each step we merge|||Trong thuật toán Huffman, mỗi bước ta gộp',
    ['the two most frequent trees|||hai cây tần suất lớn nhất', 'the two least frequent trees|||hai cây tần suất nhỏ nhất', 'any two trees|||hai cây bất kỳ', 'the first two symbols alphabetically|||hai ký hiệu đầu theo bảng chữ'], 1,
    'Rare symbols end up deepest with the longest codewords.|||Ký hiệu hiếm nằm sâu nhất với từ mã dài nhất.'),
  Q('q6', 'Inorder traversal of a binary search tree lists the keys|||Duyệt trung thứ tự cây tìm kiếm nhị phân liệt kê khoá',
    ['in insertion order|||theo thứ tự chèn', 'in increasing order|||theo thứ tự tăng', 'root first|||gốc trước', 'level by level|||theo từng mức'], 1,
    'Left subtree (smaller), root, right subtree (larger).|||Cây con trái (nhỏ hơn), gốc, cây con phải (lớn hơn).'),
  Q('q7', 'The value of the postfix expression 7 2 3 * − 4 ^ 9 3 / + is|||Giá trị biểu thức hậu tố 7 2 3 * − 4 ^ 9 3 / + là',
    ['4|||4', '7|||7', '13|||13', '28|||28'], 0,
    '7 − 6 = 1; 1⁴ = 1; 9/3 = 3; 1 + 3 = 4.|||7 − 6 = 1; 1⁴ = 1; 9/3 = 3; 1 + 3 = 4.'),
  Q('q8', 'The postfix form of (A + B) * (C − D) is|||Dạng hậu tố của (A + B) * (C − D) là',
    ['* + A B − C D|||* + A B − C D', 'A B + C D − *|||A B + C D − *', 'A + B * C − D|||A + B * C − D', 'A B C D + − *|||A B C D + − *'], 1,
    'Postorder: left subtree, right subtree, operator.|||Hậu thứ tự: cây con trái, cây con phải, toán tử.'),
  Q('q9', 'Kruskal’s algorithm rejects an edge when|||Thuật toán Kruskal loại một cạnh khi',
    ['its weight is large|||trọng số của nó lớn', 'its endpoints are already in the same component|||hai đầu mút đã cùng một thành phần', 'it touches a leaf|||nó chạm một lá', 'it is the last edge|||nó là cạnh cuối'], 1,
    'Adding it would create a cycle; union–find detects this.|||Thêm nó sẽ tạo chu trình; union–find phát hiện điều này.'),
]);

const ch11 = {
  title: 'Chapter 11 — Trees: properties, applications, traversal, spanning trees|||Chương 11 — Cây: tính chất, ứng dụng, duyệt cây, cây khung',
  description: 'Đặc trưng của cây, cây có gốc và cây m-phân, BST, cây quyết định và cận Ω(n log n), mã Huffman, duyệt cây và ký pháp Ba Lan, cây khung, Prim và Kruskal với union–find — có code Python (Rosen ch. 11 · MCS ch. 12).',
  lessons: [c111, c112, c113, c114, q11],
};

// ───────────────────────────── Xuất ─────────────────────────────
export default [muc0, ch1, ch2, ch3, ch4, ch5, ch6, ch7, ch8, ch9, ch10, ch11];
