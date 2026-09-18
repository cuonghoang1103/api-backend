/** MAE101 · Deck mae5 — Chapter 5: Linear Systems. Slide data (rendered by _render-slides.mjs). */
export const deck = { key: 'mae5', code: 'MAE5', title: 'Chapter 5 — Linear Systems', sub: 'MAE101 · Mathematics for Engineering' };

// k('latex')  -> công thức inline ; K('latex') -> công thức lớn giữa slide
const k = (s) => `<span class="tex">${s}</span>`;
const K = (s) => `<div class="texbig">${s}</div>`;

export const slides = [
  { kind: 'cover', t: 'Chapter 5 — Linear Systems', sub: 'Hệ phương trình tuyến tính · Khử Gauss & cấu trúc nghiệm',
    body: `<p class="cov-meta">MAE101 · Mathematics for Engineering<br/>Nicholson — <i>Linear Algebra with Applications</i>, Ch. 1</p>` },

  { t: 'Contents · Nội dung chương', body: `
    <ol class="toc">
      <li>Phương trình &amp; hệ phương trình tuyến tính — ý nghĩa hình học</li>
      <li>Ma trận hệ số &amp; ma trận bổ sung, ba phép biến đổi sơ cấp</li>
      <li>Dạng bậc thang &amp; dạng bậc thang rút gọn (RREF)</li>
      <li>Khử Gauss &amp; Gauss-Jordan</li>
      <li>Biến chính, biến tự do &amp; hệ thuần nhất</li>
    </ol>` },

  { t: 'Linear equations & systems · Phương trình & hệ tuyến tính', body: `
    <p class="lead2">Một phương trình tuyến tính n ẩn có dạng:</p>
    ${K('a_1 x_1 + a_2 x_2 + \\cdots + a_n x_n = b')}
    <p class="note">Hệ m phương trình, n ẩn là tập hợp m phương trình như vậy — <b>hệ số &amp; vế phải là hằng số</b>, ẩn chỉ xuất hiện bậc 1, không nhân chéo nhau.</p>
    <div class="box">Nghiệm là bộ ${k('(x_1, x_2, \\ldots, x_n)')} thoả <b>đồng thời</b> mọi phương trình.</div>` },

  { t: 'Geometric meaning · Ý nghĩa hình học (2 ẩn)', body: `
    <p class="lead2">Mỗi phương trình 2 ẩn là <b>một đường thẳng</b> trong mặt phẳng. Hệ 2 phương trình ⇒ giao của 2 đường thẳng:</p>
    <div class="grid3">
      <div class="card"><b>Cắt nhau</b><p>1 điểm chung — nghiệm duy nhất</p></div>
      <div class="card"><b>Song song</b><p>Không điểm chung — vô nghiệm</p></div>
      <div class="card"><b>Trùng nhau</b><p>Vô số điểm chung — vô số nghiệm</p></div>
    </div>
    <p class="note">3 ẩn: mỗi phương trình là <b>một mặt phẳng</b> — cùng logic, khó vẽ hơn.</p>` },

  { t: 'Number of solutions · Số nghiệm của hệ', body: `
    <p class="lead2">Định lý: mọi hệ phương trình tuyến tính chỉ rơi vào <b>đúng một</b> trong ba trường hợp:</p>
    <ol class="big">
      <li><b>Nghiệm duy nhất</b> (consistent, unique)</li>
      <li><b>Vô nghiệm</b> (inconsistent)</li>
      <li><b>Vô số nghiệm</b> (consistent, infinitely many)</li>
    </ol>
    <div class="box ok">Không bao giờ có "đúng 2 nghiệm" hay "đúng 5 nghiệm" — chỉ 3 khả năng trên.</div>` },

  { t: 'Coefficient & augmented matrix · Ma trận hệ số & bổ sung', body: `
    <p class="lead2">Hệ tuyến tính viết gọn bằng ma trận. Với hệ:</p>
    ${K('\\begin{cases} 2x + y - z = 8 \\\\ -3x - y + 2z = -11 \\\\ -2x + y + 2z = -3 \\end{cases}')}
    <div class="two">
      <div><p class="nh">Ma trận hệ số A</p>${K('\\begin{bmatrix} 2 & 1 & -1 \\\\ -3 & -1 & 2 \\\\ -2 & 1 & 2 \\end{bmatrix}')}</div>
      <div><p class="nh">Ma trận bổ sung [A|b]</p>${K('\\begin{bmatrix} 2 & 1 & -1 & 8 \\\\ -3 & -1 & 2 & -11 \\\\ -2 & 1 & 2 & -3 \\end{bmatrix}')}</div>
    </div>
    <p class="note">Cột cuối cùng là vế phải ${k('b')} — quy ước gọi đây là ma trận <b>bổ sung</b>.</p>` },

  { t: 'Elementary row operations · Ba phép biến đổi sơ cấp', body: `
    <p class="lead2">Biến đổi hàng trên ma trận bổ sung <b>không làm đổi tập nghiệm</b>:</p>
    <ol class="big">
      <li><b>Đổi chỗ</b> hai hàng: ${k('R_i \\leftrightarrow R_j')}</li>
      <li><b>Nhân</b> một hàng với hằng số khác 0: ${k('R_i \\to c R_i,  c \\neq 0')}</li>
      <li><b>Cộng</b> bội của hàng khác vào một hàng: ${k('R_i \\to R_i + c R_j')}</li>
    </ol>
    <div class="box ok">Hai ma trận bổ sung liên hệ bằng các phép trên là <b>tương đương hàng</b> — cùng nghiệm.</div>` },

  { t: 'Row echelon form · Dạng bậc thang (REF)', body: `
    <p class="lead2">Ma trận ở dạng bậc thang khi:</p>
    <ol class="big">
      <li>Hàng toàn số 0 nằm <b>dưới cùng</b></li>
      <li>Phần tử khác 0 đầu tiên mỗi hàng (<b>pivot</b>) nằm <b>bên phải</b> pivot của hàng trên</li>
      <li>Mọi phần tử <b>dưới</b> mỗi pivot đều bằng 0</li>
    </ol>
    ${K('\\begin{bmatrix} 1 & -1 & 2 & 3 \\\\ 0 & 2 & -1 & 4 \\\\ 0 & 0 & 3 & 6 \\end{bmatrix}')}` },

  { t: 'Reduced row echelon form · Dạng bậc thang rút gọn (RREF)', body: `
    <p class="lead2">RREF = bậc thang + thêm 2 điều kiện:</p>
    <ol class="big">
      <li>Mỗi <b>pivot bằng 1</b> (leading 1)</li>
      <li>Mỗi pivot là phần tử <b>khác 0 duy nhất</b> trong cột của nó (trên lẫn dưới đều 0)</li>
    </ol>
    ${K('\\begin{bmatrix} 1 & 0 & 0 & 2 \\\\ 0 & 1 & 0 & 3 \\\\ 0 & 0 & 1 & -1 \\end{bmatrix}')}
    <div class="box ok">RREF là dạng <b>duy nhất</b> của mỗi ma trận — cứ khử đúng thì mọi người ra cùng một RREF.</div>` },

  { t: 'Gaussian elimination · Quy trình khử Gauss', body: `
    <p class="lead2">Đưa ma trận bổ sung về dạng bậc thang, rồi giải bằng thế ngược:</p>
    <div class="steps">
      <div><span class="n">1</span> Chọn cột trái nhất còn khác 0, đưa phần tử khác 0 lên làm pivot</div>
      <div><span class="n">2</span> Dùng phép cộng hàng để triệt tiêu mọi phần tử <b>dưới</b> pivot</div>
      <div><span class="n">3</span> Lặp lại cho cột kế tiếp, hàng kế tiếp ⇒ dạng bậc thang</div>
      <div><span class="n">4</span> <b>Thế ngược</b> (back-substitution) từ hàng cuối lên hàng đầu</div>
    </div>` },

  { t: 'Worked example · Ví dụ khử Gauss từng bước', body: `
    ${K('\\begin{bmatrix} 2 & 1 & -1 & 8 \\\\ -3 & -1 & 2 & -11 \\\\ -2 & 1 & 2 & -3 \\end{bmatrix}')}
    <div class="steps">
      <div><span class="n">1</span> ${k('R_2 \\to R_2 + 1.5R_1,  R_3 \\to R_3 + R_1')} ⇒ triệt tiêu cột 1 dưới pivot</div>
      <div><span class="n">2</span> ${k('R_3 \\to R_3 - 4R_2')} ⇒ triệt tiêu cột 2 dưới pivot</div>
      <div><span class="n">3</span> Bậc thang: ${k('z = -1')} ở hàng cuối</div>
      <div><span class="n">4</span> Thế ngược: ${k('y = 3,  x = 2')}</div>
    </div>
    <div class="box ok">Nghiệm duy nhất: ${k('(x,y,z) = (2, 3, -1)')}</div>` },

  { t: 'Gauss-Jordan elimination · Khử Gauss-Jordan', body: `
    <p class="lead2">Khử tiếp từ bậc thang <b>lên trên</b> để triệt tiêu cả phần tử trên pivot ⇒ RREF trực tiếp:</p>
    ${K('\\begin{bmatrix} 1 & 0 & 0 & 2 \\\\ 0 & 1 & 0 & 3 \\\\ 0 & 0 & 1 & -1 \\end{bmatrix}')}
    <div class="box ok">Không cần thế ngược — <b>đọc thẳng</b> nghiệm từ cột cuối: ${k('x=2, y=3, z=-1')}.</div>
    <p class="note">Đổi lại: Gauss-Jordan tốn nhiều phép tính hơn Gauss + thế ngược.</p>` },

  { t: 'Pivot vs free variables · Biến chính & biến tự do', body: `
    <p class="lead2">Trong RREF: cột có pivot ⇒ <b>biến chính</b>; cột không có pivot ⇒ <b>biến tự do</b> (đặt tham số).</p>
    ${K('\\begin{bmatrix} 1 & 0 & 2 & 3 \\\\ 0 & 1 & -1 & 5 \\end{bmatrix}')}
    <div class="box">${k('x_1, x_2')} là biến chính; ${k('x_3 = t')} tự do. Nghiệm tổng quát: ${k('x_1 = 3-2t,  x_2 = 5+t,  x_3 = t,  t \\in \\mathbb{R}')}</div>` },

  { t: 'Inconsistent systems · Nhận ra hệ vô nghiệm', body: `
    <p class="lead2">Trong lúc khử, nếu xuất hiện một hàng dạng:</p>
    ${K('\\begin{bmatrix} 0 & 0 & 0 & | & c \\end{bmatrix},  c \\neq 0')}
    <p class="note">Nghĩa là ${k('0 = c')} với ${k('c \\neq 0')} — mâu thuẫn ⇒ hệ <b>vô nghiệm</b>, dừng ngay, không cần khử tiếp.</p>
    <div class="box warn">Phân biệt với hàng ${k('[0\\ 0\\ 0\\ |\\ 0]')} — hàng này <b>vô hại</b>, chỉ là phương trình thừa (0=0), có thể bỏ.</div>` },

  { t: 'Homogeneous systems · Hệ thuần nhất', body: `
    <p class="lead2">Hệ thuần nhất có mọi vế phải bằng 0:</p>
    ${K('a_1 x_1 + a_2 x_2 + \\cdots + a_n x_n = 0')}
    <div class="box ok"><b>Luôn có nghiệm tầm thường</b> ${k('x_1=x_2=\\cdots=x_n=0')} — không bao giờ vô nghiệm.</div>
    <p class="note">Có <b>nghiệm không tầm thường</b> (khác 0) khi hệ có <b>biến tự do</b> — thường xảy ra nhất khi <b>số ẩn &gt; số phương trình</b>.</p>` },

  { t: 'Summary · Tổng kết chương 5', body: `
    <ol class="big">
      <li>Hệ tuyến tính ⇒ viết ma trận bổ sung ${k('[A|b]')}, khử bằng 3 phép biến đổi sơ cấp</li>
      <li>Khử Gauss ⇒ bậc thang + thế ngược; Gauss-Jordan ⇒ RREF, đọc thẳng nghiệm</li>
      <li>Hàng ${k('[0\\ 0\\ 0\\ |\\ c\\neq 0]')} ⇒ vô nghiệm; còn biến tự do ⇒ vô số nghiệm</li>
      <li>Đủ pivot, không dư hàng mâu thuẫn ⇒ nghiệm duy nhất</li>
      <li>Hệ thuần nhất: luôn có nghiệm 0; ẩn nhiều hơn phương trình ⇒ có nghiệm khác 0</li>
    </ol>` },
];
