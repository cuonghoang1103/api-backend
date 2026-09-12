/**
 * DPL303m — Deep Learning. Giáo trình FLM. Không slide gốc → soạn từ syllabus
 * (CNN & visual; RNN/NLP/transformers/HuggingFace; ML strategy; TensorFlow project)
 * + kiến thức, song ngữ, code Keras/HF, kèm BÀI TẬP. Giữ NGUYÊN slug. Tiên quyết: AIL304m.
 * ⚠️ code mẫu: KHÔNG backtick/${ }/\n literal.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức module.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('dpl303m-0-1-overview', 'Course overview: Deep Learning|||Tổng quan môn: Học sâu',
  'Mục tiêu, 4 CLO (CNN & thị giác + style transfer; RNN/NLP/word embeddings/transformers/HuggingFace; ML strategy; đồ án TensorFlow), lộ trình, đánh giá. Tiên quyết AIL304m.',
  [[
    `<span class="eyebrow">DPL303m · Lesson 0.1 · Overview</span>
<h2>Deep Learning</h2>
<p class="lead">Deep learning builds on AIL304m: from fully-connected networks to the two architectures that power modern AI — <strong>Convolutional Neural Networks (CNNs)</strong> for images and <strong>sequence models</strong> (RNN → attention → <strong>Transformers</strong>) for text. You'll also use <strong>HuggingFace</strong> and finish with a practical TensorFlow project.</p>
<h3>CLOs</h3>
<ul>
<li><strong>CLO1</strong> — build CNNs for visual detection/recognition; neural style transfer</li>
<li><strong>CLO2</strong> — build &amp; train RNNs; NLP, word embeddings, HuggingFace tokenizers &amp; transformer models</li>
<li><strong>CLO3</strong> — diagnose errors, prioritize fixes; end-to-end, transfer &amp; multi-task learning</li>
<li><strong>CLO4</strong> — a practical project with TensorFlow</li>
</ul>
<div class="callout"><span class="badge">★ Nền</span> Ôn lại AIL304m: gradient descent, forward/backprop, activation, train/dev/test, bias/variance, Adam. DPL303m dùng lại toàn bộ, thêm kiến trúc chuyên cho ảnh và chuỗi.</div>`,
    `<span class="eyebrow">DPL303m · Bài 0.1 · Tổng quan</span>
<h2>Học sâu (Deep Learning)</h2>
<p class="lead">Học sâu nối tiếp AIL304m: từ mạng fully-connected tới hai kiến trúc làm nên AI hiện đại — <strong>Convolutional Neural Networks (CNN)</strong> cho ảnh và <strong>mô hình chuỗi</strong> (RNN → attention → <strong>Transformer</strong>) cho văn bản. Bạn cũng dùng <strong>HuggingFace</strong> và kết bằng một đồ án TensorFlow.</p>
<h3>CLO</h3>
<ul>
<li><strong>CLO1</strong> — xây CNN cho phát hiện/nhận dạng ảnh; neural style transfer</li>
<li><strong>CLO2</strong> — xây &amp; train RNN; NLP, word embeddings, tokenizer HuggingFace &amp; mô hình transformer</li>
<li><strong>CLO3</strong> — chẩn lỗi, ưu tiên sửa; end-to-end, transfer &amp; multi-task learning</li>
<li><strong>CLO4</strong> — một đồ án thực hành với TensorFlow</li>
</ul>
<div class="callout"><span class="badge">★ Nền</span> Ôn lại AIL304m: gradient descent, forward/backprop, activation, train/dev/test, bias/variance, Adam. DPL303m dùng lại toàn bộ, thêm kiến trúc chuyên cho ảnh và chuỗi.</div>`,
  ]]);

/* M1: CNN */
const m1 = doc('dpl303m-1-1-cnn', 'M1.1 — Convolutional Neural Networks (CNN)|||M1.1 — Mạng nơ-ron tích chập (CNN)',
  'Vì sao CNN cho ảnh (chia sẻ trọng số, cục bộ), phép convolution & filter, pooling, kiến trúc (Conv→Pool→Dense), và ứng dụng nhận dạng/phát hiện; kiến trúc kinh điển.',
  [[
    `<span class="eyebrow">DPL303m · Module 1 · Lesson 1.1</span>
<h2>Convolutional Neural Networks</h2>
<p class="lead">A fully-connected net on a 224×224 image needs millions of weights per neuron and ignores spatial structure. <strong>CNNs</strong> fix this with <strong>convolution</strong>: small <strong>filters</strong> slide over the image, sharing weights and detecting local patterns (edges → textures → parts → objects) layer by layer.</p>
<h3>The building blocks</h3>
<ul>
<li><strong>Convolution</strong> — a filter (e.g. 3×3) convolves across the input to produce a <em>feature map</em>; many filters learn many features. Fewer parameters (weight sharing) + translation invariance.</li>
<li><strong>Pooling</strong> — downsample (max-pool 2×2) to shrink maps and add robustness.</li>
<li><strong>Stack</strong> — Conv → ReLU → Pool, repeated, then Dense layers → softmax.</li>
</ul>
<pre><code class="language-python">from tensorflow import keras
model = keras.Sequential([
    keras.layers.Conv2D(32, 3, activation="relu", input_shape=(28,28,1)),
    keras.layers.MaxPooling2D(2),
    keras.layers.Conv2D(64, 3, activation="relu"),
    keras.layers.MaxPooling2D(2),
    keras.layers.Flatten(),
    keras.layers.Dense(10, activation="softmax"),
])
</code></pre>
<p>Classic architectures — <strong>LeNet, AlexNet, VGG, ResNet</strong> (residual connections let very deep nets train) — are the ancestors of today's vision models used for image classification, object detection and segmentation.</p>`,
    `<span class="eyebrow">DPL303m · Module 1 · Bài 1.1</span>
<h2>Mạng nơ-ron tích chập</h2>
<p class="lead">Một mạng fully-connected trên ảnh 224×224 cần hàng triệu trọng số mỗi nơ-ron và bỏ qua cấu trúc không gian. <strong>CNN</strong> chữa bằng <strong>convolution</strong>: các <strong>filter</strong> nhỏ trượt trên ảnh, chia sẻ trọng số và phát hiện mẫu cục bộ (cạnh → texture → bộ phận → vật thể) từng tầng.</p>
<h3>Các khối dựng</h3>
<ul>
<li><strong>Convolution</strong> — một filter (vd 3×3) tích chập trên input tạo một <em>feature map</em>; nhiều filter học nhiều đặc trưng. Ít tham số (chia sẻ trọng số) + bất biến tịnh tiến.</li>
<li><strong>Pooling</strong> — giảm mẫu (max-pool 2×2) để thu nhỏ map và tăng độ bền.</li>
<li><strong>Xếp chồng</strong> — Conv → ReLU → Pool, lặp lại, rồi Dense → softmax.</li>
</ul>
<pre><code class="language-python">from tensorflow import keras
model = keras.Sequential([
    keras.layers.Conv2D(32, 3, activation="relu", input_shape=(28,28,1)),
    keras.layers.MaxPooling2D(2),
    keras.layers.Conv2D(64, 3, activation="relu"),
    keras.layers.MaxPooling2D(2),
    keras.layers.Flatten(),
    keras.layers.Dense(10, activation="softmax"),
])
</code></pre>
<p>Kiến trúc kinh điển — <strong>LeNet, AlexNet, VGG, ResNet</strong> (kết nối residual cho mạng rất sâu train được) — là tổ tiên của các mô hình thị giác hôm nay dùng cho phân loại ảnh, phát hiện vật thể và phân đoạn.</p>`,
  ]]);

