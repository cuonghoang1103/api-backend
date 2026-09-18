/** MAE101 · Deck mae7 — Chapter 7: Determinants & Eigenvalues. Slide data (rendered by _render-slides.mjs). */
export const deck = { key: 'mae7', code: 'MAE7', title: 'Chapter 7 — Determinants & Eigenvalues', sub: 'MAE101 · Mathematics for Engineering' };

// k('latex')  -> công thức inline ; K('latex') -> công thức lớn giữa slide
const k = (s) => `<span class="tex">${s}</span>`;
const K = (s) => `<div class="texbig">${s}</div>`;

export const slides = [
  { kind: 'cover', t: 'Chapter 7 — Determinants & Eigenvalues', sub: 'Định thức, Nghịch đảo & Trị riêng',
    body: `<p class="cov-meta">MAE101 · Mathematics for Engineering<br/>Nicholson — <i>Linear Algebra with Applications</i>, Ch. 3 &amp; 5</p>` },

  { t: 'Contents · Nội dung chương', body: `
    <ol class="toc">
      <li>Định thức 2×2, 3×3 — khai triển cofactor &amp; quy tắc Sarrus</li>
      <li>Tính chất định thức &amp; tính nhanh bằng biến đổi hàng</li>
      <li>Định thức &amp; tính khả nghịch của ma trận</li>
      <li>Ma trận phụ hợp (adjugate) &amp; công thức nghịch đảo</li>
      <li>Quy tắc Cramer giải hệ phương trình</li>
      <li>Trị riêng, vector riêng &amp; chéo hoá ma trận</li>
    </ol>` },

  { t: 'Determinant 2×2 · Định thức ma trận 2×2', body: `
    <p class="lead2">Với ma trận vuông cấp 2, định thức là một số vô hướng:</p>
    ${K('\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix} = ad - bc')}
    <div class="box">Ý nghĩa hình học: ${k('|\\det A|')} bằng <b>diện tích</b> hình bình hành tạo bởi hai vector hàng (hoặc cột) của A.</div>
    <p class="note">${k('\\det A = 0')} ⟺ hai vector đó <b>song song / cùng phương</b> — hình bình hành suy biến thành đoạn thẳng.</p>` },

  { t: 'Minors & cofactors · Phần bù đại số & cofactor', body: `
    <p class="lead2">Minor ${k('M_{ij}')}: định thức con khi bỏ hàng ${k('i')}, cột ${k('j')} của A.</p>
    ${K('C_{ij} = (-1)^{i+j} M_{ij}')}
    <p class="nh">Bảng dấu ${k('(-1)^{i+j}')} cho ma trận 3×3:</p>
    ${K('\\begin{bmatrix} + & - & + \\\\ - & + & - \\\\ + & - & + \\end{bmatrix}')}
    <p class="note">Dấu xen kẽ theo kiểu bàn cờ, bắt đầu từ ${k('+')} ở vị trí (1,1).</p>` },

  { t: 'Cofactor expansion · Khai triển theo hàng/cột', body: `
    <p class="lead2">Định thức có thể khai triển theo <b>bất kỳ</b> hàng ${k('i')} hoặc cột ${k('j')} cố định:</p>
    ${K('\\det A = \\sum_{j=1}^{n} a_{ij} C_{ij} = \\sum_{i=1}^{n} a_{ij} C_{ij}')}
    <div class="box ok">Kết quả <b>giống nhau</b> dù chọn khai triển theo hàng/cột nào — nên chọn hàng/cột có nhiều số 0 để tính nhanh.</div>` },

  { t: 'Worked example · Ví dụ khai triển cofactor 3×3', body: `
    ${K('A = \\begin{bmatrix} 1 & 2 & 3 \\\\ 0 & 4 & 5 \\\\ 1 & 0 & 6 \\end{bmatrix}')}
    <div class="steps">
      <div><span class="n">1</span> Khai triển theo hàng 1: ${k('\\det A = 1 \\cdot C_{11} + 2 \\cdot C_{12} + 3 \\cdot C_{13}')}</div>
      <div><span class="n">2</span> ${k('C_{11} = \\begin{vmatrix} 4 & 5 \\\\ 0 & 6 \\end{vmatrix} = 24,  C_{12} = -\\begin{vmatrix} 0 & 5 \\\\ 1 & 6 \\end{vmatrix} = 5')}</div>
      <div><span class="n">3</span> ${k('C_{13} = \\begin{vmatrix} 0 & 4 \\\\ 1 & 0 \\end{vmatrix} = -4')}</div>
      <div><span class="n">4</span> ${k('\\det A = 1(24) + 2(5) + 3(-4) = 22')}</div>
    </div>` },

  { t: 'Sarrus rule · Quy tắc Sarrus cho 3×3', body: `
    <p class="lead2">Cách nhanh, không cần cofactor, chỉ áp dụng cho ma trận <b>3×3</b>:</p>
    ${K('\\det A = a_{11}a_{22}a_{33} + a_{12}a_{23}a_{31} + a_{13}a_{21}a_{32} - a_{13}a_{22}a_{31} - a_{11}a_{23}a_{32} - a_{12}a_{21}a_{33}')}
    <p class="note">Nhân theo 3 đường chéo <b>xuôi</b> (cộng) và 3 đường chéo <b>ngược</b> (trừ), kể cả phần "vòng qua" cạnh ma trận.</p>
    <div class="box warn">Chỉ đúng cho <b>3×3</b> — với ${k('n \\geq 4')} phải dùng khai triển cofactor hoặc biến đổi hàng.</div>` },

  { t: 'Properties of determinants · Tính chất định thức', body: `
    <div class="grid2">
      <div class="f"><b>Chuyển vị</b><p>${k('\\det(A^T) = \\det A')}</p></div>
      <div class="f"><b>Đổi 2 hàng</b><p>Định thức <b>đổi dấu</b></p></div>
      <div class="f"><b>2 hàng tỉ lệ</b><p>${k('\\det A = 0')}</p></div>
      <div class="f"><b>Nhân 1 hàng với k</b><p>${k('\\det A')} nhân thêm hệ số ${k('k')}</p></div>
    </div>
    <p class="note">Các tính chất này đúng tương tự cho <b>cột</b> thay vì hàng.</p>` },

  { t: 'Product & triangular rules · Tích & ma trận tam giác', body: `
    ${K('\\det(AB) = \\det A \\cdot \\det B')}
    <p class="lead2">Suy ra nếu A khả nghịch:</p>
    ${K('\\det(A^{-1}) = \\frac{1}{\\det A}')}
    <div class="box ok">Ma trận <b>tam giác</b> (trên hoặc dưới): định thức bằng <b>tích các phần tử trên đường chéo chính</b>.</div>` },

  { t: 'Determinant via row reduction · Tính nhanh bằng biến đổi hàng', body: `
    <p class="lead2">Đưa A về dạng tam giác trên bằng phép <b>cộng hàng</b> (không đổi det), rồi lấy tích đường chéo:</p>
    ${K('A = \\begin{bmatrix} 1 & 2 & 3 \\\\ 2 & 5 & 3 \\\\ 1 & 0 & 8 \\end{bmatrix}')}
    <div class="steps">
      <div><span class="n">1</span> ${k('R_2 \\to R_2 - 2R_1,  R_3 \\to R_3 - R_1')} ⇒ ${k('\\begin{bmatrix} 1 & 2 & 3 \\\\ 0 & 1 & -3 \\\\ 0 & -2 & 5 \\end{bmatrix}')}</div>
      <div><span class="n">2</span> ${k('R_3 \\to R_3 + 2R_2')} ⇒ ${k('\\begin{bmatrix} 1 & 2 & 3 \\\\ 0 & 1 & -3 \\\\ 0 & 0 & -1 \\end{bmatrix}')}</div>
      <div><span class="n">3</span> Chỉ dùng phép cộng hàng (không đổi chỗ, không nhân hệ số) ⇒ ${k('\\det A = 1 \\cdot 1 \\cdot (-1) = -1')}</div>
    </div>` },

  { t: 'Determinant & invertibility · Định thức & khả nghịch', body: `
    <p class="lead2">Định lý trung tâm của chương:</p>
    ${K('A \\text{ khả nghịch} \\iff \\det A \\neq 0')}
    <div class="box warn">${k('\\det A = 0')}: A <b>suy biến</b> (singular) — không có nghịch đảo, hệ ${k('Ax=0')} có nghiệm khác 0.</div>
    <p class="note">Đây chính là điều kiện dùng để kiểm tra nhanh một ma trận có nghịch đảo được hay không, không cần khử Gauss.</p>` },

  { t: 'Adjugate matrix · Ma trận phụ hợp & công thức nghịch đảo', body: `
    <p class="lead2">adj(A) = <b>chuyển vị</b> của ma trận cofactor. Công thức nghịch đảo:</p>
    ${K('A^{-1} = \\frac{1}{\\det A} \\, \\mathrm{adj}(A)')}
    <div class="two">
      <div><p class="nh">Ví dụ</p>${k('A = \\begin{bmatrix} 1 & 2 & 3 \\\\ 0 & 1 & 4 \\\\ 5 & 6 & 0 \\end{bmatrix},  \\det A = 1')}</div>
      <div><p class="nh">Tính cofactor từng phần tử rồi chuyển vị</p>${k('A^{-1} = \\begin{bmatrix} -24 & 18 & 5 \\\\ 20 & -15 & -4 \\\\ -5 & 4 & 1 \\end{bmatrix}')}</div>
    </div>` },

  { t: "Cramer's rule · Quy tắc Cramer", body: `
    <p class="lead2">Với hệ ${k('Ax=b')} vuông, ${k('n')} ẩn, ${k('\\det A \\neq 0')}:</p>
    ${K('x_i = \\frac{\\det(A_i)}{\\det A}')}
    <p class="note">${k('A_i')} là A với <b>cột thứ i</b> thay bằng vector ${k('b')}.</p>
    <div class="box warn">Chỉ áp dụng khi ${k('\\det A \\neq 0')} (nghiệm duy nhất) — và chỉ hiệu quả với hệ <b>nhỏ</b>, vì mỗi ẩn cần tính một định thức riêng.</div>` },

  { t: 'Worked example · Giải hệ 3 ẩn bằng Cramer', body: `
    ${K('\\begin{cases} 2x + y - z = 8 \\\\ -3x - y + 2z = -11 \\\\ -2x + y + 2z = -3 \\end{cases}')}
    <div class="steps">
      <div><span class="n">1</span> ${k('\\det A = -1')} (khai triển cofactor)</div>
      <div><span class="n">2</span> Thay cột 1 bằng b: ${k('\\det A_1 = -2 \\Rightarrow x = \\frac{-2}{-1} = 2')}</div>
      <div><span class="n">3</span> Thay cột 2 bằng b: ${k('\\det A_2 = -3 \\Rightarrow y = \\frac{-3}{-1} = 3')}</div>
      <div><span class="n">4</span> Thay cột 3 bằng b: ${k('\\det A_3 = 1 \\Rightarrow z = \\frac{1}{-1} = -1')}</div>
    </div>
    <div class="box ok">Nghiệm ${k('(x,y,z) = (2, 3, -1)')} — khớp với kết quả khử Gauss ở Chương 5.</div>` },

  { t: 'Eigenvalues & eigenvectors · Trị riêng & vector riêng', body: `
    <p class="lead2">Với ma trận vuông A, ${k('\\lambda')} là <b>trị riêng</b> và ${k('x \\neq 0')} là <b>vector riêng</b> tương ứng nếu:</p>
    ${K('Ax = \\lambda x')}
    <p class="note">Đưa về ${k('(A - \\lambda I)x = 0')} — có nghiệm khác 0 ⟺ ma trận ${k('A-\\lambda I')} suy biến:</p>
    <div class="box">Phương trình đặc trưng: ${k('\\det(A - \\lambda I) = 0')}</div>` },

  { t: 'Worked example · Tìm trị riêng & vector riêng 2×2', body: `
    ${K('A = \\begin{bmatrix} 4 & 1 \\\\ 2 & 3 \\end{bmatrix}')}
    <div class="steps">
      <div><span class="n">1</span> ${k('\\det(A-\\lambda I) = (4-\\lambda)(3-\\lambda) - 2 = \\lambda^2 - 7\\lambda + 10 = 0')}</div>
      <div><span class="n">2</span> ${k('\\lambda_1 = 5,  \\lambda_2 = 2')}</div>
      <div><span class="n">3</span> ${k('\\lambda_1=5')}: ${k('(A-5I)x=0 \\Rightarrow -x_1+x_2=0')} ⇒ vector riêng ${k('(1,1)')}</div>
      <div><span class="n">4</span> ${k('\\lambda_2=2')}: ${k('(A-2I)x=0 \\Rightarrow 2x_1+x_2=0')} ⇒ vector riêng ${k('(1,-2)')}</div>
    </div>` },

  { t: 'Summary · Chéo hoá & tổng kết chương 7', body: `
    <p class="lead2">Nếu A có ${k('n')} vector riêng <b>độc lập tuyến tính</b> ${k('x_1,\\ldots,x_n')} (với P là ma trận cột ${k('x_i')}, D là ma trận đường chéo ${k('\\lambda_i')}):</p>
    ${K('A = P D P^{-1}')}
    <ol class="big">
      <li>Định thức: khai triển cofactor / Sarrus (3×3) / biến đổi hàng</li>
      <li>${k('\\det A \\neq 0 \\iff')} A khả nghịch; nghịch đảo qua adjugate</li>
      <li>Cramer giải hệ vuông khi ${k('\\det A \\neq 0')}</li>
      <li>Trị riêng từ ${k('\\det(A-\\lambda I)=0')}; đủ vector riêng độc lập ⇒ chéo hoá được</li>
    </ol>` },
];
