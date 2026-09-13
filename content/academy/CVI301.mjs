/**
 * CVI301 — Computer Vision (Thị giác máy tính). Ngành Khoa học Máy tính FPTU, Kỳ 4.
 * Khung chất lượng, 8 chương. Tài liệu chuẩn: Szeliski "Computer Vision:
 * Algorithms and Applications", Gonzalez "Digital Image Processing",
 * Forsyth & Ponce, OpenCV docs, Stanford CS231n. Song ngữ + code Python/OpenCV.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "&"→&amp; trong HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('cvi301-0-1-overview', 'Course overview: Computer Vision|||Tổng quan: Thị giác máy tính',
  'Thị giác máy tính là gì; ảnh là ma trận số; lộ trình: nền ảnh số → xử lý điểm → lọc → biên & đặc trưng → hình học → phân đoạn → học sâu → ứng dụng.',
  [[
    `<span class="eyebrow">CVI301 · Lesson 0.1 · Overview</span>
<h2>Computer Vision</h2>
<p class="lead">Computer vision teaches a machine to <strong>see and understand images</strong>. This course goes from raw pixels all the way to <strong>deep learning</strong> — you will process, transform and analyze images with <strong>Python and OpenCV</strong>, then classify and detect objects with convolutional neural networks.</p>
<h3>The core idea: an image is just numbers</h3>
<p>A digital image is a <strong>grid of pixels</strong>, and each pixel is a number (or three numbers for color). Everything in this course is math on that grid — add, filter, threshold, transform.</p>
<h3>Roadmap (4 steps)</h3>
<ol>
<li><strong>Foundations</strong> — digital images, pixels, channels, color spaces (RGB/HSV/Gray).</li>
<li><strong>Classic processing</strong> — histograms, thresholding, convolution &amp; filtering, edges &amp; features.</li>
<li><strong>Geometry &amp; grouping</strong> — affine/perspective transforms, segmentation, contours, Hough.</li>
<li><strong>Deep learning &amp; applications</strong> — CNNs, object detection, face recognition, OCR, tracking, ethics.</li>
</ol>
<div class="callout"><span class="badge">Tooling</span> All code uses <strong>OpenCV</strong> (cv2) and NumPy in Python — the standard toolkit for classic vision, plus PyTorch/TensorFlow for the deep-learning chapters.</div>`,
    `<span class="eyebrow">CVI301 · Bài 0.1 · Tổng quan</span>
<h2>Thị giác máy tính</h2>
<p class="lead">Thị giác máy tính dạy máy <strong>nhìn và hiểu ảnh</strong>. Môn này đi từ pixel thô tới tận <strong>học sâu</strong> — bạn xử lý, biến đổi và phân tích ảnh bằng <strong>Python và OpenCV</strong>, rồi phân loại và phát hiện đối tượng bằng mạng nơ-ron tích chập.</p>
<h3>Ý tưởng cốt lõi: ảnh chỉ là những con số</h3>
<p>Ảnh số là một <strong>lưới pixel</strong>, mỗi pixel là một con số (hoặc ba con số với ảnh màu). Mọi thứ trong môn này là toán trên lưới đó — cộng, lọc, ngưỡng, biến đổi.</p>
<h3>Lộ trình (4 bước)</h3>
<ol>
<li><strong>Nền tảng</strong> — ảnh số, pixel, kênh màu, không gian màu (RGB/HSV/Gray).</li>
<li><strong>Xử lý cổ điển</strong> — histogram, ngưỡng, tích chập &amp; lọc, biên &amp; đặc trưng.</li>
<li><strong>Hình học &amp; nhóm</strong> — biến đổi affine/phối cảnh, phân đoạn, contour, Hough.</li>
<li><strong>Học sâu &amp; ứng dụng</strong> — CNN, phát hiện đối tượng, nhận diện khuôn mặt, OCR, theo dõi, đạo đức.</li>
</ol>
<div class="callout"><span class="badge">Công cụ</span> Mọi đoạn code dùng <strong>OpenCV</strong> (cv2) và NumPy trong Python — bộ công cụ chuẩn cho thị giác cổ điển, cộng PyTorch/TensorFlow cho các chương học sâu.</div>`,
  ]]);

const c1 = doc('cvi301-1-1-images', '1.1 — Digital images, pixels & color spaces|||1.1 — Ảnh số, pixel & không gian màu',
  'Ảnh số là ma trận pixel; kênh màu; không gian màu RGB, HSV, Grayscale; đọc/hiển thị ảnh với OpenCV.',
  [[
    `<span class="eyebrow">CVI301 · Chapter 1 · Lesson 1.1</span>
<h2>Digital images, pixels &amp; color spaces</h2>
<h3>What is a digital image?</h3>
<p>A grayscale image is a 2D matrix of size H×W; each cell is an intensity from <strong>0 (black) to 255 (white)</strong>. A color image adds a third dimension — <strong>channels</strong> — so its shape is H×W×3.</p>
<h3>Color spaces</h3>
<ul>
<li><strong>RGB / BGR</strong> — red, green, blue. Note: OpenCV loads images in <strong>BGR</strong> order, not RGB.</li>
<li><strong>Grayscale</strong> — a single channel of brightness; drops color to simplify many algorithms.</li>
<li><strong>HSV</strong> — Hue, Saturation, Value. Great for color-based selection because &quot;color&quot; (hue) is separated from brightness.</li>
</ul>
<pre><code>import cv2
img = cv2.imread(&quot;photo.jpg&quot;)      # loads as BGR, shape H x W x 3
print(img.shape, img.dtype)         # e.g. (480, 640, 3) uint8

gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)   # H x W
hsv  = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

px = img[100, 50]                   # one pixel: [B, G, R]
print(px)                           # e.g. [ 34 120 200 ]
</code></pre>
<div class="callout"><span class="badge">Gotcha</span> OpenCV is BGR; Matplotlib expects RGB. Convert with <code>cv2.cvtColor(img, cv2.COLOR_BGR2RGB)</code> before plotting or colors look wrong.</div>`,
    `<span class="eyebrow">CVI301 · Chương 1 · Bài 1.1</span>
<h2>Ảnh số, pixel &amp; không gian màu</h2>
<h3>Ảnh số là gì?</h3>
<p>Ảnh xám là ma trận 2D kích thước H×W; mỗi ô là cường độ sáng từ <strong>0 (đen) tới 255 (trắng)</strong>. Ảnh màu thêm chiều thứ ba — <strong>kênh (channel)</strong> — nên hình dạng là H×W×3.</p>
<h3>Không gian màu</h3>
<ul>
<li><strong>RGB / BGR</strong> — đỏ, lục, lam. Lưu ý: OpenCV nạp ảnh theo thứ tự <strong>BGR</strong>, không phải RGB.</li>
<li><strong>Grayscale (ảnh xám)</strong> — một kênh độ sáng; bỏ màu để đơn giản hoá nhiều thuật toán.</li>
<li><strong>HSV</strong> — Hue (sắc), Saturation (độ bão hoà), Value (độ sáng). Rất tốt để chọn theo màu vì &quot;màu&quot; (hue) tách khỏi độ sáng.</li>
</ul>
<pre><code>import cv2
img = cv2.imread(&quot;photo.jpg&quot;)      # nap dang BGR, shape H x W x 3
print(img.shape, img.dtype)         # vd (480, 640, 3) uint8

gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)   # H x W
hsv  = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

px = img[100, 50]                   # mot pixel: [B, G, R]
print(px)                           # vd [ 34 120 200 ]
</code></pre>
<div class="callout"><span class="badge">Bẫy</span> OpenCV là BGR; Matplotlib mong RGB. Đổi bằng <code>cv2.cvtColor(img, cv2.COLOR_BGR2RGB)</code> trước khi vẽ, không thì màu sai.</div>`,
  ]]);

const c1q = quiz('cvi301-quiz-1', 'Quiz 1 — Images & color|||Quiz 1 — Ảnh & màu', [
  { id: 'q1', question: 'OpenCV nạp ảnh màu theo thứ tự kênh nào?', options: ['RGB', 'BGR', 'HSV', 'GRAY'], correctIndex: 1, explanation: 'cv2.imread trả về ảnh theo thứ tự BGR, không phải RGB.' },
  { id: 'q2', question: 'Giá trị một pixel ảnh xám 8-bit nằm trong khoảng?', options: ['0..1', '0..100', '0..255', '−128..127'], correctIndex: 2, explanation: 'Ảnh uint8: 0 (đen) tới 255 (trắng).' },
  { id: 'q3', question: 'Không gian màu nào tách "màu" (hue) khỏi độ sáng, tiện chọn theo màu?', options: ['RGB', 'BGR', 'Grayscale', 'HSV'], correctIndex: 3, explanation: 'HSV tách Hue/Saturation/Value nên chọn theo màu dễ hơn RGB.' },
]);

const c2 = doc('cvi301-2-1-processing', '2.1 — Basic image processing|||2.1 — Xử lý ảnh cơ bản',
  'Biến đổi điểm (âm bản, tăng sáng/tương phản), histogram, ngưỡng (threshold), cân bằng histogram.',
  [[
    `<span class="eyebrow">CVI301 · Chapter 2 · Lesson 2.1</span>
<h2>Basic image processing</h2>
<h3>Point operations</h3>
<p>A <strong>point operation</strong> maps each pixel independently: <code>out = f(in)</code>. Examples: brightness (add a constant), contrast (multiply), and negative (<code>255 - in</code>).</p>
<h3>Histogram</h3>
<p>A <strong>histogram</strong> counts how many pixels have each intensity. A dark image piles up near 0; a washed-out image piles up near 255. It is the fastest way to judge exposure.</p>
<h3>Thresholding &amp; equalization</h3>
<ul>
<li><strong>Thresholding</strong> turns a grayscale image into black/white: pixels above T become 255, below become 0.</li>
<li><strong>Histogram equalization</strong> spreads intensities to use the full 0..255 range — it boosts contrast on dull images.</li>
</ul>
<pre><code>import cv2
gray = cv2.imread(&quot;x.jpg&quot;, cv2.IMREAD_GRAYSCALE)

neg   = 255 - gray                                  # negative (point op)
eq    = cv2.equalizeHist(gray)                      # contrast stretch
_, bw = cv2.threshold(gray, 128, 255, cv2.THRESH_BINARY)
hist  = cv2.calcHist([gray], [0], None, [256], [0, 256])
</code></pre>
<div class="callout"><span class="badge">Rule of thumb</span> Fix exposure/contrast (equalize) BEFORE thresholding — a good histogram makes a clean threshold much easier.</div>`,
    `<span class="eyebrow">CVI301 · Chương 2 · Bài 2.1</span>
<h2>Xử lý ảnh cơ bản</h2>
<h3>Biến đổi điểm</h3>
<p>Một <strong>biến đổi điểm</strong> ánh xạ từng pixel độc lập: <code>out = f(in)</code>. Ví dụ: độ sáng (cộng hằng số), tương phản (nhân), và âm bản (<code>255 - in</code>).</p>
<h3>Histogram</h3>
<p><strong>Histogram</strong> đếm số pixel ứng với mỗi mức sáng. Ảnh tối dồn về gần 0; ảnh cháy sáng dồn về gần 255. Đây là cách nhanh nhất để đánh giá phơi sáng.</p>
<h3>Ngưỡng &amp; cân bằng</h3>
<ul>
<li><strong>Ngưỡng (thresholding)</strong> biến ảnh xám thành đen/trắng: pixel trên T thành 255, dưới thành 0.</li>
<li><strong>Cân bằng histogram</strong> trải mức sáng ra toàn dải 0..255 — tăng tương phản cho ảnh xỉn.</li>
</ul>
<pre><code>import cv2
gray = cv2.imread(&quot;x.jpg&quot;, cv2.IMREAD_GRAYSCALE)

neg   = 255 - gray                                  # am ban (bien doi diem)
eq    = cv2.equalizeHist(gray)                      # keo gian tuong phan
_, bw = cv2.threshold(gray, 128, 255, cv2.THRESH_BINARY)
hist  = cv2.calcHist([gray], [0], None, [256], [0, 256])
</code></pre>
<div class="callout"><span class="badge">Kinh nghiệm</span> Sửa phơi sáng/tương phản (cân bằng) TRƯỚC khi lấy ngưỡng — histogram đẹp giúp ngưỡng sạch hơn nhiều.</div>`,
  ]]);

const c2q = quiz('cvi301-quiz-2', 'Quiz 2 — Processing|||Quiz 2 — Xử lý ảnh', [
  { id: 'q1', question: 'Ảnh âm bản (negative) của ảnh xám 8-bit tính bằng?', options: ['in × 2', '255 − in', 'in / 255', 'in + 128'], correctIndex: 1, explanation: 'Âm bản đảo mức sáng: out = 255 − in.' },
  { id: 'q2', question: 'Histogram của ảnh mô tả điều gì?', options: ['Vị trí các cạnh', 'Số pixel ứng với mỗi mức sáng', 'Kích thước ảnh', 'Thứ tự kênh màu'], correctIndex: 1, explanation: 'Histogram đếm phân bố cường độ sáng của các pixel.' },
  { id: 'q3', question: 'Cân bằng histogram (equalization) nhằm mục đích?', options: ['Làm mờ ảnh', 'Trải mức sáng ra toàn dải để tăng tương phản', 'Xoay ảnh', 'Đổi BGR sang RGB'], correctIndex: 1, explanation: 'Equalization phân bố lại cường độ ra dải 0..255, tăng tương phản.' },
]);

const c3 = doc('cvi301-3-1-filtering', '3.1 — Filtering & convolution|||3.1 — Lọc & tích chập',
  'Tích chập (convolution) & kernel; làm mờ (blur), Gaussian, median; làm nét (sharpen); nhiễu và khử nhiễu.',
  [[
    `<span class="eyebrow">CVI301 · Chapter 3 · Lesson 3.1</span>
<h2>Filtering &amp; convolution</h2>
<h3>Convolution: sliding a kernel</h3>
<p><strong>Convolution</strong> slides a small matrix (the <strong>kernel</strong>) over the image; each output pixel is a weighted sum of its neighborhood. The kernel decides the effect — blur, sharpen, or edge.</p>
<h3>Common filters</h3>
<ul>
<li><strong>Box / average blur</strong> — kernel of equal weights; smooths but looks boxy.</li>
<li><strong>Gaussian blur</strong> — bell-shaped weights; the standard smoothing filter, removes high-frequency noise gently.</li>
<li><strong>Median blur</strong> — replaces a pixel with the median of its neighbors; the best cure for salt-and-pepper noise.</li>
<li><strong>Sharpen</strong> — a kernel that boosts the center and subtracts neighbors, enhancing detail.</li>
</ul>
<pre><code>import cv2, numpy as np
img = cv2.imread(&quot;x.jpg&quot;)

blur   = cv2.GaussianBlur(img, (5, 5), 0)     # denoise (Gaussian)
med    = cv2.medianBlur(img, 5)               # kills salt-and-pepper noise
k      = np.array([[0,-1,0],[-1,5,-1],[0,-1,0]])
sharp  = cv2.filter2D(img, -1, k)             # custom convolution kernel
</code></pre>
<div class="callout"><span class="badge">Noise matters</span> Gaussian blur for grainy sensor noise; median blur for salt-and-pepper. Denoising before edge detection avoids thousands of fake edges.</div>`,
    `<span class="eyebrow">CVI301 · Chương 3 · Bài 3.1</span>
<h2>Lọc &amp; tích chập</h2>
<h3>Tích chập: trượt một kernel</h3>
<p><strong>Tích chập (convolution)</strong> trượt một ma trận nhỏ (<strong>kernel/nhân</strong>) trên ảnh; mỗi pixel ra là tổng có trọng số của vùng lân cận. Kernel quyết định hiệu ứng — mờ, nét, hay biên.</p>
<h3>Các bộ lọc thường gặp</h3>
<ul>
<li><strong>Lọc trung bình (box)</strong> — kernel trọng số bằng nhau; làm mượt nhưng bị &quot;vuông&quot;.</li>
<li><strong>Gaussian blur</strong> — trọng số hình chuông; bộ làm mượt chuẩn, khử nhiễu tần số cao nhẹ nhàng.</li>
<li><strong>Median blur</strong> — thay pixel bằng trung vị lân cận; trị nhiễu muối-tiêu tốt nhất.</li>
<li><strong>Làm nét (sharpen)</strong> — kernel tăng tâm và trừ lân cận, làm rõ chi tiết.</li>
</ul>
<pre><code>import cv2, numpy as np
img = cv2.imread(&quot;x.jpg&quot;)

blur   = cv2.GaussianBlur(img, (5, 5), 0)     # khu nhieu (Gaussian)
med    = cv2.medianBlur(img, 5)               # tri nhieu muoi-tieu
k      = np.array([[0,-1,0],[-1,5,-1],[0,-1,0]])
sharp  = cv2.filter2D(img, -1, k)             # kernel tich chap tu dinh nghia
</code></pre>
<div class="callout"><span class="badge">Nhiễu quan trọng</span> Gaussian cho nhiễu hạt cảm biến; median cho nhiễu muối-tiêu. Khử nhiễu trước khi tìm biên tránh sinh ra hàng ngàn biên giả.</div>`,
  ]]);

const c3q = quiz('cvi301-quiz-3', 'Quiz 3 — Filtering|||Quiz 3 — Lọc', [
  { id: 'q1', question: 'Tích chập (convolution) hoạt động thế nào?', options: ['Sắp xếp pixel theo giá trị', 'Trượt một kernel và lấy tổng có trọng số vùng lân cận', 'Đổi không gian màu', 'Nén ảnh'], correctIndex: 1, explanation: 'Convolution trượt kernel trên ảnh, mỗi pixel ra là tổng có trọng số lân cận.' },
  { id: 'q2', question: 'Bộ lọc nào trị nhiễu muối-tiêu (salt-and-pepper) tốt nhất?', options: ['Gaussian blur', 'Median blur', 'Sharpen', 'Threshold'], correctIndex: 1, explanation: 'Median blur thay pixel bằng trung vị lân cận, loại điểm nhiễu đột biến.' },
  { id: 'q3', question: 'Kernel làm nét (sharpen) thường?', options: ['Trọng số bằng nhau', 'Tăng tâm, trừ lân cận', 'Toàn số 0', 'Chỉ có 1 phần tử'], correctIndex: 1, explanation: 'Sharpen tăng giá trị tâm và trừ các lân cận để làm rõ chi tiết.' },
]);

const c4 = doc('cvi301-4-1-edges-features', '4.1 — Edge & feature detection|||4.1 — Phát hiện biên & đặc trưng',
  'Đạo hàm ảnh & Sobel; biên Canny; góc Harris; đặc trưng cục bộ SIFT/ORB và ghép (matching).',
  [[
    `<span class="eyebrow">CVI301 · Chapter 4 · Lesson 4.1</span>
<h2>Edge &amp; feature detection</h2>
<h3>Edges: where intensity jumps</h3>
<p>An <strong>edge</strong> is a sudden change in brightness. The <strong>Sobel</strong> operator estimates the gradient (rate of change) in x and y. <strong>Canny</strong> is the gold-standard edge detector: it smooths, computes gradients, thins edges, then links them with two thresholds.</p>
<h3>Corners &amp; features</h3>
<ul>
<li><strong>Harris corner</strong> — finds points where intensity changes in two directions; corners are stable, easy to track.</li>
<li><strong>SIFT / ORB</strong> — detect <em>keypoints</em> and compute <em>descriptors</em> that survive scale and rotation, so the same object matches across images. ORB is fast and free.</li>
</ul>
<pre><code>import cv2
gray = cv2.imread(&quot;x.jpg&quot;, cv2.IMREAD_GRAYSCALE)

edges = cv2.Canny(gray, 100, 200)          # two-threshold edge map
sobelx = cv2.Sobel(gray, cv2.CV_64F, 1, 0) # gradient in x

orb = cv2.ORB_create(500)
kp, des = orb.detectAndCompute(gray, None) # keypoints + descriptors
</code></pre>
<div class="callout"><span class="badge">Why features?</span> Keypoints are the glue behind panorama stitching, object matching and tracking — the same physical point is recognized across different photos.</div>`,
    `<span class="eyebrow">CVI301 · Chương 4 · Bài 4.1</span>
<h2>Phát hiện biên &amp; đặc trưng</h2>
<h3>Biên: nơi độ sáng nhảy vọt</h3>
<p><strong>Biên (edge)</strong> là thay đổi đột ngột của độ sáng. Toán tử <strong>Sobel</strong> ước lượng gradient (tốc độ thay đổi) theo x và y. <strong>Canny</strong> là bộ dò biên chuẩn vàng: làm mượt, tính gradient, làm mảnh biên, rồi nối bằng hai ngưỡng.</p>
<h3>Góc &amp; đặc trưng</h3>
<ul>
<li><strong>Góc Harris</strong> — tìm điểm mà độ sáng đổi theo hai hướng; góc ổn định, dễ theo dõi.</li>
<li><strong>SIFT / ORB</strong> — dò <em>điểm khoá (keypoint)</em> và tính <em>mô tả (descriptor)</em> bền với tỉ lệ và xoay, nên cùng một vật khớp được giữa nhiều ảnh. ORB nhanh và miễn phí.</li>
</ul>
<pre><code>import cv2
gray = cv2.imread(&quot;x.jpg&quot;, cv2.IMREAD_GRAYSCALE)

edges = cv2.Canny(gray, 100, 200)          # ban do bien hai nguong
sobelx = cv2.Sobel(gray, cv2.CV_64F, 1, 0) # gradient theo x

orb = cv2.ORB_create(500)
kp, des = orb.detectAndCompute(gray, None) # diem khoa + mo ta
</code></pre>
<div class="callout"><span class="badge">Vì sao cần đặc trưng?</span> Keypoint là chất keo sau ghép ảnh panorama, khớp vật và theo dõi — cùng một điểm vật lý được nhận ra qua các ảnh khác nhau.</div>`,
  ]]);

const c4q = quiz('cvi301-quiz-4', 'Quiz 4 — Edges & features|||Quiz 4 — Biên & đặc trưng', [
  { id: 'q1', question: 'Bộ dò biên "chuẩn vàng" dùng hai ngưỡng để nối biên là?', options: ['Sobel', 'Canny', 'Harris', 'ORB'], correctIndex: 1, explanation: 'Canny làm mượt, tính gradient, làm mảnh và nối biên bằng hai ngưỡng.' },
  { id: 'q2', question: 'Harris dùng để phát hiện?', options: ['Góc (corner)', 'Màu da', 'Khuôn mặt', 'Văn bản'], correctIndex: 0, explanation: 'Harris tìm góc — điểm mà cường độ thay đổi theo hai hướng.' },
  { id: 'q3', question: 'SIFT/ORB tạo ra descriptor nhằm?', options: ['Làm mờ ảnh', 'Khớp cùng một điểm giữa nhiều ảnh dù đổi tỉ lệ/xoay', 'Đổi độ sáng', 'Nén file'], correctIndex: 1, explanation: 'Descriptor bền với tỉ lệ/xoay giúp ghép (match) cùng một điểm qua các ảnh.' },
]);

const c5 = doc('cvi301-5-1-geometry', '5.1 — Geometric transforms|||5.1 — Biến đổi hình học',
  'Resize, xoay (rotation), tịnh tiến; biến đổi affine; biến đổi phối cảnh (perspective) & warping.',
  [[
    `<span class="eyebrow">CVI301 · Chapter 5 · Lesson 5.1</span>
<h2>Geometric transforms</h2>
<h3>Moving pixels around</h3>
<p>Geometric transforms change <em>where</em> pixels sit, not their color. They are described by a matrix multiplied with each coordinate.</p>
<ul>
<li><strong>Translation / rotation / scale (resize)</strong> — the basics; resize also needs interpolation to fill new pixels.</li>
<li><strong>Affine</strong> — keeps parallel lines parallel (rotate + scale + shear + translate); defined by 3 point pairs.</li>
<li><strong>Perspective (homography)</strong> — models a viewpoint change; straight lines stay straight but parallels may converge. Defined by 4 point pairs — perfect for &quot;scan-to-flat&quot; document dewarping.</li>
</ul>
<pre><code>import cv2, numpy as np
img = cv2.imread(&quot;x.jpg&quot;)
h, w = img.shape[:2]

small = cv2.resize(img, (w // 2, h // 2))            # scale down
M = cv2.getRotationMatrix2D((w/2, h/2), 30, 1.0)     # rotate 30 deg
rot = cv2.warpAffine(img, M, (w, h))

H = cv2.getPerspectiveTransform(src_pts, dst_pts)    # 4 point pairs
flat = cv2.warpPerspective(img, H, (w, h))           # dewarp
</code></pre>
<div class="callout"><span class="badge">Interpolation</span> When resizing/rotating, new pixels are interpolated. Use <code>INTER_AREA</code> to shrink, <code>INTER_CUBIC</code>/<code>INTER_LINEAR</code> to enlarge.</div>`,
    `<span class="eyebrow">CVI301 · Chương 5 · Bài 5.1</span>
<h2>Biến đổi hình học</h2>
<h3>Dời pixel đi chỗ khác</h3>
<p>Biến đổi hình học thay đổi <em>vị trí</em> pixel, không đổi màu. Chúng được mô tả bằng một ma trận nhân với mỗi toạ độ.</p>
<ul>
<li><strong>Tịnh tiến / xoay / co giãn (resize)</strong> — cơ bản; resize cần nội suy để lấp pixel mới.</li>
<li><strong>Affine</strong> — giữ đường song song vẫn song song (xoay + co giãn + xén nghiêng + tịnh tiến); xác định bởi 3 cặp điểm.</li>
<li><strong>Phối cảnh (perspective/homography)</strong> — mô hình đổi góc nhìn; đường thẳng vẫn thẳng nhưng song song có thể hội tụ. Xác định bởi 4 cặp điểm — hoàn hảo để &quot;nắn phẳng&quot; ảnh chụp tài liệu.</li>
</ul>
<pre><code>import cv2, numpy as np
img = cv2.imread(&quot;x.jpg&quot;)
h, w = img.shape[:2]

small = cv2.resize(img, (w // 2, h // 2))            # thu nho
M = cv2.getRotationMatrix2D((w/2, h/2), 30, 1.0)     # xoay 30 do
rot = cv2.warpAffine(img, M, (w, h))

H = cv2.getPerspectiveTransform(src_pts, dst_pts)    # 4 cap diem
flat = cv2.warpPerspective(img, H, (w, h))           # nan phang
</code></pre>
<div class="callout"><span class="badge">Nội suy</span> Khi resize/xoay, pixel mới được nội suy. Dùng <code>INTER_AREA</code> để thu nhỏ, <code>INTER_CUBIC</code>/<code>INTER_LINEAR</code> để phóng to.</div>`,
  ]]);

const c5q = quiz('cvi301-quiz-5', 'Quiz 5 — Geometry|||Quiz 5 — Hình học', [
  { id: 'q1', question: 'Biến đổi nào giữ các đường song song vẫn song song?', options: ['Perspective', 'Affine', 'Canny', 'Threshold'], correctIndex: 1, explanation: 'Affine (xoay/co giãn/xén/tịnh tiến) giữ tính song song.' },
  { id: 'q2', question: 'Nắn phẳng ảnh chụp tài liệu bị nghiêng góc nhìn dùng?', options: ['Biến đổi phối cảnh (perspective/homography)', 'Median blur', 'Histogram equalization', 'Sobel'], correctIndex: 0, explanation: 'Perspective transform (4 cặp điểm) nắn phẳng khi đổi góc nhìn.' },
  { id: 'q3', question: 'Khi thu nhỏ ảnh, phép nội suy nào thường tốt nhất?', options: ['INTER_AREA', 'INTER_NEAREST luôn', 'Không cần nội suy', 'INTER_CUBIC để thu nhỏ'], correctIndex: 0, explanation: 'INTER_AREA cho chất lượng tốt khi thu nhỏ; CUBIC/LINEAR khi phóng to.' },
]);

const c6 = doc('cvi301-6-1-segmentation', '6.1 — Segmentation & detection|||6.1 — Phân đoạn & phát hiện',
  'Ngưỡng Otsu, contour & phân tích hình; biến đổi Hough (đường/đường tròn); phân đoạn cơ bản.',
  [[
    `<span class="eyebrow">CVI301 · Chapter 6 · Lesson 6.1</span>
<h2>Segmentation &amp; detection</h2>
<h3>Splitting an image into regions</h3>
<p><strong>Segmentation</strong> groups pixels into meaningful regions (object vs background). The simplest tool is thresholding; <strong>Otsu</strong> picks the threshold automatically from the histogram.</p>
<h3>Contours &amp; shapes</h3>
<p>After a binary image, <strong>contours</strong> are the outlines of connected regions. From a contour you can measure area, perimeter, bounding box, and count objects.</p>
<h3>Hough transform</h3>
<p>The <strong>Hough transform</strong> detects parametric shapes — <em>lines</em> and <em>circles</em> — even when broken up, by voting in parameter space. Used for lane lines, coins, and grids.</p>
<pre><code>import cv2
gray = cv2.imread(&quot;x.jpg&quot;, cv2.IMREAD_GRAYSCALE)

_, bw = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
cnts, _ = cv2.findContours(bw, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
print(&quot;objects:&quot;, len(cnts))

edges = cv2.Canny(gray, 100, 200)
lines = cv2.HoughLinesP(edges, 1, 3.14/180, 80, minLineLength=50, maxLineGap=10)
</code></pre>
<div class="callout"><span class="badge">Pipeline</span> A classic detector chains it all: denoise → threshold (Otsu) → contours → filter by area/shape → count or locate objects.</div>`,
    `<span class="eyebrow">CVI301 · Chương 6 · Bài 6.1</span>
<h2>Phân đoạn &amp; phát hiện</h2>
<h3>Chia ảnh thành các vùng</h3>
<p><strong>Phân đoạn (segmentation)</strong> gom pixel thành vùng có nghĩa (vật vs nền). Công cụ đơn giản nhất là ngưỡng; <strong>Otsu</strong> tự chọn ngưỡng từ histogram.</p>
<h3>Contour &amp; hình dạng</h3>
<p>Sau khi có ảnh nhị phân, <strong>contour</strong> là đường viền các vùng liên thông. Từ contour bạn đo được diện tích, chu vi, hộp bao, và đếm số vật.</p>
<h3>Biến đổi Hough</h3>
<p><strong>Biến đổi Hough</strong> phát hiện hình tham số — <em>đường thẳng</em> và <em>đường tròn</em> — kể cả khi bị đứt, bằng cách bỏ phiếu trong không gian tham số. Dùng cho vạch làn đường, đồng xu, lưới.</p>
<pre><code>import cv2
gray = cv2.imread(&quot;x.jpg&quot;, cv2.IMREAD_GRAYSCALE)

_, bw = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
cnts, _ = cv2.findContours(bw, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
print(&quot;so vat:&quot;, len(cnts))

edges = cv2.Canny(gray, 100, 200)
lines = cv2.HoughLinesP(edges, 1, 3.14/180, 80, minLineLength=50, maxLineGap=10)
</code></pre>
<div class="callout"><span class="badge">Đường ống</span> Một bộ phát hiện cổ điển nối tất cả: khử nhiễu → ngưỡng (Otsu) → contour → lọc theo diện tích/hình → đếm hoặc định vị vật.</div>`,
  ]]);

const c6q = quiz('cvi301-quiz-6', 'Quiz 6 — Segmentation|||Quiz 6 — Phân đoạn', [
  { id: 'q1', question: 'Phương pháp tự chọn ngưỡng từ histogram là?', options: ['Otsu', 'Sobel', 'ORB', 'Gaussian'], correctIndex: 0, explanation: 'Otsu tự tìm ngưỡng tối ưu tách hai lớp từ histogram.' },
  { id: 'q2', question: 'Sau khi có ảnh nhị phân, contour cho ta?', options: ['Không gian màu', 'Đường viền vùng liên thông (đo diện tích, đếm vật)', 'Ngưỡng tối ưu', 'Ma trận xoay'], correctIndex: 1, explanation: 'Contour là đường viền vùng liên thông, dùng đo/đếm vật.' },
  { id: 'q3', question: 'Biến đổi Hough phù hợp phát hiện?', options: ['Đường thẳng và đường tròn', 'Khuôn mặt', 'Màu da', 'Nhiễu'], correctIndex: 0, explanation: 'Hough dò hình tham số như đường thẳng, đường tròn bằng cách bỏ phiếu.' },
]);

const c7 = doc('cvi301-7-1-deep-learning', '7.1 — Deep learning for vision|||7.1 — Học sâu cho thị giác',
  'CNN (tích chập/pooling); phân loại ảnh; phát hiện đối tượng (YOLO, R-CNN tổng quan); transfer learning.',
  [[
    `<span class="eyebrow">CVI301 · Chapter 7 · Lesson 7.1</span>
<h2>Deep learning for vision</h2>
<h3>Convolutional Neural Networks (CNN)</h3>
<p>A <strong>CNN</strong> learns the filters instead of you hand-designing them. Stacked <strong>convolution</strong> + <strong>pooling</strong> layers turn raw pixels into higher-level features (edges → textures → parts → objects), ending in a classifier.</p>
<h3>Two big tasks</h3>
<ul>
<li><strong>Image classification</strong> — one label for the whole image (cat vs dog).</li>
<li><strong>Object detection</strong> — boxes + labels for many objects. <strong>YOLO</strong> is a fast single-shot detector; the <strong>R-CNN</strong> family is region-based and accurate.</li>
</ul>
<h3>Transfer learning</h3>
<p>Instead of training from scratch, take a network pretrained on ImageNet and <strong>fine-tune</strong> it on your small dataset — far less data and compute, much better accuracy.</p>
<pre><code>import torch, torchvision as tv
model = tv.models.resnet18(weights=&quot;IMAGENET1K_V1&quot;)   # pretrained
for p in model.parameters(): p.requires_grad = False   # freeze backbone
model.fc = torch.nn.Linear(512, 5)                     # 5 new classes
# then train only model.fc on your data (transfer learning)
</code></pre>
<div class="callout"><span class="badge">Why CNNs won</span> Classic features (SIFT) are hand-made; CNNs <em>learn</em> the best features for the task, which is why they dominate modern vision — see Stanford CS231n.</div>`,
    `<span class="eyebrow">CVI301 · Chương 7 · Bài 7.1</span>
<h2>Học sâu cho thị giác</h2>
<h3>Mạng nơ-ron tích chập (CNN)</h3>
<p><strong>CNN</strong> tự học các bộ lọc thay vì bạn thiết kế tay. Các lớp <strong>tích chập</strong> + <strong>pooling</strong> xếp chồng biến pixel thô thành đặc trưng cấp cao (biên → vân → bộ phận → vật), kết bằng một bộ phân loại.</p>
<h3>Hai việc lớn</h3>
<ul>
<li><strong>Phân loại ảnh</strong> — một nhãn cho cả ảnh (mèo hay chó).</li>
<li><strong>Phát hiện đối tượng</strong> — hộp + nhãn cho nhiều vật. <strong>YOLO</strong> là bộ dò một-lần nhanh; họ <strong>R-CNN</strong> theo vùng, chính xác.</li>
</ul>
<h3>Transfer learning (học chuyển giao)</h3>
<p>Thay vì huấn luyện từ đầu, lấy mạng đã tiền huấn luyện trên ImageNet và <strong>tinh chỉnh (fine-tune)</strong> trên tập nhỏ của bạn — ít dữ liệu và tính toán hơn nhiều, độ chính xác tốt hơn hẳn.</p>
<pre><code>import torch, torchvision as tv
model = tv.models.resnet18(weights=&quot;IMAGENET1K_V1&quot;)   # da tien huan luyen
for p in model.parameters(): p.requires_grad = False   # dong bang backbone
model.fc = torch.nn.Linear(512, 5)                     # 5 lop moi
# sau do chi huan luyen model.fc tren du lieu cua ban (transfer learning)
</code></pre>
<div class="callout"><span class="badge">Vì sao CNN thắng</span> Đặc trưng cổ điển (SIFT) do người làm tay; CNN <em>tự học</em> đặc trưng tốt nhất cho việc, nên thống trị thị giác hiện đại — xem Stanford CS231n.</div>`,
  ]]);

const c7q = quiz('cvi301-quiz-7', 'Quiz 7 — Deep learning|||Quiz 7 — Học sâu', [
  { id: 'q1', question: 'Điểm khác biệt cốt lõi của CNN so với đặc trưng cổ điển (SIFT)?', options: ['CNN không dùng tích chập', 'CNN tự học các bộ lọc thay vì thiết kế tay', 'CNN chỉ chạy trên ảnh xám', 'CNN không cần dữ liệu'], correctIndex: 1, explanation: 'CNN học bộ lọc/đặc trưng từ dữ liệu thay vì con người thiết kế thủ công.' },
  { id: 'q2', question: 'Bài toán gán HỘP + nhãn cho nhiều vật trong ảnh gọi là?', options: ['Phân loại ảnh', 'Phát hiện đối tượng (object detection)', 'Cân bằng histogram', 'Nội suy'], correctIndex: 1, explanation: 'Object detection cho hộp bao + nhãn; YOLO/R-CNN là ví dụ.' },
  { id: 'q3', question: 'Transfer learning là?', options: ['Huấn luyện từ đầu với dữ liệu khổng lồ', 'Lấy mạng đã tiền huấn luyện rồi tinh chỉnh trên tập nhỏ', 'Đổi BGR sang RGB', 'Lọc Gaussian'], correctIndex: 1, explanation: 'Transfer learning tận dụng mạng pretrained (ImageNet) rồi fine-tune.' },
]);

const c8 = doc('cvi301-8-1-applications', '8.1 — Applications & ethics|||8.1 — Ứng dụng & đạo đức',
  'Nhận diện khuôn mặt; OCR (nhận dạng chữ); theo dõi đối tượng (tracking); đạo đức & thiên lệch trong thị giác máy tính.',
  [[
    `<span class="eyebrow">CVI301 · Chapter 8 · Lesson 8.1</span>
<h2>Applications &amp; ethics</h2>
<h3>Real-world systems</h3>
<ul>
<li><strong>Face recognition</strong> — detect a face, then match its embedding against known identities. OpenCV ships Haar/DNN face detectors.</li>
<li><strong>OCR</strong> — read text from images (Tesseract, EasyOCR). Preprocessing (deskew, threshold) is half the battle.</li>
<li><strong>Object tracking</strong> — follow a detected object across video frames (CSRT, KCF, or detection + a tracker like SORT).</li>
</ul>
<pre><code>import cv2
# Face DETECTION (Haar cascade) — a classic first step
face = cv2.CascadeClassifier(cv2.data.haarcascades + &quot;haarcascade_frontalface_default.xml&quot;)
gray = cv2.cvtColor(cv2.imread(&quot;p.jpg&quot;), cv2.COLOR_BGR2GRAY)
boxes = face.detectMultiScale(gray, 1.1, 5)   # returns [x, y, w, h] per face

tracker = cv2.TrackerCSRT_create()            # single-object video tracker
</code></pre>
<h3>Ethics &amp; responsibility</h3>
<p>Vision systems can be <strong>biased</strong> (worse accuracy for some skin tones), invade <strong>privacy</strong> (mass surveillance), and be fooled by <strong>adversarial inputs</strong>. Ask: is consent given? Is the error cost fair across groups? Deploying face recognition is a social decision, not only a technical one.</p>
<div class="callout"><span class="badge">Job-ready</span> Detection + OCR + tracking cover most industry demos. Always pair them with a note on bias, privacy and consent — employers and regulators now expect it.</div>`,
    `<span class="eyebrow">CVI301 · Chương 8 · Bài 8.1</span>
<h2>Ứng dụng &amp; đạo đức</h2>
<h3>Hệ thống thực tế</h3>
<ul>
<li><strong>Nhận diện khuôn mặt</strong> — dò khuôn mặt, rồi khớp embedding với các danh tính đã biết. OpenCV có sẵn bộ dò mặt Haar/DNN.</li>
<li><strong>OCR</strong> — đọc chữ từ ảnh (Tesseract, EasyOCR). Tiền xử lý (nắn nghiêng, ngưỡng) chiếm một nửa thành công.</li>
<li><strong>Theo dõi đối tượng</strong> — bám vật đã phát hiện qua các khung video (CSRT, KCF, hoặc detection + tracker như SORT).</li>
</ul>
<pre><code>import cv2
# PHAT HIEN khuon mat (Haar cascade) — buoc dau kinh dien
face = cv2.CascadeClassifier(cv2.data.haarcascades + &quot;haarcascade_frontalface_default.xml&quot;)
gray = cv2.cvtColor(cv2.imread(&quot;p.jpg&quot;), cv2.COLOR_BGR2GRAY)
boxes = face.detectMultiScale(gray, 1.1, 5)   # tra ve [x, y, w, h] moi mat

tracker = cv2.TrackerCSRT_create()            # tracker mot vat trong video
</code></pre>
<h3>Đạo đức &amp; trách nhiệm</h3>
<p>Hệ thống thị giác có thể <strong>thiên lệch</strong> (kém chính xác với một số tông da), xâm phạm <strong>quyền riêng tư</strong> (giám sát hàng loạt), và bị lừa bởi <strong>đầu vào đối kháng</strong>. Hãy hỏi: có sự đồng thuận không? Chi phí lỗi có công bằng giữa các nhóm không? Triển khai nhận diện khuôn mặt là quyết định xã hội, không chỉ kỹ thuật.</p>
<div class="callout"><span class="badge">Sẵn sàng đi làm</span> Detection + OCR + tracking phủ hầu hết demo doanh nghiệp. Luôn kèm một ghi chú về thiên lệch, riêng tư và đồng thuận — nhà tuyển dụng và cơ quan quản lý nay đều mong điều đó.</div>`,
  ]]);

const c8q = quiz('cvi301-quiz-8', 'Quiz 8 — Applications|||Quiz 8 — Ứng dụng', [
  { id: 'q1', question: 'OCR là công nghệ để?', options: ['Đọc chữ từ ảnh', 'Xoay ảnh', 'Khử nhiễu', 'Đổi màu'], correctIndex: 0, explanation: 'OCR (Optical Character Recognition) nhận dạng và đọc chữ trong ảnh.' },
  { id: 'q2', question: 'Theo dõi đối tượng (tracking) khác phát hiện (detection) ở chỗ?', options: ['Không khác gì', 'Bám cùng một vật qua các khung video', 'Chỉ chạy trên một ảnh', 'Chỉ đổi không gian màu'], correctIndex: 1, explanation: 'Tracking bám một vật qua nhiều khung hình liên tiếp của video.' },
  { id: 'q3', question: 'Vấn đề đạo đức QUAN TRỌNG của nhận diện khuôn mặt là?', options: ['Tốn dung lượng ổ đĩa', 'Thiên lệch, riêng tư và sự đồng thuận', 'Chỉ chạy chậm', 'Cần GPU'], correctIndex: 1, explanation: 'Thiên lệch theo nhóm, quyền riêng tư và đồng thuận là các mối lo cốt lõi.' },
]);

const taiLieu = doc('cvi301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn (Szeliski, Gonzalez, Forsyth & Ponce), OpenCV docs, CS231n, YouTube, công cụ, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">CVI301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Computer Vision — from pixels and filtering to features, geometry and deep learning — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for CVI301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://szeliski.org/Book/" target="_blank" rel="noopener">Szeliski — <em>Computer Vision: Algorithms and Applications</em> (free PDF)</a></li>
<li><a href="https://www.imageprocessingplace.com/" target="_blank" rel="noopener">Gonzalez &amp; Woods — <em>Digital Image Processing</em></a></li>
<li><a href="https://en.wikipedia.org/wiki/Computer_Vision:_A_Modern_Approach" target="_blank" rel="noopener">Forsyth &amp; Ponce — <em>Computer Vision: A Modern Approach</em></a></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://docs.opencv.org/" target="_blank" rel="noopener">OpenCV documentation &amp; tutorials</a></li>
<li><a href="https://cs231n.github.io/" target="_blank" rel="noopener">Stanford CS231n — Convolutional Neural Networks for Visual Recognition</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@firstprinciplesofcomputervision3258" target="_blank" rel="noopener">First Principles of Computer Vision</a> — clear classic-vision lectures</li>
<li><a href="https://www.youtube.com/@YannicKilcher" target="_blank" rel="noopener">Yannic Kilcher</a> — deep-learning &amp; vision papers explained</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://opencv.org/" target="_blank" rel="noopener">OpenCV (cv2)</a> — the classic computer-vision library for Python/C++</li>
<li><a href="https://colab.research.google.com/" target="_blank" rel="noopener">Google Colab</a> — free GPU notebooks for the deep-learning chapters</li>
<li><a href="https://github.com/ultralytics/ultralytics" target="_blank" rel="noopener">Ultralytics YOLO</a> — modern object detection out of the box</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundations</strong> — digital images, pixels, channels, color spaces (RGB/HSV/Gray).</li>
<li><strong>Classic processing</strong> — histograms, thresholding, convolution &amp; filtering, edges &amp; features.</li>
<li><strong>Geometry &amp; grouping</strong> — affine/perspective transforms, segmentation, contours, Hough.</li>
<li><strong>Deep learning &amp; jobs</strong> — CNNs, detection (YOLO), face recognition, OCR, tracking, with ethics.</li>
</ol></div>`,
    `<span class="eyebrow">CVI301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Thị giác máy tính — từ pixel và lọc tới đặc trưng, hình học và học sâu — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của CVI301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://szeliski.org/Book/" target="_blank" rel="noopener">Szeliski — <em>Computer Vision: Algorithms and Applications</em> (PDF miễn phí)</a></li>
<li><a href="https://www.imageprocessingplace.com/" target="_blank" rel="noopener">Gonzalez &amp; Woods — <em>Digital Image Processing</em></a></li>
<li><a href="https://en.wikipedia.org/wiki/Computer_Vision:_A_Modern_Approach" target="_blank" rel="noopener">Forsyth &amp; Ponce — <em>Computer Vision: A Modern Approach</em></a></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://docs.opencv.org/" target="_blank" rel="noopener">Tài liệu &amp; hướng dẫn OpenCV</a></li>
<li><a href="https://cs231n.github.io/" target="_blank" rel="noopener">Stanford CS231n — Mạng tích chập cho nhận dạng thị giác</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@firstprinciplesofcomputervision3258" target="_blank" rel="noopener">First Principles of Computer Vision</a> — bài giảng thị giác cổ điển rõ ràng</li>
<li><a href="https://www.youtube.com/@YannicKilcher" target="_blank" rel="noopener">Yannic Kilcher</a> — giải thích paper học sâu &amp; thị giác</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://opencv.org/" target="_blank" rel="noopener">OpenCV (cv2)</a> — thư viện thị giác cổ điển cho Python/C++</li>
<li><a href="https://colab.research.google.com/" target="_blank" rel="noopener">Google Colab</a> — notebook GPU miễn phí cho các chương học sâu</li>
<li><a href="https://github.com/ultralytics/ultralytics" target="_blank" rel="noopener">Ultralytics YOLO</a> — phát hiện đối tượng hiện đại dùng ngay</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — ảnh số, pixel, kênh màu, không gian màu (RGB/HSV/Gray).</li>
<li><strong>Xử lý cổ điển</strong> — histogram, ngưỡng, tích chập &amp; lọc, biên &amp; đặc trưng.</li>
<li><strong>Hình học &amp; nhóm</strong> — biến đổi affine/phối cảnh, phân đoạn, contour, Hough.</li>
<li><strong>Học sâu &amp; đi làm</strong> — CNN, phát hiện (YOLO), nhận diện khuôn mặt, OCR, theo dõi, kèm đạo đức.</li>
</ol></div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'CVI301',
    slug: 'cvi301-computer-vision',
    title: 'Computer Vision',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CVI301.webp',
    shortDescription: 'Computer vision from pixels to deep learning — images & color spaces, histograms, convolution, edges & features (Canny, SIFT/ORB), geometric transforms, segmentation, CNNs & object detection, face recognition & OCR. Python/OpenCV code & quizzes.|||Thị giác máy tính từ pixel tới học sâu — ảnh & không gian màu, histogram, tích chập, biên & đặc trưng (Canny, SIFT/ORB), biến đổi hình học, phân đoạn, CNN & phát hiện đối tượng, nhận diện khuôn mặt & OCR. Có code Python/OpenCV & quiz.',
    description: 'Môn <strong>CVI301 — Computer Vision</strong> (kỳ 4, ngành Khoa học Máy tính) dạy máy <strong>nhìn và hiểu ảnh</strong>. Đi từ <strong>nền ảnh số</strong> (pixel, kênh màu, RGB/HSV/Gray) → <strong>xử lý cơ bản</strong> (histogram, ngưỡng) → <strong>lọc &amp; tích chập</strong> → <strong>biên &amp; đặc trưng</strong> (Canny, Harris, SIFT/ORB) → <strong>biến đổi hình học</strong> → <strong>phân đoạn &amp; Hough</strong> → <strong>học sâu</strong> (CNN, phát hiện đối tượng) → <strong>ứng dụng</strong> (khuôn mặt, OCR, theo dõi, đạo đức). Bám tài liệu chuẩn (Szeliski, Gonzalez, Forsyth &amp; Ponce, CS231n), song ngữ, có code Python/OpenCV và quiz mỗi chương.',
    whatYouLearn: 'Ảnh số & không gian màu (RGB/HSV/Gray); biến đổi điểm, histogram, ngưỡng & cân bằng; tích chập, blur/Gaussian/median, sharpen, khử nhiễu; biên Sobel/Canny, góc Harris, đặc trưng SIFT/ORB; biến đổi affine/perspective, resize/xoay/warping; ngưỡng Otsu, contour, Hough, phân đoạn; CNN, phân loại ảnh, phát hiện đối tượng (YOLO/R-CNN), transfer learning; nhận diện khuôn mặt, OCR, theo dõi, và đạo đức thị giác máy tính. Thực hành bằng Python/OpenCV.',
    requirements: 'Biết Python cơ bản và NumPy; đại số tuyến tính & xác suất phổ thông. Nên cài OpenCV (pip install opencv-python) hoặc dùng Google Colab.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách chuẩn, OpenCV docs, CS231n, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Thị giác máy tính là gì, ảnh là số, lộ trình 4 bước.', lessons: [intro] },
    { title: 'Chương 1 — Nhập môn thị giác máy tính|||Chapter 1 — Introduction to computer vision', description: 'Ảnh số, pixel, kênh, không gian màu RGB/HSV/Gray.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Xử lý ảnh cơ bản|||Chapter 2 — Basic image processing', description: 'Histogram, ngưỡng, cân bằng sáng, biến đổi điểm.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Lọc & tích chập|||Chapter 3 — Filtering & convolution', description: 'Convolution, blur/sharpen, Gaussian, median, nhiễu.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Phát hiện biên & đặc trưng|||Chapter 4 — Edge & feature detection', description: 'Sobel/Canny, góc Harris, SIFT/ORB.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Biến đổi hình học|||Chapter 5 — Geometric transforms', description: 'Affine, perspective, warping, resize, xoay.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Phân đoạn & phát hiện|||Chapter 6 — Segmentation & detection', description: 'Otsu, contour, Hough, phân đoạn cơ bản.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Học sâu cho thị giác|||Chapter 7 — Deep learning for vision', description: 'CNN, phân loại, phát hiện (YOLO/R-CNN), transfer learning.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ứng dụng|||Chapter 8 — Applications', description: 'Nhận diện khuôn mặt, OCR, theo dõi, đạo đức.', lessons: [c8, c8q] },
  ],
};
