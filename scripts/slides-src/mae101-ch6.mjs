/** MAE101 · Deck mae6 — Chapter 6: Matrices. Slide data (rendered by _render-slides.mjs). */
export const deck = { key: 'mae6', code: 'MAE6', title: 'Chapter 6 — Matrices', sub: 'MAE101 · Mathematics for Engineering' };

// k('latex')  -> công thức inline ; K('latex') -> công thức lớn giữa slide
const k = (s) => `<span class="tex">${s}</span>`;
const K = (s) => `<div class="texbig">${s}</div>`;

export const slides = [
  { kind: 'cover', t: 'Chapter 6 — Matrices', sub: 'Ma trận · Phép toán, nghịch đảo & biến đổi tuyến tính trong R²',
    body: `<p class="cov-meta">MAE101 · Mathematics for Engineering<br/>Nicholson — <i>Linear Algebra with Applications</i>, Ch. 2–3</p>` },

  { t: 'Contents · Nội dung chương', body: `
    <ol class="toc">
      <li>Ma trận, cỡ &amp; các loại đặc biệt</li>
      <li>Cộng, nhân vô hướng &amp; chuyển vị</li>
      <li>Ma trận nhân vector — hệ ${k('A\\mathbf{x} = \\mathbf{b}')}</li>
      <li>Phép nhân hai ma trận &amp; tính chất</li>
      <li>Biến đổi ma trận trong ${k('\\mathbb{R}^2')} — quay, đối xứng, co giãn</li>
      <li>Ma trận nghịch đảo &amp; Gauss-Jordan</li>
    </ol>` },

  { t: 'What is a matrix · Ma trận là gì', body: `
    <p class="lead2">Ma trận cỡ m×n là bảng số chữ nhật gồm m hàng, n cột, phần tử hàng i cột j ký hiệu ${k('a_{ij}')}:</p>
    ${K('A = \\begin{bmatrix} a_{11} & a_{12} & \\cdots & a_{1n} \\\\ a_{21} & a_{22} & \\cdots & a_{2n} \\\\ \\vdots & \\vdots & \\ddots & \\vdots \\\\ a_{m1} & a_{m2} & \\cdots & a_{mn} \\end{bmatrix}')}
    <div class="grid3">
      <div class="card"><b>Vuông</b><p>m = n</p></div>
      <div class="card"><b>Đơn vị I</b><p>Vuông, chéo toàn 1, còn lại 0</p></div>
      <div class="card"><b>Không</b><p>Mọi phần tử = 0</p></div>
      <div class="card"><b>Chéo</b><p>Ngoài đường chéo toàn 0</p></div>
      <div class="card"><b>Tam giác trên</b><p>Dưới đường chéo toàn 0</p></div>
      <div class="card"><b>Tam giác dưới</b><p>Trên đường chéo toàn 0</p></div>
    </div>` },

  { t: 'Addition & scalar multiplication · Cộng & nhân vô hướng', body: `
    <p class="lead2">Chỉ cộng được hai ma trận <b>cùng cỡ</b> — cộng từng phần tử tương ứng:</p>
    ${K('\\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\end{bmatrix} + \\begin{bmatrix} 5 & 0 \\\\ -1 & 2 \\end{bmatrix} = \\begin{bmatrix} 6 & 2 \\\\ 2 & 6 \\end{bmatrix}')}
    <p class="note">Nhân vô hướng ${k('c')}: nhân <b>mọi</b> phần tử với ${k('c')}.</p>
    ${K('2\\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\end{bmatrix} = \\begin{bmatrix} 2 & 4 \\\\ 6 & 8 \\end{bmatrix}')}
    <div class="box ok">A + B = B + A, và ${k('c(A+B) = cA + cB')} — giống số thực.</div>` },

  { t: 'Transpose · Chuyển vị', body: `
    <p class="lead2">Chuyển vị ${k('A^T')}: đổi hàng thành cột (hàng i của A ⇒ cột i của ${k('A^T')}):</p>
    ${K('A = \\begin{bmatrix} 1 & 2 & 3 \\\\ 4 & 5 & 6 \\end{bmatrix} \\Rightarrow A^T = \\begin{bmatrix} 1 & 4 \\\\ 2 & 5 \\\\ 3 & 6 \\end{bmatrix}')}
    <ol class="big">
      <li>${k('(A^T)^T = A')}</li>
      <li>${k('(A+B)^T = A^T + B^T')}</li>
      <li>${k('(AB)^T = B^T A^T')}</li>
    </ol>
    <div class="box warn">Tính chất 3: thứ tự <b>đảo ngược</b> khi chuyển vị một tích.</div>` },

  { t: 'Symmetric & skew-symmetric · Ma trận đối xứng', body: `
    <p class="lead2">Ma trận vuông A là <b>đối xứng</b> khi ${k('A = A^T')} (đối xứng qua đường chéo chính):</p>
    ${K('A = \\begin{bmatrix} 1 & 2 & 3 \\\\ 2 & 5 & -1 \\\\ 3 & -1 & 4 \\end{bmatrix}')}
    <p class="note">Là <b>phản đối xứng</b> (skew-symmetric) khi ${k('A = -A^T')} — bắt buộc đường chéo toàn 0:</p>
    ${K('B = \\begin{bmatrix} 0 & 2 & -3 \\\\ -2 & 0 & 1 \\\\ 3 & -1 & 0 \\end{bmatrix}')}` },

  { t: 'Matrix times vector · Ax là gì', body: `
    <p class="lead2">Với A cỡ m×n và vector ${k('\\mathbf{x}')} có n phần tử, ${k('A\\mathbf{x}')} là <b>tổ hợp tuyến tính các cột</b> của A:</p>
    ${K('A\\mathbf{x} = \\begin{bmatrix} \\mathbf{a}_1 & \\mathbf{a}_2 & \\mathbf{a}_3 \\end{bmatrix}\\begin{bmatrix} x_1 \\\\ x_2 \\\\ x_3 \\end{bmatrix} = x_1\\mathbf{a}_1 + x_2\\mathbf{a}_2 + x_3\\mathbf{a}_3')}
    <div class="box ok">Mỗi ${k('x_i')} là <b>hệ số</b> đứng trước cột ${k('\\mathbf{a}_i')} — không phải nhân từng phần tử tuỳ ý.</div>` },

  { t: 'Ax = b · Hệ phương trình dạng ma trận', body: `
    <p class="lead2">Hệ tuyến tính m phương trình, n ẩn viết gọn thành một phương trình ma trận:</p>
    ${K('\\begin{bmatrix} 2 & 1 & -1 \\\\ -3 & -1 & 2 \\\\ -2 & 1 & 2 \\end{bmatrix}\\begin{bmatrix} x \\\\ y \\\\ z \\end{bmatrix} = \\begin{bmatrix} 8 \\\\ -11 \\\\ -3 \\end{bmatrix}')}
    <p class="note">Chính là ${k('A\\mathbf{x} = \\mathbf{b}')} — giải hệ ⇔ tìm hệ số tổ hợp các cột của A để ra được ${k('\\mathbf{b}')}.</p>` },

  { t: 'Matrix multiplication · Nhân hai ma trận AB', body: `
    <p class="lead2">A cỡ m×n, B cỡ n×p — nhân được <b>chỉ khi</b> số cột A = số hàng B; kết quả AB cỡ m×p:</p>
    ${K('(AB)_{ij} = \\sum_{k=1}^{n} a_{ik} b_{kj}')}
    <p class="note">Phần tử hàng i, cột j của AB = hàng i của A "nhân điểm" với cột j của B.</p>
    <div class="box warn">A(m×n) · B(p×q) chỉ hợp lệ khi ${k('n = p')} — sai điều kiện này là <b>không nhân được</b>, không phải nhân sai.</div>` },

  { t: 'Worked example · Ví dụ nhân ma trận từng bước', body: `
    ${K('A = \\begin{bmatrix} 1 & 2 & 0 \\\\ -1 & 3 & 4 \\end{bmatrix}, \\quad B = \\begin{bmatrix} 2 & 1 \\\\ 0 & 3 \\\\ -1 & 2 \\end{bmatrix}')}
    <div class="steps">
      <div><span class="n">1</span> Kiểm cỡ: A là 2×3, B là 3×2 — số cột A = số hàng B = 3 ⇒ nhân được, AB cỡ 2×2</div>
      <div><span class="n">2</span> Hàng 1 A · cột 1 B: ${k('1(2) + 2(0) + 0(-1) = 2')}</div>
      <div><span class="n">3</span> Hàng 1 A · cột 2 B: ${k('1(1) + 2(3) + 0(2) = 7')}</div>
      <div><span class="n">4</span> Hàng 2 A · cột 1 B, cột 2 B: ${k('-2 + 0 - 4 = -6')}; ${k('-1 + 9 + 8 = 16')}</div>
    </div>
    <div class="box ok">${k('AB = \\begin{bmatrix} 2 & 7 \\\\ -6 & 16 \\end{bmatrix}')}</div>` },

  { t: 'Properties of multiplication · Tính chất phép nhân', body: `
    <ol class="big">
      <li><b>Kết hợp:</b> ${k('(AB)C = A(BC)')}</li>
      <li><b>Phân phối:</b> ${k('A(B+C) = AB + AC')}</li>
      <li><b>Không giao hoán:</b> nói chung ${k('AB \\neq BA')}</li>
    </ol>
    <p class="note">Phản ví dụ: ${k('A = \\begin{bmatrix} 1 & 1 \\\\ 0 & 1 \\end{bmatrix}')}, ${k('B = \\begin{bmatrix} 1 & 0 \\\\ 1 & 1 \\end{bmatrix}')}</p>
    <div class="box warn">${k('AB = \\begin{bmatrix} 2 & 1 \\\\ 1 & 1 \\end{bmatrix}')} nhưng ${k('BA = \\begin{bmatrix} 1 & 1 \\\\ 1 & 2 \\end{bmatrix}')} — <b>khác nhau!</b></div>` },

  { t: 'Matrix transformations · Biến đổi ma trận trong R²', body: `
    <p class="lead2">Ánh xạ ${k('T(\\mathbf{x}) = A\\mathbf{x}')} biến mỗi điểm ${k('\\mathbf{x} \\in \\mathbb{R}^2')} thành điểm mới — ma trận A quyết định loại biến đổi:</p>
    <table class="t">
      <tr><th>Biến đổi</th><th>Ma trận A</th></tr>
      <tr><td>Quay góc θ</td><td class="hl">${k('\\begin{bmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{bmatrix}')}</td></tr>
      <tr><td>Đối xứng qua trục Ox</td><td class="hl">${k('\\begin{bmatrix} 1 & 0 \\\\ 0 & -1 \\end{bmatrix}')}</td></tr>
      <tr><td>Co giãn hệ số k</td><td class="hl">${k('\\begin{bmatrix} k & 0 \\\\ 0 & k \\end{bmatrix}')}</td></tr>
      <tr><td>Chiếu lên trục Ox</td><td class="hl">${k('\\begin{bmatrix} 1 & 0 \\\\ 0 & 0 \\end{bmatrix}')}</td></tr>
    </table>` },

  { t: 'Rotation example · Ví dụ ma trận quay', body: `
    <p class="lead2">Quay góc θ ngược chiều kim đồng hồ quanh gốc toạ độ:</p>
    ${K('R_\\theta = \\begin{bmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{bmatrix}')}
    <p class="note">Với ${k('\\theta = 90^\\circ')}: ${k('\\cos 90^\\circ = 0, \\sin 90^\\circ = 1')}</p>
    ${K('R_{90^\\circ}\\begin{bmatrix} 1 \\\\ 0 \\end{bmatrix} = \\begin{bmatrix} 0 & -1 \\\\ 1 & 0 \\end{bmatrix}\\begin{bmatrix} 1 \\\\ 0 \\end{bmatrix} = \\begin{bmatrix} 0 \\\\ 1 \\end{bmatrix}')}
    <div class="box ok">Điểm (1,0) quay 90° thành (0,1) — đúng như hình học.</div>` },

  { t: 'Inverse matrix · Ma trận nghịch đảo A⁻¹', body: `
    <p class="lead2">Với A vuông cỡ n×n, nghịch đảo ${k('A^{-1}')} (nếu có) thoả:</p>
    ${K('AA^{-1} = A^{-1}A = I_n')}
    <p class="note">A <b>khả nghịch</b> (invertible) khi ${k('\\det(A) \\neq 0')}; ngược lại gọi là <b>suy biến</b> (singular) — không có nghịch đảo.</p>
    <div class="box ok">Chỉ ma trận <b>vuông</b> mới có thể có nghịch đảo — ma trận m×n với m≠n thì không.</div>` },

  { t: 'Gauss-Jordan for A⁻¹ · Tìm nghịch đảo bằng Gauss-Jordan', body: `
    <p class="lead2">Ghép A với ma trận đơn vị I, khử hàng đưa nửa trái về I:</p>
    ${K('[A \\mid I] \\xrightarrow{\\text{khử hàng}} [I \\mid A^{-1}]')}
    <div class="steps">
      <div><span class="n">1</span> Ví dụ ${k('A = \\begin{bmatrix} 2 & 1 \\\\ 1 & 1 \\end{bmatrix}')}, ghép ${k('[A \\mid I] = \\begin{bmatrix} 2 & 1 & 1 & 0 \\\\ 1 & 1 & 0 & 1 \\end{bmatrix}')}</div>
      <div><span class="n">2</span> ${k('R_1 \\leftrightarrow R_2')} rồi ${k('R_2 \\to R_2 - 2R_1')} ⇒ ${k('\\begin{bmatrix} 1 & 1 & 0 & 1 \\\\ 0 & -1 & 1 & -2 \\end{bmatrix}')}</div>
      <div><span class="n">3</span> ${k('R_2 \\to -R_2')} rồi ${k('R_1 \\to R_1 - R_2')} ⇒ nửa trái thành I</div>
      <div><span class="n">4</span> Đọc kết quả: ${k('A^{-1} = \\begin{bmatrix} 1 & -1 \\\\ -1 & 2 \\end{bmatrix}')}</div>
    </div>` },

  { t: 'Shortcut for 2×2 · Công thức nhanh nghịch đảo 2×2', body: `
    <p class="lead2">Với ${k('A = \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}')}, nếu ${k('ad - bc \\neq 0')}:</p>
    ${K('A^{-1} = \\frac{1}{ad-bc}\\begin{bmatrix} d & -b \\\\ -c & a \\end{bmatrix}')}
    <p class="note">Đổi chỗ a↔d, đổi dấu b, c, chia cho định thức ${k('ad-bc')}.</p>
    <div class="box ok">Tính chất tích nghịch đảo: ${k('(AB)^{-1} = B^{-1}A^{-1}')} — thứ tự <b>đảo ngược</b>, giống chuyển vị.</div>` },

  { t: 'Summary · Tổng kết chương 6', body: `
    <ol class="big">
      <li>Ma trận m×n, phần tử ${k('a_{ij}')}; cộng/nhân vô hướng theo từng phần tử, chuyển vị đổi hàng-cột</li>
      <li>${k('A\\mathbf{x}')} là tổ hợp tuyến tính các cột của A ⇒ hệ ${k('A\\mathbf{x}=\\mathbf{b}')}</li>
      <li>AB cần số cột A = số hàng B; kết hợp &amp; phân phối đúng, nhưng ${k('AB \\neq BA')}</li>
      <li>${k('T(\\mathbf{x})=A\\mathbf{x}')} trong ${k('\\mathbb{R}^2')}: quay, đối xứng, co giãn, chiếu — mỗi loại một ma trận chuẩn</li>
      <li>${k('A^{-1}')} tồn tại khi A vuông và ${k('\\det(A)\\neq 0')}; tìm bằng Gauss-Jordan ${k('[A|I]\\to[I|A^{-1}]')}, và ${k('(AB)^{-1}=B^{-1}A^{-1}')}</li>
    </ol>` },
];
