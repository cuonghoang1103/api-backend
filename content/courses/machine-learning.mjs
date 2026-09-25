/**
 * Machine Learning Fundamentals — khoá học CuongThai (Courses, GENERAL). KHUNG dựng 25/09/2026 (công khai ngay theo cách
 * làm của 11 khoá khung trước — status PUBLISHED, bài chưa soạn hiện "Đang soạn"), chi tiết soạn sau. Nằm trong lộ trình
 * ở ~/Documents/LO-TRINH-HOC.md. Nối tiếp khoá Python; nền cho khoá Deep Learning. Xem _chung/khung.mjs.
 */
import { khung } from './_chung/khung.mjs';

export default {
  category: { slug: 'ai', name: 'AI & Tự động hoá', icon: 'Sparkles', sortOrder: 6 },
  course: {
    slug: 'machine-learning',
    title: 'Machine Learning Fundamentals',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: false,
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/machine-learning.png?v=1',
    shortDescription: 'Just enough math (vectors, derivatives, probability), then numpy, pandas and scikit-learn for real: regression, classification, trees, clustering, proper train/test evaluation, overfitting, feature engineering, and a small project.|||Vừa đủ toán (vector, đạo hàm, xác suất), rồi tới numpy, pandas và scikit-learn thật sự: hồi quy, phân loại, cây quyết định, phân cụm, đánh giá train/test đúng cách, overfitting, feature engineering, và một dự án nhỏ.',
    description: 'Khoá Machine Learning nền tảng, dạy đủ để hiểu ML làm gì và tự làm được một mô hình chạy đúng — không sa vào toán hàn lâm không cần thiết. Đi từ toán vừa đủ (vector, ma trận, đạo hàm ở mức trực giác, xác suất và thống kê cơ bản), numpy và pandas cho dữ liệu, quy trình làm việc chuẩn của scikit-learn (chia train/test, pipeline), các mô hình chính: hồi quy tuyến tính/logistic, cây quyết định và ensemble (random forest, gradient boosting), phân cụm (k-means) và giảm chiều (PCA), cách đánh giá mô hình đúng (cross-validation, các chỉ số cho từng bài toán), overfitting/underfitting và regularization, feature engineering, tới một dự án nhỏ áp dụng toàn bộ quy trình trên dữ liệu thật. Là nền để học tiếp Deep Learning.',
    whatYouLearn: 'Đủ toán để hiểu vì sao các thuật toán ML hoạt động (vector, đạo hàm, xác suất) mà không cần chứng minh hàn lâm; xử lý dữ liệu thành thạo với numpy và pandas; dùng đúng quy trình scikit-learn (train/test split, pipeline, tránh rò rỉ dữ liệu); chọn và huấn luyện mô hình phù hợp bài toán (hồi quy, phân loại, cây, ensemble, cụm); đánh giá mô hình bằng đúng chỉ số cho đúng bài toán, không chỉ nhìn accuracy; nhận diện và xử lý overfitting bằng cross-validation và regularization; và làm feature engineering để cải thiện mô hình một cách có căn cứ.',
    requirements: 'Biết Python ở mức khoá "Python for Backend & AI" trên trang này (hàm, list/dict, đặc biệt là numpy/pandas ở Chương 10 của khoá đó). Không cần biết trước về xác suất/thống kê hay đại số tuyến tính — Chương 1–2 dạy đủ phần cần dùng.',
    documentsNote: 'Tài liệu chính: scikit-learn.org/stable/user_guide.html • numpy.org/doc • pandas.pydata.org/docs • Cuốn "An Introduction to Statistical Learning" (statlearning.com, bản PDF miễn phí) là tài liệu đọc thêm tốt cho phần lý thuyết mô hình.',
  },
  sections: khung('ml', [
    ['Section 0 — What machine learning actually is', 'Mục 0 — Machine learning thực chất là gì', 'ML khác lập trình luật cứng ở đâu, và khi nào nó là công cụ đúng.', [
      ['bat-dau-tai-day', 'Start here (1/2) — What ML is, a short history, and why it is not magic', 'Bắt đầu tại đây (1/2) — ML là gì, lịch sử ngắn gọn, và vì sao nó không phải phép màu', 'Lập trình luật cứng (if/else) vs học từ dữ liệu · Từ Perceptron 1957 tới scikit-learn 2007 tới thời đại LLM · ML là gì trong ba chữ: dữ liệu, mô hình, đánh giá · Câu hỏi phỏng vấn hay gặp'],
      ['bat-dau-khi-khong-co', 'Start here (2/2) — When rules beat ML, and how to study this course', 'Bắt đầu tại đây (2/2) — Khi nào luật cứng tốt hơn ML, và cách học khoá này', 'Tình huống: dùng ML cho bài toán mà một câu if đã giải quyết được, gây phức tạp thừa · ML vs LLM: khi nào cần huấn luyện mô hình riêng thay vì gọi API LLM có sẵn · Lộ trình: toán vừa đủ → numpy/pandas → quy trình sklearn → mô hình → đánh giá → dự án'],
      ['cai-dat', 'Setting up: uv, numpy, pandas, scikit-learn', 'Cài đặt: uv, numpy, pandas, scikit-learn', 'uv add numpy pandas scikit-learn matplotlib · Jupyter notebook hay script .py — dùng cái nào trong khoá này · Vẽ biểu đồ đơn giản với matplotlib'],
      ['quy-trinh-ml', 'The ML workflow at a glance', 'Quy trình ML nhìn tổng thể', 'Thu thập dữ liệu → làm sạch → chia train/test → huấn luyện → đánh giá → tinh chỉnh · Phần lớn thời gian thực tế nằm ở làm sạch dữ liệu, không phải huấn luyện mô hình'],
    ]],
    ['Chapter 1 — Just enough math: vectors and derivatives', 'Chương 1 — Toán vừa đủ: vector và đạo hàm', 'Trực giác, không chứng minh — đủ để hiểu mô hình đang làm gì.', [
      ['vector-matrix', 'Vectors and matrices, intuitively', 'Vector và ma trận, hiểu một cách trực giác', 'Một hàng dữ liệu là một vector · Phép nhân ma trận là "tổ hợp có trọng số" · Vì sao ML biểu diễn dữ liệu bằng ma trận thay vì vòng lặp'],
      ['dao-ham-truc-giac', 'Derivatives as "which way is downhill"', 'Đạo hàm như "hướng nào là xuống dốc"', 'Đạo hàm đo độ dốc, không cần công thức phức tạp để hiểu ý nghĩa · Gradient là đạo hàm cho nhiều biến · Trực giác này là nền cho gradient descent (dùng lại ở khoá Deep Learning)'],
      ['gradient-descent-truc-giac', 'Gradient descent, intuitively', 'Gradient descent, hiểu một cách trực giác', 'Đi ngược hướng dốc để giảm sai số dần dần · Learning rate là bước đi lớn hay nhỏ · Minh hoạ bằng một hàm mất mát một biến đơn giản'],
      ['khi-nao-can-toan', 'How much math you actually need day to day', 'Bạn thực sự cần bao nhiêu toán mỗi ngày', 'scikit-learn tính toán hộ phần nặng · Hiểu trực giác đủ để chọn đúng mô hình và đọc lỗi đúng cách · Khi nào cần đào sâu hơn (nghiên cứu, tự viết thuật toán)'],
    ]],
    ['Chapter 2 — Probability and statistics essentials', 'Chương 2 — Xác suất và thống kê thiết yếu', 'Đủ để đọc hiểu dữ liệu và đánh giá mô hình đúng cách.', [
      ['phan-phoi', 'Distributions and summary statistics', 'Phân phối và thống kê tóm tắt', 'Trung bình, trung vị, độ lệch chuẩn · Phân phối chuẩn và vì sao nó xuất hiện khắp nơi · Outlier ảnh hưởng thống kê thế nào'],
      ['xac-suat-co-ban', 'Basic probability for ML', 'Xác suất cơ bản cho ML', 'Xác suất có điều kiện, trực giác về Bayes · Vì sao mô hình phân loại trả về xác suất, không phải nhãn chắc chắn · Ngưỡng quyết định (decision threshold)'],
      ['tuong-quan', 'Correlation vs causation', 'Tương quan khác nhân quả', 'Hai biến tương quan không có nghĩa biến này gây ra biến kia · Ví dụ thật gây hiểu lầm · Vì sao điều này quan trọng khi diễn giải kết quả mô hình'],
      ['lay-mau', 'Sampling and why it matters', 'Lấy mẫu và vì sao nó quan trọng', 'Dữ liệu huấn luyện phải đại diện cho dữ liệu thật · Sampling bias làm mô hình lệch một cách âm thầm · Ví dụ: dữ liệu huấn luyện thiếu một nhóm đối tượng'],
    ]],
    ['Chapter 3 — numpy fundamentals', 'Chương 3 — Nền tảng numpy', 'Mảng và phép toán vector hoá — nền cho mọi thư viện ML.', [
      ['ndarray', 'ndarray: shape, dtype, indexing', 'ndarray: shape, dtype, indexing', 'Tạo mảng, kiểm shape và dtype · Indexing và slicing nhiều chiều · Mảng 2D biểu diễn một bảng dữ liệu'],
      ['broadcasting', 'Broadcasting and vectorized operations', 'Broadcasting và phép toán vector hoá', 'Phép toán trên cả mảng không cần vòng lặp · Quy tắc broadcasting giữa các shape khác nhau · So sánh tốc độ với vòng lặp Python thuần'],
      ['aggregation', 'Aggregations: mean, sum, axis', 'Tổng hợp: mean, sum, và trục (axis)', 'Tổng hợp theo trục 0 (theo cột) vs trục 1 (theo hàng) · Vì sao nhầm axis là lỗi rất phổ biến · Boolean indexing để lọc dữ liệu'],
      ['random-seed', 'Random numbers and reproducibility', 'Số ngẫu nhiên và khả năng tái lập', 'np.random.default_rng và seed · Vì sao đặt seed cố định khi thử nghiệm · Chia dữ liệu ngẫu nhiên có kiểm soát'],
    ]],
    ['Chapter 4 — pandas for data wrangling', 'Chương 4 — pandas để xử lý dữ liệu', 'Đọc, làm sạch, và khám phá dữ liệu trước khi đưa vào mô hình.', [
      ['doc-du-lieu', 'Loading data: CSV, JSON, SQL', 'Đọc dữ liệu: CSV, JSON, SQL', 'pd.read_csv và các tham số hay dùng · Đọc trực tiếp từ PostgreSQL bằng SQLAlchemy (nối lại khoá PostgreSQL) · Kiểm nhanh bằng head/info/describe'],
      ['lam-sach', 'Cleaning: missing values and duplicates', 'Làm sạch: giá trị thiếu và trùng lặp', 'isna/fillna/dropna — chọn cách nào cho từng tình huống · Phát hiện và xử lý dòng trùng lặp · Chuẩn hoá kiểu dữ liệu từng cột'],
      ['bien-doi-loc', 'Filtering, selecting and transforming', 'Lọc, chọn và biến đổi dữ liệu', 'Lọc theo điều kiện, chọn cột · apply và khi nào nên tránh vì chậm · Tạo cột mới từ cột có sẵn'],
      ['groupby-merge', 'GroupBy and merging datasets', 'GroupBy và ghép nhiều tập dữ liệu', 'groupby + agg cho tổng hợp theo nhóm · merge/join giữa hai DataFrame · Kiểm tra dữ liệu sau khi ghép không bị nhân đôi'],
    ]],
    ['Chapter 5 — The scikit-learn workflow', 'Chương 5 — Quy trình làm việc với scikit-learn', 'train/test split, pipeline, và tránh rò rỉ dữ liệu.', [
      ['train-test-split', 'Train/test split and why it matters', 'Chia train/test và vì sao nó quan trọng', 'train_test_split cơ bản · Vì sao đánh giá trên chính dữ liệu huấn luyện là tự lừa mình · random_state để tái lập kết quả'],
      ['fit-predict', 'The fit/predict/transform API', 'API fit/predict/transform', 'estimator.fit(X, y) rồi .predict(X_new) · Transformer dùng .fit_transform · API nhất quán trên mọi mô hình sklearn'],
      ['pipeline', 'Pipelines: chaining preprocessing and model', 'Pipeline: nối bước tiền xử lý và mô hình', 'Pipeline gộp scaler + encoder + model thành một bước · Vì sao pipeline tránh rò rỉ dữ liệu tốt hơn xử lý tay · ColumnTransformer cho cột số và cột phân loại khác nhau'],
      ['data-leakage', 'Data leakage: the mistake that inflates every metric', 'Rò rỉ dữ liệu: lỗi làm mọi chỉ số bị thổi phồng', 'Fit scaler/encoder trên toàn bộ dữ liệu trước khi chia là rò rỉ · Dấu hiệu: độ chính xác cao bất thường trên test · Luôn fit trên train, transform trên cả train và test'],
    ]],
    ['Chapter 6 — Regression models', 'Chương 6 — Mô hình hồi quy', 'Dự đoán một giá trị số liên tục.', [
      ['linear-regression', 'Linear regression', 'Hồi quy tuyến tính', 'Đường/mặt phẳng khớp dữ liệu tốt nhất · Hệ số hồi quy nghĩa là gì · Giả định của hồi quy tuyến tính (và khi vi phạm thì sao)'],
      ['metric-hoi-quy', 'Regression metrics: MAE, MSE, RMSE, R²', 'Chỉ số cho hồi quy: MAE, MSE, RMSE, R²', 'Khác biệt giữa các chỉ số, khi nào dùng cái nào · R² không phải lúc nào cũng đủ để đánh giá · Đơn vị của chỉ số nên khớp bài toán thực tế'],
      ['regularization', 'Ridge and Lasso: regularization for regression', 'Ridge và Lasso: regularization cho hồi quy', 'Regularization phạt hệ số lớn để giảm overfitting · Ridge (L2) vs Lasso (L1, tự chọn feature) · Tham số alpha điều khiển mức phạt'],
      ['polynomial', 'Polynomial features for non-linear relationships', 'Đặc trưng đa thức cho quan hệ phi tuyến', 'PolynomialFeatures mở rộng dữ liệu · Đánh đổi giữa khớp dữ liệu tốt hơn và nguy cơ overfitting · Trực quan hoá bằng đồ thị 2D'],
    ]],
    ['Chapter 7 — Classification models', 'Chương 7 — Mô hình phân loại', 'Dự đoán một nhãn rời rạc.', [
      ['logistic-regression', 'Logistic regression', 'Hồi quy logistic', 'Dù tên có "regression", đây là mô hình phân loại · Hàm sigmoid biến điểm số thành xác suất · Phân loại nhị phân và mở rộng đa lớp'],
      ['metric-phan-loai', 'Classification metrics: accuracy is not enough', 'Chỉ số cho phân loại: accuracy chưa đủ', 'Ma trận nhầm lẫn (confusion matrix) · Precision, recall, F1 — và vì sao cần khi dữ liệu mất cân bằng · ROC-AUC và đường cong ROC'],
      ['mat-can-bang', 'Handling imbalanced classes', 'Xử lý dữ liệu mất cân bằng lớp', 'Ví dụ: 99% dữ liệu thuộc một lớp làm accuracy đánh lừa · class_weight trong sklearn · Oversampling/undersampling giới thiệu ngắn gọn'],
      ['knn-svm', 'k-NN and a first look at SVM', 'k-NN và cái nhìn đầu tiên về SVM', 'k-Nearest Neighbors: phân loại theo hàng xóm gần nhất · SVM: tìm biên phân tách tối ưu (trực giác, không đào sâu toán) · Khi nào các mô hình này phù hợp hơn logistic regression'],
    ]],
    ['Chapter 8 — Trees and ensembles', 'Chương 8 — Cây quyết định và ensemble', 'Từ một cây đơn tới rừng cây và boosting.', [
      ['decision-tree', 'Decision trees', 'Cây quyết định', 'Chia dữ liệu theo câu hỏi if/else học được từ dữ liệu · Đọc được, giải thích được — lợi thế lớn của cây · max_depth và nguy cơ overfitting của một cây đơn'],
      ['random-forest', 'Random forests', 'Random forest', 'Nhiều cây huấn luyện trên dữ liệu và feature ngẫu nhiên khác nhau · Bỏ phiếu/trung bình để giảm phương sai · feature_importances_ để hiểu mô hình đang dựa vào gì'],
      ['gradient-boosting', 'Gradient boosting (and a note on XGBoost/LightGBM)', 'Gradient boosting (và ghi chú về XGBoost/LightGBM)', 'Mỗi cây mới sửa lỗi của các cây trước, không huấn luyện độc lập như random forest · GradientBoostingClassifier/Regressor của sklearn · XGBoost/LightGBM là lựa chọn phổ biến hơn ở production (ghi chú, không bắt buộc cài)'],
      ['so-sanh-mo-hinh', 'Comparing models fairly', 'So sánh các mô hình một cách công bằng', 'Cùng một train/test split, cùng chỉ số đánh giá · Không chọn mô hình chỉ vì số liệu cao hơn 0.01 mà bỏ qua thời gian huấn luyện/độ phức tạp · Bắt đầu từ mô hình đơn giản trước khi thử mô hình phức tạp'],
    ]],
    ['Chapter 9 — Clustering and dimensionality reduction', 'Chương 9 — Phân cụm và giảm chiều', 'Học không giám sát: tìm cấu trúc khi không có nhãn.', [
      ['unsupervised-vs-supervised', 'Unsupervised vs supervised learning', 'Học không giám sát so với học có giám sát', 'Không có nhãn đúng để so sánh · Khi nào bài toán thực tế không có nhãn (phân khúc khách hàng) · Đánh giá kết quả không giám sát khó hơn có giám sát'],
      ['kmeans', 'k-means clustering', 'Phân cụm k-means', 'Thuật toán k-means hoạt động thế nào (trực giác) · Chọn số cụm k bằng elbow method · Giới hạn: k-means giả định cụm hình cầu, kích thước tương đồng'],
      ['pca', 'PCA for dimensionality reduction', 'PCA để giảm chiều dữ liệu', 'Giảm số chiều mà giữ được phần lớn thông tin · Trực quan hoá dữ liệu nhiều chiều xuống 2D · PCA cũng giúp giảm nhiễu trước khi huấn luyện mô hình khác'],
      ['ung-dung-thuc-te', 'Real use cases: segmentation and anomaly hints', 'Ứng dụng thực tế: phân khúc và gợi ý bất thường', 'Phân khúc khách hàng từ dữ liệu hành vi · Phát hiện điểm bất thường bằng khoảng cách tới cụm gần nhất (giới thiệu, không đào sâu anomaly detection) · Kết hợp PCA + k-means trong một pipeline'],
    ]],
    ['Chapter 10 — Model evaluation and overfitting', 'Chương 10 — Đánh giá mô hình và overfitting', 'Biết khi nào tin một con số, và khi nào mô hình chỉ học thuộc lòng.', [
      ['overfit-underfit', 'Overfitting vs underfitting', 'Overfitting và underfitting', 'Overfit: khớp hoàn hảo dữ liệu train, tệ trên dữ liệu mới · Underfit: mô hình quá đơn giản, không học được gì đáng kể · Đường cong học tập (learning curve) để nhận diện cả hai'],
      ['cross-validation', 'Cross-validation', 'Cross-validation (kiểm chứng chéo)', 'k-fold cross-validation thay vì một lần chia train/test · Đánh giá ổn định hơn, dùng dữ liệu hiệu quả hơn · Kết hợp với pipeline để tránh rò rỉ dữ liệu'],
      ['hyperparameter', 'Hyperparameter tuning', 'Tinh chỉnh siêu tham số', 'GridSearchCV và RandomizedSearchCV · Tinh chỉnh trên tập validation, đánh giá cuối trên test riêng biệt chưa từng đụng tới · Chi phí tính toán tăng nhanh khi lưới tham số lớn'],
      ['bao-cao-ket-qua', 'Reporting results honestly', 'Báo cáo kết quả trung thực', 'Không chọn chỉ số đẹp nhất trong nhiều lần chạy để báo cáo · Ghi rõ điều kiện đánh giá (dữ liệu nào, chỉ số nào) · Khoảng tin cậy từ cross-validation, không chỉ một con số duy nhất'],
    ]],
    ['Chapter 11 — Feature engineering and capstone', 'Chương 11 — Feature engineering và dự án cuối khoá', 'Cải thiện mô hình bằng dữ liệu tốt hơn, rồi ráp toàn bộ quy trình.', [
      ['feature-engineering', 'Feature engineering techniques', 'Kỹ thuật feature engineering', 'Encoding biến phân loại (one-hot, ordinal) · Scaling biến số (StandardScaler, MinMaxScaler) · Tạo feature mới có ý nghĩa nghiệp vụ, không chỉ tổ hợp máy móc'],
      ['chon-du-lieu-capstone', 'Choosing a real dataset for the project', 'Chọn một tập dữ liệu thật cho dự án', 'Một bài toán hồi quy hoặc phân loại có dữ liệu công khai · Đọc mô tả dữ liệu kỹ trước khi bắt đầu (tránh rò rỉ dữ liệu ngay từ khâu hiểu bài toán) · Đặt câu hỏi rõ ràng: dự đoán gì, thành công là gì'],
      ['xay-quy-trinh', 'Building the full pipeline end to end', 'Xây toàn bộ quy trình từ đầu tới cuối', 'Làm sạch → feature engineering → pipeline sklearn → thử vài mô hình · Cross-validation để chọn mô hình và tinh chỉnh · So sánh với một baseline đơn giản (ví dụ: luôn đoán giá trị trung bình)'],
      ['tong-ket', 'Wrap-up: what this took, and where Deep Learning goes further', 'Tổng kết: khoá này bao phủ gì, và Deep Learning đi xa hơn thế nào', 'Checklist năng lực cả khoá · Khi nào ML cổ điển đủ, khi nào cần mạng nơ-ron sâu (dữ liệu ảnh/văn bản phi cấu trúc) · Trỏ khoá Deep Learning with PyTorch'],
    ]],
  ]),
};