const m1b = doc('dpl303m-1-2-transfer-style', 'M1.2 — Transfer learning & neural style transfer|||M1.2 — Transfer learning & neural style transfer',
  'Transfer learning cho thị giác (dùng mạng pre-trained ImageNet, fine-tune), data augmentation; và neural style transfer (nội dung + phong cách) — ý tưởng.',
  [[
    `<span class="eyebrow">DPL303m · Module 1 · Lesson 1.2</span>
<h2>Transfer learning &amp; style transfer</h2>
<h3>Transfer learning (the practical superpower)</h3>
<p>Training a big CNN from scratch needs millions of images. Instead, take a network <strong>pre-trained on ImageNet</strong>, freeze its feature layers, and <strong>fine-tune</strong> a new classifier head on your small dataset. You get strong accuracy with hundreds of images.</p>
<pre><code class="language-python">from tensorflow import keras
base = keras.applications.ResNet50(include_top=False, weights="imagenet",
                                   input_shape=(224,224,3))
base.trainable = False                     # freeze features
model = keras.Sequential([
    base,
    keras.layers.GlobalAveragePooling2D(),
    keras.layers.Dense(num_classes, activation="softmax"),
])
</code></pre>
<p><strong>Data augmentation</strong> (random flips, crops, rotations) further fights overfitting on small datasets.</p>
<h3>Neural style transfer</h3>
<p>Combine the <strong>content</strong> of one image with the <strong>style</strong> of another (turn a photo into a Van Gogh). It optimizes a new image so its deep features match the content image's structure and the style image's texture statistics (Gram matrices) — art generated by gradient descent, no new network trained.</p>`,
    `<span class="eyebrow">DPL303m · Module 1 · Bài 1.2</span>
<h2>Transfer learning &amp; style transfer</h2>
<h3>Transfer learning (siêu năng lực thực tế)</h3>
<p>Train một CNN lớn từ đầu cần hàng triệu ảnh. Thay vào đó, lấy một mạng <strong>pre-trained trên ImageNet</strong>, đóng băng các tầng đặc trưng, và <strong>fine-tune</strong> một đầu phân loại mới trên tập nhỏ của bạn. Bạn đạt độ chính xác cao với vài trăm ảnh.</p>
<pre><code class="language-python">from tensorflow import keras
base = keras.applications.ResNet50(include_top=False, weights="imagenet",
                                   input_shape=(224,224,3))
base.trainable = False                     # đóng băng đặc trưng
model = keras.Sequential([
    base,
    keras.layers.GlobalAveragePooling2D(),
    keras.layers.Dense(num_classes, activation="softmax"),
])
</code></pre>
<p><strong>Data augmentation</strong> (lật, cắt, xoay ngẫu nhiên) chống overfitting thêm trên tập nhỏ.</p>
<h3>Neural style transfer</h3>
<p>Kết hợp <strong>nội dung</strong> của một ảnh với <strong>phong cách</strong> của ảnh khác (biến ảnh chụp thành tranh Van Gogh). Nó tối ưu một ảnh mới sao cho đặc trưng sâu khớp cấu trúc của ảnh nội dung và thống kê texture (ma trận Gram) của ảnh phong cách — nghệ thuật sinh bằng gradient descent, không train mạng mới.</p>`,
  ]]);

