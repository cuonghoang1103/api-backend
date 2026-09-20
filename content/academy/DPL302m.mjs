/**
 * DPL302m — Deep Learning (Học sâu). Ngành AI, FPTU, 6 tín chỉ.
 * KHUNG bám giáo trình FLM (sylID 13339). Nguồn chính: DeepLearning.AI
 * "Deep Learning Specialization" (Coursera, Andrew Ng); TensorFlow/Keras;
 * Jupyter. Tiên quyết AIL303m. 7 CLO · 5 module + Course Project.
 * Song ngữ EN+VI, có công thức + code Keras/TF minh hoạ ngắn + quiz mỗi module.
 * Mức KHUNG (đúng/rõ/học được) — đào sâu sau. GIỮ NGUYÊN slug/semester/thumb.
 * ⚠️ KHÔNG backtick lồng, KHÔNG ${...} trong HTML, "&"→"&amp;". Python trong
 * <pre><code class="language-python">.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức module.', quiz: { timeLimitSeconds: 480, questions } });

/* ── 📚 Tài liệu tham khảo ─────────────────────────────────────────────── */
const taiLieu = doc('dpl302m-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: DeepLearning.AI Specialization, TensorFlow/Keras, sách Goodfellow miễn phí, d2l.ai, HuggingFace; công cụ Colab/Jupyter; lộ trình 4 bước.',
  [[
    `<span class="eyebrow">DPL302m · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Deep Learning</strong> — neural networks, CNNs, sequence models and Transformers — in one place. The official FPTU slides live on <strong>FLM</strong>; the primary source is Andrew Ng's <strong>Deep Learning Specialization</strong>. Below are free, legal resources.</p>
<h3>📘 Slides &amp; primary course</h3>
<ul>
<li><a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — official FPTU slides, sign in with your FPTU account.</li>
<li><a href="https://www.coursera.org/specializations/deep-learning" target="_blank" rel="noopener">DeepLearning.AI — Deep Learning Specialization</a> (Andrew Ng) — the 5-course backbone of this subject.</li>
</ul>
<h3>📗 Free textbooks</h3>
<ul>
<li><a href="https://www.deeplearningbook.org/" target="_blank" rel="noopener"><em>Deep Learning</em> — Goodfellow, Bengio &amp; Courville</a> (free online).</li>
<li><a href="https://d2l.ai/" target="_blank" rel="noopener"><em>Dive into Deep Learning</em> (d2l.ai)</a> — interactive, code-first.</li>
</ul>
<h3>🌐 Official documentation</h3>
<ul>
<li><a href="https://www.tensorflow.org/" target="_blank" rel="noopener">TensorFlow (tensorflow.org)</a></li>
<li><a href="https://keras.io/" target="_blank" rel="noopener">Keras (keras.io)</a></li>
<li><a href="https://huggingface.co/docs" target="_blank" rel="noopener">HuggingFace docs</a> — Transformers &amp; pretrained models.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://colab.research.google.com/" target="_blank" rel="noopener">Google Colab</a> — free GPU notebooks.</li>
<li><a href="https://jupyter.org/" target="_blank" rel="noopener">Jupyter</a> — local notebooks.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundations</strong> — neural nets, forward/backward propagation, gradient descent, activations.</li>
<li><strong>Make them work</strong> — regularization, optimization (Adam), hyperparameter tuning, ML strategy.</li>
<li><strong>Go deep on domains</strong> — CNNs for vision, RNNs/LSTMs and Transformers for sequences.</li>
<li><strong>Ship a project</strong> — pick a dataset, train, evaluate, and defend a written report.</li>
</ol></div>`,
    `<span class="eyebrow">DPL302m · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Học sâu (Deep Learning)</strong> — mạng nơ-ron, CNN, mô hình chuỗi và Transformer — gom về một chỗ. Slide FPTU chính thức nằm trên <strong>FLM</strong>; nguồn chính là <strong>Deep Learning Specialization</strong> của Andrew Ng. Bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Slide &amp; khoá học chính</h3>
<ul>
<li><a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — slide FPTU chính thức, đăng nhập bằng tài khoản FPTU.</li>
<li><a href="https://www.coursera.org/specializations/deep-learning" target="_blank" rel="noopener">DeepLearning.AI — Deep Learning Specialization</a> (Andrew Ng) — 5 khoá xương sống của môn.</li>
</ul>
<h3>📗 Sách miễn phí</h3>
<ul>
<li><a href="https://www.deeplearningbook.org/" target="_blank" rel="noopener"><em>Deep Learning</em> — Goodfellow, Bengio &amp; Courville</a> (miễn phí trực tuyến).</li>
<li><a href="https://d2l.ai/" target="_blank" rel="noopener"><em>Dive into Deep Learning</em> (d2l.ai)</a> — tương tác, đi từ code.</li>
</ul>
<h3>🌐 Tài liệu chính thức</h3>
<ul>
<li><a href="https://www.tensorflow.org/" target="_blank" rel="noopener">TensorFlow (tensorflow.org)</a></li>
<li><a href="https://keras.io/" target="_blank" rel="noopener">Keras (keras.io)</a></li>
<li><a href="https://huggingface.co/docs" target="_blank" rel="noopener">HuggingFace docs</a> — Transformers &amp; mô hình tiền huấn luyện.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://colab.research.google.com/" target="_blank" rel="noopener">Google Colab</a> — notebook GPU miễn phí.</li>
<li><a href="https://jupyter.org/" target="_blank" rel="noopener">Jupyter</a> — notebook cục bộ.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — mạng nơ-ron, lan truyền tiến/lùi, gradient descent, hàm kích hoạt.</li>
<li><strong>Cho chạy được</strong> — regularization, tối ưu (Adam), tinh chỉnh siêu tham số, chiến lược ML.</li>
<li><strong>Đào sâu theo lĩnh vực</strong> — CNN cho thị giác, RNN/LSTM và Transformer cho chuỗi.</li>
<li><strong>Làm đồ án</strong> — chọn dữ liệu, huấn luyện, đánh giá và bảo vệ báo cáo viết.</li>
</ol></div>`,
  ]]);

