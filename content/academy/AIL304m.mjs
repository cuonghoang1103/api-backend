/**
 * AIL304m — Machine Learning (hướng Deep Learning, kiểu Andrew Ng).
 * Khung bài theo giáo trình FLM (Syllabus ID 12035): 4 module + đánh giá.
 * Không có slide gốc → soạn từ syllabus (Math for ML → Neural Networks →
 * Improving/optimizing DNN + TensorFlow → ML Strategy) + kiến thức, song ngữ,
 * có công thức, code Python/NumPy/TensorFlow & BÀI TẬP. Giữ NGUYÊN slug.
 * ⚠️ code mẫu: KHÔNG dùng backtick hay ${ } (vỡ template literal .mjs).
 */

const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({
  title, slug, type: 'DOCUMENT', description: desc,
  content: pairs.map(([en, vi]) => bi(en, vi)).join('\n'),
});
const quiz = (slug, title, questions) => ({
  title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức module.',
  quiz: { timeLimitSeconds: 480, questions },
});

const intro = doc('ail304m-0-1-overview', 'Course overview: Machine Learning|||Tổng quan môn: Machine Learning',
  'Mục tiêu, 5 CLO (toán nền ML; xây/huấn luyện DNN; train/test & bias-variance & tối ưu & TensorFlow; ML strategy & transfer/multi-task; đồ án TensorFlow), 4 module, và bảng đánh giá.',
  [[
    `<span class="eyebrow">AIL304m · Lesson 0.1 · Overview</span>
<h2>Machine Learning</h2>
<p class="lead">This is a <strong>deep-learning-focused</strong> ML course. You'll build from the <strong>math foundations</strong> (linear algebra + calculus + gradient descent) up through <strong>neural networks</strong>, techniques to <strong>improve &amp; optimize</strong> them (train/dev/test splits, bias/variance, optimization algorithms, <strong>TensorFlow</strong>), and finally <strong>ML strategy</strong> (error analysis, transfer &amp; multi-task learning) — ending in a practical TensorFlow project.</p>
<h3>CLOs</h3>
<ul>
<li><strong>CLO1</strong> — the math that makes ML algorithms work</li>
<li><strong>CLO2</strong> — build, train &amp; apply fully-connected deep neural networks</li>
<li><strong>CLO3</strong> — train/dev/test sets, bias/variance, optimization, TensorFlow</li>
<li><strong>CLO4</strong> — diagnose errors, prioritize fixes; end-to-end, transfer &amp; multi-task learning</li>
<li><strong>CLO5</strong> — a practical project with TensorFlow</li>
</ul>
<h3>What is machine learning?</h3>
<p>Instead of hand-coding rules, ML <strong>learns a function from data</strong>. <em>Supervised</em> learning maps inputs X to labels y (regression = continuous y, classification = discrete y); <em>unsupervised</em> finds structure without labels (clustering, dimensionality reduction). Deep learning uses multi-layer <strong>neural networks</strong> that learn features automatically.</p>`,
    `<span class="eyebrow">AIL304m · Bài 0.1 · Tổng quan</span>
<h2>Học máy (Machine Learning)</h2>
<p class="lead">Đây là môn ML <strong>hướng deep learning</strong>. Bạn xây từ <strong>nền toán</strong> (đại số tuyến tính + giải tích + gradient descent) lên <strong>mạng nơ-ron</strong>, các kỹ thuật <strong>cải thiện &amp; tối ưu</strong> chúng (chia train/dev/test, bias/variance, thuật toán tối ưu, <strong>TensorFlow</strong>), và cuối cùng <strong>ML strategy</strong> (phân tích lỗi, transfer &amp; multi-task learning) — kết bằng một đồ án TensorFlow.</p>
<h3>CLO</h3>
<ul>
<li><strong>CLO1</strong> — toán làm cho thuật toán ML hoạt động</li>
<li><strong>CLO2</strong> — xây, huấn luyện &amp; áp dụng mạng nơ-ron sâu fully-connected</li>
<li><strong>CLO3</strong> — tập train/dev/test, bias/variance, tối ưu, TensorFlow</li>
<li><strong>CLO4</strong> — chẩn lỗi, ưu tiên sửa; end-to-end, transfer &amp; multi-task learning</li>
<li><strong>CLO5</strong> — một đồ án thực hành với TensorFlow</li>
</ul>
<h3>Machine learning là gì?</h3>
<p>Thay vì viết luật bằng tay, ML <strong>học một hàm từ dữ liệu</strong>. Học <em>có giám sát</em> ánh xạ đầu vào X sang nhãn y (regression = y liên tục, classification = y rời rạc); <em>không giám sát</em> tìm cấu trúc không cần nhãn (clustering, giảm chiều). Deep learning dùng <strong>mạng nơ-ron</strong> nhiều tầng tự học đặc trưng.</p>`,
  ]]);

