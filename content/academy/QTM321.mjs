/**
 * QTM321 — Quantum Machine Learning (Học máy lượng tử). Ngành Khoa học Máy
 * tính, FPTU, Kỳ 4. Song ngữ VI+EN, 8 chương (mỗi chương 1 DOCUMENT + 1 QUIZ).
 * Nguồn trích dẫn: Nielsen & Chuang "Quantum Computation and Quantum
 * Information"; Schuld & Petruccione "Machine Learning with Quantum Computers";
 * Qiskit Textbook; PennyLane demos. Ký hiệu viết bằng chữ Latin (psi, theta,
 * ket, bra). GIỮ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick lồng nhau / ${.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('qtm321-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình chuẩn (Nielsen & Chuang, Schuld & Petruccione), Qiskit Textbook, PennyLane demos, YouTube, công cụ, lộ trình.',
  [[
    `<span class="eyebrow">QTM321 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Quantum Machine Learning</strong> — qubits, quantum circuits, data encoding, variational circuits, quantum neural networks and near-term algorithms — gathered in one place. Below are standard textbooks and free, legal resources.</p>
<h3>📘 Standard textbooks</h3>
<ul>
<li><strong>Nielsen &amp; Chuang</strong> — <em>Quantum Computation and Quantum Information</em> (the canonical reference for qubits, gates and algorithms).</li>
<li><strong>Schuld &amp; Petruccione</strong> — <em>Machine Learning with Quantum Computers</em> (encoding, variational models, quantum kernels).</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://qiskit.org/textbook" target="_blank" rel="noopener">Qiskit Textbook</a> — free interactive course from IBM.</li>
<li><a href="https://pennylane.ai/qml/demos/" target="_blank" rel="noopener">PennyLane demos</a> — runnable QML tutorials from Xanadu.</li>
<li><a href="https://docs.quantum.ibm.com/" target="_blank" rel="noopener">IBM Quantum documentation</a> — run circuits on real hardware.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.ibm.com/quantum/qiskit" target="_blank" rel="noopener">Qiskit</a> — Python SDK for building and running quantum circuits.</li>
<li><a href="https://pennylane.ai/" target="_blank" rel="noopener">PennyLane</a> — differentiable programming for quantum + classical models.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — qubits, superposition, entanglement, gates and circuits.</li>
<li><strong>Bridge</strong> — review classical ML, then encode data into quantum states.</li>
<li><strong>Models</strong> — variational circuits, quantum neural networks and quantum kernels.</li>
<li><strong>Near-term</strong> — VQE, QAOA, quantum SVM, and the limits of NISQ hardware.</li>
</ol></div>`,
    `<span class="eyebrow">QTM321 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Học máy lượng tử</strong> — qubit, mạch lượng tử, mã hoá dữ liệu, mạch biến phân, mạng nơ-ron lượng tử và thuật toán ngắn hạn — gom về một chỗ. Bên dưới là giáo trình chuẩn và nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình chuẩn</h3>
<ul>
<li><strong>Nielsen &amp; Chuang</strong> — <em>Quantum Computation and Quantum Information</em> (kinh điển về qubit, cổng và thuật toán).</li>
<li><strong>Schuld &amp; Petruccione</strong> — <em>Machine Learning with Quantum Computers</em> (mã hoá, mô hình biến phân, kernel lượng tử).</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://qiskit.org/textbook" target="_blank" rel="noopener">Qiskit Textbook</a> — khoá học tương tác miễn phí của IBM.</li>
<li><a href="https://pennylane.ai/qml/demos/" target="_blank" rel="noopener">PennyLane demos</a> — hướng dẫn QML chạy được của Xanadu.</li>
<li><a href="https://docs.quantum.ibm.com/" target="_blank" rel="noopener">Tài liệu IBM Quantum</a> — chạy mạch trên phần cứng thật.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.ibm.com/quantum/qiskit" target="_blank" rel="noopener">Qiskit</a> — SDK Python để dựng và chạy mạch lượng tử.</li>
<li><a href="https://pennylane.ai/" target="_blank" rel="noopener">PennyLane</a> — lập trình khả vi cho mô hình lượng tử + cổ điển.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — qubit, chồng chập, rối lượng tử, cổng và mạch.</li>
<li><strong>Cầu nối</strong> — ôn ML cổ điển, rồi mã hoá dữ liệu vào trạng thái lượng tử.</li>
<li><strong>Mô hình</strong> — mạch biến phân, mạng nơ-ron lượng tử và kernel lượng tử.</li>
<li><strong>Ngắn hạn</strong> — VQE, QAOA, quantum SVM, và giới hạn của phần cứng NISQ.</li>
</ol></div>`,
  ]]);

const intro = doc('qtm321-0-1-overview', 'Course overview: Quantum Machine Learning|||Tổng quan: Học máy lượng tử',
  'QML là gì; vì sao ghép lượng tử với ML; lộ trình 8 chương: nền tảng → cổng/mạch → ôn ML → mã hoá dữ liệu → mạch biến phân → QNN/kernel → thuật toán → công cụ & NISQ.',
  [[
    `<span class="eyebrow">QTM321 · Lesson 0.1 · Overview</span>
<h2>Quantum Machine Learning</h2>
<p class="lead">This course studies where <strong>quantum computing</strong> and <strong>machine learning</strong> meet. You will learn how quantum states carry information, how to load classical data into a quantum computer, and how <strong>parameterized quantum circuits</strong> are trained like neural networks on today's noisy hardware.</p>
<h3>Why combine quantum with ML?</h3>
<ul>
<li><strong>Big state spaces</strong> — n qubits describe a vector of size 2 to the power n, a huge feature space to compute with.</li>
<li><strong>Quantum kernels</strong> — data mapped into quantum states may become easier to separate.</li>
<li><strong>Trainable circuits</strong> — variational circuits play the role of models with tunable parameters.</li>
</ul>
<h3>Roadmap</h3>
<p>Foundations (qubits, superposition, entanglement) → gates &amp; circuits → classical ML recap &amp; motivation → data encoding → variational circuits → quantum neural networks &amp; kernels → algorithms (VQE, QAOA, quantum SVM) → tools (Qiskit/PennyLane), NISQ &amp; real-world use. Bilingual, with circuit examples and a quiz per chapter.</p>
<div class="callout"><span class="badge">Be honest about hype</span> QML is a young field. We highlight what is proven, what is promising, and what is still open — no magic speedups are assumed.</div>`,
    `<span class="eyebrow">QTM321 · Bài 0.1 · Tổng quan</span>
<h2>Học máy lượng tử</h2>
<p class="lead">Môn này nghiên cứu nơi <strong>tính toán lượng tử</strong> gặp <strong>học máy</strong>. Bạn sẽ hiểu trạng thái lượng tử mang thông tin thế nào, cách nạp dữ liệu cổ điển vào máy tính lượng tử, và cách <strong>mạch lượng tử tham số hoá</strong> được huấn luyện như mạng nơ-ron trên phần cứng nhiễu hiện nay.</p>
<h3>Vì sao ghép lượng tử với ML?</h3>
<ul>
<li><strong>Không gian trạng thái lớn</strong> — n qubit mô tả một vector cỡ 2 mũ n, một không gian đặc trưng khổng lồ để tính toán.</li>
<li><strong>Kernel lượng tử</strong> — dữ liệu ánh xạ vào trạng thái lượng tử có thể dễ phân tách hơn.</li>
<li><strong>Mạch huấn luyện được</strong> — mạch biến phân đóng vai mô hình có tham số điều chỉnh được.</li>
</ul>
<h3>Lộ trình</h3>
<p>Nền tảng (qubit, chồng chập, rối) → cổng &amp; mạch → ôn ML cổ điển &amp; động lực → mã hoá dữ liệu → mạch biến phân → mạng nơ-ron &amp; kernel lượng tử → thuật toán (VQE, QAOA, quantum SVM) → công cụ (Qiskit/PennyLane), NISQ &amp; ứng dụng. Song ngữ, có ví dụ mạch và quiz mỗi chương.</p>
<div class="callout"><span class="badge">Thành thật về kỳ vọng</span> QML còn non trẻ. Ta nêu rõ điều gì đã chứng minh, điều gì hứa hẹn, điều gì còn bỏ ngỏ — không giả định phép màu tăng tốc.</div>`,
  ]]);

const c1 = doc('qtm321-1-1-foundations', '1.1 — Qubits, superposition & entanglement|||1.1 — Qubit, chồng chập & rối lượng tử',
  'Bit vs qubit; ket |0>/|1>, chồng chập (superposition), biên độ & xác suất; đo lường; rối lượng tử (entanglement) và trạng thái Bell.',
  [[
    `<span class="eyebrow">QTM321 · Chapter 1 · Lesson 1.1</span>
<h2>Qubits, superposition &amp; entanglement</h2>
<h3>Bit vs qubit</h3>
<p>A classical <strong>bit</strong> is 0 or 1. A <strong>qubit</strong> can be in a <strong>superposition</strong> of both, written as a state "psi":</p>
<pre><code>psi = a * ket(0) + b * ket(1)

  a, b are complex amplitudes
  probability of measuring 0 = |a|^2
  probability of measuring 1 = |b|^2
  normalization: |a|^2 + |b|^2 = 1
</code></pre>
<p>Here <code>ket(0)</code> and <code>ket(1)</code> (read "ket zero", "ket one") are the two basis states. The bra-ket notation writes a column state as a ket and its conjugate row as a bra.</p>
<h3>Measurement</h3>
<p>Measuring a qubit <strong>collapses</strong> the superposition to a single outcome (0 or 1) with the probabilities above. You cannot read the amplitudes directly — only sampled outcomes.</p>
<h3>Entanglement</h3>
<p>Two qubits can be <strong>entangled</strong>: their outcomes are correlated even when measured apart. The <strong>Bell state</strong> is the classic example:</p>
<pre><code>bell = ( ket(00) + ket(11) ) / sqrt(2)

  measure -> either 00 or 11, each with prob 1/2
  never 01 or 10: the two qubits always agree
</code></pre>
<div class="callout"><span class="badge">Key idea</span> Superposition gives a qubit a rich state; entanglement links qubits so the whole is more than its parts. Both are resources QML tries to exploit.</div>`,
    `<span class="eyebrow">QTM321 · Chương 1 · Bài 1.1</span>
<h2>Qubit, chồng chập &amp; rối lượng tử</h2>
<h3>Bit và qubit</h3>
<p>Một <strong>bit</strong> cổ điển là 0 hoặc 1. Một <strong>qubit</strong> có thể ở <strong>chồng chập</strong> của cả hai, viết là trạng thái "psi":</p>
<pre><code>psi = a * ket(0) + b * ket(1)

  a, b la bien do phuc
  xac suat do duoc 0 = |a|^2
  xac suat do duoc 1 = |b|^2
  chuan hoa: |a|^2 + |b|^2 = 1
</code></pre>
<p>Ở đây <code>ket(0)</code> và <code>ket(1)</code> (đọc "ket không", "ket một") là hai trạng thái cơ sở. Ký hiệu bra-ket viết trạng thái dạng cột là ket, dòng liên hợp là bra.</p>
<h3>Đo lường</h3>
<p>Đo một qubit làm <strong>sụp đổ</strong> chồng chập về một kết quả duy nhất (0 hoặc 1) theo xác suất trên. Bạn không đọc trực tiếp được biên độ — chỉ thấy kết quả lấy mẫu.</p>
<h3>Rối lượng tử</h3>
<p>Hai qubit có thể <strong>rối</strong> nhau: kết quả của chúng tương quan ngay cả khi đo tách rời. <strong>Trạng thái Bell</strong> là ví dụ kinh điển:</p>
<pre><code>bell = ( ket(00) + ket(11) ) / sqrt(2)

  do -> hoac 00 hoac 11, moi cai xac suat 1/2
  khong bao gio 01 hay 10: hai qubit luon dong y
</code></pre>
<div class="callout"><span class="badge">Ý chính</span> Chồng chập cho qubit một trạng thái phong phú; rối liên kết các qubit để tổng thể lớn hơn từng phần. Cả hai là tài nguyên mà QML cố khai thác.</div>`,
  ]]);

const c1q = quiz('qtm321-quiz-1', 'Quiz 1 — Foundations|||Quiz 1 — Nền tảng', [
  { id: 'q1', question: 'Với qubit psi = a·ket(0) + b·ket(1), điều kiện chuẩn hoá là?', options: ['a + b = 1', '|a|^2 + |b|^2 = 1', 'a·b = 1', 'a = b'], correctIndex: 1, explanation: 'Tổng xác suất phải bằng 1: |a|^2 + |b|^2 = 1.' },
  { id: 'q2', question: 'Đo một qubit ở chồng chập sẽ?', options: ['Trả về cả hai giá trị cùng lúc', 'Đọc trực tiếp biên độ a, b', 'Làm sụp đổ về một kết quả 0 hoặc 1 theo xác suất', 'Không thay đổi trạng thái'], correctIndex: 2, explanation: 'Đo làm sụp đổ chồng chập về một kết quả, với xác suất |a|^2, |b|^2.' },
  { id: 'q3', question: 'Trạng thái Bell (ket(00)+ket(11))/sqrt(2) khi đo cho ra?', options: ['Luôn 01 hoặc 10', 'Chỉ 00 hoặc 11, hai qubit luôn khớp nhau', 'Bốn kết quả đều xác suất bằng nhau', 'Luôn 00'], correctIndex: 1, explanation: 'Đây là trạng thái rối: chỉ 00 hoặc 11, hai qubit luôn đồng ý.' },
]);

const c2 = doc('qtm321-2-1-gates-circuits', '2.1 — Quantum gates & circuits|||2.1 — Cổng lượng tử & mạch lượng tử',
  'Cổng 1 qubit (X, H, cổng xoay Rx/Ry/Rz), cổng 2 qubit (CNOT), tính unitary/thuận nghịch; mạch lượng tử đọc từ trái sang phải; ví dụ dựng trạng thái Bell bằng Qiskit.',
  [[
    `<span class="eyebrow">QTM321 · Chapter 2 · Lesson 2.1</span>
<h2>Quantum gates &amp; circuits</h2>
<h3>Single-qubit gates</h3>
<ul>
<li><strong>X (NOT)</strong> — flips ket(0) and ket(1).</li>
<li><strong>H (Hadamard)</strong> — creates a superposition: H·ket(0) = (ket(0)+ket(1))/sqrt(2).</li>
<li><strong>Rotation gates Rx, Ry, Rz</strong> — rotate the qubit by an angle "theta"; these carry the trainable parameters in QML.</li>
</ul>
<h3>Two-qubit gates</h3>
<p><strong>CNOT</strong> (controlled-NOT) flips the target qubit only when the control is 1. It is how circuits create entanglement.</p>
<h3>Circuits are unitary &amp; reversible</h3>
<p>Every gate is a <strong>unitary</strong> operation, so quantum circuits are <strong>reversible</strong> (except measurement). A circuit is read left to right; each wire is a qubit.</p>
<pre><code># Qiskit: build a Bell state
from qiskit import QuantumCircuit

qc = QuantumCircuit(2)
qc.h(0)         # Hadamard on qubit 0 -> superposition
qc.cx(0, 1)     # CNOT: entangle qubit 1 with qubit 0
qc.measure_all()
# outcomes: about half 00, half 11
</code></pre>
<div class="callout"><span class="badge">Building block</span> H then CNOT is the standard recipe for a Bell pair — the smallest entangling circuit, and a piece you will reuse everywhere.</div>`,
    `<span class="eyebrow">QTM321 · Chương 2 · Bài 2.1</span>
<h2>Cổng lượng tử &amp; mạch lượng tử</h2>
<h3>Cổng một qubit</h3>
<ul>
<li><strong>X (NOT)</strong> — lật ket(0) và ket(1).</li>
<li><strong>H (Hadamard)</strong> — tạo chồng chập: H·ket(0) = (ket(0)+ket(1))/sqrt(2).</li>
<li><strong>Cổng xoay Rx, Ry, Rz</strong> — xoay qubit một góc "theta"; đây là nơi chứa tham số huấn luyện trong QML.</li>
</ul>
<h3>Cổng hai qubit</h3>
<p><strong>CNOT</strong> (NOT có điều khiển) lật qubit đích chỉ khi qubit điều khiển bằng 1. Đây là cách mạch tạo ra rối lượng tử.</p>
<h3>Mạch là unitary &amp; thuận nghịch</h3>
<p>Mọi cổng là phép <strong>unitary</strong>, nên mạch lượng tử <strong>thuận nghịch</strong> (trừ phép đo). Mạch đọc từ trái sang phải; mỗi dây là một qubit.</p>
<pre><code># Qiskit: dung trang thai Bell
from qiskit import QuantumCircuit

qc = QuantumCircuit(2)
qc.h(0)         # Hadamard len qubit 0 -> chong chap
qc.cx(0, 1)     # CNOT: roi qubit 1 voi qubit 0
qc.measure_all()
# ket qua: khoang mot nua 00, mot nua 11
</code></pre>
<div class="callout"><span class="badge">Khối dựng</span> H rồi CNOT là công thức chuẩn cho một cặp Bell — mạch tạo rối nhỏ nhất, và là mảnh bạn sẽ dùng lại khắp nơi.</div>`,
  ]]);

const c2q = quiz('qtm321-quiz-2', 'Quiz 2 — Gates & circuits|||Quiz 2 — Cổng & mạch', [
  { id: 'q1', question: 'Cổng Hadamard (H) tác dụng lên ket(0) cho ra?', options: ['ket(1)', 'Chồng chập (ket(0)+ket(1))/sqrt(2)', 'ket(0) không đổi', 'Trạng thái rối'], correctIndex: 1, explanation: 'H tạo chồng chập đều: H·ket(0) = (ket(0)+ket(1))/sqrt(2).' },
  { id: 'q2', question: 'Cổng CNOT dùng để?', options: ['Đo qubit', 'Lật qubit đích khi qubit điều khiển bằng 1, tạo rối', 'Xoay một góc theta', 'Đặt lại qubit về 0'], correctIndex: 1, explanation: 'CNOT lật đích khi điều khiển = 1; là cổng tạo rối tiêu biểu.' },
  { id: 'q3', question: 'Trong QML, tham số huấn luyện thường nằm ở cổng nào?', options: ['Cổng đo', 'Cổng X cố định', 'Cổng xoay Rx/Ry/Rz (góc theta)', 'CNOT'], correctIndex: 2, explanation: 'Các cổng xoay mang góc theta điều chỉnh được — đó là tham số học.' },
]);

const c3 = doc('qtm321-3-1-classical-ml-recap', '3.1 — Classical ML recap & QML motivation|||3.1 — Ôn ML cổ điển & động lực QML',
  'Ôn ML cổ điển: mô hình có tham số, hàm mất mát (loss), gradient descent, overfitting; vì sao QML lặp lại đúng khung này với mạch lượng tử làm mô hình.',
  [[
    `<span class="eyebrow">QTM321 · Chapter 3 · Lesson 3.1</span>
<h2>Classical ML recap &amp; QML motivation</h2>
<h3>The classical training loop</h3>
<p>A supervised model is a parameterized function; training tunes the parameters to minimize a <strong>loss</strong>:</p>
<pre><code>predict:  y_hat = f(x ; theta)
loss:     L(theta) = average( error(y_hat, y) )
update:   theta &lt;- theta - lr * gradient(L)   # gradient descent
</code></pre>
<ul>
<li><strong>Model</strong> — a function with parameters "theta" (weights of a neural net, etc.).</li>
<li><strong>Loss</strong> — how wrong predictions are (e.g. mean squared error, cross-entropy).</li>
<li><strong>Gradient descent</strong> — step "theta" downhill; the learning rate "lr" sets the step size.</li>
<li><strong>Overfitting</strong> — memorizing training data instead of generalizing; watch validation error.</li>
</ul>
<h3>Why this matters for QML</h3>
<p>QML keeps <em>exactly</em> this loop. The difference: the model <code>f(x ; theta)</code> is a <strong>quantum circuit</strong> whose rotation angles are the parameters, and the prediction comes from measuring the circuit. The optimizer stays classical.</p>
<div class="callout"><span class="badge">Same recipe, new model</span> If you know how a neural network is trained, you already know the shape of how a variational quantum model is trained — only the model in the middle changes.</div>`,
    `<span class="eyebrow">QTM321 · Chương 3 · Bài 3.1</span>
<h2>Ôn ML cổ điển &amp; động lực QML</h2>
<h3>Vòng huấn luyện cổ điển</h3>
<p>Mô hình có giám sát là một hàm có tham số; huấn luyện là chỉnh tham số để tối thiểu hoá <strong>hàm mất mát (loss)</strong>:</p>
<pre><code>du doan:  y_hat = f(x ; theta)
mat mat:  L(theta) = trung binh( sai_so(y_hat, y) )
cap nhat: theta &lt;- theta - lr * gradient(L)   # gradient descent
</code></pre>
<ul>
<li><strong>Mô hình</strong> — hàm có tham số "theta" (trọng số mạng nơ-ron, v.v.).</li>
<li><strong>Loss</strong> — mức sai của dự đoán (vd sai số bình phương trung bình, cross-entropy).</li>
<li><strong>Gradient descent</strong> — bước "theta" xuống dốc; tốc độ học "lr" đặt độ lớn bước.</li>
<li><strong>Overfitting</strong> — học thuộc dữ liệu thay vì tổng quát hoá; theo dõi lỗi trên tập kiểm định.</li>
</ul>
<h3>Vì sao điều này quan trọng với QML</h3>
<p>QML giữ <em>đúng</em> vòng lặp này. Khác biệt: mô hình <code>f(x ; theta)</code> là một <strong>mạch lượng tử</strong> mà các góc xoay là tham số, và dự đoán đến từ việc đo mạch. Bộ tối ưu vẫn cổ điển.</p>
<div class="callout"><span class="badge">Cùng công thức, mô hình mới</span> Nếu bạn biết cách huấn luyện mạng nơ-ron, bạn đã nắm được hình dạng huấn luyện mô hình lượng tử biến phân — chỉ phần mô hình ở giữa thay đổi.</div>`,
  ]]);

const c3q = quiz('qtm321-quiz-3', 'Quiz 3 — Classical ML recap|||Quiz 3 — Ôn ML cổ điển', [
  { id: 'q1', question: 'Trong huấn luyện, hàm mất mát (loss) đo điều gì?', options: ['Số tham số của mô hình', 'Mức sai của dự đoán so với nhãn thật', 'Tốc độ học', 'Số qubit'], correctIndex: 1, explanation: 'Loss đo mức sai của dự đoán; huấn luyện tối thiểu hoá nó.' },
  { id: 'q2', question: 'Gradient descent cập nhật tham số theta bằng cách?', options: ['Tăng theta ngẫu nhiên', 'Bước theta ngược hướng gradient của loss', 'Đặt theta về 0', 'Nhân theta với learning rate'], correctIndex: 1, explanation: 'theta ← theta − lr·gradient(L): đi xuống dốc theo gradient.' },
  { id: 'q3', question: 'Điểm khác cốt lõi của QML so với ML cổ điển là?', options: ['Bỏ hoàn toàn gradient descent', 'Mô hình f(x;theta) là một mạch lượng tử được đo', 'Không cần dữ liệu', 'Không có tham số'], correctIndex: 1, explanation: 'QML giữ vòng huấn luyện; chỉ thay mô hình thành mạch lượng tử.' },
]);

const c4 = doc('qtm321-4-1-data-encoding', '4.1 — Encoding data into quantum states|||4.1 — Mã hoá dữ liệu vào trạng thái lượng tử',
  'Vì sao phải mã hoá; basis encoding, amplitude encoding, angle encoding; feature map lượng tử; đánh đổi số qubit vs độ sâu mạch; ví dụ angle encoding.',
  [[
    `<span class="eyebrow">QTM321 · Chapter 4 · Lesson 4.1</span>
<h2>Encoding data into quantum states</h2>
<p>A quantum model cannot see raw numbers — classical data must first be <strong>encoded</strong> into a quantum state. The encoding is a feature map; its choice strongly shapes what the model can learn.</p>
<h3>Three common schemes</h3>
<ul>
<li><strong>Basis encoding</strong> — write a bit string directly into computational basis states (e.g. 101 to ket(101)). Simple, but uses one qubit per bit.</li>
<li><strong>Amplitude encoding</strong> — pack a normalized vector of 2 to the power n numbers into the amplitudes of n qubits. Very compact, but hard to prepare.</li>
<li><strong>Angle encoding</strong> — feed each feature as a rotation angle "theta". Practical on near-term hardware.</li>
</ul>
<pre><code># PennyLane: angle encoding of a feature vector x
import pennylane as qml

def feature_map(x):
    for i in range(len(x)):
        qml.RY(x[i], wires=i)   # each feature -> a rotation angle
</code></pre>
<h3>The trade-off</h3>
<p>Amplitude encoding is compact (n qubits hold 2 to the power n values) but needs deep state-preparation circuits; angle encoding is shallow and hardware-friendly but uses one qubit per feature. Choosing an encoding is a real design decision.</p>
<div class="callout"><span class="badge">Encoding is the model</span> The feature map defines the quantum feature space. Two models with the same trainable part but different encodings can behave completely differently.</div>`,
    `<span class="eyebrow">QTM321 · Chương 4 · Bài 4.1</span>
<h2>Mã hoá dữ liệu vào trạng thái lượng tử</h2>
<p>Mô hình lượng tử không "nhìn" được số thô — dữ liệu cổ điển phải được <strong>mã hoá</strong> vào trạng thái lượng tử trước. Mã hoá chính là feature map; lựa chọn của nó định hình mạnh những gì mô hình học được.</p>
<h3>Ba cách phổ biến</h3>
<ul>
<li><strong>Basis encoding</strong> — ghi thẳng chuỗi bit vào trạng thái cơ sở tính toán (vd 101 thành ket(101)). Đơn giản, nhưng tốn một qubit mỗi bit.</li>
<li><strong>Amplitude encoding</strong> — nhồi một vector chuẩn hoá gồm 2 mũ n số vào biên độ của n qubit. Rất gọn, nhưng khó chuẩn bị.</li>
<li><strong>Angle encoding</strong> — đưa mỗi đặc trưng làm góc xoay "theta". Thực tế trên phần cứng ngắn hạn.</li>
</ul>
<pre><code># PennyLane: angle encoding cho vector dac trung x
import pennylane as qml

def feature_map(x):
    for i in range(len(x)):
        qml.RY(x[i], wires=i)   # moi dac trung -> mot goc xoay
</code></pre>
<h3>Đánh đổi</h3>
<p>Amplitude encoding gọn (n qubit chứa 2 mũ n giá trị) nhưng cần mạch chuẩn bị trạng thái sâu; angle encoding nông và thân thiện phần cứng nhưng tốn một qubit mỗi đặc trưng. Chọn cách mã hoá là một quyết định thiết kế thực sự.</p>
<div class="callout"><span class="badge">Mã hoá chính là mô hình</span> Feature map định nghĩa không gian đặc trưng lượng tử. Hai mô hình cùng phần huấn luyện nhưng khác mã hoá có thể hành xử hoàn toàn khác nhau.</div>`,
  ]]);

const c4q = quiz('qtm321-quiz-4', 'Quiz 4 — Data encoding|||Quiz 4 — Mã hoá dữ liệu', [
  { id: 'q1', question: 'Vì sao cần mã hoá dữ liệu trước khi đưa vào mô hình lượng tử?', options: ['Để giảm số tham số', 'Vì mô hình lượng tử chỉ làm việc trên trạng thái lượng tử, không phải số thô', 'Để tránh overfitting', 'Vì phần cứng yêu cầu số nguyên'], correctIndex: 1, explanation: 'Dữ liệu cổ điển phải được nạp thành trạng thái lượng tử (feature map).' },
  { id: 'q2', question: 'Amplitude encoding có đặc điểm nào?', options: ['Tốn một qubit mỗi bit', 'Nhồi 2 mũ n giá trị vào n qubit, rất gọn nhưng khó chuẩn bị', 'Không cần chuẩn hoá', 'Chỉ dùng cho dữ liệu nhị phân'], correctIndex: 1, explanation: 'n qubit chứa 2^n biên độ — gọn, nhưng mạch chuẩn bị trạng thái sâu.' },
  { id: 'q3', question: 'Angle encoding đưa mỗi đặc trưng vào đâu?', options: ['Một qubit điều khiển CNOT', 'Một góc xoay theta của cổng xoay', 'Một phép đo', 'Một trạng thái Bell'], correctIndex: 1, explanation: 'Mỗi đặc trưng thành góc xoay (vd RY(x[i])) — nông, thân thiện phần cứng.' },
]);

const c5 = doc('qtm321-5-1-variational-circuits', '5.1 — Variational quantum circuits|||5.1 — Mạch lượng tử biến phân',
  'Parameterized quantum circuit (PQC) & ansatz; ba tầng: mã hoá → lớp biến phân (rotation + entangling) → đo; parameter-shift rule để lấy gradient; vòng huấn luyện lai lượng tử-cổ điển.',
  [[
    `<span class="eyebrow">QTM321 · Chapter 5 · Lesson 5.1</span>
<h2>Variational quantum circuits</h2>
<p>A <strong>variational quantum circuit (VQC)</strong>, also called a <strong>parameterized quantum circuit (PQC)</strong> or <strong>ansatz</strong>, is a circuit whose gate angles are trainable parameters "theta". It is the quantum analogue of a neural network layer.</p>
<h3>Three-part structure</h3>
<pre><code>1. Encoding layer    -> load data x into the state (feature map)
2. Variational layer -> rotations R(theta) + entangling CNOTs, repeated
3. Measurement       -> read an expectation value -> prediction
</code></pre>
<h3>Training: the hybrid loop</h3>
<p>The circuit runs on a quantum device (or simulator); a <strong>classical</strong> optimizer updates "theta". Gradients come from the <strong>parameter-shift rule</strong>, which evaluates the circuit at shifted angles:</p>
<pre><code>gradient wrt theta = ( f(theta + s) - f(theta - s) ) / 2
   # s is a fixed shift (often pi/2)
   # exact gradient from two circuit runs, no finite-difference noise issue
</code></pre>
<div class="callout"><span class="badge">Watch out: barren plateaus</span> Deep, randomly-initialized ansaetze can have gradients that vanish almost everywhere — a "barren plateau" that stalls training. Structure and good initialization matter.</div>`,
    `<span class="eyebrow">QTM321 · Chương 5 · Bài 5.1</span>
<h2>Mạch lượng tử biến phân</h2>
<p>Một <strong>mạch lượng tử biến phân (VQC)</strong>, còn gọi là <strong>mạch lượng tử tham số hoá (PQC)</strong> hay <strong>ansatz</strong>, là mạch có góc cổng là tham số huấn luyện "theta". Nó là bản lượng tử của một lớp mạng nơ-ron.</p>
<h3>Cấu trúc ba phần</h3>
<pre><code>1. Lop ma hoa    -> nap du lieu x vao trang thai (feature map)
2. Lop bien phan -> cac phep xoay R(theta) + CNOT tao roi, lap lai
3. Do luong      -> doc gia tri ky vong -> du doan
</code></pre>
<h3>Huấn luyện: vòng lặp lai</h3>
<p>Mạch chạy trên thiết bị lượng tử (hoặc trình mô phỏng); một bộ tối ưu <strong>cổ điển</strong> cập nhật "theta". Gradient đến từ <strong>parameter-shift rule</strong>, tính mạch tại các góc bị dịch:</p>
<pre><code>gradient theo theta = ( f(theta + s) - f(theta - s) ) / 2
   # s la buoc dich co dinh (thuong pi/2)
   # gradient chinh xac tu hai lan chay mach, khong nhieu sai phan huu han
</code></pre>
<div class="callout"><span class="badge">Cẩn thận: barren plateau</span> Ansatz sâu, khởi tạo ngẫu nhiên có thể có gradient triệt tiêu gần như khắp nơi — "cao nguyên cằn" làm huấn luyện đứng yên. Cấu trúc và khởi tạo tốt rất quan trọng.</div>`,
  ]]);

const c5q = quiz('qtm321-quiz-5', 'Quiz 5 — Variational circuits|||Quiz 5 — Mạch biến phân', [
  { id: 'q1', question: 'Trong mạch biến phân (VQC), tham số huấn luyện theta nằm ở đâu?', options: ['Ở phép đo cuối', 'Ở các góc của cổng xoay trong lớp biến phân', 'Ở số qubit', 'Ở dữ liệu đầu vào'], correctIndex: 1, explanation: 'Các góc cổng xoay R(theta) là tham số học, giống trọng số mạng nơ-ron.' },
  { id: 'q2', question: 'Parameter-shift rule dùng để?', options: ['Đo entanglement', 'Tính gradient chính xác bằng cách chạy mạch tại góc dịch +s và -s', 'Mã hoá dữ liệu', 'Giảm số qubit'], correctIndex: 1, explanation: 'Gradient = (f(theta+s) − f(theta−s))/2 — chính xác từ hai lần chạy mạch.' },
  { id: 'q3', question: '"Barren plateau" (cao nguyên cằn) là hiện tượng?', options: ['Mạch chạy quá nhanh', 'Gradient triệt tiêu gần như khắp nơi làm huấn luyện đứng yên', 'Quá nhiều dữ liệu', 'Rối lượng tử biến mất'], correctIndex: 1, explanation: 'Gradient gần 0 ở hầu hết không gian tham số khiến tối ưu không tiến được.' },
]);

const c6 = doc('qtm321-6-1-qnn-kernels', '6.1 — Quantum neural networks & quantum kernels|||6.1 — Mạng nơ-ron & kernel lượng tử',
  'QNN như PQC làm bộ phân loại; hai lối tiếp cận: mô hình biến phân (huấn luyện theta) vs phương pháp kernel lượng tử (đo độ trùng trạng thái làm kernel cho SVM); khi nào dùng cái nào.',
  [[
    `<span class="eyebrow">QTM321 · Chapter 6 · Lesson 6.1</span>
<h2>Quantum neural networks &amp; quantum kernels</h2>
<h3>Quantum neural networks (QNN)</h3>
<p>A <strong>QNN</strong> is a variational circuit used as a classifier or regressor: encode the input, apply trainable layers, measure an expectation value as the output. Training is the hybrid loop from Chapter 5.</p>
<h3>Two ways to use a quantum feature map</h3>
<ul>
<li><strong>Variational (explicit) model</strong> — put trainable gates <em>inside</em> the circuit and learn "theta" directly.</li>
<li><strong>Quantum kernel (implicit) model</strong> — do <em>not</em> train the circuit; instead use it only to map data into quantum states, and measure how much two states overlap. That overlap is a <strong>kernel</strong> fed to a classical SVM.</li>
</ul>
<pre><code>Quantum kernel entry:
  K(x, x') = | overlap of encoded states |^2
           = | bra(phi(x)) ket(phi(x')) |^2
  # measured on hardware, then handed to a classical SVM
</code></pre>
<h3>Which to choose?</h3>
<p>Kernel methods have a clean theory and a convex classical optimizer, but the kernel matrix costs many circuit evaluations. Variational QNNs scale better to large datasets but can hit barren plateaus. They are two faces of the same quantum feature map.</p>
<div class="callout"><span class="badge">Same map, two models</span> Encode once; you can either train gates on top (QNN) or compare state overlaps (kernel). Understanding both is the core of QML modeling.</div>`,
    `<span class="eyebrow">QTM321 · Chương 6 · Bài 6.1</span>
<h2>Mạng nơ-ron &amp; kernel lượng tử</h2>
<h3>Mạng nơ-ron lượng tử (QNN)</h3>
<p>Một <strong>QNN</strong> là mạch biến phân dùng làm bộ phân loại hoặc hồi quy: mã hoá đầu vào, áp các lớp huấn luyện được, đo một giá trị kỳ vọng làm đầu ra. Huấn luyện chính là vòng lặp lai ở Chương 5.</p>
<h3>Hai cách dùng feature map lượng tử</h3>
<ul>
<li><strong>Mô hình biến phân (tường minh)</strong> — đặt cổng huấn luyện <em>bên trong</em> mạch và học trực tiếp "theta".</li>
<li><strong>Mô hình kernel lượng tử (ngầm)</strong> — <em>không</em> huấn luyện mạch; chỉ dùng nó để ánh xạ dữ liệu vào trạng thái lượng tử, rồi đo độ trùng của hai trạng thái. Độ trùng đó là <strong>kernel</strong> đưa vào SVM cổ điển.</li>
</ul>
<pre><code>Phan tu kernel luong tu:
  K(x, x') = | do trung cua hai trang thai ma hoa |^2
           = | bra(phi(x)) ket(phi(x')) |^2
  # do tren phan cung, roi dua cho SVM co dien
</code></pre>
<h3>Chọn cái nào?</h3>
<p>Phương pháp kernel có lý thuyết gọn và bộ tối ưu cổ điển lồi, nhưng ma trận kernel tốn nhiều lần chạy mạch. QNN biến phân co giãn tốt hơn với dữ liệu lớn nhưng có thể gặp barren plateau. Chúng là hai mặt của cùng một feature map lượng tử.</p>
<div class="callout"><span class="badge">Cùng map, hai mô hình</span> Mã hoá một lần; bạn có thể huấn luyện cổng bên trên (QNN) hoặc so độ trùng trạng thái (kernel). Hiểu cả hai là cốt lõi mô hình hoá QML.</div>`,
  ]]);

const c6q = quiz('qtm321-quiz-6', 'Quiz 6 — QNN & kernels|||Quiz 6 — QNN & kernel', [
  { id: 'q1', question: 'Mạng nơ-ron lượng tử (QNN) về bản chất là?', options: ['Một mạch cố định không tham số', 'Một mạch biến phân dùng làm bộ phân loại/hồi quy', 'Một thuật toán cổ điển thuần', 'Một phép đo đơn'], correctIndex: 1, explanation: 'QNN là PQC huấn luyện được: mã hoá → lớp biến phân → đo làm đầu ra.' },
  { id: 'q2', question: 'Trong phương pháp kernel lượng tử, mạch lượng tử dùng để?', options: ['Học tham số theta trực tiếp', 'Ánh xạ dữ liệu vào trạng thái và đo độ trùng làm kernel cho SVM', 'Thay thế hoàn toàn SVM', 'Tạo dữ liệu ngẫu nhiên'], correctIndex: 1, explanation: 'Kernel = |độ trùng hai trạng thái mã hoá|^2, đưa vào SVM cổ điển.' },
  { id: 'q3', question: 'Nhược điểm của phương pháp kernel lượng tử là?', options: ['Không có lý thuyết', 'Ma trận kernel tốn rất nhiều lần chạy mạch', 'Luôn gặp barren plateau', 'Không dùng được SVM'], correctIndex: 1, explanation: 'Tính đủ ma trận kernel cần nhiều lần đánh giá mạch — tốn kém.' },
]);

const c7 = doc('qtm321-7-1-algorithms', '7.1 — QML algorithms: VQE, QAOA, quantum SVM|||7.1 — Thuật toán QML: VQE, QAOA, quantum SVM',
  'VQE (tìm năng lượng đáy — biến phân), QAOA (tối ưu tổ hợp), quantum SVM (kernel lượng tử); đều là thuật toán lai lượng tử-cổ điển hợp NISQ; ví dụ khung VQE.',
  [[
    `<span class="eyebrow">QTM321 · Chapter 7 · Lesson 7.1</span>
<h2>QML algorithms: VQE, QAOA, quantum SVM</h2>
<p>The flagship near-term algorithms are all <strong>hybrid</strong>: a quantum circuit proposes a state, a classical optimizer tunes its parameters. They fit NISQ hardware because circuits stay shallow.</p>
<h3>VQE — Variational Quantum Eigensolver</h3>
<p>Finds the lowest energy (ground state) of a system by minimizing an expectation value over an ansatz. Used in quantum chemistry and materials.</p>
<pre><code>VQE loop:
  prepare state(theta) with an ansatz
  measure energy = expectation of H
  classical optimizer: adjust theta to lower energy
  repeat until energy stops dropping
</code></pre>
<h3>QAOA — Quantum Approximate Optimization Algorithm</h3>
<p>Tackles <strong>combinatorial optimization</strong> (e.g. Max-Cut). It alternates a problem layer and a mixing layer, each with an angle, and tunes those angles classically.</p>
<h3>Quantum SVM</h3>
<p>A classical <strong>support vector machine</strong> using a <strong>quantum kernel</strong> (Chapter 6) — the quantum device only computes the kernel entries; the SVM training stays classical and convex.</p>
<div class="callout"><span class="badge">Common shape</span> Quantum proposes, classical optimizes. Recognizing this pattern lets you read almost any near-term QML algorithm.</div>`,
    `<span class="eyebrow">QTM321 · Chương 7 · Bài 7.1</span>
<h2>Thuật toán QML: VQE, QAOA, quantum SVM</h2>
<p>Các thuật toán ngắn hạn tiêu biểu đều <strong>lai</strong>: mạch lượng tử đề xuất một trạng thái, bộ tối ưu cổ điển chỉnh tham số. Chúng hợp phần cứng NISQ vì mạch giữ nông.</p>
<h3>VQE — Variational Quantum Eigensolver</h3>
<p>Tìm năng lượng thấp nhất (trạng thái đáy) của một hệ bằng cách tối thiểu hoá giá trị kỳ vọng trên một ansatz. Dùng trong hoá lượng tử và vật liệu.</p>
<pre><code>Vong VQE:
  chuan bi state(theta) bang mot ansatz
  do nang luong = ky vong cua H
  bo toi uu co dien: chinh theta de ha nang luong
  lap den khi nang luong khong giam nua
</code></pre>
<h3>QAOA — Quantum Approximate Optimization Algorithm</h3>
<p>Giải <strong>tối ưu tổ hợp</strong> (vd Max-Cut). Nó xen kẽ một lớp bài toán và một lớp trộn, mỗi lớp một góc, rồi chỉnh các góc đó bằng phương pháp cổ điển.</p>
<h3>Quantum SVM</h3>
<p>Một <strong>máy vector hỗ trợ</strong> cổ điển dùng <strong>kernel lượng tử</strong> (Chương 6) — thiết bị lượng tử chỉ tính các phần tử kernel; huấn luyện SVM vẫn cổ điển và lồi.</p>
<div class="callout"><span class="badge">Hình dạng chung</span> Lượng tử đề xuất, cổ điển tối ưu. Nhận ra khuôn này giúp bạn đọc được gần như mọi thuật toán QML ngắn hạn.</div>`,
  ]]);

const c7q = quiz('qtm321-quiz-7', 'Quiz 7 — Algorithms|||Quiz 7 — Thuật toán', [
  { id: 'q1', question: 'VQE (Variational Quantum Eigensolver) dùng để?', options: ['Phân loại ảnh', 'Tìm năng lượng thấp nhất (trạng thái đáy) của một hệ', 'Sinh số ngẫu nhiên', 'Nén dữ liệu'], correctIndex: 1, explanation: 'VQE tối thiểu hoá kỳ vọng năng lượng để tìm trạng thái đáy — hoá lượng tử.' },
  { id: 'q2', question: 'QAOA phù hợp nhất với loại bài toán nào?', options: ['Hồi quy tuyến tính', 'Tối ưu tổ hợp (vd Max-Cut)', 'Sắp xếp mảng', 'Nhân ma trận'], correctIndex: 1, explanation: 'QAOA xen kẽ lớp bài toán và lớp trộn để giải tối ưu tổ hợp.' },
  { id: 'q3', question: 'Điểm chung của VQE, QAOA và quantum SVM là gì?', options: ['Chạy hoàn toàn trên phần cứng lượng tử không cần cổ điển', 'Đều là thuật toán lai: lượng tử đề xuất, cổ điển tối ưu', 'Đều cần máy tính lượng tử hoàn hảo không nhiễu', 'Đều không có tham số'], correctIndex: 1, explanation: 'Cả ba đều lai lượng tử-cổ điển, hợp phần cứng NISQ vì mạch nông.' },
]);

const c8 = doc('qtm321-8-1-tools-nisq', '8.1 — Tools (Qiskit/PennyLane), NISQ & real-world use|||8.1 — Công cụ (Qiskit/PennyLane), NISQ & ứng dụng',
  'Qiskit vs PennyLane; kỷ nguyên NISQ (ít qubit, nhiễu, chưa sửa lỗi); thách thức (barren plateau, số lần đo, đọc dữ liệu ra/vào); ứng dụng thực tế & tinh thần phê phán; ví dụ QNode PennyLane.',
  [[
    `<span class="eyebrow">QTM321 · Chapter 8 · Lesson 8.1</span>
<h2>Tools, NISQ &amp; real-world use</h2>
<h3>The two main frameworks</h3>
<ul>
<li><strong>Qiskit</strong> (IBM) — circuit-centric; strong access to real IBM Quantum hardware.</li>
<li><strong>PennyLane</strong> (Xanadu) — differentiable; integrates with PyTorch/TensorFlow, ideal for training QML models.</li>
</ul>
<pre><code># PennyLane: a tiny trainable QNode
import pennylane as qml

dev = qml.device("default.qubit", wires=1)

@qml.qnode(dev)
def model(x, theta):
    qml.RY(x, wires=0)        # encode input
    qml.RY(theta, wires=0)    # trainable rotation
    return qml.expval(qml.PauliZ(0))   # measured output
</code></pre>
<h3>The NISQ era</h3>
<p>Today we have <strong>NISQ</strong> devices — Noisy Intermediate-Scale Quantum: few qubits, real noise, and <em>no</em> error correction yet. Circuits must be shallow, and every run is repeated many times ("shots") to estimate expectation values.</p>
<h3>Open challenges</h3>
<ul>
<li><strong>Noise &amp; decoherence</strong> — limits circuit depth and accuracy.</li>
<li><strong>Barren plateaus</strong> — training can stall (Chapter 5).</li>
<li><strong>Data in/out bottleneck</strong> — loading big classical data and reading results can erase any speedup.</li>
</ul>
<div class="callout"><span class="badge">Stay critical</span> QML has real promise in chemistry, optimization and kernels, but proven advantage on practical ML tasks is still open. Measure claims against noise, shots and encoding cost.</div>`,
    `<span class="eyebrow">QTM321 · Chương 8 · Bài 8.1</span>
<h2>Công cụ, NISQ &amp; ứng dụng thực tế</h2>
<h3>Hai framework chính</h3>
<ul>
<li><strong>Qiskit</strong> (IBM) — xoay quanh mạch; truy cập tốt phần cứng IBM Quantum thật.</li>
<li><strong>PennyLane</strong> (Xanadu) — khả vi; tích hợp PyTorch/TensorFlow, lý tưởng để huấn luyện mô hình QML.</li>
</ul>
<pre><code># PennyLane: mot QNode nho huan luyen duoc
import pennylane as qml

dev = qml.device("default.qubit", wires=1)

@qml.qnode(dev)
def model(x, theta):
    qml.RY(x, wires=0)        # ma hoa dau vao
    qml.RY(theta, wires=0)    # phep xoay huan luyen
    return qml.expval(qml.PauliZ(0))   # dau ra do duoc
</code></pre>
<h3>Kỷ nguyên NISQ</h3>
<p>Hiện nay ta có thiết bị <strong>NISQ</strong> — Noisy Intermediate-Scale Quantum: ít qubit, nhiễu thật, và <em>chưa</em> sửa lỗi. Mạch phải nông, và mỗi lần chạy được lặp nhiều lần ("shots") để ước lượng giá trị kỳ vọng.</p>
<h3>Thách thức còn bỏ ngỏ</h3>
<ul>
<li><strong>Nhiễu &amp; mất kết hợp</strong> — giới hạn độ sâu mạch và độ chính xác.</li>
<li><strong>Barren plateau</strong> — huấn luyện có thể đứng yên (Chương 5).</li>
<li><strong>Nghẽn đọc dữ liệu vào/ra</strong> — nạp dữ liệu cổ điển lớn và đọc kết quả có thể xoá sạch mọi lợi thế tốc độ.</li>
</ul>
<div class="callout"><span class="badge">Giữ tinh thần phê phán</span> QML hứa hẹn thật trong hoá học, tối ưu và kernel, nhưng lợi thế đã chứng minh trên bài toán ML thực tế vẫn bỏ ngỏ. Hãy soi mọi tuyên bố qua nhiễu, số shots và chi phí mã hoá.</div>`,
  ]]);

const c8q = quiz('qtm321-quiz-8', 'Quiz 8 — Tools & NISQ|||Quiz 8 — Công cụ & NISQ', [
  { id: 'q1', question: 'NISQ là viết tắt của?', options: ['New Integrated Standard Qubits', 'Noisy Intermediate-Scale Quantum', 'Non-Interacting Static Qubits', 'Networked Ideal Scalable Quantum'], correctIndex: 1, explanation: 'NISQ = Noisy Intermediate-Scale Quantum: ít qubit, nhiễu, chưa sửa lỗi.' },
  { id: 'q2', question: 'Vì sao mỗi mạch được chạy lặp nhiều lần ("shots")?', options: ['Để tiết kiệm qubit', 'Để ước lượng giá trị kỳ vọng từ các kết quả đo ngẫu nhiên', 'Để tăng số tham số', 'Vì phần cứng yêu cầu chạy chẵn lần'], correctIndex: 1, explanation: 'Đo cho kết quả ngẫu nhiên; lặp nhiều shots để ước lượng kỳ vọng.' },
  { id: 'q3', question: 'Vì sao "nghẽn đọc dữ liệu vào/ra" là thách thức lớn của QML?', options: ['Vì làm mất rối lượng tử', 'Vì nạp dữ liệu cổ điển lớn và đọc kết quả có thể xoá sạch lợi thế tốc độ', 'Vì tăng barren plateau', 'Vì cần thêm qubit điều khiển'], correctIndex: 1, explanation: 'Chi phí đưa dữ liệu vào và lấy kết quả ra có thể lấn át mọi tăng tốc.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'QTM321',
    slug: 'qtm321-quantum-machine-learning',
    title: 'Quantum Machine Learning',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/QTM321.webp',
    shortDescription: 'Quantum machine learning from scratch — qubits, superposition & entanglement, quantum gates & circuits, data encoding, variational circuits, quantum neural nets & kernels, VQE/QAOA/quantum SVM, Qiskit/PennyLane on NISQ.|||Học máy lượng tử từ gốc — qubit, chồng chập & rối, cổng & mạch lượng tử, mã hoá dữ liệu, mạch biến phân, mạng nơ-ron & kernel lượng tử, VQE/QAOA/quantum SVM, Qiskit/PennyLane trên NISQ.',
    description: 'Môn <strong>QTM321 — Quantum Machine Learning</strong> (kỳ 4, ngành Khoa học Máy tính) dạy nơi <strong>tính toán lượng tử</strong> gặp <strong>học máy</strong>. Từ <strong>nền tảng</strong> (qubit, chồng chập, rối) → <strong>cổng &amp; mạch lượng tử</strong> → <strong>ôn ML cổ điển</strong> → <strong>mã hoá dữ liệu</strong> → <strong>mạch biến phân</strong> → <strong>mạng nơ-ron &amp; kernel lượng tử</strong> → <strong>thuật toán</strong> (VQE, QAOA, quantum SVM) → <strong>công cụ (Qiskit/PennyLane), NISQ &amp; ứng dụng</strong>. Bám giáo trình chuẩn (Nielsen &amp; Chuang; Schuld &amp; Petruccione; Qiskit Textbook; PennyLane), song ngữ, có ví dụ mạch và quiz mỗi chương.',
    whatYouLearn: 'Qubit, chồng chập & rối, ký hiệu ket/bra; cổng X/H/Rx/Ry/Rz & CNOT, mạch unitary; vòng huấn luyện ML (loss, gradient descent); mã hoá dữ liệu (basis/amplitude/angle); mạch biến phân & parameter-shift rule, barren plateau; mạng nơ-ron & kernel lượng tử (SVM); VQE, QAOA, quantum SVM; Qiskit vs PennyLane, NISQ & thách thức thực tế.',
    requirements: 'Đại số tuyến tính cơ bản (vector, số phức), lập trình Python, và kiến thức ML nhập môn. Xem điều kiện tiên quyết ngành Khoa học Máy tính trên FLM (flm.fpt.edu.vn).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình chuẩn, Qiskit Textbook, PennyLane demos, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'QML là gì, vì sao ghép lượng tử với ML, lộ trình.', lessons: [intro] },
    { title: 'Chương 1 — Nền tảng lượng tử|||Chapter 1 — Quantum foundations', description: 'Qubit, chồng chập, rối, ket/bra.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Cổng & mạch|||Chapter 2 — Gates & circuits', description: 'X/H/Rx-Ry-Rz, CNOT, unitary, Bell.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Ôn ML cổ điển|||Chapter 3 — Classical ML recap', description: 'Loss, gradient descent, động lực QML.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Mã hoá dữ liệu|||Chapter 4 — Data encoding', description: 'Basis/amplitude/angle encoding, feature map.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Mạch biến phân|||Chapter 5 — Variational circuits', description: 'PQC/ansatz, parameter-shift, barren plateau.', lessons: [c5, c5q] },
    { title: 'Chương 6 — QNN & kernel|||Chapter 6 — QNN & kernels', description: 'Mô hình biến phân vs kernel lượng tử (SVM).', lessons: [c6, c6q] },
    { title: 'Chương 7 — Thuật toán QML|||Chapter 7 — QML algorithms', description: 'VQE, QAOA, quantum SVM (lai).', lessons: [c7, c7q] },
    { title: 'Chương 8 — Công cụ & NISQ|||Chapter 8 — Tools & NISQ', description: 'Qiskit/PennyLane, NISQ, thách thức, ứng dụng.', lessons: [c8, c8q] },
  ],
};