const m1q = quiz('dpl303m-quiz-1', 'Quiz M1 — CNN|||Quiz M1 — CNN', [
  { id: 'q1', question: 'Vì sao CNN hợp với ảnh hơn fully-connected?', options: ['Nhanh hơn ngẫu nhiên', 'Chia sẻ trọng số + phát hiện mẫu cục bộ, ít tham số', 'Không cần train', 'Chỉ chạy GPU'], correctIndex: 1, explanation: 'Convolution chia sẻ trọng số, học đặc trưng cục bộ, ít tham số, bất biến tịnh tiến.' },
  { id: 'q2', question: 'Pooling (max-pool) làm gì?', options: ['Tăng kích thước', 'Giảm mẫu feature map, tăng độ bền', 'Thêm tầng Dense', 'Chuẩn hoá'], correctIndex: 1, explanation: 'Pooling giảm chiều không gian, giữ đặc trưng mạnh nhất.' },
  { id: 'q3', question: 'Transfer learning cho thị giác nghĩa là?', options: ['Train từ đầu', 'Dùng mạng pre-train (ImageNet) + fine-tune trên tập nhỏ', 'Chỉ dùng CPU', 'Sao chép ảnh'], correctIndex: 1, explanation: 'Khởi từ mạng đã học ImageNet, fine-tune đầu phân loại — hiệu quả khi ít dữ liệu.' },
]);