/* ── Giới thiệu môn học ────────────────────────────────────────────────── */
const intro = doc('dpl302m-0-1-overview', 'Course overview: Deep Learning|||Tổng quan: Học sâu',
  'DL là gì; 7 chuẩn đầu ra (CLO); cơ cấu điểm (Progress 10% · Report 1–4 · Final 30% 50 MC); tiên quyết AIL303m; công cụ TensorFlow/Keras/Jupyter.',
  [[
    `<span class="eyebrow">DPL302m · Lesson 0.1 · Overview</span>
<h2>What is Deep Learning?</h2>
<p class="lead"><strong>Deep Learning</strong> is the branch of machine learning that trains <strong>deep neural networks</strong> — models with many layers that learn representations directly from raw data (pixels, text, audio) rather than hand-crafted features. It powers modern computer vision, speech recognition, machine translation and large language models.</p>
<h3>7 course learning outcomes (CLO)</h3>
<ol>
<li><strong>CLO1</strong> — Explain neural-network fundamentals and build shallow &amp; deep networks.</li>
<li><strong>CLO2</strong> — Improve a deep network: regularization, optimization, hyperparameter tuning.</li>
<li><strong>CLO3</strong> — Apply ML strategy: error analysis, transfer &amp; multi-task learning.</li>
<li><strong>CLO4</strong> — Build convolutional networks (CNNs) for computer-vision tasks.</li>
<li><strong>CLO5</strong> — Build sequence models (RNN, LSTM, attention, Transformer).</li>
<li><strong>CLO6</strong> — Execute a deep-learning project end-to-end in TensorFlow/Keras.</li>
<li><strong>CLO7</strong> — Report and defend results clearly and honestly.</li>
</ol>
<h3>Grading</h3>
<ul>
<li>Progress test — <strong>10%</strong></li>
<li>Report 1 — <strong>10%</strong> · Report 2 — <strong>10%</strong> · Report 3 — <strong>30%</strong> · Report 4 — <strong>10%</strong></li>
<li>Final exam — <strong>30%</strong> (50 multiple-choice questions)</li>
</ul>
<div class="callout"><span class="badge">Prerequisite</span> <strong>AIL303m</strong> (Machine Learning). You should already know supervised learning, gradient descent and basic Python/NumPy. Tools: <strong>TensorFlow/Keras</strong> in <strong>Colab/Jupyter</strong>.</div>`,
    `<span class="eyebrow">DPL302m · Bài 0.1 · Tổng quan</span>
<h2>Học sâu là gì?</h2>
<p class="lead"><strong>Học sâu (Deep Learning)</strong> là nhánh của học máy huấn luyện các <strong>mạng nơ-ron sâu</strong> — mô hình nhiều lớp học biểu diễn trực tiếp từ dữ liệu thô (điểm ảnh, văn bản, âm thanh) thay vì đặc trưng thủ công. Nó là nền của thị giác máy tính, nhận dạng tiếng nói, dịch máy và các mô hình ngôn ngữ lớn hiện đại.</p>
<h3>7 chuẩn đầu ra (CLO)</h3>
<ol>
<li><strong>CLO1</strong> — Giải thích nền tảng mạng nơ-ron và dựng mạng nông &amp; sâu.</li>
<li><strong>CLO2</strong> — Cải thiện mạng sâu: regularization, tối ưu, tinh chỉnh siêu tham số.</li>
<li><strong>CLO3</strong> — Áp dụng chiến lược ML: phân tích lỗi, transfer &amp; multi-task learning.</li>
<li><strong>CLO4</strong> — Dựng mạng tích chập (CNN) cho bài toán thị giác máy tính.</li>
<li><strong>CLO5</strong> — Dựng mô hình chuỗi (RNN, LSTM, attention, Transformer).</li>
<li><strong>CLO6</strong> — Thực hiện một đồ án học sâu trọn vẹn bằng TensorFlow/Keras.</li>
<li><strong>CLO7</strong> — Báo cáo và bảo vệ kết quả rõ ràng, trung thực.</li>
</ol>
<h3>Cơ cấu điểm</h3>
<ul>
<li>Progress test — <strong>10%</strong></li>
<li>Report 1 — <strong>10%</strong> · Report 2 — <strong>10%</strong> · Report 3 — <strong>30%</strong> · Report 4 — <strong>10%</strong></li>
<li>Thi cuối kỳ — <strong>30%</strong> (50 câu trắc nghiệm)</li>
</ul>
<div class="callout"><span class="badge">Tiên quyết</span> <strong>AIL303m</strong> (Machine Learning). Bạn cần nắm học có giám sát, gradient descent và Python/NumPy cơ bản. Công cụ: <strong>TensorFlow/Keras</strong> trên <strong>Colab/Jupyter</strong>.</div>`,
  ]]);

/* ── Module 1 — Neural Networks & Deep Learning (CLO1) ─────────────────── */
const m1a = doc('dpl302m-1-1-nn-basics', '1.1 — Neural network basics|||1.1 — Cơ bản mạng nơ-ron',
  'Perceptron & nơ-ron; lan truyền tiến (forward); hàm kích hoạt (sigmoid/tanh/ReLU); hàm mất mát; lan truyền ngược (backprop) & gradient descent.',
  [[
    `<span class="eyebrow">DPL302m · Module 1 · Lesson 1.1</span>
<h2>Neural network basics</h2>
<h3>From a neuron to forward propagation</h3>
<p>A single <strong>neuron</strong> computes a weighted sum plus bias, then an activation: <code>z = w·x + b</code>, <code>a = g(z)</code>. Stacking neurons into layers and passing inputs through them is <strong>forward propagation</strong>.</p>
<h3>Activation functions</h3>
<ul>
<li><strong>Sigmoid</strong> — squashes to (0,1); used for binary output. Saturates, vanishing gradients.</li>
<li><strong>tanh</strong> — squashes to (-1,1); zero-centered.</li>
<li><strong>ReLU</strong> — <code>max(0, z)</code>; the default for hidden layers — cheap, no saturation for positive inputs.</li>
</ul>
<h3>Learning: loss, backprop, gradient descent</h3>
<p>Training minimizes a <strong>loss</strong> (e.g. binary cross-entropy). <strong>Backpropagation</strong> computes the gradient of the loss w.r.t. every weight using the chain rule; <strong>gradient descent</strong> then nudges each weight opposite the gradient: <code>w := w - alpha · dL/dw</code>, where <code>alpha</code> is the learning rate.</p>
<pre><code class="language-python">import tensorflow as tf
from tensorflow import keras

# One neuron = logistic regression
model = keras.Sequential([
    keras.layers.Dense(1, activation='sigmoid', input_shape=(2,))
])
model.compile(optimizer='sgd', loss='binary_crossentropy',
              metrics=['accuracy'])
# model.fit(X, y, epochs=10)  # forward + backprop + gradient descent
</code></pre>
<div class="callout"><span class="badge">Key idea</span> A neural network is just a differentiable function; backprop gives every parameter a gradient, and gradient descent follows it downhill.</div>`,
    `<span class="eyebrow">DPL302m · Module 1 · Bài 1.1</span>
<h2>Cơ bản mạng nơ-ron</h2>
<h3>Từ một nơ-ron tới lan truyền tiến</h3>
<p>Một <strong>nơ-ron</strong> tính tổng có trọng số cộng bias, rồi qua hàm kích hoạt: <code>z = w·x + b</code>, <code>a = g(z)</code>. Xếp nơ-ron thành lớp và cho dữ liệu chạy qua chính là <strong>lan truyền tiến (forward)</strong>.</p>
<h3>Hàm kích hoạt</h3>
<ul>
<li><strong>Sigmoid</strong> — ép về (0,1); dùng cho đầu ra nhị phân. Bị bão hoà, gradient triệt tiêu.</li>
<li><strong>tanh</strong> — ép về (-1,1); tâm ở 0.</li>
<li><strong>ReLU</strong> — <code>max(0, z)</code>; mặc định cho lớp ẩn — rẻ, không bão hoà với đầu vào dương.</li>
</ul>
<h3>Học: mất mát, backprop, gradient descent</h3>
<p>Huấn luyện là tối thiểu hoá <strong>hàm mất mát</strong> (vd binary cross-entropy). <strong>Lan truyền ngược (backprop)</strong> tính đạo hàm mất mát theo từng trọng số bằng quy tắc chuỗi; <strong>gradient descent</strong> đẩy mỗi trọng số ngược hướng gradient: <code>w := w - alpha · dL/dw</code>, với <code>alpha</code> là tốc độ học.</p>
<pre><code class="language-python">import tensorflow as tf
from tensorflow import keras

# Một nơ-ron = hồi quy logistic
model = keras.Sequential([
    keras.layers.Dense(1, activation='sigmoid', input_shape=(2,))
])
model.compile(optimizer='sgd', loss='binary_crossentropy',
              metrics=['accuracy'])
# model.fit(X, y, epochs=10)  # forward + backprop + gradient descent
</code></pre>
<div class="callout"><span class="badge">Ý chính</span> Mạng nơ-ron chỉ là một hàm khả vi; backprop cho mọi tham số một gradient, gradient descent đi xuống theo gradient đó.</div>`,
  ]]);

