/**
 * GAI401 — Generative AI (Trí tuệ nhân tạo tạo sinh). Ngành Khoa học Máy tính
 * FPTU, Kỳ 7. Khung chuẩn quốc tế: Foster "Generative Deep Learning", Vaswani
 * "Attention is All You Need", Hugging Face course, Goodfellow "Deep Learning",
 * OpenAI/Anthropic docs. 8 chương, song ngữ, có khối pre-code Python/HF.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${ lồng; & → &amp;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('gai401-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách, khoá học miễn phí (Hugging Face), tài liệu chính thức, YouTube, công cụ, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">GAI401 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Generative AI</strong> — from generative models, Transformers and large language models to diffusion image generation, prompting and AI safety — in one place. The official slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU syllabus &amp; lecture slides for GAI401 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://www.oreilly.com/library/view/generative-deep-learning/9781098134174/" target="_blank" rel="noopener">David Foster — <em>Generative Deep Learning</em> (O'Reilly)</a></li>
<li><a href="https://www.deeplearningbook.org/" target="_blank" rel="noopener">Goodfellow, Bengio &amp; Courville — <em>Deep Learning</em> (free online)</a></li>
<li><a href="https://arxiv.org/abs/1706.03762" target="_blank" rel="noopener">Vaswani et al. — <em>Attention is All You Need</em> (the Transformer paper)</a></li>
</ul>
<h3>🌐 Free courses / official docs</h3>
<ul>
<li><a href="https://huggingface.co/learn" target="_blank" rel="noopener">Hugging Face — NLP &amp; LLM courses (free)</a></li>
<li><a href="https://platform.openai.com/docs" target="_blank" rel="noopener">OpenAI API documentation</a></li>
<li><a href="https://docs.anthropic.com/" target="_blank" rel="noopener">Anthropic (Claude) documentation</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@3blue1brown" target="_blank" rel="noopener">3Blue1Brown</a> — neural networks &amp; Transformers, visually</li>
<li><a href="https://www.youtube.com/@AndrejKarpathy" target="_blank" rel="noopener">Andrej Karpathy</a> — build a GPT from scratch</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://huggingface.co/models" target="_blank" rel="noopener">Hugging Face Hub</a> — thousands of open models &amp; datasets</li>
<li><a href="https://colab.research.google.com/" target="_blank" rel="noopener">Google Colab</a> — free GPU notebooks for training/inference</li>
<li><a href="https://ollama.com/" target="_blank" rel="noopener">Ollama</a> — run open LLMs locally</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — what generative vs discriminative means, neural networks, embeddings, training &amp; loss.</li>
<li><strong>Core models</strong> — autoencoders/VAE/GAN, then Transformers &amp; attention, then large language models.</li>
<li><strong>Applied</strong> — prompt engineering, few-shot, RAG and fine-tuning (LoRA); diffusion image generation.</li>
<li><strong>Responsible</strong> — evaluation, hallucination, bias, safety, copyright, and real-world applications.</li>
</ol></div>`,
    `<span class="eyebrow">GAI401 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Generative AI (AI tạo sinh)</strong> — từ mô hình sinh, Transformer và mô hình ngôn ngữ lớn đến sinh ảnh diffusion, prompt và an toàn AI — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của GAI401 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://www.oreilly.com/library/view/generative-deep-learning/9781098134174/" target="_blank" rel="noopener">David Foster — <em>Generative Deep Learning</em> (O'Reilly)</a></li>
<li><a href="https://www.deeplearningbook.org/" target="_blank" rel="noopener">Goodfellow, Bengio &amp; Courville — <em>Deep Learning</em> (đọc online miễn phí)</a></li>
<li><a href="https://arxiv.org/abs/1706.03762" target="_blank" rel="noopener">Vaswani et al. — <em>Attention is All You Need</em> (bài báo Transformer)</a></li>
</ul>
<h3>🌐 Khoá học miễn phí / tài liệu chính thức</h3>
<ul>
<li><a href="https://huggingface.co/learn" target="_blank" rel="noopener">Hugging Face — khoá NLP &amp; LLM (miễn phí)</a></li>
<li><a href="https://platform.openai.com/docs" target="_blank" rel="noopener">Tài liệu API OpenAI</a></li>
<li><a href="https://docs.anthropic.com/" target="_blank" rel="noopener">Tài liệu Anthropic (Claude)</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@3blue1brown" target="_blank" rel="noopener">3Blue1Brown</a> — mạng nơ-ron &amp; Transformer bằng hình ảnh</li>
<li><a href="https://www.youtube.com/@AndrejKarpathy" target="_blank" rel="noopener">Andrej Karpathy</a> — tự dựng một GPT từ đầu</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://huggingface.co/models" target="_blank" rel="noopener">Hugging Face Hub</a> — hàng nghìn mô hình &amp; bộ dữ liệu mở</li>
<li><a href="https://colab.research.google.com/" target="_blank" rel="noopener">Google Colab</a> — notebook GPU miễn phí để huấn luyện/suy luận</li>
<li><a href="https://ollama.com/" target="_blank" rel="noopener">Ollama</a> — chạy LLM mở ngay trên máy</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — phân biệt sinh (generative) vs phân loại (discriminative), mạng nơ-ron, embedding, huấn luyện &amp; hàm mất mát.</li>
<li><strong>Mô hình lõi</strong> — autoencoder/VAE/GAN, rồi Transformer &amp; attention, rồi mô hình ngôn ngữ lớn.</li>
<li><strong>Ứng dụng</strong> — prompt engineering, few-shot, RAG và fine-tuning (LoRA); sinh ảnh diffusion.</li>
<li><strong>Có trách nhiệm</strong> — đánh giá, ảo giác, thiên lệch, an toàn, bản quyền, và ứng dụng thực tế.</li>
</ol></div>`,
  ]]);

const intro = doc('gai401-0-1-overview', 'Course overview: Generative AI|||Tổng quan: Trí tuệ nhân tạo tạo sinh',
  'Generative AI là gì; vì sao bùng nổ; lộ trình: nền tảng → mô hình sinh cổ điển → Transformer → LLM → prompt/fine-tune → sinh ảnh → đánh giá & đạo đức.',
  [[
    `<span class="eyebrow">GAI401 · Lesson 0.1 · Overview</span>
<h2>Generative AI</h2>
<p class="lead">This course explains <strong>how machines create new content</strong> — text, images, audio and code. You will learn the models behind ChatGPT, Claude, Stable Diffusion and DALL-E, from the mathematics of neural networks up to prompting, fine-tuning and responsible use.</p>
<h3>Two families of models</h3>
<ul>
<li><strong>Discriminative</strong> — learns a boundary to <em>classify</em> or predict a label (spam vs not-spam). It answers "which class?".</li>
<li><strong>Generative</strong> — learns the <em>distribution</em> of the data itself, so it can <em>sample</em> brand-new examples. It answers "what does a plausible example look like?".</li>
</ul>
<h3>Why now</h3>
<p>Three forces converged: the <strong>Transformer</strong> architecture (2017), <strong>scale</strong> (more data, parameters and compute), and <strong>self-supervised pretraining</strong> (learning from raw text/images with no manual labels).</p>
<h3>Roadmap</h3>
<p>Foundations (deep learning &amp; embeddings) → classic generative models (autoencoder, VAE, GAN) → Transformers &amp; attention → large language models → prompting &amp; fine-tuning (RAG, LoRA) → image &amp; multimodal generation → evaluation, ethics &amp; applications. Bilingual, with Python/Hugging Face code examples and a quiz per chapter.</p>`,
    `<span class="eyebrow">GAI401 · Bài 0.1 · Tổng quan</span>
<h2>Trí tuệ nhân tạo tạo sinh</h2>
<p class="lead">Môn này giải thích <strong>máy tạo ra nội dung mới thế nào</strong> — văn bản, hình ảnh, âm thanh và mã. Bạn sẽ học các mô hình đứng sau ChatGPT, Claude, Stable Diffusion và DALL-E, từ toán của mạng nơ-ron đến prompt, fine-tuning và cách dùng có trách nhiệm.</p>
<h3>Hai họ mô hình</h3>
<ul>
<li><strong>Phân loại (discriminative)</strong> — học một ranh giới để <em>phân loại</em> hoặc dự đoán nhãn (spam hay không). Nó trả lời "thuộc lớp nào?".</li>
<li><strong>Sinh (generative)</strong> — học chính <em>phân phối</em> của dữ liệu, nên có thể <em>lấy mẫu</em> ra ví dụ hoàn toàn mới. Nó trả lời "một ví dụ hợp lý trông thế nào?".</li>
</ul>
<h3>Vì sao bùng nổ lúc này</h3>
<p>Ba lực gặp nhau: kiến trúc <strong>Transformer</strong> (2017), <strong>quy mô</strong> (nhiều dữ liệu, tham số và sức tính hơn), và <strong>tiền huấn luyện tự giám sát</strong> (học từ văn bản/ảnh thô, không cần gán nhãn tay).</p>
<h3>Lộ trình</h3>
<p>Nền tảng (học sâu &amp; embedding) → mô hình sinh cổ điển (autoencoder, VAE, GAN) → Transformer &amp; attention → mô hình ngôn ngữ lớn → prompt &amp; fine-tuning (RAG, LoRA) → sinh ảnh &amp; đa phương thức → đánh giá, đạo đức &amp; ứng dụng. Song ngữ, có ví dụ Python/Hugging Face và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('gai401-1-1-what-is-genai', '1.1 — What is Generative AI|||1.1 — Generative AI là gì',
  'Sinh vs phân loại (mô hình hoá P(x) thay vì P(y|x)), lịch sử ngắn, các loại nội dung sinh được, và bản đồ (landscape) hệ sinh thái hiện nay.',
  [[
    `<span class="eyebrow">GAI401 · Chapter 1 · Lesson 1.1</span>
<h2>What is Generative AI</h2>
<h3>Modelling the data, not just the label</h3>
<p>A discriminative model estimates <code>P(y | x)</code> — the probability of a label given an input. A generative model estimates <code>P(x)</code> (or <code>P(x | condition)</code>) — the probability of the data itself — so you can <strong>sample</strong> new points from it. That single shift is what lets a model write a paragraph or paint an image instead of only labelling one.</p>
<h3>A short history</h3>
<ul>
<li><strong>2013-2014</strong> — VAEs and GANs make neural image generation practical.</li>
<li><strong>2017</strong> — the Transformer replaces recurrence with attention.</li>
<li><strong>2018-2020</strong> — GPT and BERT show pretraining + scale works; GPT-3 has 175B parameters.</li>
<li><strong>2022 onward</strong> — diffusion image models and chat-tuned LLMs reach the public.</li>
</ul>
<h3>What can be generated</h3>
<p>Text, code, images, audio/music, video and 3D — often <strong>multimodal</strong> (one model handling several of these).</p>
<pre><code># A first "generation": sampling from a distribution
import numpy as np
rng = np.random.default_rng(0)

# A generative model learns this distribution, then SAMPLES from it
samples = rng.normal(loc=0.0, scale=1.0, size=5)
print(samples)   # five brand-new values the model "made up"
</code></pre>
<div class="callout"><span class="badge">Key idea</span> Discriminative = draw the boundary between classes. Generative = learn what the data looks like, then create more of it.</div>`,
    `<span class="eyebrow">GAI401 · Chương 1 · Bài 1.1</span>
<h2>Generative AI là gì</h2>
<h3>Mô hình hoá dữ liệu, không chỉ nhãn</h3>
<p>Mô hình phân loại ước lượng <code>P(y | x)</code> — xác suất nhãn khi biết đầu vào. Mô hình sinh ước lượng <code>P(x)</code> (hoặc <code>P(x | điều kiện)</code>) — xác suất của chính dữ liệu — nên bạn có thể <strong>lấy mẫu</strong> điểm mới từ nó. Chính bước chuyển đó cho phép mô hình viết một đoạn văn hay vẽ một bức ảnh, thay vì chỉ gán nhãn.</p>
<h3>Lịch sử ngắn</h3>
<ul>
<li><strong>2013-2014</strong> — VAE và GAN đưa việc sinh ảnh bằng nơ-ron vào thực tế.</li>
<li><strong>2017</strong> — Transformer thay hồi quy bằng attention.</li>
<li><strong>2018-2020</strong> — GPT và BERT chứng minh tiền huấn luyện + quy mô hiệu quả; GPT-3 có 175 tỉ tham số.</li>
<li><strong>Từ 2022</strong> — mô hình sinh ảnh diffusion và LLM tinh chỉnh hội thoại đến với đại chúng.</li>
</ul>
<h3>Sinh được những gì</h3>
<p>Văn bản, mã, hình ảnh, âm thanh/nhạc, video và 3D — thường là <strong>đa phương thức</strong> (một mô hình xử lý nhiều loại).</p>
<pre><code># "Sinh" đầu tiên: lấy mẫu từ một phân phối
import numpy as np
rng = np.random.default_rng(0)

# Mô hình sinh học phân phối này, rồi LẤY MẪU từ nó
samples = rng.normal(loc=0.0, scale=1.0, size=5)
print(samples)   # năm giá trị hoàn toàn mới mô hình "bịa" ra
</code></pre>
<div class="callout"><span class="badge">Ý chính</span> Phân loại = vẽ ranh giới giữa các lớp. Sinh = học dữ liệu trông thế nào, rồi tạo thêm.</div>`,
  ]]);

const c1q = quiz('gai401-quiz-1', 'Quiz 1 — What is GenAI|||Quiz 1 — GenAI là gì', [
  { id: 'q1', question: 'Mô hình sinh (generative) mô hình hoá cái gì?', options: ['P(y|x) — nhãn khi biết đầu vào', 'P(x) — phân phối của chính dữ liệu', 'Chỉ độ chính xác', 'Ranh giới lớp'], correctIndex: 1, explanation: 'Mô hình sinh học P(x) nên có thể lấy mẫu dữ liệu mới.' },
  { id: 'q2', question: 'Khác biệt cốt lõi giữa sinh và phân loại?', options: ['Sinh tạo ra ví dụ mới; phân loại gán nhãn', 'Sinh nhanh hơn', 'Phân loại cần nhiều dữ liệu hơn', 'Không có khác biệt'], correctIndex: 0, explanation: 'Sinh tạo nội dung mới; phân loại chỉ chọn lớp.' },
  { id: 'q3', question: 'Kiến trúc nào (2017) mở đường cho LLM hiện đại?', options: ['GAN', 'Transformer', 'Autoencoder', 'Cây quyết định'], correctIndex: 1, explanation: 'Transformer (Attention is All You Need, 2017) là nền của LLM.' },
]);

const c2 = doc('gai401-2-1-deep-learning', '2.1 — Deep learning foundations|||2.1 — Nền tảng học sâu',
  'Ôn nhanh: nơ-ron & mạng nhiều lớp, hàm kích hoạt, embedding (biểu diễn vector), hàm mất mát, gradient descent & backpropagation.',
  [[
    `<span class="eyebrow">GAI401 · Chapter 2 · Lesson 2.1</span>
<h2>Deep learning foundations</h2>
<h3>Neurons and layers</h3>
<p>A neural network stacks simple units: each computes <code>y = activation(W·x + b)</code>. Stacking many layers with non-linear activations (ReLU, GELU) lets the network approximate very complex functions.</p>
<h3>Embeddings</h3>
<p>An <strong>embedding</strong> turns a discrete token (a word, a pixel patch) into a dense vector where <em>meaning becomes geometry</em> — similar things sit close together. Embeddings are the input to almost every generative model.</p>
<h3>Training: loss, gradients, backprop</h3>
<ul>
<li><strong>Loss</strong> — a number measuring how wrong the output is (cross-entropy for text, MSE for continuous values).</li>
<li><strong>Gradient descent</strong> — nudge each weight in the direction that lowers the loss.</li>
<li><strong>Backpropagation</strong> — the chain rule that computes those gradients efficiently.</li>
</ul>
<pre><code>import torch
import torch.nn as nn

net = nn.Sequential(nn.Linear(8, 16), nn.ReLU(), nn.Linear(16, 4))
loss_fn = nn.CrossEntropyLoss()
opt = torch.optim.Adam(net.parameters(), lr=1e-3)

x = torch.randn(32, 8)
y = torch.randint(0, 4, (32,))
loss = loss_fn(net(x), y)   # 1) forward
loss.backward()             # 2) backprop: compute gradients
opt.step()                  # 3) update weights
</code></pre>
<div class="callout"><span class="badge">The training loop</span> forward → loss → backward → step. Every model in this course, however large, is trained by repeating exactly these four moves.</div>`,
    `<span class="eyebrow">GAI401 · Chương 2 · Bài 2.1</span>
<h2>Nền tảng học sâu</h2>
<h3>Nơ-ron và các lớp</h3>
<p>Mạng nơ-ron xếp chồng các đơn vị đơn giản: mỗi đơn vị tính <code>y = activation(W·x + b)</code>. Chồng nhiều lớp với hàm kích hoạt phi tuyến (ReLU, GELU) giúp mạng xấp xỉ được hàm rất phức tạp.</p>
<h3>Embedding</h3>
<p><strong>Embedding</strong> biến một token rời rạc (một từ, một mảnh ảnh) thành vector dày, nơi <em>ý nghĩa trở thành hình học</em> — thứ giống nhau nằm gần nhau. Embedding là đầu vào của gần như mọi mô hình sinh.</p>
<h3>Huấn luyện: mất mát, gradient, backprop</h3>
<ul>
<li><strong>Hàm mất mát (loss)</strong> — con số đo mức sai của đầu ra (cross-entropy cho văn bản, MSE cho giá trị liên tục).</li>
<li><strong>Gradient descent</strong> — đẩy mỗi trọng số theo hướng làm giảm mất mát.</li>
<li><strong>Backpropagation</strong> — quy tắc chuỗi tính các gradient đó một cách hiệu quả.</li>
</ul>
<pre><code>import torch
import torch.nn as nn

net = nn.Sequential(nn.Linear(8, 16), nn.ReLU(), nn.Linear(16, 4))
loss_fn = nn.CrossEntropyLoss()
opt = torch.optim.Adam(net.parameters(), lr=1e-3)

x = torch.randn(32, 8)
y = torch.randint(0, 4, (32,))
loss = loss_fn(net(x), y)   # 1) lan truyền xuôi
loss.backward()             # 2) backprop: tính gradient
opt.step()                  # 3) cập nhật trọng số
</code></pre>
<div class="callout"><span class="badge">Vòng lặp huấn luyện</span> xuôi → mất mát → ngược → cập nhật. Mọi mô hình trong môn này, dù lớn cỡ nào, đều được huấn luyện bằng cách lặp lại đúng bốn bước đó.</div>`,
  ]]);

const c2q = quiz('gai401-quiz-2', 'Quiz 2 — Deep learning|||Quiz 2 — Học sâu', [
  { id: 'q1', question: 'Embedding là gì?', options: ['Một hàm mất mát', 'Vector dày biểu diễn token, ý nghĩa gần nhau nằm gần nhau', 'Một thuật toán sắp xếp', 'Tên của một GPU'], correctIndex: 1, explanation: 'Embedding biến token rời rạc thành vector, ngữ nghĩa thành hình học.' },
  { id: 'q2', question: 'Thứ tự đúng của một bước huấn luyện?', options: ['backward → forward → step', 'forward → loss → backward → step', 'step → loss → forward', 'loss → step → backward'], correctIndex: 1, explanation: 'Lan truyền xuôi, tính mất mát, backprop, rồi cập nhật trọng số.' },
  { id: 'q3', question: 'Backpropagation dùng để?', options: ['Vẽ đồ thị', 'Tính gradient của mất mát theo trọng số', 'Nén dữ liệu', 'Tăng learning rate'], correctIndex: 1, explanation: 'Backprop áp dụng quy tắc chuỗi để tính gradient hiệu quả.' },
]);

const c3 = doc('gai401-3-1-classic-gen-models', '3.1 — Classic generative models|||3.1 — Mô hình sinh cổ điển',
  'Autoencoder (nén-giải nén), VAE (không gian ẩn có cấu trúc để lấy mẫu), GAN (generator vs discriminator) — nguyên lý và điểm mạnh/yếu.',
  [[
    `<span class="eyebrow">GAI401 · Chapter 3 · Lesson 3.1</span>
<h2>Classic generative models</h2>
<h3>Autoencoder</h3>
<p>An <strong>autoencoder</strong> squeezes an input through a narrow <em>bottleneck</em> (encoder) and reconstructs it (decoder). The bottleneck learns a compact code — but a plain autoencoder cannot reliably <em>generate</em> new samples, because its latent space has holes.</p>
<h3>Variational Autoencoder (VAE)</h3>
<p>A <strong>VAE</strong> forces the latent space to follow a smooth distribution (a Gaussian). Because the space is continuous and structured, you can <strong>sample</strong> a random latent vector and decode it into a plausible new example.</p>
<h3>Generative Adversarial Network (GAN)</h3>
<p>A <strong>GAN</strong> pits two networks against each other: a <strong>generator</strong> that fabricates fakes and a <strong>discriminator</strong> that tries to tell real from fake. They improve together until the fakes look real. GANs produce sharp images but can be unstable to train.</p>
<pre><code># VAE loss = reconstruction + KL (keep latent close to a Gaussian)
def vae_loss(x, x_hat, mu, logvar):
    recon = ((x - x_hat) ** 2).mean()
    kl = -0.5 * (1 + logvar - mu.pow(2) - logvar.exp()).mean()
    return recon + kl
</code></pre>
<div class="callout"><span class="badge">Trade-off</span> VAEs give a smooth, samplable latent space but blurrier output; GANs give sharp output but trickier training. Both ideas feed into modern diffusion models.</div>`,
    `<span class="eyebrow">GAI401 · Chương 3 · Bài 3.1</span>
<h2>Mô hình sinh cổ điển</h2>
<h3>Autoencoder</h3>
<p><strong>Autoencoder</strong> ép đầu vào qua một <em>nút thắt</em> hẹp (encoder) rồi tái dựng lại (decoder). Nút thắt học được một mã gọn — nhưng autoencoder thuần không <em>sinh</em> mẫu mới đáng tin, vì không gian ẩn của nó có lỗ hổng.</p>
<h3>Autoencoder biến phân (VAE)</h3>
<p><strong>VAE</strong> buộc không gian ẩn tuân theo một phân phối trơn (Gaussian). Vì không gian liên tục và có cấu trúc, bạn có thể <strong>lấy mẫu</strong> một vector ẩn ngẫu nhiên rồi giải mã thành ví dụ mới hợp lý.</p>
<h3>Mạng đối kháng sinh (GAN)</h3>
<p><strong>GAN</strong> cho hai mạng đấu nhau: một <strong>generator</strong> chế ra hàng giả và một <strong>discriminator</strong> cố phân biệt thật với giả. Chúng cùng tiến bộ đến khi hàng giả trông như thật. GAN cho ảnh sắc nét nhưng huấn luyện dễ mất ổn định.</p>
<pre><code># Mất mát VAE = tái dựng + KL (giữ không gian ẩn gần Gaussian)
def vae_loss(x, x_hat, mu, logvar):
    recon = ((x - x_hat) ** 2).mean()
    kl = -0.5 * (1 + logvar - mu.pow(2) - logvar.exp()).mean()
    return recon + kl
</code></pre>
<div class="callout"><span class="badge">Đánh đổi</span> VAE cho không gian ẩn trơn, lấy mẫu được nhưng ảnh mờ hơn; GAN cho ảnh sắc nhưng huấn luyện khó hơn. Cả hai ý tưởng đều góp vào mô hình diffusion hiện đại.</div>`,
  ]]);

const c3q = quiz('gai401-quiz-3', 'Quiz 3 — Classic models|||Quiz 3 — Mô hình cổ điển', [
  { id: 'q1', question: 'Vì sao VAE lấy mẫu mới tốt hơn autoencoder thuần?', options: ['Vì nhanh hơn', 'Vì ép không gian ẩn theo phân phối trơn, liên tục', 'Vì có nhiều lớp hơn', 'Vì dùng GPU'], correctIndex: 1, explanation: 'VAE làm không gian ẩn liên tục nên lấy mẫu rồi giải mã ra mẫu hợp lý.' },
  { id: 'q2', question: 'GAN gồm hai thành phần nào?', options: ['Encoder và decoder', 'Generator và discriminator', 'Attention và feed-forward', 'Prompt và token'], correctIndex: 1, explanation: 'GAN cho generator (tạo giả) đấu discriminator (phân biệt thật/giả).' },
  { id: 'q3', question: 'Nhược điểm thường gặp của GAN?', options: ['Ảnh luôn mờ', 'Huấn luyện dễ mất ổn định', 'Không sinh được ảnh', 'Không cần dữ liệu'], correctIndex: 1, explanation: 'GAN cho ảnh sắc nhưng quá trình huấn luyện khó ổn định.' },
]);

const c4 = doc('gai401-4-1-transformer-attention', '4.1 — Transformer & attention|||4.1 — Transformer & attention',
  'Self-attention (query/key/value), tại sao attention thay hồi quy, kiến trúc Transformer (multi-head, positional encoding, feed-forward, residual).',
  [[
    `<span class="eyebrow">GAI401 · Chapter 4 · Lesson 4.1</span>
<h2>Transformer &amp; attention</h2>
<h3>Self-attention</h3>
<p>For each token the model builds three vectors: a <strong>query</strong>, a <strong>key</strong> and a <strong>value</strong>. Attention scores how much each token should <em>attend to</em> every other token by comparing queries with keys, then mixes the values accordingly. This lets a word gather context from anywhere in the sequence in a single step.</p>
<pre><code>Attention(Q, K, V) = softmax( (Q Kᵀ) / sqrt(d_k) ) V
</code></pre>
<h3>Why it replaced recurrence</h3>
<p>RNNs read a sequence one step at a time (slow, forgetful over long ranges). Attention looks at the <em>whole</em> sequence at once, so it parallelises on GPUs and captures long-range dependencies.</p>
<h3>The Transformer block</h3>
<ul>
<li><strong>Multi-head attention</strong> — several attention "views" in parallel.</li>
<li><strong>Positional encoding</strong> — since attention has no order, position is added to each token.</li>
<li><strong>Feed-forward + residual + layer-norm</strong> — stabilise and deepen the network.</li>
</ul>
<pre><code>import torch, torch.nn as nn
# One standard Transformer encoder layer (PyTorch)
layer = nn.TransformerEncoderLayer(d_model=512, nhead=8, batch_first=True)
x = torch.randn(2, 10, 512)   # (batch, tokens, features)
out = layer(x)                # attention + feed-forward, same shape out
</code></pre>
<div class="callout"><span class="badge">Attention is All You Need (2017)</span> The Transformer dropped recurrence entirely and is now the backbone of every large language and multimodal model.</div>`,
    `<span class="eyebrow">GAI401 · Chương 4 · Bài 4.1</span>
<h2>Transformer &amp; attention</h2>
<h3>Self-attention</h3>
<p>Với mỗi token, mô hình dựng ba vector: <strong>query</strong>, <strong>key</strong> và <strong>value</strong>. Attention chấm điểm mức mỗi token nên <em>chú ý</em> tới mọi token khác bằng cách so query với key, rồi trộn các value theo điểm đó. Nhờ vậy một từ thu được ngữ cảnh từ bất cứ đâu trong chuỗi chỉ trong một bước.</p>
<pre><code>Attention(Q, K, V) = softmax( (Q Kᵀ) / sqrt(d_k) ) V
</code></pre>
<h3>Vì sao thay hồi quy</h3>
<p>RNN đọc chuỗi từng bước một (chậm, hay quên trên khoảng dài). Attention nhìn <em>cả</em> chuỗi cùng lúc, nên song song hoá tốt trên GPU và nắm được phụ thuộc xa.</p>
<h3>Khối Transformer</h3>
<ul>
<li><strong>Multi-head attention</strong> — nhiều "góc nhìn" attention chạy song song.</li>
<li><strong>Positional encoding</strong> — vì attention không có thứ tự, vị trí được cộng vào mỗi token.</li>
<li><strong>Feed-forward + residual + layer-norm</strong> — ổn định và làm sâu mạng.</li>
</ul>
<pre><code>import torch, torch.nn as nn
# Một lớp encoder Transformer chuẩn (PyTorch)
layer = nn.TransformerEncoderLayer(d_model=512, nhead=8, batch_first=True)
x = torch.randn(2, 10, 512)   # (batch, số token, đặc trưng)
out = layer(x)                # attention + feed-forward, cùng kích thước ra
</code></pre>
<div class="callout"><span class="badge">Attention is All You Need (2017)</span> Transformer bỏ hẳn hồi quy và nay là xương sống của mọi mô hình ngôn ngữ lớn và đa phương thức.</div>`,
  ]]);

const c4q = quiz('gai401-quiz-4', 'Quiz 4 — Transformer|||Quiz 4 — Transformer', [
  { id: 'q1', question: 'Self-attention dùng ba vector nào cho mỗi token?', options: ['Input, output, hidden', 'Query, key, value', 'Mean, variance, loss', 'Encoder, decoder, head'], correctIndex: 1, explanation: 'Attention so query với key để trộn các value.' },
  { id: 'q2', question: 'Vì sao cần positional encoding?', options: ['Để nén dữ liệu', 'Vì attention không tự biết thứ tự token', 'Để tăng tốc GPU', 'Để giảm tham số'], correctIndex: 1, explanation: 'Attention không có thứ tự nên phải cộng thông tin vị trí vào token.' },
  { id: 'q3', question: 'Ưu điểm của attention so với RNN?', options: ['Ít tham số hơn luôn', 'Nhìn cả chuỗi cùng lúc, song song hoá và nắm phụ thuộc xa', 'Không cần huấn luyện', 'Chỉ chạy trên CPU'], correctIndex: 1, explanation: 'Attention xử lý toàn chuỗi song song, bắt được quan hệ xa tốt hơn RNN.' },
]);

const c5 = doc('gai401-5-1-llm', '5.1 — Large language models (LLM)|||5.1 — Mô hình ngôn ngữ lớn (LLM)',
  'Tokenization, dự đoán token kế tiếp, pretraining tự giám sát, họ GPT (decoder-only), scaling laws và khả năng mới nổi (emergent).',
  [[
    `<span class="eyebrow">GAI401 · Chapter 5 · Lesson 5.1</span>
<h2>Large language models</h2>
<h3>Tokenization</h3>
<p>Text is split into <strong>tokens</strong> (subword pieces) by an algorithm like BPE. The model never sees letters — it sees token IDs, and its whole job is to predict the <strong>next token</strong>.</p>
<h3>Pretraining</h3>
<p>An LLM (like GPT, a <em>decoder-only</em> Transformer) is trained <strong>self-supervised</strong> on enormous text: at every position it predicts the next token, with the true next token as the label. No manual labelling is needed — the text supervises itself.</p>
<h3>Scaling &amp; emergent abilities</h3>
<p><strong>Scaling laws</strong> show loss falls predictably as data, parameters and compute grow. Past certain scales, <strong>emergent abilities</strong> appear — arithmetic, translation, in-context learning — that smaller models simply do not have.</p>
<pre><code>from transformers import pipeline
gen = pipeline("text-generation", model="gpt2")
out = gen("Generative AI is", max_new_tokens=20)
print(out[0]["generated_text"])   # the model predicts one token at a time
</code></pre>
<div class="callout"><span class="badge">One objective, many skills</span> "Predict the next token" is the only training goal, yet at scale it yields summarising, coding, reasoning and translation as side effects.</div>`,
    `<span class="eyebrow">GAI401 · Chương 5 · Bài 5.1</span>
<h2>Mô hình ngôn ngữ lớn</h2>
<h3>Tokenization</h3>
<p>Văn bản được tách thành <strong>token</strong> (mảnh dưới-từ) bằng thuật toán như BPE. Mô hình không thấy chữ cái — nó thấy ID token, và cả nhiệm vụ của nó là dự đoán <strong>token kế tiếp</strong>.</p>
<h3>Tiền huấn luyện</h3>
<p>Một LLM (như GPT, Transformer <em>chỉ-decoder</em>) được huấn luyện <strong>tự giám sát</strong> trên khối văn bản khổng lồ: tại mỗi vị trí nó dự đoán token kế tiếp, lấy token thật kế tiếp làm nhãn. Không cần gán nhãn tay — văn bản tự giám sát chính nó.</p>
<h3>Scaling &amp; khả năng mới nổi</h3>
<p><strong>Scaling laws</strong> cho thấy mất mát giảm có quy luật khi dữ liệu, tham số và sức tính tăng. Qua một số ngưỡng quy mô, <strong>khả năng mới nổi (emergent)</strong> xuất hiện — làm toán, dịch, học trong ngữ cảnh — thứ mà mô hình nhỏ đơn giản không có.</p>
<pre><code>from transformers import pipeline
gen = pipeline("text-generation", model="gpt2")
out = gen("Generative AI is", max_new_tokens=20)
print(out[0]["generated_text"])   # mô hình dự đoán từng token một
</code></pre>
<div class="callout"><span class="badge">Một mục tiêu, nhiều kỹ năng</span> "Dự đoán token kế tiếp" là mục tiêu huấn luyện duy nhất, nhưng ở quy mô lớn nó kéo theo tóm tắt, viết mã, suy luận và dịch.</div>`,
  ]]);

const c5q = quiz('gai401-quiz-5', 'Quiz 5 — LLM|||Quiz 5 — LLM', [
  { id: 'q1', question: 'Nhiệm vụ huấn luyện cốt lõi của một LLM như GPT là?', options: ['Phân loại ảnh', 'Dự đoán token kế tiếp', 'Sắp xếp mảng', 'Nén file'], correctIndex: 1, explanation: 'LLM decoder-only được huấn luyện dự đoán token kế tiếp, tự giám sát.' },
  { id: 'q2', question: 'Tokenization là gì?', options: ['Chia văn bản thành token (mảnh dưới-từ) rồi thành ID', 'Nén ảnh', 'Vẽ đồ thị', 'Đặt learning rate'], correctIndex: 0, explanation: 'BPE và tương tự tách văn bản thành token để mô hình xử lý.' },
  { id: 'q3', question: '"Emergent abilities" nghĩa là?', options: ['Lỗi khi huấn luyện', 'Khả năng chỉ xuất hiện khi mô hình đủ lớn', 'Tên một tập dữ liệu', 'Một hàm mất mát'], correctIndex: 1, explanation: 'Khả năng mới nổi xuất hiện qua ngưỡng quy mô nhất định.' },
]);

const c6 = doc('gai401-6-1-prompt-finetune', '6.1 — Prompting & fine-tuning|||6.1 — Prompt & fine-tuning',
  'Prompt engineering, zero/few-shot & chain-of-thought, RAG (nối tri thức ngoài), và fine-tuning/LoRA khi cần chuyên biệt hoá mô hình.',
  [[
    `<span class="eyebrow">GAI401 · Chapter 6 · Lesson 6.1</span>
<h2>Prompting &amp; fine-tuning</h2>
<h3>Prompt engineering</h3>
<p>The cheapest way to steer an LLM is the <strong>prompt</strong>. Be specific, give the role and format, and show examples. <strong>Few-shot</strong> puts a handful of input-output examples in the prompt; <strong>chain-of-thought</strong> asks the model to reason step by step before answering.</p>
<h3>RAG — Retrieval-Augmented Generation</h3>
<p>An LLM only knows its training data. <strong>RAG</strong> retrieves relevant documents (via embedding search) and pastes them into the prompt, so the model answers from <em>current, private</em> knowledge without retraining.</p>
<h3>Fine-tuning &amp; LoRA</h3>
<p>When prompting is not enough, <strong>fine-tune</strong> on your own examples. <strong>LoRA</strong> (Low-Rank Adaptation) trains only a few small extra matrices instead of all billions of weights — cheap, fast, and easy to swap.</p>
<pre><code># Few-shot prompt built in Python (no fine-tuning needed)
shots = [
    ("Great movie!", "positive"),
    ("Total waste of time.", "negative"),
]
lines = [f"Review: {r}\nSentiment: {s}" for r, s in shots]
prompt = "\n\n".join(lines) + "\n\nReview: I loved every minute.\nSentiment:"
print(prompt)
</code></pre>
<div class="callout"><span class="badge">Order of effort</span> Try prompting first, then few-shot, then RAG for fresh/private facts, and only fine-tune (LoRA) when you need a consistent new behaviour.</div>`,
    `<span class="eyebrow">GAI401 · Chương 6 · Bài 6.1</span>
<h2>Prompt &amp; fine-tuning</h2>
<h3>Prompt engineering</h3>
<p>Cách rẻ nhất để lái một LLM là <strong>prompt</strong>. Hãy cụ thể, nêu vai trò và định dạng, và cho ví dụ. <strong>Few-shot</strong> đặt vài ví dụ vào-ra ngay trong prompt; <strong>chain-of-thought</strong> yêu cầu mô hình suy luận từng bước trước khi trả lời.</p>
<h3>RAG — Sinh có truy hồi</h3>
<p>Một LLM chỉ biết dữ liệu nó đã học. <strong>RAG</strong> truy hồi tài liệu liên quan (tìm bằng embedding) rồi dán vào prompt, để mô hình trả lời từ tri thức <em>mới, riêng tư</em> mà không cần huấn luyện lại.</p>
<h3>Fine-tuning &amp; LoRA</h3>
<p>Khi prompt chưa đủ, hãy <strong>fine-tune</strong> trên ví dụ của bạn. <strong>LoRA</strong> (Low-Rank Adaptation) chỉ huấn luyện vài ma trận nhỏ thêm vào thay vì cả tỉ trọng số — rẻ, nhanh và dễ tráo.</p>
<pre><code># Prompt few-shot dựng bằng Python (không cần fine-tune)
shots = [
    ("Great movie!", "positive"),
    ("Total waste of time.", "negative"),
]
lines = [f"Review: {r}\nSentiment: {s}" for r, s in shots]
prompt = "\n\n".join(lines) + "\n\nReview: I loved every minute.\nSentiment:"
print(prompt)
</code></pre>
<div class="callout"><span class="badge">Thứ tự công sức</span> Thử prompt trước, rồi few-shot, rồi RAG cho dữ kiện mới/riêng, và chỉ fine-tune (LoRA) khi cần một hành vi mới nhất quán.</div>`,
  ]]);

const c6q = quiz('gai401-quiz-6', 'Quiz 6 — Prompt & fine-tune|||Quiz 6 — Prompt & fine-tune', [
  { id: 'q1', question: 'Few-shot prompting nghĩa là?', options: ['Huấn luyện lại toàn mô hình', 'Đặt vài ví dụ vào-ra ngay trong prompt', 'Giảm số token', 'Tắt attention'], correctIndex: 1, explanation: 'Few-shot đưa vài ví dụ mẫu vào prompt để định hướng mô hình.' },
  { id: 'q2', question: 'RAG giải quyết vấn đề gì?', options: ['Mô hình chạy chậm', 'Cho mô hình trả lời từ tri thức mới/riêng mà không huấn luyện lại', 'Giảm kích thước ảnh', 'Tăng learning rate'], correctIndex: 1, explanation: 'RAG truy hồi tài liệu liên quan và dán vào prompt.' },
  { id: 'q3', question: 'LoRA khác fine-tune toàn phần ở chỗ?', options: ['Chỉ huấn luyện vài ma trận nhỏ thêm vào, không phải tất cả trọng số', 'Không cần dữ liệu', 'Chạy trên CPU', 'Xoá bộ nhớ mô hình'], correctIndex: 0, explanation: 'LoRA huấn luyện ít tham số phụ nên rẻ, nhanh và dễ tráo.' },
]);

const c7 = doc('gai401-7-1-image-multimodal', '7.1 — Image & multimodal generation|||7.1 — Sinh ảnh & đa phương thức',
  'Diffusion (thêm rồi khử nhiễu), Stable Diffusion (latent + text-conditioning), DALL-E, và mô hình đa phương thức (text↔image↔audio).',
  [[
    `<span class="eyebrow">GAI401 · Chapter 7 · Lesson 7.1</span>
<h2>Image &amp; multimodal generation</h2>
<h3>Diffusion models</h3>
<p>A <strong>diffusion</strong> model learns to reverse a noising process. In training, images are gradually turned into pure noise; the model learns to <em>remove</em> noise step by step. To generate, you start from random noise and denoise repeatedly until an image appears.</p>
<h3>Stable Diffusion &amp; DALL-E</h3>
<p><strong>Stable Diffusion</strong> runs the process in a compressed <em>latent</em> space (fast, runs on a normal GPU) and is <strong>text-conditioned</strong>: a text encoder guides denoising so the output matches your prompt. <strong>DALL-E</strong> does the same job with its own architecture. Both turn a sentence into a picture.</p>
<h3>Multimodal models</h3>
<p><strong>Multimodal</strong> models handle several media at once — describe an image (vision-to-text), answer questions about a chart, or generate audio from text — by embedding every modality into a shared space.</p>
<pre><code>from diffusers import StableDiffusionPipeline
pipe = StableDiffusionPipeline.from_pretrained("runwayml/stable-diffusion-v1-5")
image = pipe("a watercolor fox in a misty forest").images[0]
image.save("fox.png")   # text prompt in, image out
</code></pre>
<div class="callout"><span class="badge">Noise to art</span> Diffusion generates by starting from static and denoising toward the prompt — a different route from GANs, and today the state of the art for images.</div>`,
    `<span class="eyebrow">GAI401 · Chương 7 · Bài 7.1</span>
<h2>Sinh ảnh &amp; đa phương thức</h2>
<h3>Mô hình diffusion</h3>
<p>Mô hình <strong>diffusion</strong> học cách đảo ngược một quá trình thêm nhiễu. Khi huấn luyện, ảnh bị dần biến thành nhiễu thuần; mô hình học cách <em>khử</em> nhiễu từng bước. Để sinh, ta bắt đầu từ nhiễu ngẫu nhiên và khử nhiễu lặp lại đến khi hiện ra một ảnh.</p>
<h3>Stable Diffusion &amp; DALL-E</h3>
<p><strong>Stable Diffusion</strong> chạy quá trình trong không gian <em>ẩn (latent)</em> nén (nhanh, chạy được trên GPU thường) và <strong>điều kiện theo văn bản</strong>: một bộ mã hoá văn bản dẫn dắt việc khử nhiễu để đầu ra khớp prompt. <strong>DALL-E</strong> làm cùng việc đó với kiến trúc riêng. Cả hai biến một câu thành một bức ảnh.</p>
<h3>Mô hình đa phương thức</h3>
<p>Mô hình <strong>đa phương thức</strong> xử lý nhiều loại media cùng lúc — mô tả một ảnh (ảnh sang chữ), trả lời câu hỏi về một biểu đồ, hay sinh âm thanh từ chữ — bằng cách nhúng mọi phương thức vào một không gian chung.</p>
<pre><code>from diffusers import StableDiffusionPipeline
pipe = StableDiffusionPipeline.from_pretrained("runwayml/stable-diffusion-v1-5")
image = pipe("a watercolor fox in a misty forest").images[0]
image.save("fox.png")   # đưa prompt chữ vào, nhận ảnh ra
</code></pre>
<div class="callout"><span class="badge">Nhiễu thành tranh</span> Diffusion sinh ảnh bằng cách bắt đầu từ nhiễu và khử dần về phía prompt — con đường khác GAN, và hiện là tối tân nhất cho ảnh.</div>`,
  ]]);

const c7q = quiz('gai401-quiz-7', 'Quiz 7 — Image & multimodal|||Quiz 7 — Sinh ảnh & đa phương thức', [
  { id: 'q1', question: 'Mô hình diffusion sinh ảnh bằng cách?', options: ['Ghép ảnh có sẵn', 'Bắt đầu từ nhiễu rồi khử nhiễu lặp lại', 'Phân loại pixel', 'Nén ảnh JPEG'], correctIndex: 1, explanation: 'Diffusion học đảo ngược quá trình thêm nhiễu để sinh ảnh mới.' },
  { id: 'q2', question: 'Stable Diffusion chạy nhanh nhờ?', options: ['Không dùng GPU', 'Chạy trong không gian ẩn (latent) nén', 'Bỏ qua văn bản', 'Chỉ ảnh đen trắng'], correctIndex: 1, explanation: 'Nó khuếch tán trong không gian latent nén nên nhẹ và nhanh.' },
  { id: 'q3', question: 'Mô hình đa phương thức (multimodal) làm gì?', options: ['Chỉ xử lý văn bản', 'Xử lý nhiều loại media (chữ, ảnh, âm thanh) trong một không gian chung', 'Chỉ nén dữ liệu', 'Chỉ chạy trên điện thoại'], correctIndex: 1, explanation: 'Đa phương thức nhúng nhiều phương thức vào không gian chung để xử lý cùng lúc.' },
]);

const c8 = doc('gai401-8-1-eval-ethics', '8.1 — Evaluation, ethics & applications|||8.1 — Đánh giá, đạo đức & ứng dụng',
  'Ảo giác (hallucination), thiên lệch (bias), an toàn AI (alignment, RLHF), bản quyền & dữ liệu huấn luyện, và ứng dụng thực tế có trách nhiệm.',
  [[
    `<span class="eyebrow">GAI401 · Chapter 8 · Lesson 8.1</span>
<h2>Evaluation, ethics &amp; applications</h2>
<h3>Hallucination</h3>
<p>An LLM predicts plausible text, not verified truth, so it can state falsehoods confidently — a <strong>hallucination</strong>. Mitigate with RAG (ground answers in sources), citations, and human review for anything high-stakes.</p>
<h3>Bias &amp; safety</h3>
<p>Models absorb the <strong>bias</strong> of their training data. <strong>Alignment</strong> techniques such as <strong>RLHF</strong> (reinforcement learning from human feedback) and safety guardrails steer models toward helpful, harmless, honest behaviour — but do not remove the risk.</p>
<h3>Copyright &amp; data</h3>
<p>Training on scraped text and images raises <strong>copyright</strong> and consent questions; generated output can echo training data. Know your data provenance and licence.</p>
<h3>Applications</h3>
<p>Chat assistants, code generation, search, content creation, tutoring, drug/material discovery — evaluate each with the right metric and a human in the loop.</p>
<pre><code># A simple, honest evaluation: does the answer cite its source?
def is_grounded(answer, sources):
    return any(s[:40] in answer for s in sources)

print(is_grounded("Per the 2023 report, revenue rose 12%.",
                  ["Per the 2023 report, revenue rose 12% year over year."]))
</code></pre>
<div class="callout"><span class="badge">Responsible by default</span> A capable model is not automatically a safe one. Ground answers, measure quality, watch for bias, respect data rights, and keep a human in the loop.</div>`,
    `<span class="eyebrow">GAI401 · Chương 8 · Bài 8.1</span>
<h2>Đánh giá, đạo đức &amp; ứng dụng</h2>
<h3>Ảo giác (hallucination)</h3>
<p>LLM dự đoán văn bản hợp lý, không phải sự thật đã kiểm chứng, nên nó có thể nói sai một cách tự tin — gọi là <strong>ảo giác</strong>. Giảm bằng RAG (neo câu trả lời vào nguồn), trích dẫn, và để người kiểm với mọi việc hệ trọng.</p>
<h3>Thiên lệch &amp; an toàn</h3>
<p>Mô hình hấp thụ <strong>thiên lệch (bias)</strong> của dữ liệu huấn luyện. Các kỹ thuật <strong>căn chỉnh (alignment)</strong> như <strong>RLHF</strong> (học tăng cường từ phản hồi con người) và rào an toàn lái mô hình về phía hữu ích, vô hại, trung thực — nhưng không xoá hết rủi ro.</p>
<h3>Bản quyền &amp; dữ liệu</h3>
<p>Huấn luyện trên văn bản và ảnh thu thập đặt ra câu hỏi <strong>bản quyền</strong> và sự đồng ý; đầu ra sinh ra có thể lặp lại dữ liệu huấn luyện. Hãy nắm nguồn gốc và giấy phép dữ liệu của bạn.</p>
<h3>Ứng dụng</h3>
<p>Trợ lý hội thoại, sinh mã, tìm kiếm, sáng tạo nội dung, gia sư, khám phá thuốc/vật liệu — đánh giá mỗi việc bằng thước đo phù hợp và có người trong vòng lặp.</p>
<pre><code># Một đánh giá đơn giản, trung thực: câu trả lời có trích nguồn không?
def is_grounded(answer, sources):
    return any(s[:40] in answer for s in sources)

print(is_grounded("Per the 2023 report, revenue rose 12%.",
                  ["Per the 2023 report, revenue rose 12% year over year."]))
</code></pre>
<div class="callout"><span class="badge">Có trách nhiệm mặc định</span> Một mô hình mạnh chưa chắc là an toàn. Hãy neo câu trả lời vào nguồn, đo chất lượng, canh thiên lệch, tôn trọng quyền dữ liệu, và giữ người trong vòng lặp.</div>`,
  ]]);

const c8q = quiz('gai401-quiz-8', 'Quiz 8 — Ethics & eval|||Quiz 8 — Đạo đức & đánh giá', [
  { id: 'q1', question: '"Hallucination" của LLM là?', options: ['Mô hình chạy chậm', 'Mô hình nói sai sự thật một cách tự tin', 'Ảnh bị mờ', 'Lỗi cú pháp'], correctIndex: 1, explanation: 'LLM dự đoán văn bản hợp lý, không kiểm chứng, nên có thể bịa tự tin.' },
  { id: 'q2', question: 'RLHF dùng để?', options: ['Nén mô hình', 'Căn chỉnh mô hình theo phản hồi con người', 'Tăng số token', 'Vẽ đồ thị'], correctIndex: 1, explanation: 'RLHF lái mô hình về phía hữu ích, vô hại, trung thực.' },
  { id: 'q3', question: 'Cách tốt để giảm ảo giác khi cần dữ kiện chính xác?', options: ['Tăng nhiệt độ (temperature)', 'Dùng RAG neo câu trả lời vào nguồn và trích dẫn', 'Bỏ mọi kiểm tra', 'Giảm số tham số'], correctIndex: 1, explanation: 'Neo vào nguồn (RAG) + trích dẫn + người kiểm giúp giảm ảo giác.' },
]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'GAI401',
    slug: 'gai401-generative-ai',
    title: 'Generative AI',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/GAI401.webp',
    shortDescription: 'How machines create text, images, audio & code — generative vs discriminative, VAE/GAN, Transformers, LLMs, prompting/RAG/fine-tuning (LoRA), diffusion & multimodal, plus evaluation, bias & AI safety. Bilingual, Python/Hugging Face code & quizzes.|||Máy tạo văn bản, ảnh, âm thanh & mã thế nào — sinh vs phân loại, VAE/GAN, Transformer, LLM, prompt/RAG/fine-tuning (LoRA), diffusion & đa phương thức, cùng đánh giá, thiên lệch & an toàn AI. Song ngữ, code Python/Hugging Face & quiz.',
    description: 'Môn <strong>GAI401 — Generative AI (Trí tuệ nhân tạo tạo sinh)</strong> (ngành Khoa học Máy tính, kỳ 7) giải thích <strong>máy tạo ra nội dung mới thế nào</strong>. Từ <strong>nền tảng</strong> (sinh vs phân loại, mạng nơ-ron, embedding, huấn luyện) → <strong>mô hình sinh cổ điển</strong> (autoencoder, VAE, GAN) → <strong>Transformer &amp; attention</strong> → <strong>mô hình ngôn ngữ lớn (LLM)</strong> → <strong>prompt &amp; fine-tuning</strong> (few-shot, RAG, LoRA) → <strong>sinh ảnh &amp; đa phương thức</strong> (diffusion, Stable Diffusion, DALL-E) → <strong>đánh giá, đạo đức &amp; ứng dụng</strong> (ảo giác, thiên lệch, an toàn AI, bản quyền). Bám giáo trình chuẩn quốc tế, song ngữ, có ví dụ Python/Hugging Face và quiz mỗi chương.',
    whatYouLearn: 'Phân biệt sinh vs phân loại; mạng nơ-ron, embedding, mất mát & backprop; autoencoder, VAE, GAN; self-attention & kiến trúc Transformer; tokenization, pretraining, GPT, scaling & emergent; prompt engineering, few-shot, chain-of-thought, RAG, fine-tuning & LoRA; diffusion, Stable Diffusion, DALL-E, mô hình đa phương thức; ảo giác, thiên lệch, RLHF & an toàn AI, bản quyền dữ liệu; ứng dụng thực tế với người trong vòng lặp.',
    requirements: 'Lập trình Python cơ bản; toán cơ bản (đại số tuyến tính, xác suất). Nên biết cơ bản về machine learning. Dùng Google Colab (GPU miễn phí) để chạy ví dụ.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách, khoá miễn phí (Hugging Face), tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Generative AI là gì, vì sao bùng nổ, lộ trình.', lessons: [intro] },
    { title: 'Chương 1 — Generative AI là gì|||Chapter 1 — What is Generative AI', description: 'Sinh vs phân loại, lịch sử, ứng dụng, landscape.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Nền tảng học sâu|||Chapter 2 — Deep learning foundations', description: 'Nơ-ron, embedding, huấn luyện, mất mát.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Mô hình sinh cổ điển|||Chapter 3 — Classic generative models', description: 'Autoencoder, VAE, GAN.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Transformer & attention|||Chapter 4 — Transformer & attention', description: 'Self-attention, kiến trúc Transformer.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Mô hình ngôn ngữ lớn|||Chapter 5 — Large language models', description: 'Pretraining, GPT, tokenization, scaling, emergent.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Prompt & fine-tuning|||Chapter 6 — Prompting & fine-tuning', description: 'Prompt engineering, few-shot, RAG, fine-tuning/LoRA.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Sinh ảnh & đa phương thức|||Chapter 7 — Image & multimodal', description: 'Diffusion, Stable Diffusion, DALL-E, multimodal.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Đánh giá, đạo đức & ứng dụng|||Chapter 8 — Evaluation, ethics & applications', description: 'Ảo giác, thiên lệch, an toàn AI, bản quyền, ứng dụng.', lessons: [c8, c8q] },
  ],
};