/* M2: Sequence models & Transformers */
const m2 = doc('dpl303m-2-1-rnn-embeddings', 'M2.1 — Sequence models: RNN, LSTM & word embeddings|||M2.1 — Mô hình chuỗi: RNN, LSTM & word embeddings',
  'Dữ liệu chuỗi (văn bản/thời gian), RNN & vấn đề vanishing gradient, LSTM/GRU (cổng nhớ), và word embeddings (word2vec) — biểu diễn từ thành vector.',
  [[
    `<span class="eyebrow">DPL303m · Module 2 · Lesson 2.1</span>
<h2>Sequence models &amp; word embeddings</h2>
<p class="lead">Text and time-series are <strong>sequences</strong> where order matters. A <strong>Recurrent Neural Network (RNN)</strong> processes tokens one by one, carrying a hidden state — a memory of what it has seen.</p>
<h3>RNN → LSTM/GRU</h3>
<p>Plain RNNs struggle to remember long-range dependencies (vanishing gradients). <strong>LSTM</strong> and <strong>GRU</strong> add <strong>gates</strong> that learn what to keep, forget and output — enabling much longer memory.</p>
<h3>Word embeddings</h3>
<p>Words must become vectors. One-hot vectors are huge and meaningless; <strong>word embeddings</strong> (word2vec, GloVe) map each word to a dense vector where <em>similar words are near each other</em> — famously <code>king − man + woman ≈ queen</code>. Embeddings are the input layer for NLP models.</p>
<pre><code class="language-python">from tensorflow import keras
model = keras.Sequential([
    keras.layers.Embedding(vocab_size, 128),      # word → 128-dim vector
    keras.layers.LSTM(64),
    keras.layers.Dense(1, activation="sigmoid"),  # e.g. sentiment
])
</code></pre>`,
    `<span class="eyebrow">DPL303m · Module 2 · Bài 2.1</span>
<h2>Mô hình chuỗi &amp; word embeddings</h2>
<p class="lead">Văn bản và chuỗi thời gian là <strong>chuỗi</strong> mà thứ tự quan trọng. Một <strong>Recurrent Neural Network (RNN)</strong> xử lý token từng cái, mang một hidden state — trí nhớ về cái đã thấy.</p>
<h3>RNN → LSTM/GRU</h3>
<p>RNN thường khó nhớ phụ thuộc xa (vanishing gradient). <strong>LSTM</strong> và <strong>GRU</strong> thêm <strong>cổng (gate)</strong> học cái gì giữ, quên và xuất — cho trí nhớ dài hơn nhiều.</p>
<h3>Word embeddings</h3>
<p>Từ phải thành vector. One-hot thì to và vô nghĩa; <strong>word embeddings</strong> (word2vec, GloVe) ánh xạ mỗi từ thành vector dày mà <em>từ giống nhau nằm gần nhau</em> — nổi tiếng <code>king − man + woman ≈ queen</code>. Embeddings là tầng đầu vào cho mô hình NLP.</p>
<pre><code class="language-python">from tensorflow import keras
model = keras.Sequential([
    keras.layers.Embedding(vocab_size, 128),      # từ → vector 128 chiều
    keras.layers.LSTM(64),
    keras.layers.Dense(1, activation="sigmoid"),  # vd sentiment
])
</code></pre>`,
  ]]);

const m2b = doc('dpl303m-2-2-transformers', 'M2.2 — Attention, Transformers & HuggingFace|||M2.2 — Attention, Transformer & HuggingFace',
  'Cơ chế attention (self-attention), kiến trúc Transformer (thay RNN, song song hoá), pretrain+fine-tune (BERT/GPT), và dùng HuggingFace (tokenizer + pipeline).',
  [[
    `<span class="eyebrow">DPL303m · Module 2 · Lesson 2.2</span>
<h2>Attention, Transformers &amp; HuggingFace</h2>
<h3>Attention</h3>
<p><strong>Self-attention</strong> lets each token look at every other token and weight their relevance — so the model captures long-range relationships directly, without RNN's step-by-step memory. This is the key idea of <em>"Attention Is All You Need"</em>.</p>
<h3>Transformers</h3>
<p>A <strong>Transformer</strong> stacks attention + feed-forward layers. Because it processes all tokens in parallel (not one by one), it trains far faster on GPUs and scales to huge models. Pretraining a Transformer on massive text, then fine-tuning, gives <strong>BERT</strong> (understanding), <strong>GPT</strong> (generation) — the backbone of modern NLP and LLMs.</p>
<h3>HuggingFace — use a pretrained model in a few lines</h3>
<pre><code class="language-python">from transformers import pipeline
clf = pipeline("sentiment-analysis")     # downloads a pretrained model
print(clf("I love this course!"))        # [{'label':'POSITIVE','score':0.99}]

# tokenizer: text → token ids the model expects
from transformers import AutoTokenizer
tok = AutoTokenizer.from_pretrained("bert-base-uncased")
print(tok("hello world"))                # input_ids, attention_mask
</code></pre>
<p><strong>Tokenizers</strong> split text into sub-word tokens and map them to ids; <strong>pipelines</strong> wrap a pretrained model for a task (classification, QA, summarization) so you get strong results without training — the fastest path to a working NLP app.</p>`,
    `<span class="eyebrow">DPL303m · Module 2 · Bài 2.2</span>
<h2>Attention, Transformer &amp; HuggingFace</h2>
<h3>Attention</h3>
<p><strong>Self-attention</strong> cho mỗi token nhìn mọi token khác và gán trọng số mức liên quan — nên mô hình nắm quan hệ xa trực tiếp, không cần trí nhớ từng bước như RNN. Đây là ý tưởng cốt lõi của <em>"Attention Is All You Need"</em>.</p>
<h3>Transformer</h3>
<p>Một <strong>Transformer</strong> xếp chồng attention + feed-forward. Vì xử lý mọi token song song (không từng cái), nó train nhanh hơn nhiều trên GPU và mở rộng tới mô hình khổng lồ. Pretrain một Transformer trên văn bản cực lớn rồi fine-tune cho <strong>BERT</strong> (hiểu), <strong>GPT</strong> (sinh) — xương sống của NLP hiện đại và LLM.</p>
<h3>HuggingFace — dùng mô hình pretrained trong vài dòng</h3>
<pre><code class="language-python">from transformers import pipeline
clf = pipeline("sentiment-analysis")     # tải một mô hình pretrained
print(clf("I love this course!"))        # [{'label':'POSITIVE','score':0.99}]

# tokenizer: text → token id mô hình cần
from transformers import AutoTokenizer
tok = AutoTokenizer.from_pretrained("bert-base-uncased")
print(tok("hello world"))                # input_ids, attention_mask
</code></pre>
<p><strong>Tokenizer</strong> tách văn bản thành token sub-word và ánh xạ sang id; <strong>pipeline</strong> bọc một mô hình pretrained cho một tác vụ (phân loại, hỏi-đáp, tóm tắt) để bạn có kết quả mạnh không cần train — đường nhanh nhất tới một app NLP chạy được.</p>`,
  ]]);