/* Module 1: Math for ML */
const m1a = doc('ail304m-1-1-linear-algebra', 'M1.1 — Linear algebra for ML|||M1.1 — Đại số tuyến tính cho ML',
  'Vector & ma trận, phép nhân ma trận, hệ phương trình tuyến tính, biến đổi tuyến tính, định thức & eigenvector; biểu diễn dữ liệu ML dưới dạng ma trận (X).',
  [[
    `<span class="eyebrow">AIL304m · Module 1 · Lesson 1.1</span>
<h2>Linear algebra for ML</h2>
<p class="lead">ML data is <strong>vectors and matrices</strong>. A dataset of m examples with n features is a matrix <code>X</code> of shape (m, n); a linear model computes <code>ŷ = Xw + b</code>. Fluency with matrices is the language of ML.</p>
<h3>Core objects</h3>
<ul>
<li><strong>Vector</strong> — one example's features, e.g. x = [1.2, 0.5, 3.0].</li>
<li><strong>Matrix</strong> — a stack of vectors; the dataset X, or a layer's weights W.</li>
<li><strong>Matrix multiply</strong> — (m,n)·(n,k) → (m,k); the inner dimensions must match. This is the single most common operation in a neural network.</li>
</ul>
<pre><code class="language-python">import numpy as np
X = np.array([[1.2, 0.5], [0.3, 2.1], [1.0, 1.0]])  # (3, 2): 3 examples, 2 features
w = np.array([0.4, -0.7])                            # (2,)
b = 0.1
y_hat = X @ w + b        # (3,) predictions — one matrix multiply
print(y_hat)
</code></pre>
<p><strong>Determinants &amp; eigenvectors</strong> tell you about a transformation: a zero determinant means the matrix squashes space (not invertible); <strong>eigenvectors</strong> are directions a matrix only stretches (used in PCA/dimensionality reduction). <strong>Solving linear systems</strong> (Ax = b) underlies closed-form linear regression.</p>`,
    `<span class="eyebrow">AIL304m · Module 1 · Bài 1.1</span>
<h2>Đại số tuyến tính cho ML</h2>
<p class="lead">Dữ liệu ML là <strong>vector và ma trận</strong>. Một tập m ví dụ với n đặc trưng là ma trận <code>X</code> cỡ (m, n); mô hình tuyến tính tính <code>ŷ = Xw + b</code>. Thành thạo ma trận là ngôn ngữ của ML.</p>
<h3>Đối tượng cốt lõi</h3>
<ul>
<li><strong>Vector</strong> — đặc trưng của một ví dụ, vd x = [1.2, 0.5, 3.0].</li>
<li><strong>Ma trận</strong> — chồng các vector; tập X, hay trọng số W của một tầng.</li>
<li><strong>Nhân ma trận</strong> — (m,n)·(n,k) → (m,k); chiều trong phải khớp. Đây là phép phổ biến nhất trong một mạng nơ-ron.</li>
</ul>
<pre><code class="language-python">import numpy as np
X = np.array([[1.2, 0.5], [0.3, 2.1], [1.0, 1.0]])  # (3, 2): 3 ví dụ, 2 đặc trưng
w = np.array([0.4, -0.7])                            # (2,)
b = 0.1
y_hat = X @ w + b        # (3,) dự đoán — một phép nhân ma trận
print(y_hat)
</code></pre>
<p><strong>Định thức &amp; eigenvector</strong> nói về một phép biến đổi: định thức bằng 0 nghĩa ma trận ép không gian (không khả nghịch); <strong>eigenvector</strong> là hướng mà ma trận chỉ kéo giãn (dùng trong PCA/giảm chiều). <strong>Giải hệ tuyến tính</strong> (Ax = b) là nền cho linear regression dạng đóng.</p>`,
  ]]);