const m1b = doc('dpl302m-1-2-shallow-deep', '1.2 — Shallow & deep networks|||1.2 — Mạng nông & mạng sâu',
  'Mạng một lớp ẩn (shallow); vector hoá; vì sao cần lớp sâu (deep) — học biểu diễn phân cấp; ký hiệu lớp; dựng deep NN bằng Keras.',
  [[
    `<span class="eyebrow">DPL302m · Module 1 · Lesson 1.2</span>
<h2>Shallow and deep networks</h2>
<h3>Shallow network</h3>
<p>A <strong>shallow</strong> network has one hidden layer. With enough hidden units it can approximate many functions, but it may need a huge layer to do so.</p>
<h3>Why go deep?</h3>
<p>A <strong>deep</strong> network stacks many hidden layers. Each layer learns features on top of the previous one — edges then shapes then objects for images — a <strong>hierarchy of representations</strong>. Depth often reaches the same accuracy with far fewer units than width.</p>
<pre><code class="language-python">from tensorflow import keras

# A deep fully-connected classifier (e.g. MNIST digits)
model = keras.Sequential([
    keras.layers.Flatten(input_shape=(28, 28)),
    keras.layers.Dense(128, activation='relu'),
    keras.layers.Dense(64, activation='relu'),
    keras.layers.Dense(10, activation='softmax'),
])
model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])
model.summary()
</code></pre>
<div class="callout"><span class="badge">Notation</span> Layer <em>l</em> has weights <code>W[l]</code>, bias <code>b[l]</code>, activation <code>a[l] = g(W[l]·a[l-1] + b[l])</code>, with <code>a[0] = x</code>.</div>`,
    `<span class="eyebrow">DPL302m · Module 1 · Bài 1.2</span>
<h2>Mạng nông và mạng sâu</h2>
<h3>Mạng nông (shallow)</h3>
<p>Mạng <strong>nông</strong> có một lớp ẩn. Đủ nơ-ron thì xấp xỉ được nhiều hàm, nhưng có khi cần một lớp cực lớn.</p>
<h3>Vì sao cần sâu?</h3>
<p>Mạng <strong>sâu (deep)</strong> xếp nhiều lớp ẩn. Mỗi lớp học đặc trưng dựa trên lớp trước — cạnh rồi hình rồi vật thể với ảnh — tạo <strong>phân cấp biểu diễn</strong>. Chiều sâu thường đạt cùng độ chính xác với ít nơ-ron hơn nhiều so với tăng chiều rộng.</p>
<pre><code class="language-python">from tensorflow import keras

# Mạng kết nối đầy đủ sâu (vd nhận chữ số MNIST)
model = keras.Sequential([
    keras.layers.Flatten(input_shape=(28, 28)),
    keras.layers.Dense(128, activation='relu'),
    keras.layers.Dense(64, activation='relu'),
    keras.layers.Dense(10, activation='softmax'),
])
model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])
model.summary()
</code></pre>
<div class="callout"><span class="badge">Ký hiệu</span> Lớp <em>l</em> có trọng số <code>W[l]</code>, bias <code>b[l]</code>, kích hoạt <code>a[l] = g(W[l]·a[l-1] + b[l])</code>, với <code>a[0] = x</code>.</div>`,
  ]]);

const m1q = quiz('dpl302m-quiz-1', 'Quiz 1 — Neural networks|||Quiz 1 — Mạng nơ-ron', [
  { id: 'q1', question: 'Backpropagation dùng để làm gì?|||What is backpropagation used for?', options: ['Chuẩn hoá dữ liệu vào|||Normalize the input', 'Tính gradient của loss theo từng trọng số|||Compute the gradient of the loss w.r.t. each weight', 'Chọn số lớp|||Choose the number of layers', 'Vẽ đồ thị mất mát|||Plot the loss curve'], correctIndex: 1, explanation: 'Backprop dùng quy tắc chuỗi tính dL/dw cho mọi tham số; gradient descent dùng nó để cập nhật.' },
  { id: 'q2', question: 'Hàm kích hoạt mặc định cho LỚP ẨN của mạng sâu thường là?|||The default activation for the HIDDEN layers of a deep net is usually?', options: ['Sigmoid', 'ReLU', 'Softmax', 'Linear'], correctIndex: 1, explanation: 'ReLU = max(0,z): rẻ, không bão hoà với đầu vào dương, tránh vanishing gradient tốt hơn sigmoid/tanh.' },
  { id: 'q3', question: 'Lợi ích chính của mạng SÂU so với mạng nông là?|||The main benefit of a DEEP net over a shallow one is?', options: ['Ít dữ liệu hơn luôn|||Always needs less data', 'Học biểu diễn phân cấp, thường cần ít nơ-ron hơn|||Learns hierarchical features, often with fewer units', 'Không cần hàm kích hoạt|||Needs no activation function', 'Không bao giờ overfit|||Never overfits'], correctIndex: 1, explanation: 'Mỗi lớp học đặc trưng trên đặc trưng của lớp trước; chiều sâu đạt cùng độ chính xác với ít tham số hơn tăng chiều rộng.' },
]);

/* ── Module 2 — Improving Deep Neural Networks (CLO2) ──────────────────── */
const m2a = doc('dpl302m-2-1-practical-optim', '2.1 — Practical aspects, regularization & optimization|||2.1 — Thực hành, regularization & tối ưu',
  'Chia train/dev/test; bias/variance; regularization (L2, dropout); khởi tạo Xavier/He; mini-batch; tối ưu Momentum/RMSprop/Adam; Batch Normalization; framework TensorFlow.',
  [[
    `<span class="eyebrow">DPL302m · Module 2 · Lesson 2.1</span>
<h2>Making deep nets actually work</h2>
<h3>Practical setup</h3>
<ul>
<li><strong>Train / dev / test split</strong> — tune on dev, report on an untouched test set.</li>
<li><strong>Bias vs variance</strong> — high train error = high bias (underfit); big train-vs-dev gap = high variance (overfit).</li>
</ul>
<h3>Regularization</h3>
<ul>
<li><strong>L2</strong> — add <code>lambda · sum(W^2)</code> to the loss; shrinks weights.</li>
<li><strong>Dropout</strong> — randomly drop units during training so the net cannot rely on any single one.</li>
</ul>
<h3>Initialization &amp; optimization</h3>
<p><strong>Xavier / He initialization</strong> keeps signal variance stable across layers. Train on <strong>mini-batches</strong>. Better optimizers: <strong>Momentum</strong> (smooths updates), <strong>RMSprop</strong> (per-parameter scaling), <strong>Adam</strong> (both — the default). <strong>Batch Normalization</strong> normalizes layer inputs, speeding and stabilizing training.</p>
<pre><code class="language-python">from tensorflow import keras
from tensorflow.keras import layers, regularizers

model = keras.Sequential([
    layers.Dense(128, activation='relu',
                 kernel_initializer='he_normal',
                 kernel_regularizer=regularizers.l2(1e-4)),
    layers.BatchNormalization(),
    layers.Dropout(0.3),
    layers.Dense(10, activation='softmax'),
])
model.compile(optimizer=keras.optimizers.Adam(1e-3),
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])
</code></pre>
<div class="callout"><span class="badge">Rule of thumb</span> Fix high bias with a bigger model / longer training; fix high variance with more data, L2, or dropout.</div>`,
    `<span class="eyebrow">DPL302m · Module 2 · Bài 2.1</span>
<h2>Làm mạng sâu thực sự chạy tốt</h2>
<h3>Thiết lập thực hành</h3>
<ul>
<li><strong>Chia train / dev / test</strong> — tinh chỉnh trên dev, báo cáo trên test chưa đụng tới.</li>
<li><strong>Bias vs variance</strong> — lỗi train cao = bias cao (underfit); chênh train–dev lớn = variance cao (overfit).</li>
</ul>
<h3>Regularization</h3>
<ul>
<li><strong>L2</strong> — cộng <code>lambda · sum(W^2)</code> vào loss; co nhỏ trọng số.</li>
<li><strong>Dropout</strong> — bỏ ngẫu nhiên một số nơ-ron khi huấn luyện để mạng không dựa vào riêng cái nào.</li>
</ul>
<h3>Khởi tạo &amp; tối ưu</h3>
<p><strong>Khởi tạo Xavier / He</strong> giữ phương sai tín hiệu ổn định qua các lớp. Huấn luyện theo <strong>mini-batch</strong>. Tối ưu tốt hơn: <strong>Momentum</strong> (làm mượt cập nhật), <strong>RMSprop</strong> (co giãn theo từng tham số), <strong>Adam</strong> (cả hai — mặc định). <strong>Batch Normalization</strong> chuẩn hoá đầu vào lớp, giúp huấn luyện nhanh và ổn định.</p>
<pre><code class="language-python">from tensorflow import keras
from tensorflow.keras import layers, regularizers

model = keras.Sequential([
    layers.Dense(128, activation='relu',
                 kernel_initializer='he_normal',
                 kernel_regularizer=regularizers.l2(1e-4)),
    layers.BatchNormalization(),
    layers.Dropout(0.3),
    layers.Dense(10, activation='softmax'),
])
model.compile(optimizer=keras.optimizers.Adam(1e-3),
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])
</code></pre>
<div class="callout"><span class="badge">Mẹo nhớ</span> Bias cao thì mạng lớn hơn / huấn luyện lâu hơn; variance cao thì thêm dữ liệu, L2, hoặc dropout.</div>`,
  ]]);

