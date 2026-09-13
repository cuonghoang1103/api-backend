/**
 * NLP401 — Natural Language Processing (Xử lý ngôn ngữ tự nhiên). Ngành Khoa học
 * Máy tính FPTU, Kỳ 5. Khung 8 chương bám giáo trình chuẩn quốc tế:
 * Jurafsky & Martin "Speech and Language Processing", Manning "Foundations of
 * Statistical NLP", Hugging Face course, spaCy/NLTK docs, Stanford CS224n.
 * Song ngữ VI+EN, mỗi chương có khối code Python minh hoạ + quiz 3 câu.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${ ; & → &amp; trong HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('nlp401-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình chuẩn (Jurafsky & Martin, Manning), khoá Hugging Face, tài liệu spaCy/NLTK, Stanford CS224n, lộ trình tự học 4 bước.',
  [[
    `<span class="eyebrow">NLP401 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Natural Language Processing — from text preprocessing to Transformers — in one place. The official FPTU slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources used worldwide.</p>
<h3>📘 Core textbooks</h3>
<ul>
<li><a href="https://web.stanford.edu/~jurafsky/slp3/" target="_blank" rel="noopener"><em>Speech and Language Processing</em> — Jurafsky &amp; Martin</a> (free draft, the standard NLP text)</li>
<li><a href="https://nlp.stanford.edu/fsnlp/" target="_blank" rel="noopener"><em>Foundations of Statistical NLP</em> — Manning &amp; Schütze</a></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://huggingface.co/learn/nlp-course" target="_blank" rel="noopener">Hugging Face NLP Course</a> — hands-on Transformers</li>
<li><a href="https://spacy.io/usage" target="_blank" rel="noopener">spaCy documentation</a> · <a href="https://www.nltk.org/" target="_blank" rel="noopener">NLTK documentation</a></li>
<li><a href="https://web.stanford.edu/class/cs224n/" target="_blank" rel="noopener">Stanford CS224n — NLP with Deep Learning</a></li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/playlist?list=PLoROMvodv4rOSH4v6133s9LFPRHjEmbmJ" target="_blank" rel="noopener">Stanford CS224n lectures</a></li>
<li><a href="https://www.youtube.com/@HuggingFace" target="_blank" rel="noopener">Hugging Face channel</a></li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — what NLP is, tokenization, normalization, bag-of-words &amp; TF-IDF.</li>
<li><strong>Representation</strong> — word embeddings (Word2Vec, GloVe), vector similarity.</li>
<li><strong>Models</strong> — n-gram &amp; Naive Bayes, RNN/LSTM sequence models, then Transformers (BERT/GPT).</li>
<li><strong>Job-ready</strong> — fine-tune a pretrained model with Hugging Face and mind bias &amp; ethics.</li>
</ol></div>`,
    `<span class="eyebrow">NLP401 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Xử lý ngôn ngữ tự nhiên — từ tiền xử lý văn bản tới Transformer — gom về một chỗ. Slide &amp; giáo trình chính thức của FPTU nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp dùng khắp thế giới.</p>
<h3>📘 Sách nền tảng</h3>
<ul>
<li><a href="https://web.stanford.edu/~jurafsky/slp3/" target="_blank" rel="noopener"><em>Speech and Language Processing</em> — Jurafsky &amp; Martin</a> (bản nháp miễn phí, sách NLP chuẩn)</li>
<li><a href="https://nlp.stanford.edu/fsnlp/" target="_blank" rel="noopener"><em>Foundations of Statistical NLP</em> — Manning &amp; Schütze</a></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://huggingface.co/learn/nlp-course" target="_blank" rel="noopener">Khoá NLP của Hugging Face</a> — thực hành Transformer</li>
<li><a href="https://spacy.io/usage" target="_blank" rel="noopener">Tài liệu spaCy</a> · <a href="https://www.nltk.org/" target="_blank" rel="noopener">Tài liệu NLTK</a></li>
<li><a href="https://web.stanford.edu/class/cs224n/" target="_blank" rel="noopener">Stanford CS224n — NLP với học sâu</a></li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/playlist?list=PLoROMvodv4rOSH4v6133s9LFPRHjEmbmJ" target="_blank" rel="noopener">Bài giảng Stanford CS224n</a></li>
<li><a href="https://www.youtube.com/@HuggingFace" target="_blank" rel="noopener">Kênh Hugging Face</a></li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — NLP là gì, tokenization, chuẩn hoá, bag-of-words &amp; TF-IDF.</li>
<li><strong>Biểu diễn</strong> — word embeddings (Word2Vec, GloVe), độ tương tự vector.</li>
<li><strong>Mô hình</strong> — n-gram &amp; Naive Bayes, mô hình chuỗi RNN/LSTM, rồi Transformer (BERT/GPT).</li>
<li><strong>Sẵn sàng đi làm</strong> — fine-tune mô hình tiền huấn luyện với Hugging Face và lưu ý bias &amp; đạo đức.</li>
</ol></div>`,
  ]]);

const intro = doc('nlp401-0-1-overview', 'Course overview: Natural Language Processing|||Tổng quan: Xử lý ngôn ngữ tự nhiên',
  'NLP làm gì; vì sao ngôn ngữ khó với máy; lộ trình: tiền xử lý → biểu diễn → embeddings → mô hình ngôn ngữ & phân loại → mô hình chuỗi → Transformer → ứng dụng & đạo đức.',
  [[
    `<span class="eyebrow">NLP401 · Lesson 0.1 · Overview</span>
<h2>Natural Language Processing</h2>
<p class="lead">NLP is the field that lets computers <strong>read, understand and generate human language</strong> — the technology behind search engines, translation, chatbots, spam filters and modern assistants. This course builds it up from raw text to Transformers.</p>
<h3>Why is language hard for machines?</h3>
<ul>
<li><strong>Ambiguity</strong> — "I saw a bat" (animal or sports gear?). Meaning depends on context.</li>
<li><strong>Variation</strong> — the same idea has countless wordings; spelling, slang and typos vary.</li>
<li><strong>Structure</strong> — word order and grammar carry meaning that a bag of words loses.</li>
</ul>
<h3>Roadmap</h3>
<p>Preprocessing (tokenize, normalize) → representation (bag-of-words, TF-IDF) → word embeddings (Word2Vec, GloVe) → language models &amp; classification → sequence models (RNN/LSTM) → Transformers (BERT/GPT) → applications &amp; ethics. Bilingual, with runnable Python and a quiz each chapter.</p>`,
    `<span class="eyebrow">NLP401 · Bài 0.1 · Tổng quan</span>
<h2>Xử lý ngôn ngữ tự nhiên</h2>
<p class="lead">NLP là lĩnh vực giúp máy tính <strong>đọc, hiểu và sinh ngôn ngữ con người</strong> — công nghệ đằng sau công cụ tìm kiếm, dịch máy, chatbot, lọc thư rác và trợ lý hiện đại. Môn này dựng từ văn bản thô tới Transformer.</p>
<h3>Vì sao ngôn ngữ khó với máy?</h3>
<ul>
<li><strong>Nhập nhằng</strong> — "con la" (con vật hay cái gì?). Nghĩa phụ thuộc ngữ cảnh.</li>
<li><strong>Biến thể</strong> — cùng một ý có vô số cách diễn đạt; chính tả, tiếng lóng, lỗi gõ đều khác nhau.</li>
<li><strong>Cấu trúc</strong> — trật tự từ và ngữ pháp mang nghĩa mà một túi từ (bag of words) làm mất.</li>
</ul>
<h3>Lộ trình</h3>
<p>Tiền xử lý (tokenize, chuẩn hoá) → biểu diễn (bag-of-words, TF-IDF) → word embeddings (Word2Vec, GloVe) → mô hình ngôn ngữ &amp; phân loại → mô hình chuỗi (RNN/LSTM) → Transformer (BERT/GPT) → ứng dụng &amp; đạo đức. Song ngữ, có code Python chạy được và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('nlp401-1-1-intro', '1.1 — Introduction to NLP|||1.1 — Nhập môn NLP',
  'NLP là gì; các nhiệm vụ NLP (phân loại, NER, dịch, tóm tắt, QA); thách thức của ngôn ngữ; ứng dụng thực tế; pipeline NLP điển hình.',
  [[
    `<span class="eyebrow">NLP401 · Chapter 1 · Lesson 1.1</span>
<h2>Introduction to NLP</h2>
<h3>Core NLP tasks</h3>
<ul>
<li><strong>Text classification</strong> — spam vs ham, topic, sentiment.</li>
<li><strong>Sequence labeling</strong> — POS tagging, Named Entity Recognition (NER).</li>
<li><strong>Generation</strong> — machine translation, summarization, chatbots, question answering.</li>
</ul>
<h3>The NLP pipeline</h3>
<p>Most systems share a shape: <strong>raw text → preprocessing → representation (features/vectors) → model → prediction</strong>. Each chapter of this course fills in one stage of that pipeline.</p>
<pre><code>text = "NLP turns language into data."

# 1. preprocess: split into tokens
tokens = text.lower().replace(".", "").split()
# -> ['nlp', 'turns', 'language', 'into', 'data']

# 2. represent: map tokens to numbers (see Ch3)
# 3. model: feed vectors to a classifier / network (Ch5-7)
# 4. predict: label, translation, summary, ...
print(len(tokens), "tokens")</code></pre>
<div class="callout"><span class="badge">Key idea</span> NLP is the bridge from messy human text to numbers a model can learn from — get the pipeline right and the model choice becomes easier.</div>`,
    `<span class="eyebrow">NLP401 · Chương 1 · Bài 1.1</span>
<h2>Nhập môn NLP</h2>
<h3>Các nhiệm vụ NLP cốt lõi</h3>
<ul>
<li><strong>Phân loại văn bản</strong> — thư rác hay không, chủ đề, cảm xúc.</li>
<li><strong>Gán nhãn chuỗi</strong> — gán từ loại (POS), nhận dạng thực thể (NER).</li>
<li><strong>Sinh văn bản</strong> — dịch máy, tóm tắt, chatbot, hỏi đáp.</li>
</ul>
<h3>Pipeline NLP</h3>
<p>Hầu hết hệ thống có chung một hình: <strong>văn bản thô → tiền xử lý → biểu diễn (đặc trưng/vector) → mô hình → dự đoán</strong>. Mỗi chương của môn lấp đầy một chặng trong pipeline đó.</p>
<pre><code>text = "NLP turns language into data."

# 1. tiền xử lý: tách thành token
tokens = text.lower().replace(".", "").split()
# -> ['nlp', 'turns', 'language', 'into', 'data']

# 2. biểu diễn: ánh xạ token thành số (xem Ch3)
# 3. mô hình: đưa vector vào bộ phân loại / mạng (Ch5-7)
# 4. dự đoán: nhãn, bản dịch, tóm tắt, ...
print(len(tokens), "tokens")</code></pre>
<div class="callout"><span class="badge">Ý chính</span> NLP là cây cầu từ văn bản người lộn xộn sang những con số mà mô hình học được — làm đúng pipeline thì việc chọn mô hình dễ hơn.</div>`,
  ]]);

const c1q = quiz('nlp401-quiz-1', 'Quiz 1 — Intro to NLP|||Quiz 1 — Nhập môn NLP', [
  { id: 'q1', question: 'Which is a core NLP task?|||Đâu là một nhiệm vụ NLP cốt lõi?', options: ['Named Entity Recognition (NER)|||Nhận dạng thực thể (NER)', 'Sorting an array|||Sắp xếp mảng', 'Rendering 3D graphics|||Kết xuất đồ hoạ 3D', 'Compiling code|||Biên dịch mã'], correctIndex: 0, explanation: 'NER (gán nhãn thực thể như tên người, địa danh) là nhiệm vụ NLP kinh điển.' },
  { id: 'q2', question: 'What is the usual order of an NLP pipeline?|||Thứ tự thông thường của một pipeline NLP?', options: ['model → text → predict|||mô hình → văn bản → dự đoán', 'raw text → preprocess → represent → model → predict|||văn bản thô → tiền xử lý → biểu diễn → mô hình → dự đoán', 'predict → represent → text|||dự đoán → biểu diễn → văn bản', 'represent → text → preprocess|||biểu diễn → văn bản → tiền xử lý'], correctIndex: 1, explanation: 'Pipeline điển hình: thô → tiền xử lý → biểu diễn → mô hình → dự đoán.' },
  { id: 'q3', question: 'Why is language hard for machines?|||Vì sao ngôn ngữ khó với máy?', options: ['It is always unambiguous|||Nó luôn rõ nghĩa', 'Ambiguity and variation make meaning context-dependent|||Nhập nhằng và biến thể khiến nghĩa phụ thuộc ngữ cảnh', 'Computers cannot store text|||Máy không lưu được văn bản', 'There are too few words|||Có quá ít từ'], correctIndex: 1, explanation: 'Nhập nhằng, biến thể và cấu trúc làm nghĩa phụ thuộc ngữ cảnh.' },
]);

const c2 = doc('nlp401-2-1-preprocessing', '2.1 — Text preprocessing|||2.1 — Tiền xử lý văn bản',
  'Tokenization, normalization (lowercase/bỏ dấu câu), stemming vs lemmatization, loại stopword; đặc thù tiếng Việt (tách từ, dấu, không tách theo khoảng trắng).',
  [[
    `<span class="eyebrow">NLP401 · Chapter 2 · Lesson 2.1</span>
<h2>Text preprocessing</h2>
<h3>The cleaning steps</h3>
<ul>
<li><strong>Tokenization</strong> — split text into tokens (words, subwords, punctuation).</li>
<li><strong>Normalization</strong> — lowercase, strip punctuation, expand or unify variants.</li>
<li><strong>Stemming vs lemmatization</strong> — stemming chops crudely ("studies" → "studi"); lemmatization returns the dictionary form ("studies" → "study").</li>
<li><strong>Stopword removal</strong> — drop high-frequency low-signal words ("the", "is").</li>
</ul>
<h3>Vietnamese is different</h3>
<p>Vietnamese words are NOT separated by spaces at the word level — "học sinh" is one word made of two syllables. Splitting on spaces breaks meaning, so use a word segmenter (VnCoreNLP, underthesea) and keep the diacritics.</p>
<pre><code>import nltk
from nltk.stem import WordNetLemmatizer

text = "The studies were running fast"
tokens = nltk.word_tokenize(text.lower())
lem = WordNetLemmatizer()
clean = [lem.lemmatize(t, pos="v") for t in tokens]
print(clean)
# -> ['the', 'study', 'be', 'run', 'fast']</code></pre>
<div class="callout"><span class="badge">Rule of thumb</span> Lemmatization beats stemming when you need real words; for Vietnamese, segment first — do not split on whitespace.</div>`,
    `<span class="eyebrow">NLP401 · Chương 2 · Bài 2.1</span>
<h2>Tiền xử lý văn bản</h2>
<h3>Các bước làm sạch</h3>
<ul>
<li><strong>Tokenization</strong> — tách văn bản thành token (từ, subword, dấu câu).</li>
<li><strong>Chuẩn hoá</strong> — viết thường, bỏ dấu câu, gộp các biến thể.</li>
<li><strong>Stemming vs lemmatization</strong> — stemming cắt thô ("studies" → "studi"); lemmatization trả về dạng từ điển ("studies" → "study").</li>
<li><strong>Loại stopword</strong> — bỏ từ tần suất cao ít thông tin ("the", "is").</li>
</ul>
<h3>Tiếng Việt thì khác</h3>
<p>Từ tiếng Việt KHÔNG tách bằng khoảng trắng ở mức từ — "học sinh" là một từ gồm hai âm tiết. Tách theo khoảng trắng làm hỏng nghĩa, nên dùng bộ tách từ (VnCoreNLP, underthesea) và giữ nguyên dấu.</p>
<pre><code>import nltk
from nltk.stem import WordNetLemmatizer

text = "The studies were running fast"
tokens = nltk.word_tokenize(text.lower())
lem = WordNetLemmatizer()
clean = [lem.lemmatize(t, pos="v") for t in tokens]
print(clean)
# -> ['the', 'study', 'be', 'run', 'fast']</code></pre>
<div class="callout"><span class="badge">Mẹo</span> Lemmatization hơn stemming khi cần từ thật; với tiếng Việt hãy tách từ trước — đừng tách theo khoảng trắng.</div>`,
  ]]);

const c2q = quiz('nlp401-quiz-2', 'Quiz 2 — Preprocessing|||Quiz 2 — Tiền xử lý', [
  { id: 'q1', question: 'What does tokenization do?|||Tokenization làm gì?', options: ['Encrypts the text|||Mã hoá văn bản', 'Splits text into tokens (words/subwords)|||Tách văn bản thành token (từ/subword)', 'Translates the text|||Dịch văn bản', 'Compresses the file|||Nén tệp'], correctIndex: 1, explanation: 'Tokenization tách văn bản thành các đơn vị token.' },
  { id: 'q2', question: 'Lemmatization differs from stemming because it…|||Lemmatization khác stemming ở chỗ…', options: ['returns a real dictionary word|||trả về từ thật trong từ điển', 'always removes vowels|||luôn bỏ nguyên âm', 'is only for numbers|||chỉ dùng cho số', 'deletes stopwords|||xoá stopword'], correctIndex: 0, explanation: 'Lemmatization trả dạng từ điển; stemming chỉ cắt thô.' },
  { id: 'q3', question: 'Why not split Vietnamese on whitespace?|||Vì sao không tách tiếng Việt theo khoảng trắng?', options: ['Vietnamese has no spaces|||Tiếng Việt không có khoảng trắng', 'A word can span several space-separated syllables|||Một từ có thể trải trên nhiều âm tiết cách nhau bởi khoảng trắng', 'It is too slow|||Vì quá chậm', 'Spaces are punctuation|||Khoảng trắng là dấu câu'], correctIndex: 1, explanation: 'Một từ như "học sinh" gồm nhiều âm tiết cách nhau bởi khoảng trắng, cần bộ tách từ.' },
]);

const c3 = doc('nlp401-3-1-representation', '3.1 — Text representation|||3.1 — Biểu diễn văn bản',
  'Biến văn bản thành vector: one-hot, bag-of-words (đếm từ), n-gram (giữ cụm), TF-IDF (trọng số theo độ hiếm); ưu nhược và khi nào dùng.',
  [[
    `<span class="eyebrow">NLP401 · Chapter 3 · Lesson 3.1</span>
<h2>Text representation</h2>
<p>Models need numbers, not words. Classic ways to vectorize text:</p>
<ul>
<li><strong>One-hot</strong> — each word is a vector with a single 1; no notion of similarity.</li>
<li><strong>Bag-of-words (BoW)</strong> — count how often each word appears; ignores order.</li>
<li><strong>N-grams</strong> — count short sequences ("new york") to keep some order.</li>
<li><strong>TF-IDF</strong> — weight each word by term frequency times inverse document frequency, so rare-but-telling words score higher than common ones.</li>
</ul>
<pre><code>from sklearn.feature_extraction.text import TfidfVectorizer

docs = ["nlp is fun", "nlp is hard", "cats are fun"]
vec = TfidfVectorizer()
X = vec.fit_transform(docs)
print(vec.get_feature_names_out())
# -> ['are' 'cats' 'fun' 'hard' 'is' 'nlp']
print(X.shape)   # (3 docs, 6 terms)</code></pre>
<div class="callout"><span class="badge">TF-IDF intuition</span> A word that appears in every document (like "is") carries little signal; TF-IDF down-weights it and lifts words specific to one document.</div>`,
    `<span class="eyebrow">NLP401 · Chương 3 · Bài 3.1</span>
<h2>Biểu diễn văn bản</h2>
<p>Mô hình cần số, không cần chữ. Các cách vector hoá văn bản kinh điển:</p>
<ul>
<li><strong>One-hot</strong> — mỗi từ là vector có đúng một số 1; không có khái niệm tương tự.</li>
<li><strong>Bag-of-words (BoW)</strong> — đếm số lần mỗi từ xuất hiện; bỏ qua trật tự.</li>
<li><strong>N-gram</strong> — đếm các cụm ngắn ("new york") để giữ một phần trật tự.</li>
<li><strong>TF-IDF</strong> — cân mỗi từ bằng tần suất từ nhân nghịch tần suất tài liệu, nên từ hiếm mà giàu thông tin có điểm cao hơn từ phổ biến.</li>
</ul>
<pre><code>from sklearn.feature_extraction.text import TfidfVectorizer

docs = ["nlp is fun", "nlp is hard", "cats are fun"]
vec = TfidfVectorizer()
X = vec.fit_transform(docs)
print(vec.get_feature_names_out())
# -> ['are' 'cats' 'fun' 'hard' 'is' 'nlp']
print(X.shape)   # (3 tài liệu, 6 từ)</code></pre>
<div class="callout"><span class="badge">Trực giác TF-IDF</span> Từ xuất hiện ở mọi tài liệu (như "is") mang ít thông tin; TF-IDF hạ trọng số nó và nâng những từ đặc trưng cho một tài liệu.</div>`,
  ]]);

const c3q = quiz('nlp401-quiz-3', 'Quiz 3 — Representation|||Quiz 3 — Biểu diễn văn bản', [
  { id: 'q1', question: 'Bag-of-words ignores what?|||Bag-of-words bỏ qua điều gì?', options: ['Word counts|||Số lần xuất hiện từ', 'Word order|||Trật tự từ', 'The vocabulary|||Bộ từ vựng', 'Document length|||Độ dài tài liệu'], correctIndex: 1, explanation: 'BoW chỉ đếm từ, bỏ qua trật tự.' },
  { id: 'q2', question: 'TF-IDF gives HIGHER weight to words that are…|||TF-IDF cho trọng số CAO hơn với từ…', options: ['common across all documents|||phổ biến ở mọi tài liệu', 'rare but frequent in one document|||hiếm nhưng nhiều trong một tài liệu', 'the shortest|||ngắn nhất', 'stopwords|||là stopword'], correctIndex: 1, explanation: 'TF-IDF nâng từ hiếm-mà-đặc-trưng, hạ từ phổ biến.' },
  { id: 'q3', question: 'What do n-grams help preserve?|||N-gram giúp giữ lại điều gì?', options: ['Some word order via short sequences|||Một phần trật tự từ qua các cụm ngắn', 'File size|||Kích thước tệp', 'The language of the text|||Ngôn ngữ của văn bản', 'Nothing|||Không gì cả'], correctIndex: 0, explanation: 'N-gram đếm cụm liền kề nên giữ được một phần trật tự.' },
]);

const c4 = doc('nlp401-4-1-embeddings', '4.1 — Word embeddings|||4.1 — Word embeddings',
  'Vector dày mang nghĩa: Word2Vec (skip-gram/CBOW), GloVe; không gian vector và độ tương tự cosine; số học vector (king − man + woman ≈ queen).',
  [[
    `<span class="eyebrow">NLP401 · Chapter 4 · Lesson 4.1</span>
<h2>Word embeddings</h2>
<p>BoW and TF-IDF give sparse vectors with no sense of meaning: "cat" and "kitten" are as unrelated as "cat" and "car". <strong>Word embeddings</strong> fix this — each word becomes a dense vector (say 100–300 numbers) learned so that words used in similar contexts sit close together.</p>
<ul>
<li><strong>Word2Vec</strong> — predicts a word from its neighbours (CBOW) or neighbours from a word (skip-gram).</li>
<li><strong>GloVe</strong> — factorizes a global word co-occurrence matrix.</li>
<li><strong>Similarity</strong> — measured by cosine of the angle between two vectors (1 = identical direction).</li>
</ul>
<pre><code>import numpy as np

def cosine(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

king  = np.array([0.8, 0.6, 0.1])
queen = np.array([0.7, 0.7, 0.1])
car   = np.array([0.1, 0.2, 0.9])
print(round(cosine(king, queen), 2))  # ~0.99  (close)
print(round(cosine(king, car), 2))    # ~0.30  (far)</code></pre>
<div class="callout"><span class="badge">Famous property</span> Vector arithmetic captures analogies: king − man + woman lands near queen. Meaning becomes geometry.</div>`,
    `<span class="eyebrow">NLP401 · Chương 4 · Bài 4.1</span>
<h2>Word embeddings</h2>
<p>BoW và TF-IDF cho vector thưa không mang nghĩa: "cat" và "kitten" xa lạ như "cat" với "car". <strong>Word embeddings</strong> khắc phục điều đó — mỗi từ thành một vector dày (100–300 số) được học sao cho các từ dùng trong ngữ cảnh giống nhau nằm gần nhau.</p>
<ul>
<li><strong>Word2Vec</strong> — dự đoán từ từ các từ lân cận (CBOW) hoặc lân cận từ một từ (skip-gram).</li>
<li><strong>GloVe</strong> — phân rã ma trận đồng xuất hiện toàn cục của từ.</li>
<li><strong>Độ tương tự</strong> — đo bằng cosine của góc giữa hai vector (1 = cùng hướng).</li>
</ul>
<pre><code>import numpy as np

def cosine(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

king  = np.array([0.8, 0.6, 0.1])
queen = np.array([0.7, 0.7, 0.1])
car   = np.array([0.1, 0.2, 0.9])
print(round(cosine(king, queen), 2))  # ~0.99  (gần)
print(round(cosine(king, car), 2))    # ~0.30  (xa)</code></pre>
<div class="callout"><span class="badge">Tính chất nổi tiếng</span> Số học vector nắm được phép loại suy: king − man + woman rơi gần queen. Nghĩa trở thành hình học.</div>`,
  ]]);

const c4q = quiz('nlp401-quiz-4', 'Quiz 4 — Embeddings|||Quiz 4 — Word embeddings', [
  { id: 'q1', question: 'What is a word embedding?|||Word embedding là gì?', options: ['A dense vector capturing meaning|||Một vector dày mang nghĩa', 'A compressed image|||Một ảnh nén', 'A grammar rule|||Một quy tắc ngữ pháp', 'A stopword list|||Một danh sách stopword'], correctIndex: 0, explanation: 'Embedding là vector dày, các từ gần nghĩa nằm gần nhau.' },
  { id: 'q2', question: 'Which measures similarity between two embeddings?|||Đại lượng nào đo độ tương tự giữa hai embedding?', options: ['Cosine similarity|||Độ tương tự cosine', 'File size|||Kích thước tệp', 'Word length|||Độ dài từ', 'Alphabetical order|||Thứ tự bảng chữ cái'], correctIndex: 0, explanation: 'Cosine của góc giữa hai vector đo độ tương tự hướng.' },
  { id: 'q3', question: 'Word2Vec learns embeddings by…|||Word2Vec học embedding bằng cách…', options: ['predicting words from their context|||dự đoán từ dựa trên ngữ cảnh', 'sorting the vocabulary|||sắp xếp bộ từ vựng', 'counting characters|||đếm ký tự', 'translating text|||dịch văn bản'], correctIndex: 0, explanation: 'Word2Vec (CBOW/skip-gram) học từ quan hệ từ và ngữ cảnh lân cận.' },
]);

const c5 = doc('nlp401-5-1-lm-classification', '5.1 — Language models & text classification|||5.1 — Mô hình ngôn ngữ & phân loại',
  'Mô hình ngôn ngữ n-gram (xác suất từ kế tiếp); phân loại văn bản với Naive Bayes; ứng dụng phân tích cảm xúc (sentiment); đánh giá.',
  [[
    `<span class="eyebrow">NLP401 · Chapter 5 · Lesson 5.1</span>
<h2>Language models &amp; text classification</h2>
<h3>N-gram language models</h3>
<p>A <strong>language model</strong> assigns a probability to the next word given the previous ones. An <strong>n-gram</strong> model approximates this with the last n−1 words: P(word | previous n−1 words). It powers autocomplete and old-school translation.</p>
<h3>Text classification with Naive Bayes</h3>
<p>Naive Bayes applies Bayes rule assuming words are independent given the class. Despite the naive assumption it is a strong, fast baseline for spam detection and <strong>sentiment analysis</strong>.</p>
<pre><code>from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB

texts  = ["I love this", "great movie", "I hate it", "awful film"]
labels = ["pos", "pos", "neg", "neg"]
X = CountVectorizer().fit_transform(texts)
clf = MultinomialNB().fit(X, labels)
print(clf.predict(X)[:2])   # -> ['pos' 'pos']</code></pre>
<div class="callout"><span class="badge">Evaluate honestly</span> Report accuracy, precision, recall and F1 on a held-out set — accuracy alone hides failures on imbalanced data.</div>`,
    `<span class="eyebrow">NLP401 · Chương 5 · Bài 5.1</span>
<h2>Mô hình ngôn ngữ &amp; phân loại</h2>
<h3>Mô hình ngôn ngữ n-gram</h3>
<p>Một <strong>mô hình ngôn ngữ</strong> gán xác suất cho từ kế tiếp dựa trên các từ trước. Mô hình <strong>n-gram</strong> xấp xỉ bằng n−1 từ gần nhất: P(từ | n−1 từ trước). Nó chạy autocomplete và dịch máy kiểu cũ.</p>
<h3>Phân loại văn bản với Naive Bayes</h3>
<p>Naive Bayes áp dụng quy tắc Bayes với giả định các từ độc lập khi biết lớp. Dù giả định ngây thơ, nó là baseline mạnh và nhanh cho lọc thư rác và <strong>phân tích cảm xúc</strong>.</p>
<pre><code>from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB

texts  = ["I love this", "great movie", "I hate it", "awful film"]
labels = ["pos", "pos", "neg", "neg"]
X = CountVectorizer().fit_transform(texts)
clf = MultinomialNB().fit(X, labels)
print(clf.predict(X)[:2])   # -> ['pos' 'pos']</code></pre>
<div class="callout"><span class="badge">Đánh giá trung thực</span> Báo cáo accuracy, precision, recall và F1 trên tập giữ riêng — chỉ nhìn accuracy sẽ giấu lỗi trên dữ liệu mất cân bằng.</div>`,
  ]]);

const c5q = quiz('nlp401-quiz-5', 'Quiz 5 — LM & classification|||Quiz 5 — Mô hình NN & phân loại', [
  { id: 'q1', question: 'What does a language model do?|||Mô hình ngôn ngữ làm gì?', options: ['Assigns probabilities to sequences of words|||Gán xác suất cho chuỗi từ', 'Sorts documents|||Sắp xếp tài liệu', 'Encrypts text|||Mã hoá văn bản', 'Removes stopwords|||Xoá stopword'], correctIndex: 0, explanation: 'LM gán xác suất cho từ/chuỗi kế tiếp.' },
  { id: 'q2', question: 'The "naive" assumption in Naive Bayes is that…|||Giả định "ngây thơ" của Naive Bayes là…', options: ['words are independent given the class|||các từ độc lập khi biết lớp', 'all classes are equal|||mọi lớp bằng nhau', 'text has no order|||văn bản không có trật tự', 'data is always balanced|||dữ liệu luôn cân bằng'], correctIndex: 0, explanation: 'Naive Bayes giả định độc lập có điều kiện giữa các từ.' },
  { id: 'q3', question: 'On imbalanced data you should also report…|||Với dữ liệu mất cân bằng nên báo cáo thêm…', options: ['only accuracy|||chỉ accuracy', 'precision, recall and F1|||precision, recall và F1', 'file size|||kích thước tệp', 'vocabulary size|||kích thước từ vựng'], correctIndex: 1, explanation: 'Precision/recall/F1 lộ ra lỗi mà accuracy che giấu.' },
]);

const c6 = doc('nlp401-6-1-sequence-models', '6.1 — Sequence models (RNN/LSTM)|||6.1 — Mô hình chuỗi (RNN/LSTM)',
  'Mạng hồi quy RNN xử lý chuỗi theo thứ tự; vấn đề gradient tiêu biến; LSTM với cổng nhớ; ứng dụng POS tagging và NER (tổng quan).',
  [[
    `<span class="eyebrow">NLP401 · Chapter 6 · Lesson 6.1</span>
<h2>Sequence models: RNN &amp; LSTM</h2>
<p>BoW throws away order; language is a sequence. A <strong>Recurrent Neural Network (RNN)</strong> reads tokens one at a time, keeping a hidden state that carries context forward — ideal for POS tagging and NER, where each token gets a label.</p>
<ul>
<li><strong>Vanishing gradients</strong> — plain RNNs forget long-range context.</li>
<li><strong>LSTM</strong> — adds input/forget/output gates and a cell memory that keeps information over long spans.</li>
<li><strong>Sequence labeling</strong> — output one label per token: DET, NOUN, VERB (POS) or PERSON, LOC, ORG (NER).</li>
</ul>
<pre><code>import torch
import torch.nn as nn

lstm = nn.LSTM(input_size=8, hidden_size=16, batch_first=True)
# batch of 1 sentence, 5 tokens, each an 8-dim embedding
x = torch.randn(1, 5, 8)
out, (h, c) = lstm(x)
print(out.shape)   # (1, 5, 16) -> a vector per token
# feed 'out' to a linear layer -> one tag per token</code></pre>
<div class="callout"><span class="badge">Why LSTM</span> The memory cell and gates let the network remember "the movie was NOT good" — where the word five steps back flips the meaning.</div>`,
    `<span class="eyebrow">NLP401 · Chương 6 · Bài 6.1</span>
<h2>Mô hình chuỗi: RNN &amp; LSTM</h2>
<p>BoW vứt bỏ trật tự; ngôn ngữ là một chuỗi. <strong>Mạng hồi quy (RNN)</strong> đọc từng token một, giữ một trạng thái ẩn mang ngữ cảnh về phía trước — lý tưởng cho POS tagging và NER, nơi mỗi token được gán một nhãn.</p>
<ul>
<li><strong>Gradient tiêu biến</strong> — RNN thường quên ngữ cảnh xa.</li>
<li><strong>LSTM</strong> — thêm cổng vào/quên/ra và một ô nhớ giữ thông tin qua đoạn dài.</li>
<li><strong>Gán nhãn chuỗi</strong> — xuất một nhãn cho mỗi token: DET, NOUN, VERB (POS) hoặc PERSON, LOC, ORG (NER).</li>
</ul>
<pre><code>import torch
import torch.nn as nn

lstm = nn.LSTM(input_size=8, hidden_size=16, batch_first=True)
# lô 1 câu, 5 token, mỗi token là embedding 8 chiều
x = torch.randn(1, 5, 8)
out, (h, c) = lstm(x)
print(out.shape)   # (1, 5, 16) -> một vector cho mỗi token
# đưa 'out' vào lớp tuyến tính -> một nhãn cho mỗi token</code></pre>
<div class="callout"><span class="badge">Vì sao LSTM</span> Ô nhớ và các cổng giúp mạng nhớ "the movie was NOT good" — nơi một từ cách năm bước lật ngược nghĩa.</div>`,
  ]]);

const c6q = quiz('nlp401-quiz-6', 'Quiz 6 — Sequence models|||Quiz 6 — Mô hình chuỗi', [
  { id: 'q1', question: 'Why use an RNN over bag-of-words?|||Vì sao dùng RNN thay bag-of-words?', options: ['It processes tokens in order and keeps context|||Nó xử lý token theo thứ tự và giữ ngữ cảnh', 'It is smaller|||Nó nhỏ hơn', 'It ignores order|||Nó bỏ qua trật tự', 'It needs no data|||Nó không cần dữ liệu'], correctIndex: 0, explanation: 'RNN đọc chuỗi theo thứ tự, giữ trạng thái ẩn mang ngữ cảnh.' },
  { id: 'q2', question: 'What problem does the LSTM address?|||LSTM giải quyết vấn đề gì?', options: ['Vanishing gradients / forgetting long context|||Gradient tiêu biến / quên ngữ cảnh xa', 'Slow disk I/O|||Đĩa chậm', 'Too many stopwords|||Quá nhiều stopword', 'Missing punctuation|||Thiếu dấu câu'], correctIndex: 0, explanation: 'Cổng nhớ của LSTM giữ thông tin qua đoạn dài, chống tiêu biến gradient.' },
  { id: 'q3', question: 'NER and POS tagging are examples of…|||NER và POS tagging là ví dụ của…', options: ['sequence labeling (one label per token)|||gán nhãn chuỗi (một nhãn mỗi token)', 'image classification|||phân loại ảnh', 'file compression|||nén tệp', 'sorting|||sắp xếp'], correctIndex: 0, explanation: 'Cả hai gán một nhãn cho mỗi token trong chuỗi.' },
]);

const c7 = doc('nlp401-7-1-transformers', '7.1 — Transformers & large models|||7.1 — Transformer & mô hình lớn',
  'Cơ chế attention (self-attention); kiến trúc Transformer thay RNN; BERT (encoder, hiểu) vs GPT (decoder, sinh); pretraining rồi fine-tuning.',
  [[
    `<span class="eyebrow">NLP401 · Chapter 7 · Lesson 7.1</span>
<h2>Transformers &amp; large models</h2>
<h3>Attention</h3>
<p>RNNs read one token at a time and struggle with long range. The <strong>Transformer</strong> replaces recurrence with <strong>self-attention</strong>: every token looks at every other token at once and weighs how relevant each is. This is parallel, fast, and captures long-distance links.</p>
<h3>BERT vs GPT</h3>
<ul>
<li><strong>BERT</strong> — an encoder trained to fill in masked words; great at understanding tasks (classification, NER, QA).</li>
<li><strong>GPT</strong> — a decoder trained to predict the next word; great at generation.</li>
</ul>
<h3>Pretraining then fine-tuning</h3>
<p>Train once on huge unlabeled text (pretraining), then adapt cheaply to your task on a small labeled set (fine-tuning) — the workflow behind almost every modern NLP system.</p>
<pre><code>from transformers import pipeline

clf = pipeline("sentiment-analysis")   # loads a pretrained model
print(clf("This course is amazing!"))
# -> [{'label': 'POSITIVE', 'score': 0.99}]</code></pre>
<div class="callout"><span class="badge">Turning point</span> "Attention is all you need" (2017) launched BERT, GPT and today large language models. Pretrain once, fine-tune many times.</div>`,
    `<span class="eyebrow">NLP401 · Chương 7 · Bài 7.1</span>
<h2>Transformer &amp; mô hình lớn</h2>
<h3>Attention</h3>
<p>RNN đọc từng token và chật vật với khoảng cách xa. <strong>Transformer</strong> thay hồi quy bằng <strong>self-attention</strong>: mỗi token nhìn mọi token khác cùng lúc và cân xem cái nào liên quan. Cách này song song, nhanh, và nắm được liên kết xa.</p>
<h3>BERT vs GPT</h3>
<ul>
<li><strong>BERT</strong> — encoder huấn luyện điền từ bị che; mạnh ở nhiệm vụ hiểu (phân loại, NER, QA).</li>
<li><strong>GPT</strong> — decoder huấn luyện dự đoán từ kế tiếp; mạnh ở sinh văn bản.</li>
</ul>
<h3>Pretraining rồi fine-tuning</h3>
<p>Huấn luyện một lần trên khối văn bản khổng lồ không nhãn (pretraining), rồi thích nghi rẻ cho nhiệm vụ của bạn trên tập nhỏ có nhãn (fine-tuning) — quy trình sau gần như mọi hệ NLP hiện đại.</p>
<pre><code>from transformers import pipeline

clf = pipeline("sentiment-analysis")   # nạp mô hình tiền huấn luyện
print(clf("This course is amazing!"))
# -> [{'label': 'POSITIVE', 'score': 0.99}]</code></pre>
<div class="callout"><span class="badge">Bước ngoặt</span> "Attention is all you need" (2017) khai sinh BERT, GPT và các mô hình ngôn ngữ lớn hôm nay. Pretrain một lần, fine-tune nhiều lần.</div>`,
  ]]);

const c7q = quiz('nlp401-quiz-7', 'Quiz 7 — Transformers|||Quiz 7 — Transformer', [
  { id: 'q1', question: 'What does self-attention let each token do?|||Self-attention cho mỗi token làm gì?', options: ['Look at all other tokens and weigh their relevance|||Nhìn mọi token khác và cân độ liên quan', 'Ignore the rest of the sentence|||Bỏ qua phần còn lại của câu', 'Only see the previous token|||Chỉ thấy token liền trước', 'Delete stopwords|||Xoá stopword'], correctIndex: 0, explanation: 'Self-attention cho mỗi token cân trọng số mọi token khác cùng lúc.' },
  { id: 'q2', question: 'BERT is best suited to…|||BERT hợp nhất với…', options: ['understanding tasks (classification, NER, QA)|||nhiệm vụ hiểu (phân loại, NER, QA)', 'rendering video|||dựng video', 'sorting files|||sắp xếp tệp', 'compressing images|||nén ảnh'], correctIndex: 0, explanation: 'BERT là encoder, mạnh ở các nhiệm vụ hiểu.' },
  { id: 'q3', question: 'Fine-tuning means…|||Fine-tuning nghĩa là…', options: ['adapting a pretrained model to a specific task|||thích nghi mô hình tiền huấn luyện cho một nhiệm vụ cụ thể', 'training from scratch every time|||huấn luyện lại từ đầu mỗi lần', 'deleting the model|||xoá mô hình', 'removing punctuation|||bỏ dấu câu'], correctIndex: 0, explanation: 'Fine-tuning điều chỉnh mô hình đã pretrain trên tập nhỏ có nhãn.' },
]);

const c8 = doc('nlp401-8-1-applications-ethics', '8.1 — Applications & ethics|||8.1 — Ứng dụng & đạo đức',
  'Ứng dụng: dịch máy, tóm tắt, chatbot, hỏi đáp (QA); rủi ro: bias trong dữ liệu, ảo giác (hallucination), quyền riêng tư; đạo đức khi dùng LLM.',
  [[
    `<span class="eyebrow">NLP401 · Chapter 8 · Lesson 8.1</span>
<h2>Applications &amp; ethics</h2>
<h3>Where NLP is used</h3>
<ul>
<li><strong>Machine translation</strong> — cross-language communication.</li>
<li><strong>Summarization</strong> — condense long documents.</li>
<li><strong>Chatbots &amp; QA</strong> — answer questions, assist users.</li>
</ul>
<h3>Ethics &amp; risks of large models</h3>
<ul>
<li><strong>Bias</strong> — models absorb the stereotypes in their training data and can amplify them.</li>
<li><strong>Hallucination</strong> — LLMs can state false facts fluently and confidently.</li>
<li><strong>Privacy</strong> — training text may leak personal data; be careful what you send.</li>
</ul>
<pre><code>from transformers import pipeline

summarize = pipeline("summarization")
article = "NLP lets computers process human language. " * 5
print(summarize(article, max_length=20, min_length=5))
# always review the output: check facts, watch for bias</code></pre>
<div class="callout"><span class="badge">Build responsibly</span> Measure bias, keep a human in the loop for high-stakes decisions, cite sources, and never treat a fluent answer as a verified one.</div>`,
    `<span class="eyebrow">NLP401 · Chương 8 · Bài 8.1</span>
<h2>Ứng dụng &amp; đạo đức</h2>
<h3>NLP dùng ở đâu</h3>
<ul>
<li><strong>Dịch máy</strong> — giao tiếp xuyên ngôn ngữ.</li>
<li><strong>Tóm tắt</strong> — cô đọng tài liệu dài.</li>
<li><strong>Chatbot &amp; hỏi đáp</strong> — trả lời câu hỏi, hỗ trợ người dùng.</li>
</ul>
<h3>Đạo đức &amp; rủi ro của mô hình lớn</h3>
<ul>
<li><strong>Bias (thiên lệch)</strong> — mô hình hấp thụ định kiến trong dữ liệu huấn luyện và có thể khuếch đại chúng.</li>
<li><strong>Ảo giác (hallucination)</strong> — LLM có thể nói sai sự thật một cách trôi chảy, tự tin.</li>
<li><strong>Quyền riêng tư</strong> — văn bản huấn luyện có thể rò rỉ dữ liệu cá nhân; cẩn thận với thứ bạn gửi.</li>
</ul>
<pre><code>from transformers import pipeline

summarize = pipeline("summarization")
article = "NLP lets computers process human language. " * 5
print(summarize(article, max_length=20, min_length=5))
# luôn soi kết quả: kiểm tra sự thật, cảnh giác bias</code></pre>
<div class="callout"><span class="badge">Xây dựng có trách nhiệm</span> Đo bias, giữ con người trong vòng lặp cho quyết định hệ trọng, dẫn nguồn, và đừng coi một câu trả lời trôi chảy là đã kiểm chứng.</div>`,
  ]]);

const c8q = quiz('nlp401-quiz-8', 'Quiz 8 — Applications & ethics|||Quiz 8 — Ứng dụng & đạo đức', [
  { id: 'q1', question: 'Which is an NLP application?|||Đâu là một ứng dụng NLP?', options: ['Machine translation|||Dịch máy', 'Disk defragmentation|||Chống phân mảnh đĩa', 'Battery charging|||Sạc pin', 'Image resizing|||Đổi cỡ ảnh'], correctIndex: 0, explanation: 'Dịch máy, tóm tắt, chatbot, QA đều là ứng dụng NLP.' },
  { id: 'q2', question: 'What is model "hallucination"?|||"Ảo giác" của mô hình là gì?', options: ['Confidently stating false information|||Nói sai sự thật một cách tự tin', 'Running out of memory|||Hết bộ nhớ', 'A slow network|||Mạng chậm', 'A syntax error|||Lỗi cú pháp'], correctIndex: 0, explanation: 'Hallucination là khi LLM sinh thông tin sai mà nghe rất tự tin.' },
  { id: 'q3', question: 'Why does an NLP model exhibit bias?|||Vì sao một mô hình NLP có bias?', options: ['It absorbs stereotypes present in its training data|||Nó hấp thụ định kiến có trong dữ liệu huấn luyện', 'It has too few parameters|||Vì có quá ít tham số', 'It runs on a GPU|||Vì chạy trên GPU', 'It uses tokenization|||Vì dùng tokenization'], correctIndex: 0, explanation: 'Mô hình học từ dữ liệu; định kiến trong dữ liệu bị hấp thụ và có thể khuếch đại.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'NLP401',
    slug: 'nlp401-natural-language-processing',
    title: 'Natural Language Processing',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/NLP401.webp',
    shortDescription: 'Natural Language Processing — NLP tasks & challenges, text preprocessing, TF-IDF, word embeddings, language models & classification, RNN/LSTM, Transformers & BERT/GPT, applications & AI ethics. Bilingual, with Python examples & quizzes.|||Xử lý ngôn ngữ tự nhiên — nhiệm vụ & thách thức, tiền xử lý, TF-IDF, word embeddings, mô hình ngôn ngữ & phân loại, RNN/LSTM, Transformer & BERT/GPT, ứng dụng & đạo đức AI. Song ngữ, có ví dụ Python & quiz.',
    description: 'Môn <strong>NLP401 — Natural Language Processing (Xử lý ngôn ngữ tự nhiên)</strong> thuộc ngành Khoa học Máy tính, kỳ 5. Từ <strong>nhập môn NLP &amp; pipeline</strong> → <strong>tiền xử lý</strong> (tokenization, chuẩn hoá, tiếng Việt) → <strong>biểu diễn</strong> (bag-of-words, TF-IDF, n-gram) → <strong>word embeddings</strong> (Word2Vec, GloVe) → <strong>mô hình ngôn ngữ &amp; phân loại</strong> (n-gram, Naive Bayes, sentiment) → <strong>mô hình chuỗi</strong> (RNN/LSTM, POS/NER) → <strong>Transformer</strong> (attention, BERT/GPT, fine-tuning) → <strong>ứng dụng &amp; đạo đức</strong> (dịch, tóm tắt, chatbot, bias). Bám giáo trình chuẩn quốc tế (Jurafsky &amp; Martin, Manning), song ngữ, có code Python và quiz mỗi chương.',
    whatYouLearn: 'NLP là gì & pipeline; tokenization, chuẩn hoá, stemming/lemmatization, tách từ tiếng Việt; bag-of-words, TF-IDF, n-gram; word embeddings (Word2Vec/GloVe) & độ tương tự cosine; mô hình ngôn ngữ n-gram; phân loại văn bản Naive Bayes & sentiment; RNN/LSTM cho POS tagging & NER; attention & Transformer, BERT vs GPT, pretraining & fine-tuning; dịch máy, tóm tắt, chatbot, QA; bias & đạo đức LLM.',
    requirements: 'Biết lập trình Python cơ bản; xác suất & đại số tuyến tính nhập môn; nên quen máy học cơ bản. Xem điều kiện tiên quyết trong khung ngành Khoa học Máy tính trên FLM.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình chuẩn, khoá Hugging Face, spaCy/NLTK, CS224n, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'NLP là gì, vì sao ngôn ngữ khó, lộ trình.', lessons: [intro] },
    { title: 'Chương 1 — Nhập môn NLP|||Chapter 1 — Introduction to NLP', description: 'Nhiệm vụ NLP, thách thức, ứng dụng, pipeline.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Tiền xử lý văn bản|||Chapter 2 — Text preprocessing', description: 'Tokenization, chuẩn hoá, stemming/lemmatization, tiếng Việt.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Biểu diễn văn bản|||Chapter 3 — Text representation', description: 'Bag-of-words, TF-IDF, n-gram, one-hot.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Word embeddings|||Chapter 4 — Word embeddings', description: 'Word2Vec, GloVe, không gian vector, độ tương tự.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Mô hình ngôn ngữ & phân loại|||Chapter 5 — Language models & classification', description: 'n-gram LM, Naive Bayes, phân loại, sentiment.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Mô hình chuỗi|||Chapter 6 — Sequence models', description: 'RNN, LSTM, POS tagging, NER (tổng quan).', lessons: [c6, c6q] },
    { title: 'Chương 7 — Transformer & mô hình lớn|||Chapter 7 — Transformers & large models', description: 'Attention, Transformer, BERT/GPT, pretraining/fine-tuning.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ứng dụng & đạo đức|||Chapter 8 — Applications & ethics', description: 'Dịch máy, tóm tắt, chatbot, QA, bias & đạo đức LLM.', lessons: [c8, c8q] },
  ],
};