const m1b = doc('ail304m-1-2-gradient-descent', 'M1.2 — Calculus, gradients & gradient descent|||M1.2 — Giải tích, gradient & gradient descent',
  'Đạo hàm & tối ưu, hàm nhiều biến & gradient, thuật toán gradient descent (learning rate), và cách nó huấn luyện mô hình bằng cách giảm hàm mất mát.',
  [[
    `<span class="eyebrow">AIL304m · Module 1 · Lesson 1.2</span>
<h2>Calculus, gradients &amp; gradient descent</h2>
<p class="lead">Training = <strong>minimizing a loss function</strong>. The <strong>gradient</strong> (vector of partial derivatives) points uphill; <strong>gradient descent</strong> repeatedly steps in the opposite direction to reduce loss.</p>
<h3>The algorithm</h3>
<p>For parameters θ and loss J(θ), with learning rate α:</p>
<pre><code class="language-text">repeat:
    θ := θ − α · ∇J(θ)      # step downhill
until converged
</code></pre>
<pre><code class="language-python"># Linear regression by gradient descent (MSE loss)
import numpy as np
def train(X, y, alpha=0.01, epochs=1000):
    m, n = X.shape
    w = np.zeros(n); b = 0.0
    for _ in range(epochs):
        y_hat = X @ w + b
        err = y_hat - y                     # (m,)
        grad_w = (X.T @ err) / m            # ∂J/∂w
        grad_b = err.mean()                 # ∂J/∂b
        w -= alpha * grad_w                 # step
        b -= alpha * grad_b
    return w, b
</code></pre>
<p>The <strong>learning rate α</strong> is critical: too big overshoots (diverges), too small crawls. This exact loop — forward pass, compute loss, compute gradients, update — is how <em>every</em> neural network trains.</p>`,
    `<span class="eyebrow">AIL304m · Module 1 · Bài 1.2</span>
<h2>Giải tích, gradient &amp; gradient descent</h2>
<p class="lead">Huấn luyện = <strong>tối thiểu hoá hàm mất mát</strong>. <strong>Gradient</strong> (vector các đạo hàm riêng) chỉ hướng lên dốc; <strong>gradient descent</strong> lặp lại bước theo hướng ngược để giảm loss.</p>
<h3>Thuật toán</h3>
<p>Với tham số θ và loss J(θ), learning rate α:</p>
<pre><code class="language-text">lặp:
    θ := θ − α · ∇J(θ)      # bước xuống dốc
đến khi hội tụ
</code></pre>
<pre><code class="language-python"># Linear regression bằng gradient descent (loss MSE)
import numpy as np
def train(X, y, alpha=0.01, epochs=1000):
    m, n = X.shape
    w = np.zeros(n); b = 0.0
    for _ in range(epochs):
        y_hat = X @ w + b
        err = y_hat - y                     # (m,)
        grad_w = (X.T @ err) / m            # ∂J/∂w
        grad_b = err.mean()                 # ∂J/∂b
        w -= alpha * grad_w                 # bước
        b -= alpha * grad_b
    return w, b
</code></pre>
<p><strong>Learning rate α</strong> then chốt: quá lớn thì vọt qua (phân kỳ), quá nhỏ thì bò chậm. Đúng vòng lặp này — forward, tính loss, tính gradient, cập nhật — là cách <em>mọi</em> mạng nơ-ron huấn luyện.</p>`,
  ]]);

const m1e = doc('ail304m-1-3-exercise', 'Exercise 1 — a single perceptron|||Bài tập 1 — perceptron đơn',
  'Bài tập: hiện thực một perceptron (linear unit) cho hồi quy, huấn luyện bằng gradient descent trên dữ liệu nhỏ; kèm lời giải.',
  [[
    `<span class="eyebrow">AIL304m · Module 1 · Exercise</span>
<h2>Exercise 1 — a single perceptron for linear regression</h2>
<div class="callout"><span class="badge">Đề</span> Fit y = 2x + 1 from noisy samples using one linear unit (perceptron) trained by gradient descent. Report the learned w and b.</div>
<h3>Worked solution</h3>
<pre><code class="language-python">import numpy as np
rng = np.random.default_rng(0)
x = np.linspace(0, 10, 100)
y = 2 * x + 1 + rng.normal(0, 0.5, size=x.shape)   # noisy line
X = x.reshape(-1, 1)                                # (100, 1)

w = np.zeros(1); b = 0.0; alpha = 0.01
for _ in range(2000):
    y_hat = X @ w + b
    err = y_hat - y
    w -= alpha * (X.T @ err) / len(y)
    b -= alpha * err.mean()

print(f"w={w[0]:.3f}  b={b:.3f}")   # ≈ w=2.00  b=1.00
</code></pre>
<p><strong>Why:</strong> a single perceptron computes <code>w·x + b</code> — a linear model. Gradient descent drives w toward the true slope 2 and b toward the true intercept 1. Stack many such units with a nonlinearity between them and you get a neural network (Module 2).</p>`,
    `<span class="eyebrow">AIL304m · Module 1 · Bài tập</span>
<h2>Bài tập 1 — perceptron đơn cho hồi quy tuyến tính</h2>
<div class="callout"><span class="badge">Đề</span> Khớp y = 2x + 1 từ mẫu nhiễu bằng một linear unit (perceptron) huấn luyện bằng gradient descent. Báo w và b học được.</div>
<h3>Lời giải</h3>
<pre><code class="language-python">import numpy as np
rng = np.random.default_rng(0)
x = np.linspace(0, 10, 100)
y = 2 * x + 1 + rng.normal(0, 0.5, size=x.shape)   # đường có nhiễu
X = x.reshape(-1, 1)                                # (100, 1)

w = np.zeros(1); b = 0.0; alpha = 0.01
for _ in range(2000):
    y_hat = X @ w + b
    err = y_hat - y
    w -= alpha * (X.T @ err) / len(y)
    b -= alpha * err.mean()

print(f"w={w[0]:.3f}  b={b:.3f}")   # ≈ w=2.00  b=1.00
</code></pre>
<p><strong>Vì sao:</strong> một perceptron tính <code>w·x + b</code> — mô hình tuyến tính. Gradient descent kéo w về độ dốc thật 2 và b về hệ số chặn thật 1. Xếp nhiều unit như vậy kèm phi tuyến ở giữa là được mạng nơ-ron (Module 2).</p>`,
  ]]);