const m2q = quiz('dpl302m-quiz-2', 'Quiz 2 — Improving DNNs|||Quiz 2 — Cải thiện DNN', [
  { id: 'q1', question: 'Chênh lệch lớn giữa lỗi train (thấp) và lỗi dev (cao) là dấu hiệu của?|||A big gap between low train error and high dev error signals?', options: ['Bias cao (underfit)|||High bias (underfit)', 'Variance cao (overfit)|||High variance (overfit)', 'Learning rate quá nhỏ|||Learning rate too small', 'Thiếu lớp softmax|||Missing softmax layer'], correctIndex: 1, explanation: 'Train tốt nhưng dev kém = mô hình học thuộc dữ liệu train → variance cao. Sửa bằng thêm dữ liệu / L2 / dropout.' },
  { id: 'q2', question: 'Dropout hoạt động thế nào khi huấn luyện?|||How does dropout work during training?', options: ['Xoá bớt lớp|||Deletes layers', 'Bỏ ngẫu nhiên một phần nơ-ron mỗi lượt|||Randomly drops a fraction of units each step', 'Giảm learning rate|||Lowers the learning rate', 'Chuẩn hoá đầu vào|||Normalizes the input'], correctIndex: 1, explanation: 'Dropout tắt ngẫu nhiên nơ-ron mỗi bước nên mạng không phụ thuộc một nơ-ron cụ thể → giảm overfit.' },
  { id: 'q3', question: 'Trình tối ưu mặc định kết hợp Momentum + RMSprop là?|||The default optimizer combining Momentum + RMSprop is?', options: ['SGD thuần|||Plain SGD', 'Adam', 'Adagrad', 'L2'], correctIndex: 1, explanation: 'Adam gộp đà (momentum) và co giãn theo từng tham số (RMSprop), nên là lựa chọn mặc định phổ biến.' },
]);

/* ── Module 3 — ML Strategy (CLO3) ────────────────────────────────────── */
const m3a = doc('dpl302m-3-1-ml-strategy', '3.1 — Structuring ML projects|||3.1 — Chiến lược dự án ML',
  'Đặt một chỉ số tối ưu; error analysis; train/dev/test cùng phân phối & xử lý phân phối lệch; transfer learning; multi-task learning; end-to-end learning.',
  [[
    `<span class="eyebrow">DPL302m · Module 3 · Lesson 3.1</span>
<h2>ML strategy — how to make progress</h2>
<h3>Set a single number to optimize</h3>
<p>Pick <strong>one</strong> metric (e.g. F1) so any two models can be compared instantly; keep others as satisficing constraints (e.g. latency under 100 ms).</p>
<h3>Error analysis</h3>
<p>Manually inspect a sample of mistakes and <strong>count categories</strong> (blurry images, mislabels, rare classes). Fix the biggest bucket first — it tells you where effort pays off.</p>
<h3>Mismatched distributions</h3>
<p>When train data differs from real (dev/test) data, put the real distribution in dev/test and use a <strong>train-dev set</strong> to separate a variance problem from a data-mismatch problem.</p>
<h3>Transfer, multi-task &amp; end-to-end learning</h3>
<ul>
<li><strong>Transfer learning</strong> — reuse a network pretrained on a large dataset, then fine-tune on your smaller one.</li>
<li><strong>Multi-task learning</strong> — one network predicts several labels at once, sharing features.</li>
<li><strong>End-to-end learning</strong> — one model maps raw input straight to output; needs lots of data, drops hand-designed stages.</li>
</ul>
<pre><code class="language-python">from tensorflow import keras

# Transfer learning: reuse pretrained features, retrain the head
base = keras.applications.MobileNetV2(
    input_shape=(160, 160, 3), include_top=False, weights='imagenet')
base.trainable = False  # freeze pretrained layers
model = keras.Sequential([
    base,
    keras.layers.GlobalAveragePooling2D(),
    keras.layers.Dense(1, activation='sigmoid'),
])
</code></pre>
<div class="callout"><span class="badge">Orthogonalization</span> Tune one thing at a time: first fit the train set, then the dev set, then the test set, then real-world performance.</div>`,
    `<span class="eyebrow">DPL302m · Module 3 · Bài 3.1</span>
<h2>Chiến lược ML — cách tiến bộ nhanh</h2>
<h3>Đặt một con số để tối ưu</h3>
<p>Chọn <strong>một</strong> chỉ số (vd F1) để so hai mô hình tức thì; các tiêu chí khác để dạng ràng buộc (vd độ trễ dưới 100 ms).</p>
<h3>Phân tích lỗi (error analysis)</h3>
<p>Xem tay một mẫu các ca sai và <strong>đếm theo nhóm nguyên nhân</strong> (ảnh mờ, nhãn sai, lớp hiếm). Sửa nhóm lớn nhất trước — nó cho biết công sức bỏ vào đâu là đáng.</p>
<h3>Phân phối lệch</h3>
<p>Khi dữ liệu train khác dữ liệu thật (dev/test), đặt phân phối thật vào dev/test và dùng một <strong>train-dev set</strong> để tách lỗi variance khỏi lỗi lệch phân phối.</p>
<h3>Transfer, multi-task &amp; end-to-end</h3>
<ul>
<li><strong>Transfer learning</strong> — tái dùng mạng đã tiền huấn luyện trên tập lớn, rồi tinh chỉnh trên tập nhỏ của bạn.</li>
<li><strong>Multi-task learning</strong> — một mạng dự đoán nhiều nhãn cùng lúc, chia sẻ đặc trưng.</li>
<li><strong>End-to-end learning</strong> — một mô hình ánh xạ đầu vào thô thẳng ra đầu ra; cần nhiều dữ liệu, bỏ các bước thủ công.</li>
</ul>
<pre><code class="language-python">from tensorflow import keras

# Transfer learning: tái dùng đặc trưng tiền huấn luyện, huấn luyện lại phần đầu
base = keras.applications.MobileNetV2(
    input_shape=(160, 160, 3), include_top=False, weights='imagenet')
base.trainable = False  # đóng băng lớp tiền huấn luyện
model = keras.Sequential([
    base,
    keras.layers.GlobalAveragePooling2D(),
    keras.layers.Dense(1, activation='sigmoid'),
])
</code></pre>
<div class="callout"><span class="badge">Trực giao hoá</span> Chỉnh từng thứ một: khớp train, rồi dev, rồi test, rồi hiệu năng thực tế.</div>`,
  ]]);