const m2e = doc('dpl303m-2-3-exercise', 'Exercise 1 — sentiment with HuggingFace|||Bài tập 1 — sentiment với HuggingFace',
  'Bài tập: dùng pipeline HuggingFace phân loại cảm xúc một danh sách câu và in nhãn+điểm; kèm lời giải.',
  [[
    `<span class="eyebrow">DPL303m · Module 2 · Exercise</span>
<h2>Exercise 1 — batch sentiment analysis</h2>
<div class="callout"><span class="badge">Đề</span> Use a HuggingFace pipeline to classify the sentiment of several sentences and print each label with its confidence.</div>
<h3>Worked solution</h3>
<pre><code class="language-python">from transformers import pipeline
clf = pipeline("sentiment-analysis")

reviews = [
    "The lectures are clear and well organized.",
    "I could not finish the assignment, too confusing.",
    "It is okay, nothing special.",
]
for text, out in zip(reviews, clf(reviews)):
    print(f"{out['label']} ({out['score']:.2f})  <- {text}")
</code></pre>
<p><strong>Why:</strong> the pipeline downloads a pretrained Transformer and handles tokenization + inference; passing a list runs a batch. You built a working sentiment classifier without training anything — the power of pretraining + transfer learning applied to NLP.</p>`,
    `<span class="eyebrow">DPL303m · Module 2 · Bài tập</span>
<h2>Bài tập 1 — phân tích cảm xúc theo lô</h2>
<div class="callout"><span class="badge">Đề</span> Dùng một pipeline HuggingFace phân loại cảm xúc vài câu và in mỗi nhãn kèm độ tin cậy.</div>
<h3>Lời giải</h3>
<pre><code class="language-python">from transformers import pipeline
clf = pipeline("sentiment-analysis")

reviews = [
    "The lectures are clear and well organized.",
    "I could not finish the assignment, too confusing.",
    "It is okay, nothing special.",
]
for text, out in zip(reviews, clf(reviews)):
    print(f"{out['label']} ({out['score']:.2f})  <- {text}")
</code></pre>
<p><strong>Vì sao:</strong> pipeline tải một Transformer pretrained và lo tokenization + suy luận; truyền một list chạy theo lô. Bạn dựng một bộ phân loại cảm xúc chạy được mà không train gì — sức mạnh của pretraining + transfer learning áp cho NLP.</p>`,
  ]]);