const m1q = quiz('ail304m-quiz-1', 'Quiz M1 — Math for ML|||Quiz M1 — Toán cho ML', [
  { id: 'q1', question: 'Nhân ma trận (m,n)·(n,k) cho ma trận cỡ?', options: ['(m,k)', '(n,n)', '(m,n)', 'lỗi'], correctIndex: 0, explanation: 'Chiều trong (n) khớp, kết quả (m,k).' },
  { id: 'q2', question: 'Gradient descent cập nhật tham số theo hướng nào?', options: ['Cùng hướng gradient', 'Ngược hướng gradient (xuống dốc)', 'Ngẫu nhiên', 'Không đổi'], correctIndex: 1, explanation: 'θ := θ − α·∇J: đi ngược gradient để giảm loss.' },
  { id: 'q3', question: 'Learning rate quá LỚN gây?', options: ['Hội tụ nhanh chắc chắn', 'Vọt qua/phân kỳ', 'Không ảnh hưởng', 'Overfit'], correctIndex: 1, explanation: 'α quá lớn làm bước vọt qua cực tiểu → dao động/phân kỳ.' },
]);

/* Module 2: Neural Networks */
const m2 = doc('ail304m-2-1-neural-networks', 'M2.1 — Fully-connected neural networks|||M2.1 — Mạng nơ-ron fully-connected',
  'Nơ-ron & hàm kích hoạt (ReLU/sigmoid), tầng ẩn, forward propagation, hàm loss (cross-entropy), backpropagation (ý tưởng), và vì sao phi tuyến quan trọng.',
  [[
    `<span class="eyebrow">AIL304m · Module 2 · Lesson 2.1</span>
<h2>Fully-connected neural networks</h2>
<p class="lead">A neural network stacks layers of neurons. Each layer computes <code>z = Wa + b</code> then applies a nonlinear <strong>activation</strong> <code>a = g(z)</code>. Without the nonlinearity, stacked linear layers collapse into one linear model — the activation is what lets networks learn complex functions.</p>
<h3>Forward propagation (one hidden layer)</h3>
<pre><code class="language-python">import numpy as np
def relu(z): return np.maximum(0, z)
def sigmoid(z): return 1 / (1 + np.exp(-z))

def forward(X, W1, b1, W2, b2):
    Z1 = X @ W1 + b1;  A1 = relu(Z1)      # hidden layer
    Z2 = A1 @ W2 + b2; A2 = sigmoid(Z2)   # output (binary prob)
    return A2
</code></pre>
<h3>Loss &amp; backprop</h3>
<p>For binary classification the loss is <strong>binary cross-entropy</strong>; training minimizes it by gradient descent. <strong>Backpropagation</strong> computes the gradients efficiently by applying the chain rule backward through the layers — you rarely code it by hand (frameworks do), but understanding it explains vanishing gradients and why activation choice matters.</p>
<div class="callout"><span class="badge">★ Activation</span> <b>ReLU</b> (max(0,z)) là mặc định cho tầng ẩn — rẻ, giảm vanishing gradient. <b>Sigmoid</b>/<b>softmax</b> ở tầng ra cho xác suất (nhị phân/đa lớp).</div>`,
    `<span class="eyebrow">AIL304m · Module 2 · Bài 2.1</span>
<h2>Mạng nơ-ron fully-connected</h2>
<p class="lead">Mạng nơ-ron xếp chồng các tầng nơ-ron. Mỗi tầng tính <code>z = Wa + b</code> rồi áp một <strong>activation</strong> phi tuyến <code>a = g(z)</code>. Không có phi tuyến, các tầng tuyến tính chồng lên nhau gộp thành một mô hình tuyến tính — activation là thứ cho mạng học hàm phức tạp.</p>
<h3>Forward propagation (một tầng ẩn)</h3>
<pre><code class="language-python">import numpy as np
def relu(z): return np.maximum(0, z)
def sigmoid(z): return 1 / (1 + np.exp(-z))

def forward(X, W1, b1, W2, b2):
    Z1 = X @ W1 + b1;  A1 = relu(Z1)      # tầng ẩn
    Z2 = A1 @ W2 + b2; A2 = sigmoid(Z2)   # tầng ra (xác suất nhị phân)
    return A2
</code></pre>
<h3>Loss &amp; backprop</h3>
<p>Với phân loại nhị phân, loss là <strong>binary cross-entropy</strong>; huấn luyện tối thiểu hoá nó bằng gradient descent. <strong>Backpropagation</strong> tính gradient hiệu quả bằng cách áp quy tắc chuỗi ngược qua các tầng — bạn hiếm khi tự code (framework làm), nhưng hiểu nó giải thích vanishing gradient và vì sao chọn activation quan trọng.</p>
<div class="callout"><span class="badge">★ Activation</span> <b>ReLU</b> (max(0,z)) là mặc định cho tầng ẩn — rẻ, giảm vanishing gradient. <b>Sigmoid</b>/<b>softmax</b> ở tầng ra cho xác suất (nhị phân/đa lớp).</div>`,
  ]]);

