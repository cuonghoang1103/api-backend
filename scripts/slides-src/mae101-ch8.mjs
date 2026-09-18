/** MAE101 · Deck mae8 — Chapter 8: Vectors & Linear Transformations. Slide data (rendered by _render-slides.mjs). */
export const deck = { key: 'mae8', code: 'MAE8', title: 'Chapter 8 — Vectors & Linear Transformations', sub: 'MAE101 · Mathematics for Engineering' };

// k('latex')  -> công thức inline ; K('latex') -> công thức lớn giữa slide
const k = (s) => `<span class="tex">${s}</span>`;
const K = (s) => `<div class="texbig">${s}</div>`;

export const slides = [
  { kind: 'cover', t: 'Chapter 8 — Vectors & Linear Transformations', sub: 'Vector & Biến đổi tuyến tính trong không gian R³',
    body: `<p class="cov-meta">MAE101 · Mathematics for Engineering<br/>Nicholson — <i>Linear Algebra with Applications</i></p>` },

  { t: 'Contents · Nội dung chương', body: `
    <ol class="toc">
      <li>Vector trong R²/R³ — toạ độ, biểu diễn hình học, vector đơn vị</li>
      <li>Phép toán vector, tích vô hướng &amp; góc giữa hai vector</li>
      <li>Phép chiếu, đường thẳng trong không gian &amp; khoảng cách</li>
      <li>Tích có hướng &amp; các tính chất hình học của nó</li>
      <li>Phương trình mặt phẳng &amp; tích hỗn tạp</li>
      <li>Biến đổi tuyến tính trong R³ &amp; ứng dụng đồ hoạ máy tính</li>
    </ol>` },

  { t: 'Vectors in R²/R³ · Vector trong không gian', body: `
    <p class="lead2">Vector là đại lượng có <b>hướng &amp; độ lớn</b>, biểu diễn bằng toạ độ:</p>
    ${K('\\vec{v} = (x, y, z) = x\\vec{i} + y\\vec{j} + z\\vec{k}')}
    <p class="note">${k('\\vec{i}=(1,0,0)')}, ${k('\\vec{j}=(0,1,0)')}, ${k('\\vec{k}=(0,0,1)')} là ba <b>vector đơn vị</b> theo 3 trục toạ độ.</p>
    <div class="box">Hình học: vector là mũi tên từ gốc ${k('O')} tới điểm ${k('(x,y,z)')}, hoặc hiệu hai điểm ${k('\\overrightarrow{AB} = B - A')}.</div>` },

  { t: 'Vector operations · Phép toán vector', body: `
    <p class="lead2">Cộng &amp; nhân vô hướng theo từng toạ độ:</p>
    ${K('\\vec{u} \\pm \\vec{v} = (u_1\\pm v_1,\\ u_2\\pm v_2,\\ u_3\\pm v_3),\\quad c\\vec{v} = (cv_1, cv_2, cv_3)')}
    <p class="note">Độ dài (norm) của vector:</p>
    ${K('\\lVert \\vec{v} \\rVert = \\sqrt{x^2+y^2+z^2}')}
    <div class="box ok">Vector đơn vị cùng hướng ${k('\\vec{v}')}: ${k('\\hat{v} = \\vec{v}/\\lVert\\vec{v}\\rVert')}.</div>` },

  { t: 'Dot product · Tích vô hướng', body: `
    <p class="lead2">Tích vô hướng của hai vector cho ra một <b>số thực</b>:</p>
    ${K('\\vec{u}\\cdot\\vec{v} = u_1v_1 + u_2v_2 + u_3v_3')}
    <p class="note">Liên hệ hình học với góc ${k('\\theta')} giữa hai vector:</p>
    ${K('\\vec{u}\\cdot\\vec{v} = \\lVert\\vec{u}\\rVert\\,\\lVert\\vec{v}\\rVert\\cos\\theta')}
    <div class="box">Hai công thức trên bằng nhau — dùng công thức toạ độ để <b>suy ra</b> góc ${k('\\theta')}.</div>` },

  { t: 'Angle & orthogonality · Góc giữa 2 vector & vuông góc', body: `
    ${K('\\cos\\theta = \\dfrac{\\vec{u}\\cdot\\vec{v}}{\\lVert\\vec{u}\\rVert\\,\\lVert\\vec{v}\\rVert}')}
    <div class="box ok">Vuông góc ${k('\\vec{u}\\perp\\vec{v}')} khi và chỉ khi ${k('\\vec{u}\\cdot\\vec{v} = 0')}.</div>
    <p class="lead2">Ví dụ: ${k('\\vec{u}=(1,2,-2)')}, ${k('\\vec{v}=(3,0,1)')} ⇒ ${k('\\vec{u}\\cdot\\vec{v} = 3+0-2 = 1 \\neq 0')} — không vuông góc.</p>` },

  { t: 'Projection · Phép chiếu vector', body: `
    <p class="lead2">Chiếu vuông góc của ${k('\\vec{u}')} lên phương ${k('\\vec{v}')}:</p>
    ${K('\\operatorname{proj}_{\\vec{v}}(\\vec{u}) = \\dfrac{\\vec{u}\\cdot\\vec{v}}{\\lVert\\vec{v}\\rVert^2}\\,\\vec{v}')}
    <div class="steps">
      <div><span class="n">1</span> Cho ${k('\\vec{u}=(3,4,0)')}, ${k('\\vec{v}=(1,0,0)')}</div>
      <div><span class="n">2</span> ${k('\\vec{u}\\cdot\\vec{v} = 3')}, ${k('\\lVert\\vec{v}\\rVert^2 = 1')}</div>
      <div><span class="n">3</span> ${k('\\operatorname{proj}_{\\vec{v}}(\\vec{u}) = 3\\vec{v} = (3,0,0)')}</div>
    </div>` },

  { t: 'Lines in space · Phương trình đường thẳng', body: `
    <p class="lead2">Đường thẳng qua điểm ${k('r_0')} theo hướng ${k('\\vec{d}=(a,b,c)')} — dạng vector:</p>
    ${K('\\vec{r} = \\vec{r}_0 + t\\vec{d},\\quad t\\in\\mathbb{R}')}
    <p class="note">Dạng tham số: ${k('x=x_0+at,\\ y=y_0+bt,\\ z=z_0+ct')}.</p>
    <p class="note">Dạng chính tắc (khi ${k('a,b,c\\neq 0')}): ${k('\\dfrac{x-x_0}{a}=\\dfrac{y-y_0}{b}=\\dfrac{z-z_0}{c}')}</p>` },

  { t: 'Distance point–to–line · Khoảng cách điểm tới đường thẳng', body: `
    <p class="lead2">Đường thẳng qua ${k('P_0')} hướng ${k('\\vec{d}')}, điểm ${k('Q')} ngoài đường thẳng:</p>
    ${K('d = \\dfrac{\\lVert \\overrightarrow{P_0Q} \\times \\vec{d} \\rVert}{\\lVert \\vec{d} \\rVert}')}
    <div class="box">Ý tưởng: diện tích hình bình hành tạo bởi ${k('\\overrightarrow{P_0Q}')} và ${k('\\vec{d}')}, chia cho cạnh đáy ${k('\\lVert\\vec{d}\\rVert')} ⇒ chiều cao chính là khoảng cách.</div>` },

  { t: 'Cross product · Tích có hướng', body: `
    <p class="lead2">Tích có hướng của hai vector trong R³ cho ra <b>một vector mới</b>, tính bằng định thức:</p>
    ${K('\\vec{u}\\times\\vec{v} = \\begin{vmatrix} \\vec{i} & \\vec{j} & \\vec{k} \\\\ u_1 & u_2 & u_3 \\\\ v_1 & v_2 & v_3 \\end{vmatrix}')}
    <div class="box ok">${k('\\vec{u}\\times\\vec{v}')} <b>vuông góc</b> với cả ${k('\\vec{u}')} và ${k('\\vec{v}')} — pháp tuyến của mặt phẳng chứa chúng.</div>` },

  { t: 'Properties of cross product · Tính chất tích có hướng', body: `
    <p class="lead2">Độ lớn liên hệ với góc ${k('\\theta')} giữa hai vector:</p>
    ${K('\\lVert \\vec{u}\\times\\vec{v} \\rVert = \\lVert\\vec{u}\\rVert\\,\\lVert\\vec{v}\\rVert\\sin\\theta = \\text{diện tích hình bình hành}')}
    <div class="grid2">
      <div class="f"><b>Chống giao hoán</b><p>${k('\\vec{u}\\times\\vec{v} = -(\\vec{v}\\times\\vec{u})')}</p></div>
      <div class="f"><b>Song song</b><p>${k('\\vec{u}\\parallel\\vec{v} \\Leftrightarrow \\vec{u}\\times\\vec{v} = \\vec{0}')}</p></div>
    </div>` },

  { t: 'Worked example · Ví dụ tích có hướng & diện tích tam giác', body: `
    <p class="lead2">Cho ${k('\\vec{u}=(1,0,0)')}, ${k('\\vec{v}=(0,1,0)')} — tính ${k('\\vec{u}\\times\\vec{v}')} và diện tích tam giác tạo bởi hai vector:</p>
    <div class="steps">
      <div><span class="n">1</span> ${k('\\vec{u}\\times\\vec{v} = (0\\cdot0-0\\cdot1,\\ 0\\cdot0-1\\cdot0,\\ 1\\cdot1-0\\cdot0) = (0,0,1)')}</div>
      <div><span class="n">2</span> ${k('\\lVert\\vec{u}\\times\\vec{v}\\rVert = 1')} ⇒ diện tích hình bình hành = 1</div>
      <div><span class="n">3</span> Diện tích tam giác = một nửa: ${k('S_{\\triangle} = \\tfrac{1}{2}\\lVert\\vec{u}\\times\\vec{v}\\rVert = 0.5')}</div>
    </div>` },

  { t: 'Planes · Phương trình mặt phẳng', body: `
    <p class="lead2">Mặt phẳng qua điểm ${k('r_0=(x_0,y_0,z_0)')} với pháp tuyến ${k('\\vec{n}=(a,b,c)')}:</p>
    ${K('\\vec{n}\\cdot(\\vec{r}-\\vec{r}_0) = 0 \\ \\Longrightarrow\\ ax+by+cz = d')}
    <p class="note">với ${k('d = ax_0+by_0+cz_0')}. Vector pháp tuyến ${k('\\vec{n}')} luôn <b>vuông góc</b> với mọi vector nằm trong mặt phẳng.</p>
    <div class="box">Tìm ${k('\\vec{n}')} từ 3 điểm không thẳng hàng ${k('A,B,C')}: ${k('\\vec{n} = \\overrightarrow{AB}\\times\\overrightarrow{AC}')}.</div>` },

  { t: 'Distance point–to–plane · Khoảng cách điểm tới mặt phẳng', body: `
    <p class="lead2">Mặt phẳng ${k('ax+by+cz=d')}, điểm ${k('Q=(x_1,y_1,z_1)')}:</p>
    ${K('D = \\dfrac{|ax_1+by_1+cz_1-d|}{\\sqrt{a^2+b^2+c^2}}')}
    <div class="box">Ví dụ: mặt phẳng ${k('x+2y+2z=9')}, điểm ${k('Q=(1,1,1)')} ⇒ ${k('D = \\dfrac{|1+2+2-9|}{\\sqrt{1+4+4}} = \\dfrac{4}{3}')}</div>` },

  { t: 'Scalar triple product · Tích hỗn tạp', body: `
    <p class="lead2">Tích hỗn tạp của ba vector là một <b>số thực</b>:</p>
    ${K('\\vec{u}\\cdot(\\vec{v}\\times\\vec{w}) = \\begin{vmatrix} u_1 & u_2 & u_3 \\\\ v_1 & v_2 & v_3 \\\\ w_1 & w_2 & w_3 \\end{vmatrix}')}
    <div class="box ok">Trị tuyệt đối của tích hỗn tạp = <b>thể tích hình hộp</b> tạo bởi ba vector ${k('\\vec{u},\\vec{v},\\vec{w}')}.</div>
    <p class="note">Ba vector <b>đồng phẳng</b> (coplanar) khi và chỉ khi tích hỗn tạp bằng 0.</p>` },

  { t: 'Linear transformations in R³ · Biến đổi tuyến tính', body: `
    <p class="lead2">Biến đổi tuyến tính ${k('T:\\mathbb{R}^3\\to\\mathbb{R}^3')} biểu diễn bằng ma trận: ${k('T(\\vec{v}) = A\\vec{v}')}.</p>
    <div class="grid3">
      <div class="card"><b>Quay</b><p>quanh trục ${k('z')} góc ${k('\\theta')}</p></div>
      <div class="card"><b>Đối xứng</b><p>qua mặt phẳng ${k('xy')}</p></div>
      <div class="card"><b>Chiếu</b><p>xuống mặt phẳng ${k('xy')}</p></div>
    </div>
    <div class="box">${k('\\det(A)')} chính là <b>hệ số biến đổi thể tích</b> — dấu âm nghĩa là đổi hướng (định hướng).</div>` },

  { t: 'Computer graphics application · Ứng dụng đồ hoạ máy tính & tổng kết', body: `
    <p class="lead2">Đồ hoạ 3D dùng <b>toạ độ thuần nhất</b> ${k('(x,y,z,1)')} để gộp cả quay, tịnh tiến, tỉ lệ vào một phép nhân ma trận ${k('4\\times4')}, ghép nhiều phép biến đổi bằng nhân ma trận liên tiếp.</p>
    <ol class="big">
      <li>Vector: toạ độ, độ dài, tích vô hướng ⇒ góc &amp; vuông góc</li>
      <li>Tích có hướng ⇒ pháp tuyến, diện tích, phương trình mặt phẳng</li>
      <li>Tích hỗn tạp ⇒ thể tích; biến đổi tuyến tính ⇒ nền tảng đồ hoạ 3D</li>
    </ol>` },
];
