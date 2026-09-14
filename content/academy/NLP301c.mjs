/**
 * NLP301c — Natural Language Processing (Xử lý ngôn ngữ tự nhiên). Ngành
 * Robotics & AI, FPTU. Giáo trình: Jurafsky & Martin "Speech and Language
 * Processing" (3rd ed), Stanford CS224N, "NLP with Transformers" (Tunstall
 * et al), HuggingFace course. 8 chương song ngữ + ví dụ Python (NLTK/spaCy/
 * HuggingFace) + quiz. ⚠️ KHÔNG backtick/${; "&"→&amp; trong HTML; "<"→&lt;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('nlp301c-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình chuẩn (Jurafsky & Martin, CS224N, NLP with Transformers, HuggingFace course), tài liệu miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">NLP301c · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Natural Language Processing</strong> — from text preprocessing to Transformers, large language models (LLMs) and retrieval-augmented generation (RAG) — in one place. The official FPTU slides live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Standard textbooks</h3>
<ul>
<li><a href="https://web.stanford.edu/~jurafsky/slp3/" target="_blank" rel="noopener"><em>Speech and Language Processing</em> — Jurafsky &amp; Martin (3rd ed, free draft)</a> — the canonical NLP textbook.</li>
<li><a href="https://www.oreilly.com/library/view/natural-language-processing/9781098136789/" target="_blank" rel="noopener"><em>Natural Language Processing with Transformers</em> — Tunstall, von Werra &amp; Wolf</a>.</li>
</ul>
<h3>🌐 Free courses &amp; docs</h3>
<ul>
<li><a href="https://web.stanford.edu/class/cs224n/" target="_blank" rel="noopener">Stanford CS224N — NLP with Deep Learning</a> (lectures + slides on YouTube).</li>
<li><a href="https://huggingface.co/learn/nlp-course" target="_blank" rel="noopener">HuggingFace NLP Course</a> — hands-on Transformers, tokenizers, fine-tuning.</li>
<li><a href="https://www.nltk.org/book/" target="_blank" rel="noopener">NLTK Book</a> and <a href="https://spacy.io/usage" target="_blank" rel="noopener">spaCy docs</a>.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://colab.research.google.com/" target="_blank" rel="noopener">Google Colab</a> — free GPU notebooks for training/fine-tuning.</li>
<li><a href="https://huggingface.co/models" target="_blank" rel="noopener">HuggingFace Hub</a> — pretrained models &amp; datasets.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundations</strong> — preprocessing, TF-IDF, n-grams, word embeddings.</li>
<li><strong>Sequence models</strong> — language models, RNN/LSTM, attention.</li>
<li><strong>Transformers</strong> — BERT/GPT, fine-tuning, HuggingFace pipelines.</li>
<li><strong>Job-ready</strong> — LLMs, prompt engineering, RAG, and bias/ethics.</li>
</ol></div>`,
    `<span class="eyebrow">NLP301c · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Xử lý ngôn ngữ tự nhiên</strong> — từ tiền xử lý văn bản tới Transformer, mô hình ngôn ngữ lớn (LLM) và sinh có truy hồi (RAG) — gom về một chỗ. Slide chính thức của FPTU nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình chuẩn</h3>
<ul>
<li><a href="https://web.stanford.edu/~jurafsky/slp3/" target="_blank" rel="noopener"><em>Speech and Language Processing</em> — Jurafsky &amp; Martin (ấn bản 3, bản nháp miễn phí)</a> — giáo trình NLP kinh điển.</li>
<li><a href="https://www.oreilly.com/library/view/natural-language-processing/9781098136789/" target="_blank" rel="noopener"><em>Natural Language Processing with Transformers</em> — Tunstall, von Werra &amp; Wolf</a>.</li>
</ul>
<h3>🌐 Khoá học &amp; tài liệu miễn phí</h3>
<ul>
<li><a href="https://web.stanford.edu/class/cs224n/" target="_blank" rel="noopener">Stanford CS224N — NLP với học sâu</a> (bài giảng + slide trên YouTube).</li>
<li><a href="https://huggingface.co/learn/nlp-course" target="_blank" rel="noopener">Khoá NLP của HuggingFace</a> — thực hành Transformer, tokenizer, fine-tune.</li>
<li><a href="https://www.nltk.org/book/" target="_blank" rel="noopener">Sách NLTK</a> và <a href="https://spacy.io/usage" target="_blank" rel="noopener">tài liệu spaCy</a>.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://colab.research.google.com/" target="_blank" rel="noopener">Google Colab</a> — notebook GPU miễn phí để huấn luyện/fine-tune.</li>
<li><a href="https://huggingface.co/models" target="_blank" rel="noopener">HuggingFace Hub</a> — mô hình &amp; bộ dữ liệu tiền huấn luyện.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — tiền xử lý, TF-IDF, n-gram, word embeddings.</li>
<li><strong>Mô hình chuỗi</strong> — mô hình ngôn ngữ, RNN/LSTM, attention.</li>
<li><strong>Transformer</strong> — BERT/GPT, fine-tune, pipeline HuggingFace.</li>
<li><strong>Sẵn sàng đi làm</strong> — LLM, prompt engineering, RAG, và thiên lệch/đạo đức.</li>
</ol></div>`,
  ]]);

const intro = doc('nlp301c-0-1-overview', 'Course overview: Natural Language Processing|||Tổng quan: Xử lý ngôn ngữ tự nhiên',
  'NLP làm gì; vì sao ngôn ngữ khó với máy tính; lộ trình: tiền xử lý → biểu diễn văn bản → embeddings → mô hình ngôn ngữ → Transformer → mô hình tiền huấn luyện → tác vụ NLP → LLM/RAG.',
  [[
    `<span class="eyebrow">NLP301c · Lesson 0.1 · Overview</span>
<h2>What is Natural Language Processing?</h2>
<p class="lead"><strong>Natural Language Processing (NLP)</strong> is the field that lets computers read, understand and generate human language — the technology behind search engines, chatbots, machine translation and voice assistants.</p>
<h3>Why is language hard for machines?</h3>
<ul>
<li><strong>Ambiguity</strong> — "I saw her duck" (a bird? or ducking?).</li>
<li><strong>Context</strong> — the meaning of "bank" depends on the surrounding words.</li>
<li><strong>Scale &amp; variation</strong> — spelling, slang, and infinite valid sentences.</li>
</ul>
<h3>Roadmap</h3>
<p>Preprocessing (tokenization, stemming, lemmatization) → text representation (BoW, TF-IDF, n-grams) → word embeddings (Word2Vec, GloVe) → language models &amp; RNN/LSTM → attention &amp; the Transformer → pretrained models (BERT, GPT) &amp; fine-tuning → NLP tasks (classification, NER, sentiment, translation, QA) → LLMs, prompt engineering, RAG and ethics.</p>
<div class="callout"><span class="badge">Big idea</span> Modern NLP turns words into <strong>vectors of numbers</strong> so that neural networks can compute with meaning — this course traces that idea from TF-IDF all the way to Transformers.</div>`,
    `<span class="eyebrow">NLP301c · Bài 0.1 · Tổng quan</span>
<h2>Xử lý ngôn ngữ tự nhiên là gì?</h2>
<p class="lead"><strong>Xử lý ngôn ngữ tự nhiên (NLP)</strong> là lĩnh vực giúp máy tính đọc, hiểu và sinh ra ngôn ngữ con người — công nghệ đằng sau công cụ tìm kiếm, chatbot, dịch máy và trợ lý giọng nói.</p>
<h3>Vì sao ngôn ngữ khó với máy?</h3>
<ul>
<li><strong>Nhập nhằng</strong> — "I saw her duck" (con vịt? hay cúi xuống?).</li>
<li><strong>Ngữ cảnh</strong> — nghĩa của "bank" (bờ sông / ngân hàng) phụ thuộc từ xung quanh.</li>
<li><strong>Quy mô &amp; biến thể</strong> — chính tả, tiếng lóng, và vô hạn câu hợp lệ.</li>
</ul>
<h3>Lộ trình</h3>
<p>Tiền xử lý (tokenization, stemming, lemmatization) → biểu diễn văn bản (BoW, TF-IDF, n-gram) → word embeddings (Word2Vec, GloVe) → mô hình ngôn ngữ &amp; RNN/LSTM → attention &amp; Transformer → mô hình tiền huấn luyện (BERT, GPT) &amp; fine-tune → tác vụ NLP (phân loại, NER, sentiment, dịch máy, hỏi đáp) → LLM, prompt engineering, RAG và đạo đức.</p>
<div class="callout"><span class="badge">Ý tưởng lớn</span> NLP hiện đại biến từ ngữ thành <strong>vector số</strong> để mạng nơ-ron tính toán với ý nghĩa — môn này lần theo ý tưởng đó từ TF-IDF cho tới Transformer.</div>`,
  ]]);

const c1 = doc('nlp301c-1-1-preprocessing', '1.1 — NLP overview & text preprocessing|||1.1 — Tổng quan NLP & tiền xử lý văn bản',
  'Pipeline NLP; tokenization (tách token), chuẩn hoá (lowercase, bỏ dấu câu), stopwords, stemming vs lemmatization; ví dụ NLTK/spaCy.',
  [[
    `<span class="eyebrow">NLP301c · Chapter 1 · Lesson 1.1</span>
<h2>Text preprocessing</h2>
<p>Raw text is messy. Before any model can use it, we <strong>preprocess</strong> it into clean tokens.</p>
<h3>Key steps</h3>
<ul>
<li><strong>Tokenization</strong> — split text into units (words, subwords, sentences).</li>
<li><strong>Normalization</strong> — lowercasing, removing punctuation, handling numbers.</li>
<li><strong>Stopword removal</strong> — drop very common words ("the", "is") that carry little meaning.</li>
<li><strong>Stemming</strong> — chop words to a crude root ("studies" → "studi"); fast, rule-based.</li>
<li><strong>Lemmatization</strong> — reduce to the dictionary form ("studies" → "study"); slower, uses vocabulary &amp; grammar.</li>
</ul>
<pre><code>import nltk
from nltk.stem import PorterStemmer, WordNetLemmatizer
from nltk.tokenize import word_tokenize

text = "The cats were studying happily"
tokens = word_tokenize(text.lower())
# ['the', 'cats', 'were', 'studying', 'happily']

stemmer = PorterStemmer()
print([stemmer.stem(t) for t in tokens])
# ['the', 'cat', 'were', 'studi', 'happili']

lem = WordNetLemmatizer()
print(lem.lemmatize("studies"))   # 'study'
</code></pre>
<div class="callout"><span class="badge">Stemming vs lemmatization</span> Stemming is fast but sloppy; lemmatization is accurate but needs a dictionary. Choose based on whether you need speed or correct words.</div>`,
    `<span class="eyebrow">NLP301c · Chương 1 · Bài 1.1</span>
<h2>Tiền xử lý văn bản</h2>
<p>Văn bản thô rất lộn xộn. Trước khi mô hình dùng được, ta <strong>tiền xử lý</strong> nó thành các token sạch.</p>
<h3>Các bước chính</h3>
<ul>
<li><strong>Tokenization (tách token)</strong> — chia văn bản thành đơn vị (từ, subword, câu).</li>
<li><strong>Chuẩn hoá</strong> — chữ thường, bỏ dấu câu, xử lý số.</li>
<li><strong>Bỏ stopword</strong> — loại các từ rất phổ biến ("the", "is") ít mang nghĩa.</li>
<li><strong>Stemming</strong> — cắt từ về gốc thô ("studies" → "studi"); nhanh, theo luật.</li>
<li><strong>Lemmatization</strong> — đưa về dạng từ điển ("studies" → "study"); chậm hơn, dùng từ vựng &amp; ngữ pháp.</li>
</ul>
<pre><code>import nltk
from nltk.stem import PorterStemmer, WordNetLemmatizer
from nltk.tokenize import word_tokenize

text = "The cats were studying happily"
tokens = word_tokenize(text.lower())
# ['the', 'cats', 'were', 'studying', 'happily']

stemmer = PorterStemmer()
print([stemmer.stem(t) for t in tokens])
# ['the', 'cat', 'were', 'studi', 'happili']

lem = WordNetLemmatizer()
print(lem.lemmatize("studies"))   # 'study'
</code></pre>
<div class="callout"><span class="badge">Stemming vs lemmatization</span> Stemming nhanh nhưng cẩu thả; lemmatization chính xác nhưng cần từ điển. Chọn theo việc bạn cần tốc độ hay từ đúng.</div>`,
  ]]);

const c1q = quiz('nlp301c-quiz-1', 'Quiz 1 — Preprocessing|||Quiz 1 — Tiền xử lý', [
  { id: 'q1', question: 'Tokenization trong NLP là?', options: ['Mã hoá mật khẩu', 'Tách văn bản thành đơn vị (từ/subword/câu)', 'Dịch văn bản', 'Xoá stopword'], correctIndex: 1, explanation: 'Tokenization chia văn bản thành các token để xử lý.' },
  { id: 'q2', question: 'Khác biệt chính giữa stemming và lemmatization?', options: ['Stemming chậm hơn', 'Lemmatization cho dạng từ điển đúng, dùng từ vựng/ngữ pháp', 'Cả hai giống hệt', 'Stemming cần mạng nơ-ron'], correctIndex: 1, explanation: 'Lemmatization đưa về dạng từ điển (study), stemming chỉ cắt gốc thô (studi).' },
  { id: 'q3', question: 'Bỏ stopword nhằm mục đích?', options: ['Loại từ rất phổ biến ít mang nghĩa', 'Thêm từ mới', 'Dịch sang tiếng Anh', 'Tăng số token'], correctIndex: 0, explanation: 'Stopword (the, is, and...) mang ít thông tin, thường bị loại bỏ.' },
]);

const c2 = doc('nlp301c-2-1-representation', '2.1 — Text representation: BoW, TF-IDF, n-grams|||2.1 — Biểu diễn văn bản: BoW, TF-IDF, n-gram',
  'Bag-of-Words (đếm từ), TF-IDF (trọng số theo độ hiếm), n-gram (giữ thứ tự cục bộ); ví dụ scikit-learn.',
  [[
    `<span class="eyebrow">NLP301c · Chapter 2 · Lesson 2.1</span>
<h2>Text representation</h2>
<p>Models need numbers, not words. Classical NLP turns a document into a <strong>vector</strong>.</p>
<h3>Bag-of-Words (BoW)</h3>
<p>Count how many times each vocabulary word appears — ignoring order. Simple, but the vector is huge and loses word order.</p>
<h3>TF-IDF</h3>
<p><strong>Term Frequency × Inverse Document Frequency</strong> weights each word by how often it appears in a document (TF) and how <em>rare</em> it is across all documents (IDF). Rare, informative words get high weight; "the" gets almost none.</p>
<pre><code>from sklearn.feature_extraction.text import TfidfVectorizer

corpus = ["the cat sat", "the dog ran", "cat and dog play"]
vec = TfidfVectorizer()
X = vec.fit_transform(corpus)
print(vec.get_feature_names_out())
# ['and' 'cat' 'dog' 'play' 'ran' 'sat' 'the']
print(X.shape)   # (3, 7)  -> 3 docs, 7 vocab words
</code></pre>
<h3>N-grams</h3>
<p>An <strong>n-gram</strong> keeps sequences of n adjacent tokens: "New York" (a bigram) carries more meaning than "New" and "York" alone. N-grams recover some local order that BoW throws away.</p>
<div class="callout"><span class="badge">Limitation</span> BoW/TF-IDF are <strong>sparse</strong> and treat every word as unrelated — "car" and "automobile" look totally different. Embeddings (next chapter) fix this.</div>`,
    `<span class="eyebrow">NLP301c · Chương 2 · Bài 2.1</span>
<h2>Biểu diễn văn bản</h2>
<p>Mô hình cần số, không cần chữ. NLP cổ điển biến một văn bản thành <strong>vector</strong>.</p>
<h3>Bag-of-Words (BoW - túi từ)</h3>
<p>Đếm mỗi từ trong từ vựng xuất hiện bao nhiêu lần — bỏ qua thứ tự. Đơn giản, nhưng vector rất lớn và mất thứ tự từ.</p>
<h3>TF-IDF</h3>
<p><strong>Tần suất từ × Nghịch đảo tần suất tài liệu</strong> gán trọng số cho mỗi từ theo mức xuất hiện trong một văn bản (TF) và mức <em>hiếm</em> của nó trên toàn bộ tập (IDF). Từ hiếm, giàu thông tin được trọng số cao; "the" gần như bằng 0.</p>
<pre><code>from sklearn.feature_extraction.text import TfidfVectorizer

corpus = ["the cat sat", "the dog ran", "cat and dog play"]
vec = TfidfVectorizer()
X = vec.fit_transform(corpus)
print(vec.get_feature_names_out())
# ['and' 'cat' 'dog' 'play' 'ran' 'sat' 'the']
print(X.shape)   # (3, 7)  -> 3 văn bản, 7 từ vựng
</code></pre>
<h3>N-gram</h3>
<p>Một <strong>n-gram</strong> giữ chuỗi n token liền nhau: "New York" (bigram) mang nhiều nghĩa hơn "New" và "York" tách rời. N-gram khôi phục một phần thứ tự cục bộ mà BoW vứt đi.</p>
<div class="callout"><span class="badge">Hạn chế</span> BoW/TF-IDF <strong>thưa (sparse)</strong> và coi mọi từ là không liên quan — "car" và "automobile" trông hoàn toàn khác nhau. Embeddings (chương sau) khắc phục điều này.</div>`,
  ]]);

const c2q = quiz('nlp301c-quiz-2', 'Quiz 2 — Representation|||Quiz 2 — Biểu diễn văn bản', [
  { id: 'q1', question: 'TF-IDF gán trọng số CAO cho từ như thế nào?', options: ['Từ phổ biến ở mọi tài liệu', 'Từ hiếm, giàu thông tin trong một tài liệu', 'Từ ngắn nhất', 'Stopword'], correctIndex: 1, explanation: 'IDF hạ trọng số từ phổ biến, nâng từ hiếm & giàu thông tin.' },
  { id: 'q2', question: 'Nhược điểm chính của Bag-of-Words?', options: ['Quá chậm để tính', 'Bỏ qua thứ tự từ và vector thưa, lớn', 'Không đếm được từ', 'Chỉ dùng cho tiếng Anh'], correctIndex: 1, explanation: 'BoW bỏ thứ tự, cho vector thưa & lớn, coi các từ là độc lập.' },
  { id: 'q3', question: 'Bigram "New York" hữu ích vì?', options: ['Ngắn hơn', 'Giữ thứ tự cục bộ, mang nghĩa hơn hai từ rời', 'Là stopword', 'Không cần từ điển'], correctIndex: 1, explanation: 'N-gram giữ chuỗi token liền nhau, khôi phục thứ tự cục bộ.' },
]);

const c3 = doc('nlp301c-3-1-embeddings', '3.1 — Word embeddings: Word2Vec & GloVe|||3.1 — Word embeddings: Word2Vec & GloVe',
  'Vector dày biểu diễn nghĩa; Word2Vec (CBOW/Skip-gram), GloVe; số học vector (king - man + woman ≈ queen); ví dụ gensim.',
  [[
    `<span class="eyebrow">NLP301c · Chapter 3 · Lesson 3.1</span>
<h2>Word embeddings</h2>
<p>Instead of sparse counts, an <strong>embedding</strong> maps each word to a <strong>dense vector</strong> (e.g. 300 numbers) where similar words sit close together. This captures <em>meaning</em>.</p>
<h3>Word2Vec</h3>
<p>Trains a shallow network on the idea "you shall know a word by the company it keeps":</p>
<ul>
<li><strong>CBOW</strong> — predict a word from its context.</li>
<li><strong>Skip-gram</strong> — predict the context from a word.</li>
</ul>
<h3>GloVe</h3>
<p><strong>Global Vectors</strong> instead factorizes a word co-occurrence matrix over the whole corpus — combining global statistics with local context.</p>
<pre><code>import gensim.downloader as api
model = api.load("glove-wiki-gigaword-100")

# Famous vector arithmetic:
model.most_similar(positive=["king", "woman"],
                   negative=["man"])[0]
# ('queen', 0.77...)

model.similarity("car", "automobile")   # ~0.7 (high)
</code></pre>
<div class="callout"><span class="badge">Why it matters</span> Embeddings turn "car" and "automobile" into <strong>nearby vectors</strong>, so models generalize across synonyms — something BoW/TF-IDF could never do. But each word gets ONE vector, ignoring context (fixed by Transformers).</div>`,
    `<span class="eyebrow">NLP301c · Chương 3 · Bài 3.1</span>
<h2>Word embeddings</h2>
<p>Thay vì đếm thưa, một <strong>embedding</strong> ánh xạ mỗi từ thành một <strong>vector dày</strong> (vd 300 số) sao cho các từ giống nhau nằm gần nhau. Điều này nắm bắt được <em>ý nghĩa</em>.</p>
<h3>Word2Vec</h3>
<p>Huấn luyện mạng nông theo ý "hiểu một từ qua những từ đi cùng nó":</p>
<ul>
<li><strong>CBOW</strong> — dự đoán một từ từ ngữ cảnh của nó.</li>
<li><strong>Skip-gram</strong> — dự đoán ngữ cảnh từ một từ.</li>
</ul>
<h3>GloVe</h3>
<p><strong>Global Vectors</strong> thay vào đó phân rã ma trận đồng xuất hiện của từ trên toàn bộ ngữ liệu — kết hợp thống kê toàn cục với ngữ cảnh cục bộ.</p>
<pre><code>import gensim.downloader as api
model = api.load("glove-wiki-gigaword-100")

# Phép số học vector nổi tiếng:
model.most_similar(positive=["king", "woman"],
                   negative=["man"])[0]
# ('queen', 0.77...)

model.similarity("car", "automobile")   # ~0.7 (cao)
</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Embeddings biến "car" và "automobile" thành <strong>vector gần nhau</strong>, giúp mô hình khái quát qua từ đồng nghĩa — điều BoW/TF-IDF không làm được. Nhưng mỗi từ chỉ có MỘT vector, bỏ qua ngữ cảnh (Transformer khắc phục).</div>`,
  ]]);

const c3q = quiz('nlp301c-quiz-3', 'Quiz 3 — Embeddings|||Quiz 3 — Word embeddings', [
  { id: 'q1', question: 'Word embedding khác Bag-of-Words ở chỗ?', options: ['Là vector dày nắm bắt nghĩa, từ giống nhau gần nhau', 'Chỉ đếm từ', 'Luôn thưa hơn', 'Không dùng số'], correctIndex: 0, explanation: 'Embedding là vector dày; từ tương tự có vector gần nhau, nắm bắt ngữ nghĩa.' },
  { id: 'q2', question: 'Skip-gram trong Word2Vec làm gì?', options: ['Dự đoán ngữ cảnh từ một từ', 'Dự đoán một từ từ ngữ cảnh', 'Dịch câu', 'Đếm n-gram'], correctIndex: 0, explanation: 'Skip-gram: cho một từ, dự đoán các từ ngữ cảnh xung quanh (CBOW thì ngược lại).' },
  { id: 'q3', question: 'Hạn chế của Word2Vec/GloVe so với Transformer?', options: ['Không chạy được', 'Mỗi từ chỉ MỘT vector, bỏ qua ngữ cảnh câu', 'Quá nhiều vector cho một từ', 'Không nắm được đồng nghĩa'], correctIndex: 1, explanation: 'Embedding tĩnh cho mỗi từ một vector cố định, không phân biệt nghĩa theo ngữ cảnh.' },
]);

const c4 = doc('nlp301c-4-1-lm-rnn', '4.1 — Language models & RNN/LSTM|||4.1 — Mô hình ngôn ngữ & RNN/LSTM',
  'Mô hình ngôn ngữ (dự đoán từ kế tiếp), n-gram LM; RNN xử lý chuỗi, vanishing gradient; LSTM/GRU với cổng nhớ; ví dụ Keras.',
  [[
    `<span class="eyebrow">NLP301c · Chapter 4 · Lesson 4.1</span>
<h2>Language models &amp; RNN/LSTM</h2>
<h3>What is a language model?</h3>
<p>A <strong>language model (LM)</strong> assigns a probability to a sequence of words — in practice, it predicts the <strong>next word</strong> given the previous ones. Autocomplete, translation and ChatGPT are all built on this.</p>
<h3>From n-grams to neural LMs</h3>
<p>Classic n-gram LMs count word sequences but can only look back a few words. <strong>Recurrent Neural Networks (RNNs)</strong> process a sequence one token at a time, carrying a <em>hidden state</em> (memory) forward.</p>
<h3>The vanishing gradient problem</h3>
<p>Plain RNNs forget long-range context — gradients shrink over many steps. <strong>LSTM</strong> (Long Short-Term Memory) and <strong>GRU</strong> add <em>gates</em> that decide what to keep, forget and output, so they remember much longer.</p>
<pre><code>from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, LSTM, Dense

model = Sequential([
    Embedding(input_dim=10000, output_dim=128),
    LSTM(256),                 # gated memory over the sequence
    Dense(10000, activation="softmax")   # predict next word
])
model.compile(loss="categorical_crossentropy", optimizer="adam")
</code></pre>
<div class="callout"><span class="badge">Key limit</span> RNN/LSTM read tokens <strong>sequentially</strong>, so they are slow to train and still struggle with very long dependencies. Attention (next chapter) removes the sequential bottleneck.</div>`,
    `<span class="eyebrow">NLP301c · Chương 4 · Bài 4.1</span>
<h2>Mô hình ngôn ngữ &amp; RNN/LSTM</h2>
<h3>Mô hình ngôn ngữ là gì?</h3>
<p>Một <strong>mô hình ngôn ngữ (LM)</strong> gán xác suất cho một chuỗi từ — thực tế là dự đoán <strong>từ kế tiếp</strong> dựa trên các từ trước. Gợi ý gõ, dịch máy và ChatGPT đều xây trên nền này.</p>
<h3>Từ n-gram tới LM nơ-ron</h3>
<p>LM n-gram cổ điển đếm chuỗi từ nhưng chỉ nhìn lại được vài từ. <strong>Mạng nơ-ron hồi tiếp (RNN)</strong> xử lý chuỗi từng token một, mang theo một <em>trạng thái ẩn</em> (bộ nhớ) về phía trước.</p>
<h3>Vấn đề vanishing gradient</h3>
<p>RNN thường quên ngữ cảnh xa — gradient teo dần qua nhiều bước. <strong>LSTM</strong> (Bộ nhớ dài-ngắn hạn) và <strong>GRU</strong> thêm các <em>cổng</em> quyết định giữ, quên và xuất gì, nên nhớ được lâu hơn nhiều.</p>
<pre><code>from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, LSTM, Dense

model = Sequential([
    Embedding(input_dim=10000, output_dim=128),
    LSTM(256),                 # bộ nhớ có cổng qua chuỗi
    Dense(10000, activation="softmax")   # dự đoán từ kế tiếp
])
model.compile(loss="categorical_crossentropy", optimizer="adam")
</code></pre>
<div class="callout"><span class="badge">Giới hạn chính</span> RNN/LSTM đọc token <strong>tuần tự</strong>, nên huấn luyện chậm và vẫn khó với phụ thuộc rất xa. Attention (chương sau) gỡ nút thắt tuần tự này.</div>`,
  ]]);

const c4q = quiz('nlp301c-quiz-4', 'Quiz 4 — LM & RNN|||Quiz 4 — Mô hình ngôn ngữ & RNN', [
  { id: 'q1', question: 'Nhiệm vụ cốt lõi của mô hình ngôn ngữ là?', options: ['Dịch câu', 'Dự đoán từ kế tiếp / gán xác suất cho chuỗi từ', 'Đếm ký tự', 'Xoá dấu câu'], correctIndex: 1, explanation: 'LM gán xác suất cho chuỗi, thường bằng cách dự đoán từ kế tiếp.' },
  { id: 'q2', question: 'LSTM/GRU giải quyết vấn đề nào của RNN thường?', options: ['Quá nhiều tham số', 'Vanishing gradient / quên ngữ cảnh xa nhờ các cổng nhớ', 'Không đọc được token', 'Không cần embedding'], correctIndex: 1, explanation: 'Cổng trong LSTM/GRU giúp giữ thông tin dài hạn, giảm vanishing gradient.' },
  { id: 'q3', question: 'Hạn chế lớn của RNN/LSTM mà attention gỡ bỏ?', options: ['Đọc token tuần tự nên chậm, khó phụ thuộc rất xa', 'Không dùng được GPU', 'Không dự đoán được từ', 'Chỉ chạy tiếng Anh'], correctIndex: 0, explanation: 'RNN xử lý tuần tự; attention cho phép nhìn toàn chuỗi song song.' },
]);

const c5 = doc('nlp301c-5-1-attention-transformer', '5.1 — Attention & the Transformer|||5.1 — Cơ chế attention & Transformer',
  'Cơ chế attention (Q/K/V), self-attention, multi-head; kiến trúc Transformer (encoder-decoder), positional encoding; "Attention Is All You Need".',
  [[
    `<span class="eyebrow">NLP301c · Chapter 5 · Lesson 5.1</span>
<h2>Attention &amp; the Transformer</h2>
<h3>The attention mechanism</h3>
<p><strong>Attention</strong> lets a model, when processing one token, look at <em>all</em> other tokens and weigh how relevant each is. It uses three vectors per token — <strong>Query, Key, Value (Q, K, V)</strong>: the score is how well a Query matches each Key, and those scores weight the Values.</p>
<h3>Self-attention &amp; multi-head</h3>
<p><strong>Self-attention</strong> relates every token in a sentence to every other — resolving "it" to the right noun, for instance. <strong>Multi-head</strong> attention runs several attention layers in parallel to capture different relationships.</p>
<h3>The Transformer (2017)</h3>
<p>The paper <em>"Attention Is All You Need"</em> dropped recurrence entirely. A Transformer stacks self-attention + feed-forward layers, processes all tokens <strong>in parallel</strong> (fast on GPUs), and adds <strong>positional encoding</strong> so order is not lost.</p>
<pre><code># Scaled dot-product attention (conceptual)
# scores = softmax( (Q . K^T) / sqrt(d_k) )
# output = scores . V
import torch, torch.nn.functional as F

def attention(Q, K, V):
    d_k = Q.size(-1)
    scores = (Q @ K.transpose(-2, -1)) / (d_k ** 0.5)
    return F.softmax(scores, dim=-1) @ V
</code></pre>
<div class="callout"><span class="badge">Turning point</span> The Transformer is the architecture behind BERT, GPT and every modern LLM — parallel, scalable, and able to model long-range context directly.</div>`,
    `<span class="eyebrow">NLP301c · Chương 5 · Bài 5.1</span>
<h2>Cơ chế attention &amp; Transformer</h2>
<h3>Cơ chế attention</h3>
<p><strong>Attention</strong> cho phép mô hình, khi xử lý một token, nhìn <em>tất cả</em> token khác và cân xem mỗi cái liên quan bao nhiêu. Nó dùng ba vector cho mỗi token — <strong>Query, Key, Value (Q, K, V)</strong>: điểm số là mức khớp giữa Query và mỗi Key, các điểm đó gán trọng số cho Value.</p>
<h3>Self-attention &amp; multi-head</h3>
<p><strong>Self-attention</strong> liên hệ mọi token trong câu với mọi token khác — vd giải quyết "it" trỏ về đúng danh từ. <strong>Multi-head</strong> chạy nhiều lớp attention song song để nắm nhiều mối quan hệ khác nhau.</p>
<h3>Transformer (2017)</h3>
<p>Bài báo <em>"Attention Is All You Need"</em> loại bỏ hoàn toàn hồi tiếp. Transformer xếp chồng lớp self-attention + feed-forward, xử lý mọi token <strong>song song</strong> (nhanh trên GPU), và thêm <strong>positional encoding</strong> để không mất thứ tự.</p>
<pre><code># Scaled dot-product attention (khái niệm)
# scores = softmax( (Q . K^T) / sqrt(d_k) )
# output = scores . V
import torch, torch.nn.functional as F

def attention(Q, K, V):
    d_k = Q.size(-1)
    scores = (Q @ K.transpose(-2, -1)) / (d_k ** 0.5)
    return F.softmax(scores, dim=-1) @ V
</code></pre>
<div class="callout"><span class="badge">Bước ngoặt</span> Transformer là kiến trúc đằng sau BERT, GPT và mọi LLM hiện đại — song song, mở rộng được, và mô hình hoá ngữ cảnh xa trực tiếp.</div>`,
  ]]);

const c5q = quiz('nlp301c-quiz-5', 'Quiz 5 — Attention & Transformer|||Quiz 5 — Attention & Transformer', [
  { id: 'q1', question: 'Attention dùng ba vector nào cho mỗi token?', options: ['Input, Output, Hidden', 'Query, Key, Value (Q, K, V)', 'Stem, Lemma, Token', 'TF, IDF, BoW'], correctIndex: 1, explanation: 'Attention tính điểm khớp Query-Key rồi dùng nó gán trọng số cho Value.' },
  { id: 'q2', question: 'Vì sao Transformer nhanh hơn RNN khi huấn luyện?', options: ['Ít tham số hơn', 'Xử lý mọi token song song, không tuần tự', 'Không cần GPU', 'Bỏ qua ngữ cảnh'], correctIndex: 1, explanation: 'Transformer bỏ hồi tiếp, xử lý toàn chuỗi song song nên tận dụng GPU tốt.' },
  { id: 'q3', question: 'Positional encoding trong Transformer để làm gì?', options: ['Nén mô hình', 'Cung cấp thông tin thứ tự token (vì attention không có thứ tự sẵn)', 'Bỏ stopword', 'Tăng learning rate'], correctIndex: 1, explanation: 'Vì attention xử lý song song, positional encoding gắn thông tin vị trí vào token.' },
]);

const c6 = doc('nlp301c-6-1-pretrained', '6.1 — Pretrained models (BERT, GPT) & fine-tuning|||6.1 — Mô hình tiền huấn luyện (BERT, GPT) & fine-tuning',
  'Học chuyển giao (pretrain → fine-tune); BERT (encoder, masked LM, hai chiều) vs GPT (decoder, sinh văn bản); fine-tune với HuggingFace.',
  [[
    `<span class="eyebrow">NLP301c · Chapter 6 · Lesson 6.1</span>
<h2>Pretrained models &amp; fine-tuning</h2>
<h3>Transfer learning</h3>
<p>Instead of training from scratch, we <strong>pretrain</strong> a huge Transformer on massive raw text (learning general language), then <strong>fine-tune</strong> it on a small labeled dataset for a specific task. This is why NLP exploded after 2018.</p>
<h3>BERT vs GPT</h3>
<ul>
<li><strong>BERT</strong> — an <em>encoder</em>, trained with <strong>masked language modeling</strong> (predict hidden words). It sees context in <em>both</em> directions, great for understanding tasks (classification, NER, QA).</li>
<li><strong>GPT</strong> — a <em>decoder</em>, trained to predict the next token left-to-right. Great for <em>generation</em> (writing, chat, code).</li>
</ul>
<pre><code>from transformers import pipeline

# Zero-code use of a pretrained model:
fill = pipeline("fill-mask", model="bert-base-uncased")
fill("Natural language [MASK] is fun.")
# -> 'processing' (top prediction)

# Fine-tuning uses Trainer / AutoModelForSequenceClassification
</code></pre>
<div class="callout"><span class="badge">Rule of thumb</span> Need to <strong>understand</strong> text (label, extract)? Reach for a BERT-style encoder. Need to <strong>generate</strong> text? Reach for a GPT-style decoder.</div>`,
    `<span class="eyebrow">NLP301c · Chương 6 · Bài 6.1</span>
<h2>Mô hình tiền huấn luyện &amp; fine-tuning</h2>
<h3>Học chuyển giao (transfer learning)</h3>
<p>Thay vì huấn luyện từ đầu, ta <strong>tiền huấn luyện (pretrain)</strong> một Transformer khổng lồ trên lượng văn bản thô cực lớn (học ngôn ngữ tổng quát), rồi <strong>fine-tune</strong> nó trên tập gán nhãn nhỏ cho một tác vụ cụ thể. Đây là lý do NLP bùng nổ sau 2018.</p>
<h3>BERT vs GPT</h3>
<ul>
<li><strong>BERT</strong> — một <em>encoder</em>, huấn luyện bằng <strong>masked language modeling</strong> (dự đoán từ bị che). Nó nhìn ngữ cảnh <em>cả hai</em> chiều, hợp với tác vụ hiểu (phân loại, NER, hỏi đáp).</li>
<li><strong>GPT</strong> — một <em>decoder</em>, huấn luyện dự đoán token kế tiếp từ trái sang phải. Hợp với <em>sinh</em> văn bản (viết, chat, code).</li>
</ul>
<pre><code>from transformers import pipeline

# Dùng mô hình tiền huấn luyện không cần viết code huấn luyện:
fill = pipeline("fill-mask", model="bert-base-uncased")
fill("Natural language [MASK] is fun.")
# -> 'processing' (dự đoán hàng đầu)

# Fine-tune dùng Trainer / AutoModelForSequenceClassification
</code></pre>
<div class="callout"><span class="badge">Nguyên tắc nhanh</span> Cần <strong>hiểu</strong> văn bản (gán nhãn, trích xuất)? Dùng encoder kiểu BERT. Cần <strong>sinh</strong> văn bản? Dùng decoder kiểu GPT.</div>`,
  ]]);

const c6q = quiz('nlp301c-quiz-6', 'Quiz 6 — Pretrained models|||Quiz 6 — Mô hình tiền huấn luyện', [
  { id: 'q1', question: 'Fine-tuning trong NLP nghĩa là?', options: ['Huấn luyện lại từ đầu', 'Tinh chỉnh mô hình đã pretrain cho tác vụ cụ thể với ít dữ liệu gán nhãn', 'Xoá bớt tham số', 'Dịch mô hình sang tiếng khác'], correctIndex: 1, explanation: 'Pretrain học ngôn ngữ tổng quát; fine-tune tinh chỉnh cho tác vụ riêng.' },
  { id: 'q2', question: 'BERT được huấn luyện chủ yếu bằng?', options: ['Dự đoán token kế tiếp trái-phải', 'Masked language modeling (dự đoán từ bị che), hai chiều', 'Dịch máy', 'TF-IDF'], correctIndex: 1, explanation: 'BERT là encoder, dùng masked LM, nhìn ngữ cảnh hai chiều.' },
  { id: 'q3', question: 'Nên chọn mô hình kiểu GPT khi?', options: ['Cần sinh văn bản (viết, chat, code)', 'Cần phân loại nhanh', 'Cần đếm từ', 'Cần bỏ stopword'], correctIndex: 0, explanation: 'GPT là decoder, dự đoán token kế tiếp, hợp cho sinh văn bản.' },
]);

const c7 = doc('nlp301c-7-1-tasks', '7.1 — NLP tasks: classification, NER, sentiment, MT, QA|||7.1 — Tác vụ NLP: phân loại, NER, sentiment, dịch máy, QA',
  'Phân loại văn bản, nhận diện thực thể (NER), phân tích cảm xúc (sentiment), dịch máy (MT), hỏi đáp (QA); pipeline HuggingFace/spaCy.',
  [[
    `<span class="eyebrow">NLP301c · Chapter 7 · Lesson 7.1</span>
<h2>Core NLP tasks</h2>
<ul>
<li><strong>Text classification</strong> — assign a label to a document (spam/not, topic).</li>
<li><strong>Named Entity Recognition (NER)</strong> — find and type spans: people, places, organizations, dates.</li>
<li><strong>Sentiment analysis</strong> — is the opinion positive, negative or neutral?</li>
<li><strong>Machine Translation (MT)</strong> — translate between languages (usually encoder-decoder).</li>
<li><strong>Question Answering (QA)</strong> — return an answer, either extracted from a passage or generated.</li>
</ul>
<pre><code>from transformers import pipeline

clf = pipeline("sentiment-analysis")
clf("I love this course!")
# [{'label': 'POSITIVE', 'score': 0.99}]

ner = pipeline("ner", grouped_entities=True)
ner("Alan Turing worked in London.")
# -> Alan Turing (PER), London (LOC)
</code></pre>
<h3>With spaCy</h3>
<pre><code>import spacy
nlp = spacy.load("en_core_web_sm")
doc = nlp("Apple was founded in California in 1976.")
for ent in doc.ents:
    print(ent.text, ent.label_)
# Apple ORG | California GPE | 1976 DATE
</code></pre>
<div class="callout"><span class="badge">One backbone, many tasks</span> The same pretrained Transformer, with a small task-specific head, powers all of these — that shared backbone is the reason modern NLP is so productive.</div>`,
    `<span class="eyebrow">NLP301c · Chương 7 · Bài 7.1</span>
<h2>Các tác vụ NLP cốt lõi</h2>
<ul>
<li><strong>Phân loại văn bản</strong> — gán nhãn cho một văn bản (spam/không, chủ đề).</li>
<li><strong>Nhận diện thực thể (NER)</strong> — tìm và gắn loại cho các cụm: người, nơi chốn, tổ chức, ngày tháng.</li>
<li><strong>Phân tích cảm xúc (sentiment)</strong> — ý kiến tích cực, tiêu cực hay trung tính?</li>
<li><strong>Dịch máy (MT)</strong> — dịch giữa các ngôn ngữ (thường dùng encoder-decoder).</li>
<li><strong>Hỏi đáp (QA)</strong> — trả về câu trả lời, hoặc trích từ đoạn văn hoặc sinh ra.</li>
</ul>
<pre><code>from transformers import pipeline

clf = pipeline("sentiment-analysis")
clf("I love this course!")
# [{'label': 'POSITIVE', 'score': 0.99}]

ner = pipeline("ner", grouped_entities=True)
ner("Alan Turing worked in London.")
# -> Alan Turing (PER), London (LOC)
</code></pre>
<h3>Với spaCy</h3>
<pre><code>import spacy
nlp = spacy.load("en_core_web_sm")
doc = nlp("Apple was founded in California in 1976.")
for ent in doc.ents:
    print(ent.text, ent.label_)
# Apple ORG | California GPE | 1976 DATE
</code></pre>
<div class="callout"><span class="badge">Một bộ khung, nhiều tác vụ</span> Cùng một Transformer tiền huấn luyện, gắn thêm một "đầu" nhỏ theo tác vụ, chạy được tất cả những việc trên — chính bộ khung dùng chung đó khiến NLP hiện đại rất năng suất.</div>`,
  ]]);

const c7q = quiz('nlp301c-quiz-7', 'Quiz 7 — NLP tasks|||Quiz 7 — Tác vụ NLP', [
  { id: 'q1', question: 'NER (Named Entity Recognition) làm gì?', options: ['Dịch câu', 'Tìm và gắn loại cho các cụm như người, nơi chốn, tổ chức, ngày', 'Đếm từ', 'Nén văn bản'], correctIndex: 1, explanation: 'NER trích xuất & phân loại thực thể có tên trong văn bản.' },
  { id: 'q2', question: 'Dịch máy (MT) thường dùng kiến trúc nào?', options: ['Chỉ encoder', 'Encoder-decoder', 'Chỉ TF-IDF', 'Chỉ n-gram'], correctIndex: 1, explanation: 'MT thường dùng encoder-decoder: encode câu nguồn, decode ra câu đích.' },
  { id: 'q3', question: 'Phân tích cảm xúc (sentiment analysis) trả về?', options: ['Danh từ trong câu', 'Cực tính ý kiến: tích cực / tiêu cực / trung tính', 'Số token', 'Bản dịch'], correctIndex: 1, explanation: 'Sentiment phân loại thái độ/ý kiến của văn bản.' },
]);

const c8 = doc('nlp301c-8-1-llm-rag-ethics', '8.1 — LLMs, prompt engineering, RAG & ethics|||8.1 — LLM, prompt engineering, RAG & đạo đức/thiên lệch',
  'LLM (GPT-4, Llama...); prompt engineering (zero/few-shot, chain-of-thought); RAG (truy hồi + sinh) chống ảo giác; thiên lệch, ảo giác, đạo đức NLP.',
  [[
    `<span class="eyebrow">NLP301c · Chapter 8 · Lesson 8.1</span>
<h2>LLMs, prompt engineering, RAG &amp; ethics</h2>
<h3>Large Language Models (LLMs)</h3>
<p>Scaling GPT-style Transformers to billions of parameters and vast data yields <strong>LLMs</strong> (GPT-4, Llama, Claude) that can follow instructions, reason, write code and converse — often with no task-specific training.</p>
<h3>Prompt engineering</h3>
<ul>
<li><strong>Zero-shot</strong> — just ask.</li>
<li><strong>Few-shot</strong> — give a few examples in the prompt.</li>
<li><strong>Chain-of-thought</strong> — ask the model to "think step by step" to improve reasoning.</li>
</ul>
<h3>Retrieval-Augmented Generation (RAG)</h3>
<p>LLMs can <strong>hallucinate</strong> (state false facts confidently). <strong>RAG</strong> retrieves relevant documents (via embedding similarity) and feeds them into the prompt, so the model answers from real sources — grounding it and reducing hallucination.</p>
<pre><code># RAG in one breath:
# 1. embed the user question
# 2. search a vector DB for the closest document chunks
# 3. put those chunks + question into the prompt
# 4. the LLM answers grounded in retrieved text
</code></pre>
<h3>Ethics &amp; bias</h3>
<p>Models trained on human text absorb its <strong>biases</strong> (gender, race, culture) and can produce toxic or unfair output. Responsible NLP means measuring bias, protecting privacy, being transparent about limits, and keeping a human in the loop for high-stakes decisions.</p>
<div class="callout"><span class="badge">Takeaway</span> LLMs are powerful but fallible — <strong>ground them (RAG), prompt them well, and evaluate for bias and harm</strong> before you ship.</div>`,
    `<span class="eyebrow">NLP301c · Chương 8 · Bài 8.1</span>
<h2>LLM, prompt engineering, RAG &amp; đạo đức</h2>
<h3>Mô hình ngôn ngữ lớn (LLM)</h3>
<p>Mở rộng Transformer kiểu GPT lên hàng tỉ tham số và dữ liệu khổng lồ tạo ra <strong>LLM</strong> (GPT-4, Llama, Claude) có thể làm theo hướng dẫn, suy luận, viết code và trò chuyện — thường không cần huấn luyện riêng cho tác vụ.</p>
<h3>Prompt engineering</h3>
<ul>
<li><strong>Zero-shot</strong> — hỏi thẳng, không ví dụ.</li>
<li><strong>Few-shot</strong> — cho vài ví dụ trong prompt.</li>
<li><strong>Chain-of-thought</strong> — yêu cầu mô hình "suy nghĩ từng bước" để cải thiện suy luận.</li>
</ul>
<h3>Sinh có truy hồi (RAG)</h3>
<p>LLM có thể <strong>ảo giác (hallucinate)</strong> (khẳng định sai một cách tự tin). <strong>RAG</strong> truy hồi các tài liệu liên quan (qua độ tương đồng embedding) rồi đưa vào prompt, để mô hình trả lời dựa trên nguồn thật — bám thực tế và giảm ảo giác.</p>
<pre><code># RAG trong một hơi:
# 1. embed câu hỏi của người dùng
# 2. tìm trong vector DB các mẩu tài liệu gần nhất
# 3. đưa các mẩu đó + câu hỏi vào prompt
# 4. LLM trả lời bám vào văn bản đã truy hồi
</code></pre>
<h3>Đạo đức &amp; thiên lệch</h3>
<p>Mô hình học từ văn bản của con người sẽ hấp thụ <strong>thiên lệch</strong> (giới, chủng tộc, văn hoá) và có thể sinh nội dung độc hại hoặc thiếu công bằng. NLP có trách nhiệm nghĩa là đo thiên lệch, bảo vệ quyền riêng tư, minh bạch về giới hạn, và giữ con người trong vòng quyết định quan trọng.</p>
<div class="callout"><span class="badge">Điều cần nhớ</span> LLM mạnh nhưng dễ sai — <strong>bám nguồn (RAG), viết prompt tốt, và đánh giá thiên lệch/tác hại</strong> trước khi đưa ra dùng.</div>`,
  ]]);

const c8q = quiz('nlp301c-quiz-8', 'Quiz 8 — LLM, RAG & ethics|||Quiz 8 — LLM, RAG & đạo đức', [
  { id: 'q1', question: 'RAG (Retrieval-Augmented Generation) giúp gì cho LLM?', options: ['Tăng số tham số', 'Truy hồi tài liệu thật đưa vào prompt để bám nguồn, giảm ảo giác', 'Dịch nhanh hơn', 'Bỏ stopword'], correctIndex: 1, explanation: 'RAG lấy tài liệu liên quan (qua embedding) đưa vào prompt để mô hình trả lời có căn cứ.' },
  { id: 'q2', question: 'Kỹ thuật "chain-of-thought" trong prompt engineering là?', options: ['Cho vài ví dụ mẫu', 'Yêu cầu mô hình suy nghĩ từng bước để cải thiện suy luận', 'Nén prompt', 'Xoá ngữ cảnh'], correctIndex: 1, explanation: 'Chain-of-thought hướng mô hình lập luận từng bước, tăng độ chính xác suy luận.' },
  { id: 'q3', question: 'Vì sao NLP có trách nhiệm quan tâm tới thiên lệch (bias)?', options: ['Vì mô hình học từ văn bản người nên hấp thụ thiên lệch, có thể sinh nội dung thiếu công bằng', 'Vì bias làm mô hình chạy chậm', 'Vì bias tăng số token', 'Không cần quan tâm'], correctIndex: 0, explanation: 'Mô hình phản ánh thiên lệch trong dữ liệu huấn luyện; cần đo & giảm để công bằng, an toàn.' },
]);

export default {
  semester: { code: 'FPTU_Hola6', name: 'Kỳ 6 — Thực tập', ordinal: 8 },
  course: {
    courseCode: 'NLP301c',
    slug: 'nlp301c-natural-language-processing',
    title: 'Natural Language Processing',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/NLP301c.webp',
    shortDescription: 'NLP from text preprocessing & TF-IDF to word embeddings, RNN/LSTM, Transformers, BERT/GPT fine-tuning, NLP tasks, LLMs, prompt engineering & RAG. Bilingual, with Python (NLTK/spaCy/HuggingFace) examples & quizzes.|||NLP từ tiền xử lý văn bản & TF-IDF tới word embeddings, RNN/LSTM, Transformer, fine-tune BERT/GPT, tác vụ NLP, LLM, prompt engineering & RAG. Song ngữ, ví dụ Python (NLTK/spaCy/HuggingFace) & quiz.',
    description: 'Môn <strong>NLP301c — Natural Language Processing</strong> (ngành Robotics &amp; AI) giúp máy tính đọc, hiểu và sinh ngôn ngữ con người. Từ <strong>tiền xử lý</strong> (tokenization, stemming, lemmatization) &amp; <strong>biểu diễn văn bản</strong> (BoW, TF-IDF, n-gram) → <strong>word embeddings</strong> (Word2Vec, GloVe) → <strong>mô hình ngôn ngữ &amp; RNN/LSTM</strong> → <strong>attention &amp; Transformer</strong> → <strong>mô hình tiền huấn luyện</strong> (BERT, GPT) &amp; fine-tuning → <strong>tác vụ NLP</strong> (phân loại, NER, sentiment, dịch máy, QA) → <strong>LLM, prompt engineering, RAG &amp; đạo đức</strong>. Bám giáo trình Jurafsky &amp; Martin, Stanford CS224N và HuggingFace, song ngữ, có ví dụ Python và quiz mỗi chương.',
    whatYouLearn: 'Pipeline NLP & tiền xử lý (tokenization, stemming, lemmatization); BoW, TF-IDF, n-gram; word embeddings (Word2Vec CBOW/Skip-gram, GloVe, số học vector); mô hình ngôn ngữ, RNN/LSTM/GRU & vanishing gradient; cơ chế attention (Q/K/V), self-attention, Transformer & positional encoding; học chuyển giao, BERT vs GPT, fine-tuning với HuggingFace; tác vụ phân loại, NER, sentiment, dịch máy, QA; LLM, prompt engineering (zero/few-shot, chain-of-thought), RAG và thiên lệch/đạo đức NLP.',
    requirements: 'Biết Python cơ bản; nền tảng học máy (machine learning) và đại số tuyến tính/xác suất căn bản. Nên có tài khoản Google Colab hoặc GPU để chạy ví dụ HuggingFace.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình chuẩn (Jurafsky & Martin, CS224N, HuggingFace), tài liệu miễn phí, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'NLP là gì, vì sao ngôn ngữ khó, lộ trình môn học.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan & tiền xử lý|||Chapter 1 — Overview & preprocessing', description: 'Tokenization, stemming, lemmatization, stopword.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Biểu diễn văn bản|||Chapter 2 — Text representation', description: 'BoW, TF-IDF, n-gram.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Word embeddings|||Chapter 3 — Word embeddings', description: 'Word2Vec, GloVe, số học vector.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Mô hình ngôn ngữ & RNN/LSTM|||Chapter 4 — Language models & RNN/LSTM', description: 'LM, RNN, LSTM/GRU, vanishing gradient.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Attention & Transformer|||Chapter 5 — Attention & Transformer', description: 'Q/K/V, self-attention, Transformer, positional encoding.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Mô hình tiền huấn luyện|||Chapter 6 — Pretrained models', description: 'Transfer learning, BERT vs GPT, fine-tuning.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Tác vụ NLP|||Chapter 7 — NLP tasks', description: 'Phân loại, NER, sentiment, dịch máy, QA.', lessons: [c7, c7q] },
    { title: 'Chương 8 — LLM, RAG & đạo đức|||Chapter 8 — LLMs, RAG & ethics', description: 'LLM, prompt engineering, RAG, thiên lệch/đạo đức.', lessons: [c8, c8q] },
  ],
};