const m2q = quiz('ail304m-quiz-2', 'Quiz M2 — Neural networks|||Quiz M2 — Mạng nơ-ron', [
  { id: 'q1', question: 'Vì sao cần hàm kích hoạt phi tuyến giữa các tầng?', options: ['Cho đẹp', 'Không có nó, các tầng tuyến tính gộp thành 1 mô hình tuyến tính', 'Để chạy nhanh', 'Bắt buộc bởi NumPy'], correctIndex: 1, explanation: 'Phi tuyến cho mạng biểu diễn hàm phức tạp; nếu không, chồng tuyến tính = tuyến tính.' },
  { id: 'q2', question: 'Activation mặc định cho tầng ẩn hiện nay?', options: ['sigmoid', 'ReLU', 'tanh luôn', 'linear'], correctIndex: 1, explanation: 'ReLU rẻ và giảm vanishing gradient, là mặc định phổ biến.' },
  { id: 'q3', question: 'Backpropagation dùng để?', options: ['Vẽ đồ thị', 'Tính gradient hiệu quả qua quy tắc chuỗi', 'Chia dữ liệu', 'Chuẩn hoá'], correctIndex: 1, explanation: 'Backprop lan gradient ngược qua mạng bằng chain rule.' },
]);

/* Module 3: Improving/optimizing DNNs + TensorFlow */
const m3a = doc('ail304m-3-1-bias-variance', 'M3.1 — Train/dev/test, bias & variance|||M3.1 — Train/dev/test, bias & variance',
  'Chia train/dev/test, overfitting vs underfitting, chẩn bias (underfit) vs variance (overfit) và cách sửa; regularization (L2, dropout) & early stopping.',
  [[
    `<span class="eyebrow">AIL304m · Module 3 · Lesson 3.1</span>
<h2>Train/dev/test, bias &amp; variance</h2>
<p class="lead">Split data into <strong>train</strong> (fit), <strong>dev/validation</strong> (tune), and <strong>test</strong> (final, untouched estimate). The core diagnostic is <strong>bias vs variance</strong>.</p>
<h3>Diagnosing</h3>
<table><thead><tr><th>Symptom</th><th>Diagnosis</th><th>Fix</th></tr></thead><tbody>
<tr><td>High train error</td><td>High <strong>bias</strong> (underfit)</td><td>bigger model, train longer, better features</td></tr>
<tr><td>Low train, high dev error</td><td>High <strong>variance</strong> (overfit)</td><td>more data, <strong>regularization</strong>, dropout, early stopping</td></tr>
</tbody></table>
<p><strong>Regularization</strong> penalizes large weights (L2 adds λ‖W‖² to the loss); <strong>dropout</strong> randomly zeroes activations during training so the network can't rely on any one unit; <strong>early stopping</strong> halts when dev error stops improving. Always look at train vs dev error <em>together</em> before deciding what to change.</p>`,
    `<span class="eyebrow">AIL304m · Module 3 · Bài 3.1</span>
<h2>Train/dev/test, bias &amp; variance</h2>
<p class="lead">Chia dữ liệu thành <strong>train</strong> (khớp), <strong>dev/validation</strong> (chỉnh), và <strong>test</strong> (ước lượng cuối, không đụng). Chẩn đoán cốt lõi là <strong>bias vs variance</strong>.</p>
<h3>Chẩn đoán</h3>
<table><thead><tr><th>Triệu chứng</th><th>Chẩn đoán</th><th>Cách sửa</th></tr></thead><tbody>
<tr><td>Lỗi train cao</td><td><strong>Bias</strong> cao (underfit)</td><td>mô hình lớn hơn, train lâu hơn, đặc trưng tốt hơn</td></tr>
<tr><td>Train thấp, dev cao</td><td><strong>Variance</strong> cao (overfit)</td><td>thêm dữ liệu, <strong>regularization</strong>, dropout, early stopping</td></tr>
</tbody></table>
<p><strong>Regularization</strong> phạt trọng số lớn (L2 thêm λ‖W‖² vào loss); <strong>dropout</strong> ngẫu nhiên tắt activation khi train để mạng không dựa vào một unit; <strong>early stopping</strong> dừng khi lỗi dev ngừng cải thiện. Luôn nhìn lỗi train vs dev <em>cùng nhau</em> trước khi quyết đổi gì.</p>`,
  ]]);