const m3q = quiz('dpl302m-quiz-3', 'Quiz 3 — ML strategy|||Quiz 3 — Chiến lược ML', [
  { id: 'q1', question: 'Vì sao nên chọn MỘT chỉ số tối ưu duy nhất?|||Why pick a SINGLE optimizing metric?', options: ['Để mô hình chạy nhanh hơn|||To make the model faster', 'Để so sánh hai mô hình tức thì|||To compare any two models instantly', 'Để bỏ tập test|||To skip the test set', 'Để tránh dùng GPU|||To avoid using a GPU'], correctIndex: 1, explanation: 'Một số duy nhất cho phép xếp hạng mô hình ngay; các tiêu chí còn lại giữ dạng ràng buộc (satisficing).' },
  { id: 'q2', question: 'Transfer learning là gì?|||What is transfer learning?', options: ['Chuyển dữ liệu giữa máy chủ|||Moving data between servers', 'Tái dùng mạng đã tiền huấn luyện rồi tinh chỉnh|||Reusing a pretrained network then fine-tuning it', 'Đổi learning rate giữa chừng|||Changing the learning rate mid-training', 'Ghép nhiều tập test|||Merging several test sets'], correctIndex: 1, explanation: 'Dùng trọng số đã học trên tập lớn (vd ImageNet) làm điểm khởi đầu, rồi huấn luyện lại phần đầu trên dữ liệu của mình.' },
  { id: 'q3', question: 'Mục đích chính của error analysis là?|||The main purpose of error analysis is?', options: ['Tăng learning rate|||Increase the learning rate', 'Đếm nhóm nguyên nhân sai để ưu tiên sửa|||Count error categories to prioritize fixes', 'Xoá tập dev|||Delete the dev set', 'Thêm lớp dropout|||Add a dropout layer'], correctIndex: 1, explanation: 'Xem tay các ca sai, đếm theo nhóm, sửa nhóm lớn nhất trước — công sức đổ đúng chỗ.' },
]);

/* ── Module 4 — Convolutional Neural Networks (CLO4) ───────────────────── */
const m4a = doc('dpl302m-4-1-cnn-foundations', '4.1 — CNN foundations|||4.1 — Nền tảng CNN',
  'Phép tích chập (convolution); filter/kernel; padding; stride; pooling (max/average); vì sao CNN hợp với ảnh (chia sẻ trọng số, bất biến tịnh tiến); dựng CNN Keras.',
  [[
    `<span class="eyebrow">DPL302m · Module 4 · Lesson 4.1</span>
<h2>Convolutional neural networks — foundations</h2>
<h3>The convolution operation</h3>
<p>A small <strong>filter (kernel)</strong> slides over the image, computing a dot product at each position to make a <strong>feature map</strong>. The same weights are reused everywhere (<strong>weight sharing</strong>), so a CNN uses far fewer parameters than a dense net and is <strong>translation-invariant</strong>.</p>
<ul>
<li><strong>Padding</strong> — add a border of zeros to keep the output size ("same" padding).</li>
<li><strong>Stride</strong> — how far the filter moves each step; stride 2 halves the map.</li>
<li><strong>Pooling</strong> — downsample a region to one value (max or average) to shrink maps and add robustness.</li>
</ul>
<pre><code class="language-python">from tensorflow import keras
from tensorflow.keras import layers

model = keras.Sequential([
    layers.Conv2D(32, 3, activation='relu', padding='same',
                  input_shape=(32, 32, 3)),
    layers.MaxPooling2D(2),
    layers.Conv2D(64, 3, activation='relu', padding='same'),
    layers.MaxPooling2D(2),
    layers.Flatten(),
    layers.Dense(64, activation='relu'),
    layers.Dense(10, activation='softmax'),
])
</code></pre>
<div class="callout"><span class="badge">Why CNNs win on images</span> Weight sharing + local receptive fields = fewer parameters, and a pattern learned in one corner is recognized anywhere.</div>`,
    `<span class="eyebrow">DPL302m · Module 4 · Bài 4.1</span>
<h2>Mạng tích chập (CNN) — nền tảng</h2>
<h3>Phép tích chập</h3>
<p>Một <strong>filter (kernel)</strong> nhỏ trượt trên ảnh, tính tích vô hướng ở mỗi vị trí để tạo <strong>bản đồ đặc trưng (feature map)</strong>. Cùng bộ trọng số dùng ở khắp nơi (<strong>chia sẻ trọng số</strong>), nên CNN ít tham số hơn mạng dày nhiều và <strong>bất biến tịnh tiến</strong>.</p>
<ul>
<li><strong>Padding</strong> — thêm viền số 0 để giữ kích thước đầu ra (padding "same").</li>
<li><strong>Stride</strong> — bước trượt của filter; stride 2 làm bản đồ nhỏ đi một nửa.</li>
<li><strong>Pooling</strong> — gộp một vùng về một giá trị (max hoặc average) để thu nhỏ bản đồ và tăng bền vững.</li>
</ul>
<pre><code class="language-python">from tensorflow import keras
from tensorflow.keras import layers

model = keras.Sequential([
    layers.Conv2D(32, 3, activation='relu', padding='same',
                  input_shape=(32, 32, 3)),
    layers.MaxPooling2D(2),
    layers.Conv2D(64, 3, activation='relu', padding='same'),
    layers.MaxPooling2D(2),
    layers.Flatten(),
    layers.Dense(64, activation='relu'),
    layers.Dense(10, activation='softmax'),
])
</code></pre>
<div class="callout"><span class="badge">Vì sao CNN thắng với ảnh</span> Chia sẻ trọng số + trường tiếp nhận cục bộ = ít tham số, và một mẫu học được ở góc này nhận ra ở mọi nơi.</div>`,
  ]]);

const m4b = doc('dpl302m-4-2-cnn-cases-apps', '4.2 — Case studies & applications|||4.2 — Kiến trúc kinh điển & ứng dụng',
  'Kiến trúc: LeNet, AlexNet, VGG, ResNet (skip connection), Inception; object detection (YOLO); face recognition (siamese/triplet loss); neural style transfer.',
  [[
    `<span class="eyebrow">DPL302m · Module 4 · Lesson 4.2</span>
<h2>Classic architectures &amp; vision applications</h2>
<h3>Case studies</h3>
<ul>
<li><strong>LeNet-5</strong> — the first successful CNN (digits).</li>
<li><strong>AlexNet / VGG</strong> — deeper stacks that won ImageNet; VGG uses uniform 3x3 filters.</li>
<li><strong>ResNet</strong> — <strong>skip (residual) connections</strong> let gradients flow through very deep nets (100+ layers).</li>
<li><strong>Inception</strong> — runs several filter sizes in parallel in one block.</li>
</ul>
<h3>Applications</h3>
<ul>
<li><strong>Object detection (YOLO)</strong> — one pass predicts bounding boxes + classes on a grid; real-time.</li>
<li><strong>Face recognition</strong> — a siamese network learns an embedding; <strong>triplet loss</strong> pulls same-person pairs together, pushes different-person pairs apart.</li>
<li><strong>Neural style transfer</strong> — combine the <em>content</em> of one image with the <em>style</em> of another using features from a pretrained CNN.</li>
</ul>
<pre><code class="language-python">from tensorflow import keras

# ResNet50 pretrained on ImageNet as a feature extractor
backbone = keras.applications.ResNet50(
    include_top=False, weights='imagenet', pooling='avg')
backbone.trainable = False
</code></pre>
<div class="callout"><span class="badge">Residual idea</span> Instead of learning H(x), a ResNet block learns the residual F(x) = H(x) - x, so "do nothing" is easy — that is what makes very deep nets trainable.</div>`,
    `<span class="eyebrow">DPL302m · Module 4 · Bài 4.2</span>
<h2>Kiến trúc kinh điển &amp; ứng dụng thị giác</h2>
<h3>Các kiến trúc tiêu biểu</h3>
<ul>
<li><strong>LeNet-5</strong> — CNN thành công đầu tiên (chữ số).</li>
<li><strong>AlexNet / VGG</strong> — chồng sâu hơn, thắng ImageNet; VGG dùng đồng loạt filter 3x3.</li>
<li><strong>ResNet</strong> — <strong>skip (residual) connection</strong> giúp gradient chảy qua mạng rất sâu (hơn 100 lớp).</li>
<li><strong>Inception</strong> — chạy song song nhiều cỡ filter trong một khối.</li>
</ul>
<h3>Ứng dụng</h3>
<ul>
<li><strong>Object detection (YOLO)</strong> — một lượt duyệt dự đoán khung bao + lớp trên một lưới; thời gian thực.</li>
<li><strong>Nhận diện khuôn mặt</strong> — mạng siamese học một embedding; <strong>triplet loss</strong> kéo cặp cùng người lại gần, đẩy cặp khác người ra xa.</li>
<li><strong>Neural style transfer</strong> — gộp <em>nội dung</em> của ảnh này với <em>phong cách</em> ảnh kia bằng đặc trưng từ CNN tiền huấn luyện.</li>
</ul>
<pre><code class="language-python">from tensorflow import keras

# ResNet50 tiền huấn luyện ImageNet làm bộ trích đặc trưng
backbone = keras.applications.ResNet50(
    include_top=False, weights='imagenet', pooling='avg')
backbone.trainable = False
</code></pre>
<div class="callout"><span class="badge">Ý tưởng residual</span> Thay vì học H(x), khối ResNet học phần dư F(x) = H(x) - x, nên "không làm gì" là dễ — đó là cái giúp mạng rất sâu huấn luyện được.</div>`,
  ]]);

