/**
 * QTC211 — Quantum Computing (Điện toán lượng tử). Ngành Khoa học Máy tính
 * FPTU. Khung 8 chương theo giáo trình chuẩn quốc tế: Nielsen &amp; Chuang
 * "Quantum Computation and Quantum Information", IBM Qiskit Textbook,
 * Bernhardt "Quantum Computing for Everyone", Microsoft Q#. Song ngữ +
 * ký hiệu lượng tử (|0>, |1>, |psi>, H, CNOT) + khối pre-code Qiskit.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n; & → &amp;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('qtc211-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn (Nielsen & Chuang, Bernhardt), tài liệu miễn phí (IBM Qiskit, Microsoft Q#), YouTube, công cụ, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">QTC211 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Quantum Computing</strong> — qubits &amp; superposition, quantum gates &amp; circuits, entanglement, quantum algorithms, error correction — in one place. The full official slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU syllabus &amp; lecture slides for QTC211 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><em>Quantum Computation and Quantum Information</em> — Nielsen &amp; Chuang (the standard graduate text)</li>
<li><em>Quantum Computing for Everyone</em> — Chris Bernhardt (gentle, math-light intro)</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://qiskit.org/learn/" target="_blank" rel="noopener">IBM Qiskit Textbook &amp; tutorials</a> — learn by running real code</li>
<li><a href="https://learn.microsoft.com/azure/quantum/" target="_blank" rel="noopener">Microsoft Azure Quantum / Q# documentation</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@qiskit" target="_blank" rel="noopener">Qiskit</a> — IBM Quantum lessons &amp; coding sessions</li>
<li><a href="https://www.youtube.com/@3blue1brown" target="_blank" rel="noopener">3Blue1Brown</a> — linear algebra &amp; complex numbers intuition</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://quantum.ibm.com/" target="_blank" rel="noopener">IBM Quantum Platform</a> — run circuits on real quantum hardware &amp; simulators</li>
<li><a href="https://quantumjs.io/" target="_blank" rel="noopener">Quirk</a> — drag-and-drop quantum circuit simulator in the browser</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — why quantum, qubits &amp; superposition, |0>/|1>, the Bloch sphere, measurement.</li>
<li><strong>Math &amp; gates</strong> — state vectors, tensor products, unitary matrices; X/Y/Z/H/CNOT and circuits in Qiskit.</li>
<li><strong>Phenomena &amp; algorithms</strong> — entanglement, Bell states, teleportation; Deutsch-Jozsa, Grover, Shor.</li>
<li><strong>Real machines</strong> — decoherence, error correction, NISQ, quantum supremacy, crypto &amp; ML applications.</li>
</ol></div>`,
    `<span class="eyebrow">QTC211 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Điện toán lượng tử</strong> — qubit &amp; chồng chập, cổng &amp; mạch lượng tử, rối lượng tử, thuật toán lượng tử, sửa lỗi — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của QTC211 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><em>Quantum Computation and Quantum Information</em> — Nielsen &amp; Chuang (sách chuẩn bậc cao học)</li>
<li><em>Quantum Computing for Everyone</em> — Chris Bernhardt (nhập môn nhẹ nhàng, ít toán)</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://qiskit.org/learn/" target="_blank" rel="noopener">IBM Qiskit Textbook &amp; hướng dẫn</a> — học bằng cách chạy mã thật</li>
<li><a href="https://learn.microsoft.com/azure/quantum/" target="_blank" rel="noopener">Tài liệu Microsoft Azure Quantum / Q#</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@qiskit" target="_blank" rel="noopener">Qiskit</a> — bài giảng &amp; buổi code của IBM Quantum</li>
<li><a href="https://www.youtube.com/@3blue1brown" target="_blank" rel="noopener">3Blue1Brown</a> — trực giác đại số tuyến tính &amp; số phức</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://quantum.ibm.com/" target="_blank" rel="noopener">IBM Quantum Platform</a> — chạy mạch trên máy lượng tử thật &amp; trình mô phỏng</li>
<li><a href="https://quantumjs.io/" target="_blank" rel="noopener">Quirk</a> — mô phỏng mạch lượng tử kéo-thả trên trình duyệt</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — vì sao lượng tử, qubit &amp; chồng chập, |0>/|1>, mặt cầu Bloch, đo lường.</li>
<li><strong>Toán &amp; cổng</strong> — vector trạng thái, tích tensor, ma trận unitary; X/Y/Z/H/CNOT và mạch trong Qiskit.</li>
<li><strong>Hiện tượng &amp; thuật toán</strong> — rối lượng tử, trạng thái Bell, dịch chuyển; Deutsch-Jozsa, Grover, Shor.</li>
<li><strong>Máy thật</strong> — mất kết hợp, sửa lỗi, NISQ, ưu thế lượng tử, ứng dụng crypto &amp; ML.</li>
</ol></div>`,
  ]]);

const intro = doc('qtc211-0-1-overview', 'Course overview: Quantum Computing|||Tổng quan: Điện toán lượng tử',
  'Điện toán lượng tử làm gì; bit cổ điển vs qubit; lộ trình: qubit & chồng chập → đại số tuyến tính → cổng & mạch → rối & thuật toán → nhiễu, sửa lỗi & tương lai.',
  [[
    `<span class="eyebrow">QTC211 · Lesson 0.1 · Overview</span>
<h2>Quantum Computing</h2>
<p class="lead">This course explains <strong>how quantum computers work</strong> — a fundamentally different model of computation that stores information in <strong>qubits</strong> and exploits <strong>superposition</strong> and <strong>entanglement</strong> to solve certain problems far faster than any classical machine. You will build and run circuits in <strong>Qiskit</strong>.</p>
<h3>Classical bit vs qubit</h3>
<ul>
<li>A <strong>classical bit</strong> is always exactly 0 or 1.</li>
<li>A <strong>qubit</strong> can be |0>, |1>, or a <strong>superposition</strong> a|0> + b|1> of both at once — until you measure it.</li>
<li>n qubits hold 2^n amplitudes simultaneously, the source of quantum parallelism.</li>
</ul>
<h3>Roadmap</h3>
<p>Why quantum &amp; qubits → the math (state vectors, tensor products, unitary matrices) → quantum gates (X/Y/Z/H/CNOT) &amp; circuits → entanglement, Bell states &amp; teleportation → algorithms (Deutsch-Jozsa, Grover, Shor) → noise, error correction &amp; the future. Bilingual, with Qiskit code and a quiz each chapter.</p>`,
    `<span class="eyebrow">QTC211 · Bài 0.1 · Tổng quan</span>
<h2>Điện toán lượng tử</h2>
<p class="lead">Môn này giải thích <strong>máy tính lượng tử hoạt động thế nào</strong> — một mô hình tính toán khác về bản chất, lưu thông tin trong <strong>qubit</strong> và khai thác <strong>chồng chập</strong> cùng <strong>rối lượng tử</strong> để giải một số bài toán nhanh hơn nhiều so với máy cổ điển. Bạn sẽ dựng và chạy mạch bằng <strong>Qiskit</strong>.</p>
<h3>Bit cổ điển vs qubit</h3>
<ul>
<li><strong>Bit cổ điển</strong> luôn đúng bằng 0 hoặc 1.</li>
<li><strong>Qubit</strong> có thể là |0>, |1>, hoặc một <strong>chồng chập</strong> a|0> + b|1> của cả hai cùng lúc — cho tới khi bạn đo.</li>
<li>n qubit giữ đồng thời 2^n biên độ, nguồn gốc của song song lượng tử.</li>
</ul>
<h3>Lộ trình</h3>
<p>Vì sao lượng tử &amp; qubit → toán nền (vector trạng thái, tích tensor, ma trận unitary) → cổng lượng tử (X/Y/Z/H/CNOT) &amp; mạch → rối, trạng thái Bell &amp; dịch chuyển → thuật toán (Deutsch-Jozsa, Grover, Shor) → nhiễu, sửa lỗi &amp; tương lai. Song ngữ, có code Qiskit và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('qtc211-1-1-intro-quantum', '1.1 — Why quantum computing|||1.1 — Nhập môn lượng tử',
  'Vì sao cần quantum computing; cổ điển vs lượng tử; các bài toán quantum hứa hẹn (mô phỏng vật liệu, tối ưu, phân tích số); giới hạn thực tế.',
  [[
    `<span class="eyebrow">QTC211 · Chapter 1 · Lesson 1.1</span>
<h2>Why quantum computing</h2>
<h3>The limits of classical machines</h3>
<p>Some problems grow so fast that no classical computer can ever finish them — simulating molecules, factoring huge numbers, searching enormous spaces. Quantum computers attack these by processing an exponential number of states in parallel through <strong>superposition</strong>.</p>
<h3>Classical vs quantum</h3>
<ul>
<li><strong>Classical:</strong> deterministic bits (0/1), logic gates, one state at a time.</li>
<li><strong>Quantum:</strong> qubits in superposition, unitary gates, interference to boost the right answers and cancel wrong ones.</li>
</ul>
<h3>Promising applications</h3>
<ul>
<li><strong>Chemistry &amp; materials</strong> — simulate molecules for drugs and batteries.</li>
<li><strong>Cryptography</strong> — Shor's algorithm threatens RSA; drives post-quantum crypto.</li>
<li><strong>Optimization &amp; search</strong> — Grover's quadratic speed-up, logistics, finance.</li>
</ul>
<div class="callout"><span class="badge">Reality check</span> Quantum computers are not "faster classical computers" for everything. They win only where a quantum algorithm exploits interference — and today's machines are still noisy and small (the NISQ era).</div>`,
    `<span class="eyebrow">QTC211 · Chương 1 · Bài 1.1</span>
<h2>Vì sao cần điện toán lượng tử</h2>
<h3>Giới hạn của máy cổ điển</h3>
<p>Một số bài toán phình nhanh đến mức không máy cổ điển nào giải xong nổi — mô phỏng phân tử, phân tích số cực lớn, tìm kiếm trong không gian khổng lồ. Máy lượng tử tấn công chúng bằng cách xử lý song song một số mũ các trạng thái nhờ <strong>chồng chập</strong>.</p>
<h3>Cổ điển vs lượng tử</h3>
<ul>
<li><strong>Cổ điển:</strong> bit tất định (0/1), cổng logic, mỗi lúc một trạng thái.</li>
<li><strong>Lượng tử:</strong> qubit ở chồng chập, cổng unitary, dùng giao thoa để khuếch đại đáp án đúng và triệt tiêu đáp án sai.</li>
</ul>
<h3>Ứng dụng hứa hẹn</h3>
<ul>
<li><strong>Hoá học &amp; vật liệu</strong> — mô phỏng phân tử cho thuốc và pin.</li>
<li><strong>Mật mã</strong> — thuật toán Shor đe doạ RSA; thúc đẩy mật mã hậu lượng tử.</li>
<li><strong>Tối ưu &amp; tìm kiếm</strong> — tăng tốc bậc hai của Grover, logistics, tài chính.</li>
</ul>
<div class="callout"><span class="badge">Nhìn thực tế</span> Máy lượng tử không phải "máy cổ điển nhanh hơn" cho mọi việc. Nó chỉ thắng ở chỗ có thuật toán lượng tử khai thác được giao thoa — và máy hôm nay vẫn nhiễu và nhỏ (kỷ nguyên NISQ).</div>`,
  ]]);

const c1q = quiz('qtc211-quiz-1', 'Quiz 1 — Why quantum|||Quiz 1 — Nhập môn lượng tử', [
  { id: 'q1', question: 'Điểm khác biệt cốt lõi giữa qubit và bit cổ điển?', options: ['Qubit nhanh hơn bit', 'Qubit có thể ở chồng chập của 0 và 1', 'Qubit luôn bằng 1', 'Qubit không đo được'], correctIndex: 1, explanation: 'Bit luôn là 0 hoặc 1; qubit có thể là chồng chập a|0> + b|1>.' },
  { id: 'q2', question: 'Máy lượng tử KHÔNG đặc biệt hữu ích cho việc nào?', options: ['Mô phỏng phân tử', 'Phân tích số lớn (Shor)', 'Mọi tác vụ hằng ngày như duyệt web', 'Tìm kiếm không gian lớn (Grover)'], correctIndex: 2, explanation: 'Lượng tử chỉ thắng khi có thuật toán khai thác giao thoa, không thay máy cổ điển cho mọi việc.' },
  { id: 'q3', question: 'Kỷ nguyên "NISQ" nói tới điều gì?', options: ['Máy lượng tử lớn, không nhiễu', 'Máy lượng tử nhỏ và còn nhiễu hiện nay', 'Một ngôn ngữ lập trình', 'Một loại thuật toán'], correctIndex: 1, explanation: 'NISQ = Noisy Intermediate-Scale Quantum: máy hiện nay còn nhỏ và nhiều nhiễu.' },
]);

const c2 = doc('qtc211-2-1-qubit-states', '2.1 — Qubits & quantum states|||2.1 — Qubit & trạng thái lượng tử',
  'Qubit, chồng chập, cơ sở |0>/|1>, biên độ & xác suất, mặt cầu Bloch, đo lường và sự sụp đổ trạng thái.',
  [[
    `<span class="eyebrow">QTC211 · Chapter 2 · Lesson 2.1</span>
<h2>Qubits &amp; quantum states</h2>
<h3>Superposition</h3>
<p>A qubit's state is written |psi> = a|0> + b|1>, where a and b are complex <strong>amplitudes</strong>. The qubit is in both basis states at once. Measuring gives |0> with probability |a|^2 and |1> with probability |b|^2.</p>
<pre><code>State:  |psi> = a|0> + b|1>
Rule:   |a|^2 + |b|^2 = 1     (normalization)
Measure -> 0 with P = |a|^2 , 1 with P = |b|^2
Example: |psi> = (1/sqrt(2))|0> + (1/sqrt(2))|1>  -> 50% / 50%
</code></pre>
<h3>The Bloch sphere</h3>
<p>Any single-qubit state maps to a point on the surface of the <strong>Bloch sphere</strong>: |0> at the north pole, |1> at the south, superpositions around the equator. Gates rotate this point.</p>
<div class="callout"><span class="badge">Measurement is destructive</span> Reading a qubit <strong>collapses</strong> it to |0> or |1> — the superposition is gone and you cannot read the amplitudes directly. This is why quantum algorithms must arrange interference before measuring.</div>`,
    `<span class="eyebrow">QTC211 · Chương 2 · Bài 2.1</span>
<h2>Qubit &amp; trạng thái lượng tử</h2>
<h3>Chồng chập</h3>
<p>Trạng thái một qubit viết là |psi> = a|0> + b|1>, với a và b là <strong>biên độ</strong> phức. Qubit ở cả hai trạng thái cơ sở cùng lúc. Đo sẽ ra |0> với xác suất |a|^2 và |1> với xác suất |b|^2.</p>
<pre><code>Trạng thái:  |psi> = a|0> + b|1>
Ràng buộc:   |a|^2 + |b|^2 = 1     (chuẩn hoá)
Đo -> 0 với P = |a|^2 , 1 với P = |b|^2
Ví dụ: |psi> = (1/sqrt(2))|0> + (1/sqrt(2))|1>  -> 50% / 50%
</code></pre>
<h3>Mặt cầu Bloch</h3>
<p>Mọi trạng thái một qubit ứng với một điểm trên bề mặt <strong>mặt cầu Bloch</strong>: |0> ở cực bắc, |1> ở cực nam, chồng chập nằm quanh xích đạo. Cổng làm quay điểm này.</p>
<div class="callout"><span class="badge">Đo là phá huỷ</span> Đọc một qubit làm nó <strong>sụp đổ</strong> về |0> hoặc |1> — chồng chập biến mất và bạn không đọc trực tiếp được biên độ. Vì vậy thuật toán lượng tử phải sắp xếp giao thoa trước khi đo.</div>`,
  ]]);

const c2q = quiz('qtc211-quiz-2', 'Quiz 2 — Qubits & states|||Quiz 2 — Qubit & trạng thái', [
  { id: 'q1', question: 'Với |psi> = a|0> + b|1>, xác suất đo được |1> là?', options: ['a', 'b', '|b|^2', '|a|^2'], correctIndex: 2, explanation: 'Xác suất bằng bình phương độ lớn biên độ tương ứng: P(1) = |b|^2.' },
  { id: 'q2', question: 'Trên mặt cầu Bloch, trạng thái |0> nằm ở?', options: ['Cực bắc', 'Cực nam', 'Xích đạo', 'Tâm cầu'], correctIndex: 0, explanation: '|0> ở cực bắc, |1> ở cực nam, chồng chập quanh xích đạo.' },
  { id: 'q3', question: 'Điều gì xảy ra khi đo một qubit đang ở chồng chập?', options: ['Không có gì thay đổi', 'Nó sụp đổ về |0> hoặc |1>', 'Nó nhân đôi', 'Biên độ hiện ra rõ ràng'], correctIndex: 1, explanation: 'Đo làm trạng thái sụp đổ về một giá trị cơ sở; chồng chập mất đi.' },
]);

const c3 = doc('qtc211-3-1-linear-algebra', '3.1 — Linear algebra for quantum|||3.1 — Đại số tuyến tính cho lượng tử',
  'Vector trạng thái (bra-ket), tích tensor cho nhiều qubit, ma trận unitary, chuẩn hoá — mức cần thiết để hiểu cổng.',
  [[
    `<span class="eyebrow">QTC211 · Chapter 3 · Lesson 3.1</span>
<h2>Linear algebra for quantum</h2>
<h3>State vectors (bra-ket)</h3>
<p>A qubit state is a <strong>column vector</strong>: |0> = [1, 0], |1> = [0, 1]. A general state is a linear combination a|0> + b|1> = [a, b]. This "ket" notation is just vectors in a complex space.</p>
<h3>Tensor products — combining qubits</h3>
<pre><code>|0> (x) |1> = |01>          # (x) = tensor product
Two qubits: 4 basis states |00>, |01>, |10>, |11>
n qubits  : 2^n amplitudes  (exponential growth)
</code></pre>
<h3>Unitary matrices</h3>
<p>Every quantum gate is a <strong>unitary matrix</strong> U — one that preserves length (so probabilities still sum to 1) and is reversible (U applied then its conjugate transpose gives the identity). Reversibility is a hard rule of quantum computing.</p>
<div class="callout"><span class="badge">Why it matters</span> Superposition = vectors, gates = unitary matrices, entangling = tensor products. All of quantum computing is linear algebra over complex numbers.</div>`,
    `<span class="eyebrow">QTC211 · Chương 3 · Bài 3.1</span>
<h2>Đại số tuyến tính cho lượng tử</h2>
<h3>Vector trạng thái (bra-ket)</h3>
<p>Trạng thái qubit là một <strong>vector cột</strong>: |0> = [1, 0], |1> = [0, 1]. Trạng thái tổng quát là tổ hợp tuyến tính a|0> + b|1> = [a, b]. Ký hiệu "ket" chỉ là vector trong không gian phức.</p>
<h3>Tích tensor — ghép nhiều qubit</h3>
<pre><code>|0> (x) |1> = |01>          # (x) = tích tensor
Hai qubit: 4 trạng thái cơ sở |00>, |01>, |10>, |11>
n qubit   : 2^n biên độ     (tăng theo hàm mũ)
</code></pre>
<h3>Ma trận unitary</h3>
<p>Mọi cổng lượng tử là một <strong>ma trận unitary</strong> U — bảo toàn độ dài (nên xác suất vẫn cộng bằng 1) và khả nghịch (U rồi chuyển vị liên hợp của nó cho ma trận đơn vị). Tính khả nghịch là quy tắc cứng của lượng tử.</p>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Chồng chập = vector, cổng = ma trận unitary, tạo rối = tích tensor. Toàn bộ điện toán lượng tử là đại số tuyến tính trên số phức.</div>`,
  ]]);

const c3q = quiz('qtc211-quiz-3', 'Quiz 3 — Linear algebra|||Quiz 3 — Đại số tuyến tính', [
  { id: 'q1', question: 'Hệ n qubit có bao nhiêu biên độ (trạng thái cơ sở)?', options: ['n', '2n', 'n^2', '2^n'], correctIndex: 3, explanation: 'Mỗi qubit gấp đôi số trạng thái: n qubit có 2^n biên độ.' },
  { id: 'q2', question: 'Mọi cổng lượng tử được biểu diễn bằng loại ma trận nào?', options: ['Ma trận unitary', 'Ma trận bất kỳ', 'Ma trận đường chéo', 'Ma trận không khả nghịch'], correctIndex: 0, explanation: 'Cổng là ma trận unitary: bảo toàn chuẩn và khả nghịch.' },
  { id: 'q3', question: 'Phép toán nào ghép trạng thái của nhiều qubit lại?', options: ['Phép cộng', 'Tích tensor', 'Phép trừ', 'Đạo hàm'], correctIndex: 1, explanation: 'Tích tensor ghép không gian trạng thái: |0>(x)|1> = |01>.' },
]);

const c4 = doc('qtc211-4-1-gates-circuits', '4.1 — Quantum gates & circuits|||4.1 — Cổng lượng tử & mạch',
  'Cổng X/Y/Z (Pauli), H (Hadamard tạo chồng chập), CNOT (2 qubit); mạch lượng tử; dựng mạch đầu tiên bằng Qiskit.',
  [[
    `<span class="eyebrow">QTC211 · Chapter 4 · Lesson 4.1</span>
<h2>Quantum gates &amp; circuits</h2>
<h3>Single-qubit gates</h3>
<ul>
<li><strong>X</strong> — the quantum NOT: flips |0> to |1> and back.</li>
<li><strong>Y, Z</strong> — the other Pauli gates; Z flips the phase of |1>.</li>
<li><strong>H (Hadamard)</strong> — creates superposition: H|0> = (|0> + |1>)/sqrt(2).</li>
</ul>
<h3>Two-qubit gate: CNOT</h3>
<p><strong>CNOT</strong> (controlled-NOT) flips the target qubit only if the control is |1>. Combined with H, it creates <strong>entanglement</strong>.</p>
<h3>Your first Qiskit circuit</h3>
<pre><code>from qiskit import QuantumCircuit

qc = QuantumCircuit(1, 1)
qc.h(0)              # Hadamard: |0> -> (|0> + |1>)/sqrt(2)
qc.measure(0, 0)
print(qc)            # draw the circuit
</code></pre>
<div class="callout"><span class="badge">Circuits read left to right</span> A quantum circuit is a sequence of gates applied to qubit wires over time. Measurement usually comes last and sends results to classical bits.</div>`,
    `<span class="eyebrow">QTC211 · Chương 4 · Bài 4.1</span>
<h2>Cổng lượng tử &amp; mạch</h2>
<h3>Cổng một qubit</h3>
<ul>
<li><strong>X</strong> — cổng NOT lượng tử: lật |0> thành |1> và ngược lại.</li>
<li><strong>Y, Z</strong> — các cổng Pauli còn lại; Z lật pha của |1>.</li>
<li><strong>H (Hadamard)</strong> — tạo chồng chập: H|0> = (|0> + |1>)/sqrt(2).</li>
</ul>
<h3>Cổng hai qubit: CNOT</h3>
<p><strong>CNOT</strong> (controlled-NOT) lật qubit đích chỉ khi qubit điều khiển là |1>. Kết hợp với H, nó tạo ra <strong>rối lượng tử</strong>.</p>
<h3>Mạch Qiskit đầu tiên của bạn</h3>
<pre><code>from qiskit import QuantumCircuit

qc = QuantumCircuit(1, 1)
qc.h(0)              # Hadamard: |0> -> (|0> + |1>)/sqrt(2)
qc.measure(0, 0)
print(qc)            # vẽ mạch
</code></pre>
<div class="callout"><span class="badge">Mạch đọc từ trái sang phải</span> Mạch lượng tử là chuỗi cổng tác động lên các dây qubit theo thời gian. Đo thường ở cuối và gửi kết quả sang bit cổ điển.</div>`,
  ]]);

const c4q = quiz('qtc211-quiz-4', 'Quiz 4 — Gates & circuits|||Quiz 4 — Cổng & mạch', [
  { id: 'q1', question: 'Cổng nào tạo ra chồng chập từ |0>?', options: ['X', 'Z', 'H (Hadamard)', 'CNOT'], correctIndex: 2, explanation: 'H|0> = (|0> + |1>)/sqrt(2) — Hadamard tạo chồng chập cân bằng.' },
  { id: 'q2', question: 'Cổng X (NOT lượng tử) làm gì với |0>?', options: ['Giữ nguyên |0>', 'Đổi thành |1>', 'Lật pha', 'Đo qubit'], correctIndex: 1, explanation: 'Cổng X lật |0> thành |1> và ngược lại.' },
  { id: 'q3', question: 'CNOT lật qubit đích khi nào?', options: ['Luôn luôn', 'Khi qubit điều khiển là |1>', 'Khi qubit điều khiển là |0>', 'Không bao giờ'], correctIndex: 1, explanation: 'CNOT lật đích chỉ khi qubit điều khiển ở trạng thái |1>.' },
]);

const c5 = doc('qtc211-5-1-entanglement', '5.1 — Entanglement & phenomena|||5.1 — Rối lượng tử & hiện tượng',
  'Rối lượng tử, trạng thái Bell, định lý no-cloning, dịch chuyển lượng tử (teleportation); dựng cặp Bell bằng Qiskit.',
  [[
    `<span class="eyebrow">QTC211 · Chapter 5 · Lesson 5.1</span>
<h2>Entanglement &amp; phenomena</h2>
<h3>Entanglement &amp; Bell states</h3>
<p>Two qubits are <strong>entangled</strong> when the state of one cannot be described independently of the other. The simplest is a <strong>Bell state</strong> (|00> + |11>)/sqrt(2): measure one qubit and you instantly know the other, however far apart.</p>
<pre><code>from qiskit import QuantumCircuit

qc = QuantumCircuit(2)
qc.h(0)              # superposition on qubit 0
qc.cx(0, 1)          # CNOT -> Bell state (|00> + |11>)/sqrt(2)
</code></pre>
<h3>No-cloning &amp; teleportation</h3>
<ul>
<li><strong>No-cloning theorem</strong> — you cannot copy an unknown quantum state exactly. This underpins quantum cryptography.</li>
<li><strong>Quantum teleportation</strong> — transfers a qubit's state using entanglement plus 2 classical bits; the original is destroyed (consistent with no-cloning).</li>
</ul>
<div class="callout"><span class="badge">Not faster-than-light</span> Entanglement correlates measurements but sends no usable message on its own — teleportation still needs a classical channel, so relativity is safe.</div>`,
    `<span class="eyebrow">QTC211 · Chương 5 · Bài 5.1</span>
<h2>Rối lượng tử &amp; hiện tượng</h2>
<h3>Rối lượng tử &amp; trạng thái Bell</h3>
<p>Hai qubit <strong>rối</strong> khi trạng thái của cái này không thể mô tả độc lập với cái kia. Đơn giản nhất là <strong>trạng thái Bell</strong> (|00> + |11>)/sqrt(2): đo một qubit là biết ngay qubit kia, dù cách xa bao nhiêu.</p>
<pre><code>from qiskit import QuantumCircuit

qc = QuantumCircuit(2)
qc.h(0)              # chồng chập trên qubit 0
qc.cx(0, 1)          # CNOT -> trạng thái Bell (|00> + |11>)/sqrt(2)
</code></pre>
<h3>No-cloning &amp; dịch chuyển</h3>
<ul>
<li><strong>Định lý no-cloning</strong> — không thể sao chép chính xác một trạng thái lượng tử chưa biết. Đây là nền của mật mã lượng tử.</li>
<li><strong>Dịch chuyển lượng tử</strong> — chuyển trạng thái một qubit nhờ rối cộng 2 bit cổ điển; bản gốc bị phá huỷ (nhất quán với no-cloning).</li>
</ul>
<div class="callout"><span class="badge">Không nhanh hơn ánh sáng</span> Rối tạo tương quan phép đo nhưng tự nó không gửi được thông điệp — dịch chuyển vẫn cần kênh cổ điển, nên thuyết tương đối vẫn an toàn.</div>`,
  ]]);

const c5q = quiz('qtc211-quiz-5', 'Quiz 5 — Entanglement|||Quiz 5 — Rối lượng tử', [
  { id: 'q1', question: 'Trạng thái Bell (|00> + |11>)/sqrt(2) là ví dụ của?', options: ['Một qubit đơn lẻ', 'Hai qubit rối lượng tử', 'Bit cổ điển', 'Cổng Hadamard'], correctIndex: 1, explanation: 'Đây là trạng thái rối chuẩn của hai qubit.' },
  { id: 'q2', question: 'Định lý no-cloning nói điều gì?', options: ['Không thể đo qubit', 'Không thể sao chép chính xác trạng thái lượng tử chưa biết', 'Không thể tạo rối', 'Qubit luôn bằng |0>'], correctIndex: 1, explanation: 'No-cloning: không có cách sao chép hoàn hảo một trạng thái chưa biết.' },
  { id: 'q3', question: 'Dịch chuyển lượng tử (teleportation) cần thêm gì ngoài rối?', options: ['Không cần gì', '2 bit cổ điển gửi qua kênh thường', 'Sao chép qubit', 'Nhanh hơn ánh sáng'], correctIndex: 1, explanation: 'Cần gửi 2 bit cổ điển; vì vậy không vi phạm thuyết tương đối.' },
]);

const c6 = doc('qtc211-6-1-algorithms', '6.1 — Quantum algorithms|||6.1 — Thuật toán lượng tử',
  'Deutsch-Jozsa (song song lượng tử), Grover (tìm kiếm, tăng tốc bậc hai), Shor (phân tích số, tổng quan); ý tưởng giao thoa.',
  [[
    `<span class="eyebrow">QTC211 · Chapter 6 · Lesson 6.1</span>
<h2>Quantum algorithms</h2>
<h3>Deutsch-Jozsa — the first speed-up</h3>
<p>Decides whether a function is constant or balanced in <strong>one</strong> query, where a classical worst case needs many. It shows quantum parallelism plus <strong>interference</strong> can beat classical query counts.</p>
<h3>Grover's search</h3>
<p>Finds a marked item in an unsorted list of N in about sqrt(N) steps, versus N/2 classically — a <strong>quadratic</strong> speed-up. It repeatedly amplifies the amplitude of the target with a "diffusion" step.</p>
<pre><code>Classical unsorted search: ~ N/2 checks
Grover search:             ~ sqrt(N) checks   (quadratic speed-up)
</code></pre>
<h3>Shor's algorithm</h3>
<p><strong>Shor</strong> factors large integers in polynomial time using a quantum Fourier transform to find the period of a function — <strong>exponentially</strong> faster than known classical methods, which is why it threatens RSA encryption.</p>
<div class="callout"><span class="badge">The common trick</span> Quantum algorithms load many inputs into superposition, then use interference so wrong answers cancel and the right answer stands out when measured.</div>`,
    `<span class="eyebrow">QTC211 · Chương 6 · Bài 6.1</span>
<h2>Thuật toán lượng tử</h2>
<h3>Deutsch-Jozsa — tăng tốc đầu tiên</h3>
<p>Xác định một hàm là hằng hay cân bằng chỉ trong <strong>một</strong> lần hỏi, trong khi cổ điển ở trường hợp xấu cần nhiều lần. Nó cho thấy song song lượng tử cộng <strong>giao thoa</strong> vượt được số lần hỏi cổ điển.</p>
<h3>Tìm kiếm Grover</h3>
<p>Tìm một phần tử được đánh dấu trong danh sách N chưa sắp xếp trong khoảng sqrt(N) bước, so với N/2 kiểu cổ điển — tăng tốc <strong>bậc hai</strong>. Nó lặp lại việc khuếch đại biên độ của mục tiêu bằng bước "khuếch tán".</p>
<pre><code>Tìm kiếm cổ điển chưa sắp xếp: ~ N/2 lần kiểm
Tìm kiếm Grover:               ~ sqrt(N) lần kiểm   (tăng tốc bậc hai)
</code></pre>
<h3>Thuật toán Shor</h3>
<p><strong>Shor</strong> phân tích số nguyên lớn trong thời gian đa thức nhờ biến đổi Fourier lượng tử để tìm chu kỳ của một hàm — nhanh hơn <strong>theo hàm mũ</strong> so với phương pháp cổ điển đã biết, vì thế nó đe doạ mã hoá RSA.</p>
<div class="callout"><span class="badge">Mẹo chung</span> Thuật toán lượng tử nạp nhiều đầu vào vào chồng chập, rồi dùng giao thoa để đáp án sai triệt tiêu và đáp án đúng nổi bật khi đo.</div>`,
  ]]);

const c6q = quiz('qtc211-quiz-6', 'Quiz 6 — Algorithms|||Quiz 6 — Thuật toán', [
  { id: 'q1', question: 'Thuật toán Grover cho tốc độ tăng kiểu gì so với tìm kiếm cổ điển?', options: ['Tăng tốc theo hàm mũ', 'Tăng tốc bậc hai (sqrt(N))', 'Không nhanh hơn', 'Chậm hơn'], correctIndex: 1, explanation: 'Grover: ~sqrt(N) bước so với ~N/2, tức tăng tốc bậc hai.' },
  { id: 'q2', question: 'Thuật toán Shor đe doạ hệ mật mã nào?', options: ['AES đối xứng', 'RSA (phân tích số)', 'Hàm băm SHA', 'Không hệ nào'], correctIndex: 1, explanation: 'Shor phân tích số lớn nhanh theo hàm mũ, phá được RSA.' },
  { id: 'q3', question: 'Cơ chế chung mọi thuật toán lượng tử dựa vào để lấy đáp án là?', options: ['Sao chép qubit', 'Giao thoa: triệt tiêu đáp án sai, khuếch đại đáp án đúng', 'Đo liên tục', 'Tăng số bit cổ điển'], correctIndex: 1, explanation: 'Giao thoa làm biên độ sai triệt tiêu, đáp án đúng nổi bật khi đo.' },
]);

const c7 = doc('qtc211-7-1-noise-error-correction', '7.1 — Noise & error correction|||7.1 — Nhiễu & sửa lỗi',
  'Mất kết hợp (decoherence), lỗi lượng tử, sửa lỗi lượng tử (mã lặp/bề mặt), qubit logic vs vật lý, kỷ nguyên NISQ.',
  [[
    `<span class="eyebrow">QTC211 · Chapter 7 · Lesson 7.1</span>
<h2>Noise &amp; error correction</h2>
<h3>Decoherence — the enemy</h3>
<p><strong>Decoherence</strong> is the loss of a qubit's fragile quantum state to its environment. Together with gate errors it limits how long and how deep a circuit can run before results turn to noise.</p>
<h3>Quantum error correction</h3>
<p>You cannot copy a qubit (no-cloning), so QEC spreads one <strong>logical qubit</strong> across many <strong>physical qubits</strong> and measures parities to detect and fix errors without reading the data itself.</p>
<pre><code>1 logical qubit  = many physical qubits + syndrome measurement
Bit-flip code:  |0> -> |000> , |1> -> |111>   (majority vote fixes 1 flip)
Surface code:   the leading scalable QEC scheme today
</code></pre>
<h3>The NISQ era</h3>
<p>Today we have <strong>Noisy Intermediate-Scale Quantum</strong> devices: tens to hundreds of noisy qubits, no full error correction yet. Algorithms are designed to be shallow enough to finish before noise dominates.</p>
<div class="callout"><span class="badge">Overhead is huge</span> A single reliable logical qubit may need hundreds or thousands of physical qubits — the main reason large fault-tolerant machines are still years away.</div>`,
    `<span class="eyebrow">QTC211 · Chương 7 · Bài 7.1</span>
<h2>Nhiễu &amp; sửa lỗi</h2>
<h3>Mất kết hợp — kẻ thù</h3>
<p><strong>Mất kết hợp (decoherence)</strong> là việc trạng thái lượng tử mong manh của qubit rò rỉ ra môi trường. Cùng với lỗi cổng, nó giới hạn mạch chạy được bao lâu và sâu tới đâu trước khi kết quả biến thành nhiễu.</p>
<h3>Sửa lỗi lượng tử</h3>
<p>Không sao chép được qubit (no-cloning), nên QEC trải một <strong>qubit logic</strong> lên nhiều <strong>qubit vật lý</strong> và đo tính chẵn lẻ để phát hiện, sửa lỗi mà không đọc chính dữ liệu.</p>
<pre><code>1 qubit logic  = nhiều qubit vật lý + đo hội chứng (syndrome)
Mã lật bit:  |0> -> |000> , |1> -> |111>   (bỏ phiếu đa số sửa 1 lỗi lật)
Mã bề mặt:   sơ đồ QEC mở rộng dẫn đầu hiện nay
</code></pre>
<h3>Kỷ nguyên NISQ</h3>
<p>Hiện nay ta có thiết bị <strong>Noisy Intermediate-Scale Quantum</strong>: hàng chục tới hàng trăm qubit nhiễu, chưa sửa lỗi hoàn chỉnh. Thuật toán được thiết kế đủ nông để xong trước khi nhiễu lấn át.</p>
<div class="callout"><span class="badge">Chi phí khổng lồ</span> Một qubit logic đáng tin có thể cần hàng trăm đến hàng nghìn qubit vật lý — lý do chính khiến máy chịu lỗi cỡ lớn còn nhiều năm nữa.</div>`,
  ]]);

const c7q = quiz('qtc211-quiz-7', 'Quiz 7 — Noise & QEC|||Quiz 7 — Nhiễu & sửa lỗi', [
  { id: 'q1', question: '"Decoherence" (mất kết hợp) là gì?', options: ['Qubit chạy nhanh hơn', 'Trạng thái lượng tử bị mất ra môi trường', 'Một cổng lượng tử', 'Một thuật toán'], correctIndex: 1, explanation: 'Decoherence: qubit mất trạng thái lượng tử do tương tác môi trường.' },
  { id: 'q2', question: 'Sửa lỗi lượng tử (QEC) dùng cách nào để bảo vệ thông tin?', options: ['Sao chép trực tiếp qubit', 'Trải 1 qubit logic lên nhiều qubit vật lý', 'Đo và đọc dữ liệu liên tục', 'Tăng nhiễu'], correctIndex: 1, explanation: 'Vì không sao chép được, QEC mã hoá 1 qubit logic bằng nhiều qubit vật lý.' },
  { id: 'q3', question: 'NISQ là viết tắt của?', options: ['New Ideal Standard Qubits', 'Noisy Intermediate-Scale Quantum', 'Non-Interacting Silicon Qubits', 'Networked Ion Superconducting Qubits'], correctIndex: 1, explanation: 'NISQ = Noisy Intermediate-Scale Quantum: máy nhiễu, quy mô trung bình hiện nay.' },
]);

const c8 = doc('qtc211-8-1-programming-future', '8.1 — Programming & the future|||8.1 — Lập trình & tương lai',
  'Qiskit/Cirq/Q#, phần cứng lượng tử (siêu dẫn, ion bẫy), ưu thế lượng tử, ứng dụng crypto hậu lượng tử & machine learning.',
  [[
    `<span class="eyebrow">QTC211 · Chapter 8 · Lesson 8.1</span>
<h2>Programming &amp; the future</h2>
<h3>Quantum programming frameworks</h3>
<ul>
<li><strong>Qiskit</strong> (IBM) — Python, run on real hardware &amp; simulators.</li>
<li><strong>Cirq</strong> (Google) and <strong>Q#</strong> (Microsoft) — other mature stacks.</li>
</ul>
<pre><code>from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator

qc = QuantumCircuit(2, 2)
qc.h(0); qc.cx(0, 1)     # entangle
qc.measure([0, 1], [0, 1])
result = AerSimulator().run(qc, shots=1000).result()
print(result.get_counts())   # ~50% '00', ~50% '11'
</code></pre>
<h3>Hardware &amp; quantum supremacy</h3>
<p>Real qubits are built from <strong>superconducting circuits</strong> or <strong>trapped ions</strong>. <strong>Quantum supremacy</strong> is a demonstration that a quantum device solved a task no classical computer feasibly can — a milestone, not yet practical usefulness.</p>
<h3>Applications ahead</h3>
<ul>
<li><strong>Post-quantum cryptography</strong> — new classical schemes safe against Shor.</li>
<li><strong>Quantum machine learning</strong> — quantum kernels &amp; variational models.</li>
<li><strong>Chemistry, optimization, finance</strong> — the near-term hopefuls.</li>
</ul>
<div class="callout"><span class="badge">Where to go next</span> Keep coding on the IBM Quantum Platform, follow the Qiskit Textbook, and watch post-quantum crypto standards — the field is moving fast.</div>`,
    `<span class="eyebrow">QTC211 · Chương 8 · Bài 8.1</span>
<h2>Lập trình &amp; tương lai</h2>
<h3>Khung lập trình lượng tử</h3>
<ul>
<li><strong>Qiskit</strong> (IBM) — Python, chạy trên phần cứng thật &amp; trình mô phỏng.</li>
<li><strong>Cirq</strong> (Google) và <strong>Q#</strong> (Microsoft) — các bộ công cụ trưởng thành khác.</li>
</ul>
<pre><code>from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator

qc = QuantumCircuit(2, 2)
qc.h(0); qc.cx(0, 1)     # tạo rối
qc.measure([0, 1], [0, 1])
result = AerSimulator().run(qc, shots=1000).result()
print(result.get_counts())   # ~50% '00', ~50% '11'
</code></pre>
<h3>Phần cứng &amp; ưu thế lượng tử</h3>
<p>Qubit thật được dựng từ <strong>mạch siêu dẫn</strong> hoặc <strong>ion bẫy</strong>. <strong>Ưu thế lượng tử (quantum supremacy)</strong> là chứng minh một thiết bị lượng tử giải xong một tác vụ mà máy cổ điển khó lòng làm nổi — một cột mốc, chưa phải hữu ích thực tế.</p>
<h3>Ứng dụng phía trước</h3>
<ul>
<li><strong>Mật mã hậu lượng tử</strong> — sơ đồ cổ điển mới an toàn trước Shor.</li>
<li><strong>Machine learning lượng tử</strong> — nhân lượng tử &amp; mô hình biến phân.</li>
<li><strong>Hoá học, tối ưu, tài chính</strong> — các ứng cử viên gần hạn.</li>
</ul>
<div class="callout"><span class="badge">Đi tiếp từ đâu</span> Cứ code trên IBM Quantum Platform, theo Qiskit Textbook, và dõi các chuẩn mật mã hậu lượng tử — lĩnh vực này đang tiến rất nhanh.</div>`,
  ]]);

const c8q = quiz('qtc211-quiz-8', 'Quiz 8 — Programming & future|||Quiz 8 — Lập trình & tương lai', [
  { id: 'q1', question: 'Khung lập trình lượng tử của IBM (Python) là?', options: ['Cirq', 'Q#', 'Qiskit', 'TensorFlow'], correctIndex: 2, explanation: 'Qiskit là framework mã nguồn mở bằng Python của IBM.' },
  { id: 'q2', question: 'Qubit thật thường được dựng từ công nghệ nào?', options: ['Bóng bán dẫn silicon thường', 'Mạch siêu dẫn hoặc ion bẫy', 'Đèn LED', 'Ổ cứng từ'], correctIndex: 1, explanation: 'Hai nền tảng phổ biến: mạch siêu dẫn và ion bẫy.' },
  { id: 'q3', question: '"Ưu thế lượng tử" (quantum supremacy) nghĩa là?', options: ['Máy lượng tử thay mọi máy tính', 'Chứng minh làm xong tác vụ mà máy cổ điển khó làm nổi', 'Qubit không còn nhiễu', 'RSA đã an toàn tuyệt đối'], correctIndex: 1, explanation: 'Là cột mốc chứng minh vượt máy cổ điển ở một tác vụ, chưa hẳn hữu ích thực tế.' },
]);

export default {
  semester: { code: 'KY2', name: 'Kỳ 2', ordinal: 2 },
  course: {
    courseCode: 'QTC211',
    slug: 'qtc211-quantum-computing',
    title: 'Quantum Computing',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/QTC211.webp',
    shortDescription: 'How quantum computers work — qubits, superposition & the Bloch sphere, quantum gates (X/Y/Z/H/CNOT) & circuits, entanglement & teleportation, algorithms (Grover, Shor), error correction & NISQ, coded in Qiskit. Bilingual, quizzes each chapter.|||Máy tính lượng tử hoạt động thế nào — qubit, chồng chập & mặt cầu Bloch, cổng lượng tử (X/Y/Z/H/CNOT) & mạch, rối lượng tử & dịch chuyển, thuật toán (Grover, Shor), sửa lỗi & NISQ, lập trình Qiskit. Song ngữ, quiz mỗi chương.',
    description: 'Môn <strong>QTC211 — Quantum Computing (Điện toán lượng tử)</strong> thuộc khung chương trình ngành Khoa học Máy tính. Từ <strong>nền tảng</strong> (vì sao lượng tử, qubit &amp; chồng chập, |0>/|1>, mặt cầu Bloch, đo lường) → <strong>đại số tuyến tính</strong> (vector trạng thái, tích tensor, ma trận unitary) → <strong>cổng &amp; mạch</strong> (X/Y/Z/H/CNOT, Qiskit) → <strong>rối lượng tử</strong> (Bell, no-cloning, teleportation) → <strong>thuật toán</strong> (Deutsch-Jozsa, Grover, Shor) → <strong>nhiễu, sửa lỗi &amp; tương lai</strong> (decoherence, QEC, NISQ, quantum supremacy). Bám sách chuẩn Nielsen &amp; Chuang, IBM Qiskit Textbook, Bernhardt; song ngữ, có code Qiskit và quiz mỗi chương.',
    whatYouLearn: 'Bit cổ điển vs qubit; chồng chập a|0> + b|1>, biên độ &amp; xác suất, mặt cầu Bloch; đo lường &amp; sụp đổ; vector trạng thái, tích tensor, ma trận unitary; cổng X/Y/Z, H (Hadamard), CNOT &amp; mạch; rối lượng tử, trạng thái Bell, no-cloning, dịch chuyển lượng tử; thuật toán Deutsch-Jozsa, Grover (sqrt(N)), Shor (phá RSA); decoherence, sửa lỗi lượng tử, NISQ; lập trình Qiskit/Cirq/Q#, phần cứng &amp; ưu thế lượng tử.',
    requirements: 'Đại số tuyến tính cơ bản (vector, ma trận) và số phức; biết lập trình Python là một lợi thế để chạy Qiskit. Xem điều kiện tiên quyết trong khung chương trình ngành Khoa học Máy tính trên FLM.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách chuẩn, IBM Qiskit & Microsoft Q#, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Điện toán lượng tử, bit vs qubit, lộ trình.', lessons: [intro] },
    { title: 'Chương 1 — Nhập môn lượng tử|||Chapter 1 — Why quantum', description: 'Vì sao quantum, cổ điển vs lượng tử, ứng dụng.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Qubit & trạng thái|||Chapter 2 — Qubits & states', description: 'Chồng chập, |0>/|1>, Bloch sphere, đo lường.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Đại số tuyến tính|||Chapter 3 — Linear algebra', description: 'Vector trạng thái, tích tensor, ma trận unitary.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Cổng lượng tử & mạch|||Chapter 4 — Gates & circuits', description: 'X/Y/Z/H/CNOT, mạch, Qiskit.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Rối lượng tử & hiện tượng|||Chapter 5 — Entanglement', description: 'Rối, Bell, no-cloning, teleportation.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Thuật toán lượng tử|||Chapter 6 — Algorithms', description: 'Deutsch-Jozsa, Grover, Shor.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Nhiễu & sửa lỗi|||Chapter 7 — Noise & error correction', description: 'Decoherence, QEC, NISQ.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Lập trình & tương lai|||Chapter 8 — Programming & future', description: 'Qiskit/Cirq/Q#, phần cứng, ưu thế lượng tử, ứng dụng.', lessons: [c8, c8q] },
  ],
};