const m3b = doc('ail304m-3-2-tensorflow', 'M3.2 — Optimization & TensorFlow/Keras|||M3.2 — Tối ưu & TensorFlow/Keras',
  'Thuật toán tối ưu (SGD, momentum, Adam), mini-batch, normalization; và xây/huấn luyện một mạng bằng TensorFlow/Keras (Sequential, compile, fit).',
  [[
    `<span class="eyebrow">AIL304m · Module 3 · Lesson 3.2</span>
<h2>Optimization &amp; TensorFlow/Keras</h2>
<h3>Faster optimizers</h3>
<p>Plain gradient descent is slow. <strong>Mini-batch</strong> updates on small batches (not the whole set); <strong>momentum</strong> smooths steps; <strong>Adam</strong> adapts the learning rate per-parameter and is the common default. <strong>Input normalization</strong> (zero mean, unit variance) speeds convergence.</p>
<h3>A network in Keras</h3>
<pre><code class="language-python">import tensorflow as tf
from tensorflow import keras

model = keras.Sequential([
    keras.layers.Dense(64, activation="relu", input_shape=(n_features,)),
    keras.layers.Dropout(0.2),
    keras.layers.Dense(10, activation="softmax"),   # 10-class output
])
model.compile(optimizer="adam",
              loss="sparse_categorical_crossentropy",
              metrics=["accuracy"])
model.fit(X_train, y_train, epochs=20, batch_size=32,
          validation_data=(X_dev, y_dev))
test_loss, test_acc = model.evaluate(X_test, y_test)
</code></pre>
<p>Keras hides forward/backprop: <code>Dense</code> layers + activations define the model, <code>compile</code> picks the optimizer/loss, <code>fit</code> runs training with mini-batches, and <code>validation_data</code> tracks the dev metric so you can spot overfitting live.</p>`,
    `<span class="eyebrow">AIL304m · Module 3 · Bài 3.2</span>
<h2>Tối ưu &amp; TensorFlow/Keras</h2>
<h3>Optimizer nhanh hơn</h3>
<p>Gradient descent thuần thì chậm. <strong>Mini-batch</strong> cập nhật trên lô nhỏ (không phải cả tập); <strong>momentum</strong> làm mượt bước; <strong>Adam</strong> tự chỉnh learning rate theo từng tham số và là mặc định phổ biến. <strong>Chuẩn hoá đầu vào</strong> (mean 0, phương sai 1) tăng tốc hội tụ.</p>
<h3>Một mạng trong Keras</h3>
<pre><code class="language-python">import tensorflow as tf
from tensorflow import keras

model = keras.Sequential([
    keras.layers.Dense(64, activation="relu", input_shape=(n_features,)),
    keras.layers.Dropout(0.2),
    keras.layers.Dense(10, activation="softmax"),   # tầng ra 10 lớp
])
model.compile(optimizer="adam",
              loss="sparse_categorical_crossentropy",
              metrics=["accuracy"])
model.fit(X_train, y_train, epochs=20, batch_size=32,
          validation_data=(X_dev, y_dev))
test_loss, test_acc = model.evaluate(X_test, y_test)
</code></pre>
<p>Keras giấu forward/backprop: các tầng <code>Dense</code> + activation định nghĩa mô hình, <code>compile</code> chọn optimizer/loss, <code>fit</code> chạy train với mini-batch, và <code>validation_data</code> theo dõi metric dev để bạn thấy overfitting ngay.</p>`,
  ]]);

const m3e = doc('ail304m-3-3-exercise', 'Exercise 2 — diagnose bias vs variance|||Bài tập 2 — chẩn bias vs variance',
  'Bài tập: cho các cặp (train err, dev err), chẩn bias hay variance và đề xuất cách sửa; kèm lời giải.',
  [[
    `<span class="eyebrow">AIL304m · Module 3 · Exercise</span>
<h2>Exercise 2 — read the errors, prescribe a fix</h2>
<div class="callout"><span class="badge">Đề</span> For each model (human error ≈ 1%), diagnose and prescribe: (a) train 15%, dev 16%; (b) train 2%, dev 12%; (c) train 15%, dev 30%; (d) train 1.5%, dev 2%.</div>
<h3>Worked solution</h3>
<ul>
<li><strong>(a) train 15%, dev 16%</strong> — big gap to human error, small train↔dev gap ⇒ <strong>high bias</strong>. Fix: bigger network, train longer, better features.</li>
<li><strong>(b) train 2%, dev 12%</strong> — low train, large train↔dev gap ⇒ <strong>high variance</strong>. Fix: more data, regularization/dropout, early stopping.</li>
<li><strong>(c) train 15%, dev 30%</strong> — high train error AND large gap ⇒ <strong>high bias AND high variance</strong>. Fix both.</li>
<li><strong>(d) train 1.5%, dev 2%</strong> — both near human error ⇒ <strong>good fit</strong>; ship it.</li>
</ul>
<p><strong>Why:</strong> compare train error to the achievable (human/Bayes) error to read bias; compare dev error to train error to read variance. The two gaps tell you exactly which lever to pull.</p>`,
    `<span class="eyebrow">AIL304m · Module 3 · Bài tập</span>
<h2>Bài tập 2 — đọc lỗi, kê cách sửa</h2>
<div class="callout"><span class="badge">Đề</span> Với mỗi mô hình (lỗi người ≈ 1%), chẩn đoán và kê cách sửa: (a) train 15%, dev 16%; (b) train 2%, dev 12%; (c) train 15%, dev 30%; (d) train 1.5%, dev 2%.</div>
<h3>Lời giải</h3>
<ul>
<li><strong>(a) train 15%, dev 16%</strong> — cách xa lỗi người, khe train↔dev nhỏ ⇒ <strong>bias cao</strong>. Sửa: mạng lớn hơn, train lâu hơn, đặc trưng tốt hơn.</li>
<li><strong>(b) train 2%, dev 12%</strong> — train thấp, khe train↔dev lớn ⇒ <strong>variance cao</strong>. Sửa: thêm dữ liệu, regularization/dropout, early stopping.</li>
<li><strong>(c) train 15%, dev 30%</strong> — train cao VÀ khe lớn ⇒ <strong>vừa bias vừa variance</strong>. Sửa cả hai.</li>
<li><strong>(d) train 1.5%, dev 2%</strong> — cả hai gần lỗi người ⇒ <strong>khớp tốt</strong>; đem dùng.</li>
</ul>
<p><strong>Vì sao:</strong> so lỗi train với lỗi khả đạt (người/Bayes) để đọc bias; so lỗi dev với lỗi train để đọc variance. Hai khe cho biết chính xác cần kéo cần nào.</p>`,
  ]]);