const m4q = quiz('dpl302m-quiz-4', 'Quiz 4 — CNN|||Quiz 4 — Mạng tích chập', [
  { id: 'q1', question: 'Nhờ đâu CNN có ít tham số hơn mạng kết nối đầy đủ trên ảnh?|||What makes a CNN use fewer parameters than a dense net on images?', options: ['Không có bias|||It has no bias', 'Chia sẻ trọng số của filter khắp ảnh|||Weight sharing of the filter across the image', 'Không có hàm kích hoạt|||It has no activation', 'Dùng learning rate lớn|||It uses a large learning rate'], correctIndex: 1, explanation: 'Cùng một filter trượt khắp ảnh (chia sẻ trọng số) + trường tiếp nhận cục bộ ⇒ ít tham số và bất biến tịnh tiến.' },
  { id: 'q2', question: 'Đặc trưng chính của ResNet là?|||The defining feature of ResNet is?', options: ['Filter 11x11|||11x11 filters', 'Skip / residual connection|||Skip / residual connections', 'Không dùng pooling|||No pooling at all', 'Chỉ một lớp|||A single layer'], correctIndex: 1, explanation: 'Skip connection cho gradient chảy qua mạng rất sâu, khối học phần dư F(x)=H(x)-x nên huấn luyện được mạng 100+ lớp.' },
  { id: 'q3', question: 'YOLO được dùng cho bài toán nào?|||YOLO is used for which task?', options: ['Dịch máy|||Machine translation', 'Phát hiện vật thể thời gian thực|||Real-time object detection', 'Sinh văn bản|||Text generation', 'Nén ảnh|||Image compression'], correctIndex: 1, explanation: 'YOLO ("You Only Look Once") dự đoán khung bao + lớp trong một lượt duyệt trên lưới → phát hiện vật thể thời gian thực.' },
]);

/* ── Module 5 — Sequence Models (CLO5) ────────────────────────────────── */
const m5a = doc('dpl302m-5-1-rnn-lstm', '5.1 — RNN, LSTM & GRU|||5.1 — RNN, LSTM & GRU',
  'Dữ liệu chuỗi; RNN & trạng thái ẩn theo thời gian; vanishing gradient; LSTM (cổng quên/vào/ra) & GRU; word embeddings (Word2Vec/GloVe); dựng RNN Keras.',
  [[
    `<span class="eyebrow">DPL302m · Module 5 · Lesson 5.1</span>
<h2>Recurrent networks for sequences</h2>
<h3>Why sequences need memory</h3>
<p>Text, speech and time series have order and context. A <strong>recurrent neural network (RNN)</strong> keeps a <strong>hidden state</strong> that carries information from earlier steps: <code>h_t = g(W · [h_{t-1}, x_t] + b)</code>.</p>
<h3>LSTM and GRU</h3>
<p>Plain RNNs suffer <strong>vanishing gradients</strong> over long sequences. <strong>LSTM</strong> adds gates — <em>forget</em>, <em>input</em>, <em>output</em> — plus a cell state that carries information far without decaying. <strong>GRU</strong> is a lighter two-gate variant.</p>
<h3>Word embeddings</h3>
<p>Words become dense vectors where similar meanings sit close together. <strong>Word2Vec</strong> and <strong>GloVe</strong> learn these embeddings from large corpora, replacing sparse one-hot vectors.</p>
<pre><code class="language-python">from tensorflow import keras
from tensorflow.keras import layers

model = keras.Sequential([
    layers.Embedding(input_dim=10000, output_dim=128),
    layers.LSTM(64),
    layers.Dense(1, activation='sigmoid'),  # e.g. sentiment
])
model.compile(optimizer='adam', loss='binary_crossentropy',
              metrics=['accuracy'])
</code></pre>
<div class="callout"><span class="badge">Gate intuition</span> The LSTM cell decides what to forget, what to store, and what to output — that is how it remembers context across long inputs.</div>`,
    `<span class="eyebrow">DPL302m · Module 5 · Bài 5.1</span>
<h2>Mạng hồi quy cho chuỗi</h2>
<h3>Vì sao chuỗi cần bộ nhớ</h3>
<p>Văn bản, tiếng nói, chuỗi thời gian có thứ tự và ngữ cảnh. Một <strong>mạng hồi quy (RNN)</strong> giữ một <strong>trạng thái ẩn</strong> mang thông tin từ các bước trước: <code>h_t = g(W · [h_{t-1}, x_t] + b)</code>.</p>
<h3>LSTM và GRU</h3>
<p>RNN thuần bị <strong>vanishing gradient</strong> trên chuỗi dài. <strong>LSTM</strong> thêm các cổng — <em>quên</em>, <em>vào</em>, <em>ra</em> — cùng một cell state mang thông tin đi xa mà không phai. <strong>GRU</strong> là biến thể nhẹ hai cổng.</p>
<h3>Word embeddings</h3>
<p>Từ trở thành vector dày, nghĩa gần thì nằm gần nhau. <strong>Word2Vec</strong> và <strong>GloVe</strong> học các embedding này từ kho ngữ liệu lớn, thay cho one-hot thưa.</p>
<pre><code class="language-python">from tensorflow import keras
from tensorflow.keras import layers

model = keras.Sequential([
    layers.Embedding(input_dim=10000, output_dim=128),
    layers.LSTM(64),
    layers.Dense(1, activation='sigmoid'),  # vd phân tích cảm xúc
])
model.compile(optimizer='adam', loss='binary_crossentropy',
              metrics=['accuracy'])
</code></pre>
<div class="callout"><span class="badge">Trực giác cổng</span> Cell LSTM quyết định quên gì, lưu gì, xuất gì — nhờ vậy nó nhớ ngữ cảnh qua chuỗi dài.</div>`,
  ]]);

