/**
 * Exp Hub guide for MAE101 — math tools (Vietnamese).
 * Seeded by scripts/exphub-seed-guide.mjs (idempotent upsert by slug).
 * Rendered with `.rich-content` → callouts, step maps, clickable open cards.
 * Academy MAE101 links "Công cụ" cards to /exp-hub/<slug>.
 */
export default {
  category: { slug: 'fptu-moi-truong-hoc', name: 'FPTU — Cài đặt môi trường học', icon: '🛠️' },
  snippet: {
    slug: 'mae101-cong-cu-hoc-tap',
    title: 'MAE101 — Công cụ học tập: Maxima, GeoGebra, Desmos & Python/NumPy',
    kind: 'NOTE',
    language: 'text',
    status: 'PUBLISHED',
    description: 'Các công cụ miễn phí giúp học MAE101: Maxima (đại số máy tính cho giới hạn/đạo hàm/tích phân/ma trận), Desmos & GeoGebra (vẽ đồ thị & trực quan), Python/NumPy (ma trận & biến đổi tuyến tính) — kèm link cài đặt và ví dụ.',
    referenceUrl: 'https://maxima.sourceforge.io/',
    codeBlocks: [
      {
        name: 'Maxima — giải tích & ma trận',
        language: 'text',
        code: `limit((x^2-4)/(x-2), x, 2);         /* → 4 */
diff(sin(x)*x, x);                  /* dao ham → sin(x)+x*cos(x) */
integrate(x^2, x, 0, 2);           /* → 8/3 */
determinant(matrix([1,2],[3,4]));  /* → -2 */
invert(matrix([1,2],[3,4]));       /* nghich dao */
eigenvalues(matrix([2,0],[0,3]));  /* gia tri rieng */`,
      },
      {
        name: 'Python + NumPy — vector & biến đổi tuyến tính',
        language: 'python',
        code: `import numpy as np

A = np.array([[0, -1], [1, 0]])   # xoay 90 do
v = np.array([1, 0])
print(A @ v)               # nhan ma tran-vector → [0 1]
print(np.linalg.det(A))    # dinh thuc → 1.0
print(np.linalg.inv(A))    # nghich dao
print(np.linalg.eig(A))    # gia tri rieng & vector rieng`,
      },
    ],
    noteContent: `
<span class="eyebrow">Công cụ học tập · MAE101</span>
<h2>Công cụ tính toán cho MAE101</h2>
<p class="lead">Toán phải <strong>làm bằng tay</strong> mới thi được — nhưng công cụ giúp bạn <em>kiểm</em> đáp án tức thì, <em>trực quan hoá</em> đồ thị, và khám phá bài khó. Dưới đây là bộ công cụ miễn phí phủ cả hai nửa của môn: giải tích và đại số tuyến tính.</p>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Giải tích</div><div class="lz-t">Maxima / Desmos</div><div class="lz-d">giới hạn, đạo hàm, tích phân</div></div>
  <div class="lz-step"><div class="lz-k">Đại số TT</div><div class="lz-t">Maxima / NumPy</div><div class="lz-d">ma trận, định thức, giá trị riêng</div></div>
  <div class="lz-step"><div class="lz-k">Trực quan</div><div class="lz-t">GeoGebra</div><div class="lz-d">vector & biến đổi</div></div>
</div>

<h3>🧮 1 — Maxima (đại số máy tính — mạnh nhất, kiểm mọi thứ)</h3>
<p>Tính chính xác giới hạn, đạo hàm, tích phân, định thức, nghịch đảo, giá trị riêng bằng ký hiệu (không phải số gần đúng). Xem khối lệnh mẫu ở trên. Miễn phí, chạy offline.</p>
<a class="link-card dl" href="https://maxima.sourceforge.io/download.html" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Maxima (miễn phí, Windows/macOS/Linux)</span><span class="lc-sub">maxima.sourceforge.io · dùng bản wxMaxima có giao diện dễ nhìn</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>📈 2 — Desmos (vẽ đồ thị tức thì trên web)</h3>
<p>Gõ một hàm là thấy đồ thị ngay — tuyệt để trực quan giới hạn, độ dốc (đạo hàm), diện tích (tích phân) và hình dạng hàm ở Chương 1–4.</p>
<a class="link-card dl" href="https://www.desmos.com/calculator" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Desmos Graphing Calculator</span><span class="lc-sub">desmos.com/calculator · không cần cài, chạy trên trình duyệt</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>📐 3 — GeoGebra (đồ thị + vector + ma trận)</h3>
<p>Mạnh cho nửa đại số tuyến tính: dựng vector trong R²/R³, xem biến đổi tuyến tính (xoay/co giãn/phản chiếu) tác động lên hình. Trực quan hoá Chương 8.</p>
<a class="link-card dl" href="https://www.geogebra.org/calculator" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">GeoGebra Calculator</span><span class="lc-sub">geogebra.org · web hoặc app, miễn phí</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>🐍 4 — Python + NumPy (ma trận trong code — dự án FPT)</h3>
<p>Syllabus MAE101 có dự án "Linear transformation with Python". NumPy là thư viện chuẩn cho vector/ma trận — cũng chính là nền của mọi machine learning. Xem khối code mẫu ở trên. Cài Python rồi <code>pip install numpy</code>.</p>
<a class="link-card dl" href="https://www.python.org/downloads/" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Python (chính chủ python.org)</span><span class="lc-sub">python.org/downloads · rồi: pip install numpy</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>
<a class="link-card dl" href="https://numpy.org/doc/stable/user/absolute_beginners.html" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">NumPy — hướng dẫn cho người mới</span><span class="lc-sub">numpy.org · vector, ma trận, linalg</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<div class="note-ct">Nguyên tắc vàng: dùng công cụ để <strong>KIỂM</strong> bài, không phải để <strong>THAY</strong> việc luyện. Bài thi (40%) và progress test kiểm bạn làm được bằng tay hay không. Làm bài tập mỗi tuần — toán xây tích luỹ, không "cày" một đêm được. Ba progress test: PT1 (giải tích Ch1–4), PT2 (ma trận Ch5–7), PT3 (không gian vector Ch8–9).</div>
`,
  },
};