const m3q = quiz('ail304m-quiz-3', 'Quiz M3 — Optimizing DNNs|||Quiz M3 — Tối ưu DNN', [
  { id: 'q1', question: 'Train err thấp nhưng dev err cao là dấu hiệu?', options: ['High bias', 'High variance (overfit)', 'Dữ liệu sạch', 'Learning rate tốt'], correctIndex: 1, explanation: 'Khe train↔dev lớn = variance cao = overfit.' },
  { id: 'q2', question: 'Optimizer mặc định phổ biến hiện nay?', options: ['SGD thuần', 'Adam', 'Newton', 'Không cần optimizer'], correctIndex: 1, explanation: 'Adam thích nghi learning rate theo tham số, hội tụ tốt, là mặc định phổ biến.' },
  { id: 'q3', question: 'Dropout giúp gì?', options: ['Tăng bias', 'Giảm overfitting (variance)', 'Tăng learning rate', 'Chuẩn hoá đầu vào'], correctIndex: 1, explanation: 'Dropout tắt ngẫu nhiên activation → chống overfit.' },
]);

/* Module 4: ML Strategy */
const m4 = doc('ail304m-4-1-ml-strategy', 'M4.1 — ML strategy: error analysis & transfer learning|||M4.1 — ML strategy: phân tích lỗi & transfer learning',
  'Chọn một metric duy nhất, phân tích lỗi (nhìn mẫu sai để ưu tiên), mismatch train/dev, end-to-end learning, và transfer/multi-task learning.',
  [[
    `<span class="eyebrow">AIL304m · Module 4 · Lesson 4.1</span>
<h2>ML strategy — spend effort where it pays</h2>
<p class="lead">With a big model and lots of options, <strong>strategy</strong> decides what to improve next. The habits below save weeks of wasted tuning.</p>
<ul>
<li><strong>One number to optimize</strong> — pick a single dev metric (e.g. F1) so you can compare models unambiguously.</li>
<li><strong>Error analysis</strong> — manually inspect ~100 misclassified dev examples, tally the causes; fix the biggest bucket first (don't guess).</li>
<li><strong>Train/dev distribution match</strong> — the dev/test set must reflect the data you'll actually see in production, or you optimize the wrong target.</li>
<li><strong>End-to-end learning</strong> — sometimes one network from raw input to output beats a hand-built pipeline — if you have enough data.</li>
<li><strong>Transfer learning</strong> — start from a model pre-trained on a large dataset and fine-tune on your smaller one; often far better than training from scratch.</li>
<li><strong>Multi-task learning</strong> — one network predicts several related labels at once, sharing features.</li>
</ul>
<div class="callout"><span class="badge">★ Thực tế</span> Transfer learning là lý do bạn có thể huấn luyện một bộ phân loại ảnh tốt với vài trăm ảnh: lấy mạng đã học trên hàng triệu ảnh (ImageNet) rồi fine-tune tầng cuối.</div>`,
    `<span class="eyebrow">AIL304m · Module 4 · Bài 4.1</span>
<h2>ML strategy — dồn công vào chỗ sinh lợi</h2>
<p class="lead">Với mô hình lớn và nhiều lựa chọn, <strong>strategy</strong> quyết cải thiện gì tiếp. Các thói quen dưới tiết kiệm hàng tuần chỉnh vô ích.</p>
<ul>
<li><strong>Một con số để tối ưu</strong> — chọn một metric dev duy nhất (vd F1) để so mô hình rõ ràng.</li>
<li><strong>Phân tích lỗi</strong> — xem tay ~100 ví dụ dev bị sai, đếm nguyên nhân; sửa nhóm lớn nhất trước (đừng đoán).</li>
<li><strong>Khớp phân bố train/dev</strong> — tập dev/test phải phản ánh dữ liệu thật ở production, nếu không bạn tối ưu sai mục tiêu.</li>
<li><strong>End-to-end learning</strong> — đôi khi một mạng từ đầu vào thô tới đầu ra thắng một pipeline dựng tay — nếu đủ dữ liệu.</li>
<li><strong>Transfer learning</strong> — bắt đầu từ mô hình đã pre-train trên tập lớn rồi fine-tune trên tập nhỏ của bạn; thường tốt hơn train từ đầu nhiều.</li>
<li><strong>Multi-task learning</strong> — một mạng dự đoán nhiều nhãn liên quan cùng lúc, chia sẻ đặc trưng.</li>
</ul>
<div class="callout"><span class="badge">★ Thực tế</span> Transfer learning là lý do bạn huấn luyện được một bộ phân loại ảnh tốt với vài trăm ảnh: lấy mạng đã học trên hàng triệu ảnh (ImageNet) rồi fine-tune tầng cuối.</div>`,
  ]]);

