/** MAE101 · Deck mae9 — Chapter 9: Vector Spaces — Basis & Dimension. Slide data (rendered by _render-slides.mjs). */
export const deck = { key: 'mae9', code: 'MAE9', title: 'Chapter 9 — Vector Spaces: Basis & Dimension', sub: 'MAE101 · Mathematics for Engineering' };

// k('latex')  -> công thức inline ; K('latex') -> công thức lớn giữa slide
const k = (s) => `<span class="tex">${s}</span>`;
const K = (s) => `<div class="texbig">${s}</div>`;

export const slides = [
  { kind: 'cover', t: 'Chapter 9 — Vector Spaces', sub: 'Không gian vector: Cơ sở & Số chiều',
    body: `<p class="cov-meta">MAE101 · Mathematics for Engineering<br/>Nicholson — <i>Linear Algebra with Applications</i>, Ch. 5-6</p>` },

  { t: 'Contents · Nội dung chương', body: `
    <ol class="toc">
      <li>Không gian con (subspace) của ${k('\\mathbb{R}^n')}</li>
      <li>Tổ hợp tuyến tính &amp; tập sinh (span)</li>
      <li>Độc lập tuyến tính</li>
      <li>Cơ sở (basis) &amp; số chiều (dimension)</li>
      <li>Trực giao, trực chuẩn &amp; hạng ma trận (rank)</li>
      <li>Nullity &amp; định lý hạng-nullity</li>
    </ol>` },

  { t: 'Subspaces · Không gian con của Rⁿ', body: `
    <p class="lead2">Tập con ${k('W \\subseteq \\mathbb{R}^n')} là <b>không gian con</b> nếu thoả cả 3 điều kiện:</p>
    <ol class="big">
      <li><b>Chứa vector 0:</b> ${k('\\vec{0} \\in W')}</li>
      <li><b>Đóng với cộng:</b> ${k('\\vec{u}, \\vec{v} \\in W \\Rightarrow \\vec{u}+\\vec{v} \\in W')}</li>
      <li><b>Đóng với nhân vô hướng:</b> ${k('\\vec{u} \\in W, c \\in \\mathbb{R} \\Rightarrow c\\vec{u} \\in W')}</li>
    </ol>
    <div class="box ok">Thiếu một điều kiện ⇒ không phải không gian con. Chỉ cần một phản ví dụ để bác bỏ.</div>` },

  { t: 'Worked example · Kiểm tra tập có phải không gian con', body: `
    <p class="lead2">Xét ${k('W = \\{(x,y,z) : x + 2y - z = 0\\} \\subset \\mathbb{R}^3')}:</p>
    <div class="steps">
      <div><span class="n">1</span> ${k('(0,0,0)')}: ${k('0+0-0=0')} ✓ ⇒ chứa 0</div>
      <div><span class="n">2</span> Lấy ${k('\\vec{u},\\vec{v} \\in W')} ⇒ tổng từng thành phần vẫn thoả phương trình tuyến tính thuần nhất ⇒ đóng với cộng</div>
      <div><span class="n">3</span> ${k('c\\vec{u}')} cũng thoả (nhân cả hai vế với ${k('c')}) ⇒ đóng với nhân vô hướng</div>
      <div><span class="n">4</span> Cả 3 điều kiện đúng ⇒ ${k('W')} là không gian con</div>
    </div>
    <p class="note">Ghi nhớ: mọi phương trình tuyến tính <b>thuần nhất</b> (vế phải = 0) định nghĩa một không gian con.</p>` },

  { t: 'Linear combination & span · Tổ hợp tuyến tính & tập sinh', body: `
    <p class="lead2">Tổ hợp tuyến tính của ${k('v_1, \\ldots, v_k')}:</p>
    ${K('c_1 v_1 + c_2 v_2 + \\cdots + c_k v_k,  c_i \\in \\mathbb{R}')}
    <p class="note"><b>Tập sinh (span)</b> là tập hợp tất cả tổ hợp tuyến tính có thể:</p>
    ${K('\\text{span}\\{v_1,\\ldots,v_k\\} = \\{c_1v_1+\\cdots+c_kv_k : c_i \\in \\mathbb{R}\\}')}
    <div class="box">${k('\\text{span}\\{v_1,\\ldots,v_k\\}')} luôn là một <b>không gian con</b>.</div>` },

  { t: 'Worked example · Span của 2 vector trong R³ là mặt phẳng', body: `
    <p class="lead2">Cho ${k('v_1=(1,0,1)')}, ${k('v_2=(0,1,1)')} trong ${k('\\mathbb{R}^3')}:</p>
    <div class="steps">
      <div><span class="n">1</span> ${k('\\text{span}\\{v_1,v_2\\} = \\{c_1v_1+c_2v_2\\} = (c_1, c_2, c_1+c_2)')}</div>
      <div><span class="n">2</span> Đặt ${k('x=c_1, y=c_2, z=c_1+c_2')} ⇒ khử ${k('c_1,c_2')} ⇒ ${k('z = x+y')}</div>
      <div><span class="n">3</span> Đây là phương trình một <b>mặt phẳng</b> qua gốc toạ độ trong ${k('\\mathbb{R}^3')}</div>
      <div><span class="n">4</span> 2 vector không cùng phương ⇒ span là mặt phẳng (2 chiều), không phải cả không gian</div>
    </div>` },

  { t: 'Linear independence · Độc lập tuyến tính', body: `
    <p class="lead2">Tập ${k('\\{v_1,\\ldots,v_k\\}')} <b>độc lập tuyến tính</b> nếu phương trình sau:</p>
    ${K('c_1v_1 + c_2v_2 + \\cdots + c_kv_k = \\vec{0}')}
    <p class="note">chỉ có <b>nghiệm tầm thường</b> ${k('c_1=c_2=\\cdots=c_k=0')}.</p>
    <div class="box warn">Nếu có nghiệm khác 0 ⇒ <b>phụ thuộc tuyến tính</b> — ít nhất một vector viết được qua các vector còn lại.</div>` },

  { t: 'Testing independence · Kiểm bằng ma trận & khử Gauss', body: `
    <p class="lead2">Xếp ${k('v_1,\\ldots,v_k')} làm cột của ma trận ${k('A')}, giải ${k('A\\vec{c}=\\vec{0}')}:</p>
    <div class="steps">
      <div><span class="n">1</span> Lập ma trận ${k('A = [v_1 | v_2 | \\cdots | v_k]')}</div>
      <div><span class="n">2</span> Khử Gauss về dạng bậc thang</div>
      <div><span class="n">3</span> Đủ ${k('k')} pivot (không cột nào tự do) ⇒ <b>độc lập</b></div>
      <div><span class="n">4</span> Có cột không pivot (biến tự do) ⇒ <b>phụ thuộc</b></div>
    </div>
    <p class="note">Ví dụ: ${k('v_1=(1,2)')}, ${k('v_2=(2,4)')} ⇒ cột 2 = 2×cột 1 ⇒ thiếu pivot ⇒ phụ thuộc.</p>` },

  { t: 'Basis · Cơ sở của không gian vector', body: `
    <p class="lead2"><b>Cơ sở</b> của không gian ${k('V')} là tập ${k('\\{v_1,\\ldots,v_k\\}')} thoả đồng thời:</p>
    <ol class="big">
      <li><b>Tập sinh:</b> ${k('\\text{span}\\{v_1,\\ldots,v_k\\} = V')}</li>
      <li><b>Độc lập tuyến tính</b></li>
    </ol>
    <p class="note">Cơ sở chuẩn (standard basis) của ${k('\\mathbb{R}^3')}:</p>
    ${K('e_1=(1,0,0),  e_2=(0,1,0),  e_3=(0,0,1)')}` },

  { t: 'Dimension · Số chiều', body: `
    <p class="lead2"><b>Định lý:</b> mọi cơ sở của cùng một không gian ${k('V')} có <b>cùng số phần tử</b>.</p>
    <div class="box ok">Số phần tử đó gọi là <b>số chiều</b> ${k('\\dim(V)')} — bất biến, không phụ thuộc cách chọn cơ sở.</div>
    ${K('\\dim(\\mathbb{R}^n) = n')}
    <p class="note">Ví dụ: ${k('\\dim(\\mathbb{R}^3) = 3')} vì cơ sở chuẩn ${k('\\{e_1,e_2,e_3\\}')} có 3 vector.</p>` },

  { t: 'Finding a basis · Tìm cơ sở & số chiều của không gian con', body: `
    <p class="lead2">Quy trình tìm cơ sở của ${k('W = \\text{span}\\{v_1,\\ldots,v_k\\}}')}:</p>
    <div class="steps">
      <div><span class="n">1</span> Xếp ${k('v_i')} làm hàng (hoặc cột) ma trận, khử Gauss về bậc thang</div>
      <div><span class="n">2</span> Các hàng khác 0 sau khử (hoặc vector gốc ứng cột pivot) là <b>độc lập</b></div>
      <div><span class="n">3</span> Chọn đúng các vector đó làm <b>cơ sở</b> của ${k('W')}</div>
      <div><span class="n">4</span> ${k('\\dim(W)')} = số vector trong cơ sở = số pivot</div>
    </div>` },

  { t: 'Dot product, length & distance in Rⁿ · Mở rộng n chiều', body: `
    <p class="lead2">Với ${k('\\vec{u},\\vec{v} \\in \\mathbb{R}^n')}, tích vô hướng:</p>
    ${K('\\vec{u} \\cdot \\vec{v} = u_1v_1 + u_2v_2 + \\cdots + u_nv_n')}
    <div class="two">
      <div><p class="nh">Độ dài (norm)</p>${K('\\|\\vec{u}\\| = \\sqrt{\\vec{u}\\cdot\\vec{u}}')}</div>
      <div><p class="nh">Khoảng cách</p>${K('d(\\vec{u},\\vec{v}) = \\|\\vec{u}-\\vec{v}\\|')}</div>
    </div>` },

  { t: 'Orthogonal & orthonormal sets · Trực giao & trực chuẩn', body: `
    <p class="lead2">Tập ${k('\\{v_1,\\ldots,v_k\\}')} <b>trực giao</b> nếu:</p>
    ${K('v_i \\cdot v_j = 0  \\text{ với mọi } i \\neq j')}
    <div class="grid2">
      <div class="f"><b>Trực chuẩn (orthonormal)</b><p>Trực giao + mỗi vector có ${k('\\|v_i\\|=1')}</p></div>
      <div class="f"><b>Định lý khai triển</b><p>Cơ sở trực giao ⇒ toạ độ của ${k('\\vec{x}')} là ${k('\\frac{\\vec{x}\\cdot v_i}{v_i\\cdot v_i}')}, không cần giải hệ</p></div>
    </div>` },

  { t: 'Rank of a matrix · Hạng ma trận', body: `
    <p class="lead2"><b>Hạng</b> ${k('\\text{rank}(A)')} = số hàng khác 0 sau khi đưa ${k('A')} về dạng bậc thang (REF) = số pivot.</p>
    <div class="two">
      <div><p class="nh">Row space</p><p>Không gian sinh bởi các hàng của ${k('A')}, số chiều = rank</p></div>
      <div><p class="nh">Column space</p><p>Không gian sinh bởi các cột của ${k('A')}, cùng số chiều = rank</p></div>
    </div>
    <div class="box ok">Row space và Column space luôn có <b>cùng số chiều</b>, dù nói chung khác không gian nhau.</div>` },

  { t: 'Worked example · Tìm hạng & cơ sở row/column space', body: `
    ${K('A = \\begin{bmatrix} 1 & 2 & 1 \\\\ 2 & 4 & 3 \\\\ 3 & 6 & 4 \\end{bmatrix}')}
    <div class="steps">
      <div><span class="n">1</span> ${k('R_2 \\to R_2 - 2R_1,  R_3 \\to R_3 - 3R_1')} ⇒ hàng 2, 3 còn ${k('(0,0,1)')}, ${k('(0,0,1)')}</div>
      <div><span class="n">2</span> ${k('R_3 \\to R_3 - R_2')} ⇒ hàng cuối toàn 0</div>
      <div><span class="n">3</span> Còn 2 hàng khác 0 ⇒ ${k('\\text{rank}(A) = 2')}</div>
      <div><span class="n">4</span> Cơ sở row space: 2 hàng khác 0 sau khử; cơ sở column space: cột 1, cột 3 của ${k('A')} gốc (cột có pivot)</div>
    </div>` },

  { t: 'Nullity & rank-nullity theorem · Định lý hạng-nullity', body: `
    <p class="lead2"><b>Nullity</b> ${k('\\text{nullity}(A)')} = số chiều nghiệm của ${k('A\\vec{x}=\\vec{0}')} = số biến tự do.</p>
    ${K('\\text{rank}(A) + \\text{nullity}(A) = n')}
    <p class="note">với ${k('n')} = số cột của ${k('A')} (số ẩn).</p>
    <div class="box">Ví dụ ma trận ${k('3\\times3')} có ${k('\\text{rank}=2')} ⇒ ${k('\\text{nullity} = 3-2 = 1')} biến tự do.</div>` },

  { t: 'Summary · Tổng kết chương 9', body: `
    <table class="t big2">
      <tr><th>Tình huống (n ẩn)</th><th>Hệ quả</th></tr>
      <tr><td>${k('\\text{rank}(A) = n')}</td><td class="hl">Nullity = 0 — chỉ nghiệm tầm thường (thuần nhất)</td></tr>
      <tr><td>${k('\\text{rank}(A) < n')}</td><td class="hl">Nullity &gt; 0 — có nghiệm khác 0, vô số nghiệm</td></tr>
      <tr><td>Cột độc lập tuyến tính</td><td class="hl">Cột là cơ sở của column space, số chiều = rank</td></tr>
    </table>
    <p class="note">Cơ sở = tập sinh + độc lập tuyến tính; số chiều là bất biến của không gian, đo bằng số pivot khi khử Gauss.</p>` },
];