const m2q = quiz('dpl303m-quiz-2', 'Quiz M2 — Sequences & Transformers|||Quiz M2 — Chuỗi & Transformer', [
  { id: 'q1', question: 'LSTM/GRU cải thiện RNN thường ở điểm?', options: ['Nhanh hơn', 'Cổng nhớ → nhớ phụ thuộc dài, giảm vanishing gradient', 'Không cần train', 'Chỉ cho ảnh'], correctIndex: 1, explanation: 'Gate của LSTM/GRU học giữ/quên → trí nhớ dài hơn.' },
  { id: 'q2', question: 'Ý tưởng cốt lõi của Transformer?', options: ['Convolution', 'Self-attention (mỗi token nhìn mọi token)', 'Pooling', 'One-hot'], correctIndex: 1, explanation: 'Self-attention nắm quan hệ xa, xử lý song song, thay RNN.' },
  { id: 'q3', question: 'HuggingFace pipeline("sentiment-analysis") cho phép?', options: ['Train từ đầu', 'Dùng ngay mô hình pretrained không cần train', 'Chỉ tokenize', 'Vẽ đồ thị'], correctIndex: 1, explanation: 'Pipeline bọc mô hình pretrained → dùng ngay.' },
]);

/* M3: strategy + practical */
const m3 = doc('dpl303m-3-1-strategy-project', 'M3.1 — ML strategy & the TensorFlow project|||M3.1 — ML strategy & đồ án TensorFlow',
  'Chẩn lỗi & ưu tiên (bias/variance trên dữ liệu thật), transfer/multi-task/end-to-end learning; và quy trình một đồ án deep learning end-to-end với TensorFlow.',
  [[
    `<span class="eyebrow">DPL303m · Module 3 · Lesson 3.1</span>
<h2>ML strategy &amp; your project</h2>
<h3>Strategy for deep learning systems</h3>
<p>Same discipline as AIL304m, applied at scale: pick a <strong>single metric</strong>, do <strong>error analysis</strong> on real failures, match <strong>train/dev/test</strong> to production data, and prefer <strong>transfer learning</strong> (start from a pretrained model) over training from scratch. Consider <strong>end-to-end</strong> vs a pipeline, and <strong>multi-task</strong> learning when labels are related.</p>
<h3>A deep-learning project, end to end</h3>
<ol>
<li><strong>Define</strong> the task &amp; metric; get and split data (train/dev/test).</li>
<li><strong>Baseline</strong> — a simple model first, to beat.</li>
<li><strong>Preprocess &amp; augment</strong> — normalize; augment images/text.</li>
<li><strong>Model</strong> — pick CNN/Transformer or a pretrained backbone; train with Adam, watch dev metric.</li>
<li><strong>Diagnose</strong> — bias vs variance; iterate.</li>
<li><strong>Evaluate</strong> once on the held-out test set; <strong>deploy</strong> (save the model, wrap in an API/app).</li>
</ol>
<div class="callout"><span class="badge">★ Thực tế</span> Đừng bắt đầu bằng mô hình phức tạp. <b>Baseline đơn giản → đo → cải thiện theo chẩn đoán</b> tiết kiệm hàng tuần so với "thử mọi kiến trúc" mù.</div>`,
    `<span class="eyebrow">DPL303m · Module 3 · Bài 3.1</span>
<h2>ML strategy &amp; đồ án của bạn</h2>
<h3>Strategy cho hệ deep learning</h3>
<p>Cùng kỷ luật như AIL304m, áp ở quy mô lớn: chọn <strong>một metric</strong>, làm <strong>error analysis</strong> trên các ca thất bại thật, khớp <strong>train/dev/test</strong> với dữ liệu production, và ưu tiên <strong>transfer learning</strong> (khởi từ mô hình pretrained) hơn train từ đầu. Cân <strong>end-to-end</strong> vs pipeline, và <strong>multi-task</strong> khi các nhãn liên quan.</p>
<h3>Một đồ án deep learning, đầu-cuối</h3>
<ol>
<li><strong>Định nghĩa</strong> tác vụ &amp; metric; lấy và chia dữ liệu (train/dev/test).</li>
<li><strong>Baseline</strong> — mô hình đơn giản trước, để vượt qua.</li>
<li><strong>Tiền xử lý &amp; augment</strong> — chuẩn hoá; augment ảnh/văn bản.</li>
<li><strong>Mô hình</strong> — chọn CNN/Transformer hoặc backbone pretrained; train với Adam, xem metric dev.</li>
<li><strong>Chẩn đoán</strong> — bias vs variance; lặp.</li>
<li><strong>Đánh giá</strong> một lần trên test set giữ riêng; <strong>deploy</strong> (lưu mô hình, bọc vào API/app).</li>
</ol>
<div class="callout"><span class="badge">★ Thực tế</span> Đừng bắt đầu bằng mô hình phức tạp. <b>Baseline đơn giản → đo → cải thiện theo chẩn đoán</b> tiết kiệm hàng tuần so với "thử mọi kiến trúc" mù.</div>`,
  ]]);