const m4q = quiz('ail304m-quiz-4', 'Quiz M4 — ML strategy|||Quiz M4 — ML strategy', [
  { id: 'q1', question: 'Phân tích lỗi (error analysis) nghĩa là?', options: ['Đọc log server', 'Xem tay các ví dụ dev bị sai để tìm nguyên nhân lớn nhất', 'Tăng learning rate', 'Thêm tầng'], correctIndex: 1, explanation: 'Xem ~100 mẫu sai, đếm nguyên nhân, ưu tiên sửa nhóm lớn nhất.' },
  { id: 'q2', question: 'Transfer learning là?', options: ['Chuyển dữ liệu giữa máy', 'Dùng mô hình pre-train rồi fine-tune trên tập nhỏ của mình', 'Đổi optimizer', 'Sao chép code'], correctIndex: 1, explanation: 'Khởi từ mô hình đã học trên tập lớn, fine-tune cho bài toán mình — hiệu quả khi ít dữ liệu.' },
  { id: 'q3', question: 'Vì sao tập dev/test phải khớp phân bố production?', options: ['Cho công bằng', 'Nếu không, ta tối ưu sai mục tiêu so với dữ liệu thật', 'Để nhanh hơn', 'Bắt buộc bởi TensorFlow'], correctIndex: 1, explanation: 'Dev/test lệch phân bố thật khiến cải thiện trên dev không chuyển thành cải thiện thật.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'AIL304m',
    slug: 'ail304m-machine-learning',
    title: 'Machine Learning',
    level: 'ADVANCED',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v2/AIL304m.webp',
    shortDescription: 'Deep-learning-focused ML — math foundations, neural networks, training/optimization with TensorFlow, and ML strategy. Bilingual, with Python/NumPy/Keras code & exercises.|||Học máy hướng deep learning — nền toán, mạng nơ-ron, huấn luyện/tối ưu với TensorFlow, và ML strategy. Song ngữ, có code Python/NumPy/Keras & bài tập.',
    description: 'Môn <strong>AIL304m — Machine Learning (Học máy)</strong> (ngành AI/SE combo, kỳ 4). Hướng deep learning: từ <strong>nền toán</strong> (đại số tuyến tính, giải tích, gradient descent) → <strong>mạng nơ-ron</strong> → <strong>cải thiện &amp; tối ưu</strong> (train/dev/test, bias/variance, optimizer, <strong>TensorFlow/Keras</strong>) → <strong>ML strategy</strong> (phân tích lỗi, transfer/multi-task learning). Bám giáo trình FLM (4 module, 5 CLO), song ngữ, có công thức + code Python và bài tập kèm lời giải.',
    whatYouLearn: 'Đại số tuyến tính & giải tích cho ML; gradient descent; perceptron & mạng nơ-ron (forward/backprop, ReLU/sigmoid/softmax, cross-entropy); train/dev/test & bias-variance; regularization/dropout; optimizer (SGD/momentum/Adam); TensorFlow/Keras (Sequential, compile, fit); ML strategy (error analysis, transfer & multi-task learning).',
    requirements: 'Nên biết Python cơ bản và toán phổ thông (đạo hàm, vector). Cần môi trường Python + NumPy + TensorFlow (hoặc Google Colab).',
  },
  sections: [
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Mục tiêu, 5 CLO, ML là gì, lộ trình 4 module.', lessons: [intro] },
    { title: 'Module 1 — Toán cho ML|||Module 1 — Math for ML', description: 'Đại số tuyến tính, gradient descent, perceptron.', lessons: [m1a, m1b, m1e, m1q] },
    { title: 'Module 2 — Mạng nơ-ron|||Module 2 — Neural networks', description: 'Forward prop, activation, loss, backprop.', lessons: [m2, m2q] },
    { title: 'Module 3 — Tối ưu DNN & TensorFlow|||Module 3 — Optimizing DNNs & TensorFlow', description: 'Bias/variance, regularization, Adam, Keras.', lessons: [m3a, m3b, m3e, m3q] },
    { title: 'Module 4 — ML strategy|||Module 4 — ML strategy', description: 'Error analysis, transfer & multi-task learning.', lessons: [m4, m4q] },
  ],
};