const m5b = doc('dpl302m-5-2-attention-transformer', '5.2 — Attention & Transformers|||5.2 — Attention & Transformer',
  'Cơ chế attention; self-attention (query/key/value); kiến trúc Transformer (multi-head, positional encoding); vì sao thay RNN; nền của mô hình ngôn ngữ lớn.',
  [[
    `<span class="eyebrow">DPL302m · Module 5 · Lesson 5.2</span>
<h2>Attention and the Transformer</h2>
<h3>Attention</h3>
<p><strong>Attention</strong> lets a model, at each output step, look back and weight <em>all</em> input positions by relevance instead of squeezing everything through one hidden state. This fixed the long-range weakness of RNNs.</p>
<h3>Self-attention</h3>
<p>Each token forms a <strong>query</strong>, <strong>key</strong> and <strong>value</strong>. The attention weight between two tokens is the (scaled) dot product of query and key, softmax-normalized; the output is the weighted sum of values: <code>Attention(Q,K,V) = softmax(QK^T / sqrt(d)) · V</code>.</p>
<h3>The Transformer</h3>
<p>The <strong>Transformer</strong> stacks <strong>multi-head self-attention</strong> + feed-forward layers, with <strong>positional encoding</strong> to inject order. It processes a whole sequence in parallel (no recurrence), so it trains fast and scales — the basis of BERT, GPT and modern LLMs.</p>
<pre><code class="language-python">from tensorflow.keras import layers

# One multi-head self-attention block
attn = layers.MultiHeadAttention(num_heads=8, key_dim=64)
# out = attn(query=x, value=x, key=x)  # self-attention over a sequence x
</code></pre>
<div class="callout"><span class="badge">Why it replaced RNNs</span> Self-attention connects any two positions in one step and runs in parallel — better long-range modeling and far faster training than sequential RNNs.</div>`,
    `<span class="eyebrow">DPL302m · Module 5 · Bài 5.2</span>
<h2>Attention và Transformer</h2>
<h3>Attention</h3>
<p><strong>Attention</strong> cho mô hình, ở mỗi bước đầu ra, nhìn lại và gán trọng số cho <em>mọi</em> vị trí đầu vào theo mức liên quan, thay vì nén tất cả qua một trạng thái ẩn. Nó khắc phục điểm yếu tầm xa của RNN.</p>
<h3>Self-attention</h3>
<p>Mỗi token tạo một <strong>query</strong>, <strong>key</strong> và <strong>value</strong>. Trọng số attention giữa hai token là tích vô hướng (có chia tỉ lệ) của query và key, chuẩn hoá softmax; đầu ra là tổng có trọng số của value: <code>Attention(Q,K,V) = softmax(QK^T / sqrt(d)) · V</code>.</p>
<h3>Transformer</h3>
<p><strong>Transformer</strong> chồng các lớp <strong>multi-head self-attention</strong> + feed-forward, cùng <strong>positional encoding</strong> để nạp thứ tự. Nó xử lý cả chuỗi song song (không hồi quy), nên huấn luyện nhanh và co giãn tốt — nền của BERT, GPT và các LLM hiện đại.</p>
<pre><code class="language-python">from tensorflow.keras import layers

# Một khối multi-head self-attention
attn = layers.MultiHeadAttention(num_heads=8, key_dim=64)
# out = attn(query=x, value=x, key=x)  # self-attention trên chuỗi x
</code></pre>
<div class="callout"><span class="badge">Vì sao thay RNN</span> Self-attention nối bất kỳ hai vị trí trong một bước và chạy song song — mô hình tầm xa tốt hơn và huấn luyện nhanh hơn nhiều so với RNN tuần tự.</div>`,
  ]]);

const m5q = quiz('dpl302m-quiz-5', 'Quiz 5 — Sequence models|||Quiz 5 — Mô hình chuỗi', [
  { id: 'q1', question: 'LSTM khắc phục vấn đề gì của RNN thuần?|||What problem of plain RNNs does an LSTM address?', options: ['Overfitting', 'Vanishing gradient trên chuỗi dài|||Vanishing gradients over long sequences', 'Thiếu GPU|||Lack of a GPU', 'Ảnh quá lớn|||Images too large'], correctIndex: 1, explanation: 'Các cổng (quên/vào/ra) + cell state của LSTM mang thông tin đi xa mà không phai, giải quyết vanishing gradient.' },
  { id: 'q2', question: 'Trong self-attention, ba đại lượng học được cho mỗi token là?|||In self-attention, the three quantities per token are?', options: ['Loss, gradient, weight', 'Query, Key, Value', 'Input, hidden, output gate', 'Batch, epoch, stride'], correctIndex: 1, explanation: 'Mỗi token tạo Query, Key, Value; attention = softmax(QK^T/sqrt(d))·V.' },
  { id: 'q3', question: 'Ưu điểm lớn của Transformer so với RNN là?|||A key advantage of the Transformer over RNNs is?', options: ['Xử lý chuỗi song song, mô hình tầm xa tốt|||Parallel processing and better long-range modeling', 'Không cần dữ liệu|||Needs no data', 'Chỉ dùng cho ảnh|||Works only on images', 'Không có tham số|||Has no parameters'], correctIndex: 0, explanation: 'Không hồi quy nên chạy song song (huấn luyện nhanh) và self-attention nối trực tiếp hai vị trí bất kỳ (tầm xa tốt).' },
]);

/* ── Module 6 — Course Project (CLO6-7) ───────────────────────────────── */
const m6a = doc('dpl302m-6-1-course-project', '6.1 — Deep learning course project|||6.1 — Đồ án môn học',
  'Quy trình đồ án DL: đề xuất → thu thập & xử lý dữ liệu → chọn & huấn luyện mô hình → đánh giá & so sánh → báo cáo (Report 1–4) & bảo vệ. Mẹo tránh sai sót.',
  [[
    `<span class="eyebrow">DPL302m · Module 6 · Lesson 6.1</span>
<h2>The deep learning course project</h2>
<p class="lead">The project (Reports 1–4, worth most of the grade) walks a real deep-learning problem from idea to defense. It exercises CLO6 (build end-to-end) and CLO7 (report honestly).</p>
<h3>The workflow</h3>
<ol>
<li><strong>Proposal (Report 1)</strong> — pick a problem and dataset, state the metric and a baseline.</li>
<li><strong>Data (Report 2)</strong> — collect, clean, split train/dev/test, augment; document leakage risks.</li>
<li><strong>Model &amp; results (Report 3)</strong> — train baseline then improve (regularize, tune, transfer learning); compare with a table of metrics.</li>
<li><strong>Report &amp; defense (Report 4)</strong> — write it up, show learning curves and error analysis, and defend the choices.</li>
</ol>
<h3>Good practice</h3>
<ul>
<li>Fix a random <strong>seed</strong> and log every experiment so results are reproducible.</li>
<li>Never touch the <strong>test set</strong> until the very end.</li>
<li>Report honestly — include failure cases, not just the best run (CLO7).</li>
</ul>
<pre><code class="language-python">from tensorflow import keras

callbacks = [
    keras.callbacks.EarlyStopping(patience=3, restore_best_weights=True),
    keras.callbacks.ModelCheckpoint('best.keras', save_best_only=True),
]
history = model.fit(train_ds, validation_data=dev_ds,
                    epochs=50, callbacks=callbacks)
# Plot history.history['loss'] vs ['val_loss'] to read bias/variance
</code></pre>
<div class="callout"><span class="badge">Deliverable</span> A reproducible notebook + a written report with metric table, learning curves, error analysis, and an honest discussion of limitations.</div>`,
    `<span class="eyebrow">DPL302m · Module 6 · Bài 6.1</span>
<h2>Đồ án môn học sâu</h2>
<p class="lead">Đồ án (Report 1–4, chiếm phần lớn điểm) đưa một bài toán học sâu thật từ ý tưởng đến bảo vệ. Nó rèn CLO6 (làm trọn vẹn) và CLO7 (báo cáo trung thực).</p>
<h3>Quy trình</h3>
<ol>
<li><strong>Đề xuất (Report 1)</strong> — chọn bài toán và dữ liệu, nêu chỉ số đánh giá và một baseline.</li>
<li><strong>Dữ liệu (Report 2)</strong> — thu thập, làm sạch, chia train/dev/test, tăng cường; ghi rõ rủi ro rò rỉ dữ liệu.</li>
<li><strong>Mô hình &amp; kết quả (Report 3)</strong> — huấn luyện baseline rồi cải thiện (regularize, tinh chỉnh, transfer learning); so sánh bằng bảng chỉ số.</li>
<li><strong>Báo cáo &amp; bảo vệ (Report 4)</strong> — viết báo cáo, trình đường cong học và phân tích lỗi, bảo vệ các lựa chọn.</li>
</ol>
<h3>Thực hành tốt</h3>
<ul>
<li>Cố định <strong>seed</strong> ngẫu nhiên và ghi log mọi thí nghiệm để tái lập được.</li>
<li>Không đụng <strong>tập test</strong> cho tới bước cuối cùng.</li>
<li>Báo cáo trung thực — kèm cả ca thất bại, không chỉ lượt chạy tốt nhất (CLO7).</li>
</ul>
<pre><code class="language-python">from tensorflow import keras

callbacks = [
    keras.callbacks.EarlyStopping(patience=3, restore_best_weights=True),
    keras.callbacks.ModelCheckpoint('best.keras', save_best_only=True),
]
history = model.fit(train_ds, validation_data=dev_ds,
                    epochs=50, callbacks=callbacks)
# Vẽ history.history['loss'] vs ['val_loss'] để đọc bias/variance
</code></pre>
<div class="callout"><span class="badge">Sản phẩm nộp</span> Một notebook tái lập được + báo cáo viết có bảng chỉ số, đường cong học, phân tích lỗi và thảo luận trung thực về hạn chế.</div>`,
  ]]);