const m3q = quiz('dpl303m-quiz-3', 'Quiz M3 — Strategy & project|||Quiz M3 — Strategy & đồ án', [
  { id: 'q1', question: 'Bước đầu nên có trong một đồ án DL?', options: ['Mô hình phức tạp nhất', 'Một baseline đơn giản để vượt qua', 'Deploy ngay', 'Bỏ qua chia dữ liệu'], correctIndex: 1, explanation: 'Baseline đơn giản cho mốc so sánh; cải thiện theo chẩn đoán.' },
  { id: 'q2', question: 'Test set nên được đánh giá?', options: ['Mỗi epoch', 'MỘT lần ở cuối (giữ riêng)', 'Không bao giờ', 'Trước khi train'], correctIndex: 1, explanation: 'Test set giữ riêng, đánh giá cuối để ước lượng không thiên vị.' },
  { id: 'q3', question: 'Với ít dữ liệu, nên?', options: ['Train từ đầu mạng lớn', 'Transfer learning từ mô hình pretrained', 'Bỏ dev set', 'Tăng learning rate cực lớn'], correctIndex: 1, explanation: 'Transfer learning tận dụng mô hình đã học tập lớn → hiệu quả khi ít dữ liệu.' },
]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'DPL303m',
    slug: 'dpl303m-deep-learning',
    title: 'Deep Learning',
    level: 'ADVANCED',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/DPL303m.webp',
    shortDescription: 'From CNNs for vision to Transformers for language — convolution, transfer learning, RNN/LSTM, word embeddings, attention & HuggingFace, plus ML strategy. Bilingual, with Keras/HF code & exercises.|||Từ CNN cho thị giác tới Transformer cho ngôn ngữ — convolution, transfer learning, RNN/LSTM, word embeddings, attention & HuggingFace, cùng ML strategy. Song ngữ, code Keras/HF & bài tập.',
    description: 'Môn <strong>DPL303m — Học sâu (Deep Learning)</strong> (ngành AI/SE combo, kỳ 7), nối tiếp AIL304m. Hai kiến trúc trụ cột: <strong>CNN</strong> cho ảnh (convolution/pooling, kiến trúc kinh điển, transfer learning, neural style transfer) và <strong>mô hình chuỗi</strong> cho văn bản (RNN/LSTM, word embeddings, attention, <strong>Transformer</strong>, <strong>HuggingFace</strong>), cộng <strong>ML strategy</strong> và một đồ án TensorFlow. Bám giáo trình FLM (4 CLO), song ngữ, code Keras/HuggingFace và bài tập.',
    whatYouLearn: 'CNN (convolution, pooling, LeNet/VGG/ResNet, phát hiện/nhận dạng); transfer learning & data augmentation; neural style transfer; RNN/LSTM/GRU; word embeddings (word2vec); attention & Transformer (BERT/GPT); HuggingFace (tokenizer, pipeline); ML strategy (error analysis, transfer/multi-task/end-to-end); quy trình đồ án TensorFlow end-to-end.',
    requirements: 'Đã học AIL304m (Machine Learning). Cần Python + TensorFlow/Keras + transformers (HuggingFace); nên dùng GPU (Google Colab).',
  },
  sections: [
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Nối tiếp AIL304m, 4 CLO, lộ trình.', lessons: [intro] },
    { title: 'Module 1 — CNN (thị giác)|||Module 1 — CNN (vision)', description: 'Convolution/pooling, transfer learning, style transfer.', lessons: [m1, m1b, m1q] },
    { title: 'Module 2 — Chuỗi & Transformer|||Module 2 — Sequences & Transformers', description: 'RNN/LSTM, embeddings, attention, HuggingFace.', lessons: [m2, m2b, m2e, m2q] },
    { title: 'Module 3 — Strategy & đồ án|||Module 3 — Strategy & project', description: 'Error analysis, quy trình đồ án TensorFlow.', lessons: [m3, m3q] },
  ],
};
