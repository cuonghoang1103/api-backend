/**
 * CPV301 — Computer Vision (Thị giác máy tính). Ngành AI/Robotics FPTU.
 * KHUNG chất lượng bám giáo trình FLM (sylID 13292): 9 chương theo Szeliski
 * "Computer Vision: Algorithms and Applications" (miễn phí szeliski.org/Book/)
 * + Forsyth & Ponce; công cụ OpenCV/PyCharm, Python. Tiên quyết PFP191, CSD203.
 * Song ngữ EN+VI, có code OpenCV minh hoạ + quiz mỗi chương. Đào sâu sau.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${; & → &amp;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('cpv301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: sách chính Szeliski (miễn phí), Forsyth & Ponce, tài liệu OpenCV, công cụ OpenCV/PyCharm/NumPy/Matplotlib, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">CPV301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything you need to learn <strong>Computer Vision</strong> — from image formation to detection &amp; recognition — in one place. The official FPTU slides live on <strong>FLM</strong>; the main textbook below is <strong>free and legal</strong>.</p>
<h3>📘 Main textbook (free)</h3>
<ul>
<li><a href="https://szeliski.org/Book/" target="_blank" rel="noopener">Richard Szeliski — <em>Computer Vision: Algorithms and Applications</em></a> (Springer). Full PDF free on the author's site — this is the course's primary book.</li>
</ul>
<h3>📗 Reference books</h3>
<ul>
<li>Forsyth &amp; Ponce — <em>Computer Vision: A Modern Approach</em> (2nd ed.).</li>
<li><a href="https://opencv.org/" target="_blank" rel="noopener">OpenCV with Python</a> — practical, code-first.</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://docs.opencv.org/" target="_blank" rel="noopener">OpenCV docs (docs.opencv.org)</a> — API reference &amp; Python tutorials.</li>
<li><a href="https://pyimagesearch.com/" target="_blank" rel="noopener">PyImageSearch</a> — applied CV tutorials with OpenCV.</li>
<li><a href="https://numpy.org/doc/" target="_blank" rel="noopener">NumPy docs</a> &amp; <a href="https://matplotlib.org/stable/" target="_blank" rel="noopener">Matplotlib docs</a>.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><strong>OpenCV</strong> (cv2) — the core computer-vision library. Install: <code>pip install opencv-python</code>.</li>
<li><strong>PyCharm</strong> — the IDE used in the course.</li>
<li><strong>NumPy</strong> — images are arrays; <strong>Matplotlib</strong> — display results.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — how an image is formed, pixels &amp; colour, camera model.</li>
<li><strong>Processing</strong> — filtering, edges, transforms with OpenCV.</li>
<li><strong>Geometry</strong> — features, matching, RANSAC, homography, stitching.</li>
<li><strong>Recognition</strong> — detection (HOG, CNN/YOLO) &amp; recognition (faces, tracking).</li>
</ol></div>`,
    `<span class="eyebrow">CPV301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Thị giác máy tính</strong> — từ tạo ảnh đến phát hiện &amp; nhận dạng — gom về một chỗ. Slide chính thức của FPTU nằm trên <strong>FLM</strong>; sách chính bên dưới <strong>miễn phí và hợp pháp</strong>.</p>
<h3>📘 Sách chính (miễn phí)</h3>
<ul>
<li><a href="https://szeliski.org/Book/" target="_blank" rel="noopener">Richard Szeliski — <em>Computer Vision: Algorithms and Applications</em></a> (Springer). Bản PDF đầy đủ miễn phí trên trang tác giả — đây là sách chính của môn.</li>
</ul>
<h3>📗 Sách tham khảo</h3>
<ul>
<li>Forsyth &amp; Ponce — <em>Computer Vision: A Modern Approach</em> (bản 2).</li>
<li><a href="https://opencv.org/" target="_blank" rel="noopener">OpenCV với Python</a> — thiên về code, thực hành.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://docs.opencv.org/" target="_blank" rel="noopener">Tài liệu OpenCV (docs.opencv.org)</a> — tra API &amp; hướng dẫn Python.</li>
<li><a href="https://pyimagesearch.com/" target="_blank" rel="noopener">PyImageSearch</a> — hướng dẫn CV ứng dụng với OpenCV.</li>
<li><a href="https://numpy.org/doc/" target="_blank" rel="noopener">Tài liệu NumPy</a> &amp; <a href="https://matplotlib.org/stable/" target="_blank" rel="noopener">Tài liệu Matplotlib</a>.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><strong>OpenCV</strong> (cv2) — thư viện thị giác máy tính lõi. Cài: <code>pip install opencv-python</code>.</li>
<li><strong>PyCharm</strong> — IDE dùng trong môn.</li>
<li><strong>NumPy</strong> — ảnh là mảng số; <strong>Matplotlib</strong> — hiển thị kết quả.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — ảnh hình thành thế nào, điểm ảnh &amp; màu, mô hình camera.</li>
<li><strong>Xử lý</strong> — lọc, biên, các phép biến đổi bằng OpenCV.</li>
<li><strong>Hình học</strong> — đặc trưng, khớp, RANSAC, homography, ghép ảnh.</li>
<li><strong>Nhận dạng</strong> — phát hiện (HOG, CNN/YOLO) &amp; nhận dạng (khuôn mặt, bám vết).</li>
</ol></div>`,
  ]]);

const intro = doc('cpv301-0-1-overview', 'Course introduction & outcomes|||Giới thiệu môn học & chuẩn đầu ra',
  'CV là gì, ứng dụng thực tế, 9 CLO, cơ cấu điểm (Assignment 30% · Lab 10% · Practical Exam 20% · Progress test 10% · Final 30%), tiên quyết PFP191/CSD203.',
  [[
    `<span class="eyebrow">CPV301 · Introduction</span>
<h2>What is Computer Vision?</h2>
<p class="lead"><strong>Computer Vision (CV)</strong> is the science of getting computers to <strong>understand images and video</strong> — to recover, from arrays of pixels, the geometry, objects and meaning a human sees at a glance. It is the "inverse" of computer graphics: graphics turns a scene into an image; vision turns an image back into a description of the scene.</p>
<h3>Where it is used</h3>
<ul>
<li>Face unlock, photo search, medical imaging, OCR / document scanning.</li>
<li>Self-driving cars, drones, robotics (navigation, grasping).</li>
<li>AR filters, panorama stitching, industrial inspection, sports analytics.</li>
</ul>
<h3>9 Course Learning Outcomes (CLO)</h3>
<ol>
<li>CLO1 — Explain what CV is, related fields and applications.</li>
<li>CLO2 — Describe image formation: geometry, photometry, camera model &amp; calibration.</li>
<li>CLO3 — Apply image processing: point operators, filtering, Fourier, geometric transforms.</li>
<li>CLO4 — Detect &amp; match features: corners/patches, edges, lines.</li>
<li>CLO5 — Segment images into regions.</li>
<li>CLO6 — Align images by features (RANSAC, homography).</li>
<li>CLO7 — Stitch images into panoramas.</li>
<li>CLO8 — Detect objects in images.</li>
<li>CLO9 — Recognise objects/faces and track them over time.</li>
</ol>
<h3>Assessment</h3>
<pre><code>Assignment       30%
Lab              10%
Practical Exam   20%
Progress test    10%
Final exam       30%   (50 multiple-choice questions)
</code></pre>
<div class="callout"><span class="badge">Prerequisites</span> <strong>PFP191</strong> (Python programming) and <strong>CSD203</strong> (data structures &amp; algorithms). You will read and write Python + NumPy comfortably.</div>`,
    `<span class="eyebrow">CPV301 · Giới thiệu</span>
<h2>Thị giác máy tính là gì?</h2>
<p class="lead"><strong>Thị giác máy tính (CV)</strong> là ngành giúp máy tính <strong>hiểu ảnh và video</strong> — từ những mảng điểm ảnh, khôi phục lại hình học, đối tượng và ý nghĩa mà con người thấy ngay tức thì. Nó là "phép ngược" của đồ hoạ máy tính: đồ hoạ biến cảnh thành ảnh; thị giác biến ảnh trở lại thành mô tả về cảnh.</p>
<h3>Ứng dụng thực tế</h3>
<ul>
<li>Mở khoá khuôn mặt, tìm ảnh, ảnh y khoa, OCR / quét tài liệu.</li>
<li>Xe tự lái, drone, robot (dẫn đường, gắp vật).</li>
<li>Bộ lọc AR, ghép ảnh panorama, kiểm tra công nghiệp, phân tích thể thao.</li>
</ul>
<h3>9 chuẩn đầu ra (CLO)</h3>
<ol>
<li>CLO1 — Giải thích CV là gì, các lĩnh vực liên quan và ứng dụng.</li>
<li>CLO2 — Mô tả sự tạo ảnh: hình học, quang học, mô hình camera &amp; hiệu chỉnh.</li>
<li>CLO3 — Áp dụng xử lý ảnh: point operator, lọc, Fourier, biến đổi hình học.</li>
<li>CLO4 — Phát hiện &amp; khớp đặc trưng: góc/mảng, biên, đường thẳng.</li>
<li>CLO5 — Phân đoạn ảnh thành các vùng.</li>
<li>CLO6 — Căn chỉnh ảnh theo đặc trưng (RANSAC, homography).</li>
<li>CLO7 — Ghép ảnh thành panorama.</li>
<li>CLO8 — Phát hiện đối tượng trong ảnh.</li>
<li>CLO9 — Nhận dạng đối tượng/khuôn mặt và bám vết theo thời gian.</li>
</ol>
<h3>Cơ cấu điểm</h3>
<pre><code>Assignment       30%
Lab              10%
Practical Exam   20%
Progress test    10%
Final exam       30%   (50 câu trắc nghiệm)
</code></pre>
<div class="callout"><span class="badge">Tiên quyết</span> <strong>PFP191</strong> (lập trình Python) và <strong>CSD203</strong> (cấu trúc dữ liệu &amp; giải thuật). Bạn cần đọc/viết Python + NumPy thành thạo.</div>`,
  ]]);

const c1 = doc('cpv301-1-1-intro', '1.1 — Introduction to Computer Vision|||1.1 — Giới thiệu Thị giác máy tính',
  'CV là gì, các lĩnh vực liên quan (xử lý ảnh, ML, đồ hoạ, thị giác nhân học), vì sao CV khó (bài toán ngược, mờ nghĩa), pipeline chung.',
  [[
    `<span class="eyebrow">CPV301 · Chapter 1 · Lesson 1.1</span>
<h2>Introduction to Computer Vision</h2>
<h3>Related fields</h3>
<ul>
<li><strong>Image processing</strong> — image in, image out (denoise, sharpen). CV goes further: image in, <em>meaning</em> out.</li>
<li><strong>Machine learning / deep learning</strong> — modern CV learns features from data (CNNs).</li>
<li><strong>Computer graphics</strong> — the inverse problem (scene → image).</li>
<li><strong>Human vision / neuroscience</strong> — inspiration for many algorithms.</li>
</ul>
<h3>Why vision is hard</h3>
<p>Recovering a 3D scene from a 2D image is an <strong>ill-posed inverse problem</strong>: many scenes can produce the same pixels. Lighting, viewpoint, occlusion, scale and noise all change the pixels without changing the object — so CV must be robust to all of them.</p>
<h3>A typical CV pipeline</h3>
<pre><code>Acquire image -> Pre-process (filter) -> Extract features
             -> Match / segment / detect -> Interpret (decision)
</code></pre>
<p>An image in OpenCV is just a NumPy array of shape (height, width, channels), with pixel values 0–255.</p>
<pre><code class="language-python">import cv2
img = cv2.imread("photo.jpg")      # BGR, shape (H, W, 3)
print(img.shape, img.dtype)        # e.g. (480, 640, 3) uint8
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
cv2.imshow("gray", gray); cv2.waitKey(0)
</code></pre>
<div class="callout"><span class="badge">Key idea</span> Vision is <em>inference</em>: we guess the most likely scene that explains the pixels. Everything in this course builds tools for that guess.</div>`,
    `<span class="eyebrow">CPV301 · Chương 1 · Bài 1.1</span>
<h2>Giới thiệu Thị giác máy tính</h2>
<h3>Các lĩnh vực liên quan</h3>
<ul>
<li><strong>Xử lý ảnh</strong> — vào ảnh, ra ảnh (khử nhiễu, làm nét). CV đi xa hơn: vào ảnh, ra <em>ý nghĩa</em>.</li>
<li><strong>Học máy / học sâu</strong> — CV hiện đại học đặc trưng từ dữ liệu (CNN).</li>
<li><strong>Đồ hoạ máy tính</strong> — bài toán ngược (cảnh → ảnh).</li>
<li><strong>Thị giác người / thần kinh học</strong> — nguồn cảm hứng cho nhiều thuật toán.</li>
</ul>
<h3>Vì sao thị giác khó</h3>
<p>Khôi phục cảnh 3D từ ảnh 2D là <strong>bài toán ngược không chỉnh</strong>: nhiều cảnh khác nhau có thể tạo ra cùng bộ điểm ảnh. Ánh sáng, góc nhìn, che khuất, tỉ lệ và nhiễu đều làm đổi điểm ảnh mà không đổi vật thể — nên CV phải bền vững với tất cả.</p>
<h3>Pipeline CV điển hình</h3>
<pre><code>Thu ảnh -> Tiền xử lý (lọc) -> Trích đặc trưng
       -> Khớp / phân đoạn / phát hiện -> Diễn giải (quyết định)
</code></pre>
<p>Trong OpenCV, một ảnh chỉ là mảng NumPy có dạng (cao, rộng, kênh), giá trị điểm ảnh 0–255.</p>
<pre><code class="language-python">import cv2
img = cv2.imread("photo.jpg")      # BGR, shape (H, W, 3)
print(img.shape, img.dtype)        # vd (480, 640, 3) uint8
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
cv2.imshow("gray", gray); cv2.waitKey(0)
</code></pre>
<div class="callout"><span class="badge">Ý chính</span> Thị giác là <em>suy luận</em>: ta đoán cảnh khả dĩ nhất giải thích được điểm ảnh. Cả môn học xây công cụ cho phép đoán đó.</div>`,
  ]]);

const c1q = quiz('cpv301-quiz-1', 'Quiz 1 — Introduction|||Quiz 1 — Giới thiệu', [
  { id: 'q1', question: 'Điểm khác giữa Thị giác máy tính và Xử lý ảnh?|||Difference between Computer Vision and Image Processing?', options: ['CV: vào ảnh ra ý nghĩa; XLA: vào ảnh ra ảnh|||CV: image in, meaning out; IP: image in, image out', 'Hai cái hoàn toàn giống nhau|||They are identical', 'CV chỉ làm việc với ảnh xám|||CV works only on grayscale', 'XLA cần deep learning, CV thì không|||IP needs deep learning, CV does not'], correctIndex: 0, explanation: 'XLA biến ảnh thành ảnh; CV rút ra mô tả/ý nghĩa từ ảnh.' },
  { id: 'q2', question: 'Vì sao khôi phục cảnh 3D từ ảnh 2D là bài toán "không chỉnh"?|||Why is recovering a 3D scene from a 2D image "ill-posed"?', options: ['Nhiều cảnh khác nhau cho cùng bộ điểm ảnh|||Many scenes give the same pixels', 'Máy tính quá chậm|||Computers are too slow', 'Ảnh luôn bị nén|||Images are always compressed', 'Không có thư viện phù hợp|||No suitable library exists'], correctIndex: 0, explanation: 'Mất một chiều nên lời giải không duy nhất — ill-posed.' },
  { id: 'q3', question: 'Trong OpenCV một ảnh màu được biểu diễn là?|||In OpenCV a colour image is represented as?', options: ['Mảng NumPy (cao, rộng, kênh)|||A NumPy array (H, W, channels)', 'Một chuỗi ký tự|||A string', 'Một danh sách file|||A list of files', 'Một số nguyên|||A single integer'], correctIndex: 0, explanation: 'Ảnh là mảng NumPy uint8, kênh BGR trong OpenCV.' },
]);

const c2 = doc('cpv301-2-1-image-formation', '2.1 — Image formation & camera model|||2.1 — Tạo ảnh & mô hình camera',
  'Geometric primitives & phép biến đổi (dịch/xoay/affine/projective), photometric (ánh sáng, phản xạ, BRDF), camera pinhole, ma trận nội/ngoại, hiệu chỉnh camera bằng cv2.calibrateCamera.',
  [[
    `<span class="eyebrow">CPV301 · Chapter 2 · Lesson 2.1</span>
<h2>Image formation &amp; the camera model</h2>
<h3>Geometric primitives &amp; transformations</h3>
<p>Points, lines and planes in 2D/3D are transformed by matrices. From most to least restrictive: <strong>translation → rigid (rotation+translation) → similarity → affine → projective</strong>. A projective transform (homography) maps a plane to a plane and preserves straight lines.</p>
<h3>Photometric image formation</h3>
<p>Pixel brightness depends on <strong>light sources</strong>, the surface's <strong>reflectance</strong> (how it scatters light, e.g. the BRDF) and the camera's sensitivity. This is why the same object looks different under different lighting.</p>
<h3>The pinhole camera</h3>
<p>A 3D point projects to the image plane through a single centre. In homogeneous coordinates: <strong>x = K [R | t] X</strong>, where <strong>K</strong> is the intrinsic matrix (focal length fx, fy and principal point cx, cy) and <strong>[R | t]</strong> the extrinsics (pose). Real lenses add <strong>distortion</strong> (barrel / pincushion).</p>
<h3>Camera calibration</h3>
<p>Calibration finds K and the distortion coefficients from photos of a known chessboard pattern.</p>
<pre><code class="language-python">import cv2, numpy as np
ok, corners = cv2.findChessboardCorners(gray, (9, 6))
ret, K, dist, rvecs, tvecs = cv2.calibrateCamera(
    objpoints, imgpoints, gray.shape[::-1], None, None)
undistorted = cv2.undistort(img, K, dist)
</code></pre>
<div class="callout"><span class="badge">Why calibrate</span> Without K and distortion you cannot measure real-world geometry (distances, 3D) from pixels. Calibration is step zero for any metric vision task.</div>`,
    `<span class="eyebrow">CPV301 · Chương 2 · Bài 2.1</span>
<h2>Tạo ảnh &amp; mô hình camera</h2>
<h3>Nguyên thể hình học &amp; phép biến đổi</h3>
<p>Điểm, đường, mặt phẳng trong 2D/3D được biến đổi bằng ma trận. Từ chặt đến lỏng: <strong>tịnh tiến → cứng (xoay+tịnh tiến) → đồng dạng → affine → xạ ảnh (projective)</strong>. Phép xạ ảnh (homography) ánh xạ mặt phẳng sang mặt phẳng và giữ đường thẳng thẳng.</p>
<h3>Tạo ảnh theo quang học</h3>
<p>Độ sáng điểm ảnh phụ thuộc <strong>nguồn sáng</strong>, <strong>độ phản xạ</strong> của bề mặt (cách nó tán xạ ánh sáng, vd BRDF) và độ nhạy camera. Đó là lý do cùng một vật trông khác nhau dưới ánh sáng khác nhau.</p>
<h3>Camera lỗ kim (pinhole)</h3>
<p>Một điểm 3D chiếu lên mặt ảnh qua một tâm duy nhất. Toạ độ thuần nhất: <strong>x = K [R | t] X</strong>, với <strong>K</strong> là ma trận nội (tiêu cự fx, fy và tâm ảnh cx, cy) và <strong>[R | t]</strong> là ma trận ngoại (tư thế). Ống kính thật thêm <strong>méo</strong> (barrel / pincushion).</p>
<h3>Hiệu chỉnh camera</h3>
<p>Hiệu chỉnh tìm K và hệ số méo từ ảnh của một bàn cờ đã biết kích thước.</p>
<pre><code class="language-python">import cv2, numpy as np
ok, corners = cv2.findChessboardCorners(gray, (9, 6))
ret, K, dist, rvecs, tvecs = cv2.calibrateCamera(
    objpoints, imgpoints, gray.shape[::-1], None, None)
undistorted = cv2.undistort(img, K, dist)
</code></pre>
<div class="callout"><span class="badge">Vì sao hiệu chỉnh</span> Không có K và hệ số méo thì không đo được hình học thực (khoảng cách, 3D) từ điểm ảnh. Hiệu chỉnh là bước số 0 cho mọi tác vụ thị giác đo đạc.</div>`,
  ]]);

const c2q = quiz('cpv301-quiz-2', 'Quiz 2 — Image formation|||Quiz 2 — Tạo ảnh', [
  { id: 'q1', question: 'Ma trận nội (intrinsic) K của camera chứa gì?|||What does the camera intrinsic matrix K contain?', options: ['Tiêu cự và tâm ảnh (fx, fy, cx, cy)|||Focal length & principal point (fx, fy, cx, cy)', 'Vị trí và hướng của camera|||Camera position & orientation', 'Màu của điểm ảnh|||Pixel colours', 'Số khung hình mỗi giây|||Frames per second'], correctIndex: 0, explanation: 'K là thông số bên trong camera; [R|t] mới là ngoại (tư thế).' },
  { id: 'q2', question: 'Phép biến đổi nào ánh xạ mặt phẳng sang mặt phẳng và giữ đường thẳng thẳng?|||Which transform maps a plane to a plane and keeps straight lines straight?', options: ['Homography (xạ ảnh)|||Homography (projective)', 'Chỉ tịnh tiến|||Translation only', 'Khử nhiễu Gaussian|||Gaussian denoising', 'Cân bằng histogram|||Histogram equalization'], correctIndex: 0, explanation: 'Homography là biến đổi xạ ảnh giữa hai mặt phẳng.' },
  { id: 'q3', question: 'Hàm OpenCV nào dùng để hiệu chỉnh camera từ ảnh bàn cờ?|||Which OpenCV function calibrates a camera from chessboard images?', options: ['cv2.calibrateCamera|||cv2.calibrateCamera', 'cv2.Canny|||cv2.Canny', 'cv2.imshow|||cv2.imshow', 'cv2.threshold|||cv2.threshold'], correctIndex: 0, explanation: 'cv2.calibrateCamera trả về K, hệ số méo, rvecs, tvecs.' },
]);

const c3 = doc('cpv301-3-1-image-processing', '3.1 — Image processing|||3.1 — Xử lý ảnh',
  'Point operator (histogram, độ tương phản, cân bằng histogram), lọc tuyến tính (convolution, Gaussian, median, box), biến đổi Fourier (miền tần số), biến đổi hình học (resize/warpAffine).',
  [[
    `<span class="eyebrow">CPV301 · Chapter 3 · Lesson 3.1</span>
<h2>Image processing</h2>
<h3>Point operators</h3>
<p>Applied per-pixel: brightness/contrast (out = a·in + b), thresholding, gamma. The <strong>histogram</strong> shows how many pixels have each intensity; <strong>histogram equalization</strong> spreads it out to improve contrast.</p>
<h3>Linear filtering (convolution)</h3>
<p>Slide a small kernel over the image; each output pixel is a weighted sum of its neighbours. A <strong>Gaussian</strong> kernel blurs/denoises smoothly; a <strong>box</strong> kernel averages; a <strong>median</strong> filter (non-linear) removes salt-and-pepper noise while keeping edges.</p>
<pre><code class="language-python">import cv2
blur   = cv2.GaussianBlur(img, (5, 5), 0)   # smooth / denoise
median = cv2.medianBlur(img, 5)              # kill salt-and-pepper
eq     = cv2.equalizeHist(gray)             # boost contrast
</code></pre>
<h3>Fourier transform</h3>
<p>The <strong>Fourier transform</strong> re-expresses an image as a sum of sine waves — the <em>frequency domain</em>. Low frequencies are smooth areas, high frequencies are edges/detail. Filtering becomes multiplication in this domain (a low-pass filter blurs, a high-pass sharpens).</p>
<h3>Geometric transformations</h3>
<p>Resize, rotate, warp — resampling the image with interpolation.</p>
<pre><code class="language-python">rot = cv2.warpAffine(img, M, (w, h))   # M is a 2x3 affine matrix
small = cv2.resize(img, (w // 2, h // 2))
</code></pre>
<div class="callout"><span class="badge">Rule of thumb</span> Denoise <em>before</em> detecting edges — a Gaussian blur first makes Canny far more stable.</div>`,
    `<span class="eyebrow">CPV301 · Chương 3 · Bài 3.1</span>
<h2>Xử lý ảnh</h2>
<h3>Point operator (theo từng điểm)</h3>
<p>Áp lên từng điểm ảnh: sáng/tương phản (out = a·in + b), ngưỡng hoá, gamma. <strong>Histogram</strong> cho biết mỗi mức sáng có bao nhiêu điểm; <strong>cân bằng histogram</strong> trải đều để tăng tương phản.</p>
<h3>Lọc tuyến tính (convolution)</h3>
<p>Trượt một nhân nhỏ trên ảnh; mỗi điểm ra là tổng có trọng số của các điểm lân cận. Nhân <strong>Gaussian</strong> làm mờ/khử nhiễu mượt; nhân <strong>box</strong> lấy trung bình; lọc <strong>median</strong> (phi tuyến) khử nhiễu muối tiêu mà vẫn giữ biên.</p>
<pre><code class="language-python">import cv2
blur   = cv2.GaussianBlur(img, (5, 5), 0)   # làm mượt / khử nhiễu
median = cv2.medianBlur(img, 5)              # diệt nhiễu muối tiêu
eq     = cv2.equalizeHist(gray)             # tăng tương phản
</code></pre>
<h3>Biến đổi Fourier</h3>
<p><strong>Biến đổi Fourier</strong> viết lại ảnh thành tổng các sóng sin — <em>miền tần số</em>. Tần số thấp là vùng phẳng, tần số cao là biên/chi tiết. Lọc trở thành phép nhân trong miền này (lọc thông thấp làm mờ, thông cao làm nét).</p>
<h3>Biến đổi hình học</h3>
<p>Thay đổi kích thước, xoay, warp — lấy mẫu lại ảnh có nội suy.</p>
<pre><code class="language-python">rot = cv2.warpAffine(img, M, (w, h))   # M là ma trận affine 2x3
small = cv2.resize(img, (w // 2, h // 2))
</code></pre>
<div class="callout"><span class="badge">Mẹo</span> Khử nhiễu <em>trước</em> khi dò biên — làm mờ Gaussian trước giúp Canny ổn định hơn nhiều.</div>`,
  ]]);

const c3q = quiz('cpv301-quiz-3', 'Quiz 3 — Image processing|||Quiz 3 — Xử lý ảnh', [
  { id: 'q1', question: 'Cân bằng histogram (histogram equalization) dùng để?|||Histogram equalization is used to?', options: ['Tăng độ tương phản|||Improve contrast', 'Xoay ảnh|||Rotate the image', 'Ghép hai ảnh|||Stitch two images', 'Nén ảnh|||Compress the image'], correctIndex: 0, explanation: 'Trải đều phân bố mức sáng → ảnh rõ tương phản hơn.' },
  { id: 'q2', question: 'Lọc nào tốt nhất để khử nhiễu muối tiêu mà vẫn giữ biên?|||Which filter best removes salt-and-pepper noise while keeping edges?', options: ['Lọc median|||Median filter', 'Lọc box trung bình|||Box average filter', 'Ngưỡng hoá|||Thresholding', 'Cân bằng histogram|||Histogram equalization'], correctIndex: 0, explanation: 'Median là phi tuyến, loại điểm bất thường mà không nhoè biên.' },
  { id: 'q3', question: 'Biến đổi Fourier biểu diễn ảnh trong miền nào?|||The Fourier transform represents an image in which domain?', options: ['Miền tần số|||The frequency domain', 'Miền màu RGB|||The RGB colour domain', 'Miền thời gian video|||The video time domain', 'Miền toạ độ cực|||The polar coordinate domain'], correctIndex: 0, explanation: 'Ảnh thành tổng sóng sin; tần thấp = vùng phẳng, tần cao = biên.' },
]);

const c4 = doc('cpv301-4-1-features', '4.1 — Feature detection & matching|||4.1 — Phát hiện & khớp đặc trưng',
  'Points & patches (góc Harris, SIFT bất biến tỉ lệ, descriptor, khớp đặc trưng), edges (gradient Sobel, Canny), lines (biến đổi Hough); code cv2.Canny, cv2.SIFT_create.',
  [[
    `<span class="eyebrow">CPV301 · Chapter 4 · Lesson 4.1</span>
<h2>Feature detection &amp; matching</h2>
<h3>Points &amp; patches — corners</h3>
<p>Good features are <strong>repeatable</strong> and <strong>distinctive</strong>. Corners are ideal: the <strong>Harris</strong> detector finds points where intensity changes strongly in two directions. <strong>SIFT</strong> adds <em>scale &amp; rotation invariance</em> and a 128-D <strong>descriptor</strong> so the same point can be matched across images.</p>
<pre><code class="language-python">sift = cv2.SIFT_create()
kp1, des1 = sift.detectAndCompute(img1, None)
kp2, des2 = sift.detectAndCompute(img2, None)
bf = cv2.BFMatcher()
matches = bf.knnMatch(des1, des2, k=2)   # then apply ratio test
</code></pre>
<h3>Edges</h3>
<p>Edges are sharp intensity changes. The <strong>gradient</strong> (Sobel) gives direction and magnitude; the <strong>Canny</strong> detector adds non-maximum suppression + hysteresis thresholding for clean, thin edges.</p>
<pre><code class="language-python">edges = cv2.Canny(gray, 100, 200)   # low &amp; high hysteresis thresholds
</code></pre>
<h3>Lines — Hough transform</h3>
<p>The <strong>Hough transform</strong> detects lines by voting: each edge point votes for all lines through it, in (rho, theta) space; peaks are the strongest lines.</p>
<pre><code class="language-python">lines = cv2.HoughLinesP(edges, 1, 3.14159/180, 80,
                        minLineLength=50, maxLineGap=10)
</code></pre>
<div class="callout"><span class="badge">Why features</span> Matching a handful of robust features lets us align, stitch and recognise images — far cheaper and more reliable than comparing raw pixels.</div>`,
    `<span class="eyebrow">CPV301 · Chương 4 · Bài 4.1</span>
<h2>Phát hiện &amp; khớp đặc trưng</h2>
<h3>Điểm &amp; mảng — góc (corner)</h3>
<p>Đặc trưng tốt phải <strong>lặp lại được</strong> và <strong>đặc biệt</strong>. Góc là lý tưởng: bộ dò <strong>Harris</strong> tìm điểm mà cường độ đổi mạnh theo hai hướng. <strong>SIFT</strong> thêm <em>bất biến tỉ lệ &amp; xoay</em> và một <strong>descriptor</strong> 128 chiều để khớp cùng một điểm giữa các ảnh.</p>
<pre><code class="language-python">sift = cv2.SIFT_create()
kp1, des1 = sift.detectAndCompute(img1, None)
kp2, des2 = sift.detectAndCompute(img2, None)
bf = cv2.BFMatcher()
matches = bf.knnMatch(des1, des2, k=2)   # rồi áp ratio test
</code></pre>
<h3>Biên (edges)</h3>
<p>Biên là chỗ cường độ đổi đột ngột. <strong>Gradient</strong> (Sobel) cho hướng và độ lớn; bộ dò <strong>Canny</strong> thêm nén phi cực đại + ngưỡng trễ (hysteresis) để cho biên mảnh, sạch.</p>
<pre><code class="language-python">edges = cv2.Canny(gray, 100, 200)   # ngưỡng trễ thấp &amp; cao
</code></pre>
<h3>Đường thẳng — biến đổi Hough</h3>
<p><strong>Biến đổi Hough</strong> dò đường thẳng bằng bỏ phiếu: mỗi điểm biên bỏ phiếu cho mọi đường thẳng đi qua nó, trong không gian (rho, theta); đỉnh phiếu là đường mạnh nhất.</p>
<pre><code class="language-python">lines = cv2.HoughLinesP(edges, 1, 3.14159/180, 80,
                        minLineLength=50, maxLineGap=10)
</code></pre>
<div class="callout"><span class="badge">Vì sao cần đặc trưng</span> Khớp một nhúm đặc trưng bền vững cho phép căn chỉnh, ghép và nhận dạng ảnh — rẻ và tin cậy hơn nhiều so với so từng điểm ảnh thô.</div>`,
  ]]);

const c4q = quiz('cpv301-quiz-4', 'Quiz 4 — Features|||Quiz 4 — Đặc trưng', [
  { id: 'q1', question: 'Đặc điểm chính của SIFT so với Harris là?|||The key property of SIFT versus Harris is?', options: ['Bất biến với tỉ lệ và xoay + có descriptor|||Scale/rotation invariance + a descriptor', 'Chỉ chạy trên ảnh màu|||Works only on colour images', 'Nhanh hơn nhưng kém chính xác|||Faster but less accurate', 'Chỉ dò đường thẳng|||Detects only lines'], correctIndex: 0, explanation: 'SIFT bất biến tỉ lệ/xoay và có descriptor 128 chiều để khớp.' },
  { id: 'q2', question: 'cv2.Canny nhận hai ngưỡng để làm gì?|||cv2.Canny takes two thresholds for what?', options: ['Ngưỡng trễ (hysteresis) thấp và cao|||Low and high hysteresis thresholds', 'Chiều rộng và cao ảnh|||Image width and height', 'Số góc cần tìm|||Number of corners', 'Màu nền và màu biên|||Background and edge colours'], correctIndex: 0, explanation: 'Canny dùng ngưỡng thấp/cao để nối biên theo hysteresis.' },
  { id: 'q3', question: 'Biến đổi Hough dùng để phát hiện?|||The Hough transform detects?', options: ['Đường thẳng (và đường tròn)|||Lines (and circles)', 'Khuôn mặt|||Faces', 'Chuyển động video|||Video motion', 'Màu chủ đạo|||Dominant colour'], correctIndex: 0, explanation: 'Hough bỏ phiếu trong (rho, theta) để tìm đường thẳng.' },
]);

const c5 = doc('cpv301-5-1-segmentation', '5.1 — Segmentation|||5.1 — Phân đoạn ảnh',
  'Phân đoạn là chia ảnh thành vùng đồng nhất; active contours (snakes), split & merge, mean shift & mode finding, phân đoạn theo ngưỡng/watershed; ví dụ cv2.watershed.',
  [[
    `<span class="eyebrow">CPV301 · Chapter 5 · Lesson 5.1</span>
<h2>Segmentation</h2>
<p><strong>Segmentation</strong> partitions an image into regions that belong together — the object versus the background, or distinct surfaces. It is the bridge from pixels to objects.</p>
<h3>Active contours (snakes)</h3>
<p>A curve that <em>evolves</em> to wrap around an object's boundary by minimising an energy: internal energy keeps it smooth, image energy pulls it toward strong edges.</p>
<h3>Split &amp; merge</h3>
<p>Recursively <strong>split</strong> the image into quadrants until each region is uniform, then <strong>merge</strong> neighbouring regions that are similar. A region-based, top-down approach.</p>
<h3>Mean shift &amp; mode finding</h3>
<p><strong>Mean shift</strong> clusters pixels (in colour+position space) by climbing to the nearest density peak (mode). No need to pre-set the number of clusters — pixels that climb to the same mode form one segment.</p>
<pre><code class="language-python">import cv2, numpy as np
# Otsu threshold + watershed: separate touching objects
ret, thresh = cv2.threshold(gray, 0, 255,
              cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
markers = cv2.watershed(img, markers)
</code></pre>
<div class="callout"><span class="badge">Note</span> Classic methods (snakes, mean shift, watershed) are still useful, but modern segmentation often uses deep networks (U-Net, Mask R-CNN) — this chapter builds the intuition they rest on.</div>`,
    `<span class="eyebrow">CPV301 · Chương 5 · Bài 5.1</span>
<h2>Phân đoạn ảnh</h2>
<p><strong>Phân đoạn</strong> chia ảnh thành các vùng thuộc về nhau — vật thể so với nền, hoặc các bề mặt riêng. Đây là cầu nối từ điểm ảnh sang đối tượng.</p>
<h3>Active contours (snakes)</h3>
<p>Một đường cong <em>tiến hoá</em> để bao quanh biên vật thể bằng cách cực tiểu một năng lượng: năng lượng nội giữ đường mượt, năng lượng ảnh kéo nó về phía biên mạnh.</p>
<h3>Chia &amp; gộp (split &amp; merge)</h3>
<p><strong>Chia</strong> đệ quy ảnh thành các phần tư đến khi mỗi vùng đồng nhất, rồi <strong>gộp</strong> các vùng lân cận giống nhau. Cách tiếp cận theo vùng, từ trên xuống.</p>
<h3>Mean shift &amp; tìm mode</h3>
<p><strong>Mean shift</strong> gom cụm điểm ảnh (trong không gian màu+vị trí) bằng cách leo đến đỉnh mật độ (mode) gần nhất. Không cần đặt trước số cụm — các điểm leo về cùng một mode tạo thành một phân đoạn.</p>
<pre><code class="language-python">import cv2, numpy as np
# Ngưỡng Otsu + watershed: tách các vật thể chạm nhau
ret, thresh = cv2.threshold(gray, 0, 255,
              cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
markers = cv2.watershed(img, markers)
</code></pre>
<div class="callout"><span class="badge">Lưu ý</span> Phương pháp cổ điển (snakes, mean shift, watershed) vẫn hữu ích, nhưng phân đoạn hiện đại thường dùng mạng sâu (U-Net, Mask R-CNN) — chương này xây trực giác nền cho chúng.</div>`,
  ]]);

const c5q = quiz('cpv301-quiz-5', 'Quiz 5 — Segmentation|||Quiz 5 — Phân đoạn', [
  { id: 'q1', question: 'Mục tiêu của phân đoạn ảnh là?|||The goal of image segmentation is?', options: ['Chia ảnh thành các vùng đồng nhất|||Partition the image into coherent regions', 'Tăng tương phản|||Increase contrast', 'Nén ảnh|||Compress the image', 'Xoay ảnh cho thẳng|||Rotate the image straight'], correctIndex: 0, explanation: 'Phân đoạn nhóm điểm ảnh thành vùng/đối tượng.' },
  { id: 'q2', question: 'Active contour (snake) tiến hoá bằng cách?|||An active contour (snake) evolves by?', options: ['Cực tiểu năng lượng (nội + ảnh)|||Minimizing an energy (internal + image)', 'Bỏ phiếu Hough|||Hough voting', 'Nhân trong miền Fourier|||Multiplying in Fourier domain', 'Khớp descriptor SIFT|||Matching SIFT descriptors'], correctIndex: 0, explanation: 'Snake cực tiểu năng lượng để bám biên vật thể.' },
  { id: 'q3', question: 'Ưu điểm của mean shift so với k-means là?|||An advantage of mean shift over k-means is?', options: ['Không cần đặt trước số cụm|||No need to preset the number of clusters', 'Luôn nhanh hơn|||Always faster', 'Chỉ dùng cho ảnh xám|||Only for grayscale', 'Cần nhãn huấn luyện|||Needs training labels'], correctIndex: 0, explanation: 'Mean shift tìm mode mật độ, số cụm tự phát sinh.' },
]);

const c6 = doc('cpv301-6-1-alignment', '6.1 — Feature-based alignment|||6.1 — Căn chỉnh theo đặc trưng',
  'Căn chỉnh 2D & 3D từ cặp điểm khớp, ước lượng bền vững với RANSAC (loại outlier), ước lượng homography (cv2.findHomography) và pose (PnP).',
  [[
    `<span class="eyebrow">CPV301 · Chapter 6 · Lesson 6.1</span>
<h2>Feature-based alignment</h2>
<p>Once features are matched between two images, <strong>alignment</strong> estimates the transformation that maps one onto the other.</p>
<h3>2D &amp; 3D alignment</h3>
<p>From matched point pairs we solve for the best transform — a similarity, affine, or <strong>homography</strong> in 2D, or a pose (rotation+translation) in 3D. Each match gives equations; enough matches determine the transform (least squares).</p>
<h3>RANSAC — robust estimation</h3>
<p>Matches always contain <strong>outliers</strong> (wrong matches). <strong>RANSAC</strong> (RANdom SAmple Consensus) repeatedly: pick a minimal random sample, fit a model, count <em>inliers</em> that agree; keep the model with the most inliers. It ignores the outliers instead of being dragged by them.</p>
<pre><code class="language-python">import cv2, numpy as np
# src_pts, dst_pts: matched keypoint coordinates (Nx1x2)
H, mask = cv2.findHomography(src_pts, dst_pts, cv2.RANSAC, 5.0)
aligned = cv2.warpPerspective(img1, H, (w, h))
</code></pre>
<div class="callout"><span class="badge">Key idea</span> A homography needs only <strong>4 point matches</strong>; RANSAC finds a clean 4 among many noisy matches, then refines on all inliers.</div>`,
    `<span class="eyebrow">CPV301 · Chương 6 · Bài 6.1</span>
<h2>Căn chỉnh theo đặc trưng</h2>
<p>Sau khi đặc trưng được khớp giữa hai ảnh, <strong>căn chỉnh</strong> ước lượng phép biến đổi ánh xạ ảnh này lên ảnh kia.</p>
<h3>Căn chỉnh 2D &amp; 3D</h3>
<p>Từ các cặp điểm khớp, ta giải ra phép biến đổi tốt nhất — đồng dạng, affine, hay <strong>homography</strong> trong 2D, hoặc pose (xoay+tịnh tiến) trong 3D. Mỗi cặp khớp cho vài phương trình; đủ cặp thì xác định được phép biến đổi (bình phương tối thiểu).</p>
<h3>RANSAC — ước lượng bền vững</h3>
<p>Khớp luôn có <strong>outlier</strong> (khớp sai). <strong>RANSAC</strong> (RANdom SAmple Consensus) lặp lại: lấy mẫu ngẫu nhiên tối thiểu, khớp mô hình, đếm <em>inlier</em> đồng thuận; giữ mô hình nhiều inlier nhất. Nó bỏ qua outlier thay vì bị chúng kéo lệch.</p>
<pre><code class="language-python">import cv2, numpy as np
# src_pts, dst_pts: toạ độ keypoint đã khớp (Nx1x2)
H, mask = cv2.findHomography(src_pts, dst_pts, cv2.RANSAC, 5.0)
aligned = cv2.warpPerspective(img1, H, (w, h))
</code></pre>
<div class="callout"><span class="badge">Ý chính</span> Một homography chỉ cần <strong>4 cặp điểm</strong>; RANSAC tìm ra 4 cặp sạch giữa nhiều khớp nhiễu, rồi tinh chỉnh trên toàn bộ inlier.</div>`,
  ]]);

const c6q = quiz('cpv301-quiz-6', 'Quiz 6 — Alignment|||Quiz 6 — Căn chỉnh', [
  { id: 'q1', question: 'RANSAC dùng để làm gì?|||What is RANSAC used for?', options: ['Ước lượng mô hình bền vững, loại outlier|||Robustly estimate a model, rejecting outliers', 'Làm mờ ảnh|||Blur the image', 'Tăng độ phân giải|||Increase resolution', 'Nén dữ liệu|||Compress data'], correctIndex: 0, explanation: 'RANSAC chọn mô hình nhiều inlier nhất, bỏ qua khớp sai.' },
  { id: 'q2', question: 'Cần tối thiểu bao nhiêu cặp điểm khớp để ước lượng một homography?|||Minimum matched point pairs to estimate a homography?', options: ['4 cặp|||4 pairs', '1 cặp|||1 pair', '10 cặp|||10 pairs', '100 cặp|||100 pairs'], correctIndex: 0, explanation: 'Homography có 8 bậc tự do → cần 4 cặp điểm.' },
  { id: 'q3', question: 'Hàm OpenCV nào ước lượng homography có kèm RANSAC?|||Which OpenCV function estimates a homography with RANSAC?', options: ['cv2.findHomography|||cv2.findHomography', 'cv2.GaussianBlur|||cv2.GaussianBlur', 'cv2.equalizeHist|||cv2.equalizeHist', 'cv2.imread|||cv2.imread'], correctIndex: 0, explanation: 'cv2.findHomography(src, dst, cv2.RANSAC, thr).' },
]);

const c7 = doc('cpv301-7-1-stitching', '7.1 — Image stitching (panorama)|||7.1 — Ghép ảnh (panorama)',
  'Mô hình chuyển động (translation/affine/homography), căn chỉnh toàn cục (bundle adjustment), pha trộn viền (blending), quy trình panorama; ví dụ cv2.Stitcher.',
  [[
    `<span class="eyebrow">CPV301 · Chapter 7 · Lesson 7.1</span>
<h2>Image stitching — panoramas</h2>
<p><strong>Stitching</strong> merges overlapping photos into one wide panorama. It reuses everything so far: detect features, match, estimate a homography, warp and blend.</p>
<h3>Motion models</h3>
<p>Choose how images relate: pure <strong>translation</strong> (scanner), <strong>affine</strong>, or (for a rotating camera) a <strong>homography</strong> per pair. Panoramas from a hand-held rotating camera use homographies onto a common surface (planar / cylindrical / spherical).</p>
<h3>Global alignment</h3>
<p>Aligning pairs one-by-one accumulates <strong>drift</strong>. <strong>Bundle adjustment</strong> jointly optimises all camera parameters so every overlap agrees at once.</p>
<h3>Blending</h3>
<p>Seams and exposure differences are hidden by <strong>blending</strong> (feathering or multi-band) across the overlap.</p>
<pre><code class="language-python">import cv2
stitcher = cv2.Stitcher_create()
status, panorama = stitcher.stitch([img1, img2, img3])
if status == cv2.Stitcher_OK:
    cv2.imwrite("panorama.jpg", panorama)
</code></pre>
<div class="callout"><span class="badge">Pipeline recap</span> Features → match → RANSAC homography → warp → global align → blend. Stitching is the capstone of the geometry half of the course.</div>`,
    `<span class="eyebrow">CPV301 · Chương 7 · Bài 7.1</span>
<h2>Ghép ảnh — panorama</h2>
<p><strong>Ghép ảnh</strong> gộp các ảnh chồng lấn thành một panorama rộng. Nó tái dùng mọi thứ đã học: dò đặc trưng, khớp, ước lượng homography, warp và pha trộn.</p>
<h3>Mô hình chuyển động</h3>
<p>Chọn cách các ảnh liên hệ: <strong>tịnh tiến</strong> thuần (máy quét), <strong>affine</strong>, hoặc (với camera xoay) một <strong>homography</strong> cho mỗi cặp. Panorama từ camera cầm tay xoay dùng homography chiếu lên một mặt chung (phẳng / trụ / cầu).</p>
<h3>Căn chỉnh toàn cục</h3>
<p>Căn từng cặp một sẽ tích luỹ <strong>trôi (drift)</strong>. <strong>Bundle adjustment</strong> tối ưu đồng thời mọi tham số camera để mọi vùng chồng khớp cùng lúc.</p>
<h3>Pha trộn (blending)</h3>
<p>Đường nối và chênh phơi sáng được giấu bằng <strong>pha trộn</strong> (feathering hoặc multi-band) trên vùng chồng.</p>
<pre><code class="language-python">import cv2
stitcher = cv2.Stitcher_create()
status, panorama = stitcher.stitch([img1, img2, img3])
if status == cv2.Stitcher_OK:
    cv2.imwrite("panorama.jpg", panorama)
</code></pre>
<div class="callout"><span class="badge">Tóm tắt pipeline</span> Đặc trưng → khớp → homography RANSAC → warp → căn chỉnh toàn cục → pha trộn. Ghép ảnh là đỉnh của nửa hình học trong môn.</div>`,
  ]]);

const c7q = quiz('cpv301-quiz-7', 'Quiz 7 — Stitching|||Quiz 7 — Ghép ảnh', [
  { id: 'q1', question: 'Ghép ảnh panorama chủ yếu dùng phép biến đổi nào giữa các ảnh?|||Panorama stitching mainly uses which transform between images?', options: ['Homography|||Homography', 'Cân bằng histogram|||Histogram equalization', 'Biến đổi Fourier|||Fourier transform', 'Ngưỡng Otsu|||Otsu threshold'], correctIndex: 0, explanation: 'Camera xoay → các ảnh liên hệ qua homography.' },
  { id: 'q2', question: 'Bundle adjustment giải quyết vấn đề gì khi ghép nhiều ảnh?|||What problem does bundle adjustment solve when stitching many images?', options: ['Trôi/tích luỹ sai số căn chỉnh|||Accumulated alignment drift', 'Nhiễu muối tiêu|||Salt-and-pepper noise', 'Thiếu ánh sáng|||Low lighting', 'Ảnh quá nhỏ|||Images too small'], correctIndex: 0, explanation: 'Tối ưu toàn cục để mọi vùng chồng khớp, giảm drift.' },
  { id: 'q3', question: 'Blending (pha trộn) trong ghép ảnh để?|||Blending in stitching is used to?', options: ['Giấu đường nối và chênh phơi sáng|||Hide seams and exposure differences', 'Tìm góc Harris|||Find Harris corners', 'Dò đường thẳng Hough|||Detect Hough lines', 'Hiệu chỉnh camera|||Calibrate the camera'], correctIndex: 0, explanation: 'Feathering / multi-band làm mượt vùng chồng.' },
]);

const c8 = doc('cpv301-8-1-detection', '8.1 — Object detection|||8.1 — Phát hiện đối tượng',
  'Bài toán phát hiện (vị trí + lớp), sliding window + image pyramid, đặc trưng HOG + SVM, tiến tới CNN/YOLO (one-stage, real-time); ví dụ HOGDescriptor & YOLO.',
  [[
    `<span class="eyebrow">CPV301 · Chapter 8 · Lesson 8.1</span>
<h2>Object detection</h2>
<p><strong>Detection</strong> answers "<em>what</em> is in the image and <em>where</em>" — it outputs a class label and a bounding box for each object.</p>
<h3>Sliding window + pyramid</h3>
<p>The classic recipe: slide a fixed window across the image, classify each patch, and repeat at several scales using an <strong>image pyramid</strong>. Overlapping boxes are merged with <strong>non-maximum suppression (NMS)</strong>.</p>
<h3>HOG + SVM</h3>
<p><strong>Histogram of Oriented Gradients (HOG)</strong> describes a patch by the distribution of edge directions; a linear <strong>SVM</strong> then classifies it. HOG+SVM was the standard for pedestrian detection.</p>
<pre><code class="language-python">import cv2
hog = cv2.HOGDescriptor()
hog.setSVMDetector(cv2.HOGDescriptor_getDefaultPeopleDetector())
boxes, weights = hog.detectMultiScale(img, winStride=(8, 8))
</code></pre>
<h3>Toward CNN / YOLO</h3>
<p>Modern detectors learn features with <strong>CNNs</strong>. <strong>YOLO</strong> (You Only Look Once) is a one-stage detector: a single network predicts all boxes and classes in one pass, fast enough for real-time video.</p>
<div class="callout"><span class="badge">Trend</span> HOG+SVM teaches the ideas (windows, features, NMS); CNN/YOLO make them accurate and real-time. The <em>concepts</em> carry over directly.</div>`,
    `<span class="eyebrow">CPV301 · Chương 8 · Bài 8.1</span>
<h2>Phát hiện đối tượng</h2>
<p><strong>Phát hiện</strong> trả lời "trong ảnh có <em>gì</em> và ở <em>đâu</em>" — xuất nhãn lớp và hộp bao (bounding box) cho từng đối tượng.</p>
<h3>Cửa sổ trượt + kim tự tháp ảnh</h3>
<p>Công thức cổ điển: trượt một cửa sổ cố định khắp ảnh, phân loại từng mảng, lặp ở nhiều tỉ lệ bằng <strong>kim tự tháp ảnh (pyramid)</strong>. Các hộp chồng nhau được gộp bằng <strong>nén phi cực đại (NMS)</strong>.</p>
<h3>HOG + SVM</h3>
<p><strong>Histogram of Oriented Gradients (HOG)</strong> mô tả một mảng bằng phân bố hướng biên; một <strong>SVM</strong> tuyến tính rồi phân loại. HOG+SVM từng là chuẩn cho phát hiện người đi bộ.</p>
<pre><code class="language-python">import cv2
hog = cv2.HOGDescriptor()
hog.setSVMDetector(cv2.HOGDescriptor_getDefaultPeopleDetector())
boxes, weights = hog.detectMultiScale(img, winStride=(8, 8))
</code></pre>
<h3>Tiến tới CNN / YOLO</h3>
<p>Bộ phát hiện hiện đại học đặc trưng bằng <strong>CNN</strong>. <strong>YOLO</strong> (You Only Look Once) là bộ phát hiện một giai đoạn: một mạng dự đoán mọi hộp và lớp trong một lượt, đủ nhanh cho video thời gian thực.</p>
<div class="callout"><span class="badge">Xu hướng</span> HOG+SVM dạy ý tưởng (cửa sổ, đặc trưng, NMS); CNN/YOLO làm chúng chính xác và thời gian thực. <em>Khái niệm</em> chuyển thẳng sang.</div>`,
  ]]);

const c8q = quiz('cpv301-quiz-8', 'Quiz 8 — Detection|||Quiz 8 — Phát hiện', [
  { id: 'q1', question: 'Đầu ra của bài toán phát hiện đối tượng gồm?|||The output of object detection is?', options: ['Nhãn lớp + hộp bao vị trí|||Class label + bounding box', 'Chỉ một nhãn cho cả ảnh|||A single label for the whole image', 'Ảnh đã làm mờ|||A blurred image', 'Danh sách góc Harris|||A list of Harris corners'], correctIndex: 0, explanation: 'Phát hiện = phân loại + định vị (bounding box).' },
  { id: 'q2', question: 'NMS (non-maximum suppression) dùng để?|||NMS (non-maximum suppression) is used to?', options: ['Gộp các hộp chồng nhau của cùng vật thể|||Merge overlapping boxes of the same object', 'Tăng độ phân giải|||Increase resolution', 'Hiệu chỉnh camera|||Calibrate the camera', 'Khử nhiễu Gaussian|||Gaussian denoising'], correctIndex: 0, explanation: 'NMS giữ hộp điểm cao nhất, bỏ hộp trùng lặp.' },
  { id: 'q3', question: 'Đặc điểm của YOLO so với sliding window cổ điển?|||YOLO compared to classic sliding window?', options: ['Một mạng dự đoán mọi hộp trong một lượt, thời gian thực|||One network predicts all boxes in one pass, real-time', 'Không cần dữ liệu huấn luyện|||Needs no training data', 'Chỉ chạy trên ảnh xám|||Only on grayscale', 'Không dùng CNN|||Does not use CNNs'], correctIndex: 0, explanation: 'YOLO là one-stage: một lượt suy luận, nhanh.' },
]);

const c9 = doc('cpv301-9-1-recognition', '9.1 — Recognition & tracking|||9.1 — Nhận dạng & bám vết',
  'Nhận dạng khuôn mặt (phát hiện Haar/LBP, embedding & so khớp), nhận dạng đối tượng, bám vết (optical flow Lucas-Kanade, lọc Kalman); ví dụ Haar cascade & calcOpticalFlowPyrLK.',
  [[
    `<span class="eyebrow">CPV301 · Chapter 9 · Lesson 9.1</span>
<h2>Recognition &amp; tracking</h2>
<h3>Face recognition</h3>
<p>Two steps: <strong>detect</strong> the face (classic Haar/LBP cascade, or a CNN), then <strong>recognise</strong> it — map the face to a compact <em>embedding</em> vector and compare distances; a small distance means the same person.</p>
<pre><code class="language-python">import cv2
cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
faces = cascade.detectMultiScale(gray, 1.1, 4)   # returns x, y, w, h boxes
</code></pre>
<h3>Object tracking</h3>
<p>Tracking follows an object <em>across video frames</em> (faster than detecting every frame).</p>
<ul>
<li><strong>Optical flow</strong> — estimate per-pixel motion between frames. <strong>Lucas-Kanade</strong> tracks sparse feature points.</li>
<li><strong>Kalman filter</strong> — predict the next position from a motion model, then correct with the new measurement; smooths noise and survives short occlusions.</li>
</ul>
<pre><code class="language-python">p1, st, err = cv2.calcOpticalFlowPyrLK(prev_gray, gray, p0, None)
</code></pre>
<div class="callout"><span class="badge">Course wrap-up</span> From pixels (Ch.1-3) to geometry (Ch.4-7) to meaning (Ch.8-9): detect, recognise and track. You now have the full classical CV toolkit — the foundation deep learning builds on.</div>`,
    `<span class="eyebrow">CPV301 · Chương 9 · Bài 9.1</span>
<h2>Nhận dạng &amp; bám vết</h2>
<h3>Nhận dạng khuôn mặt</h3>
<p>Hai bước: <strong>phát hiện</strong> khuôn mặt (cascade Haar/LBP cổ điển, hoặc CNN), rồi <strong>nhận dạng</strong> — ánh xạ khuôn mặt sang một vector <em>embedding</em> gọn và so khoảng cách; khoảng cách nhỏ nghĩa là cùng một người.</p>
<pre><code class="language-python">import cv2
cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
faces = cascade.detectMultiScale(gray, 1.1, 4)   # trả về hộp x, y, w, h
</code></pre>
<h3>Bám vết đối tượng</h3>
<p>Bám vết theo dõi một vật thể <em>qua các khung video</em> (nhanh hơn phát hiện lại mỗi khung).</p>
<ul>
<li><strong>Optical flow</strong> — ước lượng chuyển động từng điểm ảnh giữa hai khung. <strong>Lucas-Kanade</strong> bám các điểm đặc trưng thưa.</li>
<li><strong>Lọc Kalman</strong> — dự đoán vị trí kế từ mô hình chuyển động, rồi hiệu chỉnh bằng đo mới; làm mượt nhiễu và trụ được khi bị che ngắn.</li>
</ul>
<pre><code class="language-python">p1, st, err = cv2.calcOpticalFlowPyrLK(prev_gray, gray, p0, None)
</code></pre>
<div class="callout"><span class="badge">Tổng kết môn</span> Từ điểm ảnh (Ch.1-3) đến hình học (Ch.4-7) đến ý nghĩa (Ch.8-9): phát hiện, nhận dạng và bám vết. Bạn đã có bộ công cụ CV cổ điển đầy đủ — nền mà học sâu xây lên.</div>`,
  ]]);

const c9q = quiz('cpv301-quiz-9', 'Quiz 9 — Recognition|||Quiz 9 — Nhận dạng', [
  { id: 'q1', question: 'Nhận dạng khuôn mặt hiện đại so khớp bằng?|||Modern face recognition matches faces using?', options: ['Vector embedding + khoảng cách|||Embedding vectors + distance', 'So từng điểm ảnh thô|||Raw pixel-by-pixel comparison', 'Biến đổi Fourier|||Fourier transform', 'Ngưỡng Otsu|||Otsu threshold'], correctIndex: 0, explanation: 'Ánh xạ mặt sang embedding, khoảng cách nhỏ = cùng người.' },
  { id: 'q2', question: 'Optical flow (Lucas-Kanade) ước lượng?|||Optical flow (Lucas-Kanade) estimates?', options: ['Chuyển động điểm giữa hai khung|||Point motion between two frames', 'Màu chủ đạo|||The dominant colour', 'Ma trận nội camera|||The camera intrinsics', 'Số cụm phân đoạn|||The number of segments'], correctIndex: 0, explanation: 'Optical flow đo chuyển động; LK bám điểm đặc trưng thưa.' },
  { id: 'q3', question: 'Vì sao dùng lọc Kalman khi bám vết?|||Why use a Kalman filter for tracking?', options: ['Dự đoán vị trí + làm mượt, trụ khi bị che ngắn|||Predict position + smooth, survive brief occlusion', 'Tăng độ phân giải ảnh|||Increase image resolution', 'Ghép ảnh panorama|||Stitch panoramas', 'Hiệu chỉnh méo ống kính|||Correct lens distortion'], correctIndex: 0, explanation: 'Kalman dự đoán rồi hiệu chỉnh — mượt nhiễu, chịu che khuất ngắn.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'CPV301',
    slug: 'cpv301-computer-vision',
    title: 'Computer Vision',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CPV301.webp',
    shortDescription: 'Computer vision with OpenCV/Python: image formation, filtering & Fourier, features (Harris/SIFT/Canny/Hough), segmentation, RANSAC & homography, panorama stitching, detection (HOG/YOLO) & recognition. Bilingual with code & quizzes.|||Thị giác máy tính với OpenCV/Python: tạo ảnh, lọc & Fourier, đặc trưng (Harris/SIFT/Canny/Hough), phân đoạn, RANSAC & homography, ghép panorama, phát hiện (HOG/YOLO) & nhận dạng. Song ngữ, có code & quiz.',
    description: 'Môn <strong>CPV301 — Computer Vision (Thị giác máy tính)</strong> (kỳ 5, ngành AI/Robotics) dạy máy tính <strong>hiểu ảnh và video</strong>. Bám giáo trình FLM và sách chính <strong>Szeliski — Computer Vision: Algorithms and Applications</strong> (miễn phí), đi qua 9 chương: <strong>giới thiệu</strong> → <strong>tạo ảnh &amp; camera</strong> → <strong>xử lý ảnh</strong> (lọc, Fourier) → <strong>đặc trưng</strong> (Harris, SIFT, Canny, Hough) → <strong>phân đoạn</strong> → <strong>căn chỉnh</strong> (RANSAC, homography) → <strong>ghép ảnh</strong> (panorama) → <strong>phát hiện đối tượng</strong> (HOG, YOLO) → <strong>nhận dạng &amp; bám vết</strong>. Song ngữ, có code OpenCV/Python minh hoạ và quiz mỗi chương.',
    whatYouLearn: 'Ảnh là mảng NumPy; tạo ảnh &amp; mô hình camera pinhole, hiệu chỉnh (cv2.calibrateCamera); point operator, lọc Gaussian/median, biến đổi Fourier &amp; hình học; đặc trưng Harris/SIFT, biên Sobel/Canny, đường Hough; phân đoạn (snakes, mean shift, watershed); RANSAC &amp; homography (cv2.findHomography); ghép panorama (cv2.Stitcher); phát hiện HOG+SVM và CNN/YOLO; nhận dạng khuôn mặt, optical flow &amp; lọc Kalman.',
    requirements: 'Tiên quyết PFP191 (lập trình Python) và CSD203 (cấu trúc dữ liệu &amp; giải thuật). Cài Python + OpenCV (pip install opencv-python), NumPy, Matplotlib; IDE khuyến nghị PyCharm.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Szeliski (miễn phí), Forsyth & Ponce, OpenCV docs, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'CV là gì, ứng dụng, 9 CLO, cơ cấu điểm, tiên quyết.', lessons: [intro] },
    { title: 'Chương 1 — Giới thiệu|||Chapter 1 — Introduction', description: 'CV là gì, lĩnh vực liên quan, pipeline.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Tạo ảnh & camera|||Chapter 2 — Image formation', description: 'Hình học, quang học, mô hình & hiệu chỉnh camera.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Xử lý ảnh|||Chapter 3 — Image processing', description: 'Point operator, lọc, Fourier, biến đổi hình học.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Đặc trưng|||Chapter 4 — Features', description: 'Harris, SIFT, Canny, Hough.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Phân đoạn|||Chapter 5 — Segmentation', description: 'Snakes, split & merge, mean shift, watershed.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Căn chỉnh|||Chapter 6 — Alignment', description: '2D/3D alignment, RANSAC, homography.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Ghép ảnh|||Chapter 7 — Stitching', description: 'Motion models, global alignment, panorama.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Phát hiện đối tượng|||Chapter 8 — Detection', description: 'Sliding window, HOG+SVM, CNN/YOLO.', lessons: [c8, c8q] },
    { title: 'Chương 9 — Nhận dạng & bám vết|||Chapter 9 — Recognition', description: 'Face recognition, optical flow, Kalman.', lessons: [c9, c9q] },
  ],
};
