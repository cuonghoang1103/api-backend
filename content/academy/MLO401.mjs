/**
 * MLO401 — Machine Learning Operations (MLOps). Ngành Khoa học Máy tính FPTU,
 * kỳ 8. Khung 8 chương: MLOps là gì → dữ liệu & feature → huấn luyện & thử
 * nghiệm → đóng gói & versioning → triển khai → CI/CD cho ML → giám sát & vận
 * hành → hạ tầng & quản trị. Sách chuẩn: Chip Huyen "Designing Machine Learning
 * Systems", Burkov "Machine Learning Engineering", Google Cloud MLOps,
 * MLflow/Kubeflow. Song ngữ + code Python/YAML + quiz mỗi chương.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${; "&"→"&amp;".
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('mlo401-0-1-overview', 'Course overview: MLOps|||Tổng quan: MLOps',
  'MLOps là gì và vì sao cần; khác biệt giữa mô hình chạy trong notebook và mô hình phục vụ người dùng thật; vòng đời ML end-to-end; lộ trình 4 bước và bộ công cụ (MLflow, DVC, Docker, Kubernetes, Kubeflow).',
  [[
    `<span class="eyebrow">MLO401 · Lesson 0.1 · Overview</span>
<h2>Machine Learning Operations</h2>
<p class="lead">This course teaches you to <strong>take a model out of a notebook and run it reliably in production</strong> — the discipline called <strong>MLOps</strong>. A model that scores 99% on your laptop is worthless until real users can call it, its predictions stay accurate over time, and a new version can ship without breaking anything.</p>
<h3>The core idea</h3>
<p>Training a model is a small part of a real ML system. Most of the effort is <strong>everything around the model</strong>: collecting and validating data, tracking experiments, packaging the model, serving it, and watching it in production. MLOps applies <strong>DevOps principles</strong> (automation, versioning, testing, monitoring) to machine learning.</p>
<h3>The ML lifecycle</h3>
<pre><code>Data  -&gt;  Features  -&gt;  Train / Experiment  -&gt;  Evaluate
   -&gt;  Package &amp; Register  -&gt;  Deploy (serve)
   -&gt;  Monitor  -&gt;  (drift detected) -&gt;  back to Data
</code></pre>
<p>Notice the loop: production feeds back into data, and the cycle repeats. MLOps is about making that loop <strong>automated, repeatable and observable</strong>.</p>
<h3>Roadmap (4 steps)</h3>
<ol>
<li><strong>Foundations</strong> — what MLOps is, ML vs software, maturity levels.</li>
<li><strong>Build the pipeline</strong> — data &amp; features, training &amp; experiments, packaging.</li>
<li><strong>Ship it</strong> — deployment patterns, CI/CD/CT for ML.</li>
<li><strong>Operate it</strong> — monitoring, drift, retraining, infrastructure &amp; governance.</li>
</ol>
<div class="callout"><span class="badge">Toolbox</span> MLflow (experiments &amp; registry), DVC (data versioning), Docker (packaging), Kubernetes &amp; Kubeflow (orchestration), plus a serving layer (REST API, TF Serving).</div>`,
    `<span class="eyebrow">MLO401 · Bài 0.1 · Tổng quan</span>
<h2>Vận hành học máy (MLOps)</h2>
<p class="lead">Môn này dạy bạn <strong>đưa một mô hình ra khỏi notebook và chạy nó ổn định trên production</strong> — bộ môn gọi là <strong>MLOps</strong>. Một mô hình đạt 99% trên máy bạn vẫn vô giá trị chừng nào người dùng thật chưa gọi được nó, dự đoán chưa giữ được độ chính xác theo thời gian, và bản mới chưa thể phát hành mà không làm hỏng thứ gì.</p>
<h3>Ý tưởng cốt lõi</h3>
<p>Huấn luyện mô hình chỉ là một phần nhỏ của hệ thống ML thật. Phần lớn công sức nằm ở <strong>mọi thứ quanh mô hình</strong>: thu thập và kiểm định dữ liệu, theo dõi thí nghiệm, đóng gói mô hình, phục vụ nó, và giám sát trên production. MLOps áp dụng <strong>nguyên tắc DevOps</strong> (tự động hoá, versioning, kiểm thử, giám sát) vào học máy.</p>
<h3>Vòng đời ML</h3>
<pre><code>Dữ liệu  -&gt;  Feature  -&gt;  Huấn luyện / Thí nghiệm  -&gt;  Đánh giá
   -&gt;  Đóng gói &amp; Đăng ký  -&gt;  Triển khai (phục vụ)
   -&gt;  Giám sát  -&gt;  (phát hiện drift) -&gt;  quay lại Dữ liệu
</code></pre>
<p>Chú ý vòng lặp: production phản hồi ngược về dữ liệu, và chu trình lặp lại. MLOps là làm cho vòng lặp đó <strong>tự động, lặp lại được và quan sát được</strong>.</p>
<h3>Lộ trình (4 bước)</h3>
<ol>
<li><strong>Nền tảng</strong> — MLOps là gì, ML khác phần mềm, các mức trưởng thành.</li>
<li><strong>Dựng pipeline</strong> — dữ liệu &amp; feature, huấn luyện &amp; thí nghiệm, đóng gói.</li>
<li><strong>Đưa lên chạy</strong> — mẫu triển khai, CI/CD/CT cho ML.</li>
<li><strong>Vận hành</strong> — giám sát, drift, huấn luyện lại, hạ tầng &amp; quản trị.</li>
</ol>
<div class="callout"><span class="badge">Bộ công cụ</span> MLflow (thí nghiệm &amp; registry), DVC (versioning dữ liệu), Docker (đóng gói), Kubernetes &amp; Kubeflow (điều phối), cùng một lớp phục vụ (REST API, TF Serving).</div>`,
  ]]);

const c1 = doc('mlo401-1-1-what-is-mlops', '1.1 — What is MLOps|||1.1 — MLOps là gì',
  'ML trong production; ML khác software truyền thống thế nào (dữ liệu là code, hành vi thay đổi theo dữ liệu); các mức trưởng thành MLOps (0/1/2); technical debt ẩn của ML.',
  [[
    `<span class="eyebrow">MLO401 · Chapter 1 · Lesson 1.1</span>
<h2>What is MLOps</h2>
<h3>ML in production is not a notebook</h3>
<p>A research model ends when it prints an accuracy number. A <strong>production</strong> model must accept live requests, return answers in milliseconds, be monitored, and be retrained as the world changes. MLOps is the set of practices that keeps that running.</p>
<h3>ML vs traditional software</h3>
<ul>
<li><strong>Software:</strong> behavior is defined by <em>code</em>. Same input, same output. Tests are deterministic.</li>
<li><strong>ML:</strong> behavior is defined by <em>code + data + model</em>. Change the data and the model changes silently — even with the same code. You must version all three.</li>
</ul>
<h3>MLOps maturity levels</h3>
<pre><code>Level 0 — Manual: notebooks, hand-deploy, no automation.
Level 1 — ML pipeline automation: retrain automatically,
          continuous training (CT) triggered by new data.
Level 2 — CI/CD automation: full pipeline builds, tests and
          deploys itself; humans review, machines execute.
</code></pre>
<h3>Hidden technical debt</h3>
<p>Google's famous paper "Hidden Technical Debt in Machine Learning Systems" warns that the ML code is a tiny box in a huge system of configuration, data collection, feature extraction, serving and monitoring. Ignoring that box is how ML projects rot.</p>
<div class="callout"><span class="badge">Rule of thumb</span> If you cannot answer "which data and which code produced this model?", you do not have MLOps yet — you have a science experiment.</div>`,
    `<span class="eyebrow">MLO401 · Chương 1 · Bài 1.1</span>
<h2>MLOps là gì</h2>
<h3>ML trên production không phải là notebook</h3>
<p>Một mô hình nghiên cứu kết thúc khi in ra con số độ chính xác. Mô hình <strong>production</strong> phải nhận yêu cầu trực tiếp, trả lời trong vài mili-giây, được giám sát, và được huấn luyện lại khi thế giới đổi thay. MLOps là tập hợp thực hành giữ cho điều đó chạy.</p>
<h3>ML khác phần mềm truyền thống</h3>
<ul>
<li><strong>Phần mềm:</strong> hành vi do <em>mã</em> quy định. Cùng đầu vào, cùng đầu ra. Kiểm thử mang tính tất định.</li>
<li><strong>ML:</strong> hành vi do <em>mã + dữ liệu + mô hình</em> quy định. Đổi dữ liệu là mô hình đổi âm thầm — dù mã y nguyên. Bạn phải version cả ba.</li>
</ul>
<h3>Các mức trưởng thành MLOps</h3>
<pre><code>Mức 0 — Thủ công: notebook, deploy tay, không tự động.
Mức 1 — Tự động pipeline ML: huấn luyện lại tự động,
        huấn luyện liên tục (CT) kích bởi dữ liệu mới.
Mức 2 — Tự động CI/CD: pipeline tự build, test và deploy;
        con người duyệt, máy thực thi.
</code></pre>
<h3>Nợ kỹ thuật ẩn</h3>
<p>Bài báo nổi tiếng của Google "Hidden Technical Debt in Machine Learning Systems" cảnh báo rằng phần mã ML chỉ là một ô nhỏ trong hệ thống khổng lồ gồm cấu hình, thu thập dữ liệu, rút feature, phục vụ và giám sát. Bỏ quên ô đó là cách các dự án ML mục ruỗng.</p>
<div class="callout"><span class="badge">Nguyên tắc</span> Nếu bạn không trả lời được "dữ liệu nào và mã nào sinh ra mô hình này?", thì bạn chưa có MLOps — bạn mới chỉ có một thí nghiệm khoa học.</div>`,
  ]]);

const c1q = quiz('mlo401-quiz-1', 'Quiz 1 — What is MLOps|||Quiz 1 — MLOps là gì', [
  { id: 'q1', question: 'Khác biệt cốt lõi giữa ML và phần mềm truyền thống là?', options: ['ML luôn chạy nhanh hơn', 'Hành vi ML do mã + dữ liệu + mô hình quy định, không chỉ mã', 'ML không cần kiểm thử', 'Phần mềm không có phiên bản'], correctIndex: 1, explanation: 'Dữ liệu đổi thì mô hình đổi âm thầm — phải version cả code, data, model.' },
  { id: 'q2', question: 'MLOps maturity Mức 2 nghĩa là?', options: ['Làm mọi thứ bằng tay trong notebook', 'Chỉ tự động huấn luyện lại', 'Tự động hoá CI/CD toàn pipeline (build/test/deploy)', 'Không dùng phiên bản'], correctIndex: 2, explanation: 'Mức 2: pipeline tự build, test, deploy; người duyệt, máy thực thi.' },
  { id: 'q3', question: 'Thông điệp của bài "Hidden Technical Debt in ML Systems" là?', options: ['Mã ML là phần lớn nhất của hệ thống', 'Mã ML chỉ là ô nhỏ trong hệ thống lớn quanh nó', 'Không cần giám sát mô hình', 'Dữ liệu không quan trọng'], correctIndex: 1, explanation: 'Mã ML nhỏ; cấu hình, dữ liệu, phục vụ, giám sát mới là phần lớn.' },
]);

const c2 = doc('mlo401-2-1-data-and-features', '2.1 — Data & feature engineering|||2.1 — Dữ liệu & feature',
  'Data pipeline (ingest → validate → transform); feature store (tái dùng feature, tránh training-serving skew); data versioning với DVC; kiểm định dữ liệu (schema, phân phối).',
  [[
    `<span class="eyebrow">MLO401 · Chapter 2 · Lesson 2.1</span>
<h2>Data &amp; feature engineering</h2>
<h3>The data pipeline</h3>
<p>Everything starts with data. A pipeline moves it through stages: <strong>ingest</strong> (pull from sources) → <strong>validate</strong> (check schema and distribution) → <strong>transform</strong> (clean, encode) → <strong>store</strong>. Garbage in, garbage out — validation is not optional.</p>
<h3>Feature store</h3>
<p>A <strong>feature store</strong> is a central place to compute, store and serve features. It solves two hard problems: <strong>reuse</strong> (teams share features instead of rebuilding them) and <strong>training-serving skew</strong> (the same code computes features for training and for live inference, so they cannot drift apart).</p>
<h3>Data versioning with DVC</h3>
<pre><code>dvc init
dvc add data/train.csv        # track a big file, store a hash
git add data/train.csv.dvc .gitignore
git commit -m "data v1"
dvc push                      # push data to remote storage (S3/R2)
# later, reproduce any experiment:
git checkout &lt;commit&gt; &amp;&amp; dvc checkout
</code></pre>
<h3>Data validation</h3>
<pre><code>import pandas as pd

def validate(df: pd.DataFrame) -&gt; None:
    assert set(["age", "income", "label"]).issubset(df.columns)
    assert df["age"].between(0, 120).all()      # range check
    assert df["label"].isin([0, 1]).all()       # allowed values
    assert df.isnull().mean().max() &lt; 0.05       # &lt;5% missing
</code></pre>
<div class="callout"><span class="badge">Skew kills models</span> If training features and serving features are computed by different code, your model sees one world in training and another in production. A feature store — or shared transform code — prevents it.</div>`,
    `<span class="eyebrow">MLO401 · Chương 2 · Bài 2.1</span>
<h2>Dữ liệu &amp; feature</h2>
<h3>Data pipeline</h3>
<p>Mọi thứ bắt đầu từ dữ liệu. Pipeline đưa dữ liệu qua các bước: <strong>ingest</strong> (kéo từ nguồn) → <strong>validate</strong> (kiểm schema và phân phối) → <strong>transform</strong> (làm sạch, mã hoá) → <strong>store</strong>. Rác vào thì rác ra — kiểm định không phải tuỳ chọn.</p>
<h3>Feature store</h3>
<p><strong>Feature store</strong> là nơi trung tâm để tính, lưu và phục vụ feature. Nó giải hai bài toán khó: <strong>tái dùng</strong> (các nhóm chia sẻ feature thay vì dựng lại) và <strong>training-serving skew</strong> (cùng một mã tính feature cho huấn luyện và cho suy luận trực tiếp, nên chúng không thể lệch nhau).</p>
<h3>Versioning dữ liệu bằng DVC</h3>
<pre><code>dvc init
dvc add data/train.csv        # theo dõi file lớn, lưu mã băm
git add data/train.csv.dvc .gitignore
git commit -m "data v1"
dvc push                      # đẩy dữ liệu lên kho từ xa (S3/R2)
# về sau, tái lập bất kỳ thí nghiệm nào:
git checkout &lt;commit&gt; &amp;&amp; dvc checkout
</code></pre>
<h3>Kiểm định dữ liệu</h3>
<pre><code>import pandas as pd

def validate(df: pd.DataFrame) -&gt; None:
    assert set(["age", "income", "label"]).issubset(df.columns)
    assert df["age"].between(0, 120).all()      # kiểm khoảng
    assert df["label"].isin([0, 1]).all()       # giá trị hợp lệ
    assert df.isnull().mean().max() &lt; 0.05       # &lt;5% thiếu
</code></pre>
<div class="callout"><span class="badge">Skew giết mô hình</span> Nếu feature lúc huấn luyện và lúc phục vụ được tính bằng mã khác nhau, mô hình thấy một thế giới khi học và một thế giới khác trên production. Feature store — hoặc mã transform dùng chung — ngăn điều đó.</div>`,
  ]]);

const c2q = quiz('mlo401-quiz-2', 'Quiz 2 — Data & features|||Quiz 2 — Dữ liệu & feature', [
  { id: 'q1', question: 'Feature store giúp chống lại vấn đề nào?', options: ['Máy chủ quá tải', 'Training-serving skew (feature huấn luyện lệch feature phục vụ)', 'Mã nguồn quá dài', 'Thiếu GPU'], correctIndex: 1, explanation: 'Cùng mã tính feature cho train và serve → không lệch nhau.' },
  { id: 'q2', question: 'Công cụ nào dùng để versioning file dữ liệu lớn cùng Git?', options: ['DVC', 'npm', 'Nginx', 'Postman'], correctIndex: 0, explanation: 'DVC lưu mã băm trong Git, dữ liệu thật đẩy lên kho từ xa.' },
  { id: 'q3', question: 'Bước "validate" trong data pipeline làm gì?', options: ['Triển khai mô hình', 'Kiểm schema và phân phối dữ liệu trước khi dùng', 'Đào tạo lại người dùng', 'Xoá toàn bộ dữ liệu'], correctIndex: 1, explanation: 'Validate bắt lỗi schema/khoảng/thiếu trước khi dữ liệu vào huấn luyện.' },
]);

const c3 = doc('mlo401-3-1-training-experiments', '3.1 — Training & experiment tracking|||3.1 — Huấn luyện & thử nghiệm',
  'Experiment tracking với MLflow (log params/metrics/artifacts); reproducibility (seed, môi trường, dữ liệu cố định); hyperparameter tuning; so sánh các lần chạy.',
  [[
    `<span class="eyebrow">MLO401 · Chapter 3 · Lesson 3.1</span>
<h2>Training &amp; experiment tracking</h2>
<h3>Why track experiments</h3>
<p>You will run hundreds of training jobs with different data, features and hyperparameters. Without tracking, you cannot answer "which run was best, and how do I reproduce it?". An <strong>experiment tracker</strong> like <strong>MLflow</strong> records every run: parameters, metrics, and output artifacts (the model file).</p>
<h3>Tracking a run with MLflow</h3>
<pre><code>import mlflow
from sklearn.ensemble import RandomForestClassifier

mlflow.set_experiment("churn-model")
with mlflow.start_run():
    params = {"n_estimators": 200, "max_depth": 8}
    mlflow.log_params(params)

    model = RandomForestClassifier(**params).fit(X_train, y_train)
    acc = model.score(X_val, y_val)

    mlflow.log_metric("val_accuracy", acc)
    mlflow.sklearn.log_model(model, "model")   # artifact
</code></pre>
<h3>Reproducibility</h3>
<ul>
<li><strong>Seed</strong> every random source (numpy, framework, data split).</li>
<li><strong>Pin</strong> the environment (requirements.txt / Docker image).</li>
<li><strong>Version</strong> the exact data (DVC hash) used for the run.</li>
</ul>
<h3>Hyperparameter tuning</h3>
<p>Search the space systematically (grid, random, or Bayesian with tools like Optuna). Log every trial to the tracker so the best configuration is chosen from evidence, not memory.</p>
<div class="callout"><span class="badge">Reproducible = code + data + env</span> A run you cannot reproduce is a run you cannot trust in production.</div>`,
    `<span class="eyebrow">MLO401 · Chương 3 · Bài 3.1</span>
<h2>Huấn luyện &amp; theo dõi thí nghiệm</h2>
<h3>Vì sao phải theo dõi thí nghiệm</h3>
<p>Bạn sẽ chạy hàng trăm lần huấn luyện với dữ liệu, feature và siêu tham số khác nhau. Không theo dõi thì bạn không trả lời được "lần chạy nào tốt nhất, và tái lập nó thế nào?". Một <strong>trình theo dõi thí nghiệm</strong> như <strong>MLflow</strong> ghi lại mọi lần chạy: tham số, chỉ số, và artifact đầu ra (file mô hình).</p>
<h3>Theo dõi một lần chạy với MLflow</h3>
<pre><code>import mlflow
from sklearn.ensemble import RandomForestClassifier

mlflow.set_experiment("churn-model")
with mlflow.start_run():
    params = {"n_estimators": 200, "max_depth": 8}
    mlflow.log_params(params)

    model = RandomForestClassifier(**params).fit(X_train, y_train)
    acc = model.score(X_val, y_val)

    mlflow.log_metric("val_accuracy", acc)
    mlflow.sklearn.log_model(model, "model")   # artifact
</code></pre>
<h3>Khả năng tái lập</h3>
<ul>
<li><strong>Cố định seed</strong> mọi nguồn ngẫu nhiên (numpy, framework, chia dữ liệu).</li>
<li><strong>Khoá</strong> môi trường (requirements.txt / ảnh Docker).</li>
<li><strong>Version</strong> đúng dữ liệu (mã băm DVC) đã dùng cho lần chạy.</li>
</ul>
<h3>Tinh chỉnh siêu tham số</h3>
<p>Tìm kiếm không gian một cách có hệ thống (grid, random, hoặc Bayesian với công cụ như Optuna). Ghi mọi trial vào trình theo dõi để chọn cấu hình tốt nhất dựa trên bằng chứng, không phải trí nhớ.</p>
<div class="callout"><span class="badge">Tái lập = mã + dữ liệu + môi trường</span> Một lần chạy không tái lập được là một lần chạy không thể tin trên production.</div>`,
  ]]);

const c3q = quiz('mlo401-quiz-3', 'Quiz 3 — Experiments|||Quiz 3 — Thí nghiệm', [
  { id: 'q1', question: 'MLflow chủ yếu dùng để?', options: ['Tạo giao diện web', 'Ghi lại params/metrics/artifacts của các lần huấn luyện', 'Chạy database', 'Cân bằng tải'], correctIndex: 1, explanation: 'Experiment tracking: log tham số, chỉ số và mô hình mỗi lần chạy.' },
  { id: 'q2', question: 'Để một lần chạy TÁI LẬP được cần cố định những gì?', options: ['Chỉ mã nguồn', 'Chỉ dữ liệu', 'Mã + dữ liệu (version) + môi trường + seed', 'Chỉ siêu tham số'], correctIndex: 2, explanation: 'Reproducibility cần cả code, data version, env và seed ngẫu nhiên.' },
  { id: 'q3', question: 'Hyperparameter tuning là?', options: ['Xoá dữ liệu thừa', 'Tìm cấu hình siêu tham số tốt nhất một cách có hệ thống', 'Triển khai mô hình', 'Đổi ngôn ngữ lập trình'], correctIndex: 1, explanation: 'Grid/random/Bayesian search; ghi mọi trial để chọn theo bằng chứng.' },
]);

const c4 = doc('mlo401-4-1-packaging-versioning', '4.1 — Model packaging & versioning|||4.1 — Đóng gói & versioning mô hình',
  'Model registry (staging/production, lineage); packaging mô hình (định dạng chuẩn, pickle/ONNX/SavedModel); containerize mô hình bằng Docker để chạy ở đâu cũng như nhau.',
  [[
    `<span class="eyebrow">MLO401 · Chapter 4 · Lesson 4.1</span>
<h2>Model packaging &amp; versioning</h2>
<h3>The model registry</h3>
<p>A <strong>model registry</strong> is a versioned catalog of trained models. Each model has versions, a <strong>stage</strong> (Staging → Production → Archived), and <strong>lineage</strong> (which run, data and code produced it). It is the single source of truth for "what is live right now?".</p>
<pre><code>import mlflow

# register the best run's model
mlflow.register_model("runs:/&lt;run_id&gt;/model", "churn-model")

client = mlflow.MlflowClient()
client.transition_model_version_stage(
    name="churn-model", version=3, stage="Production")
</code></pre>
<h3>Packaging formats</h3>
<ul>
<li><strong>Pickle / joblib</strong> — simple, Python-only, version-fragile.</li>
<li><strong>ONNX</strong> — framework-neutral, portable across runtimes.</li>
<li><strong>SavedModel</strong> — TensorFlow standard, needed by TF Serving.</li>
</ul>
<h3>Containerize the model</h3>
<pre><code>FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY model/ ./model/
COPY serve.py .
EXPOSE 8080
CMD ["python", "serve.py"]
</code></pre>
<div class="callout"><span class="badge">Package the whole world</span> A model file alone is not deployable — it needs its exact dependencies and preprocessing. Docker packages the model + code + environment so it runs identically on any machine.</div>`,
    `<span class="eyebrow">MLO401 · Chương 4 · Bài 4.1</span>
<h2>Đóng gói &amp; versioning mô hình</h2>
<h3>Model registry</h3>
<p><strong>Model registry</strong> là danh mục có phiên bản của các mô hình đã huấn luyện. Mỗi mô hình có nhiều version, một <strong>giai đoạn</strong> (Staging → Production → Archived), và <strong>lineage</strong> (lần chạy, dữ liệu và mã nào sinh ra nó). Đây là nguồn sự thật duy nhất cho câu "bản nào đang chạy?".</p>
<pre><code>import mlflow

# đăng ký mô hình của lần chạy tốt nhất
mlflow.register_model("runs:/&lt;run_id&gt;/model", "churn-model")

client = mlflow.MlflowClient()
client.transition_model_version_stage(
    name="churn-model", version=3, stage="Production")
</code></pre>
<h3>Định dạng đóng gói</h3>
<ul>
<li><strong>Pickle / joblib</strong> — đơn giản, chỉ Python, dễ vỡ theo version.</li>
<li><strong>ONNX</strong> — trung lập framework, chạy được nhiều runtime.</li>
<li><strong>SavedModel</strong> — chuẩn TensorFlow, cần cho TF Serving.</li>
</ul>
<h3>Containerize mô hình</h3>
<pre><code>FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY model/ ./model/
COPY serve.py .
EXPOSE 8080
CMD ["python", "serve.py"]
</code></pre>
<div class="callout"><span class="badge">Gói cả thế giới</span> Chỉ mỗi file mô hình thì chưa triển khai được — nó cần đúng thư viện phụ thuộc và bước tiền xử lý. Docker gói mô hình + mã + môi trường để chạy y hệt trên mọi máy.</div>`,
  ]]);

const c4q = quiz('mlo401-quiz-4', 'Quiz 4 — Packaging|||Quiz 4 — Đóng gói', [
  { id: 'q1', question: 'Model registry lưu giữ điều gì?', options: ['Chỉ dữ liệu thô', 'Danh mục mô hình có version, stage và lineage', 'Log HTTP', 'Mã CSS'], correctIndex: 1, explanation: 'Registry: version + stage (Staging/Production) + nguồn gốc mô hình.' },
  { id: 'q2', question: 'Định dạng nào TRUNG LẬP framework, chạy nhiều runtime?', options: ['Pickle', 'ONNX', 'CSV', 'JPEG'], correctIndex: 1, explanation: 'ONNX portable; pickle chỉ Python, SavedModel gắn TensorFlow.' },
  { id: 'q3', question: 'Vì sao phải containerize (Docker) mô hình?', options: ['Để mô hình nhỏ hơn', 'Để gói mô hình + mã + môi trường chạy y hệt mọi nơi', 'Để tăng độ chính xác', 'Để bỏ qua kiểm thử'], correctIndex: 1, explanation: 'Docker khoá dependencies + tiền xử lý → không lệch giữa các máy.' },
]);

const c5 = doc('mlo401-5-1-deployment', '5.1 — Model deployment & serving|||5.1 — Triển khai & phục vụ mô hình',
  'Mẫu triển khai: batch, online (real-time), streaming; phục vụ qua REST API (FastAPI); TF Serving; chiến lược phát hành (canary, shadow, blue-green).',
  [[
    `<span class="eyebrow">MLO401 · Chapter 5 · Lesson 5.1</span>
<h2>Model deployment &amp; serving</h2>
<h3>Three serving patterns</h3>
<ul>
<li><strong>Batch</strong> — score a large dataset on a schedule (e.g. nightly). Cheap, high-throughput, not real-time.</li>
<li><strong>Online (real-time)</strong> — a REST/gRPC endpoint returns a prediction per request in milliseconds. For user-facing features.</li>
<li><strong>Streaming</strong> — score events as they arrive from a stream (Kafka), for continuous low-latency scoring.</li>
</ul>
<h3>A REST prediction API</h3>
<pre><code>from fastapi import FastAPI
from pydantic import BaseModel
import joblib

app = FastAPI()
model = joblib.load("model/model.joblib")

class Features(BaseModel):
    age: int
    income: float

@app.post("/predict")
def predict(f: Features):
    proba = model.predict_proba([[f.age, f.income]])[0][1]
    return {"churn_probability": float(proba)}
</code></pre>
<h3>Dedicated serving: TF Serving</h3>
<p>For TensorFlow SavedModels, <strong>TF Serving</strong> gives you high-performance serving, model versioning and batching out of the box — no custom API code.</p>
<h3>Release strategies</h3>
<ul>
<li><strong>Shadow</strong> — new model receives real traffic but its output is not used; you compare silently.</li>
<li><strong>Canary</strong> — send a small % of traffic to the new model, watch metrics, then ramp up.</li>
<li><strong>Blue-green</strong> — keep two environments, switch all traffic at once, roll back instantly.</li>
</ul>
<div class="callout"><span class="badge">Match pattern to need</span> Do not build a real-time endpoint for a report that runs once a night — batch is cheaper and simpler. Choose the pattern from the latency the product actually requires.</div>`,
    `<span class="eyebrow">MLO401 · Chương 5 · Bài 5.1</span>
<h2>Triển khai &amp; phục vụ mô hình</h2>
<h3>Ba mẫu phục vụ</h3>
<ul>
<li><strong>Batch</strong> — chấm một tập dữ liệu lớn theo lịch (vd hằng đêm). Rẻ, thông lượng cao, không thời gian thực.</li>
<li><strong>Online (thời gian thực)</strong> — một endpoint REST/gRPC trả dự đoán mỗi yêu cầu trong vài mili-giây. Cho tính năng hướng người dùng.</li>
<li><strong>Streaming</strong> — chấm sự kiện ngay khi tới từ luồng (Kafka), để chấm liên tục độ trễ thấp.</li>
</ul>
<h3>Một REST API dự đoán</h3>
<pre><code>from fastapi import FastAPI
from pydantic import BaseModel
import joblib

app = FastAPI()
model = joblib.load("model/model.joblib")

class Features(BaseModel):
    age: int
    income: float

@app.post("/predict")
def predict(f: Features):
    proba = model.predict_proba([[f.age, f.income]])[0][1]
    return {"churn_probability": float(proba)}
</code></pre>
<h3>Phục vụ chuyên dụng: TF Serving</h3>
<p>Với SavedModel của TensorFlow, <strong>TF Serving</strong> cho bạn phục vụ hiệu năng cao, versioning mô hình và gộp batch sẵn có — không cần viết API riêng.</p>
<h3>Chiến lược phát hành</h3>
<ul>
<li><strong>Shadow</strong> — mô hình mới nhận traffic thật nhưng đầu ra không được dùng; bạn so sánh âm thầm.</li>
<li><strong>Canary</strong> — đẩy một % nhỏ traffic sang mô hình mới, theo dõi chỉ số, rồi tăng dần.</li>
<li><strong>Blue-green</strong> — giữ hai môi trường, chuyển toàn bộ traffic một lần, cần thì lùi tức thì.</li>
</ul>
<div class="callout"><span class="badge">Chọn mẫu theo nhu cầu</span> Đừng dựng endpoint thời gian thực cho một báo cáo chạy mỗi đêm một lần — batch rẻ và đơn giản hơn. Chọn mẫu theo độ trễ mà sản phẩm thật sự cần.</div>`,
  ]]);

const c5q = quiz('mlo401-quiz-5', 'Quiz 5 — Deployment|||Quiz 5 — Triển khai', [
  { id: 'q1', question: 'Mẫu phục vụ nào phù hợp cho tính năng hướng người dùng cần trả lời tức thì?', options: ['Batch', 'Online (real-time) qua REST/gRPC', 'Chỉ chạy trong notebook', 'Không cần phục vụ'], correctIndex: 1, explanation: 'Online trả dự đoán mỗi request trong mili-giây; batch chạy theo lịch.' },
  { id: 'q2', question: 'Chiến lược "canary" release là?', options: ['Chuyển 100% traffic ngay lập tức', 'Đẩy một % nhỏ traffic sang bản mới rồi tăng dần khi ổn', 'Không bao giờ phát hành', 'Chạy mô hình mới nhưng bỏ kết quả'], correctIndex: 1, explanation: 'Canary: một phần nhỏ traffic trước, theo dõi rồi ramp up.' },
  { id: 'q3', question: 'Shadow deployment nghĩa là?', options: ['Mô hình mới nhận traffic thật nhưng đầu ra không được dùng, chỉ so sánh', 'Xoá mô hình cũ', 'Chỉ chạy batch ban đêm', 'Tắt giám sát'], correctIndex: 0, explanation: 'Shadow: so sánh mô hình mới trên traffic thật mà không ảnh hưởng người dùng.' },
]);

const c6 = doc('mlo401-6-1-cicd-for-ml', '6.1 — CI/CD/CT for ML|||6.1 — CI/CD/CT cho ML',
  'CI (build + test), CD (deploy tự động), CT (continuous training — huấn luyện lại khi có dữ liệu mới); kiểm thử cho ML (data test, model test, integration); pipeline tự động (có YAML).',
  [[
    `<span class="eyebrow">MLO401 · Chapter 6 · Lesson 6.1</span>
<h2>CI/CD/CT for ML</h2>
<h3>Three pipelines, not two</h3>
<ul>
<li><strong>CI (Continuous Integration)</strong> — on every code change: lint, run tests, validate data, train a quick model.</li>
<li><strong>CD (Continuous Delivery)</strong> — automatically package and deploy the validated model to staging/production.</li>
<li><strong>CT (Continuous Training)</strong> — the ML-specific one: retrain automatically when new data arrives or metrics drop.</li>
</ul>
<h3>Testing an ML system</h3>
<ul>
<li><strong>Data tests</strong> — schema, ranges, missing-value rate (see Chapter 2).</li>
<li><strong>Model tests</strong> — the new model must beat a baseline and clear a minimum metric before it can ship.</li>
<li><strong>Integration tests</strong> — the serving API returns a valid response for a sample request.</li>
</ul>
<h3>A CI pipeline (GitHub Actions)</h3>
<pre><code>name: ml-ci
on: [push]
jobs:
  train-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"
      - run: pip install -r requirements.txt
      - run: dvc pull                 # fetch versioned data
      - run: pytest tests/data        # validate data
      - run: python train.py          # train model
      - run: pytest tests/model       # model must beat baseline
</code></pre>
<div class="callout"><span class="badge">CT is what makes it ML</span> Traditional software ships when code changes. ML must ALSO ship when data changes — that automated retrain-and-validate loop is Continuous Training.</div>`,
    `<span class="eyebrow">MLO401 · Chương 6 · Bài 6.1</span>
<h2>CI/CD/CT cho ML</h2>
<h3>Ba pipeline, không phải hai</h3>
<ul>
<li><strong>CI (Tích hợp liên tục)</strong> — mỗi lần đổi mã: lint, chạy test, kiểm định dữ liệu, huấn luyện nhanh một mô hình.</li>
<li><strong>CD (Phát hành liên tục)</strong> — tự động đóng gói và triển khai mô hình đã kiểm định lên staging/production.</li>
<li><strong>CT (Huấn luyện liên tục)</strong> — điểm đặc thù của ML: huấn luyện lại tự động khi có dữ liệu mới hoặc chỉ số tụt.</li>
</ul>
<h3>Kiểm thử một hệ thống ML</h3>
<ul>
<li><strong>Data test</strong> — schema, khoảng giá trị, tỉ lệ thiếu (xem Chương 2).</li>
<li><strong>Model test</strong> — mô hình mới phải vượt baseline và đạt ngưỡng chỉ số tối thiểu mới được phát hành.</li>
<li><strong>Integration test</strong> — API phục vụ trả về đúng định dạng cho một request mẫu.</li>
</ul>
<h3>Một pipeline CI (GitHub Actions)</h3>
<pre><code>name: ml-ci
on: [push]
jobs:
  train-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"
      - run: pip install -r requirements.txt
      - run: dvc pull                 # kéo dữ liệu có version
      - run: pytest tests/data        # kiểm định dữ liệu
      - run: python train.py          # huấn luyện mô hình
      - run: pytest tests/model       # mô hình phải vượt baseline
</code></pre>
<div class="callout"><span class="badge">CT làm nó thành ML</span> Phần mềm thường phát hành khi mã đổi. ML còn phải phát hành khi DỮ LIỆU đổi — vòng huấn-luyện-lại-rồi-kiểm-định tự động đó chính là Continuous Training.</div>`,
  ]]);

const c6q = quiz('mlo401-quiz-6', 'Quiz 6 — CI/CD/CT|||Quiz 6 — CI/CD/CT', [
  { id: 'q1', question: 'Điểm khác biệt "CT" (Continuous Training) so với CI/CD thường là?', options: ['Chỉ chạy lint', 'Huấn luyện lại tự động khi có dữ liệu mới / chỉ số tụt', 'Xoá kho mã', 'Không cần test'], correctIndex: 1, explanation: 'ML phải phát hành cả khi DỮ LIỆU đổi — đó là CT.' },
  { id: 'q2', question: 'Một "model test" trong CI cho ML thường kiểm gì?', options: ['Màu giao diện', 'Mô hình mới phải vượt baseline / đạt ngưỡng chỉ số', 'Tốc độ Internet', 'Dung lượng ổ cứng'], correctIndex: 1, explanation: 'Chặn phát hành nếu mô hình mới không đủ tốt so với baseline.' },
  { id: 'q3', question: 'Trong pipeline CI ở ví dụ, "dvc pull" để làm gì?', options: ['Đẩy mã lên GitHub', 'Kéo về đúng dữ liệu đã version để tái lập', 'Khởi động server', 'Xoá cache'], correctIndex: 1, explanation: 'dvc pull lấy dữ liệu (theo mã băm) tương ứng commit đang chạy.' },
]);

const c7 = doc('mlo401-7-1-monitoring', '7.1 — Monitoring & operations|||7.1 — Giám sát & vận hành',
  'Giám sát production (latency, throughput, lỗi + chỉ số ML); data drift & model/concept drift; alerting; kích huấn luyện lại (retraining trigger); vòng phản hồi.',
  [[
    `<span class="eyebrow">MLO401 · Chapter 7 · Lesson 7.1</span>
<h2>Monitoring &amp; operations</h2>
<h3>Two layers of monitoring</h3>
<ul>
<li><strong>Operational</strong> — latency, throughput, error rate, resource use. The same signals as any service.</li>
<li><strong>ML-specific</strong> — prediction distribution, input feature distribution, and — when labels arrive — live accuracy.</li>
</ul>
<h3>Drift: the silent killer</h3>
<ul>
<li><strong>Data drift</strong> — the input distribution shifts (new users, seasonality). Features look different from training data.</li>
<li><strong>Concept drift</strong> — the relationship between input and output changes (what predicted fraud last year no longer does). Accuracy decays even if inputs look stable.</li>
</ul>
<h3>Detecting drift</h3>
<pre><code>from scipy.stats import ks_2samp

# compare a live feature vs the training reference
stat, p_value = ks_2samp(train_feature, live_feature)
if p_value &lt; 0.05:
    alert("data drift detected on feature 'income'")
    trigger_retraining()
</code></pre>
<h3>Retraining trigger &amp; feedback loop</h3>
<p>Retrain on a <strong>schedule</strong>, on a <strong>drift signal</strong>, or on a <strong>metric drop</strong>. Collect production predictions and their true outcomes (labels) to feed the next training round — that is the feedback loop that closes the lifecycle.</p>
<div class="callout"><span class="badge">A model decays</span> Unlike code, an untouched model gets WORSE over time because the world moves away from its training data. Monitoring &amp; retraining are not optional maintenance — they are the job.</div>`,
    `<span class="eyebrow">MLO401 · Chương 7 · Bài 7.1</span>
<h2>Giám sát &amp; vận hành</h2>
<h3>Hai lớp giám sát</h3>
<ul>
<li><strong>Vận hành</strong> — độ trễ, thông lượng, tỉ lệ lỗi, tài nguyên. Giống mọi dịch vụ khác.</li>
<li><strong>Đặc thù ML</strong> — phân phối dự đoán, phân phối feature đầu vào, và — khi có nhãn — độ chính xác trực tiếp.</li>
</ul>
<h3>Drift: kẻ giết người thầm lặng</h3>
<ul>
<li><strong>Data drift</strong> — phân phối đầu vào dịch chuyển (người dùng mới, mùa vụ). Feature trông khác dữ liệu huấn luyện.</li>
<li><strong>Concept drift</strong> — quan hệ giữa đầu vào và đầu ra đổi (thứ từng báo hiệu gian lận năm ngoái nay không còn). Độ chính xác tụt dù đầu vào trông ổn định.</li>
</ul>
<h3>Phát hiện drift</h3>
<pre><code>from scipy.stats import ks_2samp

# so feature trực tiếp với dữ liệu tham chiếu lúc huấn luyện
stat, p_value = ks_2samp(train_feature, live_feature)
if p_value &lt; 0.05:
    alert("phat hien data drift o feature 'income'")
    trigger_retraining()
</code></pre>
<h3>Kích huấn luyện lại &amp; vòng phản hồi</h3>
<p>Huấn luyện lại theo <strong>lịch</strong>, theo <strong>tín hiệu drift</strong>, hoặc theo <strong>chỉ số tụt</strong>. Thu thập dự đoán trên production cùng kết quả thật (nhãn) để nạp cho vòng huấn luyện kế tiếp — đó là vòng phản hồi khép kín vòng đời.</p>
<div class="callout"><span class="badge">Mô hình mục dần</span> Khác với mã, một mô hình để yên sẽ TỆ dần theo thời gian vì thế giới rời xa dữ liệu huấn luyện của nó. Giám sát &amp; huấn luyện lại không phải bảo trì tuỳ chọn — đó chính là công việc.</div>`,
  ]]);

const c7q = quiz('mlo401-quiz-7', 'Quiz 7 — Monitoring|||Quiz 7 — Giám sát', [
  { id: 'q1', question: '"Concept drift" là gì?', options: ['Máy chủ hết RAM', 'Quan hệ giữa đầu vào và đầu ra thay đổi theo thời gian', 'Mã nguồn bị lỗi cú pháp', 'Ổ cứng đầy'], correctIndex: 1, explanation: 'Concept drift: quan hệ input→output đổi, độ chính xác tụt dù input ổn.' },
  { id: 'q2', question: 'Vì sao mô hình để yên vẫn TỆ dần theo thời gian?', options: ['File mô hình tự hỏng', 'Thế giới (dữ liệu) rời xa dữ liệu huấn luyện gốc', 'GPU cũ đi', 'Python cập nhật'], correctIndex: 1, explanation: 'Data/concept drift làm dự đoán lệch dần khỏi thực tế.' },
  { id: 'q3', question: 'Retraining trigger KHÔNG bao gồm cách nào sau đây?', options: ['Theo lịch định kỳ', 'Khi phát hiện drift', 'Khi chỉ số tụt dưới ngưỡng', 'Khi đổi màu logo'], correctIndex: 3, explanation: 'Kích huấn luyện lại theo lịch / drift / chỉ số tụt, không theo giao diện.' },
]);

const c8 = doc('mlo401-8-1-infra-governance', '8.1 — Infrastructure & governance|||8.1 — Hạ tầng & quản trị',
  'Điều phối với Kubernetes/Kubeflow (pipeline chạy trên cluster); quản lý chi phí (GPU đắt, autoscale, spot); governance (audit, lineage, tuân thủ); đạo đức & responsible AI (bias, fairness, minh bạch).',
  [[
    `<span class="eyebrow">MLO401 · Chapter 8 · Lesson 8.1</span>
<h2>Infrastructure &amp; governance</h2>
<h3>Orchestration: Kubernetes &amp; Kubeflow</h3>
<p><strong>Kubernetes</strong> runs containers across a cluster with autoscaling and self-healing. <strong>Kubeflow</strong> builds ML pipelines on top of it — each step (data, train, evaluate, deploy) is a containerized, reusable component.</p>
<pre><code>apiVersion: apps/v1
kind: Deployment
metadata:
  name: churn-model
spec:
  replicas: 3
  template:
    spec:
      containers:
        - name: model
          image: registry/churn-model:v3
          resources:
            requests: { cpu: "500m", memory: "1Gi" }
            limits:   { cpu: "1",    memory: "2Gi" }
</code></pre>
<h3>Cost management</h3>
<ul>
<li>GPUs are expensive — use them only for training/heavy inference, and release them when idle.</li>
<li><strong>Autoscale</strong> serving replicas to real traffic; scale to zero for rare workloads.</li>
<li>Use <strong>spot / preemptible</strong> instances for fault-tolerant batch training.</li>
</ul>
<h3>Governance</h3>
<p>Regulated domains demand an <strong>audit trail</strong>: which model made a decision, on what data, trained by whom. Lineage from the registry (Chapter 4) plus logged predictions provide it — essential for compliance and debugging.</p>
<h3>Ethics &amp; responsible AI</h3>
<ul>
<li><strong>Bias &amp; fairness</strong> — check the model does not systematically disadvantage a group; measure metrics per subgroup.</li>
<li><strong>Transparency</strong> — be able to explain a decision (feature importance, model cards).</li>
<li><strong>Privacy</strong> — do not leak personal data through features or logs.</li>
</ul>
<div class="callout"><span class="badge">The full picture</span> MLOps is not just shipping fast — it is shipping models that are reproducible, affordable, auditable and fair. Infrastructure and governance are what let an organization trust ML at scale.</div>`,
    `<span class="eyebrow">MLO401 · Chương 8 · Bài 8.1</span>
<h2>Hạ tầng &amp; quản trị</h2>
<h3>Điều phối: Kubernetes &amp; Kubeflow</h3>
<p><strong>Kubernetes</strong> chạy container trên một cluster với autoscale và tự phục hồi. <strong>Kubeflow</strong> dựng pipeline ML lên trên nó — mỗi bước (dữ liệu, huấn luyện, đánh giá, triển khai) là một component container hoá, tái dùng được.</p>
<pre><code>apiVersion: apps/v1
kind: Deployment
metadata:
  name: churn-model
spec:
  replicas: 3
  template:
    spec:
      containers:
        - name: model
          image: registry/churn-model:v3
          resources:
            requests: { cpu: "500m", memory: "1Gi" }
            limits:   { cpu: "1",    memory: "2Gi" }
</code></pre>
<h3>Quản lý chi phí</h3>
<ul>
<li>GPU rất đắt — chỉ dùng cho huấn luyện/suy luận nặng, và trả lại khi rảnh.</li>
<li><strong>Autoscale</strong> số bản phục vụ theo traffic thật; scale về 0 với tải hiếm.</li>
<li>Dùng máy <strong>spot / preemptible</strong> cho huấn luyện batch chịu lỗi được.</li>
</ul>
<h3>Quản trị (governance)</h3>
<p>Các lĩnh vực bị quản lý đòi <strong>vết kiểm toán</strong>: mô hình nào ra quyết định, trên dữ liệu gì, do ai huấn luyện. Lineage từ registry (Chương 4) cộng dự đoán được ghi lại cung cấp điều đó — thiết yếu cho tuân thủ và gỡ lỗi.</p>
<h3>Đạo đức &amp; AI có trách nhiệm</h3>
<ul>
<li><strong>Thiên lệch &amp; công bằng</strong> — kiểm mô hình không bất lợi một cách hệ thống cho một nhóm; đo chỉ số theo từng nhóm nhỏ.</li>
<li><strong>Minh bạch</strong> — giải thích được một quyết định (mức quan trọng của feature, model card).</li>
<li><strong>Riêng tư</strong> — không rò rỉ dữ liệu cá nhân qua feature hay log.</li>
</ul>
<div class="callout"><span class="badge">Bức tranh đầy đủ</span> MLOps không chỉ là phát hành nhanh — mà là phát hành mô hình tái lập được, chi phí hợp lý, kiểm toán được và công bằng. Hạ tầng và quản trị là thứ cho một tổ chức tin tưởng ML ở quy mô lớn.</div>`,
  ]]);

const c8q = quiz('mlo401-quiz-8', 'Quiz 8 — Infra & governance|||Quiz 8 — Hạ tầng & quản trị', [
  { id: 'q1', question: 'Kubeflow dùng để làm gì?', options: ['Dựng pipeline ML container hoá trên Kubernetes', 'Viết CSS', 'Thay thế database', 'Gửi email'], correctIndex: 0, explanation: 'Kubeflow: các bước ML thành component container chạy trên K8s.' },
  { id: 'q2', question: 'Cách nào giúp GIẢM chi phí phục vụ mô hình?', options: ['Chạy GPU 24/7 kể cả khi rảnh', 'Autoscale theo traffic và scale về 0 khi tải hiếm', 'Không bao giờ tắt máy', 'Dùng nhiều replica nhất có thể luôn'], correctIndex: 1, explanation: 'Autoscale + spot instance + trả GPU khi rảnh giảm chi phí.' },
  { id: 'q3', question: 'Governance/responsible AI quan tâm điều nào?', options: ['Chỉ tốc độ deploy', 'Audit trail, thiên lệch/công bằng, minh bạch, riêng tư', 'Màu giao diện', 'Số dòng code'], correctIndex: 1, explanation: 'Kiểm toán, fairness, minh bạch và privacy là lõi của AI có trách nhiệm.' },
]);

const taiLieu = doc('mlo401-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn quốc tế (Chip Huyen, Burkov), tài liệu chính thức miễn phí (Google MLOps, MLflow, Kubeflow), YouTube, công cụ, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">MLO401 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn MLOps — data &amp; feature pipelines, experiment tracking, packaging, deployment, CI/CD/CT, monitoring and infrastructure — in one place. The full official slides &amp; syllabus live on <strong>FLM</strong>; below are respected books and free resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU syllabus &amp; lecture slides for MLO401 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/" target="_blank" rel="noopener"><em>Designing Machine Learning Systems</em> — Chip Huyen</a></li>
<li><a href="http://www.mlebook.com/" target="_blank" rel="noopener"><em>Machine Learning Engineering</em> — Andriy Burkov</a></li>
<li><a href="https://www.oreilly.com/library/view/building-machine-learning/9781492045106/" target="_blank" rel="noopener"><em>Building Machine Learning Powered Applications</em> — Emmanuel Ameisen</a></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning" target="_blank" rel="noopener">Google Cloud — MLOps: CI/CD/CT pipelines</a></li>
<li><a href="https://mlflow.org/docs/latest/index.html" target="_blank" rel="noopener">MLflow documentation</a></li>
<li><a href="https://www.kubeflow.org/docs/" target="_blank" rel="noopener">Kubeflow documentation</a></li>
<li><a href="https://dvc.org/doc" target="_blank" rel="noopener">DVC (Data Version Control) docs</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@MLOps" target="_blank" rel="noopener">MLOps.community</a> — talks &amp; practitioner interviews</li>
<li><a href="https://www.youtube.com/@abhishekkrthakur" target="_blank" rel="noopener">Abhishek Thakur</a> — applied ML &amp; deployment</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://mlflow.org/" target="_blank" rel="noopener">MLflow</a> — experiment tracking &amp; model registry</li>
<li><a href="https://dvc.org/" target="_blank" rel="noopener">DVC</a> — data &amp; pipeline versioning</li>
<li><a href="https://www.docker.com/" target="_blank" rel="noopener">Docker</a> — containerize models</li>
<li><a href="https://kubernetes.io/" target="_blank" rel="noopener">Kubernetes</a> — orchestration at scale</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundations</strong> — what MLOps is, ML vs software, maturity levels, the lifecycle.</li>
<li><strong>Build the pipeline</strong> — data &amp; features, experiment tracking, packaging &amp; registry.</li>
<li><strong>Ship it</strong> — deployment patterns and CI/CD/CT automation.</li>
<li><strong>Operate it</strong> — monitoring, drift, retraining, infrastructure &amp; governance.</li>
</ol></div>`,
    `<span class="eyebrow">MLO401 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học MLOps — pipeline dữ liệu &amp; feature, theo dõi thí nghiệm, đóng gói, triển khai, CI/CD/CT, giám sát và hạ tầng — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là sách uy tín và nguồn miễn phí.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của MLO401 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/" target="_blank" rel="noopener"><em>Designing Machine Learning Systems</em> — Chip Huyen</a></li>
<li><a href="http://www.mlebook.com/" target="_blank" rel="noopener"><em>Machine Learning Engineering</em> — Andriy Burkov</a></li>
<li><a href="https://www.oreilly.com/library/view/building-machine-learning/9781492045106/" target="_blank" rel="noopener"><em>Building Machine Learning Powered Applications</em> — Emmanuel Ameisen</a></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning" target="_blank" rel="noopener">Google Cloud — MLOps: pipeline CI/CD/CT</a></li>
<li><a href="https://mlflow.org/docs/latest/index.html" target="_blank" rel="noopener">Tài liệu MLflow</a></li>
<li><a href="https://www.kubeflow.org/docs/" target="_blank" rel="noopener">Tài liệu Kubeflow</a></li>
<li><a href="https://dvc.org/doc" target="_blank" rel="noopener">Tài liệu DVC (Data Version Control)</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@MLOps" target="_blank" rel="noopener">MLOps.community</a> — talk &amp; phỏng vấn người làm nghề</li>
<li><a href="https://www.youtube.com/@abhishekkrthakur" target="_blank" rel="noopener">Abhishek Thakur</a> — ML ứng dụng &amp; triển khai</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://mlflow.org/" target="_blank" rel="noopener">MLflow</a> — theo dõi thí nghiệm &amp; model registry</li>
<li><a href="https://dvc.org/" target="_blank" rel="noopener">DVC</a> — versioning dữ liệu &amp; pipeline</li>
<li><a href="https://www.docker.com/" target="_blank" rel="noopener">Docker</a> — container hoá mô hình</li>
<li><a href="https://kubernetes.io/" target="_blank" rel="noopener">Kubernetes</a> — điều phối ở quy mô lớn</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — MLOps là gì, ML khác phần mềm, mức trưởng thành, vòng đời.</li>
<li><strong>Dựng pipeline</strong> — dữ liệu &amp; feature, theo dõi thí nghiệm, đóng gói &amp; registry.</li>
<li><strong>Đưa lên chạy</strong> — mẫu triển khai và tự động CI/CD/CT.</li>
<li><strong>Vận hành</strong> — giám sát, drift, huấn luyện lại, hạ tầng &amp; quản trị.</li>
</ol></div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola8', name: 'Kỳ 8', ordinal: 10 },
  course: {
    courseCode: 'MLO401',
    slug: 'mlo401-machine-learning-operations',
    title: 'Machine learning operations',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/MLO401.webp',
    shortDescription: 'Take ML models to production with MLOps — data & feature pipelines, experiment tracking (MLflow), model registry, deployment, CI/CD/CT, monitoring & drift, Kubernetes/Kubeflow & governance. Bilingual, Python/YAML examples & quizzes.|||Đưa mô hình ML lên production với MLOps — pipeline dữ liệu & feature, theo dõi thí nghiệm (MLflow), model registry, triển khai, CI/CD/CT, giám sát & drift, Kubernetes/Kubeflow & quản trị. Song ngữ, ví dụ Python/YAML & quiz.',
    description: 'Môn <strong>MLO401 — Machine Learning Operations (MLOps)</strong> (ngành Khoa học Máy tính, kỳ 8) dạy bạn <strong>đưa mô hình ML từ notebook ra production và vận hành nó ổn định</strong>. Từ <strong>nền tảng</strong> (MLOps là gì, ML khác phần mềm, mức trưởng thành) → <strong>dữ liệu &amp; feature</strong> (pipeline, feature store, DVC) → <strong>huấn luyện &amp; thí nghiệm</strong> (MLflow, reproducibility) → <strong>đóng gói &amp; versioning</strong> (model registry, Docker) → <strong>triển khai</strong> (batch/online, REST, TF Serving) → <strong>CI/CD/CT</strong> → <strong>giám sát &amp; drift</strong> → <strong>hạ tầng &amp; quản trị</strong> (Kubernetes/Kubeflow, chi phí, responsible AI). Song ngữ, có code Python/YAML và quiz mỗi chương. Sách chuẩn: Chip Huyen, Burkov, Google Cloud MLOps.',
    whatYouLearn: 'MLOps &amp; vòng đời ML; mức trưởng thành 0/1/2; data pipeline, feature store, chống training-serving skew, DVC; experiment tracking (MLflow) &amp; reproducibility; model registry, đóng gói ONNX/SavedModel, container hoá; mẫu triển khai batch/online/streaming, REST API (FastAPI), TF Serving, canary/shadow/blue-green; CI/CD/CT &amp; kiểm thử ML; giám sát, data/concept drift, retraining trigger; Kubernetes/Kubeflow, quản lý chi phí, governance &amp; responsible AI.',
    requirements: 'Đã biết cơ bản về máy học (huấn luyện/đánh giá mô hình) và Python. Nên quen Git, Docker và dòng lệnh Linux. Kiến thức API/REST là một lợi thế.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide FLM, sách chuẩn (Chip Huyen, Burkov), Google MLOps, MLflow/Kubeflow, YouTube, công cụ.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'MLOps là gì, vòng đời ML, lộ trình 4 bước, bộ công cụ.', lessons: [intro] },
    { title: 'Chương 1 — MLOps là gì|||Chapter 1 — What is MLOps', description: 'ML trong production, ML vs software, maturity, technical debt.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Dữ liệu & feature|||Chapter 2 — Data & features', description: 'Data pipeline, feature store, DVC, validation.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Huấn luyện & thử nghiệm|||Chapter 3 — Training & experiments', description: 'MLflow, reproducibility, hyperparameter tuning.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Đóng gói & versioning|||Chapter 4 — Packaging & versioning', description: 'Model registry, ONNX/SavedModel, containerize.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Triển khai mô hình|||Chapter 5 — Model deployment', description: 'Batch/online/streaming, REST API, TF Serving, canary/shadow.', lessons: [c5, c5q] },
    { title: 'Chương 6 — CI/CD cho ML|||Chapter 6 — CI/CD for ML', description: 'CI/CD/CT, testing ML, pipeline tự động (YAML).', lessons: [c6, c6q] },
    { title: 'Chương 7 — Giám sát & vận hành|||Chapter 7 — Monitoring & ops', description: 'Monitoring, data/model drift, retraining, alerting.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Hạ tầng & quản trị|||Chapter 8 — Infra & governance', description: 'Kubernetes/Kubeflow, chi phí, governance, responsible AI.', lessons: [c8, c8q] },
  ],
};