const m6q = quiz('dpl302m-quiz-6', 'Quiz 6 — Course project|||Quiz 6 — Đồ án môn học', [
  { id: 'q1', question: 'Nên đụng tập TEST vào lúc nào?|||When should you use the TEST set?', options: ['Sau mỗi epoch|||After every epoch', 'Để chọn siêu tham số|||To pick hyperparameters', 'Chỉ ở bước cuối cùng để báo cáo|||Only at the very end, to report', 'Trước khi huấn luyện|||Before training'], correctIndex: 2, explanation: 'Test set phải giữ nguyên tới cuối; tinh chỉnh trên dev. Đụng test sớm làm ước lượng hiệu năng lạc quan giả.' },
  { id: 'q2', question: 'Đường cong loss train thấp nhưng val_loss cao dần cho thấy?|||Low train loss but rising val_loss indicates?', options: ['Underfit', 'Overfit (variance cao)|||Overfitting (high variance)', 'Learning rate quá nhỏ|||Learning rate too small', 'Dữ liệu quá ít lớp|||Too few classes'], correctIndex: 1, explanation: 'Train giảm còn validation tăng = mô hình học thuộc train → overfit; dùng EarlyStopping / regularization.' },
  { id: 'q3', question: 'Yêu cầu CLO7 khi báo cáo kết quả là?|||What does CLO7 ask for when reporting results?', options: ['Chỉ khoe lượt chạy tốt nhất|||Show only the best run', 'Báo cáo trung thực, kèm ca thất bại & hạn chế|||Report honestly, including failures & limitations', 'Bỏ phân tích lỗi|||Skip error analysis', 'Không cần tái lập|||No need for reproducibility'], correctIndex: 1, explanation: 'CLO7 nhấn mạnh báo cáo và bảo vệ kết quả rõ ràng, trung thực — gồm cả ca thất bại và giới hạn của mô hình.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'DPL302m',
    slug: 'dpl302m-deep-learning',
    title: 'Deep Learning',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/DPL302m.webp',
    shortDescription: 'Deep Learning (DeepLearning.AI, Andrew Ng): neural networks, improving DNNs, ML strategy, CNNs, sequence models & Transformers, plus a course project — in TensorFlow/Keras. Bilingual, with formulas, code & quizzes.|||Học sâu (DeepLearning.AI, Andrew Ng): mạng nơ-ron, cải thiện DNN, chiến lược ML, CNN, mô hình chuỗi & Transformer, kèm đồ án — bằng TensorFlow/Keras. Song ngữ, có công thức, code & quiz.',
    description: 'Môn <strong>DPL302m — Deep Learning (Học sâu)</strong> thuộc ngành AI (6 tín chỉ), tiên quyết <strong>AIL303m</strong>. Bám giáo trình FLM với nguồn chính là <strong>Deep Learning Specialization</strong> (Coursera, Andrew Ng), dùng <strong>TensorFlow/Keras</strong> trên Jupyter/Colab. Nội dung 5 module + đồ án: <strong>mạng nơ-ron &amp; mạng sâu</strong> → <strong>cải thiện DNN</strong> (regularization, tối ưu, tinh chỉnh) → <strong>chiến lược ML</strong> (error analysis, transfer/multi-task) → <strong>CNN</strong> (thị giác, ResNet, YOLO) → <strong>mô hình chuỗi</strong> (RNN/LSTM, attention, Transformer) → <strong>đồ án</strong>. Song ngữ, có công thức, code minh hoạ và quiz mỗi module.',
    whatYouLearn: 'Nơ-ron, forward/backprop, gradient descent, hàm kích hoạt; mạng nông & sâu; train/dev/test, bias/variance, regularization (L2, dropout), khởi tạo He/Xavier, tối ưu (Momentum/RMSprop/Adam), Batch Norm; chiến lược ML (error analysis, phân phối lệch, transfer & multi-task learning); CNN (convolution, padding, stride, pooling, LeNet/VGG/ResNet/Inception, YOLO, face recognition, style transfer); mô hình chuỗi (RNN, LSTM/GRU, word embeddings, attention, Transformer); và đồ án học sâu trọn vẹn bằng TensorFlow/Keras.',
    requirements: 'Đã học AIL303m (Machine Learning): học có giám sát, gradient descent, Python/NumPy. Nên dùng Google Colab hoặc Jupyter (có GPU) với TensorFlow/Keras.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'DeepLearning.AI, TensorFlow/Keras, Goodfellow, d2l.ai, HuggingFace, Colab/Jupyter, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'DL là gì, 7 CLO, cơ cấu điểm, tiên quyết AIL303m.', lessons: [intro] },
    { title: 'Module 1 — Neural Networks & Deep Learning|||Module 1 — Mạng nơ-ron & học sâu', description: 'Nơ-ron, forward/backprop, gradient descent, mạng nông & sâu.', lessons: [m1a, m1b, m1q] },
    { title: 'Module 2 — Improving Deep Neural Networks|||Module 2 — Cải thiện DNN', description: 'Regularization, khởi tạo, tối ưu (Adam), Batch Norm.', lessons: [m2a, m2q] },
    { title: 'Module 3 — Structuring ML Projects|||Module 3 — Chiến lược ML', description: 'Error analysis, phân phối lệch, transfer & multi-task learning.', lessons: [m3a, m3q] },
    { title: 'Module 4 — Convolutional Neural Networks|||Module 4 — Mạng tích chập (CNN)', description: 'Convolution, pooling, ResNet/Inception, YOLO, face recognition, style transfer.', lessons: [m4a, m4b, m4q] },
    { title: 'Module 5 — Sequence Models|||Module 5 — Mô hình chuỗi', description: 'RNN/LSTM/GRU, word embeddings, attention, Transformer.', lessons: [m5a, m5b, m5q] },
    { title: 'Module 6 — Course Project|||Module 6 — Đồ án môn học', description: 'Quy trình đồ án DL: đề xuất → dữ liệu → mô hình → báo cáo & bảo vệ.', lessons: [m6a, m6q] },
  ],
};
