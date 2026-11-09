// Khoá TỰ SOẠN cho QTC211 — trường chưa công bố syllabus trên FLM (dò 09/11/2026). Soạn theo _HOP-DONG-TU-SOAN.md.
// Khung bám thứ tự giáo trình chuẩn: Nielsen & Chuang "Quantum Computation and Quantum Information" (10th Anniv. Ed., CUP 2010),
// Mermin "Quantum Computer Science: An Introduction" (CUP 2007) và khoá mở IBM Quantum Learning của John Watrous
// ("Understanding Quantum Information and Computation", arXiv:2507.11536). Mức Kỳ 2: ôn đại số tuyến tính phức → qubit →
// đo → cổng → nhiều qubit & vướng víu → mạch → giao thức → thuật toán → nhiễu & sửa lỗi → phần cứng & Qiskit.
// Mọi ví dụ số / đáp án đã kiểm bằng python3 (numpy 2.5, sympy 1.14); mọi đoạn code đã CHẠY THẬT, output dán nguyên văn
// (Qiskit 2.6.2 + qiskit-aer 0.18.2 trong venv riêng). Mọi link ngoài đã mở thử (HTTP 200 + tiêu đề đúng chủ đề).
// Trang IBM Quantum (quantum.cloud.ibm.com) chặn truy cập tự động từ mạng soạn bài ⇒ KHÔNG dẫn link trực tiếp; dẫn mã nguồn
// bài học trên GitHub Qiskit/documentation và video chính chủ trên kênh YouTube Qiskit thay thế.
// Ma trận dùng <table class="matrix">. KHÔNG LaTeX. KHÔNG chuỗi nội suy (đô-la + ngoặc nhọn), không backtick lồng.

const bi = (en, vi) => '<div class="ml-en">' + en + '</div>\n<div class="ml-vi">' + vi + '</div>';
const L = (slug, title, description, en, vi) => ({ title, slug, type: 'DOCUMENT', description, content: bi(en, vi) });
const Q = (id, question, options, correctIndex, explanation) => ({ id, question, options, correctIndex, points: 1, explanation });
const QZ = (ch, title, description, questions) => ({
  title, slug: 'qtc211-ts-quiz-' + ch, type: 'QUIZ', description,
  quiz: { timeLimitSeconds: 900, questions },
});

// ───────────────────────────── Mục 0 ─────────────────────────────
const m01 = L('qtc211-ts-0-1',
  '0.1 — Welcome to QTC211: what quantum computing is and why a CS student studies it|||0.1 — Giới thiệu QTC211: điện toán lượng tử học gì, vì sao sinh viên KHMT cần học',
  'Điện toán lượng tử học gì, dùng vào đâu (mật mã, mô phỏng, tối ưu, nghiên cứu), 8 chuẩn đầu ra tự soạn, môn liên quan, cảnh báo: trường chưa công bố syllabus QTC211 trên FLM.',
  `<span class="eyebrow">QTC211 · Section 0 · Lesson 0.1</span>
<h2>Welcome to Quantum Computing</h2>
<p class="lead">A classical computer stores bits that are 0 <em>or</em> 1. A quantum computer stores <strong>qubits</strong>, whose state is a unit vector of <strong>complex numbers</strong>, and it computes by applying <strong>unitary matrices</strong> to that vector. This course teaches you that model precisely — with real linear algebra, real circuits and code you run yourself — instead of the hype version.</p>
<div class="callout"><p>⚠️ <strong>Important.</strong> FPT University has <strong>not published the QTC211 syllabus on FLM</strong> (we searched the code, its variants and the course name on 09/11/2026). This course framework is therefore <strong>self-authored</strong>, following the chapter order of the international standard textbooks (Nielsen &amp; Chuang <em>Quantum Computation and Quantum Information</em>, Mermin <em>Quantum Computer Science</em>) and IBM's free course by John Watrous. <strong>Grading weights, assessment format and exam dates are decided by your lecturer</strong> — always follow the course outline your lecturer gives in class.</p></div>
<h3>What is quantum computing about?</h3>
<p>Quantum computing is a <strong>model of computation</strong> built on the rules of quantum mechanics. For this course you need only four rules, and each one is linear algebra:</p>
<ol>
<li><strong>State:</strong> a system of n qubits is described by a unit vector with 2<sup>n</sup> complex entries (amplitudes).</li>
<li><strong>Evolution:</strong> a computation step (a <em>gate</em>) multiplies the state by a unitary matrix U (U<sup>†</sup>U = I).</li>
<li><strong>Measurement:</strong> reading the qubits gives the outcome x with probability |amplitude of x|<sup>2</sup> (the Born rule), and the state collapses.</li>
<li><strong>Composition:</strong> joining systems uses the tensor product ⊗ — which is where <strong>entanglement</strong> comes from.</li>
</ol>
<p>Everything else — Bell states, teleportation, Deutsch–Jozsa, Grover search, the quantum Fourier transform, Shor's factoring idea, error-correcting codes — is built from these four rules.</p>
<h3>Why does a Computer Science student need it?</h3>
<ul>
<li><strong>Cryptography and security:</strong> Shor's algorithm would break RSA and elliptic-curve cryptography on a large fault-tolerant quantum computer. That is why NIST published post-quantum standards (e.g. FIPS 203, 2024) and why every security engineer must understand the threat and the timeline.</li>
<li><strong>Algorithms and complexity:</strong> quantum algorithms give provable speed-ups in the query model (Deutsch–Jozsa, Bernstein–Vazirani, Simon, Grover's quadratic speed-up). Knowing <em>where</em> the speed-up comes from — and where it does not — is core algorithmic literacy.</li>
<li><strong>Simulation and research:</strong> simulating molecules and materials is the most promising application; quantum software engineering (compilers, transpilers, error-correction decoders) is a growing job market.</li>
<li><strong>Programming practice:</strong> you will write a state-vector simulator in Python/numpy and run circuits in Qiskit — good training in linear algebra, numerical computing and testing.</li>
<li><strong>Critical thinking about hype:</strong> a quantum computer does <em>not</em> “try all answers in parallel and pick the right one”. You will learn exactly why, and you will be able to judge news headlines.</li>
</ul>
<h3>Learning outcomes (self-authored)</h3>
<p>After this course you should be able to:</p>
<ol>
<li>Compute with complex numbers, complex vectors and matrices in Dirac (bra–ket) notation: inner products, adjoints, unitary and Hermitian matrices, projectors and tensor products.</li>
<li>Describe a qubit state, its global and relative phase, and locate it on the Bloch sphere.</li>
<li>Apply the Born rule to compute measurement probabilities and post-measurement states in any orthonormal basis, including partial measurement of multi-qubit states.</li>
<li>Use the standard single-qubit gates (X, Y, Z, H, S, T, rotations) and two-qubit gates (CNOT, CZ, SWAP), and verify circuit identities by matrix multiplication.</li>
<li>Recognise entangled states, prepare Bell and GHZ states, and explain the no-cloning theorem.</li>
<li>Explain and trace superdense coding, quantum teleportation and the BB84 key-distribution protocol step by step.</li>
<li>Trace the Deutsch–Jozsa, Bernstein–Vazirani and Grover algorithms; explain the quantum Fourier transform and the structure of Shor's algorithm (order finding + classical post-processing).</li>
<li>Explain noise, decoherence and the 3-qubit repetition code; compare hardware platforms; build and run circuits in a numpy simulator and in Qiskit.</li>
</ol>
<h3>Related courses at FPTU</h3>
<p>QTC211 is placed in <strong>semester 2</strong> of the Computer Science programme. The mathematics it uses is <strong>linear algebra</strong> (vectors, matrices, eigenvalues) and basic <strong>complex numbers</strong>. If you need to refresh linear algebra, the self-authored <a href="https://cuongthai.com/academy/courses/maa102-linear-algebra" target="_blank" rel="noopener">MAA102 — Linear Algebra</a> course on this site covers vectors, matrices, determinants and eigenvalues; Chapter 1 here reviews only the complex-number parts you need. Python programming (from your first-year programming course) is enough for the code. We do not claim an official prerequisite chain — check your programme's curriculum on FLM.</p>
<h3>How to study this course</h3>
<ul>
<li>Every lesson has 🎯 objectives, a 📖 lecture, ✍️ step-by-step worked examples, ⚠️ common mistakes, a 📌 summary, 🔗 further learning and 🧪 practice with answers. Each chapter ends with a quiz.</li>
<li><strong>Do the matrix calculations by hand first</strong> (2×2 and 4×4 are small), then check them with the numpy code given in the lessons. Quantum computing is learned with a pencil and a Python prompt.</li>
<li>Draw circuits in the browser simulator <a href="https://algassert.com/quirk" target="_blank" rel="noopener">Quirk</a> and compare its amplitude display with your hand calculation.</li>
</ul>`,
  `<span class="eyebrow">QTC211 · Mục 0 · Bài 0.1</span>
<h2>Chào mừng đến với Điện toán lượng tử</h2>
<p class="lead">Máy tính cổ điển lưu các bit, mỗi bit là 0 <em>hoặc</em> 1. Máy tính lượng tử lưu các <strong>qubit</strong>, trạng thái của chúng là một vectơ đơn vị gồm các <strong>số phức</strong>, và nó tính toán bằng cách nhân vectơ đó với các <strong>ma trận unita</strong>. Môn này dạy bạn mô hình đó một cách chính xác — bằng đại số tuyến tính thật, mạch thật và code bạn tự chạy — chứ không phải phiên bản “thổi phồng” trên báo.</p>
<div class="callout"><p>⚠️ <strong>Lưu ý quan trọng.</strong> Trường <strong>chưa công bố syllabus của QTC211 trên FLM</strong> (đã dò mã môn, mã biến thể và tên môn ngày 09/11/2026). Vì vậy khung môn này là <strong>khung tự soạn</strong>, bám thứ tự chương của giáo trình chuẩn quốc tế (Nielsen &amp; Chuang <em>Quantum Computation and Quantum Information</em>, Mermin <em>Quantum Computer Science</em>) và khoá miễn phí của IBM do John Watrous soạn. <strong>Cách tính điểm, hình thức đánh giá và lịch thi theo giảng viên</strong> — luôn theo đề cương giảng viên phát trên lớp.</p></div>
<h3>Điện toán lượng tử học gì?</h3>
<p>Điện toán lượng tử là một <strong>mô hình tính toán</strong> dựng trên các quy luật của cơ học lượng tử. Trong môn này bạn chỉ cần bốn quy tắc, và quy tắc nào cũng là đại số tuyến tính:</p>
<ol>
<li><strong>Trạng thái:</strong> hệ n qubit được mô tả bằng một vectơ đơn vị có 2<sup>n</sup> thành phần phức (biên độ).</li>
<li><strong>Tiến hoá:</strong> mỗi bước tính (một <em>cổng</em>) là nhân trạng thái với một ma trận unita U (U<sup>†</sup>U = I).</li>
<li><strong>Đo:</strong> đọc các qubit cho kết quả x với xác suất |biên độ của x|<sup>2</sup> (quy tắc Born), và trạng thái sụp đổ.</li>
<li><strong>Ghép hệ:</strong> ghép nhiều hệ dùng tích tensor ⊗ — đây là nguồn gốc của <strong>vướng víu (entanglement)</strong>.</li>
</ol>
<p>Mọi thứ khác — trạng thái Bell, dịch chuyển lượng tử, Deutsch–Jozsa, tìm kiếm Grover, biến đổi Fourier lượng tử, ý tưởng phân tích thừa số của Shor, mã sửa lỗi — đều dựng từ bốn quy tắc này.</p>
<h3>Sinh viên Khoa học Máy tính cần nó để làm gì?</h3>
<ul>
<li><strong>Mật mã và an toàn thông tin:</strong> thuật toán Shor sẽ phá RSA và mật mã đường cong elliptic trên một máy lượng tử lớn có sửa lỗi. Vì thế NIST đã công bố chuẩn mật mã hậu lượng tử (vd FIPS 203, năm 2024), và kỹ sư bảo mật nào cũng phải hiểu mối đe doạ lẫn mốc thời gian của nó.</li>
<li><strong>Thuật toán và độ phức tạp:</strong> thuật toán lượng tử cho tăng tốc chứng minh được trong mô hình truy vấn (Deutsch–Jozsa, Bernstein–Vazirani, Simon, tăng tốc bậc hai của Grover). Hiểu tăng tốc <em>đến từ đâu</em> — và ở đâu thì không có — là kiến thức thuật toán cốt lõi.</li>
<li><strong>Mô phỏng và nghiên cứu:</strong> mô phỏng phân tử, vật liệu là ứng dụng hứa hẹn nhất; kỹ nghệ phần mềm lượng tử (trình biên dịch, transpiler, bộ giải mã sửa lỗi) là thị trường việc làm đang lớn dần.</li>
<li><strong>Luyện lập trình:</strong> bạn sẽ tự viết trình mô phỏng vectơ trạng thái bằng Python/numpy và chạy mạch bằng Qiskit — luyện đại số tuyến tính, tính toán số và kiểm thử rất tốt.</li>
<li><strong>Tư duy phản biện trước “cơn sốt”:</strong> máy lượng tử <em>không</em> “thử mọi đáp án song song rồi chọn đáp án đúng”. Bạn sẽ hiểu chính xác vì sao, và tự đánh giá được các tít báo.</li>
</ul>
<h3>Chuẩn đầu ra (tự soạn)</h3>
<p>Học xong môn, bạn cần làm được:</p>
<ol>
<li>Tính toán với số phức, vectơ và ma trận phức bằng ký hiệu Dirac (bra–ket): tích trong, ma trận liên hợp chuyển vị, ma trận unita và Hermite, phép chiếu, tích tensor.</li>
<li>Mô tả trạng thái một qubit, pha toàn cục và pha tương đối, và đặt được nó lên mặt cầu Bloch.</li>
<li>Dùng quy tắc Born tính xác suất đo và trạng thái sau đo trong mọi cơ sở trực chuẩn, kể cả đo một phần trạng thái nhiều qubit.</li>
<li>Dùng các cổng một qubit chuẩn (X, Y, Z, H, S, T, cổng quay) và hai qubit (CNOT, CZ, SWAP), kiểm tra đẳng thức mạch bằng nhân ma trận.</li>
<li>Nhận ra trạng thái vướng víu, tạo trạng thái Bell và GHZ, giải thích định lý không nhân bản (no-cloning).</li>
<li>Giải thích và lần từng bước mã hoá siêu đặc, dịch chuyển lượng tử và giao thức phân phối khoá BB84.</li>
<li>Lần từng bước thuật toán Deutsch–Jozsa, Bernstein–Vazirani và Grover; giải thích biến đổi Fourier lượng tử và cấu trúc thuật toán Shor (tìm cấp + hậu xử lý cổ điển).</li>
<li>Giải thích nhiễu, mất kết hợp và mã lặp 3 qubit; so sánh các nền tảng phần cứng; dựng và chạy mạch bằng trình mô phỏng numpy và bằng Qiskit.</li>
</ol>
<h3>Môn liên quan trong khung FPTU</h3>
<p>QTC211 nằm ở <strong>kỳ 2</strong> của ngành Khoa học Máy tính. Toán dùng trong môn là <strong>đại số tuyến tính</strong> (vectơ, ma trận, trị riêng) và <strong>số phức</strong> cơ bản. Cần ôn đại số tuyến tính thì khoá tự soạn <a href="https://cuongthai.com/academy/courses/maa102-linear-algebra" target="_blank" rel="noopener">MAA102 — Đại số tuyến tính</a> trên trang này có đủ vectơ, ma trận, định thức, trị riêng; Chương 1 ở đây chỉ ôn phần số phức bạn cần. Lập trình Python (từ môn lập trình năm nhất) là đủ để chạy code. Khoá này không khẳng định chuỗi môn tiên quyết chính thức — hãy xem khung chương trình của ngành trên FLM.</p>
<h3>Học môn này thế nào cho hiệu quả</h3>
<ul>
<li>Mỗi bài có 🎯 mục tiêu, 📖 bài giảng, ✍️ ví dụ giải từng bước, ⚠️ lỗi hay gặp, 📌 tóm tắt, 🔗 học thêm và 🧪 tự luyện có đáp án. Cuối mỗi chương có quiz.</li>
<li><strong>Tính ma trận bằng tay trước</strong> (2×2 và 4×4 đều nhỏ), rồi mới kiểm lại bằng code numpy trong bài. Điện toán lượng tử học bằng cây bút và dấu nhắc Python.</li>
<li>Vẽ mạch trên trình mô phỏng trình duyệt <a href="https://algassert.com/quirk" target="_blank" rel="noopener">Quirk</a> và so phần hiển thị biên độ của nó với kết quả tính tay.</li>
</ul>`);

const m02 = L('qtc211-ts-0-2',
  '0.2 — Textbooks & learning resources (verified)|||0.2 — Giáo trình & tài liệu học (đã kiểm)',
  'Ba giáo trình chuẩn kèm ISBN đã kiểm (Nielsen & Chuang, Mermin, Bernhardt), sách mở miễn phí của Watrous (arXiv) + video IBM/Qiskit, MIT OCW 18.435J, quantum.country, công cụ Quirk/Qiskit/numpy.',
  `<span class="eyebrow">QTC211 · Section 0 · Lesson 0.2</span>
<h2>Textbooks &amp; learning resources</h2>
<p class="lead">This course follows the chapter order of the standard textbooks below. You do <strong>not</strong> need to buy anything: John Watrous's complete course text is free on arXiv, with matching lecture videos on the official Qiskit YouTube channel, and every lesson links to the matching section.</p>
<h3>📘 Main textbooks</h3>
<ol>
<li><strong>Michael A. Nielsen, Isaac L. Chuang — <em>Quantum Computation and Quantum Information</em>, 10th Anniversary Edition.</strong> Cambridge University Press, 2010. Hardback ISBN 978-1-107-00217-3; digital ISBN 978-0-511-97666-7. <a href="https://www.cambridge.org/highereducation/books/quantum-computation-and-quantum-information/01E10196D0A682A6AEFFEA52D53BE9AE" target="_blank" rel="noopener">Publisher page</a>. The standard reference (“Mike &amp; Ike”). We use Chapter 1 (overview), Chapter 2 (linear algebra, postulates), Chapter 4 (circuits), Chapters 5–6 (QFT, Shor, Grover) and Chapter 10 (error correction). It is graduate-level: read it <em>after</em> each lesson, not before.</li>
<li><strong>N. David Mermin — <em>Quantum Computer Science: An Introduction</em>.</strong> Cambridge University Press, 2007. Hardback ISBN 978-0-521-87658-2. Written at Cornell for computer scientists with no physics background; its Chapters 1–2 (cbits and qubits, Deutsch, Bernstein–Vazirani, Simon) and 3–5 (Shor, Grover, error correction) match this course closely.</li>
<li><strong>Chris Bernhardt — <em>Quantum Computing for Everyone</em>.</strong> MIT Press, 2019. Hardcover ISBN 978-0-262-03925-3 (paperback 2020: ISBN 978-0-262-53953-1). A gentle, short book that uses only vectors and matrices — the easiest first read for semester-2 students.</li>
</ol>
<h3>📗 Free course text + videos (recommended main companion)</h3>
<ul>
<li><a href="https://arxiv.org/abs/2507.11536" target="_blank" rel="noopener">John Watrous — <em>Understanding Quantum Information and Computation</em> (arXiv:2507.11536)</a>: the full text of IBM Quantum's free 16-lesson course, from single systems to fault tolerance. Lessons 1–8 cover almost all of QTC211.</li>
<li>Lecture videos on the official Qiskit channel: <a href="https://www.youtube.com/watch?v=3-c4xJa7Flk" target="_blank" rel="noopener">Lesson 01 — Single Systems</a>, <a href="https://www.youtube.com/watch?v=DfZZS8Spe7U" target="_blank" rel="noopener">Lesson 02 — Multiple Systems</a>, <a href="https://www.youtube.com/watch?v=30U2DTfIrOU" target="_blank" rel="noopener">Lesson 03 — Quantum Circuits</a>, <a href="https://www.youtube.com/watch?v=GSsElSQgMbU" target="_blank" rel="noopener">Lesson 04 — Entanglement in Action</a>. Later lessons are linked from the chapters that use them.</li>
<li><a href="https://github.com/Qiskit/documentation" target="_blank" rel="noopener">Qiskit/documentation on GitHub</a>: the source notebooks of the same IBM Quantum Learning courses (readable directly on GitHub). The course website itself is <em>IBM Quantum Platform → Learning</em>; it may block some networks, so we link the GitHub sources.</li>
</ul>
<h3>🎓 Open courses &amp; notes</h3>
<ul>
<li><a href="https://ocw.mit.edu/courses/18-435j-quantum-computation-fall-2003/" target="_blank" rel="noopener">MIT OpenCourseWare 18.435J — Quantum Computation (Peter Shor)</a>: lecture notes and problem sets from the inventor of the factoring algorithm.</li>
<li><a href="https://quantum.country/qcvc" target="_blank" rel="noopener">Andy Matuschak &amp; Michael Nielsen — <em>Quantum computing for the very curious</em></a>: an interactive essay with built-in spaced-repetition questions.</li>
<li><a href="https://www.scottaaronson.com/qclec.pdf" target="_blank" rel="noopener">Scott Aaronson — Introduction to Quantum Information Science, lecture notes (PDF)</a>: a computer scientist's view, very good on “what quantum computers cannot do”.</li>
<li><a href="https://www.cs.cmu.edu/~odonnell/quantum15/" target="_blank" rel="noopener">Ryan O'Donnell — CMU 15-859BB Quantum Computation and Information</a>: lecture videos and notes.</li>
<li><a href="https://learn.microsoft.com/en-us/azure/quantum/concepts-overview" target="_blank" rel="noopener">Microsoft Learn — Azure Quantum concepts</a>: short, clear pages on qubits, Dirac notation, measurement and circuits.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://algassert.com/quirk" target="_blank" rel="noopener">Quirk</a> — drag-and-drop circuit simulator in the browser; shows amplitudes, Bloch spheres and probabilities live.</li>
<li><a href="https://github.com/Qiskit/qiskit" target="_blank" rel="noopener">Qiskit</a> (IBM, open source, Python) and <a href="https://github.com/Qiskit/qiskit-aer" target="_blank" rel="noopener">Qiskit Aer</a> (fast local simulator). Install with <code>pip install qiskit qiskit-aer</code>; the code in Chapter 10 was run with Qiskit 2.6.2 and Aer 0.18.2.</li>
<li><a href="https://quantumai.google/cirq" target="_blank" rel="noopener">Cirq</a> (Google Quantum AI) — an alternative Python framework.</li>
<li>Python + numpy: every lesson's numeric example can be checked with a few lines of numpy; Chapter 6 builds a complete state-vector simulator.</li>
</ul>
<div class="meo"><p><strong>Study plan.</strong> For each lesson: read the lesson here → watch/read the matching Watrous lesson section → do the 🧪 practice on paper → check with numpy or Quirk → take the chapter quiz. About 5–7 hours per chapter.</p></div>`,
  `<span class="eyebrow">QTC211 · Mục 0 · Bài 0.2</span>
<h2>Giáo trình &amp; tài liệu học</h2>
<p class="lead">Khoá này bám thứ tự chương của các giáo trình chuẩn dưới đây. Bạn <strong>không</strong> cần mua sách: toàn văn khoá học của John Watrous có miễn phí trên arXiv, kèm video bài giảng trên kênh YouTube chính chủ của Qiskit, và mỗi bài đều dẫn tới đúng phần tương ứng.</p>
<h3>📘 Giáo trình chính</h3>
<ol>
<li><strong>Michael A. Nielsen, Isaac L. Chuang — <em>Quantum Computation and Quantum Information</em>, bản kỷ niệm 10 năm (10th Anniversary Edition).</strong> Cambridge University Press, 2010. ISBN bìa cứng 978-1-107-00217-3; ISBN bản số 978-0-511-97666-7. <a href="https://www.cambridge.org/highereducation/books/quantum-computation-and-quantum-information/01E10196D0A682A6AEFFEA52D53BE9AE" target="_blank" rel="noopener">Trang nhà xuất bản</a>. Sách tham khảo chuẩn (“Mike &amp; Ike”). Khoá dùng Chương 1 (tổng quan), Chương 2 (đại số tuyến tính, các tiên đề), Chương 4 (mạch), Chương 5–6 (QFT, Shor, Grover) và Chương 10 (sửa lỗi). Sách ở mức cao học: đọc <em>sau</em> mỗi bài, đừng đọc trước.</li>
<li><strong>N. David Mermin — <em>Quantum Computer Science: An Introduction</em>.</strong> Cambridge University Press, 2007. ISBN bìa cứng 978-0-521-87658-2. Viết ở Cornell cho dân khoa học máy tính chưa học vật lý; Chương 1–2 (cbit và qubit, Deutsch, Bernstein–Vazirani, Simon) và 3–5 (Shor, Grover, sửa lỗi) rất khớp với môn này.</li>
<li><strong>Chris Bernhardt — <em>Quantum Computing for Everyone</em>.</strong> MIT Press, 2019. ISBN bìa cứng 978-0-262-03925-3 (bìa mềm 2020: ISBN 978-0-262-53953-1). Sách mỏng, nhẹ nhàng, chỉ dùng vectơ và ma trận — dễ đọc nhất cho sinh viên kỳ 2.</li>
</ol>
<h3>📗 Sách mở + video miễn phí (bạn đồng hành chính, nên dùng)</h3>
<ul>
<li><a href="https://arxiv.org/abs/2507.11536" target="_blank" rel="noopener">John Watrous — <em>Understanding Quantum Information and Computation</em> (arXiv:2507.11536)</a>: toàn văn khoá 16 bài miễn phí của IBM Quantum, từ hệ một qubit tới chịu lỗi. Bài 1–8 phủ gần hết QTC211.</li>
<li>Video bài giảng trên kênh Qiskit chính chủ: <a href="https://www.youtube.com/watch?v=3-c4xJa7Flk" target="_blank" rel="noopener">Lesson 01 — Hệ đơn</a>, <a href="https://www.youtube.com/watch?v=DfZZS8Spe7U" target="_blank" rel="noopener">Lesson 02 — Hệ nhiều thành phần</a>, <a href="https://www.youtube.com/watch?v=30U2DTfIrOU" target="_blank" rel="noopener">Lesson 03 — Mạch lượng tử</a>, <a href="https://www.youtube.com/watch?v=GSsElSQgMbU" target="_blank" rel="noopener">Lesson 04 — Vướng víu trong thực tế</a>. Các bài sau được dẫn ở chương dùng tới chúng.</li>
<li><a href="https://github.com/Qiskit/documentation" target="_blank" rel="noopener">Qiskit/documentation trên GitHub</a>: notebook gốc của chính các khoá IBM Quantum Learning (đọc thẳng trên GitHub). Trang khoá học chính thức là <em>IBM Quantum Platform → Learning</em>; trang này có thể chặn một số mạng, nên khoá dẫn link mã nguồn trên GitHub.</li>
</ul>
<h3>🎓 Khoá học mở &amp; ghi chú</h3>
<ul>
<li><a href="https://ocw.mit.edu/courses/18-435j-quantum-computation-fall-2003/" target="_blank" rel="noopener">MIT OpenCourseWare 18.435J — Quantum Computation (Peter Shor)</a>: ghi chú bài giảng và bài tập của chính người phát minh thuật toán phân tích thừa số.</li>
<li><a href="https://quantum.country/qcvc" target="_blank" rel="noopener">Andy Matuschak &amp; Michael Nielsen — <em>Quantum computing for the very curious</em></a>: bài luận tương tác, có sẵn câu hỏi ôn tập ngắt quãng.</li>
<li><a href="https://www.scottaaronson.com/qclec.pdf" target="_blank" rel="noopener">Scott Aaronson — ghi chú bài giảng Introduction to Quantum Information Science (PDF)</a>: góc nhìn của nhà khoa học máy tính, rất hay về “máy lượng tử KHÔNG làm được gì”.</li>
<li><a href="https://www.cs.cmu.edu/~odonnell/quantum15/" target="_blank" rel="noopener">Ryan O'Donnell — CMU 15-859BB Quantum Computation and Information</a>: video và ghi chú bài giảng.</li>
<li><a href="https://learn.microsoft.com/en-us/azure/quantum/concepts-overview" target="_blank" rel="noopener">Microsoft Learn — các khái niệm Azure Quantum</a>: trang ngắn, rõ về qubit, ký hiệu Dirac, phép đo và mạch.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://algassert.com/quirk" target="_blank" rel="noopener">Quirk</a> — mô phỏng mạch kéo-thả trên trình duyệt; hiện biên độ, mặt cầu Bloch và xác suất trực tiếp.</li>
<li><a href="https://github.com/Qiskit/qiskit" target="_blank" rel="noopener">Qiskit</a> (IBM, mã nguồn mở, Python) và <a href="https://github.com/Qiskit/qiskit-aer" target="_blank" rel="noopener">Qiskit Aer</a> (trình mô phỏng cục bộ nhanh). Cài bằng <code>pip install qiskit qiskit-aer</code>; code ở Chương 10 đã chạy với Qiskit 2.6.2 và Aer 0.18.2.</li>
<li><a href="https://quantumai.google/cirq" target="_blank" rel="noopener">Cirq</a> (Google Quantum AI) — một framework Python khác.</li>
<li>Python + numpy: ví dụ số của mọi bài đều kiểm được bằng vài dòng numpy; Chương 6 dựng hẳn một trình mô phỏng vectơ trạng thái.</li>
</ul>
<div class="meo"><p><strong>Kế hoạch học.</strong> Mỗi bài: đọc bài ở đây → xem/đọc phần tương ứng của Watrous → làm 🧪 tự luyện ra giấy → kiểm bằng numpy hoặc Quirk → làm quiz chương. Khoảng 5–7 giờ mỗi chương.</p></div>`);

const muc0 = {
  title: 'Section 0 — Course framework (self-authored, no FLM syllabus)|||Mục 0 — Khung môn học (tự soạn, trường chưa công bố syllabus)',
  description: 'Giới thiệu môn, chuẩn đầu ra tự soạn, giáo trình chuẩn kèm ISBN và tài liệu mở. Trường chưa công bố syllabus QTC211 trên FLM — điểm/lịch thi theo giảng viên.',
  lessons: [m01, m02],
};

// ───────────────────────────── Chương 1 — Đại số tuyến tính phức & ký hiệu Dirac ─────────────────────────────
const c11 = L('qtc211-ts-1-1',
  '1.1 — Complex numbers: arithmetic, modulus, polar form and Euler’s formula|||1.1 — Số phức: phép tính, mô-đun, dạng cực và công thức Euler',
  'Ôn số phức cho điện toán lượng tử: cộng/nhân/chia, liên hợp, mô-đun, dạng cực, công thức Euler e^(iθ), vì sao |e^(iθ)| = 1 quan trọng với pha.',
  `<span class="eyebrow">QTC211 · Chapter 1 · Lesson 1.1</span>
<h2>Complex numbers: arithmetic, modulus, polar form and Euler's formula</h2>
<p class="lead">Quantum amplitudes are complex numbers. You will multiply, conjugate and take moduli of complex numbers in every single lesson, so this lesson makes those operations automatic.</p>
<h3>🎯 Objectives</h3>
<ul><li>Add, multiply and divide complex numbers in the form a + bi.</li><li>Compute the conjugate z* and the modulus |z|, and use |z|<sup>2</sup> = z z*.</li><li>Convert between the Cartesian form and the polar form r e<sup>iθ</sup>.</li><li>Explain why multiplying by e<sup>iθ</sup> changes a phase but not a modulus.</li></ul>
<h3>📖 Lecture</h3>
<p>A <strong>complex number</strong> is z = a + bi with real a (real part) and b (imaginary part) and i<sup>2</sup> = −1. Arithmetic follows ordinary algebra plus that one rule: (a + bi)(c + di) = (ac − bd) + (ad + bc)i.</p>
<p>The <strong>complex conjugate</strong> flips the sign of the imaginary part: z* = a − bi (physicists write z*, mathematicians often write z̄). The <strong>modulus</strong> is the length of the point (a, b) in the plane:</p>
<div class="formula"><span class="lbl">Modulus</span>|z| = √(a<sup>2</sup> + b<sup>2</sup>)    and    |z|<sup>2</sup> = z · z*</div>
<p>The identity |z|<sup>2</sup> = z z* is the one you will use most: in quantum computing a probability is always |amplitude|<sup>2</sup>. To divide, multiply top and bottom by the conjugate of the denominator: 1/(1 + i) = (1 − i)/((1 + i)(1 − i)) = (1 − i)/2.</p>
<p>Every non-zero complex number can also be written in <strong>polar form</strong> using its modulus r = |z| and its <strong>argument</strong> (angle) θ:</p>
<div class="formula"><span class="lbl">Euler's formula</span>e<sup>iθ</sup> = cos θ + i sin θ    so    z = r e<sup>iθ</sup> = r(cos θ + i sin θ)</div>
<p>Polar form makes multiplication easy: <strong>moduli multiply and angles add</strong>, r<sub>1</sub>e<sup>iθ<sub>1</sub></sup> · r<sub>2</sub>e<sup>iθ<sub>2</sub></sup> = r<sub>1</sub>r<sub>2</sub> e<sup>i(θ<sub>1</sub> + θ<sub>2</sub>)</sup>. Special values to memorise: e<sup>i0</sup> = 1, e<sup>iπ/2</sup> = i, e<sup>iπ</sup> = −1, e<sup>i3π/2</sup> = −i, and in general |e<sup>iθ</sup>| = 1.</p>
<p><strong>Why this matters for qubits.</strong> A number of the form e<sup>iθ</sup> is called a <strong>phase</strong>. Multiplying an amplitude by a phase rotates it in the complex plane without changing its modulus, hence without changing the probability |amplitude|<sup>2</sup>. Yet phases are what make quantum interference possible: two amplitudes 1/2 and −1/2 have the same modulus but cancel when added. The whole power of quantum algorithms is the art of arranging phases so that wrong answers cancel.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — product and modulus.</b> Let z = 3 + 4i and w = 1 − 2i.</p>
<p>Step 1: z w = 3 − 6i + 4i − 8i<sup>2</sup> = 3 + 8 − 2i = <b>11 − 2i</b>. Step 2: |z| = √(9 + 16) = <b>5</b>; check: z z* = (3 + 4i)(3 − 4i) = 9 + 16 = 25 = |z|<sup>2</sup>. Step 3: z / w = z w* / |w|<sup>2</sup> = (3 + 4i)(1 + 2i)/5 = (3 − 8 + 10i)/5 = <b>−1 + 2i</b>.</p></div>
<div class="callout"><p><b>Example 2 — polar form.</b> Write 1 + i in polar form and compute (1 + i)<sup>8</sup>.</p>
<p>r = √(1 + 1) = √2, θ = π/4 (the point (1, 1) is at 45°). So 1 + i = √2 e<sup>iπ/4</sup>. Then (1 + i)<sup>8</sup> = (√2)<sup>8</sup> e<sup>i8π/4</sup> = 16 e<sup>i2π</sup> = <b>16</b>. Doing this by repeated multiplication would take seven products.</p></div>
<div class="callout"><p><b>Example 3 — powers of i.</b> i<sup>2026</sup>: since i<sup>4</sup> = 1 and 2026 = 4 · 506 + 2, i<sup>2026</sup> = i<sup>2</sup> = <b>−1</b>. In polar form: i = e<sup>iπ/2</sup>, so i<sup>2026</sup> = e<sup>i1013π</sup> = e<sup>iπ</sup> = −1.</p></div>
<p>Checking with Python (complex literals use <code>j</code>):</p>
<pre><code class="language-python">import cmath, math
z, w = 3 + 4j, 1 - 2j
print(z * w, abs(z), z / w)
print(cmath.polar(1 + 1j), math.sqrt(2), math.pi / 4)
print((1 + 1j) ** 8)</code></pre>
<div class="out">(11-2j) 5.0 (-1+2j)
(1.4142135623730951, 0.7853981633974483) 1.4142135623730951 0.7853981633974483
(16+0j)</div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Writing |a + bi| = a + b or |a + bi|<sup>2</sup> = a<sup>2</sup> − b<sup>2</sup>. The modulus squared is a<sup>2</sup> + b<sup>2</sup>, always real and ≥ 0.</li><li>Computing |z|<sup>2</sup> as z<sup>2</sup>. For z = i, z<sup>2</sup> = −1 but |z|<sup>2</sup> = 1. You must multiply by the <em>conjugate</em>.</li><li>Thinking that −1 and 1 “are the same because the probability is the same”. They are different amplitudes; they only give the same probability when they stand alone.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>z = a + bi, z* = a − bi, |z|<sup>2</sup> = a<sup>2</sup> + b<sup>2</sup> = z z*.</li><li>Divide by multiplying with the conjugate of the denominator.</li><li>Polar form z = r e<sup>iθ</sup>; multiply → moduli multiply, angles add.</li><li>e<sup>iθ</sup> is a phase: |e<sup>iθ</sup>| = 1, so it never changes a probability on its own, but it controls interference.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/precalculus-2e/pages/8-5-polar-form-of-complex-numbers" target="_blank" rel="noopener">OpenStax Precalculus 2e — 8.5 Polar Form of Complex Numbers</a></li><li><a href="https://en.wikipedia.org/wiki/Euler%27s_formula" target="_blank" rel="noopener">Wikipedia — Euler's formula</a></li><li><a href="https://www.youtube.com/watch?v=3-c4xJa7Flk" target="_blank" rel="noopener">Qiskit — Understanding Quantum Information &amp; Computation, Lesson 01 (Watrous)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Compute (2 − i)(2 + i) and |2 − i|.</li><li>Write −2i in polar form, then compute (−2i)<sup>3</sup>.</li><li>Show that |e<sup>iθ</sup> z| = |z| for every real θ.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 4 − i<sup>2</sup> = 5, and |2 − i| = √5 (so the product is |2 − i|<sup>2</sup>, as it must be). 2) −2i = 2 e<sup>−iπ/2</sup> (or 2 e<sup>i3π/2</sup>); cube: 8 e<sup>−i3π/2</sup> = 8i. Check: (−2i)<sup>3</sup> = −8 i<sup>3</sup> = −8(−i) = 8i. 3) |e<sup>iθ</sup> z| = |e<sup>iθ</sup>| |z| = 1 · |z|.</p></div>`,
  `<span class="eyebrow">QTC211 · Chương 1 · Bài 1.1</span>
<h2>Số phức: phép tính, mô-đun, dạng cực và công thức Euler</h2>
<p class="lead">Biên độ lượng tử là số phức. Bài nào bạn cũng sẽ nhân, lấy liên hợp và lấy mô-đun số phức, nên bài này giúp các phép đó trở thành phản xạ.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Cộng, nhân, chia số phức dạng a + bi.</li><li>Tính số phức liên hợp z* và mô-đun |z|, dùng được |z|<sup>2</sup> = z z*.</li><li>Đổi qua lại giữa dạng đại số và dạng cực r e<sup>iθ</sup>.</li><li>Giải thích vì sao nhân với e<sup>iθ</sup> đổi pha mà không đổi mô-đun.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Số phức</strong> là z = a + bi với a thực (phần thực), b thực (phần ảo) và i<sup>2</sup> = −1. Phép tính theo đại số thông thường cộng thêm đúng một quy tắc đó: (a + bi)(c + di) = (ac − bd) + (ad + bc)i.</p>
<p><strong>Số phức liên hợp</strong> đổi dấu phần ảo: z* = a − bi (nhà vật lý viết z*, nhà toán học hay viết z̄). <strong>Mô-đun</strong> là độ dài của điểm (a, b) trên mặt phẳng:</p>
<div class="formula"><span class="lbl">Mô-đun</span>|z| = √(a<sup>2</sup> + b<sup>2</sup>)    và    |z|<sup>2</sup> = z · z*</div>
<p>Đẳng thức |z|<sup>2</sup> = z z* là thứ bạn dùng nhiều nhất: trong điện toán lượng tử, xác suất luôn là |biên độ|<sup>2</sup>. Muốn chia, nhân cả tử và mẫu với liên hợp của mẫu: 1/(1 + i) = (1 − i)/((1 + i)(1 − i)) = (1 − i)/2.</p>
<p>Mọi số phức khác 0 còn viết được ở <strong>dạng cực</strong> bằng mô-đun r = |z| và <strong>argument</strong> (góc) θ:</p>
<div class="formula"><span class="lbl">Công thức Euler</span>e<sup>iθ</sup> = cos θ + i sin θ    nên    z = r e<sup>iθ</sup> = r(cos θ + i sin θ)</div>
<p>Dạng cực làm phép nhân rất dễ: <strong>mô-đun nhân nhau, góc cộng nhau</strong>, r<sub>1</sub>e<sup>iθ<sub>1</sub></sup> · r<sub>2</sub>e<sup>iθ<sub>2</sub></sup> = r<sub>1</sub>r<sub>2</sub> e<sup>i(θ<sub>1</sub> + θ<sub>2</sub>)</sup>. Các giá trị cần thuộc: e<sup>i0</sup> = 1, e<sup>iπ/2</sup> = i, e<sup>iπ</sup> = −1, e<sup>i3π/2</sup> = −i, và tổng quát |e<sup>iθ</sup>| = 1.</p>
<p><strong>Vì sao điều này quan trọng với qubit.</strong> Số dạng e<sup>iθ</sup> gọi là một <strong>pha</strong>. Nhân biên độ với một pha là xoay nó trên mặt phẳng phức mà không đổi mô-đun, nên không đổi xác suất |biên độ|<sup>2</sup>. Nhưng chính pha tạo ra giao thoa lượng tử: hai biên độ 1/2 và −1/2 có cùng mô-đun nhưng cộng lại thì triệt tiêu. Toàn bộ sức mạnh của thuật toán lượng tử là nghệ thuật sắp xếp pha để các đáp án sai triệt tiêu nhau.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — tích và mô-đun.</b> Cho z = 3 + 4i và w = 1 − 2i.</p>
<p>Bước 1: z w = 3 − 6i + 4i − 8i<sup>2</sup> = 3 + 8 − 2i = <b>11 − 2i</b>. Bước 2: |z| = √(9 + 16) = <b>5</b>; kiểm: z z* = (3 + 4i)(3 − 4i) = 9 + 16 = 25 = |z|<sup>2</sup>. Bước 3: z / w = z w* / |w|<sup>2</sup> = (3 + 4i)(1 + 2i)/5 = (3 − 8 + 10i)/5 = <b>−1 + 2i</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2 — dạng cực.</b> Viết 1 + i ở dạng cực rồi tính (1 + i)<sup>8</sup>.</p>
<p>r = √(1 + 1) = √2, θ = π/4 (điểm (1, 1) nằm ở góc 45°). Vậy 1 + i = √2 e<sup>iπ/4</sup>. Khi đó (1 + i)<sup>8</sup> = (√2)<sup>8</sup> e<sup>i8π/4</sup> = 16 e<sup>i2π</sup> = <b>16</b>. Nhân liên tiếp thì phải làm bảy phép nhân.</p></div>
<div class="callout"><p><b>Ví dụ 3 — luỹ thừa của i.</b> i<sup>2026</sup>: vì i<sup>4</sup> = 1 và 2026 = 4 · 506 + 2 nên i<sup>2026</sup> = i<sup>2</sup> = <b>−1</b>. Theo dạng cực: i = e<sup>iπ/2</sup>, nên i<sup>2026</sup> = e<sup>i1013π</sup> = e<sup>iπ</sup> = −1.</p></div>
<p>Kiểm bằng Python (số phức viết bằng <code>j</code>):</p>
<pre><code class="language-python">import cmath, math
z, w = 3 + 4j, 1 - 2j
print(z * w, abs(z), z / w)
print(cmath.polar(1 + 1j), math.sqrt(2), math.pi / 4)
print((1 + 1j) ** 8)</code></pre>
<div class="out">(11-2j) 5.0 (-1+2j)
(1.4142135623730951, 0.7853981633974483) 1.4142135623730951 0.7853981633974483
(16+0j)</div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Viết |a + bi| = a + b hoặc |a + bi|<sup>2</sup> = a<sup>2</sup> − b<sup>2</sup>. Bình phương mô-đun là a<sup>2</sup> + b<sup>2</sup>, luôn thực và ≥ 0.</li><li>Tính |z|<sup>2</sup> thành z<sup>2</sup>. Với z = i thì z<sup>2</sup> = −1 nhưng |z|<sup>2</sup> = 1. Phải nhân với <em>liên hợp</em>.</li><li>Nghĩ rằng −1 và 1 “như nhau vì xác suất như nhau”. Đó là hai biên độ khác nhau; chúng chỉ cho cùng xác suất khi đứng một mình.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>z = a + bi, z* = a − bi, |z|<sup>2</sup> = a<sup>2</sup> + b<sup>2</sup> = z z*.</li><li>Chia bằng cách nhân với liên hợp của mẫu.</li><li>Dạng cực z = r e<sup>iθ</sup>; nhân → mô-đun nhân, góc cộng.</li><li>e<sup>iθ</sup> là một pha: |e<sup>iθ</sup>| = 1 nên tự nó không đổi xác suất, nhưng nó điều khiển giao thoa.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/precalculus-2e/pages/8-5-polar-form-of-complex-numbers" target="_blank" rel="noopener">OpenStax Precalculus 2e — 8.5 Dạng cực của số phức</a></li><li><a href="https://en.wikipedia.org/wiki/Euler%27s_formula" target="_blank" rel="noopener">Wikipedia — Công thức Euler</a></li><li><a href="https://www.youtube.com/watch?v=3-c4xJa7Flk" target="_blank" rel="noopener">Qiskit — Understanding Quantum Information &amp; Computation, Lesson 01 (Watrous)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tính (2 − i)(2 + i) và |2 − i|.</li><li>Viết −2i ở dạng cực, rồi tính (−2i)<sup>3</sup>.</li><li>Chứng minh |e<sup>iθ</sup> z| = |z| với mọi θ thực.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 4 − i<sup>2</sup> = 5, và |2 − i| = √5 (nên tích đúng bằng |2 − i|<sup>2</sup>). 2) −2i = 2 e<sup>−iπ/2</sup> (hoặc 2 e<sup>i3π/2</sup>); lập phương: 8 e<sup>−i3π/2</sup> = 8i. Kiểm: (−2i)<sup>3</sup> = −8 i<sup>3</sup> = −8(−i) = 8i. 3) |e<sup>iθ</sup> z| = |e<sup>iθ</sup>| |z| = 1 · |z|.</p></div>`);

const c12 = L('qtc211-ts-1-2',
  '1.2 — Complex vectors and Dirac notation: kets, bras, inner products|||1.2 — Vectơ phức và ký hiệu Dirac: ket, bra, tích trong',
  'Vectơ trong ℂ², ket |ψ⟩ và bra ⟨ψ|, tích trong ⟨φ|ψ⟩ có liên hợp, chuẩn hoá, cơ sở trực chuẩn {|0⟩,|1⟩} và {|+⟩,|−⟩}, khai triển theo cơ sở.',
  `<span class="eyebrow">QTC211 · Chapter 1 · Lesson 1.2</span>
<h2>Complex vectors and Dirac notation: kets, bras, inner products</h2>
<p class="lead">A qubit state is a vector in ℂ<sup>2</sup>. Physicists write vectors with Paul Dirac's bra–ket notation, and every quantum computing text uses it. Learn to read it fluently and the rest of the course becomes ordinary linear algebra.</p>
<h3>🎯 Objectives</h3>
<ul><li>Read and write kets |ψ⟩, bras ⟨ψ| and inner products ⟨φ|ψ⟩.</li><li>Compute an inner product of complex vectors <em>with</em> the conjugate, and the norm ‖ψ‖.</li><li>Normalise a vector and test orthonormality.</li><li>Expand a vector in an orthonormal basis using coefficients ⟨b<sub>k</sub>|ψ⟩.</li></ul>
<h3>📖 Lecture</h3>
<p>A <strong>ket</strong> |ψ⟩ is just a column vector; the label inside is a name. The two most important kets are the <strong>computational basis</strong> vectors:</p>
<div class="formula"><span class="lbl">Computational basis</span>|0⟩ = <table class="matrix"><tbody><tr><td>1</td></tr><tr><td>0</td></tr></tbody></table>    |1⟩ = <table class="matrix"><tbody><tr><td>0</td></tr><tr><td>1</td></tr></tbody></table>    so    α|0⟩ + β|1⟩ = <table class="matrix"><tbody><tr><td>α</td></tr><tr><td>β</td></tr></tbody></table></div>
<p>A <strong>bra</strong> ⟨ψ| is the <em>conjugate transpose</em> of |ψ⟩: a row vector whose entries are conjugated. If |ψ⟩ = (α, β)<sup>T</sup> then ⟨ψ| = (α*, β*). Putting a bra next to a ket gives a number, the <strong>inner product</strong> (“bra-ket” = bracket):</p>
<div class="formula"><span class="lbl">Inner product</span>⟨φ|ψ⟩ = φ<sub>1</sub>* ψ<sub>1</sub> + φ<sub>2</sub>* ψ<sub>2</sub> + … + φ<sub>n</sub>* ψ<sub>n</sub>    ‖ψ‖ = √⟨ψ|ψ⟩</div>
<p>The conjugate is essential: it makes ⟨ψ|ψ⟩ = |ψ<sub>1</sub>|<sup>2</sup> + … + |ψ<sub>n</sub>|<sup>2</sup> real and non-negative, so it can be a squared length. Two consequences: ⟨ψ|φ⟩ = ⟨φ|ψ⟩* (swapping conjugates the result), and constants pulled out of the bra get conjugated.</p>
<p>A vector is <strong>normalised</strong> if ‖ψ‖ = 1, and two vectors are <strong>orthogonal</strong> if ⟨φ|ψ⟩ = 0. An <strong>orthonormal basis</strong> of ℂ<sup>2</sup> is a pair of normalised, orthogonal vectors. Besides {|0⟩, |1⟩}, the second basis you will meet constantly is the <strong>Hadamard (X) basis</strong>:</p>
<div class="formula"><span class="lbl">Hadamard basis</span>|+⟩ = (|0⟩ + |1⟩)/√2    |−⟩ = (|0⟩ − |1⟩)/√2    ⟨+|−⟩ = (1 − 1)/2 = 0</div>
<p>In any orthonormal basis {|b<sub>1</sub>⟩, …, |b<sub>n</sub>⟩}, every vector expands as |ψ⟩ = Σ c<sub>k</sub>|b<sub>k</sub>⟩ with <strong>c<sub>k</sub> = ⟨b<sub>k</sub>|ψ⟩</strong>. This is how we will later compute measurement probabilities in any basis: the probability of outcome b<sub>k</sub> will be |⟨b<sub>k</sub>|ψ⟩|<sup>2</sup>.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — inner product.</b> |ψ⟩ = (|0⟩ + i|1⟩)/√2 and |φ⟩ = (|0⟩ + |1⟩)/√2 = |+⟩.</p>
<p>Step 1: ⟨φ| = (1, 1)/√2 (real entries, nothing to conjugate). Step 2: ⟨φ|ψ⟩ = (1·1 + 1·i)/2 = <b>(1 + i)/2</b>. Step 3: |⟨φ|ψ⟩|<sup>2</sup> = (1 + 1)/4 = <b>1/2</b>. Swapping: ⟨ψ|φ⟩ = (1 − i)/2, the conjugate, as predicted.</p></div>
<div class="callout"><p><b>Example 2 — normalising.</b> Normalise v = 3|0⟩ + 4i|1⟩.</p>
<p>‖v‖<sup>2</sup> = |3|<sup>2</sup> + |4i|<sup>2</sup> = 9 + 16 = 25, so ‖v‖ = 5 and the normalised state is <b>0.6|0⟩ + 0.8i|1⟩</b>. Note |4i|<sup>2</sup> = 16, not −16.</p></div>
<div class="callout"><p><b>Example 3 — change of basis.</b> Expand |χ⟩ = 0.6|0⟩ + 0.8i|1⟩ in the basis {|+⟩, |−⟩}.</p>
<p>c<sub>+</sub> = ⟨+|χ⟩ = (0.6 + 0.8i)/√2 and c<sub>−</sub> = ⟨−|χ⟩ = (0.6 − 0.8i)/√2. Both have |c|<sup>2</sup> = (0.36 + 0.64)/2 = 0.5, and 0.5 + 0.5 = 1 — the expansion is still normalised, as it must be in an orthonormal basis.</p></div>
<pre><code class="language-python">import numpy as np
psi = np.array([1, 1j]) / np.sqrt(2)
phi = np.array([1, 1]) / np.sqrt(2)
print(np.vdot(phi, psi), abs(np.vdot(phi, psi))**2)   # vdot conjugates its FIRST argument
v = np.array([3, 4j]); print(np.linalg.norm(v), v / np.linalg.norm(v))</code></pre>
<div class="out">(0.4999999999999999+0.4999999999999999j) 0.4999999999999998
5.0 [0.6+0.j  0. +0.8j]</div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Forgetting to conjugate the bra. In numpy, <code>np.dot(phi, psi)</code> does <em>not</em> conjugate; use <code>np.vdot(phi, psi)</code> or <code>phi.conj() @ psi</code>.</li><li>Treating |0⟩ as the zero vector. |0⟩ is the first basis vector (1, 0)<sup>T</sup>; the zero vector has no ket name.</li><li>Concluding that a state is not normalised because its amplitudes do not add up to 1. It is the <em>squared moduli</em> that must add up to 1.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Ket = column vector; bra = conjugate transpose; ⟨φ|ψ⟩ = Σ φ<sub>k</sub>* ψ<sub>k</sub>.</li><li>⟨ψ|φ⟩ = ⟨φ|ψ⟩*, and ‖ψ‖<sup>2</sup> = ⟨ψ|ψ⟩ = Σ |ψ<sub>k</sub>|<sup>2</sup>.</li><li>Two key bases: {|0⟩, |1⟩} and {|+⟩, |−⟩}.</li><li>Coefficient on a basis vector = inner product with it: c<sub>k</sub> = ⟨b<sub>k</sub>|ψ⟩.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://learn.microsoft.com/en-us/azure/quantum/concepts-dirac-notation" target="_blank" rel="noopener">Microsoft Learn — Dirac notation in quantum computing</a></li><li><a href="https://en.wikipedia.org/wiki/Bra%E2%80%93ket_notation" target="_blank" rel="noopener">Wikipedia — Bra–ket notation</a></li><li><a href="https://github.com/Qiskit/documentation/blob/main/learning/courses/basics-of-quantum-information/single-systems/quantum-information.ipynb" target="_blank" rel="noopener">IBM Quantum Learning (Watrous) — Single systems: quantum information (source notebook)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Let |u⟩ = (|0⟩ + 2i|1⟩)/√5 and |v⟩ = (2|0⟩ + i|1⟩)/√5. Compute ⟨u|v⟩.</li><li>Is the pair {(|0⟩ + i|1⟩)/√2, (|0⟩ − i|1⟩)/√2} an orthonormal basis?</li><li>Find c<sub>0</sub>, c<sub>1</sub> such that |−⟩ = c<sub>0</sub>|0⟩ + c<sub>1</sub>|1⟩ using c<sub>k</sub> = ⟨k|−⟩.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) ⟨u| = (1, −2i)/√5, so ⟨u|v⟩ = (1·2 + (−2i)(i))/5 = (2 + 2)/5 = <b>4/5</b>. 2) Yes: each has norm 1, and their inner product is (1·1 + (−i)(−i))/2 = (1 + i<sup>2</sup>)/2 = 0. These are the Y-basis states |i⟩ and |−i⟩. 3) c<sub>0</sub> = 1/√2, c<sub>1</sub> = −1/√2.</p></div>`,
  `<span class="eyebrow">QTC211 · Chương 1 · Bài 1.2</span>
<h2>Vectơ phức và ký hiệu Dirac: ket, bra, tích trong</h2>
<p class="lead">Trạng thái một qubit là một vectơ trong ℂ<sup>2</sup>. Nhà vật lý viết vectơ bằng ký hiệu bra–ket của Paul Dirac, và sách điện toán lượng tử nào cũng dùng nó. Đọc trôi chảy ký hiệu này thì phần còn lại của môn chỉ là đại số tuyến tính bình thường.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Đọc và viết ket |ψ⟩, bra ⟨ψ| và tích trong ⟨φ|ψ⟩.</li><li>Tính tích trong của vectơ phức <em>có</em> liên hợp, và chuẩn ‖ψ‖.</li><li>Chuẩn hoá một vectơ và kiểm tra tính trực chuẩn.</li><li>Khai triển một vectơ theo cơ sở trực chuẩn bằng hệ số ⟨b<sub>k</sub>|ψ⟩.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Ket</strong> |ψ⟩ chỉ là một vectơ cột; chữ bên trong là cái tên. Hai ket quan trọng nhất là các vectơ của <strong>cơ sở tính toán</strong>:</p>
<div class="formula"><span class="lbl">Cơ sở tính toán</span>|0⟩ = <table class="matrix"><tbody><tr><td>1</td></tr><tr><td>0</td></tr></tbody></table>    |1⟩ = <table class="matrix"><tbody><tr><td>0</td></tr><tr><td>1</td></tr></tbody></table>    nên    α|0⟩ + β|1⟩ = <table class="matrix"><tbody><tr><td>α</td></tr><tr><td>β</td></tr></tbody></table></div>
<p><strong>Bra</strong> ⟨ψ| là <em>chuyển vị liên hợp</em> của |ψ⟩: một vectơ hàng có các phần tử đã lấy liên hợp. Nếu |ψ⟩ = (α, β)<sup>T</sup> thì ⟨ψ| = (α*, β*). Đặt bra cạnh ket ta được một số, gọi là <strong>tích trong</strong> (“bra-ket” = bracket, dấu ngoặc):</p>
<div class="formula"><span class="lbl">Tích trong</span>⟨φ|ψ⟩ = φ<sub>1</sub>* ψ<sub>1</sub> + φ<sub>2</sub>* ψ<sub>2</sub> + … + φ<sub>n</sub>* ψ<sub>n</sub>    ‖ψ‖ = √⟨ψ|ψ⟩</div>
<p>Phép liên hợp là bắt buộc: nó làm ⟨ψ|ψ⟩ = |ψ<sub>1</sub>|<sup>2</sup> + … + |ψ<sub>n</sub>|<sup>2</sup> thực và không âm, nên mới làm bình phương độ dài được. Hai hệ quả: ⟨ψ|φ⟩ = ⟨φ|ψ⟩* (đổi chỗ thì kết quả bị liên hợp), và hằng số rút ra khỏi bra phải lấy liên hợp.</p>
<p>Vectơ <strong>đã chuẩn hoá</strong> nếu ‖ψ‖ = 1, và hai vectơ <strong>trực giao</strong> nếu ⟨φ|ψ⟩ = 0. Một <strong>cơ sở trực chuẩn</strong> của ℂ<sup>2</sup> là cặp vectơ đã chuẩn hoá và trực giao nhau. Ngoài {|0⟩, |1⟩}, cơ sở thứ hai bạn sẽ gặp liên tục là <strong>cơ sở Hadamard (cơ sở X)</strong>:</p>
<div class="formula"><span class="lbl">Cơ sở Hadamard</span>|+⟩ = (|0⟩ + |1⟩)/√2    |−⟩ = (|0⟩ − |1⟩)/√2    ⟨+|−⟩ = (1 − 1)/2 = 0</div>
<p>Trong mọi cơ sở trực chuẩn {|b<sub>1</sub>⟩, …, |b<sub>n</sub>⟩}, mọi vectơ khai triển được thành |ψ⟩ = Σ c<sub>k</sub>|b<sub>k</sub>⟩ với <strong>c<sub>k</sub> = ⟨b<sub>k</sub>|ψ⟩</strong>. Về sau ta tính xác suất đo trong mọi cơ sở đúng bằng cách này: xác suất ra kết quả b<sub>k</sub> sẽ là |⟨b<sub>k</sub>|ψ⟩|<sup>2</sup>.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — tích trong.</b> |ψ⟩ = (|0⟩ + i|1⟩)/√2 và |φ⟩ = (|0⟩ + |1⟩)/√2 = |+⟩.</p>
<p>Bước 1: ⟨φ| = (1, 1)/√2 (phần tử thực, không cần liên hợp). Bước 2: ⟨φ|ψ⟩ = (1·1 + 1·i)/2 = <b>(1 + i)/2</b>. Bước 3: |⟨φ|ψ⟩|<sup>2</sup> = (1 + 1)/4 = <b>1/2</b>. Đổi chỗ: ⟨ψ|φ⟩ = (1 − i)/2, đúng là số liên hợp như đã nói.</p></div>
<div class="callout"><p><b>Ví dụ 2 — chuẩn hoá.</b> Chuẩn hoá v = 3|0⟩ + 4i|1⟩.</p>
<p>‖v‖<sup>2</sup> = |3|<sup>2</sup> + |4i|<sup>2</sup> = 9 + 16 = 25, nên ‖v‖ = 5 và trạng thái đã chuẩn hoá là <b>0,6|0⟩ + 0,8i|1⟩</b>. Chú ý |4i|<sup>2</sup> = 16, không phải −16.</p></div>
<div class="callout"><p><b>Ví dụ 3 — đổi cơ sở.</b> Khai triển |χ⟩ = 0,6|0⟩ + 0,8i|1⟩ theo cơ sở {|+⟩, |−⟩}.</p>
<p>c<sub>+</sub> = ⟨+|χ⟩ = (0,6 + 0,8i)/√2 và c<sub>−</sub> = ⟨−|χ⟩ = (0,6 − 0,8i)/√2. Cả hai có |c|<sup>2</sup> = (0,36 + 0,64)/2 = 0,5, và 0,5 + 0,5 = 1 — khai triển vẫn chuẩn hoá, đúng như phải có trong một cơ sở trực chuẩn.</p></div>
<pre><code class="language-python">import numpy as np
psi = np.array([1, 1j]) / np.sqrt(2)
phi = np.array([1, 1]) / np.sqrt(2)
print(np.vdot(phi, psi), abs(np.vdot(phi, psi))**2)   # vdot liên hợp đối số THỨ NHẤT
v = np.array([3, 4j]); print(np.linalg.norm(v), v / np.linalg.norm(v))</code></pre>
<div class="out">(0.4999999999999999+0.4999999999999999j) 0.4999999999999998
5.0 [0.6+0.j  0. +0.8j]</div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Quên liên hợp bra. Trong numpy, <code>np.dot(phi, psi)</code> <em>không</em> liên hợp; hãy dùng <code>np.vdot(phi, psi)</code> hoặc <code>phi.conj() @ psi</code>.</li><li>Tưởng |0⟩ là vectơ không. |0⟩ là vectơ cơ sở thứ nhất (1, 0)<sup>T</sup>; vectơ không chẳng có tên ket nào.</li><li>Kết luận trạng thái chưa chuẩn hoá vì các biên độ cộng lại không bằng 1. Thứ phải cộng lại bằng 1 là <em>bình phương mô-đun</em>.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Ket = vectơ cột; bra = chuyển vị liên hợp; ⟨φ|ψ⟩ = Σ φ<sub>k</sub>* ψ<sub>k</sub>.</li><li>⟨ψ|φ⟩ = ⟨φ|ψ⟩*, và ‖ψ‖<sup>2</sup> = ⟨ψ|ψ⟩ = Σ |ψ<sub>k</sub>|<sup>2</sup>.</li><li>Hai cơ sở then chốt: {|0⟩, |1⟩} và {|+⟩, |−⟩}.</li><li>Hệ số theo một vectơ cơ sở = tích trong với vectơ đó: c<sub>k</sub> = ⟨b<sub>k</sub>|ψ⟩.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://learn.microsoft.com/en-us/azure/quantum/concepts-dirac-notation" target="_blank" rel="noopener">Microsoft Learn — Ký hiệu Dirac trong điện toán lượng tử</a></li><li><a href="https://en.wikipedia.org/wiki/Bra%E2%80%93ket_notation" target="_blank" rel="noopener">Wikipedia — Ký hiệu bra–ket</a></li><li><a href="https://github.com/Qiskit/documentation/blob/main/learning/courses/basics-of-quantum-information/single-systems/quantum-information.ipynb" target="_blank" rel="noopener">IBM Quantum Learning (Watrous) — Hệ đơn: thông tin lượng tử (notebook gốc)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Cho |u⟩ = (|0⟩ + 2i|1⟩)/√5 và |v⟩ = (2|0⟩ + i|1⟩)/√5. Tính ⟨u|v⟩.</li><li>Cặp {(|0⟩ + i|1⟩)/√2, (|0⟩ − i|1⟩)/√2} có phải cơ sở trực chuẩn không?</li><li>Tìm c<sub>0</sub>, c<sub>1</sub> sao cho |−⟩ = c<sub>0</sub>|0⟩ + c<sub>1</sub>|1⟩, dùng c<sub>k</sub> = ⟨k|−⟩.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) ⟨u| = (1, −2i)/√5, nên ⟨u|v⟩ = (1·2 + (−2i)(i))/5 = (2 + 2)/5 = <b>4/5</b>. 2) Có: mỗi vectơ có chuẩn 1, và tích trong của chúng là (1·1 + (−i)(−i))/2 = (1 + i<sup>2</sup>)/2 = 0. Đây là hai trạng thái cơ sở Y, |i⟩ và |−i⟩. 3) c<sub>0</sub> = 1/√2, c<sub>1</sub> = −1/√2.</p></div>`);

const c13 = L('qtc211-ts-1-3',
  '1.3 — Matrices on ℂⁿ: adjoint, Hermitian, unitary, outer products and projectors|||1.3 — Ma trận trên ℂⁿ: liên hợp chuyển vị, Hermite, unita, tích ngoài và phép chiếu',
  'Ma trận liên hợp chuyển vị A†, ma trận Hermite (đại lượng đo), ma trận unita (cổng lượng tử, giữ chuẩn), trị riêng, tích ngoài |ψ⟩⟨φ|, phép chiếu, phân tích phổ Z = |0⟩⟨0| − |1⟩⟨1|.',
  `<span class="eyebrow">QTC211 · Chapter 1 · Lesson 1.3</span>
<h2>Matrices on ℂ<sup>n</sup>: adjoint, Hermitian, unitary, outer products and projectors</h2>
<p class="lead">Quantum gates are unitary matrices, measurable quantities are Hermitian matrices, and measurements use projectors. This lesson defines all three and gives you the tests to recognise them.</p>
<h3>🎯 Objectives</h3>
<ul><li>Compute the adjoint A<sup>†</sup> (conjugate transpose) of a complex matrix.</li><li>Test whether a matrix is Hermitian (A<sup>†</sup> = A) or unitary (U<sup>†</sup>U = I).</li><li>Build outer products |ψ⟩⟨φ| and projectors |ψ⟩⟨ψ|, and write a matrix as a sum of outer products.</li><li>Find eigenvalues and eigenvectors of the Pauli matrices.</li></ul>
<h3>📖 Lecture</h3>
<p>The <strong>adjoint</strong> (Hermitian conjugate, “dagger”) of a matrix is its conjugate transpose: (A<sup>†</sup>)<sub>jk</sub> = (A<sub>kj</sub>)*. It satisfies (AB)<sup>†</sup> = B<sup>†</sup>A<sup>†</sup>, and the bra of A|ψ⟩ is ⟨ψ|A<sup>†</sup>. Three matrices will appear in every chapter — the <strong>Pauli matrices</strong>:</p>
<div class="formula"><span class="lbl">Pauli matrices</span>X = <table class="matrix"><tbody><tr><td>0</td><td>1</td></tr><tr><td>1</td><td>0</td></tr></tbody></table>    Y = <table class="matrix"><tbody><tr><td>0</td><td>−i</td></tr><tr><td>i</td><td>0</td></tr></tbody></table>    Z = <table class="matrix"><tbody><tr><td>1</td><td>0</td></tr><tr><td>0</td><td>−1</td></tr></tbody></table></div>
<p>A matrix is <strong>Hermitian</strong> if A<sup>†</sup> = A. Hermitian matrices have <em>real</em> eigenvalues and orthogonal eigenvectors, and they represent <strong>observables</strong> — quantities you can measure, whose possible results are the eigenvalues. A matrix is <strong>unitary</strong> if U<sup>†</sup>U = UU<sup>†</sup> = I, i.e. U<sup>−1</sup> = U<sup>†</sup>. Unitaries <strong>preserve inner products</strong>: ⟨Uφ|Uψ⟩ = ⟨φ|U<sup>†</sup>U|ψ⟩ = ⟨φ|ψ⟩, so they map normalised states to normalised states — exactly what a gate must do. Equivalent test: the columns of U form an orthonormal basis. Every eigenvalue of a unitary has modulus 1, i.e. is a phase e<sup>iθ</sup>. X, Y and Z are both Hermitian and unitary, with eigenvalues +1 and −1.</p>
<p>A ket times a bra, |ψ⟩⟨φ|, is a matrix called an <strong>outer product</strong>; it acts as |ψ⟩⟨φ| |χ⟩ = ⟨φ|χ⟩ |ψ⟩. For example |0⟩⟨1| is the matrix with a single 1 in row 1, column 2 (it maps |1⟩ to |0⟩ and |0⟩ to the zero vector). If |ψ⟩ is normalised, P = |ψ⟩⟨ψ| is the <strong>projector</strong> onto |ψ⟩: P<sup>2</sup> = P and P<sup>†</sup> = P. Any matrix can be written with outer products, and a Hermitian matrix can be written through its eigenvalues λ<sub>k</sub> and orthonormal eigenvectors (the <strong>spectral decomposition</strong>):</p>
<div class="formula"><span class="lbl">Spectral decomposition</span>A = Σ λ<sub>k</sub> |e<sub>k</sub>⟩⟨e<sub>k</sub>|    e.g.  Z = |0⟩⟨0| − |1⟩⟨1|,   X = |+⟩⟨+| − |−⟩⟨−| = |0⟩⟨1| + |1⟩⟨0|</div>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — adjoint.</b> A = <table class="matrix"><tbody><tr><td>1</td><td>i</td></tr><tr><td>0</td><td>2</td></tr></tbody></table>. Transpose: rows become columns, giving (1, 0; i, 2); conjugate: <b>A<sup>†</sup> = (1, 0; −i, 2)</b>. A is not Hermitian (A<sup>†</sup> ≠ A).</p></div>
<div class="callout"><p><b>Example 2 — unitary test.</b> U = (1/√2) <table class="matrix"><tbody><tr><td>1</td><td>i</td></tr><tr><td>i</td><td>1</td></tr></tbody></table>.</p>
<p>Columns: c<sub>1</sub> = (1, i)/√2 and c<sub>2</sub> = (i, 1)/√2. ‖c<sub>1</sub>‖<sup>2</sup> = (1 + 1)/2 = 1, ‖c<sub>2</sub>‖<sup>2</sup> = 1, and ⟨c<sub>1</sub>|c<sub>2</sub>⟩ = (1·i + (−i)·1)/2 = 0. Orthonormal columns ⇒ <b>U is unitary</b>. Its eigenvalues (1 ± i)/√2 = e<sup>±iπ/4</sup> indeed have modulus 1. By contrast M = (1, 1; 0, 1) is <b>not</b> unitary: its second column (1, 1) has norm √2.</p></div>
<div class="callout"><p><b>Example 3 — Hermitian eigenvalues.</b> B = <table class="matrix"><tbody><tr><td>2</td><td>1 − i</td></tr><tr><td>1 + i</td><td>3</td></tr></tbody></table> is Hermitian (diagonal real, off-diagonal entries conjugate). Characteristic polynomial: (2 − λ)(3 − λ) − |1 − i|<sup>2</sup> = λ<sup>2</sup> − 5λ + 6 − 2 = λ<sup>2</sup> − 5λ + 4 = (λ − 1)(λ − 4). Eigenvalues <b>1 and 4</b> — real, as the theorem promises.</p></div>
<pre><code class="language-python">import numpy as np
X = np.array([[0, 1], [1, 0]]); Y = np.array([[0, -1j], [1j, 0]]); Z = np.diag([1, -1])
for name, M in [("X", X), ("Y", Y), ("Z", Z)]:
    print(name, "Hermitian:", np.allclose(M, M.conj().T),
          "unitary:", np.allclose(M.conj().T @ M, np.eye(2)), "eigenvalues:", np.round(np.linalg.eigvals(M), 6))
B = np.array([[2, 1 - 1j], [1 + 1j, 3]]); print("eig(B) =", np.linalg.eigvalsh(B))</code></pre>
<div class="out">X Hermitian: True unitary: True eigenvalues: [ 1.+0.j -1.+0.j]
Y Hermitian: True unitary: True eigenvalues: [ 1.+0.j -1.-0.j]
Z Hermitian: True unitary: True eigenvalues: [ 1.+0.j -1.+0.j]
eig(B) = [1. 4.]</div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Taking the transpose but forgetting the conjugate (that gives A<sup>T</sup>, not A<sup>†</sup>). For real matrices they coincide, which hides the bug until a complex entry appears.</li><li>Writing (AB)<sup>†</sup> = A<sup>†</sup>B<sup>†</sup>. The order reverses: B<sup>†</sup>A<sup>†</sup>.</li><li>Believing “unitary” means “determinant 1”. Unitary means U<sup>†</sup>U = I; its determinant is some phase e<sup>iθ</sup> (for Z it is −1).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>A<sup>†</sup> = conjugate transpose; (AB)<sup>†</sup> = B<sup>†</sup>A<sup>†</sup>.</li><li>Hermitian A<sup>†</sup> = A ⇒ real eigenvalues ⇒ observables.</li><li>Unitary U<sup>†</sup>U = I ⇒ preserves inner products ⇒ gates; eigenvalues are phases.</li><li>Outer product |ψ⟩⟨φ| is a matrix; projector P = |ψ⟩⟨ψ| satisfies P<sup>2</sup> = P.</li><li>Spectral decomposition: Z = |0⟩⟨0| − |1⟩⟨1|, X = |+⟩⟨+| − |−⟩⟨−|.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://learn.microsoft.com/en-us/azure/quantum/concepts-vectors-and-matrices" target="_blank" rel="noopener">Microsoft Learn — Vectors and matrices in quantum computing</a></li><li><a href="https://en.wikipedia.org/wiki/Unitary_matrix" target="_blank" rel="noopener">Wikipedia — Unitary matrix</a></li><li><a href="https://en.wikipedia.org/wiki/Pauli_matrices" target="_blank" rel="noopener">Wikipedia — Pauli matrices</a></li><li><a href="https://cuongthai.com/academy/courses/maa102-linear-algebra" target="_blank" rel="noopener">MAA102 — Linear Algebra on CuongThai Academy (eigenvalues chapter)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Show that Y = iXZ by multiplying the matrices.</li><li>Write the matrix |1⟩⟨0| + |0⟩⟨1| and name it.</li><li>For |χ⟩ = 0.6|0⟩ + 0.8i|1⟩, compute ⟨χ|Z|χ⟩.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) XZ = (0, −1; 1, 0); multiply by i: (0, −i; i, 0) = Y. 2) (0, 1; 1, 0) = X. 3) Z|χ⟩ = 0.6|0⟩ − 0.8i|1⟩, so ⟨χ|Z|χ⟩ = |0.6|<sup>2</sup> − |0.8i|<sup>2</sup> = 0.36 − 0.64 = <b>−0.28</b>. (In Chapter 3 you will see this is the average of the ±1 results of a Z measurement.)</p></div>`,
  `<span class="eyebrow">QTC211 · Chương 1 · Bài 1.3</span>
<h2>Ma trận trên ℂ<sup>n</sup>: liên hợp chuyển vị, Hermite, unita, tích ngoài và phép chiếu</h2>
<p class="lead">Cổng lượng tử là ma trận unita, đại lượng đo được là ma trận Hermite, và phép đo dùng phép chiếu. Bài này định nghĩa cả ba và cho bạn các phép thử để nhận ra chúng.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính ma trận liên hợp chuyển vị A<sup>†</sup> của một ma trận phức.</li><li>Kiểm tra ma trận có Hermite (A<sup>†</sup> = A) hay unita (U<sup>†</sup>U = I) không.</li><li>Lập tích ngoài |ψ⟩⟨φ| và phép chiếu |ψ⟩⟨ψ|, viết một ma trận thành tổng các tích ngoài.</li><li>Tìm trị riêng, vectơ riêng của các ma trận Pauli.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Ma trận liên hợp chuyển vị</strong> (liên hợp Hermite, “dagger”) của một ma trận là chuyển vị rồi lấy liên hợp: (A<sup>†</sup>)<sub>jk</sub> = (A<sub>kj</sub>)*. Nó thoả (AB)<sup>†</sup> = B<sup>†</sup>A<sup>†</sup>, và bra của A|ψ⟩ là ⟨ψ|A<sup>†</sup>. Ba ma trận sẽ xuất hiện ở mọi chương — các <strong>ma trận Pauli</strong>:</p>
<div class="formula"><span class="lbl">Ma trận Pauli</span>X = <table class="matrix"><tbody><tr><td>0</td><td>1</td></tr><tr><td>1</td><td>0</td></tr></tbody></table>    Y = <table class="matrix"><tbody><tr><td>0</td><td>−i</td></tr><tr><td>i</td><td>0</td></tr></tbody></table>    Z = <table class="matrix"><tbody><tr><td>1</td><td>0</td></tr><tr><td>0</td><td>−1</td></tr></tbody></table></div>
<p>Ma trận <strong>Hermite</strong> nếu A<sup>†</sup> = A. Ma trận Hermite có trị riêng <em>thực</em> và các vectơ riêng trực giao, và chúng biểu diễn <strong>đại lượng quan sát (observable)</strong> — đại lượng đo được, kết quả có thể là các trị riêng. Ma trận <strong>unita</strong> nếu U<sup>†</sup>U = UU<sup>†</sup> = I, tức U<sup>−1</sup> = U<sup>†</sup>. Ma trận unita <strong>giữ nguyên tích trong</strong>: ⟨Uφ|Uψ⟩ = ⟨φ|U<sup>†</sup>U|ψ⟩ = ⟨φ|ψ⟩, nên nó biến trạng thái đã chuẩn hoá thành trạng thái đã chuẩn hoá — đúng điều một cổng phải làm. Phép thử tương đương: các cột của U lập thành cơ sở trực chuẩn. Mọi trị riêng của ma trận unita có mô-đun 1, tức là một pha e<sup>iθ</sup>. X, Y, Z vừa Hermite vừa unita, trị riêng +1 và −1.</p>
<p>Ket nhân bra, |ψ⟩⟨φ|, là một ma trận gọi là <strong>tích ngoài</strong>; nó tác động theo |ψ⟩⟨φ| |χ⟩ = ⟨φ|χ⟩ |ψ⟩. Ví dụ |0⟩⟨1| là ma trận chỉ có một số 1 ở hàng 1, cột 2 (biến |1⟩ thành |0⟩ và |0⟩ thành vectơ không). Nếu |ψ⟩ đã chuẩn hoá thì P = |ψ⟩⟨ψ| là <strong>phép chiếu</strong> lên |ψ⟩: P<sup>2</sup> = P và P<sup>†</sup> = P. Mọi ma trận đều viết được bằng tích ngoài, và ma trận Hermite viết được qua trị riêng λ<sub>k</sub> và vectơ riêng trực chuẩn (<strong>phân tích phổ</strong>):</p>
<div class="formula"><span class="lbl">Phân tích phổ</span>A = Σ λ<sub>k</sub> |e<sub>k</sub>⟩⟨e<sub>k</sub>|    vd  Z = |0⟩⟨0| − |1⟩⟨1|,   X = |+⟩⟨+| − |−⟩⟨−| = |0⟩⟨1| + |1⟩⟨0|</div>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — liên hợp chuyển vị.</b> A = <table class="matrix"><tbody><tr><td>1</td><td>i</td></tr><tr><td>0</td><td>2</td></tr></tbody></table>. Chuyển vị: hàng thành cột, được (1, 0; i, 2); lấy liên hợp: <b>A<sup>†</sup> = (1, 0; −i, 2)</b>. A không Hermite (A<sup>†</sup> ≠ A).</p></div>
<div class="callout"><p><b>Ví dụ 2 — kiểm tra unita.</b> U = (1/√2) <table class="matrix"><tbody><tr><td>1</td><td>i</td></tr><tr><td>i</td><td>1</td></tr></tbody></table>.</p>
<p>Các cột: c<sub>1</sub> = (1, i)/√2 và c<sub>2</sub> = (i, 1)/√2. ‖c<sub>1</sub>‖<sup>2</sup> = (1 + 1)/2 = 1, ‖c<sub>2</sub>‖<sup>2</sup> = 1, và ⟨c<sub>1</sub>|c<sub>2</sub>⟩ = (1·i + (−i)·1)/2 = 0. Cột trực chuẩn ⇒ <b>U unita</b>. Trị riêng (1 ± i)/√2 = e<sup>±iπ/4</sup> đúng là có mô-đun 1. Ngược lại M = (1, 1; 0, 1) <b>không</b> unita: cột thứ hai (1, 1) có chuẩn √2.</p></div>
<div class="callout"><p><b>Ví dụ 3 — trị riêng ma trận Hermite.</b> B = <table class="matrix"><tbody><tr><td>2</td><td>1 − i</td></tr><tr><td>1 + i</td><td>3</td></tr></tbody></table> là Hermite (đường chéo thực, hai phần tử ngoài chéo liên hợp nhau). Đa thức đặc trưng: (2 − λ)(3 − λ) − |1 − i|<sup>2</sup> = λ<sup>2</sup> − 5λ + 6 − 2 = λ<sup>2</sup> − 5λ + 4 = (λ − 1)(λ − 4). Trị riêng <b>1 và 4</b> — thực, đúng như định lý.</p></div>
<pre><code class="language-python">import numpy as np
X = np.array([[0, 1], [1, 0]]); Y = np.array([[0, -1j], [1j, 0]]); Z = np.diag([1, -1])
for name, M in [("X", X), ("Y", Y), ("Z", Z)]:
    print(name, "Hermitian:", np.allclose(M, M.conj().T),
          "unitary:", np.allclose(M.conj().T @ M, np.eye(2)), "eigenvalues:", np.round(np.linalg.eigvals(M), 6))
B = np.array([[2, 1 - 1j], [1 + 1j, 3]]); print("eig(B) =", np.linalg.eigvalsh(B))</code></pre>
<div class="out">X Hermitian: True unitary: True eigenvalues: [ 1.+0.j -1.+0.j]
Y Hermitian: True unitary: True eigenvalues: [ 1.+0.j -1.-0.j]
Z Hermitian: True unitary: True eigenvalues: [ 1.+0.j -1.+0.j]
eig(B) = [1. 4.]</div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Chuyển vị nhưng quên liên hợp (được A<sup>T</sup> chứ không phải A<sup>†</sup>). Với ma trận thực hai thứ trùng nhau, nên lỗi bị giấu cho tới khi xuất hiện phần tử phức.</li><li>Viết (AB)<sup>†</sup> = A<sup>†</sup>B<sup>†</sup>. Thứ tự đảo ngược: B<sup>†</sup>A<sup>†</sup>.</li><li>Tưởng “unita” nghĩa là “định thức bằng 1”. Unita nghĩa là U<sup>†</sup>U = I; định thức của nó là một pha e<sup>iθ</sup> nào đó (với Z là −1).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>A<sup>†</sup> = chuyển vị liên hợp; (AB)<sup>†</sup> = B<sup>†</sup>A<sup>†</sup>.</li><li>Hermite A<sup>†</sup> = A ⇒ trị riêng thực ⇒ đại lượng quan sát.</li><li>Unita U<sup>†</sup>U = I ⇒ giữ tích trong ⇒ cổng; trị riêng là các pha.</li><li>Tích ngoài |ψ⟩⟨φ| là ma trận; phép chiếu P = |ψ⟩⟨ψ| thoả P<sup>2</sup> = P.</li><li>Phân tích phổ: Z = |0⟩⟨0| − |1⟩⟨1|, X = |+⟩⟨+| − |−⟩⟨−|.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://learn.microsoft.com/en-us/azure/quantum/concepts-vectors-and-matrices" target="_blank" rel="noopener">Microsoft Learn — Vectơ và ma trận trong điện toán lượng tử</a></li><li><a href="https://en.wikipedia.org/wiki/Unitary_matrix" target="_blank" rel="noopener">Wikipedia — Ma trận unita</a></li><li><a href="https://en.wikipedia.org/wiki/Pauli_matrices" target="_blank" rel="noopener">Wikipedia — Ma trận Pauli</a></li><li><a href="https://cuongthai.com/academy/courses/maa102-linear-algebra" target="_blank" rel="noopener">MAA102 — Đại số tuyến tính trên CuongThai Academy (chương trị riêng)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Chứng minh Y = iXZ bằng cách nhân ma trận.</li><li>Viết ma trận |1⟩⟨0| + |0⟩⟨1| và gọi tên nó.</li><li>Với |χ⟩ = 0,6|0⟩ + 0,8i|1⟩, tính ⟨χ|Z|χ⟩.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) XZ = (0, −1; 1, 0); nhân với i: (0, −i; i, 0) = Y. 2) (0, 1; 1, 0) = X. 3) Z|χ⟩ = 0,6|0⟩ − 0,8i|1⟩, nên ⟨χ|Z|χ⟩ = |0,6|<sup>2</sup> − |0,8i|<sup>2</sup> = 0,36 − 0,64 = <b>−0,28</b>. (Ở Chương 3 bạn sẽ thấy đây là giá trị trung bình của các kết quả ±1 khi đo Z.)</p></div>`);

const q1 = QZ(1, 'Quiz — Chapter 1: Complex linear algebra & Dirac notation|||Quiz — Chương 1: Đại số tuyến tính phức & ký hiệu Dirac', 'Kiểm tra chương 1: số phức, mô-đun, dạng cực, tích trong có liên hợp, chuẩn hoá, ma trận liên hợp chuyển vị, Hermite, unita, tích ngoài.', [
  Q('q1', '|3 − 4i| equals||||3 − 4i| bằng',
    ['−1|||−1', '5|||5', '7|||7', '25|||25'], 1,
    '√(9 + 16) = 5.|||√(9 + 16) = 5.'),
  Q('q2', '(1 + i)(1 − i) equals|||(1 + i)(1 − i) bằng',
    ['0|||0', '2i|||2i', '2|||2', '1 − i|||1 − i'], 2,
    '1 − i² = 1 + 1 = 2 = |1 + i|².|||1 − i² = 1 + 1 = 2 = |1 + i|².'),
  Q('q3', 'e^(iπ/2) equals|||e^(iπ/2) bằng',
    ['i|||i', '−1|||−1', '1|||1', '−i|||−i'], 0,
    'cos(π/2) + i sin(π/2) = i.|||cos(π/2) + i sin(π/2) = i.'),
  Q('q4', 'For |φ⟩ = |+⟩ and |ψ⟩ = (|0⟩ + i|1⟩)/√2, ⟨φ|ψ⟩ =|||Với |φ⟩ = |+⟩ và |ψ⟩ = (|0⟩ + i|1⟩)/√2, ⟨φ|ψ⟩ =',
    ['(1 + i)/2|||(1 + i)/2', '(1 − i)/2|||(1 − i)/2', '1|||1', '0|||0'], 0,
    '(1·1 + 1·i)/2. The bra of |+⟩ has real entries.|||(1·1 + 1·i)/2. Bra của |+⟩ có phần tử thực.'),
  Q('q5', 'Which vector is normalised?|||Vectơ nào đã chuẩn hoá?',
    ['(|0⟩ + |1⟩)/2|||(|0⟩ + |1⟩)/2', '0.6|0⟩ + 0.8i|1⟩|||0,6|0⟩ + 0,8i|1⟩', '|0⟩ + i|1⟩||||0⟩ + i|1⟩', '0.5|0⟩ + 0.5|1⟩|||0,5|0⟩ + 0,5|1⟩'], 1,
    '0.36 + 0.64 = 1; the others give 1/2, 2, 1/2.|||0,36 + 0,64 = 1; các vectơ khác cho 1/2, 2, 1/2.'),
  Q('q6', 'Swapping the order of an inner product gives|||Đổi thứ tự hai vectơ trong tích trong cho',
    ['the same number|||cùng một số', 'its negative|||số đối', 'its complex conjugate|||số phức liên hợp', 'its modulus|||mô-đun của nó'], 2,
    '⟨ψ|φ⟩ = ⟨φ|ψ⟩*.|||⟨ψ|φ⟩ = ⟨φ|ψ⟩*.'),
  Q('q7', 'A matrix U is unitary exactly when|||Ma trận U là unita khi và chỉ khi',
    ['det U = 1|||det U = 1', 'U = U^T|||U = U^T', 'all entries have modulus 1|||mọi phần tử có mô-đun 1', 'U†U = I|||U†U = I'], 3,
    'Unitary means U† is the inverse; columns are orthonormal.|||Unita nghĩa là U† là nghịch đảo; các cột trực chuẩn.'),
  Q('q8', 'Eigenvalues of a Hermitian matrix are always|||Trị riêng của ma trận Hermite luôn',
    ['real|||thực', 'purely imaginary|||thuần ảo', 'of modulus 1|||có mô-đun 1', 'zero or one|||bằng 0 hoặc 1'], 0,
    'Hermitian ⇒ real eigenvalues (observables). Modulus 1 is the property of unitaries.|||Hermite ⇒ trị riêng thực (đại lượng quan sát). Mô-đun 1 là tính chất của ma trận unita.'),
  Q('q9', 'The outer product |0⟩⟨1| maps |1⟩ to|||Tích ngoài |0⟩⟨1| biến |1⟩ thành',
    ['|1⟩||||1⟩', '|0⟩||||0⟩', 'the zero vector|||vectơ không', '|+⟩||||+⟩'], 1,
    '|0⟩⟨1|1⟩ = ⟨1|1⟩|0⟩ = |0⟩.||||0⟩⟨1|1⟩ = ⟨1|1⟩|0⟩ = |0⟩.'),
  Q('q10', 'Which equality is correct?|||Đẳng thức nào đúng?',
    ['Z = |0⟩⟨0| + |1⟩⟨1||||Z = |0⟩⟨0| + |1⟩⟨1|', 'Z = |0⟩⟨0| − |1⟩⟨1||||Z = |0⟩⟨0| − |1⟩⟨1|', 'X = |0⟩⟨0| − |1⟩⟨1||||X = |0⟩⟨0| − |1⟩⟨1|', '(AB)† = A†B†|||(AB)† = A†B†'], 1,
    'Spectral decomposition of Z with eigenvalues +1, −1. (AB)† = B†A†.|||Phân tích phổ của Z với trị riêng +1, −1. (AB)† = B†A†.'),
]);

const ch1 = {
  title: 'Chapter 1 — Complex linear algebra and Dirac notation|||Chương 1 — Đại số tuyến tính phức và ký hiệu Dirac',
  description: 'Ôn số phức (mô-đun, dạng cực, Euler), vectơ phức và ký hiệu bra–ket, tích trong có liên hợp, cơ sở trực chuẩn, ma trận Hermite/unita, tích ngoài và phép chiếu (Nielsen & Chuang 2.1 · Watrous Lesson 1).',
  lessons: [c11, c12, c13, q1],
};

// ───────────────────────────── Chương 2 — Qubit, pha và mặt cầu Bloch ─────────────────────────────
const c21 = L('qtc211-ts-2-1',
  '2.1 — From bits to qubits: superposition and normalisation|||2.1 — Từ bit đến qubit: chồng chập và chuẩn hoá',
  'Bit cổ điển vs qubit, trạng thái α|0⟩ + β|1⟩, điều kiện chuẩn hoá |α|² + |β|² = 1, n qubit cần 2ⁿ biên độ (bộ nhớ mô phỏng 30/50 qubit), ngộ nhận “thử mọi đáp án song song”.',
  `<span class="eyebrow">QTC211 · Chapter 2 · Lesson 2.1</span>
<h2>From bits to qubits: superposition and normalisation</h2>
<p class="lead">A bit has two possible values. A qubit has two <em>basis</em> states, |0⟩ and |1⟩, but its state can be any normalised complex combination of them. This lesson defines that state precisely and explains what “superposition” does — and does not — mean.</p>
<h3>🎯 Objectives</h3>
<ul><li>Write a general qubit state α|0⟩ + β|1⟩ and check the normalisation condition.</li><li>Normalise a given vector so that it becomes a valid qubit state.</li><li>Explain why n qubits are described by 2<sup>n</sup> complex amplitudes, and what that costs a classical simulator.</li><li>Correct the misconception that a quantum computer “tries all answers in parallel”.</li></ul>
<h3>📖 Lecture</h3>
<p>A classical bit is either 0 or 1. Even a <em>random</em> bit is, at every moment, one of the two values; we merely do not know which, and we describe our ignorance by probabilities p<sub>0</sub> + p<sub>1</sub> = 1 (non-negative real numbers).</p>
<p>A <strong>qubit</strong> is a two-level quantum system (a photon's polarisation, an electron's spin, the two lowest energy levels of a superconducting circuit…). Its state is a unit vector in ℂ<sup>2</sup>:</p>
<div class="formula"><span class="lbl">Qubit state</span>|ψ⟩ = α|0⟩ + β|1⟩ = <table class="matrix"><tbody><tr><td>α</td></tr><tr><td>β</td></tr></tbody></table>,    α, β ∈ ℂ,    |α|<sup>2</sup> + |β|<sup>2</sup> = 1</div>
<p>The complex numbers α and β are the <strong>amplitudes</strong>. When both are non-zero we say the qubit is in a <strong>superposition</strong> of |0⟩ and |1⟩. Two differences from a probability vector matter enormously: amplitudes can be <em>negative or complex</em>, and the normalisation is on <em>squared moduli</em>. Because amplitudes have signs and phases, they can cancel — this is <strong>interference</strong>, and probabilities can never do it. (In Chapter 3 you will see that |α|<sup>2</sup> and |β|<sup>2</sup> are the probabilities of reading 0 or 1.)</p>
<p><strong>Many qubits.</strong> A register of n qubits has 2<sup>n</sup> basis states |00…0⟩, …, |11…1⟩ (the n-bit strings), and its general state assigns one complex amplitude to <em>each</em> string, with the squared moduli summing to 1. (How these states are built from single qubits is Chapter 5.) Storing that vector on a classical computer takes 2<sup>n</sup> complex numbers — 16 bytes each in double precision:</p>
<pre><code class="language-python">for n in [10, 20, 30, 40, 50]:
    amplitudes = 2 ** n
    nbytes = amplitudes * 16          # one complex128 = 16 bytes
    print(f"{n:2d} qubits: {amplitudes:&gt;22,d} amplitudes, {nbytes / 2**30:&gt;14,.3f} GiB")</code></pre>
<div class="out">10 qubits:                  1,024 amplitudes,          0.000 GiB
20 qubits:              1,048,576 amplitudes,          0.016 GiB
30 qubits:          1,073,741,824 amplitudes,         16.000 GiB
40 qubits:      1,099,511,627,776 amplitudes,     16,384.000 GiB
50 qubits:  1,125,899,906,842,624 amplitudes, 16,777,216.000 GiB</div>
<p>30 qubits fit in a laptop's 16 GiB; 50 qubits need about 16 million GiB (≈ 18 petabytes); 300 qubits would need 2<sup>300</sup> ≈ 2 × 10<sup>90</sup> amplitudes — more than the estimated number of atoms in the observable universe. This exponential description is the reason quantum computers are interesting.</p>
<div class="note-ct"><p><strong>But a quantum computer does not “try all 2<sup>n</sup> answers at once and give you the best”.</strong> At the end you must measure, and a measurement returns <em>one</em> n-bit string, chosen at random according to the squared amplitudes, while the rest of the vector is lost. A useful quantum algorithm has to arrange the amplitudes by interference so that the right answer ends up with a large amplitude <em>before</em> measuring. That is possible only for problems with special structure (Chapters 8–9).</p></div>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — is it a valid state?</b> |ψ⟩ = (1/2)|0⟩ + (√3/2)|1⟩.</p>
<p>|1/2|<sup>2</sup> + |√3/2|<sup>2</sup> = 1/4 + 3/4 = <b>1</b> ✓. It is a valid qubit state. So is 0.6|0⟩ − 0.8|1⟩ (0.36 + 0.64 = 1): a negative amplitude is allowed.</p></div>
<div class="callout"><p><b>Example 2 — normalising.</b> Turn v = (1 + i)|0⟩ + |1⟩ into a qubit state.</p>
<p>Step 1: ‖v‖<sup>2</sup> = |1 + i|<sup>2</sup> + |1|<sup>2</sup> = 2 + 1 = 3. Step 2: divide by √3: <b>|ψ⟩ = ((1 + i)|0⟩ + |1⟩)/√3</b>. Check: 2/3 + 1/3 = 1.</p></div>
<div class="callout"><p><b>Example 3 — a missing amplitude.</b> A qubit has α = 0.6 and a real, positive β. Find β.</p>
<p>|β|<sup>2</sup> = 1 − 0.36 = 0.64, so <b>β = 0.8</b>. If β were allowed to be complex, every β = 0.8 e<sup>iφ</sup> would work — the next lesson explains what that extra phase means.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Requiring α + β = 1. The condition is |α|<sup>2</sup> + |β|<sup>2</sup> = 1; for example (|0⟩ + |1⟩)/√2 has α + β = √2.</li><li>Thinking a superposition means “the qubit is secretly 0 or 1 and we don't know which”. That describes a <em>random bit</em>; a superposition can interfere, a random bit cannot.</li><li>Concluding “n qubits store 2<sup>n</sup> bits of information you can read out”. A measurement of n qubits yields only n bits.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Qubit state: |ψ⟩ = α|0⟩ + β|1⟩ with complex amplitudes and |α|<sup>2</sup> + |β|<sup>2</sup> = 1.</li><li>To normalise, divide by ‖v‖ = √(Σ|v<sub>k</sub>|<sup>2</sup>).</li><li>n qubits ⇒ 2<sup>n</sup> amplitudes; simulating 30 qubits needs 16 GiB, 50 qubits about 16 million GiB.</li><li>Amplitudes interfere; measurement gives only one outcome — no “free parallelism”.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://learn.microsoft.com/en-us/azure/quantum/concepts-the-qubit" target="_blank" rel="noopener">Microsoft Learn — The qubit in quantum computing</a></li><li><a href="https://en.wikipedia.org/wiki/Qubit" target="_blank" rel="noopener">Wikipedia — Qubit</a></li><li><a href="https://www.youtube.com/watch?v=3-c4xJa7Flk" target="_blank" rel="noopener">Qiskit — Understanding Quantum Information &amp; Computation, Lesson 01: Single Systems (Watrous)</a></li><li><a href="https://quantum.country/qcvc" target="_blank" rel="noopener">Quantum computing for the very curious — Part I: the state of a qubit</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Normalise 2|0⟩ − i|1⟩.</li><li>How many complex amplitudes describe a 10-qubit register, and how many bytes does a double-precision simulator need for them?</li><li>Is (|0⟩ + |1⟩)/2 a valid qubit state? If not, fix it.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) ‖v‖<sup>2</sup> = 4 + 1 = 5, so (2|0⟩ − i|1⟩)/√5. 2) 2<sup>10</sup> = 1024 amplitudes × 16 bytes = 16 384 bytes = 16 KiB. 3) No: 1/4 + 1/4 = 1/2. Divide by √(1/2) instead: (|0⟩ + |1⟩)/√2 = |+⟩.</p></div>`,
  `<span class="eyebrow">QTC211 · Chương 2 · Bài 2.1</span>
<h2>Từ bit đến qubit: chồng chập và chuẩn hoá</h2>
<p class="lead">Một bit có hai giá trị. Một qubit có hai trạng thái <em>cơ sở</em> |0⟩ và |1⟩, nhưng trạng thái của nó có thể là bất kỳ tổ hợp phức đã chuẩn hoá nào của hai trạng thái đó. Bài này định nghĩa chính xác trạng thái ấy và giải thích “chồng chập” nghĩa là gì — và KHÔNG nghĩa là gì.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Viết trạng thái qubit tổng quát α|0⟩ + β|1⟩ và kiểm tra điều kiện chuẩn hoá.</li><li>Chuẩn hoá một vectơ cho trước để nó thành trạng thái qubit hợp lệ.</li><li>Giải thích vì sao n qubit được mô tả bằng 2<sup>n</sup> biên độ phức, và điều đó tốn bao nhiêu cho máy mô phỏng cổ điển.</li><li>Sửa ngộ nhận “máy lượng tử thử mọi đáp án song song”.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Bit cổ điển là 0 hoặc 1. Ngay cả một bit <em>ngẫu nhiên</em> thì ở mỗi thời điểm nó vẫn là một trong hai giá trị; ta chỉ không biết là giá trị nào, và mô tả sự không biết đó bằng xác suất p<sub>0</sub> + p<sub>1</sub> = 1 (số thực không âm).</p>
<p><strong>Qubit</strong> là một hệ lượng tử hai mức (phân cực của photon, spin của electron, hai mức năng lượng thấp nhất của một mạch siêu dẫn…). Trạng thái của nó là một vectơ đơn vị trong ℂ<sup>2</sup>:</p>
<div class="formula"><span class="lbl">Trạng thái qubit</span>|ψ⟩ = α|0⟩ + β|1⟩ = <table class="matrix"><tbody><tr><td>α</td></tr><tr><td>β</td></tr></tbody></table>,    α, β ∈ ℂ,    |α|<sup>2</sup> + |β|<sup>2</sup> = 1</div>
<p>Hai số phức α và β là các <strong>biên độ</strong>. Khi cả hai khác 0 ta nói qubit ở trạng thái <strong>chồng chập</strong> của |0⟩ và |1⟩. Có hai khác biệt rất lớn so với vectơ xác suất: biên độ có thể <em>âm hoặc phức</em>, và điều kiện chuẩn hoá đặt trên <em>bình phương mô-đun</em>. Vì biên độ có dấu và pha nên chúng triệt tiêu được nhau — đó là <strong>giao thoa</strong>, điều xác suất không bao giờ làm được. (Ở Chương 3 bạn sẽ thấy |α|<sup>2</sup> và |β|<sup>2</sup> là xác suất đọc ra 0 hoặc 1.)</p>
<p><strong>Nhiều qubit.</strong> Một thanh ghi n qubit có 2<sup>n</sup> trạng thái cơ sở |00…0⟩, …, |11…1⟩ (các xâu n bit), và trạng thái tổng quát gán một biên độ phức cho <em>từng</em> xâu, tổng bình phương mô-đun bằng 1. (Cách dựng các trạng thái này từ từng qubit là nội dung Chương 5.) Lưu vectơ đó trên máy cổ điển cần 2<sup>n</sup> số phức — mỗi số 16 byte ở độ chính xác kép:</p>
<pre><code class="language-python">for n in [10, 20, 30, 40, 50]:
    amplitudes = 2 ** n
    nbytes = amplitudes * 16          # một số complex128 = 16 byte
    print(f"{n:2d} qubits: {amplitudes:&gt;22,d} amplitudes, {nbytes / 2**30:&gt;14,.3f} GiB")</code></pre>
<div class="out">10 qubits:                  1,024 amplitudes,          0.000 GiB
20 qubits:              1,048,576 amplitudes,          0.016 GiB
30 qubits:          1,073,741,824 amplitudes,         16.000 GiB
40 qubits:      1,099,511,627,776 amplitudes,     16,384.000 GiB
50 qubits:  1,125,899,906,842,624 amplitudes, 16,777,216.000 GiB</div>
<p>30 qubit vừa đủ 16 GiB của một laptop; 50 qubit cần khoảng 16 triệu GiB (≈ 18 petabyte); 300 qubit sẽ cần 2<sup>300</sup> ≈ 2 × 10<sup>90</sup> biên độ — nhiều hơn số nguyên tử ước tính trong vũ trụ quan sát được. Cách mô tả tăng theo hàm mũ này chính là lý do máy tính lượng tử đáng quan tâm.</p>
<div class="note-ct"><p><strong>Nhưng máy lượng tử KHÔNG “thử cùng lúc cả 2<sup>n</sup> đáp án rồi đưa bạn đáp án tốt nhất”.</strong> Cuối cùng bạn phải đo, và phép đo chỉ trả về <em>một</em> xâu n bit, chọn ngẫu nhiên theo bình phương biên độ, phần còn lại của vectơ mất hết. Một thuật toán lượng tử có ích phải sắp xếp biên độ bằng giao thoa sao cho đáp án đúng có biên độ lớn <em>trước khi</em> đo. Điều đó chỉ làm được với các bài toán có cấu trúc đặc biệt (Chương 8–9).</p></div>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — có hợp lệ không?</b> |ψ⟩ = (1/2)|0⟩ + (√3/2)|1⟩.</p>
<p>|1/2|<sup>2</sup> + |√3/2|<sup>2</sup> = 1/4 + 3/4 = <b>1</b> ✓. Đây là trạng thái qubit hợp lệ. 0,6|0⟩ − 0,8|1⟩ cũng vậy (0,36 + 0,64 = 1): biên độ âm là được phép.</p></div>
<div class="callout"><p><b>Ví dụ 2 — chuẩn hoá.</b> Biến v = (1 + i)|0⟩ + |1⟩ thành trạng thái qubit.</p>
<p>Bước 1: ‖v‖<sup>2</sup> = |1 + i|<sup>2</sup> + |1|<sup>2</sup> = 2 + 1 = 3. Bước 2: chia cho √3: <b>|ψ⟩ = ((1 + i)|0⟩ + |1⟩)/√3</b>. Kiểm: 2/3 + 1/3 = 1.</p></div>
<div class="callout"><p><b>Ví dụ 3 — tìm biên độ còn thiếu.</b> Một qubit có α = 0,6 và β thực, dương. Tìm β.</p>
<p>|β|<sup>2</sup> = 1 − 0,36 = 0,64, nên <b>β = 0,8</b>. Nếu cho phép β phức thì mọi β = 0,8 e<sup>iφ</sup> đều thoả — bài sau giải thích pha thêm vào đó có ý nghĩa gì.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Đòi α + β = 1. Điều kiện đúng là |α|<sup>2</sup> + |β|<sup>2</sup> = 1; ví dụ (|0⟩ + |1⟩)/√2 có α + β = √2.</li><li>Hiểu chồng chập là “qubit thật ra đang là 0 hoặc 1, chỉ là ta không biết”. Đó là mô tả một <em>bit ngẫu nhiên</em>; chồng chập giao thoa được, bit ngẫu nhiên thì không.</li><li>Kết luận “n qubit lưu 2<sup>n</sup> bit thông tin đọc ra được”. Đo n qubit chỉ thu được n bit.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Trạng thái qubit: |ψ⟩ = α|0⟩ + β|1⟩, biên độ phức, |α|<sup>2</sup> + |β|<sup>2</sup> = 1.</li><li>Muốn chuẩn hoá, chia cho ‖v‖ = √(Σ|v<sub>k</sub>|<sup>2</sup>).</li><li>n qubit ⇒ 2<sup>n</sup> biên độ; mô phỏng 30 qubit cần 16 GiB, 50 qubit cần khoảng 16 triệu GiB.</li><li>Biên độ giao thoa được; phép đo chỉ cho một kết quả — không có “song song miễn phí”.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://learn.microsoft.com/en-us/azure/quantum/concepts-the-qubit" target="_blank" rel="noopener">Microsoft Learn — Qubit trong điện toán lượng tử</a></li><li><a href="https://en.wikipedia.org/wiki/Qubit" target="_blank" rel="noopener">Wikipedia — Qubit</a></li><li><a href="https://www.youtube.com/watch?v=3-c4xJa7Flk" target="_blank" rel="noopener">Qiskit — Understanding Quantum Information &amp; Computation, Lesson 01: Hệ đơn (Watrous)</a></li><li><a href="https://quantum.country/qcvc" target="_blank" rel="noopener">Quantum computing for the very curious — Phần I: trạng thái của một qubit</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Chuẩn hoá 2|0⟩ − i|1⟩.</li><li>Thanh ghi 10 qubit được mô tả bằng bao nhiêu biên độ phức, và máy mô phỏng độ chính xác kép cần bao nhiêu byte cho chúng?</li><li>(|0⟩ + |1⟩)/2 có phải trạng thái qubit hợp lệ không? Nếu không, sửa lại.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) ‖v‖<sup>2</sup> = 4 + 1 = 5, nên (2|0⟩ − i|1⟩)/√5. 2) 2<sup>10</sup> = 1024 biên độ × 16 byte = 16 384 byte = 16 KiB. 3) Không: 1/4 + 1/4 = 1/2. Phải chia cho √(1/2): (|0⟩ + |1⟩)/√2 = |+⟩.</p></div>`);

const c22 = L('qtc211-ts-2-2',
  '2.2 — Global phase, relative phase and the six cardinal states|||2.2 — Pha toàn cục, pha tương đối và sáu trạng thái cơ bản',
  'Pha toàn cục e^(iγ)|ψ⟩ không quan sát được; pha tương đối (|0⟩ + e^(iφ)|1⟩)/√2 quan sát được; sáu trạng thái |0⟩,|1⟩,|+⟩,|−⟩,|i⟩,|−i⟩ và bảng |⟨a|b⟩|² giữa ba cơ sở Z, X, Y.',
  `<span class="eyebrow">QTC211 · Chapter 2 · Lesson 2.2</span>
<h2>Global phase, relative phase and the six cardinal states</h2>
<p class="lead">Two vectors can describe the same physical state, and two states with identical 0/1 statistics can be completely different. Both facts are about <strong>phase</strong>. Getting this right now saves you from the most common confusion in the whole course.</p>
<h3>🎯 Objectives</h3>
<ul><li>Explain why a global phase e<sup>iγ</sup>|ψ⟩ is physically unobservable.</li><li>Explain why a relative phase between |0⟩ and |1⟩ <em>is</em> observable.</li><li>Know the six cardinal states and the three bases (Z, X, Y) they form.</li><li>Decide whether two given vectors represent the same state.</li></ul>
<h3>📖 Lecture</h3>
<p>Every prediction of quantum mechanics about a state |ψ⟩ is a probability of the form |⟨b|ψ⟩|<sup>2</sup> for some measurement basis vector |b⟩. Multiply the whole state by a phase e<sup>iγ</sup>:</p>
<div class="formula"><span class="lbl">Global phase</span>|⟨b| e<sup>iγ</sup>ψ⟩|<sup>2</sup> = |e<sup>iγ</sup>|<sup>2</sup> |⟨b|ψ⟩|<sup>2</sup> = |⟨b|ψ⟩|<sup>2</sup>    for every |b⟩</div>
<p>No experiment can tell |ψ⟩ from e<sup>iγ</sup>|ψ⟩, so we treat them as the <strong>same state</strong>: −|0⟩ ≡ |0⟩, i|+⟩ ≡ |+⟩. A phase that multiplies <em>one amplitude only</em> is a different story. Compare</p>
<div class="formula"><span class="lbl">Relative phase</span>(|0⟩ + e<sup>iφ</sup>|1⟩)/√2    φ = 0 gives |+⟩,  φ = π gives |−⟩,  φ = π/2 gives |i⟩,  φ = 3π/2 gives |−i⟩</div>
<p>All of these have |α|<sup>2</sup> = |β|<sup>2</sup> = 1/2, so reading them in the {|0⟩, |1⟩} basis gives a fair coin every time. Yet |+⟩ and |−⟩ are <em>orthogonal</em> (⟨+|−⟩ = 0): measured in the {|+⟩, |−⟩} basis, |+⟩ gives “+” with probability 1 and |−⟩ gives “−” with probability 1. The relative phase φ is physically real; it just does not show up in one particular basis.</p>
<p><strong>The six cardinal states</strong> form three orthonormal bases, named after the Pauli matrix whose eigenvectors they are:</p>
<ul><li><strong>Z basis</strong> (computational): |0⟩, |1⟩.</li><li><strong>X basis</strong> (Hadamard): |+⟩ = (|0⟩ + |1⟩)/√2, |−⟩ = (|0⟩ − |1⟩)/√2.</li><li><strong>Y basis</strong>: |i⟩ = (|0⟩ + i|1⟩)/√2, |−i⟩ = (|0⟩ − i|1⟩)/√2.</li></ul>
<p>Any state of one basis has overlap |⟨a|b⟩|<sup>2</sup> = 1/2 with both states of each other basis: knowing the answer in one basis tells you nothing about the others. Such bases are called <strong>mutually unbiased</strong>, and Chapter 7 uses exactly this property to build the BB84 key-distribution protocol.</p>
<pre><code class="language-python">import numpy as np
s = 1 / np.sqrt(2)
states = {"0": [1, 0], "1": [0, 1], "+": [s, s], "-": [s, -s], "i": [s, 1j * s], "-i": [s, -1j * s]}
names = list(states)
print("     " + "".join(f"{n:&gt;6}" for n in names))
for a in names:
    row = [abs(np.vdot(states[a], states[b])) ** 2 for b in names]
    print(f"{a:&gt;4} " + "".join(f"{p:6.2f}" for p in row))</code></pre>
<div class="out">          0     1     +     -     i    -i
   0   1.00  0.00  0.50  0.50  0.50  0.50
   1   0.00  1.00  0.50  0.50  0.50  0.50
   +   0.50  0.50  1.00  0.00  0.50  0.50
   -   0.50  0.50  0.00  1.00  0.50  0.50
   i   0.50  0.50  0.50  0.50  1.00  0.00
  -i   0.50  0.50  0.50  0.50  0.00  1.00</div>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — same state?</b> Is (i|0⟩ − |1⟩)/√2 one of the six cardinal states?</p>
<p>Factor out the first amplitude: i|0⟩ − |1⟩ = i(|0⟩ + i|1⟩), because i · i = −1. So the vector is <b>i|i⟩</b>, which is the state |i⟩ with a global phase i. Physically it <em>is</em> |i⟩.</p></div>
<div class="callout"><p><b>Example 2 — different states.</b> |i⟩ = (|0⟩ + i|1⟩)/√2 and |−i⟩ = (|0⟩ − i|1⟩)/√2.</p>
<p>The ratio β/α is i for the first and −i for the second; no single factor e<sup>iγ</sup> turns one into the other. In fact ⟨i|−i⟩ = (1 + (−i)(−i))/2 = (1 − 1)/2 = 0: they are orthogonal, the two most distinguishable states there are. <b>Rule:</b> two vectors are the same state iff one is a phase times the other, i.e. iff |⟨φ|ψ⟩| = 1.</p></div>
<div class="callout"><p><b>Example 3 — a minus sign.</b> (−|0⟩ + |1⟩)/√2 = −(|0⟩ − |1⟩)/√2 = <b>−|−⟩ ≡ |−⟩</b>. The overall sign is a global phase e<sup>iπ</sup>; the relative sign between the two amplitudes is what makes it |−⟩ and not |+⟩.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Dropping a minus sign “because it does not change probabilities”. Only an overall sign may be dropped; |0⟩ + |1⟩ and |0⟩ − |1⟩ are orthogonal states.</li><li>Removing a global phase from part of a calculation and not from the rest. Inside a sum such as |a⟩ + |b⟩, a phase on |b⟩ alone is a <em>relative</em> phase.</li><li>Thinking |+⟩ “is half |0⟩ and half |1⟩” and therefore equal to a random bit. A random bit gives 50/50 in <em>every</em> basis; |+⟩ gives a certain result in the X basis.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Global phase: e<sup>iγ</sup>|ψ⟩ ≡ |ψ⟩ — unobservable.</li><li>Relative phase φ in (|0⟩ + e<sup>iφ</sup>|1⟩)/√2 is observable in the X and Y bases.</li><li>Six cardinal states: |0⟩, |1⟩ (Z), |+⟩, |−⟩ (X), |i⟩, |−i⟩ (Y).</li><li>The Z, X, Y bases are mutually unbiased: cross overlaps are all 1/2.</li><li>Same state ⇔ |⟨φ|ψ⟩| = 1.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://github.com/Qiskit/documentation/blob/main/learning/courses/basics-of-quantum-information/single-systems/quantum-information.ipynb" target="_blank" rel="noopener">IBM Quantum Learning (Watrous) — Single systems: quantum information (source notebook)</a></li><li><a href="https://en.wikipedia.org/wiki/Quantum_state" target="_blank" rel="noopener">Wikipedia — Quantum state</a></li><li><a href="https://en.wikipedia.org/wiki/Mutually_unbiased_bases" target="_blank" rel="noopener">Wikipedia — Mutually unbiased bases</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Show that e<sup>iπ/3</sup>|−⟩ and |−⟩ give the same probabilities when measured in the X basis.</li><li>Compute |⟨+|i⟩|<sup>2</sup>.</li><li>Which cardinal state is (|1⟩ − i|0⟩)/√2, up to global phase?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) ⟨+|e<sup>iπ/3</sup>−⟩ = e<sup>iπ/3</sup>⟨+|−⟩ = 0 and ⟨−|e<sup>iπ/3</sup>−⟩ = e<sup>iπ/3</sup>, whose squared modulus is 1 — the same 0 and 1 as for |−⟩. 2) ⟨+|i⟩ = (1 + i)/2, so |⟨+|i⟩|<sup>2</sup> = 2/4 = <b>1/2</b>. 3) −i|0⟩ + |1⟩ = −i(|0⟩ + i|1⟩) (since −i · i = 1), so it is −i|i⟩ ≡ <b>|i⟩</b>.</p></div>`,
  `<span class="eyebrow">QTC211 · Chương 2 · Bài 2.2</span>
<h2>Pha toàn cục, pha tương đối và sáu trạng thái cơ bản</h2>
<p class="lead">Hai vectơ khác nhau có thể mô tả cùng một trạng thái vật lý, và hai trạng thái có thống kê 0/1 giống hệt nhau vẫn có thể khác nhau hoàn toàn. Cả hai điều đều liên quan đến <strong>pha</strong>. Nắm chắc bây giờ sẽ giúp bạn tránh nhầm lẫn phổ biến nhất của cả môn.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải thích vì sao pha toàn cục e<sup>iγ</sup>|ψ⟩ không quan sát được về mặt vật lý.</li><li>Giải thích vì sao pha tương đối giữa |0⟩ và |1⟩ <em>lại</em> quan sát được.</li><li>Thuộc sáu trạng thái cơ bản và ba cơ sở (Z, X, Y) mà chúng tạo thành.</li><li>Quyết định hai vectơ cho trước có biểu diễn cùng một trạng thái hay không.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Mọi dự đoán của cơ học lượng tử về trạng thái |ψ⟩ đều là xác suất dạng |⟨b|ψ⟩|<sup>2</sup> với một vectơ cơ sở đo |b⟩ nào đó. Nhân cả trạng thái với một pha e<sup>iγ</sup>:</p>
<div class="formula"><span class="lbl">Pha toàn cục</span>|⟨b| e<sup>iγ</sup>ψ⟩|<sup>2</sup> = |e<sup>iγ</sup>|<sup>2</sup> |⟨b|ψ⟩|<sup>2</sup> = |⟨b|ψ⟩|<sup>2</sup>    với mọi |b⟩</div>
<p>Không thí nghiệm nào phân biệt được |ψ⟩ với e<sup>iγ</sup>|ψ⟩, nên ta coi chúng là <strong>cùng một trạng thái</strong>: −|0⟩ ≡ |0⟩, i|+⟩ ≡ |+⟩. Một pha chỉ nhân vào <em>một biên độ</em> thì khác hẳn. So sánh</p>
<div class="formula"><span class="lbl">Pha tương đối</span>(|0⟩ + e<sup>iφ</sup>|1⟩)/√2    φ = 0 cho |+⟩,  φ = π cho |−⟩,  φ = π/2 cho |i⟩,  φ = 3π/2 cho |−i⟩</div>
<p>Tất cả có |α|<sup>2</sup> = |β|<sup>2</sup> = 1/2, nên đọc trong cơ sở {|0⟩, |1⟩} lần nào cũng như tung đồng xu cân đối. Thế nhưng |+⟩ và |−⟩ <em>trực giao</em> (⟨+|−⟩ = 0): đo trong cơ sở {|+⟩, |−⟩}, |+⟩ cho “+” với xác suất 1 còn |−⟩ cho “−” với xác suất 1. Pha tương đối φ là có thật về mặt vật lý; chỉ là nó không lộ ra trong một cơ sở cụ thể.</p>
<p><strong>Sáu trạng thái cơ bản</strong> tạo thành ba cơ sở trực chuẩn, đặt tên theo ma trận Pauli nhận chúng làm vectơ riêng:</p>
<ul><li><strong>Cơ sở Z</strong> (cơ sở tính toán): |0⟩, |1⟩.</li><li><strong>Cơ sở X</strong> (Hadamard): |+⟩ = (|0⟩ + |1⟩)/√2, |−⟩ = (|0⟩ − |1⟩)/√2.</li><li><strong>Cơ sở Y</strong>: |i⟩ = (|0⟩ + i|1⟩)/√2, |−i⟩ = (|0⟩ − i|1⟩)/√2.</li></ul>
<p>Mỗi trạng thái của một cơ sở có độ chồng |⟨a|b⟩|<sup>2</sup> = 1/2 với cả hai trạng thái của mỗi cơ sở còn lại: biết đáp án trong cơ sở này chẳng cho biết gì về cơ sở kia. Các cơ sở như vậy gọi là <strong>không thiên lệch lẫn nhau (mutually unbiased)</strong>, và Chương 7 dùng đúng tính chất này để dựng giao thức phân phối khoá BB84.</p>
<pre><code class="language-python">import numpy as np
s = 1 / np.sqrt(2)
states = {"0": [1, 0], "1": [0, 1], "+": [s, s], "-": [s, -s], "i": [s, 1j * s], "-i": [s, -1j * s]}
names = list(states)
print("     " + "".join(f"{n:&gt;6}" for n in names))
for a in names:
    row = [abs(np.vdot(states[a], states[b])) ** 2 for b in names]
    print(f"{a:&gt;4} " + "".join(f"{p:6.2f}" for p in row))</code></pre>
<div class="out">          0     1     +     -     i    -i
   0   1.00  0.00  0.50  0.50  0.50  0.50
   1   0.00  1.00  0.50  0.50  0.50  0.50
   +   0.50  0.50  1.00  0.00  0.50  0.50
   -   0.50  0.50  0.00  1.00  0.50  0.50
   i   0.50  0.50  0.50  0.50  1.00  0.00
  -i   0.50  0.50  0.50  0.50  0.00  1.00</div>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — cùng trạng thái?</b> (i|0⟩ − |1⟩)/√2 có phải một trong sáu trạng thái cơ bản không?</p>
<p>Rút biên độ đầu ra ngoài: i|0⟩ − |1⟩ = i(|0⟩ + i|1⟩), vì i · i = −1. Vậy vectơ là <b>i|i⟩</b>, tức trạng thái |i⟩ kèm pha toàn cục i. Về vật lý nó <em>chính là</em> |i⟩.</p></div>
<div class="callout"><p><b>Ví dụ 2 — hai trạng thái khác nhau.</b> |i⟩ = (|0⟩ + i|1⟩)/√2 và |−i⟩ = (|0⟩ − i|1⟩)/√2.</p>
<p>Tỉ số β/α bằng i ở vectơ thứ nhất và −i ở vectơ thứ hai; không một thừa số e<sup>iγ</sup> nào biến vectơ này thành vectơ kia. Thực ra ⟨i|−i⟩ = (1 + (−i)(−i))/2 = (1 − 1)/2 = 0: chúng trực giao, cặp trạng thái dễ phân biệt nhất có thể. <b>Quy tắc:</b> hai vectơ là cùng trạng thái khi và chỉ khi vectơ này bằng một pha nhân vectơ kia, tức |⟨φ|ψ⟩| = 1.</p></div>
<div class="callout"><p><b>Ví dụ 3 — một dấu trừ.</b> (−|0⟩ + |1⟩)/√2 = −(|0⟩ − |1⟩)/√2 = <b>−|−⟩ ≡ |−⟩</b>. Dấu chung là pha toàn cục e<sup>iπ</sup>; dấu tương đối giữa hai biên độ mới là thứ làm nó là |−⟩ chứ không phải |+⟩.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Bỏ dấu trừ “vì nó không đổi xác suất”. Chỉ được bỏ dấu chung của cả vectơ; |0⟩ + |1⟩ và |0⟩ − |1⟩ là hai trạng thái trực giao.</li><li>Bỏ pha toàn cục ở một phần phép tính mà không bỏ ở phần còn lại. Trong một tổng |a⟩ + |b⟩, pha chỉ đặt trên |b⟩ là pha <em>tương đối</em>.</li><li>Nghĩ |+⟩ “nửa |0⟩ nửa |1⟩” nên giống một bit ngẫu nhiên. Bit ngẫu nhiên cho 50/50 trong <em>mọi</em> cơ sở; |+⟩ cho kết quả chắc chắn trong cơ sở X.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Pha toàn cục: e<sup>iγ</sup>|ψ⟩ ≡ |ψ⟩ — không quan sát được.</li><li>Pha tương đối φ trong (|0⟩ + e<sup>iφ</sup>|1⟩)/√2 quan sát được trong cơ sở X và Y.</li><li>Sáu trạng thái cơ bản: |0⟩, |1⟩ (Z), |+⟩, |−⟩ (X), |i⟩, |−i⟩ (Y).</li><li>Ba cơ sở Z, X, Y không thiên lệch lẫn nhau: mọi độ chồng chéo đều bằng 1/2.</li><li>Cùng trạng thái ⇔ |⟨φ|ψ⟩| = 1.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://github.com/Qiskit/documentation/blob/main/learning/courses/basics-of-quantum-information/single-systems/quantum-information.ipynb" target="_blank" rel="noopener">IBM Quantum Learning (Watrous) — Hệ đơn: thông tin lượng tử (notebook gốc)</a></li><li><a href="https://en.wikipedia.org/wiki/Quantum_state" target="_blank" rel="noopener">Wikipedia — Trạng thái lượng tử</a></li><li><a href="https://en.wikipedia.org/wiki/Mutually_unbiased_bases" target="_blank" rel="noopener">Wikipedia — Các cơ sở không thiên lệch lẫn nhau</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Chứng minh e<sup>iπ/3</sup>|−⟩ và |−⟩ cho cùng xác suất khi đo trong cơ sở X.</li><li>Tính |⟨+|i⟩|<sup>2</sup>.</li><li>(|1⟩ − i|0⟩)/√2 là trạng thái cơ bản nào, sai khác pha toàn cục?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) ⟨+|e<sup>iπ/3</sup>−⟩ = e<sup>iπ/3</sup>⟨+|−⟩ = 0 và ⟨−|e<sup>iπ/3</sup>−⟩ = e<sup>iπ/3</sup>, có bình phương mô-đun bằng 1 — đúng 0 và 1 như với |−⟩. 2) ⟨+|i⟩ = (1 + i)/2, nên |⟨+|i⟩|<sup>2</sup> = 2/4 = <b>1/2</b>. 3) −i|0⟩ + |1⟩ = −i(|0⟩ + i|1⟩) (vì −i · i = 1), nên đó là −i|i⟩ ≡ <b>|i⟩</b>.</p></div>`);

const c23 = L('qtc211-ts-2-3',
  '2.3 — The Bloch sphere: picturing a qubit state|||2.3 — Mặt cầu Bloch: hình dung trạng thái một qubit',
  'Tham số hoá cos(θ/2)|0⟩ + e^(iφ) sin(θ/2)|1⟩, vectơ Bloch (sinθcosφ, sinθsinφ, cosθ) = (2Re(α*β), 2Im(α*β), |α|²−|β|²), sáu trạng thái trên trục, trạng thái trực giao đối xứng tâm, hàm numpy tính vectơ Bloch.',
  `<span class="eyebrow">QTC211 · Chapter 2 · Lesson 2.3</span>
<h2>The Bloch sphere: picturing a qubit state</h2>
<p class="lead">Two complex amplitudes are four real numbers. Normalisation removes one and the unobservable global phase removes another, so a qubit state is described by just <strong>two angles</strong> — a point on a sphere. That sphere, named after Felix Bloch, is how everyone visualises single-qubit states and gates.</p>
<h3>🎯 Objectives</h3>
<ul><li>Write any qubit state as cos(θ/2)|0⟩ + e<sup>iφ</sup> sin(θ/2)|1⟩.</li><li>Compute the Bloch vector of a state from its angles or from its amplitudes.</li><li>Place the six cardinal states on the sphere and recognise that orthogonal states are antipodal.</li><li>Use a short numpy function to compute Bloch vectors.</li></ul>
<h3>📖 Lecture</h3>
<p>Start from |ψ⟩ = α|0⟩ + β|1⟩. Multiply by a global phase to make α real and non-negative (this does not change the state). Then |α|<sup>2</sup> + |β|<sup>2</sup> = 1 lets us write α = cos(θ/2) and β = e<sup>iφ</sup> sin(θ/2):</p>
<div class="formula"><span class="lbl">Bloch parametrisation</span>|ψ⟩ = cos(θ/2)|0⟩ + e<sup>iφ</sup> sin(θ/2)|1⟩,    0 ≤ θ ≤ π,   0 ≤ φ &lt; 2π</div>
<p>Read θ as the <strong>polar angle</strong> (measured from the north pole) and φ as the <strong>azimuth</strong> (the relative phase, measured around the equator from the +x axis). The point on the unit sphere is the <strong>Bloch vector</strong>, which can be computed directly from the amplitudes, without first finding the angles:</p>
<div class="formula"><span class="lbl">Bloch vector</span>r = (sin θ cos φ,  sin θ sin φ,  cos θ) = (2 Re(α*β),  2 Im(α*β),  |α|<sup>2</sup> − |β|<sup>2</sup>)</div>
<p>The amplitude form also works when α is not real, because α*β does not change under a global phase. Landmarks: |0⟩ is the <strong>north pole</strong> (0, 0, 1) and |1⟩ the <strong>south pole</strong> (0, 0, −1); the equator holds the equal superpositions, with |+⟩ at (1, 0, 0), |i⟩ at (0, 1, 0), |−⟩ at (−1, 0, 0), |−i⟩ at (0, −1, 0). The z-coordinate tells the 0/1 bias; the angle around the equator is the relative phase.</p>
<p>Notice the half-angle θ/2. It means that <strong>orthogonal states are antipodal</strong> (θ and π − θ, φ and φ + π), not perpendicular: |0⟩ and |1⟩ are 90° apart as vectors in ℂ<sup>2</sup> but 180° apart on the sphere. More generally, for states with Bloch vectors r and s:</p>
<div class="formula"><span class="lbl">Overlap from Bloch vectors</span>|⟨ψ|χ⟩|<sup>2</sup> = (1 + r · s)/2</div>
<p>In Chapter 4 you will see that every single-qubit gate is a <strong>rotation</strong> of this sphere — the reason the picture is so useful. (The Bloch sphere is only for <em>one</em> qubit; there is no such simple picture for entangled states of several qubits.)</p>
<pre><code class="language-python">import numpy as np

def bloch(psi):
    """Bloch vector (x, y, z) of a single-qubit state alpha|0&gt; + beta|1&gt;."""
    a, b = np.asarray(psi, dtype=complex) / np.linalg.norm(psi)
    ab = np.conj(a) * b
    return np.round([2 * ab.real, 2 * ab.imag, abs(a) ** 2 - abs(b) ** 2], 4)

def state(theta, phi):
    return [np.cos(theta / 2), np.exp(1j * phi) * np.sin(theta / 2)]

print(bloch([1, 0]), bloch([1, 1]), bloch([1, 1j]))     # |0&gt;, |+&gt;, |i&gt;
print(bloch(state(np.pi / 3, np.pi / 2)))               # Example 1
print(bloch([1, np.exp(1j * np.pi / 4)]))               # Example 2
print(bloch([1j, 1]))                                   # Example 3</code></pre>
<div class="out">[0. 0. 1.] [1. 0. 0.] [0. 1. 0.]
[0.    0.866 0.5  ]
[0.7071 0.7071 0.    ]
[ 0. -1.  0.]</div>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — from angles to state and vector.</b> θ = π/3, φ = π/2.</p>
<p>State: cos(π/6)|0⟩ + e<sup>iπ/2</sup> sin(π/6)|1⟩ = <b>(√3/2)|0⟩ + (i/2)|1⟩</b>. Vector: (sin(π/3) cos(π/2), sin(π/3) sin(π/2), cos(π/3)) = <b>(0, √3/2, 1/2) ≈ (0, 0.866, 0.5)</b> — in the y–z plane, 60° from the north pole.</p></div>
<div class="callout"><p><b>Example 2 — from state to angles.</b> |ψ⟩ = (|0⟩ + e<sup>iπ/4</sup>|1⟩)/√2.</p>
<p>α = 1/√2 = cos(θ/2) ⇒ θ/2 = π/4 ⇒ θ = π/2 (on the equator). The relative phase is φ = π/4. Vector: (cos(π/4), sin(π/4), 0) ≈ <b>(0.7071, 0.7071, 0)</b>, halfway between |+⟩ and |i⟩.</p></div>
<div class="callout"><p><b>Example 3 — α not real.</b> |ψ⟩ = (i|0⟩ + |1⟩)/√2.</p>
<p>α*β = (−i/√2)(1/√2) = −i/2. So x = 2 Re(−i/2) = 0, y = 2 Im(−i/2) = −1, z = 1/2 − 1/2 = 0: <b>(0, −1, 0)</b>, the point of |−i⟩. Indeed i|0⟩ + |1⟩ = i(|0⟩ − i|1⟩), a global phase times |−i⟩.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using θ instead of θ/2 in the amplitudes: cos θ|0⟩ + sin θ|1⟩ puts |1⟩ at θ = π/2 (the equator) — wrong.</li><li>Expecting orthogonal states to be at right angles on the sphere. They are opposite points.</li><li>Forgetting the conjugate in α*β: with αβ instead, Example 3 would give the wrong sign of y.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Any qubit state = cos(θ/2)|0⟩ + e<sup>iφ</sup> sin(θ/2)|1⟩ up to global phase.</li><li>Bloch vector r = (sin θ cos φ, sin θ sin φ, cos θ) = (2Re α*β, 2Im α*β, |α|<sup>2</sup> − |β|<sup>2</sup>).</li><li>Poles: |0⟩, |1⟩; equator: |±⟩ on the x-axis, |±i⟩ on the y-axis.</li><li>Orthogonal ⇔ antipodal; |⟨ψ|χ⟩|<sup>2</sup> = (1 + r·s)/2.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Bloch_sphere" target="_blank" rel="noopener">Wikipedia — Bloch sphere</a></li><li><a href="https://algassert.com/quirk" target="_blank" rel="noopener">Quirk — drop a “Bloch sphere” display on a wire and watch it move</a></li><li><a href="https://www.youtube.com/watch?v=CeK9ry8G8HQ" target="_blank" rel="noopener">Qiskit — Understanding Quantum Information &amp; Computation, Lesson 09: Density Matrices (includes the Bloch sphere)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Find θ, φ and the Bloch vector of (√3/2)|0⟩ + (1/2)|1⟩.</li><li>Which state has Bloch vector (−1, 0, 0)? Which has (0, 0, −1)?</li><li>Use the overlap formula to compute |⟨0|+⟩|<sup>2</sup>.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) cos(θ/2) = √3/2 ⇒ θ = π/3; φ = 0. Vector (sin(π/3), 0, cos(π/3)) = (√3/2, 0, 1/2) ≈ (0.866, 0, 0.5). 2) (−1, 0, 0) is |−⟩; (0, 0, −1) is |1⟩. 3) r = (0, 0, 1), s = (1, 0, 0), r·s = 0, so (1 + 0)/2 = 1/2 — matches ⟨0|+⟩ = 1/√2.</p></div>`,
  `<span class="eyebrow">QTC211 · Chương 2 · Bài 2.3</span>
<h2>Mặt cầu Bloch: hình dung trạng thái một qubit</h2>
<p class="lead">Hai biên độ phức là bốn số thực. Điều kiện chuẩn hoá bỏ đi một số, pha toàn cục không quan sát được bỏ thêm một số, nên trạng thái một qubit chỉ cần <strong>hai góc</strong> — một điểm trên mặt cầu. Mặt cầu đó mang tên Felix Bloch, và mọi người đều dùng nó để hình dung trạng thái cũng như cổng một qubit.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Viết mọi trạng thái qubit dưới dạng cos(θ/2)|0⟩ + e<sup>iφ</sup> sin(θ/2)|1⟩.</li><li>Tính vectơ Bloch của một trạng thái từ hai góc hoặc từ hai biên độ.</li><li>Đặt sáu trạng thái cơ bản lên mặt cầu và nhận ra hai trạng thái trực giao nằm đối xứng tâm.</li><li>Dùng một hàm numpy ngắn để tính vectơ Bloch.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Bắt đầu từ |ψ⟩ = α|0⟩ + β|1⟩. Nhân với một pha toàn cục để α thành số thực không âm (không đổi trạng thái). Khi đó |α|<sup>2</sup> + |β|<sup>2</sup> = 1 cho phép viết α = cos(θ/2) và β = e<sup>iφ</sup> sin(θ/2):</p>
<div class="formula"><span class="lbl">Tham số hoá Bloch</span>|ψ⟩ = cos(θ/2)|0⟩ + e<sup>iφ</sup> sin(θ/2)|1⟩,    0 ≤ θ ≤ π,   0 ≤ φ &lt; 2π</div>
<p>Đọc θ là <strong>góc cực</strong> (đo từ cực bắc) và φ là <strong>góc phương vị</strong> (chính là pha tương đối, đo quanh xích đạo kể từ trục +x). Điểm trên mặt cầu đơn vị là <strong>vectơ Bloch</strong>, tính thẳng được từ biên độ mà không cần tìm góc trước:</p>
<div class="formula"><span class="lbl">Vectơ Bloch</span>r = (sin θ cos φ,  sin θ sin φ,  cos θ) = (2 Re(α*β),  2 Im(α*β),  |α|<sup>2</sup> − |β|<sup>2</sup>)</div>
<p>Dạng theo biên độ dùng được cả khi α không thực, vì α*β không đổi khi nhân pha toàn cục. Các mốc: |0⟩ là <strong>cực bắc</strong> (0, 0, 1), |1⟩ là <strong>cực nam</strong> (0, 0, −1); xích đạo chứa các chồng chập đều, với |+⟩ ở (1, 0, 0), |i⟩ ở (0, 1, 0), |−⟩ ở (−1, 0, 0), |−i⟩ ở (0, −1, 0). Toạ độ z cho biết độ lệch giữa 0 và 1; góc quanh xích đạo là pha tương đối.</p>
<p>Chú ý nửa góc θ/2. Nó có nghĩa là <strong>hai trạng thái trực giao nằm đối xứng tâm</strong> (θ và π − θ, φ và φ + π), chứ không vuông góc: |0⟩ và |1⟩ lệch nhau 90° như vectơ trong ℂ<sup>2</sup> nhưng lệch 180° trên mặt cầu. Tổng quát, với hai trạng thái có vectơ Bloch r và s:</p>
<div class="formula"><span class="lbl">Độ chồng theo vectơ Bloch</span>|⟨ψ|χ⟩|<sup>2</sup> = (1 + r · s)/2</div>
<p>Ở Chương 4 bạn sẽ thấy mọi cổng một qubit là một <strong>phép quay</strong> của mặt cầu này — lý do hình ảnh này hữu ích đến vậy. (Mặt cầu Bloch chỉ dành cho <em>một</em> qubit; trạng thái vướng víu của nhiều qubit không có hình ảnh đơn giản như thế.)</p>
<pre><code class="language-python">import numpy as np

def bloch(psi):
    """Vectơ Bloch (x, y, z) của trạng thái một qubit alpha|0&gt; + beta|1&gt;."""
    a, b = np.asarray(psi, dtype=complex) / np.linalg.norm(psi)
    ab = np.conj(a) * b
    return np.round([2 * ab.real, 2 * ab.imag, abs(a) ** 2 - abs(b) ** 2], 4)

def state(theta, phi):
    return [np.cos(theta / 2), np.exp(1j * phi) * np.sin(theta / 2)]

print(bloch([1, 0]), bloch([1, 1]), bloch([1, 1j]))     # |0&gt;, |+&gt;, |i&gt;
print(bloch(state(np.pi / 3, np.pi / 2)))               # Ví dụ 1
print(bloch([1, np.exp(1j * np.pi / 4)]))               # Ví dụ 2
print(bloch([1j, 1]))                                   # Ví dụ 3</code></pre>
<div class="out">[0. 0. 1.] [1. 0. 0.] [0. 1. 0.]
[0.    0.866 0.5  ]
[0.7071 0.7071 0.    ]
[ 0. -1.  0.]</div>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — từ góc ra trạng thái và vectơ.</b> θ = π/3, φ = π/2.</p>
<p>Trạng thái: cos(π/6)|0⟩ + e<sup>iπ/2</sup> sin(π/6)|1⟩ = <b>(√3/2)|0⟩ + (i/2)|1⟩</b>. Vectơ: (sin(π/3) cos(π/2), sin(π/3) sin(π/2), cos(π/3)) = <b>(0, √3/2, 1/2) ≈ (0; 0,866; 0,5)</b> — nằm trong mặt phẳng y–z, cách cực bắc 60°.</p></div>
<div class="callout"><p><b>Ví dụ 2 — từ trạng thái ra góc.</b> |ψ⟩ = (|0⟩ + e<sup>iπ/4</sup>|1⟩)/√2.</p>
<p>α = 1/√2 = cos(θ/2) ⇒ θ/2 = π/4 ⇒ θ = π/2 (trên xích đạo). Pha tương đối φ = π/4. Vectơ: (cos(π/4), sin(π/4), 0) ≈ <b>(0,7071; 0,7071; 0)</b>, ở giữa |+⟩ và |i⟩.</p></div>
<div class="callout"><p><b>Ví dụ 3 — α không thực.</b> |ψ⟩ = (i|0⟩ + |1⟩)/√2.</p>
<p>α*β = (−i/√2)(1/√2) = −i/2. Vậy x = 2 Re(−i/2) = 0, y = 2 Im(−i/2) = −1, z = 1/2 − 1/2 = 0: <b>(0, −1, 0)</b>, đúng điểm của |−i⟩. Quả thật i|0⟩ + |1⟩ = i(|0⟩ − i|1⟩), tức một pha toàn cục nhân |−i⟩.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng θ thay cho θ/2 trong biên độ: cos θ|0⟩ + sin θ|1⟩ đặt |1⟩ ở θ = π/2 (xích đạo) — sai.</li><li>Tưởng hai trạng thái trực giao vuông góc nhau trên mặt cầu. Chúng là hai điểm đối nhau.</li><li>Quên liên hợp trong α*β: nếu dùng αβ, Ví dụ 3 sẽ ra sai dấu của y.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Mọi trạng thái qubit = cos(θ/2)|0⟩ + e<sup>iφ</sup> sin(θ/2)|1⟩, sai khác pha toàn cục.</li><li>Vectơ Bloch r = (sin θ cos φ, sin θ sin φ, cos θ) = (2Re α*β, 2Im α*β, |α|<sup>2</sup> − |β|<sup>2</sup>).</li><li>Hai cực: |0⟩, |1⟩; xích đạo: |±⟩ trên trục x, |±i⟩ trên trục y.</li><li>Trực giao ⇔ đối xứng tâm; |⟨ψ|χ⟩|<sup>2</sup> = (1 + r·s)/2.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Bloch_sphere" target="_blank" rel="noopener">Wikipedia — Mặt cầu Bloch</a></li><li><a href="https://algassert.com/quirk" target="_blank" rel="noopener">Quirk — thả ô hiển thị “Bloch sphere” lên một dây và xem nó di chuyển</a></li><li><a href="https://www.youtube.com/watch?v=CeK9ry8G8HQ" target="_blank" rel="noopener">Qiskit — Understanding Quantum Information &amp; Computation, Lesson 09: Ma trận mật độ (có phần mặt cầu Bloch)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tìm θ, φ và vectơ Bloch của (√3/2)|0⟩ + (1/2)|1⟩.</li><li>Trạng thái nào có vectơ Bloch (−1, 0, 0)? Trạng thái nào có (0, 0, −1)?</li><li>Dùng công thức độ chồng để tính |⟨0|+⟩|<sup>2</sup>.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) cos(θ/2) = √3/2 ⇒ θ = π/3; φ = 0. Vectơ (sin(π/3), 0, cos(π/3)) = (√3/2, 0, 1/2) ≈ (0,866; 0; 0,5). 2) (−1, 0, 0) là |−⟩; (0, 0, −1) là |1⟩. 3) r = (0, 0, 1), s = (1, 0, 0), r·s = 0, nên (1 + 0)/2 = 1/2 — khớp với ⟨0|+⟩ = 1/√2.</p></div>`);

const q2 = QZ(2, 'Quiz — Chapter 2: Qubits, phase and the Bloch sphere|||Quiz — Chương 2: Qubit, pha và mặt cầu Bloch', 'Kiểm tra chương 2: chuẩn hoá trạng thái, số biên độ của n qubit, pha toàn cục và pha tương đối, sáu trạng thái cơ bản, vectơ Bloch.', [
  Q('q1', 'Which condition must the amplitudes of α|0⟩ + β|1⟩ satisfy?|||Biên độ của α|0⟩ + β|1⟩ phải thoả điều kiện nào?',
    ['α + β = 1|||α + β = 1', '|α| + |β| = 1||||α| + |β| = 1', '|α|² + |β|² = 1||||α|² + |β|² = 1', 'α² + β² = 1 (without moduli)|||α² + β² = 1 (không lấy mô-đun)'], 2,
    'Normalisation is on squared moduli; amplitudes may be complex.|||Chuẩn hoá đặt trên bình phương mô-đun; biên độ có thể phức.'),
  Q('q2', 'The normalised form of (1 + i)|0⟩ + |1⟩ is|||Dạng đã chuẩn hoá của (1 + i)|0⟩ + |1⟩ là',
    ['((1 + i)|0⟩ + |1⟩)/√3|||((1 + i)|0⟩ + |1⟩)/√3', '((1 + i)|0⟩ + |1⟩)/√2|||((1 + i)|0⟩ + |1⟩)/√2', '((1 + i)|0⟩ + |1⟩)/3|||((1 + i)|0⟩ + |1⟩)/3', '((1 + i)|0⟩ + |1⟩)/2|||((1 + i)|0⟩ + |1⟩)/2'], 0,
    '|1 + i|² + 1 = 2 + 1 = 3, so divide by √3.|||Vì |1 + i|² + 1 = 2 + 1 = 3 nên chia cho √3.'),
  Q('q3', 'How many complex amplitudes describe a general 20-qubit state?|||Trạng thái tổng quát của 20 qubit cần bao nhiêu biên độ phức?',
    ['20|||20', '40|||40', '400|||400', '1 048 576|||1 048 576'], 3,
    '2²⁰ = 1 048 576 (16 MiB at 16 bytes each).|||2²⁰ = 1 048 576 (16 MiB nếu mỗi số 16 byte).'),
  Q('q4', 'Measuring an n-qubit register once gives|||Đo một thanh ghi n qubit một lần cho ra',
    ['all 2ⁿ amplitudes|||cả 2ⁿ biên độ', 'one n-bit string|||một xâu n bit', 'the best answer to the problem|||đáp án tốt nhất của bài toán', 'n complex numbers|||n số phức'], 1,
    'One random outcome; quantum algorithms must use interference to make the right one likely.|||Một kết quả ngẫu nhiên; thuật toán lượng tử phải dùng giao thoa để đáp án đúng có xác suất cao.'),
  Q('q5', 'Which pair represents the SAME physical state?|||Cặp nào biểu diễn CÙNG một trạng thái vật lý?',
    ['|+⟩ and |−⟩||||+⟩ và |−⟩', '|i⟩ and |−i⟩||||i⟩ và |−i⟩', '|0⟩ and −|0⟩||||0⟩ và −|0⟩', '|0⟩ and |1⟩||||0⟩ và |1⟩'], 2,
    '−|0⟩ = e^(iπ)|0⟩ differs only by a global phase.|||−|0⟩ = e^(iπ)|0⟩ chỉ khác một pha toàn cục.'),
  Q('q6', '|+⟩ and |−⟩ measured in the {|0⟩, |1⟩} basis give|||Đo |+⟩ và |−⟩ trong cơ sở {|0⟩, |1⟩} cho',
    ['the same 50/50 statistics|||cùng thống kê 50/50', 'opposite certain results|||hai kết quả chắc chắn ngược nhau', '0 for |+⟩ and 1 for |−⟩ always|||luôn 0 với |+⟩ và 1 với |−⟩', 'undefined results|||kết quả không xác định'], 0,
    'The relative phase is invisible in the Z basis but visible in the X basis.|||Pha tương đối không lộ ra trong cơ sở Z nhưng lộ ra trong cơ sở X.'),
  Q('q7', '(i|0⟩ − |1⟩)/√2 equals, up to global phase,|||(i|0⟩ − |1⟩)/√2 bằng, sai khác pha toàn cục,',
    ['|−⟩||||−⟩', '|−i⟩||||−i⟩', '|+⟩||||+⟩', '|i⟩||||i⟩'], 3,
    'i|0⟩ − |1⟩ = i(|0⟩ + i|1⟩).|||i|0⟩ − |1⟩ = i(|0⟩ + i|1⟩).'),
  Q('q8', 'The Bloch vector of |−⟩ is|||Vectơ Bloch của |−⟩ là',
    ['(0, 0, −1)|||(0, 0, −1)', '(−1, 0, 0)|||(−1, 0, 0)', '(0, −1, 0)|||(0, −1, 0)', '(1, 0, 0)|||(1, 0, 0)'], 1,
    'θ = π/2, φ = π ⇒ (cos π, sin π, 0) = (−1, 0, 0).|||θ = π/2, φ = π ⇒ (cos π, sin π, 0) = (−1, 0, 0).'),
  Q('q9', 'The state cos(π/6)|0⟩ + e^(iπ/2) sin(π/6)|1⟩ has Bloch vector|||Trạng thái cos(π/6)|0⟩ + e^(iπ/2) sin(π/6)|1⟩ có vectơ Bloch',
    ['(0, √3/2, 1/2)|||(0, √3/2, 1/2)', '(√3/2, 0, 1/2)|||(√3/2, 0, 1/2)', '(0, 1/2, √3/2)|||(0, 1/2, √3/2)', '(1/2, √3/2, 0)|||(1/2, √3/2, 0)'], 0,
    'θ = π/3 (half-angle!), φ = π/2: (sin θ cos φ, sin θ sin φ, cos θ).|||θ = π/3 (nhớ nửa góc!), φ = π/2: (sin θ cos φ, sin θ sin φ, cos θ).'),
  Q('q10', 'Two orthogonal qubit states lie on the Bloch sphere|||Hai trạng thái qubit trực giao nằm trên mặt cầu Bloch',
    ['at the same point|||tại cùng một điểm', 'at right angles (90°)|||vuông góc nhau (90°)', 'at antipodal points (180°)|||tại hai điểm đối xứng tâm (180°)', 'anywhere on the equator|||ở bất kỳ đâu trên xích đạo'], 2,
    '|⟨ψ|χ⟩|² = (1 + r·s)/2 = 0 ⇔ r·s = −1.|||Vì |⟨ψ|χ⟩|² = (1 + r·s)/2 = 0 ⇔ r·s = −1.'),
]);

const ch2 = {
  title: 'Chapter 2 — Qubits, phase and the Bloch sphere|||Chương 2 — Qubit, pha và mặt cầu Bloch',
  description: 'Từ bit đến qubit: trạng thái α|0⟩ + β|1⟩ và chuẩn hoá, 2ⁿ biên độ của n qubit, pha toàn cục vs pha tương đối, sáu trạng thái cơ bản của ba cơ sở Z/X/Y, mặt cầu Bloch và vectơ Bloch (Nielsen & Chuang 1.2 · Watrous Lesson 1).',
  lessons: [c21, c22, c23, q2],
};

// ───────────────────────────── Chương 3 — Phép đo ─────────────────────────────
const c31 = L('qtc211-ts-3-1',
  '3.1 — The Born rule and collapse: measuring in the computational basis|||3.1 — Quy tắc Born và sự sụp đổ: đo trong cơ sở tính toán',
  'Quy tắc Born P(0) = |α|², P(1) = |β|²; trạng thái sụp đổ sau đo; đo lại cho cùng kết quả; một lần đo chỉ cho một bit; không đọc được α, β từ một bản sao.',
  `<span class="eyebrow">QTC211 · Chapter 3 · Lesson 3.1</span>
<h2>The Born rule and collapse: measuring in the computational basis</h2>
<p class="lead">Amplitudes are hidden: the only way to get information out of a qubit is to measure it, and a measurement gives a random classical result and changes the state. This lesson states the rule precisely and works through its consequences.</p>
<h3>🎯 Objectives</h3>
<ul><li>Apply the Born rule to compute the probabilities of the outcomes 0 and 1.</li><li>State the post-measurement state (collapse) and predict what repeated measurements give.</li><li>Explain why one measurement of one qubit yields at most one classical bit.</li><li>Recognise states that a computational-basis measurement cannot tell apart.</li></ul>
<h3>📖 Lecture</h3>
<p>Measuring a qubit |ψ⟩ = α|0⟩ + β|1⟩ in the <strong>computational (Z) basis</strong> — the standard read-out of every quantum computer — follows two rules.</p>
<div class="formula"><span class="lbl">Born rule</span>P(0) = |α|<sup>2</sup> = |⟨0|ψ⟩|<sup>2</sup>      P(1) = |β|<sup>2</sup> = |⟨1|ψ⟩|<sup>2</sup></div>
<div class="formula"><span class="lbl">Collapse</span>outcome 0 ⇒ the state becomes |0⟩      outcome 1 ⇒ the state becomes |1⟩</div>
<p>Normalisation |α|<sup>2</sup> + |β|<sup>2</sup> = 1 is exactly what makes these probabilities add up to 1. If you are handed an unnormalised vector, normalise it first (or divide each |amplitude|<sup>2</sup> by the sum of all of them).</p>
<p>Three consequences shape everything that follows:</p>
<ul><li><strong>Repeatability.</strong> Measure again right away and you get the same result with certainty, because the state is now |0⟩ or |1⟩. The superposition is gone — measurement is <em>not</em> a passive look.</li><li><strong>One bit per qubit.</strong> A single measurement returns one bit. You cannot learn α and β from one copy of |ψ⟩; estimating them needs many identically prepared copies (Lesson 3.3), and even then only |α|<sup>2</sup> and |β|<sup>2</sup> come out of Z measurements.</li><li><strong>Phases are invisible in this basis.</strong> P(0) and P(1) depend only on moduli, so |+⟩ and |−⟩ (or |i⟩ and |−i⟩) give identical 50/50 statistics. To see a relative phase you must measure in another basis (Lesson 3.2).</li></ul>
<p>The outcome probabilities also ignore global phase, as they must: |e<sup>iγ</sup>α|<sup>2</sup> = |α|<sup>2</sup>. After outcome 1 the state is “β|1⟩ renormalised” = (β/|β|)|1⟩, which is |1⟩ up to a global phase.</p>
<pre><code class="language-python">import numpy as np

def probs(psi):
    psi = np.asarray(psi, dtype=complex)
    psi = psi / np.linalg.norm(psi)          # normalise first
    return np.round(np.abs(psi) ** 2, 4)     # Born rule: |amplitude|^2

print(probs([1 / np.sqrt(3), 1j * np.sqrt(2 / 3)]))   # Example 1
print(probs([3, 4j]))                                 # Example 2 (normalised inside)
print(probs([1, 1]), probs([1, -1]))                  # |+&gt; and |-&gt;</code></pre>
<div class="out">[0.3333 0.6667]
[0.36 0.64]
[0.5 0.5] [0.5 0.5]</div>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — complex amplitude.</b> |ψ⟩ = (1/√3)|0⟩ + i√(2/3)|1⟩.</p>
<p>P(0) = |1/√3|<sup>2</sup> = <b>1/3</b>. P(1) = |i|<sup>2</sup> · 2/3 = <b>2/3</b>. The factor i changes nothing here: |i|<sup>2</sup> = 1.</p></div>
<div class="callout"><p><b>Example 2 — unnormalised input and repeated measurement.</b> A qubit is prepared in 3|0⟩ + 4i|1⟩ (not normalised).</p>
<p>Step 1: ‖v‖<sup>2</sup> = 9 + 16 = 25, state (3|0⟩ + 4i|1⟩)/5. Step 2: P(0) = 9/25 = <b>0.36</b>, P(1) = 16/25 = <b>0.64</b>. Step 3: suppose the result is 1. The state becomes i|1⟩ ≡ |1⟩, so a second measurement gives 1 with probability <b>1</b>.</p></div>
<div class="callout"><p><b>Example 3 — what a Z measurement cannot see.</b> Alice hands Bob either |+⟩ or |−⟩. Bob measures in the Z basis.</p>
<p>For both states P(0) = P(1) = 1/2 (see the last line of the code output). Bob's result is a fair coin flip independent of which state he got: the Z measurement carries <b>zero information</b> about the choice. Yet the two states are orthogonal — measuring in the X basis would tell them apart perfectly.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Writing P(1) = β instead of |β|<sup>2</sup>. A probability is never negative or complex; for β = −0.8, P(1) = 0.64.</li><li>Assuming the qubit keeps its superposition after being measured. It collapses; the next measurement in the same basis is certain.</li><li>Believing that “measuring many times” on the <em>same</em> qubit reveals α and β. Repetition on one qubit just repeats the first answer; you need many fresh copies.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Born rule: P(k) = |⟨k|ψ⟩|<sup>2</sup>; normalise first.</li><li>Collapse: after outcome k the state is |k⟩ (up to phase); repeating gives k again.</li><li>One measurement of one qubit gives one bit; amplitudes cannot be read from one copy.</li><li>Z measurements are blind to relative phase: |+⟩ and |−⟩ look identical in this basis.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Born_rule" target="_blank" rel="noopener">Wikipedia — Born rule</a></li><li><a href="https://en.wikipedia.org/wiki/Measurement_in_quantum_mechanics" target="_blank" rel="noopener">Wikipedia — Measurement in quantum mechanics</a></li><li><a href="https://www.youtube.com/watch?v=3-c4xJa7Flk" target="_blank" rel="noopener">Qiskit — Understanding Quantum Information &amp; Computation, Lesson 01 (standard basis measurements)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Compute P(0), P(1) for cos(π/8)|0⟩ + sin(π/8)|1⟩ (give 4 decimals).</li><li>A qubit in (2|0⟩ − i|1⟩)/√5 is measured and gives 0. What do you get if you measure it again?</li><li>Give the outcome probabilities for (1 + i)|0⟩ + |1⟩ (unnormalised).</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) P(0) = cos<sup>2</sup>(π/8) = (1 + cos(π/4))/2 ≈ <b>0.8536</b>, P(1) ≈ <b>0.1464</b>. 2) The state is now |0⟩, so 0 again with probability 1. (Before the first measurement P(0) was 4/5.) 3) |1 + i|<sup>2</sup> = 2 and |1|<sup>2</sup> = 1, total 3: P(0) = 2/3, P(1) = 1/3.</p></div>`,
  `<span class="eyebrow">QTC211 · Chương 3 · Bài 3.1</span>
<h2>Quy tắc Born và sự sụp đổ: đo trong cơ sở tính toán</h2>
<p class="lead">Biên độ bị giấu kín: cách duy nhất lấy thông tin ra khỏi qubit là đo nó, và phép đo cho một kết quả cổ điển ngẫu nhiên đồng thời làm thay đổi trạng thái. Bài này phát biểu chính xác quy tắc đó và lần ra các hệ quả.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Dùng quy tắc Born tính xác suất ra kết quả 0 và 1.</li><li>Nêu trạng thái sau phép đo (sự sụp đổ) và dự đoán kết quả của các lần đo lặp lại.</li><li>Giải thích vì sao một lần đo một qubit cho tối đa một bit cổ điển.</li><li>Nhận ra những trạng thái mà phép đo trong cơ sở tính toán không phân biệt được.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Đo qubit |ψ⟩ = α|0⟩ + β|1⟩ trong <strong>cơ sở tính toán (cơ sở Z)</strong> — cách đọc kết quả chuẩn của mọi máy tính lượng tử — tuân theo hai quy tắc.</p>
<div class="formula"><span class="lbl">Quy tắc Born</span>P(0) = |α|<sup>2</sup> = |⟨0|ψ⟩|<sup>2</sup>      P(1) = |β|<sup>2</sup> = |⟨1|ψ⟩|<sup>2</sup></div>
<div class="formula"><span class="lbl">Sụp đổ</span>kết quả 0 ⇒ trạng thái thành |0⟩      kết quả 1 ⇒ trạng thái thành |1⟩</div>
<p>Điều kiện chuẩn hoá |α|<sup>2</sup> + |β|<sup>2</sup> = 1 chính là thứ làm hai xác suất cộng lại bằng 1. Nếu được đưa một vectơ chưa chuẩn hoá, hãy chuẩn hoá trước (hoặc chia mỗi |biên độ|<sup>2</sup> cho tổng của tất cả).</p>
<p>Ba hệ quả định hình mọi thứ phía sau:</p>
<ul><li><strong>Tính lặp lại.</strong> Đo lại ngay thì chắc chắn được cùng kết quả, vì trạng thái giờ đã là |0⟩ hoặc |1⟩. Chồng chập đã mất — phép đo <em>không</em> phải cái nhìn thụ động.</li><li><strong>Một bit mỗi qubit.</strong> Một lần đo trả về một bit. Bạn không thể biết α và β từ một bản sao của |ψ⟩; muốn ước lượng chúng cần rất nhiều bản sao được chuẩn bị giống hệt nhau (Bài 3.3), và kể cả thế, phép đo Z cũng chỉ cho ra |α|<sup>2</sup> và |β|<sup>2</sup>.</li><li><strong>Pha vô hình trong cơ sở này.</strong> P(0) và P(1) chỉ phụ thuộc mô-đun, nên |+⟩ và |−⟩ (hay |i⟩ và |−i⟩) cho thống kê 50/50 giống hệt nhau. Muốn thấy pha tương đối phải đo trong cơ sở khác (Bài 3.2).</li></ul>
<p>Xác suất kết quả cũng bỏ qua pha toàn cục, đúng như phải thế: |e<sup>iγ</sup>α|<sup>2</sup> = |α|<sup>2</sup>. Sau kết quả 1 trạng thái là “β|1⟩ chuẩn hoá lại” = (β/|β|)|1⟩, tức là |1⟩ sai khác một pha toàn cục.</p>
<pre><code class="language-python">import numpy as np

def probs(psi):
    psi = np.asarray(psi, dtype=complex)
    psi = psi / np.linalg.norm(psi)          # chuẩn hoá trước
    return np.round(np.abs(psi) ** 2, 4)     # quy tắc Born: |biên độ|^2

print(probs([1 / np.sqrt(3), 1j * np.sqrt(2 / 3)]))   # Ví dụ 1
print(probs([3, 4j]))                                 # Ví dụ 2 (chuẩn hoá bên trong)
print(probs([1, 1]), probs([1, -1]))                  # |+&gt; và |-&gt;</code></pre>
<div class="out">[0.3333 0.6667]
[0.36 0.64]
[0.5 0.5] [0.5 0.5]</div>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — biên độ phức.</b> |ψ⟩ = (1/√3)|0⟩ + i√(2/3)|1⟩.</p>
<p>P(0) = |1/√3|<sup>2</sup> = <b>1/3</b>. P(1) = |i|<sup>2</sup> · 2/3 = <b>2/3</b>. Thừa số i không đổi gì ở đây: |i|<sup>2</sup> = 1.</p></div>
<div class="callout"><p><b>Ví dụ 2 — đầu vào chưa chuẩn hoá và đo lặp.</b> Một qubit được chuẩn bị ở 3|0⟩ + 4i|1⟩ (chưa chuẩn hoá).</p>
<p>Bước 1: ‖v‖<sup>2</sup> = 9 + 16 = 25, trạng thái (3|0⟩ + 4i|1⟩)/5. Bước 2: P(0) = 9/25 = <b>0,36</b>, P(1) = 16/25 = <b>0,64</b>. Bước 3: giả sử kết quả là 1. Trạng thái thành i|1⟩ ≡ |1⟩, nên lần đo thứ hai cho 1 với xác suất <b>1</b>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — điều phép đo Z không thấy được.</b> Alice đưa Bob hoặc |+⟩ hoặc |−⟩. Bob đo trong cơ sở Z.</p>
<p>Với cả hai trạng thái P(0) = P(1) = 1/2 (xem dòng cuối của kết quả code). Kết quả của Bob là tung đồng xu cân đối, độc lập với trạng thái anh nhận: phép đo Z mang <b>không chút thông tin nào</b> về lựa chọn. Vậy mà hai trạng thái trực giao — đo trong cơ sở X sẽ phân biệt hoàn hảo.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Viết P(1) = β thay vì |β|<sup>2</sup>. Xác suất không bao giờ âm hay phức; với β = −0,8 thì P(1) = 0,64.</li><li>Cho rằng qubit vẫn giữ chồng chập sau khi bị đo. Nó đã sụp đổ; lần đo kế tiếp trong cùng cơ sở là chắc chắn.</li><li>Tin rằng “đo nhiều lần” trên <em>cùng một</em> qubit sẽ lộ ra α và β. Lặp trên một qubit chỉ lặp lại câu trả lời đầu tiên; bạn cần nhiều bản sao mới.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Quy tắc Born: P(k) = |⟨k|ψ⟩|<sup>2</sup>; nhớ chuẩn hoá trước.</li><li>Sụp đổ: sau kết quả k, trạng thái là |k⟩ (sai khác pha); đo lại vẫn ra k.</li><li>Một lần đo một qubit cho một bit; không đọc được biên độ từ một bản sao.</li><li>Phép đo Z mù với pha tương đối: |+⟩ và |−⟩ trông y hệt nhau trong cơ sở này.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Born_rule" target="_blank" rel="noopener">Wikipedia — Quy tắc Born</a></li><li><a href="https://en.wikipedia.org/wiki/Measurement_in_quantum_mechanics" target="_blank" rel="noopener">Wikipedia — Phép đo trong cơ học lượng tử</a></li><li><a href="https://www.youtube.com/watch?v=3-c4xJa7Flk" target="_blank" rel="noopener">Qiskit — Understanding Quantum Information &amp; Computation, Lesson 01 (phép đo trong cơ sở chuẩn)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tính P(0), P(1) của cos(π/8)|0⟩ + sin(π/8)|1⟩ (lấy 4 chữ số thập phân).</li><li>Một qubit ở (2|0⟩ − i|1⟩)/√5 được đo và cho 0. Đo lại thì được gì?</li><li>Cho xác suất các kết quả của (1 + i)|0⟩ + |1⟩ (chưa chuẩn hoá).</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) P(0) = cos<sup>2</sup>(π/8) = (1 + cos(π/4))/2 ≈ <b>0,8536</b>, P(1) ≈ <b>0,1464</b>. 2) Trạng thái giờ là |0⟩, nên lại ra 0 với xác suất 1. (Trước lần đo đầu, P(0) là 4/5.) 3) |1 + i|<sup>2</sup> = 2 và |1|<sup>2</sup> = 1, tổng 3: P(0) = 2/3, P(1) = 1/3.</p></div>`);

const c32 = L('qtc211-ts-3-2',
  '3.2 — Measuring in other bases, observables and expectation values|||3.2 — Đo trong cơ sở khác, đại lượng quan sát và giá trị kỳ vọng',
  'Phép đo xạ ảnh trong cơ sở trực chuẩn bất kỳ P(b) = |⟨b|ψ⟩|², đo cơ sở X = áp H rồi đo Z (cơ sở Y = S† rồi H), đại lượng quan sát Pauli, giá trị kỳ vọng ⟨Z⟩ = P0 − P1, ⟨X⟩, ⟨Y⟩ = vectơ Bloch.',
  `<span class="eyebrow">QTC211 · Chapter 3 · Lesson 3.2</span>
<h2>Measuring in other bases, observables and expectation values</h2>
<p class="lead">The Z basis is only one of infinitely many ways to measure a qubit. Measuring in the X or Y basis reveals the relative phase that Z cannot see — and hardware does it with a single gate before the usual read-out.</p>
<h3>🎯 Objectives</h3>
<ul><li>Compute outcome probabilities and post-measurement states for a measurement in any orthonormal basis.</li><li>Implement an X-basis measurement as “H, then measure Z” (and a Y-basis measurement as “S<sup>†</sup>, H, measure”).</li><li>Compute expectation values ⟨Z⟩, ⟨X⟩, ⟨Y⟩ and relate them to the Bloch vector.</li></ul>
<h3>📖 Lecture</h3>
<p>Let {|b<sub>0</sub>⟩, |b<sub>1</sub>⟩} be any orthonormal basis of ℂ<sup>2</sup>. A <strong>projective measurement</strong> in that basis gives outcome k with probability</p>
<div class="formula"><span class="lbl">Measurement in basis {|b<sub>k</sub>⟩}</span>P(k) = |⟨b<sub>k</sub>|ψ⟩|<sup>2</sup> = ⟨ψ|P<sub>k</sub>|ψ⟩   with   P<sub>k</sub> = |b<sub>k</sub>⟩⟨b<sub>k</sub>|,      afterwards the state is |b<sub>k</sub>⟩</div>
<p>This is Lesson 3.1 with |0⟩, |1⟩ replaced by |b<sub>0</sub>⟩, |b<sub>1</sub>⟩; the probabilities add to 1 because the expansion coefficients ⟨b<sub>k</sub>|ψ⟩ of a unit vector in an orthonormal basis have squared moduli summing to 1 (Lesson 1.2).</p>
<p><strong>How hardware does it.</strong> Real devices only read out in the Z basis. To measure in another basis, first apply a unitary U that maps the desired basis onto the computational one, then measure Z. Because |⟨k|Uψ⟩|<sup>2</sup> = |⟨U<sup>†</sup>k|ψ⟩|<sup>2</sup>, this equals measuring in the basis {U<sup>†</sup>|0⟩, U<sup>†</sup>|1⟩}. The Hadamard gate H = (1/√2)(1, 1; 1, −1) sends |+⟩ → |0⟩ and |−⟩ → |1⟩, so</p>
<div class="formula"><span class="lbl">Changing basis before read-out</span>X basis: apply H, then measure Z      Y basis: apply S<sup>†</sup> = diag(1, −i), then H, then measure Z</div>
<p><strong>Observables.</strong> A Hermitian matrix A = Σ λ<sub>k</sub>|e<sub>k</sub>⟩⟨e<sub>k</sub>| defines a measurement in its eigenbasis that reports the eigenvalue λ<sub>k</sub> instead of the label k. The Pauli observables have eigenvalues ±1: Z reports +1 for |0⟩ and −1 for |1⟩; X reports +1 for |+⟩ and −1 for |−⟩; Y reports ±1 for |±i⟩. The <strong>expectation value</strong> — the long-run average of the reported numbers — is</p>
<div class="formula"><span class="lbl">Expectation value</span>⟨A⟩ = Σ λ<sub>k</sub> P(k) = ⟨ψ|A|ψ⟩      e.g. ⟨Z⟩ = P(0) − P(1),   ⟨X⟩ = P(+) − P(−)</div>
<p>Beautifully, (⟨X⟩, ⟨Y⟩, ⟨Z⟩) is exactly the <strong>Bloch vector</strong> of Lesson 2.3. Measuring the three Pauli observables on many copies is how experimenters reconstruct an unknown qubit state (state tomography).</p>
<pre><code class="language-python">import numpy as np
H = np.array([[1, 1], [1, -1]]) / np.sqrt(2)
X = np.array([[0, 1], [1, 0]]); Y = np.array([[0, -1j], [1j, 0]]); Z = np.diag([1, -1])

psi = np.array([np.cos(np.pi / 8), np.sin(np.pi / 8)])
print("X-basis probabilities (H then Z-measure):", np.round(np.abs(H @ psi) ** 2, 4))

chi = np.array([0.6, 0.8j])
for name, M in [("X", X), ("Y", Y), ("Z", Z)]:
    print(f"&lt;{name}&gt; =", round(np.vdot(chi, M @ chi).real, 4))</code></pre>
<div class="out">X-basis probabilities (H then Z-measure): [0.8536 0.1464]
&lt;X&gt; = 0.0
&lt;Y&gt; = 0.96
&lt;Z&gt; = -0.28</div>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — |0⟩ in the X basis.</b> ⟨+|0⟩ = 1/√2 and ⟨−|0⟩ = 1/√2, so P(+) = P(−) = <b>1/2</b>. A state that is certain in Z is completely random in X (mutually unbiased bases, Lesson 2.2). After outcome “−” the qubit is in |−⟩.</p></div>
<div class="callout"><p><b>Example 2 — a tilted state.</b> |ψ⟩ = cos(π/8)|0⟩ + sin(π/8)|1⟩, measured in the X basis.</p>
<p>⟨+|ψ⟩ = (cos(π/8) + sin(π/8))/√2, so P(+) = (cos + sin)<sup>2</sup>/2 = (1 + 2 sin(π/8)cos(π/8))/2 = (1 + sin(π/4))/2 ≈ <b>0.8536</b> and P(−) ≈ <b>0.1464</b>. The code obtains the same numbers by applying H and reading Z.</p></div>
<div class="callout"><p><b>Example 3 — expectation values = Bloch vector.</b> |χ⟩ = 0.6|0⟩ + 0.8i|1⟩.</p>
<p>⟨Z⟩ = 0.36 − 0.64 = <b>−0.28</b>. With α*β = 0.6 · 0.8i = 0.48i: ⟨X⟩ = 2 Re(0.48i) = <b>0</b> and ⟨Y⟩ = 2 Im(0.48i) = <b>0.96</b>. Check: 0<sup>2</sup> + 0.96<sup>2</sup> + 0.28<sup>2</sup> = 0.9216 + 0.0784 = 1 — a pure state lies on the sphere's surface.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Applying H to measure in the Y basis. H maps |±i⟩ to (1 ± i)/2-type superpositions, not to |0⟩, |1⟩; you need S<sup>†</sup> first.</li><li>Confusing the expectation value with a possible outcome. ⟨Z⟩ = −0.28 is an average; every single Z measurement reports +1 or −1.</li><li>Thinking you can measure X and Z “at the same time” on one copy. Their eigenbases differ; measuring one disturbs the other.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Basis {|b<sub>k</sub>⟩}: P(k) = |⟨b<sub>k</sub>|ψ⟩|<sup>2</sup>, state collapses to |b<sub>k</sub>⟩.</li><li>X basis = H then Z read-out; Y basis = S<sup>†</sup>, H, then Z read-out.</li><li>Observable A: outcomes = eigenvalues, ⟨A⟩ = ⟨ψ|A|ψ⟩.</li><li>(⟨X⟩, ⟨Y⟩, ⟨Z⟩) = Bloch vector; ⟨Z⟩ = P(0) − P(1).</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://learn.microsoft.com/en-us/azure/quantum/concepts-pauli-measurements" target="_blank" rel="noopener">Microsoft Learn — Pauli measurements</a></li><li><a href="https://github.com/Qiskit/documentation/blob/main/learning/courses/basics-of-quantum-information/quantum-circuits/inner-products-and-projections.ipynb" target="_blank" rel="noopener">IBM Quantum Learning (Watrous) — Inner products and projections (source notebook)</a></li><li><a href="https://www.youtube.com/watch?v=30U2DTfIrOU" target="_blank" rel="noopener">Qiskit — Understanding Quantum Information &amp; Computation, Lesson 03: Quantum Circuits</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Measure |i⟩ in the X basis and in the Y basis. Give the probabilities.</li><li>For |ψ⟩ = (√3/2)|0⟩ + (1/2)|1⟩ compute ⟨X⟩ and P(+).</li><li>Which single-qubit state has ⟨X⟩ = 0, ⟨Y⟩ = 0, ⟨Z⟩ = −1?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) X basis: |⟨±|i⟩|<sup>2</sup> = 1/2 each. Y basis: P(+i) = 1, P(−i) = 0 (S<sup>†</sup>|i⟩ = |+⟩, then H|+⟩ = |0⟩). 2) ⟨X⟩ = 2 · (√3/2)(1/2) = √3/2 ≈ 0.866; P(+) = (1 + ⟨X⟩)/2 ≈ 0.933. 3) Bloch vector (0, 0, −1): the state |1⟩.</p></div>`,
  `<span class="eyebrow">QTC211 · Chương 3 · Bài 3.2</span>
<h2>Đo trong cơ sở khác, đại lượng quan sát và giá trị kỳ vọng</h2>
<p class="lead">Cơ sở Z chỉ là một trong vô số cách đo một qubit. Đo trong cơ sở X hoặc Y làm lộ ra pha tương đối mà Z không thấy — và phần cứng làm việc đó chỉ bằng một cổng đặt trước bước đọc kết quả thông thường.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính xác suất kết quả và trạng thái sau đo cho phép đo trong một cơ sở trực chuẩn bất kỳ.</li><li>Thực hiện phép đo cơ sở X bằng “H, rồi đo Z” (và cơ sở Y bằng “S<sup>†</sup>, H, rồi đo”).</li><li>Tính giá trị kỳ vọng ⟨Z⟩, ⟨X⟩, ⟨Y⟩ và liên hệ chúng với vectơ Bloch.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Cho {|b<sub>0</sub>⟩, |b<sub>1</sub>⟩} là một cơ sở trực chuẩn bất kỳ của ℂ<sup>2</sup>. <strong>Phép đo xạ ảnh</strong> trong cơ sở đó cho kết quả k với xác suất</p>
<div class="formula"><span class="lbl">Phép đo trong cơ sở {|b<sub>k</sub>⟩}</span>P(k) = |⟨b<sub>k</sub>|ψ⟩|<sup>2</sup> = ⟨ψ|P<sub>k</sub>|ψ⟩   với   P<sub>k</sub> = |b<sub>k</sub>⟩⟨b<sub>k</sub>|,      sau đó trạng thái là |b<sub>k</sub>⟩</div>
<p>Đây chính là Bài 3.1 với |0⟩, |1⟩ thay bằng |b<sub>0</sub>⟩, |b<sub>1</sub>⟩; các xác suất cộng lại bằng 1 vì hệ số khai triển ⟨b<sub>k</sub>|ψ⟩ của một vectơ đơn vị trong cơ sở trực chuẩn có tổng bình phương mô-đun bằng 1 (Bài 1.2).</p>
<p><strong>Phần cứng làm thế nào.</strong> Thiết bị thật chỉ đọc kết quả trong cơ sở Z. Muốn đo trong cơ sở khác, trước hết áp một ma trận unita U biến cơ sở mong muốn thành cơ sở tính toán, rồi mới đo Z. Vì |⟨k|Uψ⟩|<sup>2</sup> = |⟨U<sup>†</sup>k|ψ⟩|<sup>2</sup>, việc này tương đương đo trong cơ sở {U<sup>†</sup>|0⟩, U<sup>†</sup>|1⟩}. Cổng Hadamard H = (1/√2)(1, 1; 1, −1) đưa |+⟩ → |0⟩ và |−⟩ → |1⟩, nên</p>
<div class="formula"><span class="lbl">Đổi cơ sở trước khi đọc</span>Cơ sở X: áp H, rồi đo Z      Cơ sở Y: áp S<sup>†</sup> = diag(1, −i), rồi H, rồi đo Z</div>
<p><strong>Đại lượng quan sát.</strong> Ma trận Hermite A = Σ λ<sub>k</sub>|e<sub>k</sub>⟩⟨e<sub>k</sub>| xác định một phép đo trong cơ sở riêng của nó, báo trị riêng λ<sub>k</sub> thay cho nhãn k. Các đại lượng Pauli có trị riêng ±1: Z báo +1 với |0⟩ và −1 với |1⟩; X báo +1 với |+⟩ và −1 với |−⟩; Y báo ±1 với |±i⟩. <strong>Giá trị kỳ vọng</strong> — trung bình dài hạn của các số được báo — là</p>
<div class="formula"><span class="lbl">Giá trị kỳ vọng</span>⟨A⟩ = Σ λ<sub>k</sub> P(k) = ⟨ψ|A|ψ⟩      vd ⟨Z⟩ = P(0) − P(1),   ⟨X⟩ = P(+) − P(−)</div>
<p>Điều đẹp đẽ: (⟨X⟩, ⟨Y⟩, ⟨Z⟩) chính là <strong>vectơ Bloch</strong> của Bài 2.3. Đo ba đại lượng Pauli trên nhiều bản sao là cách các nhà thực nghiệm dựng lại một trạng thái qubit chưa biết (chụp cắt lớp trạng thái — state tomography).</p>
<pre><code class="language-python">import numpy as np
H = np.array([[1, 1], [1, -1]]) / np.sqrt(2)
X = np.array([[0, 1], [1, 0]]); Y = np.array([[0, -1j], [1j, 0]]); Z = np.diag([1, -1])

psi = np.array([np.cos(np.pi / 8), np.sin(np.pi / 8)])
print("X-basis probabilities (H then Z-measure):", np.round(np.abs(H @ psi) ** 2, 4))

chi = np.array([0.6, 0.8j])
for name, M in [("X", X), ("Y", Y), ("Z", Z)]:
    print(f"&lt;{name}&gt; =", round(np.vdot(chi, M @ chi).real, 4))</code></pre>
<div class="out">X-basis probabilities (H then Z-measure): [0.8536 0.1464]
&lt;X&gt; = 0.0
&lt;Y&gt; = 0.96
&lt;Z&gt; = -0.28</div>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — |0⟩ trong cơ sở X.</b> ⟨+|0⟩ = 1/√2 và ⟨−|0⟩ = 1/√2, nên P(+) = P(−) = <b>1/2</b>. Trạng thái chắc chắn trong Z thì hoàn toàn ngẫu nhiên trong X (các cơ sở không thiên lệch lẫn nhau, Bài 2.2). Sau kết quả “−”, qubit ở |−⟩.</p></div>
<div class="callout"><p><b>Ví dụ 2 — một trạng thái nghiêng.</b> |ψ⟩ = cos(π/8)|0⟩ + sin(π/8)|1⟩, đo trong cơ sở X.</p>
<p>⟨+|ψ⟩ = (cos(π/8) + sin(π/8))/√2, nên P(+) = (cos + sin)<sup>2</sup>/2 = (1 + 2 sin(π/8)cos(π/8))/2 = (1 + sin(π/4))/2 ≈ <b>0,8536</b> và P(−) ≈ <b>0,1464</b>. Code cho đúng các số này bằng cách áp H rồi đọc Z.</p></div>
<div class="callout"><p><b>Ví dụ 3 — giá trị kỳ vọng = vectơ Bloch.</b> |χ⟩ = 0,6|0⟩ + 0,8i|1⟩.</p>
<p>⟨Z⟩ = 0,36 − 0,64 = <b>−0,28</b>. Với α*β = 0,6 · 0,8i = 0,48i: ⟨X⟩ = 2 Re(0,48i) = <b>0</b> và ⟨Y⟩ = 2 Im(0,48i) = <b>0,96</b>. Kiểm: 0<sup>2</sup> + 0,96<sup>2</sup> + 0,28<sup>2</sup> = 0,9216 + 0,0784 = 1 — trạng thái thuần nằm trên bề mặt mặt cầu.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Áp H để đo trong cơ sở Y. H biến |±i⟩ thành các chồng chập kiểu (1 ± i)/2 chứ không thành |0⟩, |1⟩; phải áp S<sup>†</sup> trước.</li><li>Nhầm giá trị kỳ vọng với một kết quả có thể xảy ra. ⟨Z⟩ = −0,28 là trung bình; mỗi lần đo Z chỉ báo +1 hoặc −1.</li><li>Tưởng có thể đo X và Z “cùng lúc” trên một bản sao. Cơ sở riêng của chúng khác nhau; đo cái này làm nhiễu cái kia.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Cơ sở {|b<sub>k</sub>⟩}: P(k) = |⟨b<sub>k</sub>|ψ⟩|<sup>2</sup>, trạng thái sụp đổ về |b<sub>k</sub>⟩.</li><li>Cơ sở X = H rồi đọc Z; cơ sở Y = S<sup>†</sup>, H, rồi đọc Z.</li><li>Đại lượng quan sát A: kết quả = trị riêng, ⟨A⟩ = ⟨ψ|A|ψ⟩.</li><li>(⟨X⟩, ⟨Y⟩, ⟨Z⟩) = vectơ Bloch; ⟨Z⟩ = P(0) − P(1).</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://learn.microsoft.com/en-us/azure/quantum/concepts-pauli-measurements" target="_blank" rel="noopener">Microsoft Learn — Phép đo Pauli</a></li><li><a href="https://github.com/Qiskit/documentation/blob/main/learning/courses/basics-of-quantum-information/quantum-circuits/inner-products-and-projections.ipynb" target="_blank" rel="noopener">IBM Quantum Learning (Watrous) — Tích trong và phép chiếu (notebook gốc)</a></li><li><a href="https://www.youtube.com/watch?v=30U2DTfIrOU" target="_blank" rel="noopener">Qiskit — Understanding Quantum Information &amp; Computation, Lesson 03: Mạch lượng tử</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Đo |i⟩ trong cơ sở X và trong cơ sở Y. Cho các xác suất.</li><li>Với |ψ⟩ = (√3/2)|0⟩ + (1/2)|1⟩, tính ⟨X⟩ và P(+).</li><li>Trạng thái một qubit nào có ⟨X⟩ = 0, ⟨Y⟩ = 0, ⟨Z⟩ = −1?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Cơ sở X: |⟨±|i⟩|<sup>2</sup> = 1/2 mỗi kết quả. Cơ sở Y: P(+i) = 1, P(−i) = 0 (S<sup>†</sup>|i⟩ = |+⟩, rồi H|+⟩ = |0⟩). 2) ⟨X⟩ = 2 · (√3/2)(1/2) = √3/2 ≈ 0,866; P(+) = (1 + ⟨X⟩)/2 ≈ 0,933. 3) Vectơ Bloch (0, 0, −1): trạng thái |1⟩.</p></div>`);

const c33 = L('qtc211-ts-3-3',
  '3.3 — Shots and statistics: simulating measurements, error bars, distinguishing states|||3.3 — Số lần chạy và thống kê: mô phỏng phép đo, sai số, phân biệt trạng thái',
  'Chạy N “shot” để ước lượng xác suất, mô phỏng bằng numpy (default_rng có seed), sai số chuẩn √(p(1−p)/N), số shot cần cho độ chính xác mong muốn, vì sao trạng thái không trực giao không phân biệt hoàn hảo được (cận Helstrom).',
  `<span class="eyebrow">QTC211 · Chapter 3 · Lesson 3.3</span>
<h2>Shots and statistics: simulating measurements, error bars, distinguishing states</h2>
<p class="lead">On a real quantum computer — and in Qiskit — you never see probabilities, only <strong>counts</strong> from repeating a circuit many times. This lesson teaches you to read counts like a scientist: estimate, attach an error bar, and know what no number of shots can ever fix.</p>
<h3>🎯 Objectives</h3>
<ul><li>Simulate N measurement “shots” with numpy and estimate P(0) and ⟨Z⟩ from the counts.</li><li>Compute the standard error √(p(1 − p)/N) and choose N for a target precision.</li><li>Decide whether a measured frequency is consistent with a predicted probability.</li><li>Explain why two non-orthogonal states cannot be distinguished with certainty.</li></ul>
<h3>📖 Lecture</h3>
<p>A <strong>shot</strong> is one complete run: prepare the state, apply the circuit, measure. Each shot destroys its copy of the state, so to learn a probability p = P(0) you run N shots and count k zeros. The natural estimate is the frequency p̂ = k/N. Each shot is an independent Bernoulli trial, so k follows a binomial distribution, and p̂ has</p>
<div class="formula"><span class="lbl">Standard error of a frequency</span>SE = √(p(1 − p)/N)      (≈ √(p̂(1 − p̂)/N) in practice;  95% interval ≈ p̂ ± 2·SE)</div>
<p>Two practical rules follow. The error shrinks like 1/√N: <strong>four times more shots halve the error bar</strong>. And the worst case is p = 1/2, where SE = 1/(2√N): 100 shots give ±0.05, 1000 shots ±0.016, 10 000 shots ±0.005. This is why cloud backends default to thousands of shots, and why expectation values estimated on hardware always come with statistical noise even before any hardware noise (Chapter 10).</p>
<p>Simulating shots is one line with numpy's random generator — always pass a <strong>seed</strong> so your results are reproducible:</p>
<pre><code class="language-python">import numpy as np
rng = np.random.default_rng(seed=2026)
p0 = np.cos(np.pi / 8) ** 2                      # exact P(0) = 0.8536 for cos(pi/8)|0&gt; + sin(pi/8)|1&gt;
for shots in [100, 1000, 10000]:
    outcomes = rng.choice([0, 1], size=shots, p=[p0, 1 - p0])
    k = np.count_nonzero(outcomes == 0)
    p_hat = k / shots
    se = np.sqrt(p_hat * (1 - p_hat) / shots)
    print(f"shots={shots:5d}  zeros={k:5d}  p_hat={p_hat:.4f}  SE={se:.4f}  &lt;Z&gt;_hat={2 * p_hat - 1:.4f}")
print("exact P(0) =", round(p0, 4), " exact &lt;Z&gt; =", round(2 * p0 - 1, 4))</code></pre>
<div class="out">shots=  100  zeros=   85  p_hat=0.8500  SE=0.0357  &lt;Z&gt;_hat=0.7000
shots= 1000  zeros=  845  p_hat=0.8450  SE=0.0114  &lt;Z&gt;_hat=0.6900
shots=10000  zeros= 8508  p_hat=0.8508  SE=0.0036  &lt;Z&gt;_hat=0.7016
exact P(0) = 0.8536  exact &lt;Z&gt; = 0.7071</div>
<p>Every estimate lies within one standard error of the exact value 0.8536, and the error bar shrinks as N grows. (⟨Z⟩ = 2p − 1, so its error bar is twice as large.)</p>
<p><strong>What statistics cannot fix.</strong> Suppose you get a <em>single</em> qubit that is either |0⟩ or |+⟩, each with probability 1/2, and must guess which. Measuring Z and answering “|0⟩” on outcome 0 and “|+⟩” on outcome 1 succeeds with probability 1/2 · 1 + 1/2 · 1/2 = 0.75. The best possible measurement — the <strong>Helstrom bound</strong> — achieves 1/2 + (1/2)√(1 − |⟨0|+⟩|<sup>2</sup>) ≈ 0.8536, using a basis rotated by π/8 so that it sits symmetrically between the two states. Nothing reaches 1: perfect discrimination is possible <strong>only for orthogonal states</strong>. This limitation is not a weakness of our devices; it is a law, and Chapter 7 turns it into the security of quantum key distribution.</p>
<pre><code class="language-python">import numpy as np
ket0 = np.array([1, 0]); plus = np.array([1, 1]) / np.sqrt(2)

def success(t):
    """Guess '0' on outcome b0, guess '+' on outcome b1; each state sent with probability 1/2."""
    b0 = np.array([np.cos(t), np.sin(t)]); b1 = np.array([-np.sin(t), np.cos(t)])
    return 0.5 * abs(b0 @ ket0) ** 2 + 0.5 * abs(b1 @ plus) ** 2

print("measure in Z basis      :", round(success(0.0), 4))
print("basis rotated by -pi/8  :", round(success(-np.pi / 8), 4))
print("Helstrom bound          :", round(0.5 + 0.5 * np.sqrt(1 - abs(ket0 @ plus) ** 2), 4))</code></pre>
<div class="out">measure in Z basis      : 0.75
basis rotated by -pi/8  : 0.8536
Helstrom bound          : 0.8536</div>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — how many shots?</b> You want SE ≤ 0.01 for a probability near 1/2.</p>
<p>Need √(0.25/N) ≤ 0.01 ⇒ 0.25/N ≤ 10<sup>−4</sup> ⇒ <b>N ≥ 2500</b>.</p></div>
<div class="callout"><p><b>Example 2 — is the device biased?</b> Theory says |+⟩ measured in Z gives P(0) = 0.5. In 400 shots you see 230 zeros.</p>
<p>p̂ = 230/400 = 0.575. SE = √(0.25/400) = 0.025. The deviation 0.575 − 0.5 = 0.075 is <b>3 standard errors</b> — far outside the usual ±2·SE band, so something (state preparation or read-out) is likely biased. A deviation of 1 SE would be normal noise.</p></div>
<div class="callout"><p><b>Example 3 — reading an expectation value.</b> In 1000 shots of a Z measurement you get 845 zeros and 155 ones.</p>
<p>⟨Z⟩ estimate = (845 − 155)/1000 = <b>0.69</b>, with error bar 2 · 0.0114 ≈ 0.023 (twice the SE of p̂). The exact value for cos(π/8)|0⟩ + sin(π/8)|1⟩ is cos(π/4) ≈ 0.7071 — inside the error bar.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Reporting a frequency from 100 shots with four decimals and no error bar. 0.85 ± 0.04 is the honest answer.</li><li>Confusing <em>shots</em> with <em>qubits</em>. 1000 shots of a 1-qubit circuit are 1000 separate preparations of one qubit, not a 1000-qubit computation.</li><li>Forgetting the seed in simulations, then being unable to reproduce a bug or a figure.</li><li>Believing that more shots can distinguish |0⟩ from |+⟩ given <em>one</em> copy. Shots need fresh copies; with one copy the 0.8536 limit stands.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Counts, not probabilities: p̂ = k/N from N shots.</li><li>SE = √(p(1 − p)/N); 4× shots ⇒ ½ error; worst case p = 1/2.</li><li>Judge deviations in units of SE (beyond ~2–3 SE is suspicious).</li><li>Non-orthogonal states cannot be told apart with certainty; for |0⟩ vs |+⟩ the best single-shot success is ≈ 0.8536.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://github.com/Qiskit/documentation/blob/main/learning/courses/basics-of-quantum-information/single-systems/qiskit-implementation.ipynb" target="_blank" rel="noopener">IBM Quantum Learning (Watrous) — Single systems: Qiskit implementation (source notebook)</a></li><li><a href="https://en.wikipedia.org/wiki/Quantum_state_discrimination" target="_blank" rel="noopener">Wikipedia — Quantum state discrimination</a></li><li><a href="https://www.youtube.com/watch?v=Xi9YTYzQErY" target="_blank" rel="noopener">Qiskit — Understanding Quantum Information &amp; Computation, Lesson 11: General Measurements (state discrimination)</a></li><li><a href="https://en.wikipedia.org/wiki/Standard_error" target="_blank" rel="noopener">Wikipedia — Standard error</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>What is the standard error of p̂ for p = 0.5 and N = 10 000?</li><li>Theory predicts P(0) = 0.8536. In 1000 shots you count 870 zeros. Is that consistent?</li><li>Why can |0⟩ and |1⟩ be distinguished perfectly from one copy, but |0⟩ and |+⟩ cannot?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) √(0.25/10 000) = <b>0.005</b>. 2) SE = √(0.8536 · 0.1464/1000) ≈ 0.0112. The deviation 0.870 − 0.8536 = 0.0164 ≈ 1.5 SE: consistent (inside ±2 SE). 3) |0⟩ and |1⟩ are orthogonal, so a Z measurement gives a different certain outcome for each. |⟨0|+⟩|<sup>2</sup> = 1/2 ≠ 0, so every measurement has some outcome that both states can produce; the best success probability is the Helstrom value ≈ 0.8536.</p></div>`,
  `<span class="eyebrow">QTC211 · Chương 3 · Bài 3.3</span>
<h2>Số lần chạy và thống kê: mô phỏng phép đo, sai số, phân biệt trạng thái</h2>
<p class="lead">Trên máy lượng tử thật — và trong Qiskit — bạn không bao giờ thấy xác suất, chỉ thấy <strong>số đếm</strong> sau khi lặp một mạch nhiều lần. Bài này dạy bạn đọc số đếm như nhà khoa học: ước lượng, gắn thanh sai số, và biết điều gì không số lần chạy nào sửa được.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Mô phỏng N lần đo (“shot”) bằng numpy và ước lượng P(0), ⟨Z⟩ từ số đếm.</li><li>Tính sai số chuẩn √(p(1 − p)/N) và chọn N theo độ chính xác mong muốn.</li><li>Quyết định một tần suất đo được có khớp với xác suất dự đoán hay không.</li><li>Giải thích vì sao hai trạng thái không trực giao không thể phân biệt chắc chắn.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Một <strong>shot</strong> là một lần chạy trọn vẹn: chuẩn bị trạng thái, áp mạch, đo. Mỗi shot phá huỷ bản sao trạng thái của nó, nên muốn biết xác suất p = P(0) bạn chạy N shot và đếm k lần ra 0. Ước lượng tự nhiên là tần suất p̂ = k/N. Mỗi shot là một phép thử Bernoulli độc lập, nên k theo phân phối nhị thức, và p̂ có</p>
<div class="formula"><span class="lbl">Sai số chuẩn của tần suất</span>SE = √(p(1 − p)/N)      (thực tế dùng ≈ √(p̂(1 − p̂)/N);  khoảng 95% ≈ p̂ ± 2·SE)</div>
<p>Hai quy tắc thực hành rút ra từ đây. Sai số giảm như 1/√N: <strong>gấp bốn số shot thì thanh sai số giảm một nửa</strong>. Và trường hợp tệ nhất là p = 1/2, khi đó SE = 1/(2√N): 100 shot cho ±0,05, 1000 shot ±0,016, 10 000 shot ±0,005. Vì thế các máy trên đám mây mặc định chạy hàng nghìn shot, và giá trị kỳ vọng ước lượng trên phần cứng luôn kèm nhiễu thống kê, ngay cả trước khi tính nhiễu phần cứng (Chương 10).</p>
<p>Mô phỏng shot chỉ cần một dòng với bộ sinh ngẫu nhiên của numpy — luôn truyền <strong>seed</strong> để kết quả lặp lại được:</p>
<pre><code class="language-python">import numpy as np
rng = np.random.default_rng(seed=2026)
p0 = np.cos(np.pi / 8) ** 2                      # P(0) chính xác = 0.8536 với cos(pi/8)|0&gt; + sin(pi/8)|1&gt;
for shots in [100, 1000, 10000]:
    outcomes = rng.choice([0, 1], size=shots, p=[p0, 1 - p0])
    k = np.count_nonzero(outcomes == 0)
    p_hat = k / shots
    se = np.sqrt(p_hat * (1 - p_hat) / shots)
    print(f"shots={shots:5d}  zeros={k:5d}  p_hat={p_hat:.4f}  SE={se:.4f}  &lt;Z&gt;_hat={2 * p_hat - 1:.4f}")
print("exact P(0) =", round(p0, 4), " exact &lt;Z&gt; =", round(2 * p0 - 1, 4))</code></pre>
<div class="out">shots=  100  zeros=   85  p_hat=0.8500  SE=0.0357  &lt;Z&gt;_hat=0.7000
shots= 1000  zeros=  845  p_hat=0.8450  SE=0.0114  &lt;Z&gt;_hat=0.6900
shots=10000  zeros= 8508  p_hat=0.8508  SE=0.0036  &lt;Z&gt;_hat=0.7016
exact P(0) = 0.8536  exact &lt;Z&gt; = 0.7071</div>
<p>Mọi ước lượng đều nằm trong một sai số chuẩn quanh giá trị đúng 0,8536, và thanh sai số co lại khi N tăng. (⟨Z⟩ = 2p − 1 nên thanh sai số của nó lớn gấp đôi.)</p>
<p><strong>Điều thống kê không sửa được.</strong> Giả sử bạn nhận <em>một</em> qubit, hoặc là |0⟩ hoặc là |+⟩, mỗi khả năng xác suất 1/2, và phải đoán là cái nào. Đo Z rồi trả lời “|0⟩” khi ra 0, “|+⟩” khi ra 1 thì đúng với xác suất 1/2 · 1 + 1/2 · 1/2 = 0,75. Phép đo tốt nhất có thể — <strong>cận Helstrom</strong> — đạt 1/2 + (1/2)√(1 − |⟨0|+⟩|<sup>2</sup>) ≈ 0,8536, dùng một cơ sở xoay π/8 để nằm đối xứng giữa hai trạng thái. Không cách nào đạt 1: phân biệt hoàn hảo <strong>chỉ có thể với các trạng thái trực giao</strong>. Giới hạn này không phải nhược điểm của thiết bị; nó là một định luật, và Chương 7 biến nó thành nền tảng an toàn của phân phối khoá lượng tử.</p>
<pre><code class="language-python">import numpy as np
ket0 = np.array([1, 0]); plus = np.array([1, 1]) / np.sqrt(2)

def success(t):
    """Đoán '0' khi ra b0, đoán '+' khi ra b1; mỗi trạng thái được gửi với xác suất 1/2."""
    b0 = np.array([np.cos(t), np.sin(t)]); b1 = np.array([-np.sin(t), np.cos(t)])
    return 0.5 * abs(b0 @ ket0) ** 2 + 0.5 * abs(b1 @ plus) ** 2

print("measure in Z basis      :", round(success(0.0), 4))
print("basis rotated by -pi/8  :", round(success(-np.pi / 8), 4))
print("Helstrom bound          :", round(0.5 + 0.5 * np.sqrt(1 - abs(ket0 @ plus) ** 2), 4))</code></pre>
<div class="out">measure in Z basis      : 0.75
basis rotated by -pi/8  : 0.8536
Helstrom bound          : 0.8536</div>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — cần bao nhiêu shot?</b> Bạn muốn SE ≤ 0,01 cho một xác suất gần 1/2.</p>
<p>Cần √(0,25/N) ≤ 0,01 ⇒ 0,25/N ≤ 10<sup>−4</sup> ⇒ <b>N ≥ 2500</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2 — thiết bị có lệch không?</b> Lý thuyết nói đo |+⟩ trong cơ sở Z cho P(0) = 0,5. Trong 400 shot bạn thấy 230 lần ra 0.</p>
<p>p̂ = 230/400 = 0,575. SE = √(0,25/400) = 0,025. Độ lệch 0,575 − 0,5 = 0,075 là <b>3 sai số chuẩn</b> — vượt xa dải ±2·SE thông thường, nên nhiều khả năng có gì đó (khâu chuẩn bị hoặc khâu đọc) bị lệch. Lệch 1 SE thì chỉ là nhiễu bình thường.</p></div>
<div class="callout"><p><b>Ví dụ 3 — đọc một giá trị kỳ vọng.</b> 1000 shot đo Z cho 845 lần 0 và 155 lần 1.</p>
<p>Ước lượng ⟨Z⟩ = (845 − 155)/1000 = <b>0,69</b>, thanh sai số 2 · 0,0114 ≈ 0,023 (gấp đôi SE của p̂). Giá trị đúng với cos(π/8)|0⟩ + sin(π/8)|1⟩ là cos(π/4) ≈ 0,7071 — nằm trong thanh sai số.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Báo tần suất từ 100 shot với bốn chữ số thập phân và không kèm sai số. Câu trả lời trung thực là 0,85 ± 0,04.</li><li>Nhầm <em>shot</em> với <em>qubit</em>. 1000 shot của mạch 1 qubit là 1000 lần chuẩn bị riêng một qubit, không phải phép tính 1000 qubit.</li><li>Quên seed khi mô phỏng, rồi không tái hiện được lỗi hay hình vẽ.</li><li>Tin rằng chạy nhiều shot hơn sẽ phân biệt được |0⟩ với |+⟩ khi chỉ có <em>một</em> bản sao. Shot cần bản sao mới; với một bản sao, giới hạn 0,8536 vẫn đứng nguyên.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Số đếm chứ không phải xác suất: p̂ = k/N từ N shot.</li><li>SE = √(p(1 − p)/N); gấp 4 shot ⇒ sai số giảm ½; tệ nhất khi p = 1/2.</li><li>Đánh giá độ lệch theo đơn vị SE (quá ~2–3 SE là đáng ngờ).</li><li>Trạng thái không trực giao không phân biệt chắc chắn được; với |0⟩ và |+⟩, xác suất đúng tốt nhất từ một bản sao ≈ 0,8536.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://github.com/Qiskit/documentation/blob/main/learning/courses/basics-of-quantum-information/single-systems/qiskit-implementation.ipynb" target="_blank" rel="noopener">IBM Quantum Learning (Watrous) — Hệ đơn: cài đặt bằng Qiskit (notebook gốc)</a></li><li><a href="https://en.wikipedia.org/wiki/Quantum_state_discrimination" target="_blank" rel="noopener">Wikipedia — Phân biệt trạng thái lượng tử</a></li><li><a href="https://www.youtube.com/watch?v=Xi9YTYzQErY" target="_blank" rel="noopener">Qiskit — Understanding Quantum Information &amp; Computation, Lesson 11: Phép đo tổng quát (phân biệt trạng thái)</a></li><li><a href="https://en.wikipedia.org/wiki/Standard_error" target="_blank" rel="noopener">Wikipedia — Sai số chuẩn</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Sai số chuẩn của p̂ bằng bao nhiêu khi p = 0,5 và N = 10 000?</li><li>Lý thuyết dự đoán P(0) = 0,8536. Trong 1000 shot bạn đếm được 870 lần 0. Có khớp không?</li><li>Vì sao |0⟩ và |1⟩ phân biệt hoàn hảo được từ một bản sao, còn |0⟩ và |+⟩ thì không?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) √(0,25/10 000) = <b>0,005</b>. 2) SE = √(0,8536 · 0,1464/1000) ≈ 0,0112. Độ lệch 0,870 − 0,8536 = 0,0164 ≈ 1,5 SE: khớp (nằm trong ±2 SE). 3) |0⟩ và |1⟩ trực giao, nên phép đo Z cho mỗi trạng thái một kết quả chắc chắn khác nhau. |⟨0|+⟩|<sup>2</sup> = 1/2 ≠ 0, nên phép đo nào cũng có kết quả mà cả hai trạng thái đều có thể tạo ra; xác suất đúng tốt nhất là giá trị Helstrom ≈ 0,8536.</p></div>`);

const q3 = QZ(3, 'Quiz — Chapter 3: Measurement|||Quiz — Chương 3: Phép đo', 'Kiểm tra chương 3: quy tắc Born, sụp đổ, đo trong cơ sở X/Y, giá trị kỳ vọng, số shot và sai số chuẩn, phân biệt trạng thái.', [
  Q('q1', 'For (1/√3)|0⟩ + i√(2/3)|1⟩, P(1) equals|||Với (1/√3)|0⟩ + i√(2/3)|1⟩, P(1) bằng',
    ['i√(2/3)|||i√(2/3)', '1/3|||1/3', '2/3|||2/3', '−2/3|||−2/3'], 2,
    'P(1) = |i√(2/3)|² = 2/3.|||P(1) = |i√(2/3)|² = 2/3.'),
  Q('q2', 'A qubit is measured in the Z basis and gives 1. Measured again immediately, it gives|||Một qubit đo trong cơ sở Z cho 1. Đo lại ngay thì cho',
    ['0 or 1 with the original probabilities|||0 hoặc 1 theo xác suất ban đầu', '1 with certainty|||chắc chắn 1', '0 with certainty|||chắc chắn 0', 'a random phase|||một pha ngẫu nhiên'], 1,
    'The state collapsed to |1⟩.|||Trạng thái đã sụp đổ về |1⟩.'),
  Q('q3', 'Which statement about one copy of an unknown qubit is TRUE?|||Phát biểu nào đúng về MỘT bản sao của qubit chưa biết?',
    ['Measuring it many times reveals α and β|||Đo nhiều lần sẽ lộ ra α và β', 'One measurement yields at most one classical bit|||Một lần đo cho tối đa một bit cổ điển', 'A Z measurement reveals its relative phase|||Phép đo Z cho biết pha tương đối', 'Measuring it leaves the state unchanged|||Phép đo không làm đổi trạng thái'], 1,
    'Measurement collapses the state and returns one bit.|||Phép đo làm sụp đổ trạng thái và trả về một bit.'),
  Q('q4', 'To measure in the X basis on hardware that only reads Z, you first apply|||Để đo cơ sở X trên phần cứng chỉ đọc được Z, trước hết bạn áp',
    ['X|||X', 'S|||S', 'H|||H', 'nothing|||không áp gì'], 2,
    'H maps |+⟩ → |0⟩ and |−⟩ → |1⟩.|||H đưa |+⟩ → |0⟩ và |−⟩ → |1⟩.'),
  Q('q5', 'cos(π/8)|0⟩ + sin(π/8)|1⟩ measured in the X basis gives P(+) ≈|||cos(π/8)|0⟩ + sin(π/8)|1⟩ đo trong cơ sở X cho P(+) ≈',
    ['0.5|||0,5', '0.1464|||0,1464', '0.7071|||0,7071', '0.8536|||0,8536'], 3,
    '(1 + sin(π/4))/2 ≈ 0.8536.|||(1 + sin(π/4))/2 ≈ 0,8536.'),
  Q('q6', 'For 0.6|0⟩ + 0.8i|1⟩, the expectation value ⟨Z⟩ is|||Với 0,6|0⟩ + 0,8i|1⟩, giá trị kỳ vọng ⟨Z⟩ là',
    ['−0.28|||−0,28', '0.28|||0,28', '0.96|||0,96', '1|||1'], 0,
    'P(0) − P(1) = 0.36 − 0.64.|||P(0) − P(1) = 0,36 − 0,64.'),
  Q('q7', 'The triple (⟨X⟩, ⟨Y⟩, ⟨Z⟩) of a single-qubit pure state is|||Bộ ba (⟨X⟩, ⟨Y⟩, ⟨Z⟩) của trạng thái thuần một qubit là',
    ['always (0, 0, 0)|||luôn bằng (0, 0, 0)', 'its Bloch vector|||vectơ Bloch của nó', 'its amplitudes|||các biên độ của nó', 'a set of probabilities summing to 1|||bộ xác suất có tổng bằng 1'], 1,
    'Expectation values of the Pauli observables are the Bloch coordinates.|||Giá trị kỳ vọng của các đại lượng Pauli chính là toạ độ Bloch.'),
  Q('q8', 'With p = 0.5, how many shots give a standard error of 0.01?|||Với p = 0,5, cần bao nhiêu shot để sai số chuẩn bằng 0,01?',
    ['100|||100', '1000|||1000', '2500|||2500', '10 000|||10 000'], 2,
    '√(0.25/N) = 0.01 ⇒ N = 2500.|||√(0,25/N) = 0,01 ⇒ N = 2500.'),
  Q('q9', 'Multiplying the number of shots by 4 makes the error bar|||Nhân số shot lên 4 lần thì thanh sai số',
    ['4 times smaller|||nhỏ đi 4 lần', '2 times smaller|||nhỏ đi 2 lần', '16 times smaller|||nhỏ đi 16 lần', 'unchanged|||không đổi'], 1,
    'SE ∝ 1/√N.|||SE tỉ lệ với 1/√N.'),
  Q('q10', 'Given ONE copy of either |0⟩ or |+⟩ (equal odds), the best possible probability of identifying it is about|||Cho MỘT bản sao, hoặc |0⟩ hoặc |+⟩ (khả năng như nhau), xác suất nhận đúng tốt nhất có thể khoảng',
    ['1|||1', '0.5|||0,5', '0.75|||0,75', '0.854|||0,854'], 3,
    'Helstrom bound 1/2 + (1/2)√(1 − 1/2) ≈ 0.854; a plain Z measurement reaches only 0.75.|||Cận Helstrom 1/2 + (1/2)√(1 − 1/2) ≈ 0,854; đo Z thường chỉ đạt 0,75.'),
]);

const ch3 = {
  title: 'Chapter 3 — Measurement|||Chương 3 — Phép đo',
  description: 'Quy tắc Born và sự sụp đổ, đo trong cơ sở X/Y (đổi cơ sở bằng H, S†), đại lượng quan sát và giá trị kỳ vọng (= vectơ Bloch), số shot và sai số chuẩn, giới hạn phân biệt trạng thái không trực giao (Nielsen & Chuang 2.2.3–2.2.5 · Watrous Lessons 1, 3).',
  lessons: [c31, c32, c33, q3],
};

// ───────────────────────────── Chương 4 — Cổng một qubit ─────────────────────────────
const c41 = L('qtc211-ts-4-1',
  '4.1 — Pauli gates X, Y, Z: bit flip, phase flip and π-rotations|||4.1 — Cổng Pauli X, Y, Z: lật bit, lật pha và phép quay góc π',
  'Cổng X (NOT lượng tử), Z (lật pha), Y = iXZ; tác động lên |0⟩, |1⟩, |±⟩; X² = I, XZ = −ZX; mỗi cổng Pauli là phép quay π quanh một trục của mặt cầu Bloch.',
  `<span class="eyebrow">QTC211 · Chapter 4 · Lesson 4.1</span>
<h2>Pauli gates X, Y, Z: bit flip, phase flip and π-rotations</h2>
<p class="lead">A single-qubit gate is a 2×2 unitary matrix. The three Pauli matrices you met in Lesson 1.3 are the most important gates of all: they are the quantum NOT, the phase flip, and their product — and every error model in Chapter 10 is built from them.</p>
<h3>🎯 Objectives</h3>
<ul><li>Apply X, Y, Z to |0⟩, |1⟩, |+⟩, |−⟩ and to a general state α|0⟩ + β|1⟩.</li><li>Use the algebra X<sup>2</sup> = Y<sup>2</sup> = Z<sup>2</sup> = I, XZ = −ZX and Y = iXZ.</li><li>Describe each Pauli gate as a rotation by π about the x, y or z axis of the Bloch sphere.</li></ul>
<h3>📖 Lecture</h3>
<p>A gate acts on a state by matrix multiplication: |ψ⟩ ↦ U|ψ⟩. Because U is linear, it is enough to know what it does to |0⟩ and |1⟩ — the images are the two columns of U.</p>
<p><strong>X — bit flip (quantum NOT).</strong> X|0⟩ = |1⟩ and X|1⟩ = |0⟩, so X(α|0⟩ + β|1⟩) = β|0⟩ + α|1⟩: the amplitudes swap. On the Hadamard basis X does almost nothing: X|+⟩ = |+⟩ and X|−⟩ = −|−⟩ (|±⟩ are its eigenvectors with eigenvalues ±1).</p>
<p><strong>Z — phase flip.</strong> Z|0⟩ = |0⟩ and Z|1⟩ = −|1⟩, so Z(α|0⟩ + β|1⟩) = α|0⟩ − β|1⟩. Measured in the computational basis, nothing changes (|−β|<sup>2</sup> = |β|<sup>2</sup>); but Z|+⟩ = |−⟩ and Z|−⟩ = |+⟩, so Z is a “bit flip in the Hadamard basis”. This is the first example of a gate that changes only a <em>relative phase</em>, which is invisible in one basis and obvious in another.</p>
<p><strong>Y — both at once.</strong> Y|0⟩ = i|1⟩ and Y|1⟩ = −i|0⟩, so Y(α|0⟩ + β|1⟩) = −iβ|0⟩ + iα|1⟩. Up to the factor i, Y is “first Z, then X”:</p>
<div class="formula"><span class="lbl">Pauli algebra</span>X<sup>2</sup> = Y<sup>2</sup> = Z<sup>2</sup> = I    Y = iXZ    XZ = −ZX    XY = iZ</div>
<p>X<sup>2</sup> = I means each Pauli gate is its own inverse: applying it twice does nothing. XZ = −ZX says X and Z <strong>anticommute</strong>; the order of gates matters, but here only by a global sign.</p>
<p><strong>Geometric picture.</strong> On the Bloch sphere (Chapter 2), a state with Bloch vector (x, y, z) is mapped by X to (x, −y, −z), by Y to (−x, y, −z) and by Z to (−x, −y, z). These are exactly <strong>rotations by π (180°)</strong> about the x-, y- and z-axis. For example X turns the north pole |0⟩ into the south pole |1⟩, while |+⟩, which sits on the x-axis, stays put.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — a general state.</b> |χ⟩ = 0.6|0⟩ + 0.8i|1⟩ (from Chapter 1).</p>
<p>X|χ⟩ = 0.8i|0⟩ + 0.6|1⟩ (swap). Z|χ⟩ = 0.6|0⟩ − 0.8i|1⟩ (sign on |1⟩). Y|χ⟩ = −i(0.8i)|0⟩ + i(0.6)|1⟩ = <b>0.8|0⟩ + 0.6i|1⟩</b>. Check with Y = iXZ: Z|χ⟩ = 0.6|0⟩ − 0.8i|1⟩, then X gives −0.8i|0⟩ + 0.6|1⟩, then ×i gives 0.8|0⟩ + 0.6i|1⟩ ✓.</p></div>
<div class="callout"><p><b>Example 2 — Bloch rotation.</b> |χ⟩ has Bloch vector r = (2 Re(α*β), 2 Im(α*β), |α|<sup>2</sup> − |β|<sup>2</sup>) = (0, 0.96, −0.28). X sends it to (0, −0.96, 0.28), Y to (0, 0.96, 0.28), Z to (0, −0.96, −0.28): each flips the two coordinates perpendicular to its own axis.</p></div>
<div class="callout"><p><b>Example 3 — XZ versus ZX.</b> On |1⟩: XZ|1⟩ = X(−|1⟩) = −|0⟩, while ZX|1⟩ = Z|0⟩ = |0⟩. They differ by the sign −1, as XZ = −ZX predicts.</p></div>
<pre><code class="language-python">import numpy as np
X = np.array([[0, 1], [1, 0]]); Y = np.array([[0, -1j], [1j, 0]]); Z = np.diag([1, -1])
H = np.array([[1, 1], [1, -1]]) / np.sqrt(2)
S = np.diag([1, 1j]); T = np.diag([1, np.exp(1j * np.pi / 4)])
print("Y == iXZ :", np.allclose(Y, 1j * X @ Z))
print("XZ == -ZX:", np.allclose(X @ Z, -Z @ X))
print("HXH == Z :", np.allclose(H @ X @ H, Z), "  HZH == X:", np.allclose(H @ Z @ H, X))
print("S@S == Z :", np.allclose(S @ S, Z), "  T@T == S:", np.allclose(T @ T, S))</code></pre>
<div class="out">Y == iXZ : True
XZ == -ZX: True
HXH == Z : True   HZH == X: True
S@S == Z : True   T@T == S: True</div>
<p>(The last two lines check identities from Lesson 4.2 — keep this snippet as your “identity tester”.)</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Thinking Z “does nothing” because Z|0⟩ = |0⟩. It flips the sign of |1⟩, which is invisible only if you measure in the computational basis.</li><li>Forgetting the i's in Y: Y|0⟩ = i|1⟩, not |1⟩.</li><li>Reading a circuit and multiplying in the wrong order: “first Z, then X” is the matrix XZ (the first gate stands on the right).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>X swaps amplitudes (bit flip); Z negates the |1⟩ amplitude (phase flip); Y = iXZ does both.</li><li>X<sup>2</sup> = Y<sup>2</sup> = Z<sup>2</sup> = I; distinct Paulis anticommute (XZ = −ZX).</li><li>Eigenvectors: X ↔ |±⟩, Z ↔ |0⟩, |1⟩; all eigenvalues are ±1.</li><li>On the Bloch sphere: X, Y, Z = rotation by π about x, y, z.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Pauli_matrices" target="_blank" rel="noopener">Wikipedia — Pauli matrices</a></li><li><a href="https://en.wikipedia.org/wiki/Quantum_logic_gate" target="_blank" rel="noopener">Wikipedia — Quantum logic gate</a></li><li><a href="https://www.youtube.com/watch?v=3-c4xJa7Flk" target="_blank" rel="noopener">Qiskit — Lesson 01: Single Systems (Watrous), unitary operations part</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Compute X|−⟩ and Z|−⟩.</li><li>Show that XYZ = iI.</li><li>Which Pauli gate maps the Bloch vector (1, 0, 0) to (−1, 0, 0) and keeps (0, 1, 0) fixed?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) X|−⟩ = (|1⟩ − |0⟩)/√2 = −|−⟩; Z|−⟩ = (|0⟩ + |1⟩)/√2 = |+⟩. 2) XY = iZ, so XYZ = iZ<sup>2</sup> = iI. 3) Y: it is the π-rotation about the y-axis, so it fixes (0, 1, 0) and reverses x and z.</p></div>`,
  `<span class="eyebrow">QTC211 · Chương 4 · Bài 4.1</span>
<h2>Cổng Pauli X, Y, Z: lật bit, lật pha và phép quay góc π</h2>
<p class="lead">Cổng một qubit là một ma trận unita 2×2. Ba ma trận Pauli bạn gặp ở Bài 1.3 là những cổng quan trọng nhất: NOT lượng tử, lật pha, và tích của chúng — và mọi mô hình lỗi ở Chương 10 đều dựng từ chúng.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Áp X, Y, Z lên |0⟩, |1⟩, |+⟩, |−⟩ và lên trạng thái tổng quát α|0⟩ + β|1⟩.</li><li>Dùng đại số X<sup>2</sup> = Y<sup>2</sup> = Z<sup>2</sup> = I, XZ = −ZX và Y = iXZ.</li><li>Mô tả mỗi cổng Pauli là một phép quay góc π quanh trục x, y hoặc z của mặt cầu Bloch.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Cổng tác động lên trạng thái bằng phép nhân ma trận: |ψ⟩ ↦ U|ψ⟩. Vì U tuyến tính nên chỉ cần biết nó làm gì với |0⟩ và |1⟩ — ảnh của chúng chính là hai cột của U.</p>
<p><strong>X — lật bit (NOT lượng tử).</strong> X|0⟩ = |1⟩ và X|1⟩ = |0⟩, nên X(α|0⟩ + β|1⟩) = β|0⟩ + α|1⟩: hai biên độ đổi chỗ. Trên cơ sở Hadamard, X gần như không làm gì: X|+⟩ = |+⟩ và X|−⟩ = −|−⟩ (|±⟩ là vectơ riêng của X với trị riêng ±1).</p>
<p><strong>Z — lật pha.</strong> Z|0⟩ = |0⟩ và Z|1⟩ = −|1⟩, nên Z(α|0⟩ + β|1⟩) = α|0⟩ − β|1⟩. Đo trong cơ sở tính toán thì không có gì thay đổi (|−β|<sup>2</sup> = |β|<sup>2</sup>); nhưng Z|+⟩ = |−⟩ và Z|−⟩ = |+⟩, nên Z là “lật bit trong cơ sở Hadamard”. Đây là ví dụ đầu tiên về một cổng chỉ đổi <em>pha tương đối</em> — vô hình ở cơ sở này nhưng hiện rõ ở cơ sở khác.</p>
<p><strong>Y — cả hai cùng lúc.</strong> Y|0⟩ = i|1⟩ và Y|1⟩ = −i|0⟩, nên Y(α|0⟩ + β|1⟩) = −iβ|0⟩ + iα|1⟩. Sai khác một thừa số i, Y là “Z trước, rồi X”:</p>
<div class="formula"><span class="lbl">Đại số Pauli</span>X<sup>2</sup> = Y<sup>2</sup> = Z<sup>2</sup> = I    Y = iXZ    XZ = −ZX    XY = iZ</div>
<p>X<sup>2</sup> = I nghĩa là mỗi cổng Pauli là nghịch đảo của chính nó: áp hai lần thì như không làm gì. XZ = −ZX nói X và Z <strong>phản giao hoán</strong>; thứ tự cổng có ý nghĩa, nhưng ở đây chỉ khác nhau một dấu toàn cục.</p>
<p><strong>Hình ảnh hình học.</strong> Trên mặt cầu Bloch (Chương 2), trạng thái có vectơ Bloch (x, y, z) được X biến thành (x, −y, −z), Y thành (−x, y, −z) và Z thành (−x, −y, z). Đó chính là <strong>phép quay π (180°)</strong> quanh trục x, y và z. Ví dụ X đưa cực bắc |0⟩ về cực nam |1⟩, còn |+⟩ nằm trên trục x thì đứng yên.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — trạng thái tổng quát.</b> |χ⟩ = 0,6|0⟩ + 0,8i|1⟩ (từ Chương 1).</p>
<p>X|χ⟩ = 0,8i|0⟩ + 0,6|1⟩ (đổi chỗ). Z|χ⟩ = 0,6|0⟩ − 0,8i|1⟩ (đổi dấu |1⟩). Y|χ⟩ = −i(0,8i)|0⟩ + i(0,6)|1⟩ = <b>0,8|0⟩ + 0,6i|1⟩</b>. Kiểm bằng Y = iXZ: Z|χ⟩ = 0,6|0⟩ − 0,8i|1⟩, áp X được −0,8i|0⟩ + 0,6|1⟩, nhân i được 0,8|0⟩ + 0,6i|1⟩ ✓.</p></div>
<div class="callout"><p><b>Ví dụ 2 — phép quay Bloch.</b> |χ⟩ có vectơ Bloch r = (2 Re(α*β), 2 Im(α*β), |α|<sup>2</sup> − |β|<sup>2</sup>) = (0; 0,96; −0,28). X đưa nó về (0; −0,96; 0,28), Y về (0; 0,96; 0,28), Z về (0; −0,96; −0,28): mỗi cổng lật hai toạ độ vuông góc với trục của chính nó.</p></div>
<div class="callout"><p><b>Ví dụ 3 — XZ so với ZX.</b> Trên |1⟩: XZ|1⟩ = X(−|1⟩) = −|0⟩, còn ZX|1⟩ = Z|0⟩ = |0⟩. Hai kết quả khác nhau dấu −1, đúng như XZ = −ZX.</p></div>
<pre><code class="language-python">import numpy as np
X = np.array([[0, 1], [1, 0]]); Y = np.array([[0, -1j], [1j, 0]]); Z = np.diag([1, -1])
H = np.array([[1, 1], [1, -1]]) / np.sqrt(2)
S = np.diag([1, 1j]); T = np.diag([1, np.exp(1j * np.pi / 4)])
print("Y == iXZ :", np.allclose(Y, 1j * X @ Z))
print("XZ == -ZX:", np.allclose(X @ Z, -Z @ X))
print("HXH == Z :", np.allclose(H @ X @ H, Z), "  HZH == X:", np.allclose(H @ Z @ H, X))
print("S@S == Z :", np.allclose(S @ S, Z), "  T@T == S:", np.allclose(T @ T, S))</code></pre>
<div class="out">Y == iXZ : True
XZ == -ZX: True
HXH == Z : True   HZH == X: True
S@S == Z : True   T@T == S: True</div>
<p>(Hai dòng cuối kiểm các đẳng thức của Bài 4.2 — hãy giữ đoạn code này làm “máy kiểm đẳng thức” của bạn.)</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Nghĩ Z “không làm gì” vì Z|0⟩ = |0⟩. Nó đổi dấu |1⟩, và điều đó chỉ vô hình khi bạn đo trong cơ sở tính toán.</li><li>Quên các thừa số i của Y: Y|0⟩ = i|1⟩, không phải |1⟩.</li><li>Đọc mạch rồi nhân sai thứ tự: “Z trước, rồi X” là ma trận XZ (cổng áp trước đứng bên phải).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>X đổi chỗ hai biên độ (lật bit); Z đổi dấu biên độ của |1⟩ (lật pha); Y = iXZ làm cả hai.</li><li>X<sup>2</sup> = Y<sup>2</sup> = Z<sup>2</sup> = I; hai Pauli khác nhau thì phản giao hoán (XZ = −ZX).</li><li>Vectơ riêng: X ↔ |±⟩, Z ↔ |0⟩, |1⟩; mọi trị riêng đều là ±1.</li><li>Trên mặt cầu Bloch: X, Y, Z = quay π quanh x, y, z.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Pauli_matrices" target="_blank" rel="noopener">Wikipedia — Ma trận Pauli</a></li><li><a href="https://en.wikipedia.org/wiki/Quantum_logic_gate" target="_blank" rel="noopener">Wikipedia — Cổng logic lượng tử</a></li><li><a href="https://www.youtube.com/watch?v=3-c4xJa7Flk" target="_blank" rel="noopener">Qiskit — Lesson 01: Single Systems (Watrous), phần phép biến đổi unita</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tính X|−⟩ và Z|−⟩.</li><li>Chứng minh XYZ = iI.</li><li>Cổng Pauli nào đưa vectơ Bloch (1, 0, 0) về (−1, 0, 0) mà giữ nguyên (0, 1, 0)?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) X|−⟩ = (|1⟩ − |0⟩)/√2 = −|−⟩; Z|−⟩ = (|0⟩ + |1⟩)/√2 = |+⟩. 2) XY = iZ, nên XYZ = iZ<sup>2</sup> = iI. 3) Y: đó là phép quay π quanh trục y, nên giữ (0, 1, 0) và đảo chiều x lẫn z.</p></div>`);

const c42 = L('qtc211-ts-4-2',
  '4.2 — The Hadamard gate and the phase gates S, T, P(φ)|||4.2 — Cổng Hadamard và các cổng pha S, T, P(φ)',
  'Cổng H tạo chồng chập và đổi cơ sở Z ↔ X (H|0⟩ = |+⟩, H² = I, HXH = Z, HZH = X); cổng pha P(φ), S = P(π/2), T = P(π/4), S² = Z, T² = S; T|+⟩ trên mặt cầu Bloch; mạch H–T–H.',
  `<span class="eyebrow">QTC211 · Chapter 4 · Lesson 4.2</span>
<h2>The Hadamard gate and the phase gates S, T, P(φ)</h2>
<p class="lead">The Pauli gates only flip. To create superpositions and to fine-tune phases we need two more families: the Hadamard gate, which switches between the Z and X bases, and the phase gates, which rotate the |1⟩ amplitude by any angle.</p>
<h3>🎯 Objectives</h3>
<ul><li>Apply H and explain it as a change of basis between {|0⟩, |1⟩} and {|+⟩, |−⟩}.</li><li>Use the identities H<sup>2</sup> = I, HXH = Z, HZH = X.</li><li>Define P(φ), S, T and use S<sup>2</sup> = Z, T<sup>2</sup> = S; place S|+⟩ and T|+⟩ on the Bloch sphere.</li><li>Trace a short gate sequence such as H, T, H and compute the measurement probabilities.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Hadamard</span>H = (1/√2) <table class="matrix"><tbody><tr><td>1</td><td>1</td></tr><tr><td>1</td><td>−1</td></tr></tbody></table>    H|0⟩ = |+⟩    H|1⟩ = |−⟩    H|+⟩ = |0⟩    H|−⟩ = |1⟩</div>
<p>H turns a definite bit into an equal superposition: measuring H|0⟩ gives 0 or 1 with probability 1/2 each. Applying H a second time undoes it, <strong>H<sup>2</sup> = I</strong>: (H|+⟩ = (|+⟩ + |−⟩)/√2 = |0⟩). This is the simplest example of <strong>interference</strong>: in H|+⟩ the two paths into |1⟩ carry amplitudes +1/2 and −1/2 and cancel.</p>
<p>Because H swaps the Z basis with the X basis, “conjugating” by H swaps the corresponding Pauli gates: <strong>HXH = Z</strong> and <strong>HZH = X</strong> (and HYH = −Y). Use this whenever a circuit needs an X-type operation but you only have Z-type hardware, or vice versa. On the Bloch sphere H is a rotation by π about the diagonal axis (x + z)/√2, which exchanges the x- and z-axes.</p>
<p>The <strong>phase gate</strong> leaves |0⟩ alone and multiplies |1⟩ by a phase:</p>
<div class="formula"><span class="lbl">Phase gates</span>P(φ) = <table class="matrix"><tbody><tr><td>1</td><td>0</td></tr><tr><td>0</td><td>e<sup>iφ</sup></td></tr></tbody></table>    S = P(π/2) = diag(1, i)    T = P(π/4) = diag(1, e<sup>iπ/4</sup>)    Z = P(π)</div>
<p>Phase gates compose by adding angles, P(a)P(b) = P(a + b). Hence <strong>S<sup>2</sup> = Z</strong>, <strong>T<sup>2</sup> = S</strong> and T<sup>8</sup> = I. On the Bloch sphere P(φ) is a rotation by φ about the z-axis: it does not change the latitude (the probabilities of 0 and 1) but turns the state around the equator. Starting from |+⟩ = (1, 0, 0): S|+⟩ = (|0⟩ + i|1⟩)/√2 = |i⟩ lies at (0, 1, 0), and T|+⟩ = (|0⟩ + e<sup>iπ/4</sup>|1⟩)/√2 lies at (cos 45°, sin 45°, 0) ≈ (0.7071, 0.7071, 0). S and T are not Hermitian: S<sup>†</sup> = diag(1, −i) = P(−π/2) is its inverse, often written S<sub>dg</sub>.</p>
<p>The gates {H, S, CNOT} generate the so-called <strong>Clifford group</strong>; adding T makes the set <strong>universal</strong> (Chapter 6). That is why T gates are the expensive resource counted in fault-tolerant computers.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — HXH = Z by hand.</b> XH = (1/√2)(1, −1; 1, 1). Then H(XH) = (1/2)(1·1 + 1·1, 1·(−1) + 1·1; 1·1 − 1·1, −1 − 1) = (1/2)(2, 0; 0, −2) = <b>Z</b>.</p></div>
<div class="callout"><p><b>Example 2 — the circuit H, T, H on |0⟩.</b> Step 1: H|0⟩ = (|0⟩ + |1⟩)/√2. Step 2: T gives (|0⟩ + e<sup>iπ/4</sup>|1⟩)/√2 — probabilities still 1/2, 1/2, only the phase moved. Step 3: H gives amplitudes (1 + e<sup>iπ/4</sup>)/2 on |0⟩ and (1 − e<sup>iπ/4</sup>)/2 on |1⟩. Probability of 0: |1 + e<sup>iπ/4</sup>|<sup>2</sup>/4 = (2 + 2cos 45°)/4 = cos<sup>2</sup>(π/8) ≈ <b>0.8536</b>, and P(1) ≈ <b>0.1464</b>. The invisible phase from step 2 became a visible bias after the second H: <em>H turns phase into probability</em>.</p></div>
<div class="callout"><p><b>Example 3 — inverse of S.</b> SS<sup>†</sup> = diag(1, i)·diag(1, −i) = diag(1, 1) = I ✓. So to undo an S you apply S<sup>†</sup>, not S again (S·S = Z ≠ I).</p></div>
<p>Run Example 2 in numpy (the same loop is reused in Lesson 4.3):</p>
<pre><code class="language-python">import numpy as np
H = np.array([[1, 1], [1, -1]]) / np.sqrt(2)
T = np.diag([1, np.exp(1j * np.pi / 4)])
state = np.array([1, 0], dtype=complex)
for gate in (H, T, H):
    state = gate @ state
print(np.round(state, 4), np.round(np.abs(state) ** 2, 4), round(np.cos(np.pi / 8) ** 2, 4))</code></pre>
<div class="out">[0.8536+0.3536j 0.1464-0.3536j] [0.8536 0.1464] 0.8536</div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Writing T = diag(1, e<sup>iπ/8</sup>) — the old name “π/8 gate” misleads; with our convention T = diag(1, e<sup>iπ/4</sup>).</li><li>Believing a phase gate is useless because it never changes P(0) and P(1). It matters as soon as an H (or any basis change) follows.</li><li>Assuming H applied twice gives a “double superposition”. H<sup>2</sup> = I: you get back exactly where you started.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>H: |0⟩ ↔ |+⟩, |1⟩ ↔ |−⟩; H<sup>2</sup> = I; HXH = Z, HZH = X.</li><li>P(φ) = diag(1, e<sup>iφ</sup>) rotates about the z-axis by φ; S = P(π/2), T = P(π/4), Z = P(π).</li><li>S<sup>2</sup> = Z, T<sup>2</sup> = S; inverses are S<sup>†</sup>, T<sup>†</sup>.</li><li>A phase becomes measurable after a basis change: H·P(φ)·H.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Hadamard_transform" target="_blank" rel="noopener">Wikipedia — Hadamard transform (the H gate and H⊗n)</a></li><li><a href="https://en.wikipedia.org/wiki/Clifford_gates" target="_blank" rel="noopener">Wikipedia — Clifford gates</a></li><li><a href="https://github.com/Qiskit/documentation/blob/main/learning/courses/basics-of-quantum-information/single-systems/qiskit-implementation.ipynb" target="_blank" rel="noopener">IBM Quantum Learning (Watrous) — Single systems: Qiskit implementation (source notebook)</a></li><li><a href="https://algassert.com/quirk" target="_blank" rel="noopener">Quirk — build H, T, H and watch the Bloch sphere</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Compute H|i⟩ where |i⟩ = (|0⟩ + i|1⟩)/√2, and the probability of measuring 0.</li><li>Show that S|+⟩ = |i⟩ and give its Bloch vector.</li><li>What is H·Z·H applied to |0⟩?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) H|i⟩ = ((1 + i)|0⟩ + (1 − i)|1⟩)/2; P(0) = |1 + i|<sup>2</sup>/4 = 2/4 = 1/2. 2) S|+⟩ = (|0⟩ + i|1⟩)/√2 = |i⟩, Bloch vector (0, 1, 0). 3) HZH = X, so the result is X|0⟩ = |1⟩.</p></div>`,
  `<span class="eyebrow">QTC211 · Chương 4 · Bài 4.2</span>
<h2>Cổng Hadamard và các cổng pha S, T, P(φ)</h2>
<p class="lead">Cổng Pauli chỉ biết lật. Muốn tạo chồng chập và tinh chỉnh pha ta cần thêm hai họ cổng: cổng Hadamard, chuyển qua lại giữa cơ sở Z và cơ sở X, và các cổng pha, xoay biên độ của |1⟩ một góc tuỳ ý.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Áp H và giải thích nó là phép đổi cơ sở giữa {|0⟩, |1⟩} và {|+⟩, |−⟩}.</li><li>Dùng các đẳng thức H<sup>2</sup> = I, HXH = Z, HZH = X.</li><li>Định nghĩa P(φ), S, T và dùng S<sup>2</sup> = Z, T<sup>2</sup> = S; đặt S|+⟩ và T|+⟩ lên mặt cầu Bloch.</li><li>Lần một dãy cổng ngắn như H, T, H và tính xác suất đo.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Hadamard</span>H = (1/√2) <table class="matrix"><tbody><tr><td>1</td><td>1</td></tr><tr><td>1</td><td>−1</td></tr></tbody></table>    H|0⟩ = |+⟩    H|1⟩ = |−⟩    H|+⟩ = |0⟩    H|−⟩ = |1⟩</div>
<p>H biến một bit xác định thành chồng chập đều: đo H|0⟩ được 0 hoặc 1, mỗi kết quả xác suất 1/2. Áp H lần thứ hai thì hoàn tác, <strong>H<sup>2</sup> = I</strong>: (H|+⟩ = (|+⟩ + |−⟩)/√2 = |0⟩). Đây là ví dụ đơn giản nhất về <strong>giao thoa</strong>: trong H|+⟩, hai “đường” đi vào |1⟩ mang biên độ +1/2 và −1/2 nên triệt tiêu nhau.</p>
<p>Vì H đổi cơ sở Z với cơ sở X, “kẹp” một cổng giữa hai H sẽ đổi các cổng Pauli tương ứng: <strong>HXH = Z</strong> và <strong>HZH = X</strong> (và HYH = −Y). Dùng điều này mỗi khi mạch cần thao tác kiểu X mà phần cứng chỉ có thao tác kiểu Z, hoặc ngược lại. Trên mặt cầu Bloch, H là phép quay π quanh trục chéo (x + z)/√2, đổi chỗ trục x và trục z.</p>
<p><strong>Cổng pha</strong> giữ nguyên |0⟩ và nhân |1⟩ với một pha:</p>
<div class="formula"><span class="lbl">Cổng pha</span>P(φ) = <table class="matrix"><tbody><tr><td>1</td><td>0</td></tr><tr><td>0</td><td>e<sup>iφ</sup></td></tr></tbody></table>    S = P(π/2) = diag(1, i)    T = P(π/4) = diag(1, e<sup>iπ/4</sup>)    Z = P(π)</div>
<p>Ghép các cổng pha thì cộng góc, P(a)P(b) = P(a + b). Do đó <strong>S<sup>2</sup> = Z</strong>, <strong>T<sup>2</sup> = S</strong> và T<sup>8</sup> = I. Trên mặt cầu Bloch, P(φ) là phép quay góc φ quanh trục z: nó không đổi vĩ độ (xác suất ra 0 và 1) mà chỉ xoay trạng thái dọc theo đường xích đạo. Xuất phát từ |+⟩ = (1, 0, 0): S|+⟩ = (|0⟩ + i|1⟩)/√2 = |i⟩ nằm ở (0, 1, 0), còn T|+⟩ = (|0⟩ + e<sup>iπ/4</sup>|1⟩)/√2 nằm ở (cos 45°, sin 45°, 0) ≈ (0,7071; 0,7071; 0). S và T không Hermite: S<sup>†</sup> = diag(1, −i) = P(−π/2) là nghịch đảo của S, hay được viết là S<sub>dg</sub>.</p>
<p>Các cổng {H, S, CNOT} sinh ra cái gọi là <strong>nhóm Clifford</strong>; thêm T vào thì tập cổng trở nên <strong>vạn năng</strong> (Chương 6). Vì thế cổng T là “tài nguyên đắt” được đếm kỹ trong máy tính lượng tử chịu lỗi.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — HXH = Z bằng tay.</b> XH = (1/√2)(1, −1; 1, 1). Khi đó H(XH) = (1/2)(1·1 + 1·1, 1·(−1) + 1·1; 1·1 − 1·1, −1 − 1) = (1/2)(2, 0; 0, −2) = <b>Z</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2 — mạch H, T, H trên |0⟩.</b> Bước 1: H|0⟩ = (|0⟩ + |1⟩)/√2. Bước 2: T cho (|0⟩ + e<sup>iπ/4</sup>|1⟩)/√2 — xác suất vẫn 1/2, 1/2, chỉ pha dịch đi. Bước 3: H cho biên độ (1 + e<sup>iπ/4</sup>)/2 ở |0⟩ và (1 − e<sup>iπ/4</sup>)/2 ở |1⟩. Xác suất ra 0: |1 + e<sup>iπ/4</sup>|<sup>2</sup>/4 = (2 + 2cos 45°)/4 = cos<sup>2</sup>(π/8) ≈ <b>0,8536</b>, và P(1) ≈ <b>0,1464</b>. Pha vô hình ở bước 2 đã thành độ lệch thấy được sau H thứ hai: <em>H biến pha thành xác suất</em>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — nghịch đảo của S.</b> SS<sup>†</sup> = diag(1, i)·diag(1, −i) = diag(1, 1) = I ✓. Vậy muốn hoàn tác S thì áp S<sup>†</sup>, không phải áp S lần nữa (S·S = Z ≠ I).</p></div>
<p>Chạy Ví dụ 2 bằng numpy (vòng lặp này dùng lại ở Bài 4.3):</p>
<pre><code class="language-python">import numpy as np
H = np.array([[1, 1], [1, -1]]) / np.sqrt(2)
T = np.diag([1, np.exp(1j * np.pi / 4)])
state = np.array([1, 0], dtype=complex)
for gate in (H, T, H):
    state = gate @ state
print(np.round(state, 4), np.round(np.abs(state) ** 2, 4), round(np.cos(np.pi / 8) ** 2, 4))</code></pre>
<div class="out">[0.8536+0.3536j 0.1464-0.3536j] [0.8536 0.1464] 0.8536</div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Viết T = diag(1, e<sup>iπ/8</sup>) — cái tên cũ “cổng π/8” dễ gây nhầm; theo quy ước của khoá, T = diag(1, e<sup>iπ/4</sup>).</li><li>Tưởng cổng pha vô dụng vì nó không bao giờ đổi P(0) và P(1). Nó có tác dụng ngay khi theo sau là một H (hay bất kỳ phép đổi cơ sở nào).</li><li>Nghĩ áp H hai lần ra “chồng chập kép”. H<sup>2</sup> = I: bạn quay về đúng chỗ cũ.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>H: |0⟩ ↔ |+⟩, |1⟩ ↔ |−⟩; H<sup>2</sup> = I; HXH = Z, HZH = X.</li><li>P(φ) = diag(1, e<sup>iφ</sup>) quay quanh trục z góc φ; S = P(π/2), T = P(π/4), Z = P(π).</li><li>S<sup>2</sup> = Z, T<sup>2</sup> = S; nghịch đảo là S<sup>†</sup>, T<sup>†</sup>.</li><li>Pha trở nên đo được sau một phép đổi cơ sở: H·P(φ)·H.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Hadamard_transform" target="_blank" rel="noopener">Wikipedia — Biến đổi Hadamard (cổng H và H⊗n)</a></li><li><a href="https://en.wikipedia.org/wiki/Clifford_gates" target="_blank" rel="noopener">Wikipedia — Cổng Clifford</a></li><li><a href="https://github.com/Qiskit/documentation/blob/main/learning/courses/basics-of-quantum-information/single-systems/qiskit-implementation.ipynb" target="_blank" rel="noopener">IBM Quantum Learning (Watrous) — Hệ đơn: cài đặt bằng Qiskit (notebook gốc)</a></li><li><a href="https://algassert.com/quirk" target="_blank" rel="noopener">Quirk — dựng H, T, H rồi xem mặt cầu Bloch</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tính H|i⟩ với |i⟩ = (|0⟩ + i|1⟩)/√2, và xác suất đo ra 0.</li><li>Chứng minh S|+⟩ = |i⟩ và cho vectơ Bloch của nó.</li><li>H·Z·H áp lên |0⟩ cho gì?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) H|i⟩ = ((1 + i)|0⟩ + (1 − i)|1⟩)/2; P(0) = |1 + i|<sup>2</sup>/4 = 2/4 = 1/2. 2) S|+⟩ = (|0⟩ + i|1⟩)/√2 = |i⟩, vectơ Bloch (0, 1, 0). 3) HZH = X, nên kết quả là X|0⟩ = |1⟩.</p></div>`);

const c43 = L('qtc211-ts-4-3',
  '4.3 — Rotation gates Rx, Ry, Rz and arbitrary single-qubit unitaries|||4.3 — Cổng quay Rx, Ry, Rz và cổng một qubit tổng quát',
  'Cổng quay R(θ) = exp(−iθσ/2) = cos(θ/2)I − i sin(θ/2)σ, Rz(φ) và P(φ) khác nhau một pha toàn cục, phân tích ZYZ của mọi cổng một qubit, chọn θ để có xác suất mong muốn, mô phỏng một qubit bằng numpy.',
  `<span class="eyebrow">QTC211 · Chapter 4 · Lesson 4.3</span>
<h2>Rotation gates Rx, Ry, Rz and arbitrary single-qubit unitaries</h2>
<p class="lead">Pauli, H, S and T are special angles. Real hardware and variational algorithms use continuous <strong>rotation gates</strong> with a tunable angle θ — and any single-qubit gate whatsoever can be written as three of them.</p>
<h3>🎯 Objectives</h3>
<ul><li>Write Rx(θ), Ry(θ), Rz(θ) as matrices using cos(θ/2) and sin(θ/2).</li><li>Explain why Rz(φ) and P(φ) are “the same gate” (they differ by a global phase).</li><li>Choose θ so that Ry(θ)|0⟩ has a prescribed probability of 1.</li><li>State the ZYZ decomposition and simulate a gate sequence on one qubit in numpy.</li></ul>
<h3>📖 Lecture</h3>
<p>For a Pauli matrix σ ∈ {X, Y, Z} the <strong>rotation by θ about the σ-axis</strong> is R<sub>σ</sub>(θ) = exp(−iθσ/2). Because σ<sup>2</sup> = I, the exponential series collapses to a simple formula:</p>
<div class="formula"><span class="lbl">Rotation gates</span>R<sub>σ</sub>(θ) = cos(θ/2) I − i sin(θ/2) σ</div>
<div class="formula"><span class="lbl">Matrices</span>Rx(θ) = <table class="matrix"><tbody><tr><td>cos(θ/2)</td><td>−i sin(θ/2)</td></tr><tr><td>−i sin(θ/2)</td><td>cos(θ/2)</td></tr></tbody></table>   Ry(θ) = <table class="matrix"><tbody><tr><td>cos(θ/2)</td><td>−sin(θ/2)</td></tr><tr><td>sin(θ/2)</td><td>cos(θ/2)</td></tr></tbody></table>   Rz(θ) = <table class="matrix"><tbody><tr><td>e<sup>−iθ/2</sup></td><td>0</td></tr><tr><td>0</td><td>e<sup>iθ/2</sup></td></tr></tbody></table></div>
<p>On the Bloch sphere R<sub>σ</sub>(θ) rotates the Bloch vector by the angle θ about the σ-axis. Why θ/2 in the matrix? Because the Bloch angle of a state is twice the angle inside the vector (|ψ⟩ = cos(θ/2)|0⟩ + …). Consequently a full turn θ = 2π gives R = −I, a global phase −1 that no measurement can detect.</p>
<p><strong>Relation with the earlier gates.</strong> Rx(π) = −iX, Ry(π) = −iY, Rz(π) = −iZ: each Pauli gate is a π-rotation up to the global phase −i. Similarly <strong>Rz(φ) = e<sup>−iφ/2</sup> P(φ)</strong>; because a global phase is unobservable, Rz(φ) and P(φ) implement the same physical operation, and S, T are z-rotations by π/2 and π/4. (Global phases <em>do</em> matter once a gate is controlled — Chapter 5.)</p>
<p><strong>Preparing a state with a given probability.</strong> Ry(θ)|0⟩ = cos(θ/2)|0⟩ + sin(θ/2)|1⟩ has real amplitudes, so P(1) = sin<sup>2</sup>(θ/2). To get P(1) = p, choose θ = 2 arcsin(√p).</p>
<p><strong>Every single-qubit gate is three rotations.</strong> For any 2×2 unitary U there are real numbers α, β, γ, δ with</p>
<div class="formula"><span class="lbl">ZYZ decomposition</span>U = e<sup>iα</sup> Rz(β) Ry(γ) Rz(δ)</div>
<p>(Nielsen &amp; Chuang, Theorem 4.1). Example: H = e<sup>iπ/2</sup> Ry(π/2) Rz(π) — first a z-rotation by π, then a y-rotation by π/2, up to the global phase i. Hardware vendors use exactly such decompositions: IBM devices, for instance, implement z-rotations “virtually” in software and build every other single-qubit gate from them plus fixed √X pulses.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — P(1) = 1/4.</b> Need sin<sup>2</sup>(θ/2) = 1/4, so sin(θ/2) = 1/2, θ/2 = π/6, <b>θ = π/3</b>. Then Ry(π/3)|0⟩ = (√3/2)|0⟩ + (1/2)|1⟩ ≈ 0.866|0⟩ + 0.5|1⟩, with P(0) = 0.75 and P(1) = 0.25.</p></div>
<div class="callout"><p><b>Example 2 — Rx(π/2) on |0⟩.</b> cos(π/4) = sin(π/4) = 1/√2, so Rx(π/2)|0⟩ = (|0⟩ − i|1⟩)/√2 = |−i⟩. Bloch vector (0, −1, 0): the north pole rotated by 90° about x lands on the −y axis (right-hand rule).</p></div>
<div class="callout"><p><b>Example 3 — Rz versus S on |+⟩.</b> S|+⟩ = (|0⟩ + i|1⟩)/√2, while Rz(π/2)|+⟩ = (e<sup>−iπ/4</sup>|0⟩ + e<sup>iπ/4</sup>|1⟩)/√2 = e<sup>−iπ/4</sup> S|+⟩. Same state up to a global phase, same Bloch point (0, 1, 0).</p></div>
<p><b>A one-qubit simulator in a few lines.</b> A state is a length-2 complex vector; a circuit is a list of 2×2 matrices applied left to right in time:</p>
<pre><code class="language-python">import numpy as np
H = np.array([[1, 1], [1, -1]]) / np.sqrt(2)
T = np.diag([1, np.exp(1j * np.pi / 4)])
def Ry(theta):
    c, s = np.cos(theta / 2), np.sin(theta / 2)
    return np.array([[c, -s], [s, c]])

state = np.array([1, 0], dtype=complex)            # start in |0&gt;
for name, gate in [("H", H), ("T", T), ("H", H)]:
    state = gate @ state                           # apply the next gate
    p0, p1 = np.abs(state) ** 2
    print(f"after {name}: amplitudes {np.round(state, 4)}  P(0)={p0:.4f} P(1)={p1:.4f}")

print("Ry(pi/3)|0&gt; probabilities:", np.round(np.abs(Ry(np.pi / 3) @ [1, 0]) ** 2, 4))</code></pre>
<div class="out">after H: amplitudes [0.7071+0.j 0.7071+0.j]  P(0)=0.5000 P(1)=0.5000
after T: amplitudes [0.7071+0.j  0.5   +0.5j]  P(0)=0.5000 P(1)=0.5000
after H: amplitudes [0.8536+0.3536j 0.1464-0.3536j]  P(0)=0.8536 P(1)=0.1464
Ry(pi/3)|0&gt; probabilities: [0.75 0.25]</div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using θ instead of θ/2 in the matrix: Ry(θ) has cos(θ/2), not cos θ. Ry(π) maps |0⟩ to |1⟩; Ry(π/2) only reaches the equator.</li><li>Applying the ZYZ factors in the wrong order: in U = e<sup>iα</sup>Rz(β)Ry(γ)Rz(δ) the gate applied <em>first</em> is Rz(δ).</li><li>Panicking about a global phase in a numerical check: compare states with |⟨φ|ψ⟩| = 1, not entry by entry.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>R<sub>σ</sub>(θ) = exp(−iθσ/2) = cos(θ/2)I − i sin(θ/2)σ rotates the Bloch vector by θ about σ.</li><li>Pauli = π-rotation up to −i; Rz(φ) = e<sup>−iφ/2</sup>P(φ), so S, T are z-rotations.</li><li>Ry(θ)|0⟩ has P(1) = sin<sup>2</sup>(θ/2); θ = 2 arcsin(√p).</li><li>Any single-qubit unitary = e<sup>iα</sup>Rz(β)Ry(γ)Rz(δ).</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Bloch_sphere" target="_blank" rel="noopener">Wikipedia — Bloch sphere (rotation operators)</a></li><li><a href="https://en.wikipedia.org/wiki/Quantum_logic_gate" target="_blank" rel="noopener">Wikipedia — Quantum logic gate (rotation operator gates)</a></li><li><a href="https://quantum.country/qcvc" target="_blank" rel="noopener">Matuschak &amp; Nielsen — Quantum computing for the very curious (single-qubit gates)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Which θ gives Ry(θ)|0⟩ with P(1) = 0.9? (Give θ in radians and degrees.)</li><li>Show that Rx(π/2)·Rx(π/2) = Rx(π).</li><li>Show that X = i·Rx(π).</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) θ = 2 arcsin(√0.9) ≈ 2.4981 rad ≈ 143.13°. 2) Rotations about the same axis add their angles: Rx(a)Rx(b) = Rx(a + b), so Rx(π/2)<sup>2</sup> = Rx(π). 3) Rx(π) = cos(π/2)I − i sin(π/2)X = −iX, so i·Rx(π) = −i<sup>2</sup>X = X.</p></div>`,
  `<span class="eyebrow">QTC211 · Chương 4 · Bài 4.3</span>
<h2>Cổng quay Rx, Ry, Rz và cổng một qubit tổng quát</h2>
<p class="lead">Pauli, H, S, T là các góc đặc biệt. Phần cứng thật và thuật toán biến phân dùng <strong>cổng quay</strong> liên tục với góc θ chỉnh được — và mọi cổng một qubit bất kỳ đều viết được thành ba cổng quay.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Viết Rx(θ), Ry(θ), Rz(θ) dạng ma trận bằng cos(θ/2) và sin(θ/2).</li><li>Giải thích vì sao Rz(φ) và P(φ) là “cùng một cổng” (khác nhau một pha toàn cục).</li><li>Chọn θ để Ry(θ)|0⟩ có xác suất ra 1 cho trước.</li><li>Phát biểu phân tích ZYZ và mô phỏng một dãy cổng trên một qubit bằng numpy.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Với ma trận Pauli σ ∈ {X, Y, Z}, <strong>phép quay góc θ quanh trục σ</strong> là R<sub>σ</sub>(θ) = exp(−iθσ/2). Vì σ<sup>2</sup> = I nên chuỗi luỹ thừa của hàm mũ rút gọn thành công thức đơn giản:</p>
<div class="formula"><span class="lbl">Cổng quay</span>R<sub>σ</sub>(θ) = cos(θ/2) I − i sin(θ/2) σ</div>
<div class="formula"><span class="lbl">Ma trận</span>Rx(θ) = <table class="matrix"><tbody><tr><td>cos(θ/2)</td><td>−i sin(θ/2)</td></tr><tr><td>−i sin(θ/2)</td><td>cos(θ/2)</td></tr></tbody></table>   Ry(θ) = <table class="matrix"><tbody><tr><td>cos(θ/2)</td><td>−sin(θ/2)</td></tr><tr><td>sin(θ/2)</td><td>cos(θ/2)</td></tr></tbody></table>   Rz(θ) = <table class="matrix"><tbody><tr><td>e<sup>−iθ/2</sup></td><td>0</td></tr><tr><td>0</td><td>e<sup>iθ/2</sup></td></tr></tbody></table></div>
<p>Trên mặt cầu Bloch, R<sub>σ</sub>(θ) quay vectơ Bloch một góc θ quanh trục σ. Vì sao trong ma trận lại là θ/2? Vì góc Bloch của trạng thái gấp đôi góc nằm trong vectơ (|ψ⟩ = cos(θ/2)|0⟩ + …). Hệ quả: quay trọn vòng θ = 2π cho R = −I, một pha toàn cục −1 mà không phép đo nào phát hiện được.</p>
<p><strong>Quan hệ với các cổng trước.</strong> Rx(π) = −iX, Ry(π) = −iY, Rz(π) = −iZ: mỗi cổng Pauli là phép quay π, sai khác pha toàn cục −i. Tương tự <strong>Rz(φ) = e<sup>−iφ/2</sup> P(φ)</strong>; vì pha toàn cục không quan sát được nên Rz(φ) và P(φ) thực hiện cùng một thao tác vật lý, và S, T là phép quay quanh z góc π/2 và π/4. (Pha toàn cục <em>có</em> ý nghĩa khi cổng được điều khiển — Chương 5.)</p>
<p><strong>Chuẩn bị trạng thái có xác suất cho trước.</strong> Ry(θ)|0⟩ = cos(θ/2)|0⟩ + sin(θ/2)|1⟩ có biên độ thực, nên P(1) = sin<sup>2</sup>(θ/2). Muốn P(1) = p thì chọn θ = 2 arcsin(√p).</p>
<p><strong>Mọi cổng một qubit là ba phép quay.</strong> Với mọi ma trận unita 2×2 U, tồn tại các số thực α, β, γ, δ sao cho</p>
<div class="formula"><span class="lbl">Phân tích ZYZ</span>U = e<sup>iα</sup> Rz(β) Ry(γ) Rz(δ)</div>
<p>(Nielsen &amp; Chuang, Định lý 4.1). Ví dụ: H = e<sup>iπ/2</sup> Ry(π/2) Rz(π) — trước tiên quay quanh z góc π, rồi quay quanh y góc π/2, sai khác pha toàn cục i. Các hãng phần cứng dùng đúng kiểu phân tích này: chẳng hạn máy IBM thực hiện phép quay quanh z “ảo” bằng phần mềm và dựng mọi cổng một qubit khác từ chúng cùng các xung √X cố định.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — P(1) = 1/4.</b> Cần sin<sup>2</sup>(θ/2) = 1/4, nên sin(θ/2) = 1/2, θ/2 = π/6, <b>θ = π/3</b>. Khi đó Ry(π/3)|0⟩ = (√3/2)|0⟩ + (1/2)|1⟩ ≈ 0,866|0⟩ + 0,5|1⟩, với P(0) = 0,75 và P(1) = 0,25.</p></div>
<div class="callout"><p><b>Ví dụ 2 — Rx(π/2) trên |0⟩.</b> cos(π/4) = sin(π/4) = 1/√2, nên Rx(π/2)|0⟩ = (|0⟩ − i|1⟩)/√2 = |−i⟩. Vectơ Bloch (0, −1, 0): cực bắc quay 90° quanh trục x thì rơi xuống trục −y (quy tắc bàn tay phải).</p></div>
<div class="callout"><p><b>Ví dụ 3 — Rz so với S trên |+⟩.</b> S|+⟩ = (|0⟩ + i|1⟩)/√2, còn Rz(π/2)|+⟩ = (e<sup>−iπ/4</sup>|0⟩ + e<sup>iπ/4</sup>|1⟩)/√2 = e<sup>−iπ/4</sup> S|+⟩. Cùng một trạng thái sai khác pha toàn cục, cùng điểm Bloch (0, 1, 0).</p></div>
<p><b>Trình mô phỏng một qubit trong vài dòng.</b> Trạng thái là vectơ phức độ dài 2; mạch là danh sách ma trận 2×2 áp lần lượt theo thời gian:</p>
<pre><code class="language-python">import numpy as np
H = np.array([[1, 1], [1, -1]]) / np.sqrt(2)
T = np.diag([1, np.exp(1j * np.pi / 4)])
def Ry(theta):
    c, s = np.cos(theta / 2), np.sin(theta / 2)
    return np.array([[c, -s], [s, c]])

state = np.array([1, 0], dtype=complex)            # start in |0&gt;
for name, gate in [("H", H), ("T", T), ("H", H)]:
    state = gate @ state                           # apply the next gate
    p0, p1 = np.abs(state) ** 2
    print(f"after {name}: amplitudes {np.round(state, 4)}  P(0)={p0:.4f} P(1)={p1:.4f}")

print("Ry(pi/3)|0&gt; probabilities:", np.round(np.abs(Ry(np.pi / 3) @ [1, 0]) ** 2, 4))</code></pre>
<div class="out">after H: amplitudes [0.7071+0.j 0.7071+0.j]  P(0)=0.5000 P(1)=0.5000
after T: amplitudes [0.7071+0.j  0.5   +0.5j]  P(0)=0.5000 P(1)=0.5000
after H: amplitudes [0.8536+0.3536j 0.1464-0.3536j]  P(0)=0.8536 P(1)=0.1464
Ry(pi/3)|0&gt; probabilities: [0.75 0.25]</div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng θ thay cho θ/2 trong ma trận: Ry(θ) chứa cos(θ/2), không phải cos θ. Ry(π) đưa |0⟩ thành |1⟩; Ry(π/2) chỉ tới được xích đạo.</li><li>Áp các thừa số ZYZ sai thứ tự: trong U = e<sup>iα</sup>Rz(β)Ry(γ)Rz(δ), cổng được áp <em>đầu tiên</em> là Rz(δ).</li><li>Hoảng vì một pha toàn cục khi kiểm số: hãy so hai trạng thái bằng |⟨φ|ψ⟩| = 1, đừng so từng phần tử.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>R<sub>σ</sub>(θ) = exp(−iθσ/2) = cos(θ/2)I − i sin(θ/2)σ quay vectơ Bloch góc θ quanh σ.</li><li>Pauli = quay π, sai khác −i; Rz(φ) = e<sup>−iφ/2</sup>P(φ), nên S, T là phép quay quanh z.</li><li>Ry(θ)|0⟩ có P(1) = sin<sup>2</sup>(θ/2); θ = 2 arcsin(√p).</li><li>Mọi cổng một qubit = e<sup>iα</sup>Rz(β)Ry(γ)Rz(δ).</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Bloch_sphere" target="_blank" rel="noopener">Wikipedia — Mặt cầu Bloch (toán tử quay)</a></li><li><a href="https://en.wikipedia.org/wiki/Quantum_logic_gate" target="_blank" rel="noopener">Wikipedia — Cổng logic lượng tử (cổng quay)</a></li><li><a href="https://quantum.country/qcvc" target="_blank" rel="noopener">Matuschak &amp; Nielsen — Quantum computing for the very curious (cổng một qubit)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>θ bằng bao nhiêu để Ry(θ)|0⟩ có P(1) = 0,9? (Cho θ theo radian và độ.)</li><li>Chứng minh Rx(π/2)·Rx(π/2) = Rx(π).</li><li>Chứng minh X = i·Rx(π).</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) θ = 2 arcsin(√0,9) ≈ 2,4981 rad ≈ 143,13°. 2) Hai phép quay cùng trục thì cộng góc: Rx(a)Rx(b) = Rx(a + b), nên Rx(π/2)<sup>2</sup> = Rx(π). 3) Rx(π) = cos(π/2)I − i sin(π/2)X = −iX, nên i·Rx(π) = −i<sup>2</sup>X = X.</p></div>`);

const q4 = QZ(4, 'Quiz — Chapter 4: Single-qubit gates|||Quiz — Chương 4: Cổng một qubit', 'Kiểm tra chương 4: cổng Pauli, Hadamard, cổng pha S/T/P(φ), cổng quay Rx/Ry/Rz, pha toàn cục, phân tích ZYZ.', [
  Q('q1', 'X(α|0⟩ + β|1⟩) equals|||X(α|0⟩ + β|1⟩) bằng',
    ['α|0⟩ − β|1⟩|||α|0⟩ − β|1⟩', 'β|0⟩ + α|1⟩|||β|0⟩ + α|1⟩', '−iβ|0⟩ + iα|1⟩|||−iβ|0⟩ + iα|1⟩', 'α|1⟩ − β|0⟩|||α|1⟩ − β|0⟩'], 1,
    'X swaps the amplitudes (bit flip). α|0⟩ − β|1⟩ is Z, and −iβ|0⟩ + iα|1⟩ is Y.|||X đổi chỗ hai biên độ (lật bit). α|0⟩ − β|1⟩ là Z, còn −iβ|0⟩ + iα|1⟩ là Y.'),
  Q('q2', 'Z|+⟩ equals|||Z|+⟩ bằng',
    ['|+⟩||||+⟩', '|0⟩||||0⟩', '|−⟩||||−⟩', '−|+⟩|||−|+⟩'], 2,
    'Z negates the |1⟩ amplitude: (|0⟩ − |1⟩)/√2 = |−⟩.|||Z đổi dấu biên độ của |1⟩: (|0⟩ − |1⟩)/√2 = |−⟩.'),
  Q('q3', 'Which identity is FALSE?|||Đẳng thức nào SAI?',
    ['X² = I|||X² = I', 'XZ = ZX|||XZ = ZX', 'Y = iXZ|||Y = iXZ', 'HXH = Z|||HXH = Z'], 1,
    'X and Z anticommute: XZ = −ZX.|||X và Z phản giao hoán: XZ = −ZX.'),
  Q('q4', 'On the Bloch sphere, the Z gate is|||Trên mặt cầu Bloch, cổng Z là',
    ['a rotation by π about the z-axis|||phép quay π quanh trục z', 'a reflection through the origin|||phép đối xứng qua tâm', 'a rotation by π/2 about the x-axis|||phép quay π/2 quanh trục x', 'a projection onto the z-axis|||phép chiếu lên trục z'], 0,
    '(x, y, z) ↦ (−x, −y, z).|||(x, y, z) ↦ (−x, −y, z).'),
  Q('q5', 'After the sequence H, T, H on |0⟩, the probability of measuring 0 is about|||Sau dãy H, T, H trên |0⟩, xác suất đo ra 0 xấp xỉ',
    ['0.5|||0,5', '1|||1', '0.1464|||0,1464', '0.8536|||0,8536'], 3,
    'P(0) = cos²(π/8) ≈ 0.8536: H turns the phase from T into probability.|||P(0) = cos²(π/8) ≈ 0,8536: H biến pha của T thành xác suất.'),
  Q('q6', 'Which relation between phase gates is correct?|||Quan hệ nào giữa các cổng pha là đúng?',
    ['T² = Z|||T² = Z', 'S² = I|||S² = I', 'T² = S|||T² = S', 'S = P(π/4)|||S = P(π/4)'], 2,
    'P(a)P(b) = P(a + b): T² = P(π/2) = S, S² = P(π) = Z.|||P(a)P(b) = P(a + b): T² = P(π/2) = S, S² = P(π) = Z.'),
  Q('q7', 'Ry(θ)|0⟩ has P(1) = 1/4 when θ =|||Ry(θ)|0⟩ có P(1) = 1/4 khi θ =',
    ['π/4|||π/4', 'π/3|||π/3', 'π/6|||π/6', 'π/2|||π/2'], 1,
    'P(1) = sin²(θ/2) = 1/4 ⇒ θ/2 = π/6 ⇒ θ = π/3.|||P(1) = sin²(θ/2) = 1/4 ⇒ θ/2 = π/6 ⇒ θ = π/3.'),
  Q('q8', 'Rz(φ) and P(φ) are related by|||Rz(φ) và P(φ) liên hệ với nhau bởi',
    ['Rz(φ) = P(2φ)|||Rz(φ) = P(2φ)', 'Rz(φ) = P(φ)†|||Rz(φ) = P(φ)†', 'Rz(φ) = e^(−iφ/2) P(φ)|||Rz(φ) = e^(−iφ/2) P(φ)', 'they are unrelated|||chúng không liên quan'], 2,
    'They differ by a global phase only, so they are physically the same gate.|||Chúng chỉ khác một pha toàn cục, nên về mặt vật lý là cùng một cổng.'),
  Q('q9', 'Rx(π) equals|||Rx(π) bằng',
    ['X|||X', '−iX|||−iX', 'iX|||iX', 'I|||I'], 1,
    'cos(π/2)I − i sin(π/2)X = −iX; Pauli gates are π-rotations up to a global phase.|||cos(π/2)I − i sin(π/2)X = −iX; cổng Pauli là phép quay π sai khác pha toàn cục.'),
  Q('q10', 'In U = e^(iα) Rz(β) Ry(γ) Rz(δ), which gate is applied to the state first?|||Trong U = e^(iα) Rz(β) Ry(γ) Rz(δ), cổng nào tác động lên trạng thái đầu tiên?',
    ['Rz(β)|||Rz(β)', 'Ry(γ)|||Ry(γ)', 'Rz(δ)|||Rz(δ)', 'e^(iα)|||e^(iα)'], 2,
    'The rightmost factor acts first; e^(iα) is only a global phase.|||Thừa số ngoài cùng bên phải tác động trước; e^(iα) chỉ là pha toàn cục.'),
]);

const ch4 = {
  title: 'Chapter 4 — Single-qubit gates|||Chương 4 — Cổng một qubit',
  description: 'Cổng Pauli X/Y/Z (lật bit, lật pha, quay π), cổng Hadamard và cổng pha S/T/P(φ), cổng quay Rx/Ry/Rz, pha toàn cục, phân tích ZYZ, mô phỏng một qubit bằng numpy (Nielsen & Chuang 4.2 · Watrous Lesson 1).',
  lessons: [c41, c42, c43, q4],
};

// ───────────────────────────── Chương 5 — Nhiều qubit và vướng víu ─────────────────────────────
const c51 = L('qtc211-ts-5-1',
  '5.1 — Tensor products and multi-qubit states|||5.1 — Tích tensor và trạng thái nhiều qubit',
  'Tích tensor (Kronecker) của vectơ, ký hiệu |01⟩, 2ⁿ biên độ cho n qubit, np.kron, quy ước thứ tự qubit của khoá (qubit 0 bên trái) và cảnh báo Qiskit little-endian.',
  `<span class="eyebrow">QTC211 · Chapter 5 · Lesson 5.1</span>
<h2>Tensor products and multi-qubit states</h2>
<p class="lead">Two classical bits have 4 possible values; two qubits have a state vector with 4 complex amplitudes. The operation that glues systems together is the <strong>tensor product</strong> ⊗, and getting its index order right is the single most common source of bugs in quantum code.</p>
<h3>🎯 Objectives</h3>
<ul><li>Compute the tensor (Kronecker) product of vectors and read kets such as |01⟩ and |110⟩.</li><li>Explain why n qubits need 2<sup>n</sup> amplitudes and what that costs a classical simulator.</li><li>Use this course's ordering convention and recognise Qiskit's opposite (little-endian) convention.</li><li>Compute the probability of a measurement outcome on a two-qubit state.</li></ul>
<h3>📖 Lecture</h3>
<p>For column vectors, the tensor product multiplies every entry of the first vector by the whole second vector:</p>
<div class="formula"><span class="lbl">Tensor product</span>(a, b)<sup>T</sup> ⊗ (c, d)<sup>T</sup> = (ac, ad, bc, bd)<sup>T</sup>    |x⟩ ⊗ |y⟩ = |x⟩|y⟩ = |xy⟩</div>
<p>So the four two-qubit basis states are |00⟩ = (1, 0, 0, 0), |01⟩ = (0, 1, 0, 0), |10⟩ = (0, 0, 1, 0), |11⟩ = (0, 0, 0, 1): the basis state |xy⟩ sits at index “xy read as a binary number”. A general two-qubit state is</p>
<div class="formula"><span class="lbl">Two qubits</span>|ψ⟩ = a|00⟩ + b|01⟩ + c|10⟩ + d|11⟩    |a|<sup>2</sup> + |b|<sup>2</sup> + |c|<sup>2</sup> + |d|<sup>2</sup> = 1</div>
<p>With n qubits the basis states are the 2<sup>n</sup> bit strings |x<sub>0</sub>x<sub>1</sub>…x<sub>n−1</sub>⟩ and the state needs <strong>2<sup>n</sup> complex amplitudes</strong>. At 16 bytes per complex number (numpy complex128), 30 qubits need 16 GiB and 50 qubits 16 PiB — this exponential wall is why classical computers cannot simply simulate large quantum computers, and also why “reading out” all amplitudes of a quantum computer is impossible (a measurement gives only n bits).</p>
<p>The tensor product is linear in each factor: (α|0⟩ + β|1⟩) ⊗ |0⟩ = α|00⟩ + β|10⟩. Not every two-qubit state can be written as a product |a⟩ ⊗ |b⟩ — those that cannot are <strong>entangled</strong> (Lesson 5.3).</p>
<p><strong>Ordering convention of this course.</strong> We write qubit 0 <em>leftmost</em>: |q<sub>0</sub> q<sub>1</sub> … q<sub>n−1</sub>⟩ = |q<sub>0</sub>⟩ ⊗ |q<sub>1</sub>⟩ ⊗ …, which in numpy is <code>np.kron(q0, np.kron(q1, …))</code>; in circuit diagrams qubit 0 is the top wire. This is the convention of Nielsen &amp; Chuang and of most textbooks.</p>
<div class="callout"><p>⚠️ <strong>Qiskit uses the opposite order (little-endian).</strong> In Qiskit, qubit 0 is the <em>rightmost</em> (least significant) bit: a 3-qubit result printed as <code>"110"</code> means q<sub>2</sub> = 1, q<sub>1</sub> = 1, q<sub>0</sub> = 0, and its state vector index is q<sub>0</sub> + 2q<sub>1</sub> + 4q<sub>2</sub>. The same physics, a different labelling. Chapter 10 runs Qiskit — whenever you compare its output with a hand calculation from this course, reverse the bit string first.</p></div>
<p><strong>Measuring two qubits.</strong> Measuring both qubits gives the string xy with probability |amplitude of |xy⟩|<sup>2</sup>. Measuring only qubit 0 gives 0 with probability |a|<sup>2</sup> + |b|<sup>2</sup> (all strings starting with 0) — details in Lesson 5.3.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — a product of superpositions.</b> |+⟩ ⊗ |0⟩ = (1/√2)(1, 1) ⊗ (1, 0) = (1/√2)(1, 0, 1, 0) = (|00⟩ + |10⟩)/√2. In contrast |0⟩ ⊗ |+⟩ = (|00⟩ + |01⟩)/√2 — the order of the factors matters.</p></div>
<div class="callout"><p><b>Example 2 — a product with complex entries.</b> (0.6|0⟩ + 0.8|1⟩) ⊗ (|0⟩ + i|1⟩)/√2 = (0.6, 0.6i, 0.8, 0.8i)/√2 ≈ 0.4243|00⟩ + 0.4243i|01⟩ + 0.5657|10⟩ + 0.5657i|11⟩. Norm check: (0.36 + 0.36 + 0.64 + 0.64)/2 = 1 ✓. Probability of measuring 10: 0.5657<sup>2</sup> = 0.32.</p></div>
<div class="callout"><p><b>Example 3 — finding an index.</b> |110⟩ on three qubits: binary 110 = 6, so it is the basis vector with a 1 at index 6 (of 0…7). In Qiskit's labelling the same vector would be printed <code>"011"</code>.</p></div>
<pre><code class="language-python">import numpy as np
k0, k1 = np.array([1, 0]), np.array([0, 1])
plus = np.array([1, 1]) / np.sqrt(2)
print("|01&gt;      =", np.kron(k0, k1))
print("|+&gt;|0&gt;    =", np.round(np.kron(plus, k0), 4))
print("|110&gt;     = basis index", np.argmax(np.kron(np.kron(k1, k1), k0)))
print("30 qubits =", 2**30 * 16 / 2**30, "GiB of complex128 amplitudes")</code></pre>
<div class="out">|01&gt;      = [0 1 0 0]
|+&gt;|0&gt;    = [0.7071 0.     0.7071 0.    ]
|110&gt;     = basis index 6
30 qubits = 16.0 GiB of complex128 amplitudes</div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Adding instead of tensoring: two qubits are not a 2 + 2 = 4-entry list of the two states side by side; (a, b) ⊗ (c, d) = (ac, ad, bc, bd).</li><li>Assuming ⊗ is commutative: |0⟩ ⊗ |1⟩ = |01⟩ ≠ |10⟩ = |1⟩ ⊗ |0⟩.</li><li>Mixing conventions: comparing a Qiskit bit string with a textbook ket without reversing it.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>(a, b) ⊗ (c, d) = (ac, ad, bc, bd); |x⟩ ⊗ |y⟩ = |xy⟩.</li><li>n qubits ⇒ 2<sup>n</sup> amplitudes; the basis state |x⟩ sits at index x (binary).</li><li>Course convention: qubit 0 leftmost = <code>np.kron(q0, q1, …)</code>; Qiskit: qubit 0 rightmost.</li><li>Product states factor as |a⟩ ⊗ |b⟩; the others are entangled.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Kronecker_product" target="_blank" rel="noopener">Wikipedia — Kronecker product</a></li><li><a href="https://learn.microsoft.com/en-us/azure/quantum/concepts-multiple-qubits" target="_blank" rel="noopener">Microsoft Learn — Multiple-qubit operations</a></li><li><a href="https://www.youtube.com/watch?v=DfZZS8Spe7U" target="_blank" rel="noopener">Qiskit — Lesson 02: Multiple Systems (Watrous)</a></li><li><a href="https://github.com/Qiskit/documentation/blob/main/learning/courses/basics-of-quantum-information/multiple-systems/qiskit-implementation.ipynb" target="_blank" rel="noopener">IBM Quantum Learning — Multiple systems: Qiskit implementation (source notebook, shows the little-endian order)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Write |−⟩ ⊗ |1⟩ as a 4-entry vector.</li><li>Is (|00⟩ + |01⟩ + |10⟩ + |11⟩)/2 equal to |+⟩ ⊗ |+⟩?</li><li>For the state of Example 2, what is the probability that qubit 0 is measured as 1?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) (1/√2)(1, −1) ⊗ (0, 1) = (1/√2)(0, 1, 0, −1) = (|01⟩ − |11⟩)/√2. 2) Yes: (1/√2)(1, 1) ⊗ (1/√2)(1, 1) = (1/2)(1, 1, 1, 1). 3) Strings starting with 1: |c|<sup>2</sup> + |d|<sup>2</sup> = 0.32 + 0.32 = 0.64 = 0.8<sup>2</sup>, as expected for the factor 0.6|0⟩ + 0.8|1⟩.</p></div>`,
  `<span class="eyebrow">QTC211 · Chương 5 · Bài 5.1</span>
<h2>Tích tensor và trạng thái nhiều qubit</h2>
<p class="lead">Hai bit cổ điển có 4 giá trị khả dĩ; hai qubit có vectơ trạng thái gồm 4 biên độ phức. Phép “dán” các hệ lại với nhau là <strong>tích tensor</strong> ⊗, và đặt đúng thứ tự chỉ số của nó là nguồn lỗi phổ biến nhất trong code lượng tử.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính tích tensor (Kronecker) của vectơ và đọc các ket như |01⟩, |110⟩.</li><li>Giải thích vì sao n qubit cần 2<sup>n</sup> biên độ và trình mô phỏng cổ điển phải trả giá bao nhiêu.</li><li>Dùng quy ước thứ tự của khoá và nhận ra quy ước ngược lại (little-endian) của Qiskit.</li><li>Tính xác suất một kết quả đo trên trạng thái hai qubit.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Với vectơ cột, tích tensor nhân từng phần tử của vectơ thứ nhất với toàn bộ vectơ thứ hai:</p>
<div class="formula"><span class="lbl">Tích tensor</span>(a, b)<sup>T</sup> ⊗ (c, d)<sup>T</sup> = (ac, ad, bc, bd)<sup>T</sup>    |x⟩ ⊗ |y⟩ = |x⟩|y⟩ = |xy⟩</div>
<p>Vậy bốn trạng thái cơ sở hai qubit là |00⟩ = (1, 0, 0, 0), |01⟩ = (0, 1, 0, 0), |10⟩ = (0, 0, 1, 0), |11⟩ = (0, 0, 0, 1): trạng thái cơ sở |xy⟩ nằm ở chỉ số “xy đọc như số nhị phân”. Trạng thái hai qubit tổng quát là</p>
<div class="formula"><span class="lbl">Hai qubit</span>|ψ⟩ = a|00⟩ + b|01⟩ + c|10⟩ + d|11⟩    |a|<sup>2</sup> + |b|<sup>2</sup> + |c|<sup>2</sup> + |d|<sup>2</sup> = 1</div>
<p>Với n qubit, các trạng thái cơ sở là 2<sup>n</sup> chuỗi bit |x<sub>0</sub>x<sub>1</sub>…x<sub>n−1</sub>⟩ và trạng thái cần <strong>2<sup>n</sup> biên độ phức</strong>. Mỗi số phức 16 byte (complex128 của numpy) thì 30 qubit cần 16 GiB, 50 qubit cần 16 PiB — bức tường hàm mũ này là lý do máy cổ điển không thể cứ thế mô phỏng máy lượng tử lớn, và cũng là lý do không thể “đọc ra” mọi biên độ của máy lượng tử (một lần đo chỉ cho n bit).</p>
<p>Tích tensor tuyến tính theo từng thừa số: (α|0⟩ + β|1⟩) ⊗ |0⟩ = α|00⟩ + β|10⟩. Không phải trạng thái hai qubit nào cũng viết được thành tích |a⟩ ⊗ |b⟩ — những trạng thái không viết được là trạng thái <strong>vướng víu</strong> (Bài 5.3).</p>
<p><strong>Quy ước thứ tự của khoá.</strong> Ta viết qubit 0 <em>ngoài cùng bên trái</em>: |q<sub>0</sub> q<sub>1</sub> … q<sub>n−1</sub>⟩ = |q<sub>0</sub>⟩ ⊗ |q<sub>1</sub>⟩ ⊗ …, trong numpy là <code>np.kron(q0, np.kron(q1, …))</code>; trong sơ đồ mạch qubit 0 là dây trên cùng. Đây là quy ước của Nielsen &amp; Chuang và đa số giáo trình.</p>
<div class="callout"><p>⚠️ <strong>Qiskit dùng thứ tự ngược lại (little-endian).</strong> Trong Qiskit, qubit 0 là bit <em>ngoài cùng bên phải</em> (bit thấp nhất): kết quả 3 qubit in ra <code>"110"</code> nghĩa là q<sub>2</sub> = 1, q<sub>1</sub> = 1, q<sub>0</sub> = 0, và chỉ số trong vectơ trạng thái là q<sub>0</sub> + 2q<sub>1</sub> + 4q<sub>2</sub>. Cùng một vật lý, chỉ khác cách đánh nhãn. Chương 10 chạy Qiskit — mỗi khi so output của nó với kết quả tính tay theo khoá này, hãy đảo ngược chuỗi bit trước.</p></div>
<p><strong>Đo hai qubit.</strong> Đo cả hai qubit cho chuỗi xy với xác suất |biên độ của |xy⟩|<sup>2</sup>. Chỉ đo qubit 0 thì ra 0 với xác suất |a|<sup>2</sup> + |b|<sup>2</sup> (mọi chuỗi bắt đầu bằng 0) — chi tiết ở Bài 5.3.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — tích của các chồng chập.</b> |+⟩ ⊗ |0⟩ = (1/√2)(1, 1) ⊗ (1, 0) = (1/√2)(1, 0, 1, 0) = (|00⟩ + |10⟩)/√2. Ngược lại |0⟩ ⊗ |+⟩ = (|00⟩ + |01⟩)/√2 — thứ tự thừa số có ý nghĩa.</p></div>
<div class="callout"><p><b>Ví dụ 2 — tích có phần tử phức.</b> (0,6|0⟩ + 0,8|1⟩) ⊗ (|0⟩ + i|1⟩)/√2 = (0,6; 0,6i; 0,8; 0,8i)/√2 ≈ 0,4243|00⟩ + 0,4243i|01⟩ + 0,5657|10⟩ + 0,5657i|11⟩. Kiểm chuẩn: (0,36 + 0,36 + 0,64 + 0,64)/2 = 1 ✓. Xác suất đo ra 10: 0,5657<sup>2</sup> = 0,32.</p></div>
<div class="callout"><p><b>Ví dụ 3 — tìm chỉ số.</b> |110⟩ trên ba qubit: nhị phân 110 = 6, nên đó là vectơ cơ sở có số 1 ở chỉ số 6 (trong 0…7). Theo cách đánh nhãn của Qiskit, cùng vectơ đó được in ra là <code>"011"</code>.</p></div>
<pre><code class="language-python">import numpy as np
k0, k1 = np.array([1, 0]), np.array([0, 1])
plus = np.array([1, 1]) / np.sqrt(2)
print("|01&gt;      =", np.kron(k0, k1))
print("|+&gt;|0&gt;    =", np.round(np.kron(plus, k0), 4))
print("|110&gt;     = basis index", np.argmax(np.kron(np.kron(k1, k1), k0)))
print("30 qubits =", 2**30 * 16 / 2**30, "GiB of complex128 amplitudes")</code></pre>
<div class="out">|01&gt;      = [0 1 0 0]
|+&gt;|0&gt;    = [0.7071 0.     0.7071 0.    ]
|110&gt;     = basis index 6
30 qubits = 16.0 GiB of complex128 amplitudes</div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Cộng thay vì nhân tensor: hai qubit không phải danh sách 2 + 2 = 4 phần tử đặt hai trạng thái cạnh nhau; (a, b) ⊗ (c, d) = (ac, ad, bc, bd).</li><li>Tưởng ⊗ giao hoán: |0⟩ ⊗ |1⟩ = |01⟩ ≠ |10⟩ = |1⟩ ⊗ |0⟩.</li><li>Lẫn quy ước: so chuỗi bit của Qiskit với ket trong sách mà không đảo ngược.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>(a, b) ⊗ (c, d) = (ac, ad, bc, bd); |x⟩ ⊗ |y⟩ = |xy⟩.</li><li>n qubit ⇒ 2<sup>n</sup> biên độ; trạng thái cơ sở |x⟩ nằm ở chỉ số x (nhị phân).</li><li>Quy ước của khoá: qubit 0 bên trái = <code>np.kron(q0, q1, …)</code>; Qiskit: qubit 0 bên phải.</li><li>Trạng thái tích phân tách được thành |a⟩ ⊗ |b⟩; còn lại là vướng víu.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Kronecker_product" target="_blank" rel="noopener">Wikipedia — Tích Kronecker</a></li><li><a href="https://learn.microsoft.com/en-us/azure/quantum/concepts-multiple-qubits" target="_blank" rel="noopener">Microsoft Learn — Thao tác trên nhiều qubit</a></li><li><a href="https://www.youtube.com/watch?v=DfZZS8Spe7U" target="_blank" rel="noopener">Qiskit — Lesson 02: Multiple Systems (Watrous)</a></li><li><a href="https://github.com/Qiskit/documentation/blob/main/learning/courses/basics-of-quantum-information/multiple-systems/qiskit-implementation.ipynb" target="_blank" rel="noopener">IBM Quantum Learning — Hệ nhiều thành phần: cài đặt bằng Qiskit (notebook gốc, có thứ tự little-endian)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Viết |−⟩ ⊗ |1⟩ thành vectơ 4 phần tử.</li><li>(|00⟩ + |01⟩ + |10⟩ + |11⟩)/2 có bằng |+⟩ ⊗ |+⟩ không?</li><li>Với trạng thái ở Ví dụ 2, xác suất đo qubit 0 ra 1 là bao nhiêu?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) (1/√2)(1, −1) ⊗ (0, 1) = (1/√2)(0, 1, 0, −1) = (|01⟩ − |11⟩)/√2. 2) Có: (1/√2)(1, 1) ⊗ (1/√2)(1, 1) = (1/2)(1, 1, 1, 1). 3) Các chuỗi bắt đầu bằng 1: |c|<sup>2</sup> + |d|<sup>2</sup> = 0,32 + 0,32 = 0,64 = 0,8<sup>2</sup>, đúng như thừa số 0,6|0⟩ + 0,8|1⟩.</p></div>`);

const c52 = L('qtc211-ts-5-2',
  '5.2 — Two-qubit gates: CNOT, CZ, SWAP and A ⊗ B|||5.2 — Cổng hai qubit: CNOT, CZ, SWAP và A ⊗ B',
  'Cổng một qubit trên hệ hai qubit (I⊗H, H⊗I), (A⊗B)(|a⟩⊗|b⟩) = A|a⟩⊗B|b⟩; CNOT (điều khiển–đích), CZ đối xứng, SWAP = 3 CNOT, CZ = (I⊗H)CNOT(I⊗H), xem trước phản hồi pha CNOT|+⟩|−⟩ = |−⟩|−⟩.',
  `<span class="eyebrow">QTC211 · Chapter 5 · Lesson 5.2</span>
<h2>Two-qubit gates: CNOT, CZ, SWAP and A ⊗ B</h2>
<p class="lead">Single-qubit gates alone can never create correlations between qubits. For that we need gates that act on two qubits at once, above all the <strong>controlled-NOT</strong>. This lesson gives their 4×4 matrices and the identities you will use in every later chapter.</p>
<h3>🎯 Objectives</h3>
<ul><li>Build the 4×4 matrix of a single-qubit gate acting on one qubit of two (I ⊗ H, H ⊗ I).</li><li>Apply CNOT, CZ and SWAP to basis states and superpositions.</li><li>Verify SWAP = three CNOTs and CZ = (I ⊗ H) CNOT (I ⊗ H).</li><li>Observe phase kickback: CNOT|+⟩|−⟩ = |−⟩|−⟩.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>Local gates.</strong> Applying A to qubit 0 and B to qubit 1 at the same time is the matrix A ⊗ B, defined so that <strong>(A ⊗ B)(|a⟩ ⊗ |b⟩) = A|a⟩ ⊗ B|b⟩</strong>. Doing nothing on a qubit means the identity I there: “H on qubit 1 only” is I ⊗ H, “H on qubit 0 only” is H ⊗ I. The Kronecker product of matrices follows the same pattern as for vectors — each entry of A multiplies a whole copy of B:</p>
<div class="formula"><span class="lbl">I ⊗ H</span>(1/√2) <table class="matrix"><tbody><tr><td>1</td><td>1</td><td>0</td><td>0</td></tr><tr><td>1</td><td>−1</td><td>0</td><td>0</td></tr><tr><td>0</td><td>0</td><td>1</td><td>1</td></tr><tr><td>0</td><td>0</td><td>1</td><td>−1</td></tr></tbody></table>    H ⊗ I = (1/√2) <table class="matrix"><tbody><tr><td>1</td><td>0</td><td>1</td><td>0</td></tr><tr><td>0</td><td>1</td><td>0</td><td>1</td></tr><tr><td>1</td><td>0</td><td>−1</td><td>0</td></tr><tr><td>0</td><td>1</td><td>0</td><td>−1</td></tr></tbody></table></div>
<p><strong>CNOT.</strong> The controlled-NOT CNOT<sub>01</sub> has <em>control</em> qubit 0 and <em>target</em> qubit 1: it flips the target exactly when the control is 1, i.e. |x, y⟩ ↦ |x, y ⊕ x⟩ (⊕ = XOR). Truth table: 00 → 00, 01 → 01, 10 → 11, 11 → 10. In matrix form (basis order 00, 01, 10, 11):</p>
<div class="formula"><span class="lbl">CNOT₀₁ and CZ</span>CNOT<sub>01</sub> = <table class="matrix"><tbody><tr><td>1</td><td>0</td><td>0</td><td>0</td></tr><tr><td>0</td><td>1</td><td>0</td><td>0</td></tr><tr><td>0</td><td>0</td><td>0</td><td>1</td></tr><tr><td>0</td><td>0</td><td>1</td><td>0</td></tr></tbody></table> = |0⟩⟨0| ⊗ I + |1⟩⟨1| ⊗ X     CZ = diag(1, 1, 1, −1)</div>
<p>On basis states CNOT is just the reversible classical XOR. On superpositions it acts linearly on every term — which is how it creates entanglement (next lesson).</p>
<p><strong>CZ.</strong> The controlled-Z multiplies |11⟩ by −1 and leaves the other three basis states alone. Its matrix is diagonal and does not care which qubit is “control”: CZ is <strong>symmetric</strong>. Because HXH = Z, putting H on the target before and after a CNOT gives a CZ: <strong>CZ = (I ⊗ H) CNOT<sub>01</sub> (I ⊗ H)</strong>.</p>
<p><strong>SWAP</strong> exchanges the two qubits: |xy⟩ ↦ |yx⟩. It can be built from three CNOTs with alternating direction: SWAP = CNOT<sub>01</sub> CNOT<sub>10</sub> CNOT<sub>01</sub> — the quantum version of the XOR-swap trick (x ^= y; y ^= x; x ^= y). Hardware with limited connectivity inserts SWAPs to bring distant qubits together, which is why each SWAP's cost of three CNOTs matters (Chapter 10).</p>
<p><strong>Controlled gates and phase.</strong> A controlled-U applies U only on the |1⟩ branch of the control. A global phase of U then becomes a <em>relative</em> phase between the branches — the reason Lesson 4.3 warned that global phases matter inside controlled gates. A spectacular case is <strong>phase kickback</strong>: if the target is in the eigenstate |−⟩ of X (eigenvalue −1), then CNOT|x⟩|−⟩ = (−1)<sup>x</sup>|x⟩|−⟩, so the “−1” lands on the <em>control</em>. With the control in |+⟩: CNOT|+⟩|−⟩ = |−⟩|−⟩. The target is unchanged; the control flipped from |+⟩ to |−⟩. Chapter 8's algorithms are built on this trick.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — CNOT on a superposition of the target.</b> CNOT<sub>01</sub>(|1⟩ ⊗ |+⟩): the control is 1, so X acts on the target: |1⟩ ⊗ X|+⟩ = |1⟩|+⟩. Nothing changes, because |+⟩ is an eigenvector of X with eigenvalue +1.</p></div>
<div class="callout"><p><b>Example 2 — phase kickback by hand.</b> |+⟩|−⟩ = (1/2)(|00⟩ − |01⟩ + |10⟩ − |11⟩). CNOT swaps the amplitudes of |10⟩ and |11⟩: (1/2)(|00⟩ − |01⟩ − |10⟩ + |11⟩) = (1/√2)(|0⟩ − |1⟩) ⊗ (1/√2)(|0⟩ − |1⟩) = <b>|−⟩|−⟩</b>.</p></div>
<div class="callout"><p><b>Example 3 — a local gate.</b> (X ⊗ Z)|01⟩ = X|0⟩ ⊗ Z|1⟩ = |1⟩ ⊗ (−|1⟩) = −|11⟩.</p></div>
<p>Check the identities numerically (CNOT<sub>10</sub> = control q1, target q0):</p>
<pre><code class="language-python">import numpy as np
I = np.eye(2); X = np.array([[0, 1], [1, 0]]); H = np.array([[1, 1], [1, -1]]) / np.sqrt(2)
P0, P1 = np.diag([1, 0]), np.diag([0, 1])            # |0&gt;&lt;0| and |1&gt;&lt;1|
CNOT01 = np.kron(P0, I) + np.kron(P1, X)
CNOT10 = np.kron(I, P0) + np.kron(X, P1)
CZ = np.diag([1, 1, 1, -1]); SWAP = np.eye(4)[[0, 2, 1, 3]]
print("SWAP == CNOT01 CNOT10 CNOT01:", np.allclose(CNOT01 @ CNOT10 @ CNOT01, SWAP))
print("CZ == (I x H) CNOT01 (I x H):", np.allclose(np.kron(I, H) @ CNOT01 @ np.kron(I, H), CZ))
plus, minus = H @ [1, 0], H @ [0, 1]
print("CNOT01 |+&gt;|-&gt; == |-&gt;|-&gt;   :", np.allclose(CNOT01 @ np.kron(plus, minus), np.kron(minus, minus)))</code></pre>
<div class="out">SWAP == CNOT01 CNOT10 CNOT01: True
CZ == (I x H) CNOT01 (I x H): True
CNOT01 |+&gt;|-&gt; == |-&gt;|-&gt;   : True</div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Swapping control and target: CNOT<sub>01</sub> and CNOT<sub>10</sub> are different matrices. Always say which qubit controls.</li><li>Writing “H on qubit 1” as the 2×2 matrix H. On two qubits it is I ⊗ H, a 4×4 matrix.</li><li>Thinking the control qubit of a CNOT can never change. In the |±⟩ basis the roles reverse: phase kickback changes the control.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>(A ⊗ B)(|a⟩ ⊗ |b⟩) = A|a⟩ ⊗ B|b⟩; a gate on one qubit only = tensor with I.</li><li>CNOT<sub>01</sub>|x, y⟩ = |x, y ⊕ x⟩ = |0⟩⟨0| ⊗ I + |1⟩⟨1| ⊗ X.</li><li>CZ = diag(1, 1, 1, −1), symmetric; CZ = (I ⊗ H)CNOT(I ⊗ H).</li><li>SWAP = CNOT<sub>01</sub>CNOT<sub>10</sub>CNOT<sub>01</sub>.</li><li>Phase kickback: CNOT|+⟩|−⟩ = |−⟩|−⟩.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Controlled_NOT_gate" target="_blank" rel="noopener">Wikipedia — Controlled NOT gate</a></li><li><a href="https://learn.microsoft.com/en-us/azure/quantum/concepts-multiple-qubits" target="_blank" rel="noopener">Microsoft Learn — Multiple-qubit operations</a></li><li><a href="https://en.wikipedia.org/wiki/Phase_kickback" target="_blank" rel="noopener">Wikipedia — Phase kickback</a></li><li><a href="https://algassert.com/quirk" target="_blank" rel="noopener">Quirk — try CNOT with the target in |−⟩</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Compute CNOT<sub>01</sub>|+⟩|+⟩.</li><li>Write the matrix of CNOT<sub>10</sub> (control q1, target q0) in the basis 00, 01, 10, 11.</li><li>Compute CZ|+⟩|1⟩ and express it as a product state.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) |+⟩|+⟩ = (1/2)(1, 1, 1, 1); swapping the last two entries changes nothing: the result is |+⟩|+⟩. 2) It maps 01 ↔ 11 and fixes 00, 10: rows (1, 0, 0, 0), (0, 0, 0, 1), (0, 0, 1, 0), (0, 1, 0, 0). 3) CZ multiplies |11⟩ by −1: (|01⟩ − |11⟩)/√2 = |−⟩|1⟩ — a Z kicked onto qubit 0.</p></div>`,
  `<span class="eyebrow">QTC211 · Chương 5 · Bài 5.2</span>
<h2>Cổng hai qubit: CNOT, CZ, SWAP và A ⊗ B</h2>
<p class="lead">Chỉ dùng cổng một qubit thì không bao giờ tạo được tương quan giữa các qubit. Muốn vậy ta cần cổng tác động lên hai qubit cùng lúc, trước hết là <strong>cổng NOT có điều khiển (CNOT)</strong>. Bài này cho ma trận 4×4 của chúng và các đẳng thức bạn sẽ dùng ở mọi chương sau.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Lập ma trận 4×4 của một cổng một qubit tác động lên một trong hai qubit (I ⊗ H, H ⊗ I).</li><li>Áp CNOT, CZ, SWAP lên trạng thái cơ sở và chồng chập.</li><li>Kiểm SWAP = ba CNOT và CZ = (I ⊗ H) CNOT (I ⊗ H).</li><li>Quan sát phản hồi pha (phase kickback): CNOT|+⟩|−⟩ = |−⟩|−⟩.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Cổng cục bộ.</strong> Áp A lên qubit 0 và B lên qubit 1 cùng lúc là ma trận A ⊗ B, định nghĩa sao cho <strong>(A ⊗ B)(|a⟩ ⊗ |b⟩) = A|a⟩ ⊗ B|b⟩</strong>. Không làm gì trên một qubit nghĩa là đặt ma trận đơn vị I ở đó: “H chỉ trên qubit 1” là I ⊗ H, “H chỉ trên qubit 0” là H ⊗ I. Tích Kronecker của ma trận theo đúng khuôn như với vectơ — mỗi phần tử của A nhân với nguyên một bản sao của B:</p>
<div class="formula"><span class="lbl">I ⊗ H</span>(1/√2) <table class="matrix"><tbody><tr><td>1</td><td>1</td><td>0</td><td>0</td></tr><tr><td>1</td><td>−1</td><td>0</td><td>0</td></tr><tr><td>0</td><td>0</td><td>1</td><td>1</td></tr><tr><td>0</td><td>0</td><td>1</td><td>−1</td></tr></tbody></table>    H ⊗ I = (1/√2) <table class="matrix"><tbody><tr><td>1</td><td>0</td><td>1</td><td>0</td></tr><tr><td>0</td><td>1</td><td>0</td><td>1</td></tr><tr><td>1</td><td>0</td><td>−1</td><td>0</td></tr><tr><td>0</td><td>1</td><td>0</td><td>−1</td></tr></tbody></table></div>
<p><strong>CNOT.</strong> Cổng NOT có điều khiển CNOT<sub>01</sub> có qubit <em>điều khiển</em> là 0 và qubit <em>đích</em> là 1: nó lật qubit đích đúng khi qubit điều khiển bằng 1, tức |x, y⟩ ↦ |x, y ⊕ x⟩ (⊕ = XOR). Bảng chân trị: 00 → 00, 01 → 01, 10 → 11, 11 → 10. Dạng ma trận (thứ tự cơ sở 00, 01, 10, 11):</p>
<div class="formula"><span class="lbl">CNOT₀₁ và CZ</span>CNOT<sub>01</sub> = <table class="matrix"><tbody><tr><td>1</td><td>0</td><td>0</td><td>0</td></tr><tr><td>0</td><td>1</td><td>0</td><td>0</td></tr><tr><td>0</td><td>0</td><td>0</td><td>1</td></tr><tr><td>0</td><td>0</td><td>1</td><td>0</td></tr></tbody></table> = |0⟩⟨0| ⊗ I + |1⟩⟨1| ⊗ X     CZ = diag(1, 1, 1, −1)</div>
<p>Trên trạng thái cơ sở, CNOT chỉ là phép XOR cổ điển khả nghịch. Trên chồng chập, nó tác động tuyến tính lên từng số hạng — đó là cách nó tạo ra vướng víu (bài sau).</p>
<p><strong>CZ.</strong> Cổng Z có điều khiển nhân |11⟩ với −1 và giữ nguyên ba trạng thái cơ sở còn lại. Ma trận của nó chéo và không quan tâm qubit nào là “điều khiển”: CZ <strong>đối xứng</strong>. Vì HXH = Z, đặt H lên qubit đích trước và sau một CNOT sẽ được CZ: <strong>CZ = (I ⊗ H) CNOT<sub>01</sub> (I ⊗ H)</strong>.</p>
<p><strong>SWAP</strong> đổi chỗ hai qubit: |xy⟩ ↦ |yx⟩. Nó dựng được từ ba CNOT đổi chiều xen kẽ: SWAP = CNOT<sub>01</sub> CNOT<sub>10</sub> CNOT<sub>01</sub> — phiên bản lượng tử của mẹo hoán đổi bằng XOR (x ^= y; y ^= x; x ^= y). Phần cứng có kết nối hạn chế phải chèn SWAP để đưa hai qubit ở xa lại gần nhau, nên cái giá ba CNOT của mỗi SWAP rất đáng kể (Chương 10).</p>
<p><strong>Cổng có điều khiển và pha.</strong> Cổng U có điều khiển chỉ áp U trên nhánh |1⟩ của qubit điều khiển. Khi đó pha toàn cục của U trở thành pha <em>tương đối</em> giữa hai nhánh — lý do Bài 4.3 đã cảnh báo pha toàn cục có ý nghĩa bên trong cổng có điều khiển. Một trường hợp ngoạn mục là <strong>phản hồi pha</strong>: nếu qubit đích ở trạng thái riêng |−⟩ của X (trị riêng −1) thì CNOT|x⟩|−⟩ = (−1)<sup>x</sup>|x⟩|−⟩, tức dấu “−1” rơi xuống qubit <em>điều khiển</em>. Với qubit điều khiển ở |+⟩: CNOT|+⟩|−⟩ = |−⟩|−⟩. Qubit đích không đổi; qubit điều khiển lật từ |+⟩ sang |−⟩. Các thuật toán ở Chương 8 dựng trên mẹo này.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — CNOT khi qubit đích ở chồng chập.</b> CNOT<sub>01</sub>(|1⟩ ⊗ |+⟩): qubit điều khiển bằng 1 nên X tác động lên qubit đích: |1⟩ ⊗ X|+⟩ = |1⟩|+⟩. Không có gì thay đổi, vì |+⟩ là vectơ riêng của X với trị riêng +1.</p></div>
<div class="callout"><p><b>Ví dụ 2 — phản hồi pha bằng tay.</b> |+⟩|−⟩ = (1/2)(|00⟩ − |01⟩ + |10⟩ − |11⟩). CNOT đổi chỗ biên độ của |10⟩ và |11⟩: (1/2)(|00⟩ − |01⟩ − |10⟩ + |11⟩) = (1/√2)(|0⟩ − |1⟩) ⊗ (1/√2)(|0⟩ − |1⟩) = <b>|−⟩|−⟩</b>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — cổng cục bộ.</b> (X ⊗ Z)|01⟩ = X|0⟩ ⊗ Z|1⟩ = |1⟩ ⊗ (−|1⟩) = −|11⟩.</p></div>
<p>Kiểm các đẳng thức bằng số (CNOT<sub>10</sub> = điều khiển q1, đích q0):</p>
<pre><code class="language-python">import numpy as np
I = np.eye(2); X = np.array([[0, 1], [1, 0]]); H = np.array([[1, 1], [1, -1]]) / np.sqrt(2)
P0, P1 = np.diag([1, 0]), np.diag([0, 1])            # |0&gt;&lt;0| and |1&gt;&lt;1|
CNOT01 = np.kron(P0, I) + np.kron(P1, X)
CNOT10 = np.kron(I, P0) + np.kron(X, P1)
CZ = np.diag([1, 1, 1, -1]); SWAP = np.eye(4)[[0, 2, 1, 3]]
print("SWAP == CNOT01 CNOT10 CNOT01:", np.allclose(CNOT01 @ CNOT10 @ CNOT01, SWAP))
print("CZ == (I x H) CNOT01 (I x H):", np.allclose(np.kron(I, H) @ CNOT01 @ np.kron(I, H), CZ))
plus, minus = H @ [1, 0], H @ [0, 1]
print("CNOT01 |+&gt;|-&gt; == |-&gt;|-&gt;   :", np.allclose(CNOT01 @ np.kron(plus, minus), np.kron(minus, minus)))</code></pre>
<div class="out">SWAP == CNOT01 CNOT10 CNOT01: True
CZ == (I x H) CNOT01 (I x H): True
CNOT01 |+&gt;|-&gt; == |-&gt;|-&gt;   : True</div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Đổi lẫn điều khiển và đích: CNOT<sub>01</sub> và CNOT<sub>10</sub> là hai ma trận khác nhau. Luôn nói rõ qubit nào điều khiển.</li><li>Viết “H trên qubit 1” bằng ma trận 2×2 H. Trên hai qubit nó là I ⊗ H, ma trận 4×4.</li><li>Nghĩ qubit điều khiển của CNOT không bao giờ thay đổi. Trong cơ sở |±⟩ vai trò đảo ngược: phản hồi pha làm qubit điều khiển thay đổi.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>(A ⊗ B)(|a⟩ ⊗ |b⟩) = A|a⟩ ⊗ B|b⟩; cổng chỉ trên một qubit = nhân tensor với I.</li><li>CNOT<sub>01</sub>|x, y⟩ = |x, y ⊕ x⟩ = |0⟩⟨0| ⊗ I + |1⟩⟨1| ⊗ X.</li><li>CZ = diag(1, 1, 1, −1), đối xứng; CZ = (I ⊗ H)CNOT(I ⊗ H).</li><li>SWAP = CNOT<sub>01</sub>CNOT<sub>10</sub>CNOT<sub>01</sub>.</li><li>Phản hồi pha: CNOT|+⟩|−⟩ = |−⟩|−⟩.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Controlled_NOT_gate" target="_blank" rel="noopener">Wikipedia — Cổng CNOT</a></li><li><a href="https://learn.microsoft.com/en-us/azure/quantum/concepts-multiple-qubits" target="_blank" rel="noopener">Microsoft Learn — Thao tác trên nhiều qubit</a></li><li><a href="https://en.wikipedia.org/wiki/Phase_kickback" target="_blank" rel="noopener">Wikipedia — Phản hồi pha (phase kickback)</a></li><li><a href="https://algassert.com/quirk" target="_blank" rel="noopener">Quirk — thử CNOT với qubit đích ở |−⟩</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tính CNOT<sub>01</sub>|+⟩|+⟩.</li><li>Viết ma trận của CNOT<sub>10</sub> (điều khiển q1, đích q0) theo cơ sở 00, 01, 10, 11.</li><li>Tính CZ|+⟩|1⟩ và viết nó thành trạng thái tích.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) |+⟩|+⟩ = (1/2)(1, 1, 1, 1); đổi chỗ hai phần tử cuối không làm gì: kết quả là |+⟩|+⟩. 2) Nó đổi 01 ↔ 11 và giữ 00, 10: các hàng (1, 0, 0, 0), (0, 0, 0, 1), (0, 0, 1, 0), (0, 1, 0, 0). 3) CZ nhân |11⟩ với −1: (|01⟩ − |11⟩)/√2 = |−⟩|1⟩ — một cổng Z bị “đá” sang qubit 0.</p></div>`);

const c53 = L('qtc211-ts-5-3',
  '5.3 — Entanglement and Bell states|||5.3 — Vướng víu và trạng thái Bell',
  'Tạo Φ⁺ bằng H rồi CNOT, bốn trạng thái Bell, phép thử trạng thái tích ad − bc = 0, đo một phần và chuẩn hoá lại, tương quan của vướng víu mà không truyền tin nhanh hơn ánh sáng.',
  `<span class="eyebrow">QTC211 · Chapter 5 · Lesson 5.3</span>
<h2>Entanglement and Bell states</h2>
<p class="lead">Two gates — H then CNOT — produce a two-qubit state that cannot be described qubit by qubit. Such <strong>entangled</strong> states are the resource behind teleportation, superdense coding, quantum key distribution and every quantum speed-up.</p>
<h3>🎯 Objectives</h3>
<ul><li>Prepare the four Bell states with H and CNOT, and write them in ket form.</li><li>Decide whether a two-qubit state is a product state using the test ad − bc = 0.</li><li>Compute the outcome probabilities and the post-measurement state when only one qubit is measured.</li><li>Explain why entanglement gives correlations but cannot send messages.</li></ul>
<h3>📖 Lecture</h3>
<p>Start in |00⟩, apply H to qubit 0, then CNOT<sub>01</sub>:</p>
<div class="formula"><span class="lbl">Bell circuit</span>|00⟩ —(H ⊗ I)→ (|00⟩ + |10⟩)/√2 —CNOT<sub>01</sub>→ (|00⟩ + |11⟩)/√2 = |Φ<sup>+</sup>⟩</div>
<p>Feeding the other three basis states into the same circuit gives the other three <strong>Bell states</strong>, which together form an orthonormal basis of ℂ<sup>4</sup>:</p>
<div class="formula"><span class="lbl">Bell basis</span>|00⟩ → |Φ<sup>+</sup>⟩ = (|00⟩ + |11⟩)/√2    |01⟩ → |Ψ<sup>+</sup>⟩ = (|01⟩ + |10⟩)/√2    |10⟩ → |Φ<sup>−</sup>⟩ = (|00⟩ − |11⟩)/√2    |11⟩ → |Ψ<sup>−</sup>⟩ = (|01⟩ − |10⟩)/√2</div>
<p><strong>Product or entangled?</strong> A two-qubit state is a <strong>product state</strong> if it equals |a⟩ ⊗ |b⟩ for some single-qubit states; otherwise it is <strong>entangled</strong>. For |ψ⟩ = a|00⟩ + b|01⟩ + c|10⟩ + d|11⟩ there is a one-line test:</p>
<div class="formula"><span class="lbl">Product test</span>|ψ⟩ is a product state  ⇔  ad − bc = 0</div>
<p>Reason: (p|0⟩ + q|1⟩) ⊗ (r|0⟩ + s|1⟩) has a = pr, b = ps, c = qr, d = qs, so ad − bc = prqs − psqr = 0; conversely, if ad = bc the 2×2 array (a, b; c, d) has rank 1 and factors. For |Φ<sup>+</sup>⟩: a = d = 1/√2, b = c = 0, so ad − bc = 1/2 ≠ 0 — entangled.</p>
<p><strong>Partial measurement.</strong> Measure only qubit 0 of |ψ⟩. Outcome 0 has probability p<sub>0</sub> = |a|<sup>2</sup> + |b|<sup>2</sup>; the state then <strong>collapses</strong> to the terms consistent with 0, renormalised: (a|00⟩ + b|01⟩)/√p<sub>0</sub>. Outcome 1 is analogous with c and d. For |Φ<sup>+</sup>⟩ each outcome has probability 1/2 and leaves |00⟩ or |11⟩: after Alice measures her qubit, Bob's qubit is <em>certainly</em> equal to hers. The same perfect correlation appears in the X basis, since |Φ<sup>+</sup>⟩ = (|++⟩ + |−−⟩)/√2 — something no pair of classical coins with pre-agreed values can imitate for every basis (that is Bell's theorem, explored with the CHSH game in Watrous Lesson 4).</p>
<p><strong>No signalling.</strong> Correlation is not communication. Whatever Alice measures (Z basis or X basis, or nothing at all), Bob's own outcome is 0 or 1 with probability 1/2 each; only when they <em>compare</em> results over a classical channel does the correlation appear. Entanglement therefore cannot send information faster than light — a fact we rely on in teleportation (Chapter 7), which needs two classical bits.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — two similar-looking states.</b> (|00⟩ + |01⟩ + |10⟩ + |11⟩)/2: ad − bc = 1/4 − 1/4 = 0 ⇒ product (it is |+⟩|+⟩). (|00⟩ + |01⟩ + |10⟩ − |11⟩)/2: ad − bc = −1/4 − 1/4 = −1/2 ≠ 0 ⇒ <b>entangled</b>. One sign makes the difference.</p></div>
<div class="callout"><p><b>Example 2 — partial measurement.</b> |ψ⟩ = (|00⟩ + |01⟩ + |11⟩)/√3. Measure qubit 0.</p>
<p>Outcome 0: p<sub>0</sub> = 1/3 + 1/3 = <b>2/3</b>, post-state (|00⟩ + |01⟩)/√2 = |0⟩|+⟩. Outcome 1: p<sub>1</sub> = <b>1/3</b>, post-state |11⟩. Note the renormalisation: the amplitudes 1/√3 become 1/√2. (This |ψ⟩ is entangled: ad − bc = 1/3 ≠ 0.)</p></div>
<pre><code class="language-python">import numpy as np
I = np.eye(2); H = np.array([[1, 1], [1, -1]]) / np.sqrt(2)
CNOT = np.array([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 0, 1], [0, 0, 1, 0]])
basis = {"00": [1, 0, 0, 0], "01": [0, 1, 0, 0], "10": [0, 0, 1, 0], "11": [0, 0, 0, 1]}
for label, v in basis.items():
    out = CNOT @ np.kron(H, I) @ np.array(v)
    print(label, "-&gt;", np.round(out * np.sqrt(2), 4), "/ sqrt(2)")

def product_test(state):                 # a|00&gt; + b|01&gt; + c|10&gt; + d|11&gt;
    a, b, c, d = state
    return a * d - b * c                 # 0  =&gt;  product state
print("ad-bc for |+&gt;|+&gt;     :", product_test(np.array([1, 1, 1, 1]) / 2))
print("ad-bc for Phi+       :", round(product_test(np.array([1, 0, 0, 1]) / np.sqrt(2)), 4))</code></pre>
<div class="out">00 -&gt; [1. 0. 0. 1.] / sqrt(2)
01 -&gt; [0. 1. 1. 0.] / sqrt(2)
10 -&gt; [ 1.  0.  0. -1.] / sqrt(2)
11 -&gt; [ 0.  1. -1.  0.] / sqrt(2)
ad-bc for |+&gt;|+&gt;     : 0.0
ad-bc for Phi+       : 0.5</div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Calling any superposition “entangled”. |+⟩|+⟩ is a superposition of all four basis states but a product state.</li><li>Forgetting to renormalise after a partial measurement (the post-state must have norm 1).</li><li>Believing Alice's measurement “sends” a value to Bob. Bob's local statistics never change; only the joint statistics are correlated.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>H on q0 then CNOT<sub>01</sub> maps |00⟩, |01⟩, |10⟩, |11⟩ to Φ<sup>+</sup>, Ψ<sup>+</sup>, Φ<sup>−</sup>, Ψ<sup>−</sup>.</li><li>a|00⟩ + b|01⟩ + c|10⟩ + d|11⟩ is a product state iff ad − bc = 0.</li><li>Partial measurement: probability = sum of |amplitude|<sup>2</sup> of consistent terms; keep those terms and renormalise.</li><li>Entanglement = correlation, not communication (no signalling).</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Bell_state" target="_blank" rel="noopener">Wikipedia — Bell state</a></li><li><a href="https://learn.microsoft.com/en-us/azure/quantum/concepts-entanglement" target="_blank" rel="noopener">Microsoft Learn — Entanglement and correlations</a></li><li><a href="https://en.wikipedia.org/wiki/Quantum_entanglement" target="_blank" rel="noopener">Wikipedia — Quantum entanglement</a></li><li><a href="https://www.youtube.com/watch?v=GSsElSQgMbU" target="_blank" rel="noopener">Qiskit — Lesson 04: Entanglement in Action (Watrous; includes the CHSH game)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Is (|00⟩ + i|01⟩ + |10⟩ + i|11⟩)/2 entangled? If not, factor it.</li><li>Measure qubit 1 (the right qubit) of |Ψ<sup>+</sup>⟩. Give the probabilities and post-states.</li><li>Starting from |Φ<sup>+</sup>⟩, which single-qubit Pauli on qubit 0 gives |Φ<sup>−</sup>⟩?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) ad − bc = i/4 − i/4 = 0 ⇒ product: |+⟩ ⊗ (|0⟩ + i|1⟩)/√2 = |+⟩|i⟩. 2) Outcome 0 (terms |10⟩): probability 1/2, post-state |10⟩; outcome 1 (terms |01⟩): probability 1/2, post-state |01⟩ — the two qubits are always opposite. 3) Z on qubit 0: (Z ⊗ I)(|00⟩ + |11⟩)/√2 = (|00⟩ − |11⟩)/√2.</p></div>`,
  `<span class="eyebrow">QTC211 · Chương 5 · Bài 5.3</span>
<h2>Vướng víu và trạng thái Bell</h2>
<p class="lead">Chỉ hai cổng — H rồi CNOT — đã tạo ra một trạng thái hai qubit không thể mô tả từng qubit riêng lẻ. Các trạng thái <strong>vướng víu</strong> như vậy là tài nguyên đứng sau dịch chuyển lượng tử, mã hoá siêu đặc, phân phối khoá lượng tử và mọi tăng tốc lượng tử.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tạo bốn trạng thái Bell bằng H và CNOT, viết chúng dạng ket.</li><li>Xác định trạng thái hai qubit có phải trạng thái tích không bằng phép thử ad − bc = 0.</li><li>Tính xác suất kết quả và trạng thái sau đo khi chỉ đo một qubit.</li><li>Giải thích vì sao vướng víu tạo tương quan nhưng không gửi được tin.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Bắt đầu ở |00⟩, áp H lên qubit 0, rồi CNOT<sub>01</sub>:</p>
<div class="formula"><span class="lbl">Mạch Bell</span>|00⟩ —(H ⊗ I)→ (|00⟩ + |10⟩)/√2 —CNOT<sub>01</sub>→ (|00⟩ + |11⟩)/√2 = |Φ<sup>+</sup>⟩</div>
<p>Đưa ba trạng thái cơ sở còn lại vào cùng mạch đó ta được ba <strong>trạng thái Bell</strong> còn lại; bốn trạng thái này lập thành một cơ sở trực chuẩn của ℂ<sup>4</sup>:</p>
<div class="formula"><span class="lbl">Cơ sở Bell</span>|00⟩ → |Φ<sup>+</sup>⟩ = (|00⟩ + |11⟩)/√2    |01⟩ → |Ψ<sup>+</sup>⟩ = (|01⟩ + |10⟩)/√2    |10⟩ → |Φ<sup>−</sup>⟩ = (|00⟩ − |11⟩)/√2    |11⟩ → |Ψ<sup>−</sup>⟩ = (|01⟩ − |10⟩)/√2</div>
<p><strong>Tích hay vướng víu?</strong> Trạng thái hai qubit là <strong>trạng thái tích</strong> nếu nó bằng |a⟩ ⊗ |b⟩ với các trạng thái một qubit nào đó; ngược lại nó <strong>vướng víu</strong>. Với |ψ⟩ = a|00⟩ + b|01⟩ + c|10⟩ + d|11⟩ có phép thử một dòng:</p>
<div class="formula"><span class="lbl">Phép thử trạng thái tích</span>|ψ⟩ là trạng thái tích  ⇔  ad − bc = 0</div>
<p>Lý do: (p|0⟩ + q|1⟩) ⊗ (r|0⟩ + s|1⟩) có a = pr, b = ps, c = qr, d = qs, nên ad − bc = prqs − psqr = 0; ngược lại, nếu ad = bc thì bảng 2×2 (a, b; c, d) có hạng 1 và phân tách được. Với |Φ<sup>+</sup>⟩: a = d = 1/√2, b = c = 0, nên ad − bc = 1/2 ≠ 0 — vướng víu.</p>
<p><strong>Đo một phần.</strong> Chỉ đo qubit 0 của |ψ⟩. Kết quả 0 có xác suất p<sub>0</sub> = |a|<sup>2</sup> + |b|<sup>2</sup>; trạng thái khi đó <strong>sụp đổ</strong> về các số hạng phù hợp với 0, rồi chuẩn hoá lại: (a|00⟩ + b|01⟩)/√p<sub>0</sub>. Kết quả 1 tương tự với c và d. Với |Φ<sup>+</sup>⟩ mỗi kết quả có xác suất 1/2 và để lại |00⟩ hoặc |11⟩: sau khi Alice đo qubit của mình, qubit của Bob <em>chắc chắn</em> bằng của cô. Tương quan hoàn hảo đó cũng xuất hiện trong cơ sở X, vì |Φ<sup>+</sup>⟩ = (|++⟩ + |−−⟩)/√2 — điều mà không cặp đồng xu cổ điển nào với giá trị thoả thuận trước bắt chước được cho mọi cơ sở (đó là định lý Bell, được khám phá qua trò chơi CHSH ở Lesson 4 của Watrous).</p>
<p><strong>Không truyền tin.</strong> Tương quan không phải liên lạc. Dù Alice đo gì (cơ sở Z, cơ sở X, hay không đo), kết quả riêng của Bob vẫn là 0 hoặc 1 với xác suất 1/2 mỗi giá trị; chỉ khi hai người <em>so</em> kết quả qua một kênh cổ điển thì tương quan mới hiện ra. Vì vậy vướng víu không thể gửi thông tin nhanh hơn ánh sáng — điều ta dựa vào ở dịch chuyển lượng tử (Chương 7), vốn cần hai bit cổ điển.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — hai trạng thái trông giống nhau.</b> (|00⟩ + |01⟩ + |10⟩ + |11⟩)/2: ad − bc = 1/4 − 1/4 = 0 ⇒ tích (đó là |+⟩|+⟩). (|00⟩ + |01⟩ + |10⟩ − |11⟩)/2: ad − bc = −1/4 − 1/4 = −1/2 ≠ 0 ⇒ <b>vướng víu</b>. Chỉ một dấu tạo nên khác biệt.</p></div>
<div class="callout"><p><b>Ví dụ 2 — đo một phần.</b> |ψ⟩ = (|00⟩ + |01⟩ + |11⟩)/√3. Đo qubit 0.</p>
<p>Kết quả 0: p<sub>0</sub> = 1/3 + 1/3 = <b>2/3</b>, trạng thái sau đo (|00⟩ + |01⟩)/√2 = |0⟩|+⟩. Kết quả 1: p<sub>1</sub> = <b>1/3</b>, trạng thái sau đo |11⟩. Chú ý phép chuẩn hoá lại: biên độ 1/√3 thành 1/√2. (|ψ⟩ này vướng víu: ad − bc = 1/3 ≠ 0.)</p></div>
<pre><code class="language-python">import numpy as np
I = np.eye(2); H = np.array([[1, 1], [1, -1]]) / np.sqrt(2)
CNOT = np.array([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 0, 1], [0, 0, 1, 0]])
basis = {"00": [1, 0, 0, 0], "01": [0, 1, 0, 0], "10": [0, 0, 1, 0], "11": [0, 0, 0, 1]}
for label, v in basis.items():
    out = CNOT @ np.kron(H, I) @ np.array(v)
    print(label, "-&gt;", np.round(out * np.sqrt(2), 4), "/ sqrt(2)")

def product_test(state):                 # a|00&gt; + b|01&gt; + c|10&gt; + d|11&gt;
    a, b, c, d = state
    return a * d - b * c                 # 0  =&gt;  product state
print("ad-bc for |+&gt;|+&gt;     :", product_test(np.array([1, 1, 1, 1]) / 2))
print("ad-bc for Phi+       :", round(product_test(np.array([1, 0, 0, 1]) / np.sqrt(2)), 4))</code></pre>
<div class="out">00 -&gt; [1. 0. 0. 1.] / sqrt(2)
01 -&gt; [0. 1. 1. 0.] / sqrt(2)
10 -&gt; [ 1.  0.  0. -1.] / sqrt(2)
11 -&gt; [ 0.  1. -1.  0.] / sqrt(2)
ad-bc for |+&gt;|+&gt;     : 0.0
ad-bc for Phi+       : 0.5</div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Gọi mọi chồng chập là “vướng víu”. |+⟩|+⟩ là chồng chập của cả bốn trạng thái cơ sở nhưng vẫn là trạng thái tích.</li><li>Quên chuẩn hoá lại sau khi đo một phần (trạng thái sau đo phải có chuẩn 1).</li><li>Tưởng phép đo của Alice “gửi” một giá trị cho Bob. Thống kê cục bộ của Bob không bao giờ đổi; chỉ thống kê chung là tương quan.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>H trên q0 rồi CNOT<sub>01</sub> biến |00⟩, |01⟩, |10⟩, |11⟩ thành Φ<sup>+</sup>, Ψ<sup>+</sup>, Φ<sup>−</sup>, Ψ<sup>−</sup>.</li><li>a|00⟩ + b|01⟩ + c|10⟩ + d|11⟩ là trạng thái tích khi và chỉ khi ad − bc = 0.</li><li>Đo một phần: xác suất = tổng |biên độ|<sup>2</sup> của các số hạng phù hợp; giữ các số hạng đó rồi chuẩn hoá lại.</li><li>Vướng víu = tương quan, không phải liên lạc (không truyền tin).</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Bell_state" target="_blank" rel="noopener">Wikipedia — Trạng thái Bell</a></li><li><a href="https://learn.microsoft.com/en-us/azure/quantum/concepts-entanglement" target="_blank" rel="noopener">Microsoft Learn — Vướng víu và tương quan</a></li><li><a href="https://en.wikipedia.org/wiki/Quantum_entanglement" target="_blank" rel="noopener">Wikipedia — Vướng víu lượng tử</a></li><li><a href="https://www.youtube.com/watch?v=GSsElSQgMbU" target="_blank" rel="noopener">Qiskit — Lesson 04: Entanglement in Action (Watrous; có trò chơi CHSH)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>(|00⟩ + i|01⟩ + |10⟩ + i|11⟩)/2 có vướng víu không? Nếu không, hãy phân tích nó thành tích.</li><li>Đo qubit 1 (qubit bên phải) của |Ψ<sup>+</sup>⟩. Cho xác suất và trạng thái sau đo.</li><li>Từ |Φ<sup>+</sup>⟩, cổng Pauli một qubit nào trên qubit 0 cho |Φ<sup>−</sup>⟩?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) ad − bc = i/4 − i/4 = 0 ⇒ tích: |+⟩ ⊗ (|0⟩ + i|1⟩)/√2 = |+⟩|i⟩. 2) Kết quả 0 (số hạng |10⟩): xác suất 1/2, trạng thái sau đo |10⟩; kết quả 1 (số hạng |01⟩): xác suất 1/2, trạng thái sau đo |01⟩ — hai qubit luôn ngược nhau. 3) Z trên qubit 0: (Z ⊗ I)(|00⟩ + |11⟩)/√2 = (|00⟩ − |11⟩)/√2.</p></div>`);

const c54 = L('qtc211-ts-5-4',
  '5.4 — The no-cloning theorem|||5.4 — Định lý không nhân bản (no-cloning)',
  'Chứng minh không có phép unita nào sao chép mọi trạng thái chưa biết (lập luận tích trong và tuyến tính), CNOT chỉ sao chép trạng thái cơ sở: CNOT(|+⟩|0⟩) = Φ⁺ ≠ |+⟩|+⟩, hệ quả cho bảo mật, sửa lỗi và truyền tin.',
  `<span class="eyebrow">QTC211 · Chapter 5 · Lesson 5.4</span>
<h2>The no-cloning theorem</h2>
<p class="lead">Copying is the most basic operation of classical computing — <code>cp</code>, assignment, backups. Quantum mechanics forbids it: there is no machine that copies an unknown quantum state. This one-paragraph theorem shapes quantum cryptography, error correction and teleportation.</p>
<h3>🎯 Objectives</h3>
<ul><li>State the no-cloning theorem precisely.</li><li>Prove it with the inner-product argument and with the linearity argument.</li><li>Explain why CNOT copies |0⟩ and |1⟩ but not |+⟩.</li><li>List consequences: eavesdropping detection, error correction design, no faster-than-light signalling.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>Statement.</strong> There is no unitary U and fixed “blank” state |s⟩ such that U(|ψ⟩ ⊗ |s⟩) = |ψ⟩ ⊗ |ψ⟩ for <em>every</em> single-qubit state |ψ⟩. (Adding helper qubits or allowing a junk output does not help.)</p>
<p><strong>Proof 1 — inner products.</strong> Suppose U clones two states |ψ⟩ and |φ⟩. Unitaries preserve inner products, so compare before and after:</p>
<div class="formula"><span class="lbl">Inner-product argument</span>⟨φ|ψ⟩⟨s|s⟩ = ⟨φ|ψ⟩    must equal    (⟨φ| ⊗ ⟨φ|)(|ψ⟩ ⊗ |ψ⟩) = ⟨φ|ψ⟩<sup>2</sup></div>
<p>So ⟨φ|ψ⟩ = ⟨φ|ψ⟩<sup>2</sup>, i.e. ⟨φ|ψ⟩ is 0 or 1: the two states are either orthogonal or identical. A cloner can therefore only copy a set of mutually orthogonal states — never two different non-orthogonal ones such as |0⟩ and |+⟩ (⟨0|+⟩ = 1/√2, and 1/√2 ≠ 1/2).</p>
<p><strong>Proof 2 — linearity.</strong> Suppose U copies the basis states: U|0⟩|s⟩ = |00⟩ and U|1⟩|s⟩ = |11⟩. By linearity, for |ψ⟩ = α|0⟩ + β|1⟩:</p>
<div class="formula"><span class="lbl">Linearity argument</span>U(α|0⟩ + β|1⟩)|s⟩ = α|00⟩ + β|11⟩    but    |ψ⟩|ψ⟩ = α<sup>2</sup>|00⟩ + αβ|01⟩ + αβ|10⟩ + β<sup>2</sup>|11⟩</div>
<p>These agree only when αβ = 0, i.e. |ψ⟩ is |0⟩ or |1⟩ (up to phase). The output α|00⟩ + β|11⟩ is not a copy — it is an <em>entangled</em> state.</p>
<p><strong>CNOT as an attempted copier.</strong> CNOT<sub>01</sub> with the target in |0⟩ does copy classical bits: |0⟩|0⟩ → |00⟩ and |1⟩|0⟩ → |11⟩ (it is the classical fan-out). Apply it to |+⟩|0⟩ and you get (|00⟩ + |11⟩)/√2 = |Φ<sup>+</sup>⟩, not |+⟩|+⟩ = (|00⟩ + |01⟩ + |10⟩ + |11⟩)/2. Their overlap is |⟨++|Φ<sup>+</sup>⟩|<sup>2</sup> = 1/2: the “copy” is wrong half the time.</p>
<p><strong>What is allowed.</strong> You may copy <em>known</em> states (just prepare them again), copy classical information, <em>move</em> a state from one qubit to another (SWAP, or teleportation, which destroys the original), and make imperfect approximate clones. What you cannot do is duplicate an unknown state perfectly.</p>
<p><strong>Consequences.</strong> (1) <em>Security:</em> an eavesdropper on a quantum channel cannot copy the qubits and forward the originals; any attempt to learn about them disturbs them, which is how BB84 detects her (Chapter 7). (2) <em>Error correction:</em> we cannot protect qubits by keeping backup copies; quantum codes spread information over entangled states instead (Chapter 10). (3) <em>No signalling:</em> if cloning were possible, Bob could copy his half of an entangled pair many times, measure the copies and learn which basis Alice used — sending a message faster than light. No-cloning and no-signalling support each other.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — which pairs could one machine clone?</b> {|0⟩, |1⟩}: ⟨0|1⟩ = 0 ⇒ possible (CNOT does it). {|+⟩, |−⟩}: ⟨+|−⟩ = 0 ⇒ possible (H, CNOT, H on both qubits). {|0⟩, |+⟩}: ⟨0|+⟩ = 1/√2 ∉ {0, 1} ⇒ <b>impossible</b>.</p></div>
<div class="callout"><p><b>Example 2 — CNOT on |+⟩|0⟩ step by step.</b> |+⟩|0⟩ = (|00⟩ + |10⟩)/√2. CNOT flips the target in the |10⟩ term: (|00⟩ + |11⟩)/√2. Measuring both qubits now gives 00 or 11, never 01 or 10, whereas two true copies of |+⟩ would give each of the four strings with probability 1/4.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Concluding that quantum information cannot be transmitted. It can be <em>moved</em> (teleportation, SWAP); it just cannot be <em>duplicated</em>.</li><li>Thinking no-cloning forbids copying measurement results. Measurement results are classical bits and can be copied freely.</li><li>Believing CNOT clones because it works on |0⟩ and |1⟩ — linearity forces entanglement on superpositions.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>No unitary copies every unknown state: U(|ψ⟩|s⟩) = |ψ⟩|ψ⟩ for all |ψ⟩ is impossible.</li><li>Inner-product proof: cloning |ψ⟩ and |φ⟩ forces ⟨φ|ψ⟩ ∈ {0, 1}.</li><li>Linearity proof: copying |0⟩, |1⟩ turns α|0⟩ + β|1⟩ into the entangled α|00⟩ + β|11⟩.</li><li>CNOT(|+⟩|0⟩) = |Φ<sup>+</sup>⟩ ≠ |+⟩|+⟩.</li><li>Consequences: eavesdropping is detectable, QEC cannot use backups, no faster-than-light signalling.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/No-cloning_theorem" target="_blank" rel="noopener">Wikipedia — No-cloning theorem</a></li><li><a href="https://github.com/Qiskit/documentation/blob/main/learning/courses/basics-of-quantum-information/quantum-circuits/limitations-on-quantum-information.ipynb" target="_blank" rel="noopener">IBM Quantum Learning (Watrous) — Limitations on quantum information (source notebook)</a></li><li><a href="https://www.youtube.com/watch?v=30U2DTfIrOU" target="_blank" rel="noopener">Qiskit — Lesson 03: Quantum Circuits (Watrous; no-cloning at the end)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Can a single unitary clone both |i⟩ = (|0⟩ + i|1⟩)/√2 and |−i⟩ = (|0⟩ − i|1⟩)/√2? Justify with an inner product.</li><li>Apply CNOT<sub>01</sub> to (0.6|0⟩ + 0.8|1⟩) ⊗ |0⟩. Is the result a product state?</li><li>Why does teleportation (Chapter 7) not violate the no-cloning theorem?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) ⟨i|−i⟩ = (1 + (−i)(−i))/2 = (1 − 1)/2 = 0: orthogonal, so yes — the inner-product argument does not forbid it (apply S<sup>†</sup>, H to map them to |0⟩, |1⟩, CNOT, then undo on both qubits). 2) 0.6|00⟩ + 0.8|11⟩; ad − bc = 0.48 ≠ 0 ⇒ entangled, not two copies. 3) The original qubit is destroyed (measured) on Alice's side; at every moment only one copy of |ψ⟩ exists.</p></div>`,
  `<span class="eyebrow">QTC211 · Chương 5 · Bài 5.4</span>
<h2>Định lý không nhân bản (no-cloning)</h2>
<p class="lead">Sao chép là thao tác cơ bản nhất của tính toán cổ điển — <code>cp</code>, phép gán, sao lưu. Cơ học lượng tử cấm điều đó: không có cỗ máy nào sao chép được một trạng thái lượng tử chưa biết. Định lý dài một đoạn này định hình mật mã lượng tử, sửa lỗi và dịch chuyển lượng tử.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phát biểu chính xác định lý không nhân bản.</li><li>Chứng minh nó bằng lập luận tích trong và bằng lập luận tuyến tính.</li><li>Giải thích vì sao CNOT sao chép được |0⟩ và |1⟩ nhưng không sao chép được |+⟩.</li><li>Nêu các hệ quả: phát hiện nghe lén, thiết kế sửa lỗi, không truyền tin nhanh hơn ánh sáng.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Phát biểu.</strong> Không tồn tại ma trận unita U và trạng thái “trắng” cố định |s⟩ sao cho U(|ψ⟩ ⊗ |s⟩) = |ψ⟩ ⊗ |ψ⟩ với <em>mọi</em> trạng thái một qubit |ψ⟩. (Thêm qubit phụ hay cho phép đầu ra rác cũng không giúp được.)</p>
<p><strong>Chứng minh 1 — tích trong.</strong> Giả sử U nhân bản được hai trạng thái |ψ⟩ và |φ⟩. Ma trận unita giữ nguyên tích trong, nên so trước và sau:</p>
<div class="formula"><span class="lbl">Lập luận tích trong</span>⟨φ|ψ⟩⟨s|s⟩ = ⟨φ|ψ⟩    phải bằng    (⟨φ| ⊗ ⟨φ|)(|ψ⟩ ⊗ |ψ⟩) = ⟨φ|ψ⟩<sup>2</sup></div>
<p>Vậy ⟨φ|ψ⟩ = ⟨φ|ψ⟩<sup>2</sup>, tức ⟨φ|ψ⟩ bằng 0 hoặc 1: hai trạng thái hoặc trực giao, hoặc trùng nhau. Một máy nhân bản chỉ sao chép được một tập các trạng thái đôi một trực giao — không bao giờ sao chép được hai trạng thái khác nhau mà không trực giao như |0⟩ và |+⟩ (⟨0|+⟩ = 1/√2, và 1/√2 ≠ 1/2).</p>
<p><strong>Chứng minh 2 — tuyến tính.</strong> Giả sử U sao chép các trạng thái cơ sở: U|0⟩|s⟩ = |00⟩ và U|1⟩|s⟩ = |11⟩. Theo tính tuyến tính, với |ψ⟩ = α|0⟩ + β|1⟩:</p>
<div class="formula"><span class="lbl">Lập luận tuyến tính</span>U(α|0⟩ + β|1⟩)|s⟩ = α|00⟩ + β|11⟩    nhưng    |ψ⟩|ψ⟩ = α<sup>2</sup>|00⟩ + αβ|01⟩ + αβ|10⟩ + β<sup>2</sup>|11⟩</div>
<p>Hai biểu thức chỉ trùng khi αβ = 0, tức |ψ⟩ là |0⟩ hoặc |1⟩ (sai khác pha). Đầu ra α|00⟩ + β|11⟩ không phải bản sao — nó là một trạng thái <em>vướng víu</em>.</p>
<p><strong>CNOT như một máy sao chép thử.</strong> CNOT<sub>01</sub> với qubit đích ở |0⟩ có sao chép được bit cổ điển: |0⟩|0⟩ → |00⟩ và |1⟩|0⟩ → |11⟩ (đó là phép rẽ nhánh cổ điển, fan-out). Áp nó lên |+⟩|0⟩ thì được (|00⟩ + |11⟩)/√2 = |Φ<sup>+</sup>⟩, chứ không phải |+⟩|+⟩ = (|00⟩ + |01⟩ + |10⟩ + |11⟩)/2. Độ trùng của chúng là |⟨++|Φ<sup>+</sup>⟩|<sup>2</sup> = 1/2: “bản sao” sai một nửa số lần.</p>
<p><strong>Điều được phép.</strong> Bạn được sao chép trạng thái <em>đã biết</em> (cứ chuẩn bị lại), sao chép thông tin cổ điển, <em>di chuyển</em> một trạng thái từ qubit này sang qubit khác (SWAP, hoặc dịch chuyển lượng tử — vốn huỷ bản gốc), và tạo bản sao gần đúng không hoàn hảo. Điều không làm được là nhân đôi hoàn hảo một trạng thái chưa biết.</p>
<p><strong>Hệ quả.</strong> (1) <em>Bảo mật:</em> kẻ nghe lén trên kênh lượng tử không thể sao chép các qubit rồi chuyển tiếp bản gốc; mọi cố gắng tìm hiểu chúng đều làm nhiễu chúng, và đó là cách BB84 phát hiện kẻ nghe lén (Chương 7). (2) <em>Sửa lỗi:</em> không thể bảo vệ qubit bằng cách giữ bản sao dự phòng; mã lượng tử thay vào đó trải thông tin lên các trạng thái vướng víu (Chương 10). (3) <em>Không truyền tin:</em> nếu nhân bản được, Bob có thể sao chép nửa cặp vướng víu của mình nhiều lần, đo các bản sao và biết Alice đã dùng cơ sở nào — tức gửi tin nhanh hơn ánh sáng. Định lý không nhân bản và nguyên lý không truyền tin nâng đỡ lẫn nhau.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — cặp nào một máy có thể nhân bản?</b> {|0⟩, |1⟩}: ⟨0|1⟩ = 0 ⇒ được (CNOT làm được). {|+⟩, |−⟩}: ⟨+|−⟩ = 0 ⇒ được (H, CNOT, rồi H trên cả hai qubit). {|0⟩, |+⟩}: ⟨0|+⟩ = 1/√2 ∉ {0, 1} ⇒ <b>không thể</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2 — CNOT trên |+⟩|0⟩ từng bước.</b> |+⟩|0⟩ = (|00⟩ + |10⟩)/√2. CNOT lật qubit đích ở số hạng |10⟩: (|00⟩ + |11⟩)/√2. Đo cả hai qubit giờ chỉ ra 00 hoặc 11, không bao giờ 01 hay 10, trong khi hai bản sao thật của |+⟩ sẽ cho mỗi chuỗi trong bốn chuỗi với xác suất 1/4.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Kết luận rằng thông tin lượng tử không truyền được. Nó <em>di chuyển</em> được (dịch chuyển lượng tử, SWAP); chỉ là không <em>nhân đôi</em> được.</li><li>Nghĩ định lý cấm sao chép kết quả đo. Kết quả đo là bit cổ điển, sao chép thoải mái.</li><li>Tưởng CNOT nhân bản được vì nó chạy đúng với |0⟩ và |1⟩ — tính tuyến tính buộc nó tạo vướng víu trên chồng chập.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Không ma trận unita nào sao chép được mọi trạng thái chưa biết: U(|ψ⟩|s⟩) = |ψ⟩|ψ⟩ với mọi |ψ⟩ là bất khả.</li><li>Chứng minh bằng tích trong: nhân bản |ψ⟩ và |φ⟩ buộc ⟨φ|ψ⟩ ∈ {0, 1}.</li><li>Chứng minh bằng tuyến tính: sao chép |0⟩, |1⟩ biến α|0⟩ + β|1⟩ thành trạng thái vướng víu α|00⟩ + β|11⟩.</li><li>CNOT(|+⟩|0⟩) = |Φ<sup>+</sup>⟩ ≠ |+⟩|+⟩.</li><li>Hệ quả: nghe lén bị phát hiện, sửa lỗi lượng tử không dùng bản sao dự phòng, không truyền tin nhanh hơn ánh sáng.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/No-cloning_theorem" target="_blank" rel="noopener">Wikipedia — Định lý không nhân bản</a></li><li><a href="https://github.com/Qiskit/documentation/blob/main/learning/courses/basics-of-quantum-information/quantum-circuits/limitations-on-quantum-information.ipynb" target="_blank" rel="noopener">IBM Quantum Learning (Watrous) — Giới hạn của thông tin lượng tử (notebook gốc)</a></li><li><a href="https://www.youtube.com/watch?v=30U2DTfIrOU" target="_blank" rel="noopener">Qiskit — Lesson 03: Quantum Circuits (Watrous; phần no-cloning ở cuối)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Một ma trận unita có thể nhân bản cả |i⟩ = (|0⟩ + i|1⟩)/√2 lẫn |−i⟩ = (|0⟩ − i|1⟩)/√2 không? Lập luận bằng tích trong.</li><li>Áp CNOT<sub>01</sub> lên (0,6|0⟩ + 0,8|1⟩) ⊗ |0⟩. Kết quả có phải trạng thái tích không?</li><li>Vì sao dịch chuyển lượng tử (Chương 7) không vi phạm định lý không nhân bản?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) ⟨i|−i⟩ = (1 + (−i)(−i))/2 = (1 − 1)/2 = 0: trực giao, nên được — lập luận tích trong không cấm (áp S<sup>†</sup>, H để đưa chúng về |0⟩, |1⟩, CNOT, rồi hoàn tác trên cả hai qubit). 2) 0,6|00⟩ + 0,8|11⟩; ad − bc = 0,48 ≠ 0 ⇒ vướng víu, không phải hai bản sao. 3) Qubit gốc bị huỷ (bị đo) phía Alice; ở mọi thời điểm chỉ tồn tại một bản |ψ⟩.</p></div>`);

const q5 = QZ(5, 'Quiz — Chapter 5: Multiple qubits and entanglement|||Quiz — Chương 5: Nhiều qubit và vướng víu', 'Kiểm tra chương 5: tích tensor, thứ tự qubit, CNOT/CZ/SWAP, phản hồi pha, trạng thái Bell, phép thử trạng thái tích, đo một phần, định lý không nhân bản.', [
  Q('q1', '|+⟩ ⊗ |0⟩ equals|||Tích |+⟩ ⊗ |0⟩ bằng',
    ['(|00⟩ + |01⟩)/√2|||(|00⟩ + |01⟩)/√2', '(|00⟩ + |10⟩)/√2|||(|00⟩ + |10⟩)/√2', '(|00⟩ + |11⟩)/√2|||(|00⟩ + |11⟩)/√2', '(|0⟩ + |1⟩ + |0⟩)/√3|||(|0⟩ + |1⟩ + |0⟩)/√3'], 1,
    '(1, 1)/√2 ⊗ (1, 0) = (1, 0, 1, 0)/√2. (|00⟩ + |01⟩)/√2 is |0⟩ ⊗ |+⟩.|||(1, 1)/√2 ⊗ (1, 0) = (1, 0, 1, 0)/√2. (|00⟩ + |01⟩)/√2 là |0⟩ ⊗ |+⟩.'),
  Q('q2', 'How many complex amplitudes describe a general 10-qubit state?|||Trạng thái 10 qubit tổng quát cần bao nhiêu biên độ phức?',
    ['10|||10', '20|||20', '100|||100', '1024|||1024'], 3,
    '2^10 = 1024.|||2^10 = 1024.'),
  Q('q3', 'In Qiskit a 3-qubit result printed "001" means|||Trong Qiskit, kết quả 3 qubit in ra "001" nghĩa là',
    ['q0 = 1, q1 = 0, q2 = 0|||q0 = 1, q1 = 0, q2 = 0', 'q0 = 0, q1 = 0, q2 = 1|||q0 = 0, q1 = 0, q2 = 1', 'q1 = 1 only|||chỉ q1 = 1', 'the state is |001⟩ in this course’s order|||trạng thái là |001⟩ theo thứ tự của khoá'], 0,
    'Qiskit is little-endian: qubit 0 is the rightmost bit. In this course’s order that is |100⟩.|||Qiskit là little-endian: qubit 0 là bit ngoài cùng bên phải. Theo thứ tự của khoá, đó là |100⟩.'),
  Q('q4', 'CNOT₀₁ (control q0, target q1) maps |10⟩ to|||CNOT₀₁ (điều khiển q0, đích q1) biến |10⟩ thành',
    ['|10⟩||||10⟩', '|01⟩||||01⟩', '|11⟩||||11⟩', '|00⟩||||00⟩'], 2,
    'The control is 1, so the target flips: |x, y ⊕ x⟩ = |11⟩.|||Qubit điều khiển bằng 1 nên qubit đích lật: |x, y ⊕ x⟩ = |11⟩.'),
  Q('q5', 'CNOT₀₁ applied to |+⟩|−⟩ gives|||CNOT₀₁ áp lên |+⟩|−⟩ cho',
    ['|+⟩|−⟩||||+⟩|−⟩', '|−⟩|−⟩||||−⟩|−⟩', '|Φ⁺⟩||||Φ⁺⟩', '|+⟩|+⟩||||+⟩|+⟩'], 1,
    'Phase kickback: the eigenvalue −1 of X on |−⟩ is kicked back onto the control.|||Phản hồi pha: trị riêng −1 của X trên |−⟩ bị đá ngược về qubit điều khiển.'),
  Q('q6', 'Which statement about SWAP is correct?|||Phát biểu nào về SWAP là đúng?',
    ['SWAP = CNOT₀₁ CNOT₁₀ CNOT₀₁|||SWAP = CNOT₀₁ CNOT₁₀ CNOT₀₁', 'SWAP = H ⊗ H|||SWAP = H ⊗ H', 'SWAP = CZ|||SWAP = CZ', 'SWAP cannot be built from CNOTs|||SWAP không dựng được từ CNOT'], 0,
    'Three alternating CNOTs, like the XOR-swap trick.|||Ba CNOT đổi chiều xen kẽ, giống mẹo hoán đổi bằng XOR.'),
  Q('q7', 'H on qubit 0 then CNOT₀₁ applied to |11⟩ produces|||H trên qubit 0 rồi CNOT₀₁ áp lên |11⟩ tạo ra',
    ['|Φ⁺⟩ = (|00⟩ + |11⟩)/√2||||Φ⁺⟩ = (|00⟩ + |11⟩)/√2', '|Φ⁻⟩ = (|00⟩ − |11⟩)/√2||||Φ⁻⟩ = (|00⟩ − |11⟩)/√2', '|Ψ⁺⟩ = (|01⟩ + |10⟩)/√2||||Ψ⁺⟩ = (|01⟩ + |10⟩)/√2', '|Ψ⁻⟩ = (|01⟩ − |10⟩)/√2||||Ψ⁻⟩ = (|01⟩ − |10⟩)/√2'], 3,
    'H|1⟩ = |−⟩, giving (|01⟩ − |11⟩)/√2, then CNOT gives (|01⟩ − |10⟩)/√2.|||H|1⟩ = |−⟩ cho (|01⟩ − |11⟩)/√2, rồi CNOT cho (|01⟩ − |10⟩)/√2.'),
  Q('q8', 'Which state is entangled?|||Trạng thái nào vướng víu?',
    ['(|00⟩ + |01⟩ + |10⟩ + |11⟩)/2|||(|00⟩ + |01⟩ + |10⟩ + |11⟩)/2', '(|00⟩ + |01⟩)/√2|||(|00⟩ + |01⟩)/√2', '(|00⟩ + |01⟩ + |10⟩ − |11⟩)/2|||(|00⟩ + |01⟩ + |10⟩ − |11⟩)/2', '|1⟩ ⊗ |−⟩||||1⟩ ⊗ |−⟩'], 2,
    'ad − bc = −1/4 − 1/4 = −1/2 ≠ 0. The other three have ad − bc = 0.|||ad − bc = −1/4 − 1/4 = −1/2 ≠ 0. Ba trạng thái kia có ad − bc = 0.'),
  Q('q9', 'Measure qubit 0 of (|00⟩ + |01⟩ + |11⟩)/√3. P(outcome 0) and the post-state are|||Đo qubit 0 của (|00⟩ + |01⟩ + |11⟩)/√3. P(kết quả 0) và trạng thái sau đo là',
    ['1/3 and |00⟩|||1/3 và |00⟩', '2/3 and (|00⟩ + |01⟩)/√2|||2/3 và (|00⟩ + |01⟩)/√2', '2/3 and (|00⟩ + |01⟩)/√3|||2/3 và (|00⟩ + |01⟩)/√3', '1/2 and |0⟩|+⟩|||1/2 và |0⟩|+⟩'], 1,
    'p₀ = 1/3 + 1/3 = 2/3; keep the consistent terms and renormalise by √(2/3).|||p₀ = 1/3 + 1/3 = 2/3; giữ các số hạng phù hợp rồi chuẩn hoá lại bằng √(2/3).'),
  Q('q10', 'The no-cloning theorem implies that a unitary can clone two states |ψ⟩, |φ⟩ only if|||Định lý không nhân bản suy ra một ma trận unita chỉ nhân bản được hai trạng thái |ψ⟩, |φ⟩ khi',
    ['they are orthogonal or identical|||chúng trực giao hoặc trùng nhau', 'they have real amplitudes|||chúng có biên độ thực', 'they are both superpositions|||cả hai đều là chồng chập', 'an extra qubit is used|||dùng thêm một qubit'], 0,
    '⟨φ|ψ⟩ = ⟨φ|ψ⟩² forces ⟨φ|ψ⟩ ∈ {0, 1}.|||⟨φ|ψ⟩ = ⟨φ|ψ⟩² buộc ⟨φ|ψ⟩ ∈ {0, 1}.'),
]);

const ch5 = {
  title: 'Chapter 5 — Multiple qubits and entanglement|||Chương 5 — Nhiều qubit và vướng víu',
  description: 'Tích tensor và trạng thái nhiều qubit (quy ước thứ tự, Qiskit little-endian), cổng hai qubit CNOT/CZ/SWAP, phản hồi pha, trạng thái Bell, phép thử trạng thái tích, đo một phần, định lý không nhân bản (Nielsen & Chuang 1.3, 2.2 · Watrous Lessons 2–3).',
  lessons: [c51, c52, c53, c54, q5],
};

// ───────────────────────────── Chương 6 — Mạch lượng tử và mô phỏng ─────────────────────────────
const c61 = L('qtc211-ts-6-1',
  '6.1 — The circuit model: wires, gates, order of matrices, width and depth|||6.1 — Mô hình mạch: dây, cổng, thứ tự nhân ma trận, độ rộng và độ sâu',
  'Đọc sơ đồ mạch lượng tử: dây = qubit, thời gian trái → phải, ma trận tổng = tích phải → trái, cổng song song = tích tensor, phép đo và bit cổ điển, độ rộng/độ sâu; ma trận mạch tạo trạng thái Bell.',
  `<span class="eyebrow">QTC211 · Chapter 6 · Lesson 6.1</span>
<h2>The circuit model: wires, gates, order of matrices, width and depth</h2>
<p class="lead">A quantum algorithm is written as a <strong>circuit diagram</strong>. Reading a diagram means turning it into a product of matrices — and the single most common beginner error is multiplying in the wrong order. This lesson fixes the rules once and for all.</p>
<h3>🎯 Objectives</h3>
<ul><li>Read a circuit diagram: wires, single- and two-qubit gates, measurement, classical wires.</li><li>Convert a sequence of gates into one matrix U = U<sub>k</sub> ⋯ U<sub>2</sub>U<sub>1</sub> (right to left).</li><li>Use the tensor product for gates acting at the same time on different qubits.</li><li>Compute the width and depth of a circuit.</li></ul>
<h3>📖 Lecture</h3>
<p>In a circuit diagram each horizontal <strong>wire</strong> is one qubit. By convention in this course qubit 0 is the <strong>top</strong> wire and every qubit starts in |0⟩, so an n-qubit circuit starts in |0…0⟩. <strong>Time flows left to right</strong>: the leftmost box acts first. A box with a letter (H, X, T…) is a single-qubit gate; a dot ● on one wire joined by a vertical line to ⊕ on another wire is a CNOT (control ●, target ⊕). A meter symbol is a <strong>measurement</strong>; after it, the wire is drawn double, meaning it now carries a classical bit.</p>
<p>Because a gate acts on the state by matrix multiplication, a circuit applying U<sub>1</sub>, then U<sub>2</sub>, then U<sub>3</sub> maps |ψ⟩ to U<sub>3</sub>(U<sub>2</sub>(U<sub>1</sub>|ψ⟩)). Hence:</p>
<div class="formula"><span class="lbl">Order rule</span>diagram (left → right):  U<sub>1</sub>, U<sub>2</sub>, U<sub>3</sub>      matrix (right → left):  U<sub>total</sub> = U<sub>3</sub> · U<sub>2</sub> · U<sub>1</sub></div>
<p>Matrix multiplication is not commutative, so the order matters. When two gates act <strong>at the same time on different qubits</strong> they form one layer whose matrix is the tensor product, top qubit on the left: H on q0 and X on q1 in the same column is H ⊗ X. A wire with no gate in a layer contributes the identity I. So “H on q0 only” in a 2-qubit circuit is the 4×4 matrix H ⊗ I.</p>
<p>Two size measures appear in every paper and every hardware spec. The <strong>width</strong> is the number of qubits (wires). The <strong>depth</strong> is the number of layers when gates that touch disjoint qubits are packed into the same time step — roughly “how long the computation takes”. Depth matters because qubits decohere with time (Chapter 10): a shallow circuit is more likely to finish before noise destroys the state.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — order matters.</b> Circuit A: X then H on |0⟩. Circuit B: H then X on |0⟩.</p>
<p>A: the matrix is H·X (X written on the right because it acts first). X|0⟩ = |1⟩, then H|1⟩ = (|0⟩ − |1⟩)/√2 = <b>|−⟩</b>. B: X·H|0⟩ = X|+⟩ = (|1⟩ + |0⟩)/√2 = <b>|+⟩</b>. Same two gates, different results: |−⟩ and |+⟩ give the same Z-measurement statistics but are orthogonal states.</p></div>
<div class="callout"><p><b>Example 2 — the Bell-preparation circuit.</b> Two qubits, H on q0, then CNOT<sub>01</sub>.</p>
<p>Layer 1 is H ⊗ I; layer 2 is CNOT<sub>01</sub>. So U = CNOT<sub>01</sub> · (H ⊗ I). Multiplying out:</p>
<p>U = (1/√2) <table class="matrix"><tbody><tr><td>1</td><td>0</td><td>1</td><td>0</td></tr><tr><td>0</td><td>1</td><td>0</td><td>1</td></tr><tr><td>0</td><td>1</td><td>0</td><td>−1</td></tr><tr><td>1</td><td>0</td><td>−1</td><td>0</td></tr></tbody></table></p>
<p>Its columns are the images of |00⟩, |01⟩, |10⟩, |11⟩: U|00⟩ = (|00⟩ + |11⟩)/√2 = Φ<sup>+</sup>, U|01⟩ = Ψ<sup>+</sup>, U|10⟩ = Φ<sup>−</sup>, U|11⟩ = Ψ<sup>−</sup>. One circuit turns the computational basis into the whole Bell basis. Width 2, depth 2.</p></div>
<div class="callout"><p><b>Example 3 — depth.</b> Gates: H on q0, H on q1, H on q2, CNOT<sub>01</sub>, CNOT<sub>12</sub>. The three H gates touch different qubits ⇒ one layer. CNOT<sub>01</sub> and CNOT<sub>12</sub> share q1 ⇒ they cannot be parallel. Depth = 1 + 1 + 1 = <b>3</b>, width = 3.</p></div>
<pre><code class="language-python">import numpy as np
H = np.array([[1, 1], [1, -1]]) / np.sqrt(2)
X = np.array([[0, 1], [1, 0]]); I = np.eye(2)
CNOT01 = np.array([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 0, 1], [0, 0, 1, 0]])
ket0 = np.array([1, 0])
print("H X|0&gt; =", np.round(H @ X @ ket0, 4))   # X first, then H
print("X H|0&gt; =", np.round(X @ H @ ket0, 4))   # H first, then X
U = CNOT01 @ np.kron(H, I)                      # circuit: H on q0, then CNOT q0-&gt;q1
print(np.round(U * np.sqrt(2), 4))
print("U|00&gt; =", np.round(U @ np.kron(ket0, ket0), 4))</code></pre>
<div class="out">H X|0&gt; = [ 0.7071 -0.7071]
X H|0&gt; = [0.7071 0.7071]
[[ 1.  0.  1.  0.]
 [ 0.  1.  0.  1.]
 [ 0.  1.  0. -1.]
 [ 1.  0. -1.  0.]]
U|00&gt; = [0.7071 0.     0.     0.7071]</div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Writing the matrices in diagram order (U<sub>1</sub>U<sub>2</sub>U<sub>3</sub>). The first gate in time is the <em>rightmost</em> factor.</li><li>Forgetting the identity on idle wires: “H on q0” in a 2-qubit circuit is H ⊗ I, not H.</li><li>Putting the tensor factors in the wrong order: with qubit 0 on top, the top wire's gate is the <em>left</em> factor. (Qiskit uses the opposite convention — see Chapter 10.)</li><li>Treating measurement as a gate with a matrix. It is not unitary; after it the wire is classical.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Wire = qubit (q0 on top), time left → right, all qubits start in |0⟩.</li><li>Total matrix = product right → left: U<sub>3</sub>U<sub>2</sub>U<sub>1</sub>.</li><li>Gates in the same column on different qubits = tensor product; idle wires contribute I.</li><li>Width = number of qubits; depth = number of layers of parallel gates.</li><li>CNOT<sub>01</sub>(H ⊗ I) maps |00⟩, |01⟩, |10⟩, |11⟩ to Φ<sup>+</sup>, Ψ<sup>+</sup>, Φ<sup>−</sup>, Ψ<sup>−</sup>.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://learn.microsoft.com/en-us/azure/quantum/concepts-circuits" target="_blank" rel="noopener">Microsoft Learn — Quantum circuit diagram conventions</a></li><li><a href="https://github.com/Qiskit/documentation/blob/main/learning/courses/basics-of-quantum-information/quantum-circuits/circuits.ipynb" target="_blank" rel="noopener">IBM Quantum Learning (Watrous) — Quantum circuits: circuits (source notebook)</a></li><li><a href="https://www.youtube.com/watch?v=30U2DTfIrOU" target="_blank" rel="noopener">Qiskit — Understanding Quantum Information &amp; Computation, Lesson 03: Quantum Circuits</a></li><li><a href="https://algassert.com/quirk" target="_blank" rel="noopener">Quirk — build Example 2 and watch the amplitudes</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Write the 2-qubit circuit “X on q0, then CNOT<sub>01</sub>” as one matrix product and compute its output on |00⟩.</li><li>Compute the output of “H on q0 and H on q1 (same layer), then CNOT<sub>01</sub>” on |00⟩.</li><li>A 4-qubit circuit has: H on q0; CNOT<sub>01</sub>; CNOT<sub>23</sub>; CNOT<sub>12</sub>. What is its depth?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) U = CNOT<sub>01</sub>(X ⊗ I); (X ⊗ I)|00⟩ = |10⟩, then the control is 1 so the target flips: <b>|11⟩</b>. 2) (H ⊗ H)|00⟩ = (|00⟩ + |01⟩ + |10⟩ + |11⟩)/2; CNOT<sub>01</sub> swaps the amplitudes of |10⟩ and |11⟩, which are equal, so the state is <b>unchanged</b>: |+⟩|+⟩. 3) Layer 1: H on q0 and CNOT<sub>23</sub> (disjoint). Layer 2: CNOT<sub>01</sub>. Layer 3: CNOT<sub>12</sub> (it shares q1 with CNOT<sub>01</sub>). Depth <b>3</b>.</p></div>`,
  `<span class="eyebrow">QTC211 · Chương 6 · Bài 6.1</span>
<h2>Mô hình mạch: dây, cổng, thứ tự nhân ma trận, độ rộng và độ sâu</h2>
<p class="lead">Một thuật toán lượng tử được viết thành <strong>sơ đồ mạch</strong>. Đọc sơ đồ nghĩa là đổi nó thành tích các ma trận — và lỗi phổ biến nhất của người mới là nhân sai thứ tự. Bài này chốt các quy tắc một lần cho xong.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Đọc sơ đồ mạch: dây, cổng một và hai qubit, phép đo, dây cổ điển.</li><li>Đổi một dãy cổng thành một ma trận U = U<sub>k</sub> ⋯ U<sub>2</sub>U<sub>1</sub> (từ phải sang trái).</li><li>Dùng tích tensor cho các cổng tác động cùng lúc lên các qubit khác nhau.</li><li>Tính độ rộng và độ sâu của mạch.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Trong sơ đồ mạch, mỗi <strong>dây</strong> nằm ngang là một qubit. Quy ước trong môn này: qubit 0 là dây <strong>trên cùng</strong> và mọi qubit bắt đầu ở |0⟩, nên mạch n qubit bắt đầu ở |0…0⟩. <strong>Thời gian chạy từ trái sang phải</strong>: hộp bên trái tác động trước. Hộp có chữ (H, X, T…) là cổng một qubit; chấm ● trên một dây nối bằng vạch dọc tới ⊕ trên dây khác là cổng CNOT (điều khiển ●, đích ⊕). Ký hiệu đồng hồ đo là <strong>phép đo</strong>; sau đó dây được vẽ nét đôi, nghĩa là nó đã mang một bit cổ điển.</p>
<p>Vì cổng tác động lên trạng thái bằng phép nhân ma trận, mạch áp U<sub>1</sub>, rồi U<sub>2</sub>, rồi U<sub>3</sub> biến |ψ⟩ thành U<sub>3</sub>(U<sub>2</sub>(U<sub>1</sub>|ψ⟩)). Do đó:</p>
<div class="formula"><span class="lbl">Quy tắc thứ tự</span>sơ đồ (trái → phải):  U<sub>1</sub>, U<sub>2</sub>, U<sub>3</sub>      ma trận (phải → trái):  U<sub>tổng</sub> = U<sub>3</sub> · U<sub>2</sub> · U<sub>1</sub></div>
<p>Phép nhân ma trận không giao hoán nên thứ tự là quan trọng. Khi hai cổng tác động <strong>cùng lúc lên hai qubit khác nhau</strong>, chúng tạo thành một lớp có ma trận là tích tensor, qubit trên đứng bên trái: H trên q0 và X trên q1 cùng một cột là H ⊗ X. Dây không có cổng trong một lớp đóng góp ma trận đơn vị I. Vì vậy “H chỉ trên q0” trong mạch 2 qubit là ma trận 4×4 H ⊗ I.</p>
<p>Hai thước đo kích thước xuất hiện trong mọi bài báo và mọi thông số phần cứng. <strong>Độ rộng (width)</strong> là số qubit (số dây). <strong>Độ sâu (depth)</strong> là số lớp khi xếp các cổng chạm vào các qubit rời nhau vào cùng một bước thời gian — đại khái là “phép tính kéo dài bao lâu”. Độ sâu quan trọng vì qubit mất kết hợp theo thời gian (Chương 10): mạch nông dễ chạy xong trước khi nhiễu phá huỷ trạng thái.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — thứ tự là quan trọng.</b> Mạch A: X rồi H trên |0⟩. Mạch B: H rồi X trên |0⟩.</p>
<p>A: ma trận là H·X (X viết bên phải vì nó tác động trước). X|0⟩ = |1⟩, rồi H|1⟩ = (|0⟩ − |1⟩)/√2 = <b>|−⟩</b>. B: X·H|0⟩ = X|+⟩ = (|1⟩ + |0⟩)/√2 = <b>|+⟩</b>. Cùng hai cổng, kết quả khác nhau: |−⟩ và |+⟩ cho cùng thống kê khi đo Z nhưng là hai trạng thái trực giao.</p></div>
<div class="callout"><p><b>Ví dụ 2 — mạch tạo trạng thái Bell.</b> Hai qubit, H trên q0, rồi CNOT<sub>01</sub>.</p>
<p>Lớp 1 là H ⊗ I; lớp 2 là CNOT<sub>01</sub>. Vậy U = CNOT<sub>01</sub> · (H ⊗ I). Nhân ra:</p>
<p>U = (1/√2) <table class="matrix"><tbody><tr><td>1</td><td>0</td><td>1</td><td>0</td></tr><tr><td>0</td><td>1</td><td>0</td><td>1</td></tr><tr><td>0</td><td>1</td><td>0</td><td>−1</td></tr><tr><td>1</td><td>0</td><td>−1</td><td>0</td></tr></tbody></table></p>
<p>Các cột là ảnh của |00⟩, |01⟩, |10⟩, |11⟩: U|00⟩ = (|00⟩ + |11⟩)/√2 = Φ<sup>+</sup>, U|01⟩ = Ψ<sup>+</sup>, U|10⟩ = Φ<sup>−</sup>, U|11⟩ = Ψ<sup>−</sup>. Một mạch biến cả cơ sở tính toán thành cả cơ sở Bell. Độ rộng 2, độ sâu 2.</p></div>
<div class="callout"><p><b>Ví dụ 3 — độ sâu.</b> Các cổng: H trên q0, H trên q1, H trên q2, CNOT<sub>01</sub>, CNOT<sub>12</sub>. Ba cổng H chạm ba qubit khác nhau ⇒ một lớp. CNOT<sub>01</sub> và CNOT<sub>12</sub> dùng chung q1 ⇒ không chạy song song được. Độ sâu = 1 + 1 + 1 = <b>3</b>, độ rộng = 3.</p></div>
<pre><code class="language-python">import numpy as np
H = np.array([[1, 1], [1, -1]]) / np.sqrt(2)
X = np.array([[0, 1], [1, 0]]); I = np.eye(2)
CNOT01 = np.array([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 0, 1], [0, 0, 1, 0]])
ket0 = np.array([1, 0])
print("H X|0&gt; =", np.round(H @ X @ ket0, 4))   # X first, then H
print("X H|0&gt; =", np.round(X @ H @ ket0, 4))   # H first, then X
U = CNOT01 @ np.kron(H, I)                      # circuit: H on q0, then CNOT q0-&gt;q1
print(np.round(U * np.sqrt(2), 4))
print("U|00&gt; =", np.round(U @ np.kron(ket0, ket0), 4))</code></pre>
<div class="out">H X|0&gt; = [ 0.7071 -0.7071]
X H|0&gt; = [0.7071 0.7071]
[[ 1.  0.  1.  0.]
 [ 0.  1.  0.  1.]
 [ 0.  1.  0. -1.]
 [ 1.  0. -1.  0.]]
U|00&gt; = [0.7071 0.     0.     0.7071]</div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Viết ma trận theo thứ tự trên sơ đồ (U<sub>1</sub>U<sub>2</sub>U<sub>3</sub>). Cổng đầu tiên theo thời gian là thừa số <em>bên phải nhất</em>.</li><li>Quên ma trận đơn vị trên dây rảnh: “H trên q0” trong mạch 2 qubit là H ⊗ I, không phải H.</li><li>Đặt sai thứ tự thừa số tensor: với qubit 0 ở trên cùng, cổng của dây trên cùng là thừa số <em>bên trái</em>. (Qiskit dùng quy ước ngược lại — xem Chương 10.)</li><li>Coi phép đo là một cổng có ma trận. Nó không unita; sau phép đo dây là dây cổ điển.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Dây = qubit (q0 trên cùng), thời gian trái → phải, mọi qubit bắt đầu ở |0⟩.</li><li>Ma trận tổng = tích từ phải sang trái: U<sub>3</sub>U<sub>2</sub>U<sub>1</sub>.</li><li>Các cổng cùng cột trên các qubit khác nhau = tích tensor; dây rảnh góp I.</li><li>Độ rộng = số qubit; độ sâu = số lớp cổng song song.</li><li>CNOT<sub>01</sub>(H ⊗ I) biến |00⟩, |01⟩, |10⟩, |11⟩ thành Φ<sup>+</sup>, Ψ<sup>+</sup>, Φ<sup>−</sup>, Ψ<sup>−</sup>.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://learn.microsoft.com/en-us/azure/quantum/concepts-circuits" target="_blank" rel="noopener">Microsoft Learn — Quy ước vẽ sơ đồ mạch lượng tử</a></li><li><a href="https://github.com/Qiskit/documentation/blob/main/learning/courses/basics-of-quantum-information/quantum-circuits/circuits.ipynb" target="_blank" rel="noopener">IBM Quantum Learning (Watrous) — Mạch lượng tử (notebook gốc)</a></li><li><a href="https://www.youtube.com/watch?v=30U2DTfIrOU" target="_blank" rel="noopener">Qiskit — Understanding Quantum Information &amp; Computation, Lesson 03: Quantum Circuits</a></li><li><a href="https://algassert.com/quirk" target="_blank" rel="noopener">Quirk — dựng Ví dụ 2 và xem biên độ</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Viết mạch 2 qubit “X trên q0, rồi CNOT<sub>01</sub>” thành một tích ma trận và tính đầu ra với đầu vào |00⟩.</li><li>Tính đầu ra của mạch “H trên q0 và H trên q1 (cùng lớp), rồi CNOT<sub>01</sub>” với đầu vào |00⟩.</li><li>Mạch 4 qubit gồm: H trên q0; CNOT<sub>01</sub>; CNOT<sub>23</sub>; CNOT<sub>12</sub>. Độ sâu bằng bao nhiêu?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) U = CNOT<sub>01</sub>(X ⊗ I); (X ⊗ I)|00⟩ = |10⟩, rồi điều khiển bằng 1 nên đích bị lật: <b>|11⟩</b>. 2) (H ⊗ H)|00⟩ = (|00⟩ + |01⟩ + |10⟩ + |11⟩)/2; CNOT<sub>01</sub> đổi chỗ biên độ của |10⟩ và |11⟩, mà hai biên độ này bằng nhau, nên trạng thái <b>không đổi</b>: |+⟩|+⟩. 3) Lớp 1: H trên q0 và CNOT<sub>23</sub> (rời nhau). Lớp 2: CNOT<sub>01</sub>. Lớp 3: CNOT<sub>12</sub> (dùng chung q1 với CNOT<sub>01</sub>). Độ sâu <b>3</b>.</p></div>`);

const c62 = L('qtc211-ts-6-2',
  '6.2 — Build a state-vector simulator in numpy (GHZ state, shots, memory cost)|||6.2 — Tự viết trình mô phỏng vectơ trạng thái bằng numpy (trạng thái GHZ, lượt đo, chi phí bộ nhớ)',
  'Viết trình mô phỏng vectơ trạng thái ~20 dòng numpy: áp cổng một qubit lên qubit k bằng reshape/tensordot, áp CNOT, tính xác suất, lấy mẫu lượt đo có seed; tạo trạng thái GHZ 3 qubit; vì sao 30 qubit cần 16 GiB.',
  `<span class="eyebrow">QTC211 · Chapter 6 · Lesson 6.2</span>
<h2>Build a state-vector simulator in numpy</h2>
<p class="lead">Every quantum SDK ships a simulator, but writing one yourself is the fastest way to understand what a circuit really does — and why classical simulation becomes impossible beyond about 50 qubits. Our simulator is about twenty lines of numpy.</p>
<h3>🎯 Objectives</h3>
<ul><li>Store an n-qubit state as a numpy array of 2<sup>n</sup> complex amplitudes.</li><li>Apply a single-qubit gate to qubit k <em>without</em> building the 2<sup>n</sup>×2<sup>n</sup> matrix.</li><li>Apply a CNOT between any two qubits, compute probabilities and sample measurement shots.</li><li>Estimate the memory needed to simulate n qubits.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>Representation.</strong> An n-qubit state is a vector of length 2<sup>n</sup>; amplitude index i written in binary is the bit string q0 q1 … q(n−1), with q0 the <em>leftmost</em> (most significant) bit — the same order as np.kron(q0, q1, …) used since Chapter 5. The trick that makes simulation efficient is to <strong>reshape</strong> the vector into an n-dimensional array of shape (2, 2, …, 2): then axis k is exactly qubit k, and the amplitude of |b<sub>0</sub>b<sub>1</sub>…⟩ is psi[b<sub>0</sub>, b<sub>1</sub>, …].</p>
<p><strong>Single-qubit gate on qubit k.</strong> Building I ⊗ … ⊗ U ⊗ … ⊗ I costs 4<sup>n</sup> numbers. Instead, contract the 2×2 matrix U with axis k only: <code>np.tensordot(U, psi, axes=([1], [k]))</code> computes Σ<sub>b</sub> U[a, b] psi[…, b, …] for every value of the other axes. tensordot puts the new axis first, so we move it back to position k. Cost: about 2 · 2<sup>n</sup> multiplications instead of 4<sup>n</sup>.</p>
<p><strong>CNOT with control c and target t.</strong> Take the half of the array where qubit c equals 1 and apply X to qubit t there — X just swaps the t = 0 and t = 1 slices, which is <code>np.flip</code> along that axis. The half where the control is 0 is left untouched.</p>
<p><strong>Measurement.</strong> The probability of each basis string is |amplitude|<sup>2</sup>. A real device returns <strong>shots</strong>: we imitate it with <code>rng.choice(2**n, size=shots, p=probabilities)</code>, using a fixed seed so the run is reproducible.</p>
<div class="formula"><span class="lbl">Memory cost</span>2<sup>n</sup> amplitudes × 16 bytes (complex128):  20 qubits = 16 MiB,  30 qubits = 16 GiB,  40 qubits = 16 TiB,  50 qubits = 16 PiB</div>
<p>Each extra qubit <strong>doubles</strong> the memory. That exponential wall is the reason quantum computers are interesting: no classical machine can even <em>store</em> the state of a generic 50-qubit computation this way. (Special circuits — e.g. Clifford circuits, Lesson 6.3 — can be simulated far more cheaply.)</p>
<h3>✍️ Worked example — the GHZ state</h3>
<div class="callout"><p>Circuit: H on q0, CNOT<sub>01</sub>, CNOT<sub>12</sub>, starting from |000⟩.</p>
<p>Step 1: H on q0 ⇒ (|000⟩ + |100⟩)/√2. Step 2: CNOT<sub>01</sub> flips q1 where q0 = 1 ⇒ (|000⟩ + |110⟩)/√2. Step 3: CNOT<sub>12</sub> flips q2 where q1 = 1 ⇒ <b>(|000⟩ + |111⟩)/√2</b>, the 3-qubit <strong>GHZ state</strong> (Greenberger–Horne–Zeilinger). Measuring gives 000 or 111, each with probability 1/2 — never a mixed string.</p></div>
<pre><code class="language-python">import numpy as np

def zero_state(n):
    s = np.zeros(2**n, dtype=complex); s[0] = 1
    return s

def apply_1q(state, U, k, n):
    psi = state.reshape([2] * n)                  # one axis per qubit; axis k = qubit k
    psi = np.tensordot(U, psi, axes=([1], [k]))   # U acts on axis k (new axis comes first)
    psi = np.moveaxis(psi, 0, k)                  # move that axis back to position k
    return psi.reshape(-1)

def apply_cnot(state, c, t, n):
    psi = state.reshape([2] * n).copy()
    idx = [slice(None)] * n; idx[c] = 1           # the part of the state where control = 1
    tt = t if t &lt; c else t - 1                    # target axis inside that part
    psi[tuple(idx)] = np.flip(psi[tuple(idx)], axis=tt)   # X on target = swap its 0/1 halves
    return psi.reshape(-1)

def probabilities(state):
    return np.abs(state) ** 2

H = np.array([[1, 1], [1, -1]]) / np.sqrt(2)
n = 3
s = zero_state(n)
s = apply_1q(s, H, 0, n)       # H on q0
s = apply_cnot(s, 0, 1, n)     # CNOT q0 -&gt; q1
s = apply_cnot(s, 1, 2, n)     # CNOT q1 -&gt; q2
for i, p in enumerate(probabilities(s)):
    if p &gt; 1e-12:
        print(format(i, '03b'), np.round(s[i], 4), round(float(p), 4))
rng = np.random.default_rng(seed=7)
shots = rng.choice(2**n, size=1000, p=probabilities(s))
vals, counts = np.unique(shots, return_counts=True)
print({format(int(v), '03b'): int(c) for v, c in zip(vals, counts)})</code></pre>
<div class="out">000 (0.7071+0j) 0.5
111 (0.7071+0j) 0.5
{'000': 502, '111': 498}</div>
<p>We also tested the two functions against the full matrices (np.kron for every qubit position, and an explicit permutation matrix for all six CNOT directions on 3 qubits) on a random state: all agree. <strong>Always test a simulator against a slow, obviously-correct version</strong> before trusting it. Note the bit strings here are printed q0 first; Qiskit prints them the other way round (little-endian) — Chapter 10 shows how to translate.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Forgetting <code>np.moveaxis</code> after <code>tensordot</code>: the gate then silently acts on the right qubit but the axes end up permuted, so later gates hit the wrong qubits.</li><li>Expecting exactly 500/500 shots. Sampling has statistical noise of about √(1000 · 0.5 · 0.5) ≈ 16 counts; 502/498 is perfectly normal.</li><li>Building the full 2<sup>n</sup>×2<sup>n</sup> matrix for every gate: fine for 3 qubits, impossible for 25 (that matrix alone would need 2<sup>50</sup> entries).</li><li>Using integer arrays: a state must be <code>dtype=complex</code>, otherwise amplitudes like i or 1/√2 are truncated.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>State = complex array of length 2<sup>n</sup>; reshape to (2,…,2) so axis k is qubit k.</li><li>1-qubit gate: tensordot on axis k + moveaxis; CNOT: flip the target axis inside the control = 1 half.</li><li>Probabilities |amp|<sup>2</sup>; shots = seeded sampling.</li><li>Memory 16 · 2<sup>n</sup> bytes: 30 qubits ≈ 16 GiB — each qubit doubles it.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://github.com/Qiskit/documentation/blob/main/learning/courses/basics-of-quantum-information/multiple-systems/qiskit-implementation.ipynb" target="_blank" rel="noopener">IBM Quantum Learning (Watrous) — Multiple systems: Qiskit implementation (source notebook)</a></li><li><a href="https://www.youtube.com/watch?v=DfZZS8Spe7U" target="_blank" rel="noopener">Qiskit — Understanding Quantum Information &amp; Computation, Lesson 02: Multiple Systems</a></li><li><a href="https://en.wikipedia.org/wiki/Quantum_circuit" target="_blank" rel="noopener">Wikipedia — Quantum circuit</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Using the functions above, apply H to all three qubits of |000⟩. What are the eight probabilities?</li><li>Start from |000⟩, apply X to q2, then CNOT with control q2 and target q0. Which basis state do you get?</li><li>How many bytes does a 35-qubit complex128 state vector need? Express in GiB.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) The uniform superposition: every string has probability <b>1/8 = 0.125</b>. 2) X on q2 gives |001⟩; the control q2 is 1, so q0 flips: <b>|101⟩</b> (our simulator prints index 101). 3) 2<sup>35</sup> × 16 = 2<sup>39</sup> bytes = 2<sup>9</sup> GiB = <b>512 GiB</b>.</p></div>`,
  `<span class="eyebrow">QTC211 · Chương 6 · Bài 6.2</span>
<h2>Tự viết trình mô phỏng vectơ trạng thái bằng numpy</h2>
<p class="lead">SDK lượng tử nào cũng kèm trình mô phỏng, nhưng tự viết một cái là cách nhanh nhất để hiểu mạch thật sự làm gì — và vì sao mô phỏng cổ điển trở nên bất khả thi khi vượt quá khoảng 50 qubit. Trình mô phỏng của ta chỉ khoảng hai mươi dòng numpy.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Lưu trạng thái n qubit thành mảng numpy gồm 2<sup>n</sup> biên độ phức.</li><li>Áp cổng một qubit lên qubit k mà <em>không</em> dựng ma trận 2<sup>n</sup>×2<sup>n</sup>.</li><li>Áp CNOT giữa hai qubit bất kỳ, tính xác suất và lấy mẫu các lượt đo.</li><li>Ước lượng bộ nhớ cần để mô phỏng n qubit.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Biểu diễn.</strong> Trạng thái n qubit là vectơ độ dài 2<sup>n</sup>; chỉ số i của biên độ viết ở hệ nhị phân là chuỗi bit q0 q1 … q(n−1), với q0 là bit <em>bên trái nhất</em> (cao nhất) — cùng thứ tự với np.kron(q0, q1, …) dùng từ Chương 5. Mẹo làm mô phỏng hiệu quả là <strong>reshape</strong> vectơ thành mảng n chiều có hình (2, 2, …, 2): khi đó trục k chính là qubit k, và biên độ của |b<sub>0</sub>b<sub>1</sub>…⟩ là psi[b<sub>0</sub>, b<sub>1</sub>, …].</p>
<p><strong>Cổng một qubit trên qubit k.</strong> Dựng I ⊗ … ⊗ U ⊗ … ⊗ I tốn 4<sup>n</sup> số. Thay vào đó, chỉ co ma trận 2×2 U với trục k: <code>np.tensordot(U, psi, axes=([1], [k]))</code> tính Σ<sub>b</sub> U[a, b] psi[…, b, …] với mọi giá trị của các trục còn lại. tensordot đặt trục mới lên đầu, nên ta chuyển nó về vị trí k. Chi phí: khoảng 2 · 2<sup>n</sup> phép nhân thay vì 4<sup>n</sup>.</p>
<p><strong>CNOT với điều khiển c và đích t.</strong> Lấy nửa mảng nơi qubit c bằng 1 rồi áp X lên qubit t ở đó — X chỉ đổi chỗ lát t = 0 và lát t = 1, tức là <code>np.flip</code> theo trục đó. Nửa có điều khiển bằng 0 giữ nguyên.</p>
<p><strong>Phép đo.</strong> Xác suất của mỗi chuỗi cơ sở là |biên độ|<sup>2</sup>. Máy thật trả về các <strong>lượt đo (shot)</strong>: ta bắt chước bằng <code>rng.choice(2**n, size=shots, p=probabilities)</code>, dùng seed cố định để chạy lại ra đúng kết quả.</p>
<div class="formula"><span class="lbl">Chi phí bộ nhớ</span>2<sup>n</sup> biên độ × 16 byte (complex128):  20 qubit = 16 MiB,  30 qubit = 16 GiB,  40 qubit = 16 TiB,  50 qubit = 16 PiB</div>
<p>Mỗi qubit thêm vào làm bộ nhớ <strong>gấp đôi</strong>. Bức tường hàm mũ đó chính là lý do máy lượng tử đáng quan tâm: không máy cổ điển nào <em>lưu</em> nổi theo cách này trạng thái của một phép tính 50 qubit tổng quát. (Một số mạch đặc biệt — vd mạch Clifford, Bài 6.3 — mô phỏng rẻ hơn rất nhiều.)</p>
<h3>✍️ Ví dụ giải từng bước — trạng thái GHZ</h3>
<div class="callout"><p>Mạch: H trên q0, CNOT<sub>01</sub>, CNOT<sub>12</sub>, bắt đầu từ |000⟩.</p>
<p>Bước 1: H trên q0 ⇒ (|000⟩ + |100⟩)/√2. Bước 2: CNOT<sub>01</sub> lật q1 ở chỗ q0 = 1 ⇒ (|000⟩ + |110⟩)/√2. Bước 3: CNOT<sub>12</sub> lật q2 ở chỗ q1 = 1 ⇒ <b>(|000⟩ + |111⟩)/√2</b>, chính là <strong>trạng thái GHZ</strong> 3 qubit (Greenberger–Horne–Zeilinger). Đo ra 000 hoặc 111, mỗi kết quả xác suất 1/2 — không bao giờ ra chuỗi lẫn lộn.</p></div>
<pre><code class="language-python">import numpy as np

def zero_state(n):
    s = np.zeros(2**n, dtype=complex); s[0] = 1
    return s

def apply_1q(state, U, k, n):
    psi = state.reshape([2] * n)                  # one axis per qubit; axis k = qubit k
    psi = np.tensordot(U, psi, axes=([1], [k]))   # U acts on axis k (new axis comes first)
    psi = np.moveaxis(psi, 0, k)                  # move that axis back to position k
    return psi.reshape(-1)

def apply_cnot(state, c, t, n):
    psi = state.reshape([2] * n).copy()
    idx = [slice(None)] * n; idx[c] = 1           # the part of the state where control = 1
    tt = t if t &lt; c else t - 1                    # target axis inside that part
    psi[tuple(idx)] = np.flip(psi[tuple(idx)], axis=tt)   # X on target = swap its 0/1 halves
    return psi.reshape(-1)

def probabilities(state):
    return np.abs(state) ** 2

H = np.array([[1, 1], [1, -1]]) / np.sqrt(2)
n = 3
s = zero_state(n)
s = apply_1q(s, H, 0, n)       # H on q0
s = apply_cnot(s, 0, 1, n)     # CNOT q0 -&gt; q1
s = apply_cnot(s, 1, 2, n)     # CNOT q1 -&gt; q2
for i, p in enumerate(probabilities(s)):
    if p &gt; 1e-12:
        print(format(i, '03b'), np.round(s[i], 4), round(float(p), 4))
rng = np.random.default_rng(seed=7)
shots = rng.choice(2**n, size=1000, p=probabilities(s))
vals, counts = np.unique(shots, return_counts=True)
print({format(int(v), '03b'): int(c) for v, c in zip(vals, counts)})</code></pre>
<div class="out">000 (0.7071+0j) 0.5
111 (0.7071+0j) 0.5
{'000': 502, '111': 498}</div>
<p>Ta đã kiểm hai hàm trên với ma trận đầy đủ (np.kron cho từng vị trí qubit, và ma trận hoán vị tường minh cho cả sáu hướng CNOT trên 3 qubit) trên một trạng thái ngẫu nhiên: tất cả khớp. <strong>Luôn kiểm trình mô phỏng với một bản chậm nhưng hiển nhiên đúng</strong> trước khi tin nó. Lưu ý chuỗi bit ở đây in q0 trước; Qiskit in theo chiều ngược lại (little-endian) — Chương 10 chỉ cách quy đổi.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Quên <code>np.moveaxis</code> sau <code>tensordot</code>: cổng vẫn tác động đúng qubit nhưng các trục bị hoán vị, nên các cổng sau đánh nhầm qubit mà không báo lỗi.</li><li>Đòi đúng 500/500 lượt. Lấy mẫu có nhiễu thống kê cỡ √(1000 · 0,5 · 0,5) ≈ 16 lượt; 502/498 là hoàn toàn bình thường.</li><li>Dựng ma trận đầy đủ 2<sup>n</sup>×2<sup>n</sup> cho mỗi cổng: ổn với 3 qubit, bất khả với 25 (riêng ma trận đó đã cần 2<sup>50</sup> phần tử).</li><li>Dùng mảng số nguyên: trạng thái phải là <code>dtype=complex</code>, không thì các biên độ như i hay 1/√2 bị cắt cụt.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Trạng thái = mảng phức độ dài 2<sup>n</sup>; reshape thành (2,…,2) để trục k là qubit k.</li><li>Cổng 1 qubit: tensordot trên trục k + moveaxis; CNOT: lật trục đích trong nửa có điều khiển = 1.</li><li>Xác suất |biên độ|<sup>2</sup>; lượt đo = lấy mẫu có seed.</li><li>Bộ nhớ 16 · 2<sup>n</sup> byte: 30 qubit ≈ 16 GiB — mỗi qubit làm gấp đôi.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://github.com/Qiskit/documentation/blob/main/learning/courses/basics-of-quantum-information/multiple-systems/qiskit-implementation.ipynb" target="_blank" rel="noopener">IBM Quantum Learning (Watrous) — Hệ nhiều thành phần: cài đặt bằng Qiskit (notebook gốc)</a></li><li><a href="https://www.youtube.com/watch?v=DfZZS8Spe7U" target="_blank" rel="noopener">Qiskit — Understanding Quantum Information &amp; Computation, Lesson 02: Multiple Systems</a></li><li><a href="https://en.wikipedia.org/wiki/Quantum_circuit" target="_blank" rel="noopener">Wikipedia — Mạch lượng tử</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Dùng các hàm trên, áp H lên cả ba qubit của |000⟩. Tám xác suất bằng bao nhiêu?</li><li>Bắt đầu từ |000⟩, áp X lên q2, rồi CNOT với điều khiển q2 và đích q0. Được trạng thái cơ sở nào?</li><li>Một vectơ trạng thái 35 qubit kiểu complex128 cần bao nhiêu byte? Đổi ra GiB.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Chồng chập đều: mọi chuỗi có xác suất <b>1/8 = 0,125</b>. 2) X trên q2 cho |001⟩; điều khiển q2 bằng 1 nên q0 bị lật: <b>|101⟩</b> (trình mô phỏng in chỉ số 101). 3) 2<sup>35</sup> × 16 = 2<sup>39</sup> byte = 2<sup>9</sup> GiB = <b>512 GiB</b>.</p></div>`);

const c63 = L('qtc211-ts-6-3',
  '6.3 — Circuit identities, reversible classical computation and universal gate sets|||6.3 — Đẳng thức mạch, tính toán cổ điển khả nghịch và bộ cổng phổ dụng',
  'Các đẳng thức kiểm bằng numpy: HXH = Z, đảo chiều CNOT bằng H⊗H, CZ từ CNOT, SWAP = 3 CNOT; cổng Toffoli = AND khả nghịch, mạch cổ điển nhúng vào mạch lượng tử; bộ cổng phổ dụng {H, T, CNOT}, Clifford + T, Solovay–Kitaev.',
  `<span class="eyebrow">QTC211 · Chapter 6 · Lesson 6.3</span>
<h2>Circuit identities, reversible classical computation and universal gate sets</h2>
<p class="lead">Compilers for quantum hardware constantly rewrite circuits into equivalent ones that the machine can run. The rewriting rules are matrix identities you can check yourself. This lesson collects the essential ones, shows that every classical computation fits inside a quantum circuit, and explains what “universal gate set” means.</p>
<h3>🎯 Objectives</h3>
<ul><li>Prove and use the identities HXH = Z, (H⊗H)CNOT<sub>01</sub>(H⊗H) = CNOT<sub>10</sub>, CZ = (I⊗H)CNOT<sub>01</sub>(I⊗H), SWAP = three CNOTs.</li><li>Explain the Toffoli gate and why it makes quantum circuits at least as powerful as classical ones.</li><li>State what a universal gate set is and name {H, T, CNOT} and Clifford + T.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>Basis-change identities.</strong> H maps the Z basis to the X basis and back, so “conjugating” a gate by H swaps the roles of X and Z: <strong>HXH = Z</strong> and <strong>HZH = X</strong>. The two-qubit version is surprising the first time: surrounding a CNOT by Hadamards on both qubits <strong>reverses its direction</strong>, (H⊗H)·CNOT<sub>01</sub>·(H⊗H) = CNOT<sub>10</sub> — in the X basis the “target” acts like a control. Similarly, Hadamards on the target turn the bit flip into a phase flip: (I⊗H)·CNOT<sub>01</sub>·(I⊗H) = <strong>CZ</strong> = diag(1, 1, 1, −1). CZ is symmetric — it has no preferred control. Finally, three alternating CNOTs exchange two qubits: CNOT<sub>01</sub>·CNOT<sub>10</sub>·CNOT<sub>01</sub> = <strong>SWAP</strong>. Hardware whose qubits are connected only to neighbours pays for every long-distance CNOT with SWAPs, so this identity directly costs depth.</p>
<p><strong>Reversible classical computation.</strong> A quantum gate is unitary, hence invertible. Ordinary AND is not reversible (output 0 does not tell you the inputs). The fix is the <strong>Toffoli gate</strong> (controlled-controlled-NOT): |a, b, c⟩ → |a, b, c ⊕ (a AND b)⟩. With c = 0 the third qubit receives a AND b while a and b are kept. Toffoli is its own inverse, and Toffoli plus ancilla bits can simulate any classical circuit (it gives NOT with a = b = 1 and FAN-OUT/copy of basis bits with b = 1, c = 0). Therefore <strong>any classical algorithm can be run on a quantum computer</strong> with only polynomial overhead — the oracles of Chapter 8 are built exactly this way.</p>
<p><strong>Universality.</strong> A gate set is <strong>universal</strong> if circuits made from it can approximate any unitary to any desired accuracy. Two standard facts (Nielsen &amp; Chuang §4.5): (1) single-qubit gates plus CNOT are exactly universal; (2) the finite set <strong>{H, T, CNOT}</strong> is approximately universal. The <strong>Clifford gates</strong> H, S, CNOT alone are <em>not</em> enough: by the Gottesman–Knill theorem, Clifford circuits on stabilizer inputs can be simulated efficiently on a classical computer. Adding the single non-Clifford gate T (with T<sup>2</sup> = S) gives “Clifford + T”, the gate set of most fault-tolerant architectures. The <strong>Solovay–Kitaev theorem</strong> guarantees that approximating a single-qubit gate to accuracy ε needs only a number of H and T gates that grows like a power of log(1/ε) — so a finite gate set loses very little efficiency.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — HXH = Z by hand.</b> HX = (1/√2)(1, 1; −1, 1) (X swaps the columns of H). Then (HX)H = (1/2)(1·1 + 1·1, 1·1 + 1·(−1); −1·1 + 1·1, −1·1 + 1·(−1)) = (1/2)(2, 0; 0, −2) = <b>Z</b>.</p></div>
<div class="callout"><p><b>Example 2 — CZ from CNOT, on basis states.</b> Apply (I⊗H)CNOT<sub>01</sub>(I⊗H) to |11⟩. Step 1: I⊗H gives |1⟩|−⟩. Step 2: the control is 1, so X acts on |−⟩: X|−⟩ = −|−⟩, giving −|1⟩|−⟩. Step 3: I⊗H turns |−⟩ back into |1⟩: <b>−|11⟩</b>. On |00⟩, |01⟩, |10⟩ the control is 0 or the target is unchanged up to H·H = I, so they stay. That is CZ.</p></div>
<div class="callout"><p><b>Example 3 — Toffoli truth table.</b> With c = 0: |000⟩ → |000⟩, |010⟩ → |010⟩, |100⟩ → |100⟩, |110⟩ → <b>|111⟩</b>. The last bit is a AND b; a, b survive, so the map is a permutation of basis states — a unitary.</p></div>
<pre><code class="language-python">import numpy as np
H = np.array([[1, 1], [1, -1]]) / np.sqrt(2)
X = np.array([[0, 1], [1, 0]]); Z = np.diag([1, -1]); I = np.eye(2)
T = np.diag([1, np.exp(1j * np.pi / 4)]); S = np.diag([1, 1j])
CNOT01 = np.array([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 0, 1], [0, 0, 1, 0]])
CNOT10 = np.array([[1, 0, 0, 0], [0, 0, 0, 1], [0, 0, 1, 0], [0, 1, 0, 0]])
CZ = np.diag([1, 1, 1, -1])
SWAP = np.array([[1, 0, 0, 0], [0, 0, 1, 0], [0, 1, 0, 0], [0, 0, 0, 1]])
HH, IH = np.kron(H, H), np.kron(I, H)
print("HXH = Z                 :", np.allclose(H @ X @ H, Z))
print("(H⊗H)CNOT01(H⊗H) = CNOT10:", np.allclose(HH @ CNOT01 @ HH, CNOT10))
print("(I⊗H)CNOT01(I⊗H) = CZ    :", np.allclose(IH @ CNOT01 @ IH, CZ))
print("CNOT01 CNOT10 CNOT01 = SWAP:", np.allclose(CNOT01 @ CNOT10 @ CNOT01, SWAP))
print("T·T = S, S·S = Z        :", np.allclose(T @ T, S), np.allclose(S @ S, Z))</code></pre>
<div class="out">HXH = Z                 : True
(H⊗H)CNOT01(H⊗H) = CNOT10: True
(I⊗H)CNOT01(I⊗H) = CZ    : True
CNOT01 CNOT10 CNOT01 = SWAP: True
T·T = S, S·S = Z        : True True</div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Thinking a CNOT only ever influences its target. In the X basis information flows from target to control — the basis of phase kickback (Chapter 8).</li><li>Claiming “CNOT copies qubits”. It copies <em>basis</em> bits only; on |+⟩|0⟩ it produces an entangled Bell state, not |+⟩|+⟩ (no-cloning, Chapter 5).</li><li>Believing Clifford circuits give a quantum speed-up. They are classically simulable; the non-Clifford T gate is what makes quantum computing hard to simulate.</li><li>Reading SWAP = three CNOTs with all three in the same direction. The middle one must point the other way.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>HXH = Z, HZH = X; Hadamards on both qubits reverse a CNOT; on the target only they turn CNOT into CZ.</li><li>SWAP = CNOT<sub>01</sub>CNOT<sub>10</sub>CNOT<sub>01</sub> (costly on hardware with limited connectivity).</li><li>Toffoli = reversible AND ⇒ every classical computation embeds in a quantum circuit.</li><li>Universal: {any 1-qubit gate, CNOT} exactly; {H, T, CNOT} approximately (Solovay–Kitaev keeps it efficient).</li><li>Clifford (H, S, CNOT) alone is classically simulable (Gottesman–Knill); T is the extra ingredient.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Toffoli_gate" target="_blank" rel="noopener">Wikipedia — Toffoli gate</a></li><li><a href="https://en.wikipedia.org/wiki/Clifford_gates" target="_blank" rel="noopener">Wikipedia — Clifford gates</a></li><li><a href="https://en.wikipedia.org/wiki/Gottesman%E2%80%93Knill_theorem" target="_blank" rel="noopener">Wikipedia — Gottesman–Knill theorem</a></li><li><a href="https://github.com/Qiskit/documentation/blob/main/learning/courses/fundamentals-of-quantum-algorithms/quantum-algorithmic-foundations/simulating-classical-computations.ipynb" target="_blank" rel="noopener">IBM Quantum Learning (Watrous) — Simulating classical computations with quantum circuits (source notebook)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Verify HZH = X on the input |0⟩ by tracking the state through the three gates.</li><li>How does a Toffoli gate with inputs |1, 1, c⟩ act on c? Which classical gate is that?</li><li>A device only allows CNOT<sub>01</sub> (never CNOT<sub>10</sub>). How can you still implement CNOT<sub>10</sub>, and how many extra single-qubit gates does it cost?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) H|0⟩ = |+⟩; Z|+⟩ = |−⟩; H|−⟩ = |1⟩ = X|0⟩ ✓. 2) c → c ⊕ 1: a <b>NOT</b> on c. 3) Use (H⊗H)CNOT<sub>01</sub>(H⊗H) = CNOT<sub>10</sub>: <b>four</b> extra Hadamards (two before, two after).</p></div>`,
  `<span class="eyebrow">QTC211 · Chương 6 · Bài 6.3</span>
<h2>Đẳng thức mạch, tính toán cổ điển khả nghịch và bộ cổng phổ dụng</h2>
<p class="lead">Trình biên dịch cho phần cứng lượng tử liên tục viết lại mạch thành mạch tương đương mà máy chạy được. Các luật viết lại đó là những đẳng thức ma trận bạn tự kiểm được. Bài này gom các đẳng thức cốt lõi, chỉ ra mọi phép tính cổ điển đều nằm gọn trong một mạch lượng tử, và giải thích “bộ cổng phổ dụng” nghĩa là gì.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Chứng minh và dùng các đẳng thức HXH = Z, (H⊗H)CNOT<sub>01</sub>(H⊗H) = CNOT<sub>10</sub>, CZ = (I⊗H)CNOT<sub>01</sub>(I⊗H), SWAP = ba CNOT.</li><li>Giải thích cổng Toffoli và vì sao nó làm mạch lượng tử mạnh ít nhất bằng mạch cổ điển.</li><li>Phát biểu thế nào là bộ cổng phổ dụng, kể được {H, T, CNOT} và Clifford + T.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Đẳng thức đổi cơ sở.</strong> H biến cơ sở Z thành cơ sở X và ngược lại, nên “kẹp” một cổng giữa hai cổng H sẽ đổi vai trò của X và Z: <strong>HXH = Z</strong> và <strong>HZH = X</strong>. Phiên bản hai qubit gây bất ngờ lần đầu gặp: kẹp CNOT giữa các cổng Hadamard trên cả hai qubit sẽ <strong>đảo chiều</strong> nó, (H⊗H)·CNOT<sub>01</sub>·(H⊗H) = CNOT<sub>10</sub> — trong cơ sở X, qubit “đích” lại đóng vai điều khiển. Tương tự, Hadamard trên qubit đích biến phép lật bit thành phép lật pha: (I⊗H)·CNOT<sub>01</sub>·(I⊗H) = <strong>CZ</strong> = diag(1, 1, 1, −1). CZ đối xứng — không có qubit điều khiển ưu tiên. Cuối cùng, ba CNOT xen kẽ chiều đổi chỗ hai qubit: CNOT<sub>01</sub>·CNOT<sub>10</sub>·CNOT<sub>01</sub> = <strong>SWAP</strong>. Phần cứng mà qubit chỉ nối với hàng xóm phải trả giá cho mỗi CNOT ở xa bằng các SWAP, nên đẳng thức này trực tiếp làm tăng độ sâu.</p>
<p><strong>Tính toán cổ điển khả nghịch.</strong> Cổng lượng tử là unita, nên khả nghịch. Cổng AND thông thường không khả nghịch (đầu ra 0 không cho biết đầu vào). Cách sửa là <strong>cổng Toffoli</strong> (NOT điều khiển kép): |a, b, c⟩ → |a, b, c ⊕ (a AND b)⟩. Với c = 0, qubit thứ ba nhận a AND b trong khi a, b được giữ nguyên. Toffoli là nghịch đảo của chính nó, và Toffoli cùng các bit phụ (ancilla) mô phỏng được mọi mạch cổ điển (nó cho NOT khi a = b = 1, và cho FAN-OUT/sao chép bit cơ sở khi b = 1, c = 0). Vì vậy <strong>mọi thuật toán cổ điển đều chạy được trên máy lượng tử</strong> với chi phí tăng chỉ cỡ đa thức — các oracle ở Chương 8 được dựng đúng theo cách này.</p>
<p><strong>Tính phổ dụng.</strong> Một bộ cổng là <strong>phổ dụng</strong> nếu mạch dựng từ nó xấp xỉ được mọi ma trận unita với độ chính xác tuỳ ý. Hai sự thật chuẩn (Nielsen &amp; Chuang §4.5): (1) các cổng một qubit cùng CNOT là phổ dụng chính xác; (2) bộ hữu hạn <strong>{H, T, CNOT}</strong> là phổ dụng xấp xỉ. Riêng các <strong>cổng Clifford</strong> H, S, CNOT thì <em>không</em> đủ: theo định lý Gottesman–Knill, mạch Clifford trên đầu vào stabilizer mô phỏng hiệu quả được bằng máy cổ điển. Thêm đúng một cổng không-Clifford là T (với T<sup>2</sup> = S) ta có “Clifford + T”, bộ cổng của đa số kiến trúc chịu lỗi. <strong>Định lý Solovay–Kitaev</strong> bảo đảm rằng để xấp xỉ một cổng một qubit với sai số ε chỉ cần số cổng H và T tăng cỡ một luỹ thừa của log(1/ε) — nên dùng bộ cổng hữu hạn mất rất ít hiệu quả.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — HXH = Z bằng tay.</b> HX = (1/√2)(1, 1; −1, 1) (nhân phải với X là đổi chỗ hai cột của H). Rồi (HX)H = (1/2)(1·1 + 1·1, 1·1 + 1·(−1); −1·1 + 1·1, −1·1 + 1·(−1)) = (1/2)(2, 0; 0, −2) = <b>Z</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2 — CZ từ CNOT, thử trên trạng thái cơ sở.</b> Áp (I⊗H)CNOT<sub>01</sub>(I⊗H) lên |11⟩. Bước 1: I⊗H cho |1⟩|−⟩. Bước 2: điều khiển bằng 1 nên X tác động lên |−⟩: X|−⟩ = −|−⟩, được −|1⟩|−⟩. Bước 3: I⊗H đưa |−⟩ về |1⟩: <b>−|11⟩</b>. Với |00⟩, |01⟩, |10⟩ thì điều khiển bằng 0 hoặc đích không đổi nhờ H·H = I, nên chúng giữ nguyên. Đó chính là CZ.</p></div>
<div class="callout"><p><b>Ví dụ 3 — bảng chân trị Toffoli.</b> Với c = 0: |000⟩ → |000⟩, |010⟩ → |010⟩, |100⟩ → |100⟩, |110⟩ → <b>|111⟩</b>. Bit cuối là a AND b; a, b còn nguyên, nên ánh xạ là một hoán vị các trạng thái cơ sở — một ma trận unita.</p></div>
<pre><code class="language-python">import numpy as np
H = np.array([[1, 1], [1, -1]]) / np.sqrt(2)
X = np.array([[0, 1], [1, 0]]); Z = np.diag([1, -1]); I = np.eye(2)
T = np.diag([1, np.exp(1j * np.pi / 4)]); S = np.diag([1, 1j])
CNOT01 = np.array([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 0, 1], [0, 0, 1, 0]])
CNOT10 = np.array([[1, 0, 0, 0], [0, 0, 0, 1], [0, 0, 1, 0], [0, 1, 0, 0]])
CZ = np.diag([1, 1, 1, -1])
SWAP = np.array([[1, 0, 0, 0], [0, 0, 1, 0], [0, 1, 0, 0], [0, 0, 0, 1]])
HH, IH = np.kron(H, H), np.kron(I, H)
print("HXH = Z                 :", np.allclose(H @ X @ H, Z))
print("(H⊗H)CNOT01(H⊗H) = CNOT10:", np.allclose(HH @ CNOT01 @ HH, CNOT10))
print("(I⊗H)CNOT01(I⊗H) = CZ    :", np.allclose(IH @ CNOT01 @ IH, CZ))
print("CNOT01 CNOT10 CNOT01 = SWAP:", np.allclose(CNOT01 @ CNOT10 @ CNOT01, SWAP))
print("T·T = S, S·S = Z        :", np.allclose(T @ T, S), np.allclose(S @ S, Z))</code></pre>
<div class="out">HXH = Z                 : True
(H⊗H)CNOT01(H⊗H) = CNOT10: True
(I⊗H)CNOT01(I⊗H) = CZ    : True
CNOT01 CNOT10 CNOT01 = SWAP: True
T·T = S, S·S = Z        : True True</div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Nghĩ CNOT chỉ ảnh hưởng tới qubit đích. Trong cơ sở X thông tin chảy từ đích về điều khiển — đó là nền tảng của phase kickback (Chương 8).</li><li>Khẳng định “CNOT sao chép qubit”. Nó chỉ sao chép bit <em>cơ sở</em>; với |+⟩|0⟩ nó tạo ra trạng thái Bell vướng víu, không phải |+⟩|+⟩ (không nhân bản, Chương 5).</li><li>Tin rằng mạch Clifford cho tăng tốc lượng tử. Chúng mô phỏng cổ điển được; chính cổng không-Clifford T làm điện toán lượng tử khó mô phỏng.</li><li>Đọc SWAP = ba CNOT mà cả ba cùng chiều. CNOT ở giữa phải ngược chiều.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>HXH = Z, HZH = X; Hadamard trên cả hai qubit đảo chiều CNOT; chỉ trên đích thì biến CNOT thành CZ.</li><li>SWAP = CNOT<sub>01</sub>CNOT<sub>10</sub>CNOT<sub>01</sub> (tốn kém trên phần cứng ít kết nối).</li><li>Toffoli = AND khả nghịch ⇒ mọi phép tính cổ điển nhúng được vào mạch lượng tử.</li><li>Phổ dụng: {mọi cổng 1 qubit, CNOT} chính xác; {H, T, CNOT} xấp xỉ (Solovay–Kitaev giữ cho hiệu quả).</li><li>Riêng Clifford (H, S, CNOT) mô phỏng cổ điển được (Gottesman–Knill); T là thành phần thêm vào.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Toffoli_gate" target="_blank" rel="noopener">Wikipedia — Cổng Toffoli</a></li><li><a href="https://en.wikipedia.org/wiki/Clifford_gates" target="_blank" rel="noopener">Wikipedia — Cổng Clifford</a></li><li><a href="https://en.wikipedia.org/wiki/Gottesman%E2%80%93Knill_theorem" target="_blank" rel="noopener">Wikipedia — Định lý Gottesman–Knill</a></li><li><a href="https://github.com/Qiskit/documentation/blob/main/learning/courses/fundamentals-of-quantum-algorithms/quantum-algorithmic-foundations/simulating-classical-computations.ipynb" target="_blank" rel="noopener">IBM Quantum Learning (Watrous) — Mô phỏng phép tính cổ điển bằng mạch lượng tử (notebook gốc)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Kiểm HZH = X với đầu vào |0⟩ bằng cách lần trạng thái qua ba cổng.</li><li>Cổng Toffoli với đầu vào |1, 1, c⟩ tác động lên c thế nào? Đó là cổng cổ điển nào?</li><li>Một thiết bị chỉ cho phép CNOT<sub>01</sub> (không bao giờ CNOT<sub>10</sub>). Làm sao vẫn thực hiện được CNOT<sub>10</sub>, và tốn thêm bao nhiêu cổng một qubit?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) H|0⟩ = |+⟩; Z|+⟩ = |−⟩; H|−⟩ = |1⟩ = X|0⟩ ✓. 2) c → c ⊕ 1: một cổng <b>NOT</b> trên c. 3) Dùng (H⊗H)CNOT<sub>01</sub>(H⊗H) = CNOT<sub>10</sub>: thêm <b>bốn</b> cổng Hadamard (hai trước, hai sau).</p></div>`);

const q6 = QZ(6, 'Quiz — Chapter 6: Quantum circuits and simulation|||Quiz — Chương 6: Mạch lượng tử và mô phỏng', 'Kiểm tra chương 6: thứ tự nhân ma trận trong mạch, tích tensor cho cổng song song, độ sâu, mô phỏng vectơ trạng thái, chi phí bộ nhớ, đẳng thức mạch, Toffoli, bộ cổng phổ dụng.', [
  Q('q1', 'A circuit applies U1, then U2, then U3 (left to right). Its total matrix is|||Mạch áp U1, rồi U2, rồi U3 (trái sang phải). Ma trận tổng là',
    ['U1·U2·U3|||U1·U2·U3', 'U3·U2·U1|||U3·U2·U1', 'U1 ⊗ U2 ⊗ U3|||U1 ⊗ U2 ⊗ U3', 'U2·U1·U3|||U2·U1·U3'], 1,
    'The first gate in time is the rightmost factor: U3(U2(U1|ψ⟩)).|||Cổng đầu tiên theo thời gian là thừa số bên phải nhất: U3(U2(U1|ψ⟩)).'),
  Q('q2', 'Starting from |0⟩, the circuit “X then H” produces|||Bắt đầu từ |0⟩, mạch “X rồi H” cho ra',
    ['|+⟩||||+⟩', '|1⟩||||1⟩', '|−⟩||||−⟩', '|0⟩||||0⟩'], 2,
    'H·X|0⟩ = H|1⟩ = |−⟩.|||H·X|0⟩ = H|1⟩ = |−⟩.'),
  Q('q3', 'In a 2-qubit circuit (q0 on top), the matrix of “H on q0 only” is|||Trong mạch 2 qubit (q0 trên cùng), ma trận của “H chỉ trên q0” là',
    ['H|||H', 'I ⊗ H|||I ⊗ H', 'H ⊗ H|||H ⊗ H', 'H ⊗ I|||H ⊗ I'], 3,
    'Top wire = left tensor factor; idle wire contributes I.|||Dây trên = thừa số tensor bên trái; dây rảnh góp I.'),
  Q('q4', 'CNOT01·(H ⊗ I) applied to |10⟩ gives|||CNOT01·(H ⊗ I) áp lên |10⟩ cho',
    ['Φ⁺ = (|00⟩ + |11⟩)/√2|||Φ⁺ = (|00⟩ + |11⟩)/√2', 'Φ⁻ = (|00⟩ − |11⟩)/√2|||Φ⁻ = (|00⟩ − |11⟩)/√2', 'Ψ⁺ = (|01⟩ + |10⟩)/√2|||Ψ⁺ = (|01⟩ + |10⟩)/√2', '|11⟩||||11⟩'], 1,
    'H|1⟩ = |−⟩ gives (|00⟩ − |10⟩)/√2; CNOT turns |10⟩ into |11⟩.|||H|1⟩ = |−⟩ cho (|00⟩ − |10⟩)/√2; CNOT biến |10⟩ thành |11⟩.'),
  Q('q5', 'Gates: H on q0, H on q1, CNOT01, CNOT12 (3 qubits). The depth is|||Các cổng: H trên q0, H trên q1, CNOT01, CNOT12 (3 qubit). Độ sâu là',
    ['2|||2', '3|||3', '4|||4', '1|||1'], 1,
    'Both H in one layer; the two CNOTs share q1, so two more layers.|||Hai cổng H chung một lớp; hai CNOT dùng chung q1 nên thêm hai lớp.'),
  Q('q6', 'Memory for a 30-qubit complex128 state vector is about|||Bộ nhớ cho vectơ trạng thái 30 qubit kiểu complex128 khoảng',
    ['16 MiB|||16 MiB', '480 bytes|||480 byte', '16 GiB|||16 GiB', '16 TiB|||16 TiB'], 2,
    '2³⁰ × 16 bytes = 2³⁴ bytes = 16 GiB.|||2³⁰ × 16 byte = 2³⁴ byte = 16 GiB.'),
  Q('q7', 'Which identity is TRUE?|||Đẳng thức nào ĐÚNG?',
    ['(H⊗H)·CNOT01·(H⊗H) = CNOT10|||(H⊗H)·CNOT01·(H⊗H) = CNOT10', 'HXH = X|||HXH = X', 'CNOT01·CNOT01 = SWAP|||CNOT01·CNOT01 = SWAP', '(I⊗H)·CNOT01·(I⊗H) = CNOT10|||(I⊗H)·CNOT01·(I⊗H) = CNOT10'], 0,
    'Hadamards on both qubits reverse a CNOT. HXH = Z, CNOT² = I, and Hadamards on the target only give CZ.|||Hadamard trên cả hai qubit đảo chiều CNOT. HXH = Z, CNOT² = I, còn Hadamard chỉ trên đích cho CZ.'),
  Q('q8', 'SWAP can be built from|||SWAP dựng được từ',
    ['two CNOTs in the same direction|||hai CNOT cùng chiều', 'three CNOTs with alternating directions|||ba CNOT xen kẽ chiều', 'one CZ|||một CZ', 'two Hadamards|||hai Hadamard'], 1,
    'CNOT01·CNOT10·CNOT01 = SWAP.|||CNOT01·CNOT10·CNOT01 = SWAP.'),
  Q('q9', 'The Toffoli gate maps |1, 1, 0⟩ to|||Cổng Toffoli biến |1, 1, 0⟩ thành',
    ['|1, 1, 0⟩||||1, 1, 0⟩', '|0, 0, 1⟩||||0, 0, 1⟩', '|1, 1, 1⟩||||1, 1, 1⟩', '|0, 1, 1⟩||||0, 1, 1⟩'], 2,
    'c ⊕ (a AND b) = 0 ⊕ 1 = 1; a and b are kept.|||c ⊕ (a AND b) = 0 ⊕ 1 = 1; a và b giữ nguyên.'),
  Q('q10', 'Which gate set is (approximately) universal for quantum computation?|||Bộ cổng nào phổ dụng (xấp xỉ) cho điện toán lượng tử?',
    ['{H, S, CNOT}|||{H, S, CNOT}', '{X, Z}|||{X, Z}', '{CNOT, SWAP}|||{CNOT, SWAP}', '{H, T, CNOT}|||{H, T, CNOT}'], 3,
    'Clifford gates alone are classically simulable (Gottesman–Knill); adding T makes the set universal.|||Riêng cổng Clifford mô phỏng cổ điển được (Gottesman–Knill); thêm T thì bộ cổng phổ dụng.'),
]);

const ch6 = {
  title: 'Chapter 6 — Quantum circuits and simulation|||Chương 6 — Mạch lượng tử và mô phỏng',
  description: 'Mô hình mạch (thứ tự nhân ma trận, tích tensor, độ rộng/độ sâu), tự viết trình mô phỏng vectơ trạng thái bằng numpy (GHZ, lượt đo, chi phí bộ nhớ), đẳng thức mạch, Toffoli và bộ cổng phổ dụng (Nielsen & Chuang 4.2–4.5 · Watrous Lesson 3, 6).',
  lessons: [c61, c62, c63, q6],
};

// ───────────────────────────── Chương 7 — Giao thức: mã hoá siêu đặc, dịch chuyển lượng tử, BB84 ─────────────────────────────
const c71 = L('qtc211-ts-7-1',
  '7.1 — Bell measurement and superdense coding: two classical bits in one qubit|||7.1 — Đo Bell và mã hoá siêu đặc: hai bit cổ điển trong một qubit',
  'Đo trong cơ sở Bell bằng CNOT rồi H rồi đo; mã hoá siêu đặc: chia sẻ Φ⁺, Alice áp I/X/Z/ZX lên qubit của mình, gửi một qubit, Bob giải ra hai bit; vì sao không trái giới hạn Holevo.',
  `<span class="eyebrow">QTC211 · Chapter 7 · Lesson 7.1</span>
<h2>Bell measurement and superdense coding</h2>
<p class="lead">A single qubit, sent on its own, can never carry more than one classical bit of information (this is Holevo's theorem). Yet if sender and receiver already share an entangled pair, one transmitted qubit carries <strong>two</strong> bits. This is <strong>superdense coding</strong> (Bennett &amp; Wiesner, 1992), the simplest protocol that uses entanglement as a resource.</p>
<h3>🎯 Objectives</h3>
<ul><li>Perform a Bell-basis measurement with CNOT, H and a computational-basis measurement.</li><li>Show that the four Pauli operations I, X, Z, ZX on one half of Φ<sup>+</sup> produce the four Bell states.</li><li>Trace the superdense coding protocol and explain what resources it really uses.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>The Bell basis.</strong> The four Bell states Φ<sup>±</sup> = (|00⟩ ± |11⟩)/√2 and Ψ<sup>±</sup> = (|01⟩ ± |10⟩)/√2 are orthonormal, so they form a basis of the two-qubit space. In Lesson 6.1 we saw that the circuit U = CNOT<sub>01</sub>(H ⊗ I) maps |00⟩, |01⟩, |10⟩, |11⟩ to Φ<sup>+</sup>, Ψ<sup>+</sup>, Φ<sup>−</sup>, Ψ<sup>−</sup>. Running it <strong>backwards</strong> — U<sup>†</sup> = (H ⊗ I)CNOT<sub>01</sub>, i.e. CNOT<sub>01</sub> first, then H on q0 — maps each Bell state back to a computational basis state. So a <strong>Bell measurement</strong> is: CNOT<sub>01</sub>, then H on q0, then measure both qubits.</p>
<div class="formula"><span class="lbl">Bell measurement</span>Φ<sup>+</sup> → 00    Ψ<sup>+</sup> → 01    Φ<sup>−</sup> → 10    Ψ<sup>−</sup> → 11</div>
<p><strong>Local operations change the Bell state.</strong> A gate applied to <em>only one</em> qubit of Φ<sup>+</sup> can turn it into any other Bell state: (X ⊗ I)Φ<sup>+</sup> = (|10⟩ + |01⟩)/√2 = Ψ<sup>+</sup>, (Z ⊗ I)Φ<sup>+</sup> = Φ<sup>−</sup>, and (ZX ⊗ I)Φ<sup>+</sup> = (|01⟩ − |10⟩)/√2 = Ψ<sup>−</sup> (here ZX means “X first, then Z”).</p>
<p><strong>The protocol.</strong></p>
<ol><li><strong>Setup:</strong> a source prepares Φ<sup>+</sup>; Alice keeps q0, Bob keeps q1. This can happen long before any message exists.</li><li><strong>Encode:</strong> to send bits b<sub>1</sub>b<sub>2</sub>, Alice applies X<sup>b<sub>2</sub></sup> and then Z<sup>b<sub>1</sub></sup> to her qubit: 00 → I, 01 → X, 10 → Z, 11 → ZX.</li><li><strong>Send:</strong> Alice sends her <em>one</em> qubit to Bob.</li><li><strong>Decode:</strong> Bob, now holding both qubits, does a Bell measurement and reads b<sub>1</sub>b<sub>2</sub> with certainty.</li></ol>
<p><strong>Accounting.</strong> Two qubits were transmitted in total (one during setup, one carrying the message) for two bits, so Holevo's bound is respected. The point is that the setup qubit can be sent in advance, at a quiet time; at message time only one qubit travels. And an eavesdropper who intercepts Alice's qubit alone learns nothing: its reduced state is maximally mixed whatever Alice did.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — message 01.</b> Alice applies X: (X ⊗ I)(|00⟩ + |11⟩)/√2 = (|10⟩ + |01⟩)/√2 = Ψ<sup>+</sup>. Bob: CNOT<sub>01</sub> gives (|11⟩ + |01⟩)/√2 = (|0⟩ + |1⟩)|1⟩/√2 = |+⟩|1⟩; H on q0 gives <b>|01⟩</b>. Bob reads 01 ✓.</p></div>
<div class="callout"><p><b>Example 2 — message 11.</b> Alice applies X then Z. X gives Ψ<sup>+</sup> = (|01⟩ + |10⟩)/√2; Z on q0 multiplies the term with q0 = 1 by −1: (|01⟩ − |10⟩)/√2 = Ψ<sup>−</sup>. Bob: CNOT<sub>01</sub> gives (|01⟩ − |11⟩)/√2 = |−⟩|1⟩; H gives <b>|11⟩</b> ✓.</p></div>
<pre><code class="language-python">import numpy as np
H = np.array([[1, 1], [1, -1]]) / np.sqrt(2)
X = np.array([[0, 1], [1, 0]]); Z = np.diag([1, -1]); I = np.eye(2)
CNOT01 = np.array([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 0, 1], [0, 0, 1, 0]])
phi_plus = np.array([1, 0, 0, 1]) / np.sqrt(2)          # q0 = Alice, q1 = Bob
encode = {"00": I, "01": X, "10": Z, "11": Z @ X}         # Z @ X = "X first, then Z"
for bits, A in encode.items():
    sent = np.kron(A, I) @ phi_plus                       # Alice acts on her qubit only
    decoded = np.kron(H, I) @ CNOT01 @ sent               # Bob: CNOT q0-&gt;q1, then H on q0
    p = np.abs(decoded) ** 2
    print(bits, "-&gt;", np.round(sent * np.sqrt(2), 3), "Bob reads", format(int(np.argmax(p)), "02b"), "with prob", round(float(p.max()), 3))</code></pre>
<div class="out">00 -&gt; [1. 0. 0. 1.] Bob reads 00 with prob 1.0
01 -&gt; [0. 1. 1. 0.] Bob reads 01 with prob 1.0
10 -&gt; [ 1.  0.  0. -1.] Bob reads 10 with prob 1.0
11 -&gt; [ 0.  1. -1.  0.] Bob reads 11 with prob 1.0</div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Saying superdense coding “beats” Holevo's bound. It does not: it uses a pre-shared qubit, so 2 qubits deliver 2 bits.</li><li>Doing Bob's steps in the wrong order (H before CNOT). The decoding circuit is the <em>inverse</em> of the preparation circuit, so the order reverses.</li><li>Mixing up ZX and XZ. They differ only by a sign (XZ = −ZX), a global phase that Bob cannot see — but the mapping table must be stated consistently.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Bell measurement = CNOT<sub>01</sub>, H on q0, measure: Φ<sup>+</sup>, Ψ<sup>+</sup>, Φ<sup>−</sup>, Ψ<sup>−</sup> → 00, 01, 10, 11.</li><li>A local Pauli on one half of Φ<sup>+</sup> selects any of the four Bell states.</li><li>Superdense coding: share Φ<sup>+</sup>, Alice applies Z<sup>b<sub>1</sub></sup>X<sup>b<sub>2</sub></sup>, sends one qubit, Bob Bell-measures ⇒ 2 bits.</li><li>Entanglement is a resource that can be distributed in advance.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://github.com/Qiskit/documentation/blob/main/learning/courses/basics-of-quantum-information/entanglement-in-action/superdense-coding.ipynb" target="_blank" rel="noopener">IBM Quantum Learning (Watrous) — Entanglement in action: superdense coding (source notebook)</a></li><li><a href="https://www.youtube.com/watch?v=GSsElSQgMbU" target="_blank" rel="noopener">Qiskit — Understanding Quantum Information &amp; Computation, Lesson 04: Entanglement in Action</a></li><li><a href="https://en.wikipedia.org/wiki/Superdense_coding" target="_blank" rel="noopener">Wikipedia — Superdense coding</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Bob receives the state Ψ<sup>+</sup> and performs a Bell measurement. Which two bits does he read?</li><li>Alice, by mistake, applies Y = iXZ instead of one of the four agreed gates. What does Bob read?</li><li>Without any shared entanglement, how many classical bits can Alice reliably send with one qubit?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) <b>01</b>. 2) (Y ⊗ I)Φ<sup>+</sup> = −i(|01⟩ − |10⟩)/√2 = −iΨ<sup>−</sup>, which is Ψ<sup>−</sup> up to a global phase, so Bob reads <b>11</b> (Y is the “11” gate up to phase). 3) <b>One</b> bit (Holevo's theorem).</p></div>`,
  `<span class="eyebrow">QTC211 · Chương 7 · Bài 7.1</span>
<h2>Đo Bell và mã hoá siêu đặc</h2>
<p class="lead">Một qubit gửi đi một mình không bao giờ mang được quá một bit thông tin cổ điển (định lý Holevo). Thế nhưng nếu người gửi và người nhận đã chia sẻ sẵn một cặp vướng víu, một qubit gửi đi mang được <strong>hai</strong> bit. Đó là <strong>mã hoá siêu đặc (superdense coding)</strong> (Bennett &amp; Wiesner, 1992), giao thức đơn giản nhất dùng vướng víu như một tài nguyên.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Thực hiện phép đo trong cơ sở Bell bằng CNOT, H và phép đo cơ sở tính toán.</li><li>Chứng tỏ bốn phép Pauli I, X, Z, ZX trên một nửa của Φ<sup>+</sup> tạo ra bốn trạng thái Bell.</li><li>Lần từng bước giao thức mã hoá siêu đặc và giải thích nó thực sự tốn tài nguyên gì.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Cơ sở Bell.</strong> Bốn trạng thái Bell Φ<sup>±</sup> = (|00⟩ ± |11⟩)/√2 và Ψ<sup>±</sup> = (|01⟩ ± |10⟩)/√2 trực chuẩn, nên lập thành một cơ sở của không gian hai qubit. Ở Bài 6.1 ta đã thấy mạch U = CNOT<sub>01</sub>(H ⊗ I) biến |00⟩, |01⟩, |10⟩, |11⟩ thành Φ<sup>+</sup>, Ψ<sup>+</sup>, Φ<sup>−</sup>, Ψ<sup>−</sup>. Chạy nó <strong>ngược lại</strong> — U<sup>†</sup> = (H ⊗ I)CNOT<sub>01</sub>, tức CNOT<sub>01</sub> trước, rồi H trên q0 — đưa mỗi trạng thái Bell về một trạng thái cơ sở tính toán. Vậy <strong>phép đo Bell</strong> là: CNOT<sub>01</sub>, rồi H trên q0, rồi đo cả hai qubit.</p>
<div class="formula"><span class="lbl">Phép đo Bell</span>Φ<sup>+</sup> → 00    Ψ<sup>+</sup> → 01    Φ<sup>−</sup> → 10    Ψ<sup>−</sup> → 11</div>
<p><strong>Thao tác cục bộ đổi trạng thái Bell.</strong> Một cổng áp lên <em>chỉ một</em> qubit của Φ<sup>+</sup> biến được nó thành bất kỳ trạng thái Bell nào khác: (X ⊗ I)Φ<sup>+</sup> = (|10⟩ + |01⟩)/√2 = Ψ<sup>+</sup>, (Z ⊗ I)Φ<sup>+</sup> = Φ<sup>−</sup>, và (ZX ⊗ I)Φ<sup>+</sup> = (|01⟩ − |10⟩)/√2 = Ψ<sup>−</sup> (ZX nghĩa là “X trước, rồi Z”).</p>
<p><strong>Giao thức.</strong></p>
<ol><li><strong>Chuẩn bị:</strong> một nguồn tạo Φ<sup>+</sup>; Alice giữ q0, Bob giữ q1. Việc này có thể làm từ rất lâu trước khi có tin nhắn.</li><li><strong>Mã hoá:</strong> để gửi hai bit b<sub>1</sub>b<sub>2</sub>, Alice áp X<sup>b<sub>2</sub></sup> rồi Z<sup>b<sub>1</sub></sup> lên qubit của mình: 00 → I, 01 → X, 10 → Z, 11 → ZX.</li><li><strong>Gửi:</strong> Alice gửi <em>một</em> qubit của mình cho Bob.</li><li><strong>Giải mã:</strong> Bob, giờ giữ cả hai qubit, đo Bell và đọc chắc chắn ra b<sub>1</sub>b<sub>2</sub>.</li></ol>
<p><strong>Tính sổ.</strong> Tổng cộng có hai qubit được truyền (một lúc chuẩn bị, một mang tin) cho hai bit, nên giới hạn Holevo vẫn được tôn trọng. Điểm hay là qubit chuẩn bị có thể gửi trước, lúc kênh rảnh; đến lúc gửi tin chỉ một qubit phải đi. Và kẻ nghe lén chặn được riêng qubit của Alice không biết gì: trạng thái rút gọn của nó là hỗn hợp cực đại, bất kể Alice đã làm gì.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — tin nhắn 01.</b> Alice áp X: (X ⊗ I)(|00⟩ + |11⟩)/√2 = (|10⟩ + |01⟩)/√2 = Ψ<sup>+</sup>. Bob: CNOT<sub>01</sub> cho (|11⟩ + |01⟩)/√2 = (|0⟩ + |1⟩)|1⟩/√2 = |+⟩|1⟩; H trên q0 cho <b>|01⟩</b>. Bob đọc 01 ✓.</p></div>
<div class="callout"><p><b>Ví dụ 2 — tin nhắn 11.</b> Alice áp X rồi Z. X cho Ψ<sup>+</sup> = (|01⟩ + |10⟩)/√2; Z trên q0 nhân số hạng có q0 = 1 với −1: (|01⟩ − |10⟩)/√2 = Ψ<sup>−</sup>. Bob: CNOT<sub>01</sub> cho (|01⟩ − |11⟩)/√2 = |−⟩|1⟩; H cho <b>|11⟩</b> ✓.</p></div>
<pre><code class="language-python">import numpy as np
H = np.array([[1, 1], [1, -1]]) / np.sqrt(2)
X = np.array([[0, 1], [1, 0]]); Z = np.diag([1, -1]); I = np.eye(2)
CNOT01 = np.array([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 0, 1], [0, 0, 1, 0]])
phi_plus = np.array([1, 0, 0, 1]) / np.sqrt(2)          # q0 = Alice, q1 = Bob
encode = {"00": I, "01": X, "10": Z, "11": Z @ X}         # Z @ X = "X first, then Z"
for bits, A in encode.items():
    sent = np.kron(A, I) @ phi_plus                       # Alice acts on her qubit only
    decoded = np.kron(H, I) @ CNOT01 @ sent               # Bob: CNOT q0-&gt;q1, then H on q0
    p = np.abs(decoded) ** 2
    print(bits, "-&gt;", np.round(sent * np.sqrt(2), 3), "Bob reads", format(int(np.argmax(p)), "02b"), "with prob", round(float(p.max()), 3))</code></pre>
<div class="out">00 -&gt; [1. 0. 0. 1.] Bob reads 00 with prob 1.0
01 -&gt; [0. 1. 1. 0.] Bob reads 01 with prob 1.0
10 -&gt; [ 1.  0.  0. -1.] Bob reads 10 with prob 1.0
11 -&gt; [ 0.  1. -1.  0.] Bob reads 11 with prob 1.0</div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Nói mã hoá siêu đặc “phá” giới hạn Holevo. Không: nó dùng một qubit chia sẻ trước, nên 2 qubit mang 2 bit.</li><li>Làm các bước của Bob sai thứ tự (H trước CNOT). Mạch giải mã là <em>nghịch đảo</em> của mạch chuẩn bị nên thứ tự đảo ngược.</li><li>Lẫn ZX với XZ. Chúng chỉ khác nhau một dấu (XZ = −ZX), một pha toàn cục Bob không thấy được — nhưng bảng mã hoá phải được phát biểu nhất quán.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Đo Bell = CNOT<sub>01</sub>, H trên q0, đo: Φ<sup>+</sup>, Ψ<sup>+</sup>, Φ<sup>−</sup>, Ψ<sup>−</sup> → 00, 01, 10, 11.</li><li>Một phép Pauli cục bộ trên một nửa của Φ<sup>+</sup> chọn được bất kỳ trạng thái nào trong bốn trạng thái Bell.</li><li>Mã hoá siêu đặc: chia sẻ Φ<sup>+</sup>, Alice áp Z<sup>b<sub>1</sub></sup>X<sup>b<sub>2</sub></sup>, gửi một qubit, Bob đo Bell ⇒ 2 bit.</li><li>Vướng víu là tài nguyên có thể phân phát trước.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://github.com/Qiskit/documentation/blob/main/learning/courses/basics-of-quantum-information/entanglement-in-action/superdense-coding.ipynb" target="_blank" rel="noopener">IBM Quantum Learning (Watrous) — Vướng víu trong thực tế: mã hoá siêu đặc (notebook gốc)</a></li><li><a href="https://www.youtube.com/watch?v=GSsElSQgMbU" target="_blank" rel="noopener">Qiskit — Understanding Quantum Information &amp; Computation, Lesson 04: Entanglement in Action</a></li><li><a href="https://en.wikipedia.org/wiki/Superdense_coding" target="_blank" rel="noopener">Wikipedia — Mã hoá siêu đặc</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Bob nhận trạng thái Ψ<sup>+</sup> và đo Bell. Bob đọc ra hai bit nào?</li><li>Alice lỡ tay áp Y = iXZ thay vì một trong bốn cổng đã thống nhất. Bob đọc ra gì?</li><li>Không có vướng víu chia sẻ trước, Alice gửi tin cậy được bao nhiêu bit cổ điển bằng một qubit?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) <b>01</b>. 2) (Y ⊗ I)Φ<sup>+</sup> = −i(|01⟩ − |10⟩)/√2 = −iΨ<sup>−</sup>, tức Ψ<sup>−</sup> sai khác một pha toàn cục, nên Bob đọc <b>11</b> (Y chính là cổng “11” sai khác pha). 3) <b>Một</b> bit (định lý Holevo).</p></div>`);

const c72 = L('qtc211-ts-7-2',
  '7.2 — Quantum teleportation step by step|||7.2 — Dịch chuyển lượng tử từng bước',
  'Dịch chuyển trạng thái chưa biết α|0⟩ + β|1⟩ bằng một cặp Φ⁺ và hai bit cổ điển: đại số đầy đủ bốn nhánh, hiệu chỉnh X^m2 rồi Z^m1, mô phỏng numpy với trạng thái ngẫu nhiên (độ trung thực 1), vì sao không nhanh hơn ánh sáng và không nhân bản.',
  `<span class="eyebrow">QTC211 · Chapter 7 · Lesson 7.2</span>
<h2>Quantum teleportation step by step</h2>
<p class="lead">Superdense coding sends two classical bits using one qubit plus entanglement. <strong>Teleportation</strong> (Bennett et al., 1993) is its mirror image: it sends one <em>unknown qubit state</em> using two classical bits plus entanglement. Nothing physical flies from Alice to Bob except two ordinary bits — and yet Bob ends up holding exactly α|0⟩ + β|1⟩.</p>
<h3>🎯 Objectives</h3>
<ul><li>Write the three-qubit state of the protocol and regroup it by Alice's measurement outcomes.</li><li>Derive Bob's four possible states and the corrections X<sup>m<sub>2</sub></sup>, Z<sup>m<sub>1</sub></sup>.</li><li>Verify the protocol in numpy on a random state.</li><li>Explain why teleportation neither copies the state nor sends information faster than light.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>Setup.</strong> q0 holds the message |ψ⟩ = α|0⟩ + β|1⟩, which Alice does <em>not</em> know (measuring it would destroy it). q1 (Alice) and q2 (Bob) share Φ<sup>+</sup>. The total state is |ψ⟩ ⊗ Φ<sup>+</sup>.</p>
<p><strong>Alice's circuit</strong> is exactly the Bell measurement of Lesson 7.1 on q0, q1: CNOT<sub>01</sub>, then H on q0, then measure q0 → m<sub>1</sub> and q1 → m<sub>2</sub>. She sends the two bits m<sub>1</sub>m<sub>2</sub> to Bob over a classical channel. <strong>Bob</strong> applies X<sup>m<sub>2</sub></sup> and then Z<sup>m<sub>1</sub></sup> to q2.</p>
<p><strong>The algebra.</strong> Expanding:</p>
<div class="formula"><span class="lbl">Step 0</span>|ψ⟩Φ<sup>+</sup> = (1/√2)[ α|0⟩(|00⟩ + |11⟩) + β|1⟩(|00⟩ + |11⟩) ]</div>
<div class="formula"><span class="lbl">Step 1 · CNOT₀₁</span>(1/√2)[ α|0⟩(|00⟩ + |11⟩) + β|1⟩(|10⟩ + |01⟩) ]</div>
<div class="formula"><span class="lbl">Step 2 · H on q0</span>(1/2)[ α(|0⟩ + |1⟩)(|00⟩ + |11⟩) + β(|0⟩ − |1⟩)(|10⟩ + |01⟩) ]</div>
<p>Now collect the terms by the value of Alice's two qubits q0q1, keeping Bob's qubit q2 on the right:</p>
<div class="formula"><span class="lbl">Regrouped</span>(1/2)[ |00⟩(α|0⟩ + β|1⟩) + |01⟩(α|1⟩ + β|0⟩) + |10⟩(α|0⟩ − β|1⟩) + |11⟩(α|1⟩ − β|0⟩) ]</div>
<p>Each of the four outcomes has probability (1/2)<sup>2</sup>(|α|<sup>2</sup> + |β|<sup>2</sup>) = <strong>1/4</strong>, independent of |ψ⟩. Bob's state in each branch is |ψ⟩ with a Pauli error: 00 → |ψ⟩, 01 → X|ψ⟩, 10 → Z|ψ⟩, 11 → XZ|ψ⟩. In general Bob holds X<sup>m<sub>2</sub></sup>Z<sup>m<sub>1</sub></sup>|ψ⟩, so applying X<sup>m<sub>2</sub></sup> then Z<sup>m<sub>1</sub></sup> gives Z<sup>m<sub>1</sub></sup>X<sup>m<sub>2</sub></sup>X<sup>m<sub>2</sub></sup>Z<sup>m<sub>1</sub></sup>|ψ⟩ = |ψ⟩ in all four cases.</p>
<p><strong>What it does not do.</strong> (1) <em>No cloning:</em> Alice's measurement leaves q0 in |m<sub>1</sub>⟩, so the original is destroyed — only one copy of |ψ⟩ exists at any time. (2) <em>No faster-than-light signalling:</em> before the two bits arrive, Bob's qubit is in each of the four states with probability 1/4, an equal mixture that is the same for every |ψ⟩ — he learns nothing until the classical message, which travels at most at light speed, arrives. (3) Alice never learns α and β.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — outcome 11.</b> Bob holds α|1⟩ − β|0⟩. Apply X (m<sub>2</sub> = 1): α|0⟩ − β|1⟩. Apply Z (m<sub>1</sub> = 1): α|0⟩ + β|1⟩ = |ψ⟩ ✓.</p></div>
<div class="callout"><p><b>Example 2 — teleporting |1⟩.</b> α = 0, β = 1. Regrouped state: (1/2)[|00⟩|1⟩ + |01⟩|0⟩ − |10⟩|1⟩ − |11⟩|0⟩]. If Alice gets 01, Bob holds |0⟩ and applies X ⇒ |1⟩ ✓. If she gets 10, Bob holds −|1⟩ — the same state up to a global phase — and Z gives |1⟩ ✓.</p></div>
<pre><code class="language-python">import numpy as np
H = np.array([[1, 1], [1, -1]]) / np.sqrt(2)
X = np.array([[0, 1], [1, 0]]); Z = np.diag([1, -1]); I = np.eye(2)
CNOT01 = np.array([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 0, 1], [0, 0, 1, 0]])
rng = np.random.default_rng(seed=2026)
psi = rng.normal(size=2) + 1j * rng.normal(size=2); psi /= np.linalg.norm(psi)   # unknown state
phi_plus = np.array([1, 0, 0, 1]) / np.sqrt(2)                                    # q1 (Alice), q2 (Bob)
state = np.kron(psi, phi_plus)                                                    # q0 q1 q2
state = np.kron(CNOT01, I) @ state                                                # CNOT q0 -&gt; q1
state = np.kron(np.kron(H, I), I) @ state                                         # H on q0
amps = state.reshape(2, 2, 2)                                                     # axes: m1, m2, Bob
for m1 in (0, 1):
    for m2 in (0, 1):
        bob = amps[m1, m2, :]
        prob = np.linalg.norm(bob) ** 2
        bob = bob / np.linalg.norm(bob)
        fixed = np.linalg.matrix_power(Z, m1) @ np.linalg.matrix_power(X, m2) @ bob   # X^m2 first, then Z^m1
        fidelity = abs(np.vdot(psi, fixed)) ** 2
        print(f"m1m2={m1}{m2}  P={prob:.3f}  fidelity={fidelity:.6f}")</code></pre>
<div class="out">m1m2=00  P=0.250  fidelity=1.000000
m1m2=01  P=0.250  fidelity=1.000000
m1m2=10  P=0.250  fidelity=1.000000
m1m2=11  P=0.250  fidelity=1.000000</div>
<p>The <strong>fidelity</strong> |⟨ψ|Bob⟩|<sup>2</sup> equals 1 exactly when Bob's state equals |ψ⟩ up to a global phase. We also checked the regrouped formula symbolically with sympy: after the H gate the eight amplitudes (×2) are α, β, β, α, α, −β, −β, α for |000⟩ … |111⟩.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Applying the corrections in the wrong order or swapping m<sub>1</sub> and m<sub>2</sub>. The X correction is controlled by the measurement of q1 (the entangled half), the Z correction by q0 (the message qubit after H).</li><li>Thinking teleportation moves matter or energy. Only quantum <em>information</em> is transferred, and it needs a pre-shared Bell pair plus a classical channel.</li><li>Concluding that Bob gets |ψ⟩ instantly. Until the two bits arrive his qubit is a uniform mixture carrying no information about |ψ⟩.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Resources: one Bell pair + two classical bits ⇒ one qubit state transferred.</li><li>Alice: CNOT<sub>01</sub>, H on q0, measure q0 → m<sub>1</sub>, q1 → m<sub>2</sub>.</li><li>Bob holds X<sup>m<sub>2</sub></sup>Z<sup>m<sub>1</sub></sup>|ψ⟩; he applies X<sup>m<sub>2</sub></sup> then Z<sup>m<sub>1</sub></sup>.</li><li>Each outcome has probability 1/4; the original is destroyed (no cloning) and nothing travels faster than light.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://quantum.country/teleportation" target="_blank" rel="noopener">Matuschak &amp; Nielsen — How quantum teleportation works (quantum.country)</a></li><li><a href="https://github.com/Qiskit/documentation/blob/main/learning/courses/basics-of-quantum-information/entanglement-in-action/quantum-teleportation.ipynb" target="_blank" rel="noopener">IBM Quantum Learning (Watrous) — Entanglement in action: quantum teleportation (source notebook)</a></li><li><a href="https://en.wikipedia.org/wiki/Quantum_teleportation" target="_blank" rel="noopener">Wikipedia — Quantum teleportation</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Alice obtains m<sub>1</sub>m<sub>2</sub> = 10. Which state does Bob hold, and which gate does he apply?</li><li>Why does the fact that every outcome has probability 1/4, whatever α and β are, matter for the no-signalling argument?</li><li>Teleport |+⟩ = (|0⟩ + |1⟩)/√2. What does Bob hold before correction in the branch 11?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) α|0⟩ − β|1⟩ = Z|ψ⟩; he applies <b>Z</b>. 2) Alice's outcomes are uniformly random and reveal nothing about |ψ⟩; and averaged over them Bob's qubit is the same mixture for every |ψ⟩, so neither party gains information before the classical bits are exchanged. 3) α|1⟩ − β|0⟩ with α = β = 1/√2: (|1⟩ − |0⟩)/√2 = <b>−|−⟩</b>; X then Z turns it back into |+⟩.</p></div>`,
  `<span class="eyebrow">QTC211 · Chương 7 · Bài 7.2</span>
<h2>Dịch chuyển lượng tử từng bước</h2>
<p class="lead">Mã hoá siêu đặc gửi hai bit cổ điển bằng một qubit cộng vướng víu. <strong>Dịch chuyển lượng tử (teleportation)</strong> (Bennett và cộng sự, 1993) là hình ảnh soi gương của nó: gửi một <em>trạng thái qubit chưa biết</em> bằng hai bit cổ điển cộng vướng víu. Không có gì vật chất bay từ Alice sang Bob ngoài hai bit bình thường — vậy mà cuối cùng Bob giữ đúng α|0⟩ + β|1⟩.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Viết trạng thái ba qubit của giao thức và nhóm lại theo kết quả đo của Alice.</li><li>Suy ra bốn trạng thái có thể của Bob và các hiệu chỉnh X<sup>m<sub>2</sub></sup>, Z<sup>m<sub>1</sub></sup>.</li><li>Kiểm giao thức bằng numpy trên một trạng thái ngẫu nhiên.</li><li>Giải thích vì sao dịch chuyển không sao chép trạng thái và không gửi thông tin nhanh hơn ánh sáng.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Chuẩn bị.</strong> q0 giữ tin nhắn |ψ⟩ = α|0⟩ + β|1⟩, mà Alice <em>không</em> biết (đo nó là phá huỷ nó). q1 (Alice) và q2 (Bob) chia sẻ Φ<sup>+</sup>. Trạng thái tổng là |ψ⟩ ⊗ Φ<sup>+</sup>.</p>
<p><strong>Mạch của Alice</strong> chính là phép đo Bell của Bài 7.1 trên q0, q1: CNOT<sub>01</sub>, rồi H trên q0, rồi đo q0 → m<sub>1</sub> và q1 → m<sub>2</sub>. Cô gửi hai bit m<sub>1</sub>m<sub>2</sub> cho Bob qua kênh cổ điển. <strong>Bob</strong> áp X<sup>m<sub>2</sub></sup> rồi Z<sup>m<sub>1</sub></sup> lên q2.</p>
<p><strong>Đại số.</strong> Khai triển:</p>
<div class="formula"><span class="lbl">Bước 0</span>|ψ⟩Φ<sup>+</sup> = (1/√2)[ α|0⟩(|00⟩ + |11⟩) + β|1⟩(|00⟩ + |11⟩) ]</div>
<div class="formula"><span class="lbl">Bước 1 · CNOT₀₁</span>(1/√2)[ α|0⟩(|00⟩ + |11⟩) + β|1⟩(|10⟩ + |01⟩) ]</div>
<div class="formula"><span class="lbl">Bước 2 · H trên q0</span>(1/2)[ α(|0⟩ + |1⟩)(|00⟩ + |11⟩) + β(|0⟩ − |1⟩)(|10⟩ + |01⟩) ]</div>
<p>Giờ gom các số hạng theo giá trị hai qubit của Alice q0q1, giữ qubit q2 của Bob bên phải:</p>
<div class="formula"><span class="lbl">Sau khi nhóm</span>(1/2)[ |00⟩(α|0⟩ + β|1⟩) + |01⟩(α|1⟩ + β|0⟩) + |10⟩(α|0⟩ − β|1⟩) + |11⟩(α|1⟩ − β|0⟩) ]</div>
<p>Mỗi kết quả trong bốn kết quả có xác suất (1/2)<sup>2</sup>(|α|<sup>2</sup> + |β|<sup>2</sup>) = <strong>1/4</strong>, không phụ thuộc |ψ⟩. Trạng thái của Bob ở mỗi nhánh là |ψ⟩ kèm một lỗi Pauli: 00 → |ψ⟩, 01 → X|ψ⟩, 10 → Z|ψ⟩, 11 → XZ|ψ⟩. Tổng quát Bob giữ X<sup>m<sub>2</sub></sup>Z<sup>m<sub>1</sub></sup>|ψ⟩, nên áp X<sup>m<sub>2</sub></sup> rồi Z<sup>m<sub>1</sub></sup> cho Z<sup>m<sub>1</sub></sup>X<sup>m<sub>2</sub></sup>X<sup>m<sub>2</sub></sup>Z<sup>m<sub>1</sub></sup>|ψ⟩ = |ψ⟩ trong cả bốn trường hợp.</p>
<p><strong>Điều nó KHÔNG làm.</strong> (1) <em>Không nhân bản:</em> phép đo của Alice để q0 ở |m<sub>1</sub>⟩, nên bản gốc bị phá huỷ — lúc nào cũng chỉ có một bản |ψ⟩. (2) <em>Không truyền tin nhanh hơn ánh sáng:</em> trước khi hai bit tới, qubit của Bob ở mỗi trạng thái trong bốn trạng thái với xác suất 1/4, một hỗn hợp đều như nhau với mọi |ψ⟩ — Bob không biết gì cho tới khi tin cổ điển, đi nhanh nhất bằng tốc độ ánh sáng, tới nơi. (3) Alice không bao giờ biết α và β.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — kết quả 11.</b> Bob giữ α|1⟩ − β|0⟩. Áp X (m<sub>2</sub> = 1): α|0⟩ − β|1⟩. Áp Z (m<sub>1</sub> = 1): α|0⟩ + β|1⟩ = |ψ⟩ ✓.</p></div>
<div class="callout"><p><b>Ví dụ 2 — dịch chuyển |1⟩.</b> α = 0, β = 1. Trạng thái sau khi nhóm: (1/2)[|00⟩|1⟩ + |01⟩|0⟩ − |10⟩|1⟩ − |11⟩|0⟩]. Nếu Alice được 01, Bob giữ |0⟩ và áp X ⇒ |1⟩ ✓. Nếu cô được 10, Bob giữ −|1⟩ — cùng trạng thái sai khác pha toàn cục — và Z cho |1⟩ ✓.</p></div>
<pre><code class="language-python">import numpy as np
H = np.array([[1, 1], [1, -1]]) / np.sqrt(2)
X = np.array([[0, 1], [1, 0]]); Z = np.diag([1, -1]); I = np.eye(2)
CNOT01 = np.array([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 0, 1], [0, 0, 1, 0]])
rng = np.random.default_rng(seed=2026)
psi = rng.normal(size=2) + 1j * rng.normal(size=2); psi /= np.linalg.norm(psi)   # unknown state
phi_plus = np.array([1, 0, 0, 1]) / np.sqrt(2)                                    # q1 (Alice), q2 (Bob)
state = np.kron(psi, phi_plus)                                                    # q0 q1 q2
state = np.kron(CNOT01, I) @ state                                                # CNOT q0 -&gt; q1
state = np.kron(np.kron(H, I), I) @ state                                         # H on q0
amps = state.reshape(2, 2, 2)                                                     # axes: m1, m2, Bob
for m1 in (0, 1):
    for m2 in (0, 1):
        bob = amps[m1, m2, :]
        prob = np.linalg.norm(bob) ** 2
        bob = bob / np.linalg.norm(bob)
        fixed = np.linalg.matrix_power(Z, m1) @ np.linalg.matrix_power(X, m2) @ bob   # X^m2 first, then Z^m1
        fidelity = abs(np.vdot(psi, fixed)) ** 2
        print(f"m1m2={m1}{m2}  P={prob:.3f}  fidelity={fidelity:.6f}")</code></pre>
<div class="out">m1m2=00  P=0.250  fidelity=1.000000
m1m2=01  P=0.250  fidelity=1.000000
m1m2=10  P=0.250  fidelity=1.000000
m1m2=11  P=0.250  fidelity=1.000000</div>
<p><strong>Độ trung thực (fidelity)</strong> |⟨ψ|Bob⟩|<sup>2</sup> bằng 1 đúng khi trạng thái của Bob bằng |ψ⟩ sai khác pha toàn cục. Ta cũng đã kiểm công thức sau khi nhóm bằng sympy (tính ký hiệu): sau cổng H, tám biên độ (×2) là α, β, β, α, α, −β, −β, α cho |000⟩ … |111⟩.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Áp hiệu chỉnh sai thứ tự hoặc đổi lẫn m<sub>1</sub> với m<sub>2</sub>. Hiệu chỉnh X do kết quả đo q1 (nửa vướng víu) điều khiển, hiệu chỉnh Z do q0 (qubit tin nhắn sau H) điều khiển.</li><li>Nghĩ dịch chuyển lượng tử chuyển vật chất hay năng lượng. Chỉ <em>thông tin</em> lượng tử được chuyển, và nó cần một cặp Bell chia sẻ trước cộng một kênh cổ điển.</li><li>Kết luận Bob nhận |ψ⟩ tức thì. Cho tới khi hai bit tới nơi, qubit của Bob là hỗn hợp đều, không mang thông tin gì về |ψ⟩.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Tài nguyên: một cặp Bell + hai bit cổ điển ⇒ chuyển được một trạng thái qubit.</li><li>Alice: CNOT<sub>01</sub>, H trên q0, đo q0 → m<sub>1</sub>, q1 → m<sub>2</sub>.</li><li>Bob giữ X<sup>m<sub>2</sub></sup>Z<sup>m<sub>1</sub></sup>|ψ⟩; Bob áp X<sup>m<sub>2</sub></sup> rồi Z<sup>m<sub>1</sub></sup>.</li><li>Mỗi kết quả xác suất 1/4; bản gốc bị phá huỷ (không nhân bản) và không gì đi nhanh hơn ánh sáng.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://quantum.country/teleportation" target="_blank" rel="noopener">Matuschak &amp; Nielsen — Dịch chuyển lượng tử hoạt động thế nào (quantum.country)</a></li><li><a href="https://github.com/Qiskit/documentation/blob/main/learning/courses/basics-of-quantum-information/entanglement-in-action/quantum-teleportation.ipynb" target="_blank" rel="noopener">IBM Quantum Learning (Watrous) — Vướng víu trong thực tế: dịch chuyển lượng tử (notebook gốc)</a></li><li><a href="https://en.wikipedia.org/wiki/Quantum_teleportation" target="_blank" rel="noopener">Wikipedia — Dịch chuyển lượng tử</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Alice được m<sub>1</sub>m<sub>2</sub> = 10. Bob đang giữ trạng thái nào, và áp cổng nào?</li><li>Việc mọi kết quả đều có xác suất 1/4, bất kể α và β, quan trọng thế nào với lập luận “không truyền tin”?</li><li>Dịch chuyển |+⟩ = (|0⟩ + |1⟩)/√2. Ở nhánh 11, trước khi hiệu chỉnh, Bob giữ gì?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) α|0⟩ − β|1⟩ = Z|ψ⟩; Bob áp <b>Z</b>. 2) Kết quả của Alice ngẫu nhiên đều và không tiết lộ gì về |ψ⟩; lấy trung bình theo chúng, qubit của Bob là cùng một hỗn hợp với mọi |ψ⟩, nên không bên nào có thông tin trước khi trao đổi bit cổ điển. 3) α|1⟩ − β|0⟩ với α = β = 1/√2: (|1⟩ − |0⟩)/√2 = <b>−|−⟩</b>; X rồi Z đưa nó về |+⟩.</p></div>`);

const c73 = L('qtc211-ts-7-3',
  '7.3 — BB84 quantum key distribution: detecting an eavesdropper|||7.3 — Phân phối khoá lượng tử BB84: phát hiện kẻ nghe lén',
  'Giao thức BB84 (Bennett–Brassard 1984): mã bit vào cơ sở Z/X ngẫu nhiên, sàng lọc, ước lượng lỗi; tấn công chặn–gửi lại gây ≈25% lỗi trong khoá đã sàng (mô phỏng numpy có seed); so sánh QKD với mật mã hậu lượng tử (NIST FIPS 203).',
  `<span class="eyebrow">QTC211 · Chapter 7 · Lesson 7.3</span>
<h2>BB84 quantum key distribution: detecting an eavesdropper</h2>
<p class="lead">Shor's algorithm (Chapter 9) threatens today's public-key cryptography. Quantum mechanics also offers a defence: in the <strong>BB84</strong> protocol (Bennett &amp; Brassard, 1984) two parties grow a shared secret key, and any eavesdropper is <em>forced</em> to leave errors behind — because measuring an unknown quantum state disturbs it.</p>
<h3>🎯 Objectives</h3>
<ul><li>Describe the BB84 steps: random bits and bases, transmission, sifting, error estimation.</li><li>Compute the 25% error rate caused by an intercept-resend attack, and the chance an eavesdropper escapes detection.</li><li>Simulate BB84 in numpy with and without an eavesdropper.</li><li>Compare quantum key distribution with post-quantum cryptography.</li></ul>
<h3>📖 Lecture</h3>
<p>BB84 uses two bases of one qubit: the <strong>Z basis</strong> {|0⟩, |1⟩} and the <strong>X basis</strong> {|+⟩, |−⟩}. In each basis, the first state encodes bit 0 and the second bit 1. The two bases are “mutually unbiased”: measuring a Z-basis state in the X basis gives a uniformly random result, and vice versa (|⟨+|0⟩|<sup>2</sup> = 1/2).</p>
<ol><li><strong>Prepare and send.</strong> For each position Alice picks a random bit and a random basis, prepares the matching state (|0⟩, |1⟩, |+⟩ or |−⟩) and sends it to Bob.</li><li><strong>Measure.</strong> Bob picks his own random basis for each qubit and measures. To measure in the X basis he applies H and then measures in Z.</li><li><strong>Sift.</strong> Over a public (authenticated) classical channel they announce their <em>bases</em>, never the bits, and keep only positions where the bases matched — about half. On those, Bob's bit equals Alice's bit if nobody interfered.</li><li><strong>Estimate errors.</strong> They reveal a random sample of the sifted bits and compare them. A high error rate means an eavesdropper (or too much noise): abort.</li><li><strong>Post-process.</strong> Classical error correction and privacy amplification turn the remaining bits into a shorter key about which the eavesdropper has negligible information.</li></ol>
<p><strong>Why Eve is caught.</strong> In the simplest attack, Eve intercepts each qubit, measures it in a random basis and resends the state she obtained. Look only at sifted positions (Alice and Bob used the same basis). With probability 1/2 Eve chose the same basis: she learns the bit and resends the correct state — no error. With probability 1/2 she chose the other basis: she resends a state of the wrong basis, and Bob's measurement in the correct basis then gives a random bit, wrong with probability 1/2. So the error rate is 1/2 · 1/2 = <strong>1/4</strong>.</p>
<div class="formula"><span class="lbl">Detection</span>each compared sifted bit reveals Eve with probability 1/4  ⇒  P(Eve unnoticed after k checked bits) = (3/4)<sup>k</sup>;  k = 20 ⇒ ≈ 0.0032</div>
<p>This is the no-cloning theorem at work: if Eve could copy the unknown qubits she could measure the copies later, after the bases are announced, and stay invisible.</p>
<h3>✍️ Worked example — simulation</h3>
<pre><code class="language-python">import numpy as np
H = np.array([[1, 1], [1, -1]]) / np.sqrt(2)
rng = np.random.default_rng(seed=84)

def prepare(bit, basis):                 # basis 0 = Z (|0&gt;,|1&gt;), basis 1 = X (|+&gt;,|-&gt;)
    v = np.array([1.0, 0.0]) if bit == 0 else np.array([0.0, 1.0])
    return H @ v if basis == 1 else v

def measure(state, basis):               # rotate X basis to Z basis, then Born rule
    if basis == 1:
        state = H @ state
    p1 = abs(state[1]) ** 2
    bit = int(rng.random() &lt; p1)
    return bit, prepare(bit, basis)      # outcome and collapsed state

def bb84(n, eve):
    a_bits, a_bases, b_bases = rng.integers(0, 2, n), rng.integers(0, 2, n), rng.integers(0, 2, n)
    b_bits = []
    for bit, ab, bb in zip(a_bits, a_bases, b_bases):
        q = prepare(bit, ab)
        if eve:                                   # intercept-resend in a random basis
            _, q = measure(q, rng.integers(0, 2))
        b_bits.append(measure(q, bb)[0])
    keep = a_bases == b_bases                     # sifting: keep matching bases only
    errors = np.sum(a_bits[keep] != np.array(b_bits)[keep])
    return int(keep.sum()), int(errors)

for eve in (False, True):
    kept, err = bb84(4000, eve)
    print("Eve" if eve else "No Eve", "| sifted bits:", kept, "| errors:", err, "| error rate:", round(err / kept, 4))</code></pre>
<div class="out">No Eve | sifted bits: 2003 | errors: 0 | error rate: 0.0
Eve | sifted bits: 2001 | errors: 469 | error rate: 0.2344</div>
<p>Step by step: about half of the 4000 positions survive sifting (2003 and 2001 — close to 2000, as expected). Without Eve the sifted key is error-free. With Eve the error rate is 0.2344, within two standard deviations of the predicted 0.25 (standard deviation √(0.25 · 0.75 / 2001) ≈ 0.0097). Real channels have some noise even without Eve, so practical systems abort above a threshold of roughly 11% for BB84 rather than at “any error”.</p>
<h3>QKD versus post-quantum cryptography</h3>
<p>QKD's security rests on physics, but it needs special hardware (single-photon sources and detectors), a quantum channel (fibre or free-space, limited in distance) and an <strong>already authenticated</strong> classical channel. <strong>Post-quantum cryptography</strong> takes the other route: new public-key algorithms running on ordinary computers, believed hard even for quantum computers. NIST standardised the first ones in August 2024, e.g. FIPS 203 (ML-KEM, a lattice-based key-encapsulation mechanism). For most software systems, migrating to PQC is the practical response to the quantum threat; QKD is a niche for special links.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Announcing the bits instead of the bases during sifting — that would publish the key.</li><li>Expecting a 50% error rate from Eve. Half of her basis choices are right, and in the wrong half Bob is still right half the time: 25%.</li><li>Believing QKD needs no classical authentication. Without it, Eve can impersonate Bob to Alice and Alice to Bob (man-in-the-middle).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Bits are encoded in randomly chosen Z or X bases; only matching-basis positions are kept (≈ half).</li><li>Intercept-resend in a random basis causes 25% errors in the sifted key; k checks miss Eve with probability (3/4)<sup>k</sup>.</li><li>Security comes from the disturbance caused by measurement and from no-cloning.</li><li>QKD needs quantum hardware and an authenticated channel; PQC (NIST FIPS 203) is the mainstream defence.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/BB84" target="_blank" rel="noopener">Wikipedia — BB84</a></li><li><a href="https://en.wikipedia.org/wiki/Quantum_key_distribution" target="_blank" rel="noopener">Wikipedia — Quantum key distribution</a></li><li><a href="https://csrc.nist.gov/projects/post-quantum-cryptography" target="_blank" rel="noopener">NIST CSRC — Post-Quantum Cryptography project</a></li><li><a href="https://csrc.nist.gov/pubs/fips/203/final" target="_blank" rel="noopener">NIST FIPS 203 — Module-Lattice-Based Key-Encapsulation Mechanism Standard</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Alice sends |−⟩ and Bob measures in the Z basis. What does Bob get, and is this position kept after sifting?</li><li>Eve intercepts only 40% of the qubits (random basis, resend). What error rate do Alice and Bob expect in the sifted key?</li><li>How many sifted bits must be compared so that an intercept-resend Eve escapes detection with probability below 0.01?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) |⟨0|−⟩|<sup>2</sup> = |⟨1|−⟩|<sup>2</sup> = 1/2: a random bit. The bases differ (X vs Z), so the position is <b>discarded</b>. 2) 0.4 × 1/4 = <b>10%</b>. 3) Need (3/4)<sup>k</sup> &lt; 0.01 ⇒ k &gt; ln 0.01 / ln 0.75 ≈ 16.0, so <b>k = 17</b> bits ((3/4)<sup>17</sup> ≈ 0.0075).</p></div>`,
  `<span class="eyebrow">QTC211 · Chương 7 · Bài 7.3</span>
<h2>Phân phối khoá lượng tử BB84: phát hiện kẻ nghe lén</h2>
<p class="lead">Thuật toán Shor (Chương 9) đe doạ mật mã khoá công khai ngày nay. Cơ học lượng tử cũng cho một cách phòng thủ: trong giao thức <strong>BB84</strong> (Bennett &amp; Brassard, 1984), hai bên cùng tạo một khoá bí mật chung, và kẻ nghe lén nào cũng <em>buộc</em> phải để lại lỗi — vì đo một trạng thái lượng tử chưa biết sẽ làm nhiễu nó.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Mô tả các bước BB84: bit và cơ sở ngẫu nhiên, truyền, sàng lọc, ước lượng lỗi.</li><li>Tính tỉ lệ lỗi 25% do tấn công chặn–gửi lại gây ra, và xác suất kẻ nghe lén thoát.</li><li>Mô phỏng BB84 bằng numpy khi có và không có kẻ nghe lén.</li><li>So sánh phân phối khoá lượng tử với mật mã hậu lượng tử.</li></ul>
<h3>📖 Bài giảng</h3>
<p>BB84 dùng hai cơ sở của một qubit: <strong>cơ sở Z</strong> {|0⟩, |1⟩} và <strong>cơ sở X</strong> {|+⟩, |−⟩}. Trong mỗi cơ sở, trạng thái thứ nhất mã bit 0, trạng thái thứ hai mã bit 1. Hai cơ sở “không thiên lệch lẫn nhau”: đo một trạng thái cơ sở Z trong cơ sở X cho kết quả ngẫu nhiên đều, và ngược lại (|⟨+|0⟩|<sup>2</sup> = 1/2).</p>
<ol><li><strong>Chuẩn bị và gửi.</strong> Với mỗi vị trí, Alice chọn ngẫu nhiên một bit và một cơ sở, tạo trạng thái tương ứng (|0⟩, |1⟩, |+⟩ hoặc |−⟩) rồi gửi cho Bob.</li><li><strong>Đo.</strong> Bob chọn cơ sở ngẫu nhiên của riêng mình cho mỗi qubit và đo. Để đo trong cơ sở X, Bob áp H rồi đo trong cơ sở Z.</li><li><strong>Sàng lọc.</strong> Qua một kênh cổ điển công khai (có xác thực), hai bên công bố <em>cơ sở</em>, không bao giờ công bố bit, và chỉ giữ các vị trí có cơ sở trùng nhau — khoảng một nửa. Ở các vị trí đó, nếu không ai can thiệp, bit của Bob bằng bit của Alice.</li><li><strong>Ước lượng lỗi.</strong> Hai bên công bố một mẫu ngẫu nhiên các bit đã sàng và so sánh. Tỉ lệ lỗi cao nghĩa là có kẻ nghe lén (hoặc nhiễu quá lớn): huỷ phiên.</li><li><strong>Hậu xử lý.</strong> Sửa lỗi cổ điển và khuếch đại bảo mật (privacy amplification) biến các bit còn lại thành một khoá ngắn hơn mà kẻ nghe lén gần như không có thông tin gì.</li></ol>
<p><strong>Vì sao Eve bị lộ.</strong> Trong kiểu tấn công đơn giản nhất, Eve chặn từng qubit, đo nó trong một cơ sở ngẫu nhiên rồi gửi lại trạng thái cô thu được. Chỉ xét các vị trí đã sàng (Alice và Bob dùng cùng cơ sở). Với xác suất 1/2 Eve chọn trùng cơ sở: cô biết bit và gửi lại đúng trạng thái — không có lỗi. Với xác suất 1/2 cô chọn cơ sở kia: cô gửi lại một trạng thái của cơ sở sai, và phép đo của Bob trong cơ sở đúng khi đó cho bit ngẫu nhiên, sai với xác suất 1/2. Vậy tỉ lệ lỗi là 1/2 · 1/2 = <strong>1/4</strong>.</p>
<div class="formula"><span class="lbl">Phát hiện</span>mỗi bit đã sàng đem so làm lộ Eve với xác suất 1/4  ⇒  P(Eve không bị phát hiện sau k bit kiểm) = (3/4)<sup>k</sup>;  k = 20 ⇒ ≈ 0,0032</div>
<p>Đây chính là định lý không nhân bản đang làm việc: nếu Eve sao chép được các qubit chưa biết, cô có thể đo các bản sao sau khi cơ sở đã được công bố và vẫn vô hình.</p>
<h3>✍️ Ví dụ giải từng bước — mô phỏng</h3>
<pre><code class="language-python">import numpy as np
H = np.array([[1, 1], [1, -1]]) / np.sqrt(2)
rng = np.random.default_rng(seed=84)

def prepare(bit, basis):                 # basis 0 = Z (|0&gt;,|1&gt;), basis 1 = X (|+&gt;,|-&gt;)
    v = np.array([1.0, 0.0]) if bit == 0 else np.array([0.0, 1.0])
    return H @ v if basis == 1 else v

def measure(state, basis):               # rotate X basis to Z basis, then Born rule
    if basis == 1:
        state = H @ state
    p1 = abs(state[1]) ** 2
    bit = int(rng.random() &lt; p1)
    return bit, prepare(bit, basis)      # outcome and collapsed state

def bb84(n, eve):
    a_bits, a_bases, b_bases = rng.integers(0, 2, n), rng.integers(0, 2, n), rng.integers(0, 2, n)
    b_bits = []
    for bit, ab, bb in zip(a_bits, a_bases, b_bases):
        q = prepare(bit, ab)
        if eve:                                   # intercept-resend in a random basis
            _, q = measure(q, rng.integers(0, 2))
        b_bits.append(measure(q, bb)[0])
    keep = a_bases == b_bases                     # sifting: keep matching bases only
    errors = np.sum(a_bits[keep] != np.array(b_bits)[keep])
    return int(keep.sum()), int(errors)

for eve in (False, True):
    kept, err = bb84(4000, eve)
    print("Eve" if eve else "No Eve", "| sifted bits:", kept, "| errors:", err, "| error rate:", round(err / kept, 4))</code></pre>
<div class="out">No Eve | sifted bits: 2003 | errors: 0 | error rate: 0.0
Eve | sifted bits: 2001 | errors: 469 | error rate: 0.2344</div>
<p>Từng bước: khoảng một nửa trong 4000 vị trí qua được sàng lọc (2003 và 2001 — gần 2000, đúng dự đoán). Không có Eve thì khoá đã sàng không lỗi nào. Có Eve thì tỉ lệ lỗi là 0,2344, nằm trong hai độ lệch chuẩn quanh giá trị dự đoán 0,25 (độ lệch chuẩn √(0,25 · 0,75 / 2001) ≈ 0,0097). Kênh thật có nhiễu ngay cả khi không có Eve, nên hệ thống thực tế huỷ phiên khi lỗi vượt một ngưỡng cỡ 11% với BB84 chứ không phải “hễ có lỗi”.</p>
<h3>QKD so với mật mã hậu lượng tử</h3>
<p>An toàn của QKD dựa trên vật lý, nhưng nó cần phần cứng đặc biệt (nguồn và bộ dò đơn photon), một kênh lượng tử (cáp quang hoặc không gian tự do, giới hạn khoảng cách) và một kênh cổ điển <strong>đã xác thực sẵn</strong>. <strong>Mật mã hậu lượng tử (PQC)</strong> đi đường khác: thuật toán khoá công khai mới chạy trên máy tính thường, được tin là khó ngay cả với máy lượng tử. NIST chuẩn hoá các thuật toán đầu tiên vào tháng 8/2024, vd FIPS 203 (ML-KEM, cơ chế đóng gói khoá dựa trên lưới). Với đa số hệ thống phần mềm, chuyển sang PQC là cách ứng phó thực tế với mối đe doạ lượng tử; QKD là lựa chọn ngách cho những đường truyền đặc biệt.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Công bố bit thay vì cơ sở khi sàng lọc — như thế là công bố luôn khoá.</li><li>Đoán Eve gây 50% lỗi. Một nửa số lần cô chọn đúng cơ sở, và ở nửa sai thì Bob vẫn đúng một nửa số lần: 25%.</li><li>Tin rằng QKD không cần xác thực cổ điển. Thiếu nó, Eve đóng giả Bob với Alice và đóng giả Alice với Bob được (tấn công người đứng giữa).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Bit được mã vào cơ sở Z hoặc X chọn ngẫu nhiên; chỉ giữ các vị trí trùng cơ sở (≈ một nửa).</li><li>Chặn–gửi lại với cơ sở ngẫu nhiên gây 25% lỗi trong khoá đã sàng; k bit kiểm bỏ sót Eve với xác suất (3/4)<sup>k</sup>.</li><li>An toàn đến từ nhiễu loạn do phép đo gây ra và từ định lý không nhân bản.</li><li>QKD cần phần cứng lượng tử và kênh có xác thực; PQC (NIST FIPS 203) là cách phòng thủ chủ đạo.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/BB84" target="_blank" rel="noopener">Wikipedia — BB84</a></li><li><a href="https://en.wikipedia.org/wiki/Quantum_key_distribution" target="_blank" rel="noopener">Wikipedia — Phân phối khoá lượng tử</a></li><li><a href="https://csrc.nist.gov/projects/post-quantum-cryptography" target="_blank" rel="noopener">NIST CSRC — Dự án Mật mã hậu lượng tử</a></li><li><a href="https://csrc.nist.gov/pubs/fips/203/final" target="_blank" rel="noopener">NIST FIPS 203 — Chuẩn cơ chế đóng gói khoá dựa trên lưới module</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Alice gửi |−⟩ và Bob đo trong cơ sở Z. Bob được gì, và vị trí này có được giữ sau sàng lọc không?</li><li>Eve chỉ chặn 40% số qubit (cơ sở ngẫu nhiên, gửi lại). Alice và Bob nên kỳ vọng tỉ lệ lỗi bao nhiêu trong khoá đã sàng?</li><li>Phải so bao nhiêu bit đã sàng để một Eve chặn–gửi lại thoát với xác suất dưới 0,01?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) |⟨0|−⟩|<sup>2</sup> = |⟨1|−⟩|<sup>2</sup> = 1/2: một bit ngẫu nhiên. Hai cơ sở khác nhau (X và Z), nên vị trí này <b>bị loại</b>. 2) 0,4 × 1/4 = <b>10%</b>. 3) Cần (3/4)<sup>k</sup> &lt; 0,01 ⇒ k &gt; ln 0,01 / ln 0,75 ≈ 16,0, nên <b>k = 17</b> bit ((3/4)<sup>17</sup> ≈ 0,0075).</p></div>`);

const q7 = QZ(7, 'Quiz — Chapter 7: Superdense coding, teleportation, BB84|||Quiz — Chương 7: Mã hoá siêu đặc, dịch chuyển lượng tử, BB84', 'Kiểm tra chương 7: phép đo Bell, bảng mã hoá siêu đặc, giới hạn Holevo, các nhánh và hiệu chỉnh của dịch chuyển lượng tử, không truyền tin nhanh hơn ánh sáng, sàng lọc BB84, tỉ lệ lỗi 25%, PQC.', [
  Q('q1', 'A Bell measurement (CNOT01, then H on q0, then measure) applied to Φ⁻ gives|||Phép đo Bell (CNOT01, rồi H trên q0, rồi đo) áp lên Φ⁻ cho',
    ['00|||00', '01|||01', '10|||10', '11|||11'], 2,
    'Φ⁺, Ψ⁺, Φ⁻, Ψ⁻ map to 00, 01, 10, 11.|||Φ⁺, Ψ⁺, Φ⁻, Ψ⁻ ứng với 00, 01, 10, 11.'),
  Q('q2', 'In superdense coding starting from Φ⁺, Alice applies X to her qubit. The shared state becomes|||Trong mã hoá siêu đặc từ Φ⁺, Alice áp X lên qubit của mình. Trạng thái chung thành',
    ['Φ⁻|||Φ⁻', 'Ψ⁺|||Ψ⁺', 'Ψ⁻|||Ψ⁻', 'Φ⁺ (unchanged)|||Φ⁺ (không đổi)'], 1,
    '(X ⊗ I)(|00⟩ + |11⟩)/√2 = (|10⟩ + |01⟩)/√2 = Ψ⁺.|||(X ⊗ I)(|00⟩ + |11⟩)/√2 = (|10⟩ + |01⟩)/√2 = Ψ⁺.'),
  Q('q3', 'Why does superdense coding not violate Holevo’s bound?|||Vì sao mã hoá siêu đặc không vi phạm giới hạn Holevo?',
    ['Because Bob measures twice|||Vì Bob đo hai lần', 'Because a second, pre-shared qubit is used: 2 qubits carry 2 bits|||Vì có một qubit thứ hai chia sẻ trước: 2 qubit mang 2 bit', 'Because the bits are only approximately correct|||Vì các bit chỉ đúng gần đúng', 'Because Holevo’s bound applies only to photons|||Vì giới hạn Holevo chỉ áp dụng cho photon'], 1,
    'The entangled half travelled earlier; in total two qubits deliver two bits.|||Nửa vướng víu đã được gửi trước; tổng cộng hai qubit mang hai bit.'),
  Q('q4', 'In teleportation, how many classical bits must Alice send to Bob?|||Trong dịch chuyển lượng tử, Alice phải gửi cho Bob bao nhiêu bit cổ điển?',
    ['0|||0', '1|||1', 'infinitely many (to describe α and β)|||vô số (để mô tả α và β)', '2|||2'], 3,
    'Two bits m1 m2 select one of four Pauli corrections.|||Hai bit m1 m2 chọn một trong bốn hiệu chỉnh Pauli.'),
  Q('q5', 'Alice’s outcome is m1m2 = 01. Before correction Bob holds|||Kết quả của Alice là m1m2 = 01. Trước khi hiệu chỉnh Bob giữ',
    ['α|0⟩ + β|1⟩|||α|0⟩ + β|1⟩', 'α|0⟩ − β|1⟩|||α|0⟩ − β|1⟩', 'α|1⟩ − β|0⟩|||α|1⟩ − β|0⟩', 'α|1⟩ + β|0⟩|||α|1⟩ + β|0⟩'], 3,
    'Branch 01 holds X|ψ⟩ = α|1⟩ + β|0⟩; Bob applies X.|||Nhánh 01 giữ X|ψ⟩ = α|1⟩ + β|0⟩; Bob áp X.'),
  Q('q6', 'What is the probability of each of Alice’s four outcomes in teleportation?|||Xác suất của mỗi kết quả trong bốn kết quả của Alice khi dịch chuyển là',
    ['|α|² for 00 and |β|² for 11||||α|² cho 00 và |β|² cho 11', '1/2|||1/2', '1/4, independent of the state|||1/4, không phụ thuộc trạng thái', 'it depends on the phase of β|||phụ thuộc pha của β'], 2,
    'Each branch has amplitude 1/2 times a normalised state, so probability 1/4.|||Mỗi nhánh có biên độ 1/2 nhân một trạng thái đã chuẩn hoá, nên xác suất 1/4.'),
  Q('q7', 'Why can teleportation not send information faster than light?|||Vì sao dịch chuyển lượng tử không gửi được thông tin nhanh hơn ánh sáng?',
    ['Entanglement breaks over long distances|||Vướng víu bị đứt ở khoảng cách xa', 'Bob needs Alice’s two classical bits; before they arrive his qubit carries no information about |ψ⟩|||Bob cần hai bit cổ điển của Alice; trước khi chúng tới, qubit của Bob không mang thông tin gì về |ψ⟩', 'Alice must measure Bob’s qubit|||Alice phải đo qubit của Bob', 'The CNOT gate is slow|||Cổng CNOT chậm'], 1,
    'Averaged over Alice’s random outcomes, Bob’s qubit is the same mixture for every |ψ⟩.|||Lấy trung bình theo các kết quả ngẫu nhiên của Alice, qubit của Bob là cùng một hỗn hợp với mọi |ψ⟩.'),
  Q('q8', 'In BB84 sifting, Alice and Bob publicly compare|||Khi sàng lọc trong BB84, Alice và Bob công khai so sánh',
    ['their bases only|||chỉ các cơ sở', 'all their bits|||toàn bộ các bit', 'the quantum states|||các trạng thái lượng tử', 'nothing at all|||không gì cả'], 0,
    'Revealing bases is harmless; positions with different bases are discarded.|||Công bố cơ sở là vô hại; các vị trí khác cơ sở bị loại.'),
  Q('q9', 'An intercept-resend eavesdropper using random bases causes an error rate in the sifted key of about|||Kẻ nghe lén chặn–gửi lại với cơ sở ngẫu nhiên gây tỉ lệ lỗi trong khoá đã sàng khoảng',
    ['0%|||0%', '12.5%|||12,5%', '50%|||50%', '25%|||25%'], 3,
    'Wrong basis with probability 1/2, then Bob wrong with probability 1/2: 1/4.|||Sai cơ sở với xác suất 1/2, rồi Bob sai với xác suất 1/2: 1/4.'),
  Q('q10', 'Which statement about post-quantum cryptography (e.g. NIST FIPS 203) is correct?|||Phát biểu nào về mật mã hậu lượng tử (vd NIST FIPS 203) là đúng?',
    ['It requires a quantum channel|||Nó cần kênh lượng tử', 'It runs on ordinary computers and is designed to resist quantum attacks|||Nó chạy trên máy tính thường và được thiết kế để chống tấn công lượng tử', 'It is the same thing as BB84|||Nó chính là BB84', 'It is broken by Grover’s algorithm|||Nó bị thuật toán Grover phá'], 1,
    'PQC is classical public-key cryptography believed hard for quantum computers; QKD is the quantum-hardware approach.|||PQC là mật mã khoá công khai cổ điển được tin là khó với máy lượng tử; QKD mới là hướng dùng phần cứng lượng tử.'),
]);

const ch7 = {
  title: 'Chapter 7 — Protocols: superdense coding, teleportation and BB84|||Chương 7 — Giao thức: mã hoá siêu đặc, dịch chuyển lượng tử và BB84',
  description: 'Phép đo Bell và mã hoá siêu đặc, dịch chuyển lượng tử từng bước (đại số bốn nhánh + mô phỏng numpy), phân phối khoá lượng tử BB84 với tấn công chặn–gửi lại, so sánh QKD và mật mã hậu lượng tử (Nielsen & Chuang 1.3.7, 2.3, 12.6 · Watrous Lesson 4).',
  lessons: [c71, c72, c73, q7],
};

// ───────────────────────────── Chương 8 — Thuật toán truy vấn ─────────────────────────────
const c81 = L('qtc211-ts-8-1',
  '8.1 — The query model, oracles, phase kickback and Deutsch’s algorithm|||8.1 — Mô hình truy vấn, oracle, phase kickback và thuật toán Deutsch',
  'Mô hình truy vấn (hộp đen), oracle U_f|x⟩|y⟩ = |x⟩|y⊕f(x)⟩, phase kickback với qubit đích |−⟩, thuật toán Deutsch phân biệt hằng/cân bằng bằng MỘT truy vấn, kiểm bằng numpy cho cả 4 hàm.',
  `<span class="eyebrow">QTC211 · Chapter 8 · Lesson 8.1</span>
<h2>The query model, oracles, phase kickback and Deutsch's algorithm</h2>
<p class="lead">The first proofs that quantum computers can beat classical ones were not about factoring — they were about <strong>queries</strong>: how many times must you call a black-box function to learn something about it? Deutsch's algorithm answers a question about a function with one call where any classical method needs two.</p>
<h3>🎯 Objectives</h3>
<ul><li>Describe the query (black-box) model and count queries as the cost.</li><li>Write the standard quantum oracle U<sub>f</sub>|x⟩|y⟩ = |x⟩|y ⊕ f(x)⟩ and check that it is unitary.</li><li>Derive phase kickback: with the target in |−⟩, the oracle writes (−1)<sup>f(x)</sup> into the phase.</li><li>Trace Deutsch's algorithm for all four functions f: {0, 1} → {0, 1}.</li></ul>
<h3>📖 Lecture</h3>
<p>In the <strong>query model</strong> we are given a function f as a black box (an <em>oracle</em>): we may evaluate it, but not look inside. The cost of an algorithm is the <strong>number of queries</strong>. This model is artificial, but it is where quantum speed-ups can be <em>proved</em>, and Grover's and Shor's algorithms both use oracles as subroutines.</p>
<p>A quantum computer cannot simply compute x ↦ f(x) in place, because that map is usually not reversible (two inputs may give the same output) and every gate must be unitary. The standard fix keeps the input and XORs the answer into an extra <strong>target</strong> qubit:</p>
<div class="formula"><span class="lbl">Standard oracle</span>U<sub>f</sub> |x⟩|y⟩ = |x⟩|y ⊕ f(x)⟩    (⊕ = XOR, addition mod 2)</div>
<p>U<sub>f</sub> just permutes basis states, and applying it twice gives back |x⟩|y⟩ because (y ⊕ f(x)) ⊕ f(x) = y. So U<sub>f</sub><sup>2</sup> = I and U<sub>f</sub> is unitary — it is a reversible classical circuit (Chapter 6) promoted to a gate.</p>
<p><strong>Phase kickback.</strong> Put the target qubit in |−⟩ = (|0⟩ − |1⟩)/√2. If f(x) = 0 nothing changes. If f(x) = 1 the target becomes (|1⟩ − |0⟩)/√2 = −|−⟩. In both cases:</p>
<div class="formula"><span class="lbl">Phase kickback</span>U<sub>f</sub> |x⟩|−⟩ = (−1)<sup>f(x)</sup> |x⟩|−⟩</div>
<p>The target is unchanged; the answer has been “kicked back” into the <em>phase</em> of the input register. A phase is invisible on a single basis state, but on a superposition it becomes a <em>relative</em> phase that interference can turn into a measurable bit.</p>
<p><strong>Deutsch's problem.</strong> There are four functions f: {0, 1} → {0, 1}: two <strong>constant</strong> (f = 0, f = 1) and two <strong>balanced</strong> (f(x) = x, f(x) = 1 − x). Decide which kind f is. Classically you must evaluate both f(0) and f(1): <strong>2 queries</strong>. Deutsch's algorithm uses <strong>1</strong>:</p>
<ol><li>Start in |0⟩|1⟩ and apply H ⊗ H: the state is (1/√2)(|0⟩ + |1⟩) ⊗ |−⟩ = |+⟩|−⟩.</li><li>One query with phase kickback: (1/√2)((−1)<sup>f(0)</sup>|0⟩ + (−1)<sup>f(1)</sup>|1⟩) ⊗ |−⟩.</li><li>Factor out (−1)<sup>f(0)</sup>: the first qubit is ±|+⟩ if f(0) = f(1) and ±|−⟩ if f(0) ≠ f(1).</li><li>Apply H to the first qubit (H|+⟩ = |0⟩, H|−⟩ = |1⟩) and measure: <strong>0 ⇒ constant, 1 ⇒ balanced</strong>, with certainty.</li></ol>
<p>The single query evaluated f on both inputs “in superposition”, but the algorithm did <em>not</em> learn f(0) and f(1) — it learned only the one bit f(0) ⊕ f(1). That is the honest picture of quantum parallelism: you get one global property, chosen by interference, not all the values.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — the oracle as a matrix.</b> For f(x) = x, U<sub>f</sub>|x⟩|y⟩ = |x⟩|y ⊕ x⟩: |00⟩ → |00⟩, |01⟩ → |01⟩, |10⟩ → |11⟩, |11⟩ → |10⟩. This is exactly <b>CNOT</b> with control x. For f = 0 the oracle is I; for f = 1 it is I ⊗ X; for f(x) = 1 − x it is (X ⊗ I)·CNOT·(X ⊗ I).</p></div>
<div class="callout"><p><b>Example 2 — tracing f(x) = 1 − x.</b> After step 2 the first qubit is (1/√2)((−1)<sup>1</sup>|0⟩ + (−1)<sup>0</sup>|1⟩) = −(|0⟩ − |1⟩)/√2 = −|−⟩. After H it is −|1⟩: measuring gives <b>1 = balanced</b> with probability |−1|<sup>2</sup> = 1. The global sign −1 is unobservable.</p></div>
<div class="callout"><p><b>Example 3 — numpy check of all four functions.</b> The oracle is built as a 4×4 permutation matrix with basis index 2x + y (qubit 0 = x is the left qubit).</p>
<pre><code class="language-python">import numpy as np
H = np.array([[1, 1], [1, -1]]) / np.sqrt(2)
def oracle(f):                      # U_f |x&gt;|y&gt; = |x&gt;|y XOR f(x)&gt;, basis index = 2x + y
    U = np.zeros((4, 4))
    for x in (0, 1):
        for y in (0, 1):
            U[2 * x + (y ^ f(x)), 2 * x + y] = 1
    return U
funcs = {"f(x)=0": lambda x: 0, "f(x)=1": lambda x: 1, "f(x)=x": lambda x: x, "f(x)=1-x": lambda x: 1 - x}
for name, f in funcs.items():
    s = np.kron([1, 0], [0, 1])            # |0&gt;|1&gt;
    s = np.kron(H, H) @ s                  # |+&gt;|-&gt;
    s = oracle(f) @ s                      # one query
    s = np.kron(H, np.eye(2)) @ s          # H on the first qubit
    p0 = abs(s[0])**2 + abs(s[1])**2       # P(first qubit = 0)
    print(name, "P(0) =", round(p0, 3), "-&gt;", "constant" if p0 &gt; 0.5 else "balanced")</code></pre>
<div class="out">f(x)=0 P(0) = 1.0 -&gt; constant
f(x)=1 P(0) = 1.0 -&gt; constant
f(x)=x P(0) = 0.0 -&gt; balanced
f(x)=1-x P(0) = 0.0 -&gt; balanced</div></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Defining the oracle as |x⟩ → |f(x)⟩. That is not unitary for a constant f (two inputs, one output). Always use the extra target qubit and XOR.</li><li>Starting the target in |0⟩ instead of |1⟩ (so it becomes |+⟩ instead of |−⟩ after H). With |+⟩ there is no kickback: U<sub>f</sub>|x⟩|+⟩ = |x⟩|+⟩ and the algorithm outputs 0 for every f.</li><li>Claiming that Deutsch's algorithm “computes f(0) and f(1) at once”. It computes only f(0) ⊕ f(1); measuring destroys everything else.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Query model: cost = number of oracle calls.</li><li>U<sub>f</sub>|x⟩|y⟩ = |x⟩|y ⊕ f(x)⟩ is unitary and self-inverse.</li><li>Target in |−⟩ ⇒ U<sub>f</sub>|x⟩|−⟩ = (−1)<sup>f(x)</sup>|x⟩|−⟩ (phase kickback).</li><li>Deutsch: H ⊗ H on |0⟩|1⟩, one query, H, measure: 0 = constant, 1 = balanced; classical needs 2 queries.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.youtube.com/watch?v=2wticzHE1vs" target="_blank" rel="noopener">Qiskit — Quantum Query Algorithms, Lesson 05 (Watrous)</a></li><li><a href="https://github.com/Qiskit/documentation/blob/main/learning/courses/fundamentals-of-quantum-algorithms/quantum-query-algorithms/deutsch-algorithm.ipynb" target="_blank" rel="noopener">IBM Quantum Learning (Watrous) — Deutsch's algorithm (source notebook)</a></li><li><a href="https://en.wikipedia.org/wiki/Phase_kickback" target="_blank" rel="noopener">Wikipedia — Phase kickback</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Write the 4×4 matrix of U<sub>f</sub> for f = 1 (constant 1).</li><li>Show that U<sub>f</sub>|x⟩|+⟩ = |x⟩|+⟩ for every f. What does Deutsch's algorithm output if you forget the X on the target?</li><li>In Deutsch's algorithm the measured bit equals which Boolean expression of f(0), f(1)?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) U<sub>f</sub>|x⟩|y⟩ = |x⟩|y ⊕ 1⟩ flips the target: U<sub>f</sub> = I ⊗ X, i.e. rows/columns pair |00⟩↔|01⟩ and |10⟩↔|11⟩. 2) X|+⟩ = |+⟩ and I|+⟩ = |+⟩, so the target never changes and no phase appears; the first qubit stays |+⟩, H gives |0⟩, and the output is always 0 (“constant”) — wrong for balanced f. 3) f(0) ⊕ f(1).</p></div>`,
  `<span class="eyebrow">QTC211 · Chương 8 · Bài 8.1</span>
<h2>Mô hình truy vấn, oracle, phase kickback và thuật toán Deutsch</h2>
<p class="lead">Những chứng minh đầu tiên rằng máy lượng tử thắng máy cổ điển không nói về phân tích thừa số — chúng nói về <strong>truy vấn</strong>: phải gọi một hàm hộp đen bao nhiêu lần để biết một điều gì đó về nó? Thuật toán Deutsch trả lời một câu hỏi về hàm chỉ bằng một lần gọi, trong khi mọi cách cổ điển cần hai.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Mô tả mô hình truy vấn (hộp đen) và tính chi phí bằng số lần truy vấn.</li><li>Viết oracle lượng tử chuẩn U<sub>f</sub>|x⟩|y⟩ = |x⟩|y ⊕ f(x)⟩ và kiểm tra nó unita.</li><li>Suy ra phase kickback: khi qubit đích ở |−⟩, oracle ghi (−1)<sup>f(x)</sup> vào pha.</li><li>Lần từng bước thuật toán Deutsch cho cả bốn hàm f: {0, 1} → {0, 1}.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Trong <strong>mô hình truy vấn</strong>, ta được cho hàm f dưới dạng hộp đen (một <em>oracle</em>): được phép tính giá trị, nhưng không được nhìn vào bên trong. Chi phí của thuật toán là <strong>số lần truy vấn</strong>. Mô hình này nhân tạo, nhưng đây là nơi tăng tốc lượng tử <em>chứng minh được</em>, và cả Grover lẫn Shor đều dùng oracle làm chương trình con.</p>
<p>Máy lượng tử không thể tính thẳng x ↦ f(x) tại chỗ, vì ánh xạ đó thường không khả nghịch (hai đầu vào có thể cho cùng đầu ra) mà cổng nào cũng phải unita. Cách chuẩn là giữ nguyên đầu vào và XOR đáp án vào một qubit <strong>đích</strong> phụ:</p>
<div class="formula"><span class="lbl">Oracle chuẩn</span>U<sub>f</sub> |x⟩|y⟩ = |x⟩|y ⊕ f(x)⟩    (⊕ = XOR, cộng modulo 2)</div>
<p>U<sub>f</sub> chỉ hoán vị các trạng thái cơ sở, và áp hai lần thì trả lại |x⟩|y⟩ vì (y ⊕ f(x)) ⊕ f(x) = y. Vậy U<sub>f</sub><sup>2</sup> = I và U<sub>f</sub> unita — nó là một mạch cổ điển khả nghịch (Chương 6) được nâng thành cổng.</p>
<p><strong>Phase kickback (đá pha ngược).</strong> Đặt qubit đích ở |−⟩ = (|0⟩ − |1⟩)/√2. Nếu f(x) = 0 thì không gì đổi. Nếu f(x) = 1 thì đích thành (|1⟩ − |0⟩)/√2 = −|−⟩. Cả hai trường hợp:</p>
<div class="formula"><span class="lbl">Phase kickback</span>U<sub>f</sub> |x⟩|−⟩ = (−1)<sup>f(x)</sup> |x⟩|−⟩</div>
<p>Qubit đích không đổi; đáp án đã bị “đá ngược” vào <em>pha</em> của thanh ghi đầu vào. Pha vô hình trên một trạng thái cơ sở đơn lẻ, nhưng trên một chồng chập nó trở thành pha <em>tương đối</em>, và giao thoa có thể biến nó thành một bit đo được.</p>
<p><strong>Bài toán Deutsch.</strong> Có bốn hàm f: {0, 1} → {0, 1}: hai hàm <strong>hằng</strong> (f = 0, f = 1) và hai hàm <strong>cân bằng</strong> (f(x) = x, f(x) = 1 − x). Hãy quyết định f thuộc loại nào. Cổ điển phải tính cả f(0) và f(1): <strong>2 truy vấn</strong>. Thuật toán Deutsch dùng <strong>1</strong>:</p>
<ol><li>Bắt đầu ở |0⟩|1⟩ và áp H ⊗ H: trạng thái là (1/√2)(|0⟩ + |1⟩) ⊗ |−⟩ = |+⟩|−⟩.</li><li>Một truy vấn có phase kickback: (1/√2)((−1)<sup>f(0)</sup>|0⟩ + (−1)<sup>f(1)</sup>|1⟩) ⊗ |−⟩.</li><li>Rút (−1)<sup>f(0)</sup> ra ngoài: qubit thứ nhất là ±|+⟩ nếu f(0) = f(1) và ±|−⟩ nếu f(0) ≠ f(1).</li><li>Áp H lên qubit thứ nhất (H|+⟩ = |0⟩, H|−⟩ = |1⟩) rồi đo: <strong>0 ⇒ hằng, 1 ⇒ cân bằng</strong>, chắc chắn.</li></ol>
<p>Một truy vấn đã tính f trên cả hai đầu vào “trong chồng chập”, nhưng thuật toán <em>không</em> biết được f(0) và f(1) — nó chỉ biết đúng một bit f(0) ⊕ f(1). Đó là bức tranh trung thực về “song song lượng tử”: bạn nhận được một tính chất toàn cục do giao thoa chọn ra, không phải mọi giá trị.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — oracle dưới dạng ma trận.</b> Với f(x) = x, U<sub>f</sub>|x⟩|y⟩ = |x⟩|y ⊕ x⟩: |00⟩ → |00⟩, |01⟩ → |01⟩, |10⟩ → |11⟩, |11⟩ → |10⟩. Đây đúng là <b>CNOT</b> với điều khiển x. Với f = 0 oracle là I; với f = 1 là I ⊗ X; với f(x) = 1 − x là (X ⊗ I)·CNOT·(X ⊗ I).</p></div>
<div class="callout"><p><b>Ví dụ 2 — lần theo f(x) = 1 − x.</b> Sau bước 2 qubit thứ nhất là (1/√2)((−1)<sup>1</sup>|0⟩ + (−1)<sup>0</sup>|1⟩) = −(|0⟩ − |1⟩)/√2 = −|−⟩. Sau H nó là −|1⟩: đo được <b>1 = cân bằng</b> với xác suất |−1|<sup>2</sup> = 1. Dấu trừ toàn cục không quan sát được.</p></div>
<div class="callout"><p><b>Ví dụ 3 — kiểm bằng numpy cả bốn hàm.</b> Oracle dựng thành ma trận hoán vị 4×4 với chỉ số cơ sở 2x + y (qubit 0 = x là qubit bên trái).</p>
<pre><code class="language-python">import numpy as np
H = np.array([[1, 1], [1, -1]]) / np.sqrt(2)
def oracle(f):                      # U_f |x&gt;|y&gt; = |x&gt;|y XOR f(x)&gt;, basis index = 2x + y
    U = np.zeros((4, 4))
    for x in (0, 1):
        for y in (0, 1):
            U[2 * x + (y ^ f(x)), 2 * x + y] = 1
    return U
funcs = {"f(x)=0": lambda x: 0, "f(x)=1": lambda x: 1, "f(x)=x": lambda x: x, "f(x)=1-x": lambda x: 1 - x}
for name, f in funcs.items():
    s = np.kron([1, 0], [0, 1])            # |0&gt;|1&gt;
    s = np.kron(H, H) @ s                  # |+&gt;|-&gt;
    s = oracle(f) @ s                      # one query
    s = np.kron(H, np.eye(2)) @ s          # H on the first qubit
    p0 = abs(s[0])**2 + abs(s[1])**2       # P(first qubit = 0)
    print(name, "P(0) =", round(p0, 3), "-&gt;", "constant" if p0 &gt; 0.5 else "balanced")</code></pre>
<div class="out">f(x)=0 P(0) = 1.0 -&gt; constant
f(x)=1 P(0) = 1.0 -&gt; constant
f(x)=x P(0) = 0.0 -&gt; balanced
f(x)=1-x P(0) = 0.0 -&gt; balanced</div></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Định nghĩa oracle là |x⟩ → |f(x)⟩. Với f hằng thì đó không unita (hai đầu vào, một đầu ra). Luôn dùng qubit đích phụ và phép XOR.</li><li>Cho qubit đích bắt đầu ở |0⟩ thay vì |1⟩ (sau H nó thành |+⟩ thay vì |−⟩). Với |+⟩ thì không có kickback: U<sub>f</sub>|x⟩|+⟩ = |x⟩|+⟩ và thuật toán ra 0 với mọi f.</li><li>Nói rằng thuật toán Deutsch “tính f(0) và f(1) cùng lúc”. Nó chỉ tính f(0) ⊕ f(1); phép đo xoá mọi thứ khác.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Mô hình truy vấn: chi phí = số lần gọi oracle.</li><li>U<sub>f</sub>|x⟩|y⟩ = |x⟩|y ⊕ f(x)⟩ là unita và tự nghịch đảo.</li><li>Đích ở |−⟩ ⇒ U<sub>f</sub>|x⟩|−⟩ = (−1)<sup>f(x)</sup>|x⟩|−⟩ (phase kickback).</li><li>Deutsch: H ⊗ H lên |0⟩|1⟩, một truy vấn, H, đo: 0 = hằng, 1 = cân bằng; cổ điển cần 2 truy vấn.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.youtube.com/watch?v=2wticzHE1vs" target="_blank" rel="noopener">Qiskit — Quantum Query Algorithms, Lesson 05 (Watrous)</a></li><li><a href="https://github.com/Qiskit/documentation/blob/main/learning/courses/fundamentals-of-quantum-algorithms/quantum-query-algorithms/deutsch-algorithm.ipynb" target="_blank" rel="noopener">IBM Quantum Learning (Watrous) — Thuật toán Deutsch (notebook gốc)</a></li><li><a href="https://en.wikipedia.org/wiki/Phase_kickback" target="_blank" rel="noopener">Wikipedia — Phase kickback</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Viết ma trận 4×4 của U<sub>f</sub> với f = 1 (hằng 1).</li><li>Chứng minh U<sub>f</sub>|x⟩|+⟩ = |x⟩|+⟩ với mọi f. Thuật toán Deutsch ra gì nếu quên cổng X trên qubit đích?</li><li>Trong thuật toán Deutsch, bit đo được bằng biểu thức Boole nào của f(0), f(1)?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) U<sub>f</sub>|x⟩|y⟩ = |x⟩|y ⊕ 1⟩ lật qubit đích: U<sub>f</sub> = I ⊗ X, tức ghép cặp |00⟩↔|01⟩ và |10⟩↔|11⟩. 2) X|+⟩ = |+⟩ và I|+⟩ = |+⟩, nên đích không bao giờ đổi và không có pha nào xuất hiện; qubit thứ nhất giữ |+⟩, H cho |0⟩, kết quả luôn là 0 (“hằng”) — sai với f cân bằng. 3) f(0) ⊕ f(1).</p></div>`);

const c82 = L('qtc211-ts-8-2',
  '8.2 — The Deutsch–Jozsa algorithm|||8.2 — Thuật toán Deutsch–Jozsa',
  'Bài toán hằng/cân bằng với n bit, đẳng thức H^⊗n|x⟩ = 2^(−n/2) Σ (−1)^(x·z)|z⟩, biên độ của |0…0⟩ quyết định đáp án, so sánh trung thực với thuật toán cổ điển tất định và ngẫu nhiên, mô phỏng numpy n = 3.',
  `<span class="eyebrow">QTC211 · Chapter 8 · Lesson 8.2</span>
<h2>The Deutsch–Jozsa algorithm</h2>
<p class="lead">Deutsch–Jozsa (1992) generalises Deutsch's problem to functions of n bits. One quantum query replaces 2<sup>n−1</sup> + 1 deterministic classical queries — the first exponential separation, and a perfect place to learn the most-used identity in quantum algorithms: the Hadamard transform of a basis state.</p>
<h3>🎯 Objectives</h3>
<ul><li>State the Deutsch–Jozsa promise problem (constant vs balanced).</li><li>Use H<sup>⊗n</sup>|x⟩ = 2<sup>−n/2</sup> Σ<sub>z</sub> (−1)<sup>x·z</sup>|z⟩.</li><li>Show that the amplitude of |0…0⟩ is 1 for constant f and 0 for balanced f.</li><li>Compare honestly with deterministic and randomized classical algorithms.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>The problem.</strong> f: {0, 1}<sup>n</sup> → {0, 1} is <em>promised</em> to be either <strong>constant</strong> (same value on all 2<sup>n</sup> inputs) or <strong>balanced</strong> (value 0 on exactly half of the inputs and 1 on the other half). Decide which.</p>
<p><strong>The Hadamard identity.</strong> For one qubit, H|x⟩ = (|0⟩ + (−1)<sup>x</sup>|1⟩)/√2 = (1/√2) Σ<sub>z∈{0,1}</sub> (−1)<sup>xz</sup>|z⟩. Taking the tensor product over n qubits multiplies the signs, and the exponents add up to the bitwise inner product x·z = x<sub>1</sub>z<sub>1</sub> ⊕ … ⊕ x<sub>n</sub>z<sub>n</sub>:</p>
<div class="formula"><span class="lbl">Hadamard transform</span>H<sup>⊗n</sup>|x⟩ = 2<sup>−n/2</sup> Σ<sub>z ∈ {0,1}<sup>n</sup></sub> (−1)<sup>x·z</sup> |z⟩    in particular  H<sup>⊗n</sup>|0…0⟩ = uniform superposition</div>
<p><strong>The circuit</strong> (n input qubits + 1 target): start in |0…0⟩|1⟩ → H on every qubit → one query U<sub>f</sub> → H on the n input qubits → measure the inputs.</p>
<ol><li>After the first Hadamards: 2<sup>−n/2</sup> Σ<sub>x</sub> |x⟩ ⊗ |−⟩.</li><li>After the query (phase kickback): 2<sup>−n/2</sup> Σ<sub>x</sub> (−1)<sup>f(x)</sup>|x⟩ ⊗ |−⟩.</li><li>After H<sup>⊗n</sup>: Σ<sub>z</sub> [ 2<sup>−n</sup> Σ<sub>x</sub> (−1)<sup>f(x) ⊕ x·z</sup> ] |z⟩ ⊗ |−⟩.</li></ol>
<p>Look only at z = 0…0, where x·z = 0:</p>
<div class="formula"><span class="lbl">Key amplitude</span>amplitude(0…0) = 2<sup>−n</sup> Σ<sub>x</sub> (−1)<sup>f(x)</sup>  =  ±1 if f is constant,   0 if f is balanced</div>
<p>If f is constant every term has the same sign, so the sum is ±2<sup>n</sup> and the probability of measuring 0…0 is 1. If f is balanced, half the terms are +1 and half are −1: they <strong>cancel exactly</strong> and 0…0 never appears. Rule: <strong>all zeros ⇒ constant; anything else ⇒ balanced</strong>, with certainty, after one query.</p>
<p><strong>Honest comparison.</strong> A <em>deterministic</em> classical algorithm may be unlucky: it can see 2<sup>n−1</sup> equal values from a balanced f, so in the worst case it needs 2<sup>n−1</sup> + 1 queries (5 for n = 3, 513 for n = 10). But a <em>randomized</em> classical algorithm that queries k random inputs and answers “constant” if all values agree is wrong with probability at most about 2<sup>1−k</sup> (0.0625 for k = 5, under 0.002 for k = 10). So Deutsch–Jozsa is an exponential separation only against <em>exact</em> classical algorithms — it does not solve a practically hard problem. Its value is the technique: Hadamards + phase oracle + Hadamards, which reappears in Bernstein–Vazirani, Simon and Shor.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — the identity for n = 2.</b> H<sup>⊗2</sup>|11⟩ = ½(|00⟩ − |01⟩ − |10⟩ + |11⟩): the sign of |z⟩ is (−1)<sup>11·z</sup>, which is − exactly when z has one 1 (z = 01, 10) and + for z = 00 and z = 11 (two 1s, 1 ⊕ 1 = 0).</p></div>
<div class="callout"><p><b>Example 2 — a balanced function, n = 2.</b> f(x<sub>1</sub>x<sub>2</sub>) = x<sub>1</sub>: values 0, 0, 1, 1. Amplitude of |00⟩ = ¼(1 + 1 − 1 − 1) = <b>0</b>. Where did the probability go? To z = 10: amplitude ¼ Σ (−1)<sup>x<sub>1</sub> ⊕ x<sub>1</sub></sup> = ¼ · 4 = 1. The output 10 is not “random noise”; it tells you f(x) = x·10.</p></div>
<div class="callout"><p><b>Example 3 — numpy simulation, n = 3.</b> Two constant and two balanced oracles; the program prints P(measure 000).</p>
<pre><code class="language-python">import numpy as np
from functools import reduce
H = np.array([[1, 1], [1, -1]]) / np.sqrt(2)
def kron_all(ms): return reduce(np.kron, ms)
def deutsch_jozsa(f, n):
    N = 2 ** n
    U = np.zeros((2 * N, 2 * N))           # oracle U_f on n+1 qubits
    for x in range(N):
        for y in (0, 1):
            U[2 * x + (y ^ f(x)), 2 * x + y] = 1
    s = np.zeros(2 * N); s[1] = 1          # |00...0&gt;|1&gt;
    s = kron_all([H] * (n + 1)) @ s
    s = U @ s
    s = kron_all([H] * n + [np.eye(2)]) @ s
    return abs(s[0])**2 + abs(s[1])**2     # P(measure 00...0)
n = 3
print("constant f=0      :", round(deutsch_jozsa(lambda x: 0, n), 6))
print("constant f=1      :", round(deutsch_jozsa(lambda x: 1, n), 6))
print("balanced f=top bit:", round(deutsch_jozsa(lambda x: x &gt;&gt; 2, n), 6))
print("balanced parity   :", round(deutsch_jozsa(lambda x: bin(x).count("1") % 2, n), 6))</code></pre>
<div class="out">constant f=0      : 1.0
constant f=1      : 1.0
balanced f=top bit: 0.0
balanced parity   : 0.0</div></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Forgetting the promise. For a function that is neither constant nor balanced the output is meaningless (P(0…0) is some number between 0 and 1).</li><li>Saying “quantum is exponentially faster” without the qualifier <em>deterministic / exact</em>. A randomized classical algorithm with 10 queries is already 99.8% reliable.</li><li>Forgetting that x·z is computed <em>mod 2</em>: 11·11 = 1 + 1 = 0, not 2.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Promise: f constant or balanced on {0, 1}<sup>n</sup>.</li><li>H<sup>⊗n</sup>|x⟩ = 2<sup>−n/2</sup> Σ<sub>z</sub> (−1)<sup>x·z</sup>|z⟩.</li><li>Amplitude of 0…0 = 2<sup>−n</sup> Σ (−1)<sup>f(x)</sup>: ±1 (constant) or 0 (balanced).</li><li>1 quantum query vs 2<sup>n−1</sup> + 1 deterministic classical queries; randomized classical is almost as good in practice.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://github.com/Qiskit/documentation/blob/main/learning/courses/fundamentals-of-quantum-algorithms/quantum-query-algorithms/deutsch-jozsa-algorithm.ipynb" target="_blank" rel="noopener">IBM Quantum Learning (Watrous) — The Deutsch–Jozsa algorithm (source notebook)</a></li><li><a href="https://en.wikipedia.org/wiki/Deutsch%E2%80%93Jozsa_algorithm" target="_blank" rel="noopener">Wikipedia — Deutsch–Jozsa algorithm</a></li><li><a href="https://www.youtube.com/watch?v=2wticzHE1vs" target="_blank" rel="noopener">Qiskit — Quantum Query Algorithms, Lesson 05 (Watrous)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Write H<sup>⊗2</sup>|01⟩ as a sum of four basis states with signs.</li><li>For n = 3, f(x) = 1 exactly when x ∈ {001, 010, 100, 111}. Is f constant or balanced, and what is the amplitude of |000⟩ after the algorithm?</li><li>How many queries does a deterministic classical algorithm need in the worst case for n = 4?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) ½(|00⟩ − |01⟩ + |10⟩ − |11⟩) (sign − when z<sub>2</sub> = 1). 2) Four 1s and four 0s ⇒ balanced; amplitude ⅛(4 − 4) = 0 (this f is the parity x<sub>1</sub> ⊕ x<sub>2</sub> ⊕ x<sub>3</sub>, so the output is 111). 3) 2<sup>3</sup> + 1 = 9.</p></div>`,
  `<span class="eyebrow">QTC211 · Chương 8 · Bài 8.2</span>
<h2>Thuật toán Deutsch–Jozsa</h2>
<p class="lead">Deutsch–Jozsa (1992) mở rộng bài toán Deutsch cho hàm n bit. Một truy vấn lượng tử thay cho 2<sup>n−1</sup> + 1 truy vấn cổ điển tất định — tách biệt hàm mũ đầu tiên, và là chỗ lý tưởng để học đẳng thức dùng nhiều nhất trong thuật toán lượng tử: biến đổi Hadamard của một trạng thái cơ sở.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phát biểu bài toán có hứa hẹn Deutsch–Jozsa (hằng hay cân bằng).</li><li>Dùng H<sup>⊗n</sup>|x⟩ = 2<sup>−n/2</sup> Σ<sub>z</sub> (−1)<sup>x·z</sup>|z⟩.</li><li>Chứng minh biên độ của |0…0⟩ bằng 1 khi f hằng và 0 khi f cân bằng.</li><li>So sánh trung thực với thuật toán cổ điển tất định và ngẫu nhiên.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Bài toán.</strong> f: {0, 1}<sup>n</sup> → {0, 1} được <em>hứa</em> là hoặc <strong>hằng</strong> (cùng giá trị trên cả 2<sup>n</sup> đầu vào) hoặc <strong>cân bằng</strong> (bằng 0 trên đúng một nửa số đầu vào và bằng 1 trên nửa còn lại). Hãy quyết định loại nào.</p>
<p><strong>Đẳng thức Hadamard.</strong> Với một qubit, H|x⟩ = (|0⟩ + (−1)<sup>x</sup>|1⟩)/√2 = (1/√2) Σ<sub>z∈{0,1}</sub> (−1)<sup>xz</sup>|z⟩. Lấy tích tensor qua n qubit thì các dấu nhân nhau, số mũ cộng lại thành tích trong theo bit x·z = x<sub>1</sub>z<sub>1</sub> ⊕ … ⊕ x<sub>n</sub>z<sub>n</sub>:</p>
<div class="formula"><span class="lbl">Biến đổi Hadamard</span>H<sup>⊗n</sup>|x⟩ = 2<sup>−n/2</sup> Σ<sub>z ∈ {0,1}<sup>n</sup></sub> (−1)<sup>x·z</sup> |z⟩    riêng  H<sup>⊗n</sup>|0…0⟩ = chồng chập đều</div>
<p><strong>Mạch</strong> (n qubit đầu vào + 1 qubit đích): bắt đầu ở |0…0⟩|1⟩ → H lên mọi qubit → một truy vấn U<sub>f</sub> → H lên n qubit đầu vào → đo các qubit đầu vào.</p>
<ol><li>Sau lớp Hadamard đầu: 2<sup>−n/2</sup> Σ<sub>x</sub> |x⟩ ⊗ |−⟩.</li><li>Sau truy vấn (phase kickback): 2<sup>−n/2</sup> Σ<sub>x</sub> (−1)<sup>f(x)</sup>|x⟩ ⊗ |−⟩.</li><li>Sau H<sup>⊗n</sup>: Σ<sub>z</sub> [ 2<sup>−n</sup> Σ<sub>x</sub> (−1)<sup>f(x) ⊕ x·z</sup> ] |z⟩ ⊗ |−⟩.</li></ol>
<p>Chỉ nhìn z = 0…0, khi đó x·z = 0:</p>
<div class="formula"><span class="lbl">Biên độ then chốt</span>biên độ(0…0) = 2<sup>−n</sup> Σ<sub>x</sub> (−1)<sup>f(x)</sup>  =  ±1 nếu f hằng,   0 nếu f cân bằng</div>
<p>Nếu f hằng, mọi số hạng cùng dấu, tổng là ±2<sup>n</sup> và xác suất đo được 0…0 bằng 1. Nếu f cân bằng, một nửa số hạng là +1 và nửa kia là −1: chúng <strong>triệt tiêu hoàn toàn</strong> và 0…0 không bao giờ xuất hiện. Quy tắc: <strong>toàn số 0 ⇒ hằng; khác đi ⇒ cân bằng</strong>, chắc chắn, sau một truy vấn.</p>
<p><strong>So sánh trung thực.</strong> Thuật toán cổ điển <em>tất định</em> có thể xui: nó có thể thấy 2<sup>n−1</sup> giá trị bằng nhau từ một f cân bằng, nên trường hợp xấu nhất cần 2<sup>n−1</sup> + 1 truy vấn (5 với n = 3, 513 với n = 10). Nhưng thuật toán cổ điển <em>ngẫu nhiên</em> truy vấn k đầu vào ngẫu nhiên và trả lời “hằng” nếu mọi giá trị trùng nhau thì sai với xác suất nhiều nhất khoảng 2<sup>1−k</sup> (0,0625 với k = 5, dưới 0,002 với k = 10). Vì vậy Deutsch–Jozsa là tách biệt hàm mũ chỉ so với thuật toán cổ điển <em>chính xác</em> — nó không giải một bài toán khó trong thực tế. Giá trị của nó là kỹ thuật: Hadamard + oracle pha + Hadamard, sẽ xuất hiện lại trong Bernstein–Vazirani, Simon và Shor.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — đẳng thức với n = 2.</b> H<sup>⊗2</sup>|11⟩ = ½(|00⟩ − |01⟩ − |10⟩ + |11⟩): dấu của |z⟩ là (−1)<sup>11·z</sup>, mang dấu − đúng khi z có một bit 1 (z = 01, 10) và dấu + với z = 00 và z = 11 (hai bit 1, 1 ⊕ 1 = 0).</p></div>
<div class="callout"><p><b>Ví dụ 2 — một hàm cân bằng, n = 2.</b> f(x<sub>1</sub>x<sub>2</sub>) = x<sub>1</sub>: các giá trị 0, 0, 1, 1. Biên độ của |00⟩ = ¼(1 + 1 − 1 − 1) = <b>0</b>. Xác suất đi đâu? Sang z = 10: biên độ ¼ Σ (−1)<sup>x<sub>1</sub> ⊕ x<sub>1</sub></sup> = ¼ · 4 = 1. Kết quả 10 không phải “nhiễu ngẫu nhiên”; nó cho biết f(x) = x·10.</p></div>
<div class="callout"><p><b>Ví dụ 3 — mô phỏng numpy, n = 3.</b> Hai oracle hằng và hai oracle cân bằng; chương trình in P(đo được 000).</p>
<pre><code class="language-python">import numpy as np
from functools import reduce
H = np.array([[1, 1], [1, -1]]) / np.sqrt(2)
def kron_all(ms): return reduce(np.kron, ms)
def deutsch_jozsa(f, n):
    N = 2 ** n
    U = np.zeros((2 * N, 2 * N))           # oracle U_f on n+1 qubits
    for x in range(N):
        for y in (0, 1):
            U[2 * x + (y ^ f(x)), 2 * x + y] = 1
    s = np.zeros(2 * N); s[1] = 1          # |00...0&gt;|1&gt;
    s = kron_all([H] * (n + 1)) @ s
    s = U @ s
    s = kron_all([H] * n + [np.eye(2)]) @ s
    return abs(s[0])**2 + abs(s[1])**2     # P(measure 00...0)
n = 3
print("constant f=0      :", round(deutsch_jozsa(lambda x: 0, n), 6))
print("constant f=1      :", round(deutsch_jozsa(lambda x: 1, n), 6))
print("balanced f=top bit:", round(deutsch_jozsa(lambda x: x &gt;&gt; 2, n), 6))
print("balanced parity   :", round(deutsch_jozsa(lambda x: bin(x).count("1") % 2, n), 6))</code></pre>
<div class="out">constant f=0      : 1.0
constant f=1      : 1.0
balanced f=top bit: 0.0
balanced parity   : 0.0</div></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Quên lời hứa. Với hàm không hằng cũng không cân bằng, kết quả vô nghĩa (P(0…0) là một số nào đó giữa 0 và 1).</li><li>Nói “lượng tử nhanh hơn theo hàm mũ” mà bỏ mất điều kiện <em>tất định / chính xác</em>. Thuật toán cổ điển ngẫu nhiên với 10 truy vấn đã tin cậy 99,8%.</li><li>Quên rằng x·z tính <em>modulo 2</em>: 11·11 = 1 + 1 = 0, không phải 2.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Lời hứa: f hằng hoặc cân bằng trên {0, 1}<sup>n</sup>.</li><li>H<sup>⊗n</sup>|x⟩ = 2<sup>−n/2</sup> Σ<sub>z</sub> (−1)<sup>x·z</sup>|z⟩.</li><li>Biên độ của 0…0 = 2<sup>−n</sup> Σ (−1)<sup>f(x)</sup>: ±1 (hằng) hoặc 0 (cân bằng).</li><li>1 truy vấn lượng tử so với 2<sup>n−1</sup> + 1 truy vấn cổ điển tất định; cổ điển ngẫu nhiên gần như tốt bằng trong thực tế.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://github.com/Qiskit/documentation/blob/main/learning/courses/fundamentals-of-quantum-algorithms/quantum-query-algorithms/deutsch-jozsa-algorithm.ipynb" target="_blank" rel="noopener">IBM Quantum Learning (Watrous) — Thuật toán Deutsch–Jozsa (notebook gốc)</a></li><li><a href="https://en.wikipedia.org/wiki/Deutsch%E2%80%93Jozsa_algorithm" target="_blank" rel="noopener">Wikipedia — Thuật toán Deutsch–Jozsa</a></li><li><a href="https://www.youtube.com/watch?v=2wticzHE1vs" target="_blank" rel="noopener">Qiskit — Quantum Query Algorithms, Lesson 05 (Watrous)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Viết H<sup>⊗2</sup>|01⟩ thành tổng bốn trạng thái cơ sở có dấu.</li><li>Với n = 3, f(x) = 1 đúng khi x ∈ {001, 010, 100, 111}. f hằng hay cân bằng, và biên độ của |000⟩ sau thuật toán là bao nhiêu?</li><li>Thuật toán cổ điển tất định cần bao nhiêu truy vấn trong trường hợp xấu nhất với n = 4?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) ½(|00⟩ − |01⟩ + |10⟩ − |11⟩) (dấu − khi z<sub>2</sub> = 1). 2) Bốn giá trị 1 và bốn giá trị 0 ⇒ cân bằng; biên độ ⅛(4 − 4) = 0 (f này là hàm chẵn lẻ x<sub>1</sub> ⊕ x<sub>2</sub> ⊕ x<sub>3</sub>, nên kết quả đo là 111). 3) 2<sup>3</sup> + 1 = 9.</p></div>`);

const c83 = L('qtc211-ts-8-3',
  '8.3 — Bernstein–Vazirani and a glance at Simon’s problem|||8.3 — Bernstein–Vazirani và cái nhìn qua bài toán Simon',
  'Tìm chuỗi bí mật s của f(x) = s·x mod 2 bằng MỘT truy vấn (cổ điển cần n), mạch giống hệt Deutsch–Jozsa, mô phỏng numpy s = 1011; bài toán Simon: tách biệt hàm mũ cả với thuật toán ngẫu nhiên, cầu nối sang Shor.',
  `<span class="eyebrow">QTC211 · Chapter 8 · Lesson 8.3</span>
<h2>Bernstein–Vazirani and a glance at Simon's problem</h2>
<p class="lead">Run the Deutsch–Jozsa circuit on a different promise and it outputs a whole hidden string at once. Bernstein–Vazirani shows that one quantum query can extract n bits that need n classical queries; Simon's problem then pushes the gap to exponential even against randomized algorithms.</p>
<h3>🎯 Objectives</h3>
<ul><li>State the Bernstein–Vazirani problem f(x) = s·x mod 2.</li><li>Show that the Deutsch–Jozsa circuit outputs s with certainty after one query.</li><li>Explain why any classical algorithm needs n queries.</li><li>Describe Simon's problem and why it matters for Shor's algorithm.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>The problem.</strong> A hidden string s ∈ {0, 1}<sup>n</sup> defines f(x) = s·x = s<sub>1</sub>x<sub>1</sub> ⊕ … ⊕ s<sub>n</sub>x<sub>n</sub> (the parity of the bits of x selected by s). Given f as an oracle, find s.</p>
<p><strong>Classically</strong>, each query returns one bit, and s has n unknown bits, so at least n queries are needed (even with randomness). n queries suffice: query x = 100…0 to get s<sub>1</sub>, x = 010…0 to get s<sub>2</sub>, and so on.</p>
<p><strong>Quantumly</strong>, use exactly the Deutsch–Jozsa circuit. After the query and phase kickback the input register holds 2<sup>−n/2</sup> Σ<sub>x</sub> (−1)<sup>s·x</sup>|x⟩ — but by the Hadamard identity of Lesson 8.2 that is precisely H<sup>⊗n</sup>|s⟩. Since H<sup>⊗n</sup> is its own inverse, the final Hadamards give:</p>
<div class="formula"><span class="lbl">Bernstein–Vazirani</span>H<sup>⊗n</sup> · 2<sup>−n/2</sup> Σ<sub>x</sub> (−1)<sup>s·x</sup> |x⟩ = H<sup>⊗n</sup> H<sup>⊗n</sup> |s⟩ = |s⟩    ⇒  measuring gives s with probability 1</div>
<p>One query versus n: a <strong>polynomial</strong> (linear) separation that holds against randomized algorithms too. Bernstein and Vazirani (1993) used a recursive version of this problem to give early evidence that quantum computers can be super-polynomially faster than classical ones.</p>
<p><strong>A glance at Simon's problem (1994).</strong> Now f: {0, 1}<sup>n</sup> → {0, 1}<sup>n</sup> is promised to satisfy f(x) = f(y) exactly when y = x or y = x ⊕ s for a hidden s ≠ 0…0 (f is “two-to-one with period s under XOR”). Classically, finding s needs on the order of 2<sup>n/2</sup> queries even with randomness (you must find a collision, a birthday-paradox search). Simon's quantum algorithm uses Hadamards, one query and Hadamards again; each run returns a random z with z·s = 0. About n runs give n − 1 independent linear equations mod 2, which classical Gaussian elimination solves for s. Total: O(n) queries plus polynomial classical work — an <strong>exponential</strong> separation even against randomized algorithms. Shor read Simon's paper and replaced “period under XOR” with “period under addition”, which is order finding (Lesson 9.3).</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — classical decoding for s = 1011.</b> f(1000) = 1, f(0100) = 0, f(0010) = 1, f(0001) = 1: four queries, four bits, s = 1011. Each query gives one bit, so fewer than four queries cannot distinguish the 16 possible strings.</p></div>
<div class="callout"><p><b>Example 2 — the quantum state, n = 2, s = 10.</b> f(x) = x<sub>1</sub>. After the query the inputs hold ½(|00⟩ + |01⟩ − |10⟩ − |11⟩) = |−⟩|+⟩ = H|1⟩ ⊗ H|0⟩. Applying H ⊗ H gives |1⟩|0⟩ = |10⟩ = s. Notice this is Example 2 of Lesson 8.2: a balanced f of the form s·x always reveals s.</p></div>
<div class="callout"><p><b>Example 3 — numpy simulation.</b> One query recovers the secret string.</p>
<pre><code class="language-python">import numpy as np
from functools import reduce
H = np.array([[1, 1], [1, -1]]) / np.sqrt(2)
def bernstein_vazirani(secret):
    n, sv = len(secret), int(secret, 2)
    f = lambda x: bin(x &amp; sv).count("1") % 2      # f(x) = s.x mod 2
    N = 2 ** n
    U = np.zeros((2 * N, 2 * N))
    for x in range(N):
        for y in (0, 1):
            U[2 * x + (y ^ f(x)), 2 * x + y] = 1
    s = np.zeros(2 * N); s[1] = 1                   # |0000&gt;|1&gt;
    s = reduce(np.kron, [H] * (n + 1)) @ s
    s = U @ s                                       # ONE query
    s = reduce(np.kron, [H] * n + [np.eye(2)]) @ s
    probs = [abs(s[2 * x])**2 + abs(s[2 * x + 1])**2 for x in range(N)]
    best = int(np.argmax(probs))
    return format(best, "0" + str(n) + "b"), float(round(probs[best], 6))
print(bernstein_vazirani("1011"))
print(bernstein_vazirani("110"))</code></pre>
<div class="out">('1011', 1.0)
('110', 1.0)</div></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Thinking Bernstein–Vazirani gives an exponential speed-up. It is n queries versus 1 — linear. The exponential separation in this chapter is Simon's.</li><li>Reading the output in the wrong bit order. With our convention qubit 0 is the leftmost bit of s; Qiskit prints qubit 0 on the right, so the same circuit shows the reversed string there.</li><li>Believing the quantum algorithm “evaluates f on all 2<sup>n</sup> inputs and reads the table”. It reads one string, s, chosen by interference.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Bernstein–Vazirani: f(x) = s·x mod 2; same circuit as Deutsch–Jozsa.</li><li>2<sup>−n/2</sup> Σ (−1)<sup>s·x</sup>|x⟩ = H<sup>⊗n</sup>|s⟩, so one query + Hadamards outputs s.</li><li>Classical needs n queries (one bit of information per query).</li><li>Simon: period s under XOR; O(n) quantum queries vs about 2<sup>n/2</sup> classical — exponential, and the direct ancestor of Shor.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Bernstein%E2%80%93Vazirani_algorithm" target="_blank" rel="noopener">Wikipedia — Bernstein–Vazirani algorithm</a></li><li><a href="https://github.com/Qiskit/documentation/blob/main/learning/courses/fundamentals-of-quantum-algorithms/quantum-query-algorithms/simon-algorithm.ipynb" target="_blank" rel="noopener">IBM Quantum Learning (Watrous) — Simon's algorithm (source notebook)</a></li><li><a href="https://en.wikipedia.org/wiki/Simon%27s_problem" target="_blank" rel="noopener">Wikipedia — Simon's problem</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>For n = 3 and s = 101, compute f(110) and f(111).</li><li>Which output does the Bernstein–Vazirani circuit give for s = 0…0, and how does that connect to Deutsch–Jozsa?</li><li>In Simon's algorithm with n = 3 and s = 110, which of z = 001, 110, 101 can appear as an output?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) f(110) = 1·1 ⊕ 0·1 ⊕ 1·0 = 1; f(111) = 1 ⊕ 0 ⊕ 1 = 0. 2) 0…0: f = 0 is constant, and Deutsch–Jozsa outputs all zeros exactly for constant functions. 3) Need z·s = 0: 001·110 = 0 ✓, 110·110 = 1 ⊕ 1 = 0 ✓, 101·110 = 1 ✗. So 001 and 110 can appear, 101 cannot.</p></div>`,
  `<span class="eyebrow">QTC211 · Chương 8 · Bài 8.3</span>
<h2>Bernstein–Vazirani và cái nhìn qua bài toán Simon</h2>
<p class="lead">Chạy mạch Deutsch–Jozsa với một lời hứa khác, nó xuất ra trọn một chuỗi ẩn cùng lúc. Bernstein–Vazirani cho thấy một truy vấn lượng tử rút được n bit mà cổ điển cần n truy vấn; bài toán Simon sau đó đẩy khoảng cách lên hàm mũ, kể cả so với thuật toán ngẫu nhiên.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phát biểu bài toán Bernstein–Vazirani f(x) = s·x mod 2.</li><li>Chứng minh mạch Deutsch–Jozsa xuất ra s chắc chắn sau một truy vấn.</li><li>Giải thích vì sao mọi thuật toán cổ điển cần n truy vấn.</li><li>Mô tả bài toán Simon và vì sao nó quan trọng với thuật toán Shor.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Bài toán.</strong> Một chuỗi ẩn s ∈ {0, 1}<sup>n</sup> xác định f(x) = s·x = s<sub>1</sub>x<sub>1</sub> ⊕ … ⊕ s<sub>n</sub>x<sub>n</sub> (tính chẵn lẻ của các bit của x được s chọn). Cho f dưới dạng oracle, hãy tìm s.</p>
<p><strong>Cổ điển</strong>, mỗi truy vấn trả về một bit, còn s có n bit chưa biết, nên cần ít nhất n truy vấn (kể cả dùng ngẫu nhiên). n truy vấn là đủ: hỏi x = 100…0 để được s<sub>1</sub>, x = 010…0 để được s<sub>2</sub>, cứ thế.</p>
<p><strong>Lượng tử</strong>, dùng đúng mạch Deutsch–Jozsa. Sau truy vấn và phase kickback, thanh ghi đầu vào giữ 2<sup>−n/2</sup> Σ<sub>x</sub> (−1)<sup>s·x</sup>|x⟩ — mà theo đẳng thức Hadamard ở Bài 8.2, đó chính là H<sup>⊗n</sup>|s⟩. Vì H<sup>⊗n</sup> là nghịch đảo của chính nó, lớp Hadamard cuối cho:</p>
<div class="formula"><span class="lbl">Bernstein–Vazirani</span>H<sup>⊗n</sup> · 2<sup>−n/2</sup> Σ<sub>x</sub> (−1)<sup>s·x</sup> |x⟩ = H<sup>⊗n</sup> H<sup>⊗n</sup> |s⟩ = |s⟩    ⇒  đo được s với xác suất 1</div>
<p>Một truy vấn so với n: tách biệt <strong>đa thức</strong> (tuyến tính), đúng cả khi so với thuật toán ngẫu nhiên. Bernstein và Vazirani (1993) dùng một phiên bản đệ quy của bài toán này để đưa ra bằng chứng sớm rằng máy lượng tử có thể nhanh hơn máy cổ điển vượt mức đa thức.</p>
<p><strong>Nhìn qua bài toán Simon (1994).</strong> Giờ f: {0, 1}<sup>n</sup> → {0, 1}<sup>n</sup> được hứa thoả f(x) = f(y) đúng khi y = x hoặc y = x ⊕ s với một s ≠ 0…0 ẩn (f là “hai-một, có chu kỳ s theo phép XOR”). Cổ điển, tìm s cần cỡ 2<sup>n/2</sup> truy vấn kể cả dùng ngẫu nhiên (phải tìm được một va chạm, kiểu nghịch lý ngày sinh). Thuật toán lượng tử của Simon dùng Hadamard, một truy vấn rồi Hadamard; mỗi lần chạy trả về một z ngẫu nhiên thoả z·s = 0. Khoảng n lần chạy cho n − 1 phương trình tuyến tính độc lập modulo 2, khử Gauss cổ điển giải ra s. Tổng: O(n) truy vấn cộng phần việc cổ điển đa thức — tách biệt <strong>hàm mũ</strong>, kể cả so với thuật toán ngẫu nhiên. Shor đọc bài báo của Simon và thay “chu kỳ theo XOR” bằng “chu kỳ theo phép cộng”, tức bài toán tìm cấp (Bài 9.3).</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — giải mã cổ điển với s = 1011.</b> f(1000) = 1, f(0100) = 0, f(0010) = 1, f(0001) = 1: bốn truy vấn, bốn bit, s = 1011. Mỗi truy vấn cho một bit, nên ít hơn bốn truy vấn không thể phân biệt 16 chuỗi có thể.</p></div>
<div class="callout"><p><b>Ví dụ 2 — trạng thái lượng tử, n = 2, s = 10.</b> f(x) = x<sub>1</sub>. Sau truy vấn, thanh ghi đầu vào là ½(|00⟩ + |01⟩ − |10⟩ − |11⟩) = |−⟩|+⟩ = H|1⟩ ⊗ H|0⟩. Áp H ⊗ H được |1⟩|0⟩ = |10⟩ = s. Đây chính là Ví dụ 2 của Bài 8.2: hàm cân bằng dạng s·x luôn để lộ s.</p></div>
<div class="callout"><p><b>Ví dụ 3 — mô phỏng numpy.</b> Một truy vấn lấy lại chuỗi bí mật.</p>
<pre><code class="language-python">import numpy as np
from functools import reduce
H = np.array([[1, 1], [1, -1]]) / np.sqrt(2)
def bernstein_vazirani(secret):
    n, sv = len(secret), int(secret, 2)
    f = lambda x: bin(x &amp; sv).count("1") % 2      # f(x) = s.x mod 2
    N = 2 ** n
    U = np.zeros((2 * N, 2 * N))
    for x in range(N):
        for y in (0, 1):
            U[2 * x + (y ^ f(x)), 2 * x + y] = 1
    s = np.zeros(2 * N); s[1] = 1                   # |0000&gt;|1&gt;
    s = reduce(np.kron, [H] * (n + 1)) @ s
    s = U @ s                                       # ONE query
    s = reduce(np.kron, [H] * n + [np.eye(2)]) @ s
    probs = [abs(s[2 * x])**2 + abs(s[2 * x + 1])**2 for x in range(N)]
    best = int(np.argmax(probs))
    return format(best, "0" + str(n) + "b"), float(round(probs[best], 6))
print(bernstein_vazirani("1011"))
print(bernstein_vazirani("110"))</code></pre>
<div class="out">('1011', 1.0)
('110', 1.0)</div></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Tưởng Bernstein–Vazirani tăng tốc hàm mũ. Nó là n truy vấn so với 1 — tuyến tính. Tách biệt hàm mũ trong chương này là của Simon.</li><li>Đọc kết quả sai thứ tự bit. Theo quy ước của khoá, qubit 0 là bit trái nhất của s; Qiskit in qubit 0 ở bên phải, nên cùng mạch đó hiện chuỗi đảo ngược.</li><li>Tin rằng thuật toán lượng tử “tính f trên cả 2<sup>n</sup> đầu vào rồi đọc bảng”. Nó chỉ đọc được một chuỗi, s, do giao thoa chọn ra.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Bernstein–Vazirani: f(x) = s·x mod 2; cùng mạch với Deutsch–Jozsa.</li><li>2<sup>−n/2</sup> Σ (−1)<sup>s·x</sup>|x⟩ = H<sup>⊗n</sup>|s⟩, nên một truy vấn + Hadamard xuất ra s.</li><li>Cổ điển cần n truy vấn (mỗi truy vấn một bit thông tin).</li><li>Simon: chu kỳ s theo XOR; O(n) truy vấn lượng tử so với khoảng 2<sup>n/2</sup> cổ điển — hàm mũ, và là tổ tiên trực tiếp của Shor.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Bernstein%E2%80%93Vazirani_algorithm" target="_blank" rel="noopener">Wikipedia — Thuật toán Bernstein–Vazirani</a></li><li><a href="https://github.com/Qiskit/documentation/blob/main/learning/courses/fundamentals-of-quantum-algorithms/quantum-query-algorithms/simon-algorithm.ipynb" target="_blank" rel="noopener">IBM Quantum Learning (Watrous) — Thuật toán Simon (notebook gốc)</a></li><li><a href="https://en.wikipedia.org/wiki/Simon%27s_problem" target="_blank" rel="noopener">Wikipedia — Bài toán Simon</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Với n = 3 và s = 101, tính f(110) và f(111).</li><li>Mạch Bernstein–Vazirani cho kết quả gì với s = 0…0, và điều đó liên hệ thế nào với Deutsch–Jozsa?</li><li>Trong thuật toán Simon với n = 3 và s = 110, những z nào trong 001, 110, 101 có thể xuất hiện?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) f(110) = 1·1 ⊕ 0·1 ⊕ 1·0 = 1; f(111) = 1 ⊕ 0 ⊕ 1 = 0. 2) 0…0: f = 0 là hàm hằng, và Deutsch–Jozsa xuất toàn số 0 đúng với hàm hằng. 3) Cần z·s = 0: 001·110 = 0 ✓, 110·110 = 1 ⊕ 1 = 0 ✓, 101·110 = 1 ✗. Vậy 001 và 110 có thể xuất hiện, 101 thì không.</p></div>`);

const q8 = QZ(8, 'Quiz — Chapter 8: Query algorithms|||Quiz — Chương 8: Thuật toán truy vấn', 'Kiểm tra chương 8: oracle U_f, phase kickback, Deutsch, Deutsch–Jozsa, đẳng thức Hadamard, Bernstein–Vazirani, Simon, so sánh cổ điển.', [
  Q('q1', 'The standard quantum oracle for f acts as|||Oracle lượng tử chuẩn của f tác động theo',
    ['U_f|x⟩ = |f(x)⟩|||U_f|x⟩ = |f(x)⟩', 'U_f|x⟩|y⟩ = |x⟩|y ⊕ f(x)⟩|||U_f|x⟩|y⟩ = |x⟩|y ⊕ f(x)⟩', 'U_f|x⟩|y⟩ = |f(x)⟩|f(y)⟩|||U_f|x⟩|y⟩ = |f(x)⟩|f(y)⟩', 'U_f|x⟩|y⟩ = |x ⊕ y⟩|f(x)⟩|||U_f|x⟩|y⟩ = |x ⊕ y⟩|f(x)⟩'], 1,
    'XOR into a target keeps the map reversible (U_f² = I).|||XOR vào qubit đích giữ ánh xạ khả nghịch (U_f² = I).'),
  Q('q2', 'With the target in |−⟩, U_f|x⟩|−⟩ equals|||Khi đích ở |−⟩, U_f|x⟩|−⟩ bằng',
    ['|x⟩|f(x)⟩||||x⟩|f(x)⟩', '(−1)^f(x) |x⟩|−⟩|||(−1)^f(x) |x⟩|−⟩', '|x⟩|+⟩||||x⟩|+⟩', 'f(x)|x⟩|−⟩|||f(x)|x⟩|−⟩'], 1,
    'Phase kickback: |−⟩ is an eigenvector of X with eigenvalue −1.|||Phase kickback: |−⟩ là vectơ riêng của X với trị riêng −1.'),
  Q('q3', 'How many queries does Deutsch’s algorithm use, versus a classical algorithm?|||Thuật toán Deutsch dùng bao nhiêu truy vấn, so với thuật toán cổ điển?',
    ['0 vs 1|||0 so với 1', '1 vs 4|||1 so với 4', '2 vs 2|||2 so với 2', '1 vs 2|||1 so với 2'], 3,
    'Classically you need f(0) and f(1); quantumly one query gives f(0) ⊕ f(1).|||Cổ điển cần f(0) và f(1); lượng tử một truy vấn cho f(0) ⊕ f(1).'),
  Q('q4', 'In Deutsch’s algorithm with f(x) = x, the measured bit is|||Trong thuật toán Deutsch với f(x) = x, bit đo được là',
    ['0 with certainty|||0 chắc chắn', '0 or 1 with probability 1/2 each|||0 hoặc 1, mỗi giá trị xác suất 1/2', '1 with certainty|||1 chắc chắn', 'undefined|||không xác định'], 2,
    'f is balanced: f(0) ⊕ f(1) = 1.|||f cân bằng: f(0) ⊕ f(1) = 1.'),
  Q('q5', 'H⊗H|11⟩ equals|||H⊗H|11⟩ bằng',
    ['½(|00⟩ + |01⟩ + |10⟩ + |11⟩)|||½(|00⟩ + |01⟩ + |10⟩ + |11⟩)', '½(|00⟩ − |01⟩ − |10⟩ + |11⟩)|||½(|00⟩ − |01⟩ − |10⟩ + |11⟩)', '½(|00⟩ − |01⟩ + |10⟩ − |11⟩)|||½(|00⟩ − |01⟩ + |10⟩ − |11⟩)', '|00⟩||||00⟩'], 1,
    'Sign (−1)^(11·z): minus when z has exactly one 1.|||Dấu (−1)^(11·z): trừ khi z có đúng một bit 1.'),
  Q('q6', 'In Deutsch–Jozsa, the amplitude of |0…0⟩ at the end is|||Trong Deutsch–Jozsa, biên độ cuối của |0…0⟩ là',
    ['2^(−n) Σ_x (−1)^f(x)|||2^(−n) Σ_x (−1)^f(x)', '2^(−n/2) Σ_x f(x)|||2^(−n/2) Σ_x f(x)', 'always 1/2|||luôn bằng 1/2', 'f(0…0)|||f(0…0)'], 0,
    'It is ±1 for constant f and 0 for balanced f.|||Nó bằng ±1 khi f hằng và 0 khi f cân bằng.'),
  Q('q7', 'A deterministic classical algorithm for Deutsch–Jozsa with n = 5 needs in the worst case|||Thuật toán cổ điển tất định cho Deutsch–Jozsa với n = 5 cần, trong trường hợp xấu nhất,',
    ['5 queries|||5 truy vấn', '16 queries|||16 truy vấn', '17 queries|||17 truy vấn', '32 queries|||32 truy vấn'], 2,
    '2^(n−1) + 1 = 16 + 1 = 17.|||2^(n−1) + 1 = 16 + 1 = 17.'),
  Q('q8', 'Which statement about Deutsch–Jozsa is honest?|||Phát biểu nào về Deutsch–Jozsa là trung thực?',
    ['It gives an exponential speed-up over every classical algorithm|||Nó tăng tốc hàm mũ so với mọi thuật toán cổ điển', 'A randomized classical algorithm with a few queries is wrong only with small probability|||Thuật toán cổ điển ngẫu nhiên với vài truy vấn chỉ sai với xác suất nhỏ', 'It reads all values f(x) at once|||Nó đọc mọi giá trị f(x) cùng lúc', 'It works for any function f|||Nó đúng với mọi hàm f'], 1,
    'k random queries: error at most about 2^(1−k). The separation is against exact algorithms.|||k truy vấn ngẫu nhiên: sai nhiều nhất khoảng 2^(1−k). Tách biệt là so với thuật toán chính xác.'),
  Q('q9', 'For f(x) = s·x mod 2 with s = 1011, the Bernstein–Vazirani circuit outputs|||Với f(x) = s·x mod 2 và s = 1011, mạch Bernstein–Vazirani cho ra',
    ['0000|||0000', 'a random string|||một chuỗi ngẫu nhiên', '1111|||1111', '1011 with certainty|||1011 chắc chắn'], 3,
    'After the query the register is H^⊗n|s⟩; the final Hadamards return |s⟩.|||Sau truy vấn thanh ghi là H^⊗n|s⟩; lớp Hadamard cuối trả về |s⟩.'),
  Q('q10', 'Simon’s problem is important because|||Bài toán Simon quan trọng vì',
    ['it gives an exponential separation even against randomized classical algorithms and inspired Shor|||nó tách biệt hàm mũ kể cả so với thuật toán cổ điển ngẫu nhiên và gợi ý cho Shor', 'it needs no oracle|||nó không cần oracle', 'it factors RSA integers directly|||nó phân tích thẳng số RSA', 'it runs on one qubit|||nó chạy trên một qubit'], 0,
    'O(n) quantum queries vs about 2^(n/2) classical; period under XOR → period under addition (Shor).|||O(n) truy vấn lượng tử so với khoảng 2^(n/2) cổ điển; chu kỳ theo XOR → chu kỳ theo phép cộng (Shor).'),
]);

const ch8 = {
  title: 'Chapter 8 — Query algorithms: Deutsch, Deutsch–Jozsa, Bernstein–Vazirani|||Chương 8 — Thuật toán truy vấn: Deutsch, Deutsch–Jozsa, Bernstein–Vazirani',
  description: 'Mô hình truy vấn, oracle U_f và phase kickback, thuật toán Deutsch, Deutsch–Jozsa (đẳng thức Hadamard, so sánh trung thực với cổ điển), Bernstein–Vazirani và bài toán Simon, có mô phỏng numpy chạy thật (Nielsen & Chuang 1.4 · Mermin ch.2 · Watrous Lesson 5).',
  lessons: [c81, c82, c83, q8],
};

// ───────────────────────────── Chương 9 — Grover, QFT, Shor ─────────────────────────────
const c91 = L('qtc211-ts-9-1',
  '9.1 — Grover’s search algorithm: amplitude amplification|||9.1 — Thuật toán tìm kiếm Grover: khuếch đại biên độ',
  'Tìm kiếm không cấu trúc trong N phần tử: oracle pha, phép khuếch tán 2|s⟩⟨s| − I, hình học phép quay góc 2θ với sin θ = 1/√N, xác suất sin²((2k+1)θ), số lần lặp tối ưu ≈ (π/4)√N, quá đà, mô phỏng numpy N = 8; tăng tốc bậc hai chứ không phải hàm mũ.',
  `<span class="eyebrow">QTC211 · Chapter 9 · Lesson 9.1</span>
<h2>Grover's search algorithm: amplitude amplification</h2>
<p class="lead">Given N items and a test that recognises the one you want, a classical computer needs about N/2 tests on average. Grover's algorithm (1996) needs about (π/4)√N. The speed-up is “only” quadratic, but it applies to almost any search problem, and its geometry is beautiful.</p>
<h3>🎯 Objectives</h3>
<ul><li>Write the phase oracle and the diffusion operator 2|s⟩⟨s| − I.</li><li>Explain one Grover iteration as a rotation by 2θ in a plane, with sin θ = 1/√N.</li><li>Compute the success probability sin<sup>2</sup>((2k + 1)θ) and the optimal number of iterations.</li><li>Explain why too many iterations make the result worse, and why the speed-up is quadratic.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>Unstructured search.</strong> Items are labelled x = 0, …, N − 1 with N = 2<sup>n</sup>. A function f(x) = 1 for exactly one marked item w and 0 otherwise is given as an oracle. Find w. Classically, with no structure to exploit, you test items one by one: about N/2 queries on average, N − 1 in the worst case.</p>
<p><strong>The two reflections.</strong> Start in the uniform superposition |s⟩ = H<sup>⊗n</sup>|0…0⟩ = N<sup>−1/2</sup> Σ<sub>x</sub>|x⟩. One <strong>Grover iteration</strong> G applies two operators:</p>
<div class="formula"><span class="lbl">Grover iteration</span>O|x⟩ = (−1)<sup>f(x)</sup>|x⟩  (phase oracle, from phase kickback)    D = 2|s⟩⟨s| − I  (diffusion)    G = D·O</div>
<p>O flips the sign of the marked amplitude. D is “inversion about the mean”: each amplitude a<sub>x</sub> becomes 2ā − a<sub>x</sub>, where ā is the average amplitude. After O the marked amplitude is negative, which pulls the mean down slightly, so the inversion makes the marked amplitude large and positive while every other amplitude shrinks a little. In circuits, D = H<sup>⊗n</sup>(2|0…0⟩⟨0…0| − I)H<sup>⊗n</sup>.</p>
<p><strong>The geometry.</strong> Everything happens in the plane spanned by |w⟩ and |w<sup>⊥</sup>⟩ (the uniform superposition of the unmarked items). Write |s⟩ = sin θ |w⟩ + cos θ |w<sup>⊥</sup>⟩ with <strong>sin θ = 1/√N</strong>. O is a reflection about |w<sup>⊥</sup>⟩ and D a reflection about |s⟩; two reflections make a <strong>rotation by 2θ</strong> towards |w⟩. After k iterations the angle from |w<sup>⊥</sup>⟩ is (2k + 1)θ, so</p>
<div class="formula"><span class="lbl">Success probability</span>P<sub>k</sub> = sin<sup>2</sup>((2k + 1)θ),   sin θ = 1/√N    optimal k ≈ π/(4θ) − 1/2 ≈ (π/4)√N</div>
<p>Rotating past |w⟩ <strong>overshoots</strong>: the probability then falls again. Grover is not “the more iterations the better”; you must stop at the right k (if the number of marked items is unknown, there are variants that guess k randomly). With M marked items, sin θ = √(M/N) and k ≈ (π/4)√(N/M).</p>
<p><strong>How big is the speed-up?</strong> Quadratic: √N instead of N. For N = 2<sup>20</sup> ≈ 10<sup>6</sup>, Grover needs 804 iterations against about 524 288 classical tests on average. This is proven optimal (no quantum algorithm can do unstructured search in fewer than order √N queries), so quantum computers will <em>not</em> solve NP-complete problems by brute-force search in polynomial time. Against symmetric cryptography Grover halves the key length in bits, which is why AES-256 is considered quantum-safe.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — N = 4 finds the item in one step.</b> sin θ = 1/2 ⇒ θ = 30°. After one iteration the angle is 3θ = 90°, so P<sub>1</sub> = sin<sup>2</sup> 90° = <b>1</b>. Check with amplitudes: start (½, ½, ½, ½); oracle marks item 2: (½, ½, −½, ½); mean = ¼; inversion 2·¼ − a gives (0, 0, 1, 0).</p></div>
<div class="callout"><p><b>Example 2 — N = 8.</b> sin θ = 1/√8 ⇒ θ ≈ 0.3614 rad. P<sub>1</sub> = sin<sup>2</sup>(3θ) ≈ 0.7812, P<sub>2</sub> = sin<sup>2</sup>(5θ) ≈ <b>0.9453</b>, P<sub>3</sub> = sin<sup>2</sup>(7θ) ≈ 0.3301 (overshoot!). The formula gives k ≈ π/(4θ) − ½ ≈ 1.67, so k = 2 is best.</p></div>
<div class="callout"><p><b>Example 3 — numpy simulation, N = 8, marked w = 5.</b> The simulated probabilities match the formula.</p>
<pre><code class="language-python">import numpy as np
N, w = 8, 5                                   # 3 qubits, marked item w = 5 = |101&gt;
s = np.ones(N) / np.sqrt(N)                   # uniform superposition H|000&gt;
oracle = np.eye(N); oracle[w, w] = -1         # phase oracle: |w&gt; -&gt; -|w&gt;
diffusion = 2 * np.outer(s, s) - np.eye(N)    # 2|s&gt;&lt;s| - I
state = s.copy()
for k in range(1, 6):
    state = diffusion @ (oracle @ state)
    print("k =", k, " P(find w) =", round(abs(state[w])**2, 4))</code></pre>
<div class="out">k = 1  P(find w) = 0.7812
k = 2  P(find w) = 0.9453
k = 3  P(find w) = 0.3301
k = 4  P(find w) = 0.0122
k = 5  P(find w) = 0.548</div></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Iterating “until it works”. Each run ends in a measurement; you cannot peek in the middle. Precompute k from N (and M).</li><li>Saying Grover gives an exponential speed-up for NP problems. It is quadratic, and provably cannot be better for unstructured search.</li><li>Forgetting the cost of the oracle. In a real application the oracle is a reversible circuit for f; if f is expensive, every one of the √N queries pays for it.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Start in |s⟩ = H<sup>⊗n</sup>|0…0⟩; repeat G = (2|s⟩⟨s| − I)·O.</li><li>Each iteration rotates the state by 2θ, sin θ = 1/√N.</li><li>P<sub>k</sub> = sin<sup>2</sup>((2k + 1)θ); best k ≈ (π/4)√N; too many iterations overshoot.</li><li>Quadratic speed-up, provably optimal; N = 4 needs exactly one iteration.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.youtube.com/watch?v=hnpjC8WQVrQ" target="_blank" rel="noopener">Qiskit — Grover's Algorithm, Lesson 08 (Watrous)</a></li><li><a href="https://www.3blue1brown.com/lessons/grover" target="_blank" rel="noopener">3Blue1Brown — But what is quantum computing? (Grover's algorithm)</a></li><li><a href="https://quantum.country/search" target="_blank" rel="noopener">quantum.country — How the quantum search algorithm works</a></li><li><a href="https://arxiv.org/abs/quant-ph/9605043" target="_blank" rel="noopener">Grover (1996) — A fast quantum mechanical algorithm for database search (arXiv)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>For N = 16 with one marked item, which k maximises P<sub>k</sub>, and what is that probability (use the formula)?</li><li>N = 16 with M = 4 marked items: compute θ and the success probability after one iteration.</li><li>Starting from amplitudes (½, ½, ½, ½), apply the oracle marking item 0, then inversion about the mean. What do you get?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) θ = arcsin(1/4) ≈ 0.2527 rad, π/(4θ) − ½ ≈ 2.61 ⇒ k = 3, P<sub>3</sub> = sin<sup>2</sup>(7θ) ≈ 0.9613. 2) sin θ = √(4/16) = ½ ⇒ θ = 30°, P<sub>1</sub> = sin<sup>2</sup> 90° = 1: one iteration always finds one of the four marked items. 3) After the oracle (−½, ½, ½, ½), mean ¼, result (1, 0, 0, 0).</p></div>`,
  `<span class="eyebrow">QTC211 · Chương 9 · Bài 9.1</span>
<h2>Thuật toán tìm kiếm Grover: khuếch đại biên độ</h2>
<p class="lead">Cho N phần tử và một phép thử nhận ra phần tử cần tìm, máy cổ điển trung bình cần khoảng N/2 lần thử. Thuật toán Grover (1996) cần khoảng (π/4)√N. Tăng tốc “chỉ” là bậc hai, nhưng áp dụng được cho gần như mọi bài toán tìm kiếm, và hình học của nó rất đẹp.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Viết oracle pha và toán tử khuếch tán 2|s⟩⟨s| − I.</li><li>Giải thích một vòng lặp Grover là phép quay góc 2θ trong một mặt phẳng, với sin θ = 1/√N.</li><li>Tính xác suất thành công sin<sup>2</sup>((2k + 1)θ) và số vòng lặp tối ưu.</li><li>Giải thích vì sao lặp quá nhiều làm kết quả tệ đi, và vì sao tăng tốc là bậc hai.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Tìm kiếm không cấu trúc.</strong> Các phần tử đánh số x = 0, …, N − 1 với N = 2<sup>n</sup>. Hàm f(x) = 1 với đúng một phần tử được đánh dấu w và bằng 0 với mọi phần tử khác, cho dưới dạng oracle. Hãy tìm w. Cổ điển, không có cấu trúc nào để khai thác, ta thử từng phần tử: trung bình khoảng N/2 truy vấn, xấu nhất N − 1.</p>
<p><strong>Hai phép phản xạ.</strong> Bắt đầu ở chồng chập đều |s⟩ = H<sup>⊗n</sup>|0…0⟩ = N<sup>−1/2</sup> Σ<sub>x</sub>|x⟩. Một <strong>vòng lặp Grover</strong> G áp hai toán tử:</p>
<div class="formula"><span class="lbl">Vòng lặp Grover</span>O|x⟩ = (−1)<sup>f(x)</sup>|x⟩  (oracle pha, nhờ phase kickback)    D = 2|s⟩⟨s| − I  (khuếch tán)    G = D·O</div>
<p>O đổi dấu biên độ của phần tử được đánh dấu. D là “lật quanh giá trị trung bình”: mỗi biên độ a<sub>x</sub> thành 2ā − a<sub>x</sub>, với ā là biên độ trung bình. Sau O biên độ được đánh dấu âm, kéo trung bình xuống một chút, nên phép lật làm biên độ đó lớn và dương, còn mọi biên độ khác nhỏ đi một chút. Trong mạch, D = H<sup>⊗n</sup>(2|0…0⟩⟨0…0| − I)H<sup>⊗n</sup>.</p>
<p><strong>Hình học.</strong> Mọi thứ diễn ra trong mặt phẳng sinh bởi |w⟩ và |w<sup>⊥</sup>⟩ (chồng chập đều của các phần tử không được đánh dấu). Viết |s⟩ = sin θ |w⟩ + cos θ |w<sup>⊥</sup>⟩ với <strong>sin θ = 1/√N</strong>. O là phản xạ qua |w<sup>⊥</sup>⟩ và D là phản xạ qua |s⟩; hai phản xạ hợp thành một <strong>phép quay góc 2θ</strong> về phía |w⟩. Sau k vòng lặp góc tính từ |w<sup>⊥</sup>⟩ là (2k + 1)θ, nên</p>
<div class="formula"><span class="lbl">Xác suất thành công</span>P<sub>k</sub> = sin<sup>2</sup>((2k + 1)θ),   sin θ = 1/√N    k tối ưu ≈ π/(4θ) − 1/2 ≈ (π/4)√N</div>
<p>Quay vượt qua |w⟩ là <strong>quá đà</strong>: xác suất lại giảm. Grover không phải “lặp càng nhiều càng tốt”; phải dừng đúng k (nếu không biết số phần tử được đánh dấu, có các biến thể đoán k ngẫu nhiên). Với M phần tử được đánh dấu, sin θ = √(M/N) và k ≈ (π/4)√(N/M).</p>
<p><strong>Tăng tốc lớn cỡ nào?</strong> Bậc hai: √N thay cho N. Với N = 2<sup>20</sup> ≈ 10<sup>6</sup>, Grover cần 804 vòng lặp so với trung bình khoảng 524 288 lần thử cổ điển. Đây là tối ưu đã chứng minh (không thuật toán lượng tử nào tìm kiếm không cấu trúc với ít hơn cỡ √N truy vấn), nên máy lượng tử sẽ <em>không</em> giải bài toán NP-đầy đủ bằng vét cạn trong thời gian đa thức. Với mật mã khoá đối xứng, Grover làm độ dài khoá (tính theo bit) giảm một nửa, vì thế AES-256 được xem là an toàn trước máy lượng tử.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — N = 4 tìm ra sau một bước.</b> sin θ = 1/2 ⇒ θ = 30°. Sau một vòng lặp góc là 3θ = 90°, nên P<sub>1</sub> = sin<sup>2</sup> 90° = <b>1</b>. Kiểm bằng biên độ: bắt đầu (½, ½, ½, ½); oracle đánh dấu phần tử 2: (½, ½, −½, ½); trung bình = ¼; lật 2·¼ − a cho (0, 0, 1, 0).</p></div>
<div class="callout"><p><b>Ví dụ 2 — N = 8.</b> sin θ = 1/√8 ⇒ θ ≈ 0,3614 rad. P<sub>1</sub> = sin<sup>2</sup>(3θ) ≈ 0,7812, P<sub>2</sub> = sin<sup>2</sup>(5θ) ≈ <b>0,9453</b>, P<sub>3</sub> = sin<sup>2</sup>(7θ) ≈ 0,3301 (quá đà!). Công thức cho k ≈ π/(4θ) − ½ ≈ 1,67, nên k = 2 là tốt nhất.</p></div>
<div class="callout"><p><b>Ví dụ 3 — mô phỏng numpy, N = 8, phần tử đánh dấu w = 5.</b> Xác suất mô phỏng khớp công thức.</p>
<pre><code class="language-python">import numpy as np
N, w = 8, 5                                   # 3 qubits, marked item w = 5 = |101&gt;
s = np.ones(N) / np.sqrt(N)                   # uniform superposition H|000&gt;
oracle = np.eye(N); oracle[w, w] = -1         # phase oracle: |w&gt; -&gt; -|w&gt;
diffusion = 2 * np.outer(s, s) - np.eye(N)    # 2|s&gt;&lt;s| - I
state = s.copy()
for k in range(1, 6):
    state = diffusion @ (oracle @ state)
    print("k =", k, " P(find w) =", round(abs(state[w])**2, 4))</code></pre>
<div class="out">k = 1  P(find w) = 0.7812
k = 2  P(find w) = 0.9453
k = 3  P(find w) = 0.3301
k = 4  P(find w) = 0.0122
k = 5  P(find w) = 0.548</div></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Lặp “tới khi nào được thì thôi”. Mỗi lần chạy kết thúc bằng phép đo; không thể nhìn trộm giữa chừng. Tính trước k từ N (và M).</li><li>Nói Grover tăng tốc hàm mũ cho bài toán NP. Nó là bậc hai, và đã chứng minh không thể tốt hơn với tìm kiếm không cấu trúc.</li><li>Quên chi phí của oracle. Trong ứng dụng thật, oracle là một mạch khả nghịch tính f; nếu f đắt thì mỗi truy vấn trong √N truy vấn đều phải trả giá đó.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Bắt đầu ở |s⟩ = H<sup>⊗n</sup>|0…0⟩; lặp G = (2|s⟩⟨s| − I)·O.</li><li>Mỗi vòng lặp quay trạng thái một góc 2θ, sin θ = 1/√N.</li><li>P<sub>k</sub> = sin<sup>2</sup>((2k + 1)θ); k tốt nhất ≈ (π/4)√N; lặp quá nhiều thì quá đà.</li><li>Tăng tốc bậc hai, tối ưu đã chứng minh; N = 4 cần đúng một vòng lặp.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.youtube.com/watch?v=hnpjC8WQVrQ" target="_blank" rel="noopener">Qiskit — Grover's Algorithm, Lesson 08 (Watrous)</a></li><li><a href="https://www.3blue1brown.com/lessons/grover" target="_blank" rel="noopener">3Blue1Brown — But what is quantum computing? (thuật toán Grover)</a></li><li><a href="https://quantum.country/search" target="_blank" rel="noopener">quantum.country — Thuật toán tìm kiếm lượng tử hoạt động thế nào</a></li><li><a href="https://arxiv.org/abs/quant-ph/9605043" target="_blank" rel="noopener">Grover (1996) — A fast quantum mechanical algorithm for database search (arXiv)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Với N = 16 và một phần tử được đánh dấu, k nào làm P<sub>k</sub> lớn nhất, và xác suất đó bằng bao nhiêu (dùng công thức)?</li><li>N = 16 với M = 4 phần tử được đánh dấu: tính θ và xác suất thành công sau một vòng lặp.</li><li>Từ biên độ (½, ½, ½, ½), áp oracle đánh dấu phần tử 0 rồi lật quanh trung bình. Được gì?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) θ = arcsin(1/4) ≈ 0,2527 rad, π/(4θ) − ½ ≈ 2,61 ⇒ k = 3, P<sub>3</sub> = sin<sup>2</sup>(7θ) ≈ 0,9613. 2) sin θ = √(4/16) = ½ ⇒ θ = 30°, P<sub>1</sub> = sin<sup>2</sup> 90° = 1: một vòng lặp luôn tìm ra một trong bốn phần tử được đánh dấu. 3) Sau oracle (−½, ½, ½, ½), trung bình ¼, kết quả (1, 0, 0, 0).</p></div>`);

const c92 = L('qtc211-ts-9-2',
  '9.2 — The quantum Fourier transform|||9.2 — Biến đổi Fourier lượng tử (QFT)',
  'Định nghĩa QFT|x⟩ = N^(−1/2) Σ ω^(xk)|k⟩, QFT với N = 2 là H, ma trận N = 4, tính unita, quan hệ với FFT của numpy, chi phí mạch O(n²) so với FFT O(n·2ⁿ), không đọc được biên độ, trạng thái tuần hoàn cho đỉnh tại bội của N/r (demo numpy).',
  `<span class="eyebrow">QTC211 · Chapter 9 · Lesson 9.2</span>
<h2>The quantum Fourier transform</h2>
<p class="lead">The quantum Fourier transform (QFT) is the discrete Fourier transform applied to the amplitude vector. It is the engine of Shor's algorithm and of phase estimation, because it turns a hidden <em>period</em> into peaks you can measure.</p>
<h3>🎯 Objectives</h3>
<ul><li>State the definition of the QFT on N = 2<sup>n</sup> amplitudes and write its matrix for N = 2 and N = 4.</li><li>Verify that the QFT is unitary and relate it to numpy's FFT convention.</li><li>Count the gates of the QFT circuit and compare with the classical FFT — and state the catch.</li><li>Explain why a periodic state with period r produces peaks at multiples of N/r.</li></ul>
<h3>📖 Lecture</h3>
<p>Let N = 2<sup>n</sup> and ω = e<sup>2πi/N</sup>, a primitive N-th root of unity (ω<sup>N</sup> = 1). The QFT is defined on basis states and extended linearly:</p>
<div class="formula"><span class="lbl">Quantum Fourier transform</span>QFT|x⟩ = N<sup>−1/2</sup> Σ<sub>k=0</sub><sup>N−1</sup> ω<sup>xk</sup> |k⟩    so   QFT Σ<sub>x</sub> a<sub>x</sub>|x⟩ = Σ<sub>k</sub> b<sub>k</sub>|k⟩,   b<sub>k</sub> = N<sup>−1/2</sup> Σ<sub>x</sub> ω<sup>xk</sup> a<sub>x</sub></div>
<p>Its matrix has entries ω<sup>jk</sup>/√N (row k, column x). For N = 2, ω = e<sup>iπ</sup> = −1 and the QFT is exactly the Hadamard gate H. For N = 4, ω = i:</p>
<div class="formula"><span class="lbl">QFT<sub>4</sub></span>QFT<sub>4</sub> = ½ <table class="matrix"><tbody><tr><td>1</td><td>1</td><td>1</td><td>1</td></tr><tr><td>1</td><td>i</td><td>−1</td><td>−i</td></tr><tr><td>1</td><td>−1</td><td>1</td><td>−1</td></tr><tr><td>1</td><td>−i</td><td>−1</td><td>i</td></tr></tbody></table></div>
<p>The QFT is <strong>unitary</strong>: its columns are orthonormal because Σ<sub>k</sub> ω<sup>(x−x′)k</sup> = N if x = x′ and 0 otherwise (a geometric sum of roots of unity). In numpy's convention <code>np.fft.fft</code> uses e<sup>−2πi/N</sup> and no normalisation, so the QFT (with the + sign) equals √N · <code>np.fft.ifft</code>.</p>
<p><strong>Circuit cost.</strong> The QFT on n qubits can be built from n Hadamards, n(n − 1)/2 controlled-phase gates P(2π/2<sup>m</sup>) and about n/2 SWAPs — O(n<sup>2</sup>) gates. The classical FFT on a vector of length 2<sup>n</sup> costs O(n·2<sup>n</sup>) operations. For n = 20 that is 20 + 190 controlled phases + 10 swaps against about 2·10<sup>7</sup> classical operations. <strong>The catch:</strong> the output of the QFT lives in the amplitudes, which you cannot read. A measurement returns one k with probability |b<sub>k</sub>|<sup>2</sup>. So the QFT does not speed up “computing Fourier transforms of data”; it is useful only when sampling a few outcomes k answers your question — exactly the situation in period finding.</p>
<p><strong>Periodic states.</strong> Suppose the amplitudes are non-zero only on x<sub>0</sub>, x<sub>0</sub> + r, x<sub>0</sub> + 2r, … and r divides N. Then the QFT has non-zero amplitude only at k = 0, N/r, 2N/r, …, each with probability 1/r. The offset x<sub>0</sub> only changes phases. Measuring gives a random multiple of N/r, from which r can be recovered — the heart of Shor's algorithm (Lesson 9.3). If r does not divide N the peaks are only approximately at multiples of N/r, and continued fractions fix that.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — QFT<sub>4</sub>|1⟩.</b> Column x = 1: ½(|0⟩ + i|1⟩ − |2⟩ − i|3⟩). All four outcomes have probability ¼ — the QFT of a basis state is spread out evenly, with phases ω<sup>k</sup> that rotate by 90° each step.</p></div>
<div class="callout"><p><b>Example 2 — QFT<sub>4</sub> of a period-2 state.</b> a = (|0⟩ + |2⟩)/√2. b<sub>k</sub> = (1/√2)·½(1 + i<sup>2k</sup>) = (1/(2√2))(1 + (−1)<sup>k</sup>): b<sub>0</sub> = b<sub>2</sub> = 1/√2, b<sub>1</sub> = b<sub>3</sub> = 0. Peaks at k = 0 and 2 = multiples of N/r = 4/2.</p></div>
<div class="callout"><p><b>Example 3 — numpy: QFT<sub>4</sub>, unitarity, FFT convention, and a period-4 state in N = 16.</b></p>
<pre><code class="language-python">import numpy as np
def qft_matrix(N):
    w = np.exp(2j * np.pi / N)
    return np.array([[w ** (x * k) for x in range(N)] for k in range(N)]) / np.sqrt(N)
F4 = qft_matrix(4)
print(np.round(2 * F4, 3))                                   # 2*QFT_4: entries are powers of i
print("unitary:", np.allclose(F4.conj().T @ F4, np.eye(4)))
a = np.random.default_rng(1).normal(size=4) + 0j; a /= np.linalg.norm(a)
print("QFT = sqrt(N) * numpy ifft:", np.allclose(F4 @ a, np.sqrt(4) * np.fft.ifft(a)))
N, r = 16, 4                                                  # periodic state: 1, 5, 9, 13
psi = np.zeros(N); psi[1::r] = 1; psi /= np.linalg.norm(psi)
p = np.abs(qft_matrix(N) @ psi) ** 2
print("outcomes with P &gt; 0:", [(k, round(float(p[k]), 3)) for k in range(N) if p[k] &gt; 1e-9])</code></pre>
<div class="out">[[ 1.+0.j  1.+0.j  1.+0.j  1.+0.j]
 [ 1.+0.j  0.+1.j -1.+0.j -0.-1.j]
 [ 1.+0.j -1.+0.j  1.-0.j -1.+0.j]
 [ 1.+0.j -0.-1.j -1.+0.j  0.+1.j]]
unitary: True
QFT = sqrt(N) * numpy ifft: True
outcomes with P &gt; 0: [(0, 0.25), (4, 0.25), (8, 0.25), (12, 0.25)]</div>
<p>The state on x = 1, 5, 9, 13 (period 4, offset 1) gives outcomes only at k = 0, 4, 8, 12 = multiples of 16/4, each with probability ¼.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Claiming the QFT computes a Fourier transform “exponentially faster” in a useful sense. You cannot read the 2<sup>n</sup> output amplitudes; you get one sample per run.</li><li>Mixing sign conventions: the QFT uses e<sup>+2πi xk/N</sup>; numpy's <code>fft</code> uses e<sup>−2πi xk/N</sup>. Check with a small example before trusting code.</li><li>Forgetting the final SWAPs (or the reversed bit order) of the textbook QFT circuit, then wondering why outputs are bit-reversed.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>QFT|x⟩ = N<sup>−1/2</sup> Σ<sub>k</sub> ω<sup>xk</sup>|k⟩, ω = e<sup>2πi/N</sup>; QFT<sub>2</sub> = H.</li><li>Unitary; equals √N · numpy <code>ifft</code>.</li><li>Circuit: O(n<sup>2</sup>) gates vs classical FFT O(n·2<sup>n</sup>) — but amplitudes cannot be read out.</li><li>Period r dividing N ⇒ outcomes are multiples of N/r, each with probability 1/r.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Quantum_Fourier_transform" target="_blank" rel="noopener">Wikipedia — Quantum Fourier transform</a></li><li><a href="https://github.com/Qiskit/documentation/blob/main/learning/courses/fundamentals-of-quantum-algorithms/phase-estimation-and-factoring/phase-estimation-procedure.ipynb" target="_blank" rel="noopener">IBM Quantum Learning (Watrous) — Phase estimation procedure and the QFT (source notebook)</a></li><li><a href="https://www.youtube.com/watch?v=4nT0BTUxhJY" target="_blank" rel="noopener">Qiskit — Phase Estimation and Factoring, Lesson 07 (Watrous)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Compute QFT<sub>4</sub>|0⟩ and QFT<sub>4</sub>|2⟩.</li><li>How many controlled-phase gates does the QFT circuit on n = 10 qubits use?</li><li>A state on N = 16 is supported on x = 2, 6, 10, 14. Which outcomes can a measurement after the QFT give?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) QFT<sub>4</sub>|0⟩ = ½(|0⟩ + |1⟩ + |2⟩ + |3⟩); QFT<sub>4</sub>|2⟩ = ½(|0⟩ − |1⟩ + |2⟩ − |3⟩) (ω<sup>2k</sup> = (−1)<sup>k</sup>). 2) n(n − 1)/2 = 45. 3) Period r = 4 ⇒ k ∈ {0, 4, 8, 12}, each with probability ¼ (the offset 2 changes only the phases).</p></div>`,
  `<span class="eyebrow">QTC211 · Chương 9 · Bài 9.2</span>
<h2>Biến đổi Fourier lượng tử (QFT)</h2>
<p class="lead">Biến đổi Fourier lượng tử (QFT) là biến đổi Fourier rời rạc áp lên vectơ biên độ. Nó là động cơ của thuật toán Shor và của ước lượng pha, vì nó biến một <em>chu kỳ</em> ẩn thành các đỉnh đo được.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phát biểu định nghĩa QFT trên N = 2<sup>n</sup> biên độ và viết ma trận với N = 2 và N = 4.</li><li>Kiểm tra QFT unita và liên hệ với quy ước FFT của numpy.</li><li>Đếm số cổng của mạch QFT, so với FFT cổ điển — và nói rõ chỗ “mắc”.</li><li>Giải thích vì sao trạng thái tuần hoàn chu kỳ r cho đỉnh tại các bội của N/r.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Cho N = 2<sup>n</sup> và ω = e<sup>2πi/N</sup>, một căn nguyên thuỷ bậc N của đơn vị (ω<sup>N</sup> = 1). QFT định nghĩa trên trạng thái cơ sở rồi mở rộng tuyến tính:</p>
<div class="formula"><span class="lbl">Biến đổi Fourier lượng tử</span>QFT|x⟩ = N<sup>−1/2</sup> Σ<sub>k=0</sub><sup>N−1</sup> ω<sup>xk</sup> |k⟩    nên   QFT Σ<sub>x</sub> a<sub>x</sub>|x⟩ = Σ<sub>k</sub> b<sub>k</sub>|k⟩,   b<sub>k</sub> = N<sup>−1/2</sup> Σ<sub>x</sub> ω<sup>xk</sup> a<sub>x</sub></div>
<p>Ma trận của nó có phần tử ω<sup>xk</sup>/√N (hàng k, cột x). Với N = 2, ω = e<sup>iπ</sup> = −1 và QFT đúng là cổng Hadamard H. Với N = 4, ω = i:</p>
<div class="formula"><span class="lbl">QFT<sub>4</sub></span>QFT<sub>4</sub> = ½ <table class="matrix"><tbody><tr><td>1</td><td>1</td><td>1</td><td>1</td></tr><tr><td>1</td><td>i</td><td>−1</td><td>−i</td></tr><tr><td>1</td><td>−1</td><td>1</td><td>−1</td></tr><tr><td>1</td><td>−i</td><td>−1</td><td>i</td></tr></tbody></table></div>
<p>QFT <strong>unita</strong>: các cột trực chuẩn vì Σ<sub>k</sub> ω<sup>(x−x′)k</sup> = N nếu x = x′ và bằng 0 nếu khác (tổng cấp số nhân của các căn đơn vị). Theo quy ước của numpy, <code>np.fft.fft</code> dùng e<sup>−2πi/N</sup> và không chuẩn hoá, nên QFT (dấu +) bằng √N · <code>np.fft.ifft</code>.</p>
<p><strong>Chi phí mạch.</strong> QFT trên n qubit dựng được từ n cổng Hadamard, n(n − 1)/2 cổng pha có điều khiển P(2π/2<sup>m</sup>) và khoảng n/2 cổng SWAP — O(n<sup>2</sup>) cổng. FFT cổ điển trên vectơ dài 2<sup>n</sup> tốn O(n·2<sup>n</sup>) phép tính. Với n = 20 là 20 + 190 cổng pha điều khiển + 10 swap so với khoảng 2·10<sup>7</sup> phép tính cổ điển. <strong>Chỗ mắc:</strong> kết quả của QFT nằm trong các biên độ, mà biên độ thì không đọc được. Phép đo chỉ trả về một k với xác suất |b<sub>k</sub>|<sup>2</sup>. Vì vậy QFT không tăng tốc việc “tính biến đổi Fourier của dữ liệu”; nó chỉ hữu ích khi lấy mẫu vài kết quả k là đủ trả lời câu hỏi — đúng tình huống của bài toán tìm chu kỳ.</p>
<p><strong>Trạng thái tuần hoàn.</strong> Giả sử biên độ chỉ khác 0 trên x<sub>0</sub>, x<sub>0</sub> + r, x<sub>0</sub> + 2r, … và r chia hết N. Khi đó QFT chỉ có biên độ khác 0 tại k = 0, N/r, 2N/r, …, mỗi giá trị xác suất 1/r. Độ lệch x<sub>0</sub> chỉ đổi pha. Đo được một bội ngẫu nhiên của N/r, từ đó suy ra r — trái tim của thuật toán Shor (Bài 9.3). Nếu r không chia hết N thì các đỉnh chỉ xấp xỉ nằm ở bội của N/r, và liên phân số sẽ xử lý chuyện đó.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — QFT<sub>4</sub>|1⟩.</b> Cột x = 1: ½(|0⟩ + i|1⟩ − |2⟩ − i|3⟩). Cả bốn kết quả có xác suất ¼ — QFT của một trạng thái cơ sở trải đều, với các pha ω<sup>k</sup> xoay 90° mỗi bước.</p></div>
<div class="callout"><p><b>Ví dụ 2 — QFT<sub>4</sub> của trạng thái chu kỳ 2.</b> a = (|0⟩ + |2⟩)/√2. b<sub>k</sub> = (1/√2)·½(1 + i<sup>2k</sup>) = (1/(2√2))(1 + (−1)<sup>k</sup>): b<sub>0</sub> = b<sub>2</sub> = 1/√2, b<sub>1</sub> = b<sub>3</sub> = 0. Đỉnh tại k = 0 và 2 = các bội của N/r = 4/2.</p></div>
<div class="callout"><p><b>Ví dụ 3 — numpy: QFT<sub>4</sub>, tính unita, quy ước FFT, và trạng thái chu kỳ 4 trong N = 16.</b></p>
<pre><code class="language-python">import numpy as np
def qft_matrix(N):
    w = np.exp(2j * np.pi / N)
    return np.array([[w ** (x * k) for x in range(N)] for k in range(N)]) / np.sqrt(N)
F4 = qft_matrix(4)
print(np.round(2 * F4, 3))                                   # 2*QFT_4: entries are powers of i
print("unitary:", np.allclose(F4.conj().T @ F4, np.eye(4)))
a = np.random.default_rng(1).normal(size=4) + 0j; a /= np.linalg.norm(a)
print("QFT = sqrt(N) * numpy ifft:", np.allclose(F4 @ a, np.sqrt(4) * np.fft.ifft(a)))
N, r = 16, 4                                                  # periodic state: 1, 5, 9, 13
psi = np.zeros(N); psi[1::r] = 1; psi /= np.linalg.norm(psi)
p = np.abs(qft_matrix(N) @ psi) ** 2
print("outcomes with P &gt; 0:", [(k, round(float(p[k]), 3)) for k in range(N) if p[k] &gt; 1e-9])</code></pre>
<div class="out">[[ 1.+0.j  1.+0.j  1.+0.j  1.+0.j]
 [ 1.+0.j  0.+1.j -1.+0.j -0.-1.j]
 [ 1.+0.j -1.+0.j  1.-0.j -1.+0.j]
 [ 1.+0.j -0.-1.j -1.+0.j  0.+1.j]]
unitary: True
QFT = sqrt(N) * numpy ifft: True
outcomes with P &gt; 0: [(0, 0.25), (4, 0.25), (8, 0.25), (12, 0.25)]</div>
<p>Trạng thái trên x = 1, 5, 9, 13 (chu kỳ 4, độ lệch 1) chỉ cho kết quả k = 0, 4, 8, 12 = các bội của 16/4, mỗi giá trị xác suất ¼.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Khẳng định QFT tính biến đổi Fourier “nhanh hơn theo hàm mũ” theo nghĩa hữu dụng. Bạn không đọc được 2<sup>n</sup> biên độ đầu ra; mỗi lần chạy chỉ được một mẫu.</li><li>Lẫn quy ước dấu: QFT dùng e<sup>+2πi xk/N</sup>; <code>fft</code> của numpy dùng e<sup>−2πi xk/N</sup>. Kiểm bằng một ví dụ nhỏ trước khi tin code.</li><li>Quên các cổng SWAP cuối (hay thứ tự bit đảo ngược) của mạch QFT trong sách, rồi thắc mắc vì sao kết quả bị đảo bit.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>QFT|x⟩ = N<sup>−1/2</sup> Σ<sub>k</sub> ω<sup>xk</sup>|k⟩, ω = e<sup>2πi/N</sup>; QFT<sub>2</sub> = H.</li><li>Unita; bằng √N · <code>ifft</code> của numpy.</li><li>Mạch: O(n<sup>2</sup>) cổng so với FFT cổ điển O(n·2<sup>n</sup>) — nhưng không đọc được biên độ.</li><li>Chu kỳ r chia hết N ⇒ kết quả là bội của N/r, mỗi giá trị xác suất 1/r.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Quantum_Fourier_transform" target="_blank" rel="noopener">Wikipedia — Biến đổi Fourier lượng tử</a></li><li><a href="https://github.com/Qiskit/documentation/blob/main/learning/courses/fundamentals-of-quantum-algorithms/phase-estimation-and-factoring/phase-estimation-procedure.ipynb" target="_blank" rel="noopener">IBM Quantum Learning (Watrous) — Quy trình ước lượng pha và QFT (notebook gốc)</a></li><li><a href="https://www.youtube.com/watch?v=4nT0BTUxhJY" target="_blank" rel="noopener">Qiskit — Phase Estimation and Factoring, Lesson 07 (Watrous)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tính QFT<sub>4</sub>|0⟩ và QFT<sub>4</sub>|2⟩.</li><li>Mạch QFT trên n = 10 qubit dùng bao nhiêu cổng pha có điều khiển?</li><li>Một trạng thái trên N = 16 chỉ khác 0 tại x = 2, 6, 10, 14. Đo sau QFT có thể ra những kết quả nào?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) QFT<sub>4</sub>|0⟩ = ½(|0⟩ + |1⟩ + |2⟩ + |3⟩); QFT<sub>4</sub>|2⟩ = ½(|0⟩ − |1⟩ + |2⟩ − |3⟩) (ω<sup>2k</sup> = (−1)<sup>k</sup>). 2) n(n − 1)/2 = 45. 3) Chu kỳ r = 4 ⇒ k ∈ {0, 4, 8, 12}, mỗi giá trị xác suất ¼ (độ lệch 2 chỉ đổi pha).</p></div>`);

const c93 = L('qtc211-ts-9-3',
  '9.3 — Phase estimation and Shor’s factoring algorithm (the idea)|||9.3 — Ước lượng pha và thuật toán phân tích thừa số Shor (ý tưởng)',
  'Quy phân tích thừa số về tìm cấp a^r ≡ 1 (mod N), điều kiện r chẵn và a^(r/2) ≢ −1, gcd cho thừa số (N = 15, a = 7; N = 21, a = 2), ước lượng pha cho s/r, liên phân số, ước lượng tài nguyên phá RSA-2048 (Gidney 2019, 2025), mật mã hậu lượng tử NIST FIPS 203.',
  `<span class="eyebrow">QTC211 · Chapter 9 · Lesson 9.3</span>
<h2>Phase estimation and Shor's factoring algorithm (the idea)</h2>
<p class="lead">Shor's algorithm (1994) factors an integer N in time polynomial in its number of digits — something no known classical algorithm does. Most of it is classical number theory; the quantum part solves one sub-problem, <strong>order finding</strong>, using phase estimation and the QFT.</p>
<h3>🎯 Objectives</h3>
<ul><li>Reduce factoring N to finding the order r of a number a modulo N.</li><li>Carry out the classical post-processing gcd(a<sup>r/2</sup> ± 1, N) on small examples.</li><li>Explain what phase estimation outputs (an approximation of s/r) and how continued fractions recover r.</li><li>Discuss realistic resource estimates for RSA-2048 and why post-quantum cryptography is being deployed now.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>Step 1 — reduction to order finding (classical).</strong> Pick a random a with 1 &lt; a &lt; N. If gcd(a, N) &gt; 1 you have found a factor by luck. Otherwise the <strong>order</strong> of a modulo N is the smallest r ≥ 1 with a<sup>r</sup> ≡ 1 (mod N). If r is even, a<sup>r</sup> − 1 = (a<sup>r/2</sup> − 1)(a<sup>r/2</sup> + 1) ≡ 0 (mod N), so N divides the product. If in addition a<sup>r/2</sup> ≢ −1 (mod N), N divides neither factor, hence</p>
<div class="formula"><span class="lbl">Shor's reduction</span>r even and a<sup>r/2</sup> ≢ −1 (mod N)  ⇒  gcd(a<sup>r/2</sup> − 1, N) and gcd(a<sup>r/2</sup> + 1, N) are non-trivial factors of N</div>
<p>For an odd N that is not a prime power, a random a works with probability at least 1/2, so a few tries suffice. The gcd is computed by Euclid's algorithm in polynomial time. The <em>only</em> hard step is finding r.</p>
<p><strong>Step 2 — order finding (quantum).</strong> The map U|y⟩ = |a·y mod N⟩ is a permutation, hence unitary. Its eigenvalues are e<sup>2πi s/r</sup> for s = 0, …, r − 1: the order is hidden in a <strong>phase</strong>. <strong>Phase estimation</strong> extracts it: a register of m qubits in uniform superposition controls U, U<sup>2</sup>, U<sup>4</sup>, …, U<sup>2<sup>m−1</sup></sup> (these powers are computed by modular exponentiation — the most expensive part of the circuit), phase kickback writes the phase into the register, and an inverse QFT turns it into a binary number y with y/2<sup>m</sup> ≈ s/r for a random s. Equivalently, the register holds a periodic state with period r, and the QFT of Lesson 9.2 turns the period into peaks.</p>
<p><strong>Step 3 — continued fractions (classical).</strong> From y/2<sup>m</sup> find the closest fraction with a small denominator: that denominator is r (or a divisor of r, if s and r share a factor — repeat a few times). Python's <code>Fraction.limit_denominator</code> does exactly this.</p>
<p><strong>How far away is breaking RSA?</strong> Read real estimates, not headlines. Gidney and Ekerå (2019, arXiv:1905.09749) estimated that 2048-bit RSA could be factored in 8 hours with 20 million noisy qubits, assuming a physical gate error rate of 10<sup>−3</sup> and a 1 µs surface-code cycle. Gidney (2025, arXiv:2505.15917) lowered this to <strong>less than a week with fewer than one million noisy qubits</strong> under the same 0.1% error assumption. Today's machines have on the order of a thousand physical qubits and no large-scale error correction, so RSA-2048 is not broken — but data encrypted today can be stored and decrypted later (“harvest now, decrypt later”). That is why NIST standardised post-quantum algorithms such as ML-KEM (FIPS 203, 2024), which rely on lattice problems that Shor's algorithm does not solve.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — N = 15, a = 7.</b> Powers of 7 mod 15: 7, 4, 13, 1 ⇒ <b>r = 4</b> (even). 7<sup>2</sup> = 49 ≡ 4 (mod 15), and 4 ≢ −1 = 14. gcd(4 − 1, 15) = gcd(3, 15) = <b>3</b>, gcd(4 + 1, 15) = <b>5</b>. 15 = 3 × 5.</p></div>
<div class="callout"><p><b>Example 2 — N = 21, a = 2.</b> Powers of 2 mod 21: 2, 4, 8, 16, 11, 1 ⇒ <b>r = 6</b>. 2<sup>3</sup> = 8 ≢ 20. gcd(7, 21) = <b>7</b>, gcd(9, 21) = <b>3</b>. A bad choice: a = 5 also has r = 6, but 5<sup>3</sup> = 125 ≡ 20 ≡ −1 (mod 21), so the gcds are trivial (1 and 21) — pick another a.</p></div>
<div class="callout"><p><b>Example 3 — the classical part in Python.</b> The brute-force <code>order_classical</code> takes time exponential in the number of digits of N; it is exactly the step that Shor's quantum circuit replaces.</p>
<pre><code class="language-python">from math import gcd
def order_classical(a, N):          # brute force: THIS is the step Shor's quantum circuit replaces
    r, x = 1, a % N
    while x != 1:
        x, r = (x * a) % N, r + 1
    return r
def shor_postprocess(N, a):
    g = gcd(a, N)
    if g != 1:
        return "lucky: gcd(a, N) = " + str(g)
    r = order_classical(a, N)
    if r % 2 == 1:
        return "r = " + str(r) + " is odd -&gt; pick another a"
    h = pow(a, r // 2, N)
    if h == N - 1:
        return "r = " + str(r) + ", a^(r/2) = -1 mod N -&gt; pick another a"
    return "r = " + str(r) + ", factors " + str(gcd(h - 1, N)) + " x " + str(gcd(h + 1, N))
for N, a in [(15, 7), (21, 2), (21, 5), (35, 2)]:
    print("N =", N, "a =", a, ":", shor_postprocess(N, a))</code></pre>
<div class="out">N = 15 a = 7 : r = 4, factors 3 x 5
N = 21 a = 2 : r = 6, factors 7 x 3
N = 21 a = 5 : r = 6, a^(r/2) = -1 mod N -&gt; pick another a
N = 35 a = 2 : r = 12, factors 7 x 5</div>
<p>Continued fractions: for N = 15, a = 7 (r = 4) an 8-qubit phase register returns y ∈ {0, 64, 128, 192} with y/256 = s/4. Recovering the fraction from y:</p>
<pre><code class="language-python">from fractions import Fraction
for y in (64, 128, 192, 85, 171):              # 8-bit phase-estimation outcomes y, phase ~ y/256
    print(y, "/ 256 -&gt;", Fraction(y, 256).limit_denominator(15))</code></pre>
<div class="out">64 / 256 -&gt; 1/4
128 / 256 -&gt; 1/2
192 / 256 -&gt; 3/4
85 / 256 -&gt; 1/3
171 / 256 -&gt; 2/3</div>
<p>y = 64 or 192 gives denominator 4 = r directly; y = 128 gives 1/2 (s = 2 shares a factor with r), so we repeat. The last two lines show what an order r = 3 would look like (85/256 ≈ 1/3).</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Thinking the quantum computer “tries all divisors in parallel”. It finds a period through interference; the factors come from classical gcds.</li><li>Forgetting the two failure cases: r odd, or a<sup>r/2</sup> ≡ −1 (mod N). Both are detected classically, and you simply choose another a.</li><li>Quoting “RSA will be broken next year” or “never”. Use published estimates with their assumptions (qubit count, error rate, cycle time) — and remember that migration to post-quantum cryptography takes years.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Factoring ⇒ order finding: a<sup>r</sup> ≡ 1 (mod N), then gcd(a<sup>r/2</sup> ± 1, N).</li><li>Works when r is even and a<sup>r/2</sup> ≢ −1; otherwise retry with a new a.</li><li>Quantum part: phase estimation of U|y⟩ = |ay mod N⟩ gives y/2<sup>m</sup> ≈ s/r; continued fractions give r.</li><li>RSA-2048 estimates: 20 million noisy qubits / 8 hours (2019) → under one million / under a week (2025); post-quantum standards (FIPS 203) are the defence.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://github.com/Qiskit/documentation/blob/main/learning/courses/fundamentals-of-quantum-algorithms/phase-estimation-and-factoring/shor-algorithm.ipynb" target="_blank" rel="noopener">IBM Quantum Learning (Watrous) — Shor's algorithm (source notebook)</a></li><li><a href="https://arxiv.org/abs/quant-ph/9508027" target="_blank" rel="noopener">Shor — Polynomial-time algorithms for prime factorization and discrete logarithms (arXiv)</a></li><li><a href="https://arxiv.org/abs/2505.15917" target="_blank" rel="noopener">Gidney (2025) — How to factor 2048 bit RSA integers with less than a million noisy qubits (arXiv)</a></li><li><a href="https://csrc.nist.gov/projects/post-quantum-cryptography" target="_blank" rel="noopener">NIST — Post-Quantum Cryptography project</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Find the order of 2 modulo 15 and use it to factor 15.</li><li>For N = 15, why does a = 14 fail?</li><li>Factor 35 using a = 2 (order r = 12).</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 2, 4, 8, 1 ⇒ r = 4; 2<sup>2</sup> = 4; gcd(3, 15) = 3, gcd(5, 15) = 5. 2) 14 ≡ −1, so 14<sup>2</sup> ≡ 1: r = 2 and a<sup>r/2</sup> = 14 ≡ −1 (mod 15); the gcds are 1 and 15. 3) 2<sup>6</sup> = 64 ≡ 29 (mod 35), 29 ≢ 34; gcd(28, 35) = 7 and gcd(30, 35) = 5, so 35 = 7 × 5.</p></div>`,
  `<span class="eyebrow">QTC211 · Chương 9 · Bài 9.3</span>
<h2>Ước lượng pha và thuật toán phân tích thừa số Shor (ý tưởng)</h2>
<p class="lead">Thuật toán Shor (1994) phân tích một số nguyên N trong thời gian đa thức theo số chữ số của nó — điều chưa thuật toán cổ điển nào đã biết làm được. Phần lớn thuật toán là lý thuyết số cổ điển; phần lượng tử chỉ giải một bài toán con, <strong>tìm cấp (order finding)</strong>, bằng ước lượng pha và QFT.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Quy bài toán phân tích N về bài toán tìm cấp r của một số a modulo N.</li><li>Thực hiện hậu xử lý cổ điển gcd(a<sup>r/2</sup> ± 1, N) trên các ví dụ nhỏ.</li><li>Giải thích ước lượng pha cho ra gì (xấp xỉ của s/r) và liên phân số khôi phục r thế nào.</li><li>Thảo luận các ước lượng tài nguyên thực tế cho RSA-2048 và vì sao mật mã hậu lượng tử đang được triển khai ngay bây giờ.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Bước 1 — quy về tìm cấp (cổ điển).</strong> Chọn ngẫu nhiên a với 1 &lt; a &lt; N. Nếu gcd(a, N) &gt; 1 thì may mắn đã tìm được một thừa số. Nếu không, <strong>cấp</strong> của a modulo N là số r ≥ 1 nhỏ nhất thoả a<sup>r</sup> ≡ 1 (mod N). Nếu r chẵn, a<sup>r</sup> − 1 = (a<sup>r/2</sup> − 1)(a<sup>r/2</sup> + 1) ≡ 0 (mod N), nên N chia hết tích. Nếu thêm a<sup>r/2</sup> ≢ −1 (mod N) thì N không chia hết thừa số nào, do đó</p>
<div class="formula"><span class="lbl">Phép quy của Shor</span>r chẵn và a<sup>r/2</sup> ≢ −1 (mod N)  ⇒  gcd(a<sup>r/2</sup> − 1, N) và gcd(a<sup>r/2</sup> + 1, N) là các thừa số không tầm thường của N</div>
<p>Với N lẻ và không phải luỹ thừa của một số nguyên tố, một a ngẫu nhiên thành công với xác suất ít nhất 1/2, nên thử vài lần là đủ. gcd tính bằng thuật toán Euclid trong thời gian đa thức. Bước khó <em>duy nhất</em> là tìm r.</p>
<p><strong>Bước 2 — tìm cấp (lượng tử).</strong> Ánh xạ U|y⟩ = |a·y mod N⟩ là một hoán vị, nên unita. Trị riêng của nó là e<sup>2πi s/r</sup> với s = 0, …, r − 1: cấp nằm ẩn trong một <strong>pha</strong>. <strong>Ước lượng pha</strong> rút nó ra: một thanh ghi m qubit ở chồng chập đều điều khiển U, U<sup>2</sup>, U<sup>4</sup>, …, U<sup>2<sup>m−1</sup></sup> (các luỹ thừa này tính bằng luỹ thừa modulo — phần đắt nhất của mạch), phase kickback ghi pha vào thanh ghi, và QFT ngược biến nó thành số nhị phân y với y/2<sup>m</sup> ≈ s/r cho một s ngẫu nhiên. Nói cách khác, thanh ghi chứa một trạng thái tuần hoàn chu kỳ r, và QFT ở Bài 9.2 biến chu kỳ thành các đỉnh.</p>
<p><strong>Bước 3 — liên phân số (cổ điển).</strong> Từ y/2<sup>m</sup> tìm phân số gần nhất có mẫu nhỏ: mẫu đó là r (hoặc một ước của r, nếu s và r có ước chung — lặp lại vài lần). Hàm <code>Fraction.limit_denominator</code> của Python làm đúng việc này.</p>
<p><strong>Còn bao xa nữa mới phá được RSA?</strong> Hãy đọc ước lượng thật, đừng đọc tít báo. Gidney và Ekerå (2019, arXiv:1905.09749) ước lượng RSA 2048 bit có thể bị phân tích trong 8 giờ với 20 triệu qubit nhiễu, giả định tỉ lệ lỗi cổng vật lý 10<sup>−3</sup> và chu kỳ surface code 1 µs. Gidney (2025, arXiv:2505.15917) hạ xuống <strong>dưới một tuần với ít hơn một triệu qubit nhiễu</strong>, cùng giả định lỗi 0,1%. Máy hiện nay có cỡ một nghìn qubit vật lý và chưa có sửa lỗi quy mô lớn, nên RSA-2048 chưa bị phá — nhưng dữ liệu mã hoá hôm nay có thể bị lưu lại rồi giải mã sau (“thu hoạch bây giờ, giải mã sau”). Vì thế NIST đã chuẩn hoá các thuật toán hậu lượng tử như ML-KEM (FIPS 203, 2024), dựa trên bài toán lưới mà thuật toán Shor không giải được.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — N = 15, a = 7.</b> Luỹ thừa của 7 mod 15: 7, 4, 13, 1 ⇒ <b>r = 4</b> (chẵn). 7<sup>2</sup> = 49 ≡ 4 (mod 15), và 4 ≢ −1 = 14. gcd(4 − 1, 15) = gcd(3, 15) = <b>3</b>, gcd(4 + 1, 15) = <b>5</b>. 15 = 3 × 5.</p></div>
<div class="callout"><p><b>Ví dụ 2 — N = 21, a = 2.</b> Luỹ thừa của 2 mod 21: 2, 4, 8, 16, 11, 1 ⇒ <b>r = 6</b>. 2<sup>3</sup> = 8 ≢ 20. gcd(7, 21) = <b>7</b>, gcd(9, 21) = <b>3</b>. Một lựa chọn xấu: a = 5 cũng có r = 6, nhưng 5<sup>3</sup> = 125 ≡ 20 ≡ −1 (mod 21), nên gcd tầm thường (1 và 21) — chọn a khác.</p></div>
<div class="callout"><p><b>Ví dụ 3 — phần cổ điển bằng Python.</b> Hàm vét cạn <code>order_classical</code> tốn thời gian hàm mũ theo số chữ số của N; nó đúng là bước mà mạch lượng tử của Shor thay thế.</p>
<pre><code class="language-python">from math import gcd
def order_classical(a, N):          # brute force: THIS is the step Shor's quantum circuit replaces
    r, x = 1, a % N
    while x != 1:
        x, r = (x * a) % N, r + 1
    return r
def shor_postprocess(N, a):
    g = gcd(a, N)
    if g != 1:
        return "lucky: gcd(a, N) = " + str(g)
    r = order_classical(a, N)
    if r % 2 == 1:
        return "r = " + str(r) + " is odd -&gt; pick another a"
    h = pow(a, r // 2, N)
    if h == N - 1:
        return "r = " + str(r) + ", a^(r/2) = -1 mod N -&gt; pick another a"
    return "r = " + str(r) + ", factors " + str(gcd(h - 1, N)) + " x " + str(gcd(h + 1, N))
for N, a in [(15, 7), (21, 2), (21, 5), (35, 2)]:
    print("N =", N, "a =", a, ":", shor_postprocess(N, a))</code></pre>
<div class="out">N = 15 a = 7 : r = 4, factors 3 x 5
N = 21 a = 2 : r = 6, factors 7 x 3
N = 21 a = 5 : r = 6, a^(r/2) = -1 mod N -&gt; pick another a
N = 35 a = 2 : r = 12, factors 7 x 5</div>
<p>Liên phân số: với N = 15, a = 7 (r = 4), thanh ghi pha 8 qubit trả về y ∈ {0, 64, 128, 192} với y/256 = s/4. Khôi phục phân số từ y:</p>
<pre><code class="language-python">from fractions import Fraction
for y in (64, 128, 192, 85, 171):              # 8-bit phase-estimation outcomes y, phase ~ y/256
    print(y, "/ 256 -&gt;", Fraction(y, 256).limit_denominator(15))</code></pre>
<div class="out">64 / 256 -&gt; 1/4
128 / 256 -&gt; 1/2
192 / 256 -&gt; 3/4
85 / 256 -&gt; 1/3
171 / 256 -&gt; 2/3</div>
<p>y = 64 hoặc 192 cho thẳng mẫu 4 = r; y = 128 cho 1/2 (s = 2 có ước chung với r), nên phải lặp lại. Hai dòng cuối cho thấy cấp r = 3 sẽ trông thế nào (85/256 ≈ 1/3).</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Nghĩ rằng máy lượng tử “thử mọi ước số song song”. Nó tìm chu kỳ nhờ giao thoa; các thừa số đến từ gcd cổ điển.</li><li>Quên hai trường hợp thất bại: r lẻ, hoặc a<sup>r/2</sup> ≡ −1 (mod N). Cả hai đều phát hiện được bằng cổ điển, và chỉ việc chọn a khác.</li><li>Nói “năm sau RSA bị phá” hoặc “không bao giờ”. Hãy dùng ước lượng đã công bố cùng giả định của nó (số qubit, tỉ lệ lỗi, chu kỳ) — và nhớ rằng chuyển sang mật mã hậu lượng tử mất nhiều năm.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Phân tích thừa số ⇒ tìm cấp: a<sup>r</sup> ≡ 1 (mod N), rồi gcd(a<sup>r/2</sup> ± 1, N).</li><li>Thành công khi r chẵn và a<sup>r/2</sup> ≢ −1; nếu không, thử a mới.</li><li>Phần lượng tử: ước lượng pha của U|y⟩ = |ay mod N⟩ cho y/2<sup>m</sup> ≈ s/r; liên phân số cho r.</li><li>Ước lượng RSA-2048: 20 triệu qubit nhiễu / 8 giờ (2019) → dưới một triệu / dưới một tuần (2025); chuẩn hậu lượng tử (FIPS 203) là lá chắn.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://github.com/Qiskit/documentation/blob/main/learning/courses/fundamentals-of-quantum-algorithms/phase-estimation-and-factoring/shor-algorithm.ipynb" target="_blank" rel="noopener">IBM Quantum Learning (Watrous) — Thuật toán Shor (notebook gốc)</a></li><li><a href="https://arxiv.org/abs/quant-ph/9508027" target="_blank" rel="noopener">Shor — Polynomial-time algorithms for prime factorization and discrete logarithms (arXiv)</a></li><li><a href="https://arxiv.org/abs/2505.15917" target="_blank" rel="noopener">Gidney (2025) — How to factor 2048 bit RSA integers with less than a million noisy qubits (arXiv)</a></li><li><a href="https://csrc.nist.gov/projects/post-quantum-cryptography" target="_blank" rel="noopener">NIST — Dự án Mật mã hậu lượng tử</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tìm cấp của 2 modulo 15 và dùng nó để phân tích 15.</li><li>Với N = 15, vì sao a = 14 thất bại?</li><li>Phân tích 35 bằng a = 2 (cấp r = 12).</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 2, 4, 8, 1 ⇒ r = 4; 2<sup>2</sup> = 4; gcd(3, 15) = 3, gcd(5, 15) = 5. 2) 14 ≡ −1, nên 14<sup>2</sup> ≡ 1: r = 2 và a<sup>r/2</sup> = 14 ≡ −1 (mod 15); gcd là 1 và 15. 3) 2<sup>6</sup> = 64 ≡ 29 (mod 35), 29 ≢ 34; gcd(28, 35) = 7 và gcd(30, 35) = 5, nên 35 = 7 × 5.</p></div>`);

const q9 = QZ(9, 'Quiz — Chapter 9: Grover, QFT and Shor|||Quiz — Chương 9: Grover, QFT và Shor', 'Kiểm tra chương 9: vòng lặp Grover, góc θ, số vòng lặp tối ưu, quá đà, QFT và chu kỳ, chi phí mạch, quy phân tích thừa số về tìm cấp, ước lượng tài nguyên.', [
  Q('q1', 'One Grover iteration consists of|||Một vòng lặp Grover gồm',
    ['a measurement followed by a reset|||một phép đo rồi đặt lại', 'the phase oracle followed by the diffusion 2|s⟩⟨s| − I|||oracle pha rồi phép khuếch tán 2|s⟩⟨s| − I', 'a QFT followed by an inverse QFT|||một QFT rồi một QFT ngược', 'a CNOT on every pair of qubits|||một CNOT trên mỗi cặp qubit'], 1,
    'G = D·O: reflect about |w⊥⟩, then about |s⟩.|||G = D·O: phản xạ qua |w⊥⟩, rồi qua |s⟩.'),
  Q('q2', 'With N = 4 and one marked item, the success probability after one Grover iteration is|||Với N = 4 và một phần tử đánh dấu, xác suất thành công sau một vòng lặp Grover là',
    ['1/4|||1/4', '1/2|||1/2', '3/4|||3/4', '1|||1'], 3,
    'sin θ = 1/2, θ = 30°, sin²(3θ) = sin²(90°) = 1.|||sin θ = 1/2, θ = 30°, sin²(3θ) = sin²(90°) = 1.'),
  Q('q3', 'For N = 8, P₂ ≈ 0.945 but P₃ ≈ 0.330. This shows|||Với N = 8, P₂ ≈ 0,945 nhưng P₃ ≈ 0,330. Điều này cho thấy',
    ['a bug in the simulator|||lỗi trong trình mô phỏng', 'overshooting: the state rotates past |w⟩|||quá đà: trạng thái quay vượt qua |w⟩', 'decoherence|||mất kết hợp', 'that Grover only works for N = 4|||Grover chỉ đúng với N = 4'], 1,
    'Each iteration rotates by 2θ; after the optimum the angle passes 90°.|||Mỗi vòng quay 2θ; qua điểm tối ưu thì góc vượt 90°.'),
  Q('q4', 'For N = 2²⁰ the optimal number of Grover iterations is about|||Với N = 2²⁰, số vòng lặp Grover tối ưu khoảng',
    ['20|||20', '804|||804', '524 288|||524 288', '1 048 576|||1 048 576'], 1,
    '(π/4)√N = (π/4)·1024 ≈ 804.|||(π/4)√N = (π/4)·1024 ≈ 804.'),
  Q('q5', 'The speed-up of Grover’s algorithm for unstructured search is|||Mức tăng tốc của Grover với tìm kiếm không cấu trúc là',
    ['exponential|||hàm mũ', 'none|||không có', 'quadratic, and provably optimal|||bậc hai, và tối ưu đã chứng minh', 'logarithmic|||logarit'], 2,
    '√N vs N; no quantum algorithm does better for unstructured search.|||√N so với N; không thuật toán lượng tử nào tốt hơn với tìm kiếm không cấu trúc.'),
  Q('q6', 'The QFT on N = 2 amplitudes is the gate|||QFT trên N = 2 biên độ là cổng',
    ['X|||X', 'H|||H', 'S|||S', 'CNOT|||CNOT'], 1,
    'ω = e^(iπ) = −1 gives (1/√2)(1, 1; 1, −1) = H.|||ω = e^(iπ) = −1 cho (1/√2)(1, 1; 1, −1) = H.'),
  Q('q7', 'A state on N = 16 with period r = 4 is measured after the QFT. Possible outcomes are|||Một trạng thái trên N = 16 có chu kỳ r = 4 được đo sau QFT. Các kết quả có thể là',
    ['0, 1, 2, 3|||0, 1, 2, 3', '0, 4, 8, 12|||0, 4, 8, 12', 'only 4|||chỉ 4', 'any k with equal probability|||mọi k với xác suất như nhau'], 1,
    'Multiples of N/r = 4, each with probability 1/4.|||Các bội của N/r = 4, mỗi giá trị xác suất 1/4.'),
  Q('q8', 'Why does the QFT not speed up computing Fourier transforms of a data set?|||Vì sao QFT không tăng tốc việc tính biến đổi Fourier của một tập dữ liệu?',
    ['It is not unitary|||Nó không unita', 'It needs more gates than the FFT|||Nó cần nhiều cổng hơn FFT', 'The output amplitudes cannot be read; a measurement gives one sample|||Không đọc được biên độ đầu ra; phép đo chỉ cho một mẫu', 'It only works for N = 4|||Nó chỉ đúng với N = 4'], 2,
    'O(n²) gates, but 2ⁿ amplitudes are not accessible.|||O(n²) cổng, nhưng 2ⁿ biên độ không truy cập được.'),
  Q('q9', 'For N = 15 and a = 7 the order is r = 4. The factors obtained are|||Với N = 15 và a = 7, cấp là r = 4. Các thừa số thu được là',
    ['gcd(48, 15) and gcd(50, 15) = 3 and 5|||gcd(48, 15) và gcd(50, 15) = 3 và 5', '7 and 15|||7 và 15', '1 and 15|||1 và 15', '4 and 13|||4 và 13'], 0,
    '7² = 49; gcd(49 − 1, 15) = 3, gcd(49 + 1, 15) = 5 (same as using 49 ≡ 4).|||7² = 49; gcd(49 − 1, 15) = 3, gcd(49 + 1, 15) = 5 (giống dùng 49 ≡ 4).'),
  Q('q10', 'Which part of Shor’s algorithm needs a quantum computer?|||Phần nào của thuật toán Shor cần máy lượng tử?',
    ['Computing gcd with Euclid’s algorithm|||Tính gcd bằng thuật toán Euclid', 'Choosing a random a|||Chọn a ngẫu nhiên', 'Continued fractions|||Liên phân số', 'Finding the order r (phase estimation + QFT)|||Tìm cấp r (ước lượng pha + QFT)'], 3,
    'Everything else is efficient classical number theory.|||Mọi phần khác là lý thuyết số cổ điển hiệu quả.'),
]);

const ch9 = {
  title: 'Chapter 9 — Grover search, the quantum Fourier transform and Shor’s algorithm (ideas)|||Chương 9 — Tìm kiếm Grover, biến đổi Fourier lượng tử và thuật toán Shor (ý tưởng)',
  description: 'Thuật toán Grover (khuếch đại biên độ, hình học phép quay, số vòng lặp tối ưu), biến đổi Fourier lượng tử (ma trận, chi phí, chu kỳ → đỉnh), ước lượng pha và ý tưởng thuật toán Shor (tìm cấp, gcd, liên phân số), ước lượng tài nguyên RSA-2048 và mật mã hậu lượng tử (Nielsen & Chuang ch.5–6 · Watrous Lessons 7–8).',
  lessons: [c91, c92, c93, q9],
};

// ───────────────────────────── Chương 10 — Nhiễu, sửa lỗi, phần cứng & Qiskit ─────────────────────────────
const c101 = L('qtc211-ts-10-1',
  '10.1 — Noise and decoherence: bit flips, phase flips and why errors accumulate|||10.1 — Nhiễu và mất kết hợp: lật bit, lật pha và vì sao lỗi tích luỹ',
  'Mô hình nhiễu đơn giản (lật bit X, lật pha Z, khử cực = Pauli ngẫu nhiên với xác suất p), T1 hồi phục và T2 khử pha, độ trung thực cổng và luật f^G, mô phỏng Monte Carlo trạng thái Bell bị nhiễu bằng numpy.',
  `<span class="eyebrow">QTC211 · Chapter 10 · Lesson 10.1</span>
<h2>Noise and decoherence: bit flips, phase flips and why errors accumulate</h2>
<p class="lead">Everything so far assumed perfect gates and perfectly isolated qubits. Real qubits leak information into their environment and real gates are slightly wrong. This lesson gives you a simple, honest model of noise and shows with numbers why long algorithms are impossible without error correction.</p>
<h3>🎯 Objectives</h3>
<ul><li>Describe bit-flip, phase-flip and depolarizing noise as “with probability p, apply a Pauli error”.</li><li>Explain T1 (energy relaxation) and T2 (dephasing) qualitatively.</li><li>Estimate the success probability of a circuit from its gate fidelity with the rule f<sup>G</sup>.</li><li>Simulate a noisy Bell-state experiment with numpy and compare it to the formula 2p(1 − p).</li></ul>
<h3>📖 Lecture</h3>
<p>A qubit is a physical object — a superconducting circuit, an ion, an atom, a photon. It is never perfectly isolated, so the environment slowly “measures” it. That process, called <strong>decoherence</strong>, turns a superposition into something that behaves like a classical random bit, and it destroys exactly the phases that quantum algorithms rely on. On top of that, every gate is implemented by a control pulse that is never exactly right.</p>
<p>The simplest useful way to describe noise reuses the Pauli gates from Chapter 4. A <strong>noise channel</strong> says: with some probability, an unwanted gate is applied.</p>
<div class="formula"><span class="lbl">Three standard error models (one qubit)</span><b>bit flip:</b> with probability p apply X (|0⟩ ↔ |1⟩)<br><b>phase flip:</b> with probability p apply Z (|+⟩ ↔ |−⟩)<br><b>depolarizing:</b> with probability p apply X, Y or Z, each with probability p/3</div>
<p>A phase flip is invisible if you measure in the computational basis (Z|0⟩ = |0⟩, Z|1⟩ = −|1⟩ gives the same probabilities), but it ruins interference: in the Hadamard basis it swaps |+⟩ and |−⟩. A depolarizing error flips a computational-basis measurement only when the error is X or Y, so with probability 2p/3. The rigorous language for such “random unitaries” is the <strong>density matrix</strong> and <strong>quantum channels</strong> (Watrous Lessons 9–10); in this course we simulate noise by sampling which error happened, which gives the same statistics.</p>
<p>Hardware papers describe decoherence with two time constants:</p>
<ul><li><strong>T1 — energy relaxation:</strong> an excited qubit |1⟩ decays to |0⟩. After a time comparable to T1 a stored 1 has a large chance of reading as 0 (a bit-flip-like error, but biased towards 0).</li><li><strong>T2 — dephasing:</strong> the relative phase between |0⟩ and |1⟩ drifts randomly, so |+⟩ gradually becomes an equal mixture of |+⟩ and |−⟩ (a phase-flip-like error). The phase coherence shrinks roughly like e<sup>−t/T2</sup>; physics forces T2 ≤ 2·T1.</li></ul>
<p>Every gate takes time and adds its own error, described by its <strong>fidelity</strong> f (the chance it does the right thing; error rate 1 − f). If errors are independent, a circuit of G gates succeeds with probability about f<sup>G</sup>. This tiny formula is the most important fact about today's machines.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — errors accumulate.</b> Gate fidelity f = 0.999 (error 0.1 %, a good two-qubit gate today).</p>
<p>Step 1: G = 100 gates ⇒ 0.999<sup>100</sup> ≈ <b>0.905</b>. Step 2: G = 1000 ⇒ 0.999<sup>1000</sup> ≈ <b>0.368</b> (about e<sup>−1</sup>). Step 3: G = 10 000 ⇒ about 4.5 × 10<sup>−5</sup> — essentially always wrong. Shor's algorithm for a 2048-bit number needs billions of gates, so no improvement of f alone can save it; we need error <em>correction</em> (Lesson 10.2).</p></div>
<pre><code class="language-python">for f in (0.999, 0.9999):
    print(f, [format(f ** G, ".3g") for G in (10, 100, 1000, 10000)])</code></pre>
<div class="out">0.999 ['0.99', '0.905', '0.368', '4.52e-05']
0.9999 ['0.999', '0.99', '0.905', '0.368']</div>
<div class="callout"><p><b>Example 2 — a noisy Bell experiment.</b> Prepare Φ<sup>+</sup> = (|00⟩ + |11⟩)/√2 and measure both qubits. Ideally the two bits always agree. Now let each qubit suffer an independent bit flip with probability p just before measurement.</p>
<p>Step 1: the bits disagree exactly when <em>one</em> of the two qubits flipped: probability p(1 − p) + (1 − p)p = <b>2p(1 − p)</b>. Step 2: two flips cancel (X⊗X Φ<sup>+</sup> = Φ<sup>+</sup>), so they are harmless here. Step 3: for p = 0.05 we expect 0.095 mismatches. The simulation below samples which errors occurred, applies them to the state vector and then samples the measurement (20 000 shots, statistical uncertainty about ±0.003).</p></div>
<pre><code class="language-python">import numpy as np
rng = np.random.default_rng(7)
X = np.array([[0, 1], [1, 0]]); I2 = np.eye(2)
X0, X1 = np.kron(X, I2), np.kron(I2, X)          # X on qubit 0 / qubit 1
bell = np.array([1, 0, 0, 1]) / np.sqrt(2)          # (|00&gt; + |11&gt;)/sqrt2

def shot(p):
    psi = bell.copy()
    if rng.random() &lt; p: psi = X0 @ psi             # bit-flip noise on q0
    if rng.random() &lt; p: psi = X1 @ psi             # bit-flip noise on q1
    k = rng.choice(4, p=np.abs(psi) ** 2)           # measure both qubits
    return k in (1, 2)                              # '01' or '10' = mismatch

for p in (0.0, 0.01, 0.05, 0.1):
    rate = np.mean([shot(p) for _ in range(20000)])
    print("p =", p, " mismatch =", round(rate, 4), " theory 2p(1-p) =", round(2 * p * (1 - p), 4))</code></pre>
<div class="out">p = 0.0  mismatch = 0.0  theory 2p(1-p) = 0.0
p = 0.01  mismatch = 0.02  theory 2p(1-p) = 0.0198
p = 0.05  mismatch = 0.0968  theory 2p(1-p) = 0.095
p = 0.1  mismatch = 0.175  theory 2p(1-p) = 0.18</div>
<p>The measured rates agree with 2p(1 − p) within sampling error. Real devices report exactly this kind of number as <em>readout</em> plus <em>gate</em> error.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Thinking a phase flip is harmless because computational-basis probabilities do not change. It is the error that destroys interference — Deutsch–Jozsa and Grover fail completely under phase noise.</li><li>Adding error rates instead of multiplying fidelities. 1000 gates with 0.1 % error do not give “100 % error”; they give success ≈ 0.368. The additive estimate G(1 − f) is only good when it is small.</li><li>Assuming the environment is a “small correction” that can be ignored for short times. Coherence times are microseconds to seconds depending on the platform; gate times must be compared with them.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Noise model: with probability p apply X (bit flip), Z (phase flip) or a random Pauli (depolarizing).</li><li>T1 = decay |1⟩ → |0⟩; T2 = loss of relative phase; T2 ≤ 2T1.</li><li>A circuit of G gates of fidelity f succeeds with probability ≈ f<sup>G</sup>: 0.999<sup>1000</sup> ≈ 0.37.</li><li>Noise is simulated by sampling which Pauli error occurred; the rigorous tool is the density matrix.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Quantum_decoherence" target="_blank" rel="noopener">Wikipedia — Quantum decoherence</a></li><li><a href="https://www.youtube.com/watch?v=cMl-xIDSmXI" target="_blank" rel="noopener">Qiskit — Understanding Quantum Information &amp; Computation, Lesson 10: Quantum Channels (Watrous)</a></li><li><a href="https://github.com/Qiskit/documentation/blob/main/learning/courses/foundations-of-quantum-error-correction/correcting-quantum-errors/discretization-of-errors.ipynb" target="_blank" rel="noopener">IBM Quantum Learning (Watrous) — Discretization of errors (source notebook)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>A circuit has 50 two-qubit gates with fidelity 0.995 and 200 one-qubit gates with fidelity 0.9995. Estimate its success probability.</li><li>You want a 1000-gate circuit to succeed with probability at least 0.9. What gate error rate do you need?</li><li>Under depolarizing noise with p = 0.03, what is the probability that measuring |0⟩ in the computational basis gives 1?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 0.995<sup>50</sup> · 0.9995<sup>200</sup> ≈ 0.778 · 0.905 ≈ <b>0.70</b>. 2) f<sup>1000</sup> ≥ 0.9 ⇒ f ≥ 0.9<sup>1/1000</sup> ≈ 0.999895, i.e. error ≤ about <b>1.05 × 10<sup>−4</sup></b> — ten times better than today's good two-qubit gates. 3) Only X or Y flip |0⟩: 2p/3 = <b>0.02</b>.</p></div>`,
  `<span class="eyebrow">QTC211 · Chương 10 · Bài 10.1</span>
<h2>Nhiễu và mất kết hợp: lật bit, lật pha và vì sao lỗi tích luỹ</h2>
<p class="lead">Từ đầu môn tới giờ ta giả sử cổng hoàn hảo và qubit cách ly tuyệt đối. Qubit thật rò rỉ thông tin ra môi trường, cổng thật luôn lệch một chút. Bài này cho bạn một mô hình nhiễu đơn giản mà trung thực, và chứng minh bằng con số vì sao thuật toán dài không thể chạy nếu không có sửa lỗi.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Mô tả nhiễu lật bit, lật pha và khử cực theo kiểu “với xác suất p, áp một lỗi Pauli”.</li><li>Giải thích định tính T1 (hồi phục năng lượng) và T2 (khử pha).</li><li>Ước lượng xác suất thành công của một mạch từ độ trung thực cổng bằng luật f<sup>G</sup>.</li><li>Mô phỏng thí nghiệm trạng thái Bell bị nhiễu bằng numpy và so với công thức 2p(1 − p).</li></ul>
<h3>📖 Bài giảng</h3>
<p>Qubit là một vật thể thật — mạch siêu dẫn, ion, nguyên tử, photon. Nó không bao giờ cách ly hoàn toàn, nên môi trường dần dần “đo” nó. Quá trình đó gọi là <strong>mất kết hợp (decoherence)</strong>: nó biến một chồng chập thành thứ cư xử như bit ngẫu nhiên cổ điển, và phá đúng những pha mà thuật toán lượng tử dựa vào. Thêm nữa, mỗi cổng được thực hiện bằng một xung điều khiển không bao giờ chính xác tuyệt đối.</p>
<p>Cách đơn giản mà hữu ích nhất để mô tả nhiễu là dùng lại các cổng Pauli ở Chương 4. Một <strong>kênh nhiễu</strong> nói: với một xác suất nào đó, có một cổng ngoài ý muốn bị áp vào.</p>
<div class="formula"><span class="lbl">Ba mô hình lỗi chuẩn (một qubit)</span><b>lật bit:</b> với xác suất p áp X (|0⟩ ↔ |1⟩)<br><b>lật pha:</b> với xác suất p áp Z (|+⟩ ↔ |−⟩)<br><b>khử cực:</b> với xác suất p áp X, Y hoặc Z, mỗi loại xác suất p/3</div>
<p>Lỗi lật pha vô hình nếu bạn đo ở cơ sở tính toán (Z|0⟩ = |0⟩, Z|1⟩ = −|1⟩ cho cùng xác suất), nhưng nó phá giao thoa: ở cơ sở Hadamard nó đổi |+⟩ thành |−⟩. Lỗi khử cực làm sai phép đo cơ sở tính toán chỉ khi lỗi là X hoặc Y, tức với xác suất 2p/3. Ngôn ngữ chặt chẽ cho các “unita ngẫu nhiên” này là <strong>ma trận mật độ</strong> và <strong>kênh lượng tử</strong> (Watrous Bài 9–10); trong môn này ta mô phỏng nhiễu bằng cách bốc thăm xem lỗi nào xảy ra, cho đúng cùng thống kê.</p>
<p>Bài báo phần cứng mô tả mất kết hợp bằng hai hằng số thời gian:</p>
<ul><li><strong>T1 — hồi phục năng lượng:</strong> qubit ở trạng thái kích thích |1⟩ rơi về |0⟩. Sau khoảng thời gian cỡ T1, một số 1 đã lưu có nhiều khả năng đọc ra 0 (lỗi giống lật bit, nhưng lệch về phía 0).</li><li><strong>T2 — khử pha:</strong> pha tương đối giữa |0⟩ và |1⟩ trôi ngẫu nhiên, nên |+⟩ dần thành hỗn hợp đều của |+⟩ và |−⟩ (lỗi giống lật pha). Độ kết hợp pha giảm cỡ e<sup>−t/T2</sup>; vật lý buộc T2 ≤ 2·T1.</li></ul>
<p>Mỗi cổng tốn thời gian và thêm lỗi riêng, mô tả bằng <strong>độ trung thực (fidelity)</strong> f (khả năng nó làm đúng; tỉ lệ lỗi 1 − f). Nếu lỗi độc lập, một mạch G cổng thành công với xác suất khoảng f<sup>G</sup>. Công thức bé xíu này là sự thật quan trọng nhất về máy lượng tử hiện nay.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — lỗi tích luỹ.</b> Độ trung thực cổng f = 0,999 (lỗi 0,1 %, một cổng hai qubit tốt hiện nay).</p>
<p>Bước 1: G = 100 cổng ⇒ 0,999<sup>100</sup> ≈ <b>0,905</b>. Bước 2: G = 1000 ⇒ 0,999<sup>1000</sup> ≈ <b>0,368</b> (xấp xỉ e<sup>−1</sup>). Bước 3: G = 10 000 ⇒ khoảng 4,5 × 10<sup>−5</sup> — gần như luôn sai. Thuật toán Shor cho số 2048 bit cần hàng tỉ cổng, nên chỉ cải thiện f thôi thì không cứu được; ta cần <em>sửa</em> lỗi (Bài 10.2).</p></div>
<pre><code class="language-python">for f in (0.999, 0.9999):
    print(f, [format(f ** G, ".3g") for G in (10, 100, 1000, 10000)])</code></pre>
<div class="out">0.999 ['0.99', '0.905', '0.368', '4.52e-05']
0.9999 ['0.999', '0.99', '0.905', '0.368']</div>
<div class="callout"><p><b>Ví dụ 2 — thí nghiệm Bell bị nhiễu.</b> Tạo Φ<sup>+</sup> = (|00⟩ + |11⟩)/√2 rồi đo cả hai qubit. Lý tưởng thì hai bit luôn trùng nhau. Giờ cho mỗi qubit bị lật bit độc lập với xác suất p ngay trước khi đo.</p>
<p>Bước 1: hai bit lệch nhau đúng khi <em>một</em> trong hai qubit bị lật: xác suất p(1 − p) + (1 − p)p = <b>2p(1 − p)</b>. Bước 2: hai lần lật triệt tiêu nhau (X⊗X Φ<sup>+</sup> = Φ<sup>+</sup>), nên ở đây vô hại. Bước 3: với p = 0,05 ta chờ 0,095 lần lệch. Mô phỏng dưới đây bốc thăm lỗi nào xảy ra, áp lỗi vào vectơ trạng thái rồi bốc thăm kết quả đo (20 000 lượt, sai số thống kê cỡ ±0,003).</p></div>
<pre><code class="language-python">import numpy as np
rng = np.random.default_rng(7)
X = np.array([[0, 1], [1, 0]]); I2 = np.eye(2)
X0, X1 = np.kron(X, I2), np.kron(I2, X)          # X on qubit 0 / qubit 1
bell = np.array([1, 0, 0, 1]) / np.sqrt(2)          # (|00&gt; + |11&gt;)/sqrt2

def shot(p):
    psi = bell.copy()
    if rng.random() &lt; p: psi = X0 @ psi             # bit-flip noise on q0
    if rng.random() &lt; p: psi = X1 @ psi             # bit-flip noise on q1
    k = rng.choice(4, p=np.abs(psi) ** 2)           # measure both qubits
    return k in (1, 2)                              # '01' or '10' = mismatch

for p in (0.0, 0.01, 0.05, 0.1):
    rate = np.mean([shot(p) for _ in range(20000)])
    print("p =", p, " mismatch =", round(rate, 4), " theory 2p(1-p) =", round(2 * p * (1 - p), 4))</code></pre>
<div class="out">p = 0.0  mismatch = 0.0  theory 2p(1-p) = 0.0
p = 0.01  mismatch = 0.02  theory 2p(1-p) = 0.0198
p = 0.05  mismatch = 0.0968  theory 2p(1-p) = 0.095
p = 0.1  mismatch = 0.175  theory 2p(1-p) = 0.18</div>
<p>Tỉ lệ đo được khớp với 2p(1 − p) trong phạm vi sai số lấy mẫu. Thiết bị thật công bố đúng loại số này dưới tên lỗi <em>đọc (readout)</em> và lỗi <em>cổng</em>.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Nghĩ lỗi lật pha vô hại vì xác suất ở cơ sở tính toán không đổi. Chính nó phá giao thoa — Deutsch–Jozsa và Grover hỏng hoàn toàn dưới nhiễu pha.</li><li>Cộng tỉ lệ lỗi thay vì nhân độ trung thực. 1000 cổng lỗi 0,1 % không cho “lỗi 100 %”; chúng cho xác suất thành công ≈ 0,368. Ước lượng cộng G(1 − f) chỉ đúng khi nó nhỏ.</li><li>Coi môi trường là “hiệu chỉnh nhỏ” bỏ qua được với thời gian ngắn. Thời gian kết hợp từ micro giây tới giây tuỳ nền tảng; phải so thời gian cổng với nó.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Mô hình nhiễu: với xác suất p áp X (lật bit), Z (lật pha) hoặc một Pauli ngẫu nhiên (khử cực).</li><li>T1 = rơi |1⟩ → |0⟩; T2 = mất pha tương đối; T2 ≤ 2T1.</li><li>Mạch G cổng độ trung thực f thành công với xác suất ≈ f<sup>G</sup>: 0,999<sup>1000</sup> ≈ 0,37.</li><li>Mô phỏng nhiễu bằng cách bốc thăm lỗi Pauli nào xảy ra; công cụ chặt chẽ là ma trận mật độ.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Quantum_decoherence" target="_blank" rel="noopener">Wikipedia — Mất kết hợp lượng tử</a></li><li><a href="https://www.youtube.com/watch?v=cMl-xIDSmXI" target="_blank" rel="noopener">Qiskit — Understanding Quantum Information &amp; Computation, Lesson 10: Kênh lượng tử (Watrous)</a></li><li><a href="https://github.com/Qiskit/documentation/blob/main/learning/courses/foundations-of-quantum-error-correction/correcting-quantum-errors/discretization-of-errors.ipynb" target="_blank" rel="noopener">IBM Quantum Learning (Watrous) — Rời rạc hoá lỗi (notebook gốc)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Một mạch có 50 cổng hai qubit độ trung thực 0,995 và 200 cổng một qubit độ trung thực 0,9995. Ước lượng xác suất thành công.</li><li>Bạn muốn mạch 1000 cổng thành công với xác suất ít nhất 0,9. Cần tỉ lệ lỗi cổng bao nhiêu?</li><li>Dưới nhiễu khử cực p = 0,03, xác suất đo |0⟩ ở cơ sở tính toán ra 1 là bao nhiêu?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 0,995<sup>50</sup> · 0,9995<sup>200</sup> ≈ 0,778 · 0,905 ≈ <b>0,70</b>. 2) f<sup>1000</sup> ≥ 0,9 ⇒ f ≥ 0,9<sup>1/1000</sup> ≈ 0,999895, tức lỗi ≤ khoảng <b>1,05 × 10<sup>−4</sup></b> — tốt hơn mười lần cổng hai qubit tốt hiện nay. 3) Chỉ X hoặc Y lật |0⟩: 2p/3 = <b>0,02</b>.</p></div>`);

const c102 = L('qtc211-ts-10-2',
  '10.2 — Introduction to quantum error correction: repetition codes, Shor code, surface code|||10.2 — Nhập môn sửa lỗi lượng tử: mã lặp, mã Shor, mã bề mặt',
  'Mã lật bit 3 qubit (mã hoá bằng 2 CNOT, đo hội chứng Z0Z1 và Z1Z2 bằng ancilla, bảng sửa), tỉ lệ lỗi logic 3p² − 2p³ so với mô phỏng numpy, mã lật pha, mã Shor 9 qubit, rời rạc hoá lỗi, mã bề mặt và ngưỡng, kết quả Willow 2024.',
  `<span class="eyebrow">QTC211 · Chapter 10 · Lesson 10.2</span>
<h2>Introduction to quantum error correction: repetition codes, Shor code, surface code</h2>
<p class="lead">Classical computers fight noise by copying bits. Quantum computers cannot copy (no-cloning) and cannot look at the data without collapsing it. Quantum error correction gets around both obstacles with one trick: measure only <em>parities</em> that reveal the error but nothing about the data.</p>
<h3>🎯 Objectives</h3>
<ul><li>Encode α|0⟩ + β|1⟩ into the 3-qubit bit-flip code with two CNOTs.</li><li>Use the syndrome (Z0Z1, Z1Z2) to locate and correct a single bit flip.</li><li>Derive the logical error rate 3p<sup>2</sup> − 2p<sup>3</sup> and check it by simulation.</li><li>Explain the phase-flip code, the Shor code, discretization of errors and the threshold idea behind the surface code.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>Encoding.</strong> Start with the data |ψ⟩ = α|0⟩ + β|1⟩ on q0 and two fresh qubits in |0⟩. Apply CNOT<sub>01</sub> and CNOT<sub>02</sub>. Since CNOT copies basis states, the result is α|000⟩ + β|111⟩. This is <em>not</em> three copies of |ψ⟩ (that would be |ψ⟩⊗|ψ⟩⊗|ψ⟩, forbidden by no-cloning) — it is one <strong>logical qubit</strong> spread over three physical qubits: |0<sub>L</sub>⟩ = |000⟩, |1<sub>L</sub>⟩ = |111⟩.</p>
<p><strong>Syndrome.</strong> Suppose X hits q1: the state becomes α|010⟩ + β|101⟩. Measuring the qubits would destroy α and β. Instead we measure two parities, the observables Z0Z1 and Z1Z2 (eigenvalue +1 if the two bits agree, −1 if they differ). Both branches |010⟩ and |101⟩ give the <em>same</em> answers, so measuring them reveals the error and nothing about α, β. In a circuit, each parity is copied onto an ancilla qubit with two CNOTs and the ancilla is measured.</p>
<div class="formula"><span class="lbl">Syndrome table (single bit flip)</span>(Z0Z1, Z1Z2) = (+1, +1) → no error    (−1, +1) → flip q0    (−1, −1) → flip q1    (+1, −1) → flip q2</div>
<p><strong>Logical error rate.</strong> If each qubit flips independently with probability p, the code fails only when two or three qubits flip (the majority is then wrong and the “correction” makes things worse):</p>
<div class="formula"><span class="lbl">3-qubit repetition code</span>p<sub>L</sub> = 3p<sup>2</sup>(1 − p) + p<sup>3</sup> = 3p<sup>2</sup> − 2p<sup>3</sup>    and    p<sub>L</sub> &lt; p  ⇔  p &lt; 1/2</div>
<p>For p = 0.01 this gives p<sub>L</sub> = 0.000298, about 34 times better than an unprotected qubit.</p>
<p><strong>Phase flips and the Shor code.</strong> A Z error is a bit flip in the Hadamard basis, so the <strong>phase-flip code</strong> is the same code with H applied to each qubit: |+++⟩ and |−−−⟩, with syndromes X0X1 and X1X2. Peter Shor (1995) nested the two: 3 blocks of 3 qubits give the <strong>9-qubit Shor code</strong>, which corrects an arbitrary error on any one qubit. Why “arbitrary”? Any one-qubit error matrix is a combination aI + bX + cY + dZ; measuring the syndrome <em>collapses</em> it onto one of these Paulis, which is then corrected. This <strong>discretization of errors</strong> is why fixing just X and Z is enough.</p>
<p><strong>Surface code and threshold.</strong> Modern hardware uses the <strong>surface code</strong>: qubits on a 2-D grid, each check involves only 4 neighbours. Increasing its <em>distance</em> d (the grid size) suppresses logical errors exponentially — <em>if</em> the physical error rate is below a <strong>threshold</strong> (of the order of 1 % for the surface code). Above threshold, bigger codes are worse. In 2024 Google reported on its Willow processor a distance-7 surface-code memory using 101 qubits with 0.143 % logical error per correction cycle; the error was suppressed by a factor Λ = 2.14 each time the distance increased by 2, and the logical qubit outlived its best physical qubit by a factor 2.4 (Nature, 2024).</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — locate the error.</b> Encoded state 0.6|000⟩ + 0.8i|111⟩, X error on q1 ⇒ 0.6|010⟩ + 0.8i|101⟩.</p>
<p>Step 1: Z0Z1 on |010⟩: bits 0,1 differ ⇒ −1; on |101⟩ also differ ⇒ −1. Step 2: Z1Z2: bits 1,2 differ in both ⇒ −1. Step 3: syndrome (−1, −1) ⇒ apply X to q1 ⇒ back to 0.6|000⟩ + 0.8i|111⟩, with α and β never measured.</p></div>
<div class="callout"><p><b>Example 2 — when the code fails.</b> X on q0 and q1: |000⟩ → |110⟩. Syndrome: Z0Z1 = +1 (bits agree), Z1Z2 = −1 ⇒ table says “flip q2” ⇒ |111⟩. The decoder turned |0<sub>L</sub>⟩ into |1<sub>L</sub>⟩: a <b>logical error</b>. This happens with probability ≈ 3p<sup>2</sup>.</p></div>
<p>The numpy simulation below encodes a state, applies random bit flips, reads the two parities (computed as expectation values — the noisy states here are eigenstates of Z0Z1 and Z1Z2, so this equals what the ancilla circuit would measure), corrects, and checks whether the original logical state came back:</p>
<pre><code class="language-python">import numpy as np
rng = np.random.default_rng(2026)
I = np.eye(2); X = np.array([[0, 1], [1, 0]]); Z = np.diag([1, -1])

def on(gate, k, n=3):                       # gate acting on qubit k of n (q0 leftmost)
    m = np.array([[1.0]])
    for j in range(n):
        m = np.kron(m, gate if j == k else I)
    return m

Z0Z1, Z1Z2 = on(Z, 0) @ on(Z, 1), on(Z, 1) @ on(Z, 2)
FIX = {(1, 1): None, (-1, 1): 0, (-1, -1): 1, (1, -1): 2}   # syndrome -&gt; qubit to flip

def encode(a, b):                            # a|000&gt; + b|111&gt;
    psi = np.zeros(8, complex); psi[0b000] = a; psi[0b111] = b
    return psi

def syndrome(psi):                           # the two parities an ancilla circuit would read out
    return (round(np.vdot(psi, Z0Z1 @ psi).real), round(np.vdot(psi, Z1Z2 @ psi).real))

def trial(p, a=0.6, b=0.8j):
    good = encode(a, b); psi = good.copy()
    for k in range(3):
        if rng.random() &lt; p: psi = on(X, k) @ psi
    k = FIX[syndrome(psi)]
    if k is not None: psi = on(X, k) @ psi
    return abs(np.vdot(good, psi)) ** 2 &lt; 0.5   # True = logical error

bad = on(X, 1) @ encode(0.6, 0.8j)
print("error on q1 -&gt; syndrome", syndrome(bad), "-&gt; flip qubit", FIX[syndrome(bad)])
for p in (0.05, 0.1, 0.2):
    n = 40000
    fail = np.mean([trial(p) for _ in range(n)])
    print("p =", p, " logical error =", round(fail, 4), " theory 3p^2-2p^3 =", round(3*p**2 - 2*p**3, 4))</code></pre>
<div class="out">error on q1 -&gt; syndrome (-1, -1) -&gt; flip qubit 1
p = 0.05  logical error = 0.0075  theory 3p^2-2p^3 = 0.0073
p = 0.1  logical error = 0.0281  theory 3p^2-2p^3 = 0.028
p = 0.2  logical error = 0.106  theory 3p^2-2p^3 = 0.104</div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Encoding as |ψ⟩|ψ⟩|ψ⟩. That is cloning and is impossible; the code state is α|000⟩ + β|111⟩.</li><li>Measuring the data qubits to find the error. That collapses α|0⟩ + β|1⟩; only parities may be measured.</li><li>Believing more qubits always help. Above threshold (here p ≥ 1/2 for the toy code, around 1 % for the surface code on real noise) adding qubits adds more errors than it removes.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Bit-flip code: α|000⟩ + β|111⟩ via CNOT<sub>01</sub>, CNOT<sub>02</sub>; syndrome (Z0Z1, Z1Z2) locates one flip.</li><li>Logical error 3p<sup>2</sup> − 2p<sup>3</sup>: 0.000298 at p = 0.01.</li><li>Phase-flip code = bit-flip code in the |±⟩ basis; Shor's 9-qubit code corrects any single-qubit error.</li><li>Syndrome measurement discretizes errors into Paulis.</li><li>Surface code: exponential suppression below threshold; Willow 2024 showed Λ ≈ 2.14 per distance step.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://github.com/Qiskit/documentation/blob/main/learning/courses/foundations-of-quantum-error-correction/correcting-quantum-errors/repetition-codes.ipynb" target="_blank" rel="noopener">IBM Quantum Learning (Watrous) — Repetition codes (source notebook)</a></li><li><a href="https://www.youtube.com/watch?v=OoQSdcKAIZc" target="_blank" rel="noopener">Qiskit — Understanding Quantum Information &amp; Computation, Lesson 13: Correcting Quantum Errors</a></li><li><a href="https://learn.microsoft.com/en-us/azure/quantum/concepts-error-correction" target="_blank" rel="noopener">Microsoft Learn — Quantum error correction codes</a></li><li><a href="https://www.nature.com/articles/s41586-024-08449-y" target="_blank" rel="noopener">Nature (2024) — Quantum error correction below the surface code threshold</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>The syndrome is (+1, −1). Which qubit do you flip?</li><li>Show that 3p<sup>2</sup> − 2p<sup>3</sup> &lt; p exactly when 0 &lt; p &lt; 1/2.</li><li>Which error does the 3-qubit bit-flip code fail to detect at all: X on q2, Z on q0, or X on q0 and q2 together?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Bits 0,1 agree, bits 1,2 differ ⇒ <b>q2</b>. 2) p − (3p<sup>2</sup> − 2p<sup>3</sup>) = p(2p<sup>2</sup> − 3p + 1) = p(2p − 1)(p − 1); for 0 &lt; p &lt; 1/2 both (2p − 1) and (p − 1) are negative, so the product is positive. 3) <b>Z on q0</b>: α|000⟩ − β|111⟩ has syndrome (+1, +1) — invisible to Z-parities, which is why we need the phase-flip code too. (X on q0 and q2 is detected, but mis-corrected into a logical error.)</p></div>`,
  `<span class="eyebrow">QTC211 · Chương 10 · Bài 10.2</span>
<h2>Nhập môn sửa lỗi lượng tử: mã lặp, mã Shor, mã bề mặt</h2>
<p class="lead">Máy tính cổ điển chống nhiễu bằng cách chép bit. Máy lượng tử không chép được (định lý không nhân bản) và không nhìn được dữ liệu mà không làm nó sụp đổ. Sửa lỗi lượng tử vượt cả hai trở ngại bằng một mẹo: chỉ đo các <em>tính chẵn lẻ</em> cho biết lỗi mà không cho biết gì về dữ liệu.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Mã hoá α|0⟩ + β|1⟩ vào mã lật bit 3 qubit bằng hai CNOT.</li><li>Dùng hội chứng (Z0Z1, Z1Z2) để định vị và sửa một lần lật bit.</li><li>Suy ra tỉ lệ lỗi logic 3p<sup>2</sup> − 2p<sup>3</sup> và kiểm bằng mô phỏng.</li><li>Giải thích mã lật pha, mã Shor, rời rạc hoá lỗi và ý tưởng ngưỡng đằng sau mã bề mặt.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Mã hoá.</strong> Bắt đầu với dữ liệu |ψ⟩ = α|0⟩ + β|1⟩ trên q0 và hai qubit mới ở |0⟩. Áp CNOT<sub>01</sub> và CNOT<sub>02</sub>. Vì CNOT chép được trạng thái cơ sở, kết quả là α|000⟩ + β|111⟩. Đây <em>không</em> phải ba bản sao của |ψ⟩ (thứ đó là |ψ⟩⊗|ψ⟩⊗|ψ⟩, bị cấm bởi định lý không nhân bản) — nó là một <strong>qubit logic</strong> trải trên ba qubit vật lý: |0<sub>L</sub>⟩ = |000⟩, |1<sub>L</sub>⟩ = |111⟩.</p>
<p><strong>Hội chứng (syndrome).</strong> Giả sử X đánh vào q1: trạng thái thành α|010⟩ + β|101⟩. Đo các qubit sẽ phá α và β. Thay vào đó ta đo hai tính chẵn lẻ, tức các đại lượng Z0Z1 và Z1Z2 (trị riêng +1 nếu hai bit giống nhau, −1 nếu khác). Cả hai nhánh |010⟩ và |101⟩ cho <em>cùng</em> câu trả lời, nên phép đo cho biết lỗi mà không tiết lộ gì về α, β. Trong mạch, mỗi tính chẵn lẻ được chép sang một qubit phụ (ancilla) bằng hai CNOT rồi đo ancilla.</p>
<div class="formula"><span class="lbl">Bảng hội chứng (một lần lật bit)</span>(Z0Z1, Z1Z2) = (+1, +1) → không lỗi    (−1, +1) → lật q0    (−1, −1) → lật q1    (+1, −1) → lật q2</div>
<p><strong>Tỉ lệ lỗi logic.</strong> Nếu mỗi qubit lật độc lập với xác suất p, mã chỉ thất bại khi hai hoặc ba qubit cùng lật (khi đó đa số đã sai, và “sửa” làm hỏng thêm):</p>
<div class="formula"><span class="lbl">Mã lặp 3 qubit</span>p<sub>L</sub> = 3p<sup>2</sup>(1 − p) + p<sup>3</sup> = 3p<sup>2</sup> − 2p<sup>3</sup>    và    p<sub>L</sub> &lt; p  ⇔  p &lt; 1/2</div>
<p>Với p = 0,01 ta được p<sub>L</sub> = 0,000298, tốt hơn khoảng 34 lần so với qubit không được bảo vệ.</p>
<p><strong>Lật pha và mã Shor.</strong> Lỗi Z là lỗi lật bit trong cơ sở Hadamard, nên <strong>mã lật pha</strong> là cùng mã đó với H áp lên từng qubit: |+++⟩ và |−−−⟩, hội chứng X0X1 và X1X2. Peter Shor (1995) lồng hai mã vào nhau: 3 khối mỗi khối 3 qubit cho <strong>mã Shor 9 qubit</strong>, sửa được lỗi bất kỳ trên một qubit bất kỳ. Vì sao “bất kỳ”? Mọi ma trận lỗi một qubit đều là tổ hợp aI + bX + cY + dZ; đo hội chứng làm nó <em>sụp</em> về một trong các Pauli đó, rồi ta sửa Pauli ấy. Hiện tượng <strong>rời rạc hoá lỗi</strong> này là lý do chỉ cần sửa X và Z là đủ.</p>
<p><strong>Mã bề mặt và ngưỡng.</strong> Phần cứng hiện đại dùng <strong>mã bề mặt (surface code)</strong>: qubit xếp trên lưới 2 chiều, mỗi phép kiểm chỉ đụng 4 láng giềng. Tăng <em>khoảng cách</em> d của mã (kích thước lưới) sẽ dập lỗi logic theo cấp số mũ — <em>nếu</em> tỉ lệ lỗi vật lý thấp hơn một <strong>ngưỡng</strong> (cỡ 1 % với mã bề mặt). Trên ngưỡng, mã to hơn lại tệ hơn. Năm 2024 Google công bố trên chip Willow một bộ nhớ mã bề mặt khoảng cách 7 dùng 101 qubit, lỗi logic 0,143 % mỗi chu kỳ sửa lỗi; lỗi giảm theo hệ số Λ = 2,14 mỗi lần tăng khoảng cách thêm 2, và qubit logic sống lâu hơn qubit vật lý tốt nhất của nó 2,4 lần (Nature, 2024).</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — định vị lỗi.</b> Trạng thái mã 0,6|000⟩ + 0,8i|111⟩, lỗi X trên q1 ⇒ 0,6|010⟩ + 0,8i|101⟩.</p>
<p>Bước 1: Z0Z1 trên |010⟩: bit 0, 1 khác nhau ⇒ −1; trên |101⟩ cũng khác ⇒ −1. Bước 2: Z1Z2: bit 1, 2 khác nhau ở cả hai nhánh ⇒ −1. Bước 3: hội chứng (−1, −1) ⇒ áp X lên q1 ⇒ trở về 0,6|000⟩ + 0,8i|111⟩, mà α và β chưa hề bị đo.</p></div>
<div class="callout"><p><b>Ví dụ 2 — khi mã thất bại.</b> X trên q0 và q1: |000⟩ → |110⟩. Hội chứng: Z0Z1 = +1 (hai bit giống), Z1Z2 = −1 ⇒ bảng bảo “lật q2” ⇒ |111⟩. Bộ giải mã đã biến |0<sub>L</sub>⟩ thành |1<sub>L</sub>⟩: một <b>lỗi logic</b>. Điều này xảy ra với xác suất ≈ 3p<sup>2</sup>.</p></div>
<p>Mô phỏng numpy dưới đây mã hoá một trạng thái, áp lật bit ngẫu nhiên, đọc hai tính chẵn lẻ (tính bằng giá trị kỳ vọng — các trạng thái bị nhiễu ở đây là trạng thái riêng của Z0Z1 và Z1Z2, nên kết quả đúng bằng thứ mạch ancilla sẽ đo được), sửa, rồi kiểm xem trạng thái logic ban đầu có quay lại không:</p>
<pre><code class="language-python">import numpy as np
rng = np.random.default_rng(2026)
I = np.eye(2); X = np.array([[0, 1], [1, 0]]); Z = np.diag([1, -1])

def on(gate, k, n=3):                       # gate acting on qubit k of n (q0 leftmost)
    m = np.array([[1.0]])
    for j in range(n):
        m = np.kron(m, gate if j == k else I)
    return m

Z0Z1, Z1Z2 = on(Z, 0) @ on(Z, 1), on(Z, 1) @ on(Z, 2)
FIX = {(1, 1): None, (-1, 1): 0, (-1, -1): 1, (1, -1): 2}   # syndrome -&gt; qubit to flip

def encode(a, b):                            # a|000&gt; + b|111&gt;
    psi = np.zeros(8, complex); psi[0b000] = a; psi[0b111] = b
    return psi

def syndrome(psi):                           # the two parities an ancilla circuit would read out
    return (round(np.vdot(psi, Z0Z1 @ psi).real), round(np.vdot(psi, Z1Z2 @ psi).real))

def trial(p, a=0.6, b=0.8j):
    good = encode(a, b); psi = good.copy()
    for k in range(3):
        if rng.random() &lt; p: psi = on(X, k) @ psi
    k = FIX[syndrome(psi)]
    if k is not None: psi = on(X, k) @ psi
    return abs(np.vdot(good, psi)) ** 2 &lt; 0.5   # True = logical error

bad = on(X, 1) @ encode(0.6, 0.8j)
print("error on q1 -&gt; syndrome", syndrome(bad), "-&gt; flip qubit", FIX[syndrome(bad)])
for p in (0.05, 0.1, 0.2):
    n = 40000
    fail = np.mean([trial(p) for _ in range(n)])
    print("p =", p, " logical error =", round(fail, 4), " theory 3p^2-2p^3 =", round(3*p**2 - 2*p**3, 4))</code></pre>
<div class="out">error on q1 -&gt; syndrome (-1, -1) -&gt; flip qubit 1
p = 0.05  logical error = 0.0075  theory 3p^2-2p^3 = 0.0073
p = 0.1  logical error = 0.0281  theory 3p^2-2p^3 = 0.028
p = 0.2  logical error = 0.106  theory 3p^2-2p^3 = 0.104</div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Mã hoá thành |ψ⟩|ψ⟩|ψ⟩. Đó là nhân bản, không làm được; trạng thái mã là α|000⟩ + β|111⟩.</li><li>Đo các qubit dữ liệu để tìm lỗi. Làm vậy α|0⟩ + β|1⟩ sụp đổ; chỉ được đo tính chẵn lẻ.</li><li>Tin rằng thêm qubit luôn có lợi. Trên ngưỡng (ở đây p ≥ 1/2 với mã đồ chơi, cỡ 1 % với mã bề mặt dưới nhiễu thật) thêm qubit là thêm lỗi nhiều hơn số lỗi sửa được.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Mã lật bit: α|000⟩ + β|111⟩ qua CNOT<sub>01</sub>, CNOT<sub>02</sub>; hội chứng (Z0Z1, Z1Z2) định vị một lần lật.</li><li>Lỗi logic 3p<sup>2</sup> − 2p<sup>3</sup>: 0,000298 khi p = 0,01.</li><li>Mã lật pha = mã lật bit trong cơ sở |±⟩; mã Shor 9 qubit sửa mọi lỗi một qubit.</li><li>Đo hội chứng rời rạc hoá lỗi thành các Pauli.</li><li>Mã bề mặt: dập lỗi theo cấp số mũ dưới ngưỡng; Willow 2024 cho Λ ≈ 2,14 mỗi bước khoảng cách.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://github.com/Qiskit/documentation/blob/main/learning/courses/foundations-of-quantum-error-correction/correcting-quantum-errors/repetition-codes.ipynb" target="_blank" rel="noopener">IBM Quantum Learning (Watrous) — Mã lặp (notebook gốc)</a></li><li><a href="https://www.youtube.com/watch?v=OoQSdcKAIZc" target="_blank" rel="noopener">Qiskit — Understanding Quantum Information &amp; Computation, Lesson 13: Sửa lỗi lượng tử</a></li><li><a href="https://learn.microsoft.com/en-us/azure/quantum/concepts-error-correction" target="_blank" rel="noopener">Microsoft Learn — Các mã sửa lỗi lượng tử</a></li><li><a href="https://www.nature.com/articles/s41586-024-08449-y" target="_blank" rel="noopener">Nature (2024) — Sửa lỗi lượng tử dưới ngưỡng mã bề mặt</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Hội chứng là (+1, −1). Bạn lật qubit nào?</li><li>Chứng minh 3p<sup>2</sup> − 2p<sup>3</sup> &lt; p khi và chỉ khi 0 &lt; p &lt; 1/2.</li><li>Lỗi nào mã lật bit 3 qubit hoàn toàn không phát hiện được: X trên q2, Z trên q0, hay X trên cả q0 và q2?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Bit 0, 1 giống, bit 1, 2 khác ⇒ <b>q2</b>. 2) p − (3p<sup>2</sup> − 2p<sup>3</sup>) = p(2p<sup>2</sup> − 3p + 1) = p(2p − 1)(p − 1); với 0 &lt; p &lt; 1/2 cả (2p − 1) và (p − 1) đều âm nên tích dương. 3) <b>Z trên q0</b>: α|000⟩ − β|111⟩ có hội chứng (+1, +1) — vô hình với các phép đo chẵn lẻ Z, vì thế cần thêm mã lật pha. (X trên q0 và q2 thì bị phát hiện, nhưng bị sửa nhầm thành lỗi logic.)</p></div>`);

const c103 = L('qtc211-ts-10-3',
  '10.3 — Quantum hardware and the NISQ era: platforms, metrics, compilation, headlines|||10.3 — Phần cứng lượng tử và kỷ nguyên NISQ: nền tảng, chỉ số, biên dịch, đọc tin',
  'Các nền tảng qubit (siêu dẫn, ion bẫy, nguyên tử trung hoà, photon, spin), chỉ số đánh giá (số qubit, T1/T2, lỗi cổng 1q/2q, lỗi đọc, kết nối), transpile sang cổng gốc và bản đồ ghép nối (SWAP), khái niệm NISQ (Preskill 2018), thí nghiệm Sycamore 2019 và cách đọc tin tức.',
  `<span class="eyebrow">QTC211 · Chapter 10 · Lesson 10.3</span>
<h2>Quantum hardware and the NISQ era: platforms, metrics, compilation, headlines</h2>
<p class="lead">The same circuit model runs on very different physics. As a computer scientist you do not need to build the hardware, but you must be able to read a device's specification sheet, understand what the compiler does to your circuit, and judge a press release.</p>
<h3>🎯 Objectives</h3>
<ul><li>Name the main qubit platforms and their typical strengths and weaknesses.</li><li>Read the key device metrics: qubit count, T1/T2, one- and two-qubit gate error, readout error, connectivity.</li><li>Explain transpilation to native gates and a coupling map, and why SWAPs add cost.</li><li>Explain the term NISQ and evaluate “quantum advantage” claims carefully.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>Platforms</strong> (qualitative comparison — numbers change every year):</p>
<ul><li><strong>Superconducting circuits</strong> (IBM, Google, others): tiny electrical circuits cooled to millikelvin temperatures in a dilution refrigerator. Very fast gates (tens of nanoseconds) and chip fabrication, but each qubit usually couples only to a few neighbours and coherence times are short.</li><li><strong>Trapped ions</strong> (e.g. Quantinuum, IonQ): charged atoms held by electromagnetic fields and controlled by lasers. Very high gate fidelities, long coherence and all-to-all connectivity inside a trap, but gates are much slower.</li><li><strong>Neutral atoms</strong>: atoms held in arrays of optical tweezers; can be rearranged, scaling to large arrays; two-qubit gates use highly excited (Rydberg) states.</li><li><strong>Photonics</strong>: qubits carried by photons; room-temperature components and natural for communication, but photons do not interact easily, which makes two-qubit gates hard.</li><li><strong>Spin qubits</strong> in silicon: electron or nuclear spins in semiconductor devices, attractive because they reuse chip-industry fabrication; still at smaller scale.</li></ul>
<p><strong>Metrics.</strong> The qubit count alone means little. Look at: <em>T1/T2</em> compared with gate time; <em>one-qubit</em> and especially <em>two-qubit gate error</em> (usually the dominant error); <em>readout error</em>; and <em>connectivity</em> — which pairs can do a two-qubit gate directly (the <strong>coupling map</strong>). By the f<sup>G</sup> rule of Lesson 10.1, a device with 1000 qubits but 1 % two-qubit error cannot run a circuit with more than about a hundred two-qubit gates reliably.</p>
<p><strong>Compilation (transpilation).</strong> Hardware supports only a small <strong>native gate set</strong> (e.g. IBM devices: rz, sx, x and one two-qubit gate). The transpiler (i) rewrites every gate in native gates, (ii) maps your logical qubits onto physical ones, (iii) inserts <strong>SWAP</strong> gates when a two-qubit gate acts on non-neighbours — each SWAP costs 3 CNOTs, i.e. more error — and (iv) optimises. Good layout and routing are active research and real software-engineering work.</p>
<p><strong>The NISQ era.</strong> John Preskill (2018) coined <strong>NISQ</strong> — <em>Noisy Intermediate-Scale Quantum</em> — for devices with tens to hundreds (now thousands) of qubits but no full error correction. They are research tools: good for physics experiments, benchmarking and exploring heuristic algorithms, not (yet) for breaking RSA.</p>
<p><strong>A landmark — and how to read it.</strong> In 2019 Google reported in <em>Nature</em> that its 53-qubit Sycamore processor sampled one instance of a random quantum circuit a million times in about 200 seconds, and estimated the equivalent classical task at about 10 000 years on a state-of-the-art supercomputer — calling it “quantum supremacy” for that specific task. The task (random circuit sampling) has no practical use, and later work proposed and demonstrated much faster classical simulation methods for this kind of experiment, so the 10 000-year estimate did not stand. Lesson: <strong>quantum advantage claims are about a specific task compared with the best <em>known</em> classical method, and they can be overturned.</strong></p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — state-space size.</b> 53 qubits ⇒ 2<sup>53</sup> ≈ 9.0 × 10<sup>15</sup> amplitudes (“about 10<sup>16</sup>” in the paper). Stored as 16-byte complex numbers that is about 144 PB — why brute-force state-vector simulation was out of reach, and why cleverer classical methods (tensor networks) are the real competitors.</p></div>
<div class="callout"><p><b>Example 2 — the price of limited connectivity.</b> Three qubits in a line 0 – 1 – 2; the circuit needs H on q0 and CNOT from q0 to q2. The transpiler must route through q1 with a SWAP (3 CNOTs), then do the CNOT: 4 CNOTs instead of 1, and the H becomes rz·sx·rz in the native set.</p></div>
<pre><code class="language-python">from qiskit import QuantumCircuit, transpile
from qiskit.transpiler import CouplingMap

qc = QuantumCircuit(3)
qc.h(0)
qc.cx(0, 2)                                   # q0 and q2 are NOT neighbours below
line = CouplingMap([[0, 1], [1, 0], [1, 2], [2, 1]])   # 0 - 1 - 2
t = transpile(qc, coupling_map=line, basis_gates=["rz", "sx", "x", "cx"],
              initial_layout=[0, 1, 2], optimization_level=0, seed_transpiler=1)
print("before:", dict(qc.count_ops()), "depth", qc.depth())
print("after :", dict(t.count_ops()), "depth", t.depth())</code></pre>
<div class="out">before: {'h': 1, 'cx': 1} depth 2
after : {'cx': 4, 'rz': 2, 'sx': 1} depth 7</div>
<div class="callout"><p><b>Example 3 — judging a headline.</b> “New 1000-qubit chip will break encryption.” Ask: (1) What are the two-qubit error and connectivity? (2) Are these physical or <em>logical</em> (error-corrected) qubits? (3) Which task was actually run, and compared with which classical method? Breaking RSA-2048 needs a fault-tolerant machine with very many physical qubits running for hours or days; a 1000-physical-qubit NISQ chip is not that.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Ranking machines by qubit count. Error rates and connectivity decide what you can run.</li><li>Forgetting the transpiler. The circuit you draw is not the circuit that runs; check depth and two-qubit count <em>after</em> transpiling.</li><li>Reading “supremacy/advantage” as “useful speed-up for my problem”. So far such demonstrations are for carefully chosen tasks.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Platforms: superconducting (fast, local connectivity), trapped ions (high fidelity, slow), neutral atoms, photonics, spins.</li><li>Key metrics: T1/T2 vs gate time, two-qubit error, readout error, connectivity.</li><li>Transpilation rewrites to native gates and inserts SWAPs (3 CNOTs each) for distant qubits.</li><li>NISQ = noisy, intermediate-scale, no full error correction (Preskill 2018).</li><li>Advantage claims are task-specific and relative to the best known classical algorithm.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://arxiv.org/abs/1801.00862" target="_blank" rel="noopener">John Preskill — Quantum Computing in the NISQ era and beyond (arXiv:1801.00862)</a></li><li><a href="https://www.nature.com/articles/s41586-019-1666-5" target="_blank" rel="noopener">Nature (2019) — Quantum supremacy using a programmable superconducting processor</a></li><li><a href="https://en.wikipedia.org/wiki/Superconducting_quantum_computing" target="_blank" rel="noopener">Wikipedia — Superconducting quantum computing</a></li><li><a href="https://en.wikipedia.org/wiki/Trapped-ion_quantum_computer" target="_blank" rel="noopener">Wikipedia — Trapped-ion quantum computer</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>A device has two-qubit gate error 0.5 %. Roughly how many two-qubit gates can a circuit contain before success drops below 0.5?</li><li>On the line 0 – 1 – 2, why does CNOT from q0 to q1 need no SWAP while CNOT from q0 to q2 does?</li><li>Device A: 127 qubits, 2-qubit error 1 %. Device B: 32 qubits, 2-qubit error 0.1 %. For a circuit on 20 qubits with 300 two-qubit gates, which is better?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 0.995<sup>G</sup> = 0.5 ⇒ G = ln 0.5 / ln 0.995 ≈ <b>138</b>. 2) q0 and q1 are neighbours in the coupling map; q0 and q2 are not, so one qubit's state must be swapped next to the other first. 3) <b>B</b>: 0.99<sup>300</sup> ≈ 0.049 versus 0.999<sup>300</sup> ≈ 0.741. Both have enough qubits; error rate decides.</p></div>`,
  `<span class="eyebrow">QTC211 · Chương 10 · Bài 10.3</span>
<h2>Phần cứng lượng tử và kỷ nguyên NISQ: nền tảng, chỉ số, biên dịch, đọc tin</h2>
<p class="lead">Cùng một mô hình mạch chạy trên những nền vật lý rất khác nhau. Là dân khoa học máy tính, bạn không cần chế tạo phần cứng, nhưng phải đọc được bảng thông số của thiết bị, hiểu trình biên dịch làm gì với mạch của mình, và tự đánh giá một thông cáo báo chí.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Kể tên các nền tảng qubit chính cùng điểm mạnh, điểm yếu điển hình.</li><li>Đọc các chỉ số then chốt: số qubit, T1/T2, lỗi cổng một và hai qubit, lỗi đọc, kết nối.</li><li>Giải thích transpile sang cổng gốc và bản đồ ghép nối, vì sao SWAP làm tăng chi phí.</li><li>Giải thích thuật ngữ NISQ và đánh giá thận trọng các tuyên bố “ưu thế lượng tử”.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Các nền tảng</strong> (so sánh định tính — con số thay đổi hằng năm):</p>
<ul><li><strong>Mạch siêu dẫn</strong> (IBM, Google và nhiều nơi khác): mạch điện tí hon làm lạnh tới cỡ milikelvin trong tủ lạnh pha loãng. Cổng rất nhanh (cỡ chục nano giây) và chế tạo được như chip, nhưng mỗi qubit thường chỉ nối với vài láng giềng và thời gian kết hợp ngắn.</li><li><strong>Ion bẫy</strong> (vd Quantinuum, IonQ): nguyên tử mang điện được giữ bằng trường điện từ và điều khiển bằng laser. Độ trung thực cổng rất cao, kết hợp lâu, kết nối mọi-với-mọi trong một bẫy, nhưng cổng chậm hơn nhiều.</li><li><strong>Nguyên tử trung hoà</strong>: nguyên tử giữ trong mảng “nhíp quang học”; sắp xếp lại được, mở rộng tới mảng lớn; cổng hai qubit dùng trạng thái kích thích cao (Rydberg).</li><li><strong>Photon</strong>: qubit mang bởi photon; linh kiện chạy ở nhiệt độ phòng và hợp với truyền thông, nhưng photon khó tương tác với nhau nên cổng hai qubit khó.</li><li><strong>Qubit spin</strong> trên silicon: spin electron hoặc spin hạt nhân trong linh kiện bán dẫn, hấp dẫn vì tận dụng công nghệ chế tạo chip; quy mô còn nhỏ.</li></ul>
<p><strong>Chỉ số.</strong> Riêng số qubit chẳng nói lên mấy. Hãy xem: <em>T1/T2</em> so với thời gian cổng; lỗi cổng <em>một qubit</em> và nhất là <em>hai qubit</em> (thường là lỗi lớn nhất); <em>lỗi đọc</em>; và <em>kết nối</em> — cặp qubit nào làm cổng hai qubit trực tiếp được (<strong>bản đồ ghép nối, coupling map</strong>). Theo luật f<sup>G</sup> ở Bài 10.1, một thiết bị 1000 qubit mà lỗi hai qubit 1 % thì không chạy tin cậy được mạch quá khoảng một trăm cổng hai qubit.</p>
<p><strong>Biên dịch (transpile).</strong> Phần cứng chỉ hỗ trợ một <strong>tập cổng gốc</strong> nhỏ (vd thiết bị IBM: rz, sx, x và một cổng hai qubit). Transpiler (i) viết lại mọi cổng bằng cổng gốc, (ii) gán qubit logic của bạn vào qubit vật lý, (iii) chèn cổng <strong>SWAP</strong> khi cổng hai qubit tác động lên hai qubit không kề nhau — mỗi SWAP tốn 3 CNOT, tức thêm lỗi — và (iv) tối ưu. Bố trí và định tuyến tốt là chủ đề nghiên cứu sôi động và là việc kỹ nghệ phần mềm thực thụ.</p>
<p><strong>Kỷ nguyên NISQ.</strong> John Preskill (2018) đặt ra thuật ngữ <strong>NISQ</strong> — <em>Noisy Intermediate-Scale Quantum</em>, lượng tử quy mô trung bình có nhiễu — cho các thiết bị vài chục tới vài trăm (nay là vài nghìn) qubit nhưng chưa có sửa lỗi đầy đủ. Chúng là công cụ nghiên cứu: tốt cho thí nghiệm vật lý, đo hiệu năng, thử thuật toán heuristic, (chưa) phải để phá RSA.</p>
<p><strong>Một cột mốc — và cách đọc nó.</strong> Năm 2019 Google công bố trên <em>Nature</em> rằng bộ xử lý Sycamore 53 qubit lấy mẫu một mạch lượng tử ngẫu nhiên một triệu lần trong khoảng 200 giây, và ước tính siêu máy tính hiện đại nhất cần khoảng 10 000 năm cho việc tương đương — gọi đó là “ưu thế lượng tử (quantum supremacy)” cho đúng tác vụ đó. Tác vụ này (lấy mẫu mạch ngẫu nhiên) không có ứng dụng thực tế, và các công trình sau đã đề xuất và thực hiện những phương pháp mô phỏng cổ điển nhanh hơn rất nhiều cho loại thí nghiệm này, nên ước tính 10 000 năm không đứng vững. Bài học: <strong>tuyên bố ưu thế lượng tử luôn gắn với một tác vụ cụ thể, so với phương pháp cổ điển tốt nhất <em>đang biết</em>, và có thể bị lật lại.</strong></p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — kích thước không gian trạng thái.</b> 53 qubit ⇒ 2<sup>53</sup> ≈ 9,0 × 10<sup>15</sup> biên độ (bài báo ghi “khoảng 10<sup>16</sup>”). Lưu mỗi số phức 16 byte thì cần khoảng 144 PB — vì thế mô phỏng vectơ trạng thái kiểu vét cạn là ngoài tầm, và các phương pháp cổ điển khéo hơn (mạng tensor) mới là đối thủ thật.</p></div>
<div class="callout"><p><b>Ví dụ 2 — cái giá của kết nối hạn chế.</b> Ba qubit xếp hàng 0 – 1 – 2; mạch cần H trên q0 và CNOT từ q0 sang q2. Transpiler phải đi vòng qua q1 bằng một SWAP (3 CNOT) rồi mới làm CNOT: 4 CNOT thay vì 1, và H thành rz·sx·rz trong tập cổng gốc.</p></div>
<pre><code class="language-python">from qiskit import QuantumCircuit, transpile
from qiskit.transpiler import CouplingMap

qc = QuantumCircuit(3)
qc.h(0)
qc.cx(0, 2)                                   # q0 and q2 are NOT neighbours below
line = CouplingMap([[0, 1], [1, 0], [1, 2], [2, 1]])   # 0 - 1 - 2
t = transpile(qc, coupling_map=line, basis_gates=["rz", "sx", "x", "cx"],
              initial_layout=[0, 1, 2], optimization_level=0, seed_transpiler=1)
print("before:", dict(qc.count_ops()), "depth", qc.depth())
print("after :", dict(t.count_ops()), "depth", t.depth())</code></pre>
<div class="out">before: {'h': 1, 'cx': 1} depth 2
after : {'cx': 4, 'rz': 2, 'sx': 1} depth 7</div>
<div class="callout"><p><b>Ví dụ 3 — đánh giá một tít báo.</b> “Chip 1000 qubit mới sẽ phá mã hoá.” Hãy hỏi: (1) Lỗi hai qubit và kết nối thế nào? (2) Đó là qubit vật lý hay qubit <em>logic</em> (đã sửa lỗi)? (3) Thực tế đã chạy tác vụ gì, so với phương pháp cổ điển nào? Phá RSA-2048 cần một máy chịu lỗi với rất nhiều qubit vật lý chạy hàng giờ tới hàng ngày; một chip NISQ 1000 qubit vật lý không phải thứ đó.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Xếp hạng máy theo số qubit. Tỉ lệ lỗi và kết nối mới quyết định chạy được gì.</li><li>Quên transpiler. Mạch bạn vẽ không phải mạch thật sự chạy; hãy xem độ sâu và số cổng hai qubit <em>sau</em> khi transpile.</li><li>Đọc “supremacy/advantage” thành “tăng tốc hữu ích cho bài toán của tôi”. Tới nay các trình diễn đó đều dành cho tác vụ được chọn kỹ.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Nền tảng: siêu dẫn (nhanh, kết nối cục bộ), ion bẫy (trung thực cao, chậm), nguyên tử trung hoà, photon, spin.</li><li>Chỉ số then chốt: T1/T2 so với thời gian cổng, lỗi hai qubit, lỗi đọc, kết nối.</li><li>Transpile viết lại sang cổng gốc và chèn SWAP (mỗi cái 3 CNOT) cho qubit ở xa.</li><li>NISQ = có nhiễu, quy mô trung bình, chưa sửa lỗi đầy đủ (Preskill 2018).</li><li>Tuyên bố ưu thế gắn với tác vụ cụ thể và so với thuật toán cổ điển tốt nhất đang biết.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://arxiv.org/abs/1801.00862" target="_blank" rel="noopener">John Preskill — Quantum Computing in the NISQ era and beyond (arXiv:1801.00862)</a></li><li><a href="https://www.nature.com/articles/s41586-019-1666-5" target="_blank" rel="noopener">Nature (2019) — Ưu thế lượng tử với bộ xử lý siêu dẫn lập trình được</a></li><li><a href="https://en.wikipedia.org/wiki/Superconducting_quantum_computing" target="_blank" rel="noopener">Wikipedia — Máy tính lượng tử siêu dẫn</a></li><li><a href="https://en.wikipedia.org/wiki/Trapped-ion_quantum_computer" target="_blank" rel="noopener">Wikipedia — Máy tính lượng tử ion bẫy</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Một thiết bị có lỗi cổng hai qubit 0,5 %. Khoảng bao nhiêu cổng hai qubit thì xác suất thành công tụt dưới 0,5?</li><li>Trên hàng 0 – 1 – 2, vì sao CNOT từ q0 sang q1 không cần SWAP còn CNOT từ q0 sang q2 thì cần?</li><li>Thiết bị A: 127 qubit, lỗi 2 qubit 1 %. Thiết bị B: 32 qubit, lỗi 2 qubit 0,1 %. Với mạch 20 qubit có 300 cổng hai qubit, máy nào tốt hơn?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 0,995<sup>G</sup> = 0,5 ⇒ G = ln 0,5 / ln 0,995 ≈ <b>138</b>. 2) q0 và q1 là láng giềng trong bản đồ ghép nối; q0 và q2 thì không, nên phải hoán đổi trạng thái của một qubit sang cạnh qubit kia trước. 3) <b>B</b>: 0,99<sup>300</sup> ≈ 0,049 so với 0,999<sup>300</sup> ≈ 0,741. Cả hai đều đủ qubit; tỉ lệ lỗi mới quyết định.</p></div>`);

const c104 = L('qtc211-ts-10-4',
  '10.4 — Qiskit hands-on: Bell and GHZ circuits, simulators, transpiling, bit order|||10.4 — Thực hành Qiskit: mạch Bell và GHZ, trình mô phỏng, transpile, thứ tự bit',
  'Cài Qiskit + Aer, dựng mạch Bell và GHZ bằng QuantumCircuit, xem Statevector, chạy AerSimulator và StatevectorSampler với seed cố định, transpile sang tập cổng rz/sx/x/cx, quy ước little-endian của Qiskit so với ký hiệu của khoá.',
  `<span class="eyebrow">QTC211 · Chapter 10 · Lesson 10.4</span>
<h2>Qiskit hands-on: Bell and GHZ circuits, simulators, transpiling, bit order</h2>
<p class="lead">Time to use a real quantum SDK. Qiskit is IBM's open-source Python library; the same code can run on a local simulator or, with an IBM Quantum Platform account, on real hardware. Every snippet below was run with Qiskit 2.6.2 and qiskit-aer 0.18.2 and the outputs are pasted unchanged.</p>
<h3>🎯 Objectives</h3>
<ul><li>Install Qiskit and Aer and build circuits with QuantumCircuit.</li><li>Inspect exact states with Statevector and sample measurements with AerSimulator and StatevectorSampler.</li><li>Transpile a circuit to a native gate set and read its gate counts and depth.</li><li>Translate between Qiskit's little-endian bitstrings and this course's notation.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>Install</strong> in a virtual environment: <code>python -m venv venv</code>, activate it, then <code>pip install qiskit qiskit-aer</code>. The core objects are:</p>
<ul><li><code>QuantumCircuit(n)</code> — a circuit on n qubits; add gates with <code>qc.h(0)</code>, <code>qc.cx(0, 1)</code> (control 0, target 1), <code>qc.x</code>, <code>qc.rz</code>…; <code>qc.measure_all()</code> adds measurements on every qubit into a classical register named <code>meas</code>.</li><li><code>Statevector(qc)</code> — the exact state vector of a circuit without measurements (our numpy simulator from Chapter 6, but optimised).</li><li><code>AerSimulator</code> — a fast sampling simulator: <code>transpile</code> the circuit for it, run with a number of <em>shots</em>, read <code>get_counts()</code>. Pass <code>seed_simulator</code> and <code>seed_transpiler</code> to make results reproducible.</li><li><code>StatevectorSampler</code> — the reference implementation of Qiskit's <em>Sampler primitive</em>, the same interface you use for IBM hardware.</li></ul>
<div class="callout"><p><b>Bit order — the one thing that confuses everybody.</b> This course writes kets as |q0 q1 …⟩ with qubit 0 on the left (Nielsen &amp; Chuang). Qiskit is <strong>little-endian</strong>: its bitstrings are written q(n−1) … q1 q0, with qubit 0 on the <em>right</em>. So Qiskit's '01' on two qubits means q0 = 1, q1 = 0 — which this course writes as |10⟩. Symmetric states like Φ<sup>+</sup> or GHZ hide the difference; asymmetric ones expose it.</p></div>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — Bell state.</b> H on q0, then CNOT<sub>01</sub>. Predict first: (|00⟩ + |11⟩)/√2, so counts about half '00' and half '11', never '01' or '10'.</p></div>
<pre><code class="language-python">from qiskit import QuantumCircuit, transpile
from qiskit.quantum_info import Statevector
from qiskit_aer import AerSimulator

bell = QuantumCircuit(2)
bell.h(0)
bell.cx(0, 1)
print(Statevector(bell).draw("text"))
probs = Statevector(bell).probabilities_dict()
print({str(k): round(float(v), 3) for k, v in probs.items()})

bell.measure_all()
sim = AerSimulator()
job = sim.run(transpile(bell, sim, seed_transpiler=1), shots=1000, seed_simulator=42)
print(job.result().get_counts())</code></pre>
<div class="out">[0.70710678+0.j,0.        +0.j,0.        +0.j,0.70710678+0.j]
{'00': 0.5, '11': 0.5}
{'00': 510, '11': 490}</div>
<p>The counts are not exactly 500/500: with 1000 shots the binomial standard deviation is √(1000 · 0.5 · 0.5) ≈ 16, so 510/490 is entirely normal. Change <code>seed_simulator</code> and you will see other values.</p>
<div class="callout"><p><b>Example 2 — GHZ state, Sampler and transpiling.</b> H on q0, CNOT<sub>01</sub>, CNOT<sub>12</sub> gives (|000⟩ + |111⟩)/√2. We draw the circuit, sample it with StatevectorSampler, then transpile to the native set rz, sx, x, cx.</p></div>
<pre><code class="language-python">from qiskit import QuantumCircuit, transpile
from qiskit.primitives import StatevectorSampler

ghz = QuantumCircuit(3)
ghz.h(0)
ghz.cx(0, 1)
ghz.cx(1, 2)
ghz.measure_all()
print(ghz.draw("text"))

sampler = StatevectorSampler(seed=7)
result = sampler.run([ghz], shots=1000).result()
print(result[0].data.meas.get_counts())

t = transpile(ghz, basis_gates=["rz", "sx", "x", "cx"], optimization_level=1, seed_transpiler=1)
print(dict(t.count_ops()), "depth =", t.depth())</code></pre>
<div class="out">        ┌───┐           ░ ┌─┐      
   q_0: ┤ H ├──■────────░─┤M├──────
        └───┘┌─┴─┐      ░ └╥┘┌─┐   
   q_1: ─────┤ X ├──■───░──╫─┤M├───
             └───┘┌─┴─┐ ░  ║ └╥┘┌─┐
   q_2: ──────────┤ X ├─░──╫──╫─┤M├
                  └───┘ ░  ║  ║ └╥┘
meas: 3/═══════════════════╩══╩══╩═
                           0  1  2 
{'111': 498, '000': 502}
{'measure': 3, 'rz': 2, 'cx': 2, 'sx': 1, 'barrier': 1} depth = 6</div>
<p>Read the transpiled counts: the two CNOTs stay; H became rz·sx·rz (2 rz + 1 sx); the barrier and 3 measurements are kept. The depth 6 is what the hardware would actually execute, before any SWAPs a real coupling map might add (Lesson 10.3).</p>
<div class="callout"><p><b>Example 3 — where bit order matters.</b> Apply X to qubit 0 of a 2-qubit circuit. In course notation the state is |10⟩ (q0 = 1). Qiskit reports the key '01'.</p></div>
<pre><code class="language-python">from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector

qc = QuantumCircuit(2)
qc.x(0)                                      # flip qubit 0 only
probs = Statevector(qc).probabilities_dict()   # Qiskit key = 'q1 q0'
print({str(k): round(float(v), 3) for k, v in probs.items()})</code></pre>
<div class="out">{'01': 1.0}</div>
<p>When you compare a Qiskit result with a hand calculation, <strong>reverse the Qiskit bitstring</strong> first (in Python: <code>key[::-1]</code>).</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Reading Qiskit bitstrings left-to-right as q0 q1. They are q(n−1) … q0.</li><li>Calling <code>Statevector</code> on a circuit that already contains measurements. Build the state first, measure afterwards (or keep two circuits).</li><li>Expecting identical counts on every run. Sampling is random; fix the seeds for reproducible notebooks and reports.</li><li>Copying old tutorials that use <code>from qiskit import execute</code> or <code>from qiskit import Aer</code> — those imports no longer exist in current Qiskit (they fail in 2.6); use <code>qiskit_aer.AerSimulator</code> with <code>transpile</code> + <code>run</code>, or the primitives, as shown.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li><code>pip install qiskit qiskit-aer</code>; build with <code>QuantumCircuit</code>, <code>h</code>, <code>cx</code>, <code>measure_all</code>.</li><li><code>Statevector</code> = exact amplitudes; <code>AerSimulator</code> / <code>StatevectorSampler</code> = sampled counts (use seeds).</li><li><code>transpile(..., basis_gates=[...])</code> shows the real gate count and depth.</li><li>Qiskit is little-endian: reverse its bitstrings to match |q0 q1 …⟩.</li><li>The same Sampler interface runs on IBM Quantum Platform hardware once you have an account.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://github.com/Qiskit/qiskit" target="_blank" rel="noopener">Qiskit — source code and README (GitHub)</a></li><li><a href="https://github.com/Qiskit/qiskit-aer" target="_blank" rel="noopener">Qiskit Aer — high-performance simulator (GitHub)</a></li><li><a href="https://github.com/Qiskit/documentation/blob/main/learning/courses/basics-of-quantum-information/single-systems/qiskit-implementation.ipynb" target="_blank" rel="noopener">IBM Quantum Learning (Watrous) — Single systems: Qiskit implementation (source notebook)</a></li><li><a href="https://github.com/Qiskit/documentation/blob/main/learning/courses/basics-of-quantum-information/multiple-systems/qiskit-implementation.ipynb" target="_blank" rel="noopener">IBM Quantum Learning (Watrous) — Multiple systems: Qiskit implementation (source notebook)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>A 2-qubit circuit applies only X to qubit 1. Which key does <code>probabilities_dict()</code> return, and how does this course write the state?</li><li>Write a 2-qubit circuit that prepares Ψ<sup>+</sup> = (|01⟩ + |10⟩)/√2 from |00⟩.</li><li>A friend gets {'00': 523, '11': 477} for a Bell circuit and thinks the simulator is biased. Is it?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Qiskit key <b>'10'</b> (q1 = 1, q0 = 0); course notation |01⟩. 2) <code>qc.h(0); qc.cx(0, 1); qc.x(1)</code>: H and CNOT give (|00⟩ + |11⟩)/√2, then X on q1 gives (|01⟩ + |10⟩)/√2; Statevector shows amplitude 0.7071 on indices 1 and 2, probabilities {'01': 0.5, '10': 0.5}. 3) No: the standard deviation is about 16 counts, and 523 is only about 1.5 standard deviations from 500.</p></div>`,
  `<span class="eyebrow">QTC211 · Chương 10 · Bài 10.4</span>
<h2>Thực hành Qiskit: mạch Bell và GHZ, trình mô phỏng, transpile, thứ tự bit</h2>
<p class="lead">Đến lúc dùng một bộ công cụ lượng tử thật. Qiskit là thư viện Python mã nguồn mở của IBM; cùng một đoạn code chạy được trên trình mô phỏng ở máy bạn, hoặc — khi có tài khoản IBM Quantum Platform — trên phần cứng thật. Mọi đoạn code dưới đây đã chạy với Qiskit 2.6.2 và qiskit-aer 0.18.2, output được dán nguyên văn.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Cài Qiskit và Aer, dựng mạch bằng QuantumCircuit.</li><li>Xem trạng thái chính xác bằng Statevector và lấy mẫu phép đo bằng AerSimulator, StatevectorSampler.</li><li>Transpile một mạch sang tập cổng gốc và đọc số cổng, độ sâu.</li><li>Chuyển đổi giữa chuỗi bit little-endian của Qiskit và ký hiệu của khoá này.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Cài đặt</strong> trong môi trường ảo: <code>python -m venv venv</code>, kích hoạt nó, rồi <code>pip install qiskit qiskit-aer</code>. Các đối tượng cốt lõi:</p>
<ul><li><code>QuantumCircuit(n)</code> — mạch n qubit; thêm cổng bằng <code>qc.h(0)</code>, <code>qc.cx(0, 1)</code> (điều khiển 0, đích 1), <code>qc.x</code>, <code>qc.rz</code>…; <code>qc.measure_all()</code> thêm phép đo trên mọi qubit vào thanh ghi cổ điển tên <code>meas</code>.</li><li><code>Statevector(qc)</code> — vectơ trạng thái chính xác của một mạch chưa có phép đo (chính là trình mô phỏng numpy ở Chương 6, nhưng đã tối ưu).</li><li><code>AerSimulator</code> — trình mô phỏng lấy mẫu nhanh: <code>transpile</code> mạch cho nó, chạy với một số <em>shot</em> (lượt đo), đọc <code>get_counts()</code>. Truyền <code>seed_simulator</code> và <code>seed_transpiler</code> để kết quả lặp lại được.</li><li><code>StatevectorSampler</code> — bản cài đặt chuẩn của <em>primitive Sampler</em> trong Qiskit, cùng giao diện bạn dùng cho phần cứng IBM.</li></ul>
<div class="callout"><p><b>Thứ tự bit — điều ai cũng nhầm.</b> Khoá này viết ket dạng |q0 q1 …⟩ với qubit 0 bên trái (Nielsen &amp; Chuang). Qiskit là <strong>little-endian</strong>: chuỗi bit viết q(n−1) … q1 q0, qubit 0 ở <em>bên phải</em>. Vậy '01' của Qiskit trên hai qubit nghĩa là q0 = 1, q1 = 0 — khoá này viết là |10⟩. Trạng thái đối xứng như Φ<sup>+</sup> hay GHZ che mất sự khác biệt; trạng thái không đối xứng thì lộ ra.</p></div>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — trạng thái Bell.</b> H trên q0, rồi CNOT<sub>01</sub>. Dự đoán trước: (|00⟩ + |11⟩)/√2, nên số đếm khoảng một nửa '00' và một nửa '11', không bao giờ có '01' hay '10'.</p></div>
<pre><code class="language-python">from qiskit import QuantumCircuit, transpile
from qiskit.quantum_info import Statevector
from qiskit_aer import AerSimulator

bell = QuantumCircuit(2)
bell.h(0)
bell.cx(0, 1)
print(Statevector(bell).draw("text"))
probs = Statevector(bell).probabilities_dict()
print({str(k): round(float(v), 3) for k, v in probs.items()})

bell.measure_all()
sim = AerSimulator()
job = sim.run(transpile(bell, sim, seed_transpiler=1), shots=1000, seed_simulator=42)
print(job.result().get_counts())</code></pre>
<div class="out">[0.70710678+0.j,0.        +0.j,0.        +0.j,0.70710678+0.j]
{'00': 0.5, '11': 0.5}
{'00': 510, '11': 490}</div>
<p>Số đếm không đúng 500/500: với 1000 lượt, độ lệch chuẩn nhị thức là √(1000 · 0,5 · 0,5) ≈ 16, nên 510/490 hoàn toàn bình thường. Đổi <code>seed_simulator</code> là bạn thấy giá trị khác.</p>
<div class="callout"><p><b>Ví dụ 2 — trạng thái GHZ, Sampler và transpile.</b> H trên q0, CNOT<sub>01</sub>, CNOT<sub>12</sub> cho (|000⟩ + |111⟩)/√2. Ta vẽ mạch, lấy mẫu bằng StatevectorSampler, rồi transpile sang tập cổng gốc rz, sx, x, cx.</p></div>
<pre><code class="language-python">from qiskit import QuantumCircuit, transpile
from qiskit.primitives import StatevectorSampler

ghz = QuantumCircuit(3)
ghz.h(0)
ghz.cx(0, 1)
ghz.cx(1, 2)
ghz.measure_all()
print(ghz.draw("text"))

sampler = StatevectorSampler(seed=7)
result = sampler.run([ghz], shots=1000).result()
print(result[0].data.meas.get_counts())

t = transpile(ghz, basis_gates=["rz", "sx", "x", "cx"], optimization_level=1, seed_transpiler=1)
print(dict(t.count_ops()), "depth =", t.depth())</code></pre>
<div class="out">        ┌───┐           ░ ┌─┐      
   q_0: ┤ H ├──■────────░─┤M├──────
        └───┘┌─┴─┐      ░ └╥┘┌─┐   
   q_1: ─────┤ X ├──■───░──╫─┤M├───
             └───┘┌─┴─┐ ░  ║ └╥┘┌─┐
   q_2: ──────────┤ X ├─░──╫──╫─┤M├
                  └───┘ ░  ║  ║ └╥┘
meas: 3/═══════════════════╩══╩══╩═
                           0  1  2 
{'111': 498, '000': 502}
{'measure': 3, 'rz': 2, 'cx': 2, 'sx': 1, 'barrier': 1} depth = 6</div>
<p>Đọc số cổng sau transpile: hai CNOT giữ nguyên; H thành rz·sx·rz (2 rz + 1 sx); barrier và 3 phép đo giữ lại. Độ sâu 6 là thứ phần cứng thật sự thực thi, chưa tính các SWAP mà một bản đồ ghép nối thật có thể thêm vào (Bài 10.3).</p>
<div class="callout"><p><b>Ví dụ 3 — khi thứ tự bit quan trọng.</b> Áp X lên qubit 0 của mạch 2 qubit. Theo ký hiệu của khoá, trạng thái là |10⟩ (q0 = 1). Qiskit báo khoá '01'.</p></div>
<pre><code class="language-python">from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector

qc = QuantumCircuit(2)
qc.x(0)                                      # flip qubit 0 only
probs = Statevector(qc).probabilities_dict()   # Qiskit key = 'q1 q0'
print({str(k): round(float(v), 3) for k, v in probs.items()})</code></pre>
<div class="out">{'01': 1.0}</div>
<p>Khi so kết quả Qiskit với bài tính tay, <strong>đảo ngược chuỗi bit của Qiskit</strong> trước (trong Python: <code>key[::-1]</code>).</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Đọc chuỗi bit Qiskit từ trái sang phải thành q0 q1. Thực ra là q(n−1) … q0.</li><li>Gọi <code>Statevector</code> trên mạch đã có phép đo. Hãy dựng trạng thái trước, đo sau (hoặc giữ hai mạch riêng).</li><li>Chờ số đếm giống hệt nhau mỗi lần chạy. Lấy mẫu là ngẫu nhiên; cố định seed để notebook và báo cáo lặp lại được.</li><li>Chép hướng dẫn cũ dùng <code>from qiskit import execute</code> hay <code>from qiskit import Aer</code> — các import đó không còn trong Qiskit hiện nay (chạy trên 2.6 là lỗi); dùng <code>qiskit_aer.AerSimulator</code> với <code>transpile</code> + <code>run</code>, hoặc các primitive, như trên.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li><code>pip install qiskit qiskit-aer</code>; dựng mạch bằng <code>QuantumCircuit</code>, <code>h</code>, <code>cx</code>, <code>measure_all</code>.</li><li><code>Statevector</code> = biên độ chính xác; <code>AerSimulator</code> / <code>StatevectorSampler</code> = số đếm lấy mẫu (dùng seed).</li><li><code>transpile(..., basis_gates=[...])</code> cho thấy số cổng và độ sâu thật.</li><li>Qiskit là little-endian: đảo chuỗi bit để khớp |q0 q1 …⟩.</li><li>Cùng giao diện Sampler đó chạy được trên phần cứng IBM Quantum Platform khi bạn có tài khoản.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://github.com/Qiskit/qiskit" target="_blank" rel="noopener">Qiskit — mã nguồn và README (GitHub)</a></li><li><a href="https://github.com/Qiskit/qiskit-aer" target="_blank" rel="noopener">Qiskit Aer — trình mô phỏng hiệu năng cao (GitHub)</a></li><li><a href="https://github.com/Qiskit/documentation/blob/main/learning/courses/basics-of-quantum-information/single-systems/qiskit-implementation.ipynb" target="_blank" rel="noopener">IBM Quantum Learning (Watrous) — Hệ đơn: cài đặt bằng Qiskit (notebook gốc)</a></li><li><a href="https://github.com/Qiskit/documentation/blob/main/learning/courses/basics-of-quantum-information/multiple-systems/qiskit-implementation.ipynb" target="_blank" rel="noopener">IBM Quantum Learning (Watrous) — Hệ nhiều thành phần: cài đặt bằng Qiskit (notebook gốc)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Một mạch 2 qubit chỉ áp X lên qubit 1. <code>probabilities_dict()</code> trả về khoá nào, và khoá này viết trạng thái thế nào?</li><li>Viết mạch 2 qubit tạo Ψ<sup>+</sup> = (|01⟩ + |10⟩)/√2 từ |00⟩.</li><li>Bạn của bạn được {'00': 523, '11': 477} với mạch Bell và nghĩ trình mô phỏng bị lệch. Có đúng không?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Khoá Qiskit <b>'10'</b> (q1 = 1, q0 = 0); ký hiệu của khoá: |01⟩. 2) <code>qc.h(0); qc.cx(0, 1); qc.x(1)</code>: H và CNOT cho (|00⟩ + |11⟩)/√2, rồi X trên q1 cho (|01⟩ + |10⟩)/√2; Statevector cho biên độ 0,7071 ở chỉ số 1 và 2, xác suất {'01': 0.5, '10': 0.5}. 3) Không: độ lệch chuẩn khoảng 16 lượt, và 523 chỉ cách 500 khoảng 1,5 độ lệch chuẩn.</p></div>`);

const q10 = QZ(10, 'Quiz — Chapter 10: Noise, error correction, hardware & Qiskit|||Quiz — Chương 10: Nhiễu, sửa lỗi, phần cứng & Qiskit', 'Kiểm tra chương 10: mô hình nhiễu Pauli, T1/T2, luật f^G, mã lật bit 3 qubit và hội chứng, tỉ lệ lỗi logic, ngưỡng, NISQ, transpile/SWAP, thứ tự bit của Qiskit.', [
  Q('q1', 'A circuit has 1000 gates, each with fidelity 0.999. Its success probability is about|||Mạch 1000 cổng, mỗi cổng độ trung thực 0,999. Xác suất thành công khoảng',
    ['0.999|||0,999', '0.905|||0,905', '0.368|||0,368', '0|||0'], 2,
    '0.999^1000 ≈ e^(−1) ≈ 0.368.|||0,999^1000 ≈ e^(−1) ≈ 0,368.'),
  Q('q2', 'Which error leaves computational-basis measurement probabilities unchanged but destroys interference?|||Lỗi nào giữ nguyên xác suất đo ở cơ sở tính toán nhưng phá giao thoa?',
    ['bit flip X|||lật bit X', 'phase flip Z|||lật pha Z', 'readout error|||lỗi đọc', 'T1 decay to |0⟩|||rơi T1 về |0⟩'], 1,
    'Z only changes the sign of the |1⟩ amplitude; it swaps |+⟩ and |−⟩.|||Z chỉ đổi dấu biên độ của |1⟩; nó đổi |+⟩ thành |−⟩.'),
  Q('q3', 'T1 describes|||T1 mô tả',
    ['energy relaxation |1⟩ → |0⟩|||hồi phục năng lượng |1⟩ → |0⟩', 'loss of relative phase|||sự mất pha tương đối', 'the time of one CNOT|||thời gian một CNOT', 'readout error|||lỗi đọc'], 0,
    'T1 = relaxation; T2 = dephasing, with T2 ≤ 2T1.|||T1 = hồi phục; T2 = khử pha, với T2 ≤ 2T1.'),
  Q('q4', 'The 3-qubit bit-flip code encodes α|0⟩ + β|1⟩ as|||Mã lật bit 3 qubit mã hoá α|0⟩ + β|1⟩ thành',
    ['(α|0⟩ + β|1⟩)⊗(α|0⟩ + β|1⟩)⊗(α|0⟩ + β|1⟩)|||(α|0⟩ + β|1⟩)⊗(α|0⟩ + β|1⟩)⊗(α|0⟩ + β|1⟩)', 'α|000⟩ + β|111⟩|||α|000⟩ + β|111⟩', 'α|+++⟩ + β|−−−⟩ only|||chỉ α|+++⟩ + β|−−−⟩', 'α|001⟩ + β|110⟩|||α|001⟩ + β|110⟩'], 1,
    'Two CNOTs copy basis states, not the whole state (no-cloning).|||Hai CNOT chép trạng thái cơ sở, không chép cả trạng thái (không nhân bản).'),
  Q('q5', 'Syndrome (Z0Z1, Z1Z2) = (−1, −1). The decoder flips|||Hội chứng (Z0Z1, Z1Z2) = (−1, −1). Bộ giải mã lật',
    ['q0|||q0', 'nothing|||không lật gì', 'q2|||q2', 'q1|||q1'], 3,
    'q1 disagrees with both neighbours.|||q1 khác cả hai láng giềng.'),
  Q('q6', 'With independent bit-flip probability p = 0.01, the 3-qubit code has logical error rate|||Với xác suất lật bit độc lập p = 0,01, tỉ lệ lỗi logic của mã 3 qubit là',
    ['0.03|||0,03', '0.0001|||0,0001', '0.000298|||0,000298', '0.01|||0,01'], 2,
    '3p² − 2p³ = 0.0003 − 0.000002 = 0.000298.|||3p² − 2p³ = 0,0003 − 0,000002 = 0,000298.'),
  Q('q7', 'Why does measuring Z0Z1 and Z1Z2 not destroy the encoded superposition?|||Vì sao đo Z0Z1 và Z1Z2 không phá chồng chập đã mã hoá?',
    ['they are measured very quickly|||vì đo rất nhanh', 'it does destroy it|||thực ra nó có phá', 'ancillas are classical|||vì ancilla là cổ điển', 'both branches |000⟩ and |111⟩ give the same parities|||hai nhánh |000⟩ và |111⟩ cho cùng tính chẵn lẻ'], 3,
    'The parities reveal the error location but carry no information about α, β.|||Tính chẵn lẻ cho biết vị trí lỗi nhưng không mang thông tin về α, β.'),
  Q('q8', 'Below the threshold, increasing the surface-code distance|||Dưới ngưỡng, tăng khoảng cách mã bề mặt sẽ',
    ['suppresses the logical error rate exponentially|||dập lỗi logic theo cấp số mũ', 'increases the logical error rate|||làm tăng lỗi logic', 'has no effect|||không có tác dụng', 'removes the need for decoding|||khỏi cần giải mã'], 0,
    'That is the meaning of a threshold; above it, bigger codes are worse.|||Đó là ý nghĩa của ngưỡng; trên ngưỡng, mã to hơn lại tệ hơn.'),
  Q('q9', 'On a line coupling map 0 – 1 – 2, a CNOT from q0 to q2 is compiled using|||Với bản đồ ghép nối hàng 0 – 1 – 2, CNOT từ q0 sang q2 được biên dịch bằng',
    ['one CNOT only|||chỉ một CNOT', 'a SWAP (3 CNOTs) plus the CNOT|||một SWAP (3 CNOT) cộng CNOT đó', 'a Toffoli gate|||một cổng Toffoli', 'a measurement and reset|||một phép đo và reset'], 1,
    'Non-neighbours need routing; Qiskit produced 4 CNOTs in Lesson 10.3.|||Qubit không kề nhau cần định tuyến; Qiskit cho ra 4 CNOT ở Bài 10.3.'),
  Q('q10', 'In Qiskit, X on qubit 0 of a 2-qubit circuit gives the bitstring|||Trong Qiskit, X lên qubit 0 của mạch 2 qubit cho chuỗi bit',
    ['10|||10', '00|||00', '11|||11', '01|||01'], 3,
    'Qiskit is little-endian (q1 q0): \'01\'. This course writes the state |10⟩.|||Qiskit là little-endian (q1 q0): \'01\'. Khoá này viết trạng thái là |10⟩.'),
]);

const ch10 = {
  title: 'Chapter 10 — Noise, error correction, hardware and Qiskit practice|||Chương 10 — Nhiễu, sửa lỗi, phần cứng và thực hành Qiskit',
  description: 'Mô hình nhiễu Pauli, T1/T2 và luật f^G; mã lật bit 3 qubit có mô phỏng numpy, mã lật pha, mã Shor, mã bề mặt và ngưỡng; nền tảng phần cứng, chỉ số, transpile, NISQ; thực hành Qiskit 2.6 chạy thật (Nielsen & Chuang ch.10 · Watrous Lessons 13–16 · Preskill 2018).',
  lessons: [c101, c102, c103, c104, q10],
};

// ───────────────────────────── Xuất ─────────────────────────────
export default [muc0, ch1, ch2, ch3, ch4, ch5, ch6, ch7, ch8, ch9, ch10];
